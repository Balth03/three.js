// Text templating: bilingual rendering, gender agreement, variants, money formatting.
import type { Content, CountryDef, Gender, Lang, Life, Loc, LocText, Npc, Role } from './types.ts';

export interface TextCtx {
  life: Life;
  content: Content;
  actor?: Npc;
  vars?: Record<string, number | string>;
  /** Key used to rotate text variants (the same variant never comes twice in a row). */
  memo?: string;
}

const fmtCache = new Map<string, Intl.NumberFormat>();

export function country(content: Content, id: string): CountryDef {
  return content.countries.find((c) => c.id === id) ?? content.countries[0];
}

/** Converts base units (≈ USD at US price level) to local currency, price-adjusted. */
export function toLocal(base: number, c: CountryDef): number { return base * c.price * c.currency.rate; }
/** Converts base wage units to local currency, wage-adjusted. */
export function wageLocal(base: number, c: CountryDef): number { return base * c.wage * c.currency.rate; }
export function toBase(local: number, c: CountryDef): number { return local / (c.price * c.currency.rate); }

export function formatMoney(local: number, c: CountryDef, lang: Lang): string {
  const key = `${lang}:${c.currency.code}`;
  let f = fmtCache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { style: 'currency', currency: c.currency.code, maximumFractionDigits: 0, minimumFractionDigits: 0 });
    fmtCache.set(key, f);
  }
  // Round to a "nice" precision so amounts look human.
  const a = Math.abs(local);
  const step = a >= 1e7 ? 1e4 : a >= 1e5 ? 100 : a >= 1e3 ? 10 : 1;
  return f.format(Math.round(local / step) * step).replace(/ /g, ' ');
}

export function formatNumber(n: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US').format(n).replace(/ /g, ' ');
}

const ROLE_LABELS: Record<Role, { fr: [string, string]; en: [string, string] }> = {
  mother: { fr: ['ta mère', 'ta mère'], en: ['your mother', 'your mother'] },
  father: { fr: ['ton père', 'ton père'], en: ['your father', 'your father'] },
  sibling: { fr: ['ton frère', 'ta sœur'], en: ['your brother', 'your sister'] },
  grandparent: { fr: ['ton grand-père', 'ta grand-mère'], en: ['your grandfather', 'your grandmother'] },
  friend: { fr: ['ton ami', 'ton amie'], en: ['your friend', 'your friend'] },
  bestfriend: { fr: ['ton meilleur ami', 'ta meilleure amie'], en: ['your best friend', 'your best friend'] },
  classmate: { fr: ['ton camarade', 'ta camarade'], en: ['your classmate', 'your classmate'] },
  coworker: { fr: ['ton collègue', 'ta collègue'], en: ['your coworker', 'your coworker'] },
  boss: { fr: ['ton patron', 'ta patronne'], en: ['your boss', 'your boss'] },
  enemy: { fr: ['ton ennemi', 'ton ennemie'], en: ['your nemesis', 'your nemesis'] },
  partner: { fr: ['ton copain', 'ta copine'], en: ['your boyfriend', 'your girlfriend'] },
  fiance: { fr: ['ton fiancé', 'ta fiancée'], en: ['your fiancé', 'your fiancée'] },
  spouse: { fr: ['ton mari', 'ta femme'], en: ['your husband', 'your wife'] },
  ex: { fr: ['ton ex', 'ton ex'], en: ['your ex', 'your ex'] },
  child: { fr: ['ton fils', 'ta fille'], en: ['your son', 'your daughter'] },
  pet: { fr: ['ton animal', 'ton animal'], en: ['your pet', 'your pet'] },
  acquaintance: { fr: ['ce garçon', 'cette fille'], en: ['this guy', 'this girl'] },
};

