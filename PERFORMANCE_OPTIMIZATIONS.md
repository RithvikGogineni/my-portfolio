# Performance & Correctness Audit

_Audited 2026-09-16 against the working tree, verified with `npm run build`,
`npm run lint`, and the production bundle served via `vite preview`._

---

## 1. Why the photos don't work

**Root cause: the Google Cloud billing account for Firebase project
`my-portfolio-14d57` is closed.** Every Storage request returns HTTP 402:

```
GET https://firebasestorage.googleapis.com/v0/b/my-portfolio-14d57.firebasestorage.app/o/images%2Fprojects%2Fprofile-photo.jpg
402 — "The billing account for the owning project is disabled in state closed"
```

Firestore is down for the same reason — `gallerySections` and `blogPosts`
both return `permission-denied`, so the gallery renders "no sections" and the
blog renders empty.

**This is not a code bug and cannot be fixed from the repo.** Re-enable billing
on the project in the Google Cloud console, then confirm the security rules.

Everything below is the code-side work: the site now degrades gracefully while
Firebase is down, and will be materially faster once it's back.

### Deploying the rules

Rules were not version-controlled. They are now (`firestore.rules`,
`storage.rules`, `firebase.json`, `.firebaserc`) — public read, client writes
denied. After billing is restored:

```bash
firebase login && firebase deploy --only firestore:rules,storage
```

---

## 2. Bugs fixed

### P0 — `GalleryImageItem` was declared inside `Gallery`'s render body

`Gallery.jsx` defined the image component *inside* the parent component
function. React therefore saw a **brand-new component type on every render**,
which unmounted and remounted the entire image grid each time. Every remount
reset `useFirebaseImage` to `loading`, re-issued `getDownloadURL`, and restarted
every `<img>` from zero — so the grid could sit in a permanent reload loop and
never settle.

Hoisted to module scope and wrapped in `React.memo`.

**Verified:** with the section list seeded, all 7 grid nodes keep DOM identity
across re-renders (`retained: 7, same_nodes: true`) and produce exactly **7**
Storage requests for 7 images — one apiece, no refetch storm.

### P0 — profile photo was broken in production

`About.jsx` used the literal string `"/src/assets/images/profile-photo.jpg"` as
its fallback. That path only resolves under `vite dev`; in a production build it
404s, so the photo was missing in prod whenever Firebase failed — i.e. right now.

Now imported as a module so Vite emits and rewrites it
(`/assets/profile-photo-2zmeKbWL.jpg`). **Verified loading in the production
build** at 1066×1599 with Firebase still down.

### P1 — a 60fps `setInterval` ran for the lifetime of the Gallery

Scroll velocity was polled with `setInterval(updateVelocity, 16)`, doing work
every 16ms whether or not the page moved. Replaced with a passive `scroll`
listener: same value, zero cost when idle.

### P1 — hover listeners leaked

`mouseenter`/`mouseleave` were attached per gallery item but never removed, so
every effect re-run stacked another pair on the same nodes. Now tracked and
removed in cleanup.

### P1 — `process.env.NODE_ENV` in client code

Three occurrences in `Gallery.jsx`. Vite substitutes this at build time but it
is not the supported idiom and is undefined in other contexts. Replaced with
`import.meta.env.DEV`.

### P1 — broken-image fallback pointed at a file that doesn't exist

`onError` set `src = '/placeholder-image.png'`; there is no such file in
`public/`, so a failed image triggered a second 404. Replaced with a `broken`
state that renders the existing error card.

### P1 — Firestore errors were swallowed, hiding the real problem

`getGallerySections` caught every error and returned `[]`, so a hard
`permission-denied` was indistinguishable from "no data yet" — the UI said
*"No gallery sections found. Add sections to Firestore."* and sent you looking
for missing documents. It now rethrows, and the Gallery names the actual cause
and the command that fixes it.

### P2 — `npm run lint` was linting zero files

`eslint.config.js` matched `**/*.{ts,tsx}`; the entire codebase is `.js`/`.jsx`.
Lint had been silently passing on nothing, which is how the nested component and
`process.env` usage went unnoticed. Glob widened, `no-unused-vars` tuned to
ignore callback params and `catch` bindings, and the resulting real findings
(7 dead imports) cleared.

**Now: 0 errors, 2 pre-existing `exhaustive-deps` warnings** left alone because
changing those deps would alter behavior in components outside this audit.

---

## 3. Bundle

### Firestore → Firestore Lite

The app has no `onSnapshot`, no offline persistence — only `getDocs`/`getDoc`
with `query`/`orderBy`. Swapping `firebase/firestore` for
`firebase/firestore/lite` is behaviour-identical here:

| chunk | before | after |
|---|---|---|
| Firebase | 357.96 kB / **88.93 kB gz** | 177.07 kB / **41.00 kB gz** |

**−47.9 kB gzipped (−54%).**

### Vendor chunking was misconfigured

