// Hacker terminal: type absurd commands to breach 3 firewalls before Interpol's trace reaches you.
// Matrix rain, CRT scanlines, RGB glitches on typos, a world route map and an ACCESS GRANTED payoff per layer.
import { useRef } from 'preact/hooks';
import { useGame, useCanvas, useKeys, Arena, tr, glow, roundRect, clamp01, type GameProps } from './kit.tsx';
import { synth, sfx } from '../../audio.ts';

const DUR = 35, PER_LAYER = 2, LAYERS = 3;
const TAU = Math.PI * 2;
const MONO = 'ui-monospace, "JetBrains Mono", "Fira Code", Menlo, Consolas, monospace';

type Cmd = [string, string, string, string]; // cmd fr, cmd en, reply fr, reply en
const POOL: Cmd[][] = [
  [
    ['hack --mamie', 'hack --granny', 'Mamie : mot de passe = « chat123 »', 'Granny: password = "kitty123"'],
    ['ping le_chat', 'ping the_cat', 'Le chat ignore le ping. Normal.', 'The cat ignores the ping. As usual.'],
    ['ls -la frigo', 'ls -la fridge', '3 yaourts périmés, 1 secret d\'État', '3 expired yogurts, 1 state secret'],
    ['ssh tonton@bbq', 'ssh uncle@bbq', 'Tonton connecté (et pompette)', 'Uncle connected (and tipsy)'],
    ['sudo café', 'sudo coffee', '☕ Café préparé avec les droits root', '☕ Coffee brewed with root rights'],
    ['cd /wifi_voisin', 'cd /neighbor_wifi', 'Mot de passe : « motdepasse »', 'Password: "password"'],
  ],
  [
    ['sudo rm -rf voisin', 'sudo rm -rf neighbor', 'Voisin supprimé. Il reviendra.', 'Neighbor deleted. He\'ll be back.'],
    ['télécharger_plus_de_ram.exe', 'download_more_ram.exe', 'RAM : 8 Go → 8 To. Fais-moi confiance.', 'RAM: 8 GB → 8 TB. Trust me.'],
    ['chmod 777 belle-mère', 'chmod 777 mother-in-law', 'Belle-mère passée en lecture seule', 'Mother-in-law set to read-only'],
    ['git push --force papy', 'git push --force grandpa', 'Papy a été mergé dans le canapé', 'Grandpa merged into the couch'],
    ['kill -9 lundi', 'kill -9 monday', 'Lundi terminé. Bienvenue mardi.', 'Monday killed. Welcome Tuesday.'],
    ['nmap la_boulangerie', 'nmap the_bakery', 'Port 443 ouvert : croissants exposés', 'Port 443 open: croissants exposed'],
  ],
  [
    ['désactiver_pare-feu --gentiment', 'disable_firewall --politely', 'Le pare-feu dit merci et s\'en va', 'The firewall says thanks and leaves'],
    ['ssh root@mairie.gouv --svp', 'ssh root@cityhall.gov --please', 'Mot de passe : « 1234 ». Évidemment.', 'Password: "1234". Of course.'],
    ['upload chat_qui_danse.gif', 'upload dancing_cat.gif', 'Diffusé sur tous les écrans 🐈💃', 'Now playing on every screen 🐈💃'],
    ['hack_la_nasa --en-html', 'hack_nasa --with-html', 'NASA piratée. En HTML. Respect.', 'NASA hacked. With HTML. Respect.'],
    ['install virus_rigolo --inoffensif', 'install funny_virus --harmless', 'Tous les curseurs sont des bananes 🍌', 'Every cursor is now a banana 🍌'],
    ['sudo fais-moi un sandwich', 'sudo make me a sandwich', '🥪 D\'accord.', '🥪 Okay.'],
  ],
];
const LAYER_NAME: [string, string][] = [['Box internet de Mamie', 'Granny\'s router'], ['Pare-feu de la Mairie', 'City Hall firewall'], ['Mainframe des Impôts', 'Tax Office mainframe']];
const TYPO_MSG: [string, string][] = [['TYPO !', 'TYPO!'], ['ERREUR 404 DOIGT', 'FINGER 404'], ['GLITCH !', 'GLITCH!'], ['Gros doigts…', 'Fat fingers…']];

// Rough dotted world map (48×16).
const MAP = [
  '                                                ',
  '     #######       ##        ########           ',
  '  ############    ####  ###################     ',
  ' ###############   ##  ######################   ',
  '  #############       ####################  #   ',
  '   ###########       ###################   ##   ',
  '    ########         ########  ########         ',
  '     ######         ##########  ######          ',
  '       ####         ###########   ###           ',
  '        #####        #########     ##   #       ',
  '         ######       #######           ##      ',
  '         ########      #####          ####      ',
  '          #######      ####          ######     ',
  '           #####        ##           #######    ',
  '           ###                        ####      ',
  '           ##                                   ',
];
// Map nodes (normalised): you, 3 firewalls, Interpol.
const NODES = { you: [0.47, 0.27], fw: [[0.27, 0.72], [0.78, 0.3], [0.17, 0.34]], cops: [0.84, 0.8] } as const;
const RAIN = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ01010110ABCDEF$#@%&<>/\\';

