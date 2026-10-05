// Minigames: short skill games that feed a 0..1 score back into the simulation.
import { useEffect, useRef, useState } from 'preact/hooks';
import { country, formatMoney, type Life } from '@bl/sim';
import { content } from '@bl/data';
import { lang, type MinigameKind, rev } from '../state.ts';
import { Btn } from './common.tsx';
import { sfx } from '../audio.ts';
import { CarChase } from './games/CarChase.tsx';
import { Rhythm } from './games/Rhythm.tsx';
import { Hack } from './games/Hack.tsx';
import { Lockpick } from './games/Lockpick.tsx';
import { Fight } from './games/Fight.tsx';
import { BeerPong } from './games/BeerPong.tsx';
import { Trading } from './games/Trading.tsx';
import { Slots } from './games/Slots.tsx';
import { Penalty } from './games/Penalty.tsx';
import { Surgery2 } from './games/Surgery2.tsx';
import { Debate } from './games/Debate.tsx';
import { Blackjack2 } from './games/Blackjack2.tsx';
import { Escape2 } from './games/Escape2.tsx';
import { Cooking2 } from './games/Cooking2.tsx';

const T = (fr: string, en: string) => (lang.value === 'fr' ? fr : en);
type Done = (score: number, extra?: number) => void;

function useKey(handler: (e: KeyboardEvent) => void, deps: unknown[]) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { e.stopPropagation(); handler(e); };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, deps);
}

function useFrame(cb: (dt: number) => void, active: boolean) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!active) return;
    let raf = 0, last = performance.now();
    const loop = (t: number) => { ref.current(Math.min(0.05, (t - last) / 1000)); last = t; raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

function Finish({ score, onDone, extra, label }: { score: number; onDone: Done; extra?: number; label?: string }) {
  const verdict = score >= 0.75 ? T('Excellent !', 'Excellent!') : score >= 0.45 ? T('Pas mal.', 'Not bad.') : T('Catastrophe.', 'Disaster.');
  useKey((e) => { if (e.code === 'Space' || e.code === 'Enter') onDone(score, extra); }, [score]);
  return (
    <div class="mg-finish pop-in">
      <div class="mg-score">{Math.round(score * 100)}%</div>
      <div class="mg-verdict">{label ?? verdict}</div>
      <Btn cls="primary big" onClick={() => onDone(score, extra)}><kbd>␣</kbd>{T('Continuer', 'Continue')}</Btn>
    </div>
  );
}

// ───────────────────────────── timing (heist lockpick / match shots) ─────────────────────────────
function TimingGame({ onDone, rounds = 3, kind }: { onDone: Done; rounds?: number; kind: 'heist' | 'match' }) {
  const [round, setRound] = useState(0);
  const [pos, setPos] = useState(0);
  const [hits, setHits] = useState<number[]>([]);
  const [flash, setFlash] = useState<string | null>(null);
  const dir = useRef(1);
  const zone = useRef({ c: 0.5, w: 0.22 });
  const speed = 0.9 + round * 0.45;
  const done = hits.length >= rounds;
  useEffect(() => { zone.current = { c: 0.2 + Math.random() * 0.6, w: Math.max(0.08, 0.22 - round * 0.05) }; }, [round]);
  useFrame((dt) => {
    setPos((p) => { let n = p + dir.current * dt * speed; if (n > 1) { n = 1; dir.current = -1; } if (n < 0) { n = 0; dir.current = 1; } return n; });
  }, !done);
  const press = () => {
    if (done) return;
    const d = Math.abs(pos - zone.current.c);
    const q = d <= zone.current.w / 2 ? 1 - (d / (zone.current.w / 2)) * 0.4 : 0;
    setHits((h) => [...h, q]);
    setFlash(q > 0 ? (q > 0.85 ? '✨ PARFAIT' : '✔') : '✖');
    if (q > 0) sfx.coin(); else sfx.bad();
    setTimeout(() => setFlash(null), 450);
    setRound((r) => r + 1);
  };
  useKey((e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); press(); } }, [pos, done]);
  if (done) return <Finish score={hits.reduce((a, b) => a + b, 0) / rounds} onDone={onDone} />;
  const z = zone.current;
  return (
    <div class="mg-timing" onClick={press}>
      <p class="mg-help">{kind === 'heist' ? T('Crochète la serrure : appuie sur Espace quand l\'aiguille est dans la zone verte.', 'Pick the lock: press Space when the needle is in the green zone.') : T('Tire au bon moment : Espace quand le curseur est dans la cible.', 'Shoot at the right time: Space when the cursor is in the target.')}</p>
      <div class="mg-round">{kind === 'heist' ? '🔐' : '⚽'} {round + 1} / {rounds}</div>
      <div class="mg-bar">
        <div class="mg-zone" style={{ left: `${(z.c - z.w / 2) * 100}%`, width: `${z.w * 100}%` }} />
        <div class="mg-needle" style={{ left: `${pos * 100}%` }} />
      </div>
      {flash && <div class="mg-flash">{flash}</div>}
    </div>
  );
}

