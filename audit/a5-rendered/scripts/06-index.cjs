// Project index: hover, keyboard focus, and touch — with trusted input only.
const { CDP, newPage, setup, goto, shot, evaluate, hover, click, key, touchTap, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const OUT = __dirname + '/../shots/';

const snap = `(()=>{
  const rows=[...document.querySelectorAll('.a2-index__row, .a2-idx__row, [class*="index__row"]')];
  const prev=document.querySelector('[class*="preview"], .a2-idx__preview, .a2-index__preview');
  const imgs=[...document.querySelectorAll('#index img')].map(i=>({
    src:(i.currentSrc||i.src||'').split('/').pop().slice(0,28),
    op:+(+getComputedStyle(i).opacity).toFixed(2)}));
  return JSON.stringify({rows:rows.length,
    rowClasses: rows.slice(0,2).map(r=>r.className.slice(0,60)),
    hot: rows.map(r=>r.className.includes('is-on')||r.matches(':hover')).filter(Boolean).length,
    preview: prev? {cls:prev.className.slice(0,50), op:+(+getComputedStyle(prev).opacity).toFixed(2)}:null,
    imgs: imgs.slice(0,8),
    active: document.activeElement? (document.activeElement.className||document.activeElement.tagName).toString().slice(0,50):null,
    focusVisible: (()=>{const a=document.activeElement; if(!a||a===document.body) return null;
      try{ const s=getComputedStyle(a); return {outline:s.outlineWidth+' '+s.outlineStyle, shadow:s.boxShadow.slice(0,40)};}catch(e){return 'err';}})()
  });})()`;

(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  console.log('=== index @1440 light ===');
  await setup(S, { width: 1440, height: 900, scheme: 'light', dpr: 2, mobile: false });
  await goto(S, B + '/', 2400);
  await evaluate(S, `(()=>{const e=document.querySelector('#index');
    window.scrollTo({top: window.scrollY + e.getBoundingClientRect().top - 70, behavior:'instant'});})()`);
  await sleep(1400);
  console.log('  structure:', await evaluate(S, `(()=>{const s=document.querySelector('#index');
    const kids=[...s.querySelectorAll('a')].map(a=>({cls:a.className.slice(0,40),
      href:a.getAttribute('href'), t:a.innerText.replace(/\\s+/g,' ').trim().slice(0,34)}));
    return JSON.stringify({links:kids.length, sample:kids.slice(0,8)});})()`));
  console.log('  rest:', await evaluate(S, snap));

  const rows = JSON.parse(await evaluate(S, `JSON.stringify([...document.querySelectorAll('#index a')].map(a=>{
    const r=a.getBoundingClientRect(); return {x:Math.round(r.x+Math.min(200,r.width/2)), y:Math.round(r.y+r.height/2),
      h:Math.round(r.height), t:a.innerText.replace(/\\s+/g,' ').trim().slice(0,26)};}))`));
  console.log('  row heights:', JSON.stringify(rows.map(r=>r.h)));

  for (const i of [0, 2]) {
    if (!rows[i]) continue;
    await hover(S, rows[i].x, rows[i].y); await sleep(700);
    console.log(`  hover "${rows[i].t}":`, await evaluate(S, snap));
    await shot(S, `${OUT}index-1440-light-hover${i}.png`);
  }
  await hover(S, 10, 10); await sleep(700);
  console.log('  pointer away:', await evaluate(S, snap));

  // keyboard focus walk
  console.log('\n  --- keyboard ---');
  await evaluate(S, `document.querySelector('#index a').focus()`);
  await sleep(500);
  console.log('  focus row 1:', await evaluate(S, snap));
  await shot(S, OUT + 'index-1440-light-focus.png');
  for (let i = 0; i < 2; i++) {
    await key(S, 'Tab', 'Tab', 9); await sleep(450);
    const st = JSON.parse(await evaluate(S, snap));
    console.log(`  Tab ${i+1}: focus=${st.active} outline=${JSON.stringify(st.focusVisible)}`);
  }

  // ---------- mobile touch ----------
  console.log('\n=== index @390 dark (touch) ===');
  await setup(S, { width: 390, height: 844, scheme: 'dark', dpr: 2, mobile: true });
  await goto(S, B + '/', 2600);
  await evaluate(S, `(()=>{const e=document.querySelector('#index');
    window.scrollTo({top: window.scrollY + e.getBoundingClientRect().top - 70, behavior:'instant'});})()`);
  await sleep(1400);
  const mrows = JSON.parse(await evaluate(S, `JSON.stringify([...document.querySelectorAll('#index a')].map(a=>{
    const r=a.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2),
      h:Math.round(r.height), t:a.innerText.replace(/\\s+/g,' ').trim().slice(0,26)};}))`));
  console.log('  touch row heights:', JSON.stringify(mrows.map(r=>r.h)));
  console.log('  rest:', await evaluate(S, snap));
  // does a hover-only preview strand touch users? tap and see where we land
  if (mrows[1]) {
    await touchTap(S, mrows[1].x, mrows[1].y); await sleep(1600);
    console.log('  after tap, url:', await evaluate(S, `location.pathname`));
  }
  await shot(S, OUT + 'index-390-dark.png');
  process.exit(0);
})();
