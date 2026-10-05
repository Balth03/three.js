// Education: automatic school stages, grades, graduation, university & graduate programs.
import type { Rng } from './rng.ts';
import type { Content, EduStage, Life, Loc, Resolution, YearReport } from './types.ts';
import { addLine, clamp, L, living, rngOf } from './util.ts';
import { country, renderString, toLocal, formatMoney } from './text.ts';
import { makeNpc } from './people.ts';
import { snapshot, diff } from './snapshot.ts';
import { leaveJob } from './career.ts';

export const STAGE_START: Partial<Record<EduStage, number>> = { preschool: 3, primary: 6, middle: 11, high: 15 };
const ICON: Record<string, string> = { preschool: '🧸', primary: '🎒', middle: '📚', high: '🏫', uni: '🎓', grad: '🎓' };

export function schoolName(life: Life, content: Content, stage: EduStage, rng: Rng): string {
  const c = country(content, life.country);
  if (stage === 'uni' || stage === 'grad') return rng.pick(c.uniNames).replace('{city}', life.city);
  const fmt = c.schoolFmt[stage as 'primary'] ?? '{name}';
  return fmt.replace('{name}', rng.pick(c.schoolNames)).replace('{city}', life.city);
}

export function stageLabel(content: Content, life: Life, stage: EduStage): Loc<string> {
  const c = country(content, life.country);
  if (stage === 'grad') return L('Études supérieures', 'Graduate school');
  if (stage === 'none') return L('Aucune', 'None');
  return c.schools[stage];
}

function enroll(life: Life, content: Content, stage: EduStage, rng: Rng) {
  const e = life.edu;
  e.stage = stage;
  e.enrolled = true;
  e.yearInStage = 0;
  e.school = schoolName(life, content, stage, rng);
  if (stage !== 'uni' && stage !== 'grad') {
    // fresh classmates for each school
    life.npcs = life.npcs.filter((n) => n.role !== 'classmate');
    const count = stage === 'preschool' ? 2 : 3;
    for (let i = 0; i < count; i++) life.npcs.push(makeNpc(life, content, rng, { role: 'classmate', age: life.age + rng.int(-1, 0), rel: rng.int(30, 60) }));
  } else {
    life.npcs = life.npcs.filter((n) => n.role !== 'classmate');
    for (let i = 0; i < 2; i++) life.npcs.push(makeNpc(life, content, rng, { role: 'classmate', age: life.age + rng.int(-1, 3), rel: rng.int(30, 55) }));
  }
  const lab = stageLabel(content, life, stage);
  addLine(life, {
    fr: renderString(`Je suis entré{|e} en ${lab.fr.toLowerCase()} : ${e.school}.`, { life, content }, 'fr'),
    en: `I started ${lab.en.toLowerCase()} at ${e.school}.`,
  }, ICON[stage], 'neutral');
  life.place = stage === 'uni' || stage === 'grad' ? 'uni' : 'school';
}

function gradeDrift(life: Life, rng: Rng) {
  const e = life.edu;
  const target = clamp(life.stats.smarts * 0.7 + e.effort * 0.3 + (life.attrs.discipline - 50) * 0.2);
  e.grade = clamp(e.grade + (target - e.grade) * 0.35 + rng.range(-7, 7));
  e.effort = clamp(e.effort + (40 - e.effort) * 0.5);
}

export function gradeLetter(g: number): string {
  return g >= 90 ? 'A+' : g >= 80 ? 'A' : g >= 70 ? 'B' : g >= 60 ? 'C' : g >= 45 ? 'D' : 'F';
}

