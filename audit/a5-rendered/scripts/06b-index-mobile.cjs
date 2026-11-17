const { CDP, newPage, setup, goto, shot, evaluate, touchTap, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const OUT = __dirname + '/../shots/';
(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  for (const [w, mobile] of [[390, true], [768, true], [1024, false], [1440, false]]) {
    await setup(S, { width: w, height: mobile?844:900, scheme: 'light', dpr: 2, mobile });
    await goto(S, B + '/', 2600);
    // full scroll so every observer has fired
    await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
      for(let y=0;y<H;y+=300){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}})()`);
    await sleep(900);
    const r = await evaluate(S, `(()=>{const s=document.querySelector('#index');
      if(!s) return JSON.stringify({err:'no #index'});
      const rect=s.getBoundingClientRect();
      const anchors=[...s.querySelectorAll('a')];
      return JSON.stringify({w:innerWidth, secH:Math.round(rect.height),
        anchors:anchors.length,
        hrefs:anchors.map(a=>a.getAttribute('href')),
        rowH:anchors.map(a=>Math.round(a.getBoundingClientRect().height)),
        previewEl: !!s.querySelector('.a2-index__preview'),
        previewDisplay: (()=>{const p=s.querySelector('.a2-index__preview'); return p?getComputedStyle(p).display:null;})(),
        imgs:[...s.querySelectorAll('img')].length,
        text: s.innerText.replace(/\\s+/g,' ').trim().slice(0,110)});})()`);
    console.log(r);
  }
  // mobile tap-through
  await setup(S, { width: 390, height: 844, scheme: 'dark', dpr: 2, mobile: true });
  await goto(S, B + '/', 2600);
  await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
    for(let y=0;y<H;y+=300){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}})()`);
  await evaluate(S, `(()=>{const e=document.querySelector('#index');
    window.scrollTo({top: window.scrollY + e.getBoundingClientRect().top - 70, behavior:'instant'});})()`);
  await sleep(1200);
  await shot(S, OUT + 'index-390-dark.png');
  const a = JSON.parse(await evaluate(S, `(()=>{const el=document.querySelectorAll('#index a')[1];
    if(!el) return 'null'; const r=el.getBoundingClientRect();
    return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),h:Math.round(r.height),
      t:el.innerText.replace(/\\s+/g,' ').trim().slice(0,30)});})()`));
  console.log('tap target:', JSON.stringify(a));
  if (a && a.x) { await touchTap(S, a.x, a.y); await sleep(1800);
    console.log('after tap ->', await evaluate(S, `location.pathname`)); }
  process.exit(0);
})();
