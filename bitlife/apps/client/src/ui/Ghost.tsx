// Ghost mode panel: haunt the living for a few years after death.
import { content } from '@bl/data';
import { GHOST_ACTIONS, GHOST_YEARS, hauntable, ghostActionsLeft, ghostYears, npcAge, roleTitle, type Life } from '@bl/sim';
import { lang, rev, modal } from '../state.ts';
import { ghostHaunt, ghostNext, ghostAscend } from '../game.ts';
import { Sheet, Btn, Portrait } from './common.tsx';

export function GhostPanel({ l }: { l: Life }) {
  void rev.value;
  const lg = lang.value;
  const T = (fr: string, en: string) => (lg === 'fr' ? fr : en);
  const left = ghostActionsLeft(l);
  const people = hauntable(l).sort((a, b) => a.rel - b.rel);
  void content;
  return (
    <Sheet title={T('Mode fantôme', 'Ghost mode')} icon="👻" onClose={() => { modal.value = null; }} cls="ghost">
      <p class="muted">{T(`Année de fantôme ${ghostYears(l) + 1}/${GHOST_YEARS} · ${left} hantise(s) restante(s) cette année. Espace = année suivante.`, `Ghost year ${ghostYears(l) + 1}/${GHOST_YEARS} · ${left} haunting(s) left this year. Space = next year.`)}</p>
      <div class="ghost-list">
        {people.map((n) => (
          <div class="ghost-row" key={n.id}>
            <Portrait l={l} npc={n} size={52} />
            <div class="gr-txt"><b>{n.first} {n.last}</b><small>{roleTitle(n.role, n.gender, lg)} · {npcAge(n, l.year)} {T('ans', 'y/o')} · {n.rel < 35 ? '😠' : n.rel > 70 ? '🥰' : '😐'}</small></div>
            <div class="gr-acts">
              {GHOST_ACTIONS.filter((a) => a.rating <= l.rating).map((a) => (
                <button key={a.kind} class="btn small" disabled={left <= 0} title={a.label[lg]} onClick={() => ghostHaunt(n.id, a.kind)}>{a.icon}</button>
              ))}
            </div>
          </div>
        ))}
        {!people.length && <p class="center">{T('Plus personne à hanter. Quelle solitude.', 'Nobody left to haunt. So lonely.')}</p>}
      </div>
      <div class="row-btns">
        <Btn cls="primary" onClick={ghostNext}>🕯️ {T('Année suivante', 'Next year')}</Btn>
        <Btn onClick={ghostAscend}>☁️ {T('Passer dans l\'au-delà', 'Move on')}</Btn>
      </div>
    </Sheet>
  );
}
