import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects, categories } from '../data/projects';

const ProjectsCategory = () => {
  const { categoryId } = useParams();

  const filtered = useMemo(() => {
    if (!categoryId || categoryId === 'all') return projects;
    return projects.filter((p) => p.category === categoryId);
  }, [categoryId]);

  const activeCategory = categories.find((c) => c.id === (categoryId || 'all')) || categories[0];


  return (
    <section className="section" id="projects">
      <div className="container">
        <motion.div
          className="section-header centered"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="section-title">Projects — {activeCategory.label}</h2>
          <p className="section-subtitle">Explore by category</p>
        </motion.div>

        <div className="projects-filter centered">
          {categories.map((c) => (
            <Link key={c.id} to={`/projects/${c.id}`} className={`filter-chip ${c.id === (categoryId || 'all') ? 'active' : ''}`}>
              {c.label}
            </Link>
          ))}
        </div>

        <div className="projects-grid centered-grid">
          {filtered.map((project) => (
            <motion.div
              key={project.id}
              className="project-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsCategory;
