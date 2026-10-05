// Autoplay: plays a whole life with pseudo-random decisions (tests, balancing, mass simulation).
import { Rng } from './rng.ts';
import type { Content, Life, NewLifeOptions } from './types.ts';
import { createLife, ageUp } from './life.ts';
import { choose } from './events.ts';
import { listActions, doAction } from './actions.ts';
import { listJobs, applyJob } from './career.ts';
import { enrollUni, tuitionCost, tuitionOptions } from './edu.ts';
import { listCrimes, commitCrime, trial, escape, parole } from './crime.ts';
import { assetOffers, buyAsset, buyStock, sellStock, startBusiness, canAfford } from './money.ts';
import type { Resolution } from './types.ts';

export interface AutoplayOpts extends NewLifeOptions { maxAge?: number; ambition?: number; crime?: number; spend?: number; vice?: number }

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
  const crimeRate = o.crime ?? 0.15;
  const spend = o.spend ?? 0.3;
  const handleOpen = (res: Resolution | null | undefined) => {
    if (!res?.open) return;
    if (res.open === 'jobs') findJob();
    else if (res.open === 'minigame:trial') trial(life, content, 'minigame', pick.next());
    else if (res.open === 'minigame:escape') escape(life, content, pick.next());
    else if (res.open === 'parole') parole(life, content);
  };
  const drain = () => {
    let guard = 0;
    while (life.queue.length && guard++ < 20) {
      const p = life.queue[0];
      handleOpen(choose(life, content, p.choices.length ? pick.int(0, p.choices.length - 1) : 0));
    }
    if (life.flags.arrested !== undefined && !life.queue.length) trial(life, content, 'public');
  };
  while (life.alive && life.age < maxAge) {
    ageUp(life, content);
    drain();
    if (!life.alive) break;
    // crime
    if (pick.chance(crimeRate) && !life.prison) {
      const cs = listCrimes(life, content).filter((c) => c.ok);
      if (cs.length) { commitCrime(life, content, pick.pick(cs).def.id); drain(); }
    }
    // prison actions
    if (life.prison) {
      const acts = listActions(life, content).filter((a) => a.ok);
      for (let i = 0; i < 2 && acts.length; i++) { const a = pick.pick(acts); handleOpen(doAction(life, content, a.def.id)); drain(); }
      continue;
    }
    // spending & investing
    if (life.age >= 20 && pick.chance(spend)) {
      const kind = pick.pick(['house', 'car', 'luxury'] as const);
      const offers = assetOffers(life, content, kind).filter((x) => !canAfford(life, content, x, 'cash') || !canAfford(life, content, x, 'mortgage'));
      if (offers.length) { const x = offers[offers.length - 1]; buyAsset(life, content, x, canAfford(life, content, x, 'cash') ? 'mortgage' : 'cash'); }
      if (life.money > 0 && pick.chance(0.4)) buyStock(life, content, pick.pick(content.stocks).id, Math.round(life.money * 0.2));
      if (pick.chance(0.1)) for (const id of Object.keys(life.portfolio)) sellStock(life, content, id);
      if (!life.business && pick.chance(0.05)) startBusiness(life, content, pick.pick(content.sectors).id, '');
    }
    // Like a human player: vices only now and then, rehab / doctor when things go wrong.
    const all = listActions(life, content).filter((a) => a.ok && !a.def.open && !a.def.event && a.def.id !== 'dropout' && a.def.id !== 'quit');
    const vice = o.vice ?? 0.15;
    const acts = all.filter((a) => a.def.group !== 'vices' || a.def.id === 'rehab' || pick.chance(vice));
    const care = (id: string) => { const a = all.find((x) => x.def.id === id); if (a) { handleOpen(doAction(life, content, id)); drain(); } };
    if (Object.values(life.addictions).some((v) => v > 35)) care('rehab');
    if (life.stats.health < 45 || life.conditions.length) care('doctor');
    for (let i = 0; i < 3 && acts.length; i++) { doAction(life, content, pick.pick(acts).def.id); drain(); }
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
