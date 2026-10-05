// Autoplay: plays a whole life with pseudo-random decisions (tests, balancing, mass simulation).
import { Rng } from './rng.ts';
import type { Content, Life, NewLifeOptions } from './types.ts';
import { createLife, ageUp } from './life.ts';
import { choose } from './events.ts';
import { listActions, doAction } from './actions.ts';
import { listJobs, applyJob } from './career.ts';
import { enrollUni, tuitionCost, tuitionOptions } from './edu.ts';

export interface AutoplayOpts extends NewLifeOptions { maxAge?: number; ambition?: number }

export function autoplay(content: Content, seed: number, o: AutoplayOpts = {}): Life {
  const life = createLife(content, { birthYear: 2000, ...o, seed });
  const pick = new Rng([seed ^ 0x5bd1e995, 7, 13, 99]);
  const ambition = o.ambition ?? 0.6;
  const maxAge = o.maxAge ?? 130;
  const findJob = () => {
    const ok = listJobs(life, content).filter((j) => j.qualified && !j.applied);
    ok.sort((a, b) => b.salary - a.salary);
    if (ok.length) applyJob(life, content, ok[Math.min(ok.length - 1, pick.int(0, 2))]);
  };
  while (life.alive && life.age < maxAge) {
    ageUp(life, content);
    let guard = 0;
    while (life.queue.length && guard++ < 20) {
      const p = life.queue[0];
      const res = choose(life, content, p.choices.length ? pick.int(0, p.choices.length - 1) : 0);
      if (res?.open === 'jobs') findJob();
    }
    const acts = listActions(life, content).filter((a) => a.ok && !a.def.open && !a.def.event && a.def.id !== 'dropout' && a.def.id !== 'quit');
    for (let i = 0; i < 3 && acts.length; i++) doAction(life, content, pick.pick(acts).def.id);
    if (life.age >= 18 && !life.edu.enrolled && life.edu.degrees.includes('high') && !life.edu.degrees.some((d) => d.startsWith('uni:')) && life.age < 24 && pick.chance(ambition)) {
      const m = pick.pick(content.majors);
      const cost = tuitionCost(life, content);
      const plan = tuitionOptions(life, content, cost, m.smarts).find((x) => x.ok)?.plan;
      if (plan) enrollUni(life, content, m.id, plan);
    }
    if (!life.job && life.age >= 18 && !life.edu.enrolled && pick.chance(0.7)) findJob();
  }
  return life;
}
