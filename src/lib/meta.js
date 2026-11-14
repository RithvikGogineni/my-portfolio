// ===========================================================================
// DOCUMENT METADATA
//
// This is a single-page app, so there is exactly one <head> and it has to be
// re-dressed on every route change. The tags themselves are declared in
// index.html with the home page's values, which is what a crawler sees before
// any script runs; this module rewrites them in place afterwards.
//
// Rewriting beats rendering a second set of tags. React 19 will hoist a
// <title> or <meta> rendered anywhere in the tree into <head>, but it hoists
// them *alongside* the ones index.html already shipped — two description
// metas, two canonicals — and which one a consumer believes is then a matter
// of parser order. One tag with one value cannot be ambiguous.
//
// Every value is derived from content, never from the URL bar: a canonical
// built from location.href would hand a crawler back whatever query string it
// arrived with.
// ===========================================================================

export const ORIGIN = 'https://rithvikgogineni.vercel.app';

const SITE_TITLE = 'Rithvik Gogineni · Mechanical & Robotics Engineering, WPI';

/** Writes one meta tag, creating it if index.html did not ship it. */
function setMeta(selector, attr, value, create) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(selector);
  if (!el && create) {
    el = document.createElement(create.tag);
    for (const [k, v] of Object.entries(create.attrs)) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  if (el) el.setAttribute(attr, value);
}

/**
 * @param {object} m
 * @param {string} m.title       the full <title>, used verbatim
 * @param {string} m.description under ~160 characters
 * @param {string} m.path        site-absolute, e.g. "/work/ftc-16075"
 * @param {string} [m.ogTitle]   defaults to the document title
 * @param {string} [m.ogType]    "website" for the home page, else "article"
 * @param {string} [m.image]     site-absolute path to a social image
 */
export function applyMeta({ title, description, path, ogTitle, ogType = 'article', image = '/og-image.png', robots = 'index,follow' }) {
  if (typeof document === 'undefined') return;
  const url = ORIGIN + path;

  document.title = title;
  // Always written, never only on the pages that want noindex: a crawler
  // that saw `noindex` on a retired route and then followed a client-side
  // link would otherwise carry it onto a page that wants indexing.
  setMeta('meta[name="robots"]', 'content', robots,
    { tag: 'meta', attrs: { name: 'robots' } });
  setMeta('meta[name="description"]', 'content', description,
    { tag: 'meta', attrs: { name: 'description' } });
  setMeta('link[rel="canonical"]', 'href', url,
    { tag: 'link', attrs: { rel: 'canonical' } });
  setMeta('meta[property="og:title"]', 'content', ogTitle ?? title,
    { tag: 'meta', attrs: { property: 'og:title' } });
  setMeta('meta[property="og:description"]', 'content', description,
    { tag: 'meta', attrs: { property: 'og:description' } });
  setMeta('meta[property="og:url"]', 'content', url,
    { tag: 'meta', attrs: { property: 'og:url' } });
  setMeta('meta[property="og:type"]', 'content', ogType,
    { tag: 'meta', attrs: { property: 'og:type' } });
  setMeta('meta[property="og:image"]', 'content', ORIGIN + image,
    { tag: 'meta', attrs: { property: 'og:image' } });
  // Twitter reads the og: tags for everything except the card type, which
  // index.html sets once and no page needs to change.
}

/** The home page's own metadata — also the index.html defaults. */
export const HOME_META = {
  title: SITE_TITLE,
  description:
    'Rithvik Gogineni — Mechanical & Robotics Engineering at WPI. FTC Team 16075, lead engineer for Team Jamaica at the FIRST Global Challenge, founder of RehabOS. Open to Summer 2027 internships.',
  path: '/',
  ogTitle: SITE_TITLE,
  ogType: 'website',
};

/**
 * A case study's metadata, built from its content entry.
 *
 * The description is the project's own lede, trimmed at a word boundary
 * rather than mid-word, because a search result that ends "…the engineer" is
 * worse than one that ends "…the".
 */
export function projectMeta(p) {
  const lede = p.lede.replace(/\s+/g, ' ').trim();
  const description = lede.length <= 155
    ? lede
    : lede.slice(0, lede.lastIndexOf(' ', 152)) + '…';
  return {
    title: `${p.title} — ${p.kind} · Rithvik Gogineni`,
    description,
    path: `/work/${p.slug}`,
    ogTitle: `${p.title} · ${p.role}`,
    ogType: 'article',
  };
}
