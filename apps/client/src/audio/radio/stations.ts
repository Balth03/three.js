// Three procedurally composed radio stations. Each station keeps an "on air" clock: tracks are
// generated from a seed (key, tempo, progression, form, motifs) and play endlessly; between tracks a
// short station jingle is played. Scheduling is lookahead-based on AudioContext time.

import { Rng } from '../util';
import type { Instruments } from './instruments';
import {
  C, CHORD, ROOTLESS, SCALES, humanize, nearestPc, scaleStep, voiceLead,
  type ChordSym,
} from './theory';

export interface StationOut { dry: AudioNode; wet: AudioNode }

export abstract class Station {
  abstract readonly name: string;
  abstract readonly genre: string;
  protected rng: Rng = new Rng(1);
  protected hum: Rng;
  protected trackNo = 0;
  protected bar = 0;
  protected step = 0;
  protected nextTime = 0;
  protected stepDur = 0.25;
  protected stepsPerBar = 8;
  protected trackBars = 32;
  shortTracks = false;

  protected out: StationOut;

  /** `trim` = station loudness trim (linear) so that every station sits at the same broadcast level */
  constructor(protected ctx: BaseAudioContext, protected inst: Instruments, bus: StationOut, protected seed: number, trim: number) {
    this.hum = new Rng(seed ^ 0x5bd1e995);
    const dry = ctx.createGain(); dry.gain.value = trim; dry.connect(bus.dry);
    const wet = ctx.createGain(); wet.gain.value = trim; wet.connect(bus.wet);
    this.out = { dry, wet };
  }

  protected abstract newTrack(): void;
  protected abstract playStep(bar: number, step: number, t: number): void;
  /** schedule the jingle at t (if play) and return its duration */
  protected abstract jingle(t: number, play: boolean): number;
  /** called when (re)starting playback mid-stream: reset automation state */
  resetPlayback(_now: number): void { /* optional */ }

  start(t: number): void { this.trackNo = 0; this.beginTrack(t); }

  private beginTrack(t: number): void {
    this.rng = new Rng((this.seed * 7919 + this.trackNo * 104729) >>> 0);
    this.newTrack();
    if (this.shortTracks) this.trackBars = Math.min(this.trackBars, 4);
    this.bar = 0; this.step = 0; this.nextTime = t;
  }

  schedule(until: number, play: boolean): void {
    let guard = 0;
    while (this.nextTime < until && guard++ < 100000) {
      if (play) this.playStep(this.bar, this.step, this.nextTime);
      this.nextTime += this.stepDur;
      if (++this.step >= this.stepsPerBar) {
        this.step = 0;
        if (++this.bar >= this.trackBars) {
          const jt = this.nextTime;
          const d = this.jingle(jt, play);
          this.trackNo++;
          this.beginTrack(jt + d);
        }
      }
    }
  }

  /** advance the on-air clock silently up to `now` */
  catchUp(now: number): void {
    if (now - this.nextTime > 900) { this.trackNo++; this.beginTrack(now); return; }
    this.schedule(now, false);
  }

  /** time of the next scheduled step (exposed for tests) */
  get position(): { track: number; bar: number; step: number } { return { track: this.trackNo, bar: this.bar, step: this.step }; }
}

// ===================================================================================================
// Radio Seine — lounge / nu-jazz: Rhodes comping, walking upright bass, brushed drums, vibes melody.

const SEINE_MAJOR: ChordSym[][] = [
  [C(2, 'm9'), C(7, '13'), C(0, 'maj9'), C(9, '7b9')],
  [C(0, 'maj9'), C(9, 'm9'), C(2, 'm9'), C(7, '7sus')],
  [C(5, 'maj9'), C(4, 'm7'), C(2, 'm9'), C(1, '7')],
  [C(0, 'maj9'), C(5, '9'), C(4, 'm7'), C(9, '7b9')],
  [C(5, 'maj9'), C(7, '13'), C(4, 'm7'), C(9, 'm9')],
];
const SEINE_DORIAN: ChordSym[][] = [
  [C(0, 'm9'), C(0, 'm9'), C(5, '9'), C(5, '9')],
  [C(0, 'm9'), C(10, 'maj9'), C(8, 'maj9'), C(7, '7b9')],
  [C(0, 'm11'), C(3, 'maj9'), C(5, '9'), C(10, '13')],
  [C(5, 'm9'), C(10, '13'), C(3, 'maj9'), C(8, 'maj9')],
];
const COMP_PATTERNS: number[][] = [[0], [0, 3], [1, 4], [0, 5], [3, 6], [2, 5, 7], [0, 3, 6], [1, 5], [0, 4, 7]];

