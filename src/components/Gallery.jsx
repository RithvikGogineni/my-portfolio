import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';
import { useFirebaseImage } from '../hooks/useFirebaseImage';
import { useGallerySections } from '../hooks/useGallerySections';

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const sectionRef = useRef(null);
  const galleryItemsRef = useRef([]);
  const detailPanelRef = useRef(null);
  
  // Load gallery sections dynamically from Firestore
  const { sections: gallerySections, loading: sectionsLoading, error: sectionsError } = useGallerySections();
  
  // Set active section to first section when sections load
  const [activeSection, setActiveSection] = useState(null);
  
  // Selected image for detail view
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    if (gallerySections.length > 0 && !activeSection) {
      setActiveSection(gallerySections[0].id);
    }
  }, [gallerySections, activeSection]);
  
  // Get active section data
  const activeSectionData = gallerySections.find(s => s.id === activeSection);
  
  // Get images for active section
  const sectionImageFilenames = activeSectionData?.images || [];
  
  // Debug logging
  useEffect(() => {
    if (activeSection) {
      console.log('Active section:', activeSection);
      console.log('Active section data:', activeSectionData);
      console.log('Image filenames:', sectionImageFilenames);
      console.log('Number of images:', sectionImageFilenames.length);
    }
  }, [activeSection, activeSectionData, sectionImageFilenames]);
  
  // Load image metadata (title and description)
  const [imageMetadata, setImageMetadata] = useState({});
  
  useEffect(() => {
    // Load metadata for the active section
    const loadMetadata = async () => {
      try {
        // Try to load from JSON file first (for blender section)
        if (activeSection === 'blender') {
          try {
            const metadata = await import('../data/blenderimages.json');
            const metadataMap = {};
            const data = metadata.default || metadata;
            if (Array.isArray(data)) {
              data.forEach(item => {
                if (item && item.fileName) {
                  metadataMap[item.fileName] = {
                    title: item.title || '',
                    description: item.description || ''
                  };
                }
              });
            }
            setImageMetadata(metadataMap);
          } catch (jsonError) {
            console.warn('Could not load blenderimages.json, using fallback:', jsonError);
            setImageMetadata({});
          }
        } else {
          // For other sections, you can add metadata to Firestore or JSON files
          setImageMetadata({});
        }
      } catch (error) {
        console.error('Error loading image metadata:', error);
        setImageMetadata({});
      }
    };
    
    if (activeSection) {
      loadMetadata();
    }
  }, [activeSection]);

  useEffect(() => {
    // Reset refs array
    galleryItemsRef.current = galleryItemsRef.current.slice(0, sectionImageFilenames.length);
    
    // Track scroll velocity for dynamic animation speed
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let velocityUpdateInterval = null;
    
    const updateVelocity = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
    };
    
    velocityUpdateInterval = setInterval(updateVelocity, 16); // ~60fps
    
    // Gallery items animation with scroll-velocity-based speed
    galleryItemsRef.current.forEach((item, index) => {
      if (item) {
        // Calculate dynamic duration based on scroll velocity
        const baseDuration = 0.8;
        const minDuration = 0.3;
        const maxDuration = 1.5;
        
        // Higher velocity = faster animation (shorter duration)
        const velocityFactor = Math.min(scrollVelocity / 10, 1); // Normalize to 0-1
        const dynamicDuration = baseDuration * (1 - velocityFactor * 0.5);
        const clampedDuration = Math.max(minDuration, Math.min(maxDuration, dynamicDuration));
        
        gsap.fromTo(item,
          { scale: 0, opacity: 0, rotation: -10 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: clampedDuration,
            ease: "back.out(1.7)",
            delay: index * 0.1,
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
              onEnter: () => {
                // Recalculate duration based on current scroll velocity
                const currentVelocity = scrollVelocity;
                const vFactor = Math.min(currentVelocity / 10, 1);
                const dynDuration = baseDuration * (1 - vFactor * 0.5);
                const clamped = Math.max(minDuration, Math.min(maxDuration, dynDuration));
                gsap.to(item, {
                  scale: 1,
                  opacity: 1,
                  rotation: 0,
                  duration: clamped,
                  ease: "back.out(1.7)"
                });
              }
            }
          }
        );

        // Hover effects
        const image = item.querySelector('.gallery-image');
        const overlay = item.querySelector('.gallery-overlay');

        if (image && overlay) {
          item.addEventListener('mouseenter', () => {
            gsap.to(image, {
              scale: 1.1,
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            });
            
            gsap.to(overlay, {
              opacity: 1,
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            });
          });

          item.addEventListener('mouseleave', () => {
            gsap.to(image, {
              scale: 1,
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            });
            
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            });
          });
        }
      }
    });
    
    // Cleanup
    return () => {
      if (velocityUpdateInterval) {
        clearInterval(velocityUpdateInterval);
      }
      // Kill all ScrollTriggers for gallery items
      galleryItemsRef.current.forEach((item) => {
        if (item) {
          ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.vars && trigger.vars.trigger === item) {
              trigger.kill();
            }
          });
        }
      });
    };
  }, [sectionImageFilenames]);

  const openImageDetail = (imageUrl, filename) => {
    if (!imageUrl || !filename) return;
    
    const metadata = imageMetadata[filename] || {};
    setSelectedImage({
      url: imageUrl,
      filename: filename,
      title: metadata.title || filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      description: metadata.description || "No description available."
    });
    
    // Animate panel in
    if (detailPanelRef.current) {
      gsap.fromTo(detailPanelRef.current,
        { x: '100%' },
        {
          x: 0,
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      );
    }
    
    // Prevent body scroll when panel is open
    document.body.style.overflow = 'hidden';
  };

  const closeImageDetail = () => {
    if (detailPanelRef.current) {
      gsap.to(detailPanelRef.current, {
        x: '100%',
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        onComplete: () => {
          setSelectedImage(null);
          document.body.style.overflow = '';
        }
      });
    } else {
      setSelectedImage(null);
      document.body.style.overflow = '';
    }
  };
  
  // Close panel on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        closeImageDetail();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedImage]);

// Gallery Image Item Component
const GalleryImageItem = React.forwardRef(({ sectionId, filename, index, onImageClick }, ref) => {
  const imagePath = `images/gallery/${sectionId}/${filename}`;
  const { imageUrl, loading, error } = useFirebaseImage(imagePath);

  // Debug logging for first few images
  useEffect(() => {
    if (index < 3) {
      console.log(`Image ${index} (${filename}):`, {
        imagePath,
        imageUrl,
        loading,
        error: error?.message
      });
    }
  }, [imagePath, imageUrl, loading, error, filename, index]);

  const handleClick = () => {
    if (imageUrl) {
      onImageClick(imageUrl, filename);
    }
  };

  return (
    <motion.div
      ref={ref}
      className="gallery-item"
      variants={fadeInUp}
      data-image={imageUrl}
      data-filename={filename}
      onClick={handleClick}
    >
      <div className="gallery-image-container">
        {loading ? (
          <div className="gallery-image-loading">
            <div className="loading-spinner"></div>
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.7 }}>
              Loading...
            </p>
          </div>
        ) : error ? (
          <div className="gallery-image-error" style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--color-accent-secondary)',
            fontSize: '0.875rem'
          }}>
            <p>Failed to load</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
              {filename}
            </p>
          </div>
        ) : imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={filename || 'Gallery image'}
              className="gallery-image"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                console.error('Image load error for:', filename, imageUrl);
                e.target.src = '/placeholder-image.png';
              }}
              onLoad={() => {
                if (index < 3) {
                  console.log(`Image ${index} loaded successfully:`, filename);
                }
              }}
            />
            <div className="gallery-overlay">
              <div className="gallery-content-overlay">
                <div className="gallery-zoom-icon">👁️</div>
                <p className="gallery-view-text">View Details</p>
              </div>
            </div>
          </>
        ) : (
          <div className="gallery-image-error" style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '0.875rem'
          }}>
            <p>No image URL</p>
          </div>
        )}
      </div>
    </motion.div>
  );
});

