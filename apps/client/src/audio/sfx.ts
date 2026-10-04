// One-shot sound effects: collisions (modal synthesis per material), AI horns, UI sounds, and the
// scheduled cabin loops (indicator relay, wipers). Event-driven code may allocate nodes (that is how
// Web Audio one-shots work); nothing here runs on the per-frame hot path except tick().

import type { AudioBuffers } from './buffers';
import { clamp, clamp01, Gate, makeDriveCurve, makeHarmonicWave, makePanner, Rng, setPannerPositionNow } from './util';

export type CollisionMaterial = 'metal' | 'concrete' | 'wood' | 'glass' | 'plastic';
export type UiKind = 'click' | 'notify' | 'meterStart' | 'meterStop' | 'cash' | 'rating' | 'door' | 'indicator';
export type AiHornKind = 'car' | 'bus' | 'angry';

/** Small synthesis toolkit shared by all one-shots. */
export class Synth {
  constructor(readonly ctx: BaseAudioContext, readonly buffers: AudioBuffers, readonly rng: Rng) {}

  /** decaying sine partial (modal resonance) */
  ping(dest: AudioNode, t: number, f: number, tau: number, amp: number, attack = 0.002, type: OscillatorType = 'sine'): void {
    const ctx = this.ctx;
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(amp, t + attack);
    g.gain.setTargetAtTime(0, t + attack, tau);
    o.connect(g).connect(dest);
    o.start(t); o.stop(t + attack + tau * 7);
  }

  /** filtered white-noise burst */
  noise(dest: AudioNode, t: number, type: BiquadFilterType, f: number, q: number, tau: number, amp: number, attack = 0.001, rate = 1): void {
    const ctx = this.ctx;
    const s = ctx.createBufferSource(); s.buffer = this.buffers.white; s.playbackRate.value = rate;
    const bq = ctx.createBiquadFilter(); bq.type = type; bq.frequency.value = f; bq.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(amp, t + attack);
    g.gain.setTargetAtTime(0, t + attack, tau);
    s.connect(bq).connect(g).connect(dest);
    const dur = attack + tau * 7;
    s.start(t, this.rng.next() * Math.max(0, this.buffers.white.duration - dur - 0.01));
    s.stop(t + dur);
  }

  /** low thump with a downward pitch sweep */
  thump(dest: AudioNode, t: number, f: number, tau: number, amp: number): void {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(f * 2.2, t);
    o.frequency.exponentialRampToValueAtTime(f, t + 0.03);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(amp, t + 0.003);
    g.gain.setTargetAtTime(0, t + 0.003, tau);
    o.connect(g).connect(dest);
    o.start(t); o.stop(t + tau * 7 + 0.01);
  }

  /** soft FM bell (UI chimes, jingles) */
  bell(dest: AudioNode, t: number, f: number, dur: number, amp: number, ratio = 2, index = 1.2): void {
    const ctx = this.ctx;
    const car = ctx.createOscillator(); car.frequency.value = f;
    const mod = ctx.createOscillator(); mod.frequency.value = f * ratio;
    const mg = ctx.createGain();
    mg.gain.setValueAtTime(f * index, t);
    mg.gain.setTargetAtTime(f * index * 0.1, t, dur * 0.25);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(amp, t + 0.004);
    g.gain.setTargetAtTime(0, t + 0.004, dur * 0.3);
    mod.connect(mg).connect(car.frequency);
    car.connect(g).connect(dest);
    car.start(t); mod.start(t);
    car.stop(t + dur * 2.2); mod.stop(t + dur * 2.2);
  }

  sample(dest: AudioNode, buf: AudioBuffer, t: number, amp: number, rate = 1): void {
    const s = this.ctx.createBufferSource(); s.buffer = buf; s.playbackRate.value = rate;
    const g = this.ctx.createGain(); g.gain.value = amp;
    s.connect(g).connect(dest);
    s.start(t);
  }
}

// --------------------------------------------------------------------------------------------------

interface OneShotSlot { input: GainNode; panner: PannerNode; gate: Gate }

