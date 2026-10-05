// Two-player UI: lobby, partner dock, chat, emotes, social actions, requests, scoreboard and coop goals.
import { useEffect, useRef, useState } from 'preact/hooks';
import type { DuoMode, PeerSummary } from '@bl/shared';
import { content } from '@bl/data';
import type { Npc } from '@bl/sim';
import { duo, life, lang, modal, screen, emoteFx, rev } from '../state.ts';
import { joinRoom, leaveRoom, setMode, startTogether, myName, socialOptions, social, answer, emote, chat, EMOTES, coopGoals, setChatOpen, buildSummary } from '../duo.ts';
import { Sheet, Btn, Portrait } from './common.tsx';
import { sfx } from '../audio.ts';

const T = (fr: string, en: string) => (lang.value === 'fr' ? fr : en);
const close = () => { sfx.close(); modal.value = null; };

const MODES: { id: DuoMode; icon: string; fr: [string, string]; en: [string, string] }[] = [
  { id: 'parallel', icon: '👫', fr: ['Vies parallèles', 'Chacun sa vie, mais on peut se rencontrer, sortir ensemble, se marier, faire des bébés… ou s\'empoisonner.'], en: ['Parallel lives', 'Each your own life, but you can meet, date, marry, have babies… or poison each other.'] },
  { id: 'shared', icon: '💑', fr: ['Vie commune', 'Une seule vie, deux cerveaux. On vote à chaque choix ; en cas de désaccord, pile ou face (et dispute).'], en: ['Shared life', 'One life, two brains. Vote on every choice; disagree and it\'s a coin flip (and a fight).'] },
  { id: 'versus', icon: '⚔️', fr: ['Versus', 'Même graine, même départ. Qui finira le plus riche, le plus célèbre… ou en prison ? Duels avec mise.'], en: ['Versus', 'Same seed, same start. Who ends up richest, most famous… or in jail? Duels with stakes.'] },
  { id: 'coop', icon: '🤝', fr: ['Coopération', 'Vies parallèles avec des objectifs communs : 1 M$ cumulés, 3 enfants ensemble, atteindre 80 ans…'], en: ['Co-op', 'Parallel lives with shared goals: $1M combined, 3 kids together, both reach 80…'] },
];