export function yearlyEdu(life: Life, content: Content, rng: Rng, report: YearReport) {
  const e = life.edu;
  const age = life.age;
  if (e.enrolled) {
    e.yearInStage++;
    gradeDrift(life, rng);
    life.stats.smarts = clamp(life.stats.smarts + rng.range(0, 2.2) * (0.5 + e.effort / 100));
  }
  if (!e.dropout) {
    for (const st of ['preschool', 'primary', 'middle', 'high'] as const) {
      if (age === STAGE_START[st]) {
        enroll(life, content, st, rng);
        report.milestones.push(`school:${st}`);
      }
    }
  }
  if (e.enrolled && e.stage === 'high' && age >= 18) {
    if (e.grade >= 32 || rng.chance(0.5)) {
      e.enrolled = false;
      e.degrees.push('high');
      const c = country(content, life.country);
      addLine(life, {
        fr: renderString(`J'ai obtenu mon diplôme de fin d'études${c.id === 'fr' ? ' (le bac !)' : ''} avec une moyenne de ${gradeLetter(e.grade)}.`, { life, content }, 'fr'),
        en: `I graduated from high school with a ${gradeLetter(e.grade)} average.`,
      }, '🎓', 'good');
      life.stats.happy = clamp(life.stats.happy + 8);
      life.npcs = life.npcs.filter((n) => n.role !== 'classmate');
      report.milestones.push('graduate:high');
      queueMilestone(life, 'edu_after_high');
    } else {
      e.yearInStage = 2;
      addLine(life, L("J'ai raté mon diplôme de fin d'études. Je redouble ma dernière année.", 'I failed my final exams. I have to repeat my senior year.'), '📉', 'bad');
      life.stats.happy = clamp(life.stats.happy - 10);
      report.milestones.push('fail:high');
    }
  }
  if (e.enrolled && e.stage === 'uni') {
    const m = content.majors.find((x) => x.id === e.major);
    payTuition(life, content);
    if (m && e.yearInStage >= m.years) {
      e.enrolled = false;
      e.degrees.push(`uni:${m.id}`);
      addLine(life, { fr: `J'ai obtenu mon diplôme en ${m.name.fr} (${gradeLetter(e.grade)}) !`, en: `I graduated with a degree in ${m.name.en} (${gradeLetter(e.grade)})!` }, '🎓', 'good');
      life.stats.happy = clamp(life.stats.happy + 10);
      life.npcs = life.npcs.filter((n) => n.role !== 'classmate');
      report.milestones.push('graduate:uni');
      queueMilestone(life, 'edu_after_uni');
      life.place = 'home';
    }
  } else if (e.enrolled && e.stage === 'grad') {
    const p = content.grads.find((x) => x.id === e.gradProgram);
    payTuition(life, content);
    if (p && e.yearInStage >= p.years) {
      e.enrolled = false;
      e.degrees.push(`grad:${p.id}`);
      addLine(life, { fr: `J'ai terminé mon cursus : ${p.name.fr} !`, en: `I completed my ${p.name.en}!` }, '🎓', 'good');
      life.stats.happy = clamp(life.stats.happy + 10);
      report.milestones.push('graduate:grad');
      life.place = 'home';
    }
  }
}

function queueMilestone(life: Life, key: string) {
  life.scheduled.push({ key, age: life.age });
}

export type TuitionPlan = 'parents' | 'loan' | 'scholarship' | 'self';

function payTuition(life: Life, content: Content) {
  const cost = Number(life.flags.tuition ?? 0);
  const plan = String(life.flags.tuitionPlan ?? 'self') as TuitionPlan;
  if (!cost) return;
  if (plan === 'loan') life.edu.loan += cost;
  else if (plan === 'self') life.money -= cost;
  else if (plan === 'parents') {
    const p = living(life, 'parent').sort((a, b) => b.money - a.money)[0];
    if (p) p.money -= cost; else life.edu.loan += cost;
  }
  void content;
}

export function tuitionCost(life: Life, content: Content, multiplier = 1): number {
  const c = country(content, life.country);
  return Math.round(toLocal(c.uniCost * multiplier, c));
}

export interface TuitionOption { plan: TuitionPlan; ok: boolean; reason?: Loc<string> }

export function tuitionOptions(life: Life, content: Content, cost: number, smartsReq: number): TuitionOption[] {
  const parents = living(life, 'parent');
  const richParent = parents.find((p) => p.money >= cost * 4 && p.rel >= 45);
  return [
    { plan: 'scholarship', ok: life.edu.grade >= 85 && life.stats.smarts >= smartsReq + 15, reason: L('Il faut des notes excellentes.', 'Requires excellent grades.') },
    { plan: 'parents', ok: !!richParent, reason: L('Tes parents ne peuvent pas (ou ne veulent pas).', "Your parents can't (or won't).") },
    { plan: 'loan', ok: life.age >= 17, reason: L('Trop jeune.', 'Too young.') },
    { plan: 'self', ok: life.money >= cost, reason: L("Pas assez d'argent.", 'Not enough money.') },
  ];
}

