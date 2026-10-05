// Event engine: eligibility, actor binding, instantiation, choices, outcomes, effects.
import type { Rng } from './rng.ts';
import type { ActorSpec, Choice, Content, Effect, EventDef, Life, Loc, Npc, Outcome, Pending, PendingChoice, Resolution, Tone, AnyStat, StatKey, AttrKey, LocText, Mood } from './types.ts';
import { checkCond, statValue } from './cond.ts';
import { addLine, clamp, living, matchesRole, npcById, rngOf } from './util.ts';
import { country, renderLoc, toLocal } from './text.ts';
import { npcFromSpec } from './people.ts';
import { snapshot, diff } from './snapshot.ts';
import { leaveJob, promote } from './career.ts';
import { dropOut } from './edu.ts';
import { contract, cure, kill } from './health.ts';
import { arrest, imprison, release } from './crime.ts';
import { giveAsset, loseAsset } from './money.ts';

const STAT_KEYS: StatKey[] = ['happy', 'health', 'smarts', 'looks'];
const ATTR_KEYS: AttrKey[] = ['karma', 'fame', 'athletic', 'discipline', 'stress', 'fertility'];

let eventIndex: WeakMap<Content, Map<string, EventDef>> = new WeakMap();
export function eventDef(content: Content, id: string): EventDef | undefined {
  let m = eventIndex.get(content);
  if (!m) {
    m = new Map(content.events.map((e) => [e.id, e]));
    eventIndex.set(content, m);
  }
  return m.get(id);
}

// ───────────────────────────── actors ─────────────────────────────

function actorCandidates(life: Life, spec: ActorSpec): Npc[] {
  const o = typeof spec === 'string' ? { role: spec } : spec;
  if (!o.role) return [];
  return life.npcs.filter((n) => !n.temp && (o.living === false ? true : n.alive) && matchesRole(n, o.role!) &&
    (o.minRel === undefined || n.rel >= o.minRel) && (o.maxRel === undefined || n.rel <= o.maxRel));
}

/** Returns an actor (existing or freshly created) or null if the spec can't be satisfied. */
function bindActor(life: Life, content: Content, spec: ActorSpec, rng: Rng): Npc | null {
  const c = actorCandidates(life, spec);
  if (c.length) return rng.pick(c);
  const o = typeof spec === 'string' ? {} : spec;
  if ('create' in o && o.create) {
    const n = npcFromSpec(life, content, rng, o.create);
    n.temp = true;
    life.npcs.push(n);
    return n;
  }
  return null;
}

function canBindActor(life: Life, spec: ActorSpec | undefined): boolean {
  if (!spec) return true;
  if (typeof spec !== 'string' && spec.create) return true;
  return actorCandidates(life, spec).length > 0;
}

// ───────────────────────────── eligibility & picking ─────────────────────────────

export function eligible(life: Life, content: Content, e: EventDef, ignoreChain = false): boolean {
  if (e.chainOnly && !ignoreChain) return false;
  if ((e.rating ?? (e.mature ? 1 : 0)) > life.rating) return false;
  if (life.prison && e.when?.prison !== true) return false;
  const seen = life.seen[e.id];
  if (seen !== undefined) {
    if (e.once) return false;
    if (life.age - seen < (e.cooldown ?? 4)) return false;
  }
  if (!checkCond(life, content, e.when)) return false;
  return canBindActor(life, e.actor);
}

export function pickEvents(life: Life, content: Content, rng: Rng, count: number): EventDef[] {
  const pool = content.events.filter((e) => !e.priority && !e.auto && eligible(life, content, e));
  const out: EventDef[] = [];
  const cats = new Set<string>();
  for (let i = 0; i < count && pool.length; i++) {
    const chaos = life.mode === 'chaos';
    const e = rng.weighted(pool, (x) => (x.weight ?? 10) * (cats.has(x.cat) ? 0.25 : 1) * (chaos && (x.cat === 'weird' || x.cat === 'chaos') ? 6 : 1) * ((x.rating ?? 0) > 0 && life.rating === 2 ? 1.4 : 1));
    if (!e) break;
    if (e.when?.chance !== undefined && !rng.chance(e.when.chance)) { pool.splice(pool.indexOf(e), 1); i--; continue; }
    out.push(e);
    cats.add(e.cat);
    pool.splice(pool.indexOf(e), 1);
  }
  return out;
}

// ───────────────────────────── instantiation ─────────────────────────────

const emptyVars: Record<string, number | string> = {};

