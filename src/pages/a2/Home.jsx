// ===========================================================================
// A.2 — HOME
// Sheet 01 Hero · 02 Featured · 03 Index of work · 04 Practice · 05 Contact
// ===========================================================================
import React from 'react';


import SheetHead from '../../components/a2/SheetHead';
import Button from '../../components/a2/Button';
import HeroExhibit from '../../components/a2/HeroExhibit';
import FeaturedInspect from '../../components/a2/FeaturedInspect';
import ProjectIndex from '../../components/a2/ProjectIndex';
import { Colophon } from '../../components/a2/Chrome';
import { MaskedLines, Reveal, RevealItem, RiseIn } from '../../motion/motion';
import { site, disciplines, practice } from '../../content/site';
import { featured, indexed } from '../../content/projects';

import portrait from '../../assets/images/profile-photo.webp';

export default function Home() {
  return (
    <>
      <main id="main">
        {/* ---------------------------------------------------- SHEET 01 */}
        <section className="a2-sheet a2-hero">
          <p className="a2-label a2-hero__sheet">
            Sheet 01 / 06 — Mechanical &amp; Robotics Engineering, WPI
          </p>

          <div className="a2-hero__grid">
            <div className="a2-hero__plate">
              <MaskedLines
                as="h1"
                className="a2-display a2-hero-type a2-hero__name"
                lines={site.nameLines}
                stop
                immediate
                step={0.085}
                delay={0.05}
              />

              <RiseIn as="p" className="a2-hero__rule" delay={0.45}>
                <span className="a2-hero__rule-line" aria-hidden="true" />
                <span className="a2-label">{site.rule}</span>
                <span className="a2-hero__rule-line" aria-hidden="true" />
              </RiseIn>
            </div>

            <div className="a2-hero__exhibit">
              <HeroExhibit />
            </div>
          </div>

          <Reveal className="a2-hero__foot" delay={0.1}>
            <RevealItem as="p" className="a2-lede">{site.lede}</RevealItem>
            <RevealItem as="ul" className="a2-hero__standing">
              {site.standing.map((s) => <li className="a2-read" key={s}>{s}</li>)}
            </RevealItem>
            <RevealItem className="a2-hero__cta">
              {site.availability.open && (
                <p className="a2-avail">
                  <span className="a2-avail__mark" aria-hidden="true" />
                  <span className="a2-read">{site.availability.line}</span>
                </p>
              )}
              <Button href="#contact" tone="accent">Get in touch</Button>
            </RevealItem>
          </Reveal>
        </section>

        {/* ---------------------------------------------------- SHEET 02 */}
        <section className="a2-sheet a2-section" id="work">
          <SheetHead n="01" name="Featured" sheet="02" of="06" />
          <div className="a2-feature">
            <div className="a2-feature__head">
              <MaskedLines
                as="h2"
                className="a2-display a2-section-type"
                lines={featured.titleLines}
                stop
                immediate
              />
              {/* The lede and the verified spec table share one band. The
                  approved sheet puts a flagship-candidates note to the right
                  of the lede, but that line is the design document talking to
                  me about which project to feature — not site copy — so the
                  space carries real facts instead of leaving 60% of the band
                  empty. */}
              <div className="a2-feature__intro">
                <RiseIn as="p" className="a2-lede a2-feature__lede">{featured.lede}</RiseIn>

                <Reveal as="dl" className="a2-meta a2-feature__meta">
                  {featured.facts.map((f) => (
                    <RevealItem className="a2-meta__row" key={f.label}>
                      <dt className="a2-label a2-label--dim">{f.label}</dt>
                      <dd className="a2-mono">{f.value}</dd>
                    </RevealItem>
                  ))}
                </Reveal>
              </div>
            </div>

            <RiseIn className="a2-feature__body">
              <FeaturedInspect systems={featured.systems} media={featured.media} />
            </RiseIn>

            <RiseIn className="a2-feature__cta">
              <Button to={`/work/${featured.slug}`} viewTransition tone="accent">
                Read the case study
              </Button>
            </RiseIn>
          </div>
        </section>

        {/* ---------------------------------------------------- SHEET 03 */}
        <section className="a2-sheet a2-section" id="index">
          <SheetHead n="02" name="Index of work" sheet="03" of="06" as="h2" />
          <ProjectIndex projects={indexed} />
        </section>

        {/* ---------------------------------------------------- SHEET 04 */}
        <section className="a2-sheet a2-section" id="practice">
          <SheetHead n="03" name="Practice" sheet="04" of="06" as="h2" />
          <div className="a2-practice">
            <RiseIn as="figure" className="a2-practice__well a2-well a2-ch-l">
              <figcaption className="a2-exhibit__bar">
                <span className="a2-label">Fig. 04 — Portrait</span>
              </figcaption>
              <img src={portrait} alt={`${site.name}.`} loading="lazy" decoding="async" width="1000" height="1250" />
            </RiseIn>

            <div className="a2-practice__body">
              <RiseIn as="p" className="a2-prose">
                {practice.statement.map((s, i) =>
                  s.voice
                    ? <em className="a2-voice" key={i}>{s.t}</em>
                    : <React.Fragment key={i}>{s.t}</React.Fragment>,
                )}
              </RiseIn>

              <Reveal as="ol" className="a2-disc">
                {disciplines.map((d, i) => (
                  <RevealItem as="li" className="a2-disc__item" key={d}>
                    <span className="a2-mono a2-disc__n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="a2-disc__name">{d}</span>
                  </RevealItem>
                ))}
              </Reveal>

              <Reveal as="ul" className="a2-teach">
                {practice.teaching.map((t) => (
                  <RevealItem as="li" className="a2-teach__row" key={t.org}>
                    <span className="a2-teach__role">{t.role}<span className="a2-teach__org"> · {t.org}</span></span>
                    <span className="a2-mono a2-label--dim">{t.when}</span>
                    <p className="a2-read a2-teach__note">{t.note}</p>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------ SHEET 05 */}
      <section className="a2-contact" id="contact">
        <div className="a2-sheet">
          <div className="a2-sheet-head a2-contact__head">
            <span className="a2-label">04 — Contact</span>
            <span className="a2-label">Sheet 05 / 06</span>
          </div>

          <MaskedLines
            as="h2"
            className="a2-display a2-hero-type a2-contact__title"
            lines={site.availability.headlineLines}
            stop
            step={0.08}
          />

          <div className="a2-contact__grid">
            <p className="a2-lede a2-contact__pitch">{site.availability.pitch}</p>
            <div className="a2-contact__actions">
              <Button href={`mailto:${site.contact.email}`} tone="ink">
                {site.contact.email}
              </Button>
              <ul className="a2-contact__links">
                {site.contact.links.map((l) => (
                  <li key={l.label}>
                    <a className="a2-mono a2-contact__link" href={l.href}
                      {...(/^https?:/.test(l.href) ? { target: '_blank', rel: 'noreferrer noopener' } : {})}>
                      [ {l.label} ]
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Colophon sheet="06 / 06" />
    </>
  );
}
