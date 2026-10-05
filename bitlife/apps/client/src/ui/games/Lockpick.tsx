// Safe cracking ('heist': steel combination dial) & lockpicking ('lockpick': brass pin-tumbler cutaway).
// Turn slowly, listen to the stethoscope clicks getting sharper, set each number before the dog wakes up.
import { useRef } from 'preact/hooks';
import { useGame, useCanvas, useKeys, Arena, tr, glow, roundRect, clamp01, type GameProps } from './kit.tsx';
import { synth } from '../../audio.ts';

const DUR = 30, SWEET = 2, NEAR = 12, N = 4, FORCE = 40;
const TAU = Math.PI * 2;

/** Signed circular distance on a 0..100 dial. */
const cdist = (a: number, b: number) => { let d = (((a - b) % 100) + 100) % 100; if (d > 50) d -= 100; return d; };
const mod100 = (x: number) => ((x % 100) + 100) % 100;

function makeTargets(n: number): number[] {
  const out: number[] = [];
  let prev = 0, guard = 0;
  while (out.length < n && guard++ < 500) { const v = 4 + Math.floor(Math.random() * 92); if (Math.abs(cdist(v, prev)) >= 22) { out.push(v); prev = v; } }
  while (out.length < n) out.push((out.length * 31 + 17) % 100);
  return out;
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
function mix(c1: number[], c2: number[], k: number) { return `rgb(${Math.round(lerp(c1[0], c2[0], k))},${Math.round(lerp(c1[1], c2[1], k))},${Math.round(lerp(c1[2], c2[2], k))})`; }
/** Cold blue → gold → hot orange, green inside the sweet spot. */
function heat(p: number, sweet: boolean) {
  if (sweet) return '#2dffb0';
  return p < 0.5 ? mix([76, 201, 240], [255, 209, 102], p * 2) : mix([255, 209, 102], [255, 110, 50], (p - 0.5) * 2);
}

const WRONG: [string, string][] = [
  ['Le chien ouvre un œil… 🐕', 'The dog opens one eye… 🐕'],
  ['« Chéri, t\'as entendu ? »', '"Honey, did you hear that?"'],
  ['CLONK ! Pas le bon clic', 'CLONK! Wrong click'],
  ['Le chien rêve de tes mollets 🦴', 'The dog dreams of your calves 🦴'],
  ['Lumière allumée à l\'étage 💡', 'Light on upstairs 💡'],
  ['Le chat te juge 🐈', 'The cat is judging you 🐈'],
  ['Le perroquet répète « VOLEUR »', 'The parrot says "THIEF"'],
];
const GOOD: [string, string][] = [
  ['Comme un pro 😎', 'Smooth 😎'], ['Le chien ronfle toujours 💤', 'Dog still snoring 💤'], ['Doigts de fée ✨', 'Butter fingers? Nope ✨'], ['Arsène Lupin approuve 🎩', 'Lupin would be proud 🎩'],
];
const FORCED: [string, string][] = [['DOUCEMENT !', 'EASY!'], ['Tu forces, là…', 'You\'re forcing it…'], ['Ça grince ! 😬', 'It\'s squeaking! 😬']];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export function Lockpick({ onDone, variant = 'heist' }: GameProps) {
  const g = useGame({ duration: DUR, onDone });
  const pins = variant === 'lockpick';
  const s = useRef({
    pos: 0, prevPos: 0, speed: 0, targets: makeTargets(N), idx: 0, mistakes: 0, alarm: 0, alarmMax: 0,
    hold: 0, keys: new Set<string>(), lastSnd: -1, env: 0.05, wave: new Array<number>(160).fill(0),
    jitter: 0, crackFx: 0, crackAt: [] as number[], opened: 0, busted: false, ended: false, endAt: 0, t: 0, warnT: -5,
    beatT: 0, beepT: 0, dialX: 0, dialY: 0, dialR: 1, drag: null as null | { mode: 'rot' | 'lin'; a: number; x: number; moved: number; t0: number; px: number; py: number },
    pickX: 0, dust: Array.from({ length: 36 }, () => ({ x: Math.random(), y: Math.random(), v: 0.01 + Math.random() * 0.03, r: 0.5 + Math.random() * 1.6 })),
    started: false, lastLvl: 0,
  });
  const st0 = s.current;
  const pct = (x: number, y: number): [number, number] => {
    const c = cv.current; const a = c?.closest('.arena');
    if (!c || !a) return [50, 50];
    const r = c.getBoundingClientRect(), ar = a.getBoundingClientRect();
    return [((r.left + x - ar.left) / ar.width) * 100, ((r.top + y - ar.top) / ar.height) * 100];
  };
  const active = () => g.phase === 'play' && !st0.opened && !st0.busted && !st0.ended;

  const finish = (sc: number, result: string) => {
    const st = s.current;
    if (st.ended) return;
    st.ended = true;
    const elapsed = DUR - g.time;
    g.end(sc, [
      [tr('Résultat', 'Result'), result],
      [pins ? tr('Goupilles', 'Pins') : tr('Combinaison', 'Combination'), `${st.idx} / ${N}`],
      [tr('Temps', 'Time'), `${elapsed.toFixed(1)} s`],
      [tr('Erreurs', 'Mistakes'), String(st.mistakes)],
      [tr('Alarme max', 'Peak alarm'), `${Math.round(st.alarmMax)}%`],
    ]);
  };

  const setPin = () => {
    const st = s.current;
    if (!active()) return;
    const val = mod100(st.pos), tgt = st.targets[st.idx];
    const d = Math.abs(cdist(val, tgt));
    const [fx, fy] = pct(st.dialX, st.dialY - st.dialR * 1.35);
    if (d <= SWEET) {
      const perfect = d < 0.9;
      st.crackAt[st.idx] = st.t;
      st.idx++;
      st.crackFx = 1;
      g.hit(perfect ? 'perfect' : 'good');
      g.add(1000 + Math.round(g.time * 40) + (perfect ? 500 : 0), perfect ? tr('PARFAIT ! CLIC', 'PERFECT! CLICK') : tr('CLIC !', 'CLICK!'), fx, fy, '#2dffb0');
      g.burst(fx, fy + 6, '#ffd166', 30);
      g.burst(fx, fy + 6, '#2dffb0', 14);
      g.flash('#2dffb0');
      synth.tone(140, 0.16, 'square', 0.14, 0, 0.5); synth.noise(0.09, 0.3, 900); synth.tone(1760, 0.08, 'triangle', 0.06, 0.06);
      if (Math.random() < 0.6) g.float(tr(...pick(GOOD)), fx, fy + 14, '#ffd166');
      if (st.idx >= N) {
        st.opened = 0.0001; st.endAt = st.t + 1.9;
        g.float(pins ? tr('🔓 CRAC ! OUVERT', '🔓 CRACK! OPEN') : tr('💰 COFFRE OUVERT !', '💰 SAFE CRACKED!'), 50, 34, '#ffd166', true);
        g.shake(); g.burst(50, 50, '#ffd166', 50); g.burst(45, 55, '#2dffb0', 30);
        [523, 659, 784, 1046, 1318].forEach((f, i) => synth.tone(f, 0.22, 'triangle', 0.08, 0.1 + i * 0.07));
        synth.noise(0.4, 0.15, 400, 0.05);
      }
    } else {
      st.mistakes++;
      st.alarm = Math.min(100, st.alarm + 17 + st.mistakes * 2);
      st.jitter = 0.4;
      g.miss(tr(...pick(WRONG)), fx, fy);
      g.shake(); g.flash('#ff1f3d');
      g.burst(fx, fy + 8, '#ff4d6d', 14);
      synth.tone(75, 0.22, 'square', 0.14, 0, 0.5); synth.noise(0.12, 0.25, 300);
    }
  };

  useKeys((e) => {
    const st = s.current;
    if (g.phase !== 'play') return;
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowUp') { if (!e.repeat) setPin(); return; }
    const L = e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ', R = e.code === 'ArrowRight' || e.code === 'KeyD';
    if ((L || R) && !e.repeat && active()) { st.pos = Math.round(st.pos) + (L ? 1 : -1); st.hold = 0; }
    st.keys.add(e.code);
  }, (e) => s.current.keys.delete(e.code));

  const cv = useCanvas((ctx, w, h, dt, t) => {
    const st = s.current;
    const playing = g.phase === 'play';
    const k = st.keys;
    // ─── simulation ───
    if (playing) {
      st.t += dt;
      if (!st.started) { st.started = true; g.float(pins ? tr('Chut… 🤫', 'Shh… 🤫') : tr('Chut… le chien dort 💤', 'Shh… the dog is asleep 💤'), 50, 30, '#7fdcff', true); }
      if (active()) {
        const dir = (k.has('ArrowLeft') || k.has('KeyA') || k.has('KeyQ') ? 1 : 0) - (k.has('ArrowRight') || k.has('KeyD') ? 1 : 0);
        if (dir) { st.hold += dt; if (st.hold > 0.16) st.pos += dir * (7 + Math.pow(Math.min(1, (st.hold - 0.16) / 1.6), 2) * 63) * dt; } else st.hold = 0;
      }
      const inst = Math.abs(st.pos - st.prevPos) / Math.max(dt, 1e-3);
      st.speed = st.speed * 0.82 + inst * 0.18;
      const tgt = st.targets[Math.min(st.idx, N - 1)];
      const val = mod100(st.pos);
      const d = Math.abs(cdist(val, tgt));
      const p = st.idx < N ? clamp01(1 - d / NEAR) : 0;
      const sweet = st.idx < N && d <= SWEET;
      // tumbler clicks
      if (Math.floor(st.pos) !== Math.floor(st.prevPos) && active()) {
        st.env = Math.max(st.env, 0.12 + p * p * 0.88);
        if (st.t - st.lastSnd > 0.028) {
          st.lastSnd = st.t;
          synth.tone(380 + p * p * 2800, 0.018 + p * 0.025, p > 0.45 ? 'square' : 'triangle', 0.02 + p * 0.07);
          if (sweet) { synth.tone(190, 0.08, 'square', 0.11, 0, 0.6); synth.noise(0.05, 0.16, 2600); st.env = 1.15; }
        }
      }
      st.prevPos = st.pos;
      // forcing → alarm
      if (active()) {
        if (st.speed > FORCE) {
          st.alarm += (st.speed - FORCE) * dt * 0.5;
          if (st.t - st.warnT > 1.3) { st.warnT = st.t; const [fx, fy] = pct(st.dialX, st.dialY - st.dialR * 1.5); g.float(tr(...pick(FORCED)), fx, fy, '#ff9f1c'); synth.tone(1900, 0.1, 'sawtooth', 0.03, 0, 1.1); }
        } else st.alarm -= dt * 3.2;
        st.alarm = Math.max(0, Math.min(100, st.alarm));
        st.alarmMax = Math.max(st.alarmMax, st.alarm);
        // tension: heartbeat + warning beeps
        const lvl = st.alarm > 75 ? 3 : st.alarm > 50 ? 2 : st.alarm > 30 ? 1 : 0;
        if (lvl > st.lastLvl) {
          const msg: [string, string] = lvl === 1 ? ['Le chien remue une oreille 👂', 'The dog twitches an ear 👂'] : lvl === 2 ? ['Grrrr… 🐕', 'Grrrr… 🐕'] : ['Il va aboyer !!! 😱', 'He\'s about to bark!!! 😱'];
          g.float(tr(...msg), 80, 74, lvl === 3 ? '#ff4d6d' : '#ffd166');
        }
        st.lastLvl = lvl;
        if (st.alarm > 45 && st.t - st.beatT > 0.95 - st.alarm / 200) { st.beatT = st.t; synth.tone(62, 0.12, 'sine', 0.22, 0, 0.7); synth.tone(55, 0.12, 'sine', 0.18, 0.14, 0.7); }
        if (st.alarm > 75 && st.t - st.beepT > 0.45) { st.beepT = st.t; synth.tone(1250, 0.07, 'square', 0.035); }
        if (st.alarm >= 100) {
          st.busted = true; st.endAt = st.t + 1.6;
          for (let i = 0; i < 4; i++) { synth.tone(740, 0.32, 'sawtooth', 0.05, i * 0.64, 1.25); synth.tone(925, 0.32, 'sawtooth', 0.05, i * 0.64 + 0.32, 0.8); }
          synth.tone(320, 0.09, 'sawtooth', 0.12, 0, 0.6); synth.tone(300, 0.12, 'sawtooth', 0.12, 0.16, 0.6);
          g.float(tr('WOUF WOUF ! 🚨', 'WOOF WOOF! 🚨'), 50, 36, '#ff1f3d', true);
          g.flash('#ff1f3d'); g.shake(); g.miss();
        }
        if (g.time <= 0) finish(0.06 + 0.32 * (st.idx / N) - Math.min(0.1, st.mistakes * 0.02), tr('⏰ TROP LENT', '⏰ TOO SLOW'));
      }
      if (st.busted && Math.floor(st.t * 6) !== Math.floor((st.t - dt) * 6)) g.flash(Math.floor(st.t * 6) % 2 ? '#ff1f3d' : '#2563eb');
      if (st.opened) st.opened = Math.min(1, st.opened + dt / 1.2);
      if (st.endAt && st.t >= st.endAt) {
        if (st.busted) finish(Math.min(0.3, 0.05 + 0.06 * st.idx), tr('🚨 GRILLÉ', '🚨 BUSTED'));
        else {
          const tl = clamp01(g.time / DUR);
          finish(Math.max(0.45, 0.6 + 0.3 * tl + 0.1 * (1 - st.alarmMax / 100) - 0.07 * st.mistakes), pins ? tr('🔓 OUVERTE', '🔓 PICKED') : tr('💰 PILLÉ', '💰 LOOTED'));
        }
      }
      st.env = Math.max(0.035, st.env * Math.exp(-dt * 9));
      st.jitter = Math.max(0, st.jitter - dt);
      st.crackFx = Math.max(0, st.crackFx - dt * 1.5);
    }
    // oscilloscope samples
    for (let i = 0; i < 2; i++) { st.wave.shift(); st.wave.push(st.env * (Math.sin(t * 140 + i * 2.3) * 0.6 + (Math.random() * 2 - 1) * 0.6)); }

    const val = mod100(st.pos);
    const tgt = st.targets[Math.min(st.idx, N - 1)];
    const d = Math.abs(cdist(val, tgt));
    const p = st.idx < N ? clamp01(1 - d / NEAR) : 0;
    const sweet = st.idx < N && d <= SWEET;
    const hc = heat(p, sweet);

    // ─── render: room ───
    ctx.clearRect(0, 0, w, h);
    const wall = ctx.createLinearGradient(0, 0, 0, h);
    wall.addColorStop(0, pins ? '#170d05' : '#060d1c'); wall.addColorStop(0.78, pins ? '#26170a' : '#0d1a33'); wall.addColorStop(0.78, '#05070d'); wall.addColorStop(1, '#020306');
    ctx.fillStyle = wall; ctx.fillRect(0, 0, w, h);
    // wallpaper
    ctx.globalAlpha = 0.05; ctx.fillStyle = '#fff';
    for (let x = 0; x < w; x += 28) for (let y = 14; y < h * 0.78; y += 36) { ctx.beginPath(); ctx.arc(x + ((y / 36) % 2) * 14, y, 2.2, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
    const wide = w / h > 1.3;
    // layout
    const S = wide ? Math.min(h * 0.84, w * 0.56) : Math.min(w * 0.88, h * 0.6);
    const cx = wide ? w * 0.37 : w / 2, cy = wide ? h * 0.52 : h * 0.37;
    // flashlight cone
    const lx = cx + Math.sin(t * 0.7) * S * 0.08, ly = cy + Math.cos(t * 0.53) * S * 0.06;
    const fl = ctx.createRadialGradient(lx, ly, 0, lx, ly, S * 0.85);
    fl.addColorStop(0, 'rgba(255,240,200,.22)'); fl.addColorStop(0.5, 'rgba(255,230,180,.07)'); fl.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fl; ctx.fillRect(0, 0, w, h);
    // dust in the beam
    for (const q of st.dust) {
      q.y -= q.v * dt; q.x += Math.sin(t + q.r * 9) * 0.0006; if (q.y < 0) { q.y = 1; q.x = Math.random(); }
      const px = lx + (q.x - 0.5) * S * 1.4, py = ly + (q.y - 0.5) * S * 1.2;
      const a = Math.max(0, 1 - Math.hypot(px - lx, py - ly) / (S * 0.7));
      ctx.fillStyle = `rgba(255,240,210,${a * 0.5})`; ctx.beginPath(); ctx.arc(px, py, q.r, 0, TAU); ctx.fill();
    }

    if (pins) drawPins(ctx, cx, cy, S, st, val, p, sweet, hc, t);
    else drawSafe(ctx, cx, cy, S, st, val, p, sweet, hc, t);

    // ─── side panel ───
    let px: number, py: number, pw: number, ph: number;
    if (wide) { px = w * 0.69; py = h * 0.06; pw = w * 0.285; ph = h * 0.88; }
    else { px = w * 0.04; py = cy + S * 0.55; pw = w * 0.92; ph = h - py - 8; }
    ctx.save();
    roundRect(ctx, px, py, pw, ph, 16);
    const pg = ctx.createLinearGradient(px, py, px, py + ph); pg.addColorStop(0, 'rgba(14,24,44,.85)'); pg.addColorStop(1, 'rgba(6,10,20,.9)');
    ctx.fillStyle = pg; ctx.fill();
    ctx.strokeStyle = 'rgba(127,220,255,.25)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
    const pad = 14;
    const rows = wide ? [0.05, 0.36, 0.52, 0.72] : [0.04, 0.04, 0.55, 0.55];
    const colW = wide ? pw - pad * 2 : (pw - pad * 3) / 2;
    const col2 = wide ? px + pad : px + pad * 2 + colW;
    // stethoscope scope
    const sh = wide ? ph * 0.26 : ph * 0.45;
    drawScope(ctx, px + pad, py + ph * rows[0], colW, sh, st.wave, hc, p, sweet, t);
    // code slots
    drawCode(ctx, wide ? px + pad : col2, py + ph * rows[1] + (wide ? 0 : 0), colW, wide ? ph * 0.12 : ph * 0.42, st, pins, hc, t);
    // alarm meter
    drawAlarm(ctx, px + pad, py + ph * rows[2], colW, wide ? ph * 0.12 : ph * 0.4, st.alarm, t);
    // dog
    const dsz = wide ? Math.min(pw * 0.32, ph * 0.13) : Math.min(ph * 0.4, 60);
    drawDog(ctx, wide ? px + pw / 2 : col2 + colW / 2, wide ? py + ph * 0.86 : py + ph * 0.78, dsz, st.alarm, st.busted, t);

    // alarm vignette
    if (st.alarm > 35 || st.busted) {
      const a = st.busted ? 0.55 : ((st.alarm - 35) / 65) * (0.35 + 0.25 * Math.sin(t * (4 + st.alarm / 12)));
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
      const col = st.busted && Math.floor(t * 6) % 2 ? '37,99,235' : '255,20,50';
      vg.addColorStop(0, `rgba(${col},0)`); vg.addColorStop(1, `rgba(${col},${Math.max(0, a)})`);
      ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    }
    // vignette
    const vn = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.72);
    vn.addColorStop(0, 'rgba(0,0,0,0)'); vn.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = vn; ctx.fillRect(0, 0, w, h);
  }, true);

  // ─── pointer: circular drag around the dial, horizontal drag elsewhere, wheel, tap on knob = set ───
  const local = (e: PointerEvent | WheelEvent) => { const r = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const onDown = (e: PointerEvent) => {
    const st = s.current; if (!active()) return;
    const [x, y] = local(e);
    const dd = Math.hypot(x - st.dialX, y - st.dialY);
    st.drag = { mode: dd < st.dialR * 1.5 ? 'rot' : 'lin', a: Math.atan2(y - st.dialY, x - st.dialX), x, moved: 0, t0: performance.now(), px: x, py: y };
    try { (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId); } catch { /* ignore */ }
  };
  const onMove = (e: PointerEvent) => {
    const st = s.current; const dr = st.drag; if (!dr || !active()) return;
    const [x, y] = local(e);
    if (dr.mode === 'rot') {
      const a = Math.atan2(y - st.dialY, x - st.dialX);
      let da = a - dr.a; if (da > Math.PI) da -= TAU; if (da < -Math.PI) da += TAU;
      dr.a = a; st.pos -= (da / TAU) * 100; dr.moved += Math.abs(da / TAU) * 100;
    } else { const dx = x - dr.x; dr.x = x; st.pos -= dx * 0.12; dr.moved += Math.abs(dx * 0.12); }
  };
  const onUp = (e: PointerEvent) => {
    const st = s.current; const dr = st.drag; st.drag = null;
    if (!dr) return;
    const [x, y] = local(e);
    if (dr.moved < 0.6 && performance.now() - dr.t0 < 350 && Math.hypot(x - st.dialX, y - st.dialY) < st.dialR * 0.5) setPin();
  };
  const onWheel = (e: WheelEvent) => { e.preventDefault(); const st = s.current; if (!active()) return; st.pos = Math.round(st.pos) + (e.deltaY > 0 ? -1 : 1); };

  return (
    <Arena g={g} title={pins ? tr('Crochetage', 'Lockpicking') : tr('Le casse', 'The heist')} icon={pins ? '🔐' : '💰'} theme={pins ? 'casino' : 'ice'}
      howTo={pins
        ? tr(`Tourne la clé de tension tout doucement et écoute le stéthoscope : plus les clics sont aigus, plus tu es proche. Bloque les ${N} goupilles avec Espace en ${DUR} s. Trop vite ou mauvais clic = le chien se réveille !`, `Turn the tension wrench gently and listen to the stethoscope: the sharper the clicks, the closer you are. Set all ${N} pins with Space within ${DUR}s. Too fast or a wrong click = the dog wakes up!`)
        : tr(`Tourne la molette du coffre et écoute : plus les clics sont aigus, plus tu es proche du bon chiffre. Valide les ${N} chiffres avec Espace en ${DUR} s. Forcer ou se tromper fait monter l'alarme… et réveille le chien.`, `Spin the safe dial and listen: the sharper the clicks, the closer the number. Lock in all ${N} numbers with Space within ${DUR}s. Forcing it or guessing wrong raises the alarm… and wakes the dog.`)}
      keys={['← → / A D', tr('Souris : glisser / molette', 'Mouse: drag / scroll'), tr('Espace = valider', 'Space = set')]}>
      <canvas class="play" ref={cv} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onWheel={onWheel} style={{ touchAction: 'none', cursor: 'grab' }} />
    </Arena>
  );
}

type St = { pos: number; idx: number; targets: number[]; jitter: number; crackFx: number; crackAt: number[]; opened: number; busted: boolean; dialX: number; dialY: number; dialR: number; pickX: number; t: number };

// ─── metal helpers ───
function metal(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, stops: string[]): CanvasGradient | string {
  if (typeof ctx.createConicGradient === 'function') {
    const gr = ctx.createConicGradient(-Math.PI / 4, x, y);
    stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c));
    return gr;
  }
  const gr = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
  stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c));
  return gr;
}
const STEEL = ['#8d99ab', '#eef3f9', '#6b7687', '#c9d2de', '#525c6c', '#f1f5fa', '#7d8898', '#8d99ab'];
const BRASS = ['#9a6a1c', '#ffe9a8', '#8a5a12', '#e8c56a', '#6e4710', '#fff0b8', '#a87422', '#9a6a1c'];

