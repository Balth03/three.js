// Ghost mode: after death, haunt the living for a few years (pure & deterministic like the rest of the engine).
import type { Content, Life, Loc, Npc, YearReport } from './types.ts';
import { clamp, rngOf } from './util.ts';
import { npcAge, country, formatMoney, toLocal } from './text.ts';
import { yearlyRelations } from './relations.ts';

export const GHOST_YEARS = 10;
export const GHOST_ACTIONS_PER_YEAR = 3;

export type GhostKind = 'scare' | 'whisper' | 'possess' | 'poltergeist' | 'nightmare' | 'bless';
export interface GhostAction { kind: GhostKind; icon: string; label: Loc<string>; rating: 0 | 1 | 2 }
export const GHOST_ACTIONS: GhostAction[] = [
  { kind: 'scare', icon: '👻', label: { fr: 'Faire « BOUH ! »', en: 'Go "BOO!"' }, rating: 0 },
  { kind: 'whisper', icon: '🗣️', label: { fr: 'Chuchoter les numéros du loto', en: 'Whisper lottery numbers' }, rating: 0 },
  { kind: 'bless', icon: '😇', label: { fr: 'Veiller sur lui/elle', en: 'Watch over them' }, rating: 0 },
  { kind: 'poltergeist', icon: '🍽️', label: { fr: 'Casser la vaisselle', en: 'Smash the dishes' }, rating: 0 },
  { kind: 'possess', icon: '🌀', label: { fr: 'Posséder son corps', en: 'Possess their body' }, rating: 1 },
  { kind: 'nightmare', icon: '🩸', label: { fr: 'Cauchemar sanglant', en: 'Bloody nightmare' }, rating: 2 },
];

export function isGhost(life: Life) { return !life.alive && life.flags.ghost !== undefined; }
export function ghostYears(life: Life) { return Number(life.flags.ghost ?? 0); }

export function startGhost(life: Life) {
  if (life.alive || life.flags.ghost !== undefined) return;
  life.flags.ghost = 0;
  ghostLine(life, { fr: 'Je me suis réveillé{|e} en drap blanc, flottant au-dessus de mon propre enterrement. Personne ne pleurait autant que prévu.', en: 'I woke up as a floating bedsheet above my own funeral. Fewer tears than expected.' }, '👻');
}

/** Living people a ghost can haunt. */
export function hauntable(life: Life): Npc[] {
  return life.npcs.filter((n) => n.alive && n.role !== 'pet' && n.role !== 'classmate' && n.role !== 'acquaintance');
}

function ghostLine(life: Life, t: Loc<string>, icon: string, tone: 'good' | 'bad' | 'neutral' = 'neutral') {
  const age = life.age + ghostYears(life);
  let y = life.log[life.log.length - 1];
  if (!y || y.age !== age) { y = { age, year: life.year, lines: [] }; life.log.push(y); }
  const fix = (s: string) => s.replace(/\{\|e\}/g, life.gender === 'f' ? 'e' : '');
  y.lines.push({ t: { fr: fix(t.fr), en: t.en }, icon, tone });
}

export function ghostActionsLeft(life: Life) { return GHOST_ACTIONS_PER_YEAR - (life.used['ghost'] ?? 0); }

