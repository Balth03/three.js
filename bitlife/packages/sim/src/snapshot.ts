import type { AttrKey, Delta, Life, StatKey } from './types.ts';

export interface Snap { stats: Record<StatKey, number>; attrs: Record<AttrKey, number>; money: number; rels: Map<number, number> }

export function snapshot(life: Life): Snap {
  const rels = new Map<number, number>();
  for (const n of life.npcs) rels.set(n.id, n.rel);
  return { stats: { ...life.stats }, attrs: { ...life.attrs }, money: life.money, rels };
}

const SHOWN_ATTRS: AttrKey[] = ['karma', 'fame', 'athletic', 'discipline'];

export function diff(life: Life, s: Snap): Delta[] {
  const out: Delta[] = [];
  for (const k of Object.keys(life.stats) as StatKey[]) {
    const d = Math.round(life.stats[k] - s.stats[k]);
    if (d) out.push({ key: k, value: d });
  }
  for (const k of SHOWN_ATTRS) {
    const d = Math.round(life.attrs[k] - s.attrs[k]);
    if (d) out.push({ key: k, value: d });
  }
  const dm = Math.round(life.money - s.money);
  if (dm) out.push({ key: 'money', value: dm });
  for (const n of life.npcs) {
    const prev = s.rels.get(n.id);
    if (prev !== undefined) {
      const d = Math.round(n.rel - prev);
      if (d) out.push({ key: 'rel', value: d, npcId: n.id });
    }
  }
  return out;
}
