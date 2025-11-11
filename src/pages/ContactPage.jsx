import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../animations/framerVariants';
import Contact from '../components/Contact';

const ContactPage = () => {
  return (
    <main className="main-content">
      <motion.div
        className="page-hero"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">Get In Touch</h1>
          <p className="page-subtitle">
            Always open to collaborations, mentorship, and innovative STEM opportunities
          </p>
        </div>
      </motion.div>
      <Contact />
    </main>
  );
};

export default ContactPage;
