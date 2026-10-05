// Minigame kit: a full-screen neon arena with intro card, 3-2-1 countdown, HUD (score / combo / timer),
// juice (screen shake, flashes, particles, floating text) and a graded results screen.
// Every game is a component that receives `GameProps` and drives a `useGame()` controller.
import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState, useCallback } from 'preact/hooks';
import type { Life } from '@bl/sim';
import { lang } from '../../state.ts';
import { sfx } from '../../audio.ts';

export interface GameProps {
  /** Final score 0..1 (+ optional extra number, e.g. money won). */
  onDone: (score: number, extra?: number) => void;
  l: Life;
  /** Optional flavour (e.g. 'karaoke' | 'concert' | 'dj' for the rhythm game). */
  variant?: string;
}

export const tr = (fr: string, en: string) => (lang.value === 'fr' ? fr : en);

export type Phase = 'intro' | 'count' | 'play' | 'done';
export interface FloatText { id: number; x: number; y: number; text: string; color: string; big?: boolean }
export interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number }

export interface GameApi {
  phase: Phase;
  /** Seconds left (if a duration was given), else elapsed seconds. */
  time: number;
  elapsed: number;
  score: number;
  combo: number;
  best: number;
  /** Add points; combo multiplies them. Optional floating label at (x, y) in % of the arena. */
  add: (pts: number, label?: string, x?: number, y?: number, color?: string) => void;
  /** Register a perfect / good hit (raises combo) or a miss (breaks it). */
  hit: (quality?: 'perfect' | 'good') => void;
  miss: (label?: string, x?: number, y?: number) => void;
  /** End the game with a normalised 0..1 score and optional stat lines. */
  end: (score01: number, stats?: [string, string][], extra?: number) => void;
  shake: (power?: number) => void;
  flash: (color?: string) => void;
  /** Particle burst at (x, y) in % of the arena. */
  burst: (x: number, y: number, color?: string, n?: number) => void;
  float: (text: string, x?: number, y?: number, color?: string, big?: boolean) => void;
  start: () => void;
}

/** requestAnimationFrame loop with clamped dt (seconds). */
export function useLoop(cb: (dt: number, t: number) => void, active: boolean) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!active) return;
    let raf = 0, last = performance.now(), t = 0;
    const loop = (now: number) => { const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt; ref.current(dt, t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

/** Keyboard handler that swallows game keys (so Space doesn't age up the character, etc.). */
export function useKeys(down: (e: KeyboardEvent) => void, up?: (e: KeyboardEvent) => void) {
  const d = useRef(down), u = useRef(up);
  d.current = down; u.current = up;
  useEffect(() => {
    const hd = (e: KeyboardEvent) => { if (e.code === 'Escape') return; e.stopPropagation(); if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code)) e.preventDefault(); d.current(e); };
    const hu = (e: KeyboardEvent) => { e.stopPropagation(); u.current?.(e); };
    window.addEventListener('keydown', hd, true);
    window.addEventListener('keyup', hu, true);
    return () => { window.removeEventListener('keydown', hd, true); window.removeEventListener('keyup', hu, true); };
  }, []);
}

/** Canvas sized to its container with devicePixelRatio; `draw(ctx, w, h)` is called every frame while active. */
export function useCanvas(draw: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, t: number) => void, active: boolean) {
  const ref = useRef<HTMLCanvasElement>(null);
  const size = useRef({ w: 0, h: 0 });
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ro = new ResizeObserver(() => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.max(1, Math.round(r.width * dpr)); c.height = Math.max(1, Math.round(r.height * dpr));
      size.current = { w: r.width, h: r.height };
      c.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    ro.observe(c);
    return () => ro.disconnect();
  }, []);
  useLoop((dt, t) => { const c = ref.current; const ctx = c?.getContext('2d'); if (ctx && size.current.w) draw(ctx, size.current.w, size.current.h, dt, t); }, active);
  return ref;
}

let fid = 0;

