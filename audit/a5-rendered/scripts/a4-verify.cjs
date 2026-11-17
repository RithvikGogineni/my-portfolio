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
  ck(rows.map(r => r.t).join('|') === 'FIRST Global Challenge|RehabOS|NexusOS|Roamly', 'index order', rows.map(r => r.t).join('|'));
  ck(rows.every(r => r.n && r.t), 'every index row numbered');
  ck(!JSON.stringify(rows).includes('Humanoid'), 'humanoid is not in the index');
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

  // ===== the particle portrait =============================================
  console.log('\n===== particle portrait =====');
  await goto(S, B + '/', 3200);
  await hover(S, 12, 12);
  await evaluate(S, `(()=>{const e=document.querySelector('.a2-pp');
    window.scrollTo({top:e.getBoundingClientRect().top+window.scrollY-130,behavior:'instant'});})()`);
  const t0 = Date.now();
  let revealed = 'false';
  while (Date.now() - t0 < 6000) {
    revealed = await evaluate(S, `document.querySelector('.a2-pp').dataset.revealed`);
    if (revealed === 'true') break;
    await sleep(120);
  }
  const took = Date.now() - t0;
  ck(revealed === 'true', 'portrait resolves', revealed);
  ck(took >= 1200 && took <= 3600, 'formation lands in the 1.5–2.5s band (plus observer latency)', took + 'ms');
  await sleep(1100); // the photograph fades in over 760ms once `revealed` flips
  const pp = JSON.parse(await evaluate(S, `JSON.stringify((()=>{const f=document.querySelector('.a2-pp');
    const img=f.querySelector('img'), c=f.querySelector('canvas');
    const ib=img.getBoundingClientRect();
    return { imgOpacity: getComputedStyle(img).opacity, alt: img.getAttribute('alt')?.length,
      canvasAria: c.getAttribute('aria-hidden'), natural: img.naturalWidth,
      sameBox: Math.abs(ib.width-ib.height) < 2, mask: getComputedStyle(img).maskImage };})())`));
  console.log('   ', JSON.stringify(pp));
  ck(pp.imgOpacity === '1', 'the photograph is fully visible', pp.imgOpacity);
  ck(pp.natural > 0, 'the photograph actually decoded', String(pp.natural));
  ck(pp.alt > 40, 'the photograph carries real alt text', String(pp.alt));
  ck(pp.canvasAria === 'true', 'canvas is hidden from assistive tech');
  ck(pp.mask === 'none', 'nothing is masking the face at rest', pp.mask);

  // it must idle at zero cost once revealed
  const frames = await evaluate(S, `new Promise(res=>{let n=0;const t=performance.now();
    const f=()=>{n++; if(performance.now()-t<900) requestAnimationFrame(f); else res(n);}; requestAnimationFrame(f);})`);
  const busy = await evaluate(S, `new Promise(res=>{
    let painted=0; const o=new PerformanceObserver(()=>{painted++;});
    try{o.observe({entryTypes:['longtask']});}catch(e){}
    setTimeout(()=>{o.disconnect();res(painted);},900);})`);
  console.log('   idle rAF frames (browser clock):', frames, ' longtasks:', busy);
  ck(busy <= 1, 'no sustained long tasks while idle', String(busy));

  // scrolling away and back must not replay it
  await evaluate(S, `window.scrollTo({top:0,behavior:'instant'})`); await sleep(700);
  await evaluate(S, `(()=>{const e=document.querySelector('.a2-pp');
    window.scrollTo({top:e.getBoundingClientRect().top+window.scrollY-130,behavior:'instant'});})()`);
  await sleep(500);
  ck((await evaluate(S, `document.querySelector('.a2-pp').dataset.revealed`)) === 'true',
    'scrolling away and back does not replay the formation');

  // reduced motion: the photograph is simply there
  await setup(S, { width: 1440, height: 1000, scheme: 'light', dpr: 1, mobile: false, reducedMotion: true });
  await goto(S, B + '/', 900);
  const rm = JSON.parse(await evaluate(S, `JSON.stringify((()=>{const f=document.querySelector('.a2-pp');
    return { revealed: f.dataset.revealed, imgOpacity: getComputedStyle(f.querySelector('img')).opacity,
      canvas: getComputedStyle(f.querySelector('canvas')).display,
      anims: document.getAnimations().filter(a=>(a.effect?.getTiming?.().duration||0)>1).length };})())`));
  console.log('   reduced motion:', JSON.stringify(rm));
  ck(rm.imgOpacity === '1', 'reduced motion shows the portrait immediately', rm.imgOpacity);
  ck(rm.canvas === 'none', 'reduced motion renders no canvas', rm.canvas);
  ck(rm.anims === 0, 'reduced motion runs no entrance animations', String(rm.anims));

  // no WebGL: the photograph still arrives
  await setup(S, { width: 1440, height: 1000, scheme: 'light', dpr: 1, mobile: false });
  await S('Page.addScriptToEvaluateOnNewDocument', {
    source: `HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
      apply(t, self, args){ if(String(args[0]).indexOf('webgl')===0) return null; return Reflect.apply(t,self,args); }});`,
  });
  await goto(S, B + '/', 3200);
  await evaluate(S, `(()=>{const e=document.querySelector('.a2-pp');
    window.scrollTo({top:e.getBoundingClientRect().top+window.scrollY-130,behavior:'instant'});})()`);
  await sleep(1600);
  const nogl = JSON.parse(await evaluate(S, `JSON.stringify({
    revealed: document.querySelector('.a2-pp').dataset.revealed,
    op: getComputedStyle(document.querySelector('.a2-pp__img')).opacity })`));
  console.log('   no webgl:', JSON.stringify(nogl));
  ck(nogl.op === '1', 'portrait appears with WebGL unavailable', nogl.op);

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
