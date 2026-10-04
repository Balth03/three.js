// Deterministic offline renders of the audio system (OfflineAudioContext + suspend/resume every 16 ms
// to emulate the game's per-frame calls). Used by the Playwright test (dev/audio-render.mjs) and the
// "Render offline" buttons of the preview page.

import { AudioSystem, type ListenerState, type VehicleAudioState } from '../src/audio/AudioSystem';
import { VEHICLE_PROCESSOR_NAME, vehicleWorkletSource } from '../src/audio/engineWorklet';

export interface ScenarioResult { sampleRate: number; left: Float32Array; right: Float32Array; log: Record<string, number[]> }

interface Ctx {
  sys: AudioSystem;
  t: number;
  frame: number;
  car: VehicleAudioState;
  carPos: [number, number, number];
  lis: ListenerState;
  log: Record<string, number[]>;
  state: Record<string, number>;
}

interface Scenario {
  duration: number;
  shortTracks?: boolean;
  fallback?: boolean;
  setup?(c: Ctx): void;
  frame(c: Ctx): void;
}

function newCar(): VehicleAudioState {
  return {
    rpm: 800, idleRpm: 800, maxRpm: 6500, throttle: 0, load: 0.05, gear: 1, shifting: false, speed: 0,
    wheelSlip: [0, 0, 0, 0], wheelSurface: [0, 0, 0, 0], suspensionHit: 0, electricMode: false, cylinders: 4,
  };
}
function chaseListener(interior: boolean): ListenerState {
  return interior
    ? { position: [0, 1.1, 0.2], forward: [0, 0, -1], up: [0, 1, 0], velocity: [0, 0, 0], interior: true, inTunnel: false }
    : { position: [0, 2.2, 6.5], forward: [0, -0.2, -1], up: [0, 1, 0], velocity: [0, 0, 0], interior: false, inTunnel: false };
}
const lerp = (a: number, b: number, t: number): number => a + (b - a) * Math.min(1, Math.max(0, t));
/** true on exactly one frame: the one containing time x */
const at = (c: Ctx, x: number): boolean => c.t <= x && c.t + c.frame > x;
/** isolate a bus for level measurements */
const only = (c: Ctx, keep: 'radio' | 'ambience' | 'engine'): void => {
  c.sys.setVolumes(keep === 'radio' ? { engine: 0, ambience: 0 } : keep === 'ambience' ? { engine: 0 } : { ambience: 0 });
};
const push = (c: Ctx, k: string, v: number): void => { (c.log[k] ??= []).push(v); };

/** engine sweep idle -> redline -> limiter -> overrun */
function sweepFrame(c: Ctx): void {
  const t = c.t, car = c.car;
  if (t < 2) { car.rpm = 800 + 15 * Math.sin(t * 9); car.throttle = 0; car.load = 0.06; }
  else if (t < 8) { const u = (t - 2) / 6; car.rpm = 800 + (6500 - 800) * u; car.throttle = 1; car.load = 0.9; }
  else if (t < 9) { car.rpm = 6450 + 60 * Math.sin(t * 80); car.throttle = 1; car.load = 0.85; }
  else { const u = (t - 9) / 3; car.rpm = 1200 + (6450 - 1200) * Math.exp(-u * 2.6); car.throttle = 0; car.load = -0.6; }
  car.speed = (car.rpm / 6500) * 30;
  car.gear = 3;
  push(c, 'rpm', car.rpm);
  push(c, 't', t);
}

