// Synthesised instruments for the procedural radio. Each call schedules one note (native nodes that
// stop themselves). Levels are calibrated so that a full arrangement sits around -20 dBFS RMS.

import type { AudioBuffers } from '../buffers';
import { makeHarmonicWave, midiToHz } from '../util';

export class Instruments {
  private reed: PeriodicWave;
  private organ: PeriodicWave;
  private bassReed: PeriodicWave;
  constructor(readonly ctx: BaseAudioContext, readonly buffers: AudioBuffers) {
    // free-reed spectrum: strong, slowly decaying harmonics with a slight even/odd imbalance
    this.reed = makeHarmonicWave(ctx, [1, 0.72, 0.62, 0.46, 0.4, 0.3, 0.24, 0.18, 0.15, 0.11, 0.09, 0.07, 0.05, 0.04, 0.03, 0.02]);
    this.bassReed = makeHarmonicWave(ctx, [1, 0.9, 0.55, 0.5, 0.3, 0.25, 0.15, 0.1, 0.07, 0.05]);
    this.organ = makeHarmonicWave(ctx, [1, 0.75, 0.15, 0.55, 0, 0.3, 0, 0.22, 0, 0, 0, 0.1]);
  }

  private env(g: AudioParam, t: number, peak: number, attack: number, decayTau: number, sustain: number, end: number, release: number): void {
    g.setValueAtTime(0, t);
    g.linearRampToValueAtTime(peak, t + attack);
    if (decayTau > 0) g.setTargetAtTime(peak * sustain, t + attack, decayTau);
    g.setTargetAtTime(0, Math.max(t + attack, end), release);
  }

  /** Rhodes-like electric piano: 2-op FM with a decaying modulation index (bark) and a soft tine. */
  rhodes(dest: AudioNode, t: number, midi: number, vel: number, dur: number): void {
    const ctx = this.ctx, f = midiToHz(midi);
    const car = ctx.createOscillator(); car.frequency.value = f;
    const mod = ctx.createOscillator(); mod.frequency.value = f;
    const tine = ctx.createOscillator(); tine.frequency.value = f * 4.02;
    const mg = ctx.createGain();
    const idx = f * (0.5 + 1.4 * vel);
    mg.gain.setValueAtTime(idx, t);
    mg.gain.setTargetAtTime(idx * 0.18, t, 0.22);
    const tg = ctx.createGain();
    tg.gain.setValueAtTime(0.12 * vel, t);
    tg.gain.setTargetAtTime(0, t, 0.05);
    const g = ctx.createGain();
    this.env(g.gain, t, 0.13 * vel, 0.003, 1.3, 0.25, t + dur, 0.14);
    mod.connect(mg).connect(car.frequency);
    car.connect(g); tine.connect(tg).connect(g);
    g.connect(dest);
    const stop = t + dur + 0.8;
    car.start(t); mod.start(t); tine.start(t);
    car.stop(stop); mod.stop(stop); tine.stop(t + 0.4);
  }

  /** Vibraphone-ish: sine + 4th partial with motor tremolo feel (via slow AM). */
  vibes(dest: AudioNode, t: number, midi: number, vel: number, dur: number): void {
    const ctx = this.ctx, f = midiToHz(midi);
    const o1 = ctx.createOscillator(); o1.frequency.value = f;
    const o2 = ctx.createOscillator(); o2.frequency.value = f * 3.98;
    const g2 = ctx.createGain(); g2.gain.setValueAtTime(0.35, t); g2.gain.setTargetAtTime(0, t, 0.08);
    const g = ctx.createGain();
    this.env(g.gain, t, 0.1 * vel, 0.002, 0.9, 0.35, t + dur, 0.25);
    const trem = ctx.createOscillator(); trem.frequency.value = 5.2;
    const tg = ctx.createGain(); tg.gain.value = 0.25;
    const am = ctx.createGain(); am.gain.value = 0.75;
    trem.connect(tg).connect(am.gain);
    o1.connect(am); o2.connect(g2).connect(am);
    am.connect(g).connect(dest);
    const stop = t + dur + 1.5;
    o1.start(t); o2.start(t); trem.start(t);
    o1.stop(stop); o2.stop(t + 0.6); trem.stop(stop);
  }

  /** Upright (acoustic) bass pluck. */
  upright(dest: AudioNode, t: number, midi: number, vel: number, dur: number): void {
    const ctx = this.ctx, f = midiToHz(midi);
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
    const s = ctx.createOscillator(); s.frequency.value = f;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 1.2;
    lp.frequency.setValueAtTime(900 + 900 * vel, t);
    lp.frequency.setTargetAtTime(380, t, 0.12);
    const g = ctx.createGain();
    this.env(g.gain, t, 0.15 * vel, 0.006, 0.5, 0.4, t + dur, 0.06);
    const sg = ctx.createGain(); sg.gain.value = 0.7;
    o.connect(lp).connect(g); s.connect(sg).connect(g);
    g.connect(dest);
    o.start(t); s.start(t); o.stop(t + dur + 0.5); s.stop(t + dur + 0.5);
  }

  /** House synth bass: saw + sub sine through a resonant low-pass with an envelope. */
  synthBass(dest: AudioNode, t: number, midi: number, vel: number, dur: number, cutoff: number): void {
    const ctx = this.ctx, f = midiToHz(midi);
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
    const sub = ctx.createOscillator(); sub.frequency.value = f;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 5;
    lp.frequency.setValueAtTime(cutoff * 3.5, t);
    lp.frequency.setTargetAtTime(cutoff, t, 0.06);
    const g = ctx.createGain();
    this.env(g.gain, t, 0.085 * vel, 0.004, 0.2, 0.7, t + dur, 0.03);
    const sg = ctx.createGain(); sg.gain.value = 0.9;
    o.connect(lp).connect(g); sub.connect(sg).connect(g);
    g.connect(dest);
    o.start(t); sub.start(t); o.stop(t + dur + 0.3); sub.stop(t + dur + 0.3);
  }

