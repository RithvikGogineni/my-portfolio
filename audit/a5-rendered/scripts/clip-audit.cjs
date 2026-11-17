// Every masked display line, on every page that has one, at many widths.
// Reports lines whose text is wider than the mask that clips it.
const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const WIDTHS = [320,360,390,414,480,600,700,768,820,900,1024,1180,1280,1440,1600,1728,1920,2200,2560];
const PAGES = ['/', '/work/ftc-16075', '/work/first-global', '/work/rehabos',
  '/work/nexusos', '/work/roamly', '/work/humanoid'];

(async()=>{
  const cdp=await CDP.connect(); const {S}=await newPage(cdp);
  const bad=[];
  for (const page of PAGES){
    for (const w of WIDTHS){
      await setup(S,{width:w,height:900,scheme:'light',dpr:1,mobile:w<768});
      await goto(S,B+page,1500);
      // reveal everything so nothing is measured mid-entrance
      await evaluate(S,`(async()=>{const H=document.body.scrollHeight;
        for(let y=0;y<H;y+=500){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}
        window.scrollTo({top:0,behavior:'instant'});})()`);
      await sleep(900);
      const rows = JSON.parse(await evaluate(S,`JSON.stringify([...document.querySelectorAll('.a2-mask')].map(m=>{
        const inn=m.querySelector('.a2-mask__in'); if(!inn) return null;
        const t=(inn.textContent||'').trim();
        // scrollWidth of the mask vs its own client width is the clip test
        const over = Math.round(inn.scrollWidth - m.clientWidth);
        return {t:t.slice(0,28), over, fs:Math.round(parseFloat(getComputedStyle(inn).fontSize)),
          mw:Math.round(m.clientWidth), tw:Math.round(inn.scrollWidth)};
      }).filter(Boolean))`));
      for (const r of rows){ if (r.over > 1) bad.push({page,w,...r}); }
    }
  }
  if(!bad.length){ console.log('No clipped display lines at any width.'); process.exit(0); }
  console.log('CLIPPED DISPLAY LINES\n');
  const byText={};
  for(const b of bad){ (byText[b.page+' | '+b.t] ||= []).push(b); }
  for(const k of Object.keys(byText)){
    const g=byText[k]; const ws=g.map(x=>x.w);
    const worst=g.reduce((a,b)=>b.over>a.over?b:a);
    console.log(`"${k}"`);
    console.log(`   clipped at ${ws.length} widths: ${ws.join(', ')}`);
    console.log(`   worst: ${worst.w}px viewport — text ${worst.tw}px in a ${worst.mw}px mask, over by ${worst.over}px (font ${worst.fs}px)\n`);
  }
  process.exit(0);
})();
