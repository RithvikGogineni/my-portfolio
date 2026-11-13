# A.3 — Asset and fact inventory

Status of every image, document and claim the site depends on.
Concept A.2's own rule still governs this file:

> Nothing on the site is invented. Anything marked `[supply]` or *Illustrative*
> is a placeholder and stays visibly so until you send the real material.

Content is sourced only from `public/Rithvik-Gogineni-Resume.pdf` (**R**),
existing site copy (**S**), prose written by you in the approved concept PDF
(**D**), or a dated engineering document that is named at the point of use
(**N**). Each claim in `src/content/projects.js` carries its source as a
trailing comment.

---

## 1. Media

“Verified” here means *the file depicts what the page says it depicts*. It is
not a claim about the underlying engineering.

| Project | File | Type | Source / provenance | Verified | Used for | Optimise? | Missing |
|---|---|---|---|---|---|---|---|
| FTC 16075 | `ftc-robot.webp` 900×509, 36 KB | CAD render | Carried over from the previous site; origin not established | **No** — labelled on the page as a render of unconfirmed season | Case-study hero, index preview | Source is 900px wide and displays up to 1348px — needs a larger export, not recompression | A photograph of the competition robot on the field |
| FIRST Global | `fgc-robot.webp` 900×507, 40 KB | CAD render | Same | **No** — labelled as a render, not a competition photograph | Case-study hero, index preview | Same | A build or arena photograph of *Probox Curry* |
| RehabOS | `rehabos.webp` 1440×981, 48 KB | Product screenshot | Real RehabOS dashboard | Yes | Case-study hero, index preview | No | A screen with a demo dataset instead of an empty new tenant — see §4.1 |
| Med Rehab website | `medrehab-website.webp` 1440×983, 64 KB | Site screenshot | Real client site | Yes | RehabOS → “The clinic”; Other work 10 | No | — |
| Roamly | `roamly.webp` 1440×900, 16 KB | Logotype | The app's own identity | Yes — captioned “Fig. 01 — Identity”, not as an interface | Case-study hero, index preview | No | **A route-selection or turn-by-turn screen.** This is the single most valuable missing software asset |
| NexusOS | `nexusos.webp` 1440×989, 28 KB | Marketing landing page | Real, but states “Eighteen specialized AI agents” and “Trusted by 247+ businesses worldwide” in its own pixels | **Withdrawn** | **Not published.** File kept in the repo; the page renders a labelled empty well instead | — | A screen of the proposal → review → approval workflow |
| FTC Starter Guide | `ftc-starter-guide.webp` 900×592, 48 KB | Workspace screenshot | The guide itself; its cover text is the source for that entry's copy | Yes | Other work 07 | No | A shareable link or an export, if the guide is ever published |
| Proper Constructions | `proper-constructions.webp` 900×536, 32 KB | Site screenshot | Real client site | Yes | Other work 11 | No | A current live URL — none confirmed, so no link is shown |
| Gorilla Gym / Club1962 | `gorilla-gym.webp` 900×596, 64 KB | Site screenshot | Real client sites | Yes | Other work 12 | No | Separate images if the two sites differ enough to show both |
| Practice | `profile-photo.webp` 700×1050, 60 KB | Portrait | Yours | Yes | Practice sheet | No | The concept asks for a workshop / part-in-hand pair instead of a portrait |
| — | `professional_photo.jpg` 1122×1402, 288 KB | Portrait | Yours | Yes | **Unused.** Larger alternative to the above | Would need converting to WebP if adopted | — |
| — | `portfolio-screenshot.webp` 900×584, 20 KB | Site screenshot | The *previous* portfolio | Yes | **Unused** — the colophon is prose, not a self-referential case study | — | — |
| — | `src/assets/images/gallery/` | (empty directory) | Preserved for the separate gallery phase | — | — | — | Untouched by A.3, as instructed |

## 2. Placeholders currently on the site

These render **as placeholders**, tagged in periwinkle on the charcoal well.
None is passed off as real.

| ID | Asset | Where it shows | Replace by |
|---|---|---|---|
| **A-01** | Humanoid: studio photo or clean CAD render, 4:5 | Featured inspection + humanoid hero render a line drawing tagged `ILLUSTRATIVE · ASSET A-01` | Set `media` in `src/content/projects.js` to `{ src, alt, verified: true, figure }` |
| **A-05** | NexusOS: proposal → review → approval workflow | Empty well tagged `ILLUSTRATIVE · ASSET A-05`, with the reason the marketing page was withdrawn stated inside it | Same |
| **A-06** | Roamly: route selection or navigation | The logotype, captioned as identity, with “awaiting a route-selection or navigation screen” under it | Same |
| **CAD** | Exploded assembly + bill of materials | All three robotics case studies show a generic rotary module tagged `ILLUSTRATIVE · AWAITING CAD`; its parts list shows `—` for quantity and material | See `src/content/assemblies.js` |
| **(hero)** | A real CAD part for the hero exhibit | Generic flange tagged `ILLUSTRATIVE · SWAP FOR CAD` | `PLATE` + `HOTSPOTS` in `src/components/a2/HeroExhibit.jsx` |

There is CAD in `~/Downloads` (`16075.stl`, `16075.fbx`, `Tsunami Chassis
Decode 24823.step`) that was **not** used: an STL has no part names,
quantities or materials, and the assembly viewer's whole point is that its
labels are real. A STEP file with a named assembly tree would change that.

## 3. Documents used as sources

