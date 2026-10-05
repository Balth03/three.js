import type { AudioEngine } from './AudioEngine.ts';

export interface Pos { x: number; y: number; z: number }

/** Synthesised sound effects. Positional sounds go through an HRTF panner (+ optional occlusion low-pass). */
export class Sfx {
  constructor(private readonly a: AudioEngine) {}

  private get ctx() { return this.a.ctx; }
  private rnd(spread: number) { return 1 + (Math.random() * 2 - 1) * spread; }

  /** Output node for a sound: positional (with panner) or direct to the sfx bus. */
  private out(pos: Pos | null, occluded = false, gain = 1): AudioNode {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.value = gain;
    let node: AudioNode = g;
    if (occluded) {
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
      g.connect(lp); node = lp;
    }
    if (pos) {
      const p = ctx.createPanner();
      p.panningModel = 'HRTF';
      p.distanceModel = 'inverse';
      p.refDistance = 2.5; p.rolloffFactor = 1.1; p.maxDistance = 80;
      p.positionX.value = pos.x; p.positionY.value = pos.y; p.positionZ.value = pos.z;
      node.connect(p).connect(this.a.sfx);
      const send = ctx.createGain(); send.gain.value = 0.18; p.connect(send).connect(this.a.reverbSend);
    } else node.connect(this.a.sfx);
    return g;
  }

