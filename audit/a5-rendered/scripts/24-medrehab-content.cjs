// The full-page capture showed empty sections. Is the content actually
// missing, or did the reveal observers simply never fire without a scroll?
const { CDP, newPage, setup, goto, shot, evaluate, sleep } = require('./cdp.cjs');
const B='http://localhost:4173'; const OUT=__dirname+'/../after/';
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 await setup(S,{width:1440,height:900,scheme:'light',dpr:2,mobile:false});
 await goto(S,B+'/work/medrehab',2400);
 console.log('WITHOUT scrolling:', await evaluate(S,`(()=>{const ss=[...document.querySelectorAll('main section')];
   return JSON.stringify(ss.map(s=>({id:s.id||'-',
     h:Math.round(s.getBoundingClientRect().height),
     textLen:s.innerText.replace(/\\s+/g,' ').trim().length,
     minOp:Math.min(...[...s.querySelectorAll('p,li,img,figure')].map(e=>+getComputedStyle(e).opacity).concat([1]))})));})()`));
 await evaluate(S,`(async()=>{const H=document.body.scrollHeight;
   for(let y=0;y<H;y+=400){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,35));}})()`);
 await sleep(900);
 console.log('AFTER scrolling :', await evaluate(S,`(()=>{const ss=[...document.querySelectorAll('main section')];
   return JSON.stringify(ss.map(s=>({id:s.id||'-',
     h:Math.round(s.getBoundingClientRect().height),
     textLen:s.innerText.replace(/\\s+/g,' ').trim().length,
     minOp:Math.min(...[...s.querySelectorAll('p,li,img,figure')].map(e=>+getComputedStyle(e).opacity).concat([1]))})));})()`));
 console.log('\nsection text:', await evaluate(S,`(()=>{const ss=[...document.querySelectorAll('main section')];
   return JSON.stringify(ss.map(s=>s.innerText.replace(/\\s+/g,' ').trim().slice(0,90)),null,1);})()`));
 await evaluate(S,`window.scrollTo({top:0,behavior:'instant'})`); await sleep(400);
 await shot(S, OUT+'a53-medrehab-scrolled.png', {full:true});
 process.exit(0);})();
