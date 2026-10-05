// Prison break: top-down stealth. Flashlight cones, sweeping cameras, shadows to hide in, a key, an exit, a siren.
import { useRef } from 'preact/hooks';
import { useGame, useCanvas, useKeys, Arena, tr, glow, roundRect, type GameProps } from './kit.tsx';
import { sfx, synth } from '../../audio.ts';

const DURATION = 40;
// # wall  = bars  c crate  , cell floor  s shadow  K key  E exit  P start  . floor
const MAP = [
  '##############################',
  '#,,,#,,,#,,,#,,,#,,,#ss..cc..#',
  '#,P,#,,,#,,,#,,,#,,,#s.....s.#',
  '#,,,#,,,#,,,#,,,#,,,#........#',
  '##.###=###=###=###=##..cc....#',
  '#ss..................ss......#',
  '#s...........................#',
  '#...####.####....#####..cc...#',
  '#...#sss...K#....#sss#..cc..s#',
  '#...#s......#....#...#......s#',
  '#...#............#...........E',
  '#...#########....##.##.......#',
  '#s...........................#',
  '#ss..........................#',
  '##=###=###=###=###=##..cc...s#',
  '#,,,#,,,#,,,#,,,#,,,#ss.....s#',
  '##############################',
];
const W = MAP[0].length, H = MAP.length;
const at = (x: number, y: number) => (x < 0 || y < 0 || x >= W || y >= H ? '#' : MAP[y][x]);
const blocks = (x: number, y: number) => { const c = at(Math.floor(x), Math.floor(y)); return c === '#' || c === '=' || c === 'c' || c === 'E'; };
const find = (ch: string): [number, number] => { for (let y = 0; y < H; y++) { const x = MAP[y].indexOf(ch); if (x >= 0) return [x, y]; } return [1, 1]; };
const START = find('P'), KEY = find('K'), EXIT = find('E');
const LAMPS: [number, number][] = [[7, 5.5], [16, 6], [24, 5.5], [8, 12.5], [17, 12.5], [25, 12], [8.5, 9.5], [14.5, 9], [25, 2.5], [19.5, 9]];

interface Guard { x: number; y: number; a: number; wp: [number, number][]; wi: number; pause: number; path: [number, number][]; pathT: number; susp: number; look: number; heard: number; step: number }
interface Cam { x: number; y: number; base: number; amp: number; sp: number; a: number; susp: number }

function bfs(sx: number, sy: number, tx: number, ty: number): [number, number][] {
  sx = Math.floor(sx); sy = Math.floor(sy); tx = Math.floor(tx); ty = Math.floor(ty);
  if (blocks(tx, ty)) return [];
  const prev = new Int32Array(W * H).fill(-1);
  const q = [sy * W + sx]; prev[sy * W + sx] = sy * W + sx;
  const goal = ty * W + tx;
  for (let qi = 0; qi < q.length; qi++) {
    const cur = q[qi]; if (cur === goal) break;
    const cx = cur % W, cy = (cur / W) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, ny = cy + dy;
      if (blocks(nx, ny)) continue;
      const ni = ny * W + nx; if (prev[ni] !== -1) continue;
      prev[ni] = cur; q.push(ni);
    }
  }
  if (prev[goal] === -1) return [];
  const out: [number, number][] = [];
  let c = goal;
  while (c !== sy * W + sx) { out.push([c % W, (c / W) | 0]); c = prev[c]; }
  return out.reverse();
}
function ray(x: number, y: number, a: number, max: number) {
  const dx = Math.cos(a) * 0.08, dy = Math.sin(a) * 0.08;
  let d = 0;
  while (d < max) { x += dx; y += dy; d += 0.08; if (blocks(x, y)) return d; }
  return max;
}
const angDiff = (a: number, b: number) => { let d = a - b; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return d; };

