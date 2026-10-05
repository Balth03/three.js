// Day trading: Bloomberg-meets-cyberpunk terminal. Live candlesticks of a parody stock, news-driven pumps & crashes,
// leveraged LONG / SHORT, liquidations, rockets to the moon and red rain.
import { useRef } from 'preact/hooks';
import type { Life } from '@bl/sim';
import { country, formatMoney } from '@bl/sim';
import { useGame, useCanvas, useKeys, Arena, tr, glow, roundRect, rand, type GameProps } from './kit.tsx';
import { sfx, synth } from '../../audio.ts';
import { lang } from '../../state.ts';

const DURATION = 35;
const CANDLE = 0.55;
const LEVS = [2, 5, 10, 20];
const LEV_TAG: [string, string][] = [['🐔', 'Chicken'], ['😎', 'Trader'], ['🦍', 'Ape'], ['🚀', 'DEGEN']];
const LIQ = 0.8; // a position is liquidated when it has lost 80% of its margin
const UP = '#00ff9c', DOWN = '#ff3366', CYAN = '#22e4ff', AMBER = '#ffb800', MAG = '#ff3df2';

const TICKERS: { sym: string; fr: string; en: string; icon: string; p: number }[] = [
  { sym: 'YOLO', fr: 'Yaourt Online SA', en: 'Yogurt Online Inc.', icon: '🥛', p: 42.0 },
  { sym: 'STONK', fr: 'Stonks & Fils', en: 'Stonks & Sons', icon: '📈', p: 133.7 },
  { sym: 'PQ', fr: 'PapierQ Holding', en: 'TP Holdings', icon: '🧻', p: 18.9 },
  { sym: 'DOGEB', fr: 'DogeBaguette', en: 'DogeBaguette', icon: '🐕', p: 0.69 },
  { sym: 'TSLOL', fr: 'TesLOL Motors', en: 'TesLOL Motors', icon: '🚗', p: 420.0 },
  { sym: 'POOP', fr: 'PoopCoin', en: 'PoopCoin', icon: '💩', p: 6.66 },
  { sym: 'MEOW', fr: 'Croquettes Capital', en: 'Catnip Capital', icon: '🐈', p: 77.7 },
  { sym: 'CROIZ', fr: 'Croissant Chain', en: 'Croissant Chain', icon: '🥐', p: 9.99 },
];

// [fr, en, sign] — sign 0 = nobody knows which way it goes
const NEWS: [string, string, number][] = [
  ['Elon tweete « {S} » suivi de 🍆🚀', 'Elon tweets "{S}" followed by 🍆🚀', 1],
  ['{C} lance un yaourt connecté à la blockchain', '{C} unveils a blockchain-powered yogurt', 1],
  ['Un singe achète 4 millions d\'actions par erreur', 'A monkey buys 4 million shares by mistake', 1],
  ['Mamie Ginette mise sa retraite : « je sens un truc »', 'Grandma Ethel YOLOs her pension: "I feel something"', 1],
  ['Le produit phare fonctionne enfin (parfois)', 'Flagship product finally works (sometimes)', 1],
  ['Warren Buffett aperçu en train de sourire', 'Warren Buffett spotted smiling', 1],
  ['Rumeur : rachat par Disney pour 3 haricots magiques', 'Rumour: Disney buyout for 3 magic beans', 1],
  ['Les influenceurs hurlent TO THE MOON en boucle', 'Influencers screaming TO THE MOON on loop', 1],
  ['Bénéfices record grâce à une erreur d\'Excel', 'Record profits thanks to an Excel typo', 1],
  ['Le PDG surpris en train de lécher un yaourt', 'CEO caught licking yogurt lid', -1],
  ['Le serveur principal était en fait un grille-pain', 'Main server was actually a toaster', -1],
  ['Enquête : la mascotte a détourné des fonds', 'Probe: the mascot embezzled funds', -1],
  ['Le stagiaire a supprimé la prod (encore)', 'Intern deleted production (again)', -1],
  ['Le comptable fuit au Mexique avec la caisse', 'Accountant flees to Mexico with the cash box', -1],
  ['Rappel produit : le yaourt mord', 'Product recall: the yogurt bites', -1],
  ['Le gendarme de la Bourse rit pendant 40 minutes', 'SEC opens probe, laughs for 40 minutes', -1],
  ['Le PDG se reconvertit DJ à Ibiza', 'CEO quits to become a DJ in Ibiza', -1],
  ['Fuite : tous les mots de passe étaient « 1234 »', 'Leak: every password was "1234"', -1],
  ['Un chat marche sur le clavier du trader en chef', 'Cat walks across head trader\'s keyboard', 0],
  ['La Lune déclare : « je ne suis pas au courant »', 'The Moon says: "I was not informed"', 0],
  ['Réunion de crise : quelqu\'un a apporté des croissants', 'Emergency meeting: someone brought donuts', 0],
  ['Le conseil d\'administration remplacé par un poisson rouge', 'Board of directors replaced by a goldfish', 0],
];

const CHAT_USERS = ['xX_Trad3r_Xx', 'MamieCrypto', 'Kevin92', 'ApeLord', 'LoupDeLaCreuse', 'DiamondPaws', 'Gérard_Lambo', 'bogdanoff'];
const CHAT: [string, string][] = [
  ['mains de diamant 💎🙌', 'diamond hands 💎🙌'], ['j\'achète le creux', 'buying the dip'], ['j\'ai vendu ma voiture pour ça', 'sold my car for this'],
  ['monsieur, ceci est un McDo', 'sir, this is a Wendy\'s'], ['ma femme m\'a quitté 🚀🚀', 'my wife left me 🚀🚀'], ['shortez-moi ce truc', 'short this garbage'],
  ['🌕🌕🌕', '🌕🌕🌕'], ['papy a tout misé', 'grandpa went all in'], ['c\'est pas un conseil financier', 'not financial advice'], ['STONKS', 'STONKS'],
  ['qui a vendu ??', 'who sold ??'], ['on tient la ligne 🦍', 'hold the line 🦍'],
];
const CHAT_PUMP: [string, string][] = [['LAMBO 🏎️🏎️', 'LAMBO 🏎️🏎️'], ['TO THE MOOOON 🚀', 'TO THE MOOOON 🚀'], ['je suis riche ?!', 'am I rich?!']];
const CHAT_DUMP: [string, string][] = [['C\'EST LA FIN 😭', 'IT\'S OVER 😭'], ['qui a un pont à louer', 'anyone renting a bridge'], ['ventes à découvert 🐻', 'bears eating good 🐻']];

interface Candle { o: number; h: number; l: number; c: number; v: number }
interface Pos { dir: 1 | -1; entry: number; lev: number; margin: number; at: number }
interface P { x: number; y: number; vx: number; vy: number; life: number; max: number; kind: 'rocket' | 'spark' | 'cash' | 'rain' | 'drop'; color: string; size: number; rot: number }
interface Btn { x: number; y: number; w: number; h: number; act: () => void }

