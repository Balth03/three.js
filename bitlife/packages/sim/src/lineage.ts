// Dynasty: continue as an heir — the child becomes the player, the dead parent becomes an NPC,
// money and assets are inherited, the family tree grows.
import { seedState, Rng } from './rng.ts';
import type { AncestorRecord, Content, Life, Npc, Role } from './types.ts';
import { addLine, clamp, living } from './util.ts';
import { country, npcAge, careerTitle } from './text.ts';
import { makeNpc } from './people.ts';
import { netWorth, initMarket } from './money.ts';
import { STAGE_START } from './edu.ts';
import { statPoint, SAVE_VERSION } from './life.ts';

export function ancestorOf(life: Life, content: Content): AncestorRecord {
  return {
    first: life.first, last: life.last, gender: life.gender, born: life.birthYear, died: life.year,
    cause: life.death?.cause ?? { fr: '—', en: '—' }, netWorth: netWorth(life, content),
    job: life.job ? careerTitle(content, life.job.careerId, life.job.level, life.gender, 'fr') : life.jobHistory.length ? careerTitle(content, life.jobHistory[life.jobHistory.length - 1].careerId, life.jobHistory[life.jobHistory.length - 1].level, life.gender, 'fr') : undefined,
    app: life.app, generation: life.generation,
  };
}

/** Cross-life variety memory: older lives fade, the most recent one counts fully. */
export function mergeFatigue(prev: Record<string, number> | undefined, last: Record<string, number> | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  for (const k in prev ?? {}) { const v = Math.floor(prev![k] * 0.6 * 10) / 10; if (v >= 0.3) out[k] = v; }
  for (const k in last ?? {}) out[k] = Math.min(10, (out[k] ?? 0) + last![k]);
  return out;
}

export function heirs(life: Life): Npc[] {
  return life.npcs.filter((n) => n.role === 'child' && n.alive);
}

