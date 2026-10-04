// Small shared helpers for the audio system. Everything here is allocation-free.

export type Vec3 = [number, number, number];

export const SPEED_OF_SOUND = 343;

export function clamp(x: number, lo: number, hi: number): number {
  return x < lo ? lo : x > hi ? hi : x;
}

export function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothstep(e0: number, e1: number, x: number): number {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

export function dbToGain(db: number): number {
  return Math.pow(10, db / 20);
}

export function midiToHz(m: number): number {
  return 440 * Math.pow(2, (m - 69) / 12);
}

/** Smoothly move an AudioParam towards a value (time constant in seconds). Safe against NaN. */
export function glide(p: AudioParam, v: number, now: number, tc: number): void {
  if (!Number.isFinite(v)) return;
  p.setTargetAtTime(v, now, tc);
}

/** Immediately jump (cancels pending automation). */
export function jump(p: AudioParam, v: number, now: number): void {
  p.cancelScheduledValues(now);
  p.setValueAtTime(v, now);
}

const hasPannerParams = typeof PannerNode !== 'undefined' && 'positionX' in PannerNode.prototype;

/**
 * Set a PannerNode position. Uses plain `.value` writes on purpose: any automation (setTargetAtTime,
 * ramps) on panner or listener positions switches Chrome's HRTF panner to its per-sample path, which
 * roughly doubles its cost. The HRTF panner crossfades kernels internally, so frame-rate updates are
 * click-free.
 */
export function setPannerPosition(p: PannerNode, x: number, y: number, z: number): void {
  if (!Number.isFinite(x + y + z)) return;
  if (hasPannerParams) {
    p.positionX.value = x;
    p.positionY.value = y;
    p.positionZ.value = z;
  } else {
    (p as unknown as { setPosition(x: number, y: number, z: number): void }).setPosition(x, y, z);
  }
}
export const setPannerPositionNow = setPannerPosition;

/**
 * Connects `node` to `dest` only while needed. Web Audio renders by pulling from the destination, so a
 * disconnected sub-graph (oscillators, filters, HRTF panners, convolvers upstream of `node`) costs
 * nothing. `closeAfter` lets a fade-out finish before disconnecting; call `update(now)` regularly.
 */
export class Gate {
  private connected = false;
  private offAt = -1;
  constructor(private node: AudioNode, private dest: AudioNode | AudioNode[], open = false) { if (open) this.open(); }
  get isOpen(): boolean { return this.connected; }
  open(): void {
    if (!this.connected) {
      if (Array.isArray(this.dest)) for (let i = 0; i < this.dest.length; i++) this.node.connect(this.dest[i]);
      else this.node.connect(this.dest);
      this.connected = true;
    }
    this.offAt = -1;
  }
  /** keep open at least until `until`, then close (unless re-opened) */
  openUntil(until: number): void { this.open(); this.offAt = until; }
  closeAfter(t: number): void { if (this.connected && this.offAt < 0) this.offAt = t; }
  update(now: number): void {
    if (this.offAt >= 0 && now >= this.offAt) {
      if (Array.isArray(this.dest)) for (let i = 0; i < this.dest.length; i++) this.node.disconnect(this.dest[i]);
      else this.node.disconnect(this.dest);
      this.connected = false;
      this.offAt = -1;
    }
  }
}

/**
 * Lightweight stereo reverb from native nodes (4 damped feedback combs after allpass diffusion,
 * alternately panned L/R): ~15 cheap nodes instead of a ConvolverNode. `rt60` in seconds.
 * (DelayNode inputs sum their connections, so each comb is just delay -> lowpass -> feedback gain.)
 */
export function makeLightReverb(ctx: BaseAudioContext, rt60: number, damp: number, delaysMs: number[] = [31.3, 37.9, 44.1, 53.7]): { input: AudioNode; output: ChannelMergerNode } {
  const pre = ctx.createBiquadFilter(); pre.type = 'allpass'; pre.frequency.value = 900; pre.Q.value = 0.6;
  const pre2 = ctx.createBiquadFilter(); pre2.type = 'allpass'; pre2.frequency.value = 2600; pre2.Q.value = 0.5;
  pre.connect(pre2);
  const output = ctx.createChannelMerger(2);
  delaysMs.forEach((ms, i) => {
    const d = ctx.createDelay(0.2); d.delayTime.value = ms / 1000;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = damp; lp.Q.value = 0.5;
    const fb = ctx.createGain(); fb.gain.value = Math.pow(10, (-3 * ms) / 1000 / rt60);
    pre2.connect(d);
    d.connect(lp).connect(fb).connect(d);
    lp.connect(output, 0, i % 2);
  });
  return { input: pre, output };
}

export function makePanner(ctx: BaseAudioContext, refDistance: number, rolloff = 1, maxDistance = 400): PannerNode {
  const p = ctx.createPanner();
  p.panningModel = 'HRTF';
  p.distanceModel = 'inverse';
  p.refDistance = refDistance;
  p.rolloffFactor = rolloff;
  p.maxDistance = maxDistance;
  return p;
}

/**
 * Doppler factor f'/f for a source and a listener (velocities in m/s), computed manually because the
 * native Web Audio doppler was removed. Clamped to a sane range.
 */
export function dopplerFactor(
  sp: ArrayLike<number>, sv: ArrayLike<number>,
  lp: ArrayLike<number>, lv: ArrayLike<number>,
): number {
  let dx = sp[0] - lp[0], dy = sp[1] - lp[1], dz = sp[2] - lp[2];
  const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (d < 1e-3) return 1;
  dx /= d; dy /= d; dz /= d; // unit vector listener -> source
  // Positive vs = source moving away from listener; positive vl = listener moving towards source.
  const vs = clamp(sv[0] * dx + sv[1] * dy + sv[2] * dz, -SPEED_OF_SOUND * 0.5, SPEED_OF_SOUND * 0.5);
  const vl = clamp(lv[0] * dx + lv[1] * dy + lv[2] * dz, -SPEED_OF_SOUND * 0.5, SPEED_OF_SOUND * 0.5);
  return clamp((SPEED_OF_SOUND + vl) / (SPEED_OF_SOUND + vs), 0.5, 2);
}

export function distance(a: ArrayLike<number>, b: ArrayLike<number>): number {
  const dx = a[0] - b[0], dy = a[1] - b[1], dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** Small fast deterministic PRNG (mulberry32). */
export class Rng {
  private s: number;
  constructor(seed: number) { this.s = seed >>> 0 || 0x9e3779b9; }
  next(): number {
    let t = (this.s = (this.s + 0x6d2b79f5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a: number, b: number): number { return a + (b - a) * this.next(); }
  int(n: number): number { return Math.floor(this.next() * n); }
  pick<T>(arr: readonly T[]): T { return arr[Math.floor(this.next() * arr.length)]; }
  chance(p: number): boolean { return this.next() < p; }
  /** approx gaussian, sd 1 */
  gauss(): number { return (this.next() + this.next() + this.next() + this.next() - 2) * 1.7320508; }
}

/** Soft clipping curve for a WaveShaperNode: linear to `knee`, then smoothly saturates to `ceiling`. */
export function makeSoftClipCurve(knee = 0.8, ceiling = 0.97, n = 4096): Float32Array<ArrayBuffer> {
  const c = new Float32Array(n);
  const range = ceiling - knee;
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    const a = Math.abs(x);
    const y = a <= knee ? a : knee + range * Math.tanh((a - knee) / range);
    c[i] = Math.sign(x) * y;
  }
  return c;
}

export function makeDriveCurve(drive: number, n = 2048): Float32Array<ArrayBuffer> {
  const c = new Float32Array(n);
  const norm = Math.tanh(drive);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    c[i] = Math.tanh(x * drive) / norm;
  }
  return c;
}

/**
 * PeriodicWave with a combustion-engine harmonic structure. The fundamental is the engine CYCLE
 * frequency (rpm/120 for a 4-stroke) so that firing harmonics (index = cylinders) and the lumpy
 * sub-harmonics (orders 0.5, 1, 1.5 of the crank) all exist coherently.
 */
export function makeEngineWave(ctx: BaseAudioContext, cylinders: number, roughness: number, brightness: number, n = 96): PeriodicWave {
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  const rng = new Rng(cylinders * 7919 + Math.round(roughness * 1000));
  const fire = Math.max(1, cylinders);
  for (let k = 1; k < n; k++) {
    const order = k / fire; // in multiples of the firing frequency
    let a: number;
    if (k % fire === 0) a = 1 / Math.pow(order, 1.1 - brightness * 0.5);
    else a = roughness * 0.35 / Math.pow(order + 0.5, 1.4 - brightness * 0.4);
    a *= 0.85 + rng.next() * 0.3;
    const ph = rng.next() * Math.PI * 2;
    real[k] = a * Math.cos(ph);
    imag[k] = a * Math.sin(ph);
  }
  return ctx.createPeriodicWave(real, imag, { disableNormalization: false });
}

/** Generic wave from harmonic amplitudes (index 1..). */
export function makeHarmonicWave(ctx: BaseAudioContext, amps: number[]): PeriodicWave {
  const real = new Float32Array(amps.length + 1);
  const imag = new Float32Array(amps.length + 1);
  for (let i = 0; i < amps.length; i++) imag[i + 1] = amps[i];
  return ctx.createPeriodicWave(real, imag);
}
