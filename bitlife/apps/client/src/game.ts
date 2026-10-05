// Game controller: owns the Life, calls the simulation, drives the 3D stage, audio and saves.
import { content } from '@bl/data';
import {
  ageUp, choose, createLife, doAction, doRelAction, applyJob, enrollUni, enrollGrad, askOut, eventDef, npcById, living, npcAge,
  type Life, type NewLifeOptions, type Resolution, type Mood, type Place, type JobOffer, type TuitionPlan, type Npc,
} from '@bl/sim';
import type { Stage, StageView } from './three/stage.ts';
import type { AvatarSpec } from './three/avatar.ts';
import { life, rev, result, modal, screen, tab, bump, showToast, ageBusy, showDeath, settings, lang, profile, achToast, mugshot, type MinigameKind } from './state.ts';
import { reincarnate, startGhost, ghostYear, haunt, ascend, isGhost, type GhostKind } from '@bl/sim';
import { commitCrime, trial, escape, parole, appeal, gamble, workMinigame, summarize, heirLife, netWorth, formatMoney, country as countryOf, type Loc } from '@bl/sim';
import { mergeAchievements, bury } from './profile.ts';
import { listJobs, datingCandidates, assetOffers, buyAsset, sellAsset, renovate, toggleRent, moveInto, takeLoan, repayLoans, buyStock, sellStock, startBusiness, investBusiness, sellBusiness, type AssetDef, type Financing } from '@bl/sim';
import type { PeerSummary } from '@bl/shared';
import { duo } from './state.ts';
import * as net from './net.ts';
import { saveLife, deleteSlot, AUTOSAVE } from './save.ts';
import { addPhoto } from './album.ts';
import { sfx, setMusicAge } from './audio.ts';
import { t } from './i18n.ts';

let stage: Stage | null = null;
export function setStage(s: Stage) { stage = s; s.onCinematic = (k) => takePhoto(k); }

/** Souvenir photo of the diorama, a moment after a cinematic / dramatic effect starts. */
export function takePhoto(kind: string, caption?: { fr: string; en: string }, delay = 1500) {
  const l = life.value;
  if (!l || !stage || screen.value !== 'game') return;
  const id = l.id, age = l.age, year = l.year;
  setTimeout(() => {
    if (life.value?.id !== id || !stage) return;
    try { const img = stage.snapshot(); if (img.length > 1000) addPhoto(id, { age, year, kind, img, caption }); } catch { /* ignore */ }
  }, delay);
}
export function getStage() { return stage; }

// ───────────────────────────── stage sync ─────────────────────────────

export function specOf(l: Life): AvatarSpec {
  const car = l.job ? content.careers.find((c) => c.id === l.job!.careerId) : undefined;
  return { gender: l.gender, age: l.age, app: l.app, outfit: car && !car.partTime ? car.outfit : undefined, backpack: l.edu.enrolled && l.age < 25, ghost: !l.alive };
}

export function npcSpec(n: Npc, year: number): AvatarSpec {
  const car = n.job ? content.careers.find((c) => c.id === n.job) : undefined;
  return { gender: n.gender, age: npcAge(n, year), app: n.app, outfit: car && npcAge(n, year) < 67 && !car.partTime && Math.abs(n.id * 7) % 3 === 0 ? car.outfit : undefined };
}

function companions(l: Life, place: Place, focusId?: number): Npc[] {
  let pool: Npc[];
  switch (place) {
    case 'school': case 'uni': pool = living(l, 'classmate').concat(living(l, ['friend', 'bestfriend'])); break;
    case 'office': case 'hospital': pool = l.job ? living(l, ['coworker', 'boss']) : living(l, 'family'); break;
    case 'cemetery': pool = living(l, ['mother', 'father', 'spouse', 'child', 'sibling', 'bestfriend']); break;
    case 'apartment': pool = living(l, ['partner', 'fiance', 'spouse', 'child', 'bestfriend', 'friend']); break;
    case 'park': case 'party': pool = living(l, ['partner', 'fiance', 'spouse', 'bestfriend', 'friend', 'child']); break;
    default: pool = l.movedOut ? living(l, ['spouse', 'partner', 'fiance', 'child']) : living(l, ['mother', 'father', 'sibling', 'spouse', 'child']);
  }
  pool = pool.filter((n) => n.role !== 'pet');
  const focus = focusId !== undefined ? l.npcs.find((n) => n.id === focusId && n.alive && n.role !== 'pet') : undefined;
  if (focus) pool = [focus, ...pool.filter((n) => n !== focus)];
  return pool.slice(0, 4);
}