// ───────────────────────────── getaway (lane dodge) ─────────────────────────────
function Getaway({ onDone }: { onDone: Done }) {
  const [lane, setLane] = useState(1);
  const [obs, setObs] = useState<{ lane: number; y: number; id: number }[]>([]);
  const [crashes, setCrashes] = useState(0);
  const [time, setTime] = useState(0);
  const spawn = useRef(0);
  const nid = useRef(0);
  const DUR = 12;
  const done = time >= DUR || crashes >= 3;
  useFrame((dt) => {
    setTime((t) => t + dt);
    spawn.current -= dt;
    setObs((os) => {
      let n = os.map((o) => ({ ...o, y: o.y + dt * (0.55 + time * 0.05) })).filter((o) => o.y < 1.15);
      if (spawn.current <= 0) { spawn.current = Math.max(0.35, 0.9 - time * 0.04); n.push({ lane: Math.floor(Math.random() * 3), y: -0.1, id: nid.current++ }); }
      const hit = n.find((o) => o.lane === lane && o.y > 0.78 && o.y < 0.92);
      if (hit) { setCrashes((c) => c + 1); sfx.bad(); n = n.filter((o) => o !== hit); }
      return n;
    });
  }, !done);
  useKey((e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') setLane((l) => Math.max(0, l - 1));
    if (e.code === 'ArrowRight' || e.code === 'KeyD') setLane((l) => Math.min(2, l + 1));
  }, []);
  if (done) return <Finish score={crashes >= 3 ? 0.1 : 1 - crashes * 0.3} onDone={onDone} label={crashes >= 3 ? T('Encastré dans un camion de glaces.', 'Crashed into an ice cream truck.') : undefined} />;
  return (
    <div class="mg-road">
      <p class="mg-help">{T('Fuis la police ! ← → pour changer de voie.', 'Escape the cops! ← → to change lanes.')} 💥 {crashes}/3 · ⏱️ {Math.ceil(DUR - time)}s</p>
      <div class="road">
        {[0, 1, 2].map((i) => <div key={i} class="lane" onClick={() => setLane(i)} />)}
        {obs.map((o) => <div key={o.id} class="obstacle" style={{ left: `${o.lane * 33.3 + 8}%`, top: `${o.y * 100}%` }}>{['🚓', '🚧', '🛻', '🐄'][o.id % 4]}</div>)}
        <div class="player-car" style={{ left: `${lane * 33.3 + 8}%` }}>🏎️</div>
      </div>
    </div>
  );
}

