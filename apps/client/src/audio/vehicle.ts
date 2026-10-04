// Player vehicle audio: drives the worklet synthesiser (or a native-node fallback), routes its 4 stems
// to an exterior HRTF path (chase camera) and an interior "through the firewall" path (cockpit), adds
// wind noise and the player horn.

import type { AudioBuffers } from './buffers';
import { loopSource } from './buffers';
import { VEHICLE_PARAMS, VEHICLE_PROCESSOR_NAME, type VehicleParamName } from './engineWorklet';
import {
  clamp, clamp01, dopplerFactor, Gate, glide, makeDriveCurve, makeEngineWave, makeHarmonicWave, makePanner,
  setPannerPosition, smoothstep,
} from './util';

export interface VehicleAudioState {
  rpm: number; idleRpm: number; maxRpm: number;
  throttle: number;
  load: number;
  gear: number;
  shifting: boolean;
  speed: number;
  wheelSlip: number[];
  wheelSurface: number[];
  suspensionHit: number;
  electricMode: boolean;
  cylinders: number;
}

export interface VehicleBuses {
  engineExt: AudioNode; engineInt: AudioNode;
  sfxExt: AudioNode; sfxInt: AudioNode;
  reverbSend: AudioNode;
}

/** Common interface of the worklet and the fallback synth: 4-channel output + named param setters. */
interface VehicleSynth {
  output: AudioNode; // 4 channels
  set(name: VehicleParamName, v: number): void;
  dispose(): void;
}

class WorkletSynth implements VehicleSynth {
  readonly output: AudioWorkletNode;
  private params: Map<string, AudioParam>;
  private table: AudioParam[] = [];
  constructor(ctx: BaseAudioContext) {
    this.output = new AudioWorkletNode(ctx, VEHICLE_PROCESSOR_NAME, {
      numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [4],
    });
    this.params = this.output.parameters as unknown as Map<string, AudioParam>;
    for (const n of VEHICLE_PARAMS) {
      const p = this.params.get(n);
      if (!p) throw new Error('missing worklet param ' + n);
      this.table.push(p);
    }
  }
  set(name: VehicleParamName, v: number): void {
    // direct value writes: the worklet does its own per-sample smoothing (no automation events, no allocation)
    const p = this.table[PARAM_INDEX[name]];
    if (Number.isFinite(v)) p.value = v;
  }
  dispose(): void { this.output.disconnect(); this.output.port.close(); }
}

const PARAM_INDEX = {} as Record<VehicleParamName, number>;
VEHICLE_PARAMS.forEach((n, i) => { PARAM_INDEX[n] = i; });

