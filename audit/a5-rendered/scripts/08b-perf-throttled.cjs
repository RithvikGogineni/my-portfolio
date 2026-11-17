// Payload breakdown + a 4x-CPU-throttled mobile pass, closer to a real phone.
const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const OBS = `(()=>{window.__cls=0;window.__lt=[];window.__lcp=0;
  try{new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) window.__cls+=e.value;})
    .observe({type:'layout-shift',buffered:true});}catch(e){}
  try{new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__lt.push(Math.round(e.duration));})
    .observe({type:'longtask',buffered:true});}catch(e){}
  try{new PerformanceObserver(l=>{const es=l.getEntries();window.__lcp=Math.round(es[es.length-1].startTime);})
    .observe({type:'largest-contentful-paint',buffered:true});}catch(e){}
  return 1;})()`;
const PACE = `(async()=>{
  const d=[];let last=performance.now();let run=true;
  const tick=(t)=>{d.push(t-last);last=t;if(run)requestAnimationFrame(tick);};requestAnimationFrame(tick);
  const H=document.body.scrollHeight-innerHeight;
  for(let i=0;i<=90;i++){window.scrollTo({top:Math.round(H*i/90),behavior:'instant'});
    await new Promise(r=>requestAnimationFrame(()=>r()));}
  run=false;await new Promise(r=>setTimeout(r,60));
  const s=d.slice(3).filter(x=>x>0).sort((a,b)=>a-b);
  const q=p=>+s[Math.min(s.length-1,Math.floor(s.length*p))].toFixed(1);
  return JSON.stringify({frames:s.length,median:q(0.5),p90:q(0.9),p99:q(0.99),worst:+s[s.length-1].toFixed(1),
    over32:s.filter(x=>x>32).length, pctOver32:+(100*s.filter(x=>x>32).length/s.length).toFixed(1)});})()`;

(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  console.log('=== payload (per resource) ===');
  await setup(S, { width: 1440, height: 900, scheme: 'dark', dpr: 2, mobile: false });
  await goto(S, B + '/', 2800);
  console.log(await evaluate(S, `(()=>{const rs=performance.getEntriesByType('resource')
      .map(r=>({n:r.name.replace(location.origin,''), kb:+(((r.transferSize||r.encodedBodySize||0)/1024).toFixed(1)), t:r.initiatorType}))
      .sort((a,b)=>b.kb-a.kb);
    const total=rs.reduce((s,r)=>s+r.kb,0);
    const group={}; for(const r of rs){const ext=(r.n.split('?')[0].split('.').pop()||'other').toLowerCase();
      group[ext]=+((group[ext]||0)+r.kb).toFixed(1);}
    return JSON.stringify({totalKB:+total.toFixed(1), byExtension:group, top:rs.slice(0,8)},null,1);})()`));

  for (const rate of [1, 4, 6]) {
    console.log(`\n=== mobile 390, CPU throttled ${rate}x ===`);
    await setup(S, { width: 390, height: 844, scheme: 'dark', dpr: 2, mobile: true });
    await S('Emulation.setCPUThrottlingRate', { rate });
    await S('Page.addScriptToEvaluateOnNewDocument', { source: OBS });
    await goto(S, B + '/', 3400);
    await sleep(1400);
    console.log('  load:', await evaluate(S, `JSON.stringify({lcpMs:window.__lcp, cls:+window.__cls.toFixed(4),
      longTasks:window.__lt.length, longestMs:window.__lt.length?Math.max(...window.__lt):0})`));
    console.log('  scroll pacing:', await evaluate(S, PACE));
    console.log('  cls after scroll:', await evaluate(S, `+window.__cls.toFixed(4)`));
  }
  await S('Emulation.setCPUThrottlingRate', { rate: 1 });
  process.exit(0);
})();
