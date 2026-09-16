import React from 'react';
import { m } from 'framer-motion';
import { fadeInUp } from '../animations/framerVariants';
import About from '../components/About';

const AboutPage = () => {
  return (
    <main className="main-content">
      <m.div
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
      </m.div>
      <About />
    </main>
  );
};

export default AboutPage;