const norm = (c: string) => c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
function shuffle<T>(a: T[]): T[] { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

interface Line { text: string; color: string }

export function Hack({ onDone }: GameProps) {
  const g = useGame({ duration: DUR, onDone });
  const s = useRef({
    cmds: POOL.map((p) => shuffle(p).slice(0, PER_LAYER)),
    layer: 0, ci: 0, typed: 0, cmdTypos: 0, typos: 0, correct: 0, trace: 0, traceMax: 0,
    granted: -9, glitch: 0, errFlash: 0, ended: false, endAt: 0, outcome: '' as '' | 'win' | 'traced', t: 0,
    log: [
      { text: 'BitLife-OS v6.6.6 — terminal sécurisé (pas du tout)', color: '#3cff9a' },
      { text: tr('> chargement de hack.exe ██████████ 100%', '> loading hack.exe ██████████ 100%'), color: '#7dffbf' },
      { text: tr('> capuche enfilée ✓   lunettes de soleil (la nuit) ✓', '> hoodie on ✓   sunglasses (at night) ✓'), color: '#7dffbf' },
      { text: tr('> connexion via 14 proxys en Moldavie… OK', '> routing through 14 proxies in Moldova… OK'), color: '#7dffbf' },
      { text: tr('> cible : 3 pare-feux détectés. Bonne chance.', '> target: 3 firewalls detected. Good luck.'), color: '#ffd166' },
    ] as Line[],
    rain: [] as { x: number; y: number; v: number; ch: string[] }[], rainW: 0,
    keyFx: 0, beepT: 0, warned: false, started: false,
  });
  const cmdText = (c: Cmd) => tr(c[0], c[1]);
  const cur = () => { const st = s.current; return st.layer < LAYERS ? st.cmds[st.layer][st.ci] : null; };
  const pos = useRef({ cx: 0, cy: 0 });
  const pct = (x: number, y: number): [number, number] => {
    const c = cv.current; const a = c?.closest('.arena');
    if (!c || !a) return [50, 50];
    const r = c.getBoundingClientRect(), ar = a.getBoundingClientRect();
    return [((r.left + x - ar.left) / ar.width) * 100, ((r.top + y - ar.top) / ar.height) * 100];
  };
  const locked = () => { const st = s.current; return g.phase !== 'play' || st.ended || !!st.outcome || st.t - st.granted < 1.0; };

  const finish = () => {
    const st = s.current;
    if (st.ended) return;
    st.ended = true;
    const total = st.correct + st.typos;
    const acc = total ? st.correct / total : 0;
    const elapsed = Math.max(1, DUR - g.time);
    const cps = st.correct / elapsed;
    const progress = (st.layer + (st.layer < LAYERS ? (st.ci + st.typed / Math.max(1, cmdText(st.cmds[st.layer][st.ci]).length)) / PER_LAYER : 0)) / LAYERS;
    let sc: number, res: string;
    if (st.outcome === 'win') { sc = 0.52 + 0.22 * acc + 0.14 * (1 - st.traceMax / 100) + 0.12 * clamp01(g.time / 15); res = tr('😎 PIRATÉ', '😎 PWNED'); }
    else if (st.outcome === 'traced') { sc = Math.min(0.35, progress * 0.4 * acc); res = tr('🚔 LOCALISÉ', '🚔 TRACED'); }
    else { sc = Math.min(0.42, progress * 0.5 * (0.5 + acc * 0.5)); res = tr('⏰ DÉCONNECTÉ', '⏰ TIMED OUT'); }
    g.end(sc, [
      [tr('Résultat', 'Result'), res],
      [tr('Pare-feux', 'Firewalls'), `${st.layer} / ${LAYERS}`],
      [tr('Précision', 'Accuracy'), `${Math.round(acc * 100)}%`],
      [tr('Vitesse', 'Speed'), `${Math.round(cps * 12)} ${tr('mots/min', 'WPM')}`],
      [tr('Trace max', 'Peak trace'), `${Math.round(st.traceMax)}%`],
    ]);
  };

  useKeys((e) => {
    const st = s.current;
    if (locked() || ((e.ctrlKey || e.metaKey) && !e.altKey)) return; // AltGr (= Ctrl+Alt) stays allowed for @, #…
    if (e.key.length !== 1) return; // Dead keys, Shift, Backspace…
    const c = cur(); if (!c) return;
    const target = cmdText(c);
    const want = target[st.typed];
    const [fx, fy] = pct(pos.current.cx, pos.current.cy);
    if (norm(e.key) === norm(want)) {
      st.typed++; st.correct++; st.keyFx = 1;
      g.hit(); g.add(25);
      synth.tone(1400 + Math.random() * 900, 0.025, 'square', 0.025);
      if (Math.random() < 0.35) g.burst(fx, fy, '#3cff9a', 4);
      if (st.typed >= target.length) {
        // command done
        st.log.push({ text: `root@pwn:~$ ${target}`, color: '#3cff9a' }, { text: `  ↳ ${tr(c[2], c[3])}`, color: st.cmdTypos ? '#ffd166' : '#7fdcff' });
        g.add(st.cmdTypos ? 250 : 500, st.cmdTypos ? tr('EXÉCUTÉ', 'EXECUTED') : tr('PROPRE !', 'CLEAN!'), fx, fy - 6, st.cmdTypos ? '#ffd166' : '#3cff9a');
        g.burst(fx, fy, '#3cff9a', 16);
        [880, 1320].forEach((f, i) => synth.tone(f, 0.08, 'triangle', 0.06, i * 0.05));
        st.typed = 0; st.cmdTypos = 0; st.ci++;
        if (st.ci >= PER_LAYER) {
          st.ci = 0; st.layer++; st.granted = st.t;
          st.trace = Math.max(0, st.trace - 12);
          g.flash('#00ff88'); g.shake();
          g.burst(50, 45, '#00ff88', 50); g.burst(50, 45, '#ffffff', 16);
          g.add(1500, '', 50, 50);
          sfx.whoosh();
          [523, 784, 1046, 1568].forEach((f, i) => synth.tone(f, 0.16, 'square', 0.06, 0.05 + i * 0.06));
          synth.tone(130, 0.5, 'sawtooth', 0.06, 0, 2.5);
          st.log.push({ text: tr(`### PARE-FEU ${st.layer}/${LAYERS} DÉTRUIT ###`, `### FIREWALL ${st.layer}/${LAYERS} DOWN ###`), color: '#ffffff' });
          if (st.layer >= LAYERS) { st.outcome = 'win'; st.endAt = st.t + 2.2; sfx.cash(); }
        }
      }
    } else {
      st.typos++; st.cmdTypos++;
      st.trace = Math.min(100, st.trace + 6);
      st.glitch = 1; st.errFlash = 1;
      g.miss(Math.random() < 0.5 ? tr(...pick(TYPO_MSG)) : undefined, fx, fy - 5);
      g.flash('#ff1f3d');
      synth.tone(95, 0.12, 'sawtooth', 0.08, 0, 0.6); synth.noise(0.08, 0.12, 3000);
    }
  });

  const cv = useCanvas((ctx, w, h, dt, t) => {
    const st = s.current;
    const playing = g.phase === 'play';
    // ─── simulation ───
    if (playing) {
      st.t += dt;
      if (!st.started) { st.started = true; g.float(tr('TAPE LES COMMANDES !', 'TYPE THE COMMANDS!'), 50, 30, '#3cff9a', true); }
      if (!st.outcome && !st.ended) {
        if (st.t - st.granted > 1.0) st.trace = Math.min(100, st.trace + dt * (1.25 + st.layer * 0.55));
        st.traceMax = Math.max(st.traceMax, st.trace);
        if (st.trace > 70 && st.t - st.beepT > 0.5 - st.trace / 400) { st.beepT = st.t; synth.tone(st.trace > 88 ? 1600 : 1200, 0.06, 'square', 0.04); }
        if (st.trace > 75 && !st.warned) { st.warned = true; g.float(tr('⚠ ILS SE RAPPROCHENT', '⚠ THEY\'RE CLOSING IN'), 50, 30, '#ff4d6d', true); g.flash('#ff1f3d'); }
        if (st.trace >= 100) {
          st.outcome = 'traced'; st.endAt = st.t + 2.0; st.glitch = 1;
          sfx.siren(); g.flash('#ff1f3d'); g.shake(); g.miss();
          g.float(tr('🚔 TRACE COMPLÈTE', '🚔 TRACE COMPLETE'), 50, 36, '#ff1f3d', true);
        }
        if (g.time <= 0 && !st.outcome) finish();
      }
      if (st.outcome === 'traced' && Math.floor(st.t * 5) !== Math.floor((st.t - dt) * 5)) g.flash(Math.floor(st.t * 5) % 2 ? '#ff1f3d' : '#2563eb');
      if (st.endAt && st.t >= st.endAt) finish();
    }
    st.glitch = Math.max(0, st.glitch - dt * 2.8);
    st.errFlash = Math.max(0, st.errFlash - dt * 4);
    st.keyFx = Math.max(0, st.keyFx - dt * 8);

    // ─── matrix rain ───
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
    bg.addColorStop(0, '#03140a'); bg.addColorStop(1, '#000302');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    const fs = 15;
    if (st.rainW !== Math.round(w)) {
      st.rainW = Math.round(w);
      st.rain = Array.from({ length: Math.ceil(w / fs) }, (_, i) => ({ x: i * fs, y: Math.random() * h * 1.5 - h * 0.5, v: 60 + Math.random() * 160, ch: Array.from({ length: 10 + Math.floor(Math.random() * 14) }, () => pick([...RAIN])) }));
    }
    ctx.font = `${fs}px ${MONO}`; ctx.textAlign = 'center';
    const traced = st.outcome === 'traced';
    for (const col of st.rain) {
      col.y += col.v * dt * (1 + st.glitch * 2);
      if (col.y - col.ch.length * fs > h) { col.y = -Math.random() * h * 0.3; col.v = 60 + Math.random() * 160; }
      if (Math.random() < 0.08) col.ch[Math.floor(Math.random() * col.ch.length)] = pick([...RAIN]);
      for (let i = 0; i < col.ch.length; i++) {
        const y = col.y - i * fs; if (y < -fs || y > h + fs) continue;
        const a = (1 - i / col.ch.length) * 0.32;
        ctx.fillStyle = i === 0 ? `rgba(220,255,235,${0.75})` : traced ? `rgba(255,40,70,${a})` : `rgba(0,255,120,${a})`;
        ctx.fillText(col.ch[i], col.x + fs / 2, y);
      }
    }

    // ─── layout ───
    const wide = w / h > 1.3;
    const tx = 14, ty = 14;
    const tw = wide ? w * 0.6 - 21 : w - 28, th = wide ? h - 28 : h * 0.62 - 21;
    const mx = wide ? tx + tw + 14 : 14, my = wide ? 14 : ty + th + 14, mw = wide ? w - mx - 14 : w - 28, mh = wide ? h - 28 : h - my - 14;

    // ─── terminal window ───
    ctx.save();
    glow(ctx, traced ? '#ff1f3d' : '#00ff88', 24);
    roundRect(ctx, tx, ty, tw, th, 12); ctx.fillStyle = 'rgba(0,12,5,.88)'; ctx.fill();
    ctx.restore();
    roundRect(ctx, tx, ty, tw, th, 12); ctx.strokeStyle = traced ? 'rgba(255,60,80,.7)' : 'rgba(0,255,136,.55)'; ctx.lineWidth = 1.5; ctx.stroke();
    // title bar
    ctx.save(); roundRect(ctx, tx, ty, tw, th, 12); ctx.clip();
    ctx.fillStyle = 'rgba(0,255,136,.1)'; ctx.fillRect(tx, ty, tw, 30);
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(tx + 18 + i * 18, ty + 15, 5.5, 0, TAU); ctx.fill(); });
    ctx.fillStyle = 'rgba(180,255,210,.75)'; ctx.font = `600 12px ${MONO}`; ctx.textAlign = 'center';
    const host = ['mamie.box', 'mairie.gouv', 'impots.gouv'][Math.min(2, st.layer)];
    ctx.fillText(tw > 520 ? `root@pwn — ssh ${tr('cible', 'target')}.${host} — 80×24` : `ssh ${host}`, tx + tw / 2 + (tw > 520 ? 0 : 20), ty + 19);
    ctx.restore();

    // header: firewall progress
    const pad = 20;
    let y = ty + 58;
    const L = Math.min(st.layer, LAYERS - 1);
    const pipsW = tw > 460 ? LAYERS * 34 + 10 : 0;
    ctx.textAlign = 'left'; ctx.font = `800 ${Math.round(Math.max(10, Math.min(18, (tw - pipsW) / 34)))}px ${MONO}`;
    ctx.save(); glow(ctx, '#ffd166', 10); ctx.fillStyle = '#ffd166';
    ctx.fillText(st.layer >= LAYERS ? tr('ACCÈS TOTAL ✓', 'FULL ACCESS ✓') : `🛡 ${tr('PARE-FEU', 'FIREWALL')} ${st.layer + 1}/${LAYERS} · ${tr(...LAYER_NAME[L])}`, tx + pad, y);
    ctx.restore();
    // layer pips
    for (let i = 0; i < (pipsW ? LAYERS : 0); i++) {
      const px = tx + tw - pad - (LAYERS - i) * 34, done = i < st.layer, curL = i === st.layer;
      ctx.save(); if (done || curL) glow(ctx, done ? '#00ff88' : '#ffd166', 10);
      roundRect(ctx, px, y - 14, 28, 16, 4); ctx.fillStyle = done ? '#00ff88' : curL ? `rgba(255,209,102,${0.35 + 0.3 * Math.sin(t * 6)})` : 'rgba(255,255,255,.08)'; ctx.fill(); ctx.restore();
    }
    y += 14;
    ctx.fillStyle = 'rgba(0,255,136,.25)'; ctx.fillRect(tx + pad, y, tw - pad * 2, 1);

    // prompt geometry
    const c = cur();
    const target = c ? cmdText(c) : '';
    const promptY = ty + th * (wide ? 0.62 : 0.6);
    const big = Math.max(14, Math.min(36, (tw - pad * 2) / Math.max(16, target.length + 1) / 0.62));
    // log
    const lf = Math.max(11, Math.min(15, tw / 50));
    ctx.font = `${lf}px ${MONO}`;
    const maxLines = Math.max(1, Math.floor((promptY - big * 1.6 - (y + 16)) / (lf * 1.45)));
    const lines = st.log.slice(-maxLines);
    lines.forEach((ln, i) => {
      ctx.fillStyle = ln.color; ctx.globalAlpha = 0.45 + 0.55 * ((i + 1) / lines.length);
      ctx.fillText(ln.text, tx + pad, y + 22 + i * lf * 1.45);
    });
    ctx.globalAlpha = 1;
    // current prompt
    if (c && !st.outcome) {
      ctx.font = `600 ${Math.round(lf)}px ${MONO}`; ctx.fillStyle = '#3cff9a';
      ctx.fillText(`root@pwn:~$  ${tr('# tape :', '# type:')}`, tx + pad, promptY - big * 1.15);
      ctx.font = `800 ${Math.round(big)}px ${MONO}`;
      const cw = ctx.measureText('M').width;
      const x0 = tx + pad;
      // RGB split on glitch
      const off = st.glitch * 6;
      for (let i = 0; i < target.length; i++) {
        const ch = target[i], x = x0 + i * cw;
        if (i < st.typed) {
          ctx.save(); glow(ctx, '#00ff88', 14); ctx.fillStyle = '#7dffbf'; ctx.fillText(ch, x, promptY); ctx.restore();
        } else if (i === st.typed) {
          const err = st.errFlash > 0;
          const blink = Math.floor(t * 3) % 2 === 0;
          ctx.save();
          if (err) { glow(ctx, '#ff1f3d', 20); ctx.fillStyle = 'rgba(255,31,61,.45)'; } else { glow(ctx, '#00ff88', 16); ctx.fillStyle = blink ? 'rgba(0,255,136,.35)' : 'rgba(0,255,136,.15)'; }
          ctx.fillRect(x - 1, promptY - big * 0.85, cw + 2, big * 1.08);
          ctx.fillStyle = err ? '#ff4d6d' : '#ffffff'; ctx.fillText(ch === ' ' ? '·' : ch, x, promptY);
          ctx.fillRect(x, promptY + big * 0.18, cw, 3);
          ctx.restore();
          pos.current = { cx: x + cw / 2, cy: promptY - big * 0.4 };
        } else {
          ctx.fillStyle = 'rgba(120,200,160,.38)'; ctx.fillText(ch, x, promptY);
        }
      }
      if (off > 0.5) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = st.glitch * 0.8;
        ctx.fillStyle = '#ff0040'; ctx.fillText(target, x0 - off, promptY);
        ctx.fillStyle = '#00e5ff'; ctx.fillText(target, x0 + off, promptY + 1);
        ctx.restore();
      }
      // progress bar of the command
      const prog = st.typed / Math.max(1, target.length);
      ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(x0, promptY + big * 0.45, tw - pad * 2, 3);
      ctx.save(); glow(ctx, '#00ff88', 8); ctx.fillStyle = '#00ff88'; ctx.fillRect(x0, promptY + big * 0.45, (tw - pad * 2) * prog, 3); ctx.restore();
      // next command preview
      const nxt = st.ci + 1 < PER_LAYER ? st.cmds[st.layer][st.ci + 1] : st.layer + 1 < LAYERS ? st.cmds[st.layer + 1][0] : null;
      if (nxt) { ctx.font = `${Math.round(lf)}px ${MONO}`; ctx.fillStyle = 'rgba(120,200,160,.35)'; ctx.fillText(`${tr('suivant', 'next')} ▸ ${cmdText(nxt)}`, x0, promptY + big * 0.45 + lf * 2); }
    }
    // trace bar (inside terminal, bottom)
    {
      const bx = tx + pad, bw = tw - pad * 2, by = ty + th - 44, bh = 16;
      const tc = st.trace > 70 ? '#ff1f3d' : st.trace > 40 ? '#ff9f1c' : '#ffd166';
      ctx.font = `800 ${Math.round(Math.min(14, tw / 40))}px ${MONO}`; ctx.textAlign = 'left';
      ctx.fillStyle = st.trace > 70 && Math.floor(t * 6) % 2 ? '#ffffff' : tc;
      ctx.fillText(`🚔 TRACE INTERPOL`, bx, by - 6);
      ctx.textAlign = 'right'; ctx.fillText(`${st.trace.toFixed(1)}%`, bx + bw, by - 6); ctx.textAlign = 'left';
      roundRect(ctx, bx, by, bw, bh, 5); ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fill();
      ctx.save(); roundRect(ctx, bx, by, bw, bh, 5); ctx.clip();
      glow(ctx, tc, 14); ctx.fillStyle = tc; ctx.fillRect(bx, by, bw * st.trace / 100, bh);
      ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(0,0,0,.25)';
      for (let sx = bx - 20 + ((t * 40) % 20); sx < bx + bw * st.trace / 100; sx += 20) { ctx.beginPath(); ctx.moveTo(sx, by + bh); ctx.lineTo(sx + 8, by); ctx.lineTo(sx + 16, by); ctx.lineTo(sx + 8, by + bh); ctx.fill(); }
      ctx.restore();
    }

    // ─── network map ───
    drawMap(ctx, mx, my, mw, mh, st, t, wide);

    // ─── ACCESS GRANTED / TRACED overlays ───
    const ga = st.t - st.granted;
    const won = st.outcome === 'win';
    if (ga >= 0 && (ga < 1.3 || won) && playing) {
      const k = ga < 0.15 ? ga / 0.15 : ga > 1.0 && !won ? 1 - (ga - 1.0) / 0.3 : 1;
      const bh = Math.min(140, h * 0.24), by = h / 2 - bh / 2;
      ctx.save(); ctx.globalAlpha = k;
      ctx.fillStyle = 'rgba(0,10,4,.88)'; ctx.fillRect(0, by, w, bh);
      ctx.fillStyle = '#00ff88'; ctx.fillRect(0, by, w, 2); ctx.fillRect(0, by + bh - 2, w, 2);
      const label = st.layer >= LAYERS ? tr('SYSTÈME PIRATÉ 😎', 'SYSTEM PWNED 😎') : 'ACCESS GRANTED';
      const shown = Math.min(label.length, Math.floor(ga * 40));
      let txt = label.slice(0, shown);
      for (let i = shown; i < label.length; i++) txt += pick([...RAIN]);
      const bf = Math.min(64, w / (label.length * 0.68));
      ctx.font = `900 ${Math.round(bf)}px ${MONO}`; ctx.textAlign = 'center';
      const jx = (Math.random() - 0.5) * 6 * (1 - Math.min(1, ga * 2));
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(255,0,64,.6)'; ctx.fillText(txt, w / 2 - 3 + jx, by + bh * 0.55);
      ctx.fillStyle = 'rgba(0,229,255,.6)'; ctx.fillText(txt, w / 2 + 3 + jx, by + bh * 0.55);
      ctx.globalCompositeOperation = 'source-over';
      glow(ctx, '#00ff88', 30); ctx.fillStyle = '#d9ffe9'; ctx.fillText(txt, w / 2 + jx, by + bh * 0.55);
      ctx.shadowBlur = 0; ctx.font = `700 ${Math.round(bf * 0.3)}px ${MONO}`; ctx.fillStyle = '#3cff9a';
      ctx.fillText(st.layer >= LAYERS ? tr('Les impôts te doivent maintenant 3 000 €', 'The tax office now owes YOU $3,000') : tr(`pare-feu ${st.layer}/${LAYERS} neutralisé`, `firewall ${st.layer}/${LAYERS} neutralised`), w / 2, by + bh * 0.85);
      // sweep line
      const sx = ((ga * 1.6) % 1) * w;
      const sg = ctx.createLinearGradient(sx - 120, 0, sx, 0); sg.addColorStop(0, 'rgba(0,255,136,0)'); sg.addColorStop(1, 'rgba(0,255,136,.35)');
      ctx.fillStyle = sg; ctx.fillRect(sx - 120, by, 120, bh);
      ctx.restore();
    }
    if (traced) {
      ctx.save();
      ctx.fillStyle = `rgba(255,0,40,${0.12 + 0.1 * Math.sin(t * 20)})`; ctx.fillRect(0, 0, w, h);
      const bf = Math.min(58, w / 14);
      ctx.fillStyle = 'rgba(20,0,6,.85)'; ctx.fillRect(0, h * 0.45 - bf * 1.3, w, bf * 2.5);
      ctx.fillStyle = '#ff1f3d'; ctx.fillRect(0, h * 0.45 - bf * 1.3, w, 2); ctx.fillRect(0, h * 0.45 + bf * 1.2, w, 2);
      ctx.font = `900 ${Math.round(bf)}px ${MONO}`; ctx.textAlign = 'center';
      glow(ctx, '#ff1f3d', 30); ctx.fillStyle = '#ffd6dc';
      ctx.fillText(tr('LOCALISÉ', 'TRACED'), w / 2 + (Math.random() - 0.5) * 8, h * 0.45);
      ctx.font = `700 ${Math.round(bf * 0.32)}px ${MONO}`; ctx.fillStyle = '#ff8095';
      ctx.fillText(tr('Interpol sonne à la porte. Et ta mère aussi.', 'Interpol is at the door. So is your mom.'), w / 2, h * 0.45 + bf * 0.75, w - 20);
      ctx.restore();
    }

    // ─── CRT post-processing ───
    // glitch slices (copy the canvas onto itself, shifted)
    if (st.glitch > 0.05) {
      const cnv = ctx.canvas, cw = cnv.width, chh = cnv.height;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      const n = 3 + Math.floor(st.glitch * 6);
      for (let i = 0; i < n; i++) {
        const sy = Math.random() * chh, sh = 4 + Math.random() * chh * 0.06, dx = (Math.random() - 0.5) * 60 * st.glitch * (cw / Math.max(1, w));
        try { ctx.drawImage(cnv, 0, sy, cw, sh, dx, sy, cw, sh); } catch { /* ignore */ }
      }
      ctx.globalAlpha = st.glitch * 0.25; ctx.fillStyle = '#ff0040'; ctx.fillRect(0, Math.random() * chh, cw, 2 + Math.random() * 6);
      ctx.restore();
    }
    // scanlines
    ctx.fillStyle = 'rgba(0,0,0,.2)';
    for (let sy = 0; sy < h; sy += 3) ctx.fillRect(0, sy, w, 1);
    // rolling bar + flicker
    const rb = ((t * 0.25) % 1.2 - 0.1) * h;
    const rg = ctx.createLinearGradient(0, rb - 60, 0, rb + 60); rg.addColorStop(0, 'rgba(0,255,136,0)'); rg.addColorStop(0.5, 'rgba(0,255,136,.045)'); rg.addColorStop(1, 'rgba(0,255,136,0)');
    ctx.fillStyle = rg; ctx.fillRect(0, rb - 60, w, 120);
    if (Math.random() < 0.04) { ctx.fillStyle = 'rgba(0,255,136,.03)'; ctx.fillRect(0, 0, w, h); }
    // vignette
    const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.4, w / 2, h / 2, Math.max(w, h) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, st.trace > 70 && !st.outcome ? `rgba(120,0,20,${0.4 + 0.2 * Math.sin(t * 10)})` : 'rgba(0,0,0,.6)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
  }, true);

  return (
    <Arena g={g} title={tr('Piratage', 'Hacking')} icon="💻" theme="matrix"
      howTo={tr(`Tape les commandes affichées le plus vite possible pour faire tomber ${LAYERS} pare-feux. Chaque faute fait glitcher l'écran et accélère la trace d'Interpol. Si la trace atteint 100 %, c'est la prison (et la honte).`, `Type the displayed commands as fast as you can to bring down ${LAYERS} firewalls. Every typo glitches the screen and speeds up Interpol's trace. If the trace hits 100%, it's jail (and shame).`)}
      keys={[tr('Clavier : tape les commandes', 'Keyboard: type the commands'), tr('accents facultatifs', 'accents optional')]}>
      <canvas class="play" ref={cv} />
    </Arena>
  );
}