const ROLE_TITLES: Record<Role, { fr: [string, string]; en: [string, string] }> = {
  mother: { fr: ['Mère', 'Mère'], en: ['Mother', 'Mother'] },
  father: { fr: ['Père', 'Père'], en: ['Father', 'Father'] },
  sibling: { fr: ['Frère', 'Sœur'], en: ['Brother', 'Sister'] },
  grandparent: { fr: ['Grand-père', 'Grand-mère'], en: ['Grandfather', 'Grandmother'] },
  friend: { fr: ['Ami', 'Amie'], en: ['Friend', 'Friend'] },
  bestfriend: { fr: ['Meilleur ami', 'Meilleure amie'], en: ['Best friend', 'Best friend'] },
  classmate: { fr: ['Camarade', 'Camarade'], en: ['Classmate', 'Classmate'] },
  coworker: { fr: ['Collègue', 'Collègue'], en: ['Coworker', 'Coworker'] },
  boss: { fr: ['Patron', 'Patronne'], en: ['Boss', 'Boss'] },
  enemy: { fr: ['Ennemi', 'Ennemie'], en: ['Nemesis', 'Nemesis'] },
  partner: { fr: ['Copain', 'Copine'], en: ['Boyfriend', 'Girlfriend'] },
  fiance: { fr: ['Fiancé', 'Fiancée'], en: ['Fiancé', 'Fiancée'] },
  spouse: { fr: ['Mari', 'Femme'], en: ['Husband', 'Wife'] },
  ex: { fr: ['Ex', 'Ex'], en: ['Ex', 'Ex'] },
  child: { fr: ['Fils', 'Fille'], en: ['Son', 'Daughter'] },
  pet: { fr: ['Animal', 'Animal'], en: ['Pet', 'Pet'] },
  acquaintance: { fr: ['Connaissance', 'Connaissance'], en: ['Acquaintance', 'Acquaintance'] },
};

export function roleLabel(role: Role, g: Gender, lang: Lang): string { return ROLE_LABELS[role][lang][g === 'm' ? 0 : 1]; }
/** First-person label for diary lines: "mon père", "my father". */
export function roleMine(role: Role, g: Gender, lang: Lang): string {
  const l = roleLabel(role, g, lang);
  return lang === 'fr' ? l.replace(/^ton /, 'mon ').replace(/^ta /, 'ma ') : l.replace(/^your /, 'my ');
}

export function roleTitle(role: Role, g: Gender, lang: Lang): string { return ROLE_TITLES[role][lang][g === 'm' ? 0 : 1]; }

export function careerTitle(content: Content, careerId: string | undefined, level: number, g: Gender, lang: Lang): string {
  if (!careerId) return lang === 'fr' ? 'sans emploi' : 'unemployed';
  const c = content.careers.find((x) => x.id === careerId);
  if (!c) return careerId;
  const titles = c.titles[lang];
  return genderize(titles[Math.min(level, titles.length - 1)], g);
}

function genderize(s: string, g: Gender): string {
  return s.replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_, m, f) => (g === 'm' ? m : f));
}