const SCENARIOS: Record<string, Scenario> = {
  engine_sweep: { duration: 12, setup: (c) => only(c, 'engine'), frame: sweepFrame },
  engine_interior: { duration: 12, setup: (c) => { only(c, 'engine'); c.lis = chaseListener(true); }, frame: sweepFrame },
  engine_fallback: { duration: 12, fallback: true, setup: (c) => only(c, 'engine'), frame: sweepFrame },
  engine_drive: {
    duration: 16,
    setup: (c) => only(c, 'engine'),
    frame(c) {
      // simple drive cycle: 4 gears with torque-cut shifts, then lift-off and EV crawl
      const car = c.car, s = c.state, dt = c.frame;
      const ratios = [0, 13.5, 8.6, 6.1, 4.6];
      s.gear ??= 1; s.speed ??= 0; s.shiftT ??= -1;
      const t = c.t;
      const accel = t > 0.8 && t < 11;
      const shifting = s.shiftT >= 0 && t - s.shiftT < 0.28;
      const thr = accel ? (shifting ? 0 : 0.85) : 0;
      if (accel && !shifting) s.speed += (3.6 / s.gear) * dt * 1.5;
      else s.speed = Math.max(0, s.speed - (accel ? 0.2 : 1.6) * dt);
      let rpm = Math.max(800, s.speed * ratios[s.gear] * 60 / (2 * Math.PI * 0.32));
      if (accel && rpm > 5600 && s.gear < 4 && !shifting) { s.gear++; s.shiftT = t; }
      if (!accel && rpm < 1400 && s.gear > 1) s.gear--;
      rpm = Math.max(800, s.speed * ratios[s.gear] * 60 / (2 * Math.PI * 0.32));
      car.rpm = rpm; car.throttle = thr; car.load = accel ? (shifting ? 0 : 0.8) : (s.speed > 3 ? -0.5 : 0.05);
      car.gear = s.gear; car.shifting = shifting; car.speed = s.speed;
      car.electricMode = t > 13.5;
      if (car.electricMode) { s.speed = Math.max(4, s.speed); car.speed = s.speed; car.rpm = 0; car.throttle = 0.3; car.load = 0.1; }
      push(c, 'rpm', car.rpm); push(c, 'gear', car.gear); push(c, 't', t);
    },
  },
  tyres: {
    duration: 10,
    setup: (c) => only(c, 'engine'),
    frame(c) {
      const t = c.t, car = c.car;
      car.rpm = 2500; car.throttle = 0.3; car.load = 0.2;
      car.wheelSlip.fill(0); car.wheelSurface.fill(0); car.suspensionHit = 0;
      if (t < 4) { car.speed = 15; const sl = lerp(0, 1.2, t / 4); car.wheelSlip[0] = sl; car.wheelSlip[1] = sl * 0.9; car.wheelSlip[2] = sl * 0.7; car.wheelSlip[3] = sl * 0.6; }
      else if (t < 7) { car.speed = lerp(8, 20, (t - 4) / 3); car.wheelSurface.fill(1); }
      else if (t < 8.5) { car.speed = 12; car.wheelSurface.fill(2); car.wheelSlip.fill(0.5); }
      else { car.speed = 10; car.wheelSurface.fill(3); }
      if (at(c, 1.5) || at(c, 5) || at(c, 9)) car.suspensionHit = 0.9;
      push(c, 't', t); push(c, 'speed', car.speed);
    },
  },
  radio_seine: { duration: 14, setup: (c) => { only(c, 'radio'); c.lis = chaseListener(true); c.sys.radioOn(true); }, frame: () => undefined },
  radio_electro: { duration: 14, setup: (c) => { only(c, 'radio'); c.lis = chaseListener(true); c.sys.radioOn(true); c.sys.radioNext(); }, frame: () => undefined },
  radio_musette: { duration: 14, setup: (c) => { only(c, 'radio'); c.lis = chaseListener(true); c.sys.radioOn(true); c.sys.radioPrev(); }, frame: () => undefined },
  radio_jingle: { duration: 16, shortTracks: true, setup: (c) => { c.lis = chaseListener(true); c.sys.radioOn(true); c.sys.radioPrev(); }, frame: () => undefined },
  radio_exterior: { duration: 6, setup: (c) => { only(c, 'radio'); c.sys.radioOn(true); c.sys.radioNext(); }, frame: () => undefined },
  ambience_day: {
    duration: 12,
    setup: (c) => { only(c, 'ambience'); c.sys.setEnvironment({ hour: 7.5, rain: 0, trafficDensity: 0.7, nearRiver: 0.7, nearPark: 1 }); },
    frame: () => undefined,
  },
  ambience_evening: {
    duration: 12,
    setup: (c) => { only(c, 'ambience'); c.sys.setEnvironment({ hour: 21, rain: 0, trafficDensity: 0.5, nearRiver: 0, nearPark: 0 }); },
    frame: () => undefined,
  },
  ambience_rain_night: {
    duration: 12,
    setup: (c) => { only(c, 'ambience'); c.sys.setEnvironment({ hour: 2, rain: 0.9, thunder: true, trafficDensity: 0.3, nearRiver: 0.2, nearPark: 0 }); },
    frame(c) { if (c.t > 6) c.lis = chaseListener(true); },
  },
  tunnel: {
    duration: 8,
    setup: (c) => only(c, 'engine'),
    frame(c) {
      const car = c.car;
      car.rpm = 3000 + 1500 * Math.sin(c.t * 0.8); car.throttle = 0.6; car.load = 0.5; car.speed = 15;
      c.lis.inTunnel = c.t > 3;
      if (at(c, 5)) c.sys.hornAt([0, 0, -20], 'car');
    },
  },
  horn: {
    duration: 5,
    setup: (c) => { c.sys.radioOn(true); c.sys.setEnvironment({ hour: 12, rain: 0, trafficDensity: 0.8, nearRiver: 0, nearPark: 0 }); },
    frame(c) {
      const t = c.t;
      const on = (t > 1 && t < 2) || (t > 2.4 && t < 2.6) || (t > 2.9 && t < 3.9);
      if (on !== !!c.state.horn) { c.sys.setHorn(on); c.state.horn = on ? 1 : 0; }
      push(c, 'horn', on ? 1 : 0); push(c, 't', t);
    },
  },
  siren_passby: {
    duration: 10,
    setup: (c) => { c.lis = { ...chaseListener(false), position: [0, 1.5, 0], forward: [0, 0, -1] }; },
    frame(c) {
      const x = -125 + 25 * c.t;
      c.sys.siren(7, [x, 0, -8]);
      push(c, 'x', x); push(c, 't', c.t);
    },
  },
  traffic_passby: {
    duration: 10,
    setup: (c) => { c.lis = { ...chaseListener(false), position: [0, 1.5, 0], forward: [0, 0, -1] }; },
    frame(c) {
      const t = c.t;
      const v = c.state as unknown as { voices?: Array<{ id: number; position: [number, number, number]; velocity: [number, number, number]; rpm: number; kind: 'car' | 'scooter' | 'bus' | 'truck' }> };
      v.voices ??= [
        { id: 1, position: [0, 0, 0], velocity: [16, 0, 0], rpm: 2800, kind: 'car' },
        { id: 2, position: [0, 0, 0], velocity: [-13, 0, 0], rpm: 7000, kind: 'scooter' },
        { id: 3, position: [0, 0, 0], velocity: [9, 0, 0], rpm: 1500, kind: 'bus' },
      ];
      const vs = v.voices;
      vs[0].position[0] = -80 + 16 * t; vs[0].position[2] = -6;
      vs[1].position[0] = 70 - 13 * t; vs[1].position[2] = -3; vs[1].rpm = 6500 + 800 * Math.sin(t);
      vs[2].position[0] = -50 + 9 * t; vs[2].position[2] = -12;
      c.sys.setTrafficVoices(vs);
      if (at(c, 6)) c.sys.hornAt([10, 0, -6], 'angry');
      if (at(c, 3)) c.sys.hornAt([-20, 0, -12], 'bus');
    },
  },
  collisions: {
    duration: 7,
    setup: (c) => { c.lis = { ...chaseListener(false), position: [0, 1.5, 0] }; },
    frame(c) {
      const mats = ['metal', 'concrete', 'wood', 'glass', 'plastic'] as const;
      for (let i = 0; i < mats.length; i++) if (at(c, (0.5 + i * 1.2))) c.sys.collision(0.85, [3, 0, -4], mats[i]);
      if (at(c, 6.4)) c.sys.collision(0.2, [-3, 0, -4], 'metal');
    },
  },
  ui: {
    duration: 10,
    setup: (c) => { c.lis = chaseListener(true); c.sys.setEnvironment({ hour: 12, rain: 0.6, trafficDensity: 0.4, nearRiver: 0, nearPark: 0 }); },
    frame(c) {
      const kinds = ['click', 'notify', 'meterStart', 'meterStop', 'cash', 'rating', 'door', 'indicator'] as const;
      for (let i = 0; i < kinds.length; i++) if (at(c, (0.3 + i * 0.6))) c.sys.playUi(kinds[i]);
      if (at(c, 5.2)) c.sys.setIndicatorTicking(true);
      if (at(c, 7.2)) { c.sys.setIndicatorTicking(false); c.sys.setWipers(1); }
      if (at(c, 8.6)) c.sys.setWipers(2);
    },
  },
  full_mix: {
    duration: 12,
    setup: (c) => {
      c.sys.radioOn(true); c.sys.radioNext();
      c.sys.setEnvironment({ hour: 18.5, rain: 1, thunder: true, trafficDensity: 1, nearRiver: 1, nearPark: 1 });
      c.sys.setWipers(2);
    },
    frame(c) {
      sweepFrame(c);
      const t = c.t, car = c.car;
      car.wheelSlip.fill(t > 4 && t < 6 ? 1.1 : 0);
      car.wheelSurface.fill(t > 6 && t < 8 ? 1 : 0);
      const on = t > 3 && t < 4.5;
      if (on !== !!c.state.horn) { c.sys.setHorn(on); c.state.horn = on ? 1 : 0; }
      c.sys.siren(3, [-60 + 15 * t, 0, -10]);
      if (at(c, 5)) c.sys.collision(1, [2, 0, -3], 'metal');
      if (at(c, 5.05)) c.sys.collision(1, [2, 0, -3], 'glass');
      if (at(c, 9)) c.sys.playUi('cash');
      if (at(c, 7)) c.lis = chaseListener(true);
    },
  },
};