type HS = { layer: number; ci: number; typed: number; trace: number; outcome: string; cmds: Cmd[][]; t: number; granted: number };

function drawMap(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, st: HS, t: number, wide: boolean) {
  roundRect(ctx, x, y, w, h, 12); ctx.fillStyle = 'rgba(0,10,5,.82)'; ctx.fill();
  ctx.strokeStyle = 'rgba(0,255,136,.35)'; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.save(); roundRect(ctx, x, y, w, h, 12); ctx.clip();
  ctx.font = `800 12px ${MONO}`; ctx.textAlign = 'left'; ctx.fillStyle = '#3cff9a';
  ctx.fillText(tr('// CARTE RÉSEAU · ROUTE', '// NETWORK MAP · ROUTE'), x + 14, y + 22);
  ctx.textAlign = 'right'; ctx.fillStyle = Math.floor(t * 2) % 2 ? '#ff4d6d' : 'rgba(255,77,109,.4)'; ctx.fillText('● LIVE', x + w - 14, y + 22);
  // map area keeps a 3:1 aspect
  const top = y + 34, avail = h - 34 - (wide ? 150 : 12);
  let mw = w - 28, mh = mw / 2.1;
  if (mh > avail) { mh = avail; mw = mh * 2.1; }
  const mx = x + (w - mw) / 2, my = top + 6;
  const cols = MAP[0].length, rows = MAP.length, cs = mw / cols, rs = mh / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (MAP[r][c] !== '#') continue;
    const tw = 0.5 + 0.5 * Math.sin(t * 2 + r * 0.7 + c * 0.3);
    ctx.fillStyle = `rgba(0,255,136,${0.16 + tw * 0.14})`;
    ctx.beginPath(); ctx.arc(mx + (c + 0.5) * cs, my + (r + 0.5) * rs, Math.min(cs, rs) * 0.28, 0, TAU); ctx.fill();
  }
  const P = (n: readonly number[]) => [mx + n[0] * mw, my + n[1] * mh] as const;
  const you = P(NODES.you), cops = P(NODES.cops);
  const route = [you, ...NODES.fw.map(P)];
  // route links
  for (let i = 0; i < LAYERS; i++) {
    const [ax, ay] = route[i], [bx, by] = route[i + 1];
    const done = i < st.layer, curL = i === st.layer;
    const cmdLen = curL && st.layer < LAYERS ? Math.max(1, tr(st.cmds[i][st.ci][0], st.cmds[i][st.ci][1]).length) : 1;
    const prog = done ? 1 : curL ? (st.ci + st.typed / cmdLen) / PER_LAYER : 0;
    // arc
    const qx = (ax + bx) / 2, qy = Math.min(ay, by) - Math.hypot(bx - ax, by - ay) * 0.25;
    const pt = (k: number) => [(1 - k) * (1 - k) * ax + 2 * (1 - k) * k * qx + k * k * bx, (1 - k) * (1 - k) * ay + 2 * (1 - k) * k * qy + k * k * by] as const;
    ctx.save(); ctx.setLineDash([4, 5]); ctx.strokeStyle = 'rgba(0,255,136,.22)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(qx, qy, bx, by); ctx.stroke(); ctx.restore();
    if (prog > 0) {
      ctx.save(); glow(ctx, '#00ff88', 10); ctx.strokeStyle = done ? '#00ff88' : '#7dffbf'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(ax, ay); for (let k = 0.04; k <= prog + 0.001; k += 0.04) { const [px, py] = pt(Math.min(k, prog)); ctx.lineTo(px, py); } ctx.stroke(); ctx.restore();
    }
    if (done) for (let j = 0; j < 3; j++) { const [px, py] = pt(((t * 0.7 + j / 3) % 1)); ctx.save(); glow(ctx, '#ffffff', 10); ctx.fillStyle = '#eafff3'; ctx.beginPath(); ctx.arc(px, py, 2.4, 0, TAU); ctx.fill(); ctx.restore(); }
  }
  // interpol trace path
  {
    const k = st.trace / 100;
    const [ax, ay] = cops, [bx, by] = you;
    ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(255,60,90,.25)'; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.restore();
    const ex = ax + (bx - ax) * k, ey = ay + (by - ay) * k;
    ctx.save(); glow(ctx, '#ff1f3d', 14); ctx.strokeStyle = '#ff3355'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.fillStyle = '#ff3355'; ctx.beginPath(); ctx.arc(ex, ey, 3.5 + Math.sin(t * 12), 0, TAU); ctx.fill(); ctx.restore();
    ctx.font = `${Math.round(Math.max(14, cs * 1.6))}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🚔', ax, ay);
    ctx.textBaseline = 'alphabetic'; ctx.font = `700 10px ${MONO}`; ctx.fillStyle = '#ff8095'; ctx.fillText('INTERPOL', ax, ay + cs * 1.6 + 6);
  }
  // nodes
  const node = (px: number, py: number, label: string, state: 'you' | 'done' | 'cur' | 'idle') => {
    const col = state === 'you' ? '#7fdcff' : state === 'done' ? '#00ff88' : state === 'cur' ? '#ffd166' : 'rgba(180,255,210,.5)';
    const r = Math.max(5, cs * 0.75);
    if (state === 'cur' || state === 'you') { const k = (t * 1.2) % 1; ctx.strokeStyle = col; ctx.globalAlpha = 1 - k; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, py, r + k * r * 2.5, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; }
    if (state === 'you' && st.trace > 60) { ctx.strokeStyle = '#ff1f3d'; ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 14); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, r * 2.2, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; }
    ctx.save(); glow(ctx, col, 14); ctx.fillStyle = col;
    ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + Math.PI / 6; ctx.lineTo(px + Math.cos(a) * r, py + Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#001a0b'; ctx.font = `900 ${Math.round(r * 1.1)}px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(state === 'you' ? '@' : state === 'done' ? '✓' : state === 'cur' ? '!' : '#', px, py + 1);
    ctx.textBaseline = 'alphabetic'; ctx.font = `700 ${Math.round(Math.max(9, Math.min(12, cs * 1.1)))}px ${MONO}`; ctx.fillStyle = col;
    ctx.fillText(label, px, py - r - 6);
  };
  node(you[0], you[1], tr('TOI', 'YOU'), 'you');
  NODES.fw.forEach((n, i) => { const [px, py] = P(n); node(px, py, tr(...LAYER_NAME[i]).split(' ').slice(-1)[0].toUpperCase(), i < st.layer ? 'done' : i === st.layer ? 'cur' : 'idle'); });
  ctx.restore();
  // status feed (wide only)
  if (wide) {
    const fy = my + mh + 22;
    ctx.font = `600 12px ${MONO}`; ctx.textAlign = 'left';
    const rowsTxt: [string, string][] = [
      [tr('Proxy', 'Proxy'), ['Moldavie', 'Groenland', 'Vatican', 'Lune'][Math.floor(t / 2) % 4]],
      ['IP', `${(Math.floor(t * 7) * 37) % 255}.${(Math.floor(t * 5) * 91) % 255}.${(Math.floor(t * 3) * 13) % 255}.${(Math.floor(t * 11) * 7) % 255}`],
      [tr('Pare-feux', 'Firewalls'), `${'■'.repeat(st.layer)}${'□'.repeat(LAYERS - st.layer)}`],
      [tr('Café', 'Coffee'), `${Math.max(0, 100 - Math.round(st.t * 2.5))}%`],
      [tr('Capuche', 'Hoodie'), tr('ENFILÉE ✓', 'ON ✓')],
    ];
    rowsTxt.forEach(([k, v], i) => {
      ctx.fillStyle = 'rgba(120,200,160,.6)'; ctx.fillText(`${k}`.padEnd(10, '.'), x + 16, fy + i * 20);
      ctx.fillStyle = '#7dffbf'; ctx.fillText(v, x + 16 + 100, fy + i * 20);
    });
    // scrolling hex dump in the remaining space
    const hy = fy + rowsTxt.length * 20 + 10, hh = y + h - hy - 12;
    if (hh > 40) {
      ctx.save(); ctx.beginPath(); ctx.rect(x + 12, hy, w - 24, hh); ctx.clip();
      ctx.fillStyle = 'rgba(0,255,136,.05)'; ctx.fillRect(x + 12, hy, w - 24, hh);
      ctx.font = `11px ${MONO}`;
      const lh = 15, scroll = (t * 40) % lh, n = Math.ceil(hh / lh) + 1, base = Math.floor(t * 40 / lh);
      for (let i = 0; i < n; i++) {
        const row = base + i, yy = hy + hh - i * lh + scroll - 4;
        let hex = '';
        for (let b = 0; b < 8; b++) hex += ((row * 2654435761 + b * 40503) >>> (b % 4) * 3 & 255).toString(16).padStart(2, '0') + ' ';
        ctx.fillStyle = 'rgba(0,255,136,.32)'; ctx.fillText(`0x${(row * 16).toString(16).padStart(6, '0')}  ${hex}`, x + 18, yy);
        if (row % 7 === 0) { ctx.fillStyle = 'rgba(255,209,102,.6)'; ctx.fillText(['mdp=chat123', 'ROOT?!', 'cookie🍪', 'café.dll'][row % 4], x + w - 110, yy); }
      }
      ctx.restore();
    }
  }
}
