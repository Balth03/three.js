import { renderString, clamp, type Life } from '@bl/sim';
import { content } from '@bl/data';
import { modal, lang, profile, achToast, rev, bump, life } from '../state.ts';
import { Sheet, Btn, Bar, STAT_META } from './common.tsx';
import { portrait } from '../three/stage.ts';
import { sfx } from '../audio.ts';

function safePortrait(gender: 'm' | 'f', age: number, app: Life['app']) { try { return portrait({ gender, age, app }, 'sleepy', 96); } catch { return ''; } }

const close = () => { sfx.close(); modal.value = null; };
const T = (fr: string, en: string) => (lang.value === 'fr' ? fr : en);

export function Achievements() {
  const p = profile.value;
  const lg = lang.value;
  const all = content.achievements;
  const got = all.filter((a) => p.achievements[a.id]).length;
  return (
    <Sheet title={T('Succès', 'Achievements')} icon="🏆" onClose={close} cls="wide">
      <div class="kv big"><span>{got} / {all.length}</span><b>{Math.round((got / all.length) * 100)}%</b></div>
      <Bar value={(got / all.length) * 100} color="#FFB703" />
      <div class="ach-grid">
        {all.map((a) => {
          const ok = !!p.achievements[a.id];
          const hidden = a.secret && !ok;
          return (
            <div key={a.id} class={`ach ${ok ? 'on' : ''}`} title={hidden ? '???' : a.desc[lg]}>
              <span class="ach-icon">{hidden ? '❔' : a.icon}</span>
              <span class="ach-name">{hidden ? T('Succès secret', 'Secret achievement') : a.name[lg]}</span>
              <span class="ach-desc">{hidden ? '???' : a.desc[lg]}</span>
            </div>
          );
        })}
      </div>
      <div class="group-title">{T('Défis réussis', 'Challenges completed')}</div>
      <div class="chips">{content.challenges.map((c) => <span key={c.id} class={`chip ${p.challengesDone[c.id] ? 'gold' : ''}`} title={c.desc[lg]}>{c.icon} {c.name[lg]} {p.challengesDone[c.id] ? '✓' : ''}</span>)}</div>
    </Sheet>
  );
}

