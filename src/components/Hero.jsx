import React from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const Hero = () => {
  const stats = [
    { value: '5', label: 'Years Teaching Robotics' },
    { value: '110+', label: 'Students Taught' },
    { value: '6', label: 'Major Awards' }
  ];

  return (
    <section className="hero-section" id="home">
      <div className="container hero-container">
        <div className="hero-intro">
          <m.span
            className="hero-kicker"
            initial={fadeUp.hidden}
            animate={fadeUp.visible}
          >
            Rithvik Gogineni
          </m.span>

          <m.h1
            className="hero-title"
            initial={fadeUp.hidden}
            animate={fadeUp.visible}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          >
            Robotics Innovator & STEM Leader
          </m.h1>

          <m.p
            className="hero-description"
            initial={fadeUp.hidden}
            animate={fadeUp.visible}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            I create purposeful robotics systems and mentor young engineers to think boldly, build creatively, and drive technological innovation across Jamaica’s growing STEM landscape.
          </m.p>

          <m.div
            className="hero-actions"
            initial={fadeUp.hidden}
            animate={fadeUp.visible}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <Link to="/projects" className="btn btn-primary">
              <m.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                style={{ display: 'inline-block' }}
              >
                Explore Projects
              </m.span>
            </Link>

            <Link to="/contact" className="btn btn-text">
              <m.span
                whileHover={{ x: 6 }}
                style={{ display: 'inline-block' }}
              >
                Let's collaborate
              </m.span>
            </Link>
          </m.div>
        </div>

        <m.div
          className="hero-summary"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut', delay: 0.35 } }}
        >
          <div className="summary-card">
            <span className="summary-label">Currently</span>
            <p className="summary-text">Captain, FTC Jamaica · Robotics mentor · Mechanical &amp; Robotics Engineering at WPI</p>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="summary-stat">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
};

export default Hero;