interface MotifNote { pos: number; len: number; dir: number; strong: boolean }

export class SeineStation extends Station {
  readonly name = 'Radio Seine';
  readonly genre = 'Lounge / Nu-jazz';
  private key = 46;
  private scale: readonly number[] = SCALES.major;
  private swing = 0.62;
  private beat = 0.66;
  private progA: ChordSym[] = SEINE_MAJOR[0];
  private progB: ChordSym[] = SEINE_MAJOR[1];
  private tonic: ChordSym = C(0, 'maj9');
  private voicing: number[] | null = null;
  private bassNote = 43;
  private comp: number[] = [0];
  private compDur: number[] = [];
  private melodyOn = true;
  private motif: MotifNote[] = [];
  private mel = 76;
  private rhodesOut: GainNode;
  private vibesOut: GainNode;
  private drums: GainNode;

  constructor(ctx: BaseAudioContext, inst: Instruments, out: StationOut, seed: number) {
    super(ctx, inst, out, seed, 0.56);
    // Rhodes through a stereo auto-pan tremolo
    this.rhodesOut = ctx.createGain();
    const pan = ctx.createStereoPanner();
    const lfo = ctx.createOscillator(); lfo.frequency.value = 3.6;
    const depth = ctx.createGain(); depth.gain.value = 0.45;
    lfo.connect(depth).connect(pan.pan); lfo.start();
    this.rhodesOut.connect(pan);
    pan.connect(this.out.dry);
    const send = ctx.createGain(); send.gain.value = 0.35; pan.connect(send).connect(this.out.wet);
    this.vibesOut = ctx.createGain();
    const vpan = ctx.createStereoPanner(); vpan.pan.value = 0.25;
    this.vibesOut.connect(vpan).connect(this.out.dry);
    const vs = ctx.createGain(); vs.gain.value = 0.45; vpan.connect(vs).connect(this.out.wet);
    this.drums = ctx.createGain();
    const dlp = ctx.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 9000;
    this.drums.connect(dlp).connect(this.out.dry);
    const ds = ctx.createGain(); ds.gain.value = 0.2; dlp.connect(ds).connect(this.out.wet);
  }

  protected newTrack(): void {
    const r = this.rng;
    const tempo = r.range(82, 98);
    this.beat = 60 / tempo;
    this.stepsPerBar = 8;
    this.stepDur = this.beat / 2;
    this.swing = r.range(0.58, 0.66);
    this.key = 41 + r.int(9);
    const dorian = r.chance(0.4);
    this.scale = dorian ? SCALES.dorian : SCALES.major;
    const list = dorian ? SEINE_DORIAN : SEINE_MAJOR;
    const a = r.int(list.length);
    let b = r.int(list.length);
    if (b === a) b = (a + 1) % list.length;
    this.progA = list[a]; this.progB = list[b];
    this.tonic = dorian ? C(0, 'm9') : C(0, 'maj9');
    this.trackBars = 33; // AABA x 8 bars + final chord
    this.melodyOn = r.chance(0.8);
    // 2-bar melodic motif on the 8th grid
    this.motif = [];
    let pos = r.chance(0.5) ? 0 : 1;
    while (pos < 14) {
      const len = r.pick([1, 1, 2, 2, 3, 4]);
      if (r.chance(0.78)) this.motif.push({ pos, len, dir: r.pick([-1, 1, 1, 0, -1]), strong: pos % 2 === 0 });
      pos += len + (r.chance(0.25) ? 1 : 0);
    }
    this.mel = 72 + r.int(8);
  }

  private chordAt(bar: number): ChordSym {
    if (bar >= this.trackBars - 1) return this.tonic;
    const sec = Math.floor(bar / 8) % 4;
    const prog = sec === 2 ? this.progB : this.progA;
    return prog[bar % 4];
  }

