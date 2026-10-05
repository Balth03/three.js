import type { MajorDef, GradProgramDef, TraitDef, TalentDef, DiseaseDef, Balance } from '@bl/sim';

export const majors: MajorDef[] = [
  { id: 'compsci', icon: '💻', name: { fr: 'Informatique', en: 'Computer Science' }, years: 4, smarts: 62 },
  { id: 'business', icon: '💼', name: { fr: 'Commerce', en: 'Business' }, years: 3, smarts: 45 },
  { id: 'economics', icon: '📈', name: { fr: 'Économie', en: 'Economics' }, years: 3, smarts: 55 },
  { id: 'accounting', icon: '🧮', name: { fr: 'Comptabilité', en: 'Accounting' }, years: 3, smarts: 50 },
  { id: 'engineering', icon: '⚙️', name: { fr: 'Ingénierie', en: 'Engineering' }, years: 5, smarts: 68 },
  { id: 'math', icon: '➗', name: { fr: 'Mathématiques', en: 'Mathematics' }, years: 3, smarts: 70 },
  { id: 'physics', icon: '🪐', name: { fr: 'Physique', en: 'Physics' }, years: 3, smarts: 70 },
  { id: 'biology', icon: '🧬', name: { fr: 'Biologie', en: 'Biology' }, years: 3, smarts: 58 },
  { id: 'chemistry', icon: '⚗️', name: { fr: 'Chimie', en: 'Chemistry' }, years: 3, smarts: 60 },
  { id: 'nursing', icon: '🩺', name: { fr: 'Soins infirmiers', en: 'Nursing' }, years: 3, smarts: 48 },
  { id: 'psychology', icon: '🧠', name: { fr: 'Psychologie', en: 'Psychology' }, years: 4, smarts: 50 },
  { id: 'education', icon: '🍎', name: { fr: "Sciences de l'éducation", en: 'Education' }, years: 3, smarts: 40 },
  { id: 'literature', icon: '📖', name: { fr: 'Lettres', en: 'Literature' }, years: 3, smarts: 45 },
  { id: 'history', icon: '🏛️', name: { fr: 'Histoire', en: 'History' }, years: 3, smarts: 45 },
  { id: 'communication', icon: '🎙️', name: { fr: 'Communication', en: 'Communication' }, years: 3, smarts: 40 },
  { id: 'polisci', icon: '🗳️', name: { fr: 'Sciences politiques', en: 'Political Science' }, years: 3, smarts: 55 },
  { id: 'arts', icon: '🎨', name: { fr: 'Arts plastiques', en: 'Fine Arts' }, years: 3, smarts: 35 },
  { id: 'architecture', icon: '📐', name: { fr: 'Architecture', en: 'Architecture' }, years: 5, smarts: 60 },
  { id: 'philosophy', icon: '🤔', name: { fr: 'Philosophie', en: 'Philosophy' }, years: 3, smarts: 50 },
];

export const grads: GradProgramDef[] = [
  { id: 'medicine', icon: '🩻', name: { fr: 'Faculté de médecine', en: 'Medical school' }, years: 4, majors: ['biology', 'chemistry', 'nursing'], smarts: 72, cost: 2 },
  { id: 'law', icon: '⚖️', name: { fr: "École d'avocats", en: 'Law school' }, years: 3, smarts: 65, cost: 1.6 },
  { id: 'mba', icon: '📊', name: { fr: 'MBA', en: 'MBA' }, years: 2, smarts: 55, cost: 2.5 },
  { id: 'phd', icon: '🔬', name: { fr: 'Doctorat', en: 'PhD' }, years: 4, smarts: 70, cost: 0.3 },
];

