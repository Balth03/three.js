// Rhythm game (karaoke / concert / DJ): 4 neon lanes, notes on a perspective highway, live-synthesised backing track.
import { useRef } from 'preact/hooks';
import { useGame, useCanvas, useKeys, Arena, tr, glow, type GameProps } from './kit.tsx';
import { synth } from '../../audio.ts';

const LANE_KEYS = [['KeyD', 'KeyS'], ['KeyF'], ['KeyJ'], ['KeyK', 'KeyL']];
const LANE_COL = ['#ff2d95', '#22d3ee', '#a3e635', '#ffd166'];
const SCALE = [0, 3, 5, 7, 10, 12, 15];
const LYRICS: Record<string, [string, string][]> = {
  karaoke: [['Je suis seul{e} ce soir 🎤', 'All alone tonight 🎤'], ['avec mon micro et mon désespoir', 'just me, my mic and despair'], ['le barman pleure', 'the bartender is crying'], ['les voisins appellent la police', 'the neighbours are calling the cops'], ['ENCORE UNE FOIS !', 'ONE MORE TIME!'], ['ma voix déraille', 'my voice cracks'], ['mais mon cœur, lui, assure', 'but my heart still slays']],
  concert: [['Bonsoir {city} !!!', 'Good evening {city}!!!'], ['faites du bruiiit', 'make some noiiise'], ['le bassiste est bourré', 'the bassist is wasted'], ['slam dans la fosse', 'crowd-surfing time'], ['un soutien-gorge vole', 'a bra flies on stage'], ['LES BRAS EN L\'AIR', 'HANDS IN THE AIR'], ['rappel ! rappel !', 'encore! encore!']],
  dj: [['DROP DANS 3… 2…', 'DROP IN 3… 2…'], ['les basses font vibrer les dents', 'the bass rattles your teeth'], ['quelqu\'un a vomi près des enceintes', 'someone puked by the speakers'], ['BOOM BOOM BOOM', 'BOOM BOOM BOOM'], ['les mains en l\'air, les tongs aussi', 'hands up, flip-flops too'], ['remix de la Macarena', 'Macarena remix'], ['le soleil se lève, on continue', 'the sun is rising, we keep going']],
};

interface Note { t: number; lane: number; hit?: 'perfect' | 'good' | 'miss'; hold?: number }