export function DuoLobby() {
  const d = duo.value;
  const [name, setName] = useState(myName());
  const [code, setCode] = useState('');
  const [mode, setM] = useState<DuoMode>('parallel');
  const [ctry, setCtry] = useState('fr');
  const lg = lang.value;
  if (d.status !== 'room') {
    return (
      <Sheet title={T('Jouer à deux', 'Play together')} icon="💞" onClose={close} cls="duo-lobby">
        <p class="muted">{T('Lancez le serveur avec « npm run duo », puis ouvrez la même adresse sur les deux ordinateurs.', 'Start the server with "npm run duo", then open the same address on both computers.')}</p>
        <label class="field"><span>{T('Ton pseudo', 'Your nickname')}</span><input value={name} maxLength={24} placeholder={T('Mon amour', 'Honey')} onInput={(e) => setName((e.target as HTMLInputElement).value)} /></label>
        <div class="duo-modes">
          {MODES.map((m) => (
            <button key={m.id} class={`duo-mode ${mode === m.id ? 'on' : ''}`} onClick={() => { sfx.click(); setM(m.id); }}>
              <span class="dm-icon">{m.icon}</span><b>{m[lg][0]}</b><small>{m[lg][1]}</small>
            </button>
          ))}
        </div>
        {d.error && <div class="duo-error">⚠️ {d.error}</div>}
        <div class="duo-join">
          <Btn cls="primary big" disabled={!name.trim() || d.status === 'connecting'} onClick={() => { sfx.good(); joinRoom(name.trim(), null, mode); }}>✨ {T('Créer un salon', 'Create a room')}</Btn>
          <span class="muted">{T('ou', 'or')}</span>
          <input class="code-input" value={code} maxLength={4} placeholder="ABCD" onInput={(e) => setCode((e.target as HTMLInputElement).value.toUpperCase())} />
          <Btn disabled={!name.trim() || code.length !== 4 || d.status === 'connecting'} onClick={() => { sfx.click(); joinRoom(name.trim(), code, mode); }}>🚪 {T('Rejoindre', 'Join')}</Btn>
        </div>
        {d.status === 'connecting' && <div class="muted center">⏳ {T('Connexion…', 'Connecting…')}</div>}
      </Sheet>
    );
  }
  const m = MODES.find((x) => x.id === d.mode)!;
  const inGame = screen.value === 'game' && !!life.value?.alive;
  return (
    <Sheet title={T('Salon privé', 'Private room')} icon="💞" onClose={close} cls="duo-lobby">
      <div class="room-code"><small>{T('Code du salon', 'Room code')}</small><b>{d.code}</b></div>
      <div class="duo-players">
        {d.players.map((p) => <div key={p.id} class={`duo-player ${p.online ? 'on' : ''}`}><span class="dot" />{p.name}{p.id === d.you ? ` (${T('toi', 'you')})` : ''}{d.players[0] === p ? ' 👑' : ''}</div>)}
        {d.players.length < 2 && <div class="duo-player wait">⏳ {T('En attente de ton/ta partenaire… donne-lui le code !', 'Waiting for your partner… share the code!')}</div>}
      </div>
      <div class="duo-modes small">
        {MODES.map((x) => (
          <button key={x.id} disabled={!d.host} class={`duo-mode ${d.mode === x.id ? 'on' : ''}`} onClick={() => { sfx.click(); setMode(x.id); }}>
            <span class="dm-icon">{x.icon}</span><b>{x[lg][0]}</b>
          </button>
        ))}
      </div>
      <p class="muted">{m[lg][1]}</p>
      {(d.mode === 'shared' || d.mode === 'versus') && d.host && (
        <div class="duo-start">
          <select value={ctry} onChange={(e) => setCtry((e.target as HTMLSelectElement).value)}>
            {content.countries.map((c) => <option key={c.id} value={c.id}>{c.flag} {c.name[lg]}</option>)}
          </select>
          <Btn cls="primary big" disabled={d.players.filter((p) => p.online).length < 2} onClick={() => { sfx.good(); startTogether({ country: ctry, birthYear: 2026, seed: Math.floor(Math.random() * 1e9) }); }}>
            {d.mode === 'shared' ? `👶 ${T('Naître ensemble', 'Be born together')}` : `⚔️ ${T('Lancer le duel', 'Start the race')}`}
          </Btn>
        </div>
      )}
      {(d.mode === 'shared' || d.mode === 'versus') && !d.host && <p class="center">⏳ {T('L\'hôte lance la partie…', 'The host starts the game…')}</p>}
      {(d.mode === 'parallel' || d.mode === 'coop') && (
        <div class="row-btns">
          {inGame ? <Btn cls="primary" onClick={close}>▶ {T('Continuer ma vie', 'Continue my life')}</Btn> : <Btn cls="primary" onClick={() => { modal.value = null; screen.value = 'create'; }}>✨ {T('Créer ma vie', 'Create my life')}</Btn>}
        </div>
      )}
      <div class="row-btns"><Btn cls="ghost" onClick={() => { leaveRoom(); sfx.close(); }}>🚪 {T('Quitter le salon', 'Leave room')}</Btn></div>
    </Sheet>
  );
}

function peerFace(s: PeerSummary): Npc {
  const l = life.value!;
  return { id: -1, first: s.first, last: s.last, gender: s.gender, birthYear: l.year - s.age, alive: s.alive, role: 'friend', rel: 50, looks: s.looks, smarts: s.smarts, health: s.health, money: 0, traits: [], app: s.app as Npc['app'], met: l.year, flags: {} };
}

type Pane = null | 'chat' | 'emotes' | 'social' | 'score' | 'coop';

