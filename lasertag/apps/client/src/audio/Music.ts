import type { AudioEngine } from './AudioEngine.ts';

const BPM = 124;
const BEAT = 60 / BPM;
const STEP = BEAT / 4; // 16th note
const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

/** A minor synthwave progression: i - VI - III - VII  (Am F C G), plus a darker alternate for tension. */
const PROGRESSIONS = [
  [{ root: 45, minor: true }, { root: 41, minor: false }, { root: 48, minor: false }, { root: 43, minor: false }],
  [{ root: 45, minor: true }, { root: 43, minor: false }, { root: 41, minor: false }, { root: 40, minor: false }],
];
const SCALE = [0, 2, 3, 5, 7, 8, 10]; // natural minor on A

/**
 * Generative, adaptive synthwave. Layers enter/leave with `intensity` (0..1) at bar boundaries:
 *   0.00 pad + soft hats   0.25 kick + bass   0.5 clap + arp   0.75 open hats + lead   0.9 fills
 * It exposes a beat clock (`beatPulse`) that drives every neon in the game.
 */
export class Music {
  private timer: number | null = null;
  private t0 = 0;
  private nextStep = 0;
  private stepIndex = 0;
  intensity = 0.2;
  private target = 0.2;
  private layerLevel = 0.2;
  private prog = 0;
  private melodySeed = 1;
  private bus: GainNode;
  private sidechain: GainNode;
  private tension = 0;
  playing = false;

  constructor(private readonly a: AudioEngine) {
    this.bus = a.ctx.createGain();
    this.sidechain = a.ctx.createGain();
    this.sidechain.connect(this.bus);
    this.bus.connect(a.music);
  }

  start() {
    if (this.playing) return;
    this.playing = true;
    const ctx = this.a.ctx;
    this.t0 = ctx.currentTime + 0.1;
    this.nextStep = this.t0;
    this.stepIndex = 0;
    this.timer = window.setInterval(() => this.schedule(), 25);
  }
  stop() {
    this.playing = false;
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
  }

  setIntensity(v: number) { this.target = Math.max(0, Math.min(1, v)); }
  /** 0..1 extra tension (last seconds / overtime): darker progression, risers. */
  setTension(v: number) { this.tension = v; }

  /** 1 on each beat, decaying quickly; used for visual pulsing. */
  beatPulse(): number {
    if (!this.playing) return 0;
    const pos = (this.a.ctx.currentTime - this.t0) / BEAT;
    if (pos < 0) return 0;
    const f = pos - Math.floor(pos);
    const accent = Math.floor(pos) % 4 === 0 ? 1 : 0.75;
    return Math.exp(-f * 7) * accent * (0.35 + 0.65 * Math.min(1, this.layerLevel * 2));
  }
  bar(): number { return Math.max(0, (this.a.ctx.currentTime - this.t0) / (BEAT * 4)); }

  private schedule() {
    const ctx = this.a.ctx;
    while (this.nextStep < ctx.currentTime + 0.14) {
      this.playStep(this.stepIndex, this.nextStep);
      this.nextStep += STEP;
      this.stepIndex++;
    }
  }

