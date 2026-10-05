import { describe, it, expect } from 'vitest';
import { content } from '@bl/data';
import { ageUp, autoplay as autoplaySim, heirLife, heirs, type Life } from '../src/index.ts';

export function autoplay(seed: number, maxAge = 130): Life {
  return autoplaySim(content, seed, { maxAge, rating: (seed % 3) as 0 | 1 | 2, crime: 0.3 });
}

describe('simulation', () => {
  it('is deterministic for a given seed', () => {
    const a = autoplay(1234, 40);
    const b = autoplay(1234, 40);
    expect(JSON.stringify(a.log)).toEqual(JSON.stringify(b.log));
    expect(a.money).toEqual(b.money);
  });

  it('plays many lives without errors and with sane outcomes', () => {
    const ages: number[] = [];
    for (let s = 1; s <= 300; s++) {
      const l = autoplay(s);
      expect(l.alive).toBe(false);
      expect(Number.isFinite(l.money)).toBe(true);
      for (const k of ['happy', 'health', 'smarts', 'looks'] as const) expect(l.stats[k]).toBeGreaterThanOrEqual(0);
      // Every rendered line must be fully resolved
      for (const y of l.log) for (const line of y.lines) {
        expect(line.t.fr).not.toMatch(/\{[^}]*\}|\[\[/);
        expect(line.t.en).not.toMatch(/\{[^}]*\}|\[\[/);
      }
      ages.push(l.age);
    }
    const avg = ages.reduce((a, b) => a + b, 0) / ages.length;
    expect(avg).toBeGreaterThan(45);
    expect(avg).toBeLessThan(95);
  });

  it('exercises crime, prison, assets and dynasty', () => {
    let crimes = 0, prison = 0, assets = 0, heir = 0;
    for (let s = 1; s <= 120; s++) {
      const l = autoplaySim(content, s * 31, { rating: 2, crime: 0.6, spend: 0.6 });
      crimes += l.counters.crimes ?? 0;
      prison += l.record.filter((r) => r.years > 0).length;
      assets += l.assets.length;
      const h = heirs(l);
      if (h.length) {
        const n = heirLife(l, content, h[0].id);
        expect(n.generation).toBe(2);
        expect(n.alive).toBe(true);
        for (let i = 0; i < 5; i++) ageUp(n, content);
        heir++;
      }
    }
    expect(crimes).toBeGreaterThan(50);
    expect(prison).toBeGreaterThan(3);
    expect(assets).toBeGreaterThan(10);
    void heir;
  });

  it('survives a JSON save/load round-trip mid-life', () => {
    const l = autoplay(42, 25);
    const copy = JSON.parse(JSON.stringify(l)) as Life;
    ageUp(l, content); ageUp(copy, content);
    expect(copy.age).toBe(l.age);
  });
});

describe('afterlife', () => {
  it('ghost mode haunts deterministically and ends', async () => {
    const { content } = await import('../../../data/index.ts');
    const { autoplay, startGhost, haunt, ghostYear, hauntable, isGhost, reincarnate, createLife } = await import('../src/index.ts');
    const l = autoplay(content, 11, { rating: 2 });
    expect(l.alive).toBe(false);
    startGhost(l);
    expect(isGhost(l)).toBe(true);
    let done = false, guard = 0;
    while (!done && guard++ < 20) {
      const p = hauntable(l)[0];
      if (p) haunt(l, content, p.id, 'scare');
      done = ghostYear(l, content);
    }
    expect(done).toBe(true);
    expect(l.flags.ascended).toBe(1);
    const r = reincarnate(l, content, createLife);
    expect(r.life.alive).toBe(true);
    expect(r.life.counters.reincarnations).toBe(1);
  });
});
