import { useEffect, useState } from 'preact/hooks';
import { summarize, careerTitle, renderString, type Gender, type Orientation, type GameMode, type Life } from '@bl/sim';
import { content } from '@bl/data';
import { screen, life, modal, lang, showDeath, rev, retro } from '../state.ts';
import { startLife, previewLife, loadExisting, continueAsHeir } from '../game.ts';
import { loadLife, slotInfo, AUTOSAVE } from '../save.ts';
import { t } from '../i18n.ts';
import { Btn, money, Portrait } from './common.tsx';
import { sfx, unlockAudio } from '../audio.ts';

export function Title() {
  const auto = slotInfo(AUTOSAVE);
  useEffect(() => { previewLife({ seed: 777, birthYear: 2026 - 8, country: 'fr' }); }, []);
  return (
    <div class="title-screen">
      <div class="logo pop-in">
        <div class="logo-mark">🧬</div>
        <h1>BitLife <span>Online</span></h1>
        <p>{t('title_sub')}</p>
      </div>
      <div class="title-menu glass slide-up">
        {auto && auto.alive && (
          <Btn cls="primary big" onClick={() => { unlockAudio(); const l = loadLife(AUTOSAVE); if (l) loadExisting(l); }}>
            ▶ {t('continue')} <small>· {auto.name}, {auto.age} {t('years')}</small>
          </Btn>
        )}
        <Btn cls={`big ${auto?.alive ? '' : 'primary'}`} onClick={() => { unlockAudio(); sfx.open(); screen.value = 'create'; }}>✨ {t('new_life')}</Btn>
        <Btn cls="big" onClick={() => { unlockAudio(); startLife({ birthYear: 2026 }); }}>🎲 {t('random_life')}</Btn>
        <div class="row-btns">
          <Btn onClick={() => { unlockAudio(); modal.value = { kind: 'saves' }; }}>💾 {t('saves')}</Btn>
          <Btn onClick={() => { unlockAudio(); modal.value = { kind: 'achievements' }; }}>🏆</Btn>
          <Btn onClick={() => { unlockAudio(); modal.value = { kind: 'graveyard' }; }}>🪦</Btn>
          <Btn onClick={() => { unlockAudio(); modal.value = { kind: 'settings' }; }}>⚙️</Btn>
        </div>
      </div>
      <div class="foot muted small">{t('controls')}</div>
    </div>
  );
}