  protected playStep(bar: number, s: number, t0: number): void {
    const inst = this.inst, b = this.inst.buffers, h = this.hum;
    const off = s & 1, beatIdx = s >> 1;
    const t = t0 + (off ? (this.swing - 0.5) * this.beat : 0) + humanize(h, 0.004);
    const chord = this.chordAt(bar);
    const end = bar === this.trackBars - 1;
    const rootMidi = this.key + chord.root;

    // ---- final bar: let the tonic ring ----
    if (end) {
      if (s === 0) {
        const v = voiceLead(this.voicing, rootMidi, ROOTLESS[chord.q] ?? CHORD[chord.q], 52, 74);
        v.forEach((m, k) => inst.rhodes(this.rhodesOut, t + k * 0.03, m, 0.55, this.beat * 3.5));
        inst.upright(this.out.dry, t, nearestPc(this.bassNote, rootMidi % 12) - (this.bassNote > 45 ? 12 : 0), 0.8, this.beat * 3);
        inst.drum(this.drums, b.ride, t, 0.22);
        inst.drum(this.drums, b.kickJazz, t, 0.2);
        if (this.melodyOn) inst.vibes(this.vibesOut, t + 0.05, nearestPc(this.mel, (rootMidi + (chord.q === 'm9' ? 3 : 4)) % 12), 0.6, this.beat * 3);
      }
      return;
    }

    // ---- brushed drums ----
    if (!off) {
      inst.drum(this.drums, b.ride, t, (beatIdx % 2 ? 0.2 : 0.15) * (0.9 + 0.2 * h.next()), 0.98 + 0.04 * h.next());
      inst.drum(this.drums, b.brushSwish, t - 0.05, 0.1 + 0.05 * h.next());
      if (beatIdx % 2 === 1) {
        inst.drum(this.drums, b.snareBrush, t + 0.005, 0.2 + 0.06 * h.next());
        inst.drum(this.drums, b.hatClosed, t, 0.06, 0.75);
      } else {
        inst.drum(this.drums, b.kickJazz, t, 0.16 + 0.05 * h.next());
      }
    } else if (beatIdx === 1 || beatIdx === 3) {
      inst.drum(this.drums, b.ride, t, 0.11 + 0.03 * h.next(), 1.01);
    } else if (h.chance(0.12)) {
      inst.drum(this.drums, b.snareBrush, t, 0.07); // ghost
    }

    // ---- walking bass ----
    if (!off) this.walk(bar, beatIdx, t);
    else if (beatIdx === 3 && h.chance(0.15)) inst.upright(this.out.dry, t, this.bassNote + (h.chance(0.5) ? 0 : 12), 0.35, this.beat * 0.3);

    // ---- Rhodes comping ----
    if (s === 0) {
      const changes = bar % 4 === 0 || this.chordAt(bar - 1) !== chord;
      this.comp = changes && this.rng.chance(0.6) ? this.rng.pick(COMP_PATTERNS.filter((p) => p[0] === 0)) : this.rng.pick(COMP_PATTERNS);
      this.compDur = this.comp.map((p, i) => ((i + 1 < this.comp.length ? this.comp[i + 1] : 8) - p) * this.stepDur * 0.92);
      this.voicing = voiceLead(this.voicing, rootMidi, ROOTLESS[chord.q] ?? CHORD[chord.q], 52, 72);
    }
    const ci = this.comp.indexOf(s);
    if (ci >= 0 && this.voicing) {
      const vel = 0.45 + 0.25 * h.next() + (s === 0 ? 0.1 : 0);
      const v = this.voicing;
      for (let k = 0; k < v.length; k++) inst.rhodes(this.rhodesOut, t + k * 0.007 + Math.abs(humanize(h, 0.004)), v[k], vel * (k === v.length - 1 ? 1.05 : 0.9), this.compDur[ci]);
    }

    // ---- vibes melody (2nd and 4th A sections, and B) ----
    const sec = Math.floor(bar / 8);
    if (this.melodyOn && sec >= 1) {
      const slot = (bar % 2) * 8 + s;
      if (bar % 4 === 3 && slot >= 12) return; // breathe at phrase ends
      for (let i = 0; i < this.motif.length; i++) {
        const mn = this.motif[i];
        if (mn.pos !== slot) continue;
        const tones = CHORD[chord.q].map((x) => (rootMidi + x) % 12);
        let m: number;
        if (mn.strong) {
          let best = this.mel, bd = 99;
          for (const pc of tones) {
            const c = nearestPc(this.mel + mn.dir * 3, pc);
            const d = Math.abs(c - (this.mel + mn.dir * 2));
            if (d < bd) { bd = d; best = c; }
          }
          m = best;
        } else {
          m = scaleStep(this.mel, mn.dir === 0 ? (h.chance(0.5) ? 1 : -1) : mn.dir, this.key, this.scale);
        }
        if (m > 86) m -= 12; if (m < 65) m += 12;
        this.mel = m;
        inst.vibes(this.vibesOut, t, m, 0.55 + 0.25 * h.next(), mn.len * this.stepDur * 0.95);
      }
    }
  }

