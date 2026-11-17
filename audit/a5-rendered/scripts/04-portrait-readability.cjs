// Objective readability of the particle phase: how close each frame's portrait
// region is to the settled photograph, and how much contrast it carries.
// Frames are decoded in Chrome's own 2D canvas (no image libraries needed).
const { CDP, newPage, evaluate, sleep } = require('./cdp.cjs');
const path = require('path');
const fs = require('fs');
const SH = path.resolve(__dirname, '../shots');

const SETS = {
  '1440-dark': { rect: [0.482, 0.064, 0.966, 0.596], ts: [60,200,400,700,1100,1600,2400,3200] },
  '390-light': { rect: [0.046, 0.104, 0.954, 0.525], ts: [60,200,400,700,1100,1600,2400,3200] },
};

const analyse = `async (files, rect) => {
  const load = (u)=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=u;});
  const N=64; // downsample grid
  const grab = async (u)=>{
    const img=await load(u);
    const [x0,y0,x1,y1]=rect;
    const sx=img.width*x0, sy=img.height*y0, sw=img.width*(x1-x0), sh=img.height*(y1-y0);
    const c=document.createElement('canvas'); c.width=N; c.height=N;
    const g=c.getContext('2d',{willReadFrequently:true});
    g.drawImage(img, sx, sy, sw, sh, 0, 0, N, N);
    const d=g.getImageData(0,0,N,N).data; const lum=[];
    for(let i=0;i<d.length;i+=4) lum.push(0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2]);
    return lum;
  };
  const out=[]; const ref=await grab(files[files.length-1].u);
  const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
  const rm=mean(ref); const rsd=Math.sqrt(mean(ref.map(v=>(v-rm)**2)));
  for(const f of files){
    const a=await grab(f.u); const m=mean(a);
    const sd=Math.sqrt(mean(a.map(v=>(v-m)**2)));
    // correlation with the settled photograph: 1.0 = structurally identical
    let cov=0; for(let i=0;i<a.length;i++) cov+=(a[i]-m)*(ref[i]-rm); cov/=a.length;
    const corr = (sd>0.001&&rsd>0.001)? cov/(sd*rsd) : 0;
    out.push({t:f.t, meanLum:+m.toFixed(1), rms:+sd.toFixed(1), corrWithFinal:+corr.toFixed(3)});
  }
  return JSON.stringify(out);
}`;

(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  await S('Page.navigate', { url: 'about:blank' }); await sleep(400);
  for (const [key, cfg] of Object.entries(SETS)) {
    // data: URLs, so the canvas is never tainted and no origin rules apply
    const files = cfg.ts.map(t => ({ t, u: 'data:image/png;base64,' +
      fs.readFileSync(`${SH}/frame-portrait-${key}-t${t}.png`).toString('base64') }));
    const expr = `(${analyse})(${JSON.stringify(files)}, ${JSON.stringify(cfg.rect)})`;
    console.log(`\n=== ${key} — portrait region vs settled photograph ===`);
    console.log('  meanLum = average brightness, rms = contrast, corrWithFinal = structural match (1.0 = the photo)');
    const r = JSON.parse(await evaluate(S, expr));
    for (const row of r) console.log(`  t+${String(row.t).padStart(4)}ms  mean ${String(row.meanLum).padStart(5)}  rms ${String(row.rms).padStart(5)}  corr ${row.corrWithFinal}`);
  }
  process.exit(0);
})();
