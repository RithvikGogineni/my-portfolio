// ===========================================================================
// A.3 — OTHER WORK
//
// An index, not a second gallery of flagships. Each entry is a ruled row with
// its number, its status and two short paragraphs; the six case studies stay
// the only things on this site big enough to open.
//
// The row deliberately does not expand, hover or seat itself. The index above
// it is the interactive one, and two interactive numbered lists on one page
// teach a visitor that numbered lists are unreliable.
//
// Where a project has no artifact, the row says so in the same periwinkle
// "awaiting" voice the illustrative media uses elsewhere — the point of this
// section is that the reader can tell at a glance which rows have evidence
// behind them and which are a description and a date.
// ===========================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal, RevealItem, RiseIn } from '../../motion/motion';
import { otherWork, colophonNote } from '../../content/other';

function Row({ e }) {
  return (
    <RevealItem as="li" className="a2-other__item" id={e.id}>
      <div className="a2-other__head">
        <span className="a2-mono a2-other__n">{e.n}</span>
        <h3 className="a2-display a2-other__title">{e.title}</h3>
        <span className="a2-other__tags">
          <span className="a2-mono a2-other__kind">{e.kind}</span>
          {/* Status is a chip, not a sentence, because its job is to be read
              before the prose rather than after it. */}
          <span className="a2-tag a2-ch-s a2-chamfer a2-other__status">{e.status}</span>
          <span className="a2-mono a2-label--dim a2-other__when">{e.when}</span>
        </span>
      </div>

      <div className="a2-other__body">
        <div className="a2-other__text">
          <p className="a2-read a2-other__sum">{e.summary}</p>
          <p className="a2-read a2-other__detail">{e.detail}</p>
          <p className="a2-note a2-other__owned">
            <span className="a2-label a2-label--dim">What I did — </span>
            {e.ownership}
          </p>
          {e.note && <p className="a2-note a2-other__note">{e.note}</p>}
          {e.missing && (
            <p className="a2-mono a2-other__missing">{e.missing}</p>
          )}

          {(e.href || e.to) && (
            <p className="a2-other__links">
              {e.href && (
                <a className="a2-mono a2-other__link" href={e.href} target="_blank" rel="noreferrer noopener">
                  [ Visit the site ↗ ]
                </a>
              )}
              {e.to && (
                <Link className="a2-mono a2-other__link" to={e.to}>[ {e.toLabel} ]</Link>
              )}
            </p>
          )}
        </div>

        {e.media && (
          <figure className="a2-other__well a2-well a2-ch-m">
            <img src={e.media.src} alt={e.media.alt} loading="lazy" decoding="async" />
            {e.media.note && (
              <figcaption className="a2-well__need a2-mono">{e.media.note}</figcaption>
            )}
          </figure>
        )}
      </div>
    </RevealItem>
  );
}

export default function OtherWork() {
  return (
    <div className="a2-other">
      <Reveal as="ol" className="a2-other__rows">
        {otherWork.map((e) => <Row e={e} key={e.id} />)}
      </Reveal>

      <RiseIn className="a2-other__colophon" id={colophonNote.id}>
        <h3 className="a2-label a2-other__colophonHead">{colophonNote.heading}</h3>
        <p className="a2-note">{colophonNote.body}</p>
      </RiseIn>
    </div>
  );
}
