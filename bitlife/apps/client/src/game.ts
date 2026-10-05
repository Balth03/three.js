// Game controller: owns the Life, calls the simulation, drives the 3D stage, audio and saves.
import { content } from '@bl/data';
import {
  ageUp, choose, createLife, doAction, doRelAction, applyJob, enrollUni, enrollGrad, askOut, eventDef, npcById, living, npcAge,
  type Life, type NewLifeOptions, type Resolution, type Mood, type Place, type JobOffer, type TuitionPlan, type Npc,
} from '@bl/sim';
import type { Stage, StageView } from './three/stage.ts';
import type { AvatarSpec } from './three/avatar.ts';
import { life, rev, result, modal, screen, tab, bump, showToast, ageBusy, showDeath, settings, lang, profile, achToast, type MinigameKind } from './state.ts';
import { commitCrime, trial, escape, parole, appeal, gamble, workMinigame, summarize, heirLife, netWorth, formatMoney, country as countryOf, type Loc } from '@bl/sim';
import { mergeAchievements, bury } from './profile.ts';
import { saveLife, deleteSlot, AUTOSAVE } from './save.ts';
import { sfx, setMusicAge } from './audio.ts';
import { t } from './i18n.ts';

let stage: Stage | null = null;
export function setStage(s: Stage) { stage = s; }
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

