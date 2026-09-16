import React from 'react';
import { m } from 'framer-motion';
import { fadeInUp } from '../animations/framerVariants';
import Gallery from '../components/Gallery';

const GalleryPage = () => {
  return (
    <main className="main-content">
      <m.div
        className="page-hero"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">Gallery</h1>
          <p className="page-subtitle">
            Visual showcase of robotics builds, 3D designs, and creative moments
          </p>
        </div>
      </m.div>
      <Gallery />
    </main>
  );
};

export default GalleryPage;