export function queueEvent(life: Life, content: Content, id: string, rng: Rng, actorId?: number, front = false): Pending | null {
  const e = eventDef(content, id);
  if (!e) return null;
  if ((e.rating ?? (e.mature ? 1 : 0)) > life.rating) return null;
  let actor: Npc | null | undefined = npcById(life, actorId);
  if (!actor && e.actor) actor = bindActor(life, content, e.actor, rng);
  if (e.actor && !actor) return null;
  const vars: Record<string, number | string> = {};
  if (e.vars) for (const k in e.vars) vars[k] = Math.round(rng.range(e.vars[k][0], e.vars[k][1]) / 5) * 5 || e.vars[k][0];
  life.seen[e.id] = life.age;
  const ctx = { life, content, actor: actor ?? undefined, vars };
  const rand = () => rng.next();
  const text = renderLoc(e.text, ctx, rand);
  if (e.auto) {
    // Feed-only line: apply effects now
    applyEffect(life, content, e.fx ?? {}, actor ?? undefined, vars, rng);
    addLine(life, text, e.icon, toneOf(e.fx));
    cleanupTemp(life);
    return null;
  }
  const choices: PendingChoice[] = [];
  (e.choices ?? []).forEach((c, idx) => {
    if (c.if && !checkCond(life, content, c.if)) return;
    if ((c.rating ?? 0) > life.rating) return;
    const outs = choiceOutcomes(c);
    choices.push({ label: renderLoc(c.label, ctx, rand), idx, risky: outs.length > 1, preview: outs.length === 1 ? previewOf(outs[0].fx, life, content) : {} });
  });
  const p: Pending = { key: e.id, actorId: actor?.id, vars, text, icon: e.icon, scene: e.scene, choices };
  if (front) life.queue.unshift(p); else life.queue.push(p);
  return p;
}

function choiceOutcomes(c: Choice): Outcome[] {
  if (c.out && c.out.length) return c.out;
  return [{ text: c.text ?? { fr: '', en: '' }, fx: c.fx, mood: c.mood }];
}

function previewOf(fx: Effect | undefined, life: Life, content: Content): PendingChoice['preview'] {
  const p: PendingChoice['preview'] = {};
  if (!fx) return p;
  for (const k of [...STAT_KEYS, 'karma', 'fame'] as AnyStat[]) if (typeof fx[k] === 'number' && fx[k]) p[k] = fx[k];
  if (typeof fx.money === 'number' && fx.money) p.money = Math.round(toLocal(fx.money, country(content, life.country)));
  if (fx.rel) p.rel = fx.rel;
  return p;
}

function toneOf(fx: Effect | undefined): Tone {
  if (!fx) return 'neutral';
  let s = (fx.happy ?? 0) + (fx.health ?? 0) * 0.8 + (fx.smarts ?? 0) * 0.5 + (fx.looks ?? 0) * 0.5 + (fx.rel ?? 0) * 0.3 + (fx.karma ?? 0) * 0.2;
  if (typeof fx.money === 'number') s += Math.sign(fx.money) * Math.min(6, Math.abs(fx.money) / 100);
  if (fx.die) return 'bad';
  return s > 1 ? 'good' : s < -1 ? 'bad' : 'neutral';
}

// ───────────────────────────── resolution ─────────────────────────────

export function currentEvent(life: Life): Pending | undefined { return life.queue[0]; }

/** Resolves the current pending event with the given choice index (index into `pending.choices`, or 0 for info cards). */
export function choose(life: Life, content: Content, choiceIndex: number): Resolution | null {
  const p = life.queue[0];
  if (!p) return null;
  const e = eventDef(content, p.key);
  life.queue.shift();
  const rng = rngOf(life);
  const actor = npcById(life, p.actorId);
  const before = snapshot(life);
  life.lastFx = e?.scene?.fx ? [e.scene.fx] : [];
  if (!e) return null;
  let res: Resolution;
  if (!p.choices.length) {
    applyEffect(life, content, e.fx ?? {}, actor, p.vars, rng);
    addLine(life, p.text, e.icon, toneOf(e.fx));
    res = { text: { fr: '', en: '' }, icon: e.icon, tone: toneOf(e.fx), deltas: [], mood: e.scene?.mood, actorId: actor?.id };
  } else {
    const pc = p.choices[Math.max(0, Math.min(choiceIndex, p.choices.length - 1))];
    const c = e.choices![pc.idx];
    const out = pickOutcome(life, choiceOutcomes(c), rng);
    const ctx = { life, content, actor, vars: p.vars };
    let text = renderLoc(out.text, ctx, () => rng.next());
    const over = applyEffect(life, content, out.fx ?? {}, actor, p.vars, rng);
    if (over) text = text.fr ? { fr: `${text.fr} ${over.fr}`, en: `${text.en} ${over.en}` } : over;
    const tone = out.tone ?? toneOf(out.fx);
    if (text.fr) addLine(life, text, out.icon ?? e.icon, tone);
    res = { text, icon: out.icon ?? e.icon, tone, deltas: [], mood: out.mood ?? c.mood ?? moodOf(tone), actorId: actor?.id, open: out.fx?.open };
  }
  res.deltas = diff(life, before);
  res.died = !life.alive;
  res.scene = e.scene;
  res.visual = life.lastFx?.length ? life.lastFx : undefined;
  cleanupTemp(life);
  return res;
}

