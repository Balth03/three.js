import type { ActionDef, Effect } from '@bl/sim';
import { addLine, cure, L } from '@bl/sim';

const doctorFx: Effect = {
  fn: ({ life, content, rand }) => {
    if (!life.conditions.length) {
      addLine(life, L('Le médecin m\'a trouvé{|e} en pleine forme et m\'a donné une sucette.'.replace('{|e}', life.gender === 'f' ? 'e' : ''), 'The doctor said I was perfectly healthy and gave me a lollipop.'), '🩺', 'good');
      return;
    }
    for (const c of life.conditions.slice()) {
      const d = content.diseases.find((x) => x.id === c.id);
      if (d && rand() < d.curable) cure(life, content, c.id);
      else if (d) addLine(life, { fr: `Le traitement contre : ${d.name.fr.toLowerCase()} n'a pas marché.`, en: `The treatment for ${d.name.en.toLowerCase()} didn't work.` }, '💊', 'bad');
    }
    life.stats.health = Math.min(100, life.stats.health + 4);
  },
};

export const actions: ActionDef[] = [
  // ───────── Mind & body
  {
    id: 'gym', tab: 'activities', group: 'mind', icon: '🏋️', label: { fr: 'Salle de sport', en: 'Gym' }, desc: { fr: 'Santé, apparence, forme', en: 'Health, looks, fitness' }, when: { age: [12, 120] }, limit: 4, cost: 25,
    out: [
      { w: 4, text: { fr: ['J\'ai soulevé de la fonte. Je me sens invincible.', 'Séance cardio : j\'ai transpiré des choses que je ne soupçonnais pas.', 'J\'ai fait du vélo d\'appartement en regardant une série. Ça compte.'], en: ['I lifted weights. I feel invincible.', 'Cardio session: I sweated things I didn\'t know I had.', 'I rode the stationary bike while watching a show. It counts.'] }, fx: { health: 3, looks: 2, athletic: 4, happy: 2, weight: -0.02 } },
      { w: 1, text: { fr: 'Je me suis froissé un muscle en voulant impressionner quelqu\'un. Personne n\'a regardé.', en: 'I pulled a muscle trying to impress someone. Nobody was watching.' }, fx: { health: -3, happy: -2 } },
    ],
  },
  {
    id: 'run', tab: 'activities', group: 'mind', icon: '🏃', label: { fr: 'Aller courir', en: 'Go for a run' }, when: { age: [8, 90] }, limit: 3,
    out: [
      { w: 4, text: { fr: ['J\'ai couru cinq kilomètres. Enfin, cinq minutes. Bref, j\'ai couru.', 'Petit footing au parc. Un pigeon m\'a doublé{|e}.'], en: ['I ran a few kilometers. Well, minutes. Anyway, I ran.', 'A little jog in the park. A pigeon overtook me.'] }, fx: { health: 2, athletic: 3, happy: 1, weight: -0.015 } },
      { w: 1, text: { fr: 'Je me suis tordu la cheville sur un trottoir sournois.', en: 'I twisted my ankle on a sneaky curb.' }, fx: { disease: 'sprain', happy: -3 } },
    ],
  },
  {
    id: 'library', tab: 'activities', group: 'mind', icon: '📚', label: { fr: 'Bibliothèque', en: 'Library' }, desc: { fr: 'Intelligence', en: 'Smarts' }, when: { age: [5, 120] }, limit: 4,
    out: [
      { w: 4, text: { fr: ['J\'ai lu un livre entier à la bibliothèque. Mon cerveau a gonflé.', 'J\'ai dévoré une encyclopédie. Je sais maintenant tout sur les ornithorynques.', 'J\'ai emprunté trois romans. J\'en lirai peut-être un.'], en: ['I read a whole book at the library. My brain grew.', 'I devoured an encyclopedia. I now know everything about platypuses.', 'I borrowed three novels. I might read one.'] }, fx: { smarts: 3, happy: 1 } },
      { w: 1, text: { fr: 'Je me suis endormi{|e} sur un livre de philo. Le bibliothécaire m\'a réveillé{|e} à la fermeture.', en: 'I fell asleep on a philosophy book. The librarian woke me at closing time.' }, fx: { smarts: 1, happy: 1 } },
    ],
  },
  {
    id: 'meditate', tab: 'activities', group: 'mind', icon: '🧘', label: { fr: 'Méditer', en: 'Meditate' }, desc: { fr: 'Bonheur, stress', en: 'Happiness, stress' }, when: { age: [10, 120] }, limit: 3,
    out: [
      { w: 3, text: { fr: ['J\'ai médité vingt minutes. J\'ai atteint la paix intérieure, puis j\'ai pensé à des frites.', 'Méditation réussie : j\'ai inspiré, expiré, et oublié mes soucis.'], en: ['I meditated for twenty minutes. Reached inner peace, then thought about fries.', 'Successful meditation: I breathed in, out, and forgot my worries.'] }, fx: { happy: 4, stress: -8, health: 1 } },
      { w: 1, text: { fr: 'Impossible de méditer : le voisin perce un mur depuis 9h.', en: "Couldn't meditate: the neighbor has been drilling since 9am." }, fx: { happy: -1 } },
    ],
  },
  {
    id: 'doctor', tab: 'activities', group: 'mind', icon: '🩺', label: { fr: 'Consulter un médecin', en: 'See a doctor' }, desc: { fr: 'Soigner ses maladies', en: 'Treat illnesses' }, limit: 2, cost: 60,
    out: [{ text: { fr: 'Je suis allé{|e} chez le médecin.', en: 'I went to see a doctor.' }, fx: doctorFx }], scene: { place: 'hospital' },
  },
  {
    id: 'diet', tab: 'activities', group: 'mind', icon: '🥗', label: { fr: 'Faire un régime', en: 'Go on a diet' }, when: { age: [14, 100] }, limit: 1,
    out: [
      { w: 2, text: { fr: 'J\'ai tenu mon régime toute l\'année. J\'ai même goûté du chou kale de mon plein gré.', en: 'I stuck to my diet all year. I even ate kale voluntarily.' }, fx: { health: 4, looks: 3, weight: -0.06, happy: -1 } },
      { w: 2, text: { fr: 'Régime abandonné au bout de trois jours, à cause d\'une raclette.', en: 'Diet abandoned after three days, because of a cheese platter.' }, fx: { happy: 2, weight: 0.01 } },
    ],
  },
  {
    id: 'salon', tab: 'activities', group: 'mind', icon: '💇', label: { fr: 'Coiffeur / institut', en: 'Salon & spa' }, desc: { fr: 'Apparence', en: 'Looks' }, when: { age: [12, 120] }, limit: 2, cost: 70,
    out: [
      { w: 4, text: { fr: ['Nouvelle coupe ! Je me suis regardé{|e} dans chaque vitrine en rentrant.', 'Un soin du visage et me voilà rayonnant{|e}.'], en: ['New haircut! I checked myself out in every shop window on the way home.', 'One facial later, I\'m glowing.'] }, fx: { looks: 4, happy: 3 } },
      { w: 1, text: { fr: 'Le coiffeur a « tenté un truc ». Je porte un bonnet pour les six prochains mois.', en: 'The stylist "tried something". I\'m wearing a beanie for the next six months.' }, fx: { looks: -3, happy: -4 } },
    ],
  },
  // ───────── Fun
  {
    id: 'movies', tab: 'activities', group: 'fun', icon: '🍿', label: { fr: 'Aller au cinéma', en: 'Go to the movies' }, when: { age: [5, 120] }, limit: 3, cost: 14,
    out: [
      { w: 3, text: { fr: ['J\'ai vu un film d\'action où tout explose. Excellent.', 'J\'ai vu une comédie romantique. J\'ai pleuré, mais c\'était les oignons du pop-corn.', 'J\'ai vu un film d\'auteur de trois heures. Je crois avoir compris la fin.'], en: ['I saw an action movie where everything explodes. Excellent.', 'I saw a romcom. I cried, but it was the popcorn onions.', 'I saw a three-hour art film. I think I understood the ending.'] }, fx: { happy: 5 } },
      { w: 1, text: { fr: 'Quelqu\'un a raconté la fin du film à voix haute. J\'envisage une carrière criminelle.', en: 'Someone said the ending out loud. I\'m considering a life of crime.' }, fx: { happy: -2 } },
    ],
  },
  {
    id: 'videogames', tab: 'activities', group: 'fun', icon: '🎮', label: { fr: 'Jouer aux jeux vidéo', en: 'Play video games' }, when: { age: [5, 120] }, limit: 3,
    out: [
      { w: 3, text: { fr: ['J\'ai joué à Mario Kart toute la nuit. J\'ai insulté une carapace bleue.', 'J\'ai enfin battu le boss final. Mes pouces sont en deuil.', 'J\'ai construit une cathédrale dans Minecraft.'], en: ['I played Mario Kart all night. I cursed at a blue shell.', 'I finally beat the final boss. My thumbs are in mourning.', 'I built a cathedral in Minecraft.'] }, fx: { happy: 5, smarts: 1, athletic: -1 } },
      { w: 1, text: { fr: 'J\'ai perdu contre un enfant de 9 ans en ligne. Il a été très méchant.', en: 'I lost to a 9-year-old online. He was very rude.' }, fx: { happy: -3 } },
    ],
  },
  {
    id: 'music', tab: 'activities', group: 'fun', icon: '🎸', label: { fr: 'Pratiquer un instrument', en: 'Practice an instrument' }, when: { age: [6, 100] }, limit: 2,
    out: [
      { w: 2, odds: { smarts: 0.5 }, text: { fr: 'J\'ai pratiqué la guitare. Les voisins ont applaudi. (Pour que j\'arrête ?)', en: 'I practiced guitar. The neighbors applauded. (So I\'d stop?)' }, fx: { happy: 3, smarts: 1, fn: ({ life }) => { if (life.talent === 'music') life.talentKnown = true; } } },
      { w: 1, text: { fr: 'J\'ai joué du piano pendant une heure. Une seule chanson. La même.', en: 'I played piano for an hour. One song. The same one.' }, fx: { happy: 2 } },
    ],
  },
  {
    id: 'art', tab: 'activities', group: 'fun', icon: '🖌️', label: { fr: 'Dessiner / peindre', en: 'Draw or paint' }, when: { age: [3, 120] }, limit: 2,
    out: [
      { w: 1, text: { fr: ['J\'ai peint un coucher de soleil. Ou une omelette. L\'art est subjectif.', 'J\'ai rempli un carnet entier de croquis.'], en: ['I painted a sunset. Or an omelet. Art is subjective.', 'I filled a whole sketchbook.'] }, fx: { happy: 4, fn: ({ life }) => { if (life.talent === 'art') life.talentKnown = true; } } },
    ],
  },
  {
    id: 'walk', tab: 'activities', group: 'fun', icon: '🌳', label: { fr: 'Balade au parc', en: 'Walk in the park' }, limit: 3, when: { age: [3, 120] },
    out: [
      { w: 3, text: { fr: ['J\'ai fait une balade au parc. J\'ai caressé trois chiens. Journée parfaite.', 'J\'ai nourri les canards. L\'un d\'eux m\'a jugé{|e}.'], en: ['I took a walk in the park. Pet three dogs. Perfect day.', 'I fed the ducks. One of them judged me.'] }, fx: { happy: 3, health: 1, stress: -4 } },
      { w: 1, text: { fr: 'Il s\'est mis à pleuvoir des cordes au milieu de ma balade.', en: 'It started pouring in the middle of my walk.' }, fx: { happy: -1 } },
    ],
  },
  {
    id: 'nightclub', tab: 'activities', group: 'fun', icon: '🪩', label: { fr: 'Sortir en boîte', en: 'Go clubbing' }, when: { age: [18, 70] }, limit: 2, cost: 40,
    out: [
      { w: 3, text: { fr: ['J\'ai dansé jusqu\'à 5h. Mes pieds portent plainte.', 'Soirée en boîte : j\'ai fait la chenille avec des inconnus.'], en: ['I danced until 5am. My feet are suing.', 'Night out: I did the conga with strangers.'] }, fx: { happy: 7, health: -1 } },
      { w: 1, text: { fr: 'Le videur m\'a refusé l\'entrée à cause de mes chaussures. Humiliation.', en: 'The bouncer turned me away because of my shoes. Humiliating.' }, fx: { happy: -4 } },
      { w: 1, text: { fr: 'J\'ai rencontré quelqu\'un de charmant sur la piste. On a échangé nos numéros !', en: 'I met someone charming on the dance floor. We swapped numbers!' }, fx: { happy: 6, newNpc: { role: 'friend', age: [-3, 3], gender: 'attracted' } } },
    ],
  },
  {
    id: 'lottery', tab: 'assets', group: 'money', icon: '🎟️', label: { fr: 'Ticket de loterie', en: 'Lottery ticket' }, when: { age: [18, 120] }, limit: 5, cost: 3,
    out: [
      { w: 2000, text: { fr: ['Perdu. Évidemment.', 'Pas un seul bon numéro. Le ticket est parti à la poubelle.', 'Perdu. Mais l\'espace d\'un instant, j\'ai rêvé d\'un yacht.'], en: ['Lost. Obviously.', 'Not one matching number. The ticket went in the bin.', 'Lost. But for a moment, I dreamt of a yacht.'] }, fx: { happy: -1 } },
      { w: 150, text: { fr: 'J\'ai gagné un petit lot au grattage !', en: 'I won a small prize!' }, fx: { money: 50, happy: 4 } },
      { w: 8, text: { fr: 'JACKPOT moyen : j\'ai gagné une jolie somme à la loterie !', en: 'Mid-size JACKPOT: I won a nice sum in the lottery!' }, fx: { money: 25000, happy: 15, visual: 'money' } },
      { w: 0.3, text: { fr: '🎉 J\'AI GAGNÉ LE GROS LOT. JE SUIS MILLIONNAIRE. 🎉', en: '🎉 I WON THE JACKPOT. I\'M A MILLIONAIRE. 🎉' }, fx: { money: 5000000, happy: 40, fame: 10, counter: 'jackpot', visual: 'money' } },
    ],
  },
  {
    id: 'moveout', tab: 'assets', group: 'home', icon: '🏠', label: { fr: 'Quitter le nid familial', en: 'Move out' }, desc: { fr: 'Liberté… et loyer', en: 'Freedom… and rent' }, when: { age: [18, 120], movedOut: false }, limit: 1,
    out: [{ text: { fr: 'J\'ai emménagé dans mon propre appartement. Il est minuscule, mais il est à moi (enfin, au propriétaire).', en: 'I moved into my own apartment. It\'s tiny, but it\'s mine (well, the landlord\'s).' }, fx: { happy: 8, moveOut: true }, mood: 'proud' }],
  },
  {
    id: 'adopt', tab: 'assets', group: 'home', icon: '🐶', label: { fr: 'Adopter un animal', en: 'Adopt a pet' }, when: { age: [18, 100] }, limit: 1, cost: 150,
    out: [
      { w: 1, text: { fr: 'J\'ai adopté un chien au refuge. Il a mangé ma chaussure dans l\'heure. Je l\'aime.', en: 'I adopted a dog from the shelter. It ate my shoe within the hour. I love it.' }, fx: { happy: 10, newNpc: { role: 'pet', species: 'dog', age: [1, 4], abs: true } } },
      { w: 1, text: { fr: 'J\'ai adopté un chat. Ou plutôt, il m\'a adopté{|e}.', en: 'I adopted a cat. Or rather, it adopted me.' }, fx: { happy: 10, newNpc: { role: 'pet', species: 'cat', age: [1, 4], abs: true } } },
    ],
  },
  // ───────── Love
  { id: 'dating', tab: 'relations', group: 'love', icon: '💘', label: { fr: 'Trouver l\'amour', en: 'Find love' }, when: { age: [14, 100] }, open: 'dating' },
  // ───────── School
  {
    id: 'study', tab: 'school', group: 'school', icon: '📖', label: { fr: 'Étudier plus', en: 'Study harder' }, when: { school: 'any', age: [6, 99] }, limit: 3,
    out: [
      { w: 3, text: { fr: ['J\'ai révisé comme jamais. Mes surligneurs sont à sec.', 'J\'ai fait des fiches de révision. Elles sont magnifiques. Je ne les relirai jamais.'], en: ['I studied like never before. My highlighters are dry.', 'I made flashcards. They\'re gorgeous. I\'ll never read them.'] }, fx: { grade: 7, smarts: 2, discipline: 2, fn: ({ life }) => { life.edu.effort = Math.min(100, life.edu.effort + 20); } } },
      { w: 1, text: { fr: 'J\'ai ouvert mon livre, puis mon téléphone. Trois heures plus tard…', en: 'I opened my book, then my phone. Three hours later…' }, fx: { grade: 1 } },
    ],
  },
  {
    id: 'skip', tab: 'school', group: 'school', icon: '🙈', label: { fr: 'Sécher les cours', en: 'Skip class' }, when: { school: ['middle', 'high', 'uni', 'grad'] }, limit: 2,
    out: [
      { w: 3, text: { fr: 'J\'ai séché pour aller au parc. Personne n\'a rien remarqué.', en: 'I skipped class to hang out at the park. Nobody noticed.' }, fx: { happy: 4, grade: -4 } },
      { w: 1, text: { fr: 'Pris{|e} en flagrant délit de sèche. Heure de colle et coup de fil aux parents.', en: 'Caught skipping. Detention and a call to my parents.' }, fx: { happy: -4, grade: -5, discipline: -2 } },
    ],
  },
  {
    id: 'teacher', tab: 'school', group: 'school', icon: '🍎', label: { fr: 'Fayoter avec le prof', en: 'Suck up to the teacher' }, when: { school: ['primary', 'middle', 'high'] }, limit: 1,
    out: [
      { w: 2, text: { fr: 'J\'ai offert une pomme à ma prof. Elle m\'a souri. Mes notes aussi.', en: 'I gave my teacher an apple. She smiled. So did my grades.' }, fx: { grade: 4 } },
      { w: 1, text: { fr: 'Toute la classe m\'a vu{|e} fayoter. Ma réputation est en miettes.', en: 'The whole class saw me sucking up. My reputation is in ruins.' }, fx: { grade: 2, happy: -3 } },
    ],
  },
  { id: 'uni_apply', tab: 'school', group: 'next', icon: '🎓', label: { fr: 'Postuler à l\'université', en: 'Apply to university' }, when: { degree: 'high', school: 'none', age: [17, 80] }, open: 'university' },
  { id: 'grad_apply', tab: 'school', group: 'next', icon: '🧑‍🎓', label: { fr: 'Études supérieures', en: 'Graduate school' }, when: { degree: 'uni', school: 'none' }, open: 'grad' },
  {
    id: 'dropout', tab: 'school', group: 'next', icon: '🚪', label: { fr: 'Abandonner les études', en: 'Drop out' }, when: { school: ['high', 'uni', 'grad'], age: [16, 99] }, limit: 1,
    out: [{ text: { fr: 'J\'ai claqué la porte de l\'école. Mes parents sont en état de choc.', en: 'I slammed the school door behind me. My parents are in shock.' }, fx: { dropout: true, happy: 3 } }],
  },
  // ───────── Career
  { id: 'jobs', tab: 'career', group: 'jobs', icon: '📋', label: { fr: 'Offres d\'emploi', en: 'Job listings' }, when: { age: [14, 100] }, open: 'jobs' },
  {
    id: 'workhard', tab: 'career', group: 'job', icon: '💪', label: { fr: 'Travailler plus dur', en: 'Work harder' }, when: { job: true }, limit: 2,
    out: [
      { w: 4, text: { fr: ['J\'ai fait des heures sup. Mon chef a remarqué. Mon dos aussi.', 'J\'ai bouclé un dossier en avance. Le stagiaire me regarde comme un dieu.'], en: ['I put in overtime. My boss noticed. So did my back.', 'I finished a project early. The intern looks at me like a god.'] }, fx: { perf: 12, stress: 5, happy: -1 } },
      { w: 1, text: { fr: 'J\'ai travaillé dur… sur le mauvais dossier.', en: 'I worked hard… on the wrong project.' }, fx: { perf: 2, happy: -3 } },
    ],
  },
  {
    id: 'slack', tab: 'career', group: 'job', icon: '😴', label: { fr: 'Glander au boulot', en: 'Slack off' }, when: { job: true }, limit: 2,
    out: [
      { w: 3, text: { fr: 'J\'ai passé la journée à faire semblant de taper un rapport important.', en: 'I spent the day pretending to type an important report.' }, fx: { perf: -6, happy: 4, stress: -5 } },
      { w: 1, text: { fr: 'Mon patron m\'a surpris{|e} en train de regarder des vidéos de chats.', en: 'My boss caught me watching cat videos.' }, fx: { perf: -14, happy: -2 } },
    ],
  },
  {
    id: 'raise', tab: 'career', group: 'job', icon: '💸', label: { fr: 'Demander une augmentation', en: 'Ask for a raise' }, when: { job: true }, limit: 1,
    out: [{
      text: { fr: 'J\'ai pris mon courage à deux mains et frappé à la porte du patron.', en: 'I gathered my courage and knocked on the boss\'s door.' },
      fx: {
        fn: ({ life, rand }) => {
          const j = life.job!;
          if (j.perf > 55 && rand() < 0.35 + (j.perf - 55) / 80) {
            j.salary = Math.round(j.salary * (1.05 + rand() * 0.07));
            addLine(life, L('Augmentation accordée ! Je me sens riche (je ne le suis pas).', 'Raise granted! I feel rich (I\'m not).'), '💰', 'good');
            life.stats.happy = Math.min(100, life.stats.happy + 6);
          } else {
            j.perf = Math.max(0, j.perf - 6);
            addLine(life, L('Refusée. Il m\'a parlé du « contexte économique » pendant vingt minutes.', 'Denied. He talked about "the economic climate" for twenty minutes.'), '🙅', 'bad');
            life.stats.happy = Math.max(0, life.stats.happy - 4);
          }
        },
      },
    }],
  },
  {
    id: 'quit', tab: 'career', group: 'job', icon: '🚪', label: { fr: 'Démissionner', en: 'Quit job' }, when: { job: true }, limit: 1,
    out: [{ text: { fr: 'J\'ai posé ma démission. Je suis sorti{|e} sous les regards jaloux.', en: 'I handed in my notice. I walked out under jealous stares.' }, fx: { quitJob: true, happy: 4 } }],
  },
  {
    id: 'retire', tab: 'career', group: 'job', icon: '🏖️', label: { fr: 'Prendre sa retraite', en: 'Retire' }, when: { job: true, age: [60, 120] }, limit: 1,
    out: [{ text: { fr: 'J\'ai pris ma retraite. Mon nouveau métier : arroser les plantes.', en: 'I retired. My new job: watering plants.' }, fx: { retire: true, happy: 8 } }],
  },
];
