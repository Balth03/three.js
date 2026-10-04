// Minimal music theory for the procedural radio: chord qualities, voicings with voice leading, scales.

import type { Rng } from '../util';

export type Quality =
  | 'maj' | 'min' | 'maj7' | 'm7' | '7' | 'm7b5' | 'dim7' | 'maj9' | 'm9' | '9' | '13' | '7sus'
  | '7b9' | '6' | 'm6' | 'm11' | '69';

/** Intervals from the root. The first entry is always the root. */
export const CHORD: Record<Quality, readonly number[]> = {
  maj: [0, 4, 7], min: [0, 3, 7],
  maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], '7': [0, 4, 7, 10], m7b5: [0, 3, 6, 10], dim7: [0, 3, 6, 9],
  maj9: [0, 4, 7, 11, 14], m9: [0, 3, 7, 10, 14], '9': [0, 4, 7, 10, 14], '13': [0, 4, 10, 14, 21],
  '7sus': [0, 5, 7, 10, 14], '7b9': [0, 4, 7, 10, 13], '6': [0, 4, 7, 9], m6: [0, 3, 7, 9],
  m11: [0, 3, 7, 10, 14, 17], '69': [0, 4, 7, 9, 14],
};

/** Rootless "piano/Rhodes" voicings (the bass plays the root). */
export const ROOTLESS: Partial<Record<Quality, readonly number[]>> = {
  maj7: [4, 7, 11, 14], m7: [3, 7, 10, 14], '7': [4, 10, 14, 21], m7b5: [3, 6, 10, 12],
  maj9: [4, 7, 11, 14], m9: [3, 7, 10, 14], '9': [4, 10, 14, 19], '13': [4, 10, 14, 21],
  '7sus': [5, 10, 14, 19], '7b9': [4, 10, 13, 19], '6': [4, 9, 14, 19], m6: [3, 9, 14, 19],
  m11: [3, 10, 14, 17], '69': [4, 9, 14, 19], dim7: [3, 6, 9, 12],
};

export interface ChordSym { root: number; q: Quality }
export const C = (root: number, q: Quality): ChordSym => ({ root, q });

export const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
} as const;
export type ScaleName = keyof typeof SCALES;

/** Place pitch classes (intervals) in [lo, hi] choosing the voicing closest to `prev` (voice leading). */
export function voiceLead(prev: number[] | null, rootMidi: number, intervals: readonly number[], lo: number, hi: number): number[] {
  const pcs = intervals.map((i) => (((rootMidi + i) % 12) + 12) % 12);
  const n = pcs.length;
  let best: number[] = [];
  let bestCost = Infinity;
  const target = prev && prev.length ? prev.reduce((a, b) => a + b, 0) / prev.length : (lo + hi) / 2;
  for (let inv = 0; inv < n; inv++) {
    for (let oct = -1; oct <= 1; oct++) {
      const v: number[] = [];
      let base = lo + ((pcs[inv] - lo) % 12 + 12) % 12 + oct * 12;
      v.push(base);
      for (let k = 1; k < n; k++) {
        const pc = pcs[(inv + k) % n];
        let m = base + ((pc - base) % 12 + 12) % 12;
        if (m === base) m += 12;
        v.push(m);
        base = m;
      }
      if (v[0] < lo - 2 || v[v.length - 1] > hi + 2) continue;
      let cost: number;
      if (prev && prev.length === n) {
        cost = 0;
        for (let k = 0; k < n; k++) cost += Math.abs(v[k] - prev[k]);
      } else {
        const c = v.reduce((a, b) => a + b, 0) / n;
        cost = Math.abs(c - target) * n;
      }
      if (cost < bestCost) { bestCost = cost; best = v; }
    }
  }
  if (!best.length) { // fallback: stack from lo
    let m = lo;
    best = pcs.map((pc) => { m = m + ((pc - m) % 12 + 12) % 12; return m; });
  }
  return best;
}

/** nearest midi note with pitch class pc to `ref` */
export function nearestPc(ref: number, pc: number): number {
  const base = ref - (((ref - pc) % 12) + 12) % 12;
  return ref - base <= 6 ? base : base + 12;
}

export function chordTones(c: ChordSym, key: number): number[] {
  return CHORD[c.q].map((i) => (((key + c.root + i) % 12) + 12) % 12);
}

export function inScale(pc: number, key: number, scale: readonly number[]): boolean {
  return scale.includes((((pc - key) % 12) + 12) % 12);
}

/** next scale tone above/below `m` (dir ±1) */
export function scaleStep(m: number, dir: number, key: number, scale: readonly number[]): number {
  let x = m + dir;
  for (let i = 0; i < 12; i++, x += dir) if (inScale(x, key, scale)) return x;
  return m + dir;
}

export function humanize(rng: Rng, sd: number): number {
  const v = rng.gauss() * sd;
  return v < -2.5 * sd ? -2.5 * sd : v > 2.5 * sd ? 2.5 * sd : v;
}
