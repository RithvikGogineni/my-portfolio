import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const sectionRef = useRef(null);
  const galleryItemsRef = useRef([]);
  const lightboxRef = useRef(null);

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

  const galleryItems = [
    {
      id: 1,
      title: "FTC Team Build Session",
      image: "/src/assets/images/gallery/ftc-build-session.jpg",
      category: "Robotics"
    },
    {
      id: 2,
      title: "Robot Competition Action",
      image: "/src/assets/images/gallery/robot-competition.jpg",
      category: "Competition"
    },
    {
      id: 3,
      title: "CAD Design Work",
      image: "/src/assets/images/gallery/cad-design.jpg",
      category: "Engineering"
    },
    {
      id: 4,
      title: "Team Mentorship",
      image: "/src/assets/images/gallery/mentorship.jpg",
      category: "Leadership"
    },
    {
      id: 5,
      title: "Award Ceremony",
      image: "/src/assets/images/gallery/award-ceremony.jpg",
      category: "Achievement"
    },
    {
      id: 6,
      title: "Workshop Teaching",
      image: "/src/assets/images/gallery/workshop-teaching.jpg",
      category: "Education"
    }
  ];

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

          {/* Gallery Grid */}
          <motion.div 
            className="gallery-grid"
            variants={staggerContainer}
          >
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                ref={el => galleryItemsRef.current[index] = el}
                className="gallery-item"
                variants={fadeInUp}
                data-image={item.image}
                data-title={item.title}
              >
                <div className="gallery-image-container">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="gallery-image"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="gallery-overlay">
                    <div className="gallery-content-overlay">
                      <h3 className="gallery-item-title">{item.title}</h3>
                      <p className="gallery-item-category">{item.category}</p>
                      <div className="gallery-zoom-icon">🔍</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
