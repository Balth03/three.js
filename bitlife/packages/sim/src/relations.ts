// Relationships: yearly drift, deaths of relatives, siblings/children births, dating, interactions.
import type { Rng } from './rng.ts';
import type { Content, Life, Npc, RelActionDef, Resolution, YearReport, Loc } from './types.ts';
import { addLine, clamp, L, living, matchesRole, npcById, rngOf } from './util.ts';
import { renderString, roleMine, npcAge, toLocal, country, formatMoney, capitalize } from './text.ts';
import { makeNpc, inheritAppearance, attractedGender } from './people.ts';
import { resolveOutcomes } from './events.ts';
import { checkCond } from './cond.ts';

const DRIFT: Partial<Record<Npc['role'], number>> = {
  mother: -1.2, father: -1.2, sibling: -1.6, grandparent: -1.5, friend: -4, bestfriend: -2.2, classmate: -2.5,
  coworker: -2, boss: -1.5, partner: -3, fiance: -2.5, spouse: -2.2, child: -1, enemy: 1, pet: -0.5,
};

export function yearlyRelations(life: Life, content: Content, rng: Rng, report: YearReport) {
  // Drop leftover dating candidates
  life.npcs = life.npcs.filter((n) => !n.temp);
  const b = content.balance.mortality;
  for (const n of life.npcs) {
    n.interacted = undefined;
    if (!n.alive) continue;
    const age = npcAge(n, life.year);
    n.rel = clamp(n.rel + (DRIFT[n.role] ?? -1) + rng.range(-2.5, 2.5));
    // NPC health & death
    if (n.role === 'pet') {
      if (age > 10 && rng.chance((age - 10) * 0.08)) npcDies(life, content, n, rng, report);
      continue;
    }
    if (age > 40) n.health = clamp(n.health - rng.range(0, 2.5));
    const h = b.a * Math.exp(b.b * age) * Math.exp((60 - n.health) * b.healthK);
    if (age > 18 && (rng.chance(h) || n.health <= 0)) npcDies(life, content, n, rng, report);
  }
  // Friendships fading / breakups
  for (const n of living(life)) {
    if ((n.role === 'friend' || n.role === 'bestfriend') && n.rel < 8) {
      n.role = 'acquaintance';
      addLine(life, { fr: `Mon amitié avec ${n.first} s'est éteinte.`, en: `My friendship with ${n.first} faded away.` }, '🍂', 'bad');
    }
    if ((n.role === 'partner' || n.role === 'fiance') && n.rel < 12 && rng.chance(0.6)) {
      n.role = 'ex';
      addLine(life, { fr: renderString(`${n.first} m'a quitté{|e}.`, { life, content }, 'fr'), en: `${n.first} broke up with me.` }, '💔', 'bad');
      life.stats.happy = clamp(life.stats.happy - 12);
    }
    if (n.role === 'spouse' && n.rel < 8 && rng.chance(0.5)) {
      n.role = 'ex';
      addLine(life, { fr: `${n.first} a demandé le divorce.`, en: `${n.first} filed for divorce.` }, '📜', 'bad');
      life.money = Math.round(life.money * (life.money > 0 ? 0.6 : 1));
      life.stats.happy = clamp(life.stats.happy - 15);
    }
  }
  // Drop acquaintances, old classmates/coworkers that are gone
  life.npcs = life.npcs.filter((n) => n.role !== 'acquaintance');
  // A new baby sibling
  const mom = living(life, 'mother')[0];
  const dad = living(life, 'father')[0];
  if (mom && life.age < 13 && npcAge(mom, life.year) < 42 && living(life, 'sibling').length < 4 && rng.chance(0.06)) {
    const g = rng.chance(0.5) ? 'm' : 'f';
    const sib = makeNpc(life, content, rng, { role: 'sibling', gender: g, age: 0, last: life.last, rel: rng.int(55, 80), app: inheritAppearance(rng, mom.app, dad?.app, g) });
    life.npcs.push(sib);
    addLine(life, { fr: `${g === 'm' ? 'Mon petit frère' : 'Ma petite sœur'} ${sib.first} est né${g === 'm' ? '' : 'e'} !`, en: `My little ${g === 'm' ? 'brother' : 'sister'} ${sib.first} was born!` }, '🍼', 'good');
  }
  // Pregnancy → birth
  if (life.flags.pregnant !== undefined && life.age > Number(life.flags.pregnant)) {
    delete life.flags.pregnant;
    const other = npcById(life, Number(life.flags.babyWith));
    delete life.flags.babyWith;
    const g = rng.chance(0.5) ? 'm' : 'f';
    const kid = makeNpc(life, content, rng, { role: 'child', gender: g, age: 0, last: life.last, rel: 90, app: inheritAppearance(rng, life.app, other?.app, g) });
    kid.smarts = clamp((life.stats.smarts + (other?.smarts ?? 50)) / 2 + rng.gauss() * 12);
    kid.looks = clamp((life.stats.looks + (other?.looks ?? 50)) / 2 + rng.gauss() * 12);
    life.npcs.push(kid);
    life.stats.happy = clamp(life.stats.happy + 15);
    addLine(life, { fr: `${g === 'm' ? 'Mon fils' : 'Ma fille'} ${kid.first} est né${g === 'm' ? '' : 'e'} ! 💕`, en: `My ${g === 'm' ? 'son' : 'daughter'} ${kid.first} was born! 💕` }, '👶', 'good');
    report.milestones.push('baby');
  }
}

