import { listCrimes, renderString, listActions, type Life } from '@bl/sim';
import { content } from '@bl/data';
import { modal, lang, rev } from '../state.ts';
import { doCrime, runAction } from '../game.ts';
import { Sheet, Bar } from './common.tsx';
import { sfx } from '../audio.ts';

const close = () => { sfx.close(); modal.value = null; };
const T = (fr: string, en: string) => (lang.value === 'fr' ? fr : en);

export function CrimeSheet({ l }: { l: Life }) {
  void rev.value;
  const lg = lang.value;
  const views = listCrimes(l, content);
  const tiers = [1, 2, 3, 4, 5];
  const names = { 1: T('Petite délinquance', 'Petty crime'), 2: T('Délits', 'Misdemeanors'), 3: T('Crimes', 'Felonies'), 4: T('Grand banditisme', 'Organised crime'), 5: T('Légendaire', 'Legendary') } as Record<number, string>;
  return (
    <Sheet title={T('Crimes', 'Crime')} icon="🦹" onClose={close} cls="wide">
      <div class="kv"><span>🚨 {T('Attention de la police', 'Police heat')}</span><b>{Math.round(l.heat)}%</b></div>
      <Bar value={l.heat} color="#EF476F" small />
      {l.record.length > 0 && <p class="muted small">📁 {T('Casier', 'Record')} : {l.record.length} {T('condamnation(s)', 'conviction(s)')}</p>}
      {tiers.map((tier) => {
        const v = views.filter((x) => x.def.tier === tier);
        if (!v.length) return null;
        return (
          <div key={tier}>
            <div class="group-title">{'★'.repeat(tier)} {names[tier]}</div>
            <div class="action-grid">
              {v.map((x) => (
                <button key={x.def.id} class={`action ${x.ok ? '' : 'off'} ${x.def.violent ? 'violent' : ''}`} disabled={!x.ok} title={x.reason?.[lg] ?? ''} onClick={() => doCrime(x.def.id)} onMouseEnter={() => x.ok && sfx.hover()}>
                  <span class="a-icon">{x.def.icon}</span>
                  <span class="a-text">
                    <span class="a-label">{renderString(x.def.label[lg], { life: l, content }, lg)}</span>
                    <span class={`a-desc ${x.reason ? 'warn' : ''}`}>{x.reason ? x.reason[lg] : `${T('Réussite', 'Success')} ~${Math.round(x.chance * 100)}%${x.def.minigame ? ' · 🎮' : ''}${x.def.violent ? ' · 🩸' : ''}`}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </Sheet>
  );
}

export function PrisonPanel({ l }: { l: Life }) {
  void rev.value;
  const p = l.prison;
  if (!p) return null;
  const lg = lang.value;
  const acts = listActions(l, content, 'prison');
  return (
    <div>
      <div class="card info-card prison-card">
        <div class="card-title">🔒 {p.facility}</div>
        <div class="kv"><span>{T('Peine', 'Sentence')}</span><b>{p.served} / {p.years} {T('ans', 'yrs')}</b></div>
        <Bar value={(p.served / Math.max(1, p.years)) * 100} color="#8D99AE" small />
        <div class="kv"><span>💪 {T('Respect', 'Respect')}</span><b>{Math.round(p.respect)}%</b></div>
        <Bar value={p.respect} color="#F4A261" small />
        {l.flags.p_ganged !== undefined && <div class="chips"><span class="chip">🐍 {T('Membre d\'un gang', 'Gang member')}</span></div>}
      </div>
      <div class="action-grid">
        {acts.map((v) => (
          <button key={v.def.id} class={`action ${v.ok ? '' : 'off'}`} disabled={!v.ok} title={v.reason?.[lg] ?? ''} onClick={() => runAction(v.def.id)} onMouseEnter={() => v.ok && sfx.hover()}>
            <span class="a-icon">{v.def.icon}</span>
            <span class="a-text"><span class="a-label">{typeof v.def.label[lg] === 'string' ? (v.def.label[lg] as string) : (v.def.label[lg] as string[])[0]}</span>{v.reason && <span class="a-desc warn">{v.reason[lg]}</span>}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
