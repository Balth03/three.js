import type { Difficulty } from '@neon/shared';
import type { Quality } from '../render/Renderer.ts';

export interface Settings {
  version: number;
  sensitivity: number;      // 1.0 = 0.0022 rad per mouse count
  adsSensitivity: number;   // multiplier while aiming
  padSensitivity: number;
  invertY: boolean;
  fov: number;              // horizontal degrees at 16:9
  quality: Quality | 'auto';
  master: number; music: number; sfx: number; voice: number;
  difficulty: Difficulty;
  teamSize: number;
  shake: number;
  reducedFlashes: boolean;
  hudScale: number;
  crosshairColor: string;
  crosshairSize: number;
  showFps: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  version: 1,
  sensitivity: 1.0, adsSensitivity: 0.85, padSensitivity: 1.0, invertY: false,
  fov: 100, quality: 'auto',
  master: 0.8, music: 0.6, sfx: 0.85, voice: 0.9,
  difficulty: 'pro', teamSize: 4,
  shake: 1, reducedFlashes: false, hudScale: 1,
  crosshairColor: '#ffffff', crosshairSize: 1, showFps: false,
};

const KEY = 'neontag.settings';

/** Load settings with forward migration; never throws (private mode, corrupted storage…). */
export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const s = JSON.parse(raw) as Partial<Settings>;
    // v0 -> v1: nothing to migrate yet; unknown keys are dropped, missing keys get defaults
    const out = { ...DEFAULT_SETTINGS };
    for (const k of Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]) {
      if (s[k] !== undefined && typeof s[k] === typeof DEFAULT_SETTINGS[k]) (out as Record<string, unknown>)[k] = s[k];
    }
    out.version = DEFAULT_SETTINGS.version;
    return out;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(s: Settings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

/** Convert a horizontal FOV at 16:9 to the vertical FOV three.js expects. */
export function verticalFov(hDeg: number): number {
  const h = (hDeg * Math.PI) / 180;
  return (2 * Math.atan(Math.tan(h / 2) / (16 / 9)) * 180) / Math.PI;
}

export interface Profile { matches: number; wins: number; deactivations: number; bestStreak: number; xp: number }
export function loadProfile(): Profile {
  try { return { matches: 0, wins: 0, deactivations: 0, bestStreak: 0, xp: 0, ...JSON.parse(localStorage.getItem('neontag.profile') ?? '{}') }; }
  catch { return { matches: 0, wins: 0, deactivations: 0, bestStreak: 0, xp: 0 }; }
}
export function saveProfile(p: Profile) { try { localStorage.setItem('neontag.profile', JSON.stringify(p)); } catch { /* ignore */ } }