export function heirLife(old: Life, content: Content, childId: number): Life {
  const kid = old.npcs.find((n) => n.id === childId)!;
  const seed = (old.seed * 31 + childId * 7919) >>> 0;
  const rng = new Rng(seedState(seed));
  const age = npcAge(kid, old.year);
  const heirsCount = heirs(old).length;
  const estate = Math.max(0, netWorth(old, content));
  const share = Math.round(estate / Math.max(1, heirsCount) * 0.85); // inheritance tax, ha
  const life: Life = {
    ...JSON.parse(JSON.stringify(old)) as Life,
    v: SAVE_VERSION,
    id: `${seed.toString(36)}-${Date.now().toString(36)}`,
    seed,
    rng: rng.s,
    first: kid.first,
    last: kid.last,
    gender: kid.gender,
    orientation: rng.weighted(['straight', 'gay', 'bi'] as const, (x) => ({ straight: 86, gay: 7, bi: 7 })[x]) ?? 'straight',
    birthYear: kid.birthYear,
    birthMonth: rng.int(1, 12),
    birthDay: rng.int(1, 28),
    age,
    stats: { happy: clamp(55 + rng.range(-10, 15)), health: clamp(kid.health), smarts: clamp(kid.smarts), looks: clamp(kid.looks) },
    attrs: { karma: 50, fame: Math.round(old.attrs.fame * 0.4), athletic: rng.int(20, 60), discipline: rng.int(25, 70), stress: 25, fertility: rng.int(50, 95) },
    traits: kid.traits.slice(0, 3),
    talent: rng.pick(content.talents).id,
    talentKnown: false,
    app: kid.app,
    money: share,
    edu: { stage: 'none', enrolled: false, yearInStage: 0, grade: 50, school: '', degrees: [], dropout: false, loan: 0, effort: 40 },
    job: null,
    jobHistory: [],
    npcs: [],
    flags: {},
    seen: {},
    queue: [],
    scheduled: [],
    log: [],
    used: {},
    conditions: [],
    movedOut: age >= 18,
    history: [],
    alive: true,
    death: undefined,
    place: 'home',
    prison: undefined,
    record: [],
    heat: 0,
    assets: heirsCount === 1 ? old.assets.map((a) => ({ ...a, rented: false })) : [],
    portfolio: heirsCount === 1 ? { ...old.portfolio } : {},
    loans: [],
    business: heirsCount === 1 ? old.business : undefined,
    followers: 0,
    addictions: {},
    counters: {},
    achievements: [],
    generation: old.generation + 1,
    ancestors: [...old.ancestors, ancestorOf(old, content)],
    lastFx: [],
  };
  initMarket(life, content);
  // Family: the old player (dead) becomes a parent NPC, the spouse the other parent, siblings, grandparents.
  const parentRole: Role = old.gender === 'f' ? 'mother' : 'father';
  const deadParent: Npc = {
    id: life.nextId++, first: old.first, last: old.last, gender: old.gender, birthYear: old.birthYear, alive: false, deathYear: old.year,
    role: parentRole, rel: 80, looks: old.stats.looks, smarts: old.stats.smarts, health: 0, money: 0, traits: old.traits, app: old.app, met: kid.birthYear, flags: { ancestor: 1 },
    job: old.job?.careerId,
  };
  life.npcs.push(deadParent);
  const spouse = living(old, ['spouse', 'partner', 'fiance']).find(() => true) ?? old.npcs.find((n) => n.role === 'ex');
  if (spouse) life.npcs.push({ ...spouse, id: life.nextId++, role: spouse.gender === 'f' ? 'mother' : 'father', rel: rng.int(55, 90), flags: {} });
  for (const s of old.npcs.filter((n) => n.role === 'child' && n.id !== childId)) life.npcs.push({ ...s, id: life.nextId++, role: 'sibling', rel: rng.int(40, 85), flags: {} });
  for (const g of old.npcs.filter((n) => (n.role === 'mother' || n.role === 'father') && n.alive)) life.npcs.push({ ...g, id: life.nextId++, role: 'grandparent', rel: rng.int(50, 90), flags: {} });
  for (const p of old.npcs.filter((n) => n.role === 'pet' && n.alive)) life.npcs.push({ ...p, id: life.nextId++, flags: {} });
  // Education according to age
  const stage = age >= 18 ? 'none' : age >= (STAGE_START.high ?? 15) ? 'high' : age >= (STAGE_START.middle ?? 11) ? 'middle' : age >= (STAGE_START.primary ?? 6) ? 'primary' : age >= 3 ? 'preschool' : 'none';
  if (stage !== 'none') {
    const c = country(content, life.country);
    life.edu = { ...life.edu, stage, enrolled: true, school: (c.schoolFmt[stage as 'primary'] ?? '{name}').replace('{name}', rng.pick(c.schoolNames)) };
    for (let i = 0; i < 3; i++) life.npcs.push(makeNpc(life, content, rng, { role: 'classmate', age: age + rng.int(-1, 0) }));
    life.place = 'school';
  } else if (age >= 18) life.edu.degrees = rng.chance(0.8) ? ['high'] : [];
  // Log
  life.log.push({ age, year: life.year, lines: [] });
  const c = country(content, life.country);
  addLine(life, { fr: `Je suis ${life.first} ${life.last}, ${age} ans, ${kid.gender === 'm' ? 'fils' : 'fille'} de ${old.first} ${old.last} (génération ${life.generation}).`, en: `I am ${life.first} ${life.last}, ${age}, ${kid.gender === 'm' ? 'son' : 'daughter'} of ${old.first} ${old.last} (generation ${life.generation}).` }, '🌳', 'neutral');
  if (share > 0) addLine(life, { fr: `J'ai hérité de ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: c.currency.code, maximumFractionDigits: 0 }).format(share)}${life.assets.length ? ' et des biens de la famille' : ''}.`, en: `I inherited ${new Intl.NumberFormat('en-US', { style: 'currency', currency: c.currency.code, maximumFractionDigits: 0 }).format(share)}${life.assets.length ? ' and the family property' : ''}.` }, '💰', 'good');
  if (life.assets.some((a) => content.assets.find((d) => d.id === a.def)?.kind === 'house')) {
    const h = life.assets.find((a) => content.assets.find((d) => d.id === a.def)?.kind === 'house')!;
    life.flags.home = h.uid;
    life.place = age < 18 ? life.place : content.assets.find((d) => d.id === h.def)?.home ?? 'home';
  }
  life.history.push(statPoint(life));
  life.fatigue = mergeFatigue(old.fatigue, old.seenCount);
  life.seenCount = {}; life.textMemo = {};
  return life;
}

