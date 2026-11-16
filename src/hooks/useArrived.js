import { useEffect, useState } from 'react';

/**
 * True once an element has arrived in the viewport — or once a failsafe has
 * elapsed, whichever happens first.
 *
 * Entrance animations start hidden, so anything gated on viewport detection
 * is content that does not exist until the detector fires. IntersectionObserver
 * does not always fire: a page that is prerendered, restored into a background
 * tab, or rendered by an embedded/offscreen view can go a long time without a
 * single callback, and the result is a blank page that looks broken.
 *
 * So the rule here is that arrival is a progressive enhancement. The observer
 * makes the entrance well-timed; the failsafe guarantees the content appears
 * regardless. It is also the reduced-motion and no-IO path, since both resolve
 * to "show it now".
 *
 * ---------------------------------------------------------------------------
 * A.5 — WHY THE FAILSAFE IS NOW CONDITIONAL
 *
 * The failsafe used to be an unconditional 1100ms timer. That meant every
 * element on the page — including everything far below the fold — flipped to
 * `arrived` 1.1 seconds after load, whether or not it had been anywhere near
 * the viewport. Each entrance did play; it played to an empty room, and by
 * the time a reader scrolled down, every section was already in its final
 * state. The site had scroll choreography in the source and none on screen.
 * The A.5 audit found almost nothing animating during a full scroll pass and
 * this was the reason.
 *
 * The fix keeps the original protection exactly and costs nothing. An
 * IntersectionObserver delivers an initial callback for every element it is
 * given, intersecting or not, very shortly after `observe()`. So:
 *
 *   • any callback at all  → the observer works. Cancel the failsafe and wait
 *                            for a real intersection, however long that takes.
 *   • no callback in 1.5s  → the observer is not reporting, which is the
 *                            failure this guard was written for. Reveal.
 *
 * A prerendered or backgrounded document still gets its content. A reader who
 * takes ten seconds to reach sheet 06 now sees sheet 06 arrive.
 */
export function useArrived(ref, { margin = '0px 0px -10% 0px', failsafe = 1500, enabled = true } = {}) {
  const [arrived, setArrived] = useState(!enabled);

  useEffect(() => {
    if (arrived || !enabled) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setArrived(true);
      return;
    }

    let settled = false;
    let timer = 0;
    const finish = () => {
      if (settled) return;
      settled = true;
      setArrived(true);
    };

    const io = new IntersectionObserver(
      (entries) => {
        // Proof of life: the observer is delivering, so the timed escape
        // hatch is not needed and would only cut the entrance short.
        if (timer) { clearTimeout(timer); timer = 0; }
        if (entries.some((e) => e.isIntersecting)) finish();
      },
      { rootMargin: margin },
    );
    io.observe(el);
    timer = setTimeout(finish, failsafe);

    return () => { io.disconnect(); if (timer) clearTimeout(timer); };
  }, [arrived, enabled, failsafe, margin, ref]);

  return arrived;
}
