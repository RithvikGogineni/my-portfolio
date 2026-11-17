// The portrait build is synchronous: getImageData + a per-cell loop + buffer
// upload. Measure the long task it produces when the section comes into view.
const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B='http://localhost:4173';
const OBS=`(()=>{window.__lt=[];
  try{new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__lt.push(Math.round(e.duration));})
    .observe({type:'longtask',buffered:true});}catch(e){}
  return 1;})()`;
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 for (const [w,mobile,cpu] of [[1440,false,1],[390,true,1],[390,true,4],[390,true,6]]) {
  await setup(S,{width:w,height:mobile?844:900,scheme:'dark',dpr:2,mobile});
  await S('Emulation.setCPUThrottlingRate',{rate:cpu});
  await S('Page.addScriptToEvaluateOnNewDocument',{source:OBS});
  await goto(S,B+'/',2800);
  await evaluate(S,`window.__lt=[]`);
  await evaluate(S,`(()=>{const e=document.querySelector('.a2-person__portrait');
    window.scrollTo({top: window.scrollY+e.getBoundingClientRect().top-90, behavior:'instant'});})()`);
  await sleep(3000);
  console.log(`  ${w}px cpu x${cpu}:`, await evaluate(S,`JSON.stringify({
    longTasksDuringFormation: window.__lt, longest: window.__lt.length?Math.max(...window.__lt):0,
    particleCount: (()=>{const c=document.querySelector('.a2-pp__canvas'); return c? c.width:'-';})()})`));
  await S('Emulation.setCPUThrottlingRate',{rate:1});
 }
 process.exit(0);})();
