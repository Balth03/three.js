// Interactive preview of the procedural audio system: sliders for every input, demos (rev sweep, drive
// simulation, traffic, siren pass-by) and a live spectrum. Open /dev/audio-preview.html with `npx vite`.

import { AudioSystem, type ListenerState, type VehicleAudioState } from '../src/audio/AudioSystem';
import { benchmark, renderScenarioB64, renderScenario, scenarioNames } from './audio-scenarios';

const audio = new AudioSystem();
const ui = document.getElementById('ui')!;
const status = document.getElementById('status')!;

// ---- state -----------------------------------------------------------------------------------------
const car: VehicleAudioState = {
  rpm: 800, idleRpm: 800, maxRpm: 6500, throttle: 0, load: 0.05, gear: 1, shifting: false, speed: 0,
  wheelSlip: [0, 0, 0, 0], wheelSurface: [0, 0, 0, 0], suspensionHit: 0, electricMode: false, cylinders: 4,
};
const carPos: [number, number, number] = [0, 0, 0];
const listener: ListenerState = { position: [0, 2.2, 6.5], forward: [0, -0.2, -1], up: [0, 1, 0], velocity: [0, 0, 0], interior: false, inTunnel: false };
const env = { hour: 12, rain: 0, thunder: false, trafficDensity: 0.6, nearRiver: 0, nearPark: 0 };
const p = { slip: 0, surface: 0, mode: 'manual' as 'manual' | 'sweep' | 'drive', keysThrottle: 0, keysBrake: 0 };
type Voice = { id: number; position: [number, number, number]; velocity: [number, number, number]; rpm: number; kind: 'car' | 'scooter' | 'bus' | 'truck' };
const voices: Voice[] = [];
let trafficDemo = false, sirenDemo = -1, sweepT = 0;
const sim = { speed: 0, gear: 1, shiftT: -1 };

// ---- tiny UI helpers --------------------------------------------------------------------------------
function section(title: string, wide = false): HTMLElement {
  const s = document.createElement('section');
  if (wide) s.className = 'wide';
  s.innerHTML = `<h2>${title}</h2>`;
  ui.appendChild(s);
  return s;
}
const sliders = new Map<string, { input: HTMLInputElement; out: HTMLSpanElement }>();
function slider(parent: HTMLElement, label: string, min: number, max: number, step: number, value: number, on: (v: number) => void): void {
  const l = document.createElement('label'); l.className = 'row';
  l.innerHTML = `<span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><span>${value}</span>`;
  const input = l.querySelector('input')!, out = l.querySelectorAll('span')[1] as HTMLSpanElement;
  input.addEventListener('input', () => { const v = parseFloat(input.value); out.textContent = String(+v.toFixed(2)); on(v); });
  sliders.set(label, { input, out });
  parent.appendChild(l);
}
function setSlider(label: string, v: number): void {
  const s = sliders.get(label); if (!s) return;
  s.input.value = String(v); s.out.textContent = String(+v.toFixed(2));
}
function button(parent: HTMLElement, label: string, on: () => void): HTMLButtonElement {
  const b = document.createElement('button'); b.textContent = label; b.addEventListener('click', on); parent.appendChild(b); return b;
}
function check(parent: HTMLElement, label: string, value: boolean, on: (v: boolean) => void): void {
  const l = document.createElement('label');
  l.innerHTML = `<input type="checkbox" ${value ? 'checked' : ''}> ${label}`;
  l.querySelector('input')!.addEventListener('change', (e) => on((e.target as HTMLInputElement).checked));
  parent.appendChild(l);
}

// ---- engine ---------------------------------------------------------------------------------------
const se = section('Engine');
const modeSel = document.createElement('select');
modeSel.innerHTML = '<option value="manual">Manual sliders</option><option value="sweep">Rev sweep demo</option><option value="drive">Drive sim (W/S or ↑/↓)</option>';
modeSel.addEventListener('change', () => { p.mode = modeSel.value as typeof p.mode; sweepT = 0; sim.speed = 0; sim.gear = 1; });
se.appendChild(modeSel);
slider(se, 'rpm', 0, 7000, 10, car.rpm, (v) => { car.rpm = v; });
slider(se, 'throttle', 0, 1, 0.01, 0, (v) => { car.throttle = v; });
slider(se, 'load', -1, 1, 0.01, 0.05, (v) => { car.load = v; });
slider(se, 'cylinders', 1, 8, 1, 4, (v) => { car.cylinders = v; });
const ce = document.createElement('div'); ce.className = 'checks'; se.appendChild(ce);
check(ce, 'shifting', false, (v) => { car.shifting = v; });
check(ce, 'EV mode', false, (v) => { car.electricMode = v; });

