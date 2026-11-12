// The hint strip under an exhibit. Says what the controls are, in words,
// rather than leaving a visitor to discover that a drawing is draggable.
import React from 'react';

export default function StageHint({ children }) {
  return <p className="a2-stage__hint a2-mono">{children}</p>;
}
