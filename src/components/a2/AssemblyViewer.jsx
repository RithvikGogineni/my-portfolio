// ===========================================================================
// A.2 — SIGNATURE INTERACTION 04: TAKE IT APART
//
// A real orthographic assembly view. Parts are declared once in
// content/assemblies.js with their position, diameter, bore and features on a
// shared build axis; every frame projects them through the orbit camera. So:
//
//   • rotating moves the bolt circles and features around the axis while each
//     silhouette stays dimensionally correct — it is a projection, not a skew
//   • exploding separates parts ALONG the axis they were assembled on, in
//     stack order, which is the path they would actually come apart on
//   • zoom is clamped to a range where the drawing still reads
//   • part ids, order and transforms live in the schema, so swapping in real
//     CAD-derived geometry and a real BOM changes no component code
//
// HONESTY: the schema on the stage is marked `illustrative`, because no CAD
// file or bill of materials has been supplied. The well says so permanently,
// the parts list says so in words, and no quantity or material is shown for a
// part that has none. Nothing here is presented as a measured part of a robot.
//
// ACCESSIBLE ALTERNATIVE: the parts list is the exhibit's equal. It is a real
// list of buttons carrying every name the drawing carries; selecting one
// highlights its part, and selecting a part highlights the row. The slider is
// a native range input, so it is operable by keyboard with no extra code.
// ===========================================================================
import React, { useId, useMemo, useState } from 'react';

import { buildPart, axisCentre } from '../../lib/projection';
import { useOrbit } from '../../hooks/useOrbit';
import { toPct } from '../../lib/stage';
import StageHint from './StageHint';

