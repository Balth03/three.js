// Baston: Punch-Out!!-style 2.5D duel (bar brawl / prison yard / boxing ring) against a randomised cartoon thug.
// Read the telegraphed wind-ups, dodge (←/→) or block (↓), then punish the opening with jabs (J/Space) and hooks (K).
import { useRef } from 'preact/hooks';
import { useGame, useCanvas, useKeys, Arena, tr, rand, glow, roundRect, type GameProps } from './kit.tsx';
import { sfx, synth } from '../../audio.ts';

type Setting = 'bar' | 'prison' | 'ring';
type Atk = 'L' | 'R' | 'H' | 'S';
type OState = 'idle' | 'windup' | 'strike' | 'recover' | 'stunned' | 'taunt' | 'ko' | 'win';
type Face = 'angry' | 'grin' | 'hurt' | 'dizzy' | 'ko' | 'laugh';

const DURATION = 40;
const DODGE_T = 0.42, DODGE_CD = 0.14, JAB_T = 0.2, JAB_LAND = 0.085, HOOK_T = 0.36, HOOK_LAND = 0.19, STRIKE_T = 0.16;
const OUT = '#1a0b0b';
const HEAD_Y = -455;
const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const easeOut = (k: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, k)), 3);
const easeBack = (k: number) => { const c = 1.9, x = Math.max(0, Math.min(1, k)) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };

const FIRST: [string, string][] = [['Kévin', 'Kevin'], ['Jean-Mi', 'Big Mike'], ['Dylan', 'Dylan'], ['Bernard', 'Bernie'], ['Steevy', 'Stevie'], ['Gégé', 'Gary'], ['Jordy', 'Jordy'], ['Brandon', 'Brandon'], ['Tonton Michel', 'Uncle Mike'], ['Ludo', 'Ludo'], ['Momo', 'Mo'], ['Francky', 'Frankie'], ['Jean-Kévin', 'Kevin-John'], ['Rico', 'Rico']];
const EPI: [string, string][] = [['la Mâchoire', 'the Jaw'], ['Deux-Pintes', 'Two-Pints'], ['le Frigo', 'the Fridge'], ['la Brique', 'the Brick'], ['Coup-de-Boule', 'Headbutt'], ['la Bétonnière', 'the Cement Mixer'], ['Sans-Dents', 'No-Teeth'], ['le Kebab', 'the Kebab'], ['Gros Bras', 'Big Arms'], ["l'Haleine", 'Bad Breath'], ['la Tarte', 'the Slapper'], ['Mange-Tout', 'the Hoover'], ['le Viking', 'the Viking'], ['Tête-de-Pioche', 'Pickaxe-Head']];
const TAUNTS: [string, string][] = [["Viens là mon p'tit !", 'Come here, sweetie!'], ['Ta mère frappe plus fort !', 'Your mom hits harder!'], ["J'ai mangé un kebab, j'ai la force !", "I ate a kebab, I'm unstoppable!"], ['Tu sens la défaite !', 'You smell like defeat!'], ['Je vais te refaire le portrait !', "I'll rearrange your face!"], ["Allez, frappe, j'ai pas toute la nuit !", "C'mon, I don't have all night!"], ['Même pas mal.', "Didn't even tickle."], ['Tu danses ou tu te bats ?', 'You dancing or fighting?']];
const OUCH: [string, string][] = [['Aïe, ma dent !', 'Ow, my tooth!'], ['Pas le visage !', 'Not the face!'], ['Maman…', 'Mommy…'], ['Ok ok, temps mort !', 'Ok ok, time out!'], ["J'vois trois toi…", 'I see three of you…'], ['Mon dentiste va te remercier', 'My dentist thanks you']];
const GLOAT: [string, string][] = [['Ha ! Dans ta face !', 'Ha! In your face!'], ['Ça, c\'est cadeau !', 'Free sample!'], ['Tu veux la deuxième ?', 'Want seconds?'], ['Bisou !', 'Kisses!']];
const FEINT: [string, string][] = [['Lol, t\'as flippé !', 'Ha, flinched!'], ['Je rigole !', 'Just kidding!']];
const POW = ['POW!', 'BAM!', 'CRAC!', 'PAF!', 'SBAF!', 'BIM!', 'WHAM!'];
const SKINS: [string, string][] = [['#ffdbac', '#d9a877'], ['#f1c27d', '#c99a5b'], ['#e0ac69', '#b07f43'], ['#c68642', '#8f5a24'], ['#8d5524', '#5e3612'], ['#5c3317', '#3a1e0b'], ['#f5cfa0', '#cf9f6c'], ['#a86b3c', '#74431e']];

interface Look {
  skin: string; skinD: string; hair: 'bald' | 'buzz' | 'mohawk' | 'mullet' | 'afro' | 'cap'; hairC: string; beard: 'none' | 'stubble' | 'full' | 'mustache' | 'goatee';
  jaw: number; belly: number; shirt: 'tank' | 'tee' | 'jumpsuit' | 'none'; shirtC: string; pants: string; gloves: string | null; brass: boolean;
  chain: boolean; scar: boolean; bandage: boolean; tattoo: boolean; shirtTxt: string; capC: string;
}
interface Fist { x: number; y: number; r: number; glow: number }
interface Pose { x: number; y: number; rot: number; hx: number; hy: number; hr: number; hs: number; f: [Fist, Fist]; face: Face; glowHead: number; item: number; stars: number }
interface Part { x: number; y: number; vx: number; vy: number; life: number; max: number; kind: 'blood' | 'tooth' | 'spark' | 'sweat' | 'glass' | 'star'; r: number; rot: number; vr: number; floor: number; color: string; rest?: boolean }
interface Splat { x: number; y: number; r: number; life: number; blobs: { dx: number; dy: number; r: number }[]; drips: { dx: number; len: number; sp: number }[] }
interface Comic { x: number; y: number; text: string; t: number; color: string; size: number; rot: number; star: boolean }
interface Stain { x: number; y: number; r: number }

function makeLook(set: Setting): Look {
  const [skin, skinD] = pick(SKINS);
  const hairC = pick(['#1b1210', '#3b2314', '#6b4423', '#c9a15a', '#9a3412', '#d4d4d4', '#111']);
  const shirt = set === 'prison' ? 'jumpsuit' : set === 'ring' ? 'none' : pick(['tank', 'tank', 'tee'] as const);
  return {
    skin, skinD, hairC, shirt,
    hair: pick(set === 'ring' ? ['bald', 'buzz', 'mohawk', 'afro'] as const : ['bald', 'buzz', 'mohawk', 'mullet', 'afro', 'cap'] as const),
    beard: pick(['none', 'stubble', 'full', 'mustache', 'goatee'] as const),
    jaw: rand(1, 1.45), belly: set === 'ring' ? rand(0, 0.3) : rand(0.1, 1),
    shirtC: set === 'prison' ? '#ff7a1a' : pick(['#f4f4f5', '#ef4444', '#1f2937', '#22c55e', '#facc15', '#3b82f6']),
    pants: set === 'prison' ? '#e8650f' : set === 'ring' ? pick(['#dc2626', '#2563eb', '#16a34a', '#a21caf', '#facc15']) : '#334a7a',
    gloves: set === 'ring' ? pick(['#dc2626', '#1d4ed8', '#111827', '#16a34a']) : null,
    brass: set === 'bar' && Math.random() < 0.4,
    chain: Math.random() < 0.5, scar: Math.random() < 0.5, bandage: Math.random() < 0.3, tattoo: Math.random() < 0.6,
    shirtTxt: pick(set === 'prison' ? [`#${Math.floor(rand(100, 999))}`, '#69', '#420'] : ['MAMAN ♥', 'BEER', 'NO PAIN', 'TONTON', 'CAMPING ⛺', '']),
    capC: pick(['#dc2626', '#111827', '#16a34a', '#f59e0b']),
  };
}

function newState(set: Setting, athletic: number) {
  const f = pick(FIRST), e = pick(EPI);
  return {
    set, look: makeLook(set), name: [`${f[0]} ${e[0]}`, `${f[1]} ${e[1]}`] as [string, string], pow: 1 + (athletic - 50) / 250,
    // opponent
    o: { state: 'idle' as OState, t: 0, dur: 1.4, atk: 'L' as Atk, feint: false, resolved: false, next: 'recover' as OState, nextDur: 0.4, hp: 100, hpShow: 100, guardHits: 0, chain: 0, lastTaunt: 0, koT: 0 },
    pose: null as Pose | null,
    hk: { x: 0, y: 0, r: 0, s: 0, vx: 0, vy: 0, vr: 0, vs: 0 },
    teeth: [true, true, true, true, true, true, true, true],
    // player
    p: { hp: 100, hpShow: 100, sta: 100, dodge: 0 as -1 | 0 | 1, dodgeT: 9, cd: 0, block: false, punch: null as null | { kind: 'jab' | 'hook'; t: number; landed: boolean; weak: boolean }, buffer: null as null | 'jab' | 'hook', hurt: 0 },
    viewX: 0, roll: 0, kick: { x: 0, y: 0, r: 0 }, shake: 0, freeze: 0, slow: 0, impact: 0, impactX: 0, impactY: 0, redPulse: 0,
    parts: [] as Part[], splats: [] as Splat[], comics: [] as Comic[], stains: [] as Stain[],
    stamp: null as null | { text: string; sub: string; t: number; color: string },
    bubble: null as null | { text: string; t: number; dur: number },
    keys: new Set<string>(),
    // stats
    dealt: 0, taken: 0, perfect: 0, dodges: 0, lost: 0, landed: 0, bestWin: 0, winHits: 0,
    ending: null as null | { kind: 'ko' | 'kod' | 'time'; t: number }, ended: false, started: false, heart: 0, wallT: 0,
  };
}
type FS = ReturnType<typeof newState>;

// ─── sound helpers ───
const bell = (n = 3) => { for (let i = 0; i < n; i++) { synth.tone(1480, 0.9, 'triangle', 0.08, i * 0.22); synth.tone(2230, 0.5, 'sine', 0.04, i * 0.22); } };
const thud = () => { synth.tone(120, 0.09, 'square', 0.1, 0, 0.6); synth.noise(0.06, 0.18, 700); };
const crowd = (v = 1) => { synth.noise(1.4, 0.05 * v, 900); synth.noise(1.0, 0.04 * v, 2200, 0.1); };
const ting = () => { synth.tone(2600, 0.15, 'sine', 0.06, 0, 1.15); synth.tone(3400, 0.1, 'sine', 0.04, 0.05); };
const glass = () => { synth.noise(0.35, 0.22, 5200); for (let i = 0; i < 4; i++) synth.tone(2000 + Math.random() * 2500, 0.12, 'sine', 0.04, i * 0.03); };

let FLAT: string | null = null; // impact-frame override colour
const F = (c: string | CanvasGradient) => (FLAT ?? c);

