// AudioSystem: the game-facing facade of the procedural audio engine (Web Audio API).
//
// Signal flow (all synthesised in real time, no audio assets):
//
//   player vehicle (AudioWorklet synth, 4 stems) ─┬─ exterior HRTF panner ─► engineExt ┐
//                                                 └─ interior firewall EQ ─► engineInt │
//   traffic voices / sirens / horns / collisions ─► sfxExt (HRTF panners)              │ ext ─► extLP/cabin EQ ─┐
//   city ambience bed + events ─────────────────► ambExt (ducked)                     ┘                       │
//   rain on roof, indicator, wipers, interior engine ─► *Int ───────────────────────────► cabin ──────────────────┤
//   street / tunnel reverbs (fed by ext sends) ─► extLP                                                          ├─► master ─► glue comp ─► limiter ─► soft clip ─► out
//   radio stations ─► radio bus (ducked) ─► camera filter (clear in cockpit, muffled outside) ───────────────────┤
//   UI ─► ui bus ────────────────────────────────────────────────────────────────────────────────────────────────┘

import { Ambience, type EnvironmentState } from './ambience';
import { generateBuffers, type AudioBuffers } from './buffers';
import { vehicleWorkletSource } from './engineWorklet';
import { Radio } from './radio/Radio';
import { SfxSystem, Synth, type AiHornKind, type CollisionMaterial, type UiKind } from './sfx';
import { Sirens, TrafficVoices, type TrafficVoiceInput } from './traffic';
import { clamp01, Gate, glide, makeLightReverb, makeSoftClipCurve, Rng } from './util';
import { PlayerVehicle, type VehicleAudioState } from './vehicle';

export type { VehicleAudioState } from './vehicle';
export type { TrafficVoiceInput, TrafficKind } from './traffic';
export type { CollisionMaterial, UiKind, AiHornKind } from './sfx';
export type { EnvironmentState } from './ambience';

export interface ListenerState {
  position: [number, number, number];
  forward: [number, number, number];
  up: [number, number, number];
  velocity: [number, number, number];
  /** cockpit camera: low-pass the outside, louder interior */
  interior: boolean;
  inTunnel: boolean;
}

export interface MixVolumes { master: number; engine: number; sfx: number; ambience: number; radio: number; ui: number }

/** Optional init parameters (all optional; `init()` with no argument is the normal game path). */
export interface AudioInitOptions {
  /** Use an existing context, e.g. an OfflineAudioContext for deterministic test renders. */
  context?: BaseAudioContext;
  /** Seed for every procedural generator (buffers, radio tracks, ambience events). */
  seed?: number;
  /** Skip the AudioWorklet and use the oscillator fallback engine (testing). */
  forceFallback?: boolean;
  /** Radio tracks of 4 bars so that jingles can be heard quickly (testing). */
  radioShortTracks?: boolean;
}

const DEFAULT_VOLUMES: MixVolumes = { master: 0.9, engine: 0.85, sfx: 0.9, ambience: 0.8, radio: 0.7, ui: 0.8 };

interface Graph {
  master: GainNode;
  analyser: AnalyserNode;
  extLP: BiquadFilterNode; extBody: BiquadFilterNode; extOut: GainNode;
  revIn: GainNode; streetSend: GainNode; tunnelSend: GainNode; tunnelGate: Gate;
  engineExt: GainNode; engineInt: GainNode;
  sfxExt: GainNode; sfxInt: GainNode;
  ambExt: GainNode; ambInt: GainNode; ambDuck: GainNode; ambDuckInt: GainNode;
  radioIn: GainNode; radioDuck: GainNode; radioVol: GainNode; radioLP: BiquadFilterNode; radioCam: GainNode;
  ui: GainNode;
  all: AudioNode[];
}

export class AudioSystem {
  private ctx: BaseAudioContext | null = null;
  private ownsContext = false;
  private _ready = false;
  private initPromise: Promise<void> | null = null;
  private disposed = false;
  private g: Graph | null = null;
  private buffers: AudioBuffers | null = null;
  private player: PlayerVehicle | null = null;
  private traffic: TrafficVoices | null = null;
  private sirens: Sirens | null = null;
  private sfx: SfxSystem | null = null;
  private ambience: Ambience | null = null;
  private radio: Radio | null = null;
  private interval: ReturnType<typeof setInterval> | null = null;
  private vol: MixVolumes = { ...DEFAULT_VOLUMES };
  private _usingWorklet = false;
  // listener state (pre-allocated)
  private lisPos = new Float64Array(3);
  private lisVel = new Float64Array(3);
  private interior = false;
  private tunnel = false;
  private lastTick = -1;
  // ducking
  private hornOn = false;
  private uiDuckUntil = 0;
  private duckLevel = 1;
  private stationInfo: Array<{ name: string; genre: string }> = [];

