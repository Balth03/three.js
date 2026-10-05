// Achievements, world events, scenarios and challenges.
import type { AchievementDef, WorldEventDef, ScenarioDef, ChallengeDef, Life } from '@bl/sim';
import { countries } from './countries.ts';
import { countries2 } from './countries2.ts';
import { careers } from './careers.ts';
import { assets } from './economy.ts';

const ALL_C = [...countries, ...countries2];
/** Net worth in base units (≈ USD). */
export function worth(l: Life): number {
  const c = ALL_C.find((x) => x.id === l.country) ?? ALL_C[0];
  const k = c.price * c.currency.rate;
  const assetsV = l.assets.reduce((t, a) => t + a.value - a.loan, 0);
  let port = 0;
  for (const id in l.portfolio) port += l.portfolio[id] * (l.market[id] ?? 0) * k;
  return (l.money + assetsV + port + (l.business?.value ?? 0) - l.edu.loan) / k;
}
const salaryBase = (l: Life) => { const c = ALL_C.find((x) => x.id === l.country) ?? ALL_C[0]; return (l.job?.salary ?? 0) / (c.wage * c.currency.rate); };
const cnt = (l: Life, k: string) => l.counters[k] ?? 0;
const kids = (l: Life) => l.npcs.filter((n) => n.role === 'child').length;
const role = (l: Life, r: string) => l.npcs.filter((n) => n.role === r).length;
const owns = (l: Life, id: string) => l.assets.some((a) => a.def === id);
const ownsKind = (l: Life, k: string) => l.assets.some((a) => assets.find((d) => d.id === a.def)?.kind === k);
const hadJob = (l: Life, id: string, lvl = 0) => (l.job?.careerId === id && l.job.level >= lvl) || l.jobHistory.some((j) => j.careerId === id && j.level >= lvl);
const topLevel = (l: Life) => { const all = [...l.jobHistory.map((j) => ({ id: j.careerId, lv: j.level })), ...(l.job ? [{ id: l.job.careerId, lv: l.job.level }] : [])]; return all.some((j) => { const d = careers.find((c) => c.id === j.id); return d && d.titles.fr.length > 1 && j.lv >= d.titles.fr.length - 1; }); };
const dead = (w: 'year' | 'death') => w === 'death';

type T = (l: Life, w: 'year' | 'death') => boolean;
const A = (id: string, icon: string, fr: string, en: string, dfr: string, den: string, test: T, secret = false): AchievementDef => ({ id, icon, name: { fr, en }, desc: { fr: dfr, en: den }, test, secret });

