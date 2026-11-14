// ===========================================================================
// A.2 — SIGNATURE INTERACTION 01: THE HERO EXHIBIT
//
// The technical drawing beside the nameplate is a live orthographic view, not
// a picture of one. The part is declared as geometry and projected every
// frame, so spinning it moves the bolt circle and the rim teeth around the
// axis while the silhouette stays dimensionally correct, and tilting it opens
// the plate's thickness out of a true plan view.
//
// HONESTY: no CAD file has been supplied, so the part on the stage is a
// generic flange and the well says ILLUSTRATIVE · SWAP FOR CAD permanently.
// Its annotations name the drawing's own features. No dimension carries a
// value, because there is no measured part to take one from.
//
// FAILURE: the exhibit is a leaf. The nameplate, the standing lines and the
// contact button are ordinary markup beside it — if this never paints, the
// hero still reads completely.
// ===========================================================================
import React, { useMemo, useState, useId } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { project, axisCentre, ellipseRy } from '../../lib/projection';
import { useOrbit } from '../../hooks/useOrbit';
import { toPct } from '../../lib/stage';
import StageHint from './StageHint';
import { EASE, DUR, T } from '../../motion/tokens';

const RAD = Math.PI / 180;

// --- the part -------------------------------------------------------------
const PLATE = { rOuter: 74, rHub: 30, rBore: 12, pcd: 52, holeR: 5, teeth: 24, halfH: 4 };

const HOTSPOTS = [
  { id: 'bore', n: '01', name: 'Centre bore', at: { r: 0, a: 0 },
    note: 'The bore the part turns on. On a real assembly this is where the shaft and its retaining hardware are specified.' },
  { id: 'bolt', n: '02', name: 'Bolt circle', at: { r: PLATE.pcd, a: 0 },
    note: 'A ring of fixings on one pitch-circle diameter. Spin the part and the circle carries its holes round with it.' },
  { id: 'rim', n: '03', name: 'Toothed rim', at: { r: PLATE.rOuter - 7, a: 118 },
    note: 'The feature that makes rotation readable. Tilt the stage and the rim opens into the plate’s thickness.' },
];