let placeOverride: Place | null = null;

export function syncStage(focusId?: number) {
  const l = life.value;
  if (!l || !stage) return;
  const place = !l.alive ? 'cemetery' : placeOverride ?? l.place;
  const view: StageView = {
    place,
    age: l.age,
    player: { ...specOf(l), key: 'player' },
    others: companions(l, place, focusId).map((n) => ({ ...npcSpec(n, l.year), key: `npc${n.id}` })),
    dead: !l.alive,
    pets: ['home', 'apartment', 'villa', 'mansion', 'castle', 'beach', 'park'].includes(place) ? living(l, 'pet').map((n) => ({ key: `pet${n.id}`, species: n.species ?? 'dog', seed: n.id })) : [],
    tombLines: !l.alive ? [`${l.first} ${l.last}`, `${l.birthYear} – ${l.year}`, lang.value === 'fr' ? 'Repose en paix' : 'Rest in peace'] : undefined,
  };
  stage.show(view);
  setMusicAge(l.age);
  document.documentElement.dataset.ageband = l.age < 6 ? 'baby' : l.age < 13 ? 'child' : l.age < 18 ? 'teen' : l.age < 30 ? 'young' : l.age < 60 ? 'adult' : 'senior';
}

function refresh(focusId?: number) { bump(); syncStage(focusId); }

function autosave() { const l = life.value; if (l) saveLife(l); }

// ───────────────────────────── lifecycle ─────────────────────────────

export function startLife(opts: NewLifeOptions) {
  const l = createLife(content, { rating: settings.value.rating, ...opts });
  life.value = l;
  result.value = null;
  modal.value = null;
  tab.value = null;
  showDeath.value = false;
  placeOverride = null;
  screen.value = 'game';
  refresh();
  stage?.setMood('happy');
  stage?.resetCamera();
  setTimeout(() => stage?.cinematic('birth'), 600);
  lastMarriages = 0; lastPrison = false;
  autosave();
}

export function loadExisting(l: Life) {
  life.value = l;
  lastMarriages = l.counters?.marriages ?? 0; lastPrison = !!l.prison;
  result.value = null;
  modal.value = null;
  tab.value = null;
  showDeath.value = !l.alive;
  placeOverride = null;
  screen.value = 'game';
  refresh();
}

export function previewLife(opts: NewLifeOptions): Life {
  const l = createLife(content, opts);
  life.value = l;
  refresh();
  return l;
}

// ───────────────────────────── year loop ─────────────────────────────

function doAgeUpLocal() {
  const l = life.value;
  if (l && isGhost(l) && !l.flags.ascended) { ghostNext(); return; }
  if (!l || !l.alive || ageBusy.value) return;
  if (l.queue.length || result.value) { showToast(t('finish_event')); return; }
  modal.value = null;
  tab.value = null;
  ageBusy.value = true;
  const rep = ageUp(l, content);
  sfx.ageUp();
  stage?.ageUpFx();
  placeOverride = null;
  refresh();
  const moodOf: Mood = rep.died ? 'sad' : rep.milestones.some((m) => m.startsWith('graduate') || m === 'promotion' || m === 'baby') ? 'proud' : rep.milestones.some((m) => m.startsWith('death') || m === 'fired') ? 'sad' : 'neutral';
  stage?.setMood(moodOf);
  const cine = rep.died ? null : rep.milestones.includes('baby') ? 'baby' : rep.milestones.some((m) => m.startsWith('graduate')) ? 'graduation' : rep.milestones.includes('promotion') ? 'promotion' : rep.milestones.includes('released') ? 'release' : rep.milestones.includes('arrested') ? 'prison' : null;
  if (cine && cine !== 'prison') setTimeout(() => stage?.cinematic(cine), 450);
  checkPrisonEntry(l);
  if (rep.milestones.includes('promotion') || rep.milestones.some((m) => m.startsWith('graduate'))) setTimeout(() => { stage?.play('celebrate'); sfx.good(); }, 500);
  checkAch();
  setTimeout(() => {
    ageBusy.value = false;
    if (rep.died) onDeath();
    else if (l.queue.length) presentEvent();
    autosave();
    bump();
  }, settings.value.reducedMotion ? 150 : 700);
}

