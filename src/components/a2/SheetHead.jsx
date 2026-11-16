// The label strip that opens a section: number and name left, sheet count
// right, one hard rule under both. The rule draws itself once on arrival.
import React from 'react';
import { DrawIn } from '../../motion/motion';

// `as` promotes the section label to a real heading. A section whose body
// carries its own display heading leaves this a span; a section whose title
// *is* this strip passes as="h2", so every sheet is reachable by heading
// navigation without changing a pixel.
export default function SheetHead({ n, name, sheet, of, id, as: Tag = 'span' }) {
  return (
    <div className="a2-sheet-head" id={id}>
      <Tag className="a2-label">
        {n ? `${n} — ` : ''}{name}
      </Tag>
      {sheet && (
        <span className="a2-label a2-label--dim">
          Sheet {sheet}{of ? ` / ${of}` : ''}
        </span>
      )}
      <DrawIn className="a2-sheet-head__rule" />
    </div>
  );
}
