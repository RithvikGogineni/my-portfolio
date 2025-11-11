import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp } from '../animations/framerVariants';
import { projects as projectsData, categories as categoryDefs } from '../data/projects';

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filteredProjects = activeFilter === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === activeFilter);

  return (
    <main className="main-content">
      <motion.div
        className="page-hero"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            A collection of projects showcasing robotics, web development, and design work
          </p>
        </div>
      </motion.div>

      <section className="section">
        <div className="container">
          {/* Filter Buttons */}
          <div className="project-filters centered">
            {categoryDefs.map((c) => (
              <motion.button
                key={c.id}
                className={`filter-btn ${activeFilter === c.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(c.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {c.label}
              </motion.button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="projects-grid centered-grid">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Link to={`/projects/${project.id}`} className="project-card-link">
                  <div className="project-media">
                    <img src={project.image} alt={project.title} className="project-image" loading="lazy" />
                  </div>
                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-technologies">
                      {project.technologies.map((t) => (
                        <span key={t} className="tech-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProjectsPage;
