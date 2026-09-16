import React, { useEffect, useRef, useState, useMemo } from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp, cardVariants } from '../animations/framerVariants';
import { projects as projectsData, categories as categoryDefs } from '../data/projects';

// project.image is a bundled asset URL (see data/projects.js) — no fetch needed.
const ProjectImage = ({ project }) => (
  <img
    src={project.image}
    alt={project.title}
    className="project-image"
    loading="lazy"
    decoding="async"
    onError={(e) => {
      e.target.src = '/placeholder-image.svg';
    }}
  />
);

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const projectCardsRef = useRef([]);
  const filterButtonsRef = useRef([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = useMemo(() => 
    activeFilter === 'all' 
      ? projectsData 
      : projectsData.filter(p => p.category === activeFilter),
    [activeFilter]
  );

  useEffect(() => {
    // Reset refs array
    projectCardsRef.current = projectCardsRef.current.slice(0, filteredProjects.length);
    
    // Project cards animation
    projectCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(card,
          { y: 100, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Card hover effects
        const cardImage = card.querySelector('.project-image');
        const cardOverlay = card.querySelector('.project-overlay');
        const cardContent = card.querySelector('.project-content');

        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
          });
          
          gsap.to(cardImage, {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
          });
          
          gsap.to(cardOverlay, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
          
          gsap.to(cardContent, {
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
          
          gsap.to(cardImage, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
          
          gsap.to(cardOverlay, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
          
          gsap.to(cardContent, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      }
    });

    // Filter buttons animation
    filterButtonsRef.current.forEach((button, index) => {
      if (button) {
        gsap.fromTo(button,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            delay: index * 0.1,
            scrollTrigger: {
              trigger: button,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });
  }, [filteredProjects]);

  return (
    <section ref={sectionRef} className="projects-section section" id="projects">
      <div className="container">
        <m.div
          className="projects-content"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <m.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">My Projects</h2>
            <p className="section-subtitle">
              A collection of projects that showcase my skills and passion for development
            </p>
          </m.div>

          {/* Filter Buttons */}
          <m.div 
            className="project-filters"
            variants={fadeInUp}
          >
            {categoryDefs.map((c, index) => (
              <m.button
                key={c.id}
                ref={el => filterButtonsRef.current[index] = el}
                className={`filter-btn ${activeFilter === c.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(c.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {c.label}
              </m.button>
            ))}
          </m.div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <m.div 
              className="projects-empty"
              variants={fadeInUp}
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: 'var(--color-text-muted)'
              }}
            >
              <p>No projects found in this category.</p>
            </m.div>
          ) : (
            <m.div 
              className="projects-grid"
              variants={staggerContainer}
              key={activeFilter}
            >
              {filteredProjects.map((project, index) => (
              <m.div
                key={project.id}
                ref={el => projectCardsRef.current[index] = el}
                className="project-card"
                variants={cardVariants}
                whileHover="hover"
              >
                <Link to={`/projects/${project.id}`} className="project-card-link">
                  <div className="project-image-container">
                    <ProjectImage project={project} />
                    <div className="project-overlay">
                      <div className="project-links">
                        <span className="project-link">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    
                    <div className="project-technologies">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </m.div>
            ))}
            </m.div>
          )}

        </m.div>
      </div>
    </section>
  );
};

export default Projects;