function npcDies(life: Life, content: Content, n: Npc, rng: Rng, report: YearReport) {
  n.alive = false;
  n.deathYear = life.year;
  const age = npcAge(n, life.year);
  const close = ['mother', 'father', 'sibling', 'grandparent', 'spouse', 'child', 'bestfriend', 'partner', 'fiance', 'pet'].includes(n.role);
  if (!close && n.rel < 50) {
    life.npcs = life.npcs.filter((x) => x !== n);
    return;
  }
  const lbl = { fr: roleMine(n.role, n.gender, 'fr'), en: roleMine(n.role, n.gender, 'en') };
  addLine(life, {
    fr: capitalize(`${lbl.fr} ${n.first} est mort${n.gender === 'f' ? 'e' : ''} à ${age} an${age > 1 ? 's' : ''}.`),
    en: capitalize(`${lbl.en} ${n.first} died at age ${age}.`),
  }, n.role === 'pet' ? '🐾' : '🕊️', 'bad');
  life.stats.happy = clamp(life.stats.happy - (5 + n.rel * 0.2));
  report.milestones.push(`death:${n.role}`);
  // Inheritance from parents / grandparents / spouse
  if (['mother', 'father', 'grandparent', 'spouse'].includes(n.role) && n.money > 0) {
    const heirs = n.role === 'spouse' ? 1 : 1 + living(life, 'sibling').length;
    const share = Math.round((n.money * (n.role === 'grandparent' ? 0.25 : 0.8)) / heirs * (0.4 + n.rel / 160));
    if (share > 0) {
      life.money += share;
      const c = country(content, life.country);
      addLine(life, { fr: `J'ai hérité de ${formatMoney(share, c, 'fr')} de ${n.first}.`, en: `I inherited ${formatMoney(share, c, 'en')} from ${n.first}.` }, '💰', 'good');
    }
    if (n.role === 'spouse') n.role = 'spouse';
  }
  void rng;
}

// ───────────────────────────── interactions ─────────────────────────────

export interface RelActionView { def: RelActionDef; ok: boolean; reason?: Loc<string> }

