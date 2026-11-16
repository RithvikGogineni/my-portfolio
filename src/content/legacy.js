// ===========================================================================
// LEGACY ROUTES
//
// The previous site published thirteen numbered project pages and five
// standalone section pages. Those URLs are in people's history, in LinkedIn
// posts and on a résumé that has already been sent out, so each one is
// mapped to the thing it was actually about — not to the home page, which is
// what a blanket redirect does and which is indistinguishable from the link
// being broken.
//
// Three kinds of destination:
//   • a case study, where the project survived as one;
//   • a section of a case study, where it survived inside one;
//   • a row in the Other work index, where it survives as an archive entry.
//
// This table is the single source of truth. `vercel.json` repeats it as
// permanent (308) redirects so the hop happens at the edge with a real
// status code, and `App.jsx` repeats it client-side so the mapping still
// holds in local preview and on any host that only serves index.html. If you
// add a row here, add it there too — the test in the QA sweep compares them.
// ===========================================================================

/** `/projects/:id` → where that project lives now. */
export const PROJECT_ROUTES = {
  1: '/work/first-global',
  2: '/work/ftc-16075',
  // The clinic website and the clinic operating system are different
  // deliverables. The website is the "The clinic" sheet inside RehabOS.
  3: '/work/rehabos#related',
  4: '/#other-proper-constructions',
  5: '/#other-gorilla-gym',
  // The previous portfolio is not a project on this one. The colophon is
  // where this edition explains itself.
  6: '/#colophon',
  7: '/#other-ftc-starter-guide',
  8: '/#other-object-tracking',
  9: '/#other-jarvis',
  10: '/work/humanoid',
  11: '/work/rehabos',
  12: '/work/roamly',
  13: '/work/nexusos',
};

/** The old standalone section pages → the sheet that replaced each one. */
export const SECTION_ROUTES = {
  '/projects': '/#index',
  '/about': '/#practice',
  '/experience': '/#practice',
  '/skills': '/#toolkit',
  '/contact': '/#contact',
};

/**
 * Routes that existed and were deliberately not rebuilt. These do not
 * redirect: they render the retired sheet, which says what happened and
 * where to go instead. A silent redirect to the home page tells a visitor
 * who bookmarked the journal that the site is broken.
 */
export const RETIRED = {
  '/blog': {
    name: 'Journal',
    body: 'The journal never carried a published post. Rather than rebuild an empty publishing system, this edition puts writing where it has an argument to make — inside the case studies. If the journal returns it will be because there is something to put in it.',
  },
  '/gallery': {
    name: 'Gallery',
    body: 'The gallery is being rebuilt as something of its own rather than restored as a grid of photographs. It is not part of this edition.',
  },
};

/** Resolves a legacy pathname to its destination, or null if it is not one. */
export function resolveLegacy(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (SECTION_ROUTES[clean]) return SECTION_ROUTES[clean];
  const m = /^\/projects\/(\d+)$/.exec(clean);
  if (m && PROJECT_ROUTES[m[1]]) return PROJECT_ROUTES[m[1]];
  // `/projects/99` is a numbered project page that never existed. It is still
  // a project link, so it belongs at the index rather than at a bare 404.
  if (m) return '/#index';
  return null;
}