| Document | Used for | Published on the site? |
|---|---|---|
| `public/Rithvik-Gogineni-Resume.pdf` | Everything marked **R** | Yes — linked from the header, hero, every case study and Contact |
| Crimson Crocs Engineering Portfolio, DECODE season (`~/Downloads`) | FTC *How it got there* and *Decisions* (**N**) | No — cited in prose as “the team's engineering portfolio”, not linked |
| Team Jamaica Engineering Notebook, 2025 (`~/Downloads`) | FIRST Global *How it got there* (**N**) | No — cited as “Team Jamaica's engineering notebook” |

Neither engineering document is linked, because both are team documents that
are not mine to publish and both contain other students' names, coaches'
names and the team's finances. **If you want either linked or excerpted, say
so** — a public link would be strong evidence and the case studies are
written so one could be dropped in.

## 4. Facts to confirm

### 4.1 Needs your answer

1. **The résumé PDF still says “Captain”.** The 2025–26 role is confirmed as
   **co-captain** (see §4.2) and the site now says so everywhere. The served
   `public/Rithvik-Gogineni-Resume.pdf` has not been reissued, so the site and
   the document it links to disagree on this one line. The PDF is yours to
   regenerate; nothing in the repo can fix it.
2. **The four achievements that are not on the résumé.** The previous site
   listed an *OUCC* win (2021 & 2022), *FIRST Lego League* representation
   (2017), a *chess U1800* title (2022) and an *ABRSM Grade 2* distinction
   (2023). None is on the résumé, and the previous site expanded OUCC as
   “Outstanding University Computer Competition”, which does not match the
   competition of that name. They are **not published** pending confirmation
   of the event, year and level.
3. **The RehabOS screenshot** shows the onboarding checklist mid-setup, all
   counters at zero, and a named clinic principal in the account rail. It is
   published with a caption saying exactly that. A screen with a demo dataset
   and no personal name would be better evidence and carries no privacy
   question.
4. **Proper Constructions** has no confirmed live URL, so that row has no
   link.

### 4.2 Resolved

- **Co-captain, not captain (2025–26)** — confirmed 2026-11-13. The team ran a
  deliberate two-person model: engineering was this half of it, programming
  the other. The site says *Co-Captain* in the standing line, the FTC role
  fact, the role metadata and the ownership note. The résumé PDF still reads
  *Captain* — see §4.1.1.
- **FTC result wording** — confirmed 2026-11-12. The résumé is right: *Jamaica
  Inspire Award and the Judges' Choice (Ochoa) Award at the 2025 FIRST
  Championship*. The concept PDF's *“National 2nd Place Inspire Award”* was a
  drafting guess and is **deliberately not used**. Do not “correct” the site
  to match the PDF on this point.
- **Halls of Learning dates** — the previous site said 2021–2025, the résumé
  says 2022–2025. The site follows the résumé.
- **The 2024–25 season name** — *Into the Deep*, from the starter guide's own
  cover text. The 2025–26 season is *DECODE*, from the engineering portfolio
  cover. Both are now on the FTC case study.
- **JARVIS** — kept as *in development*, with the feature list explicitly
  described as a target rather than a changelog, as the previous site had it.
- **Veyra** — appears nowhere in the repository, the résumé or the previous
  site, and is not on this one.

### 4.3 Claims corrected in A.3

Each was a résumé line that had acquired a comparison the source did not make.

| Was | Now |
|---|---|
| FIRST Global geometry “sized with custom projectile calculations **rather than tuned by trial**” | “sized using custom projectile calculations” |
| RehabOS speech pipeline — “**off-the-shelf transcription does not handle either**” | “A three-stage speech pipeline built for Jamaican English and Patois” |
| FTC autonomous — “**the one competition debugging touched most**” | the subsystem described, with no ranking |
| Roamly — “the same request from two users is **answered once**” | “caching across users rather than per device”, which is the résumé's wording |
| RehabOS — 67 pages under test presented as a reliability result | stated as coverage, with what it does *not* establish said in the same breath |
| NexusOS marketing image — “Eighteen specialized AI agents”, “Trusted by 247+ businesses worldwide” | image withdrawn; a `Status` fact now reads “Designed and architected · no deployment claimed” |
| “I captain FTC Team 16075” (undated, now behind us) | “I co-captained … through the 2025–26 season” |
| “Captain (2025–26)” on the FTC case study | “Co-Captain (2025–26)”, confirmed 2026-11-13 |

## 5. Still missing, in priority order

1. **A real flagship photograph.** One good photograph of a finished robot on
   a field or a bench would do more for this site than any other single
   asset. Today the first screen and all three robotics heroes are renders or
   drawings.
2. **A Roamly product screen.** The only software case study with no interface.
3. **A NexusOS workflow screen.** Needed before that project can show anything.
4. **A humanoid build photograph**, plus degrees of freedom, actuator choice
   and control topology — the case study says in as many words that it cannot
   show these yet.
5. **A short clip** of any of the above working.
6. **Three dated build milestones.** The concept has a build log; it is still
   not rendered, because no dated milestones exist.
7. **Genuine CAD with a named part tree** for the assembly viewer.

## 6. What was removed from the build

The previous site's blog and gallery were Firebase-backed and are not part of
Concept A.2. A.3 does **not** rebuild them — but `/blog` and `/gallery` no
longer redirect silently to the home page either: each renders a retired
sheet that says what happened, carries `noindex`, and offers the index and
contact. Their source is intact on `main`, as are the gallery assets.
