const { CDP, newPage, setup, goto, shot, evaluate, sleep } = require('./cdp.cjs');
const B='http://localhost:4173'; const OUT=__dirname+'/../after/';
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 const errs=[];
 cdp.on('Runtime.consoleAPICalled', p=>{ if(p.type==='error'||p.type==='warning') errs.push(p.type+':'+(p.args?.[0]?.value||'').toString().slice(0,90)); });
 cdp.on('Runtime.exceptionThrown', e=>errs.push('EXCEPTION: '+(e.exceptionDetails&&e.exceptionDetails.text)));

 await setup(S,{width:1440,height:900,scheme:'light',dpr:2,mobile:false});
 await goto(S,B+'/',2600);
 await evaluate(S,`(async()=>{const H=document.body.scrollHeight;
   for(let y=0;y<H;y+=400){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}})()`);
 await sleep(800);
 console.log('index rows:', await evaluate(S,`(()=>{const s=document.querySelector('#index');
   return JSON.stringify([...s.querySelectorAll('a,button')].map(e=>({
     t:e.innerText.replace(/\\s+/g,' ').trim().slice(0,34), href:e.getAttribute('href')||null})));})()`));
 console.log('portrait well:', await evaluate(S,`(()=>{const f=document.querySelector('.a2-person__portrait figure');
   if(!f) return 'MISSING'; const r=f.getBoundingClientRect();
   return JSON.stringify({cls:f.className, w:Math.round(r.width), h:Math.round(r.height),
     square:+(r.width/r.height).toFixed(2),
     text:f.innerText.replace(/\\s+/g,' ').trim().slice(0,60),
     anyImg:!!f.querySelector('img'), anyCanvas:!!f.querySelector('canvas')});})()`));
 console.log('portrait img anywhere on page:', await evaluate(S,`[...document.querySelectorAll('img')].map(i=>(i.currentSrc||i.src).split('/').pop()).join(', ')`));
 await evaluate(S,`(()=>{const e=document.querySelector('#person');
   window.scrollTo({top: window.scrollY+e.getBoundingClientRect().top-70, behavior:'instant'});})()`);
 await sleep(700); await shot(S, OUT+'a53-person-1440-light.png');

 for (const [slug, expect] of [['medrehab','MED REHAB'],['nexusos','NEXUSOS'],['rehabos','REHABOS']]) {
   await goto(S,`${B}/work/${slug}`,2200);
   await evaluate(S,`(async()=>{const H=document.body.scrollHeight;
     for(let y=0;y<H;y+=450){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}
     window.scrollTo({top:0,behavior:'instant'});})()`);
   await sleep(600);
   console.log(`/work/${slug}:`, await evaluate(S,`(()=>{const h=document.querySelector('h1');
     return JSON.stringify({h1:h?h.innerText.replace(/\\s+/g,' ').trim().slice(0,28):'NONE',
       sheetNo:(document.body.innerText.match(/Sheet\\s+\\d+\\s*\\/\\s*\\d+/)||[''])[0],
       imgs:document.querySelectorAll('main img').length,
       docH:Math.round(document.body.scrollHeight),
       status:document.title.slice(0,40)});})()`));
 }
 await goto(S,`${B}/work/medrehab`,2200); await sleep(500);
 await shot(S, OUT+'a53-medrehab-1440-light.png', {full:true});
 // mobile person
 await setup(S,{width:390,height:844,scheme:'dark',dpr:2,mobile:true});
 await goto(S,B+'/',2600);
 await evaluate(S,`(()=>{const e=document.querySelector('.a2-person__portrait');
   window.scrollTo({top: window.scrollY+e.getBoundingClientRect().top-80, behavior:'instant'});})()`);
 await sleep(900); await shot(S, OUT+'a53-person-390-dark.png');
 console.log('\nconsole:', errs.length? errs : 'clean');
 process.exit(0);})();