GalleryImageItem.displayName = 'GalleryImageItem';

  return (
    <section ref={sectionRef} className="gallery-section section" id="gallery">
      <div className="container">
        <motion.div
          className="gallery-content"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Project Gallery</h2>
            <p className="section-subtitle">
              Visual showcase of my work and creative process
            </p>
          </motion.div>

          {/* Section Tabs */}
          {sectionsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              Loading gallery sections...
            </div>
          ) : sectionsError ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-accent-primary)' }}>
              Error loading gallery sections. Please check your Firestore setup.
            </div>
          ) : gallerySections.length > 0 ? (
            <motion.div 
              className="gallery-section-tabs"
              variants={fadeInUp}
            >
              {gallerySections.map((section, index) => (
                <button
                  key={`${section.id}-${index}`}
                  className={`gallery-tab ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.title || section.id}
                </button>
              ))}
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              No gallery sections found. Add sections to Firestore.
            </div>
          )}

          {/* Active Section Info */}
          {activeSectionData && (
            <motion.div 
              className="gallery-section-info"
              variants={fadeInUp}
              key={`section-info-${activeSection}`}
            >
              <h3 className="gallery-section-title">{activeSectionData.title || activeSectionData.id}</h3>
              {activeSectionData.description && (
                <p className="gallery-section-description">{activeSectionData.description}</p>
              )}
            </motion.div>
          )}

          {/* Gallery Grid */}
          {activeSection ? (
            <motion.div 
              className="gallery-grid"
              variants={staggerContainer}
              key={`gallery-grid-${activeSection}`}
            >
              {sectionImageFilenames.length > 0 ? (
                sectionImageFilenames.map((filename, index) => (
                  <GalleryImageItem
                    key={`${activeSection}-${filename}-${index}`}
                    index={index}
                    sectionId={activeSection}
                    filename={filename}
                    ref={el => {
                      if (el) {
                        galleryItemsRef.current[index] = el;
                      }
                    }}
                    onImageClick={(imageUrl, filename) => openImageDetail(imageUrl, filename)}
                  />
                ))
              ) : (
                <div className="gallery-empty-state">
                  <p>No images in this section yet.</p>
                  <p className="gallery-empty-hint">
                    Add image filenames to the `images` array in Firestore for the "{activeSection}" section.
                    <br />
                    Then upload the actual image files to Firebase Storage at: <code>images/gallery/{activeSection}/</code>
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="gallery-empty-state">
              <p>Loading gallery sections...</p>
            </div>
          )}

          {/* Image Detail Panel */}
          {selectedImage && (
            <>
              <div 
                className="gallery-detail-overlay" 
                onClick={(e) => {
                  // Only close if clicking the overlay itself, not children
                  if (e.target === e.currentTarget) {
                    closeImageDetail();
                  }
                }}
              ></div>
              <motion.div
                ref={detailPanelRef}
                className="gallery-detail-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="gallery-detail-close" onClick={closeImageDetail}>×</button>
                
                <div className="gallery-detail-content">
                  <div className="gallery-detail-image-container">
                    <img 
                      src={selectedImage.url} 
                      alt={selectedImage.title}
                      className="gallery-detail-image"
                    />
                  </div>
                  
                  <div className="gallery-detail-info">
                    <h2 className="gallery-detail-title">{selectedImage.title}</h2>
                    <p className="gallery-detail-description">{selectedImage.description}</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
