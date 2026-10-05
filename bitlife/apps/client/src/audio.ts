// Synthesised SFX + gentle generative music (Web Audio, no assets).
let ctx: AudioContext | null = null;
let master: GainNode, sfxBus: GainNode, musicBus: GainNode;
let muted = false;
let musicVol = 0.5, sfxVol = 0.7;

function ac(): AudioContext | null {
  if (ctx) return ctx;
  try {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.connect(ctx.destination);
    sfxBus = ctx.createGain();
    musicBus = ctx.createGain();
    sfxBus.connect(master);
    musicBus.connect(master);
    applyVol();
  } catch { ctx = null; }
  return ctx;
}

function applyVol() {
  if (!ctx) return;
  master.gain.value = muted ? 0 : 1;
  sfxBus.gain.value = sfxVol;
  musicBus.gain.value = musicVol * 0.35;
}

export function setVolumes(music: number, sfx: number) { musicVol = music; sfxVol = sfx; applyVol(); }
export function toggleMute(): boolean { muted = !muted; applyVol(); return muted; }
export function isMuted() { return muted; }
export function unlockAudio() { const c = ac(); if (c && c.state === 'suspended') void c.resume(); startMusic(); }

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.25, when = 0, slide = 0, bus?: GainNode) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(bus ?? sfxBus);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

function noise(dur: number, vol = 0.15, freq = 1200, when = 0) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + when;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = c.createBufferSource();
  s.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.setValueAtTime(freq, t0);
  f.frequency.exponentialRampToValueAtTime(freq * 3, t0 + dur);
  const g = c.createGain();
  g.gain.value = vol;
  s.connect(f); f.connect(g); g.connect(sfxBus);
  s.start(t0);
}

export const sfx = {
  click: () => tone(880, 0.06, 'triangle', 0.12, 0, 1.4),
  hover: () => tone(1320, 0.03, 'sine', 0.04),
  pop: () => { tone(520, 0.09, 'sine', 0.2, 0, 2.2); },
  open: () => { tone(440, 0.08, 'triangle', 0.12, 0, 1.5); tone(660, 0.1, 'triangle', 0.1, 0.05, 1.3); },
  close: () => tone(660, 0.08, 'triangle', 0.1, 0, 0.6),
  ageUp: () => { noise(0.35, 0.08, 600); [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.13, i * 0.06)); },
  good: () => { [659, 831, 988].forEach((f, i) => tone(f, 0.3, 'sine', 0.15, i * 0.07)); },
  bad: () => { tone(220, 0.35, 'sawtooth', 0.06, 0, 0.6); tone(196, 0.4, 'triangle', 0.12, 0.05, 0.7); },
  coin: () => { tone(988, 0.08, 'square', 0.06); tone(1319, 0.25, 'square', 0.06, 0.07); },
  card: () => { noise(0.15, 0.05, 2500); tone(700, 0.08, 'sine', 0.08, 0.02, 1.5); },
  death: () => { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.7, 'sine', 0.12, i * 0.35)); },
  love: () => { [784, 988, 1175].forEach((f, i) => tone(f, 0.25, 'sine', 0.12, i * 0.1)); },
  /** Animal-Crossing style babble for dialogue text. */
  blips: (text: string) => {
    const n = Math.min(14, Math.ceil(text.length / 12));
    for (let i = 0; i < n; i++) tone(320 + ((text.charCodeAt(i * 3 % text.length) * 7) % 260), 0.05, 'square', 0.03, i * 0.055);
  },
};

// ───────────────────────────── music ─────────────────────────────
let musicTimer: number | null = null;
let ageForMusic = 0;
export function setMusicAge(a: number) { ageForMusic = a; }

const SCALES = [
  [0, 2, 4, 7, 9, 12, 14],      // major pentatonic (childhood)
  [0, 3, 5, 7, 10, 12, 15],     // minor pentatonic (teen)
  [0, 2, 4, 7, 9, 11, 14],      // lydian-ish (adult)
];

function startMusic() {
  if (musicTimer !== null || !ac()) return;
  let step = 0;
  const chords = [[0, 4, 7], [5, 9, 12], [7, 11, 14], [3, 7, 10]];
  const tick = () => {
    const c = ctx!;
    if (c.state !== 'running') return;
    const a = ageForMusic;
    const scale = a < 13 ? SCALES[0] : a < 18 ? SCALES[1] : SCALES[2];
    const root = a < 13 ? 60 : a < 30 ? 57 : a < 60 ? 55 : 53;
    const beat = a < 13 ? 0.32 : a < 30 ? 0.3 : 0.38;
    const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
    if (step % 8 === 0) {
      const ch = chords[(step / 8) % chords.length];
      for (const n of ch) tone(midi(root - 12 + n), beat * 8, 'sine', 0.05, 0, 0, musicBus);
    }
    if (Math.random() < 0.7) {
      const n = scale[Math.floor(Math.random() * scale.length)];
      tone(midi(root + n), beat * 1.6, a < 13 ? 'triangle' : 'sine', 0.06, 0, 0, musicBus);
    }
    step++;
  };
  musicTimer = window.setInterval(tick, 320);
}