export class SfxSystem {
  private slots: OneShotSlot[] = [];
  private slotIdx = 0;
  private lastCollisionT = -1;
  private lastCollisionI = 0;
  private hornWave: PeriodicWave;
  private busHornWave: PeriodicWave;
  private shaper: Float32Array<ArrayBuffer>;
  // cabin loops
  private indicatorOn = false;
  private nextIndicator = 0;
  private indicatorOut: GainNode;
  private wiperSpeed: 0 | 1 | 2 = 0;
  private nextWipe = 0;
  private wipeDir = 0;
  private wiperOut: GainNode;
  private motorG: GainNode;
  private motorGate: Gate;
  private now = 0;
  private nodes: AudioNode[] = [];
  rain = 0;

  constructor(private s: Synth, private sfxExt: AudioNode, sfxInt: AudioNode, private uiOut: AudioNode, slotCount = 6) {
    const ctx = s.ctx;
    for (let i = 0; i < slotCount; i++) {
      const input = ctx.createGain();
      const panner = makePanner(ctx, 5, 1, 800);
      input.connect(panner);
      this.slots.push({ input, panner, gate: new Gate(panner, sfxExt) });
      this.nodes.push(input, panner);
    }
    this.hornWave = makeHarmonicWave(ctx, [1, 0.7, 0.55, 0.42, 0.3, 0.22, 0.16, 0.11, 0.08, 0.05]);
    this.busHornWave = makeHarmonicWave(ctx, [1, 0.85, 0.7, 0.6, 0.5, 0.42, 0.35, 0.28, 0.22, 0.17, 0.13, 0.1, 0.07]);
    this.shaper = makeDriveCurve(2);
    this.indicatorOut = ctx.createGain(); this.indicatorOut.connect(sfxInt);
    this.wiperOut = ctx.createGain(); this.wiperOut.gain.value = 1; this.wiperOut.connect(sfxInt);
    // wiper motor hum (runs continuously at zero gain; it is just one oscillator)
    const motor = ctx.createOscillator(); motor.type = 'sawtooth'; motor.frequency.value = 92;
    const mLp = ctx.createBiquadFilter(); mLp.type = 'lowpass'; mLp.frequency.value = 280;
    this.motorG = ctx.createGain(); this.motorG.gain.value = 0;
    motor.connect(mLp).connect(this.motorG);
    this.motorGate = new Gate(this.motorG, this.wiperOut);
    motor.start(ctx.currentTime);
    this.nodes.push(this.indicatorOut, this.wiperOut, motor, mLp, this.motorG);
  }

  /** gain applied to cabin-only loops depending on camera (wipers inaudible outside, indicator quieter) */
  setInteriorFactor(interior: boolean, now: number): void {
    this.indicatorOut.gain.setTargetAtTime(interior ? 1 : 0.25, now, 0.05);
    this.wiperOut.gain.setTargetAtTime(interior ? 1 : 0, now, 0.05);
  }

  private acquire(pos: ArrayLike<number>): GainNode {
    const slot = this.slots[this.slotIdx];
    this.slotIdx = (this.slotIdx + 1) % this.slots.length;
    setPannerPositionNow(slot.panner, pos[0], pos[1] + 0.5, pos[2]);
    slot.gate.openUntil(this.now + 4.5); // long enough for the longest one-shot tail
    return slot.input;
  }

