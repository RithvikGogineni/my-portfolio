# A.5.2 — the two P2 defects from the rendered audit, fixed

Addendum to `REPORT.md`. Measured on the same instruments, against the same
local `vite preview` build, before and after.

Two files changed: `src/components/a2/ParticlePortrait.jsx` and
`src/styles/components.css`. Six functional lines in the first, two in the
second; the rest is comment.

---

## P2-1 — the particle portrait now resolves

### What was actually wrong

Not the timing, the easing or the shader maths. **Coverage.**

The grid is `SRC / step` points on a side — 107 across on desktop. The canvas
is 1395 device px. So each particle owns a 13px cell. A.5 drew them at
`2.3 * dpr` = **4.6px**. A 4.6px disc in a 13px cell covers about **7% of the
frame by area** (confirmed independently by the overdraw figure in
`18-draw-cost.cjs`: 0.07×). The render was mostly the charcoal well showing
through the gaps, which is why it carried ~8% of the photograph's contrast and
why it never resolved into anything. The photograph then cross-faded over the
top and did the work the particles were supposed to do.

Mobile had a second, compounding problem: `step: 5` on a 180px source is a
**36 × 36** mosaic. A 36 × 36 mosaic of a person is not a person, at any point
size.

### The four changes

| | A.5 | A.5.2 | Why |
|---|---|---|---|
| Point size | `2.3 * dpr` (4.6px) | `min(W,H) / across * 1.32` (≈17px) | Derived from the grid, so each particle covers its own cell. 1.32 rather than 1.0 because the disc is inscribed in the point square and its edge is feathered — it has to overlap to close the seams. |
| Mobile grid | 36 × 36 (`step 5`, SRC 180) | **64 × 64** (`step 3`, SRC 192) | Enough resolution to carry a face. Still one `gl.POINTS` draw call. |
| Background thinning | drop 88% above `lum 0.86` | drop 45% above `lum 0.93` | A.5 was discarding most of the wall the subject stands against, so the particle image was missing a large part of the picture and *could not* match it however long it ran. |
| Colour lift / coral | `r * 1.1 + 0.04`, coral 1.2% | `r * 1.06 + 0.02`, coral 0.06% | The lift existed to help sparse particles hold against the well; at full coverage it would overshoot. Tuned against a measurement, not by eye — see "the part I got wrong" below. Coral at 1.2% of a field that now resolves read as dead pixels across the subject's face. |

Two shader multipliers moved with them: the formation swell is `0.7` not `1.6`
(full-coverage discs at 2.6× is a lot of overdraw for no visual gain), and the
post-reveal pointer patch is now **smaller** than a cell rather than 1.7×
larger — at cell size it read as a blocky mosaic laid over the photograph,
where the intent is grain lifting off a print.

### Result — particles alone, measured before the photograph starts to fade in

Structural correlation with the settled photograph, and contrast (RMS):

**Desktop 1440, dark** — photograph still at opacity 0 through t+1100ms:

| t | corr before | corr after | RMS before | RMS after |
|---|---|---|---|---|
| 400ms | 0.174 | 0.442 | 2.7 | 19.8 |
| 700ms | 0.251 | **0.762** | 3.2 | 25.6 |
| 1100ms | 0.433 | **0.924** | 4.1 | **26.9** |

**Mobile 390, light** — photograph still at opacity 0 through t+1600ms:

| t | corr before | corr after | RMS before | RMS after |
|---|---|---|---|---|
| 700ms | 0.335 | 0.500 | 15.4 | 20.1 |
| 1100ms | 0.377 | 0.735 | 15.5 | 27.0 |
| 1600ms | **0.397** | **0.949** | 15.4 | **34.1** |

The settled photograph measures RMS 41.2 (desktop) and 50.7 (mobile). So the
particle field now carries **65% and 67%** of the photograph's contrast, where
A.5 carried 8% and 30%.

Peak correlation went **0.643 → 0.924** on desktop and **0.397 → 0.949** on
mobile. The portrait resolves before the photograph arrives, which is what the
component's own documentation always claimed it did.

Frames: `after/portrait-1440-dark-t*.png`, `after/portrait-390-light-t*.png`.

### The part I got wrong, recorded because it changed the fix

Looking at the first corrected frames I read the skin as orange-shifted and was
about to correct the colour. I measured it instead. The particle render was
**darker and slightly cooler** than the photograph, not warmer — face region
R 80 vs the photograph's R 109.7. The "orange" was a local-contrast illusion
from bright skin dots against dark seams. Had I trusted my eye I would have
pushed the colour the wrong way.

The real colour finding was the one the measurement gave: a uniform ~35 RGB
unit deficit across the well, which made the hand-off to the photograph read as
a brightness pop. Raising the tile factor 1.22 → 1.32 and restoring a modest
lift closed that to ~25 units. A residual gap remains and is honest: a tiled
disc field cannot equal a continuous photograph, and chasing the last of it
would overshoot into brighter-than-the-photo.

