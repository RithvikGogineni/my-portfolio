import React, { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { EASE } from '../animations/variants';

export const RESUME_URL = '/Rithvik-Gogineni-Resume.pdf';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  // Solid background once the page has scrolled; styling lives in CSS
  // (.navbar.scrolled) so it follows the theme without JS.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Set active section based on current route
    const path = location.pathname;
    if (path === '/') {
      setActiveSection('home');
    } else {
      const section = path.slice(1).split('/')[0];
      setActiveSection(section);
    }
  }, [location]);


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className={`navbar ${scrolled || isMenuOpen ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={scrollToTop}>
          <span className="logo-text">Rithvik Gogineni</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.id === 'home' ? '/' : `/${item.id}`}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={scrollToTop}
            >
              {item.label}
            </Link>
          ))}
          <a href={RESUME_URL} className="nav-resume" target="_blank" rel="noopener noreferrer">
            Resume
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <m.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <m.div
              className="mobile-menu-content"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
            >
              {navItems.map((item) => (
                <m.div
                  key={item.id}
                  variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } } }}
                >
                <Link
                  to={item.id === 'home' ? '/' : `/${item.id}`}
                  className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    scrollToTop();
                  }}
                >
                  {item.label}
                </Link>
                </m.div>
              ))}
              <a href={RESUME_URL} className="mobile-nav-link" target="_blank" rel="noopener noreferrer">
                Resume ↗
              </a>
              <div className="mobile-theme-toggle">
                <ThemeToggle />
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
