// ===========================================================================
// A.2 — ORBIT STAGE
//
// The shared interaction surface behind both engineering exhibits. It owns the
// camera and nothing else: the drawing, the hotspots and the annotations are
// supplied by whichever exhibit is using it.
//
// Input, in order of priority:
//   • pointer drag — horizontal spins the part, vertical tilts it
//   • keyboard     — arrows orbit, +/− zoom, 0 resets, when the stage is focused
//   • wheel        — zoom, only once the stage has focus, so the page can still
//                    be scrolled over the exhibit without being captured
//   • preset views — named viewpoints from the schema
//
// Touch: a one-finger drag orbits. The stage sets `touch-action: none` only
// while a drag is actually in progress, so a vertical flick that starts on the
// exhibit still scrolls the page rather than being swallowed by it.
//
// The camera is held in a ref and mirrored into state, so a fast drag is never
// queued behind React — the drawing tracks the pointer in the same frame.
// ===========================================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { clampCamera } from '../lib/projection';


const KEY_STEP = 9;              // degrees per arrow press
const ZOOM_STEP = 0.12;




export function useOrbit(initial, { zoom = true } = {}) {
  const base = { yaw: 0, pitch: 90, scale: 1, ...initial };
  const [cam, setCam] = useState(() => clampCamera(base));
  const camRef = useRef(cam);
  const [dragging, setDragging] = useState(false);

  const apply = useCallback((next) => {
    const c = clampCamera(typeof next === 'function' ? next(camRef.current) : next);
    camRef.current = c;
    setCam(c);
  }, []);

  const reset = useCallback(() => apply(base), [apply]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- pointer -------------------------------------------------------------
  const drag = useRef(null);

  const onPointerDown = useCallback((e) => {
    // Let real controls layered over the stage keep their own clicks.
    if (e.target.closest('[data-stage-control]')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(true);
  }, []);

  const onPointerMove = useCallback((e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.moved += Math.abs(dx) + Math.abs(dy);
    d.x = e.clientX;
    d.y = e.clientY;
    apply((c) => ({ ...c, yaw: c.yaw + dx * 0.55, pitch: c.pitch - dy * 0.45 }));
  }, [apply]);

  const endDrag = useCallback((e) => {
    const d = drag.current;
    if (!d) return;
    e?.currentTarget?.releasePointerCapture?.(d.id);
    drag.current = null;
    setDragging(false);
  }, []);

  // --- keyboard ------------------------------------------------------------
  const onKeyDown = useCallback((e) => {
    const k = e.key;
    const step = e.shiftKey ? KEY_STEP * 3 : KEY_STEP;
    let handled = true;
    if (k === 'ArrowLeft') apply((c) => ({ ...c, yaw: c.yaw - step }));
    else if (k === 'ArrowRight') apply((c) => ({ ...c, yaw: c.yaw + step }));
    else if (k === 'ArrowUp') apply((c) => ({ ...c, pitch: c.pitch + step }));
    else if (k === 'ArrowDown') apply((c) => ({ ...c, pitch: c.pitch - step }));
    else if (zoom && (k === '+' || k === '=')) apply((c) => ({ ...c, scale: c.scale + ZOOM_STEP }));
    else if (zoom && (k === '-' || k === '_')) apply((c) => ({ ...c, scale: c.scale - ZOOM_STEP }));
    else if (k === '0') reset();
    else handled = false;
    if (handled) e.preventDefault();
  }, [apply, reset, zoom]);

  // --- wheel ---------------------------------------------------------------
  // Attached non-passively, and only while focused, so the exhibit never
  // steals a scroll the visitor meant for the page.
  const stageRef = useRef(null);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !zoom || !focused) return;
    const onWheel = (e) => {
      e.preventDefault();
      apply((c) => ({ ...c, scale: c.scale - Math.sign(e.deltaY) * ZOOM_STEP }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [apply, zoom, focused]);

  return {
    cam,
    setCam: apply,
    reset,
    dragging,
    stageRef,
    bind: {
      ref: stageRef,
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onKeyDown,
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      style: { touchAction: dragging ? 'none' : 'pan-y' },
    },
  };
}
