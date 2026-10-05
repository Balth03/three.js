// Life creation and the yearly loop.
import { Rng, seedState } from './rng.ts';
import type { Content, Life, NewLifeOptions, Npc, YearReport, Loc } from './types.ts';
import { addLine, clamp, living, rngOf, L } from './util.ts';
import { careerTitle, country, renderString, toLocal } from './text.ts';
import { makeNpc, randomAppearance, randomLast, randomName, pickTraits, inheritAppearance } from './people.ts';
import { yearlyEdu } from './edu.ts';
import { yearlyJob, taxOf } from './career.ts';
import { yearlyHealth, mortality } from './health.ts';
import { yearlyRelations } from './relations.ts';
import { pickEvents, queueEvent, runAuto, runPriority, runScheduled } from './events.ts';
import { snapshot, diff } from './snapshot.ts';

export const SAVE_VERSION = 1;

const ZODIAC: [number, number, Loc<string>][] = [
  [1, 20, L('Capricorne', 'Capricorn')], [2, 19, L('Verseau', 'Aquarius')], [3, 20, L('Poissons', 'Pisces')],
  [4, 20, L('Bélier', 'Aries')], [5, 21, L('Taureau', 'Taurus')], [6, 21, L('Gémeaux', 'Gemini')],
  [7, 22, L('Cancer', 'Cancer')], [8, 23, L('Lion', 'Leo')], [9, 23, L('Vierge', 'Virgo')],
  [10, 23, L('Balance', 'Libra')], [11, 22, L('Scorpion', 'Scorpio')], [12, 22, L('Sagittaire', 'Sagittarius')],
];
const NEXT_SIGN = [L('Verseau', 'Aquarius'), L('Poissons', 'Pisces'), L('Bélier', 'Aries'), L('Taureau', 'Taurus'), L('Gémeaux', 'Gemini'), L('Cancer', 'Cancer'), L('Lion', 'Leo'), L('Vierge', 'Virgo'), L('Balance', 'Libra'), L('Scorpion', 'Scorpio'), L('Sagittaire', 'Sagittarius'), L('Capricorne', 'Capricorn')];

export function zodiac(month: number, day: number): Loc<string> {
  const [, cut, sign] = ZODIAC[month - 1];
  return day < cut ? sign : NEXT_SIGN[month - 1];
}

