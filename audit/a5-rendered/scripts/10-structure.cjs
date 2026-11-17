const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B='http://localhost:4173';
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
  await setup(S,{width:1440,height:900,scheme:'light',dpr:1,mobile:false});
  await goto(S,B+'/',2400);
  await evaluate(S,`(async()=>{const H=document.body.scrollHeight;
    for(let y=0;y<H;y+=400){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}})()`);
  await sleep(700);
  console.log(await evaluate(S,`(()=>{const ss=[...document.querySelectorAll('main > section')];
    const total=document.body.scrollHeight;
    return JSON.stringify(ss.map(s=>({id:s.id||s.className.split(' ').slice(-1)[0],
      h:Math.round(s.getBoundingClientRect().height),
      pct:+(100*s.getBoundingClientRect().height/total).toFixed(1),
      heads:[...s.querySelectorAll('h2,h3')].map(h=>h.innerText.replace(/\\s+/g,' ').trim().slice(0,34)).slice(0,5),
      items:s.querySelectorAll('li').length,
      links:s.querySelectorAll('a').length})),null,1);})()`));
  console.log('\ncontact finale:', await evaluate(S,`(()=>{const c=document.querySelector('.a2-contact');
    return c? JSON.stringify({h:Math.round(c.getBoundingClientRect().height),
      parent:c.parentElement.tagName+'.'+c.parentElement.className.slice(0,24)}):'none';})()`));
  process.exit(0);})();
