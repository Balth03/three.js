// Trash interactions and more.
import type { RelActionDef } from '@bl/sim';

const HUMANS = ['mother', 'father', 'sibling', 'grandparent', 'friend', 'bestfriend', 'classmate', 'coworker', 'boss', 'partner', 'fiance', 'spouse', 'child', 'ex', 'enemy'] as const;

export const relActions2: RelActionDef[] = [
  {
    id: 'attack', icon: '🥊', rating: 1, label: { fr: 'Frapper', en: 'Attack' }, roles: [...HUMANS], minAge: 6, limit: 1,
    out: [
      { w: 3, odds: { athletic: 1 }, text: { fr: ['J\'ai mis une droite à {a.first}. Son nez a fait « crac » comme une biscotte.', 'J\'ai tabassé {a.first} avec une chaussure. Il y avait du sang sur la semelle.'], en: ['I punched {a.first}. Their nose went "crack" like a cracker.', 'I beat {a.first} with a shoe. There was blood on the sole.'] }, fx: { rel: -40, karma: -8, visual: 'gore', counter: 'assaults', fn: ({ actor }) => { if (actor) actor.health = Math.max(0, actor.health - 20); } }, mood: 'angry' },
      { w: 2, text: { fr: '{a.first} a esquivé et m\'a collé une mandale qui m\'a fait tourner sur moi-même.', en: '{a.first} dodged and slapped me so hard I spun around.' }, fx: { rel: -25, health: -8, happy: -4 }, mood: 'cry' },
      { w: 0.6, text: { fr: 'Des témoins ont appelé la police.', en: 'Witnesses called the police.' }, fx: { rel: -40, arrest: 'mug', visual: 'police' } },
    ],
  },
  {
    id: 'murder', icon: '🔪', rating: 1, label: { fr: 'Assassiner', en: 'Murder' }, roles: [...HUMANS], minAge: 14, limit: 1,
    out: [
      { w: 3, odds: { smarts: 0.6 }, text: { fr: ['J\'ai empoisonné le café de {a.first}. {a:Il|Elle} a bavé de la mousse verte en me regardant droit dans les yeux. Puis plus rien.', 'J\'ai poussé {a.first} dans l\'escalier. Ça a fait le bruit d\'un sac de pommes de terre, avec des craquements en bonus.', 'J\'ai découpé {a.first} à la tronçonneuse dans le garage. J\'ai passé trois jours à nettoyer le plafond.'], en: ['I poisoned {a.first}\'s coffee. They foamed green while staring into my eyes. Then nothing.', 'I pushed {a.first} down the stairs. It sounded like a sack of potatoes, with bonus cracks.', 'I chainsawed {a.first} in the garage. Spent three days cleaning the ceiling.'] }, fx: { actorDie: true, karma: -40, heat: 40, counter: 'murders', visual: 'gore' }, mood: 'neutral' },
      { w: 1, text: { fr: 'J\'ai voulu tuer {a.first}, mais je me suis planté{|e} le couteau dans la main. {a:Il|Elle} a tout compris et appelé les flics.', en: 'I tried to kill {a.first} but stabbed my own hand. They figured it out and called the cops.' }, fx: { rel: -100, health: -12, actorRole: 'enemy', arrest: 'murder', visual: 'gore' }, mood: 'shock' },
      { w: 1.2, text: { fr: 'C\'était le crime parfait… sauf la caméra de la sonnette du voisin.', en: 'It was the perfect crime… except for the neighbour\'s doorbell camera.' }, fx: { actorDie: true, karma: -40, counter: 'murders', arrest: 'murder', visual: 'gore' }, mood: 'shock' },
    ],
  },
  {
    id: 'steal_from', icon: '🫳', label: { fr: 'Lui voler de l\'argent', en: 'Steal money' }, roles: ['mother', 'father', 'grandparent', 'sibling', 'spouse'], minAge: 6, limit: 1,
    out: [
      { w: 3, text: { fr: 'J\'ai piqué des billets dans le portefeuille de {a.first}. Je suis une raclure.', en: 'I swiped bills from {a.first}\'s wallet. I am scum.' }, fx: { money: 60, karma: -4, fn: ({ life, actor }) => { if (actor) actor.money = Math.max(0, actor.money - 60); void life; } } },
      { w: 1, text: { fr: '{a.first} m\'a pris{|e} la main dans le sac. Ambiance glaciale au dîner.', en: '{a.first} caught me red-handed. Frosty dinner.' }, fx: { rel: -25, karma: -3 } },
    ],
  },
  {
    id: 'roast', icon: '🔥', rating: 2, label: { fr: 'Le clasher violemment', en: 'Roast brutally' }, roles: [...HUMANS], minAge: 12, limit: 1, prisonOk: true,
    out: [
      { w: 2, text: { fr: ['J\'ai dit à {a.first} que même sa mère avait pitié de son existence. Silence de mort.', 'J\'ai expliqué à {a.first} que son visage ressemblait à un genou qui a perdu un pari.'], en: ['I told {a.first} even their mother pities their existence. Dead silence.', 'I told {a.first} their face looks like a knee that lost a bet.'] }, fx: { rel: -22, happy: 4, karma: -3 }, mood: 'proud' },
      { w: 1, text: { fr: '{a.first} m\'a répondu par un clash si violent que j\'ai dû m\'asseoir. J\'ai perdu.', en: '{a.first} fired back so hard I had to sit down. I lost.' }, fx: { rel: -8, happy: -8 }, mood: 'cry' },
    ],
  },
  {
    id: 'seduce_inlaw', icon: '😈', rating: 2, label: { fr: 'Draguer lourdement', en: 'Hit on (sleazily)' }, roles: ['coworker', 'boss', 'friend', 'bestfriend', 'ex'], minAge: 18, limit: 1,
    targetIf: (n, life) => life.year - n.birthYear >= 18,
    out: [
      { w: 1, odds: { looks: 1 }, text: { fr: 'J\'ai sorti ma pire réplique (« T\'es pas un Pokémon mais je veux bien t\'attraper »). Ça a marché, à ma grande stupeur.', en: 'I used my worst line ("You\'re not a Pokémon but I\'d still like to catch you"). It worked, to my horror.' }, fx: { actorRole: 'partner', rel: 10, happy: 8, flag: 'cheating' }, mood: 'love' },
      { w: 2, text: { fr: '{a.first} m\'a jeté son verre au visage. Mojito dans l\'œil, c\'est piquant.', en: '{a.first} threw a drink in my face. Mojito in the eye stings.' }, fx: { rel: -20, happy: -5 }, mood: 'sad' },
    ],
  },
  {
    id: 'disown', icon: '🚪', rating: 1, label: { fr: 'Le renier', en: 'Disown' }, roles: ['child', 'sibling', 'mother', 'father'], minAge: 18, limit: 1,
    out: [{ text: { fr: 'J\'ai renié {a.first}. Plus de Noël ensemble, plus d\'anniversaires, plus rien. Ça soulage, puis ça pique.', en: 'I disowned {a.first}. No more Christmas, no birthdays, nothing. A relief, then a sting.' }, fx: { actorGone: true, happy: -4, karma: -5, counter: 'disowns' }, mood: 'angry' }],
  },
  {
    id: 'visit_prison', icon: '📞', label: { fr: 'Appeler depuis la prison', en: 'Call from prison' }, roles: ['mother', 'father', 'sibling', 'partner', 'fiance', 'spouse', 'child', 'bestfriend'], limit: 1, prisonOk: true, when: { prison: true },
    out: [
      { w: 3, text: { fr: '{a.first} a décroché. On a parlé dix minutes à travers une ligne qui grésille. J\'ai fait semblant d\'aller bien.', en: '{a.first} picked up. We talked ten minutes on a crackling line. I pretended to be fine.' }, fx: { rel: 8, happy: 5 } },
      { w: 1, text: { fr: '{a.first} a raccroché en entendant « appel d\'un établissement pénitentiaire ».', en: '{a.first} hung up on hearing "call from a correctional facility".' }, fx: { rel: -5, happy: -6 } },
    ],
  },
];
