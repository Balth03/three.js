// Milestone events: triggered by the engine (scheduled) or always-on priority events.
import type { EventDef } from '@bl/sim';

export const milestoneEvents: EventDef[] = [
  {
    id: 'edu_after_high',
    icon: '🎓',
    cat: 'milestone',
    chainOnly: true,
    scene: { place: 'school', mood: 'proud', prop: 'diploma' },
    text: {
      fr: ['Le diplôme en poche, le monde t\'ouvre les bras. Ou du moins, il entrouvre une fenêtre. Et maintenant ?', 'Fini le lycée ! Ta mère pleure, ton père fait semblant que non. Quelle est la suite ?'],
      en: ['Diploma in hand, the world opens its arms. Or at least cracks a window. What now?', 'High school is over! Your mom is crying, your dad pretends he isn\'t. What\'s next?'],
    },
    choices: [
      { label: { fr: 'Aller à l\'université', en: 'Go to university' }, text: { fr: 'J\'ai décidé de continuer mes études.', en: 'I decided to keep studying.' }, fx: { open: 'university' } },
      { label: { fr: 'Chercher un travail', en: 'Look for a job' }, text: { fr: 'Je suis parti{|e} à la conquête du marché du travail.', en: 'I set off to conquer the job market.' }, fx: { open: 'jobs' } },
      {
        label: { fr: 'Prendre une année sabbatique', en: 'Take a gap year' },
        out: [
          { w: 3, text: { fr: 'J\'ai pris une année sabbatique. J\'ai vu des choses. Surtout mon plafond, mais quand même.', en: 'I took a gap year. I saw things. Mostly my ceiling, but still.' }, fx: { happy: 8, flag: 'gap_year' } },
          { w: 1, text: { fr: 'Année sabbatique en sac à dos : je suis revenu{|e} transformé{|e}, bronzé{|e} et fauché{|e}.', en: 'A backpacking gap year: I came back transformed, tanned and broke.' }, fx: { happy: 14, smarts: 3, money: -800, flag: 'gap_year' } },
        ],
      },
    ],
  },
  {
    id: 'edu_after_uni',
    icon: '🎓',
    cat: 'milestone',
    chainOnly: true,
    scene: { place: 'uni', mood: 'proud', prop: 'diploma' },
    text: {
      fr: ['Toque lancée en l\'air, photo floue, diplôme encadré. Le monde du travail t\'attend. Que fais-tu ?'],
      en: ['Cap tossed, blurry photo, diploma framed. The working world awaits. What do you do?'],
    },
    choices: [
      { label: { fr: 'Chercher un emploi', en: 'Find a job' }, text: { fr: 'J\'ai peaufiné mon CV et j\'ai commencé à postuler.', en: 'I polished my résumé and started applying.' }, fx: { open: 'jobs' } },
      { label: { fr: 'Continuer : études supérieures', en: 'Keep going: graduate school' }, text: { fr: 'Encore quelques années d\'études ? Pourquoi pas.', en: 'A few more years of school? Why not.' }, fx: { open: 'grad' } },
      { label: { fr: 'Fêter ça pendant un an', en: 'Party for a year' }, text: { fr: 'J\'ai fêté mon diplôme. Longtemps. Très longtemps.', en: 'I celebrated my degree. For a long time. A very long time.' }, fx: { happy: 10, health: -3 } },
    ],
  },
  {
    id: 'adult_18',
    icon: '🔞',
    cat: 'milestone',
    priority: true,
    once: true,
    when: { age: [18, 18] },
    scene: { place: 'home', mood: 'party', prop: 'cake' },
    text: {
      fr: ['18 ans ! Tu es officiellement adulte. Tes parents te regardent comme si tu allais tout casser.', 'Joyeux 18e anniversaire ! Le droit de vote, les impôts, la liberté. Comment fêtes-tu ça ?'],
      en: ['18! You\'re officially an adult. Your parents look at you like you\'re about to break everything.', 'Happy 18th birthday! The right to vote, taxes, freedom. How do you celebrate?'],
    },
    choices: [
      { label: { fr: 'Grosse fête avec les amis', en: 'Big party with friends' }, out: [
        { w: 3, text: { fr: 'Meilleure soirée de ma vie. Les voisins, moins.', en: 'Best night of my life. The neighbors disagree.' }, fx: { happy: 12 } },
        { w: 1, text: { fr: 'La fête a dégénéré, la police est passée. Mon père n\'a pas apprécié.', en: 'The party got out of hand, the police showed up. My dad was not amused.' }, fx: { happy: 4, karma: -2 } },
      ] },
      { label: { fr: 'Dîner tranquille en famille', en: 'Quiet family dinner' }, text: { fr: 'Un dîner en famille, avec un gâteau un peu raté. Parfait.', en: 'A family dinner with a slightly failed cake. Perfect.' }, fx: { happy: 6, karma: 2 } },
      { label: { fr: 'Prendre le large : quitter la maison', en: 'Fly the nest: move out' }, out: [
        { w: 1, text: { fr: 'J\'ai fait mes cartons et j\'ai pris un petit appart. Liberté ! (Et factures.)', en: 'I packed up and got a tiny apartment. Freedom! (And bills.)' }, fx: { happy: 10, moveOut: true }, mood: 'proud' },
      ] },
    ],
  },
  {
    id: 'retire_offer',
    icon: '🏖️',
    cat: 'milestone',
    once: true,
    priority: true,
    when: { age: [65, 70], job: true },
    scene: { place: 'office', mood: 'happy' },
    text: {
      fr: ['{employer} t\'offre un pot de départ et une jolie montre si tu prends ta retraite. Alors ?'],
      en: ['{employer} offers you a farewell party and a nice watch if you retire. So?'],
    },
    choices: [
      { label: { fr: 'Prendre ma retraite', en: 'Retire' }, text: { fr: 'J\'ai rendu mon badge. Place aux siestes.', en: 'I handed in my badge. Nap time begins.' }, fx: { happy: 10, retire: true } },
      { label: { fr: 'Continuer à bosser', en: 'Keep working' }, text: { fr: 'La retraite ? Jamais. On me sortira du bureau les pieds devant.', en: 'Retire? Never. They\'ll carry me out of the office.' }, fx: { discipline: 3 } },
    ],
  },
];
