// Save migrations: each step upgrades a raw save object by one version.
import type { Life } from './types.ts';
import { SAVE_VERSION } from './life.ts';

type Raw = Record<string, unknown> & { v?: number };
const STEPS: Record<number, (s: Raw) => Raw> = {
  // 1 → 2: crime, assets, market, dynasty fields
  1: (s) => ({ ...s, v: 2, rating: s.family ? 0 : 1, record: [], heat: 0, assets: [], portfolio: {}, market: {}, loans: [], followers: 0, addictions: {}, counters: {}, achievements: [], generation: 1, ancestors: [] }),
};

export function migrate(raw: unknown): Life {
  let s = raw as Raw;
  if (!s || typeof s !== 'object') throw new Error('Invalid save');
  let v = s.v ?? 1;
  while (v < SAVE_VERSION) {
    const step = STEPS[v];
    if (!step) throw new Error(`No migration from v${v}`);
    s = step(s);
    v = s.v ?? v + 1;
  }
  if (v > SAVE_VERSION) throw new Error(`Save is from a newer version (v${v})`);
  return s as unknown as Life;
}