function presentEvent() {
  const l = life.value;
  const p = l?.queue[0];
  if (!l || !p) return;
  const def = eventDef(content, p.key);
  placeOverride = (def?.scene?.place && def.scene.place !== l.place) ? def.scene.place : null;
  syncStage(p.actorId);
  stage?.setFocus(true);
  stage?.setMood(def?.scene?.mood ?? 'neutral');
  if (p.actorId !== undefined) stage?.setOtherMood(`npc${p.actorId}`, def?.scene?.mood ?? 'neutral');
  sfx.card();
  sfx.blips(p.text.fr);
  bump();
}

function pickChoiceLocal(i: number, disagree = false) {
  const l = life.value;
  if (!l || !l.queue.length || result.value) return;
  const p = l.queue[0];
  if (p.choices.length && (i < 0 || i >= p.choices.length)) return;
  sfx.click();
  const res = choose(l, content, i);
  if (!res) return;
  if (disagree) {
    const t = { fr: 'Désaccord de couple sur ce choix : on a fini par tirer à pile ou face, et on boude depuis.', en: 'Couple disagreement on that choice: we ended up flipping a coin, and we\'ve been sulking since.' };
    addLog(t, '💢', 'bad');
    l.stats.happy = Math.max(0, l.stats.happy - 3);
    res.text = { fr: `${res.text.fr} (${t.fr})`, en: `${res.text.en} (${t.en})` };
  }
  if (!p.choices.length) {
    // informational card acknowledged → go straight to the next one
    afterResolution(res, false);
    return;
  }
  afterResolution(res, true);
}

function checkAch() {
  const l = life.value;
  if (!l) return;
  const p = profile.value;
  const fresh = mergeAchievements(p, l);
  if (fresh.length) {
    profile.value = { ...p };
    fresh.forEach((id, i) => setTimeout(() => { achToast.value = { id, n: Date.now() }; sfx.good(); }, 400 + i * 1600));
  }
  if (l.challenge && !p.challengesDone[l.challenge]) {
    const ch = content.challenges.find((c) => c.id === l.challenge);
    if (ch && ch.test(l)) { p.challengesDone[l.challenge] = Date.now(); profile.value = { ...p }; showToast(`🏆 ${ch.name[lang.value]} !`); sfx.good(); stage?.play('celebrate'); }
  }
}

let lastMarriages = 0;
let lastPrison = false;
function checkPrisonEntry(l: Life) {
  if (!!l.prison && !lastPrison) {
    setTimeout(() => stage?.cinematic('prison'), 300);
    const r = l.record[l.record.length - 1];
    mugshot.value = { crime: r?.crime ?? '', years: l.prison.years, n: Date.now() };
  }
  lastPrison = !!l.prison;
}
function afterResolution(res: Resolution, showCard: boolean) {
  const l = life.value!;
  if (res.visual?.length) {
    stage?.fx(res.visual);
    if (res.visual.some((v) => v === 'gore' || v === 'explosion' || v === 'police' || v === 'fire' || v === 'money')) {
      const cut = (s: string) => (s.length > 90 ? s.slice(0, 88) + '…' : s);
      takePhoto(`fx${l.age}`, { fr: cut(res.text.fr), en: cut(res.text.en) }, 700);
    }
  }
  const m = l.counters.marriages ?? 0;
  if (m > lastMarriages) setTimeout(() => stage?.cinematic('wedding'), 300);
  lastMarriages = m;
  checkPrisonEntry(l);
  checkAch();
  stage?.setMood(res.mood ?? (res.tone === 'good' ? 'happy' : res.tone === 'bad' ? 'sad' : 'neutral'));
  if (res.mood === 'love') sfx.love(); else if (res.tone === 'good') sfx.good(); else if (res.tone === 'bad') sfx.bad();
  if (res.deltas.some((d) => d.key === 'money' && d.value > 0)) setTimeout(() => sfx.coin(), 200);
  if (res.scene?.place && res.scene.place !== l.place) placeOverride = res.scene.place;
  if (showCard && (res.text.fr || res.deltas.length)) result.value = res;
  else continueAfterResult(res);
  refresh(res.actorId);
}

export function continueAfterResult(res = result.value) {
  const l = life.value;
  result.value = null;
  if (!l) return;
  if (!l.alive) { onDeath(); return; }
  if (l.queue.length) { presentEvent(); return; }
  stage?.setFocus(false);
  placeOverride = null;
  syncStage();
  if (res?.open && (!sharedOnline() || resMine)) openUi(res.open);
  autosave();
  bump();
}

