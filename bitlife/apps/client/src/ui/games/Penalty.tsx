// Penalty shootout: night stadium with a living tifo, floodlights, a goal in real perspective and
// Gégé « Le Mur », a mulleted keeper who talks way too much. 5 shots, then 2 saves in goal.
import { useRef } from 'preact/hooks';
import { useGame, useCanvas, useKeys, Arena, tr, glow, rand, clamp01, roundRect, type GameProps } from './kit.tsx';
import { synth } from '../../audio.ts';

type Stage = 'ready' | 'aim' | 'charge' | 'shot' | 'after' | 'kready' | 'krun' | 'kafter' | 'over';
type Outcome = 'goal' | 'save' | 'post' | 'bar' | 'over' | 'wide';
type Mood = 'taunt' | 'lean' | 'dive' | 'celebrate' | 'dejected' | 'ready';
interface Shot { tx: number; ty: number; F: number; curl: number; arc: number; out: Outcome; q: 'perfect' | 'good' | 'weak' | 'over'; dx: number; dy: number; stay: boolean }
interface Conf { x: number; y: number; vx: number; vy: number; rot: number; vr: number; c: string; life: number; sz: number }
interface Pose { x: number; y: number; rot: number; armL: number; armR: number; legs: number; crouch: number; eye: number }
interface View { w: number; h: number; cx: number; y0: number; gw: number; gh: number; vY: number }

const D = 17, SPOT = 11, RB = 0.05, KICK = 0.3, RUN = 1.5;
const FONT = 'Fredoka Variable, sans-serif';
const CONF_COL = ['#ffd166', '#ff2d95', '#22d3ee', '#ffffff', '#a3e635', '#c084fc'];
const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const easeOut = (k: number) => 1 - (1 - k) * (1 - k);

function view(w: number, h: number): View {
  const gw = Math.min(w * 0.5, h * 0.82), gh = gw * 0.33, y0 = h * 0.55;
  return { w, h, cx: w / 2, y0, gw, gh, vY: y0 - 0.7 * gh };
}
/** World → screen. x in goal half-widths, hh in goal heights, d = metres in front of the goal line. */
function proj(v: View, x: number, hh: number, d: number) {
  const s = D / Math.max(0.6, D - d);
  return { x: v.cx + (x * v.gw / 2) * s, y: v.vY + (v.y0 - v.vY) * s - hh * v.gh * s, s };
}

const TAUNTS: [string, string][] = [
  ['Tu tires comme tu conduis : mal.', 'You shoot like you drive: badly.'],
  ['Ma mamie arrête ça avec son déambulateur.', 'My nan saves that with her walker.'],
  ['Vas-y chouchou, fais-toi plaisir.', 'Go on sweetie, treat yourself.'],
  ['Je sens ta peur d\'ici. Et ta sueur.', 'I can smell your fear. And your sweat.'],
  ['T\'as les jambes en mousse ?', 'Got foam legs, mate?'],
  ['Ta mère est en tribune. Elle me soutient.', 'Your mum\'s in the stands. Cheering for me.'],
  ['J\'ai arrêté un penalty avec ma moustache.', 'I once saved a penalty with my moustache.'],
  ['Allez, tire. J\'ai un kebab qui refroidit.', 'Shoot already. My kebab\'s getting cold.'],
];
const SAVE_TXT: [string, string][] = [['TROP FACILE !', 'TOO EASY!'], ['Rentre chez toi !', 'Go home!'], ['Merci pour la passe !', 'Thanks for the pass!'], ['LE MUR, BÉBÉ !', 'THE WALL, BABY!']];
const MISS_TXT: [string, string][] = [['HAHAHA ! La lune !', 'HAHAHA! Hit the moon!'], ['Même pas besoin de plonger.', 'Didn\'t even need to dive.'], ['Belle frappe… pour le rugby.', 'Nice kick… for rugby.']];
const GOAL_TXT: [string, string][] = [['C\'était hors-jeu !!', 'That was offside!!'], ['J\'avais le soleil dans les yeux.', 'Sun was in my eyes.'], ['…je démissionne.', '…I quit.'], ['VAR ! VAAAR !', 'VAR! VAAAR!']];

