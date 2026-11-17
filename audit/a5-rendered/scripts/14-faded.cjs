const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B='http://localhost:4173';
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 await setup(S,{width:1440,height:900,scheme:'light',dpr:1,mobile:false});
 for (const s of ['ftc-16075','first-global','humanoid','rehabos']) {
  await goto(S,`${B}/work/${s}`,2200);
  await evaluate(S,`(async()=>{const H=document.body.scrollHeight;
    for(let y=0;y<H;y+=400){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,30));}})()`);
  await sleep(1200);
  console.log(`\n--- ${s} ---`);
  console.log(await evaluate(S,`(()=>{const out=[];
    for(const e of document.querySelectorAll('main *')){
      const r=e.getBoundingClientRect(); const cs=getComputedStyle(e);
      if(r.height>4&&r.width>4&&+cs.opacity<0.35){
        out.push({cls:e.className.toString().slice(0,44), tag:e.tagName,
          op:+(+cs.opacity).toFixed(3),
          w:Math.round(r.width), h:Math.round(r.height),
          topAbs:Math.round(r.top+window.scrollY),
          text:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,46),
          inView: r.top<innerHeight && r.bottom>0,
          ariaHidden:e.getAttribute('aria-hidden')});}}
    return JSON.stringify(out,null,1);})()`));
 }
 process.exit(0);})();