function moodOf(t: Tone): Mood { return t === 'good' ? 'happy' : t === 'bad' ? 'sad' : 'neutral'; }

export function pickOutcome(life: Life, outs0: Outcome[], rng: Rng): Outcome {
  const outs = outs0.filter((o) => (o.rating ?? 0) <= life.rating);
  if (!outs.length) return outs0[0];
  if (outs.length === 1) return outs[0];
  return rng.weighted(outs, (o) => {
    let w = o.w ?? 1;
    if (o.odds) for (const k in o.odds) w *= Math.max(0.05, 1 + o.odds[k as AnyStat]! * (statValue(life, k as AnyStat) - 50) / 50);
    return w;
  }) ?? outs[0];
}

/** Resolves a list of outcomes outside the event flow (actions). */
export function resolveOutcomes(life: Life, content: Content, outs: Outcome[], actor: Npc | undefined, icon: string, vars: Record<string, number | string> = emptyVars): Resolution {
  const rng = rngOf(life);
  const before = snapshot(life);
  life.lastFx = [];
  const out = pickOutcome(life, outs, rng);
  let text = renderLoc(out.text, { life, content, actor, vars }, () => rng.next());
  const over = applyEffect(life, content, out.fx ?? {}, actor, vars, rng);
  if (over) text = text.fr ? { fr: `${text.fr} ${over.fr}`, en: `${text.en} ${over.en}` } : over;
  const tone = out.tone ?? toneOf(out.fx);
  if (text.fr) addLine(life, text, out.icon ?? icon, tone);
  const res: Resolution = { text, icon: out.icon ?? icon, tone, deltas: diff(life, before), mood: out.mood ?? moodOf(tone), actorId: actor?.id, open: out.fx?.open, died: !life.alive, visual: life.lastFx?.length ? life.lastFx : undefined };
  cleanupTemp(life);
  return res;
}

export function cleanupTemp(life: Life) {
  if (!life.npcs.some((n) => n.temp && !n.flags.candidate)) return;
  const pending = new Set(life.queue.map((p) => p.actorId));
  life.npcs = life.npcs.filter((n) => !n.temp || n.flags.candidate !== undefined || pending.has(n.id));
}

// ───────────────────────────── effects ─────────────────────────────

function arr<T>(v: T | T[] | undefined): T[] { return v === undefined ? [] : Array.isArray(v) ? v : [v]; }