export default function AssemblyViewer({ assembly }) {
  const uid = useId().replace(/:/g, '');

  const [explode, setExplode] = useState(0);
  const [picked, setPicked] = useState(null);
  const [view, setView] = useState(assembly.views[0].id);
  const { cam, setCam, reset, dragging, bind } = useOrbit(
    { yaw: assembly.views[0].yaw, pitch: assembly.views[0].pitch, scale: 1 },
    { zoom: true },
  );

  const goto = (v) => {
    setView(v.id);
    setCam((c) => ({ ...c, yaw: v.yaw, pitch: v.pitch }));
  };

  // Separation factor. The schema's per-part `explode` is a signed multiple of
  // this, so parts above the datum travel up and parts below travel down.
  const sep = (explode / 100) * 26;

  const built = useMemo(() => {
    const parts = assembly.parts
      .map((p) => ({ src: p, geo: buildPart(p, cam, sep) }))
      // Painter's order along the build axis: lower parts first, so the stack
      // occludes correctly from any angle above the horizon.
      .sort((a, b) => a.src.y - b.src.y);
    const top = axisCentre(44 + sep * 1.1, cam);
    const bot = axisCentre(-40 - sep * 1.1, cam);
    return { parts, axis: { top, bot } };
  }, [assembly.parts, cam, sep]);

  const activeId = picked;

  return (
    <div className="a2-asm">
      <figure className="a2-asm__well a2-well a2-ch-m">
        <figcaption className="a2-exhibit__bar">
          <span className="a2-label">{assembly.caption}</span>
          {assembly.illustrative && (
            <span className="a2-tag a2-ch-s a2-chamfer">Illustrative · awaiting CAD</span>
          )}
        </figcaption>

        <div
          className={`a2-stage a2-stage--asm${dragging ? ' is-dragging' : ''}`}
          tabIndex={0}
          role="img"
          aria-label={`Orthographic exploded view of ${assembly.title}, ${assembly.parts.length} parts on one build axis. Arrow keys orbit, plus and minus zoom, zero resets. The separation slider and the full parts list are below.`}
          {...bind}
        >
          <svg viewBox="-100 -100 200 200" className="a2-stage__svg" aria-hidden="true" focusable="false">
            {built.parts.map(({ src, geo }) => {
              const on = activeId === src.id;
              const cls = `a2-part${on ? ' is-on' : ''}`;
              return (
                <g key={src.id} className={cls}>
                  {/* underside — a hidden line until the part is tilted or lifted */}
                  <ellipse cx={geo.cBot.x} cy={geo.cBot.y} rx={geo.rx} ry={geo.ry}
                    className="a2-ln a2-ln--hidden" />
                  {geo.hasBody && (
                    <>
                      <line x1={geo.cTop.x - geo.rx} y1={geo.cTop.y} x2={geo.cBot.x - geo.rx} y2={geo.cBot.y} className="a2-ln" />
                      <line x1={geo.cTop.x + geo.rx} y1={geo.cTop.y} x2={geo.cBot.x + geo.rx} y2={geo.cBot.y} className="a2-ln" />
                    </>
                  )}
                  <ellipse cx={geo.cTop.x} cy={geo.cTop.y} rx={geo.rx} ry={geo.ry} className="a2-ln a2-part__face" />
                  {geo.inner > 0 && (
                    <ellipse cx={geo.cTop.x} cy={geo.cTop.y} rx={geo.inner} ry={geo.innerRy} className="a2-ln a2-ln--thin" />
                  )}
                  {geo.features.map((h) => (
                    <ellipse key={h.key} cx={h.x} cy={h.y} rx={h.rx} ry={h.ry} className="a2-ln a2-ln--thin" />
                  ))}

                  {/* Leader to the numbered callout at the sheet edge. */}
                  <line
                    x1={geo.cTop.x + geo.rx} y1={geo.anchor.y}
                    x2={84} y2={geo.anchor.y}
                    className={`a2-ln a2-ln--leader${on ? ' is-on' : ''}`}
                  />
                </g>
              );
            })}

            {/* The build axis is drawn last, so it reads through the stack the
                way a datum does on a real exploded view rather than being
                buried under the first part that covers it. */}
            <line
              x1={built.axis.top.x} y1={built.axis.top.y}
              x2={built.axis.bot.x} y2={built.axis.bot.y}
              className="a2-ln a2-ln--centre a2-ln--axis"
            />
          </svg>

          <ul className="a2-stage__spots">
            {built.parts.map(({ src, geo }) => (
              <li key={src.id} style={{ left: `${toPct(88)}%`, top: `${toPct(geo.anchor.y)}%` }}>
                <button
                  type="button"
                  data-stage-control
                  className={`a2-spot a2-spot--sm${activeId === src.id ? ' is-on' : ''}`}
                  aria-pressed={activeId === src.id}
                  onClick={() => setPicked(activeId === src.id ? null : src.id)}
                >
                  <span className="a2-spot__dot">{src.n}</span>
                  <span className="a2-sr">{src.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Separation. A native range input: keyboard-operable for free, and
            tabular numerals on the read-out so the digits do not jitter. */}
        <div className="a2-asm__slider">
          <label className="a2-label a2-label--dim" htmlFor={`${uid}-exp`}>Assembled</label>
          <input
            id={`${uid}-exp`}
            type="range"
            min="0"
            max="100"
            step="1"
            value={explode}
            onChange={(e) => setExplode(Number(e.target.value))}
            className="a2-range"
            aria-valuetext={`${explode} percent separated`}
          />
          <span className="a2-label">
            Exploded · <span className="a2-mono a2-num">{String(explode).padStart(2, '0')}%</span>
          </span>
        </div>
      </figure>

      <div className="a2-asm__side">
        <div className="a2-asm__views" role="group" aria-label="Viewpoints">
          {assembly.views.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`a2-chip a2-ch-s${view === v.id ? ' is-on' : ''}`}
              aria-pressed={view === v.id}
              onClick={() => goto(v)}
            >
              {v.label}
            </button>
          ))}
          <button type="button" className="a2-chip a2-ch-s" onClick={() => { reset(); setView(assembly.views[0].id); }}>
            Reset
          </button>
        </div>

        <p className="a2-label a2-label--dim">Parts list</p>
        <ul className="a2-parts">
          {assembly.parts.map((p) => {
            const on = activeId === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={`a2-parts__row${on ? ' is-on' : ''}`}
                  aria-pressed={on}
                  onMouseEnter={() => setPicked(p.id)}
                  onFocus={() => setPicked(p.id)}
                  onClick={() => setPicked(on ? null : p.id)}
                >
                  <span className="a2-mono a2-parts__n">{p.n}</span>
                  <span className="a2-parts__name">{p.name}</span>
                  {/* Quantity and material are shown only when the schema
                      carries them. An illustrative part carries neither, and
                      the row says nothing rather than inventing a value. */}
                  <span className="a2-parts__spec a2-mono">
                    {p.material ? `${p.qty} · ${p.material}` : '—'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {assembly.illustrative && (
          <p className="a2-asm__note a2-read">
            <em>{assembly.note}</em>
          </p>
        )}

        <div className="a2-stage__controls">
          <StageHint touch="Drag to orbit · drag the slider to separate · tap a part">
            Drag to orbit · arrows to step · +/− to zoom · 0 to reset
          </StageHint>
        </div>
      </div>
    </div>
  );
}
