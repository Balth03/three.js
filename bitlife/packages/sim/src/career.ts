// Careers: job offers, applications, yearly performance, promotions, firing, retirement, taxes.
import { Rng, hash01 } from './rng.ts';
import type { CareerDef, Content, Life, Loc, Resolution, YearReport } from './types.ts';
import { addLine, clamp, L, rngOf } from './util.ts';
import { careerTitle, country, renderString, wageLocal } from './text.ts';
import { hasDegree } from './cond.ts';
import { makeNpc } from './people.ts';
import { snapshot, diff } from './snapshot.ts';

export interface JobOffer { careerId: string; employer: string; salary: number; qualified: boolean; reason?: Loc<string>; applied: boolean }

export function levelSalary(life: Life, content: Content, def: CareerDef, level: number, jitter = 1): number {
  const c = country(content, life.country);
  const n = def.titles.fr.length;
  const t = n <= 1 ? 0 : level / (n - 1);
  const base = def.salary[0] * Math.pow(def.salary[1] / def.salary[0], t);
  return Math.round(wageLocal(base * jitter, c));
}

export function employerFor(life: Life, content: Content, def: CareerDef, rng: Rng | (() => number)): string {
  const r = typeof rng === 'function' ? rng : () => rng.next();
  const c = country(content, life.country);
  if (def.place === 'hospital') return c.hospital.replace('{city}', life.city);
  if (def.place === 'school') return c.schoolFmt.primary.replace('{name}', c.schoolNames[Math.floor(r() * c.schoolNames.length)]);
  return c.companies[Math.floor(r() * c.companies.length)];
}

export function qualification(life: Life, content: Content, def: CareerDef): Loc<string> | undefined {
  if (life.prison) return L('Tu es en prison.', "You're in prison.");
  if (life.age < def.minAge) return L(`Il faut avoir ${def.minAge} ans.`, `You must be ${def.minAge}.`);
  if (!def.partTime) {
    if (life.age < 18) return L('Réservé aux adultes.', 'Adults only.');
    if (life.edu.enrolled && (life.edu.stage === 'high' || life.edu.stage === 'middle' || life.edu.stage === 'primary'))
      return L("Tu es encore à l'école.", "You're still in school.");
    if (life.edu.enrolled) return L('Temps plein incompatible avec tes études.', 'Full-time is incompatible with your studies.');
  } else if (life.age < 14) return L('Trop jeune.', 'Too young.');
  const r = def.req;
  if (r?.edu === 'high' && !hasDegree(life, 'high')) return L('Bac requis.', 'High school diploma required.');
  if (r?.edu === 'uni') {
    if (!hasDegree(life, 'uni')) return L('Diplôme universitaire requis.', 'University degree required.');
    if (r.majors && !r.majors.some((m) => life.edu.degrees.includes(`uni:${m}`)))
      return L('Spécialité requise : ' + r.majors.map((m) => content.majors.find((x) => x.id === m)?.name.fr ?? m).join(', '),
        'Required major: ' + r.majors.map((m) => content.majors.find((x) => x.id === m)?.name.en ?? m).join(', '));
  }
  if (r?.edu === 'grad') {
    if (r.program && !life.edu.degrees.includes(`grad:${r.program}`)) {
      const p = content.grads.find((g) => g.id === r.program);
      return L(`Diplôme requis : ${p?.name.fr ?? r.program}`, `Required degree: ${p?.name.en ?? r.program}`);
    }
    if (!r.program && !hasDegree(life, 'grad')) return L('Études supérieures requises.', 'Graduate degree required.');
  }
  if (life.flags.record && (def.cat === 'law' || def.cat === 'public' || def.cat === 'edu')) return L('Ton casier judiciaire te ferme cette porte.', 'Your criminal record closes this door.');
  return undefined;
}

/** Yearly job board: stable within a year (does not consume the life RNG). */
export function listJobs(life: Life, content: Content): JobOffer[] {
  let k = 0;
  const r = () => hash01(life.seed * 31 + life.age * 1009 + k++ * 7919);
  const pool = content.careers.filter((c) => !c.special && (c.rating ?? 0) <= life.rating && (c.partTime ? life.age >= 14 : life.age >= 17));
  const offers: JobOffer[] = [];
  for (const def of pool) {
    const show = def.partTime ? life.age < 23 || r() < 0.5 : r() < 0.62;
    if (!show) continue;
    const reason = qualification(life, content, def);
    offers.push({
      careerId: def.id,
      employer: employerFor(life, content, def, r),
      salary: levelSalary(life, content, def, 0, 0.92 + r() * 0.16),
      qualified: !reason,
      reason,
      applied: !!life.used[`apply:${def.id}`],
    });
  }
  offers.sort((a, b) => Number(b.qualified) - Number(a.qualified) || (content.careers.find((c) => c.id === a.careerId)!.partTime ? 1 : 0) - (content.careers.find((c) => c.id === b.careerId)!.partTime ? 1 : 0) || b.salary - a.salary);
  return offers;
}