export const achievements: AchievementDef[] = [
  // ── Life & age
  A('age_1', '🎂', 'Premier tour de piste', 'First lap', 'Fêter son premier anniversaire.', 'Celebrate your first birthday.', (l) => l.age >= 1),
  A('age_18', '🔞', 'Majeur et vacciné', 'Legal adult', 'Atteindre 18 ans.', 'Reach 18.', (l) => l.age >= 18),
  A('age_30', '🎈', 'La trentaine', 'Dirty thirty', 'Atteindre 30 ans.', 'Reach 30.', (l) => l.age >= 30),
  A('age_50', '🧓', 'Demi-siècle', 'Half a century', 'Atteindre 50 ans.', 'Reach 50.', (l) => l.age >= 50),
  A('age_70', '🦯', 'Septuagénaire', 'Septuagenarian', 'Atteindre 70 ans.', 'Reach 70.', (l) => l.age >= 70),
  A('age_80', '👴', 'Vieux de la vieille', 'Old timer', 'Atteindre 80 ans.', 'Reach 80.', (l) => l.age >= 80),
  A('age_90', '🐢', 'Increvable', 'Unkillable', 'Atteindre 90 ans.', 'Reach 90.', (l) => l.age >= 90),
  A('age_100', '💯', 'Centenaire', 'Centenarian', 'Atteindre 100 ans.', 'Reach 100.', (l) => l.age >= 100),
  A('age_110', '🗿', 'Fossile vivant', 'Living fossil', 'Atteindre 110 ans.', 'Reach 110.', (l) => l.age >= 110, true),
  A('die_young', '🥀', 'Vis vite, meurs jeune', 'Live fast, die young', 'Mourir avant 25 ans.', 'Die before 25.', (l, w) => dead(w) && l.age < 25),
  A('die_kid', '👼', 'Trop tôt', 'Too soon', 'Mourir avant 12 ans.', 'Die before 12.', (l, w) => dead(w) && l.age < 12, true),
  A('die_27', '🎸', 'Club des 27', '27 Club', 'Mourir à 27 ans, comme une rock star.', 'Die at 27, like a rock star.', (l, w) => dead(w) && l.age === 27, true),
  A('die_alone', '🕯️', 'Seul au monde', 'Forever alone', 'Mourir sans ami, sans partenaire, sans enfant.', 'Die with no friends, partner or kids.', (l, w) => dead(w) && !l.npcs.some((n) => n.alive && ['friend', 'bestfriend', 'partner', 'spouse', 'fiance', 'child'].includes(n.role))),
  A('die_rich', '⚰️', 'On ne l\'emporte pas', 'Can\'t take it with you', 'Mourir avec plus de 10 M.', 'Die with over 10M.', (l, w) => dead(w) && worth(l) > 10e6),
  A('die_broke', '🪙', 'Fauché jusqu\'à la tombe', 'Broke to the grave', 'Mourir criblé de dettes.', 'Die in debt.', (l, w) => dead(w) && worth(l) < -20000),
  A('die_weird', '🦛', 'Mort absurde', 'Absurd death', 'Mourir d\'une façon ridicule.', 'Die in a ridiculous way.', (l, w) => dead(w) && /requin|hippo|piano|grille-pain|toaster|shark|piano|explos|combust|distributeur|vending|raisin|grape/i.test(l.death?.cause.fr + ' ' + l.death?.cause.en), true),
  A('die_prison', '⛓️', 'Mort derrière les barreaux', 'Died behind bars', 'Mourir en prison.', 'Die in prison.', (l, w) => dead(w) && !!l.flags.diedInPrison, true),
  A('die_od', '💉', 'Fin de soirée', 'Party\'s over', 'Mourir d\'une overdose.', 'Die of an overdose.', (l, w) => dead(w) && /overdose/i.test(l.death?.cause.fr ?? ''), true),
  // ── Education
  A('edu_high', '🎓', 'Bachelier', 'Graduate', 'Obtenir son diplôme de fin d\'études.', 'Graduate high school.', (l) => l.edu.degrees.includes('high')),
  A('edu_uni', '🎓', 'Licencié', 'Bachelor', 'Obtenir un diplôme universitaire.', 'Earn a university degree.', (l) => l.edu.degrees.some((d) => d.startsWith('uni:'))),
  A('edu_two', '📜', 'Collectionneur de diplômes', 'Degree collector', 'Obtenir deux diplômes universitaires.', 'Earn two university degrees.', (l) => l.edu.degrees.filter((d) => d.startsWith('uni:')).length >= 2),
  A('edu_med', '🩺', 'Docteur', 'Doctor', 'Sortir de la faculté de médecine.', 'Graduate medical school.', (l) => l.edu.degrees.includes('grad:medicine')),
  A('edu_law', '⚖️', 'Maître', 'Esquire', 'Sortir de l\'école d\'avocats.', 'Graduate law school.', (l) => l.edu.degrees.includes('grad:law')),
  A('edu_mba', '📊', 'Requin du business', 'Business shark', 'Obtenir un MBA.', 'Earn an MBA.', (l) => l.edu.degrees.includes('grad:mba')),
  A('edu_phd', '🔬', 'Docteur ès trucs', 'Doctor of Things', 'Obtenir un doctorat.', 'Earn a PhD.', (l) => l.edu.degrees.includes('grad:phd')),
  A('edu_brain', '🧠', 'Cerveau galactique', 'Galaxy brain', 'Atteindre 100 en Intelligence.', 'Reach 100 Smarts.', (l) => l.stats.smarts >= 99.5),
  A('edu_dumb', '🥔', 'Pomme de terre', 'Potato', 'Descendre sous 5 en Intelligence.', 'Drop below 5 Smarts.', (l) => l.stats.smarts <= 5, true),
  A('edu_dropout', '🚪', 'Décrocheur', 'Dropout', 'Abandonner l\'école.', 'Drop out of school.', (l) => l.edu.dropout),
  A('edu_expelled', '🦹', 'Viré de l\'école', 'Expelled', 'Se faire renvoyer de l\'école.', 'Get expelled.', (l) => l.flags.expelled !== undefined),
  A('edu_honors', '🏅', 'Major de promo', 'Valedictorian', 'Finir ses études avec A+.', 'Graduate with an A+.', (l) => l.edu.degrees.length > 0 && !l.edu.enrolled && l.edu.grade >= 90),
  A('edu_loan', '💸', 'Esclave du prêt étudiant', 'Student debt slave', 'Avoir un prêt étudiant de plus de 100 k.', 'Owe over 100k in student loans.', (l) => { const c = ALL_C.find((x) => x.id === l.country)!; return l.edu.loan / (c.price * c.currency.rate) > 100000; }),
  // ── Career
  A('job_first', '💼', 'Premier salaire', 'First paycheck', 'Décrocher un premier emploi.', 'Land a first job.', (l) => !!l.job || l.jobHistory.length > 0),
  A('job_promo', '📈', 'Promu', 'Promoted', 'Obtenir une promotion.', 'Get promoted.', (l) => (l.job?.level ?? 0) > 0 || l.jobHistory.some((j) => j.level > 0)),
  A('job_top', '👑', 'Tout en haut', 'Top of the ladder', 'Atteindre le plus haut poste d\'une carrière.', 'Reach the top of a career.', (l) => topLevel(l)),
  A('job_fired', '📦', 'Viré', 'Fired', 'Se faire virer.', 'Get fired.', (l) => l.jobHistory.some((j) => j.end === 'fired')),
  A('job_fired3', '🗑️', 'Inemployable', 'Unemployable', 'Se faire virer trois fois.', 'Get fired three times.', (l) => l.jobHistory.filter((j) => j.end === 'fired').length >= 3),
  A('job_hopper', '🦘', 'Papillon professionnel', 'Job hopper', 'Avoir 6 emplois différents.', 'Have 6 different jobs.', (l) => l.jobHistory.length + (l.job ? 1 : 0) >= 6),
  A('job_retire', '🏖️', 'Retraité', 'Retiree', 'Prendre sa retraite.', 'Retire.', (l) => l.jobHistory.some((j) => j.end === 'retired')),
  A('job_loyal', '🏛️', 'Pilier de la boîte', 'Company man', 'Rester 30 ans dans la même entreprise.', 'Stay 30 years at one company.', (l) => (l.job?.years ?? 0) >= 30 || l.jobHistory.some((j) => j.years >= 30)),
  A('job_doctor', '👩‍⚕️', 'Blouse blanche', 'White coat', 'Devenir médecin.', 'Become a doctor.', (l) => hadJob(l, 'doctor', 1)),
  A('job_lawyer', '⚖️', 'Ténor du barreau', 'Big-shot lawyer', 'Devenir avocat associé.', 'Make partner at a law firm.', (l) => hadJob(l, 'lawyer', 2)),
  A('job_ceo', '🕴️', 'PDG', 'CEO', 'Devenir PDG.', 'Become CEO.', (l) => hadJob(l, 'ceo_track', 3)),
  A('job_star', '🌟', 'Star de cinéma', 'Movie star', 'Devenir une star de cinéma.', 'Become a movie star.', (l) => hadJob(l, 'actor', 4)),
  A('job_cop', '👮', 'Shérif', 'Sheriff', 'Devenir commissaire de police.', 'Become police chief.', (l) => hadJob(l, 'police', 3)),
  A('job_200k', '💰', 'Gros salaire', 'Big salary', 'Gagner plus de 200 k par an.', 'Earn over 200k a year.', (l) => salaryBase(l) > 200000),
  A('job_1m', '🤑', 'Salaire indécent', 'Obscene salary', 'Gagner plus de 1 M par an.', 'Earn over 1M a year.', (l) => salaryBase(l) > 1e6),
  A('job_never', '🛋️', 'Rentier de canapé', 'Couch rentier', 'Mourir après 60 ans sans avoir jamais travaillé.', 'Die after 60 without ever working.', (l, w) => dead(w) && l.age > 60 && !l.jobHistory.length && !l.job),
  A('job_teen', '🍔', 'Petit boulot', 'Teen job', 'Avoir un job avant 18 ans.', 'Have a job before 18.', (l) => !!l.job && l.age < 18),
  // ── Money
  A('m_10k', '💵', 'Premier magot', 'First stash', 'Posséder 10 000.', 'Be worth 10,000.', (l) => worth(l) >= 10000),
  A('m_100k', '💶', 'Bas de laine', 'Nest egg', 'Posséder 100 000.', 'Be worth 100,000.', (l) => worth(l) >= 100000),
  A('m_1m', '💎', 'Millionnaire', 'Millionaire', 'Posséder 1 million.', 'Be worth 1 million.', (l) => worth(l) >= 1e6),
  A('m_10m', '🏦', 'Multimillionnaire', 'Multimillionaire', 'Posséder 10 millions.', 'Be worth 10 million.', (l) => worth(l) >= 10e6),
  A('m_100m', '🛥️', 'Ultra-riche', 'Ultra rich', 'Posséder 100 millions.', 'Be worth 100 million.', (l) => worth(l) >= 100e6),
  A('m_1b', '🤴', 'Milliardaire', 'Billionaire', 'Posséder 1 milliard.', 'Be worth 1 billion.', (l) => worth(l) >= 1e9),
  A('m_debt', '📉', 'Dans le rouge', 'In the red', 'Avoir 50 000 de dettes.', 'Be 50,000 in debt.', (l) => worth(l) <= -50000),
  A('m_bankrupt', '🧾', 'Faillite', 'Bankrupt', 'Faire faillite.', 'Go bankrupt.', (l) => cnt(l, 'bankruptcies') > 0),
  A('m_jackpot', '🎰', 'Jackpot !', 'Jackpot!', 'Gagner le gros lot.', 'Win the jackpot.', (l) => cnt(l, 'jackpot') > 0),
  A('m_house', '🏡', 'Propriétaire', 'Homeowner', 'Acheter une maison.', 'Buy a house.', (l) => ownsKind(l, 'house')),
  A('m_landlord', '🏘️', 'Marchand de sommeil', 'Slumlord', 'Posséder 4 logements.', 'Own 4 properties.', (l) => l.assets.filter((a) => assets.find((d) => d.id === a.def)?.kind === 'house').length >= 4),
  A('m_castle', '🏰', 'Châtelain', 'Lord of the manor', 'Posséder un château.', 'Own a castle.', (l) => owns(l, 'h_castle')),
  A('m_jet', '🛩️', 'Jet-setter', 'Jet setter', 'Posséder un jet privé.', 'Own a private jet.', (l) => owns(l, 'p_jet')),
  A('m_island', '🏝️', 'Robinson de luxe', 'Island owner', 'Posséder une île privée.', 'Own a private island.', (l) => owns(l, 'l_island')),
  A('m_toilet', '🚽', 'Trône d\'or', 'Golden throne', 'Posséder des toilettes en or massif.', 'Own a solid gold toilet.', (l) => owns(l, 'l_toilet')),
  A('m_lambo', '🏎️', 'Lambo !', 'Lambo!', 'Posséder une supercar.', 'Own a supercar.', (l) => owns(l, 'c_lambo')),
  A('m_tank', '🪖', 'Embouteillage ? Quel embouteillage ?', 'Traffic? What traffic?', 'Posséder un char d\'assaut.', 'Own a tank.', (l) => owns(l, 'c_tank'), true),
  A('m_nft', '🐵', 'Investisseur visionnaire', 'Visionary investor', 'Acheter un NFT de singe.', 'Buy a monkey NFT.', (l) => owns(l, 'l_nft')),
  A('m_collector', '🗃️', 'Accumulateur', 'Hoarder', 'Posséder 10 biens.', 'Own 10 assets.', (l) => l.assets.length >= 10),
  A('m_stocks', '📈', 'Trader', 'Trader', 'Investir en Bourse.', 'Invest in stocks.', (l) => Object.keys(l.portfolio).length > 0),
  A('m_crypto', '🪙', 'Crypto-bro', 'Crypto bro', 'Posséder des cryptos.', 'Own crypto.', (l) => ['BTC', 'ETH', 'DOGE', 'MOON'].some((k) => l.portfolio[k])),
  A('m_founder', '🚀', 'Entrepreneur', 'Founder', 'Créer une entreprise.', 'Start a business.', (l) => cnt(l, 'businesses') > 0),
  A('m_unicorn', '🦄', 'Licorne', 'Unicorn', 'Avoir une entreprise valant plus de 1 milliard.', 'Own a business worth over 1 billion.', (l) => { const c = ALL_C.find((x) => x.id === l.country)!; return (l.business?.value ?? 0) / (c.price * c.currency.rate) > 1e9; }),
  A('m_influencer', '🤳', 'Influenceur', 'Influencer', 'Avoir 100 000 abonnés.', 'Have 100,000 followers.', (l) => l.followers >= 100000),
  // ── Love & family
  A('l_first', '💘', 'Premier amour', 'First love', 'Avoir un premier partenaire.', 'Get a first partner.', (l) => l.npcs.some((n) => ['partner', 'fiance', 'spouse', 'ex'].includes(n.role))),
  A('l_engaged', '💍', 'Fiancé', 'Engaged', 'Se fiancer.', 'Get engaged.', (l) => role(l, 'fiance') > 0 || role(l, 'spouse') > 0),
  A('l_married', '💒', 'Marié', 'Married', 'Se marier.', 'Get married.', (l) => role(l, 'spouse') > 0 || cnt(l, 'marriages') > 0),
  A('l_married3', '💔', 'Collectionneur d\'alliances', 'Ring collector', 'Se marier trois fois.', 'Marry three times.', (l) => cnt(l, 'marriages') >= 3),
  A('l_ex5', '🗂️', 'Cimetière amoureux', 'Ex graveyard', 'Avoir 5 ex.', 'Have 5 exes.', (l) => role(l, 'ex') >= 5),
  A('l_cheat', '🐍', 'Infidèle', 'Cheater', 'Tromper son partenaire.', 'Cheat on your partner.', (l) => l.flags.cheating !== undefined),
  A('l_kid', '👶', 'Parent', 'Parent', 'Avoir un enfant.', 'Have a child.', (l) => kids(l) >= 1),
  A('l_kids3', '👨‍👩‍👧‍👦', 'Famille nombreuse', 'Big family', 'Avoir 3 enfants.', 'Have 3 children.', (l) => kids(l) >= 3),
  A('l_kids6', '🏫', 'Équipe de foot', 'Football team', 'Avoir 6 enfants.', 'Have 6 children.', (l) => kids(l) >= 6),
  A('l_kids10', '🐇', 'Lapin', 'Rabbit', 'Avoir 10 enfants.', 'Have 10 children.', (l) => kids(l) >= 10, true),
  A('l_bff', '💛', 'À la vie à la mort', 'Ride or die', 'Avoir un meilleur ami.', 'Have a best friend.', (l) => role(l, 'bestfriend') > 0),
  A('l_friends5', '🎉', 'Populaire', 'Popular', 'Avoir 5 amis en même temps.', 'Have 5 friends at once.', (l) => l.npcs.filter((n) => n.alive && (n.role === 'friend' || n.role === 'bestfriend')).length >= 5),
  A('l_enemy', '😈', 'Némésis', 'Nemesis', 'Se faire un ennemi juré.', 'Make a sworn enemy.', (l) => role(l, 'enemy') > 0),
  A('l_pet', '🐶', 'Maître', 'Pet owner', 'Avoir un animal.', 'Own a pet.', (l) => role(l, 'pet') > 0),
  A('l_zoo', '🦜', 'Ménagerie', 'Menagerie', 'Avoir 4 animaux.', 'Own 4 pets.', (l) => l.npcs.filter((n) => n.alive && n.role === 'pet').length >= 4),
  A('l_orphan', '🥀', 'Orphelin', 'Orphan', 'Perdre ses deux parents.', 'Lose both parents.', (l) => l.npcs.filter((n) => (n.role === 'mother' || n.role === 'father')).every((n) => !n.alive)),
  A('l_disown', '🚪', 'Mouton noir', 'Black sheep', 'Renier un membre de sa famille.', 'Disown a family member.', (l) => cnt(l, 'disowns') > 0),
  // ── Crime
  A('c_first', '🦹', 'Premier délit', 'First offence', 'Commettre un crime.', 'Commit a crime.', (l) => cnt(l, 'crimes') >= 1),
  A('c_10', '🃏', 'Délinquant', 'Delinquent', 'Commettre 10 crimes.', 'Commit 10 crimes.', (l) => cnt(l, 'crimes') >= 10),
  A('c_50', '🎩', 'Criminel de carrière', 'Career criminal', 'Commettre 50 crimes.', 'Commit 50 crimes.', (l) => cnt(l, 'crimes') >= 50),
  A('c_ghost', '👻', 'Insaisissable', 'Untouchable', 'Commettre 20 crimes sans jamais être arrêté.', 'Commit 20 crimes without ever being arrested.', (l) => cnt(l, 'crimes') >= 20 && cnt(l, 'arrests') === 0),
  A('c_arrested', '🚔', 'Menotté', 'Cuffed', 'Se faire arrêter.', 'Get arrested.', (l) => cnt(l, 'arrests') >= 1),
  A('c_acquit', '🧑‍⚖️', 'Non coupable', 'Not guilty', 'Être acquitté.', 'Be acquitted.', (l) => cnt(l, 'acquittals') >= 1),
  A('c_prison', '🔒', 'Taulard', 'Jailbird', 'Aller en prison.', 'Go to prison.', (l) => l.record.some((r) => r.years > 0)),
  A('c_10y', '⛓️', 'Perpétuité (presque)', 'Lifer (almost)', 'Passer 10 ans en prison.', 'Spend 10 years in prison.', (l) => cnt(l, 'prisonYears') >= 10),
  A('c_escape', '🏃', 'La Grande Évasion', 'The Great Escape', 'S\'évader de prison.', 'Escape from prison.', (l) => cnt(l, 'escapes') >= 1),
  A('c_escape3', '🐈‍⬛', 'Houdini', 'Houdini', 'S\'évader trois fois.', 'Escape three times.', (l) => cnt(l, 'escapes') >= 3),
  A('c_fugitive', '🕶️', 'En cavale', 'On the run', 'Devenir un fugitif.', 'Become a fugitive.', (l) => l.flags.fugitive !== undefined),
  A('c_murder', '🔪', 'Meurtrier', 'Murderer', 'Tuer quelqu\'un.', 'Kill someone.', (l) => cnt(l, 'murders') >= 1 || cnt(l, 'crime:murder') >= 1, true),
  A('c_serial', '🩸', 'Tueur en série', 'Serial killer', 'Tuer 5 personnes.', 'Kill 5 people.', (l) => cnt(l, 'murders') + cnt(l, 'crime:murder') + cnt(l, 'crime:hitman') >= 5, true),
  A('c_violent', '🥊', 'Brute', 'Brute', 'Commettre 10 actes violents.', 'Commit 10 violent acts.', (l) => cnt(l, 'violent') + cnt(l, 'assaults') >= 10),
  A('c_bank', '🏦', 'Braqueur', 'Bank robber', 'Braquer une banque avec succès.', 'Rob a bank successfully.', (l) => cnt(l, 'crime:bank') >= 1),
  A('c_mona', '🖼️', 'Lupin', 'Lupin', 'Voler la Joconde.', 'Steal the Mona Lisa.', (l) => cnt(l, 'crime:mona') >= 1),
  A('c_central', '🎭', 'Casa de Papel', 'Money Heist', 'Braquer la Banque centrale.', 'Rob the central bank.', (l) => cnt(l, 'crime:centralbank') >= 1),
  A('c_cult', '🕯️', 'Gourou', 'Guru', 'Fonder une secte.', 'Start a cult.', (l) => cnt(l, 'crime:cult') >= 1),
  A('c_hack', '👨‍💻', 'Hacker', 'Hacker', 'Pirater une entreprise.', 'Hack a company.', (l) => cnt(l, 'crime:hack') >= 1),
  A('c_granny', '👵', 'Ordure', 'Scumbag', 'Arnaquer une mamie.', 'Scam a granny.', (l) => cnt(l, 'crime:prankcall') >= 1, true),
  A('c_kid', '🍬', 'Délinquant juvénile', 'Juvenile delinquent', 'Commettre un crime avant 12 ans.', 'Commit a crime before 12.', (l) => cnt(l, 'crimes') > 0 && l.age < 12),
  A('c_gang', '🐍', 'Membre du gang', 'Gang member', 'Rejoindre un gang en prison.', 'Join a prison gang.', (l) => l.flags.p_ganged !== undefined),
  // ── Health & body
  A('h_sick5', '🤒', 'Nid à microbes', 'Germ magnet', 'Tomber malade 5 fois.', 'Get sick 5 times.', (l) => cnt(l, 'illnesses') >= 5),
  A('h_cancer', '🎗️', 'Survivant', 'Survivor', 'Guérir d\'un cancer.', 'Beat cancer.', (l) => cnt(l, 'cured:cancer') > 0 || cnt(l, 'cured:lung_cancer') > 0),
  A('h_surgery', '💉', 'Refait de partout', 'Fully renovated', 'Passer 3 fois sous le bistouri.', 'Get 3 plastic surgeries.', (l) => cnt(l, 'surgeries') >= 3),
  A('h_addict', '🌀', 'Accro', 'Hooked', 'Développer une grosse addiction.', 'Develop a serious addiction.', (l) => Object.values(l.addictions).some((v) => v >= 60)),
  A('h_clean', '🌱', 'Sobre', 'Clean', 'Faire une cure de désintox.', 'Go to rehab.', (l) => cnt(l, 'rehab') > 0),
  A('h_athlete', '🏅', 'Athlète', 'Athlete', 'Atteindre 95 en forme physique.', 'Reach 95 fitness.', (l) => l.attrs.athletic >= 95),
  A('h_gorgeous', '😍', 'Canon', 'Stunning', 'Atteindre 100 en Apparence.', 'Reach 100 Looks.', (l) => l.stats.looks >= 99.5),
  A('h_ugly', '🧌', 'Gueule de l\'emploi', 'Face for radio', 'Descendre sous 5 en Apparence.', 'Drop below 5 Looks.', (l) => l.stats.looks <= 5, true),
  A('h_fat', '🍔', 'Bien portant', 'Well-fed', 'Atteindre une corpulence maximale.', 'Reach maximum body mass.', (l) => l.app.weight >= 0.9),
  A('h_ironman', '🦾', 'Santé de fer', 'Iron health', 'Avoir 90 en Santé à 80 ans.', 'Have 90 Health at 80.', (l) => l.age >= 80 && l.stats.health >= 90),
  A('h_happy', '😁', 'Béat', 'Blissful', 'Atteindre 100 en Bonheur après 30 ans.', 'Reach 100 Happiness after 30.', (l) => l.age >= 30 && l.stats.happy >= 99.5),
  A('h_depressed', '🌧️', 'Fond du trou', 'Rock bottom', 'Descendre à 0 en Bonheur.', 'Hit 0 Happiness.', (l) => l.stats.happy <= 0.5),
  // ── Fame & karma
  A('f_10k', '📱', 'Micro-influenceur', 'Micro-influencer', 'Avoir 10 000 abonnés.', 'Have 10,000 followers.', (l) => l.followers >= 10000),
  A('f_1m', '📣', 'Méga-influenceur', 'Mega influencer', 'Avoir 1 million d\'abonnés.', 'Have 1 million followers.', (l) => l.followers >= 1e6),
  A('f_10m', '🌍', 'Icône mondiale', 'Global icon', 'Avoir 10 millions d\'abonnés.', 'Have 10 million followers.', (l) => l.followers >= 10e6),
  A('f_famous', '⭐', 'Célèbre', 'Famous', 'Atteindre 50 en célébrité.', 'Reach 50 fame.', (l) => l.attrs.fame >= 50),
  A('f_legend', '🌟', 'Légende', 'Legend', 'Atteindre 100 en célébrité.', 'Reach 100 fame.', (l) => l.attrs.fame >= 99.5),
  A('k_saint', '😇', 'Saint', 'Saint', 'Atteindre 100 en karma.', 'Reach 100 karma.', (l) => l.attrs.karma >= 99.5),
  A('k_devil', '😈', 'Antéchrist', 'Antichrist', 'Tomber à 0 en karma.', 'Fall to 0 karma.', (l) => l.attrs.karma <= 0.5),
  // ── Meta & modes
  A('g_2', '🌳', 'Héritier', 'Heir', 'Jouer la 2e génération.', 'Play the 2nd generation.', (l) => l.generation >= 2),
  A('g_3', '🌲', 'Lignée', 'Bloodline', 'Jouer la 3e génération.', 'Play the 3rd generation.', (l) => l.generation >= 3),
  A('g_5', '🏯', 'Dynastie', 'Dynasty', 'Jouer la 5e génération.', 'Play the 5th generation.', (l) => l.generation >= 5),
  A('g_10', '👑', 'Empire', 'Empire', 'Jouer la 10e génération.', 'Play the 10th generation.', (l) => l.generation >= 10, true),
  A('mode_chaos', '🌪️', 'Agent du chaos', 'Agent of chaos', 'Finir une vie en mode Chaos.', 'Finish a life in Chaos mode.', (l, w) => dead(w) && l.mode === 'chaos'),
  A('mode_hardcore', '💀', 'Hardcore', 'Hardcore', 'Finir une vie en mode Hardcore après 60 ans.', 'Finish a Hardcore life past 60.', (l, w) => dead(w) && l.mode === 'hardcore' && l.age >= 60),
  A('mode_zen_100', '🧘', 'Moine zen', 'Zen monk', 'Atteindre 120 ans en mode Zen.', 'Reach 120 in Zen mode.', (l) => l.mode === 'zen' && l.age >= 120),
  A('scen_any', '🎬', 'Scénariste', 'Screenwriter', 'Jouer un scénario.', 'Play a scenario.', (l) => !!l.scenario && l.age >= 18),
  A('rags', '📈', 'Des haillons à la fortune', 'Rags to riches', 'Naître pauvre et devenir millionnaire.', 'Be born poor and become a millionaire.', (l) => l.wealth === 'poor' && worth(l) >= 1e6),
  A('riches_rags', '📉', 'De la fortune aux haillons', 'Riches to rags', 'Naître riche et finir fauché.', 'Be born rich and end up broke.', (l, w) => dead(w) && l.wealth === 'rich' && worth(l) < 1000),
  A('emigrant', '🧳', 'Globe-trotter', 'Globetrotter', 'Vivre à l\'étranger.', 'Live abroad.', (l) => l.flags.emigrated !== undefined),
  A('world_2008', '📉', 'J\'y étais', 'I was there', 'Vivre la crise de 2008.', 'Live through the 2008 crash.', (l) => l.seen['world:crash2008'] !== undefined),
  A('world_mars', '🚀', 'L\'avenir', 'The future', 'Vivre jusqu\'à la colonisation de Mars.', 'Live to see Mars colonised.', (l) => l.seen['world:mars'] !== undefined),
];

