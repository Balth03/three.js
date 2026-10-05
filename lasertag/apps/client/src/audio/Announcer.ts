import type { AnnounceKey } from '@neon/shared';
import type { AudioEngine } from './AudioEngine.ts';

/** Announcer lines (FR). Step 5 replaces speechSynthesis with a home-made vocoder voice. */
export const LINES: Record<AnnounceKey | 'welcome' | 'leadLostTeam', string> = {
  firstBlood: 'Première extinction !',
  double: 'Double désactivation !',
  triple: 'Triple désactivation !',
  rampage: 'Carnage lumineux !',
  unstoppable: 'Inarrêtable !',
  oneMinute: "Plus qu'une minute !",
  thirtySeconds: 'Trente secondes !',
  tenSeconds: 'Dix secondes !',
  overtime: 'Prolongation ! Le prochain point gagne !',
  victory: 'Victoire !',
  defeat: 'Défaite.',
  draw: 'Égalité.',
  leadTaken: 'Vous menez !',
  leadLost: 'Vous êtes menés !',
  leadLostTeam: 'Vous êtes menés !',
  go: 'Allumez-les !',
  headshot: 'Tir au casque !',
  revenge: 'Vengeance !',
  shutdownStreak: 'Série stoppée !',
  welcome: 'Bienvenue dans The Maze.',
};

const PRIORITY: Partial<Record<string, number>> = {
  victory: 10, defeat: 10, draw: 10, overtime: 9, go: 9, tenSeconds: 8, thirtySeconds: 7, oneMinute: 7,
  rampage: 6, triple: 6, unstoppable: 6, double: 5, firstBlood: 5, revenge: 4, leadTaken: 3, leadLost: 3, headshot: 2,
};

export class Announcer {
  private voice: SpeechSynthesisVoice | null = null;
  private busyUntil = 0;
  private currentPriority = 0;
  enabled = true;

  constructor(private readonly a: AudioEngine) {
    const pick = () => {
      const vs = window.speechSynthesis?.getVoices() ?? [];
      // prefer a French male-ish/neutral voice; fall back to any French, then the default
      this.voice = vs.find((v) => /fr/i.test(v.lang) && /(thomas|daniel|paul|henri|google)/i.test(v.name))
        ?? vs.find((v) => /fr/i.test(v.lang)) ?? vs[0] ?? null;
    };
    if ('speechSynthesis' in window) {
      pick();
      window.speechSynthesis.onvoiceschanged = pick;
    }
  }

  say(key: keyof typeof LINES, override?: string) {
    if (!this.enabled) return;
    const text = override ?? LINES[key];
    const pr = PRIORITY[key] ?? 1;
    const now = performance.now();
    if (now < this.busyUntil && pr <= this.currentPriority) return;
    this.stinger(pr);
    this.a.duck(0.4, 1.4);
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (this.voice) u.voice = this.voice;
      u.lang = this.voice?.lang ?? 'fr-FR';
      u.pitch = 0.55;
      u.rate = 1.02;
      u.volume = Math.min(1, this.a.voiceVolume * 1.1);
      window.speechSynthesis.speak(u);
    } catch { /* speech is optional */ }
    this.busyUntil = now + 1400;
    this.currentPriority = pr;
  }

  /** Short synth "radio" blip announcing a voice line. */
  private stinger(pr: number) {
    const ctx = this.a.ctx, t = ctx.currentTime;
    const g = ctx.createGain(); g.connect(this.a.voice);
    const notes = pr >= 9 ? [523, 784, 1046] : [784, 1046];
    notes.forEach((f, k) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = 'square'; o.frequency.value = f;
      og.gain.setValueAtTime(0.0001, t + k * 0.05);
      og.gain.linearRampToValueAtTime(0.05, t + k * 0.05 + 0.005);
      og.gain.exponentialRampToValueAtTime(0.0001, t + k * 0.05 + 0.12);
      o.connect(og).connect(g); o.start(t + k * 0.05); o.stop(t + k * 0.05 + 0.15);
    });
  }
}
