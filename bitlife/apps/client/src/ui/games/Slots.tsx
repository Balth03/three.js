// Slot machine: chrome & neon cabinet, 3 cylindrical reels with motion blur, 5 paylines, lever, near-miss teasing,
// coin fountains, BIG WIN banners and a jackpot siren. 12 spins or until broke.
import { useRef } from 'preact/hooks';
import type { Life } from '@bl/sim';
import { country, formatMoney } from '@bl/sim';
import { useGame, useCanvas, useKeys, Arena, tr, glow, roundRect, rand, type GameProps } from './kit.tsx';
import { sfx, synth } from '../../audio.ts';
import { lang } from '../../state.ts';

const SPINS = 12;
const BETS = [0.01, 0.05, 0.1, 0.25];
// [glyph, weight on the strip, payout ×line-bet for 3 on a line]
const SYMS: { g: string; w: number; pay: number; name: [string, string] }[] = [
  { g: '🍒', w: 7, pay: 9, name: ['Cerises', 'Cherries'] },
  { g: '🍋', w: 7, pay: 11, name: ['Citrons', 'Lemons'] },
  { g: '🍆', w: 6, pay: 14, name: ['Aubergines', 'Eggplants'] },
  { g: '💩', w: 6, pay: 7, name: ['Cacas', 'Poops'] },
  { g: '🔔', w: 5, pay: 25, name: ['Cloches', 'Bells'] },
  { g: '💎', w: 3, pay: 60, name: ['Diamants', 'Diamonds'] },
  { g: '7', w: 2, pay: 200, name: ['Sept', 'Sevens'] },
  { g: '🤑', w: 2, pay: 120, name: ['Joker', 'Wild'] },
];
const CHERRY = 0, BELL = 4, SEVEN = 6, WILD = 7;
const LINES = [[1, 1, 1], [0, 0, 0], [2, 2, 2], [0, 1, 2], [2, 1, 0]];
const LINE_COL = ['#ffd166', '#22d3ee', '#ff5bd1', '#a3e635', '#ff8a3d'];
const GOLD = '#ffd166', PINK = '#ff2d95', CYAN = '#22d3ee';
const QUIPS: [string, string][] = [
  ['La maison gagne toujours 🏠', 'The house always wins 🏠'], ['Ton banquier pleure 😭', 'Your banker is crying 😭'], ['Encore un petit ? 😈', 'Just one more? 😈'],
  ['Presque ! (non)', 'Almost! (no)'], ['Les cerises te snobent 🍒', 'The cherries hate you 🍒'], ['Mamie aurait gagné', 'Grandma would have won'],
];

interface Reel { strip: number[]; pos: number; speed: number; state: 'idle' | 'spin' | 'land'; stopAt: number; target: number; from: number; to: number; lt: number; ld: number; tick: number; tease: boolean; landedAt: number }
interface Win { line: number; sym: number; mult: number }
interface Coin { x: number; y: number; vx: number; vy: number; spin: number; sv: number; r: number; life: number }
interface Btn { x: number; y: number; w: number; h: number; act: () => void }

function moneyFmt(l: Life) {
  let c: ReturnType<typeof country> | null = null;
  import('@bl/data').then((m) => { try { c = country(m.content, l.country); } catch { c = null; } }).catch(() => { /* fallback */ });
  return (v: number) => {
    try { if (c) return formatMoney(v, c, lang.value); } catch { /* fall through */ }
    return `${Math.round(v).toLocaleString(lang.value === 'fr' ? 'fr-FR' : 'en-US')} €`;
  };
}

function makeStrip(): number[] {
  const s: number[] = [];
  SYMS.forEach((d, i) => { for (let j = 0; j < d.w; j++) s.push(i); });
  for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; }
  return s;
}
const mod = (a: number, n: number) => ((a % n) + n) % n;
function easeOutBack(x: number) { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }

function evalGrid(grid: number[][]): Win[] {
  const wins: Win[] = [];
  LINES.forEach((L, li) => {
    const a = grid[0][L[0]], b = grid[1][L[1]], c = grid[2][L[2]];
    const non = [a, b, c].filter((x) => x !== WILD);
    if (non.length === 0) wins.push({ line: li, sym: WILD, mult: SYMS[WILD].pay });
    else if (non.every((x) => x === non[0])) wins.push({ line: li, sym: non[0], mult: SYMS[non[0]].pay });
    else if ((a === CHERRY || a === WILD) && (b === CHERRY || b === WILD)) wins.push({ line: li, sym: CHERRY, mult: 2 });
  });
  return wins;
}

// Pre-rendered symbol sprites (crisp and cheap to stretch for motion blur).
const SPR = new Map<number, HTMLCanvasElement>();
function sprite(i: number): HTMLCanvasElement | null {
  const got = SPR.get(i); if (got) return got;
  try {
    const c = document.createElement('canvas'); c.width = 160; c.height = 160;
    const x = c.getContext('2d'); if (!x) return null;
    x.textAlign = 'center'; x.textBaseline = 'middle';
    if (i === SEVEN) {
      x.font = '900 150px "Fredoka Variable", Impact, sans-serif';
      const gr = x.createLinearGradient(0, 10, 0, 150); gr.addColorStop(0, '#ff6b6b'); gr.addColorStop(0.5, '#e00024'); gr.addColorStop(1, '#7a0010');
      x.lineJoin = 'round'; x.lineWidth = 14; x.strokeStyle = '#3b0008'; x.strokeText('7', 80, 88);
      x.lineWidth = 7; const gg = x.createLinearGradient(0, 10, 0, 150); gg.addColorStop(0, '#fff3b0'); gg.addColorStop(0.5, '#ffbf00'); gg.addColorStop(1, '#a86b00'); x.strokeStyle = gg; x.strokeText('7', 80, 88);
      x.fillStyle = gr; x.fillText('7', 80, 88);
      x.fillStyle = 'rgba(255,255,255,.45)'; x.fillRect(40, 30, 70, 6);
    } else {
      x.font = '112px "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", serif';
      x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowOffsetY = 5; x.shadowBlur = 6;
      x.fillText(SYMS[i].g, 80, i === WILD ? 70 : 86);
      if (i === WILD) {
        x.shadowBlur = 0; x.shadowOffsetY = 0; x.font = '900 34px "Fredoka Variable", sans-serif';
        x.lineWidth = 6; x.strokeStyle = '#3b0030'; x.strokeText('WILD', 80, 140); x.fillStyle = '#ffe14d'; x.fillText('WILD', 80, 140);
      }
    }
    SPR.set(i, c); return c;
  } catch { return null; }
}

