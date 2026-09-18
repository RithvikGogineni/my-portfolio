import React, { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Reveal, RevealItem, SectionHeader } from '../animations/motion';
import { EASE } from '../animations/variants';
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

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = useMemo(() =>
    activeFilter === 'all'
      ? projectsData
      : projectsData.filter(p => p.category === activeFilter),
    [activeFilter]
  );

  return (
    <section className="projects-section section" id="projects">
      <div className="container">
        <div className="projects-content">
          <SectionHeader
            title="My Projects"
            subtitle="Robots, platforms, and client work: what I built and what it did"
          />

          <Reveal className="project-filters" step={0.05} role="group" aria-label="Filter projects">
            {categoryDefs.map((c) => (
              <RevealItem
                as="button"
                key={c.id}
                className={`filter-btn ${activeFilter === c.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(c.id)}
                aria-pressed={activeFilter === c.id}
              >
                {c.label}
              </RevealItem>
            ))}
          </Reveal>

          {/* Grid re-staggers on each filter change; cards cross-fade out first. */}
          <AnimatePresence mode="wait">
            <m.div
              className="projects-grid"
              key={activeFilter}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.2, ease: 'easeIn' } }}
            >
              {filteredProjects.map((project, index) => (
                // Each card reveals as it scrolls in; cards in the same row
                // are offset slightly so a row reads left-to-right.
                <m.div
                  key={project.id}
                  className="project-card"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                  transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.08 }}
                >
                  <Link to={`/projects/${project.id}`} className="project-card-link">
                    <div className="project-image-container">
                      <ProjectImage project={project} />
                      <div className="project-overlay">
                        <div className="project-links">
                          <span className="project-link">View Details →</span>
                        </div>
                      </div>
                    </div>

                    <div className="project-content">
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-description">{project.description}</p>
                      <div className="project-technologies">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </m.div>
              ))}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Projects;