export function enrollUni(life: Life, content: Content, majorId: string, plan: TuitionPlan): Resolution {
  const m = content.majors.find((x) => x.id === majorId)!;
  const before = snapshot(life);
  const rng = rngOf(life);
  const cost = tuitionCost(life, content);
  const fmt = (lang: 'fr' | 'en') => formatMoney(cost, country(content, life.country), lang);
  // Admission
  const p = clamp(0.35 + (life.stats.smarts - m.smarts) / 40 + (life.edu.grade - 50) / 120, 0.03, 0.97);
  life.used['uni_apply'] = (life.used['uni_apply'] ?? 0) + 1;
  if (!rng.chance(p)) {
    return { text: { fr: `Ma candidature en ${m.name.fr} a été refusée. Il faudra retenter l'an prochain.`, en: `My application to study ${m.name.en} was rejected. I'll try again next year.` }, icon: '📭', tone: 'bad', deltas: diff(life, before), mood: 'sad' };
  }
  if (life.job && !life.job.partTime) leaveJob(life, content, 'quit');
  life.edu.major = m.id;
  life.edu.grade = clamp(life.edu.grade * 0.6 + 25);
  life.flags.tuition = plan === 'scholarship' ? 0 : cost;
  life.flags.tuitionPlan = plan;
  enroll(life, content, 'uni', rng);
  life.stats.happy = clamp(life.stats.happy + 6);
  const payFr = { parents: 'Mes parents paient les frais', loan: `J'ai contracté un prêt étudiant (${fmt('fr')}/an)`, scholarship: "J'ai obtenu une bourse complète", self: `Je paie moi-même (${fmt('fr')}/an)` }[plan];
  const payEn = { parents: 'My parents are paying', loan: `I took out a student loan (${fmt('en')}/yr)`, scholarship: 'I got a full scholarship', self: `I'm paying myself (${fmt('en')}/yr)` }[plan];
  return {
    text: { fr: `Admis{|e} en ${m.name.fr} à ${life.edu.school} ! ${payFr}.`.replace('{|e}', life.gender === 'f' ? 'e' : ''), en: `Accepted to study ${m.name.en} at ${life.edu.school}! ${payEn}.` },
    icon: '🎓', tone: 'good', deltas: diff(life, before), mood: 'proud', scene: { place: 'uni' },
  };
}

export function enrollGrad(life: Life, content: Content, programId: string, plan: TuitionPlan): Resolution {
  const g = content.grads.find((x) => x.id === programId)!;
  const before = snapshot(life);
  const rng = rngOf(life);
  life.used['grad_apply'] = (life.used['grad_apply'] ?? 0) + 1;
  const p = clamp(0.3 + (life.stats.smarts - g.smarts) / 35 + (life.edu.grade - 60) / 100, 0.02, 0.95);
  if (!rng.chance(p)) {
    return { text: { fr: `Refusé{|e} en ${g.name.fr}. La sélection est rude.`.replace('{|e}', life.gender === 'f' ? 'e' : ''), en: `Rejected from ${g.name.en}. It's very selective.` }, icon: '📭', tone: 'bad', deltas: [], mood: 'sad' };
  }
  if (life.job && !life.job.partTime) leaveJob(life, content, 'quit');
  life.edu.gradProgram = g.id;
  life.flags.tuition = plan === 'scholarship' ? 0 : tuitionCost(life, content, g.cost);
  life.flags.tuitionPlan = plan;
  enroll(life, content, 'grad', rng);
  return { text: { fr: `Admis{|e} en ${g.name.fr} !`.replace('{|e}', life.gender === 'f' ? 'e' : ''), en: `Accepted into ${g.name.en}!` }, icon: g.icon, tone: 'good', deltas: diff(life, before), mood: 'proud', scene: { place: 'uni' } };
}

export function dropOut(life: Life, content: Content) {
  const e = life.edu;
  if (!e.enrolled) return;
  e.enrolled = false;
  if (e.stage === 'high' || e.stage === 'middle') e.dropout = true;
  life.npcs = life.npcs.filter((n) => n.role !== 'classmate');
  addLine(life, { fr: renderString(`J'ai abandonné mes études (${stageLabel(content, life, e.stage).fr.toLowerCase()}).`, { life, content }, 'fr'), en: `I dropped out of ${stageLabel(content, life, e.stage).en.toLowerCase()}.` }, '🚪', 'bad');
  life.place = 'home';
}
