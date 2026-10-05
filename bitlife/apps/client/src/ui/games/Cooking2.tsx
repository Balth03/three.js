// Kitchen nightmare: Overcooked-lite. Tickets pile up, chop / fry / plate under a screaming chef, pans catch fire.
import { useRef } from 'preact/hooks';
import { useGame, useCanvas, useKeys, Arena, tr, glow, roundRect, type GameProps } from './kit.tsx';
import { sfx, synth } from '../../audio.ts';
import { lang } from '../../state.ts';

const DURATION = 40;
type L = [string, string];
const ING: { e: string; n: L }[] = [
  { e: '🥩', n: ['Viande', 'Meat'] }, { e: '🍅', n: ['Tomate', 'Tomato'] }, { e: '🧀', n: ['Fromage', 'Cheese'] },
  { e: '🥬', n: ['Salade', 'Lettuce'] }, { e: '🐟', n: ['Poisson', 'Fish'] }, { e: '🍝', n: ['Pâtes', 'Pasta'] },
];
type Step = { k: 'ing'; i: number } | { k: 'chop'; n: number } | { k: 'fry'; sp: number } | { k: 'plate' };
interface Dish { e: string; n: L; steps: Step[] }
const I = (i: number): Step => ({ k: 'ing', i });
const C = (n: number): Step => ({ k: 'chop', n });
const F = (sp = 1): Step => ({ k: 'fry', sp });
const P: Step = { k: 'plate' };
const DISHES: Dish[] = [
  { e: '🍔', n: ['Burger de la honte', 'Burger of shame'], steps: [I(0), F(1), I(2), I(3), P] },
  { e: '🥩', n: ['Steak bleu (il bouge)', 'Rare steak (it moves)'], steps: [I(0), F(1.2), P] },
  { e: '🥗', n: ['Salade triste', 'Sad salad'], steps: [I(3), C(4), I(1), P] },
  { e: '🍝', n: ['Pâtes mayo du divorce', 'Divorce mayo pasta'], steps: [I(5), F(1.1), I(2), P] },
  { e: '🐟', n: ['Fish & chips radioactif', 'Radioactive fish & chips'], steps: [I(4), C(4), F(1), P] },
  { e: '🥪', n: ['Croque sans monsieur', 'Croque-no-monsieur'], steps: [I(2), I(0), F(1.1), P] },
  { e: '🍕', n: ['Pizza crime de guerre', 'War-crime pizza'], steps: [I(1), I(2), C(3), F(0.9), P] },
  { e: '🍖', n: ['Tartare… cuit', 'Tartare… cooked'], steps: [I(0), C(5), F(1.2), P] },
  { e: '🍲', n: ['Ratatouille surgelée', 'Frozen ratatouille'], steps: [I(1), C(4), I(3), F(1), P] },
  { e: '🍣', n: ['Sushi aux pâtes', 'Pasta sushi'], steps: [I(4), C(4), I(5), P] },
];
const LINES: Record<string, L[]> = {
  start: [['SERVICE ! Et que ça saute !', 'SERVICE! Chop chop!']],
  wrong: [['C\'EST CRU ! Ça meugle encore !', 'IT\'S RAW! It\'s still mooing!'], ['Mon chien cuisine mieux. Et il est mort.', 'My dog cooks better. And he\'s dead.'], ['Espèce de sandwich mal garni !', 'You soggy sandwich!'], ['Tu cuisines avec tes pieds ?!', 'Are you cooking with your feet?!'], ['C\'est quoi ça ? Une scène de crime ?', 'What is this? A crime scene?'], ['BOUGE TON CUL !', 'MOVE YOUR ARSE!'], ['Même la cantine refuserait ça.', 'Even a school canteen would refuse this.'], ['Ferme-la et lis le ticket !', 'Shut up and read the ticket!'], ['T\'es pas cuisinier, t\'es un accident.', 'You\'re not a cook, you\'re an accident.']],
  raw: [['C\'EST CRU ! Il respire encore !', 'IT\'S RAW! It\'s still breathing!'], ['Attends qu\'il dore, patate !', 'Wait till it\'s golden, you potato!']],
  burn: [['Ça sent le cramé… comme ta carrière !', 'Smells burnt… like your career!'], ['T\'AS FOUTU LE FEU, CRÉTIN !', 'YOU SET IT ON FIRE, YOU MUPPET!'], ['Appelez les pompiers… et ta mère.', 'Call the fire brigade… and your mum.']],
  lost: [['Le client est parti. Il a vomi en sortant.', 'The customer left. He puked on the way out.'], ['TABLE {n} ATTEND DEPUIS UN SIÈCLE !', 'TABLE {n} HAS WAITED A CENTURY!'], ['Ils commandent sur Uber Eats. LA HONTE.', 'They\'re ordering Uber Eats. SHAME.']],
  serve: [['Pas mal… pour un amateur.', 'Not bad… for an amateur.'], ['Enfin ! Un miracle !', 'Finally! A miracle!'], ['OUI ! Ça, c\'est de la cuisine !', 'YES! THAT is cooking!'], ['Je… suis presque fier. Beurk.', 'I\'m… almost proud. Ugh.']],
  perfect: [['Cuisson parfaite. Je déteste l\'admettre.', 'Perfect sear. I hate to admit it.'], ['Doré comme mon Rolex. Joli.', 'Golden like my Rolex. Nice.']],
  idle: [['ON DORT ?! SERVICE !', 'ARE WE SLEEPING?! SERVICE!'], ['Les tickets s\'empilent, champion !', 'Tickets are piling up, champ!']],
  busy: [['La poêle est prise, génie !', 'The pan is busy, genius!']],
};

interface Ticket { id: number; d: Dish; step: number; chop: number; pat: number; max: number; table: number; x: number; y: number; out: number; fail: boolean; plate: string[] }
interface Part { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; col: string; kind: 'smoke' | 'fire' | 'bit' | 'spark' | 'steam' | 'text'; txt?: string }
interface Hit { id: string; x: number; y: number; w: number; h: number }