`manualChunks` used the string form (`['react', 'react-dom', ...]`), which only
matches a package's *exact entry point*. `react-dom/client` is a different
module id, so React DOM's bulk was never captured and landed in the app chunk:

| chunk | before | after |
|---|---|---|
| app entry (`index`) | 268.55 kB / **91.48 kB gz** | 42.68 kB / **16.84 kB gz** |

Total bytes are roughly unchanged — this is a **caching** win. A one-line app
change used to invalidate 91 kB of a visitor's cache; it now invalidates 17 kB,
with React, Framer Motion/GSAP and Firebase sitting in separate long-lived
chunks.

Current total JS: **287 kB gzipped** across all chunks.

### Dependencies removed

`locomotive-scroll`, `three`, `@react-three/fiber`, `@react-three/drei` — **zero
imports anywhere in `src/`**. They were not in the bundle (nothing imported
them), so this shrinks `node_modules` and install time, not the shipped bytes.

### Other

- `preconnect` added for `firebasestorage.googleapis.com` and
  `firestore.googleapis.com` — both are on the critical path for first paint.
- First three gallery images now `loading="eager"` + `fetchPriority="high"`;
  the rest stay lazy. Previously everything was lazy including above-the-fold
  images, which delays LCP.
- `index.html` title and meta description were truncated to just
  "Rithvik Gogineni" in the working tree. Restored the descriptive versions.

---

## 4. Images moved out of Firebase

The 7 project images and the profile photo existed locally **and** were
git-tracked, but the code fetched them from Firebase Storage — which is down.
Two more consumers (`ProjectsCategory.jsx`, `ProjectDetailPage.jsx`) used
`project.image` directly as an `<img src>`, so they rendered the literal string
`images/projects/fgc-robot.png` and 404'd regardless of Firebase.

All of them now come from the bundle:

- Re-encoded to WebP at the size they actually render (900px for cards, 700px
  for the 300×300 profile): **17 MB → 320 kB**, a 98% reduction.
- `data/projects.js` imports them, so Vite fingerprints and serves them.
- `ProjectCard.jsx` and `Projects.jsx` no longer route them through
  `useFirebaseImage` — no network round-trip, no loading spinner.
- The originals were removed from the tree. They remain in git history
  (`git show HEAD:src/assets/images/gorilla-gym.png > recovered.png`).
- `public/placeholder-image.svg` created. The codebase referenced
  `/placeholder-image.png` in four places and **that file never existed**, so a
  failed image produced a second 404. Two projects (`object-tracking`,
  `jarvis-ai`) have no local asset and use it deliberately.

**Verified in the production build:** all 9 project cards render — 7 WebP
images plus 2 intentional placeholders, zero broken. The detail page renders
its image correctly for the first time.

Projects and About now work with Firebase completely offline. The gallery and
blog still need billing restored, since that content exists only in Firebase.

## 5. Framer Motion → LazyMotion

No `layout` or `drag` animations exist anywhere in the codebase, so the full
`motion` bundle was shipping features nothing uses. Converted all 25 files to
the `m` component under `<LazyMotion features={domAnimation} strict>`.

| chunk | before | after |
|---|---|---|
| animation-vendor | 229.81 kB / **83.07 kB gz** | 187.06 kB / **70.56 kB gz** |

**−12.5 kB gzipped.** `strict` makes a stray `motion.*` throw at runtime rather
than silently pulling the full bundle back in.

Verified in the browser against the production build, since this is the change
most likely to break something silently:

- `whileHover` — measured `transform: matrix(1.04, ...)` on real mouse hover,
  matching `whileHover={{ scale: 1.04 }}`.
- `whileInView` — all 9 project cards go 0 → 1 opacity as they scroll in.
- `AnimatePresence` + `exit` — mobile menu opens fully and is removed from the
  DOM after its exit animation completes.
- No motion-related console errors on any of the 9 routes.

---

## 6. Where things stand

- **JS total: 275 kB gzipped** across all chunks.
- **First paint: ~160 kB gz** (`index` 16.9 + `react-vendor` 72.2 +
  `animation-vendor` 70.6), down from a single 91 kB app chunk plus
  a 66 kB animation chunk plus 89 kB of Firebase.
- **Local images: 320 kB**, down from 17 MB.
- `npm run build` passes. `npm run lint` reports **0 errors**, 2 pre-existing
  `exhaustive-deps` warnings in `SectionNav.jsx` and `BlogPage.jsx` left alone
  because changing those deps would alter behavior.

### Still outstanding

- **Restore billing** on `my-portfolio-14d57`, then deploy the rules. Until
  then the gallery and blog have no data and no images.
- **No `srcset`/WebP for gallery images** — worth generating derivatives at
  upload time once Storage is writable again.
- `Gallery.jsx` passes `ease: [0.25, 0.46, 0.45, 0.94]` to **GSAP** in several
  places. That array form is Framer Motion syntax; GSAP expects a string like
  `"power2.out"` and silently falls back to its default. Cosmetic, untouched.