// ───────────────────────────── escape (stealth grid) ─────────────────────────────
const GW = 9, GH = 9;
function Escape({ onDone }: { onDone: Done }) {
  const [p, setP] = useState({ x: 4, y: 8 });
  const [moves, setMoves] = useState(0);
  const [guards, setGuards] = useState(() => [1, 3, 5, 7].map((y, i) => ({ x: (i * 3) % GW, y, d: i % 2 ? 1 : -1 })));
  const [state, setState] = useState<'play' | 'won' | 'caught'>('play');
  const walls = useRef(new Set(['2,2', '6,2', '0,4', '4,4', '8,4', '2,6', '6,6']));
  const seen = (g: { x: number; y: number; d: number }, x: number, y: number) => y === g.y && (x === g.x || x === g.x + g.d || x === g.x + 2 * g.d);
  const step = (dx: number, dy: number) => {
    if (state !== 'play') return;
    const nx = Math.max(0, Math.min(GW - 1, p.x + dx)), ny = Math.max(0, Math.min(GH - 1, p.y + dy));
    if (walls.current.has(`${nx},${ny}`)) return;
    const ng = guards.map((g) => { let x = g.x + g.d, d = g.d; if (x < 0 || x >= GW || walls.current.has(`${x},${g.y}`)) { d = -d; x = g.x + d; } return { ...g, x, d }; });
    setGuards(ng);
    setP({ x: nx, y: ny });
    setMoves((m) => m + 1);
    sfx.hover();
    if (ng.some((g) => seen(g, nx, ny))) { setState('caught'); sfx.bad(); return; }
    if (ny === 0) { setState('won'); sfx.good(); }
  };
  useKey((e) => {
    const k = e.code;
    if (k === 'ArrowUp' || k === 'KeyW' || k === 'KeyZ') step(0, -1);
    if (k === 'ArrowDown' || k === 'KeyS') step(0, 1);
    if (k === 'ArrowLeft' || k === 'KeyA' || k === 'KeyQ') step(-1, 0);
    if (k === 'ArrowRight' || k === 'KeyD') step(1, 0);
    if (k === 'Space') step(0, 0);
  }, [p, guards, state]);
  useEffect(() => { if (moves >= 40 && state === 'play') setState('caught'); }, [moves]);
  if (state !== 'play') return <Finish score={state === 'won' ? Math.max(0.6, 1 - moves / 80) : 0.05} onDone={onDone} label={state === 'won' ? T('Tu as atteint le mur d\'enceinte !', 'You reached the outer wall!') : T('Un projecteur t\'a repéré.', 'A searchlight spotted you.')} />;
  return (
    <div class="mg-escape">
      <p class="mg-help">{T('Atteins la ligne du haut sans croiser le regard des gardiens (ils voient 2 cases devant eux). Flèches pour bouger, Espace pour attendre.', 'Reach the top row without entering a guard\'s view (2 cells ahead). Arrows to move, Space to wait.')} ({40 - moves})</p>
      <div class="grid" style={{ gridTemplateColumns: `repeat(${GW}, 1fr)` }}>
        {Array.from({ length: GW * GH }, (_, i) => {
          const x = i % GW, y = Math.floor(i / GW);
          const g = guards.find((g) => g.x === x && g.y === y);
          const lit = guards.some((g) => seen(g, x, y));
          const wall = walls.current.has(`${x},${y}`);
          return (
            <div key={i} class={`cell ${wall ? 'wall' : ''} ${lit ? 'lit' : ''} ${y === 0 ? 'exit' : ''}`} onClick={() => { const dx = Math.sign(x - p.x), dy = Math.sign(y - p.y); if (Math.abs(x - p.x) + Math.abs(y - p.y) === 1) step(dx, dy); }}>
              {p.x === x && p.y === y ? '🏃' : g ? (g.d > 0 ? '👮' : '👮') : wall ? '🧱' : y === 0 ? '🌳' : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────── argument games (trial, case, interrogation, date) ─────────────────────────────
type Opt = { fr: string; en: string; v: number };
const ARG: Record<'trial' | 'case' | 'interrogation' | 'date', { intro: Opt; rounds: Opt[][]; meter: Opt }> = {
  trial: {
    intro: { fr: 'Le jury te fixe. Trois tours pour le convaincre.', en: 'The jury stares at you. Three rounds to convince them.', v: 0 }, meter: { fr: 'Jury', en: 'Jury', v: 0 },
    rounds: [
      [{ fr: '« J\'étais chez ma grand-mère ce soir-là. »', en: '"I was at my grandma\'s that night."', v: 12 }, { fr: 'Pleurer à chaudes larmes', en: 'Burst into tears', v: 6 }, { fr: 'Accuser le procureur', en: 'Accuse the prosecutor', v: -10 }],
      [{ fr: 'Citer la Constitution (n\'importe quel article)', en: 'Quote the Constitution (any article)', v: 8 }, { fr: 'Montrer une photo de ton chat', en: 'Show a photo of your cat', v: 14 }, { fr: 'Menacer un juré du regard', en: 'Stare down a juror', v: -15 }],
      [{ fr: '« Si le gant ne va pas, il faut acquitter. »', en: '"If the glove doesn\'t fit, you must acquit."', v: 16 }, { fr: 'Chanter l\'hymne national', en: 'Sing the national anthem', v: 5 }, { fr: 'Avouer… à moitié', en: 'Half-confess', v: -6 }],
    ],
  },
  case: {
    intro: { fr: 'Ton client est coupable, tout le monde le sait. À toi de jouer.', en: 'Your client is guilty, everyone knows it. Your move.', v: 0 }, meter: { fr: 'Jury', en: 'Jury', v: 0 },
    rounds: [
      [{ fr: 'Attaquer la crédibilité du témoin', en: 'Attack the witness\'s credibility', v: 14 }, { fr: 'Faire une blague', en: 'Crack a joke', v: 4 }, { fr: 'Lire le mauvais dossier', en: 'Read the wrong file', v: -12 }],
      [{ fr: 'Présenter une preuve surprise', en: 'Present surprise evidence', v: 16 }, { fr: 'Objection ! (sans raison)', en: 'Objection! (no reason)', v: -4 }, { fr: 'Faire pleurer la mère du client', en: 'Make the client\'s mom cry', v: 9 }],
      [{ fr: 'Plaidoirie finale enflammée', en: 'Fiery closing argument', v: 15 }, { fr: 'PowerPoint de 80 slides', en: '80-slide PowerPoint', v: -8 }, { fr: 'Citation de Johnny Hallyday', en: 'Quote a pop song', v: 6 }],
    ],
  },
  interrogation: {
    intro: { fr: 'Le suspect transpire dans la salle d\'interrogatoire.', en: 'The suspect sweats in the interrogation room.', v: 0 }, meter: { fr: 'Pression', en: 'Pressure', v: 0 },
    rounds: [
      [{ fr: 'Gentil flic : lui offrir un café', en: 'Good cop: offer coffee', v: 9 }, { fr: 'Méchant flic : frapper la table', en: 'Bad cop: slam the table', v: 12 }, { fr: 'Lui demander son signe astro', en: 'Ask his star sign', v: -5 }],
      [{ fr: 'Montrer les preuves', en: 'Show the evidence', v: 15 }, { fr: 'Bluffer : « Ton complice a parlé »', en: 'Bluff: "Your partner talked"', v: 13 }, { fr: 'Manger son sandwich devant lui', en: 'Eat his sandwich in front of him', v: 6 }],
      [{ fr: 'Promettre un arrangement', en: 'Promise a deal', v: 14 }, { fr: 'Le laisser seul 3 heures', en: 'Leave him alone 3 hours', v: 8 }, { fr: 'Pleurer avec lui', en: 'Cry with him', v: -6 }],
    ],
  },
  date: {
    intro: { fr: 'Premier rencard. Ne gâche pas tout.', en: 'First date. Don\'t blow it.', v: 0 }, meter: { fr: 'Charme', en: 'Charm', v: 0 },
    rounds: [
      [{ fr: 'Complimenter son sourire', en: 'Compliment their smile', v: 12 }, { fr: 'Parler de ton ex pendant 20 min', en: 'Talk about your ex for 20 min', v: -14 }, { fr: 'Commander pour deux', en: 'Order for both of you', v: 3 }],
      [{ fr: 'Raconter une anecdote drôle', en: 'Tell a funny story', v: 13 }, { fr: 'Montrer tes cryptos', en: 'Show off your crypto', v: -8 }, { fr: 'Poser des questions sur sa vie', en: 'Ask about their life', v: 11 }],
      [{ fr: 'Proposer un dernier verre', en: 'Suggest one last drink', v: 10 }, { fr: 'Partager l\'addition', en: 'Split the bill', v: 6 }, { fr: 'Partir en courant', en: 'Run away', v: -12 }],
    ],
  },
};

function ArgueGame({ onDone, kind, l }: { onDone: Done; kind: keyof typeof ARG; l: Life }) {
  void rev.value;
  const cfg = ARG[kind];
  const [round, setRound] = useState(0);
  const [meter, setMeter] = useState(40);
  const [last, setLast] = useState<number | null>(null);
  const lg = lang.value;
  const opts = cfg.rounds[round] ?? [];
  const shuffled = useRef(cfg.rounds.map((r) => r.map((o) => o).sort(() => Math.random() - 0.5)));
  const pick = (o: Opt) => {
    const skill = kind === 'date' ? l.stats.looks : l.stats.smarts;
    const delta = Math.round(o.v * (0.7 + Math.random() * 0.6) + (skill - 50) / 10);
    setMeter((m) => Math.max(0, Math.min(100, m + delta)));
    setLast(delta);
    if (delta > 0) sfx.good(); else sfx.bad();
    setTimeout(() => setLast(null), 700);
    setRound((r) => r + 1);
  };
  useKey((e) => { const m = /^Digit([1-3])$/.exec(e.code); if (m && round < 3) pick(shuffled.current[round][+m[1] - 1]); }, [round]);
  if (round >= cfg.rounds.length) return <Finish score={meter / 100} onDone={onDone} />;
  return (
    <div class="mg-argue">
      <p class="mg-help">{cfg.intro[lg]}</p>
      <div class="kv"><span>{cfg.meter[lg]}</span><b>{meter}%</b></div>
      <div class="bar"><div class="bar-fill" style={{ width: `${meter}%`, background: meter > 60 ? '#23B26D' : meter > 35 ? '#FFB703' : '#E5484D' }} /></div>
      {last !== null && <div class={`mg-flash ${last > 0 ? 'up' : 'down'}`}>{last > 0 ? `+${last}` : last}</div>}
      <div class="ev-choices" style={{ marginTop: '14px' }}>
        {shuffled.current[round].map((o, i) => <button key={i} class="btn choice" onClick={() => pick(o)}><kbd>{i + 1}</kbd><span class="ch-label">{o[lg]}</span></button>)}
      </div>
      <div class="mg-round">{round + 1} / 3</div>
      {void opts}
    </div>
  );
}

// ───────────────────────────── blackjack ─────────────────────────────
const SUITS = ['♠', '♥', '♦', '♣'];
function cardVal(cards: number[]) {
  let v = 0, aces = 0;
  for (const c of cards) { const r = c % 13; if (r === 0) { aces++; v += 11; } else v += Math.min(10, r + 1); }
  while (v > 21 && aces) { v -= 10; aces--; }
  return v;
}
function cardLabel(c: number) { const r = c % 13; return `${['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][r]}${SUITS[Math.floor(c / 13) % 4]}`; }

function Blackjack({ onDone, l }: { onDone: Done; l: Life }) {
  void rev.value;
  const c = country(content, l.country);
  const cash = Math.max(0, l.money);
  const bets = [0.05, 0.15, 0.4].map((f) => Math.max(Math.round(10 * c.price * c.currency.rate), Math.round(cash * f)));
  const [bet, setBet] = useState<number | null>(null);
  const deck = useRef<number[]>([]);
  const draw = () => { if (!deck.current.length) deck.current = Array.from({ length: 52 }, (_, i) => i).sort(() => Math.random() - 0.5); return deck.current.pop()!; };
  const [me, setMe] = useState<number[]>([]);
  const [dealer, setDealer] = useState<number[]>([]);
  const [end, setEnd] = useState<null | { net: number; msg: string }>(null);
  const start = (b: number) => { setBet(b); setMe([draw(), draw()]); setDealer([draw(), draw()]); sfx.card(); };
  const finish = (mine: number[], b: number) => {
    const d = [...dealer];
    while (cardVal(d) < 17) d.push(draw());
    setDealer(d);
    const mv = cardVal(mine), dv = cardVal(d);
    let net = 0, msg = '';
    if (mv > 21) { net = -b; msg = T('Sauté !', 'Bust!'); }
    else if (dv > 21 || mv > dv) { net = mv === 21 && mine.length === 2 ? Math.round(b * 1.5) : b; msg = T('Gagné !', 'You win!'); }
    else if (mv === dv) { net = 0; msg = T('Égalité.', 'Push.'); }
    else { net = -b; msg = T('La banque gagne.', 'Dealer wins.'); }
    setEnd({ net, msg });
    if (net > 0) sfx.coin(); else if (net < 0) sfx.bad();
  };
  const hit = () => { const m = [...me, draw()]; setMe(m); sfx.card(); if (cardVal(m) > 21) finish(m, bet!); };
  const double = () => { const b = bet! * 2; setBet(b); const m = [...me, draw()]; setMe(m); finish(m, b); };
  useKey((e) => { if (!bet || end) return; if (e.code === 'KeyH' || e.code === 'Digit1') hit(); if (e.code === 'KeyS' || e.code === 'Digit2') finish(me, bet); }, [bet, me, end]);
  if (bet === null) {
    return (
      <div class="mg-bj">
        <p class="mg-help">{T('Choisis ta mise.', 'Place your bet.')} ({formatMoney(cash, c, lang.value)})</p>
        <div class="row-btns">{bets.map((b, i) => <Btn key={i} cls="primary" disabled={b > cash} onClick={() => start(b)}>🪙 {formatMoney(b, c, lang.value)}</Btn>)}</div>
        <Btn cls="ghost" onClick={() => onDone(0, 0)}>{T('Quitter la table', 'Leave the table')}</Btn>
      </div>
    );
  }
  const hideHole = !end;
  return (
    <div class="mg-bj">
      <div class="bj-row"><span>{T('Croupier', 'Dealer')} {hideHole ? '' : `(${cardVal(dealer)})`}</span><div class="cards">{dealer.map((cd, i) => <span key={i} class={`card ${[1, 2].includes(Math.floor(cd / 13) % 4) ? 'red' : ''}`}>{hideHole && i === 1 ? '🂠' : cardLabel(cd)}</span>)}</div></div>
      <div class="bj-row"><span>{T('Toi', 'You')} ({cardVal(me)})</span><div class="cards">{me.map((cd, i) => <span key={i} class={`card ${[1, 2].includes(Math.floor(cd / 13) % 4) ? 'red' : ''}`}>{cardLabel(cd)}</span>)}</div></div>
      {end ? (
        <div class="mg-finish"><div class="mg-verdict">{end.msg} {end.net !== 0 && formatMoney(end.net, c, lang.value)}</div><Btn cls="primary big" onClick={() => onDone(end.net > 0 ? 1 : end.net === 0 ? 0.5 : 0, end.net)}>{T('Continuer', 'Continue')}</Btn></div>
      ) : (
        <div class="row-btns">
          <Btn cls="primary" onClick={hit}><kbd>1</kbd>{T('Carte', 'Hit')}</Btn>
          <Btn onClick={() => finish(me, bet)}><kbd>2</kbd>{T('Rester', 'Stand')}</Btn>
          {me.length === 2 && bet * 2 <= cash && <Btn onClick={double}>×2</Btn>}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────── surgery (click the points in order) ─────────────────────────────
function Surgery({ onDone }: { onDone: Done }) {
  const pts = useRef(Array.from({ length: 6 }, () => ({ x: 15 + Math.random() * 70, y: 12 + Math.random() * 76 })));
  const [next, setNext] = useState(0);
  const [errors, setErrors] = useState(0);
  const [time, setTime] = useState(0);
  const done = next >= pts.current.length || time > 14 || errors >= 4;
  useFrame((dt) => setTime((t) => t + dt), !done);
  if (done) {
    const s = next >= pts.current.length ? Math.max(0.2, 1 - errors * 0.15 - Math.max(0, time - 6) * 0.04) : next / pts.current.length * 0.4;
    return <Finish score={s} onDone={onDone} label={errors >= 4 ? T('Le patient a giclé comme un tuyau d\'arrosage.', 'The patient sprayed like a garden hose.') : undefined} />;
  }
  return (
    <div class="mg-surgery">
      <p class="mg-help">{T('Incise dans l\'ordre : 1 → 6. Vite, le patient se vide.', 'Cut in order: 1 → 6. Hurry, the patient is bleeding out.')} ⏱️ {Math.max(0, 14 - time).toFixed(1)}s · 🩸 {errors}/4</p>
      <div class="patient" onClick={() => { setErrors((e) => e + 1); sfx.bad(); }}>
        <div class="body-shape">🫁</div>
        {pts.current.map((p, i) => i >= next && (
          <button key={i} class={`pt ${i === next ? 'next' : ''}`} style={{ left: `${p.x}%`, top: `${p.y}%` }} onClick={(e) => { e.stopPropagation(); if (i === next) { setNext(next + 1); sfx.click(); } else { setErrors((x) => x + 1); sfx.bad(); } }}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────── cooking (memory) ─────────────────────────────
const INGR = ['🍅', '🧀', '🥩', '🧅', '🍄', '🥕', '🌶️', '🥚', '🐟', '🧄', '🍋', '🥖'];
function Cooking({ onDone }: { onDone: Done }) {
  const recipe = useRef(INGR.slice().sort(() => Math.random() - 0.5).slice(0, 4));
  const board = useRef([...recipe.current, ...INGR.filter((x) => !recipe.current.includes(x)).sort(() => Math.random() - 0.5).slice(0, 4)].sort(() => Math.random() - 0.5));
  const [phase, setPhase] = useState<'show' | 'pick'>('show');
  const [picked, setPicked] = useState<string[]>([]);
  useEffect(() => { const t = setTimeout(() => setPhase('pick'), 2600); return () => clearTimeout(t); }, []);
  if (picked.length >= 4) {
    const ok = picked.filter((p, i) => recipe.current[i] === p).length;
    const inSet = picked.filter((p) => recipe.current.includes(p)).length;
    return <Finish score={(ok * 0.6 + inSet * 0.4) / 4} onDone={onDone} />;
  }
  return (
    <div class="mg-cook">
      <p class="mg-help">{phase === 'show' ? T('Mémorise la recette du chef !', 'Memorise the chef\'s recipe!') : T('Ajoute les ingrédients dans l\'ordre.', 'Add the ingredients in order.')}</p>
      <div class="recipe">{(phase === 'show' ? recipe.current : picked.concat(Array(4 - picked.length).fill('❔'))).map((x, i) => <span key={i} class="ingr big">{x}</span>)}</div>
      {phase === 'pick' && <div class="ingr-grid">{board.current.map((x) => <button key={x} class="ingr" disabled={picked.includes(x)} onClick={() => { setPicked([...picked, x]); sfx.click(); }}>{x}</button>)}</div>}
    </div>
  );
}

export function Minigame({ game, title, onDone, l }: { game: MinigameKind; title: string; onDone: Done; l: Life }) {
  void rev.value;
  // Full-screen arena games
  switch (game) {
    case 'getaway': return <CarChase onDone={onDone} l={l} />;
    case 'karaoke': case 'concert': case 'dj': return <Rhythm onDone={onDone} l={l} variant={game} />;
    case 'hack': return <Hack onDone={onDone} l={l} />;
    case 'lockpick': case 'heist': return <Lockpick onDone={onDone} l={l} variant={game} />;
    case 'fight': return <Fight onDone={onDone} l={l} />;
    case 'beerpong': return <BeerPong onDone={onDone} l={l} />;
    case 'trading': return <Trading onDone={onDone} l={l} />;
    case 'slots': return <Slots onDone={onDone} l={l} />;
    case 'penalty': case 'match': return <Penalty onDone={onDone} l={l} />;
    case 'surgery': return <Surgery2 onDone={onDone} l={l} />;
    case 'trial': case 'case': case 'interrogation': case 'date': return <Debate onDone={onDone} l={l} variant={game} />;
    case 'blackjack': return <Blackjack2 onDone={onDone} l={l} />;
    case 'escape': return <Escape2 onDone={onDone} l={l} />;
    case 'cooking': return <Cooking2 onDone={onDone} l={l} />;
  }
  let body;
  switch (game) {
    case 'heist': body = <TimingGame kind="heist" onDone={onDone} />; break;
    case 'match': body = <TimingGame kind="match" rounds={5} onDone={onDone} />; break;
    case 'getaway': body = <Getaway onDone={onDone} />; break;
    case 'escape': body = <Escape onDone={onDone} />; break;
    case 'blackjack': body = <Blackjack onDone={onDone} l={l} />; break;
    case 'surgery': body = <Surgery onDone={onDone} />; break;
    case 'cooking': body = <Cooking onDone={onDone} />; break;
    case 'trial': case 'case': case 'interrogation': case 'date': body = <ArgueGame kind={game} onDone={onDone} l={l} />; break;
  }
  return (
    <div class="modal-back">
      <div class="sheet glass pop-in minigame">
        <div class="sheet-head"><h2><span class="sheet-icon">🎮</span>{title}</h2></div>
        <div class="sheet-body">{body}</div>
      </div>
    </div>
  );
}
