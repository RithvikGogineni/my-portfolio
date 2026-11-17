const { CDP, newPage, setup, goto, shot, evaluate, hover, sleep } = require('./cdp.cjs');
const B='http://localhost:4173'; const OUT=__dirname+'/../after/';
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 // portrait formation frames
 for (const [w,scheme,mobile] of [[1440,'dark',false],[390,'light',true]]) {
  await setup(S,{width:w,height:mobile?844:900,scheme,dpr:2,mobile});
  await goto(S,B+'/',2600);
  await evaluate(S,`(()=>{const e=document.querySelector('#person');
    window.scrollTo({top:Math.max(0,window.scrollY+e.getBoundingClientRect().top-window.innerHeight*1.4),behavior:'instant'});})()`);
  await sleep(800);
  await evaluate(S,`(()=>{const e=document.querySelector('.a2-person__portrait');
    window.scrollTo({top: window.scrollY+e.getBoundingClientRect().top-90, behavior:'instant'});})()`);
  const t0=Date.now();
  for (const at of [400,900,1400,1900,3200]) {
    while(Date.now()-t0<at) await sleep(8);
    await shot(S,`${OUT}portrait-${w}-${scheme}-t${at}.png`);
  }
  if(!mobile){ // post-reveal hover grain
    const b=JSON.parse(await evaluate(S,`(()=>{const r=document.querySelector('.a2-person__portrait').getBoundingClientRect();
      return JSON.stringify({x:Math.round(r.x+r.width*0.45),y:Math.round(r.y+r.height*0.4)});})()`));
    await hover(S,b.x,b.y); await sleep(700); await shot(S,`${OUT}portrait-hover-grain.png`);
  }
 }
 // hero at the widths the type fix changes most
 for (const [w,scheme,mobile] of [[414,'dark',true],[768,'light',true],[1024,'light',false],[1440,'light',false]]) {
  await setup(S,{width:w,height:mobile?844:900,scheme,dpr:2,mobile});
  await goto(S,B+'/',2400); await sleep(900);
  await shot(S,`${OUT}hero-${w}-${scheme}.png`);
 }
 process.exit(0);})();
