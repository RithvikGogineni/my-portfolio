// Real transfer sizes: cache disabled, one cold navigation.
const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  await setup(S, { width: 1440, height: 900, scheme: 'dark', dpr: 2, mobile: false });
  await S('Network.setCacheDisabled', { cacheDisabled: true });
  await goto(S, B + '/', 3200);
  await sleep(800);
  console.log('--- cold load, cache disabled ---');
  console.log(await evaluate(S, `(()=>{const rs=performance.getEntriesByType('resource')
      .map(r=>({n:r.name.replace(location.origin,'').slice(0,58),
        kb:+(((r.transferSize||r.encodedBodySize||0)/1024).toFixed(1)),
        decoded:+(((r.decodedBodySize||0)/1024).toFixed(1))}))
      .filter(r=>r.kb>0 || r.decoded>0).sort((a,b)=>b.kb-a.kb);
    const total=+rs.reduce((s,r)=>s+r.kb,0).toFixed(1);
    const g={}; for(const r of rs){const e=(r.n.split('?')[0].split('.').pop()||'other').toLowerCase().slice(0,6);
      g[e]=+((g[e]||0)+r.kb).toFixed(1);}
    const nav=performance.getEntriesByType('navigation')[0];
    return JSON.stringify({resourceCount:rs.length, totalTransferKB:total, byExtension:g,
      htmlKB: nav? +((nav.transferSize||0)/1024).toFixed(1):null,
      top:rs.slice(0,10)},null,1);})()`));
  // after a full scroll (lazy images)
  await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
    for(let y=0;y<H;y+=400){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,40));}})()`);
  await sleep(1500);
  console.log('\n--- after scrolling the whole page (lazy assets included) ---');
  console.log(await evaluate(S, `(()=>{const rs=performance.getEntriesByType('resource');
    const total=rs.reduce((s,r)=>s+(r.transferSize||r.encodedBodySize||0),0);
    const imgs=rs.filter(r=>/\\.(webp|png|jpg|jpeg|svg|avif)/i.test(r.name));
    const imgKB=imgs.reduce((s,r)=>s+(r.transferSize||r.encodedBodySize||0),0);
    return JSON.stringify({resources:rs.length, totalKB:Math.round(total/1024),
      imageCount:imgs.length, imageKB:Math.round(imgKB/1024),
      biggestImages: imgs.map(r=>({n:r.name.split('/').pop().slice(0,30),
        kb:Math.round((r.transferSize||r.encodedBodySize||0)/1024)})).sort((a,b)=>b.kb-a.kb).slice(0,6)},null,1);})()`));
  await S('Network.setCacheDisabled', { cacheDisabled: false });
  process.exit(0);
})();
