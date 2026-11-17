// A.5 rendered audit — screenshot matrix.
const { CDP, newPage, setup, goto, shot, evaluate, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const OUT = __dirname + '/../shots/';

const SECTIONS = [
  ['hero',    null],
  ['person',  '#person'],
  ['work',    '#work'],
  ['index',   '#index'],
  ['other',   '#other'],
  ['practice','#practice'],
  ['contact', '.a2-contact'],
];

(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);
  for (const [w, mobile] of [[390, true], [768, true], [1440, false]]) {
    for (const scheme of ['light', 'dark']) {
      await setup(S, { width: w, height: mobile ? 844 : 900, scheme, dpr: 2, mobile });
      await goto(S, B + '/', 2200);
      // reveal everything, then come back and frame each section
      await evaluate(S, `(async()=>{const H=document.body.scrollHeight;
        for(let y=0;y<H;y+=400){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,30));}
        window.scrollTo({top:0,behavior:'instant'});})()`);
      await sleep(900);
      for (const [name, sel] of SECTIONS) {
        if (sel) {
          await evaluate(S, `(()=>{const e=document.querySelector('${sel}');
            if(e) window.scrollTo({top: window.scrollY + e.getBoundingClientRect().top - 72, behavior:'instant'});})()`);
        } else {
          await evaluate(S, `window.scrollTo({top:0,behavior:'instant'})`);
        }
        await sleep(650);
        await shot(S, `${OUT}home-${name}-${w}-${scheme}.png`);
      }
    }
  }
  // case studies, 1440 light + 390 dark
  for (const [w, scheme, mobile] of [[1440,'light',false],[390,'dark',true]]) {
    await setup(S, { width: w, height: mobile?844:900, scheme, dpr: 2, mobile });
    for (const slug of ['ftc-16075','first-global','rehabos','nexusos','roamly','humanoid']) {
      await goto(S, `${B}/work/${slug}`, 2200);
      await sleep(500);
      await shot(S, `${OUT}case-${slug}-${w}-${scheme}.png`, { full: true });
    }
  }
  console.log('shots done');
  process.exit(0);
})();
