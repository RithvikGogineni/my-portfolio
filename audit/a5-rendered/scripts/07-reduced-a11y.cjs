// Reduced motion + accessibility, on the rendered page.
const { CDP, newPage, setup, goto, shot, evaluate, key, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const OUT = __dirname + '/../shots/';
const PAGES = ['/', '/work/ftc-16075', '/work/rehabos'];

(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);

  console.log('=== prefers-reduced-motion: reduce ===');
  for (const [w, mobile] of [[1440, false], [390, true]]) {
    await setup(S, { width: w, height: mobile?844:900, scheme: 'dark', dpr: 2, mobile, reducedMotion: true });
    await goto(S, B + '/', 2600);
    await sleep(600);
    console.log(`  @${w} immediately after load:`, await evaluate(S, `(()=>{
      const hidden=[...document.querySelectorAll('.a2-mask__in, .a2-index__item, [style*="opacity"]')]
        .filter(e=>{const s=getComputedStyle(e); return +s.opacity < 0.9 && e.getBoundingClientRect().height>0;});
      const moved=[...document.querySelectorAll('.a2-mask__in')]
        .filter(e=>getComputedStyle(e).transform!=='none');
      const img=document.querySelector('.a2-person__portrait img');
      const cv=document.querySelector('.a2-pp__canvas');
      return JSON.stringify({stillFaded:hidden.length, stillTransformed:moved.length,
        portraitImgOpacity: img? +(+getComputedStyle(img).opacity).toFixed(2):null,
        particleCanvasUp: cv? cv.dataset.up : null,
        matchesReduce: matchMedia('(prefers-reduced-motion: reduce)').matches});})()`));
    // scroll the whole page: with reduce, content must already be present
    await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
      for(let y=0;y<H;y+=400){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}})()`);
    await sleep(600);
    console.log(`  @${w} after full scroll:`, await evaluate(S, `(()=>{
      const faded=[...document.querySelectorAll('main *')].filter(e=>{
        const s=getComputedStyle(e); const r=e.getBoundingClientRect();
        return r.height>4 && r.width>4 && +s.opacity<0.35;});
      return JSON.stringify({elementsStillUnder35pctOpacity: faded.length,
        sample: faded.slice(0,4).map(e=>e.className.toString().slice(0,34))});})()`));
    await shot(S, `${OUT}reduced-${w}-dark.png`);
  }

  console.log('\n=== accessibility, motion allowed ===');
  await setup(S, { width: 1440, height: 900, scheme: 'light', dpr: 2, mobile: false });
  for (const p of PAGES) {
    await goto(S, B + p, 2400);
    await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
      for(let y=0;y<H;y+=400){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}
      window.scrollTo({top:0,behavior:'instant'});})()`);
    await sleep(700);
    console.log(`  ${p}`, await evaluate(S, `(()=>{
      const imgs=[...document.querySelectorAll('img')];
      const noAlt=imgs.filter(i=>i.getAttribute('alt')===null);
      const btns=[...document.querySelectorAll('button')];
      const unnamed=btns.filter(b=>!(b.innerText||'').trim() && !b.getAttribute('aria-label') && !b.getAttribute('title'));
      const hs=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h=>+h.tagName[1]);
      let skips=[]; for(let i=1;i<hs.length;i++) if(hs[i]-hs[i-1]>1) skips.push(hs[i-1]+'->'+hs[i]);
      const aria=[...document.querySelectorAll('[aria-labelledby],[aria-controls],[aria-describedby]')];
      const broken=aria.filter(e=>['aria-labelledby','aria-controls','aria-describedby'].some(a=>{
        const v=e.getAttribute(a); return v && v.split(/\\s+/).some(id=>id && !document.getElementById(id));}));
      const lm=[...document.querySelectorAll('main,nav,header,footer')].length;
      return JSON.stringify({h1:document.querySelectorAll('h1').length, headingSkips:skips,
        imgsMissingAlt:noAlt.length, unnamedButtons:unnamed.length, brokenAriaRefs:broken.length,
        landmarks:lm, title:document.title.slice(0,46),
        lang:document.documentElement.lang||null,
        skipLink: !!document.querySelector('a[href="#main"], .a2-skip')});})()`));
  }
  // keyboard: can you reach the main content and the first CTA?
  await goto(S, B + '/', 2400);
  const walk = [];
  for (let i = 0; i < 9; i++) {
    await key(S, 'Tab', 'Tab', 9); await sleep(170);
    walk.push(await evaluate(S, `(()=>{const a=document.activeElement; if(!a) return 'none';
      const s=getComputedStyle(a); const r=a.getBoundingClientRect();
      return (a.tagName+'.'+(a.className||'').toString().split(' ')[0]).slice(0,34)
        +' | outline '+s.outlineWidth+' '+s.outlineStyle
        +' | onscreen '+(r.top>=-2 && r.top<innerHeight);})()`));
  }
  console.log('\n  tab order from load:'); walk.forEach((w,i)=>console.log(`   ${i+1}. ${w}`));
  process.exit(0);
})();