export function Fight({ onDone, l, variant }: GameProps) {
  const g = useGame({ duration: DURATION, onDone });
  const s = useRef<FS | null>(null);
  if (!s.current) {
    const inPrison = !!(l as unknown as { prison?: unknown })?.prison;
    const set: Setting = variant === 'bar' || variant === 'prison' || variant === 'ring' ? variant : inPrison ? 'prison' : pick(['bar', 'ring', 'bar'] as const);
    s.current = newState(set, (l as unknown as { attrs?: { athletic?: number } })?.attrs?.athletic ?? 50);
    if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__fight = s.current;
  }
  const family = !!(l as unknown as { family?: boolean })?.family;
  const pSkin = SKINS[((l as unknown as { app?: { skin?: number } })?.app?.skin ?? 1) % SKINS.length] ?? SKINS[1];
  const pName = (l as unknown as { first?: string })?.first || tr('Toi', 'You');

  const say = (st: FS, lines: [string, string][], dur = 1.4) => { const q = pick(lines); st.bubble = { text: tr(q[0], q[1]), t: 0, dur }; };
  const comic = (st: FS, x: number, y: number, text: string, color = '#ffd166', size = 44, star = true) => st.comics.push({ x, y, text, t: 0, color, size, rot: rand(-0.25, 0.25), star });

  const startPunch = (kind: 'jab' | 'hook') => {
    const st = s.current; if (!st || g.phase !== 'play' || st.ending) return;
    const p = st.p;
    if (p.block || (p.dodge && p.dodgeT < DODGE_T * 0.7)) return;
    if (p.punch) { const land = p.punch.kind === 'jab' ? JAB_LAND : HOOK_LAND; if (p.punch.t > land) p.buffer = kind; return; }
    const cost = kind === 'jab' ? 9 : 20;
    const weak = p.sta < cost;
    p.sta = Math.max(0, p.sta - cost);
    p.punch = { kind, t: 0, landed: false, weak };
    synth.noise(0.12, 0.07, kind === 'jab' ? 1400 : 900);
  };
  const startDodge = (dir: -1 | 1) => {
    const st = s.current; if (!st || g.phase !== 'play' || st.ending) return;
    const p = st.p;
    if (p.cd > 0 || (p.dodge && p.dodgeT < DODGE_T)) return;
    if (p.punch && p.punch.t < (p.punch.kind === 'jab' ? JAB_LAND : HOOK_LAND)) return;
    p.punch = null; p.buffer = null;
    p.dodge = dir; p.dodgeT = 0;
    sfx.whoosh();
  };

  useKeys((e) => {
    const st = s.current; if (!st) return;
    st.keys.add(e.code);
    if (e.repeat) return;
    if (e.code === 'Space' || e.code === 'KeyJ' || e.code === 'KeyF') startPunch('jab');
    else if (e.code === 'KeyK' || e.code === 'KeyG' || e.code === 'ArrowUp') startPunch('hook');
    else if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') startDodge(-1);
    else if (e.code === 'ArrowRight' || e.code === 'KeyD') startDodge(1);
  }, (e) => { s.current?.keys.delete(e.code); });

  const ptr = useRef<{ block: boolean }>({ block: false });

  const canvas = useCanvas((ctx, w, h, rdt, t) => {
    const st = s.current; if (!st) return;
    try {
      step(st, rdt, w, h);
      render(ctx, st, w, h, t);
    } catch { /* never throw from the game loop */ }
  }, true);

  // ─────────────────────────── simulation ───────────────────────────
  function step(st: FS, rdt: number, w: number, h: number) {
    const playing = g.phase === 'play';
    const o = st.o, p = st.p;
    st.wallT += rdt;
    if (playing && !st.started) { st.started = true; bell(3); say(st, TAUNTS, 1.8); }
    // time scale: hit-stop & slow-motion
    if (st.freeze > 0) { st.freeze -= rdt; rdt = 0; }
    if (st.slow > 0) { st.slow -= rdt; rdt *= 0.22; }
    const dt = rdt;
    st.impact = Math.max(0, st.impact - (st.freeze > 0 ? 0 : 1 / 60));
    st.shake = Math.max(0, st.shake - dt * 3.2);
    st.redPulse = Math.max(0, st.redPulse - dt * 1.8);
    const S = Math.min(h / 720, w / 640);
    const oppX = w / 2 - st.viewX, base = h * 0.97;
    const headPos = () => ({ x: oppX + ((st.pose?.hx ?? 0) + st.hk.x) * S, y: base + (HEAD_Y + (st.pose?.hy ?? 0) + st.hk.y) * S });

    // ── player ──
    p.block = (st.keys.has('ArrowDown') || st.keys.has('KeyS') || ptr.current.block) && !st.ending && playing;
    if (p.dodge) { p.dodgeT += dt; if (p.dodgeT > DODGE_T) { p.dodge = 0; p.cd = DODGE_CD; } }
    p.cd = Math.max(0, p.cd - dt);
    p.hurt = Math.max(0, p.hurt - dt * 3);
    const busy = !!p.punch || p.block;
    p.sta = Math.min(100, p.sta + dt * (busy ? 10 : p.block ? 6 : 32));
    if (p.block) p.sta = Math.max(0, p.sta - dt * 4);
    p.hpShow = p.hpShow > p.hp ? Math.max(p.hp, p.hpShow - dt * 30) : p.hp;
    o.hpShow = o.hpShow > o.hp ? Math.max(o.hp, o.hpShow - dt * 30) : o.hp;
    st.viewX += ((p.dodge ? p.dodge * w * 0.2 * Math.sin(Math.min(1, p.dodgeT / DODGE_T) * Math.PI) ** 0.35 : 0) - st.viewX) * Math.min(1, dt * 22);
    st.roll += ((p.dodge ? p.dodge * 0.07 : 0) - st.roll) * Math.min(1, dt * 14);
    st.kick.x *= Math.max(0, 1 - dt * 8); st.kick.y *= Math.max(0, 1 - dt * 8); st.kick.r *= Math.max(0, 1 - dt * 8);

    if (p.punch) {
      const pu = p.punch;
      const T = pu.kind === 'jab' ? JAB_T : HOOK_T, LAND = pu.kind === 'jab' ? JAB_LAND : HOOK_LAND;
      pu.t += dt;
      if (!pu.landed && pu.t >= LAND) { pu.landed = true; landPunch(st, pu.kind, pu.weak, headPos(), w, h); }
      if (pu.t >= T) { p.punch = null; if (p.buffer) { const b = p.buffer; p.buffer = null; startPunch(b); } }
    }
    // low HP heartbeat
    if (playing && p.hp < 30 && p.hp > 0) { st.heart -= rdt; if (st.heart <= 0) { st.heart = 0.75; synth.tone(55, 0.12, 'sine', 0.28); synth.tone(48, 0.14, 'sine', 0.22, 0.17); st.redPulse = Math.max(st.redPulse, 0.6); } }

    // ── opponent ──
    o.t += dt;
    const prog = Math.min(1, g.elapsed / DURATION + (1 - o.hp / 100) * 0.35);
    if (playing && !st.ending) {
      switch (o.state) {
        case 'idle':
          if (o.t > o.dur) {
            if (g.elapsed - o.lastTaunt > 7 && Math.random() < 0.22) { o.state = 'taunt'; o.t = 0; o.dur = 1.25; o.lastTaunt = g.elapsed; say(st, TAUNTS, 1.3); }
            else startAttack(st, prog);
          }
          break;
        case 'windup':
          if (o.t > o.dur) {
            if (o.feint) { o.state = 'taunt'; o.t = 0; o.dur = 0.9; say(st, FEINT, 1.1); }
            else { o.state = 'strike'; o.t = 0; o.resolved = false; synth.noise(0.18, 0.12, 600); }
          }
          break;
        case 'strike':
          if (!o.resolved && o.t >= STRIKE_T * 0.6) { o.resolved = true; resolveStrike(st, w, h); }
          if (o.t >= STRIKE_T + 0.06) { o.state = o.next; o.t = 0; o.dur = o.nextDur; }
          break;
        case 'recover':
          if (o.t > o.dur) {
            if (g.elapsed > 18 && o.chain < 1 && Math.random() < 0.35) { o.chain++; startAttack(st, prog, 0.42); }
            else { o.chain = 0; o.state = 'idle'; o.t = 0; o.dur = lerp(1.4, 0.6, prog) + rand(0, 0.5); }
          }
          break;
        case 'stunned':
          if (o.t > o.dur) {
            if (st.winHits >= 3) comic(st, w / 2, h * 0.3, `COMBO ×${st.winHits}`, '#ff5bd1', 40);
            st.bestWin = Math.max(st.bestWin, st.winHits); st.winHits = 0;
            o.state = 'idle'; o.t = 0; o.dur = rand(0.35, 0.7); o.guardHits = 0;
          }
          break;
        case 'taunt':
          if (o.t > o.dur) { o.state = 'idle'; o.t = 0; o.dur = rand(0.2, 0.5); }
          break;
      }
    }
    if (o.state === 'ko') o.koT += dt;
    // head spring
    const hk = st.hk;
    hk.vx += (-hk.x * 170 - hk.vx * 11) * dt; hk.vy += (-hk.y * 170 - hk.vy * 11) * dt; hk.vr += (-hk.r * 170 - hk.vr * 11) * dt; hk.vs += (-hk.s * 170 - hk.vs * 11) * dt;
    hk.x += hk.vx * dt; hk.y += hk.vy * dt; hk.r += hk.vr * dt; hk.s += hk.vs * dt;
    updatePose(st, dt);

    // ── particles ──
    for (let i = st.parts.length - 1; i >= 0; i--) {
      const q = st.parts[i];
      q.life += dt; if (q.life > q.max) { st.parts.splice(i, 1); continue; }
      if (q.rest) continue;
      q.vy += (q.kind === 'star' ? 0 : q.kind === 'spark' ? 600 : 1500) * dt;
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
      if (q.kind !== 'spark' && q.kind !== 'star' && q.y > q.floor && q.vy > 0) {
        if (q.kind === 'blood') { if (st.stains.length < 60) st.stains.push({ x: q.x - (w / 2 - st.viewX), y: q.y, r: q.r * rand(1.4, 2.6) }); st.parts.splice(i, 1); continue; }
        if (q.kind === 'tooth' && Math.abs(q.vy) > 200) { q.vy *= -0.45; q.vx *= 0.6; q.vr *= 0.6; ting(); }
        else { q.rest = true; q.y = q.floor; }
      }
    }
    for (let i = st.splats.length - 1; i >= 0; i--) { const q = st.splats[i]; q.life += rdt; if (q.life > 3.2) st.splats.splice(i, 1); }
    for (let i = st.comics.length - 1; i >= 0; i--) { const q = st.comics[i]; q.t += rdt; if (q.t > 0.75 || !q.text) st.comics.splice(i, 1); }
    if (st.stamp) st.stamp.t += rdt;
    if (st.bubble) { st.bubble.t += rdt; if (st.bubble.t > st.bubble.dur) st.bubble = null; }

    // ── end conditions ──
    if (playing && !st.ending && g.time <= 0) {
      st.ending = { kind: 'time', t: 0 }; bell(3); crowd(0.8);
      const win = st.dealt >= st.taken;
      st.stamp = { text: tr('TEMPS !', 'TIME!'), sub: win ? tr('VICTOIRE AUX POINTS', 'WIN ON POINTS') : tr('DÉFAITE AUX POINTS', 'LOSS ON POINTS'), t: 0, color: win ? '#ffd166' : '#ff4d6d' };
      if (o.state !== 'ko') { o.state = win ? 'stunned' : 'win'; o.t = 0; o.dur = 99; }
    }
    if (st.ending) {
      st.ending.t += rdt;
      if (st.ending.t > (st.ending.kind === 'time' ? 2.2 : 2.9) && !st.ended) {
        st.ended = true;
        const dealt = Math.round(st.dealt), taken = Math.round(st.taken);
        const res = st.ending.kind === 'ko' ? tr('🥊 K.O. !', '🥊 K.O.!') : st.ending.kind === 'kod' ? tr('💫 T\'ES K.O.', '💫 KNOCKED OUT') : dealt >= taken ? tr('🏆 Aux points', '🏆 On points') : tr('😵 Battu aux points', '😵 Lost on points');
        const sc = st.ending.kind === 'ko' ? 0.72 + 0.28 * (p.hp / 100) : st.ending.kind === 'kod' ? 0.05 + 0.25 * (dealt / 100) : 0.12 + 0.45 * (dealt / 100) + 0.3 * (p.hp / 100);
        g.end(sc, [
          [tr('Résultat', 'Result'), res],
          [tr('Infligés', 'Dealt'), `💥 ${dealt}`],
          [tr('Encaissés', 'Taken'), `🩹 ${taken}`],
          [tr('Esquives', 'Dodges'), `${st.dodges} (★${st.perfect})`],
          [tr('Dents', 'Teeth'), `🦷 × ${st.lost}`],
        ]);
      }
    }
  }

  function startAttack(st: FS, prog: number, forced = 0) {
    const o = st.o;
    const r = Math.random() * (g.elapsed > 7 ? 100 : 85);
    o.atk = r < 35 ? 'L' : r < 70 ? 'R' : r < 85 ? 'H' : 'S';
    o.state = 'windup'; o.t = 0;
    o.dur = forced || Math.max(0.42, lerp(0.95, 0.5, prog) + rand(-0.06, 0.12)) + (o.atk === 'S' ? 0.25 : 0);
    o.feint = !forced && g.elapsed > 14 && Math.random() < 0.13;
    synth.tone(o.atk === 'S' ? 180 : 330, 0.35, 'sawtooth', 0.025, 0, 1.6);
  }

  function resolveStrike(st: FS, w: number, h: number) {
    const o = st.o, p = st.p;
    const dodging = p.dodge !== 0 && p.dodgeT < DODGE_T;
    const dir = p.dodge;
    let dodged = false, blocked = false;
    if (o.atk === 'L') { dodged = dodging && dir === 1; blocked = !dodged && p.block; }
    else if (o.atk === 'R') { dodged = dodging && dir === -1; blocked = !dodged && p.block; }
    else if (o.atk === 'H') { dodged = dodging; blocked = !dodged && p.block; }
    else dodged = dodging;
    const cx = w / 2, cy = h * 0.55;
    if (dodged) {
      const perfect = p.dodgeT < 0.22;
      st.dodges++;
      if (perfect) { st.perfect++; st.slow = 0.35; g.hit('perfect'); g.add(200, tr('PARFAIT !', 'PERFECT!'), 50, 34, '#22d3ee'); }
      else { g.hit('good'); g.add(80, tr('ESQUIVE', 'DODGED'), 50, 34, '#a3e635'); }
      comic(st, cx, h * 0.25, tr('CONTRE !', 'COUNTER!'), '#22d3ee', 40);
      o.next = 'stunned'; o.nextDur = perfect ? 1.1 : 0.85; st.winHits = 0;
      if (o.atk === 'S') { // item smashes on the floor
        glass(); for (let i = 0; i < 26; i++) st.parts.push({ x: w / 2 - st.viewX + rand(-60, 60), y: h * 0.82, vx: rand(-500, 500), vy: rand(-700, -200), life: 0, max: rand(0.8, 1.6), kind: 'glass', r: rand(4, 10), rot: rand(0, 6), vr: rand(-12, 12), floor: h * rand(0.85, 1), color: st.set === 'bar' ? '#5fbf6a' : '#c7ccd4' });
        say(st, [['Ma bouteille !!', 'My bottle!!'], ['Raté, mince.', 'Missed, dang.'], ['Grrr !', 'Grrr!']], 1);
      }
    } else if (blocked) {
      const isHead = o.atk === 'H';
      const dmg = (isHead ? 16 : 12) * 0.22;
      p.hp = Math.max(0, p.hp - dmg); st.taken += dmg; p.sta = Math.max(0, p.sta - 18);
      thud(); st.shake = 0.5; st.kick.y = 18;
      comic(st, cx, cy, tr('BLOQUÉ', 'BLOCKED'), '#e5e7eb', 34, false);
      sparks(st, cx, cy + 20, 14, '#ffe08a');
      if (isHead) { o.next = 'stunned'; o.nextDur = 1.0; say(st, [['AÏE mon front !', 'OW my forehead!'], ['Ça fait mal en fait…', 'That actually hurts…']], 1.1); g.hit('good'); }
      else { o.next = 'recover'; o.nextDur = 0.45; }
    } else {
      const dmg = o.atk === 'S' ? 22 : o.atk === 'H' ? 16 : 12;
      const guardBroken = o.atk === 'S' && p.block;
      p.hp = Math.max(0, p.hp - dmg); st.taken += dmg; p.hurt = 1;
      sfx.punch(); if (o.atk !== 'L' && o.atk !== 'R') sfx.splat();
      if (o.atk === 'S') glass();
      g.miss(); g.shake(); g.flash('#ff1f3d');
      st.shake = 1.4; st.freeze = 0.09; st.redPulse = 1;
      st.kick.x = o.atk === 'L' ? 70 : o.atk === 'R' ? -70 : rand(-20, 20); st.kick.y = 40; st.kick.r = o.atk === 'L' ? 0.12 : o.atk === 'R' ? -0.12 : rand(-0.08, 0.08);
      comic(st, cx + rand(-80, 80), cy - 40, guardBroken ? tr('GARDE BRISÉE !', 'GUARD BROKEN!') : dodging ? tr('MAUVAIS CÔTÉ !', 'WRONG WAY!') : pick(['OUCH!', 'BONK!', 'CRAC!', 'AÏE!']), '#ff4d6d', 46);
      if (!family) for (let i = 0; i < 2 + Math.floor(dmg / 7); i++) addSplat(st, w, h);
      if (o.atk === 'S') for (let i = 0; i < 20; i++) st.parts.push({ x: cx + rand(-120, 120), y: cy + rand(-60, 60), vx: rand(-600, 600), vy: rand(-500, 100), life: 0, max: rand(0.6, 1.2), kind: 'glass', r: rand(5, 12), rot: rand(0, 6), vr: rand(-14, 14), floor: h * 1.1, color: st.set === 'bar' ? '#5fbf6a' : '#c7ccd4' });
      o.next = 'recover'; o.nextDur = 0.55;
      if (Math.random() < 0.6) say(st, GLOAT, 1.2);
      if (p.hp <= 0) playerKO(st);
    }
  }

  function playerKO(st: FS) {
    st.ending = { kind: 'kod', t: 0 }; st.slow = 1.6;
    st.stamp = { text: tr("T'ES K.O. !", "YOU'RE K.O.!"), sub: tr(`${st.name[0]} gagne`, `${st.name[1]} wins`), t: 0, color: '#ff1f3d' };
    st.o.state = 'win'; st.o.t = 0; sfx.boom(); bell(5); crowd(1.2);
    say(st, [['Et ça, c\'est pour ta mère !', 'And that one\'s for your mom!'], ['Trop facile.', 'Too easy.']], 2.5);
  }

  function landPunch(st: FS, kind: 'jab' | 'hook', weak: boolean, head: { x: number; y: number }, w: number, h: number) {
    const o = st.o;
    if (o.state === 'ko' || st.ending) return;
    const isHook = kind === 'hook';
    let mult = 1, clean = true, crit = false, interrupt = false;
    if (o.state === 'stunned') mult = 1.35;
    else if (o.state === 'taunt') { mult = 1.1; o.state = 'idle'; o.t = 0; o.dur = 0.25; }
    else if (o.state === 'windup') { if (isHook && o.t < o.dur * 0.85) { crit = true; interrupt = true; mult = 2; } }
    else if (o.state === 'idle' || o.state === 'recover') {
      const blockChance = isHook ? 0.55 : 0.72;
      if (o.state === 'idle' && Math.random() < blockChance) clean = false;
    }
    if (!clean) {
      thud(); sparks(st, head.x + (isHook ? -30 : 0), head.y + 110, 10, '#ffe08a');
      comic(st, head.x, head.y + 40, tr('PARÉ', 'GUARD'), '#cbd5e1', 26, false);
      o.guardHits++; st.hk.vy -= 60;
      if (o.guardHits >= 2) { o.guardHits = 0; startAttack(st, 1, 0.45); say(st, [['Bien essayé !', 'Nice try!'], ['Ma garde est en béton !', 'My guard is concrete!']], 1); }
      return;
    }
    let dmg = (isHook ? 7.5 : 3.6) * mult * st.pow * (weak ? 0.45 : 1);
    if (o.state === 'stunned' && st.winHits >= 2 && isHook) { dmg *= 1.25; crit = true; }
    dmg = Math.round(dmg * 10) / 10;
    o.hp = Math.max(0, o.hp - dmg); st.dealt += dmg; st.landed++;
    if (o.state === 'stunned') { st.winHits++; if (st.winHits >= 4) { o.t = Math.max(o.t, o.dur - 0.05); say(st, [['Ok ça suffit !', 'Okay, enough!'], ['Je me réveille !', "I'm awake now!"]], 1); } }
    if (interrupt) { o.state = 'stunned'; o.t = 0; o.dur = 0.9; comic(st, w / 2, h * 0.22, tr('INTERROMPU !', 'INTERRUPTED!'), '#22d3ee', 38); }
    // juice
    const dirX = isHook ? -1 : rand(-0.3, 0.3);
    st.hk.vx += dirX * (isHook ? 700 : 260); st.hk.vy += isHook ? -80 : -260; st.hk.vr += dirX * (isHook ? 9 : 2); st.hk.vs -= isHook ? 1 : 2.2;
    sfx.punch(); if (crit || isHook) synth.tone(70, 0.2, 'sine', 0.3, 0, 0.4);
    st.freeze = crit ? 0.14 : isHook ? 0.08 : 0.045;
    st.shake = Math.max(st.shake, crit ? 1.2 : isHook ? 0.8 : 0.35);
    if (isHook || crit) { st.impact = crit ? 0.07 : 0.035; st.impactX = head.x; st.impactY = head.y; g.shake(); }
    if (crit) g.flash('#ffffff');
    comic(st, head.x + rand(-60, 60), head.y - 70 + rand(-20, 20), weak ? tr('pff…', 'meh…') : crit ? pick(['KRAKOOM!', 'SBAAAM!', 'CRUNCH!']) : pick(POW), weak ? '#94a3b8' : crit ? '#ff5bd1' : isHook ? '#ffd166' : '#fff', crit ? 58 : isHook ? 46 : 34);
    g.hit(crit || mult > 1 ? 'perfect' : 'good');
    g.add(Math.round(dmg * 14), `-${Math.round(dmg)}`, (head.x / w) * 100 + 8, (head.y / h) * 100 - 6, crit ? '#ff5bd1' : '#ffd166');
    // gore (cartoon)
    const n = Math.round((isHook ? 12 : 6) * (crit ? 2 : 1));
    for (let i = 0; i < n; i++) st.parts.push({ x: head.x + rand(-15, 15), y: head.y + rand(-5, 25), vx: (-dirX * 0 + (isHook ? -1 : rand(-1, 1))) * rand(150, 650), vy: rand(-650, -100), life: 0, max: 2.4, kind: family ? 'sweat' : 'blood', r: rand(3, 8), rot: 0, vr: 0, floor: h * rand(0.72, 1.05), color: family ? '#9be7ff' : pick(['#d00020', '#b0001a', '#ff1f3d']) });
    for (let i = 0; i < 5; i++) st.parts.push({ x: head.x, y: head.y, vx: rand(-300, 300), vy: rand(-350, 50), life: 0, max: 0.6, kind: 'sweat', r: rand(2, 4), rot: 0, vr: 0, floor: h * 2, color: '#bfefff' });
    const toothChance = crit ? 0.8 : isHook ? 0.4 : 0.08;
    const left = st.teeth.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    if (left.length && Math.random() < toothChance) {
      const ti = pick(left); st.teeth[ti] = false; st.lost++;
      st.parts.push({ x: head.x, y: head.y + 30, vx: (isHook ? -1 : rand(-1, 1)) * rand(250, 500), vy: rand(-800, -500), life: 0, max: 4, kind: 'tooth', r: 9, rot: 0, vr: rand(-20, 20), floor: h * rand(0.8, 0.95), color: '#fffbea' });
      comic(st, head.x + 90, head.y + 30, '🦷 -1', '#fff', 26, false);
      if (Math.random() < 0.5) say(st, OUCH, 1.1);
    }
    if (o.hp <= 0) {
      o.state = 'ko'; o.t = 0; o.koT = 0; st.ending = { kind: 'ko', t: 0 };
      st.slow = 2.2; st.freeze = 0.2; st.impact = 0.12; g.flash('#ffffff'); sfx.boom(); bell(5); crowd(1.5);
      st.stamp = { text: 'K.O.!', sub: tr(`${st.name[0]} fait dodo`, `${st.name[1]} goes night-night`), t: 0, color: '#ff1f3d' };
      g.add(2500, tr('K.O. !!!', 'K.O.!!!'), 50, 30, '#ffd166');
      for (let i = 0; i < 3; i++) { const left2 = st.teeth.map((v, j) => (v ? j : -1)).filter((j) => j >= 0); if (!left2.length) break; st.teeth[pick(left2)] = false; st.lost++; st.parts.push({ x: head.x, y: head.y + 30, vx: rand(-500, 500), vy: rand(-900, -500), life: 0, max: 5, kind: 'tooth', r: 9, rot: 0, vr: rand(-20, 20), floor: h * rand(0.8, 0.95), color: '#fffbea' }); }
      for (let i = 0; i < 6; i++) st.parts.push({ x: head.x, y: head.y - 60, vx: 0, vy: 0, life: 0, max: 3, kind: 'star', r: 14, rot: (i / 6) * Math.PI * 2, vr: 0, floor: h * 2, color: '#ffd166' });
    }
  }

  function sparks(st: FS, x: number, y: number, n: number, color: string) {
    for (let i = 0; i < n; i++) { const a = rand(0, Math.PI * 2), sp = rand(200, 600); st.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(0.15, 0.35), kind: 'spark', r: rand(2, 4), rot: a, vr: 0, floor: 9e9, color }); }
  }
  function addSplat(st: FS, w: number, h: number) {
    const edge = Math.random();
    const x = edge < 0.5 ? rand(0, w * 0.3) + (Math.random() < 0.5 ? 0 : w * 0.7) : rand(w * 0.15, w * 0.85);
    const y = edge < 0.5 ? rand(h * 0.1, h * 0.8) : Math.random() < 0.5 ? rand(0, h * 0.2) : rand(h * 0.75, h);
    const r = rand(18, 46);
    st.splats.push({ x, y, r, life: 0, blobs: Array.from({ length: 7 }, () => ({ dx: rand(-1.4, 1.4) * r, dy: rand(-1.2, 1.2) * r, r: rand(0.15, 0.45) * r })), drips: Array.from({ length: 3 }, () => ({ dx: rand(-0.7, 0.7) * r, len: rand(0.6, 2.2) * r, sp: rand(0.5, 1.4) })) });
  }

  // ─── opponent pose (smoothed toward a per-state target) ───
  function updatePose(st: FS, dt: number) {
    const o = st.o, t = st.wallT, L = st.look;
    const bob = Math.sin(t * 3.4) * 7, sway = Math.sin(t * 1.4) * 14;
    const fr = L.gloves ? 50 : 42;
    const tg: Pose = { x: sway, y: bob, rot: 0, hx: sway * 0.3, hy: bob * 0.6, hr: Math.sin(t * 1.4) * 0.03, hs: 1, f: [{ x: -78 + sway * 0.2, y: -305 + bob, r: fr, glow: 0 }, { x: 78 + sway * 0.2, y: -305 + bob * 1.2, r: fr, glow: 0 }], face: o.hp < 35 ? 'hurt' : 'angry', glowHead: 0, item: 0, stars: 0 };
    let rate = 14;
    const k = o.state === 'windup' ? Math.min(1, o.t / Math.max(0.01, o.dur)) : 0;
    const pulse = 0.55 + 0.45 * Math.sin(o.t * (18 + k * 30));
    switch (o.state) {
      case 'idle': if (o.hp < 35) tg.face = Math.sin(t * 2) > 0.6 ? 'hurt' : 'angry'; break;
      case 'windup': {
        tg.face = 'grin';
        if (o.atk === 'L' || o.atk === 'R') {
          const i = o.atk === 'L' ? 0 : 1, sd = i === 0 ? -1 : 1;
          tg.f[i] = { x: sd * (210 + k * 30), y: -370 - k * 20, r: fr * 1.05, glow: (0.35 + k * 0.65) * pulse };
          tg.rot = sd * 0.09 * easeOut(k * 2); tg.x += sd * 30; tg.hx += sd * 20;
        } else if (o.atk === 'H') {
          tg.hy = -30 - k * 30; tg.hs = 0.92; tg.glowHead = (0.35 + k * 0.65) * pulse; tg.rot = 0; tg.y -= 10;
          tg.f[0].x = -120; tg.f[1].x = 120; tg.f[0].y = tg.f[1].y = -250;
        } else {
          tg.f[0] = { x: -45, y: -600 - k * 30, r: fr, glow: 0.4 * pulse }; tg.f[1] = { x: 45, y: -600 - k * 30, r: fr, glow: 0.4 * pulse };
          tg.item = 1; tg.y -= 20; tg.hy -= 10;
        }
        break;
      }
      case 'strike': {
        rate = 45;
        const kk = easeOut(o.t / STRIKE_T);
        tg.face = 'grin';
        if (o.atk === 'L' || o.atk === 'R') { const i = o.atk === 'L' ? 0 : 1, sd = i === 0 ? -1 : 1; tg.f[i] = { x: sd * lerp(150, 25, kk), y: lerp(-360, -330, kk), r: lerp(fr, 175, kk), glow: 0.5 }; tg.rot = -sd * 0.06; tg.x -= sd * 25; }
        else if (o.atk === 'H') { tg.hy = lerp(-40, 120, kk); tg.hs = lerp(1, 2.2, kk); tg.glowHead = 0.6; tg.y += 30 * kk; }
        else { tg.f[0] = { x: -30, y: lerp(-600, -330, kk), r: lerp(fr, 150, kk), glow: 0.3 }; tg.f[1] = { x: 30, y: lerp(-600, -330, kk), r: lerp(fr, 150, kk), glow: 0.3 }; tg.item = 1 + kk * 1.4; }
        break;
      }
      case 'recover': tg.face = 'angry'; rate = 10; break;
      case 'stunned':
        tg.face = 'dizzy'; tg.stars = 1; tg.f[0] = { x: -110, y: -140, r: fr, glow: 0 }; tg.f[1] = { x: 105, y: -130, r: fr, glow: 0 };
        tg.hr = Math.sin(t * 5) * 0.16; tg.hx = Math.sin(t * 2.5) * 20; tg.rot = Math.sin(t * 2.5) * 0.04; tg.hy = 10; break;
      case 'taunt':
        tg.face = 'laugh'; tg.f[0] = { x: -100, y: -150, r: fr, glow: 0 }; tg.f[1] = { x: 150 + Math.sin(t * 14) * 18, y: -420, r: fr, glow: 0 }; tg.hr = 0.12; tg.hx = 10; break;
      case 'win':
        tg.face = 'laugh'; tg.f[0] = { x: -170, y: -560 + Math.sin(t * 8) * 12, r: fr, glow: 0 }; tg.f[1] = { x: 170, y: -560 + Math.cos(t * 8) * 12, r: fr, glow: 0 }; tg.hr = Math.sin(t * 6) * 0.1; break;
      case 'ko': {
        const kk = easeOut(o.koT / 1.1);
        tg.face = 'ko'; tg.rot = -0.5 * kk; tg.y = 520 * kk * kk; tg.x = -80 * kk; tg.hr = -0.4; tg.stars = 1;
        tg.f[0] = { x: -230, y: -480, r: fr, glow: 0 }; tg.f[1] = { x: 240, y: -500, r: fr, glow: 0 };
        rate = 6; break;
      }
    }
    if (!st.pose) { st.pose = tg; return; }
    const P = st.pose, a = Math.min(1, dt * rate);
    P.x = lerp(P.x, tg.x, a); P.y = lerp(P.y, tg.y, a); P.rot = lerp(P.rot, tg.rot, a);
    P.hx = lerp(P.hx, tg.hx, a); P.hy = lerp(P.hy, tg.hy, a); P.hr = lerp(P.hr, tg.hr, a); P.hs = lerp(P.hs, tg.hs, a);
    for (let i = 0; i < 2; i++) { const f = P.f[i], q = tg.f[i]; f.x = lerp(f.x, q.x, a); f.y = lerp(f.y, q.y, a); f.r = lerp(f.r, q.r, a); f.glow = lerp(f.glow, q.glow, Math.min(1, dt * 20)); }
    P.glowHead = lerp(P.glowHead, tg.glowHead, Math.min(1, dt * 20)); P.item = lerp(P.item, tg.item, a); P.stars = lerp(P.stars, tg.stars, Math.min(1, dt * 6));
    P.face = tg.face;
  }

  // ─────────────────────────── rendering ───────────────────────────
  function render(ctx: CanvasRenderingContext2D, st: FS, w: number, h: number, t: number) {
    const o = st.o, p = st.p;
    const S = Math.min(h / 720, w / 640);
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    // camera: shake + kick + dodge roll (+ fall when KO'd)
    const sh = st.shake * st.shake * 16;
    const fall = st.ending?.kind === 'kod' ? easeOut(st.ending.t / 1.4) : 0;
    ctx.translate(w / 2 + rand(-sh, sh) + st.kick.x, h + rand(-sh, sh) + st.kick.y + fall * h * 0.25);
    ctx.rotate(st.roll + st.kick.r + fall * 0.5);
    ctx.translate(-w / 2, -h);
    const oppX = w / 2 - st.viewX, base = h * 0.97;
    if (st.impact > 0) {
      // manga impact frame: black, speed lines, white silhouettes with ink outlines
      ctx.fillStyle = '#050000'; ctx.fillRect(-w, -h, w * 3, h * 3);
      ctx.strokeStyle = '#ff1f3d'; ctx.lineWidth = 3;
      for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2 + i, r0 = rand(40, 120); ctx.beginPath(); ctx.moveTo(st.impactX + Math.cos(a) * r0, st.impactY + Math.sin(a) * r0); ctx.lineTo(st.impactX + Math.cos(a) * w, st.impactY + Math.sin(a) * w); ctx.stroke(); }
      FLAT = '#ffffff';
    } else {
      drawBG(ctx, st, w, h, t);
    }
    if (st.pose) {
      ctx.save(); ctx.translate(oppX, base); ctx.scale(S, S);
      drawThug(ctx, st.look, st.pose, st, t);
      ctx.restore();
    }
    if (!FLAT) drawParts(ctx, st);
    drawPlayer(ctx, st, w, h, S);
    FLAT = null;
    ctx.restore();

    // ── screen-space overlays ──
    // lens blood splats
    for (const q of st.splats) {
      const a = Math.min(1, (3.2 - q.life) / 1.2);
      ctx.save(); ctx.globalAlpha = a * 0.92;
      const grd = ctx.createRadialGradient(q.x - q.r * 0.3, q.y - q.r * 0.3, 1, q.x, q.y, q.r * 1.3);
      grd.addColorStop(0, '#ff3048'); grd.addColorStop(0.6, '#b3001b'); grd.addColorStop(1, '#5c000c');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); ctx.fill();
      for (const b of q.blobs) { ctx.beginPath(); ctx.arc(q.x + b.dx, q.y + b.dy, b.r, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = '#a00018'; ctx.lineCap = 'round';
      for (const d of q.drips) { const len = Math.min(d.len * 2.5, d.len * 0.3 + q.life * 40 * d.sp); ctx.lineWidth = q.r * 0.22; ctx.beginPath(); ctx.moveTo(q.x + d.dx, q.y); ctx.lineTo(q.x + d.dx, q.y + q.r * 0.5 + len); ctx.stroke(); ctx.beginPath(); ctx.arc(q.x + d.dx, q.y + q.r * 0.5 + len, q.r * 0.16, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(q.x - q.r * 0.35, q.y - q.r * 0.4, q.r * 0.25, q.r * 0.12, -0.6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // vignette + red pain pulse
    const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(${Math.round(st.redPulse * 160)},0,0,${0.55 + st.redPulse * 0.3})`);
    ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    // slow-mo tint
    if (st.slow > 0 && !st.ending) { ctx.fillStyle = 'rgba(34,211,238,.08)'; ctx.fillRect(0, 0, w, h); }
    // KO'd: eyelids closing
    if (st.ending?.kind === 'kod') { const k = easeOut((st.ending.t - 0.6) / 1.6) * 0.5; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h * k); ctx.fillRect(0, h * (1 - k), w, h * k); }

    drawBars(ctx, st, w, h, pName);
    // telegraph hint
    if (g.phase === 'play' && !st.ending) {
      if (o.state === 'windup' && !o.feint) {
        const keys = o.atk === 'L' ? ['→', '↓'] : o.atk === 'R' ? ['←', '↓'] : o.atk === 'H' ? ['←', '↓', '→'] : ['←', '→'];
        const label = o.atk === 'S' ? tr('⚠ IMBLOCABLE — ESQUIVE !', '⚠ UNBLOCKABLE — DODGE!') : o.atk === 'H' ? tr('COUP DE BOULE !', 'HEADBUTT!') : tr('CROCHET !', 'HOOK!');
        hint(ctx, w / 2, h - 34, keys, label, o.atk === 'S' ? '#ff4d6d' : '#ffd166', o.t / o.dur);
      } else if (o.state === 'stunned' && o.t < o.dur - 0.1) {
        hint(ctx, w / 2, h - 34, ['J', 'K'], tr('FRAPPE !', 'PUNISH!'), '#22d3ee', o.t / o.dur);
      } else if (o.state === 'taunt') {
        hint(ctx, w / 2, h - 34, ['J', 'K'], tr('IL BAISSE SA GARDE !', 'GUARD DOWN!'), '#a3e635', o.t / o.dur);
      } else if (g.elapsed < 4) {
        ctx.save(); ctx.font = '700 13px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,.8)';
        ctx.fillText(tr('J/Espace : jab · K : crochet · ←/→ : esquive · ↓ : garde', 'J/Space: jab · K: hook · ←/→: dodge · ↓: block'), w / 2, h - 18); ctx.restore();
      }
    }
    // speech bubble
    if (st.bubble && st.pose) {
      const b = st.bubble;
      ctx.font = '800 17px Fredoka Variable, sans-serif';
      const tw = Math.min(260, ctx.measureText(b.text).width) + 26;
      const hx = oppX + (st.pose.hx + 120) * S + tw / 2, hy = base + (HEAD_Y - 110 + st.pose.hy) * S;
      const sc = easeBack(b.t / 0.18), a = Math.min(1, (b.dur - b.t) / 0.2);
      ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.translate(Math.max(tw / 2 + 10, Math.min(w - tw / 2 - 10, hx)), Math.max(100, hy)); ctx.scale(sc, sc);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = OUT; ctx.lineWidth = 3;
      roundRect(ctx, -tw / 2, -24, tw, 44, 16); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-tw / 2 + 18, 18); ctx.lineTo(-tw / 2 - 4, 40); ctx.lineTo(-tw / 2 + 36, 18); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.fillRect(-tw / 2 + 16, 14, 22, 5);
      ctx.fillStyle = OUT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.text, 0, -2, 250);
      ctx.restore();
    }
    // comic onomatopoeia
    for (const c of st.comics) {
      if (!c.text) continue;
      const sc = c.t < 0.12 ? easeBack(c.t / 0.12) * 1.1 : 1 + (c.t - 0.12) * 0.15, a = c.t > 0.5 ? 1 - (c.t - 0.5) / 0.25 : 1;
      ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.translate(c.x, c.y - c.t * 30); ctx.rotate(c.rot); ctx.scale(sc, sc);
      ctx.font = `900 ${c.size}px Fredoka Variable, Impact, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (c.star) { const tw = ctx.measureText(c.text).width; starBurst(ctx, 0, 0, tw * 0.7 + 18, c.size * 1.05, c.color === '#fff' ? '#ffd166' : '#fff4c2'); }
      ctx.lineJoin = 'round'; ctx.lineWidth = c.size * 0.16; ctx.strokeStyle = OUT; ctx.strokeText(c.text, 0, 0);
      ctx.fillStyle = c.color; ctx.fillText(c.text, 0, 0);
      ctx.restore();
    }
    // big stamp (K.O. / TIME)
    if (st.stamp && st.stamp.t > 0.25) {
      const k = st.stamp.t - 0.25, sc = k < 0.22 ? lerp(4, 1, easeOut(k / 0.22)) : 1 + Math.sin(k * 3) * 0.02;
      if (k < 0.24 && k + 1 / 60 >= 0.22) { st.shake = 1.5; sfx.punch(); }
      ctx.save(); ctx.translate(w / 2, h * 0.42); ctx.rotate(-0.12); ctx.scale(sc, sc); ctx.globalAlpha = Math.min(1, k / 0.1);
      starBurst(ctx, 0, 0, Math.min(w * 0.42, 340), 130, st.stamp.color === '#ff1f3d' ? '#ffd166' : '#fff');
      const fs = Math.min(140, w * 0.16);
      ctx.font = `900 ${fs}px Fredoka Variable, Impact, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      ctx.lineWidth = fs * 0.22; ctx.strokeStyle = OUT; ctx.strokeText(st.stamp.text, 0, 0);
      ctx.lineWidth = fs * 0.08; ctx.strokeStyle = '#fff'; ctx.strokeText(st.stamp.text, 0, 0);
      ctx.fillStyle = st.stamp.color; ctx.fillText(st.stamp.text, 0, 0);
      if (k > 0.45) { ctx.font = `800 ${Math.round(fs * 0.22)}px Fredoka Variable, sans-serif`; ctx.lineWidth = 6; ctx.strokeStyle = OUT; ctx.strokeText(st.stamp.sub, 0, fs * 0.7); ctx.fillStyle = '#fff'; ctx.fillText(st.stamp.sub, 0, fs * 0.7); }
      ctx.restore();
    }
  }

  function drawBG(ctx: CanvasRenderingContext2D, st: FS, w: number, h: number, t: number) {
    const off = -st.viewX * 0.35, hor = h * 0.62;
    const ox = (x: number) => x + off;
    ctx.save();
    if (st.set === 'bar') {
      const wall = ctx.createLinearGradient(0, 0, 0, hor); wall.addColorStop(0, '#1a0904'); wall.addColorStop(1, '#3a170a');
      ctx.fillStyle = wall; ctx.fillRect(-w, -h, w * 3, hor + h);
      // shelves & bottles
      for (const sy of [0.26, 0.42]) {
        ctx.fillStyle = '#5a2d12'; ctx.fillRect(-w, h * sy, w * 3, 6);
        for (let i = -6; i < 30; i++) {
          const bx = ox(i * 46 + (sy > 0.3 ? 20 : 0)), bh = 34 + ((i * 7) % 5) * 6, col = ['#2dd4bf', '#f59e0b', '#84cc16', '#ef4444', '#a78bfa', '#fbbf24'][(i + (sy > 0.3 ? 3 : 0)) % 6];
          ctx.save(); glow(ctx, col, 10); ctx.fillStyle = col; ctx.globalAlpha = 0.75;
          roundRect(ctx, bx, h * sy - bh, 18, bh, 4); ctx.fill(); ctx.fillRect(bx + 6, h * sy - bh - 12, 6, 14); ctx.restore();
        }
      }
      // neon sign
      const fl = Math.sin(t * 37) > 0.93 ? 0.3 : 1;
      ctx.save(); ctx.globalAlpha = fl; glow(ctx, '#ff2d95', 28); ctx.fillStyle = '#ff7ac8'; ctx.font = `900 ${Math.round(h * 0.07)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center';
      ctx.fillText(tr('CHEZ GÉGÉ', "GARY'S BAR"), ox(w * 0.26), h * 0.15); ctx.font = `700 ${Math.round(h * 0.03)}px Fredoka Variable, sans-serif`; glow(ctx, '#22d3ee', 18); ctx.fillStyle = '#9ef3ff';
      ctx.fillText(tr('🍺 PINTE À 3€ · BAGARRE OFFERTE', '🍺 $3 PINTS · FREE BRAWLS'), ox(w * 0.26), h * 0.2); ctx.restore();
      // counter
      ctx.fillStyle = '#2a1206'; ctx.fillRect(-w, hor - h * 0.1, w * 3, h * 0.1); ctx.fillStyle = '#6b3410'; ctx.fillRect(-w, hor - h * 0.1, w * 3, 6);
      // lamps
      for (let i = 0; i < 3; i++) { const lx = ox(w * (0.18 + i * 0.32)); const cone = ctx.createLinearGradient(0, 0, 0, h); cone.addColorStop(0, 'rgba(255,200,120,.35)'); cone.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(lx - 14, 18); ctx.lineTo(lx + 14, 18); ctx.lineTo(lx + 160, h); ctx.lineTo(lx - 160, h); ctx.fill(); ctx.fillStyle = '#ffdca0'; ctx.beginPath(); ctx.arc(lx, 18, 9, 0, Math.PI * 2); ctx.fill(); }
      floor(ctx, w, h, hor, off, '#4a240e', '#2c1406', 'rgba(0,0,0,.35)');
    } else if (st.set === 'prison') {
      const wall = ctx.createLinearGradient(0, 0, 0, hor); wall.addColorStop(0, '#1c232c'); wall.addColorStop(1, '#3b4552');
      ctx.fillStyle = wall; ctx.fillRect(-w, -h, w * 3, hor + h);
      ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 1;
      for (let y = 10; y < hor; y += 26) { ctx.beginPath(); ctx.moveTo(-w, y); ctx.lineTo(w * 2, y); ctx.stroke(); for (let x = -w + ((y / 26) % 2) * 30; x < w * 2; x += 60) { ctx.beginPath(); ctx.moveTo(ox(x), y); ctx.lineTo(ox(x), y + 26); ctx.stroke(); } }
      // cells
      for (let c = -2; c < 6; c++) {
        const cx = ox(c * w * 0.28 + w * 0.05), cw = w * 0.2;
        ctx.fillStyle = '#0b0f14'; ctx.fillRect(cx, h * 0.2, cw, hor - h * 0.2);
        ctx.fillStyle = '#ff7a1a'; for (let k = 0; k < 2; k++) { const px = cx + cw * (0.3 + k * 0.4), bob = Math.abs(Math.sin(t * 6 + c * 2 + k)) * 6; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(px, h * 0.4 - bob, 11, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(px - 14, h * 0.43 - bob, 28, 40); ctx.fillRect(px - 18 + (k ? 30 : 0), h * 0.33 - bob, 6, 30); ctx.globalAlpha = 1; }
        ctx.fillStyle = '#5b6573'; for (let b = 0; b <= 7; b++) ctx.fillRect(cx + b * cw / 7 - 2, h * 0.2, 4, hor - h * 0.2);
        ctx.fillRect(cx, h * 0.2, cw, 6); ctx.fillRect(cx, h * 0.38, cw, 4);
      }
      // sign
      ctx.save(); ctx.translate(ox(w * 0.28), h * 0.13); ctx.fillStyle = '#b91c1c'; roundRect(ctx, -130, -18, 260, 34, 6); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '800 15px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(tr('INTERDIT DE SE BATTRE', 'NO FIGHTING'), 0, 0); ctx.restore();
      // fluorescent
      for (let i = 0; i < 3; i++) { const lx = ox(w * (0.2 + i * 0.3)), fl = Math.sin(t * 50 + i * 9) > 0.96 ? 0.2 : 1; ctx.save(); ctx.globalAlpha = fl; glow(ctx, '#e0f2fe', 24); ctx.fillStyle = '#f0f9ff'; ctx.fillRect(lx - 50, 4, 100, 6); ctx.restore(); const cone = ctx.createLinearGradient(0, 0, 0, h); cone.addColorStop(0, `rgba(220,240,255,${0.18 * fl})`); cone.addColorStop(1, 'rgba(220,240,255,0)'); ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(lx - 50, 10); ctx.lineTo(lx + 50, 10); ctx.lineTo(lx + 200, h); ctx.lineTo(lx - 200, h); ctx.fill(); }
      floor(ctx, w, h, hor, off, '#4b5563', '#2b313a', 'rgba(250,204,21,.5)');
    } else {
      const bg = ctx.createRadialGradient(w / 2, h * 0.3, 10, w / 2, h * 0.3, w * 0.8); bg.addColorStop(0, '#2a0f1f'); bg.addColorStop(1, '#050106');
      ctx.fillStyle = bg; ctx.fillRect(-w, -h, w * 3, h * 3);
      // crowd tiers with camera flashes
      for (let row = 0; row < 6; row++) {
        const y = h * 0.14 + row * h * 0.07;
        for (let i = -4; i < 46; i++) {
          const x = ox(i * (w / 40) + (row % 2) * 12), bob = Math.abs(Math.sin(t * 5 + i * 1.7 + row)) * (st.ending ? 8 : 3);
          ctx.fillStyle = `rgba(${60 + row * 12},${30 + row * 6},${50 + row * 8},1)`;
          ctx.beginPath(); ctx.arc(x, y - bob, 6 + row * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x - 7 - row * 0.5, y + 4 - bob, 14 + row, 14);
          if (((i * 13 + row * 7 + Math.floor(t * 9)) % 97) === 0) { ctx.save(); glow(ctx, '#fff', 20); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y - bob, 5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
        }
      }
      // spotlights
      for (let i = 0; i < 2; i++) { const lx = ox(w * (0.3 + i * 0.4)); const cone = ctx.createLinearGradient(0, 0, 0, h); cone.addColorStop(0, 'rgba(255,240,200,.28)'); cone.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(lx - 20, 0); ctx.lineTo(lx + 20, 0); ctx.lineTo(w / 2 + off + (i ? 220 : -220) + Math.sin(t * 0.7 + i) * 60, h); ctx.lineTo(w / 2 + off + (i ? -60 : 60), h); ctx.fill(); }
      // ring canvas
      const fl = ctx.createLinearGradient(0, hor, 0, h); fl.addColorStop(0, '#9fb3c8'); fl.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = fl; ctx.fillRect(-w, hor, w * 3, h);
      ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = '#1e3a8a'; ctx.font = `900 ${Math.round(h * 0.12)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.fillText('BITLIFE', ox(w / 2), h * 0.86); ctx.restore();
      // posts & ropes
      const pl = ox(w * 0.08), pr = ox(w * 0.92);
      ctx.fillStyle = '#d4d4d8'; ctx.fillRect(pl - 7, h * 0.3, 14, hor - h * 0.3 + 6); ctx.fillRect(pr - 7, h * 0.3, 14, hor - h * 0.3 + 6);
      ['#dc2626', '#f8fafc', '#2563eb'].forEach((c, i) => { const y = h * (0.34 + i * 0.09); ctx.strokeStyle = c; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-w, y + 30); ctx.lineTo(pl, y); ctx.quadraticCurveTo(w / 2 + off, y + 8, pr, y); ctx.lineTo(w * 2, y + 30); ctx.stroke(); });
    }
    // blood stains on the floor (follow parallax of the opponent)
    if (!FLAT) {
      for (const sn of st.stains) { ctx.fillStyle = family ? 'rgba(150,220,255,.35)' : 'rgba(150,0,18,.75)'; ctx.beginPath(); ctx.ellipse(sn.x + w / 2 - st.viewX, sn.y, sn.r * 1.6, sn.r * 0.55, 0, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
  }

  function floor(ctx: CanvasRenderingContext2D, w: number, h: number, hor: number, off: number, c1: string, c2: string, line: string) {
    const fg = ctx.createLinearGradient(0, hor, 0, h); fg.addColorStop(0, c2); fg.addColorStop(1, c1);
    ctx.fillStyle = fg; ctx.fillRect(-w, hor, w * 3, h);
    ctx.strokeStyle = line; ctx.lineWidth = 2;
    const vx = w / 2 + off * 1.6;
    for (let i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(vx + i * w * 0.02, hor); ctx.lineTo(vx + i * w * 0.2, h * 1.2); ctx.stroke(); }
    for (let k = 1; k < 6; k++) { const y = hor + (h - hor) * Math.pow(k / 6, 1.8); ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.moveTo(-w, y); ctx.lineTo(w * 2, y); ctx.stroke(); ctx.globalAlpha = 1; }
  }

  function drawParts(ctx: CanvasRenderingContext2D, st: FS) {
    for (const q of st.parts) {
      const a = Math.min(1, (q.max - q.life) / 0.4);
      ctx.save(); ctx.globalAlpha = Math.max(0, a);
      if (q.kind === 'blood' || q.kind === 'sweat') {
        ctx.fillStyle = q.color; const sp = Math.hypot(q.vx, q.vy), ang = Math.atan2(q.vy, q.vx);
        ctx.translate(q.x, q.y); ctx.rotate(ang); ctx.beginPath(); ctx.ellipse(0, 0, q.r + sp * 0.012, q.r * 0.8, 0, 0, Math.PI * 2); ctx.fill();
      } else if (q.kind === 'tooth') {
        ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = '#fffbea'; ctx.strokeStyle = OUT; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(-8, -9); ctx.quadraticCurveTo(0, -13, 8, -9); ctx.lineTo(7, 2); ctx.lineTo(4, 11); ctx.lineTo(1, 3); ctx.lineTo(-1, 3); ctx.lineTo(-4, 11); ctx.lineTo(-7, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
        if (!family) { ctx.fillStyle = '#d00020'; ctx.beginPath(); ctx.arc(-3, 9, 2.4, 0, Math.PI * 2); ctx.fill(); }
      } else if (q.kind === 'spark') {
        ctx.strokeStyle = q.color; glow(ctx, q.color, 10); ctx.lineWidth = q.r; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(q.x - q.vx * 0.03, q.y - q.vy * 0.03); ctx.stroke();
      } else if (q.kind === 'glass') {
        ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.color; ctx.globalAlpha *= 0.85; ctx.beginPath(); ctx.moveTo(0, -q.r); ctx.lineTo(q.r * 0.7, q.r * 0.6); ctx.lineTo(-q.r * 0.6, q.r * 0.3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(-1, -q.r * 0.5, 2, q.r * 0.5);
      } else if (q.kind === 'star') {
        const ang = q.rot + q.life * 3, cx = q.x + Math.cos(ang) * 90, cy = q.y + Math.sin(ang) * 24;
        ctx.fillStyle = q.color; glow(ctx, q.color, 12); starPath(ctx, cx, cy, q.r, q.r * 0.45, 5); ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawPlayer(ctx: CanvasRenderingContext2D, st: FS, w: number, h: number, S: number) {
    const p = st.p, gs = Math.min(w, h * 1.5), R = h * 0.135;
    const lean = st.viewX * 0.25;
    const breathe = Math.sin(st.wallT * 3.2) * 4;
    let L = { x: w / 2 - gs * 0.2 + lean, y: h - R * 0.35 + breathe, r: R, rot: 0.25 };
    let Rg = { x: w / 2 + gs * 0.2 + lean, y: h - R * 0.3 - breathe, r: R, rot: -0.25 };
    if (p.block) { L = { x: w / 2 - R * 0.72, y: h * 0.66, r: R * 1.35, rot: 0.08 }; Rg = { x: w / 2 + R * 0.72, y: h * 0.67, r: R * 1.35, rot: -0.08 }; }
    const head = { x: w / 2 - st.viewX + ((st.pose?.hx ?? 0) + st.hk.x) * S, y: h * 0.97 + (HEAD_Y + (st.pose?.hy ?? 0)) * S };
    if (p.punch) {
      const pu = p.punch;
      if (pu.kind === 'jab') {
        const k = pu.t / JAB_T, e = k < 0.42 ? easeOut(k / 0.42) : 1 - easeOut((k - 0.42) / 0.58);
        L = { x: lerp(L.x, head.x - 10, e), y: lerp(L.y, head.y + 20, e), r: lerp(R, R * 0.55, e), rot: lerp(0.25, 0, e) };
      } else {
        const k = pu.t / HOOK_T;
        if (k < 0.2) { const e = easeOut(k / 0.2); Rg = { x: Rg.x + e * R * 0.6, y: Rg.y + e * R * 0.2, r: R, rot: -0.25 - e * 0.3 }; }
        else {
          const e = k < 0.55 ? easeOut((k - 0.2) / 0.35) : 1 - easeOut((k - 0.55) / 0.45);
          const sx = Rg.x + R * 0.6, sy = Rg.y, cx2 = w / 2 + gs * 0.42, cy2 = h * 0.3, tx = head.x + 10, ty = head.y + 30;
          const bx = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * cx2 + e * e * tx, by = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * cy2 + e * e * ty;
          Rg = { x: bx, y: by, r: lerp(R, R * 0.62, e), rot: lerp(-0.55, -1.6, e) };
        }
      }
    }
    if (p.hurt > 0) { L.y += p.hurt * 40; Rg.y += p.hurt * 40; L.x -= p.hurt * 30; Rg.x += p.hurt * 30; }
    const style = st.set === 'ring' ? 'glove' : 'tape';
    const col = st.set === 'ring' ? '#e11d48' : '#ffffff';
    // the punching fist is drawn last so it passes over the other one
    const order = p.punch?.kind === 'jab' ? [[Rg, 1], [L, -1]] : [[L, -1], [Rg, 1]];
    for (const [f, side] of order as [typeof L, number][]) playerFist(ctx, f.x, f.y, f.r, f.rot, side, style, col, h);
  }

  function playerFist(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number, side: number, style: 'glove' | 'tape', col: string, h: number) {
    // forearm down to the bottom of the screen
    ctx.save();
    ctx.lineCap = 'round';
    const R0 = h * 0.135, ax = x + side * R0 * 0.9 + (x - ctx.canvas.clientWidth / 2) * 0.15, ay = h + R0 * 1.4;
    const dx = ax - x, dy = ay - y, dl = Math.hypot(dx, dy) || 1, nx = -dy / dl, ny = dx / dl, w1 = r * 0.5, w2 = R0 * 0.62;
    ctx.beginPath(); ctx.moveTo(x + nx * w1, y + ny * w1); ctx.lineTo(ax + nx * w2, ay + ny * w2); ctx.lineTo(ax - nx * w2, ay - ny * w2); ctx.lineTo(x - nx * w1, y - ny * w1); ctx.closePath();
    const ag = ctx.createLinearGradient(x + nx * w1, y + ny * w1, x - nx * w1, y - ny * w1); ag.addColorStop(0, pSkin[1]); ag.addColorStop(0.45, pSkin[0]); ag.addColorStop(1, pSkin[1]);
    ctx.fillStyle = F(ag); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.fill(); ctx.stroke();
    if (style === 'glove' && !FLAT) { ctx.fillStyle = '#f8fafc'; ctx.globalAlpha = 0.9; ctx.beginPath(); const k1 = 0.18, k2 = 0.3; ctx.moveTo(lerp(x, ax, k1) + nx * lerp(w1, w2, k1), lerp(y, ay, k1) + ny * lerp(w1, w2, k1)); ctx.lineTo(lerp(x, ax, k2) + nx * lerp(w1, w2, k2), lerp(y, ay, k2) + ny * lerp(w1, w2, k2)); ctx.lineTo(lerp(x, ax, k2) - nx * lerp(w1, w2, k2), lerp(y, ay, k2) - ny * lerp(w1, w2, k2)); ctx.lineTo(lerp(x, ax, k1) - nx * lerp(w1, w2, k1), lerp(y, ay, k1) - ny * lerp(w1, w2, k1)); ctx.fill(); ctx.globalAlpha = 1; }
    ctx.translate(x, y); ctx.rotate(rot);
    if (style === 'glove') {
      // cuff
      ctx.fillStyle = F('#f8fafc'); ctx.strokeStyle = OUT; ctx.lineWidth = 5;
      roundRect(ctx, -r * 0.55, r * 0.55, r * 1.1, r * 0.75, r * 0.2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = F('#cbd5e1'); ctx.lineWidth = 3; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-r * 0.15, r * (0.7 + i * 0.18)); ctx.lineTo(r * 0.15, r * (0.78 + i * 0.18)); ctx.stroke(); }
      const gr = ctx.createRadialGradient(-r * 0.3, -r * 0.4, r * 0.1, 0, 0, r * 1.2); gr.addColorStop(0, '#ff8aa0'); gr.addColorStop(0.4, col); gr.addColorStop(1, '#7f0a24');
      ctx.fillStyle = F(gr); ctx.strokeStyle = OUT; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.95, r * 0.85, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(-side * r * 0.75, r * 0.2, r * 0.32, r * 0.45, side * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(-r * 0.3, -r * 0.45, r * 0.35, r * 0.15, -0.4, 0, Math.PI * 2); if (!FLAT) ctx.fill();
      ctx.fillStyle = F('#fff'); ctx.font = `900 ${Math.round(r * 0.28)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; if (!FLAT) ctx.fillText('BL', 0, r * 0.1);
    } else {
      const gr = ctx.createLinearGradient(0, -r, 0, r); gr.addColorStop(0, pSkin[0]); gr.addColorStop(1, pSkin[1]);
      ctx.fillStyle = F(gr); ctx.strokeStyle = OUT; ctx.lineWidth = 5;
      roundRect(ctx, -r * 0.8, -r * 0.7, r * 1.6, r * 1.5, r * 0.45); ctx.fill(); ctx.stroke();
      // knuckles
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-r * 0.55 + i * r * 0.37, -r * 0.62, r * 0.2, Math.PI, 0); ctx.fillStyle = F(pSkin[0]); ctx.fill(); ctx.stroke(); }
      // tape
      ctx.fillStyle = F(col); ctx.globalAlpha = 0.92;
      for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(0, -r * 0.1 + i * r * 0.32); ctx.rotate(0.12 * (i % 2 ? 1 : -1)); ctx.fillRect(-r * 0.82, -r * 0.1, r * 1.64, r * 0.2); ctx.restore(); }
      ctx.globalAlpha = 1;
      // thumb
      ctx.fillStyle = F(pSkin[0]); ctx.beginPath(); ctx.ellipse(-side * r * 0.75, r * 0.15, r * 0.25, r * 0.42, side * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (!family && !FLAT && st0().dealt > 25) { ctx.fillStyle = 'rgba(200,0,24,.7)'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-r * 0.4 + i * r * 0.4, -r * 0.55, r * 0.09, 0, Math.PI * 2); ctx.fill(); } }
    }
    ctx.restore();
  }
  const st0 = () => s.current!;

  function drawBars(ctx: CanvasRenderingContext2D, st: FS, w: number, h: number, me: string) {
    const bw = Math.min(380, w * 0.38), y = 16, bh = 18;
    const bar = (x: number, v: number, ghost: number, col: string, flip: boolean, label: string, sta?: number) => {
      ctx.save();
      ctx.translate(x, y);
      if (flip) { ctx.scale(-1, 1); }
      const sk = 10;
      const path = (ww: number, hh: number, yy = 0) => { ctx.beginPath(); ctx.moveTo(sk, yy); ctx.lineTo(ww, yy); ctx.lineTo(ww - sk, yy + hh); ctx.lineTo(0, yy + hh); ctx.closePath(); };
      ctx.fillStyle = 'rgba(0,0,0,.65)'; path(bw + 8, bh + 8, -4); ctx.save(); ctx.translate(-4, 0); ctx.fill(); ctx.restore();
      ctx.fillStyle = 'rgba(255,255,255,.12)'; path(bw, bh); ctx.fill();
      ctx.fillStyle = '#fff'; path(bw * Math.max(0, ghost / 100), bh); ctx.fill();
      const gr = ctx.createLinearGradient(0, 0, 0, bh); gr.addColorStop(0, col); gr.addColorStop(1, '#00000055');
      ctx.save(); glow(ctx, col, 12); ctx.fillStyle = v < 30 && Math.sin(st.wallT * 12) > 0 ? '#ff1f3d' : col; path(bw * Math.max(0, v / 100), bh); ctx.fill(); ctx.restore();
      ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(sk, 2, bw * Math.max(0, v / 100) - sk * 1.5, 4);
      if (sta !== undefined) { ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(0, bh + 6, bw * 0.7, 6); ctx.fillStyle = sta < 20 ? '#f97316' : '#facc15'; ctx.fillRect(0, bh + 6, bw * 0.7 * sta / 100, 6); }
      ctx.restore();
      ctx.save(); ctx.font = '800 14px Fredoka Variable, sans-serif'; ctx.fillStyle = '#fff'; ctx.textAlign = flip ? 'right' : 'left'; ctx.lineWidth = 4; ctx.strokeStyle = '#000'; ctx.lineJoin = 'round';
      const ly = y + bh + (sta !== undefined ? 30 : 18);
      ctx.strokeText(label, x + (flip ? -2 : 2), ly); ctx.fillText(label, x + (flip ? -2 : 2), ly); ctx.restore();
    };
    bar(14, st.p.hp, st.p.hpShow, '#22d3ee', false, `${me}${st.p.sta < 15 ? tr(' — ESSOUFFLÉ', ' — GASSED') : ''}`, st.p.sta);
    bar(w - 14, st.o.hp, st.o.hpShow, '#ff3355', true, `« ${tr(st.name[0], st.name[1])} »`);
    // VS badge
    ctx.save(); ctx.translate(w / 2, y + 10); ctx.rotate(-0.08); ctx.font = '900 26px Fredoka Variable, Impact, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 6; ctx.strokeStyle = OUT; ctx.lineJoin = 'round'; ctx.strokeText('VS', 0, 0); ctx.fillStyle = '#ffd166'; ctx.fillText('VS', 0, 0);
    ctx.font = '800 11px Fredoka Variable, sans-serif'; ctx.lineWidth = 3; ctx.strokeText('ROUND 1', 0, 22); ctx.fillStyle = '#fff'; ctx.fillText('ROUND 1', 0, 22); ctx.restore();
  }

  function hint(ctx: CanvasRenderingContext2D, x: number, y: number, keys: string[], label: string, col: string, k: number) {
    ctx.save(); ctx.translate(x, y);
    const sc = 1 + Math.sin(st0().wallT * 22) * 0.06;
    ctx.scale(sc, sc);
    ctx.font = '900 18px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    { const lw = Math.max(ctx.measureText(label).width + 30, keys.length * 50 + 20); ctx.fillStyle = 'rgba(8,0,4,.62)'; roundRect(ctx, -lw / 2, -50, lw, 78, 14); ctx.fill(); }
    ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.lineJoin = 'round'; ctx.strokeText(label, 0, -30); ctx.fillStyle = col; ctx.fillText(label, 0, -30);
    const kw = 40, gap = 10, tot = keys.length * kw + (keys.length - 1) * gap;
    keys.forEach((kk, i) => {
      const kx = -tot / 2 + i * (kw + gap);
      ctx.fillStyle = 'rgba(0,0,0,.6)'; roundRect(ctx, kx, -12, kw, 30, 8); ctx.fill();
      ctx.save(); glow(ctx, col, 14); ctx.strokeStyle = col; ctx.lineWidth = 2.5; roundRect(ctx, kx, -14, kw, 30, 8); ctx.stroke(); ctx.restore();
      ctx.fillStyle = '#fff'; ctx.font = '900 18px Fredoka Variable, sans-serif'; ctx.fillText(kk, kx + kw / 2, 1);
    });
    // timer ring under keys
    ctx.fillStyle = col; ctx.fillRect(-tot / 2, 20, tot * Math.max(0, 1 - k), 3);
    ctx.restore();
  }

  // ─── the thug ───
  function drawThug(ctx: CanvasRenderingContext2D, L: Look, P: Pose, st: FS, t: number) {
    const dmg = 1 - st.o.hp / 100;
    ctx.save();
    ctx.translate(P.x, P.y); ctx.rotate(P.rot);
    // ground shadow
    if (!FLAT) { ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(0, 60, 230, 40, 0, 0, Math.PI * 2); ctx.fill(); }
    const bw = 150, wb = 98 + L.belly * 42;
    const torso = () => {
      ctx.beginPath(); ctx.moveTo(-46, -338);
      ctx.quadraticCurveTo(-104, -328, -bw, -292); ctx.quadraticCurveTo(-bw - 24, -250, -bw + 6, -168);
      ctx.quadraticCurveTo(-wb - L.belly * 28, -70, -wb, 20); ctx.lineTo(-wb, 90); ctx.lineTo(wb, 90); ctx.lineTo(wb, 20);
      ctx.quadraticCurveTo(wb + L.belly * 28, -70, bw - 6, -168); ctx.quadraticCurveTo(bw + 24, -250, bw, -292); ctx.quadraticCurveTo(104, -328, 46, -338); ctx.closePath();
    };
    const skinG = ctx.createLinearGradient(-bw, 0, bw, 0); skinG.addColorStop(0, L.skinD); skinG.addColorStop(0.4, L.skin); skinG.addColorStop(1, L.skinD);
    // neck
    ctx.fillStyle = F(L.skinD); ctx.strokeStyle = OUT; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-48, -380); ctx.lineTo(48, -380); ctx.lineTo(54, -320); ctx.lineTo(-54, -320); ctx.closePath(); ctx.fill(); ctx.stroke();
    torso(); ctx.fillStyle = F(skinG); ctx.fill();
    ctx.save(); torso(); ctx.clip();
    if (L.shirt === 'none' && !FLAT) {
      ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-115, -215); ctx.quadraticCurveTo(-55, -180, -6, -212); ctx.moveTo(115, -215); ctx.quadraticCurveTo(55, -180, 6, -212); ctx.stroke();
      if (L.belly < 0.35) for (let r = 0; r < 3; r++) { ctx.beginPath(); ctx.moveTo(-30, -150 + r * 42); ctx.quadraticCurveTo(-15, -140 + r * 42, -4, -150 + r * 42); ctx.moveTo(30, -150 + r * 42); ctx.quadraticCurveTo(15, -140 + r * 42, 4, -150 + r * 42); ctx.stroke(); }
      ctx.fillStyle = 'rgba(120,40,40,.5)'; for (const nx of [-62, 62]) { ctx.beginPath(); ctx.arc(nx, -192, 5, 0, Math.PI * 2); ctx.fill(); }
      if (L.tattoo) { ctx.save(); ctx.translate(-70, -245); ctx.rotate(-0.15); ctx.fillStyle = '#1e3a8a'; ctx.globalAlpha = 0.6; heart(ctx, 0, 0, 22); ctx.fill(); ctx.font = '800 11px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e0e7ff'; ctx.fillText(tr('MAMAN', 'MOM'), 0, 2); ctx.restore(); }
    }
    const shirtCut = L.belly > 0.7 && L.shirt !== 'jumpsuit' ? -45 : 200; // short shirt: belly hangs out
    if (L.shirt !== 'none') {
      ctx.fillStyle = F(L.shirtC);
      ctx.beginPath();
      if (L.shirt === 'tank') { ctx.moveTo(-98, -340); ctx.lineTo(-70, -340); ctx.quadraticCurveTo(0, -215, 70, -340); ctx.lineTo(98, -340); ctx.quadraticCurveTo(108, -240, 150, -185); ctx.lineTo(220, -185); ctx.lineTo(220, shirtCut); ctx.lineTo(-220, shirtCut); ctx.lineTo(-220, -185); ctx.lineTo(-150, -185); ctx.quadraticCurveTo(-108, -240, -98, -340); }
      else { ctx.moveTo(-220, -400); ctx.lineTo(-52, -400); ctx.lineTo(-52, -335); ctx.quadraticCurveTo(0, L.shirt === 'jumpsuit' ? -250 : -300, 52, -335); ctx.lineTo(52, -400); ctx.lineTo(220, -400); ctx.lineTo(220, shirtCut); ctx.lineTo(-220, shirtCut); }
      ctx.closePath(); ctx.fill();
      if (!FLAT) {
        ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(60, -400, 200, 600); ctx.fillRect(-260, -400, 150, 600);
        if (L.shirt === 'jumpsuit') { ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -260); ctx.lineTo(0, 90); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fillRect(40, -250, 70, 34); ctx.fillStyle = '#111'; ctx.font = '900 22px Fredoka Variable, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(L.shirtTxt, 75, -232); }
        else if (L.shirtTxt) { ctx.save(); ctx.translate(0, -140); ctx.rotate(-0.04); ctx.font = '900 28px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = L.shirtC === '#f4f4f5' || L.shirtC === '#facc15' ? '#1f2937' : '#fff'; ctx.fillText(L.shirtTxt, 0, 0); ctx.restore(); }
        // beer stains
        ctx.fillStyle = 'rgba(120,70,10,.35)'; for (const [bx, by, br] of [[-40, -90, 20], [-22, -72, 12], [55, -40, 15], [64, -24, 7]]) { ctx.beginPath(); ctx.ellipse(bx, by, br, br * 0.8, 0.4, 0, Math.PI * 2); ctx.fill(); }
      }
      if (shirtCut < 0 && !FLAT) { ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-220, shirtCut); ctx.lineTo(220, shirtCut); ctx.stroke(); ctx.fillStyle = L.skinD; ctx.beginPath(); ctx.ellipse(0, 20, 6, 9, 0, 0, Math.PI * 2); ctx.fill(); }
    }
    // pants / shorts
    ctx.fillStyle = F(L.pants); ctx.fillRect(-260, 30, 520, 100);
    if (!FLAT) { ctx.fillStyle = st.set === 'ring' ? '#fff' : '#3b2314'; ctx.fillRect(-260, 30, 520, st.set === 'ring' ? 18 : 12); if (st.set === 'bar') { ctx.fillStyle = '#facc15'; roundRect(ctx, -26, 24, 52, 26, 5); ctx.fill(); ctx.fillStyle = '#7c2d12'; ctx.font = '900 12px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('BEER', 0, 42); } }
    ctx.restore();
    torso(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
    if (L.chain && !FLAT) { ctx.save(); glow(ctx, '#ffd166', 10); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 6; ctx.setLineDash([7, 4]); ctx.beginPath(); ctx.moveTo(-52, -335); ctx.quadraticCurveTo(0, -235, 52, -335); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#fbbf24'; ctx.font = '900 30px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('$', 0, -258); ctx.restore(); }
    // head
    ctx.save();
    ctx.translate(P.hx + st.hk.x, HEAD_Y + P.hy + st.hk.y); ctx.rotate(P.hr + st.hk.r); const hs = Math.max(0.5, P.hs + st.hk.s * 0.1) * 1.22; ctx.scale(hs, hs);
    drawHead(ctx, L, P, st, t, dmg);
    ctx.restore();
    // arms + fists (closest fist on top)
    const order = P.f[0].r > P.f[1].r ? [1, 0] : [0, 1];
    for (const i of order) drawArm(ctx, L, P.f[i], i === 0 ? -1 : 1, P);
    // special item
    if (P.item > 0.05) drawItem(ctx, st, (P.f[0].x + P.f[1].x) / 2, (P.f[0].y + P.f[1].y) / 2 - 20, P.item);
    ctx.restore();
  }

  function drawArm(ctx: CanvasRenderingContext2D, L: Look, f: Fist, sd: number, P: Pose) {
    void P;
    const sx = sd * 128, sy = -282;
    const ex = sx + sd * 50 + (f.x - sx) * 0.3, ey = (sy + f.y) / 2 + 70;
    const fw = Math.min(f.r * 1.15, 52 + (f.r - 46) * 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const seg = (x1: number, y1: number, x2: number, y2: number, wd: number, c: string) => { ctx.strokeStyle = F(OUT); ctx.lineWidth = wd + 12; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.strokeStyle = F(c); ctx.lineWidth = wd; ctx.stroke(); };
    seg(sx, sy, ex, ey, 70, L.skin);
    if (L.shirt === 'tee' || L.shirt === 'jumpsuit') seg(sx, sy, lerp(sx, ex, 0.5), lerp(sy, ey, 0.5), 76, L.shirtC);
    else if (!FLAT) { ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(sx - sd * 8, sy - 6); ctx.lineTo(ex - sd * 12, ey - 6); ctx.stroke(); }
    if (L.tattoo && sd > 0 && !FLAT && L.shirt !== 'tee' && L.shirt !== 'jumpsuit') { ctx.save(); ctx.translate(lerp(sx, ex, 0.6), lerp(sy, ey, 0.6)); ctx.fillStyle = 'rgba(30,58,138,.65)'; heart(ctx, 0, 0, 16); ctx.fill(); ctx.restore(); }
    seg(ex, ey, f.x, f.y, fw, L.skin);
    // fist
    ctx.save(); ctx.translate(f.x, f.y);
    if (f.glow > 0.02 && !FLAT) {
      const gr = ctx.createRadialGradient(0, 0, f.r * 0.5, 0, 0, f.r * 2.4); gr.addColorStop(0, `rgba(255,220,90,${f.glow})`); gr.addColorStop(0.35, `rgba(255,90,30,${0.8 * f.glow})`); gr.addColorStop(0.7, `rgba(255,20,40,${0.35 * f.glow})`); gr.addColorStop(1, 'rgba(255,0,0,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, f.r * 2.4, 0, Math.PI * 2); ctx.fill();
      if (f.r < 80) { ctx.save(); ctx.strokeStyle = `rgba(255,240,150,${f.glow})`; ctx.lineWidth = 4; glow(ctx, '#ff7a1a', 20);
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + st0().wallT * 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * f.r * 1.3, Math.sin(a) * f.r * 1.3); ctx.lineTo(Math.cos(a) * f.r * (1.6 + f.glow * 0.5), Math.sin(a) * f.r * (1.6 + f.glow * 0.5)); ctx.stroke(); }
      ctx.restore(); }
    }
    const r = f.r;
    if (L.gloves) {
      const gr = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r * 1.1); gr.addColorStop(0, '#ffffff88'); gr.addColorStop(0.25, L.gloves); gr.addColorStop(1, '#00000088');
      ctx.fillStyle = F(L.gloves); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      if (!FLAT) { ctx.fillStyle = gr; ctx.fill(); } ctx.stroke();
      ctx.fillStyle = F(L.gloves); ctx.beginPath(); ctx.ellipse(sd * r * 0.75, r * 0.2, r * 0.3, r * 0.42, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else {
      ctx.fillStyle = F(L.skin); ctx.strokeStyle = OUT; ctx.lineWidth = 6;
      roundRect(ctx, -r * 0.95, -r * 0.85, r * 1.9, r * 1.7, r * 0.5); ctx.fill(); ctx.stroke();
      ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-r * 0.5 + i * r * 0.5, -r * 0.8); ctx.lineTo(-r * 0.5 + i * r * 0.5, -r * 0.1); ctx.stroke(); }
      if (L.brass && !FLAT) { ctx.save(); glow(ctx, '#ffd166', 8); ctx.fillStyle = '#e5b33a'; roundRect(ctx, -r * 0.95, -r * 0.6, r * 1.9, r * 0.36, r * 0.15); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
      if (st0().set === 'prison' && !FLAT) { ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(-r * 0.95, r * 0.25, r * 1.9, r * 0.3); }
    }
    if (!FLAT) { ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.beginPath(); ctx.ellipse(-r * 0.35, -r * 0.45, r * 0.3, r * 0.14, -0.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }

  function drawItem(ctx: CanvasRenderingContext2D, st: FS, x: number, y: number, sc: number) {
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.strokeStyle = OUT; ctx.lineWidth = 5;
    if (st.set === 'bar') {
      ctx.rotate(0.5);
      ctx.fillStyle = F('#3f8f47'); roundRect(ctx, -24, -60, 48, 110, 12); ctx.fill(); ctx.stroke();
      ctx.fillRect(-10, -100, 20, 44); ctx.strokeRect(-10, -100, 20, 44);
      if (!FLAT) { ctx.fillStyle = '#fef3c7'; ctx.fillRect(-22, -20, 44, 34); ctx.fillStyle = '#b91c1c'; ctx.font = '900 12px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(tr('BIÈRE', 'BEER'), 0, 2); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(-16, -54, 6, 90); }
    } else if (st.set === 'prison') {
      ctx.fillStyle = F('#9ca3af'); roundRect(ctx, -110, -60, 220, 120, 14); ctx.fill(); ctx.stroke();
      if (!FLAT) { ctx.fillStyle = '#6b7280'; roundRect(ctx, -96, -46, 90, 92, 10); ctx.fill(); roundRect(ctx, 6, -46, 90, 40, 10); ctx.fill(); roundRect(ctx, 6, 2, 90, 44, 10); ctx.fill(); ctx.fillStyle = '#e7e2c8'; ctx.beginPath(); ctx.arc(-50, 0, 30, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#65a30d'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(30 + (i % 3) * 16, -32 + Math.floor(i / 3) * 8, 6, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#7c2d12'; ctx.fillRect(20, 12, 60, 24); }
    } else {
      ctx.fillStyle = F('#9ca3af'); ctx.fillRect(-80, -70, 160, 90); ctx.strokeRect(-80, -70, 160, 90);
      ctx.fillStyle = F('#6b7280'); ctx.fillRect(-80, 20, 14, 90); ctx.fillRect(66, 20, 14, 90); ctx.fillRect(-80, 30, 160, 12);
      if (!FLAT) { ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-70, -62, 140, 10); }
    }
    ctx.restore();
  }

  function drawHead(ctx: CanvasRenderingContext2D, L: Look, P: Pose, st: FS, t: number, dmg: number) {
    const hw = 62, jw = 60 * L.jaw;
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.lineJoin = 'round';
    // hair behind
    if (L.hair === 'afro') { ctx.fillStyle = F(L.hairC); ctx.beginPath(); for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; ctx.arc(Math.cos(a) * 82, -60 + Math.sin(a) * 70, 34, 0, Math.PI * 2); } ctx.fill(); }
    if (L.hair === 'mullet') { ctx.fillStyle = F(L.hairC); ctx.beginPath(); ctx.moveTo(-hw - 8, -40); ctx.quadraticCurveTo(-hw - 30, 60, -hw - 10, 110); ctx.lineTo(hw + 10, 110); ctx.quadraticCurveTo(hw + 30, 60, hw + 8, -40); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    if (P.glowHead > 0.02 && !FLAT) { const gr = ctx.createRadialGradient(0, -20, 40, 0, -20, 170); gr.addColorStop(0, `rgba(255,90,30,${0.85 * P.glowHead})`); gr.addColorStop(1, 'rgba(255,0,0,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, -20, 170, 0, Math.PI * 2); ctx.fill(); }
    // ears
    ctx.fillStyle = F(L.skinD); ctx.beginPath(); ctx.ellipse(-hw - 4, -8, 15, 24, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(hw + 4, -8, 15, 24, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // skull + jaw
    const head = () => { ctx.beginPath(); ctx.moveTo(-hw, -20); ctx.bezierCurveTo(-hw, -128, hw, -128, hw, -20); ctx.lineTo(jw, 42); ctx.quadraticCurveTo(jw, 84, 0, 86); ctx.quadraticCurveTo(-jw, 84, -jw, 42); ctx.closePath(); };
    const sg = ctx.createRadialGradient(-22, -50, 10, 0, 0, 130); sg.addColorStop(0, L.skin); sg.addColorStop(1, L.skinD);
    head(); ctx.fillStyle = F(sg); ctx.fill();
    ctx.save(); head(); ctx.clip();
    if (!FLAT) {
      if (L.beard === 'stubble' || L.beard === 'full') { ctx.fillStyle = L.beard === 'full' ? L.hairC : `${L.hairC}55`; ctx.beginPath(); ctx.moveTo(-jw - 10, 0); ctx.quadraticCurveTo(-jw + 6, 34, -34, 30); ctx.quadraticCurveTo(0, 18, 34, 30); ctx.quadraticCurveTo(jw - 6, 34, jw + 10, 0); ctx.lineTo(jw + 10, 120); ctx.lineTo(-jw - 10, 120); ctx.closePath(); ctx.fill(); }
      // bruises grow with damage
      if (dmg > 0.15) { ctx.fillStyle = `rgba(110,40,160,${Math.min(0.6, (dmg - 0.15) * 1.2)})`; ctx.beginPath(); ctx.ellipse(26, -18, 26, 20, 0, 0, Math.PI * 2); ctx.fill(); }
      if (dmg > 0.45) { ctx.fillStyle = `rgba(110,40,160,${Math.min(0.5, (dmg - 0.45) * 1.3)})`; ctx.beginPath(); ctx.ellipse(-34, 30, 20, 16, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(18, -140, 120, 260);
    }
    // hair on top
    ctx.fillStyle = F(L.hairC);
    if (L.hair === 'buzz' || L.hair === 'mullet') { ctx.globalAlpha = L.hair === 'buzz' ? 0.75 : 1; ctx.beginPath(); ctx.moveTo(-hw - 2, -30); ctx.bezierCurveTo(-hw, -140, hw, -140, hw + 2, -30); ctx.quadraticCurveTo(0, -84, -hw - 2, -30); ctx.fill(); ctx.globalAlpha = 1; }
    if (L.hair === 'bald' && !FLAT) { ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(-18, -92, 22, 9, -0.3, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    head(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
    if (L.hair === 'mohawk') { ctx.fillStyle = F(L.hairC === '#d4d4d4' ? '#22c55e' : '#ec4899'); ctx.beginPath(); ctx.moveTo(-16, -96); for (let i = 0; i < 5; i++) { const y0 = -96 + i * 0; ctx.lineTo(-14 + i * 7, y0 - 60 - (i % 2) * 18); ctx.lineTo(-10 + i * 7, y0); } ctx.lineTo(16, -96); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    if (L.hair === 'cap') { ctx.fillStyle = F(L.capC); ctx.beginPath(); ctx.moveTo(-hw - 4, -44); ctx.bezierCurveTo(-hw, -140, hw, -140, hw + 4, -44); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(-10, -46, 92, 14, 0.06, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); if (!FLAT) { ctx.fillStyle = '#fff'; ctx.font = '900 18px Fredoka Variable, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(tr('PSG', 'NYC'), 0, -70); } }
    // ── face ──
    const ey = -20;
    const f = P.face;
    ctx.lineCap = 'round';
    // brows
    ctx.strokeStyle = F(L.hairC === '#d4d4d4' ? '#555' : L.hairC); ctx.lineWidth = 11;
    if (f === 'hurt' || f === 'dizzy' || f === 'ko') { ctx.beginPath(); ctx.moveTo(-10, ey - 24); ctx.lineTo(-44, ey - 14); ctx.moveTo(10, ey - 24); ctx.lineTo(44, ey - 14); ctx.stroke(); }
    else if (f === 'laugh') { ctx.beginPath(); ctx.moveTo(-12, ey - 26); ctx.quadraticCurveTo(-28, ey - 36, -44, ey - 26); ctx.moveTo(12, ey - 26); ctx.quadraticCurveTo(28, ey - 36, 44, ey - 26); ctx.stroke(); }
    else { const d = f === 'grin' ? 6 : 0; ctx.beginPath(); ctx.moveTo(-8, ey - 12 + d); ctx.lineTo(-46, ey - 30); ctx.moveTo(8, ey - 12 + d); ctx.lineTo(46, ey - 30); ctx.stroke(); }
    if (L.scar && !FLAT) { ctx.strokeStyle = '#9f1239'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(30, ey - 40); ctx.lineTo(40, ey + 2); ctx.stroke(); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(29 + i * 4, ey - 30 + i * 11); ctx.lineTo(39 + i * 4, ey - 33 + i * 11); ctx.stroke(); } }
    // eyes
    ctx.lineWidth = 4; ctx.strokeStyle = OUT;
    for (const sx of [-26, 26]) {
      if (f === 'ko') { ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sx - 9, ey - 9); ctx.lineTo(sx + 9, ey + 9); ctx.moveTo(sx + 9, ey - 9); ctx.lineTo(sx - 9, ey + 9); ctx.stroke(); continue; }
      if (f === 'dizzy') { ctx.lineWidth = 3; ctx.beginPath(); for (let a = 0; a < 12; a += 0.4) { const rr = a * 1.1; ctx.lineTo(sx + Math.cos(a + t * 8 * (sx > 0 ? 1 : -1)) * rr, ey + Math.sin(a + t * 8 * (sx > 0 ? 1 : -1)) * rr); } ctx.stroke(); continue; }
      if (f === 'hurt') { ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sx - 10 * Math.sign(sx), ey - 7); ctx.lineTo(sx + 6 * Math.sign(sx), ey); ctx.lineTo(sx - 10 * Math.sign(sx), ey + 7); ctx.stroke(); continue; }
      if (f === 'laugh') { ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(sx, ey + 4, 9, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); continue; }
      ctx.fillStyle = F('#fff'); ctx.beginPath(); ctx.ellipse(sx, ey, 13, f === 'grin' ? 8 : 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
      if (f === 'grin' && !FLAT) { ctx.save(); glow(ctx, '#ff2a2a', 16); ctx.fillStyle = '#ff2a2a'; ctx.beginPath(); ctx.arc(sx, ey, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      else { ctx.fillStyle = F(OUT); ctx.beginPath(); ctx.arc(sx + (sx > 0 ? -3 : 3), ey + 1, 4.5, 0, Math.PI * 2); ctx.fill(); }
    }
    if (dmg > 0.3 && !FLAT && f !== 'ko') { ctx.fillStyle = 'rgba(110,40,160,.5)'; ctx.beginPath(); ctx.ellipse(26, ey + 2, 18, 12 + dmg * 6, 0, 0, Math.PI * 2); ctx.fill(); }
    // nose
    ctx.fillStyle = F(L.skinD); ctx.strokeStyle = OUT; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(0, 10, 16 + dmg * 4, 19, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (!FLAT) {
      ctx.fillStyle = OUT; for (const nx of [-6, 6]) { ctx.beginPath(); ctx.arc(nx, 20, 3, 0, Math.PI * 2); ctx.fill(); }
      if (dmg > 0.12 && !family) { ctx.strokeStyle = '#c0001a'; ctx.lineWidth = 4; const dl = 8 + dmg * 26 + Math.sin(t * 2) * 2; ctx.beginPath(); ctx.moveTo(-6, 22); ctx.lineTo(-7, 22 + dl); ctx.stroke(); ctx.fillStyle = '#c0001a'; ctx.beginPath(); ctx.arc(-7, 22 + dl, 3.2, 0, Math.PI * 2); ctx.fill(); }
      if (L.bandage) { ctx.save(); ctx.rotate(-0.5); ctx.fillStyle = '#f5e6c8'; ctx.fillRect(-20, 0, 40, 10); ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 1.5; ctx.strokeRect(-20, 0, 40, 10); ctx.restore(); }
    }
    // mustache
    if (L.beard === 'mustache' || L.beard === 'full') { ctx.fillStyle = F(L.hairC); ctx.beginPath(); ctx.moveTo(0, 30); ctx.quadraticCurveTo(-30, 22, -44, 44); ctx.quadraticCurveTo(-24, 36, 0, 40); ctx.quadraticCurveTo(24, 36, 44, 44); ctx.quadraticCurveTo(30, 22, 0, 30); ctx.fill(); }
    // mouth
    const my = 50;
    const teeth = (x0: number, w0: number, y0: number, hh: number) => {
      const tw = w0 / 8;
      for (let i = 0; i < 8; i++) { ctx.fillStyle = st.teeth[i] ? F('#fffbea') : F('#2a0505'); ctx.fillRect(x0 + i * tw, y0, tw, hh); ctx.strokeStyle = OUT; ctx.lineWidth = 1.5; ctx.strokeRect(x0 + i * tw, y0, tw, hh); }
    };
    ctx.strokeStyle = OUT; ctx.lineWidth = 4;
    if (f === 'angry' || f === 'grin') {
      const mw = f === 'grin' ? 70 : 52, mh = f === 'grin' ? 22 : 15;
      ctx.fillStyle = F('#3b0a0a'); roundRect(ctx, -mw / 2, my - mh / 2, mw, mh, 6); ctx.fill();
      ctx.save(); roundRect(ctx, -mw / 2, my - mh / 2, mw, mh, 6); ctx.clip(); teeth(-mw / 2, mw, my - mh / 2, mh * 0.5); teeth(-mw / 2, mw, my, mh * 0.5); ctx.restore();
      roundRect(ctx, -mw / 2, my - mh / 2, mw, mh, 6); ctx.stroke();
    } else if (f === 'laugh') {
      ctx.fillStyle = F('#3b0a0a'); ctx.beginPath(); ctx.moveTo(-36, my - 8); ctx.quadraticCurveTo(0, my + 50, 36, my - 8); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.clip(); teeth(-36, 72, my - 8, 10); if (!FLAT) { ctx.fillStyle = '#e8687a'; ctx.beginPath(); ctx.ellipse(0, my + 24, 18, 10, 0, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); ctx.stroke();
    } else {
      const o = f === 'ko' ? 1.2 : 1;
      ctx.fillStyle = F('#3b0a0a'); ctx.beginPath(); ctx.ellipse(f === 'dizzy' ? 6 : 0, my + 4, 20 * o, 16 * o, f === 'dizzy' ? 0.3 : 0, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.clip(); teeth(-22 * o, 44 * o, my - 14 * o, 8); if (!FLAT) { ctx.fillStyle = '#e8687a'; ctx.beginPath(); ctx.ellipse(4, my + 16 * o, 12, 9, 0, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); ctx.stroke();
      if (f === 'ko' && !FLAT) { ctx.fillStyle = family ? '#9be7ff' : '#c0001a'; ctx.beginPath(); ctx.moveTo(12, my + 14); ctx.quadraticCurveTo(18, my + 40, 14, my + 50); ctx.quadraticCurveTo(8, my + 40, 12, my + 14); ctx.fill(); }
    }
    if (L.beard === 'goatee') { ctx.fillStyle = F(L.hairC); ctx.beginPath(); ctx.moveTo(-14, my + 18); ctx.lineTo(14, my + 18); ctx.lineTo(4, my + 46); ctx.lineTo(-4, my + 46); ctx.closePath(); ctx.fill(); }
    // sweat drops when tired
    if (dmg > 0.25 && !FLAT) { const k = (t * 1.3) % 1; ctx.fillStyle = 'rgba(180,230,255,.85)'; ctx.beginPath(); ctx.ellipse(hw - 4, -60 + k * 50, 5, 8, 0, 0, Math.PI * 2); ctx.fill(); }
    // dizzy stars
    if (P.stars > 0.05 && !FLAT) { for (let i = 0; i < 4; i++) { const a = t * 4 + (i / 4) * Math.PI * 2; ctx.save(); ctx.globalAlpha = P.stars; glow(ctx, '#ffd166', 10); ctx.fillStyle = i % 2 ? '#ffd166' : '#fff'; starPath(ctx, Math.cos(a) * 90, -110 + Math.sin(a) * 20, 13, 6, 5); ctx.fill(); ctx.restore(); } }
  }

  const setName = { bar: tr('Baston au bar', 'Bar brawl'), prison: tr('Baston en taule', 'Prison brawl'), ring: tr('Match de boxe', 'Boxing match') }[s.current.set];
  const icon = { bar: '🍺', prison: '⛓️', ring: '🥊' }[s.current.set];
  return (
    <Arena g={g} title={setName} icon={icon} theme="blood" scoreLabel={tr('POINTS', 'POINTS')}
      howTo={tr(`Face à toi : « ${s.current.name[0]} ». Quand son poing (ou sa tête) s'illumine, esquive du côté opposé ou garde ↓. Esquive réussie = il est ouvert : enchaîne jabs et crochets ! Les objets ⚠ ne se bloquent pas. Mets-le K.O. avant la fin des ${DURATION} s.`,
        `Your opponent: "${s.current.name[1]}". When his fist (or head) lights up, dodge away or block ↓. A clean dodge leaves him wide open: chain jabs and hooks! ⚠ objects can't be blocked. Knock him out within ${DURATION}s.`)}
      keys={['← → ' + tr('esquive', 'dodge'), '↓ ' + tr('garde', 'block'), 'J / Space = jab', 'K = ' + tr('crochet', 'hook')]}>
      <canvas class="play" ref={canvas} style={{ touchAction: 'none', pointerEvents: 'auto' }}
        onPointerDown={(e) => {
          const c = e.currentTarget as HTMLCanvasElement; const r = c.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          if (x < 0.22) startDodge(-1); else if (x > 0.78) startDodge(1);
          else if (y > 0.72) ptr.current.block = true;
          else startPunch(x < 0.5 ? 'jab' : 'hook');
        }}
        onPointerUp={() => { ptr.current.block = false; }} onPointerLeave={() => { ptr.current.block = false; }} />
    </Arena>
  );
}

function starBurst(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, col: string) {
  ctx.save(); ctx.translate(x, y);
  ctx.beginPath();
  const n = 14;
  for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, k = i % 2 ? 0.72 : 1 + ((i * 7) % 3) * 0.06; ctx.lineTo(Math.cos(a) * rx * k, Math.sin(a) * ry * k); }
  ctx.closePath(); ctx.fillStyle = col; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.fill(); ctx.stroke();
  ctx.restore();
}
function starPath(ctx: CanvasRenderingContext2D, x: number, y: number, r1: number, r2: number, n: number) {
  ctx.beginPath(); for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? r2 : r1; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath();
}
function heart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath(); ctx.moveTo(x, y + s * 0.35); ctx.bezierCurveTo(x - s, y - s * 0.3, x - s * 0.4, y - s, x, y - s * 0.4); ctx.bezierCurveTo(x + s * 0.4, y - s, x + s, y - s * 0.3, x, y + s * 0.35); ctx.closePath();
}
