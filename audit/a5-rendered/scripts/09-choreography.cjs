// Does A.5's tier system actually produce different motion on screen?
// For each section we park above it, bring it in, and sample the real
// transform of its first animated child at fixed offsets.
const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';

const TARGETS = [
  ['hero name (signature)',   '.a2-hero__name .a2-mask__in'],
  ['person head (signature)', '.a2-person__head .a2-mask__in'],
  ['curio row (feature)',     '.a2-curio__row'],
  ['flagship well (feature)', '.a2-inspect__well'],
  ['index row (support)',     '.a2-index__item'],
  ['other work (quiet)',      '#other li, #other .a2-other__row'],
  ['practice (quiet)',        '#practice .a2-prose'],
];

const ty = (sel) => `(()=>{const e=document.querySelector(${JSON.stringify(sel)});
  if(!e) return null; const s=getComputedStyle(e); const t=s.transform;
  let dy=0; if(t&&t!=='none'){const m=t.match(/matrix\\(([^)]+)\\)/); if(m) dy=parseFloat(m[1].split(',')[5]);
    const m3=t.match(/matrix3d\\(([^)]+)\\)/); if(m3) dy=parseFloat(m3[1].split(',')[13]);}
  return JSON.stringify({dy:+dy.toFixed(1), op:+(+s.opacity).toFixed(3), clip:s.clipPath&&s.clipPath!=='none'?s.clipPath.slice(0,22):null});})()`;

(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  await setup(S, { width: 1440, height: 900, scheme: 'dark', dpr: 1, mobile: false });
  console.log('=== per-section entrance, sampled on the real page @1440 ===');
  console.log('   dy = pixels still to travel, op = opacity. Peak dy ≈ the tier rise.\n');
  for (const [label, sel] of TARGETS) {
    await goto(S, B + '/', 2400);
    const ok = await evaluate(S, `!!document.querySelector(${JSON.stringify(sel)})`);
    if (!ok) { console.log(`  ${label.padEnd(26)} SELECTOR NOT FOUND (${sel})`); continue; }
    // park well above
    await evaluate(S, `(()=>{const e=document.querySelector(${JSON.stringify(sel)});
      const y=window.scrollY+e.getBoundingClientRect().top-window.innerHeight*1.6;
      window.scrollTo({top:Math.max(0,y),behavior:'instant'});})()`);
    await sleep(800);
    // bring it just inside the viewport
    await evaluate(S, `(()=>{const e=document.querySelector(${JSON.stringify(sel)});
      window.scrollTo({top: window.scrollY+e.getBoundingClientRect().top-window.innerHeight*0.75, behavior:'instant'});})()`);
    const t0 = Date.now(); const samples = [];
    for (const at of [40, 120, 240, 400, 600, 850]) {
      while (Date.now() - t0 < at) await sleep(8);
      samples.push(`t${at}:` + (await evaluate(S, ty(sel)) || 'null'));
    }
    console.log(`  ${label.padEnd(26)}`);
    samples.forEach(s => console.log(`      ${s}`));
  }
  // vertical rhythm between sheets
  console.log('\n=== vertical rhythm: gap between consecutive sections ===');
  for (const w of [390, 768, 1440]) {
    await setup(S, { width: w, height: w<768?844:900, scheme: 'light', dpr: 1, mobile: w<768 });
    await goto(S, B + '/', 2400);
    await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
      for(let y=0;y<H;y+=400){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}})()`);
    await sleep(600);
    console.log(`  @${w}`, await evaluate(S, `(()=>{const ss=[...document.querySelectorAll('main > section')];
      const rows=ss.map(s=>({id:s.id||s.className.split(' ').slice(-1)[0],
        h:Math.round(s.getBoundingClientRect().height),
        padTop:Math.round(parseFloat(getComputedStyle(s).paddingTop)),
        padBot:Math.round(parseFloat(getComputedStyle(s).paddingBottom))}));
      return JSON.stringify({count:ss.length, sections:rows, docH:Math.round(document.body.scrollHeight)});})()`));
  }
  process.exit(0);
})();
