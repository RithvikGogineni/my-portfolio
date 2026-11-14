// The hint strip under an exhibit. Says what the controls are, in words,
// rather than leaving a visitor to discover that a drawing is draggable.
//
// A phone has no arrow keys and no `0`, so naming them there is instructions
// for hardware the visitor does not have. `touch` is the same sentence written
// for the gestures that do exist. The hook is the one the project index
// already uses, so the site has one definition of "coarse pointer".
import React from 'react';
import { useCoarsePointer } from '../../hooks/useCoarsePointer';

export default function StageHint({ children, touch }) {
  const coarse = useCoarsePointer();
  return <p className="a2-stage__hint a2-mono">{coarse && touch ? touch : children}</p>;
}
