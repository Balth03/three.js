// High-roller blackjack: green felt, dealt & flipped cards, chip stacks, a snarky dealer, 3 hands in a row.
// Result semantics match the old Blackjack: g.end(score, stats, netLocalMoney) — the controller feeds `extra` to gamble().
import { useRef } from 'preact/hooks';
import { country, formatMoney, type CountryDef } from '@bl/sim';
import { content } from '@bl/data';
import { useGame, useCanvas, useKeys, Arena, tr, glow, roundRect, type GameProps } from './kit.tsx';
import { sfx, synth } from '../../audio.ts';
import { lang } from '../../state.ts';

const HANDS = 3;
const SUIT = ['♠', '♥', '♦', '♣'];
const RANK = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RED = (c: number) => { const s = Math.floor(c / 13) % 4; return s === 1 || s === 2; };
// pip layouts for 2..10 (normalised x, y inside the card)
const PIPS: Record<number, [number, number][]> = {
  2: [[0.5, 0.2], [0.5, 0.8]],
  3: [[0.5, 0.2], [0.5, 0.5], [0.5, 0.8]],
  4: [[0.3, 0.2], [0.7, 0.2], [0.3, 0.8], [0.7, 0.8]],
  5: [[0.3, 0.2], [0.7, 0.2], [0.5, 0.5], [0.3, 0.8], [0.7, 0.8]],
  6: [[0.3, 0.2], [0.7, 0.2], [0.3, 0.5], [0.7, 0.5], [0.3, 0.8], [0.7, 0.8]],
  7: [[0.3, 0.2], [0.7, 0.2], [0.5, 0.35], [0.3, 0.5], [0.7, 0.5], [0.3, 0.8], [0.7, 0.8]],
  8: [[0.3, 0.2], [0.7, 0.2], [0.5, 0.35], [0.3, 0.5], [0.7, 0.5], [0.5, 0.65], [0.3, 0.8], [0.7, 0.8]],
  9: [[0.3, 0.2], [0.7, 0.2], [0.3, 0.4], [0.7, 0.4], [0.5, 0.5], [0.3, 0.6], [0.7, 0.6], [0.3, 0.8], [0.7, 0.8]],
  10: [[0.3, 0.2], [0.7, 0.2], [0.5, 0.3], [0.3, 0.4], [0.7, 0.4], [0.3, 0.6], [0.7, 0.6], [0.5, 0.7], [0.3, 0.8], [0.7, 0.8]],
};
const CHIP = [
  { col: '#d62839', rim: '#fff', label: '5%' },
  { col: '#15161c', rim: '#ffd166', label: '15%' },
  { col: '#7b2cbf', rim: '#f8e1ff', label: '40%' },
];
type L = [string, string];
const Q: Record<string, L[]> = {
  bet: [['Faites vos jeux. Ou vos dettes.', 'Place your bets. Or your debts.'], ['Mise, chéri. La maison a faim.', 'Bet, darling. The house is hungry.'], ['Ton banquier regarde. Il pleure.', 'Your banker is watching. He\'s crying.']],
  bust: [['Sauté ! Comme ton mariage.', 'Bust! Just like your marriage.'], ['22. Presque. Comme toute ta vie.', '22. Almost. Like your whole life.'], ['Merci pour le don, mon chou.', 'Thanks for the donation, sweetie.']],
  bj: [['Blackjack… t\'as triché, avoue.', 'Blackjack… you cheated, admit it.'], ['Putain. Bien joué.', 'Damn. Well played.']],
  dbust: [['Bon. Prends ton fric et casse-toi.', 'Fine. Take your cash and get lost.'], ['J\'ai sauté. Le patron va me virer.', 'I busted. The boss will fire me.']],
  lose: [['La maison gagne toujours, mon chou.', 'The house always wins, sweetie.'], ['Merci, ça paiera mon yacht.', 'Thanks, that\'ll pay for my yacht.'], ['Tu veux un mouchoir ? 5 € le mouchoir.', 'Want a tissue? $5 a tissue.']],
  win: [['Profite. Ça ne durera pas.', 'Enjoy it. It won\'t last.'], ['Grr. Encore un coup de chance.', 'Grr. Another lucky shot.']],
  push: [['Égalité. Personne ne baise personne.', 'Push. Nobody screws anybody.'], ['Match nul. Ennuyeux.', 'A draw. Boring.']],
  double: [['Doubler ? T\'as des couilles ou des dettes ?', 'Double? Got balls or got debts?'], ['Oh, un flambeur !', 'Oh, a high roller!']],
  brave: [['Courageux. Ou débile.', 'Brave. Or stupid.'], ['Sur 17 ? T\'es sérieux ?', 'Hit on 17? Seriously?']],
  hit: [['Une carte pour monsieur/madame.', 'A card for the gambler.'], ['Encore ? Gourmand.', 'Another? Greedy.']],
};

interface Spr { c: number; x: number; y: number; tx?: number; ty?: number; rot: number; trot: number; flip: number; up: boolean; fs: number; out?: boolean }
interface Chip { x: number; y: number; sx: number; sy: number; tx: number; ty: number; t: number; d: number; ci: number }
interface Btn { id: string; x: number; y: number; w: number; h: number; on: boolean }
type Ph = 'wait' | 'bet' | 'deal' | 'player' | 'dealer' | 'result' | 'over';

function hv(cs: number[]) {
  let v = 0, a = 0;
  for (const c of cs) { const r = c % 13; if (r === 0) { a++; v += 11; } else v += Math.min(10, r + 1); }
  while (v > 21 && a) { v -= 10; a--; }
  return { v, soft: a > 0 && v <= 21 };
}

let feltPat: CanvasPattern | null = null;
function felt(ctx: CanvasRenderingContext2D) {
  if (feltPat) return feltPat;
  try {
    const c = document.createElement('canvas'); c.width = c.height = 96;
    const x = c.getContext('2d')!;
    for (let i = 0; i < 900; i++) { x.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.07)'; x.fillRect(Math.random() * 96, Math.random() * 96, 1, 1); }
    feltPat = ctx.createPattern(c, 'repeat');
  } catch { /* ignore */ }
  return feltPat;
}