export const scenarioNames = Object.keys(SCENARIOS);

export async function renderScenario(name: string, sampleRate = 48000): Promise<ScenarioResult> {
  const sc = SCENARIOS[name];
  if (!sc) throw new Error('unknown scenario ' + name);
  const len = Math.ceil(sc.duration * sampleRate);
  const ctx = new OfflineAudioContext({ numberOfChannels: 2, length: len, sampleRate });
  const sys = new AudioSystem();
  await sys.init({ context: ctx, seed: 42, radioShortTracks: !!sc.shortTracks, forceFallback: !!sc.fallback });
  if (!sys.ready) throw new Error('audio system failed to init');
  const frame = 768 / sampleRate; // 6 render quanta ≈ 16 ms
  const c: Ctx = { sys, t: 0, frame, car: newCar(), carPos: [0, 0, 0], lis: chaseListener(false), log: { usingWorklet: [sys.usingWorklet ? 1 : 0] }, state: {} };
  const step = (): void => {
    sc.frame(c);
    sys.setListener(c.lis);
    sys.setPlayerVehicle(c.car, c.carPos);
  };
  sc.setup?.(c);
  step();
  const n = Math.floor((len - 128) / 768);
  for (let i = 1; i < n; i++) {
    const t = i * frame;
    void ctx.suspend(t).then(() => { c.t = t; step(); void ctx.resume(); });
  }
  const buf = await ctx.startRendering();
  sys.dispose();
  return { sampleRate, left: buf.getChannelData(0), right: buf.getChannelData(1), log: c.log };
}