// ───────────────────────────── reincarnation ─────────────────────────────

export interface Reincarnation { life: Life; verdict: 'saint' | 'good' | 'meh' | 'bad' | 'monster' }

/** Karma decides the next life: country wealth, family money, starting stats and a memory of the previous life. */
export function reincarnate(old: Life, content: Content, createLife: (c: Content, o: import('./types.ts').NewLifeOptions) => Life): Reincarnation {
  const k = old.attrs.karma;
  const seed = (old.seed * 2654435761 + old.year) >>> 0;
  const rng = new Rng(seedState(seed));
  const verdict: Reincarnation['verdict'] = k >= 85 ? 'saint' : k >= 60 ? 'good' : k >= 35 ? 'meh' : k >= 12 ? 'bad' : 'monster';
  const byWealth = content.countries.slice().sort((a, b) => b.wage - a.wage);
  const third = Math.max(1, Math.floor(byWealth.length / 3));
  const pool = verdict === 'saint' || verdict === 'good' ? byWealth.slice(0, third + 1) : verdict === 'meh' ? byWealth : byWealth.slice(-third - 1);
  const ctry = rng.pick(pool)!;
  const wealth: Life['wealth'] = verdict === 'saint' ? 'rich' : verdict === 'good' ? (rng.chance(0.5) ? 'rich' : 'middle') : verdict === 'meh' ? 'middle' : 'poor';
  const life = createLife(content, { seed, country: ctry.id, birthYear: old.year, mode: old.mode, rating: old.rating, wealth, fatigue: mergeFatigue(old.fatigue, old.seenCount) });
  const bump = { saint: 18, good: 8, meh: 0, bad: -10, monster: -20 }[verdict];
  for (const s of ['health', 'looks', 'smarts', 'happy'] as const) life.stats[s] = clamp(life.stats[s] + bump + rng.range(-5, 5));
  life.attrs.karma = clamp(50 + (k - 50) * 0.3);
  life.flags.reincarnated = ((old.flags.reincarnated as number) ?? 0) + 1;
  life.flags.pastLife = `${old.first} ${old.last}`;
  life.counters.reincarnations = (old.counters.reincarnations ?? 0) + 1;
  const name = `${old.first} ${old.last}`;
  const lines: Record<Reincarnation['verdict'], [string, string]> = {
    saint: [`Je me souviens vaguement d'avoir été ${name}, une âme pure. L'univers m'a récompensé{|e} : une famille en or.`, `I vaguely remember being ${name}, a pure soul. The universe rewarded me with a golden family.`],
    good: [`Une impression de déjà-vu : j'ai été ${name}, quelqu'un de plutôt bien. Le karma est bon joueur.`, `Déjà vu: I used to be ${name}, a fairly decent person. Karma is a good sport.`],
    meh: [`Dans une vie antérieure, j'étais ${name}. Ni saint, ni salaud. Retour à la case départ.`, `In a past life I was ${name}. Neither saint nor bastard. Back to square one.`],
    bad: [`J'ai été ${name}, et le karma n'a pas oublié. Je suis né{|e} dans la galère, avec une vague envie de m'excuser.`, `I was ${name}, and karma didn't forget. Born into hardship, with a vague urge to apologise.`],
    monster: [`Ancien${old.gender === 'f' ? 'ne' : ''} ${name}, ordure cosmique notoire. Le karma m'a renvoyé{|e} sur Terre au fond du trou, avec les dettes morales en prime.`, `Formerly ${name}, notorious cosmic scumbag. Karma sent me back to the bottom of the pit, moral debts included.`],
  };
  const [fr, en] = lines[verdict];
  addLine(life, { fr: fr.replace(/\{\|e\}/g, life.gender === 'f' ? 'e' : ''), en }, '♻️', verdict === 'bad' || verdict === 'monster' ? 'bad' : 'good');
  return { life, verdict };
}