const st = section('Tyres & road');
slider(st, 'speed m/s', 0, 60, 0.1, 0, (v) => { car.speed = v; });
slider(st, 'slip', 0, 1.5, 0.01, 0, (v) => { p.slip = v; });
const surf = document.createElement('select');
surf.innerHTML = '<option value="0">Asphalt</option><option value="1">Cobbles (pavé)</option><option value="2">Gravel</option><option value="3">Grass</option>';
surf.addEventListener('change', () => { p.surface = +surf.value; });
st.appendChild(surf);
button(st, 'Pothole', () => { car.suspensionHit = 0.9; });

const sv = section('View');
const vc = document.createElement('div'); vc.className = 'checks'; sv.appendChild(vc);
check(vc, 'Interior (cockpit)', false, (v) => { listener.interior = v; });
check(vc, 'In tunnel', false, (v) => { listener.inTunnel = v; });

const sa = section('Environment');
slider(sa, 'hour', 0, 24, 0.1, env.hour, (v) => { env.hour = v; audio.setEnvironment(env); });
slider(sa, 'rain', 0, 1, 0.01, 0, (v) => { env.rain = v; audio.setEnvironment(env); });
slider(sa, 'traffic', 0, 1, 0.01, env.trafficDensity, (v) => { env.trafficDensity = v; audio.setEnvironment(env); });
slider(sa, 'near river', 0, 1, 0.01, 0, (v) => { env.nearRiver = v; audio.setEnvironment(env); });
slider(sa, 'near park', 0, 1, 0.01, 0, (v) => { env.nearPark = v; audio.setEnvironment(env); });
const ac = document.createElement('div'); ac.className = 'checks'; sa.appendChild(ac);
check(ac, 'thunder', false, (v) => { env.thunder = v; audio.setEnvironment(env); });

const sr = section('Radio');
const stationLabel = document.createElement('div'); stationLabel.style.margin = '4px 0 6px'; stationLabel.textContent = 'off';
sr.appendChild(stationLabel);
let radioOn = false;
const refreshStation = (): void => { const s = audio.radioStation; stationLabel.textContent = s ? `${s.name} — ${s.genre}` : 'off'; };
button(sr, 'On / Off', () => { radioOn = !radioOn; audio.radioOn(radioOn); refreshStation(); });
button(sr, '◀ Prev', () => { audio.radioPrev(); refreshStation(); });
button(sr, 'Next ▶', () => { audio.radioNext(); refreshStation(); });

const sx = section('SFX');
const hornBtn = button(sx, 'Horn (hold / H)', () => undefined);
hornBtn.addEventListener('pointerdown', () => audio.setHorn(true));
hornBtn.addEventListener('pointerup', () => audio.setHorn(false));
hornBtn.addEventListener('pointerleave', () => audio.setHorn(false));
for (const m of ['metal', 'concrete', 'wood', 'glass', 'plastic'] as const) button(sx, `Hit ${m}`, () => audio.collision(0.5 + Math.random() * 0.5, [2, 0, -3], m));
button(sx, 'AI horn car', () => audio.hornAt([-8, 0, -10], 'car'));
button(sx, 'AI horn bus', () => audio.hornAt([12, 0, -15], 'bus'));
button(sx, 'AI angry', () => audio.hornAt([6, 0, -6], 'angry'));
button(sx, 'Siren pass-by', () => { sirenDemo = 0; });
button(sx, 'Traffic demo', () => { trafficDemo = !trafficDemo; if (!trafficDemo) { voices.length = 0; audio.setTrafficVoices(voices); } });

const su = section('Cabin & UI');
for (const k of ['click', 'notify', 'meterStart', 'meterStop', 'cash', 'rating', 'door', 'indicator'] as const) button(su, k, () => audio.playUi(k));
const cc = document.createElement('div'); cc.className = 'checks'; su.appendChild(cc);
check(cc, 'Indicator', false, (v) => audio.setIndicatorTicking(v));
const wip = document.createElement('select');
wip.innerHTML = '<option value="0">Wipers off</option><option value="1">Wipers slow</option><option value="2">Wipers fast</option>';
wip.addEventListener('change', () => audio.setWipers(+wip.value as 0 | 1 | 2));
su.appendChild(wip);