export function Escape2({ onDone }: GameProps) {
  const g = useGame({ duration: DURATION, onDone });
  const gr = useRef(g); gr.current = g;
  const mk = (x: number, y: number, a: number, wp: [number, number][]): Guard => ({ x: x + 0.5, y: y + 0.5, a, wp, wi: 0, pause: 0, path: [], pathT: 0, susp: 0, look: 0, heard: 0, step: 0 });
  const s = useRef({
    px: START[0] + 0.5, py: START[1] + 0.5, pa: Math.PI / 2, keys: new Set<string>(), stamina: 1, sprint: false, hasKey: false, alarm: 0, alarms: 0, seenX: 0, seenY: 0,
    guards: [mk(14, 6, 0, [[25, 6], [3, 6]]), mk(14, 12, Math.PI, [[2, 12], [26, 13]]), mk(23, 2, Math.PI / 2, [[27, 9], [23, 15], [27, 9], [23, 2]]), mk(6, 9, 0, [[10, 10], [9, 8], [6, 9]])],
    cams: [{ x: 13.15, y: 7.15, base: Math.PI * 0.3, amp: 0.65, sp: 0.9, a: 0, susp: 0 }, { x: 28.8, y: 5.2, base: Math.PI * 0.72, amp: 0.38, sp: 0.7, a: 0, susp: 0 }] as Cam[],
    t: 0, walk: 0, siren: 0, ended: false, end: null as null | { win: boolean; t: number; why: string }, dist: 0, spotted: 0, hidden: false, lockMsg: 0, ptr: null as null | { x: number; y: number },
    dark: null as HTMLCanvasElement | null, stat: null as HTMLCanvasElement | null, statKey: '', lay: { ox: 0, oy: 0, ts: 1 }, steps: [] as { x: number; y: number; t: number }[], rings: [] as { x: number; y: number; t: number; c: string }[],
  });
  useKeys((e) => s.current.keys.add(e.code), (e) => s.current.keys.delete(e.code));
  const toPct = (x: number, y: number): [number, number] => {
    const L = s.current.lay; const r = cref.current?.getBoundingClientRect();
    if (!r) return [50, 50];
    return [((r.left + L.ox + x * L.ts) / window.innerWidth) * 100, ((r.top + L.oy + y * L.ts) / window.innerHeight) * 100];
  };
  const finish = (win: boolean, why: string) => {
    const st = s.current; if (st.end) return;
    st.end = { win, t: 0, why };
    const G = gr.current;
    const el = DURATION - Math.max(0, G.time);
    if (win) {
      G.flash('#7dffbf'); G.burst(...toPct(EXIT[0] + 0.5, EXIT[1] + 0.5), '#06d6a0', 40); G.burst(...toPct(st.px, st.py), '#ffd166', 30);
      G.float(tr('ÉVADÉ !', 'ESCAPED!'), 50, 40, '#7dffbf', true); G.add(1000 + Math.round(Math.max(0, G.time) * 40)); G.hit('perfect');
      sfx.good(); setTimeout(() => sfx.cash(), 200);
    } else {
      G.flash('#ff1f3d'); G.shake(); sfx.punch(); setTimeout(() => sfx.bad(), 150);
      G.float(why === 'time' ? tr('TROP TARD !', 'TOO LATE!') : tr('CHOPÉ !', 'BUSTED!'), 50, 40, '#ff4d6d', true);
      if (why !== 'time') { sfx.siren(); }
    }
    setTimeout(() => {
      let score: number;
      if (win) score = 1 - st.alarms * 0.12 - Math.max(0, el - 20) / 20 * 0.2;
      else {
        const goal = st.hasKey ? EXIT : KEY;
        const d0 = Math.hypot(goal[0] - (st.hasKey ? KEY[0] : START[0]), goal[1] - (st.hasKey ? KEY[1] : START[1]));
        const prog = Math.max(0, 1 - Math.hypot(goal[0] + 0.5 - st.px, goal[1] + 0.5 - st.py) / Math.max(1, d0));
        score = Math.min(0.42, 0.05 + (st.hasKey ? 0.18 : 0) + prog * 0.12 + Math.min(0.07, (el / DURATION) * 0.07));
      }
      if (win) score = Math.max(0.55, score);
      G.end(score, [
        [tr('Résultat', 'Result'), win ? tr('🏃 ÉVADÉ', '🏃 ESCAPED') : why === 'time' ? tr('⏰ PROJECTEURS', '⏰ SEARCHLIGHTS') : tr('🚨 RATTRAPÉ', '🚨 CAUGHT')],
        [tr('Temps', 'Time'), `${el.toFixed(1)} s`],
        [tr('Clé', 'Key'), st.hasKey ? '🔑 ✓' : '✗'],
        [tr('Alarmes', 'Alarms'), st.alarms ? `🚨 × ${st.alarms}` : tr('Aucune, fantôme 👻', 'None, ghost 👻')],
        [tr('Distance', 'Distance'), `${Math.round(st.dist * 2)} m`],
      ]);
    }, 1300);
  };

  const cref = useCanvas((ctx, w, h, dt, t) => {
    const st = s.current;
    const G = g;
    const playing = G.phase === 'play' && !st.end;
    st.t += dt;
    // ── layout ──
    const ts = Math.floor(Math.min(w / W, (h - 4) / H) * 100) / 100;
    const ox = Math.round((w - ts * W) / 2), oy = Math.round((h - ts * H) / 2);
    st.lay = { ox, oy, ts };
    const X = (x: number) => ox + x * ts, Y = (y: number) => oy + y * ts;

    for (const c of st.cams) c.a = c.base + Math.sin(st.t * c.sp) * c.amp;
    if (playing) {
      try { update(dt); } catch { /* never throw */ }
    }
    if (st.end) st.end.t += dt;

    // ── static map (cached) ──
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const key = `${w}x${h}x${dpr}`;
    if (st.statKey !== key || !st.stat) { st.stat = renderStatic(w, h, ox, oy, ts, dpr); st.statKey = key; }
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#05060b'; ctx.fillRect(0, 0, w, h);
    ctx.drawImage(st.stat, 0, 0, w, h);

    // footsteps
    for (let i = st.steps.length - 1; i >= 0; i--) { const f = st.steps[i]; f.t += dt; if (f.t > 1.6) { st.steps.splice(i, 1); continue; } ctx.fillStyle = `rgba(255,170,90,${0.25 * (1 - f.t / 1.6)})`; ctx.beginPath(); ctx.arc(X(f.x), Y(f.y), ts * 0.06, 0, Math.PI * 2); ctx.fill(); }
    // exit door
    {
      const ex = X(EXIT[0]), ey = Y(EXIT[1]);
      const col = st.hasKey ? '#06d6a0' : '#ff3355';
      ctx.save(); glow(ctx, col, st.hasKey ? 24 + 10 * Math.sin(t * 6) : 10);
      ctx.fillStyle = st.hasKey ? '#0b3d2a' : '#3a0a12'; ctx.fillRect(ex + ts * 0.15, ey + ts * 0.05, ts * 0.7, ts * 0.9);
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.strokeRect(ex + ts * 0.15, ey + ts * 0.05, ts * 0.7, ts * 0.9);
      ctx.restore();
      ctx.font = `${ts * 0.5}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(st.hasKey ? '🚪' : '🔒', ex + ts / 2, ey + ts / 2);
      if (st.hasKey && !st.end) { // guiding arrow
        const k = (Math.sin(t * 7) + 1) / 2;
        ctx.save(); glow(ctx, '#06d6a0', 16); ctx.fillStyle = '#06d6a0';
        ctx.font = `900 ${ts * 0.7}px Fredoka Variable, sans-serif`; ctx.fillText('➜', ex - ts * (0.7 + k * 0.3), ey + ts / 2); ctx.restore();
      }
    }
    // key
    if (!st.hasKey) {
      const kx = X(KEY[0] + 0.5), ky = Y(KEY[1] + 0.5) + Math.sin(t * 3) * ts * 0.08;
      ctx.save(); glow(ctx, '#ffd166', 20 + 8 * Math.sin(t * 5)); drawKey(ctx, kx, ky, ts * 0.42, t); ctx.restore();
      if (Math.floor(t * 3) % 4 === 0) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(kx + ts * 0.25, ky - ts * 0.2, 1.8, 0, Math.PI * 2); ctx.fill(); }
    }
    // guards (bodies under the darkness so cones read as light)
    for (const gd of st.guards) drawGuard(ctx, X(gd.x), Y(gd.y), ts, gd.a, gd.step, st.alarm > 0);
    for (const c of st.cams) drawCam(ctx, X(c.x), Y(c.y), ts, c.a, st.alarm > 0 || c.susp > 0.3);

    // ── darkness with light cut-outs ──
    if (!st.dark) st.dark = document.createElement('canvas');
    const dk = st.dark;
    if (dk.width !== Math.round(w) || dk.height !== Math.round(h)) { dk.width = Math.round(w); dk.height = Math.round(h); }
    const d = dk.getContext('2d');
    const cones: { x: number; y: number; pts: [number, number][]; col: string; r: number }[] = [];
    for (const gd of st.guards) cones.push({ x: gd.x, y: gd.y, pts: cone(gd.x, gd.y, gd.a, 0.5, 5.5), col: st.alarm > 0 || gd.susp > 0.6 ? '255,60,70' : gd.susp > 0.15 ? '255,190,80' : '255,236,160', r: 5.5 });
    for (const c of st.cams) cones.push({ x: c.x, y: c.y, pts: cone(c.x, c.y, c.a, 0.36, 6.5), col: st.alarm > 0 || c.susp > 0.2 ? '255,60,70' : '140,220,255', r: 6.5 });
    if (d) {
      d.globalCompositeOperation = 'source-over';
      d.clearRect(0, 0, dk.width, dk.height);
      d.fillStyle = st.alarm > 0 ? `rgba(30,0,6,${0.66 + 0.08 * Math.sin(t * 8)})` : 'rgba(3,5,16,0.7)';
      d.fillRect(0, 0, dk.width, dk.height);
      d.globalCompositeOperation = 'destination-out';
      const hole = (x: number, y: number, r: number, a: number) => { const gg = d.createRadialGradient(X(x), Y(y), 0, X(x), Y(y), r * ts); gg.addColorStop(0, `rgba(0,0,0,${a})`); gg.addColorStop(1, 'rgba(0,0,0,0)'); d.fillStyle = gg; d.beginPath(); d.arc(X(x), Y(y), r * ts, 0, Math.PI * 2); d.fill(); };
      for (const [lx, ly] of LAMPS) hole(lx, ly, 2.6, 0.55 + 0.05 * Math.sin(t * 13 + lx));
      hole(st.px, st.py, 1.8, 0.65);
      if (!st.hasKey) hole(KEY[0] + 0.5, KEY[1] + 0.5, 1.2, 0.6);
      hole(EXIT[0] + 0.3, EXIT[1] + 0.5, 1.5, st.hasKey ? 0.8 : 0.4);
      for (const c of cones) {
        const gg = d.createRadialGradient(X(c.x), Y(c.y), 0, X(c.x), Y(c.y), c.r * ts);
        gg.addColorStop(0, 'rgba(0,0,0,1)'); gg.addColorStop(0.7, 'rgba(0,0,0,.8)'); gg.addColorStop(1, 'rgba(0,0,0,0)');
        d.fillStyle = gg; d.beginPath(); d.moveTo(X(c.x), Y(c.y)); for (const [px, py] of c.pts) d.lineTo(X(px), Y(py)); d.closePath(); d.fill();
      }
      ctx.drawImage(dk, 0, 0, w, h);
    }
    // coloured light on top
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const c of cones) {
      const gg = ctx.createRadialGradient(X(c.x), Y(c.y), 0, X(c.x), Y(c.y), c.r * ts);
      gg.addColorStop(0, `rgba(${c.col},.32)`); gg.addColorStop(1, `rgba(${c.col},0)`);
      ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(X(c.x), Y(c.y)); for (const [px, py] of c.pts) ctx.lineTo(X(px), Y(py)); ctx.closePath(); ctx.fill();
    }
    for (const [lx, ly] of LAMPS) { const gg = ctx.createRadialGradient(X(lx), Y(ly), 0, X(lx), Y(ly), ts * 2.4); gg.addColorStop(0, 'rgba(120,170,255,.10)'); gg.addColorStop(1, 'rgba(120,170,255,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(X(lx), Y(ly), ts * 2.4, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    // lamp fixtures
    for (const [lx, ly] of LAMPS) { ctx.save(); glow(ctx, '#cfe3ff', 12); ctx.fillStyle = '#e8f1ff'; ctx.fillRect(X(lx) - ts * 0.18, Y(ly) - ts * 0.05, ts * 0.36, ts * 0.1); ctx.restore(); }

    // noise rings
    for (let i = st.rings.length - 1; i >= 0; i--) { const r = st.rings[i]; r.t += dt; if (r.t > 0.6) { st.rings.splice(i, 1); continue; } ctx.strokeStyle = `rgba(${r.c},${0.5 * (1 - r.t / 0.6)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(r.x), Y(r.y), ts * (0.4 + r.t * 4), 0, Math.PI * 2); ctx.stroke(); }
    // player
    {
      const caught = st.end && !st.end.win;
      drawPlayer(ctx, X(st.px), Y(st.py), ts, st.pa, st.walk, st.hidden && !caught, caught ? st.end!.t : 0);
      if (st.hasKey) { ctx.font = `${ts * 0.36}px serif`; ctx.textAlign = 'center'; ctx.fillText('🔑', X(st.px) + ts * 0.32, Y(st.py) - ts * 0.38); }
      if (st.hidden && !st.end) { ctx.save(); ctx.font = `700 ${Math.max(9, ts * 0.3)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = '#9fb3ff'; glow(ctx, '#4c6fff', 8); ctx.fillText(tr('CACHÉ', 'HIDDEN'), X(st.px), Y(st.py) - ts * 0.62); ctx.restore(); }
    }
    // suspicion markers
    for (const gd of st.guards) {
      if (gd.susp < 0.05 && st.alarm <= 0) continue;
      const mx = X(gd.x), my = Y(gd.y) - ts * 0.75;
      const alarmed = st.alarm > 0 || gd.susp >= 1;
      ctx.save(); ctx.font = `900 ${ts * 0.6}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (alarmed) { glow(ctx, '#ff1f3d', 14); ctx.fillStyle = '#ff1f3d'; ctx.fillText('!', mx, my + Math.sin(t * 20) * 2); }
      else {
        ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.arc(mx, my, ts * 0.32, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(mx, my, ts * 0.32, -Math.PI / 2, -Math.PI / 2 + gd.susp * Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#ffd166'; ctx.font = `900 ${ts * 0.42}px Fredoka Variable, sans-serif`; ctx.fillText('?', mx, my + 1);
      }
      ctx.restore();
    }
    // alarm overlay & beacons
    if (st.alarm > 0) {
      const p = 0.5 + 0.5 * Math.sin(t * 9);
      ctx.fillStyle = `rgba(255,20,50,${0.06 + 0.1 * p})`; ctx.fillRect(0, 0, w, h);
      for (const [bx, by] of [[ox + 10, oy + 10], [ox + ts * W - 10, oy + 10], [ox + 10, oy + ts * H - 10], [ox + ts * W - 10, oy + ts * H - 10]]) {
        const a = t * 6;
        ctx.save(); ctx.translate(bx, by); ctx.globalCompositeOperation = 'lighter';
        const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.35); gg.addColorStop(0, 'rgba(255,30,60,.45)'); gg.addColorStop(1, 'rgba(255,30,60,0)');
        ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, w * 0.35, a, a + 0.5); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, w * 0.35, a + Math.PI, a + Math.PI + 0.5); ctx.closePath(); ctx.fill();
        ctx.restore();
        ctx.save(); glow(ctx, '#ff1f3d', 20); ctx.fillStyle = '#ff3355'; ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      ctx.save(); ctx.font = `900 ${Math.max(20, h * 0.06)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.6 + 0.4 * p; glow(ctx, '#ff1f3d', 24); ctx.fillStyle = '#fff'; ctx.fillText(tr('🚨 ALARME 🚨', '🚨 ALARM 🚨'), w / 2, oy + ts * 0.5 + h * 0.03); ctx.restore();
    }
    // vignette
    const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, w * 0.7);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    // objective panel
    {
      const fs = Math.max(11, Math.min(15, h * 0.024));
      const txt = st.hasKey ? tr('➜ Fonce à la SORTIE', '➜ Run to the EXIT') : tr('🔑 Pique la clé du bureau', '🔑 Steal the office key');
      ctx.save(); ctx.font = `800 ${fs}px Fredoka Variable, sans-serif`;
      const pw = Math.max(ctx.measureText(txt).width + 24, 150), ph = fs * 3.4;
      const px = ox + ts * 0.3, py = oy + ts * (H - 0.3) - ph;
      ctx.fillStyle = 'rgba(4,8,20,.8)'; roundRect(ctx, px, py, pw, ph, 10); ctx.fill(); ctx.strokeStyle = 'rgba(127,220,255,.5)'; ctx.stroke();
      ctx.fillStyle = st.hasKey ? '#7dffbf' : '#ffd166'; ctx.textBaseline = 'top'; ctx.textAlign = 'left'; ctx.fillText(txt, px + 12, py + 8);
      ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = `700 ${fs * 0.75}px Fredoka Variable, sans-serif`; ctx.fillText(tr('SPRINT', 'SPRINT'), px + 12, py + fs * 1.9);
      const bx = px + 12 + fs * 3.6, bw = pw - 24 - fs * 3.6;
      ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(bx, py + fs * 1.95, bw, fs * 0.6);
      ctx.fillStyle = st.stamina < 0.25 ? '#ff4d6d' : '#7fdcff'; glow(ctx, ctx.fillStyle as string, 8); ctx.fillRect(bx, py + fs * 1.95, bw * st.stamina, fs * 0.6);
      ctx.restore();
    }
    // end overlay
    if (st.end) {
      const k = Math.min(1, st.end.t / 0.4);
      ctx.save(); ctx.globalAlpha = k * 0.5; ctx.fillStyle = st.end.win ? '#03140c' : '#1a0005'; ctx.fillRect(0, 0, w, h); ctx.restore();
      if (!st.end.win) { ctx.save(); ctx.font = `${ts * 1.2}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha = k; ctx.fillText('🚔', X(st.px), Y(st.py) - ts * 1.2 * (1 - k)); ctx.restore(); }
    }

    function update(dt: number) {
      const k = st.keys;
      let ix = 0, iy = 0;
      if (k.has('ArrowLeft') || k.has('KeyA') || k.has('KeyQ')) ix -= 1;
      if (k.has('ArrowRight') || k.has('KeyD')) ix += 1;
      if (k.has('ArrowUp') || k.has('KeyW') || k.has('KeyZ')) iy -= 1;
      if (k.has('ArrowDown') || k.has('KeyS')) iy += 1;
      if (!ix && !iy && st.ptr) { const dx = st.ptr.x - st.px, dy = st.ptr.y - st.py, dd = Math.hypot(dx, dy); if (dd > 0.15) { ix = dx / dd; iy = dy / dd; } }
      const len = Math.hypot(ix, iy);
      const wantSprint = (k.has('ShiftLeft') || k.has('ShiftRight') || k.has('Space')) && len > 0;
      st.sprint = wantSprint && st.stamina > 0.02;
      st.stamina = Math.max(0, Math.min(1, st.stamina + (st.sprint ? -0.45 : 0.22) * dt));
      if (len > 0) {
        const sp = (st.sprint ? 6.4 : 4.1) * dt;
        const vx = (ix / len) * sp, vy = (iy / len) * sp;
        const R = 0.28;
        const free = (x: number, y: number) => !blocks(x - R, y - R) && !blocks(x + R, y - R) && !blocks(x - R, y + R) && !blocks(x + R, y + R);
        const ox0 = st.px, oy0 = st.py;
        if (free(st.px + vx, st.py)) st.px += vx;
        if (free(st.px, st.py + vy)) st.py += vy;
        const moved = Math.hypot(st.px - ox0, st.py - oy0);
        st.dist += moved;
        st.walk += moved * 3.2;
        const ta = Math.atan2(iy, ix); st.pa += angDiff(ta, st.pa) * Math.min(1, dt * 14);
        if (Math.floor(st.walk) !== Math.floor(st.walk - moved * 3.2)) { st.steps.push({ x: st.px + Math.cos(st.pa + Math.PI / 2) * 0.1 * ((Math.floor(st.walk) % 2) * 2 - 1), y: st.py + Math.sin(st.pa + Math.PI / 2) * 0.1 * ((Math.floor(st.walk) % 2) * 2 - 1), t: 0 }); if (st.sprint) { synth.noise(0.04, 0.05, 500); st.rings.push({ x: st.px, y: st.py, t: 0, c: '255,200,120' }); } else synth.noise(0.02, 0.015, 600); }
      }
      st.hidden = at(Math.floor(st.px), Math.floor(st.py)) === 's';
      // key & exit
      if (!st.hasKey && Math.hypot(KEY[0] + 0.5 - st.px, KEY[1] + 0.5 - st.py) < 0.6) {
        st.hasKey = true; const [fx, fy] = toPct(st.px, st.py);
        G.float(tr('🔑 CLÉ !', '🔑 KEY!'), fx, fy - 4, '#ffd166', true); G.burst(fx, fy, '#ffd166', 30); G.add(500); G.hit('perfect'); G.flash('#ffd166');
        [784, 988, 1175, 1568].forEach((f, i) => synth.tone(f, 0.2, 'triangle', 0.09, i * 0.07));
      }
      st.lockMsg = Math.max(0, st.lockMsg - dt);
      if (Math.hypot(EXIT[0] + 0.5 - st.px, EXIT[1] + 0.5 - st.py) < 1.0) {
        if (st.hasKey) { finish(true, 'exit'); return; }
        if (st.lockMsg <= 0) { st.lockMsg = 1.5; const [fx, fy] = toPct(st.px, st.py); G.float(tr('VERROUILLÉ 🔒', 'LOCKED 🔒'), fx, fy - 4, '#ff4d6d'); sfx.miss(); }
      }
      // alarm timer
      if (st.alarm > 0) {
        st.alarm -= dt;
        st.siren -= dt; if (st.siren <= 0) { st.siren = 2.5; sfx.siren(); }
        if (st.alarm <= 0) { const [fx] = toPct(st.px, st.py); void fx; G.float(tr('Ils t\'ont perdu…', 'They lost you…'), 50, 30, '#7fdcff'); for (const gd of st.guards) { gd.susp = 0; gd.path = []; } }
      }
      const raise = (x: number, y: number) => {
        if (st.alarm <= 0) { st.alarms++; st.spotted++; G.miss(); G.flash('#ff1f3d'); G.shake(); const [fx, fy] = toPct(x, y); G.float(tr('REPÉRÉ !', 'SPOTTED!'), fx, fy - 6, '#ff1f3d', true); sfx.siren(); st.siren = 2.5; synth.tone(880, 0.25, 'square', 0.08); synth.tone(660, 0.25, 'square', 0.08, 0.25); }
        st.alarm = 7; st.seenX = st.px; st.seenY = st.py;
      };
      const sees = (x: number, y: number, a: number, half: number, range: number) => {
        const dx = st.px - x, dy = st.py - y, dd = Math.hypot(dx, dy);
        if (dd > range) return 0;
        const lim = st.hidden ? 1.4 : range;
        if (dd > lim) return 0;
        if (Math.abs(angDiff(Math.atan2(dy, dx), a)) > half && dd > 0.7) return 0;
        if (ray(x, y, Math.atan2(dy, dx), dd) < dd - 0.05) return 0;
        return 1 - dd / range;
      };
      // cameras
      for (const c of st.cams) {
        const v = sees(c.x, c.y, c.a, 0.36, 6.5);
        if (v > 0) { c.susp += dt * (1.5 + 2 * v); if (c.susp >= 1) { raise(c.x, c.y); c.susp = 0.6; } }
        else c.susp = Math.max(0, c.susp - dt * 0.6);
      }
      // guards
      for (const gd of st.guards) {
        const v = sees(gd.x, gd.y, gd.a, 0.5, 5.5);
        if (v > 0) {
          gd.susp = Math.min(1, gd.susp + dt * (1.1 + 2.8 * v) * (st.sprint ? 1.4 : 1));
          if (gd.susp >= 1) raise(gd.x, gd.y);
          if (st.alarm > 0) { st.seenX = st.px; st.seenY = st.py; st.alarm = 7; }
        } else gd.susp = Math.max(0, gd.susp - dt * 0.35);
        // hearing a sprint
        if (st.sprint && Math.hypot(st.px - gd.x, st.py - gd.y) < 3.5 && st.alarm <= 0) { gd.heard = 1.2; gd.susp = Math.min(0.95, gd.susp + dt * 0.5); }
        gd.heard = Math.max(0, gd.heard - dt);
        // caught
        if (Math.hypot(st.px - gd.x, st.py - gd.y) < 0.62) { finish(false, 'caught'); return; }
        let speed = 1.7, target: [number, number] | null = null, face: number | null = null;
        if (st.alarm > 0) { speed = 3.5; target = [st.seenX, st.seenY]; }
        else if (gd.susp > 0.3 || gd.heard > 0) { speed = 0; face = Math.atan2(st.py - gd.y, st.px - gd.x); }
        if (target) {
          gd.pathT -= dt;
          if (gd.pathT <= 0 || !gd.path.length) { gd.path = bfs(gd.x, gd.y, target[0], target[1]); gd.pathT = 0.3; }
        } else if (speed > 0) {
          if (gd.pause > 0) {
            gd.pause -= dt; speed = 0;
            gd.a = gd.look + Math.sin((1.6 - gd.pause) * 2.4) * 0.9;
          } else if (!gd.path.length) {
            const wp = gd.wp[gd.wi];
            if (Math.floor(gd.x) === wp[0] && Math.floor(gd.y) === wp[1]) { gd.wi = (gd.wi + 1) % gd.wp.length; gd.pause = 1.6; gd.look = gd.a; }
            else gd.path = bfs(gd.x, gd.y, wp[0], wp[1]);
          }
        }
        if (face !== null) gd.a += angDiff(face, gd.a) * Math.min(1, dt * 6);
        if (speed > 0 && gd.path.length) {
          const [nx, ny] = gd.path[0];
          const tx = nx + 0.5, ty = ny + 0.5, dx = tx - gd.x, dy = ty - gd.y, dd = Math.hypot(dx, dy);
          if (dd < 0.08) gd.path.shift();
          else {
            const m = Math.min(dd, speed * dt);
            gd.x += (dx / dd) * m; gd.y += (dy / dd) * m; gd.step += m * 3;
            gd.a += angDiff(Math.atan2(dy, dx), gd.a) * Math.min(1, dt * 7);
          }
        } else if (target && !gd.path.length && Math.hypot(target[0] - gd.x, target[1] - gd.y) > 0.3) {
          const dx = target[0] - gd.x, dy = target[1] - gd.y, dd = Math.hypot(dx, dy);
          gd.x += (dx / dd) * Math.min(dd, speed * dt); gd.y += (dy / dd) * Math.min(dd, speed * dt);
        }
      }
      if (G.time <= 0) finish(false, 'time');
    }
  }, true);

  const ptr = (e: PointerEvent) => {
    const L = s.current.lay;
    if (e.buttons === 0 && e.type !== 'pointerdown') { s.current.ptr = null; return; }
    s.current.ptr = { x: (e.offsetX - L.ox) / L.ts, y: (e.offsetY - L.oy) / L.ts };
  };
  return (
    <Arena g={g} title={tr('La grande évasion', 'The great escape')} icon="⛓️" theme="ice"
      howTo={tr('Minuit, bloc C. Sors de ta cellule, pique la clé dans le bureau des matons et file par la sortie avant la relève (40 s). Évite les lampes torches et les caméras, planque-toi dans les zones d\'ombre. Repéré = alarme et matons enragés. Le sprint fait du bruit.', 'Midnight, block C. Sneak out of your cell, steal the key from the guards\' office and reach the exit before the shift change (40 s). Avoid flashlights and cameras, hide in the shadows. Spotted = alarm and angry guards. Sprinting is noisy.')}
      keys={['↑ ↓ ← →', 'WASD / ZQSD', tr('Shift = sprint', 'Shift = sprint'), tr('ou clic maintenu', 'or hold click')]}>
      <canvas class="play" ref={cref} style={{ touchAction: 'none' }}
        onPointerDown={ptr} onPointerMove={ptr} onPointerUp={() => { s.current.ptr = null; }} onPointerLeave={() => { s.current.ptr = null; }} />
    </Arena>
  );
}

function cone(x: number, y: number, a: number, half: number, range: number): [number, number][] {
  const pts: [number, number][] = [];
  const N = 34;
  for (let i = 0; i <= N; i++) {
    const aa = a - half + (2 * half * i) / N;
    const d = ray(x, y, aa, range);
    pts.push([x + Math.cos(aa) * d, y + Math.sin(aa) * d]);
  }
  return pts;
}

function renderStatic(w: number, h: number, ox: number, oy: number, ts: number, dpr: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w * dpr)); c.height = Math.max(1, Math.round(h * dpr));
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  ctx.scale(dpr, dpr);
  const X = (x: number) => ox + x * ts, Y = (y: number) => oy + y * ts;
  // floors
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = at(x, y);
    if (ch === '#') continue;
    const cell = ch === ',' || ch === 'P';
    ctx.fillStyle = cell ? ((x + y) % 2 ? '#2a2224' : '#2e2628') : ((x + y) % 2 ? '#1b2232' : '#1e2638');
    ctx.fillRect(X(x), Y(y), ts + 0.5, ts + 0.5);
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1; ctx.strokeRect(X(x) + 0.5, Y(y) + 0.5, ts - 1, ts - 1);
    if (ch === 's') {
      ctx.fillStyle = 'rgba(0,0,0,.72)'; ctx.fillRect(X(x), Y(y), ts + 0.5, ts + 0.5);
      ctx.strokeStyle = 'rgba(90,110,200,.12)'; ctx.lineWidth = 1;
      for (let k = -ts; k < ts; k += 6) { ctx.beginPath(); ctx.moveTo(X(x) + k, Y(y) + ts); ctx.lineTo(X(x) + k + ts, Y(y)); ctx.stroke(); }
    }
  }
  // yard stripes / painted lines on corridor
  ctx.strokeStyle = 'rgba(255,209,102,.18)'; ctx.setLineDash([ts * 0.4, ts * 0.3]); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(X(3), Y(6)); ctx.lineTo(X(21), Y(6)); ctx.moveTo(X(2), Y(13)); ctx.lineTo(X(21), Y(13)); ctx.stroke(); ctx.setLineDash([]);
  // cell decor: bed + toilet
  let cellI = 0;
  for (const row of [1, 15]) for (let x0 = 1; x0 < 20; x0 += 4) {
    const top = row === 1;
    const bx = X(x0) + ts * 0.12, by = top ? Y(1) + ts * 0.1 : Y(15) + ts * 0.15;
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(bx + 3, by + 3, ts * 0.8, top ? ts * 1.7 : ts * 0.7);
    ctx.fillStyle = '#5b6478'; ctx.fillRect(bx, by, ts * 0.8, top ? ts * 1.7 : ts * 0.7);
    ctx.fillStyle = '#d7dbe6'; ctx.fillRect(bx + 2, by + 2, ts * 0.8 - 4, ts * 0.32);
    if (top && x0 === START[0] - 1) { // the classic pillow decoy
      ctx.fillStyle = '#ff7a00'; roundRect(ctx, bx + 4, by + ts * 0.5, ts * 0.8 - 8, ts * 1.05, 6); ctx.fill();
      ctx.fillStyle = '#f1c27d'; ctx.beginPath(); ctx.arc(bx + ts * 0.4, by + ts * 0.22, ts * 0.13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd166'; ctx.font = `700 ${ts * 0.2}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.fillText('zZz', bx + ts * 0.62, by - ts * 0.0 + ts * 0.14);
    } else if (cellI % 2 === 0) { ctx.fillStyle = '#7a8296'; roundRect(ctx, bx + 4, by + ts * 0.5, ts * 0.8 - 8, top ? ts * 1.05 : ts * 0.15, 6); ctx.fill(); }
    // toilet
    const tx = X(x0 + 2) + ts * 0.5, ty = top ? Y(1) + ts * 0.45 : Y(15) + ts * 0.5;
    ctx.fillStyle = '#c9d1dc'; ctx.beginPath(); ctx.ellipse(tx, ty, ts * 0.2, ts * 0.26, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6d8aa8'; ctx.beginPath(); ctx.ellipse(tx, ty + 1, ts * 0.11, ts * 0.15, 0, 0, Math.PI * 2); ctx.fill();
    cellI++;
  }
  // office desk
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(X(8.2) + 4, Y(9.1) + 4, ts * 2.4, ts * 0.8);
  ctx.fillStyle = '#6b4423'; ctx.fillRect(X(8.2), Y(9.1), ts * 2.4, ts * 0.8);
  ctx.fillStyle = '#8b5a2b'; ctx.fillRect(X(8.2) + 2, Y(9.1) + 2, ts * 2.4 - 4, ts * 0.25);
  ctx.font = `${ts * 0.42}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🍩', X(8.8), Y(9.5)); ctx.fillText('☕', X(9.6), Y(9.5)); ctx.fillText('📺', X(10.3), Y(9.45));
  ctx.fillText('🗄️', X(18.6), Y(8.5)); ctx.fillText('🧺', X(20.4), Y(9.5));
  // shadows under walls (ambient occlusion)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (at(x, y) !== '#' || at(x, y + 1) === '#' || y + 1 >= H) continue;
    const gg = ctx.createLinearGradient(0, Y(y + 1), 0, Y(y + 1) + ts * 0.45);
    gg.addColorStop(0, 'rgba(0,0,0,.5)'); gg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gg; ctx.fillRect(X(x), Y(y + 1), ts + 0.5, ts * 0.45);
  }
  // walls with a front face
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = at(x, y);
    if (ch === '#') {
      ctx.fillStyle = '#4a5368'; ctx.fillRect(X(x), Y(y), ts + 0.5, ts + 0.5);
      ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(X(x), Y(y), ts + 0.5, 2);
      if (y + 1 < H && at(x, y + 1) !== '#') {
        const fy = Y(y) + ts * 0.6;
        const gg = ctx.createLinearGradient(0, fy, 0, Y(y + 1));
        gg.addColorStop(0, '#323a4d'); gg.addColorStop(1, '#232838');
        ctx.fillStyle = gg; ctx.fillRect(X(x), fy, ts + 0.5, ts * 0.4 + 0.5);
        ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(X(x), fy, ts + 0.5, 1.5);
        // bricks
        ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(X(x) + ts * ((x % 2) ? 0.3 : 0.7), fy); ctx.lineTo(X(x) + ts * ((x % 2) ? 0.3 : 0.7), Y(y + 1)); ctx.stroke();
      }
    } else if (ch === '=') {
      ctx.fillStyle = '#20283a'; ctx.fillRect(X(x), Y(y), ts + 0.5, ts + 0.5);
      for (let i = 0; i < 5; i++) {
        const bx = X(x) + ts * (0.1 + i * 0.2);
        const gg = ctx.createLinearGradient(bx - 2, 0, bx + 2, 0); gg.addColorStop(0, '#5d6678'); gg.addColorStop(0.5, '#d9e0ea'); gg.addColorStop(1, '#5d6678');
        ctx.fillStyle = gg; ctx.fillRect(bx - 1.5, Y(y), 3, ts);
      }
      ctx.fillStyle = '#8994a8'; ctx.fillRect(X(x), Y(y) + ts * 0.15, ts, 2); ctx.fillRect(X(x), Y(y) + ts * 0.85, ts, 2);
    } else if (ch === 'c') {
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(X(x) + 5, Y(y) + 6, ts - 4, ts - 4);
      ctx.fillStyle = '#8a5a2b'; ctx.fillRect(X(x) + 2, Y(y) + 2, ts - 4, ts - 4);
      ctx.strokeStyle = '#5c3a17'; ctx.lineWidth = 2; ctx.strokeRect(X(x) + 3, Y(y) + 3, ts - 6, ts - 6);
      ctx.beginPath(); ctx.moveTo(X(x) + 3, Y(y) + 3); ctx.lineTo(X(x) + ts - 3, Y(y) + ts - 3); ctx.moveTo(X(x) + ts - 3, Y(y) + 3); ctx.lineTo(X(x) + 3, Y(y) + ts - 3); ctx.stroke();
    }
  }
  // outer frame
  ctx.strokeStyle = 'rgba(127,220,255,.35)'; ctx.lineWidth = 2; ctx.strokeRect(X(0), Y(0), W * ts, H * ts);
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.font = `800 ${ts * 0.32}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(tr('BLOC C', 'BLOCK C'), X(10.5), Y(0.5)); ctx.fillText(tr('BUREAU', 'OFFICE'), X(8.5), Y(7.5)); ctx.fillText(tr('COUR', 'YARD'), X(25), Y(0.5)); ctx.fillText(tr('SORTIE', 'EXIT'), X(28), Y(10.5) - ts * 0.75);
  return c;
}

function drawKey(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, t: number) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2) * 0.3);
  ctx.strokeStyle = '#ffd166'; ctx.fillStyle = '#ffd166'; ctx.lineWidth = s * 0.18;
  ctx.beginPath(); ctx.arc(-s * 0.35, 0, s * 0.28, 0, Math.PI * 2); ctx.stroke();
  ctx.fillRect(-s * 0.1, -s * 0.08, s * 0.75, s * 0.16);
  ctx.fillRect(s * 0.4, 0, s * 0.1, s * 0.25); ctx.fillRect(s * 0.55, 0, s * 0.1, s * 0.18);
  ctx.restore();
}
function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, ts: number, a: number, walk: number, hidden: boolean, caught: number) {
  ctx.save(); ctx.translate(x, y);
  ctx.globalAlpha = hidden ? 0.55 : 1;
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(2, 3, ts * 0.3, ts * 0.24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.rotate(a);
  const sw = Math.sin(walk * Math.PI) * ts * 0.12;
  ctx.fillStyle = '#2b1a10'; // feet
  ctx.beginPath(); ctx.ellipse(sw, -ts * 0.13, ts * 0.09, ts * 0.06, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-sw, ts * 0.13, ts * 0.09, ts * 0.06, 0, 0, Math.PI * 2); ctx.fill();
  glow(ctx, '#ff7a00', hidden ? 0 : 10);
  ctx.fillStyle = '#ff7a00'; ctx.beginPath(); ctx.ellipse(0, 0, ts * 0.19, ts * 0.27, 0, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#e06a00'; ctx.fillRect(-ts * 0.04, -ts * 0.27, ts * 0.08, ts * 0.54);
  ctx.fillStyle = '#f1c27d'; ctx.beginPath(); ctx.arc(ts * 0.06, 0, ts * 0.13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3b2412'; ctx.beginPath(); ctx.arc(ts * 0.02, 0, ts * 0.12, Math.PI * 0.6, Math.PI * 1.4); ctx.fill();
  ctx.restore();
  if (caught > 0) { ctx.save(); ctx.font = `${ts * 0.5}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('⛓️', x, y); ctx.restore(); }
}
function drawGuard(ctx: CanvasRenderingContext2D, x: number, y: number, ts: number, a: number, step: number, alarm: boolean) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(2, 3, ts * 0.32, ts * 0.26, 0, 0, Math.PI * 2); ctx.fill();
  ctx.rotate(a);
  const sw = Math.sin(step * Math.PI) * ts * 0.12;
  ctx.fillStyle = '#0b0f1a';
  ctx.beginPath(); ctx.ellipse(sw, -ts * 0.14, ts * 0.1, ts * 0.065, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-sw, ts * 0.14, ts * 0.1, ts * 0.065, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = alarm ? '#3b1f8a' : '#1e3a8a'; ctx.beginPath(); ctx.ellipse(0, 0, ts * 0.21, ts * 0.3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffd166'; ctx.fillRect(-ts * 0.05, -ts * 0.22, ts * 0.06, ts * 0.06); // badge
  // flashlight arm
  ctx.fillStyle = '#1e3a8a'; ctx.fillRect(ts * 0.05, ts * 0.14, ts * 0.22, ts * 0.08);
  ctx.save(); glow(ctx, '#fff3b0', 12); ctx.fillStyle = '#fff3b0'; ctx.fillRect(ts * 0.26, ts * 0.12, ts * 0.08, ts * 0.12); ctx.restore();
  ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(ts * 0.04, 0, ts * 0.15, 0, Math.PI * 2); ctx.fill(); // cap
  ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.ellipse(ts * 0.17, 0, ts * 0.06, ts * 0.13, 0, -Math.PI / 2, Math.PI / 2); ctx.fill(); // brim
  ctx.restore();
}
function drawCam(ctx: CanvasRenderingContext2D, x: number, y: number, ts: number, a: number, hot: boolean) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  ctx.fillStyle = '#9aa3b5'; roundRect(ctx, -ts * 0.12, -ts * 0.12, ts * 0.36, ts * 0.24, 3); ctx.fill();
  ctx.fillStyle = '#2b3242'; ctx.fillRect(ts * 0.22, -ts * 0.08, ts * 0.08, ts * 0.16);
  ctx.restore();
  ctx.save(); glow(ctx, hot ? '#ff1f3d' : '#ff6b6b', 10); ctx.fillStyle = hot ? '#ff1f3d' : (Math.floor(performance.now() / 500) % 2 ? '#ff6b6b' : '#5a1a1a');
  ctx.beginPath(); ctx.arc(x, y, ts * 0.06, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
