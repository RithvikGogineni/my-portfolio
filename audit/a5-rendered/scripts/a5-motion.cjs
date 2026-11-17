// A.5 — motion, interaction and performance checks. Everything the brief's
// §12 and §13 ask for, measured.
const { CDP, newPage, setup, goto, evaluate, hover, click, key, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const fail = [];
const ck = (ok, l, d) => { if (!ok) fail.push(l + (d ? ' — ' + d : '')); console.log((ok ? '  ok  ' : 'FAIL  ') + l + (d ? '  [' + d + ']' : '')); };

(async () => {
  const cdp = await CDP.connect();
  const { S } = await newPage(cdp);
  const logs = [];
  cdp.on('Runtime.exceptionThrown', p => logs.push('EXC ' + (p.exceptionDetails.exception?.description || '').slice(0, 150)));
  cdp.on('Runtime.consoleAPICalled', p => { if (p.type !== 'log') logs.push(p.type); });

  // ===== scroll choreography actually happens =============================
  console.log('\n===== scroll choreography =====');
  await setup(S, { width: 1440, height: 1000, scheme: 'light', dpr: 1, mobile: false });
  await goto(S, B + '/', 4000);
  const hiddenBefore = JSON.parse(await evaluate(S, `JSON.stringify({
    other: getComputedStyle(document.querySelector('.a2-other__item')).opacity,
    kit: getComputedStyle(document.querySelector('.a2-kit__group')).opacity,
    contact: getComputedStyle(document.querySelector('.a2-contact')).clipPath,
    idx: getComputedStyle(document.querySelector('.a2-index__item')).opacity })`));
  console.log('   below the fold, before scrolling:', JSON.stringify(hiddenBefore));
  ck(+hiddenBefore.other === 0, 'Other work waits for arrival', hiddenBefore.other);
  ck(+hiddenBefore.kit === 0, 'Practice waits for arrival', hiddenBefore.kit);
  ck(/100%/.test(hiddenBefore.contact), 'the contact band waits for arrival', hiddenBefore.contact);
  ck(+hiddenBefore.idx === 0, 'index rows wait for arrival', hiddenBefore.idx);

  // ...and resolves once reached
  // Step down the page rather than jumping: an instant jump to the bottom
  // renders no intermediate frames, so the sections passed over never
  // intersect and never reveal. That is correct behaviour (nothing visible
  // is hidden) but it is not what this check is asking about.
  await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
    for(let y=0;y<H;y+=400){window.scrollTo({top:y,behavior:'instant'});
      await new Promise(r=>setTimeout(r,60));}})()`);
  await sleep(2200);
  const after = JSON.parse(await evaluate(S, `JSON.stringify({
    other: getComputedStyle(document.querySelector('.a2-other__item')).opacity,
    kit: getComputedStyle(document.querySelector('.a2-kit__group')).opacity,
    contact: getComputedStyle(document.querySelector('.a2-contact')).clipPath,
    idx: getComputedStyle(document.querySelector('.a2-index__item')).opacity })`));
  ck(+after.other === 1 && +after.kit === 1 && +after.idx === 1 && after.contact === 'inset(0px)',
    'everything resolves once reached', JSON.stringify(after));

  // ===== intensity actually varies ========================================
  console.log('\n===== motion intensity varies by section =====');
  await goto(S, B + '/', 4000);
  const rises = await evaluate(S, `JSON.stringify((()=>{
    const grab=(sel)=>{const e=document.querySelector(sel); if(!e) return null;
      const m=(e.getAttribute('style')||'').match(/translateY?\\(?([-\\d.]+)px/); return m?Math.abs(+m[1]):null;};
    return { feature: grab('.a2-curio__row'), quiet: grab('.a2-other__item'), support: grab('.a2-index__item') };})())`);
  console.log('   initial rise distances (px):', rises);
  const r = JSON.parse(rises);
  ck(r.quiet !== null && r.feature !== null && r.quiet < r.feature,
    'quiet sections travel less than feature sections', `quiet ${r.quiet} < feature ${r.feature}`);

  // ===== index preview responsiveness =====================================
  console.log('\n===== index preview =====');
  await goto(S, B + '/', 3600);
  await evaluate(S, `(()=>{const e=document.getElementById('index');
    window.scrollTo({top:e.getBoundingClientRect().top+scrollY-80,behavior:'instant'});})()`);
  await sleep(1600);
  const boxes = JSON.parse(await evaluate(S, `JSON.stringify([...document.querySelectorAll('.a2-row')].map(x=>{
    const b=x.getBoundingClientRect(); return {x:b.x+b.width*0.3,y:b.y+b.height/2};}))`));
  // run the pointer down the list quickly; count how many frames are live at once
  await evaluate(S, `window.__peak=0; window.__t=setInterval(()=>{
    const n=document.querySelectorAll('.a2-prev__frame').length; if(n>window.__peak) window.__peak=n; },16); 1`);
  for (const b of boxes) { await hover(S, b.x, b.y); await sleep(70); }
  await sleep(500);
  const peak = await evaluate(S, `clearInterval(window.__t), window.__peak`);
  const settled = await evaluate(S, `document.querySelectorAll('.a2-prev__frame').length`);
  console.log('   peak simultaneous preview frames:', peak, '| settled:', settled);
  ck(peak >= 2, 'previews crossfade rather than queue', 'peak ' + peak);
  ck(settled === 1, 'only one preview frame survives the swap', String(settled));
  const label = await evaluate(S, `document.querySelector('.a2-index__preview .a2-label')?.textContent.trim()`);
  ck(/05/.test(label || ''), 'the preview matches the last row hovered', label);

  // ===== press feedback ====================================================
  console.log('\n===== mechanical press =====');
  const btn = JSON.parse(await evaluate(S, `JSON.stringify((()=>{const e=document.querySelector('.a2-btn');
    e.scrollIntoView({block:'center',behavior:'instant'}); const b=e.getBoundingClientRect();
    return {x:b.x+b.width/2,y:b.y+b.height/2};})())`));
  await sleep(400);
  await S('Input.dispatchMouseEvent', { type: 'mousePressed', x: btn.x, y: btn.y, button: 'left', clickCount: 1, buttons: 1 });
  await sleep(90);
  const pressed = await evaluate(S, `getComputedStyle(document.querySelector('.a2-btn .a2-btn__in')).transform`);
  await S('Input.dispatchMouseEvent', { type: 'mouseReleased', x: btn.x, y: btn.y, button: 'left', clickCount: 1, buttons: 0 });
  await sleep(400);
  const released = await evaluate(S, `getComputedStyle(document.querySelector('.a2-btn .a2-btn__in')).transform`);
  console.log('   pressed:', pressed, '| released:', released);
  ck(pressed !== released && pressed !== 'none', 'buttons compress on press', pressed);

  // ===== reduced motion: everything present, nothing moving ===============
  console.log('\n===== reduced motion =====');
  await setup(S, { width: 1440, height: 1000, scheme: 'light', dpr: 1, mobile: false, reducedMotion: true });
  await goto(S, B + '/', 1500);
  const rm = JSON.parse(await evaluate(S, `JSON.stringify({
    other: getComputedStyle(document.querySelector('.a2-other__item')).opacity,
    kit: getComputedStyle(document.querySelector('.a2-kit__group')).opacity,
    contact: getComputedStyle(document.querySelector('.a2-contact')).clipPath,
    idx: getComputedStyle(document.querySelector('.a2-index__item')).opacity,
    // A.5.3 — the portrait is withheld, so there is no photograph and no
    // canvas to check. What has to be true instead is that the well is
    // still there, at full opacity, saying what is missing — a collapsed
    // or invisible placeholder would be the failure this guards against.
    pp: getComputedStyle(document.querySelector('.a2-pp--empty')).opacity,
    ppSays: (document.querySelector('.a2-pp--empty')||{}).innerText ? 1 : 0,
    ppNoLikeness: document.querySelector('.a2-pp__img, .a2-pp__canvas') ? 0 : 1,
    anims: document.getAnimations().filter(a=>(a.effect?.getTiming?.().duration||0)>1).length })`));
  console.log('  ', JSON.stringify(rm));
  ck(+rm.other === 1 && +rm.kit === 1 && +rm.idx === 1 && +rm.pp === 1,
    'reduced motion shows everything immediately', JSON.stringify(rm));
  ck(rm.ppSays === 1 && rm.ppNoLikeness === 1,
    'the withheld portrait shows a labelled well and no likeness', JSON.stringify({says:rm.ppSays, noLikeness:rm.ppNoLikeness}));
  ck(rm.contact === 'inset(0px)' || rm.contact === 'none', 'reduced motion does not clip the contact band', rm.contact);
  ck(rm.anims === 0, 'reduced motion runs no timed animations', String(rm.anims));

  // ===== performance =======================================================
  console.log('\n===== performance =====');
  await setup(S, { width: 1440, height: 1000, scheme: 'light', dpr: 1, mobile: false });
  await goto(S, B + '/', 3200);
  const scrollCost = await evaluate(S, `(async()=>{
    let long=0,total=0; const o=new PerformanceObserver(l=>{for(const e of l.getEntries()){long++;total+=e.duration;}});
    try{o.observe({entryTypes:['longtask']});}catch(e){}
    const H=document.body.scrollHeight;
    for(let y=0;y<H;y+=240){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>requestAnimationFrame(r));}
    await new Promise(r=>setTimeout(r,400)); o.disconnect();
    return JSON.stringify({longTasks:long,totalMs:Math.round(total)});})()`);
  console.log('   full-page scroll:', scrollCost);
  const sc = JSON.parse(scrollCost);
  ck(sc.longTasks <= 2, 'scrolling the page stays off the long-task threshold', JSON.stringify(sc));

  const idle = await evaluate(S, `(async()=>{
    let long=0; const o=new PerformanceObserver(l=>{long+=l.getEntries().length});
    try{o.observe({entryTypes:['longtask']});}catch(e){}
    await new Promise(r=>setTimeout(r,1500)); o.disconnect(); return long;})()`);
  ck(idle === 0, 'nothing runs while the page sits idle', String(idle));

  // A.5.3 — was "the particle sim must be the cheaper one on mobile". The
  // portrait is withheld, so what is checked now is that the well survives
  // the narrow layout: square, visible, labelled, and carrying no likeness.
  await setup(S, { width: 390, height: 844, scheme: 'light', dpr: 1, mobile: true });
  await goto(S, B + '/', 2600);
  await evaluate(S, `(()=>{const e=document.querySelector('.a2-pp--empty');
    if(e) window.scrollTo({top:e.getBoundingClientRect().top+scrollY-80,behavior:'instant'});})()`);
  await sleep(900);
  const m = JSON.parse(await evaluate(S, `JSON.stringify((()=>{const f=document.querySelector('.a2-pp--empty');
    if(!f) return {missing:true};
    const r=f.getBoundingClientRect();
    return { w:Math.round(r.width), square: Math.abs(r.width-r.height) < 2,
      says: /awaiting/i.test(f.innerText),
      likeness: !!document.querySelector('.a2-pp__img, .a2-pp__canvas') };})())`));
  console.log('   mobile portrait well:', JSON.stringify(m));
  ck(!m.missing && m.square && m.says && !m.likeness,
    'the withheld well holds its square on mobile and shows no likeness', JSON.stringify(m));

  // ===== a dead observer must still reveal everything =====================
  console.log('\n===== dead IntersectionObserver =====');
  await setup(S, { width: 1440, height: 1000, scheme: 'light', dpr: 1, mobile: false });
  await S('Page.addScriptToEvaluateOnNewDocument', {
    source: 'window.IntersectionObserver = class { constructor(){} observe(){} unobserve(){} disconnect(){} takeRecords(){return [];} };',
  });
  await goto(S, B + '/', 3200);
  const dead = JSON.parse(await evaluate(S, `JSON.stringify({
    other: getComputedStyle(document.querySelector('.a2-other__item')).opacity,
    contact: getComputedStyle(document.querySelector('.a2-contact')).clipPath,
    pp: getComputedStyle(document.querySelector('.a2-pp--empty')).opacity })`));
  console.log('  ', JSON.stringify(dead));
  ck(+dead.other === 1 && dead.contact === 'inset(0px)' && +dead.pp === 1,
    'the failsafe still reveals everything when the observer is dead', JSON.stringify(dead));

  console.log('\nconsole:', logs.length ? logs : 'clean');
  ck(logs.length === 0, 'console clean', logs.join('|'));
  console.log('\n================= RESULT =================');
  console.log(fail.length ? 'FAILURES:\n - ' + fail.join('\n - ') : 'All A.5 motion checks passed.');
  process.exit(0);
})();
