import type { ComponentChildren } from 'preact';
import { useMemo } from 'preact/hooks';
import { formatMoney, country, type Delta, type Life, type Npc, type Mood, roleTitle, npcAge } from '@bl/sim';
import { content } from '@bl/data';
import { lang, rev } from '../state.ts';
import { portrait } from '../three/stage.ts';
import { npcSpec, specOf } from '../game.ts';
import { t, type Key } from '../i18n.ts';
import { sfx } from '../audio.ts';

export const STAT_META: Record<string, { icon: string; color: string; key: Key }> = {
  happy: { icon: '😊', color: '#FFB703', key: 'happy' },
  health: { icon: '❤️', color: '#EF476F', key: 'health' },
  smarts: { icon: '🧠', color: '#4CC9F0', key: 'smarts' },
  looks: { icon: '✨', color: '#B388EB', key: 'looks' },
  karma: { icon: '☯️', color: '#F4A261', key: 'karma' },
  fame: { icon: '⭐', color: '#FFD166', key: 'fame' },
  athletic: { icon: '💪', color: '#06D6A0', key: 'athletic' },
  discipline: { icon: '🎯', color: '#8D99AE', key: 'discipline' },
  money: { icon: '💰', color: '#2DBE60', key: 'money' },
  rel: { icon: '💞', color: '#FF7EB6', key: 'rel' },
};

export function money(l: Life, v: number) { return formatMoney(v, country(content, l.country), lang.value); }

export function Bar({ value, color, small }: { value: number; color: string; small?: boolean }) {
  const v = Math.max(0, Math.min(100, value));
  const c = v < 25 ? '#EF476F' : color;
  return (
    <div class={`bar ${small ? 'small' : ''}`}>
      <div class="bar-fill" style={{ width: `${v}%`, background: c }} />
    </div>
  );
}

export function StatRow({ k, value }: { k: string; value: number }) {
  const m = STAT_META[k];
  return (
    <div class="stat-row" title={t(m.key)}>
      <span class="stat-icon">{m.icon}</span>
      <span class="stat-name">{t(m.key)}</span>
      <Bar value={value} color={m.color} />
      <span class="stat-val">{Math.round(value)}%</span>
    </div>
  );
}

export function Deltas({ deltas, l }: { deltas: Delta[]; l: Life }) {
  void rev.value;
  if (!deltas.length) return null;
  return (
    <div class="deltas">
      {deltas.map((d, i) => {
        const m = STAT_META[d.key];
        const npc = d.npcId !== undefined ? l.npcs.find((n) => n.id === d.npcId) : undefined;
        const label = d.key === 'money' ? money(l, d.value) : `${d.value > 0 ? '+' : ''}${d.value}`;
        return (
          <span key={i} class={`delta ${d.value > 0 ? 'up' : 'down'}`} style={{ animationDelay: `${i * 70}ms` }}>
            {m?.icon} {d.key === 'money' && d.value > 0 ? '+' : ''}{label} {npc ? <small>{npc.first}</small> : d.key !== 'money' ? <small>{t(m.key)}</small> : null}
          </span>
        );
      })}
    </div>
  );
}

export function Portrait({ l, npc, mood, size = 56, cls = '' }: { l: Life; npc?: Npc; mood?: Mood; size?: number; cls?: string }) {
  void rev.value;
  const spec = npc ? npcSpec(npc, l.year) : specOf(l);
  const key = `${JSON.stringify(spec)}|${mood}`;
  const url = useMemo(() => {
    if (npc?.role === 'pet') return '';
    try { return portrait(spec, mood ?? (npc && !npc.alive ? 'sleepy' : 'happy')); } catch { return ''; }
  }, [key]);
  if (npc?.role === 'pet') return <div class={`portrait pet ${cls}`} style={{ width: size, height: size, fontSize: size * 0.6 }}>{npc.species === 'cat' ? '🐱' : npc.species === 'dog' ? '🐶' : npc.species === 'hamster' ? '🐹' : npc.species === 'fish' ? '🐠' : '🐾'}</div>;
  return <img class={`portrait ${cls} ${npc && !npc.alive ? 'dead' : ''}`} src={url} width={size} height={size} alt="" draggable={false} />;
}

export function npcLabel(n: Npc, l: Life) {
  return `${roleTitle(n.role, n.gender, lang.value)} · ${t('age_short', { n: npcAge(n, l.year) })}`;
}

export function Btn({ children, onClick, cls = '', disabled, title, hotkey }: { children: ComponentChildren; onClick?: () => void; cls?: string; disabled?: boolean; title?: string; hotkey?: string }) {
  return (
    <button class={`btn ${cls}`} disabled={disabled} title={title} onClick={() => { if (!disabled) onClick?.(); }} onMouseEnter={() => !disabled && sfx.hover()}>
      {hotkey && <kbd>{hotkey}</kbd>}
      {children}
    </button>
  );
}

export function Sheet({ title, icon, children, onClose, cls = '' }: { title: string; icon?: string; children: ComponentChildren; onClose: () => void; cls?: string }) {
  return (
    <div class="modal-back" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div class={`sheet glass pop-in ${cls}`}>
        <div class="sheet-head">
          <h2>{icon && <span class="sheet-icon">{icon}</span>}{title}</h2>
          <button class="x" onClick={onClose} aria-label={t('close')}>✕</button>
        </div>
        <div class="sheet-body">{children}</div>
      </div>
    </div>
  );
}