const MG_TITLES: Record<string, Loc<string>> = {
  heist: { fr: 'Le casse', en: 'The heist' }, getaway: { fr: 'La fuite', en: 'The getaway' }, escape: { fr: 'L\'évasion', en: 'The escape' },
  trial: { fr: 'Ta plaidoirie', en: 'Your defense' }, blackjack: { fr: 'Blackjack', en: 'Blackjack' }, surgery: { fr: 'Au bloc opératoire', en: 'In the OR' },
  cooking: { fr: 'Coup de feu en cuisine', en: 'Dinner rush' }, match: { fr: 'Le grand match', en: 'The big match' }, interrogation: { fr: 'Interrogatoire', en: 'Interrogation' },
  case: { fr: 'Plaidoirie', en: 'Closing argument' }, date: { fr: 'Le rencard', en: 'The date' },
};

export function openMinigame(game: MinigameKind, onDone: (score: number, extra?: number) => void) {
  tab.value = null;
  modal.value = { kind: 'minigame', game, title: MG_TITLES[game][lang.value], onDone: (score, extra) => { modal.value = null; onDone(score, extra); } };
  sfx.open();
}

const WORK_TABLE: Record<string, { game: MinigameKind; icon: string; ok: Loc<string>; mid: Loc<string>; ko: Loc<string> }> = {
  'minigame:surgery': { game: 'surgery', icon: '🩺', ok: { fr: 'Opération réussie : le patient a survécu et m\'a même remercié.', en: 'Surgery successful: the patient survived and even thanked me.' }, mid: { fr: 'Opération moyenne : j\'ai oublié une compresse à l\'intérieur. Personne ne saura.', en: 'Mediocre surgery: I left a sponge inside. Nobody will know.' }, ko: { fr: 'Opération ratée. Le sang a giclé jusqu\'au plafond et l\'interne s\'est évanoui.', en: 'Botched surgery. Blood hit the ceiling and the intern fainted.' } },
  'minigame:cooking': { game: 'cooking', icon: '👨‍🍳', ok: { fr: 'Service parfait : un critique a pleuré dans sa soupe.', en: 'Perfect service: a critic cried into his soup.' }, mid: { fr: 'Service correct. Une table a renvoyé son steak « trop cru ».', en: 'Decent service. One table sent back a steak "too raw".' }, ko: { fr: 'Catastrophe en cuisine : feu, cris et un doigt dans le velouté.', en: 'Kitchen disaster: fire, screaming and a finger in the soup.' } },
  'minigame:match': { game: 'match', icon: '🏟️', ok: { fr: 'J\'ai été l\'homme du match ! Le stade scandait mon nom.', en: 'Player of the match! The stadium chanted my name.' }, mid: { fr: 'Match moyen. J\'ai couru beaucoup, servi à peu.', en: 'Average match. Ran a lot, achieved little.' }, ko: { fr: 'Match catastrophique : but contre mon camp et carton rouge.', en: 'Disastrous match: own goal and a red card.' } },
  'minigame:interrogation': { game: 'interrogation', icon: '🕵️', ok: { fr: 'Le suspect a craqué et tout avoué. Je suis un génie de l\'interrogatoire.', en: 'The suspect cracked and confessed. I am an interrogation genius.' }, mid: { fr: 'Aveux partiels. Il a juste admis avoir volé un yaourt.', en: 'Partial confession. He only admitted to stealing a yogurt.' }, ko: { fr: 'Le suspect m\'a fait craquer, moi. J\'ai pleuré devant le miroir sans tain.', en: 'The suspect broke ME. I cried in front of the one-way mirror.' } },
  'minigame:case': { game: 'case', icon: '⚖️', ok: { fr: 'Affaire gagnée ! Mon client, un ordure notoire, est libre. Champagne.', en: 'Case won! My client, a notorious scumbag, walks free. Champagne.' }, mid: { fr: 'Verdict mitigé. Mon client a pris du sursis.', en: 'Mixed verdict. My client got a suspended sentence.' }, ko: { fr: 'Affaire perdue. Mon client m\'a craché dessus en partant.', en: 'Case lost. My client spat on me on the way out.' } },
};

const WORK = (target: string) => WORK_TABLE[target];

