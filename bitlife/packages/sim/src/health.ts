// Health, stat drift with age, illnesses, mortality.
import type { Rng } from './rng.ts';
import type { Content, Life, Loc, YearReport } from './types.ts';
import { addLine, clamp, L, living } from './util.ts';
import { country, renderString } from './text.ts';

/** Diseases only caused by events or vices, never rolled at random. */
const EVENT_ONLY = new Set(['missing_finger', 'burns', 'concussion', 'std', 'rabies', 'lung_cancer', 'liver_disease', 'ptsd', 'scurvy', 'tapeworm', 'malaria', 'bird_flu', 'stroke_aftermath', 'eating_disorder', 'obesity', 'sunburn', 'food_poisoning', 'broken_arm', 'sprain', 'hemorrhoids']);

export function contract(life: Life, content: Content, id: string, rng: Rng, silent = false): boolean {
  const d = content.diseases.find((x) => x.id === id);
  if (!d || life.conditions.some((c) => c.id === id)) return false;
  life.conditions.push({ id, since: life.age, severity: rng.range(0.6, 1.2) });
  life.counters.illnesses = (life.counters.illnesses ?? 0) + 1;
  life.stats.health = clamp(life.stats.health - d.health * 0.5);
  if (!silent) addLine(life, { fr: renderString(`On m'a diagnostiqué : ${d.name.fr.toLowerCase()}.`, { life, content }, 'fr'), en: `I was diagnosed with ${d.name.en.toLowerCase()}.` }, d.icon, 'bad');
  return true;
}

export function cure(life: Life, content: Content, id: string | true) {
  const removed = life.conditions.filter((c) => id === true || c.id === id);
  life.conditions = life.conditions.filter((c) => !(id === true || c.id === id));
  for (const c of removed) {
    life.counters[`cured:${c.id}`] = (life.counters[`cured:${c.id}`] ?? 0) + 1;
    const d = content.diseases.find((x) => x.id === c.id);
    if (d) addLine(life, { fr: `Je suis guéri{|e} : ${d.name.fr.toLowerCase()}.`.replace('{|e}', life.gender === 'f' ? 'e' : ''), en: `I was cured of ${d.name.en.toLowerCase()}.` }, '💊', 'good');
  }
}

export function yearlyHealth(life: Life, content: Content, rng: Rng, report: YearReport) {
  const a = life.age;
  const s = life.stats;
  const at = life.attrs;
  // Health
  let dh = 0;
  if (a < 25) dh = (85 - s.health) * 0.08;
  else if (a < 45) dh = -0.4;
  else if (a < 60) dh = -0.7;
  else if (a < 75) dh = -1.3;
  else dh = -2.1;
  // The body heals: injuries from events fade over a few years (less so with age).
  if (a >= 25) { const target = a < 60 ? 70 : a < 75 ? 54 : 40; if (s.health < target) dh += (target - s.health) * (a < 60 ? 0.07 : 0.035); }
  dh += (at.athletic - 50) / 60 - (at.stress - 40) / 60 - Math.max(0, Math.abs(life.app.weight - 0.42) - 0.18) * 6;
  dh += rng.range(-2.5, 2.5);
  // Looks
  let dl = 0;
  if (a < 12) dl = rng.range(-2, 3);
  else if (a < 19) dl = rng.range(-5, 5);
  else if (a < 35) dl = rng.range(-1.2, 1);
  else if (a < 60) dl = -0.6 + rng.range(-1, 0.8);
  else dl = -1.3 + rng.range(-1, 0.6);
  dl -= Math.max(0, Math.abs(life.app.weight - 0.38) - 0.15) * 6;
  // Smarts
  let ds = 0;
  if (!life.edu.enrolled && a > 22 && a < 65) ds = rng.range(-0.8, 0.8);
  if (a >= 70) ds = -rng.range(0.3, 1.8);
  // Conditions
  for (const c of life.conditions) {
    const d = content.diseases.find((x) => x.id === c.id);
    if (!d) continue;
    dh -= d.health * c.severity * (d.chronic ? 0.12 : 0.3);
    s.happy = clamp(s.happy - d.happy * 0.5);
  }
  s.health = clamp(s.health + dh);
  s.looks = clamp(s.looks + dl);
  s.smarts = clamp(s.smarts + ds);
  // Happiness: regression toward a baseline shaped by life circumstances
  const rels = living(life).filter((n) => ['mother', 'father', 'sibling', 'friend', 'bestfriend', 'partner', 'fiance', 'spouse', 'child'].includes(n.role));
  const relAvg = rels.length ? rels.reduce((t, n) => t + n.rel, 0) / rels.length : 35;
  let base = 50 + (relAvg - 50) * 0.3 + (s.health - 60) * 0.15 - (at.stress - 40) * 0.25;
  if (life.job) base += (life.job.perf - 50) * 0.05 + 3;
  else if (a >= 23 && a < 62 && !life.edu.enrolled) base -= 6;
  if (life.money < 0) base -= 8;
  for (const t of life.traits) base += content.traits.find((x) => x.id === t)?.drift?.happy ?? 0;
  s.happy = clamp(s.happy + (base - s.happy) * 0.22 + rng.range(-3, 3));
  at.stress = clamp(at.stress + (35 - at.stress) * 0.3 + (life.job && !life.job.partTime ? 4 : 0));
  // Body weight drifts
  life.app.weight = clamp(life.app.weight + rng.range(-0.02, 0.025) + (a > 35 ? 0.008 : 0) - (at.athletic - 50) / 3000, 0.05, 0.95);
  // Auto recovery & new illnesses
  life.conditions = life.conditions.filter((c) => {
    const d = content.diseases.find((x) => x.id === c.id);
    if (!d || d.chronic) return true;
    if (rng.chance(d.curable * 0.5 + 0.25)) {
      addLine(life, { fr: `Je me suis remis${life.gender === 'f' ? 'e' : ''} : ${d.name.fr.toLowerCase()}.`, en: `I recovered from ${d.name.en.toLowerCase()}.` }, '🌿', 'good');
      return false;
    }
    return true;
  });
  const sickP = 0.07 + (a > 50 ? (a - 50) * 0.005 : 0) + (60 - s.health) / 600;
  if (a >= 1 && rng.chance(sickP)) {
    const pool = content.diseases.filter((d) => !EVENT_ONLY.has(d.id) && (d.minAge ?? 0) <= a && a <= (d.maxAge ?? 200));
    const d = rng.weighted(pool, (d) => (d.chronic ? (a > 45 ? 0.8 : 0.15) : 3) * (d.deadly ? 0.35 : 1));
    if (d) contract(life, content, d.id, rng);
  }
  void report;
}

