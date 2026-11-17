const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B='http://localhost:4173';
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 for (const w of [1440, 768]) {
  await setup(S,{width:w,height:900,scheme:'light',dpr:1,mobile:w<768});
  await goto(S,B+'/',2200);
  await evaluate(S,`(async()=>{const H=document.body.scrollHeight;
    for(let y=0;y<H;y+=500){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,20));}})()`);
  await sleep(500);
  console.log(`@${w}`, await evaluate(S,`(()=>{
    const body=document.querySelector('.a2-practice__body');
    const prose=document.querySelector('#practice .a2-prose');
    const measureCh=(el)=>{const s=document.createElement('span');
      s.textContent='0'.repeat(100); s.style.cssText='position:absolute;visibility:hidden;white-space:pre';
      el.appendChild(s); const wch=s.getBoundingClientRect().width/100; s.remove(); return wch;};
    const bodyCh=measureCh(body), proseCh=measureCh(prose);
    const bw=body.getBoundingClientRect().width;
    return JSON.stringify({
      containerWidthPx:Math.round(bw),
      containerFont:getComputedStyle(body).fontSize+' '+getComputedStyle(body).fontFamily.split(',')[0],
      proseFont:getComputedStyle(prose).fontSize+' '+getComputedStyle(prose).fontFamily.split(',')[0],
      chWidthInContainerFont:+bodyCh.toFixed(2),
      chWidthInProseFont:+proseCh.toFixed(2),
      capIs68ch_resolvesTo:Math.round(68*bodyCh)+'px',
      thatIsCharsOfProse:Math.round(bw/proseCh),
      maxWidthComputed:getComputedStyle(body).maxWidth});})()`));
 }
 process.exit(0);})();