  private osc(type: OscillatorType, f0: number, f1: number, t: number, dur: number, vol: number, dest: AudioNode, attack = 0.002) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest);
    o.start(t); o.stop(t + dur + 0.02);
    return o;
  }

  private noise(t: number, dur: number, vol: number, dest: AudioNode, type: BiquadFilterType, f: number, q = 1, f1?: number) {
    const ctx = this.ctx;
    const n = ctx.createBufferSource(), flt = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = this.a.noise;
    flt.type = type; flt.frequency.setValueAtTime(f, t); flt.Q.value = q;
    if (f1) flt.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(flt).connect(g).connect(dest);
    n.start(t, Math.random() * 1.5); n.stop(t + dur + 0.02);
  }

  shot(pos: Pos | null, team: number, local: boolean, occluded = false) {
    const t = this.ctx.currentTime;
    const p = this.rnd(0.06) * (team === 0 ? 1.06 : 0.95);
    const d = this.out(local ? null : pos, occluded, local ? 0.55 : 0.8);
    this.osc('sawtooth', 2600 * p, 160 * p, t, 0.13, 0.32, d);
    this.osc('square', 1300 * p, 90 * p, t, 0.1, 0.16, d);
    this.osc('sine', 5200 * p, 900 * p, t, 0.05, 0.12, d);
    this.noise(t, 0.05, 0.25, d, 'bandpass', 4000, 1.5);
    if (local) {
      // weight in the hands: sub thump + a short crackle tail
      this.osc('sine', 150, 42, t, 0.11, 0.5, d);
      this.osc('triangle', 700 * p, 220 * p, t, 0.06, 0.12, d);
      this.noise(t + 0.01, 0.09, 0.08, d, 'highpass', 5000, 0.8, 9000);
    }
  }

  impact(pos: Pos, occluded = false) {
    const t = this.ctx.currentTime;
    const d = this.out(pos, occluded, 0.5);
    this.noise(t, 0.12, 0.3, d, 'bandpass', 3200 * this.rnd(0.2), 3, 900);
    this.osc('sine', 1800 * this.rnd(0.1), 600, t, 0.06, 0.08, d);
  }

  /** `combo` = consecutive hits on the same target: each one climbs a semitone (a ladder you hear converge). */
  hitConfirm(zone: string, deactivated: boolean, combo = 0) {
    const t = this.ctx.currentTime;
    const d = this.out(null, false, 0.7);
    if (deactivated) {
      // the "lights out" chord + a deep sub drop and a glassy shimmer
      for (const [k, f] of [659, 988, 1318, 1976].entries()) this.osc('triangle', f, f * 1.01, t + k * 0.035, 0.45, 0.16, d);
      this.osc('sine', 180, 38, t, 0.5, 0.6, d, 0.004);
      this.osc('square', 90, 45, t, 0.18, 0.12, d);
      this.noise(t, 0.35, 0.18, d, 'highpass', 6000, 0.7, 12000);
      return;
    }
    const semis = Math.min(combo, 7);
    const f = (zone === 'head' ? 2600 : zone === 'back' ? 1650 : zone === 'blaster' ? 1000 : 1900) * Math.pow(2, semis / 12);
    this.osc('sine', f, f * 1.02, t, 0.07, 0.24, d);
    this.osc('square', f * 2, f * 2, t, 0.02, 0.05, d);
    // body: a short low "thwack" so a hit has weight, not just a beep
    this.osc('sine', 260, 90, t, 0.07, 0.25, d);
    this.noise(t, 0.04, 0.16, d, 'bandpass', 2400, 2);
    if (zone === 'head') { this.osc('sine', f * 1.5, f * 1.5, t + 0.05, 0.14, 0.18, d); this.osc('triangle', f * 2, f * 2, t + 0.09, 0.16, 0.08, d); }
  }

  hurt(fromPos: Pos | null) {
    const t = this.ctx.currentTime;
    const d = this.out(null, false, 0.7);
    this.osc('sine', 110, 45, t, 0.18, 0.5, d);
    this.osc('square', 62, 58, t, 0.12, 0.06, d);
    this.noise(t, 0.08, 0.12, d, 'lowpass', 600);
    // vest beep, panned toward the attacker
    const b = this.out(fromPos, false, 0.35);
    this.osc('square', 1200, 1200, t + 0.02, 0.05, 0.08, b);
  }

  shutdown() {
    const t = this.ctx.currentTime;
    const d = this.out(null, false, 0.8);
    this.osc('sawtooth', 900, 40, t, 1.3, 0.22, d, 0.005);
    this.osc('square', 450, 30, t + 0.05, 1.1, 0.1, d);
    for (let k = 0; k < 7; k++) this.noise(t + k * 0.09 + Math.random() * 0.05, 0.04, 0.15, d, 'highpass', 5000);
    this.osc('sine', 60, 30, t, 1.0, 0.4, d, 0.01);
  }

  bootup() {
    const t = this.ctx.currentTime;
    const d = this.out(null, false, 0.6);
    for (const [k, f] of [440, 554, 659, 880, 1108].entries()) this.osc('square', f, f, t + k * 0.06, 0.12, 0.07, d);
    this.osc('sawtooth', 120, 1200, t, 0.45, 0.1, d, 0.05);
  }

  remoteDown(pos: Pos, occluded: boolean) {
    const t = this.ctx.currentTime;
    const d = this.out(pos, occluded, 0.9);
    this.osc('sawtooth', 700, 50, t, 0.8, 0.2, d);
    for (let k = 0; k < 4; k++) this.noise(t + k * 0.08, 0.04, 0.12, d, 'highpass', 4000);
  }

  jump(local: boolean, pos: Pos | null) {
    const t = this.ctx.currentTime;
    const d = this.out(local ? null : pos, false, local ? 0.35 : 0.3);
    this.noise(t, 0.16, 0.2, d, 'bandpass', 700, 0.8, 1800);
  }

  land(speed: number, local: boolean, pos: Pos | null) {
    const t = this.ctx.currentTime;
    const v = Math.min(1, speed / 12);
    const d = this.out(local ? null : pos, false, local ? 0.6 : 0.4);
    this.osc('sine', 140, 50, t, 0.12 + v * 0.1, 0.25 + v * 0.35, d);
    this.noise(t, 0.08, 0.1 + v * 0.2, d, 'lowpass', 900);
  }

  step(local: boolean, pos: Pos | null, sprint: boolean) {
    const t = this.ctx.currentTime;
    const d = this.out(local ? null : pos, false, local ? 0.16 : 0.22);
    this.noise(t, 0.05, sprint ? 0.5 : 0.35, d, 'bandpass', 1100 * this.rnd(0.25), 1.2);
    this.osc('sine', 90 * this.rnd(0.1), 60, t, 0.05, 0.2, d);
  }

  slide() {
    const t = this.ctx.currentTime;
    const d = this.out(null, false, 0.4);
    this.noise(t, 0.6, 0.25, d, 'bandpass', 1400, 0.7, 500);
  }

  overheat() {
    const t = this.ctx.currentTime;
    const d = this.out(null, false, 0.55);
    for (let k = 0; k < 3; k++) this.osc('square', 1400, 1400, t + k * 0.12, 0.07, 0.1, d);
    this.noise(t + 0.05, 1.1, 0.22, d, 'highpass', 3000, 0.7, 6000);
  }

  vent() {
    const t = this.ctx.currentTime;
    const d = this.out(null, false, 0.5);
    this.noise(t, 0.7, 0.25, d, 'bandpass', 2500, 0.6, 7000);
    this.osc('sine', 300, 900, t, 0.25, 0.06, d);
  }

  empty() {
    const t = this.ctx.currentTime;
    const d = this.out(null, false, 0.5);
    this.osc('square', 220, 200, t, 0.05, 0.12, d);
    this.noise(t, 0.03, 0.15, d, 'highpass', 2000);
  }

  jammed() {
    const t = this.ctx.currentTime;
    const d = this.out(null, false, 0.6);
    for (let k = 0; k < 6; k++) this.osc('square', 300 + Math.random() * 1500, 100, t + k * 0.05, 0.04, 0.1, d);
  }

  recharge() {
    const t = this.ctx.currentTime;
    const d = this.out(null, false, 0.25);
    this.osc('sine', 600, 1200, t, 0.18, 0.06, d, 0.04);
  }

  private wind: { g: GainNode; f: BiquadFilterNode } | null = null;
  /** Continuous air rush that rises with speed (sprint, slide, bunny hops). */
  setWind(speed: number) {
    const ctx = this.ctx;
    if (!this.wind) {
      const n = ctx.createBufferSource(); n.buffer = this.a.noise; n.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.6; f.frequency.value = 400;
      const g = ctx.createGain(); g.gain.value = 0;
      n.connect(f).connect(g).connect(this.a.sfx); n.start();
      this.wind = { g, f };
    }
    const k = Math.max(0, Math.min(1, (speed - 8) / 6));
    const t = ctx.currentTime;
    this.wind.g.gain.setTargetAtTime(k * k * 0.16, t, 0.12);
    this.wind.f.frequency.setTargetAtTime(400 + k * 1400, t, 0.12);
  }

  ui(kind: 'hover' | 'click' | 'back' | 'tick' | 'go') {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain(); g.connect(this.a.ui);
    if (kind === 'hover') this.osc('sine', 1800, 2100, t, 0.04, 0.06, g);
    if (kind === 'click') { this.osc('square', 900, 1400, t, 0.06, 0.08, g); this.osc('sine', 2600, 2600, t + 0.03, 0.06, 0.06, g); }
    if (kind === 'back') this.osc('square', 1100, 600, t, 0.08, 0.07, g);
    if (kind === 'tick') { this.osc('square', 880, 880, t, 0.09, 0.12, g); this.osc('sine', 1760, 1760, t, 0.12, 0.08, g); }
    if (kind === 'go') for (const [k, f] of [880, 1108, 1318, 1760].entries()) this.osc('sawtooth', f, f, t + k * 0.03, 0.4, 0.06, g);
  }
}