export function DuoDock() {
  const d = duo.value;
  void rev.value;
  const [pane, setPane] = useState<Pane>(null);
  const [amount, setAmount] = useState(0.1);
  const l = life.value;
  if (d.status !== 'room' || !l || screen.value !== 'game') return null;
  const p = d.peer;
  const toggle = (x: Pane) => { sfx.click(); const v = pane === x ? null : x; setPane(v); setChatOpen(v === 'chat'); };
  const status = !d.peerOnline ? T('hors ligne', 'offline') : !p ? '…' : !p.alive ? T('décédé·e', 'dead') : p.inPrison ? T('en prison', 'in jail') : `${p.age} ${T('ans', 'y/o')}`;
  return (
    <div class="duo-dock">
      <div class="duo-card glass" onClick={() => toggle(d.mode === 'versus' ? 'score' : d.mode === 'coop' ? 'coop' : 'social')}>
        {p ? <Portrait l={l} npc={peerFace(p)} size={44} /> : <div class="portrait pet" style={{ width: 44, height: 44 }}>💞</div>}
        <div class="dc-txt">
          <b>{p ? `${p.first} ${p.last}` : d.players.find((x) => x.id !== d.you)?.name ?? T('Partenaire', 'Partner')}</b>
          <small><span class={`dot ${d.peerOnline ? 'on' : ''}`} /> {status}{p?.job ? ` · ${p.job}` : ''}</small>
          {p && d.mode !== 'shared' && <small>💰 {p.money}{p.relRole ? ` · ${roleName(p.relRole)}` : ''}</small>}
          {d.mode === 'shared' && <small>💑 {T('Vie commune', 'Shared life')}</small>}
        </div>
      </div>
      <div class="duo-bar glass">
        <button onClick={() => toggle('chat')} title="Chat">💬{d.unread > 0 && <i class="badge">{d.unread}</i>}</button>
        <button onClick={() => toggle('emotes')} title="Emotes">😜</button>
        {d.mode !== 'shared' && <button onClick={() => toggle('social')} title={T('Interactions', 'Interactions')}>💞</button>}
        {d.mode === 'versus' && <button onClick={() => toggle('score')} title="Score">🏆</button>}
        {d.mode === 'coop' && <button onClick={() => toggle('coop')} title={T('Objectifs', 'Goals')}>🎯</button>}
        <button onClick={() => { sfx.open(); modal.value = { kind: 'duo' }; }} title={T('Salon', 'Room')}>🚪</button>
      </div>
      {pane === 'chat' && <ChatPane />}
      {pane === 'emotes' && <div class="duo-pane glass emotes">{EMOTES.map((e) => <button key={e} onClick={() => { emote(e); setPane(null); }}>{e}</button>)}</div>}
      {pane === 'social' && (
        <div class="duo-pane glass">
          <h4>💞 {T('Avec', 'With')} {p?.first ?? '…'}</h4>
          <label class="setting"><span>💸 {Math.round(amount * 100)}% {T('de mon argent', 'of my money')}</span><input type="range" min="0.01" max="1" step="0.01" value={amount} onInput={(e) => setAmount(+(e.target as HTMLInputElement).value)} /></label>
          <div class="soc-list">
            {socialOptions().map((o) => (
              <button key={o.kind} class="action" disabled={!o.ok} title={o.why ?? ''} onClick={() => { social(o.kind, { amount: Math.floor(l.money * amount), stake: Math.floor(l.money * amount) }); setPane(null); }}>
                <span class="a-icon">{o.icon}</span><span class="a-text"><span class="a-label">{o.label}</span>{(o.kind === 'gift' || o.kind === 'duel') && <span class="a-desc">{T('montant : curseur ci-dessus', 'amount: slider above')}</span>}</span>
              </button>
            ))}
          </div>
          {!p && <p class="muted">{T('Ton/ta partenaire n\'a pas encore commencé sa vie.', 'Your partner hasn\'t started their life yet.')}</p>}
        </div>
      )}
      {pane === 'score' && <ScorePane />}
      {pane === 'coop' && <CoopPane />}
    </div>
  );
}

function roleName(r: string) {
  const m: Record<string, [string, string]> = { friend: ['ami·e', 'friend'], partner: ['en couple', 'dating'], fiance: ['fiancé·e', 'engaged'], spouse: ['marié·e', 'married'], ex: ['ex', 'ex'] };
  return m[r] ? T(m[r][0], m[r][1]) : r;
}

function ChatPane() {
  const d = duo.value;
  const [txt, setTxt] = useState('');
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { box.current?.scrollTo(0, 1e9); }, [d.chat.length]);
  return (
    <div class="duo-pane glass chat">
      <div class="chat-log" ref={box}>
        {d.chat.length === 0 && <div class="muted small">{T('Dites-vous des mots doux. Ou des insultes.', 'Say sweet things. Or insults.')}</div>}
        {d.chat.map((c, i) => <div key={i} class={`chat-line ${c.from === d.you ? 'me' : ''}`}><b>{c.name}</b> {c.text}</div>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); chat(txt); setTxt(''); }}>
        <input value={txt} maxLength={500} placeholder={T('Écrire…', 'Type…')} onInput={(e) => setTxt((e.target as HTMLInputElement).value)} autoFocus />
        <button class="btn small primary" type="submit">➤</button>
      </form>
    </div>
  );
}

