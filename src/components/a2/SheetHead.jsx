// The label strip that opens a section: number and name left, sheet count
// right, one hard rule under both. The rule draws itself once on arrival.
import React from 'react';
import { DrawIn } from '../../motion/motion';

export default function SheetHead({ n, name, sheet, of, id }) {
  return (
    <div className="a2-sheet-head" id={id}>
      <span className="a2-label">
        {n ? `${n} — ` : ''}{name}
      </span>
      {sheet && (
        <span className="a2-label a2-label--dim">
          Sheet {sheet}{of ? ` / ${of}` : ''}
        </span>
      )}
      <DrawIn className="a2-sheet-head__rule" />
    </div>
  );
}
