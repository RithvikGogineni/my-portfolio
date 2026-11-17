const { CDP, newPage, setup, goto, evaluate, touchTap, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  await setup(S, { width: 390, height: 844, scheme: 'dark', dpr: 2, mobile: true });
  await goto(S, B + '/', 2600);
  await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
    for(let y=0;y<H;y+=300){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}})()`);
  await evaluate(S, `(()=>{const e=document.querySelector('#index');
    window.scrollTo({top: window.scrollY + e.getBoundingClientRect().top - 70, behavior:'instant'});})()`);
  await sleep(1000);
  const b = JSON.parse(await evaluate(S, `(()=>{const e=document.querySelectorAll('#index button.a2-row')[1];
    const r=e.getBoundingClientRect(); return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)});})()`));
  await touchTap(S, b.x, b.y); await sleep(1100);
  // how far below the fold did the CTA land, before any scrolling?
  console.log('CTA position right after expanding:', await evaluate(S, `(()=>{const a=document.querySelector('#index a');
    const r=a.getBoundingClientRect(); return JSON.stringify({top:Math.round(r.top), viewportH:innerHeight,
      belowFold: r.top>innerHeight, overshoot: Math.round(r.top-innerHeight)});})()`));
  // now scroll it into view and tap it for real
  await evaluate(S, `(()=>{const a=document.querySelector('#index a');
    window.scrollTo({top: window.scrollY + a.getBoundingClientRect().top - 400, behavior:'instant'});})()`);
  await sleep(700);
  const l = JSON.parse(await evaluate(S, `(()=>{const a=document.querySelector('#index a');
    const r=a.getBoundingClientRect(); return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),
      href:a.getAttribute('href')});})()`));
  console.log('tapping CTA at', JSON.stringify(l));
  await touchTap(S, l.x, l.y); await sleep(2000);
  console.log('navigated to:', await evaluate(S, `location.pathname`));
  console.log('case study heading:', await evaluate(S, `(()=>{const h=document.querySelector('h1');
    return h? h.innerText.replace(/\\s+/g,' ').trim().slice(0,50):'none';})()`));
  console.log('scroll position on arrival:', await evaluate(S, `Math.round(window.scrollY)`));
  process.exit(0);
})();