const smx = section('Mix');
for (const k of ['master', 'engine', 'sfx', 'ambience', 'radio', 'ui'] as const) slider(smx, k, 0, 1.5, 0.01, k === 'radio' ? 0.7 : 0.85, (v) => audio.setVolumes({ [k]: v }));

const sspec = section('Spectrum (post-limiter)', true);
const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 280; sspec.appendChild(canvas);
const meter = document.createElement('div'); meter.style.marginTop = '6px'; meter.style.color = 'var(--muted)'; sspec.appendChild(meter);

const soff = section('Offline renders (deterministic, used by the Playwright test)', true);
for (const n of scenarioNames) button(soff, n, async () => {
  status.textContent = `rendering ${n}…`;
  const r = await renderScenario(n);
  let peak = 0, sum = 0;
  for (let i = 0; i < r.left.length; i++) { const a = Math.abs(r.left[i]); if (a > peak) peak = a; sum += r.left[i] * r.left[i]; }
  status.textContent = `${n}: peak ${peak.toFixed(3)}, rms ${(20 * Math.log10(Math.sqrt(sum / r.left.length) + 1e-9)).toFixed(1)} dBFS`;
  if (audio.context && audio.context instanceof AudioContext) {
    const ctx = audio.context;
    const b = ctx.createBuffer(2, r.left.length, r.sampleRate);
    b.copyToChannel(r.left as Float32Array<ArrayBuffer>, 0); b.copyToChannel(r.right as Float32Array<ArrayBuffer>, 1);
    const s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start();
  }
});

// test hooks for Playwright
(window as unknown as Record<string, unknown>).__audioTest = { scenarioNames, renderScenarioB64, benchmark, audio };

// ---- keyboard -------------------------------------------------------------------------------------
window.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.repeat) return;
  if (e.code === 'KeyW' || e.code === 'ArrowUp') p.keysThrottle = 1;
  if (e.code === 'KeyS' || e.code === 'ArrowDown') p.keysBrake = 1;
  if (e.code === 'KeyH') audio.setHorn(true);
});
window.addEventListener('keyup', (e: KeyboardEvent) => {
  if (e.code === 'KeyW' || e.code === 'ArrowUp') p.keysThrottle = 0;
  if (e.code === 'KeyS' || e.code === 'ArrowDown') p.keysBrake = 0;
  if (e.code === 'KeyH') audio.setHorn(false);
});

