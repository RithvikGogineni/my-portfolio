import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight } from '../animations/framerVariants';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const inputRefs = useRef([]);
  const socialIconsRef = useRef([]);

  useEffect(() => {
    // Form inputs animation
    inputRefs.current.forEach((input, index) => {
      if (input) {
        const rect = input.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          // Already in view, animate immediately
          gsap.set(input, { y: 50, opacity: 0 });
          gsap.to(input, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: index * 0.1
          });
        } else {
          // Not in view, use ScrollTrigger
          gsap.fromTo(input,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: index * 0.1,
              scrollTrigger: {
                trigger: input,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }

        // Focus animations
        input.addEventListener('focus', () => {
          gsap.to(input, {
            scale: 1.02,
            borderColor: "var(--accent-color)",
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          });
        });

        input.addEventListener('blur', () => {
          gsap.to(input, {
            scale: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          });
        });
      }
    });

    // Social icons animation
    socialIconsRef.current.forEach((icon, index) => {
      if (icon) {
        const rect = icon.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          // Already in view, animate immediately
          gsap.set(icon, { scale: 0, rotation: -180 });
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: index * 0.1
          });
        } else {
          // Not in view, use ScrollTrigger
          gsap.fromTo(icon,
            { scale: 0, rotation: -180 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              ease: "back.out(1.7)",
              delay: index * 0.1,
              scrollTrigger: {
                trigger: icon,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }

        // Hover effects
        icon.addEventListener('mouseenter', () => {
          gsap.to(icon, {
            scale: 1.2,
            rotation: 5,
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          });
        });

        icon.addEventListener('mouseleave', () => {
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          });
        });
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  const socialLinks = [
    { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/in/rithvik-gogineni-ba2a8330b' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
    { name: 'Email', icon: '📧', url: 'mailto:goginenirithvik@gmail.com' }
  ];

  return (
    <section ref={sectionRef} className="contact-section section" id="contact">
      <div className="container">
        <motion.div
          className="contact-content"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Section Header */}
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle">
              Ready to work together? Let's discuss your next project
            </p>
          </motion.div>

          <div className="contact-grid">
            {/* Contact Form */}
            <motion.div 
              className="contact-form-container"
              variants={fadeInLeft}
            >
              <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
                <motion.div 
                  ref={el => inputRefs.current[0] = el}
                  className="form-group"
                >
                  <label htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="Your Name"
                  />
                </motion.div>

                <motion.div 
                  ref={el => inputRefs.current[1] = el}
                  className="form-group"
                >
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    placeholder="your.email@example.com"
                  />
                </motion.div>

                <motion.div 
                  ref={el => inputRefs.current[2] = el}
                  className="form-group"
                >
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    required 
                    placeholder="Project Inquiry"
                  />
                </motion.div>

                <motion.div 
                  ref={el => inputRefs.current[3] = el}
                  className="form-group"
                >
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    required 
                    placeholder="Tell me about your project..."
                  ></textarea>
                </motion.div>

                <motion.button 
                  type="submit" 
                  className="btn btn-primary btn-magnetic"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                  <span className="btn-arrow">→</span>
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              className="contact-info"
              variants={fadeInRight}
            >
              <div className="contact-details">
                <h3 className="contact-info-title">Let's Connect</h3>
                <p className="contact-description">
                  Always open to collaborations, mentorship, and innovative STEM opportunities. 
                  Whether you have a robotics project, want to collaborate, or just want to say hi, 
                  I'll try my best to get back to you!
                </p>

                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="method-icon">📧</div>
                    <div className="method-content">
                      <h4>Email</h4>
                      <p>goginenirithvik@gmail.com</p>
                    </div>
                  </div>

                  <div className="contact-method">
                    <div className="method-icon">📱</div>
                    <div className="method-content">
                      <h4>Phone</h4>
                      <p>(876) 307-9999</p>
                    </div>
                  </div>

                  <div className="contact-method">
                    <div className="method-icon">📍</div>
                    <div className="method-content">
                      <h4>Location</h4>
                      <p>Kingston, Jamaica</p>
                    </div>
                  </div>
                </div>

                <div className="social-links">
                  <h4 className="social-title">Follow Me</h4>
                  <div className="social-icons">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        ref={el => socialIconsRef.current[index] = el}
                        href={social.url}
                        className="social-icon"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span className="social-emoji">{social.icon}</span>
                        <span className="social-name">{social.name}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