// ───────────────────────────── world events ─────────────────────────────

const W = (id: string, icon: string, fr: string, en: string, o: Partial<WorldEventDef>): WorldEventDef => ({ id, icon, text: { fr, en }, ...o });

export const worldEvents: WorldEventDef[] = [
  W('moon1969', '🌕', "L'homme a marché sur la Lune. Tout le monde regardait la télé, même le chien.", 'Man walked on the Moon. Everyone watched TV, even the dog.', { year: 1969, fx: { happy: 3 } }),
  W('oil1973', '⛽', 'Choc pétrolier : l\'essence coûte un rein. Les gens ressortent leurs vélos.', 'Oil crisis: gas costs a kidney. People dust off their bikes.', { year: 1973, market: 0.8 }),
  W('blackmonday', '📉', 'Lundi noir : la Bourse s\'effondre de 22 % en une journée. Des traders pleurent dans leurs cravates.', 'Black Monday: the stock market crashes 22% in a day. Traders cry into their ties.', { year: 1987, market: 0.75 }),
  W('wall1989', '🧱', 'Le mur de Berlin est tombé. Des inconnus s\'embrassent à la télé.', 'The Berlin Wall fell. Strangers kiss on TV.', { year: 1989, fx: { happy: 2 } }),
  W('worldcup98', '⚽', 'La France est championne du monde ! Le pays entier klaxonne jusqu\'à 4 h du matin.', 'France won the World Cup! The whole country honked until 4am.', { year: 1998, countries: ['fr'], fx: { happy: 8 } }),
  W('y2k', '💾', 'Bug de l\'an 2000 : rien n\'a explosé. Ton oncle a quand même stocké 200 boîtes de conserve.', 'Y2K: nothing exploded. Your uncle still stockpiled 200 cans of food.', { year: 2000 }),
  W('dotcom', '💻', 'La bulle internet éclate. Les start-up de croquettes en ligne disparaissent.', 'The dot-com bubble bursts. Online pet food startups vanish.', { year: 2001, market: 0.7 }),
  W('iphone', '📱', 'Un téléphone sans touches vient de sortir. Tout le monde le veut, personne ne sait pourquoi.', 'A phone with no buttons just came out. Everyone wants one, no one knows why.', { year: 2007 }),
  W('crash2008', '🏚️', 'Crise financière mondiale : les banques ont joué avec ton argent et perdu. Elles se font renflouer, toi non.', 'Global financial crisis: banks gambled your money and lost. They get bailed out, you don\'t.', { year: 2008, market: 0.55, fx: { happy: -3 } }),
  W('worldcup18', '⚽', 'La France est de nouveau championne du monde. Ton voisin a pleuré dans tes bras.', 'France won the World Cup again. Your neighbour cried in your arms.', { year: 2018, countries: ['fr'], fx: { happy: 6 } }),
  W('covid', '😷', 'Pandémie mondiale : confinement, pénurie de papier toilette et apéros en visio.', 'Global pandemic: lockdowns, toilet paper shortages and Zoom drinks.', { year: 2020, market: 0.85, fx: { happy: -6, stress: 10 } }),
  W('ai2023', '🤖', 'Les intelligences artificielles écrivent des poèmes et des dissertations. Les profs sont en PLS.', 'AIs now write poems and essays. Teachers are losing it.', { year: 2023 }),
  W('olymp24', '🏅', 'Jeux Olympiques à Paris. Quelqu\'un a vraiment nagé dans la Seine.', 'Olympics in Paris. Someone actually swam in the Seine.', { year: 2024, countries: ['fr'], fx: { happy: 3 } }),
  W('ai2031', '🦾', 'Les IA remplacent la moitié des employés de bureau. Ton patron parle désormais avec un frigo connecté.', 'AIs replace half of office workers. Your boss now talks with a smart fridge.', { year: 2031, market: 1.2, fx: { stress: 8 } }),
  W('heat2034', '🔥', 'Canicule historique : 52 °C à l\'ombre. Les pigeons cuisent en plein vol.', 'Record heatwave: 52°C in the shade. Pigeons cook mid-flight.', { year: 2034, fx: { health: -3 } }),
  W('mars', '🚀', 'Les premiers humains s\'installent sur Mars. Le premier tweet martien : « Il fait froid et y\'a pas de wifi ».', 'The first humans settle on Mars. First Martian tweet: "It\'s cold and there\'s no wifi".', { year: 2038, fx: { happy: 2 } }),
  W('flycar', '🛸', 'Les voitures volantes sont commercialisées. Les embouteillages aussi, mais en 3D.', 'Flying cars go on sale. So do traffic jams, but in 3D.', { year: 2045 }),
  W('pill2052', '💊', 'Une pilule anti-vieillissement sort. Elle coûte le prix d\'une maison et donne des boutons.', 'An anti-aging pill comes out. It costs a house and gives you pimples.', { year: 2052, fx: { health: 3 } }),
  W('robots2060', '🤖', 'Les robots demandent le droit de vote. Ils l\'obtiennent avant les ados.', 'Robots demand the right to vote. They get it before teenagers.', { year: 2060 }),
  W('aliens2071', '👽', 'Premier contact extraterrestre : ils sont venus, ont goûté nos frites, et sont repartis déçus.', 'First alien contact: they came, tried our fries, and left disappointed.', { year: 2071, fx: { happy: 3 } }),
  // Random recurring events
  W('heatwave', '🌡️', 'Canicule cet été : j\'ai dormi dans ma baignoire remplie de glaçons.', 'Heatwave this summer: I slept in a bathtub full of ice.', { range: [1950, 3000], chance: 0.05, cooldown: 6, fx: { health: -1 } }),
  W('strike', '🪧', 'Grève générale : plus de trains, plus de bus, plus de croissants. Le chaos.', 'General strike: no trains, no buses, no croissants. Chaos.', { range: [1950, 3000], chance: 0.06, cooldown: 5, countries: ['fr', 'be', 'it'], fx: { stress: 4 } }),
  W('boom', '🚀', 'L\'économie est en plein boom. Même ton cousin trouve du travail.', 'The economy is booming. Even your cousin found a job.', { range: [1950, 3000], chance: 0.05, cooldown: 8, market: 1.25 }),
  W('recession', '📉', 'Récession : les licenciements pleuvent et les gens mangent des pâtes au ketchup.', 'Recession: layoffs everywhere, people eat pasta with ketchup.', { range: [1950, 3000], chance: 0.05, cooldown: 8, market: 0.8, fx: { stress: 5 } }),
  W('flu_epidemic', '🦠', 'Grosse épidémie de grippe cet hiver. La moitié du bureau tousse sur l\'autre.', 'Big flu epidemic this winter. Half the office coughs on the other half.', { range: [1950, 3000], chance: 0.06, cooldown: 4, fx: { disease: 'flu' } }),
  W('election', '🗳️', 'Élections : les deux candidats promettent tout et son contraire. Le pire a gagné, comme d\'habitude.', 'Elections: both candidates promised everything and its opposite. The worst one won, as usual.', { range: [1950, 3000], chance: 0.12, cooldown: 4 }),
  W('earthquake', '🌋', 'Un tremblement de terre a fait vibrer la ville. Ma vaisselle n\'a pas survécu.', 'An earthquake shook the city. My dishes did not survive.', { range: [1950, 3000], chance: 0.015, cooldown: 20, countries: ['jp', 'mx', 'it', 'us'], fx: { stress: 8 } }),
  W('zombie', '🧟', 'Rumeurs d\'épidémie zombie dans le pays voisin. Tout le monde achète des pieds-de-biche.', 'Rumours of a zombie outbreak next door. Everyone is buying crowbars.', { range: [2030, 3000], chance: 0.02, cooldown: 30, fx: { stress: 6 } }),
];

