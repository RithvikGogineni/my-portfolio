// Header and colophon.
//
// The header is a title block, not a navigation bar: identity on the left,
// numbered destinations in the centre, the theme control on the right. The
// fine-line indicator under the active destination is the only moving part,
// and it travels rather than blinking between positions.
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import ThemeControl from './ThemeControl';
import { useMediaQuery, NARROW } from '../../hooks/useMediaQuery';
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

/**
 * The header's index on a phone.
 *
 * The four numbered destinations do not fit under 620px, so the approved
 * mobile sheet replaces them with an INDEX affordance. This is that: a
 * disclosure holding the same four rows, in the same order, with the same
 * numbers and the same active mark. It introduces no new destinations — it is
 * the desktop row, stacked.
 *
 * It renders only when the query matches, so the navigation never exists
 * twice in the accessibility tree. `aria-expanded` carries the state;
 * `aria-controls` is deliberately absent, because the panel is unmounted
 * while closed and an id that resolves to nothing is worse than no attribute.
 * The panel is the toggle's next sibling, so reading order already leads
 * there.
 */
function HeadIndex({ onHome, active }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { pathname, hash } = useLocation();
  const wrap = useRef(null);
  const toggle = useRef(null);

  // Any navigation closes it, a same-page hash jump included.
  useEffect(() => { setOpen(false); }, [pathname, hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      // Escape must hand focus back to the control that opened the panel,
      // or a keyboard visitor is dropped at the top of the document.
      toggle.current?.focus();
    };
    const onDown = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <div className="a2-head__index" ref={wrap}>
      <button
        type="button"
        ref={toggle}
        className="a2-head__indexBtn a2-label"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        Index
        <span className="a2-head__indexArrow a2-mono" aria-hidden="true">↓</span>
      </button>

      {open && (
        <m.nav
          className="a2-head__panel"
          aria-label="Sections"
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={T.state}
        >
          {SECTIONS.map((s) => {
            const on = onHome && active === s.id;
            const cls = `a2-head__panelLink${on ? ' is-on' : ''}`;
            const inner = (
              <>
                <span className="a2-head__n">{s.n}</span>
                <span>{s.label}</span>
              </>
            );
            return onHome ? (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={cls}
                aria-label={`${s.n} ${s.label}`}
                aria-current={on ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                {inner}
              </a>
            ) : (
              <Link key={s.id} to={`/#${s.id}`} className={cls} aria-label={`${s.n} ${s.label}`}>
                {inner}
              </Link>
            );
          })}
          {/* A.3 — the résumé belongs in the header, and on a phone the
              header *is* this panel. There is room for it here that there is
              not in a 390px strip. */}
          <a className="a2-head__panelLink a2-head__panelResume" href={site.resume.href}>
            <span className="a2-head__n" aria-hidden="true">↓</span>
            <span>{site.resume.label}</span>
          </a>
        </m.nav>
      )}
    </div>
  );
}

export function Header() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const active = useActiveSection(onHome);
  const narrow = useMediaQuery(NARROW);

  return (
    <header className="a2-head">
      <div className="a2-head__in a2-sheet">
        <Link to="/" className="a2-head__id" aria-label={`${site.name} — home`}>
          <span className="a2-head__mark a2-ch-s a2-chamfer" aria-hidden="true">{site.initials}</span>
          <span className="a2-label a2-head__name">{site.name}</span>
        </Link>

        {narrow ? (
          <HeadIndex onHome={onHome} active={active} />
        ) : onHome ? (
          <nav className="a2-head__nav" aria-label="Sections">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`a2-head__link${active === s.id ? ' is-on' : ''}`}
                // The number and the label are separate spans so the gap can
                // be a flex gap. Without this the accessible name is the
                // run-on "01Work": a whitespace text node between flex items
                // is not rendered, so it cannot supply the separator either.
                aria-label={`${s.n} ${s.label}`}
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
            {/* Only where the header has the width for a fifth item without
                crowding the four destinations — see .a2-head__resume. */}
            <a className="a2-head__link a2-head__resume" href={site.resume.href}>
              <span>{site.resume.short}</span>
            </a>
          </nav>
        ) : (
          <nav className="a2-head__nav" aria-label="Sections">
            <Link to="/#index" className="a2-head__link">
              <span className="a2-head__n" aria-hidden="true">←</span>
              <span>Index of work</span>
            </Link>
            <Link to="/#contact" className="a2-head__link"><span>Contact</span></Link>
            <a className="a2-head__link a2-head__resume" href={site.resume.href}>
              <span>{site.resume.short}</span>
            </a>
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