  private playStep(i: number, t: number) {
    const s16 = i % 16;
    const bar = Math.floor(i / 16);
    if (s16 === 0) {
      // layers move one bar at a time toward the target: musical transitions, never abrupt
      this.layerLevel += Math.max(-0.25, Math.min(0.25, this.target - this.layerLevel));
      this.intensity = this.layerLevel;
      if (bar % 8 === 0) {
        this.prog = this.tension > 0.5 ? 1 : 0;
        this.melodySeed = (this.melodySeed * 16807) % 2147483647;
      }
    }
    const L = this.layerLevel;
    const chord = PROGRESSIONS[this.prog][bar % 4];
    const third = chord.minor ? 3 : 4;
    const notes = [chord.root, chord.root + third, chord.root + 7];
    const phraseEnd = bar % 8 === 7;

    // pad: whole bar
    if (s16 === 0) this.pad(t, notes, BEAT * 4, 0.05 + 0.03 * (1 - L));
    // hats
    if (L > 0.05) {
      const hatsOn = L > 0.6 ? true : s16 % 2 === 0;
      if (hatsOn) this.hat(t, false, (s16 % 4 === 2 ? 0.07 : 0.035) * Math.min(1, L * 3));
      if (L > 0.72 && s16 % 4 === 2) this.hat(t, true, 0.05);
    }
    // kick + sidechain pump
    if (L >= 0.25 && s16 % 4 === 0 && !(phraseEnd && s16 >= 12 && L > 0.85)) {
      this.kick(t, 0.9);
      const g = this.sidechain.gain;
      g.setValueAtTime(0.35, t);
      g.linearRampToValueAtTime(1, t + BEAT * 0.55);
    }
    // bass: 8ths octave pump
    if (L >= 0.25 && s16 % 2 === 0) {
      const oct = (s16 / 2) % 2 === 1 ? 12 : 0;
      this.bass(t, chord.root - 12 + oct, STEP * 1.7, 0.16);
    }
    // clap on 2 & 4
    if (L >= 0.5 && (s16 === 4 || s16 === 12)) this.clap(t, 0.22);
    // fill at the end of a phrase
    if (L >= 0.88 && phraseEnd && s16 >= 12) this.clap(t, 0.08 + (s16 - 12) * 0.04);
    // arp: 16ths over two octaves
    if (L >= 0.45) {
      const seq = [0, 1, 2, 1, 0, 2, 1, 2];
      const n = notes[seq[s16 % 8]] + 12 + (s16 >= 8 ? 12 : 0);
      this.arp(t, n, 0.045 * Math.min(1, (L - 0.45) * 4));
    }
    // lead: generative motif on the scale, 8th-note grid with rests
    if (L >= 0.74 && s16 % 2 === 0) {
      const h = this.hash(bar % 4 * 16 + s16 + this.melodySeed);
      if (h > 0.42) {
        const deg = Math.floor(this.hash(bar * 7 + s16 + this.melodySeed * 3) * 7);
        const m = 69 + SCALE[deg] - (deg > 4 ? 12 : 0) + (chord.root % 12 === 9 ? 0 : 0);
        const len = h > 0.85 ? STEP * 6 : STEP * 2;
        this.lead(t, m, len, 0.06);
      }
    }
    // tension riser in the last bar of a phrase
    if (this.tension > 0.3 && phraseEnd && s16 === 0) this.riser(t, BEAT * 4, 0.05 * this.tension);
  }

