// Performance: CLS, long tasks, frame pacing during scroll, idle cost, payload.
const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';

const OBSERVERS = `(()=>{
  window.__cls=0; window.__shifts=[]; window.__lt=[]; window.__lcp=0;
  try{ new PerformanceObserver(l=>{for(const e of l.getEntries()){
    if(!e.hadRecentInput){window.__cls+=e.value; if(e.value>0.0005) window.__shifts.push(+e.value.toFixed(4));}}})
    .observe({type:'layout-shift',buffered:true}); }catch(e){window.__clsErr=''+e;}
  try{ new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__lt.push(Math.round(e.duration));})
    .observe({type:'longtask',buffered:true}); }catch(e){window.__ltErr=''+e;}
  try{ new PerformanceObserver(l=>{const es=l.getEntries(); window.__lcp=Math.round(es[es.length-1].startTime);})
    .observe({type:'largest-contentful-paint',buffered:true}); }catch(e){window.__lcpErr=''+e;}
  return 1;})()`;

// Frame pacing: record rAF deltas while a scroll runs.
const SCROLL_AND_MEASURE = `(async()=>{
  const deltas=[]; let last=performance.now(); let run=true;
  const tick=(t)=>{ deltas.push(t-last); last=t; if(run) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  const H=document.body.scrollHeight - innerHeight;
  const steps=90;
  for(let i=0;i<=steps;i++){
    window.scrollTo({top: Math.round(H*i/steps), behavior:'instant'});
    await new Promise(r=>requestAnimationFrame(()=>r()));
  }
  run=false; await new Promise(r=>setTimeout(r,60));
  const d=deltas.slice(3).filter(x=>x>0).sort((a,b)=>a-b);
  const q=(p)=>d.length? +d[Math.min(d.length-1,Math.floor(d.length*p))].toFixed(1) : null;
  const long=d.filter(x=>x>32).length;   // dropped a frame at 60Hz
  const vlong=d.filter(x=>x>50).length;
  return JSON.stringify({frames:d.length, medianMs:q(0.5), p90Ms:q(0.9), p99Ms:q(0.99),
    worstMs:+d[d.length-1]?.toFixed(1), framesOver32ms:long, framesOver50ms:vlong,
    pctOver32: +(100*long/d.length).toFixed(1)});})()`;

(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  for (const [w, mobile, label] of [[1440, false, 'desktop 1440'], [390, true, 'mobile 390']]) {
    console.log(`\n=== ${label} ===`);
    await setup(S, { width: w, height: mobile?844:900, scheme: 'dark', dpr: 2, mobile });
    await S('Page.addScriptToEvaluateOnNewDocument', { source: OBSERVERS });
    await goto(S, B + '/', 3000);
    await sleep(1200);
    console.log('  at rest after load:', await evaluate(S, `JSON.stringify({
      cls:+window.__cls.toFixed(4), shifts:window.__shifts.slice(0,6),
      longTasksMs:window.__lt.slice(0,8), longTaskCount:window.__lt.length,
      lcpMs:window.__lcp, errs:[window.__clsErr,window.__ltErr,window.__lcpErr].filter(Boolean)})`));
    console.log('  frame pacing during full-page scroll:', await evaluate(S, SCROLL_AND_MEASURE));
    console.log('  cls after scroll:', await evaluate(S, `JSON.stringify({cls:+window.__cls.toFixed(4), shiftCount:window.__shifts.length, biggest:Math.max(0,...window.__shifts)})`));
    // idle: frames requested over 3s with nothing happening
    const idle = await evaluate(S, `(async()=>{let n=0; let run=true;
      const t=()=>{n++; if(run) requestAnimationFrame(t);}; requestAnimationFrame(t);
      await new Promise(r=>setTimeout(r,3000)); run=false; return n;})()`);
    console.log(`  rAF callbacks the page itself drives while idle (3s): ${idle} were served to MY probe (a parked page still serves the probe; see note)`);
    const idle2 = await evaluate(S, `(async()=>{const before=performance.now();
      let painted=0; const obs=new PerformanceObserver(()=>{}); 
      await new Promise(r=>setTimeout(r,2000));
      return JSON.stringify({elapsed:Math.round(performance.now()-before)});})()`);
    console.log('  (idle sanity)', idle2);
  }
  // payload
  console.log('\n=== payload ===');
  await goto(S, B + '/', 2600);
  console.log(await evaluate(S, `(()=>{const rs=performance.getEntriesByType('resource');
    const by={}; let total=0;
    for(const r of rs){const k=(r.name.split('.').pop()||'').split('?')[0].slice(0,5);
      const s=r.transferSize||r.encodedBodySize||0; by[k]=(by[k]||0)+s; total+=s;}
    const nav=performance.getEntriesByType('navigation')[0];
    return JSON.stringify({resources:rs.length, totalKB:Math.round(total/1024),
      byType:Object.fromEntries(Object.entries(by).map(([k,v])=>[k,Math.round(v/1024)+'KB'])),
      domContentLoadedMs: nav?Math.round(nav.domContentLoadedEventEnd):null,
      loadMs: nav?Math.round(nav.loadEventEnd):null});})()`));
  process.exit(0);
})();
