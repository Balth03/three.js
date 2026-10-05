// Surgery: "Operation"-style top-down patient. 1) trace the incision, 2) pull 3 absurd foreign objects
// out through narrow channels without touching the edges (BZZZT), 3) stitch in rhythm. A live ECG beeps
// faster with every mistake — and if you botch too much, the patient flatlines and you get the paddles.
import { useRef } from 'preact/hooks';
import { useGame, useCanvas, useKeys, Arena, tr, glow, rand, clamp01, roundRect, type GameProps } from './kit.tsx';
import { synth } from '../../audio.ts';

const VW = 1000, VH = 600, N = 140, H_OPEN = 112, STITCHES = 7, BEAT = 0.62, FLAT_ERR = 9;
const FONT = 'Fredoka Variable, sans-serif';
type Stage = 'cut' | 'open' | 'extract' | 'stitch' | 'flat' | 'done';
type Kind = 'lego' | 'keys' | 'duck' | 'airpod' | 'remote' | 'fry' | 'phone';
const OBJ_NAMES: Record<Kind, [string, string]> = {
  lego: ['une figurine Lego', 'a Lego figure'],
  keys: ['les clés de la Clio', 'the keys to the Clio'],
  duck: ['un canard en plastique', 'a rubber duck'],
  airpod: ['un AirPod (le gauche)', 'an AirPod (the left one)'],
  remote: ['la télécommande de la télé', 'the TV remote'],
  fry: ['une frite McDo de 2009', 'a McDonald\'s fry from 2009'],
  phone: ['un téléphone qui sonne encore', 'a phone, still ringing'],
};
const OUCH: [string, string][] = [['AÏE !', 'OUCH!'], ['Mais ça va pas ?!', 'Are you insane?!'], ['Ma mutuelle rembourse pas ça !', 'My insurance won\'t cover this!'], ['Maman ?', 'Mummy?'], ['Je vois la lumière…', 'I can see the light…'], ['C\'est mon rein, ça ?', 'Is that my kidney?']];
// channels as (u along the incision, offset across it) — the last point lies outside the cavity
const CHANNELS: [number, number][][] = [
  [[0.2, 18], [0.2, -38], [0.33, -50], [0.33, -138]],
  [[0.47, 30], [0.6, 30], [0.6, 70], [0.73, 70], [0.73, 150]],
  [[0.84, -6], [0.84, -40], [0.7, -52], [0.7, -140]],
];
const OBJ_R = 16, HALF_W = 28;

interface Obj { kind: Kind; x: number; y: number; ch: { x: number; y: number }[]; done: boolean; held: boolean; fly: number; fx: number; fy: number; slot: number; touchT: number }
interface Drop { x: number; y: number; z: number; vx: number; vy: number; vz: number; r: number }
interface Pt { x: number; y: number }

function segDist(p: Pt, a: Pt, b: Pt) {
  const dx = b.x - a.x, dy = b.y - a.y, L = dx * dx + dy * dy || 1;
  const k = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L));
  const x = a.x + dx * k, y = a.y + dy * k;
  return { d: Math.hypot(p.x - x, p.y - y), x, y, k };
}
function polyNearest(p: Pt, pts: Pt[]) {
  let best = { d: 1e9, x: 0, y: 0, k: 0, seg: 0 };
  for (let i = 0; i < pts.length - 1; i++) { const r = segDist(p, pts[i], pts[i + 1]); if (r.d < best.d) best = { ...r, seg: i }; }
  return best;
}
function ecg(ph: number) {
  const g = (c: number, w: number) => Math.exp(-((ph - c) ** 2) / (2 * w * w));
  return 0.1 * g(0.15, 0.03) - 0.12 * g(0.3, 0.01) + 1 * g(0.33, 0.012) - 0.28 * g(0.36, 0.012) + 0.22 * g(0.58, 0.05);
}

const snd = {
  beep: (hi: boolean) => synth.tone(hi ? 1320 : 988, 0.07, 'sine', 0.05),
  buzz: () => { synth.tone(110, 0.28, 'sawtooth', 0.12); synth.tone(55, 0.3, 'square', 0.08); synth.noise(0.2, 0.12, 300); },
  squirt: () => { synth.noise(0.22, 0.2, 500); synth.tone(300, 0.15, 'sine', 0.1, 0, 0.4); },
  cut: () => synth.noise(0.05, 0.03, 5000),
  pluck: () => { synth.tone(660, 0.08, 'triangle', 0.1, 0, 1.6); synth.tone(990, 0.12, 'triangle', 0.08, 0.06, 1.4); },
  stitch: (i: number) => { const f = 523 * Math.pow(2, [0, 2, 4, 7, 9, 12, 14][i % 7] / 12); synth.tone(f, 0.16, 'triangle', 0.08); synth.noise(0.08, 0.06, 3500); },
  tick: () => { synth.tone(1800, 0.03, 'square', 0.03); },
  alarm: () => { synth.tone(880, 0.18, 'square', 0.04); synth.tone(660, 0.18, 'square', 0.04, 0.2); },
  flat: () => synth.tone(1000, 2.6, 'sine', 0.06),
  zap: () => { synth.noise(0.35, 0.35, 180); synth.tone(70, 0.4, 'sine', 0.4, 0, 0.4); synth.tone(1600, 0.25, 'sawtooth', 0.03, 0, 0.3); },
  ring: () => { [1319, 1568, 1319, 1568].forEach((f, i) => synth.tone(f, 0.08, 'square', 0.025, i * 0.1)); },
};

function makePath() {
  const amp = rand(20, 34) * (Math.random() < 0.5 ? -1 : 1), tilt = rand(-26, 26);
  const P: Pt[] = [], Nn: Pt[] = [];
  for (let i = 0; i < N; i++) { const u = i / (N - 1); P.push({ x: 285 + 320 * u, y: 300 + amp * Math.sin(2 * Math.PI * u) * Math.sin(Math.PI * u * 0.9 + 0.15) + tilt * (u - 0.5) }); }
  for (let i = 0; i < N; i++) { const a = P[Math.max(0, i - 1)], b = P[Math.min(N - 1, i + 1)]; const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1; Nn.push({ x: -dy / L, y: dx / L }); }
  return { P, Nn };
}

function newState() {
  const { P, Nn } = makePath();
  const at = (u: number, off: number) => { const i = Math.round(clamp01(u) * (N - 1)); return { x: P[i].x + Nn[i].x * off, y: P[i].y + Nn[i].y * off }; };
  const kinds = (Object.keys(OBJ_NAMES) as Kind[]).sort(() => Math.random() - 0.5).slice(0, 3);
  const objs: Obj[] = CHANNELS.map((c, i) => { const ch = c.map(([u, o]) => at(u, o)); return { kind: kinds[i], x: ch[0].x, y: ch[0].y, ch, done: false, held: false, fly: -1, fx: 0, fy: 0, slot: -1, touchT: 0 }; });
  const intest: Pt[][] = [];
  for (let k = 0; k < 7; k++) { const pts: Pt[] = []; let x = rand(250, 330), y = rand(200, 400); for (let i = 0; i < 9; i++) { pts.push({ x, y }); x += rand(30, 60); y += rand(-45, 45); } intest.push(pts); }
  return {
    P, Nn, at, objs, intest, W: 800, H: 500, S: 1, ox: 0, oy: 0,
    stage: 'cut' as Stage, st: 0, t: 0, mx: 300, my: 300, down: false,
    prog: 0, cutting: false, devSum: 0, devN: 0, cutErr: 0, lastErr: -9, open: 0,
    touches: 0, extracted: 0, held: -1,
    stitched: 0, sPerfect: 0, sGood: 0, sMiss: 0, sResults: [] as number[], stitchT0: 0, nextTick: 0,
    bpm: 78, stress: 0, phase: 0, spike: 0, ecgBuf: new Float32Array(240), ecgW: 0, alarmT: 0,
    shake: 0, drops: [] as Drop[], splats: [] as { x: number; y: number; r: number; a: number }[],
    eyes: 0, bubble: null as null | { txt: string; t: number }, banner: null as null | { txt: string; sub: string; col: string; t: number },
    flatT: 0, zaps: 0, jump: 0, outcome: 'alive' as 'alive' | 'revived' | 'dead' | 'awake',
    ended: false, inited: false, ringT: 2, flashCut: 0, zz: 0,
  };
}
type S = ReturnType<typeof newState>;