export function Create() {
  const lg = lang.value;
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [gender, setGender] = useState<Gender>(Math.random() < 0.5 ? 'm' : 'f');
  const [ctry, setCtry] = useState('fr');
  const [city, setCity] = useState('');
  const [orientation, setOrientation] = useState<Orientation>('straight');
  const [wealth, setWealth] = useState<'random' | 'poor' | 'middle' | 'rich'>('random');
  const [mode, setMode] = useState<GameMode>('classic');
  const [scenario, setScenario] = useState('');
  const [challenge, setChallenge] = useState('');
  const [year, setYear] = useState(2026);
  const c = content.countries.find((x) => x.id === ctry)!;
  const opts = () => ({ seed, gender, country: ctry, city: city || undefined, orientation, wealth: wealth === 'random' ? undefined : wealth, mode, first: first.trim() || undefined, last: last.trim() || undefined, birthYear: year, scenario: scenario || undefined, challenge: challenge || undefined });
  const [preview, setPreview] = useState<Life | null>(null);
  useEffect(() => { setPreview(previewLife(opts())); }, [seed, gender, ctry, city, wealth, first, last, scenario, year]);
  const seg = <T extends string>(val: T, items: [T, string][], on: (v: T) => void) => (
    <div class="seg">{items.map(([v, l]) => <button key={v} class={val === v ? 'on' : ''} onClick={() => { sfx.click(); on(v); }}>{l}</button>)}</div>
  );
  return (
    <div class="create-screen">
      <div class="create-panel glass slide-up">
        <h2>✨ {t('create_title')}</h2>
        <div class="field-row">
          <label class="field"><span>{t('first_name')}</span><input value={first} placeholder={preview?.first} onInput={(e) => setFirst((e.target as HTMLInputElement).value)} maxLength={20} /></label>
          <label class="field"><span>{t('last_name')}</span><input value={last} placeholder={preview?.last} onInput={(e) => setLast((e.target as HTMLInputElement).value)} maxLength={24} /></label>
        </div>
        <div class="field"><span>{t('gender')}</span>{seg(gender, [['m', `👦 ${t('male')}`], ['f', `👧 ${t('female')}`]], setGender)}</div>
        <div class="field"><span>{t('country')}</span>
          <div class="country-grid">
            {content.countries.map((x) => (
              <button key={x.id} class={`country ${ctry === x.id ? 'on' : ''}`} onClick={() => { sfx.click(); setCtry(x.id); setCity(''); }}>
                <span class="cflag">{x.flag}</span><span>{x.name[lg]}</span>
              </button>
            ))}
          </div>
        </div>
        <label class="field"><span>{t('city')}</span>
          <select value={city} onChange={(e) => setCity((e.target as HTMLSelectElement).value)}>
            <option value="">{t('random')}</option>
            {c.cities.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </label>
        <div class="field"><span>{t('orientation')}</span>{seg(orientation, [['straight', t('straight')], ['gay', t('gay')], ['bi', t('bi')]], setOrientation)}</div>
        <div class="field"><span>{t('family_wealth')}</span>{seg(wealth, [['random', '🎲'], ['poor', t('poor')], ['middle', t('middle')], ['rich', t('rich')]], setWealth)}</div>
        <div class="field"><span>{t('mode')}</span>{seg(mode, [['classic', t('classic')], ['zen', '🧘 Zen'], ['chaos', '🌪️ Chaos'], ['hardcore', '💀 Hardcore'], ['god', '⚡ ' + (lg === 'fr' ? 'Dieu' : 'God')]], setMode)}</div>
        <label class="field"><span>{t('birth_year')} : {year}</span><input type="range" min="1950" max="2060" value={year} onInput={(e) => setYear(+(e.target as HTMLInputElement).value)} /></label>
        <label class="field"><span>🎬 {lg === 'fr' ? 'Scénario' : 'Scenario'}</span>
          <select value={scenario} onChange={(e) => setScenario((e.target as HTMLSelectElement).value)}>
            <option value="">{lg === 'fr' ? 'Aucun (vie normale)' : 'None (normal life)'}</option>
            {content.scenarios.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.name[lg]} — {s.desc[lg]}</option>)}
          </select>
        </label>
        <label class="field"><span>🏆 {lg === 'fr' ? 'Défi' : 'Challenge'}</span>
          <select value={challenge} onChange={(e) => setChallenge((e.target as HTMLSelectElement).value)}>
            <option value="">{lg === 'fr' ? 'Aucun' : 'None'}</option>
            {content.challenges.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name[lg]} — {c.desc[lg]}</option>)}
          </select>
        </label>
        <div class="create-actions">
          <Btn cls="ghost" onClick={() => { screen.value = 'title'; }}>← {t('back')}</Btn>
          <Btn onClick={() => setSeed(Math.floor(Math.random() * 1e9))} title="Re-roll">🎲</Btn>
          <Btn cls="primary big" onClick={() => { sfx.good(); startLife(opts()); }}>👶 {t('be_born')}</Btn>
        </div>
      </div>
      {preview && (
        <div class="create-family glass pop-in">
          {preview.npcs.filter((n) => n.role === 'mother' || n.role === 'father' || n.role === 'sibling').map((n) => (
            <div class="fam" key={n.id}>
              <Portrait l={preview} npc={n} size={64} />
              <div class="fam-name">{n.first}</div>
              <div class="fam-sub">{n.job ? careerTitle(content, n.job, 1, n.gender, lg) : n.role === 'sibling' ? `${preview.year - n.birthYear} ${t('years')}` : '—'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Death() {
  const l = life.value;
  void rev.value;
  if (!l || l.alive || !showDeath.value) return null;
  const lg = lang.value;
  const s = summarize(l, content);
  const kids = l.npcs.filter((n) => n.role === 'child' && n.alive);
  const top = s.topJob ? careerTitle(content, s.topJob.careerId, s.topJob.level, l.gender, lg) : lg === 'fr' ? 'Aucun' : 'None';
  return (
    <div class="modal-back death-back">
      <div class="death glass pop-in">
        <div class="death-top">
          <Portrait l={l} size={110} mood="sleepy" />
          <div>
            <div class="muted">{t('dead_title')}</div>
            <h2>{l.first} {l.last}</h2>
            <div class="muted">{l.birthYear} – {l.year} · {l.death?.cause[lg]}</div>
          </div>
        </div>
        <div class="titles">{s.titles.map((x, i) => <span class="chip gold" key={i}>🏅 {renderString(x[lg], { life: l, content }, lg)}</span>)}</div>
        <div class="death-grid">
          <div><span>🎂</span><b>{s.age}</b><small>{t('years')}</small></div>
          <div><span>💰</span><b>{money(l, s.netWorth)}</b><small>{t('net_worth')}</small></div>
          <div><span>💼</span><b>{top}</b><small>{t('tab_career')}</small></div>
          <div><span>🎓</span><b>{s.degrees.length}</b><small>{t('degrees')}</small></div>
          <div><span>👶</span><b>{s.children}</b><small>{t('children')}</small></div>
          <div><span>⭐</span><b>{s.score}</b><small>{t('life_score')}</small></div>
        </div>
        <div class="row-btns">
          {kids.map((k) => <Btn key={k.id} cls="primary" onClick={() => { sfx.good(); continueAsHeir(k.id); }}>👶 {t('play_child')} : {k.first} ({l.year - k.birthYear} {t('years')})</Btn>)}
          <Btn cls="primary" onClick={() => { sfx.open(); showDeath.value = false; screen.value = 'create'; }}>✨ {t('new_life')}</Btn>
          <Btn onClick={() => { showDeath.value = false; retro.value = true; }}>🎞️ {lang.value === 'fr' ? 'Rétrospective' : 'Retrospective'}</Btn>
          <Btn onClick={() => { showDeath.value = false; }}>📜 {t('view_life')}</Btn>
          <Btn cls="ghost" onClick={() => { showDeath.value = false; screen.value = 'title'; }}>🏠 {t('main_menu')}</Btn>
        </div>
      </div>
    </div>
  );
}
