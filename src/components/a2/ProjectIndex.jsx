// ===========================================================================
// A.2 — SIGNATURE INTERACTION 03: THE INDEX OF WORK
//
// Numbered editorial rows, never cards. On a fine pointer the row under the
// cursor or the keyboard focus seats itself — it fills rather than merely
// tinting, so the selection survives forced-colours — and the preview beside
// it crossfades to that project while its metadata swaps underneath. The
// preview is one well that re-dresses, not six wells that show and hide, so
// the column never reflows and the eye never loses its place.
//
// On a coarse pointer nothing depends on hover. The rows become disclosure
// buttons that open the same preview inline, beneath the row that opened it,
// and a second control inside the disclosure opens the case study. That is a
// deliberate extra tap: on touch, opening a 6 MB case study by brushing a row
// is worse than asking for it.
//
// The preview image carries a view-transition-name, so selecting a project
// hands that exact image to the case-study hero. Only the active preview
// holds the name — the API allows one element per name per document.
// ===========================================================================
import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { useCoarsePointer } from '../../hooks/useCoarsePointer';
import { DUR, EASE } from '../../motion/tokens';
import Button from './Button';

function Preview({ p, inline = false }) {
  const reduce = useReducedMotion();
  return (
    <div className={`a2-prev${inline ? ' a2-prev--inline' : ''}`}>
      <figure className="a2-prev__well a2-well a2-ch-m">
        <figcaption className="a2-exhibit__bar">
          <span className="a2-label">{p.number} — Preview</span>
          {p.media.illustrative && (
            <span className="a2-tag a2-ch-s a2-chamfer">Illustrative · {p.media.assetId}</span>
          )}
        </figcaption>
        <div className="a2-prev__media">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={p.slug}
              initial={reduce ? false : { opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, transition: { duration: DUR.control, ease: EASE.in } }}
              transition={{ duration: DUR.panel, ease: EASE.out }}
              className="a2-prev__frame"
            >
              {p.media.src ? (
                <img
                  src={p.media.src}
                  alt={p.media.alt}
                  loading="lazy"
                  decoding="async"
                  style={{ viewTransitionName: `media-${p.slug}` }}
                />
              ) : (
                <div className="a2-prev__placeholder">
                  <span className="a2-mono">Awaiting {p.media.need.toLowerCase()}</span>
                </div>
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </figure>

      <dl className="a2-meta">
        {p.facts.slice(0, 3).map((f) => (
          <div className="a2-meta__row" key={f.label}>
            <dt className="a2-label a2-label--dim">{f.label}</dt>
            <dd className="a2-mono">{f.value}</dd>
          </div>
        ))}
      </dl>
      <p className="a2-prev__line a2-read">{p.lede}</p>
    </div>
  );
}

export default function ProjectIndex({ projects }) {
  const coarse = useCoarsePointer();
  const [active, setActive] = useState(projects[0]?.slug);
  const [open, setOpen] = useState(null);
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const current = projects.find((p) => p.slug === active) ?? projects[0];

  return (
    <div className={`a2-index${coarse ? ' a2-index--touch' : ''}`}>
      <ol className="a2-index__rows">
        {projects.map((p) => {
          const seated = !coarse && active === p.slug;
          const isOpen = coarse && open === p.slug;
          const body = (
            <>
              <span className="a2-row__n a2-mono">{p.number}</span>
              <span className="a2-row__title a2-display">{p.title}</span>
              <span className="a2-row__kind a2-mono">
                {p.kind}
                <span className="a2-row__arrow" aria-hidden="true">{coarse ? (isOpen ? '−' : '+') : '→'}</span>
              </span>
            </>
          );

          return (
            <li key={p.slug} className="a2-index__item">
              {coarse ? (
                <button
                  type="button"
                  className={`a2-row${isOpen ? ' is-open' : ''}`}
                  aria-expanded={isOpen}
                  // The disclosure is mounted only while open, so the id is
                  // only referable while open. aria-expanded carries the
                  // state either way; a dangling aria-controls carries only
                  // a broken reference.
                  aria-controls={isOpen ? `${uid}-${p.slug}` : undefined}
                  onClick={() => setOpen(isOpen ? null : p.slug)}
                >
                  {body}
                </button>
              ) : (
                <Link
                  to={`/work/${p.slug}`}
                  viewTransition
                  className={`a2-row${seated ? ' is-on' : ''}`}
                  onMouseEnter={() => setActive(p.slug)}
                  onFocus={() => setActive(p.slug)}
                >
                  {body}
                  <span className="a2-sr">— open case study</span>
                </Link>
              )}

              {coarse && (
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      id={`${uid}-${p.slug}`}
                      className="a2-index__disclosure"
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0, transition: { duration: DUR.state, ease: EASE.in } }}
                      transition={{ duration: DUR.panel, ease: EASE.out }}
                    >
                      <Preview p={p} inline />
                      <Button to={`/work/${p.slug}`} viewTransition tone="accent">
                        Read the case study
                      </Button>
                    </m.div>
                  )}
                </AnimatePresence>
              )}
            </li>
          );
        })}
      </ol>

      {!coarse && current && (
        <aside className="a2-index__preview" aria-live="polite">
          <Preview p={current} />
        </aside>
      )}
    </div>
  );
}