function gauss() { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

// Money formatting in the player's currency. '@bl/data' is loaded lazily so a broken / heavy content bundle can never
// crash the minigame (falls back to a plain € format until the country is known).
function moneyFmt(l: Life) {
  let c: ReturnType<typeof country> | null = null;
  import('@bl/data').then((m) => { try { c = country(m.content, l.country); } catch { c = null; } }).catch(() => { /* fallback */ });
  return (v: number) => {
    try { if (c) return formatMoney(v, c, lang.value); } catch { /* fall through */ }
    return `${Math.round(v).toLocaleString(lang.value === 'fr' ? 'fr-FR' : 'en-US')} €`;
  };
}

export function Trading({ onDone, l }: GameProps) {
  const g = useGame({ duration: DURATION, onDone });
  const fmtRef = useRef<((v: number) => string) | null>(null);
  if (!fmtRef.current) fmtRef.current = moneyFmt(l);
  const fmt = fmtRef.current;
  const s = useRef<ReturnType<typeof init> | null>(null);
  if (!s.current) s.current = init(l);
  const st = s.current;
  const sign = (v: number) => (v >= 0 ? '+' : '−');
  const money = (v: number) => `${sign(v)}${fmt(Math.abs(v))}`;

  const unreal = () => (st.pos ? st.pos.margin * st.pos.lev * st.pos.dir * (st.price / st.pos.entry - 1) : 0);
  const equity = () => st.cash + unreal();

  const chat = (pool: [string, string][]) => {
    const m = pool[Math.floor(Math.random() * pool.length)];
    st.chat.push({ u: CHAT_USERS[Math.floor(Math.random() * CHAT_USERS.length)], m: tr(m[0], m[1]), t: st.t });
    if (st.chat.length > 8) st.chat.shift();
  };
  const banner = (text: string, color: string, sub = '') => { st.banner = { text, sub, color, t: 0 }; };
  const rockets = (n: number) => {
    for (let i = 0; i < n; i++) st.parts.push({ x: rand(0.1, 0.9) * st.W, y: st.H + 20, vx: rand(-60, 60), vy: rand(-620, -380), life: 0, max: rand(1.2, 2), kind: 'rocket', color: UP, size: rand(22, 38), rot: 0 });
    for (let i = 0; i < n * 3; i++) st.parts.push({ x: rand(0, 1) * st.W, y: rand(-0.2, 0.1) * st.H, vx: rand(-40, 40), vy: rand(60, 200), life: 0, max: rand(1.5, 2.6), kind: 'cash', color: UP, size: rand(16, 26), rot: rand(0, 6) });
  };
  const redRain = (n: number) => {
    for (let i = 0; i < n; i++) st.parts.push({ x: rand(-0.1, 1.1) * st.W, y: rand(-0.6, 0) * st.H, vx: rand(-80, -30), vy: rand(700, 1100), life: 0, max: rand(1, 1.8), kind: 'rain', color: DOWN, size: rand(18, 46), rot: 0 });
    for (let i = 0; i < n / 6; i++) st.parts.push({ x: rand(0, 1) * st.W, y: rand(-0.4, 0) * st.H, vx: rand(-30, 30), vy: rand(180, 320), life: 0, max: rand(1.6, 2.4), kind: 'drop', color: DOWN, size: rand(18, 30), rot: rand(-0.4, 0.4) });
  };

  const close = (reason: 'manual' | 'liq' | 'end' = 'manual') => {
    const p = st.pos; if (!p) return;
    let pnl = unreal();
    if (reason === 'liq') pnl = -LIQ * p.margin;
    st.cash += pnl; st.pos = null; st.trades++;
    st.marks.push({ i: st.candles.length, price: st.price, dir: (-p.dir) as 1 | -1, close: true });
    const pct = pnl / st.start;
    st.best = Math.max(st.best, pnl); st.worst = Math.min(st.worst, pnl);
    st.lastTradeFlash = { t: 0, up: pnl >= 0 };
    if (reason === 'liq') {
      st.liqs++;
      banner(tr('LIQUIDÉ 💀', 'LIQUIDATED 💀'), DOWN, money(pnl));
      sfx.boom(); g.shake(); g.flash('#ff0033'); g.miss(); redRain(90); chat(CHAT_DUMP);
      return;
    }
    if (pnl > 0) {
      st.wins++;
      g.hit(pct > 0.08 ? 'perfect' : 'good');
      g.add(Math.max(1, Math.round(pct * 1000)), money(pnl), 62, 40, UP);
      sfx.cash();
      if (pct > 0.15) {
        banner('TO THE MOON 🚀', UP, money(pnl)); rockets(pct > 0.4 ? 26 : 14); g.flash('#00ff9c'); g.burst(50, 50, UP, 50); g.burst(30, 60, AMBER, 30); g.burst(70, 60, CYAN, 30);
        sfx.combo(30); sfx.bells(); chat(CHAT_PUMP);
      } else g.burst(62, 45, UP, 24);
    } else if (pnl < 0) {
      g.miss(money(pnl), 62, 40);
      if (pct < -0.15) { redRain(40); g.flash('#ff0033'); }
    } else g.float(tr('À ZÉRO', 'BREAK-EVEN'), 62, 40, '#ccc');
    if (reason === 'end') g.float(tr('POSITION CLÔTURÉE', 'POSITION CLOSED'), 50, 30, AMBER, true);
  };
  const open = (dir: 1 | -1) => {
    if (st.cash <= st.start * 0.01) { g.float(tr('PLUS UN ROND 💸', 'NO MONEY LEFT 💸'), 50, 40, DOWN, true); sfx.bad(); return; }
    const lev = LEVS[st.lev];
    st.pos = { dir, entry: st.price, lev, margin: st.cash, at: st.t };
    st.marks.push({ i: st.candles.length, price: st.price, dir, close: false });
    st.press = { dir, t: 0 };
    sfx.click2(); synth.tone(dir > 0 ? 660 : 440, 0.12, 'square', 0.06, 0, dir > 0 ? 1.6 : 0.6);
    g.float(`${dir > 0 ? 'LONG ▲' : 'SHORT ▼'} ×${lev}`, 62, 40, dir > 0 ? UP : DOWN, true);
    g.burst(62, 48, dir > 0 ? UP : DOWN, 14);
  };
  const act = (what: 'buy' | 'sell' | 'flat' | 'levUp' | 'levDown') => {
    if (g.phase !== 'play' || st.ended) {
      if (what === 'levUp' || what === 'levDown') { st.lev = Math.max(0, Math.min(LEVS.length - 1, st.lev + (what === 'levUp' ? 1 : -1))); sfx.click(); }
      return;
    }
    if (what === 'levUp' || what === 'levDown') { st.lev = Math.max(0, Math.min(LEVS.length - 1, st.lev + (what === 'levUp' ? 1 : -1))); sfx.click(); if (st.pos) g.float(tr('(prochain trade)', '(next trade)'), 62, 52, '#aaa'); return; }
    if (what === 'flat') { if (st.pos) { st.press = { dir: st.pos.dir, t: 0 }; close(); } return; }
    const dir = what === 'buy' ? 1 : -1;
    if (st.pos && st.pos.dir === -dir) { st.press = { dir, t: 0 }; close(); }
    else if (!st.pos) open(dir);
    else { g.float(dir > 0 ? tr('DÉJÀ LONG', 'ALREADY LONG') : tr('DÉJÀ SHORT', 'ALREADY SHORT'), 62, 48, '#aaa'); sfx.click(); }
  };

  useKeys((e) => {
    if (e.repeat) return;
    if (e.code === 'ArrowUp' || e.code === 'KeyB' || e.code === 'KeyW' || e.code === 'KeyZ') act('buy');
    else if (e.code === 'ArrowDown' || e.code === 'KeyS') act('sell');
    else if (e.code === 'Space' || e.code === 'KeyC' || e.code === 'KeyX') act('flat');
    else if (e.code === 'ArrowRight' || e.code === 'KeyD') act('levUp');
    else if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') act('levDown');
  });

  const finish = () => {
    if (st.ended) return;
    st.ended = true;
    if (st.pos) close('end');
    const eq = st.cash;
    const p = Math.max(-0.9, Math.min(3, eq / st.start - 1));
    const score = p < 0 ? 0.4 * Math.max(0, 1 + p / 0.9) : 0.4 + 0.6 * (1 - Math.exp(-p * 2.2));
    const pctTxt = `${p >= 0 ? '+' : '−'}${Math.abs(p * 100).toFixed(1)} %`;
    g.end(score, [
      [tr('Profit', 'Profit'), `${pctTxt} (${money(eq - st.start)})`],
      [tr('Capital final', 'Final equity'), fmt(eq)],
      [tr('Trades gagnants', 'Winning trades'), `${st.wins} / ${st.trades}`],
      [tr('Meilleur trade', 'Best trade'), st.trades ? money(st.best) : '—'],
      [tr('Liquidations', 'Liquidations'), st.liqs ? `💀 × ${st.liqs}` : '0 😎'],
    ], p);
  };

  const canvas = useCanvas((ctx, w, h, dt, t) => {
    try { frame(ctx, w, h, dt, t); } catch (err) { if (!st.errLogged) { st.errLogged = true; console.warn('Trading frame error', err); } }
  }, true);

  function frame(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, tAll: number) {
    st.W = w; st.H = h;
    const playing = g.phase === 'play' && !st.ended;
    st.t += dt;
    // ─── market simulation ───
    const calm = !playing;
    st.mom += (-st.mom * 0.8 + gauss() * 0.02) * dt;
    let impulse = 0;
    if (st.impulse) {
      const k = Math.min(dt, st.impulse.left);
      impulse = st.impulse.rate * k; st.impulse.left -= k;
      if (st.impulse.left <= 0) st.impulse = null;
    }
    const sigma = calm ? 0.012 : 0.018 + (st.impulse ? 0.02 : 0);
    const prev = st.price;
    st.price = Math.max(0.0001, st.price * Math.exp(sigma * Math.sqrt(dt) * gauss() + st.mom * dt + impulse));
    st.tickDir = st.price >= prev ? 1 : -1;
    const cur = st.cur;
    cur.c = st.price; cur.h = Math.max(cur.h, st.price); cur.l = Math.min(cur.l, st.price); cur.v += dt * (1 + Math.abs(impulse) * 400 + (st.impulse ? 2 : 0));
    st.candleT += dt;
    if (st.candleT >= CANDLE) {
      st.candleT -= CANDLE; st.candles.push(cur); st.cur = { o: st.price, h: st.price, l: st.price, c: st.price, v: 0 };
      if (st.candles.length > 400) { st.candles.shift(); st.marks.forEach((m) => m.i--); }
      if (playing) synth.hat();
    }
    if (playing) {
      // news
      st.nextNews -= dt;
      if (st.nextNews <= 0) {
        st.nextNews = rand(2.6, 4.2);
        let idx = Math.floor(Math.random() * NEWS.length);
        for (let tries = 0; tries < 6 && st.usedNews.has(idx); tries++) idx = Math.floor(Math.random() * NEWS.length);
        st.usedNews.add(idx);
        const [fr, en, sg] = NEWS[idx];
        const dirN = sg === 0 ? (Math.random() < 0.5 ? 1 : -1) : sg;
        const mega = Math.random() < 0.22;
        const mag = mega ? rand(0.16, 0.3) : rand(0.04, 0.12);
        const txt = tr(fr, en).replace('{S}', `$${st.tk.sym}`).replace('{C}', tr(st.tk.fr, st.tk.en));
        st.news = { text: txt, t: 0, dir: dirN, mega, fired: false, mag, sign: sg };
        st.tape.push(`⚡ ${txt}`); if (st.tape.length > 10) st.tape.shift();
        synth.tone(1200, 0.08, 'square', 0.05); synth.tone(900, 0.12, 'square', 0.05, 0.09);
      }
      if (st.news && !st.news.fired && st.news.t > 0.75) {
        const n = st.news; n.fired = true;
        const dur = rand(0.9, 1.5);
        st.impulse = { rate: (n.dir * n.mag) / dur, left: dur };
        if (n.mega && n.dir < 0) { banner('CRASH 📉', DOWN, tr('VENTE PANIQUE', 'PANIC SELLING')); redRain(70); g.shake(); g.flash('#ff0033'); sfx.boom(); chat(CHAT_DUMP); }
        else if (n.mega && n.dir > 0) { banner('PUMP 🚀', UP, tr('ACHAT FRÉNÉTIQUE', 'BUYING FRENZY')); rockets(8); g.flash('#00ff9c'); sfx.whoosh(); synth.tone(300, 0.6, 'sawtooth', 0.05, 0, 3); chat(CHAT_PUMP); }
        else if (n.dir > 0) synth.tone(500, 0.3, 'triangle', 0.05, 0, 1.6); else synth.tone(500, 0.3, 'triangle', 0.05, 0, 0.6);
      }
      // chat ambience
      st.nextChat -= dt;
      if (st.nextChat <= 0) { st.nextChat = rand(1.2, 2.6); chat(CHAT); }
      // background pulse (faster near the end)
      const bpmBeat = g.time < 8 ? 0.3 : 0.5;
      st.beatT += dt;
      if (st.beatT >= bpmBeat) { st.beatT -= bpmBeat; synth.tone(g.time < 8 ? 70 : 55, 0.18, 'sine', 0.14, 0, 0.6); st.pulse = 1; }
      // liquidation logic
      if (st.pos) {
        const u = unreal();
        const danger = -u / (LIQ * st.pos.margin);
        st.danger = Math.max(0, danger);
        if (danger >= 1) close('liq');
        else if (danger > 0.5) {
          st.alarmT -= dt;
          if (st.alarmT <= 0) { st.alarmT = danger > 0.8 ? 0.18 : 0.36; synth.tone(danger > 0.8 ? 1320 : 990, 0.08, 'square', 0.05); }
        }
        // P&L flashing
        if (Math.abs(u - st.flashRef) > st.pos.margin * 0.015) { st.pnlFlash = 1; st.pnlFlashUp = u > st.flashRef; st.flashRef = u; }
      } else { st.danger = 0; st.flashRef = 0; }
      const eq = equity();
      st.peak = Math.max(st.peak, eq);
      if (eq < st.start * 0.03 && !st.pos) { banner(tr('RUINÉ 🪦', 'BANKRUPT 🪦'), DOWN); redRain(60); finish(); }
      if (g.time <= 0) finish();
    }
    if (st.news) st.news.t += dt;
    if (st.banner) st.banner.t += dt;
    if (st.press) st.press.t += dt;
    if (st.lastTradeFlash) st.lastTradeFlash.t += dt;
    st.pnlFlash = Math.max(0, st.pnlFlash - dt * 3);
    st.pulse = Math.max(0, st.pulse - dt * 4);
    st.dispPnl += (unreal() - st.dispPnl) * Math.min(1, dt * 12);
    st.dispEq += (equity() - st.dispEq) * Math.min(1, dt * 10);
    render(ctx, w, h, dt, tAll, playing);
  }

  function render(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, tAll: number, playing: boolean) {
    const k = Math.max(0.62, Math.min(1.25, Math.min(w / 1000, h / 600)));
    const F = (px: number, weight = 700, mono = false) => `${weight} ${Math.round(px * k)}px ${mono ? '"JetBrains Mono", "Fira Code", ui-monospace, monospace' : '"Fredoka Variable", system-ui, sans-serif'}`;
    st.btns = [];
    ctx.clearRect(0, 0, w, h);
    // background
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#020b10'); bg.addColorStop(1, '#03140f');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    // matrix glyph rain (very faint)
    ctx.font = F(12, 400, true); ctx.textAlign = 'center';
    for (let i = 0; i < 34; i++) {
      const x = ((i * 137.7) % w), sp = 30 + (i * 17) % 50;
      const y = ((tAll * sp + i * 91) % (h + 200)) - 100;
      for (let j = 0; j < 7; j++) { ctx.fillStyle = `rgba(0,255,140,${0.06 - j * 0.008})`; ctx.fillText(String.fromCharCode(0x30a0 + ((i * 7 + j * 13 + Math.floor(tAll * 6)) % 90)), x, y - j * 14 * k); }
    }
    const narrow = w < 640;
    const pad = 12 * k;
    const headH = 56 * k, tickH = 30 * k;
    const panelW = narrow ? w - pad * 2 : Math.max(210, Math.min(310, w * 0.28));
    const panelH = narrow ? Math.min(210 * k + 20, h * 0.42) : h - headH - tickH - pad * 3;
    const chart = { x: pad, y: headH + pad, w: narrow ? w - pad * 2 : w - panelW - pad * 3, h: narrow ? h - headH - tickH - panelH - pad * 4 : h - headH - tickH - pad * 3 };
    const panel = { x: narrow ? pad : chart.x + chart.w + pad, y: narrow ? chart.y + chart.h + pad : chart.y, w: panelW, h: panelH };

    drawHeader(ctx, w, headH, k, F, tAll);
    drawChart(ctx, chart, k, F, tAll, playing);
    drawPanel(ctx, panel, k, F, tAll, narrow);
    drawTicker(ctx, w, h - tickH, tickH, k, F, dt);

    // particles
    for (let i = st.parts.length - 1; i >= 0; i--) {
      const p = st.parts[i];
      p.life += dt; if (p.life > p.max || p.y > h + 80) { st.parts.splice(i, 1); continue; }
      if (p.kind === 'rocket') { p.vy -= 200 * dt; if (Math.random() < 0.7) st.parts.push({ x: p.x, y: p.y + p.size * 0.4, vx: rand(-40, 40), vy: rand(60, 160), life: 0, max: rand(0.3, 0.6), kind: 'spark', color: Math.random() < 0.5 ? AMBER : '#fff', size: rand(2, 5), rot: 0 }); }
      else if (p.kind === 'spark') { p.vy += 300 * dt; }
      else if (p.kind === 'cash' || p.kind === 'drop') { p.rot += dt * 2; p.vx += Math.sin(p.life * 4 + p.size) * 30 * dt; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      const a = Math.min(1, (1 - p.life / p.max) * 2);
      ctx.globalAlpha = a;
      if (p.kind === 'rocket') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy, p.vx) + Math.PI / 4 + Math.PI / 2 - Math.PI / 2); ctx.font = `${p.size}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🚀', 0, 0); ctx.restore(); }
      else if (p.kind === 'spark') { ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size); }
      else if (p.kind === 'cash') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(p.rot) * 0.6); ctx.font = `${p.size}px serif`; ctx.textAlign = 'center'; ctx.fillText('💵', 0, 0); ctx.restore(); }
      else if (p.kind === 'drop') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.font = `${p.size}px serif`; ctx.textAlign = 'center'; ctx.fillText(Math.floor(p.size) % 2 ? '📉' : '💸', 0, 0); ctx.restore(); }
      else { ctx.strokeStyle = p.color; ctx.lineWidth = 2; glow(ctx, p.color, 8); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.04, p.y - p.size); ctx.stroke(); ctx.shadowBlur = 0; }
    }
    ctx.globalAlpha = 1;

    // liquidation vignette
    if (st.danger > 0.5 && playing) {
      const a = (st.danger - 0.5) * 2 * (0.55 + 0.45 * Math.sin(tAll * (st.danger > 0.8 ? 22 : 12)));
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
      vg.addColorStop(0, 'rgba(255,0,50,0)'); vg.addColorStop(1, `rgba(255,0,50,${0.55 * a})`);
      ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
      ctx.save(); ctx.font = F(26, 900); ctx.textAlign = 'center'; glow(ctx, DOWN, 20); ctx.fillStyle = `rgba(255,60,90,${0.5 + 0.5 * a})`;
      ctx.fillText(tr('⚠ LIQUIDATION IMMINENTE ⚠', '⚠ LIQUIDATION WARNING ⚠'), chart.x + chart.w / 2, chart.y + chart.h - 40 * k); ctx.restore();
    }
    // big banner
    if (st.banner && st.banner.t < 2.2) {
      const b = st.banner, bt = b.t;
      const sc = bt < 0.25 ? 0.4 + (bt / 0.25) * 0.8 : bt < 0.4 ? 1.2 - ((bt - 0.25) / 0.15) * 0.2 : 1;
      const a = bt > 1.7 ? 1 - (bt - 1.7) / 0.5 : 1;
      ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.translate(chart.x + chart.w / 2, chart.y + chart.h * 0.42); ctx.scale(sc, sc); ctx.rotate(-0.05);
      ctx.fillStyle = 'rgba(0,0,0,.55)'; roundRect(ctx, -260 * k, -56 * k, 520 * k, 112 * k, 18 * k); ctx.fill();
      ctx.strokeStyle = b.color; ctx.lineWidth = 3; glow(ctx, b.color, 30); ctx.stroke();
      ctx.font = F(58, 900); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = b.color;
      // glitch offsets
      if (bt < 0.6) { ctx.fillStyle = CYAN; ctx.fillText(b.text, -3 + Math.random() * 3, -8 * k); ctx.fillStyle = MAG; ctx.fillText(b.text, 3 - Math.random() * 3, -8 * k); ctx.fillStyle = b.color; }
      ctx.fillText(b.text, 0, -8 * k);
      if (b.sub) { ctx.shadowBlur = 0; ctx.font = F(22, 800, true); ctx.fillStyle = '#fff'; ctx.fillText(b.sub, 0, 34 * k); }
      ctx.restore();
    }
    // scanlines + CRT vignette
    ctx.fillStyle = 'rgba(0,0,0,.16)';
    for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
    const crt = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.8);
    crt.addColorStop(0, 'rgba(0,0,0,0)'); crt.addColorStop(1, 'rgba(0,0,0,.45)');
    ctx.fillStyle = crt; ctx.fillRect(0, 0, w, h);
  }

  function drawHeader(ctx: CanvasRenderingContext2D, w: number, hh: number, k: number, F: (px: number, wt?: number, mono?: boolean) => string, tAll: number) {
    const tk = st.tk;
    ctx.fillStyle = 'rgba(0,30,22,.75)'; ctx.fillRect(0, 0, w, hh);
    ctx.strokeStyle = 'rgba(0,255,156,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, hh); ctx.lineTo(w, hh); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.font = `${Math.round(30 * k)}px serif`; ctx.fillText(tk.icon, 14 * k, hh / 2 + 2);
    ctx.save(); glow(ctx, AMBER, 12); ctx.fillStyle = AMBER; ctx.font = F(24, 900, true); ctx.fillText(`$${tk.sym}`, 54 * k, hh / 2 - 8 * k); ctx.restore();
    ctx.fillStyle = 'rgba(200,255,230,.6)'; ctx.font = F(11, 600, true); ctx.fillText(`${tr(tk.fr, tk.en)} · NASDAQ-ISH · ${tr('EN DIRECT', 'LIVE')}`, 54 * k, hh / 2 + 13 * k);
    // live dot
    ctx.fillStyle = Math.sin(tAll * 6) > 0 ? DOWN : 'rgba(255,51,102,.3)'; ctx.beginPath(); ctx.arc(46 * k, hh / 2 - 8 * k, 3.5 * k, 0, 7); ctx.fill();
    // price
    const chg = st.price / st.open0 - 1;
    const col = chg >= 0 ? UP : DOWN;
    const px = Math.max(250 * k, w * 0.36);
    ctx.save(); glow(ctx, st.tickDir > 0 ? UP : DOWN, 16 + st.pulse * 10); ctx.fillStyle = st.tickDir > 0 ? '#d9fff0' : '#ffd9e2'; ctx.font = F(30, 800, true); ctx.fillText(fmtPrice(st.price), px, hh / 2); const pw = ctx.measureText(fmtPrice(st.price)).width; ctx.restore();
    ctx.font = F(15, 800, true); ctx.fillStyle = col; ctx.fillText(`${chg >= 0 ? '▲' : '▼'} ${(Math.abs(chg) * 100).toFixed(2)}%`, px + pw + 12 * k, hh / 2);
    // fear & greed gauge
    if (w > 560) {
      const n = st.candles.length; const ref = st.candles[Math.max(0, n - 8)]?.o ?? st.price;
      const fg = Math.max(0, Math.min(1, 0.5 + (st.price / ref - 1) * 6));
      st.fg += (fg - st.fg) * 0.05;
      const gx = w - 70 * k, gy = hh * 0.78, R = 26 * k;
      const segs = ['#ff3366', '#ff8a3d', '#ffd23d', '#9dff5c', '#00ff9c'];
      segs.forEach((c, i) => { ctx.strokeStyle = c; ctx.lineWidth = 6 * k; ctx.beginPath(); ctx.arc(gx, gy, R, Math.PI + (i / 5) * Math.PI + 0.03, Math.PI + ((i + 1) / 5) * Math.PI - 0.03); ctx.stroke(); });
      const ang = Math.PI + st.fg * Math.PI;
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(ang) * R * 0.9, gy + Math.sin(ang) * R * 0.9); ctx.stroke();
      ctx.font = F(9, 700, true); ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText(st.fg > 0.66 ? tr('AVIDITÉ', 'GREED') : st.fg < 0.33 ? tr('PEUR', 'FEAR') : tr('NEUTRE', 'NEUTRAL'), gx, gy + 9 * k);
      ctx.textAlign = 'right'; ctx.font = F(11, 700, true); ctx.fillStyle = 'rgba(200,255,230,.6)';
      ctx.fillText(`VOL ${(st.cur.v * 1000 + 13370).toFixed(0)}`, gx - R - 14 * k, hh / 2 - 7 * k);
      ctx.fillText(`${tr('BÊTA', 'BETA')} ${(1.2 + Math.abs(st.mom) * 40).toFixed(2)} · P/E ∞`, gx - R - 14 * k, hh / 2 + 9 * k);
    }
  }

  function drawChart(ctx: CanvasRenderingContext2D, c: { x: number; y: number; w: number; h: number }, k: number, F: (px: number, wt?: number, mono?: boolean) => string, tAll: number, playing: boolean) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,12,10,.72)'; roundRect(ctx, c.x, c.y, c.w, c.h, 10 * k); ctx.fill();
    ctx.strokeStyle = 'rgba(0,255,156,.35)'; ctx.lineWidth = 1; ctx.stroke();
    corners(ctx, c.x, c.y, c.w, c.h, 14 * k, CYAN);
    ctx.beginPath(); roundRect(ctx, c.x, c.y, c.w, c.h, 10 * k); ctx.clip();
    const axisW = 64 * k, volH = c.h * 0.14;
    const plot = { x: c.x + 8, y: c.y + 46 * k, w: c.w - axisW - 8, h: c.h - 46 * k - volH - 10 };
    const spacing = Math.max(9, 15 * k);
    const nVis = Math.ceil(plot.w / spacing) + 2;
    const all = st.candles.concat([st.cur]);
    const vis = all.slice(-nVis);
    let lo = Infinity, hi = -Infinity, vmax = 0.0001;
    for (const cd of vis) { lo = Math.min(lo, cd.l); hi = Math.max(hi, cd.h); vmax = Math.max(vmax, cd.v); }
    if (st.pos) { lo = Math.min(lo, st.pos.entry); hi = Math.max(hi, st.pos.entry); }
    const span = Math.max(hi - lo, st.price * 0.02);
    const tlo = lo - span * 0.12, thi = hi + span * 0.12;
    if (!st.ylo) { st.ylo = tlo; st.yhi = thi; }
    st.ylo += (tlo - st.ylo) * 0.08; st.yhi += (thi - st.yhi) * 0.08;
    const Y = (p: number) => plot.y + plot.h - ((p - st.ylo) / (st.yhi - st.ylo)) * plot.h;
    // grid
    ctx.strokeStyle = 'rgba(0,255,156,.07)'; ctx.lineWidth = 1;
    ctx.font = F(11, 600, true); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
      const p = st.ylo + ((st.yhi - st.ylo) * i) / 5, y = Y(p);
      ctx.beginPath(); ctx.moveTo(plot.x, y); ctx.lineTo(plot.x + plot.w, y); ctx.stroke();
      ctx.fillStyle = 'rgba(160,255,210,.45)'; ctx.fillText(fmtPrice(p), plot.x + plot.w + 6, y);
    }
    const frac = st.candleT / CANDLE;
    const xRight = plot.x + plot.w - spacing * 0.2;
    for (let i = 0; i < 12; i++) { const x = xRight - ((i * 6 + frac) * spacing) % (plot.w + spacing); ctx.beginPath(); ctx.moveTo(x, plot.y); ctx.lineTo(x, plot.y + plot.h + volH); ctx.stroke(); }
    // candles
    const n = vis.length;
    const X = (i: number) => xRight - (n - 1 - i) * spacing - frac * spacing;
    const bodyW = spacing * 0.62;
    for (let i = 0; i < n; i++) {
      const cd = vis[i];
      const xx = X(i);
      if (xx < plot.x - spacing) continue;
      const up = cd.c >= cd.o, col = up ? UP : DOWN;
      const live = i === n - 1;
      ctx.strokeStyle = col; ctx.fillStyle = up ? 'rgba(0,255,156,.85)' : 'rgba(255,51,102,.9)';
      if (live) glow(ctx, col, 16);
      ctx.lineWidth = Math.max(1, 1.4 * k);
      ctx.beginPath(); ctx.moveTo(xx, Y(cd.h)); ctx.lineTo(xx, Y(cd.l)); ctx.stroke();
      const y1 = Y(Math.max(cd.o, cd.c)), y2 = Y(Math.min(cd.o, cd.c));
      ctx.fillRect(xx - bodyW / 2, y1, bodyW, Math.max(1.5, y2 - y1));
      ctx.shadowBlur = 0;
      // volume
      const vh = (cd.v / vmax) * volH * 0.9;
      ctx.fillStyle = up ? 'rgba(0,255,156,.25)' : 'rgba(255,51,102,.25)';
      ctx.fillRect(xx - bodyW / 2, c.y + c.h - 6 - vh, bodyW, vh);
    }
    // moving-average line
    ctx.strokeStyle = 'rgba(255,184,0,.7)'; ctx.lineWidth = 1.5 * k; ctx.beginPath();
    for (let i = 0; i < n; i++) {
      let sum = 0, m = 0; for (let j = Math.max(0, all.length - n + i - 7); j <= all.length - n + i; j++) { if (all[j]) { sum += all[j].c; m++; } }
      const xx = X(i);
      const y = Y(sum / Math.max(1, m));
      if (i === 0) ctx.moveTo(xx, y); else ctx.lineTo(xx, y);
    }
    ctx.stroke();
    // trade markers
    const base = all.length - n;
    for (const m of st.marks) {
      const i = m.i - base; if (i < 0 || i >= n) continue;
      const xx = X(i);
      const y = Y(m.price);
      ctx.fillStyle = m.dir > 0 ? UP : DOWN; glow(ctx, ctx.fillStyle as string, 10);
      ctx.beginPath();
      if (m.dir > 0) { ctx.moveTo(xx, y + 6); ctx.lineTo(xx - 7 * k, y + 18 * k); ctx.lineTo(xx + 7 * k, y + 18 * k); }
      else { ctx.moveTo(xx, y - 6); ctx.lineTo(xx - 7 * k, y - 18 * k); ctx.lineTo(xx + 7 * k, y - 18 * k); }
      ctx.fill(); ctx.shadowBlur = 0;
      if (m.close) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(xx, y, 4 * k, 0, 7); ctx.stroke(); }
    }
    // entry & liquidation lines
    if (st.pos) {
      const p = st.pos;
      const ey = Y(p.entry);
      ctx.setLineDash([6, 5]); ctx.strokeStyle = AMBER; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(plot.x, ey); ctx.lineTo(plot.x + plot.w, ey); ctx.stroke();
      const liqPrice = p.entry * (1 - (p.dir * LIQ) / p.lev);
      const ly = Y(liqPrice);
      if (ly > plot.y - 4 && ly < plot.y + plot.h + 4) { ctx.strokeStyle = DOWN; ctx.lineWidth = 1.5 + st.danger * 2; ctx.beginPath(); ctx.moveTo(plot.x, ly); ctx.lineTo(plot.x + plot.w, ly); ctx.stroke(); ctx.setLineDash([]); tag(ctx, plot.x + 4, ly, `LIQ ${fmtPrice(liqPrice)}`, DOWN, k, F, 'left'); }
      ctx.setLineDash([]);
      tag(ctx, plot.x + 4, ey, `${tr('ENTRÉE', 'ENTRY')} ${fmtPrice(p.entry)}`, AMBER, k, F, 'left');
      // P&L fill zone between entry and price
      const py = Y(st.price);
      const good = (st.price - p.entry) * p.dir >= 0;
      ctx.fillStyle = good ? 'rgba(0,255,156,.07)' : 'rgba(255,51,102,.09)';
      ctx.fillRect(plot.x, Math.min(ey, py), plot.w, Math.abs(py - ey));
    }
    // current price line + axis tag
    const py = Y(st.price);
    ctx.strokeStyle = st.tickDir > 0 ? 'rgba(0,255,156,.6)' : 'rgba(255,51,102,.6)'; ctx.setLineDash([2, 3]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plot.x, py); ctx.lineTo(plot.x + plot.w, py); ctx.stroke(); ctx.setLineDash([]);
    tag(ctx, plot.x + plot.w + 2, py, fmtPrice(st.price), st.tickDir > 0 ? UP : DOWN, k, F, 'left', true);
    // breaking news banner (top of chart)
    const nw = st.news;
    if (nw && nw.t < 3.4 && playing) {
      const slide = Math.min(1, nw.t / 0.18);
      const a = nw.t > 3 ? 1 - (nw.t - 3) / 0.4 : 1;
      ctx.globalAlpha = a;
      const by = c.y + 8 * k, bh = 32 * k;
      ctx.fillStyle = 'rgba(0,0,0,.75)'; ctx.fillRect(c.x + 8, by, (c.w - 16) * slide, bh);
      const tagCol = nw.t < 0.75 ? (Math.floor(nw.t * 12) % 2 ? '#fff' : DOWN) : nw.fired ? (nw.dir > 0 ? UP : DOWN) : DOWN;
      ctx.fillStyle = tagCol; ctx.fillRect(c.x + 8, by, 112 * k, bh);
      ctx.fillStyle = '#000'; ctx.font = F(14, 900, true); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(nw.fired ? (nw.dir > 0 ? '▲ PUMP' : '▼ DUMP') : tr('⚡ FLASH', '⚡ BREAKING'), c.x + 8 + 56 * k, by + bh / 2);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.font = F(16, 700);
      const txt = nw.text;
      const maxW = c.w - 140 * k;
      let shown = txt; while (ctx.measureText(shown).width > maxW && shown.length > 4) shown = shown.slice(0, -2);
      if (shown !== txt) shown += '…';
      ctx.fillText(shown.slice(0, Math.floor(nw.t * 70)), c.x + 128 * k, by + bh / 2);
      ctx.globalAlpha = 1;
    } else {
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = F(12, 700, true); ctx.fillStyle = 'rgba(160,255,210,.55)';
      ctx.fillText(`${st.tk.sym}/${tr('EUR', 'USD')} · 1T=${CANDLE}s · MA7`, c.x + 14, c.y + 22 * k);
    }
    ctx.restore();
  }

  function drawPanel(ctx: CanvasRenderingContext2D, p: { x: number; y: number; w: number; h: number }, k: number, F: (px: number, wt?: number, mono?: boolean) => string, tAll: number, narrow: boolean) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,14,12,.8)'; roundRect(ctx, p.x, p.y, p.w, p.h, 10 * k); ctx.fill();
    ctx.strokeStyle = 'rgba(34,228,255,.35)'; ctx.lineWidth = 1; ctx.stroke();
    corners(ctx, p.x, p.y, p.w, p.h, 12 * k, UP);
    const pos = st.pos, u = unreal();
    const cx = p.x + 14 * k; let y = p.y + 22 * k;
    const colW = narrow ? p.w / 2 - 10 : p.w - 28 * k;
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    // position state
    ctx.font = F(11, 700, true); ctx.fillStyle = 'rgba(160,255,210,.6)'; ctx.fillText('POSITION', cx, y);
    y += 22 * k;
    const stCol = pos ? (pos.dir > 0 ? UP : DOWN) : '#7a8a86';
    ctx.save(); glow(ctx, stCol, pos ? 14 : 0); ctx.fillStyle = stCol; ctx.font = F(24, 900, true);
    ctx.fillText(pos ? `${pos.dir > 0 ? 'LONG ▲' : 'SHORT ▼'} ×${pos.lev}` : tr('AUCUNE —', 'FLAT —'), cx, y); ctx.restore();
    y += 30 * k;
    // P&L box
    const boxH = 54 * k;
    const fl = st.pnlFlash;
    const fcol = st.pnlFlashUp ? '0,255,156' : '255,51,102';
    const baseCol = !pos || Math.abs(u) < 0.5 ? '255,255,255' : u > 0 ? '0,255,156' : '255,51,102';
    ctx.fillStyle = `rgba(${baseCol},0.06)`; roundRect(ctx, cx - 4, y - 4, colW + 8, boxH, 8 * k); ctx.fill();
    ctx.fillStyle = `rgba(${fcol},${fl * 0.4})`; roundRect(ctx, cx - 4, y - 4, colW + 8, boxH, 8 * k); ctx.fill();
    ctx.strokeStyle = `rgba(${fcol},${0.3 + fl * 0.6})`; ctx.stroke();
    ctx.font = F(10, 700, true); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillText(tr('P&L LATENT', 'UNREALIZED P&L'), cx + 4, y + 8 * k);
    const pcol = st.dispPnl > 0.5 ? UP : st.dispPnl < -0.5 ? DOWN : '#cfd8d5';
    ctx.save(); glow(ctx, pcol, 10 + fl * 20); ctx.fillStyle = pcol; ctx.font = F(Math.min(26, 26 * (colW / (220 * k))), 900, true);
    const pnlTxt = pos ? money(st.dispPnl) : fmt(0);
    ctx.fillText(pnlTxt, cx + 4 + (fl > 0.5 ? (Math.random() - 0.5) * 3 : 0), y + 30 * k); ctx.restore();
    if (pos) { ctx.font = F(12, 800, true); ctx.textAlign = 'right'; ctx.fillStyle = pcol; ctx.fillText(`${u >= 0 ? '+' : ''}${((u / pos.margin) * 100).toFixed(0)}%`, cx + colW, y + 8 * k); ctx.textAlign = 'left'; }
    y += boxH + 10 * k;
    // equity + margin bar
    const eq = st.dispEq, pct = st.dispEq / st.start - 1;
    const rows: [string, string, string][] = [
      [tr('CAPITAL', 'EQUITY'), fmt(eq), pct >= 0 ? UP : DOWN],
      [tr('PERF.', 'RETURN'), `${pct >= 0 ? '+' : '−'}${Math.abs(pct * 100).toFixed(1)}%`, pct >= 0 ? UP : DOWN],
    ];
    if (!narrow) rows.push([tr('DÉPART', 'START'), fmt(st.start), '#9fb']);
    let ry = y;
    const rx = narrow ? cx : cx;
    for (const [a, b, col] of rows) {
      ctx.font = F(11, 700, true); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.textAlign = 'left'; ctx.fillText(a, rx, ry);
      ctx.font = F(14, 800, true); ctx.fillStyle = col; ctx.textAlign = 'right'; ctx.fillText(b, rx + colW, ry);
      ry += 20 * k;
    }
    ctx.textAlign = 'left';
    // margin health
    ctx.font = F(10, 700, true); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillText(tr('SANTÉ DE LA MARGE', 'MARGIN HEALTH'), rx, ry + 2 * k);
    ry += 12 * k;
    const health = pos ? 1 - Math.min(1, st.danger) : 1;
    ctx.fillStyle = 'rgba(255,255,255,.1)'; roundRect(ctx, rx, ry, colW, 8 * k, 4 * k); ctx.fill();
    const hc = health > 0.5 ? UP : health > 0.25 ? AMBER : DOWN;
    ctx.save(); glow(ctx, hc, 10); ctx.fillStyle = hc; roundRect(ctx, rx, ry, Math.max(4, colW * health), 8 * k, 4 * k); ctx.fill(); ctx.restore();
    ry += 22 * k;
    // second column (narrow) or continue below
    let bx = narrow ? p.x + p.w / 2 + 6 : cx, by = narrow ? p.y + 16 * k : ry;
    const bw = narrow ? p.w / 2 - 20 : colW;
    // leverage selector
    ctx.font = F(10, 700, true); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillText(tr('LEVIER  ← →', 'LEVERAGE  ← →'), bx, by + 4 * k);
    by += 14 * k;
    const pillW = (bw - 3 * 5) / 4, pillH = 34 * k;
    LEVS.forEach((lv, i) => {
      const x = bx + i * (pillW + 5), sel = i === st.lev;
      const col = i === 3 ? MAG : i === 2 ? AMBER : CYAN;
      ctx.fillStyle = sel ? col : 'rgba(255,255,255,.06)';
      if (sel) glow(ctx, col, 14);
      roundRect(ctx, x, by, pillW, pillH, 7 * k); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = sel ? '#fff' : 'rgba(255,255,255,.18)'; ctx.stroke();
      ctx.textAlign = 'center'; ctx.fillStyle = sel ? '#001' : '#cfe';
      ctx.font = F(13, 900, true); ctx.fillText(`×${lv}`, x + pillW / 2, by + pillH * 0.38);
      ctx.font = `${Math.round(11 * k)}px serif`; ctx.fillText(LEV_TAG[i][0], x + pillW / 2, by + pillH * 0.76);
      st.btns.push({ x, y: by, w: pillW, h: pillH, act: () => { st.lev = i; sfx.click(); } });
    });
    ctx.textAlign = 'left';
    by += pillH + 4 * k;
    ctx.font = F(10, 700, true); ctx.fillStyle = i18nTagCol(st.lev);
    ctx.fillText(`${tr('Mode', 'Mode')}: ${LEV_TAG[st.lev][1].toUpperCase()} · ${tr('notionnel', 'notional')} ${fmt(st.cash * LEVS[st.lev])}`, bx, by + 6 * k);
    by += 18 * k;
    // BUY / SELL buttons
    const btnH = Math.max(40, 52 * k), gap = 8;
    const half = (bw - gap) / 2;
    const drawBtn = (x: number, label: string, keysTxt: string, col: string, dir: 1 | -1, active: boolean) => {
      const pr = st.press && st.press.dir === dir && st.press.t < 0.18 ? 1 - st.press.t / 0.18 : 0;
      const yy = by + pr * 3;
      ctx.save();
      const gr = ctx.createLinearGradient(0, yy, 0, yy + btnH);
      gr.addColorStop(0, col); gr.addColorStop(1, dir > 0 ? '#00995e' : '#a3002f');
      ctx.fillStyle = gr; glow(ctx, col, 12 + pr * 30 + (active ? 10 + Math.sin(tAll * 8) * 6 : 0));
      roundRect(ctx, x, yy, half, btnH, 10 * k); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,.25)'; roundRect(ctx, x + 3, yy + 3, half - 6, btnH * 0.38, 7 * k); ctx.fill();
      ctx.fillStyle = '#001a10'; ctx.textAlign = 'center'; ctx.font = F(19, 900); ctx.fillText(label, x + half / 2, yy + btnH * 0.45);
      ctx.font = F(10, 800, true); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillText(keysTxt, x + half / 2, yy + btnH * 0.8);
      ctx.restore();
      st.btns.push({ x, y: by, w: half, h: btnH, act: () => act(dir > 0 ? 'buy' : 'sell') });
    };
    drawBtn(bx, pos?.dir === -1 ? tr('RACHETER', 'COVER') : tr('ACHAT', 'BUY'), '↑ / B', UP, 1, pos?.dir === -1);
    drawBtn(bx + half + gap, pos?.dir === 1 ? tr('VENDRE', 'SELL') : 'SHORT', '↓ / S', DOWN, -1, pos?.dir === 1);
    by += btnH + 6 * k;
    if (pos) {
      ctx.textAlign = 'center'; ctx.font = F(11, 700, true); ctx.fillStyle = `rgba(255,184,0,${0.6 + 0.4 * Math.sin(tAll * 5)})`;
      ctx.fillText(tr('ESPACE = tout clôturer', 'SPACE = close position'), bx + bw / 2, by + 6 * k);
      st.btns.push({ x: bx, y: by - 4, w: bw, h: 18 * k, act: () => act('flat') });
    }
    by += 18 * k;
    // chat (wide layout only)
    if (!narrow) {
      const chatTop = by + 6 * k, chatBot = p.y + p.h - 10 * k;
      if (chatBot - chatTop > 50 * k) {
        ctx.strokeStyle = 'rgba(0,255,156,.15)'; ctx.beginPath(); ctx.moveTo(cx, chatTop); ctx.lineTo(cx + colW, chatTop); ctx.stroke();
        ctx.textAlign = 'left'; ctx.font = F(10, 700, true); ctx.fillStyle = 'rgba(160,255,210,.55)'; ctx.fillText(`💬 r/${tr('BoursoTroll', 'WallStreetBets')}`, cx, chatTop + 12 * k);
        ctx.save(); ctx.beginPath(); ctx.rect(cx - 4, chatTop + 20 * k, colW + 8, chatBot - chatTop - 20 * k); ctx.clip();
        let cy = chatBot - 8 * k;
        for (let i = st.chat.length - 1; i >= 0 && cy > chatTop + 20 * k; i--) {
          const m = st.chat[i];
          const age = st.t - m.t;
          ctx.globalAlpha = Math.min(1, age * 4) * Math.max(0.35, 1 - (st.chat.length - 1 - i) * 0.12);
          ctx.font = F(11, 800, true); ctx.fillStyle = CHAT_COL[m.u.length % CHAT_COL.length]; ctx.fillText(m.u, cx, cy);
          const uw = ctx.measureText(m.u + ' ').width;
          ctx.font = F(11, 600); ctx.fillStyle = '#e6fff5';
          let txt = m.m; while (ctx.measureText(txt).width > colW - uw && txt.length > 3) txt = txt.slice(0, -1);
          ctx.fillText(txt, cx + uw, cy);
          cy -= 17 * k;
        }
        ctx.restore(); ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
  }

  function drawTicker(ctx: CanvasRenderingContext2D, w: number, y: number, th: number, k: number, F: (px: number, wt?: number, mono?: boolean) => string, dt: number) {
    ctx.fillStyle = 'rgba(0,0,0,.85)'; ctx.fillRect(0, y, w, th);
    ctx.fillStyle = AMBER; ctx.fillRect(0, y, w, 2);
    const items = st.tape.concat(st.quotes.map((q) => `${q.s} ${q.v >= 0 ? '▲' : '▼'}${Math.abs(q.v).toFixed(1)}%`));
    const text = items.join('   ◆   ') + '   ◆   ';
    ctx.font = F(14, 700, true); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    const tw = Math.max(200, ctx.measureText(text).width);
    st.tickX = (st.tickX + dt * 95) % tw;
    ctx.save(); ctx.beginPath(); ctx.rect(110 * k, y, w, th); ctx.clip();
    let x = 110 * k - st.tickX;
    while (x < w) {
      let xx = x;
      for (const it of items) {
        const isNews = it.startsWith('⚡');
        ctx.fillStyle = isNews ? AMBER : it.includes('▲') ? UP : DOWN;
        ctx.fillText(it, xx, y + th / 2 + 1);
        xx += ctx.measureText(it + '   ◆   ').width;
        ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillText('◆', xx - ctx.measureText('◆   ').width, y + th / 2 + 1);
      }
      x += tw;
    }
    ctx.restore();
    ctx.fillStyle = DOWN; ctx.fillRect(0, y + 2, 104 * k, th - 2);
    ctx.fillStyle = '#fff'; ctx.font = F(13, 900, true); ctx.textAlign = 'center'; ctx.fillText(tr('INFOS ⚡', 'NEWS ⚡'), 52 * k, y + th / 2 + 1);
  }

  const onPointer = (e: PointerEvent) => {
    const c = canvas.current; if (!c) return;
    const r = c.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    for (const b of st.btns) if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { b.act(); return; }
  };

  return (
    <Arena g={g} title={tr('Trading de folie', 'Day Trading')} icon="📈" theme="matrix" scoreLabel="SCORE"
      howTo={tr('Les news tombent, le cours s\'affole. ACHÈTE (long) si ça va monter, VENDS (short) si ça va s\'écraser, et clôture au bon moment. Le levier multiplie tout… y compris les pertes. À –80 % de marge : LIQUIDÉ.', 'News drops, the price goes wild. BUY (long) if it\'s going up, SELL (short) if it\'s about to crash, and close at the right time. Leverage multiplies everything… losses included. At –80% margin: LIQUIDATED.')}
      keys={['↑ / B = BUY', '↓ / S = SELL', tr('Espace = clôturer', 'Space = close'), tr('← → = levier', '← → = leverage')]}>
      <canvas class="play" ref={canvas} onPointerDown={onPointer} style={{ touchAction: 'none' }} />
    </Arena>
  );
}

const CHAT_COL = ['#22e4ff', '#ff3df2', '#ffb800', '#00ff9c', '#b18cff', '#ff8a3d'];
function i18nTagCol(i: number) { return ['#22e4ff', '#22e4ff', '#ffb800', '#ff3df2'][i]; }

function fmtPrice(p: number) { return p >= 1000 ? p.toFixed(0) : p >= 100 ? p.toFixed(1) : p >= 1 ? p.toFixed(2) : p.toFixed(4); }

function tag(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, col: string, k: number, F: (px: number, wt?: number, mono?: boolean) => string, align: 'left' | 'right', solid = false) {
  ctx.save();
  ctx.font = F(11, 800, true);
  const tw = ctx.measureText(text).width + 10, th = 18 * k;
  const xx = align === 'left' ? x : x - tw;
  ctx.fillStyle = solid ? col : 'rgba(0,0,0,.7)';
  if (solid) glow(ctx, col, 14);
  roundRect(ctx, xx, y - th / 2, tw, th, 4); ctx.fill(); ctx.shadowBlur = 0;
  if (!solid) { ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.fillStyle = solid ? '#001' : col; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(text, xx + 5, y + 1);
  ctx.restore();
}

function corners(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, s: number, col: string) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; glow(ctx, col, 8);
  ctx.beginPath();
  ctx.moveTo(x, y + s); ctx.lineTo(x, y); ctx.lineTo(x + s, y);
  ctx.moveTo(x + w - s, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + s);
  ctx.moveTo(x + w, y + h - s); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - s, y + h);
  ctx.moveTo(x + s, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - s);
  ctx.stroke(); ctx.restore();
}

function init(l: Life) {
  const tk = TICKERS[Math.floor(Math.random() * TICKERS.length)];
  const start = Math.max(100, Math.round(Math.abs(l.money || 0) * 0.2));
  let price = tk.p * rand(0.85, 1.15);
  const candles: Candle[] = [];
  // pre-history so the chart is already alive
  for (let i = 0; i < 90; i++) {
    const o = price; let h = o, lo = o;
    for (let j = 0; j < 8; j++) { price *= Math.exp(0.012 * Math.sqrt(CANDLE / 8) * gauss() + (Math.sin(i / 11) * 0.0012)); h = Math.max(h, price); lo = Math.min(lo, price); }
    candles.push({ o, h, l: lo, c: price, v: rand(0.2, 1) });
  }
  const others = TICKERS.filter((t) => t !== tk).map((t) => ({ s: `$${t.sym}`, v: rand(-9, 9) }));
  others.push({ s: 'BTC🍌', v: rand(-15, 15) }, { s: 'CAC-42', v: rand(-3, 3) }, { s: 'NFT🦧', v: rand(-60, -20) });
  return {
    tk, start, cash: start, price, open0: price, candles, cur: { o: price, h: price, l: price, c: price, v: 0 } as Candle, candleT: 0,
    mom: 0, impulse: null as null | { rate: number; left: number }, tickDir: 1 as 1 | -1, t: 0,
    pos: null as Pos | null, lev: 1, trades: 0, wins: 0, best: -Infinity, worst: Infinity, liqs: 0, peak: start,
    marks: [] as { i: number; price: number; dir: 1 | -1; close: boolean }[],
    news: null as null | { text: string; t: number; dir: number; mega: boolean; fired: boolean; mag: number; sign: number },
    nextNews: 1.6, usedNews: new Set<number>(), banner: null as null | { text: string; sub: string; color: string; t: number },
    chat: [] as { u: string; m: string; t: number }[], nextChat: 0.5,
    tape: [] as string[], quotes: others, tickX: 0,
    parts: [] as P[], btns: [] as Btn[], W: 800, H: 600,
    press: null as null | { dir: 1 | -1; t: number }, lastTradeFlash: null as null | { t: number; up: boolean },
    danger: 0, alarmT: 0, pnlFlash: 0, pnlFlashUp: true, flashRef: 0, dispPnl: 0, dispEq: start, fg: 0.5,
    ylo: 0, yhi: 0, beatT: 0, pulse: 0, ended: false, errLogged: false,
  };
}
