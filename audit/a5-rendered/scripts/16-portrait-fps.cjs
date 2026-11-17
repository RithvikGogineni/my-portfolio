// Frame pacing DURING the portrait formation itself, which is now a much
// heavier draw: full-coverage points instead of sparse dust.
const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B='http://localhost:4173';
const PROBE=`(()=>{window.__f=[];let last=0;const o=window.requestAnimationFrame;
  window.requestAnimationFrame=function(cb){return o.call(window,(t)=>{if(last)window.__f.push(t-last);last=t;return cb(t);});};
  return 1;})()`;
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 for (const [w,mobile,cpu,label] of [[1440,false,1,'desktop 1440'],[390,true,1,'mobile 390'],[390,true,4,'mobile 390 CPU x4'],[390,true,6,'mobile 390 CPU x6']]) {
  await setup(S,{width:w,height:mobile?844:900,scheme:'dark',dpr:2,mobile});
  await S('Emulation.setCPUThrottlingRate',{rate:cpu});
  await S('Page.addScriptToEvaluateOnNewDocument',{source:PROBE});
  await goto(S,B+'/',2600);
  await evaluate(S,`window.__f=[]`);
  await evaluate(S,`(()=>{const e=document.querySelector('.a2-person__portrait');
    window.scrollTo({top: window.scrollY+e.getBoundingClientRect().top-90, behavior:'instant'});})()`);
  await sleep(2600); // the whole formation
  console.log(`  ${label.padEnd(20)}`, await evaluate(S,`(()=>{const d=window.__f.filter(x=>x>0&&x<400).sort((a,b)=>a-b);
    if(!d.length) return 'no frames captured';
    const q=p=>+d[Math.min(d.length-1,Math.floor(d.length*p))].toFixed(1);
    return JSON.stringify({frames:d.length, median:q(0.5), p90:q(0.9), p99:q(0.99),
      worst:+d[d.length-1].toFixed(1), over32:d.filter(x=>x>32).length,
      pctOver32:+(100*d.filter(x=>x>32).length/d.length).toFixed(1),
      approxFps: Math.round(1000/q(0.5))});})()`));
  console.log(`     particles drawn:`, await evaluate(S,`(()=>{const c=document.querySelector('.a2-pp__canvas');
    return c? c.width+'x'+c.height+' canvas':'none';})()`));
  await S('Emulation.setCPUThrottlingRate',{rate:1});
 }
 process.exit(0);})();