const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function createLife(content: Content, o: NewLifeOptions = {}): Life {
  const seed = (o.seed ?? Math.floor(Math.random() * 2 ** 31)) >>> 0;
  const rngState = seedState(seed);
  const rng = new Rng(rngState);
  const countryId = o.country ?? rng.pick(content.countries).id;
  const c = country(content, countryId);
  const gender = o.gender ?? (rng.chance(0.5) ? 'm' : 'f');
  const birthYear = o.birthYear ?? 2026;
  const wealth = o.wealth ?? (rng.weighted(['poor', 'middle', 'rich'] as const, (w) => ({ poor: 25, middle: 57, rich: 18 })[w]) ?? 'middle');
  const last = o.last ?? randomLast(rng, content, countryId);
  const life: Life = {
    v: SAVE_VERSION,
    id: `${seed.toString(36)}-${Date.now().toString(36)}`,
    seed,
    rng: rngState,
    mode: o.mode ?? 'classic',
    family: o.family ?? true,
    first: o.first ?? randomName(rng, content, countryId, gender),
    last,
    gender,
    orientation: o.orientation ?? (rng.weighted(['straight', 'gay', 'bi'] as const, (x) => ({ straight: 86, gay: 7, bi: 7 })[x]) ?? 'straight'),
    country: c.id,
    city: o.city ?? rng.pick(c.cities),
    birthYear,
    birthMonth: rng.int(1, 12),
    birthDay: rng.int(1, 28),
    age: 0,
    year: birthYear,
    stats: { happy: 0, health: 0, smarts: 0, looks: 0 },
    attrs: { karma: 50, fame: 0, athletic: rng.int(20, 60), discipline: rng.int(25, 70), stress: 20, fertility: rng.int(50, 95) },
    traits: pickTraits(rng, content, 2),
    talent: rng.pick(content.talents).id,
    talentKnown: false,
    app: randomAppearance(rng, content, countryId, gender),
    money: 0,
    edu: { stage: 'none', enrolled: false, yearInStage: 0, grade: 50, school: '', degrees: [], dropout: false, loan: 0, effort: 40 },
    job: null,
    jobHistory: [],
    npcs: [],
    nextId: 1,
    flags: {},
    seen: {},
    queue: [],
    scheduled: [],
    log: [],
    used: {},
    conditions: [],
    movedOut: false,
    wealth,
    history: [],
    alive: true,
    place: 'home',
  };
  // ── Family
  const momAge = rng.int(19, 40);
  const mom = makeNpc(life, content, rng, { role: 'mother', gender: 'f', age: momAge, last: rng.chance(0.6) ? last : undefined, rel: rng.int(65, 95), wealth });
  const single = rng.chance(0.1);
  const dad = single ? undefined : makeNpc(life, content, rng, { role: 'father', gender: 'm', age: clamp(momAge + rng.int(-3, 7), 19, 55), last, rel: rng.int(60, 95), wealth });
  life.npcs.push(mom);
  if (dad) life.npcs.push(dad);
  life.app = { ...inheritAppearance(rng, mom.app, dad?.app, gender), ...(o.app ?? {}) };
  if (o.app?.hairStyle === undefined) life.app.hairStyle = randomAppearance(rng, content, countryId, gender).hairStyle;
  // Genetics on stats
  const pAvg = (k: 'smarts' | 'looks' | 'health') => (mom[k] + (dad?.[k] ?? mom[k])) / 2;
  life.stats.smarts = clamp(pAvg('smarts') * 0.45 + rng.range(10, 60));
  life.stats.looks = clamp(pAvg('looks') * 0.45 + rng.range(10, 60));
  life.stats.health = clamp(70 + rng.range(0, 30));
  life.stats.happy = clamp(70 + rng.range(0, 30));
  const sibCount = rng.weighted([0, 1, 2, 3], (n) => [40, 38, 16, 6][n]) ?? 0;
  for (let i = 0; i < sibCount; i++) {
    const g = rng.chance(0.5) ? 'm' : 'f';
    const age = rng.int(1, Math.min(14, momAge - 18));
    if (age < 1) continue;
    life.npcs.push(makeNpc(life, content, rng, { role: 'sibling', gender: g, age, last, rel: rng.int(45, 85), app: inheritAppearance(rng, mom.app, dad?.app, g) }));
  }
  for (const parent of [mom, dad]) {
    if (!parent) continue;
    for (const g of ['m', 'f'] as const) {
      const age = npcAgeOf(parent, life) + rng.int(20, 34);
      if (age > 92 || rng.chance(Math.max(0, (age - 60) / 40))) continue;
      const gp = makeNpc(life, content, rng, { role: 'grandparent', gender: g, age, last: g === 'm' ? parent.last : undefined, rel: rng.int(50, 90), wealth });
      gp.job = undefined;
      life.npcs.push(gp);
    }
  }
  if (wealth === 'rich') for (const p of [mom, dad]) if (p) p.money = Math.round(p.money * 1.5);
  writeIntro(life, content);
  life.history.push(statPoint(life));
  return life;
}

function npcAgeOf(n: Npc, life: Life) { return life.year - n.birthYear; }

