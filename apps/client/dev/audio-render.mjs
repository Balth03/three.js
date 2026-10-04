// Headless render of every audio scenario (OfflineAudioContext inside Chromium) -> float32 WAV files.
// Usage (from repo root):  node apps/client/dev/audio-render.mjs [scenario ...]
// Starts a Vite dev server on a free port unless AUDIO_PREVIEW_URL is set.
// Then run: python3 apps/client/dev/audio-analyze.py

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const clientDir = resolve(here, '..');
// full-precision float renders (analysis input) go to the git-ignored screenshots/tmp; a few 16-bit
// copies for listening go to screenshots/dev
const rawDir = resolve(clientDir, '../../screenshots/tmp/audio');
const outDir = resolve(clientDir, '../../screenshots/dev');
const KEEP = new Set(['engine_sweep', 'tyres', 'radio_seine', 'radio_electro', 'radio_musette', 'siren_passby', 'full_mix']);
mkdirSync(rawDir, { recursive: true });
mkdirSync(outDir, { recursive: true });
process.env.PLAYWRIGHT_BROWSERS_PATH ??= '/opt/pw-browsers';
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');

let server = null;
let url = process.env.AUDIO_PREVIEW_URL;
if (!url) {
  const port = 5199;
  server = spawn('npx', ['vite', '--port', String(port), '--strictPort'], { cwd: clientDir, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
  await new Promise((res, rej) => {
    const to = setTimeout(() => rej(new Error('vite did not start')), 60000);
    const onData = (d) => { if (String(d).includes('Local')) { clearTimeout(to); res(); } };
    server.stdout.on('data', onData); server.stderr.on('data', onData);
  });
  url = `http://localhost:${port}/dev/audio-preview.html`;
}

function wav16(left, right, sr) {
  const n = left.length, bytes = n * 4;
  const b = Buffer.alloc(44 + bytes);
  b.write('RIFF', 0); b.writeUInt32LE(36 + bytes, 4); b.write('WAVE', 8);
  b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22);
  b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(bytes, 40);
  const q = (v) => Math.max(-32768, Math.min(32767, Math.round((Number.isFinite(v) ? v : 0) * 32767)));
  for (let i = 0; i < n; i++) { b.writeInt16LE(q(left[i]), 44 + i * 4); b.writeInt16LE(q(right[i]), 46 + i * 4); }
  return b;
}
function wav(left, right, sr) {
  const n = left.length, bytes = n * 2 * 4;
  const b = Buffer.alloc(44 + bytes);
  b.write('RIFF', 0); b.writeUInt32LE(36 + bytes, 4); b.write('WAVE', 8);
  b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(3, 20); b.writeUInt16LE(2, 22);
  b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 8, 28); b.writeUInt16LE(8, 32); b.writeUInt16LE(32, 34);
  b.write('data', 36); b.writeUInt32LE(bytes, 40);
  for (let i = 0; i < n; i++) { b.writeFloatLE(left[i], 44 + i * 8); b.writeFloatLE(right[i], 48 + i * 8); }
  return b;
}
const f32 = (b64) => { const buf = Buffer.from(b64, 'base64'); return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4); };

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
  await page.goto(url);
  await page.waitForFunction(() => !!window.__audioTest, null, { timeout: 30000 });
  const names = process.argv.slice(2).length ? process.argv.slice(2) : await page.evaluate(() => window.__audioTest.scenarioNames);

  // realtime smoke test: init a real AudioContext (worklet path) and drive it for a second
  const rt = await page.evaluate(async () => {
    const a = window.__audioTest.audio;
    // every method must be a harmless no-op before init()
    let preInitOk = true;
    try {
      const b = new a.constructor();
      const c0 = { rpm: 900, idleRpm: 800, maxRpm: 6500, throttle: 0, load: 0, gear: 1, shifting: false, speed: 0, wheelSlip: [0, 0, 0, 0], wheelSurface: [0, 0, 0, 0], suspensionHit: 0, electricMode: false, cylinders: 4 };
      b.setListener({ position: [0, 0, 0], forward: [0, 0, -1], up: [0, 1, 0], velocity: [0, 0, 0], interior: true, inTunnel: true });
      b.setPlayerVehicle(c0, [0, 0, 0]); b.collision(1, [0, 0, 0], 'glass'); b.setHorn(true); b.playUi('cash');
      b.setIndicatorTicking(true); b.setWipers(2); b.setEnvironment({ hour: 3, rain: 1, thunder: true, trafficDensity: 1, nearRiver: 1, nearPark: 1 });
      b.setTrafficVoices([]); b.hornAt([0, 0, 0], 'angry'); b.siren(1, [0, 0, 0]); b.radioOn(true); b.radioNext(); b.radioPrev();
      b.setVolumes({ master: 0.5 }); b.suspend(); b.resume();
      preInitOk = b.ready === false && b.radioStation === null;
      b.dispose();
    } catch (e) { preInitOk = String(e); }
    await a.init();
    a.resume();
    const car = { rpm: 3000, idleRpm: 800, maxRpm: 6500, throttle: 0.5, load: 0.5, gear: 2, shifting: false, speed: 10, wheelSlip: [0, 0, 0, 0], wheelSurface: [0, 0, 0, 0], suspensionHit: 0, electricMode: false, cylinders: 4 };
    const lis = { position: [0, 2, 6], forward: [0, 0, -1], up: [0, 1, 0], velocity: [0, 0, 0], interior: false, inTunnel: false };
    a.radioOn(true);
    const an = a.getAnalyser(); const buf = new Float32Array(an.fftSize); let peak = 0;
    const t0 = performance.now();
    while (performance.now() - t0 < 1500) {
      a.setListener(lis); a.setPlayerVehicle(car, [0, 0, 0]);
      await new Promise((r) => setTimeout(r, 16));
      an.getFloatTimeDomainData(buf); for (const v of buf) peak = Math.max(peak, Math.abs(v));
    }
    const res = { preInitOk, ready: a.ready, worklet: a.usingWorklet, state: a.context.state, sr: a.context.sampleRate, peak, station: a.radioStation };
    a.dispose();
    return res;
  });
  console.log('realtime smoke test:', JSON.stringify(rt));

  const bench = await page.evaluate(() => window.__audioTest.benchmark());
  console.log('cpu benchmark (ms of CPU per second of audio, offline, one core):', JSON.stringify(bench));
  const meta = { realtime: rt, bench, scenarios: {} };
  for (const name of names) {
    const t0 = Date.now();
    const r = await page.evaluate((n) => window.__audioTest.renderScenarioB64(n), name);
    const L = f32(r.left), R = f32(r.right);
    writeFileSync(resolve(rawDir, `audio-${name}.wav`), wav(L, R, r.sampleRate));
    if (KEEP.has(name)) writeFileSync(resolve(outDir, `audio-${name}.wav`), wav16(L, R, r.sampleRate));
    meta.scenarios[name] = { sampleRate: r.sampleRate, log: r.log, renderMs: Date.now() - t0, seconds: L.length / r.sampleRate };
    console.log(`${name}: ${(L.length / r.sampleRate).toFixed(1)} s rendered in ${Date.now() - t0} ms`);
  }
  writeFileSync(resolve(rawDir, 'audio-render-meta.json'), JSON.stringify(meta));
  if (errors.length) console.log('browser console:\n' + errors.join('\n'));
} finally {
  await browser.close();
  if (server) { try { process.kill(-server.pid, 'SIGTERM'); } catch { server.kill(); } }
}
process.exit(0);
