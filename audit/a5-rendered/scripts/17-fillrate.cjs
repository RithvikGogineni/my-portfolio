// Discriminator: if formation is fill-rate bound, halving device pixels
// (dpr 2 -> 1, a quarter of the fragments) should restore 60fps.
const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B='http://localhost:4173';
const PROBE=`(()=>{window.__f=[];let last=0;const o=window.requestAnimationFrame;
  window.requestAnimationFrame=function(cb){return o.call(window,(t)=>{if(last)window.__f.push(t-last);last=t;return cb(t);});};
  return 1;})()`;
const read=`(()=>{const d=window.__f.filter(x=>x>0&&x<400).sort((a,b)=>a-b);
  if(!d.length) return 'none'; const q=p=>+d[Math.min(d.length-1,Math.floor(d.length*p))].toFixed(1);
  return JSON.stringify({frames:d.length, median:q(0.5), fps:Math.round(1000/q(0.5))});})()`;
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 for (const [w,dpr,mobile] of [[1440,2,false],[1440,1,false],[390,2,true],[390,1,true]]) {
  await setup(S,{width:w,height:mobile?844:900,scheme:'dark',dpr,mobile});
  await S('Page.addScriptToEvaluateOnNewDocument',{source:PROBE});
  await goto(S,B+'/',2600);
  // control: frame pacing with NO portrait running (page idle at hero)
  await evaluate(S,`window.__f=[]`);
  await evaluate(S,`(async()=>{let run=true;const t=()=>{if(run)requestAnimationFrame(t);};requestAnimationFrame(t);
    await new Promise(r=>setTimeout(r,1500)); run=false;})()`);
  const control = await evaluate(S, read);
  // formation
  await evaluate(S,`window.__f=[]`);
  await evaluate(S,`(()=>{const e=document.querySelector('.a2-person__portrait');
    window.scrollTo({top: window.scrollY+e.getBoundingClientRect().top-90, behavior:'instant'});})()`);
  await sleep(2400);
  const during = await evaluate(S, read);
  const cv = await evaluate(S,`(()=>{const c=document.querySelector('.a2-pp__canvas');return c?c.width+'x'+c.height:'-';})()`);
  console.log(`  ${w}px dpr${dpr}  canvas ${cv.padEnd(11)} | idle-page control ${control} | during formation ${during}`);
 }
 process.exit(0);})();