  constructor() { /* nothing: the AudioContext is created in init() after a user gesture */ }

  get ready(): boolean { return this._ready; }
  /** true when the AudioWorklet engine is running, false when the oscillator fallback is used */
  get usingWorklet(): boolean { return this._usingWorklet; }
  /** underlying context (null before init) */
  get context(): BaseAudioContext | null { return this.ctx; }
  /** post-limiter analyser for meters / debug views */
  getAnalyser(): AnalyserNode | null { return this.g ? this.g.analyser : null; }

  init(options: AudioInitOptions = {}): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.doInit(options).catch((e: unknown) => {
        console.warn('[audio] init failed, audio disabled', e);
        this._ready = false;
        if (this.ownsContext && this.ctx) void (this.ctx as AudioContext).close().catch(() => undefined);
        this.ctx = null;
      });
    }
    return this.initPromise;
  }

  private async doInit(o: AudioInitOptions): Promise<void> {
    let ctx: BaseAudioContext;
    if (o.context) ctx = o.context;
    else {
      const Ctor: typeof AudioContext | undefined = typeof AudioContext !== 'undefined'
        ? AudioContext
        : (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) throw new Error('Web Audio API not available');
      ctx = new Ctor({ latencyHint: 'interactive' });
      this.ownsContext = true;
      const rt = ctx as AudioContext;
      if (rt.state === 'suspended') void rt.resume().catch(() => undefined);
    }
    this.ctx = ctx;
    const seed = o.seed ?? ((Date.now() & 0xffff) + 1);

    // ---- worklet (inline Blob URL so it works with the Vite build and offline) ----
    let worklet = false;
    if (!o.forceFallback && ctx.audioWorklet && typeof AudioWorkletNode !== 'undefined') {
      let url = '';
      try {
        url = URL.createObjectURL(new Blob([vehicleWorkletSource()], { type: 'application/javascript' }));
        // never hang init: some environments (CSP without blob:, broken worklet threads) never settle
        await Promise.race([
          ctx.audioWorklet.addModule(url),
          new Promise<never>((_, rej) => setTimeout(() => rej(new Error('addModule timeout')), 5000)),
        ]);
        worklet = true;
      } catch (e) {
        console.warn('[audio] AudioWorklet unavailable, using fallback engine', e);
      } finally {
        if (url) URL.revokeObjectURL(url);
      }
    }
    if (this.disposed) return;

    const buffers = (this.buffers = generateBuffers(ctx, seed));
    const g = (this.g = this.buildGraph(ctx, buffers));
    const rng = new Rng(seed ^ 0xabcdef);
    const synth = new Synth(ctx, buffers, rng);

    this.player = new PlayerVehicle(ctx, buffers, {
      engineExt: g.engineExt, engineInt: g.engineInt, sfxExt: g.sfxExt, sfxInt: g.sfxInt, reverbSend: g.revIn,
    }, worklet);
    this._usingWorklet = this.player.usingWorklet;
    this.traffic = new TrafficVoices(ctx, buffers, g.sfxExt, 8);
    this.sirens = new Sirens(ctx, g.sfxExt, 2);
    this.sfx = new SfxSystem(synth, g.sfxExt, g.sfxInt, g.ui);
    this.ambience = new Ambience(synth, g.ambDuck, g.ambDuckInt);
    this.radio = new Radio(ctx, buffers, g.radioIn, seed, !!o.radioShortTracks);
    this.stationInfo = this.radio.stations.map((s) => ({ name: s.name, genre: s.genre }));
    this.ambience.set({ hour: 12, rain: 0, trafficDensity: 0.5, nearRiver: 0, nearPark: 0 }, ctx.currentTime);
    this.sfx.setInteriorFactor(false, ctx.currentTime);
    this.applyVolumes();

    if (this.ownsContext) this.interval = setInterval(() => this.tick(), 50);
    this._ready = true;
  }

  private buildGraph(ctx: BaseAudioContext, buffers: AudioBuffers): Graph {
    const all: AudioNode[] = [];
    const gain = (v = 1): GainNode => { const n = ctx.createGain(); n.gain.value = v; all.push(n); return n; };
    const filt = (type: BiquadFilterType, f: number, q: number, db = 0): BiquadFilterNode => {
      const n = ctx.createBiquadFilter(); n.type = type; n.frequency.value = f; n.Q.value = q; n.gain.value = db; all.push(n); return n;
    };

    // ---- master: glue compressor -> limiter -> soft clipper (guarantees |out| < 1) ----
    const master = gain(this.vol.master);
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 3; comp.attack.value = 0.008; comp.release.value = 0.25;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -3; limiter.knee.value = 0; limiter.ratio.value = 20; limiter.attack.value = 0.001; limiter.release.value = 0.1;
    const clip = ctx.createWaveShaper(); clip.curve = makeSoftClipCurve(0.82, 0.97);
    const analyser = ctx.createAnalyser(); analyser.fftSize = 2048; analyser.smoothingTimeConstant = 0.6;
    master.connect(comp).connect(limiter).connect(clip).connect(ctx.destination);
    clip.connect(analyser);
    all.push(comp, limiter, clip, analyser);

    // ---- exterior world chain (low-passed + cabin resonance in cockpit view) ----
    const extIn = gain(1);
    const extLP = filt('lowpass', 20000, 0.5);
    const extBody = filt('peaking', 120, 1.0, 0);
    const extOut = gain(1);
    extIn.connect(extLP).connect(extBody).connect(extOut).connect(master);
    // reverbs: street (urban canyon, cheap native FDN, always on) and tunnel (convolver, only connected
    // while in a tunnel); their returns go through the exterior filter
    const streetSend = gain(1), tunnelSend = gain(0);
    const revIn = gain(1);
    const street = makeLightReverb(ctx, 0.9, 3800);
    const tunnel = ctx.createConvolver(); tunnel.buffer = buffers.tunnelIR;
    const streetRet = gain(0.09), tunnelRet = gain(0.55);
    revIn.connect(streetSend).connect(street.input);
    street.output.connect(streetRet).connect(extLP);
    revIn.connect(tunnelSend).connect(tunnel).connect(tunnelRet);
    const tunnelGate = new Gate(tunnelRet, extLP);
    all.push(street.input, street.output, tunnel);
    const cabin = gain(1);
    cabin.connect(master);

    const engineExt = gain(), engineInt = gain(), sfxExt = gain(), sfxInt = gain();
    engineExt.connect(extIn); engineInt.connect(cabin);
    sfxExt.connect(extIn); sfxInt.connect(cabin);
    const sfxVerb = gain(0.5); sfxExt.connect(sfxVerb).connect(revIn);
    const engVerb = gain(0.35); engineExt.connect(engVerb).connect(revIn);
    const ambDuck = gain(1), ambDuckInt = gain(1), ambExt = gain(), ambInt = gain();
    ambDuck.connect(ambExt).connect(extIn);
    ambDuckInt.connect(ambInt).connect(cabin);
    const radioIn = gain(1), radioDuck = gain(1), radioVol = gain();
    const radioLP = filt('lowpass', 1500, 0.6);
    const radioCam = gain(0.3);
    radioIn.connect(radioDuck).connect(radioVol).connect(radioLP).connect(radioCam).connect(master);
    const ui = gain();
    ui.connect(master);

    return {
      master, analyser, extLP, extBody, extOut, revIn, streetSend, tunnelSend, tunnelGate,
      engineExt, engineInt, sfxExt, sfxInt, ambExt, ambInt, ambDuck, ambDuckInt,
      radioIn, radioDuck, radioVol, radioLP, radioCam, ui,
      all,
    };
  }

  private applyVolumes(): void {
    const g = this.g, ctx = this.ctx;
    if (!g || !ctx) return;
    const now = ctx.currentTime, v = this.vol, tc = 0.05;
    glide(g.master.gain, v.master, now, tc);
    glide(g.engineExt.gain, v.engine, now, tc); glide(g.engineInt.gain, v.engine, now, tc);
    glide(g.sfxExt.gain, v.sfx, now, tc); glide(g.sfxInt.gain, v.sfx, now, tc);
    glide(g.ambExt.gain, v.ambience, now, tc); glide(g.ambInt.gain, v.ambience, now, tc);
    glide(g.radioVol.gain, v.radio, now, tc);
    glide(g.ui.gain, v.ui, now, tc);
  }

  // ------------------------------------------------------------------------------------------------
  suspend(): void {
    if (!this._ready || !this.ctx) return;
    const c = this.ctx as AudioContext;
    if (this.ownsContext && typeof c.suspend === 'function') void c.suspend().catch(() => undefined);
  }

  resume(): void {
    if (!this.ctx) return;
    const c = this.ctx as AudioContext;
    if (this.ownsContext && typeof c.resume === 'function') void c.resume().catch(() => undefined);
  }

  setListener(s: ListenerState): void {
    if (!this._ready || !this.ctx || !this.g) return;
    const ctx = this.ctx, now = ctx.currentTime;
    const p = s.position, f = s.forward, u = s.up, v = s.velocity;
    if (Number.isFinite(p[0] + p[1] + p[2])) { this.lisPos[0] = p[0]; this.lisPos[1] = p[1]; this.lisPos[2] = p[2]; }
    if (Number.isFinite(v[0] + v[1] + v[2])) { this.lisVel[0] = v[0]; this.lisVel[1] = v[1]; this.lisVel[2] = v[2]; }
    const L = ctx.listener;
    if (L.positionX) {
      // plain value writes (automation would force every HRTF panner onto its per-sample path)
      L.positionX.value = this.lisPos[0]; L.positionY.value = this.lisPos[1]; L.positionZ.value = this.lisPos[2];
      if (Number.isFinite(f[0] + f[1] + f[2] + u[0] + u[1] + u[2])) {
        L.forwardX.value = f[0]; L.forwardY.value = f[1]; L.forwardZ.value = f[2];
        L.upX.value = u[0]; L.upY.value = u[1]; L.upZ.value = u[2];
      }
    } else {
      const legacy = L as unknown as { setPosition(x: number, y: number, z: number): void; setOrientation(a: number, b: number, c: number, d: number, e: number, f: number): void };
      legacy.setPosition(this.lisPos[0], this.lisPos[1], this.lisPos[2]);
      legacy.setOrientation(f[0], f[1], f[2], u[0], u[1], u[2]);
    }
    if (s.interior !== this.interior) this.setInterior(s.interior, now);
    if (s.inTunnel !== this.tunnel) this.setTunnel(s.inTunnel, now);
    this.tick();
  }

  private setInterior(on: boolean, now: number): void {
    const g = this.g;
    if (!g) return;
    this.interior = on;
    const tc = 0.05;
    glide(g.extLP.frequency, on ? 1200 : 20000, now, tc);
    glide(g.extBody.gain, on ? 4 : 0, now, tc);
    glide(g.extOut.gain, on ? 0.6 : 1, now, tc);
    glide(g.radioLP.frequency, on ? 20000 : 1500, now, tc);
    glide(g.radioCam.gain, on ? 1 : 0.3, now, tc);
    this.player?.setInterior(on, now);
    this.ambience?.setInterior(on, now);
    this.sfx?.setInteriorFactor(on, now);
  }

  private setTunnel(on: boolean, now: number): void {
    const g = this.g;
    if (!g) return;
    this.tunnel = on;
    glide(g.streetSend.gain, on ? 0 : 1, now, 0.3);
    glide(g.tunnelSend.gain, on ? 1 : 0, now, 0.3);
    if (on) g.tunnelGate.open(); else g.tunnelGate.closeAfter(now + 4);
    this.ambience?.setTunnel(on, now);
  }

  /** Scheduler pump: radio, sirens, cabin loops, ambience events, ducking. Called from setListener and a timer. */
  private tick(): void {
    if (!this._ready || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - this.lastTick < 0.008) return;
    // adaptive lookahead: when ticks get sparse (background tab: timers throttled to ~1 Hz) schedule further ahead
    const gap = this.lastTick < 0 ? 0 : now - this.lastTick;
    const ahead = Math.min(2.5, Math.max(0.3, gap * 1.6 + 0.1));
    this.lastTick = now;
    this.g!.tunnelGate.update(now);
    this.sirens!.tick(now, this.lisPos, this.lisVel, ahead);
    this.sfx!.tick(now, ahead);
    this.ambience!.tick(now, ahead);
    this.radio!.tick(now, ahead);
    // ducking of ambience + radio under the horn and UI notifications
    let duck = 1;
    if (this.hornOn) duck = 0.5;
    if (now < this.uiDuckUntil) duck = Math.min(duck, 0.6);
    if (duck !== this.duckLevel) {
      const g = this.g!;
      const tc = duck < this.duckLevel ? 0.04 : 0.35;
      this.duckLevel = duck;
      glide(g.radioDuck.gain, duck, now, tc);
      glide(g.ambDuck.gain, duck, now, tc);
      glide(g.ambDuckInt.gain, duck, now, tc);
    }
  }

  setPlayerVehicle(s: VehicleAudioState, position: [number, number, number]): void {
    if (!this._ready || !this.player || !this.ctx) return;
    this.player.update(s, position, this.lisPos, this.lisVel, this.ctx.currentTime);
  }

  collision(intensity: number, position: [number, number, number], material: CollisionMaterial): void {
    if (!this._ready || !this.sfx || !this.ctx) return;
    this.sfx.collision(intensity, position, material, this.ctx.currentTime);
  }

  setHorn(on: boolean): void {
    if (!this._ready || !this.player || !this.ctx) return;
    this.hornOn = on;
    this.player.setHorn(on, this.ctx.currentTime);
    this.tick();
  }

  playUi(kind: UiKind): void {
    if (!this._ready || !this.sfx || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.sfx.ui(kind, now)) { this.uiDuckUntil = now + 0.7; this.lastTick = now - 0.01; this.tick(); }
  }

  setIndicatorTicking(on: boolean): void {
    if (!this._ready || !this.sfx || !this.ctx) return;
    this.sfx.setIndicator(on, this.ctx.currentTime);
  }

  setWipers(speed: 0 | 1 | 2): void {
    if (!this._ready || !this.sfx || !this.ctx) return;
    this.sfx.setWipers(speed, this.ctx.currentTime);
  }

  setEnvironment(e: EnvironmentState): void {
    if (!this._ready || !this.ambience || !this.ctx) return;
    this.ambience.set(e, this.ctx.currentTime);
    const rain = clamp01(e.rain);
    this.player!.setWet(this.tunnel ? 0 : rain);
    this.sfx!.rain = rain;
  }

  setTrafficVoices(voices: TrafficVoiceInput[]): void {
    if (!this._ready || !this.traffic || !this.ctx) return;
    this.traffic.update(voices, this.lisPos, this.lisVel, this.ctx.currentTime);
  }

  hornAt(position: [number, number, number], kind: AiHornKind): void {
    if (!this._ready || !this.sfx || !this.ctx) return;
    this.sfx.hornAt(position, kind, this.ctx.currentTime);
  }

  siren(id: number, position: [number, number, number] | null): void {
    if (!this._ready || !this.sirens || !this.ctx) return;
    this.sirens.set(id, position, this.ctx.currentTime);
  }

  radioOn(on: boolean): void {
    if (!this._ready || !this.radio || !this.ctx) return;
    this.radio.setOn(on, this.ctx.currentTime);
  }
  radioNext(): void {
    if (!this._ready || !this.radio || !this.ctx) return;
    this.radio.select(1, this.ctx.currentTime);
  }
  radioPrev(): void {
    if (!this._ready || !this.radio || !this.ctx) return;
    this.radio.select(-1, this.ctx.currentTime);
  }
  get radioStation(): { name: string; genre: string } | null {
    if (!this._ready || !this.radio || !this.radio.on) return null;
    return this.stationInfo[this.radio.stations.indexOf(this.radio.station)] ?? null;
  }

  setVolumes(v: Partial<MixVolumes>): void {
    const k = Object.keys(v) as Array<keyof MixVolumes>;
    for (const key of k) {
      const x = v[key];
      if (typeof x === 'number' && Number.isFinite(x)) this.vol[key] = Math.max(0, Math.min(2, x));
    }
    this.applyVolumes();
  }

  dispose(): void {
    this.disposed = true;
    if (this.interval) { clearInterval(this.interval); this.interval = null; }
    try {
      this.player?.dispose(); this.traffic?.dispose(); this.sirens?.dispose(); this.sfx?.dispose();
      this.ambience?.dispose(); this.radio?.dispose();
      this.g?.all.forEach((n) => n.disconnect());
    } catch { /* already gone */ }
    if (this.ownsContext && this.ctx) void (this.ctx as AudioContext).close().catch(() => undefined);
    this.player = null; this.traffic = null; this.sirens = null; this.sfx = null; this.ambience = null; this.radio = null;
    this.g = null; this.ctx = null; this._ready = false;
  }
}