export function applyJob(life: Life, content: Content, offer: JobOffer): Resolution {
  const def = content.careers.find((c) => c.id === offer.careerId)!;
  const before = snapshot(life);
  const rng = rngOf(life);
  life.used[`apply:${def.id}`] = 1;
  const title = (lang: 'fr' | 'en') => careerTitle(content, def.id, 0, life.gender, lang);
  const reason = qualification(life, content, def);
  if (reason) {
    return { text: { fr: `Candidature refusée. ${reason.fr}`, en: `Application rejected. ${reason.en}` }, icon: '📭', tone: 'bad', deltas: [] };
  }
  if (life.job && !life.job.partTime && def.partTime) {
    return { text: L("J'ai déjà un emploi à temps plein.", 'I already have a full-time job.'), icon: '💼', tone: 'neutral', deltas: [] };
  }
  const req = def.req ?? {};
  let p = 0.58 + (life.stats.smarts - 50) / 160 + (life.stats.looks - 50) / 260 + (life.attrs.discipline - 50) / 400;
  if (req.smarts && life.stats.smarts < req.smarts) p *= 0.3;
  if (req.looks && life.stats.looks < req.looks) p *= 0.3;
  if (req.athletic && life.attrs.athletic < req.athletic) p *= 0.3;
  if (life.flags.record) p *= 0.6;
  if (def.partTime) p += 0.15;
  p = clamp(p, 0.06, 0.94);
  if (!rng.chance(p)) {
    const t = rng.pick([
      L("L'entretien pour le poste de {post} chez {company} s'est mal passé. Ils ne m'ont jamais rappelé{|e}.", 'The interview for the {post} position at {company} went badly. They never called back.'),
      L("J'ai bafouillé pendant tout l'entretien chez {company}. Refusé{|e}.", 'I stammered through the whole interview at {company}. Rejected.'),
      L("{company} a choisi un autre candidat pour le poste de {post}.", '{company} went with another candidate for the {post} position.'),
      L("Le recruteur de {company} m'a demandé où je me voyais dans cinq ans. J'ai répondu « à ta place ». Refusé{|e}.", 'The recruiter at {company} asked where I saw myself in five years. I said "in your chair". Rejected.'),
    ]);
    const mk = (lang: 'fr' | 'en') => renderString(t[lang], { life, content, vars: { post: title(lang), company: offer.employer } }, lang);
    return {
      text: { fr: mk('fr'), en: mk('en') },
      icon: '📭', tone: 'bad', deltas: diff(life, before), mood: 'sad',
    };
  }
  hire(life, content, def, offer.employer, offer.salary, rng);
  const ctxFr = { life, content, vars: {} };
  addLine(life, { fr: renderString(`J'ai été embauché{|e} comme ${title('fr')} chez ${offer.employer}.`, ctxFr, 'fr'), en: `I was hired as a ${title('en')} at ${offer.employer}.` }, def.icon, 'good');
  life.stats.happy = clamp(life.stats.happy + 6);
  return {
    text: { fr: renderString(`Embauché{|e} ! Je suis désormais ${title('fr')} chez ${offer.employer}.`, ctxFr, 'fr'), en: `Hired! I'm now a ${title('en')} at ${offer.employer}.` },
    icon: def.icon, tone: 'good', deltas: diff(life, before), mood: 'proud', scene: { place: def.place },
  };
}

export function hire(life: Life, content: Content, def: CareerDef, employer: string, salary: number, rng: Rng) {
  if (life.job) leaveJob(life, content, 'quit', true);
  life.job = { careerId: def.id, level: 0, salary, perf: 55, years: 0, yearsAtLevel: 0, employer, partTime: !!def.partTime };
  // Coworkers & boss
  life.npcs = life.npcs.filter((n) => !(n.role === 'coworker' || n.role === 'boss'));
  const peerAge: [number, number] = [Math.max(16, life.age - 8), life.age + 15];
  for (let i = 0; i < 2; i++) life.npcs.push(makeNpc(life, content, rng, { role: 'coworker', age: rng.int(peerAge[0], peerAge[1]), rel: rng.int(35, 60) }));
  life.npcs.push(makeNpc(life, content, rng, { role: 'boss', age: rng.int(Math.max(28, life.age + 5), Math.max(40, life.age + 25)), rel: rng.int(35, 55) }));
  life.place = def.place;
}

