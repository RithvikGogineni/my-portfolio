import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/a2/Chrome';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/a2/Home';
import NotFound from './pages/a2/NotFound';
import { PROJECT_ROUTES, SECTION_ROUTES, RETIRED } from './content/legacy';
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

/**
 * `/projects/:id` from the previous site.
 *
 * The hosting layer answers these with a 308 before the app is ever loaded
 * (see vercel.json), so this only runs in local preview or on a host that
 * serves index.html for everything. It has to agree with that table exactly;
 * the QA sweep compares the two.
 *
 * A number that was never published is still a project link, so it goes to
 * the index rather than to a 404 — the visitor was looking for work, and the
 * work is all there.
 */
function LegacyProject() {
  const { id } = useParams();
  return <Navigate to={PROJECT_ROUTES[id] ?? '/#index'} replace />;
}

/** One of the retired routes: explained, not redirected. */
function Retired({ path }) {
  const r = RETIRED[path];
  return (
    <NotFound
      name={`${r.name} — retired`}
      lede={<>The {r.name.toLowerCase()} is not part of this edition of the site.</>}
      body={r.body}
      path={path}
    />
  );
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

                  {/* The previous site's URLs, each to the thing it was
                      about. See content/legacy.js. */}
                  <Route path="/projects" element={<Navigate to={SECTION_ROUTES['/projects']} replace />} />
                  <Route path="/projects/:id" element={<LegacyProject />} />
                  {Object.entries(SECTION_ROUTES)
                    .filter(([from]) => from !== '/projects')
                    .map(([from, to]) => (
                      <Route key={from} path={from} element={<Navigate to={to} replace />} />
                    ))}
                  {Object.keys(RETIRED).map((path) => (
                    <Route key={path} path={path} element={<Retired path={path} />} />
                  ))}

                  {/* Anything else is explained rather than swallowed. */}
                  <Route
                    path="*"
                    element={
                      <NotFound
                        name="Sheet not found"
                        lede="There is no sheet at this address."
                        body="The link is probably from an earlier version of this site, and the page it pointed at has either moved or was not carried over. Every project is on the index; the résumé has the complete record."
                      />
                    }
                  />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ThemeProvider>
        </MotionConfig>
      </LazyMotion>
    </ErrorBoundary>
  );
}