function openUi(target: string) {
  const l = life.value;
  if (!l) return;
  if (target === 'dating') { dispatch({ k: 'dating' }); return; }
  const simple = ['jobs', 'university', 'grad', 'crime', 'realestate', 'cars', 'shop', 'stocks', 'bank', 'business'] as const;
  if ((simple as readonly string[]).includes(target)) { modal.value = { kind: target } as typeof modal.value; sfx.open(); return; }
  if (target === 'parole') { dispatch({ k: 'parole' }); return; }
  if (target === 'appeal') { dispatch({ k: 'appeal' }); return; }
  if (target === 'minigame:escape') { openMinigame('escape', (s) => dispatch({ k: 'escape', score: s })); return; }
  if (target === 'minigame:trial') {
    openMinigame('trial', (s) => dispatch({ k: 'trial', score: s }));
    return;
  }
  if (target === 'minigame:blackjack') {
    openMinigame('blackjack', (_s, net) => dispatch({ k: 'gamble', net: net ?? 0 }));
    return;
  }
  const w = WORK_TABLE[target];
  if (w) { openMinigame(w.game, (s) => dispatch({ k: 'work', target, score: s })); return; }
}


function addLog(t: Loc<string>, icon: string, tone: 'good' | 'bad' | 'neutral') {
  const l = life.value!;
  let y = l.log[l.log.length - 1];
  if (!y || y.age !== l.age) { y = { age: l.age, year: l.year, lines: [] }; l.log.push(y); }
  y.lines.push({ t, icon, tone });
}

/** Shows a resolution from any engine call (actions, purchases, minigames). */
export function handleRes(res: Resolution | null) {
  if (!res) return;
  modal.value = null;
  handle(res);
}

export function doCrime(id: string) {
  const l = life.value;
  if (!l || result.value) return;
  const def = content.crimes.find((c) => c.id === id);
  if (!def) return;
  sfx.click();
  if (def.minigame) {
    openMinigame(def.minigame, (score) => dispatch({ k: 'crime', id, bonus: (score - 0.5) * 0.4 }));
    return;
  }
  modal.value = null;
  dispatch({ k: 'crime', id, bonus: 0 });
}

/** Today's date and a seed derived from it: both players get the exact same starting life. */
export function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function startDaily() {
  const day = today();
  let h = 2166136261;
  for (const ch of day) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const countries = content.countries.map((c) => c.id);
  startLife({ seed: h, birthYear: 2026, country: countries[h % countries.length], gender: h % 2 ? 'm' : 'f' });
  const l = life.value;
  if (l) { l.flags.daily = day; autosave(); }
  showToast(lang.value === 'fr' ? `📅 Vie du jour ${day} : même départ pour tout le monde !` : `📅 Daily life ${day}: same start for everyone!`);
}

export function becomeGhost() {
  const l = life.value;
  if (!l || l.alive) return;
  startGhost(l);
  showDeath.value = false;
  modal.value = { kind: 'ghost' };
  stage?.fx(['ghost']);
  bump(); autosave();
}

export function ghostNext() {
  const l = life.value;
  if (!l || !isGhost(l)) return;
  const done = ghostYear(l, content);
  stage?.fx(['ghost']);
  sfx.ghost();
  bump(); autosave(); checkAch();
  if (done) { modal.value = null; setTimeout(() => { showDeath.value = true; }, 900); }
}

export function ghostHaunt(npcId: number, kind: GhostKind) {
  const l = life.value;
  if (!l) return;
  const t = haunt(l, content, npcId, kind);
  if (!t) return;
  stage?.fx(kind === 'nightmare' ? ['gore', 'ghost'] : kind === 'whisper' ? ['money'] : kind === 'bless' ? ['hearts'] : ['ghost']);
  showToast(t[lang.value]);
  bump(); autosave();
}

export function ghostAscend() {
  const l = life.value;
  if (!l) return;
  ascend(l);
  modal.value = null;
  bump(); autosave(); checkAch();
  setTimeout(() => { showDeath.value = true; }, 600);
}

export function reincarnateNow() {
  const old = life.value;
  if (!old || old.alive) return;
  const { life: l, verdict } = reincarnate(old, content, createLife);
  life.value = l;
  result.value = null; modal.value = null; tab.value = null; showDeath.value = false; placeOverride = null;
  lastMarriages = 0; lastPrison = false;
  screen.value = 'game';
  refresh();
  stage?.resetCamera();
  setTimeout(() => stage?.cinematic(verdict === 'bad' || verdict === 'monster' ? 'death' : 'birth'), 500);
  showToast(verdict === 'saint' ? '😇 Karma : jackpot !' : verdict === 'monster' ? '😈 Karma : tu vas payer.' : '♻️ Réincarnation');
  autosave();
}

