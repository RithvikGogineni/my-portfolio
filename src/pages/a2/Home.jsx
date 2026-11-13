// ===========================================================================
// A.2 — HOME
// Sheet 01 Hero · 02 Featured · 03 Index of work · 04 Other work
//       · 05 Practice · 06 Contact · 07 Colophon
//
// A.3 added sheet 04 and widened sheet 05. Both come from the audit: seven
// projects had no destination at all, and Practice had been compressed to the
// point where a reader could not tell what I am studying or where I am.
// ===========================================================================
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import SheetHead from '../../components/a2/SheetHead';
import Button from '../../components/a2/Button';
import HeroExhibit from '../../components/a2/HeroExhibit';
import FeaturedInspect from '../../components/a2/FeaturedInspect';
import ProjectIndex from '../../components/a2/ProjectIndex';
import OtherWork from '../../components/a2/OtherWork';
import { Colophon } from '../../components/a2/Chrome';
import { MaskedLines, Reveal, RevealItem, RiseIn } from '../../motion/motion';
import { site, practice, toolkit, achievements } from '../../content/site';
import { featured, indexed } from '../../content/projects';
import { applyMeta, HOME_META } from '../../lib/meta';

import portrait from '../../assets/images/profile-photo.webp';

export default function Home() {
  useEffect(() => { applyMeta(HOME_META); }, []);

  return (
    <>
      <main id="main">
        {/* ---------------------------------------------------- SHEET 01 */}
        <section className="a2-sheet a2-hero">
          <p className="a2-label a2-hero__sheet">
            Sheet 01 / 07 — Mechanical &amp; Robotics Engineering, WPI
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
              <span className="a2-hero__actions">
                <Button href="#contact" tone="accent">Get in touch</Button>
                {/* The résumé is the complete record and the thing a recruiter
                    came for. On the previous site it was in the navigation and
                    the hero; here it is one quiet line beside the primary
                    action rather than a second button competing with it. */}
                <a className="a2-mono a2-hero__resume" href={site.resume.href}>
                  [ {site.resume.label} ]
                </a>
              </span>
            </RevealItem>
          </Reveal>
        </section>

        {/* ---------------------------------------------------- SHEET 02 */}
        <section className="a2-sheet a2-section" id="work">
          <SheetHead n="01" name="Featured" sheet="02" of="07" />
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
          <SheetHead n="02" name="Index of work" sheet="03" of="07" as="h2" />
          <ProjectIndex projects={indexed} />
        </section>

        {/* ---------------------------------------------------- SHEET 04 */}
        <section className="a2-sheet a2-section" id="other">
          <SheetHead n="03" name="Other work" sheet="04" of="07" as="h2" />
          <RiseIn as="p" className="a2-lede a2-other__lede">
            Work that is real but does not need a sheet of its own — a guide, a
            prototype, something still being built, and the client sites.
          </RiseIn>
          <OtherWork />
        </section>

        {/* ---------------------------------------------------- SHEET 05 */}
        <section className="a2-sheet a2-section" id="practice">
          <SheetHead n="04" name="Practice" sheet="05" of="07" as="h2" />
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

              {/* Where and what — the two facts the audit found a reader could
                  not recover from the page, in two lines rather than a
                  biography. */}
              <RiseIn className="a2-where">
                <p className="a2-where__line a2-mono">
                  <span>{practice.where.from}</span>
                  <span className="a2-where__arrow" aria-hidden="true">→</span>
                  <span>{practice.where.to}</span>
                </p>
                <p className="a2-read a2-where__note">{practice.where.note}</p>
              </RiseIn>

              <Reveal as="dl" className="a2-edu">
                {site.education.map((e) => (
                  <RevealItem className="a2-edu__row" key={e.school}>
                    <dt className="a2-edu__school">{e.school}</dt>
                    <dd className="a2-edu__detail a2-read">{e.detail}</dd>
                    <dd className="a2-mono a2-label--dim a2-edu__when">{e.place} · {e.when}</dd>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </div>

          {/* ------------------------------------------------- TOOLKIT */}
          <div className="a2-sub" id="toolkit">
            <h3 className="a2-label a2-sub__head">Toolkit</h3>
            <Reveal as="ol" className="a2-kit">
              {toolkit.map((g) => (
                <RevealItem as="li" className="a2-kit__group" key={g.n}>
                  <span className="a2-mono a2-kit__n">{g.n}</span>
                  <span className="a2-kit__name a2-display">{g.group}</span>
                  <p className="a2-kit__tools a2-mono">{g.tools.join(' · ')}</p>
                  {/* Links to the projects, not names in a sentence. Inline
                      text links here measured 17px tall on a phone, which is
                      well under the approved 44px and exactly the size of
                      target this section would be used with one thumb. */}
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
                </RevealItem>
              ))}
            </Reveal>
          </div>

          {/* -------------------------------------------- ACHIEVEMENTS */}
          <div className="a2-sub" id="achievements">
            <h3 className="a2-label a2-sub__head">Achievements</h3>
            <Reveal as="ol" className="a2-ach">
              {achievements.map((a) => (
                <RevealItem as="li" className="a2-ach__row" key={a.n}>
                  <span className="a2-mono a2-ach__n">{a.n}</span>
                  <span className="a2-ach__award a2-display">{a.award}</span>
                  <span className="a2-mono a2-ach__meta">
                    {a.event}<span aria-hidden="true"> · </span>{a.level}<span aria-hidden="true"> · </span>{a.when}
                  </span>
                  <p className="a2-read a2-ach__note">{a.note}</p>
                </RevealItem>
              ))}
            </Reveal>
          </div>

          {/* --------------------------------- TEACHING AND LEADERSHIP */}
          <div className="a2-sub" id="teaching">
            <h3 className="a2-label a2-sub__head">Teaching &amp; leadership</h3>
            <Reveal as="ul" className="a2-teach">
              {practice.teaching.map((t) => (
                <RevealItem as="li" className="a2-teach__row" key={t.org}>
                  <span className="a2-teach__role">{t.role}<span className="a2-teach__org"> · {t.org}</span></span>
                  <span className="a2-mono a2-label--dim">{t.when}</span>
                  <p className="a2-read a2-teach__note">{t.note}</p>
                </RevealItem>
              ))}
            </Reveal>
            <Reveal as="ul" className="a2-offices">
              {practice.offices.map((o) => (
                <RevealItem as="li" className="a2-note a2-offices__row" key={o}>{o}</RevealItem>
              ))}
            </Reveal>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------ SHEET 06 */}
      <section className="a2-contact" id="contact">
        <div className="a2-sheet">
          <div className="a2-sheet-head a2-contact__head">
            <span className="a2-label">05 — Contact</span>
            <span className="a2-label">Sheet 06 / 07</span>
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

      <Colophon sheet="07 / 07" />
    </>
  );
}
