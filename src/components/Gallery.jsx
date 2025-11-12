import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';
import { gallerySections } from '../data/gallery';
import { useFirebaseImage } from '../hooks/useFirebaseImage';

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const sectionRef = useRef(null);
  const galleryItemsRef = useRef([]);
  const lightboxRef = useRef(null);
  const [activeSection, setActiveSection] = useState('blender');
  
  // Get images for active section from gallery data
  const activeSectionData = gallerySections.find(s => s.id === activeSection);
  
  // Get image filenames for each section
  const getSectionImageFilenames = (sectionId) => {
    const imageMap = {
      blender: [
        '2d858e8d-1d66-43d9-8cba-41def5677647.JPG',
        '2eaf52b8-d0ac-4859-b87d-44cc0518b410.JPG',
        '43b8739b-9205-4072-bcf8-facb6b1488fe.JPG',
        '4ba1bc90-c730-42b4-8279-36c56cc34e66.JPG',
        '66198834-5bf7-496a-89b5-c9803b73208a.JPG',
        '70c26b65-38e2-4bcf-b5a4-a80acaf708e2.JPG',
        '962fe520-6a66-4472-aff6-0cb63c5b503b.JPG',
        'IMG_3067.JPG',
        'IMG_3068.JPG',
        'IMG_3069.JPG',
        'IMG_3070.JPG',
        'IMG_3076.JPG',
        'IMG_3077.JPG',
        'IMG_3078.JPG',
        'IMG_3079.JPG',
        'IMG_3080.JPG',
        'IMG_3144.JPG',
        'IMG_3145.JPG',
        'IMG_3146.JPG',
        'IMG_3147.JPG',
        'IMG_3148.JPG',
        'IMG_3150.JPG',
        'IMG_3151.JPG',
        'IMG_3152.JPG',
        'IMG_3153.JPG',
        'IMG_3154.JPG',
        'IMG_3155.JPG',
        'IMG_3156.JPG',
        'IMG_3157.JPG',
        'IMG_3158.JPG',
        'IMG_3159.JPG',
        'IMG_3160.JPG',
        'IMG_3161.JPG',
        'PHOTO-2023-08-08-00-07-09.jpg',
        'PHOTO-2023-08-08-00-07-10 2.jpg',
        'PHOTO-2023-08-08-00-07-10.jpg',
        'PHOTO-2023-09-01-14-04-53.jpg',
        'PHOTO-2023-09-01-14-05-13.jpg',
        'PHOTO-2023-09-02-12-31-15.jpg',
        'PHOTO-2023-09-02-12-37-37 2.jpg',
        'PHOTO-2023-09-02-12-37-37.jpg',
        'PHOTO-2024-04-24-15-35-47.jpg',
        'PHOTO-2024-05-01-13-39-14.jpg',
        'PHOTO-2024-09-20-11-56-50.jpg',
        'PHOTO-2024-11-26-13-39-50.jpg',
        'bfb4706a-5dad-432c-ba7e-ba380b1b59dc.JPG',
        'e0c269b7-ef47-4bf0-9c3a-39d2fe2b41f0.JPG',
        'edb665a6-7572-4b81-9843-5282dc33d4a6.JPG',
        'f1804f49-5ca5-4f49-be05-2061d1bc6eb3.JPG',
        'f7533455-a4cc-4906-8443-14bf0d30c1fe.JPG'
      ],
      robotics: [],
      competition: [],
      engineering: [],
      leadership: [],
      education: []
    };
    return imageMap[sectionId] || [];
  };

  const sectionImageFilenames = getSectionImageFilenames(activeSection);

  useEffect(() => {
    // Gallery items animation
    galleryItemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.fromTo(item,
          { scale: 0, opacity: 0, rotation: -10 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: index * 0.1,
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Hover effects
        const image = item.querySelector('.gallery-image');
        const overlay = item.querySelector('.gallery-overlay');

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

        // Click to open lightbox
        item.addEventListener('click', () => {
          openLightbox(item.dataset.image, item.dataset.title);
        });
      }
    });
  }, []);

  const openLightbox = (imageSrc, title) => {
    if (lightboxRef.current) {
      const lightbox = lightboxRef.current;
      const lightboxImage = lightbox.querySelector('.lightbox-image');
      const lightboxTitle = lightbox.querySelector('.lightbox-title');
      
      lightboxImage.src = imageSrc;
      lightboxTitle.textContent = title;
      
      gsap.to(lightbox, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      });
    }
  };

  const closeLightbox = () => {
    if (lightboxRef.current) {
      gsap.to(lightboxRef.current, {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      });
    }
  };

// Gallery Image Item Component
const GalleryImageItem = React.forwardRef(({ sectionId, filename, index, onImageClick }, ref) => {
  const imagePath = `images/gallery/${sectionId}/${filename}`;
  const { imageUrl, loading } = useFirebaseImage(imagePath);
  const title = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

  const handleClick = () => {
    if (imageUrl) {
      onImageClick(imageUrl, title);
    }
  };

  return (
    <motion.div
      ref={ref}
      className="gallery-item"
      variants={fadeInUp}
      data-image={imageUrl}
      data-title={title}
      onClick={handleClick}
    >
      <div className="gallery-image-container">
        {loading ? (
          <div className="gallery-image-loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <img 
              src={imageUrl || '/placeholder-image.png'} 
              alt={title}
              className="gallery-image"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.src = '/placeholder-image.png';
              }}
            />
            <div className="gallery-overlay">
              <div className="gallery-content-overlay">
                <h3 className="gallery-item-title">{title}</h3>
                <p className="gallery-item-category">{gallerySections.find(s => s.id === sectionId)?.title}</p>
                <div className="gallery-zoom-icon">🔍</div>
              </div>
            </div>
          </>
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
          <motion.div 
            className="gallery-section-tabs"
            variants={fadeInUp}
          >
            {gallerySections.map((section) => (
              <button
                key={section.id}
                className={`gallery-tab ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.title}
              </button>
            ))}
          </motion.div>

          {/* Active Section Info */}
          {activeSectionData && (
            <motion.div 
              className="gallery-section-info"
              variants={fadeInUp}
              key={activeSection}
            >
              <h3 className="gallery-section-title">{activeSectionData.title}</h3>
              <p className="gallery-section-description">{activeSectionData.description}</p>
            </motion.div>
          )}

          {/* Gallery Grid */}
          <motion.div 
            className="gallery-grid"
            variants={staggerContainer}
            key={activeSection}
          >
            {sectionImageFilenames.length > 0 ? (
              sectionImageFilenames.map((filename, index) => (
                <GalleryImageItem
                  key={`${activeSection}-${filename}-${index}`}
                  index={index}
                  sectionId={activeSection}
                  filename={filename}
                  ref={el => galleryItemsRef.current[index] = el}
                  onImageClick={(imageUrl, title) => openLightbox(imageUrl, title)}
                />
              ))
            ) : (
              <div className="gallery-empty-state">
                <p>No images in this section yet.</p>
                <p className="gallery-empty-hint">
                  Add image filenames to the gallery data to display them here.
                </p>
              </div>
            )}
          </motion.div>

          {/* Lightbox */}
          <div ref={lightboxRef} className="lightbox" onClick={closeLightbox}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" onClick={closeLightbox}>×</button>
              <img className="lightbox-image" alt="" />
              <h3 className="lightbox-title"></h3>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
