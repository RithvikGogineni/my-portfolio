// Single motion system for the site (Framer Motion only).
// One easing curve, one distance, one duration scale, so every section moves
// the same way. MotionConfig reducedMotion="user" in App turns transforms off
// for people who ask their OS for less motion.
import React, { useEffect, useRef } from 'react';
import { m, animate, useInView } from 'framer-motion';
import { EASE, reveal, stagger } from './variants';

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' };

// Fades + lifts its children into place the first time they scroll into view.
// Children that use `variants={reveal}` are staggered automatically.
export const Reveal = ({ as = 'div', step = 0.08, delay = 0, className, children, ...rest }) => {
  const Component = m[as];
  return (
    <Component
      className={className}
      variants={stagger(step, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </Component>
  );
};

export const RevealItem = ({ as = 'div', className, children, ...rest }) => {
  const Component = m[as];
  return (
    <Component className={className} variants={reveal} {...rest}>
      {children}
    </Component>
  );
};

// Standard section header: title + subtitle rise in together.
export const SectionHeader = ({ title, subtitle }) => (
  <Reveal className="section-header">
    <RevealItem as="h2" className="section-title">{title}</RevealItem>
    {subtitle && <RevealItem as="p" className="section-subtitle">{subtitle}</RevealItem>}
  </Reveal>
);

// Counts a stat like "110+" or "3rd" up from zero when it scrolls into view.
// Non-numeric values ("Captain") render as-is.
export const CountUp = ({ value, className }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const match = /^(\d+)(.*)$/.exec(String(value));

  useEffect(() => {
    if (!match || !inView || !ref.current) return;
    const target = Number(match[1]);
    const suffix = match[2];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      ref.current.textContent = `${target}${suffix}`;
      return;
    }
    const controls = animate(0, target, {
      duration: 1.2,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      {match ? `0${match[2]}` : value}
    </span>
  );
};
