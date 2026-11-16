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
import { Wipe } from '../../motion/motion';

export default function FeaturedInspect({ systems, media }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const tabs = useRef([]);
  const active = systems[i];
  const f = active.focus ?? { x: 50, y: 50, w: 60, h: 60 };
  // A dedicated inspection view if the project has one, otherwise its hero
  // image, otherwise the drawing.
  const inspectSrc = media.inspect ?? media.src ?? null;

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
      {/* A.5 — the machine is uncovered rather than faded up. A wipe from the
          base reads as a drawing being pulled out of a drawer, which is the
          right gesture for a sheet-based site and the wrong one for a card. */}
      <Wipe as="figure" from="up" tier="feature" className="a2-inspect__well a2-well a2-ch-l">
        <figcaption className="a2-exhibit__bar">
          {/* The figure label names the system currently being inspected, so
              the drawing and its caption can never disagree. */}
          <span className="a2-label">{media.figure} · {active.name}</span>
          {media.illustrative && (
            <span className="a2-tag a2-ch-s a2-chamfer">Illustrative · asset {media.assetId}</span>
          )}
        </figcaption>

        <div className="a2-inspect__stage" style={{ aspectRatio: media.aspect ?? '4 / 5' }}>
          {/* A.4 — the stage used to be the humanoid drawing and nothing else,
              which is why promoting any other project to the flagship would
              have put a humanoid elevation behind its subsystems. It now shows
              whatever the project actually has: a photograph or technical
              illustration where one exists, the labelled drawing where it does
              not. The focus box is positioned in percentages either way, so it
              tracks the artwork at every size without a resize observer. */}
          {inspectSrc ? (
            <img
              className="a2-inspect__img"
              src={inspectSrc}
              alt=""
              decoding="async"
              width="1400"
              height="933"
            />
          ) : (
            <HumanoidDrawing className="a2-inspect__svg" />
          )}
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

          {/* A leader line out of the focus box to the edge of the sheet,
              with the subsystem's number on the end of it. It travels with
              the box and redraws its length on each selection — the way a
              callout behaves on a real drawing, and the reason the box and
              the panel read as one annotation rather than two widgets. */}
          <m.span
            className="a2-leader"
            aria-hidden="true"
            initial={false}
            animate={{
              left: `${f.x + f.w / 2}%`,
              top: `${f.y}%`,
              width: `${Math.max(2, 98 - (f.x + f.w / 2))}%`,
            }}
            transition={reduce ? { duration: 0 } : { duration: DUR.panel, ease: EASE.inOut }}
          >
            <m.span
              className="a2-leader__n a2-mono"
              key={active.id}
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={reduce ? { duration: 0 } : { duration: DUR.state, ease: EASE.out, delay: 0.1 }}
            >
              {active.n}
            </m.span>
          </m.span>
        </div>

        {media.illustrative && (
          <p className="a2-well__need a2-mono">Awaiting {media.need.toLowerCase()}</p>
        )}
        {/* The image above is alt="" because it is the same subject the panel
            is describing in words; this carries the description once. */}
        <span className="a2-sr">{media.inspectAlt ?? media.alt}</span>
      </Wipe>

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
              // Only one panel is in the DOM at a time, because the note
              // crossfades on selection and four mounted panels would have
              // nothing to crossfade. So only the selected tab may claim to
              // control one: on the other three the id resolved to nothing,
              // which is worse for a screen reader than no attribute at all.
              // ARIA makes aria-controls optional on role="tab" for exactly
              // this case.
              aria-controls={n === i ? `sysp-${s.id}` : undefined}
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
