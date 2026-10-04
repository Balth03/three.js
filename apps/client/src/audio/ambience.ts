// City ambience bed: continuous layers (distant traffic, river, rain, café murmur) built from native
// nodes and looping procedural buffers, plus stochastic events (birds, pigeons, distant horns,
// scooters, boats, thunder, glass clinks) scheduled ahead of time in tick().

import { loopSource } from './buffers';
import type { Synth } from './sfx';
import { clamp01, Gate, glide, smoothstep } from './util';

export interface EnvironmentState {
  hour: number; rain: number; thunder?: boolean; trafficDensity: number; nearRiver: number; nearPark: number;
}

const VOWELS: ReadonlyArray<readonly [number, number]> = [
  [730, 1090], [270, 2290], [530, 1840], [570, 840], [300, 870], [660, 1720], [440, 1020], [400, 1600],
];

interface Speaker {
  osc: OscillatorNode; f1: BiquadFilterNode; f2: BiquadFilterNode; gain: GainNode;
  pitch: number; nextSyl: number; talkUntil: number; quietUntil: number;
}

/** Hour curves (0..24) */
function trafficHour(h: number): number {
  if (h < 5) return 0.22 + 0.05 * Math.cos((h / 5) * Math.PI);
  if (h < 7.5) return 0.25 + 0.75 * smoothstep(5, 7.5, h);
  if (h < 10) return 1;
  if (h < 16.5) return 0.82;
  if (h < 19.5) return 1;
  return 1 - 0.7 * smoothstep(19.5, 24, h);
}
function birdHour(h: number): number {
  if (h < 4.8 || h > 21.5) return 0;
  if (h < 8.5) return smoothstep(4.8, 6.2, h); // dawn chorus
  if (h < 19) return 0.5;
  return 0.5 * (1 - smoothstep(19, 21.5, h)) + 0.15;
}
function chatterHour(h: number): number {
  if (h < 2) return 0.45 * (1 - h / 2) + 0.05;
  if (h < 7) return 0.05;
  if (h < 11.5) return 0.25;
  if (h < 14.5) return 0.6; // lunch terraces
  if (h < 18) return 0.35;
  return 0.35 + 0.65 * smoothstep(18, 20, h); // apéro / dinner
}

export class Ambience {
  private ctx: BaseAudioContext;
  private rumbleG: GainNode; private hissG: GainNode;
  private riverG: GainNode; private trickleG: GainNode;
  private rainG: GainNode; private rainHissG: GainNode; private roofG: GainNode;
  private chatterG: GainNode; private murmurG: GainNode;
  private speakers: Speaker[] = [];
  private gRumble: Gate; private gHiss: Gate; private gRiver: Gate; private gTrickle: Gate;
  private gRain: Gate; private gRainHiss: Gate; private gRoof: Gate; private gChatter: Gate;
  private gates: Gate[];
  private nodes: AudioNode[] = [];
  private env: EnvironmentState = { hour: 12, rain: 0, thunder: false, trafficDensity: 0.5, nearRiver: 0, nearPark: 0 };
  private interior = false;
  private tunnel = false;
  // derived levels
  private lvTraffic = 0; private lvBirds = 0; private lvChatter = 0; private lvRiver = 0; private lvRain = 0;
  // event clocks
  private nBird = -1; private nPigeon = -1; private nHorn = -1; private nScooter = -1; private nBoat = -1; private nThunder = -1; private nClink = -1;
  private thunderWas = false;
  private applied = false;

