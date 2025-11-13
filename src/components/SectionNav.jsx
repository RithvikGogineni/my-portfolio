import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SectionNav = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(false);

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' }
  ];

  // Only show on home page
  useEffect(() => {
    setIsVisible(location.pathname === '/');
  }, [location.pathname]);

  // Track active section on scroll
  useEffect(() => {
    if (!isVisible) return;

    const triggers = [];
    
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        triggers.push(ScrollTrigger.create({
          trigger: element,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActiveSection(section.id),
          onEnterBack: () => setActiveSection(section.id)
        }));
      }
    });

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, [isVisible]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="section-nav"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <nav className="section-nav-list">
        {sections.map((section, index) => (
          <motion.button
            key={section.id}
            className={`section-nav-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => scrollToSection(section.id)}
            whileHover={{ scale: 1.2, x: -4 }}
            whileTap={{ scale: 0.9 }}
            title={section.label}
          >
            <span className="section-nav-dot"></span>
            <span className="section-nav-label">{section.label}</span>
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
};

export default SectionNav;

