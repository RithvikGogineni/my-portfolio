// Header and colophon.
//
// The header is a title block, not a navigation bar: identity on the left,
// numbered destinations in the centre, the theme control on the right. The
// fine-line indicator under the active destination is the only moving part,
// and it travels rather than blinking between positions.
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import ThemeControl from './ThemeControl';
import { site } from '../../content/site';
import { T } from '../../motion/tokens';

const SECTIONS = [
  { id: 'work', n: '01', label: 'Work' },
  { id: 'index', n: '02', label: 'Index' },
  { id: 'practice', n: '03', label: 'Practice' },
  { id: 'contact', n: '04', label: 'Contact' },
];

/**
 * Tracks which sheet is in view so the header indicator matches the page.
 *
 * An IntersectionObserver band leaves the indicator stranded on whichever
 * section last crossed it whenever nothing is inside the band — at the very
 * top of the page, for instance. Measuring instead is deterministic: the
 * active sheet is the last one whose top has passed the reading line. The
 * listener is passive and rAF-throttled, and it only ever sets a string, so
 * nothing on the page moves with the scroll.
 */
function useActiveSection(enabled) {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      // At the foot of the page the last sheet is the one being read, even if
      // it never reaches the line because the document has run out.
      const atEnd = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      setActive(atEnd ? SECTIONS[SECTIONS.length - 1].id : current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [enabled]);

  return active;
}

export function Header() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const active = useActiveSection(onHome);

  return (
    <header className="a2-head">
      <div className="a2-head__in a2-sheet">
        <Link to="/" className="a2-head__id" aria-label={`${site.name} — home`}>
          <span className="a2-head__mark a2-ch-s a2-chamfer" aria-hidden="true">{site.initials}</span>
          <span className="a2-label a2-head__name">{site.name}</span>
        </Link>

        {onHome ? (
          <nav className="a2-head__nav" aria-label="Sections">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`a2-head__link${active === s.id ? ' is-on' : ''}`}
                aria-current={active === s.id ? 'true' : undefined}
              >
                <span className="a2-head__n">{s.n}</span>
                <span>{s.label}</span>
                {active === s.id && (
                  <m.span
                    className="a2-head__tick"
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={T.state}
                  />
                )}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="a2-head__nav" aria-label="Sections">
            <Link to="/#index" className="a2-head__link">
              <span className="a2-head__n" aria-hidden="true">←</span>
              <span>Index of work</span>
            </Link>
            <Link to="/#contact" className="a2-head__link"><span>Contact</span></Link>
          </nav>
        )}

        <ThemeControl compact />
      </div>
    </header>
  );
}

/** The colophon strip that closes every page — a title block, read in cells. */
export function Colophon({ sheet = '06 / 06', project }) {
  const cells = [
    { k: 'Drawn by', v: site.colophon.drawnBy },
    { k: 'Institution', v: site.colophon.institution },
    project ? { k: 'Project', v: project } : { k: 'Edition', v: 'Warm ivory / Machined charcoal' },
    { k: 'Sheet', v: sheet },
    { k: 'Rev.', v: site.colophon.revision },
  ];
  return (
    <footer className="a2-colophon">
      <div className="a2-sheet">
        <dl className="a2-colophon__grid">
          {cells.map((c) => (
            <div className="a2-colophon__cell" key={c.k}>
              <dt className="a2-label a2-label--dim">{c.k}</dt>
              <dd className="a2-label">{c.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </footer>
  );
}