export function Surgery2({ onDone }: GameProps) {
  const g = useGame({ duration: 50, onDone });
  const s = useRef<S>(newState());

  const toV = (e: PointerEvent) => {
    const c = canvas.current, st = s.current; if (!c) return null;
    const r = c.getBoundingClientRect(); if (!r.width) return null;
    const lx = ((e.clientX - r.left) / r.width) * st.W, ly = ((e.clientY - r.top) / r.height) * st.H;
    return { x: (lx - st.ox) / st.S, y: (ly - st.oy) / st.S };
  };
  const pct = (x: number, y: number): [number, number] => {
    const c = canvas.current, st = s.current; if (!c) return [50, 50];
    const r = c.getBoundingClientRect();
    return [((r.left + st.ox + x * st.S * (r.width / st.W)) / window.innerWidth) * 100, ((r.top + st.oy + y * st.S * (r.height / st.H)) / window.innerHeight) * 100];
  };
  /** Effective tool tip = mouse + hand tremor. */
  const tip = (st: S) => { const k = 2 + st.stress * 0.9 + Math.max(0, st.bpm - 80) * 0.06; return { x: st.mx + (Math.sin(st.t * 23) + Math.sin(st.t * 37) * 0.6) * k, y: st.my + (Math.cos(st.t * 29) + Math.sin(st.t * 17) * 0.6) * k }; };

  const mistake = (st: S, x: number, y: number, label: string, blood = 14) => {
    st.stress += 1; st.bpm = Math.min(200, st.bpm + 13); st.spike = 1; st.shake = 1; st.eyes = 1.4;
    const o = OUCH[Math.floor(Math.random() * OUCH.length)];
    st.bubble = { txt: tr(o[0], o[1]), t: 0 };
    spurt(st, x, y, blood);
    const [px, py] = pct(x, y);
    g.miss(label, px, py - 4); g.flash('#ff1f3d');
  };
  const spurt = (st: S, x: number, y: number, n: number) => {
    for (let i = 0; i < n; i++) { const a = rand(0, Math.PI * 2), sp = rand(40, 230); st.drops.push({ x, y, z: 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, vz: rand(120, 360), r: rand(2.5, 6) }); }
    snd.squirt();
  };

  const stitchHit = (st: S, viaKey: boolean) => {
    if (st.stage !== 'stitch' || st.stitched >= STITCHES) return;
    const i = st.stitched, ti = st.stitchT0 + i * BEAT, dtb = st.st - ti;
    const p = stitchPt(st, i);
    if (!viaKey) { const tp = tip(st); if (Math.hypot(tp.x - p.x, tp.y - p.y) > 44) return; }
    if (dtb < -0.45) return; // way too early: ignore
    const [px, py] = pct(p.x, p.y);
    const a = Math.abs(dtb);
    if (a < 0.075) { st.sPerfect++; st.sResults.push(2); g.hit('perfect'); g.add(300, tr('PARFAIT', 'PERFECT'), px, py - 6, '#7fdcff'); g.burst(px, py, '#7fdcff', 14); }
    else if (a < 0.17) { st.sGood++; st.sResults.push(1); g.hit('good'); g.add(150, tr('OK', 'OK'), px, py - 6, '#fff'); }
    else { st.sMiss++; st.sResults.push(0); mistake(st, p.x, p.y, dtb < 0 ? tr('TROP TÔT', 'TOO EARLY') : tr('TROP TARD', 'TOO LATE'), 8); }
    snd.stitch(i);
    st.stitched++;
  };
  const stitchPt = (st: S, i: number) => st.at(0.1 + (0.8 * i) / (STITCHES - 1), i % 2 ? 15 : -15);

  const onDown = (e: PointerEvent) => {
    const st = s.current, p = toV(e); if (!p) return;
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* ignore */ }
    st.mx = p.x; st.my = p.y; st.down = true;
    if (g.phase !== 'play') return;
    const tp = tip(st);
    if (st.stage === 'cut') {
      const q = st.P[st.prog];
      if (Math.hypot(tp.x - q.x, tp.y - q.y) < 36) { st.cutting = true; snd.cut(); } else st.flashCut = 1;
    } else if (st.stage === 'extract') {
      st.objs.forEach((o, i) => { if (!o.done && o.fly < 0 && st.held < 0 && Math.hypot(tp.x - o.x, tp.y - o.y) < OBJ_R + 14) { st.held = i; o.held = true; synth.tone(1200, 0.04, 'square', 0.04); } });
    } else if (st.stage === 'stitch') stitchHit(st, false);
    else if (st.stage === 'flat') zap(st);
  };
  const onMove = (e: PointerEvent) => { const st = s.current, p = toV(e); if (!p) return; st.mx = p.x; st.my = p.y; };
  const onUp = () => { const st = s.current; st.down = false; st.cutting = false; if (st.held >= 0) { st.objs[st.held].held = false; st.held = -1; } };
  const zap = (st: S) => {
    if (st.stage !== 'flat' || st.outcome !== 'alive') return;
    st.zaps++; st.jump = 1; st.shake = 1.2; st.spike = 1.5; snd.zap(); g.flash('#ffffff'); g.shake();
    const [px, py] = pct(430, 300); g.float(tr('DÉGAGEZ !', 'CLEAR!'), px, py - 10, '#7fdcff', true);
    if (st.zaps >= 4) {
      st.outcome = 'revived'; st.bpm = 128; st.stage = 'done'; st.st = 0; g.burst(px, py, '#a3e635', 30);
      st.banner = { txt: tr('IL EST VIVANT !', 'IT\'S ALIVE!'), sub: tr('Légèrement grillé, mais vivant.', 'Slightly toasted, but alive.'), col: '#a3e635', t: 0 };
      st.bubble = { txt: tr('…j\'ai vu ma grand-mère.', '…I saw my grandma.'), t: 0 };
    }
  };

  useKeys((e) => {
    if (e.repeat) return;
    const st = s.current;
    if (g.phase !== 'play') return;
    if (e.code === 'Space' || e.code === 'Enter') { if (st.stage === 'stitch') stitchHit(st, true); else if (st.stage === 'flat') zap(st); }
  });

  const finish = (st: S) => {
    if (st.ended) return;
    st.ended = true;
    const inc = st.prog >= N - 3 ? clamp01(1 - (st.devSum / Math.max(1, st.devN)) / 22 - st.cutErr * 0.05) : (st.prog / N) * 0.4;
    const extr = (st.extracted / 3) * clamp01(1 - st.touches * 0.09);
    const sti = (st.sPerfect + st.sGood * 0.6) / STITCHES;
    const timeB = clamp01(g.time / 14);
    let sc = 0.28 * inc + 0.34 * extr + 0.26 * sti + 0.12 * timeB;
    if (st.outcome === 'revived') sc *= 0.8; else if (st.outcome === 'dead') sc *= 0.35; else if (st.outcome === 'awake') sc *= 0.75;
    const used = 50 - g.time;
    g.end(sc, [
      [tr('Précision incision', 'Incision accuracy'), `${Math.round(inc * 100)}%`],
      [tr('Contacts (BZZZT)', 'Edge touches (BZZZT)'), `⚡ ${st.touches}`],
      [tr('Objets extraits', 'Objects removed'), `${st.extracted}/3`],
      [tr('Points de suture', 'Stitches'), `${st.sPerfect + st.sGood}/${STITCHES} (${st.sPerfect} ${tr('parfaits', 'perfect')})`],
      [tr('Patient', 'Patient'), st.outcome === 'alive' ? tr(`😎 Vivant (${used.toFixed(1)} s)`, `😎 Alive (${used.toFixed(1)} s)`) : st.outcome === 'revived' ? tr('⚡ Réanimé de justesse', '⚡ Barely revived') : st.outcome === 'dead' ? tr('☠️ Décédé (oups)', '☠️ Deceased (oops)') : tr('😱 Réveillé pendant l\'op', '😱 Woke up mid-op')],
    ]);
  };

  const update = (st: S, dt: number) => {
    st.st += dt;
    // heart
    const rest = 76 + st.stress * 5;
    st.bpm += (rest - st.bpm) * Math.min(1, dt * 0.35);
    st.spike = Math.max(0, st.spike - dt * 1.8);
    st.eyes = Math.max(0, st.eyes - dt);
    st.shake = Math.max(0, st.shake - dt * 2.5);
    st.jump = Math.max(0, st.jump - dt * 3);
    const flat = st.stage === 'flat' && st.outcome === 'alive' || st.outcome === 'dead';
    if (!flat) {
      const prev = st.phase;
      st.phase += (dt * st.bpm) / 60;
      if (Math.floor(st.phase) !== Math.floor(prev)) snd.beep(st.bpm > 125);
    }
    if (st.bpm > 140 && !flat) { st.alarmT -= dt; if (st.alarmT <= 0) { st.alarmT = 0.9; snd.alarm(); } }
    if (g.time <= 0 && st.stage !== 'done' && st.stage !== 'flat') {
      st.outcome = 'awake'; st.stage = 'done'; st.st = 0; st.eyes = 3;
      st.banner = { txt: tr('IL SE RÉVEILLE !', 'HE\'S WAKING UP!'), sub: tr('Anesthésie terminée. Lui, non.', 'The anaesthesia is over. The surgery isn\'t.'), col: '#ff4d6d', t: 0 };
      st.bubble = { txt: tr('…POURQUOI JE VOIS MES INTESTINS ?', '…WHY CAN I SEE MY GUTS?'), t: 0 };
      snd.alarm();
    }
    const tp = tip(st);
    if (st.stage === 'cut') {
      if (st.cutting) {
        // nearest point (deviation) + progress
        let bi = 0, bd = 1e9;
        for (let i = 0; i < N; i++) { const d = Math.hypot(tp.x - st.P[i].x, tp.y - st.P[i].y); if (d < bd) { bd = d; bi = i; } }
        st.devSum += Math.min(bd, 40) * dt * 60; st.devN += dt * 60;
        if (bd < 17 && bi > st.prog && bi <= st.prog + 14) {
          const gain = bi - st.prog; st.prog = bi;
          if (Math.random() < 0.5) snd.cut();
          g.add(gain * 4);
          if (Math.random() < 0.25) st.drops.push({ x: tp.x, y: tp.y, z: 1, vx: rand(-30, 30), vy: rand(-30, 30), vz: rand(30, 80), r: rand(1.5, 3) });
        }
        if (bd > 17 && st.t - st.lastErr > 0.4) { st.lastErr = st.t; st.cutErr++; mistake(st, tp.x, tp.y, tr('À CÔTÉ !', 'OFF THE LINE!')); }
        if (bd > 60) st.cutting = false;
        if (st.prog >= N - 3) {
          st.prog = N - 1; st.cutting = false; st.stage = 'open'; st.st = 0;
          synth.noise(0.5, 0.15, 400); synth.tone(200, 0.4, 'sine', 0.1, 0, 0.5);
          const [px, py] = pct(445, 300); g.add(500, tr('INCISION OK', 'CLEAN CUT'), px, py - 18, '#7fdcff');
        }
      }
    } else if (st.stage === 'open') {
      st.open = Math.min(1, st.st / 0.8);
      if (st.st > 0.9) { st.stage = 'extract'; st.st = 0; st.banner = { txt: tr('2. EXTRACTION', '2. EXTRACTION'), sub: tr('Sors les 3 objets par leur couloir. NE TOUCHE PAS LES BORDS.', 'Pull the 3 objects out through their lanes. DON\'T TOUCH THE EDGES.'), col: '#7fdcff', t: 0 }; }
    } else if (st.stage === 'extract') {
      st.ringT -= dt;
      const phone = st.objs.find((o) => o.kind === 'phone' && !o.done);
      if (phone && st.ringT <= 0) { st.ringT = 2.4; snd.ring(); }
      if (st.held >= 0) {
        const o = st.objs[st.held];
        o.x += (tp.x - o.x) * Math.min(1, dt * 22); o.y += (tp.y - o.y) * Math.min(1, dt * 22);
        const nr = polyNearest(o, o.ch);
        const lim = HALF_W - OBJ_R;
        if (nr.d > lim) {
          // wall contact
          const k = (lim - 1) / nr.d;
          o.x = nr.x + (o.x - nr.x) * k; o.y = nr.y + (o.y - nr.y) * k;
          if (st.t - o.touchT > 0.5) { o.touchT = st.t; st.touches++; snd.buzz(); mistake(st, o.x, o.y, 'BZZZT !', 10); }
          if (Math.hypot(tp.x - o.x, tp.y - o.y) > 70) { o.held = false; st.held = -1; }
        }
        if (nr.seg === o.ch.length - 2 && nr.k > 0.82) {
          o.done = true; o.held = false; st.held = -1; o.fly = 0; o.fx = o.x; o.fy = o.y; o.slot = st.extracted; st.extracted++;
          snd.pluck(); g.hit('perfect'); const [px, py] = pct(o.x, o.y);
          g.add(600, `+ ${tr(OBJ_NAMES[o.kind][0], OBJ_NAMES[o.kind][1])} !`, px, py - 6, '#ffd166'); g.burst(px, py, '#ffd166', 20);
        }
      }
      for (const o of st.objs) if (o.fly >= 0 && o.fly < 1) o.fly = Math.min(1, o.fly + dt * 1.6);
      if (st.extracted >= 3 && st.objs.every((o) => o.fly >= 1)) {
        st.stage = 'stitch'; st.st = 0; st.stitchT0 = 1.6; st.nextTick = 0;
        st.banner = { txt: tr('3. SUTURE', '3. STITCHES'), sub: tr('Clique chaque point quand l\'anneau se referme (ou Espace).', 'Click each dot as the ring closes (or Space).'), col: '#7fdcff', t: 0 };
      }
    } else if (st.stage === 'stitch') {
      // metronome
      const bi = Math.floor((st.st - st.stitchT0) / BEAT + 3);
      if (bi >= st.nextTick && bi < STITCHES + 3) { st.nextTick = bi + 1; snd.tick(); }
      const i = st.stitched;
      if (i < STITCHES && st.st - (st.stitchT0 + i * BEAT) > 0.2) { st.sMiss++; st.sResults.push(0); const p = stitchPt(st, i); mistake(st, p.x, p.y, tr('RATÉ', 'MISSED'), 6); st.stitched++; }
      st.open = Math.max(0, 1 - st.stitched / STITCHES) * 0.92 + 0.08 * (st.stitched < STITCHES ? 1 : 0);
      if (st.stitched >= STITCHES && st.st > st.stitchT0 + STITCHES * BEAT) {
        st.open = 0;
        const errs = st.cutErr + st.touches + st.sMiss;
        if (errs >= FLAT_ERR || st.bpm > 172) {
          st.stage = 'flat'; st.st = 0; st.flatT = 3.6; snd.flat(); g.flash('#ff1f3d');
          st.banner = { txt: tr('ARRÊT CARDIAQUE !', 'CARDIAC ARREST!'), sub: tr('DÉFIBRILLE ! Clique / Espace ×4, VITE !', 'DEFIBRILLATE! Click / Space ×4, FAST!'), col: '#ff1f3d', t: 0 };
        } else {
          st.stage = 'done'; st.st = 0;
          st.banner = { txt: tr('OPÉRATION RÉUSSIE !', 'SURGERY SUCCESS!'), sub: tr('Le patient survivra. Probablement.', 'The patient will live. Probably.'), col: '#a3e635', t: 0 };
          st.bubble = { txt: tr('…j\'ai faim. On mange quoi ?', '…I\'m hungry. What\'s for dinner?'), t: 0 };
          g.burst(...pct(445, 300), '#a3e635', 30); synth.tone(523, 0.2, 'triangle', 0.1); synth.tone(784, 0.3, 'triangle', 0.1, 0.12);
        }
      }
    } else if (st.stage === 'flat') {
      st.flatT -= dt;
      if (st.flatT <= 0 && st.outcome === 'alive') {
        st.outcome = 'dead'; st.stage = 'done'; st.st = 0;
        st.banner = { txt: tr('HEURE DU DÉCÈS : MAINTENANT', 'TIME OF DEATH: NOW'), sub: tr('Bon. On dira que c\'était une complication.', 'Well. We\'ll call it a "complication".'), col: '#ff1f3d', t: 0 };
      }
    } else if (st.stage === 'done') {
      if (st.st > 2.2) finish(st);
    }
  };

  const canvas = useCanvas((ctx, w, h, dt) => {
    const st = s.current;
    st.W = w; st.H = h;
    st.S = Math.min(w / VW, h / VH); st.ox = (w - VW * st.S) / 2; st.oy = (h - VH * st.S) / 2;
    st.t += dt;
    if (!st.inited) { st.inited = true; }
    if (g.phase === 'play' && !st.banner && st.stage === 'cut' && st.st === 0) st.banner = { txt: tr('1. INCISION', '1. INCISION'), sub: tr('Suis les pointillés au scalpel, sans trembler.', 'Follow the dotted line with the scalpel. No shaking.'), col: '#7fdcff', t: 0 };
    try { if (g.phase === 'play' && !st.ended) update(st, dt); } catch { /* never throw */ }
    try { render(ctx, st, w, h, dt); } catch { /* never throw */ }
  }, true);

  function render(ctx: CanvasRenderingContext2D, st: S, w: number, h: number, dt: number) {
    const t = st.t;
    // floor tiles (full canvas)
    ctx.fillStyle = '#0b2530'; ctx.fillRect(0, 0, w, h);
    const ts = 46 * st.S;
    ctx.strokeStyle = 'rgba(127,220,255,.08)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = (st.ox % ts); x < w; x += ts) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = (st.oy % ts); y < h; y += ts) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
    ctx.save();
    const shx = (Math.random() - 0.5) * st.shake * 10, shy = (Math.random() - 0.5) * st.shake * 8;
    ctx.translate(st.ox + shx, st.oy + shy); ctx.scale(st.S, st.S);
    // ─ table
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
    const tg = ctx.createLinearGradient(0, 40, 0, 560); tg.addColorStop(0, '#9fb3c4'); tg.addColorStop(0.5, '#cfdbe6'); tg.addColorStop(1, '#7f93a6');
    ctx.fillStyle = tg; roundRect(ctx, 24, 46, 668, 508, 26); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#2b3e50'; roundRect(ctx, 36, 58, 644, 484, 20); ctx.fill();
    // patient (scaled by the defib jump)
    ctx.save();
    const jz = 1 + st.jump * 0.05; ctx.translate(358, 300); ctx.scale(jz, jz); ctx.translate(-358, -300);
    // head
    drawHead(ctx, st, t);
    // drape
    const dg = ctx.createLinearGradient(0, 110, 0, 490); dg.addColorStop(0, '#1f7a6c'); dg.addColorStop(0.5, '#2a9583'); dg.addColorStop(1, '#17645a');
    ctx.fillStyle = dg; roundRect(ctx, 182, 92, 492, 416, 30); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 3;
    for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(200 + i * 70, 96); ctx.quadraticCurveTo(215 + i * 70, 300, 196 + i * 70, 504); ctx.stroke(); }
    // skin window
    ctx.save(); roundRect(ctx, 238, 154, 414, 292, 34); ctx.clip();
    const sk = ctx.createRadialGradient(445, 300, 30, 445, 300, 260); sk.addColorStop(0, '#f6c9a4'); sk.addColorStop(1, '#d99a72');
    ctx.fillStyle = sk; ctx.fillRect(238, 154, 414, 292);
    ctx.fillStyle = 'rgba(190,100,40,.22)'; ctx.fillRect(238, 154, 414, 292); // betadine
    ctx.fillStyle = 'rgba(120,60,30,.25)'; ctx.beginPath(); ctx.ellipse(445, 300 + 70, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill(); // belly button
    // blood splats on skin
    for (const sp of st.splats) { ctx.fillStyle = `rgba(150,0,18,${sp.a})`; ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    // clamps
    for (const [x, y] of [[238, 154], [652, 154], [238, 446], [652, 446]]) { ctx.fillStyle = '#c9d6e3'; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#5b6b7c'; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); }
    // ─ incision line / cavity
    drawIncision(ctx, st, t);
    ctx.restore(); // patient
    // ─ operating lamp
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const lx = 445 + Math.sin(t * 0.4) * 10, ly = 300 + Math.cos(t * 0.33) * 6;
    const lg = ctx.createRadialGradient(lx, ly, 20, lx, ly, 300); lg.addColorStop(0, 'rgba(255,255,240,.16)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = lg; ctx.fillRect(0, 0, 700, 600); ctx.restore();
    const vg = ctx.createRadialGradient(400, 300, 220, 400, 300, 560); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,10,20,.55)');
    ctx.fillStyle = vg; ctx.fillRect(-200, -100, 1400, 800);
    // ─ blood drops in the air
    for (let i = st.drops.length - 1; i >= 0; i--) {
      const d = st.drops[i];
      d.vz -= 900 * dt; d.z += d.vz * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.vx *= 1 - dt * 1.5; d.vy *= 1 - dt * 1.5;
      if (d.z <= 0) { st.splats.push({ x: d.x, y: d.y, r: d.r * rand(0.9, 1.6), a: rand(0.55, 0.85) }); if (st.splats.length > 160) st.splats.shift(); st.drops.splice(i, 1); continue; }
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.arc(d.x + d.z * 0.15, d.y + d.z * 0.2, d.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e0102c'; ctx.beginPath(); ctx.arc(d.x, d.y - d.z * 0.15, d.r * (1 + d.z / 160), 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,150,150,.6)'; ctx.beginPath(); ctx.arc(d.x - d.r * 0.3, d.y - d.z * 0.15 - d.r * 0.3, d.r * 0.3, 0, Math.PI * 2); ctx.fill();
    }
    // ─ right panel: monitor, steps, tremor, tray
    drawPanel(ctx, st, t, dt);
    // ─ patient bubble
    if (st.bubble) {
      st.bubble.t += dt; if (st.bubble.t > 2.4) st.bubble = null;
      else drawBubble(ctx, 150, 222, st.bubble.txt, Math.min(1, st.bubble.t * 7));
    }
    // ─ tool cursor
    if (g.phase === 'play' || g.phase === 'count') {
      const tp = tip(st);
      const tool = st.stage === 'cut' || st.stage === 'open' ? 'scalpel' : st.stage === 'extract' ? 'tweezers' : st.stage === 'flat' ? 'paddles' : 'needle';
      drawTool(ctx, tp.x + 10, tp.y + 14, tool, st.held >= 0, true);
      drawTool(ctx, tp.x, tp.y, tool, st.held >= 0, false);
    }
    // flatline red pulse
    if (st.stage === 'flat' && st.outcome === 'alive') { ctx.fillStyle = `rgba(255,0,40,${0.12 + 0.1 * Math.sin(t * 14)})`; ctx.fillRect(-200, -100, 1400, 800); }
    // banner
    if (st.banner) {
      st.banner.t += dt;
      const bt = st.banner.t;
      if (bt > 2.6) st.banner = null;
      else {
        const sc = bt < 0.16 ? 2.2 - (bt / 0.16) * 1.2 : 1;
        const a = bt > 2.1 ? 1 - (bt - 2.1) / 0.5 : 1;
        ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.translate(445, 92); ctx.scale(sc, sc); ctx.rotate(-0.03);
        ctx.font = `900 54px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
        ctx.lineWidth = 10; ctx.strokeStyle = '#04142b'; ctx.strokeText(st.banner.txt, 0, 0);
        glow(ctx, st.banner.col, 24); ctx.fillStyle = st.banner.col; ctx.fillText(st.banner.txt, 0, 0); ctx.shadowBlur = 0;
        if (st.banner.sub) { ctx.font = `700 18px ${FONT}`; ctx.lineWidth = 5; ctx.strokeText(st.banner.sub, 0, 40); ctx.fillStyle = '#fff'; ctx.fillText(st.banner.sub, 0, 40); }
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function drawHead(ctx: CanvasRenderingContext2D, st: S, t: number) {
    ctx.save(); ctx.translate(122, 300); ctx.rotate(-Math.PI / 2);
    // shoulders hint under the drape
    ctx.fillStyle = '#d99a72'; ctx.fillRect(-26, 40, 52, 30);
    ctx.fillStyle = '#f2bf98'; ctx.beginPath(); ctx.ellipse(0, 0, 54, 62, 0, 0, Math.PI * 2); ctx.fill();
    // cap
    ctx.fillStyle = '#7fb8e6'; ctx.beginPath(); ctx.ellipse(0, -14, 58, 50, 0, Math.PI, 0); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 2; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 14, -60); ctx.lineTo(i * 15, -16); ctx.stroke(); }
    ctx.fillStyle = '#6aa3d3'; ctx.fillRect(-58, -18, 116, 8);
    // ears
    ctx.fillStyle = '#e8a982'; ctx.beginPath(); ctx.ellipse(-55, 6, 8, 13, 0, 0, Math.PI * 2); ctx.ellipse(55, 6, 8, 13, 0, 0, Math.PI * 2); ctx.fill();
    // eyes
    const open = st.eyes > 0 || st.outcome === 'awake';
    if (open) {
      const wob = Math.sin(t * 30) * 1.5;
      for (const sx of [-20, 20]) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sx, 4, 13, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#7a3a2a'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(sx + wob, 5, 3.5, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = '#5a2d0c'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-30, -16); ctx.lineTo(-10, -20); ctx.moveTo(30, -16); ctx.lineTo(10, -20); ctx.stroke();
    } else if (st.outcome === 'dead') {
      ctx.strokeStyle = '#5a2d0c'; ctx.lineWidth = 3;
      for (const sx of [-20, 20]) { ctx.beginPath(); ctx.moveTo(sx - 7, -3); ctx.lineTo(sx + 7, 11); ctx.moveTo(sx + 7, -3); ctx.lineTo(sx - 7, 11); ctx.stroke(); }
    } else {
      ctx.strokeStyle = '#7a3a2a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (const sx of [-20, 20]) { ctx.beginPath(); ctx.arc(sx, 2, 9, 0.2, Math.PI - 0.2); ctx.stroke(); }
    }
    // nose
    ctx.fillStyle = '#e09e78'; ctx.beginPath(); ctx.ellipse(0, 18, 7, 9, 0, 0, Math.PI * 2); ctx.fill();
    // anaesthesia mask + tube
    ctx.fillStyle = 'rgba(160,230,210,.55)'; ctx.strokeStyle = 'rgba(220,255,245,.8)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-24, 14); ctx.quadraticCurveTo(0, 2, 24, 14); ctx.quadraticCurveTo(28, 44, 0, 50); ctx.quadraticCurveTo(-28, 44, -24, 14); ctx.fill(); ctx.stroke();
    if (open) { ctx.fillStyle = '#5a0f1a'; ctx.beginPath(); ctx.ellipse(0, 36, 7, 9, 0, 0, Math.PI * 2); ctx.fill(); }
    // breath fog
    ctx.fillStyle = `rgba(255,255,255,${0.12 + 0.12 * Math.sin(t * 2.2)})`; ctx.beginPath(); ctx.ellipse(0, 34, 14, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // tube to the machine (screen space)
    ctx.strokeStyle = '#b9d7e8'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(165, 300); ctx.bezierCurveTo(200, 230, 120, 120, 160, 50); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; ctx.stroke();
    // Zzz
    if (!open && st.outcome !== 'dead') {
      ctx.font = `800 16px ${FONT}`; ctx.fillStyle = 'rgba(200,240,255,.7)'; ctx.textAlign = 'center';
      for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1; ctx.globalAlpha = 1 - k; ctx.fillText('z', 90 - k * 30, 240 - k * 70 - i * 2); }
      ctx.globalAlpha = 1;
    }
  }

  function lensPath(ctx: CanvasRenderingContext2D, st: S, open: number, grow = 0) {
    ctx.beginPath();
    for (let i = 0; i < N; i++) { const u = i / (N - 1), k = (open * H_OPEN + grow) * Math.pow(Math.sin(Math.PI * u), 0.8); const x = st.P[i].x - st.Nn[i].x * k, y = st.P[i].y - st.Nn[i].y * k; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = N - 1; i >= 0; i--) { const u = i / (N - 1), k = (open * H_OPEN + grow) * Math.pow(Math.sin(Math.PI * u), 0.8); ctx.lineTo(st.P[i].x + st.Nn[i].x * k, st.P[i].y + st.Nn[i].y * k); }
    ctx.closePath();
  }

  function drawIncision(ctx: CanvasRenderingContext2D, st: S, t: number) {
    const P = st.P;
    const open = st.open;
    if (open > 0.01) {
      // skin rim + fat layer
      lensPath(ctx, st, open, 7); ctx.fillStyle = '#c96e55'; ctx.fill();
      lensPath(ctx, st, open, 3); ctx.fillStyle = '#ffd98a'; ctx.fill();
      lensPath(ctx, st, open);
      ctx.save(); ctx.clip();
      const cg = ctx.createRadialGradient(445, 300, 10, 445, 300, 220); cg.addColorStop(0, '#8a1022'); cg.addColorStop(1, '#3a020c');
      ctx.fillStyle = cg; ctx.fillRect(230, 150, 430, 300);
      // organs: liver + guts, breathing
      const br = Math.sin(t * 1.5) * 2;
      ctx.fillStyle = '#6b0f1e'; ctx.beginPath(); ctx.ellipse(560, 230 + br, 90, 50, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.ellipse(545, 215 + br, 50, 16, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const pts of st.intest) {
        const path = () => { ctx.beginPath(); pts.forEach((p, i) => { const y = p.y + br * (i % 2 ? 1 : -1); if (i === 0) ctx.moveTo(p.x, y); else { const q = pts[i - 1]; ctx.quadraticCurveTo(q.x + 20, (q.y + y) / 2 + (i % 2 ? 22 : -22), p.x, y); } }); };
        path(); ctx.strokeStyle = '#8e2440'; ctx.lineWidth = 30; ctx.stroke();
        path(); ctx.strokeStyle = '#f37a95'; ctx.lineWidth = 24; ctx.stroke();
        path(); ctx.strokeStyle = 'rgba(255,220,230,.45)'; ctx.lineWidth = 6; ctx.stroke();
      }
      ctx.restore();
      // inner shadow
      lensPath(ctx, st, open); ctx.strokeStyle = 'rgba(60,0,10,.6)'; ctx.lineWidth = 4; ctx.stroke();
      // channels + objects
      if (st.stage === 'extract' || st.stage === 'open') {
        st.objs.forEach((o) => {
          if (o.done && o.fly >= 1) return;
          const hot = t - o.touchT < 0.25;
          const path = () => { ctx.beginPath(); o.ch.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); };
          ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.save(); ctx.globalAlpha = Math.min(1, open * 1.4) * (o.done ? Math.max(0, 1 - o.fly * 2) : 1);
          path(); ctx.strokeStyle = hot ? '#ff1f3d' : '#cbd5e1'; if (hot) glow(ctx, '#ff1f3d', 20); ctx.lineWidth = HALF_W * 2 + 8; ctx.stroke(); ctx.shadowBlur = 0;
          path(); ctx.strokeStyle = '#5b6b7c'; ctx.lineWidth = HALF_W * 2 + 3; ctx.stroke();
          path(); ctx.strokeStyle = '#1d0206'; ctx.lineWidth = HALF_W * 2; ctx.stroke();
          ctx.setLineDash([4, 8]); path(); ctx.strokeStyle = 'rgba(127,220,255,.35)'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
          const e = o.ch[o.ch.length - 1];
          ctx.fillStyle = 'rgba(127,220,255,.8)'; ctx.font = `800 13px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(tr('SORTIE', 'EXIT'), e.x, e.y + (e.y < 300 ? -4 : 14));
          ctx.restore();
        });
        st.objs.forEach((o) => {
          if (o.done) return;
          const vib = o.kind === 'phone' ? Math.sin(t * 90) * 1.5 : 0;
          if (o.held) { ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(o.x + 6, o.y + 8, OBJ_R, OBJ_R * 0.7, 0, 0, Math.PI * 2); ctx.fill(); }
          drawObj(ctx, o.kind, o.x + vib, o.y - (o.held ? 3 : 0), o.held ? 1.12 : 1, t);
          if (!o.held && st.held < 0 && st.stage === 'extract') { ctx.strokeStyle = `rgba(255,209,102,${0.5 + 0.4 * Math.sin(t * 6)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(o.x, o.y, OBJ_R + 6 + Math.sin(t * 6) * 2, 0, Math.PI * 2); ctx.stroke(); }
        });
      }
    }
    // cut / dotted line
    if (st.stage === 'cut') {
      ctx.setLineDash([7, 7]); ctx.lineDashOffset = -t * 20; ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.save(); glow(ctx, '#a78bfa', 8);
      ctx.beginPath(); for (let i = st.prog; i < N; i++) (i === st.prog ? ctx.moveTo(P[i].x, P[i].y) : ctx.lineTo(P[i].x, P[i].y)); ctx.stroke();
      ctx.restore(); ctx.setLineDash([]);
      // tolerance corridor (faint)
      ctx.strokeStyle = 'rgba(167,139,250,.12)'; ctx.lineWidth = 34; ctx.lineJoin = 'round';
      ctx.beginPath(); for (let i = st.prog; i < N; i++) (i === st.prog ? ctx.moveTo(P[i].x, P[i].y) : ctx.lineTo(P[i].x, P[i].y)); ctx.stroke();
      if (st.prog > 0) {
        ctx.beginPath(); for (let i = 0; i <= st.prog; i++) (i ? ctx.lineTo(P[i].x, P[i].y) : ctx.moveTo(P[i].x, P[i].y));
        ctx.strokeStyle = '#7a0a1c'; ctx.lineWidth = 6; ctx.stroke(); ctx.strokeStyle = '#ff2a4a'; ctx.lineWidth = 2.5; ctx.stroke();
      }
      // start / resume point
      const q = P[st.prog];
      if (!st.cutting) {
        const pr = 13 + Math.sin(t * 7) * 3;
        ctx.save(); glow(ctx, '#7fdcff', 18); ctx.strokeStyle = st.flashCut > 0 ? '#ff4d6d' : '#7fdcff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(q.x, q.y, pr, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        ctx.fillStyle = '#7fdcff'; ctx.font = `800 13px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(st.prog ? tr('REPRENDS ICI', 'RESUME HERE') : tr('COMMENCE ICI', 'START HERE'), q.x, q.y - 22);
        st.flashCut = Math.max(0, st.flashCut - 0.03);
      }
      const e = P[N - 1]; ctx.fillStyle = 'rgba(167,139,250,.9)'; ctx.beginPath(); ctx.arc(e.x, e.y, 5, 0, Math.PI * 2); ctx.fill();
    } else if (open < 0.99) {
      // closed or closing wound line
      ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.strokeStyle = '#7a0a1c'; ctx.lineWidth = 5; ctx.stroke(); ctx.strokeStyle = '#d43552'; ctx.lineWidth = 2; ctx.stroke();
    }
    // stitches
    if (st.stage === 'stitch' || st.stage === 'flat' || st.stage === 'done') {
      ctx.lineCap = 'round';
      for (let i = 0; i < st.stitched; i++) {
        const a = stitchPt(st, i), b = i > 0 ? stitchPt(st, i - 1) : null, ok = st.sResults[i] ?? 0;
        const jx = ok ? 0 : 7;
        if (b) { ctx.strokeStyle = '#0b1f4d'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(a.x + jx, a.y - jx); ctx.stroke(); ctx.strokeStyle = '#4c7dff'; ctx.lineWidth = 2; ctx.stroke(); }
        ctx.fillStyle = ok === 2 ? '#7fdcff' : ok === 1 ? '#c7d2fe' : '#ff4d6d'; ctx.beginPath(); ctx.arc(a.x + jx, a.y - jx, 3.5, 0, Math.PI * 2); ctx.fill();
      }
      if (st.stage === 'stitch') {
        for (let i = st.stitched; i < STITCHES; i++) {
          const p = stitchPt(st, i), ti = st.stitchT0 + i * BEAT, dtb = ti - st.st;
          ctx.fillStyle = i === st.stitched ? '#fff' : 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
          if (dtb < 1.3 && dtb > -0.2) {
            const R = 9 + Math.max(0, dtb) * 42;
            const near = Math.abs(dtb) < 0.17;
            ctx.save(); glow(ctx, near ? '#a3e635' : '#7fdcff', 14); ctx.strokeStyle = near ? '#a3e635' : '#7fdcff'; ctx.lineWidth = i === st.stitched ? 3.5 : 1.5;
            ctx.globalAlpha = i === st.stitched ? 1 : 0.4; ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
          }
        }
        if (st.st < st.stitchT0) { ctx.font = `900 34px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#7fdcff'; const n = Math.ceil((st.stitchT0 - st.st) / BEAT); if (n <= 2) ctx.fillText(String(n), 445, 230); }
      }
    }
  }

  function drawPanel(ctx: CanvasRenderingContext2D, st: S, t: number, dt: number) {
    const X = 708, Wd = 280;
    // monitor
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 20;
    ctx.fillStyle = '#1b2733'; roundRect(ctx, X, 36, Wd, 214, 16); ctx.fill(); ctx.restore();
    const flatNow = (st.stage === 'flat' && st.outcome === 'alive') || st.outcome === 'dead';
    const danger = st.bpm > 140 || flatNow;
    ctx.fillStyle = danger && Math.floor(t * 4) % 2 ? '#2a0508' : '#020a06'; roundRect(ctx, X + 10, 46, Wd - 20, 194, 10); ctx.fill();
    ctx.strokeStyle = 'rgba(40,255,140,.07)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = X + 10; x < X + Wd - 10; x += 16) { ctx.moveTo(x, 46); ctx.lineTo(x, 240); }
    for (let y = 46; y < 240; y += 16) { ctx.moveTo(X + 10, y); ctx.lineTo(X + Wd - 10, y); }
    ctx.stroke();
    // ECG sweep
    const buf = st.ecgBuf, L = buf.length;
    const adv = Math.max(1, Math.round(dt * 110));
    for (let k = 0; k < adv; k++) {
      st.ecgW = (st.ecgW + 1) % L;
      const ph = st.phase - ((adv - 1 - k) * st.bpm) / 60 / 110;
      let val = flatNow ? (Math.random() - 0.5) * 0.02 : ecg(((ph % 1) + 1) % 1);
      if (st.spike > 0 && !flatNow) val += Math.sin(ph * 40) * st.spike * 0.5;
      buf[st.ecgW] = val;
    }
    const ex0 = X + 16, ew = 170, ey = 128, eh = 56;
    const ecol = flatNow ? '#ff2d4a' : st.bpm > 140 ? '#ffd166' : '#28ff8c';
    ctx.save(); glow(ctx, ecol, 10); ctx.strokeStyle = ecol; ctx.lineWidth = 2; ctx.beginPath();
    let pen = false;
    for (let i = 0; i < L; i++) {
      const gap = (i - st.ecgW + L) % L; if (gap > 0 && gap < 8) { pen = false; continue; }
      const x = ex0 + (i / (L - 1)) * ew, y = ey - buf[i] * eh;
      if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.restore();
    // SpO2 pleth (blue)
    ctx.strokeStyle = '#4cc9f0'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let i = 0; i < 60; i++) { const x = ex0 + i * (ew / 60), y = 212 - (flatNow ? 0 : Math.max(0, Math.sin((i / 60) * 6 * Math.PI - st.phase * Math.PI * 2)) * 14); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
    // numbers
    const bpmShow = flatNow ? 0 : Math.round(st.bpm);
    ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
    ctx.save(); glow(ctx, ecol, 14); ctx.fillStyle = ecol; ctx.font = `900 44px ${FONT}`; ctx.fillText(String(bpmShow), X + Wd - 18, 120); ctx.restore();
    ctx.fillStyle = ecol; ctx.font = `700 12px ${FONT}`; ctx.fillText('BPM', X + Wd - 18, 136);
    // beating heart icon
    const beat = flatNow ? 0 : Math.max(0, 1 - (st.phase % 1) * 4);
    heart(ctx, X + Wd - 60, 72, 9 + beat * 4, ecol);
    ctx.fillStyle = '#4cc9f0'; ctx.font = `900 24px ${FONT}`; ctx.fillText(`${flatNow ? '--' : Math.max(80, Math.round(99 - st.stress * 1.5))}`, X + Wd - 18, 212);
    ctx.font = `700 11px ${FONT}`; ctx.fillText('SpO₂ %', X + Wd - 18, 226);
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(40,255,140,.7)'; ctx.font = `700 11px ${FONT}`; ctx.fillText('II  ECG', X + 18, 62);
    if (danger) { ctx.save(); glow(ctx, '#ff1f3d', 12); ctx.fillStyle = '#ff4d6d'; ctx.font = `900 14px ${FONT}`; ctx.fillText(flatNow ? tr('⚠ ASYSTOLIE', '⚠ ASYSTOLE') : tr('⚠ TACHYCARDIE', '⚠ TACHYCARDIA'), X + 70, 62); ctx.restore(); }
    // steps
    ctx.fillStyle = 'rgba(4,20,43,.8)'; roundRect(ctx, X, 262, Wd, 128, 14); ctx.fill();
    ctx.strokeStyle = 'rgba(127,220,255,.35)'; ctx.lineWidth = 1.5; ctx.stroke();
    const steps: [string, boolean, boolean][] = [
      [tr('1. Incision', '1. Incision'), st.stage !== 'cut', st.stage === 'cut'],
      [`${tr('2. Corps étrangers', '2. Foreign objects')} ${st.extracted}/3`, st.extracted >= 3, st.stage === 'extract' || st.stage === 'open'],
      [`${tr('3. Suture', '3. Stitching')} ${st.stitched}/${STITCHES}`, st.stitched >= STITCHES, st.stage === 'stitch'],
    ];
    steps.forEach(([txt, done, cur], i) => {
      const y = 290 + i * 34;
      ctx.fillStyle = done ? '#a3e635' : cur ? '#7fdcff' : 'rgba(255,255,255,.45)';
      ctx.font = `800 16px ${FONT}`; ctx.fillText(txt, X + 40, y + 6);
      ctx.beginPath(); ctx.arc(X + 22, y, 9, 0, Math.PI * 2);
      if (done) { ctx.fill(); ctx.strokeStyle = '#04142b'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X + 17, y); ctx.lineTo(X + 21, y + 4); ctx.lineTo(X + 27, y - 4); ctx.stroke(); }
      else { ctx.lineWidth = 2; ctx.strokeStyle = ctx.fillStyle as string; ctx.stroke(); if (cur) { ctx.beginPath(); ctx.arc(X + 22, y, 4 + Math.sin(t * 8), 0, Math.PI * 2); ctx.fill(); } }
    });
    // tremor meter
    const trem = clamp01((st.stress * 0.9 + Math.max(0, st.bpm - 80) * 0.06) / 9);
    ctx.fillStyle = '#fff'; ctx.font = `800 12px ${FONT}`; ctx.fillText(tr('MAINS QUI TREMBLENT', 'SHAKY HANDS'), X + 4, 410);
    ctx.fillStyle = 'rgba(255,255,255,.12)'; roundRect(ctx, X, 418, Wd, 12, 6); ctx.fill();
    const tc = trem > 0.66 ? '#ff4d6d' : trem > 0.33 ? '#ffd166' : '#a3e635';
    ctx.save(); glow(ctx, tc, 10); ctx.fillStyle = tc; roundRect(ctx, X, 418, Math.max(12, Wd * trem), 12, 6); ctx.fill(); ctx.restore();
    const errs = st.cutErr + st.touches + st.sMiss;
    ctx.fillStyle = errs >= FLAT_ERR - 2 ? '#ff4d6d' : 'rgba(255,255,255,.65)'; ctx.font = `700 12px ${FONT}`;
    ctx.fillText(`${tr('Erreurs', 'Mistakes')} : ${errs} / ${FLAT_ERR} ${errs >= FLAT_ERR ? tr('💀 DANGER', '💀 DANGER') : ''}`, X + 4, 448);
    // tray (kidney dish)
    ctx.fillStyle = '#8fa3b6'; ctx.beginPath(); ctx.ellipse(X + Wd / 2, 512, Wd / 2, 46, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c8d5e2'; ctx.beginPath(); ctx.ellipse(X + Wd / 2, 510, Wd / 2 - 8, 38, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(X + Wd / 2 - 30, 496, 60, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(4,20,43,.5)'; ctx.font = `800 11px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(tr('BUTIN', 'LOOT'), X + Wd / 2, 548);
    st.objs.forEach((o) => {
      if (o.fly < 0) return;
      const tx = X + 60 + o.slot * 80, ty = 510, k = easeInOut(o.fly);
      const x = o.fx + (tx - o.fx) * k, y = o.fy + (ty - o.fy) * k - Math.sin(Math.PI * k) * 120;
      drawObj(ctx, o.kind, x, y, 1 + Math.sin(Math.PI * k) * 0.6, t);
    });
    ctx.textAlign = 'left';
  }

  return (
    <Arena g={g} title={tr('Bloc opératoire', 'Operating room')} icon="🩺" theme="ice"
      howTo={tr('Ton patient a avalé n\'importe quoi. 1) Trace l\'incision au scalpel sans sortir des pointillés. 2) Extrais les 3 objets à la pince sans toucher les bords (BZZZT). 3) Recouds en rythme. Chaque erreur fait grimper son cœur… trop d\'erreurs et c\'est le défibrillateur.', 'Your patient swallowed the weirdest stuff. 1) Trace the incision with the scalpel along the dotted line. 2) Pull the 3 objects out with tweezers without touching the edges (BZZZT). 3) Stitch in rhythm. Every mistake speeds up his heart… too many and it\'s paddle time.')}
      keys={[tr('Souris : maintenir pour couper / saisir', 'Mouse: hold to cut / grab'), tr('Clic / Espace : suture en rythme', 'Click / Space: stitch on the beat')]}>
      <canvas class="play" ref={canvas} style={{ cursor: 'none', touchAction: 'none', pointerEvents: 'auto' }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />
    </Arena>
  );
}

// ─────────────────────────── drawing helpers ───────────────────────────
const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, col: string) {
  ctx.save(); ctx.translate(x, y); glow(ctx, col, 12); ctx.fillStyle = col; ctx.beginPath();
  ctx.moveTo(0, r * 0.9); ctx.bezierCurveTo(-r * 1.6, -r * 0.2, -r * 0.7, -r * 1.4, 0, -r * 0.5); ctx.bezierCurveTo(r * 0.7, -r * 1.4, r * 1.6, -r * 0.2, 0, r * 0.9); ctx.fill(); ctx.restore();
}

function drawBubble(ctx: CanvasRenderingContext2D, x: number, y: number, txt: string, k: number) {
  ctx.save(); ctx.font = `800 16px ${FONT}`;
  const bw = Math.min(300, ctx.measureText(txt).width + 24), bh = 34, bx = x - 20, by = y - bh - 12;
  ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
  ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 10; ctx.fillStyle = '#fff'; roundRect(ctx, bx, by, bw, bh, 12); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 6, by + bh - 1); ctx.lineTo(x + 8, by + bh - 1); ctx.lineTo(x - 4, y); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#04142b'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, bx + 12, by + bh / 2 + 1, bw - 20);
  ctx.restore();
}

function drawTool(ctx: CanvasRenderingContext2D, x: number, y: number, tool: string, closed: boolean, shadow: boolean) {
  ctx.save(); ctx.translate(x, y);
  const metal = shadow ? 'rgba(0,0,0,.28)' : '#dfe7ef', dark = shadow ? 'rgba(0,0,0,.28)' : '#7b8a99';
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (tool === 'scalpel') {
    ctx.rotate(-0.75);
    ctx.fillStyle = metal; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(8, -4, 10, -20); ctx.lineTo(4, -22); ctx.lineTo(-1, -6); ctx.closePath(); ctx.fill();
    if (!shadow) { ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(1, -2); ctx.quadraticCurveTo(7, -6, 9, -19); ctx.stroke(); }
    ctx.fillStyle = dark; roundRect(ctx, 2, -80, 7, 60, 3); ctx.fill();
    if (!shadow) { ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(3, -78, 2, 56); }
  } else if (tool === 'tweezers') {
    ctx.rotate(-0.5);
    const spread = closed ? 1.5 : 7;
    ctx.strokeStyle = metal; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-spread, -2); ctx.lineTo(-6, -70); ctx.moveTo(spread, -2); ctx.lineTo(6, -70); ctx.stroke();
    ctx.strokeStyle = dark; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-6, -70); ctx.lineTo(0, -84); ctx.lineTo(6, -70); ctx.stroke();
  } else if (tool === 'needle') {
    ctx.rotate(-0.6);
    ctx.strokeStyle = metal; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(-8, 0, 9, -Math.PI * 0.1, Math.PI * 0.9); ctx.stroke();
    ctx.strokeStyle = dark; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(0, -70); ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-6, -78, 7, 0, Math.PI * 2); ctx.arc(8, -78, 7, 0, Math.PI * 2); ctx.stroke();
    if (!shadow) { ctx.strokeStyle = '#4c7dff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-16, 3); ctx.quadraticCurveTo(-30, 30, -10, 50); ctx.stroke(); }
  } else {
    // defib paddles
    for (const s of [-1, 1]) { ctx.fillStyle = shadow ? metal : '#ffd166'; roundRect(ctx, s * 26 - 14, -12, 28, 24, 6); ctx.fill(); ctx.fillStyle = shadow ? metal : '#1b2733'; roundRect(ctx, s * 26 - 6, -40, 12, 30, 4); ctx.fill(); }
    if (!shadow) { ctx.strokeStyle = '#7fdcff'; glow(ctx, '#7fdcff', 12); ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 6; i++) ctx.lineTo(-12 + i * 5, (i % 2 ? -6 : 6)); ctx.stroke(); }
  }
  ctx.restore();
}

function drawObj(ctx: CanvasRenderingContext2D, kind: Kind, x: number, y: number, sc: number, t: number) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const ol = (c = 'rgba(0,0,0,.45)') => { ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.stroke(); };
  switch (kind) {
    case 'lego': {
      ctx.fillStyle = '#1e5bd8'; ctx.fillRect(-7, 4, 6, 12); ctx.fillRect(1, 4, 6, 12);
      ctx.fillStyle = '#e3262e'; ctx.beginPath(); ctx.moveTo(-8, -4); ctx.lineTo(8, -4); ctx.lineTo(10, 6); ctx.lineTo(-10, 6); ctx.closePath(); ctx.fill(); ol();
      ctx.fillStyle = '#ffd400'; ctx.beginPath(); ctx.arc(0, -10, 6.5, 0, Math.PI * 2); ctx.fill(); ol(); ctx.fillRect(-2.5, -18, 5, 3);
      ctx.fillStyle = '#111'; ctx.fillRect(-3, -11.5, 1.5, 1.5); ctx.fillRect(1.5, -11.5, 1.5, 1.5); ctx.beginPath(); ctx.arc(0, -9, 2.5, 0.2, Math.PI - 0.2); ctx.stroke();
      ctx.fillStyle = '#ffd400'; ctx.beginPath(); ctx.arc(-12, 4, 2.5, 0, Math.PI * 2); ctx.arc(12, 4, 2.5, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'keys': {
      ctx.strokeStyle = '#c0c8d0'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(-6, -6, 6, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#b8c2cc'; ctx.save(); ctx.rotate(0.6); ctx.fillRect(-2, -2, 4, 18); ctx.fillRect(2, 8, 4, 2); ctx.fillRect(2, 12, 3, 2); ctx.restore();
      ctx.fillStyle = '#d4a017'; ctx.save(); ctx.rotate(-0.4); ctx.fillRect(-1.5, 0, 3, 16); ctx.restore();
      ctx.fillStyle = '#ffd400'; ctx.beginPath(); ctx.moveTo(-14, -14); ctx.lineTo(-9, -6); ctx.lineTo(-14, 2); ctx.lineTo(-19, -6); ctx.closePath(); ctx.fill(); ol();
      ctx.fillStyle = '#111'; ctx.font = `900 5px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('CLIO', 6, -10);
      break;
    }
    case 'duck': {
      ctx.fillStyle = '#ffd400'; ctx.beginPath(); ctx.ellipse(2, 4, 13, 9, 0, 0, Math.PI * 2); ctx.fill(); ol();
      ctx.beginPath(); ctx.arc(-6, -6, 7, 0, Math.PI * 2); ctx.fill(); ol();
      ctx.fillStyle = '#ff8a00'; ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(-19, -4); ctx.lineTo(-12, -2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(-7, -8, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f0b800'; ctx.beginPath(); ctx.ellipse(5, 3, 6, 4, 0.4, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'airpod': {
      ctx.fillStyle = '#f5f7fa'; ctx.beginPath(); ctx.ellipse(-2, -8, 8, 7, 0, 0, Math.PI * 2); ctx.fill(); ol('rgba(0,0,0,.3)');
      roundRect(ctx, 0, -4, 5, 20, 2.5); ctx.fill(); ol('rgba(0,0,0,.3)');
      ctx.fillStyle = '#333'; ctx.beginPath(); ctx.ellipse(-5, -9, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#9aa'; ctx.fillRect(1, 13, 3, 2);
      break;
    }
    case 'remote': {
      ctx.rotate(0.3);
      ctx.fillStyle = '#1b1b22'; roundRect(ctx, -6, -16, 12, 32, 4); ctx.fill(); ol('rgba(255,255,255,.2)');
      ctx.fillStyle = '#e3262e'; ctx.beginPath(); ctx.arc(0, -11, 2.2, 0, Math.PI * 2); ctx.fill();
      const cols = ['#4cc9f0', '#a3e635', '#ffd166', '#ff5bd1'];
      for (let i = 0; i < 6; i++) { ctx.fillStyle = i < 4 ? cols[i] : '#666'; ctx.fillRect(-4 + (i % 2) * 5, -5 + Math.floor(i / 2) * 6, 3, 3); }
      break;
    }
    case 'fry': {
      ctx.rotate(-0.5);
      ctx.fillStyle = '#f6c343'; roundRect(ctx, -3, -17, 6, 34, 2); ctx.fill(); ol('rgba(120,70,0,.6)');
      ctx.fillStyle = '#b8860b'; ctx.fillRect(-3, 10, 6, 3); ctx.fillStyle = 'rgba(80,120,40,.6)'; ctx.beginPath(); ctx.arc(1, -6, 2, 0, Math.PI * 2); ctx.fill();
      ctx.rotate(0.5); ctx.fillStyle = '#fff'; ctx.font = `800 6px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('2009', 10, -10);
      break;
    }
    case 'phone': {
      ctx.fillStyle = '#16161c'; roundRect(ctx, -9, -16, 18, 32, 4); ctx.fill();
      const lit = Math.floor(t * 3) % 2 === 0;
      ctx.fillStyle = lit ? '#4cc9f0' : '#1e3a5f'; roundRect(ctx, -7, -13, 14, 24, 2); ctx.fill();
      if (lit) { ctx.fillStyle = '#fff'; ctx.font = `800 6px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(tr('MAMAN', 'MUM'), 0, -3); ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(0, 5, 3, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = 'rgba(127,220,255,.7)'; ctx.lineWidth = 1.2;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(0, 0, 18 + (t * 20) % 6, s > 0 ? -0.5 : Math.PI - 0.5, s > 0 ? 0.5 : Math.PI + 0.5); ctx.stroke(); }
      break;
    }
  }
  ctx.restore();
}