export function Blackjack2({ onDone, l }: GameProps) {
  const g = useGame({ onDone });
  const gr = useRef(g); gr.current = g;
  const cfg = useRef<{ c: CountryDef | null; min: number } | null>(null);
  if (!cfg.current) {
    let c: CountryDef | null = null;
    try { c = country(content, l.country); } catch { c = null; }
    cfg.current = { c, min: c ? Math.max(1, Math.round(10 * c.price * c.currency.rate)) : 10 };
  }
  const fmt = (n: number) => { const c = cfg.current!.c; try { return c ? formatMoney(n, c, lang.value) : `${Math.round(n)}`; } catch { return `${Math.round(n)}`; } };
  const start = Math.max(0, Math.floor(l.money || 0));
  const s = useRef({
    ph: 'wait' as Ph, hand: 0, bank: start, net: 0, total: 0, bet: 0, betChips: 0, wins: 0, losses: 0, pushes: 0, bjs: 0, doubled: 0, best: 0,
    shoe: [] as number[], pl: [] as Spr[], dl: [] as Spr[], gone: [] as Spr[], chips: [] as Chip[], q: [] as { at: number; f: () => void }[], clock: 0,
    quip: Q.bet[0] as L, quipT: 0, banner: null as null | { text: string; sub: string; col: string; t: number; bj?: boolean }, btns: [] as Btn[], mx: -1, my: -1,
    dShown: 0, discarded: 0, ended: false, table: null as HTMLCanvasElement | null, tableKey: '', results: [] as number[], dealerBounce: 0, lay: { w: 0, h: 0, T: 0, cw: 0, ch: 0 },
  });
  if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__bj = s.current;
  const pct = (x: number, y: number): [number, number] => {
    const r = cref.current?.getBoundingClientRect();
    if (!r) return [50, 50];
    return [((r.left + x) / window.innerWidth) * 100, ((r.top + y) / window.innerHeight) * 100];
  };
  const say = (k: string) => { const a = Q[k]; if (!a) return; s.current.quip = a[Math.floor(Math.random() * a.length)]; s.current.quipT = 0; sfx.blips(s.current.quip[0]); };
  const after = (sec: number, f: () => void) => s.current.q.push({ at: s.current.clock + sec, f });
  const draw1 = () => {
    const st = s.current;
    if (st.shoe.length < 15) st.shoe = Array.from({ length: 104 }, (_, i) => i % 52).sort(() => Math.random() - 0.5);
    return st.shoe.pop()!;
  };
  const bets = () => { const st = s.current; return [0.05, 0.15, 0.4].map((f) => Math.max(cfg.current!.min, Math.round(st.bank * f))); };
  const deal = (to: 'p' | 'd', up = true) => {
    const st = s.current, L = st.lay;
    const sh = shoePos(L.w, L.h, L.T);
    const sp: Spr = { c: draw1(), x: sh.x, y: sh.y, rot: -0.6, trot: (Math.random() - 0.5) * 0.08, flip: 0, up, fs: 4.5 };
    (to === 'p' ? st.pl : st.dl).push(sp);
    sfx.card();
  };
  const pv = () => hv(s.current.pl.map((p) => p.c));
  const dv = () => hv(s.current.dl.map((p) => p.c));

  const finishGame = () => {
    const st = s.current;
    if (st.ended) return;
    st.ended = true; st.ph = 'over';
    const score = st.total > 0 ? 0.5 + st.net / (2 * st.total) : 0.5;
    const n = Math.round(st.net);
    gr.current.end(score, [
      [tr('Bilan', 'Net result'), `${n > 0 ? '+' : ''}${fmt(n)}`],
      [tr('Mains gagnées', 'Hands won'), `${st.wins} / ${st.results.length}${st.pushes ? tr(` (${st.pushes} égalité)`, ` (${st.pushes} push)`) : ''}`],
      [tr('Total misé', 'Total wagered'), fmt(st.total)],
      [tr('Blackjacks', 'Blackjacks'), st.bjs ? `🃏 × ${st.bjs}` : '—'],
      [tr('Bankroll finale', 'Final bankroll'), fmt(st.bank)],
    ], n);
  };

  const toBet = () => {
    const st = s.current;
    if (st.ended) return;
    // sweep cards to the discard pile
    for (const c of [...st.pl, ...st.dl]) { c.out = true; c.up = false; c.fs = 6; st.gone.push(c); }
    st.pl = []; st.dl = []; st.banner = null; st.bet = 0; st.betChips = 0; st.dShown = 0;
    if (st.hand >= HANDS) { finishGame(); return; }
    if (st.bank < cfg.current!.min) {
      st.banner = { text: tr('FAUCHÉ', 'BROKE'), sub: tr('La sécurité te raccompagne.', 'Security walks you out.'), col: '#ff4d6d', t: 0 };
      sfx.bad(); after(1.6, finishGame); st.ph = 'deal'; return;
    }
    st.ph = 'bet'; say('bet');
    if (st.gone.length) sfx.whoosh();
  };

  const placeBet = (i: number) => {
    const st = s.current;
    if (st.ph !== 'bet') return;
    const amt = bets()[i];
    if (amt > st.bank) { sfx.miss(); return; }
    st.bet = amt; st.ph = 'deal';
    const L = st.lay;
    const n = [3, 6, 10][i];
    for (let k = 0; k < n; k++) st.chips.push({ x: 0, y: 0, sx: L.w / 2 + (i - 1) * L.cw * 1.5, sy: L.h * 0.53, tx: L.w / 2, ty: L.h * 0.8, t: -k * 0.04, d: 0.35, ci: i });
    for (let k = 0; k < n; k++) synth.tone(2400 + Math.random() * 600, 0.03, 'square', 0.04, 0.05 + k * 0.04);
    after(0.35 + n * 0.04, () => { st.betChips = n; });
    const b = st.hand;
    after(0.45, () => deal('p'));
    after(0.75, () => deal('d'));
    after(1.05, () => deal('p'));
    after(1.35, () => deal('d', false));
    after(1.9, () => {
      if (st.hand !== b) return;
      const p = pv().v, dd = dv().v;
      const up = st.dl[0]?.c % 13;
      if (p === 21) { gr.current.float('BLACKJACK !', ...pct(L.w / 2, L.h * 0.45), '#ffd166', true); revealThenSettle(true); }
      else if ((up === 0 || up >= 9) && dd === 21) { st.banner = { text: tr('LE CROUPIER REGARDE…', 'DEALER PEEKS…'), sub: '', col: '#fff', t: 0 }; revealThenSettle(true); }
      else { st.ph = 'player'; }
    });
  };

  const revealThenSettle = (noDraw = false) => {
    const st = s.current;
    st.ph = 'dealer';
    after(0.45, () => {
      const hole = st.dl[1];
      if (hole) { hole.up = true; hole.fs = 1.7; }
      for (let i = 0; i < 9; i++) synth.noise(0.05, 0.06, 1400, i * 0.05);
      synth.tone(180, 0.5, 'sine', 0.12, 0.45, 0.6);
    });
    let t = 1.35;
    const step = () => {
      const p = pv().v;
      if (!noDraw && p <= 21 && dv().v < 17) {
        after(t, () => { deal('d'); synth.kick(); st.dealerBounce = 1; });
        // re-evaluate after the card lands
        after(t + 0.01, () => { t = 0.85; step(); });
        return;
      }
      after(t, settle);
    };
    step();
  };

  const settle = () => {
    const st = s.current, L = st.lay, G = gr.current;
    const mine = st.pl.map((p) => p.c);
    const mv = hv(mine).v, dvv = dv().v, b = st.bet;
    let net = 0, key = 'lose';
    const natural = mv === 21 && mine.length === 2;
    const dNatural = dvv === 21 && st.dl.length === 2;
    if (mv > 21) { net = -b; key = 'bust'; }
    else if (natural && !dNatural) { net = Math.round(b * 1.5); key = 'bj'; }
    else if (dvv > 21 || mv > dvv) { net = b; key = dvv > 21 ? 'dbust' : 'win'; }
    else if (mv === dvv) { net = 0; key = 'push'; }
    else { net = -b; key = 'lose'; }
    st.net += net; st.total += b; st.bank += net; st.results.push(net); st.hand++;
    say(key);
    const [cx, cy] = pct(L.w / 2, L.h * 0.42);
    const money = `${net > 0 ? '+' : ''}${fmt(net)}`;
    if (key === 'bj') {
      st.bjs++; st.wins++;
      st.banner = { text: 'BLACKJACK !', sub: money, col: '#ffd166', t: 0, bj: true };
      G.hit('perfect'); G.add(500); G.flash('#ffd166'); G.shake();
      for (let i = 0; i < 6; i++) setTimeout(() => G.burst(20 + Math.random() * 60, 25 + Math.random() * 40, ['#ffd166', '#ff5bd1', '#06d6a0', '#fff'][i % 4], 26), i * 120);
      sfx.cash(); [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => synth.tone(f, 0.3, 'triangle', 0.09, i * 0.08));
    } else if (net > 0) {
      st.wins++;
      st.banner = { text: key === 'dbust' ? tr('LE CROUPIER SAUTE !', 'DEALER BUSTS!') : tr('GAGNÉ !', 'YOU WIN!'), sub: money, col: '#06d6a0', t: 0 };
      G.hit('good'); G.add(st.bet >= bets()[2] ? 300 : 150); G.burst(cx, cy, '#06d6a0', 30); sfx.coin(); setTimeout(() => sfx.cash(), 250);
    } else if (net === 0) {
      st.pushes++;
      st.banner = { text: tr('ÉGALITÉ', 'PUSH'), sub: tr('Mise rendue', 'Bet returned'), col: '#b8c0ff', t: 0 };
      sfx.pop();
    } else {
      st.losses++;
      st.banner = { text: key === 'bust' ? tr('SAUTÉ !', 'BUST!') : tr('LA BANQUE GAGNE', 'DEALER WINS'), sub: money, col: '#ff4d6d', t: 0 };
      G.miss(); G.flash('#ff1f3d'); sfx.bad();
    }
    st.best = Math.max(st.best, net);
    // chip animation: winnings fly in from the dealer, losses fly away
    const n = st.betChips;
    if (net > 0) {
      const extraN = Math.min(14, Math.max(2, Math.round(n * (net / b))));
      for (let k = 0; k < extraN; k++) st.chips.push({ x: 0, y: 0, sx: L.w / 2 - Math.min(L.w * 0.48, L.h * 1.02) * 0.38, sy: L.T + L.h * 0.05, tx: L.w / 2 + 34, ty: L.h * 0.8, t: -0.3 - k * 0.05, d: 0.5, ci: 1 + (k % 2) });
      after(0.3 + extraN * 0.05 + 0.5, () => { st.betChips = n + extraN; });
    } else if (net < 0) {
      st.betChips = 0;
      for (let k = 0; k < n; k++) st.chips.push({ x: 0, y: 0, sx: L.w / 2, sy: L.h * 0.8, tx: L.w / 2 - Math.min(L.w * 0.48, L.h * 1.02) * 0.38, ty: L.T + L.h * 0.05, t: -0.25 - k * 0.04, d: 0.45, ci: CHIPIDX(st, b) });
    }
    st.ph = 'result';
    after(2.8, () => { if (st.ph === 'result') toBet(); });
  };
  const CHIPIDX = (st: typeof s.current, b: number) => { void st; const bs = bets(); return b >= bs[2] ? 2 : b >= bs[1] ? 1 : 0; };

  const act = (id: string) => {
    const st = s.current, G = gr.current;
    if (id.startsWith('bet')) { placeBet(+id.slice(3)); return; }
    if (id === 'quit' && st.ph === 'bet') { sfx.click(); finishGame(); return; }
    if (id === 'next' && st.ph === 'result') { st.q = st.q.filter(() => false); toBet(); return; }
    if (st.ph !== 'player') return;
    const p = pv().v;
    if (id === 'hit') {
      if (p >= 17) say('brave'); else if (Math.random() < 0.4) say('hit');
      deal('p');
      sfx.click();
      st.ph = 'deal';
      after(0.45, () => {
        const v = pv().v;
        if (v > 21) { const L = st.lay; G.shake(); G.float(`${v} 💥`, ...pct(L.w / 2, L.h * 0.45), '#ff4d6d', true); revealThenSettle(true); }
        else if (v === 21) { revealThenSettle(); }
        else st.ph = 'player';
      });
    } else if (id === 'stand') {
      sfx.click(); revealThenSettle();
    } else if (id === 'double') {
      if (st.pl.length !== 2 || st.bet * 2 > st.bank) { sfx.miss(); return; }
      say('double'); st.doubled++;
      const L = st.lay;
      st.bet *= 2;
      const n = st.betChips;
      for (let k = 0; k < n; k++) st.chips.push({ x: 0, y: 0, sx: L.w * 0.2, sy: L.h * 1.05, tx: L.w / 2 + 34, ty: L.h * 0.8, t: -k * 0.03, d: 0.35, ci: CHIPIDX(st, st.bet / 2) });
      after(0.4 + n * 0.03, () => { st.betChips = n * 2; });
      synth.tone(330, 0.2, 'square', 0.06); synth.tone(495, 0.25, 'square', 0.06, 0.1);
      G.float(tr('DOUBLE !', 'DOUBLE!'), ...pct(L.w / 2, L.h * 0.7), '#ffd166', true);
      st.ph = 'deal';
      after(0.35, () => { deal('p'); const last = st.pl[st.pl.length - 1]; if (last) last.trot = Math.PI / 2; });
      after(0.9, () => { const v = pv().v; if (v > 21) { G.shake(); revealThenSettle(true); } else revealThenSettle(); });
    }
  };

  useKeys((e) => {
    if (g.phase !== 'play' || e.repeat) return;
    const st = s.current;
    const k = e.code;
    if (k === 'KeyH') act('hit');
    else if (k === 'KeyS') act('stand');
    else if (k === 'KeyD') act('double');
    else if (k === 'Digit1' || k === 'Numpad1') act('bet0');
    else if (k === 'Digit2' || k === 'Numpad2') act('bet1');
    else if (k === 'Digit3' || k === 'Numpad3') act('bet2');
    else if (k === 'KeyX') act('quit');
    else if ((k === 'Space' || k === 'Enter') && st.ph === 'result') act('next');
  });

  const cref = useCanvas((ctx, w, h, dt, t) => {
    const st = s.current;
    const playing = g.phase === 'play';
    const T = Math.round(h * 0.03);
    const cw = Math.round(Math.min(Math.max(w * 0.085, Math.min(w * 0.17, h * 0.11)), h * 0.17, 112)), ch = Math.round(cw * 1.4);
    st.lay = { w, h, T, cw, ch };
    if (playing) {
      st.clock += dt; st.quipT += dt;
      if (st.ph === 'wait') toBet();
      const due = st.q.filter((a) => a.at <= st.clock);
      st.q = st.q.filter((a) => a.at > st.clock);
      for (const a of due) { try { a.f(); } catch { /* never throw */ } }
    }
    if (st.banner) st.banner.t += dt;
    st.dealerBounce = Math.max(0, st.dealerBounce - dt * 3);

    // ── background & table (cached) ──
    ctx.clearRect(0, 0, w, h);
    const rx = Math.min(w * 0.48, h * 1.02), cx = w / 2;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const tk = `${w}x${h}x${dpr}`;
    if (st.tableKey !== tk || !st.table) { st.table = renderTable(w, h, T, cw, ch, dpr); st.tableKey = tk; }
    ctx.drawImage(st.table, 0, 0, w, h);
    // twinkling lights
    for (let i = 0; i < 6; i++) {
      const bx = ((i * 211.7 + 60) % w), by = h * 0.15 + ((i * 137) % (h * 0.7));
      if (Math.abs(bx - cx) < rx * 0.9) continue;
      ctx.fillStyle = `rgba(255,${200 + (i * 7) % 50},110,${0.04 + 0.03 * Math.sin(t * 0.9 + i * 2)})`;
      ctx.beginPath(); ctx.arc(bx, by, 26 + (i * 13) % 30, 0, Math.PI * 2); ctx.fill();
    }

    // dealer medallion + speech bubble
    const mdX = cx, mdY = T + h * 0.065 - st.dealerBounce * 6, mdR = Math.min(h * 0.055, 34);
    ctx.save(); glow(ctx, '#ffd166', 18); ctx.fillStyle = '#2b1606'; ctx.beginPath(); ctx.arc(mdX, mdY, mdR, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#fff'; ctx.font = `${mdR * 1.25}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🤵', mdX, mdY + 2);
    if (playing || g.phase === 'done') {
      const qt = st.quip[lang.value === 'fr' ? 0 : 1];
      const k = Math.min(1, st.quipT * 6);
      const fs = Math.max(11, Math.min(15, h * 0.024));
      ctx.font = `600 ${fs}px Fredoka Variable, sans-serif`;
      const lines = wrap(ctx, qt, Math.min(w * 0.24, 260));
      const bw = Math.max(...lines.map((x) => ctx.measureText(x).width)) + 22, bh = lines.length * fs * 1.25 + 14;
      const bx = mdX + mdR + 14, by = mdY - bh / 2;
      ctx.save(); ctx.globalAlpha = k; ctx.translate(bx, by + bh / 2); ctx.scale(0.8 + 0.2 * k, 0.8 + 0.2 * k); ctx.translate(-bx, -(by + bh / 2));
      ctx.fillStyle = 'rgba(255,248,231,.95)'; roundRect(ctx, bx, by, bw, bh, 10); ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx + 2, mdY - 6); ctx.lineTo(bx - 9, mdY); ctx.lineTo(bx + 2, mdY + 6); ctx.fill();
      ctx.fillStyle = '#2b1606'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      lines.forEach((ln, i) => ctx.fillText(ln, bx + 11, by + 7 + i * fs * 1.25));
      ctx.restore();
    }

    // bet circle & chip stack
    const bcX = cx, bcY = h * 0.8, bcR = Math.min(h * 0.06, 40);
    ctx.save();
    ctx.strokeStyle = st.ph === 'bet' ? `rgba(255,209,102,${0.6 + 0.4 * Math.sin(t * 5)})` : 'rgba(233,196,106,.75)';
    ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bcX, bcY, bcR, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(bcX, bcY, bcR - 6, 0, Math.PI * 2); ctx.stroke();
    if (!st.betChips) { ctx.fillStyle = 'rgba(233,196,106,.7)'; ctx.font = `700 ${Math.max(10, bcR * 0.32)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(tr('MISE', 'BET'), bcX, bcY); }
    ctx.restore();
    const crad = bcR * 0.62;
    if (st.betChips) {
      const ci = CHIPIDX(st, st.bet);
      const n = Math.min(st.betChips, 24);
      const col1 = Math.min(n, 12), col2 = n - col1;
      for (let k = 0; k < col1; k++) chip3d(ctx, bcX - (col2 ? crad * 0.55 : 0), bcY + crad * 0.3 - k * crad * 0.16, crad, ci);
      for (let k = 0; k < col2; k++) chip3d(ctx, bcX + crad * 0.75, bcY + crad * 0.45 - k * crad * 0.16, crad, (ci + 1) % 3);
      if (st.bet) {
        ctx.font = `800 ${Math.max(11, h * 0.024)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffd166'; glow(ctx, '#000', 6); ctx.fillText(fmt(st.bet), bcX + bcR + 12, bcY); ctx.shadowBlur = 0;
      }
    }

    // ── cards ──
    const handLayout = (arr: Spr[], y: number) => arr.forEach((c, i) => {
      const n = arr.length; const sp = cw * 0.7;
      const tx = cx + (i - (n - 1) / 2) * sp, ty = y + (i - (n - 1) / 2) * 2;
      const k = Math.min(1, dt * 11);
      c.tx = tx; c.ty = ty;
      c.x += (tx - c.x) * k; c.y += (ty - c.y) * k; c.rot += (c.trot - c.rot) * k;
    });
    handLayout(st.dl, T + h * 0.27);
    handLayout(st.pl, h * 0.54);
    const dpos = discardPos(w, h, T);
    for (let i = st.gone.length - 1; i >= 0; i--) {
      const c = st.gone[i]; const k = Math.min(1, dt * 7);
      c.tx = dpos.x; c.ty = dpos.y;
      c.x += (dpos.x - c.x) * k; c.y += (dpos.y - c.y) * k; c.rot += (0.5 - c.rot) * k;
      if (Math.abs(c.x - dpos.x) < 4 && Math.abs(c.y - dpos.y) < 4 && c.flip < 0.05) { st.gone.splice(i, 1); st.discarded++; }
    }
    // discard pile
    for (let i = 0; i < Math.min(8, Math.ceil(st.discarded / 2)); i++) drawCard(ctx, { c: 0, x: dpos.x + i * 0.8, y: dpos.y - i * 1.6, rot: 0.5 + ((i * 37) % 7 - 3) * 0.02, trot: 0, flip: 0, up: false, fs: 0 }, cw, ch);
    const all = [...st.gone, ...st.dl, ...st.pl];
    for (const c of all) {
      const near = c.out || Math.hypot((c.tx ?? c.x) - c.x, (c.ty ?? c.y) - c.y) < 30;
      const target = c.up && near ? 1 : 0;
      c.flip += Math.sign(target - c.flip) * Math.min(Math.abs(target - c.flip), dt * c.fs);
      drawCard(ctx, c, cw, ch);
    }
    // totals
    const badge = (x: number, y: number, txt: string, col: string) => {
      ctx.save(); ctx.font = `800 ${Math.max(12, h * 0.028)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const bw = ctx.measureText(txt).width + 20, bh = Math.max(22, h * 0.045);
      glow(ctx, col, 14); ctx.fillStyle = 'rgba(8,20,12,.85)'; roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, bh / 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = col; ctx.fillText(txt, x, y + 1); ctx.restore();
    };
    if (st.pl.length) {
      const v = pv(); const last = st.pl[st.pl.length - 1];
      const txt = v.soft && v.v < 21 ? `${v.v - 10} / ${v.v}` : String(v.v);
      const col = v.v > 21 ? '#ff4d6d' : v.v === 21 ? '#ffd166' : '#fff';
      badge(last.x + cw * 0.5 + 34, h * 0.54 - ch * 0.38, txt, col);
    }
    if (st.dl.length) {
      const revealed = st.dl.every((c) => c.up && c.flip > 0.5);
      const v = revealed ? dv().v : hv([st.dl[0].c]).v;
      st.dShown += (v - st.dShown) * Math.min(1, dt * 8);
      const last = st.dl[st.dl.length - 1];
      badge(last.x + cw * 0.5 + 34, T + h * 0.27 - ch * 0.38, revealed ? String(Math.round(st.dShown)) : `${v} + ?`, revealed && v > 21 ? '#ff4d6d' : '#fff');
    }

    // flying chips
    for (let i = st.chips.length - 1; i >= 0; i--) {
      const c = st.chips[i]; c.t += dt;
      if (c.t < 0) continue;
      const k = Math.min(1, c.t / c.d), e = 1 - Math.pow(1 - k, 3);
      c.x = c.sx + (c.tx - c.sx) * e; c.y = c.sy + (c.ty - c.sy) * e - Math.sin(k * Math.PI) * h * 0.12;
      chip3d(ctx, c.x, c.y, crad, c.ci);
      if (k >= 1) { st.chips.splice(i, 1); synth.tone(2600 + Math.random() * 800, 0.025, 'square', 0.035); }
    }

    // ── interactive UI ──
    st.btns = [];
    const hover = (b: Btn) => st.mx >= b.x && st.mx <= b.x + b.w && st.my >= b.y && st.my <= b.y + b.h;
    if (playing && st.ph === 'bet') {
      const bs = bets(); const r = Math.min(cw * 0.55, 52);
      bs.forEach((amt, i) => {
        const x = cx + (i - 1) * cw * 1.5, y = h * 0.53;
        const on = amt <= st.bank;
        const b: Btn = { id: `bet${i}`, x: x - r, y: y - r, w: r * 2, h: r * 2 + 40, on };
        st.btns.push(b);
        const hv2 = on && hover(b);
        ctx.save(); ctx.globalAlpha = on ? 1 : 0.3;
        const bob = Math.sin(t * 3 + i) * 3 - (hv2 ? 6 : 0);
        // stack under the top chip
        for (let k = 3; k >= 1; k--) chip3d(ctx, x, y + bob + k * r * 0.12, r * 0.98, i, true);
        if (hv2) glow(ctx, '#ffd166', 30);
        chipTop(ctx, x, y + bob, r, i, CHIP[i].label);
        ctx.shadowBlur = 0;
        ctx.font = `800 ${Math.max(12, h * 0.026)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillStyle = '#fff'; ctx.fillText(fmt(amt), x, y + r + 14);
        ctx.font = `700 ${Math.max(10, h * 0.018)}px Fredoka Variable, sans-serif`; ctx.fillStyle = 'rgba(255,255,255,.6)';
        ctx.fillText(`[${i + 1}]`, x, y + r + 14 + h * 0.034);
        ctx.restore();
      });
      ctx.font = `800 ${Math.max(14, h * 0.032)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffd166'; glow(ctx, '#ffd166', 12); ctx.fillText(tr('CHOISIS TA MISE', 'PLACE YOUR BET'), cx, h * 0.53 - r - h * 0.05); ctx.shadowBlur = 0;
    }
    // side buttons (bottom right)
    const bw = Math.min(200, Math.max(150, w * 0.2)), bh = Math.max(34, Math.min(46, h * 0.07)), bx = w - bw - 16;
    const defs: { id: string; label: string; key: string; col: string; on: boolean }[] = [];
    if (playing && st.ph === 'player') {
      defs.push({ id: 'hit', label: tr('CARTE', 'HIT'), key: 'H', col: '#06d6a0', on: true });
      defs.push({ id: 'stand', label: tr('RESTER', 'STAND'), key: 'S', col: '#ffd166', on: true });
      defs.push({ id: 'double', label: tr('DOUBLER', 'DOUBLE'), key: 'D', col: '#ff5bd1', on: st.pl.length === 2 && st.bet * 2 <= st.bank });
    } else if (playing && st.ph === 'bet') {
      defs.push({ id: 'quit', label: tr('QUITTER', 'LEAVE'), key: 'X', col: '#9aa0b5', on: true });
    } else if (playing && st.ph === 'result') {
      defs.push({ id: 'next', label: st.hand >= HANDS ? tr('BILAN', 'RESULTS') : tr('MAIN SUIVANTE', 'NEXT HAND'), key: '␣', col: '#4cc9f0', on: true });
    }
    defs.forEach((d, i) => {
      const y = h - 16 - (defs.length - i) * (bh + 10);
      const b: Btn = { id: d.id, x: bx, y, w: bw, h: bh, on: d.on };
      st.btns.push(b);
      const hv2 = d.on && hover(b);
      ctx.save(); ctx.globalAlpha = d.on ? 1 : 0.35;
      const lift = hv2 ? -3 : 0;
      ctx.fillStyle = 'rgba(0,0,0,.5)'; roundRect(ctx, bx, y + 4, bw, bh, bh / 2); ctx.fill();
      const gg = ctx.createLinearGradient(0, y, 0, y + bh); gg.addColorStop(0, shade(d.col, 0.25)); gg.addColorStop(1, shade(d.col, -0.25));
      if (hv2) glow(ctx, d.col, 22);
      ctx.fillStyle = gg; roundRect(ctx, bx, y + lift, bw, bh, bh / 2); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,.25)'; roundRect(ctx, bx + 6, y + lift + 3, bw - 12, bh * 0.4, bh * 0.2); ctx.fill();
      let lfs = Math.max(13, bh * 0.38);
      ctx.font = `800 ${lfs}px Fredoka Variable, sans-serif`;
      const avail = bw - bh * 0.6 - 26;
      const lw = ctx.measureText(d.label).width; if (lw > avail) { lfs *= avail / lw; ctx.font = `800 ${lfs}px Fredoka Variable, sans-serif`; }
      ctx.fillStyle = '#12051f'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(d.label, bx + 8 + bh * 0.6 + (bw - 8 - bh * 0.6) / 2, y + lift + bh / 2 + 1);
      ctx.fillStyle = 'rgba(0,0,0,.3)'; roundRect(ctx, bx + 8, y + lift + bh * 0.2, bh * 0.6, bh * 0.6, 6); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = `800 ${Math.max(11, bh * 0.3)}px Fredoka Variable, sans-serif`; ctx.fillText(d.key, bx + 8 + bh * 0.3, y + lift + bh / 2 + 1);
      ctx.restore();
    });

    // bankroll panel (bottom left)
    {
      const px = 16, pw = Math.min(230, w * 0.26), ph = Math.max(84, h * 0.15), py = h - ph - 16;
      ctx.save(); ctx.fillStyle = 'rgba(10,6,2,.78)'; roundRect(ctx, px, py, pw, ph, 14); ctx.fill(); ctx.strokeStyle = 'rgba(212,160,23,.6)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      const fs = Math.max(10, Math.min(13, h * 0.02));
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = `700 ${fs}px Fredoka Variable, sans-serif`; ctx.fillText('BANKROLL', px + 14, py + 10);
      ctx.fillStyle = '#ffd166'; ctx.font = `800 ${fs * 1.8}px Fredoka Variable, sans-serif`; ctx.fillText(fmt(st.bank), px + 14, py + 10 + fs * 1.3);
      const net = Math.round(st.net);
      ctx.fillStyle = net > 0 ? '#06d6a0' : net < 0 ? '#ff4d6d' : 'rgba(255,255,255,.6)'; ctx.font = `700 ${fs}px Fredoka Variable, sans-serif`;
      ctx.fillText(`${tr('Bilan', 'Net')} ${net > 0 ? '+' : ''}${fmt(net)}`, px + 14, py + 14 + fs * 3.3);
      // hand pips
      for (let i = 0; i < HANDS; i++) {
        const r = st.results[i]; const x = px + pw - 18 - (HANDS - 1 - i) * 20, y = pw < 200 ? py + ph - 14 : py + 18;
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = r === undefined ? (i === st.hand ? `rgba(255,209,102,${0.6 + 0.4 * Math.sin(t * 6)})` : 'rgba(255,255,255,.18)') : r > 0 ? '#06d6a0' : r < 0 ? '#ff4d6d' : '#b8c0ff';
        ctx.fill();
      }
      ctx.restore();
    }

    // result banner
    if (st.banner) {
      const b = st.banner; const k = Math.min(1, b.t / 0.35);
      const pop = k < 1 ? 0.4 + 0.75 * easeOutBack(k) : 1 + Math.sin(b.t * 4) * 0.02;
      // after a beat, the banner shrinks to the side so the cards stay readable
      const m = Math.max(0, Math.min(1, (b.t - 1.3) / 0.35)), me = m * m * (3 - 2 * m);
      const sc = pop * (1 - 0.45 * me);
      const bxp = cx + (cx - rx * 0.62 - cx) * me;
      const y = h * 0.415 + me * h * 0.03;
      ctx.save(); ctx.translate(bxp, y); ctx.scale(sc, sc);
      if (b.bj) {
        ctx.save(); ctx.rotate(b.t * 0.6); ctx.globalAlpha = 0.25;
        for (let i = 0; i < 16; i++) { ctx.rotate(Math.PI / 8); ctx.fillStyle = i % 2 ? '#ffd166' : '#ff5bd1'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w * 0.5, -24); ctx.lineTo(w * 0.5, 24); ctx.fill(); }
        ctx.restore();
      }
      const fs = Math.max(26, Math.min(64, h * 0.09));
      ctx.font = `900 ${fs}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const tw = ctx.measureText(b.text).width;
      const fit = Math.min(1, (w * 0.94) / (tw + 60)); ctx.scale(fit, fit);
      ctx.fillStyle = 'rgba(0,0,0,.6)'; roundRect(ctx, -tw / 2 - 30, -fs * 0.75, tw + 60, fs * (b.sub ? 2.05 : 1.5), 18); ctx.fill();
      ctx.strokeStyle = b.col; ctx.lineWidth = 3; ctx.stroke();
      glow(ctx, b.col, 30); ctx.fillStyle = b.col; ctx.fillText(b.text, 0, 0);
      ctx.shadowBlur = 0; ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.strokeText(b.text, 0, 0);
      if (b.sub) { ctx.font = `800 ${fs * 0.45}px Fredoka Variable, sans-serif`; ctx.fillStyle = '#fff'; ctx.fillText(b.sub, 0, fs * 0.8); }
      ctx.restore();
    }
  }, true);

  const onDown = (e: PointerEvent) => {
    if (g.phase !== 'play') return;
    const st = s.current; const x = e.offsetX, y = e.offsetY;
    st.mx = x; st.my = y;
    const b = st.btns.find((b) => b.on && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
    if (b) act(b.id);
    else if (st.ph === 'result') act('next');
  };
  return (
    <Arena g={g} title="Blackjack" icon="🃏" theme="casino" scoreLabel={tr('POINTS', 'POINTS')}
      howTo={tr(`3 mains au casino. Mise 5 %, 15 % ou 40 % de ton fric, approche-toi de 21 sans dépasser. Le croupier reste à 17. Blackjack payé 3 contre 2. Mise mini : ${fmt(cfg.current.min)}.`, `3 hands at the casino. Bet 5%, 15% or 40% of your cash, get close to 21 without going over. Dealer stands on 17. Blackjack pays 3 to 2. Minimum bet: ${fmt(cfg.current.min)}.`)}
      keys={[tr('1 2 3 = mise', '1 2 3 = bet'), tr('H = carte', 'H = hit'), tr('S = rester', 'S = stand'), tr('D = doubler', 'D = double')]}>
      <canvas class="play" ref={cref} onPointerDown={onDown} onPointerMove={(e) => { s.current.mx = e.offsetX; s.current.my = e.offsetY; }} style={{ cursor: 'pointer', touchAction: 'none' }} />
    </Arena>
  );
}