export const traits: TraitDef[] = [
  { id: 'extravert', icon: '🎉', name: { fr: 'Extraverti', en: 'Outgoing' }, desc: { fr: 'Adore les gens. Les gens, eux, hésitent.', en: 'Loves people. People are unsure.' }, opposite: 'introvert', drift: { happy: 1 } },
  { id: 'introvert', icon: '📚', name: { fr: 'Introverti', en: 'Introvert' }, desc: { fr: 'Recharge ses batteries seul, sous un plaid.', en: 'Recharges alone, under a blanket.' }, opposite: 'extravert' },
  { id: 'ambitious', icon: '🚀', name: { fr: 'Ambitieux', en: 'Ambitious' }, desc: { fr: 'Veut tout, tout de suite.', en: 'Wants everything, right now.' }, opposite: 'lazy' },
  { id: 'lazy', icon: '🛋️', name: { fr: 'Paresseux', en: 'Lazy' }, desc: { fr: 'Champion olympique de sieste.', en: 'Olympic-level napper.' }, opposite: 'ambitious', drift: { happy: 1 } },
  { id: 'kind', icon: '💗', name: { fr: 'Gentil', en: 'Kind' }, desc: { fr: "S'excuse auprès des meubles.", en: 'Apologizes to furniture.' }, opposite: 'mean' },
  { id: 'mean', icon: '😈', name: { fr: 'Méchant', en: 'Mean' }, desc: { fr: 'Une petite peste, mais avec du style.', en: 'A little menace, with style.' }, opposite: 'kind' },
  { id: 'funny', icon: '🤡', name: { fr: 'Drôle', en: 'Funny' }, desc: { fr: 'Rit de ses propres blagues. Souvent seul.', en: 'Laughs at own jokes. Often alone.' }, drift: { happy: 2 } },
  { id: 'anxious', icon: '😰', name: { fr: 'Anxieux', en: 'Anxious' }, desc: { fr: 'A vérifié trois fois que la porte était fermée.', en: 'Checked the door three times.' }, opposite: 'calm', drift: { happy: -3 } },
  { id: 'calm', icon: '🧘', name: { fr: 'Zen', en: 'Calm' }, desc: { fr: 'Rien ne le perturbe. Même pas les impôts.', en: 'Nothing fazes them. Not even taxes.' }, opposite: 'anxious', drift: { happy: 2 } },
  { id: 'creative', icon: '🎨', name: { fr: 'Créatif', en: 'Creative' }, desc: { fr: 'Voit des formes dans les nuages et les taches de café.', en: 'Sees shapes in clouds and coffee stains.' } },
  { id: 'romantic', icon: '🌹', name: { fr: 'Romantique', en: 'Romantic' }, desc: { fr: 'Tombe amoureux tous les mardis.', en: 'Falls in love every Tuesday.' } },
  { id: 'rebel', icon: '🤘', name: { fr: 'Rebelle', en: 'Rebellious' }, desc: { fr: 'Les règles ? Plutôt des suggestions.', en: 'Rules? More like suggestions.' }, opposite: 'wellbehaved' },
  { id: 'wellbehaved', icon: '😇', name: { fr: 'Sage', en: 'Well-behaved' }, desc: { fr: 'Range sa chambre sans qu\'on le demande. Suspect.', en: 'Cleans their room unasked. Suspicious.' }, opposite: 'rebel' },
  { id: 'sporty', icon: '⚽', name: { fr: 'Sportif', en: 'Sporty' }, desc: { fr: 'Ne marche jamais quand il peut courir.', en: 'Never walks when they could run.' }, opposite: 'couchpotato' },
  { id: 'couchpotato', icon: '🥔', name: { fr: 'Pantouflard', en: 'Couch potato' }, desc: { fr: 'Ne court jamais quand il peut s\'asseoir.', en: 'Never runs when they could sit.' }, opposite: 'sporty' },
  { id: 'nerd', icon: '🤓', name: { fr: 'Geek', en: 'Nerd' }, desc: { fr: 'Connaît le nom de tous les Pokémon. Et de leurs évolutions.', en: 'Knows every Pokémon. And their evolutions.' } },
];

export const talents: TalentDef[] = [
  { id: 'music', icon: '🎵', name: { fr: 'Musique', en: 'Music' } },
  { id: 'art', icon: '🎨', name: { fr: 'Dessin', en: 'Art' } },
  { id: 'sport', icon: '🏅', name: { fr: 'Sport', en: 'Sports' } },
  { id: 'math', icon: '➗', name: { fr: 'Maths', en: 'Math' } },
  { id: 'cooking', icon: '🍳', name: { fr: 'Cuisine', en: 'Cooking' } },
  { id: 'acting', icon: '🎭', name: { fr: 'Comédie', en: 'Acting' } },
  { id: 'writing', icon: '✍️', name: { fr: 'Écriture', en: 'Writing' } },
  { id: 'dance', icon: '💃', name: { fr: 'Danse', en: 'Dance' } },
];

