// Pooled spatial voices for AI vehicles and emergency sirens. All per-frame work is allocation-free:
// slots are pre-built at init, and doppler is applied through oscillator detune / buffer playbackRate.

import type { AudioBuffers } from './buffers';
import { loopSource } from './buffers';
import { clamp, distance, dopplerFactor, Gate, glide, makeEngineWave, makeHarmonicWave, makePanner, setPannerPosition, setPannerPositionNow } from './util';

export type TrafficKind = 'car' | 'scooter' | 'bus' | 'truck';
export interface TrafficVoiceInput {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  rpm: number;
  kind: TrafficKind;
}

const KIND_INDEX: Record<TrafficKind, number> = { car: 0, scooter: 1, bus: 2, truck: 3 };
// per kind: [cycles per rev divisor (fundamental = rpm/div), gain, lp base, lp per rpm, noise gain, refDistance]
const KIND_CFG = [
  { div: 120, gain: 0.32, lp: 500, lpRpm: 0.45, noise: 0.06, ref: 3.5, noiseF: 900 },  // car: 4-cyl
  { div: 60, gain: 0.2, lp: 1400, lpRpm: 0.5, noise: 0.04, ref: 2.5, noiseF: 2600 },   // scooter: 1-cyl 2-stroke
  { div: 120, gain: 0.55, lp: 380, lpRpm: 0.3, noise: 0.1, ref: 6, noiseF: 1500 },     // bus: diesel 6-cyl
  { div: 120, gain: 0.6, lp: 340, lpRpm: 0.3, noise: 0.12, ref: 6, noiseF: 1300 },     // truck
];

interface Slot {
  id: number; // -1 = free
  kind: number;
  osc: OscillatorNode;
  lp: BiquadFilterNode;
  noise: AudioBufferSourceNode;
  noiseBp: BiquadFilterNode;
  noiseG: GainNode;
  gain: GainNode;
  panner: PannerNode;
  gate: Gate;
  seen: boolean;
  dop: number;
  idle: boolean;
}

export class TrafficVoices {
  private slots: Slot[] = [];
  private waves: PeriodicWave[];
  private nodes: AudioNode[] = [];

