// Particle portrait: formation frames, WebGL liveness, idle cost.
const { CDP, newPage, setup, goto, shot, evaluate, hover, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const OUT = __dirname + '/../shots/';

// Count rAF callbacks over a window, by patching rAF before the app mounts.
const INSTRUMENT = `(()=>{window.__raf=0;const o=window.requestAnimationFrame;
  window.requestAnimationFrame=function(cb){window.__raf++;return o.call(window,cb);};return 1;})()`;

(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  for (const [w, scheme, mobile] of [[1440,'dark',false],[390,'light',true]]) {
    console.log(`\n=== portrait formation @${w} ${scheme} ===`);
    await setup(S, { width: w, height: mobile?844:900, scheme, dpr: 2, mobile });
    await S('Page.addScriptToEvaluateOnNewDocument', { source: INSTRUMENT });
    await goto(S, B + '/', 2400);
    // park above the person section so the observer has not fired
    await evaluate(S, `(()=>{const e=document.querySelector('#person');
      window.scrollTo({top: Math.max(0, window.scrollY + e.getBoundingClientRect().top - window.innerHeight*1.4), behavior:'instant'});})()`);
    await sleep(900);
    console.log('  before entry:', await evaluate(S, `(()=>{const c=document.querySelector('.a2-pp__canvas');
      const img=document.querySelector('.a2-pp__img')||document.querySelector('.a2-person__portrait img');
      return JSON.stringify({up:c&&c.dataset.up, canvasOpacity:c?getComputedStyle(c).opacity:null,
        imgOpacity:img?getComputedStyle(img).opacity:null});})()`));
    // bring it in
    await evaluate(S, `(()=>{const e=document.querySelector('.a2-person__portrait');
      window.scrollTo({top: window.scrollY + e.getBoundingClientRect().top - 90, behavior:'instant'});})()`);
    const t0 = Date.now();
    for (const at of [60, 200, 400, 700, 1100, 1600, 2400, 3200]) {
      while (Date.now() - t0 < at) await sleep(10);
      const st = await evaluate(S, `(()=>{const c=document.querySelector('.a2-pp__canvas');
        const img=document.querySelector('.a2-person__portrait img');
        return JSON.stringify({up:c&&c.dataset.up, cOp:c?getComputedStyle(c).opacity:null,
          iOp:img?+(+getComputedStyle(img).opacity).toFixed(3):null, raf:window.__raf});})()`);
      console.log(`  t+${at}ms`, st);
      await shot(S, `${OUT}frame-portrait-${w}-${scheme}-t${at}.png`);
    }
    // idle cost: rAF count over 2s with no interaction
    const a = await evaluate(S, `window.__raf`); await sleep(2000);
    const b = await evaluate(S, `window.__raf`);
    console.log(`  idle rAF over 2s: ${b - a}  (0 = animation parked)`);
    // hover response (desktop only)
    if (!mobile) {
      const box = JSON.parse(await evaluate(S, `(()=>{const r=document.querySelector('.a2-person__portrait').getBoundingClientRect();
        return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)});})()`));
      const c = await evaluate(S, `window.__raf`);
      await hover(S, box.x, box.y); await sleep(500);
      await hover(S, box.x+30, box.y+20); await sleep(900);
      const d = await evaluate(S, `window.__raf`);
      console.log(`  rAF during 1.4s hover: ${d - c}  (>0 = portrait responds to pointer)`);
      await shot(S, `${OUT}frame-portrait-${w}-${scheme}-hover.png`);
      await sleep(1500);
      const e2 = await evaluate(S, `window.__raf`); await sleep(1500);
      const f = await evaluate(S, `window.__raf`);
      console.log(`  rAF 1.5s after pointer left region: ${f - e2}  (0 = settles back to parked)`);
    }
    const webgl = await evaluate(S, `(()=>{const c=document.querySelector('.a2-pp__canvas');
      if(!c) return 'no canvas'; return JSON.stringify({w:c.width,h:c.height,
        ctx: !!(c.getContext('webgl')||c.getContext('experimental-webgl'))});})()`);
    console.log('  canvas:', webgl);
  }
  process.exit(0);
})();
