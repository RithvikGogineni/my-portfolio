import React from 'react';
import { m } from 'framer-motion';
import { reveal as fadeInUp } from '../animations/variants';
import Experience from '../components/Experience';

const ExperiencePage = () => {
  return (
    <main className="main-content">
      <m.div
        className="page-hero"
        initial="hidden"
        animate="show"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">Experience & Education</h1>
          <p className="page-subtitle">
            My journey through robotics, leadership, and continuous learning
          </p>
        </div>
      </m.div>
      <Experience />
    </main>
  );
};

export default ExperiencePage;