export function continueAsHeir(childId: number) { dispatch({ k: 'heir', child: childId }); }
function continueAsHeirLocal(childId: number) {
  const l = life.value;
  if (!l) return;
  const n = heirLife(l, content, childId);
  life.value = n;
  result.value = null; modal.value = null; tab.value = null; showDeath.value = false; placeOverride = null;
  screen.value = 'game';
  refresh();
  stage?.resetCamera();
  autosave();
}

function onDeath() {
  stage?.setFocus(false);
  placeOverride = null;
  syncStage();
  sfx.death();
  stage?.cinematic('death');
  const l = life.value;
  if (l?.mode === 'hardcore') deleteSlot(AUTOSAVE);
  if (l) {
    checkAch();
    const s = summarize(l, content);
    const c = countryOf(content, l.country);
    if (typeof l.flags.daily === 'string') { const d = (profile.value.daily ??= {}); d[l.flags.daily] = Math.max(d[l.flags.daily] ?? 0, s.score); }
    bury(profile.value, { id: l.id, first: l.first, last: l.last, gender: l.gender, born: l.birthYear, died: l.year, age: l.age, cause: l.death?.cause ?? { fr: '', en: '' }, netWorth: formatMoney(netWorth(l, content), c, lang.value), score: s.score, country: l.country, generation: l.generation, app: l.app, titles: s.titles, mode: l.mode });
    profile.value = { ...profile.value };
  }
  setTimeout(() => { showDeath.value = true; }, 1600);
  autosave();
}

// ───────────────────────────── actions ─────────────────────────────

function handle(res: Resolution | null, keepModal = false) {
  if (!res) return;
  const l = life.value!;
  if (l.queue.length && !res.text.fr) { if (!keepModal) { modal.value = null; tab.value = null; } presentEvent(); return; }
  if (res.open) { tab.value = null; if (opMine) openUi(res.open); bump(); return; }
  if (!keepModal) tab.value = null;
  afterResolution(res, true);
}

function runActionLocal(id: string) {
  const l = life.value;
  if (!l || result.value) return;
  sfx.click();
  handle(doAction(l, content, id));
}

function runRelActionLocal(npcId: number, actionId: string) {
  const l = life.value;
  if (!l || result.value) return;
  sfx.click();
  modal.value = null;
  handle(doRelAction(l, content, npcId, actionId));
}

function applyLocal(offer: JobOffer) {
  const l = life.value;
  if (!l) return;
  sfx.click();
  const res = applyJob(l, content, offer);
  modal.value = null;
  afterResolution(res, true);
}

function enrollLocal(major: string, plan: TuitionPlan, grad = false) {
  const l = life.value;
  if (!l) return;
  sfx.click();
  const res = grad ? enrollGrad(l, content, major, plan) : enrollUni(l, content, major, plan);
  modal.value = null;
  afterResolution(res, true);
}

function dateLocal(npcId: number) {
  const l = life.value;
  if (!l) return;
  sfx.click();
  const res = askOut(l, content, npcId);
  modal.value = null;
  afterResolution(res, true);
}

export function npcOf(id: number) { const l = life.value; return l ? npcById(l, id) : undefined; }



// ───────────────────────────── operations (local or shared over the network) ─────────────────────────────

export type Op =
  | { k: 'ageUp'; age?: number } | { k: 'choose'; i: number; disagree?: boolean; sig?: string } | { k: 'action'; id: string } | { k: 'rel'; npc: number; id: string }
  | { k: 'crime'; id: string; bonus: number } | { k: 'apply'; career: string } | { k: 'enroll'; major: string; plan: TuitionPlan; grad: boolean }
  | { k: 'dating' } | { k: 'date'; npc: number } | { k: 'buy'; kind: AssetDef['kind']; key: string; fin: Financing } | { k: 'sell'; uid: number }
  | { k: 'reno'; uid: number } | { k: 'rent'; uid: number } | { k: 'movein'; uid: number } | { k: 'loan'; amount: number } | { k: 'repay' }
  | { k: 'stockBuy'; id: string; amount: number } | { k: 'stockSell'; id: string } | { k: 'bizStart'; sector: string; name: string }
  | { k: 'bizInvest'; kind: 'hire' | 'marketing' | 'expand' } | { k: 'bizSell' } | { k: 'trial'; score: number } | { k: 'escape'; score: number }
  | { k: 'parole' } | { k: 'appeal' } | { k: 'gamble'; net: number } | { k: 'work'; target: string; score: number } | { k: 'heir'; child: number }
  | { k: 'god'; stat: string; value: number } | { k: 'giftIn'; amount: number; from: string } | { k: 'linkPeer'; role: string; s: PeerSummary };

