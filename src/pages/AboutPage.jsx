import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../animations/framerVariants';
import About from '../components/About';

const AboutPage = () => {
  return (
    <main className="main-content">
      <motion.div
        className="page-hero"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">About Me</h1>
          <p className="page-subtitle">
            Engineering student passionate about robotics, innovation, and mentorship
          </p>
        </div>
      </motion.div>
      <About />
    </main>
  );
};

export default AboutPage;
