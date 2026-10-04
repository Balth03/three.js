// Procedurally generated AudioBuffers (noise beds, drum one-shots, rain textures, impulse responses).
// Generated once at init with plain math: there are no audio assets anywhere in the game.

import { Rng } from './util';

/** Tiny offline biquad (RBJ) for buffer generation. */
class OfflineBiquad {
  private b0 = 1; private b1 = 0; private b2 = 0; private a1 = 0; private a2 = 0;
  private z1 = 0; private z2 = 0;
  constructor(private sr: number) {}
  set(type: 'lp' | 'hp' | 'bp', f: number, q: number): this {
    const w = (2 * Math.PI * Math.min(f, this.sr * 0.45)) / this.sr;
    const cw = Math.cos(w), sw = Math.sin(w), al = sw / (2 * q);
    let b0: number, b1: number, b2: number;
    const a0 = 1 + al;
    if (type === 'lp') { b0 = (1 - cw) / 2; b1 = 1 - cw; b2 = (1 - cw) / 2; }
    else if (type === 'hp') { b0 = (1 + cw) / 2; b1 = -(1 + cw); b2 = (1 + cw) / 2; }
    else { b0 = al; b1 = 0; b2 = -al; }
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0;
    this.a1 = (-2 * cw) / a0; this.a2 = (1 - al) / a0;
    return this;
  }
  run(x: number): number {
    const y = this.b0 * x + this.z1;
    this.z1 = this.b1 * x - this.a1 * y + this.z2;
    this.z2 = this.b2 * x - this.a2 * y;
    return y;
  }
}

export interface AudioBuffers {
  white: AudioBuffer;      // 2 s stereo
  pink: AudioBuffer;       // 4 s stereo
  brown: AudioBuffer;      // 4 s stereo
  rainGround: AudioBuffer; // 6 s stereo
  rainRoof: AudioBuffer;   // 6 s stereo
  kickHouse: AudioBuffer;
  kickJazz: AudioBuffer;
  snareBrush: AudioBuffer;
  brushSwish: AudioBuffer;
  ride: AudioBuffer;
  hatClosed: AudioBuffer;
  hatOpen: AudioBuffer;
  clap: AudioBuffer;
  shaker: AudioBuffer;
  rim: AudioBuffer;
  plateIR: AudioBuffer;
  tunnelIR: AudioBuffer;
}

function normalize(data: Float32Array, peak: number): void {
  let m = 0;
  for (let i = 0; i < data.length; i++) { const a = Math.abs(data[i]); if (a > m) m = a; }
  if (m > 0) { const g = peak / m; for (let i = 0; i < data.length; i++) data[i] *= g; }
}

/**
 * Build a seamless loop: `raw` holds n+fade samples; the last `fade` samples are crossfaded into the
 * head so that sample n-1 flows continuously into sample 0. Returns the n-sample loop.
 */
function loopify(raw: Float32Array, fade: number): Float32Array<ArrayBuffer> {
  const n = raw.length - fade;
  const out = new Float32Array(n);
  out.set(raw.subarray(0, n));
  for (let j = 0; j < fade; j++) {
    const t = j / fade;
    out[j] = raw[j] * t + raw[n + j] * (1 - t);
  }
  return out;
}

