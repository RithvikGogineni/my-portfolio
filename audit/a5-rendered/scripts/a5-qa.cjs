const { CDP, newPage, setup, goto, evaluate, shot, sleep } = require('./cdp.cjs');
const B='http://localhost:4173';
const fail=[]; const ck=(ok,l,d)=>{ if(!ok) fail.push(l+(d?' — '+d:'')); console.log((ok?'  ok  ':'FAIL  ')+l+(d?'  ['+d+']':'')); };
(async()=>{
  const cdp=await CDP.connect(); const {S}=await newPage(cdp);
  const logs=[]; cdp.on('Runtime.exceptionThrown',p=>logs.push('EXC'));
  cdp.on('Runtime.consoleAPICalled',p=>{ if(p.type!=='log') logs.push(p.type); });
  for (const w of [320,390,768,1024,1440,1920]) {
    for (const scheme of ['light','dark']) {
      await setup(S,{width:w,height:Math.round(w*1.9)>1100?1000:Math.round(w*1.9),scheme,dpr:1,mobile:w<700});
      await goto(S,B+'/',3400);
      // walk the page so every section arrives
      await evaluate(S,`(async()=>{const H=document.body.scrollHeight;
        for(let y=0;y<H;y+=420){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,45));}})()`);
      await sleep(1600);
      const m = JSON.parse(await evaluate(S,`JSON.stringify((()=>{
        const over=document.documentElement.scrollWidth-window.innerWidth;
        const hidden=[...document.querySelectorAll('.a2-sheet section, main section, .a2-other__item, .a2-kit__group, .a2-index__item, .a2-curio__row')]
          .filter(e=>{const r=e.getBoundingClientRect(); const vis=r.top<innerHeight&&r.bottom>0;
            return vis && +getComputedStyle(e).opacity===0;}).length;
        const broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length;
        return {over, hiddenVisible:hidden, broken,
          contact:getComputedStyle(document.querySelector('.a2-contact')).clipPath,
          pp:getComputedStyle(document.querySelector('.a2-pp__img')).opacity};})())`));
      ck(m.over<=0 && m.hiddenVisible===0 && m.broken===0 && +m.pp===1,
        `${w} ${scheme}`, JSON.stringify(m));
      if (scheme==='light' && (w===320||w===1920)) { await evaluate(S,`window.scrollTo({top:0,behavior:'instant'})`); await sleep(500); await shot(S,`a5-qa-${w}.png`); }
    }
  }
  console.log('console:', logs.length?logs:'clean');
  ck(logs.length===0,'console clean');
  console.log(fail.length?'FAILURES:\n - '+fail.join('\n - '):'Visual QA matrix clean.');
  process.exit(0);
})();
