import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp } from '../animations/framerVariants';
import { projects } from '../data/projects';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === parseInt(id));

  if (!project) {
    return (
      <main className="main-content">
        <div className="container">
          <h1>Project not found</h1>
          <Link to="/projects">Back to Projects</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <motion.div
        className="project-detail-hero"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="container">
          <motion.button
            className="back-button"
            onClick={() => navigate(-1)}
            whileHover={{ x: -6 }}
          >
            ← Back
          </motion.button>
          
          <div className="project-detail-header">
            <div className="project-detail-image">
              <img 
                src={project.image} 
                alt={project.title}
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="project-detail-info">
              <span className="project-category-badge">{project.category}</span>
              <h1 className="project-detail-title">{project.title}</h1>
              <p className="project-detail-description">{project.description}</p>
              
              <div className="project-detail-technologies">
                <h3>Technologies Used</h3>
                <div className="tech-tags-list">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="project-detail-actions">
                {project.liveUrl !== '#' && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Live Demo →
                  </motion.a>
                )}
                {project.githubUrl !== '#' && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View on GitHub ↗
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <section className="section project-detail-content">
        <div className="container">
          <div className="project-detail-body">
            <h2>Project Overview</h2>
            <p>
              This project represents a significant milestone in my journey as a robotics engineer and developer. 
              Through careful planning, iterative design, and collaborative problem-solving, I was able to deliver 
              a solution that meets both technical requirements and user needs.
            </p>
            
            <h3>Key Features</h3>
            <ul>
              <li>Advanced mechanical design optimized for performance</li>
              <li>Robust control systems with real-time feedback</li>
              <li>User-friendly interface and documentation</li>
              <li>Scalable architecture for future enhancements</li>
            </ul>

            <h3>Challenges & Solutions</h3>
            <p>
              One of the main challenges was balancing precision with speed. Through extensive testing and 
              iteration, I developed a solution that maintains accuracy while meeting performance targets.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProjectDetailPage;