function rivet(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const gr = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
  gr.addColorStop(0, '#f5f8fc'); gr.addColorStop(0.45, '#8892a2'); gr.addColorStop(1, '#2a313c');
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}

/** Combination dial: 0..99 ticks rotating so that `val` sits under the top index. */
function drawDial(ctx: CanvasRenderingContext2D, x: number, y: number, R: number, val: number, p: number, sweet: boolean, hc: string, jitter: number, t: number, brass = false) {
  const pal = brass ? BRASS : STEEL;
  const rot = jitter > 0 ? Math.sin(t * 90) * jitter * 0.04 : 0;
  // proximity halo
  if (p > 0) {
    const hg = ctx.createRadialGradient(x, y, R * 0.9, x, y, R * (1.55 + p * 0.25));
    hg.addColorStop(0, hc); hg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save(); ctx.globalAlpha = p * (sweet ? 0.75 + 0.2 * Math.sin(t * 18) : 0.45); ctx.fillStyle = hg;
    ctx.beginPath(); ctx.arc(x, y, R * 1.9, 0, TAU); ctx.fill(); ctx.restore();
  }
  // bezel
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = R * 0.25; ctx.shadowOffsetY = R * 0.08;
  ctx.fillStyle = metal(ctx, x, y, R * 1.16, pal); ctx.beginPath(); ctx.arc(x, y, R * 1.16, 0, TAU); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, R * 1.15, Math.PI * 1.05, Math.PI * 1.75); ctx.stroke();
  ctx.fillStyle = '#0b0f17'; ctx.beginPath(); ctx.arc(x, y, R * 1.02, 0, TAU); ctx.fill();
  // face
  const face = ctx.createRadialGradient(x - R * 0.3, y - R * 0.4, R * 0.1, x, y, R);
  face.addColorStop(0, brass ? '#4a3416' : '#2e3a4e'); face.addColorStop(1, brass ? '#140c03' : '#0a0e16');
  ctx.fillStyle = face; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
  // ticks + numbers
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  for (let i = 0; i < 100; i++) {
    const a = ((i - val) / 100) * TAU - Math.PI / 2;
    const long = i % 5 === 0, ten = i % 10 === 0;
    const r1 = R * 0.97, r2 = R * (ten ? 0.8 : long ? 0.85 : 0.9);
    ctx.strokeStyle = ten ? (brass ? '#ffe9a8' : '#e9f2ff') : 'rgba(220,230,245,.55)';
    ctx.lineWidth = ten ? 2.2 : long ? 1.6 : 1;
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); ctx.stroke();
    if (ten && R > 40) {
      ctx.save(); ctx.translate(Math.cos(a) * R * 0.66, Math.sin(a) * R * 0.66); ctx.rotate(a + Math.PI / 2);
      ctx.fillStyle = brass ? '#ffe9a8' : '#f1f6ff'; ctx.font = `800 ${Math.round(R * 0.13)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(i), 0, 0); ctx.restore();
    }
  }
  // knob with grip notches
  const kr = R * 0.42;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = R * 0.12; ctx.shadowOffsetY = R * 0.04;
  ctx.fillStyle = metal(ctx, 0, 0, kr, pal); ctx.beginPath();
  for (let i = 0; i <= 48; i++) { const a = (i / 48) * TAU - (val / 100) * TAU; const rr = i % 2 ? kr : kr * 0.94; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  ctx.closePath(); ctx.fill(); ctx.restore();
  const cap = ctx.createRadialGradient(-kr * 0.3, -kr * 0.3, kr * 0.05, 0, 0, kr * 0.75);
  cap.addColorStop(0, brass ? '#fff2c4' : '#ffffff'); cap.addColorStop(0.5, brass ? '#c9963a' : '#9aa6b8'); cap.addColorStop(1, brass ? '#5a3a0c' : '#3a4352');
  ctx.fillStyle = cap; ctx.beginPath(); ctx.arc(0, 0, kr * 0.72, 0, TAU); ctx.fill();
  ctx.fillStyle = sweet ? '#2dffb0' : hc; glow(ctx, hc, 12 + p * 20); ctx.globalAlpha = 0.4 + p * 0.6;
  ctx.beginPath(); ctx.arc(0, 0, kr * 0.16, 0, TAU); ctx.fill();
  ctx.restore();
  // glass specular
  ctx.save(); ctx.globalAlpha = 0.1; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(x - R * 0.3, y - R * 0.45, R * 0.55, R * 0.25, -0.5, 0, TAU); ctx.fill(); ctx.restore();
  // index pointer
  const py = y - R * 1.2;
  ctx.save(); glow(ctx, hc, 10 + p * 24); ctx.fillStyle = p > 0 ? hc : (brass ? '#ffe9a8' : '#e9f2ff');
  ctx.beginPath(); ctx.moveTo(x, py + R * 0.14); ctx.lineTo(x - R * 0.08, py - R * 0.04); ctx.lineTo(x + R * 0.08, py - R * 0.04); ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawSafe(ctx: CanvasRenderingContext2D, cx: number, cy: number, S: number, st: St, val: number, p: number, sweet: boolean, hc: string, t: number) {
  const x0 = cx - S / 2, y0 = cy - S / 2;
  // body
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 26;
  roundRect(ctx, x0, y0, S, S, S * 0.05);
  const body = ctx.createLinearGradient(x0, y0, x0 + S, y0 + S);
  body.addColorStop(0, '#556274'); body.addColorStop(0.45, '#232b38'); body.addColorStop(1, '#3b4657');
  ctx.fillStyle = body; ctx.fill(); ctx.restore();
  roundRect(ctx, x0 + 2, y0 + 2, S - 4, S - 4, S * 0.05);
  const rim = ctx.createLinearGradient(x0, y0, x0 + S, y0 + S); rim.addColorStop(0, 'rgba(255,255,255,.5)'); rim.addColorStop(0.5, 'rgba(255,255,255,.04)'); rim.addColorStop(1, 'rgba(127,220,255,.25)');
  ctx.strokeStyle = rim; ctx.lineWidth = 3; ctx.stroke();
  // feet
  ctx.fillStyle = '#10141c'; ctx.fillRect(x0 + S * 0.08, y0 + S, S * 0.12, S * 0.03); ctx.fillRect(x0 + S * 0.8, y0 + S, S * 0.12, S * 0.03);
  // door frame & interior
  const ix = x0 + S * 0.07, iy = y0 + S * 0.07, iw = S * 0.86, ih = S * 0.86;
  roundRect(ctx, ix, iy, iw, ih, S * 0.03); ctx.fillStyle = '#05070b'; ctx.fill();
  const o = st.opened ? 1 - Math.pow(1 - st.opened, 3) : 0;
  if (o > 0) {
    // treasure inside
    const gl = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.5); gl.addColorStop(0, `rgba(255,209,102,${0.55 * o})`); gl.addColorStop(1, 'rgba(255,170,0,0)');
    ctx.fillStyle = gl; ctx.fillRect(ix, iy, iw, ih);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4 - r; c++) {
      const bw = iw * 0.16, bh = ih * 0.07, bx = ix + iw * 0.25 + c * bw * 1.08 + r * bw * 0.54, by = iy + ih * 0.8 - r * bh * 1.05;
      const gb = ctx.createLinearGradient(bx, by, bx, by + bh); gb.addColorStop(0, '#fff3b0'); gb.addColorStop(0.5, '#ffc93c'); gb.addColorStop(1, '#a86a00');
      ctx.save(); glow(ctx, '#ffd166', 18 * o); ctx.fillStyle = gb; ctx.beginPath(); ctx.moveTo(bx + bw * 0.12, by); ctx.lineTo(bx + bw * 0.88, by); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx, by + bh); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    ctx.font = `${Math.round(S * 0.09)}px serif`; ctx.textAlign = 'center';
    ctx.fillText('💰', cx - S * 0.06, iy + ih * 0.44); ctx.fillText('💎', cx + S * 0.12, iy + ih * 0.34); ctx.fillText('💵', cx + S * 0.28, iy + ih * 0.46);
  }
  // door (swings around the left hinge)
  ctx.save();
  if (o > 0) { ctx.translate(ix, 0); ctx.scale(1 - o * 0.88, 1); ctx.translate(-ix, 0); }
  const dx0 = ix + S * 0.01, dy0 = iy + S * 0.01, dw = iw - S * 0.02, dh = ih - S * 0.02;
  roundRect(ctx, dx0, dy0, dw, dh, S * 0.025);
  const door = ctx.createLinearGradient(dx0, dy0, dx0 + dw, dy0 + dh);
  door.addColorStop(0, '#4a5668'); door.addColorStop(0.5, '#2a3342'); door.addColorStop(1, '#1a212c');
  ctx.fillStyle = door; ctx.fill();
  // brushed lines
  ctx.save(); ctx.clip(); ctx.globalAlpha = 0.05; ctx.strokeStyle = '#fff';
  for (let yy = dy0; yy < dy0 + dh; yy += 3) { ctx.beginPath(); ctx.moveTo(dx0, yy); ctx.lineTo(dx0 + dw, yy + ((yy * 7) % 5) - 2); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2; ctx.stroke();
  // inner bevel panel
  roundRect(ctx, dx0 + dw * 0.06, dy0 + dh * 0.06, dw * 0.88, dh * 0.88, S * 0.02);
  ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 4; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1; ctx.stroke();
  // rivets
  const rr = S * 0.012;
  for (let i = 0; i < 6; i++) { const f = 0.08 + (i / 5) * 0.84; rivet(ctx, dx0 + dw * f, dy0 + dh * 0.03, rr); rivet(ctx, dx0 + dw * f, dy0 + dh * 0.97, rr); rivet(ctx, dx0 + dw * 0.03, dy0 + dh * f, rr); rivet(ctx, dx0 + dw * 0.97, dy0 + dh * f, rr); }
  // brand plate
  const bpw = dw * 0.42, bph = dh * 0.07, bpx = dx0 + dw / 2 - bpw / 2 - dw * 0.04, bpy = dy0 + dh * 0.075;
  roundRect(ctx, bpx, bpy, bpw, bph, bph * 0.3);
  ctx.fillStyle = metal(ctx, bpx + bpw / 2, bpy + bph / 2, bpw / 2, BRASS); ctx.fill();
  ctx.fillStyle = '#3a2405'; ctx.font = `800 ${Math.round(bph * 0.5)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(tr('FORT-KNOX™ DISCOUNT', 'FORT-KNOX™ DISCOUNT'), bpx + bpw / 2, bpy + bph / 2 + 1);
  // tumbler LEDs
  const dialX = dx0 + dw * 0.44, dialY = dy0 + dh * 0.56, R = S * 0.24;
  for (let i = 0; i < N; i++) {
    const lx = dialX + (i - (N - 1) / 2) * S * 0.07, ly = dy0 + dh * 0.175;
    const on = i < st.idx, cur = i === st.idx;
    const col = on ? '#2dffb0' : cur ? hc : '#ff3355';
    ctx.save(); glow(ctx, col, on ? 18 : cur ? 6 + p * 16 : 4);
    ctx.fillStyle = on ? col : cur ? col : '#4a0d18'; ctx.globalAlpha = on ? 1 : cur ? 0.45 + 0.55 * (p || 0.3 + 0.2 * Math.sin(t * 6)) : 0.9;
    ctx.beginPath(); ctx.arc(lx, ly, S * 0.016, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(lx - S * 0.005, ly - S * 0.005, S * 0.005, 0, TAU); ctx.fill();
  }
  // locking bolts on the right edge (retract as numbers are found)
  for (let i = 0; i < N; i++) {
    const by = dy0 + dh * (0.2 + (i / (N - 1)) * 0.6), done = i < st.idx;
    const k = done ? Math.min(1, (st.t - (st.crackAt[i] ?? st.t)) * 4) : 0;
    const bx = dx0 + dw - S * 0.01 - k * S * 0.05;
    roundRect(ctx, bx, by - S * 0.018, S * 0.07, S * 0.036, S * 0.012);
    const bg = ctx.createLinearGradient(0, by - S * 0.018, 0, by + S * 0.018); bg.addColorStop(0, '#f1f5fa'); bg.addColorStop(0.5, '#8d99ab'); bg.addColorStop(1, '#3a4352');
    ctx.fillStyle = bg; ctx.fill();
  }
  // handle (spoked wheel)
  const hx = dx0 + dw * 0.82, hy = dialY, hr = S * 0.075, ha = st.opened ? st.opened * Math.PI : 0;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(ha + 0.3);
  ctx.strokeStyle = metal(ctx, 0, 0, hr, STEEL); ctx.lineWidth = S * 0.014; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) { const a = (i / 3) * TAU; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * hr, Math.sin(a) * hr); ctx.stroke(); rivet(ctx, Math.cos(a) * hr, Math.sin(a) * hr, S * 0.018); }
  rivet(ctx, 0, 0, S * 0.026);
  ctx.restore();
  // dial
  drawDial(ctx, dialX, dialY, R, val, p, sweet, hc, st.jitter, t);
  ctx.restore();
  st.dialX = dialX; st.dialY = dialY; st.dialR = R;
  // hinges
  for (const f of [0.22, 0.78]) { roundRect(ctx, x0 + S * 0.035, y0 + S * f - S * 0.06, S * 0.05, S * 0.12, S * 0.015); ctx.fillStyle = metal(ctx, x0 + S * 0.06, y0 + S * f, S * 0.06, STEEL); ctx.fill(); }
  // crack shockwave ring
  if (st.crackFx > 0) {
    ctx.save(); glow(ctx, '#2dffb0', 20); ctx.strokeStyle = `rgba(45,255,176,${st.crackFx})`; ctx.lineWidth = 4 * st.crackFx;
    ctx.beginPath(); ctx.arc(dialX, dialY, R * (1.2 + (1 - st.crackFx) * 0.9), 0, TAU); ctx.stroke(); ctx.restore();
  }
}