export function doAgeUp() {
  const l = life.value;
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
  if (cine) setTimeout(() => stage?.cinematic(cine), 450);
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

export function pickChoice(i: number) {
  const l = life.value;
  if (!l || !l.queue.length || result.value) return;
  const p = l.queue[0];
  if (p.choices.length && (i < 0 || i >= p.choices.length)) return;
  sfx.click();
  const res = choose(l, content, i);
  if (!res) return;
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
function afterResolution(res: Resolution, showCard: boolean) {
  const l = life.value!;
  if (res.visual?.length) stage?.fx(res.visual);
  const m = l.counters.marriages ?? 0;
  if (m > lastMarriages) setTimeout(() => stage?.cinematic('wedding'), 300);
  lastMarriages = m;
  if (!!l.prison && !lastPrison) setTimeout(() => stage?.cinematic('prison'), 300);
  lastPrison = !!l.prison;
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
  if (res?.open) openUi(res.open);
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

function openUi(target: string) {
  const l = life.value;
  if (!l) return;
  const simple = ['jobs', 'university', 'grad', 'dating', 'crime', 'realestate', 'cars', 'shop', 'stocks', 'bank', 'business'] as const;
  if ((simple as readonly string[]).includes(target)) { modal.value = { kind: target } as typeof modal.value; sfx.open(); return; }
  if (target === 'parole') { handleRes(parole(l, content)); return; }
  if (target === 'appeal') { handleRes(appeal(l, content)); return; }
  if (target === 'minigame:escape') { openMinigame('escape', (s) => handleRes(escape(l, content, s))); return; }
  if (target === 'minigame:trial') {
    openMinigame('trial', (s) => {
      const v = trial(l, content, 'minigame', s);
      const r: Resolution = { text: v, icon: '⚖️', tone: l.prison ? 'bad' : 'good', deltas: [], mood: l.prison ? 'cry' : 'proud' };
      addLog(v, '⚖️', r.tone);
      handleRes(r);
    });
    return;
  }
  if (target === 'minigame:blackjack') {
    openMinigame('blackjack', (_s, net) => {
      const c = countryOf(content, l.country);
      const v = net ?? 0;
      const txt = v >= 0 ? { fr: `Blackjack : j'ai gagné ${formatMoney(v, c, 'fr')} !`, en: `Blackjack: I won ${formatMoney(v, c, 'en')}!` } : { fr: `Blackjack : j'ai perdu ${formatMoney(-v, c, 'fr')}. La banque gagne toujours.`, en: `Blackjack: I lost ${formatMoney(-v, c, 'en')}. The house always wins.` };
      handleRes(gamble(l, content, v, txt, '🃏'));
    });
    return;
  }
  const work: Record<string, { game: MinigameKind; icon: string; ok: Loc<string>; mid: Loc<string>; ko: Loc<string> }> = {
    'minigame:surgery': { game: 'surgery', icon: '🩺', ok: { fr: 'Opération réussie : le patient a survécu et m\'a même remercié.', en: 'Surgery successful: the patient survived and even thanked me.' }, mid: { fr: 'Opération moyenne : j\'ai oublié une compresse à l\'intérieur. Personne ne saura.', en: 'Mediocre surgery: I left a sponge inside. Nobody will know.' }, ko: { fr: 'Opération ratée. Le sang a giclé jusqu\'au plafond et l\'interne s\'est évanoui.', en: 'Botched surgery. Blood hit the ceiling and the intern fainted.' } },
    'minigame:cooking': { game: 'cooking', icon: '👨‍🍳', ok: { fr: 'Service parfait : un critique a pleuré dans sa soupe.', en: 'Perfect service: a critic cried into his soup.' }, mid: { fr: 'Service correct. Une table a renvoyé son steak « trop cru ».', en: 'Decent service. One table sent back a steak "too raw".' }, ko: { fr: 'Catastrophe en cuisine : feu, cris et un doigt dans le velouté.', en: 'Kitchen disaster: fire, screaming and a finger in the soup.' } },
    'minigame:match': { game: 'match', icon: '🏟️', ok: { fr: 'J\'ai été l\'homme du match ! Le stade scandait mon nom.', en: 'Player of the match! The stadium chanted my name.' }, mid: { fr: 'Match moyen. J\'ai couru beaucoup, servi à peu.', en: 'Average match. Ran a lot, achieved little.' }, ko: { fr: 'Match catastrophique : but contre mon camp et carton rouge.', en: 'Disastrous match: own goal and a red card.' } },
    'minigame:interrogation': { game: 'interrogation', icon: '🕵️', ok: { fr: 'Le suspect a craqué et tout avoué. Je suis un génie de l\'interrogatoire.', en: 'The suspect cracked and confessed. I am an interrogation genius.' }, mid: { fr: 'Aveux partiels. Il a juste admis avoir volé un yaourt.', en: 'Partial confession. He only admitted to stealing a yogurt.' }, ko: { fr: 'Le suspect m\'a fait craquer, moi. J\'ai pleuré devant le miroir sans tain.', en: 'The suspect broke ME. I cried in front of the one-way mirror.' } },
    'minigame:case': { game: 'case', icon: '⚖️', ok: { fr: 'Affaire gagnée ! Mon client, un ordure notoire, est libre. Champagne.', en: 'Case won! My client, a notorious scumbag, walks free. Champagne.' }, mid: { fr: 'Verdict mitigé. Mon client a pris du sursis.', en: 'Mixed verdict. My client got a suspended sentence.' }, ko: { fr: 'Affaire perdue. Mon client m\'a craché dessus en partant.', en: 'Case lost. My client spat on me on the way out.' } },
  };
  const w = work[target];
  if (w) { openMinigame(w.game, (s) => handleRes(workMinigame(l, content, s, s >= 0.7 ? w.ok : s >= 0.4 ? w.mid : w.ko, w.icon))); return; }
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
    openMinigame(def.minigame, (score) => handleRes(commitCrime(l, content, id, (score - 0.5) * 0.4)));
    return;
  }
  modal.value = null;
  handleRes(commitCrime(l, content, id));
}

export function continueAsHeir(childId: number) {
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
  if (res.open) { tab.value = null; openUi(res.open); bump(); return; }
  if (!keepModal) tab.value = null;
  afterResolution(res, true);
}

export function runAction(id: string) {
  const l = life.value;
  if (!l || result.value) return;
  sfx.click();
  handle(doAction(l, content, id));
}

export function runRelAction(npcId: number, actionId: string) {
  const l = life.value;
  if (!l || result.value) return;
  sfx.click();
  modal.value = null;
  handle(doRelAction(l, content, npcId, actionId));
}

export function apply(offer: JobOffer) {
  const l = life.value;
  if (!l) return;
  sfx.click();
  const res = applyJob(l, content, offer);
  modal.value = null;
  afterResolution(res, true);
}

export function enroll(major: string, plan: TuitionPlan, grad = false) {
  const l = life.value;
  if (!l) return;
  sfx.click();
  const res = grad ? enrollGrad(l, content, major, plan) : enrollUni(l, content, major, plan);
  modal.value = null;
  afterResolution(res, true);
}

export function date(npcId: number) {
  const l = life.value;
  if (!l) return;
  sfx.click();
  const res = askOut(l, content, npcId);
  modal.value = null;
  afterResolution(res, true);
}

export function npcOf(id: number) { const l = life.value; return l ? npcById(l, id) : undefined; }

export { content, rev };
