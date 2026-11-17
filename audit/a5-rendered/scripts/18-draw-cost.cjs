// The tab is vsync-capped at 30Hz in this environment (an idle page measures
// the same 33.3ms), so frame rate cannot show the cost of the heavier draw.
// Measure the draw itself instead: same shader, same point count, old point
// size vs new, with gl.finish() so GPU time is actually waited on.
const { CDP, newPage, setup, goto, evaluate, sleep } = require('./cdp.cjs');
const B='http://localhost:4173';
const BENCH = (size, count, dim) => `(()=>{
  const cv=document.createElement('canvas'); cv.width=${dim}; cv.height=${dim};
  const gl=cv.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,depth:false});
  if(!gl) return JSON.stringify({err:'no webgl'});
  const vs=gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs,'attribute vec2 p; uniform float s; void main(){gl_Position=vec4(p,0.,1.); gl_PointSize=s;}');
  gl.compileShader(vs);
  const fs=gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs,'precision mediump float; void main(){vec2 c=gl_PointCoord-0.5; float d=dot(c,c); if(d>0.25) discard; gl_FragColor=vec4(0.8,0.8,0.8, smoothstep(0.25,0.04,d));}');
  gl.compileShader(fs);
  const pr=gl.createProgram(); gl.attachShader(pr,vs); gl.attachShader(pr,fs); gl.linkProgram(pr); gl.useProgram(pr);
  const n=${count}; const a=new Float32Array(n*2);
  const across=Math.ceil(Math.sqrt(n));
  for(let i=0;i<n;i++){ a[i*2]=((i%across)/across)*2-1; a[i*2+1]=((Math.floor(i/across))/across)*2-1; }
  const b=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,b); gl.bufferData(gl.ARRAY_BUFFER,a,gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  gl.uniform1f(gl.getUniformLocation(pr,'s'), ${size});
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0,0,0,0);
  // warm up
  for(let i=0;i<10;i++){gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.POINTS,0,n);} gl.finish();
  const t0=performance.now(); const N=60;
  for(let i=0;i<N;i++){gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.POINTS,0,n);} gl.finish();
  const ms=(performance.now()-t0)/N;
  return JSON.stringify({points:n, pointSize:${size}, canvas:${dim}, msPerDraw:+ms.toFixed(3),
    overdraw:+((n*Math.PI*(${size}/2)**2)/(${dim}*${dim})).toFixed(2)});})()`;
(async()=>{const cdp=await CDP.connect(); const {S}=await newPage(cdp);
 await setup(S,{width:1440,height:900,scheme:'dark',dpr:2,mobile:false});
 await goto(S,B+'/',2000);
 console.log('desktop well, 1395px canvas, ~11449 points:');
 console.log('  A.5  (4.6px points, sparse):      ', await evaluate(S, BENCH(4.6, 8000, 1395)));
 console.log('  A.5.2 (15.9px points, at rest):   ', await evaluate(S, BENCH(15.9, 11449, 1395)));
 console.log('  A.5.2 (27px, formation peak 1.7x):', await evaluate(S, BENCH(27, 11449, 1395)));
 console.log('\nmobile well, 708px canvas:');
 console.log('  A.5  (6px points, 36x36 grid):    ', await evaluate(S, BENCH(6, 1296, 708)));
 console.log('  A.5.2 (13.5px, 64x64 grid):       ', await evaluate(S, BENCH(13.5, 4096, 708)));
 console.log('  A.5.2 (23px, formation peak):     ', await evaluate(S, BENCH(23, 4096, 708)));
 console.log('\n(16.7ms is the whole budget for a 60fps frame)');
 process.exit(0);})();
