// Home-made events ("Événements maison"): written by the players, stored locally, shared with the partner in duo mode.
import { content } from '@bl/data';
import { invalidateContent, type EventDef, type Effect } from '@bl/sim';

export interface CustomChoice { label: string; text: string; happy: number; health: number; smarts: number; looks: number; money: number; karma: number; die?: boolean }
export interface CustomEvent { id: string; icon: string; text: string; minAge: number; maxAge: number; rating: 0 | 1 | 2; weight: number; choices: CustomChoice[]; author?: string }

const KEY = 'bl:custom-events';

export function loadCustom(): CustomEvent[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as CustomEvent[]; } catch { return []; }
}
export function saveCustom(list: CustomEvent[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
  install(list);
}

function toDef(c: CustomEvent): EventDef {
  const loc = (s: string) => ({ fr: s, en: s });
  return {
    id: `cu_${c.id}`, icon: c.icon || '✍️', cat: 'custom', rating: c.rating, weight: c.weight, cooldown: 6,
    when: { age: [c.minAge, c.maxAge] },
    text: loc(c.text),
    choices: c.choices.filter((ch) => ch.label.trim()).map((ch) => {
      const fx: Effect = {};
      for (const k of ['happy', 'health', 'smarts', 'looks', 'karma'] as const) if (ch[k]) (fx as Record<string, number>)[k] = ch[k];
      if (ch.money) fx.money = ch.money;
      if (ch.die) fx.die = { fr: `à cause d'un événement maison (${c.author ?? 'merci qui ?'})`, en: `because of a home-made event (${c.author ?? 'thanks to whom?'})` };
      return { label: loc(ch.label), out: [{ text: loc(ch.text || ch.label), fx }] };
    }),
  } as EventDef;
}

/** Inserts (or replaces) the custom events into the shared content object. */
export function install(list = loadCustom()) {
  content.events = content.events.filter((e) => !e.id.startsWith('cu_')).concat(list.filter((c) => c.text.trim() && c.choices.some((x) => x.label.trim())).map(toDef));
  invalidateContent(content);
}

/** Merges events received from the partner (duo). */
export function mergeCustom(incoming: CustomEvent[]) {
  const mine = loadCustom();
  for (const e of incoming) { const i = mine.findIndex((m) => m.id === e.id); if (i >= 0) mine[i] = e; else mine.push(e); }
  saveCustom(mine);
}

export function blankCustom(author: string): CustomEvent {
  return { id: Math.random().toString(36).slice(2, 9), icon: '😈', text: '', minAge: 18, maxAge: 99, rating: 2, weight: 25, author,
    choices: [0, 1, 2].map(() => ({ label: '', text: '', happy: 0, health: 0, smarts: 0, looks: 0, money: 0, karma: 0 })) };
}