export default function HeroExhibit() {
  const uid = useId().replace(/:/g, '');
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState(null);
  const { cam, bind, reset, dragging } = useOrbit({ yaw: 0, pitch: 90, scale: 1.18 }, { zoom: false });

  const g = useMemo(() => {
    const cTop = axisCentre(PLATE.halfH, cam);
    const cBot = axisCentre(-PLATE.halfH, cam);
    const ring = (r) => ({ rx: r * cam.scale, ry: ellipseRy(r, cam) });

    // Rim teeth: four real corners each, projected. At plan view they sit flat;
    // tilted, they foreshorten exactly as the ellipse does.
    const teeth = Array.from({ length: PLATE.teeth }, (_, i) => {
      const a = (i / PLATE.teeth) * 360;
      const w = (360 / PLATE.teeth) * 0.36;
      const pts = [
        [a - w, PLATE.rOuter - 12], [a + w, PLATE.rOuter - 12],
        [a + w, PLATE.rOuter], [a - w, PLATE.rOuter],
      ].map(([ang, rr]) => {
        const p = project({ x: Math.cos(ang * RAD) * rr, y: PLATE.halfH, z: Math.sin(ang * RAD) * rr }, cam);
        return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
      });
      return { key: i, points: pts.join(' ') };
    });

    const holes = Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * 360 + 30;
      const p = project({ x: Math.cos(a * RAD) * PLATE.pcd, y: PLATE.halfH, z: Math.sin(a * RAD) * PLATE.pcd }, cam);
      return { key: i, ...p, rx: PLATE.holeR * cam.scale, ry: ellipseRy(PLATE.holeR, cam) };
    });

    const spots = HOTSPOTS.map((h) => {
      const p = project(
        { x: Math.cos(h.at.a * RAD) * h.at.r, y: PLATE.halfH, z: Math.sin(h.at.a * RAD) * h.at.r },
        cam,
      );
      return { ...h, x: p.x, y: p.y };
    });

    return { cTop, cBot, ring, teeth, holes, spots, outer: ring(PLATE.rOuter) };
  }, [cam]);

  const active = g.spots.find((s) => s.id === picked) ?? null;
  // Entrances are staggered only on first paint; afterwards the drawing simply
  // tracks the camera, so dragging never restarts the assembly animation.
  const seq = (i) => (reduce ? {} : { duration: DUR.cine, ease: EASE.out, delay: 0.1 + i * 0.07 });

  return (
    <figure className="a2-exhibit a2-well a2-ch-l">
      <figcaption className="a2-exhibit__bar">
        <span className="a2-label">Fig. 01</span>
        <span className="a2-tag a2-ch-s a2-chamfer">Illustrative · swap for CAD</span>
      </figcaption>

      <div
        className={`a2-stage${dragging ? ' is-dragging' : ''}`}
        tabIndex={0}
        role="img"
        aria-label="Interactive orthographic drawing of a generic flange: a toothed rim, a six-hole bolt circle, a hub and a centre bore. Arrow keys orbit the view; zero resets it. The same features are listed as buttons below."
        {...bind}
      >
        <svg viewBox="-100 -100 200 200" className="a2-stage__svg" aria-hidden="true" focusable="false">
          {/* Hidden line: the underside of the plate, which only separates
              from the top face once the stage is tilted off plan view. */}
          <ellipse cx={g.cBot.x} cy={g.cBot.y} rx={g.outer.rx} ry={g.outer.ry}
            className="a2-ln a2-ln--hidden" />
          <line x1={g.cTop.x - g.outer.rx} y1={g.cTop.y} x2={g.cBot.x - g.outer.rx} y2={g.cBot.y} className="a2-ln a2-ln--thin" />
          <line x1={g.cTop.x + g.outer.rx} y1={g.cTop.y} x2={g.cBot.x + g.outer.rx} y2={g.cBot.y} className="a2-ln a2-ln--thin" />

          {/* Centre lines — the drawing's datum, in coral, dashed. */}
          <m.g className="a2-ln a2-ln--centre"
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }} transition={seq(0)} style={{ originX: '50%', originY: '50%' }}>
            <line x1={-96} y1={g.cTop.y} x2={96} y2={g.cTop.y} />
            <line x1={g.cTop.x} y1={-96} x2={g.cTop.x} y2={96} />
          </m.g>

          {/* Rim teeth assemble inward, then the ring closes around them. */}
          <m.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={seq(1)}>
            {g.teeth.map((t) => (
              <polygon key={t.key} points={t.points} className="a2-ln a2-ln--thin" />
            ))}
          </m.g>

          <m.ellipse cx={g.cTop.x} cy={g.cTop.y} rx={g.outer.rx} ry={g.outer.ry} className="a2-ln"
            initial={reduce ? false : { opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }}
            transition={seq(2)} style={{ originX: '50%', originY: '50%' }} />

          <m.g initial={reduce ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={seq(3)} style={{ originX: '50%', originY: '50%' }}>
            <ellipse cx={g.cTop.x} cy={g.cTop.y} {...g.ring(PLATE.rHub)} className="a2-ln" />
            <ellipse cx={g.cTop.x} cy={g.cTop.y} {...g.ring(PLATE.rBore)} className="a2-ln" />
          </m.g>

          <m.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={seq(4)}>
            {g.holes.map((h) => (
              <ellipse key={h.key} cx={h.x} cy={h.y} rx={h.rx} ry={h.ry} className="a2-ln a2-ln--thin" />
            ))}
          </m.g>

          {/* Leader line to the selected feature. It draws from the annotation
              toward the part, so the move starts at the control that caused it. */}
          {active && (
            <m.line
              key={active.id}
              x1={active.x} y1={active.y} x2={active.x} y2={88}
              className="a2-ln a2-ln--leader"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: DUR.panel, ease: EASE.out }}
            />
          )}
        </svg>

        {/* The interactive layer is real HTML: real buttons, real focus order,
            44px targets. The SVG below it is decorative by comparison. */}
        <ul className="a2-stage__spots">
          {g.spots.map((s) => {
            const on = picked === s.id;
            return (
              <li key={s.id} style={{ left: `${toPct(s.x)}%`, top: `${toPct(s.y)}%` }}>
                <button
                  type="button"
                  data-stage-control
                  className={`a2-spot${on ? ' is-on' : ''}`}
                  aria-pressed={on}
                  aria-describedby={`${uid}-ann`}
                  onClick={() => setPicked(on ? null : s.id)}
                >
                  <span className="a2-spot__dot">{s.n}</span>
                  <span className="a2-sr">{s.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="a2-exhibit__foot" id={`${uid}-ann`} aria-live="polite">
        {active ? (
          <m.p key={active.id} className="a2-exhibit__ann"
            initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={T.state}>
            <span className="a2-mono a2-exhibit__annN">{active.n}</span>
            <span><strong>{active.name}</strong> — {active.note}</span>
          </m.p>
        ) : (
          <p className="a2-exhibit__ann a2-exhibit__ann--rest">
            Select a numbered point to read its annotation.
          </p>
        )}
        <div className="a2-stage__controls">
          <StageHint touch="Drag to orbit · tap a numbered point">
            Drag to orbit · arrows to step · 0 to reset
          </StageHint>
          <button type="button" data-stage-control className="a2-ghost a2-mono" onClick={reset}>Reset view</button>
        </div>
      </div>
    </figure>
  );
}