export function Graveyard() {
  const p = profile.value;
  const lg = lang.value;
  return (
    <Sheet title={T('Cimetière des vies', 'Graveyard of lives')} icon="🪦" onClose={close} cls="wide">
      <div class="kv"><span>{T('Vies vécues', 'Lives lived')}</span><b>{p.lives}</b></div>
      <div class="kv"><span>{T('Meilleur score', 'Best score')}</span><b>{p.bestScore}</b></div>
      {!p.graveyard.length && <p class="muted">{T('Personne n\'est encore mort. Patience.', 'Nobody has died yet. Patience.')}</p>}
      <div class="grave-grid">
        {p.graveyard.map((g) => (
          <div class="grave" key={g.id}>
            <img class="portrait dead" src={safePortrait(g.gender, g.age, g.app)} width={64} height={64} />
            <div class="grave-name">{g.first} {g.last}</div>
            <div class="grave-sub">{g.born} – {g.died} · {g.age} {T('ans', 'y/o')}{g.generation > 1 ? ` · G${g.generation}` : ''}</div>
            <div class="grave-cause">{g.cause[lg]}</div>
            <div class="grave-sub">💰 {g.netWorth} · ⭐ {g.score}</div>
            <div class="chips">{g.titles.slice(0, 2).map((t, i) => <span class="chip" key={i}>{t[lg].replace(/\{([^|}]*)\|([^}]*)\}/g, g.gender === 'm' ? '$1' : '$2')}</span>)}</div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

export function FamilyTree({ l }: { l: Life }) {
  const lg = lang.value;
  const ancestors = l.ancestors;
  const kids = l.npcs.filter((n) => n.role === 'child');
  const parents = l.npcs.filter((n) => n.role === 'mother' || n.role === 'father');
  return (
    <Sheet title={T('Arbre généalogique', 'Family tree')} icon="🌳" onClose={close} cls="wide">
      <div class="tree">
        {ancestors.map((a, i) => (
          <div class="tree-row" key={i}>
            <div class="tree-node ancestor">
              <img class="portrait dead" src={portrait({ gender: a.gender, age: Math.max(30, a.died - a.born), app: a.app }, 'sleepy', 96)} width={56} height={56} />
              <div><b>{a.first} {a.last}</b><div class="muted small">G{a.generation} · {a.born}–{a.died} · {a.job ?? '—'}</div><div class="muted small">{a.cause[lg]}</div></div>
            </div>
            <div class="tree-link">│</div>
          </div>
        ))}
        {!ancestors.length && parents.length > 0 && (
          <div class="tree-row"><div class="tree-pair">{parents.map((p) => <div class="tree-node" key={p.id}><img class={`portrait ${p.alive ? '' : 'dead'}`} src={portrait({ gender: p.gender, age: l.year - p.birthYear, app: p.app }, 'happy', 96)} width={56} height={56} /><div><b>{p.first} {p.last}</b><div class="muted small">{p.alive ? `${l.year - p.birthYear} ${T('ans', 'y/o')}` : `† ${p.deathYear}`}</div></div></div>)}</div><div class="tree-link">│</div></div>
        )}
        <div class="tree-row">
          <div class="tree-node me">
            <img class="portrait me" src={portrait({ gender: l.gender, age: l.age, app: l.app }, 'happy', 96)} width={64} height={64} />
            <div><b>{l.first} {l.last}</b><div class="muted small">G{l.generation} · {l.age} {T('ans', 'y/o')}</div></div>
          </div>
        </div>
        {kids.length > 0 && <div class="tree-link">│</div>}
        <div class="tree-pair">
          {kids.map((k) => (
            <div class="tree-node" key={k.id}>
              <img class={`portrait ${k.alive ? '' : 'dead'}`} src={portrait({ gender: k.gender, age: l.year - k.birthYear, app: k.app }, 'happy', 96)} width={52} height={52} />
              <div><b>{k.first}</b><div class="muted small">{l.year - k.birthYear} {T('ans', 'y/o')}</div></div>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

export function GodPanel({ l }: { l: Life }) {
  void rev.value;
  const set = (k: 'happy' | 'health' | 'smarts' | 'looks', v: number) => { l.stats[k] = clamp(v); bump(); };
  const c = content.countries.find((x) => x.id === l.country)!;
  return (
    <Sheet title={T('Mode Dieu', 'God mode')} icon="⚡" onClose={close}>
      {(['happy', 'health', 'smarts', 'looks'] as const).map((k) => (
        <div class="setting" key={k}><span>{STAT_META[k].icon} {T({ happy: 'Bonheur', health: 'Santé', smarts: 'Intelligence', looks: 'Apparence' }[k], k)}</span><input type="range" min="0" max="100" value={l.stats[k]} onInput={(e) => set(k, +(e.target as HTMLInputElement).value)} /></div>
      ))}
      {(['karma', 'fame', 'athletic', 'discipline'] as const).map((k) => (
        <div class="setting" key={k}><span>{STAT_META[k].icon} {k}</span><input type="range" min="0" max="100" value={l.attrs[k]} onInput={(e) => { l.attrs[k] = +(e.target as HTMLInputElement).value; bump(); }} /></div>
      ))}
      <div class="row-btns">
        <Btn onClick={() => { l.money += Math.round(1e6 * c.price * c.currency.rate); bump(); sfx.coin(); }}>💰 +1M</Btn>
        <Btn onClick={() => { l.conditions = []; l.addictions = {}; l.stats.health = 100; bump(); sfx.good(); }}>💊 {T('Guérir tout', 'Cure all')}</Btn>
        <Btn onClick={() => { if (l.prison) { l.prison.served = l.prison.years; } l.heat = 0; bump(); }}>🔓 {T('Effacer la prison', 'Clear prison')}</Btn>
        <Btn onClick={() => { l.flags.godImmune = l.flags.godImmune ? 0 : 1; bump(); }}>🛡️ {T('Immunité judiciaire', 'Legal immunity')} {l.flags.godImmune ? '✓' : ''}</Btn>
      </div>
    </Sheet>
  );
}

export function ChallengeChip() {
  const l = life.value;
  void rev.value;
  if (!l?.challenge) return null;
  const ch = content.challenges.find((c) => c.id === l.challenge);
  if (!ch) return null;
  const done = !!profile.value.challengesDone[ch.id];
  return <div class={`challenge-chip glass ${done ? 'done' : ''}`} title={ch.desc[lang.value]}>{ch.icon} {ch.name[lang.value]} {done ? '✅' : '⏳'}</div>;
}

export function AchievementToast() {
  const a = achToast.value;
  if (!a) return null;
  const def = content.achievements.find((x) => x.id === a.id);
  if (!def) return null;
  setTimeout(() => { if (achToast.value?.n === a.n) achToast.value = null; }, 3000);
  const l = life.value;
  return (
    <div class="ach-toast glass" key={a.n}>
      <span class="ach-icon">{def.icon}</span>
      <div><div class="muted small">🏆 {T('Succès débloqué !', 'Achievement unlocked!')}</div><b>{l ? renderString(def.name[lang.value], { life: l, content }, lang.value) : def.name[lang.value]}</b></div>
    </div>
  );
}