export function Rhythm({ onDone, l, variant = 'karaoke' }: GameProps) {
  const g = useGame({ onDone });
  const bpm = variant === 'dj' ? 128 : variant === 'concert' ? 140 : 108;
  const beat = 60 / bpm;
  const s = useRef({
    notes: [] as Note[], start: 0, started: false, lanesFlash: [0, 0, 0, 0], perfect: 0, good: 0, missed: 0, crowd: 0.5, nextBeat: 0, ended: false, root: 220 + Math.floor(Math.random() * 4) * 22, keysDown: [false, false, false, false],
  });
  // chart: 32 bars of patterns, density rising
  if (!s.current.notes.length) {
    const bars = 22;
    for (let b = 0; b < bars; b++) {
      const dens = b < 4 ? 0.35 : b < 10 ? 0.55 : b < 16 ? 0.7 : 0.85;
      for (let q = 0; q < 8; q++) {
        if (Math.random() > dens && q % 2 === 1) continue;
        if (Math.random() > dens + 0.25) continue;
        const lane = (b * 3 + q * (b % 3 + 1) + Math.floor(Math.random() * 2)) % 4;
        s.current.notes.push({ t: 2 + (b * 8 + q) * beat / 2, lane });
        if (b > 12 && Math.random() < 0.12) s.current.notes.push({ t: 2 + (b * 8 + q) * beat / 2, lane: (lane + 2) % 4 });
      }
    }
  }
  const songLen = (s.current.notes[s.current.notes.length - 1]?.t ?? 30) + 2;
  const press = (lane: number) => {
    const st = s.current;
    if (g.phase !== 'play') return;
    st.lanesFlash[lane] = 1;
    const now = synth.now() - st.start;
    let bestN: Note | null = null, bestD = 1;
    for (const n of st.notes) { if (n.hit || n.lane !== lane) continue; const d = Math.abs(n.t - now); if (d < bestD) { bestD = d; bestN = n; } if (n.t - now > 0.3) break; }
    const x = 26 + lane * 16;
    if (bestN && bestD < 0.06) { bestN.hit = 'perfect'; st.perfect++; g.hit('perfect'); g.add(300, tr('PARFAIT', 'PERFECT'), x, 70, LANE_COL[lane]); g.burst(x, 78, LANE_COL[lane], 22); st.crowd = Math.min(1, st.crowd + 0.025); synth.tone(st.root * Math.pow(2, SCALE[(lane * 2 + st.perfect) % SCALE.length] / 12), 0.18, 'square', 0.06); }
    else if (bestN && bestD < 0.13) { bestN.hit = 'good'; st.good++; g.hit('good'); g.add(120, tr('BIEN', 'GOOD'), x, 70, '#fff'); g.burst(x, 78, '#ffffff', 10); st.crowd = Math.min(1, st.crowd + 0.012); synth.tone(st.root * Math.pow(2, SCALE[lane * 2 % SCALE.length] / 12), 0.12, 'triangle', 0.05); }
    else { g.miss(tr('RATÉ', 'MISS'), x, 70); st.crowd = Math.max(0, st.crowd - 0.03); synth.tone(110, 0.15, 'sawtooth', 0.05, 0, 0.6); }
  };
  useKeys((e) => { if (e.repeat) return; LANE_KEYS.forEach((ks, i) => { if (ks.includes(e.code)) { s.current.keysDown[i] = true; press(i); } }); }, (e) => { LANE_KEYS.forEach((ks, i) => { if (ks.includes(e.code)) s.current.keysDown[i] = false; }); });
  const lyrics = LYRICS[variant] ?? LYRICS.karaoke;
  const canvas = useCanvas((ctx, w, h, dt, t) => {
    const st = s.current;
    if (g.phase === 'play' && !st.started) { st.started = true; st.start = synth.now(); st.nextBeat = 0; }
    const now = st.started ? synth.now() - st.start : 0;
    // backing track scheduler (look-ahead)
    if (g.phase === 'play' && !st.ended) {
      while (st.nextBeat * beat < now + 0.25) {
        const b = st.nextBeat, when = st.start + b * beat - synth.now();
        if (when > -0.05) {
          synth.kick(Math.max(0, when));
          if (b % 2 === 1) synth.snare(Math.max(0, when));
          synth.hat(Math.max(0, when + beat / 2));
          const bassNote = [0, 0, 5, 3, 7, 7, 5, 3][b % 8];
          synth.tone(st.root / 2 * Math.pow(2, bassNote / 12), beat * 0.9, variant === 'dj' ? 'sawtooth' : 'triangle', 0.07, Math.max(0, when));
        }
        st.nextBeat++;
      }
      // misses
      for (const n of st.notes) if (!n.hit && now - n.t > 0.16) { n.hit = 'miss'; st.missed++; g.miss(); st.crowd = Math.max(0, st.crowd - 0.04); }
      if (now > songLen && !st.ended) {
        st.ended = true;
        const total = st.notes.length;
        const acc = (st.perfect + st.good * 0.6) / Math.max(1, total);
        g.end(acc * 0.85 + st.crowd * 0.15, [[tr('Parfaits', 'Perfects'), String(st.perfect)], [tr('Bien', 'Goods'), String(st.good)], [tr('Ratés', 'Misses'), String(st.missed)], [tr('Combo max', 'Max combo'), String(g.best)], [tr('Public', 'Crowd'), `${Math.round(st.crowd * 100)}%`]]);
      }
    }
    // ─── render ───
    ctx.clearRect(0, 0, w, h);
    const pulse = st.started ? Math.max(0, 1 - ((now % beat) / beat) * 3) : 0;
    // stage lights
    for (let i = 0; i < 6; i++) {
      const a = Math.sin(t * 0.8 + i) * 0.5;
      const x0 = (i + 0.5) * w / 6;
      const grd = ctx.createLinearGradient(x0, 0, x0 + a * w * 0.3, h);
      grd.addColorStop(0, `${LANE_COL[i % 4]}55`); grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.moveTo(x0 - 6, 0); ctx.lineTo(x0 + 6, 0); ctx.lineTo(x0 + a * w * 0.3 + 80, h); ctx.lineTo(x0 + a * w * 0.3 - 80, h); ctx.fill();
    }
    // crowd silhouettes bouncing
    ctx.fillStyle = '#0a0314';
    for (let i = 0; i < 40; i++) { const cx = (i / 40) * w + 10, bob = Math.abs(Math.sin(t * (bpm / 30) + i)) * 8 * st.crowd; ctx.beginPath(); ctx.arc(cx, h - 18 - bob, 13, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(cx - 14, h - 14 - bob, 28, 30); if (st.crowd > 0.7 && i % 3 === 0) ctx.fillRect(cx - 2, h - 50 - bob, 4, 26); }
    // highway in perspective
    const hitY = h * 0.8, topY = h * 0.08, cx = w / 2, botW = Math.min(w * 0.6, 520), topW = botW * 0.25;
    const laneX = (lane: number, y: number) => { const k = (y - topY) / (hitY - topY); const wd = topW + (botW - topW) * k; return cx - wd / 2 + (lane + 0.5) * wd / 4; };
    const laneW = (y: number) => { const k = (y - topY) / (hitY - topY); return (topW + (botW - topW) * k) / 4; };
    ctx.fillStyle = 'rgba(8,2,20,.75)';
    ctx.beginPath(); ctx.moveTo(cx - topW / 2, topY); ctx.lineTo(cx + topW / 2, topY); ctx.lineTo(cx + botW / 2 * 1.12, h); ctx.lineTo(cx - botW / 2 * 1.12, h); ctx.fill();
    for (let i = 0; i <= 4; i++) { ctx.strokeStyle = `rgba(255,255,255,${i === 0 || i === 4 ? 0.5 : 0.15})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - topW / 2 + i * topW / 4, topY); ctx.lineTo(cx - botW / 2 * 1.12 + i * botW * 1.12 / 4, h); ctx.stroke(); }
    // beat lines
    if (st.started) for (let b = Math.floor(now / beat); b < now / beat + 8; b++) { const dtb = b * beat - now; const y = hitY - (dtb / 2.0) * (hitY - topY); if (y < topY || y > h) continue; ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.moveTo(laneX(0, y) - laneW(y) / 2, y); ctx.lineTo(laneX(3, y) + laneW(y) / 2, y); ctx.stroke(); }
    // hit zone
    for (let i = 0; i < 4; i++) {
      const x = laneX(i, hitY), r = laneW(hitY) * 0.38;
      st.lanesFlash[i] = Math.max(0, st.lanesFlash[i] - dt * 5);
      ctx.save(); glow(ctx, LANE_COL[i], 20 + st.lanesFlash[i] * 30);
      ctx.strokeStyle = LANE_COL[i]; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, hitY, r * (1 + pulse * 0.08), 0, Math.PI * 2); ctx.stroke();
      if (st.keysDown[i] || st.lanesFlash[i] > 0) { ctx.fillStyle = `${LANE_COL[i]}66`; ctx.fill(); }
      ctx.restore();
      ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.font = '700 14px monospace'; ctx.textAlign = 'center'; ctx.fillText(LANE_KEYS[i][0].replace('Key', ''), x, hitY + r + 22);
    }
    // notes
    for (const n of st.notes) {
      if (n.hit === 'perfect' || n.hit === 'good') continue;
      const dtn = n.t - now; if (dtn > 2.1 || dtn < -0.3) continue;
      const y = hitY - (dtn / 2.0) * (hitY - topY);
      const x = laneX(n.lane, y), r = laneW(y) * 0.34;
      ctx.save();
      glow(ctx, LANE_COL[n.lane], 18);
      ctx.fillStyle = n.hit === 'miss' ? '#444' : LANE_COL[n.lane];
      ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.moveTo(x, y - r * 0.6); ctx.lineTo(x + r * 0.35, y - r * 0.1); ctx.lineTo(x - r * 0.35, y - r * 0.1); ctx.fill();
      ctx.restore();
    }
    // lyrics ticker
    if (st.started) {
      const li = Math.floor(now / (beat * 8)) % lyrics.length;
      const txt = lyrics[li][lang() === 'fr' ? 0 : 1].replace('{e}', l.gender === 'f' ? 'e' : '').replace('{city}', l.city);
      ctx.save(); glow(ctx, '#ff5bd1', 16); ctx.fillStyle = '#fff'; ctx.font = `800 ${Math.round(22 + pulse * 6)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.fillText(txt, cx, h * 0.05 + 18); ctx.restore();
    }
    // crowd meter
    ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(18, h * 0.15, 12, h * 0.55);
    const cc = st.crowd > 0.66 ? '#a3e635' : st.crowd > 0.33 ? '#ffd166' : '#ff1f3d';
    ctx.save(); glow(ctx, cc, 14); ctx.fillStyle = cc; ctx.fillRect(18, h * 0.15 + h * 0.55 * (1 - st.crowd), 12, h * 0.55 * st.crowd); ctx.restore();
    ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.fillText(st.crowd > 0.66 ? '🤩' : st.crowd > 0.33 ? '😐' : '🍅', 24, h * 0.13);
  }, true);
  const titles: Record<string, [string, string, string]> = { karaoke: ['🎤', 'Karaoké', 'Karaoke'], concert: ['🎸', 'Le concert', 'The gig'], dj: ['🎧', 'DJ set', 'DJ set'] };
  const [icon, fr, en] = titles[variant] ?? titles.karaoke;
  return (
    <Arena g={g} title={tr(fr, en)} icon={icon} theme={variant === 'dj' ? 'ice' : variant === 'concert' ? 'blood' : 'neon'}
      howTo={tr('Tape les notes au moment où elles touchent les cercles. Les parfaits font chanter le public, les ratés font voler les tomates.', 'Hit the notes as they reach the rings. Perfects make the crowd go wild, misses bring the tomatoes.')}
      keys={['D', 'F', 'J', 'K']}>
      <canvas class="play" ref={canvas} />
    </Arena>
  );
}

function lang() { return document.documentElement.lang === 'en' ? 'en' : 'fr'; }
