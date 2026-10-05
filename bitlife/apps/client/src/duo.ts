// Two-player logic: room state, partner summary, shared-life sync, social actions between the two players.
import { effect } from '@preact/signals';
import { content } from '@bl/data';
import { summarize, netWorth, formatMoney, careerTitle, country as countryOf, toBase, toLocal, makeNpc, inheritAppearance, rngOf, living, type Life, type Appearance, type NewLifeOptions } from '@bl/sim';
import type { DuoMode, PeerSummary, ServerMsg, SocialKind } from '@bl/shared';
import { duo, life, rev, lang, screen, ageBusy, result, modal, emoteFx, showToast, bump, type DuoState } from './state.ts';
import * as net from './net.ts';
import { applyOp, linkPeerNpc, syncPeerNpc, lifeHash, loadExisting, startLife, getStage, type Op } from './game.ts';
import { saveLife } from './save.ts';
import { sfx } from './audio.ts';

const set = (p: Partial<DuoState>) => { duo.value = { ...duo.value, ...p }; };
const fr = () => lang.value === 'fr';
const L = (f: string, e: string) => (fr() ? f : e);

export function myName() { try { return localStorage.getItem('bl.duo.name') ?? ''; } catch { return ''; } }

export function joinRoom(name: string, code: string | null, mode: DuoMode) {
  try { localStorage.setItem('bl.duo.name', name); } catch { /* private mode */ }
  set({ status: 'connecting', error: undefined, chat: [], unread: 0 });
  net.connect(code ? { name, code } : { name, create: true, mode });
}

export function leaveRoom() {
  net.disconnect();
  set({ status: 'off', connected: false, code: '', players: [], peer: null, peerOnline: false, ask: undefined, duel: undefined });
}

export function setMode(m: DuoMode) { net.sendMode(m); }

// ───────────────────────────── summary ─────────────────────────────

export function buildSummary(l: Life): PeerSummary {
  const c = countryOf(content, l.country);
  const s = summarize(l, content);
  const peer = l.npcs.find((n) => n.playerId === 'peer');
  return {
    name: duo.value.players.find((p) => p.id === duo.value.you)?.name ?? '', first: l.first, last: l.last, gender: l.gender, age: l.age, alive: l.alive,
    country: l.country, city: l.city, job: l.job ? careerTitle(content, l.job.careerId, l.job.level, l.gender, lang.value) : '',
    money: formatMoney(l.money, c, lang.value), worth: Math.round(toBase(netWorth(l, content), c)), score: s.score,
    happy: Math.round(l.stats.happy), health: Math.round(l.stats.health), smarts: Math.round(l.stats.smarts), looks: Math.round(l.stats.looks),
    fame: Math.round(l.attrs.fame), karma: Math.round(l.attrs.karma), kids: s.children, married: s.married, inPrison: !!l.prison, place: l.place,
    app: l.app, lifeId: l.id, linked: !!peer && peer.alive, relRole: peer?.role,
  };
}

let sumTimer: ReturnType<typeof setTimeout> | null = null;
let snapTimer: ReturnType<typeof setTimeout> | null = null;
effect(() => {
  void rev.value;
  const d = duo.value;
  if (!d.connected || !life.value || screen.value !== 'game') return;
  if (!sumTimer) sumTimer = setTimeout(() => { sumTimer = null; const l = life.value; if (l && duo.value.connected) net.sendSummary(buildSummary(l)); }, 600);
  if (d.mode === 'shared' && d.host && !snapTimer) snapTimer = setTimeout(sendSnapshot, 1200);
});

function sendSnapshot() {
  snapTimer = null;
  const l = life.value;
  if (!l || !duo.value.connected || duo.value.mode !== 'shared' || !duo.value.host) return;
  if (ageBusy.value) { snapTimer = setTimeout(sendSnapshot, 600); return; }
  net.sendSnapshot(JSON.parse(JSON.stringify(l)), lifeHash(l));
}

// ───────────────────────────── server messages ─────────────────────────────

net.onServer(onMsg, () => set({ connected: false, status: duo.value.status === 'off' ? 'off' : 'connecting' }));