export const diseases: DiseaseDef[] = [
  { id: 'cold', icon: '🤧', name: { fr: 'Rhume', en: 'Common cold' }, health: 3, happy: 3, curable: 0.95, contagious: true },
  { id: 'flu', icon: '🤒', name: { fr: 'Grippe', en: 'Flu' }, health: 7, happy: 5, curable: 0.9, contagious: true },
  { id: 'chickenpox', icon: '🔴', name: { fr: 'Varicelle', en: 'Chickenpox' }, health: 5, happy: 6, curable: 0.95, minAge: 1, maxAge: 12 },
  { id: 'ear_infection', icon: '👂', name: { fr: 'Otite', en: 'Ear infection' }, health: 4, happy: 5, curable: 0.95, maxAge: 10 },
  { id: 'gastro', icon: '🤢', name: { fr: 'Gastro', en: 'Stomach bug' }, health: 5, happy: 6, curable: 0.95 },
  { id: 'strep', icon: '😷', name: { fr: 'Angine', en: 'Strep throat' }, health: 5, happy: 4, curable: 0.95 },
  { id: 'acne', icon: '🌋', name: { fr: 'Acné', en: 'Acne' }, health: 0, happy: 6, curable: 0.7, minAge: 12, maxAge: 24 },
  { id: 'broken_arm', icon: '🦴', name: { fr: 'Bras cassé', en: 'Broken arm' }, health: 8, happy: 6, curable: 0.95 },
  { id: 'sprain', icon: '🦶', name: { fr: 'Entorse', en: 'Sprained ankle' }, health: 4, happy: 3, curable: 0.98 },
  { id: 'migraine', icon: '🤕', name: { fr: 'Migraines', en: 'Migraines' }, health: 3, happy: 6, curable: 0.6, minAge: 12 },
  { id: 'allergies', icon: '🌼', name: { fr: 'Allergies', en: 'Allergies' }, health: 2, happy: 3, curable: 0.5, chronic: true },
  { id: 'asthma', icon: '🫁', name: { fr: 'Asthme', en: 'Asthma' }, health: 4, happy: 2, curable: 0.3, chronic: true },
  { id: 'depression', icon: '🌧️', name: { fr: 'Dépression', en: 'Depression' }, health: 4, happy: 14, curable: 0.55, chronic: true, minAge: 13 },
  { id: 'anxiety', icon: '😰', name: { fr: "Trouble anxieux", en: 'Anxiety disorder' }, health: 2, happy: 9, curable: 0.6, chronic: true, minAge: 12 },
  { id: 'insomnia', icon: '🦉', name: { fr: 'Insomnie', en: 'Insomnia' }, health: 4, happy: 6, curable: 0.65, minAge: 15 },
  { id: 'back_pain', icon: '🧍', name: { fr: 'Mal de dos', en: 'Back pain' }, health: 3, happy: 4, curable: 0.6, minAge: 28 },
  { id: 'hypertension', icon: '🩸', name: { fr: 'Hypertension', en: 'High blood pressure' }, health: 5, happy: 1, curable: 0.4, chronic: true, minAge: 38, deadly: 0.004 },
  { id: 'diabetes', icon: '🍬', name: { fr: 'Diabète', en: 'Diabetes' }, health: 5, happy: 3, curable: 0.15, chronic: true, minAge: 30, deadly: 0.006 },
  { id: 'arthritis', icon: '🦵', name: { fr: 'Arthrose', en: 'Arthritis' }, health: 3, happy: 4, curable: 0.2, chronic: true, minAge: 55 },
  { id: 'heart_disease', icon: '💔', name: { fr: 'Maladie cardiaque', en: 'Heart disease' }, health: 9, happy: 4, curable: 0.35, chronic: true, minAge: 48, deadly: 0.05 },
  { id: 'cancer', icon: '🎗️', name: { fr: 'Cancer', en: 'Cancer' }, health: 14, happy: 10, curable: 0.4, chronic: true, minAge: 35, deadly: 0.12 },
  { id: 'alzheimer', icon: '🧩', name: { fr: "Maladie d'Alzheimer", en: "Alzheimer's" }, health: 6, happy: 6, curable: 0.05, chronic: true, minAge: 72, deadly: 0.06 },
];

export const balance: Balance = {
  mortality: { a: 2.6e-5, b: 0.092, healthK: 0.028, childFloor: 0.0004 },
  livingCost: 11000,
  livingCostHome: 2500,
  minorEvents: [0.08, 0.52, 0.32, 0.08],
  adultEvents: [0.06, 0.44, 0.36, 0.14],
  promoteChance: 0.38,
  fireChance: 0.45,
  raisePerYear: 0.025,
  retireAge: 60,
  pension: 0.55,
};