export function applyEffect(life: Life, content: Content, fx: Effect, actor: Npc | undefined, vars: Record<string, number | string>, rng: Rng): Loc<string> | undefined {
  if (!life.alive) return undefined;
  let over: Loc<string> | undefined;
  for (const k of STAT_KEYS) if (fx[k]) life.stats[k] = clamp(life.stats[k] + fx[k]!);
  for (const k of ATTR_KEYS) if (fx[k]) life.attrs[k] = clamp(life.attrs[k] + fx[k]!);
  const c = country(content, life.country);
  if (fx.money !== undefined) {
    let base = 0;
    if (typeof fx.money === 'number') base = fx.money;
    else {
      const neg = fx.money.startsWith('-');
      const v = Number(vars[neg ? fx.money.slice(1) : fx.money] ?? 0);
      base = neg ? -v : v;
    }
    life.money += Math.round(toLocal(base, c));
  }
  if (fx.moneyPct) life.money = Math.round(life.money * (1 + fx.moneyPct));
  if (fx.weight) life.app.weight = clamp(life.app.weight + fx.weight, 0.15, 0.95);
  if (fx.grade) life.edu.grade = clamp(life.edu.grade + fx.grade);
  if (fx.perf && life.job) life.job.perf = clamp(life.job.perf + fx.perf);
  for (const f of arr(fx.flag)) life.flags[f] = life.age;
  for (const f of arr(fx.unflag)) delete life.flags[f];
  if (fx.trait && !life.traits.includes(fx.trait)) life.traits.push(fx.trait);
  if (fx.removeTrait) life.traits = life.traits.filter((t) => t !== fx.removeTrait);
  if (fx.revealTalent) life.talentKnown = true;
  if (fx.disease) contract(life, content, fx.disease, rng);
  if (fx.cure) cure(life, content, fx.cure);
  if (actor) {
    if (fx.rel) actor.rel = clamp(actor.rel + fx.rel);
    if (fx.actorRole) { actor.role = fx.actorRole; actor.temp = false; }
    if (fx.keep) actor.temp = false;
    if (fx.actorFlag) actor.flags[fx.actorFlag] = life.year;
    if (fx.actorGone) life.npcs = life.npcs.filter((n) => n !== actor);
    if (fx.actorDie) { actor.alive = false; actor.deathYear = life.year; }
  }
  if (fx.newNpc) life.npcs.push(npcFromSpec(life, content, rng, fx.newNpc));
  if (fx.promote) promote(life, content);
  if (fx.fired) leaveJob(life, content, 'fired');
  if (fx.quitJob) leaveJob(life, content, 'quit');
  if (fx.retire) leaveJob(life, content, 'retired');
  if (fx.expel || fx.dropout) {
    if (fx.expel) life.flags.expelled = life.age;
    dropOut(life, content);
  }
  if (fx.moveOut) { life.movedOut = true; life.place = 'apartment'; }
  if (fx.heat) life.heat = clamp(life.heat + fx.heat);
  if (fx.followers) life.followers = Math.max(0, Math.round(life.followers + fx.followers));
  if (fx.addiction) life.addictions[fx.addiction[0]] = clamp((life.addictions[fx.addiction[0]] ?? 0) + fx.addiction[1]);
  for (const k of arr(fx.counter)) life.counters[k] = (life.counters[k] ?? 0) + 1;
  if (fx.asset) giveAsset(life, content, fx.asset, rng);
  if (fx.loseAsset) loseAsset(life, content, fx.loseAsset, rng);
  if (fx.achievement && !life.achievements.includes(fx.achievement)) life.achievements.push(fx.achievement);
  if (fx.visual) life.lastFx = [...(life.lastFx ?? []), fx.visual];
  if (fx.jail) imprison(life, content, 'misc', fx.jail, rng);
  if (fx.release) release(life, content);
  if (fx.arrest) arrest(life, content, fx.arrest, rng);
  if (fx.log) addLine(life, renderLoc(fx.log, { life, content, actor, vars }, () => rng.next()));
  if (fx.fn) { const r = fx.fn({ life, content, actor, vars, rand: () => rng.next() }); if (r) over = r; }
  if (fx.schedule) life.scheduled.push({ key: fx.schedule.key, age: life.age + fx.schedule.years, actorId: actor?.id });
  if (fx.chain) queueEvent(life, content, fx.chain, rng, actor?.id, true);
  if (fx.die) kill(life, content, renderLoc(fx.die as LocText, { life, content, actor, vars }, () => rng.next()) as Loc<string>);
  return over;
}

export function runScheduled(life: Life, content: Content, rng: Rng) {
  const due = life.scheduled.filter((s) => s.age <= life.age);
  life.scheduled = life.scheduled.filter((s) => s.age > life.age);
  for (const s of due) {
    const e = eventDef(content, s.key);
    if (!e) continue;
    if (s.actorId !== undefined && !npcById(life, s.actorId)?.alive) continue;
    if (e.when && !checkCond(life, content, e.when)) continue;
    queueEvent(life, content, s.key, rng, s.actorId);
  }
}

export function runPriority(life: Life, content: Content, rng: Rng) {
  for (const e of content.events) {
    if (!e.priority) continue;
    if (eligible(life, content, e)) queueEvent(life, content, e.id, rng);
  }
}

export function runAuto(life: Life, content: Content, rng: Rng, max: number) {
  const pool = content.events.filter((e) => e.auto && !e.priority && eligible(life, content, e));
  for (let i = 0; i < max && pool.length; i++) {
    const e = rng.weighted(pool, (x) => x.weight ?? 10);
    if (!e) break;
    pool.splice(pool.indexOf(e), 1);
    if (e.when?.chance !== undefined && !rng.chance(e.when.chance)) continue;
    queueEvent(life, content, e.id, rng);
  }
}

export { living };
