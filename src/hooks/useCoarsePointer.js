import { useMediaQuery } from './useMediaQuery';

/**
 * True when the viewport is a coarse pointer — i.e. hover cannot be relied on.
 * Every hover affordance on the site has a tap equivalent gated on this, and
 * no exhibit names a key that the device does not have.
 */
export function useCoarsePointer() {
  return useMediaQuery('(hover: none), (pointer: coarse)');
}