  constructor(private ctx: BaseAudioContext, buffers: AudioBuffers, out: AudioNode, count = 8) {
    this.waves = [
      makeEngineWave(ctx, 4, 0.5, 0.35),
      makeHarmonicWave(ctx, [1, 0.9, 0.75, 0.6, 0.5, 0.42, 0.35, 0.3, 0.25, 0.2, 0.16, 0.13, 0.1, 0.08, 0.06, 0.05]), // raspy 2-stroke
      makeEngineWave(ctx, 6, 0.8, 0.2),
      makeEngineWave(ctx, 6, 0.9, 0.25),
    ];
    const t = ctx.currentTime;
    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      osc.setPeriodicWave(this.waves[0]);
      osc.frequency.value = 7;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.8; lp.frequency.value = 800;
      const noise = loopSource(ctx, buffers.white, i * 0.137);
      const noiseBp = ctx.createBiquadFilter(); noiseBp.type = 'bandpass'; noiseBp.Q.value = 0.7; noiseBp.frequency.value = 900;
      const noiseG = ctx.createGain(); noiseG.gain.value = 0;
      const gain = ctx.createGain(); gain.gain.value = 0;
      const panner = makePanner(ctx, 4, 1.1, 300);
      setPannerPositionNow(panner, 0, -1000, 0);
      osc.connect(lp).connect(gain);
      noise.connect(noiseBp).connect(noiseG).connect(gain);
      gain.connect(panner);
      osc.start(t);
      // idle slots are disconnected: their oscillator, filters and HRTF panner cost nothing
      this.slots.push({ id: -1, kind: 0, osc, lp, noise, noiseBp, noiseG, gain, panner, gate: new Gate(panner, out), seen: false, dop: 1, idle: true });
      this.nodes.push(osc, lp, noise, noiseBp, noiseG, gain, panner);
    }
  }

  update(voices: ReadonlyArray<TrafficVoiceInput>, lisPos: ArrayLike<number>, lisVel: ArrayLike<number>, now: number): void {
    const slots = this.slots;
    for (let s = 0; s < slots.length; s++) slots[s].seen = false;
    const n = Math.min(voices.length, slots.length);
    for (let i = 0; i < n; i++) {
      const v = voices[i];
      // find slot by id
      let slot: Slot | null = null;
      for (let s = 0; s < slots.length; s++) if (slots[s].id === v.id) { slot = slots[s]; break; }
      if (!slot) {
        for (let s = 0; s < slots.length; s++) if (slots[s].id === -1 && !slots[s].seen) { slot = slots[s]; break; }
        if (!slot) continue;
        slot.id = v.id;
        slot.dop = 1;
        const k = KIND_INDEX[v.kind] ?? 0;
        if (k !== slot.kind) { slot.kind = k; slot.osc.setPeriodicWave(this.waves[k]); }
        slot.panner.refDistance = KIND_CFG[k].ref;
        slot.noiseBp.frequency.value = KIND_CFG[k].noiseF;
        setPannerPositionNow(slot.panner, v.position[0], v.position[1] + 0.5, v.position[2]);
        slot.gain.gain.cancelScheduledValues(now);
        slot.gain.gain.setValueAtTime(0, now);
        slot.gate.open();
      }
      slot.seen = true;
      slot.idle = false;
      const cfg = KIND_CFG[slot.kind];
      const d = dopplerFactor(v.position, v.velocity, lisPos, lisVel);
      slot.dop += (d - slot.dop) * 0.3;
      const cents = 1200 * Math.log2(slot.dop);
      const rpm = clamp(v.rpm || 900, 300, 12000);
      const spd = Math.sqrt(v.velocity[0] * v.velocity[0] + v.velocity[1] * v.velocity[1] + v.velocity[2] * v.velocity[2]);
      const dist = distance(v.position, lisPos);
      const air = 16000 / (1 + dist / 35); // air absorption: distant cars are duller
      glide(slot.osc.frequency, rpm / cfg.div, now, 0.03);
      glide(slot.osc.detune, cents, now, 0.03);
      slot.noise.playbackRate.setTargetAtTime(slot.dop, now, 0.03);
      glide(slot.lp.frequency, Math.min(air, cfg.lp + rpm * cfg.lpRpm), now, 0.05);
      glide(slot.noiseG.gain, cfg.noise + Math.min(0.25, spd * 0.012), now, 0.05);
      glide(slot.gain.gain, cfg.gain * (0.7 + Math.min(0.6, rpm / 6000)), now, 0.06);
      setPannerPosition(slot.panner, v.position[0], v.position[1] + 0.5, v.position[2]);
    }
    // fade out slots that were not refreshed this frame
    for (let s = 0; s < slots.length; s++) {
      const sl = slots[s];
      if (!sl.seen && sl.id !== -1) {
        sl.id = -1;
        glide(sl.gain.gain, 0, now, 0.08);
        sl.gate.closeAfter(now + 0.6);
      }
      sl.gate.update(now);
    }
  }

  dispose(): void {
    for (const n of this.nodes) { try { (n as AudioScheduledSourceNode).stop?.(); } catch { /* */ } n.disconnect(); }
  }
}

// ---------------------------------------------------------------------------------------------------
// Sirens: French "deux-tons" (pin-pon), La 435 Hz / Ré 580 Hz, ~0.55 s per tone, brassy horn timbre.

interface SirenSlot {
  id: number;
  osc: OscillatorNode;
  gain: GainNode;
  panner: PannerNode;
  gate: Gate;
  nextSwitch: number;
  high: boolean;
  pos: Float64Array; vel: Float64Array; lastT: number;
  dop: number;
}

const SIREN_LO = 435, SIREN_HI = 580, SIREN_HALF = 0.55;

