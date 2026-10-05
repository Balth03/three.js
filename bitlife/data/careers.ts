import type { CareerDef } from '@bl/sim';

// Salaries are base units per year (≈ USD at US wage level), converted per country at runtime.
const c = (id: string, cat: string, icon: string, fr: string[], en: string[], salary: [number, number], o: Partial<CareerDef> = {}): CareerDef => ({
  id, cat, icon, titles: { fr, en }, salary, minAge: 18, place: 'office', outfit: '#4b6cb7', ...o,
});

export const careers: CareerDef[] = [
  // ── Part-time / student jobs
  c('babysitter', 'service', '🍼', ['Baby-sitter'], ['Babysitter'], [4000, 4000], { partTime: true, minAge: 14, place: 'home', outfit: '#f6a6c1' }),
  c('dogwalker', 'service', '🐕', ['Promen{eur|euse} de chiens'], ['Dog walker'], [4500, 4500], { partTime: true, minAge: 14, place: 'park', outfit: '#7cc47a' }),
  c('fastfood', 'service', '🍔', ['Équipi{er|ère} fast-food', "Chef{|fe} d'équipe"], ['Fast food crew member', 'Shift leader'], [9000, 12000], { partTime: true, minAge: 16, place: 'office', outfit: '#e63946' }),
  c('cashier', 'service', '🛒', ['Caissi{er|ère}'], ['Cashier'], [9500, 9500], { partTime: true, minAge: 16, place: 'office', outfit: '#2a9d8f' }),
  c('waiter', 'service', '🍽️', ['Serv{eur|euse}'], ['Waiter'], [9000, 9000], { partTime: true, minAge: 16, place: 'office', outfit: '#222' }),
  c('delivery', 'service', '🚲', ['Livr{eur|euse} à vélo'], ['Bike courier'], [8000, 8000], { partTime: true, minAge: 16, place: 'park', outfit: '#00b4a0' }),
  c('tutor', 'edu', '✏️', ['Prof particuli{er|ère}'], ['Private tutor'], [7000, 7000], { partTime: true, minAge: 16, place: 'home', outfit: '#6c8ebf', req: { smarts: 65 } }),
  c('lifeguard', 'service', '🛟', ['Maître-nag{eur|euse}'], ['Lifeguard'], [8000, 8000], { partTime: true, minAge: 16, place: 'park', outfit: '#ef476f', req: { athletic: 55 } }),
  // ── No diploma
  c('cleaner', 'service', '🧹', ["Agent{|e} d'entretien", "Chef{|fe} d'équipe propreté", 'Responsable propreté'], ['Janitor', 'Cleaning supervisor', 'Facilities manager'], [24000, 38000], { outfit: '#5a7d9a' }),
  c('retail', 'service', '🛍️', ['Vend{eur|euse}', 'Vend{eur|euse} senior', 'Responsable de rayon', 'Direct{eur|rice} de magasin'], ['Sales associate', 'Senior sales associate', 'Department manager', 'Store manager'], [25000, 72000], { outfit: '#f4a261' }),
  c('cook', 'service', '👨‍🍳', ['Commis de cuisine', 'Cuisini{er|ère}', 'Sous-chef', 'Chef{|fe} de cuisine'], ['Kitchen porter', 'Line cook', 'Sous chef', 'Head chef'], [24000, 90000], { outfit: '#ffffff' }),
  c('driver', 'trade', '🚌', ['Chauff{eur|euse} VTC', 'Chauff{eur|euse} de bus', 'Chauff{eur|euse} poids lourd'], ['Rideshare driver', 'Bus driver', 'Truck driver'], [28000, 52000], { outfit: '#264653' }),
  c('construction', 'trade', '🏗️', ['Manœuvre', 'Ouvri{er|ère} du bâtiment', 'Chef{|fe} de chantier', 'Conduct{eur|rice} de travaux'], ['Laborer', 'Construction worker', 'Site foreman', 'Construction manager'], [28000, 85000], { outfit: '#f9c74f' }),
  c('hairdresser', 'service', '💇', ['Apprenti{|e} coiff{eur|euse}', 'Coiff{eur|euse}', 'Gérant{|e} de salon'], ['Apprentice hairdresser', 'Hairdresser', 'Salon manager'], [21000, 58000], { outfit: '#c77dff' }),
  c('farmer', 'trade', '🚜', ['Ouvri{er|ère} agricole', 'Agricult{eur|rice}', 'Exploitant{|e} agricole'], ['Farmhand', 'Farmer', 'Farm owner'], [24000, 75000], { place: 'park', outfit: '#6a994e' }),
  c('soldier', 'public', '🪖', ['Soldat', 'Caporal{|e}', 'Sergent{|e}', 'Lieutenant{|e}', 'Capitaine'], ['Private', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain'], [30000, 95000], { outfit: '#606c38', req: { athletic: 45 } }),
  c('actor', 'art', '🎬', ['Figurant{|e}', 'Act{eur|rice} de pub', 'Second rôle', 'Act{eur|rice} principal{|e}', 'Star de cinéma'], ['Extra', 'Commercial actor', 'Supporting actor', 'Lead actor', 'Movie star'], [15000, 2500000], { outfit: '#9d0208', req: { looks: 70 } }),
  // ── High school diploma
  c('plumber', 'trade', '🔧', ['Apprenti{|e} plombier', 'Plombi{er|ère}', 'Artisan plombier'], ['Apprentice plumber', 'Plumber', 'Master plumber'], [30000, 80000], { req: { edu: 'high' }, outfit: '#1d3557' }),
  c('electrician', 'trade', '⚡', ['Apprenti{|e} électricien{|ne}', 'Électricien{|ne}', 'Maître électricien{|ne}'], ['Apprentice electrician', 'Electrician', 'Master electrician'], [31000, 84000], { req: { edu: 'high' }, outfit: '#ffb703' }),
  c('mechanic', 'trade', '🔩', ['Apprenti{|e} mécanicien{|ne}', 'Mécanicien{|ne}', "Chef{|fe} d'atelier"], ['Apprentice mechanic', 'Mechanic', 'Shop foreman'], [29000, 68000], { req: { edu: 'high' }, outfit: '#3a5a40' }),
  c('admin', 'office', '🗂️', ['Assistant{|e} administrati{f|ve}', 'Assistant{|e} de direction', 'Office manager'], ['Administrative assistant', 'Executive assistant', 'Office manager'], [32000, 62000], { req: { edu: 'high' }, outfit: '#577590' }),
  c('police', 'public', '👮', ['Gardien{|ne} de la paix', 'Brigadi{er|ère}', 'Lieutenant{|e} de police', 'Commissaire'], ['Police officer', 'Sergeant', 'Lieutenant', 'Police chief'], [42000, 115000], { req: { edu: 'high', athletic: 50 }, outfit: '#1d3557' }),
  c('firefighter', 'public', '🚒', ['Sapeur-pompier', 'Caporal{|e}', 'Sergent{|e}', 'Capitaine des pompiers'], ['Firefighter', 'Corporal', 'Sergeant', 'Fire captain'], [40000, 98000], { req: { edu: 'high', athletic: 55 }, outfit: '#d62828' }),
  c('flight', 'service', '✈️', ["{Steward|Hôtesse de l'air}", 'Chef{|fe} de cabine'], ['Flight attendant', 'Purser'], [33000, 65000], { req: { edu: 'high', looks: 55 }, outfit: '#003049' }),
  // ── University
  c('nurse', 'health', '🩺', ['Infirmi{er|ère}', 'Infirmi{er|ère} en chef', 'Cadre de santé'], ['Nurse', 'Head nurse', 'Nursing director'], [55000, 98000], { req: { edu: 'uni', majors: ['nursing', 'biology'] }, place: 'hospital', outfit: '#4cc9f0' }),
  c('teacher', 'edu', '👩‍🏫', ['Professeur{|e} stagiaire', 'Professeur{|e}', 'Professeur{|e} principal{|e}', "Direct{eur|rice} d'école"], ['Student teacher', 'Teacher', 'Head teacher', 'Principal'], [40000, 88000], { req: { edu: 'uni', majors: ['education', 'literature', 'math', 'history', 'biology', 'physics', 'arts'] }, place: 'school', outfit: '#bc6c25' }),
  c('accountant', 'office', '🧮', ['Comptable junior', 'Comptable', 'Expert{|e}-comptable', 'Direct{eur|rice} financi{er|ère}'], ['Junior accountant', 'Accountant', 'Senior accountant', 'CFO'], [50000, 160000], { req: { edu: 'uni', majors: ['accounting', 'business', 'economics', 'math'] }, outfit: '#495057' }),
  c('developer', 'tech', '💻', ['Développ{eur|euse} junior', 'Développ{eur|euse}', 'Développ{eur|euse} senior', 'Lead dev', 'CTO'], ['Junior developer', 'Developer', 'Senior developer', 'Lead developer', 'CTO'], [70000, 240000], { req: { edu: 'uni', majors: ['compsci', 'math', 'engineering', 'physics'] }, outfit: '#3a86ff' }),
  c('marketing', 'office', '📣', ['Chargé{|e} de marketing', 'Chef{|fe} de produit', 'Responsable marketing', 'Direct{eur|rice} marketing'], ['Marketing associate', 'Product manager', 'Marketing manager', 'CMO'], [45000, 170000], { req: { edu: 'uni', majors: ['business', 'communication', 'economics', 'psychology'] }, outfit: '#ff006e' }),
  c('journalist', 'media', '📰', ['Pigiste', 'Journaliste', 'Grand reporter', 'Rédact{eur|rice} en chef'], ['Freelance writer', 'Journalist', 'Senior correspondent', 'Editor-in-chief'], [30000, 120000], { req: { edu: 'uni', majors: ['communication', 'literature', 'history', 'polisci'] }, outfit: '#6d6875' }),
  c('engineer', 'tech', '⚙️', ['Ingénieur{|e} junior', 'Ingénieur{|e}', 'Ingénieur{|e} principal{|e}', 'Direct{eur|rice} technique'], ['Junior engineer', 'Engineer', 'Principal engineer', 'Technical director'], [68000, 185000], { req: { edu: 'uni', majors: ['engineering', 'physics'] }, outfit: '#fb8500' }),
  c('architect', 'tech', '📐', ['Architecte stagiaire', 'Architecte', 'Architecte associé{|e}'], ['Intern architect', 'Architect', 'Partner architect'], [48000, 150000], { req: { edu: 'uni', majors: ['architecture'] }, outfit: '#adb5bd' }),
  c('designer', 'art', '🎨', ['Graphiste junior', 'Graphiste', 'Direct{eur|rice} artistique'], ['Junior designer', 'Graphic designer', 'Art director'], [38000, 125000], { req: { edu: 'uni', majors: ['arts', 'communication', 'architecture'] }, outfit: '#ffbe0b' }),
  c('psychologist', 'health', '🛋️', ['Psychologue stagiaire', 'Psychologue', 'Psychologue clinicien{|ne}'], ['Intern psychologist', 'Psychologist', 'Clinical psychologist'], [45000, 115000], { req: { edu: 'uni', majors: ['psychology'] }, outfit: '#8d99ae' }),
  c('banker', 'finance', '🏦', ['Analyste financi{er|ère}', 'Associé{|e}', 'Vice-président{|e}', 'Direct{eur|rice} général{|e}'], ['Financial analyst', 'Associate', 'Vice president', 'Managing director'], [80000, 650000], { req: { edu: 'uni', majors: ['economics', 'business', 'math', 'accounting'], smarts: 60 }, outfit: '#212529' }),
  // ── Graduate school
  c('doctor', 'health', '👩‍⚕️', ['Interne', 'Médecin', 'Médecin spécialiste', 'Chef{|fe} de service'], ['Resident', 'Doctor', 'Specialist', 'Chief of medicine'], [62000, 340000], { req: { edu: 'grad', program: 'medicine' }, place: 'hospital', outfit: '#e9f5ff' }),
  c('lawyer', 'law', '⚖️', ['Avocat{|e} collaborat{eur|rice}', 'Avocat{|e}', 'Avocat{|e} associé{|e}', 'Bâtonni{er|ère}'], ['Junior associate', 'Lawyer', 'Partner', 'Senior partner'], [70000, 420000], { req: { edu: 'grad', program: 'law' }, outfit: '#22223b' }),
  c('scientist', 'science', '🔬', ['Cherch{eur|euse} post-doc', 'Cherch{eur|euse}', 'Direct{eur|rice} de recherche'], ['Postdoctoral researcher', 'Research scientist', 'Research director'], [52000, 165000], { req: { edu: 'grad', program: 'phd' }, outfit: '#ffffff' }),
  c('ceo_track', 'finance', '📊', ['Consultant{|e}', 'Manager', 'Direct{eur|rice}', 'PDG'], ['Consultant', 'Manager', 'Director', 'CEO'], [85000, 900000], { req: { edu: 'grad', program: 'mba' }, outfit: '#14213d' }),
];
