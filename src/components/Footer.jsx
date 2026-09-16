import React, { useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const footerElementsRef = useRef([]);

  useEffect(() => {
    // Footer elements animation
    footerElementsRef.current.forEach((element, index) => {
      if (element) {
        gsap.fromTo(element,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: index * 0.1,
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Back to top button animation
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
      ScrollTrigger.create({
        trigger: "body",
        start: "top -100px",
        onEnter: () => {
          gsap.to(backToTopBtn, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          });
        },
        onLeaveBack: () => {
          gsap.to(backToTopBtn, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          });
        }
      });
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': [
      { name: 'About', href: '#about' },
      { name: 'Projects', href: '#projects' },
      { name: 'Experience', href: '#experience' },
      { name: 'Contact', href: '#contact' }
    ],
    'Services': [
      { name: 'Web Development', href: '#' },
      { name: 'Mobile Apps', href: '#' },
      { name: 'UI/UX Design', href: '#' },
      { name: 'Consulting', href: '#' }
    ],
    'Resources': [
      { name: 'Blog', href: '#' },
      { name: 'Case Studies', href: '#' },
      { name: 'Documentation', href: '#' },
      { name: 'Support', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: FaGithub, url: 'https://github.com' },
    { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com' },
    { name: 'Twitter', icon: FaTwitter, url: 'https://twitter.com' },
    { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com' }
  ];

  return (
    <footer ref={footerRef} className="footer">
      <div className="container">
        <m.div
          className="footer-content"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Main Footer Content */}
          <div className="footer-main">
            <m.div 
              ref={el => footerElementsRef.current[0] = el}
              className="footer-brand"
              variants={fadeInUp}
            >
              <h3 className="footer-logo">Rithvik</h3>
              <p className="footer-description">
                Full-stack developer passionate about creating digital experiences 
                that make a difference. Let's build something amazing together.
              </p>
              <div className="footer-social">
                {socialLinks.map((social, index) => (
                  <m.a
                    key={social.name}
                    href={social.url}
                    className="footer-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social.icon && React.createElement(social.icon, { className: "social-icon" })}
                  </m.a>
                ))}
              </div>
            </m.div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <m.div 
                key={category}
                ref={el => footerElementsRef.current[categoryIndex + 1] = el}
                className="footer-links"
                variants={fadeInUp}
              >
                <h4 className="footer-links-title">{category}</h4>
                <ul className="footer-links-list">
                  {links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href={link.href} className="footer-link">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </m.div>
            ))}
          </div>

          {/* Footer Bottom */}
          <m.div 
            ref={el => footerElementsRef.current[4] = el}
            className="footer-bottom"
            variants={fadeInUp}
          >
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                © {currentYear} Rithvik. All rights reserved.
              </p>
              <div className="footer-bottom-links">
                <a href="#" className="footer-bottom-link">Privacy Policy</a>
                <a href="#" className="footer-bottom-link">Terms of Service</a>
                <a href="#" className="footer-bottom-link">Cookie Policy</a>
              </div>
            </div>
          </m.div>
        </m.div>
      </div>

      {/* Back to Top Button */}
      <m.button
        className="back-to-top"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="back-to-top-icon">↑</span>
      </m.button>
    </footer>
  );
};

export default Footer;
