# A.5 — Rendered-Browser Audit

**Date:** 2026-11-16
**Build audited:** `fcce0af` (merge of PR #2), CSS `index-BajUyeP8.css`, JS `index-CbeSbPRr.js`
**Surface:** `http://localhost:4173` — verified byte-identical to what production serves
(SHA-256 of the served CSS matches `my-portfolio-rithvikgoginenis-projects.vercel.app`)
**Engine:** Chrome 157.0.8103.79, driven over the DevTools Protocol
**Posture:** read-only. No application file was edited, and nothing was committed,
pushed, merged or deployed. The working tree was clean before and after; the only
new files are this directory.

---

## 1. Method, and what it does and does not cover

Everything below was measured on the rendered page, not read off the source.
Input was dispatched through `Input.dispatchMouseEvent` / `dispatchTouchEvent` /
`dispatchKeyEvent` — **trusted** events — because Lenis and Framer Motion ignore
synthetic ones, and a synthetic-event pass would have reported working behaviour
as broken.

Scripts are in `scripts/`, raw output in the numbered `.txt` files, screenshots in
`shots/`. Every script is runnable as-is against a local `vite preview`.

### Measurements that could not be completed

| Not covered | Why | What would be needed |
|---|---|---|
| Real-network load timings | No network throttling was applied; the site was served over loopback. LCP figures below are **optimistic** and must not be quoted as field numbers. | A throttled run, or field RUM |
| Safari and Firefox | Chromium only. The portrait is WebGL (`gl.POINTS`) and `container-type`/`cqw` carry the person heading — both are areas where engines differ. | A real cross-browser pass |
| Real-device GPU and thermal behaviour | Desktop Chrome with CPU throttling approximates CPU, not GPU or sustained thermal load. | A physical mid-range Android device |
| Screen-reader output | Structural checks only (roles, names, refs, heading order, focus order). No AT was driven. | VoiceOver / NVDA pass |
| Font-loading failure modes | Fonts come from `fonts.googleapis.com`; blocked or slow font delivery was not simulated. | Offline/blocked-origin run |
| Frame timing inside the WebGL draw | rAF cadence was measured; GPU time per draw call was not. | A tracing run with GPU categories |

### One correction to my own method, recorded because it changed a result

My first idle-cost probe reported the portrait still animating after the pointer
left. It had not: the probe moved the pointer from the centre of the portrait to
another point **still inside** the portrait. Re-measured with the pointer at
(20, 20), idle cost is genuinely zero. The corrected run is `03b-portrait-idle.txt`.

Similarly, the first mobile index pass reported **zero links** and looked like a
P0. The rows are `<button aria-expanded>`, not `<a>` — an accordion, not a
dead end. Reported below as working.

---

## 2. Confirmed defects

**There are no P0 or P1 defects.** Nothing is broken, unreachable, inaccessible,
or visually failing. The list starts at P2.

### P2-1 — The particle portrait never resolves into the portrait

The component's own documentation says "the photograph arrives as a few thousand
particles that find their places." Measured against the settled photograph, they
do not arrive. The photograph cross-fades **over** a field that is still
unresolved.

Structural correlation of the particle render with the final photograph
(1.0 = identical), from `04-portrait-readability.txt`:

| t | 1440 dark — corr | 1440 dark — contrast (RMS) | 390 light — corr | 390 light — RMS |
|---|---|---|---|---|
| 60ms | 0.200 | 1.7 | 0.304 | 15.2 |
| 400ms | 0.174 | 2.7 | 0.312 | 15.3 |
| 1100ms | 0.433 | 4.1 | 0.377 | 15.5 |
| **1600ms** | **0.643** | 3.3 | **0.397** | 15.4 |
| 2400ms | 1.000 | 40.4 | 1.000 | 51.3 |

The jump to 1.000 at 2400ms is the photograph's opacity going 0 → 1. It is not
the particles resolving.

Two consequences:

- **On desktop** the best the particle field ever achieves is 0.643, at which
  point it carries **3.3 RMS contrast against the photograph's 40.4** — about 8%.
  In dark mode the field is very nearly invisible against the charcoal well.
- **On mobile the effect does not read as a portrait at all.** Peak correlation
  0.397, and RMS is flat at 15.2 → 15.5 across the whole 1.6s particle phase —
  the field barely changes. The documented "coarser grid on a phone" is the
  cause, but the result is 2.4 seconds of abstract dot matrix where the signature
  effect of the site is supposed to be.

**Repro:** `node scripts/03-portrait.cjs`, then `node scripts/04-portrait-readability.cjs`.
**Frames:** `shots/frame-portrait-1440-dark-t{60..3200}.png`,
`shots/frame-portrait-390-light-t{60..3200}.png`.

Caveat on the numbers: the sampled rectangle is approximate and differs between
the two widths, so absolute RMS is not comparable **across** the two sets. The
trajectory **within** each set is the finding.

### P2-2 — The hero headline is frozen across the entire phone range

`--type-hero` is `clamp(4.25rem, 15.5vw, 18.75rem)`. The `15.5vw` term does not
overtake the 68px floor until **439px**, which is wider than every common phone.
So from 320px to 438px the signature headline is a constant 68px while its column
grows by a third, and the type gets relatively smaller the larger the phone:

| Viewport | Font | Column | "Gogineni" fill |
|---|---|---|---|
| 320 | 68px | 284px | 88.8% |
| 360 | 68px | 324px | 77.8% |
| 390 | 68px | 354px | 71.2% |
| 414 | 68px | 378px | **66.7%** |
| 480 | 74.4px | 444px | 62.1% |

This is the inverse of what fluid type is for. At 414px the largest element on
the site uses two-thirds of its measure, and the first line ("Rithvik") only 51%.

**Repro:** `node scripts/02-hero.cjs` — first block.

### P3-1 — The practice prose is capped against the wrong font size

`.a2-practice__body` carries `max-width: 68ch`. `ch` resolves against **that
element's** 22px font, giving 828px. The prose inside renders at **32px**, where
one `ch` is 18.01px. So the intended 68-character measure lands at about **46
characters**:

```
@1440  container 828px · container font 22px (ch = 12.18px) · prose font 32px (ch = 18.01px)
       68ch resolves to 828px  =  46 characters of the prose face
@768   container 719px · 68ch resolves to 799px = 42 characters of the prose face
```

46 is at the low end of comfortable rather than broken, which is why this is P3
and not P2. But it is 32% narrower than the stated intent, and the intent is the
right one.

**Repro:** `node scripts/12-prose-measure.cjs`.

Note on metrics: my first pass reported "35 characters" using average glyph
advance across the string, which under-counts relative to the `0`-glyph `ch`
metric the CSS uses. 46 is the apples-to-apples figure. Both are below 68.

### P3-2 — The nav claims you are in a section you have not reached

At `scrollY = 0`, with the hero filling the viewport, the header marks
**01 PERSON** as current. The hero has no nav entry, so the scrollspy falls back
to the first section and asserts `aria-current` for a sheet that is a full
viewport below.

```
nav at top:       scrollY 0     marked ["01 PERSON"]
nav at #person:   scrollY 759   marked ["01 PERSON"]
nav at #work:     scrollY 2121  marked ["02 WORK"]
nav at #index:    scrollY 3515  marked ["02 WORK"]     ← correct, index belongs to Work
nav at #practice: scrollY 7669  marked ["03 PRACTICE"]
```

**Repro:** `node scripts/15-nav-and-preview.cjs`.

### P3-3 — Expanding a mobile index row puts its CTA below the fold

Tapping a row at 390×844 expands it correctly (`aria-expanded` flips, the preview
image loads, a "READ THE CASE STUDY →" link appears). The link lands at
`top: 868` in an 844px viewport — **24px below the fold**, with no scroll-into-view.
The user taps, sees a picture appear, and the thing they actually wanted is just
off-screen. On a real phone with browser chrome the overshoot is larger.

```
CTA position right after expanding: {"top":868,"viewportH":844,"belowFold":true,"overshoot":24}
```

Navigation itself is fine once the link is on screen: tap → `/work/rehabos`,
heading `REHABOS`, `scrollY` reset to 0.

**Repro:** `node scripts/06e-index-navigate.cjs`.

### P3-4 — The hero's relationship to the fold is unmanaged

Hero sheet height as a percentage of a 900px viewport, across widths:

```
320→104%   390→97%   600→101%   768→106%   900→101%   1024→108%
1180→84%   1280→86%  1440→85%   1600→90%   1728→93%   1920→93%
```

At 1024×900 the hero overruns the viewport by 8%, clipping the rule and the
lede; at 1180 it suddenly occupies 84%. The swing is a side-effect of the
single-column → two-column switch rather than a composed decision.

### P3-5 — The person lede's measure wobbles around the layout breaks

Characters per line for `.a2-person__lede`, by average glyph advance:

```
480→40   600→42   768→42   900→29   1024→33   1280→42   1440→42
```

The dip to 29 at 900px and 33 at 1024px is where the grid changes but the type
does not follow. It is the same class of problem as the heading clip fixed in
A.5.1 — viewport-driven type inside a container-driven box — at a third site.

---

## 3. What is genuinely good

Stated plainly, because it is the larger part of the picture.

**Performance is excellent and I could not make it misbehave.**

| | Desktop 1440 | Mobile 390 | Mobile 390, CPU ×4 | Mobile 390, CPU ×6 |
|---|---|---|---|---|
| CLS after load | 0 | 0 | 0 | 0 |
| CLS after full-page scroll | **0** | **0** | 0 | 0 |
| Long tasks | 0 | 0 | 0 | 3 (max 66ms) |
| Scroll frame median | 16.7ms | 16.7ms | 16.7ms | 16.7ms |
| Frames over 32ms | 1 of 89 | 0 of 89 | 0 of 89 | 0 of 89 |

Zero layout shift is unusual and worth keeping. Sixty frames a second held at
six-times CPU throttling means the scroll work is genuinely on the compositor.

**Idle cost is zero.** With rAF patched before mount, the portrait requests
**0 frames** over 2s once settled, 90 over 1.5s while hovered, and 0 again within
1.2s of the pointer leaving — and 0 when scrolled out of view, and 0 on return
(it does not replay). This is the correct design and it is implemented correctly.

**Accessibility is clean on every page tested** (`/`, `/work/ftc-16075`,
`/work/rehabos`): one `h1` each, no heading-level skips, no image missing `alt`,
no unnamed button, **no broken `aria-labelledby`/`aria-controls`/`aria-describedby`
reference**, 4–6 landmarks, `lang="en"`, and a skip link that is first in tab
order with a visible 3px outline. Only one interactive element is under 44px —
the 1×1px visually-hidden skip link, which is correct.

**Reduced motion is handled properly, not merely declared.** With
`prefers-reduced-motion: reduce`, at both 1440 and 390: nothing faded, nothing
transformed, the portrait photograph at opacity 1 immediately, and the particle
canvas never raised at all. After a full scroll the only sub-35%-opacity elements
are two decorative `a2-btn__edge` spans.

**The flagship inspector is the best thing on the site.** Four tabs with correct
roving tabindex (`0,-1,-1,-1`), pointer and touch both switch the subsystem, the
focus box and leader line move to a genuinely different region each time, and the
panel copy changes with it. `ArrowDown`, `ArrowUp`, `End` and `Home` all move
selection *and* focus. Touch targets are 354×48.

**The flagship entrance uses a different mechanism from everything else** — a
`clip-path` wipe, `inset(81.5%)` → `inset(47.9%)` → `inset(16.3%)` → `inset(0px)`
— rather than another rise-and-fade. That is what makes it read as the feature.

**A.5's intensity tiers are real, not nominal.** Sampling the actual rendered
transform as each section enters:

```
person head  (signature)  85px of travel remaining at t+40ms, mask reveal, no fade
curio row    (feature)    20px, opacity 0.24 → 1
flagship     (feature)    clip-path wipe, a different mechanism entirely
index row    (support)    15px, opacity 0.14 → 1
other work   (quiet)       6px, opacity 0.40 → 1
```

Caveat: these are sampled at fixed offsets from the scroll, not from each
element's own animation start, so they are **lower bounds on travel**, not the
tier's nominal rise. The ordering is the finding, and the ordering holds.

**Case studies are structurally sound.** All six have an `h1`, a back link and
clean `H1>H2>H3` nesting; five have working prev/next (the humanoid has none,
consistent with it being deliberately out of the cycle). Clicking "next" lands on
`/work/first-global` with `scrollY` reset to 0.

**Withdrawn assets degrade honestly.** Hovering the NexusOS row does not produce
an empty well — it produces "ILLUSTRATIVE · A-05 AWAITING SCREENSHOT". The
asset-withdrawal policy from A.3 is holding at the interaction layer.

**The five faded SVG `<ellipse>` elements** I flagged on three case studies are
decorative shadow shapes at a deliberate 0.26 opacity, not failed reveals.
Cleared, not a defect.

**Payload is reasonable:** 383KB cold above-the-fold (125KB JS transfer, 248KB
images, 9KB CSS), 626KB after scrolling the entire page, 491KB of that images
across 7 files.

---

## 4. Subjective art-direction recommendations

Kept separate from the defects above, as asked. None of this is a bug.

### Is the motion genuinely impressive, or merely functional?

**Mostly functional, with one genuinely impressive element and one that
under-delivers on its own promise.**

The flagship inspector is impressive: it earns its motion because the motion is
doing explanatory work — the focus box and leader line *point at the thing the
text is describing*. That is art direction in service of content, and it is the
one place on the site where the animation could not be removed without losing
meaning.

The section entrances are competent and correctly tiered, but they are the
standard vocabulary — rise, fade, stagger, mask-reveal. They are executed well
(zero CLS, 60fps, honest reduced-motion) and they will not embarrass anyone. They
also will not be remembered. The tier system is a real improvement over A.4's
uniformity, but it makes the page *correctly* hierarchical rather than
*memorable*.

The particle portrait is the one that promises more than it delivers. The idea is
excellent and thematically exact — "Some assembly required" beside a person
assembling out of parts. The execution does not land it: it resolves to 0.64 on
desktop and 0.40 on mobile and then lets a cross-fade do the actual work. The
moment of recognition, which is the entire payoff, never quite arrives.

**1. Make the particles resolve, or make the dissolve the point.**
Either push the particle render to a high correlation so the photograph crossfade
is imperceptible, or stop pretending — hold the particle state as a deliberate
halftone and let the photograph arrive as an explicit cut. The current middle
ground reads as an effect that did not finish.

**2. Raise the particle contrast, especially in dark mode.**
3.3 RMS against a 40.4 RMS photograph means the effect is nearly invisible where
it is supposed to be most dramatic.

**3. Reconsider 3.2 seconds.** Entry to settled photograph takes 3.2s, of which
the first second is indistinguishable from noise. A scroller going past at normal
speed sees only the noise phase.

**4. The space hierarchy contradicts the motion hierarchy.**
Share of total page height at 1440:

| Section | Height | Share | Motion tier |
|---|---|---|---|
| Hero | 762px | 6.9% | signature |
| Person | 1362px | 12.3% | signature |
| Work (flagship) | 1394px | 12.6% | feature |
| Index of work | 844px | 7.6% | support |
| **Other work** | **3309px** | **29.8%** | quiet |
| **Practice** | **2301px** | **20.7%** | quiet |

The two sections the motion system calls "present, barely noticed" occupy **50.5%
of the document**. The flagship gets 12.6%. A.5 fixed the hierarchy in time; the
hierarchy in space still points the other way. On mobile it is starker: the
curated index collapses to 412px while Other Work runs to 4525px.

**5. The flagship has roughly 400px of dead cream below it at 1440.** The image
well ends, the CTA sits at the left, and the section continues to the next rule
with nothing in it. Either tighten it or give the right column something to do
below the panel copy.

**6. Other Work is five headed sub-projects with only two links.** If those
entries are not going anywhere, they are costing 30% of the page to say so.

**7. The mobile theme chip cycles with no affordance that it cycles.** The
accessible name is exemplary ("Colour theme: System. Switch to Light.") but
sighted touch users get "SYS" with nothing indicating a third state exists.

---

## 5. Top five improvements

1. **Make the particle portrait resolve** — or commit to the halftone and cut.
   It is the signature effect and it currently does not do what its own source
   comment says. (P2-1)
2. **Fix the hero type floor so it tracks the column from 320px up.** The largest
   element on the site is at 67% of its measure on the most common device class.
   (P2-2)
3. **Rebalance the page so Other Work and Practice are not half of it.** Nothing
   else will change the impression of the site as much per hour spent.
4. **Scroll the expanded index row's CTA into view on mobile**, and give the hero
   a managed relationship to the fold across the 900–1180 range. (P3-3, P3-4)
5. **Resolve the three container-vs-viewport sizing bugs as one class**: the
   practice prose `ch` cap, the person lede wobble, and the hero floor are the
   same mistake the A.5.1 heading fix addressed. A single pass over
   container-relative sizing would close all of them. (P3-1, P3-5, P2-2)

---

## 6. Release-readiness recommendation

**Ready to release.**

There are no P0 or P1 defects. Across seven pages, nineteen widths, two themes,
pointer, touch and keyboard input, and CPU throttling to six times, I could not
find anything broken, unreachable or inaccessible. Zero cumulative layout shift,
sixty frames a second throughout, zero idle cost, and a reduced-motion path that
genuinely disables the work rather than merely hiding it. That is a better
engineering baseline than most portfolio sites ship with.

**A.5 should not be called visually complete.** The tests pass, and passing tests
is exactly what this recommendation is *not* based on. The signature effect of
the site — the one the headline copy is written around — resolves to 0.40 on
mobile and then hands off to a cross-fade. The page's spatial hierarchy still
contradicts the motion hierarchy A.5 was built to establish. Both are visible
only by looking at rendered frames, which is why the test suites did not catch
them, and neither is a reason to hold a release.

Ship it, and treat items 1–3 of the top five as the A.6 brief.

---

## Appendix — artifact index

| File | Contents |
|---|---|
| `scripts/` | Every script, runnable against `vite preview` on :4173 |
| `scripts/cdp.cjs` | The driver (trusted input, no dependencies) |
| `02-hero.txt` | Hero type at 18 widths + entrance frames |
| `03-portrait.txt`, `03b-portrait-idle.txt` | Formation frames; corrected idle-cost run |
| `04-portrait-readability.txt` | Correlation and contrast vs the settled photograph |
| `05-flagship.txt` | Inspect tabs: pointer, keyboard, touch |
| `06*-index*.txt` | Index hover, focus, accordion, navigation |
| `07-reduced-a11y.txt` | Reduced motion + accessibility + tab order |
| `08-perf.txt`, `08b-perf-throttled.txt`, `08c-payload.txt` | CLS, frame pacing, throttling, payload |
| `09-choreography.txt`, `10-structure.txt` | Tier differentiation; page-height distribution |
| `11-responsive-type.txt`, `12-prose-measure.txt` | Line lengths, tap targets, the `ch` diagnosis |
| `13-case-and-identity.txt`, `14-faded.txt`, `15-nav-and-preview.txt` | Case studies, identity, scrollspy, previews |
| `shots/` | 54 matrix screenshots + entrance/formation frames + interaction states |
