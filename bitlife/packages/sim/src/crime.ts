// Crime & justice: committing crimes, police, arrest, trial, prison life, escape, parole.
import type { Rng } from './rng.ts';
import type { Content, CrimeDef, Life, Loc, Resolution, YearReport } from './types.ts';
import { addLine, clamp, L, living, rngOf } from './util.ts';
import { country, renderLoc, toLocal, formatMoney, renderString } from './text.ts';
import { checkCond, statValue } from './cond.ts';
import { snapshot, diff } from './snapshot.ts';
import { leaveJob } from './career.ts';
import { dropOut } from './edu.ts';
import { kill } from './health.ts';
import { queueEvent } from './events.ts';

const FACILITIES = ['Fleury-Mérogis', 'la Santé', 'Rikers Island', 'Alcatraz (rénovée)', 'la Prison Centrale', 'Pénitencier de Sing Sing', 'la Maison d\'arrêt municipale'];

export interface CrimeView { def: CrimeDef; ok: boolean; reason?: Loc<string>; chance: number }

export function crimeChance(life: Life, def: CrimeDef, bonus = 0): number {
  let p = def.success;
  if (def.odds) for (const k in def.odds) p *= Math.max(0.2, 1 + def.odds[k as keyof typeof def.odds]! * (statValue(life, k as keyof typeof def.odds) - 50) / 50);
  p += (life.counters.crimes ?? 0) * 0.004; // experience
  return clamp(p + bonus, 0.03, 0.97);
}

export function listCrimes(life: Life, content: Content): CrimeView[] {
  return content.crimes
    .filter((c) => (c.rating ?? 0) <= life.rating)
    .map((def) => {
      let reason: Loc<string> | undefined;
      if (life.prison) reason = L('Tu es en prison.', "You're in prison.");
      else if (life.queue.length) reason = L("Termine d'abord l'événement en cours.", 'Finish the current event first.');
      else if (life.age < def.minAge) reason = L(`Dès ${def.minAge} ans.`, `From age ${def.minAge}.`);
      else if (def.needs && !checkCond(life, content, def.needs)) reason = L('Conditions non remplies.', 'Requirements not met.');
      else if ((life.used[`crime:${def.id}`] ?? 0) >= 2) reason = L('Fais-toi oublier un peu cette année.', 'Lay low for the rest of the year.');
      return { def, ok: !reason, reason, chance: crimeChance(life, def) };
    });
}

/** Commits a crime. `bonus` (0..0.3) comes from an optional minigame. */
export function commitCrime(life: Life, content: Content, id: string, bonus = 0): Resolution | null {
  const v = listCrimes(life, content).find((x) => x.def.id === id);
  if (!v || !v.ok) return null;
  const def = v.def;
  const rng = rngOf(life);
  const before = snapshot(life);
  life.lastFx = [];
  life.used[`crime:${def.id}`] = (life.used[`crime:${def.id}`] ?? 0) + 1;
  const c = country(content, life.country);
  const success = rng.chance(crimeChance(life, def, bonus));
  const loot = def.loot ? Math.round(rng.range(def.loot[0], def.loot[1])) : 0;
  const vars = { loot, amount: loot };
  const ctx = { life, content, vars };
  let text: Loc<string>;
  let caught = false;
  if (success) {
    life.money += Math.round(toLocal(loot, c));
    life.attrs.karma = clamp(life.attrs.karma + def.karma);
    if (def.fame) life.attrs.fame = clamp(life.attrs.fame + def.fame);
    life.counters.crimes = (life.counters.crimes ?? 0) + 1;
    life.counters[`crime:${def.id}`] = (life.counters[`crime:${def.id}`] ?? 0) + 1;
    if (def.violent) life.counters.violent = (life.counters.violent ?? 0) + 1;
    life.heat = clamp(life.heat + def.tier * 6);
    text = renderLoc(def.text.ok, ctx, () => rng.next());
    caught = rng.chance(def.heat * (1 + life.heat / 120));
    if (def.violent) life.lastFx.push('gore');
    if (loot) life.lastFx.push('money');
  } else {
    life.attrs.karma = clamp(life.attrs.karma + def.karma / 2);
    text = renderLoc(def.text.fail, ctx, () => rng.next());
    caught = rng.chance(def.caught);
    if (def.violent && rng.chance(0.35)) {
      life.stats.health = clamp(life.stats.health - rng.int(8, 25));
      life.lastFx.push('gore');
    }
  }
  if (def.fx && success) {
    // lightweight effects only (stats)
    for (const k of ['happy', 'health', 'smarts', 'looks'] as const) if (def.fx[k]) life.stats[k] = clamp(life.stats[k] + def.fx[k]!);
  }
  if (caught) {
    const ct = renderLoc(def.text.caught, ctx, () => rng.next());
    text = { fr: `${text.fr} ${ct.fr}`, en: `${text.en} ${ct.en}` };
    life.lastFx.push('police');
    arrest(life, content, def.id, rng);
  }
  addLine(life, text, def.icon, success && !caught ? 'good' : 'bad');
  return { text, icon: def.icon, tone: success && !caught ? 'good' : 'bad', deltas: diff(life, before), mood: caught ? 'shock' : success ? 'proud' : 'sad', visual: life.lastFx, died: !life.alive };
}

