import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { reveal as fadeInUp, stagger } from '../animations/variants';
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
      <m.div
        className="project-detail-hero"
        initial="hidden"
        animate="show"
        variants={fadeInUp}
      >
        <div className="container">
          <m.button
            className="back-button"
            onClick={() => navigate(-1)}
            whileHover={{ x: -6 }}
          >
            ← Back
          </m.button>
          
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
              {project.role && <p className="project-detail-role">{project.role}</p>}
              <p className="project-detail-description">{project.description}</p>
              
              <div className="project-detail-technologies">
                <h2>Technologies Used</h2>
                <div className="tech-tags-list">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="project-detail-actions">
                {project.liveUrl !== '#' && (
                  <m.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Visit live site ↗
                  </m.a>
                )}
                {project.githubUrl !== '#' && (
                  <m.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    View on GitHub ↗
                  </m.a>
                )}
              </div>
            </div>
          </div>
        </div>
      </m.div>

      {project.highlights && (
        <section className="section project-detail-content">
          <div className="container">
            <m.div
              className="project-detail-body"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger(0.08)}
            >
              <m.h2 variants={fadeInUp}>What I did</m.h2>
              <ul>
                {project.highlights.map((item) => (
                  <m.li key={item} variants={fadeInUp}>{item}</m.li>
                ))}
              </ul>
            </m.div>
          </div>
        </section>
      )}
    </main>
  );
};

export default ProjectDetailPage;
