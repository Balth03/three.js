import type { AnyStat, Cond, Content, Life, StatKey } from './types.ts';
import { living, career } from './util.ts';
import { country, toBase } from './text.ts';
import type { Rng } from './rng.ts';

const STATS: StatKey[] = ['happy', 'health', 'smarts', 'looks'];

export function statValue(life: Life, k: AnyStat): number {
  return (STATS as string[]).includes(k) ? life.stats[k as StatKey] : life.attrs[k as Exclude<AnyStat, StatKey>];
}

const arr = <T,>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

export function hasDegree(life: Life, d: string): boolean {
  if (d === 'high') return life.edu.degrees.includes('high');
  if (d === 'uni' || d === 'grad') return life.edu.degrees.some((x) => x.startsWith(d + ':'));
  return life.edu.degrees.includes(d);
}

export function checkCond(life: Life, content: Content, c: Cond | undefined, rng?: Rng): boolean {
  if (!c) return true;
  if (c.age && (life.age < c.age[0] || life.age > c.age[1])) return false;
  if (c.gender && life.gender !== c.gender) return false;
  if (c.stat) {
    for (const k in c.stat) {
      const r = c.stat[k as AnyStat]!;
      const v = statValue(life, k as AnyStat);
      if (v < r[0] || v > r[1]) return false;
    }
  }
  for (const f of arr(c.flag)) if (!life.flags[f]) return false;
  for (const f of arr(c.noFlag)) if (life.flags[f]) return false;
  if (c.school !== undefined) {
    if (c.school === 'any') { if (!life.edu.enrolled) return false; }
    else if (c.school === 'none') { if (life.edu.enrolled) return false; }
    else if (!life.edu.enrolled || !arr(c.school).includes(life.edu.stage)) return false;
  }
  if (c.degree && !hasDegree(life, c.degree)) return false;
  if (c.noDegree && hasDegree(life, c.noDegree)) return false;
  if (c.job !== undefined) {
    if (c.job === true && !life.job) return false;
    if (c.job === false && life.job) return false;
    if (typeof c.job === 'string' || Array.isArray(c.job)) {
      if (!life.job) return false;
      const car = career(content, life.job.careerId);
      const ok = arr(c.job).some((j) => (j.startsWith('cat:') ? car?.cat === j.slice(4) : j === life.job!.careerId));
      if (!ok) return false;
    }
  }
  if (c.has && arr(c.has).some((r) => living(life, r).length === 0)) return false;
  if (c.noHas && arr(c.noHas).some((r) => living(life, r).length > 0)) return false;
  if (c.trait && !arr(c.trait).every((t) => life.traits.includes(t))) return false;
  if (c.noTrait && arr(c.noTrait).some((t) => life.traits.includes(t))) return false;
  if (c.money) {
    const b = toBase(life.money, country(content, life.country));
    if (b < c.money[0] || b > c.money[1]) return false;
  }
  if (c.country && !c.country.includes(life.country)) return false;
  if (c.movedOut !== undefined && life.movedOut !== c.movedOut) return false;
  if (c.wealth && !c.wealth.includes(life.wealth)) return false;
  if (c.orientation && !c.orientation.includes(life.orientation)) return false;
  if (c.mode && !c.mode.includes(life.mode)) return false;
  if (c.prison !== undefined && !!life.prison !== c.prison) return false;
  if (c.rating !== undefined && life.rating < c.rating) return false;
  if (c.era && (life.year < c.era[0] || life.year > c.era[1])) return false;
  if (c.asset && !life.assets.some((a) => a.def === c.asset || content.assets.find((d) => d.id === a.def)?.kind === c.asset)) return false;
  if (c.noAsset && life.assets.some((a) => a.def === c.noAsset || content.assets.find((d) => d.id === a.def)?.kind === c.noAsset)) return false;
  if (c.followers && (life.followers < c.followers[0] || life.followers > c.followers[1])) return false;
  if (c.addiction && (life.addictions[c.addiction] ?? 0) < 25) return false;
  if (c.business !== undefined && !!life.business !== c.business) return false;
  if (c.record !== undefined && (life.record.length > 0) !== c.record) return false;
  if (c.counter) for (const k in c.counter) { const v = life.counters[k] ?? 0; if (v < c.counter[k][0] || v > c.counter[k][1]) return false; }
  if (c.test && !c.test(life)) return false;
  if (c.chance !== undefined && rng && !rng.chance(c.chance)) return false;
  return true;
}