export function haunt(life: Life, content: Content, npcId: number, kind: GhostKind): Loc<string> | null {
  const n = life.npcs.find((x) => x.id === npcId && x.alive);
  const def = GHOST_ACTIONS.find((a) => a.kind === kind);
  if (!isGhost(life) || !n || !def || def.rating > life.rating || ghostActionsLeft(life) <= 0) return null;
  life.used['ghost'] = (life.used['ghost'] ?? 0) + 1;
  const rng = rngOf(life);
  const c = country(content, life.country);
  const a = n.first;
  const old = npcAge(n, life.year) > 75;
  let t: Loc<string>;
  let tone: 'good' | 'bad' | 'neutral' = 'neutral';
  switch (kind) {
    case 'scare':
      n.health = clamp(n.health - rng.range(2, 8)); n.rel = clamp(n.rel - 4);
      if (old && rng.chance(0.15)) { n.alive = false; n.deathYear = life.year; t = { fr: `J'ai fait « BOUH ! » à ${a}. Crise cardiaque immédiate. Oups. On se voit de l'autre côté, ${a}.`, en: `I said "BOO!" to ${a}. Instant heart attack. Oops. See you on the other side, ${a}.` }; tone = 'bad'; }
      else t = rng.pick([
        { fr: `J'ai éteint et rallumé la lumière chez ${a} toute la nuit. ${a} a appelé un électricien, puis un prêtre.`, en: `I flicked ${a}'s lights all night. ${a} called an electrician, then a priest.` },
        { fr: `J'ai soufflé dans la nuque de ${a} sous la douche. Le cri s'est entendu jusqu'au cimetière.`, en: `I breathed down ${a}'s neck in the shower. The scream reached the cemetery.` },
      ])!;
      break;
    case 'whisper': {
      if (rng.chance(0.25)) { const win = Math.round(toLocal(rng.range(5000, 200000), c)); n.money += win; n.rel = clamp(n.rel + 15); t = { fr: `J'ai chuchoté les numéros du loto à ${a}. Gagnant : ${formatMoney(win, c, 'fr')} ! ${a} a remercié Dieu. Ingrat.`, en: `I whispered the lottery numbers to ${a}. Won ${formatMoney(win, c, 'en')}! ${a} thanked God. Ungrateful.` }; tone = 'good'; }
      else { n.money = Math.max(0, n.money - Math.round(toLocal(50, c))); t = { fr: `J'ai chuchoté des numéros du loto à ${a}. Je les avais inventés. 50 balles de perdues, fou rire spectral.`, en: `I whispered lottery numbers to ${a}. I made them up. 50 bucks gone, spectral giggles.` }; }
      break;
    }
    case 'bless':
      n.health = clamp(n.health + rng.range(4, 10)); n.rel = clamp(n.rel + 8); life.attrs.karma = clamp(life.attrs.karma + 3); tone = 'good';
      t = { fr: `J'ai veillé sur ${a} toute l'année. ${a} a évité un bus, un divorce et une gastro. Je suis un ange (un peu tard).`, en: `I watched over ${a} all year. ${a} dodged a bus, a divorce and a stomach bug. I'm an angel (a bit late).` };
      break;
    case 'poltergeist':
      n.money = Math.max(0, n.money - Math.round(toLocal(rng.range(100, 2000), c))); n.rel = clamp(n.rel - 6);
      t = rng.pick([
        { fr: `J'ai fait voler toute la vaisselle de ${a}. Le service de mariage de mamie y est passé. Aucun regret.`, en: `I made ${a}'s dishes fly. Grandma's wedding china is gone. No regrets.` },
        { fr: `J'ai écrit « TU ME DOIS 20 € » sur le miroir embué de ${a}. ${a} a payé. Je ne sais pas à qui.`, en: `I wrote "YOU OWE ME $20" on ${a}'s steamy mirror. ${a} paid. No idea who.` },
      ])!;
      break;
    case 'possess':
      n.rel = clamp(n.rel - 10);
      t = rng.pick([
        { fr: `J'ai possédé ${a} pendant un repas de famille : discours de 20 minutes sur les secrets de chacun. Plus personne ne se parle.`, en: `I possessed ${a} at a family dinner: a 20-minute speech about everyone's secrets. Nobody talks anymore.` },
        { fr: `J'ai possédé ${a} au boulot et j'ai envoyé « je démissionne, bande de nazes » à toute la boîte. Ça m'a fait un bien fou.`, en: `I possessed ${a} at work and emailed "I quit, losers" to the whole company. Felt amazing.` },
      ])!;
      if (n.job && rng.chance(0.4)) n.job = undefined;
      break;
    case 'nightmare':
      n.health = clamp(n.health - rng.range(8, 20)); n.rel = clamp(n.rel - 15); tone = 'bad';
      if (rng.chance(0.08)) { n.alive = false; n.deathYear = life.year; t = { fr: `J'ai offert à ${a} un cauchemar avec tronçonneuse et ascenseur plein de sang. ${a} ne s'est jamais réveillé${n.gender === 'f' ? 'e' : ''}. Je me sens… comblé{|e}.`, en: `I gave ${a} a nightmare with a chainsaw and an elevator full of blood. ${a} never woke up. I feel… fulfilled.` }; }
      else t = { fr: `Cauchemar sur mesure pour ${a} : ma tête décomposée dans son frigo, entre le beurre et les yaourts. ${a} dort avec la lumière depuis.`, en: `Bespoke nightmare for ${a}: my rotting head in their fridge, between the butter and the yogurt. ${a} sleeps with the light on now.` };
      break;
  }
  ghostLine(life, t, def.icon, tone);
  return t;
}

/** Advances one ghost year. Returns true when the ghost must move on (time's up or nobody left). */
export function ghostYear(life: Life, content: Content): boolean {
  if (!isGhost(life)) return true;
  life.year++;
  life.flags.ghost = ghostYears(life) + 1;
  life.used = {};
  const rng = rngOf(life);
  const report: YearReport = { age: life.age, year: life.year, lines: [], queued: 0, died: false, deltas: [], milestones: [] };
  // The living keep living (and dying) without me.
  // (log lines are grouped by age: borrow the ghost age while the world updates)
  const real = life.age;
  life.age = real + ghostYears(life);
  try { yearlyRelations(life, content, rng, report); } finally { life.age = real; }
  ghostLine(life, rng.pick([
    { fr: 'Encore une année à traverser les murs et à hanter le frigo.', en: 'Another year of walking through walls and haunting the fridge.' },
    { fr: 'J\'ai essayé de hanter le Wi-Fi. Personne n\'a vu la différence.', en: 'I tried haunting the Wi-Fi. Nobody noticed.' },
    { fr: 'Les autres fantômes du cimetière organisent un bingo. Je triche, ils ne peuvent rien prouver.', en: 'The other cemetery ghosts run a bingo night. I cheat, they can\'t prove it.' },
  ])!, '🕯️');
  const done = ghostYears(life) >= GHOST_YEARS || hauntable(life).length === 0;
  if (done) ascend(life);
  return done;
}

export function ascend(life: Life) {
  if (life.flags.ascended) return;
  life.flags.ascended = 1;
  life.counters.ghostYears = ghostYears(life);
  ghostLine(life, life.attrs.karma >= 50
    ? { fr: 'Une lumière blanche m\'a aspiré{|e}. Au bout du tunnel : un comité d\'accueil et un buffet à volonté.', en: 'A white light pulled me in. At the end of the tunnel: a welcome committee and an all-you-can-eat buffet.' }
    : { fr: 'Le sol s\'est ouvert. Ça sentait le soufre et le barbecue. Un type avec des cornes m\'a dit « on t\'attendait ».', en: 'The floor opened up. Smelled of sulphur and barbecue. A guy with horns said "we\'ve been expecting you".' }, life.attrs.karma >= 50 ? '😇' : '😈');
}
