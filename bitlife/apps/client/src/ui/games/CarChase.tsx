// Getaway: Outrun-style pseudo-3D police chase on a synthwave highway.
import { useRef } from 'preact/hooks';
import { useGame, useCanvas, useKeys, Arena, tr, glow, type GameProps } from './kit.tsx';
import { sfx } from '../../audio.ts';

const SEG = 200, ROAD_W = 2000, LANES = 3, DRAW = 160, CAM_H = 1000, CAM_DEPTH = 0.84, TOTAL = 900;
interface Seg { curve: number; y: number }
interface Car { z: number; x: number; speed: number; color: string; hit?: boolean }
interface Bag { z: number; x: number; got?: boolean }

function buildTrack(): Seg[] {
  const segs: Seg[] = [];
  let y = 0;
  const add = (n: number, curve: number, hill: number) => { for (let i = 0; i < n; i++) { const k = Math.sin((i / n) * Math.PI); y += hill * k * 14; segs.push({ curve: curve * k, y }); } };
  add(40, 0, 0);
  while (segs.length < TOTAL) {
    const n = 40 + Math.floor(Math.random() * 60);
    add(n, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 2.2);
  }
  return segs;
}

export function CarChase({ onDone }: GameProps) {
  const g = useGame({ duration: 35, onDone });
  const s = useRef({
    segs: buildTrack(), z: 0, x: 0, speed: 9000, max: 12000, nitro: 100, boost: false, gap: 60, cash: 0, crashes: 0, steer: 0,
    cars: [] as Car[], bags: [] as Bag[], keys: new Set<string>(), t: 0, siren: 0, ended: false, lastCrash: -10,
  });
  // traffic & loot
  if (!s.current.cars.length) {
    const colors = ['#22d3ee', '#ffd166', '#a3e635', '#c084fc', '#fb7185', '#f8fafc'];
    for (let i = 0; i < 70; i++) s.current.cars.push({ z: 3000 + i * 2400 + Math.random() * 1200, x: [-0.66, 0, 0.66][Math.floor(Math.random() * 3)], speed: 3500 + Math.random() * 3500, color: colors[i % colors.length] });
    for (let i = 0; i < 45; i++) s.current.bags.push({ z: 4000 + i * 3700 + Math.random() * 1500, x: (Math.random() - 0.5) * 1.6 });
  }
  useKeys((e) => s.current.keys.add(e.code), (e) => s.current.keys.delete(e.code));
  const canvas = useCanvas((ctx, w, h, dt) => {
    const st = s.current;
    const playing = g.phase === 'play';
    const k = st.keys;
    const trackLen = st.segs.length * SEG;
    if (playing) {
      st.t += dt;
      const left = k.has('ArrowLeft') || k.has('KeyA') || k.has('KeyQ');
      const right = k.has('ArrowRight') || k.has('KeyD');
      st.boost = (k.has('ArrowUp') || k.has('KeyW') || k.has('KeyZ') || k.has('Space')) && st.nitro > 0;
      const max = st.max * (st.boost ? 1.45 : 1);
      st.speed += (max - st.speed) * dt * (st.boost ? 1.6 : 0.9);
      if (st.boost) st.nitro = Math.max(0, st.nitro - dt * 28); else st.nitro = Math.min(100, st.nitro + dt * 6);
      st.steer += ((right ? 1 : 0) - (left ? 1 : 0) - st.steer) * Math.min(1, dt * 10);
      const segI = Math.floor(st.z / SEG) % st.segs.length;
      const speedPct = st.speed / st.max;
      st.x += st.steer * dt * 2.4 * speedPct;
      st.x -= st.segs[segI].curve * dt * 0.33 * speedPct; // centrifugal
      if (Math.abs(st.x) > 1.05) { st.speed *= 1 - dt * 2.2; if (Math.random() < 0.2) g.burst(50 + (st.x > 0 ? 8 : -8), 88, '#a16207', 3); }
      st.x = Math.max(-1.6, Math.min(1.6, st.x));
      st.z = (st.z + st.speed * dt) % trackLen;
      // police gap: you gain when fast, lose when slow
      st.gap = Math.max(0, Math.min(100, st.gap + (speedPct - 0.74) * dt * 20));
      if (st.gap <= 0 && !st.ended) {
        st.ended = true; sfx.siren(); g.flash('#ff1f3d');
        g.end(Math.min(0.35, st.cash / 40 + 0.1), [[tr('Résultat', 'Result'), tr('🚔 ARRÊTÉ', '🚔 BUSTED')], [tr('Butin', 'Loot'), `💰 ${st.cash}`], [tr('Accidents', 'Crashes'), String(st.crashes)]]);
      }
      // traffic
      for (const c of st.cars) {
        c.z = (c.z + c.speed * dt) % trackLen;
        let dz = c.z - st.z; if (dz < -trackLen / 2) dz += trackLen;
        if (dz > 0 && dz < SEG * 1.2 && Math.abs(c.x - st.x) < 0.42 && st.t - st.lastCrash > 0.8) {
          st.lastCrash = st.t; st.crashes++; st.speed *= 0.35; st.gap = Math.max(0, st.gap - 14);
          g.miss(tr('CRASH !', 'CRASH!'), 50, 70); g.shake(); g.flash('#ff4d6d'); sfx.punch(); g.burst(50, 80, c.color, 30);
          c.z += SEG * 3;
        }
      }
      for (const b of st.bags) {
        if (b.got) continue;
        let dz = b.z - st.z; if (dz < -trackLen / 2) dz += trackLen;
        if (dz > 0 && dz < SEG && Math.abs(b.x - st.x) < 0.35) {
          b.got = true; st.cash++; g.hit('perfect'); g.add(500, '+💰', 50, 72, '#ffd166'); g.burst(50, 78, '#ffd166', 24); sfx.cash();
        }
      }
      g.add(Math.round(st.speed * dt / 40));
      st.siren += dt;
      if (Math.floor(st.siren * 4) !== Math.floor((st.siren - dt) * 4) && Math.random() < 0.15) sfx.engine(speedPct);
      if (g.time <= 0 && !st.ended) {
        st.ended = true;
        const sc = 0.45 + Math.min(0.35, st.gap / 200) + Math.min(0.25, st.cash / 30) - Math.min(0.3, st.crashes * 0.04);
        g.end(sc, [[tr('Résultat', 'Result'), tr('🏁 SEMÉS !', '🏁 GOT AWAY!')], [tr('Avance sur les flics', 'Lead on cops'), `${Math.round(st.gap)} m`], [tr('Butin', 'Loot'), `💰 ${st.cash}`], [tr('Accidents', 'Crashes'), String(st.crashes)]]);
      }
    }
    // ─── render ───
    ctx.clearRect(0, 0, w, h);
    const horizon = h * 0.52;
    // sky
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, '#12002b'); sky.addColorStop(0.55, '#5b0f6b'); sky.addColorStop(1, '#ff4f9a');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, horizon);
    // stars
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    for (let i = 0; i < 60; i++) { const sx = (i * 97.3 + 13) % w, sy = (i * 53.7) % (horizon * 0.6); ctx.fillRect(sx, sy, 1.5, 1.5); }
    // sun with stripes
    const segI0 = Math.floor(st.z / SEG) % st.segs.length;
    const sunX = w / 2 - st.x * 40 - st.segs[segI0].curve * 30, sunY = horizon - h * 0.02, R = h * 0.2;
    const sg = ctx.createLinearGradient(0, sunY - R, 0, sunY + R);
    sg.addColorStop(0, '#ffe66d'); sg.addColorStop(0.6, '#ff6b9d'); sg.addColorStop(1, '#c026d3');
    ctx.save(); glow(ctx, '#ff6b9d', 50); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sunX, sunY, R, Math.PI, 0); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#5b0f6b';
    for (let i = 0; i < 6; i++) { const yy = sunY - R * 0.15 - i * R * 0.13; ctx.fillRect(sunX - R, yy, R * 2, 2 + i * 0.9); }
    // mountains (parallax)
    ctx.fillStyle = '#2a0a3d';
    ctx.beginPath(); ctx.moveTo(0, horizon);
    for (let i = 0; i <= 20; i++) { const mx = (i / 20) * w; const off = (st.z / 9000) * 60; ctx.lineTo(mx, horizon - 30 - Math.abs(Math.sin(i * 1.7 + off * 0.01)) * h * 0.09); }
    ctx.lineTo(w, horizon); ctx.fill();
    // ground
    ctx.fillStyle = '#12002b'; ctx.fillRect(0, horizon, w, h - horizon);
    // road projection (near → far, with clipping)
    const base = Math.floor(st.z / SEG);
    const pct = (st.z % SEG) / SEG;
    const camY = CAM_H + (st.segs[base % st.segs.length].y);
    let dx = -st.segs[base % st.segs.length].curve * pct, xAcc = 0, maxY = h;
    const proj: { x: number; y: number; wd: number; scale: number; i: number }[] = [];
    for (let n = 0; n < DRAW; n++) {
      const i = (base + n) % st.segs.length;
      const sgm = st.segs[i];
      const wz = (n - pct) * SEG + 1;
      const scale = CAM_DEPTH / (wz / 1000);
      const camX = st.x * ROAD_W - xAcc;
      const sx = w / 2 + scale * (-camX) * w / 2 / 1000;
      const sy = horizon + scale * (camY - sgm.y) * h / 2 / 1000 * 0.9;
      const sw = scale * ROAD_W * w / 2 / 1000;
      proj.push({ x: sx, y: sy, wd: sw, scale, i });
      xAcc += dx; dx += sgm.curve * 1.2;
    }
    for (let n = 1; n < proj.length; n++) {
      const p1 = proj[n - 1], p2 = proj[n];
      if (p2.y >= maxY) continue;
      const alt = Math.floor(p2.i / 3) % 2 === 0;
      const y1 = Math.min(p1.y, maxY), y2 = p2.y;
      // grass glow lines
      ctx.fillStyle = alt ? '#1a0533' : '#14022a';
      ctx.fillRect(0, y2, w, y1 - y2 + 1);
      const quad = (x1: number, w1: number, x2: number, w2: number, col: string) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x1 - w1, y1); ctx.lineTo(x2 - w2, y2); ctx.lineTo(x2 + w2, y2); ctx.lineTo(x1 + w1, y1); ctx.fill(); };
      quad(p1.x, p1.wd * 1.15, p2.x, p2.wd * 1.15, alt ? '#ff2d95' : '#22d3ee');
      quad(p1.x, p1.wd, p2.x, p2.wd, alt ? '#25163a' : '#211433');
      if (alt) for (let l = 1; l < LANES; l++) { const off = -1 + (2 * l) / LANES; quad(p1.x + p1.wd * off, p1.wd * 0.02, p2.x + p2.wd * off, p2.wd * 0.02, 'rgba(255,255,255,.75)'); }
      maxY = y2;
    }
    // sprites far → near: bags, cars, palm trees
    const items: { z: number; draw: () => void }[] = [];
    const place = (z: number, x: number, fn: (px: number, py: number, sc: number) => void) => {
      let dz = z - st.z; if (dz < 0) dz += st.segs.length * SEG;
      const n = Math.floor(dz / SEG); if (n <= 2 || n >= DRAW - 1) return;
      const p = proj[n]; if (!p) return;
      items.push({ z: dz, draw: () => fn(p.x + p.wd * x, p.y, p.scale) });
    };
    for (let n = 2; n < DRAW; n += 6) { const zz = (Math.floor(st.z / SEG) + n) * SEG; const side = (Math.floor(zz / SEG / 6) % 2) ? 1.5 : -1.5;
      place(zz, side, (px, py, sc) => { const s2 = sc * w * 0.9; ctx.fillStyle = '#0b0216'; ctx.fillRect(px - s2 * 0.02, py - s2 * 0.5, s2 * 0.04, s2 * 0.5); ctx.save(); glow(ctx, '#ff2d95', 8); ctx.strokeStyle = '#ff5bd1'; ctx.lineWidth = Math.max(1, s2 * 0.012); for (let a = 0; a < 5; a++) { ctx.beginPath(); ctx.moveTo(px, py - s2 * 0.5); ctx.quadraticCurveTo(px + Math.cos(a * 1.3) * s2 * 0.15, py - s2 * 0.6, px + Math.cos(a * 1.3) * s2 * 0.22, py - s2 * 0.42); ctx.stroke(); } ctx.restore(); }); }
    for (const b of st.bags) if (!b.got) place(b.z, b.x, (px, py, sc) => { const r = sc * w * 0.05; ctx.save(); glow(ctx, '#ffd166', 18); ctx.font = `${Math.max(8, r * 2)}px serif`; ctx.textAlign = 'center'; ctx.fillText('💰', px, py - r * 0.2); ctx.restore(); });
    for (const c of st.cars) place(c.z, c.x, (px, py, sc) => drawCar(ctx, px, py, sc * w * 0.33, c.color, false, st.t));
    items.sort((a, b) => b.z - a.z).forEach((it) => it.draw());
    // player car
    const pw = w * 0.2;
    const bounce = Math.sin(st.t * 30) * (st.speed / st.max) * 1.5;
    drawCar(ctx, w / 2 + st.steer * 6, h * 0.94 + bounce, pw, '#ff2d95', true, st.t, st.steer, st.boost);
    // police lights in the mirror (gap meter)
    const near = 1 - st.gap / 100;
    if (playing && near > 0.4) { const a = (near - 0.4) * 1.4 * (0.6 + 0.4 * Math.sin(st.t * 20)); const grd = ctx.createRadialGradient(Math.floor(st.t * 6) % 2 ? 0 : w, h, 0, Math.floor(st.t * 6) % 2 ? 0 : w, h, w * 0.6); grd.addColorStop(0, Math.floor(st.t * 6) % 2 ? `rgba(255,0,60,${a})` : `rgba(40,120,255,${a})`); grd.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h); }
    // speed lines when boosting
    if (st.boost) { ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2 + st.t * 3; const r1 = w * 0.25, r2 = w * 0.6; ctx.beginPath(); ctx.moveTo(w / 2 + Math.cos(a) * r1, h / 2 + Math.sin(a) * r1 * 0.6); ctx.lineTo(w / 2 + Math.cos(a) * r2, h / 2 + Math.sin(a) * r2 * 0.6); ctx.stroke(); } }
    // gauges
    ctx.font = '700 14px Fredoka Variable, sans-serif'; ctx.textAlign = 'left';
    ctx.fillStyle = '#fff'; ctx.fillText(`${Math.round(st.speed / 40)} km/h`, 16, h - 52);
    bar(ctx, 16, h - 40, 160, 10, st.nitro / 100, '#22d3ee', 'NITRO');
    bar(ctx, w - 176, h - 40, 160, 10, st.gap / 100, st.gap < 30 ? '#ff1f3d' : '#a3e635', tr('AVANCE 🚔', 'LEAD 🚔'));
  }, true);
  return (
    <Arena g={g} title={tr('La fuite', 'The getaway')} icon="🚓" theme="neon"
      howTo={tr('Les flics te collent au train. Esquive le trafic, ramasse les sacs de billets, garde ta vitesse pour les semer. Nitro = ↑ / Espace.', 'The cops are on your tail. Dodge traffic, grab the cash bags, keep your speed up to lose them. Nitro = ↑ / Space.')}
      keys={['← →', 'A D', '↑ / Space = NITRO']}>
      <canvas class="play" ref={canvas} />
    </Arena>
  );
}

