// Flagship (FTC) presentation + inspect interactions, with trusted input.
const { CDP, newPage, setup, goto, shot, evaluate, click, key, touchTap, sleep } = require('./cdp.cjs');
const B = 'http://localhost:4173';
const OUT = __dirname + '/../shots/';
const state = `(()=>{
  const tabs=[...document.querySelectorAll('.a2-tab')];
  const fb=document.querySelector('.a2-focusbox');
  const ld=document.querySelector('.a2-leader');
  const panel=document.querySelector('.a2-inspect__panel');
  const sel=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');
  const fbs=fb?getComputedStyle(fb):null;
  return JSON.stringify({
    tabs:tabs.length, selected:sel,
    selectedName:sel>=0?tabs[sel].innerText.replace(/\\s+/g,' ').trim().slice(0,30):null,
    roving:tabs.map(t=>t.tabIndex).join(','),
    focusbox: fb? {x:+fb.getBoundingClientRect().x.toFixed(1), y:+fb.getBoundingClientRect().y.toFixed(1),
      w:Math.round(fb.getBoundingClientRect().width), op:fbs.opacity} : null,
    leader: ld? {x:+ld.getBoundingClientRect().x.toFixed(1), y:+ld.getBoundingClientRect().y.toFixed(1)} : null,
    panelText: panel? panel.innerText.replace(/\\s+/g,' ').trim().slice(0,60):null,
    active: document.activeElement? (document.activeElement.className||document.activeElement.tagName).toString().slice(0,40):null
  });})()`;

(async () => {
  const cdp = await CDP.connect(); const { S } = await newPage(cdp);

  // ---------- desktop ----------
  console.log('=== flagship @1440 light (pointer + keyboard) ===');
  await setup(S, { width: 1440, height: 900, scheme: 'light', dpr: 2, mobile: false });
  await goto(S, B + '/', 2400);
  await evaluate(S, `(()=>{const e=document.querySelector('.a2-inspect');
    window.scrollTo({top: window.scrollY + e.getBoundingClientRect().top - 80, behavior:'instant'});})()`);
  await sleep(1400);
  console.log('  rest:', await evaluate(S, state));
  await shot(S, OUT + 'flagship-1440-light-rest.png');

  const tabBox = JSON.parse(await evaluate(S, `JSON.stringify([...document.querySelectorAll('.a2-tab')].map(t=>{
    const r=t.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2),
      name:t.innerText.replace(/\\s+/g,' ').trim().slice(0,22)};}))`));
  console.log('  tabs:', JSON.stringify(tabBox.map(t=>t.name)));

  for (let i = 1; i < tabBox.length; i++) {
    await click(S, tabBox[i].x, tabBox[i].y); await sleep(700);
    console.log(`  click "${tabBox[i].name}":`, await evaluate(S, state));
    if (i === 2) await shot(S, OUT + 'flagship-1440-light-tab3.png');
  }
  // keyboard: arrows must move selection and focus
  await click(S, tabBox[0].x, tabBox[0].y); await sleep(500);
  for (const k of ['ArrowDown','ArrowDown','ArrowUp','End','Home']) {
    const code = {ArrowDown:[40,'ArrowDown'],ArrowUp:[38,'ArrowUp'],End:[35,'End'],Home:[36,'Home']}[k];
    await key(S, k, code[1], code[0]); await sleep(500);
    const st = JSON.parse(await evaluate(S, state));
    console.log(`  key ${k.padEnd(10)} -> selected ${st.selected} (${st.selectedName}) focus=${st.active}`);
  }

  // ---------- mobile touch ----------
  console.log('\n=== flagship @390 dark (touch) ===');
  await setup(S, { width: 390, height: 844, scheme: 'dark', dpr: 2, mobile: true });
  await goto(S, B + '/', 2600);
  await evaluate(S, `(()=>{const e=document.querySelector('.a2-inspect');
    window.scrollTo({top: window.scrollY + e.getBoundingClientRect().top - 70, behavior:'instant'});})()`);
  await sleep(1400);
  console.log('  rest:', await evaluate(S, state));
  const mTabs = JSON.parse(await evaluate(S, `JSON.stringify([...document.querySelectorAll('.a2-tab')].map(t=>{
    const r=t.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2),
      w:Math.round(r.width), h:Math.round(r.height), name:t.innerText.replace(/\\s+/g,' ').trim().slice(0,22)};}))`));
  console.log('  touch target sizes:', JSON.stringify(mTabs.map(t=>`${t.w}x${t.h}`)));
  const t2 = mTabs[Math.min(2, mTabs.length-1)];
  await touchTap(S, t2.x, t2.y); await sleep(800);
  console.log(`  tap "${t2.name}":`, await evaluate(S, state));
  await shot(S, OUT + 'flagship-390-dark-tapped.png');
  process.exit(0);
})();