/** True while playing a shared ("vie commune") life online. */
export function sharedOnline() { return duo.value.connected && duo.value.mode === 'shared'; }

export function dispatch(op: Op) {
  if (sharedOnline()) { net.sendOp(op); return; }
  applyOp(op, true);
}

let opMine = true;
let resMine = true;
/** Applies an operation to the local life. `mine` = originated from this player (UI modals open only for them). */
export function applyOp(op: Op, mine: boolean) {
  const l = life.value;
  if (!l) return;
  opMine = mine;
  if (op.k !== 'choose') resMine = mine;
  switch (op.k) {
    case 'ageUp': if (op.age === undefined || op.age === l.age) doAgeUpLocal(); break;
    case 'choose': if (!op.sig || op.sig === choiceSig(l)) { resMine = mine; pickChoiceLocal(op.i, op.disagree); } break;
    case 'action': runActionLocal(op.id); break;
    case 'rel': runRelActionLocal(op.npc, op.id); break;
    case 'crime': modal.value = mine ? null : modal.value; handleRes(commitCrime(l, content, op.id, op.bonus)); break;
    case 'apply': { const o = listJobs(l, content).find((x) => x.careerId === op.career); if (o) applyLocal(o); break; }
    case 'enroll': enrollLocal(op.major, op.plan, op.grad); break;
    case 'dating': datingCandidates(l, content); if (mine) { modal.value = { kind: 'dating' }; sfx.open(); } bump(); break;
    case 'date': dateLocal(op.npc); break;
    case 'buy': { const o = assetOffers(l, content, op.kind).find((x) => x.key === op.key); if (o) handleRes(buyAsset(l, content, o, op.fin)); break; }
    case 'sell': handleRes(sellAsset(l, content, op.uid)); break;
    case 'reno': handleRes(renovate(l, content, op.uid)); break;
    case 'rent': toggleRent(l, content, op.uid); refresh(); break;
    case 'movein': moveInto(l, content, op.uid); refresh(); break;
    case 'loan': handleRes(takeLoan(l, content, op.amount)); break;
    case 'repay': handleRes(repayLoans(l)); break;
    case 'stockBuy': handleRes(buyStock(l, content, op.id, op.amount)); break;
    case 'stockSell': handleRes(sellStock(l, content, op.id)); break;
    case 'bizStart': handleRes(startBusiness(l, content, op.sector, op.name)); break;
    case 'bizInvest': handleRes(investBusiness(l, content, op.kind)); break;
    case 'bizSell': handleRes(sellBusiness(l, content)); break;
    case 'trial': {
      const v = trial(l, content, 'minigame', op.score);
      sfx.gavel();
      const r: Resolution = { text: v, icon: '⚖️', tone: l.prison ? 'bad' : 'good', deltas: [], mood: l.prison ? 'cry' : 'proud' };
      addLog(v, '⚖️', r.tone);
      handleRes(r);
      break;
    }
    case 'escape': handleRes(escape(l, content, op.score)); break;
    case 'parole': handleRes(parole(l, content)); break;
    case 'appeal': handleRes(appeal(l, content)); break;
    case 'gamble': {
      const c = countryOf(content, l.country);
      const v = op.net;
      if (!v) break;
      const txt = v >= 0 ? { fr: `Blackjack : j'ai gagné ${formatMoney(v, c, 'fr')} !`, en: `Blackjack: I won ${formatMoney(v, c, 'en')}!` } : { fr: `Blackjack : j'ai perdu ${formatMoney(-v, c, 'fr')}. La banque gagne toujours.`, en: `Blackjack: I lost ${formatMoney(-v, c, 'en')}. The house always wins.` };
      handleRes(gamble(l, content, v, txt, '🃏'));
      break;
    }
    case 'work': { const w = WORK(op.target); if (w) handleRes(workMinigame(l, content, op.score, op.score >= 0.7 ? w.ok : op.score >= 0.4 ? w.mid : w.ko, w.icon)); break; }
    case 'heir': continueAsHeirLocal(op.child); break;
    case 'god': {
      if (op.stat in l.stats) l.stats[op.stat as 'happy'] = Math.max(0, Math.min(100, op.value));
      else if (op.stat in l.attrs) l.attrs[op.stat as 'karma'] = Math.max(0, Math.min(100, op.value));
      else if (op.stat === 'money') l.money += op.value;
      else if (op.stat === 'cure') { l.conditions = []; l.addictions = {}; l.stats.health = 100; }
      else if (op.stat === 'freedom') { if (l.prison) l.prison.served = l.prison.years; l.heat = 0; }
      else if (op.stat === 'immune') l.flags.godImmune = l.flags.godImmune ? 0 : 1;
      bump();
      break;
    }
    case 'giftIn': {
      l.money += op.amount;
      const c = countryOf(content, l.country);
      addLog({ fr: `${op.from} m'a offert ${formatMoney(op.amount, c, 'fr')} ! 🎁`, en: `${op.from} gave me ${formatMoney(op.amount, c, 'en')}! 🎁` }, '🎁', 'good');
      sfx.coin(); stage?.fx(['money']); bump(); autosave();
      break;
    }
    case 'linkPeer': linkPeerNpc(op.s, op.role); break;
  }
  opMine = true;
}