function ScorePane() {
  const d = duo.value, l = life.value!;
  const me = buildSummary(l), p = d.peer;
  const rows: [string, (s: PeerSummary) => number | string, boolean][] = [
    [T('Score de vie', 'Life score'), (s) => s.score, true], [T('Fortune ($)', 'Net worth ($)'), (s) => s.worth, true], [T('Âge', 'Age'), (s) => s.age, true],
    [T('Bonheur', 'Happiness'), (s) => s.happy, true], [T('Célébrité', 'Fame'), (s) => s.fame, true], [T('Karma', 'Karma'), (s) => s.karma, true], [T('Enfants', 'Kids'), (s) => s.kids, true],
  ];
  const fmt = (v: number | string) => (typeof v === 'number' ? v.toLocaleString(lang.value) : v);
  let mine = 0, theirs = 0;
  return (
    <div class="duo-pane glass">
      <h4>🏆 {T('Tableau des scores', 'Scoreboard')}</h4>
      <table class="score-table">
        <thead><tr><th /><th>{me.first}</th><th>{p?.first ?? '…'}</th></tr></thead>
        <tbody>
          {rows.map(([lab, f]) => {
            const a = f(me), b = p ? f(p) : 0;
            if (p) { if (a > b) mine++; else if (b > a) theirs++; }
            return <tr key={lab}><td>{lab}</td><td class={p && a > b ? 'win' : ''}>{fmt(a)}</td><td class={p && b > a ? 'win' : ''}>{p ? fmt(b) : '—'}</td></tr>;
          })}
        </tbody>
      </table>
      <p class="center">{p ? (mine > theirs ? T('😎 Tu mènes !', '😎 You\'re ahead!') : mine < theirs ? T('😤 Tu te fais distancer.', '😤 You\'re falling behind.') : T('🤝 Égalité parfaite.', '🤝 Dead even.')) : ''}</p>
    </div>
  );
}

function CoopPane() {
  const goals = coopGoals();
  const done = goals.filter((g) => g.progress >= 1).length;
  return (
    <div class="duo-pane glass">
      <h4>🎯 {T('Objectifs communs', 'Shared goals')} · {done}/{goals.length}</h4>
      {goals.map((g) => (
        <div key={g.id} class={`coop-goal ${g.progress >= 1 ? 'done' : ''}`}>
          <span>{g.progress >= 1 ? '✅' : g.icon}</span><span class="cg-label">{g.label}</span>
          <div class="bar"><div style={{ width: `${Math.round(g.progress * 100)}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

/** Incoming request from the partner (meet, date, proposal, baby, duel). */
export function DuoAsk() {
  const a = duo.value.ask, p = duo.value.peer;
  if (!a) return null;
  const who = String(a.data?.from ?? p?.first ?? '?');
  const stake = Number(a.data?.base) || 0;
  const q: Record<string, [string, string, string]> = {
    meet: ['🤝', `${who} veut faire ta connaissance.`, `${who} wants to meet you.`],
    date: ['🌹', `${who} te propose de sortir ensemble. Ses intentions sont… probablement douteuses.`, `${who} asks you out. Intentions: probably dubious.`],
    propose: ['💍', `${who} pose un genou à terre et sort une bague. Elle a l'air vraie.`, `${who} kneels and pulls out a ring. It looks real.`],
    baby: ['👶', `${who} veut faire un bébé avec toi. Ce soir. Maintenant.`, `${who} wants to make a baby with you. Tonight. Now.`],
    duel: ['⚔️', `${who} te défie en duel ! Mise : ${Math.round(stake).toLocaleString()} $ (équivalent).`, `${who} challenges you to a duel! Stake: $${Math.round(stake).toLocaleString()} (equivalent).`],
  };
  const [icon, f, e] = q[a.kind] ?? ['❓', a.kind, a.kind];
  return (
    <div class="modal-back">
      <div class="duo-ask glass pop-in">
        <div class="ask-icon">{icon}</div>
        <p>{T(f, e)}</p>
        <div class="row-btns">
          <Btn cls="primary big" onClick={() => answer(true)}>✅ {T('Oui', 'Yes')}</Btn>
          <Btn cls="big" onClick={() => answer(false)}>❌ {T('Non', 'No')}</Btn>
        </div>
      </div>
    </div>
  );
}

/** Big floating emote. */
export function EmoteBurst() {
  const e = emoteFx.value;
  const [shown, setShown] = useState<typeof e>(null);
  useEffect(() => { if (!e) return; setShown(e); const t = setTimeout(() => setShown(null), 1800); return () => clearTimeout(t); }, [e?.id]);
  if (!shown) return null;
  return <div class={`emote-burst ${shown.mine ? 'mine' : ''}`} key={shown.id}>{shown.e}</div>;
}

/** Vote indicator on event cards in shared-life mode. */
export function VoteHint() {
  const d = duo.value;
  if (!d.connected || d.mode !== 'shared') return null;
  return (
    <div class="vote-hint">
      {d.myVote !== undefined ? T(`Ton vote : ${d.myVote + 1}`, `Your vote: ${d.myVote + 1}`) : T('Votez tous les deux', 'Both of you vote')}
      {' · '}
      {d.peerVoted ? T('partenaire ✓', 'partner ✓') : T('partenaire réfléchit…', 'partner thinking…')}
    </div>
  );
}
