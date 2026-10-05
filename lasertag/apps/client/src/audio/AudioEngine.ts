/**
 * Web Audio graph: master -> compressor -> destination, with buses (music, sfx, voice, ui),
 * a shared reverb send and a tempo-synced delay send. Everything is synthesised: no samples.
 */
export class AudioEngine {
  readonly ctx: AudioContext;
  readonly master: GainNode;
  readonly music: GainNode;
  readonly musicFilter: BiquadFilterNode;
  readonly musicDuck: GainNode;
  readonly sfx: GainNode;
  readonly voice: GainNode;
  readonly ui: GainNode;
  readonly reverb: ConvolverNode;
  readonly reverbSend: GainNode;
  readonly delay: DelayNode;
  readonly delaySend: GainNode;
  readonly noise: AudioBuffer;
  private volumes = { master: 0.8, music: 0.6, sfx: 0.85, voice: 0.9 };

  constructor() {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx({ latencyHint: 'interactive' });
    const ctx = this.ctx;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.2;
    this.master = ctx.createGain();
    this.master.connect(comp).connect(ctx.destination);

    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.makeImpulse(2.6, 2.2);
    this.reverbSend = ctx.createGain();
    this.reverbSend.gain.value = 0.9;
    this.reverbSend.connect(this.reverb).connect(this.master);

    this.delay = ctx.createDelay(2);
    this.delay.delayTime.value = (60 / 124) * 0.75;
    const fb = ctx.createGain(); fb.gain.value = 0.38;
    const dlp = ctx.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 3200;
    this.delaySend = ctx.createGain();
    this.delaySend.connect(this.delay);
    this.delay.connect(dlp).connect(fb).connect(this.delay);
    dlp.connect(this.master);

    this.music = ctx.createGain();
    this.musicDuck = ctx.createGain();
    this.musicFilter = ctx.createBiquadFilter();
    this.musicFilter.type = 'lowpass';
    this.musicFilter.frequency.value = 18000;
    this.musicFilter.Q.value = 0.8;
    this.music.connect(this.musicFilter).connect(this.musicDuck).connect(this.master);
    this.sfx = ctx.createGain(); this.sfx.connect(this.master);
    this.voice = ctx.createGain(); this.voice.connect(this.master);
    this.ui = ctx.createGain(); this.ui.connect(this.master);

    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.applyVolumes();
  }

  private makeImpulse(seconds: number, decay: number): AudioBuffer {
    const rate = this.ctx.sampleRate, len = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        // early reflections cluster + diffuse tail (a big concrete hall)
        const early = i < rate * 0.08 && Math.random() < 0.004 ? (Math.random() * 2 - 1) * 0.8 : 0;
        d[i] = ((Math.random() * 2 - 1) * Math.pow(1 - t, decay) + early) * 0.5;
      }
    }
    return buf;
  }

  setVolumes(v: Partial<typeof this.volumes>) {
    Object.assign(this.volumes, v);
    this.applyVolumes();
  }
  private applyVolumes() {
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(this.volumes.master, t, 0.05);
    this.music.gain.setTargetAtTime(this.volumes.music * 0.55, t, 0.05);
    this.sfx.gain.setTargetAtTime(this.volumes.sfx, t, 0.05);
    this.voice.gain.setTargetAtTime(this.volumes.voice, t, 0.05);
    this.ui.gain.setTargetAtTime(this.volumes.sfx * 0.6, t, 0.05);
  }
  get voiceVolume() { return this.volumes.voice * this.volumes.master; }

  resume() { if (this.ctx.state !== 'running') void this.ctx.resume(); }

  /** Lower the music for a while (announcer, big moments). */
  duck(amount = 0.45, hold = 1.2) {
    const g = this.musicDuck.gain, t = this.ctx.currentTime;
    g.cancelScheduledValues(t);
    g.setTargetAtTime(amount, t, 0.04);
    g.setTargetAtTime(1, t + hold, 0.35);
  }

  /** Muffle the music (menus, shutdown). 0 = muffled, 1 = open. */
  setMusicOpen(k: number, time = 0.4) {
    const f = 300 * Math.pow(18000 / 300, Math.max(0, Math.min(1, k)));
    this.musicFilter.frequency.setTargetAtTime(f, this.ctx.currentTime, time / 3);
  }

  setListener(px: number, py: number, pz: number, fx: number, fy: number, fz: number) {
    const l = this.ctx.listener;
    const t = this.ctx.currentTime;
    if (l.positionX) {
      l.positionX.setTargetAtTime(px, t, 0.01); l.positionY.setTargetAtTime(py, t, 0.01); l.positionZ.setTargetAtTime(pz, t, 0.01);
      l.forwardX.setTargetAtTime(fx, t, 0.01); l.forwardY.setTargetAtTime(fy, t, 0.01); l.forwardZ.setTargetAtTime(fz, t, 0.01);
      l.upX.value = 0; l.upY.value = 1; l.upZ.value = 0;
    } else {
      (l as unknown as { setPosition: (x: number, y: number, z: number) => void }).setPosition(px, py, pz);
      (l as unknown as { setOrientation: (...a: number[]) => void }).setOrientation(fx, fy, fz, 0, 1, 0);
    }
  }
}