  constructor(private s: Synth, private ext: AudioNode, int: AudioNode) {
    const ctx = (this.ctx = s.ctx);
    const b = s.buffers;
    const g = (v = 0): GainNode => { const n = ctx.createGain(); n.gain.value = v; this.nodes.push(n); return n; };
    const f = (type: BiquadFilterType, fr: number, q: number): BiquadFilterNode => {
      const n = ctx.createBiquadFilter(); n.type = type; n.frequency.value = fr; n.Q.value = q; this.nodes.push(n); return n;
    };
    const lfo = (freq: number, depth: number, target: AudioParam): void => {
      const o = ctx.createOscillator(); o.frequency.value = freq;
      const d = ctx.createGain(); d.gain.value = depth;
      o.connect(d).connect(target); o.start(ctx.currentTime);
      this.nodes.push(o, d);
    };
    const src = (buf: AudioBuffer, off: number, rate = 1): AudioBufferSourceNode => { const n = loopSource(ctx, buf, off, rate); this.nodes.push(n); return n; };

    // Every continuous layer ends in a Gate: layers at zero level are disconnected and cost nothing.
    // distant traffic: low rumble + mid tyre hiss, with slow swells (waves of traffic at the lights)
    this.rumbleG = g();
    const swell = g(1);
    src(b.brown, 0.1).connect(f('lowpass', 210, 0.6)).connect(this.rumbleG).connect(swell);
    lfo(0.055, 0.25, swell.gain);
    this.gRumble = new Gate(swell, ext);
    this.hissG = g();
    const hissSwell = g(1);
    src(b.pink, 0.4).connect(f('bandpass', 750, 0.6)).connect(this.hissG).connect(hissSwell);
    lfo(0.083, 0.4, hissSwell.gain);
    this.gHiss = new Gate(hissSwell, ext);

    // river: lapping water against the quays
    this.riverG = g();
    const rbp = f('bandpass', 480, 1.1);
    const rsw = g(1);
    src(b.pink, 0.66, 0.9).connect(rbp).connect(this.riverG).connect(rsw);
    lfo(0.31, 160, rbp.frequency);
    lfo(0.47, 0.45, rsw.gain);
    this.gRiver = new Gate(rsw, ext);
    this.trickleG = g();
    const tbp = f('bandpass', 2300, 2.5);
    const tsw = g(1);
    src(b.white, 0.2).connect(tbp).connect(this.trickleG).connect(tsw);
    lfo(1.3, 700, tbp.frequency);
    lfo(0.9, 0.6, tsw.gain);
    this.gTrickle = new Gate(tsw, ext);

    // rain on the ground (exterior) / drumming on the roof (interior)
    this.rainG = g();
    src(b.rainGround, 0.3).connect(this.rainG);
    this.gRain = new Gate(this.rainG, ext);
    this.rainHissG = g();
    src(b.white, 0.55).connect(f('highpass', 5200, 0.7)).connect(this.rainHissG);
    this.gRainHiss = new Gate(this.rainHissG, ext);
    this.roofG = g();
    src(b.rainRoof, 0.8).connect(this.roofG);
    this.gRoof = new Gate(this.roofG, int);

    // café chatter: formant-filtered voices with syllable envelopes + a murmur bed
    this.chatterG = g();
    const chLp = f('lowpass', 2600, 0.7);
    chLp.connect(ext);
    this.gChatter = new Gate(this.chatterG, chLp);
    this.murmurG = g();
    src(b.pink, 0.9).connect(f('bandpass', 420, 0.9)).connect(this.murmurG).connect(this.chatterG);
    this.gates = [this.gRumble, this.gHiss, this.gRiver, this.gTrickle, this.gRain, this.gRainHiss, this.gRoof, this.gChatter];
    const t = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator(); osc.type = 'sawtooth';
      const pitch = i % 2 === 0 ? 115 + 30 * s.rng.next() : 190 + 45 * s.rng.next();
      osc.frequency.value = pitch;
      const f1 = f('bandpass', 600, 6), f2 = f('bandpass', 1500, 8);
      const gain = g(0);
      const pan = ctx.createStereoPanner(); pan.pan.value = (i / 2) * 1.4 - 0.7; this.nodes.push(pan);
      osc.connect(f1).connect(gain); osc.connect(f2).connect(gain);
      gain.connect(pan).connect(this.chatterG);
      osc.start(t);
      this.nodes.push(osc);
      this.speakers.push({ osc, f1, f2, gain, pitch, nextSyl: t + s.rng.next(), talkUntil: 0, quietUntil: 0 });
    }
  }

  set(e: EnvironmentState, now: number): void {
    const env = this.env;
    // the game may call this every frame: only re-apply when something actually changed
    if (Math.abs(env.hour - e.hour) < 0.01 && Math.abs(env.rain - e.rain) < 0.005 && Math.abs(env.trafficDensity - e.trafficDensity) < 0.005 &&
      Math.abs(env.nearRiver - e.nearRiver) < 0.005 && Math.abs(env.nearPark - e.nearPark) < 0.005 && !!e.thunder === !!env.thunder && this.applied) return;
    this.applied = true;
    env.hour = ((e.hour % 24) + 24) % 24;
    env.rain = clamp01(e.rain);
    env.trafficDensity = clamp01(e.trafficDensity);
    env.nearRiver = clamp01(e.nearRiver);
    env.nearPark = clamp01(e.nearPark);
    const th = !!e.thunder;
    if (th && !this.thunderWas) this.nThunder = now + 0.3;
    this.thunderWas = th;
    env.thunder = th;
    this.apply(now);
  }

  setInterior(on: boolean, now: number): void { if (on !== this.interior) { this.interior = on; this.apply(now); } }
  setTunnel(on: boolean, now: number): void { if (on !== this.tunnel) { this.tunnel = on; this.apply(now); } }

  private apply(now: number): void {
    const e = this.env, tun = this.tunnel ? 1 : 0;
    const h = e.hour;
    this.lvTraffic = (0.15 + 0.85 * e.trafficDensity) * trafficHour(h);
    this.lvRain = e.rain * (1 - tun);
    this.lvBirds = birdHour(h) * (0.2 + 0.8 * e.nearPark) * (1 - e.rain * 0.9) * (1 - tun);
    this.lvChatter = chatterHour(h) * (1 - 0.75 * e.rain) * (1 - 0.4 * e.nearPark) * (1 - tun) * (0.5 + 0.5 * (1 - e.nearRiver * 0.5));
    this.lvRiver = e.nearRiver * (1 - 0.7 * tun);
    const tc = 0.6;
    glide(this.rumbleG.gain, this.lvTraffic * 0.34 * (1 + 0.5 * tun), now, tc);
    glide(this.hissG.gain, this.lvTraffic * 0.07, now, tc);
    glide(this.riverG.gain, this.lvRiver * 0.16, now, tc);
    glide(this.trickleG.gain, this.lvRiver * 0.025, now, tc);
    glide(this.rainG.gain, Math.pow(this.lvRain, 0.8) * 0.3, now, 0.4);
    glide(this.rainHissG.gain, this.lvRain * this.lvRain * 0.07, now, 0.4);
    glide(this.roofG.gain, (this.interior ? 1 : 0) * Math.pow(this.lvRain, 0.7) * 0.4, now, 0.15);
    glide(this.chatterG.gain, this.lvChatter, now, tc);
    glide(this.murmurG.gain, 0.05, now, tc);
    const lv = this.gateLevel;
    lv(this.gRumble, this.lvTraffic, now); lv(this.gHiss, this.lvTraffic, now);
    lv(this.gRiver, this.lvRiver, now); lv(this.gTrickle, this.lvRiver, now);
    lv(this.gRain, this.lvRain, now); lv(this.gRainHiss, this.lvRain, now); lv(this.gRoof, this.interior ? this.lvRain : 0, now);
    lv(this.gChatter, this.lvChatter > 0.08 ? this.lvChatter : 0, now);
  }

  private gateLevel(gate: Gate, v: number, now: number): void { if (v > 1e-3) gate.open(); else gate.closeAfter(now + 3); }

  private exp(rate: number): number { return -Math.log(1 - this.s.rng.next() * 0.999) / Math.max(1e-4, rate); }

  tick(now: number, lookahead = 0.25): void {
    for (let i = 0; i < this.gates.length; i++) this.gates[i].update(now);
    const r = this.s.rng;
    const ahead = now + Math.min(lookahead, 1.2);
    // ---- café voices: syllables with turn-taking ----
    if (this.lvChatter > 0.08) {
      for (let i = 0; i < this.speakers.length; i++) {
        const sp = this.speakers[i];
        if (sp.nextSyl < now - 1) sp.nextSyl = now;
        while (sp.nextSyl < ahead) {
          const t = sp.nextSyl;
          if (t > sp.talkUntil && t < sp.quietUntil) { sp.nextSyl = sp.quietUntil; continue; }
          if (t >= sp.quietUntil && t > sp.talkUntil) { sp.talkUntil = t + 0.8 + r.next() * 3; sp.quietUntil = sp.talkUntil + 0.4 + r.next() * 2.5; }
          const dur = 0.09 + r.next() * 0.16;
          const v = VOWELS[r.int(VOWELS.length)];
          const amp = 0.03 + 0.035 * r.next();
          const phrasePos = 1 - (sp.talkUntil - t) / 3.8; // declination over a phrase
          sp.osc.frequency.setTargetAtTime(sp.pitch * (1.12 - 0.15 * phrasePos + 0.1 * r.gauss() * 0.5), t, 0.04);
          sp.f1.frequency.setTargetAtTime(v[0] * (0.92 + 0.16 * r.next()), t, 0.025);
          sp.f2.frequency.setTargetAtTime(v[1] * (0.92 + 0.16 * r.next()), t, 0.025);
          sp.gain.gain.setTargetAtTime(amp, t, 0.018);
          sp.gain.gain.setTargetAtTime(0, t + dur * 0.75, 0.03);
          sp.nextSyl = t + dur + (r.chance(0.18) ? 0.12 + r.next() * 0.2 : 0.02);
        }
      }
      if (this.nClink < 0 || this.nClink < now - 0.5) this.nClink = now + this.exp(0.3 * this.lvChatter);
      if (this.nClink < ahead) {
        const pan = this.panner(r.range(-0.8, 0.8));
        this.s.ping(pan, this.nClink, 2600 + r.next() * 2000, 0.06, 0.012 + 0.01 * r.next());
        if (r.chance(0.4)) this.s.ping(pan, this.nClink + 0.07, 3100 + r.next() * 1500, 0.05, 0.008);
        this.nClink = now + this.exp(0.3 * this.lvChatter) + 0.25;
      }
    }

    // ---- birds ----
    this.nBird = this.schedule(this.nBird, now, ahead, 1.6 * this.lvBirds, 0);
    this.nPigeon = this.schedule(this.nPigeon, now, ahead, 0.15 * this.lvBirds + (this.lvBirds > 0 ? 0.05 : 0), 1);
    // ---- distant traffic events ----
    this.nHorn = this.schedule(this.nHorn, now, ahead, 0.07 * this.lvTraffic, 2);
    const night = this.env.hour > 21 || this.env.hour < 5 ? 1.5 : 1;
    this.nScooter = this.schedule(this.nScooter, now, ahead, 0.045 * this.lvTraffic * night * (1 - this.lvRain * 0.6), 3);
    // ---- river boats ----
    this.nBoat = this.schedule(this.nBoat, now, ahead, 0.025 * this.lvRiver, 4);
    // ---- thunder ----
    if (this.env.thunder && !this.tunnel) {
      if (this.nThunder < now - 1) this.nThunder = now + 5 + this.exp(1 / 25);
      if (this.nThunder < ahead) { this.thunder(this.nThunder); this.nThunder += 12 + this.exp(1 / 25); }
    }
  }

  /** Poisson event clock (no closures: allocation-free when nothing fires). */
  private schedule(next: number, now: number, ahead: number, rate: number, kind: number): number {
    if (rate <= 1e-4) return now + 1;
    if (next < 0 || next < now - 0.5) next = now + this.exp(rate); // first use / after a pause: no burst
    if (next < ahead) {
      const t = Math.max(next, now);
      switch (kind) {
        case 0: this.bird(t); break;
        case 1: this.pigeon(t); break;
        case 2: this.distantHorn(t); break;
        case 3: this.scooter(t); break;
        case 4: this.boat(t); break;
      }
      next = t + this.exp(rate);
    }
    return next;
  }

  private panner(p: number): StereoPannerNode {
    const pan = this.ctx.createStereoPanner(); pan.pan.value = p;
    pan.connect(this.ext);
    return pan;
  }

  private bird(t: number): void {
    const ctx = this.ctx, r = this.s.rng;
    const pan = this.panner(r.range(-0.9, 0.9));
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1200;
    hp.connect(pan);
    const kind = r.next();
    const amp = 0.012 + 0.025 * r.next();
    if (kind < 0.55) {
      // sparrow-like chirps
      const n = 2 + r.int(5);
      const base = 3000 + r.next() * 1500;
      for (let k = 0; k < n; k++) {
        const tt = t + k * (0.08 + r.next() * 0.06);
        const o = ctx.createOscillator();
        o.frequency.setValueAtTime(base * 0.8, tt);
        o.frequency.exponentialRampToValueAtTime(base * (1.2 + 0.2 * r.next()), tt + 0.025);
        o.frequency.exponentialRampToValueAtTime(base * 0.9, tt + 0.05);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, tt); g.gain.linearRampToValueAtTime(amp, tt + 0.008); g.gain.linearRampToValueAtTime(0, tt + 0.055);
        o.connect(g).connect(hp); o.start(tt); o.stop(tt + 0.06);
      }
    } else {
      // blackbird-like melodic phrase
      const n = 4 + r.int(5);
      let tt = t;
      let f = 1700 + r.next() * 900;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, tt);
      o.frequency.setValueAtTime(f, tt);
      for (let k = 0; k < n; k++) {
        const d = 0.07 + r.next() * 0.15;
        f = Math.min(3600, Math.max(1300, f * (0.8 + r.next() * 0.45)));
        o.frequency.setTargetAtTime(f, tt, 0.012);
        g.gain.setTargetAtTime(amp * 0.8, tt, 0.01);
        g.gain.setTargetAtTime(0, tt + d * 0.8, 0.012);
        tt += d + 0.02 + r.next() * 0.05;
      }
      if (r.chance(0.5)) { // trill
        for (let k = 0; k < 6; k++) { o.frequency.setValueAtTime(k % 2 ? 4200 : 3600, tt + k * 0.025); }
        g.gain.setTargetAtTime(amp * 0.5, tt, 0.01); g.gain.setTargetAtTime(0, tt + 0.15, 0.02); tt += 0.2;
      }
      o.connect(g).connect(hp); o.start(t); o.stop(tt + 0.2);
    }
  }

  private pigeon(t: number): void {
    const ctx = this.ctx, r = this.s.rng;
    const pan = this.panner(r.range(-0.7, 0.7));
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.connect(pan);
    const base = 340 + r.next() * 80;
    const o = ctx.createOscillator(); o.type = 'triangle';
    const g = ctx.createGain(); g.gain.value = 0;
    const amp = 0.02 + 0.015 * r.next();
    // "rrou-rou-rou": 3 coos with a growl-like AM
    const am = ctx.createOscillator(); am.frequency.value = 28;
    const amG = ctx.createGain(); amG.gain.value = 0.3;
    const amNode = ctx.createGain(); amNode.gain.value = 0.7;
    am.connect(amG).connect(amNode.gain);
    for (let k = 0; k < 3; k++) {
      const tt = t + k * 0.42;
      o.frequency.setValueAtTime(base * 0.85, tt);
      o.frequency.linearRampToValueAtTime(base * 1.08, tt + 0.12);
      o.frequency.linearRampToValueAtTime(base * 0.9, tt + 0.32);
      g.gain.setTargetAtTime(amp, tt, 0.04);
      g.gain.setTargetAtTime(0, tt + 0.28, 0.04);
    }
    o.connect(amNode).connect(g).connect(lp);
    o.start(t); am.start(t); o.stop(t + 1.6); am.stop(t + 1.6);
  }

  private distantHorn(t: number): void {
    const ctx = this.ctx, r = this.s.rng;
    const pan = this.panner(r.range(-1, 1));
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700 + r.next() * 600; lp.connect(pan);
    const f = 360 + r.next() * 140;
    const dur = 0.15 + r.next() * 0.5;
    const amp = 0.015 + 0.02 * r.next();
    for (const m of [1, 1.25]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f * m;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp, t + 0.02); g.gain.setValueAtTime(amp, t + dur); g.gain.linearRampToValueAtTime(0, t + dur + 0.05);
      o.connect(g).connect(lp); o.start(t); o.stop(t + dur + 0.1);
    }
  }

  private scooter(t: number): void {
    const ctx = this.ctx, r = this.s.rng;
    const dur = 3 + r.next() * 3;
    const pan = ctx.createStereoPanner();
    const dir = r.chance(0.5) ? 1 : -1;
    pan.pan.setValueAtTime(-0.9 * dir, t); pan.pan.linearRampToValueAtTime(0.9 * dir, t + dur);
    pan.connect(this.ext);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900 + r.next() * 700; lp.Q.value = 2;
    lp.connect(pan);
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    const base = 85 + r.next() * 40;
    // accelerating through gears, with a doppler drop as it passes
    o.frequency.setValueAtTime(base, t);
    o.frequency.linearRampToValueAtTime(base * 1.5, t + dur * 0.35);
    o.frequency.linearRampToValueAtTime(base * 1.15, t + dur * 0.4);
    o.frequency.linearRampToValueAtTime(base * 1.6 * 0.94, t + dur);
    const g = ctx.createGain();
    const amp = 0.02 + 0.02 * r.next();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp, t + dur * 0.5); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g).connect(lp); o.start(t); o.stop(t + dur + 0.05);
  }

  private boat(t: number): void {
    const ctx = this.ctx, r = this.s.rng;
    const dur = 14 + r.next() * 10;
    const pan = ctx.createStereoPanner();
    pan.pan.setValueAtTime(-0.8, t); pan.pan.linearRampToValueAtTime(0.8, t + dur);
    pan.connect(this.ext);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220; lp.connect(pan);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.07, t + dur * 0.5); g.gain.linearRampToValueAtTime(0, t + dur);
    g.connect(lp);
    for (const f of [41, 82.5, 124]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f * (0.97 + r.next() * 0.06);
      o.connect(g); o.start(t); o.stop(t + dur + 0.1);
    }
    if (r.chance(0.35)) { // bateau-mouche horn
      const ht = t + dur * 0.4;
      const hg = ctx.createGain();
      hg.gain.setValueAtTime(0, ht); hg.gain.linearRampToValueAtTime(0.04, ht + 0.15); hg.gain.setValueAtTime(0.04, ht + 1.4); hg.gain.linearRampToValueAtTime(0, ht + 1.8);
      const hlp = ctx.createBiquadFilter(); hlp.type = 'lowpass'; hlp.frequency.value = 800;
      hg.connect(hlp).connect(pan);
      for (const f of [155, 196]) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.connect(hg); o.start(ht); o.stop(ht + 1.9); }
    }
  }

  private thunder(t: number): void {
    const ctx = this.ctx, r = this.s.rng;
    const near = r.next(); // 1 = close strike
    const dur = 5 + r.next() * 4;
    const src = ctx.createBufferSource(); src.buffer = this.s.buffers.brown; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.5;
    lp.frequency.setValueAtTime(400 + 2500 * near, t);
    lp.frequency.exponentialRampToValueAtTime(110, t + 1.8);
    const g = ctx.createGain();
    const peak = 0.25 + 0.35 * near;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.05 + 0.4 * (1 - near));
    let tt = t + 0.5;
    while (tt < t + dur - 0.5) { // rolling rumbles
      g.gain.setTargetAtTime(peak * (0.25 + 0.75 * r.next()) * (1 - (tt - t) / dur), tt, 0.25);
      tt += 0.3 + r.next() * 0.8;
    }
    g.gain.setTargetAtTime(0, tt, 0.6);
    const pan = this.panner(r.range(-0.6, 0.6));
    src.connect(lp).connect(g).connect(pan);
    src.start(t, r.next() * 3); src.stop(tt + 4);
    if (near > 0.6) this.s.noise(pan, t, 'highpass', 1500, 0.7, 0.08, 0.25 * near); // crack
  }

  dispose(): void {
    for (const n of this.nodes) { try { (n as AudioScheduledSourceNode).stop?.(); } catch { /* */ } n.disconnect(); }
  }
}