  private walk(bar: number, beatIdx: number, t: number): void {
    const chord = this.chordAt(bar), next = this.chordAt(bar + 1);
    const rootPc = (this.key + chord.root) % 12;
    const fit = (m: number): number => { while (m < 36) m += 12; while (m > 55) m -= 12; return m; };
    let note: number;
    if (beatIdx === 0) {
      note = fit(nearestPc(this.bassNote, rootPc));
    } else if (beatIdx === 3) {
      const target = fit(nearestPc(this.bassNote, (this.key + next.root) % 12));
      note = this.rng.chance(0.75) ? target + (this.bassNote > target ? 1 : -1) : fit(target + 7);
    } else {
      const target = fit(nearestPc(this.bassNote, (this.key + next.root) % 12));
      const dir = target > this.bassNote ? 1 : target < this.bassNote ? -1 : (this.rng.chance(0.5) ? 1 : -1);
      if (this.rng.chance(0.6)) {
        // next chord tone in the walking direction
        const tones = CHORD[chord.q].slice(0, 4).map((x) => (rootPc + x) % 12);
        let m = this.bassNote + dir;
        for (let k = 0; k < 12; k++, m += dir) if (tones.includes(((m % 12) + 12) % 12)) break;
        note = fit(m);
      } else {
        note = fit(scaleStep(this.bassNote, dir, this.key, this.scale));
      }
    }
    this.bassNote = note;
    this.inst.upright(this.out.dry, t, note, 0.72 + 0.18 * this.hum.next() + (beatIdx === 0 ? 0.08 : 0), this.beat * 0.9);
  }

  protected jingle(t: number, play: boolean): number {
    if (play) {
      const k = 60 + (this.seed % 5);
      [0, 4, 7, 11, 14, 19].forEach((iv, i) => this.inst.rhodes(this.rhodesOut, t + i * 0.09, k + iv, 0.65, 1.6 - i * 0.1));
      this.inst.vibes(this.vibesOut, t + 0.55, k + 23, 0.7, 1.4);
      this.inst.vibes(this.vibesOut, t + 0.75, k + 26, 0.6, 1.2);
      this.inst.upright(this.out.dry, t, k - 24, 0.8, 1.6);
      this.inst.drum(this.drums, this.inst.buffers.ride, t, 0.25);
    }
    return 2.8;
  }
}

// ===================================================================================================
// Électro Nuit — deep house: four-on-the-floor, clap, hats, synth bass, pads, arps, stabs, sidechain.

const HOUSE_PROGS: ChordSym[][] = [
  [C(0, 'm9'), C(8, 'maj9'), C(3, 'maj9'), C(10, '69')],
  [C(0, 'm9'), C(5, 'm9'), C(0, 'm9'), C(5, 'm9')],
  [C(0, 'm7'), C(10, 'maj7'), C(8, 'maj7'), C(7, 'm7')],
  [C(0, 'm11'), C(3, 'maj7'), C(5, 'm9'), C(7, 'm7')],
  [C(5, 'm9'), C(10, '9'), C(3, 'maj9'), C(8, 'maj9')],
];
const BASS_PATTERNS: Array<Array<[number, number]>> = [
  [[2, 0], [6, 0], [10, 0], [14, 0]],
  [[0, 0], [3, 0], [6, 12], [8, 0], [11, 0], [14, 12]],
  [[2, 0], [5, 0], [7, 12], [10, 0], [13, 7], [15, 0]],
  [[2, 0], [3, 12], [6, 0], [10, 0], [11, 12], [14, 0]],
];

export class ElectroStation extends Station {
  readonly name = 'Électro Nuit';
  readonly genre = 'Deep house / Électro';
  private key = 36;
  private beat = 0.5;
  private swing = 0.53;
  private prog: ChordSym[] = HOUSE_PROGS[0];
  private bassPat: Array<[number, number]> = BASS_PATTERNS[0];
  private padVoicing: number[] | null = null;
  private stabBars = 0.5;
  private pump: GainNode;
  private drums: GainNode;
  private synths: GainNode;

  constructor(ctx: BaseAudioContext, inst: Instruments, out: StationOut, seed: number) {
    super(ctx, inst, out, seed, 0.4);
    this.pump = ctx.createGain();
    this.pump.connect(this.out.dry);
    const ps = ctx.createGain(); ps.gain.value = 0.3; this.pump.connect(ps).connect(this.out.wet);
    this.drums = ctx.createGain();
    this.drums.connect(this.out.dry);
    const ds = ctx.createGain(); ds.gain.value = 0.08; this.drums.connect(ds).connect(this.out.wet);
    this.synths = ctx.createGain();
    const sp = ctx.createStereoPanner(); sp.pan.value = -0.2;
    this.synths.connect(sp).connect(this.out.dry);
    const ss = ctx.createGain(); ss.gain.value = 0.4; sp.connect(ss).connect(this.out.wet);
  }