  // ---- collisions ---------------------------------------------------------------------------------
  collision(intensity: number, pos: ArrayLike<number>, material: CollisionMaterial, now: number): void {
    this.now = now;
    const I = clamp01(intensity);
    if (I < 0.02) return;
    if (now - this.lastCollisionT < 0.04 && I < this.lastCollisionI * 1.3) return; // de-bounce contact spam
    this.lastCollisionT = now; this.lastCollisionI = I;
    const s = this.s, r = this.s.rng;
    const out = this.acquire(pos);
    const t = now + 0.005;
    const A = (0.12 + 0.88 * Math.pow(I, 0.8)) * 0.9;
    const bright = 0.4 + 0.6 * I;
    const jit = (): number => 0.88 + r.next() * 0.24;
    switch (material) {
      case 'metal': {
        s.thump(out, t, 62 * jit(), 0.05 + 0.08 * I, A * 0.9);
        const modes = [[480, 0.18], [1130, 0.13], [1720, 0.1], [2630, 0.07], [3790, 0.05]];
        modes.forEach(([f, tau], i) => s.ping(out, t, f * jit(), tau * (0.6 + 0.8 * I), A * 0.22 * Math.pow(bright, i * 0.6) / (1 + i * 0.4)));
        s.noise(out, t, 'bandpass', 2400 * bright + 600, 0.7, 0.03 + 0.06 * I, A * 0.7);
        if (I > 0.4) { // crumple: grains of bent sheet metal
          const grains = 4 + Math.floor(I * 10);
          for (let k = 0; k < grains; k++) s.noise(out, t + r.next() * 0.18 * I, 'bandpass', 900 + r.next() * 2500, 2, 0.01 + r.next() * 0.02, A * 0.35 * r.next());
          s.noise(out, t, 'lowpass', 1100, 0.7, 0.12 + 0.15 * I, A * 0.4);
        }
        break;
      }
      case 'concrete': {
        s.thump(out, t, 52 * jit(), 0.07 + 0.08 * I, A);
        s.noise(out, t, 'lowpass', 700 + 1200 * bright, 0.7, 0.04 + 0.06 * I, A * 0.8);
        s.noise(out, t + 0.004, 'highpass', 3000, 0.7, 0.02 + 0.03 * I, A * 0.25 * I); // grit
        s.ping(out, t, 190 * jit(), 0.04, A * 0.15);
        break;
      }
      case 'wood': {
        const modes = [[210, 0.07], [470, 0.05], [890, 0.035], [1570, 0.02]];
        modes.forEach(([f, tau], i) => s.ping(out, t, f * jit(), tau * (0.8 + 0.4 * I), A * 0.35 / (1 + i * 0.7)));
        s.thump(out, t, 85 * jit(), 0.05, A * 0.6);
        s.noise(out, t, 'bandpass', 1300, 1, 0.02 + 0.02 * I, A * 0.5);
        if (I > 0.6) for (let k = 0; k < 4; k++) s.noise(out, t + 0.02 + r.next() * 0.1, 'bandpass', 2000 + r.next() * 2000, 3, 0.008, A * 0.3); // splinters
        break;
      }
      case 'glass': {
        const modes = [[2150, 0.2], [3480, 0.15], [4890, 0.11], [6280, 0.08]];
        modes.forEach(([f, tau], i) => s.ping(out, t, f * jit(), tau, A * 0.12 / (1 + i * 0.3)));
        s.noise(out, t, 'highpass', 3500, 0.7, 0.03 + 0.1 * I, A * 0.6);
        s.thump(out, t, 90, 0.03, A * 0.3);
        const shards = Math.floor(3 + 14 * I);
        for (let k = 0; k < shards; k++) {
          const dt = 0.02 + Math.pow(r.next(), 1.6) * (0.25 + 0.5 * I);
          s.ping(out, t + dt, 2800 + r.next() * 5500, 0.02 + r.next() * 0.07, A * (0.05 + 0.1 * r.next()));
        }
        break;
      }
      case 'plastic': {
        const modes = [[330, 0.045], [760, 0.03], [1460, 0.018]];
        modes.forEach(([f, tau], i) => s.ping(out, t, f * jit(), tau, A * 0.3 / (1 + i * 0.6)));
        s.thump(out, t, 115 * jit(), 0.035, A * 0.5);
        s.noise(out, t, 'bandpass', 1800, 0.9, 0.025, A * 0.55);
        break;
      }
    }
  }

  // ---- AI horns -------------------------------------------------------------------------------------
  hornAt(pos: ArrayLike<number>, kind: AiHornKind, now: number): void {
    this.now = now;
    const r = this.s.rng;
    const out = this.acquire(pos);
    const t = now + 0.01;
    if (kind === 'bus') {
      this.hornVoice(out, t, 0.85 + r.next() * 0.4, 288 * (0.95 + r.next() * 0.1), 1.2, this.busHornWave, 0.4, 1600);
      return;
    }
    const base = 395 * (0.88 + r.next() * 0.24);
    if (kind === 'angry') {
      this.hornVoice(out, t, 1.1 + r.next() * 0.5, base, 1.25, this.hornWave, 0.42, 2300);
      const t2 = t + 1.4 + r.next() * 0.3;
      this.hornVoice(out, t2, 0.14, base, 1.25, this.hornWave, 0.42, 2300);
      this.hornVoice(out, t2 + 0.22, 0.14, base, 1.25, this.hornWave, 0.42, 2300);
      return;
    }
    if (r.chance(0.5)) this.hornVoice(out, t, 0.2 + r.next() * 0.25, base, 1.25, this.hornWave, 0.36, 2300);
    else {
      this.hornVoice(out, t, 0.12, base, 1.25, this.hornWave, 0.36, 2300);
      this.hornVoice(out, t + 0.2, 0.18, base, 1.25, this.hornWave, 0.36, 2300);
    }
  }

