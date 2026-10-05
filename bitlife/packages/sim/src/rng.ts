// Deterministic PRNG (sfc32). The 4×u32 state lives inside the Life object so saves are reproducible.

export type RngState = [number, number, number, number];

export function seedState(seed: number): RngState {
  // splitmix32 to spread the seed over the 4 words
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x9e3779b9) >>> 0;
    let z = s;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
    return (z ^ (z >>> 16)) >>> 0;
  };
  const st: RngState = [next(), next(), next(), next()];
  const r = new Rng(st);
  for (let i = 0; i < 12; i++) r.u32();
  return r.s;
}

export class Rng {
  s: RngState;
  constructor(s: RngState) { this.s = s; }

  u32(): number {
    let [a, b, c, d] = this.s;
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    const t = (((a + b) >>> 0) + d) >>> 0;
    d = (d + 1) >>> 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) >>> 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) >>> 0;
    this.s[0] = a; this.s[1] = b; this.s[2] = c; this.s[3] = d;
    return t;
  }

  /** Uniform in [0, 1). */
  next(): number { return this.u32() / 4294967296; }
  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number { return min + Math.floor(this.next() * (max - min + 1)); }
  range(min: number, max: number): number { return min + this.next() * (max - min); }
  chance(p: number): boolean { return this.next() < p; }
  pick<T>(arr: readonly T[]): T { return arr[Math.floor(this.next() * arr.length)]; }
  /** Approximately normal (sum of 3 uniforms), mean 0, sd ≈ 1. */
  gauss(): number { return (this.next() + this.next() + this.next() - 1.5) * 2; }

  weighted<T>(items: readonly T[], weight: (t: T) => number): T | undefined {
    let total = 0;
    for (const it of items) total += Math.max(0, weight(it));
    if (total <= 0) return undefined;
    let r = this.next() * total;
    for (const it of items) {
      r -= Math.max(0, weight(it));
      if (r < 0) return it;
    }
    return items[items.length - 1];
  }

  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

/** Small stateless hash → [0,1) used for cosmetic, non-gameplay randomness. */
export function hash01(n: number): number {
  let z = (n | 0) + 0x6d2b79f5;
  z = Math.imul(z ^ (z >>> 15), z | 1);
  z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
  return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
}