/** Oscillator-based fallback when AudioWorklet is unavailable. Same 4 stems, simpler sound. */
class FallbackSynth implements VehicleSynth {
  readonly output: ChannelMergerNode;
  private v = new Float32Array(VEHICLE_PARAMS.length);
  private nodes: AudioNode[] = [];
  private eng: OscillatorNode; private engLp: BiquadFilterNode; private engG: GainNode;
  private rough: BiquadFilterNode; private roughG: GainNode;
  private intake: BiquadFilterNode; private intakeG: GainNode;
  private turbo: OscillatorNode; private turboG: GainNode;
  private evOsc: OscillatorNode; private evG: GainNode;
  private sqOsc: OscillatorNode; private sqG: GainNode; private sqN: BiquadFilterNode; private sqNG: GainNode;
  private road: BiquadFilterNode; private roadG: GainNode;
  private cobOsc: OscillatorNode; private cobG: GainNode;
  private lastCyl = 0;
  constructor(private ctx: BaseAudioContext, buffers: AudioBuffers) {
    const m = ctx.createChannelMerger(4);
    this.output = m;
    const noise = loopSource(ctx, buffers.white, 0.3);
    const g = (v: number): GainNode => { const n = ctx.createGain(); n.gain.value = v; this.nodes.push(n); return n; };
    const f = (type: BiquadFilterType, fr: number, q: number): BiquadFilterNode => {
      const n = ctx.createBiquadFilter(); n.type = type; n.frequency.value = fr; n.Q.value = q; this.nodes.push(n); return n;
    };
    this.eng = ctx.createOscillator();
    this.eng.setPeriodicWave(makeEngineWave(ctx, 4, 0.6, 0.4));
    this.engLp = f('lowpass', 600, 0.7); this.engG = g(0);
    this.eng.connect(this.engLp).connect(this.engG).connect(m, 0, 0);
    this.rough = f('bandpass', 1500, 0.8); this.roughG = g(0);
    noise.connect(this.rough).connect(this.roughG).connect(m, 0, 0);
    this.intake = f('bandpass', 500, 1.2); this.intakeG = g(0);
    noise.connect(this.intake).connect(this.intakeG).connect(m, 0, 1);
    this.turbo = ctx.createOscillator(); this.turboG = g(0);
    this.turbo.connect(this.turboG).connect(m, 0, 1);
    this.evOsc = ctx.createOscillator(); this.evG = g(0);
    this.evOsc.connect(this.evG).connect(m, 0, 1);
    this.sqOsc = ctx.createOscillator(); this.sqG = g(0);
    this.sqOsc.setPeriodicWave(makeHarmonicWave(ctx, [1, 0.35, 0.12]));
    this.sqOsc.connect(this.sqG).connect(m, 0, 2);
    this.sqN = f('bandpass', 1300, 2.2); this.sqNG = g(0);
    noise.connect(this.sqN).connect(this.sqNG).connect(m, 0, 2);
    this.road = f('lowpass', 320, 0.7); this.roadG = g(0);
    noise.connect(this.road).connect(this.roadG).connect(m, 0, 3);
    this.cobOsc = ctx.createOscillator(); this.cobOsc.type = 'square';
    const cobLp = f('lowpass', 140, 2); this.cobG = g(0);
    this.cobOsc.connect(cobLp).connect(this.cobG).connect(m, 0, 3);
    const t = ctx.currentTime;
    for (const o of [this.eng, this.turbo, this.evOsc, this.sqOsc, this.cobOsc]) { o.start(t); this.nodes.push(o); }
    this.nodes.push(noise);
    this.v[PARAM_INDEX.idleRpm] = 800; this.v[PARAM_INDEX.maxRpm] = 6500; this.v[PARAM_INDEX.cyl] = 4; this.v[PARAM_INDEX.active] = 1;
  }
  set(name: VehicleParamName, v: number): void { if (Number.isFinite(v)) this.v[PARAM_INDEX[name]] = v; }
  /** Called once per frame after all set() calls. */
  apply(now: number): void {
    const v = this.v, I = PARAM_INDEX;
    const rpm = v[I.rpm], idle = v[I.idleRpm], maxR = Math.max(idle + 500, v[I.maxRpm]);
    const cyl = clamp(Math.round(v[I.cyl]), 1, 16);
    if (cyl !== this.lastCyl) { this.lastCyl = cyl; this.eng.setPeriodicWave(makeEngineWave(this.ctx, cyl, 0.6, 0.4)); }
    const thr = clamp01(v[I.throttle]), load = clamp(v[I.load], -1, 1), speed = Math.max(0, v[I.speed]);
    const push = clamp01(0.45 * thr + 0.55 * Math.max(0, load));
    const rpmN = clamp01((rpm - idle) / (maxR - idle));
    const on = (1 - clamp01(v[I.ev])) * (v[I.active] > 0.5 ? 1 : 0) * (1 - 0.6 * clamp01(v[I.shift]));
    const tc = 0.03;
    glide(this.eng.frequency, rpm / 120, now, 0.02);
    glide(this.engLp.frequency, 300 + push * 2500 + rpmN * 1500, now, tc);
    glide(this.engG.gain, on * (0.25 + 0.35 * push + 0.2 * rpmN) * 0.6, now, tc);
    glide(this.roughG.gain, on * push * 0.15, now, tc);
    glide(this.intake.frequency, 200 + rpmN * 1100, now, tc);
    glide(this.intakeG.gain, on * thr * (0.1 + rpmN) * 0.15, now, tc);
    const spool = on * clamp01(Math.max(0, load) * thr) * smoothstep(1400, 3800, rpm);
    glide(this.turbo.frequency, 2300 + 5000 * spool, now, 0.3);
    glide(this.turboG.gain, spool * spool * 0.02, now, 0.3);
    glide(this.evOsc.frequency, 25 + speed * 68, now, tc);
    glide(this.evG.gain, (0.06 + 0.94 * clamp01(v[I.ev])) * smoothstep(0.2, 2.5, speed) * 0.04, now, tc);
    const sq = Math.max(v[I.squealF], v[I.squealR]);
    glide(this.sqOsc.frequency, 1050 - 240 * clamp01(sq), now, 0.05);
    glide(this.sqG.gain, clamp01(sq) * 0.12, now, 0.04);
    glide(this.sqNG.gain, clamp01(sq) * 0.2, now, 0.04);
    const sN = clamp(speed / 30, 0, 1.5);
    glide(this.roadG.gain, sN * 0.3 + clamp01(v[I.scrub]) * 0.2, now, tc);
    glide(this.cobOsc.frequency, Math.max(1, speed / 0.13), now, tc);
    glide(this.cobG.gain, clamp01(v[I.cobble]) * clamp(speed / 7, 0, 1.2) * 0.25, now, tc);
  }
  dispose(): void {
    for (const n of this.nodes) { try { (n as AudioScheduledSourceNode).stop?.(); } catch { /* */ } n.disconnect(); }
    this.output.disconnect();
  }
}