  private hornVoice(dest: AudioNode, t: number, dur: number, f: number, interval: number, wave: PeriodicWave, amp: number, formant: number): void {
    const ctx = this.s.ctx;
    const a = ctx.createOscillator(); a.setPeriodicWave(wave);
    const b = ctx.createOscillator(); b.setPeriodicWave(wave);
    a.frequency.setValueAtTime(f * 0.97, t); a.frequency.setTargetAtTime(f, t, 0.03);
    b.frequency.setValueAtTime(f * interval * 0.97, t); b.frequency.setTargetAtTime(f * interval, t, 0.03);
    const sh = ctx.createWaveShaper(); sh.curve = this.shaper;
    const pk = ctx.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = formant; pk.Q.value = 1.3; pk.gain.value = 6;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(amp, t + 0.012);
    g.gain.setValueAtTime(amp, t + dur);
    g.gain.linearRampToValueAtTime(0, t + dur + 0.04);
    const ga = ctx.createGain(); ga.gain.value = 0.5;
    a.connect(ga); b.connect(ga);
    ga.connect(sh).connect(pk).connect(lp).connect(g).connect(dest);
    a.start(t); b.start(t); a.stop(t + dur + 0.06); b.stop(t + dur + 0.06);
  }

  // ---- UI -------------------------------------------------------------------------------------------
  /** Returns true when the sound should duck the music/ambience. */
  ui(kind: UiKind, now: number): boolean {
    const s = this.s, out = this.uiOut, t = now + 0.005;
    switch (kind) {
      case 'click':
        s.ping(out, t, 2300, 0.006, 0.08);
        s.noise(out, t, 'highpass', 3500, 0.7, 0.003, 0.05);
        return false;
      case 'notify':
        s.bell(out, t, 1318.5, 0.5, 0.11, 2, 0.6);
        s.bell(out, t + 0.1, 1975.5, 0.7, 0.09, 2, 0.5);
        return true;
      case 'meterStart':
        for (let i = 0; i < 2; i++) {
          s.ping(out, t + i * 0.12, 1975.5, 0.05, 0.09, 0.003, 'triangle');
          s.ping(out, t + i * 0.12, 3951, 0.02, 0.015);
        }
        return false;
      case 'meterStop':
        s.ping(out, t, 1568, 0.07, 0.09, 0.003, 'triangle');
        s.ping(out, t + 0.13, 1175, 0.12, 0.09, 0.003, 'triangle');
        return false;
      case 'cash': {
        const notes = [1046.5, 1318.5, 1568, 2093];
        notes.forEach((f, i) => s.bell(out, t + i * 0.055, f, 0.9 - i * 0.1, 0.085, 2, 0.9));
        s.ping(out, t, 523.25, 0.35, 0.05); // warm body
        for (let k = 0; k < 6; k++) s.ping(out, t + 0.03 + k * 0.03, 4000 + s.rng.next() * 3000, 0.02, 0.012); // coin shimmer
        return true;
      }
      case 'rating': {
        const notes = [783.99, 880, 1046.5, 1174.7, 1318.5, 1568];
        notes.forEach((f, i) => s.ping(out, t + i * 0.045, f, 0.18, 0.06, 0.004, 'triangle'));
        s.bell(out, t + 0.28, 2093, 0.8, 0.05, 3, 0.4);
        return true;
      }
      case 'door':
        s.thump(out, t, 62, 0.08, 0.32);
        s.noise(out, t, 'bandpass', 240, 1.2, 0.05, 0.35);
        s.noise(out, t, 'lowpass', 1200, 0.7, 0.02, 0.15);
        s.ping(out, t + 0.012, 1900, 0.008, 0.06, 0.001, 'triangle'); // latch
        s.noise(out, t + 0.012, 'bandpass', 3200, 3, 0.006, 0.08);
        return false;
      case 'indicator':
        this.relay(out, t, true);
        return false;
    }
    return false;
  }

