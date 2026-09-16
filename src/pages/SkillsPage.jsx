import React from 'react';
import { m } from 'framer-motion';
import { fadeInUp } from '../animations/framerVariants';
import Skills from '../components/Skills';

const SkillsPage = () => {
  return (
    <main className="main-content">
      <m.div
        className="page-hero"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">Skills & Expertise</h1>
          <p className="page-subtitle">
            Technical capabilities and soft skills developed through years of practice
          </p>
        </div>
      </m.div>
      <Skills />
    </main>
  );
};

export default SkillsPage;