// ───────────────────────────── scenarios ─────────────────────────────

export const scenarios: ScenarioDef[] = [
  { id: 'royal', icon: '👑', name: { fr: 'Bébé royal', en: 'Royal baby' }, desc: { fr: 'Né dans un château, couverture de magazines dès la maternité.', en: 'Born in a castle, magazine covers from day one.' }, opts: { wealth: 'rich', money: 0 },
    setup: (l) => { l.flags.royal = 1; l.attrs.fame = 60; for (const n of l.npcs) if (n.role === 'mother' || n.role === 'father') { n.money *= 40; n.job = undefined; } l.place = 'castle'; l.assets.push({ uid: l.nextId++, def: 'h_castle', name: 'Château familial', value: 12000000 * 0.85, loan: 0, bought: l.year, condition: 90, rented: false }); l.flags.home = l.assets[l.assets.length - 1].uid; } },
  { id: 'prodigy', icon: '🧠', name: { fr: 'Enfant prodige', en: 'Child prodigy' }, desc: { fr: 'QI de 200, mais incapable de faire ses lacets.', en: 'IQ of 200, but can\'t tie shoelaces.' }, opts: {},
    setup: (l) => { l.stats.smarts = 100; l.talentKnown = true; l.traits = ['nerd', 'introvert']; } },
  { id: 'lottery', icon: '🎰', name: { fr: 'Famille de gagnants du loto', en: 'Lottery family' }, desc: { fr: 'Tes parents viennent de gagner 20 millions. Ça va mal finir.', en: 'Your parents just won 20 million. This will end badly.' }, opts: { wealth: 'rich' },
    setup: (l) => { for (const n of l.npcs) if (n.role === 'mother' || n.role === 'father') n.money += 20e6 * 0.9; } },
  { id: 'orphan', icon: '🥀', name: { fr: 'Orphelin', en: 'Orphan' }, desc: { fr: 'Pas de parents, pas d\'argent, que de la rage.', en: 'No parents, no money, only rage.' }, opts: { wealth: 'poor' },
    setup: (l) => { for (const n of l.npcs) if (n.role === 'mother' || n.role === 'father') { n.alive = false; n.deathYear = l.year; } } },
  { id: 'mafia', icon: '🕴️', name: { fr: 'Famille mafieuse', en: 'Mafia family' }, desc: { fr: 'Papa « importe des olives ». Il y a des sacs de sport partout.', en: 'Dad "imports olives". There are gym bags everywhere.' }, opts: { wealth: 'rich', rating: 1 },
    setup: (l) => { l.flags.mafia = 1; for (const n of l.npcs) if (n.role === 'father') { n.job = undefined; n.money *= 5; n.flags.mafioso = 1; } } },
  { id: 'celebkid', icon: '📸', name: { fr: 'Enfant de star', en: 'Celebrity kid' }, desc: { fr: 'Ta mère est une star. Les paparazzis étaient à l\'accouchement.', en: 'Your mom is a star. Paparazzi attended your birth.' }, opts: { wealth: 'rich' },
    setup: (l) => { l.attrs.fame = 40; for (const n of l.npcs) if (n.role === 'mother') { n.job = 'actor'; n.money *= 10; } } },
  { id: 'bigpoor', icon: '🏚️', name: { fr: 'Famille nombreuse et fauchée', en: 'Big poor family' }, desc: { fr: 'Six frères et sœurs, une salle de bain.', en: 'Six siblings, one bathroom.' }, opts: { wealth: 'poor' },
    setup: (l, content) => { const mom = l.npcs.find((n) => n.role === 'mother'); for (let i = 0; i < 5; i++) l.npcs.push({ ...l.npcs[0], id: l.nextId++, role: 'sibling', first: content.names[l.country]?.[i % 2 ? 'm' : 'f'][(i * 7) % 20] ?? 'Kid', last: l.last, gender: i % 2 ? 'm' : 'f', birthYear: l.year - 1 - i * 2, rel: 60, flags: {}, alive: true, app: { ...(mom?.app ?? l.app), outfit: i * 37, hairStyle: i % 2 ? 1 : 5 } }); } },
  { id: 'boomer', icon: '📻', name: { fr: 'Né en 1950', en: 'Born in 1950' }, desc: { fr: 'Les Trente Glorieuses, le rock\'n\'roll, et le plomb dans l\'essence.', en: 'The post-war boom, rock and roll, and leaded gasoline.' }, opts: { birthYear: 1950 } },
  { id: 'gen80', icon: '📼', name: { fr: 'Né en 1985', en: 'Born in 1985' }, desc: { fr: 'Cassettes VHS, Tamagotchi et premiers forums.', en: 'VHS tapes, Tamagotchis and early forums.' }, opts: { birthYear: 1985 } },
  { id: 'future', icon: '🛸', name: { fr: 'Né en 2050', en: 'Born in 2050' }, desc: { fr: 'Voitures volantes, robots et canicules permanentes.', en: 'Flying cars, robots and permanent heatwaves.' }, opts: { birthYear: 2050 } },
  { id: 'cursed', icon: '🧿', name: { fr: 'L\'enfant maudit', en: 'The cursed child' }, desc: { fr: 'Une sorcière a maudit ton berceau. Tout ira mal. Tout.', en: 'A witch cursed your crib. Everything will go wrong. Everything.' }, opts: { mode: 'chaos', rating: 2 },
    setup: (l) => { l.stats.looks = 15; l.stats.health = 55; l.flags.cursed = 1; l.attrs.karma = 10; } },
  { id: 'immortal', icon: '♾️', name: { fr: 'L\'immortel', en: 'The immortal' }, desc: { fr: 'Mode Zen : tu ne peux pas mourir. Combien de générations d\'ex vas-tu accumuler ?', en: 'Zen mode: you can\'t die. How many generations of exes will you collect?' }, opts: { mode: 'zen' } },
];

