// Does the resolved particle render match the photograph's colour, or is it shifted?
const { CDP, newPage, evaluate, sleep } = require('./cdp.cjs');
const fs=require('fs'); const path=require('path');
const A=path.resolve(__dirname,'../after');
const cmp=`async (a,b,rect)=>{
  const load=u=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=u;});
  const stats=async(u)=>{const img=await load(u); const [x0,y0,x1,y1]=rect;
    const N=48; const c=document.createElement('canvas'); c.width=N;c.height=N;
    const g=c.getContext('2d',{willReadFrequently:true});
    g.drawImage(img, img.width*x0, img.height*y0, img.width*(x1-x0), img.height*(y1-y0), 0,0,N,N);
    const d=g.getImageData(0,0,N,N).data; let r=0,gg=0,bb=0,n=0;
    for(let i=0;i<d.length;i+=4){r+=d[i];gg+=d[i+1];bb+=d[i+2];n++;}
    return {r:+(r/n).toFixed(1), g:+(gg/n).toFixed(1), b:+(bb/n).toFixed(1)};};
  const A=await stats(a), B=await stats(b);
  return JSON.stringify({particles:A, photograph:B,
    deltaR:+(A.r-B.r).toFixed(1), deltaG:+(A.g-B.g).toFixed(1), deltaB:+(A.b-B.b).toFixed(1),
    warmthShift:+(((A.r-A.b)-(B.r-B.b))).toFixed(1)});}`;
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 await S('Page.navigate',{url:'about:blank'}); await sleep(400);
 const u=f=>'data:image/png;base64,'+fs.readFileSync(path.join(A,f)).toString('base64');
 // face region only, 1440 dark frames
 console.log('face region, 1440 dark:');
 console.log(' ', await evaluate(S, `(${cmp})(${JSON.stringify(u('portrait-1440-dark-t1900.png'))},${JSON.stringify(u('portrait-1440-dark-t3200.png'))},[0.66,0.22,0.80,0.42])`));
 console.log('whole well, 1440 dark:');
 console.log(' ', await evaluate(S, `(${cmp})(${JSON.stringify(u('portrait-1440-dark-t1900.png'))},${JSON.stringify(u('portrait-1440-dark-t3200.png'))},[0.482,0.064,0.966,0.596])`));
 console.log('whole well, 390 light:');
 console.log(' ', await evaluate(S, `(${cmp})(${JSON.stringify(u('portrait-390-light-t1900.png'))},${JSON.stringify(u('portrait-390-light-t3200.png'))},[0.046,0.104,0.954,0.525])`));
 process.exit(0);})();