---

## P2-2 — the hero headline now tracks its column

### What was wrong

`--type-hero: clamp(4.25rem, 15.5vw, 18.75rem)`. The `15.5vw` term does not
overtake the 68px floor until **439px** — wider than every common phone. So
across the entire phone range the largest element on the site was a constant
68px while its column grew by a third, and the type got relatively *smaller*
the larger the phone.

The cause is exactly the one A.5.1 fixed on the person heading: **type sized
from the window, inside a box sized by the grid.** In the two-column layout the
plate is about 64% of the viewport, so 15.5vw lands at a well-composed ~89%
fill. On a phone the plate is about 89% of the viewport, and the same
coefficient is far too small.

### The change

```css
.a2-hero__plate { container-type: inline-size; }
.a2-hero__name  { font-size: min(max(var(--type-hero), 24cqw), 16.5rem); }
```

`24cqw` is measured: the longest line renders at **3.706×** its font size, so
it fills the plate at 26.98cqw, and 24cqw sits at 88.9% — the fill the 1440
composition already had.

`max()` makes this a **floor, not a replacement**. Every width where the
existing curve was already well composed keeps exactly the value it has today,
including the 264px cap at the top end. Only the widths where the name was
loose are raised.

### Result — "Gogineni" as a share of its column

| Viewport | Font before | Font after | Fill before | Fill after |
|---|---|---|---|---|
| 320 | 68px | 68.2px | 88.8% | 89.0% |
| 360 | 68px | 77.8px | 77.8% | 89.0% |
| 390 | 68px | 85.0px | 71.2% | 89.0% |
| 414 | 68px | 90.7px | **66.7%** | **89.0%** |
| 480 | 74.4px | 106.6px | 62.1% | 89.0% |
| 768 | 119px | 172.5px | 61.4% | 89.0% |
| 1024 | 158.7px | 230px | 61.4% | 89.0% |
| **1180** | 182.9px | **182.9px** | 90.5% | 90.5% |
| **1440** | 223.2px | **223.2px** | 89.3% | 89.3% |
| **1728+** | 264px | **264px** | 97.9% | 97.9% |

Constant 89% fill from 320px to 1024px; 1180px and up byte-for-byte unchanged.
Zero overflow at all 18 widths tested, and no horizontal document overflow.

### One consequence, stated rather than buried

Bigger type makes a taller hero. Hero height as a share of a 900px viewport
rose at the widths where the type grew — 1024px went from 108% to **122%**, 768
from 106% to 117%. The hero already overran the fold at those widths before
this change; it now overruns it by more, and the lede and the
"DESIGN · BUILD · PROGRAM" rule sit further below it.

I judged this the right trade, because what is above the fold at 1024×900 is
now the sheet label, the full name at poster scale and the complete spec list,
which is a stronger opening than a name at 61% of its measure. But it is a
composition change at tablet and small-laptop widths, not a pure bug fix, and
it is the reason P3-4 in the report (the hero's unmanaged relationship to the
fold) is now more pronounced rather than less. If the taller hero is not
wanted, the lever is the `24cqw` figure.

---

## Verification

| Check | Result |
|---|---|
| `tsc -b` | 0 errors |
| `eslint .` | 0 problems |
| `vite build` | clean |
| Clip audit, 7 pages × 19 widths | **no clipped display lines** |
| A.5 motion suite | all checks passed |
| A.4 regression suite | all checks passed |
| QA matrix, 6 widths × 2 themes | clean |
| Portrait idle cost | still **0 rAF** over 2s when settled, 0 when scrolled away, 0 on return |
| Reduced motion | unchanged — canvas never raised, photograph at opacity 1 immediately |
| Build long-task at formation | 67ms, vs **80ms on the pre-fix baseline** — measured by checking out `HEAD`, rebuilding and re-running. Not a regression. |

### A measurement that could not be completed

**Frame rate during formation.** The draw is heavier now — overdraw goes from
0.07× to 1.17× at rest and 3.37× at the formation peak. I could not measure the
60fps headroom, because this Chrome instance is vsync-capped at 30Hz for the
whole session: an **idle page with no portrait running measures the same
33.3ms** as one mid-formation, at every width and at 1×, 4× and 6× CPU
throttling. Formation is therefore indistinguishable from doing nothing in this
environment, which rules out a large regression but does not prove 60fps.

`gl.finish()` does not block in Chrome, so the synthetic GPU timing in
`18-draw-cost.cjs` returned 0.000ms and is void; only its analytic overdraw
figures are meaningful. For scale, 3.37× overdraw on a 1395² canvas is 6.6M
fragments, under 2× a full-screen 1440p composite — but that is arithmetic, not
a measurement, and a real-device pass is still owed.
