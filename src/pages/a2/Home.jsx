// ===========================================================================
// A.2 — HOME
// Sheet 01 Hero · 02 The person · 03 Featured · 04 Index of work
//       · 05 Other work · 06 Practice · 07 Contact · 08 Colophon
//
// A.4 reordered the page around a story rather than an inventory: who this
// is, then what they built, then what they can do, then how to reach them.
// The person comes second because by the time a reader reaches a case study
// about a flywheel they should already know whose flywheel it is.
//
// Two things left the hero. The illustrative CAD exhibit is gone — it was a
// drawing of a flange nobody made, carrying the opening of an engineering
// portfolio — and the portrait that used to sit in Practice has moved to
// sheet 02, where it belongs and where it now assembles itself.
// ===========================================================================
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import SheetHead from '../../components/a2/SheetHead';
import Button from '../../components/a2/Button';
import FeaturedInspect from '../../components/a2/FeaturedInspect';
import ProjectIndex from '../../components/a2/ProjectIndex';
import OtherWork from '../../components/a2/OtherWork';
import ParticlePortrait from '../../components/a2/ParticlePortrait';
import { Colophon } from '../../components/a2/Chrome';
import { MaskedLines, RiseIn, Sequence, SequenceItem, Rule, Wipe } from '../../motion/motion';
import { site, practice, toolkit, achievements } from '../../content/site';
import { person } from '../../content/person';
import { featured, indexed } from '../../content/projects';
import { applyMeta, HOME_META } from '../../lib/meta';

import portrait from '../../assets/images/portrait-2026.webp';