export function Cooking2({ onDone }: GameProps) {
  const g = useGame({ duration: DURATION, onDone });
  const gr = useRef(g); gr.current = g;
  const s = useRef({
    tickets: [] as Ticket[], gone: [] as Ticket[], active: -1, nid: 1, spawn: 0.4, pan: { owner: -1, heat: 0, fire: 0, item: '', sp: 1 },
    served: 0, failed: 0, burns: 0, perfect: 0, mistakes: 0, tips: 0, anger: 0.2, yell: 0, line: LINES.start[0] as L, lineT: 0, lineCd: 0, idle: 0,
    chopAnim: 0, parts: [] as Part[], hits: [] as Hit[], ended: false, started: false, plateBump: 0, lay: { w: 0, h: 0 }, bg: null as HTMLCanvasElement | null, bgKey: '', shakeChef: 0,
  });
  if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__cook = s.current;
  const lg = () => (lang.value === 'fr' ? 0 : 1);
  const toPct = (x: number, y: number): [number, number] => {
    const r = cref.current?.getBoundingClientRect();
    if (!r) return [50, 50];
    return [((r.left + x) / window.innerWidth) * 100, ((r.top + y) / window.innerHeight) * 100];
  };
  const say = (k: string, force = false, n = 0) => {
    const st = s.current;
    if (!force && st.lineCd > 0 && (k === 'idle' || st.lineCd > 1.0)) return;
    const a = LINES[k]; if (!a) return;
    const l = a[Math.floor(Math.random() * a.length)];
    st.line = [l[0].replace('{n}', String(n)), l[1].replace('{n}', String(n))]; st.lineT = 0; st.lineCd = 1.6;
    const angry = k !== 'serve' && k !== 'perfect' && k !== 'start';
    st.yell = angry ? 1 : 0.5; st.shakeChef = angry ? 0.5 : 0;
    if (angry) { st.anger = Math.min(1, st.anger + 0.18); synth.tone(180 + Math.random() * 60, 0.25, 'sawtooth', 0.05, 0, 1.6); }
    sfx.blips(st.line[0]);
  };
  const L = () => {
    const { w, h } = s.current.lay;
    const leftW = w * 0.77;
    const counterY = h * 0.36, counterH = h * 0.31;
    const st3 = [leftW * 0.17, leftW * 0.5, leftW * 0.83];
    return { w, h, leftW, counterY, counterH, board: { x: st3[0], y: counterY + counterH * 0.5 }, pan: { x: st3[1], y: counterY + counterH * 0.52 }, plate: { x: st3[2], y: counterY + counterH * 0.5 }, binY: h * 0.74, binH: h * 0.22 };
  };
  const cur = () => { const st = s.current; return st.tickets.find((t) => t.id === st.active) ?? st.tickets[0]; };
  const puff = (x: number, y: number, kind: Part['kind'], n: number, col = '#fff') => {
    const st = s.current;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = kind === 'bit' ? 80 + Math.random() * 160 : kind === 'spark' ? 60 + Math.random() * 120 : 10 + Math.random() * 30;
      st.parts.push({ x: x + (Math.random() - 0.5) * 20, y, vx: Math.cos(a) * sp, vy: kind === 'smoke' || kind === 'steam' || kind === 'fire' ? -30 - Math.random() * 50 : Math.sin(a) * sp - 120, life: 0, max: kind === 'smoke' ? 1.6 + Math.random() : kind === 'fire' ? 0.5 + Math.random() * 0.4 : 0.6 + Math.random() * 0.4, size: kind === 'smoke' ? 8 + Math.random() * 10 : kind === 'fire' ? 6 + Math.random() * 10 : 2 + Math.random() * 4, col, kind });
    }
  };
  const mistake = (label: string, k = 'wrong') => {
    const st = s.current, G = gr.current, t = cur(), l = L();
    st.mistakes++;
    if (t) t.pat = Math.max(0.5, t.pat - 1.5);
    G.miss(); G.shake();
    const [x, y] = toPct(l.leftW / 2, l.counterY - 10); G.float(label, x, y, '#ff4d6d', true);
    say(k);
  };
  const advance = (t: Ticket) => {
    t.step++; t.chop = 0;
    if (t.d.steps[t.step]?.k === 'plate') synth.tone(1200, 0.08, 'triangle', 0.06);
  };
  const serve = (t: Ticket) => {
    const st = s.current, G = gr.current, l = L();
    st.served++; t.out = 0.0001; st.gone.push(t); st.tickets = st.tickets.filter((x) => x !== t);
    const tip = Math.round(5 + (t.pat / t.max) * 20);
    st.tips += tip; st.anger = Math.max(0, st.anger - 0.25); st.plateBump = 1; st.idle = 0;
    const [x, y] = toPct(l.plate.x, l.plate.y - 30);
    G.hit('perfect'); G.add(200 + tip * 10, `+${tip} 💰`, x, y, '#ffd166'); G.burst(x, y, '#ffd166', 28); G.flash('#ffd166');
    sfx.cash(); synth.tone(1568, 0.15, 'triangle', 0.07, 0.1); synth.tone(2093, 0.25, 'triangle', 0.07, 0.18);
    say('serve', true);
    const nx = st.tickets[0]; st.active = nx ? nx.id : -1;
  };
  const act = (a: string) => {
    const st = s.current, G = gr.current, l = L();
    if (G.phase !== 'play' || st.ended) return;
    st.idle = 0;
    if (a.startsWith('tk')) { const id = +a.slice(2); if (st.tickets.some((t) => t.id === id)) { st.active = id; sfx.click(); } return; }
    if (a === 'next' || a === 'prev') {
      if (st.tickets.length < 2) return;
      const i = Math.max(0, st.tickets.findIndex((t) => t.id === cur()?.id));
      const j = (i + (a === 'next' ? 1 : st.tickets.length - 1)) % st.tickets.length;
      st.active = st.tickets[j].id; sfx.click(); return;
    }
    const t = cur();
    if (!t) { sfx.miss(); return; }
    const step = t.d.steps[t.step];
    if (!step) return;
    if (a.startsWith('ing')) {
      const i = +a.slice(3);
      if (step.k === 'ing' && step.i === i) {
        advance(t); t.plate.push(ING[i].e);
        G.hit('good'); G.add(40);
        const [x, y] = toPct(l.plate.x, l.plate.y); G.burst(x, y, '#ffffff', 10);
        synth.tone(500 + i * 90, 0.08, 'sine', 0.12, 0, 1.8); st.plateBump = 0.6;
      } else mistake(tr(`PAS DE ${ING[i].n[0].toUpperCase()} ICI !`, `NO ${ING[i].n[1].toUpperCase()} HERE!`));
    } else if (a === 'chop') {
      if (step.k !== 'chop') { mistake(tr('ON COUPE PAS ÇA !', 'DON\'T CHOP THAT!')); return; }
      t.chop++; st.chopAnim = 1;
      puff(l.board.x, l.board.y - 10, 'bit', 5, ['#e63946', '#2a9d8f', '#f4a261', '#ffd166'][t.chop % 4]);
      synth.noise(0.05, 0.25, 900); synth.tone(140, 0.06, 'square', 0.08, 0, 0.6);
      G.add(15);
      if (t.chop >= step.n) { advance(t); G.hit('good'); const [x, y] = toPct(l.board.x, l.board.y - 40); G.float(tr('ÉMINCÉ !', 'CHOPPED!'), x, y, '#7dffbf'); }
    } else if (a === 'fry') {
      const pan = st.pan;
      if (pan.owner !== -1 && pan.owner !== t.id) {
        const owner = st.tickets.find((x) => x.id === pan.owner);
        if (!owner || pan.fire > 0) { pan.owner = -1; pan.heat = 0; pan.fire = 0; } else { say('busy', true); sfx.miss(); return; }
      }
      if (step.k !== 'fry') { mistake(tr('PAS À LA POÊLE !', 'NOT IN THE PAN!')); return; }
      if (pan.owner === -1) {
        pan.owner = t.id; pan.heat = 0; pan.fire = 0; pan.sp = step.sp; pan.item = t.plate[t.plate.length - 1] ?? t.d.e;
        synth.noise(0.4, 0.12, 3000); sfx.fire();
        return;
      }
      if (pan.fire > 0) { pan.owner = -1; pan.heat = 0; pan.fire = 0; sfx.whoosh(); return; }
      const hh = pan.heat;
      const [x, y] = toPct(l.pan.x, l.pan.y - 60);
      if (hh < 0.45) { st.mistakes++; G.miss(); G.float(tr('CRU !', 'RAW!'), x, y, '#ff8fa3', true); say('raw'); return; }
      const perfect = hh >= 0.62 && hh <= 0.86;
      pan.owner = -1; pan.heat = 0;
      advance(t);
      if (perfect) { st.perfect++; G.hit('perfect'); G.add(150, tr('PARFAIT !', 'PERFECT!'), x, y, '#ffd166'); G.burst(x, y, '#ffd166', 22); say('perfect'); synth.tone(1320, 0.1, 'square', 0.07); synth.tone(1760, 0.15, 'square', 0.07, 0.06); }
      else { G.hit('good'); G.add(60, hh < 0.62 ? tr('BIEN', 'OK') : tr('LIMITE !', 'CLOSE!'), x, y, '#fff'); }
      puff(l.pan.x, l.pan.y - 10, 'steam', 8, '#ffffff');
    } else if (a === 'plate') {
      if (step.k !== 'plate') { mistake(tr('C\'EST PAS PRÊT !', 'IT\'S NOT READY!')); return; }
      serve(t);
    }
  };
  useKeys((e) => {
    if (e.repeat) return;
    const k = e.code;
    const m = /^(Digit|Numpad)([1-6])$/.exec(k);
    if (m) act(`ing${+m[2] - 1}`);
    else if (k === 'KeyC') act('chop');
    else if (k === 'KeyF') act('fry');
    else if (k === 'Space' || k === 'Enter') { if (g.phase === 'play') act('plate'); }
    else if (k === 'Tab' || k === 'ArrowRight') act('next');
    else if (k === 'ArrowLeft') act('prev');
  });

  const spawnTicket = () => {
    const st = s.current;
    const d = DISHES[Math.floor(Math.random() * DISHES.length)];
    const el = DURATION - g.time;
    const max = Math.max(13, 19 - el * 0.12) + d.steps.length * 0.8;
    const t: Ticket = { id: st.nid++, d, step: 0, chop: 0, pat: max, max, table: 1 + Math.floor(Math.random() * 24), x: st.lay.w + 100, y: 0, out: 0, fail: false, plate: [] };
    st.tickets.push(t);
    if (st.active === -1) st.active = t.id;
    synth.tone(1760, 0.08, 'sine', 0.08); synth.tone(1760, 0.08, 'sine', 0.08, 0.12);
  };

  const cref = useCanvas((ctx, w, h, dt, t) => {
    const st = s.current;
    st.lay = { w, h };
    const l = L();
    const playing = g.phase === 'play' && !st.ended;
    const G = g;
    if (playing) {
      try {
        if (!st.started) { st.started = true; say('start', true); spawnTicket(); spawnTicket(); st.spawn = 4; }
        const el = DURATION - G.time;
        st.spawn -= dt;
        if (st.spawn <= 0 && st.tickets.length < 4) { spawnTicket(); st.spawn = Math.max(3.4, 5.6 - el * 0.06); }
        st.lineCd -= dt; st.idle += dt;
        if (st.idle > 4) { st.idle = 0; say('idle'); }
        for (const tk of [...st.tickets]) {
          tk.pat -= dt;
          if (tk.pat <= 0) {
            st.failed++; tk.fail = true; tk.out = 0.0001; st.gone.push(tk); st.tickets = st.tickets.filter((x) => x !== tk);
            if (st.pan.owner === tk.id) { st.pan.owner = -1; st.pan.heat = 0; st.pan.fire = 0; }
            if (st.active === tk.id) st.active = st.tickets[0]?.id ?? -1;
            G.miss(); G.flash('#ff1f3d'); sfx.bad(); say('lost', true, tk.table);
            const [x, y] = toPct(Math.min(tk.x, l.leftW - 80), h * 0.2); G.float(tr('COMMANDE PERDUE', 'ORDER LOST'), x, y, '#ff4d6d', true);
          }
        }
        // pan
        const pan = st.pan;
        if (pan.owner !== -1) {
          if (pan.fire > 0) {
            pan.fire += dt;
            if (Math.random() < dt * 30) puff(l.pan.x, l.pan.y - 10, 'fire', 2, Math.random() < 0.5 ? '#ff7b00' : '#ffd000');
            if (Math.random() < dt * 14) puff(l.pan.x, l.pan.y - 40, 'smoke', 1, '#555');
            if (pan.fire > 2.4) { pan.owner = -1; pan.fire = 0; pan.heat = 0; }
          } else {
            pan.heat += (dt * pan.sp) / 1.55;
            if (Math.random() < dt * (6 + pan.heat * 20)) puff(l.pan.x, l.pan.y - 6, 'spark', 1, '#ffe8a3');
            if (pan.heat > 0.9 && Math.random() < dt * 12) puff(l.pan.x, l.pan.y - 30, 'smoke', 1, '#777');
            if (pan.heat >= 1.12) {
              pan.fire = 0.001; st.burns++;
              G.miss(); G.shake(); G.flash('#ff7b00'); sfx.fire(); sfx.scream(); say('burn', true);
              const [x, y] = toPct(l.pan.x, l.pan.y - 70); G.float(tr('🔥 CRAMÉ !', '🔥 BURNT!'), x, y, '#ff7b00', true);
              puff(l.pan.x, l.pan.y - 10, 'fire', 24, '#ff7b00');
            }
          }
        }
        st.anger = Math.max(0, st.anger - dt * 0.03);
        if (G.time <= 0 && !st.ended) {
          st.ended = true;
          const score = (st.served - st.failed * 0.5 - st.burns * 0.25 + st.perfect * 0.1) / 6.5;
          G.end(score, [
            [tr('Plats servis', 'Dishes served'), `🍽️ ${st.served}`],
            [tr('Commandes perdues', 'Orders lost'), String(st.failed)],
            [tr('Poêles cramées', 'Pans torched'), st.burns ? `🔥 × ${st.burns}` : '0'],
            [tr('Cuissons parfaites', 'Perfect sears'), `✨ ${st.perfect}`],
            [tr('Pourboires', 'Tips'), `💰 ${st.tips}`],
          ]);
        }
      } catch { /* never throw */ }
    }
    st.yell = Math.max(0, st.yell - dt * 0.7); st.lineT += dt; st.chopAnim = Math.max(0, st.chopAnim - dt * 6); st.plateBump = Math.max(0, st.plateBump - dt * 3); st.shakeChef = Math.max(0, st.shakeChef - dt);

    // ── background ──
    const key = `${w}x${h}`;
    if (st.bgKey !== key || !st.bg) { st.bg = renderBg(w, h, l); st.bgKey = key; }
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(st.bg, 0, 0, w, h);
    st.hits = [];
    const active = cur();
    const step = active?.d.steps[active.step];

    // ── tickets ──
    const tw = Math.min(200, (l.leftW - 30) / 4 - 10), th = h * 0.25;
    const order = st.tickets;
    order.forEach((tk, i) => {
      const tx = 16 + i * (tw + 12);
      tk.x += (tx - tk.x) * Math.min(1, dt * 10);
      drawTicket(ctx, tk, tk.x, h * 0.035, tw, th, tk.id === active?.id, t, lg());
      st.hits.push({ id: `tk${tk.id}`, x: tk.x, y: h * 0.035, w: tw, h: th });
    });
    for (let i = st.gone.length - 1; i >= 0; i--) {
      const tk = st.gone[i]; tk.out += dt;
      if (tk.out > 0.8) { st.gone.splice(i, 1); continue; }
      ctx.save(); ctx.globalAlpha = 1 - tk.out / 0.8;
      const dy = tk.fail ? tk.out * tk.out * h * 1.2 : -tk.out * h * 0.4;
      ctx.translate(tk.x + tw / 2, h * 0.035 + th / 2 + dy); ctx.rotate(tk.fail ? tk.out * 1.5 : -tk.out * 0.4);
      drawTicket(ctx, tk, -tw / 2, -th / 2, tw, th, false, t, lg());
      ctx.font = `900 ${tw * 0.22}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = tk.fail ? '#e63946' : '#06d6a0'; ctx.save(); ctx.rotate(-0.3); ctx.fillText(tk.fail ? tr('PERDU', 'LOST') : tr('SERVI', 'SERVED'), 0, 0); ctx.restore();
      ctx.restore();
    }
    if (!order.length && g.phase === 'play') { ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = `700 ${h * 0.03}px Fredoka Variable, sans-serif`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(tr('En attente de commandes…', 'Waiting for orders…'), 24, h * 0.16); }

    // ── stations ──
    const glowIf = (on: boolean, col: string) => { if (on) glow(ctx, col, 18 + 8 * Math.sin(t * 8)); };
    const sw = l.leftW * 0.26, shh = l.counterH * 0.78;
    // cutting board
    {
      const { x, y } = l.board; const on = step?.k === 'chop';
      ctx.save(); glowIf(on, '#7dffbf');
      ctx.fillStyle = '#b07a43'; roundRect(ctx, x - sw / 2, y - shh * 0.36, sw, shh * 0.72, 14); ctx.fill(); ctx.restore();
      ctx.save(); roundRect(ctx, x - sw / 2, y - shh * 0.36, sw, shh * 0.72, 14); ctx.clip();
      ctx.strokeStyle = 'rgba(90,50,20,.35)'; ctx.lineWidth = 2; for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.moveTo(x - sw / 2, y - shh * 0.3 + k * shh * 0.1); ctx.bezierCurveTo(x - sw / 6, y - shh * 0.33 + k * shh * 0.1, x + sw / 6, y - shh * 0.27 + k * shh * 0.1, x + sw / 2, y - shh * 0.3 + k * shh * 0.1); ctx.stroke(); }
      ctx.restore();
      if (on && active) { const ie = active.plate[active.plate.length - 1] ?? active.d.e; ctx.font = `${shh * 0.32}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ie, x - sw * 0.12, y + 2); }
      // knife
      ctx.save(); ctx.translate(x + sw * 0.2, y - shh * 0.05 - (1 - st.chopAnim) * shh * 0.18); ctx.rotate(-0.5 + st.chopAnim * 0.5);
      ctx.fillStyle = '#d8dee9'; ctx.beginPath(); ctx.moveTo(-sw * 0.02, 0); ctx.lineTo(sw * 0.2, -shh * 0.06); ctx.lineTo(sw * 0.2, shh * 0.06); ctx.lineTo(-sw * 0.02, shh * 0.06); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#222'; ctx.fillRect(-sw * 0.12, shh * 0.01, sw * 0.11, shh * 0.05); ctx.restore();
      if (on && active && step?.k === 'chop') {
        const n = step.n;
        for (let k = 0; k < n; k++) { ctx.fillStyle = k < active.chop ? '#7dffbf' : 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.arc(x - (n - 1) * 9 + k * 18, y + shh * 0.46, 6, 0, Math.PI * 2); ctx.fill(); }
      }
      stationLabel(ctx, x, l.counterY + 4, tr('DÉCOUPE', 'CHOP'), 'C', on, t);
      st.hits.push({ id: 'chop', x: x - sw / 2, y: y - shh / 2, w: sw, h: shh });
    }
    // stove + pan
    {
      const { x, y } = l.pan; const pan = st.pan; const on = step?.k === 'fry';
      const pr = Math.min(sw * 0.36, shh * 0.4);
      ctx.save(); ctx.fillStyle = '#16161c'; roundRect(ctx, x - sw / 2, y - shh * 0.42, sw, shh * 0.84, 12); ctx.fill(); ctx.restore();
      const hot = pan.owner !== -1;
      ctx.save(); if (hot) glow(ctx, '#ff3b1f', 20);
      ctx.strokeStyle = hot ? `rgba(255,${80 + 60 * Math.sin(t * 20)},40,.95)` : '#3a3a44'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(x, y, pr * 1.05, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, pr * 0.7, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      // pan (shakes when hot)
      const jig = hot ? Math.sin(t * 40) * 1.5 : 0;
      ctx.save(); ctx.translate(x + jig, y);
      glowIf(on && !hot, '#ffb347');
      ctx.fillStyle = '#2a2a33'; ctx.fillRect(pr * 0.85, -pr * 0.12, pr * 0.95, pr * 0.24);
      ctx.fillStyle = '#3a3a44'; ctx.beginPath(); ctx.arc(0, 0, pr, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      const pg = ctx.createRadialGradient(-pr * 0.3, -pr * 0.3, 2, 0, 0, pr * 0.9); pg.addColorStop(0, '#4b4b57'); pg.addColorStop(1, '#1b1b22');
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(0, 0, pr * 0.86, 0, Math.PI * 2); ctx.fill();
      if (hot) {
        const cook = Math.min(1, pan.heat);
        ctx.font = `${pr * 0.9}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.filter = pan.fire > 0 ? 'brightness(0.25)' : `brightness(${1 - cook * 0.35}) sepia(${cook * 0.6})`;
        ctx.fillText(pan.item, 0, 2 + Math.sin(t * 25) * 1.5); ctx.filter = 'none';
      }
      ctx.restore();
      // heat gauge
      if (hot && pan.fire <= 0) {
        const gw = sw * 0.9, gh = 12, gx = x - gw / 2, gy = y - shh * 0.42 - 26;
        ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.6)'; roundRect(ctx, gx - 4, gy - 4, gw + 8, gh + 8, 8); ctx.fill();
        const zones: [number, number, string][] = [[0, 0.45, '#5b7cfa'], [0.45, 0.62, '#9be15d'], [0.62, 0.86, '#ffd166'], [0.86, 1, '#ff9f1c'], [1, 1.12, '#e63946']];
        for (const [a, b, c] of zones) { ctx.fillStyle = c; ctx.fillRect(gx + (a / 1.12) * gw, gy, ((b - a) / 1.12) * gw, gh); }
        ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(gx, gy, gw, gh * 0.35);
        const nx = gx + Math.min(1, pan.heat / 1.12) * gw;
        glow(ctx, '#fff', 10); ctx.fillStyle = '#fff'; ctx.fillRect(nx - 2, gy - 6, 4, gh + 12);
        ctx.restore();
        if (pan.heat >= 0.62 && pan.heat <= 0.86) { ctx.save(); ctx.font = `900 ${Math.max(12, h * 0.028)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd166'; glow(ctx, '#ffd166', 14); ctx.fillText(tr('MAINTENANT ! [F]', 'NOW! [F]'), x, gy - 10); ctx.restore(); }
      }
      if (pan.fire > 0) { ctx.save(); ctx.font = `800 ${Math.max(11, h * 0.024)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; glow(ctx, '#ff3b1f', 12); ctx.fillText(tr('[F] = jeter à la poubelle', '[F] = dump it'), x, y - shh * 0.42 - 12); ctx.restore(); }
      stationLabel(ctx, x, l.counterY + 4, tr('POÊLE', 'FRY'), 'F', on, t);
      st.hits.push({ id: 'fry', x: x - sw / 2, y: y - shh / 2, w: sw, h: shh });
    }
    // plate / pass
    {
      const { x, y } = l.plate; const on = step?.k === 'plate';
      const pr = Math.min(sw * 0.36, shh * 0.4) * (1 + st.plateBump * 0.12);
      ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(x + 4, y + 6, pr, pr * 0.9, 0, 0, Math.PI * 2); ctx.fill();
      glowIf(on, '#4cc9f0');
      ctx.fillStyle = '#f8f9fb'; ctx.beginPath(); ctx.arc(x, y, pr, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = '#d5dae3'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, pr * 0.72, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      if (active) {
        const items = active.plate;
        ctx.font = `${pr * 0.5}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        items.forEach((e, i) => { const a = (i / Math.max(1, items.length)) * Math.PI * 2 + 0.5; const r = items.length > 1 ? pr * 0.3 : 0; ctx.fillText(e, x + Math.cos(a) * r, y + Math.sin(a) * r); });
        if (on) { ctx.font = `${pr * 0.75}px serif`; ctx.globalAlpha = 0.85 + 0.15 * Math.sin(t * 8); ctx.fillText(active.d.e, x, y - pr * 0.05); ctx.globalAlpha = 1; if (Math.random() < 0.3) puff(x, y - pr * 0.3, 'steam', 1); }
      }
      stationLabel(ctx, x, l.counterY + 4, tr('ENVOI', 'SERVE'), '␣', on, t);
      st.hits.push({ id: 'plate', x: x - sw / 2, y: y - shh / 2, w: sw, h: shh });
    }

    // ── ingredient bins ──
    {
      const n = ING.length, gap = 10, bw = (l.leftW - 32 - gap * (n - 1)) / n, bh = l.binH * 0.85, by = l.binY;
      ING.forEach((ig, i) => {
        const bx = 16 + i * (bw + gap);
        const need = step?.k === 'ing' && step.i === i;
        ctx.save();
        if (need) glow(ctx, '#ffd166', 20 + 10 * Math.sin(t * 9));
        const bg = ctx.createLinearGradient(0, by, 0, by + bh); bg.addColorStop(0, need ? '#8c96a8' : '#6b7385'); bg.addColorStop(1, '#3a4050');
        ctx.fillStyle = bg; roundRect(ctx, bx, by - (need ? 6 + 3 * Math.sin(t * 9) : 0), bw, bh, 12); ctx.fill(); ctx.shadowBlur = 0;
        const yy = by - (need ? 6 + 3 * Math.sin(t * 9) : 0);
        ctx.fillStyle = 'rgba(0,0,0,.35)'; roundRect(ctx, bx + 6, yy + 6, bw - 12, bh * 0.55, 8); ctx.fill();
        ctx.font = `${Math.min(bw * 0.42, bh * 0.4)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(ig.e, bx + bw / 2 - bw * 0.12, yy + bh * 0.33); ctx.fillText(ig.e, bx + bw / 2 + bw * 0.14, yy + bh * 0.36);
        // keycap
        const kc = Math.min(26, bh * 0.28);
        ctx.fillStyle = need ? '#ffd166' : '#e9ecf2'; roundRect(ctx, bx + bw / 2 - kc / 2, yy + bh * 0.66, kc, kc, 6); ctx.fill();
        ctx.fillStyle = '#12051f'; ctx.font = `900 ${kc * 0.6}px Fredoka Variable, sans-serif`; ctx.fillText(String(i + 1), bx + bw / 2, yy + bh * 0.66 + kc / 2 + 1);
        ctx.restore();
        st.hits.push({ id: `ing${i}`, x: bx, y: by - 8, w: bw, h: bh + 8 });
      });
    }

    // ── particles ──
    for (let i = st.parts.length - 1; i >= 0; i--) {
      const p = st.parts[i]; p.life += dt;
      if (p.life > p.max) { st.parts.splice(i, 1); continue; }
      const k = p.life / p.max;
      if (p.kind === 'bit' || p.kind === 'spark') p.vy += 500 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      ctx.save();
      if (p.kind === 'smoke' || p.kind === 'steam') { ctx.globalAlpha = (1 - k) * (p.kind === 'smoke' ? 0.5 : 0.3); ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 + k * 2.5), 0, Math.PI * 2); ctx.fill(); }
      else if (p.kind === 'fire') { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1 - k; ctx.fillStyle = k < 0.3 ? '#fff3b0' : p.col; ctx.beginPath(); ctx.arc(p.x + Math.sin(p.life * 20) * 4, p.y, p.size * (1 - k * 0.6), 0, Math.PI * 2); ctx.fill(); }
      else { ctx.globalAlpha = 1 - k; ctx.fillStyle = p.col; ctx.fillRect(p.x, p.y, p.size, p.size); }
      ctx.restore();
    }
    // big fire glow
    if (st.pan.fire > 0) {
      const { x, y } = l.pan; const f = Math.min(1, st.pan.fire * 3);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const gg = ctx.createRadialGradient(x, y - 40, 10, x, y - 40, h * 0.45); gg.addColorStop(0, `rgba(255,120,20,${0.45 * f})`); gg.addColorStop(1, 'rgba(255,60,0,0)');
      ctx.fillStyle = gg; ctx.fillRect(0, 0, w, h);
      for (let k = 0; k < 5; k++) { const fx = x + (k - 2) * sw * 0.08, fh = sw * (0.35 + 0.2 * Math.sin(t * 17 + k * 2)); flame(ctx, fx, y, sw * 0.09, fh * f); }
      ctx.restore();
    }

    // ── chef ──
    {
      const cx = l.leftW + (w - l.leftW) / 2, cy = h * 0.72, cs = Math.min((w - l.leftW) * 0.8, h * 0.36);
      const shake = st.shakeChef > 0 ? Math.sin(t * 60) * 4 * st.shakeChef : 0;
      drawChef(ctx, cx + shake, cy, cs, st.anger, st.yell, t);
      // bubble
      const txt = st.line[lg()];
      const k = Math.min(1, st.lineT * 7);
      const angry = st.yell > 0.6 || /[!?]$/.test(txt) && txt === txt.toUpperCase();
      const fs = Math.max(12, Math.min(17, h * 0.027));
      ctx.save(); ctx.font = `800 ${fs}px Fredoka Variable, sans-serif`;
      const maxW = Math.min(w - l.leftW - 16, 260);
      const lines = wrap(ctx, txt, maxW - 22);
      const bw = Math.min(maxW, Math.max(...lines.map((x) => ctx.measureText(x).width)) + 24), bh = lines.length * fs * 1.25 + 16;
      const bx = Math.min(w - bw - 8, cx - bw / 2), by = cy - cs * 0.95 - bh;
      ctx.translate(bx + bw / 2, by + bh); ctx.scale(0.7 + 0.3 * k, 0.7 + 0.3 * k); ctx.translate(-(bx + bw / 2), -(by + bh));
      if (angry) { ctx.translate(Math.sin(t * 50) * 1.5, 0); }
      ctx.fillStyle = angry ? '#fff1f0' : '#ffffff'; glow(ctx, angry ? '#ff1f3d' : '#ffb347', 14);
      roundRect(ctx, bx, by, bw, bh, 12); ctx.fill(); ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.moveTo(cx - 10, by + bh - 1); ctx.lineTo(cx, by + bh + 12); ctx.lineTo(cx + 8, by + bh - 1); ctx.fill();
      ctx.fillStyle = angry ? '#c1121f' : '#2b1606'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      lines.forEach((ln, i) => ctx.fillText(ln, bx + bw / 2, by + 8 + i * fs * 1.25));
      ctx.restore();
      ctx.save(); ctx.font = `800 ${Math.max(10, h * 0.018)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,.65)';
      ctx.fillText(tr('CHEF GORDON RAMSAUCE', 'CHEF GORDON RAMSAUCE'), cx, h - 10); ctx.restore();
      // anger meter
      const mw = Math.min(140, (w - l.leftW) * 0.7), mx = cx - mw / 2, my = h - 34;
      ctx.fillStyle = 'rgba(0,0,0,.5)'; roundRect(ctx, mx, my, mw, 8, 4); ctx.fill();
      ctx.save(); const ac = st.anger > 0.66 ? '#ff1f3d' : st.anger > 0.33 ? '#ff9f1c' : '#9be15d'; glow(ctx, ac, 8); ctx.fillStyle = ac; roundRect(ctx, mx, my, Math.max(8, mw * st.anger), 8, 4); ctx.fill(); ctx.restore();
    }

    // counters
    {
      ctx.save(); ctx.font = `800 ${Math.max(11, h * 0.022)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillStyle = '#7dffbf'; ctx.fillText(`🍽️ ${st.served}`, w - 14, h * 0.04);
      ctx.fillStyle = '#ff8fa3'; ctx.fillText(`❌ ${st.failed}`, w - 14, h * 0.04 + h * 0.035);
      ctx.fillStyle = '#ffb347'; ctx.fillText(`🔥 ${st.burns}`, w - 14, h * 0.04 + h * 0.07);
      ctx.restore();
    }
  }, true);

  const onDown = (e: PointerEvent) => {
    const st = s.current, x = e.offsetX, y = e.offsetY;
    const hit = [...st.hits].reverse().find((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
    if (hit) act(hit.id);
  };
  return (
    <Arena g={g} title={tr('Coup de feu en cuisine', 'Kitchen nightmare')} icon="👨‍🍳" theme="sunset"
      howTo={tr('Les tickets tombent, le chef hurle. Suis les étapes du ticket actif : ingrédients (1-6), découpe (C à marteler), poêle (F pour lancer, F pile dans la zone dorée — sinon ça CRAME), puis envoie (Espace). Tab / ← → pour changer de ticket. 40 s, pas de pitié.', 'Tickets keep coming, the chef keeps screaming. Follow the active ticket: ingredients (1-6), chop (mash C), pan (F to start, F again in the golden zone — or it BURNS), then serve (Space). Tab / ← → to switch tickets. 40 s, no mercy.')}
      keys={['1 – 6', tr('C = couper', 'C = chop'), tr('F = poêle', 'F = fry'), tr('Espace = envoyer', 'Space = serve'), 'Tab']}>
      <canvas class="play" ref={cref} onPointerDown={onDown} style={{ cursor: 'pointer', touchAction: 'none' }} />
    </Arena>
  );
}

// ───────────────────────── drawing helpers ─────────────────────────
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(' '); const out: string[] = []; let cur = '';
  for (const wd of words) { const t = cur ? `${cur} ${wd}` : wd; if (ctx.measureText(t).width > max && cur) { out.push(cur); cur = wd; } else cur = t; }
  if (cur) out.push(cur);
  return out;
}
function stationLabel(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, key: string, on: boolean, t: number) {
  ctx.save(); ctx.font = `800 13px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const tw = ctx.measureText(label).width + 40;
  const by = y + (on ? Math.sin(t * 9) * 2 : 0);
  ctx.fillStyle = on ? '#ffd166' : 'rgba(0,0,0,.55)'; if (on) glow(ctx, '#ffd166', 14);
  roundRect(ctx, x - tw / 2, by, tw, 22, 11); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = on ? '#12051f' : 'rgba(255,255,255,.85)'; ctx.fillText(label, x + 9, by + 11.5);
  ctx.fillStyle = on ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.18)'; roundRect(ctx, x - tw / 2 + 3, by + 3, 18, 16, 5); ctx.fill();
  ctx.fillStyle = on ? '#12051f' : '#fff'; ctx.font = '900 11px Fredoka Variable, sans-serif'; ctx.fillText(key, x - tw / 2 + 12, by + 11.5);
  ctx.restore();
}
function drawTicket(ctx: CanvasRenderingContext2D, tk: Ticket, x: number, y: number, w: number, h: number, active: boolean, t: number, lg: number) {
  const k = tk.pat / tk.max;
  const swing = Math.sin(t * 2 + tk.id) * (active ? 0 : 0.02);
  ctx.save(); ctx.translate(x + w / 2, y); ctx.rotate(swing); ctx.translate(-w / 2, active ? 6 : 0);
  // clip
  ctx.fillStyle = '#9aa3b5'; ctx.fillRect(w / 2 - 14, -6, 28, 10);
  ctx.shadowColor = active ? '#ffd166' : 'rgba(0,0,0,.5)'; ctx.shadowBlur = active ? 22 : 10; ctx.shadowOffsetY = active ? 0 : 5;
  ctx.fillStyle = k < 0.25 && Math.floor(t * 6) % 2 ? '#ffe1e1' : '#fffdf5';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(w, h - 6);
  for (let i = 0; i <= 10; i++) ctx.lineTo(w - (i * w) / 10, h - (i % 2 ? 0 : 6));
  ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  if (active) { ctx.strokeStyle = '#ffb347'; ctx.lineWidth = 3; ctx.stroke(); }
  // header
  ctx.fillStyle = '#2b1606'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  const fs = Math.max(10, Math.min(13, w * 0.07));
  ctx.font = `800 ${fs * 0.85}px Fredoka Variable, sans-serif`; ctx.fillStyle = '#9a8f80'; ctx.fillText(`TABLE ${tk.table}`, 8, 7);
  const mood = k > 0.6 ? '🙂' : k > 0.35 ? '😐' : k > 0.15 ? '😠' : '🤬';
  ctx.font = `${fs * 1.2}px serif`; ctx.textAlign = 'right'; ctx.fillText(mood, w - 6, 4);
  ctx.textAlign = 'left'; ctx.font = `${fs * 2}px serif`; ctx.fillText(tk.d.e, 8, 7 + fs * 1.1);
  ctx.fillStyle = '#2b1606'; ctx.font = `800 ${fs}px Fredoka Variable, sans-serif`;
  const lines = wrap(ctx, tk.d.n[lg], w - fs * 2.6 - 16).slice(0, 2);
  lines.forEach((ln, i) => ctx.fillText(ln, 12 + fs * 2.4, 9 + fs * 1.15 + i * fs * 1.15));
  // steps
  const n = tk.d.steps.length, sz = Math.min((w - 16) / n - 4, h * 0.27), sy = h - 26 - sz;
  tk.d.steps.forEach((st, i) => {
    const sx = 8 + i * (sz + 4);
    const done = i < tk.step, cur = i === tk.step;
    ctx.fillStyle = done ? '#06d6a0' : cur ? '#ffd166' : '#ece6d8';
    roundRect(ctx, sx, sy, sz, sz, 6); ctx.fill();
    if (cur && active) { ctx.strokeStyle = '#ff7b00'; ctx.lineWidth = 2 + Math.sin(t * 10); ctx.stroke(); }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const lab = st.k === 'ing' ? ING[st.i].e : st.k === 'chop' ? '🔪' : st.k === 'fry' ? '🍳' : '🛎️';
    ctx.font = `${sz * 0.55}px serif`; ctx.globalAlpha = done ? 0.55 : 1; ctx.fillText(lab, sx + sz / 2, sy + sz * 0.42); ctx.globalAlpha = 1;
    const key = st.k === 'ing' ? String(st.i + 1) : st.k === 'chop' ? `C×${st.n}` : st.k === 'fry' ? 'F' : '␣';
    ctx.fillStyle = '#2b1606'; ctx.font = `900 ${Math.max(10, sz * 0.3)}px Fredoka Variable, sans-serif`; ctx.fillText(done ? '✓' : key, sx + sz / 2, sy + sz * 0.86);
  });
  // patience bar
  const by = h - 18;
  ctx.fillStyle = '#e8e0cf'; ctx.fillRect(8, by, w - 16, 6);
  ctx.fillStyle = k > 0.5 ? '#06d6a0' : k > 0.25 ? '#ff9f1c' : '#e63946'; ctx.fillRect(8, by, (w - 16) * Math.max(0, k), 6);
  ctx.restore();
}
function flame(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, hgt: number) {
  const gg = ctx.createLinearGradient(0, y, 0, y - hgt);
  gg.addColorStop(0, 'rgba(255,240,170,.9)'); gg.addColorStop(0.4, 'rgba(255,140,0,.75)'); gg.addColorStop(1, 'rgba(255,40,0,0)');
  ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(x - r, y);
  ctx.quadraticCurveTo(x - r * 1.2, y - hgt * 0.5, x, y - hgt); ctx.quadraticCurveTo(x + r * 1.2, y - hgt * 0.5, x + r, y); ctx.closePath(); ctx.fill();
}
function drawChef(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, anger: number, yell: number, t: number) {
  ctx.save(); ctx.translate(x, y);
  const r = s * 0.3;
  // body / jacket
  ctx.fillStyle = '#f4f4f6'; ctx.beginPath(); ctx.moveTo(-s * 0.48, s * 0.75); ctx.quadraticCurveTo(-s * 0.46, r * 0.9, 0, r * 0.85); ctx.quadraticCurveTo(s * 0.46, r * 0.9, s * 0.48, s * 0.75); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#c9ccd6'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#1f2937'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-s * 0.07, r * 1.25 + i * s * 0.1, 3, 0, Math.PI * 2); ctx.arc(s * 0.07, r * 1.25 + i * s * 0.1, 3, 0, Math.PI * 2); ctx.fill(); }
  // neckerchief
  ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.moveTo(-r * 0.5, r * 0.85); ctx.lineTo(r * 0.5, r * 0.85); ctx.lineTo(0, r * 1.25); ctx.closePath(); ctx.fill();
  // waving arm when yelling
  ctx.save(); ctx.translate(s * 0.4, r * 1.2); ctx.rotate(-1.2 - yell * 0.8 * (0.5 + 0.5 * Math.sin(t * 18)));
  ctx.fillStyle = '#f4f4f6'; ctx.fillRect(0, -s * 0.06, s * 0.32, s * 0.12);
  ctx.font = `${s * 0.16}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(yell > 0.3 ? '🔪' : '🥄', s * 0.38, 0); ctx.restore();
  // head
  const red = Math.min(1, anger * 0.8 + yell * 0.5);
  const skin = `rgb(${Math.round(242 + 13 * red)},${Math.round(201 - 110 * red)},${Math.round(160 - 100 * red)})`;
  ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.95, r * 1.08, 0, 0, Math.PI * 2); ctx.fill();
  // ears
  ctx.beginPath(); ctx.ellipse(-r * 0.95, r * 0.05, r * 0.16, r * 0.24, 0, 0, Math.PI * 2); ctx.ellipse(r * 0.95, r * 0.05, r * 0.16, r * 0.24, 0, 0, Math.PI * 2); ctx.fill();
  // toque
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-r * 0.8, -r * 1.25, r * 1.6, r * 0.42);
  for (const [dx, dy, rr] of [[-0.55, -1.55, 0.5], [0, -1.8, 0.6], [0.55, -1.55, 0.5]] as [number, number, number][]) { ctx.beginPath(); ctx.arc(dx * r, dy * r, rr * r, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = '#d7dbe6'; ctx.lineWidth = 2; ctx.strokeRect(-r * 0.8, -r * 1.25, r * 1.6, r * 0.42);
  // brows
  const browA = 0.25 + anger * 0.45 + yell * 0.2;
  ctx.strokeStyle = '#5b3a1a'; ctx.lineWidth = r * 0.12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-r * 0.6, -r * 0.35 - browA * r * 0.2); ctx.lineTo(-r * 0.15, -r * 0.3 + browA * r * 0.25); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(r * 0.6, -r * 0.35 - browA * r * 0.2); ctx.lineTo(r * 0.15, -r * 0.3 + browA * r * 0.25); ctx.stroke();
  // eyes
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(-r * 0.36, -r * 0.08, r * 0.17, r * (0.13 + yell * 0.05), 0, 0, Math.PI * 2); ctx.ellipse(r * 0.36, -r * 0.08, r * 0.17, r * (0.13 + yell * 0.05), 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1b1b1b'; ctx.beginPath(); ctx.arc(-r * 0.33, -r * 0.06, r * 0.07, 0, Math.PI * 2); ctx.arc(r * 0.33, -r * 0.06, r * 0.07, 0, Math.PI * 2); ctx.fill();
  // nose
  ctx.fillStyle = `rgba(200,80,60,${0.25 + red * 0.4})`; ctx.beginPath(); ctx.ellipse(0, r * 0.15, r * 0.13, r * 0.11, 0, 0, Math.PI * 2); ctx.fill();
  // mouth
  const open = yell > 0.05 ? (0.25 + 0.75 * yell) * (0.7 + 0.3 * Math.abs(Math.sin(t * 22))) : 0;
  if (open > 0) {
    ctx.fillStyle = '#4a0d0d'; ctx.beginPath(); ctx.ellipse(0, r * 0.55, r * 0.38, r * 0.32 * open + r * 0.05, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(-r * 0.25, r * 0.55 - r * 0.32 * open, r * 0.5, r * 0.08);
    ctx.fillStyle = '#e5677d'; ctx.beginPath(); ctx.ellipse(0, r * 0.55 + r * 0.2 * open, r * 0.2, r * 0.08, 0, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.strokeStyle = '#5b2a1a'; ctx.lineWidth = r * 0.08; ctx.beginPath();
    if (anger > 0.4) { ctx.moveTo(-r * 0.3, r * 0.6); ctx.quadraticCurveTo(0, r * 0.45, r * 0.3, r * 0.6); } else { ctx.moveTo(-r * 0.3, r * 0.5); ctx.quadraticCurveTo(0, r * 0.62, r * 0.3, r * 0.5); }
    ctx.stroke();
  }
  // stubble
  ctx.fillStyle = 'rgba(90,60,40,.18)'; for (let i = 0; i < 26; i++) { const a = Math.PI * (0.15 + 0.7 * ((i * 37) % 26) / 26); ctx.fillRect(Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.85, 2, 2); }
  // anger vein & steam
  if (anger > 0.5 || yell > 0.6) {
    ctx.font = `${r * 0.5}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('💢', r * 0.65, -r * 0.75);
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    for (let i = 0; i < 2; i++) { const k = (t * 1.5 + i * 0.5) % 1; ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc((i ? 1 : -1) * r * (1.05 + k * 0.3), -r * 0.2 - k * r, r * (0.12 + k * 0.2), 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
function renderBg(w: number, h: number, l: { leftW: number; counterY: number; counterH: number; binY: number; binH: number }): HTMLCanvasElement {
  const c = document.createElement('canvas');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = Math.max(1, Math.round(w * dpr)); c.height = Math.max(1, Math.round(h * dpr));
  const ctx = c.getContext('2d'); if (!ctx) return c;
  ctx.scale(dpr, dpr);
  // tiled wall
  const wall = ctx.createLinearGradient(0, 0, 0, h); wall.addColorStop(0, '#3b2a2a'); wall.addColorStop(1, '#1a1012');
  ctx.fillStyle = wall; ctx.fillRect(0, 0, w, h);
  const tw = 44, thh = 22;
  for (let y = 0; y < l.counterY; y += thh) for (let x = -(y / thh % 2) * tw / 2; x < w; x += tw) {
    ctx.fillStyle = `rgba(255,240,225,${0.06 + ((x * 7 + y * 3) % 5) * 0.006})`; ctx.fillRect(x + 1, y + 1, tw - 2, thh - 2);
  }
  // warm light from top
  const lg = ctx.createRadialGradient(l.leftW / 2, -h * 0.1, 10, l.leftW / 2, 0, h * 0.8); lg.addColorStop(0, 'rgba(255,190,110,.25)'); lg.addColorStop(1, 'rgba(255,190,110,0)');
  ctx.fillStyle = lg; ctx.fillRect(0, 0, w, h);
  // ticket rail
  ctx.fillStyle = '#7c8495'; ctx.fillRect(0, h * 0.022, l.leftW, 8);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(0, h * 0.022, l.leftW, 2);
  // counter (stainless)
  const cg = ctx.createLinearGradient(0, l.counterY, 0, l.counterY + l.counterH);
  cg.addColorStop(0, '#c9ced8'); cg.addColorStop(0.08, '#9aa1ae'); cg.addColorStop(0.5, '#7b8291'); cg.addColorStop(1, '#5a606d');
  ctx.fillStyle = cg; ctx.fillRect(0, l.counterY, l.leftW + 4, l.counterH);
  ctx.fillStyle = 'rgba(255,255,255,.12)';
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(i * l.leftW / 8, l.counterY); ctx.lineTo(i * l.leftW / 8 + 40, l.counterY); ctx.lineTo(i * l.leftW / 8 - 30, l.counterY + l.counterH); ctx.lineTo(i * l.leftW / 8 - 60, l.counterY + l.counterH); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = '#2b2f38'; ctx.fillRect(0, l.counterY + l.counterH, l.leftW + 4, 6);
  // lower cabinets
  ctx.fillStyle = '#20232b'; ctx.fillRect(0, l.counterY + l.counterH + 6, l.leftW + 4, h);
  // chef corner (pass window)
  const cx0 = l.leftW + 4;
  const pg = ctx.createLinearGradient(cx0, 0, w, 0); pg.addColorStop(0, '#2a1a1d'); pg.addColorStop(1, '#3d2326');
  ctx.fillStyle = pg; ctx.fillRect(cx0, 0, w - cx0, h);
  ctx.fillStyle = 'rgba(255,179,71,.12)'; ctx.fillRect(cx0, 0, 3, h);
  ctx.font = `900 ${Math.min(22, (w - cx0) * 0.12)}px Fredoka Variable, sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,179,71,.35)';
  ctx.fillText('★ ★ ★', cx0 + (w - cx0) / 2, h * 0.17);
  return c;
}
