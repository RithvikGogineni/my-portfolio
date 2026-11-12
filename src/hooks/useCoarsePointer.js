import { useEffect, useState } from 'react';

/**
 * True when the viewport is a coarse pointer — i.e. hover cannot be relied on.
 * Every hover affordance on the site has a tap equivalent gated on this.
 */
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const q = window.matchMedia('(hover: none), (pointer: coarse)');
    const sync = () => setCoarse(q.matches);
    sync();
    q.addEventListener('change', sync);
    return () => q.removeEventListener('change', sync);
  }, []);
  return coarse;
}