// ───────────────────────── drawing helpers ─────────────────────────
function renderTable(w: number, h: number, T: number, cw: number, ch: number, dpr: number): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.round(w * dpr)); cv.height = Math.max(1, Math.round(h * dpr));
  const ctx = cv.getContext('2d'); if (!ctx) return cv;
  ctx.scale(dpr, dpr);
  const bg = ctx.createRadialGradient(w / 2, h * 0.3, 10, w / 2, h * 0.4, w * 0.8);
  bg.addColorStop(0, '#2a1606'); bg.addColorStop(1, '#070302');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  const rx = Math.min(w * 0.48, h * 1.02), ry = h * 0.93, cx = w / 2;
  const half = (ox: number, oy: number) => { ctx.beginPath(); ctx.moveTo(cx - rx - ox, T - oy); ctx.lineTo(cx + rx + ox, T - oy); ctx.ellipse(cx, T, rx + ox, ry + ox, 0, 0, Math.PI); ctx.closePath(); };
  // rail
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14;
  half(22, 22);
  const wood = ctx.createLinearGradient(0, T, 0, T + ry + 22);
  wood.addColorStop(0, '#3a1a08'); wood.addColorStop(0.5, '#6b3410'); wood.addColorStop(1, '#2a1004');
  ctx.fillStyle = wood; ctx.fill();
  ctx.restore();
  half(14, 14); ctx.strokeStyle = 'rgba(255,200,140,.14)'; ctx.lineWidth = 6; ctx.stroke();
  half(2, 2); ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 3; ctx.stroke();
  // felt
  half(0, 0);
  const fg = ctx.createRadialGradient(cx, h * 0.45, 20, cx, h * 0.45, rx);
  fg.addColorStop(0, '#1d8a4e'); fg.addColorStop(0.6, '#106b39'); fg.addColorStop(1, '#063d20');
  ctx.fillStyle = fg; ctx.fill();
  const pat = felt(ctx); if (pat) { ctx.fillStyle = pat; ctx.fill(); }
  // inner shadow along the rail
  ctx.save(); half(0, 0); ctx.clip();
  ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; half(30, 30); ctx.lineWidth = 60; ctx.strokeStyle = '#000'; ctx.stroke();
  ctx.restore();
  // printed band & texts
  ctx.save();
  ctx.strokeStyle = 'rgba(233,196,106,.55)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, T, rx * 0.66, ry * 0.68, 0, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx, T, rx * 0.66, ry * 0.745, 0, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
  arcText(ctx, tr('LE BLACKJACK PAIE 3 CONTRE 2', 'BLACKJACK PAYS 3 TO 2'), cx, T, rx * 0.66, ry * 0.712, Math.max(11, h * 0.024), '#e9c46a');
  arcText(ctx, tr('LE CROUPIER RESTE À 17 · LA MAISON GAGNE TOUJOURS', 'DEALER MUST STAND ON 17 · THE HOUSE ALWAYS WINS'), cx, T, rx * 0.86, ry * 0.86, Math.max(9, h * 0.017), 'rgba(233,196,106,.45)');
  ctx.restore();
  // chip tray (dealer bank)
  const trX = cx - rx * 0.38, trY = T + h * 0.015, trW = Math.min(w * 0.16, 190), trH = h * 0.075;
  ctx.save(); roundRect(ctx, trX - trW / 2, trY, trW, trH, 6); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill(); ctx.strokeStyle = 'rgba(233,196,106,.4)'; ctx.stroke();
  const cols = ['#d62839', '#15161c', '#7b2cbf', '#1b9aaa', '#f4a261', '#d62839'];
  for (let i = 0; i < 6; i++) { const x = trX - trW / 2 + (i + 0.5) * (trW / 6); for (let k = 0; k < 4; k++) { ctx.fillStyle = k % 2 ? '#fff' : cols[i]; ctx.beginPath(); ctx.ellipse(x, trY + trH * 0.25 + k * trH * 0.17, trW / 14, trH * 0.13, 0, 0, Math.PI * 2); ctx.fill(); } }
  ctx.restore();
  // shoe
  const sh = shoePos(w, h, T);
  ctx.save(); ctx.translate(sh.x, sh.y); ctx.rotate(-0.6);
  ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  roundRect(ctx, -cw * 0.62, -ch * 0.58, cw * 1.24, ch * 1.16, 8); ctx.fillStyle = '#1b0d05'; ctx.fill(); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 2; ctx.stroke();
  for (let i = 3; i >= 0; i--) { ctx.save(); ctx.translate(i * 1.5, -i * 1.5); cardBack(ctx, cw, ch); ctx.restore(); }
  ctx.restore();
  // discard holder
  const dp = discardPos(w, h, T);
  ctx.save(); ctx.translate(dp.x, dp.y); ctx.rotate(0.5);
  roundRect(ctx, -cw * 0.55, -ch * 0.55, cw * 1.1, ch * 1.1, 8); ctx.strokeStyle = 'rgba(233,196,106,.35)'; ctx.setLineDash([5, 5]); ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  return cv;
}
const shoePos = (w: number, h: number, T: number) => ({ x: w / 2 + Math.min(w * 0.48, h * 1.02) * 0.68, y: T + h * (w < h ? 0.27 : 0.15) });
const discardPos = (w: number, h: number, T: number) => ({ x: w / 2 - Math.min(w * 0.48, h * 1.02) * 0.68, y: T + h * (w < h ? 0.27 : 0.15) });
const cardCache = new Map<string, HTMLCanvasElement>();
function cachedCard(c: number, cw: number, ch: number, back: boolean): HTMLCanvasElement | null {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const key = `${back ? 'b' : c}_${cw}_${dpr}`;
  let cv = cardCache.get(key);
  if (!cv) {
    if (cardCache.size > 160) cardCache.clear();
    cv = document.createElement('canvas'); cv.width = Math.ceil((cw + 4) * dpr); cv.height = Math.ceil((ch + 4) * dpr);
    const x = cv.getContext('2d'); if (!x) return null;
    x.scale(dpr, dpr); x.translate((cw + 4) / 2, (ch + 4) / 2);
    if (back) cardBack(x, cw, ch); else cardFace(x, c, cw, ch);
    cardCache.set(key, cv);
  }
  return cv;
}
function easeOutBack(k: number) { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); }
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, gg = (n >> 8) & 255, b = n & 255;
  const f = (c: number) => Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt));
  r = f(r); gg = f(gg); b = f(b);
  return `rgb(${r},${gg},${b})`;
}
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(' '); const out: string[] = []; let cur = '';
  for (const wd of words) { const t = cur ? `${cur} ${wd}` : wd; if (ctx.measureText(t).width > max && cur) { out.push(cur); cur = wd; } else cur = t; }
  if (cur) out.push(cur);
  return out;
}
function arcText(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, rx: number, ry: number, size: number, col: string) {
  ctx.save(); ctx.font = `700 ${size}px Georgia, serif`; ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const chars = [...text]; const widths = chars.map((c) => ctx.measureText(c).width + size * 0.08);
  const total = widths.reduce((a, b) => a + b, 0);
  const R = (rx + ry) / 2;
  if (total > Math.min(rx, ry) * Math.PI * 0.55) { ctx.restore(); return; }
  let a = Math.PI / 2 + total / R / 2;
  chars.forEach((c, i) => {
    const da = widths[i] / R; a -= da / 2;
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a - Math.PI / 2); ctx.fillText(c, 0, 0); ctx.restore();
    a -= da / 2;
  });
  ctx.restore();
}
function chipTop(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, ci: number, label?: string) {
  const C = CHIP[ci] ?? CHIP[0];
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = C.col; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = C.rim;
  for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate((i / 8) * Math.PI * 2); ctx.fillRect(-r * 0.12, -r, r * 0.24, r * 0.26); ctx.restore(); }
  ctx.strokeStyle = C.rim; ctx.lineWidth = Math.max(1, r * 0.05); ctx.setLineDash([r * 0.12, r * 0.1]);
  ctx.beginPath(); ctx.arc(0, 0, r * 0.68, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  const gi = ctx.createRadialGradient(-r * 0.2, -r * 0.3, 1, 0, 0, r * 0.62);
  gi.addColorStop(0, shade(C.col, 0.35)); gi.addColorStop(1, C.col);
  ctx.fillStyle = gi; ctx.beginPath(); ctx.arc(0, 0, r * 0.58, 0, Math.PI * 2); ctx.fill();
  if (label) { ctx.fillStyle = C.rim; ctx.font = `900 ${r * 0.42}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, r * 0.03); }
  ctx.restore();
}
function chip3d(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, ci: number, side = false) {
  const C = CHIP[ci] ?? CHIP[0];
  const sy = side ? 0.9 : 0.55, th = r * 0.16;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(0, th + 2, r, r * sy, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = shade(C.col, -0.35); ctx.fillRect(-r, 0, r * 2, th);
  ctx.beginPath(); ctx.ellipse(0, th, r, r * sy, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = C.rim; for (let i = -2; i <= 2; i++) ctx.fillRect(i * r * 0.42 - r * 0.07, r * sy * (1 - Math.abs(i) * 0.12) * 0 + 1, r * 0.14, th);
  ctx.scale(1, sy); ctx.fillStyle = C.col; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.rim; ctx.lineWidth = r * 0.1; ctx.setLineDash([r * 0.3, r * 0.3]); ctx.beginPath(); ctx.arc(0, 0, r * 0.84, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = shade(C.col, 0.2); ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function cardBack(ctx: CanvasRenderingContext2D, cw: number, ch: number) {
  const x = -cw / 2, y = -ch / 2, r = cw * 0.08;
  ctx.fillStyle = '#fbf6ea'; roundRect(ctx, x, y, cw, ch, r); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1; ctx.stroke();
  const ix = x + cw * 0.07, iy = y + cw * 0.07, iw = cw * 0.86, ih = ch - cw * 0.14;
  const gg = ctx.createLinearGradient(ix, iy, ix + iw, iy + ih); gg.addColorStop(0, '#9b1028'); gg.addColorStop(1, '#5c0716');
  ctx.fillStyle = gg; roundRect(ctx, ix, iy, iw, ih, r * 0.6); ctx.fill();
  ctx.save(); roundRect(ctx, ix, iy, iw, ih, r * 0.6); ctx.clip();
  ctx.strokeStyle = 'rgba(255,209,102,.35)'; ctx.lineWidth = 1;
  const step = cw * 0.14;
  for (let k = -ih; k < iw + ih; k += step) { ctx.beginPath(); ctx.moveTo(ix + k, iy); ctx.lineTo(ix + k - ih, iy + ih); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ix + k - ih, iy); ctx.lineTo(ix + k, iy + ih); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 1.5; roundRect(ctx, ix + 3, iy + 3, iw - 6, ih - 6, r * 0.4); ctx.stroke();
  ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.moveTo(0, -cw * 0.2); ctx.lineTo(cw * 0.16, 0); ctx.lineTo(0, cw * 0.2); ctx.lineTo(-cw * 0.16, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5c0716'; ctx.font = `900 ${cw * 0.14}px Georgia, serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BL', 0, 1);
}
function cardFace(ctx: CanvasRenderingContext2D, c: number, cw: number, ch: number) {
  const x = -cw / 2, y = -ch / 2, r = cw * 0.08;
  const gg = ctx.createLinearGradient(x, y, x + cw, y + ch); gg.addColorStop(0, '#ffffff'); gg.addColorStop(1, '#efe8d8');
  ctx.fillStyle = gg; roundRect(ctx, x, y, cw, ch, r); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = 1; ctx.stroke();
  const rk = c % 13, su = SUIT[Math.floor(c / 13) % 4], col = RED(c) ? '#c1121f' : '#111827';
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const corner = () => {
    ctx.font = `800 ${cw * 0.22}px Georgia, serif`; ctx.fillText(RANK[rk], x + cw * 0.14, y + cw * 0.17);
    ctx.font = `${cw * 0.18}px serif`; ctx.fillText(su, x + cw * 0.14, y + cw * 0.38);
  };
  corner(); ctx.save(); ctx.rotate(Math.PI); corner(); ctx.restore();
  const n = rk + 1;
  if (rk === 0) {
    ctx.font = `${cw * 0.62}px serif`; ctx.fillText(su, 0, 2);
  } else if (rk >= 10) {
    const fx = x + cw * 0.24, fy = y + ch * 0.13, fw = cw * 0.52, fh = ch * 0.74;
    const fg = ctx.createLinearGradient(fx, fy, fx, fy + fh); fg.addColorStop(0, RED(c) ? '#ffe3e3' : '#e3e8ff'); fg.addColorStop(1, '#fff6d6');
    ctx.fillStyle = fg; ctx.fillRect(fx, fy, fw, fh);
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.5; ctx.strokeRect(fx, fy, fw, fh);
    ctx.font = `${cw * 0.24}px serif`; ctx.fillText(rk === 12 ? '👑' : rk === 11 ? '💄' : '🗡️', 0, -ch * 0.15);
    ctx.fillStyle = col; ctx.font = `900 ${cw * 0.4}px Georgia, serif`; ctx.fillText(RANK[rk], 0, ch * 0.08);
    ctx.font = `${cw * 0.18}px serif`; ctx.fillText(su, 0, ch * 0.27);
  } else {
    const ps = PIPS[n] ?? [];
    const iw = cw * 0.9, ih = ch * 0.82;
    ctx.font = `${cw * 0.2}px serif`;
    for (const [px, py] of ps) {
      const X = (px - 0.5) * iw, Y = (py - 0.5) * ih;
      if (py > 0.5) { ctx.save(); ctx.translate(X, Y); ctx.rotate(Math.PI); ctx.fillText(su, 0, 0); ctx.restore(); } else ctx.fillText(su, X, Y);
    }
  }
}
function drawCard(ctx: CanvasRenderingContext2D, s: Spr, cw: number, ch: number) {
  const ang = s.flip * Math.PI;
  const sx = Math.max(0.02, Math.abs(Math.cos(ang)));
  const lift = Math.sin(ang) * 0.12;
  ctx.save();
  ctx.translate(s.x, s.y - lift * ch * 0.3); ctx.rotate(s.rot);
  // soft shadow (no blur: two offset layers)
  const so = 4 + lift * 40;
  ctx.fillStyle = 'rgba(0,0,0,.18)'; roundRect(ctx, -cw * sx / 2 + so * 0.3 - 2, -ch / 2 + so - 1, cw * sx + 4, ch + 4, cw * 0.1); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.22)'; roundRect(ctx, -cw * sx / 2 + so * 0.3, -ch / 2 + so * 0.6, cw * sx, ch, cw * 0.08); ctx.fill();
  ctx.scale(sx * (1 + lift), 1 + lift);
  const img = cachedCard(s.c, cw, ch, ang <= Math.PI / 2);
  if (img) ctx.drawImage(img, -(cw + 4) / 2, -(ch + 4) / 2, cw + 4, ch + 4);
  ctx.restore();
}
