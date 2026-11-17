// Case-study interactions + conformance with the approved A.2 identity.
const { CDP, newPage, setup, goto, evaluate, click, key, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const SLUGS = ['ftc-16075','first-global','rehabos','nexusos','roamly','humanoid'];
(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  await setup(S, { width: 1440, height: 900, scheme: 'light', dpr: 1, mobile: false });

  console.log('=== case studies @1440 ===');
  for (const s of SLUGS) {
    await goto(S, `${B}/work/${s}`, 2200);
    await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
      for(let y=0;y<H;y+=450){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}
      window.scrollTo({top:0,behavior:'instant'});})()`);
    await sleep(600);
    console.log(`  ${s.padEnd(13)}`, await evaluate(S, `(()=>{
      const faded=[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();
        return r.height>4&&r.width>4&&+getComputedStyle(e).opacity<0.35;});
      const prevNext=[...document.querySelectorAll('a')].filter(a=>/next|previous|prev/i.test(a.innerText||''));
      return JSON.stringify({h1:(document.querySelector('h1')||{}).innerText?.slice(0,22),
        docH:Math.round(document.body.scrollHeight),
        imgs:document.querySelectorAll('img').length,
        links:document.querySelectorAll('a').length,
        stillFaded:faded.length,
        prevNext:prevNext.map(a=>a.getAttribute('href')),
        backLink: !!document.querySelector('a[href="/"], a[href$="#index"]'),
        hOrder:[...document.querySelectorAll('h1,h2,h3')].map(h=>h.tagName).join('>')});})()`));
  }
  // in-page navigation from a case study back to the index
  console.log('\n=== navigating between case studies ===');
  await goto(S, `${B}/work/ftc-16075`, 2200);
  const nx = JSON.parse(await evaluate(S, `(()=>{const a=[...document.querySelectorAll('a')]
    .find(a=>/next/i.test(a.innerText||'')); if(!a) return 'null';
    const r=a.getBoundingClientRect(); return JSON.stringify({x:Math.round(r.x+r.width/2),
      y:Math.round(r.y+r.height/2), href:a.getAttribute('href'), t:a.innerText.replace(/\\s+/g,' ').slice(0,26)});})()`));
  console.log('  next link:', JSON.stringify(nx));
  if (nx && nx.x) {
    await evaluate(S, `(()=>{const a=[...document.querySelectorAll('a')].find(a=>/next/i.test(a.innerText||''));
      window.scrollTo({top: window.scrollY+a.getBoundingClientRect().top-400, behavior:'instant'});})()`);
    await sleep(500);
    const p = JSON.parse(await evaluate(S, `(()=>{const a=[...document.querySelectorAll('a')].find(a=>/next/i.test(a.innerText||''));
      const r=a.getBoundingClientRect(); return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)});})()`));
    await click(S, p.x, p.y); await sleep(1800);
    console.log('  after click ->', await evaluate(S, `location.pathname + ' | scrollY=' + Math.round(window.scrollY)`));
  }

  console.log('\n=== A.2 identity conformance ===');
  await goto(S, B + '/', 2400);
  await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
    for(let y=0;y<H;y+=450){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}})()`);
  await sleep(600);
  console.log(await evaluate(S, `(()=>{
    const cs=getComputedStyle(document.documentElement);
    const tok=['--ink','--paper','--coral','--accent','--rule','--type-hero','--type-section']
      .map(t=>[t, cs.getPropertyValue(t).trim()]).filter(([,v])=>v);
    // every distinct colour actually painted on text
    const used={}; let n=0;
    for (const e of document.querySelectorAll('main *')) {
      const r=e.getBoundingClientRect(); if(r.height<2) continue;
      const c=getComputedStyle(e).color; used[c]=(used[c]||0)+1; n++;
    }
    const fams={}; for (const e of document.querySelectorAll('main *')) {
      const f=getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g,''); fams[f]=(fams[f]||0)+1;}
    return JSON.stringify({tokens:Object.fromEntries(tok),
      distinctTextColours:Object.keys(used).length,
      topColours:Object.entries(used).sort((a,b)=>b[1]-a[1]).slice(0,6),
      fontFamilies:fams, elementsChecked:n},null,1);})()`));
  process.exit(0);
})();
