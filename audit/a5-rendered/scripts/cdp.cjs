// Minimal CDP driver: real-time rendering, exact viewports, full-page capture,
// and trusted input events. Node 22 global WebSocket, no dependencies.
//
// Rebuilt 2026-11-14 after the scratchpad was cleared between sessions.
// Synthetic events are not an option here: Lenis and Framer Motion ignore
// them, so a synthetic harness reports working interactions as broken.
const fs = require('fs');
const http = require('http');

const PORT = +(process.env.CDP_PORT || 9222);

const getJSON = (path) => new Promise((res, rej) => {
  http.get({ host: '127.0.0.1', port: PORT, path }, (r) => {
    let b = ''; r.on('data', (d) => (b += d)); r.on('end', () => res(JSON.parse(b)));
  }).on('error', rej);
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = new Map();
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.pending.has(m.id)) {
        const { res, rej } = this.pending.get(m.id); this.pending.delete(m.id);
        m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
      } else if (m.method) {
        (this.handlers.get(m.method) || []).forEach((h) => h(m.params));
      }
    };
  }
  static async connect() {
    const v = await getJSON('/json/version');
    const ws = new WebSocket(v.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
    return new CDP(ws);
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pending.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }
  on(method, fn) { if (!this.handlers.has(method)) this.handlers.set(method, []); this.handlers.get(method).push(fn); }
}

async function newPage(cdp) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const S = (m, p) => cdp.send(m, p, sessionId);
  await S('Page.enable'); await S('Runtime.enable'); await S('Log.enable'); await S('Network.enable');
  return { sessionId, S, targetId };
}

async function setup(S, { width, height, scheme, dpr = 2, mobile = false, reducedMotion = false }) {
  await S('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: dpr, mobile,
    screenWidth: width, screenHeight: height,
  });
  const features = [{ name: 'prefers-color-scheme', value: scheme }];
  if (reducedMotion) features.push({ name: 'prefers-reduced-motion', value: 'reduce' });
  await S('Emulation.setEmulatedMedia', { media: 'screen', features });
  // Always set it, both ways. Leaving it enabled from an earlier mobile pass
  // makes a later desktop pass report `pointer: coarse`.
  await S('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
}

async function goto(S, url, settle = 2600) {
  await S('Page.navigate', { url });
  await sleep(settle);
}

async function shot(S, out, { full = false } = {}) {
  let clip;
  if (full) {
    const m = await S('Page.getLayoutMetrics');
    const c = m.cssContentSize || m.contentSize;
    clip = { x: 0, y: 0, width: c.width, height: Math.min(c.height, 24000), scale: 1 };
  }
  const { data } = await S('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: full, ...(clip ? { clip } : {}),
  });
  fs.writeFileSync(out, Buffer.from(data, 'base64'));
  return out;
}

async function evaluate(S, expr) {
  const r = await S('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || ''));
  return r.result.value;
}

// Trusted input -------------------------------------------------------------
async function hover(S, x, y) { await S('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 }); }
async function click(S, x, y) {
  await hover(S, x, y);
  await S('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1, buttons: 1 });
  await S('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1, buttons: 0 });
}
async function key(S, text, code, keyCode, extra = {}) {
  await S('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: text, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode, ...extra });
  await S('Input.dispatchKeyEvent', { type: 'keyUp', key: text, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode, ...extra });
}
async function touchTap(S, x, y) {
  await S('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, radiusX: 12, radiusY: 12, force: 1 }] });
  await sleep(40);
  await S('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

module.exports = { CDP, newPage, setup, goto, shot, evaluate, hover, click, key, touchTap, sleep };