export function useGame(opts: { duration?: number; onDone: GameProps['onDone'] }): GameApi & { _state: GameState } {
  const [phase, setPhase] = useState<Phase>('intro');
  const [time, setTime] = useState(opts.duration ?? 0);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [shakeK, setShake] = useState(0);
  const [flashC, setFlash] = useState<string | null>(null);
  const [floats, setFloats] = useState<FloatText[]>([]);
  const [result, setResult] = useState<{ s: number; stats: [string, string][]; extra?: number } | null>(null);
  const [count, setCount] = useState(3);
  const sparks = useRef<Spark[]>([]);
  const comboRef = useRef(0);
  const float = useCallback((text: string, x = 50, y = 40, color = '#fff', big = false) => {
    const id = ++fid;
    setFloats((f) => [...f.slice(-14), { id, x, y, text, color, big }]);
    setTimeout(() => setFloats((f) => f.filter((q) => q.id !== id)), 900);
  }, []);
  const burst = useCallback((x: number, y: number, color = '#ff5bd1', n = 18) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 40 + Math.random() * 160;
      sparks.current.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: 0, max: 0.5 + Math.random() * 0.5, color, size: 2 + Math.random() * 4 });
    }
  }, []);
  const api: GameApi = {
    phase, time, elapsed, score, combo, best,
    add: (pts, label, x, y, color) => { const m = 1 + Math.min(4, Math.floor(comboRef.current / 5)) * 0.5; const v = Math.round(pts * m); setScore((s) => s + v); if (label !== undefined) float(label || `+${v}`, x, y, color); },
    hit: (q = 'good') => { comboRef.current++; setCombo(comboRef.current); setBest((b) => Math.max(b, comboRef.current)); if (comboRef.current % 10 === 0) { sfx.combo(comboRef.current); float(`COMBO ×${comboRef.current}`, 50, 22, '#ffd166', true); } else sfx.hit(q === 'perfect'); },
    miss: (label, x, y) => { if (comboRef.current >= 5) float(tr('COMBO BRISÉ', 'COMBO BROKEN'), 50, 22, '#ff4d6d', true); comboRef.current = 0; setCombo(0); sfx.miss(); setShake((k) => k + 1); if (label) float(label, x, y, '#ff4d6d'); },
    end: (s, stats = [], extra) => { if (phase === 'done') return; setPhase('done'); setResult({ s: Math.max(0, Math.min(1, s)), stats, extra }); sfx.fanfare(s); },
    shake: () => setShake((k) => k + 1),
    flash: (c = '#ffffff') => { setFlash(c); setTimeout(() => setFlash(null), 120); },
    burst, float,
    start: () => { setPhase('count'); },
  };
  // countdown → play
  useEffect(() => {
    if (phase !== 'count') return;
    let n = 3;
    sfx.beep(false);
    const iv = setInterval(() => { n--; if (n > 0) sfx.beep(false); else { sfx.beep(true); clearInterval(iv); setPhase('play'); } setCount(n); }, 650);
    setCount(3);
    return () => clearInterval(iv);
  }, [phase]);
  // timer
  useLoop((dt) => {
    setElapsed((e) => e + dt);
    if (opts.duration) setTime((t) => Math.max(0, t - dt));
  }, phase === 'play');
  // sparks physics are advanced by the Arena's particle canvas
  const _state: GameState = { shakeK, flashC, floats, result, sparks: sparks.current, count, onDone: opts.onDone, duration: opts.duration };
  return { ...api, _state };
}

interface GameState { shakeK: number; flashC: string | null; floats: FloatText[]; result: { s: number; stats: [string, string][]; extra?: number } | null; sparks: Spark[]; count: number; onDone: GameProps['onDone']; duration?: number }

export function grade(s: number): { g: string; color: string; fr: string; en: string } {
  if (s >= 0.95) return { g: 'S', color: '#ffd166', fr: 'LÉGENDAIRE', en: 'LEGENDARY' };
  if (s >= 0.8) return { g: 'A', color: '#06d6a0', fr: 'EXCELLENT', en: 'EXCELLENT' };
  if (s >= 0.6) return { g: 'B', color: '#4cc9f0', fr: 'PAS MAL', en: 'NOT BAD' };
  if (s >= 0.4) return { g: 'C', color: '#b8a1ff', fr: 'MOUAIS', en: 'MEH' };
  return { g: 'D', color: '#ff4d6d', fr: 'NAUFRAGE', en: 'TRAINWRECK' };
}

