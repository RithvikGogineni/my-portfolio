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

// ---------------------------------------------------------------------------
// A.5 — INTENSITY TIERS
//
// A.4's problem was not that motion was wrong, it was that it was uniform:
// every block on the page arrived with the same 18px rise and the same 450ms
// fade, so nothing on the page was louder than anything else. These four
// tiers are how a section says how much it matters. They change distance,
// duration and stagger together — the three things the eye reads as weight.
//
//   signature — the hero name, the portrait. Once per page, ideally.
//   feature   — the flagship, the contact finale.
//   support   — index rows, case-study modules.
//   quiet     — Other work, Practice. Present, barely noticed.
// ---------------------------------------------------------------------------
export const TIER = {
  signature: { rise: 34, duration: 0.72, step: 0.085, ease: EASE.out },
  feature:   { rise: 26, duration: 0.56, step: 0.065, ease: EASE.out },
  support:   { rise: 18, duration: 0.45, step: 0.05,  ease: EASE.out },
  quiet:     { rise: 10, duration: 0.34, step: 0.035, ease: EASE.out },
};

// Clip-path insets for a wipe. A masked reveal is the one entrance that
// cannot be mistaken for a fade, and it suits a site built on drawing sheets:
// the image is uncovered rather than faded up.
export const WIPE = {
  up:    'inset(100% 0 0 0)',
  down:  'inset(0 0 100% 0)',
  left:  'inset(0 100% 0 0)',
  right: 'inset(0 0 0 100%)',
  open:  'inset(0 0 0 0)',
};