/** Yearly death roll; returns true if the player died. */
export function mortality(life: Life, content: Content, rng: Rng): boolean {
  if (life.mode === 'zen' || life.mode === 'god') {
    life.stats.health = Math.max(life.stats.health, 5);
    return false;
  }
  if (life.stats.health <= 0) {
    kill(life, content, causeFromConditions(life, content, true) ?? (life.age > 75 ? L('de vieillesse, paisiblement', 'peacefully, of old age') : L("d'une santé trop fragile", 'of poor health')));
    return true;
  }
  const b = content.balance.mortality;
  const c = country(content, life.country);
  const effAge = life.age + (80 - c.lifeExp) * 0.8;
  let h = b.a * Math.exp(b.b * effAge) * Math.exp((60 - life.stats.health) * b.healthK);
  for (const cd of life.conditions) {
    const d = content.diseases.find((x) => x.id === cd.id);
    if (d?.deadly) h += d.deadly * cd.severity;
  }
  if (life.age < 5) h = Math.min(h, b.childFloor);
  if (rng.chance(h)) {
    const cause = causeFromConditions(life, content, true) ??
      (life.age >= 78 ? L('de vieillesse, paisiblement', 'peacefully, of old age') :
        rng.pick([L("d'une crise cardiaque", 'of a heart attack'), L("d'un AVC", 'of a stroke'), L("d'un accident de la route", 'in a car accident'), L('dans mon sommeil', 'in my sleep')]));
    kill(life, content, cause);
    return true;
  }
  return false;
}

function causeFromConditions(life: Life, content: Content, deadlyOnly = false): Loc<string> | undefined {
  const deadly = life.conditions
    .map((c) => content.diseases.find((d) => d.id === c.id))
    .filter((d) => d && (!deadlyOnly || d.deadly))
    .sort((x, y) => (y!.deadly ?? 0) - (x!.deadly ?? 0))[0];
  if (!deadly) return undefined;
  return { fr: `des suites de : ${deadly.name.fr.toLowerCase()}`, en: `from ${deadly.name.en.toLowerCase()}` };
}

export function kill(life: Life, content: Content, cause0: Loc<string>) {
  if (!life.alive) return;
  const low = (x: string) => x.charAt(0).toLowerCase() + x.slice(1);
  const cause = { fr: low(cause0.fr), en: low(cause0.en) };
  life.alive = false;
  if (life.prison) life.flags.diedInPrison = 1;
  life.stats.health = 0;
  life.death = { age: life.age, year: life.year, cause };
  life.queue = [];
  life.place = 'cemetery';
  life.prison = undefined;
  addLine(life, { fr: renderString(`Je suis mort{|e} ${cause.fr}, à ${life.age} ans.`, { life, content }, 'fr'), en: `I died ${cause.en} at age ${life.age}.` }, '🪦', 'bad');
}