/** The full-screen arena around a game: intro, countdown, HUD, juice layers and results. */
export function Arena({ g, title, icon, howTo, keys, theme = 'neon', hud = true, children, scoreLabel }: {
  g: GameApi & { _state: GameState }; title: string; icon: string; howTo: string; keys?: string[]; theme?: 'neon' | 'sunset' | 'matrix' | 'blood' | 'casino' | 'ice';
  hud?: boolean; children: ComponentChildren; scoreLabel?: string;
}) {
  const st = g._state;
  const fx = useRef<HTMLCanvasElement>(null);
  // particle layer
  useLoop((dt) => {
    const c = fx.current; if (!c) return;
    const r = c.getBoundingClientRect();
    if (c.width !== Math.round(r.width) || c.height !== Math.round(r.height)) { c.width = Math.round(r.width); c.height = Math.round(r.height); }
    const ctx = c.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    const arr = st.sparks;
    for (let i = arr.length - 1; i >= 0; i--) {
      const p = arr[i];
      p.life += dt; if (p.life > p.max) { arr.splice(i, 1); continue; }
      p.vy += 260 * dt;
      p.x += (p.vx * dt) / c.width * 100; p.y += (p.vy * dt) / c.height * 100;
      const k = 1 - p.life / p.max;
      ctx.globalAlpha = k;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc((p.x / 100) * c.width, (p.y / 100) * c.height, p.size * k + 1, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }, true);
  useKeys((e) => {
    if (g.phase === 'intro' && (e.code === 'Space' || e.code === 'Enter')) { sfx.click(); g.start(); }
    else if (g.phase === 'done' && st.result && (e.code === 'Space' || e.code === 'Enter')) st.onDone(st.result.s, st.result.extra);
  });
  const gr = st.result ? grade(st.result.s) : null;
  const lowTime = st.duration && g.time < 5 && g.phase === 'play';
  return (
    <div class={`arena theme-${theme} ${lowTime ? 'low-time' : ''}`}>
      <div class="arena-bg" />
      <div class="arena-grid" />
      <div class="arena-stage" style={{ animation: st.shakeK ? `arena-shake${st.shakeK % 2} .32s` : undefined }}>
        {children}
      </div>
      <canvas class="arena-fx" ref={fx} />
      {st.floats.map((f) => <div key={f.id} class={`arena-float ${f.big ? 'big' : ''}`} style={{ left: `${f.x}%`, top: `${f.y}%`, color: f.color }}>{f.text}</div>)}
      {st.flashC && <div class="arena-flash" style={{ background: st.flashC }} />}
      {hud && g.phase !== 'intro' && (
        <div class="arena-hud">
          <div class="hud-title">{icon} {title}</div>
          <div class="hud-score"><small>{scoreLabel ?? 'SCORE'}</small><b key={g.score} class="bump">{g.score.toLocaleString()}</b></div>
          {g.combo > 1 && <div class="hud-combo" key={g.combo}>×{g.combo}</div>}
          {st.duration ? <div class="hud-timer"><div style={{ width: `${(g.time / st.duration) * 100}%` }} /><span>{Math.ceil(g.time)}s</span></div> : null}
        </div>
      )}
      {g.phase === 'intro' && (
        <div class="arena-intro pop-in">
          <div class="intro-icon">{icon}</div>
          <h1>{title}</h1>
          <p>{howTo}</p>
          {keys && <div class="intro-keys">{keys.map((k) => <kbd key={k}>{k}</kbd>)}</div>}
          <button class="arena-btn" onClick={() => { sfx.click(); g.start(); }}>▶ {tr('JOUER', 'PLAY')} <small>{tr('(Espace)', '(Space)')}</small></button>
        </div>
      )}
      {g.phase === 'count' && <div class="arena-count" key={st.count}>{st.count > 0 ? st.count : tr('GO !', 'GO!')}</div>}
      {g.phase === 'done' && st.result && gr && (
        <div class="arena-result">
          <div class="res-grade" style={{ color: gr.color, textShadow: `0 0 30px ${gr.color}` }}>{gr.g}</div>
          <div class="res-label" style={{ color: gr.color }}>{tr(gr.fr, gr.en)}</div>
          <div class="res-pct">{Math.round(st.result.s * 100)}%</div>
          <div class="res-stars">{[0.3, 0.6, 0.9].map((t, i) => <span key={i} class={st.result!.s >= t ? 'on' : ''} style={{ animationDelay: `${0.3 + i * 0.25}s` }}>★</span>)}</div>
          {st.result.stats.length > 0 && <div class="res-stats">{st.result.stats.map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}</div>}
          <button class="arena-btn" onClick={() => st.onDone(st.result!.s, st.result!.extra)}>{tr('CONTINUER', 'CONTINUE')} <small>{tr('(Espace)', '(Space)')}</small></button>
        </div>
      )}
    </div>
  );
}

// Small helpers for canvas games
export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export function glow(ctx: CanvasRenderingContext2D, color: string, blur = 16) { ctx.shadowColor = color; ctx.shadowBlur = blur; }
export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