export class Sirens {
  private slots: SirenSlot[] = [];
  private nodes: AudioNode[] = [];
  constructor(private ctx: BaseAudioContext, out: AudioNode, count = 2) {
    const wave = makeHarmonicWave(ctx, [1, 0.15, 0.62, 0.1, 0.4, 0.08, 0.28, 0.06, 0.18, 0.04, 0.11, 0.03, 0.07]);
    const t = ctx.currentTime;
    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator(); osc.setPeriodicWave(wave); osc.frequency.value = SIREN_LO;
      const bp = ctx.createBiquadFilter(); bp.type = 'peaking'; bp.frequency.value = 1400; bp.Q.value = 0.8; bp.gain.value = 5;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300;
      const gain = ctx.createGain(); gain.gain.value = 0;
      const panner = makePanner(ctx, 12, 1, 1000);
      setPannerPositionNow(panner, 0, -1000, 0);
      osc.connect(hp).connect(bp).connect(gain).connect(panner);
      osc.start(t);
      this.slots.push({ id: -1, osc, gain, panner, gate: new Gate(panner, out), nextSwitch: 0, high: false, pos: new Float64Array(3), vel: new Float64Array(3), lastT: -1, dop: 1 });
      this.nodes.push(osc, bp, hp, gain, panner);
    }
  }

  set(id: number, position: ArrayLike<number> | null, now: number): void {
    let slot: SirenSlot | null = null;
    for (let i = 0; i < this.slots.length; i++) if (this.slots[i].id === id) { slot = this.slots[i]; break; }
    if (!position) {
      if (slot) { slot.id = -1; glide(slot.gain.gain, 0, now, 0.15); slot.gate.closeAfter(now + 1); }
      return;
    }
    if (!slot) {
      for (const s of this.slots) if (s.id === -1) { slot = s; break; }
      if (!slot) slot = this.slots[0];
      slot.id = id;
      slot.lastT = -1;
      slot.dop = 1;
      slot.vel.fill(0);
      slot.high = false;
      slot.nextSwitch = now + 0.02;
      slot.osc.frequency.cancelScheduledValues(now);
      slot.osc.frequency.setValueAtTime(SIREN_LO, now);
      slot.gain.gain.cancelScheduledValues(now);
      slot.gain.gain.setTargetAtTime(0.32, now, 0.08);
      slot.gate.open();
      setPannerPositionNow(slot.panner, position[0], position[1] + 1.5, position[2]);
    }
    // velocity estimate from successive positions
    if (slot.lastT >= 0) {
      const dt = now - slot.lastT;
      if (dt > 0.004 && dt < 0.5) {
        const a = clamp(dt * 6, 0, 1);
        for (let k = 0; k < 3; k++) slot.vel[k] += ((position[k] - slot.pos[k]) / dt - slot.vel[k]) * a;
      }
    }
    if (now !== slot.lastT) { slot.pos[0] = position[0]; slot.pos[1] = position[1]; slot.pos[2] = position[2]; slot.lastT = now; }
    setPannerPosition(slot.panner, position[0], position[1] + 1.5, position[2]);
  }

  /** Lookahead scheduling of the two-tone alternation, plus doppler via detune. */
  tick(now: number, lisPos: ArrayLike<number>, lisVel: ArrayLike<number>, lookahead = 0.2): void {
    for (let i = 0; i < this.slots.length; i++) {
      const s = this.slots[i];
      s.gate.update(now);
      if (s.id === -1) continue;
      while (s.nextSwitch < now + lookahead) {
        s.high = !s.high;
        // fast glide between tones, like a compressor siren
        s.osc.frequency.setTargetAtTime(s.high ? SIREN_HI : SIREN_LO, Math.max(s.nextSwitch, now), 0.012);
        s.nextSwitch = Math.max(s.nextSwitch, now) + SIREN_HALF;
      }
      const d = dopplerFactor(s.pos, s.vel, lisPos, lisVel);
      s.dop += (d - s.dop) * 0.3;
      s.osc.detune.setTargetAtTime(1200 * Math.log2(s.dop), now, 0.03);
    }
  }

  dispose(): void {
    for (const n of this.nodes) { try { (n as AudioScheduledSourceNode).stop?.(); } catch { /* */ } n.disconnect(); }
  }
}
