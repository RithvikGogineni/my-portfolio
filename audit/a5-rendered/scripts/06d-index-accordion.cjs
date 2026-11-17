const { CDP, newPage, setup, goto, shot, evaluate, touchTap, key, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const OUT = __dirname + '/../shots/';
const st = `(()=>{const s=document.querySelector('#index');
  const btns=[...s.querySelectorAll('button.a2-row')];
  return JSON.stringify({expanded:btns.map(b=>b.getAttribute('aria-expanded')),
    links:[...s.querySelectorAll('a')].map(a=>({h:a.getAttribute('href'),
      t:a.innerText.replace(/\\s+/g,' ').trim().slice(0,30),
      vis:a.getBoundingClientRect().height>0})),
    imgs:[...s.querySelectorAll('img')].map(i=>(i.currentSrc||i.src||'').split('/').pop().slice(0,26)),
    secH:Math.round(s.getBoundingClientRect().height)});})()`;
(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  await setup(S, { width: 390, height: 844, scheme: 'dark', dpr: 2, mobile: true });
  await goto(S, B + '/', 2600);
  await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
    for(let y=0;y<H;y+=300){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}})()`);
  await evaluate(S, `(()=>{const e=document.querySelector('#index');
    window.scrollTo({top: window.scrollY + e.getBoundingClientRect().top - 70, behavior:'instant'});})()`);
  await sleep(1200);
  console.log('closed:', await evaluate(S, st));
  const b = JSON.parse(await evaluate(S, `(()=>{const e=document.querySelectorAll('#index button.a2-row')[1];
    const r=e.getBoundingClientRect(); return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),
      w:Math.round(r.width),h:Math.round(r.height),t:e.innerText.replace(/\\s+/g,' ').trim().slice(0,28)});})()`));
  console.log('tapping:', JSON.stringify(b));
  await touchTap(S, b.x, b.y); await sleep(1100);
  console.log('after tap:', await evaluate(S, st));
  await shot(S, OUT + 'index-390-dark-expanded.png');
  // can a touch user actually reach the case study?
  const link = JSON.parse(await evaluate(S, `(()=>{const a=[...document.querySelectorAll('#index a')].find(a=>a.getBoundingClientRect().height>0);
    if(!a) return 'null'; const r=a.getBoundingClientRect();
    return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),
      h:Math.round(r.height), href:a.getAttribute('href'), t:a.innerText.replace(/\\s+/g,' ').trim().slice(0,30)});})()`));
  console.log('reachable link:', JSON.stringify(link));
  if (link && link.x) { await touchTap(S, link.x, link.y); await sleep(1900);
    console.log('navigated to:', await evaluate(S, `location.pathname`)); }
  // keyboard on the same accordion, desktop-narrow
  process.exit(0);
})();
