import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../animations/framerVariants';
import Gallery from '../components/Gallery';

const GalleryPage = () => {
  return (
    <main className="main-content">
      <motion.div
        className="page-hero"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">Gallery</h1>
          <p className="page-subtitle">
            Visual journey through my robotics builds, designs, and moments
          </p>
        </div>
      </motion.div>
      <Gallery />
    </main>
  );
};

export default GalleryPage;