  /** Warm pad: 2 detuned saws per note into one shared low-pass. */
  pad(dest: AudioNode, t: number, notes: number[], vel: number, dur: number, cutoff: number, cutoffEnd = cutoff): void {
    const ctx = this.ctx;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.9;
    lp.frequency.setValueAtTime(cutoff, t);
    lp.frequency.linearRampToValueAtTime(cutoffEnd, t + dur);
    const g = ctx.createGain();
    const peak = (0.05 * vel) / Math.sqrt(notes.length);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + Math.min(0.5, dur * 0.3));
    g.gain.setValueAtTime(peak, t + dur);
    g.gain.setTargetAtTime(0, t + dur, 0.35);
    lp.connect(g).connect(dest);
    const stop = t + dur + 2;
    for (const m of notes) {
      const f = midiToHz(m);
      for (const det of [-9, 8]) {
        const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = det;
        o.connect(lp); o.start(t); o.stop(stop);
      }
    }
  }

  pluck(dest: AudioNode, t: number, midi: number, vel: number, cutoff: number): void {
    const ctx = this.ctx, f = midiToHz(midi);
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = f;
    const o2 = ctx.createOscillator(); o2.type = 'sawtooth'; o2.frequency.value = f; o2.detune.value = 7;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 3;
    lp.frequency.setValueAtTime(cutoff, t); lp.frequency.setTargetAtTime(cutoff * 0.25, t, 0.06);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05 * vel, t + 0.002); g.gain.setTargetAtTime(0, t + 0.002, 0.09);
    o.connect(lp); o2.connect(lp); lp.connect(g).connect(dest);
    o.start(t); o2.start(t); o.stop(t + 0.7); o2.stop(t + 0.7);
  }

  organStab(dest: AudioNode, t: number, notes: number[], vel: number, dur: number): void {
    const ctx = this.ctx;
    const g = ctx.createGain();
    const peak = (0.07 * vel) / Math.sqrt(notes.length);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 0.004); g.gain.setTargetAtTime(peak * 0.5, t + 0.004, 0.08);
    g.gain.setTargetAtTime(0, t + dur, 0.05);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
    g.connect(lp).connect(dest);
    for (const m of notes) {
      const o = ctx.createOscillator(); o.setPeriodicWave(this.organ); o.frequency.value = midiToHz(m);
      o.connect(g); o.start(t); o.stop(t + dur + 0.4);
    }
  }

  /**
   * Accordion: free-reed timbre, three reeds in "musette" tuning (one centred, one sharp, one flat)
   * which produces the characteristic wet beating; bellows envelope with soft attack.
   */
  accordion(dest: AudioNode, t: number, midi: number, vel: number, dur: number, register: 'treble' | 'bass' | 'chord'): void {
    const ctx = this.ctx, f = midiToHz(midi);
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.value = register === 'treble' ? 3600 : register === 'bass' ? 900 : 2000;
    lp.Q.value = 0.6;
    const peak = (register === 'treble' ? 0.05 : register === 'bass' ? 0.07 : 0.03) * vel;
    const attack = register === 'treble' ? 0.022 : 0.012;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.setTargetAtTime(peak * 0.85, t + attack, 0.3);
    g.gain.setTargetAtTime(0, t + dur, register === 'treble' ? 0.04 : 0.025);
    g.connect(lp).connect(dest);
    const stop = t + dur + 0.3;
    const detunes = register === 'treble' ? [0, 14, -12] : register === 'bass' ? [0, -1200] : [0, 10];
    const wave = register === 'bass' ? this.bassReed : this.reed;
    for (const d of detunes) {
      const o = ctx.createOscillator(); o.setPeriodicWave(wave); o.frequency.value = f; o.detune.value = d;
      o.connect(g); o.start(t); o.stop(stop);
    }
  }

  bell(dest: AudioNode, t: number, midi: number, vel: number, dur: number, ratio = 3.5): void {
    const ctx = this.ctx, f = midiToHz(midi);
    const car = ctx.createOscillator(); car.frequency.value = f;
    const mod = ctx.createOscillator(); mod.frequency.value = f * ratio;
    const mg = ctx.createGain(); mg.gain.setValueAtTime(f * 1.5, t); mg.gain.setTargetAtTime(f * 0.1, t, dur * 0.3);
    const g = ctx.createGain();
    this.env(g.gain, t, 0.07 * vel, 0.003, 0, 1, t + 0.003, dur * 0.35);
    mod.connect(mg).connect(car.frequency); car.connect(g).connect(dest);
    car.start(t); mod.start(t); car.stop(t + dur * 2.5); mod.stop(t + dur * 2.5);
  }

  drum(dest: AudioNode, buf: AudioBuffer, t: number, vel: number, rate = 1): void {
    const s = this.ctx.createBufferSource(); s.buffer = buf; s.playbackRate.value = rate;
    const g = this.ctx.createGain(); g.gain.value = vel;
    s.connect(g).connect(dest);
    s.start(t);
  }

  /** Noise riser / sweep (for build-ups and station-change tuning). */
  sweep(dest: AudioNode, t: number, dur: number, f0: number, f1: number, amp: number, q = 2): void {
    const ctx = this.ctx;
    const s = ctx.createBufferSource(); s.buffer = this.buffers.white; s.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q;
    bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp, t + dur * 0.9); g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(bp).connect(g).connect(dest);
    s.start(t); s.stop(t + dur + 0.05);
  }
}