  private relay(dest: AudioNode, t: number, tick: boolean): void {
    const s = this.s;
    s.noise(dest, t, 'bandpass', tick ? 3100 : 2500, 2.5, 0.004, 0.22);
    s.ping(dest, t, tick ? 1250 : 980, 0.006, 0.07, 0.0005, 'triangle');
    s.ping(dest, t, tick ? 420 : 360, 0.01, 0.05, 0.0005);
  }

  setIndicator(on: boolean, now: number): void {
    if (on && !this.indicatorOn) this.nextIndicator = now + 0.03;
    this.indicatorOn = on;
  }

  setWipers(speed: 0 | 1 | 2, now: number): void {
    if (speed !== 0 && this.wiperSpeed === 0) this.nextWipe = now + 0.05;
    this.wiperSpeed = speed;
    this.motorG.gain.setTargetAtTime(speed === 0 ? 0 : speed === 1 ? 0.012 : 0.018, now, 0.08);
    if (speed === 0) this.motorGate.closeAfter(now + 0.6); else this.motorGate.open();
  }

  tick(now: number, lookahead = 0.2): void {
    this.now = now;
    for (let i = 0; i < this.slots.length; i++) this.slots[i].gate.update(now);
    this.motorGate.update(now);
    const ahead = now + lookahead;
    if (this.indicatorOn) {
      if (this.nextIndicator < now - 0.5) this.nextIndicator = now + 0.02;
      while (this.nextIndicator < ahead) {
        this.relay(this.indicatorOut, this.nextIndicator, true);
        this.relay(this.indicatorOut, this.nextIndicator + 0.333, false);
        this.nextIndicator += 0.6667; // ~1.5 Hz tick-tock
      }
    }
    if (this.wiperSpeed !== 0) {
      if (this.nextWipe < now - 0.5) this.nextWipe = now + 0.02;
      const half = this.wiperSpeed === 1 ? 0.72 : 0.44;
      const pause = this.wiperSpeed === 1 ? 0.25 : 0.04;
      while (this.nextWipe < ahead) {
        const t = this.nextWipe;
        this.wipe(t, half);
        this.nextWipe += half + (this.wipeDir === 1 ? pause : 0);
        this.wipeDir ^= 1;
      }
    }
  }

  private wipe(t: number, half: number): void {
    const ctx = this.s.ctx, out = this.wiperOut;
    const wet = clamp(this.rain * 1.5, 0, 1);
    // blade swish: band-limited noise swelling over the stroke
    const src = ctx.createBufferSource(); src.buffer = this.s.buffers.pink;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500 + 900 * wet; bp.Q.value = 0.8;
    const g = ctx.createGain();
    const amp = 0.05 + 0.07 * wet;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(amp, t + half * 0.25);
    g.gain.setValueAtTime(amp, t + half * 0.7);
    g.gain.linearRampToValueAtTime(0, t + half);
    src.connect(bp).connect(g).connect(out);
    src.start(t, this.s.rng.next() * 2); src.stop(t + half + 0.02);
    // dry glass: rubber judder squeak
    if (wet < 0.3) {
      const o = ctx.createOscillator(); o.type = 'triangle';
      o.frequency.setValueAtTime(820, t); o.frequency.linearRampToValueAtTime(1150, t + half * 0.5); o.frequency.linearRampToValueAtTime(900, t + half);
      const sg = ctx.createGain();
      const sa = 0.012 * (1 - wet / 0.3);
      sg.gain.setValueAtTime(0, t); sg.gain.linearRampToValueAtTime(sa, t + half * 0.3); sg.gain.linearRampToValueAtTime(0, t + half);
      o.connect(sg).connect(out); o.start(t); o.stop(t + half + 0.02);
    }
    // end-of-stroke thunk
    this.s.thump(out, t + half - 0.01, 140, 0.015, 0.05);
  }

  dispose(): void {
    for (const n of this.nodes) { try { (n as AudioScheduledSourceNode).stop?.(); } catch { /* */ } n.disconnect(); }
  }
}
