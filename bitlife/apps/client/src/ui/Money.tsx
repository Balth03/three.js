import { useMemo, useState } from 'preact/hooks';
import {
  assetOffers, canAfford, maxLoan, debt,
  portfolioValue, netWorth, toLocal, country,
  type Life, type AssetDef, type Financing,
} from '@bl/sim';
import { content } from '@bl/data';
import { modal, lang, rev, bump } from '../state.ts';
import { dispatch } from '../game.ts';
import { Sheet, Btn, money } from './common.tsx';
import { sfx } from '../audio.ts';
import { t } from '../i18n.ts';

const close = () => { sfx.close(); modal.value = null; };
const T = (fr: string, en: string) => (lang.value === 'fr' ? fr : en);

export function AssetShop({ l, kinds, title, icon }: { l: Life; kinds: AssetDef['kind'][]; title: string; icon: string }) {
  void rev.value;
  const offers = useMemo(() => kinds.flatMap((k) => assetOffers(l, content, k)), [l.age, kinds.join()]);
  const lg = lang.value;
  return (
    <Sheet title={title} icon={icon} onClose={close} cls="wide">
      <div class="kv big"><span>{t('money_total')}</span><b class={l.money < 0 ? 'neg' : ''}>{money(l, l.money)}</b></div>
      <div class="list">
        {offers.map((o) => {
          const cash = canAfford(l, content, o, 'cash');
          const mort = o.def.kind === 'house' ? canAfford(l, content, o, 'mortgage') : T('—', '—');
          const owned = l.assets.some((a) => a.def === o.def.id) && o.def.kind !== 'house';
          return (
            <div class={`list-row ${cash && mort ? 'off' : ''}`} key={o.key}>
              <span class="lr-icon">{o.def.icon}</span>
              <div class="lr-main">
                <div class="lr-title">{o.def.kind === 'house' ? o.name.replace(o.def.name.fr, o.def.name[lg]) : o.def.name[lg]}</div>
                <div class="lr-sub">{money(l, o.price)} · {T('état', 'condition')} {o.condition}% · 😊 +{o.def.happy}{owned ? ` · ${T('déjà possédé', 'owned')}` : ''}</div>
              </div>
              <Btn cls="small primary" disabled={!!cash} title={typeof cash === 'object' ? cash[lg] : ''} onClick={() => dispatch({ k: 'buy', kind: o.def.kind, key: o.key, fin: 'cash' })}>💵 {T('Comptant', 'Cash')}</Btn>
              {o.def.kind === 'house' && <Btn cls="small" disabled={!!mort} title={typeof mort === 'object' ? (mort as { fr: string; en: string })[lg] : ''} onClick={() => dispatch({ k: 'buy', kind: o.def.kind, key: o.key, fin: 'mortgage' as Financing })}>🏦 {T('Crédit', 'Mortgage')}</Btn>}
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}

export function OwnedAssets({ l }: { l: Life }) {
  void rev.value;
  const lg = lang.value;
  if (!l.assets.length) return <p class="muted small">{T('Tu ne possèdes rien. Même pas un grille-pain.', 'You own nothing. Not even a toaster.')}</p>;
  return (
    <div class="list">
      {l.assets.map((a) => {
        const def = content.assets.find((d) => d.id === a.def);
        if (!def) return null;
        const home = l.flags.home === a.uid;
        return (
          <div class="list-row" key={a.uid}>
            <span class="lr-icon">{def.icon}</span>
            <div class="lr-main">
              <div class="lr-title">{def.kind === 'house' ? a.name.replace(def.name.fr, def.name[lg]) : def.name[lg]} {home && <span class="tag">🏠 {T('Domicile', 'Home')}</span>} {a.rented && <span class="tag">🔑 {T('Loué', 'Rented')}</span>}</div>
              <div class="lr-sub">{money(l, a.value)}{a.loan ? ` · ${T('crédit', 'loan')} ${money(l, a.loan)}` : ''} · {T('état', 'cond.')} {Math.round(a.condition)}%</div>
            </div>
            {def.kind === 'house' && !home && <Btn cls="small" onClick={() => { dispatch({ k: 'movein', uid: a.uid }); sfx.click(); }}>🛏️</Btn>}
            {def.kind === 'house' && <Btn cls="small" title={T('Louer', 'Rent out')} onClick={() => { dispatch({ k: 'rent', uid: a.uid }); sfx.click(); }}>🔑</Btn>}
            {(def.kind === 'house' || def.kind === 'car') && <Btn cls="small" title={T('Rénover / réparer', 'Renovate / repair')} disabled={!!l.used[`reno:${a.uid}`] || l.money < a.value * 0.08} onClick={() => dispatch({ k: 'reno', uid: a.uid })}>🛠️</Btn>}
            <Btn cls="small ghost" title={T('Vendre', 'Sell')} onClick={() => dispatch({ k: 'sell', uid: a.uid })}>💰</Btn>
          </div>
        );
      })}
    </div>
  );
}

export function Stocks({ l }: { l: Life }) {
  void rev.value;
  const c = country(content, l.country);
  const lg = lang.value;
  const [pct, setPct] = useState(0.25);
  return (
    <Sheet title={T('Bourse & crypto', 'Stocks & crypto')} icon="📈" onClose={close} cls="wide">
      <div class="kv big"><span>{t('money_total')}</span><b>{money(l, l.money)}</b></div>
      <div class="kv"><span>{T('Portefeuille', 'Portfolio')}</span><b>{money(l, portfolioValue(l, content))}</b></div>
      <div class="setting"><span>{T('Montant par achat', 'Amount per buy')}</span>
        <div class="seg">{[0.1, 0.25, 0.5, 1].map((p) => <button key={p} class={pct === p ? 'on' : ''} onClick={() => setPct(p)}>{Math.round(p * 100)}%</button>)}</div>
      </div>
      <div class="list">
        {content.stocks.map((s) => {
          const price = toLocal(l.market[s.id] ?? s.price, c);
          const prev = Number(l.flags[`prev:${s.id}`] ?? l.market[s.id] ?? s.price);
          const ch = prev ? ((l.market[s.id] ?? s.price) / prev - 1) * 100 : 0;
          const held = l.portfolio[s.id] ?? 0;
          return (
            <div class="list-row" key={s.id}>
              <span class="lr-icon">{s.icon}</span>
              <div class="lr-main">
                <div class="lr-title">{s.name} <span class="tag">{s.kind === 'crypto' ? 'crypto' : s.id}</span></div>
                <div class="lr-sub">{price < 1 ? price.toFixed(4) : money(l, price)} <b class={ch >= 0 ? 'up-t' : 'down-t'}>{ch >= 0 ? '▲' : '▼'} {Math.abs(ch).toFixed(1)}%</b>{held ? ` · ${T('détenu', 'held')} : ${money(l, held * price)}` : ''}</div>
              </div>
              <Btn cls="small primary" disabled={l.money <= 0 || l.age < 18} onClick={() => dispatch({ k: 'stockBuy', id: s.id, amount: Math.floor(l.money * pct) })}>{T('Acheter', 'Buy')}</Btn>
              {held > 0 && <Btn cls="small" onClick={() => dispatch({ k: 'stockSell', id: s.id })}>{T('Vendre', 'Sell')}</Btn>}
            </div>
          );
        })}
      </div>
      <p class="muted small">{lg === 'fr' ? 'Les cours bougent à chaque anniversaire. Les cryptos peuvent faire x6… ou /12.' : 'Prices move on every birthday. Crypto can go x6… or /12.'}</p>
    </Sheet>
  );
}

export function Bank({ l }: { l: Life }) {
  void rev.value;
  const max = maxLoan(l);
  const owed = debt(l);
  return (
    <Sheet title={T('Banque', 'Bank')} icon="🏦" onClose={close}>
      <div class="kv big"><span>{T('Patrimoine net', 'Net worth')}</span><b class={netWorth(l, content) < 0 ? 'neg' : ''}>{money(l, netWorth(l, content))}</b></div>
      <div class="kv"><span>{t('money_total')}</span><b>{money(l, l.money)}</b></div>
      <div class="kv"><span>{T('Dettes', 'Debts')}</span><b class="neg">{money(l, -owed)}</b></div>
      {l.loans.map((ln, i) => <div class="kv" key={i}><span>{ln.kind === 'mortgage' ? '🏠' : '💳'} {(ln.rate * 100).toFixed(1)}% · {ln.years} {t('years')}</span><b>{money(l, ln.amount)}</b></div>)}
      <div class="row-btns">
        <Btn cls="primary" disabled={!max || !!l.used.loan} onClick={() => dispatch({ k: 'loan', amount: max })}>💳 {T('Emprunter', 'Borrow')} {money(l, max)}</Btn>
        <Btn disabled={!owed || l.money < owed} onClick={() => dispatch({ k: 'repay' })}>✅ {T('Tout rembourser', 'Repay everything')}</Btn>
      </div>
      {!max && <p class="muted small">{T('Pas de revenu, pas de prêt. Le banquier rigole déjà.', 'No income, no loan. The banker is already laughing.')}</p>}
    </Sheet>
  );
}

export function BusinessSheet({ l }: { l: Life }) {
  void rev.value;
  const lg = lang.value;
  const c = country(content, l.country);
  const [name, setName] = useState('');
  const b = l.business;
  const sec = b && content.sectors.find((s) => s.id === b.sector);
  return (
    <Sheet title={T('Mon entreprise', 'My business')} icon="🏢" onClose={close} cls="wide">
      {b && sec ? (
        <div>
          <div class="card info-card">
            <div class="card-title">{sec.icon} {b.name}</div>
            <div class="kv"><span>{T('Secteur', 'Sector')}</span><b>{sec.name[lg]}</b></div>
            <div class="kv"><span>{T('Valeur', 'Value')}</span><b>{money(l, b.value)}</b></div>
            <div class="kv"><span>{T('Chiffre d\'affaires', 'Revenue')}</span><b>{money(l, b.revenue)}{t('per_year')}</b></div>
            <div class="kv"><span>{T('Employés', 'Employees')}</span><b>{b.employees}</b></div>
            <div class="kv"><span>{T('Réputation', 'Reputation')}</span><b>{Math.round(b.reputation)}%</b></div>
            <div class="kv"><span>{T('Ancienneté', 'Age')}</span><b>{b.years} {t('years')}</b></div>
          </div>
          <div class="action-grid">
            {([['hire', '🧑‍💼', T('Embaucher', 'Hire staff'), 0.12], ['marketing', '📣', T('Campagne marketing', 'Marketing campaign'), 0.08], ['expand', '🏗️', T('S\'agrandir', 'Expand'), 0.4]] as const).map(([k, ic, lab, f]) => (
              <button key={k} class="action" disabled={!!l.used[`biz:${k}`] || l.money < b.value * f} onClick={() => dispatch({ k: 'bizInvest', kind: k })}>
                <span class="a-icon">{ic}</span><span class="a-text"><span class="a-label">{lab}</span><span class="a-desc">{money(l, b.value * f)}</span></span>
              </button>
            ))}
            <button class="action" onClick={() => dispatch({ k: 'bizSell' })}><span class="a-icon">🤝</span><span class="a-text"><span class="a-label">{T('Revendre', 'Sell')}</span><span class="a-desc">~{money(l, b.value * (0.8 + b.reputation / 200))}</span></span></button>
          </div>
        </div>
      ) : (
        <div>
          <label class="field"><span>{T('Nom de la boîte', 'Company name')}</span><input value={name} placeholder={`${l.last} & Fils`} onInput={(e) => setName((e.target as HTMLInputElement).value)} maxLength={28} /></label>
          <div class="list">
            {content.sectors.map((s) => {
              const cost = toLocal(s.cost, c);
              return (
                <div class={`list-row ${l.money < cost ? 'off' : ''}`} key={s.id}>
                  <span class="lr-icon">{s.icon}</span>
                  <div class="lr-main"><div class="lr-title">{s.name[lg]}</div><div class="lr-sub">{money(l, cost)} · {T('risque', 'risk')} {'🔥'.repeat(Math.max(1, Math.round(s.risk * 3)))}</div></div>
                  <Btn cls="small primary" disabled={l.money < cost || l.age < 18 || !!l.prison} onClick={() => dispatch({ k: 'bizStart', sector: s.id, name: name.trim() })}>{T('Fonder', 'Found')}</Btn>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Sheet>
  );
}
