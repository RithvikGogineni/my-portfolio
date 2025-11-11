import React, { useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { initCustomCursor, initScrollProgress } from './animations/gsapAnimations';
import { pageVariants } from './animations/framerVariants';
import './index.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Loading fallback component
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh',
    color: 'var(--color-text-light)'
  }}>
    <div>Loading...</div>
  </div>
);

function App() {
  useEffect(() => {
    // Initialize custom cursor and scroll progress
    initCustomCursor();
    initScrollProgress();
    
    // Initialize smooth scrolling
    const initSmoothScroll = async () => {
      const { default: Lenis } = await import('lenis');
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    };

    initSmoothScroll();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <motion.div
          className="App"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
        >
          {/* Navbar */}
          <Navbar />

          {/* Custom Cursor */}
          <div className="custom-cursor"></div>
          <div className="cursor-follower"></div>

          {/* Scroll Progress Bar */}
          <div className="scroll-progress"></div>

          {/* Routes */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Suspense>

          <Footer />
        </motion.div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