function onMsg(m: ServerMsg) {
  const d = duo.value;
  switch (m.t) {
    case 'room': {
      const fresh = !d.connected;
      net.rememberRoom(m.code);
      set({ status: 'room', connected: true, code: m.code, you: m.you, host: m.host, mode: m.mode, players: m.players, error: undefined });
      if (fresh) sfx.good();
      if (life.value && screen.value === 'game') net.sendSummary(buildSummary(life.value));
      break;
    }
    case 'peer': {
      const was = d.peerOnline;
      set({ peer: m.s, peerOnline: m.online });
      if (m.online && !was && d.connected) showToast(`💞 ${m.s?.name || L('Ton/ta partenaire', 'Your partner')} ${L('est là', 'is here')} !`);
      if (m.s && life.value && duo.value.mode !== 'shared') { syncPeerNpc(m.s); bump(); }
      break;
    }
    case 'chat': {
      const mine = m.from === d.you;
      set({ chat: [...d.chat.slice(-120), m], unread: mine || chatOpen ? d.unread : d.unread + 1 });
      if (!mine) sfx.pop();
      break;
    }
    case 'emote':
      emoteFx.value = { e: m.e, mine: m.from === d.you, id: Date.now() + Math.random() };
      if (m.from !== d.you) sfx.love();
      break;
    case 'social': onSocial(m.kind, m.data ?? {}); break;
    case 'op': {
      applyOp(m.op as Op, m.from === d.you || (m.from === 'room' && d.host));
      if ((m.op as Op).k === 'choose') set({ myVote: undefined, peerVoted: false });
      break;
    }
    case 'vote': if (m.from !== d.you) set({ peerVoted: true }); break;
    case 'snapshot': onSnapshot(m.life as Life, m.hash); break;
    case 'start': onStart(m.opts); break;
    case 'error': {
      const msg = m.message === 'room_not_found' ? L('Salon introuvable.', 'Room not found.') : m.message === 'room_full' ? L('Salon plein (2 joueurs max).', 'Room is full (2 players max).') : m.message === 'version' ? L('Versions différentes : recharge la page.', 'Version mismatch: reload the page.') : m.message;
      net.disconnect();
      set({ status: 'off', connected: false, error: msg });
      sfx.bad();
      break;
    }
  }
}

let chatOpen = false;
export function setChatOpen(v: boolean) { chatOpen = v; if (v) set({ unread: 0 }); }

function onSnapshot(l: Life, hash: string) {
  const cur = life.value;
  if (duo.value.host) return;
  if (!cur || cur.id !== l.id || screen.value !== 'game') { loadExisting(l); saveLife(l); showToast(L('🔗 Vie commune synchronisée', '🔗 Shared life synced')); return; }
  if (ageBusy.value || result.value || cur.age > l.age) return;
  if (lifeHash(cur) !== hash) { loadExisting(l); console.info('[duo] resynced from host snapshot'); }
}

/** Host starts a game for both players (shared life or versus with the same seed). */
export function startTogether(opts: NewLifeOptions) {
  const d = duo.value;
  if (d.mode === 'shared') {
    startLife(opts);
    modal.value = null;
    setTimeout(sendSnapshot, 300);
  } else net.sendStart({ ...opts, seed: opts.seed ?? Math.floor(Math.random() * 1e9) });
}

function onStart(opts: Record<string, unknown>) {
  // Versus: same seed, same country, same birth year; each player keeps their own name.
  const o = opts as unknown as NewLifeOptions;
  startLife({ seed: o.seed, country: o.country, birthYear: o.birthYear, wealth: o.wealth, mode: o.mode });
  modal.value = null;
  showToast(L('⚔️ Même graine, même départ. Que le meilleur gagne !', '⚔️ Same seed, same start. May the best win!'));
}

// ───────────────────────────── social actions (parallel / coop / versus) ─────────────────────────────

export const EMOTES = ['❤️', '😂', '😱', '🖕', '💀', '🍆', '🔥', '😭', '👏', '🤮'];
export function emote(e: string) { net.sendEmote(e); }
export function chat(text: string) { const t = text.trim(); if (t) net.sendChat(t); }

