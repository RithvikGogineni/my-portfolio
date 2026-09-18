import React, { useEffect, Suspense, lazy } from 'react';
import { LazyMotion, domAnimation, m, MotionConfig, useScroll, useSpring } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Home is the landing page, so it ships in the main bundle: lazy-loading it
// added a second round-trip before the hero could paint. Other pages stay lazy.
import HomePage from './pages/HomePage';
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

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const scrollToTop = () => {
      // Try Lenis first if available (for smooth scrolling library)
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        // Fallback to native scroll
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    // Immediate scroll
    scrollToTop();
    
    // Also scroll after a tiny delay to catch any async rendering
    const timeoutId = setTimeout(scrollToTop, 0);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

// Thin bar at the top that tracks page scroll. Spring-smoothed, transform-only.
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return <m.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
};

// Fades page content in on route changes only, never on first load, so the
// first paint isn't held back behind an opacity animation.
const RouteFade = ({ children }) => {
  const { pathname } = useLocation();
  const first = React.useRef(true);
  useEffect(() => { first.current = false; }, []);
  return (
    <m.div
      key={pathname}
      initial={first.current ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  );
};

function App() {
  useEffect(() => {
    // Smooth scrolling, skipped for people who prefer reduced motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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

      // Store Lenis instance globally for ScrollToTop component
      window.lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    };

    initSmoothScroll();
  }, []);

  return (
    <ErrorBoundary>
      {/* LazyMotion + the `m` component ship only the animation features this
          site uses (animations, variants, exit, hover/tap, whileInView) instead
          of the full `motion` bundle. No layout or drag animations are used, so
          `domAnimation` is sufficient; `strict` makes a stray `motion.*` throw
          rather than silently pulling the full bundle back in. */}
      <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="App">
            {/* Navbar */}
            <Navbar />

            <ScrollProgress />

            <Suspense fallback={<PageLoader />}>
              <RouteFade>
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
              </RouteFade>
            </Suspense>

            <Footer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
      </MotionConfig>
      </LazyMotion>
    </ErrorBoundary>
  );
}

export default App;
