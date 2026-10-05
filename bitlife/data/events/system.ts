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
      fr: [
        "Menottes, cellule de garde à vue qui sent la pisse, puis le tribunal. Le juge te regarde comme une crotte sur sa chaussure. Comment plaides-tu ?",
        "Te voilà au tribunal, en survêtement taché. Le procureur salive déjà. Ta stratégie ?",
        "Arrêté{|e} {w:at_place}, {w:time}, devant tout le monde. Après une nuit en cellule avec un type qui dégage {w:smell}, te voilà face au juge. Il bâille. Ton sort tient en une phrase. Que plaides-tu ?",
        "Salle d'audience bondée. Ta mère est au premier rang avec {w:object} sur les genoux, « pour le moral ». Le procureur a préparé [[un PowerPoint|un classeur de 400 pages|des schémas en couleur]]. Le juge attend ta réponse.",
        "Le juge entre, s'assoit et soupire en lisant ton dossier. Le greffier mange {w:food} en douce. Dans le public, quelqu'un a apporté une pancarte à ton nom, et pas pour te soutenir. À toi de jouer.",
      ],
      en: [
        "Cuffs, a holding cell that smells of piss, then court. The judge looks at you like dog poop on his shoe. How do you plead?",
        "Here you are in court, in a stained tracksuit. The prosecutor is already drooling. Your strategy?",
        "Arrested {w:at_place}, {w:time}, in front of everyone. After a night in a cell with a guy giving off {w:smell}, here you are before the judge. He yawns. Your fate fits in one sentence. How do you plead?",
        "Packed courtroom. Your mom is in the front row with {w:object} on her lap, 'for moral support'. The prosecutor prepared [[a PowerPoint|a 400-page binder|color diagrams]]. The judge awaits your answer.",
        "The judge walks in, sits down and sighs reading your file. The clerk is sneakily eating {w:food}. In the gallery, someone brought a sign with your name on it, and not a supportive one. Your move.",
      ],
    },
    choices: [
      { label: { fr: 'Plaider coupable', en: 'Plead guilty' }, text: { fr: '', en: '' }, fx: { fn: ({ life, content }) => trial(life, content, 'guilty') } },
      { label: { fr: 'Avocat commis d\'office', en: 'Public defender' }, text: { fr: ["Mon avocat commis d'office s'est endormi pendant sa propre plaidoirie.", "Mon avocat commis d'office a découvert mon dossier dans le couloir, trois minutes avant l'audience. Il a dit « on improvise »."], en: ["My public defender fell asleep during his own closing argument.", "My public defender saw my file for the first time in the hallway, three minutes before the hearing. He said 'we'll wing it'."] }, fx: { fn: ({ life, content }) => trial(life, content, 'public') } },
      { label: { fr: 'Engager un bon avocat', en: 'Hire a good lawyer' }, if: { money: [15000, 90000] }, text: { fr: ["Mon avocat facturait même ses éternuements.", "Mon avocat a plaidé avec talent, puis m'a facturé le café qu'il a bu pendant l'audience."], en: ["My lawyer billed me for his sneezes.", "My lawyer argued brilliantly, then billed me for the coffee he drank during the hearing."] }, fx: { fn: ({ life, content }) => trial(life, content, 'lawyer') } },
      { label: { fr: 'Engager un ténor du barreau', en: 'Hire a star attorney' }, if: { money: [90000, 1e15] }, text: { fr: ["Un ténor du barreau aux dents refaites a fait pleurer le jury.", "Mon ténor du barreau est arrivé en hélicoptère, a cité Victor Hugo trois fois et fait applaudir la salle."], en: ["A star attorney with veneers made the jury cry.", "My star attorney arrived by helicopter, quoted Shakespeare three times and got the courtroom applauding."] }, fx: { fn: ({ life, content }) => trial(life, content, 'star') } },
      { label: { fr: 'Me défendre moi-même', en: 'Defend myself' }, text: { fr: ["J'ai décidé d'assurer ma propre défense. Le juge a soupiré.", "Je me suis défendu{|e} seul{|e}, avec des notes écrites sur ma main. Le greffier a ricané."], en: ["I decided to represent myself. The judge sighed.", "I represented myself, with notes scribbled on my hand. The clerk snickered."] }, fx: { open: 'minigame:trial' } },
      { label: { fr: 'Graisser la patte du juge', en: 'Bribe the judge' }, if: { money: [25000, 1e15], rating: 1 }, text: { fr: ["J'ai glissé une enveloppe sous le marteau du juge.", "J'ai glissé une enveloppe bien épaisse dans le dossier du juge, entre deux pièces à conviction."], en: ["I slid an envelope under the judge's gavel.", "I tucked a fat envelope into the judge's file, between two pieces of evidence."] }, fx: { fn: ({ life, content }) => trial(life, content, 'bribe') } },
      { label: { fr: 'Prendre la fuite', en: 'Make a run for it' }, text: { fr: ["J'ai sauté par-dessus le box des accusés.", "J'ai profité d'une pause pour foncer vers la sortie de secours."], en: ["I vaulted over the dock.", "I used a recess to sprint for the emergency exit."] }, fx: { fn: ({ life, content }) => trial(life, content, 'flee') } },
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
      fr: [
        "Première nuit en taule. Ton codétenu, un colosse tatoué « MAMAN » sur le front, te fixe depuis la couchette du haut. Que fais-tu ?",
        "La porte de la cellule claque derrière toi. Ton codétenu, deux mètres de muscles et {w:smell}, fait craquer ses doigts un par un en te regardant. Il en a [[dix|onze|neuf]]. Que fais-tu ?",
        "Première nuit en prison. Ton codétenu, surnommé « {w:nickname} », sculpte {w:animal} dans une savonnette avec une petite cuillère. Il s'arrête. Il te regarde. Il reprend. Que fais-tu ?",
        "Lumières éteintes. Dans la couchette du haut, ton codétenu chantonne {w:song} d'une voix grave, sans jamais cligner des yeux. Il a un tatouage de larme sous chaque œil. Que fais-tu ?",
        "Bienvenue en cellule. Ton codétenu, un géant qui dégage {w:smell}, t'annonce que la couchette du bas est à lui, l'étagère aussi, et que tu dors « là où il dit ». Que fais-tu ?",
      ],
      en: [
        "First night inside. Your cellmate, a giant with \"MOM\" tattooed on his forehead, stares at you from the top bunk. What do you do?",
        "The cell door slams behind you. Your cellmate, six-foot-five of muscle and {w:smell}, cracks his knuckles one by one while staring at you. He has [[ten|eleven|nine]] fingers. What do you do?",
        "First night in prison. Your cellmate, known as '{w:nickname}', is carving {w:animal} out of a bar of soap with a teaspoon. He stops. He looks at you. He resumes. What do you do?",
        "Lights out. On the top bunk, your cellmate hums {w:song} in a deep voice, never blinking. He has a teardrop tattoo under each eye. What do you do?",
        "Welcome to your cell. Your cellmate, a giant giving off {w:smell}, informs you that the bottom bunk is his, the shelf too, and that you'll sleep 'where he says'. What do you do?",
      ],
    },
    choices: [
      { label: { fr: 'Lui casser la gueule d\'entrée', en: 'Punch him right away' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: ["Je lui ai mis un coup de tête. Il s'est écroulé. Toute l'aile me respecte désormais.", "Je l'ai attaqué par surprise avec mon oreiller roulé. Il a glissé sur sa savonnette et s'est assommé tout seul. Je prends le crédit. Toute l'aile parle de moi."], en: ["I headbutted him. He went down. The whole wing respects me now.", "I jumped him with my rolled-up pillow. He slipped on his soap and knocked himself out. I'm taking the credit. The whole wing is talking about me."] }, fx: { fn: ({ life }) => { if (life.prison) life.prison.respect += 25; }, health: -5 }, mood: 'proud' },
        { w: 1, text: { fr: ["Il m'a plié en deux comme un transat. J'ai craché deux dents et ma dignité.", "Il m'a attrapé{|e} par le col et m'a utilisé{|e} comme haltère pendant dix minutes. Je dors maintenant sous le lit. Par choix, officiellement."], en: ["He folded me like a deck chair. I spat out two teeth and my dignity.", "He grabbed me by the collar and used me as a dumbbell for ten minutes. I now sleep under the bed. By choice, officially."] }, fx: { health: -18, visual: 'gore', fn: ({ life }) => { if (life.prison) life.prison.respect -= 10; } }, mood: 'cry' },
      ] },
      { label: { fr: 'Lui proposer des biscuits', en: 'Offer him cookies' }, text: { fr: ["On a partagé des Granola en silence. Il m'a appelé « petit frère ». Je crois que j'ai un ami.", "Je lui ai tendu mes biscuits. Il les a mangés, a pleuré un peu, puis m'a raconté sa vie jusqu'à 4 h du matin. Je suis devenu{|e} son confident. Il est très sensible."], en: ["We shared cookies in silence. He called me \"little brother\". I think I have a friend.", "I offered him my cookies. He ate them, cried a little, then told me his life story until 4 a.m. I'm his confidant now. He's very sensitive."] }, fx: { happy: 4, fn: ({ life }) => { if (life.prison) life.prison.respect += 5; } } },
      { label: { fr: 'Pleurer en silence', en: 'Cry quietly' }, text: { fr: ["J'ai pleuré toute la nuit dans mon oreiller qui sentait le pied.", "J'ai pleuré en silence. Enfin, je croyais. Au matin, toute l'aile imitait mes petits reniflements."], en: ["I cried all night into a pillow that smelled of feet.", "I cried quietly. Or so I thought. By morning, the whole wing was imitating my little sniffles."] }, fx: { happy: -8, fn: ({ life }) => { if (life.prison) life.prison.respect -= 8; } }, mood: 'cry' },
    ],
  },
];
