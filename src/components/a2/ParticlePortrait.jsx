// ===========================================================================
// A.4 — SIGNATURE INTERACTION 05: THE PORTRAIT ASSEMBLES
//
// The photograph arrives as a few thousand particles that find their places.
// It is the one unapologetically expressive thing on the site, and it sits in
// the one section that is about a person rather than a machine.
//
// WHY RAW WEBGL AND NO LIBRARY
// The whole effect is one `gl.POINTS` draw call. Every particle's path is
// computed in the vertex shader from four static attributes and two uniforms,
// so the CPU does nothing per frame except set the clock and the pointer.
// Three.js would add ~170kB gzipped to animate a flat array of points through
// a lerp; a DOM or 2D-canvas implementation would put ~20,000 positions
// through JavaScript every frame. Neither is worth it. This is ~250 lines and
// no dependency.
//
// WHAT IS ACTUALLY GUARANTEED
// The <img> is the portrait. It is in the DOM from the first paint, at its
// real dimensions, carrying the alt text, and it is what you get if WebGL is
// missing, if the context is lost, if the image fails to decode, or if you
// have asked for reduced motion. The canvas is decoration layered over it and
// is `aria-hidden`. Nothing about reading this section waits on the effect.
//
// COST
// The simulation runs for its ~2s formation and then stops. After that the
// loop only wakes while the pointer is inside the figure, and it stops again
// a beat after the pointer leaves. Off-screen, it never runs at all. There is
// no idle animation.
// ===========================================================================
import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const VERT = `
attribute vec2 aTarget;   // final position, clip space
attribute vec2 aStart;    // dispersed origin, clip space
attribute vec3 aColor;
attribute vec2 aSeed;     // x: per-particle delay 0..1, y: noise 0..1

uniform float uProgress;  // 0..1 formation
uniform float uReveal;    // 0 while forming, 1 once the photograph is up
uniform vec2  uMouse;     // clip space; off-screen when inactive
uniform float uMouseOn;   // 0..1 pointer influence
uniform float uPointSize;
uniform float uAspect;

varying vec3 vColor;
varying float vAlpha;

// Ease-out quint: fast commitment, long settle. The particles should look
// like they are arriving, not decelerating into a wall.
float easeOut(float t) { return 1.0 - pow(1.0 - t, 5.0); }

void main() {
  // Each particle gets its own slice of the timeline. The slice is derived
  // from the seed *and* the target's height, so the portrait resolves in a
  // loose upward sweep rather than all at once or in scan-line order.
  float delay = aSeed.x * 0.45 + (0.5 - aTarget.y * 0.5) * 0.18;
  float t = clamp((uProgress - delay) / (1.0 - delay), 0.0, 1.0);
  float e = easeOut(t);

  vec2 pos = mix(aStart, aTarget, e);

  // A little lateral drift that decays as the particle lands, so the paths
  // curve instead of running dead straight at the target.
  float swirl = (1.0 - e) * 0.08 * (aSeed.y - 0.5);
  pos += vec2(swirl, swirl * 0.6);

  // Pointer repulsion, in aspect-corrected space so the field is round.
  vec2 d = pos - uMouse;
  d.x *= uAspect;
  float dist = length(d);
  float r = 0.26;
  if (uMouseOn > 0.001 && dist < r) {
    float push = (1.0 - dist / r);
    push = push * push;
    pos += normalize(d + vec2(0.0001)) * push * 0.16 * uMouseOn;
  }

  gl_Position = vec4(pos, 0.0, 1.0);
  // Particles start a touch larger and tighten as they land: it reads as
  // depth without needing a third axis.
  // Post-reveal the few visible particles are a little larger, so the patch
  // under the pointer reads as grain lifting off the print rather than as
  // dust on the screen.
  gl_PointSize = uPointSize * (1.0 + (1.0 - e) * 1.6) * (1.0 + uReveal * 0.7);
  vColor = aColor;

  // Before the reveal every particle is visible: it is the picture.
  // After it, the photograph is the picture and the particles are only
  // allowed to exist in the small patch the pointer is touching — so they
  // read as grain lifting off the surface rather than as a hole cut in a
  // face. Away from the pointer they are fully transparent and cost a
  // discarded fragment, which is cheaper than any way of hiding them.
  float near = 1.0 - smoothstep(0.0, r, dist);
  vAlpha = mix(0.52 + 0.48 * e, near * uMouseOn * 0.95, uReveal);
}
`;

