// ===========================================================================
// THE SHEET THAT ISN'T THERE
//
// One component for every way of arriving somewhere that does not exist: an
// unknown path, a stale `/work/:slug`, and the two routes that were retired
// on purpose. They differ only in what they can honestly say, so they share
// the sheet and differ in copy.
//
// Nothing here redirects. A visitor who followed a link they had saved is
// owed an explanation and a way forward; moving them silently to the home
// page gives them neither, and looks exactly like the link being broken.
// ===========================================================================
import React, { useEffect } from 'react';
import SheetHead from '../../components/a2/SheetHead';
import Button from '../../components/a2/Button';
import { Colophon } from '../../components/a2/Chrome';
import { RiseIn } from '../../motion/motion';
import { applyMeta } from '../../lib/meta';
import { site } from '../../content/site';

/**
 * @param {object}  props
 * @param {string}  props.name   the sheet title, e.g. "Sheet not found"
 * @param {node}    props.lede   one sentence naming what was asked for
 * @param {string}  props.body   what happened to it and what to do instead
 * @param {string}  [props.path] the path asked for, for the canonical
 */
export default function NotFound({ name, lede, body, path = '/404' }) {
  useEffect(() => {
    applyMeta({
      title: `${name} · Rithvik Gogineni`,
      description: 'This page is not part of the current edition of the site.',
      path,
      // A retired or missing route should not accumulate search results of
      // its own; the redirect map is what carries the old URLs' weight.
      robots: 'noindex,follow',
    });
  }, [name, path]);

  return (
    <>
      <main id="main">
        <section className="a2-sheet a2-section a2-missing">
          <SheetHead name={name} sheet="—" as="h1" />
          <RiseIn as="p" className="a2-lede a2-missing__lede">{lede}</RiseIn>
          <RiseIn as="p" className="a2-read a2-missing__body" delay={0.06}>{body}</RiseIn>
          <RiseIn className="a2-missing__cta" delay={0.12}>
            <Button to="/#index" tone="accent">Index of work</Button>
            <Button to="/#contact" tone="ghost">Contact</Button>
            <a className="a2-mono a2-missing__resume" href={site.resume.href}>
              [ {site.resume.label} ]
            </a>
          </RiseIn>
        </section>
      </main>
      <Colophon sheet="—" />
    </>
  );
}
