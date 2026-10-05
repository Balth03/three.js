// Free actions (tabs): data-driven activities with yearly limits.
import type { ActionDef, Content, Life, Loc, Resolution, Tab } from './types.ts';
import { checkCond } from './cond.ts';
import { L, rngOf } from './util.ts';
import { country, toLocal } from './text.ts';
import { queueEvent, resolveOutcomes } from './events.ts';

export interface ActionView { def: ActionDef; ok: boolean; reason?: Loc<string>; used: number }

export function listActions(life: Life, content: Content, tab?: Tab): ActionView[] {
  const c = country(content, life.country);
  return content.actions
    .filter((a) => (!tab || a.tab === tab) && (a.rating ?? 0) <= life.rating && checkCond(life, content, a.when))
    .filter((a) => { const w = a.where ?? (a.tab === 'prison' ? 'prison' : 'free'); return w === 'any' || (w === 'prison') === !!life.prison; })
    .map((a) => {
      const used = life.used[a.id] ?? 0;
      let reason: Loc<string> | undefined;
      if (!life.alive) reason = L('…', '…');
      else if (life.queue.length) reason = L("Termine d'abord l'événement en cours.", 'Finish the current event first.');
      else if (a.limit !== undefined && used >= a.limit) reason = L('Plus possible cette année.', 'Not possible again this year.');
      else if (a.cost && life.money < toLocal(a.cost, c)) reason = L("Pas assez d'argent.", 'Not enough money.');
      return { def: a, ok: !reason, reason, used };
    });
}

export function doAction(life: Life, content: Content, id: string): Resolution | null {
  const v = listActions(life, content).find((x) => x.def.id === id);
  if (!v || !v.ok) return null;
  const a = v.def;
  life.used[a.id] = v.used + 1;
  if (a.cost) life.money -= Math.round(toLocal(a.cost, country(content, life.country)));
  if (a.event) {
    queueEvent(life, content, a.event, rngOf(life), undefined, true);
    return { text: { fr: '', en: '' }, icon: a.icon, tone: 'neutral', deltas: [], scene: a.scene };
  }
  if (a.open) return { text: { fr: '', en: '' }, icon: a.icon, tone: 'neutral', deltas: [], open: a.open };
  const res = resolveOutcomes(life, content, a.out ?? [], undefined, a.icon);
  res.scene = a.scene;
  return res;
}