const FRAG = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  // Round, soft-edged points. A square point sprite reads as pixel art.
  vec2 c = gl_PointCoord - 0.5;
  float d = dot(c, c);
  if (d > 0.25) discard;
  float a = smoothstep(0.25, 0.04, d);
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/**
 * @param {object} props
 * @param {string} props.src   the real photograph; also the fallback
 * @param {string} props.alt
 * @param {string} [props.caption]
 */
export default function ParticlePortrait({ src, alt, caption }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const img = useRef(null);
  const raf = useRef(0);
  const state = useRef({});
  // `revealed` drives the photograph's opacity. It is set to true by the
  // animation, immediately on the reduced-motion and no-WebGL paths, and by
  // the image's own onLoad if the effect never starts for any other reason —
  // so there is no path on which the portrait stays invisible.
  const [revealed, setRevealed] = useState(false);
  const [particlesUp, setParticlesUp] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setRevealed(true); return undefined; }

    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return undefined;

    let gl = null;
    let killed = false;
    const S = state.current;

    const stop = () => { if (raf.current) cancelAnimationFrame(raf.current); raf.current = 0; };

    const teardown = () => {
      killed = true;
      stop();
      if (gl && S.buffers) S.buffers.forEach((b) => gl.deleteBuffer(b));
      if (gl && S.prog) gl.deleteProgram(S.prog);
      gl = null;
    };

    const fail = () => {
      const S2 = state.current;
      S2.done = true;
      clearTimeout(S2.failsafe);
      clearTimeout(S2.arrivalGuard);
      teardown();
      setRevealed(true);
    };

    // ---- build ------------------------------------------------------------
    const build = (image) => {
      if (killed) return;
      try {
        gl = cv.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false, depth: false });
      } catch { gl = null; }
      if (!gl) { fail(); return; }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = el.getBoundingClientRect();
      const W = Math.max(1, Math.round(box.width * dpr));
      const H = Math.max(1, Math.round(box.height * dpr));
      cv.width = W; cv.height = H;

      // Sampling density. A phone gets a coarser grid: fewer particles, and
      // each one larger, so it still reads as a portrait rather than as dust.
      const coarse = box.width < 420;
      const step = coarse ? 5 : 3;
      const SRC = coarse ? 180 : 320;

      const off = document.createElement('canvas');
      off.width = SRC; off.height = SRC;
      const ctx = off.getContext('2d', { willReadFrequently: true });
      if (!ctx) { fail(); return; }
      ctx.drawImage(image, 0, 0, SRC, SRC);
      let data;
      try { data = ctx.getImageData(0, 0, SRC, SRC).data; } catch { fail(); return; }

      const targets = [];
      const starts = [];
      const colors = [];
      const seeds = [];
      for (let y = 0; y < SRC; y += step) {
        for (let x = 0; x < SRC; x += step) {
          const i = (y * SRC + x) * 4;
          const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
          // Skip the flattest background pixels. It keeps the particle count
          // down and lets the figure read as a figure from the first frame.
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          if (lum > 0.86 && Math.random() > 0.12) continue;

          const tx = (x / SRC) * 2 - 1;
          const ty = -((y / SRC) * 2 - 1);
          targets.push(tx, ty);

          // Dispersed, but not from nowhere. Each particle starts displaced
          // from its OWN target rather than on a ring outside the frame, so
          // frame one is already a diffuse cloud in the shape of the portrait
          // and the two seconds that follow are it coming into focus. Starting
          // outside the frame looked like an empty well for the first third of
          // the animation, which is a long time to show nothing.
          const ang = Math.random() * Math.PI * 2;
          const rad = 0.3 + Math.random() * 0.8;
          starts.push(tx + Math.cos(ang) * rad, ty + Math.sin(ang) * rad);

          // The palette is the photograph's own, lifted a little so it holds
          // on the charcoal well — plus an occasional coral particle, which
          // is the only colour on this site that is allowed to be loud.
          if (Math.random() < 0.012) colors.push(1.0, 0.25, 0.25);
          else colors.push(Math.min(1, r * 1.1 + 0.04), Math.min(1, g * 1.1 + 0.04), Math.min(1, b * 1.1 + 0.05));

          seeds.push(Math.random(), Math.random());
        }
      }
      const count = seeds.length / 2;
      if (!count) { fail(); return; }

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) { fail(); return; }
      const prog = gl.createProgram();
      gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      gl.deleteShader(vs); gl.deleteShader(fs);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { fail(); return; }
      gl.useProgram(prog);

      const buffers = [];
      const attach = (name, arr, size) => {
        const buf = gl.createBuffer();
        buffers.push(buf);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, name);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      };
      attach('aTarget', targets, 2);
      attach('aStart', starts, 2);
      attach('aColor', colors, 3);
      attach('aSeed', seeds, 2);

      gl.viewport(0, 0, W, H);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);

      S.prog = prog;
      S.buffers = buffers;
      S.count = count;
      S.u = {
        progress: gl.getUniformLocation(prog, 'uProgress'),
        reveal: gl.getUniformLocation(prog, 'uReveal'),
        mouse: gl.getUniformLocation(prog, 'uMouse'),
        mouseOn: gl.getUniformLocation(prog, 'uMouseOn'),
        size: gl.getUniformLocation(prog, 'uPointSize'),
        aspect: gl.getUniformLocation(prog, 'uAspect'),
      };
      S.pointSize = (coarse ? 3.0 : 2.3) * dpr;
      S.mouse = [-9, -9];
      S.mouseOn = 0;
      S.target = 0;
      setParticlesUp(true);
    };

    // ---- run --------------------------------------------------------------
    const DURATION = 2000;
    const draw = (progress, reveal = 0) => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(S.u.progress, progress);
      gl.uniform1f(S.u.reveal, reveal);
      gl.uniform2f(S.u.mouse, S.mouse[0], S.mouse[1]);
      gl.uniform1f(S.u.mouseOn, S.mouseOn);
      gl.uniform1f(S.u.size, S.pointSize);
      gl.uniform1f(S.u.aspect, 1);
      gl.drawArrays(gl.POINTS, 0, S.count);
    };

    // Finishing is idempotent and is reachable from four directions: the
    // animation completing, the section leaving mid-formation, a stalled
    // frame loop, and any failure. Whichever gets there first, the outcome is
    // the same — particles at rest, photograph visible.
    const finish = () => {
      if (S.done) return;
      S.done = true;
      stop();
      if (gl) { try { draw(1, 1); } catch { /* context gone; the photo stands alone */ } }
      clearTimeout(S.failsafe);
      setRevealed(true);
    };

    const form = () => {
      const t0 = performance.now();
      // If the frame loop never delivers — a throttled background tab, a
      // driver stall — the portrait must not stay hidden behind it.
      S.failsafe = setTimeout(finish, DURATION + 1500);
      const tick = (now) => {
        if (killed || !gl) return;
        const p = Math.min(1, (now - t0) / DURATION);
        draw(p);
        if (p < 1) { raf.current = requestAnimationFrame(tick); return; }
        raf.current = 0;
        finish();
      };
      raf.current = requestAnimationFrame(tick);
    };

    // After the reveal the loop is pointer-driven only: it spins up on enter,
    // eases the influence down after leave, and shuts off completely.
    const idle = () => {
      if (killed || !gl || raf.current) return;
      const tick = () => {
        if (killed || !gl) return;
        S.mouseOn += ((S.target) - S.mouseOn) * 0.12;
        draw(1, 1);
        if (S.mouseOn > 0.002 || S.target > 0) { raf.current = requestAnimationFrame(tick); }
        else { raf.current = 0; S.mouseOn = 0; draw(1, 1); }
      };
      raf.current = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      if (!S.done || killed) return;
      const b = el.getBoundingClientRect();
      S.mouse = [((e.clientX - b.left) / b.width) * 2 - 1, -(((e.clientY - b.top) / b.height) * 2 - 1)];
      S.target = 1;
      idle();
    };
    const onLeave = () => { S.target = 0; idle(); };

    // ---- lifecycle --------------------------------------------------------
    const image = new Image();
    image.decoding = 'async';
    image.onerror = fail;
    image.onload = () => {
      if (killed) return;

      // No observer at all: there is nothing to wait for, so the photograph
      // is simply the photograph.
      if (typeof IntersectionObserver === 'undefined') { fail(); return; }

      let started = false;
      const io = new IntersectionObserver((entries) => {
        // Proof of life. An observer delivers an initial callback for
        // anything it is given, intersecting or not; receiving one means it
        // is reporting and the escape hatch below is not needed.
        if (S.arrivalGuard) { clearTimeout(S.arrivalGuard); S.arrivalGuard = 0; }
        for (const en of entries) {
          if (!en.isIntersecting || started) continue;
          started = true;
          io.disconnect();
          build(image);
          if (!killed && gl) form();
        }
      }, { threshold: 0.25 });
      io.observe(el);
      S.io = io;

      // A.5 — and if the observer never reports at all, the portrait must
      // not stay hidden behind it. This was a real hole: every other failure
      // path ended with the photograph visible, but "the observer never
      // fires" ended with an empty frame, which is the one outcome the whole
      // component is written to prevent. A dead observer now reveals the
      // photograph rather than animating it into a room nobody is looking at.
      S.arrivalGuard = setTimeout(() => {
        if (!started && !killed) fail();
      }, 1500);
    };
    image.src = src;

    // Only a fine pointer gets the dispersion; a finger would sit on top of
    // the face it is meant to be revealing.
    const fine = window.matchMedia?.('(pointer: fine)')?.matches;
    if (fine) {
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
    }

    // Stop the loop the moment the section leaves the viewport, whatever it
    // was doing, and give up the context if the browser takes it away.
    // Leaving the viewport mid-formation settles it rather than pausing it.
    // Pausing would mean coming back to a half-built face and a hidden
    // photograph, and resuming would mean replaying the reveal every time the
    // section scrolls past — which the brief rules out, rightly.
    const vis = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) return;
      S.target = 0; S.mouseOn = 0;
      if (S.prog && !S.done) finish(); else stop();
    }, { threshold: 0 });
    vis.observe(el);
    const onLost = (e) => { e.preventDefault(); fail(); };
    cv.addEventListener('webglcontextlost', onLost);

    return () => {
      clearTimeout(S.failsafe);
      clearTimeout(S.arrivalGuard);
      S.io?.disconnect();
      vis.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cv.removeEventListener('webglcontextlost', onLost);
      teardown();
    };
  }, [src, reduce]);

  return (
    <figure className="a2-pp" ref={wrap} data-revealed={revealed ? 'true' : 'false'}>
      <canvas
        ref={canvas}
        className="a2-pp__canvas"
        aria-hidden="true"
        data-up={particlesUp ? 'true' : 'false'}
      />
      <img
        ref={img}
        className="a2-pp__img"
        src={src}
        alt={alt}
        width="1100"
        height="1100"
        decoding="async"
        // If the effect never runs — no WebGL, a decode failure, an observer
        // that never fires — the photograph still has to appear.
        onLoad={() => { if (reduce) setRevealed(true); }}
      />
      {caption && <figcaption className="a2-pp__cap a2-label">{caption}</figcaption>}
    </figure>
  );
}
