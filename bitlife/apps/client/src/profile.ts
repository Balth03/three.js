// Cross-life profile: achievements, graveyard of past lives, stats. Stored locally.
import type { Life, Loc, Appearance, Gender } from '@bl/sim';

export interface GraveEntry {
  id: string; first: string; last: string; gender: Gender; born: number; died: number; age: number;
  cause: Loc<string>; netWorth: string; score: number; country: string; generation: number; app: Appearance; titles: Loc<string>[]; mode: string;
}

export interface Profile {
  achievements: Record<string, number>;
  graveyard: GraveEntry[];
  lives: number;
  bestScore: number;
  challengesDone: Record<string, number>;
}

const KEY = 'bl:profile';

export function loadProfile(): Profile {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return { achievements: {}, graveyard: [], lives: 0, bestScore: 0, challengesDone: {}, ...p };
  } catch { return { achievements: {}, graveyard: [], lives: 0, bestScore: 0, challengesDone: {} }; }
}

export function storeProfile(p: Profile) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ } }

/** Merges a life's achievements; returns the ids new to the profile. */
export function mergeAchievements(p: Profile, life: Life): string[] {
  const fresh: string[] = [];
  for (const a of life.achievements) if (!p.achievements[a]) { p.achievements[a] = Date.now(); fresh.push(a); }
  if (fresh.length) storeProfile(p);
  return fresh;
}

export function bury(p: Profile, e: GraveEntry) {
  if (p.graveyard.some((g) => g.id === e.id)) return;
  p.graveyard.unshift(e);
  p.graveyard = p.graveyard.slice(0, 200);
  p.lives++;
  p.bestScore = Math.max(p.bestScore, e.score);
  storeProfile(p);
}
