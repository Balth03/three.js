import type { DiseaseDef } from '@bl/sim';

export const diseases2: DiseaseDef[] = [
  // ── referenced elsewhere ──
  { id: 'liver_disease', icon: '🍺', name: { fr: 'Cirrhose du foie', en: 'Liver disease' }, health: 9, happy: 5, curable: 0.2, chronic: true, minAge: 30, deadly: 0.03 },
  { id: 'lung_cancer', icon: '🫁', name: { fr: 'Cancer du poumon', en: 'Lung cancer' }, health: 15, happy: 10, curable: 0.25, chronic: true, minAge: 35, deadly: 0.1 },
  { id: 'std', icon: '🍆', name: { fr: 'IST', en: 'STD' }, health: 3, happy: 7, curable: 0.85, minAge: 14 },
  { id: 'hemorrhoids', icon: '🍑', name: { fr: 'Hémorroïdes', en: 'Hemorrhoids' }, health: 2, happy: 6, curable: 0.85, minAge: 20 },
  { id: 'food_poisoning', icon: '🦐', name: { fr: 'Intoxication alimentaire', en: 'Food poisoning' }, health: 6, happy: 6, curable: 0.97 },
  { id: 'concussion', icon: '💫', name: { fr: 'Commotion cérébrale', en: 'Concussion' }, health: 7, happy: 4, curable: 0.9 },
  { id: 'burns', icon: '🔥', name: { fr: 'Brûlures', en: 'Burns' }, health: 8, happy: 6, curable: 0.85 },
  { id: 'missing_finger', icon: '🖐️', name: { fr: 'Doigt amputé', en: 'Missing finger' }, health: 1, happy: 4, curable: 0, chronic: true },
  { id: 'ptsd', icon: '🎖️', name: { fr: 'Stress post-traumatique', en: 'PTSD' }, health: 3, happy: 12, curable: 0.45, chronic: true, minAge: 16 },
  { id: 'gout', icon: '🦶', name: { fr: 'Goutte', en: 'Gout' }, health: 4, happy: 5, curable: 0.5, minAge: 35 },
  { id: 'obesity', icon: '🍔', name: { fr: 'Obésité', en: 'Obesity' }, health: 6, happy: 6, curable: 0.35, chronic: true, minAge: 6 },
  { id: 'pneumonia', icon: '😮‍💨', name: { fr: 'Pneumonie', en: 'Pneumonia' }, health: 10, happy: 5, curable: 0.88, deadly: 0.02, contagious: true },

  // ── childhood ──
  { id: 'measles', icon: '🔴', name: { fr: 'Rougeole', en: 'Measles' }, health: 7, happy: 6, curable: 0.92, contagious: true, minAge: 1, maxAge: 14, deadly: 0.002 },
  { id: 'lice', icon: '🐜', name: { fr: 'Poux', en: 'Head lice' }, health: 0, happy: 5, curable: 0.98, contagious: true, minAge: 3, maxAge: 13 },
  { id: 'tonsillitis', icon: '👅', name: { fr: 'Amygdalite', en: 'Tonsillitis' }, health: 4, happy: 4, curable: 0.95, contagious: true, maxAge: 25 },

  // ── acute ──
  { id: 'appendicitis', icon: '🔪', name: { fr: 'Appendicite', en: 'Appendicitis' }, health: 10, happy: 6, curable: 0.97, deadly: 0.01, minAge: 5 },
  { id: 'kidney_stones', icon: '🪨', name: { fr: 'Calculs rénaux', en: 'Kidney stones' }, health: 5, happy: 9, curable: 0.9, minAge: 20 },
  { id: 'scurvy', icon: '🏴‍☠️', name: { fr: 'Scorbut', en: 'Scurvy' }, health: 6, happy: 4, curable: 0.98 },
  { id: 'sunburn', icon: '🌞', name: { fr: 'Coup de soleil', en: 'Sunburn' }, health: 2, happy: 4, curable: 0.99 },
  { id: 'rabies', icon: '🦇', name: { fr: 'Rage', en: 'Rabies' }, health: 16, happy: 10, curable: 0.6, deadly: 0.2 },
  { id: 'tapeworm', icon: '🪱', name: { fr: 'Ver solitaire', en: 'Tapeworm' }, health: 4, happy: 7, curable: 0.95 },

  // ── infectious ──
  { id: 'bird_flu', icon: '🐔', name: { fr: 'Grippe aviaire', en: 'Bird flu' }, health: 11, happy: 6, curable: 0.8, contagious: true, deadly: 0.03 },
  { id: 'malaria', icon: '🦟', name: { fr: 'Paludisme', en: 'Malaria' }, health: 11, happy: 7, curable: 0.85, deadly: 0.02 },
  { id: 'tuberculosis', icon: '🩻', name: { fr: 'Tuberculose', en: 'Tuberculosis' }, health: 12, happy: 7, curable: 0.75, contagious: true, deadly: 0.03 },

  // ── aging ──
  { id: 'glaucoma', icon: '👁️', name: { fr: 'Glaucome', en: 'Glaucoma' }, health: 2, happy: 4, curable: 0.3, chronic: true, minAge: 45 },
  { id: 'cataracts', icon: '🌫️', name: { fr: 'Cataracte', en: 'Cataracts' }, health: 2, happy: 4, curable: 0.9, minAge: 60 },
  { id: 'osteoporosis', icon: '🦴', name: { fr: 'Ostéoporose', en: 'Osteoporosis' }, health: 4, happy: 3, curable: 0.2, chronic: true, minAge: 60 },
  { id: 'parkinson', icon: '🫨', name: { fr: 'Maladie de Parkinson', en: "Parkinson's" }, health: 7, happy: 7, curable: 0.05, chronic: true, minAge: 60, deadly: 0.02 },
  { id: 'stroke_aftermath', icon: '🧠', name: { fr: "Séquelles d'AVC", en: 'Stroke aftermath' }, health: 10, happy: 8, curable: 0.25, chronic: true, minAge: 45, deadly: 0.03 },
  { id: 'bunions', icon: '👣', name: { fr: 'Oignons aux pieds', en: 'Bunions' }, health: 1, happy: 3, curable: 0.8, minAge: 30 },

  // ── mental health ──
  { id: 'bipolar', icon: '🎭', name: { fr: 'Trouble bipolaire', en: 'Bipolar disorder' }, health: 3, happy: 12, curable: 0.35, chronic: true, minAge: 16 },
  { id: 'ocd', icon: '🧼', name: { fr: 'TOC', en: 'OCD' }, health: 1, happy: 7, curable: 0.45, chronic: true, minAge: 10 },
  { id: 'eating_disorder', icon: '🍽️', name: { fr: 'Trouble alimentaire', en: 'Eating disorder' }, health: 8, happy: 10, curable: 0.5, chronic: true, minAge: 12, deadly: 0.005 },
];
