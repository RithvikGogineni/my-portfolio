import React, { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import { Reveal, RevealItem } from '../animations/motion';
import { RESUME_URL } from './Navbar';

const footerLinks = {
  Explore: [
    { name: 'About', to: '/about' },
    { name: 'Projects', to: '/projects' },
    { name: 'Experience', to: '/experience' },
    { name: 'Skills', to: '/skills' },
  ],
  Connect: [
    { name: 'Email', href: 'mailto:goginenirithvik@gmail.com' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/rithvik-gogineni-ba2a8330b' },
    { name: 'GitHub', href: 'https://github.com/RithvikGogineni' },
    { name: 'Résumé (PDF)', href: RESUME_URL },
  ],
};

const socialLinks = [
  { name: 'GitHub', icon: FaGithub, url: 'https://github.com/RithvikGogineni' },
  { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com/in/rithvik-gogineni-ba2a8330b' },
  { name: 'Email', icon: FaEnvelope, url: 'mailto:goginenirithvik@gmail.com' },
  { name: 'Résumé', icon: FaFileAlt, url: RESUME_URL },
];

const Footer = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    if (window.lenis) window.lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isExternal = (href) => href.startsWith('http') || href.endsWith('.pdf');

  return (
    <footer className="footer">
      <div className="container">
        <Reveal className="footer-content">
          <div className="footer-main">
            <RevealItem className="footer-brand">
              <h2 className="footer-logo">Rithvik Gogineni</h2>
              <p className="footer-description">
                Mechanical &amp; Robotics Engineering student at WPI. I design, build, and program
                robots, and write the software around them.
              </p>
              <div className="footer-social">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="footer-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    {React.createElement(social.icon, { className: 'social-icon', 'aria-hidden': true })}
                  </a>
                ))}
              </div>
            </RevealItem>

            {Object.entries(footerLinks).map(([category, links]) => (
              <RevealItem key={category} className="footer-links">
                <h3 className="footer-links-title">{category}</h3>
                <ul className="footer-links-list">
                  {links.map((link) => (
                    <li key={link.name}>
                      {link.to ? (
                        <Link to={link.to} className="footer-link">{link.name}</Link>
                      ) : (
                        <a
                          href={link.href}
                          className="footer-link"
                          {...(isExternal(link.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                          {link.name}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </div>

          <RevealItem className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                © {new Date().getFullYear()} Rithvik Gogineni
              </p>
            </div>
          </RevealItem>
        </Reveal>
      </div>

      <AnimatePresence>
        {showTop && (
          <m.button
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
          >
            <span className="back-to-top-icon" aria-hidden="true">↑</span>
          </m.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
