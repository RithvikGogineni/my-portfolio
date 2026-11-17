// Try to recover a 60Hz tab: bring the target to front and emulate focus.
const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B='http://localhost:4173';
const PROBE=`(()=>{window.__f=[];let last=0;const o=window.requestAnimationFrame;
  window.requestAnimationFrame=function(cb){return o.call(window,(t)=>{if(last)window.__f.push(t-last);last=t;return cb(t);});};
  return 1;})()`;
const read=`(()=>{const d=window.__f.filter(x=>x>0&&x<400).sort((a,b)=>a-b);
  if(!d.length) return 'none'; const q=p=>+d[Math.min(d.length-1,Math.floor(d.length*p))].toFixed(1);
  return JSON.stringify({frames:d.length,median:q(0.5),p90:q(0.9),worst:+d[d.length-1].toFixed(1),
    over20:d.filter(x=>x>20).length, fps:Math.round(1000/q(0.5))});})()`;
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 await setup(S,{width:1440,height:900,scheme:'dark',dpr:2,mobile:false});
 try { await S('Emulation.setFocusEmulationEnabled',{enabled:true}); } catch(e){ console.log('focus emulation unavailable:', e.message.slice(0,60)); }
 try { await S('Page.bringToFront'); } catch(e){ console.log('bringToFront unavailable'); }
 await S('Page.addScriptToEvaluateOnNewDocument',{source:PROBE});
 await goto(S,B+'/',2600);
 await evaluate(S,`window.__f=[]`);
 await evaluate(S,`(async()=>{let run=true;const t=()=>{if(run)requestAnimationFrame(t);};requestAnimationFrame(t);
   await new Promise(r=>setTimeout(r,1500));run=false;})()`);
 console.log('  idle control :', await evaluate(S,read));
 await evaluate(S,`window.__f=[]`);
 await evaluate(S,`(()=>{const e=document.querySelector('.a2-person__portrait');
   window.scrollTo({top: window.scrollY+e.getBoundingClientRect().top-90, behavior:'instant'});})()`);
 await sleep(2400);
 console.log('  formation    :', await evaluate(S,read));
 // and a full-page scroll, comparable with 08-perf.txt
 await evaluate(S,`window.__f=[]`);
 await evaluate(S,`(async()=>{const H=document.body.scrollHeight-innerHeight;
   for(let i=0;i<=90;i++){window.scrollTo({top:Math.round(H*i/90),behavior:'instant'});
     await new Promise(r=>requestAnimationFrame(()=>r()));}})()`);
 console.log('  full scroll  :', await evaluate(S,read));
 process.exit(0);})();
