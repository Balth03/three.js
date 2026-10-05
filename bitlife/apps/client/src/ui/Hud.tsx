import { useEffect, useRef } from 'preact/hooks';
import { listActions, careerTitle, stageLabel, gradeLetter, living, npcAge, type Life, type Tab, type ActionView, type Npc, type Role } from '@bl/sim';
import { content } from '@bl/data';
import { life, rev, tab, modal, lang, result, ageBusy, showToast } from '../state.ts';
import { doAgeUp, runAction } from '../game.ts';
import { t, tl } from '../i18n.ts';
import { Bar, StatRow, Portrait, money, npcLabel } from './common.tsx';
import { PrisonPanel } from './Crime.tsx';
import { OwnedAssets } from './Money.tsx';
import { netWorth, portfolioValue, debt } from '@bl/sim';
import { sfx } from '../audio.ts';

export function TopBar({ l }: { l: Life }) {
  const c = content.countries.find((x) => x.id === l.country)!;
  const occupation = l.prison ? `🔒 ${lang.value === 'fr' ? 'Détenu' + (l.gender === 'f' ? 'e' : '') : 'Inmate'}` : l.job
    ? careerTitle(content, l.job.careerId, l.job.level, l.gender, lang.value)
    : l.edu.enrolled ? tl(stageLabel(content, l, l.edu.stage)) : l.alive ? (l.flags.pension ? t('pension') : l.age < 3 ? '👶' : t('no_job')) : t('dead_banner');
  return (
    <div class="topbar glass" onClick={() => { sfx.open(); modal.value = { kind: 'profile' }; }}>
      <Portrait l={l} size={64} cls="me" />
      <div class="who">
        <div class="name">{l.first} {l.last} <span class="flag">{c.flag}</span></div>
        <div class="sub">{l.age} {t('years_old')} · {occupation}</div>
      </div>
      <div class={`cash ${l.money < 0 ? 'neg' : ''}`}>
        <div class="cash-label">{t('money_total')}</div>
        <div class="cash-val">{money(l, l.money)}</div>
      </div>
    </div>
  );
}

