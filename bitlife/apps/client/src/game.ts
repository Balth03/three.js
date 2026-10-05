// Game controller: owns the Life, calls the simulation, drives the 3D stage, audio and saves.
import { content } from '@bl/data';
import {
  ageUp, choose, createLife, doAction, doRelAction, applyJob, enrollUni, enrollGrad, askOut, eventDef, npcById, living, npcAge,
  type Life, type NewLifeOptions, type Resolution, type Mood, type Place, type JobOffer, type TuitionPlan, type Npc,
} from '@bl/sim';
import type { Stage, StageView } from './three/stage.ts';
import type { AvatarSpec } from './three/avatar.ts';
import { life, rev, result, modal, screen, tab, bump, showToast, ageBusy, showDeath, settings, lang } from './state.ts';
import { saveLife } from './save.ts';
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
  const l = createLife(content, { ...opts, family: settings.value.family });
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
  autosave();
}

export function loadExisting(l: Life) {
  life.value = l;
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
  if (rep.milestones.includes('promotion') || rep.milestones.some((m) => m.startsWith('graduate'))) setTimeout(() => { stage?.play('celebrate'); sfx.good(); }, 500);
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

function afterResolution(res: Resolution, showCard: boolean) {
  const l = life.value!;
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

function openUi(target: string) {
  if (target === 'jobs') modal.value = { kind: 'jobs' };
  else if (target === 'university') modal.value = { kind: 'university' };
  else if (target === 'grad') modal.value = { kind: 'grad' };
  else if (target === 'dating') modal.value = { kind: 'dating' };
  sfx.open();
}

function onDeath() {
  stage?.setFocus(false);
  placeOverride = null;
  syncStage();
  sfx.death();
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