/** Arrest: flags the crime and queues the trial card. */
export function arrest(life: Life, content: Content, crimeId: string, rng: Rng) {
  if (life.prison) return;
  life.flags.arrested = crimeId;
  life.counters.arrests = (life.counters.arrests ?? 0) + 1;
  queueEvent(life, content, 'sys_arrest', rng, undefined, false);
}

export type Defense = 'guilty' | 'public' | 'lawyer' | 'star' | 'flee' | 'minigame' | 'bribe';

/** Resolves the trial of the current arrest. Returns a short verdict for the log. */
export function trial(life: Life, content: Content, defense: Defense, score = 0.5): Loc<string> {
  const rng = rngOf(life);
  const crimeId = String(life.flags.arrested ?? 'misc');
  delete life.flags.arrested;
  const def = content.crimes.find((c) => c.id === crimeId);
  const c = country(content, life.country);
  const [s0, s1] = def?.sentence ?? [1, 3];
  let years = rng.int(s0, s1);
  let pAcquit = 0.12;
  switch (defense) {
    case 'guilty': years = Math.max(0, Math.round(years * 0.55)); pAcquit = 0; break;
    case 'public': pAcquit = 0.12 + (life.stats.smarts - 50) / 400; break;
    case 'lawyer': pAcquit = 0.35; life.money -= Math.round(toLocal(15000, c)); break;
    case 'star': pAcquit = 0.6; life.money -= Math.round(toLocal(90000, c)); break;
    case 'minigame': pAcquit = clamp(score * 0.85, 0.02, 0.9); years = Math.round(years * (1.3 - score * 0.6)); break;
    case 'bribe': pAcquit = 0.5; life.money -= Math.round(toLocal(25000, c)); if (rng.chance(0.3)) years += 3; break;
    case 'flee': {
      if (rng.chance(0.25 + (life.attrs.athletic - 50) / 200)) {
        life.heat = clamp(life.heat + 30);
        life.flags.fugitive = life.age;
        return L("J'ai faussé compagnie aux flics. Je suis désormais en cavale.", 'I gave the cops the slip. I am now a fugitive.');
      }
      years += 2;
      life.stats.health = clamp(life.stats.health - 15);
      life.lastFx = [...(life.lastFx ?? []), 'gore'];
      break;
    }
  }
  if (rng.chance(pAcquit)) {
    life.heat = clamp(life.heat - 20);
    life.counters.acquittals = (life.counters.acquittals ?? 0) + 1;
    return L('Le jury m\'a déclaré non coupable ! Je suis sorti du tribunal libre comme l\'air.', 'The jury found me not guilty! I walked out of court a free person.');
  }
  if (years <= 0) {
    const fine = Math.round(toLocal(rng.range(300, 3000), c));
    life.money -= fine;
    life.record.push({ crime: crimeId, year: life.year, years: 0 });
    life.flags.record = life.year;
    return { fr: `Coupable, mais j'ai juste écopé d'une amende de ${formatMoney(fine, c, 'fr')}.`, en: `Guilty, but I only got a ${formatMoney(fine, c, 'en')} fine.` };
  }
  imprison(life, content, crimeId, years, rng);
  return { fr: `Coupable. Condamné${life.gender === 'f' ? 'e' : ''} à ${years} an${years > 1 ? 's' : ''} de prison.`, en: `Guilty. Sentenced to ${years} year${years > 1 ? 's' : ''} in prison.` };
}

