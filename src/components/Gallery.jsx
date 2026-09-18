import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { reveal as fadeInUp, stagger, EASE } from '../animations/variants';
const staggerContainer = stagger(0.06);
import { useFirebaseImage } from '../hooks/useFirebaseImage';
import { useGallerySections } from '../hooks/useGallerySections';


// Gallery Image Item Component
// NOTE: must stay at module scope. Declaring it inside Gallery gives it a new
// component identity on every render, which remounts the whole grid and
// restarts every image fetch from scratch.
const GalleryImageItem = React.memo(React.forwardRef(({ sectionId, filename, index, onImageClick }, ref) => {
  const imagePath = `images/gallery/${sectionId}/${filename}`;
  const { imageUrl, loading, error } = useFirebaseImage(imagePath);

  // the <img> itself can still 404 after we resolve a URL
  const [broken, setBroken] = useState(false);
  useEffect(() => { setBroken(false); }, [imageUrl]);

  const handleClick = useCallback(() => {
    if (imageUrl) {
      onImageClick(imageUrl, filename);
    }
  }, [imageUrl, filename, onImageClick]);

  return (
    <m.div
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
        ) : imageUrl && !broken ? (
          <>
            <img 
              src={imageUrl} 
              alt={filename || 'Gallery image'}
              className="gallery-image"
              loading={index < 3 ? 'eager' : 'lazy'}
              fetchPriority={index < 3 ? 'high' : 'auto'}
              decoding="async"
              onError={() => {
                if (import.meta.env.DEV) {
                  console.error('Image load error for:', filename, imageUrl);
                }
                setBroken(true);
              }}
            />
            <div className="gallery-overlay">
              <div className="gallery-content-overlay">
                <div className="gallery-zoom-icon"><FaEye /></div>
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
    </m.div>
  );
}));

GalleryImageItem.displayName = 'GalleryImageItem';

const Gallery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the gallery page
  const isGalleryPage = location.pathname === '/gallery';
  
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
  
  // Get active section data (memoized)
  const activeSectionData = useMemo(() => 
    gallerySections.find(s => s.id === activeSection),
    [gallerySections, activeSection]
  );
  
  // Get images for active section (memoized)
  const sectionImageFilenames = useMemo(() => 
    activeSectionData?.images || [],
    [activeSectionData]
  );
  
  // Pagination state - show 6 images initially on home page, all on gallery page
  const [visibleCount, setVisibleCount] = useState(6);
  const imagesToShow = useMemo(() => 
    isGalleryPage 
      ? sectionImageFilenames  // Show all images on gallery page
      : sectionImageFilenames.slice(0, visibleCount),  // Show 6 on home page
    [isGalleryPage, sectionImageFilenames, visibleCount]
  );
  const hasMore = useMemo(() => 
    !isGalleryPage && sectionImageFilenames.length > visibleCount,
    [isGalleryPage, sectionImageFilenames.length, visibleCount]
  );
  
  // Reset visible count when section changes (only on home page)
  useEffect(() => {
    if (!isGalleryPage) {
      setVisibleCount(6);
    }
  }, [activeSection, isGalleryPage]);
  
  const handleShowMore = useCallback(() => {
    // Only redirect to gallery page (button only shows on home page)
    navigate('/gallery');
  }, [navigate]);
  
  // Debug logging (only in development)
  useEffect(() => {
    if (import.meta.env.DEV && activeSection) {
      console.log('Active section:', activeSection);
      console.log('Active section data:', activeSectionData);
      console.log('Image filenames:', sectionImageFilenames);
      console.log('Number of images:', sectionImageFilenames.length);
      console.log('Visible count:', visibleCount);
    }
  }, [activeSection, activeSectionData, sectionImageFilenames, visibleCount]);
  
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


  const openImageDetail = useCallback((imageUrl, filename) => {
    if (!imageUrl || !filename) return;
    
    const metadata = imageMetadata[filename] || {};
    setSelectedImage({
      url: imageUrl,
      filename: filename,
      title: metadata.title || filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      description: metadata.description || "No description available."
    });
    
    // Prevent body scroll when panel is open
    document.body.style.overflow = 'hidden';
  }, [imageMetadata]);

  const closeImageDetail = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = '';
  }, []);
  
  // Close panel on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        closeImageDetail();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedImage, closeImageDetail]);


  // Until the gallery has content, the home page skips the section entirely
  // and the gallery page shows a short note instead of setup instructions.
  const nothingToShow = !sectionsLoading && (sectionsError || gallerySections.length === 0);
  if (nothingToShow && !isGalleryPage) return null;

  return (
    <section className="gallery-section section" id="gallery">
      <div className="container">
        <m.div
          className="gallery-content"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Section Header */}
          <m.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Project Gallery</h2>
            <p className="section-subtitle">
              Visual showcase of my work and creative process
            </p>
          </m.div>

          {/* Section Tabs */}
          {sectionsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              Loading gallery sections...
            </div>
          ) : nothingToShow ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              Photos are on the way. In the meantime, see the <a href="/projects">projects</a>.
            </div>
          ) : gallerySections.length > 0 ? (
            <m.div 
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
            </m.div>
          ) : null}

          {/* Active Section Info */}
          {activeSectionData && (
            <m.div 
              className="gallery-section-info"
              variants={fadeInUp}
              key={`section-info-${activeSection}`}
            >
              <h3 className="gallery-section-title">{activeSectionData.title || activeSectionData.id}</h3>
              {activeSectionData.description && (
                <p className="gallery-section-description">{activeSectionData.description}</p>
              )}
            </m.div>
          )}

          {/* Gallery Grid */}
          {activeSection ? (
            <>
              <m.div 
                className="gallery-grid"
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                key={`gallery-grid-${activeSection}`}
              >
                {imagesToShow.length > 0 ? (
                  imagesToShow.map((filename, index) => (
                    <GalleryImageItem
                      key={`${activeSection}-${filename}-${index}`}
                      index={index}
                      sectionId={activeSection}
                      filename={filename}
                      onImageClick={(imageUrl, filename) => openImageDetail(imageUrl, filename)}
                    />
                  ))
                ) : (
                  <div className="gallery-empty-state">
                    <p>No images in this section yet.</p>
                  </div>
                )}
              </m.div>
              
              {/* Show More Button - Only on home page */}
              {hasMore && (
                <m.div
                  className="gallery-show-more"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button 
                    className="btn btn-secondary"
                    onClick={handleShowMore}
                  >
                    View Full Gallery
                  </button>
                </m.div>
              )}
            </>
          ) : sectionsLoading ? (
            <div className="gallery-empty-state">
              <p>Loading gallery sections...</p>
            </div>
          ) : null}

          {/* Image Detail Panel */}
          <AnimatePresence>
          {selectedImage && (
            <>
              <m.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="gallery-detail-overlay" 
                onClick={(e) => {
                  // Only close if clicking the overlay itself, not children
                  if (e.target === e.currentTarget) {
                    closeImageDetail();
                  }
                }}
              ></m.div>
              <m.div
                key="panel"
                className="gallery-detail-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.45, ease: EASE }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="gallery-detail-close" onClick={closeImageDetail} aria-label="Close">×</button>
                
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
              </m.div>
            </>
          )}
          </AnimatePresence>
        </m.div>
      </div>
    </section>
  );
};

export default Gallery;