  override resetPlayback(now: number): void {
    this.pump.gain.cancelScheduledValues(now);
    this.pump.gain.setValueAtTime(1, now);
  }

  protected newTrack(): void {
    const r = this.rng;
    const tempo = 118 + r.int(7);
    this.beat = 60 / tempo;
    this.stepsPerBar = 16;
    this.stepDur = this.beat / 4;
    this.swing = r.range(0.5, 0.56);
    this.key = 33 + r.int(8);
    this.prog = r.pick(HOUSE_PROGS);
    this.bassPat = r.pick(BASS_PATTERNS);
    this.stabBars = r.range(0.3, 0.7);
    this.trackBars = 49;
  }

  private section(bar: number): 'intro' | 'groove' | 'break' | 'drop' | 'end' {
    if (bar >= this.trackBars - 1) return 'end';
    if (bar < 8) return 'intro';
    if (bar < 24) return 'groove';
    if (bar < 32) return 'break';
    return 'drop';
  }

  private chordAt(bar: number): ChordSym {
    if (bar >= this.trackBars - 1) return this.prog[0];
    return this.prog[Math.floor(bar / 2) % 4];
  }

  protected playStep(bar: number, s: number, t0: number): void {
    const inst = this.inst, b = inst.buffers, h = this.hum;
    const t = t0 + (s & 1 ? (this.swing - 0.5) * 2 * this.stepDur : 0) + humanize(h, 0.002);
    const sec = this.section(bar);
    const chord = this.chordAt(bar);
    const rootMidi = this.key + chord.root;
    const kickOn = sec !== 'break';

    if (sec === 'end') {
      if (s === 0) {
        inst.drum(this.drums, b.kickHouse, t0, 0.8);
        inst.drum(this.drums, b.hatOpen, t0, 0.3, 0.6);
        this.pump.gain.cancelScheduledValues(t0); this.pump.gain.setValueAtTime(1, t0);
        const v = voiceLead(this.padVoicing, rootMidi + 24, CHORD[chord.q], 55, 76);
        inst.pad(this.pump, t0, v, 0.9, this.beat * 4, 1800, 400);
        inst.synthBass(this.pump, t0, rootMidi, 0.9, this.beat * 2, 300);
      }
      return;
    }

    // ---- drums ----
    if (kickOn && s % 4 === 0) {
      inst.drum(this.drums, b.kickHouse, t0, 0.42);
      // sidechain pump on pads + bass
      this.pump.gain.setValueAtTime(0.28, t0);
      this.pump.gain.setTargetAtTime(1, t0 + 0.015, this.beat * 0.2);
    }
    if (sec === 'break' && s === 0 && bar === 24) { this.pump.gain.setTargetAtTime(1, t0, 0.05); }
    if ((sec === 'groove' || sec === 'drop') && (s === 4 || s === 12)) inst.drum(this.drums, b.clap, t, 0.3 + 0.05 * h.next());
    const hatsFull = sec === 'groove' || sec === 'drop';
    if (s % 4 === 2) inst.drum(this.drums, hatsFull ? b.hatOpen : b.hatClosed, t, (hatsFull ? 0.22 : 0.3) * (0.85 + 0.3 * h.next()));
    else if (hatsFull || (sec === 'break' && bar >= 28)) inst.drum(this.drums, b.hatClosed, t, (s % 2 ? 0.1 : 0.16) * (0.7 + 0.6 * h.next()));
    if (sec === 'drop' && s % 2 === 1) inst.drum(this.drums, b.shaker, t, 0.14 * (0.7 + 0.6 * h.next()));
    if (sec === 'drop' && bar === 32 && s === 0) inst.drum(this.drums, b.hatOpen, t0, 0.45, 0.55); // crash-ish
    if (sec === 'groove' && bar % 8 === 7 && s >= 12 && h.chance(0.7)) inst.drum(this.drums, b.clap, t, 0.25); // fill

    // ---- pads (every chord = 2 bars) ----
    if (s === 0 && bar % 2 === 0) {
      this.padVoicing = voiceLead(this.padVoicing, rootMidi + 24, CHORD[chord.q], 55, 76);
      const dur = this.beat * 8 - 0.05;
      let c0 = 1400, c1 = 1400;
      if (sec === 'intro') { c0 = 450 + bar * 70; c1 = c0 + 140; }
      else if (sec === 'break') { c0 = 700 + (bar - 24) * 380; c1 = c0 + 760; }
      else if (sec === 'drop') { c0 = 2200; c1 = 2000; }
      inst.pad(this.pump, t0, this.padVoicing, sec === 'break' ? 1.1 : 0.85, dur, c0, c1);
    }

    // ---- bass ----
    if (sec === 'groove' || sec === 'drop') {
      for (let i = 0; i < this.bassPat.length; i++) {
        const [pos, oct] = this.bassPat[i];
        if (pos !== s) continue;
        inst.synthBass(this.pump, t, rootMidi + oct, 0.85 + 0.15 * h.next(), this.stepDur * 1.6, sec === 'drop' ? 620 : 420);
      }
    }

    // ---- arp (break + second half of drop) ----
    if (sec === 'break' || (sec === 'drop' && bar >= 40)) {
      const iv = CHORD[chord.q];
      const seq = [0, 1, 2, 3, 2, 1];
      const idx = seq[(bar * 16 + s) % seq.length] % iv.length;
      const m = this.key + 36 + chord.root + iv[idx] + (s % 8 === 7 ? 12 : 0);
      const cut = sec === 'break' ? 900 + (bar - 24 + s / 16) * 350 : 2600;
      inst.pluck(this.synths, t, m, s % 4 === 2 ? 0.9 : 0.6, cut);
    }

    // ---- organ stabs (drop) ----
    if (sec === 'drop' && (s === 3 || s === 10) && ((bar * 31 + this.trackNo) % 100) / 100 < this.stabBars && this.padVoicing) {
      inst.organStab(this.synths, t, this.padVoicing.map((m) => m + 12), 0.8, this.stepDur * 1.5);
    }

    // ---- riser into the drop ----
    if (bar === 30 && s === 0) inst.sweep(this.synths, t0, this.beat * 8, 400, 7000, 0.07, 3);
  }