function writeIntro(life: Life, content: Content) {
  const c = country(content, life.country);
  const ctx = { life, content };
  const z = zodiac(life.birthMonth, life.birthDay);
  addLine(life, {
    fr: renderString(`Je suis né{|e} ${life.gender === 'm' ? 'garçon' : 'fille'} à ${life.city}, ${c.inName.fr}.`, ctx, 'fr'),
    en: `I was born a ${life.gender === 'm' ? 'boy' : 'girl'} in ${life.city}, ${c.name.en}.`,
  }, '👶', 'neutral');
  addLine(life, {
    fr: `Mon anniversaire est le ${life.birthDay === 1 ? '1er' : life.birthDay} ${MONTHS_FR[life.birthMonth - 1]}. Je suis ${z.fr}.`,
    en: `My birthday is ${MONTHS_EN[life.birthMonth - 1]} ${life.birthDay}. I am a ${z.en}.`,
  }, '🎂');
  addLine(life, { fr: `Je m'appelle ${life.first} ${life.last}.`, en: `My name is ${life.first} ${life.last}.` }, '🏷️');
  for (const n of life.npcs) {
    if (n.role !== 'mother' && n.role !== 'father') continue;
    const jobFr = n.job ? careerTitle(content, n.job, 1, n.gender, 'fr') : n.gender === 'f' ? 'sans emploi' : 'sans emploi';
    const jobEn = n.job ? careerTitle(content, n.job, 1, n.gender, 'en') : 'unemployed';
    addLine(life, {
      fr: `${n.role === 'mother' ? 'Ma mère' : 'Mon père'} est ${n.first} ${n.last}, ${jobFr.toLowerCase()} (${npcAgeOf(n, life)} ans).`,
      en: `My ${n.role} is ${n.first} ${n.last}, ${/^[aeiou]/i.test(jobEn) ? 'an' : 'a'} ${jobEn.toLowerCase()} (age ${npcAgeOf(n, life)}).`,
    }, n.role === 'mother' ? '👩' : '👨');
  }
  if (!living(life, 'father').length) addLine(life, L("Je n'ai jamais connu mon père.", 'I never knew my father.'), '❔');
  const sibs = living(life, 'sibling');
  for (const s of sibs) {
    addLine(life, {
      fr: `J'ai ${s.gender === 'm' ? 'un grand frère' : 'une grande sœur'}, ${s.first} (${npcAgeOf(s, life)} ans).`,
      en: `I have an older ${s.gender === 'm' ? 'brother' : 'sister'}, ${s.first} (age ${npcAgeOf(s, life)}).`,
    }, s.gender === 'm' ? '👦' : '👧');
  }
}

export function statPoint(life: Life) {
  return { age: life.age, happy: Math.round(life.stats.happy), health: Math.round(life.stats.health), smarts: Math.round(life.stats.smarts), looks: Math.round(life.stats.looks), money: Math.round(life.money) };
}

/** Advances one year. Returns a report; events are queued in `life.queue`. */
export function ageUp(life: Life, content: Content): YearReport {
  const report: YearReport = { age: life.age + 1, year: life.year + 1, lines: [], queued: 0, died: false, deltas: [], milestones: [] };
  if (!life.alive || life.queue.length) return report;
  const before = snapshot(life);
  const rng = rngOf(life);
  life.age++;
  life.year++;
  life.used = {};
  const logStart = { log: life.log.length };
  // Systems
  yearlyRelations(life, content, rng, report);
  yearlyEdu(life, content, rng, report);
  yearlyJob(life, content, rng, report);
  yearlyMoney(life, content);
  yearlyHealth(life, content, rng, report);
  if (mortality(life, content, rng)) {
    report.died = true;
  } else {
    // Events
    runScheduled(life, content, rng);
    runPriority(life, content, rng);
    const b = content.balance;
    let n = 0;
    if (life.age >= 1 && life.age <= 2) n = rng.chance(0.55) ? 1 : 0;
    else if (life.age >= 3) {
      const probs = life.age <= 12 ? b.minorEvents : b.adultEvents;
      n = rng.weighted([0, 1, 2, 3], (i) => probs[i]) ?? 1;
    }
    if (life.mode === 'chaos') n += 1;
    n = Math.max(0, n - Math.max(0, life.queue.length - 1));
    for (const e of pickEvents(life, content, rng, n)) queueEvent(life, content, e.id, rng);
    runAuto(life, content, rng, life.age < 3 ? 1 : rng.int(0, 2));
  }
  if (!life.alive) report.died = true;
  // Ensure a log entry exists for this age even when nothing happened
  const y = life.log[life.log.length - 1];
  if (!y || y.age !== life.age) life.log.push({ age: life.age, year: life.year, lines: [] });
  void logStart;
  report.lines = life.log[life.log.length - 1].lines.slice();
  report.queued = life.queue.length;
  report.deltas = diff(life, before);
  life.history.push(statPoint(life));
  if (!life.job && !life.edu.enrolled && life.place !== 'cemetery') life.place = life.movedOut ? 'apartment' : 'home';
  if (life.edu.enrolled) life.place = life.edu.stage === 'uni' || life.edu.stage === 'grad' ? 'uni' : 'school';
  else if (life.job) life.place = content.careers.find((c) => c.id === life.job!.careerId)?.place ?? 'office';
  if (life.age < 3) life.place = 'home';
  if (!life.alive) life.place = 'cemetery';
  return report;
}

