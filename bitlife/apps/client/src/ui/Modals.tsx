import { useState, useMemo } from 'preact/hooks';
import { listJobs, careerTitle, tuitionCost, tuitionOptions, relActionsFor, datingCandidates, npcAge, gradeLetter, type Life, type TuitionPlan } from '@bl/sim';
import { content } from '@bl/data';
import { life, rev, modal, lang, settings, screen, bump, showToast } from '../state.ts';
import { apply, enroll, date, runRelAction, loadExisting, getStage } from '../game.ts';
import { t, tl } from '../i18n.ts';
import { Sheet, Portrait, Bar, money, npcLabel, STAT_META, Btn } from './common.tsx';
import { saveLife, loadLife, slotInfo, deleteSlot, SLOTS, exportLife, importLife, storeSettings, type Settings } from '../save.ts';
import { setVolumes, sfx } from '../audio.ts';
import { AssetShop, Stocks, Bank, BusinessSheet } from './Money.tsx';
import { CrimeSheet } from './Crime.tsx';
import { Achievements, Graveyard, FamilyTree, GodPanel } from './Meta.tsx';
import { Minigame } from './Minigames.tsx';
import { DuoLobby } from './Duo.tsx';

const close = () => { sfx.close(); modal.value = null; };

function Jobs({ l }: { l: Life }) {
  const lg = lang.value;
  const offers = useMemo(() => listJobs(l, content), [l.age, rev.value]);
  return (
    <Sheet title={t('jobs_title')} icon="📋" onClose={close} cls="wide">
      <div class="list">
        {offers.map((o) => {
          const def = content.careers.find((c) => c.id === o.careerId)!;
          return (
            <div class={`list-row ${o.qualified ? '' : 'off'}`} key={o.careerId}>
              <span class="lr-icon">{def.icon}</span>
              <div class="lr-main">
                <div class="lr-title">{careerTitle(content, def.id, 0, l.gender, lg)} {def.partTime && <span class="tag">{lg === 'fr' ? 'Temps partiel' : 'Part-time'}</span>}</div>
                <div class="lr-sub">{o.employer} · {money(l, o.salary)}{t('per_year')}{o.reason ? <span class="warn"> · {o.reason[lg]}</span> : null}</div>
              </div>
              <Btn cls="small" disabled={!o.qualified || o.applied || l.job?.careerId === o.careerId} onClick={() => apply(o)}>{o.applied ? t('applied') : t('apply')}</Btn>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}

function University({ l, grad }: { l: Life; grad: boolean }) {
  void rev.value;
  const lg = lang.value;
  const [sel, setSel] = useState<string | null>(null);
  const items = grad
    ? content.grads.filter((g) => !g.majors || g.majors.some((m) => l.edu.degrees.includes(`uni:${m}`))).map((g) => ({ id: g.id, icon: g.icon, name: g.name[lg], years: g.years, smarts: g.smarts, mult: g.cost }))
    : content.majors.map((m) => ({ id: m.id, icon: m.icon, name: m.name[lg], years: m.years, smarts: m.smarts, mult: 1 }));
  const chosen = items.find((i) => i.id === sel);
  const cost = chosen ? tuitionCost(l, content, chosen.mult) : 0;
  const opts = chosen ? tuitionOptions(l, content, cost, chosen.smarts) : [];
  const label: Record<TuitionPlan, string> = { scholarship: t('pay_scholarship'), parents: t('pay_parents'), loan: t('pay_loan'), self: t('pay_self') };
  const used = (l.used[grad ? 'grad_apply' : 'uni_apply'] ?? 0) >= 2;
  return (
    <Sheet title={grad ? t('grad_title') : t('uni_title')} icon="🎓" onClose={close} cls="wide">
      {!chosen ? (
        <>
          <p class="muted">{t('choose_major')} · {t('grades')} : <b>{gradeLetter(l.edu.grade)}</b></p>
          <div class="major-grid">
            {items.map((m) => (
              <button key={m.id} class="major" onClick={() => { sfx.click(); setSel(m.id); }}>
                <span class="m-icon">{m.icon}</span>
                <span class="m-name">{m.name}</span>
                <span class="m-sub">{m.years} {t('years')} · 🧠 {m.smarts}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <div class="kv big"><span>{chosen.icon} {chosen.name}</span><b>{money(l, cost)}{t('per_year')}</b></div>
          <p class="muted">{t('how_pay')}</p>
          <div class="pay-grid">
            {opts.map((o) => (
              <Btn key={o.plan} cls={o.ok ? 'primary' : ''} disabled={!o.ok || used} title={o.ok ? '' : o.reason?.[lg]} onClick={() => enroll(chosen.id, o.plan, grad)}>
                {label[o.plan]}{!o.ok && <small class="warn"> — {o.reason?.[lg]}</small>}
              </Btn>
            ))}
          </div>
          {used && <p class="warn">{lg === 'fr' ? 'Assez de candidatures pour cette année.' : 'Enough applications this year.'}</p>}
          <Btn cls="ghost" onClick={() => setSel(null)}>← {t('back')}</Btn>
        </div>
      )}
    </Sheet>
  );
}

function Dating({ l }: { l: Life }) {
  void rev.value;
  const people = useMemo(() => datingCandidates(l, content), [l.age]);
  const lg = lang.value;
  return (
    <Sheet title={t('dating_title')} icon="💘" onClose={close} cls="wide">
      <div class="date-grid">
        {people.filter((n) => n.flags.candidate !== undefined).map((n) => (
          <div class="date-card" key={n.id}>
            <Portrait l={l} npc={n} size={110} />
            <div class="dc-name">{n.first}</div>
            <div class="dc-sub">{npcAge(n, l.year)} {t('years')} · {n.job ? careerTitle(content, n.job, 1, n.gender, lg) : lg === 'fr' ? 'Étudiant' + (n.gender === 'f' ? 'e' : '') : 'Student'}</div>
            <div class="dc-stat">✨ <Bar value={n.looks} color={STAT_META.looks.color} small /></div>
            <div class="dc-stat">🧠 <Bar value={n.smarts} color={STAT_META.smarts.color} small /></div>
            <Btn cls="primary" onClick={() => date(n.id)}>💘 {t('ask_out')}</Btn>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

function NpcSheet({ l, id }: { l: Life; id: number }) {
  void rev.value;
  const n = l.npcs.find((x) => x.id === id);
  const lg = lang.value;
  if (!n) return null;
  const acts = relActionsFor(l, content, id);
  const trait = n.traits.map((tid) => content.traits.find((x) => x.id === tid)).filter(Boolean);
  return (
    <Sheet title={`${n.first} ${n.last}`} onClose={close}>
      <div class="npc-head">
        <Portrait l={l} npc={n} size={120} />
        <div>
          <div class="muted">{npcLabel(n, l)}{!n.alive && ` · ${t('deceased')} (${n.deathYear})`}</div>
          {n.job && n.alive && <div class="muted">💼 {careerTitle(content, n.job, 1, n.gender, lg)}</div>}
          <div class="chips">{trait.map((tr) => <span class="chip" key={tr!.id}>{tr!.icon} {tr!.name[lg]}</span>)}</div>
          {n.alive && <div class="kv"><span>💞 {t('rel')}</span><b>{Math.round(n.rel)}%</b></div>}
          {n.alive && <Bar value={n.rel} color="#FF7EB6" />}
        </div>
      </div>
      {n.alive && (
        <>
          <div class="group-title">{t('interactions')}</div>
          <div class="action-grid">
            {acts.map((a) => (
              <button key={a.def.id} class={`action ${a.ok ? '' : 'off'}`} disabled={!a.ok} title={a.reason?.[lg]} onClick={() => runRelAction(id, a.def.id)} onMouseEnter={() => a.ok && sfx.hover()}>
                <span class="a-icon">{a.def.icon}</span>
                <span class="a-text"><span class="a-label">{a.def.label[lg] as string}</span>{a.reason && <span class="a-desc warn">{a.reason[lg]}</span>}{a.def.cost ? <span class="a-desc">{money(l, a.def.cost * content.countries.find((c) => c.id === l.country)!.price * content.countries.find((c) => c.id === l.country)!.currency.rate)}</span> : null}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </Sheet>
  );
}

function Profile({ l }: { l: Life }) {
  void rev.value;
  const lg = lang.value;
  const talent = content.talents.find((x) => x.id === l.talent);
  return (
    <Sheet title={t('profile')} icon="🪪" onClose={close}>
      <div class="npc-head">
        <Portrait l={l} size={120} />
        <div>
          <div class="chips">{l.traits.map((id) => { const tr = content.traits.find((x) => x.id === id); return tr ? <span class="chip" title={tr.desc[lg]} key={id}>{tr.icon} {tr.name[lg]}</span> : null; })}</div>
          <div class="kv"><span>{t('talent')}</span><b>{l.talentKnown && talent ? `${talent.icon} ${talent.name[lg]}` : `❔ ${t('unknown')}`}</b></div>
        </div>
      </div>
      {(['karma', 'athletic', 'discipline', 'fame'] as const).map((k) => (
        <div class="stat-row" key={k}><span class="stat-icon">{STAT_META[k].icon}</span><span class="stat-name">{t(STAT_META[k].key)}</span><Bar value={l.attrs[k]} color={STAT_META[k].color} /><span class="stat-val">{Math.round(l.attrs[k])}%</span></div>
      ))}
      <div class="group-title">{t('conditions')}</div>
      <div class="chips">
        {l.conditions.length ? l.conditions.map((c) => { const d = content.diseases.find((x) => x.id === c.id); return d ? <span class="chip bad" key={c.id}>{d.icon} {d.name[lg]}</span> : null; }) : <span class="chip good">💚 {t('healthy')}</span>}
      </div>
    </Sheet>
  );
}

function Saves() {
  const l = life.value;
  const [, force] = useState(0);
  return (
    <Sheet title={t('saves')} icon="💾" onClose={close}>
      <div class="list">
        {SLOTS.map((s) => {
          const info = slotInfo(s);
          return (
            <div class="list-row" key={s}>
              <span class="lr-icon">{info ? (info.alive ? '🧬' : '🪦') : '➕'}</span>
              <div class="lr-main">
                <div class="lr-title">{info ? `${info.name}, ${info.age} ${t('years')}` : t('empty_slot')}</div>
                {info && <div class="lr-sub">{new Date(info.savedAt).toLocaleString(lang.value === 'fr' ? 'fr-FR' : 'en-US')}</div>}
              </div>
              {l && screen.value === 'game' && <Btn cls="small" onClick={() => { saveLife(l, s); showToast(t('saved')); force((x) => x + 1); }}>{t('save')}</Btn>}
              {info && <Btn cls="small primary" onClick={() => { const x = loadLife(s); if (x) { modal.value = null; loadExisting(x); } }}>{t('load')}</Btn>}
              {info && <Btn cls="small ghost" onClick={() => { deleteSlot(s); force((x) => x + 1); }}>🗑️</Btn>}
            </div>
          );
        })}
      </div>
      <div class="row-btns">
        {l && <Btn onClick={() => exportLife(l)}>⬇️ {t('export')}</Btn>}
        <label class="btn">⬆️ {t('import')}<input type="file" accept="application/json" hidden onChange={async (e) => {
          const f = (e.target as HTMLInputElement).files?.[0];
          if (!f) return;
          try { const x = await importLife(f); modal.value = null; loadExisting(x); } catch (err) { showToast(String(err)); }
        }} /></label>
      </div>
    </Sheet>
  );
}

export function SettingsSheet() {
  const s = settings.value;
  const set = (patch: Partial<Settings>) => {
    const n = { ...s, ...patch };
    settings.value = n;
    storeSettings(n);
    lang.value = n.lang;
    setVolumes(n.music, n.sfx);
    applyDomSettings(n);
    const st = getStage();
    if (st && patch.quality) st.setQuality(n.quality);
    if (st) st.reducedMotion = n.reducedMotion;
    bump();
  };
  const seg = <T extends string>(val: T, opts: [T, string][], on: (v: T) => void) => (
    <div class="seg">{opts.map(([v, label]) => <button key={v} class={val === v ? 'on' : ''} onClick={() => { sfx.click(); on(v); }}>{label}</button>)}</div>
  );
  return (
    <Sheet title={t('settings')} icon="⚙️" onClose={close}>
      <div class="setting"><span>{t('language')}</span>{seg(s.lang, [['fr', 'Français'], ['en', 'English']], (v) => set({ lang: v }))}</div>
      <div class="setting"><span>{lang.value === 'fr' ? 'Contenu' : 'Content'}</span>{seg(String(s.rating) as '0' | '1' | '2', [['0', lang.value === 'fr' ? 'Tout public' : 'Family'], ['1', lang.value === 'fr' ? 'Adulte' : 'Adult'], ['2', '🔥 Trash']], (v) => { set({ rating: +v as 0 | 1 | 2, family: v === '0' }); const l = life.value; if (l) l.rating = +v as 0 | 1 | 2; })}</div>
      <div class="setting"><span>{t('quality')}</span>{seg(s.quality, [['low', t('q_low')], ['medium', t('q_medium')], ['high', t('q_high')]], (v) => set({ quality: v }))}</div>
      <div class="setting"><span>{t('music')}</span><input type="range" min="0" max="1" step="0.05" value={s.music} onInput={(e) => set({ music: +(e.target as HTMLInputElement).value })} /></div>
      <div class="setting"><span>{t('sfx')}</span><input type="range" min="0" max="1" step="0.05" value={s.sfx} onInput={(e) => set({ sfx: +(e.target as HTMLInputElement).value })} /></div>
      <div class="setting"><span>{t('text_size')}</span>{seg(String(s.textScale), [['0.9', 'A−'], ['1', 'A'], ['1.15', 'A+'], ['1.3', 'A++']], (v) => set({ textScale: +v }))}</div>
      {([['reducedMotion', 'reduced_motion'], ['previews', 'previews'], ['dyslexic', 'dyslexic'], ['contrast', 'high_contrast']] as const).map(([k, key]) => (
        <label class="setting" key={k}><span>{t(key)}</span><input type="checkbox" checked={s[k]} onChange={(e) => set({ [k]: (e.target as HTMLInputElement).checked } as Partial<Settings>)} /></label>
      ))}
      <p class="muted small">{t('controls')}</p>
    </Sheet>
  );
}

export function applyDomSettings(s: Settings) {
  const r = document.documentElement;
  r.style.setProperty('--text-scale', String(s.textScale));
  r.classList.toggle('dyslexic', s.dyslexic);
  r.classList.toggle('contrast', s.contrast);
  r.classList.toggle('reduced', s.reducedMotion);
  r.lang = s.lang;
}

function Menu() {
  return (
    <Sheet title="BitLife Online" icon="🧬" onClose={close}>
      <div class="menu-col">
        <Btn cls="primary big" onClick={close}>▶ {t('resume')}</Btn>
        <Btn cls="big" onClick={() => { modal.value = { kind: 'saves' }; }}>💾 {t('saves')}</Btn>
        <Btn cls="big" onClick={() => { modal.value = { kind: 'settings' }; }}>⚙️ {t('settings')}</Btn>
        <Btn cls="big" onClick={() => { modal.value = { kind: 'achievements' }; }}>🏆 {lang.value === 'fr' ? 'Succès' : 'Achievements'}</Btn>
        <Btn cls="big" onClick={() => { modal.value = { kind: 'tree' }; }}>🌳 {lang.value === 'fr' ? 'Arbre généalogique' : 'Family tree'}</Btn>
        {life.value?.mode === 'god' && <Btn cls="big" onClick={() => { modal.value = { kind: 'god' }; }}>⚡ {lang.value === 'fr' ? 'Mode Dieu' : 'God mode'}</Btn>}
        <Btn cls="big ghost" onClick={() => { modal.value = null; screen.value = 'title'; }}>🏠 {t('main_menu')}</Btn>
      </div>
      <p class="muted small">{t('controls')}</p>
    </Sheet>
  );
}

export function Modals() {
  const m = modal.value;
  const l = life.value;
  void rev.value;
  if (!m) return null;
  switch (m.kind) {
    case 'jobs': return l ? <Jobs l={l} /> : null;
    case 'university': return l ? <University l={l} grad={false} /> : null;
    case 'grad': return l ? <University l={l} grad /> : null;
    case 'dating': return l ? <Dating l={l} /> : null;
    case 'duo': return <DuoLobby />;
    case 'npc': return l ? <NpcSheet l={l} id={m.id} /> : null;
    case 'profile': return l ? <Profile l={l} /> : null;
    case 'saves': return <Saves />;
    case 'settings': return <SettingsSheet />;
    case 'menu': return <Menu />;
    case 'crime': return l ? <CrimeSheet l={l} /> : null;
    case 'realestate': return l ? <AssetShop l={l} kinds={['house']} title={lang.value === 'fr' ? 'Agence immobilière' : 'Real estate'} icon="🏠" /> : null;
    case 'cars': return l ? <AssetShop l={l} kinds={['car', 'boat', 'aircraft']} title={lang.value === 'fr' ? 'Véhicules' : 'Vehicles'} icon="🚗" /> : null;
    case 'shop': return l ? <AssetShop l={l} kinds={['luxury']} title={lang.value === 'fr' ? 'Boutique de luxe' : 'Luxury shop'} icon="💎" /> : null;
    case 'stocks': return l ? <Stocks l={l} /> : null;
    case 'bank': return l ? <Bank l={l} /> : null;
    case 'business': return l ? <BusinessSheet l={l} /> : null;
    case 'achievements': return <Achievements />;
    case 'graveyard': return <Graveyard />;
    case 'tree': return l ? <FamilyTree l={l} /> : null;
    case 'god': return l ? <GodPanel l={l} /> : null;
    case 'minigame': return l ? <Minigame game={m.game} title={m.title} onDone={m.onDone} l={l} /> : null;
  }
  return null;
}

export { tl };