function bar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, v: number, col: string, label: string) {
  ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(x, y, w, h);
  ctx.save(); glow(ctx, col, 10); ctx.fillStyle = col; ctx.fillRect(x, y, w * Math.max(0, Math.min(1, v)), h); ctx.restore();
  ctx.fillStyle = '#fff'; ctx.font = '700 11px Fredoka Variable, sans-serif'; ctx.fillText(label, x, y - 4);
}

function drawCar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, color: string, player: boolean, t: number, steer = 0, boost = false) {
  if (w < 3) return;
  const h = w * 0.42;
  ctx.save();
  ctx.translate(x, y);
  if (player) ctx.rotate(steer * 0.04);
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(0, 0, w * 0.55, h * 0.18, 0, 0, Math.PI * 2); ctx.fill();
  // body
  glow(ctx, color, player ? 24 : 12);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(-w * 0.5, -h * 0.15); ctx.lineTo(-w * 0.46, -h * 0.55); ctx.lineTo(w * 0.46, -h * 0.55); ctx.lineTo(w * 0.5, -h * 0.15); ctx.lineTo(w * 0.5, -h * 0.02); ctx.lineTo(-w * 0.5, -h * 0.02); ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0;
  // cabin
  ctx.fillStyle = '#0b0216'; ctx.beginPath(); ctx.moveTo(-w * 0.32, -h * 0.55); ctx.lineTo(-w * 0.24, -h * 0.92); ctx.lineTo(w * 0.24, -h * 0.92); ctx.lineTo(w * 0.32, -h * 0.55); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(34,211,238,.5)'; ctx.fillRect(-w * 0.22, -h * 0.88, w * 0.44, h * 0.28);
  // tail lights
  ctx.fillStyle = '#ff1f3d'; glow(ctx, '#ff1f3d', 14);
  ctx.fillRect(-w * 0.46, -h * 0.42, w * 0.2, h * 0.1); ctx.fillRect(w * 0.26, -h * 0.42, w * 0.2, h * 0.1);
  ctx.shadowBlur = 0;
  // wheels
  ctx.fillStyle = '#05010a'; ctx.fillRect(-w * 0.48, -h * 0.08, w * 0.16, h * 0.14); ctx.fillRect(w * 0.32, -h * 0.08, w * 0.16, h * 0.14);
  if (player && boost) { ctx.fillStyle = Math.floor(t * 30) % 2 ? '#22d3ee' : '#fff'; glow(ctx, '#22d3ee', 20); ctx.beginPath(); ctx.moveTo(-w * 0.12, 0); ctx.lineTo(0, h * (0.35 + Math.random() * 0.2)); ctx.lineTo(w * 0.12, 0); ctx.fill(); }
  ctx.restore();
}
