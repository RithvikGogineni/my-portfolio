import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/a2/Chrome';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/a2/Home';
import './styles/index.css';

// The home page ships in the main bundle — it is the landing page, and a
// second round-trip before the nameplate can paint is not worth the split.
// Case studies are lazy: they carry the assembly exhibit and the project
// imagery, and nobody pays for that until they ask for a project.
const CaseStudy = lazy(() => import('./pages/a2/CaseStudy'));

/**
 * Route changes start at the top of the new sheet; in-page anchors are left
 * alone so the header's section links still work. Browser back and forward
 * restore their own position, which is what a visitor expects.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

/** A case study's own sheet index is in-page; arriving with a hash honours it. */
function HashFocus() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ block: 'start' });
  }, [hash]);
  return null;
}

const Loading = () => (
  <div className="a2-sheet" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
    <p className="a2-label a2-label--dim">Loading sheet…</p>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      {/* domAnimation covers everything this site animates: transforms,
          opacity, variants, exit and gestures. No layout or drag animations
          are used anywhere, and `strict` makes a stray `motion.*` throw
          rather than silently pulling the full bundle back in. */}
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <ThemeProvider>
            <BrowserRouter>
              <ScrollManager />
              <HashFocus />
              <a className="a2-skip" href="#main">Skip to content</a>
              <Header />
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/work/:slug" element={<CaseStudy />} />
                  {/* Legacy project links keep working rather than 404ing. */}
                  <Route path="/projects/*" element={<Navigate to="/#index" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ThemeProvider>
        </MotionConfig>
      </LazyMotion>
    </ErrorBoundary>
  );
}