export function imprison(life: Life, content: Content, crimeId: string, years: number, rng: Rng) {
  if (life.mode === 'god' && life.flags.godImmune) return;
  if (life.prison) { life.prison.years += years; return; }
  if (life.job) leaveJob(life, content, 'fired', true);
  if (life.edu.enrolled) dropOut(life, content);
  life.prison = { years, served: 0, crime: crimeId, respect: 20, escapes: 0, facility: rng.pick(FACILITIES) };
  life.record.push({ crime: crimeId, year: life.year, years });
  life.flags.record = life.year;
  life.heat = 0;
  life.place = 'prison';
  life.counters.prisonYears = life.counters.prisonYears ?? 0;
  addLine(life, { fr: `Je suis incarcéré${life.gender === 'f' ? 'e' : ''} à ${life.prison.facility} pour ${years} an${years > 1 ? 's' : ''}.`, en: `I was locked up in ${life.prison.facility} for ${years} year${years > 1 ? 's' : ''}.` }, '🔒', 'bad');
  for (const n of living(life, 'lover')) n.rel = clamp(n.rel - 15);
}

export function release(life: Life, content: Content, how: 'served' | 'parole' | 'escape' = 'served') {
  if (!life.prison) return;
  const p = life.prison;
  life.prison = undefined;
  life.place = life.movedOut ? 'apartment' : 'home';
  if (how === 'escape') { life.flags.fugitive = life.age; life.heat = 80; }
  const txt = {
    served: L(`J'ai purgé ma peine. Je suis enfin libre, après ${p.served} an${p.served > 1 ? 's' : ''} derrière les barreaux.`, `I served my time. Finally free after ${p.served} year${p.served > 1 ? 's' : ''} behind bars.`),
    parole: L('Libération conditionnelle accordée ! Je dois pointer au commissariat, mais je respire.', 'Parole granted! I have to check in with the police, but I can breathe.'),
    escape: L("Je me suis évadé{|e} ! L'alarme hurle encore derrière moi.", 'I escaped! The alarm is still screaming behind me.'),
  }[how];
  addLine(life, { fr: renderString(txt.fr, { life, content }, 'fr'), en: txt.en }, how === 'escape' ? '🏃' : '🔓', 'good');
  life.stats.happy = clamp(life.stats.happy + 15);
}

