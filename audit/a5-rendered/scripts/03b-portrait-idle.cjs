// Correction to 03: measure rAF with the pointer genuinely OUTSIDE the portrait.
const { CDP, newPage, setup, goto, evaluate, hover, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const INSTRUMENT = `(()=>{window.__raf=0;const o=window.requestAnimationFrame;
  window.requestAnimationFrame=function(cb){window.__raf++;return o.call(window,cb);};return 1;})()`;
const count = async (S, label, ms) => {
  const a = await evaluate(S, `window.__raf`); await sleep(ms);
  const b = await evaluate(S, `window.__raf`);
  console.log(`  ${label}: ${b - a} rAF over ${ms}ms`);
  return b - a;
};
(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  await setup(S, { width: 1440, height: 900, scheme: 'dark', dpr: 2, mobile: false });
  await S('Page.addScriptToEvaluateOnNewDocument', { source: INSTRUMENT });
  await goto(S, B + '/', 2400);
  await evaluate(S, `(()=>{const e=document.querySelector('.a2-person__portrait');
    window.scrollTo({top: window.scrollY + e.getBoundingClientRect().top - 90, behavior:'instant'});})()`);
  await sleep(4200); // let formation fully settle
  const box = JSON.parse(await evaluate(S, `(()=>{const r=document.querySelector('.a2-person__portrait').getBoundingClientRect();
    return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),
      left:Math.round(r.x), top:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height)});})()`));
  console.log('  portrait box:', JSON.stringify(box));
  await count(S, 'settled, pointer never on it', 2000);
  await hover(S, box.x, box.y); await sleep(200);
  await count(S, 'pointer HELD on portrait', 1500);
  // genuinely leave: far top-left of the viewport, outside the portrait rect
  await hover(S, 20, 20); await sleep(1200);          // decay window
  await count(S, 'pointer moved AWAY (after 1.2s decay)', 2500);
  await count(S, 'pointer away, second window', 2500);
  // scroll the portrait out of view entirely, then measure
  await evaluate(S, `window.scrollTo({top:0,behavior:'instant'})`); await sleep(1200);
  await count(S, 'portrait scrolled out of view', 2500);
  // scroll back: does it replay?
  await evaluate(S, `(()=>{const e=document.querySelector('.a2-person__portrait');
    window.scrollTo({top: window.scrollY + e.getBoundingClientRect().top - 90, behavior:'instant'});})()`);
  await sleep(600);
  console.log('  on return:', await evaluate(S, `(()=>{const c=document.querySelector('.a2-pp__canvas');
    const img=document.querySelector('.a2-person__portrait img');
    return JSON.stringify({up:c.dataset.up, cOp:getComputedStyle(c).opacity,
      iOp:+(+getComputedStyle(img).opacity).toFixed(3)});})()`));
  await count(S, 'after returning to the portrait', 2500);
  process.exit(0);
})();
