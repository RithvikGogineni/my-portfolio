import React from 'react';
import { m } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useActiveSection } from '../hooks/useActiveSection';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' }
];
const ids = sections.map((s) => s.id);

const SectionNav = () => {
  const location = useLocation();
  const isVisible = location.pathname === '/';
  const activeSection = useActiveSection(ids, isVisible);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    // Let Lenis drive the scroll when it's running, so the two don't fight.
    if (window.lenis) {
      window.lenis.scrollTo(element, { offset: -80 });
    } else {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <m.div
      className="section-nav"
      // opacity only: the element's CSS transform centers it vertically
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <nav className="section-nav-list">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`section-nav-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => scrollToSection(section.id)}
            aria-label={`Jump to ${section.label}`}
            aria-current={activeSection === section.id ? 'true' : undefined}
          >
            <span className="section-nav-dot"></span>
            <span className="section-nav-label">{section.label}</span>
          </button>
        ))}
      </nav>
    </m.div>
  );
};

export default SectionNav;