// ───────────────────────────── challenges ─────────────────────────────

export const challenges: ChallengeDef[] = [
  { id: 'mill30', icon: '💰', name: { fr: 'Millionnaire avant 30 ans', en: 'Millionaire before 30' }, desc: { fr: 'Posséder 1 million avant ton 30e anniversaire.', en: 'Be worth 1 million before turning 30.' }, test: (l) => l.age < 30 && worth(l) >= 1e6 },
  { id: 'billion', icon: '🤴', name: { fr: 'Milliardaire', en: 'Billionaire' }, desc: { fr: 'Devenir milliardaire.', en: 'Become a billionaire.' }, test: (l) => worth(l) >= 1e9 },
  { id: 'kids10', icon: '👶', name: { fr: 'Dix gosses', en: 'Ten kids' }, desc: { fr: 'Avoir 10 enfants.', en: 'Have 10 children.' }, test: (l) => kids(l) >= 10 },
  { id: 'centenarian', icon: '💯', name: { fr: 'Centenaire', en: 'Centenarian' }, desc: { fr: 'Vivre jusqu\'à 100 ans.', en: 'Live to 100.' }, test: (l) => l.age >= 100 },
  { id: 'ghost', icon: '👻', name: { fr: 'Le crime parfait', en: 'The perfect crime' }, desc: { fr: 'Commettre 30 crimes sans jamais être arrêté.', en: 'Commit 30 crimes without ever being arrested.' }, test: (l) => cnt(l, 'crimes') >= 30 && cnt(l, 'arrests') === 0 },
  { id: 'rags', icon: '📈', name: { fr: 'Des haillons à la fortune', en: 'Rags to riches' }, desc: { fr: 'Naître pauvre, devenir millionnaire.', en: 'Born poor, become a millionaire.' }, test: (l) => l.wealth === 'poor' && worth(l) >= 1e6 },
  { id: 'houdini', icon: '🐈‍⬛', name: { fr: 'Houdini', en: 'Houdini' }, desc: { fr: 'S\'évader trois fois de prison.', en: 'Escape prison three times.' }, test: (l) => cnt(l, 'escapes') >= 3 },
  { id: 'married5', icon: '💍', name: { fr: 'Liz Taylor', en: 'Liz Taylor' }, desc: { fr: 'Se marier 5 fois.', en: 'Marry 5 times.' }, test: (l) => cnt(l, 'marriages') >= 5 },
  { id: 'docjur', icon: '🎓', name: { fr: 'Médecin et avocat', en: 'Doctor and lawyer' }, desc: { fr: 'Obtenir médecine ET droit.', en: 'Earn both medicine and law degrees.' }, test: (l) => l.edu.degrees.includes('grad:medicine') && l.edu.degrees.includes('grad:law') },
  { id: 'legend', icon: '🌟', name: { fr: 'Légende vivante', en: 'Living legend' }, desc: { fr: 'Atteindre 100 en célébrité.', en: 'Reach 100 fame.' }, test: (l) => l.attrs.fame >= 99.5 },
  { id: 'serial', icon: '🔪', name: { fr: 'Tueur en série', en: 'Serial killer' }, desc: { fr: 'Tuer 10 personnes.', en: 'Kill 10 people.' }, test: (l) => cnt(l, 'murders') + cnt(l, 'crime:murder') + cnt(l, 'crime:hitman') >= 10 },
  { id: 'saint', icon: '😇', name: { fr: 'Mère Teresa', en: 'Mother Teresa' }, desc: { fr: 'Atteindre 100 de karma avant 50 ans.', en: 'Reach 100 karma before 50.' }, test: (l) => l.age < 50 && l.attrs.karma >= 99.5 },
  { id: 'castle', icon: '🏰', name: { fr: 'Le château', en: 'The castle' }, desc: { fr: 'Acheter un château avant 40 ans.', en: 'Buy a castle before 40.' }, test: (l) => l.age < 40 && owns(l, 'h_castle') },
  { id: 'influencer', icon: '📱', name: { fr: 'Influenceur star', en: 'Star influencer' }, desc: { fr: 'Atteindre 10 millions d\'abonnés.', en: 'Reach 10 million followers.' }, test: (l) => l.followers >= 10e6 },
];