function peerNpc() { return life.value?.npcs.find((n) => n.playerId === 'peer'); }
function bothAdults() { const p = duo.value.peer; return !!life.value && life.value.age >= 18 && !!p && p.age >= 18; }

export interface SocialOption { kind: SocialKind; icon: string; label: string; ok: boolean; why?: string }
export function socialOptions(): SocialOption[] {
  const l = life.value, p = duo.value.peer, n = peerNpc();
  if (!l || !p) return [];
  const alive = l.alive && p.alive && duo.value.peerOnline;
  const role = n?.alive ? n.role : undefined;
  const lover = role === 'partner' || role === 'fiance' || role === 'spouse';
  const adultWhy = L('Il faut être majeurs tous les deux', 'You both need to be adults');
  return [
    { kind: 'meet', icon: '🤝', label: L('Se rencontrer', 'Meet up'), ok: alive && !role },
    { kind: 'date', icon: '🌹', label: L('Sortir ensemble', 'Ask out'), ok: alive && !!role && !lover && bothAdults(), why: bothAdults() ? undefined : adultWhy },
    { kind: 'propose', icon: '💍', label: L('Demander en mariage', 'Propose'), ok: alive && role === 'partner' && bothAdults() },
    { kind: 'baby', icon: '👶', label: L('Faire un bébé', 'Make a baby'), ok: alive && lover && bothAdults() && l.age < 55 && p.age < 55 },
    { kind: 'gift', icon: '🎁', label: L('Offrir de l\'argent', 'Gift money'), ok: alive && l.money > 0 },
    { kind: 'duel', icon: '⚔️', label: L('Défier en duel', 'Challenge to a duel'), ok: alive && !duo.value.duel },
    { kind: 'slap', icon: '👋', label: L('Gifler', 'Slap'), ok: alive && !!role },
    ...(l.rating >= 1 ? [{ kind: 'poison' as SocialKind, icon: '☠️', label: L('Empoisonner son café', 'Poison their coffee'), ok: alive && !!role }] : []),
    { kind: 'breakup', icon: '💔', label: L('Rompre', 'Break up'), ok: alive && lover },
  ];
}

export function social(kind: SocialKind, data: Record<string, unknown> = {}) {
  const l = life.value, p = duo.value.peer;
  if (!l || !p) return;
  const c = countryOf(content, l.country);
  switch (kind) {
    case 'gift': {
      const amt = Math.min(l.money, Number(data.amount) || 0);
      if (amt <= 0) return;
      l.money -= amt;
      log(L(`J'ai offert ${formatMoney(amt, c, 'fr')} à ${p.first}.`, `I gave ${formatMoney(amt, c, 'en')} to ${p.first}.`), '🎁', 'neutral');
      net.sendSocial('gift', { base: toBase(amt, c), from: l.first });
      break;
    }
    case 'breakup': {
      const n = peerNpc(); if (n) n.role = 'ex';
      log(L(`J'ai largué ${p.first}. Par message. Comme un lâche.`, `I dumped ${p.first}. By text. Like a coward.`), '💔', 'bad');
      net.sendSocial('breakup');
      break;
    }
    case 'slap': {
      log(L(`J'ai giflé ${p.first} devant tout le monde. Ça claque.`, `I slapped ${p.first} in front of everyone. Loud.`), '👋', 'neutral');
      const n = peerNpc(); if (n) n.rel = Math.max(0, n.rel - 15);
      net.sendSocial('slap');
      break;
    }
    case 'poison': {
      l.attrs.karma = Math.max(0, l.attrs.karma - 25);
      log(L(`J'ai versé de la mort-aux-rats dans le café de ${p.first}. Avec deux sucres, je suis pas un monstre.`, `I put rat poison in ${p.first}'s coffee. With two sugars, I'm not a monster.`), '☠️', 'bad');
      net.sendSocial('poison', { from: l.first });
      break;
    }
    case 'duel': {
      const stake = Math.max(0, Math.min(l.money, Number(data.stake) || 0));
      set({ duel: { stake: toBase(stake, c) } });
      net.sendSocial('duel', { base: toBase(stake, c), from: l.first });
      showToast(L('⚔️ Défi envoyé…', '⚔️ Challenge sent…'));
      return;
    }
    default:
      net.sendSocial(kind, { from: l.first });
      showToast(L('📨 Demande envoyée…', '📨 Request sent…'));
      return;
  }
  sfx.click(); bump(); saveLife(l);
}

