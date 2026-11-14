// ===========================================================================
// A.2 — CASE STUDY
//
// An extensible module system, not one rigid template. A project renders only
// the modules it actually has content for, so a robotics build leads with the
// assembly and the result while a software project leads with architecture
// and reliability — and neither one shows an empty frame where the other's
// module would have been. Adding a module to a project is a key in
// content/projects.js; adding a kind of module is one block below.
//
// The hero media carries the same view-transition-name the index preview
// carried, so arriving from the index hands this page that exact image.
// Nothing waits on it: the markup is complete whether or not the transition
// runs, and browser back and forward behave normally throughout.
//
// A.3 added three module kinds — `iterations`, `decisions` and `limits` —
// and made every section label a real <h2>. The headings were the audit's
// finding 11: software pages went from <h1> straight to <h3>, so a screen
// reader's heading list had no way to see the shape of the page.
// ===========================================================================
import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SheetHead from '../../components/a2/SheetHead';
import Button from '../../components/a2/Button';
import AssemblyViewer from '../../components/a2/AssemblyViewer';
import HumanoidDrawing from '../../components/a2/HumanoidDrawing';
import NotFound from './NotFound';
import { Colophon } from '../../components/a2/Chrome';
import { MaskedLines, Reveal, RevealItem, RiseIn } from '../../motion/motion';
import { projects, bySlug } from '../../content/projects';
import { getAssembly } from '../../content/assemblies';
import { site } from '../../content/site';
import { applyMeta, projectMeta } from '../../lib/meta';

