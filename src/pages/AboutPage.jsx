import React from 'react';
import { m } from 'framer-motion';
import { reveal as fadeInUp } from '../animations/variants';
import About from '../components/About';

const AboutPage = () => {
  return (
    <main className="main-content">
      <m.div
        className="page-hero"
        initial="hidden"
        animate="show"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">About Me</h1>
          <p className="page-subtitle">
            Mechanical & Robotics Engineering student at WPI
          </p>
        </div>
      </m.div>
      <About />
    </main>
  );
};

export default AboutPage;
