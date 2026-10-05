// People generation: names, appearance, genetics.
import { Rng } from './rng.ts';
import type { Appearance, Content, Gender, Life, NewNpcSpec, Npc, Orientation } from './types.ts';
import { clamp } from './util.ts';
import { country, toLocal } from './text.ts';

export const SKIN_TONES = 8;
export const HAIR_COLORS = 6; // 6 = grey, 7 = white are age-only
export const HAIR_STYLES = 10;

export function randomAppearance(rng: Rng, content: Content, countryId: string, gender: Gender): Appearance {
  const c = country(content, countryId);
  const skin = weightedIndex(rng, c.skin);
  const darkHair = skin >= 4;
  return {
    skin,
    hair: darkHair ? rng.pick([0, 0, 1, 1, 2]) : rng.pick([0, 1, 1, 2, 2, 3, 4, 4, 5]),
    hairStyle: gender === 'm' ? rng.pick([0, 1, 2, 3, 8]) : rng.pick([4, 5, 6, 7, 9, 2]),
    eyes: rng.int(0, 4),
    height: rng.next(),
    weight: clamp(0.35 + rng.gauss() * 0.15, 0.05, 0.95),
    freckles: rng.chance(0.12),
    glasses: rng.chance(0.15),
    beard: gender === 'm' && rng.chance(0.3) ? rng.int(1, 3) : 0,
    outfit: rng.int(0, 999),
  };
}

function weightedIndex(rng: Rng, weights: number[]): number {
  const idx = weights.map((_, i) => i);
  return rng.weighted(idx, (i) => weights[i]) ?? 0;
}

/** Child appearance from two parents (or one + random). */
export function inheritAppearance(rng: Rng, a: Appearance, b: Appearance | undefined, gender: Gender): Appearance {
  const o = b ?? a;
  const pickP = <T,>(x: T, y: T) => (rng.chance(0.5) ? x : y);
  const skinMix = Math.round((a.skin + o.skin) / 2 + (rng.next() - 0.5));
  return {
    skin: clamp(skinMix, 0, SKIN_TONES - 1),
    hair: Math.min(pickP(a.hair, o.hair), HAIR_COLORS - 1),
    hairStyle: gender === 'm' ? rng.pick([0, 1, 2, 3, 8]) : rng.pick([4, 5, 6, 7, 9, 2]),
    eyes: pickP(a.eyes, o.eyes),
    height: clamp((a.height + o.height) / 2 + rng.gauss() * 0.15, 0, 1),
    weight: clamp(0.3 + rng.gauss() * 0.1, 0.05, 0.9),
    freckles: (a.freckles || o.freckles) ? rng.chance(0.5) : rng.chance(0.06),
    glasses: false,
    beard: 0,
    outfit: rng.int(0, 999),
  };
}

export function randomName(rng: Rng, content: Content, countryId: string, gender: Gender): string {
  const pool = content.names[countryId] ?? Object.values(content.names)[0];
  return rng.pick(gender === 'm' ? pool.m : pool.f);
}

export function randomLast(rng: Rng, content: Content, countryId: string): string {
  const pool = content.names[countryId] ?? Object.values(content.names)[0];
  return rng.pick(pool.last);
}

export function attractedGender(g: Gender, o: Orientation, rng: Rng): Gender {
  if (o === 'straight') return g === 'm' ? 'f' : 'm';
  if (o === 'gay') return g;
  return rng.chance(0.5) ? 'm' : 'f';
}

export interface MakeNpcOpts {
  role: Npc['role'];
  gender?: Gender;
  age: number;
  first?: string;
  last?: string;
  rel?: number;
  app?: Appearance;
  wealth?: Life['wealth'];
  species?: string;
}

export function makeNpc(life: Life, content: Content, rng: Rng, o: MakeNpcOpts): Npc {
  const gender = o.gender ?? (rng.chance(0.5) ? 'm' : 'f');
  const c = country(content, life.country);
  const wealthMoney = { poor: [200, 4000], middle: [3000, 60000], rich: [150000, 3000000] }[o.wealth ?? 'middle'];
  const ageYears = Math.max(0, o.age);
  const n: Npc = {
    id: life.nextId++,
    first: o.first ?? randomName(rng, content, life.country, gender),
    last: o.last ?? randomLast(rng, content, life.country),
    gender,
    birthYear: life.year - ageYears,
    alive: true,
    role: o.role,
    rel: o.rel ?? rng.int(40, 75),
    looks: clamp(50 + rng.gauss() * 22),
    smarts: clamp(50 + rng.gauss() * 22),
    health: clamp(ageYears > 60 ? 40 + rng.gauss() * 20 : 75 + rng.gauss() * 15),
    money: ageYears >= 18 ? Math.round(toLocal(rng.range(wealthMoney[0], wealthMoney[1]), c)) : 0,
    traits: pickTraits(rng, content, 2),
    app: o.app ?? randomAppearance(rng, content, life.country, gender),
    met: life.year,
    flags: {},
  };
  if (o.species) n.species = o.species;
  if (ageYears >= 18 && ageYears < 67 && o.role !== 'pet') n.job = pickJobFor(rng, content, o.wealth ?? 'middle');
  return n;
}

export function pickTraits(rng: Rng, content: Content, n: number): string[] {
  const out: string[] = [];
  const pool = rng.shuffle(content.traits.slice());
  for (const t of pool) {
    if (out.length >= n) break;
    if (out.some((o) => o === t.opposite || content.traits.find((x) => x.id === o)?.opposite === t.id)) continue;
    out.push(t.id);
  }
  return out;
}

function pickJobFor(rng: Rng, content: Content, wealth: Life['wealth']): string | undefined {
  const full = content.careers.filter((c) => !c.partTime && c.minAge >= 16);
  const sorted = full.slice().sort((a, b) => a.salary[1] - b.salary[1]);
  const third = Math.ceil(sorted.length / 3);
  const band = wealth === 'poor' ? sorted.slice(0, third + 2) : wealth === 'rich' ? sorted.slice(-third - 2) : sorted.slice(third - 2, third * 2 + 2);
  if (rng.chance(0.1)) return undefined;
  return rng.pick(band.length ? band : sorted)?.id;
}

/** Creates an NPC from a content spec relative to the player. */
export function npcFromSpec(life: Life, content: Content, rng: Rng, spec: NewNpcSpec): Npc {
  let gender: Gender | undefined;
  switch (spec.gender) {
    case 'same': gender = life.gender; break;
    case 'opposite': gender = life.gender === 'm' ? 'f' : 'm'; break;
    case 'attracted': gender = attractedGender(life.gender, life.orientation, rng); break;
    case 'm': case 'f': gender = spec.gender; break;
    default: gender = undefined;
  }
  const pet = spec.role === 'pet';
  const [lo, hi] = spec.age ?? (pet ? [0, 3] : [-1, 1]);
  let age = spec.abs || (pet && !spec.age) ? rng.int(lo, hi) : Math.max(0, life.age + rng.int(lo, hi));
  // Romantic / adult interactions: never cross the 18 line in either direction
  const romantic = spec.gender === 'attracted' || ['partner', 'fiance', 'spouse', 'ex'].includes(spec.role);
  if (romantic) age = life.age >= 18 ? Math.max(18, age) : Math.min(17, Math.max(13, age));
  return makeNpc(life, content, rng, { role: spec.role, gender, age, species: spec.species });
}