// ─── tifo mask cache ───
const maskCache = new Map<string, Uint8Array>();
function tifoMask(text: string, cols: number, rows: number): Uint8Array | null {
  const key = `${text}|${cols}|${rows}`;
  const hit = maskCache.get(key);
  if (hit) return hit;
  try {
    const c = document.createElement('canvas'); c.width = cols; c.height = rows;
    const x = c.getContext('2d', { willReadFrequently: true }); if (!x) return null;
    let fs = rows * 0.8;
    x.font = `900 ${fs}px ${FONT}`;
    const mw = x.measureText(text).width;
    if (mw > cols * 0.94) fs *= (cols * 0.94) / mw;
    x.font = `900 ${fs}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff';
    x.fillText(text, cols / 2, rows / 2 + fs * 0.06);
    const d = x.getImageData(0, 0, cols, rows).data;
    const m = new Uint8Array(cols * rows);
    for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 110 ? 1 : 0;
    if (maskCache.size > 20) maskCache.clear();
    maskCache.set(key, m);
    return m;
  } catch { return null; }
}
const PAL = [
  ['#1a0618', '#3d0b33', '#6b1052', '#a8186f', '#ff2d95', '#ff8cc8'], // pink
  ['#0c0620', '#190d38', '#2a1558', '#3f2184', '#6236c2', '#9b74ef'], // purple
  ['#2a1c00', '#6b4a00', '#b07800', '#f0a800', '#ffd166', '#fff3c4'], // gold
  ['#202024', '#4a4a55', '#7d7d8c', '#b4b4c4', '#e6e6f0', '#ffffff'], // white
  ['#00161c', '#003a48', '#00687e', '#0aa3c2', '#22d3ee', '#a5f3fc'], // cyan
];
const buckets: number[][] = PAL.flat().map(() => []);
const hash = (a: number, b: number) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

// ─── sounds ───
const snd = {
  whistle: () => { synth.tone(2750, 0.12, 'sine', 0.05); synth.tone(2850, 0.32, 'sine', 0.05, 0.16); },
  kick: () => { synth.kick(); synth.noise(0.06, 0.35, 700); },
  roar: (k = 1) => { synth.noise(2.8, 0.3 * k, 300); synth.noise(2.2, 0.17 * k, 850, 0.05); synth.noise(1.5, 0.08 * k, 2400, 0.15); },
  horn: () => { [233, 294, 349].forEach((f, i) => synth.tone(f, 0.9, 'sawtooth', 0.03, i * 0.02)); },
  ooh: () => { synth.noise(1.4, 0.13, 240); synth.tone(330, 0.9, 'triangle', 0.035, 0, 0.55); },
  post: () => { synth.tone(1180, 0.8, 'square', 0.04, 0, 0.97); synth.tone(1770, 1, 'sine', 0.07); synth.tone(590, 0.6, 'triangle', 0.06); },
  net: () => synth.noise(0.45, 0.2, 2600),
  glove: () => { synth.noise(0.1, 0.4, 500); synth.tone(120, 0.15, 'sine', 0.3, 0, 0.5); },
  thump: (v = 0.12) => synth.tone(62, 0.12, 'sine', v, 0, 0.6),
  bounce: () => synth.tone(140, 0.08, 'sine', 0.15, 0, 0.7),
  murmur: (k: number) => synth.noise(0.9, 0.012 + k * 0.025, 280 + Math.random() * 260),
  tooth: () => { synth.tone(1500, 0.06, 'square', 0.04); synth.tone(600, 0.25, 'sawtooth', 0.04, 0.05, 1.8); },
};

function newState() {
  return {
    W: 800, H: 500, stage: 'ready' as Stage, st: 0, round: 0, t: 0,
    aimX: 0.45, aimY: 0.55, swX: 0, swY: 0, keys: new Set<string>(), usedMouse: false,
    power: 0, pdir: 1, beatT: 0, sweetLo: 0.64, sweetHi: 0.82,
    commit: 1, tell: 1, shot: null as Shot | null, sc: 0, kicked: false, arrived: false,
    ball: { x: 0, h: RB, d: SPOT, vx: 0, vh: 0, vd: 0, spin: 0, live: false, gone: false, held: false },
    trail: [] as { x: number; y: number; r: number }[],
    k: { mood: 'ready' as Mood, mt: 0, from: { x: 0, y: 0.36, rot: 0 }, to: { x: 0, y: 0.36, rot: 0 }, diveAt: 99, diveDur: 0.3, base: 0 },
    pose: { x: 0, y: 0.36, rot: 0, armL: 0.4, armR: 0.4, legs: 0.15, crouch: 0, eye: 0 } as Pose,
    results: [] as Outcome[], keeps: [] as boolean[],
    conf: [] as Conf[], banner: null as null | { txt: string; sub: string; col: string; t: number },
    bubble: null as null | { txt: string; t: number },
    shake: 0, zoom: 1, slow: 1, postWob: 0, postX: 0, net: { x: 0, h: 0, a: 0, t: 9 },
    tifo: '', tifoMode: 'name' as 'name' | 'goal' | 'boo' | 'save', flashes: [] as { x: number; y: number; t: number }[], hype: 0.3, murT: 0, strobe: 0,
    goals: 0, perfects: 0, saves: 0, wood: 0, teeth: 0,
    ballDir: 0, sTell: 0, pdive: null as null | { dir: number; at: number }, early: false,
    teethFx: [] as { x: number; y: number; vx: number; vy: number; r: number; t: number }[],
    ended: false, inited: false,
  };
}
type S = ReturnType<typeof newState>;

export function Penalty({ onDone, l }: GameProps) {
  const g = useGame({ onDone });
  const s = useRef<S>(newState());
  const first = (l?.first || 'Toi').toUpperCase().slice(0, 12);

  const startShot = (st: S) => {
    st.stage = 'ready'; st.st = 0; st.sc = 0; st.kicked = false; st.arrived = false; st.shot = null; st.trail = []; st.zoom = 1; st.slow = 1;
    st.ball = { x: 0, h: RB, d: SPOT, vx: 0, vh: 0, vd: 0, spin: 0, live: false, gone: false, held: false };
    st.k.mood = 'ready'; st.k.mt = 0; st.k.base = 0; st.k.diveAt = 99;
    st.commit = Math.random() < 0.15 ? 0 : Math.random() < 0.5 ? -1 : 1;
    st.tell = st.commit === 0 ? 0 : Math.random() < 0.25 ? -st.commit : st.commit;
    st.sweetHi = 0.84 - st.round * 0.012; st.sweetLo = st.sweetHi - (0.18 - st.round * 0.02);
    const tt = pick(TAUNTS); st.bubble = { txt: tr(tt[0], tt[1]), t: 0 };
    st.tifo = tr(`ALLEZ ${first}`, `GO ${first}`); st.tifoMode = 'name';
    st.banner = { txt: tr(`TIR ${st.round + 1}/5`, `SHOT ${st.round + 1}/5`), sub: st.round === 4 ? tr('Le dernier. Pas de pression.', 'Last one. No pressure.') : '', col: '#ffffff', t: 0 };
  };
  const startKeep = (st: S) => {
    st.stage = 'kready'; st.st = 0; st.sc = 0; st.kicked = false; st.arrived = false; st.trail = []; st.zoom = 1; st.slow = 1; st.pdive = null; st.early = false;
    st.ball = { x: 0, h: RB, d: SPOT, vx: 0, vh: 0, vd: 0, spin: 0, live: false, gone: false, held: false };
    st.k.mood = 'ready'; st.k.mt = 0; st.k.base = 0; st.k.diveAt = 99; st.bubble = null;
    st.ballDir = Math.random() < 0.2 ? 0 : Math.random() < 0.5 ? -1 : 1;
    st.sTell = Math.random() < 0.78 ? st.ballDir : pick([-1, 0, 1].filter((d) => d !== st.ballDir));
    st.shot = { tx: st.ballDir === 0 ? rand(-0.15, 0.15) : st.ballDir * rand(0.45, 0.85), ty: rand(0.12, 0.7), F: 0.55, curl: rand(-0.3, 0.3), arc: 0.03, out: 'goal', q: 'good', dx: 0, dy: 0, stay: false };
    st.tifo = tr('LE MUR', 'THE WALL'); st.tifoMode = 'save';
    const k = st.keeps.length;
    st.banner = { txt: k === 0 ? tr('À TOI DE GARDER !', 'YOUR TURN IN GOAL!') : tr('DERNIER ARRÊT', 'LAST SAVE'), sub: k === 0 ? tr('Clique gauche / centre / droite (ou ← ↓ →) quand le cercle se ferme', 'Click left / centre / right (or ← ↓ →) as the ring closes') : '', col: '#22d3ee', t: 0 };
  };

  // ─── input ───
  const toLocal = (e: PointerEvent) => {
    const c = canvas.current; if (!c) return null;
    const r = c.getBoundingClientRect(); if (!r.width) return null;
    return { x: ((e.clientX - r.left) / r.width) * s.current.W, y: ((e.clientY - r.top) / r.height) * s.current.H };
  };
  const aimAt = (p: { x: number; y: number }) => {
    const st = s.current, v = view(st.W, st.H);
    st.aimX = Math.max(-1.45, Math.min(1.45, (p.x - v.cx) / (v.gw / 2)));
    st.aimY = Math.max(0.02, Math.min(1.6, (v.y0 - p.y) / v.gh));
    st.usedMouse = true;
  };
  const press = () => {
    const st = s.current;
    if (g.phase !== 'play') return;
    if (st.stage === 'aim') { st.stage = 'charge'; st.power = 0; st.pdir = 1; st.beatT = 0; st.k.mood = 'lean'; synth.noise(1.6, 0.05, 380); st.bubble = null; }
  };
  const keeperDive = (dir: number) => {
    const st = s.current;
    if (g.phase !== 'play' || st.stage !== 'krun' || st.pdive || st.arrived) return;
    st.pdive = { dir, at: st.sc };
    if (st.sc < RUN - 0.22) st.early = true;
    const sh = st.shot!;
    const correct = dir === st.ballDir && !st.early;
    const tx = correct ? sh.tx : dir === 0 ? 0 : dir * 0.62, ty = correct ? sh.ty : dir === 0 ? 0.45 : 0.4;
    setDive(st, tx, ty, dir === 0 && !correct, st.sc, Math.max(0.2, Math.min(0.42, RUN + sh.F - st.sc)));
    synth.noise(0.2, 0.1, 600);
  };
  const release = () => {
    const st = s.current;
    if (g.phase !== 'play' || st.stage !== 'charge') return;
    const p = st.power;
    let tx = st.aimX + st.swX, ty = st.aimY + st.swY, F = 0.5, arc = 0.04;
    let q: Shot['q'];
    if (p >= st.sweetLo && p <= st.sweetHi) { q = 'perfect'; F = 0.4; tx += rand(-0.025, 0.025); ty += rand(-0.025, 0.025); }
    else if (p > st.sweetHi) { const o = (p - st.sweetHi) / (1 - st.sweetHi); q = o > 0.3 ? 'over' : 'good'; F = 0.45; ty += o * 0.95 + rand(0, 0.25) * o; tx += rand(-1, 1) * o * 0.4; }
    else { const u = (st.sweetLo - p) / st.sweetLo; q = u > 0.4 ? 'weak' : 'good'; F = 0.5 + u * 0.55; tx += rand(-1, 1) * u * 0.14; ty *= 1 - u * 0.7; arc = 0; }
    ty = Math.max(RB, ty);
    const ax = Math.abs(tx);
    let out: Outcome = ty > 1.07 ? 'over' : ax > 1.06 ? 'wide' : ax >= 0.95 ? 'post' : ty >= 0.95 ? 'bar' : 'goal';
    const react = Math.random() < (q === 'perfect' ? 0.1 : 0.16 + (F - 0.42) * 1.4 + st.round * 0.03);
    let dx: number, dy: number, stay = false;
    if (react) { dx = Math.max(-0.8, Math.min(0.8, tx)); dy = Math.max(0.08, Math.min(0.8, ty)); }
    else if (st.commit === 0) { dx = 0; dy = 0.45; stay = true; }
    else { dx = st.commit * 0.62; dy = rand(0.25, 0.6); }
    if (out === 'goal') {
      let saved: boolean;
      if (react) saved = Math.hypot((tx - dx) * 1.4, ty - dy) < 0.13;
      else if (stay) saved = ax < 0.3 && ty < 0.8;
      else saved = Math.sign(tx) === st.commit && Math.hypot((tx - dx) * 1.4, ty - dy) < 0.42;
      if (saved) { out = 'save'; if (!stay) { dx = tx; dy = ty; } }
    }
    const curl = (q === 'perfect' ? rand(0.35, 0.6) : rand(0.08, 0.3)) * (tx >= 0 ? -1 : 1);
    st.shot = { tx, ty, F, curl, arc, out, q, dx, dy, stay };
    st.stage = 'shot'; st.sc = 0;
    const diveAt = react ? KICK + 0.1 : KICK - 0.07;
    st.k.diveAt = diveAt; st.k.diveDur = Math.max(0.16, KICK + F - diveAt);
  };
  const setDive = (st: S, tx: number, ty: number, stay: boolean, at: number, dur: number) => {
    const v = view(st.W, st.H), P = st.pose;
    st.k.from = { x: P.x, y: P.y, rot: P.rot };
    if (stay) st.k.to = { x: P.x, y: 0.5, rot: 0 };
    else {
      const T = proj(v, tx, ty, 0), Sx = proj(v, P.x, 0, 0).x, Sy = v.y0 - 0.62 * v.gh;
      const th = Math.max(-1.5, Math.min(1.5, Math.atan2(T.x - Sx, Sy - T.y)));
      const reach = 0.58 * v.gh;
      const hx = T.x - Math.sin(th) * reach, hy = Math.min(v.y0 - 0.05 * v.gh, T.y + Math.cos(th) * reach);
      st.k.to = { x: (hx - v.cx) / (v.gw / 2), y: (v.y0 - hy) / v.gh, rot: th };
    }
    st.k.diveAt = at; st.k.diveDur = dur; st.k.mood = 'dive'; st.k.mt = 0;
  };

  useKeys((e) => {
    const st = s.current;
    st.keys.add(e.code);
    if (e.repeat) return;
    if (st.stage === 'krun') {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') keeperDive(-1);
      else if (e.code === 'ArrowRight' || e.code === 'KeyD') keeperDive(1);
      else if (e.code === 'ArrowDown' || e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyS') keeperDive(0);
      return;
    }
    if (e.code === 'Space' || e.code === 'Enter') press();
  }, (e) => { s.current.keys.delete(e.code); if (e.code === 'Space' || e.code === 'Enter') release(); });

  const onDown = (e: PointerEvent) => {
    const st = s.current, p = toLocal(e); if (!p) return;
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* ignore */ }
    if (st.stage === 'krun') { const v = view(st.W, st.H); keeperDive(p.x < v.cx - v.gw / 6 ? -1 : p.x > v.cx + v.gw / 6 ? 1 : 0); return; }
    if (st.stage === 'aim' || st.stage === 'ready') aimAt(p);
    press();
  };
  const onMove = (e: PointerEvent) => { const st = s.current; if (st.stage === 'aim' || st.stage === 'charge' || st.stage === 'ready') { const p = toLocal(e); if (p) aimAt(p); } };
  const onUp = () => release();

  const canvas = useCanvas((ctx, w, h, dtRaw) => {
    const st = s.current;
    st.W = w; st.H = h;
    const v = view(w, h);
    const playing = g.phase === 'play';
    if (!st.inited) { st.inited = true; startShot(st); st.banner = null; }
    const dt = dtRaw * st.slow;
    st.t += dtRaw;
    try {
      if (playing && !st.ended) update(st, v, dt, dtRaw);
    } catch { /* never throw from the loop */ }
    render(ctx, st, v, dtRaw, playing);
  }, true);

  function confetti(st: S, n: number, w: number) {
    for (let i = 0; i < n; i++) st.conf.push({ x: rand(0, w), y: rand(-80, -10), vx: rand(-60, 60), vy: rand(60, 220), rot: rand(0, 6), vr: rand(-8, 8), c: pick(CONF_COL), life: rand(2, 3.4), sz: rand(5, 10) });
    for (const side of [0, 1]) for (let i = 0; i < n / 3; i++) { const a = side ? rand(-2.6, -2.0) : rand(-1.1, -0.5); const sp = rand(380, 700); st.conf.push({ x: side ? w : 0, y: st.H * 0.75, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, rot: 0, vr: rand(-10, 10), c: pick(CONF_COL), life: rand(1.8, 3), sz: rand(5, 10) }); }
  }

  function resolveShot(st: S, v: View) {
    const sh = st.shot!; const b = st.ball;
    st.arrived = true;
    b.vx = (sh.tx - 0.35 * Math.PI * sh.curl * 0.6) / sh.F; b.vh = (sh.ty - sh.arc * Math.PI) / sh.F; b.vd = -SPOT / sh.F; b.live = true;
    const keepMode = st.round >= 5;
    const top = sh.ty > 0.72 && Math.abs(sh.tx) > 0.78;
    if (sh.out === 'goal') {
      st.shake = 1; st.strobe = 1.6; st.hype = 1; st.net = { x: sh.tx, h: sh.ty, a: 1, t: 0 };
      snd.net(); snd.roar(1.1); snd.horn();
      confetti(st, 90, v.w);
      st.tifo = keepMode ? tr('NOOON', 'NOOO') : tr('BUUUT', 'GOAL'); st.tifoMode = keepMode ? 'boo' : 'goal';
      if (!keepMode) {
        st.goals++; if (sh.q === 'perfect') st.perfects++;
        g.hit(sh.q === 'perfect' ? 'perfect' : 'good'); g.add(sh.q === 'perfect' ? 1500 : 1000); g.flash('#ffd166'); g.shake();
        const sub = top ? tr('LUCARNE, MAMAN ! 🎯', 'TOP BINS, MUM! 🎯') : sh.q === 'perfect' ? tr('Frappe de mule. Gégé a vu Dieu.', 'Mule kick. Gégé saw God.') : Math.abs(sh.tx) < 0.3 ? tr('Plein axe, Gégé avait plongé…', 'Dead centre, Gégé had dived…') : tr('Petit filet ! Gégé mange la pelouse.', 'Side netting! Gégé eats grass.');
        st.banner = { txt: tr('BUUUUUT !', 'GOOOAAAL!'), sub, col: '#ffd166', t: 0 };
        st.results.push('goal');
        const gt = pick(GOAL_TXT); st.bubble = { txt: tr(gt[0], gt[1]), t: -0.8 };
      } else {
        st.keeps.push(false); g.miss(); g.flash('#ff4d6d');
        const sub = st.early ? tr('Trop tôt ! Il t\'a vu venir 🤡', 'Too early! He saw you coming 🤡') : !st.pdive ? tr('Statue de sel. Bravo l\'artiste.', 'Statue mode. Bravo.') : tr('Tu as plongé… vers la buvette.', 'You dove… towards the snack bar.');
        st.banner = { txt: tr('BUT ENCAISSÉ', 'CONCEDED'), sub, col: '#ff4d6d', t: 0 };
      }
      st.k.mood = 'dejected'; st.k.mt = 0;
    } else if (sh.out === 'save') {
      snd.glove(); snd.ooh(); st.shake = 0.7;
      st.zoom = 1.02;
      if (sh.q === 'weak' && !keepMode) { b.held = true; b.live = false; }
      else { b.vd = rand(4, 7); b.vx = (Math.sign(sh.tx) || pick([-1, 1])) * rand(0.9, 1.7); b.vh = rand(0.6, 1.6); }
      if (!keepMode) {
        st.results.push('save'); g.miss(tr('ARRÊTÉ', 'SAVED'), 50, 30); st.tifo = tr('OUH', 'BOO'); st.tifoMode = 'boo';
        st.banner = { txt: tr('ARRÊTÉ !', 'SAVED!'), sub: sh.q === 'weak' ? tr('Une passe au gardien. Trop gentil.', 'A back-pass to the keeper. So kind.') : tr('Gégé te fait un clin d\'œil 😘', 'Gégé winks at you 😘'), col: '#ff4d6d', t: 0 };
        const tx = pick(SAVE_TXT); st.bubble = { txt: tr(tx[0], tx[1]), t: -0.9 };
      } else {
        st.keeps.push(true); st.saves++; g.hit('perfect'); g.add(1200); g.flash('#22d3ee'); g.shake();
        snd.roar(0.9); confetti(st, 50, v.w); st.strobe = 1;
        st.tifo = tr('LE MUR', 'THE WALL'); st.tifoMode = 'goal';
        st.banner = { txt: tr('ARRÊT DE MALADE !', 'INSANE SAVE!'), sub: tr('Mains de velours 🧤', 'Velvet gloves 🧤'), col: '#22d3ee', t: 0 };
      }
      st.k.mt = 0;
    } else if (sh.out === 'post' || sh.out === 'bar') {
      snd.post(); snd.ooh(); st.shake = 0.8; st.postWob = 1; st.postX = sh.out === 'post' ? Math.sign(sh.tx) : 0; st.wood++;
      b.vd = rand(3, 6); b.vx = sh.out === 'post' ? Math.sign(sh.tx) * rand(0.6, 1.3) : rand(-0.4, 0.4); b.vh = sh.out === 'bar' ? rand(1.2, 2.2) : rand(0.2, 1);
      st.results.push(sh.out); g.miss(); st.tifo = 'OHHH'; st.tifoMode = 'boo';
      st.banner = { txt: sh.out === 'post' ? tr('POTEAU !', 'POST!') : tr('TRANSVERSALE !', 'CROSSBAR!'), sub: tr('Toinnng. Le bruit de tes rêves qui se brisent.', 'Toinnng. The sound of your dreams breaking.'), col: '#ff9f1c', t: 0 };
      const mt = pick(MISS_TXT); st.bubble = { txt: tr(mt[0], mt[1]), t: -1 };
    } else {
      // over / wide: the ball keeps flying into the crowd
      snd.ooh(); st.results.push(sh.out); g.miss(); st.tifo = sh.out === 'over' ? 'LOL' : tr('NUL', 'BOO'); st.tifoMode = 'boo';
      st.banner = sh.out === 'over'
        ? { txt: tr('DANS LA TRIBUNE !', 'INTO THE STANDS!'), sub: '', col: '#ff4d6d', t: 0 }
        : { txt: tr('À CÔTÉ !', 'WIDE!'), sub: pick([tr('Même la mascotte rigole.', 'Even the mascot is laughing.'), tr('Le poteau de corner t\'en veut.', 'The corner flag is offended.')]), col: '#ff4d6d', t: 0 };
      const mt = pick(MISS_TXT); st.bubble = { txt: tr(mt[0], mt[1]), t: -1.2 };
    }
  }

  function update(st: S, v: View, dt: number, dtRaw: number) {
    st.st += dt;
    st.k.mt += dt;
    // ambient crowd
    st.murT -= dtRaw;
    if (st.murT <= 0) { st.murT = 0.55; snd.murmur(st.hype); }
    st.hype = Math.max(0.25, st.hype - dtRaw * 0.12);
    if (st.stage === 'ready') {
      if (st.st > 0.25 && st.st - dt <= 0.25) snd.whistle();
      if (st.st > 0.6) { st.stage = 'aim'; st.st = 0; st.k.mood = 'taunt'; st.k.mt = 0; }
    }
    if (st.stage === 'aim' || st.stage === 'charge' || st.stage === 'ready') {
      const k = st.keys, sp = 1.3 * dtRaw;
      if (k.has('ArrowLeft') || k.has('KeyA') || k.has('KeyQ')) st.aimX -= sp;
      if (k.has('ArrowRight') || k.has('KeyD')) st.aimX += sp;
      if (k.has('ArrowUp') || k.has('KeyW') || k.has('KeyZ')) st.aimY += sp * 0.8;
      if (k.has('ArrowDown') || k.has('KeyS')) st.aimY -= sp * 0.8;
      st.aimX = Math.max(-1.45, Math.min(1.45, st.aimX)); st.aimY = Math.max(0.02, Math.min(1.6, st.aimY));
      const sw = 0.022 + st.round * 0.006 + (st.stage === 'charge' ? 0.02 + st.power * 0.03 : 0);
      st.swX = (Math.sin(st.t * 1.9) + Math.sin(st.t * 3.7) * 0.5) * sw; st.swY = Math.cos(st.t * 2.3) * sw * 0.8;
    }
    if (st.stage === 'charge') {
      const speed = 1.15 + st.round * 0.12;
      st.power += st.pdir * dtRaw * speed;
      if (st.power >= 1) { st.power = 1; st.pdir = -1; } else if (st.power <= 0) { st.power = 0; st.pdir = 1; }
      st.beatT -= dtRaw;
      if (st.beatT <= 0) { st.beatT = 0.5 - st.power * 0.25; snd.thump(0.08 + st.power * 0.1); }
    }
    if (st.stage === 'shot' || st.stage === 'krun') {
      st.sc += dt;
      const kickAt = st.stage === 'shot' ? KICK : RUN;
      const sh = st.shot;
      // striker tell / early dive punishment at the kick
      if (sh && !st.kicked && st.sc >= kickAt) {
        st.kicked = true; snd.kick(); st.shake = Math.max(st.shake, 0.25); st.hype = Math.max(st.hype, 0.7);
        if (st.stage === 'krun') {
          if (st.early && st.pdive && st.pdive.dir === st.ballDir) {
            st.ballDir = st.ballDir === 0 ? pick([-1, 1]) : -st.ballDir;
            sh.tx = st.ballDir === 0 ? rand(-0.15, 0.15) : st.ballDir * rand(0.5, 0.85);
          }
          sh.curl = sh.tx >= 0 ? -0.25 : 0.25;
        }
      }
      if (st.stage === 'shot' && st.k.mood !== 'dive' && st.sc >= st.k.diveAt && sh) setDive(st, sh.dx, sh.dy, sh.stay, st.k.diveAt, st.k.diveDur);
      if (sh && st.kicked && !st.arrived) {
        const u = clamp01((st.sc - kickAt) / sh.F);
        const b = st.ball;
        b.d = SPOT * (1 - u); b.x = sh.tx * u + sh.curl * Math.sin(Math.PI * u) * 0.35; b.h = Math.max(RB, sh.ty * u + sh.arc * Math.sin(Math.PI * u)); b.spin += dt * 30;
        const close = sh.q === 'perfect' || (st.stage === 'krun' && st.pdive && st.pdive.dir === st.ballDir && !st.early);
        st.slow = close && u > 0.55 && u < 0.97 ? 0.3 : 1;
        if (close) st.zoom = lerp(st.zoom, 1.16, dtRaw * 4);
        if (u >= 1) {
          if (st.stage === 'krun') {
            const ok = !!st.pdive && !st.early && st.pdive.dir === st.ballDir && st.pdive.at <= kickAt + sh.F - 0.08;
            sh.out = ok ? 'save' : 'goal';
          }
          st.slow = 1;
          resolveShot(st, v);
          st.stage = st.stage === 'shot' ? 'after' : 'kafter'; st.st = 0;
        }
      }
    }
    if (st.stage === 'kready' && st.st > (st.keeps.length === 0 ? 1.9 : 1.1)) { st.stage = 'krun'; st.st = 0; st.sc = 0; snd.whistle(); }
    if (st.stage === 'after' || st.stage === 'kafter') {
      st.zoom = lerp(st.zoom, 1, dtRaw * 2);
      const sh = st.shot;
      if (sh && st.st > 0.7 && st.k.mood !== 'celebrate' && st.k.mood !== 'dejected' && (sh.out !== 'goal')) {
        st.k.mood = 'celebrate'; st.k.mt = 0;
      }
      if (st.st > 2.4) {
        if (st.stage === 'after') { st.round++; if (st.round < 5) startShot(st); else startKeep(st); }
        else if (st.keeps.length < 2) startKeep(st);
        else { st.stage = 'over'; st.st = 0; }
      }
    }
    if (st.stage === 'over' && st.st > 0.6 && !st.ended) {
      st.ended = true;
      const sc = (st.goals / 5) * 0.72 + (st.saves / 2) * 0.2 + (st.perfects / 5) * 0.08;
      g.end(sc, [
        [tr('Buts', 'Goals'), `⚽ ${st.goals}/5`],
        [tr('Frappes parfaites', 'Perfect strikes'), String(st.perfects)],
        [tr('Arrêts', 'Saves'), `🧤 ${st.saves}/2`],
        [tr('Poteaux / barre', 'Woodwork'), String(st.wood)],
        [tr('Dents de supporters', 'Fans\' teeth lost'), `🦷 ${st.teeth}`],
      ]);
    }
    // free ball physics
    const b = st.ball;
    if (b.live && st.arrived) {
      b.x += b.vx * dt; b.d += b.vd * dt; b.h += b.vh * dt; b.vh -= 4 * dt; b.spin += dt * 12 * Math.sign(b.vx || 1);
      const sh = st.shot;
      if (sh?.out === 'goal' && b.d < -1.7) { b.d = -1.7; b.vd = 0; b.vx *= 0.3; b.vh = Math.min(0, b.vh); }
      if (b.h < RB) { b.h = RB; if (b.vh < -0.5) snd.bounce(); b.vh = -b.vh * 0.5; b.vx *= 0.85; b.vd *= 0.85; if (Math.abs(b.vh) < 0.2) b.vh = 0; }
      // ad boards and crowd
      if (b.d < -3.4 && b.d > -3.9 && b.h < 0.27 && b.vd < 0) { b.vd = -b.vd * 0.35; snd.bounce(); }
      const standH = 0.25 + (-b.d - 4) * 0.45;
      if (b.d < -4 && b.h < standH && !b.gone) {
        b.gone = true; b.live = false;
        const p = proj(v, b.x, b.h, b.d);
        st.teeth++; snd.tooth(); snd.ooh();
        st.flashes.push({ x: p.x, y: p.y, t: 0 }, { x: p.x + 8, y: p.y - 4, t: 0.05 });
        for (let i = 0; i < 2; i++) st.teethFx.push({ x: p.x, y: p.y, vx: rand(-90, 90), vy: rand(-260, -160), r: rand(0, 6), t: 0 });
        if (st.banner && sh?.out === 'over') st.banner.sub = pick([tr('Un supporter perd une dent 🦷', 'A fan just lost a tooth 🦷'), tr('Une bière renversée, un mariage annulé 🍺', 'A beer spilled, a wedding called off 🍺'), tr('Le ballon finit dans un sandwich 🥪', 'The ball landed in a sandwich 🥪')]);
        else if (st.banner) st.banner.sub = tr('Un supporter perd une dent 🦷', 'A fan just lost a tooth 🦷');
        g.float('🦷', (p.x / v.w) * 100, 20, '#fff', true);
      }
      if (b.d > 16) b.live = false;
    }
  }

  function keeperTarget(st: S, v: View, dt: number): Pose & { face: string; tongue: boolean } {
    const k = st.k, P = st.pose, t = st.t;
    let T: Pose = { x: k.base, y: 0.36, rot: 0, armL: 0.45, armR: 0.45, legs: 0.18, crouch: 0.2, eye: 0 };
    let face = 'smug', tongue = false, snap = 10;
    if (k.mood === 'taunt') {
      const cyc = Math.floor(t / 2.6) % 3;
      T.x = k.base + Math.sin(t * 1.6) * 0.12; T.y = 0.36 - Math.abs(Math.sin(t * 6)) * 0.02;
      if (cyc === 0) { T.armL = T.armR = 1.3 + Math.sin(t * 16) * 0.45; face = 'smug'; }
      else if (cyc === 1) { T.rot = Math.sin(t * 9) * 0.13; T.armL = 0.3 + Math.sin(t * 9) * 0.3; T.armR = 0.3 - Math.sin(t * 9) * 0.3; face = 'happy'; }
      else { T.armL = 2.2; T.armR = 2.2 + Math.sin(t * 7) * 0.3; tongue = true; face = 'smug'; }
    } else if (k.mood === 'lean') {
      T.x = k.base + st.tell * 0.08; T.rot = st.tell * 0.14; T.y = 0.32; T.crouch = 0.8; T.armL = T.armR = 0.75; T.eye = st.tell; face = 'focus';
    } else if (k.mood === 'dive') {
      const p = clamp01((k.mt) / k.diveDur), e = easeOut(p);
      const fall = clamp01((k.mt - k.diveDur - 0.12) / 0.3);
      const side = Math.abs(k.to.rot) > 0.35;
      T.x = lerp(k.from.x, k.to.x, e); T.y = lerp(k.from.y, k.to.y, e) + Math.sin(Math.PI * p) * 0.06; T.rot = lerp(k.from.rot, k.to.rot, e);
      if (side && fall > 0) { T.y = lerp(T.y, 0.08, easeOut(fall)); T.rot = lerp(T.rot, Math.sign(k.to.rot) * 1.5, fall); }
      if (!side && fall > 0) T.y = lerp(T.y, 0.36, fall);
      T.armL = T.armR = side || k.to.y > 0.45 ? 2.95 : 1.6; T.legs = 0.35; T.crouch = 0; face = 'shock'; snap = 100;
      // keep the pose exact (no smoothing) while flying
      Object.assign(P, T);
    } else if (k.mood === 'celebrate') {
      const mt = k.mt;
      T.x = P.x; T.y = 0.36 + Math.abs(Math.sin(mt * 9)) * 0.1; T.rot = Math.sin(mt * 9) * 0.06;
      T.armL = 2.7 + Math.sin(mt * 18) * 0.3; T.armR = 2.7 - Math.sin(mt * 18) * 0.3; face = 'happy'; tongue = Math.floor(mt * 2) % 2 === 0; snap = 8;
      k.base = P.x;
    } else if (k.mood === 'dejected') {
      T.x = P.x; T.rot = P.rot; T.y = 0.08; T.armL = 2.9; T.armR = 2.6 + Math.sin(k.mt * 14) * 0.35; face = 'sad';
      if (Math.abs(P.rot) < 0.5) { T.rot = (Math.sign(P.x) || 1) * 1.5; }
      snap = 6;
    } else if (k.mood === 'ready') {
      T.x = 0; T.y = 0.36; T.rot = 0; snap = 6;
    }
    if (k.mood !== 'dive') {
      const kk = Math.min(1, dt * snap);
      (Object.keys(T) as (keyof Pose)[]).forEach((key) => { P[key] = lerp(P[key], T[key], kk); });
    }
    void v;
    return { ...P, face, tongue };
  }

  function render(ctx: CanvasRenderingContext2D, st: S, v: View, dt: number, playing: boolean) {
    const { w, h, cx, y0, gw, gh } = v, t = st.t;
    const keepMode = st.stage === 'kready' || st.stage === 'krun' || st.stage === 'kafter' || (st.stage === 'over');
    ctx.save();
    // camera: zoom towards the goal + shake
    st.shake = Math.max(0, st.shake - dt * 2.2);
    const shx = (Math.random() - 0.5) * st.shake * 18, shy = (Math.random() - 0.5) * st.shake * 14;
    const fx = cx, fy = y0 - gh * 0.5;
    ctx.translate(fx + shx, fy + shy); ctx.scale(st.zoom, st.zoom); ctx.translate(-fx, -fy);
    // ─ sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
    sky.addColorStop(0, '#05030f'); sky.addColorStop(1, '#1b0c3a');
    ctx.fillStyle = sky; ctx.fillRect(-60, -60, w + 120, h + 120);
    // ─ stands (tifo mosaic)
    const bTop = proj(v, 0, 0.25, -3.5).y, bBot = proj(v, 0, 0, -3.5).y;
    const roofH = Math.max(18, bTop * 0.12);
    const cs = Math.max(5, Math.round(w / 165));
    const cols = Math.ceil((w + 40) / cs), rows = Math.max(1, Math.ceil((bTop - roofH) / cs));
    const mask = st.tifo ? tifoMask(st.tifo, cols, rows) : null;
    const wave = ((t * 32) % (cols + 40)) - 20;
    for (const bk of buckets) bk.length = 0;
    const blink = Math.floor(t * 6) % 2 === 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const n = hash(c, r);
      const i = r * cols + c;
      let pal: number, lv: number;
      if (mask && mask[i]) {
        pal = st.tifoMode === 'goal' ? (blink ? 2 : 3) : st.tifoMode === 'boo' ? 3 : st.tifoMode === 'save' ? 4 : 3;
        lv = n > 0.85 ? 5 : 4;
      } else {
        pal = st.tifoMode === 'goal' ? (((c >> 3) + (r >> 2) + Math.floor(t * 4)) % 2 ? 0 : 1) : ((c / 16) | 0) % 2 ? 0 : 1;
        lv = 1 + ((n * 2.2) | 0) + (Math.sin(c * 0.21 + r * 0.33 - t * 2.4) > 0.65 ? 1 : 0);
        if (mask) lv = Math.max(0, lv - 1);
        if (Math.abs(c - wave) < 2.5) lv = 4;
        if (n > 0.996 - st.hype * 0.006) { pal = 3; lv = 5; }
      }
      buckets[pal * 6 + Math.min(5, lv)].push(i);
    }
    const flat = PAL.flat();
    for (let bi = 0; bi < buckets.length; bi++) {
      const bk = buckets[bi]; if (!bk.length) continue;
      ctx.fillStyle = flat[bi]; ctx.beginPath();
      for (const i of bk) { const r = (i / cols) | 0, c = i - r * cols; ctx.rect(c * cs - 20, roofH + r * cs, cs - 1, cs - 1); }
      ctx.fill();
    }
    // tiers + depth haze
    ctx.fillStyle = 'rgba(0,0,0,.55)';
    for (let r = 8; r < rows; r += 9) ctx.fillRect(-60, roofH + r * cs - 1, w + 120, 2);
    const haze = ctx.createLinearGradient(0, roofH, 0, bTop);
    haze.addColorStop(0, 'rgba(5,3,15,.65)'); haze.addColorStop(0.6, 'rgba(5,3,15,.1)'); haze.addColorStop(1, 'rgba(40,20,80,.35)');
    ctx.fillStyle = haze; ctx.fillRect(-60, roofH, w + 120, bTop - roofH);
    // camera flashes in the crowd
    if (Math.random() < 0.15 + st.hype * 0.5) st.flashes.push({ x: rand(0, w), y: rand(roofH, bTop), t: 0 });
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = st.flashes.length - 1; i >= 0; i--) {
      const f = st.flashes[i]; f.t += dt; if (f.t > 0.25) { st.flashes.splice(i, 1); continue; }
      const a = 1 - f.t / 0.25, R = 14 * a + 2;
      const gr = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, R); gr.addColorStop(0, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gr; ctx.fillRect(f.x - R, f.y - R, R * 2, R * 2);
    }
    ctx.restore();
    // roof + floodlights
    ctx.fillStyle = '#07050d'; ctx.fillRect(-60, -60, w + 120, roofH + 60);
    ctx.strokeStyle = 'rgba(120,110,160,.25)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = -40; x < w + 40; x += 26) { ctx.moveTo(x, roofH); ctx.lineTo(x + 13, roofH * 0.35); ctx.lineTo(x + 26, roofH); }
    ctx.stroke();
    st.strobe = Math.max(0, st.strobe - dt);
    const lamps = [0.1, 0.34, 0.66, 0.9];
    lamps.forEach((lx, li) => {
      const x = lx * w, y = roofH * 0.45, pw = Math.max(40, w * 0.075), ph = Math.max(12, roofH * 0.6);
      const on = st.strobe > 0 ? (Math.floor(st.strobe * 14) + li) % 2 === 0 : true;
      ctx.fillStyle = '#1d1a26'; roundRect(ctx, x - pw / 2, y - ph / 2, pw, ph, 3); ctx.fill();
      for (let a = 0; a < 6; a++) for (let b2 = 0; b2 < 2; b2++) {
        ctx.fillStyle = on ? '#fffbe8' : '#6b6450';
        ctx.beginPath(); ctx.arc(x - pw / 2 + (a + 0.5) * pw / 6, y - ph / 2 + (b2 + 0.5) * ph / 2, Math.min(pw / 14, ph / 5), 0, Math.PI * 2); ctx.fill();
      }
      if (on) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const R = w * 0.16;
        const hg = ctx.createRadialGradient(x, y, 0, x, y, R); hg.addColorStop(0, 'rgba(255,250,220,.55)'); hg.addColorStop(0.25, 'rgba(200,220,255,.16)'); hg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = hg; ctx.fillRect(x - R, y - R, R * 2, R * 2);
        ctx.fillStyle = 'rgba(255,255,240,.35)'; ctx.fillRect(x - w * 0.12, y - 1, w * 0.24, 2);
        ctx.restore();
      }
    });
    // ad boards (LED)
    ctx.fillStyle = '#050208'; ctx.fillRect(-60, bTop, w + 120, bBot - bTop);
    const ads = st.tifoMode === 'goal' ? [tr('BUT ! BUT ! BUT ! ', 'GOAL! GOAL! GOAL! ')] : ['BITLIFE BET', 'KEBAB CHEZ MOMO', tr('CLINIQUE DU GENOU', 'KNEE CLINIC'), 'PMU DU COIN', tr('BIÈRE TIÈDE', 'WARM BEER'), tr('GÉGÉ = LÉGENDE', 'GÉGÉ = LEGEND')];
    const adCols = ['#22d3ee', '#ff2d95', '#ffd166', '#a3e635', '#ff9f1c', '#c084fc'];
    const fsz = Math.max(9, (bBot - bTop) * 0.62);
    ctx.font = `800 ${fsz}px ${FONT}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    let ax = -((t * 70) % (w * 0.8));
    let ai = 0;
    ctx.save(); ctx.beginPath(); ctx.rect(-60, bTop, w + 120, bBot - bTop); ctx.clip();
    while (ax < w + 60) {
      const txt = ads[ai % ads.length], col = st.tifoMode === 'goal' ? (blink ? '#ffd166' : '#fff') : adCols[ai % adCols.length];
      ctx.save(); glow(ctx, col, 10); ctx.fillStyle = col; ctx.fillText(txt, ax, (bTop + bBot) / 2 + 1); ctx.restore();
      ax += ctx.measureText(txt).width + fsz * 1.6; ai++;
    }
    ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let x = -60; x < w + 60; x += 3) ctx.fillRect(x, bTop, 1, bBot - bTop);
    ctx.restore();
    // ─ pitch
    const pg = ctx.createLinearGradient(0, bBot, 0, h);
    pg.addColorStop(0, '#0a3a1f'); pg.addColorStop(1, '#14692f');
    ctx.fillStyle = pg; ctx.fillRect(-60, bBot, w + 120, h - bBot + 60);
    for (let k = 0; k < 14; k++) {
      const d1 = -3.5 + k * 2.2, d2 = d1 + 2.2;
      if (k % 2) continue;
      const y1 = proj(v, 0, 0, d1).y, y2 = proj(v, 0, 0, Math.min(D - 0.7, d2)).y;
      if (y1 > h + 60) break;
      ctx.fillStyle = 'rgba(255,255,255,.045)'; ctx.fillRect(-60, y1, w + 120, Math.min(h + 60, y2) - y1);
    }
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const pool = ctx.createRadialGradient(cx, y0 + gh * 0.6, 0, cx, y0 + gh * 0.6, w * 0.55);
    pool.addColorStop(0, 'rgba(160,255,190,.14)'); pool.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = pool; ctx.fillRect(-60, bBot, w + 120, h);
    ctx.restore();
    // lines
    ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineCap = 'round';
    const line = (pts: [number, number][], lw: number) => { ctx.lineWidth = lw; ctx.beginPath(); pts.forEach(([x, d], i) => { const p = proj(v, x, 0, d); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke(); };
    line([[-12, 0], [12, 0]], 2);
    line([[-2.5, 0], [-2.5, 5.5], [2.5, 5.5], [2.5, 0]], 2.6);
    const spot = proj(v, 0, 0, SPOT);
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.ellipse(spot.x, spot.y, 6 * spot.s, 2.2 * spot.s, 0, 0, Math.PI * 2); ctx.fill();
    // ─ net (back, roof, sides) with bulge
    st.net.t += dt;
    const nb = st.net.a * Math.exp(-st.net.t * 3) * (0.6 + 0.4 * Math.cos(st.net.t * 18));
    const ND = -1.8;
    const netPt = (x: number, hh: number) => { const k = nb * Math.exp(-(((x - st.net.x) * 1.5) ** 2 + (hh - st.net.h) ** 2) / 0.08); return proj(v, x, hh, ND - k * 1.4); };
    ctx.strokeStyle = 'rgba(235,240,255,.32)'; ctx.lineWidth = 1;
    const NX = 22, NY = 8;
    for (let j = 0; j <= NY; j++) { ctx.beginPath(); for (let i = 0; i <= NX; i++) { const p = netPt(-1 + (2 * i) / NX, (0.86 * j) / NY); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); } ctx.stroke(); }
    for (let i = 0; i <= NX; i++) { ctx.beginPath(); for (let j = 0; j <= NY; j++) { const p = netPt(-1 + (2 * i) / NX, (0.86 * j) / NY); if (j) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); } ctx.stroke(); }
    // roof + side nets
    for (let i = 0; i <= NX; i += 2) { const x = -1 + (2 * i) / NX; const a = proj(v, x, 1, 0), b = netPt(x, 0.86); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    for (const sx of [-1, 1]) for (let j = 0; j <= 6; j++) { const hh = j / 6; const a = proj(v, sx, hh, 0), b = proj(v, sx, hh * 0.86, ND); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    for (let k = 1; k < 4; k++) { const d = (ND * k) / 4; ctx.beginPath(); const a = proj(v, -1, 0, d), b = proj(v, -1, 1 - 0.14 * k / 4, d), c = proj(v, 1, 1 - 0.14 * k / 4, d), e = proj(v, 1, 0, d); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(e.x, e.y); ctx.stroke(); }
    // ─ ball shadow + ball behind goal line
    const b = st.ball;
    const drawB = () => {
      if (b.gone || b.held) return;
      if (b.d > 15.5) return;
      const p = proj(v, b.x, b.h, b.d), sh = proj(v, b.x, 0, b.d), r = RB * gh * p.s;
      ctx.fillStyle = `rgba(0,0,0,${0.45 * Math.max(0, 1 - b.h * 1.5)})`; ctx.beginPath(); ctx.ellipse(sh.x, sh.y, r * 1.1, r * 0.35, 0, 0, Math.PI * 2); ctx.fill();
      // trail
      if (st.trail.length > 1) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
        for (let i = 1; i < st.trail.length; i++) { const a = st.trail[i - 1], c = st.trail[i], k = i / st.trail.length; ctx.strokeStyle = st.shot?.q === 'perfect' ? `rgba(255,209,102,${k * 0.6})` : `rgba(180,220,255,${k * 0.45})`; ctx.lineWidth = c.r * 1.6 * k; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke(); }
        ctx.restore();
      }
      drawBall(ctx, p.x, p.y, r, b.spin);
    };
    // trail sampling
    if (st.kicked && !b.gone && (b.live || !st.arrived)) { const p = proj(v, b.x, b.h, b.d); st.trail.push({ x: p.x, y: p.y, r: RB * gh * p.s }); if (st.trail.length > 14) st.trail.shift(); }
    else if (st.trail.length) st.trail.shift();
    if (b.d < 0) drawB();
    // ─ goal frame (with wobble)
    st.postWob = Math.max(0, st.postWob - dt * 1.5);
    const wob = Math.sin(t * 70) * st.postWob * 3;
    const pl = proj(v, -1, 0, 0), pr = proj(v, 1, 0, 0), tl = proj(v, -1, 1, 0), trr = proj(v, 1, 1, 0);
    ctx.save(); glow(ctx, '#ffffff', 14); ctx.strokeStyle = '#f4f6ff'; ctx.lineWidth = Math.max(3, gh * 0.05); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(pl.x + (st.postX < 0 ? wob : 0), pl.y); ctx.lineTo(tl.x + wob * (st.postX <= 0 ? 1 : 0.3), tl.y + (st.postX === 0 ? wob : 0)); ctx.lineTo(trr.x + wob * (st.postX >= 0 ? 1 : 0.3), trr.y + (st.postX === 0 ? wob : 0)); ctx.lineTo(pr.x + (st.postX > 0 ? wob : 0), pr.y); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = Math.max(1, gh * 0.012); ctx.beginPath(); ctx.moveTo(pl.x + gh * 0.015, pl.y); ctx.lineTo(tl.x + gh * 0.015, tl.y + gh * 0.02); ctx.lineTo(trr.x - gh * 0.015, trr.y + gh * 0.02); ctx.lineTo(pr.x - gh * 0.015, pr.y); ctx.stroke();
    // ─ keeper
    const kp = keeperTarget(st, v, dt);
    const hip = proj(v, kp.x, kp.y, 0.15);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(proj(v, kp.x, 0, 0.15).x, y0 + 2, gh * 0.22, gh * 0.04, 0, 0, Math.PI * 2); ctx.fill();
    const kCols = keepMode ? { jersey: '#22d3ee', stripe: '#0b3d66', glove: '#ffd166', hair: '#f4c542', mus: false } : { jersey: '#c6ff00', stripe: '#141414', glove: '#ff2d95', hair: '#5a2d0c', mus: true };
    drawKeeper(ctx, hip.x, hip.y, gh, kp, kp.face, kp.tongue, kCols, t);
    if (st.ball.held) { const hand = { x: hip.x + Math.sin(kp.rot) * gh * 0.2, y: hip.y - gh * 0.2 }; drawBall(ctx, hand.x, hand.y, RB * gh, 0); }
    if (b.d >= 0) drawB();
    // ─ striker (foreground, seen from behind)
    const Hs = Math.min(h * 0.5, gh * 2.7);
    const runDur = keepMode ? RUN : KICK;
    const inRun = st.stage === 'shot' || st.stage === 'krun' || st.stage === 'after' || st.stage === 'kafter';
    const rp = inRun ? clamp01(st.sc / runDur) : 0;
    const startX = cx - Math.max(gw * 0.7, Hs * 0.55), endX = cx - Hs * 0.2;
    const sx = lerp(startX, endX, easeOut(rp)), sy = lerp(h + Hs * 0.1, spot.y + Hs * 0.16, easeOut(rp));
    const kickK = inRun ? clamp01((st.sc - runDur + 0.12) / 0.3) : 0;
    const celebrate = (st.stage === 'after' && st.shot?.out === 'goal') || (st.stage === 'kafter' && st.shot?.out === 'goal');
    const sLean = keepMode && st.stage === 'krun' && st.sc > 0.75 && !st.kicked ? st.sTell * 0.17 : 0;
    const sc0 = lerp(1, 0.86, easeOut(rp));
    drawStriker(ctx, sx, sy, Hs * sc0, keepMode ? { jersey: '#ff8a00', trim: '#111', num: '9', name: 'BOUFFECHIPS' } : { jersey: '#ff2d95', trim: '#fff', num: '10', name: first }, rp < 1 && inRun ? st.sc * (keepMode ? 14 : 22) : 0, kickK, sLean, celebrate ? st.st : -1);
    if (!st.kicked) drawB();
    ctx.restore(); // end camera
    // ─ light beams + vignette (screen space)
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    lamps.forEach((lx, i) => {
      const x = lx * w, y = roofH * 0.45, tx = cx + (lx - 0.5) * w * 0.35, ty = h;
      const gb = ctx.createLinearGradient(x, y, tx, ty); gb.addColorStop(0, `rgba(220,230,255,${0.07 + (st.strobe > 0 && i % 2 ? 0.08 : 0)})`); gb.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gb; ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x + 10, y); ctx.lineTo(tx + w * 0.16, ty); ctx.lineTo(tx - w * 0.16, ty); ctx.fill();
    });
    ctx.restore();
    const vg = ctx.createRadialGradient(cx, h * 0.5, Math.min(w, h) * 0.35, cx, h * 0.5, Math.max(w, h) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    // ─ teeth flying from the stands
    for (let i = st.teethFx.length - 1; i >= 0; i--) {
      const f = st.teethFx[i]; f.t += dt; f.vy += 600 * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.r += dt * 12;
      if (f.t > 1.4) { st.teethFx.splice(i, 1); continue; }
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.r); ctx.fillStyle = '#fffdf0'; glow(ctx, '#fff', 8);
      ctx.beginPath(); ctx.moveTo(-6, -6); ctx.quadraticCurveTo(0, -9, 6, -6); ctx.lineTo(5, 3); ctx.lineTo(2, 8); ctx.lineTo(0, 2); ctx.lineTo(-2, 8); ctx.lineTo(-5, 3); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    // ─ UI: crosshair + power bar
    if (playing && (st.stage === 'aim' || st.stage === 'charge' || st.stage === 'ready')) {
      const a = proj(v, st.aimX + st.swX, st.aimY + st.swY, 0);
      const inSweet = st.stage === 'charge' && st.power >= st.sweetLo && st.power <= st.sweetHi;
      const col = st.stage !== 'charge' ? '#ffffff' : inSweet ? '#a3e635' : st.power > st.sweetHi ? '#ff4d6d' : '#ffd166';
      const R = gh * 0.09 * (1 + Math.sin(t * 8) * 0.06) * (st.stage === 'charge' ? 1 - st.power * 0.25 : 1);
      ctx.save(); glow(ctx, col, 16); ctx.strokeStyle = col; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(a.x, a.y, R, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) { const an = (i * Math.PI) / 2 + t * 0.8; ctx.beginPath(); ctx.moveTo(a.x + Math.cos(an) * R * 0.45, a.y + Math.sin(an) * R * 0.45); ctx.lineTo(a.x + Math.cos(an) * R * 1.5, a.y + Math.sin(an) * R * 1.5); ctx.stroke(); }
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(a.x, a.y, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // power bar
      const bx = Math.min(w - 40, spot.x + Math.max(60, gw * 0.42)), bh = Math.min(h * 0.32, gh * 1.4), by = spot.y - bh * 0.75, bw = 18;
      ctx.fillStyle = 'rgba(5,2,12,.7)'; roundRect(ctx, bx - 6, by - 26, bw + 12, bh + 38, 10); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.1)'; roundRect(ctx, bx, by, bw, bh, 6); ctx.fill();
      const sy1 = by + bh * (1 - st.sweetHi), sy2 = by + bh * (1 - st.sweetLo);
      ctx.save(); glow(ctx, '#a3e635', 12); ctx.fillStyle = 'rgba(163,230,53,.55)'; ctx.fillRect(bx, sy1, bw, sy2 - sy1); ctx.restore();
      ctx.fillStyle = 'rgba(255,77,109,.35)'; ctx.fillRect(bx, by, bw, sy1 - by);
      if (st.stage === 'charge') {
        const py = by + bh * (1 - st.power);
        const grd = ctx.createLinearGradient(0, by + bh, 0, by); grd.addColorStop(0, '#22d3ee'); grd.addColorStop(0.7, '#ffd166'); grd.addColorStop(1, '#ff4d6d');
        ctx.fillStyle = grd; roundRect(ctx, bx + 3, py, bw - 6, by + bh - py, 4); ctx.fill();
        ctx.save(); glow(ctx, col, 14); ctx.fillStyle = '#fff'; ctx.fillRect(bx - 5, py - 2, bw + 10, 4); ctx.restore();
      }
      ctx.fillStyle = '#fff'; ctx.font = `800 11px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillText(tr('PUISS.', 'POWER'), bx + bw / 2, by - 10);
      // hint
      if (st.round < 2 || st.stage === 'aim') {
        ctx.font = `700 ${Math.max(12, h * 0.022)}px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.textAlign = 'center';
        ctx.fillText(st.stage === 'charge' ? tr('…relâche dans le VERT !', '…release in the GREEN!') : tr('Vise (souris / flèches) · maintiens clic ou Espace', 'Aim (mouse / arrows) · hold click or Space'), cx, h - 14);
      }
    }
    // keeper-mode timing ring
    if (playing && st.stage === 'krun' && !st.kicked) {
      const p = clamp01((st.sc - (RUN - 1.1)) / 0.98);
      if (p > 0) {
        const R = RB * gh * spot.s * (1.2 + (1 - p) * 4.5);
        const win = st.sc >= RUN - 0.22;
        const col = win ? '#a3e635' : '#22d3ee';
        ctx.save(); glow(ctx, col, 18); ctx.strokeStyle = col; ctx.lineWidth = 4 + (win ? 2 : 0);
        ctx.beginPath(); ctx.arc(spot.x, spot.y - RB * gh * spot.s, R, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        if (win) { ctx.save(); glow(ctx, col, 20); ctx.fillStyle = col; ctx.font = `900 ${Math.max(18, h * 0.05)}px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(tr('PLONGE !', 'DIVE!'), spot.x, spot.y - R - 14); ctx.restore(); }
      }
      // zones hint
      ctx.fillStyle = 'rgba(255,255,255,.05)';
      const third = gw / 3; for (let i = 0; i < 3; i++) if (i !== 1) ctx.fillRect(cx - gw / 2 + i * third, y0 - gh, third, gh);
      ctx.font = `700 ${Math.max(12, h * 0.022)}px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.textAlign = 'center';
      ctx.fillText(tr('Regarde où il se penche… ← ↓ → ou clic dans le but', 'Watch where he leans… ← ↓ → or click in the goal'), cx, h - 14);
    }
    // keeper speech bubble
    if (st.bubble) {
      st.bubble.t += dt;
      const bt = st.bubble.t;
      if (bt > 3.2) st.bubble = null;
      else if (bt > 0) drawBubble(ctx, hip.x, hip.y - gh * 0.62, st.bubble.txt, Math.min(1, bt * 6), Math.max(13, Math.min(17, h * 0.026)), w);
    }
    // scoreboard (shots + saves)
    drawBoard(ctx, st, w, h, first);
    // banner
    if (st.banner) {
      st.banner.t += dt;
      const bt = st.banner.t;
      if (bt > 2.3) st.banner = null;
      else {
        const sc = bt < 0.18 ? 2.4 - (bt / 0.18) * 1.4 : 1 + Math.sin(bt * 9) * 0.025;
        const a = bt > 1.9 ? 1 - (bt - 1.9) / 0.4 : 1;
        ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.translate(cx, h * 0.3); ctx.scale(sc, sc); ctx.rotate(-0.04);
        const fs = Math.max(30, Math.min(w * 0.09, h * 0.12));
        ctx.font = `900 ${fs}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round'; ctx.lineWidth = fs * 0.16; ctx.strokeStyle = '#12051f'; ctx.strokeText(st.banner.txt, 0, 0);
        glow(ctx, st.banner.col, 30); ctx.fillStyle = st.banner.col; ctx.fillText(st.banner.txt, 0, 0);
        ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillText(st.banner.txt, 0, -fs * 0.04);
        ctx.fillStyle = st.banner.col; ctx.globalAlpha *= 0.85; ctx.fillText(st.banner.txt, 0, 0);
        if (st.banner.sub) { ctx.globalAlpha = Math.max(0, a); ctx.font = `700 ${fs * 0.3}px ${FONT}`; ctx.lineWidth = fs * 0.07; ctx.strokeText(st.banner.sub, 0, fs * 0.72); ctx.fillStyle = '#fff'; ctx.fillText(st.banner.sub, 0, fs * 0.72); }
        ctx.restore();
      }
    }
    // confetti
    for (let i = st.conf.length - 1; i >= 0; i--) {
      const c = st.conf[i]; c.life -= dt; if (c.life <= 0 || c.y > h + 20) { st.conf.splice(i, 1); continue; }
      c.vy += 260 * dt; c.vx *= 1 - dt * 1.2; c.vy = Math.min(c.vy, 160); c.x += (c.vx + Math.sin(c.rot * 2) * 30) * dt; c.y += c.vy * dt; c.rot += c.vr * dt;
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot); ctx.scale(1, Math.abs(Math.cos(c.rot * 1.7)) + 0.15); ctx.fillStyle = c.c; ctx.fillRect(-c.sz / 2, -c.sz / 4, c.sz, c.sz / 2); ctx.restore();
    }
  }

  return (
    <Arena g={g} title={tr('Tirs au but', 'Penalty shootout')} icon="⚽" theme="neon"
      howTo={tr('5 tirs face à Gégé « Le Mur ». Vise avec la souris, maintiens clic / Espace et relâche dans la zone VERTE. Il penche souvent du côté où il va plonger… souvent. Puis 2 arrêts à faire toi-même : plonge quand le cercle se ferme.', '5 shots against Gégé "The Wall". Aim with the mouse, hold click / Space and release in the GREEN zone. He often leans the way he\'ll dive… often. Then make 2 saves yourself: dive as the ring closes.')}
      keys={[tr('Souris / ← ↑ → ↓ = viser', 'Mouse / arrows = aim'), tr('Clic / Espace maintenu = frapper', 'Hold click / Space = shoot'), tr('Gardien : ← ↓ →', 'Keeper: ← ↓ →')]}>
      <canvas class="play" ref={canvas} style={{ cursor: 'crosshair', touchAction: 'none' }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />
    </Arena>
  );
}

// ─────────────────────────── drawing helpers ───────────────────────────

function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, spin: number) {
  if (r < 0.8) return;
  ctx.save(); ctx.translate(x, y);
  const gr = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
  gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.7, '#e2e6f0'); gr.addColorStop(1, '#8a90a8');
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.clip();
  ctx.rotate(spin);
  ctx.fillStyle = '#16131f';
  const pent = (px: number, py: number, pr: number, rot: number) => { ctx.beginPath(); for (let i = 0; i < 5; i++) { const a = rot + (i * Math.PI * 2) / 5; const X = px + Math.cos(a) * pr, Y = py + Math.sin(a) * pr; if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); } ctx.closePath(); ctx.fill(); };
  pent(0, 0, r * 0.32, -Math.PI / 2);
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i * Math.PI * 2) / 5 + Math.PI / 5; pent(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9, r * 0.3, a); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
}

function drawKeeper(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, p: Pose, face: string, tongue: boolean, c: { jersey: string; stripe: string; glove: string; hair: string; mus: boolean }, t: number) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(p.rot); ctx.scale(u, u);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // legs
  for (const side of [-1, 1]) {
    const a = p.legs + p.crouch * 0.1;
    const hx = side * 0.05, fx = side * (0.06 + Math.sin(a) * 0.3), fy = 0.36 - p.crouch * 0.06;
    const kx = (hx + fx) / 2 + side * (0.03 + p.crouch * 0.05), ky = fy * 0.5;
    ctx.strokeStyle = '#111'; ctx.lineWidth = 0.075; ctx.beginPath(); ctx.moveTo(hx, 0.02); ctx.quadraticCurveTo(kx, ky, fx, fy); ctx.stroke();
    ctx.strokeStyle = c.jersey; ctx.lineWidth = 0.06; ctx.beginPath(); ctx.moveTo(kx * 0.9, ky + 0.04); ctx.quadraticCurveTo((kx + fx) / 2, (ky + fy) / 2 + 0.02, fx, fy - 0.03); ctx.stroke();
    ctx.fillStyle = '#0b0b10'; ctx.beginPath(); ctx.ellipse(fx + side * 0.02, fy + 0.01, 0.055, 0.03, 0, 0, Math.PI * 2); ctx.fill();
  }
  // shorts
  ctx.fillStyle = '#16131f'; roundRect(ctx, -0.115, -0.04, 0.23, 0.11, 0.03); ctx.fill();
  // arms (behind torso partially)
  const arm = (side: number, a: number) => {
    const sx = side * 0.12, sy = -0.27;
    const dx = Math.sin(a) * side, dy = Math.cos(a);
    const ex = sx + dx * 0.13 + side * 0.02, ey = sy + dy * 0.13, hx = sx + dx * 0.27, hy = sy + dy * 0.27;
    ctx.strokeStyle = c.jersey; ctx.lineWidth = 0.065; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(ex, ey, hx, hy); ctx.stroke();
    ctx.fillStyle = c.glove; ctx.beginPath(); ctx.arc(hx, hy, 0.058, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(hx - 0.015, hy - 0.018, 0.02, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 0.008; ctx.beginPath(); ctx.arc(hx, hy, 0.058, 0, Math.PI * 2); ctx.stroke();
  };
  arm(-1, p.armL); arm(1, p.armR);
  // torso
  ctx.beginPath(); ctx.moveTo(-0.135, -0.31); ctx.lineTo(0.135, -0.31); ctx.lineTo(0.112, 0.005); ctx.lineTo(-0.112, 0.005); ctx.closePath();
  ctx.fillStyle = c.jersey; ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = c.stripe; ctx.lineWidth = 0.035; for (let i = -4; i < 5; i++) { ctx.beginPath(); ctx.moveTo(i * 0.07 - 0.2, -0.32); ctx.lineTo(i * 0.07 + 0.1, 0.02); ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(-0.135, -0.31, 0.27, 0.06); ctx.restore();
  ctx.save(); ctx.scale(1 / u, 1 / u); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = Math.max(1, u * 0.012); ctx.font = `900 ${Math.max(6, u * 0.13)}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.strokeText('1', 0, -u * 0.14); ctx.fillText('1', 0, -u * 0.14); ctx.restore();
  // head
  const hy = -0.41;
  ctx.fillStyle = c.hair; ctx.beginPath(); ctx.moveTo(-0.1, -0.44); ctx.quadraticCurveTo(-0.12, -0.3, -0.07, -0.27); ctx.lineTo(0.07, -0.27); ctx.quadraticCurveTo(0.12, -0.3, 0.1, -0.44); ctx.closePath(); ctx.fill(); // mullet
  ctx.fillStyle = '#f2b98d'; ctx.beginPath(); ctx.arc(0, hy, 0.085, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e09b6e'; ctx.beginPath(); ctx.arc(-0.085, hy + 0.005, 0.02, 0, Math.PI * 2); ctx.arc(0.085, hy + 0.005, 0.02, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = c.hair; ctx.beginPath(); ctx.arc(0, hy - 0.02, 0.088, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(0.06, hy - 0.05); ctx.lineTo(0.03, hy - 0.035); ctx.lineTo(0, hy - 0.055); ctx.lineTo(-0.03, hy - 0.035); ctx.lineTo(-0.06, hy - 0.05); ctx.closePath(); ctx.fill();
  // eyes
  const ex = p.eye * 0.012;
  const big = face === 'shock' ? 1.35 : 1;
  for (const s of [-1, 1]) {
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(s * 0.032, hy - 0.005, 0.02 * big, 0.024 * big, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(s * 0.032 + ex, hy - 0.002, 0.01 * big, 0, Math.PI * 2); ctx.fill();
    // brows
    ctx.strokeStyle = c.hair; ctx.lineWidth = 0.012; ctx.beginPath();
    const tilt = face === 'smug' || face === 'focus' ? 0.012 : face === 'sad' ? -0.012 : face === 'shock' ? -0.004 : 0;
    ctx.moveTo(s * 0.05, hy - 0.035 - tilt); ctx.lineTo(s * 0.015, hy - 0.035 + tilt - (face === 'shock' ? 0.012 : 0)); ctx.stroke();
  }
  // mouth
  const my = hy + 0.045;
  ctx.fillStyle = '#5a0f1a'; ctx.strokeStyle = '#5a0f1a'; ctx.lineWidth = 0.01;
  if (face === 'shock') { ctx.beginPath(); ctx.ellipse(0, my + 0.005, 0.018, 0.024, 0, 0, Math.PI * 2); ctx.fill(); }
  else if (face === 'happy') { ctx.beginPath(); ctx.arc(0, my - 0.01, 0.035, 0.1, Math.PI - 0.1); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-0.025, my - 0.006, 0.05, 0.01); }
  else if (face === 'sad') { ctx.beginPath(); ctx.arc(0, my + 0.02, 0.022, Math.PI + 0.3, -0.3); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(-0.025, my); ctx.quadraticCurveTo(0.01, my + 0.012, 0.03, my - 0.012); ctx.stroke(); }
  if (tongue) { ctx.fillStyle = '#ff5b86'; ctx.beginPath(); ctx.ellipse(0.005 + Math.sin(t * 20) * 0.006, my + 0.028, 0.014, 0.024, 0, 0, Math.PI * 2); ctx.fill(); }
  if (c.mus) { ctx.fillStyle = c.hair; ctx.beginPath(); ctx.moveTo(-0.045, my - 0.004); ctx.quadraticCurveTo(-0.02, my - 0.03, 0, my - 0.015); ctx.quadraticCurveTo(0.02, my - 0.03, 0.045, my - 0.004); ctx.quadraticCurveTo(0.02, my - 0.012, 0, my - 0.006); ctx.quadraticCurveTo(-0.02, my - 0.012, -0.045, my - 0.004); ctx.fill(); }
  if (face === 'focus' || face === 'shock') { ctx.fillStyle = '#7fdcff'; ctx.beginPath(); ctx.ellipse(0.075, hy - 0.05, 0.01, 0.016, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

function drawStriker(ctx: CanvasRenderingContext2D, x: number, y: number, H: number, c: { jersey: string; trim: string; num: string; name: string }, ph: number, kick: number, lean: number, celebrate: number) {
  ctx.save(); ctx.translate(x, y); ctx.scale(H, H);
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(0, 0, 0.22, 0.04, 0, 0, Math.PI * 2); ctx.fill();
  ctx.rotate(lean);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const jump = celebrate >= 0 ? Math.abs(Math.sin(celebrate * 8)) * 0.08 : 0;
  ctx.translate(0, -jump);
  // legs
  for (const side of [-1, 1]) {
    let fx = side * 0.09, fy = 0;
    if (ph) { const k = Math.sin(ph + (side > 0 ? Math.PI : 0)); fy = -Math.max(0, k) * 0.13; fx += side * 0.01; }
    if (side > 0 && kick > 0) { const a = Math.sin(kick * Math.PI); fy = -0.32 * a + 0.02; fx = 0.1 + kick * 0.14; }
    ctx.strokeStyle = '#e8b089'; ctx.lineWidth = 0.075; ctx.beginPath(); ctx.moveTo(side * 0.07, -0.48); ctx.lineTo(fx, fy - 0.24 + (fy < 0 ? fy * 0.3 : 0)); ctx.stroke();
    ctx.strokeStyle = c.jersey; ctx.lineWidth = 0.07; ctx.beginPath(); ctx.moveTo(fx * 0.95, fy - 0.25); ctx.lineTo(fx, fy - 0.04); ctx.stroke();
    ctx.strokeStyle = c.trim; ctx.lineWidth = 0.071; ctx.beginPath(); ctx.moveTo(fx * 0.96, fy - 0.2); ctx.lineTo(fx * 0.97, fy - 0.17); ctx.stroke();
    ctx.fillStyle = '#0d0d14'; ctx.beginPath(); ctx.ellipse(fx, fy - 0.01, 0.05, 0.032, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#a3e635'; ctx.fillRect(fx - 0.03, fy - 0.025, 0.06, 0.008);
  }
  // shorts
  ctx.fillStyle = '#16131f'; roundRect(ctx, -0.16, -0.58, 0.32, 0.15, 0.04); ctx.fill();
  // arms
  const up = celebrate >= 0;
  for (const side of [-1, 1]) {
    const sw = ph ? Math.sin(ph + (side > 0 ? 0 : Math.PI)) * 0.55 : 0.15;
    const a = up ? 2.6 + Math.sin(celebrate * 10 + side) * 0.2 : 0.18 + sw * 0.5;
    const sx = side * 0.2, sy = -0.87, hx = sx + Math.sin(a) * side * 0.3, hy = sy + Math.cos(a) * 0.3;
    ctx.strokeStyle = c.jersey; ctx.lineWidth = 0.08; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + (hx - sx) * 0.45, sy + (hy - sy) * 0.45); ctx.stroke();
    ctx.strokeStyle = '#e8b089'; ctx.lineWidth = 0.065; ctx.beginPath(); ctx.moveTo(sx + (hx - sx) * 0.45, sy + (hy - sy) * 0.45); ctx.lineTo(hx, hy); ctx.stroke();
  }
  // torso
  ctx.beginPath(); ctx.moveTo(-0.22, -0.92); ctx.quadraticCurveTo(0, -0.97, 0.22, -0.92); ctx.lineTo(0.17, -0.55); ctx.lineTo(-0.17, -0.55); ctx.closePath();
  const tg = ctx.createLinearGradient(-0.2, 0, 0.2, 0); tg.addColorStop(0, c.jersey); tg.addColorStop(0.5, c.jersey); tg.addColorStop(1, '#000'); ctx.fillStyle = c.jersey; ctx.fill();
  ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = tg; ctx.fill(); ctx.restore();
  ctx.fillStyle = c.trim; ctx.fillRect(-0.215, -0.9, 0.025, 0.33); ctx.fillRect(0.19, -0.9, 0.025, 0.33);
  ctx.save(); ctx.scale(1 / H, 1 / H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c.trim; ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = Math.max(1, H * 0.008);
  ctx.font = `900 ${H * 0.16}px ${FONT}`; ctx.strokeText(c.num, 0, -H * 0.69); ctx.fillText(c.num, 0, -H * 0.69);
  let fs = H * 0.05; ctx.font = `800 ${fs}px ${FONT}`; const mw = ctx.measureText(c.name).width; if (mw > H * 0.3) { fs *= (H * 0.3) / mw; ctx.font = `800 ${fs}px ${FONT}`; }
  ctx.fillText(c.name, 0, -H * 0.84);
  ctx.restore();
  // head (from behind)
  ctx.fillStyle = '#e8b089'; ctx.fillRect(-0.04, -1.0, 0.08, 0.08);
  ctx.beginPath(); ctx.arc(-0.1, -1.04, 0.025, 0, Math.PI * 2); ctx.arc(0.1, -1.04, 0.025, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2b1a10'; ctx.beginPath(); ctx.arc(0, -1.06, 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(-0.03, -1.1, 0.04, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function wrap(ctx: CanvasRenderingContext2D, txt: string, maxW: number) {
  const words = txt.split(' '); const lines: string[] = []; let cur = '';
  for (const wd of words) { const tst = cur ? `${cur} ${wd}` : wd; if (ctx.measureText(tst).width > maxW && cur) { lines.push(cur); cur = wd; } else cur = tst; }
  if (cur) lines.push(cur);
  return lines;
}

function drawBubble(ctx: CanvasRenderingContext2D, x: number, y: number, txt: string, k: number, fs: number, w: number) {
  ctx.save();
  ctx.font = `700 ${fs}px ${FONT}`;
  const lines = wrap(ctx, txt, Math.min(240, w * 0.4));
  const bw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 24, bh = lines.length * fs * 1.2 + 16;
  const bx = Math.max(8, Math.min(w - bw - 8, x - bw / 2 + 30)), by = y - bh - 14;
  ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
  ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3;
  ctx.fillStyle = '#fff'; roundRect(ctx, bx, by, bw, bh, 12); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 6, by + bh - 1); ctx.lineTo(x + 8, by + bh - 1); ctx.lineTo(x - 2, y - 2); ctx.fill();
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.fillStyle = '#12051f'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  lines.forEach((l, i) => ctx.fillText(l, bx + 12, by + 8 + i * fs * 1.2));
  ctx.restore();
}

function drawBoard(ctx: CanvasRenderingContext2D, st: S, w: number, h: number, first: string) {
  const fs = Math.max(11, Math.min(14, h * 0.022));
  const x = 12, y = 12, bw = Math.min(250, w * 0.42), bh = fs * 4.4;
  ctx.save();
  ctx.fillStyle = 'rgba(5,2,12,.72)'; roundRect(ctx, x, y, bw, bh, 12); ctx.fill();
  ctx.strokeStyle = 'rgba(255,91,209,.5)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.font = `800 ${fs}px ${FONT}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillStyle = '#fff';
  ctx.fillText(first, x + 10, y + fs * 1.1);
  ctx.fillStyle = '#c6ff00'; ctx.fillText(tr('GÉGÉ « LE MUR »', 'GÉGÉ "THE WALL"'), x + 10, y + fs * 3.2);
  const r = fs * 0.55, ox = x + bw - 10 - r;
  for (let i = 0; i < 5; i++) {
    const res = st.results[i]; const cxx = ox - (4 - i) * (r * 2.5), cyy = y + fs * 1.1;
    circ(ctx, cxx, cyy, r, res === undefined ? null : res === 'goal', st.round === i && st.results.length === i);
  }
  for (let i = 0; i < 2; i++) {
    const res = st.keeps[i]; const cxx = ox - (1 - i) * (r * 2.5), cyy = y + fs * 3.2;
    circ(ctx, cxx, cyy, r, res === undefined ? null : res, st.results.length === 5 && st.keeps.length === i);
  }
  ctx.restore();
}
function circ(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, ok: boolean | null, cur: boolean) {
  ctx.save();
  if (ok === null) { ctx.strokeStyle = cur ? '#ffd166' : 'rgba(255,255,255,.35)'; ctx.lineWidth = cur ? 2.5 : 1.5; if (cur) glow(ctx, '#ffd166', 10); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); }
  else {
    const col = ok ? '#a3e635' : '#ff4d6d';
    glow(ctx, col, 10); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.strokeStyle = '#12051f'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath();
    if (ok) { ctx.moveTo(x - r * 0.45, y); ctx.lineTo(x - r * 0.1, y + r * 0.4); ctx.lineTo(x + r * 0.5, y - r * 0.4); }
    else { ctx.moveTo(x - r * 0.4, y - r * 0.4); ctx.lineTo(x + r * 0.4, y + r * 0.4); ctx.moveTo(x + r * 0.4, y - r * 0.4); ctx.lineTo(x - r * 0.4, y + r * 0.4); }
    ctx.stroke();
  }
  ctx.restore();
}