function toB64(a: Float32Array): string {
  const u8 = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  let s = '';
  const CH = 0x8000;
  for (let i = 0; i < u8.length; i += CH) s += String.fromCharCode.apply(null, Array.from(u8.subarray(i, i + CH)));
  return btoa(s);
}

/** Test hook used by Playwright. */
export async function renderScenarioB64(name: string): Promise<{ sampleRate: number; left: string; right: string; log: Record<string, number[]> }> {
  const r = await renderScenario(name);
  return { sampleRate: r.sampleRate, left: toB64(r.left), right: toB64(r.right), log: r.log };
}

// ---------------------------------------------------------------------------------------------------
// CPU benchmarks: render without suspends and compare wall time with audio time.

export async function benchmark(): Promise<Record<string, number>> {
  const sr = 48000, secs = 30;
  const out: Record<string, number> = {};
  // (a) the vehicle worklet alone, all layers active (WOT + squeal + cobbles + turbo)
  {
    const ctx = new OfflineAudioContext({ numberOfChannels: 2, length: sr * secs, sampleRate: sr });
    const url = URL.createObjectURL(new Blob([vehicleWorkletSource()], { type: 'application/javascript' }));
    await ctx.audioWorklet.addModule(url);
    const node = new AudioWorkletNode(ctx, VEHICLE_PROCESSOR_NAME, { numberOfInputs: 0, outputChannelCount: [4] });
    const set = (k: string, v: number): void => { node.parameters.get(k)!.value = v; };
    set('rpm', 4500); set('throttle', 1); set('load', 0.9); set('speed', 20); set('squealF', 0.8); set('squealR', 0.6);
    set('cobble', 0.5); set('gravel', 0.25); set('scrub', 0.3); set('wet', 1); set('ev', 0);
    node.connect(ctx.destination);
    const t0 = performance.now();
    await ctx.startRendering();
    out.workletMsPerSec = (performance.now() - t0) / secs;
  }
  // (b) the complete graph: engine, 8 traffic voices, 2 sirens, rain+thunder ambience, reverbs, HRTF panners
  {
    const ctx = new OfflineAudioContext({ numberOfChannels: 2, length: sr * secs, sampleRate: sr });
    const sys = new AudioSystem();
    await sys.init({ context: ctx, seed: 1 });
    const car = newCar();
    car.rpm = 4500; car.throttle = 1; car.load = 0.9; car.speed = 20; car.wheelSlip.fill(0.8); car.wheelSurface.fill(1);
    sys.setListener(chaseListener(false));
    sys.setPlayerVehicle(car, [0, 0, 0]);
    sys.setEnvironment({ hour: 20, rain: 1, thunder: true, trafficDensity: 1, nearRiver: 1, nearPark: 1 });
    const kinds = ['car', 'scooter', 'bus', 'truck'] as const;
    sys.setTrafficVoices(Array.from({ length: 8 }, (_, i) => ({ id: i, position: [i * 6 - 20, 0, -10] as [number, number, number], velocity: [10, 0, 0] as [number, number, number], rpm: 2500, kind: kinds[i % 4] })));
    sys.siren(1, [30, 0, -20]); sys.siren(2, [-30, 0, -20]);
    sys.setWipers(2); sys.setIndicatorTicking(true);
    const t0 = performance.now();
    await ctx.startRendering();
    out.fullGraphMsPerSec = (performance.now() - t0) / secs;
    sys.dispose();
  }
  return out;
}
