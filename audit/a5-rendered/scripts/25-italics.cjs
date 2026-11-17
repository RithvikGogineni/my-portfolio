const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B='http://localhost:4173';
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 const errs=[];
 cdp.on('Runtime.consoleAPICalled', p=>{ if(p.type==='error') errs.push((p.args?.[0]?.value||'').toString().slice(0,80)); });
 await setup(S,{width:1440,height:900,scheme:'light',dpr:2,mobile:false});
 for (const path of ['/','/work/medrehab','/work/ftc-16075']) {
  await goto(S,B+path,2400);
  await evaluate(S,`(async()=>{const H=document.body.scrollHeight;
    for(let y=0;y<H;y+=450){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}})()`);
  await sleep(600);
  console.log(path, await evaluate(S,`(()=>{
    const all=[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().height>2);
    const ital=all.filter(e=>getComputedStyle(e).fontStyle!=='normal');
    const fams={}; for(const e of all){const f=getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g,'');fams[f]=(fams[f]||0)+1;}
    const lede=document.querySelector('.a2-lede');
    return JSON.stringify({italicElements:ital.length,
      sample:ital.slice(0,3).map(e=>e.tagName+'.'+(e.className||'').toString().slice(0,20)),
      fontFamilies:fams,
      ledeStyle: lede? getComputedStyle(lede).fontStyle+' / '+getComputedStyle(lede).fontFamily.split(',')[0]:null});})()`));
 }
 // did the trimmed font request still deliver the faces actually used?
 console.log('\nfonts loaded:', await evaluate(S,`(()=>{const s=new Set();
   document.fonts.forEach(f=>s.add(f.family+' '+f.weight+' '+f.style));
   return JSON.stringify([...s]);})()`));
 console.log('console errors:', errs.length? errs : 'none');
 process.exit(0);})();
