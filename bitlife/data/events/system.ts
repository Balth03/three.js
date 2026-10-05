// System events driven by the engine (arrest & trial, prison entry, release…).
import type { EventDef } from '@bl/sim';
import { trial } from '@bl/sim';

export const systemEvents: EventDef[] = [
  {
    id: 'sys_arrest',
    icon: '🚔',
    cat: 'system',
    chainOnly: true,
    scene: { place: 'court', mood: 'shock', fx: 'police' },
    text: {
      fr: ['Menottes, cellule de garde à vue qui sent la pisse, puis le tribunal. Le juge te regarde comme une crotte sur sa chaussure. Comment plaides-tu ?', 'Te voilà au tribunal, en survêtement taché. Le procureur salive déjà. Ta stratégie ?'],
      en: ['Cuffs, a holding cell that smells of piss, then court. The judge looks at you like dog poop on his shoe. How do you plead?', 'Here you are in court, in a stained tracksuit. The prosecutor is already drooling. Your strategy?'],
    },
    choices: [
      { label: { fr: 'Plaider coupable', en: 'Plead guilty' }, text: { fr: '', en: '' }, fx: { fn: ({ life, content }) => trial(life, content, 'guilty') } },
      { label: { fr: 'Avocat commis d\'office', en: 'Public defender' }, text: { fr: 'Mon avocat commis d\'office s\'est endormi pendant sa propre plaidoirie.', en: 'My public defender fell asleep during his own closing argument.' }, fx: { fn: ({ life, content }) => trial(life, content, 'public') } },
      { label: { fr: 'Engager un bon avocat', en: 'Hire a good lawyer' }, if: { money: [15000, 90000] }, text: { fr: 'Mon avocat facturait même ses éternuements.', en: 'My lawyer billed me for his sneezes.' }, fx: { fn: ({ life, content }) => trial(life, content, 'lawyer') } },
      { label: { fr: 'Engager un ténor du barreau', en: 'Hire a star attorney' }, if: { money: [90000, 1e15] }, text: { fr: 'Un ténor du barreau aux dents refaites a fait pleurer le jury.', en: 'A star attorney with veneers made the jury cry.' }, fx: { fn: ({ life, content }) => trial(life, content, 'star') } },
      { label: { fr: 'Me défendre moi-même', en: 'Defend myself' }, text: { fr: 'J\'ai décidé d\'assurer ma propre défense. Le juge a soupiré.', en: 'I decided to represent myself. The judge sighed.' }, fx: { open: 'minigame:trial' } },
      { label: { fr: 'Graisser la patte du juge', en: 'Bribe the judge' }, if: { money: [25000, 1e15], rating: 1 }, text: { fr: 'J\'ai glissé une enveloppe sous le marteau du juge.', en: 'I slid an envelope under the judge\'s gavel.' }, fx: { fn: ({ life, content }) => trial(life, content, 'bribe') } },
      { label: { fr: 'Prendre la fuite', en: 'Make a run for it' }, text: { fr: 'J\'ai sauté par-dessus le box des accusés.', en: 'I vaulted over the dock.' }, fx: { fn: ({ life, content }) => trial(life, content, 'flee') } },
    ],
  },
  {
    id: 'sys_first_night',
    icon: '🔒',
    cat: 'prison',
    once: true,
    priority: true,
    when: { prison: true },
    scene: { place: 'prison', mood: 'shock' },
    text: {
      fr: ['Première nuit en taule. Ton codétenu, un colosse tatoué « MAMAN » sur le front, te fixe depuis la couchette du haut. Que fais-tu ?'],
      en: ['First night inside. Your cellmate, a giant with "MOM" tattooed on his forehead, stares at you from the top bunk. What do you do?'],
    },
    choices: [
      { label: { fr: 'Lui casser la gueule d\'entrée', en: 'Punch him right away' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: 'Je lui ai mis un coup de tête. Il s\'est écroulé. Toute l\'aile me respecte désormais.', en: 'I headbutted him. He went down. The whole wing respects me now.' }, fx: { fn: ({ life }) => { if (life.prison) life.prison.respect += 25; }, health: -5 }, mood: 'proud' },
        { w: 1, text: { fr: 'Il m\'a plié en deux comme un transat. J\'ai craché deux dents et ma dignité.', en: 'He folded me like a deck chair. I spat out two teeth and my dignity.' }, fx: { health: -18, visual: 'gore', fn: ({ life }) => { if (life.prison) life.prison.respect -= 10; } }, mood: 'cry' },
      ] },
      { label: { fr: 'Lui proposer des biscuits', en: 'Offer him cookies' }, text: { fr: 'On a partagé des Granola en silence. Il m\'a appelé « petit frère ». Je crois que j\'ai un ami.', en: 'We shared cookies in silence. He called me "little brother". I think I have a friend.' }, fx: { happy: 4, fn: ({ life }) => { if (life.prison) life.prison.respect += 5; } } },
      { label: { fr: 'Pleurer en silence', en: 'Cry quietly' }, text: { fr: 'J\'ai pleuré toute la nuit dans mon oreiller qui sentait le pied.', en: 'I cried all night into a pillow that smelled of feet.' }, fx: { happy: -8, fn: ({ life }) => { if (life.prison) life.prison.respect -= 8; } }, mood: 'cry' },
    ],
  },
];
