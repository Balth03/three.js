import { Rng } from './rng.ts';
import type { Life, Npc, Role, RoleSel, LogLine, Loc, Tone, Content } from './types.ts';

export const clamp = (v: number, lo = 0, hi = 100) => (v < lo ? lo : v > hi ? hi : v);

/** Rng bound to the life's state array (mutations persist in the save). */
export function rngOf(life: Life): Rng { return new Rng(life.rng); }

const GROUPS: Record<string, Role[]> = {
  parent: ['mother', 'father'],
  family: ['mother', 'father', 'sibling', 'grandparent', 'child', 'spouse'],
  lover: ['partner', 'fiance', 'spouse'],
  anyFriend: ['friend', 'bestfriend'],
  anyone: ['mother', 'father', 'sibling', 'grandparent', 'friend', 'bestfriend', 'classmate', 'coworker', 'boss', 'partner', 'fiance', 'spouse', 'child', 'enemy', 'ex'],
};

export function rolesOf(sel: RoleSel): Role[] { return GROUPS[sel] ?? [sel as Role]; }

export function matchesRole(n: Npc, sel: RoleSel | RoleSel[]): boolean {
  const sels = Array.isArray(sel) ? sel : [sel];
  return sels.some((s) => rolesOf(s).includes(n.role));
}

export function living(life: Life, sel?: RoleSel | RoleSel[]): Npc[] {
  return life.npcs.filter((n) => n.alive && !n.temp && (!sel || matchesRole(n, sel)));
}

export function npcById(life: Life, id: number | undefined): Npc | undefined {
  return id === undefined ? undefined : life.npcs.find((n) => n.id === id);
}

export function currentLog(life: Life) {
  let y = life.log[life.log.length - 1];
  if (!y || y.age !== life.age) {
    y = { age: life.age, year: life.year, lines: [] };
    life.log.push(y);
  }
  return y;
}

export function addLine(life: Life, t: Loc<string>, icon?: string, tone?: Tone): LogLine {
  const line: LogLine = { t, icon, tone };
  currentLog(life).lines.push(line);
  return line;
}

export function lover(life: Life): Npc | undefined { return living(life, 'lover')[0]; }

export function flagOn(life: Life, f: string): boolean { return !!life.flags[f]; }

export function career(content: Content, id: string | undefined) { return id ? content.careers.find((c) => c.id === id) : undefined; }

export const L = (fr: string, en: string): Loc<string> => ({ fr, en });
