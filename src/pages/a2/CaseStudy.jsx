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
// ===========================================================================
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import SheetHead from '../../components/a2/SheetHead';
import Button from '../../components/a2/Button';
import AssemblyViewer from '../../components/a2/AssemblyViewer';
import HumanoidDrawing from '../../components/a2/HumanoidDrawing';
import { Colophon } from '../../components/a2/Chrome';
import { MaskedLines, Reveal, RevealItem, RiseIn } from '../../motion/motion';
import { projects, bySlug } from '../../content/projects';
import { getAssembly } from '../../content/assemblies';

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
      ) : (
        <div className="a2-case__drawing">
          <HumanoidDrawing className="a2-case__svg" />
          <span className="a2-sr">{p.media.alt}</span>
        </div>
      )}

      {p.media.illustrative && (
        <p className="a2-well__need a2-mono">Awaiting {p.media.need.toLowerCase()}</p>
      )}
    </figure>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const p = bySlug(slug);
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
      <>
        <main id="main" className="a2-case">
          <section className="a2-sheet a2-section">
            <SheetHead name="Sheet not found" as="h1" />
            <RiseIn>
              <p className="a2-lede" style={{ marginTop: 'clamp(1.5rem, 4vw, 3rem)' }}>
                There is no project filed under <em>{slug}</em>.
              </p>
              <p className="a2-read" style={{ marginTop: '1.25rem', maxWidth: '46ch' }}>
                The link is probably from an earlier version of this site. Every
                project is listed on the index.
              </p>
              <p style={{ marginTop: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                <Button as="link" to="/#index" tone="accent">Index of work</Button>
              </p>
            </RiseIn>
          </section>
        </main>
        <Colophon sheet="—" />
      </>
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
    p.reliability && { key: 'reliability', id: 'reliability', label: p.reliability.heading },
    p.related && { key: 'related', id: 'related', label: p.related.heading },
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

          <div className="a2-case__plate">
            <MaskedLines as="h1" className="a2-display a2-hero-type" lines={p.titleLines} stop immediate step={0.08} />
            <RiseIn as="p" className="a2-lede a2-case__lede" delay={0.1}>{p.lede}</RiseIn>
          </div>

          <RiseIn className="a2-case__facts">
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

        {/* -------------------------------------------------- RELIABILITY */}
        {p.reliability && (
          <section className="a2-sheet a2-section" id="reliability">
            <SheetHead n={mod('reliability').n} name={p.reliability.heading} sheet={mod('reliability').sheet} of={sheets} />
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
            <SheetHead n={mod('related').n} name={p.related.heading} sheet={mod('related').sheet} of={sheets} />
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
          <SheetHead n={mod('ownership').n} name={p.ownership.heading} sheet={mod('ownership').sheet} of={sheets} />
          <RiseIn as="p" className="a2-prose a2-own">{p.ownership.body}</RiseIn>
        </section>
      )}

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
