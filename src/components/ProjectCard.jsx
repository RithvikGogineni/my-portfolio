// Project Card component with Firebase image loading
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFirebaseImage } from '../hooks/useFirebaseImage';

const ProjectCard = ({ project, index }) => {
  const { imageUrl, loading } = useFirebaseImage(
    project.image,
    // Fallback to local path if Firebase fails
    project.image?.startsWith('/') ? project.image : null
  );

  return (
    <motion.div
      className="project-card"
      ref={(el) => {
        // This ref will be handled by parent component for animations
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/projects/${project.id}`} className="project-link">
        <div className="project-image-container">
          {loading ? (
            <div className="project-image-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <img
              src={imageUrl || '/placeholder-image.png'}
              alt={project.title}
              className="project-image"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.src = '/placeholder-image.png';
              }}
            />
          )}
          <div className="project-overlay">
            <span className="project-overlay-text">View Details</span>
          </div>
        </div>
        
        <div className="project-content">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-description">{project.description}</p>
          <div className="project-technologies">
            {project.technologies.map((tech, idx) => (
              <span key={idx} className="tech-tag">{tech}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;

