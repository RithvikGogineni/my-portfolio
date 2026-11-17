const { CDP, newPage, setup, goto, shot, evaluate, touchTap, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const OUT = __dirname + '/../shots/';
(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  await setup(S, { width: 390, height: 844, scheme: 'dark', dpr: 2, mobile: true });
  await goto(S, B + '/', 2600);
  await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
    for(let y=0;y<H;y+=300){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}})()`);
  await evaluate(S, `(()=>{const e=document.querySelector('#index');
    window.scrollTo({top: window.scrollY + e.getBoundingClientRect().top - 70, behavior:'instant'});})()`);
  await sleep(1200);
  console.log('interactive elements inside #index:');
  console.log(await evaluate(S, `(()=>{const s=document.querySelector('#index');
    const els=[...s.querySelectorAll('a,button,summary,[role="button"],[tabindex]')];
    return JSON.stringify(els.map(e=>({tag:e.tagName, cls:e.className.toString().slice(0,44),
      href:e.getAttribute('href')||null, aria:e.getAttribute('aria-expanded'),
      h:Math.round(e.getBoundingClientRect().height),
      t:e.innerText.replace(/\\s+/g,' ').trim().slice(0,40)})), null, 1);})()`));
  console.log('\nraw row markup (first row):');
  console.log(await evaluate(S, `(()=>{const s=document.querySelector('#index');
    const r=s.querySelector('[class*="row"]'); return r? r.outerHTML.slice(0,700):'none';})()`));
  // try tapping the first row area anyway
  const box = JSON.parse(await evaluate(S, `(()=>{const s=document.querySelector('#index');
    const r=[...s.querySelectorAll('*')].find(e=>/row/i.test(e.className||''));
    if(!r) return 'null'; const b=r.getBoundingClientRect();
    return JSON.stringify({x:Math.round(b.x+b.width/2), y:Math.round(b.y+b.height/2), h:Math.round(b.height)});})()`));
  console.log('\nfirst row box:', JSON.stringify(box));
  if (box && box.x) {
    await touchTap(S, box.x, box.y); await sleep(1500);
    console.log('after tap, path:', await evaluate(S, `location.pathname`));
    console.log('after tap, #index interactive count:', await evaluate(S, `document.querySelectorAll('#index a,#index button').length`));
    await shot(S, OUT + 'index-390-after-tap.png');
  }
  process.exit(0);
})();
