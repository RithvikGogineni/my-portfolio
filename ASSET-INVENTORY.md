# A.2 — Asset inventory

Status of every image, model and fact the redesign depends on.
Concept A.2's own rule governs this file:

> Nothing on the site is invented. Anything marked `[supply]` or *Illustrative*
> is a placeholder and stays visibly so until you send the real material.

Content is sourced only from `public/Rithvik-Gogineni-Resume.pdf` (**R**),
existing site copy (**S**), or prose written by you in the approved concept
PDF (**D**). Each claim in `src/content/projects.js` carries its source as a
trailing comment.

---

## 1. Present and used

| Asset | File | Used by |
|---|---|---|
| FTC 16075 robot | `src/assets/images/ftc-robot.webp` | Index preview, case-study hero |
| FIRST Global robot | `src/assets/images/fgc-robot.webp` | Index preview, case-study hero |
| RehabOS interface | `src/assets/images/rehabos.webp` | Index preview, case-study hero |
| NexusOS interface | `src/assets/images/nexusos.webp` | Index preview, case-study hero |
| Roamly interface | `src/assets/images/roamly.webp` | Index preview, case-study hero |
| Med Rehab website | `src/assets/images/medrehab-website.webp` | RehabOS → "The clinic" |
| Portrait | `src/assets/images/profile-photo.webp` | Practice (sheet 04) |
| Résumé | `public/Rithvik-Gogineni-Resume.pdf` | Contact |

## 2. Missing — rendering as a labelled placeholder

These are visible on the site **as placeholders**, tagged in periwinkle on the
charcoal well, exactly as the concept specifies. None is passed off as real.

| ID | Asset | Where it shows now | Replace by |
|---|---|---|---|
| **A-01** | Humanoid: studio photo or clean CAD render, 4:5 | Featured inspection + humanoid case-study hero render a line drawing tagged `ILLUSTRATIVE · ASSET A-01` with "Awaiting studio photograph or CAD render" | Set `media` in `src/content/projects.js` to `{ src, alt, verified: true, figure }` |
| **CAD** | Exploded assembly + bill of materials for a robot | Every robotics case study shows a generic rotary module tagged `ILLUSTRATIVE · AWAITING CAD`; its parts list shows `—` for quantity and material because it has none | See `src/content/assemblies.js` — the schema is documented in-file; no component changes are needed |
| **(hero)** | A real CAD part for the hero exhibit | Generic flange tagged `ILLUSTRATIVE · SWAP FOR CAD` | `PLATE` + `HOTSPOTS` in `src/components/a2/HeroExhibit.jsx` |

## 3. Not on the site — available if you want them

Real assets in the repo that Concept A.2 does not have a slot for:

- `ftc-starter-guide.webp` — Campion FTC Starter Guide
- `proper-constructions.webp`, `gorilla-gym.webp` — freelance client sites
  (named in the Practice section as text, per the résumé, but not shown)
- `portfolio-screenshot.webp` — the previous portfolio

## 4. Facts still to confirm

1. **FTC result wording.** The concept PDF says *"National 2nd Place Inspire
   Award"*. Your résumé says *"Jamaica Inspire Award and Judges' Choice (Ochoa)
   Award at the 2025 FIRST Championship"*. **The site uses the résumé wording.**
   Tell me which is right and I will align both.
2. **JARVIS** and **Veyra** were listed as candidate projects in the brief.
   JARVIS exists in the old site copy as *"developing"*; Veyra appears nowhere
   in the repo or the résumé. Neither has a case study, because there is
   nothing verified to write one from. Send content and each becomes one entry
   in `src/content/projects.js`.
3. **Build log.** The concept has a milestone timeline (concept → build →
   test). It is **not rendered**, because no dated milestones exist. Three real
   dates plus a photo each would turn it on.

## 5. What was removed from the build

The previous site's blog and gallery were Firebase-backed and are not part of
Concept A.2, so they are not in the new shell. Their source is intact on
`main`. Removing them also drops the `firebase`, `react-markdown`, `remark-gfm`,
`react-icons` and `lenis` dependencies. Say the word and I will re-theme either
one as an A.2 sheet.