export default function Home() {
  useEffect(() => { applyMeta(HOME_META); }, []);

  return (
    <>
      <main id="main">
        {/* ---------------------------------------------------- SHEET 01 */}
        <section className="a2-sheet a2-hero">
          <p className="a2-label a2-hero__sheet">
            Sheet 01 / 08 — Mechanical &amp; Robotics Engineering, WPI
          </p>

          {/* A.5 — the right column now runs the full depth of the name.
              A.4 left a 404 x 300 hole between the bottom of the title block
              and the foot row; the availability line and both actions moved
              up into it, which is also where a drawing sheet keeps them. */}
          <div className="a2-hero__grid">
            <div className="a2-hero__plate">
              <MaskedLines
                as="h1"
                className="a2-display a2-hero-type a2-hero__name"
                lines={site.nameLines}
                stop
                immediate
                tier="signature"
                step={0.07}
                delay={0.04}
              />
            </div>

            <div className="a2-hero__block">
              <Sequence as="dl" className="a2-hero__spec" tier="feature" delay={0.42}>
                {site.heroSpec.map((r) => (
                  <SequenceItem className="a2-hero__specRow" tier="feature" key={r.k}>
                    <dt className="a2-label a2-label--dim">{r.k}</dt>
                    <dd className="a2-mono">{r.v}</dd>
                  </SequenceItem>
                ))}
              </Sequence>

              <Sequence className="a2-hero__cta" tier="feature" delay={0.62}>
                {site.availability.open && (
                  <SequenceItem as="p" className="a2-avail" tier="feature">
                    <span className="a2-avail__mark" aria-hidden="true" />
                    <span className="a2-read">{site.availability.line}</span>
                  </SequenceItem>
                )}
                <SequenceItem className="a2-hero__actions" tier="feature">
                  <Button href="#index" tone="accent">Selected work</Button>
                  <a className="a2-mono a2-hero__resume" href={site.resume.href}>
                    [ {site.resume.label} ]
                  </a>
                </SequenceItem>
              </Sequence>
            </div>
          </div>

          {/* The rule spans the sheet now, not just the column the name sits
              in — it is the drawing's horizon, and it stopped 448px short. */}
          <p className="a2-hero__rule">
            <Rule className="a2-hero__rule-line" tier="signature" delay={0.34} origin="right" />
            <span className="a2-label">{site.rule}</span>
            <Rule className="a2-hero__rule-line" tier="signature" delay={0.34} origin="left" />
          </p>

          <Sequence className="a2-hero__foot" tier="feature" delay={0.52}>
            <SequenceItem as="p" className="a2-lede" tier="feature">{site.lede}</SequenceItem>
            <SequenceItem as="ul" className="a2-hero__standing" tier="feature">
              {site.standing.map((s) => <li className="a2-read" key={s}>{s}</li>)}
            </SequenceItem>
          </Sequence>
        </section>

        {/* ---------------------------------------------------- SHEET 02 */}
        <section className="a2-sheet a2-section a2-person" id="person">
          <SheetHead n="01" name="The person" sheet="02" of="08" as="h2" />

          {/* DOM order is headline → portrait → prose, which is the right
              order on a phone: you meet the face before reading four
              paragraphs about it. On a wide viewport explicit grid placement
              overrides it, putting the portrait in a column of its own
              beside both. */}
          <div className="a2-person__grid">
            <MaskedLines
              as="p"
              className="a2-display a2-section-type a2-person__head"
              lines={person.headlineLines}
              stop
            />

            {/* The portrait assembles out of particles on arrival, once.
                The photograph underneath is the real deliverable and is what
                remains; see components/a2/ParticlePortrait.jsx. */}
            <div className="a2-person__portrait">
              <ParticlePortrait
                src={portrait}
                alt={person.portrait.alt}
                caption={person.portrait.caption}
              />
            </div>

            <div className="a2-person__body">
              <RiseIn as="p" className="a2-lede a2-person__lede">{person.lede}</RiseIn>
              {person.body.map((para, i) => (
                <RiseIn as="p" className="a2-read a2-read--wide a2-person__para" key={i} delay={0.08 + i * 0.07}>
                  {para}
                </RiseIn>
              ))}
            </div>
          </div>

          {/* An index of things that hold my attention — the same numbered
              editorial rows as everywhere else, allowed slightly more voice. */}
          <div className="a2-sub" id="curious">
            <h3 className="a2-label a2-sub__head">Things that keep my attention</h3>
            <Sequence as="ol" className="a2-curio" tier="feature">
              {person.interests.map((it) => (
                <SequenceItem as="li" className="a2-curio__row" tier="feature" key={it.n}>
                  <span className="a2-mono a2-curio__n">{it.n}</span>
                  <h4 className="a2-display a2-curio__name">{it.name}</h4>
                  <p className="a2-read a2-curio__fact">{it.fact}</p>
                  <p className="a2-note a2-curio__voice">{it.voice}</p>
                </SequenceItem>
              ))}
            </Sequence>
          </div>
        </section>

        {/* ---------------------------------------------------- SHEET 03 */}
        <section className="a2-sheet a2-section" id="work">
          <SheetHead n="02" name="Featured" sheet="03" of="08" />
          <div className="a2-feature">
            <div className="a2-feature__head">
              <MaskedLines
                as="h2"
                className="a2-display a2-section-type"
                lines={featured.titleLines}
                stop
              />
              <div className="a2-feature__intro">
                <RiseIn as="p" className="a2-lede a2-feature__lede">{featured.lede}</RiseIn>

                <Sequence as="dl" className="a2-meta a2-feature__meta" tier="feature">
                  {featured.facts.map((f) => (
                    <SequenceItem className="a2-meta__row" tier="feature" key={f.label}>
                      <dt className="a2-label a2-label--dim">{f.label}</dt>
                      <dd className="a2-mono">{f.value}</dd>
                    </SequenceItem>
                  ))}
                </Sequence>
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

        {/* ---------------------------------------------------- SHEET 04 */}
        <section className="a2-sheet a2-section" id="index">
          <SheetHead n="03" name="Index of work" sheet="04" of="08" as="h2" />
          <ProjectIndex projects={indexed} />
        </section>

        {/* ---------------------------------------------------- SHEET 05 */}
        <section className="a2-sheet a2-section" id="other">
          <SheetHead n="04" name="Other work" sheet="05" of="08" as="h2" />
          <RiseIn as="p" className="a2-lede a2-other__lede">
            Work that is real but does not need a sheet of its own — a guide, a
            prototype, something still being built, and the client sites.
          </RiseIn>
          <OtherWork />
        </section>

        {/* ---------------------------------------------------- SHEET 06 */}
        <section className="a2-sheet a2-section" id="practice">
          <SheetHead n="05" name="Practice" sheet="06" of="08" as="h2" />

          {/* The portrait that used to open this sheet is now on sheet 02.
              Practice is about what I have done and what I can do; the
              introductions have already happened. */}
          <div className="a2-practice a2-practice--text">
            <div className="a2-practice__body">
              <RiseIn as="p" className="a2-prose">
                {practice.statement.map((s, i) =>
                  s.voice
                    ? <em className="a2-voice" key={i}>{s.t}</em>
                    : <React.Fragment key={i}>{s.t}</React.Fragment>,
                )}
              </RiseIn>

              <Sequence as="dl" className="a2-edu" tier="quiet">
                {site.education.map((e) => (
                  <SequenceItem className="a2-edu__row" tier="quiet" key={e.school}>
                    <dt className="a2-edu__school">{e.school}</dt>
                    <dd className="a2-edu__detail a2-read">{e.detail}</dd>
                    <dd className="a2-mono a2-label--dim a2-edu__when">{e.place} · {e.when}</dd>
                  </SequenceItem>
                ))}
              </Sequence>
            </div>
          </div>

          {/* ------------------------------------------------- TOOLKIT */}
          <div className="a2-sub" id="toolkit">
            <h3 className="a2-label a2-sub__head">Toolkit</h3>
            <Sequence as="ol" className="a2-kit" tier="quiet">
              {toolkit.map((g) => (
                <SequenceItem as="li" className="a2-kit__group" tier="quiet" key={g.n}>
                  <span className="a2-mono a2-kit__n">{g.n}</span>
                  <span className="a2-kit__name a2-display">{g.group}</span>
                  <p className="a2-kit__tools a2-mono">{g.tools.join(' · ')}</p>
                  <div className="a2-kit__used">
                    <span className="a2-label a2-label--dim a2-kit__usedHead">Used on</span>
                    <ul className="a2-kit__links">
                      {g.used.map((u) => (
                        <li key={u.slug}>
                          <Link className="a2-kit__link" to={`/work/${u.slug}`} viewTransition>{u.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SequenceItem>
              ))}
            </Sequence>
          </div>

          {/* -------------------------------------------- ACHIEVEMENTS */}
          <div className="a2-sub" id="achievements">
            <h3 className="a2-label a2-sub__head">Achievements</h3>
            <Sequence as="ol" className="a2-ach" tier="quiet">
              {achievements.map((a) => (
                <SequenceItem as="li" className="a2-ach__row" tier="quiet" key={a.n}>
                  <span className="a2-mono a2-ach__n">{a.n}</span>
                  <span className="a2-ach__award a2-display">{a.award}</span>
                  <span className="a2-mono a2-ach__meta">
                    {a.event}<span aria-hidden="true"> · </span>{a.level}<span aria-hidden="true"> · </span>{a.when}
                  </span>
                  <p className="a2-read a2-ach__note">{a.note}</p>
                </SequenceItem>
              ))}
            </Sequence>
          </div>

          {/* --------------------------------- TEACHING AND LEADERSHIP */}
          <div className="a2-sub" id="teaching">
            <h3 className="a2-label a2-sub__head">Teaching &amp; leadership</h3>
            <Sequence as="ul" className="a2-teach" tier="quiet">
              {practice.teaching.map((t) => (
                <SequenceItem as="li" className="a2-teach__row" tier="quiet" key={t.org}>
                  <span className="a2-teach__role">{t.role}<span className="a2-teach__org"> · {t.org}</span></span>
                  <span className="a2-mono a2-label--dim">{t.when}</span>
                  <p className="a2-read a2-teach__note">{t.note}</p>
                </SequenceItem>
              ))}
            </Sequence>
            <Sequence as="ul" className="a2-offices" tier="quiet">
              {practice.offices.map((o) => (
                <SequenceItem as="li" className="a2-note a2-offices__row" tier="quiet" key={o}>{o}</SequenceItem>
              ))}
            </Sequence>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------ SHEET 07 */}
      {/* A.5 — the finale, and deliberately only one gesture. The coral band
          is uncovered from its top edge as it arrives, so the colour, the
          oversized type and the actions all appear together as a single
          event rather than as three animations competing at the end of the
          page. The title plays on mount instead of on arrival, so it has
          already settled behind the mask by the time the mask opens. */}
      <Wipe as="section" from="up" tier="feature" className="a2-contact" id="contact">
        <div className="a2-sheet">
          <div className="a2-sheet-head a2-contact__head">
            <span className="a2-label">06 — Contact</span>
            <span className="a2-label">Sheet 07 / 08</span>
          </div>

          <MaskedLines
            as="h2"
            className="a2-display a2-hero-type a2-contact__title"
            lines={site.availability.headlineLines}
            stop
            immediate
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
      </Wipe>

      <Colophon sheet="08 / 08" />
    </>
  );
}