export function Slots({ onDone, l, variant }: GameProps) {
  const g = useGame({ onDone });
  const fmtRef = useRef<((v: number) => string) | null>(null);
  if (!fmtRef.current) fmtRef.current = moneyFmt(l);
  const fmt = fmtRef.current;
  const s = useRef<ReturnType<typeof init> | null>(null);
  if (!s.current) s.current = init(l);
  const st = s.current;
  const signed = (v: number) => `${v >= 0 ? '+' : '−'}${fmt(Math.abs(v))}`;
  const betAmt = () => Math.min(st.stack, Math.max(1, st.start * BETS[st.bet]));

  const coins = (n: number, x: number, y: number, power = 1) => {
    for (let i = 0; i < n; i++) st.coins.push({ x: x + rand(-20, 20), y, vx: rand(-260, 260) * power, vy: rand(-900, -500) * Math.sqrt(power), spin: rand(0, 6), sv: rand(8, 16), r: rand(9, 15), life: 0 });
  };
  const coinRain = (n: number) => { for (let i = 0; i < n; i++) st.coins.push({ x: rand(0, st.W), y: rand(-st.H * 0.8, -20), vx: rand(-40, 40), vy: rand(100, 300), spin: rand(0, 6), sv: rand(6, 14), r: rand(10, 17), life: 0 }); };

  const spin = () => {
    if (g.phase !== 'play' || st.over) return;
    if (st.mode === 'spin') { // slam stop
      for (const r of st.reels) if (r.state === 'spin' && r.stopAt - st.t > 0.12) r.stopAt = st.t + 0.05 + st.reels.indexOf(r) * 0.08;
      return;
    }
    if (st.mode === 'pay') { st.payT = st.payDur; return; }
    if (st.mode !== 'ready') return;
    const bet = betAmt();
    if (bet <= 0 || st.stack < st.start * 0.005) return;
    st.stack -= bet; st.lastBet = bet; st.totalBet += bet; st.spinsLeft--; st.spinsDone++;
    st.mode = 'spin'; st.lever = 0.0001; st.win = 0; st.wins = []; st.nearMiss = false; st.msg = null;
    sfx.whoosh(); synth.tone(110, 0.12, 'square', 0.08); synth.noise(0.08, 0.12, 900);
    // outcome
    const stops = st.reels.map((r) => Math.floor(Math.random() * r.strip.length));
    const sym = (ri: number, row: number) => st.reels[ri].strip[mod(stops[ri] + row, st.reels[ri].strip.length)];
    let tease: { sym: number; row: number; line: number } | null = null;
    LINES.forEach((L, li) => {
      if (tease) return;
      const a = sym(0, L[0]), b = sym(1, L[1]);
      const t = a === WILD ? b : a;
      if ((a === b || a === WILD || b === WILD) && t >= BELL) tease = { sym: t, row: L[2], line: li };
    });
    // 'lucky' variant (story hook / testing): the first spin is a guaranteed 7·7·7 on the middle line
    if (variant === 'lucky' && st.spinsDone === 1) st.reels.forEach((r, i) => { const j = r.strip.indexOf(SEVEN); if (j >= 0) stops[i] = mod(j - 1, r.strip.length); });
    const tz = tease as { sym: number; row: number; line: number } | null;
    if (tz && Math.random() < 0.5) {
      const c = sym(2, tz.row);
      if (c !== tz.sym && c !== WILD) {
        const strip = st.reels[2].strip;
        const idx = strip.map((v, i) => (v === tz.sym ? i : -1)).filter((i) => i >= 0);
        if (idx.length) {
          const j = idx[Math.floor(Math.random() * idx.length)];
          const landRow = tz.row + (tz.row === 0 ? -1 : tz.row === 2 ? 1 : Math.random() < 0.5 ? -1 : 1);
          stops[2] = mod(j - landRow, strip.length);
        }
      }
    }
    st.tease = tz;
    st.reels.forEach((r, i) => {
      r.state = 'spin'; r.speed = -4; r.target = stops[i]; r.tease = !!tz && i === 2;
      r.stopAt = st.t + 0.75 + i * 0.38 + (r.tease ? 1.7 : 0);
    });
  };

  const settle = () => {
    const grid = st.reels.map((r) => [0, 1, 2].map((row) => r.strip[mod(Math.round(r.pos) + row, r.strip.length)]));
    st.grid = grid;
    const wins = evalGrid(grid);
    const lineBet = st.lastBet / LINES.length;
    const total = wins.reduce((a, w) => a + w.mult * lineBet, 0);
    st.wins = wins; st.win = total; st.winT = 0;
    const mult = total / Math.max(0.0001, st.lastBet);
    if (total > 0) {
      st.stackBefore = st.stack; st.stack += total; st.winsCount++; st.biggest = Math.max(st.biggest, total);
      st.mode = 'pay'; st.payT = 0; st.payDur = Math.min(3.2, 0.7 + Math.log(1 + mult) * 0.7);
      g.add(Math.round(mult * 100), undefined);
      const jackpot = wins.some((w) => w.sym === SEVEN || (w.sym === WILD && w.mult >= 100));
      if (jackpot) {
        st.jackpots++; st.banner = { kind: 'jackpot', t: 0 }; st.siren = 4;
        sfx.siren(); sfx.bells(); sfx.fanfare(1); g.flash('#ffd166'); g.shake(); coinRain(140); coins(60, st.trayX, st.trayY, 1.4);
        g.float('JACKPOT !!!', 50, 30, GOLD, true);
      } else if (mult >= 10) {
        st.banner = { kind: mult >= 25 ? 'mega' : 'big', t: 0 };
        sfx.bells(); sfx.combo(40); g.flash('#ffd166'); g.shake(); coins(50, st.trayX, st.trayY, 1.2); coinRain(40);
      } else {
        if (wins.some((w) => w.sym === 3)) { sfx.fart(); g.float(tr('JACKPOT DE MERDE 💩', 'CRAPPY JACKPOT 💩'), 50, 26, '#c08a4a', true); }
        else sfx.cash();
        coins(Math.round(8 + mult * 4), st.trayX, st.trayY, 0.8);
      }
      wins.forEach((w) => { const c = st.cellPos(2, LINES[w.line][2]); if (c) g.burst((c.x / st.W) * 100, (c.y / st.H) * 100 + 8, LINE_COL[w.line], 16); });
    } else {
      st.mode = 'cool'; st.coolT = 0.55;
      // near miss?
      const tz = st.tease;
      if (tz) {
        const r = st.reels[2];
        const above = r.strip[mod(Math.round(r.pos) + tz.row - 1, r.strip.length)], below = r.strip[mod(Math.round(r.pos) + tz.row + 1, r.strip.length)];
        if (above === tz.sym || below === tz.sym || above === WILD || below === WILD) {
          st.nearMiss = true; st.nearMisses++;
          st.msg = { text: tr('SI PRÈS !! 😱', 'SO CLOSE!! 😱'), col: '#ff4d6d', t: 0 };
          [392, 370, 349, 311].forEach((f, i) => synth.tone(f, i === 3 ? 0.7 : 0.28, 'sawtooth', 0.06, i * 0.3, i === 3 ? 0.85 : 1));
          g.shake(); st.coolT = 1.3;
        }
      }
      if (!st.nearMiss && Math.random() < 0.4) { const q = QUIPS[Math.floor(Math.random() * QUIPS.length)]; st.msg = { text: tr(q[0], q[1]), col: '#ffd6f0', t: 0 }; }
    }
  };

  const finish = () => {
    if (st.ended) return;
    st.ended = true;
    const r = Math.max(-1, Math.min(5, st.stack / st.start - 1));
    const score = r < 0 ? 0.45 * (1 + r) : 0.45 + 0.55 * (1 - Math.exp(-r * 3));
    g.end(score, [
      [tr('Jetons', 'Stack'), `${fmt(st.start)} → ${fmt(st.stack)}`],
      [tr('Résultat net', 'Net result'), `${signed(st.stack - st.start)} (${r >= 0 ? '+' : '−'}${Math.abs(r * 100).toFixed(0)} %)`],
      [tr('Plus gros gain', 'Biggest win'), st.biggest > 0 ? fmt(st.biggest) : '—'],
      [tr('Tours gagnants', 'Winning spins'), `${st.winsCount} / ${st.spinsDone}`],
      [tr('Jackpots · frôlés', 'Jackpots · near-misses'), `${st.jackpots} · ${st.nearMisses}`],
    ], r);
  };

  const changeBet = (d: number) => {
    if (st.mode !== 'ready' && st.mode !== 'cool') return;
    const nb = Math.max(0, Math.min(BETS.length - 1, st.bet + d));
    if (nb !== st.bet) { st.bet = nb; st.betBump = 1; sfx.coin(); } else sfx.click();
  };

  useKeys((e) => {
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowDown' || e.code === 'KeyS') { if (!e.repeat) spin(); }
    else if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') changeBet(-1);
    else if (e.code === 'ArrowRight' || e.code === 'KeyD') changeBet(1);
    else if (e.code === 'ArrowUp' || e.code === 'KeyW') changeBet(1);
  });

  const canvas = useCanvas((ctx, w, h, dt, t) => {
    try { frame(ctx, w, h, dt, t); } catch (err) { if (!st.errLogged) { st.errLogged = true; console.warn('Slots frame error', err); } }
  }, true);

  function frame(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, tAll: number) {
    st.W = w; st.H = h; st.t += dt;
    const playing = g.phase === 'play' && !st.ended;
    // ─── reels ───
    let allIdle = true;
    st.reels.forEach((r, i) => {
      const n = r.strip.length;
      if (r.state === 'spin') {
        allIdle = false;
        const max = r.tease && st.t > st.reels[1].stopAt + 0.5 ? 13 : 26;
        r.speed += (max - r.speed) * Math.min(1, dt * (r.speed < 0 ? 9 : 5));
        r.pos -= r.speed * dt;
        if (st.t >= r.stopAt && r.speed > 6) {
          const minD = 2.2;
          const tgt = Math.floor(r.pos - minD);
          let to = tgt - mod(tgt - r.target, n);
          if (r.pos - to < minD) to -= n;
          r.from = r.pos; r.to = to; r.lt = 0; r.ld = Math.max(0.3, Math.min(1.1, (4.7 * (r.pos - to)) / r.speed)); r.state = 'land';
        }
      } else if (r.state === 'land') {
        allIdle = false;
        r.lt += dt;
        const u = Math.min(1, r.lt / r.ld);
        r.pos = r.from + (r.to - r.from) * easeOutBack(u);
        r.speed = u < 1 ? 8 * (1 - u) : 0;
        if (u >= 1) {
          r.pos = r.to; r.state = 'idle'; r.landedAt = st.t;
          synth.kick(); synth.noise(0.05, 0.12, 2400); st.thump = 1;
          if (i === 1 && st.reels[2].tease) { synth.tone(180, 1.7, 'sawtooth', 0.035, 0, 4); for (let b = 0; b < 6; b++) synth.tone(60, 0.12, 'sine', 0.25, b * 0.28); }
          if (i === 2) settle();
        }
      }
      const cell = Math.floor(r.pos);
      if (cell !== r.tick) { r.tick = cell; if (r.state !== 'idle' && st.t - st.lastTick > 0.035) { st.lastTick = st.t; synth.tone(1700 + i * 200, 0.02, 'square', 0.012); } }
    });
    if (st.mode === 'spin' && allIdle && st.wins.length === 0 && st.mode === 'spin') { /* settle() already switched mode */ }
    if (st.lever > 0) { st.lever += dt; if (st.lever > 1.2) st.lever = 0; }
    if (st.mode === 'pay') {
      st.payT += dt;
      if (Math.floor(st.payT / 0.07) !== Math.floor((st.payT - dt) / 0.07) && st.payT < st.payDur) synth.tone(1400 + (st.payT / st.payDur) * 900, 0.05, 'square', 0.03);
      if (st.payT >= st.payDur + 0.6) { st.mode = 'cool'; st.coolT = 0.2; }
    }
    if (st.mode === 'cool') {
      st.coolT -= dt;
      if (st.coolT <= 0) {
        st.mode = 'ready';
        if (playing && (st.spinsLeft <= 0 || st.stack < st.start * 0.005)) { st.over = true; st.overT = 0; if (st.stack < st.start * 0.005) { st.msg = { text: tr('FAUCHÉ 💸', 'BROKE 💸'), col: '#ff4d6d', t: 0 }; sfx.bad(); } }
      }
    }
    if (st.over) { st.overT += dt; if (st.overT > 1.3) finish(); }
    if (st.banner) { st.banner.t += dt; if (st.banner.t > 3.4) st.banner = null; }
    if (st.msg) { st.msg.t += dt; if (st.msg.t > 2) st.msg = null; }
    st.siren = Math.max(0, st.siren - dt);
    st.thump = Math.max(0, st.thump - dt * 5);
    st.betBump = Math.max(0, st.betBump - dt * 4);
    if (st.siren > 0 && Math.random() < 0.3) coinRain(2);
    render(ctx, w, h, dt, tAll);
  }

  function render(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, tAll: number) {
    const k = Math.max(0.55, Math.min(1.25, Math.min(w / 1000, h / 620)));
    const F = (px: number, wt = 800) => `${wt} ${Math.round(px * k)}px "Fredoka Variable", system-ui, sans-serif`;
    const M = (px: number, wt = 800) => `${wt} ${Math.round(px * k)}px "JetBrains Mono", ui-monospace, monospace`;
    st.btns = [];
    ctx.clearRect(0, 0, w, h);
    // room: velvet + spotlights
    const bg = ctx.createRadialGradient(w / 2, h * 0.35, 10, w / 2, h * 0.5, Math.max(w, h) * 0.75);
    bg.addColorStop(0, '#3d0d2e'); bg.addColorStop(0.55, '#1a0516'); bg.addColorStop(1, '#07020a');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) {
      const x0 = w * (0.12 + i * 0.25), sw = Math.sin(tAll * 0.6 + i * 1.7) * w * 0.12;
      const gr = ctx.createLinearGradient(x0, 0, x0 + sw, h);
      gr.addColorStop(0, i % 2 ? 'rgba(255,45,149,.16)' : 'rgba(255,209,102,.14)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(x0 - 8, 0); ctx.lineTo(x0 + 8, 0); ctx.lineTo(x0 + sw + 110, h); ctx.lineTo(x0 + sw - 110, h); ctx.fill();
    }
    // jackpot beacons sweeping the room
    if (st.siren > 0) {
      for (let i = 0; i < 2; i++) {
        const a = tAll * 7 + i * Math.PI;
        const cx = w / 2, cy = h * 0.05;
        const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
        const col = i ? '40,120,255' : '255,20,60';
        gr.addColorStop(0, `rgba(${col},.55)`); gr.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, Math.max(w, h), a - 0.35, a + 0.35); ctx.fill();
      }
    }
    // ─── layout ───
    const narrow = w < 640;
    const leverW = narrow ? 44 * k : 90 * k;
    const cabH = h * 0.96;
    const cabW = Math.min(narrow ? w - leverW - 16 : w * 0.56, cabH * 0.95);
    const showTable = !narrow && (w - cabW) / 2 - leverW * 0.3 > 190 * k;
    const cx0 = narrow ? (w - leverW - cabW) / 2 + 4 : (w - cabW) / 2 + (showTable ? 0 : -leverW * 0.3);
    const cab = { x: cx0, y: h * 0.02, w: cabW, h: cabH };
    // cabinet body
    ctx.save();
    glow(ctx, PINK, 40);
    const body = ctx.createLinearGradient(cab.x, 0, cab.x + cab.w, 0);
    body.addColorStop(0, '#2a0620'); body.addColorStop(0.5, '#4a0d38'); body.addColorStop(1, '#2a0620');
    ctx.fillStyle = body; roundRect(ctx, cab.x, cab.y, cab.w, cab.h, 26 * k); ctx.fill();
    ctx.restore();
    ctx.lineWidth = 6 * k; ctx.strokeStyle = chrome(ctx, cab.y, cab.y + cab.h); roundRect(ctx, cab.x, cab.y, cab.w, cab.h, 26 * k); ctx.stroke();
    ctx.save(); glow(ctx, PINK, 18); ctx.strokeStyle = `rgba(255,45,149,${0.7 + 0.3 * Math.sin(tAll * 3)})`; ctx.lineWidth = 2; roundRect(ctx, cab.x + 9 * k, cab.y + 9 * k, cab.w - 18 * k, cab.h - 18 * k, 20 * k); ctx.stroke(); ctx.restore();

    // marquee
    const mq = { x: cab.x + 22 * k, y: cab.y + 18 * k, w: cab.w - 44 * k, h: cab.h * 0.135 };
    const mg = ctx.createLinearGradient(0, mq.y, 0, mq.y + mq.h);
    mg.addColorStop(0, '#12000e'); mg.addColorStop(1, '#2b0322');
    ctx.fillStyle = mg; roundRect(ctx, mq.x, mq.y, mq.w, mq.h, 14 * k); ctx.fill();
    ctx.lineWidth = 3 * k; ctx.strokeStyle = GOLD; ctx.stroke();
    // bulbs
    const winning = st.mode === 'pay' || st.siren > 0;
    const per = Math.max(10, Math.floor((mq.w + mq.h) * 2 / (26 * k)));
    for (let i = 0; i < per; i++) {
      const p = i / per, L = (mq.w + mq.h) * 2;
      let d = p * L, bx: number, by: number;
      if (d < mq.w) { bx = mq.x + d; by = mq.y; } else if ((d -= mq.w) < mq.h) { bx = mq.x + mq.w; by = mq.y + d; } else if ((d -= mq.h) < mq.w) { bx = mq.x + mq.w - d; by = mq.y + mq.h; } else { d -= mq.w; bx = mq.x; by = mq.y + mq.h - d; }
      const on = winning ? (Math.floor(tAll * 12) + i) % 2 === 0 : (i + Math.floor(tAll * 9)) % 4 === 0 || (i + Math.floor(tAll * 9)) % 4 === 1;
      ctx.fillStyle = on ? (winning && i % 3 === 0 ? PINK : '#fff4c2') : '#5a3a1a';
      if (on) glow(ctx, '#ffd166', 12);
      ctx.beginPath(); ctx.arc(bx, by, 4.2 * k, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    }
    // title
    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const tsize = Math.min(44, (mq.w / k) / 11);
    ctx.font = F(tsize, 900);
    const title = tr('BANDIT MANCHOT', 'ONE-ARMED BANDIT');
    const tg = ctx.createLinearGradient(0, mq.y + mq.h * 0.2, 0, mq.y + mq.h * 0.8);
    tg.addColorStop(0, '#fff7cc'); tg.addColorStop(0.5, '#ffbf00'); tg.addColorStop(1, '#ff7a00');
    glow(ctx, winning ? PINK : '#ffbf00', 22 + Math.sin(tAll * 4) * 6);
    ctx.lineWidth = 5 * k; ctx.strokeStyle = '#4a0a00'; ctx.strokeText(title, mq.x + mq.w / 2, mq.y + mq.h * 0.44);
    ctx.fillStyle = tg; ctx.fillText(title, mq.x + mq.w / 2, mq.y + mq.h * 0.44);
    ctx.shadowBlur = 0; ctx.font = F(12, 800); ctx.fillStyle = '#ff9bd6';
    ctx.fillText(tr('★ 5 LIGNES · JACKPOT 7·7·7 ★', '★ 5 LINES · 7·7·7 JACKPOT ★'), mq.x + mq.w / 2, mq.y + mq.h * 0.8);
    ctx.restore();
    // beacons on top
    for (const sx of [cab.x + 34 * k, cab.x + cab.w - 34 * k]) {
      const on = st.siren > 0 && Math.floor(tAll * 8) % 2 === (sx > cab.x + cab.w / 2 ? 1 : 0);
      ctx.save(); if (on) glow(ctx, sx > cab.x + cab.w / 2 ? '#3b82ff' : '#ff1f3d', 40);
      ctx.fillStyle = on ? (sx > cab.x + cab.w / 2 ? '#7fb0ff' : '#ff6b81') : sx > cab.x + cab.w / 2 ? '#1c2e66' : '#661020';
      ctx.beginPath(); ctx.arc(sx, cab.y + 8 * k, 11 * k, Math.PI, 0); ctx.fill(); ctx.restore();
    }

    // reel window
    const win = { x: cab.x + 30 * k, y: mq.y + mq.h + 16 * k, w: cab.w - 60 * k, h: cab.h * 0.41 };
    // chrome bezel
    ctx.save(); ctx.fillStyle = chrome(ctx, win.y - 8 * k, win.y + win.h + 8 * k); roundRect(ctx, win.x - 8 * k, win.y - 8 * k, win.w + 16 * k, win.h + 16 * k, 16 * k); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#0a0208'; roundRect(ctx, win.x, win.y, win.w, win.h, 10 * k); ctx.fill();
    const lampW = 22 * k;
    const reelsX = win.x + lampW, reelsW = win.w - lampW * 2;
    const rw = reelsW / 3;
    const cellH = win.h / 3.25;
    const R = cellH / Math.sin(0.5);
    const cy = win.y + win.h / 2;
    st.cellPos = (ri: number, row: number) => ({ x: reelsX + rw * (ri + 0.5), y: cy + R * Math.sin((row - 1) * 0.5) });
    st.trayX = cab.x + cab.w / 2; st.trayY = cab.y + cab.h * 0.93;
    st.reels.forEach((r, ri) => {
      const rx = reelsX + ri * rw + 3 * k, rwi = rw - 6 * k;
      ctx.save();
      roundRect(ctx, rx, win.y + 4 * k, rwi, win.h - 8 * k, 6 * k); ctx.clip();
      // ivory drum
      const dg = ctx.createLinearGradient(0, win.y, 0, win.y + win.h);
      dg.addColorStop(0, '#2b2420'); dg.addColorStop(0.18, '#d9cfc0'); dg.addColorStop(0.5, '#fffaf0'); dg.addColorStop(0.82, '#d9cfc0'); dg.addColorStop(1, '#2b2420');
      ctx.fillStyle = dg; ctx.fillRect(rx, win.y, rwi, win.h);
      // tease glow
      const teasing = r.tease && r.state !== 'idle' && st.reels[1].state === 'idle';
      if (teasing) { ctx.fillStyle = `rgba(255,209,102,${0.25 + 0.2 * Math.sin(tAll * 20)})`; ctx.fillRect(rx, win.y, rwi, win.h); }
      const n = r.strip.length;
      const base = Math.floor(r.pos);
      const sp = Math.abs(r.speed);
      const blur = Math.min(1, sp / 22);
      const size = Math.min(rwi * 0.78, cellH * 0.86);
      for (let i = base - 3; i <= base + 5; i++) {
        const rr = i - r.pos;
        const th = (rr - 1) * 0.5;
        if (Math.abs(th) > 1.45) continue;
        const y = cy + R * Math.sin(th);
        const sy = Math.cos(th);
        const symI = r.strip[mod(i, n)];
        const spr = sprite(symI);
        // win highlight
        const rowIdx = Math.round(rr);
        const isWinCell = st.mode === 'pay' && r.state === 'idle' && Math.abs(rr - rowIdx) < 0.01 && st.wins.some((wv) => LINES[wv.line][ri] === rowIdx);
        const pulse = isWinCell ? 1 + Math.sin(st.payT * 14) * 0.08 + 0.06 : 1;
        const sw = size * pulse, sh = size * sy * pulse * (1 + blur * 0.35);
        if (isWinCell) { ctx.save(); glow(ctx, GOLD, 30); ctx.fillStyle = 'rgba(255,209,102,.35)'; roundRect(ctx, rx + 4, y - cellH * sy / 2 + 3, rwi - 8, cellH * sy - 6, 8 * k); ctx.fill(); ctx.restore(); }
        if (spr) {
          if (blur > 0.15) {
            for (let gI = 3; gI >= 1; gI--) { ctx.globalAlpha = 0.18 * blur * (4 - gI) / 3; ctx.drawImage(spr, rx + rwi / 2 - sw / 2, y - sh / 2 - gI * blur * cellH * 0.22, sw, sh); }
            ctx.globalAlpha = 1 - blur * 0.45;
          }
          ctx.drawImage(spr, rx + rwi / 2 - sw / 2, y - sh / 2, sw, sh);
          ctx.globalAlpha = 1;
        }
      }
      // cylinder shading
      const sh = ctx.createLinearGradient(0, win.y, 0, win.y + win.h);
      sh.addColorStop(0, 'rgba(0,0,0,.85)'); sh.addColorStop(0.2, 'rgba(0,0,0,.1)'); sh.addColorStop(0.5, 'rgba(255,255,255,.0)'); sh.addColorStop(0.8, 'rgba(0,0,0,.1)'); sh.addColorStop(1, 'rgba(0,0,0,.85)');
      ctx.fillStyle = sh; ctx.fillRect(rx, win.y, rwi, win.h);
      if (blur > 0.3) { ctx.fillStyle = `rgba(255,255,255,${blur * 0.08})`; for (let q = 0; q < 5; q++) ctx.fillRect(rx + rwi * (0.15 + q * 0.18), win.y, 2, win.h); }
      // landing thump flash
      if (r.state === 'idle' && st.t - r.landedAt < 0.15) { ctx.fillStyle = `rgba(255,255,255,${0.35 * (1 - (st.t - r.landedAt) / 0.15)})`; ctx.fillRect(rx, win.y, rwi, win.h); }
      ctx.restore();
      if (teasing) { ctx.save(); glow(ctx, GOLD, 30); ctx.strokeStyle = GOLD; ctx.lineWidth = 4 * k; roundRect(ctx, rx, win.y + 4 * k, rwi, win.h - 8 * k, 6 * k); ctx.stroke(); ctx.restore(); }
    });
    // dividers
    for (let i = 1; i < 3; i++) { ctx.fillStyle = chrome(ctx, win.y, win.y + win.h); ctx.fillRect(reelsX + i * rw - 2 * k, win.y, 4 * k, win.h); }
    // payline lamps
    LINES.forEach((L, li) => {
      const lit = st.mode === 'pay' && st.wins.some((wv) => wv.line === li);
      const yl = cy + R * Math.sin((L[0] - 1) * 0.5), yr = cy + R * Math.sin((L[2] - 1) * 0.5);
      const offL = li === 1 || li === 2 ? (li === 1 ? -1 : 1) * cellH * 0.18 : li >= 3 ? (L[0] === 0 ? 1 : -1) * cellH * 0.18 : 0;
      const offR = li === 1 || li === 2 ? (li === 1 ? -1 : 1) * cellH * 0.18 : li >= 3 ? (L[2] === 0 ? 1 : -1) * cellH * 0.18 : 0;
      for (const [x, y] of [[win.x + lampW / 2, yl + offL], [win.x + win.w - lampW / 2, yr + offR]]) {
        ctx.save(); if (lit) glow(ctx, LINE_COL[li], 16);
        ctx.fillStyle = lit ? LINE_COL[li] : `${LINE_COL[li]}55`; ctx.beginPath(); ctx.arc(x, y, 8 * k, 0, 7); ctx.fill();
        ctx.fillStyle = lit ? '#000' : '#fff'; ctx.font = F(9, 900); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(li + 1), x, y + 0.5);
        ctx.restore();
      }
    });
    // winning lines drawn across
    if (st.mode === 'pay' || (st.mode === 'cool' && st.wins.length)) {
      const showI = Math.floor(st.payT / 0.6) % Math.max(1, st.wins.length);
      st.wins.forEach((wv, wi) => {
        if (st.wins.length > 1 && wi !== showI && st.payT > 0.6) return;
        const L = LINES[wv.line];
        ctx.save(); glow(ctx, LINE_COL[wv.line], 20); ctx.strokeStyle = LINE_COL[wv.line]; ctx.lineWidth = 5 * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const dash = Math.min(1, st.payT / 0.35);
        ctx.beginPath();
        const pts = [[win.x + lampW / 2, cy + R * Math.sin((L[0] - 1) * 0.5)], ...L.map((row, ri) => [reelsX + rw * (ri + 0.5), cy + R * Math.sin((row - 1) * 0.5)]), [win.x + win.w - lampW / 2, cy + R * Math.sin((L[2] - 1) * 0.5)]];
        const tot = pts.length - 1, upto = dash * tot;
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let p = 1; p <= tot; p++) {
          if (p <= upto) ctx.lineTo(pts[p][0], pts[p][1]);
          else { const f = upto - (p - 1); if (f > 0) ctx.lineTo(pts[p - 1][0] + (pts[p][0] - pts[p - 1][0]) * f, pts[p - 1][1] + (pts[p][1] - pts[p - 1][1]) * f); break; }
        }
        ctx.stroke(); ctx.restore();
      });
    }
    // glass reflection
    ctx.save(); roundRect(ctx, win.x, win.y, win.w, win.h, 10 * k); ctx.clip();
    const gl = ctx.createLinearGradient(win.x, win.y, win.x + win.w * 0.6, win.y + win.h);
    gl.addColorStop(0, 'rgba(255,255,255,.14)'); gl.addColorStop(0.35, 'rgba(255,255,255,.03)'); gl.addColorStop(0.36, 'rgba(255,255,255,0)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gl; ctx.fillRect(win.x, win.y, win.w, win.h);
    ctx.restore();

    // LCD row
    const lcdY = win.y + win.h + 22 * k, lcdH = cab.h * 0.1;
    const lcdW = (cab.w - 60 * k - 2 * 12 * k) / 3;
    const shownStack = st.mode === 'pay' ? st.stackBefore + st.win * Math.min(1, st.payT / st.payDur) : st.stack;
    const shownWin = st.mode === 'pay' ? st.win * Math.min(1, st.payT / st.payDur) : st.win;
    const lcds: [string, string, string, number][] = [
      [tr('CRÉDITS', 'CREDITS'), fmt(shownStack), shownStack >= st.start ? '#a3ff8a' : '#ff8a8a', 0],
      [tr('MISE', 'BET'), `${fmt(betAmt())}`, GOLD, st.betBump],
      [tr('GAIN', 'WIN'), st.win > 0 ? fmt(shownWin) : '—', st.win > 0 ? '#ffe14d' : '#7a5a7a', st.mode === 'pay' ? 1 : 0],
    ];
    lcds.forEach(([lab, val, col, bump], i) => {
      const x = cab.x + 30 * k + i * (lcdW + 12 * k);
      ctx.fillStyle = chrome(ctx, lcdY - 3, lcdY + lcdH + 3); roundRect(ctx, x - 3, lcdY - 3, lcdW + 6, lcdH + 6, 9 * k); ctx.fill();
      ctx.fillStyle = '#050104'; roundRect(ctx, x, lcdY, lcdW, lcdH, 7 * k); ctx.fill();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = F(10, 800); ctx.fillStyle = '#ff9bd6'; ctx.fillText(lab, x + lcdW / 2, lcdY + lcdH * 0.24);
      ctx.save(); glow(ctx, col, 12 + bump * 14);
      let fs = 22 * (1 + bump * 0.15); ctx.font = M(fs, 800);
      while (ctx.measureText(val).width > lcdW - 10 && fs > 9) { fs -= 1; ctx.font = M(fs, 800); }
      ctx.fillStyle = col; ctx.fillText(val, x + lcdW / 2, lcdY + lcdH * 0.64); ctx.restore();
    });
    // controls: bet chips + spin button
    const ctlY = lcdY + lcdH + 16 * k, ctlH = cab.h * 0.1;
    const spinW = Math.min(cab.w * 0.3, 150 * k);
    const chipsW = cab.w - 60 * k - spinW - 14 * k;
    const chipW = chipsW / BETS.length;
    BETS.forEach((b, i) => {
      const x = cab.x + 30 * k + i * chipW + chipW / 2, y = ctlY + ctlH / 2;
      const r = Math.min(chipW * 0.42, ctlH * 0.48);
      const sel = i === st.bet;
      const col = ['#22d3ee', '#a3e635', '#ffd166', '#ff2d95'][i];
      ctx.save();
      if (sel) glow(ctx, col, 22);
      ctx.translate(x, y - (sel ? 3 * k + st.betBump * 4 : 0));
      ctx.fillStyle = sel ? col : '#2a1424'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = sel ? '#fff' : col; ctx.lineWidth = 3 * k; ctx.setLineDash([5 * k, 4 * k]); ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = sel ? '#14040f' : col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = F(Math.min(16, r / k * 0.55), 900);
      ctx.fillText(i === 3 ? 'YOLO' : `${Math.round(b * 100)}%`, 0, 1);
      ctx.restore();
      st.btns.push({ x: x - r, y: y - r, w: r * 2, h: r * 2, act: () => { if (st.mode === 'ready' || st.mode === 'cool') { if (st.bet !== i) { st.bet = i; st.betBump = 1; sfx.coin(); } } } });
    });
    ctx.textAlign = 'center'; ctx.font = F(10, 700); ctx.fillStyle = 'rgba(255,200,240,.6)';
    ctx.fillText(tr('← →  MISE', '← →  BET'), cab.x + 30 * k + chipsW / 2, ctlY + ctlH + 8 * k);
    // spin button
    const sbx = cab.x + cab.w - 30 * k - spinW, sby = ctlY;
    const ready = st.mode === 'ready' && !st.over && g.phase === 'play';
    ctx.save();
    const sg = ctx.createLinearGradient(0, sby, 0, sby + ctlH);
    sg.addColorStop(0, ready ? '#ff5b8a' : '#7a2a44'); sg.addColorStop(1, ready ? '#b0003a' : '#3a0a1a');
    glow(ctx, ready ? PINK : '#000', ready ? 20 + Math.sin(tAll * 6) * 10 : 0);
    ctx.fillStyle = sg; roundRect(ctx, sbx, sby, spinW, ctlH, ctlH / 2); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,.28)'; roundRect(ctx, sbx + 6, sby + 4, spinW - 12, ctlH * 0.4, ctlH / 3); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = F(20, 900);
    ctx.fillText(st.mode === 'spin' ? 'STOP' : tr('LANCER', 'SPIN'), sbx + spinW / 2, sby + ctlH * 0.45);
    ctx.font = F(9, 700); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillText(tr('ESPACE', 'SPACE'), sbx + spinW / 2, sby + ctlH * 0.8);
    ctx.restore();
    st.btns.push({ x: sbx, y: sby, w: spinW, h: ctlH, act: spin });
    // spins left (pips)
    const pipY = ctlY + ctlH + 22 * k;
    ctx.textAlign = 'left'; ctx.font = F(10, 800); ctx.fillStyle = '#ff9bd6';
    ctx.fillText(tr('TOURS', 'SPINS'), cab.x + 30 * k, pipY);
    for (let i = 0; i < SPINS; i++) {
      const used = i < st.spinsDone;
      const px = cab.x + 76 * k + i * 15 * k;
      ctx.fillStyle = used ? '#3a1a30' : GOLD; if (!used) glow(ctx, GOLD, 8);
      ctx.beginPath(); ctx.arc(px, pipY, 5 * k, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.textAlign = 'right'; ctx.fillStyle = '#ffd6f0'; ctx.font = F(11, 800);
    ctx.fillText(`${st.spinsLeft} / ${SPINS}`, cab.x + cab.w - 30 * k, pipY);
    // coin tray
    const tray = { x: cab.x + cab.w * 0.22, y: cab.y + cab.h - cab.h * 0.07 - 10 * k, w: cab.w * 0.56, h: cab.h * 0.07 };
    if (tray.y > pipY + 8 * k) {
      ctx.fillStyle = chrome(ctx, tray.y, tray.y + tray.h); roundRect(ctx, tray.x, tray.y, tray.w, tray.h, 10 * k); ctx.fill();
      ctx.fillStyle = '#0c0309'; roundRect(ctx, tray.x + 6 * k, tray.y + 5 * k, tray.w - 12 * k, tray.h - 9 * k, 7 * k); ctx.fill();
      // pile of coins proportional to the stack
      const pile = Math.max(0, Math.min(28, Math.round((st.stack / st.start) * 10)));
      for (let i = 0; i < pile; i++) {
        const px = tray.x + 16 * k + ((i * 37) % Math.max(1, (tray.w - 32 * k))), py = tray.y + tray.h - 9 * k - Math.floor(i / 9) * 3 * k;
        ctx.fillStyle = '#b88400'; ctx.beginPath(); ctx.ellipse(px, py + 1.5, 9 * k, 3.5 * k, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.ellipse(px, py, 9 * k, 3.5 * k, 0, 0, 7); ctx.fill();
      }
    }

    // lever
    const pv = { x: cab.x + cab.w + 4 * k, y: win.y + win.h * 0.62 };
    const lt = st.lever;
    let ang = -1.25; // radians from +x: pointing up-right
    if (lt > 0) {
      if (lt < 0.16) ang = -1.25 + (lt / 0.16) * 2.15;
      else if (lt < 0.26) ang = 0.9;
      else { const u = lt - 0.26; ang = -1.25 + 2.15 * Math.exp(-u * 6) * Math.cos(u * 14); }
    }
    const len = Math.min(cab.h * 0.32, 200 * k) * (narrow ? 0.75 : 1);
    ctx.save();
    ctx.fillStyle = chrome(ctx, pv.y - 26 * k, pv.y + 26 * k); roundRect(ctx, pv.x - 6 * k, pv.y - 26 * k, 22 * k, 52 * k, 8 * k); ctx.fill();
    const kx = pv.x + 14 * k + Math.cos(ang) * len * 0.35, ky = pv.y + Math.sin(ang) * len;
    ctx.strokeStyle = chrome(ctx, Math.min(pv.y, ky), Math.max(pv.y, ky) + 1); ctx.lineWidth = 9 * k; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(pv.x + 14 * k, pv.y); ctx.lineTo(kx, ky); ctx.stroke();
    const kr = 17 * k;
    const kg = ctx.createRadialGradient(kx - kr * 0.35, ky - kr * 0.35, kr * 0.1, kx, ky, kr);
    kg.addColorStop(0, '#ffb3c6'); kg.addColorStop(0.4, '#ff1f5a'); kg.addColorStop(1, '#6a0020');
    glow(ctx, PINK, ready ? 20 + Math.sin(tAll * 6) * 8 : 6);
    ctx.fillStyle = kg; ctx.beginPath(); ctx.arc(kx, ky, kr, 0, 7); ctx.fill();
    ctx.restore();
    st.btns.push({ x: pv.x - 10 * k, y: Math.min(pv.y, ky) - kr - 10, w: leverW + 20 * k, h: Math.abs(pv.y - ky) + kr * 2 + 40, act: spin });
    st.btns.push({ x: win.x, y: win.y, w: win.w, h: win.h, act: spin });

    // paytable
    if (showTable) {
      const pw = Math.min(210 * k, cab.x - 28 * k), px = Math.max(12 * k, cab.x - pw - 22 * k);
      const ph = Math.min(h * 0.86, 30 * k * (SYMS.length + 2) + 30 * k);
      const py = (h - ph) / 2;
      ctx.save(); ctx.fillStyle = 'rgba(15,3,14,.78)'; roundRect(ctx, px, py, pw, ph, 14 * k); ctx.fill();
      glow(ctx, GOLD, 12); ctx.strokeStyle = 'rgba(255,209,102,.6)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = F(14, 900); ctx.fillStyle = GOLD;
      ctx.fillText(tr('GAINS (× mise/ligne)', 'PAYS (× line bet)'), px + pw / 2, py + 20 * k);
      const order = [SEVEN, WILD, 5, 4, 2, 1, 0, 3];
      order.forEach((si, i) => {
        const yy = py + 48 * k + i * 30 * k;
        const spr = sprite(si);
        for (let j = 0; j < 3; j++) if (spr) ctx.drawImage(spr, px + 12 * k + j * 25 * k, yy - 12 * k, 24 * k, 24 * k);
        ctx.textAlign = 'right'; ctx.font = M(15, 800); ctx.fillStyle = si === SEVEN ? '#ff6b6b' : si === WILD ? '#ffe14d' : '#ffe9f6';
        ctx.fillText(`×${SYMS[si].pay}`, px + pw - 12 * k, yy);
      });
      const yy = py + 48 * k + order.length * 30 * k;
      const cs = sprite(CHERRY);
      if (cs) { ctx.drawImage(cs, px + 12 * k, yy - 12 * k, 24 * k, 24 * k); ctx.drawImage(cs, px + 37 * k, yy - 12 * k, 24 * k, 24 * k); }
      ctx.font = F(13, 800); ctx.fillStyle = '#ffe9f6'; ctx.textAlign = 'left'; ctx.fillText('…', px + 64 * k, yy);
      ctx.textAlign = 'right'; ctx.font = M(15, 800); ctx.fillText('×2', px + pw - 12 * k, yy);
      ctx.textAlign = 'center'; ctx.font = F(10, 700); ctx.fillStyle = 'rgba(255,200,240,.65)';
      ctx.fillText(tr('🤑 remplace tout', '🤑 substitutes all'), px + pw / 2, yy + 26 * k);
    }

    // coins
    for (let i = st.coins.length - 1; i >= 0; i--) {
      const c = st.coins[i];
      c.life += dt; c.vy += 1500 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.spin += c.sv * dt;
      if (c.y > h + 40 || c.life > 6) { st.coins.splice(i, 1); continue; }
      const rx = Math.max(1.5, Math.abs(Math.cos(c.spin)) * c.r * k * 1.2), ry = c.r * k * 1.2;
      ctx.fillStyle = '#9a6a00'; ctx.beginPath(); ctx.ellipse(c.x + 1.5, c.y + 1.5, rx, ry, 0, 0, 7); ctx.fill();
      const cg = ctx.createLinearGradient(c.x - rx, c.y - ry, c.x + rx, c.y + ry);
      cg.addColorStop(0, '#fff3b0'); cg.addColorStop(0.5, '#ffc21a'); cg.addColorStop(1, '#b07800');
      ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(c.x, c.y, rx, ry, 0, 0, 7); ctx.fill();
      if (rx > ry * 0.5) { ctx.fillStyle = '#9a6a00'; ctx.font = `900 ${Math.round(ry * 1.2)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', c.x, c.y + 1); }
    }
    if (st.coins.length > 500) st.coins.splice(0, st.coins.length - 500);

    // message (near-miss / quip / broke)
    if (st.msg) {
      const m = st.msg, a = m.t < 0.15 ? m.t / 0.15 : m.t > 1.6 ? 1 - (m.t - 1.6) / 0.4 : 1;
      ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.translate(win.x + win.w / 2, win.y + win.h + 10 * k);
      const sc = m.t < 0.2 ? 0.6 + m.t * 2.5 : 1; ctx.scale(sc, sc); ctx.rotate(-0.03);
      ctx.font = F(24, 900); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const tw = ctx.measureText(m.text).width + 30 * k;
      ctx.fillStyle = 'rgba(10,0,10,.85)'; roundRect(ctx, -tw / 2, -20 * k, tw, 40 * k, 20 * k); ctx.fill();
      ctx.strokeStyle = m.col; ctx.lineWidth = 2; glow(ctx, m.col, 14); ctx.stroke();
      ctx.fillStyle = m.col; ctx.fillText(m.text, 0, 1);
      ctx.restore();
    }
    // BIG WIN / JACKPOT banner
    if (st.banner) {
      const b = st.banner, bt = b.t;
      const a = bt > 2.9 ? 1 - (bt - 2.9) / 0.5 : 1;
      const sc = bt < 0.35 ? easeOutBack(bt / 0.35) : 1 + Math.sin(bt * 6) * 0.03;
      const bx = w / 2, by = h * 0.45;
      ctx.save(); ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(0, 0, w, h);
      // rays
      ctx.translate(bx, by);
      ctx.save(); ctx.rotate(bt * 0.8);
      for (let i = 0; i < 16; i++) { ctx.rotate(Math.PI / 8); ctx.fillStyle = i % 2 ? 'rgba(255,209,102,.18)' : 'rgba(255,45,149,.14)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.max(w, h), -60 * k); ctx.lineTo(Math.max(w, h), 60 * k); ctx.fill(); }
      ctx.restore();
      ctx.scale(sc, sc); ctx.rotate(-0.06);
      const txt = b.kind === 'jackpot' ? 'JACKPOT' : b.kind === 'mega' ? 'MEGA WIN' : 'BIG WIN';
      ctx.font = F(b.kind === 'jackpot' ? 104 : 92, 900); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const tg2 = ctx.createLinearGradient(0, -60 * k, 0, 60 * k);
      tg2.addColorStop(0, '#fffbe0'); tg2.addColorStop(0.45, '#ffcc00'); tg2.addColorStop(0.55, '#ff9500'); tg2.addColorStop(1, '#ff3d00');
      ctx.lineJoin = 'round'; ctx.lineWidth = 16 * k; ctx.strokeStyle = '#3a0010'; ctx.strokeText(txt, 0, 0);
      glow(ctx, b.kind === 'jackpot' ? '#ff1f3d' : GOLD, 40); ctx.lineWidth = 6 * k; ctx.strokeStyle = b.kind === 'jackpot' ? '#ff1f3d' : PINK; ctx.strokeText(txt, 0, 0);
      ctx.shadowBlur = 0; ctx.fillStyle = tg2; ctx.fillText(txt, 0, 0);
      ctx.font = M(38, 900); ctx.fillStyle = '#fff'; glow(ctx, GOLD, 18);
      ctx.fillText(`+${fmt(st.win * Math.min(1, st.payT / Math.max(0.01, st.payDur)))}`, 0, 78 * k);
      ctx.restore();
    }
    // neon "insert coin" idle hint
    if (g.phase === 'play' && st.mode === 'ready' && !st.over && st.spinsDone === 0) {
      ctx.save(); ctx.globalAlpha = 0.6 + 0.4 * Math.sin(tAll * 5); ctx.font = F(22, 900); ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; glow(ctx, PINK, 18);
      ctx.fillText(tr('▼ TIRE LE LEVIER ! ▼', '▼ PULL THE LEVER! ▼'), win.x + win.w / 2, win.y + win.h / 2); ctx.restore();
    }
  }

  const onPointer = (e: PointerEvent) => {
    const c = canvas.current; if (!c) return;
    const r = c.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    for (const b of st.btns) if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { b.act(); return; }
  };

  return (
    <Arena g={g} title={tr('Machine à sous', 'Slot machine')} icon="🎰" theme="casino" scoreLabel="POINTS"
      howTo={tr(`Tire le levier, prie, recommence. ${SPINS} tours pour faire sauter la banque : 5 lignes gagnantes, 🤑 remplace tout, 7·7·7 = JACKPOT. Choisis ta mise (1 %, 5 %, 10 % ou YOLO).`, `Pull the lever, pray, repeat. ${SPINS} spins to break the bank: 5 paylines, 🤑 is wild, 7·7·7 = JACKPOT. Pick your bet (1%, 5%, 10% or YOLO).`)}
      keys={[tr('Espace = levier', 'Space = pull'), tr('← → = mise', '← → = bet'), tr('Espace (en vol) = stop', 'Space (spinning) = stop')]}>
      <canvas class="play" ref={canvas} onPointerDown={onPointer} style={{ touchAction: 'none' }} />
    </Arena>
  );
}

function chrome(ctx: CanvasRenderingContext2D, y0: number, y1: number) {
  const g = ctx.createLinearGradient(0, y0, 0, y1 === y0 ? y0 + 1 : y1);
  g.addColorStop(0, '#fdfdfd'); g.addColorStop(0.18, '#a8a8b3'); g.addColorStop(0.42, '#ffffff'); g.addColorStop(0.55, '#5d5d6b'); g.addColorStop(0.8, '#d9d9e3'); g.addColorStop(1, '#7a7a88');
  return g;
}

function init(l: Life) {
  const start = Math.max(100, Math.round(Math.abs(l.money || 0) * 0.2));
  const reels: Reel[] = [0, 1, 2].map(() => { const strip = makeStrip(); const p = Math.floor(Math.random() * strip.length); return { strip, pos: p, speed: 0, state: 'idle', stopAt: 0, target: p, from: 0, to: 0, lt: 0, ld: 0, tick: p, tease: false, landedAt: -10 }; });
  return {
    start, stack: start, stackBefore: start, bet: 1, spinsLeft: SPINS, spinsDone: 0, lastBet: 0, totalBet: 0,
    reels, mode: 'ready' as 'ready' | 'spin' | 'pay' | 'cool', t: 0, lever: 0, thump: 0, lastTick: 0,
    grid: [] as number[][], wins: [] as Win[], win: 0, winT: 0, payT: 0, payDur: 1, coolT: 0,
    tease: null as null | { sym: number; row: number; line: number }, nearMiss: false,
    banner: null as null | { kind: 'big' | 'mega' | 'jackpot'; t: number }, msg: null as null | { text: string; col: string; t: number },
    siren: 0, betBump: 0, coins: [] as Coin[], btns: [] as Btn[], W: 800, H: 600, trayX: 400, trayY: 560,
    cellPos: (_ri: number, _row: number): { x: number; y: number } | null => null,
    winsCount: 0, biggest: 0, jackpots: 0, nearMisses: 0, over: false, overT: 0, ended: false, errLogged: false,
  };
}