function log(t: string, icon: string, tone: 'good' | 'bad' | 'neutral') {
  const l = life.value!;
  let y = l.log[l.log.length - 1];
  if (!y || y.age !== l.age) { y = { age: l.age, year: l.year, lines: [] }; l.log.push(y); }
  y.lines.push({ t: { fr: t, en: t }, icon, tone });
}

/** Answer to an incoming request. */
export function answer(yes: boolean) {
  const a = duo.value.ask;
  const l = life.value, p = duo.value.peer;
  set({ ask: undefined });
  if (!a || !l || !p) return;
  const no = (`${a.kind}_no`) as SocialKind;
  if (!yes) { net.sendSocial(no, { from: l.first }); return; }
  switch (a.kind) {
    case 'meet': link('friend'); net.sendSocial('meet_ok', { from: l.first }); break;
    case 'date': link('partner'); net.sendSocial('date_ok', { from: l.first }); break;
    case 'propose': link('spouse'); net.sendSocial('propose_ok', { from: l.first }); wedding(); break;
    case 'baby': {
      const rng = rngOf(l);
      const gender = rng.chance(0.5) ? 'm' : 'f';
      const app = inheritAppearance(rng, l.app, p.app as Appearance, gender);
      const first = makeNpc(l, content, rng, { role: 'child', age: 0, gender }).first;
      l.nextId--;
      const data = { first, gender, app, last: (l.gender === 'm' ? l.last : (p.gender === 'm' ? p.last : l.last)) };
      addKid(data);
      net.sendSocial('baby_ok', data);
      break;
    }
    case 'duel': {
      const stake = Number(a.data?.base) || 0;
      set({ duel: { stake } });
      net.sendSocial('duel_ok', { from: l.first });
      startDuel();
      break;
    }
  }
}

function link(role: string) { const p = duo.value.peer; if (p) applyOp({ k: 'linkPeer', role, s: p }, true); }
function wedding() { setTimeout(() => getStage()?.cinematic('wedding'), 300); sfx.good(); }

function addKid(d: Record<string, unknown>) {
  const l = life.value!;
  const rng = rngOf(l);
  const kid = makeNpc(l, content, rng, { role: 'child', age: 0, gender: d.gender as 'm' | 'f', first: String(d.first), last: String(d.last), app: d.app as Appearance, rel: 90 });
  kid.flags.duoKid = 1;
  l.npcs.push(kid);
  l.counters.babies = (l.counters.babies ?? 0) + 1;
  log(L(`Bébé ! ${kid.first} est né${kid.gender === 'f' ? 'e' : ''}, fruit de mon amour avec ${duo.value.peer?.first}. ${kid.gender === 'f' ? 'Elle' : 'Il'} a les yeux de… on verra.`, `Baby! ${kid.first} was born, the fruit of my love with ${duo.value.peer?.first}.`), '👶', 'good');
  setTimeout(() => getStage()?.cinematic('baby'), 300);
  sfx.good(); bump(); saveLife(l);
}

const ASKS: Partial<Record<SocialKind, true>> = { meet: true, date: true, propose: true, baby: true, duel: true };

