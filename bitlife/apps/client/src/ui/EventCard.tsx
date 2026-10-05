import { life, rev, result, lang, settings, duo } from '../state.ts';
import { pickChoice, continueAfterResult } from '../game.ts';
import { VoteHint } from './Duo.tsx';
import { npcById, country, formatMoney } from '@bl/sim';
import { content } from '@bl/data';
import { t } from '../i18n.ts';
import { Deltas, Portrait, STAT_META, npcLabel } from './common.tsx';
import { sfx } from '../audio.ts';

export function EventCard() {
  const l = life.value;
  void rev.value;
  if (!l) return null;
  const lg = lang.value;
  const res = result.value;
  const p = l.queue[0];
  if (!res && !p) return null;
  const actor = npcById(l, res ? res.actorId : p?.actorId);
  const icon = res ? res.icon : p!.icon;
  const tone = res ? res.tone : 'neutral';
  const c = country(content, l.country);
  return (
    <div class="card-back">
      <div class={`event-card glass ${res ? 'result' : ''} tone-${tone} ${res?.visual?.includes('gore') ? 'gory' : ''} ${res?.visual?.includes('poop') ? 'poopy' : ''}`} key={res ? `r${l.log.length}` : `e${p!.key}${l.queue.length}`}>
        <div class="ev-badge">
          {actor ? <Portrait l={l} npc={actor} size={92} mood={res?.mood} cls="ev-portrait" /> : <span class="ev-emoji">{icon}</span>}
          {actor && <span class="ev-mini">{icon}</span>}
        </div>
        {actor && <div class="ev-actor">{actor.first} {actor.last} · <small>{npcLabel(actor, l)}</small></div>}
        <p class="ev-text" aria-live="polite">{res ? res.text[lg] : p!.text[lg]}</p>
        {res && <Deltas deltas={res.deltas} l={l} />}
        {!res && !!p?.choices.length && <VoteHint />}
        <div class="ev-choices">
          {res ? (
            <button class="btn primary big" onClick={() => { sfx.click(); continueAfterResult(); }} autoFocus><kbd>␣</kbd>{t('next')}</button>
          ) : p!.choices.length ? (
            p!.choices.map((ch, i) => (
              <button key={i} class={`btn choice ${duo.value.myVote === i ? 'voted' : ''}`} onClick={() => pickChoice(i)} onMouseEnter={() => sfx.hover()}>
                <kbd>{i + 1}</kbd>
                <span class="ch-label">{ch.label[lg]}</span>
                {settings.value.previews && (
                  <span class="ch-prev">
                    {ch.risky ? <span class="risky" title={t('risky')}>🎲</span> : Object.entries(ch.preview).map(([k, v]) => (
                      <span key={k} class={`pv ${(v as number) > 0 ? 'up' : 'down'}`}>
                        {STAT_META[k]?.icon}{k === 'money' ? formatMoney(v as number, c, lg) : ((v as number) > 0 ? '▲' : '▼')}
                      </span>
                    ))}
                  </span>
                )}
              </button>
            ))
          ) : (
            <button class="btn primary big" onClick={() => pickChoice(0)} autoFocus><kbd>␣</kbd>{t('ok')}</button>
          )}
        </div>
      </div>
    </div>
  );
}
