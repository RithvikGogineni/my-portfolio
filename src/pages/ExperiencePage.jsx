import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../animations/framerVariants';
import Experience from '../components/Experience';

const ExperiencePage = () => {
  return (
    <main className="main-content">
      <motion.div
        className="page-hero"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">Experience & Education</h1>
          <p className="page-subtitle">
            My journey through robotics, leadership, and continuous learning
          </p>
        </div>
      </motion.div>
      <Experience />
    </main>
  );
};

export default ExperiencePage;
