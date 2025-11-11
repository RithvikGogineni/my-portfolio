import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const Hero = () => {
  const stats = [
    { value: '12+', label: 'Years in Robotics' },
    { value: '200+', label: 'Students Mentored' },
    { value: '6', label: 'Major Awards' }
  ];

  return (
    <section className="hero-section" id="home">
      <div className="container hero-container">
        <div className="hero-intro">
          <motion.span
            className="hero-kicker"
            initial={fadeUp.hidden}
            animate={fadeUp.visible}
          >
            Rithvik Gogineni
          </motion.span>

          <motion.h1
            className="hero-title"
            initial={fadeUp.hidden}
            animate={fadeUp.visible}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          >
            Robotics Innovator & STEM Leader
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={fadeUp.hidden}
            animate={fadeUp.visible}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            I design, build, and mentor robotics systems that move with purpose. My work blends
            mechanical design, control systems, and storytelling to inspire innovation across Jamaica
            and the global FIRST community.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={fadeUp.hidden}
            animate={fadeUp.visible}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <Link to="/projects" className="btn btn-primary">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                style={{ display: 'inline-block' }}
              >
                Explore Projects
              </motion.span>
            </Link>

            <Link to="/contact" className="btn btn-text">
              <motion.span
                whileHover={{ x: 6 }}
                style={{ display: 'inline-block' }}
              >
                Let's collaborate
              </motion.span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hero-summary"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut', delay: 0.35 } }}
        >
          <div className="summary-card">
            <span className="summary-label">Currently</span>
            <p className="summary-text">Vice-Captain, FTC Jamaica · Robotics mentor · STEM Student at Campion College</p>
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
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
