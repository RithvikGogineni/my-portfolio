// ===========================================================================
// A.2 — MOTION PRIMITIVES
//
// Four primitives cover the whole site. Each one is layout-stable: nothing
// here changes an element's box, so a reveal can never shift the page or
// re-break a heading. All of them are one-shot entrances played on arrival —
// the sheet's rule is that nothing moves *with* the scroll, only *on arrival*.
//
// Arrival comes from useArrived, which falls back to showing the content if
// the viewport observer never reports. An entrance is an enhancement; the
// content underneath it is not optional.
// ===========================================================================
import React, { useRef } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { useArrived } from '../hooks/useArrived';
import { EASE, DUR, RISE } from './tokens';

const riseVariants = {
  hidden: { opacity: 0, y: RISE },
  show: { opacity: 1, y: 0, transition: { duration: DUR.cine, ease: EASE.out } },
};

const groupVariants = (step, delay) => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});

/** A group whose children rise in sequence once the group arrives. */
export function Reveal({ as = 'div', step = 0.055, delay = 0, children, ...rest }) {
  const C = m[as] ?? m.div;
  const ref = useRef(null);
  const arrived = useArrived(ref);
  return (
    <C
      ref={ref}
      variants={groupVariants(step, delay)}
      initial="hidden"
      animate={arrived ? 'show' : 'hidden'}
      {...rest}
    >
      {children}
    </C>
  );
}

/** One child of a Reveal group. */
export function RevealItem({ as = 'div', children, ...rest }) {
  const C = m[as] ?? m.div;
  return <C variants={riseVariants} {...rest}>{children}</C>;
}

/** A standalone element that rises in on arrival, with no group around it. */
export function RiseIn({ as = 'div', delay = 0, children, ...rest }) {
  const C = m[as] ?? m.div;
  const ref = useRef(null);
  const arrived = useArrived(ref);
  return (
    <C
      ref={ref}
      initial={{ opacity: 0, y: RISE }}
      animate={arrived ? { opacity: 1, y: 0 } : { opacity: 0, y: RISE }}
      transition={{ duration: DUR.cine, ease: EASE.out, delay }}
      {...rest}
    >
      {children}
    </C>
  );
}

// ---------------------------------------------------------------------------
// MaskedLines — the kinetic-typography primitive.
//
// Display lines are pre-broken by the author and each is clipped by its own
// box, so a line slides up from under its own baseline. Because the breaks are
// explicit and the boxes never resize, the heading cannot re-wrap mid-animation
// and the text stays real, selectable and in the accessibility tree.
//
// `immediate` plays on mount instead of on arrival. Use it for anything above
// the fold: a nameplate should not wait on a viewport observer to exist.
// ---------------------------------------------------------------------------
export function MaskedLines({
  lines,
  stop = false,
  as: Tag = 'h2',
  className = '',
  lineClassName = '',
  step = 0.075,
  delay = 0,
  immediate = false,
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const arrived = useArrived(ref, { enabled: !immediate && !reduce });
  const show = immediate || reduce || arrived;

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span className={`a2-mask ${lineClassName}`} key={i}>
          <m.span
            className="a2-mask__in"
            initial={reduce ? false : { y: '105%' }}
            animate={show ? { y: '0%' } : { y: '105%' }}
            transition={{ duration: DUR.cine, ease: EASE.out, delay: delay + i * step }}
          >
            {line}
            {/* The coral stop is a mark, not punctuation: it rides inside the
                last line so it tracks the type at every size, and it is hidden
                from assistive technology because it is not read. */}
            {stop && i === lines.length - 1 && <span className="a2-stop" aria-hidden="true" />}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// DrawIn — a technical line that draws itself once, on arrival.
// Pure transform on a decorative element; no layout, nothing to trap.
// ---------------------------------------------------------------------------
export function DrawIn({ className = '', delay = 0, origin = 'left' }) {
  const ref = useRef(null);
  const arrived = useArrived(ref);
  return (
    <m.span
      ref={ref}
      className={`a2-draw ${className}`}
      style={{ transformOrigin: origin }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: arrived ? 1 : 0 }}
      transition={{ duration: DUR.cine, ease: EASE.out, delay }}
      aria-hidden="true"
    />
  );
}
