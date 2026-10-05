import { describe, it, expect } from 'vitest';
import { content } from '@bl/data';
import { createLife, ageUp, choose, listActions, doAction, listJobs, applyJob, Rng, type Life } from '../src/index.ts';

/** Plays a full life with pseudo-random choices driven by `seed`. */
export function autoplay(seed: number, maxAge = 120): Life {
  const life = createLife(content, { seed, birthYear: 2000 });
  const pick = new Rng([seed, 7, 13, 99]);
  while (life.alive && life.age < maxAge) {
    ageUp(life, content);
    let guard = 0;
    while (life.queue.length && guard++ < 20) {
      const p = life.queue[0];
      const res = choose(life, content, p.choices.length ? pick.int(0, p.choices.length - 1) : 0);
      if (res?.open === 'jobs') {
        const ok = listJobs(life, content).filter((j) => j.qualified);
        if (ok.length) applyJob(life, content, pick.pick(ok));
      }
    }
    const acts = listActions(life, content).filter((a) => a.ok && !a.def.open && !a.def.event);
    for (let i = 0; i < 2 && acts.length; i++) doAction(life, content, pick.pick(acts).def.id);
    if (!life.job && life.age >= 18 && !life.edu.enrolled && pick.chance(0.5)) {
      const ok = listJobs(life, content).filter((j) => j.qualified);
      if (ok.length) applyJob(life, content, pick.pick(ok));
    }
  }
  return life;
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
    expect(avg).toBeGreaterThan(55);
    expect(avg).toBeLessThan(95);
  });

  it('survives a JSON save/load round-trip mid-life', () => {
    const l = autoplay(42, 25);
    const copy = JSON.parse(JSON.stringify(l)) as Life;
    ageUp(l, content); ageUp(copy, content);
    expect(copy.age).toBe(l.age);
  });
});
