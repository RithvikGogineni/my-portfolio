import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navbarRef = useRef(null);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const triggers = [];
    // Navbar background animation on scroll
    if (navbarRef.current) {
      triggers.push(ScrollTrigger.create({
        trigger: "body",
        start: "top -100px",
        onEnter: () => {
          gsap.to(navbarRef.current, {
            backgroundColor: "rgba(11, 11, 13, 0.95)",
            backdropFilter: "blur(20px)",
            borderBottomColor: "rgba(255, 255, 255, 0.1)",
            duration: 0.4,
            ease: "power2.out"
          });
        },
        onLeaveBack: () => {
          gsap.to(navbarRef.current, {
            backgroundColor: "transparent",
            backdropFilter: "none",
            borderBottomColor: "transparent",
            duration: 0.4,
            ease: "power2.out"
          });
        }
      }));
    }

    // Active section detection
    const sections = ['home', 'about', 'projects', 'experience', 'skills', 'gallery', 'blog', 'contact'];
    
    sections.forEach(section => {
      triggers.push(ScrollTrigger.create({
        trigger: `#${section}`,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => setActiveSection(section),
        onEnterBack: () => setActiveSection(section)
      }));
    });

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);


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


  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <motion.nav
      ref={navbarRef}
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <motion.span
            className="logo-text"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Rithvik Gogineni
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.id === 'home' ? '/' : `/${item.id}`}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="mobile-menu-content">
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.id === 'home' ? '/' : `/${item.id}`}
                  className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mobile-theme-toggle">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