function drawPins(ctx: CanvasRenderingContext2D, cx0: number, cy0: number, S: number, st: St, val: number, p: number, sweet: boolean, hc: string, t: number) {
  const cx = cx0 - S * 0.1, cy = cy0 - S * 0.14;
  const bw = S * 0.88, bh = S * 0.52, bx = cx - bw / 2, by = cy - bh * 0.62;
  const o = st.opened ? 1 - Math.pow(1 - st.opened, 3) : 0;
  // housing
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
  roundRect(ctx, bx, by, bw, bh, bh * 0.12);
  const hg = ctx.createLinearGradient(0, by, 0, by + bh);
  hg.addColorStop(0, '#f7dc8a'); hg.addColorStop(0.18, '#c9962f'); hg.addColorStop(0.6, '#8a5c14'); hg.addColorStop(1, '#4e3108');
  ctx.fillStyle = hg; ctx.fill(); ctx.restore();
  roundRect(ctx, bx + 2, by + 2, bw - 4, bh - 4, bh * 0.12); ctx.strokeStyle = 'rgba(255,240,190,.55)'; ctx.lineWidth = 2; ctx.stroke();
  // cutaway hatch
  ctx.save(); roundRect(ctx, bx, by, bw, bh, bh * 0.12); ctx.clip(); ctx.globalAlpha = 0.08; ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
  for (let i = -bh; i < bw; i += 14) { ctx.beginPath(); ctx.moveTo(bx + i, by + bh); ctx.lineTo(bx + i + bh, by); ctx.stroke(); }
  ctx.restore();
  // plug
  const plx = bx + bw * 0.05, ply = by + bh * 0.58, plw = bw * 0.9, plh = bh * 0.34;
  const shift = 0;
  roundRect(ctx, plx, ply + shift, plw, plh, plh * 0.2);
  const pgr = ctx.createLinearGradient(0, ply, 0, ply + plh); pgr.addColorStop(0, '#e8c56a'); pgr.addColorStop(0.5, '#a87422'); pgr.addColorStop(1, '#5e3c0a');
  ctx.fillStyle = pgr; ctx.fill();
  // keyway
  const kwy = ply + plh * 0.5 + shift, kwh = plh * 0.3;
  ctx.fillStyle = '#0a0602'; ctx.fillRect(plx, kwy, plw + bw * 0.06, kwh);
  // shear line
  ctx.save(); glow(ctx, sweet ? '#2dffb0' : '#7fdcff', 12); ctx.strokeStyle = sweet ? '#2dffb0' : 'rgba(127,220,255,.7)'; ctx.lineWidth = 2; ctx.setLineDash([8, 6]); ctx.lineDashOffset = -t * 20;
  ctx.beginPath(); ctx.moveTo(plx, ply); ctx.lineTo(plx + plw, ply); ctx.stroke(); ctx.restore();
  // pin stacks
  const cw = bw * 0.075, top = by + bh * 0.07;
  const pinX = (i: number) => bx + bw * (0.18 + i * 0.17);
  const keyH = plh * 0.42, drvH = bh * 0.2;
  for (let i = 0; i < N; i++) {
    const x = pinX(i);
    // chamber
    ctx.fillStyle = '#120a03'; roundRect(ctx, x - cw / 2, top, cw, kwy - top, cw * 0.3); ctx.fill();
    const set = i < st.idx, cur = i === st.idx;
    // lift: 0 = resting, 1 = gap at shear line
    let lift = 0;
    if (cur && !st.opened) lift = Math.min(0.97, p * 0.92 + (sweet ? 0.06 : 0)) + (st.jitter > 0 ? Math.sin(t * 80) * 0.05 : 0) + Math.sin(t * 9 + i) * 0.01 * p;
    const rest = keyH * 0.5;
    // key pin bottom sits in the keyway at rest
    const keyBottom = kwy + rest - lift * rest - (cur ? 0 : 0);
    const keyTop = set ? ply + plh * 0.05 + shift : keyBottom - keyH;
    const drvBottom = set ? ply - 1 : keyTop;
    const drvTop = drvBottom - drvH;
    // spring
    ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = 1.6; ctx.beginPath();
    const coils = 7;
    for (let c = 0; c <= coils * 2; c++) { const yy = top + 3 + (c / (coils * 2)) * (drvTop - top - 3); ctx.lineTo(x + (c % 2 ? cw * 0.32 : -cw * 0.32), yy); }
    ctx.stroke();
    // driver pin (steel)
    const dg = ctx.createLinearGradient(x - cw / 2, 0, x + cw / 2, 0); dg.addColorStop(0, '#5a6474'); dg.addColorStop(0.4, '#f1f5fa'); dg.addColorStop(1, '#6b7687');
    ctx.save(); if (set) glow(ctx, '#2dffb0', 14);
    roundRect(ctx, x - cw * 0.4, drvTop, cw * 0.8, drvH, cw * 0.2); ctx.fillStyle = dg; ctx.fill(); ctx.restore();
    // key pin (gold, pointed)
    const kg = ctx.createLinearGradient(x - cw / 2, 0, x + cw / 2, 0); kg.addColorStop(0, '#8a5a12'); kg.addColorStop(0.45, '#fff0b8'); kg.addColorStop(1, '#a87422');
    const kt = set ? keyTop : keyTop, kb = set ? keyTop + keyH : keyBottom;
    ctx.save(); if (cur) glow(ctx, hc, 6 + p * 22);
    ctx.fillStyle = kg; ctx.beginPath(); ctx.moveTo(x - cw * 0.4, kt + 2); ctx.lineTo(x + cw * 0.4, kt + 2); ctx.lineTo(x + cw * 0.4, kb - cw * 0.35); ctx.lineTo(x, kb); ctx.lineTo(x - cw * 0.4, kb - cw * 0.35); ctx.closePath(); ctx.fill(); ctx.restore();
    if (set) { ctx.save(); glow(ctx, '#2dffb0', 18); ctx.fillStyle = '#2dffb0'; ctx.fillRect(x - cw * 0.5, ply - 2, cw, 3); ctx.restore(); }
    // labels
    ctx.fillStyle = set ? '#2dffb0' : cur ? hc : 'rgba(255,240,200,.5)'; ctx.font = `800 ${Math.round(S * 0.032)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText(set ? '✓' : String(i + 1), x, by - S * 0.02);
  }
  // pick: enters from the right through the keyway, tip under current pin
  const tx = pinX(Math.min(st.idx, N - 1));
  st.pickX = st.pickX ? st.pickX + (tx - st.pickX) * 0.15 : tx;
  const curLift = st.idx < N && !st.opened ? p * 0.92 : 0;
  const tipY = kwy + kwh * 0.75 - curLift * keyH * 0.55;
  const hx = bx + bw + S * 0.1;
  ctx.save();
  ctx.strokeStyle = metal(ctx, (st.pickX + hx) / 2, kwy, S * 0.3, STEEL); ctx.lineWidth = S * 0.012; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(hx, kwy + kwh * 0.75); ctx.lineTo(st.pickX + cw * 0.6, kwy + kwh * 0.75); ctx.quadraticCurveTo(st.pickX + cw * 0.2, kwy + kwh * 0.75, st.pickX, tipY); ctx.stroke();
  // pick handle
  roundRect(ctx, hx - S * 0.02, kwy + kwh * 0.75 - S * 0.022, S * 0.15, S * 0.044, S * 0.022);
  const hgr = ctx.createLinearGradient(0, kwy - S * 0.02, 0, kwy + S * 0.05); hgr.addColorStop(0, '#ff7ac8'); hgr.addColorStop(1, '#b0157a');
  glow(ctx, '#ff5bd1', 14); ctx.fillStyle = hgr; ctx.fill();
  ctx.restore();
  // tension wrench (rotates with the dial value)
  const wx = plx + plw + bw * 0.03, wy = kwy + kwh * 0.15, wa = Math.sin((val / 100) * TAU) * 0.12;
  ctx.save(); ctx.translate(wx, wy); ctx.rotate(wa);
  ctx.strokeStyle = '#2b3445'; ctx.lineWidth = S * 0.014; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-S * 0.035, 0); ctx.lineTo(0, 0); ctx.lineTo(S * 0.02, S * 0.1); ctx.stroke();
  ctx.restore();
  // brass tension dial (the actual control)
  const R = S * 0.13, dX = bx + bw * 0.5, dY = by + bh + R * 1.5;
  drawDial(ctx, dX, dY, R, val, p, sweet, hc, st.jitter, t, true);
  ctx.fillStyle = 'rgba(255,240,200,.75)'; ctx.font = `700 ${Math.round(S * 0.028)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center';
  ctx.fillText(tr('TENSION', 'TENSION'), dX - R * 2.2, dY + 4);
  st.dialX = dX; st.dialY = dY; st.dialR = R;
  if (st.crackFx > 0) {
    ctx.save(); glow(ctx, '#2dffb0', 20); ctx.strokeStyle = `rgba(45,255,176,${st.crackFx})`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(pinX(Math.max(0, st.idx - 1)), ply, S * 0.04 + (1 - st.crackFx) * S * 0.15, 0, TAU); ctx.stroke(); ctx.restore();
  }
  if (o > 0) {
    ctx.save(); ctx.globalAlpha = o;
    const gl = ctx.createRadialGradient(cx, by + bh * 0.5, 0, cx, by + bh * 0.5, bw * 0.6); gl.addColorStop(0, 'rgba(255,209,102,.45)'); gl.addColorStop(1, 'rgba(255,209,102,0)');
    ctx.fillStyle = gl; ctx.fillRect(bx - bw * 0.1, by - bh * 0.2, bw * 1.2, bh * 1.4);
    glow(ctx, '#ffd166', 30); ctx.font = `${Math.round(S * (0.12 + o * 0.06))}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🔓', cx, by + bh * 0.3); ctx.restore();
  }
}

function drawScope(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, wave: number[], hc: string, p: number, sweet: boolean, t: number) {
  roundRect(ctx, x, y, w, h, 10); ctx.fillStyle = '#020a08'; ctx.fill();
  ctx.strokeStyle = 'rgba(127,220,255,.25)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.save(); roundRect(ctx, x, y, w, h, 10); ctx.clip();
  ctx.strokeStyle = 'rgba(80,255,180,.08)';
  for (let gx = x; gx < x + w; gx += w / 10) { ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); ctx.stroke(); }
  for (let gy = y; gy < y + h; gy += h / 4) { ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); ctx.stroke(); }
  const mid = y + h * 0.58;
  ctx.strokeStyle = sweet ? '#2dffb0' : hc; glow(ctx, sweet ? '#2dffb0' : hc, 12); ctx.lineWidth = 2;
  ctx.beginPath();
  wave.forEach((v, i) => { const xx = x + (i / (wave.length - 1)) * w; const yy = mid - Math.max(-1.2, Math.min(1.2, v)) * h * 0.36; if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); });
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = `700 ${Math.max(10, Math.round(h * 0.11))}px Fredoka Variable, sans-serif`; ctx.textAlign = 'left';
  ctx.fillText(tr('🩺 STÉTHOSCOPE', '🩺 STETHOSCOPE'), x + 10, y + h * 0.16);
  ctx.textAlign = 'right'; ctx.fillStyle = sweet ? '#2dffb0' : hc;
  ctx.fillText(sweet ? tr('ICI !!', 'HERE!!') : p > 0.6 ? tr('brûlant 🔥', 'burning 🔥') : p > 0.25 ? tr('tiède', 'warm') : tr('froid ❄', 'cold ❄'), x + w - 10, y + h * 0.16);
  if (Math.floor(t * 2) % 2) { ctx.fillStyle = '#ff3355'; ctx.beginPath(); ctx.arc(x + w - 12, y + h - 12, 4, 0, TAU); ctx.fill(); }
  ctx.restore();
}

function drawCode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, st: St, pins: boolean, hc: string, t: number) {
  ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = `700 ${Math.max(10, Math.round(h * 0.2))}px Fredoka Variable, sans-serif`; ctx.textAlign = 'left';
  ctx.fillText(pins ? tr('GOUPILLES', 'PINS') : tr('COMBINAISON', 'COMBINATION'), x, y + h * 0.18);
  const gap = 8, bw = (w - gap * (N - 1)) / N, bh = h * 0.62, yy = y + h * 0.3;
  for (let i = 0; i < N; i++) {
    const bx = x + i * (bw + gap), done = i < st.idx, cur = i === st.idx;
    roundRect(ctx, bx, yy, bw, bh, 8);
    ctx.fillStyle = done ? 'rgba(45,255,176,.14)' : 'rgba(255,255,255,.05)'; ctx.fill();
    ctx.save(); if (done || cur) glow(ctx, done ? '#2dffb0' : hc, 12);
    ctx.strokeStyle = done ? '#2dffb0' : cur ? hc : 'rgba(255,255,255,.15)'; ctx.lineWidth = cur ? 2 + Math.sin(t * 6) : 1.5; ctx.stroke(); ctx.restore();
    ctx.fillStyle = done ? '#2dffb0' : cur ? hc : 'rgba(255,255,255,.3)';
    ctx.font = `800 ${Math.round(bh * 0.5)}px ui-monospace, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(done ? (pins ? '✓' : String(st.targets[i]).padStart(2, '0')) : cur ? '??' : '--', bx + bw / 2, yy + bh / 2 + 1);
    ctx.textBaseline = 'alphabetic';
  }
}

function drawAlarm(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, alarm: number, t: number) {
  const hot = alarm > 75;
  ctx.fillStyle = hot && Math.floor(t * 6) % 2 ? '#ff3355' : 'rgba(255,255,255,.75)';
  ctx.font = `700 ${Math.max(10, Math.round(h * 0.2))}px Fredoka Variable, sans-serif`; ctx.textAlign = 'left';
  ctx.fillText(tr('🚨 ALARME', '🚨 ALARM'), x, y + h * 0.18);
  ctx.textAlign = 'right'; ctx.fillText(`${Math.round(alarm)}%`, x + w, y + h * 0.18);
  const segs = 20, gap = 3, sw = (w - gap * (segs - 1)) / segs, sh = h * 0.5, yy = y + h * 0.32;
  for (let i = 0; i < segs; i++) {
    const on = (i + 1) / segs <= alarm / 100 + 0.001;
    const f = i / (segs - 1);
    const col = f < 0.5 ? mix([45, 255, 176], [255, 209, 102], f * 2) : mix([255, 209, 102], [255, 31, 61], (f - 0.5) * 2);
    ctx.save(); if (on) glow(ctx, col, 10);
    ctx.fillStyle = on ? col : 'rgba(255,255,255,.07)';
    roundRect(ctx, x + i * (sw + gap), yy, sw, sh, 3); ctx.fill(); ctx.restore();
  }
}

function drawDog(ctx: CanvasRenderingContext2D, x: number, y: number, sz: number, alarm: number, busted: boolean, t: number) {
  // basket
  const bg = ctx.createLinearGradient(0, y, 0, y + sz * 0.5); bg.addColorStop(0, '#a0522d'); bg.addColorStop(1, '#4a2410');
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(x, y + sz * 0.5, sz * 1.05, sz * 0.18, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(x, y + sz * 0.25, sz * 0.95, sz * 0.32, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#ff5b8a'; ctx.beginPath(); ctx.ellipse(x, y + sz * 0.12, sz * 0.8, sz * 0.2, 0, 0, TAU); ctx.fill();
  const lvl = busted ? 4 : alarm > 75 ? 3 : alarm > 50 ? 2 : alarm > 30 ? 1 : 0;
  ctx.save();
  ctx.translate(x, y - (lvl >= 3 ? Math.abs(Math.sin(t * (lvl === 4 ? 18 : 10))) * sz * 0.2 : 0));
  if (lvl >= 1) ctx.rotate(Math.sin(t * (6 + lvl * 4)) * 0.06 * lvl);
  ctx.font = `${Math.round(sz)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (lvl <= 1) { ctx.scale(-1, 1); ctx.fillText('🐕', 0, 0); }
  else ctx.fillText('🐶', 0, -sz * 0.05);
  ctx.restore();
  ctx.textAlign = 'center';
  if (lvl === 0) {
    for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3) % 1; ctx.globalAlpha = 1 - k; ctx.fillStyle = '#c4b5fd'; ctx.font = `800 ${Math.round(sz * (0.22 + k * 0.2))}px Fredoka Variable, sans-serif`; ctx.fillText('z', x + sz * 0.4 + k * sz * 0.5, y - sz * 0.5 - k * sz * 0.7); }
    ctx.globalAlpha = 1;
  } else {
    const txt = lvl === 1 ? '?' : 'grr…';
    ctx.save(); glow(ctx, lvl >= 3 ? '#ff1f3d' : '#ffd166', 12); ctx.fillStyle = lvl >= 3 ? '#ff3355' : '#ffd166';
    ctx.font = `800 ${Math.round(sz * (lvl >= 3 ? 0.42 : 0.34))}px Fredoka Variable, sans-serif`;
    ctx.fillText(lvl === 4 ? tr('WOUF !', 'WOOF!') : lvl === 3 ? 'GRRRR!' : txt, x + sz * 0.75, y - sz * 0.6 + Math.sin(t * 8) * 3); ctx.restore();
  }
}
