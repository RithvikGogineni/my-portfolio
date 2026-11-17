const { CDP, newPage, setup, goto, shot, evaluate, hover, sleep } = require('./cdp.cjs');
const B='http://localhost:4173'; const OUT=__dirname+'/../shots/';
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 await setup(S,{width:1440,height:900,scheme:'light',dpr:2,mobile:false});
 await goto(S,B+'/',2400);
 const nav=`(()=>{const ls=[...document.querySelectorAll('.a2-head__link')];
   return JSON.stringify({scrollY:Math.round(window.scrollY),
     marked:ls.filter(a=>a.getAttribute('aria-current')||a.className.includes('is-on'))
       .map(a=>a.innerText.replace(/\\s+/g,' ').trim()),
     all:ls.map(a=>a.innerText.replace(/\\s+/g,' ').trim().slice(0,12))});})()`;
 console.log('nav at top:', await evaluate(S,nav));
 for (const sel of ['#person','#work','#index','#practice']) {
   await evaluate(S,`(()=>{const e=document.querySelector('${sel}');
     window.scrollTo({top: window.scrollY+e.getBoundingClientRect().top-60, behavior:'instant'});})()`);
   await sleep(800);
   console.log(`nav at ${sel}:`, await evaluate(S,nav));
 }
 // index preview for a row whose image was withdrawn
 await evaluate(S,`(()=>{const e=document.querySelector('#index');
   window.scrollTo({top: window.scrollY+e.getBoundingClientRect().top-70, behavior:'instant'});})()`);
 await sleep(1000);
 const rows=JSON.parse(await evaluate(S,`JSON.stringify([...document.querySelectorAll('#index a')].map(a=>{
   const r=a.getBoundingClientRect(); return {x:Math.round(r.x+120),y:Math.round(r.y+r.height/2),
     t:a.innerText.replace(/\\s+/g,' ').trim().slice(0,22)};}))`));
 for (const r of rows) {
   await hover(S,r.x,r.y); await sleep(800);
   console.log(`hover ${r.t.padEnd(24)}`, await evaluate(S,`(()=>{const p=document.querySelector('.a2-index__preview');
     const img=p.querySelector('img'); const r=p.getBoundingClientRect();
     return JSON.stringify({hasImg:!!img, src:img?(img.currentSrc||img.src).split('/').pop().slice(0,24):null,
       imgOp:img?+(+getComputedStyle(img).opacity).toFixed(2):null,
       previewText:p.innerText.replace(/\\s+/g,' ').trim().slice(0,52),
       h:Math.round(r.height)});})()`));
 }
 await shot(S, OUT+'index-preview-nexusos.png');
 process.exit(0);})();