export function generateBuffers(ctx: BaseAudioContext, seed = 1234): AudioBuffers {
  const sr = ctx.sampleRate;
  const rng = new Rng(seed);
  const buf = (sec: number, ch = 1): AudioBuffer => ctx.createBuffer(ch, Math.max(1, Math.floor(sec * sr)), sr);

  // --- Noise beds -------------------------------------------------------------------------------
  const white = buf(2, 2);
  for (let c = 0; c < 2; c++) { const d = white.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] = rng.next() * 2 - 1; }

  const pink = buf(4, 2);
  for (let c = 0; c < 2; c++) {
    const d = new Float32Array(pink.length + 2048);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < d.length; i++) {
      const w = rng.next() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
      d[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362; b6 = w * 0.115926;
    }
    { const o = loopify(d, 2048); normalize(o, 0.9); pink.copyToChannel(o, c); }
  }

  const brown = buf(4, 2);
  for (let c = 0; c < 2; c++) {
    const d = new Float32Array(brown.length + 4096);
    let last = 0;
    for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (rng.next() * 2 - 1)) / 1.02; d[i] = last; }
    // remove DC drift
    let mean = 0; for (let i = 0; i < d.length; i++) mean += d[i]; mean /= d.length;
    for (let i = 0; i < d.length; i++) d[i] -= mean;
    { const o = loopify(d, 4096); normalize(o, 0.9); brown.copyToChannel(o, c); }
  }

  // --- Rain textures ----------------------------------------------------------------------------
  const rainGround = buf(6, 2);
  for (let c = 0; c < 2; c++) {
    const d = new Float32Array(rainGround.length + 4096);
    const hp = new OfflineBiquad(sr).set('hp', 900, 0.6);
    const lp = new OfflineBiquad(sr).set('lp', 9000, 0.6);
    for (let i = 0; i < d.length; i++) d[i] = lp.run(hp.run(rng.next() * 2 - 1)) * 0.25;
    // droplets: tiny damped sines / clicks
    const drops = Math.floor(6 * 900);
    for (let k = 0; k < drops; k++) {
      const p = Math.floor(rng.next() * (d.length - 2000));
      const f = 1800 + rng.next() * 5000;
      const a = 0.05 + rng.next() * rng.next() * 0.5;
      const tau = 0.0015 + rng.next() * 0.004;
      const len = Math.floor(tau * 6 * sr);
      for (let j = 0; j < len; j++) {
        const t = j / sr;
        d[p + j] += a * Math.exp(-t / tau) * Math.sin(2 * Math.PI * f * t * (1 - t * 20));
      }
    }
    { const o = loopify(d, 4096); normalize(o, 0.8); rainGround.copyToChannel(o, c); }
  }

  const rainRoof = buf(6, 2);
  for (let c = 0; c < 2; c++) {
    const d = new Float32Array(rainRoof.length + 4096);
    const lp = new OfflineBiquad(sr).set('lp', 2500, 0.7);
    const lp2 = new OfflineBiquad(sr).set('lp', 300, 0.7);
    for (let i = 0; i < d.length; i++) { const w = rng.next() * 2 - 1; d[i] = lp.run(w) * 0.12 + lp2.run(w) * 0.25; }
    // drumming on the roof panel: resonant "tok" impacts (panel modes) of varied size
    const drops = Math.floor(6 * 520);
    for (let k = 0; k < drops; k++) {
      const p = Math.floor(rng.next() * (d.length - 4000));
      const big = rng.next();
      const f1 = 180 + rng.next() * 380;
      const f2 = 900 + rng.next() * 1600;
      const a = (0.08 + big * big * 0.6);
      const tau1 = 0.006 + big * 0.012, tau2 = 0.002 + rng.next() * 0.002;
      const len = Math.floor(tau1 * 6 * sr);
      for (let j = 0; j < len; j++) {
        const t = j / sr;
        d[p + j] += a * (Math.exp(-t / tau1) * Math.sin(2 * Math.PI * f1 * t) * 0.8 + Math.exp(-t / tau2) * Math.sin(2 * Math.PI * f2 * t) * 0.5);
      }
    }
    { const o = loopify(d, 4096); normalize(o, 0.8); rainRoof.copyToChannel(o, c); }
  }

  // --- Drum one-shots ---------------------------------------------------------------------------
  const kickHouse = buf(0.5);
  {
    const d = kickHouse.getChannelData(0); let ph = 0;
    for (let i = 0; i < d.length; i++) {
      const t = i / sr;
      const f = 46 + 110 * Math.exp(-t / 0.035) + 300 * Math.exp(-t / 0.004);
      ph += (2 * Math.PI * f) / sr;
      const env = Math.exp(-t / 0.28) * Math.min(1, t / 0.001);
      d[i] = Math.tanh(Math.sin(ph) * env * 1.6) + (rng.next() * 2 - 1) * Math.exp(-t / 0.0025) * 0.25;
    }
    normalize(d, 0.95);
  }
  const kickJazz = buf(0.35);
  {
    const d = kickJazz.getChannelData(0); let ph = 0;
    const lp = new OfflineBiquad(sr).set('lp', 900, 0.7);
    for (let i = 0; i < d.length; i++) {
      const t = i / sr;
      const f = 58 + 40 * Math.exp(-t / 0.03);
      ph += (2 * Math.PI * f) / sr;
      d[i] = Math.sin(ph) * Math.exp(-t / 0.13) * Math.min(1, t / 0.003) + lp.run(rng.next() * 2 - 1) * Math.exp(-t / 0.01) * 0.3;
    }
    normalize(d, 0.8);
  }
  const snareBrush = buf(0.45);
  {
    const d = snareBrush.getChannelData(0);
    const bp = new OfflineBiquad(sr).set('bp', 3500, 0.5);
    const lp = new OfflineBiquad(sr).set('lp', 7000, 0.7);
    for (let i = 0; i < d.length; i++) {
      const t = i / sr;
      const env = Math.min(1, t / 0.004) * (Math.exp(-t / 0.06) * 0.7 + Math.exp(-t / 0.22) * 0.3);
      d[i] = lp.run(bp.run(rng.next() * 2 - 1)) * env + Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t / 0.03) * 0.15;
    }
    normalize(d, 0.8);
  }
  const brushSwish = buf(0.5);
  {
    const d = brushSwish.getChannelData(0);
    const bp = new OfflineBiquad(sr).set('bp', 4500, 0.7);
    for (let i = 0; i < d.length; i++) {
      const t = i / sr;
      const env = Math.sin(Math.PI * Math.min(1, t / 0.45)) ** 2;
      d[i] = bp.run(rng.next() * 2 - 1) * env;
    }
    normalize(d, 0.6);
  }
  const metallic = (len: number, tau: number, hpF: number, freqs: number[], noiseMix: number): AudioBuffer => {
    const b = buf(len);
    const d = b.getChannelData(0);
    const hp = new OfflineBiquad(sr).set('hp', hpF, 0.7);
    const hp2 = new OfflineBiquad(sr).set('hp', hpF, 0.7);
    const phases = freqs.map(() => rng.next());
    for (let i = 0; i < d.length; i++) {
      const t = i / sr;
      let s = 0;
      for (let k = 0; k < freqs.length; k++) { const p = (phases[k] + freqs[k] * t) % 1; s += p < 0.5 ? 1 : -1; }
      s = s / freqs.length + (rng.next() * 2 - 1) * noiseMix;
      d[i] = hp2.run(hp.run(s)) * Math.exp(-t / tau) * Math.min(1, t / 0.0008);
    }
    normalize(d, 0.7);
    return b;
  };
  const metalFreqs = [205.3, 304.4, 369.6, 522.7, 540, 800];
  const hatClosed = metallic(0.12, 0.022, 7000, metalFreqs.map((f) => f * 1.6), 0.6);
  const hatOpen = metallic(0.6, 0.18, 6500, metalFreqs.map((f) => f * 1.6), 0.6);
  const ride = (() => {
    const b = buf(2.2);
    const d = b.getChannelData(0);
    const freqs = [312, 497, 745, 1043, 1414, 1888, 2541, 3127, 3891, 4420, 5210, 6370];
    const amps = freqs.map(() => 0.3 + rng.next());
    const taus = freqs.map((f) => 0.5 + 1.2 * rng.next() * (1000 / (f + 500)));
    const hp = new OfflineBiquad(sr).set('hp', 2500, 0.7);
    for (let i = 0; i < d.length; i++) {
      const t = i / sr;
      let s = 0;
      for (let k = 0; k < freqs.length; k++) s += amps[k] * Math.sin(2 * Math.PI * freqs[k] * t * (1 + 0.002 * Math.sin(t * 7))) * Math.exp(-t / taus[k]);
      const n = hp.run(rng.next() * 2 - 1) * (Math.exp(-t / 0.02) * 0.8 + Math.exp(-t / 0.6) * 0.25);
      d[i] = (s * 0.12 + n) * Math.min(1, t / 0.0005);
    }
    normalize(d, 0.6);
    return b;
  })();
  const clap = buf(0.4);
  {
    const d = clap.getChannelData(0);
    const bp = new OfflineBiquad(sr).set('bp', 1300, 0.9);
    const offsets = [0, 0.009, 0.019, 0.031];
    for (let i = 0; i < d.length; i++) {
      const t = i / sr;
      let env = 0;
      for (let k = 0; k < offsets.length; k++) { const tt = t - offsets[k]; if (tt >= 0) env += Math.exp(-tt / (k === 3 ? 0.11 : 0.006)) * (k === 3 ? 0.9 : 0.7); }
      d[i] = bp.run(rng.next() * 2 - 1) * env;
    }
    normalize(d, 0.8);
  }
  const shaker = buf(0.15);
  {
    const d = shaker.getChannelData(0);
    const hp = new OfflineBiquad(sr).set('hp', 5000, 0.7);
    for (let i = 0; i < d.length; i++) { const t = i / sr; d[i] = hp.run(rng.next() * 2 - 1) * Math.min(1, t / 0.012) * Math.exp(-t / 0.035); }
    normalize(d, 0.6);
  }
  const rim = buf(0.12);
  {
    const d = rim.getChannelData(0);
    const bp = new OfflineBiquad(sr).set('bp', 1800, 3);
    for (let i = 0; i < d.length; i++) {
      const t = i / sr;
      d[i] = (Math.sin(2 * Math.PI * 820 * t) * 0.6 + bp.run(rng.next() * 2 - 1)) * Math.exp(-t / 0.012);
    }
    normalize(d, 0.6);
  }

  // --- Impulse responses ------------------------------------------------------------------------
  const makeIR = (sec: number, decay: number, damp0: number, damp1: number, early: Array<[number, number]>, predelay: number): AudioBuffer => {
    const b = buf(sec, 2);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      let lpState = 0;
      const pd = Math.floor(predelay * sr);
      for (let i = pd; i < d.length; i++) {
        const t = (i - pd) / sr;
        const damp = damp0 + (damp1 - damp0) * Math.min(1, t / sec);
        const coef = Math.exp((-2 * Math.PI * damp) / sr);
        lpState = (1 - coef) * (rng.next() * 2 - 1) + coef * lpState;
        d[i] = lpState * Math.exp(-t / decay) * Math.min(1, t / 0.004);
      }
      for (const [t, a] of early) {
        const p = Math.floor((t + (c ? 0.0021 : 0)) * sr);
        if (p < d.length) d[p] += a * (c ? -1 : 1) * (rng.next() < 0.5 ? 1 : 0.8);
      }
      normalize(d, 0.5);
    }
    return b;
  };
  const plateIR = makeIR(1.8, 0.42, 9000, 2500, [], 0.012);
  const tunnelIR = makeIR(3.2, 0.9, 4000, 900, [[0.03, 0.6], [0.061, 0.5], [0.092, 0.42], [0.124, 0.35], [0.156, 0.3], [0.19, 0.24]], 0.015);

  return { white, pink, brown, rainGround, rainRoof, kickHouse, kickJazz, snareBrush, brushSwish, ride, hatClosed, hatOpen, clap, shaker, rim, plateIR, tunnelIR };
}

/** Start a looping buffer source at a random offset (decorrelates multiple users of the same noise). */
export function loopSource(ctx: BaseAudioContext, b: AudioBuffer, rngOffset: number, rate = 1): AudioBufferSourceNode {
  const s = ctx.createBufferSource();
  s.buffer = b;
  s.loop = true;
  s.playbackRate.value = rate;
  s.start(ctx.currentTime, (rngOffset % 1) * b.duration);
  return s;
}
