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
 */
export function useArrived(ref, { margin = '0px 0px -10% 0px', failsafe = 1100, enabled = true } = {}) {
  const [arrived, setArrived] = useState(!enabled);

  useEffect(() => {
    if (arrived || !enabled) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setArrived(true);
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setArrived(true);
    };

    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) finish(); },
      { rootMargin: margin },
    );
    io.observe(el);
    const timer = setTimeout(finish, failsafe);

    return () => { io.disconnect(); clearTimeout(timer); };
  }, [arrived, enabled, failsafe, margin, ref]);

  return arrived;
}