export class PlayerVehicle {
  private synth: VehicleSynth;
  private fallback: FallbackSynth | null = null;
  readonly usingWorklet: boolean;
  private splitter: ChannelSplitterNode;
  private extMix: GainNode; private intMix: GainNode;
  private panner: PannerNode;
  private hornPanner: PannerNode;
  private windBp: BiquadFilterNode; private windExtG: GainNode; private windIntG: GainNode; private windIntBp: BiquadFilterNode;
  private hornOscA: OscillatorNode; private hornOscB: OscillatorNode; private hornG: GainNode;
  private hornExt: GainNode; private hornInt: GainNode;
  private hornGate: Gate; private extGate: Gate; private extSendGate: Gate; private intGate: Gate;
  private windGate: Gate; private windIntGate: Gate;
  private nodes: AudioNode[] = [];
  private interior = 0;
  private hornOn = false;
  // velocity estimate for doppler (allocation-free)
  private lastPos = new Float64Array(3);
  private vel = new Float64Array(3);
  private lastT = -1;
  private doppler = 1;
  private thumpUntil = 0;
  private cyl = 4; private idle = 800; private maxR = 6500;
  private wet = 0;

  constructor(private ctx: BaseAudioContext, buffers: AudioBuffers, buses: VehicleBuses, useWorklet: boolean) {
    let synth: VehicleSynth | null = null;
    if (useWorklet) {
      try { synth = new WorkletSynth(ctx); } catch (e) { console.warn('[audio] worklet synth failed, using fallback', e); }
    }
    if (!synth) { this.fallback = new FallbackSynth(ctx, buffers); synth = this.fallback; }
    this.synth = synth;
    this.usingWorklet = !this.fallback;

    const g = (v: number): GainNode => { const n = ctx.createGain(); n.gain.value = v; this.nodes.push(n); return n; };
    const f = (type: BiquadFilterType, fr: number, q: number, gainDb = 0): BiquadFilterNode => {
      const n = ctx.createBiquadFilter(); n.type = type; n.frequency.value = fr; n.Q.value = q; n.gain.value = gainDb; this.nodes.push(n); return n;
    };

    this.splitter = ctx.createChannelSplitter(4);
    synth.output.connect(this.splitter);

    // ---- exterior: stems -> mono mix -> HRTF panner at the car ----
    this.extMix = g(1);
    this.panner = makePanner(ctx, 4, 1, 500);
    const exStem = [g(1.0), g(0.55), g(0.9), g(0.75)];
    for (let c = 0; c < 4; c++) { this.splitter.connect(exStem[c], c); exStem[c].connect(this.extMix); }
    this.extMix.connect(this.panner);
    const send = g(0.5); this.extMix.connect(send);
    // only the active camera path is connected (the other one costs nothing while disconnected)
    this.extGate = new Gate(this.panner, buses.engineExt, true);
    this.extSendGate = new Gate(send, buses.reverbSend, true);

    // ---- interior: muffled through the firewall, boomy cabin, road noise prominent ----
    this.intMix = g(0);
    const eLp = f('lowpass', 620, 0.8), eBoom = f('peaking', 78, 1.1, 7), eG = g(0.5);
    this.splitter.connect(eLp, 0); eLp.connect(eBoom).connect(eG).connect(this.intMix);
    const iLp = f('lowpass', 2400, 0.7), iG = g(0.45);
    this.splitter.connect(iLp, 1); iLp.connect(iG).connect(this.intMix);
    const tLp = f('lowpass', 1900, 0.7), tG = g(0.55);
    this.splitter.connect(tLp, 2); tLp.connect(tG).connect(this.intMix);
    const rLp = f('lowpass', 950, 0.7), rPk = f('peaking', 105, 1.2, 4), rG = g(0.8);
    this.splitter.connect(rLp, 3); rLp.connect(rPk).connect(rG).connect(this.intMix);
    this.intGate = new Gate(this.intMix, buses.engineInt);

    // ---- wind ----
    const wind = loopSource(ctx, buffers.pink, 0.71);
    this.nodes.push(wind);
    this.windBp = f('bandpass', 300, 0.5);
    this.windExtG = g(0);
    wind.connect(this.windBp).connect(this.windExtG);
    this.windIntBp = f('bandpass', 1100, 0.9);
    this.windIntG = g(0);
    wind.connect(this.windIntBp).connect(this.windIntG);
    // wind is inaudible below ~2 m/s: disconnect it then
    this.windGate = new Gate(this.windExtG, buses.engineExt);
    this.windIntGate = new Gate(this.windIntG, buses.engineInt);

    // ---- player horn: two-tone (major third) European horn, diaphragm buzz + trumpet formant ----
    const hornWave = makeHarmonicWave(ctx, [1, 0.7, 0.55, 0.42, 0.3, 0.22, 0.16, 0.11, 0.08, 0.05, 0.035, 0.02]);
    this.hornOscA = ctx.createOscillator(); this.hornOscA.setPeriodicWave(hornWave); this.hornOscA.frequency.value = 410;
    this.hornOscB = ctx.createOscillator(); this.hornOscB.setPeriodicWave(hornWave); this.hornOscB.frequency.value = 512;
    const hA = g(0.5), hB = g(0.5);
    const shaper = ctx.createWaveShaper(); shaper.curve = makeDriveCurve(2.2); this.nodes.push(shaper);
    const hPk = f('peaking', 2300, 1.4, 6), hLp = f('lowpass', 5200, 0.7), hHp = f('highpass', 280, 0.7);
    this.hornG = g(0);
    this.hornOscA.connect(hA).connect(shaper); this.hornOscB.connect(hB).connect(shaper);
    shaper.connect(hHp).connect(hPk).connect(hLp).connect(this.hornG);
    this.hornPanner = makePanner(ctx, 6, 1, 600);
    this.hornExt = g(0.32); this.hornInt = g(0);
    const hIntLp = f('lowpass', 1500, 0.7);
    const hornOut = g(1);
    this.hornGate = new Gate(this.hornG, hornOut); // horn synth only rendered while sounding
    hornOut.connect(this.hornExt).connect(this.hornPanner).connect(buses.sfxExt);
    hornOut.connect(hIntLp).connect(this.hornInt).connect(buses.sfxInt);
    const t = ctx.currentTime;
    this.hornOscA.start(t); this.hornOscB.start(t);
    this.nodes.push(this.hornOscA, this.hornOscB, this.splitter, this.panner, this.hornPanner);
  }

