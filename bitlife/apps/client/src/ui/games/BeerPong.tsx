// Beer pong: first-person party table, 10 red cups, drag-to-throw with a short-lived arc preview, real-ish 3D ball physics
// (table bounces, rim spins, cup walls), splashy sinks, a trash-talking opponent and a drunk meter that wrecks your vision.
import { useRef } from 'preact/hooks';
import { useGame, useCanvas, useKeys, Arena, tr, rand, glow, roundRect, type GameProps } from './kit.tsx';
import { sfx, synth } from '../../audio.ts';

const BALLS = 10, TABLE_W = 0.305, TABLE_L = 2.44, CUP_R = 0.046, CUP_H = 0.12, CUP_RB = 0.031, BALL_R = 0.02, G = 9.8;
const START = { x: 0, y: 0.3, z: 0.35 }, ELEV = 0.7, PREVIEW_T = 0.5;
const CAM = { y: 0.8, z: -0.8, phi: 0.28 };
const OUT = '#1a0b12';
const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeBack = (k: number) => { const c = 1.9, x = clamp(k, 0, 1) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };

const OPP: [string, string][] = [['Jean-Mi Cul-Sec', 'Chad Bottoms-Up'], ['Kévin la Pression', 'Kevin Keg-Stand'], ['Bastien Binge', 'Brad Binge'], ['Tonton Ricard', 'Uncle Rick'], ['Dylan Mousse', 'Dylan Foam'], ['Steevy Happy-Hour', 'Stevie Happy-Hour']];
const T_MISS: [string, string][] = [["T'as visé la Lune ?", 'Aiming for the moon?'], ['Même ma grand-mère vise mieux !', 'My grandma aims better!'], ['Dans les chips !', 'Straight into the chips!'], ["T'es déjà bourré ou quoi ?", 'Already wasted, huh?'], ['Bois, champion, bois !', 'Drink up, champ!'], ['Ouuuh, la honte !', 'Ooooh, shameful!'], ["C'est un lancer de nain ça ?", 'Was that a throw or a sneeze?'], ['Le gobelet est PAR LÀ !', 'The cups are OVER HERE!']];
const T_SINK: [string, string][] = [['Nooon, ma bière !', 'Nooo, my beer!'], ['Ok, coup de bol.', 'Okay, lucky shot.'], ['Je bois, je bois…', 'Drinking, drinking…'], ['Glou glou glou… 🤢', 'Glug glug glug… 🤢'], ['Tricheur !', 'Cheater!'], ["J'étais pas prêt !", "I wasn't ready!"]];
const T_RIM: [string, string][] = [['Hahaha, le tour du gobelet !', 'Haha, around the rim!'], ['Presque… mais non !', 'Almost… but nope!'], ['Il a fait le tour et il est ressorti !', 'In and out, baby!']];
const T_FIRE: [string, string][] = [['IL EST EN FEU !', "HE'S ON FIRE!"], ['Appelez les pompiers !', 'Call the fire department!']];
const PALETTE = ['#ff2d95', '#ffd166', '#22d3ee', '#a3e635', '#c084fc', '#ff8a00'];

interface Cup { x: number; z: number; alive: boolean; wobble: number }
interface FlyCup { x: number; z: number; t: number; vx: number; spin: number }
interface Ball { x: number; y: number; z: number; vx: number; vy: number; vz: number; bounces: number; rimmed: boolean; t: number; trail: { x: number; y: number; z: number }[] }
interface Drop { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; color: string }
interface Pop { x: number; y: number; text: string; t: number; color: string; size: number; rot: number }

function rackCups(): Cup[] {
  const cups: Cup[] = [];
  const dx = CUP_R * 2.06, dz = dx * 0.866, z0 = 2.06;
  for (let row = 0; row < 4; row++) for (let i = 0; i <= row; i++) cups.push({ x: (i - row / 2) * dx, z: z0 + row * dz, alive: true, wobble: 0 });
  return cups;
}

function newState() {
  return {
    cups: rackCups(), fly: [] as FlyCup[], drops: [] as Drop[], pops: [] as Pop[],
    phase: 'aim' as 'aim' | 'fly' | 'rim' | 'wait' | 'over',
    ball: null as Ball | null, ballsLeft: BALLS, thrown: 0,
    drag: null as null | { sx: number; sy: number; x: number; y: number; t: number }, kb: { yaw: 0, pow: 0.5, t: 99, on: false },
    rim: null as null | { cup: number; ang: number; av: number; t: number; dur: number; pIn: number; r: number },
    wait: 0, drunk: 0, drunkShow: 0, sunk: 0, streak: 0, bestStreak: 0, swishes: 0, bounceSinks: 0, rims: 0, fire: false,
    opp: pick(OPP), oppMood: 'idle' as 'idle' | 'laugh' | 'drink' | 'shock', oppT: 0,
    bubble: null as null | { text: string; t: number; dur: number },
    stamp: null as null | { text: string; t: number; color: string },
    hic: 0, hicT: 4, wall: 0, ended: false, endT: -1, shake: 0, lastPreview: [] as { x: number; y: number }[],
  };
}
type BS = ReturnType<typeof newState>;

const tick = (v = 1) => { synth.tone(2100, 0.03, 'square', 0.05 * v); synth.tone(1400, 0.04, 'triangle', 0.05 * v, 0.005); };
const clink = () => { synth.tone(1650, 0.08, 'triangle', 0.08); synth.tone(2480, 0.1, 'sine', 0.05, 0.02); };
const splash = () => { synth.noise(0.35, 0.18, 1400); synth.tone(380, 0.12, 'sine', 0.2, 0, 1.8); synth.noise(0.2, 0.08, 3500, 0.08); };
const laugh = () => { for (let i = 0; i < 4; i++) synth.tone(330 - i * 25, 0.09, 'square', 0.04, i * 0.13, 0.85); };
const hiccup = () => { synth.tone(500, 0.08, 'square', 0.06, 0, 1.8); synth.noise(0.05, 0.06, 2000); };