export function yearlyPrison(life: Life, content: Content, rng: Rng, report: YearReport) {
  const p = life.prison;
  if (!p) {
    life.heat = clamp(life.heat - 8);
    // Fugitives get caught eventually
    if (life.flags.fugitive !== undefined && rng.chance(0.12 + life.heat / 400)) {
      delete life.flags.fugitive;
      addLine(life, L('La police a fini par me retrouver. Retour à la case prison, avec bonus.', 'The police finally tracked me down. Back to prison, with a bonus.'), '🚔', 'bad');
      imprison(life, content, 'escape', rng.int(3, 8), rng);
      report.milestones.push('arrested');
    }
    return;
  }
  p.served++;
  life.counters.prisonYears = (life.counters.prisonYears ?? 0) + 1;
  life.stats.happy = clamp(life.stats.happy - rng.range(2, 6));
  life.stats.health = clamp(life.stats.health - rng.range(0, 3));
  p.respect = clamp(p.respect + rng.range(-5, 5));
  // Shank risk for the disrespected
  if (life.rating >= 1 && p.respect < 15 && rng.chance(0.04)) {
    if (life.mode !== 'zen' && rng.chance(0.25)) { kill(life, content, { fr: renderString('poignardé{|e} à la cantine avec une brosse à dents taillée en pointe', { life, content }, 'fr'), en: 'shanked in the cafeteria with a sharpened toothbrush' }); return; }
    life.stats.health = clamp(life.stats.health - 25);
    addLine(life, L('Je me suis fait planter dans la cour avec une brosse à dents aiguisée. J\'ai survécu, mais je saigne encore en y pensant.', 'I got shanked in the yard with a sharpened toothbrush. I survived, but I still bleed thinking about it.'), '🩸', 'bad');
  }
  if (p.served >= p.years) {
    release(life, content, 'served');
    report.milestones.push('released');
  }
}

/** Prison escape attempt: score 0..1 from the minigame. */
export function escape(life: Life, content: Content, score: number): Resolution | null {
  const p = life.prison;
  if (!p) return null;
  const rng = rngOf(life);
  const before = snapshot(life);
  p.escapes++;
  life.used.escape = 1;
  if (score >= 0.999 || rng.chance(score * 0.9)) {
    release(life, content, 'escape');
    life.counters.escapes = (life.counters.escapes ?? 0) + 1;
    return { text: L("Évasion réussie ! J'ai rampé dans les égouts, mais je suis dehors.", 'Escape successful! I crawled through the sewers, but I am out.'), icon: '🏃', tone: 'good', deltas: diff(life, before), mood: 'proud', visual: ['explosion'] };
  }
  const extra = rng.int(2, 5);
  p.years += extra;
  p.respect = clamp(p.respect + 10);
  life.stats.health = clamp(life.stats.health - 10);
  addLine(life, { fr: `Évasion ratée. Les gardiens m'ont tabassé${life.gender === 'f' ? 'e' : ''} et j'ai pris ${extra} ans de plus.`, en: `Escape failed. The guards beat me up and I got ${extra} more years.` }, '🚨', 'bad');
  return { text: { fr: `Les projecteurs m'ont repéré. ${extra} ans de plus au compteur.`, en: `The searchlights found me. ${extra} more years on the clock.` }, icon: '🚨', tone: 'bad', deltas: diff(life, before), mood: 'sad', visual: ['police', 'gore'] };
}

export function parole(life: Life, content: Content): Resolution | null {
  const p = life.prison;
  if (!p) return null;
  const rng = rngOf(life);
  life.used.parole = 1;
  const before = snapshot(life);
  const chance = p.served >= p.years / 2 ? 0.25 + life.attrs.karma / 250 + (life.counters.prisonGood ?? 0) * 0.05 : 0.03;
  if (rng.chance(chance)) {
    release(life, content, 'parole');
    return { text: L('La commission a dit oui. Je sors en conditionnelle !', 'The board said yes. I am out on parole!'), icon: '🕊️', tone: 'good', deltas: diff(life, before), mood: 'happy' };
  }
  addLine(life, L('Libération conditionnelle refusée. Le président de la commission a bâillé pendant mon discours.', 'Parole denied. The board chairman yawned during my speech.'), '📋', 'bad');
  return { text: L('Refusée. Il a bâillé pendant mon discours.', 'Denied. He yawned during my speech.'), icon: '📋', tone: 'bad', deltas: diff(life, before), mood: 'sad' };
}

export { renderLoc };