function HeroMedia({ p }) {
  return (
    <figure className="a2-case__well a2-well a2-ch-l">
      <figcaption className="a2-exhibit__bar">
        <span className="a2-label">{p.media.figure}</span>
        {p.media.illustrative && (
          <span className="a2-tag a2-ch-s a2-chamfer">Illustrative · asset {p.media.assetId}</span>
        )}
      </figcaption>

      {p.media.src ? (
        <img
          src={p.media.src}
          alt={p.media.alt}
          className="a2-case__img"
          style={{ viewTransitionName: `media-${p.slug}` }}
          decoding="async"
          width="1600"
          height="1000"
        />
      ) : p.media.drawing === 'humanoid' ? (
        <div className="a2-case__drawing">
          <HumanoidDrawing className="a2-case__svg" />
          <span className="a2-sr">{p.media.alt}</span>
        </div>
      ) : (
        // A.3 — a project with no media at all. The humanoid drawing used to
        // be the fallback for everything, which would have put a robot
        // elevation at the top of an inventory platform.
        <div className="a2-case__empty">
          <span className="a2-mono">Awaiting {p.media.need.toLowerCase()}</span>
        </div>
      )}

      {/* A.3 — what the picture actually is, where that is not what a reader
          would assume. A render is not a photograph of the competition robot;
          a logo is not an interface; an empty dashboard is not a busy clinic.
          Saying so under the figure costs one line and buys the rest of the
          page its credibility. */}
      {p.media.provenance && (
        <figcaption className="a2-well__prov a2-note">{p.media.provenance}</figcaption>
      )}
      {p.media.withheld && (
        <figcaption className="a2-well__prov a2-note">{p.media.withheld}</figcaption>
      )}

      {/* Only when there is an image above it. The empty well already says
          what it is waiting for, inside the frame. */}
      {p.media.src && p.media.need && (
        <p className="a2-well__need a2-mono">Awaiting {p.media.need.toLowerCase()}</p>
      )}
    </figure>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const p = bySlug(slug);

  useEffect(() => {
    if (p) applyMeta(projectMeta(p));
  }, [p]);

  const next = useMemo(() => {
    if (!p) return null;
    const i = projects.findIndex((x) => x.slug === p.slug);
    return projects[(i + 1) % projects.length];
  }, [p]);

  // An unknown slug is a stale link, not a crash. Saying so beats a silent
  // redirect, which leaves the visitor on a page they did not ask for with no
  // explanation of what happened to the one they did.
  if (!p) {
    return (
      <NotFound
        name="Sheet not found"
        lede={<>There is no project filed under <em>{slug}</em>.</>}
        body="The link is probably from an earlier version of this site. Every project is listed on the index, and the ones that did not become case studies are in Other work beneath it."
        path={`/work/${slug}`}
      />
    );
  }

  const assembly = getAssembly(p.assembly);

  // A project renders only the modules it has content for, so the sheet
  // numbering is derived from what is actually on the page rather than from a
  // fixed template. Otherwise a software case study reads 02, 03, 05 — gaps
  // that imply missing sheets the visitor will go looking for.
  const modules = [
    assembly && { key: 'assembly', id: 'assembly', label: 'Assembly' },
    p.systems && !p.architecture && { key: 'systems', id: 'systems', label: 'Systems' },
    p.architecture && { key: 'systems', id: 'systems', label: p.architecture.heading },
    p.iterations && { key: 'iterations', id: 'iterations', label: p.iterations.heading },
    p.decisions && { key: 'decisions', id: 'decisions', label: p.decisions.heading },
    p.reliability && { key: 'reliability', id: 'reliability', label: p.reliability.heading },
    p.related && { key: 'related', id: 'related', label: p.related.heading },
    p.limits && { key: 'limits', id: 'limits', label: p.limits.heading },
    p.result && { key: 'result', id: 'result', label: 'Result' },
    p.ownership && { key: 'ownership', id: 'ownership', label: p.ownership.heading },
  ].filter(Boolean).map((m, i) => ({
    ...m,
    n: String(i + 1).padStart(2, '0'),
    sheet: String(i + 2).padStart(2, '0'), // sheet 01 is the case-study head
  }));
  const mod = (key) => modules.find((m) => m.key === key);
  const sheets = String(modules.length + 1).padStart(2, '0');

  const unverified = p.facts.some((f) => !f.verified);

  return (
    <>
      <main id="main" className="a2-case">
        {/* --------------------------------------------------------- HEAD */}
        <section className="a2-sheet a2-case__top">
          <p className="a2-label a2-case__crumb">
            <Link to="/#index" className="a2-case__back">Index of work</Link>
            <span aria-hidden="true"> / </span>
            Project {p.number} · {p.kind} — Case study
          </p>

          {/* A.3 — the plate and the facts are one grid now. The audit's
              finding 14: at 1440 the metadata sat 250px *below* a lede that
              ended two-thirds of the way across an otherwise empty band, and
              the robot did not appear until past the fold. The approved sheet
              puts them side by side; so does this. The grid collapses to one
              column on a phone, where stacking is the right answer. */}
          <div className="a2-case__plate">
            <MaskedLines as="h1" className="a2-display a2-hero-type" lines={p.titleLines} stop immediate step={0.08} />

            <div className="a2-case__opening">
              <div className="a2-case__intro">
                <RiseIn as="p" className="a2-lede a2-case__lede" delay={0.1}>{p.lede}</RiseIn>
                <RiseIn as="p" className="a2-note a2-case__status" delay={0.14}>
                  <span className="a2-label a2-label--dim">Status — </span>
                  {p.status} <span aria-hidden="true">·</span> {p.when}
                </RiseIn>
              </div>

              <RiseIn className="a2-case__facts" delay={0.12}>
                <dl className="a2-meta a2-meta--boxed a2-frame a2-ch-s">
                  <div>
                    {p.facts.map((f) => (
                      <div className="a2-meta__row" key={f.label}>
                        <dt className="a2-label a2-label--dim">{f.label}</dt>
                        <dd className="a2-mono">
                          {unverified && (
                            <span className={`a2-vmark${f.verified ? ' is-on' : ''}`} aria-hidden="true" />
                          )}
                          {f.value}
                        </dd>
                      </div>
                    ))}
                  </div>
                </dl>
                {unverified && (
                  <p className="a2-label a2-label--dim a2-case__legend">
                    <span className="a2-vmark is-on" aria-hidden="true" /> Verified&nbsp;&nbsp;
                    <span className="a2-vmark" aria-hidden="true" /> To supply
                  </p>
                )}
              </RiseIn>
            </div>
          </div>
        </section>

        <section className="a2-sheet">
          <RiseIn><HeroMedia p={p} /></RiseIn>

          {modules.length > 1 && (
            <nav className="a2-case__index" aria-label="Sections of this case study">
              {modules.map((m) => (
                <a key={m.key} href={`#${m.id}`} className="a2-case__indexLink">
                  <span className="a2-mono a2-case__indexN">{m.n}</span>
                  <span>{m.label}</span>
                </a>
              ))}
            </nav>
          )}
        </section>

        {/* ----------------------------------------------------- ASSEMBLY */}
        {assembly && (
          <section className="a2-sheet a2-section" id="assembly">
            <SheetHead n={mod('assembly').n} name="Assembly" sheet={mod('assembly').sheet} of={sheets} />
            <MaskedLines as="h2" className="a2-display a2-section-type a2-case__h2" lines={['Take it', 'apart']} stop />
            <RiseIn><AssemblyViewer assembly={assembly} /></RiseIn>
          </section>
        )}

        {/* ------------------------------------------- SYSTEMS / ARCHITECTURE */}
        {(p.systems || p.architecture) && (
          <section className="a2-sheet a2-section" id="systems">
            <SheetHead
              n={mod('systems').n}
              name={mod('systems').label}
              sheet={mod('systems').sheet}
              of={sheets}
              as="h2"
            />
            <Reveal as="ol" className="a2-sys">
              {(p.architecture?.items ?? p.systems).map((s) => (
                <RevealItem as="li" className="a2-sys__cell" key={s.n ?? s.id}>
                  <span className="a2-mono a2-sys__n">{s.n}</span>
                  <h3 className="a2-display a2-sys__name">{s.name}</h3>
                  <p className="a2-read a2-sys__note">{s.note}</p>
                </RevealItem>
              ))}
            </Reveal>
          </section>
        )}

        {/* --------------------------------------------------- ITERATIONS */}
        {p.iterations && (
          <section className="a2-sheet a2-section" id="iterations">
            <SheetHead n={mod('iterations').n} name={p.iterations.heading} sheet={mod('iterations').sheet} of={sheets} as="h2" />
            <RiseIn as="p" className="a2-note a2-iter__source">{p.iterations.source}</RiseIn>
            <Reveal as="ol" className="a2-iter">
              {p.iterations.items.map((it) => (
                <RevealItem as="li" className={`a2-iter__row is-${it.verdict.toLowerCase()}`} key={it.sub + it.v}>
                  <span className="a2-iter__tag">
                    <span className="a2-mono a2-iter__sub">{it.sub}</span>
                    <span className="a2-mono a2-iter__v">{it.v}</span>
                  </span>
                  <h3 className="a2-display a2-iter__name">{it.name}</h3>
                  {/* The verdict is the first thing read, because a rejected
                      prototype and an accepted one are read differently. */}
                  <span className={`a2-tag a2-ch-s a2-chamfer a2-iter__verdict${it.verdict === 'Accepted' ? ' is-on' : ''}`}>
                    {it.verdict}
                  </span>
                  <p className="a2-read a2-iter__what">{it.what}</p>
                  <p className="a2-read a2-iter__why">{it.why}</p>
                  <p className="a2-note a2-iter__learned">
                    <span className="a2-label a2-label--dim">What it taught us — </span>{it.learned}
                  </p>
                </RevealItem>
              ))}
            </Reveal>
          </section>
        )}

        {/* ---------------------------------------------------- DECISIONS */}
        {p.decisions && (
          <section className="a2-sheet a2-section" id="decisions">
            <SheetHead n={mod('decisions').n} name={p.decisions.heading} sheet={mod('decisions').sheet} of={sheets} as="h2" />
            <RiseIn as="p" className="a2-note a2-iter__source">{p.decisions.source}</RiseIn>
            <Reveal as="ol" className="a2-dec">
              {p.decisions.items.map((d, i) => (
                <RevealItem as="li" className="a2-dec__row" key={d.name}>
                  <span className="a2-mono a2-dec__n">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="a2-display a2-dec__name">{d.name}</h3>
                  <p className="a2-read a2-dec__body">{d.body}</p>
                  {/* Every decision has a price. A list of choices with no
                      costs beside them is a list of preferences. */}
                  <p className="a2-note a2-dec__cost">
                    <span className="a2-label a2-label--dim">What it cost — </span>{d.cost}
                  </p>
                </RevealItem>
              ))}
            </Reveal>
          </section>
        )}

        {/* -------------------------------------------------- RELIABILITY */}
        {p.reliability && (
          <section className="a2-sheet a2-section" id="reliability">
            <SheetHead n={mod('reliability').n} name={p.reliability.heading} sheet={mod('reliability').sheet} of={sheets} as="h2" />
            <div className="a2-rel">
              <RiseIn as="p" className="a2-prose">{p.reliability.body}</RiseIn>
              {p.reliability.stat && (
                <RiseIn className="a2-rel__stat" delay={0.08}>
                  <span className="a2-display a2-rel__value a2-num">{p.reliability.stat.value}</span>
                  <span className="a2-label a2-label--dim">{p.reliability.stat.unit}</span>
                </RiseIn>
              )}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------ RELATED */}
        {p.related && (
          <section className="a2-sheet a2-section" id="related">
            <SheetHead n={mod('related').n} name={p.related.heading} sheet={mod('related').sheet} of={sheets} as="h2" />
            <div className="a2-related">
              <RiseIn as="figure" className="a2-related__well a2-well a2-ch-m">
                <img src={p.related.media.src} alt={p.related.media.alt} loading="lazy" decoding="async" />
              </RiseIn>
              <div className="a2-related__body">
                <RiseIn as="p" className="a2-prose">{p.related.body}</RiseIn>
                {p.related.href && (
                  <RiseIn delay={0.06}>
                    <Button href={p.related.href} tone="ghost" external>Visit the site</Button>
                  </RiseIn>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------- LIMITS */}
        {p.limits && (
          <section className="a2-sheet a2-section" id="limits">
            <SheetHead n={mod('limits').n} name={p.limits.heading} sheet={mod('limits').sheet} of={sheets} as="h2" />
            <RiseIn as="p" className="a2-prose a2-own">{p.limits.body}</RiseIn>
          </section>
        )}
      </main>

      {/* ------------------------------------------------------- RESULT */}
      {p.result && (
        <section className="a2-result" id="result">
          <div className="a2-sheet">
            <div className="a2-sheet-head a2-result__head">
              <span className="a2-label">{mod('result').n} — Result</span>
              <span className="a2-label">Sheet {mod('result').sheet} / {sheets}</span>
            </div>
            <MaskedLines as="h2" className="a2-display a2-hero-type a2-result__title" lines={p.result.lines} stop />
            <RiseIn as="p" className="a2-lede a2-result__caption">{p.result.caption}</RiseIn>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------- OWNERSHIP */}
      {p.ownership && (
        <section className="a2-sheet a2-section" id="ownership">
          <SheetHead n={mod('ownership').n} name={p.ownership.heading} sheet={mod('ownership').sheet} of={sheets} as="h2" />
          <RiseIn as="p" className="a2-prose a2-own">{p.ownership.body}</RiseIn>
        </section>
      )}

      {/* ------------------------------------------------- THE WAY OUT */}
      {/* A.3 — the audit's finding 15: a case study was a dead end. Someone
          who has just read the whole thing is the most likely person on the
          site to want the résumé or an email address, and they had neither
          without going back to the home page first. */}
      <section className="a2-sheet a2-case__exit">
        <div className="a2-case__exitIn">
          <p className="a2-read a2-case__exitLine">
            That is {p.title}. If it is the kind of work you are hiring for, the
            résumé has the rest and my inbox is open.
          </p>
          <p className="a2-case__exitActions">
            <Button href={`mailto:${site.contact.email}`} tone="accent">Get in touch</Button>
            <a className="a2-mono a2-case__exitLink" href={site.resume.href}>[ {site.resume.label} ]</a>
            <Link className="a2-mono a2-case__exitLink" to="/#index">[ Index of work ]</Link>
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------- NEXT */}
      {next && (
        <nav className="a2-sheet a2-next" aria-label="Next project">
          <Link to={`/work/${next.slug}`} viewTransition className="a2-next__link">
            <span className="a2-label a2-label--dim">Next — {next.number}</span>
            <span className="a2-display a2-next__title">{next.title}</span>
            <span className="a2-next__go a2-mono" aria-hidden="true">Continue →</span>
          </Link>
        </nav>
      )}

      <Colophon sheet={`${sheets} / ${sheets}`} project={`${p.number} · ${p.title}`} />
    </>
  );
}
