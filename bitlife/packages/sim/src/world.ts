// World events (eras, crises, booms), addictions, achievements.
import type { Rng } from './rng.ts';
import type { Content, Life, YearReport } from './types.ts';
import { addLine, clamp, L } from './util.ts';
import { renderLoc, country, toLocal } from './text.ts';
import { applyEffect } from './events.ts';
import { contract, kill } from './health.ts';

/** Fires the world events of the year; returns a market shock multiplier. */
export function yearlyWorld(life: Life, content: Content, rng: Rng): number {
  let shock = 1;
  for (const w of content.worldEvents) {
    const key = `world:${w.id}`;
    if (w.countries && !w.countries.includes(life.country)) continue;
    const last = life.seen[key];
    if (w.year !== undefined) {
      if (life.year !== w.year || last !== undefined) continue;
    } else if (w.range) {
      if (life.year < w.range[0] || life.year > w.range[1]) continue;
      if (last !== undefined && life.age - last < (w.cooldown ?? 99)) continue;
      if (!rng.chance(w.chance ?? 0.1)) continue;
    } else continue;
    life.seen[key] = life.age;
    const text = renderLoc(w.text, { life, content }, () => rng.next());
    addLine(life, text, w.icon, 'neutral');
    if (w.fx) applyEffect(life, content, w.fx, undefined, {}, rng);
    if (w.market) shock *= w.market;
  }
  return shock;
}

export const ADDICTIONS = ['alcohol', 'tobacco', 'drugs', 'gambling'] as const;

export function yearlyAddictions(life: Life, content: Content, rng: Rng, report: YearReport) {
  const c = country(content, life.country);
  for (const id of Object.keys(life.addictions)) {
    let lv = life.addictions[id];
    if (lv <= 0) { delete life.addictions[id]; continue; }
    switch (id) {
      case 'alcohol':
        life.stats.health = clamp(life.stats.health - lv / 32);
        life.money -= Math.round(toLocal(lv * 12, c));
        if (lv > 60 && rng.chance(0.05)) contract(life, content, 'liver_disease', rng);
        break;
      case 'tobacco':
        life.stats.health = clamp(life.stats.health - lv / 45);
        life.stats.looks = clamp(life.stats.looks - lv / 80);
        life.money -= Math.round(toLocal(lv * 15, c));
        if (lv > 50 && life.age > 35 && rng.chance(0.02)) contract(life, content, 'lung_cancer', rng);
        break;
      case 'drugs':
        life.stats.health = clamp(life.stats.health - lv / 20);
        life.stats.smarts = clamp(life.stats.smarts - lv / 60);
        life.money -= Math.round(toLocal(lv * 60, c));
        if (lv > 55 && life.mode !== 'zen' && rng.chance((lv - 50) / 900)) {
          kill(life, content, L("d'une overdose, retrouvé{|e} dans les toilettes d'une boîte de nuit", 'of an overdose, found in a nightclub bathroom'));
          life.death!.cause.fr = life.death!.cause.fr.replace('{|e}', life.gender === 'f' ? 'e' : '');
          report.died = true;
          return;
        }
        break;
      case 'gambling':
        if (life.money > 0) life.money -= Math.round(life.money * lv / 400);
        life.stats.happy = clamp(life.stats.happy + rng.range(-6, 3));
        break;
    }
    lv = clamp(lv - rng.range(4, 9));
    life.addictions[id] = lv;
    if (lv > 70 && rng.chance(0.25)) {
      const t = {
        alcohol: L("J'ai fini la soirée en parlant à un lampadaire. Il était de bon conseil.", 'I ended the night talking to a lamppost. It gave good advice.'),
        tobacco: L('Je tousse comme un vieux diesel le matin. Les voisins croient que j\'ai adopté un phoque.', 'I cough like an old diesel every morning. The neighbours think I adopted a seal.'),
        drugs: L('Je ne me souviens pas de la moitié de mon année. L\'autre moitié, je préfère l\'oublier.', "I can't remember half of my year. The other half I'd rather forget."),
        gambling: L('J\'ai misé le loyer sur le rouge. C\'est sorti noir. Évidemment.', 'I bet the rent on red. It came up black. Obviously.'),
      }[id as 'alcohol'];
      if (t) addLine(life, t, '🌀', 'bad');
    }
  }
}

/** Returns newly unlocked achievement ids (also stored in life.achievements). */
export function checkAchievements(life: Life, content: Content, when: 'year' | 'death'): string[] {
  const fresh: string[] = [];
  for (const a of content.achievements) {
    if (life.achievements.includes(a.id)) continue;
    let ok = false;
    try { ok = a.test(life, when); } catch { ok = false; }
    if (ok) { life.achievements.push(a.id); fresh.push(a.id); }
  }
  return fresh;
}