function yearlyMoney(life: Life, content: Content) {
  const c = country(content, life.country);
  const b = content.balance;
  if (life.age >= 18) {
    // Fixed costs + lifestyle that grows with income (people spend what they earn)
    const income = life.job ? life.job.salary : Number(life.flags.pension ?? 0);
    const fixed = toLocal(life.movedOut ? b.livingCost * (income > 0 ? 1 : 0.55) : (life.job ? b.livingCostHome : 0), c);
    const lifestyle = income * (life.movedOut ? 0.38 : 0.12);
    life.money -= Math.round(fixed + lifestyle);
  }
  // Parents' money evolves a little
  for (const p of living(life, 'parent')) {
    if (p.job) p.money += Math.round(toLocal(4000, c));
  }
  void taxOf;
}

// ───────────────────────────── summary ─────────────────────────────

export interface LifeSummary {
  age: number;
  cause: Loc<string>;
  netWorth: number;
  degrees: string[];
  jobs: number;
  topJob?: { careerId: string; level: number };
  children: number;
  married: boolean;
  friends: number;
  score: number;
  titles: Loc<string>[];
}

export function summarize(life: Life, content: Content): LifeSummary {
  const all = [...life.jobHistory.map((j) => ({ careerId: j.careerId, level: j.level })), ...(life.job ? [{ careerId: life.job.careerId, level: life.job.level }] : [])];
  const topJob = all.sort((a, b) => {
    const sa = content.careers.find((c) => c.id === a.careerId)?.salary[1] ?? 0;
    const sb = content.careers.find((c) => c.id === b.careerId)?.salary[1] ?? 0;
    return sb * (1 + b.level) - sa * (1 + a.level);
  })[0];
  const children = life.npcs.filter((n) => n.role === 'child').length;
  const married = life.npcs.some((n) => n.role === 'spouse');
  const friends = life.npcs.filter((n) => n.alive && (n.role === 'friend' || n.role === 'bestfriend')).length;
  const c = country(content, life.country);
  const wealthBase = life.money / (c.price * c.currency.rate);
  const s = life.stats;
  const score = Math.round(life.age * 0.6 + s.happy * 0.25 + s.smarts * 0.1 + Math.min(30, Math.log10(Math.max(1, wealthBase)) * 5) + children * 3 + (married ? 5 : 0) + life.edu.degrees.length * 3 + life.attrs.karma * 0.1);
  const titles: Loc<string>[] = [];
  if (life.age >= 90) titles.push(L('Doyen{|ne} immortel{|le}', 'Ancient one'));
  if (wealthBase > 1e6) titles.push(L('Millionnaire', 'Millionaire'));
  if (wealthBase < 0) titles.push(L('Criblé{|e} de dettes', 'Drowning in debt'));
  if (life.edu.degrees.some((d) => d.startsWith('grad:'))) titles.push(L('Grosse tête', 'Big brain'));
  if (children >= 4) titles.push(L('Tribu nombreuse', 'Big family'));
  if (life.attrs.karma >= 80) titles.push(L('Cœur en or', 'Heart of gold'));
  if (life.attrs.karma <= 20) titles.push(L('Âme damnée', 'Rotten soul'));
  if (s.happy >= 85) titles.push(L('Heureux{|se} comme tout', 'Happy camper'));
  if (life.age < 30) titles.push(L('Parti{|e} trop tôt', 'Gone too soon'));
  if (!titles.length) titles.push(L('Une vie bien remplie', 'A life well lived'));
  return { age: life.age, cause: life.death?.cause ?? L('—', '—'), netWorth: life.money - life.edu.loan, degrees: life.edu.degrees, jobs: all.length, topJob, children, married, friends, score, titles };
}
