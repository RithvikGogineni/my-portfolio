// ===========================================================================
// A.2 — SIGNATURE INTERACTION 02: INSPECT A SYSTEM
//
// Four subsystems, one drawing, and a dashed focus box that travels between
// them instead of cutting. The travel is the whole idea: it tells you where
// on the machine the thing you just selected actually lives. It eases in-out,
// because it is a repositioning move, and it is interruptible — selecting a
// third subsystem mid-travel redirects the box from wherever it has got to.
//
// The tab list is a real ARIA tablist: arrow keys move between subsystems,
// the panel below is the tabpanel, and the focus box is decorative. Nothing
// about the content depends on the box arriving.
// ===========================================================================
import React, { useRef, useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import HumanoidDrawing from './HumanoidDrawing';
import { T, DUR, EASE } from '../../motion/tokens';

export default function FeaturedInspect({ systems, media }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const tabs = useRef([]);
  const active = systems[i];
  const f = active.focus ?? { x: 50, y: 50, w: 60, h: 60 };

  const onKeyDown = (e) => {
    const last = systems.length - 1;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i === 0 ? last : i - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setI(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="a2-inspect">
      <figure className="a2-inspect__well a2-well a2-ch-l">
        <figcaption className="a2-exhibit__bar">
          <span className="a2-label">{media.figure}</span>
          {media.illustrative && (
            <span className="a2-tag a2-ch-s a2-chamfer">Illustrative · asset {media.assetId}</span>
          )}
        </figcaption>

        <div className="a2-inspect__stage">
          <HumanoidDrawing className="a2-inspect__svg" />
          {/* The travelling focus box. Overlaid in percentage units so it
              tracks the drawing at every size without a resize observer. */}
          <m.span
            className="a2-focusbox"
            aria-hidden="true"
            initial={false}
            animate={{
              left: `${f.x - f.w / 2}%`,
              top: `${f.y - f.h / 2}%`,
              width: `${f.w}%`,
              height: `${f.h}%`,
            }}
            transition={reduce ? { duration: 0 } : { duration: DUR.panel, ease: EASE.inOut }}
          />
        </div>

        {media.illustrative && (
          <p className="a2-well__need a2-mono">Awaiting {media.need.toLowerCase()}</p>
        )}
        <span className="a2-sr">{media.alt}</span>
      </figure>

      <div className="a2-inspect__side">
        <p className="a2-label a2-label--dim">Inspect a system</p>
        <div className="a2-inspect__tabs" role="tablist" aria-label="Subsystems" aria-orientation="vertical">
          {systems.map((s, n) => (
            <button
              key={s.id}
              ref={(el) => { tabs.current[n] = el; }}
              role="tab"
              id={`sys-${s.id}`}
              aria-selected={n === i}
              aria-controls={`sysp-${s.id}`}
              tabIndex={n === i ? 0 : -1}
              className={`a2-tab a2-ch-s${n === i ? ' is-on' : ''}`}
              onClick={() => setI(n)}
              onKeyDown={onKeyDown}
            >
              <span className="a2-tab__n a2-mono">{s.n}</span>
              <span className="a2-tab__name">{s.name}</span>
              <span className="a2-tab__mark" aria-hidden="true">{n === i ? '●' : '+'}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`sysp-${active.id}`} aria-labelledby={`sys-${active.id}`} className="a2-inspect__panel">
          <m.p
            key={active.id}
            className="a2-read"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={T.state}
          >
            {active.note}
          </m.p>
        </div>
      </div>
    </div>
  );
}
