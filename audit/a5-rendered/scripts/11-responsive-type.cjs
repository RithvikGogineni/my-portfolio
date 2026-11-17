// Responsive typography: measured characters-per-line, type sizes, tap targets.
const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const WIDTHS = [320, 390, 480, 600, 768, 900, 1024, 1280, 1440, 1920, 2560];
(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  console.log('=== body copy: measured characters per line ===');
  console.log('   (comfortable range is roughly 45-85; under 35 or over 95 is a problem)\n');
  for (const w of WIDTHS) {
    await setup(S, { width: w, height: 900, scheme: 'light', dpr: 1, mobile: w < 768 });
    await goto(S, B + '/', 2000);
    await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
      for(let y=0;y<H;y+=500){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,20));}})()`);
    await sleep(500);
    console.log(`  @${String(w).padStart(4)}`, await evaluate(S, `(()=>{
      // real CPL: measure a rendered line box against the average glyph advance
      const cpl=(sel)=>{const e=document.querySelector(sel); if(!e) return null;
        const r=document.createRange(); r.selectNodeContents(e);
        const rects=[...r.getClientRects()].filter(x=>x.width>4);
        if(!rects.length) return null;
        const txt=(e.textContent||'').trim(); if(!txt.length) return null;
        const totalW=rects.reduce((s,x)=>s+x.width,0);
        const perChar=totalW/txt.length;
        const widest=Math.max(...rects.map(x=>x.width));
        return {lines:rects.length, cpl:Math.round(widest/perChar),
          fs:+parseFloat(getComputedStyle(e).fontSize).toFixed(1)};};
      return JSON.stringify({
        lede: cpl('.a2-person__lede'),
        para: cpl('.a2-person__para'),
        prose: cpl('#practice .a2-prose'),
        curio: cpl('.a2-curio__fact')});})()`));
  }
  console.log('\n=== tap targets under 44px, mobile widths ===');
  for (const w of [320, 390, 414, 768]) {
    await setup(S, { width: w, height: 844, scheme: 'light', dpr: 2, mobile: true });
    await goto(S, B + '/', 2200);
    await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
      for(let y=0;y<H;y+=400){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}})()`);
    await sleep(600);
    console.log(`  @${w}`, await evaluate(S, `(()=>{const els=[...document.querySelectorAll('a,button')]
        .map(e=>({t:(e.innerText||e.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim().slice(0,22),
          w:Math.round(e.getBoundingClientRect().width), h:Math.round(e.getBoundingClientRect().height)}))
        .filter(e=>e.h>0 && e.w>0);
      const small=els.filter(e=>e.h<44);
      return JSON.stringify({interactive:els.length, under44:small.length, list:small.slice(0,8)});})()`));
  }
  process.exit(0);
})();
