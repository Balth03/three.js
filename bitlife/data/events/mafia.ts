// Mafia & organised crime: joining a family, climbing from associate to boss, rats, feds, rivals, cartels.
// Progression flags: mf_associate → mf_made → mf_capo → mf_boss. Exits: mf_retired, mf_witsec (+ mf_newname).
import type { EventDef } from '@bl/sim';

type Range = [number, number];
const MOBSTER = { create: { role: 'acquaintance' as const, age: [5, 30] as Range, gender: 'any' as const } };
const GOON = { create: { role: 'acquaintance' as const, age: [20, 55] as Range, abs: true, gender: 'same' as const } };
const CIVILIAN = { create: { role: 'acquaintance' as const, age: [25, 70] as Range, abs: true, gender: 'any' as const } };
/** Adult of any gender, absolute age range. */
const adult = (min: number, max: number, gender: 'any' | 'm' | 'f' = 'any') => ({ create: { role: 'acquaintance' as const, age: [min, max] as Range, abs: true, gender } });
const CRUSH = { create: { role: 'acquaintance' as const, age: [0, 8] as Range, gender: 'attracted' as const } };
/** Exits from the life: once retired or in witness protection, the family events stop. */
const OUT = ['mf_retired', 'mf_witsec'];

export const mafiaEvents: EventDef[] = [
  // ───────────────────────────── entry points ─────────────────────────────
  {
    id: 'mf_auto_movies',
    icon: '🎬',
    cat: 'mafia',
    auto: true,
    cooldown: 6,
    weight: 4,
    when: { age: [16, 90], noFlag: 'mf_made' },
    text: {
      fr: [
        "J'ai regardé les trois films du Parrain d'affilée. J'ai passé la semaine à parler avec du coton dans les joues. Ma boulangère m'a demandé si j'avais une rage de dents.",
        "Après une série sur la mafia, j'ai commandé un expresso en faisant un geste de la main très lent. Le serveur m'a apporté l'addition. Respect.",
      ],
      en: [
        "I binge-watched all three Godfather movies. I spent the week talking with cotton balls in my cheeks. The barista asked if I needed a dentist.",
        "After a mob series, I ordered an espresso with a very slow hand gesture. The waiter brought me the check. Respect.",
      ],
    },
    fx: { happy: 3 },
  },
  {
    id: 'mf_approach',
    icon: '🎩',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'casino', mood: 'neutral' },
    when: { age: [18, 60], noFlag: ['mf_associate', 'mf_retired', 'mf_witsec'] },
    once: true,
    weight: 6,
    actor: MOBSTER,
    vars: { amount: [2000, 9000] },
    text: {
      fr: [
        "Au « club social » du quartier, où personne n'a jamais vu de jeu de cartes, {a.first} t'observe depuis trois semaines. Ce soir, {a:il|elle} pose un expresso devant toi : « T'as l'air débrouillard{|e}. On a des petites courses à faire. »",
        "{a.first}, chevalière grosse comme une noix et chemise ouverte jusqu'au nombril, te glisse {$amount} « pour le dérangement ». Tu n'as été dérangé{|e} par rien. « Justement. Ça commence comme ça. »",
      ],
      en: [
        "At the neighborhood “social club,” where nobody has ever seen a deck of cards, {a.first} has been watching you for three weeks. Tonight {a:he|she} sets down an espresso: “You look resourceful. We got some little errands.”",
        "{a.first}, pinky ring the size of a walnut, shirt unbuttoned to the navel, slips you {$amount} “for your trouble.” You had no trouble. “Exactly. That's how it starts.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Rejoindre la famille', en: 'Join the family' },
        text: { fr: "J'ai accepté. Première mission : aller chercher des cannoli et une enveloppe épaisse comme un annuaire. J'ai ramené les deux sans regarder. {a.first} m'a appelé{|e} « gamin{|e} ». C'est un compliment, apparemment.", en: "I said yes. First job: pick up cannoli and an envelope as thick as a phone book. I brought back both without peeking. {a.first} called me “kid.” Apparently that's a compliment." },
        fx: { money: 'amount', flag: 'mf_associate', counter: 'crimes', karma: -4, heat: 5, actorRole: 'friend', schedule: { key: 'mf_initiation', years: 1 }, visual: 'money' },
        mood: 'proud',
      },
      {
        label: { fr: "Prendre l'argent et filer", en: 'Take the cash and run' },
        out: [
          { w: 2, text: { fr: "J'ai empoché l'argent et je suis parti{|e} « aux toilettes ». Je ne suis jamais revenu{|e}. Je change de trottoir à chaque fois que je croise une Lancia.", en: "I pocketed the money and went “to the bathroom.” I never came back. I cross the street every time I see a Lincoln." }, fx: { money: 'amount', stress: 10, karma: -2 } },
          { w: 1, text: { fr: "J'ai pris l'argent et filé. Deux types m'ont rattrapé{|e} au coin de la rue, m'ont repris l'argent, plus mon portefeuille, plus une chaussure. Pourquoi une chaussure ?", en: "I took the money and bolted. Two guys caught me at the corner, took the money back, plus my wallet, plus one shoe. Why one shoe?" }, fx: { money: -200, health: -5, happy: -6 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Refuser poliment', en: 'Politely decline' },
        text: { fr: "J'ai dit non merci. {a.first} a haussé les épaules : « La porte est toujours ouverte. Enfin, la porte de devant. Celle de derrière, on en parle pas. »", en: "I said no thanks. {a.first} shrugged: “Door's always open. The front door, anyway. We don't talk about the back door.”" },
        fx: { karma: 2, stress: 3 },
      },
    ],
  },
  {
    id: 'mf_pizzeria_hire',
    icon: '🍕',
    cat: 'mafia',
    scene: { place: 'office', mood: 'neutral' },
    when: { age: [16, 40], noFlag: 'mf_pizzeria' },
    cooldown: 10,
    weight: 6,
    vars: { amount: [300, 1200] },
    text: {
      fr: [
        "Tu décroches un petit boulot à la pizzeria « Mamma Mia Bella Ciao ». Il n'y a jamais un client, le four est éteint, mais la caisse déborde. Le patron te paie {$amount} la semaine pour « faire semblant de pétrir ».",
        "La pizzeria du coin t'embauche. Le menu propose une seule pizza, à 4 000 balles la part. Le patron dit que c'est « artisanal ». Ton salaire : {$amount}, en liquide, dans une boîte à pizza.",
      ],
      en: [
        "You land a side job at “Mamma Mia Bella Ciao” pizzeria. Never a customer, the oven's always off, but the register is overflowing. The owner pays you {$amount} a week to “pretend to knead.”",
        "The corner pizzeria hires you. The menu has one pizza, at $4,000 a slice. The owner says it's “artisanal.” Your wage: {$amount}, cash, in a pizza box.",
      ],
    },
    choices: [
      {
        label: { fr: 'Ne pas poser de questions', en: 'Ask no questions' },
        text: { fr: "Je n'ai posé aucune question. J'ai pétri de l'air pendant des mois. J'ai des avant-bras de boulanger et une conscience un peu tiède.", en: "I asked zero questions. I kneaded thin air for months. I have baker's forearms and a lukewarm conscience." },
        fx: { money: 'amount', happy: 4, athletic: 2 },
      },
      {
        label: { fr: 'Demander où sont les clients', en: 'Ask about the customers' },
        out: [
          { w: 1, text: { fr: "J'ai demandé où étaient les clients. Le patron m'a fixé{|e} longtemps, puis m'a offert une augmentation « pour ma curiosité qui va disparaître ». Elle a disparu.", en: "I asked where the customers were. The owner stared at me for a long time, then gave me a raise “for my curiosity, which is going away now.” It went away." }, fx: { money: 'amount', stress: 4 } },
          { w: 1, text: { fr: "J'ai posé la question. Le lendemain, la pizzeria avait changé de nom, de patron et de pays. Il ne reste que le four, toujours froid.", en: "I asked. The next day the pizzeria had a new name, a new owner and a new country. Only the oven remains, still cold." }, fx: { happy: -3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire une vraie pizza', en: 'Bake a real pizza' },
        text: { fr: "J'ai allumé le four et fait une vraie margherita. Le patron a paniqué, deux types en costard ont débarqué, et finalement tout le monde l'a mangée en silence. Meilleur jour de ma vie professionnelle.", en: "I fired up the oven and made a real margherita. The owner panicked, two guys in suits showed up, and in the end everyone ate it in silence. Best day of my working life." },
        fx: { happy: 8, karma: 2 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'mf_street_gang',
    icon: '🧢',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'park', mood: 'angry' },
    when: { age: [16, 25], noFlag: ['mf_streetgang', 'mf_made'] },
    cooldown: 8,
    weight: 5,
    actor: { create: { role: 'acquaintance', age: [16, 23], abs: true, gender: 'same' } },
    text: {
      fr: [
        "{a.first}, chef autoproclamé du gang « Les Vipères du Parking Lidl », te propose d'entrer dans la bande. Rite d'initiation : te faire tabasser 13 secondes par tout le monde. {a:Il|Elle} compte très lentement.",
        "Un gang local te recrute. Le nom du gang change chaque semaine selon l'humeur de {a.first}. Cette semaine c'est « Les Requins Mortels ». La semaine dernière, c'était « Les Bisous ».",
      ],
      en: [
        "{a.first}, self-proclaimed leader of the “Walmart Parking Lot Vipers,” offers to jump you in. Initiation: getting beaten by everybody for 13 seconds. {a:He|She} counts very slowly.",
        "A local gang is recruiting you. The gang's name changes weekly depending on {a.first}'s mood. This week it's “The Deadly Sharks.” Last week it was “The Smooches.”",
      ],
    },
    choices: [
      {
        label: { fr: "Encaisser l'initiation", en: 'Take the beating' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "Treize secondes qui en ont duré quarante, parce que {a.first} a perdu le compte. Une côte fêlée, un œil au beurre noir, et un bandana officiel. Je fais partie de quelque chose.", en: "Thirteen seconds that lasted forty, because {a.first} lost count. A cracked rib, a black eye, and an official bandana. I belong to something now." }, fx: { health: -8, happy: 6, flag: 'mf_streetgang', counter: 'crimes', heat: 5, actorRole: 'friend' }, mood: 'proud' },
          { w: 1, text: { fr: "Je me suis évanoui{|e} à la seconde 4. Ils m'ont quand même accepté{|e}, par pitié. Mon surnom officiel est « Seconde-Quatre ».", en: "I passed out at second four. They let me in anyway, out of pity. My official street name is “Second Four.”" }, fx: { health: -10, looks: -3, flag: 'mf_streetgang', actorRole: 'friend' }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Négocier 5 secondes', en: 'Haggle to 5 seconds' },
        text: { fr: "J'ai négocié à 5 secondes, puis à une tape dans le dos, puis à un selfie de groupe. Je suis membre honoraire. Je n'ai aucun pouvoir.", en: "I haggled down to 5 seconds, then to a pat on the back, then to a group selfie. I'm an honorary member. I have no power." },
        fx: { happy: 3, flag: 'mf_streetgang' },
      },
      {
        label: { fr: 'Passer ton chemin', en: 'Walk away' },
        text: { fr: "J'ai dit non. Ils m'ont traité{|e} de « bouffon » pendant six mois. Le gang a été démantelé quand la mère de {a.first} l'a privé de console.", en: "I said no. They called me a clown for six months. The gang disbanded when {a.first}'s mom took away the gaming console." },
        fx: { karma: 2, happy: -1 },
      },
    ],
  },
  {
    id: 'mf_biker_bar',
    icon: '🏍️',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'party', mood: 'neutral' },
    when: { age: [18, 60], noFlag: 'mf_biker' },
    cooldown: 10,
    weight: 5,
    actor: GOON,
    text: {
      fr: [
        "Dans un bar de motards qui sent l'huile de vidange et la bière tiède, {a.first}, barbe tressée jusqu'à la ceinture, te tend un gilet en cuir marqué « PROSPECT ». « Les Chacals de l'Enfer cherchent du sang neuf. »",
        "Tu as rayé une Harley sur le parking. Son propriétaire, {a.first}, 140 kilos de tatouages, te propose deux options : payer, ou devenir prospect chez les Chacals de l'Enfer.",
      ],
      en: [
        "In a biker bar smelling of motor oil and warm beer, {a.first}, beard braided down to the belt, hands you a leather vest marked “PROSPECT.” “The Hell Jackals need fresh blood.”",
        "You scratched a Harley in the parking lot. Its owner, {a.first}, 300 pounds of tattoos, offers two options: pay up, or become a prospect for the Hell Jackals.",
      ],
    },
    choices: [
      {
        label: { fr: 'Enfiler le gilet', en: 'Put on the vest' },
        text: { fr: "J'ai enfilé le gilet. Pendant un an, j'ai lavé des motos, ramené des bières et écouté des solos de guitare de 14 minutes. Je suis officiellement un Chacal. Je ne sais toujours pas conduire de moto.", en: "I put on the vest. For a year I washed bikes, fetched beers and endured 14-minute guitar solos. I'm officially a Jackal. I still can't ride a motorcycle." },
        fx: { flag: 'mf_biker', happy: 5, karma: -2, counter: 'crimes', actorRole: 'friend' },
        mood: 'proud',
      },
      {
        label: { fr: 'Payer la rayure', en: 'Pay for the scratch' },
        text: { fr: "J'ai payé 2 000 balles pour une rayure invisible à l'œil nu. {a.first} m'a tapé dans le dos si fort que j'ai craché mon chewing-gum à trois mètres.", en: "I paid two grand for a scratch invisible to the naked eye. {a.first} slapped my back so hard I spat my gum ten feet." },
        fx: { money: -2000, happy: -3 },
      },
      {
        label: { fr: 'Le défier au bras de fer', en: 'Challenge to arm wrestling' },
        out: [
          { w: 1, odds: { athletic: 2 }, text: { fr: "J'ai gagné au bras de fer. Silence total dans le bar. {a.first} a pleuré, puis m'a offert sa moto. J'ai refusé, j'ai pris le gilet.", en: "I won the arm wrestle. Dead silence in the bar. {a.first} cried, then offered me {a:his|her} bike. I declined and took the vest." }, fx: { flag: 'mf_biker', happy: 10, athletic: 3, actorRole: 'friend' }, mood: 'proud' },
          { w: 2, text: { fr: "Mon bras a fait un bruit de branche morte. J'ai payé la rayure, plus les urgences, plus la tournée générale qu'apparemment j'avais promise.", en: "My arm made a dead-branch noise. I paid for the scratch, plus the ER, plus the round I apparently promised everyone." }, fx: { money: -2500, health: -10, disease: 'sprain' }, mood: 'sick' },
        ],
      },
    ],
  },
  {
    id: 'mf_wedding_waiter',
    icon: '💒',
    cat: 'mafia',
    scene: { place: 'villa', mood: 'party', fx: 'confetti' },
    when: { age: [16, 70] },
    cooldown: 12,
    weight: 5,
    vars: { amount: [200, 1500] },
    text: {
      fr: [
        "Tu fais l'extra comme serveur{|se} à un mariage italien. 400 invités, dont 61 s'appellent Tony. Le père de la mariée reçoit les gens un par un dans son bureau, comme un dentiste.",
        "Mariage dans une villa. Les invités offrent des enveloppes, pas de cadeaux. Un monsieur t'en glisse une par erreur. Elle contient {$amount}. Il te regarde.",
      ],
      en: [
        "You're a temp waiter at an Italian wedding. 400 guests, 61 of them named Tony. The bride's father sees people one by one in his study, like a dentist.",
        "Wedding at a villa. Guests give envelopes, not gifts. A gentleman slips you one by mistake. It holds {$amount}. He's looking at you.",
      ],
    },
    choices: [
      {
        label: { fr: "Rendre l'enveloppe", en: 'Return the envelope' },
        text: { fr: "J'ai rendu l'enveloppe. Le monsieur m'a pincé la joue et m'a dit que j'avais « une bonne mère ». J'ai eu double part de tiramisu. L'honnêteté paie, en mascarpone.", en: "I returned the envelope. The man pinched my cheek and said I had “a good mother.” I got double tiramisu. Honesty pays, in mascarpone." },
        fx: { karma: 5, happy: 5 },
        mood: 'happy',
      },
      {
        label: { fr: 'Garder discrètement', en: 'Keep it quietly' },
        out: [
          { w: 2, text: { fr: "J'ai gardé l'enveloppe dans mon tablier. Personne n'a rien remarqué. J'ai servi le reste de la soirée en transpirant comme une mozzarella au soleil.", en: "I kept the envelope in my apron. Nobody noticed. I served the rest of the night sweating like a mozzarella in the sun." }, fx: { money: 'amount', karma: -4, stress: 6 } },
          { w: 1, text: { fr: "J'ai gardé l'enveloppe. À minuit, trois Tony m'ont gentiment demandé de vider mes poches. Puis de partir. Puis de changer de ville. J'ai gardé ma ville.", en: "I kept it. At midnight, three Tonys politely asked me to empty my pockets. Then to leave. Then to leave town. I kept my town." }, fx: { karma: -3, stress: 10, happy: -4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Danser la tarentelle', en: 'Join the tarantella' },
        text: { fr: "J'ai lâché mon plateau pour danser la tarentelle. Une grand-mère de 90 ans m'a fait tourner jusqu'à la nausée. J'ai été viré{|e}, mais adopté{|e} par la famille.", en: "I dropped my tray to dance the tarantella. A 90-year-old grandma spun me to the point of nausea. I got fired, but adopted by the family." },
        fx: { happy: 8, athletic: 2 },
        mood: 'party',
      },
    ],
  },
  {
    id: 'mf_loan_shark',
    icon: '🦈',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'casino', mood: 'neutral', fx: 'money' },
    when: { age: [18, 80], money: [-1e9, 3000], noFlag: 'mf_owes' },
    cooldown: 8,
    weight: 6,
    actor: MOBSTER,
    vars: { amount: [3000, 15000] },
    text: {
      fr: [
        "Fauché{|e}, tu atterris dans l'arrière-boutique d'un pressing qui ne nettoie rien. {a.first} te propose {$amount}. Le taux d'intérêt ? « Raisonnable. » {a:Il|Elle} fait craquer ses jointures en le disant.",
        "{a.first}, surnommé{|e} « le Requin », prête de l'argent à tout le quartier. {a:Il|Elle} te propose {$amount}, remboursable « quand tu peux, mais tu peux l'année prochaine ».",
      ],
      en: [
        "Broke, you end up in the back room of a dry cleaner that cleans nothing. {a.first} offers you {$amount}. The interest rate? “Reasonable.” {a:He|She} cracks {a.his} knuckles while saying it.",
        "{a.first}, known as “the Shark,” lends money to the whole neighborhood. {a:He|She} offers you {$amount}, payable “whenever you can, and you can next year.”",
      ],
    },
    choices: [
      {
        label: { fr: "Prendre l'argent", en: 'Take the money' },
        text: { fr: "J'ai pris l'argent. C'était merveilleux pendant onze mois. Le douzième mois, j'ai commencé à entendre le thème des Dents de la mer dans ma tête.", en: "I took the money. It was wonderful for eleven months. In the twelfth month I started hearing the Jaws theme in my head." },
        fx: { money: 'amount', flag: 'mf_owes', stress: 8, keep: true, schedule: { key: 'mf_shark_collect', years: 1 }, visual: 'money' },
      },
      {
        label: { fr: 'Non merci', en: 'No thanks' },
        text: { fr: "J'ai refusé. J'ai mangé des pâtes au ketchup tout l'hiver, mais avec mes dix doigts.", en: "I said no. I ate ketchup pasta all winter, but with all ten fingers." },
        fx: { happy: -2, karma: 1 },
      },
    ],
  },
  {
    id: 'mf_witness_hit',
    icon: '🍝',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'party', mood: 'shock', fx: 'police' },
    when: { age: [16, 85], noFlag: ['mf_witness', 'mf_made'] },
    once: true,
    weight: 4,
    vars: { amount: [5000, 25000] },
    text: {
      fr: [
        "Dans les toilettes d'un restaurant italien, tu assistes à un règlement de comptes. Le type d'en face te regarde, range son « outil » et dit : « T'as rien vu. Ça vaut {$amount} de rien voir. »",
        "Tu manges des lasagnes quand deux hommes en costume abattent un client entre le fromage et le dessert. Tout le monde continue de manger. Le serveur te demande si tu veux du parmesan.",
      ],
      en: [
        "In an Italian restaurant bathroom, you witness a mob hit. The guy turns, puts away his “tool” and says: “You didn't see nothin'. Not seeing nothin' is worth {$amount}.”",
        "You're eating lasagna when two men in suits whack a customer between the cheese course and dessert. Everyone keeps eating. The waiter asks if you'd like parmesan.",
      ],
    },
    choices: [
      {
        label: { fr: 'Témoigner à la police', en: 'Tell the police' },
        text: { fr: "J'ai tout raconté à la police. L'inspecteur m'a remercié{|e}, puis m'a dit : « Vous êtes très courageux{|se}. Ou très bête. On verra l'année prochaine. »", en: "I told the police everything. The detective thanked me, then said: “You're very brave. Or very stupid. We'll find out next year.”" },
        fx: { karma: 8, stress: 10, flag: 'mf_witness', schedule: { key: 'mf_witness_visit', years: 1 }, visual: 'police' },
        mood: 'proud',
      },
      {
        label: { fr: "Accepter l'argent", en: 'Take the hush money' },
        text: { fr: "J'ai pris l'argent et j'ai développé une amnésie très sélective. Je ne me souviens même plus du goût des lasagnes.", en: "I took the money and developed very selective amnesia. I can't even remember how the lasagna tasted." },
        fx: { money: 'amount', karma: -6, stress: 4, visual: 'money' },
      },
      {
        label: { fr: 'Demander du parmesan', en: 'Ask for parmesan' },
        text: { fr: "J'ai demandé du parmesan et fini mon assiette. Le chef est venu me serrer la main. Je suis désormais « quelqu'un de bien » pour des gens qui ne sont pas des gens bien.", en: "I asked for parmesan and finished my plate. The chef came to shake my hand. I am now “good people” to people who are not good people." },
        fx: { happy: 2, karma: -2 },
      },
    ],
  },
  {
    id: 'mf_romance_meet',
    icon: '🌹',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'party', mood: 'love', fx: 'hearts' },
    when: { age: [18, 45], noFlag: 'mf_romance', noHas: 'spouse' },
    once: true,
    weight: 5,
    actor: CRUSH,
    text: {
      fr: [
        "En boîte, tu flashes sur {a.first}. Beau sourire, rire contagieux, et quatre gardes du corps qui te fixent depuis le bar. {a:Son|Sa} père est Don Vittorio, le parrain de la ville.",
        "{a.first} te bouscule, renverse ton verre et t'en offre une bouteille entière. Charme fou. Petit détail : à chaque fois que tu {a:le|la} touches, un type au fond de la salle sort un cure-dent menaçant.",
      ],
      en: [
        "At a club, you fall for {a.first}. Great smile, contagious laugh, and four bodyguards staring at you from the bar. {a:His|Her} father is Don Vittorio, the city's godfather.",
        "{a.first} bumps into you, spills your drink and buys you a whole bottle. Insanely charming. Small detail: whenever you touch {a.him}, a guy in the back pulls out a menacing toothpick.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tenter ta chance', en: 'Shoot your shot' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: "J'ai dansé avec {a.first} toute la nuit. Au petit matin, un garde du corps m'a tendu une carte : « Le Don veut te rencontrer. Mets une chemise. »", en: "I danced with {a.first} all night. At dawn, a bodyguard handed me a card: “The Don wants to meet you. Wear a shirt.”" }, fx: { happy: 12, flag: 'mf_romance', actorRole: 'partner', rel: 20, visual: 'hearts' }, mood: 'love' },
          { w: 1, text: { fr: "J'ai tenté un baiser. Les quatre gardes du corps m'ont soulevé{|e} et posé{|e} délicatement dans une poubelle. {a.first} m'a quand même laissé son numéro sur le couvercle.", en: "I went for a kiss. All four bodyguards lifted me up and gently placed me in a dumpster. {a.first} still left a number on the lid." }, fx: { happy: 4, looks: -2, flag: 'mf_romance', actorRole: 'partner', rel: 10 }, mood: 'love' },
        ],
      },
      {
        label: { fr: 'Fuir ce red flag', en: 'Flee the red flag' },
        text: { fr: "J'ai fui. Je repense souvent à ce sourire. Et aux cure-dents.", en: "I ran. I often think about that smile. And the toothpicks." },
        fx: { happy: -3 },
      },
    ],
  },
  {
    id: 'mf_heist_ad',
    icon: '🗝️',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'office', mood: 'neutral' },
    when: { age: [18, 65], noFlag: 'mf_heist_crew' },
    cooldown: 10,
    weight: 4,
    actor: MOBSTER,
    text: {
      fr: [
        "Petite annonce : « Cherche chauffeur discret, nerfs d'acier, permis non obligatoire. » Au rendez-vous, {a.first} étale sur une table de ping-pong les plans d'un fourgon blindé.",
        "{a.first}, vieux braqueur à la retraite, veut faire « un dernier coup ». {a:Il|Elle} le dit depuis 1987. Cette fois, {a:il|elle} a une équipe, un plan et une maquette en pâte à sel.",
      ],
      en: [
        "Classified ad: “Seeking discreet driver, nerves of steel, license optional.” At the meet, {a.first} spreads plans for an armored truck across a ping-pong table.",
        "{a.first}, a retired robber, wants “one last job.” {a:He|She} has been saying it since 1987. This time there's a crew, a plan and a scale model made of salt dough.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rejoindre le crew', en: 'Join the crew' },
        text: { fr: "J'ai serré la main de {a.first}. On se retrouve ce soir pour planifier. J'ai apporté un carnet à spirale, pour faire sérieux.", en: "I shook {a.first}'s hand. We meet tonight to plan. I brought a spiral notebook to look professional." },
        fx: { flag: 'mf_heist_crew', stress: 4, chain: 'mf_heist_plan' },
        mood: 'proud',
      },
      {
        label: { fr: 'Décliner', en: 'Decline' },
        text: { fr: "J'ai décliné. {a.first} a soupiré : « Encore un qui croit à la retraite. » {a:Il|Elle} a remballé sa maquette en pâte à sel avec beaucoup de dignité.", en: "I declined. {a.first} sighed: “Another one who believes in retirement.” The salt-dough model was packed away with great dignity." },
        fx: { karma: 1 },
      },
    ],
  },
  {
    id: 'mf_backfire',
    icon: '🚗',
    cat: 'mafia',
    scene: { place: 'party', mood: 'shock' },
    when: { age: [16, 90] },
    cooldown: 12,
    weight: 4,
    text: {
      fr: [
        "Ta vieille voiture pétarade devant une trattoria. Instantanément, onze hommes en costume plongent sous les tables, dont un qui se cache derrière un gressin.",
        "Ton pot d'échappement fait « BANG » sur le parking d'un restaurant italien. Le patron sort, les mains en l'air, en criant : « J'ai payé ! J'ai payé ce mois-ci ! »",
      ],
      en: [
        "Your old car backfires outside a trattoria. Instantly eleven men in suits dive under the tables, one of them hiding behind a breadstick.",
        "Your exhaust goes BANG in an Italian restaurant parking lot. The owner runs out, hands up, yelling: “I paid! I paid this month!”",
      ],
    },
    choices: [
      {
        label: { fr: "S'excuser", en: 'Apologize' },
        text: { fr: "Je me suis excusé{|e} platement. Les messieurs se sont relevés, ont épousseté leurs costumes et m'ont offert un limoncello. Pour les nerfs. Les leurs.", en: "I apologized profusely. The gentlemen got up, dusted off their suits and bought me a limoncello. For the nerves. Theirs." },
        fx: { happy: 4, karma: 1 },
      },
      {
        label: { fr: 'Recommencer', en: 'Do it again' },
        text: { fr: "J'ai fait pétarader une deuxième fois. Personne n'a ri. Un monsieur a noté ma plaque dans un petit carnet en cuir. J'ai vendu la voiture le lendemain.", en: "I backfired it again. Nobody laughed. A gentleman wrote down my plate in a little leather notebook. I sold the car the next day." },
        fx: { stress: 8, happy: 2 },
        mood: 'shock',
      },
    ],
  },
  {
    id: 'mf_nonna_cannoli',
    icon: '🥐',
    cat: 'mafia',
    scene: { place: 'home', mood: 'neutral' },
    when: { age: [16, 80] },
    cooldown: 10,
    weight: 5,
    actor: { create: { role: 'acquaintance', age: [55, 90], abs: true, gender: 'f' } },
    text: {
      fr: [
        "Nonna {a.first}, 84 ans, mère de « gens importants » du quartier, te fait goûter ses cannoli. Toute la famille retient son souffle. Le dernier qui a dit « un peu sec » vit maintenant en Belgique.",
        "La grand-mère des {a.last}, une famille dont on ne prononce le nom qu'à voix basse, t'invite à déjeuner. Elle te sert une assiette de pâtes de la taille d'une roue de tracteur. « Mange. »",
      ],
      en: [
        "Nonna {a.first}, 84, mother of some “important people” in the neighborhood, has you taste her cannoli. The whole family holds its breath. The last guy who said “a bit dry” now lives in Belgium.",
        "Grandma {a.last}, from a family whose name is only whispered, invites you to lunch. She serves you a plate of pasta the size of a tractor tire. “Eat.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout finir', en: 'Clean the plate' },
        text: { fr: "J'ai tout fini. Puis la deuxième assiette. Puis la troisième. Nonna m'a béni{|e} en italien. Toute la famille me salue maintenant dans la rue. J'ai pris trois kilos de respect.", en: "I finished it all. Then a second plate. Then a third. Nonna blessed me in Italian. The whole family greets me in the street now. I gained seven pounds of respect." },
        fx: { happy: 6, weight: 0.03, rel: 20, keep: true, flag: 'mf_known' },
        mood: 'happy',
      },
      {
        label: { fr: 'Dire la vérité', en: 'Be honest' },
        out: [
          { w: 1, text: { fr: "J'ai dit que c'était un peu sec. Silence de mort. Puis Nonna a éclaté de rire : « Enfin quelqu'un qui a des couilles ! » Elle m'a donné sa recette secrète. C'était du beurre. Plus de beurre.", en: "I said they were a bit dry. Dead silence. Then Nonna burst out laughing: “Finally, someone with guts!” She gave me her secret recipe. It was butter. More butter." }, fx: { happy: 8, smarts: 2, rel: 25, keep: true, flag: 'mf_known' }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai dit que c'était un peu sec. Nonna a posé sa cuillère. Ses petits-fils ont posé leurs fourchettes. Je suis parti{|e} en marche arrière, très lentement.", en: "I said they were a bit dry. Nonna put down her spoon. Her grandsons put down their forks. I backed out very, very slowly." }, fx: { stress: 10, happy: -4 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'mf_cartel_vacation',
    icon: '🌵',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'beach', mood: 'shock' },
    when: { age: [18, 70], noFlag: 'mf_cartel' },
    cooldown: 12,
    weight: 3,
    vars: { amount: [8000, 40000] },
    text: {
      fr: [
        "En vacances au Mexique, un homme en chemise à fleurs te tend une mallette à l'aéroport : « Pour El Pollo. Comme prévu, amigo. » Tu n'as rien prévu du tout.",
        "Tu portes par hasard le même chapeau que le contact d'un cartel. Un pick-up s'arrête, la portière s'ouvre : « Monte. El Pollo t'attend. » Il y a un mariachi sur la banquette arrière.",
      ],
      en: [
        "On vacation in Mexico, a man in a floral shirt hands you a briefcase at the airport: “For El Pollo. As planned, amigo.” You planned nothing.",
        "You happen to wear the same hat as a cartel contact. A pickup pulls over, the door opens: “Get in. El Pollo is waiting.” There's a mariachi in the back seat.",
      ],
    },
    choices: [
      {
        label: { fr: 'Jouer le jeu', en: 'Play along' },
        out: [
          { w: 2, text: { fr: "J'ai joué le jeu. El Pollo, un petit monsieur adorable avec un tigre en laisse, m'a payé {$amount} et m'a appelé « mi hijo ». Il veut me revoir.", en: "I played along. El Pollo, a sweet little man with a leashed tiger, paid me {$amount} and called me “mi hijo.” He wants to see me again." }, fx: { money: 'amount', flag: 'mf_cartel', counter: 'crimes', karma: -6, heat: 10, visual: 'money' }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai joué le jeu jusqu'à ce que le vrai contact arrive avec le même chapeau. On s'est regardés. J'ai couru dans le désert pendant six heures. J'ai bu l'eau d'un cactus. C'était un cactus décoratif.", en: "I played along until the real contact showed up in the same hat. We stared at each other. I ran through the desert for six hours. I drank water from a cactus. It was a decorative cactus." }, fx: { health: -10, happy: -5, stress: 10 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Rendre la mallette', en: 'Give it back' },
        text: { fr: "J'ai rendu la mallette avec un « lo siento ». Le type m'a regardé{|e} comme un malade et m'a offert une tequila. J'ai passé le reste des vacances à l'hôtel, rideaux tirés.", en: "I handed it back with a “lo siento.” The guy looked at me like I was insane and bought me a tequila. I spent the rest of the vacation in my hotel room, curtains closed." },
        fx: { karma: 2, stress: 5 },
      },
    ],
  },
  {
    id: 'mf_prison_don',
    icon: '👴',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'prison', mood: 'neutral' },
    when: { prison: true, age: [18, 80], noFlag: 'mf_associate' },
    cooldown: 10,
    weight: 6,
    actor: { create: { role: 'acquaintance', age: [65, 90], abs: true, gender: 'm' } },
    text: {
      fr: [
        "Au réfectoire, un vieil homme mange un osso buco qui n'est pas au menu. C'est Don {a.last}, 79 ans, trois perpétuités. Il te fait signe d'approcher. Les gardiens lui apportent son café.",
        "Le détenu le plus respecté de la prison, Don {a.first} {a.last}, a une télé à écran plat, un aquarium et un majordome qui purge 12 ans pour fraude. Il veut te parler.",
      ],
      en: [
        "In the mess hall, an old man eats an osso buco that's not on the menu. It's Don {a.last}, 79, three life sentences. He beckons you over. The guards bring him his coffee.",
        "The most respected inmate, Don {a.first} {a.last}, has a flat-screen TV, an aquarium and a butler doing 12 years for fraud. He wants a word.",
      ],
    },
    choices: [
      {
        label: { fr: 'Lui baiser la bague', en: 'Kiss the ring' },
        text: { fr: "J'ai baisé la bague du Don. Depuis, personne ne me touche, j'ai du parmesan dans ma cellule, et à ma sortie « des amis » m'attendront. Il m'a appelé{|e} « {figlio mio|figlia mia} ».", en: "I kissed the Don's ring. Since then nobody touches me, I have parmesan in my cell, and when I get out “friends” will be waiting. He called me his kid." },
        fx: { flag: 'mf_associate', happy: 8, karma: -3, actorRole: 'friend', schedule: { key: 'mf_initiation', years: 2 } },
        mood: 'proud',
      },
      {
        label: { fr: 'Rester neutre', en: 'Stay neutral' },
        text: { fr: "Je suis resté{|e} poli{|e} mais distant{|e}. Le Don a hoché la tête : « Un homme prudent vit vieux. » Puis il a fait tabasser mon voisin de cellule, pour l'exemple.", en: "I stayed polite but distant. The Don nodded: “A careful man lives long.” Then he had my neighbor beaten up, as an example." },
        fx: { stress: 4 },
      },
    ],
  },
  {
    id: 'mf_karma_offer',
    icon: '🤝',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'apartment', mood: 'sad' },
    when: { age: [18, 70], stat: { karma: [0, 50] }, noFlag: ['mf_associate', 'mf_witsec'] },
    cooldown: 10,
    weight: 4,
    actor: MOBSTER,
    vars: { amount: [3000, 12000] },
    text: {
      fr: [
        "Tu traverses une sale période. {a.first}, un « homme d'affaires » de ta rue, t'apporte des courses, paie ton loyer et t'offre {$amount}. « Un jour, je te demanderai un service. Peut-être. Ou pas. Sûrement. »",
        "Ton propriétaire te menace d'expulsion. Le lendemain, il t'appelle en pleurant pour s'excuser. Il a deux bras dans le plâtre. {a.first}, ton voisin, te fait un clin d'œil depuis sa fenêtre.",
      ],
      en: [
        "You're going through a rough patch. {a.first}, a “businessman” from your street, brings groceries, pays your rent and offers {$amount}. “Someday I'll ask you for a favor. Maybe. Or not. Probably.”",
        "Your landlord threatens to evict you. The next day he calls, sobbing, to apologize. Both his arms are in casts. {a.first}, your neighbor, winks at you from a window.",
      ],
    },
    choices: [
      {
        label: { fr: 'Accepter le service', en: 'Accept the favor' },
        text: { fr: "J'ai accepté. Je dois maintenant un service à {a.first}. Je ne sais pas lequel. Je dors avec une liste de mes compétences sous l'oreiller.", en: "I accepted. Now I owe {a.first} a favor. I don't know which one. I sleep with a list of my skills under my pillow." },
        fx: { money: 'amount', happy: 6, flag: 'mf_associate', karma: -3, actorRole: 'friend', schedule: { key: 'mf_initiation', years: 2 } },
      },
      {
        label: { fr: 'Refuser fermement', en: 'Firmly refuse' },
        text: { fr: "J'ai refusé. {a.first} a souri tristement et m'a quand même laissé un plat de lasagnes. Elles étaient incroyables. Je me sens redevable quand même.", en: "I refused. {a.first} smiled sadly and left me a tray of lasagna anyway. It was incredible. I still feel indebted." },
        fx: { karma: 3, happy: 2 },
      },
    ],
  },

  // ───────────────────────────── climbing the ladder ─────────────────────────────
  {
    id: 'mf_initiation',
    icon: '🩸',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'office', mood: 'neutral' },
    when: { age: [16, 80], flag: 'mf_associate', noFlag: ['mf_made', ...OUT] },
    cooldown: 2,
    weight: 25,
    actor: MOBSTER,
    vars: { amount: [5000, 20000] },
    text: {
      fr: [
        "L'heure du test. {a.first} t'envoie récupérer {$amount} chez Gino, fleuriste, qui doit de l'argent depuis deux ans et qui, selon le boss, « a pris la confiance ». Si tu ramènes l'argent, tu deviens quelqu'un.",
        "« Tu veux devenir quelqu'un ? Pour de vrai ? » {a.first} te tend une adresse : celle de Gino le fleuriste, qui doit {$amount} et qui a eu le culot d'acheter un jacuzzi avec.",
      ],
      en: [
        "Test time. {a.first} sends you to collect {$amount} from Gino, a florist who's owed money for two years and who, according to the boss, “got comfortable.” Bring back the money and you become somebody.",
        "“You wanna be made? For real?” {a.first} hands you an address: Gino the florist's, who owes {$amount} and had the nerve to buy a hot tub with it.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire peur avec style', en: 'Intimidate with style' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "Je suis entré{|e}, j'ai arraché un pétale de rose très lentement en fixant Gino dans les yeux. Il a payé en pleurant. {a.first} a dit : « Ce soir, on fait la cérémonie. »", en: "I walked in and slowly plucked a single rose petal while staring Gino in the eye. He paid, sobbing. {a.first} said: “Tonight, we do the ceremony.”" }, fx: { money: 'amount', flag: 'mf_made', counter: 'crimes', karma: -6, heat: 8, chain: 'mf_made_ceremony', visual: 'money' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai essayé d'avoir l'air menaçant{|e}. Gino m'a proposé un bouquet « pour ma maman ». Je l'ai pris. Je suis reparti{|e} sans l'argent. {a.first} m'a regardé{|e} comme une plante verte.", en: "I tried to look menacing. Gino offered me a bouquet “for my mom.” I took it. I left without the money. {a.first} looked at me like I was a houseplant." }, fx: { happy: -5, stress: 6 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Le jacuzzi, à la batte', en: 'Bat the hot tub' },
        rating: 2,
        text: { fr: "J'ai défoncé le jacuzzi à coups de batte. Un geyser d'eau chaude a ébouillanté le caniche de Gino, qui a traversé le salon en hurlant comme une bouilloire. Gino a payé avant même que je pose la question. Cérémonie ce soir.", en: "I beat the hot tub to death with a bat. A geyser of boiling water scalded Gino's poodle, which ran screaming through the living room like a kettle. Gino paid before I even asked. Ceremony tonight." },
        fx: { money: 'amount', flag: 'mf_made', counter: 'crimes', karma: -10, heat: 12, chain: 'mf_made_ceremony', visual: 'money' },
        mood: 'proud',
      },
      {
        label: { fr: 'Prévenir la victime', en: 'Warn the victim' },
        out: [
          { w: 1, text: { fr: "J'ai prévenu Gino de quitter la ville. Il m'a embrassé{|e} sur le front. La famille m'a viré{|e} sans un mot, ce qui est pire qu'avec des mots.", en: "I told Gino to skip town. He kissed my forehead. The family dropped me without a word, which is worse than with words." }, fx: { karma: 10, unflag: 'mf_associate', stress: 8 } },
          { w: 1, text: { fr: "J'ai prévenu Gino. {a.first} et la famille l'a su dans l'heure. On m'a rendu visite pour une « petite discussion » qui a duré deux côtes et une incisive.", en: "I warned Gino. {a.first} and the family knew within the hour. I got a visit for a “little chat” that cost two ribs and an incisor." }, fx: { karma: 8, health: -12, looks: -4, unflag: 'mf_associate' }, mood: 'sick' },
        ],
      },
    ],
  },
  {
    id: 'mf_made_ceremony',
    icon: '🕯️',
    cat: 'mafia',
    rating: 1,
    chainOnly: true,
    scene: { place: 'mansion', mood: 'proud' },
    text: {
      fr: [
        "Sous-sol enfumé, douze hommes en costume. On te pique le doigt, on fait couler une goutte de sang sur une image de saint, on la brûle dans tes mains. « Si tu trahis, tu brûles comme ce saint. » Ça pique vraiment beaucoup.",
        "La cérémonie. Le boss récite un serment en sicilien. Tu ne comprends pas un mot mais tu hoches la tête avec gravité. Quelqu'un au fond mange des chips.",
      ],
      en: [
        "Smoky basement, twelve men in suits. They prick your finger, drip blood on a saint card and set it on fire in your cupped hands. “Betray us and you burn like this saint.” It really, really stings.",
        "The ceremony. The boss recites an oath in Sicilian. You don't understand a word but you nod solemnly. Someone in the back is eating chips.",
      ],
    },
    choices: [
      {
        label: { fr: "Jurer l'omertà", en: 'Swear omertà' },
        text: { fr: "J'ai juré l'omertà avec la voix qui tremble. Je suis un homme fait{|e}. Enfin, « fait{|e} ». Tout le monde m'a embrassé{|e} sur les deux joues. Douze fois. J'ai la joue en feu, et la main aussi.", en: "I swore omertà with a shaky voice. I'm made. Everybody kissed me on both cheeks. Twelve times. My cheeks are burning, and so is my hand." },
        fx: { happy: 12, discipline: 5, karma: -4, disease: 'burns', counter: 'crimes' },
        mood: 'proud',
      },
      {
        label: { fr: 'Lâcher la carte en feu', en: 'Drop the burning card' },
        text: { fr: "J'ai lâché la carte en hurlant. Elle est tombée sur le pantalon du consigliere, qui a pris feu. On l'a éteint au limoncello, ce qui n'est pas une bonne idée. J'ai quand même été accepté{|e}. Mon surnom : « Mains-de-Beurre ».", en: "I dropped the card, screaming. It landed on the consigliere's pants, which caught fire. They put him out with limoncello, which is not a good idea. I still got in. My nickname: “Butterfingers.”" },
        fx: { happy: 6, karma: -4, counter: 'crimes', visual: 'fire' },
        mood: 'shock',
      },
    ],
  },
  {
    id: 'mf_capo_promotion',
    icon: '🎖️',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'mansion', mood: 'proud', fx: 'money' },
    when: { age: [21, 85], flag: 'mf_made', noFlag: ['mf_capo', ...OUT], counter: { crimes: [4, 999] } },
    cooldown: 3,
    weight: 20,
    actor: GOON,
    vars: { amount: [30000, 120000] },
    text: {
      fr: [
        "Le boss te convoque dans son jardin, entre deux tomates. « T'as fait du bon boulot. Je te donne une équipe. » Ton équipe : {a.first} et quatre gars qui s'appellent tous Sal. Tu es capo.",
        "Ton capo a « pris sa retraite » au fond d'un lac. Le boss te propose sa place, son équipe et son bureau, qui sent encore son eau de Cologne. {a.first} sera ton bras droit.",
      ],
      en: [
        "The boss calls you into his garden, between two tomato plants. “You done good. I'm giving you a crew.” Your crew: {a.first} and four guys all named Sal. You're a capo.",
        "Your capo “retired” to the bottom of a lake. The boss offers you his spot, his crew and his office, which still smells of his cologne. {a.first} will be your right hand.",
      ],
    },
    choices: [
      {
        label: { fr: 'Accepter avec honneur', en: 'Accept with honor' },
        text: { fr: "J'ai baisé la main du boss et accepté. Ma part des recettes : {$amount} dès la première année. {a.first} m'appelle « chef ». Les quatre Sal aussi, en chœur.", en: "I kissed the boss's hand and accepted. My cut: {$amount} the first year. {a.first} calls me “boss.” So do the four Sals, in unison." },
        fx: { flag: 'mf_capo', money: 'amount', happy: 10, fame: 3, heat: 10, actorRole: 'friend', visual: 'money' },
        mood: 'proud',
      },
      {
        label: { fr: 'Exiger un meilleur %', en: 'Demand a bigger cut' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai demandé 5 % de plus. Le boss a ri, longtemps, puis a accepté. « T'as des couilles. Ça me rappelle moi, avant mon pontage. » Je touche le double.", en: "I asked for 5% more. The boss laughed for a long time, then agreed. “You got guts. Reminds me of me, before my bypass.” I make double." }, fx: { flag: 'mf_capo', money: 80000, happy: 12, actorRole: 'friend', visual: 'money' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai demandé plus. Le boss a coupé une tomate en deux, très lentement. Message reçu : j'ai accepté le poste, sans augmentation, et avec une tomate en moins.", en: "I asked for more. The boss cut a tomato in half, very slowly. Message received: I took the job, no raise, one tomato down." }, fx: { flag: 'mf_capo', money: 15000, stress: 8, actorRole: 'friend' } },
        ],
      },
    ],
  },
  {
    id: 'mf_boss_succession',
    icon: '👑',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'mansion', mood: 'shock', fx: 'gore' },
    when: { age: [28, 90], flag: 'mf_capo', noFlag: ['mf_boss', ...OUT] },
    cooldown: 4,
    weight: 15,
    actor: GOON,
    vars: { amount: [100000, 500000] },
    text: {
      fr: [
        "Déjeuner du dimanche. Le vieux Don s'étouffe avec une olive, devient violet, puis bleu, puis mort. Le noyau jaillit de sa bouche et assomme le perroquet. Douze capos se regardent. Le trône est libre.",
        "Le Don est mort dans son jardin : un sanglier l'a encorné pendant qu'il arrosait ses tomates. Littéralement éventré, les tripes dans le basilic. Au bord de la tombe, {a.first} et les autres capos te fixent : qui prend la place ?",
      ],
      en: [
        "Sunday lunch. The old Don chokes on an olive, turns purple, then blue, then dead. The pit shoots out of his mouth and knocks out the parrot. Twelve capos look at each other. The throne is open.",
        "The Don died in his garden: a wild boar gored him while he watered his tomatoes. Disemboweled, guts in the basil. At the graveside, {a.first} and the other capos stare at you: who takes over?",
      ],
    },
    choices: [
      {
        label: { fr: 'Prendre le trône', en: 'Seize the throne' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "Je me suis assis{|e} dans le fauteuil du Don avant que le corps soit froid. Personne n'a osé protester. Je suis le Parrain. La première chose que j'ai faite : interdire les olives.", en: "I sat in the Don's chair before the body was cold. Nobody dared object. I'm the Godfather. First order of business: olives are banned." }, fx: { flag: 'mf_boss', money: 'amount', fame: 10, happy: 15, heat: 15, karma: -5, visual: 'money' }, mood: 'proud' },
          { w: 1, text: { fr: "Un autre capo a voulu le fauteuil aussi. Échange de coups de feu au-dessus du buffet. J'ai pris une balle dans la fesse gauche, lui dans le front. Je suis le Parrain. Je gouverne debout.", en: "Another capo wanted the chair too. Shootout over the buffet. I took one in the left buttock, he took one in the forehead. I'm the Godfather. I rule standing up." }, fx: { flag: 'mf_boss', health: -15, money: 'amount', fame: 8, heat: 25, karma: -10, counter: 'crimes', visual: 'gore' }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Soutenir un autre capo', en: 'Back another capo' },
        text: { fr: "J'ai soutenu la candidature de {a.first}. {a:Il|Elle} m'a remercié{|e} avec une enveloppe et une promesse : « Tu seras mon numéro deux. » Je ne suis pas certain{|e} que ce soit une bonne place.", en: "I backed {a.first}. {a:He|She} thanked me with an envelope and a promise: “You'll be my number two.” I'm not sure that's a good place to be." },
        fx: { money: 50000, actorRole: 'friend', stress: 5 },
      },
    ],
  },
  {
    id: 'mf_boss_taster',
    icon: '🍰',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'mansion', mood: 'shock', fx: 'gore' },
    when: { age: [25, 95], flag: 'mf_boss', noFlag: OUT },
    cooldown: 5,
    weight: 6,
    actor: GOON,
    text: {
      fr: [
        "Ton goûteur, {a.first}, croque une cuillère de tiramisu, devient vert, et s'effondre face la première dans le plat en se vidant par tous les orifices. Quelqu'un veut ta peau. Et maintenant, plus personne ne veut de dessert.",
        "Le tiramisu était empoisonné. {a.first}, ton goûteur, a convulsé si fort qu'{a:il|elle} a cassé la table. Il y a de la crème et des boyaux jusque sur le lustre.",
      ],
      en: [
        "Your food taster, {a.first}, takes a spoonful of tiramisu, turns green and collapses face-first into the dish, leaking from every orifice. Someone wants you dead. And now nobody wants dessert.",
        "The tiramisu was poisoned. {a.first}, your taster, convulsed so hard {a:he|she} broke the table. There's cream and entrails all the way up on the chandelier.",
      ],
    },
    choices: [
      {
        label: { fr: 'Interroger le chef', en: 'Grill the chef' },
        out: [
          { w: 2, text: { fr: "Le chef a avoué en trente secondes : payé par la famille rivale. Je l'ai fait « déménager » en Sicile. Dans plusieurs valises. J'ai offert des funérailles de star à {a.first}.", en: "The chef confessed in thirty seconds: paid by the rival family. I had him “relocated” to Sicily. In several suitcases. {a.first} got a rock-star funeral." }, fx: { actorDie: true, karma: -10, flag: 'mf_rival', counter: 'crimes', heat: 10, stress: 6 }, mood: 'angry' },
          { w: 1, text: { fr: "Le chef jure qu'il est innocent. C'était le pâtissier. Ou le sommelier. Ou ma belle-mère. J'ai viré tout le monde et je mange désormais exclusivement des conserves que j'ouvre moi-même.", en: "The chef swears he's innocent. It was the pastry guy. Or the sommelier. Or my mother-in-law. I fired everyone and now I only eat canned food I open myself." }, fx: { actorDie: true, stress: 15, happy: -6 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Finir le tiramisu', en: 'Finish the tiramisu' },
        text: { fr: "Par pure fierté, j'ai fini le tiramisu. J'ai passé une semaine aux soins intensifs à vomir de la couleur fluo. Les capos racontent que je suis immortel{|le}. Le docteur dit que j'ai eu du bol.", en: "Out of pure pride, I finished the tiramisu. I spent a week in intensive care puking neon. The capos say I'm immortal. The doctor says I got lucky." },
        fx: { actorDie: true, health: -30, fame: 5, disease: 'food_poisoning' },
        mood: 'sick',
      },
    ],
  },

  // ───────────────────────────── collecting debts ─────────────────────────────
  {
    id: 'mf_collect_kneecaps',
    icon: '🦵',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'office', mood: 'angry', fx: 'gore' },
    when: { age: [18, 80], flag: 'mf_made', noFlag: OUT },
    cooldown: 3,
    weight: 8,
    actor: CIVILIAN,
    vars: { amount: [10000, 60000] },
    text: {
      fr: [
        "{a.first} {a.last}, dentiste, doit {$amount} au boss. {a:Il|Elle} a joué la maison de sa mère sur un match de curling. Tu as une batte de baseball, et lui deux rotules toutes neuves.",
        "{a.first} jure qu'{a:il|elle} paiera « la semaine prochaine ». C'est la 26e semaine prochaine. Le boss t'a dit : « Ramène l'argent, ou ramène ses genoux. »",
      ],
      en: [
        "Dr. {a.last}, a dentist, owes the boss {$amount}. {a:He|She} bet {a.his} mother's house on a curling match. You have a baseball bat. {a:He|She} has two brand-new kneecaps.",
        "{a.first} swears {a:he|she}'ll pay “next week.” It's the 26th next week. The boss said: “Bring back the money, or bring back the knees.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Les rotules', en: 'The kneecaps' },
        out: [
          { w: 3, text: { fr: "CRAC. CRAC. Les rotules de {a.first} ont fait le bruit d'un paquet de chips qu'on écrase. {a:Il|Elle} a hurlé si fort que les chiens du quartier ont répondu. L'argent est sorti d'un coffre caché derrière un poster de dauphin.", en: "CRACK. CRACK. {a.first}'s kneecaps made the sound of a crushed bag of chips. {a:He|She} screamed so loud the neighborhood dogs answered. The money came out of a safe behind a dolphin poster." }, fx: { money: 'amount', karma: -12, counter: 'crimes', heat: 12, visual: 'gore' }, mood: 'angry' },
          { w: 1, text: { fr: "J'ai raté mon swing, la batte a rebondi sur le genou et m'a pété le nez. Je saignais plus que lui. Un voisin a filmé. La police aussi a trouvé ça drôle.", en: "I whiffed, the bat bounced off the knee and broke my nose. I was bleeding more than {a:he|she} was. A neighbor filmed it. The police found it funny too." }, fx: { health: -10, looks: -5, arrest: 'racket', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Négocier des soins dentaires', en: 'Take dental work instead' },
        text: { fr: "J'ai accepté un échange : {a:il|elle} efface sa dette en offrant des facettes en porcelaine à toute la famille. Le boss sourit maintenant comme un présentateur télé. Moi aussi. On est terrifiants.", en: "I took a trade: {a:he|she} clears the debt by giving the whole family porcelain veneers. The boss now smiles like a game show host. So do I. We're terrifying." },
        fx: { looks: 8, happy: 4, karma: -2 },
        mood: 'happy',
      },
      {
        label: { fr: 'Payer sa dette toi-même', en: 'Cover the debt yourself' },
        text: { fr: "J'ai eu pitié et payé de ma poche. {a.first} m'a embrassé les mains. Le boss m'a regardé{|e} en plissant les yeux : « T'es une mère Teresa ou un soldat ? »", en: "I felt sorry and paid it myself. {a.first} kissed my hands. The boss squinted at me: “You a soldier or Mother Teresa?”" },
        fx: { money: '-amount', karma: 10, stress: 6 },
      },
    ],
  },
  {
    id: 'mf_collect_bakery',
    icon: '🥖',
    cat: 'mafia',
    scene: { place: 'office', mood: 'neutral' },
    when: { age: [16, 80], flag: 'mf_associate', noFlag: OUT },
    cooldown: 4,
    weight: 7,
    actor: { create: { role: 'acquaintance', age: [60, 85], abs: true, gender: 'f' } },
    text: {
      fr: [
        "Mission du jour : récupérer « la cotisation » chez Madame {a.last}, boulangère, 78 ans, 1 m 45. Elle t'accueille avec un sourire et un plateau de croissants chauds.",
        "Tu dois réclamer l'enveloppe mensuelle à la vieille boulangère du coin. Elle te demande des nouvelles de ta mère, de tes études, et si tu manges assez. Tu n'as pas encore dit un mot.",
      ],
      en: [
        "Today's job: collect “the dues” from Mrs. {a.last}, baker, 78, four foot nine. She greets you with a smile and a tray of warm croissants.",
        "You have to pick up the monthly envelope from the old corner baker. She asks about your mother, your studies, and whether you're eating enough. You haven't said a word yet.",
      ],
    },
    choices: [
      {
        label: { fr: "Prendre l'enveloppe", en: 'Take the envelope' },
        text: { fr: "J'ai pris l'enveloppe en évitant son regard. Elle a ajouté une baguette « pour la route ». Je me suis senti{|e} comme une ordure avec une baguette.", en: "I took the envelope without meeting her eyes. She threw in a baguette “for the road.” I felt like garbage holding a baguette." },
        fx: { money: 500, karma: -3, happy: -2 },
      },
      {
        label: { fr: 'Accepter des croissants', en: 'Accept croissants instead' },
        text: { fr: "Je suis reparti{|e} avec 40 croissants et zéro euro. Le capo a hurlé, puis a mangé onze croissants. Il a dit qu'on allait « passer à un système de troc ».", en: "I left with 40 croissants and zero dollars. The capo screamed, then ate eleven croissants. He said we're “switching to a barter system.”" },
        fx: { happy: 6, weight: 0.02, karma: 2 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'mf_shark_collect',
    icon: '✂️',
    cat: 'mafia',
    rating: 2,
    chainOnly: true,
    scene: { place: 'apartment', mood: 'shock', fx: 'gore' },
    when: { flag: 'mf_owes' },
    actor: MOBSTER,
    vars: { amount: [6000, 30000] },
    text: {
      fr: [
        "Un an plus tard. {a.first} sonne chez toi avec deux armoires à glace et un sécateur de jardin. « Avec les intérêts, ça fait {$amount}. Ou un doigt. Je suis flexible. »",
        "Ding dong. C'est {a.first}, le Requin. {a:Il|Elle} est venu{a:|e} récupérer {$amount}. Derrière lui, son assistant affûte une pince coupante en sifflotant du Vivaldi.",
      ],
      en: [
        "A year later. {a.first} rings your doorbell with two wardrobes in suits and a pair of garden shears. “With interest, that's {$amount}. Or a finger. I'm flexible.”",
        "Ding dong. It's {a.first}, the Shark. {a:He|She} came to collect {$amount}. Behind {a.him}, an assistant sharpens bolt cutters, whistling Vivaldi.",
      ],
    },
    choices: [
      {
        label: { fr: 'Payer', en: 'Pay up' },
        text: { fr: "J'ai payé jusqu'au dernier centime. J'ai vidé mon compte, ma tirelire et le porte-monnaie de ma grand-mère. {a.first} m'a laissé une carte de fidélité. Il manque un tampon pour une dette gratuite.", en: "I paid every last cent. I emptied my account, my piggy bank and my grandma's purse. {a.first} left me a loyalty card. One more stamp and the next loan is free." },
        fx: { money: '-amount', unflag: 'mf_owes', happy: -5 },
      },
      {
        label: { fr: 'Donner un doigt', en: 'Give a finger' },
        text: { fr: "CLAC. Mon auriculaire a volé à travers la cuisine et a atterri dans le bol du chat. Le sang a giclé jusqu'au plafond. Le chat a eu l'air ravi. Dette effacée. Je tape maintenant à neuf doigts.", en: "SNIP. My pinky flew across the kitchen and landed in the cat's bowl. Blood sprayed the ceiling. The cat looked thrilled. Debt cleared. I now type with nine fingers." },
        fx: { unflag: 'mf_owes', health: -15, looks: -3, disease: 'missing_finger', visual: 'gore' },
        mood: 'sick',
      },
      {
        label: { fr: 'Sauter par la fenêtre', en: 'Jump out the window' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai sauté du premier étage dans une haie. J'ai couru jusqu'à la gare et pris le premier train. Je vis maintenant à Clermont-Ferrand. La dette me suit, mais lentement.", en: "I jumped from the second floor into a hedge, ran to the station and took the first train. I live in Ohio now. The debt follows me, but slowly." }, fx: { health: -5, stress: 15, moveOut: true }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai sauté. Je suis tombé{|e} pile sur la voiture de {a.first}. Deux jambes cassées, plus le pare-brise à rembourser. La dette a doublé.", en: "I jumped. Landed right on {a.first}'s car. Two broken legs, plus the windshield. The debt doubled." }, fx: { health: -25, money: '-amount', unflag: 'mf_owes', disease: 'broken_arm' }, mood: 'sick' },
        ],
      },
    ],
  },

  // ───────────────────────────── rival family & turf wars ─────────────────────────────
  {
    id: 'mf_rival_insult',
    icon: '☕',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'party', mood: 'angry' },
    when: { age: [18, 80], flag: 'mf_made', noFlag: ['mf_rival', ...OUT] },
    once: true,
    weight: 7,
    actor: GOON,
    text: {
      fr: [
        "{a.first} Brancaccio, {a:fils|fille} du clan rival, entre dans ton café, crache dans ton expresso et dit que ta mère « cuisine des pâtes trop cuites ». Tout le monde attend ta réaction. Le serveur s'est caché sous le comptoir.",
        "Les Brancaccio ont repeint ta Vespa en rose et écrit « LOSER » dessus en italien. Avec une faute. Leur héritier, {a.first}, rit sur le trottoir d'en face.",
      ],
      en: [
        "{a.first} Brancaccio, son of the rival clan, walks into your café, spits in your espresso and says your mother “overcooks her pasta.” Everyone waits for your reaction. The waiter is hiding under the counter.",
        "The Brancaccios painted your Vespa pink and wrote “LOSER” on it in Italian. Misspelled. Their heir, {a.first}, is laughing across the street.",
      ],
    },
    choices: [
      {
        label: { fr: 'Gifle magistrale', en: 'Epic slap' },
        text: { fr: "Je lui ai mis une gifle qui a résonné dans tout le quartier. Sa chevalière a volé dans la machine à café. La guerre est déclarée. Ma mère est très fière.", en: "I gave {a.him} a slap that echoed through the neighborhood. A pinky ring flew into the espresso machine. War is declared. My mother is very proud." },
        fx: { flag: 'mf_rival', actorRole: 'enemy', happy: 6, fame: 2, heat: 5, schedule: { key: 'mf_rival_payback', years: 1 } },
        mood: 'angry',
      },
      {
        label: { fr: 'Sourire et attendre', en: 'Smile and wait' },
        text: { fr: "J'ai bu l'expresso. Avec le crachat. En le regardant dans les yeux. {a.first} a eu tellement peur qu'{a:il|elle} est {a:parti|partie} sans payer. Ou alors c'était du dégoût.", en: "I drank the espresso. Spit and all. Staring {a.him} down. {a.first} was so scared {a:he|she} left without paying. Or maybe it was disgust." },
        fx: { flag: 'mf_rival', actorRole: 'enemy', fame: 4, happy: -2, schedule: { key: 'mf_rival_payback', years: 2 } },
        mood: 'neutral',
      },
      {
        label: { fr: 'Appeler le boss', en: 'Call the boss' },
        text: { fr: "J'ai appelé le boss pour me plaindre. Il m'a dit : « Tu veux que je vienne te moucher aussi ? » La famille se moque de moi depuis. Les Brancaccio aussi.", en: "I called the boss to complain. He said: “You want me to come wipe your nose too?” The family's been mocking me ever since. So have the Brancaccios." },
        fx: { happy: -6, fame: -2 },
        mood: 'sad',
      },
    ],
  },
  {
    id: 'mf_rival_payback',
    icon: '🧀',
    cat: 'mafia',
    rating: 2,
    chainOnly: true,
    scene: { place: 'party', mood: 'shock', fx: 'gore' },
    when: { flag: 'mf_rival', noFlag: OUT },
    actor: 'enemy',
    text: {
      fr: [
        "Les Brancaccio passent à l'action : une rafale contre ta voiture pendant que tu achètes des cigarettes. Ta Fiat ressemble à un emmental. Ton cousin Paulie a perdu une oreille, qui est restée collée au pare-brise.",
        "Une limousine ralentit devant ton restaurant. Les vitres se baissent. Une pluie de plomb transforme ta salle en passoire, les lasagnes explosent comme des grenades à béchamel. {a.first} te salue de la main.",
      ],
      en: [
        "The Brancaccios strike: a hail of bullets on your car while you're buying cigarettes. Your Fiat looks like Swiss cheese. Cousin Paulie lost an ear, which stayed stuck to the windshield.",
        "A limo slows down outside your restaurant. Windows roll down. A rain of lead turns your dining room into a colander, lasagnas exploding like béchamel grenades. {a.first} waves at you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Riposter', en: 'Hit back' },
        out: [
          { w: 2, text: { fr: "J'ai riposté la semaine suivante : leur boulangerie-façade a été « rénovée » au bulldozer. Ils ont compris. Pour l'instant. Paulie porte un bandeau sur l'oreille manquante et se fait appeler « Van Gogh ».", en: "I hit back the next week: their front bakery got “renovated” by bulldozer. They got the message. For now. Paulie wears a patch over the missing ear and goes by “Van Gogh.”" }, fx: { karma: -8, counter: 'crimes', heat: 15, fame: 3 }, mood: 'angry' },
          { w: 1, text: { fr: "J'ai riposté. Les flics attendaient, planqués dans une camionnette de glacier. J'ai été arrêté{|e} avec une glace à la pistache dans une main et un bidon d'essence dans l'autre.", en: "I hit back. The cops were waiting, hiding in an ice cream truck. I was arrested with a pistachio cone in one hand and a gas can in the other." }, fx: { arrest: 'arson', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Proposer la paix', en: 'Offer peace' },
        text: { fr: "J'ai envoyé un panier de fruits aux Brancaccio, avec une carte : « Paix ? » Ils ont renvoyé le panier. Sans les fruits. Avec l'oreille de Paulie. On est en paix, apparemment.", en: "I sent the Brancaccios a fruit basket with a card: “Peace?” They sent the basket back. Without the fruit. With Paulie's ear. We're at peace, apparently." },
        fx: { unflag: 'mf_rival', karma: 4, happy: -2, actorRole: 'acquaintance' },
      },
    ],
  },
  {
    id: 'mf_turf_war',
    icon: '💥',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'park', mood: 'angry', fx: 'explosion' },
    when: { age: [18, 80], flag: 'mf_made', noFlag: OUT },
    cooldown: 4,
    weight: 6,
    vars: { amount: [20000, 90000] },
    text: {
      fr: [
        "Guerre de territoire pour le contrôle de la rue des Lilas : trois laveries, un kebab et un salon de manucure. Le gang d'en face a planté son drapeau sur le kebab. C'est personnel.",
        "Une famille napolitaine veut ta part du marché des machines à sous. Ils ont envoyé un message : un camion de mozzarella renversé devant chez toi. Avec le chauffeur dedans.",
      ],
      en: [
        "Turf war over Lilac Street: three laundromats, a kebab shop and a nail salon. The crew across town planted their flag on the kebab shop. It's personal.",
        "A Neapolitan family wants your slot machine racket. They sent a message: a mozzarella truck flipped over in front of your house. With the driver still inside.",
      ],
    },
    choices: [
      {
        label: { fr: "Lancer l'assaut", en: 'Go to war' },
        out: [
          { w: 2, text: { fr: "Assaut nocturne. Leur planque a sauté dans une boule de feu digne d'un film à gros budget. Il pleuvait des falafels et des morceaux de types. La rue est à nous. Revenus : {$amount} par an.", en: "Night raid. Their hideout went up in a blockbuster fireball. It rained falafels and pieces of guys. The street is ours. Revenue: {$amount} a year." }, fx: { money: 'amount', karma: -15, counter: 'crimes', heat: 25, fame: 4, visual: 'explosion' }, mood: 'proud' },
          { w: 1, text: { fr: "L'assaut a viré au carnage. J'ai pris un éclat de vitrine de manucure dans la cuisse, et des faux ongles plantés partout. Le salon de manucure a gagné la guerre.", en: "The raid turned into a bloodbath. I took a shard of nail salon window in the thigh and acrylic nails embedded everywhere. The nail salon won the war." }, fx: { health: -20, happy: -6, heat: 20, counter: 'crimes', visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Partager le gâteau', en: 'Split the turf' },
        text: { fr: "J'ai proposé un partage : eux le kebab, nous les laveries. On a signé l'accord sur une serviette en papier. C'est le traité de paix le plus gras de l'histoire.", en: "I proposed a split: they get the kebab, we get the laundromats. We signed it on a paper napkin. Greasiest peace treaty in history." },
        fx: { money: 10000, karma: 2, stress: -4 },
      },
    ],
  },
  {
    id: 'mf_rival_hit',
    icon: '🎯',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'party', mood: 'shock', fx: 'gore' },
    when: { age: [20, 85], flag: ['mf_capo', 'mf_rival'], noFlag: OUT },
    cooldown: 5,
    weight: 6,
    actor: { create: { role: 'acquaintance', age: [15, 40], gender: 'm' } },
    text: {
      fr: [
        "Le vieux Don Brancaccio, {a.first}, dîne tous les jeudis au même restaurant, dos à la porte, parce qu'il « fait confiance à la vie ». Ton équipe est prête. Tu n'as qu'un mot à dire.",
        "Le boss du clan rival, {a.full}, a accepté un « sommet de paix » dans une trattoria. Tes hommes ont caché un plan B dans les toilettes. Classique, mais efficace.",
      ],
      en: [
        "Old Don Brancaccio, {a.first}, dines at the same restaurant every Thursday, back to the door, because he “trusts life.” Your crew is ready. You only have to say the word.",
        "The rival boss, {a.full}, agreed to a “peace summit” at a trattoria. Your guys hid a plan B in the bathroom. Classic, but effective.",
      ],
    },
    choices: [
      {
        label: { fr: 'Donner le feu vert', en: 'Give the order' },
        out: [
          { w: 3, text: { fr: "Le contrat a été exécuté entre l'antipasti et le plat. {a.first} s'est effondré dans ses spaghettis vongole, le sang mélangé à la sauce tomate. Le serveur a demandé si on voulait l'addition. Le clan rival n'existe plus.", en: "The contract went down between the antipasti and the entrée. {a.first} collapsed into his spaghetti vongole, blood mixing with the marinara. The waiter asked if we wanted the check. The rival clan is finished." }, fx: { actorDie: true, unflag: 'mf_rival', karma: -20, counter: 'crimes', heat: 30, fame: 8, visual: 'gore' }, mood: 'proud' },
          { w: 1, text: { fr: "Le contrat a été exécuté. Malheureusement, un client du resto était un flic en civil, en train de manger un tiramisu. Il m'a reconnu{|e}. Il a fini son tiramisu, puis m'a arrêté{|e}.", en: "The contract went down. Unfortunately, a diner was an off-duty cop eating tiramisu. He recognized me. He finished his tiramisu, then arrested me." }, fx: { actorDie: true, unflag: 'mf_rival', arrest: 'murder', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Épargner le vieux', en: 'Spare the old man' },
        text: { fr: "J'ai annulé. Je suis allé{|e} m'asseoir à sa table et on a partagé une bouteille. Il m'a raconté ses souvenirs de jeunesse pendant quatre heures. J'aurais peut-être dû donner le feu vert.", en: "I called it off. I went and sat at his table and we split a bottle. He told me about his youth for four hours. Maybe I should have given the order." },
        fx: { karma: 8, unflag: 'mf_rival', happy: -2, smarts: 2 },
      },
    ],
  },

  // ───────────────────────────── the godfather's kid ─────────────────────────────
  {
    id: 'mf_romance_dinner',
    icon: '🍷',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'mansion', mood: 'neutral' },
    when: { age: [18, 60], flag: 'mf_romance' },
    once: true,
    weight: 10,
    actor: 'lover',
    text: {
      fr: [
        "Dîner du dimanche chez Don Vittorio, le père de {a.first}. Il te sert lui-même, lentement, en te demandant tes intentions, ton salaire, ton groupe sanguin, et si tu sais nager « avec des chaussures lourdes ».",
        "Le Don pose son couteau à côté de ton assiette. « Tu aimes {a.first} ? » Seize cousins te fixent. La grand-mère tricote quelque chose qui ressemble à une corde.",
      ],
      en: [
        "Sunday dinner at Don Vittorio's, {a.first}'s father. He serves you himself, slowly, asking about your intentions, your salary, your blood type, and whether you can swim “in heavy shoes.”",
        "The Don sets his knife beside your plate. “You love {a.first}?” Sixteen cousins stare at you. Grandma is knitting something that looks like a noose.",
      ],
    },
    choices: [
      {
        label: { fr: 'Complimenter la sauce', en: 'Praise the sauce' },
        text: { fr: "J'ai dit que sa sauce était meilleure que celle de ma mère. Le Don a eu les larmes aux yeux. Il m'a serré dans ses bras si fort que j'ai entendu un craquement. Je suis « de la famille ».", en: "I said his sauce beat my mother's. The Don teared up. He hugged me so hard I heard a crack. I'm “family” now." },
        fx: { rel: 15, happy: 8, health: -2 },
        mood: 'happy',
      },
      {
        label: { fr: 'Parler de ton job', en: 'Talk about your job' },
        out: [
          { w: 1, text: { fr: "J'ai parlé de mon travail. Le Don a hoché la tête : « Honnête. C'est bien. C'est rare. C'est un peu suspect. » Il m'a fait suivre pendant trois mois.", en: "I talked about my job. The Don nodded: “Honest. That's good. That's rare. That's a little suspicious.” He had me followed for three months." }, fx: { rel: 8, stress: 6 } },
          { w: 1, text: { fr: "J'ai parlé de mon boulot. Le Don m'a proposé de « doubler mon salaire » en faisant des petites livraisons. {a.first} m'a donné un coup de pied sous la table. Trop tard, j'avais dit oui.", en: "I talked about my job. The Don offered to “double my salary” with some small deliveries. {a.first} kicked me under the table. Too late, I'd said yes." }, fx: { rel: 5, flag: 'mf_associate', money: 8000, karma: -3 } },
        ],
      },
    ],
  },
  {
    id: 'mf_romance_ultimatum',
    icon: '💍',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'mansion', mood: 'love', fx: 'hearts' },
    when: { age: [18, 60], flag: 'mf_romance', noFlag: 'mf_mob_wedding', noHas: 'spouse' },
    cooldown: 3,
    weight: 8,
    actor: 'lover',
    text: {
      fr: [
        "Le Don te prend à part dans son jardin. « Ça fait un moment que tu sors avec {a.first}. Soit tu l'épouses, soit tu disparais. Je dis ça avec amour. »",
        "Un matin, tu trouves une bague de fiançailles sur ta table de nuit, avec un mot du Don : « Je me suis permis. Le mariage est en juin. Tu fais une taille 52. »",
      ],
      en: [
        "The Don takes you aside in his garden. “You been seeing {a.first} a while now. Either you marry, or you disappear. I say this with love.”",
        "One morning you find an engagement ring on your nightstand with a note from the Don: “I took the liberty. The wedding is in June. You're a size 42 long.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Demander sa main', en: 'Pop the question' },
        text: { fr: "J'ai demandé {a.first} en mariage devant toute la famille. {a:Il|Elle} a dit oui en pleurant. Le Don a tiré trois coups de feu en l'air. Un pigeon est tombé. Bon présage, selon lui.", en: "I proposed to {a.first} in front of the whole family. {a:He|She} said yes, crying. The Don fired three shots in the air. A pigeon fell. Good omen, he says." },
        fx: { actorRole: 'fiance', rel: 20, happy: 12, chain: 'mf_wedding', visual: 'hearts' },
        mood: 'love',
      },
      {
        label: { fr: 'Rompre et disparaître', en: 'Break up and vanish' },
        text: { fr: "J'ai rompu avec {a.first}. Puis j'ai changé de numéro, d'adresse et de coupe de cheveux. Je reçois toujours une carte de vœux du Don chaque Noël. Sans texte. Juste ma photo.", en: "I broke up with {a.first}. Then I changed my number, address and haircut. I still get a Christmas card from the Don every year. No message. Just my photo." },
        fx: { actorRole: 'ex', unflag: 'mf_romance', happy: -8, stress: 15 },
        mood: 'sad',
      },
    ],
  },
  {
    id: 'mf_wedding',
    icon: '💒',
    cat: 'mafia',
    rating: 1,
    chainOnly: true,
    scene: { place: 'villa', mood: 'party', fx: 'confetti' },
    actor: 'lover',
    vars: { amount: [40000, 250000] },
    text: {
      fr: [
        "Le mariage. 600 invités, un orchestre, une pièce montée de quatre mètres et trois sénateurs qui font semblant de ne pas être là. Les enveloppes s'empilent : {$amount} au total.",
        "Tu épouses {a.first} dans une villa. Le Don a loué un ténor, un éléphant et la moitié de la police municipale, qui gare les voitures. Les invités glissent des enveloppes dans un sac en satin.",
      ],
      en: [
        "The wedding. 600 guests, an orchestra, a 13-foot cake and three senators pretending they're not there. The envelopes pile up: {$amount} total.",
        "You marry {a.first} at a villa. The Don hired a tenor, an elephant and half the city police, who are valet parking. Guests drop envelopes into a satin bag.",
      ],
    },
    choices: [
      {
        label: { fr: 'Ouvrir le bal', en: 'Open the dance floor' },
        text: { fr: "J'ai ouvert le bal avec {a.first}. Pendant le slow, quelqu'un s'est fait sortir discrètement par deux cousins et n'est jamais revenu. Personne n'a raté un pas. Plus beau jour de ma vie.", en: "I opened the dance with {a.first}. During the slow song, someone got quietly escorted out by two cousins and never came back. Nobody missed a step. Best day of my life." },
        fx: { actorRole: 'spouse', flag: 'mf_mob_wedding', money: 'amount', happy: 20, rel: 20, visual: 'confetti' },
        mood: 'love',
      },
      {
        label: { fr: 'Compter les enveloppes', en: 'Count the envelopes' },
        text: { fr: "J'ai passé ma nuit de noces à compter les enveloppes. {a.first} m'a aidé{|e}. C'était étrangement romantique. On a trouvé une enveloppe avec une balle dedans. Pas de carte.", en: "I spent my wedding night counting envelopes. {a.first} helped. It was weirdly romantic. We found one envelope with a bullet in it. No card." },
        fx: { actorRole: 'spouse', flag: 'mf_mob_wedding', money: 'amount', happy: 12, stress: 5, visual: 'money' },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'mf_romance_cheat',
    icon: '🔧',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'office', mood: 'shock', fx: 'gore' },
    when: { age: [18, 70], flag: 'mf_romance', chance: 0.4 },
    cooldown: 8,
    weight: 4,
    actor: 'lover',
    text: {
      fr: [
        "Un cousin t'a vu{|e} faire un clin d'œil à quelqu'un au bar. Le Don l'a appris avant que ta paupière se rouvre. Deux types t'attendent à ta voiture avec une pince et un chalumeau. Pour « discuter ».",
        "{a.first} a trouvé un message ambigu dans ton téléphone. {a:Il|Elle} n'a rien dit. {a:Il|Elle} a juste appelé papa. Tu es maintenant dans un garage, attaché{|e} à une chaise, face à un oncle qui enfile des gants en latex.",
      ],
      en: [
        "A cousin saw you wink at the bartender. The Don heard about it before your eyelid reopened. Two guys are waiting at your car with pliers and a blowtorch. To “talk.”",
        "{a.first} found an ambiguous text on your phone. {a:He|She} said nothing. {a:He|She} just called Daddy. You're now in a garage, tied to a chair, facing an uncle pulling on latex gloves.",
      ],
    },
    choices: [
      {
        label: { fr: 'Supplier à genoux', en: 'Beg on your knees' },
        out: [
          { w: 2, text: { fr: "J'ai supplié, pleuré, morvé. L'oncle a soupiré, m'a arraché une seule dent de sagesse « pour le principe », sans anesthésie. Le sang a giclé sur son tablier « Kiss the cook ». J'ai été pardonné{|e}.", en: "I begged, cried, snotted. The uncle sighed and yanked out a single wisdom tooth “on principle,” no anesthetic. Blood sprayed his “Kiss the Cook” apron. I was forgiven." }, fx: { health: -10, rel: -10, looks: -2, visual: 'gore' }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai supplié. {a.first} est arrivé{a:|e}, a fondu en larmes et m'a détaché{|e}. On s'est réconciliés dans le garage, sous le regard gêné de l'oncle et de son chalumeau.", en: "I begged. {a.first} showed up, burst into tears and untied me. We made up right there in the garage, under the awkward gaze of the uncle and his blowtorch." }, fx: { rel: 10, happy: 4, stress: 10 }, mood: 'love' },
        ],
      },
      {
        label: { fr: 'Tout nier', en: 'Deny everything' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai tout nié avec un aplomb de politicien. L'oncle a hésité, m'a détaché{|e}, s'est excusé et m'a offert un cannoli. Je ne ferai plus jamais de clin d'œil. Même pour une poussière.", en: "I denied everything with a politician's confidence. The uncle hesitated, untied me, apologized and offered me a cannoli. I will never wink again. Not even for dust." }, fx: { stress: 12, smarts: 1 } },
          { w: 1, text: { fr: "J'ai nié. L'oncle a sorti mon téléphone. Il y avait des photos. J'ai perdu un ongle, {a.first}, et toute envie de flirter pour les dix prochaines années.", en: "I denied it. The uncle pulled out my phone. There were photos. I lost a fingernail, {a.first}, and any urge to flirt for the next decade." }, fx: { health: -12, actorRole: 'ex', unflag: 'mf_romance', happy: -12, visual: 'gore' }, mood: 'cry' },
        ],
      },
    ],
  },

  // ───────────────────────────── the pizzeria (laundry) ─────────────────────────────
  {
    id: 'mf_pizzeria_buy',
    icon: '🍕',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'office', mood: 'neutral', fx: 'money' },
    when: { age: [18, 85], flag: 'mf_made', noFlag: ['mf_pizzeria', ...OUT] },
    once: true,
    weight: 8,
    vars: { amount: [40000, 120000] },
    text: {
      fr: [
        "Ton argent sale déborde du matelas, du congélateur et de la niche du chien. Le consigliere a une idée : acheter une pizzeria pour {$amount} et « blanchir la farine ». Il fait des guillemets avec les doigts.",
        "Un pizzaïolo ruiné te vend sa boutique pour {$amount}. Le comptable de la famille se frotte les mains : « Une pizzeria qui vend 8 000 pizzas par jour sans clients ? Personne ne remarquera rien. »",
      ],
      en: [
        "Your dirty money is spilling out of the mattress, the freezer and the doghouse. The consigliere has an idea: buy a pizzeria for {$amount} and “launder the flour.” He does air quotes.",
        "A broke pizza man sells you his shop for {$amount}. The family accountant rubs his hands: “A pizzeria selling 8,000 pizzas a day with no customers? Nobody will notice a thing.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Acheter « Pizza Omertà »', en: 'Buy “Pizza Omertà”' },
        text: { fr: "J'ai acheté la pizzeria et je l'ai rebaptisée « Pizza Omertà ». Le consigliere a dit que c'était un peu voyant. J'ai répondu que c'était « du branding ». Le four ne sera jamais allumé.", en: "I bought the place and renamed it “Pizza Omertà.” The consigliere said that was a bit on the nose. I said it's “branding.” The oven will never be turned on." },
        fx: { money: '-amount', flag: 'mf_pizzeria', karma: -3, counter: 'crimes', happy: 5 },
        mood: 'proud',
      },
      {
        label: { fr: 'Plutôt une laverie', en: 'A laundromat instead' },
        text: { fr: "J'ai préféré une laverie. Blanchir de l'argent dans une laverie, c'est poétique. Le comptable a pleuré d'émotion. Puis il a pleuré parce que les machines fuyaient.", en: "I went with a laundromat. Laundering money in a laundromat is poetry. The accountant wept with emotion. Then he wept because the machines leaked." },
        fx: { money: -30000, karma: -2, happy: 3, smarts: 1 },
      },
    ],
  },
  {
    id: 'mf_pizzeria_audit',
    icon: '🧾',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'office', mood: 'shock', fx: 'police' },
    when: { age: [18, 90], flag: 'mf_pizzeria', noFlag: 'mf_witsec' },
    cooldown: 4,
    weight: 7,
    actor: CIVILIAN,
    vars: { amount: [10000, 50000] },
    text: {
      fr: [
        "Contrôle fiscal à Pizza Omertà. {a:L'inspecteur|L'inspectrice} {a.last} a remarqué que tu déclares 9 000 pizzas par jour avec un seul sac de farine par an. {a:Il|Elle} a sorti sa calculatrice. Elle a fumé.",
        "{a.first}, du fisc, demande à voir ta cuisine. Le four est rempli de chaussures de rechange. Le frigo contient trois bouteilles de vodka et un classeur intitulé « PAS LA COMPTA ».",
      ],
      en: [
        "Tax audit at Pizza Omertà. Inspector {a.last} noticed you declare 9,000 pizzas a day with one bag of flour a year. {a:He|She} took out {a.his} calculator. It started smoking.",
        "{a.first}, from the IRS, wants to see your kitchen. The oven is full of spare shoes. The fridge holds three bottles of vodka and a binder labeled “NOT THE BOOKS.”",
      ],
    },
    choices: [
      {
        label: { fr: "Graisser l'inspecteur", en: 'Grease the inspector' },
        out: [
          { w: 2, text: { fr: "J'ai offert à {a.first} une « pizza spéciale » : {$amount} glissés sous la mozzarella. {a:Il|Elle} a mangé le carton. Le contrôle est clos. Excellente note d'hygiène, en plus.", en: "I gave {a.first} a “special pizza”: {$amount} slipped under the mozzarella. {a:He|She} ate the box too. Audit closed. Top hygiene rating, too." }, fx: { money: '-amount', heat: -10, karma: -4 } },
          { w: 1, text: { fr: "J'ai tenté de {a:le|la} corrompre. {a:C'était un incorruptible|C'était une incorruptible}, {a:le dernier|la dernière} du pays. {a:Il|Elle} a fait encadrer le billet comme pièce à conviction.", en: "I tried to bribe {a.him}. {a:He|She} was incorruptible, the last one in the country. {a:He|She} had the bill framed as evidence." }, fx: { arrest: 'bribe', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire 9 000 pizzas', en: 'Bake 9,000 pizzas' },
        text: { fr: "J'ai allumé le four pour la première fois et fait 9 000 pizzas en une nuit pour prouver que c'était possible. Brûlures aux deux bras, mais {a.first} est {a:reparti convaincu|repartie convaincue}. Et obèse.", en: "I lit the oven for the first time ever and made 9,000 pizzas overnight to prove it could be done. Burns on both arms, but {a.first} left convinced. And obese." },
        fx: { health: -12, athletic: 4, fame: 2, disease: 'burns', heat: -5 },
        mood: 'proud',
      },
      {
        label: { fr: 'Faire une omelette de faux livres', en: 'Cook the books' },
        out: [
          { w: 1, odds: { smarts: 2 }, text: { fr: "J'ai passé une nuit blanche à réécrire les comptes. Selon les nouveaux chiffres, la pizzeria perd de l'argent. {a.first} m'a offert un mouchoir et une réduction d'impôts.", en: "I pulled an all-nighter rewriting the books. According to the new numbers, the pizzeria loses money. {a.first} offered me a tissue and a tax break." }, fx: { money: 5000, smarts: 2, heat: -5 }, mood: 'happy' },
          { w: 1, text: { fr: "Mes faux livres contenaient un tableau Excel intitulé « vrais chiffres, NE PAS IMPRIMER ». Je l'avais imprimé.", en: "My fake books contained a spreadsheet titled “real numbers, DO NOT PRINT.” I had printed it." }, fx: { arrest: 'taxfraud', visual: 'police' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'mf_pizzeria_customer',
    icon: '😱',
    cat: 'mafia',
    scene: { place: 'office', mood: 'shock' },
    when: { age: [18, 90], flag: 'mf_pizzeria' },
    cooldown: 5,
    weight: 6,
    text: {
      fr: [
        "Catastrophe à la pizzeria : un vrai client est entré. Il veut une quatre-fromages. Personne ne sait où est la farine. Personne ne sait ce qu'est la farine.",
        "Un critique gastronomique s'est assis chez toi et attend sa pizza depuis 40 minutes. Ton cuistot est un ancien boxeur qui n'a jamais vu de tomate fraîche.",
      ],
      en: [
        "Disaster at the pizzeria: an actual customer walked in. He wants a four-cheese. Nobody knows where the flour is. Nobody knows what flour is.",
        "A food critic sat down and has been waiting 40 minutes for a pizza. Your cook is an ex-boxer who has never seen a fresh tomato.",
      ],
    },
    choices: [
      {
        label: { fr: 'Commander chez le voisin', en: 'Order from next door' },
        text: { fr: "J'ai commandé discrètement une pizza chez le concurrent et je l'ai servie sur une assiette. Le client a laissé cinq étoiles. Le concurrent m'a facturé le triple. Il savait.", en: "I quietly ordered a pizza from the competitor and served it on a plate. The customer left five stars. The competitor charged me triple. He knew." },
        fx: { money: -60, happy: 4, smarts: 1 },
      },
      {
        label: { fr: 'Improviser', en: 'Improvise' },
        out: [
          { w: 1, text: { fr: "J'ai improvisé une pizza avec du pain de mie, du ketchup et une tranche de fromage industriel. Le critique a écrit « audacieux, presque criminel ». C'est encadré à l'entrée.", en: "I improvised a pizza with sandwich bread, ketchup and a slice of American cheese. The critic wrote “bold, almost criminal.” It's framed by the door." }, fx: { happy: 6, fame: 2 }, mood: 'happy' },
          { w: 1, text: { fr: "Le cuistot a mis le feu au four, puis à la cuisine, puis à sa moustache. Le client est reparti en courant. Personne n'est revenu depuis. Parfait.", en: "The cook set the oven on fire, then the kitchen, then his mustache. The customer fled. Nobody's come back since. Perfect." }, fx: { happy: 2, money: -500 }, mood: 'shock' },
        ],
      },
    ],
  },

  // ───────────────────────────── witnesses ─────────────────────────────
  {
    id: 'mf_witness_job',
    icon: '🐟',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'apartment', mood: 'angry' },
    when: { age: [18, 80], flag: 'mf_made', noFlag: OUT },
    cooldown: 4,
    weight: 6,
    actor: CIVILIAN,
    vars: { amount: [15000, 50000] },
    text: {
      fr: [
        "{a.first}, comptable timide, doit témoigner contre le boss la semaine prochaine. Le boss te tend un poisson mort enveloppé dans du papier journal. « Fais-lui comprendre. Avec subtilité. »",
        "Un témoin, {a.full}, menace de tout balancer au procès du consigliere. Ta mission : le faire changer d'avis. Tu as carte blanche, un pied-de-biche et un cousin qui s'appelle Tonino.",
      ],
      en: [
        "{a.first}, a shy accountant, is testifying against the boss next week. The boss hands you a dead fish wrapped in newspaper. “Make {a.him} understand. Subtly.”",
        "A witness, {a.full}, is threatening to spill everything at the consigliere's trial. Your job: change {a.his} mind. You've got carte blanche, a crowbar and a cousin named Tonino.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le poisson dans le lit', en: 'Fish in the bed' },
        out: [
          { w: 2, text: { fr: "J'ai déposé le poisson sous l'oreiller de {a.first}. Le lendemain, {a:il|elle} a eu une amnésie totale à la barre. Le boss m'a offert {$amount} et le reste du poisson, grillé.", en: "I left the fish under {a.first}'s pillow. The next day {a:he|she} had total amnesia on the stand. The boss gave me {$amount} and the rest of the fish, grilled." }, fx: { money: 'amount', karma: -10, counter: 'crimes', heat: 10, visual: 'money' }, mood: 'proud' },
          { w: 1, text: { fr: "{a.first} est allergique au poisson. Un petit contact et {a:il|elle} a gonflé comme un ballon de baudruche, devenu violet et explosé en urticaire géante. Hospitalisé{a:|e}. Le procès est reporté. Le boss est mitigé.", en: "{a.first} is allergic to fish. One touch and {a:he|she} swelled up like a balloon, turned purple and erupted in giant hives. Hospitalized. The trial is postponed. The boss is lukewarm about it." }, fx: { karma: -8, counter: 'crimes', heat: 8 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Visite avec Tonino', en: 'Visit with Tonino' },
        rating: 2,
        out: [
          { w: 2, text: { fr: "Tonino a écrasé les orteils de {a.first} un par un dans une porte de frigo. Dix « crac », dix cris, un vrai xylophone de douleur. Le témoin a soudain oublié tout ce qu'{a:il|elle} avait vu. Même son nom.", en: "Tonino crushed {a.first}'s toes one by one in a fridge door. Ten cracks, ten screams, a xylophone of pain. The witness suddenly forgot everything. Even {a.his} own name." }, fx: { money: 'amount', karma: -15, counter: 'crimes', heat: 15, visual: 'gore' }, mood: 'angry' },
          { w: 1, text: { fr: "L'appartement était truffé de micros. Le témoin bénéficiait déjà d'une protection policière. Tonino et moi avons été arrêtés en train de sonner. Tonino a avoué en quatre secondes. Merci Tonino.", en: "The apartment was bugged. The witness was already under police protection. Tonino and I got arrested ringing the doorbell. Tonino confessed in four seconds. Thanks, Tonino." }, fx: { arrest: 'racket', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: "L'aider à fuir", en: 'Help them escape' },
        text: { fr: "J'ai donné à {a.first} un billet d'avion pour Bali et dit au boss qu'{a:il|elle} avait « disparu ». Ce qui est vrai. Le boss m'a félicité{|e}. Le témoin m'envoie des cartes postales de plage.", en: "I gave {a.first} a plane ticket to Bali and told the boss {a:he|she} had “disappeared.” Which is true. The boss congratulated me. The witness sends me beach postcards." },
        fx: { karma: 12, money: -3000, stress: 6 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'mf_witness_visit',
    icon: '🐠',
    cat: 'mafia',
    rating: 1,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock' },
    when: { flag: 'mf_witness' },
    vars: { amount: [20000, 80000] },
    text: {
      fr: [
        "Le procès approche. Ce matin, ta boîte aux lettres contenait un poisson mort, une photo de ta maison et une carte : « Joli jardin. Ce serait dommage. » Il y a un smiley.",
        "Deux hommes en costume sonnent chez toi avec un bouquet de fleurs et une mallette. « On vient de la part de gens qui pensent que ta mémoire est mauvaise. » La mallette contient {$amount}.",
      ],
      en: [
        "The trial is coming. This morning your mailbox held a dead fish, a photo of your house and a card: “Nice garden. Shame if something happened.” There's a smiley face.",
        "Two men in suits ring your doorbell with flowers and a briefcase. “We come from people who think your memory is bad.” The briefcase holds {$amount}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Témoigner quand même', en: 'Testify anyway' },
        out: [
          { w: 2, text: { fr: "J'ai témoigné, la voix tremblante. Le tueur a pris 30 ans. En sortant du tribunal, un inconnu m'a fait le geste de l'égorgement. C'était peut-être un tic. J'espère.", en: "I testified, voice shaking. The hitman got 30 years. Outside the courthouse, a stranger made a throat-slitting gesture at me. Maybe it was a tic. I hope." }, fx: { karma: 15, stress: 15, fame: 3, unflag: 'mf_witness' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai témoigné. Le jury a acquitté. Trois jurés portaient la même cravate que l'avocat de la défense. Je déménage.", en: "I testified. The jury acquitted. Three jurors wore the same tie as the defense lawyer. I'm moving." }, fx: { karma: 10, stress: 20, moveOut: true, unflag: 'mf_witness' }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Perdre la mémoire', en: 'Lose your memory' },
        text: { fr: "J'ai pris la mallette. À la barre, j'ai déclaré ne me souvenir de rien, même pas de mon prénom. Le juge m'a regardé{|e} longuement. J'ai fait semblant de ne pas le reconnaître non plus.", en: "I took the briefcase. On the stand I said I remembered nothing, not even my first name. The judge stared at me. I pretended not to recognize him either." },
        fx: { money: 'amount', karma: -10, unflag: 'mf_witness', visual: 'money' },
      },
      {
        label: { fr: 'Protection des témoins', en: 'Witness protection' },
        text: { fr: "J'ai appelé les fédéraux. Deux agents sont arrivés en vingt minutes avec un gilet pare-balles et une valise. « Prenez une seule photo de famille. Et oubliez votre nom. »", en: "I called the feds. Two agents arrived in twenty minutes with a bulletproof vest and a suitcase. “Take one family photo. And forget your name.”" },
        fx: { karma: 8, unflag: 'mf_witness', chain: 'mf_witsec' },
      },
    ],
  },

  // ───────────────────────────── car bombs & explosives ─────────────────────────────
  {
    id: 'mf_car_bomb',
    icon: '🚙',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'party', mood: 'shock', fx: 'explosion' },
    when: { age: [18, 90], flag: 'mf_made', noFlag: OUT },
    cooldown: 6,
    weight: 4,
    actor: adult(18, 21),
    text: {
      fr: [
        "Sortie de restaurant. Tu tends les clés de ta voiture au voiturier, {a.first}, 19 ans, tout sourire. Au loin, un homme des Brancaccio regarde sa montre avec beaucoup trop d'intérêt.",
        "Tu remarques un fil rouge qui dépasse de sous ta voiture. Ou alors c'est un spaghetti. {a.first}, le voiturier, propose gentiment de la démarrer pour toi.",
      ],
      en: [
        "Leaving a restaurant. You hand your car keys to the valet, {a.first}, 19, all smiles. Across the street, a Brancaccio man checks his watch with far too much interest.",
        "You notice a red wire hanging under your car. Or it's a spaghetti. {a.first}, the valet, kindly offers to start it for you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Laisser le voiturier', en: 'Let the valet do it' },
        text: { fr: "Le voiturier a tourné la clé. BOUM. La voiture a décollé de deux mètres, et {a.first} a été éparpillé{a:|e} sur trois places de parking et un panneau « Merci de votre visite ». Il pleuvait des boulons et des bouts de pouce. J'ai survécu. Je n'ai pas laissé de pourboire.", en: "The valet turned the key. BOOM. The car went six feet up, and {a.first} got scattered across three parking spots and a “Thanks for visiting” sign. It rained bolts and bits of thumb. I survived. I didn't leave a tip." },
        fx: { actorDie: true, karma: -15, stress: 15, flag: 'mf_rival', loseAsset: 'car', visual: 'explosion' },
        mood: 'shock',
      },
      {
        label: { fr: 'Démarrer toi-même', en: 'Start it yourself' },
        out: [
          { w: 3, text: { fr: "C'était bien un spaghetti. J'ai démarré en transpirant comme un fromage au soleil. Rien n'a explosé, sauf mon cœur, à 190 pulsations par minute.", en: "It really was a spaghetti. I started the car sweating like cheese in the sun. Nothing exploded except my heart, at 190 beats per minute." }, fx: { stress: 10, happy: 2 } },
          { w: 1, text: { fr: "BOUM. J'ai été projeté{|e} à travers le toit ouvrant jusque dans un platane. J'ai perdu mes sourcils, deux dents et toute dignité. Je suis vivant{|e}, perché{|e}, et fumant{|e}.", en: "BOOM. I was launched through the sunroof into a sycamore. Lost my eyebrows, two teeth and all dignity. I'm alive, up a tree, and smoking." }, fx: { health: -40, looks: -8, flag: 'mf_rival', loseAsset: 'car', disease: 'burns', visual: 'explosion' }, mood: 'sick' },
          { w: 0.2, text: { fr: "BOUM. Ma voiture et moi sommes partis en orbite basse.", en: "BOOM. My car and I went into low orbit." }, fx: { die: { fr: 'en orbite basse, avec ma voiture piégée, éparpillé{|e} sur trois quartiers', en: 'in low orbit with my booby-trapped car, scattered across three neighborhoods' }, visual: 'explosion' } },
        ],
      },
      {
        label: { fr: 'Prendre un taxi', en: 'Take a cab' },
        text: { fr: "J'ai laissé la voiture et appelé un taxi. Le lendemain, une dépanneuse l'a embarquée. Le dépanneur n'est jamais arrivé à la fourrière. On a retrouvé son volant sur le toit d'une église.", en: "I left the car and called a cab. The next day a tow truck took it. The tow driver never made it to the impound lot. His steering wheel turned up on a church roof." },
        fx: { stress: 6, loseAsset: 'car', karma: -2 },
      },
    ],
  },
  {
    id: 'mf_boomboom',
    icon: '🧨',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'home', mood: 'shock', fx: 'explosion' },
    when: { age: [18, 85], flag: 'mf_made', noFlag: OUT },
    once: true,
    weight: 4,
    actor: GOON,
    text: {
      fr: [
        "Tu rends visite à « Boum-Boum » {a.first}, l'artificier de la famille, dans son garage. {a:Il|Elle} a neuf doigts, un seul sourcil et le rhume des foins. {a:Il|Elle} vient d'éternuer au-dessus de son établi.",
        "Boum-Boum {a.first} veut te montrer « son nouveau jouet ». {a:Il|Elle} fume une cigarette. Dans un garage qui sent l'essence. En jonglant.",
      ],
      en: [
        "You visit “Boom-Boom” {a.first}, the family's explosives guy, in {a.his} garage. Nine fingers, one eyebrow, and hay fever. {a:He|She} just sneezed over the workbench.",
        "Boom-Boom {a.first} wants to show you “a new toy.” {a:He|She}'s smoking a cigarette. In a garage that smells like gasoline. While juggling.",
      ],
    },
    choices: [
      {
        label: { fr: 'Courir', en: 'Run' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai couru. Derrière moi, le garage s'est transformé en champignon orange. Boum-Boum a été retrouvé{a:|e} en morceaux dans six jardins, dont un sur un trampoline. Il en fait encore, d'ailleurs.", en: "I ran. Behind me the garage became an orange mushroom. Boom-Boom was found in pieces across six backyards, one on a trampoline. Still bouncing." }, fx: { actorDie: true, stress: 12, visual: 'explosion' }, mood: 'shock' },
          { w: 1, text: { fr: "Pas assez vite. Le souffle m'a envoyé{|e} dans la haie du voisin avec une clé à molette plantée dans la fesse. Boum-Boum, lui, est désormais un nuage de confettis rouges.", en: "Not fast enough. The blast threw me into the neighbor's hedge with a wrench lodged in my butt. Boom-Boom is now a cloud of red confetti." }, fx: { actorDie: true, health: -25, disease: 'burns', visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Lui tendre un mouchoir', en: 'Hand them a tissue' },
        text: { fr: "Je lui ai tendu un mouchoir juste à temps. Boum-Boum s'est mouché, a souri, et m'a dit que j'étais « {le seul|la seule} à jamais lui avoir sauvé la vie ». On est amis. Je ne mets plus les pieds dans son garage.", en: "I handed {a.him} a tissue just in time. Boom-Boom blew {a.his} nose, smiled, and said I was “the only one who ever saved {a.his} life.” We're friends. I never set foot in that garage again." },
        fx: { actorRole: 'friend', karma: 3, happy: 4 },
      },
    ],
  },

  // ───────────────────────────── cops on the payroll ─────────────────────────────
  {
    id: 'mf_cop_buy',
    icon: '👮',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'party', mood: 'neutral', fx: 'money' },
    when: { age: [18, 90], flag: 'mf_made', noFlag: ['mf_cops', ...OUT] },
    once: true,
    weight: 7,
    actor: adult(28, 60),
    vars: { amount: [10000, 40000] },
    text: {
      fr: [
        "{a:L'inspecteur|L'inspectrice} {a.first} {a.last}, moustache et dettes de jeu, s'assoit à ta table. « Pour {$amount} par an, je deviens myope. Pour le double, aveugle. »",
        "Un flic de la brigade financière te propose un abonnement : {$amount} par an, et tu reçois les dates des descentes, les noms des balances et une carte de vœux.",
      ],
      en: [
        "Detective {a.first} {a.last}, mustache and gambling debts, sits at your table. “For {$amount} a year, I get nearsighted. Double that, I go blind.”",
        "A financial crimes cop offers you a subscription: {$amount} a year gets you raid dates, snitch names and a holiday card.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le mettre sur la paie', en: 'Put them on payroll' },
        text: { fr: "J'ai payé. Désormais, la police municipale m'appelle « monsieur » ou « madame » et mes PV disparaissent tout seuls. Je me gare sur les passages piétons par principe.", en: "I paid. Now the city police call me “sir” or “ma'am” and my tickets vanish on their own. I park on crosswalks on principle." },
        fx: { money: '-amount', flag: 'mf_cops', heat: -25, karma: -5, actorRole: 'friend', visual: 'money' },
        mood: 'proud',
      },
      {
        label: { fr: "L'enregistrer en douce", en: 'Secretly record them' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai tout enregistré. Maintenant, {a.first} travaille pour moi gratuitement, en tremblant. Le chantage, c'est comme la corruption, mais en solde.", en: "I recorded everything. Now {a.first} works for me for free, shaking. Blackmail is like bribery, but on sale." }, fx: { flag: 'mf_cops', heat: -20, karma: -6, actorRole: 'enemy' }, mood: 'proud' },
          { w: 1, text: { fr: "Mon téléphone a sonné pendant l'enregistrement. Sonnerie : le thème du Parrain. {a.first} m'a confisqué le téléphone et triplé son tarif.", en: "My phone rang mid-recording. Ringtone: the Godfather theme. {a.first} confiscated it and tripled the price." }, fx: { money: '-amount', flag: 'mf_cops', heat: -10, actorRole: 'enemy' } },
        ],
      },
      {
        label: { fr: 'Refuser', en: 'Refuse' },
        text: { fr: "J'ai refusé. Le lendemain, j'ai reçu quatre PV, un contrôle d'alcoolémie et une visite des services vétérinaires pour un chat que je n'ai pas.", en: "I refused. The next day I got four tickets, a breathalyzer test and an animal control visit for a cat I don't own." },
        fx: { heat: 10, stress: 5 },
      },
    ],
  },
  {
    id: 'mf_cop_tip',
    icon: '📞',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'home', mood: 'shock', fx: 'police' },
    when: { age: [18, 90], flag: 'mf_cops', noFlag: OUT },
    cooldown: 3,
    weight: 7,
    text: {
      fr: [
        "Ton flic acheté t'appelle à 3 h du matin en chuchotant : « Descente chez toi à 6 h. Et t'as pas entendu ça de moi. Et rembourse-moi le crédit d'appel. »",
        "Message codé de ton contact au commissariat : « La tante Rosa arrive demain avec 40 cousins en uniforme. » Tu n'as pas de tante Rosa.",
      ],
      en: [
        "Your bought cop calls at 3 a.m., whispering: “Raid at your place at 6. You didn't hear it from me. And pay me back for the minutes.”",
        "Coded text from your precinct contact: “Aunt Rosa arrives tomorrow with 40 cousins in uniform.” You don't have an Aunt Rosa.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout nettoyer', en: 'Clean house' },
        text: { fr: "En trois heures, j'ai fait disparaître des sacs de billets, deux armes et un perroquet qui répète des noms. Les flics ont trouvé une maison impeccable et des scones tièdes.", en: "In three hours I made bags of cash, two guns and a parrot that repeats names disappear. The cops found a spotless house and warm scones." },
        fx: { heat: -20, stress: 8, discipline: 3 },
        mood: 'proud',
      },
      {
        label: { fr: 'Leur préparer un buffet', en: 'Set out a buffet' },
        text: { fr: "J'ai préparé un buffet pour les flics : lasagnes, tiramisu, cartes de visite. Ils ont mangé, rien fouillé, et l'un d'eux m'a demandé la recette. Le procureur est furieux.", en: "I laid out a buffet for the cops: lasagna, tiramisu, business cards. They ate, searched nothing, and one asked for the recipe. The DA is furious." },
        fx: { heat: -15, happy: 6, money: -800, fame: 2 },
        mood: 'happy',
      },
    ],
  },

  // ───────────────────────────── feds, wiretaps & rats ─────────────────────────────
  {
    id: 'mf_wiretap',
    icon: '🎧',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'home', mood: 'shock', fx: 'police' },
    when: { age: [18, 90], flag: 'mf_made', noFlag: ['mf_wiretap', ...OUT] },
    once: true,
    weight: 6,
    text: {
      fr: [
        "Une camionnette « Fleurs & Plomberie Bob » est garée devant chez toi depuis quatre mois. Elle n'a jamais livré une fleur ni débouché un évier. Il y a une antenne de trois mètres dessus.",
        "En changeant une ampoule, tu trouves un micro dans le lustre. Puis un autre dans le grille-pain. Puis un troisième dans le perroquet. Le FBI t'écoute. Depuis combien de temps ?",
      ],
      en: [
        "A “Bob's Flowers & Plumbing” van has been parked outside for four months. It has never delivered a flower or unclogged a sink. There's a ten-foot antenna on it.",
        "Changing a lightbulb, you find a bug in the chandelier. Then another in the toaster. Then a third in the parrot. The FBI is listening. Since when?",
      ],
    },
    choices: [
      {
        label: { fr: 'Parler en code', en: 'Talk in code' },
        text: { fr: "Désormais, toute la famille parle en code. « Les aubergines sont au four » veut dire quelque chose. Personne ne sait quoi. Même pas moi. On a reçu 40 kilos d'aubergines.", en: "Now the whole family talks in code. “The eggplants are in the oven” means something. Nobody knows what. Not even me. We received 90 pounds of eggplant." },
        fx: { flag: 'mf_wiretap', heat: -5, stress: 6, smarts: 1 },
      },
      {
        label: { fr: 'Apporter du café au van', en: 'Bring the van coffee' },
        text: { fr: "J'ai frappé à la camionnette avec deux cafés et des cornetti. Un agent a ouvert, paniqué, la bouche pleine. On a parlé football une heure. Il m'écoute toujours, mais avec tendresse.", en: "I knocked on the van with two coffees and pastries. An agent opened up, panicking, mouth full. We talked soccer for an hour. He still listens, but with affection." },
        fx: { flag: 'mf_wiretap', happy: 4, heat: 5 },
        mood: 'happy',
      },
      {
        label: { fr: 'Chanter devant le micro', en: 'Sing into the bug' },
        text: { fr: "Tous les soirs, je chante de l'opéra faux devant le micro du grille-pain. Trois agents ont demandé leur mutation. Un quatrième pleure à chaque Puccini.", en: "Every night I sing off-key opera into the toaster bug. Three agents requested transfers. A fourth cries at every Puccini." },
        fx: { flag: 'mf_wiretap', happy: 6 },
        mood: 'party',
      },
    ],
  },
  {
    id: 'mf_wiretap_code',
    icon: '🍆',
    cat: 'mafia',
    scene: { place: 'home', mood: 'happy' },
    when: { age: [18, 90], flag: 'mf_wiretap', noFlag: 'mf_witsec' },
    cooldown: 4,
    weight: 6,
    text: {
      fr: [
        "Au téléphone, ton capo dit : « Le gros poisson a mangé les cannoli de tante Lucia. » Tu ne sais pas si c'est une menace, un meurtre ou une vraie histoire de cannoli.",
        "Les fédéraux ont publié la transcription de tes écoutes au tribunal : 300 pages de recettes de sauce tomate. Le juge a demandé une photocopie pour sa femme.",
      ],
      en: [
        "On the phone, your capo says: “The big fish ate Aunt Lucia's cannoli.” You don't know if it's a threat, a murder or an actual cannoli situation.",
        "The feds entered your wiretap transcripts in court: 300 pages of tomato sauce recipes. The judge asked for a copy for his wife.",
      ],
    },
    choices: [
      {
        label: { fr: 'Répondre en code', en: 'Answer in code' },
        text: { fr: "J'ai répondu : « Que la tante Lucia en refasse. » Le lendemain, tante Lucia a vraiment refait des cannoli. Personne n'a été tué. Je crois.", en: "I replied: “Have Aunt Lucia make more.” The next day Aunt Lucia actually made more cannoli. Nobody got killed. I think." },
        fx: { happy: 4, weight: 0.01 },
      },
      {
        label: { fr: 'Demander en clair', en: 'Ask plainly' },
        text: { fr: "J'ai demandé « Tu veux dire quoi exactement ? ». Silence. Puis mon capo a raccroché, a pris sa voiture, est venu chez moi et m'a frappé avec un journal plié. Comme un chien.", en: "I asked “What exactly do you mean?” Silence. Then my capo hung up, drove over, and smacked me with a rolled-up newspaper. Like a dog." },
        fx: { happy: -3, smarts: 1 },
      },
    ],
  },
  {
    id: 'mf_fbi_flip',
    icon: '🕴️',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'court', mood: 'shock', fx: 'police' },
    when: { age: [18, 90], flag: 'mf_made', noFlag: ['mf_rat', ...OUT], counter: { crimes: [3, 999] } },
    once: true,
    weight: 6,
    actor: adult(28, 60),
    text: {
      fr: [
        "{a:L'agent spécial|L'agente spéciale} {a.full} t'attend dans ta cuisine, en mangeant tes biscuits. {a:Il|Elle} pose un dossier de 2 000 pages. « Soit tu prends 140 ans, soit tu bosses pour nous. »",
        "Le FBI t'intercepte à la sortie d'un mariage. {a.first}, lunettes noires, mâche un chewing-gum : « On sait tout. Même pour le perroquet. Deviens notre informateur et tout ça disparaît. »",
      ],
      en: [
        "Special Agent {a.full} is waiting in your kitchen, eating your cookies. A 2,000-page file lands on the table. “Either you do 140 years, or you work for us.”",
        "The FBI intercepts you outside a wedding. {a.first}, dark glasses, chewing gum: “We know everything. Even about the parrot. Become our informant and it all goes away.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Devenir une balance', en: 'Become a rat' },
        text: { fr: "J'ai signé. Je suis officiellement une balance. Le FBI m'a donné un nom de code : « Fromage ». J'ai demandé « Aigle ». Ils ont dit non.", en: "I signed. I'm officially a rat. The FBI gave me a codename: “Cheese.” I asked for “Eagle.” They said no." },
        fx: { flag: 'mf_rat', heat: -35, karma: 3, stress: 15, actorRole: 'friend' },
        mood: 'sad',
      },
      {
        label: { fr: 'Appeler mon avocat', en: 'Call my lawyer' },
        out: [
          { w: 2, text: { fr: "Mon avocat, Maître Spaghettoni, a démonté leur dossier en dix minutes : la moitié des preuves concernaient mon homonyme, un dentiste de l'Ohio. L'agent est reparti avec mes biscuits.", en: "My lawyer, Counselor Spaghettoni, took their file apart in ten minutes: half the evidence was about a dentist in Ohio with my name. The agent left with my cookies." }, fx: { money: -25000, heat: -5, happy: 4, actorRole: 'enemy' } },
          { w: 1, text: { fr: "Mon avocat était lui-même informateur du FBI. Il m'a conseillé de « tout avouer, pour mon karma ». J'ai été inculpé{|e} le lendemain.", en: "My lawyer was an FBI informant himself. He advised me to “confess everything, for my karma.” I was indicted the next day." }, fx: { arrest: 'racket', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Cracher sur le badge', en: 'Spit on the badge' },
        text: { fr: "J'ai craché sur son badge. L'omertà avant tout. Il a essuyé le badge, souri, et m'a dit « À bientôt ». Depuis, il y a trois camionnettes de plomberie devant chez moi.", en: "I spat on the badge. Omertà above all. He wiped it off, smiled and said “See you soon.” Now there are three plumbing vans outside my house." },
        fx: { heat: 20, fame: 3, karma: -2, actorRole: 'enemy' },
        mood: 'angry',
      },
    ],
  },
  {
    id: 'mf_rat_wire',
    icon: '📼',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'park', mood: 'shock' },
    when: { age: [18, 90], flag: 'mf_rat', noFlag: OUT },
    cooldown: 3,
    weight: 8,
    text: {
      fr: [
        "Le FBI t'a scotché un micro sur le torse pour le barbecue de la famille. Il fait 38 degrés. Le scotch se décolle. Le boss propose à tout le monde d'aller dans la piscine.",
        "Tu portes un micro à la communion du petit-fils du boss. En plein milieu de l'homélie, ton torse se met à capter la radio : « ... et maintenant, la météo des routes ! »",
      ],
      en: [
        "The FBI taped a wire to your chest for the family barbecue. It's 100 degrees. The tape is peeling. The boss suggests everyone hop in the pool.",
        "You're wearing a wire to the boss's grandson's first communion. Mid-sermon, your chest starts picking up the radio: “...and now, traffic and weather!”",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire parler le boss', en: 'Get the boss talking' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai fait parler le boss pendant une heure. Il a tout avoué, en détail, en épelant les noms. Le FBI m'a envoyé une boîte de chocolats. J'ai vomi de stress dans les bosquets.", en: "I got the boss talking for an hour. He confessed everything, in detail, spelling out the names. The FBI sent me chocolates. I stress-puked in the bushes." }, fx: { heat: -20, karma: 5, stress: 15 }, mood: 'proud' },
          { w: 1, text: { fr: "Le micro s'est mis à siffler un larsen strident. Tout le barbecue s'est tourné vers moi. Le boss a posé sa pince à saucisses. J'ai couru plus vite que jamais dans ma vie.", en: "The wire let out a screeching feedback whine. The whole barbecue turned to look at me. The boss put down his sausage tongs. I ran faster than ever in my life." }, fx: { stress: 25, chain: 'mf_rat_exposed' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Sauter dans la piscine', en: 'Cannonball the pool' },
        text: { fr: "J'ai sauté dans la piscine tout habillé{|e}. Le micro a grillé avec une petite étincelle et une odeur de cheveux brûlés. Les poils de mon torse aussi. Les agents dans le van sont devenus sourds d'une oreille.", en: "I jumped in the pool fully dressed. The wire fried with a little spark and a smell of burnt hair. So did my chest hair. The agents in the van went deaf in one ear." },
        fx: { health: -5, happy: 3, disease: 'burns' },
      },
    ],
  },
  {
    id: 'mf_rat_hunt',
    icon: '🐀',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'beach', mood: 'angry', fx: 'gore' },
    when: { age: [18, 90], flag: 'mf_made', noFlag: OUT },
    cooldown: 5,
    weight: 6,
    actor: GOON,
    text: {
      fr: [
        "« Il y a un rat dans la famille. » Le boss pose une photo sur la table : {a.first}, {a:ton ami|ton amie} d'enfance, en train de prendre un café avec un type en imperméable. Il te tend une paire de bottes en ciment.",
        "Le boss est formel : {a.first} parle aux fédéraux. Ta mission : l'emmener « pêcher » sur le port, à 4 h du matin, avec un seau de ciment frais. Il n'y a pas de cannes à pêche.",
      ],
      en: [
        "“There's a rat in the family.” The boss lays down a photo: {a.first}, your childhood friend, having coffee with a guy in a trench coat. He hands you a pair of cement boots.",
        "The boss is sure: {a.first} is talking to the feds. Your job: take {a.him} “fishing” at the docks, at 4 a.m., with a bucket of fresh cement. There are no fishing rods.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exécuter les ordres', en: 'Follow orders' },
        text: { fr: "Sur le quai, les pieds de {a.first} pris dans le ciment, {a:il|elle} m'a juré qu'{a:il|elle} était innocent{a:|e}. Plouf. Les bulles ont remonté pendant deux minutes. Une mouette m'a regardé{|e} avec un mépris absolu.", en: "On the dock, {a.first}'s feet set in cement, {a:he|she} swore {a:he|she} was innocent. Splash. Bubbles came up for two minutes. A seagull stared at me with total contempt." },
        fx: { actorDie: true, karma: -25, counter: 'crimes', heat: 15, stress: 12, happy: -10 },
        mood: 'sad',
      },
      {
        label: { fr: 'Le défendre', en: 'Defend them' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai prouvé que le type en imperméable était juste son cousin, vendeur d'assurances. Le boss a soupiré et rangé les bottes. {a.first} me doit la vie. Le cousin a vendu une assurance-vie au boss.", en: "I proved the trench coat guy was just {a.his} cousin, an insurance salesman. The boss sighed and put away the boots. {a.first} owes me {a.his} life. The cousin sold the boss life insurance." }, fx: { actorRole: 'friend', rel: 30, karma: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "Le boss a plissé les yeux : « Tu {a:le|la} défends beaucoup. Trop. » On m'a fait essayer les bottes, « pour la taille ». J'ai pu repartir, mais personne ne me parle plus.", en: "The boss squinted: “You defend {a.him} a lot. Too much.” They made me try on the boots, “for size.” I got to leave, but nobody talks to me now." }, fx: { stress: 20, happy: -8 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Le laisser accuser à ta place', en: 'Let them take your fall' },
        if: { flag: 'mf_rat' },
        text: { fr: "Je suis le vrai rat. J'ai hoché la tête gravement et laissé {a.first} payer à ma place. Au fond de l'eau, {a:il|elle} n'a jamais su. Moi, si. Toutes les nuits.", en: "I'm the real rat. I nodded gravely and let {a.first} pay for it. At the bottom of the harbor, {a:he|she} never knew. I do. Every night." },
        fx: { actorDie: true, karma: -30, stress: 20, happy: -15, disease: 'insomnia' },
        mood: 'cry',
      },
    ],
  },
  {
    id: 'mf_rat_exposed',
    icon: '🧀',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'office', mood: 'shock', fx: 'gore' },
    when: { age: [18, 90], flag: 'mf_rat', noFlag: OUT, chance: 0.5 },
    cooldown: 4,
    weight: 4,
    text: {
      fr: [
        "Ils savent. Quelqu'un a laissé un fromage entier dans ton lit, avec un couteau planté dedans. Ton téléphone affiche 47 appels manqués du boss. Ta voiture a déjà disparu.",
        "Au dîner de famille, tout le monde est servi sauf toi. Dans ton assiette : une souris morte. Le boss essuie ses lunettes très lentement. « Alors, Fromage ? »",
      ],
      en: [
        "They know. Someone left an entire wheel of cheese in your bed with a knife stuck in it. Your phone shows 47 missed calls from the boss. Your car is already gone.",
        "At family dinner, everyone gets served but you. On your plate: a dead mouse. The boss polishes his glasses very slowly. “So... Cheese?”",
      ],
    },
    choices: [
      {
        label: { fr: 'Appeler le FBI', en: 'Call the FBI' },
        text: { fr: "J'ai appelé mon agent traitant en hurlant le code d'urgence (« le fromage est cuit »). Une voiture banalisée m'a récupéré{|e} en 12 minutes. Ma vie d'avant est terminée.", en: "I called my handler, screaming the emergency code (“the cheese is melted”). An unmarked car picked me up in 12 minutes. My old life is over." },
        fx: { stress: 20, chain: 'mf_witsec' },
        mood: 'shock',
      },
      {
        label: { fr: "Nier jusqu'au bout", en: 'Deny to the end' },
        out: [
          { w: 2, text: { fr: "J'ai nié. Ils m'ont emmené{|e} dans une boucherie fermée. J'en suis ressorti{|e} trois heures plus tard, sans deux orteils, sans dignité, mais vivant{|e}, parce que le boss « avait un rendez-vous chez le kiné ».", en: "I denied it. They took me to a closed butcher shop. I came out three hours later minus two toes and all dignity, but alive, because the boss “had a physical therapy appointment.”" }, fx: { health: -30, happy: -15, unflag: 'mf_made', visual: 'gore' }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai nié. Ils ont souri. On m'a retrouvé{|e} au fond du port, les pieds dans un bloc de béton, avec un morceau de gruyère dans la bouche. Le symbolisme était lourd.", en: "I denied it. They smiled. I was found at the bottom of the harbor, feet in a block of concrete, a chunk of Swiss in my mouth. The symbolism was heavy-handed." }, fx: { die: { fr: 'au fond du port avec des chaussures en ciment et du gruyère dans la bouche, comme toutes les balances', en: 'at the bottom of the harbor in cement shoes with cheese in my mouth, as all rats do' }, visual: 'gore' } },
        ],
      },
    ],
  },

  // ───────────────────────────── witness protection ─────────────────────────────
  {
    id: 'mf_witsec',
    icon: '🪪',
    cat: 'mafia',
    rating: 1,
    chainOnly: true,
    scene: { place: 'court', mood: 'neutral', fx: 'police' },
    text: {
      fr: [
        "Programme de protection des témoins. Un marshal moustachu te tend ta nouvelle identité : nom, passé, métier inventé, et une ville où il ne se passe jamais rien. « Interdiction de parler italien. Même pour commander une pizza. »",
        "Nouvelle vie. Le marshal te donne trois noms possibles, un pavillon en banlieue et un hobby obligatoire pour « avoir l'air normal{|e} ». La liste des hobbies est très courte.",
      ],
      en: [
        "Witness protection. A mustachioed marshal hands you a new identity: name, backstory, made-up job, and a town where nothing ever happens. “No speaking Italian. Not even to order pizza.”",
        "New life. The marshal gives you three possible names, a ranch house in the suburbs and a mandatory hobby to “look normal.” The hobby list is very short.",
      ],
    },
    choices: [
      {
        label: { fr: 'Gérard, comptable', en: 'Gary, accountant' },
        text: { fr: "Je m'appelle désormais [[Gérard Lambert|Gérard Dumoulin|Gérard Petit]], comptable dans une coopérative laitière. Mon hobby : le modélisme ferroviaire. J'ai envie de mourir, mais personne ne veut plus me tuer.", en: "My name is now [[Gary Miller|Gary Johnson|Gary Peterson]], accountant at a dairy co-op. Hobby: model trains. I want to die, but nobody wants to kill me anymore." },
        fx: { flag: ['mf_witsec', 'mf_newname'], heat: -60, happy: -8, stress: -10, moveOut: true },
        mood: 'sad',
      },
      {
        label: { fr: 'Un nom stylé', en: 'A cool name' },
        text: { fr: "J'ai demandé à m'appeler « Dante Black ». Le marshal a refusé et m'a inscrit{|e} comme « Jean-Michel Pignon ». Mon hobby : la poterie. Je fais des cendriers en forme de revolver.", en: "I asked to be called “Dante Black.” The marshal refused and registered me as “Dale Pudding.” Hobby: pottery. I make ashtrays shaped like revolvers." },
        fx: { flag: ['mf_witsec', 'mf_newname'], heat: -60, happy: -4, stress: -10, moveOut: true },
      },
      {
        label: { fr: 'Fuir seul{|e}', en: 'Go it alone' },
        text: { fr: "J'ai refusé le programme et filé avec un faux passeport acheté sur un parking. Je m'appelle maintenant « Ronaldo Smith ». J'ai 74 ans selon ce passeport.", en: "I turned down the program and ran with a fake passport bought in a parking lot. My name is now “Ronaldo Smith.” According to the passport, I'm 74." },
        fx: { flag: ['mf_witsec', 'mf_newname'], heat: -30, stress: 10, moveOut: true },
        mood: 'shock',
      },
    ],
  },
  {
    id: 'mf_witsec_life',
    icon: '🏡',
    cat: 'mafia',
    scene: { place: 'home', mood: 'sleepy' },
    when: { age: [18, 95], flag: 'mf_witsec' },
    cooldown: 3,
    weight: 8,
    text: {
      fr: [
        "Vie de témoin protégé dans un lotissement. La réunion de copropriété débat depuis trois heures de la couleur des poubelles. Tu sens le vieux réflexe revenir : faire une offre qu'ils ne pourront pas refuser.",
        "Ton voisin, Gilles, a garé sa tondeuse devant ton garage pour la quatrième fois. Avant, tu aurais réglé ça autrement. Aujourd'hui, tu t'appelles Gérard et tu tricotes.",
      ],
      en: [
        "Protected-witness life in a subdivision. The HOA meeting has spent three hours debating trash can colors. You feel the old reflex coming back: make them an offer they can't refuse.",
        "Your neighbor Greg parked his lawn mower in front of your garage for the fourth time. In the old days you'd have handled it differently. Today you're Gary and you knit.",
      ],
    },
    choices: [
      {
        label: { fr: 'Prendre le contrôle', en: 'Take over the HOA' },
        text: { fr: "En six mois, je suis devenu{|e} président{|e} du syndic. Tout le monde paie ses charges à l'heure, personne ne sait pourquoi, et Gilles a déménagé. Je n'ai rien fait. J'ai juste regardé.", en: "In six months I became HOA president. Everyone pays dues on time, nobody knows why, and Greg moved away. I did nothing. I just looked at him." },
        fx: { happy: 8, fame: 1 },
        mood: 'proud',
      },
      {
        label: { fr: 'Rester discret', en: 'Lay low' },
        text: { fr: "Je suis resté{|e} discret{|e}. J'ai offert un gâteau à Gilles. Il l'a trouvé délicieux. Je ne lui ai jamais dit que j'avais longuement hésité sur la recette.", en: "I laid low. I baked Greg a cake. He loved it. I never told him how long I hesitated over the recipe." },
        fx: { karma: 4, happy: -2, stress: -4 },
      },
    ],
  },

  // ───────────────────────────── cartels, bikers, labs ─────────────────────────────
  {
    id: 'mf_cartel_deal',
    icon: '🇲🇽',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'villa', mood: 'neutral', fx: 'money' },
    when: { age: [20, 80], counter: { crimes: [3, 999] }, noFlag: OUT },
    cooldown: 6,
    weight: 5,
    vars: { amount: [80000, 400000] },
    text: {
      fr: [
        "Rendez-vous dans une hacienda mexicaine avec El Pollo, baron du cartel, chemise en soie et dents en or. Chuy, son bras droit, caresse un tigre blanc. L'enjeu : un partenariat à {$amount}.",
        "La famille t'envoie négocier au Mexique. El Pollo t'accueille au bord d'une piscine en forme de pistolet. Sur la table : de la tequila, des tacos, et un doigt dans un bocal. « Mon ancien comptable. »",
      ],
      en: [
        "Meeting at a Mexican hacienda with El Pollo, cartel kingpin, silk shirt and gold teeth. Chuy, his right hand, is petting a white tiger. At stake: a {$amount} partnership.",
        "The family sends you to negotiate in Mexico. El Pollo welcomes you by a pool shaped like a pistol. On the table: tequila, tacos, and a finger in a jar. “My old accountant.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Trinquer et signer', en: 'Toast and sign' },
        out: [
          { w: 3, text: { fr: "On a trinqué à la tequila jusqu'à l'aube. El Pollo m'a serré dans ses bras en pleurant et m'a appelé « hermano ». Le deal est signé : {$amount} de bénéfices. Mon foie a signé sa démission.", en: "We toasted with tequila till dawn. El Pollo hugged me, sobbing, and called me “hermano.” Deal signed: {$amount} in profit. My liver signed its resignation." }, fx: { money: 'amount', flag: 'mf_cartel', counter: 'crimes', karma: -10, heat: 20, addiction: ['alcohol', 10], schedule: { key: 'mf_cartel_tiger', years: 2 }, visual: 'money' }, mood: 'party' },
          { w: 1, text: { fr: "Pendant la signature, l'armée mexicaine a attaqué l'hacienda en hélicoptère. J'ai fui à travers un champ d'agaves, rattrapé{|e} à la frontière, caché{|e} dans un camion de piñatas.", en: "Mid-signing, the Mexican army raided the hacienda by helicopter. I fled through an agave field and got caught at the border, hiding in a truck full of piñatas." }, fx: { arrest: 'drugtraffic', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Renégocier le prix', en: 'Renegotiate' },
        out: [
          { w: 1, odds: { smarts: 2 }, text: { fr: "J'ai renégocié avec aplomb. El Pollo a fixé ses yeux sur moi pendant une minute entière, puis a éclaté de rire : « Tu me plais ! » Il a doublé ma part et m'a offert un bébé tigre. J'ai refusé le tigre.", en: "I renegotiated boldly. El Pollo stared at me for a full minute, then roared with laughter: “I like you!” He doubled my cut and offered me a baby tiger. I declined the tiger." }, fx: { money: 'amount', flag: 'mf_cartel', counter: 'crimes', karma: -10, heat: 20, schedule: { key: 'mf_cartel_tiger', years: 2 }, visual: 'money' }, mood: 'proud' },
          { w: 1, text: { fr: "Mauvaise idée. Chuy a sifflé et le tigre m'a arraché un morceau de mollet, avec le jean et une chaussette. Il l'a mâché devant moi. J'ai signé au prix initial, en saignant sur le contrat.", en: "Bad idea. Chuy whistled and the tiger tore off a chunk of my calf, jeans and sock included. It chewed it in front of me. I signed at the original price, bleeding on the contract." }, fx: { health: -25, flag: 'mf_cartel', money: 30000, counter: 'crimes', visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Rentrer à la maison', en: 'Fly home' },
        text: { fr: "J'ai prétexté une intoxication alimentaire pour rentrer. Ce n'était pas un prétexte au moment de l'atterrissage : les tacos de l'hacienda ont fait la révolution dans mes intestins.", en: "I faked food poisoning to go home. By landing, it was no longer fake: the hacienda tacos staged a revolution in my bowels." },
        fx: { health: -5, disease: 'food_poisoning', karma: 2 },
        mood: 'sick',
      },
    ],
  },
  {
    id: 'mf_cartel_tiger',
    icon: '🐅',
    cat: 'mafia',
    rating: 2,
    chainOnly: true,
    scene: { place: 'villa', mood: 'shock', fx: 'gore' },
    when: { flag: 'mf_cartel', noFlag: 'mf_witsec' },
    vars: { amount: [50000, 200000] },
    text: {
      fr: [
        "El Pollo t'invite à son anniversaire. Au moment du gâteau, un traître est désigné. Le tigre blanc est lâché. La fête continue pendant que le traître est dévoré entre les ballons et le château gonflable.",
        "El Pollo te convoque : un de ses lieutenants a volé. Il veut que tu assistes à la « réunion de motivation » au bord de l'enclos du tigre. Le tigre a l'air très motivé.",
      ],
      en: [
        "El Pollo invites you to his birthday party. At cake time, a traitor is singled out. The white tiger is released. The party goes on while the traitor gets eaten between the balloons and the bouncy castle.",
        "El Pollo summons you: one of his lieutenants stole from him. He wants you at the “motivational meeting” by the tiger enclosure. The tiger looks very motivated.",
      ],
    },
    choices: [
      {
        label: { fr: 'Applaudir poliment', en: 'Clap politely' },
        text: { fr: "J'ai applaudi. Le tigre a recraché une chaussure, une montre en or et une mâchoire inférieure. El Pollo m'a servi une part de gâteau et {$amount} « pour ma loyauté ». J'ai vomi la part de gâteau.", en: "I clapped. The tiger spat out a shoe, a gold watch and a lower jaw. El Pollo handed me a slice of cake and {$amount} “for my loyalty.” I threw up the cake." },
        fx: { money: 'amount', karma: -12, stress: 12, counter: 'crimes', visual: 'gore' },
        mood: 'sick',
      },
      {
        label: { fr: 'Sauter dans la piscine', en: 'Dive into the pool' },
        text: { fr: "J'ai paniqué et sauté dans la piscine en forme de pistolet. Les tigres n'aiment pas l'eau. Celui-là si. J'ai perdu une fesse. El Pollo a trouvé ça hilarant et m'a quand même payé.", en: "I panicked and dove into the pistol-shaped pool. Tigers hate water. Not this one. I lost a buttock. El Pollo found it hilarious and paid me anyway." },
        fx: { money: 'amount', health: -30, looks: -3, visual: 'gore' },
        mood: 'sick',
      },
      {
        label: { fr: 'Quitter le cartel', en: 'Quit the cartel' },
        text: { fr: "J'ai annoncé à El Pollo que je me retirais. Il m'a regardé longuement, puis a dit : « D'accord, hermano. » Je dors depuis avec une fourche et une caméra de surveillance braquée sur ma porte.", en: "I told El Pollo I was out. He stared at me for a long time, then said: “Okay, hermano.” I now sleep with a pitchfork and a camera pointed at my door." },
        fx: { unflag: 'mf_cartel', stress: 20, karma: 4 },
      },
    ],
  },
  {
    id: 'mf_biker_run',
    icon: '🧸',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'park', mood: 'neutral' },
    when: { age: [18, 75], flag: 'mf_biker' },
    cooldown: 3,
    weight: 8,
    vars: { amount: [5000, 25000] },
    text: {
      fr: [
        "Les Chacals de l'Enfer organisent une « balade caritative » : 200 motos, des peluches pour les enfants malades sur les porte-bagages. Ce qu'il y a dans les peluches, personne ne le dit. Les peluches sont très lourdes.",
        "Ton président de club te confie une mission : convoyer des « pièces détachées » jusqu'à la frontière. Il y a beaucoup de pièces. Elles font « clic-clac ».",
      ],
      en: [
        "The Hell Jackals are throwing a “charity ride”: 200 bikes, stuffed animals for sick kids strapped to the back. Nobody mentions what's inside the stuffed animals. They're very heavy.",
        "Your club president gives you a job: run some “spare parts” to the border. There are lots of parts. They go “click-clack.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire la balade', en: 'Ride along' },
        out: [
          { w: 3, text: { fr: "La balade s'est déroulée sans accroc. Ma part : {$amount}. Une vraie peluche s'était glissée dans le lot, je l'ai offerte à un vrai enfant malade. Je me sens comme un saint motorisé.", en: "The ride went off without a hitch. My cut: {$amount}. A real teddy bear had slipped into the batch; I gave it to an actual sick kid. I feel like a motorized saint." }, fx: { money: 'amount', counter: 'crimes', karma: -4, heat: 8, happy: 6 }, mood: 'happy' },
          { w: 1, text: { fr: "Contrôle de gendarmerie. L'agent a pressé un nounours, qui a fait « clic-clac ». Puis il m'a regardé{|e}. J'ai dit « c'est pour les enfants ». Il ne m'a pas cru{|e}.", en: "Police checkpoint. The officer squeezed a teddy bear, which went “click-clack.” Then he looked at me. I said “it's for the kids.” He didn't buy it." }, fx: { arrest: 'arms', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Prétexter une panne', en: 'Fake a breakdown' },
        text: { fr: "J'ai simulé une panne. Le président a démonté mon moteur sur le bas-côté pour « m'aider », a trouvé qu'il marchait très bien, et m'a regardé{|e} en silence. On a fait la balade. J'ai conduit derrière lui, tout le long.", en: "I faked a breakdown. The president took my engine apart on the roadside “to help,” found it worked perfectly, and stared at me in silence. We did the ride. I rode behind him the whole way." },
        fx: { stress: 8, money: 2000, counter: 'crimes' },
      },
    ],
  },
  {
    id: 'mf_biker_brawl',
    icon: '⛓️',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'party', mood: 'angry', fx: 'gore' },
    when: { age: [18, 75], flag: 'mf_biker' },
    cooldown: 4,
    weight: 7,
    text: {
      fr: [
        "Le gang rival des Vautours Rouillés débarque dans ton bar. Quelqu'un a renversé une bière sur une Harley. Dans trente secondes, il va pleuvoir des chaînes, des queues de billard et des dents.",
        "Rassemblement de motards en forêt. Les Chacals et les Vautours se font face, chacun tenant une chaîne de vélo et un sandwich. Le chef des Vautours insulte ta moustache. Tu n'as pas de moustache. C'est pire.",
      ],
      en: [
        "The rival Rusty Vultures gang storms your bar. Someone spilled beer on a Harley. In thirty seconds it's going to rain chains, pool cues and teeth.",
        "Biker rally in the woods. Jackals and Vultures face off, each holding a chain and a sandwich. The Vultures' leader insults your mustache. You don't have a mustache. That's worse.",
      ],
    },
    choices: [
      {
        label: { fr: 'Foncer dans le tas', en: 'Charge in' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai foncé, queue de billard en main. J'ai envoyé trois Vautours au tapis, dont un qui a avalé la boule n° 8. Une oreille a volé dans le bol de cacahuètes. Les Chacals me portent en triomphe.", en: "I charged in, pool cue swinging. I dropped three Vultures, one of whom swallowed the 8-ball. An ear landed in the peanut bowl. The Jackals carried me out in triumph." }, fx: { health: -8, fame: 4, happy: 10, counter: 'crimes', heat: 10, visual: 'gore' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai foncé et pris une chaîne dans la bouche. Quatre dents ont jailli comme du pop-corn. Je souris désormais comme un vieux piano.", en: "I charged and took a chain to the mouth. Four teeth popped out like popcorn. I now smile like an old piano." }, fx: { health: -18, looks: -10, visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Se cacher sous le bar', en: 'Hide behind the bar' },
        text: { fr: "Je me suis caché{|e} derrière le comptoir avec le barman. On a bu toute la réserve de whisky pendant que la bagarre faisait rage. Le club m'a retiré mon écusson. J'ai gardé le whisky.", en: "I hid behind the bar with the bartender. We drank the whole whiskey stock while the brawl raged. The club stripped my patch. I kept the whiskey." },
        fx: { unflag: 'mf_biker', happy: 2, addiction: ['alcohol', 8] },
      },
    ],
  },
  {
    id: 'mf_drug_lab',
    icon: '⚗️',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock', fx: 'explosion' },
    when: { age: [18, 75], counter: { crimes: [3, 999] }, noFlag: 'mf_witsec' },
    cooldown: 6,
    weight: 5,
    actor: GOON,
    vars: { amount: [30000, 150000] },
    text: {
      fr: [
        "Tu investis dans le « labo » de {a.first}, ancien prof de chimie qui se fait appeler « le Professeur ». Le labo est dans un camping-car. Il y a une odeur d'œuf pourri, de pieds et de mauvaise décision.",
        "{a.first} te fait visiter son labo clandestin dans une ferme. {a:Il|Elle} porte un masque à gaz et une blouse tachée. Toi, un tee-shirt. {a:Il|Elle} allume une cigarette « pour se détendre ».",
      ],
      en: [
        "You invest in {a.first}'s “lab.” {a:He|She}'s a former chemistry teacher who goes by “the Professor.” The lab is in an RV. It smells of rotten eggs, feet and bad decisions.",
        "{a.first} gives you a tour of a secret lab on a farm. {a:He|She}'s wearing a gas mask and a stained lab coat. You're wearing a T-shirt. {a:He|She} lights a cigarette “to relax.”",
      ],
    },
    choices: [
      {
        label: { fr: "Investir et s'éloigner", en: 'Invest from afar' },
        out: [
          { w: 2, text: { fr: "J'ai investi en restant à 300 mètres. Bonne idée : six mois plus tard, le camping-car a décollé comme une fusée. Avant ça, il m'a rapporté {$amount}. Le Professeur, lui, est en orbite.", en: "I invested from 300 yards away. Smart: six months later the RV launched like a rocket. Before that it made me {$amount}. The Professor is in orbit." }, fx: { money: 'amount', actorDie: true, counter: 'crimes', karma: -10, heat: 15, visual: 'explosion' }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai investi. Le Professeur s'est fait arrêter en achetant 400 boîtes de médicaments contre le rhume en une fois. Il a donné mon nom avant de donner le sien.", en: "I invested. The Professor got arrested buying 400 boxes of cold medicine at once. He gave my name before his own." }, fx: { arrest: 'drugtraffic', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Visiter le labo', en: 'Tour the lab' },
        out: [
          { w: 2, text: { fr: "Pendant la visite, la cigarette du Professeur a rencontré une vapeur. BOUM. {a.first} a été transformé{a:|e} en brouillard rose sur les murs. Moi, j'ai été éjecté{|e} par la fenêtre dans une mare à canards, sans sourcils et le slip fumant.", en: "During the tour, the Professor's cigarette met a fume. BOOM. {a.first} became a pink mist on the walls. I got blown through a window into a duck pond, no eyebrows, underwear smoking." }, fx: { actorDie: true, health: -30, looks: -6, disease: 'burns', stress: 15, visual: 'explosion' }, mood: 'sick' },
          { w: 1, text: { fr: "Le labo a explosé avec moi dedans. On n'a retrouvé que mes dents et ma montre, plantées dans un épouvantail à deux kilomètres.", en: "The lab exploded with me inside. All they found were my teeth and my watch, stuck in a scarecrow a mile away." }, fx: { actorDie: true, die: { fr: "pulvérisé{|e} dans l'explosion d'un labo clandestin, à cause d'une cigarette", en: 'vaporized in a secret lab explosion, all because of a cigarette' }, visual: 'explosion' } },
        ],
      },
      {
        label: { fr: 'Dénoncer le labo', en: 'Report the lab' },
        text: { fr: "J'ai passé un appel anonyme. Les stups ont débarqué en combinaison. {a.first} s'est enfui{a:|e} en camping-car à 30 km/h. La course-poursuite a duré quatre heures. Diffusée en direct.", en: "I made an anonymous call. The DEA showed up in hazmat suits. {a.first} fled in the RV at 20 mph. The chase lasted four hours. Live on TV." },
        fx: { karma: 8, actorRole: 'enemy' },
      },
    ],
  },

  // ───────────────────────────── the heist crew ─────────────────────────────
  {
    id: 'mf_heist_plan',
    icon: '📐',
    cat: 'mafia',
    rating: 1,
    chainOnly: true,
    scene: { place: 'office', mood: 'neutral' },
    actor: MOBSTER,
    text: {
      fr: [
        "Réunion de planification dans un entrepôt. {a.first} présente l'équipe : « le Hacker » (14 ans, en visio depuis sa chambre), « le Mur » (180 kilos, fond en larmes devant les films Pixar), et toi. Il reste à choisir ton rôle.",
        "Sur le tableau blanc, {a.first} a dessiné le fourgon blindé, la route, et un petit bonhomme avec écrit « TOI » et une flèche. Le plan s'appelle « Opération Raviolis ». Personne ne sait pourquoi.",
      ],
      en: [
        "Planning meeting in a warehouse. {a.first} introduces the crew: “the Hacker” (14, on video call from his bedroom), “the Wall” (400 pounds, cries at Pixar movies), and you. Your role is still open.",
        "On the whiteboard, {a.first} drew the armored truck, the route, and a stick figure labeled “YOU” with an arrow. The plan is called “Operation Ravioli.” Nobody knows why.",
      ],
    },
    choices: [
      {
        label: { fr: 'Chauffeur', en: 'Driver' },
        text: { fr: "J'ai choisi le volant. J'ai passé la semaine à m'entraîner aux dérapages sur le parking d'un supermarché. J'ai renversé onze caddies et une borne de recharge. Je suis prêt{|e}.", en: "I took the wheel. I spent the week practicing drifts in a supermarket parking lot. I took out eleven shopping carts and an EV charger. I'm ready." },
        fx: { flag: 'mf_heist_driver', stress: 4, chain: 'mf_heist_go' },
      },
      {
        label: { fr: 'Cerveau du plan', en: 'Mastermind' },
        if: { stat: { smarts: [50, 100] } },
        text: { fr: "J'ai réécrit le plan. Il tient maintenant en 40 pages avec des annexes, un plan B, C et D, et un sommaire. Le Mur a pleuré d'émotion. {a.first} m'a nommé{|e} chef.", en: "I rewrote the plan. It's now 40 pages with appendices, plans B, C and D, and a table of contents. The Wall wept with emotion. {a.first} made me boss." },
        fx: { smarts: 2, flag: 'mf_heist_brain', chain: 'mf_heist_go' },
        mood: 'proud',
      },
      {
        label: { fr: 'Le gros bras', en: 'The muscle' },
        text: { fr: "J'ai choisi la force brute. Le Mur m'a pris sous son aile et m'a appris à avoir l'air menaçant{|e}. Mon regard de tueur ressemble à quelqu'un qui cherche ses clés.", en: "I chose brute force. The Wall took me under his wing and taught me to look menacing. My killer stare looks like someone looking for their keys." },
        fx: { athletic: 2, chain: 'mf_heist_go' },
      },
      {
        label: { fr: 'Se désister', en: 'Back out' },
        text: { fr: "Je me suis désisté{|e} au dernier moment. {a.first} m'a regardé{|e} partir sans un mot. Le Hacker de 14 ans m'a traité{|e} de « noob » et m'a piraté mon compte de streaming.", en: "I backed out at the last minute. {a.first} watched me go without a word. The 14-year-old Hacker called me a noob and hacked my streaming account." },
        fx: { unflag: 'mf_heist_crew', happy: -3 },
      },
    ],
  },
  {
    id: 'mf_heist_go',
    icon: '🚚',
    cat: 'mafia',
    rating: 1,
    chainOnly: true,
    scene: { place: 'park', mood: 'shock', fx: 'money' },
    actor: MOBSTER,
    vars: { amount: [80000, 500000], cut: [20000, 90000] },
    text: {
      fr: [
        "Jour J. Le fourgon blindé arrive pile à l'heure. Le Hacker a coupé les feux rouges de tout le quartier. Le Mur bloque la route avec son corps. {a.first} hurle « RAVIOLIS ! ». C'est le signal.",
        "Opération Raviolis, en cours. Les masques de clowns sont en place. Le fourgon s'arrête. Un convoyeur te regarde, tu le regardes. Il a un masque de clown aussi. Moment de flottement.",
      ],
      en: [
        "D-Day. The armored truck arrives right on time. The Hacker killed every traffic light in the neighborhood. The Wall blocks the road with his body. {a.first} screams “RAVIOLI!” That's the signal.",
        "Operation Ravioli, in progress. Clown masks on. The truck stops. A guard looks at you, you look at him. He's wearing a clown mask too. Awkward pause.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exécuter le plan', en: 'Run the plan' },
        out: [
          { w: 3, odds: { smarts: 1 }, text: { fr: "Tout a marché. Les sacs de billets, la fuite, le changement de voiture dans un car-wash. Ma part : {$amount}. On a fêté ça au restaurant chinois, le Mur a pleuré dans ses nems.", en: "It all worked. The cash bags, the getaway, the car swap in a car wash. My share: {$amount}. We celebrated at a Chinese restaurant; the Wall cried into his egg rolls." }, fx: { money: 'amount', counter: 'crimes', karma: -10, heat: 35, fame: 3, unflag: 'mf_heist_crew', visual: 'money' }, mood: 'party' },
          { w: 1, text: { fr: "Le Hacker de 14 ans a été privé d'ordinateur par sa mère pile au mauvais moment. Les feux sont repassés au vert, la police est arrivée en sept secondes.", en: "The 14-year-old Hacker got grounded by his mom at exactly the wrong moment. The lights went back to green and the police arrived in seven seconds." }, fx: { arrest: 'armored', counter: 'crimes', unflag: 'mf_heist_crew', visual: 'police' }, mood: 'shock' },
          { w: 0.5, rating: 2, text: { fr: "Le convoyeur a ouvert le feu. Le Mur a pris douze balles et s'est effondré sur {a.first}, l'écrasant comme une crêpe. J'ai filé avec un seul sac, couvert{|e} de sang et de bouts de Mur. Ma part : {$cut}.", en: "The guard opened fire. The Wall took twelve rounds and collapsed onto {a.first}, flattening {a.him} like a pancake. I ran off with one bag, covered in blood and bits of Wall. My share: {$cut}." }, fx: { money: 'cut', actorDie: true, counter: 'crimes', karma: -12, heat: 40, stress: 20, unflag: 'mf_heist_crew', visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Tout annuler', en: 'Abort' },
        text: { fr: "J'ai crié « ANNULEZ ! ». Le Mur s'est relevé, le Hacker s'est déconnecté, {a.first} a jeté son masque. Le fourgon est reparti. On a mangé des raviolis, finalement. C'était donc ça.", en: "I yelled “ABORT!” The Wall stood up, the Hacker logged off, {a.first} tossed {a.his} mask. The truck drove away. We ate ravioli after all. So that's what it meant." },
        fx: { unflag: 'mf_heist_crew', karma: 2, happy: -2 },
      },
    ],
  },

  // ───────────────────────────── prison connections ─────────────────────────────
  {
    id: 'mf_prison_steak',
    icon: '🥩',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'prison', mood: 'happy' },
    when: { prison: true, flag: 'mf_made' },
    cooldown: 2,
    weight: 10,
    text: {
      fr: [
        "En prison, la famille prend soin de toi. Ta cellule a un tapis persan, une machine à expresso et un steak qui arrive tous les jeudis. Le gardien-chef te demande la cuisson.",
        "Un « cousin » te fait passer des provisions en prison : salami, fromage, un téléphone, et une lettre du boss : « Tiens le coup. Ne parle pas. Mange. »",
      ],
      en: [
        "In prison, the family takes care of you. Your cell has a Persian rug, an espresso machine and a steak every Thursday. The head guard asks how you like it cooked.",
        "A “cousin” smuggles you supplies: salami, cheese, a phone, and a note from the boss: “Hang in there. Don't talk. Eat.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Partager avec le bloc', en: 'Share with the block' },
        text: { fr: "J'ai organisé un barbecue clandestin dans la cour. Toute l'aile C m'adore. Le directeur a goûté une brochette et fermé les yeux. Il a aussi pris le reste des saucisses.", en: "I threw an illegal barbecue in the yard. All of C Block loves me. The warden tried a skewer and looked the other way. He also took the leftover sausages." },
        fx: { happy: 10, fame: 2, weight: 0.02 },
        mood: 'party',
      },
      {
        label: { fr: 'Tout garder', en: 'Keep it all' },
        text: { fr: "J'ai tout mangé seul{|e}, dans ma cellule, en regardant les autres à travers les barreaux. J'ai pris quatre kilos et deux ennemis.", en: "I ate it all alone in my cell, staring at the others through the bars. I gained nine pounds and two enemies." },
        fx: { happy: 4, weight: 0.04, stress: 4 },
      },
    ],
  },

  // ───────────────────────────── hits & getting whacked ─────────────────────────────
  {
    id: 'mf_hit_wrong',
    icon: '🔫',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'park', mood: 'shock', fx: 'gore' },
    when: { age: [18, 80], flag: 'mf_made', noFlag: OUT },
    cooldown: 4,
    weight: 6,
    actor: adult(22, 70, 'm'),
    vars: { amount: [20000, 80000] },
    text: {
      fr: [
        "Le boss t'a confié un contrat : {a.full}, qui a « manqué de respect » à sa fille. Tu as une photo floue, une adresse et une heure. Le type sur le perron ressemble à la photo. À peu près.",
        "Contrat à {$amount}. La cible, {a.first}, promène son chien tous les soirs dans le parc. Ce soir, il y a deux hommes avec deux chiens identiques. Il fait nuit. Tu as oublié tes lunettes.",
      ],
      en: [
        "The boss gave you a contract: {a.full}, who “disrespected” his daughter. You have a blurry photo, an address and a time. The guy on the porch looks like the photo. Sort of.",
        "A {$amount} contract. The target, {a.first}, walks his dog in the park every night. Tonight there are two men with two identical dogs. It's dark. You forgot your glasses.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tirer sur le plus proche', en: 'Shoot the closest one' },
        out: [
          { w: 2, text: { fr: "C'était le bon. {a.first} s'est effondré dans une haie de rosiers, une fontaine rouge au milieu du front. Le chien m'a regardé{|e}, puis s'est remis à manger ses croquettes. Contrat rempli : {$amount}.", en: "It was the right guy. {a.first} dropped into a rose hedge, a red fountain spurting from his forehead. The dog looked at me, then went back to eating kibble. Contract complete: {$amount}." }, fx: { money: 'amount', actorDie: true, karma: -25, counter: 'crimes', heat: 30, visual: 'gore' }, mood: 'neutral' },
          { w: 1, text: { fr: "C'était son jumeau. Dentiste bénévole, chanteur dans une chorale. Le vrai {a.first} a vu la scène depuis sa fenêtre, a crié de rage, et m'a désormais juré une haine éternelle. Le boss m'a fait payer les funérailles.", en: "It was his twin. A volunteer dentist, sang in a choir. The real {a.first} saw it from his window, screamed in rage, and swore eternal vengeance. The boss made me pay for the funeral." }, fx: { money: -15000, karma: -30, counter: 'crimes', heat: 30, actorRole: 'enemy', visual: 'gore' }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai tiré. Raté. Le chien, un rottweiler, m'a attrapé{|e} par l'entrejambe et ne m'a lâché{|e} qu'à l'arrivée de la police. Je chante maintenant une octave plus haut.", en: "I fired. Missed. The dog, a rottweiler, grabbed me by the crotch and didn't let go until the police showed up. I now sing an octave higher." }, fx: { health: -20, arrest: 'hitman', visual: 'police' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Vérifier son identité', en: 'Check his ID' },
        text: { fr: "Je suis allé{|e} demander poliment : « Excusez-moi, êtes-vous {a.first} {a.last} ? » Il a dit oui. J'ai paniqué et je lui ai vendu une assurance-vie. Le boss ne doit jamais savoir.", en: "I walked up and politely asked: “Excuse me, are you {a.first} {a.last}?” He said yes. I panicked and sold him life insurance. The boss must never know." },
        fx: { money: 300, karma: 4, stress: 12, happy: 2 },
      },
    ],
  },
  {
    id: 'mf_whacked',
    icon: '🌾',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'park', mood: 'shock', fx: 'ghost' },
    when: { age: [18, 90], flag: 'mf_made', noFlag: OUT, chance: 0.5 },
    cooldown: 8,
    weight: 3,
    actor: GOON,
    text: {
      fr: [
        "{a.first}, ton plus vieil ami dans la famille, te propose une balade en voiture « à la campagne, pour parler ». Sur la banquette arrière, il y a une pelle, une bâche et un sac de chaux vive. « Pour le jardin », dit {a.first}.",
        "Le boss t'embrasse sur les deux joues un peu trop longtemps. Ce soir, {a.first} et Paulie viennent te chercher pour « un petit tour ». Paulie s'assoit derrière toi. Paulie ne s'assoit jamais derrière.",
      ],
      en: [
        "{a.first}, your oldest friend in the family, offers you a drive “out to the country, to talk.” In the back seat: a shovel, a tarp and a bag of lime. “For the garden,” says {a.first}.",
        "The boss kisses you on both cheeks a little too long. Tonight {a.first} and Paulie are picking you up for “a little ride.” Paulie sits behind you. Paulie never sits in the back.",
      ],
    },
    choices: [
      {
        label: { fr: 'Monter dans la voiture', en: 'Get in the car' },
        out: [
          { w: 3, text: { fr: "C'était vraiment pour le jardin. {a.first} a une maison de campagne et voulait planter des tomates avec moi. J'ai pleuré de soulagement dans un champ de navets. Il pense que j'aime beaucoup les navets.", en: "It really was for the garden. {a.first} has a country house and wanted to plant tomatoes with me. I wept with relief in a turnip field. {a.first} thinks I really love turnips." }, fx: { happy: 6, stress: -5, rel: 10 }, mood: 'happy' },
          { w: 2, odds: { athletic: 1 }, text: { fr: "Paulie a sorti un fil de fer. J'ai ouvert la portière à 90 km/h et roulé dans un fossé plein d'orties. Je suis vivant{|e}, couvert{|e} de cloques, et officiellement en cavale contre ma propre famille.", en: "Paulie pulled out a wire. I opened the door at 55 mph and rolled into a ditch full of nettles. I'm alive, covered in blisters, and officially on the run from my own family." }, fx: { health: -15, stress: 25, actorRole: 'enemy', unflag: 'mf_made' }, mood: 'shock' },
          { w: 1, text: { fr: "Paulie a sorti le fil de fer. Je n'ai pas eu le temps de finir ma phrase. On ne m'a jamais retrouvé{|e}. Il y a de très belles tomates dans ce champ, maintenant.", en: "Paulie pulled out the wire. I didn't get to finish my sentence. They never found me. There are some beautiful tomatoes in that field now." }, fx: { die: { fr: 'étranglé{|e} par Paulie sur la banquette arrière, puis enterré{|e} sous un champ de tomates', en: 'garroted by Paulie in the back seat, then buried under a tomato field' }, visual: 'ghost' } },
        ],
      },
      {
        label: { fr: 'Prétexter une diarrhée', en: 'Claim diarrhea' },
        text: { fr: "J'ai prétexté une diarrhée foudroyante. Ce n'était même pas un mensonge : la peur a tout fait. {a.first} a reculé de trois mètres. La balade est reportée. Pour l'instant.", en: "I claimed explosive diarrhea. It wasn't even a lie: the fear took care of it. {a.first} backed away ten feet. The ride is postponed. For now." },
        fx: { stress: 15, happy: -4, health: -2 },
        mood: 'sick',
      },
      {
        label: { fr: "Disparaître cette nuit", en: 'Vanish tonight' },
        text: { fr: "J'ai pris un sac, mon argent caché dans le congélateur, et un bus de nuit vers nulle part. La famille a dit à tout le monde que j'étais « parti{|e} en Sicile ». C'est faux, mais ça m'arrange.", en: "I grabbed a bag, the cash from the freezer, and a night bus to nowhere. The family told everyone I'd “gone to Sicily.” It's not true, but it suits me." },
        fx: { flag: 'mf_retired', moveOut: true, stress: 10, money: -2000 },
      },
    ],
  },
  {
    id: 'mf_cement_shoes',
    icon: '🧱',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'beach', mood: 'shock' },
    when: { age: [18, 90], flag: 'mf_made', noFlag: OUT, chance: 0.6 },
    cooldown: 8,
    weight: 3,
    text: {
      fr: [
        "Tu te réveilles sur un quai, à 3 h du matin, les pieds dans une bassine de ciment qui sèche. Deux types fument une cigarette en attendant. « Encore cinq minutes et c'est bon », dit l'un d'eux en tâtant le ciment.",
        "Tu reprends conscience sur un bateau. Tes chaussures ont été remplacées par un bloc de béton de 40 kilos. Un type en marcel te demande si tu as « un dernier mot, mais court ».",
      ],
      en: [
        "You wake up on a pier at 3 a.m., feet in a tub of setting cement. Two guys smoke while they wait. “Five more minutes and we're good,” says one, poking the cement.",
        "You come to on a boat. Your shoes have been replaced by a 90-pound block of concrete. A guy in a tank top asks if you have “any last words, but short.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Se débattre', en: 'Struggle free' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "Le ciment n'était pas encore pris. J'ai arraché mes pieds de la bassine en laissant mes chaussettes et un ongle d'orteil, puis j'ai couru pieds nus sur le quai. Je marche comme un pingouin depuis.", en: "The cement hadn't set yet. I yanked my feet out, leaving my socks and a toenail behind, and ran barefoot down the pier. I've walked like a penguin ever since." }, fx: { health: -10, stress: 20, athletic: 2 }, mood: 'shock' },
          { w: 1, text: { fr: "Je me suis débattu{|e} et j'ai basculé dans l'eau avec le bloc. Un plongeur amateur m'a repêché{|e} par miracle en cherchant une épave. Il a trouvé mieux qu'une épave.", en: "I struggled and toppled into the water, block and all. An amateur diver fished me out by miracle while hunting for a shipwreck. He found something better than a shipwreck." }, fx: { health: -25, stress: 25, karma: 2 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Négocier', en: 'Negotiate' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai proposé le double de ce qu'on leur payait pour me noyer. Les deux types se sont regardés, ont haussé les épaules et ont cassé le ciment au marteau. Le capitalisme m'a sauvé{|e}.", en: "I offered double what they were being paid to drown me. The two guys looked at each other, shrugged and broke the cement with a hammer. Capitalism saved me." }, fx: { money: -50000, stress: 15 }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai commencé à négocier. Ils m'ont poussé{|e} pendant ma phrase. La dernière chose que j'ai vue, c'est un poisson qui avait l'air désolé pour moi.", en: "I started negotiating. They pushed me mid-sentence. The last thing I saw was a fish that looked sorry for me." }, fx: { die: { fr: 'au fond du port avec des chaussures en ciment, en pleine négociation', en: 'at the bottom of the harbor in cement shoes, mid-negotiation' }, visual: 'ghost' } },
        ],
      },
    ],
  },
  {
    id: 'mf_horse_head',
    icon: '🐴',
    cat: 'mafia',
    rating: 2,
    scene: { place: 'mansion', mood: 'shock', fx: 'gore' },
    when: { age: [21, 90], flag: 'mf_capo', noFlag: OUT },
    once: true,
    weight: 5,
    actor: { create: { role: 'acquaintance', age: [10, 30], gender: 'm' } },
    vars: { amount: [50000, 200000] },
    text: {
      fr: [
        "Le filleul du boss veut le rôle principal dans un film. Le producteur, {a.full}, a dit non et l'a traité de « jambon avec des sourcils ». Le boss te regarde : « Fais-lui une offre qu'il ne pourra pas refuser. »",
        "{a.first}, magnat du cinéma, refuse de payer sa « cotisation ». Il est très fier de son étalon de course à 3 millions. Le boss sourit. Tu sais déjà où ça va.",
      ],
      en: [
        "The boss's godson wants the lead in a movie. The producer, {a.full}, said no and called him “a ham with eyebrows.” The boss looks at you: “Make him an offer he can't refuse.”",
        "{a.first}, a movie mogul, won't pay his “dues.” He's very proud of his $3 million racehorse. The boss smiles. You already know where this is going.",
      ],
    },
    choices: [
      {
        label: { fr: 'La tête de cheval', en: 'The horse head' },
        text: { fr: "Il s'est réveillé dans des draps de satin trempés de sang, nez à nez avec la tête de son étalon. Il a hurlé si aigu que toutes les fenêtres de la villa ont explosé et que trois chiens sont tombés amoureux. Le filleul a eu le rôle, plus {$amount} de bonus.", en: "He woke up in blood-soaked satin sheets, nose to nose with his stallion's head. He screamed so high every window in the villa shattered and three dogs fell in love. The godson got the part, plus {$amount} as a bonus." },
        fx: { money: 'amount', karma: -15, counter: 'crimes', heat: 15, fame: 5, visual: 'gore' },
        mood: 'proud',
      },
      {
        label: { fr: 'Une tête de cheval en peluche', en: 'A plush horse head' },
        text: { fr: "Je n'ai pas eu le cœur de toucher au cheval. J'ai mis une tête de licorne en peluche dans son lit. Le producteur a trouvé ça « adorable et terrifiant ». Il a quand même donné le rôle. Le boss me regarde bizarrement.", en: "I didn't have the heart to touch the horse. I put a plush unicorn head in his bed. The producer found it “adorable and terrifying.” He gave up the part anyway. The boss looks at me funny now." },
        fx: { karma: 2, happy: 4, money: 10000 },
      },
      {
        label: { fr: 'Le cheval entier', en: 'The whole horse' },
        out: [
          { w: 1, text: { fr: "J'ai voulu en faire trop et mettre le cheval entier dans le lit. Vivant. Le cheval s'est réveillé avant le producteur. Ruades, hennissements, lit brisé, producteur piétiné. Le cheval a eu le rôle principal.", en: "I overdid it and put the whole horse in the bed. Alive. The horse woke up before the producer. Bucking, neighing, bed destroyed, producer trampled. The horse got the lead role." }, fx: { health: -15, fame: 6, happy: 8, counter: 'crimes' }, mood: 'party' },
          { w: 1, text: { fr: "J'ai tenté de monter un cheval entier à l'étage. Le cheval m'a envoyé un coup de sabot qui m'a fait traverser une baie vitrée. La police m'a trouvé{|e} évanoui{|e} dans la piscine, un fer à cheval imprimé sur le front.", en: "I tried to get an entire horse upstairs. It kicked me through a plate-glass window. The police found me passed out in the pool with a horseshoe printed on my forehead." }, fx: { health: -20, arrest: 'burglary', visual: 'police' }, mood: 'sick' },
        ],
      },
    ],
  },

  // ───────────────────────────── getting out ─────────────────────────────
  {
    id: 'mf_retire',
    icon: '🌴',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'beach', mood: 'sleepy' },
    when: { age: [50, 95], flag: 'mf_made', noFlag: OUT },
    cooldown: 5,
    weight: 6,
    vars: { amount: [100000, 600000] },
    text: {
      fr: [
        "Tes genoux grincent, ton cholestérol est un crime en soi, et la moitié de tes amis sont « partis en voyage » sans revenir. La Floride t'appelle. Le boss accepte de te laisser partir, avec {$amount}. Bizarrement facilement.",
        "À ton âge, il est temps de raccrocher le flingue. Un pavillon avec piscine, des chemises hawaïennes et une partie de golf par jour. Le problème : on ne quitte jamais vraiment la famille.",
      ],
      en: [
        "Your knees creak, your cholesterol is a felony, and half your friends “went on a trip” and never came back. Florida is calling. The boss agrees to let you go, with {$amount}. Suspiciously easily.",
        "At your age, it's time to hang up the gun. A house with a pool, Hawaiian shirts and a round of golf a day. The problem: nobody ever really leaves the family.",
      ],
    },
    choices: [
      {
        label: { fr: 'Partir en Floride', en: 'Move to Florida' },
        text: { fr: "Je suis à la retraite. Chemise à fleurs, golf, early bird dinner à 16 h 30. Je regarde quand même sous ma voiturette de golf chaque matin. Vieille habitude.", en: "I'm retired. Floral shirt, golf, early bird dinner at 4:30. I still check under my golf cart every morning. Old habits." },
        fx: { flag: 'mf_retired', money: 'amount', happy: 12, stress: -15, heat: -30, schedule: { key: 'mf_pulled_back', years: 3 }, visual: 'money' },
        mood: 'happy',
      },
      {
        label: { fr: 'Mourir les bottes aux pieds', en: 'Die with your boots on' },
        text: { fr: "J'ai refusé la retraite. On ne quitte pas la famille, on la quitte les pieds devant. J'ai repris un expresso et un dossier. Mon cardiologue a démissionné.", en: "I refused to retire. You don't leave the family, you leave it feet first. I had another espresso and opened another file. My cardiologist quit." },
        fx: { stress: 8, health: -3, fame: 2 },
      },
    ],
  },
  {
    id: 'mf_pulled_back',
    icon: '😩',
    cat: 'mafia',
    rating: 1,
    chainOnly: true,
    scene: { place: 'home', mood: 'angry' },
    when: { flag: 'mf_retired' },
    vars: { amount: [50000, 300000] },
    text: {
      fr: [
        "Trois ans de golf et de mots croisés. Puis deux anciens collègues sonnent chez toi. « Le boss a besoin de toi. Un dernier coup. {$amount}. » Juste quand tu pensais en être sorti{|e}, ils te font replonger !",
        "Tu étais à la retraite. Mais ce matin, ta voisine a été rackettée par un jeune caïd de 19 ans en trottinette. Ton vieux sang sicilien se réchauffe. Ton dos, moins.",
      ],
      en: [
        "Three years of golf and crosswords. Then two old colleagues ring the bell. “The boss needs you. One last job. {$amount}.” Just when you thought you were out, they pull you back in!",
        "You were retired. But this morning your neighbor got shaken down by a 19-year-old kingpin on a scooter. Your old Sicilian blood heats up. Your back, less so.",
      ],
    },
    choices: [
      {
        label: { fr: 'Reprendre du service', en: 'Get back in' },
        text: { fr: "J'ai ressorti le costume, qui ne ferme plus. Un dernier coup. C'est ce que je dis à tout le monde. Ma femme de ménage dit que c'est ce qu'ils disent tous.", en: "I pulled out the old suit, which no longer buttons. One last job. That's what I tell everyone. My cleaning lady says that's what they all say." },
        fx: { unflag: 'mf_retired', money: 'amount', counter: 'crimes', karma: -5, heat: 15, happy: 6, visual: 'money' },
        mood: 'proud',
      },
      {
        label: { fr: 'Rester à la retraite', en: 'Stay retired' },
        text: { fr: "J'ai refermé la porte. Puis j'ai mis le jeune caïd à trottinette au tapis avec ma canne, devant tout le lotissement. Les mamies m'ont applaudi{|e}. Je suis à la retraite, pas mort{|e}.", en: "I closed the door. Then I knocked the scooter kingpin flat with my cane in front of the whole neighborhood. The grannies applauded. I'm retired, not dead." },
        fx: { karma: 5, happy: 8, fame: 1 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'mf_confession',
    icon: '⛪',
    cat: 'mafia',
    rating: 1,
    scene: { place: 'cemetery', mood: 'sad' },
    when: { age: [18, 99], record: true },
    cooldown: 8,
    weight: 4,
    text: {
      fr: [
        "Tu entres dans un confessionnal pour la première fois depuis ta communion. Le père Benedetto, 82 ans, écoute. Tu as tellement de choses à dire qu'il a apporté un thermos.",
        "Rongé{|e} par la culpabilité, tu vas te confesser. Le prêtre ouvre le petit volet, te reconnaît, et dit : « Oh non. Pas toi. Attends, je vais m'asseoir mieux. »",
      ],
      en: [
        "You step into a confessional for the first time since your first communion. Father Benedetto, 82, listens. You have so much to say that he brought a thermos.",
        "Eaten up by guilt, you go to confession. The priest slides open the little window, recognizes you and says: “Oh no. Not you. Hang on, let me get comfortable.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout avouer', en: 'Confess everything' },
        out: [
          { w: 2, text: { fr: "J'ai tout avoué. Deux heures. Le prêtre s'est évanoui à la quarante-troisième minute, s'est réveillé, s'est signé, et m'a donné 4 000 Je vous salue Marie. J'en suis à 312.", en: "I confessed everything. Two hours. The priest fainted at minute forty-three, came to, crossed himself, and gave me 4,000 Hail Marys. I'm at 312." }, fx: { karma: 10, happy: 8, stress: -12 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai tout avoué. À la fin, le prêtre a chuchoté : « Mon fils... l'église a besoin d'un nouveau toit. » J'ai payé le toit. Mes péchés sont pardonnés, apparemment au mètre carré.", en: "I confessed everything. At the end the priest whispered: “My child... the church needs a new roof.” I paid for the roof. My sins are forgiven, apparently by the square foot." }, fx: { karma: 8, money: -20000, stress: -10 } },
        ],
      },
      {
        label: { fr: 'Avouer les petits trucs', en: 'Confess the small stuff' },
        text: { fr: "J'ai avoué avoir volé un stylo et menti sur mon poids. Le prêtre, qui lit les journaux, m'a regardé{|e} longuement à travers la grille. « C'est tout ? » « C'est tout, mon père. » Il a soupiré très fort.", en: "I confessed to stealing a pen and lying about my weight. The priest, who reads the papers, stared at me through the grille. “That's all?” “That's all, Father.” He sighed very loudly." },
        fx: { karma: 1, happy: 2 },
      },
      {
        label: { fr: "Lui proposer un job", en: 'Offer him a job' },
        if: { flag: 'mf_made' },
        text: { fr: "Je lui ai proposé de blanchir les dons de la quête. Il a refusé, très choqué. Puis il m'a rappelé{|e} le lendemain pour parler pourcentages.", en: "I offered to launder the collection plate money. He refused, deeply shocked. Then he called me back the next day to talk percentages." },
        fx: { karma: -6, money: 15000, counter: 'crimes' },
      },
    ],
  },

  // ───────────────────────────── feed-only lines ─────────────────────────────
  {
    id: 'mf_auto_pizzeria',
    icon: '💸',
    cat: 'mafia',
    rating: 1,
    auto: true,
    cooldown: 2,
    when: { flag: 'mf_pizzeria', noFlag: 'mf_witsec' },
    vars: { amount: [20000, 120000] },
    text: {
      fr: [
        "Cette année, Pizza Omertà a vendu officiellement 2,4 millions de pizzas. En vrai : quatre. J'ai blanchi {$amount}, et la mozzarella a moisi au frigo.",
        "Bilan annuel de la pizzeria : chiffre d'affaires record, zéro client, {$amount} propres comme un sou neuf. Le comptable a reçu le prix de « meilleur romancier ».",
      ],
      en: [
        "This year Pizza Omertà officially sold 2.4 million pizzas. Actually: four. I laundered {$amount}, and the mozzarella went moldy in the fridge.",
        "Pizzeria annual report: record revenue, zero customers, {$amount} squeaky clean. The accountant won “best novelist.”",
      ],
    },
    fx: { money: 'amount', heat: 3 },
  },
  {
    id: 'mf_auto_envelope',
    icon: '✉️',
    cat: 'mafia',
    rating: 1,
    auto: true,
    cooldown: 2,
    when: { flag: 'mf_made', noFlag: OUT },
    vars: { amount: [5000, 40000] },
    text: {
      fr: [
        "Comme chaque mois, une enveloppe kraft m'attendait dans le distributeur de journaux. Total de l'année : {$amount}. Je ne lis jamais le journal.",
        "Ma part de la machine à sous du bar-tabac, du racket des chantiers et de la loterie clandestine : {$amount}. J'ai mis le tout dans une boîte à chaussures. Taille 46.",
      ],
      en: [
        "Like every month, a manila envelope was waiting in the newspaper box. Total for the year: {$amount}. I never read the paper.",
        "My cut from the bar's slot machine, the construction shakedowns and the numbers game: {$amount}. I put it all in a shoebox. Size 12.",
      ],
    },
    fx: { money: 'amount', heat: 4, karma: -2 },
  },
  {
    id: 'mf_auto_nickname',
    icon: '🏷️',
    cat: 'mafia',
    auto: true,
    once: true,
    when: { flag: 'mf_made' },
    text: {
      fr: [
        "La famille m'a donné un surnom : « [[Johnny Lasagne|Tony Deux-Fois|Sal la Serpillière|Frankie Trois-Doigts|Vinnie Chaussettes]] ». Personne ne veut m'expliquer pourquoi.",
        "Mon surnom dans la famille est désormais « [[le Comptable|la Fouine|Cannoli|Petit Pois|le Fantôme]] ». J'aurais préféré quelque chose de plus effrayant.",
      ],
      en: [
        "The family gave me a nickname: “[[Johnny Lasagna|Tony Two-Times|Sal the Mop|Frankie Three-Fingers|Vinnie Socks]].” Nobody will tell me why.",
        "My family nickname is now “[[the Accountant|the Weasel|Cannoli|Sweet Pea|the Ghost]].” I was hoping for something scarier.",
      ],
    },
    fx: { happy: 3, fame: 1 },
  },
  {
    id: 'mf_auto_funeral',
    icon: '⚰️',
    cat: 'mafia',
    rating: 1,
    auto: true,
    cooldown: 3,
    when: { flag: 'mf_made', noFlag: OUT },
    text: {
      fr: [
        "Cette année, je suis allé{|e} à six enterrements. À chaque fois, le boss pleurait plus fort que la veuve. À chaque fois, c'est lui qui avait commandé les fleurs. Et le reste.",
        "Encore un enterrement. On a enterré Jimmy « la Fouine ». Le cercueil était étonnamment léger. Personne n'a posé de questions.",
      ],
      en: [
        "I went to six funerals this year. Every time, the boss cried harder than the widow. Every time, he had ordered the flowers. And the rest.",
        "Another funeral. We buried Jimmy “the Weasel.” The casket was surprisingly light. Nobody asked questions.",
      ],
    },
    fx: { happy: -3, stress: 3 },
  },
  {
    id: 'mf_auto_fbi',
    icon: '📡',
    cat: 'mafia',
    rating: 1,
    auto: true,
    cooldown: 2,
    when: { flag: 'mf_wiretap', noFlag: OUT },
    text: {
      fr: [
        "Le FBI a changé de camionnette : c'est maintenant « Glaces & Pédicure Steve ». Elle est toujours garée devant chez moi. Je leur fais coucou tous les matins.",
        "J'ai trouvé un nouveau micro, dans ma brosse à dents cette fois. J'ai passé l'année à chanter du Pavarotti en me brossant les dents. Les fédéraux ont dû adorer.",
      ],
      en: [
        "The FBI switched vans: it's now “Steve's Ice Cream & Pedicures.” Still parked outside my house. I wave at them every morning.",
        "Found a new bug, in my toothbrush this time. I spent the year singing Pavarotti while brushing. The feds must have loved it.",
      ],
    },
    fx: { heat: 5, stress: 3 },
  },
  {
    id: 'mf_auto_rival',
    icon: '🐟',
    cat: 'mafia',
    rating: 2,
    auto: true,
    cooldown: 2,
    when: { flag: 'mf_rival', noFlag: OUT },
    text: {
      fr: [
        "Les Brancaccio m'ont envoyé un nouveau message : mon nain de jardin, décapité, avec un poisson dans la bouche. J'ai répondu en leur envoyant leur facteur. En deux colis.",
        "Guerre froide avec les Brancaccio : ils ont crevé mes pneus, j'ai fait sauter leur boîte aux lettres, ils ont empoisonné mon poisson rouge. Il flottait sur le dos avec un mini cercueil à côté.",
      ],
      en: [
        "The Brancaccios sent a new message: my garden gnome, decapitated, with a fish in its mouth. I replied by mailing them their mailman. In two packages.",
        "Cold war with the Brancaccios: they slashed my tires, I blew up their mailbox, they poisoned my goldfish. It was floating belly-up next to a tiny coffin.",
      ],
    },
    fx: { stress: 5, karma: -3, heat: 3 },
  },
  {
    id: 'mf_auto_boss',
    icon: '👑',
    cat: 'mafia',
    rating: 1,
    auto: true,
    cooldown: 1,
    when: { flag: 'mf_boss', noFlag: OUT },
    vars: { amount: [200000, 900000] },
    text: {
      fr: [
        "Le tribut annuel des capos est arrivé : {$amount}, livrés dans un cercueil en acajou. Le symbolisme m'échappe un peu. L'argent, non.",
        "Être le Parrain, c'est {$amount} par an, trois tentatives d'assassinat et un dentier en or. J'ai fait refaire ma chambre en velours rouge.",
      ],
      en: [
        "The capos' annual tribute arrived: {$amount}, delivered in a mahogany casket. The symbolism escapes me a little. The money doesn't.",
        "Being Godfather means {$amount} a year, three assassination attempts and gold dentures. I redid my bedroom in red velvet.",
      ],
    },
    fx: { money: 'amount', heat: 6, fame: 2, stress: 4 },
  },
];