  private hash(n: number) { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); }

  // ------------------------------------------------------------------ instruments
  private env(g: GainNode, t: number, a: number, peak: number, d: number) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  private kick(t: number, vol: number) {
    const ctx = this.a.ctx;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(155, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.13);
    this.env(g, t, 0.002, vol, 0.42);
    o.connect(g).connect(this.bus);
    o.start(t); o.stop(t + 0.5);
    const n = ctx.createBufferSource(), ng = ctx.createGain(), hp = ctx.createBiquadFilter();
    n.buffer = this.a.noise; hp.type = 'highpass'; hp.frequency.value = 3000;
    this.env(ng, t, 0.001, vol * 0.12, 0.02);
    n.connect(hp).connect(ng).connect(this.bus);
    n.start(t, Math.random()); n.stop(t + 0.04);
  }

  private clap(t: number, vol: number) {
    const ctx = this.a.ctx;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 0.9;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    for (let k = 0; k < 3; k++) {
      g.gain.setValueAtTime(vol, t + k * 0.011);
      g.gain.exponentialRampToValueAtTime(vol * 0.2, t + k * 0.011 + 0.009);
    }
    g.gain.setValueAtTime(vol, t + 0.034);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
    const n = ctx.createBufferSource(); n.buffer = this.a.noise;
    n.connect(bp).connect(g);
    g.connect(this.bus);
    const send = ctx.createGain(); send.gain.value = 0.35; g.connect(send).connect(this.a.reverbSend);
    n.start(t, Math.random()); n.stop(t + 0.3);
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = 196;
    this.env(og, t, 0.001, vol * 0.5, 0.09);
    o.connect(og).connect(this.bus); o.start(t); o.stop(t + 0.12);
  }

  private hat(t: number, open: boolean, vol: number) {
    const ctx = this.a.ctx;
    const n = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = this.a.noise; hp.type = 'highpass'; hp.frequency.value = open ? 7000 : 8500;
    this.env(g, t, 0.001, vol, open ? 0.22 : 0.035);
    n.connect(hp).connect(g).connect(this.sidechain);
    n.start(t, Math.random()); n.stop(t + (open ? 0.3 : 0.06));
  }

  private bass(t: number, m: number, dur: number, vol: number) {
    const ctx = this.a.ctx;
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = 'sawtooth'; o2.type = 'square';
    o.frequency.value = mtof(m); o2.frequency.value = mtof(m - 12);
    lp.type = 'lowpass'; lp.Q.value = 6;
    lp.frequency.setValueAtTime(200 + this.layerLevel * 900, t);
    lp.frequency.exponentialRampToValueAtTime(120, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.006);
    g.gain.setValueAtTime(vol, t + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const g2 = ctx.createGain(); g2.gain.value = 0.5;
    o.connect(lp); o2.connect(g2).connect(lp);
    lp.connect(g).connect(this.sidechain);
    o.start(t); o2.start(t); o.stop(t + dur + 0.02); o2.stop(t + dur + 0.02);
  }

  private pad(t: number, notes: number[], dur: number, vol: number) {
    const ctx = this.a.ctx;
    const lp = ctx.createBiquadFilter(), g = ctx.createGain();
    lp.type = 'lowpass'; lp.frequency.value = 900 + this.layerLevel * 1800; lp.Q.value = 0.7;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.5);
    g.gain.setValueAtTime(vol, t + dur - 0.3);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.4);
    for (const n of notes) for (const det of [-9, 9]) {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = mtof(n + 12);
      o.detune.value = det;
      o.connect(lp);
      o.start(t); o.stop(t + dur + 0.5);
    }
    lp.connect(g).connect(this.sidechain);
    const send = ctx.createGain(); send.gain.value = 0.5; g.connect(send).connect(this.a.reverbSend);
  }

  private arp(t: number, m: number, vol: number) {
    const ctx = this.a.ctx;
    const o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = 'square'; o.frequency.value = mtof(m);
    lp.type = 'lowpass'; lp.Q.value = 3;
    lp.frequency.setValueAtTime(4200, t); lp.frequency.exponentialRampToValueAtTime(700, t + 0.1);
    this.env(g, t, 0.003, vol, 0.13);
    o.connect(lp).connect(g).connect(this.sidechain);
    const send = ctx.createGain(); send.gain.value = 0.55; g.connect(send).connect(this.a.delaySend);
    o.start(t); o.stop(t + 0.16);
  }

  private lead(t: number, m: number, dur: number, vol: number) {
    const ctx = this.a.ctx;
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
    const lfo = ctx.createOscillator(), lg = ctx.createGain();
    o.type = 'sawtooth'; o2.type = 'sawtooth';
    o.frequency.value = mtof(m); o2.frequency.value = mtof(m); o2.detune.value = 12;
    lfo.frequency.value = 5.5; lg.gain.value = 6;
    lfo.connect(lg); lg.connect(o.detune); lg.connect(o2.detune);
    lp.type = 'lowpass'; lp.frequency.value = 2600; lp.Q.value = 2;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.setValueAtTime(vol * 0.8, t + dur * 0.8);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.08);
    o.connect(lp); o2.connect(lp); lp.connect(g).connect(this.sidechain);
    const s1 = ctx.createGain(); s1.gain.value = 0.4; g.connect(s1).connect(this.a.delaySend);
    const s2 = ctx.createGain(); s2.gain.value = 0.3; g.connect(s2).connect(this.a.reverbSend);
    for (const x of [o, o2, lfo]) { x.start(t); x.stop(t + dur + 0.1); }
  }

  private riser(t: number, dur: number, vol: number) {
    const ctx = this.a.ctx;
    const n = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = this.a.noise; n.loop = true;
    bp.type = 'bandpass'; bp.Q.value = 4;
    bp.frequency.setValueAtTime(400, t); bp.frequency.exponentialRampToValueAtTime(7000, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur);
    n.connect(bp).connect(g).connect(this.bus);
    n.start(t); n.stop(t + dur);
  }

  /** One-shot stinger for big moments (match start/end). */
  stinger(kind: 'win' | 'lose' | 'start') {
    const ctx = this.a.ctx, t = ctx.currentTime + 0.02;
    const chords: Record<string, number[]> = { win: [57, 61, 64, 69, 73], lose: [45, 48, 52, 57], start: [57, 64, 69, 76] };
    for (const [k, m] of chords[kind].entries()) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.value = mtof(m);
      const tt = t + (kind === 'start' ? k * 0.06 : k * 0.09);
      this.env(g, tt, 0.01, 0.05, kind === 'lose' ? 2.5 : 1.8);
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = kind === 'lose' ? 900 : 3500;
      o.connect(lp).connect(g).connect(this.a.music);
      const s = ctx.createGain(); s.gain.value = 0.6; g.connect(s).connect(this.a.reverbSend);
      o.start(tt); o.stop(tt + 2.6);
    }
  }
}