  setInterior(on: boolean, now: number): void {
    const v = on ? 1 : 0;
    if (v === this.interior) return;
    this.interior = v;
    glide(this.extMix.gain, 1 - v, now, 0.04);
    glide(this.intMix.gain, v, now, 0.04);
    glide(this.hornExt.gain, on ? 0 : 0.32, now, 0.04);
    glide(this.hornInt.gain, on ? 0.2 : 0, now, 0.04);
    const inGate = on ? this.intGate : this.extGate, outGate = on ? this.extGate : this.intGate;
    inGate.open(); outGate.closeAfter(now + 0.35);
    if (on) this.extSendGate.closeAfter(now + 0.35); else this.extSendGate.open();
  }

  setWet(rain: number): void { this.wet = clamp01(rain); }

  setHorn(on: boolean, now: number): void {
    if (on === this.hornOn) return;
    this.hornOn = on;
    this.hornG.gain.cancelScheduledValues(now);
    if (on) {
      this.hornGate.open();
      this.hornG.gain.setTargetAtTime(1, now, 0.008);
      // tiny pitch sag at attack, like a real diaphragm horn
      this.hornOscA.frequency.setValueAtTime(400, now); this.hornOscA.frequency.setTargetAtTime(410, now, 0.03);
      this.hornOscB.frequency.setValueAtTime(500, now); this.hornOscB.frequency.setTargetAtTime(512, now, 0.03);
    } else {
      this.hornG.gain.setTargetAtTime(0, now, 0.025);
      this.hornGate.closeAfter(now + 0.3);
    }
  }

