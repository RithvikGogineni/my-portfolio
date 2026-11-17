// Hero: kinetic typography, composition, and the entrance as real frames.
const { CDP, newPage, setup, goto, shot, evaluate, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const OUT = __dirname + '/../shots/';
const WIDTHS = [320,360,390,414,480,600,768,820,900,1024,1180,1280,1440,1600,1728,1920,2200,2560];

const probe = `(()=>{
  const name=document.querySelector('.a2-hero__name');
  const masks=[...name.querySelectorAll('.a2-mask')].map(m=>{
    const inn=m.querySelector('.a2-mask__in');
    const r=document.createRange(); r.selectNodeContents(inn);
    const tw=r.getBoundingClientRect().width;
    return {t:(inn.textContent||'').trim().slice(0,24),
      fs:+parseFloat(getComputedStyle(inn).fontSize).toFixed(1),
      box:Math.round(m.clientWidth), text:Math.round(tw),
      fill:+(100*tw/m.clientWidth).toFixed(1),
      over:Math.round(inn.scrollWidth-m.clientWidth)};
  });
  const plate=document.querySelector('.a2-hero__plate').getBoundingClientRect();
  const grid=getComputedStyle(document.querySelector('.a2-hero__grid'));
  const sheet=document.querySelector('.a2-hero').getBoundingClientRect();
  const stop=document.querySelector('.a2-hero__name .a2-stop');
  const docOver=document.documentElement.scrollWidth-document.documentElement.clientWidth;
  return JSON.stringify({w:innerWidth, masks,
    cols:grid.gridTemplateColumns,
    plate:{w:Math.round(plate.width)},
    heroH:Math.round(sheet.height), vh:innerHeight,
    heroVH:+(100*sheet.height/innerHeight).toFixed(0),
    stop: stop? {d:getComputedStyle(stop).display, w:Math.round(stop.getBoundingClientRect().width)} : null,
    docOver});
})()`;

(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  console.log('=== hero type across widths (1440-class dpr1) ===');
  for (const w of WIDTHS) {
    await setup(S, { width: w, height: 900, scheme: 'light', dpr: 1, mobile: w < 768 });
    await goto(S, B + '/', 1800);
    console.log(await evaluate(S, probe));
  }
  // --- entrance frames, 1440 dark + 390 light ---
  for (const [w, scheme, mobile] of [[1440,'dark',false],[390,'light',true]]) {
    console.log(`\n=== hero entrance frames @${w} ${scheme} ===`);
    await setup(S, { width: w, height: mobile?844:900, scheme, dpr: 2, mobile });
    await S('Page.navigate', { url: B + '/' });
    const t0 = Date.now();
    for (const at of [80, 180, 300, 450, 650, 900, 1400]) {
      while (Date.now() - t0 < at) await sleep(10);
      const st = await evaluate(S, `(()=>{const n=document.querySelector('.a2-hero__name');
        if(!n) return 'no-hero';
        const inn=[...n.querySelectorAll('.a2-mask__in')].map(e=>{
          const tr=getComputedStyle(e).transform; const op=getComputedStyle(e).opacity;
          return {tr:tr==='none'?'none':tr.split(',').slice(-1)[0].replace(')','').trim(), op};});
        return JSON.stringify(inn);})()`).catch(e=>'ERR '+e.message);
      console.log(`  t+${at}ms`, st);
      await shot(S, `${OUT}frame-hero-${w}-${scheme}-t${at}.png`);
    }
  }
  process.exit(0);
})();
