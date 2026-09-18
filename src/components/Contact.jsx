import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';
import { Reveal, RevealItem, SectionHeader } from '../animations/motion';

const EMAIL = 'goginenirithvik@gmail.com';

const Contact = () => {
  const [status, setStatus] = useState('idle');

  // No backend: the form composes an email in the visitor's mail app, so a
  // message can never be silently dropped.
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = data.get('subject');
    const body = `${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('opened');
  };

  const socialLinks = [
    { name: 'GitHub', icon: FaGithub, url: 'https://github.com/RithvikGogineni' },
    { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com/in/rithvik-gogineni-ba2a8330b' },
    { name: 'Résumé', icon: FaFileAlt, url: '/Rithvik-Gogineni-Resume.pdf' },
    { name: 'Email', icon: FaEnvelope, url: `mailto:${EMAIL}` }
  ];

  return (
    <section className="contact-section section" id="contact">
      <div className="container">
        <div className="contact-content">
          <SectionHeader
            title="Get In Touch"
            subtitle="Hiring for a Summer 2027 internship, or building something in robotics? I'd like to hear about it."
          />

          <div className="contact-grid">
            <Reveal className="contact-form-container">
              <form className="contact-form" onSubmit={handleSubmit}>
                <RevealItem className="form-group">
                  <label htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="Your Name"
                  />
                </RevealItem>

                <RevealItem className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    placeholder="your.email@example.com"
                  />
                </RevealItem>

                <RevealItem className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    required 
                    placeholder="Internship opportunity"
                  />
                </RevealItem>

                <RevealItem className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    required 
                    placeholder="Tell me about the role or project..."
                  ></textarea>
                </RevealItem>

                <RevealItem as="button" type="submit" className="btn btn-primary btn-magnetic">
                  Send Message
                  <span className="btn-arrow" aria-hidden="true">→</span>
                </RevealItem>
                <p className="form-status" role="status">
                  {status === 'opened' &&
                    `Your email app should open with the message ready to send. If it didn't, email me at ${EMAIL}.`}
                </p>
              </form>
            </Reveal>

            <Reveal className="contact-info" delay={0.1}>
              <div className="contact-details">
                <h3 className="contact-info-title">Let's Connect</h3>
                <p className="contact-description">
                  I'm looking for Summer 2027 internships in robotics and mechanical engineering, and I'm
                  always happy to talk about robotics projects, collaborations, or STEM mentorship.
                  I'll get back to you as soon as I can.
                </p>

                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="method-icon" aria-hidden="true"><FaEnvelope /></div>
                    <div className="method-content">
                      <h4>Email</h4>
                      <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
                    </div>
                  </div>

                  <div className="contact-method">
                    <div className="method-icon" aria-hidden="true"><FaPhone /></div>
                    <div className="method-content">
                      <h4>Phone</h4>
                      <p>(876) 307-9999</p>
                    </div>
                  </div>

                  <div className="contact-method">
                    <div className="method-icon" aria-hidden="true"><FaMapMarkerAlt /></div>
                    <div className="method-content">
                      <h4>Location</h4>
                      <p>Worcester, MA · Kingston, Jamaica</p>
                    </div>
                  </div>
                </div>

                <div className="social-links">
                  <h4 className="social-title">Find Me Online</h4>
                  <div className="social-icons">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        className="social-icon"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.icon && React.createElement(social.icon, { className: "social-icon-svg", 'aria-hidden': true })}
                        <span className="social-name">{social.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
