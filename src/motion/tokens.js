// ===========================================================================
// A.2 — MOTION TOKENS
//
// One curve family, one duration scale. The approved sheet allows 150–450ms,
// ease-out, for state changes; it forbids parallax, scroll-jacking and cursor
// effects. Everything here obeys that. Entrances ease out, exits ease in and
// run shorter, repositioning eases in-out. Spring is reserved for the two
// mechanical exhibits, where a settling mass is the point.
// ===========================================================================

export const EASE = {
  out: [0.22, 1, 0.36, 1],
  in: [0.64, 0, 0.78, 0],
  inOut: [0.65, 0, 0.35, 1],
  mech: [0.34, 0.9, 0.2, 1],
};

export const DUR = {
  press: 0.12,
  control: 0.18,
  state: 0.24,
  panel: 0.32,
  cine: 0.45,
};

// Shared transition presets, so no component invents its own timing.
export const T = {
  control: { duration: DUR.control, ease: EASE.out },
  state: { duration: DUR.state, ease: EASE.out },
  exit: { duration: DUR.control, ease: EASE.in },
  move: { duration: DUR.state, ease: EASE.inOut },
  panel: { duration: DUR.panel, ease: EASE.out },
  cine: { duration: DUR.cine, ease: EASE.out },
  // A settling mass: used only by the hero assembly and the exploded viewer.
  mech: { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 },
};

// Entrance distance. Small enough that a reveal never reads as a slideshow.
export const RISE = 18;
