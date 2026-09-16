// Project Card component. project.image is a bundled asset URL (see
// data/projects.js), so there is no network round-trip and no loading state.
import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';

const ProjectCard = ({ project, index }) => {
  return (
    <m.div
      className="project-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/projects/${project.id}`} className="project-link">
        <div className="project-image-container">
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
    </m.div>
  );
};

export default ProjectCard;