export function Feed({ l }: { l: Life }) {
  const ref = useRef<HTMLDivElement>(null);
  void rev.value;
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [l.log.length, l.log[l.log.length - 1]?.lines.length, l.id]);
  const lg = lang.value;
  return (
    <div class="feed" ref={ref}>
      {l.log.map((y, yi) => (
        <section key={`${l.id}-${y.age}-${yi}`} class="year">
          <h3>
            <span class="age-pill">{lg === 'fr' ? `${y.age} an${y.age > 1 ? 's' : ''}` : `Age ${y.age}`}</span>
            <span class="year-num">{y.year}</span>
          </h3>
          {y.lines.length === 0 && <p class="line muted">…</p>}
          {y.lines.map((ln, i) => (
            <p key={i} class={`line ${ln.tone ?? ''}`}>
              {ln.icon && <span class="line-icon">{ln.icon}</span>}
              <span>{ln.t[lg]}</span>
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}

export function Stats({ l }: { l: Life }) {
  return (
    <div class="stats">
      <StatRow k="happy" value={l.stats.happy} />
      <StatRow k="health" value={l.stats.health} />
      <StatRow k="smarts" value={l.stats.smarts} />
      <StatRow k="looks" value={l.stats.looks} />
    </div>
  );
}

const TABS: { id: Tab; icon: string; key: Parameters<typeof t>[0] }[] = [
  { id: 'career', icon: '💼', key: 'tab_career' },
  { id: 'assets', icon: '🏠', key: 'tab_assets' },
  { id: 'relations', icon: '💞', key: 'tab_relations' },
  { id: 'activities', icon: '🎲', key: 'tab_activities' },
];
export const TAB_ORDER = TABS.map((x) => x.id);

export function Dock({ l }: { l: Life }) {
  const blocked = !!result.value || l.queue.length > 0;
  const toggle = (id: Tab) => {
    if (blocked) { showToast(t('finish_event')); return; }
    sfx.open();
    tab.value = tab.value === id ? null : id;
  };
  const tabBtn = (x: (typeof TABS)[number]) => (
    <button key={x.id} class={`dock-btn ${tab.value === x.id ? 'on' : ''}`} onClick={() => toggle(x.id)} onMouseEnter={() => sfx.hover()}>
      <span class="dock-icon">{x.id === 'career' && l.prison ? '🔒' : x.icon}</span>
      <span class="dock-label">{x.id === 'career' && l.prison ? (lang.value === 'fr' ? 'Prison' : 'Prison') : x.id === 'career' && l.age < 18 && !l.job ? t('tab_school') : t(x.key)}</span>
    </button>
  );
  return (
    <div class="dock">
      {tabBtn(TABS[0])}
      {tabBtn(TABS[1])}
      <button class={`age-btn ${ageBusy.value ? 'busy' : ''} ${blocked ? 'blocked' : ''}`} disabled={!l.alive} onClick={() => doAgeUp()} title="Espace">
        <span class="plus">+</span>
        <span class="age-label">{t('age_up')}</span>
      </button>
      {tabBtn(TABS[2])}
      {tabBtn(TABS[3])}
    </div>
  );
}

function ActionGrid({ views }: { views: ActionView[] }) {
  const lg = lang.value;
  if (!views.length) return null;
  return (
    <div class="action-grid">
      {views.map((v) => (
        <button key={v.def.id} class={`action ${v.ok ? '' : 'off'}`} disabled={!v.ok} title={v.reason ? v.reason[lg] : ''} onClick={() => runAction(v.def.id)} onMouseEnter={() => v.ok && sfx.hover()}>
          <span class="a-icon">{v.def.icon}</span>
          <span class="a-text">
            <span class="a-label">{typeof v.def.label[lg] === 'string' ? (v.def.label[lg] as string) : (v.def.label[lg] as string[])[0]}</span>
            {v.reason ? <span class="a-desc warn">{v.reason[lg]}</span> : v.def.desc ? <span class="a-desc">{v.def.desc[lg] as string}</span> : null}
          </span>
          {v.def.limit && v.def.limit > 1 ? <span class="a-count">{v.used}/{v.def.limit}</span> : null}
        </button>
      ))}
    </div>
  );
}

function CareerPanel({ l }: { l: Life }) {
  const lg = lang.value;
  const e = l.edu;
  const school = listActions(l, content, 'school');
  const career = listActions(l, content, 'career');
  const major = content.majors.find((m) => m.id === e.major);
  const prog = content.grads.find((g) => g.id === e.gradProgram);
  return (
    <div>
      <div class="card info-card">
        <div class="card-title">🎒 {t('education')}</div>
        {e.enrolled ? (
          <>
            <div class="kv"><span>{tl(stageLabel(content, l, e.stage))}</span><b>{e.school}</b></div>
            {e.stage === 'uni' && major && <div class="kv"><span>{major.icon} {major.name[lg]}</span><b>{t('years_in')} {e.yearInStage + 1}/{major.years}</b></div>}
            {e.stage === 'grad' && prog && <div class="kv"><span>{prog.icon} {prog.name[lg]}</span><b>{e.yearInStage + 1}/{prog.years}</b></div>}
            <div class="kv"><span>{t('grades')}</span><b>{gradeLetter(e.grade)}</b></div>
            <Bar value={e.grade} color="#4CC9F0" small />
          </>
        ) : (
          <div class="kv"><span>{t('not_enrolled')}</span><b /></div>
        )}
        {e.degrees.length > 0 && (
          <div class="chips">{e.degrees.map((d) => <span class="chip" key={d}>🎓 {degreeName(d, l)}</span>)}</div>
        )}
        {e.loan > 0 && <div class="kv"><span>{t('student_loan')}</span><b class="neg">{money(l, -e.loan)}</b></div>}
        <ActionGrid views={school} />
      </div>
      {(l.age >= 14 || l.job) && (
        <div class="card info-card">
          <div class="card-title">💼 {t('current_job')}</div>
          {l.job ? (
            <>
              <div class="kv"><span>{careerTitle(content, l.job.careerId, l.job.level, l.gender, lg)}</span><b>{l.job.employer}</b></div>
              <div class="kv"><span>{t('salary')}</span><b>{money(l, l.job.salary)}{t('per_year')}</b></div>
              <div class="kv"><span>{t('years_in')}</span><b>{l.job.years} {t('years')}</b></div>
              <div class="kv"><span>{t('performance')}</span><b>{Math.round(l.job.perf)}%</b></div>
              <Bar value={l.job.perf} color="#06D6A0" small />
            </>
          ) : <div class="kv"><span>{t('no_job')}</span><b>{l.flags.pension ? `${t('pension')} : ${money(l, Number(l.flags.pension))}${t('per_year')}` : ''}</b></div>}
          <ActionGrid views={career} />
        </div>
      )}
    </div>
  );
}

function degreeName(d: string, l: Life): string {
  const lg = lang.value;
  if (d === 'high') return lg === 'fr' ? (l.country === 'fr' ? 'Baccalauréat' : 'Diplôme secondaire') : 'High school diploma';
  const [k, id] = d.split(':');
  if (k === 'uni') return content.majors.find((m) => m.id === id)?.name[lg] ?? id;
  return content.grads.find((g) => g.id === id)?.name[lg] ?? id;
}

const GROUPS: { key: Parameters<typeof t>[0]; roles: Role[] }[] = [
  { key: 'family', roles: ['mother', 'father', 'sibling', 'grandparent', 'child'] },
  { key: 'love', roles: ['partner', 'fiance', 'spouse', 'ex'] },
  { key: 'friends', roles: ['bestfriend', 'friend', 'enemy'] },
  { key: 'school_people', roles: ['classmate'] },
  { key: 'work_people', roles: ['boss', 'coworker'] },
  { key: 'others', roles: ['pet'] },
];

function RelationsPanel({ l }: { l: Life }) {
  const love = listActions(l, content, 'relations');
  return (
    <div>
      <ActionGrid views={love} />
      {GROUPS.map((g) => {
        const people = l.npcs.filter((n) => !n.temp && g.roles.includes(n.role) && (n.alive || ['mother', 'father', 'sibling', 'grandparent', 'spouse', 'child', 'pet'].includes(n.role)));
        if (!people.length) return null;
        return (
          <div key={g.key} class="rel-group">
            <div class="group-title">{t(g.key)}</div>
            {people.sort((a, b) => Number(b.alive) - Number(a.alive)).map((n) => <RelRow key={n.id} n={n} l={l} />)}
          </div>
        );
      })}
    </div>
  );
}

function RelRow({ n, l }: { n: Npc; l: Life }) {
  return (
    <button class={`rel-row ${n.alive ? '' : 'dead'}`} onClick={() => { sfx.open(); modal.value = { kind: 'npc', id: n.id }; }} onMouseEnter={() => sfx.hover()}>
      <Portrait l={l} npc={n} size={48} />
      <div class="rel-info">
        <div class="rel-name">{n.first} {n.last} {!n.alive && '🕊️'}</div>
        <div class="rel-sub">{npcLabel(n, l)}</div>
      </div>
      {n.alive && <div class="rel-bar"><Bar value={n.rel} color="#FF7EB6" small /></div>}
    </button>
  );
}

function AssetsPanel({ l }: { l: Life }) {
  const acts = listActions(l, content, 'assets');
  return (
    <div>
      <div class="card info-card">
        <div class="card-title">💰 {t('money_total')}</div>
        <div class={`big-money ${l.money < 0 ? 'neg' : ''}`}>{money(l, l.money)}</div>
        <div class="kv"><span>{lang.value === 'fr' ? 'Patrimoine net' : 'Net worth'}</span><b>{money(l, netWorth(l, content))}</b></div>
        {Object.keys(l.portfolio).length > 0 && <div class="kv"><span>📈 {lang.value === 'fr' ? 'Portefeuille' : 'Portfolio'}</span><b>{money(l, portfolioValue(l, content))}</b></div>}
        {debt(l) > 0 && <div class="kv"><span>💳 {lang.value === 'fr' ? 'Dettes' : 'Debts'}</span><b class="neg">{money(l, -debt(l))}</b></div>}
        {l.followers > 0 && <div class="kv"><span>📱 {lang.value === 'fr' ? 'Abonnés' : 'Followers'}</span><b>{l.followers.toLocaleString(lang.value === 'fr' ? 'fr-FR' : 'en-US')}</b></div>}
        <div class="kv"><span>{t('home')}</span><b>{l.flags.home !== undefined ? '🏠' : l.movedOut ? t('own_place') : t('living_with_parents')}</b></div>
      </div>
      <ActionGrid views={acts} />
      <div class="group-title">{lang.value === 'fr' ? 'Mes biens' : 'My assets'}</div>
      <OwnedAssets l={l} />
    </div>
  );
}

function ActivitiesPanel({ l }: { l: Life }) {
  const all = listActions(l, content, 'activities');
  const lg = lang.value;
  const groups = [
    { id: 'crime', title: lg === 'fr' ? 'Crime' : 'Crime' },
    { id: 'mind', title: lg === 'fr' ? 'Esprit & santé' : 'Mind & health' },
    { id: 'body', title: lg === 'fr' ? 'Corps & look' : 'Body & looks' },
    { id: 'fun', title: lg === 'fr' ? 'Loisirs' : 'Fun' },
    { id: 'social', title: lg === 'fr' ? 'Réseaux sociaux' : 'Social media' },
    { id: 'love', title: lg === 'fr' ? 'Amour' : 'Love' },
    { id: 'vices', title: lg === 'fr' ? 'Vices' : 'Vices' },
  ];
  if (l.prison) return <PrisonPanel l={l} />;
  if (l.age < 3) return <p class="muted">{lg === 'fr' ? 'Tu es un bébé. Ton activité principale : baver.' : "You're a baby. Your main activity: drooling."}</p>;
  return (
    <div>
      {groups.map((g) => {
        const v = all.filter((a) => a.def.group === g.id);
        if (!v.length) return null;
        return (
          <div key={g.id}>
            <div class="group-title">{g.title}</div>
            <ActionGrid views={v} />
          </div>
        );
      })}
    </div>
  );
}

export function TabPanel({ l }: { l: Life }) {
  const tb = tab.value;
  if (!tb) return null;
  const meta = TABS.find((x) => x.id === tb)!;
  const title = tb === 'career' && l.prison ? 'Prison' : tb === 'career' && l.age < 18 && !l.job ? t('tab_school') : t(meta.key);
  return (
    <div class="tab-panel glass slide-up" key={tb}>
      <div class="sheet-head">
        <h2><span class="sheet-icon">{tb === 'career' && l.prison ? '🔒' : meta.icon}</span>{title}</h2>
        <button class="x" onClick={() => { sfx.close(); tab.value = null; }}>✕</button>
      </div>
      <div class="sheet-body">
        {tb === 'career' && (l.prison ? <PrisonPanel l={l} /> : <CareerPanel l={l} />)}
        {tb === 'relations' && <RelationsPanel l={l} />}
        {tb === 'assets' && <AssetsPanel l={l} />}
        {tb === 'activities' && <ActivitiesPanel l={l} />}
      </div>
    </div>
  );
}

export function Hud() {
  const l = life.value;
  void rev.value;
  if (!l) return null;
  return (
    <>
      <TopBar l={l} />
      <aside class="side glass">
        <Feed l={l} />
        <Stats l={l} />
      </aside>
      <TabPanel l={l} />
      <Dock l={l} />
    </>
  );
}

export { living, npcAge };