function onSocial(kind: SocialKind, data: Record<string, unknown>) {
  const l = life.value, p = duo.value.peer;
  if (!l) return;
  const c = countryOf(content, l.country);
  const who = String(data.from ?? p?.first ?? '?');
  if (ASKS[kind]) {
    if (!l.alive) { net.sendSocial(`${kind}_no` as SocialKind, { from: l.first, dead: true }); return; }
    set({ ask: { kind, data } });
    sfx.open();
    return;
  }
  switch (kind) {
    case 'meet_ok': link('friend'); showToast(L(`🤝 ${who} fait maintenant partie de ta vie !`, `🤝 ${who} is now part of your life!`)); break;
    case 'date_ok': link('partner'); showToast(L(`🌹 ${who} a dit oui !`, `🌹 ${who} said yes!`)); sfx.good(); break;
    case 'propose_ok': link('spouse'); showToast(L(`💍 ${who} a dit OUI ! Mariage !`, `💍 ${who} said YES! Wedding!`)); wedding(); break;
    case 'baby_ok': addKid(data); break;
    case 'duel_ok': startDuel(); break;
    case 'meet_no': case 'date_no': case 'propose_no': case 'baby_no': case 'duel_no': {
      const t: Record<string, [string, string]> = {
        meet_no: [`${who} a fait semblant de ne pas te voir.`, `${who} pretended not to see you.`],
        date_no: [`${who} t'a mis un râteau. Aïe.`, `${who} turned you down. Ouch.`],
        propose_no: [`${who} a dit NON. Devant tout le restaurant. Le violoniste s'est arrêté.`, `${who} said NO. In front of the whole restaurant. The violinist stopped.`],
        baby_no: [`${who} ne veut pas de bébé. Ou pas avec toi.`, `${who} doesn't want a baby. Or not with you.`],
        duel_no: [`${who} s'est dégonflé${p?.gender === 'f' ? 'e' : ''}. Poule mouillée.`, `${who} chickened out.`],
      };
      const [f, e] = t[kind];
      showToast(`🙅 ${L(f, e)}`);
      if (kind === 'propose_no') { l.stats.happy = Math.max(0, l.stats.happy - 15); log(L(f, e), '💔', 'bad'); }
      if (kind === 'duel_no') set({ duel: undefined });
      sfx.bad();
      break;
    }
    case 'gift': applyOp({ k: 'giftIn', amount: Math.round(toLocal(Number(data.base) || 0, c)), from: who }, true); break;
    case 'breakup': {
      const n = peerNpc(); if (n) n.role = 'ex';
      l.stats.happy = Math.max(0, l.stats.happy - 20);
      log(L(`${who} m'a largué${l.gender === 'f' ? 'e' : ''}. Par SMS. J'ai mangé un pot de glace entier en pleurant.`, `${who} dumped me. By text. I ate a whole tub of ice cream crying.`), '💔', 'bad');
      showToast(`💔 ${L(`${who} t'a quitté${l.gender === 'f' ? 'e' : ''}.`, `${who} dumped you.`)}`);
      sfx.bad(); bump(); saveLife(l);
      break;
    }
    case 'slap': {
      l.stats.happy = Math.max(0, l.stats.happy - 5); l.stats.health = Math.max(0, l.stats.health - 2);
      log(L(`${who} m'a mis une gifle monumentale. J'ai encore les cinq doigts imprimés.`, `${who} slapped me so hard I still have the five-finger print.`), '👋', 'bad');
      getStage()?.fx(['gore']);
      showToast(`👋 ${L('PAF !', 'SLAP!')}`);
      sfx.bad(); bump(); saveLife(l);
      break;
    }
    case 'poison': {
      const dmg = 25 + Math.floor(Math.random() * 35);
      l.stats.health = Math.max(1, l.stats.health - dmg);
      log(L(`Mon café avait un goût d'amande amère… ${who} a essayé de m'empoisonner ! J'ai vomi tripes et boyaux pendant trois jours.`, `My coffee tasted of bitter almonds… ${who} tried to poison me! I puked my guts out for three days.`), '☠️', 'bad');
      getStage()?.fx(['poop', 'gore']);
      showToast(`☠️ ${L('Empoisonné·e !', 'Poisoned!')} −${dmg} ❤️`);
      sfx.bad(); bump(); saveLife(l);
      break;
    }
    case 'duel_score': {
      const dd = duo.value.duel;
      if (!dd) break;
      set({ duel: { ...dd, theirs: Number(data.score) || 0 } });
      settleDuel();
      break;
    }
  }
}

// ── Duel: both play the same minigame; best score takes the stake.
function startDuel() {
  import('./game.ts').then(({ openMinigame }) => openMinigame('match', (score) => {
    const dd = duo.value.duel;
    if (!dd) return;
    set({ duel: { ...dd, mine: score } });
    net.sendSocial('duel_score', { score });
    settleDuel();
  }));
}

function settleDuel() {
  const dd = duo.value.duel, l = life.value, p = duo.value.peer;
  if (!dd || dd.mine === undefined || dd.theirs === undefined || !l || !p) return;
  const c = countryOf(content, l.country);
  const amt = Math.min(l.money, Math.round(toLocal(dd.stake, c)));
  const win = dd.mine > dd.theirs || (dd.mine === dd.theirs && duo.value.host);
  const pct = (x: number) => Math.round(x * 100);
  if (win) {
    l.money += Math.round(toLocal(dd.stake, c));
    log(L(`Duel contre ${p.first} : VICTOIRE ${pct(dd.mine)} à ${pct(dd.theirs)} ! J'ai empoché ${formatMoney(toLocal(dd.stake, c), c, 'fr')} et toute ma dignité.`, `Duel vs ${p.first}: VICTORY ${pct(dd.mine)} to ${pct(dd.theirs)}! I pocketed ${formatMoney(toLocal(dd.stake, c), c, 'en')}.`), '🏆', 'good');
    getStage()?.play('celebrate'); sfx.good();
  } else {
    l.money -= amt;
    l.stats.happy = Math.max(0, l.stats.happy - 5);
    log(L(`Duel contre ${p.first} : défaite humiliante ${pct(dd.mine)} à ${pct(dd.theirs)}. Adieu ${formatMoney(amt, c, 'fr')}.`, `Duel vs ${p.first}: humiliating defeat ${pct(dd.mine)} to ${pct(dd.theirs)}. Bye ${formatMoney(amt, c, 'en')}.`), '😵', 'bad');
    sfx.bad();
  }
  set({ duel: undefined });
  bump(); saveLife(l);
}

// ───────────────────────────── coop objectives ─────────────────────────────

export interface CoopGoal { id: string; icon: string; label: string; progress: number }
export function coopGoals(): CoopGoal[] {
  const l = life.value, p = duo.value.peer;
  if (!l) return [];
  const me = buildSummary(l);
  const both = [me, p].filter(Boolean) as PeerSummary[];
  const sum = (f: (s: PeerSummary) => number) => both.reduce((a, s) => a + f(s), 0);
  const min = (f: (s: PeerSummary) => number) => (both.length < 2 ? 0 : Math.min(...both.map(f)));
  const n = peerNpc();
  const kidsTogether = living(l, 'child').filter((k) => k.flags.duoKid).length;
  return [
    { id: 'rich', icon: '💰', label: L('1 M$ de fortune cumulée', '$1M combined net worth'), progress: sum((s) => s.worth) / 1e6 },
    { id: 'married', icon: '💍', label: L('Se marier ensemble', 'Marry each other'), progress: n?.role === 'spouse' ? 1 : n?.role === 'partner' || n?.role === 'fiance' ? 0.5 : n ? 0.2 : 0 },
    { id: 'kids', icon: '👶', label: L('3 enfants ensemble', '3 kids together'), progress: kidsTogether / 3 },
    { id: 'old', icon: '👵', label: L('Atteindre 80 ans tous les deux', 'Both reach 80'), progress: min((s) => s.age) / 80 },
    { id: 'famous', icon: '🌟', label: L('Célébrité cumulée 150', 'Combined fame 150'), progress: sum((s) => s.fame) / 150 },
    { id: 'happy', icon: '😁', label: L('Tous deux heureux (80+)', 'Both happy (80+)'), progress: min((s) => s.happy) / 80 },
    { id: 'clean', icon: '😇', label: L('Karma cumulé 160', 'Combined karma 160'), progress: sum((s) => s.karma) / 160 },
    { id: 'outlaws', icon: '🚔', label: L('Bonnie & Clyde : être en prison en même temps', 'Bonnie & Clyde: both in jail at once'), progress: both.filter((s) => s.inPrison).length / 2 },
  ].map((g) => ({ ...g, progress: Math.max(0, Math.min(1, g.progress)) }));
}