export function capitalize(s: string): string {
  const i = s.search(/[^\s«"'(“]/);
  if (i < 0) return s;
  return s.slice(0, i) + s.charAt(i).toUpperCase() + s.slice(i + 1);
}

export function npcAge(n: Npc, year: number): number { return year - n.birthYear; }

/** Renders a localized text. `rand` provides randomness; the same draws are used for FR and EN. */
export function renderLoc(text: LocText, ctx: TextCtx, rand: () => number): Loc<string> {
  const r0 = rand();
  const draws: number[] = [];
  for (let i = 0; i < 6; i++) draws.push(rand());
  // Variant rotation: first time a random variant, then the next one each time the same text comes back.
  let slot = -1;
  const multi = Array.isArray(text.fr) && text.fr.length > 1 || Array.isArray(text.en) && text.en.length > 1;
  if (ctx.memo && multi) {
    const memo = (ctx.life.textMemo ??= {});
    const prev = memo[ctx.memo];
    slot = prev === undefined ? Math.floor(r0 * 1000) : prev + 1;
    memo[ctx.memo] = slot;
  }
  const pickVariant = (v: string | string[]) => (Array.isArray(v) ? (slot >= 0 ? v[slot % v.length] : v[Math.floor(r0 * v.length)]) ?? v[0] : v);
  return {
    fr: renderString(pickVariant(text.fr), ctx, 'fr', draws),
    en: renderString(pickVariant(text.en), ctx, 'en', draws),
  };
}

export function renderString(tpl: string, ctx: TextCtx, lang: Lang, draws: number[] = [0, 0, 0, 0, 0, 0]): string {
  let k = 0;
  // [[a|b|c]] inline variants
  let s = tpl.replace(/\[\[([^\]]*)\]\]/g, (_, body: string) => {
    const opts = body.split('|');
    const r = draws[k++ % draws.length] ?? 0;
    return opts[Math.floor(r * opts.length)] ?? opts[0];
  });
  const { life, actor } = ctx;
  // {w:pool} word tokens: the n-th occurrence of a pool picks the same entry in FR and EN (order-independent).
  if (s.includes('{w:') && ctx.content.words) {
    const zero = draws.every((d) => !d);
    const seed = zero ? (life.rng[0] ^ (life.age * 7919) ^ (life.log.length * 104729)) >>> 0 : Math.floor(draws[0] * 4294967295) ^ Math.floor((draws[1] ?? 0.5) * 2654435761);
    const occ: Record<string, number> = {};
    const used: Record<string, Set<number>> = {};
    s = s.replace(/\{w:([a-z_0-9]+)\}/g, (whole, pool: string) => {
      const list = ctx.content.words![pool];
      if (!list?.length) return whole;
      const n = (occ[pool] = (occ[pool] ?? -1) + 1);
      let h = 2166136261 ^ seed;
      for (let i = 0; i < pool.length; i++) h = Math.imul(h ^ pool.charCodeAt(i), 16777619);
      h = Math.imul(h ^ (n * 2246822519), 2654435761) >>> 0;
      let idx = h % list.length;
      const u = (used[pool] ??= new Set());
      while (u.has(idx) && u.size < list.length) idx = (idx + 1) % list.length;
      u.add(idx);
      return list[idx][lang === 'fr' ? 0 : 1];
    });
  }
  s = s.replace(/\{([^{}]*)\}/g, (whole, inner: string) => {
    if (inner.includes('|')) {
      let g: Gender = life.gender;
      let body = inner;
      if (inner.startsWith('a:')) { g = actor?.gender ?? 'm'; body = inner.slice(2); }
      const [m, f] = body.split('|');
      return g === 'm' ? m : (f ?? m);
    }
    return resolveVar(inner, ctx, lang) ?? whole;
  });
  return capitalize(s);
}

function resolveVar(name: string, ctx: TextCtx, lang: Lang): string | undefined {
  const { life, content, actor, vars } = ctx;
  const c = country(content, life.country);
  if (name.startsWith('$')) {
    const v = vars?.[name.slice(1)];
    const n = typeof v === 'number' ? v : Number(v ?? 0);
    return formatMoney(toLocal(n, c), c, lang);
  }
  if (name.startsWith('a.')) {
    if (!actor) return '???';
    const k = name.slice(2);
    switch (k) {
      case 'first': return actor.first;
      case 'last': return actor.last;
      case 'full': return `${actor.first} ${actor.last}`;
      case 'age': return String(npcAge(actor, life.year));
      case 'rel': return roleLabel(actor.role, actor.gender, lang);
      case 'my': return roleMine(actor.role, actor.gender, lang);
      case 'title': return roleTitle(actor.role, actor.gender, lang);
      case 'he': return lang === 'fr' ? (actor.gender === 'm' ? 'il' : 'elle') : actor.gender === 'm' ? 'he' : 'she';
      case 'him': return lang === 'fr' ? (actor.gender === 'm' ? 'le' : 'la') : actor.gender === 'm' ? 'him' : 'her';
      case 'his': return lang === 'fr' ? (actor.gender === 'm' ? 'son' : 'sa') : actor.gender === 'm' ? 'his' : 'her';
      case 'job': return careerTitle(content, actor.job, 1, actor.gender, lang);
      case 'species': return speciesName(actor.species, lang);
    }
    return undefined;
  }
  switch (name) {
    case 'first': return life.first;
    case 'last': return life.last;
    case 'full': return `${life.first} ${life.last}`;
    case 'age': return String(life.age);
    case 'year': return String(life.year);
    case 'city': return life.city;
    case 'country': return c.name[lang];
    case 'school': return life.edu.school || (lang === 'fr' ? "l'école" : 'school');
    case 'job': return life.job ? careerTitle(content, life.job.careerId, life.job.level, life.gender, lang) : lang === 'fr' ? 'sans emploi' : 'unemployed';
    case 'employer': return life.job?.employer ?? '';
    case 'major': {
      const m = content.majors.find((x) => x.id === life.edu.major);
      return m ? m.name[lang] : '';
    }
  }
  const v = vars?.[name];
  if (v !== undefined) return String(v);
  return undefined;
}

export function plain(text: string): Loc<string> { return { fr: text, en: text }; }

const SPECIES: Record<string, [string, string]> = {
  dog: ['chien', 'dog'], cat: ['chat', 'cat'], chat: ['chat', 'cat'], chien: ['chien', 'dog'], hamster: ['hamster', 'hamster'], fish: ['poisson rouge', 'goldfish'],
  parrot: ['perroquet', 'parrot'], snake: ['serpent', 'snake'], goat: ['chèvre', 'goat'], owl: ['hibou', 'owl'], squirrel: ['écureuil', 'squirrel'],
  snail: ['escargot', 'snail'], spider: ['araignée', 'spider'], dragon: ['dragon', 'dragon'], rabbit: ['lapin', 'rabbit'], horse: ['cheval', 'horse'], pig: ['cochon', 'pig'],
};
export function speciesName(s: string | undefined, lang: Lang): string { if (!s) return ''; const v = SPECIES[s]; return v ? v[lang === 'fr' ? 0 : 1] : s; }