// ---- main loop --------------------------------------------------------------------------------------
let last = performance.now();
const ratios = [0, 13.5, 8.6, 6.1, 4.6, 3.7, 3.1];
function frame(nowMs: number): void {
  const dt = Math.min(0.05, (nowMs - last) / 1000); last = nowMs;
  if (p.mode === 'sweep') {
    sweepT += dt;
    const t = sweepT % 12;
    if (t < 2) { car.rpm = 800; car.throttle = 0; car.load = 0.06; }
    else if (t < 8) { car.rpm = 800 + 5700 * (t - 2) / 6; car.throttle = 1; car.load = 0.9; }
    else if (t < 9) { car.rpm = 6450 + 60 * Math.sin(t * 80); car.throttle = 1; car.load = 0.85; }
    else { car.rpm = 1200 + 5250 * Math.exp(-(t - 9) * 2.6 / 3); car.throttle = 0; car.load = -0.6; }
    car.speed = car.rpm / 6500 * 30;
    setSlider('rpm', car.rpm); setSlider('throttle', car.throttle); setSlider('load', car.load); setSlider('speed m/s', car.speed);
  } else if (p.mode === 'drive') {
    const t = nowMs / 1000;
    const shifting = sim.shiftT >= 0 && t - sim.shiftT < 0.25;
    const thr = shifting ? 0 : p.keysThrottle;
    const wheelRpm = (s: number, g: number): number => s * ratios[g] * 60 / (2 * Math.PI * 0.32);
    sim.speed += (thr * 4.2 / Math.sqrt(sim.gear) - p.keysBrake * 9 - 0.0004 * sim.speed * sim.speed - 0.15) * dt;
    sim.speed = Math.max(0, sim.speed);
    let rpm = wheelRpm(sim.speed, sim.gear);
    if (rpm > 6000 && sim.gear < 6 && !shifting) { sim.gear++; sim.shiftT = t; }
    if (rpm < 1600 && sim.gear > 1) sim.gear--;
    rpm = Math.max(car.idleRpm, wheelRpm(sim.speed, sim.gear));
    car.rpm = Math.min(car.maxRpm, rpm); car.throttle = thr; car.gear = sim.gear; car.shifting = shifting; car.speed = sim.speed;
    car.load = thr > 0 ? 0.25 + 0.7 * thr : sim.speed > 3 ? -0.5 : 0.05;
    car.electricMode = sim.speed < 8 && thr < 0.5 && !shifting && sim.speed > 0.1;
    p.slip = p.keysBrake && sim.speed > 5 ? 0.6 : 0;
    setSlider('rpm', car.rpm); setSlider('throttle', car.throttle); setSlider('load', car.load); setSlider('speed m/s', car.speed);
  }
  for (let i = 0; i < 4; i++) { car.wheelSlip[i] = p.slip * (i < 2 ? 1 : 0.8); car.wheelSurface[i] = p.surface; }

  // listener: chase cam 6.5 m behind (+z) or cockpit
  if (listener.interior) { listener.position[0] = 0; listener.position[1] = 1.1; listener.position[2] = 0.2; listener.forward[1] = 0; }
  else { listener.position[0] = 0; listener.position[1] = 2.2; listener.position[2] = 6.5; listener.forward[1] = -0.2; }
  audio.setListener(listener);
  audio.setPlayerVehicle(car, carPos);
  car.suspensionHit = 0;

  if (trafficDemo) {
    if (!voices.length) {
      const kinds: Voice['kind'][] = ['car', 'scooter', 'bus', 'car', 'truck', 'car'];
      kinds.forEach((k, i) => voices.push({ id: 100 + i, position: [0, 0, 0], velocity: [0, 0, 0], rpm: 2000, kind: k }));
    }
    const t = nowMs / 1000;
    voices.forEach((v, i) => {
      const r = 12 + i * 7, w = (i % 2 ? -1 : 1) * (9 + i * 2) / r, a = t * w + i;
      v.position[0] = Math.cos(a) * r; v.position[2] = Math.sin(a) * r - 10;
      v.velocity[0] = -Math.sin(a) * r * w; v.velocity[2] = Math.cos(a) * r * w;
      v.rpm = v.kind === 'scooter' ? 6500 + 1500 * Math.sin(t * 0.7 + i) : 1800 + 900 * Math.sin(t * 0.5 + i);
    });
    audio.setTrafficVoices(voices);
  }
  if (sirenDemo >= 0) {
    sirenDemo += dt;
    const x = -150 + 28 * sirenDemo;
    audio.siren(1, x > 150 ? null : [x, 0, -8]);
    if (x > 150) sirenDemo = -1;
  }
  drawSpectrum();
  requestAnimationFrame(frame);
}

let fft: Float32Array<ArrayBuffer> | null = null;
let wave: Float32Array<ArrayBuffer> | null = null;
function drawSpectrum(): void {
  const an = audio.getAnalyser(); if (!an) return;
  fft ??= new Float32Array(an.frequencyBinCount);
  wave ??= new Float32Array(an.fftSize);
  an.getFloatFrequencyData(fft); an.getFloatTimeDomainData(wave);
  const g = canvas.getContext('2d')!; const W = canvas.width, H = canvas.height;
  g.fillStyle = '#0b0c0f'; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#e3b45a'; g.beginPath();
  const sr = audio.context!.sampleRate;
  for (let x = 0; x < W; x++) {
    const f = 20 * Math.pow(1000, x / W); // 20 Hz .. 20 kHz log
    const bin = Math.min(fft.length - 1, Math.round(f / (sr / 2) * fft.length));
    const y = H - ((fft[bin] + 110) / 100) * H;
    if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.stroke();
  let peak = 0, sum = 0;
  for (let i = 0; i < wave.length; i++) { const a = Math.abs(wave[i]); if (a > peak) peak = a; sum += wave[i] * wave[i]; }
  meter.textContent = `peak ${peak.toFixed(3)} · rms ${(20 * Math.log10(Math.sqrt(sum / wave.length) + 1e-9)).toFixed(1)} dBFS · rpm ${car.rpm.toFixed(0)} · gear ${car.gear} · ${audio.usingWorklet ? 'AudioWorklet engine' : 'fallback engine'}`;
}

document.getElementById('start')!.addEventListener('click', async () => {
  status.textContent = 'starting…';
  await audio.init();
  audio.resume();
  audio.setEnvironment(env);
  status.textContent = audio.ready ? `running · ${audio.usingWorklet ? 'AudioWorklet' : 'fallback'} · ${audio.context!.sampleRate} Hz` : 'failed';
  requestAnimationFrame(frame);
}, { once: true });