/** Creates / updates the NPC that represents the other player in my life. */
export function linkPeerNpc(s: PeerSummary, role: string) {
  const l = life.value;
  if (!l) return;
  let n = l.npcs.find((x) => x.playerId === s.lifeId || x.playerId === 'peer');
  if (!n) {
    n = { id: l.nextId++, first: s.first, last: s.last, gender: s.gender, birthYear: l.year - s.age, alive: s.alive, role: role as Npc['role'], rel: 70, looks: s.looks, smarts: s.smarts, health: s.health, money: 0, traits: [], app: s.app as Npc['app'], met: l.year, flags: { player: 1 }, playerId: 'peer' };
    l.npcs.push(n);
  } else n.role = role as Npc['role'];
  if (role === 'spouse') l.counters.marriages = (l.counters.marriages ?? 0) + 1;
  refresh(n.id);
  autosave();
}

/** Keeps the partner's NPC in sync with their real life (age, looks, alive). */
export function syncPeerNpc(s: PeerSummary | null) {
  const l = life.value;
  if (!l || !s) return;
  const n = l.npcs.find((x) => x.playerId === 'peer');
  if (!n) return;
  n.birthYear = l.year - s.age; n.app = s.app as Npc['app']; n.looks = s.looks; n.smarts = s.smarts; n.health = s.health; n.first = s.first; n.last = s.last;
  if (!s.alive && n.alive) { n.alive = false; n.deathYear = l.year; addLog({ fr: `${s.first} est mort${s.gender === 'f' ? 'e' : ''}. Notre histoire continue dans mes souvenirs.`, en: `${s.first} died. Our story lives on in my memories.` }, '🕊️', 'bad'); }
}

export function lifeHash(l: Life) { return `${l.age}|${Math.round(l.money)}|${l.rng.join(',')}|${l.log.length}|${l.npcs.length}`; }

export const doAgeUp = () => dispatch({ k: 'ageUp', age: life.value?.age });
export function choiceSig(l: Life) { const p = l.queue[0]; return p ? `${p.key}:${l.age}:${l.queue.length}:${l.log.length}:${l.log[l.log.length - 1]?.lines.length ?? 0}` : ''; }
export function pickChoice(i: number) {
  const l = life.value;
  if (!l || !l.queue.length || result.value) return;
  if (sharedOnline() && l.queue[0].choices.length) { net.sendVote(choiceSig(l), i); duo.value = { ...duo.value, myVote: i }; sfx.click(); return; }
  dispatch({ k: 'choose', i, sig: choiceSig(l) });
}
export const runAction = (id: string) => { if (result.value) return; dispatch({ k: 'action', id }); };
export const runRelAction = (npc: number, id: string) => { if (result.value) return; dispatch({ k: 'rel', npc, id }); };
export const apply = (offer: JobOffer) => dispatch({ k: 'apply', career: offer.careerId });
export const enroll = (major: string, plan: TuitionPlan, grad = false) => dispatch({ k: 'enroll', major, plan, grad });
export const date = (npc: number) => dispatch({ k: 'date', npc });
export const openDating = () => dispatch({ k: 'dating' });
export function isMine() { return opMine; }

export { content, rev };
