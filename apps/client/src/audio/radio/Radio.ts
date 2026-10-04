// In-car radio: station switching with tuning noise, lookahead scheduler, shared plate reverb and a
// broadcast-style bus (high-pass + glue compression).

import type { AudioBuffers } from '../buffers';
import { Gate, Rng } from '../util';
import { Instruments } from './instruments';
import { ElectroStation, MusetteStation, SeineStation, type Station } from './stations';

const LOOKAHEAD = 0.3; // seconds scheduled ahead of currentTime

export class Radio {
  readonly stations: Station[];
  private index = 0;
  private isOn = false;
  private fader: GainNode;
  private inst: Instruments;
  private nodes: AudioNode[] = [];
  private lastTick = -1;
  private post: AudioNode;
  private gate: Gate;

  constructor(private ctx: BaseAudioContext, buffers: AudioBuffers, dest: AudioNode, seed: number, shortTracks = false) {
    this.inst = new Instruments(ctx, buffers);
    this.fader = ctx.createGain();
    this.fader.gain.value = 0;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 45;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20; comp.knee.value = 10; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.2;
    const makeup = ctx.createGain(); makeup.gain.value = 1.0;
    this.fader.connect(hp).connect(comp).connect(makeup);
    // the whole radio chain (instruments, plate reverb, compressor) is disconnected while the radio is off
    this.gate = new Gate(makeup, dest);
    this.post = hp;
    const dry = ctx.createGain();
    const wet = ctx.createGain();
    const conv = ctx.createConvolver(); conv.buffer = buffers.plateIR;
    const wetRet = ctx.createGain(); wetRet.gain.value = 0.55;
    dry.connect(this.fader);
    wet.connect(conv).connect(wetRet).connect(this.fader);
    this.nodes.push(this.fader, hp, comp, makeup, dry, wet, conv, wetRet);
    const out = { dry, wet };
    this.stations = [
      new SeineStation(ctx, this.inst, out, seed + 11),
      new ElectroStation(ctx, this.inst, out, seed + 23),
      new MusetteStation(ctx, this.inst, out, seed + 37),
    ];
    // every station is already "on air", somewhere in the middle of a track
    const rng = new Rng(seed);
    const now = ctx.currentTime;
    for (const s of this.stations) {
      s.shortTracks = shortTracks;
      s.start(now - (shortTracks ? 0 : rng.range(10, 70)));
      s.catchUp(now);
    }
  }

  get on(): boolean { return this.isOn; }
  get station(): Station { return this.stations[this.index]; }

  setOn(on: boolean, now: number): void {
    if (on === this.isOn) return;
    this.isOn = on;
    this.fader.gain.cancelScheduledValues(now);
    if (on) {
      this.gate.open();
      const st = this.station;
      st.catchUp(now + 0.05);
      st.resetPlayback(now);
      this.fader.gain.setValueAtTime(0, now);
      this.fader.gain.linearRampToValueAtTime(1, now + 0.15);
      this.tick(now);
    } else {
      this.fader.gain.setTargetAtTime(0, now, 0.03);
      this.gate.closeAfter(now + 2.5); // let the reverb tail and scheduled notes finish
    }
  }

  select(delta: number, now: number): void {
    this.index = (this.index + delta + this.stations.length) % this.stations.length;
    if (!this.isOn) return;
    // tuning: dip the music, brief band-passed static sweep
    this.fader.gain.cancelScheduledValues(now);
    this.fader.gain.setValueAtTime(this.fader.gain.value, now);
    this.fader.gain.linearRampToValueAtTime(0.0, now + 0.03);
    this.fader.gain.setValueAtTime(0, now + 0.28);
    this.fader.gain.linearRampToValueAtTime(1, now + 0.45);
    this.inst.sweep(this.post, now, 0.32, 3500, 900, 0.05, 1.2);
    const st = this.station;
    st.catchUp(now + 0.3);
    st.resetPlayback(now + 0.3);
  }

  tick(now: number, lookahead = LOOKAHEAD): void {
    this.gate.update(now);
    if (!this.isOn) return;
    if (now === this.lastTick) return;
    this.lastTick = now;
    this.station.schedule(now + Math.max(LOOKAHEAD, lookahead), true);
  }

  dispose(): void { for (const n of this.nodes) n.disconnect(); }
}
