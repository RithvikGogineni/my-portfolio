// A.4 — full QA sweep. Everything the brief's §12 lists, measured rather
// than asserted, plus the A.3 guarantees that A.4 could plausibly have broken.
const { CDP, newPage, setup, goto, evaluate, hover, click, key, touchTap, sleep } = require('./cdp.cjs');

const B = 'http://localhost:4173';
const PUBLISHED = ['ftc-16075', 'first-global', 'rehabos', 'nexusos', 'roamly'];
const ALL = [...PUBLISHED, 'humanoid'];

const fail = [];
const ck = (ok, label, detail) => {
  if (!ok) fail.push(label + (detail ? ' — ' + detail : ''));
  console.log((ok ? '  ok  ' : 'FAIL  ') + label + (detail ? '  [' + detail + ']' : ''));
  return ok;
};

(async () => {
  const cdp = await CDP.connect();
  const { S } = await newPage(cdp);
  const logs = [];
  cdp.on('Runtime.exceptionThrown', p => logs.push('EXC ' + (p.exceptionDetails.exception?.description || '').slice(0, 170)));
  cdp.on('Runtime.consoleAPICalled', p => { if (p.type !== 'log') logs.push(p.type + ': ' + (p.args?.[0]?.value || '').toString().slice(0, 140)); });

  // ===== project order and the held project ================================
  console.log('\n===== order, hierarchy, held project =====');
  await setup(S, { width: 1440, height: 1000, scheme: 'light', dpr: 1, mobile: false });
  await goto(S, B + '/', 3600);
  const feat = await evaluate(S, `document.querySelector('.a2-feature__head h2')?.textContent.replace(/\\s+/g,' ').trim()`);
  ck(/FTC Team 16075/.test(feat || ''), 'FTC is the featured project', feat);

  const rows = JSON.parse(await evaluate(S, `JSON.stringify([...document.querySelectorAll('.a2-row')].map(r=>({
    n: r.querySelector('.a2-row__n')?.textContent.trim(),
    t: r.querySelector('.a2-row__title')?.textContent.trim(),
    href: r.getAttribute('href')})))`));
  console.log('   index:', rows.map(r => `${r.n} ${r.t}`).join(' | '));
  ck(rows.length === 4, 'index holds four projects', String(rows.length));
  // A.5.3 — NexusOS was held back and Med Rehab Professionals took slot 04.
  ck(rows.map(r => r.t).join('|') === 'FIRST Global Challenge|RehabOS|Med Rehab Professionals|Roamly', 'index order', rows.map(r => r.t).join('|'));
  ck(rows.every(r => r.n && r.t), 'every index row numbered');
  ck(!JSON.stringify(rows).includes('Humanoid'), 'humanoid is not in the index');
  ck(!JSON.stringify(rows).includes('NexusOS'), 'nexusos is held back, not in the index');
  const sitemap = await evaluate(S, `fetch('/sitemap.xml').then(r=>r.text())`);
  // Match <loc> entries only: the file explains in a comment why the humanoid
  // is absent, and a naive substring search found that sentence.
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  console.log('   sitemap:', locs.map(u => new URL(u).pathname).join(' '));
  ck(!locs.some(u => u.includes('/work/humanoid')), 'humanoid is not in the sitemap');
  ck(PUBLISHED.every(s => locs.some(u => u.endsWith('/work/' + s))), 'all five published projects are in the sitemap');

  // reachable directly, says why it is held, still has its content
  await goto(S, B + '/work/humanoid', 3000);
  const hum = JSON.parse(await evaluate(S, `JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    held: document.querySelector('.a2-case__heldHead')?.textContent.trim(),
    heldBody: (document.querySelector('.a2-case__heldBody')?.textContent||'').length,
    next: document.querySelector('.a2-next__title')?.textContent.trim() ?? null,
    sections: document.querySelectorAll('main section').length,
    robots: document.querySelector('meta[name=robots]')?.content,
    canonical: document.querySelector('link[rel=canonical]')?.href })`));
  console.log('   humanoid:', JSON.stringify(hum));
  ck(/Humanoid/.test(hum.h1 || ''), 'humanoid page still renders', hum.h1);
  ck(!!hum.held && hum.heldBody > 100, 'humanoid says it is held back', hum.held);
  ck(hum.next === null, 'held page has no next-project link');
  ck(hum.sections >= 4, 'humanoid content preserved', String(hum.sections));
  ck(hum.robots === 'index,follow', 'humanoid still indexable', hum.robots);

  // the legacy URL for it must still work
  await goto(S, B + '/projects/10', 2000);
  ck((await evaluate(S, `location.pathname`)) === '/work/humanoid', 'legacy /projects/10 still reaches the humanoid');

  // next/prev cycle runs over published only
  const chain = [];
  let at = 'ftc-16075';
  for (let i = 0; i < 6; i++) {
    await goto(S, `${B}/work/${at}`, 2300);
    const n = await evaluate(S, `document.querySelector('.a2-next__link')?.getAttribute('href')`);
    if (!n) break;
    at = n.split('/').pop(); chain.push(at);
  }
  console.log('   next chain:', chain.join(' → '));
  ck(!chain.includes('humanoid'), 'next/prev cycle skips the held project', chain.join('→'));
  ck(chain.length === 6 || chain[chain.length - 1] === 'ftc-16075', 'cycle closes on itself', chain.join('→'));

  // ===== SEO ================================================================
  console.log('\n===== metadata =====');
  const seen = new Set();
  for (const slug of ALL) {
    await goto(S, `${B}/work/${slug}`, 2200);
    const m = JSON.parse(await evaluate(S, `JSON.stringify({
      t: document.title, c: document.querySelector('link[rel=canonical]')?.href,
      d: document.querySelector('meta[name=description]')?.content,
      nd: document.querySelectorAll('meta[name=description]').length,
      nc: document.querySelectorAll('link[rel=canonical]').length })`));
    ck(m.c === `https://rithvikgogineni.vercel.app/work/${slug}`, `${slug} canonical`, m.c);
    ck(m.nd === 1 && m.nc === 1, `${slug} single description/canonical`, `${m.nd}/${m.nc}`);
    ck(!seen.has(m.t), `${slug} unique title`); seen.add(m.t);
    ck(m.d && m.d.length <= 160, `${slug} description length`, String((m.d || '').length));
  }
  await goto(S, B + '/', 2600);
  ck((await evaluate(S, `document.querySelector('link[rel=canonical]')?.href`)) === 'https://rithvikgogineni.vercel.app/', 'home canonical');

  // ===== the withheld portrait ============================================
  // A.5.3 — the particle portrait and the photograph are both off the page at
  // the author's request, so every check that used to live here (formation
  // timing, the photograph's opacity, the no-WebGL fallback, replay on
  // scroll) is testing something that no longer exists. What has to be true
  // instead is narrower and, for a withheld likeness, more important: the
  // well still occupies its square, it says what is missing, and there is no
  // image or canvas anywhere that could carry the face.
  console.log('\n===== withheld portrait =====');
  await goto(S, B + '/', 2600);
  await evaluate(S, `(()=>{const e=document.querySelector('.a2-pp--empty');
    if(e) window.scrollTo({top:e.getBoundingClientRect().top+window.scrollY-130,behavior:'instant'});})()`);
  await sleep(700);
  const ph = JSON.parse(await evaluate(S, `JSON.stringify((()=>{
    const f=document.querySelector('.a2-pp--empty');
    if(!f) return {missing:true};
    const r=f.getBoundingClientRect();
    return { square: Math.abs(r.width-r.height) < 2, w: Math.round(r.width),
      opacity: getComputedStyle(f).opacity,
      says: /awaiting/i.test(f.innerText),
      tagged: !!f.querySelector('.a2-tag'),
      likeness: !!document.querySelector('.a2-pp__img, .a2-pp__canvas'),
      anyPortraitAsset: [...document.querySelectorAll('img')]
        .some(i=>/portrait-/i.test(i.currentSrc||i.src||'')) };})())`));
  console.log('   ', JSON.stringify(ph));
  ck(!ph.missing && ph.w > 0, 'the portrait well is still in the layout', JSON.stringify(ph));
  ck(ph.square, 'the well keeps its square box, so nothing below it moves', String(ph.square));
  ck(+ph.opacity === 1 && ph.says && ph.tagged,
    'the well is visible and says what is missing', JSON.stringify({op:ph.opacity, says:ph.says, tagged:ph.tagged}));
  ck(!ph.likeness && !ph.anyPortraitAsset,
    'no likeness is rendered anywhere — no canvas, no photograph',
    JSON.stringify({likeness:ph.likeness, asset:ph.anyPortraitAsset}));

  // reduced motion: the well is simply there, as everything else is
  await setup(S, { width: 1440, height: 1000, scheme: 'light', dpr: 1, mobile: false, reducedMotion: true });
  await goto(S, B + '/', 900);
  const rm = JSON.parse(await evaluate(S, `JSON.stringify((()=>{
    const f=document.querySelector('.a2-pp--empty');
    return { opacity: f? getComputedStyle(f).opacity : null,
      anims: document.getAnimations().filter(a=>(a.effect?.getTiming?.().duration||0)>1).length };})())`));
  console.log('   reduced motion:', JSON.stringify(rm));
  ck(+rm.opacity === 1, 'reduced motion shows the well immediately', String(rm.opacity));
  ck(rm.anims === 0, 'reduced motion runs no entrance animations', String(rm.anims));
  await setup(S, { width: 1440, height: 1000, scheme: 'light', dpr: 1, mobile: false });

  // ===== overflow ===========================================================
  console.log('\n===== overflow =====');
  const widths = [320, 360, 390, 430, 620, 621, 768, 834, 900, 1024, 1100, 1280, 1440, 1920];
  for (const mobile of [false, true]) {
    for (const scheme of ['light', 'dark']) {
      const bad = [];
      for (const w of widths) {
        await setup(S, { width: w, height: 820, scheme, dpr: 1, mobile });
        for (const path of ['/', '/work/ftc-16075', '/work/humanoid']) {
          await goto(S, B + path, 2400);
          await evaluate(S, `window.scrollTo({top:document.body.scrollHeight,behavior:'instant'})`);
          await sleep(500);
          const r = JSON.parse(await evaluate(S, `JSON.stringify((()=>{
            const over = document.documentElement.scrollWidth - window.innerWidth;
            let who=null;
            if (over>0) for (const el of document.querySelectorAll('body *')) {
              const b=el.getBoundingClientRect();
              if (b.right > window.innerWidth+0.5 && b.width>0){ who=(el.className||el.tagName).toString().slice(0,42); break; } }
            return {over, who};})())`));
          if (r.over > 0) bad.push(`${w}${path} +${r.over} (${r.who})`);
        }
      }
      ck(bad.length === 0, `no overflow · ${mobile ? 'touch' : 'mouse'} ${scheme}`, bad.join(', '));
    }
  }

  // ===== headings, targets, aria, CLS ======================================
  console.log('\n===== semantics =====');
  await setup(S, { width: 1440, height: 1000, scheme: 'light', dpr: 1, mobile: false });
  for (const path of ['/', ...ALL.map(s => `/work/${s}`)]) {
    await goto(S, B + path, 2500);
    await evaluate(S, `window.scrollTo({top:document.body.scrollHeight,behavior:'instant'})`); await sleep(700);
    const o = JSON.parse(await evaluate(S, `JSON.stringify([...document.querySelectorAll('h1,h2,h3,h4')].map(h=>h.tagName))`));
    const h1 = o.filter(x => x === 'H1').length;
    let skip = null;
    for (let i = 1; i < o.length; i++) {
      const a = +o[i - 1][1], b = +o[i][1];
      if (b > a + 1) { skip = `${o[i - 1]}→${o[i]}`; break; }
    }
    ck(h1 === 1, `${path} exactly one h1`, String(h1));
    ck(!skip, `${path} no heading level skipped`, skip);
  }

  await setup(S, { width: 390, height: 844, scheme: 'light', dpr: 1, mobile: true });
  for (const path of ['/', '/work/ftc-16075']) {
    await goto(S, B + path, 3000);
    await evaluate(S, `window.scrollTo({top:document.body.scrollHeight,behavior:'instant'})`); await sleep(1000);
    await evaluate(S, `window.scrollTo({top:0,behavior:'instant'})`); await sleep(300);
    const small = JSON.parse(await evaluate(S, `JSON.stringify((()=>{const out=[];
      for (const el of document.querySelectorAll('a,button,input,[role=tab],[role=radio]')) {
        const r=el.getBoundingClientRect(); if (r.width<1||r.height<1) continue;
        // 1x1 is the visually-hidden-until-focused pattern, not a target.
        if (r.width<=1 && r.height<=1) continue;
        if (r.height<43.5) out.push(((el.className||el.tagName).toString().slice(0,30))+' '+Math.round(r.width)+'x'+Math.round(r.height)); }
      return out;})())`));
    ck(small.length === 0, `${path} touch targets ≥44px`, small.join(', '));
    const skip = JSON.parse(await evaluate(S, `JSON.stringify((()=>{const a=document.querySelector('.a2-skip');
      if(!a) return null; a.focus(); const r=a.getBoundingClientRect();
      return {w:Math.round(r.width), h:Math.round(r.height)};})())`));
    ck(!!skip && skip.h >= 44, `${path} skip link is a real target once focused`, skip && skip.w+'x'+skip.h);
  }

  console.log('\n===== stability =====');
  for (const [w, h, mob] of [[1440, 900, false], [834, 1112, false], [390, 844, true]]) {
    for (const scheme of ['light', 'dark']) {
      await setup(S, { width: w, height: h, scheme, dpr: 1, mobile: mob });
      await goto(S, B + '/', 500);
      await evaluate(S, `window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) window.__cls+=e.value;}).observe({type:'layout-shift',buffered:true});1`);
      await sleep(3000);
      const cls = +(await evaluate(S, `String(window.__cls)`));
      const refs = JSON.parse(await evaluate(S, `JSON.stringify((()=>{let b=0,o=0;
        for(const el of document.querySelectorAll('[aria-controls],[aria-labelledby],[aria-describedby]'))
          for(const a of ['aria-controls','aria-labelledby','aria-describedby']){const v=el.getAttribute(a); if(!v) continue;
            for(const id of v.split(/\\s+/).filter(Boolean)) document.getElementById(id)?o++:b++;}
        return {broken:b, ok:o};})())`));
      ck(cls < 0.1 && refs.broken === 0, `${w} ${scheme} · CLS ${cls.toFixed(4)}, broken aria ${refs.broken}`);
    }
  }

  console.log('\nconsole:', logs.length ? logs : 'clean');
  ck(logs.length === 0, 'console clean', logs.join(' | '));
  console.log('\n================= RESULT =================');
  console.log(fail.length ? 'FAILURES:\n - ' + fail.join('\n - ') : 'All checks passed.');
  process.exit(0);
})();