export function leaveJob(life: Life, content: Content, end: 'quit' | 'fired' | 'retired', silent = false) {
  const j = life.job;
  if (!j) return;
  life.jobHistory.push({ careerId: j.careerId, level: j.level, years: j.years, employer: j.employer, end });
  if (end === 'retired') life.flags.pension = Math.round(j.salary * content.balance.pension);
  life.job = null;
  life.npcs = life.npcs.filter((n) => !(n.role === 'coworker' || n.role === 'boss') || n.flags.kept);
  if (!silent) {
    const t = (lang: 'fr' | 'en') => careerTitle(content, j.careerId, j.level, life.gender, lang);
    const ctx = { life, content };
    if (end === 'quit') addLine(life, { fr: renderString(`J'ai démissionné de mon poste de ${t('fr')} chez ${j.employer}.`, ctx, 'fr'), en: `I quit my job as a ${t('en')} at ${j.employer}.` }, '🚪', 'neutral');
    if (end === 'fired') addLine(life, { fr: renderString(`J'ai été viré{|e} de ${j.employer}.`, ctx, 'fr'), en: `I was fired from ${j.employer}.` }, '📦', 'bad');
    if (end === 'retired') addLine(life, { fr: renderString(`J'ai pris ma retraite après ${j.years} ans chez ${j.employer}.`, ctx, 'fr'), en: `I retired after ${j.years} years at ${j.employer}.` }, '🏖️', 'good');
  }
  life.place = 'home';
}

export function promote(life: Life, content: Content): boolean {
  const j = life.job;
  if (!j) return false;
  const def = content.careers.find((c) => c.id === j.careerId)!;
  if (j.level >= def.titles.fr.length - 1) return false;
  j.level++;
  j.yearsAtLevel = 0;
  j.perf = clamp(j.perf - 15);
  j.salary = Math.max(Math.round(j.salary * 1.08), levelSalary(life, content, def, j.level));
  const ctx = { life, content };
  addLine(life, {
    fr: renderString(`J'ai été promu{|e} ${careerTitle(content, j.careerId, j.level, life.gender, 'fr')} !`, ctx, 'fr'),
    en: `I was promoted to ${careerTitle(content, j.careerId, j.level, life.gender, 'en')}!`,
  }, '📈', 'good');
  life.stats.happy = clamp(life.stats.happy + 8);
  return true;
}

/** Progressive income tax, brackets expressed in base units. */
export function taxOf(life: Life, content: Content, grossLocal: number): number {
  const c = country(content, life.country);
  const k = c.wage * c.currency.rate;
  const inc = grossLocal / k;
  let tax = 0;
  for (let i = 0; i < c.tax.length; i++) {
    const [th, rate] = c.tax[i];
    const next = c.tax[i + 1]?.[0] ?? Infinity;
    if (inc > th) tax += (Math.min(inc, next) - th) * rate;
  }
  return tax * k;
}

export function yearlyJob(life: Life, content: Content, rng: Rng, report: YearReport) {
  const b = content.balance;
  const j = life.job;
  if (life.flags.pension && !j) {
    const p = Number(life.flags.pension);
    life.money += p - taxOf(life, content, p) * 0.6;
  }
  if (!j) return;
  j.years++;
  j.yearsAtLevel++;
  j.perf = clamp(j.perf + (50 - j.perf) * 0.12 + rng.range(-7, 6) + (life.attrs.discipline - 50) / 20 + (life.stats.happy - 50) / 30);
  if (j.perf > 35) j.salary = Math.round(j.salary * (1 + b.raisePerYear * rng.range(0.5, 1.5)));
  const net = j.salary - taxOf(life, content, j.salary);
  life.money += net;
  // Student loan repayment
  if (life.edu.loan > 0 && !life.edu.enrolled) {
    const pay = Math.min(life.edu.loan, net * 0.12);
    life.edu.loan -= pay;
    life.money -= pay;
    if (life.edu.loan <= 1) {
      life.edu.loan = 0;
      addLine(life, L("J'ai fini de rembourser mon prêt étudiant !", 'I finally paid off my student loan!'), '🎓', 'good');
    }
  }
  if (j.perf >= 68 && j.yearsAtLevel >= 2 && rng.chance(b.promoteChance + (j.perf - 68) / 80)) {
    if (promote(life, content)) report.milestones.push('promotion');
  } else if (j.perf < 18 && rng.chance(b.fireChance)) {
    leaveJob(life, content, 'fired');
    life.stats.happy = clamp(life.stats.happy - 12);
    report.milestones.push('fired');
  }
}