export function BeerPong({ onDone }: GameProps) {
  const g = useGame({ onDone });
  const s = useRef<BS | null>(null);
  if (!s.current) { s.current = newState(); if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__pong = s.current; }
  const off = useRef<HTMLCanvasElement | null>(null);
  const dims = useRef({ w: 1, h: 1, f: 1 });

  // ─── projection ───
  const proj = (x: number, y: number, z: number) => {
    const { w, h, f } = dims.current;
    const c = Math.cos(CAM.phi), sn = Math.sin(CAM.phi);
    const dy = y - CAM.y, dz = z - CAM.z;
    const zz = Math.max(0.05, dz * c - dy * sn), yy = dy * c + dz * sn;
    return { x: w / 2 + (x * f) / zz, y: h * 0.5 - (yy * f) / zz, k: f / zz };
  };

  const say = (st: BS, lines: [string, string][], dur = 1.6) => { const q = pick(lines); st.bubble = { text: tr(q[0], q[1]), t: 0, dur }; };
  const pop = (st: BS, x: number, y: number, text: string, color = '#ffd166', size = 40) => st.pops.push({ x, y, text, t: 0, color, size, rot: rand(-0.2, 0.2) });

  /** Aim parameters (with drunk wobble) → launch velocity. */
  const launch = (st: BS, yaw0: number, pow0: number, noise = 0) => {
    const d = st.drunk * (st.fire ? 0.5 : 1), t = st.wall;
    const yaw = yaw0 + d * (Math.sin(t * 1.7) * 0.055 + Math.sin(t * 3.1) * 0.025) + noise * d * rand(-0.04, 0.04);
    const pw = clamp(pow0 + d * (Math.sin(t * 2.3) * 0.04 + Math.sin(t * 0.9) * 0.025) + noise * d * rand(-0.04, 0.04), 0, 1);
    const sp = 2.9 + pw * 1.9;
    return { vx: sp * Math.cos(ELEV) * Math.sin(yaw), vy: sp * Math.sin(ELEV), vz: sp * Math.cos(ELEV) * Math.cos(yaw) };
  };
  const aimFromDrag = (dr: { sx: number; sy: number; x: number; y: number }) => {
    const { h } = dims.current;
    return { yaw: clamp((dr.x - dr.sx) / (h * 0.5), -1, 1) * 0.32, pow: clamp((dr.sy - dr.y) / (h * 0.5), 0, 1) };
  };
  const currentAim = (st: BS) => (st.drag ? aimFromDrag(st.drag) : st.kb.on ? { yaw: st.kb.yaw, pow: st.kb.pow } : null);

  const throwBall = (st: BS, yaw: number, pow: number) => {
    if (st.phase !== 'aim' || st.ballsLeft <= 0 || g.phase !== 'play') return;
    const v = launch(st, yaw, pow, 1);
    st.ball = { ...START, ...v, bounces: 0, rimmed: false, t: 0, trail: [] };
    st.phase = 'fly'; st.ballsLeft--; st.thrown++; st.drag = null; st.kb.on = false;
    sfx.whoosh();
  };

  // ─── input ───
  const toLocal = (e: PointerEvent) => { const c = e.currentTarget as HTMLCanvasElement; const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const onDown = (e: PointerEvent) => {
    const st = s.current; if (!st || st.phase !== 'aim' || g.phase !== 'play') return;
    try { (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId); } catch { /* ignore */ }
    const p = toLocal(e); st.drag = { sx: p.x, sy: p.y, x: p.x, y: p.y, t: 0 }; st.kb.on = false;
  };
  const onMove = (e: PointerEvent) => { const st = s.current; if (!st?.drag) return; const p = toLocal(e); st.drag.x = p.x; st.drag.y = p.y; };
  const onUp = () => {
    const st = s.current; if (!st?.drag) return;
    const a = aimFromDrag(st.drag);
    if (a.pow < 0.04) { st.drag = null; return; }
    throwBall(st, a.yaw, a.pow);
  };
  useKeys((e) => {
    const st = s.current; if (!st || g.phase !== 'play' || st.phase !== 'aim') return;
    const k = st.kb;
    const nudge = () => { if (!k.on) { k.on = true; k.t = 0; } else if (k.t > PREVIEW_T + 0.3) k.t = 0; };
    if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') { nudge(); k.yaw = clamp(k.yaw - 0.012, -0.32, 0.32); }
    else if (e.code === 'ArrowRight' || e.code === 'KeyD') { nudge(); k.yaw = clamp(k.yaw + 0.012, -0.32, 0.32); }
    else if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'KeyZ') { nudge(); k.pow = clamp(k.pow + 0.012, 0, 1); }
    else if (e.code === 'ArrowDown' || e.code === 'KeyS') { nudge(); k.pow = clamp(k.pow - 0.012, 0, 1); }
    else if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat && k.on) throwBall(st, k.yaw, k.pow);
  });

  const canvas = useCanvas((ctx, w, h, dt, t) => {
    const st = s.current; if (!st) return;
    try {
      dims.current = { w, h, f: 2.75 * Math.min(h, w * 0.8) };
      step(st, dt, w, h);
      // offscreen scene → main with drunk sway / blur / double vision
      const main = ctx.canvas;
      if (!off.current) off.current = document.createElement('canvas');
      const oc = off.current;
      if (oc.width !== main.width || oc.height !== main.height) { oc.width = main.width; oc.height = main.height; }
      const octx = oc.getContext('2d'); if (!octx) return;
      const dpr = main.width / w;
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawScene(octx, st, w, h, t);
      const d = st.drunkShow;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#0b0412'; ctx.fillRect(0, 0, main.width, main.height);
      const sx = Math.sin(t * 0.8) * 16 * d * dpr + (st.shake > 0 ? rand(-1, 1) * st.shake * 10 * dpr : 0), sy = Math.sin(t * 1.15) * 7 * d * dpr;
      ctx.translate(main.width / 2 + sx, main.height / 2 + sy); ctx.rotate(Math.sin(t * 0.6) * 0.035 * d); ctx.scale(1 + d * 0.06, 1 + d * 0.06); ctx.translate(-main.width / 2, -main.height / 2);
      if (d > 0.05) ctx.filter = `blur(${(d * 2.2).toFixed(2)}px)`;
      ctx.drawImage(oc, 0, 0);
      if (d > 0.08) { ctx.globalAlpha = 0.42 * Math.min(1, d * 1.4); ctx.drawImage(oc, (Math.sin(t * 1.3) * 22 + 10) * d * dpr, Math.cos(t * 0.9) * 8 * d * dpr); ctx.globalAlpha = 1; }
      ctx.filter = 'none';
      ctx.restore();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawUI(ctx, st, w, h, t);
    } catch { /* never throw from the game loop */ }
  }, true);

  // ─────────────────────────── simulation ───────────────────────────
  function step(st: BS, dt: number, w: number, h: number) {
    st.wall += dt;
    st.drunkShow += (st.drunk - st.drunkShow) * Math.min(1, dt * 1.5);
    st.shake = Math.max(0, st.shake - dt * 3);
    st.oppT += dt;
    if (st.oppMood !== 'idle' && st.oppT > 1.8) st.oppMood = 'idle';
    if (st.drag && aimFromDrag(st.drag).pow > 0.03) st.drag.t += dt;
    st.kb.t += dt;
    for (const c of st.cups) c.wobble *= Math.max(0, 1 - dt * 5);
    if (st.bubble) { st.bubble.t += dt; if (st.bubble.t > st.bubble.dur) st.bubble = null; }
    if (st.stamp) st.stamp.t += dt;
    for (let i = st.pops.length - 1; i >= 0; i--) { st.pops[i].t += dt; if (st.pops[i].t > 0.9) st.pops.splice(i, 1); }
    for (let i = st.fly.length - 1; i >= 0; i--) { const f = st.fly[i]; f.t += dt; if (f.t > 0.9) st.fly.splice(i, 1); }
    for (let i = st.drops.length - 1; i >= 0; i--) { const d = st.drops[i]; d.life += dt; if (d.life > d.max) { st.drops.splice(i, 1); continue; } d.vy += 900 * dt; d.x += d.vx * dt; d.y += d.vy * dt; }
    // hiccups when drunk: jolt the aim
    if (g.phase === 'play' && st.drunk > 0.45) { st.hicT -= dt; if (st.hicT <= 0) { st.hicT = rand(2.5, 5); hiccup(); st.shake = 0.6; pop(st, w * 0.5, h * 0.72, '*hic*', '#fde68a', 26); if (st.drag) { st.drag.x += rand(-30, 30); st.drag.y += rand(-20, 20); } } }
    if (g.phase !== 'play') return;

    if (st.phase === 'fly' && st.ball) {
      const b = st.ball;
      const N = 6, sdt = dt / N;
      for (let n = 0; n < N && st.phase === 'fly'; n++) physics(st, b, sdt, w, h);
      b.trail.push({ x: b.x, y: b.y, z: b.z }); if (b.trail.length > 14) b.trail.shift();
      if (st.fire && Math.random() < 0.9) { const p = proj(b.x, b.y, b.z); st.drops.push({ x: p.x + rand(-4, 4), y: p.y + rand(-4, 4), vx: rand(-30, 30), vy: rand(-160, -60), life: 0, max: rand(0.25, 0.5), r: rand(3, 7) * p.k / 300, color: pick(['#ff8a00', '#ffd166', '#ff3d00']) }); }
    } else if (st.phase === 'rim' && st.rim && st.ball) {
      const r = st.rim, c = st.cups[r.cup];
      r.t += dt; r.ang += r.av * dt; r.av *= 1 - dt * 0.8;
      const rr = r.r * (1 - 0.25 * (r.t / r.dur));
      st.ball.x = c.x + Math.cos(r.ang) * rr; st.ball.z = c.z + Math.sin(r.ang) * rr; st.ball.y = CUP_H + BALL_R * 0.6 + Math.sin(r.t * 30) * 0.003;
      c.wobble = 0.6;
      if (Math.floor(r.t * 9) !== Math.floor((r.t - dt) * 9)) synth.tone(1900 + Math.random() * 400, 0.03, 'triangle', 0.04);
      if (r.t >= r.dur) {
        if (Math.random() < r.pIn) sink(st, r.cup, w, h);
        else {
          const b = st.ball; const nx = Math.cos(r.ang), nz = Math.sin(r.ang);
          b.vx = nx * rand(0.5, 1.0) + rand(-0.1, 0.1); b.vz = nz * rand(0.5, 1.0); b.vy = rand(0.8, 1.4);
          b.x = c.x + nx * (CUP_R + BALL_R * 1.2); b.z = c.z + nz * (CUP_R + BALL_R * 1.2);
          st.phase = 'fly'; st.rim = null; clink();
          pop(st, proj(b.x, b.y, b.z).x, proj(b.x, b.y, b.z).y - 30, tr('RESSORTIE !', 'RIM OUT!'), '#ff4d6d', 30);
          say(st, T_RIM, 1.5); st.oppMood = 'laugh'; st.oppT = 0; laugh();
        }
      }
    } else if (st.phase === 'wait') {
      st.wait -= dt;
      if (st.wait <= 0) {
        if (st.ballsLeft <= 0 || st.sunk >= 10) { st.phase = 'over'; st.endT = 0; }
        else { st.phase = 'aim'; st.ball = null; }
      }
    } else if (st.phase === 'over' && !st.ended) {
      st.endT += dt;
      if (st.endT <= dt + 1e-9) {
        if (st.sunk >= 10) { st.stamp = { text: tr('TABLE RASE !', 'TABLE CLEARED!'), t: 0, color: '#ffd166' }; sfx.combo(30); g.flash('#ffd166'); }
        else st.stamp = { text: st.sunk >= 6 ? tr('ROI DE LA SOIRÉE', 'PARTY KING') : st.sunk >= 3 ? tr('PAS MAL !', 'NOT BAD!') : tr('MINABLE', 'PATHETIC'), t: 0, color: st.sunk >= 3 ? '#ffd166' : '#ff4d6d' };
      }
      if (st.endT > 1.6) {
        st.ended = true;
        const acc = st.thrown ? Math.round((st.sunk / st.thrown) * 100) : 0;
        const sc = st.sunk >= 10 ? 1 : Math.min(1, (st.sunk + st.bounceSinks * 0.5 + st.swishes * 0.2) / 7.5);
        g.end(sc, [
          [tr('Gobelets', 'Cups'), `🍺 ${st.sunk} / 10`],
          [tr('Précision', 'Accuracy'), `${acc}%`],
          [tr('Meilleure série', 'Best streak'), `🔥 ${st.bestStreak}`],
          [tr('Swish / rebonds', 'Swish / bounce'), `${st.swishes} / ${st.bounceSinks}`],
          [tr('Alcoolémie', 'Blood alcohol'), `${(st.drunk * 2.4).toFixed(1)} g/L 🥴`],
        ]);
      }
    }
  }

  function physics(st: BS, b: Ball, dt: number, w: number, h: number) {
    b.t += dt;
    const py = b.y;
    b.vy -= G * dt;
    b.vx *= 1 - 0.05 * dt; b.vz *= 1 - 0.05 * dt;
    b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt;
    const onTable = Math.abs(b.x) <= TABLE_W && b.z >= 0 && b.z <= TABLE_L;
    // cups
    for (let i = 0; i < st.cups.length; i++) {
      const c = st.cups[i]; if (!c.alive) continue;
      const dx = b.x - c.x, dz = b.z - c.z, d = Math.hypot(dx, dz);
      const forgive = st.fire ? 0.6 : 0;
      if (py >= CUP_H && b.y < CUP_H && b.vy < 0) {
        if (d < CUP_R - BALL_R * (0.5 - forgive)) { sink(st, i, w, h); return; }
        if (d <= CUP_R + BALL_R) {
          // rim! spin around the cup, then in or out
          const pIn = clamp(1.2 - (d - (CUP_R - BALL_R)) / (BALL_R * 2.4) + forgive * 0.25, 0.05, 0.9);
          if (Math.random() < 0.55 || b.rimmed) {
            st.phase = 'rim'; b.rimmed = true; st.rims++;
            st.rim = { cup: i, ang: Math.atan2(dz, dx), av: (Math.random() < 0.5 ? -1 : 1) * rand(10, 16), t: 0, dur: rand(0.45, 0.95), pIn, r: CUP_R * 0.96 };
            clink(); c.wobble = 1; return;
          }
          // hard rim deflection
          const nx = dx / (d || 1), nz = dz / (d || 1);
          b.vx = nx * Math.abs(b.vy) * 0.4 + b.vx * 0.4; b.vz = nz * Math.abs(b.vy) * 0.4 + b.vz * 0.3; b.vy = Math.abs(b.vy) * 0.45; b.y = CUP_H + 0.001; b.rimmed = true;
          clink(); c.wobble = 1;
          continue;
        }
      }
      // cup outer wall
      if (b.y < CUP_H && b.y > -0.01) {
        const rAt = CUP_RB + (CUP_R - CUP_RB) * clamp(b.y / CUP_H, 0, 1);
        if (d < rAt + BALL_R && d > rAt - BALL_R * 2) {
          const nx = dx / (d || 1), nz = dz / (d || 1), vn = b.vx * nx + b.vz * nz;
          if (vn < 0) { b.vx -= 1.6 * vn * nx; b.vz -= 1.6 * vn * nz; b.vx *= 0.6; b.vz *= 0.6; c.wobble = 0.7; synth.tone(900, 0.04, 'triangle', 0.06); }
          b.x = c.x + nx * (rAt + BALL_R); b.z = c.z + nz * (rAt + BALL_R);
        }
      }
    }
    // table
    if (onTable && b.y < BALL_R && b.vy < 0 && py >= BALL_R - 0.02) {
      b.y = BALL_R;
      if (Math.abs(b.vy) > 0.5) { b.vy = -b.vy * 0.62; b.bounces++; tick(clamp(Math.abs(b.vy) / 2, 0.3, 1)); const p = proj(b.x, 0, b.z); for (let i = 0; i < 4; i++) st.drops.push({ x: p.x, y: p.y, vx: rand(-60, 60), vy: rand(-60, -10), life: 0, max: 0.25, r: 2, color: 'rgba(255,255,255,.7)' }); }
      else b.vy = 0;
      b.vx *= 0.88; b.vz *= 0.88;
    }
    if (onTable && b.vy === 0) { b.y = BALL_R; b.vx *= 1 - 1.4 * dt; b.vz *= 1 - 1.4 * dt; }
    const speed = Math.hypot(b.vx, b.vz);
    if (b.y < -0.7 || b.t > 4.5 || (onTable && b.vy === 0 && speed < 0.08) || b.z > TABLE_L + 1.5) miss(st, b, w, h);
  }

  function sink(st: BS, i: number, w: number, h: number) {
    const b = st.ball!; const c = st.cups[i];
    c.alive = false; st.sunk++; st.streak++; st.bestStreak = Math.max(st.bestStreak, st.streak);
    st.phase = 'wait'; st.wait = 1.1; st.rim = null;
    const swish = !b.rimmed && b.bounces === 0, bounce = b.bounces > 0;
    st.fly.push({ x: c.x, z: c.z, t: 0, vx: rand(-0.4, 0.4), spin: rand(-8, 8) });
    const p = proj(c.x, CUP_H, c.z);
    splash(); sfx.pop(); g.hit('perfect'); st.shake = 0.5;
    for (let k = 0; k < 40; k++) { const a = rand(-Math.PI, 0), sp = rand(120, 520); st.drops.push({ x: p.x + rand(-8, 8), y: p.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 120, life: 0, max: rand(0.5, 1.1), r: rand(2.5, 6), color: k % 3 ? pick(['#ffb703', '#fb8500', '#ffd166']) : '#fffbea' }); }
    g.burst((p.x / w) * 100, (p.y / h) * 100, '#ffd166', 20);
    const mult = st.fire ? 1.5 : 1;
    g.add(Math.round(1000 * mult), '', 0, 0);
    pop(st, p.x, p.y - 40, swish ? 'SWISH!' : pick(['SPLASH!', 'GLOUP!', 'PLOUF!', 'SPLOOSH!']), swish ? '#22d3ee' : '#ffd166', swish ? 50 : 44);
    if (swish) { st.swishes++; g.add(300, '+300 SWISH', 50, 30, '#22d3ee'); }
    if (bounce) {
      st.bounceSinks++;
      const other = st.cups.findIndex((q) => q.alive);
      if (other >= 0) { const q = st.cups[other]; q.alive = false; st.sunk++; st.fly.push({ x: q.x, z: q.z, t: 0, vx: rand(-0.5, 0.5), spin: rand(-8, 8) }); g.add(800, tr('REBOND = 2 GOBELETS !', 'BOUNCE = 2 CUPS!'), 50, 26, '#a3e635'); }
    }
    if (st.streak === 2 && !st.fire) { st.fire = true; st.stamp = { text: tr('EN FEU 🔥', 'ON FIRE 🔥'), t: 0, color: '#ff8a00' }; sfx.fire(); say(st, T_FIRE, 1.5); }
    else say(st, T_SINK, 1.5);
    st.oppMood = 'drink'; st.oppT = 0;
    st.drunk = Math.min(1, st.drunk + 0.03);
    if (st.sunk >= 10) { st.wait = 0.6; g.add(3000, tr('TABLE RASE !!!', 'CLEARED!!!'), 50, 36, '#ffd166'); }
  }

  function miss(st: BS, b: Ball, w: number, h: number) {
    st.phase = 'wait'; st.wait = 0.9;
    const p = proj(clamp(b.x, -0.5, 0.5), Math.max(0, b.y), Math.min(b.z, TABLE_L + 0.3));
    g.miss();
    if (st.streak >= 2) pop(st, w / 2, h * 0.3, tr('SÉRIE BRISÉE', 'STREAK OVER'), '#ff4d6d', 32);
    if (st.fire) { st.fire = false; synth.noise(0.4, 0.08, 400); }
    st.streak = 0;
    st.drunk = Math.min(1, st.drunk + 0.12);
    pop(st, clamp(p.x, 80, w - 80), clamp(p.y - 30, 80, h - 80), pick([tr('RATÉ', 'MISS'), tr('À CÔTÉ', 'NOPE'), tr('BOIS !', 'DRINK!'), 'GLOU GLOU']), '#ff4d6d', 34);
    if (!st.bubble || Math.random() < 0.7) say(st, T_MISS, 1.7);
    st.oppMood = 'laugh'; st.oppT = 0; laugh();
  }

  // ─────────────────────────── rendering ───────────────────────────
  function drawScene(ctx: CanvasRenderingContext2D, st: BS, w: number, h: number, t: number) {
    ctx.clearRect(0, 0, w, h);
    drawRoom(ctx, st, w, h, t);
    drawOpp(ctx, st, w, h, t);
    drawTable(ctx, w, h);
    // ball shadow
    const b = st.ball;
    if (b && (st.phase === 'fly' || st.phase === 'rim') && Math.abs(b.x) <= TABLE_W && b.z >= 0 && b.z <= TABLE_L) {
      const sp = proj(b.x, 0, b.z), a = clamp(1 - b.y / 1.2, 0.15, 0.6);
      ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.beginPath(); ctx.ellipse(sp.x, sp.y, BALL_R * sp.k * (1 + b.y), BALL_R * sp.k * 0.4 * (1 + b.y), 0, 0, Math.PI * 2); ctx.fill();
    }
    // cups + ball depth-sorted (far first)
    const items: { z: number; draw: () => void }[] = [];
    st.cups.forEach((c) => { if (c.alive) items.push({ z: c.z, draw: () => drawCup(ctx, c.x, c.z, 0, c.wobble * Math.sin(t * 40) * 0.06, 1, st.fire) }); });
    if (b && (st.phase === 'fly' || st.phase === 'rim')) {
      const zSort = st.phase === 'rim' && st.rim ? st.cups[st.rim.cup].z + Math.sin(st.rim.ang) * CUP_R * 1.01 : b.z;
      items.push({ z: zSort, draw: () => drawBall(ctx, st, b) });
    }
    items.sort((a, b2) => b2.z - a.z).forEach((it) => it.draw());
    // flying (drunk) cups
    for (const f of st.fly) { const k = f.t / 0.9; drawCup(ctx, f.x + f.vx * f.t, f.z + f.t * 0.5, Math.sin(k * Math.PI) * 0.45 + k * 0.2, f.spin * f.t, Math.max(0, 1 - k * k), false); }
    // drops
    for (const d of st.drops) { ctx.globalAlpha = clamp((d.max - d.life) / 0.3, 0, 1); ctx.fillStyle = d.color; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
    // aim preview & hand
    if (st.phase === 'aim' && g.phase === 'play') drawAim(ctx, st, w, h, t);
    else if (g.phase !== 'play' || st.phase === 'wait') drawHand(ctx, st, w, h, null, t);
  }

  function drawRoom(ctx: CanvasRenderingContext2D, st: BS, w: number, h: number, t: number) {
    const far = proj(0, 0, TABLE_L);
    const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#1d0730'); bg.addColorStop(0.45, '#4a1048'); bg.addColorStop(1, '#130418');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    // sunset window
    const wx = w * 0.08, wy = h * 0.06, ww = w * 0.22, wh = far.y - h * 0.12;
    const sky = ctx.createLinearGradient(0, wy, 0, wy + wh); sky.addColorStop(0, '#ff5e7e'); sky.addColorStop(0.6, '#ff9a3c'); sky.addColorStop(1, '#ffd166');
    ctx.fillStyle = sky; ctx.fillRect(wx, wy, ww, wh);
    ctx.fillStyle = '#ffe9a8'; ctx.beginPath(); ctx.arc(wx + ww * 0.6, wy + wh * 0.78, ww * 0.16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2b0a2f'; for (let i = 0; i < 6; i++) ctx.fillRect(wx + i * ww / 6, wy + wh * (0.72 + (i % 3) * 0.06), ww / 6 - 3, wh);
    ctx.strokeStyle = '#140317'; ctx.lineWidth = 6; ctx.strokeRect(wx, wy, ww, wh); ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();
    // neon sign
    ctx.save(); const fl = Math.sin(t * 31) > 0.95 ? 0.35 : 1; ctx.globalAlpha = fl;
    glow(ctx, '#ff2d95', 26); ctx.fillStyle = '#ff8ad0'; ctx.font = `900 ${Math.round(h * 0.06)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText('BEER PONG', w * 0.74, h * 0.12); glow(ctx, '#22d3ee', 18); ctx.fillStyle = '#a5f3fc'; ctx.font = `700 ${Math.round(h * 0.022)}px Fredoka Variable, sans-serif`;
    ctx.fillText(tr('🍺 RÈGLE N°1 : ON NE VOMIT PAS SUR LA TABLE', '🍺 RULE #1: NO PUKING ON THE TABLE'), w * 0.74, h * 0.16, w * 0.4); ctx.restore();
    // string lights
    for (let row = 0; row < 2; row++) {
      ctx.strokeStyle = '#0c020f'; ctx.lineWidth = 2; ctx.beginPath();
      const y0 = h * (0.02 + row * 0.05);
      for (let x = -10; x <= w + 10; x += 10) { const y = y0 + Math.abs(Math.sin((x / w) * Math.PI * 3 + row)) * h * 0.05; x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
      for (let i = 0; i < 22; i++) { const x = (i + 0.5 + row * 0.5) * w / 22, y = y0 + Math.abs(Math.sin((x / w) * Math.PI * 3 + row)) * h * 0.05 + 5, c = PALETTE[(i + row) % PALETTE.length], on = 0.55 + 0.45 * Math.sin(t * 3 + i * 1.7 + row); ctx.save(); ctx.globalAlpha = on; glow(ctx, c, 18); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    }
    // crowd silhouettes behind the table
    const hype = st.oppMood !== 'idle' ? 1 : 0.3;
    for (let i = 0; i < 18; i++) {
      const x = (i + 0.5) * w / 18 + Math.sin(i * 7) * 12; if (Math.abs(x - w / 2) < w * 0.12) continue;
      const bob = Math.abs(Math.sin(t * (4 + (i % 3)) + i)) * 8 * hype, y = far.y - h * 0.02 - (i % 3) * 8;
      ctx.fillStyle = ['#2a0b33', '#330d3d', '#250829'][i % 3];
      ctx.beginPath(); ctx.arc(x, y - h * 0.12 - bob, h * 0.03, 0, Math.PI * 2); ctx.fill();
      roundRect(ctx, x - h * 0.045, y - h * 0.09 - bob, h * 0.09, h * 0.16, h * 0.03); ctx.fill();
      if (i % 3 === 0) { ctx.fillStyle = '#e11d48'; ctx.fillRect(x + h * 0.04, y - h * (0.17 + (hype > 0.5 ? 0.04 : 0)) - bob, h * 0.016, h * 0.022); ctx.fillStyle = '#2a0b33'; ctx.fillRect(x + h * 0.04, y - h * 0.15 - bob, h * 0.012, h * 0.06); }
      if ((i * 31 + Math.floor(t * 2)) % 23 === 0) { ctx.save(); glow(ctx, '#fff', 16); ctx.fillStyle = '#fff'; ctx.fillRect(x - 4, y - h * 0.11 - bob, 8, 12); ctx.restore(); }
    }
  }

  function drawTable(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const a = proj(-TABLE_W, 0, 0), b = proj(TABLE_W, 0, 0), c = proj(TABLE_W, 0, TABLE_L), d = proj(-TABLE_W, 0, TABLE_L);
    // legs/side under far edge
    const dd = proj(-TABLE_W, -0.06, TABLE_L), cc = proj(TABLE_W, -0.06, TABLE_L);
    ctx.fillStyle = '#0a0410'; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(c.x, c.y); ctx.lineTo(cc.x, cc.y); ctx.lineTo(dd.x, dd.y); ctx.fill();
    const tg = ctx.createLinearGradient(0, d.y, 0, h); tg.addColorStop(0, '#0f2a4a'); tg.addColorStop(1, '#1b4d80');
    ctx.fillStyle = tg; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath(); ctx.fill();
    // glossy reflection
    ctx.save(); ctx.clip();
    const gl = ctx.createLinearGradient(w * 0.3, 0, w * 0.7, h); gl.addColorStop(0, 'rgba(255,255,255,0)'); gl.addColorStop(0.5, 'rgba(255,255,255,.07)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
    // painted logo: a big star ring at mid-table
    ctx.strokeStyle = 'rgba(255,209,102,.35)'; ctx.lineWidth = 3;
    ctx.beginPath(); for (let i = 0; i <= 40; i++) { const an = (i / 40) * Math.PI * 2; const p = proj(Math.cos(an) * 0.2, 0, 1.2 + Math.sin(an) * 0.2); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); } ctx.stroke();
    ctx.fillStyle = 'rgba(255,45,149,.25)'; ctx.beginPath(); for (let i = 0; i < 10; i++) { const an = (i / 10) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 0.07 : 0.16; const p = proj(Math.cos(an) * r, 0, 1.2 + Math.sin(an) * r); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); } ctx.closePath(); ctx.fill();
    ctx.restore();
    // edge lines
    const line = (x1: number, z1: number, x2: number, z2: number, col: string, wd: number) => { const p1 = proj(x1, 0, z1), p2 = proj(x2, 0, z2); ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); };
    ctx.save(); glow(ctx, '#22d3ee', 10);
    line(-TABLE_W + 0.02, 0, -TABLE_W + 0.02, TABLE_L - 0.02, '#e0f7ff', 3); line(TABLE_W - 0.02, 0, TABLE_W - 0.02, TABLE_L - 0.02, '#e0f7ff', 3); line(-TABLE_W + 0.02, TABLE_L - 0.02, TABLE_W - 0.02, TABLE_L - 0.02, '#e0f7ff', 3);
    ctx.restore();
    line(0, 0.1, 0, TABLE_L - 0.4, 'rgba(255,255,255,.15)', 2);
  }

  function drawCup(ctx: CanvasRenderingContext2D, x: number, z: number, lift: number, rot: number, alpha: number, fire: boolean) {
    const top = proj(x, CUP_H + lift, z), bot = proj(x, lift, z);
    const rt = CUP_R * top.k, rb = CUP_RB * bot.k, ry = rt * 0.32;
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.translate(bot.x, bot.y); ctx.rotate(rot); ctx.translate(-bot.x, -bot.y);
    if (lift === 0) { ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(bot.x + rb * 0.3, bot.y, rb * 1.4, rb * 0.4, 0, 0, Math.PI * 2); ctx.fill(); }
    if (fire) { ctx.save(); glow(ctx, '#ff8a00', 20); }
    const gr = ctx.createLinearGradient(top.x - rt, 0, top.x + rt, 0);
    gr.addColorStop(0, '#7a0010'); gr.addColorStop(0.3, '#ff2b3d'); gr.addColorStop(0.45, '#ff7a85'); gr.addColorStop(0.6, '#e1122a'); gr.addColorStop(1, '#5c000c');
    ctx.fillStyle = gr; ctx.strokeStyle = OUT; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(top.x - rt, top.y); ctx.lineTo(bot.x - rb, bot.y); ctx.ellipse(bot.x, bot.y, rb, rb * 0.32, 0, Math.PI, 0, true); ctx.lineTo(top.x + rt, top.y); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (fire) ctx.restore();
    // ribs
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1;
    for (const k of [0.3, 0.55]) { const yy = top.y + (bot.y - top.y) * k, rr = rt + (rb - rt) * k; ctx.beginPath(); ctx.ellipse(top.x + (bot.x - top.x) * k, yy, rr, rr * 0.3, 0, 0, Math.PI); ctx.stroke(); }
    // white rim band + inside with beer
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(top.x, top.y, rt * 1.03, ry * 1.08, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#5a0010'; ctx.beginPath(); ctx.ellipse(top.x, top.y, rt * 0.9, ry * 0.86, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.ellipse(top.x, top.y, rt * 0.9, ry * 0.86, 0, 0, Math.PI * 2); ctx.clip();
    const bg = ctx.createLinearGradient(0, top.y - ry, 0, top.y + ry); bg.addColorStop(0, '#ffd166'); bg.addColorStop(1, '#f59e0b');
    ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(top.x, top.y + ry * 0.35, rt * 0.86, ry * 0.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.75)'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(top.x - rt * 0.4 + i * rt * 0.35, top.y + ry * 0.1, rt * 0.08, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    // highlight
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(top.x - rt * 0.55, top.y + ry); ctx.lineTo(bot.x - rb * 0.45, bot.y - 2); ctx.lineTo(bot.x - rb * 0.25, bot.y - 2); ctx.lineTo(top.x - rt * 0.3, top.y + ry); ctx.fill();
    ctx.restore();
  }

  function drawBall(ctx: CanvasRenderingContext2D, st: BS, b: Ball) {
    // motion trail
    for (let i = 0; i < b.trail.length; i++) { const q = b.trail[i], p = proj(q.x, q.y, q.z); ctx.fillStyle = st.fire ? `rgba(255,${120 + i * 8},0,${(i / b.trail.length) * 0.5})` : `rgba(255,255,255,${(i / b.trail.length) * 0.25})`; ctx.beginPath(); ctx.arc(p.x, p.y, BALL_R * p.k * (0.4 + (i / b.trail.length) * 0.5), 0, Math.PI * 2); ctx.fill(); }
    const p = proj(b.x, b.y, b.z), r = Math.max(2, BALL_R * p.k);
    ctx.save();
    if (st.fire) glow(ctx, '#ff8a00', 24); else glow(ctx, '#ffffff', 8);
    const gr = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.35, r * 0.1, p.x, p.y, r);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.7, st.fire ? '#ffd8a8' : '#f4f4f5'); gr.addColorStop(1, st.fire ? '#ff8a00' : '#c7c7d1');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function simulatePreview(st: BS, yaw: number, pow: number) {
    const v = launch(st, yaw, pow, 0);
    const pts: { x: number; y: number; k: number }[] = [];
    let x = START.x, y = START.y, z = START.z, vx = v.vx, vy = v.vy, vz = v.vz;
    for (let i = 0; i < 90; i++) {
      const dt = 1 / 60; vy -= G * dt; x += vx * dt; y += vy * dt; z += vz * dt;
      if (i % 2 === 0) { const p = proj(x, y, z); pts.push(p); }
      if (y < (Math.abs(x) <= TABLE_W && z <= TABLE_L ? CUP_H * 0.9 : -0.3)) break;
    }
    return pts;
  }

  function drawAim(ctx: CanvasRenderingContext2D, st: BS, w: number, h: number, t: number) {
    const aim = currentAim(st);
    const age = st.drag ? st.drag.t : st.kb.on ? st.kb.t : 99;
    if (aim && aim.pow > 0.02) {
      const vis = age < PREVIEW_T ? 1 : Math.max(0, 1 - (age - PREVIEW_T) / 0.25);
      if (vis > 0) {
        const pts = simulatePreview(st, aim.yaw, aim.pow);
        ctx.save();
        pts.forEach((p, i) => { const k = i / pts.length; ctx.globalAlpha = vis * (0.9 - k * 0.6); glow(ctx, st.fire ? '#ff8a00' : '#22d3ee', 10); ctx.fillStyle = st.fire ? '#ffd166' : '#a5f3fc'; ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1.5, p.k * 0.012), 0, Math.PI * 2); ctx.fill(); });
        const last = pts[pts.length - 1];
        if (last) { ctx.globalAlpha = vis; ctx.strokeStyle = '#a5f3fc'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(last.x, last.y, last.k * 0.05, last.k * 0.016, 0, 0, Math.PI * 2); ctx.stroke(); }
        ctx.restore();
      } else if (age < PREVIEW_T + 1.2) {
        ctx.save(); ctx.globalAlpha = Math.min(1, (age - PREVIEW_T - 0.25) * 3) * (1 - (age - PREVIEW_T) / 1.2); ctx.font = '800 14px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fde68a';
        ctx.fillText(tr('…à l\'instinct maintenant 🍺', '…now go with your gut 🍺'), w / 2, h * 0.62); ctx.restore();
      }
    } else if (!st.drag) {
      // idle hint: pulsing swipe arrow
      const k = (t * 1.2) % 1;
      ctx.save(); ctx.globalAlpha = 0.8 * (1 - k); ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 4; ctx.lineCap = 'round'; glow(ctx, '#ffd166', 12);
      const y0 = h * 0.9, y1 = h * 0.9 - h * 0.18 * k;
      ctx.beginPath(); ctx.moveTo(w / 2, y0); ctx.lineTo(w / 2, y1); ctx.moveTo(w / 2 - 12, y1 + 12); ctx.lineTo(w / 2, y1); ctx.lineTo(w / 2 + 12, y1 + 12); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.font = '800 15px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.lineWidth = 4; ctx.strokeStyle = '#000'; ctx.lineJoin = 'round';
      const msg = tr('Clique-glisse vers le haut, relâche pour lancer', 'Click & drag up, release to throw');
      ctx.strokeText(msg, w / 2, h * 0.63); ctx.fillText(msg, w / 2, h * 0.63); ctx.restore();
    }
    drawHand(ctx, st, w, h, aim, t);
  }

  function drawHand(ctx: CanvasRenderingContext2D, st: BS, w: number, h: number, aim: { yaw: number; pow: number } | null, t: number) {
    const hasBall = st.phase === 'aim' && st.ballsLeft > 0;
    const p = proj(START.x, START.y, START.z);
    const sway = Math.sin(t * 1.3) * 6 * (0.3 + st.drunk);
    const hx = p.x + (aim ? aim.yaw * h * 0.6 : 0) + sway, hy = p.y + (aim ? aim.pow * h * 0.12 : 0) + (st.phase === 'wait' ? 40 : 0);
    const r = BALL_R * p.k;
    ctx.save();
    ctx.translate(hx, hy); ctx.rotate((aim ? aim.yaw * 0.8 : 0) + Math.sin(t * 1.1) * 0.03);
    // arm from bottom-right
    ctx.fillStyle = '#e8b48a'; ctx.strokeStyle = OUT; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(r * 0.6, r * 1.2); ctx.lineTo(r * 3.6, h); ctx.lineTo(r * 6.4, h); ctx.lineTo(r * 2.6, r * 0.6); ctx.closePath(); ctx.fill(); ctx.stroke();
    // sleeve
    ctx.fillStyle = '#ff2d95'; ctx.beginPath(); ctx.moveTo(r * 2.4, r * 4.6); ctx.lineTo(r * 3.9, h); ctx.lineTo(r * 7.2, h); ctx.lineTo(r * 5.0, r * 3.6); ctx.closePath(); ctx.fill(); ctx.stroke();
    // hand (pinch)
    ctx.fillStyle = '#f2c29b';
    roundRect(ctx, -r * 0.4, r * 0.3, r * 2.6, r * 1.8, r * 0.8); ctx.fill(); ctx.stroke();
    if (hasBall) {
      ctx.save(); glow(ctx, st.fire ? '#ff8a00' : '#fff', st.fire ? 22 : 8);
      const gr = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r); gr.addColorStop(0, '#fff'); gr.addColorStop(0.7, st.fire ? '#ffd8a8' : '#f4f4f5'); gr.addColorStop(1, st.fire ? '#ff8a00' : '#c7c7d1');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    // thumb & index over the ball
    ctx.fillStyle = '#f2c29b';
    ctx.beginPath(); ctx.ellipse(-r * 0.75, r * 0.35, r * 0.38, r * 0.62, 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(r * 0.75, r * 0.15, r * 0.36, r * 0.7, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function drawOpp(ctx: CanvasRenderingContext2D, st: BS, w: number, h: number, t: number) {
    const far = proj(0, 0, TABLE_L + 0.25);
    const S = Math.min(far.k / 640, (far.y - h * 0.02) / 470);
    const mood = st.oppMood, mt = st.oppT;
    const bob = Math.sin(t * 2.2) * 4 + (mood === 'laugh' ? Math.abs(Math.sin(t * 16)) * 8 : 0);
    ctx.save(); ctx.translate(w / 2 + Math.sin(t * 0.7) * 20, far.y + 10); ctx.scale(S, S);
    // torso (tank top)
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = '#e0ac69';
    ctx.beginPath(); ctx.moveTo(-150, 40); ctx.quadraticCurveTo(-160, -170 + bob, -95, -205 + bob); ctx.lineTo(95, -205 + bob); ctx.quadraticCurveTo(160, -170 + bob, 150, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.moveTo(-120, 40); ctx.lineTo(-110, -150 + bob); ctx.lineTo(-70, -205 + bob); ctx.quadraticCurveTo(0, -120 + bob, 70, -205 + bob); ctx.lineTo(110, -150 + bob); ctx.lineTo(120, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#7c2d12'; ctx.font = '900 34px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(tr('BIÈRE', 'BEER'), 0, -40 + bob); ctx.font = '800 18px Fredoka Variable, sans-serif'; ctx.fillText(tr('POUR LA VIE', 'FOR LIFE'), 0, -12 + bob);
    // arms
    const arm = (sd: number, hx2: number, hy2: number, cup: boolean) => {
      ctx.strokeStyle = OUT; ctx.lineWidth = 50; ctx.beginPath(); ctx.moveTo(sd * 120, -170 + bob); ctx.quadraticCurveTo(sd * 190, -60 + bob, hx2, hy2); ctx.stroke();
      ctx.strokeStyle = '#e0ac69'; ctx.lineWidth = 38; ctx.stroke();
      ctx.fillStyle = '#e0ac69'; ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.beginPath(); ctx.arc(hx2, hy2, 26, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (cup) { ctx.fillStyle = '#e1122a'; ctx.beginPath(); ctx.moveTo(hx2 - 26, hy2 - 50); ctx.lineTo(hx2 + 26, hy2 - 50); ctx.lineTo(hx2 + 18, hy2 + 20); ctx.lineTo(hx2 - 18, hy2 + 20); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fillRect(hx2 - 26, hy2 - 56, 52, 8); }
    };
    if (mood === 'drink') { const k = Math.min(1, mt / 0.3); arm(1, 40, -300 + bob + (1 - k) * 150, true); arm(-1, -150, 20, false); }
    else if (mood === 'laugh') { arm(1, 200, -40 + bob, true); arm(-1, -70 + Math.sin(t * 20) * 6, -150 + bob, false); }
    else { arm(1, 150, -40 + bob, true); arm(-1, -150, 20, false); }
    // head
    ctx.save(); ctx.translate(0, -300 + bob); ctx.rotate(mood === 'laugh' ? Math.sin(t * 16) * 0.08 - 0.15 : mood === 'drink' ? -0.35 : Math.sin(t * 0.9) * 0.05);
    ctx.fillStyle = '#e0ac69'; ctx.strokeStyle = OUT; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(-80, 0, 16, 26, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(80, 0, 16, 26, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, 80, 92, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // backwards cap
    ctx.fillStyle = '#2563eb'; ctx.beginPath(); ctx.moveTo(-82, -20); ctx.bezierCurveTo(-80, -120, 80, -120, 82, -20); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(70, -36, 46, 12, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = '900 22px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('YOLO', -8, -50);
    // shades pushed up? no: sunglasses on face
    ctx.fillStyle = '#111827'; roundRect(ctx, -60, -12, 52, 30, 10); ctx.fill(); roundRect(ctx, 8, -12, 52, 30, 10); ctx.fill(); ctx.fillRect(-10, -6, 20, 6);
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(-50, -6, 14, 5); ctx.fillRect(18, -6, 14, 5);
    // mouth
    ctx.strokeStyle = OUT; ctx.lineWidth = 5;
    if (mood === 'laugh') { ctx.fillStyle = '#3b0a0a'; ctx.beginPath(); ctx.moveTo(-36, 34); ctx.quadraticCurveTo(0, 90, 36, 34); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fillRect(-30, 34, 60, 9); }
    else if (mood === 'drink') { ctx.fillStyle = '#3b0a0a'; ctx.beginPath(); ctx.ellipse(0, 46, 14, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(-28, 44); ctx.quadraticCurveTo(0, 56, 30, 38); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,90,90,.35)'; ctx.beginPath(); ctx.ellipse(-50, 30, 16, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(50, 30, 16, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  function drawUI(ctx: CanvasRenderingContext2D, st: BS, w: number, h: number, t: number) {
    const aim = st.phase === 'aim' && g.phase === 'play' ? currentAim(st) : null;
    if (aim && aim.pow > 0.02) {
      const gx = w / 2 + h * 0.16, gy = h * 0.93, gh = h * 0.26;
      ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.55)'; roundRect(ctx, gx - 8, gy - gh - 8, 26, gh + 16, 10); ctx.fill();
      const pg = ctx.createLinearGradient(0, gy, 0, gy - gh); pg.addColorStop(0, '#a3e635'); pg.addColorStop(0.6, '#ffd166'); pg.addColorStop(1, '#ff2d95');
      ctx.fillStyle = pg; glow(ctx, '#ffd166', 10); roundRect(ctx, gx - 2, gy - gh * aim.pow, 14, gh * aim.pow, 6); ctx.fill(); ctx.restore();
      ctx.save(); ctx.font = '800 11px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText(tr('FORCE', 'POWER'), gx + 5, gy + 22); ctx.restore();
    }
    // balls left
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,.5)'; roundRect(ctx, 12, h - 46, 10 * 22 + 16, 34, 17); ctx.fill();
    for (let i = 0; i < BALLS; i++) {
      const used = i >= st.ballsLeft + (st.phase === 'aim' ? 0 : 0);
      const x = 28 + i * 22, y = h - 29;
      ctx.globalAlpha = used ? 0.25 : 1;
      const gr = ctx.createRadialGradient(x - 3, y - 3, 1, x, y, 8); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#c7c7d1');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.restore();
    // cups counter
    ctx.save(); ctx.font = '900 20px Fredoka Variable, sans-serif'; ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.lineWidth = 4; ctx.strokeStyle = '#000'; ctx.lineJoin = 'round';
    const txt = `🍺 ${st.sunk}/10`; ctx.strokeText(txt, 16, 34); ctx.fillText(txt, 16, 34);
    ctx.font = '800 13px Fredoka Variable, sans-serif'; const vs = `VS « ${tr(st.opp[0], st.opp[1])} »`; ctx.strokeText(vs, 16, 54); ctx.fillStyle = '#ffd166'; ctx.fillText(vs, 16, 54);
    ctx.restore();
    // drunk meter: a beer glass filling up
    const gx = w - 56, gy = h * 0.2, gw = 36, gh = h * 0.42, d = st.drunkShow;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.lineTo(gx + gw - 5, gy + gh); ctx.lineTo(gx + 5, gy + gh); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.clip();
    const lvl = gy + gh * (1 - d);
    const bg = ctx.createLinearGradient(0, lvl, 0, gy + gh); bg.addColorStop(0, '#ffd166'); bg.addColorStop(1, '#d97706');
    ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(gx - 5, gy + gh + 5);
    for (let x = gx - 5; x <= gx + gw + 5; x += 4) ctx.lineTo(x, lvl + Math.sin(x * 0.3 + t * 5) * 2.5 * (0.4 + d));
    ctx.lineTo(gx + gw + 5, gy + gh + 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fffbea'; ctx.fillRect(gx - 5, lvl - 7, gw + 10, 8);
    ctx.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 5; i++) { const by = gy + gh - ((t * 40 + i * 37) % (gh * Math.max(0.05, d))); ctx.beginPath(); ctx.arc(gx + 8 + ((i * 7) % (gw - 14)), by, 2, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.lineTo(gx + gw - 5, gy + gh); ctx.lineTo(gx + 5, gy + gh); ctx.closePath(); ctx.stroke();
    ctx.font = '900 12px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
    ctx.fillText(tr('IVRESSE', 'BUZZ'), gx + gw / 2, gy - 22);
    ctx.font = '22px serif'; ctx.fillText(d > 0.75 ? '🤮' : d > 0.5 ? '🥴' : d > 0.25 ? '😵‍💫' : '🙂', gx + gw / 2, gy - 0);
    ctx.font = '800 12px Fredoka Variable, sans-serif'; ctx.fillStyle = '#fde68a'; ctx.fillText(`${(d * 2.4).toFixed(1)} g/L`, gx + gw / 2, gy + gh + 18);
    ctx.restore();
    // vignette (heavier when drunk)
    const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * (0.45 - d * 0.15), w / 2, h / 2, Math.max(w, h) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(${Math.round(40 + d * 60)},0,${Math.round(30 + d * 30)},${0.45 + d * 0.35})`);
    ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    // speech bubble over the opponent
    if (st.bubble) {
      const b = st.bubble, far = proj(0, 0, TABLE_L + 0.25);
      ctx.font = '800 16px Fredoka Variable, sans-serif';
      const tw = Math.min(280, ctx.measureText(b.text).width) + 26;
      const bx = Math.min(w - tw / 2 - 70, w / 2 + far.k * 0.42 + tw / 2), by = Math.max(70, far.y - far.k * 0.62);
      const sc = easeBack(b.t / 0.18), a = clamp((b.dur - b.t) / 0.2, 0, 1);
      ctx.save(); ctx.globalAlpha = a; ctx.translate(bx, by); ctx.scale(sc, sc);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = OUT; ctx.lineWidth = 3;
      roundRect(ctx, -tw / 2, -22, tw, 42, 16); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-tw / 2 + 16, 16); ctx.lineTo(-tw / 2 - 8, 34); ctx.lineTo(-tw / 2 + 34, 16); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillRect(-tw / 2 + 14, 12, 24, 6);
      ctx.fillStyle = OUT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.text, 0, -1, 270);
      ctx.restore();
    }
    // onomatopoeia pops
    for (const p of st.pops) {
      const sc = p.t < 0.14 ? easeBack(p.t / 0.14) : 1, a = p.t > 0.6 ? 1 - (p.t - 0.6) / 0.3 : 1;
      ctx.save(); ctx.globalAlpha = clamp(a, 0, 1); ctx.translate(p.x, p.y - p.t * 40); ctx.rotate(p.rot); ctx.scale(sc, sc);
      ctx.font = `900 ${p.size}px Fredoka Variable, Impact, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      ctx.lineWidth = p.size * 0.18; ctx.strokeStyle = OUT; ctx.strokeText(p.text, 0, 0);
      glow(ctx, p.color, 16); ctx.fillStyle = p.color; ctx.fillText(p.text, 0, 0);
      ctx.restore();
    }
    // stamp
    if (st.stamp && st.stamp.t < 2.2) {
      const k = st.stamp.t, sc = k < 0.2 ? 3 - 2 * easeBack(k / 0.2) : 1, a = k > 1.6 && st.phase !== 'over' ? 1 - (k - 1.6) / 0.6 : 1;
      ctx.save(); ctx.globalAlpha = clamp(a, 0, 1); ctx.translate(w / 2, h * 0.42); ctx.rotate(-0.1); ctx.scale(sc, sc);
      const fs = Math.min(84, w * 0.1);
      ctx.font = `900 ${fs}px Fredoka Variable, Impact, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      ctx.lineWidth = fs * 0.2; ctx.strokeStyle = OUT; ctx.strokeText(st.stamp.text, 0, 0);
      ctx.lineWidth = fs * 0.07; ctx.strokeStyle = '#fff'; ctx.strokeText(st.stamp.text, 0, 0);
      glow(ctx, st.stamp.color, 30); ctx.fillStyle = st.stamp.color; ctx.fillText(st.stamp.text, 0, 0);
      ctx.restore();
    }
  }

  return (
    <Arena g={g} title={tr('Beer pong', 'Beer pong')} icon="🍺" theme="sunset" scoreLabel={tr('POINTS', 'POINTS')}
      howTo={tr(`10 balles, 10 gobelets, et « ${s.current.opp[0]} » qui te chambre. Clique et glisse vers le haut pour viser et doser la force : la trajectoire ne s'affiche qu'une demi-seconde. Chaque raté te fait boire… et ta vue se brouille. 2 d'affilée = EN FEU 🔥, un rebond sur la table = 2 gobelets !`,
        `10 balls, 10 cups, and "${s.current.opp[1]}" trash-talking you. Click & drag up to aim and set power: the arc preview only shows for half a second. Every miss makes you drink… and your vision gets blurry. 2 in a row = ON FIRE 🔥, a table bounce = 2 cups!`)}
      keys={[tr('🖱️ glisser ↑ = viser', '🖱️ drag ↑ = aim'), tr('relâcher = lancer', 'release = throw'), tr('ou ← → ↑ ↓ + Espace', 'or ← → ↑ ↓ + Space')]}>
      <canvas class="play" ref={canvas} style={{ touchAction: 'none', cursor: 'grab', pointerEvents: 'auto' }}
        onPointerDown={onDown as unknown as (e: Event) => void} onPointerMove={onMove as unknown as (e: Event) => void} onPointerUp={onUp} onPointerCancel={onUp} />
    </Arena>
  );
}