  protected jingle(t: number, play: boolean): number {
    if (play) {
      const st = 60 / 124 / 4;
      const k = 57 + (this.seed % 4);
      const iv = [0, 3, 7, 10, 14, 15, 19, 22];
      iv.forEach((x, i) => this.inst.pluck(this.synths, t + i * st, k + x, 0.9, 1200 + i * 500));
      this.inst.sweep(this.synths, t, st * 8, 600, 6000, 0.05, 2);
      const te = t + st * 8;
      this.pump.gain.cancelScheduledValues(t); this.pump.gain.setValueAtTime(1, t);
      this.inst.drum(this.drums, this.inst.buffers.kickHouse, te, 0.8);
      this.inst.drum(this.drums, this.inst.buffers.clap, te, 0.4);
      this.inst.pad(this.pump, te, [k + 3, k + 7, k + 10, k + 14], 1, 1.2, 2500, 500);
      this.inst.synthBass(this.pump, te, k - 24, 0.9, 0.8, 400);
    }
    return 3.0;
  }
}

// ===================================================================================================
// Paris Musette — accordion waltz (3/4): oom-pah-pah left hand, ornamented melody, musette reeds.

const MUSETTE_MINOR: ChordSym[][] = [
  [C(0, 'min'), C(0, 'min'), C(5, 'min'), C(5, 'min'), C(7, '7'), C(7, '7'), C(0, 'min'), C(0, 'min')],
  [C(0, 'min'), C(0, 'min'), C(7, '7'), C(7, '7'), C(7, '7'), C(7, '7'), C(0, 'min'), C(0, 'min')],
  [C(0, 'min'), C(8, 'maj'), C(5, 'min'), C(7, '7'), C(0, 'min'), C(5, 'min'), C(7, '7'), C(0, 'min')],
  [C(0, 'min'), C(0, 'm6'), C(5, 'min'), C(5, 'm6'), C(7, '7'), C(7, '7b9'), C(0, 'min'), C(7, '7')],
];
const MUSETTE_MINOR_B: ChordSym[] = [C(3, 'maj'), C(3, 'maj'), C(10, '7'), C(10, '7'), C(10, '7'), C(10, '7'), C(3, 'maj'), C(7, '7')];
const MUSETTE_MAJOR: ChordSym[][] = [
  [C(0, 'maj'), C(0, 'maj'), C(7, '7'), C(7, '7'), C(7, '7'), C(7, '7'), C(0, 'maj'), C(0, 'maj')],
  [C(0, 'maj'), C(9, 'min'), C(2, 'min'), C(7, '7'), C(0, 'maj'), C(5, 'maj'), C(7, '7'), C(0, 'maj')],
  [C(0, 'maj'), C(0, '7'), C(5, 'maj'), C(5, 'min'), C(0, 'maj'), C(7, '7'), C(0, 'maj'), C(7, '7')],
];
const MUSETTE_MAJOR_B: ChordSym[] = [C(5, 'maj'), C(5, 'maj'), C(0, 'maj'), C(0, 'maj'), C(2, '7'), C(2, '7'), C(7, '7'), C(7, '7')];
// rhythmic cells in 8ths (sum = 6 per bar)
const CELLS: number[][] = [[2, 2, 2], [3, 1, 2], [1, 1, 1, 1, 1, 1], [2, 1, 1, 2], [1, 1, 2, 2], [2, 2, 1, 1]];
const END_CELLS: number[][] = [[4, 2], [6], [2, 4]];