  update(s: VehicleAudioState, pos: ArrayLike<number>, lisPos: ArrayLike<number>, lisVel: ArrayLike<number>, now: number): void {
    const syn = this.synth;
    // ---- velocity estimate from position deltas (for doppler on the exterior engine) ----
    const lp = this.lastPos, v = this.vel;
    if (this.lastT >= 0) {
      const dt = now - this.lastT;
      if (dt > 0.004 && dt < 0.25) {
        const a = clamp(dt * 8, 0, 1);
        v[0] += ((pos[0] - lp[0]) / dt - v[0]) * a;
        v[1] += ((pos[1] - lp[1]) / dt - v[1]) * a;
        v[2] += ((pos[2] - lp[2]) / dt - v[2]) * a;
      }
    }
    if (now !== this.lastT) { lp[0] = pos[0]; lp[1] = pos[1]; lp[2] = pos[2]; this.lastT = now; }
    const dop = this.interior ? 1 : dopplerFactor(pos, v, lisPos, lisVel);
    this.doppler += (dop - this.doppler) * 0.25;

    // ---- engine ----
    const cyl = s.cylinders > 0 ? s.cylinders : 4;
    if (cyl !== this.cyl) { this.cyl = cyl; syn.set('cyl', cyl); }
    if (s.idleRpm !== this.idle) { this.idle = s.idleRpm; syn.set('idleRpm', s.idleRpm); }
    if (s.maxRpm !== this.maxR) { this.maxR = s.maxRpm; syn.set('maxRpm', s.maxRpm); }
    syn.set('rpm', s.rpm * this.doppler);
    syn.set('throttle', s.throttle);
    syn.set('load', s.load);
    syn.set('shift', s.shifting ? 1 : 0);
    syn.set('speed', s.speed);
    syn.set('ev', s.electricMode ? 1 : 0);
    syn.set('wet', this.wet);

    // ---- tyres: per-wheel slip -> front/rear squeal energy, off-road scrub, surface mix ----
    let eF = 0, eR = 0, scrub = 0, scrubGrass = 0, cob = 0, grav = 0, grass = 0;
    const slip = s.wheelSlip, surf = s.wheelSurface;
    for (let i = 0; i < 4; i++) {
      const sl = slip[i] ?? 0;
      const su = surf[i] ?? 0;
      if (su === 1) cob++; else if (su === 2) grav++; else if (su === 3) grass++;
      if (su <= 1) {
        const q = smoothstep(0.15, 1.0, sl) * (su === 1 ? 0.7 : 1) * (1 + 0.2 * clamp(sl - 1, 0, 1));
        if (i < 2) eF += q * q; else eR += q * q;
      } else {
        const q = smoothstep(0.05, 0.8, sl);
        scrub += q * q;
        if (su === 3) scrubGrass += q * q;
      }
    }
    syn.set('squealF', Math.min(1.3, Math.sqrt(eF)));
    syn.set('squealR', Math.min(1.3, Math.sqrt(eR)));
    syn.set('scrub', Math.min(1.3, Math.sqrt(scrub)));
    syn.set('scrubKind', scrub > 1e-6 ? scrubGrass / scrub : 0);
    syn.set('cobble', cob * 0.25);
    syn.set('gravel', grav * 0.25);
    syn.set('grass', grass * 0.25);
    // suspension thump: hold the impulse for a few render quanta so the worklet always sees the edge
    if (s.suspensionHit > 0.05) { syn.set('thump', s.suspensionHit); this.thumpUntil = now + 0.03; }
    else if (now > this.thumpUntil) syn.set('thump', 0);
    if (this.fallback) this.fallback.apply(now);

    // ---- wind ∝ speed² ----
    const sp = Math.max(0, s.speed);
    const w2 = sp * sp;
    if (sp > 2) { this.windGate.open(); this.windIntGate.open(); }
    else { this.windGate.closeAfter(now + 0.5); this.windIntGate.closeAfter(now + 0.5); }
    this.windGate.update(now); this.windIntGate.update(now);
    glide(this.windBp.frequency, 220 + sp * 16, now, 0.1);
    glide(this.windExtG.gain, Math.min(0.4, w2 * 0.00022), now, 0.08);
    glide(this.windIntBp.frequency, 700 + sp * 22, now, 0.1);
    glide(this.windIntG.gain, Math.min(0.2, w2 * 0.00011), now, 0.08);

    this.hornGate.update(now); this.extGate.update(now); this.extSendGate.update(now); this.intGate.update(now);

    // ---- position ----
    setPannerPosition(this.panner, pos[0], pos[1] + 0.5, pos[2]);
    setPannerPosition(this.hornPanner, pos[0], pos[1] + 0.6, pos[2]);
  }

  setActive(on: boolean): void { this.synth.set('active', on ? 1 : 0); }

  dispose(): void {
    this.synth.dispose();
    for (const n of this.nodes) { try { (n as AudioScheduledSourceNode).stop?.(); } catch { /* */ } n.disconnect(); }
  }
}