export function relActionsFor(life: Life, content: Content, npcId: number): RelActionView[] {
  const n = npcById(life, npcId);
  if (!n || !n.alive) return [];
  const c = country(content, life.country);
  return content.relActions
    .filter((a) => (!a.roles || matchesRole(n, a.roles)) && (!a.notRoles || !matchesRole(n, a.notRoles)) && (!a.targetIf || a.targetIf(n, life)))
    .filter((a) => checkCond(life, content, a.when) && (a.rating ?? 0) <= life.rating && (!life.prison || a.prisonOk))
    .map((a) => {
      let reason: Loc<string> | undefined;
      if (a.minAge !== undefined && life.age < a.minAge) reason = L(`Dès ${a.minAge} ans.`, `From age ${a.minAge}.`);
      else if (a.targetMinAge !== undefined && npcAge(n, life.year) < a.targetMinAge) reason = L('Trop jeune.', 'Too young.');
      else if ((n.interacted?.[a.id] ?? 0) >= (a.limit ?? 1)) reason = L('Déjà fait cette année.', 'Already done this year.');
      else if (a.cost && life.money < toLocal(a.cost, c)) reason = L("Pas assez d'argent.", 'Not enough money.');
      return { def: a, ok: !reason, reason };
    });
}

export function doRelAction(life: Life, content: Content, npcId: number, actionId: string): Resolution | null {
  const n = npcById(life, npcId);
  const view = relActionsFor(life, content, npcId).find((v) => v.def.id === actionId);
  if (!n || !view || !view.ok) return null;
  const a = view.def;
  n.interacted = { ...(n.interacted ?? {}), [a.id]: (n.interacted?.[a.id] ?? 0) + 1 };
  if (a.cost) life.money -= Math.round(toLocal(a.cost, country(content, life.country)));
  const res = resolveOutcomes(life, content, a.out, n, a.icon);
  res.scene = a.scene;
  return res;
}

// ───────────────────────────── dating ─────────────────────────────

export function datingCandidates(life: Life, content: Content): Npc[] {
  const existing = life.npcs.filter((n) => n.temp && n.flags.candidate === life.age);
  if (existing.length) return existing;
  const rng = rngOf(life);
  const out: Npc[] = [];
  for (let i = 0; i < 3; i++) {
    const g = attractedGender(life.gender, life.orientation, rng);
    const lo = life.age < 18 ? Math.max(13, life.age - 1) : Math.max(18, Math.round(life.age * 0.75));
    const hi = life.age < 18 ? Math.min(17, life.age + 1) : Math.round(life.age * 1.2) + 3;
    const n = makeNpc(life, content, rng, { role: 'acquaintance', gender: g, age: rng.int(lo, hi), rel: rng.int(30, 55) });
    n.temp = true;
    n.flags.candidate = life.age;
    life.npcs.push(n);
    out.push(n);
  }
  return out;
}

export function askOut(life: Life, content: Content, npcId: number): Resolution {
  const n = npcById(life, npcId)!;
  const rng = rngOf(life);
  delete n.flags.candidate;
  const p = clamp(0.5 + (life.stats.looks - n.looks) / 120 + (life.stats.happy - 50) / 250 + (life.attrs.fame / 300), 0.08, 0.92);
  const hasPartner = living(life, 'lover').length > 0;
  if (rng.chance(p)) {
    return resolveOutcomes(life, content, [{
      text: L(`${n.first} a dit oui ! On sort ensemble.${hasPartner ? ' (Pourvu que personne ne le découvre…)' : ''}`, `${n.first} said yes! We're dating now.${hasPartner ? " (Hopefully nobody finds out…)" : ''}`),
      fx: { actorRole: 'partner', rel: 20, happy: 10, flag: hasPartner ? 'cheating' : undefined },
      mood: 'love',
    }], n, '💘');
  }
  return resolveOutcomes(life, content, [{
    text: L(`${n.first} m'a gentiment mis un râteau.`, `${n.first} politely turned me down.`),
    fx: { happy: -6, actorGone: true }, mood: 'sad',
  }], n, '💔');
}