interface PlannedNote { step: number; len: number; midi: number; grace: boolean; vel: number }

export class MusetteStation extends Station {
  readonly name = 'Paris Musette';
  readonly genre = 'Musette / Valse';
  private key = 52;
  private minor = true;
  private scale: readonly number[] = SCALES.harmonicMinor;
  private beat = 0.35;
  private swing = 0.55;
  private progA: ChordSym[] = MUSETTE_MINOR[0];
  private progB: ChordSym[] = MUSETTE_MINOR_B;
  private chordVoicing: number[] | null = null;
  private mel = 76;
  private dir = 1;
  private plan: PlannedNote[] = [];
  private phraseCells: number[][] = [];
  private melOut: GainNode;
  private lhOut: GainNode;
  private drums: GainNode;

  constructor(ctx: BaseAudioContext, inst: Instruments, out: StationOut, seed: number) {
    super(ctx, inst, out, seed, 1.7);
    this.melOut = ctx.createGain();
    const mp = ctx.createStereoPanner(); mp.pan.value = 0.15;
    this.melOut.connect(mp).connect(this.out.dry);
    const ms = ctx.createGain(); ms.gain.value = 0.3; mp.connect(ms).connect(this.out.wet);
    this.lhOut = ctx.createGain();
    const lp = ctx.createStereoPanner(); lp.pan.value = -0.15;
    this.lhOut.connect(lp).connect(this.out.dry);
    const ls = ctx.createGain(); ls.gain.value = 0.2; lp.connect(ls).connect(this.out.wet);
    this.drums = ctx.createGain(); this.drums.connect(this.out.dry);
  }

  protected newTrack(): void {
    const r = this.rng;
    const tempo = r.range(150, 186);
    this.beat = 60 / tempo;
    this.stepsPerBar = 6;
    this.stepDur = this.beat / 2;
    this.swing = r.range(0.53, 0.58);
    this.minor = r.chance(0.6);
    this.key = 50 + r.int(8);
    this.scale = this.minor ? SCALES.harmonicMinor : SCALES.major;
    this.progA = r.pick(this.minor ? MUSETTE_MINOR : MUSETTE_MAJOR);
    this.progB = this.minor ? MUSETTE_MINOR_B : MUSETTE_MAJOR_B;
    this.trackBars = 65; // A A B A (16 bars each) + final chord
    this.mel = this.key + 19 + r.int(5);
    this.dir = 1;
    this.phraseCells = [];
  }

  private chordAt(bar: number): ChordSym {
    if (bar >= this.trackBars - 1) return C(0, this.minor ? 'min' : 'maj');
    const sec = Math.floor(bar / 16) % 4;
    const prog = sec === 2 ? this.progB : this.progA;
    return prog[bar % 8];
  }

  private planBar(bar: number): void {
    const r = this.rng, chord = this.chordAt(bar);
    const rootPc = (this.key + chord.root) % 12;
    const tones = CHORD[chord.q].map((x) => (rootPc + x) % 12);
    const p = bar % 4;
    const p8 = bar % 8;
    let cell: number[];
    if (p === 3) cell = r.pick(END_CELLS);
    else if (p8 >= 4 && this.phraseCells[p8 - 4]) cell = this.phraseCells[p8 - 4]; // answer phrase reuses rhythm
    else cell = r.pick(CELLS);
    if (p8 < 4) this.phraseCells[p8] = cell;
    this.plan = [];
    let step = 0;
    const arp = cell.length === 6 && r.chance(0.6);
    for (let i = 0; i < cell.length; i++) {
      const len = cell[i];
      let m: number;
      if (i === 0) {
        // downbeat: chord tone near the contour
        const aim = this.mel + this.dir * (p === 3 ? 1 : 3);
        let best = this.mel, bd = 99;
        for (const pc of tones) { const c = nearestPc(aim, pc); const d = Math.abs(c - aim); if (d < bd) { bd = d; best = c; } }
        m = best;
      } else if (arp) {
        // arpeggiate chord tones in the current direction
        let x = this.mel + this.dir;
        for (let k = 0; k < 12; k++, x += this.dir) if (tones.includes(((x % 12) + 12) % 12)) break;
        m = x;
      } else {
        m = scaleStep(this.mel, this.dir, this.key, this.scale);
        if (r.chance(0.2)) m = scaleStep(m, this.dir, this.key, this.scale);
      }
      if (m > 88) { m -= 12; this.dir = -1; }
      if (m < 64) { m += 12; this.dir = 1; }
      if (m > 84) this.dir = -1; else if (m < 68) this.dir = 1;
      else if (r.chance(0.22)) this.dir = -this.dir;
      this.mel = m;
      this.plan.push({ step, len, midi: m, grace: i === 0 && r.chance(0.3), vel: i === 0 ? 0.95 : 0.75 + 0.15 * r.next() });
      step += len;
    }
  }

