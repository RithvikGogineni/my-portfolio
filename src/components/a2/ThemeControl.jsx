// A segmented Light / Dark / System control. The selected state is shown by
// fill, not colour alone, so it survives a monochrome or forced-colours view.
//
// The indicator is one third-width element translated between the segments:
// a transform-only move, so it costs no layout and the lean motion bundle
// (domAnimation) is enough — no layout animations are pulled in. Sliding is a
// repositioning move, so it eases in-out at 240ms while the labels cross-fade.
import React from 'react';
import { m } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { T } from '../../motion/tokens';

const LABEL = { light: 'Light', dark: 'Dark', system: 'System' };

export default function ThemeControl({ compact = false }) {
  const { mode, setMode, modes } = useTheme();
  const index = Math.max(0, modes.indexOf(mode));

  return (
    <div
      className={`a2-seg a2-ch-s${compact ? ' a2-seg--compact' : ''}`}
      role="radiogroup"
      aria-label="Colour theme"
      style={{ '--seg-count': modes.length }}
    >
      <m.span
        className="a2-seg__fill a2-ch-s a2-chamfer"
        aria-hidden="true"
        initial={false}
        animate={{ x: `${index * 100}%` }}
        transition={T.move}
      />
      {modes.map((m0) => (
        <button
          key={m0}
          type="button"
          role="radio"
          aria-checked={mode === m0}
          className={`a2-seg__btn${mode === m0 ? ' is-on' : ''}`}
          onClick={() => setMode(m0)}
        >
          {LABEL[m0]}
        </button>
      ))}
    </div>
  );
}
