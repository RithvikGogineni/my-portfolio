// A segmented Light / Dark / System control. The selected state is shown by
// fill, not colour alone, so it survives a monochrome or forced-colours view.
//
// The indicator is one third-width element translated between the segments:
// a transform-only move, so it costs no layout and the lean motion bundle
// (domAnimation) is enough — no layout animations are pulled in. Sliding is a
// repositioning move, so it eases in-out at 240ms while the labels cross-fade.
//
// Below 760px it becomes one chip that cycles, for two reasons that happen to
// point the same way. On a phone three segments measure 182px — 47% of a
// 390px viewport — beside a 24px monogram, which leaves no room for the index
// affordance the approved mobile sheet puts in the same header. And between
// 621px and 723px, where the destinations are laid across the header again,
// the segmented control does not fit beside them at all: it ran off the right
// edge and took the document's scroll width with it. The chip carries the
// same three states in a third of the width, which clears both.
//
// The cut is its own query, not the one the index uses, because it answers
// its own question — see HEAD_TIGHT.
import React from 'react';
import { m } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useMediaQuery, HEAD_TIGHT } from '../../hooks/useMediaQuery';
import { T } from '../../motion/tokens';

const LABEL = { light: 'Light', dark: 'Dark', system: 'System' };
// Abbreviations, not icons: a glyph would have to carry the state on its own,
// and the sheet's voice here is mono text.
const SHORT = { light: 'Lgt', dark: 'Drk', system: 'Sys' };

export default function ThemeControl({ compact = false }) {
  const { mode, setMode, modes } = useTheme();
  const tight = useMediaQuery(HEAD_TIGHT);
  const index = Math.max(0, modes.indexOf(mode));

  if (tight) {
    const next = modes[(index + 1) % modes.length];
    return (
      <button
        type="button"
        className="a2-chip a2-chip--theme a2-ch-s"
        onClick={() => setMode(next)}
        // The abbreviation is for the eye. The accessible name says which
        // theme is on and what pressing this will do, because a cycling
        // control that only announces its current value tells a
        // screen-reader user nothing about where the press leads.
        aria-label={`Colour theme: ${LABEL[mode]}. Switch to ${LABEL[next]}.`}
      >
        <span aria-hidden="true">{SHORT[mode]}</span>
      </button>
    );
  }

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