  protected playStep(bar: number, s: number, t0: number): void {
    const inst = this.inst, h = this.hum, b = inst.buffers;
    const t = t0 + (s & 1 ? (this.swing - 0.5) * this.beat : 0) + humanize(h, 0.005);
    const chord = this.chordAt(bar);
    const rootMidi = this.key + chord.root;
    const end = bar === this.trackBars - 1;
    const fitBass = (m: number): number => { while (m < 38) m += 12; while (m > 50) m -= 12; return m; };

    if (end) {
      if (s === 0) {
        inst.accordion(this.lhOut, t, fitBass(rootMidi), 0.9, this.beat * 2.6, 'bass');
        const v = voiceLead(this.chordVoicing, rootMidi, CHORD[chord.q], 55, 67);
        v.forEach((m) => inst.accordion(this.lhOut, t, m, 0.8, this.beat * 2.6, 'chord'));
        inst.accordion(this.melOut, t, nearestPc(this.mel, rootMidi % 12), 0.9, this.beat * 2.6, 'treble');
      }
      return;
    }

    // ---- left hand: bass on 1 (root / fifth alternating), chord on 2 and 3 ----
    if (s === 0) {
      const changed = bar === 0 || this.chordAt(bar - 1) !== chord;
      const five = !changed && bar % 2 === 1;
      inst.accordion(this.lhOut, t, fitBass(rootMidi + (five ? 7 : 0)), 0.85 + 0.1 * h.next(), this.beat * 0.85, 'bass');
      inst.drum(this.drums, b.kickJazz, t, 0.07);
      this.chordVoicing = voiceLead(this.chordVoicing, rootMidi, CHORD[chord.q].slice(0, 4), 55, 67);
      this.planBar(bar);
    } else if ((s === 2 || s === 4) && this.chordVoicing) {
      for (const m of this.chordVoicing) inst.accordion(this.lhOut, t, m, 0.7 + 0.15 * h.next(), this.beat * 0.42, 'chord');
      inst.drum(this.drums, b.snareBrush, t, 0.05 + 0.02 * h.next());
    }

    // ---- melody ----
    for (let i = 0; i < this.plan.length; i++) {
      const n = this.plan[i];
      if (n.step !== s) continue;
      if (n.grace) inst.accordion(this.melOut, t - 0.05, n.midi - 1, n.vel * 0.7, 0.045, 'treble');
      inst.accordion(this.melOut, t, n.midi, n.vel, n.len * this.stepDur * 0.93, 'treble');
    }
  }

  protected jingle(t: number, play: boolean): number {
    if (play) {
      const k = this.key + 12;
      for (let i = 0; i < 8; i++) this.inst.accordion(this.melOut, t + i * 0.055, k + (i % 2 ? 8 : 7), 0.8, 0.05, 'treble');
      const tv = t + 0.5, ti = t + 1.0;
      [k - 5 + 4 - 12, k - 5 + 7 - 12, k - 5 + 10 - 12].forEach((m) => this.inst.accordion(this.lhOut, tv, m + 12, 0.8, 0.4, 'chord'));
      this.inst.accordion(this.lhOut, tv, k - 29, 0.9, 0.4, 'bass');
      this.inst.accordion(this.melOut, tv, k + 11, 0.85, 0.4, 'treble');
      [k - 12 + 0, k - 12 + 4, k - 12 + 7].forEach((m) => this.inst.accordion(this.lhOut, ti, m, 0.8, 1.0, 'chord'));
      this.inst.accordion(this.lhOut, ti, k - 24, 0.9, 1.0, 'bass');
      this.inst.accordion(this.melOut, ti, k + 12, 0.9, 1.0, 'treble');
    }
    return 2.6;
  }
}
