// Family 2: actor-driven family stories at every life stage — parents (childhood rules, teen fights,
// adult guilt trips, ageing parents, estates), grandparents, siblings, DNA tests & family secrets,
// the family group chat, reunions, your own kids from toddler to adult, in-laws.
// Chains: f2_par_moves_in → f2_par_lodger (schedule), f2_sib_secret → f2_sib_secret_out (schedule),
// f2_dna_kit → f2_dna_halfsib (flag), f2_gp_fake_death → f2_gp_fake_death_reveal (chain),
// f2_inlaw_first_dinner → f2_inlaw_war (flag).
import type { EventDef, Life } from '@bl/sim';

// The engine binds a random living child, so events naming the child require EVERY living child to fit.
const kidAges = (l: Life) => l.npcs.filter((n) => n.role === 'child' && n.alive && !n.temp).map((n) => l.year - n.birthYear);
const allKids = (min: number, max: number) => (l: Life) => {
  const a = kidAges(l);
  return a.length > 0 && a.every((x) => x >= min && x <= max);
};
const parents = (l: Life) => l.npcs.filter((n) => (n.role === 'mother' || n.role === 'father') && !n.temp);
const parentsAllDead = (l: Life) => { const p = parents(l); return p.length > 0 && p.every((n) => !n.alive); };
const aParentDead = (l: Life) => parents(l).some((n) => !n.alive);

export const family2Events: EventDef[] = [
  // ───────────────────────────── parents · childhood ─────────────────────────────
  {
    id: 'f2_par_bedtime_story',
    icon: '📖',
    cat: 'family',
    rating: 0,
    actor: 'parent',
    scene: { place: 'home', mood: 'sleepy', prop: 'book' },
    when: { age: [3, 8], has: 'parent' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "{a.rel} n'a plus de livres à lire, alors {a:il|elle} improvise une histoire. Le héros est {w:animal}, il habite {w:far_place} et, au bout de dix minutes, {a.first} a manifestement oublié comment ça finit.",
        "Histoire du soir : {a.first} raconte la légende d'une princesse qui combat {w:animal} armée seulement avec {w:object}. Tu as très peur. {a:Il|Elle} aussi, on dirait.",
        "{a.first} s'endort au milieu de sa propre histoire, la bouche ouverte, en marmonnant un truc sur {w:food}. Tu es parfaitement réveillé{|e}. La nuit va être longue.",
        "Ce soir, {a.rel} te lit un livre à l'envers, en faisant toutes les voix. Le méchant de l'histoire, {w:animal}, a une voix [[terrifiante|qui ressemble beaucoup à celle de papi|beaucoup trop réaliste]].",
      ],
      en: [
        "{a.first} has run out of books, so {a:he|she} improvises a story. The hero is {w:animal}, it lives {w:far_place}, and after ten minutes {a.first} clearly has no idea how it ends.",
        "Bedtime story: {a.first} tells the legend of a princess fighting {w:animal} armed only with {w:object}. You're terrified. So is {a:he|she}, apparently.",
        "{a.first} falls asleep in the middle of {a:his|her} own story, mouth open, mumbling something about {w:food}. You are wide awake. It's going to be a long night.",
        "Tonight {a.first} reads you a book upside down, doing all the voices. The villain, {w:animal}, has a voice [[that terrifies you|that sounds a lot like grandpa|that is way too realistic]].",
      ],
    },
    choices: [
      {
        label: { fr: 'Exiger la suite', en: 'Demand the ending' },
        out: [
          { w: 2, text: { fr: ["{a.my} a inventé une fin où tout le monde mange une glace. C'était nul. J'ai dormi comme un bébé.", "J'ai exigé la suite. {a.first} a conclu : « Et ils vécurent heureux, maintenant dodo. » Arnaque totale, mais câlin compris."], en: ["{a.my} invented an ending where everyone eats ice cream. It was lame. I slept like a baby.", "I demanded the ending. {a.first} concluded: “And they lived happily ever after, now sleep.” Total scam, cuddle included."] }, fx: { happy: 4, rel: 5 }, mood: 'happy' },
          { w: 1, text: { fr: ["La suite impliquait un loup qui mange les enfants qui ne dorment pas. J'ai dormi. Les yeux ouverts. Jusqu'à mes 14 ans.", "{a.my} a improvisé une fin tellement sombre que j'ai dormi avec la lumière allumée pendant un mois."], en: ["The ending involved a wolf that eats kids who don't sleep. I slept. With my eyes open. Until I was 14.", "{a.my} improvised an ending so dark I slept with the light on for a month."] }, fx: { happy: -3, stress: 4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Raconter la mienne', en: 'Tell my own story' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai raconté ma propre histoire, avec des dragons et des pets. {a.first} a pleuré de rire. Je suis un génie de la narration.", "J'ai pris le relais. Mon histoire avait trois dragons et zéro logique. {a.first} m'a dit que j'écrirais des livres un jour."], en: ["I told my own story, with dragons and farts. {a.first} cried laughing. I am a storytelling genius.", "I took over. My story had three dragons and zero logic. {a.first} said I'd write books one day."] }, fx: { smarts: 3, rel: 6, happy: 3 }, mood: 'proud' },
          { w: 1, text: { fr: ["Mon histoire a duré 45 minutes. C'est {a.my} qui s'est endormi{a:|e}. Victoire par K.-O.", "J'ai raconté une histoire si longue que {a.my} ronflait au chapitre deux."], en: ["My story lasted 45 minutes. {a.first} was the one who fell asleep. Victory by knockout.", "I told a story so long that {a.my} was snoring by chapter two."] }, fx: { happy: 2, rel: 2 } },
        ],
      },
      {
        label: { fr: 'Faire semblant de dormir', en: 'Pretend to sleep' },
        out: [
          { w: 1, text: { fr: ["J'ai fait semblant de dormir. {a.first} est sorti{a:|e} sur la pointe des pieds et a marché sur un Lego. J'ai entendu des mots que je ne connaissais pas.", "J'ai fermé les yeux. {a.first} m'a fait un bisou sur le front et a chuchoté « enfin la paix ». Je m'en souviendrai."], en: ["I pretended to sleep. {a.first} tiptoed out and stepped on a Lego. I heard words I didn't know yet.", "I closed my eyes. {a.first} kissed my forehead and whispered “finally, peace.” I will remember this."] }, fx: { happy: 2, smarts: 1 } },
          { w: 1, text: { fr: ["J'ai fait semblant de dormir, puis je me suis vraiment endormi{|e}. Le piège s'est refermé sur moi.", "J'ai si bien fait semblant que je me suis réveillé{|e} le lendemain. Je ne saurai jamais la fin."], en: ["I pretended to sleep, then actually fell asleep. The trap closed on me.", "I faked it so well I woke up the next morning. I'll never know the ending."] }, fx: { health: 2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_par_lunchbox',
    icon: '🥪',
    cat: 'family',
    rating: 0,
    actor: 'parent',
    scene: { place: 'school', mood: 'shock', prop: 'lunchbox' },
    when: { age: [6, 12], has: 'parent', school: 'any' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "À la cantine, tu ouvres la boîte à goûter préparée par {a.rel}. Dedans : {w:food}, un mot d'amour en majuscules et {w:object}. Toute la table te regarde.",
        "{a.first} a préparé ton goûter. Il y a {w:food} et un petit mot : « Bonne journée mon [[poussin|lapinou|petit cornichon]] ! ». Ton voisin le lit à voix haute.",
        "Ton déjeuner du jour, signé {a.first} : {w:food}, coupé en forme de cœur. Il dégage {w:smell}. La cantinière recule d'un pas.",
        "{a.rel} a voulu faire « healthy » : ta boîte contient {w:food}, un radis entier et une photo de {a:lui|elle} qui fait un clin d'œil. Pourquoi la photo ?",
      ],
      en: [
        "At lunch, you open the lunchbox {a.first} packed. Inside: {w:food}, a love note in capital letters, and {w:object}. The whole table is staring.",
        "{a.first} packed your lunch. There's {w:food} and a note: “Have a great day my [[little chick|bunny|little pickle]]!” The kid next to you reads it out loud.",
        "Today's lunch, by {a.first}: {w:food}, cut into a heart. It gives off {w:smell}. The lunch lady takes a step back.",
        "{a.first} tried to go healthy: your box contains {w:food}, a whole radish and a photo of {a:him|her} winking. Why the photo?",
      ],
    },
    choices: [
      {
        label: { fr: 'Assumer fièrement', en: 'Own it proudly' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["J'ai mangé fièrement, en lisant le mot à voix haute. Tout le monde a voulu adopter {a.my}. Respect gagné.", "J'ai assumé. Deux copains m'ont proposé d'échanger leur goûter contre le mien. Bourse aux goûters : je suis riche."], en: ["I ate proudly, reading the note out loud. Everyone wanted to adopt {a.my}. Respect earned.", "I owned it. Two kids offered to trade their lunch for mine. Lunch stock market: I'm rich."] }, fx: { happy: 4, rel: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai assumé. On m'appelle « Lapinou » depuis. Jusqu'au lycée, probablement.", "J'ai lu le mot fièrement. Gros silence. Puis un CM2 a crié « BÉBÉ ». C'est resté."], en: ["I owned it. They've called me “Bunny” ever since. Probably until high school.", "I read the note proudly. Dead silence. Then a fifth-grader yelled “BABY.” It stuck."] }, fx: { happy: -3, stress: 3 } },
        ],
      },
      {
        label: { fr: 'Échanger en douce', en: 'Trade it secretly' },
        out: [
          { w: 2, text: { fr: ["J'ai échangé mon déjeuner contre des chips et un bonbon collé à une gomme. Meilleur deal de ma vie.", "Troc réussi : mon déjeuner contre deux biscuits et une carte Pokémon tordue."], en: ["I traded my lunch for chips and a candy stuck to an eraser. Best deal of my life.", "Successful barter: my lunch for two cookies and a bent Pokémon card."] }, fx: { happy: 3, health: -1 } },
          { w: 1, text: { fr: ["{a.my} a retrouvé la boîte dans le cartable d'un autre enfant à la réunion parents-profs. Interrogatoire au retour.", "J'ai échangé, mais l'autre enfant a écrit un merci à {a.my}. Grillé{|e}."], en: ["{a.my} found the box in another kid's backpack at the parent-teacher meeting. Interrogation on the way home.", "I traded, but the other kid wrote a thank-you note to {a.my}. Busted."] }, fx: { rel: -4, discipline: 2 } },
        ],
      },
      {
        label: { fr: 'Le jeter à la poubelle', en: 'Bin it' },
        out: [
          { w: 1, text: { fr: ["J'ai tout jeté. J'ai eu faim tout l'après-midi et mon ventre a fait {w:sound} pendant la dictée.", "Poubelle. Mon estomac a hurlé tout l'après-midi. La maîtresse a cru à une alarme."], en: ["I threw it all out. I was starving all afternoon and my stomach made {w:sound} during the spelling test.", "Trash. My stomach screamed all afternoon. The teacher thought it was an alarm."] }, fx: { health: -2, happy: -2 } },
          { w: 1, text: { fr: ["J'ai jeté la boîte. La boîte était en Tupperware « de mamie ». {a.first} m'en parle encore.", "J'ai tout mis à la poubelle, boîte comprise. {a.first} a lancé un avis de recherche pour le Tupperware."], en: ["I threw out the box. It was grandma's heirloom Tupperware. {a.first} still brings it up.", "Everything went in the trash, box included. {a.first} put out a missing poster for the Tupperware."] }, fx: { rel: -6 } },
        ],
      },
    ],
  },
  {
    id: 'f2_par_science_fair',
    icon: '🌋',
    cat: 'family',
    rating: 0,
    actor: 'parent',
    scene: { place: 'school', mood: 'shock', prop: 'volcano' },
    when: { age: [7, 12], has: 'parent', school: 'any' },
    weight: 6,
    cooldown: 4,
    text: {
      fr: [
        "Exposé de sciences demain. {a.first} s'en charge « juste pour t'aider ». Il est 2 h du matin, {a.first} soude des fils dans le garage et tu n'as plus le droit d'approcher.",
        "Pour ton projet de sciences, {a.first} a construit un volcan de 1,20 m avec {w:object} et de la dynamite émotionnelle. Tu as fait l'étiquette. Elle est de travers.",
        "La maîtresse a demandé une maquette du système solaire. {a.first} a rendu un truc motorisé qui tourne, s'allume et joue {w:song}. Ton prénom est écrit dessus, en petit.",
        "{a.rel} prend ton projet de sciences un peu trop à cœur. Le thème, c'est « la germination ». {a.first} a commandé {w:animal} sur Internet « pour la mise en scène ».",
      ],
      en: [
        "Science project due tomorrow. {a.first} is handling it “just to help.” It's 2 a.m., {a.first} is soldering wires in the garage and you're no longer allowed near it.",
        "For your science project, {a.first} built a four-foot volcano out of {w:object} and pure emotional dynamite. You made the label. It's crooked.",
        "The teacher asked for a model of the solar system. {a.first} turned in a motorized thing that spins, lights up and plays {w:song}. Your name is on it, in small print.",
        "{a.first} is taking your science project way too seriously. The theme is “germination.” {a.first} ordered {w:animal} online “for staging.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Présenter comme si', en: 'Present it as mine' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai présenté le projet avec aplomb. Premier prix. La maîtresse a félicité {a.my}, qui a rougi comme une tomate.", "Premier prix. J'ai serré la main du directeur. {a.first} pleurait au fond de la salle."], en: ["I presented it with total confidence. First prize. The teacher congratulated {a.my}, who blushed like a tomato.", "First prize. I shook the principal's hand. {a.first} was crying at the back of the room."] }, fx: { grade: 6, happy: 5, rel: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["La maîtresse m'a demandé comment marchait le moteur. J'ai dit « avec de l'amour ». Zéro pointé pour tricherie parentale.", "Une question technique et tout s'est effondré. Le volcan a explosé sur le jury. C'était le seul truc que je comprenais."], en: ["The teacher asked how the motor worked. I said “with love.” Zero for parental cheating.", "One technical question and it all collapsed. The volcano erupted on the judges. The only part I understood."] }, fx: { grade: -5, happy: -3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Refaire le mien', en: 'Make my own instead' },
        out: [
          { w: 2, text: { fr: ["J'ai rendu mon propre projet : un haricot dans du coton. Il n'a pas poussé. Mais il est à moi.", "J'ai bricolé mon projet seul{|e}. C'était moche et honnête. {a.first} l'a pris en photo pour le frigo."], en: ["I turned in my own project: a bean in cotton wool. It didn't grow. But it's mine.", "I built my own project. It was ugly and honest. {a.first} photographed it for the fridge."] }, fx: { discipline: 4, smarts: 2, karma: 3 } },
          { w: 1, text: { fr: ["Mon haricot a germé pendant l'exposé, en direct, devant toute la classe. Moment de grâce botanique.", "Mon projet minable a eu un prix « coup de cœur ». Celui de {a.my} a été disqualifié pour « équipement industriel »."], en: ["My bean sprouted during the presentation, live, in front of everyone. A moment of botanical grace.", "My crappy project got a “heart award.” {a.first}'s was disqualified for “industrial equipment.”"] }, fx: { grade: 4, happy: 6 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Saboter le volcan', en: 'Sabotage it' },
        out: [
          { w: 1, text: { fr: ["J'ai doublé la dose de bicarbonate. Le gymnase a été évacué. {a.first} est fier{a:|e} en secret.", "J'ai trafiqué le mélange. Explosion violette, plafond repeint, légende instantanée."], en: ["I doubled the baking soda. The gym got evacuated. {a.first} is secretly proud.", "I tampered with the mix. Purple explosion, repainted ceiling, instant legend."] }, fx: { happy: 6, grade: -3, discipline: -2 }, mood: 'party' },
          { w: 1, text: { fr: ["Le sabotage a raté : le volcan a juste fait « pfff ». {a.first} a soupiré pendant tout le trajet du retour.", "J'ai voulu saboter, il ne s'est rien passé. Une mousse triste a coulé sur la table. Comme mes notes."], en: ["The sabotage failed: the volcano just went “pfff.” {a.first} sighed the entire ride home.", "I tried sabotage and nothing happened. A sad foam dribbled onto the table. Like my grades."] }, fx: { happy: -2, rel: -3 } },
        ],
      },
    ],
  },
  // ───────────────────────────── parents · teen years ─────────────────────────────
  {
    id: 'f2_par_diary',
    icon: '📓',
    cat: 'family',
    rating: 1,
    actor: 'parent',
    scene: { place: 'home', mood: 'angry', prop: 'diary' },
    when: { age: [12, 17], has: 'parent' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Tu rentres plus tôt et tu trouves {a.rel} assis{a:|e} sur ton lit, ton journal intime à la main, page 47. {a:Il|Elle} a des larmes aux yeux et un surligneur.",
        "{a.first} cite au dîner, mot pour mot, une phrase de ton journal intime. Celle où tu traites ton prof de maths de « {w:insult} ». Personne ne mange.",
        "Ton journal intime n'est plus sous ton matelas. Il est sur la table de la cuisine, posé contre {w:food}, avec un post-it de {a.first} : « Il faut qu'on parle ».",
        "{a.rel} a lu ton journal. Tu le sais parce que {a:il|elle} a corrigé tes fautes d'orthographe au stylo rouge et ajouté « [[bien vu|pas d'accord|on en reparle]] » dans la marge.",
      ],
      en: [
        "You get home early and find {a.first} sitting on your bed, your diary in hand, page 47. {a:He|She} has tears in {a:his|her} eyes and a highlighter.",
        "At dinner, {a.first} quotes, word for word, a line from your diary. The one where you called your math teacher a “{w:insult}.” Nobody eats.",
        "Your diary is no longer under your mattress. It's on the kitchen table, next to {w:food}, with a sticky note from {a.first}: “We need to talk.”",
        "{a.first} read your diary. You know because {a:he|she} corrected your spelling in red ink and wrote “[[good point|disagree|let's discuss]]” in the margin.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exploser de rage', en: 'Explode with rage' },
        out: [
          { w: 1, text: { fr: ["J'ai hurlé « VIOLATION DE MA VIE PRIVÉE » si fort que les voisins ont applaudi. {a.first} s'est excusé{a:|e}. Une première historique.", "J'ai fait une scène digne d'un Oscar. {a.first} a reculé, s'est excusé{a:|e} et m'a acheté un cadenas."], en: ["I screamed “INVASION OF MY PRIVACY” so loud the neighbors applauded. {a.first} apologized. A historic first.", "I threw an Oscar-worthy fit. {a.first} backed down, apologized and bought me a padlock."] }, fx: { happy: 3, rel: -4, stress: -2 } },
          { w: 1, text: { fr: ["J'ai claqué la porte. {a.first} a enlevé la porte de ses gonds. Plus de porte, plus de claquements. Échec et mat.", "J'ai crié. {a.first} a crié plus fort, en citant des passages. On a perdu tous les deux."], en: ["I slammed the door. {a.first} took the door off its hinges. No door, no slamming. Checkmate.", "I yelled. {a.first} yelled louder, quoting passages. We both lost."] }, fx: { happy: -5, rel: -8, stress: 5 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Écrire un faux journal', en: 'Start a decoy diary' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai écrit un faux journal où je suis un ange qui adore ranger sa chambre. {a.first} l'a lu et m'a augmenté mon argent de poche.", "J'ai planqué un faux journal plein de gratitude envers {a.my}. Le vrai est dans une boîte de tampons. Personne ne cherche là."], en: ["I wrote a fake diary where I'm an angel who loves cleaning my room. {a.first} read it and raised my allowance.", "I planted a decoy diary full of gratitude toward {a.my}. The real one is in a box of tampons. Nobody looks there."] }, fx: { smarts: 3, happy: 4, money: 20 }, mood: 'proud' },
          { w: 1, text: { fr: ["Mon faux journal était trop parfait. {a.first} a cru que j'étais sous emprise d'une secte et m'a envoyé{|e} chez un psy.", "J'ai trop forcé sur le faux journal. {a.first} a pleuré d'inquiétude : « Tu n'es pas comme ça ! »"], en: ["My decoy diary was too perfect. {a.first} thought I'd joined a cult and sent me to a therapist.", "I overdid the decoy diary. {a.first} cried with worry: “That's not who you are!”"] }, fx: { stress: 4, money: -60 } },
        ],
      },
      {
        label: { fr: 'Lire le sien', en: 'Read theirs back' },
        out: [
          { w: 1, text: { fr: ["J'ai trouvé les vieux journaux de {a.my}, de quand {a:il|elle} avait mon âge. Je connais maintenant ses années « gothique ». Équilibre de la terreur.", "J'ai fouillé et trouvé les lettres d'ado de {a.my}. Pacte de non-agression signé le soir même."], en: ["I found {a.my}'s old diaries from when {a:he|she} was my age. I now know about the goth years. Balance of terror.", "I dug around and found {a.my}'s teenage letters. Non-aggression pact signed that very evening."] }, fx: { happy: 5, rel: 3, smarts: 1 } },
          { w: 1, text: { fr: ["J'ai cherché le journal de {a.my}. J'ai trouvé ses relevés bancaires. On est très pauvres. Ça a calmé tout le monde.", "En fouillant, je suis tombé{|e} sur des factures {w:brand}. Personne n'a gagné ce jour-là."], en: ["I looked for {a.my}'s diary. I found the bank statements. We're very poor. That calmed everyone down.", "Digging around, I found bills from {w:brand}. Nobody won that day."] }, fx: { happy: -4, stress: 4 }, mood: 'sad' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_tracker',
    icon: '📍',
    cat: 'family',
    rating: 1,
    actor: 'parent',
    scene: { place: 'home', mood: 'shock', prop: 'phone' },
    when: { age: [13, 17], has: 'parent' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "{a.rel} a installé une appli de géolocalisation sur ton téléphone. À 23 h 04, tu reçois un message : « Pourquoi tu es {w:at_place} ? » Tu étais censé{|e} être chez un copain.",
        "{a.first} t'annonce, très fier{a:|e}, que ton téléphone est maintenant « partagé avec la famille ». Tradition : {a:il|elle} voit tout, toi rien. Comme la Corée du Nord, mais avec des nuggets.",
        "Tu découvres une balise GPS cousue dans la doublure de ton blouson. {a.first} nie, puis avoue « l'avoir mise sur le chien d'abord ». Vous n'avez pas de chien.",
        "Message de {a.first} à 22 h : « Tu es à 340 m de la maison, immobile depuis 1 h. Tu es mort{|e} ou amoureux{|se} ? » [[Les deux, peut-être.|Aucune idée.|Tu hésites.]]",
      ],
      en: [
        "{a.first} installed a location tracker on your phone. At 11:04 p.m. you get a text: “Why are you {w:at_place}?” You were supposed to be at a friend's.",
        "{a.first} proudly announces your phone is now “shared with the family.” Tradition: {a:he|she} sees everything, you see nothing. Like North Korea, but with nuggets.",
        "You find a GPS tag sewn into the lining of your jacket. {a.first} denies it, then admits {a:he|she} “put it on the dog first.” You don't have a dog.",
        "Text from {a.first} at 10 p.m.: “You're 340 meters from home, motionless for an hour. Are you dead or in love?” [[Maybe both.|No idea.|Tough call.]]",
      ],
    },
    choices: [
      {
        label: { fr: 'Pirater l\'appli', en: 'Hack the app' },
        out: [
          { w: 1, odds: { smarts: 2 }, text: { fr: ["J'ai trafiqué l'appli : selon elle, je passe mes soirées à la bibliothèque municipale. {a.first} se vante de moi au travail.", "J'ai programmé un faux trajet maison-bibliothèque. {a.first} m'a offert un cadeau pour ma « studiosité »."], en: ["I rigged the app: according to it I spend every night at the public library. {a.first} brags about me at work.", "I scripted a fake home-library route. {a.first} bought me a gift for being so studious."] }, fx: { smarts: 4, happy: 5, karma: -2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai voulu pirater l'appli. J'ai partagé ma position avec tous mes contacts, dont mon prof de sport. Il est passé me dire bonjour.", "Piratage raté : mon téléphone affiche maintenant la position de {a.my} en permanence. {a:Il|Elle} va au PMU tous les jours à 15 h."], en: ["I tried to hack the app. I shared my location with all my contacts, including my PE teacher. He stopped by to say hi.", "Hack failed: my phone now shows {a.my}'s location at all times. {a:He|She} goes to the betting bar every day at 3 p.m."] }, fx: { happy: -2, smarts: 1 } },
        ],
      },
      {
        label: { fr: 'Laisser le tel au chien', en: 'Leave the phone home' },
        out: [
          { w: 2, text: { fr: ["J'ai laissé mon téléphone à la maison pour sortir. Liberté totale. J'ai découvert qu'on peut se perdre sans GPS. Je me suis perdu{|e}.", "Téléphone sur la table de nuit, moi en soirée. {a.first} est fier{a:|e} de mes « longues nuits de sommeil »."], en: ["I left my phone home and went out. Total freedom. I learned you can get lost without GPS. I got lost.", "Phone on the nightstand, me at a party. {a.first} is proud of my “long nights of sleep.”"] }, fx: { happy: 5, discipline: -2 }, mood: 'party' },
          { w: 1, text: { fr: ["{a.my} a appelé mon téléphone pour vérifier. C'est mon petit frère qui a répondu « il dort ». Je n'ai pas de petit frère, c'était le voisin.", "{a.my} a appelé quinze fois mon téléphone resté à la maison, puis la police. Retour en voiture de patrouille."], en: ["{a.my} called my phone to check. My little brother answered “they're asleep.” I don't have a little brother, it was the neighbor.", "{a.my} called my phone fifteen times, then the police. I came home in a patrol car."] }, fx: { rel: -8, stress: 6, heat: 2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Négocier un traité', en: 'Negotiate a treaty' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["Traité signé : je garde l'appli, mais {a.my} partage aussi sa position. Je sais maintenant qu'{a:il|elle} va chercher {w:food} en cachette à minuit.", "On a signé un accord en trois points sur une serviette en papier. Il tient toujours. La serviette est encadrée."], en: ["Treaty signed: I keep the app, but {a.my} shares {a:his|her} location too. I now know {a:he|she} sneaks out for {w:food} at midnight.", "We signed a three-point agreement on a paper napkin. It still holds. The napkin is framed."] }, fx: { rel: 6, happy: 3 } },
          { w: 1, text: { fr: ["La négociation a duré quatre heures. On a fini par se disputer sur la définition du mot « confiance ». Rien n'a changé.", "J'ai négocié comme un avocat. {a.first} a répondu « parce que c'est comme ça ». Aucun tribunal ne bat cet argument."], en: ["Negotiations lasted four hours. We ended up arguing over the definition of “trust.” Nothing changed.", "I negotiated like a lawyer. {a.first} replied “because I said so.” No court beats that argument."] }, fx: { stress: 4, happy: -2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_par_cool_slang',
    icon: '🤙',
    cat: 'family',
    rating: 0,
    actor: 'parent',
    scene: { place: 'home', mood: 'shock', prop: 'cap' },
    when: { age: [13, 17], has: 'parent' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Tes potes sont à la maison. {a.first} débarque avec une casquette à l'envers et lance : « Alors les jeunes, c'est quoi le délire ? C'est [[gênant|chanmé|le seum]] ? » Silence de mort.",
        "{a.first} essaie d'être cool devant tes amis. {a:Il|Elle} vient de dire « wesh » trois fois, a mentionné {w:celeb} et veut vous initier à sa passion : {w:hobby}. Tu veux disparaître.",
        "{a.first} a créé un compte sur {w:app} et commente toutes tes publications avec « trop stylé mon cœur 🔥🔥 ». Tes amis ont fait des captures d'écran.",
        "Pendant ton anniversaire, {a.rel} met {w:song} à fond et tente une danse « que font les jeunes ». Tes amis filment. Tu regardes la sortie de secours.",
      ],
      en: [
        "Your friends are over. {a.first} walks in wearing a backwards cap: “So, kids, what's the vibe? Is it [[cringe|lit|sus]]?” Dead silence.",
        "{a.first} is trying to be cool in front of your friends. {a:He|She} has said “bro” three times, mentioned {w:celeb} and wants to get you all into {a:his|her} passion: {w:hobby}. You want to evaporate.",
        "{a.first} made an account on {w:app} and comments on all your posts with “so cool sweetie 🔥🔥.” Your friends took screenshots.",
        "At your birthday, {a.first} blasts {w:song} and tries a dance “the kids do.” Your friends are filming. You're eyeing the emergency exit.",
      ],
    },
    choices: [
      {
        label: { fr: 'Fuir la pièce', en: 'Flee the room' },
        out: [
          { w: 1, text: { fr: ["J'ai fui. Mes amis sont restés avec {a.my}. Ils l'adorent. Je suis devenu{|e} la personne la moins cool de ma propre maison.", "Je suis parti{|e} m'enfermer. Une heure après, mes potes jouaient aux cartes avec {a.my}. Trahison."], en: ["I fled. My friends stayed with {a.my}. They love {a:him|her}. I'm now the least cool person in my own house.", "I locked myself in my room. An hour later my friends were playing cards with {a.my}. Betrayal."] }, fx: { happy: -3, rel: 2 } },
          { w: 1, text: { fr: ["J'ai fui, mais la vidéo de la danse a fait 40 000 vues. {a.first} est une star. Pas moi.", "Je suis sorti{|e} en courant. La vidéo a fait le tour du lycée. Mon surnom : « l'enfant de la danse »."], en: ["I fled, but the dance video got 40,000 views. {a.first} is a star. I'm not.", "I ran out. The video went around school. My nickname: “the dance kid.”"] }, fx: { happy: -5, followers: 200 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Danser avec', en: 'Join the dance' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["Je me suis joint{|e} à la danse. Ironie totale, mes amis ont trouvé ça génial. Duo légendaire.", "J'ai dansé avec {a.my}. On était ridicules et magnifiques. Les potes ont rejoint la chorégraphie."], en: ["I joined the dance. Total irony, my friends loved it. Legendary duo.", "I danced with {a.my}. We were ridiculous and magnificent. My friends joined the choreography."] }, fx: { happy: 7, rel: 8 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai voulu danser, je me suis pris le pied dans le tapis et j'ai fini dans le gâteau. {a.first} a dit « c'est ça, la vibe ».", "On a dansé, {a.my} s'est bloqué le dos. Fin de soirée aux urgences, en musique."], en: ["I tried to dance, tripped on the rug and landed in the cake. {a.first} said “that's the vibe.”", "We danced, {a.my} threw out {a:his|her} back. The party ended at the ER, with music."] }, fx: { happy: 2, health: -2, rel: 4 } },
        ],
      },
      {
        label: { fr: 'Parler en vieux', en: 'Talk like a boomer' },
        out: [
          { w: 1, text: { fr: ["J'ai répondu en parlant comme un notaire de 1950. {a.first} a compris le message et s'est retiré{a:|e} dignement.", "J'ai contre-attaqué en vouvoyant {a.my} devant tout le monde. Malaise réciproque, match nul."], en: ["I answered like a 1950s notary. {a.first} got the message and withdrew with dignity.", "I counterattacked by addressing {a.my} formally in front of everyone. Mutual cringe, a draw."] }, fx: { smarts: 2, rel: -2, happy: 2 } },
          { w: 1, text: { fr: ["J'ai parlé « en vieux » pour me moquer. Mes amis ont cru que c'était un nouveau délire et l'ont adopté. Tout le lycée vouvoie maintenant.", "Ma contre-attaque a lancé une mode. Je suis cool, par accident."], en: ["I talked like a boomer to mock {a:him|her}. My friends thought it was a new trend and adopted it. Now the whole school talks like that.", "My counterattack started a trend. I'm cool, by accident."] }, fx: { happy: 6, fame: 1 }, mood: 'proud' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_door_slam',
    icon: '🚪',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    scene: { place: 'home', mood: 'angry', prop: 'door' },
    when: { age: [13, 17], has: 'parent' },
    weight: 7,
    cooldown: 3,
    text: {
      fr: [
        "Engueulade du siècle avec {a.rel}, déclenchée par {w:object} laissé dans l'évier. En dix minutes, vous en êtes à ressortir des trucs de 2014. {a.first} est rouge comme une tomate qui va exploser.",
        "{a.first} hurle « TANT QUE TU VIS SOUS MON TOIT ! » pour la 600e fois. Tu réponds « {w:insult} ! » tout bas. Pas assez bas.",
        "Dispute monumentale : {a.first} veut que tu ranges ta chambre, qui dégage {w:smell}. Tu veux qu'{a:il|elle} respecte ton « écosystème ». Quelque chose y vit, effectivement.",
        "{a.rel} et toi, face à face dans le couloir, comme deux cowboys. L'enjeu : le Wi-Fi coupé à 22 h. {a.first} tient la box sous le bras comme un otage.",
      ],
      en: [
        "Fight of the century with {a.first}, triggered by {w:object} left in the sink. Ten minutes in, you're digging up stuff from 2014. {a.first} is red like a tomato about to burst.",
        "{a.first} yells “AS LONG AS YOU LIVE UNDER MY ROOF!” for the 600th time. You mutter “{w:insult}!” under your breath. Not quite under enough.",
        "Monumental fight: {a.first} wants you to clean your room, which gives off {w:smell}. You want {a:him|her} to respect your “ecosystem.” Something does live in there.",
        "{a.first} and you, face to face in the hallway, like two cowboys. The stakes: Wi-Fi cut off at 10 p.m. {a.first} holds the router under {a:his|her} arm like a hostage.",
      ],
    },
    choices: [
      {
        label: { fr: 'Claquer la porte', en: 'Slam the door' },
        out: [
          { w: 2, text: { fr: ["J'ai claqué la porte si fort que le cadre photo de mamie est tombé, la vitre a explosé et le chat s'est pissé dessus. Victoire morale.", "J'ai claqué ma porte. Un bout de plâtre est tombé sur la tête de {a.my}, qui m'a traité{|e} de démolisseur à travers le bois."], en: ["I slammed the door so hard grandma's photo frame fell, the glass shattered and the cat peed itself. Moral victory.", "I slammed my door. A chunk of plaster fell on {a.my}'s head, and {a:he|she} called me a wrecking ball through the wood."] }, fx: { happy: 2, rel: -6, stress: -3 }, mood: 'angry' },
          { w: 1, text: { fr: ["J'ai claqué la porte sur mes propres doigts. J'ai hurlé, j'ai pissé le sang sur la moquette, et c'est {a.my} qui m'a soigné{|e} en soupirant. Humiliation totale.", "Porte claquée, petit doigt coincé dedans. Ongle arraché, sang partout, dispute annulée pour raisons médicales."], en: ["I slammed the door on my own fingers. I screamed, bled all over the carpet, and {a.my} patched me up with a sigh. Total humiliation.", "Door slammed, pinky caught in it. Nail torn off, blood everywhere, fight cancelled for medical reasons."] }, fx: { health: -5, happy: -4, rel: 3, visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Fuguer (jusqu\'au coin)', en: 'Run away (to the corner)' },
        out: [
          { w: 2, text: { fr: ["J'ai fugué. Jusqu'à l'abribus. Trois heures {w:weather}. Je suis rentré{|e} pour le dîner. Il y avait des frites, par chance.", "Fugue héroïque jusqu'au parc. J'ai partagé {w:food} avec un SDF qui m'a conseillé de rentrer. Il avait raison."], en: ["I ran away. To the bus stop. Three hours {w:weather}. I came back for dinner. There were fries, luckily.", "Heroic escape to the park. I shared {w:food} with a homeless guy who told me to go home. He was right."] }, fx: { happy: -2, health: -2, rel: 2 } },
          { w: 1, text: { fr: ["J'ai fugué. Personne ne s'en est rendu compte. Je suis rentré{|e} au bout de six heures. {a.first} : « Tu peux mettre la table ? »", "Ma fugue a duré une nuit chez un pote. {a.first} avait déjà loué ma chambre sur Airbnb. Blague. Je crois."], en: ["I ran away. Nobody noticed. I came back after six hours. {a.first}: “Can you set the table?”", "My escape lasted one night at a friend's. {a.first} had already listed my room on Airbnb. Joke. I think."] }, fx: { happy: -5, stress: 3 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Insulter en latin', en: 'Insult in Latin' },
        out: [
          { w: 1, odds: { smarts: 2 }, text: { fr: ["J'ai insulté {a.my} en latin. {a:Il|Elle} n'a rien compris mais a été tellement impressionné{a:|e} qu'{a:il|elle} m'a payé des cours.", "Je l'ai traité{a:|e} de vieux fossile en latin de cuisine. {a.first} a cru à une prière. Paix rétablie."], en: ["I insulted {a.my} in Latin. {a:He|She} understood nothing but was so impressed {a:he|she} paid for lessons.", "I called {a:him|her} an old fossil in pig Latin. {a.first} thought it was a prayer. Peace restored."] }, fx: { smarts: 3, happy: 4 } },
          { w: 1, text: { fr: ["{a.my} a fait latin au lycée. {a:Il|Elle} a tout compris et m'a répondu en grec ancien. Privé{|e} de sortie un mois.", "J'ai sorti « Merdus maximus ». {a.first} a répondu avec une gifle en français parfaitement compréhensible."], en: ["{a.my} took Latin in high school. {a:He|She} understood everything and answered in ancient Greek. Grounded for a month.", "I said “Crappus maximus.” {a.first} replied with a slap in perfectly understandable English."] }, fx: { happy: -5, rel: -6, discipline: 3 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_midlife',
    icon: '🏍️',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    vars: { amount: [8000, 30000] },
    scene: { place: 'home', mood: 'shock', prop: 'motorcycle' },
    when: { age: [12, 30], has: 'parent' },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "{a.rel} fait sa crise de la cinquantaine : {w:vehicle} à {$amount}, un tatouage tribal sur le mollet et un nouveau look « surfeur de Biarritz ». {a:Il|Elle} ne sait pas nager.",
        "{a.first} s'est fait poser des facettes dentaires fluo, s'habille chez {w:brand} rayon ados et dit « on se capte » au boulanger. La crise de la cinquantaine a frappé fort.",
        "{a.first} a vidé l'épargne familiale ({$amount}) pour monter un groupe de rock avec ses potes de lycée. Nom du groupe : « Les Prostates Rebelles ». Premier concert : {w:at_place}.",
        "{a.rel} est rentré{a:|e} avec un piercing au téton, {w:vehicle} et la ferme intention de « vivre sa vie ». Tu as surpris son « coach personnel » de 26 ans dans la cuisine, en peignoir.",
      ],
      en: [
        "{a.first} is having a midlife crisis: {w:vehicle} for {$amount}, a tribal tattoo on the calf and a new “Malibu surfer” look. {a:He|She} can't swim.",
        "{a.first} got neon veneers, shops at {w:brand} in the teen section and tells the baker “catch you later, fam.” The midlife crisis hit hard.",
        "{a.first} emptied the family savings ({$amount}) to start a rock band with high-school buddies. Band name: “The Rebel Prostates.” First gig: {w:at_place}.",
        "{a.first} came home with a nipple piercing, {w:vehicle} and a firm plan to “live a little.” You caught {a:his|her} 26-year-old “personal coach” in the kitchen, in a bathrobe.",
      ],
    },
    choices: [
      {
        label: { fr: 'Soutenir à fond', en: 'Full support' },
        out: [
          { w: 1, text: { fr: ["J'ai soutenu {a.my}. Concert {w:at_place} devant onze personnes, dont six de la famille. {a:Il|Elle} a jeté son slip dans le public. Image indélébile, gravée au fer rouge.", "J'ai encouragé {a.my}. {a:Il|Elle} a pleuré de joie, puis s'est vautré{a:|e} avec son engin dans une haie. Bras plâtré, sourire intact."], en: ["I supported {a.my}. Gig {w:at_place} in front of eleven people, six of them family. {a:He|She} threw underwear into the crowd. An image branded into my brain forever.", "I cheered {a.my} on. {a:He|She} cried with joy, then crashed {a:his|her} ride into a hedge. Arm in a cast, smile intact."] }, fx: { rel: 10, happy: 3 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai soutenu, et {a.my} m'a demandé{|e} de jouer de la batterie. On est maintenant un groupe père-enfant. Les voisins ont porté plainte deux fois.", "Je l'ai soutenu{a:|e}. Résultat : je suis roadie bénévole, je porte les amplis et je ramasse le vomi après les concerts."], en: ["I supported {a:him|her}, and {a.my} asked me to play drums. We're now a parent-child band. The neighbors filed two complaints.", "I backed {a:him|her}. Result: I'm an unpaid roadie, carrying amps and mopping up vomit after shows."] }, fx: { rel: 6, happy: -2, stress: 4 } },
        ],
      },
      {
        label: { fr: 'Intervention familiale', en: 'Stage an intervention' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["Intervention réussie. {a.first} a revendu l'engin, gardé le tatouage et pleuré sur l'épaule de mamie. On a mangé {w:food} pour fêter le retour à la normale.", "On a fait une intervention avec des pancartes. {a.first} a craqué et avoué avoir peur de vieillir. Câlin collectif, malaise collectif."], en: ["Intervention successful. {a.first} sold the ride, kept the tattoo and cried on grandma's shoulder. We ate {w:food} to celebrate normality.", "We staged an intervention with signs. {a.first} broke down and admitted {a:he|she}'s scared of getting old. Group hug, group awkwardness."] }, fx: { rel: 4, happy: 3 } },
          { w: 1, text: { fr: ["L'intervention a dégénéré. {a.first} a crié « VOUS NE ME COMPRENEZ PAS » et s'est barré{a:|e} {w:far_place} pendant trois semaines.", "L'intervention a mal tourné : {a.my} a démarré sa bécane dans le salon. Le pot d'échappement a cramé le canapé."], en: ["The intervention went south. {a.first} yelled “YOU DON'T UNDERSTAND ME” and ran off, ending up {w:far_place} for three weeks.", "Intervention gone wrong: {a.my} revved the bike in the living room. The exhaust torched the couch."] }, fx: { rel: -10, happy: -4, stress: 5 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Emprunter l\'engin', en: 'Borrow the ride' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: ["J'ai emprunté l'engin en douce. Meilleure journée de ma vie. Je l'ai rendu avec le plein. {a.first} n'a rien vu.", "Balade secrète sur la machine de crise de {a.my}. J'ai fait coucou à mon prof de maths. Il m'a envié."], en: ["I borrowed the ride on the sly. Best day of my life. I brought it back with a full tank. {a.first} never knew.", "Secret joyride on {a.my}'s crisis machine. I waved at my math teacher. He was jealous."] }, fx: { happy: 8 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai emprunté l'engin. J'ai fini dans une fontaine, avec un pigeon écrasé collé au pare-brise et des plumes partout. {a.first} a hurlé plus pour le pigeon que pour moi.", "Je l'ai planté dans un rond-point. Il y avait du sang, de l'huile et des morceaux de nain de jardin partout. Ma crise de la cinquantaine à moi a duré onze secondes."], en: ["I borrowed it. I ended up in a fountain with a squashed pigeon glued to the windshield and feathers everywhere. {a.first} screamed more for the pigeon than for me.", "I wrecked it in a roundabout. There was blood, oil and garden-gnome shrapnel everywhere. My own midlife crisis lasted eleven seconds."] }, fx: { health: -8, rel: -10, money: -500, visual: 'gore' }, mood: 'shock' },
        ],
      },
    ],
  },
  // ───────────────────────────── parents · adult life ─────────────────────────────
  {
    id: 'f2_par_guilt_call',
    icon: '☎️',
    cat: 'family',
    rating: 0,
    actor: 'parent',
    scene: { place: 'apartment', mood: 'sad', prop: 'phone' },
    when: { age: [20, 60], has: 'parent', movedOut: true },
    weight: 9,
    cooldown: 3,
    text: {
      fr: [
        "{a.rel} t'appelle {w:time} : « Ah, tu es vivant{|e} ? Je me demandais. Je l'ai appris par ta tante, que tu respirais encore. » Soupir de 14 secondes.",
        "Message vocal de {a.first}, 4 min 30 : un long silence, {w:sound}, puis « Bon. C'est rien. Personne ne m'appelle, mais c'est rien. »",
        "{a.first} t'appelle pour te dire qu'{a:il|elle} a vu {w:animal} {w:at_place} et que « ça lui a fait penser à toi, vu que tu ne donnes jamais de nouvelles ».",
        "« Je ne veux pas te déranger, hein. Je sais que tu es très occupé{|e}. » {a.first} a dit ça cinq fois en deux minutes, avec la voix d'un violon triste.",
      ],
      en: [
        "{a.first} calls you {w:time}: “Oh, you're alive? I was wondering. I had to hear it from your aunt that you were still breathing.” A 14-second sigh.",
        "Voicemail from {a.first}, 4 min 30: a long silence, {w:sound}, then “Well. It's nothing. Nobody calls me, but it's nothing.”",
        "{a.first} calls to say {a:he|she} saw {w:animal} {w:at_place} and “it made me think of you, since you never call.”",
        "“I don't want to bother you. I know you're very busy.” {a.first} said that five times in two minutes, in the voice of a sad violin.",
      ],
    },
    choices: [
      {
        label: { fr: 'Appeler une heure', en: 'Talk for an hour' },
        out: [
          { w: 2, text: { fr: ["J'ai appelé {a.my} une heure. On a parlé des voisins, de la météo et des intestins de tonton. J'ai raccroché le cœur léger et l'oreille en feu.", "Une heure au téléphone avec {a.my}. J'ai appris que la boulangère divorce et que le chien des voisins est « bizarre ». Mission accomplie."], en: ["I called {a.my} for an hour. We talked about the neighbors, the weather and uncle's bowels. I hung up with a light heart and a burning ear.", "An hour on the phone with {a.my}. I learned the baker is divorcing and the neighbors' dog is “weird.” Mission accomplished."] }, fx: { rel: 8, happy: 3, stress: -1 }, mood: 'happy' },
          { w: 1, text: { fr: ["L'appel a duré trois heures. Au bout de deux, {a.my} m'a demandé quand je comptais faire des enfants. J'ai simulé un tunnel.", "J'ai appelé, {a.my} a parlé 58 minutes sans respirer, puis m'a dit « bon, je te laisse, tu n'as jamais le temps »."], en: ["The call lasted three hours. Two hours in, {a.my} asked when I'm having kids. I faked a tunnel.", "I called, {a.my} talked for 58 minutes without breathing, then said “well, I'll let you go, you never have time.”"] }, fx: { rel: 4, stress: 4 } },
        ],
      },
      {
        label: { fr: 'Répondre par texto', en: 'Reply by text' },
        out: [
          { w: 1, text: { fr: ["J'ai envoyé « Bisous, débordé{|e} ! ». {a.first} m'a répondu par une photo floue de son pied et « ok ». Je ne sais pas comment l'interpréter.", "Texto envoyé. {a.first} a répondu en vocal de 8 minutes. Le texto a servi à rien."], en: ["I sent “Love you, swamped!” {a.first} replied with a blurry photo of {a:his|her} foot and “ok.” I don't know how to read that.", "Text sent. {a.first} replied with an 8-minute voice memo. The text was pointless."] }, fx: { rel: -2 } },
          { w: 1, text: { fr: ["J'ai répondu par un émoji cœur. {a.first} l'a pris comme une déclaration de guerre : « Un dessin ? Après tout ce que j'ai fait ? »", "Mon texto a été lu à voix haute à tout le repas de famille comme preuve de mon ingratitude."], en: ["I replied with a heart emoji. {a.first} took it as a declaration of war: “A drawing? After everything I've done?”", "My text was read aloud at the family dinner as proof of my ingratitude."] }, fx: { rel: -6, stress: 3 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Débarquer en vrai', en: 'Show up in person' },
        out: [
          { w: 2, text: { fr: ["J'ai débarqué sans prévenir avec {w:gift}. {a.first} a pleuré, m'a nourri{|e} comme une oie et m'a rendu{|e} avec trois Tupperware.", "Visite surprise ! {a.first} a appelé tout le quartier pour qu'on me voie. J'ai serré 30 mains et mangé deux gâteaux."], en: ["I showed up unannounced with {w:gift}. {a.first} cried, fed me like a foie-gras goose and sent me home with three Tupperwares.", "Surprise visit! {a.first} called the whole street over to see me. I shook 30 hands and ate two cakes."] }, fx: { rel: 12, happy: 5, weight: 0.02 }, mood: 'love' },
          { w: 1, text: { fr: ["Je suis arrivé{|e} par surprise. {a.first} n'était pas là : {a:il|elle} était parti{a:|e} en croisière sans le dire à personne. La culpabilité a changé de camp.", "Visite surprise. {a.first} était en plein cours de zumba dans le salon avec six voisins. On a fait comme si de rien n'était."], en: ["I showed up by surprise. {a.first} wasn't there: {a:he|she} had gone on a cruise without telling anyone. The guilt switched sides.", "Surprise visit. {a.first} was mid-Zumba in the living room with six neighbors. We all pretended this was normal."] }, fx: { happy: 4, rel: 3 } },
        ],
      },
    ],
  },
  {
    id: 'f2_par_tech_support',
    icon: '💻',
    cat: 'family',
    rating: 0,
    actor: 'parent',
    scene: { place: 'home', mood: 'neutral', prop: 'laptop' },
    when: { age: [18, 60], has: 'parent' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Appel vidéo avec {a.rel}. Tu vois son menton, son plafond et une oreille. {a.first} hurle « TU M'ENTENDS ? » en tenant la tablette comme un plateau de fromages.",
        "{a.first} a « cassé Internet ». En vrai, {a:il|elle} a installé {w:app} 14 fois et cliqué sur une pub pour {w:object} gratuit. L'ordinateur fait {w:sound}.",
        "{a.rel} t'envoie un message : « COMMENT ON ENLÈVE LES MAJUSCULES ». Puis : « ET LE PETIT CHAT QUI S'AFFICHE PARTOUT ? » Tu sens que ta journée est fichue.",
        "{a.first} veut que tu lui expliques {w:app} « en deux minutes ». C'est la septième fois. {a:Il|Elle} a noté le mot de passe sur un post-it collé à l'écran : « motdepasse ».",
      ],
      en: [
        "Video call with {a.first}. You can see {a:his|her} chin, the ceiling and one ear. {a.first} yells “CAN YOU HEAR ME?” while holding the tablet like a cheese platter.",
        "{a.first} “broke the internet.” Actually, {a:he|she} installed {w:app} 14 times and clicked an ad for free {w:object}. The computer makes {w:sound}.",
        "{a.first} texts you: “HOW DO I TURN OFF CAPITALS.” Then: “AND THE LITTLE CAT THAT POPS UP EVERYWHERE?” You can feel your day dying.",
        "{a.first} wants you to explain {w:app} “in two minutes.” It's the seventh time. The password is on a sticky note on the screen: “password.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Patience d\'ange', en: 'Angelic patience' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai tout réparé avec patience. {a.first} a appris à faire un selfie. J'en reçois maintenant 40 par jour, tous en contre-plongée.", "Deux heures d'explications. {a.first} a compris. Puis tout oublié. Mais le câlin à la fin valait le coup."], en: ["I fixed everything patiently. {a.first} learned to take selfies. I now get 40 a day, all from below the chin.", "Two hours of explanations. {a.first} got it. Then forgot it all. But the hug at the end was worth it."] }, fx: { rel: 8, karma: 3, stress: 2 } },
          { w: 1, text: { fr: ["J'ai été patient{|e}. {a.first} m'a remercié{|e} en me transférant 150 chaînes de mails affirmant {w:conspiracy}.", "J'ai tout expliqué calmement. {a.first} a conclu : « C'était mieux avant, avec le Minitel. »"], en: ["I was patient. {a.first} thanked me by forwarding 150 chain emails claiming {w:conspiracy}.", "I explained it all calmly. {a.first} concluded: “It was better back in the fax days.”"] }, fx: { rel: 4, stress: 4 } },
        ],
      },
      {
        label: { fr: 'Prendre le contrôle', en: 'Remote takeover' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai pris le contrôle à distance. J'ai découvert son historique de recherche : « {w:celeb} torse nu » et « comment cuire {w:food} ». J'ai tout réparé et rien dit.", "Contrôle à distance, ménage complet. J'ai supprimé 46 barres d'outils et un antivirus russe. {a.first} trouve que l'ordi « va trop vite maintenant »."], en: ["I took remote control. I found {a:his|her} search history: “{w:celeb} shirtless” and “how to cook {w:food}.” I fixed everything and said nothing.", "Remote control, full cleanup. I deleted 46 toolbars and a Russian antivirus. {a.first} says the computer is “too fast now.”"] }, fx: { smarts: 2, rel: 5 } },
          { w: 1, text: { fr: ["Pendant que je réparais à distance, {a.my} bougeait la souris en même temps « pour aider ». On a supprimé le système d'exploitation à deux.", "J'ai pris la main et {a.my} a débranché l'ordi « pour voir si ça marche mieux ». Ça ne marche plus du tout."], en: ["While I was fixing it remotely, {a.my} kept moving the mouse “to help.” Together we deleted the operating system.", "I took over and {a.my} unplugged the computer “to see if that helps.” It no longer works at all."] }, fx: { stress: 6, money: -150 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Raccrocher, réseau !', en: 'Fake a bad signal' },
        out: [
          { w: 1, text: { fr: ["J'ai fait « krrrr… tu coupes… krrr » et raccroché. {a.first} a appelé toute la famille, qui m'a fait la morale au repas de Noël.", "Faux problème de réseau. {a.first} a réessayé 22 fois. J'ai fini par répondre, vaincu{|e}."], en: ["I went “krrrr… you're breaking up… krrr” and hung up. {a.first} called the whole family, who lectured me at Christmas dinner.", "Fake bad signal. {a.first} tried 22 more times. I finally answered, defeated."] }, fx: { rel: -4, karma: -2 } },
          { w: 1, text: { fr: ["J'ai raccroché. {a.first} a trouvé de l'aide auprès d'un « technicien » au téléphone, qui lui a vidé son compte. Culpabilité éternelle.", "J'ai simulé une coupure. Le lendemain, {a.my} avait acheté un nouvel ordinateur à 2 000 € pour un problème de volume."], en: ["I hung up. {a.first} got help from a “technician” on the phone, who drained {a:his|her} bank account. Eternal guilt.", "I faked a dropped call. The next day {a.my} had bought a $2,000 computer to fix a volume problem."] }, fx: { rel: -6, happy: -5, karma: -3 }, mood: 'sad' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_dating_profile',
    icon: '💘',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    scene: { place: 'apartment', mood: 'shock', prop: 'phone' },
    when: { age: [20, 50], has: 'parent', noHas: 'spouse' },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "{a.rel} t'envoie une capture d'écran de ton profil {w:app}, celui avec la photo torse nu et la bio « cherche plan sans prise de tête 😏 ». Message : « C'est toi ? Tu as mangé quoi, pour être aussi maigre ? »",
        "{a.first} est sur {w:app} aussi. Et {a:il|elle} vient de te « matcher » par erreur. Il y a maintenant une conversation ouverte entre vous deux intitulée « C'est le destin 💕 ».",
        "Au dîner de famille, {a.first} sort son téléphone : « Regardez qui j'ai trouvé sur {w:app} ! » Ta photo de profil, prise {w:at_place}, en tenue très légère, passe de main en main.",
        "{a.rel} a lu ta bio de profil {w:app} : « Gourmand{|e}, sans tabou, aime {w:food} et les sensations fortes ». {a:Il|Elle} veut « en parler calmement ».",
      ],
      en: [
        "{a.first} sends you a screenshot of your {w:app} profile, the shirtless one with the bio “looking for no-strings fun 😏.” Message: “Is this you? What have you been eating to be so skinny?”",
        "{a.first} is on {w:app} too. And just “matched” with you by accident. There's now an open chat between you two titled “It's fate 💕.”",
        "At family dinner, {a.first} pulls out {a:his|her} phone: “Look who I found on {w:app}!” Your profile pic, taken {w:at_place}, in very little clothing, is passed around the table.",
        "{a.first} read your {w:app} bio: “Greedy, no taboos, loves {w:food} and strong sensations.” {a:He|She} wants to “talk about it calmly.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Nier en bloc', en: 'Deny everything' },
        out: [
          { w: 1, text: { fr: ["J'ai juré que c'était un sosie. {a.first} m'a fait remarquer qu'on voyait ma tache de naissance sur la fesse. J'ai déménagé mentalement.", "« C'est un faux profil, on m'a piraté{|e} ! » {a.first} : « Avec ton grain de beauté ? » Échec critique."], en: ["I swore it was a lookalike. {a.first} pointed out my birthmark was visible on my butt. I moved out emotionally.", "“It's a fake, I got hacked!” {a.first}: “With your mole?” Critical failure."] }, fx: { happy: -5, rel: -3, stress: 4 }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai nié, et {a.my} m'a cru{|e}. Puis a signalé le profil pour « usurpation de l'identité de mon enfant ». Mon compte est banni. Merci.", "{a.my} a gobé l'histoire du sosie et a passé la soirée à écrire au « sosie » pour lui faire la morale. C'était moi. J'ai répondu « merci pour vos conseils »."], en: ["I denied it, and {a.my} believed me. Then reported the profile for “impersonating my child.” My account got banned. Thanks.", "{a.my} bought the lookalike story and spent the evening messaging the “lookalike” with a lecture. It was me. I replied “thanks for the advice.”"] }, fx: { happy: -2, rel: 2 } },
        ],
      },
      {
        label: { fr: 'Assumer, je suis adulte', en: 'Own it, I\'m an adult' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["J'ai assumé. {a.first} a soupiré, puis m'a donné des conseils de drague des années 80. Le pire, c'est qu'un marchait.", "« Oui, c'est moi, et alors ? » {a.first} a hoché la tête : « Mets au moins une photo où tu souris. » On a refait mon profil ensemble. Surréaliste."], en: ["I owned it. {a.first} sighed, then gave me 1980s flirting tips. The worst part: one of them worked.", "“Yes, it's me, so what?” {a.first} nodded: “At least use a photo where you smile.” We redid my profile together. Surreal."] }, fx: { happy: 4, rel: 5 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai assumé. {a.first} a assumé aussi et m'a montré son propre profil. « Coquin{a:|e} de 60 ans, aime le camping-car et les surprises ». J'ai vomi un peu dans ma bouche.", "« Je suis adulte. » {a.first} : « Moi aussi. » Puis {a:il|elle} m'a montré ses matchs de la semaine. Il y en a 43. J'ai besoin d'un psy."], en: ["I owned it. {a.first} owned it too and showed me {a:his|her} own profile: “Naughty 60-year-old, loves RVs and surprises.” I threw up a little in my mouth.", "“I'm an adult.” {a.first}: “So am I.” Then {a:he|she} showed me {a:his|her} matches this week. There are 43. I need therapy."] }, fx: { happy: -4, stress: 5 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Supprimer l\'appli', en: 'Delete the app' },
        out: [
          { w: 2, text: { fr: ["J'ai tout supprimé et juré que je chercherais l'amour « à l'ancienne ». {a.first} m'a inscrit{|e} à un bal des célibataires {w:at_place}.", "Appli supprimée. {a.first} a décidé de me trouver quelqu'un {a:lui|elle}-même. Premier candidat : l'enfant du dentiste, qui collectionne les dents de lait."], en: ["I deleted everything and swore I'd find love “the old way.” {a.first} signed me up for a singles dance {w:at_place}.", "App deleted. {a.first} decided to find me someone personally. First candidate: the dentist's kid, who collects baby teeth."] }, fx: { happy: -2, rel: 4 } },
          { w: 1, text: { fr: ["J'ai supprimé l'appli. {a.first} non. {a:Il|Elle} a gardé la capture d'écran comme fond d'écran « pour rigoler ».", "J'ai effacé mon profil. Trop tard : la photo circule sur le groupe WhatsApp de la famille, avec 14 réactions dont mamie « 🔥 »."], en: ["I deleted the app. {a.first} didn't. {a:He|She} kept the screenshot as a wallpaper “for laughs.”", "I deleted my profile. Too late: the photo is circulating in the family group chat, with 14 reactions including grandma's “🔥.”"] }, fx: { happy: -5, stress: 4 }, mood: 'cry' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_surprise_visit',
    icon: '🚪',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    scene: { place: 'apartment', mood: 'shock', prop: 'door' },
    when: { age: [19, 45], has: 'parent', movedOut: true },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "Dimanche, 8 h. On sonne. C'est {a.rel}, avec {w:food} « fait maison » et un double de tes clés que tu ne lui as jamais donné. Problème : tu n'es pas seul{|e} dans ton lit.",
        "{a.first} débarque à l'improviste « pour voir ton appart ». L'appart dégage {w:smell}, il y a des menottes en fourrure sur le canapé et quelqu'un se cache sous la couette.",
        "Ding-dong. {a.first}, sur le palier, avec {w:gift} et un sourire inquiétant : « Surprise ! Je passais dans le coin. » Tu habites à 600 km.",
        "{a.first} est entré{a:|e} avec sa clé « de secours » pendant que tu étais sous la douche. {a:Il|Elle} range déjà ton frigo en commentant à voix haute ce qu'il y a dans ta table de nuit.",
      ],
      en: [
        "Sunday, 8 a.m. The doorbell. It's {a.first}, with homemade {w:food} and a copy of your keys you never gave {a:him|her}. Problem: you're not alone in bed.",
        "{a.first} drops by unannounced “to see your place.” The place gives off {w:smell}, there are fluffy handcuffs on the couch and someone is hiding under the duvet.",
        "Ding-dong. {a.first}, on the doormat, with {w:gift} and an unsettling smile: “Surprise! I was in the area.” You live 400 miles away.",
        "{a.first} let {a:himself|herself} in with the “emergency” key while you were in the shower. {a:He|She} is already reorganizing your fridge and commenting out loud on what's in your nightstand.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exfiltrer ma conquête', en: 'Smuggle out the date' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai fait sortir ma conquête par la fenêtre pendant que {a.my} admirait la plante verte. Elle est tombée dans la poubelle des voisins. Opération réussie.", "Mon rencard est sorti en rampant derrière le canapé pendant que je montrais la salle de bains à {a.my}. Digne d'un film d'espionnage."], en: ["I got my date out the window while {a.my} admired the houseplant. They landed in the neighbors' dumpster. Operation successful.", "My date crawled out behind the couch while I showed {a.my} the bathroom. Straight out of a spy movie."] }, fx: { happy: 4, smarts: 2 } },
          { w: 1, text: { fr: ["La conquête a été prise en flagrant délit, en slip, dans le placard. {a.first} lui a serré la main, lui a proposé {w:food} et a demandé ses intentions. On a déjeuné tous les trois. Plus jamais.", "Mon rencard est sorti du placard au mauvais moment, en caleçon léopard. {a.first} : « Enchanté{a:|e}, vous faites quoi dans la vie ? »"], en: ["My date got caught red-handed, in underwear, in the closet. {a.first} shook their hand, offered them {w:food} and asked about their intentions. The three of us had brunch. Never again.", "My date came out of the closet at the worst moment, in leopard briefs. {a.first}: “Nice to meet you, what do you do for a living?”"] }, fx: { happy: -4, rel: 2, stress: 6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Changer les serrures', en: 'Change the locks' },
        out: [
          { w: 2, text: { fr: ["J'ai changé les serrures le jour même. {a.first} a essayé sa clé la semaine suivante et m'a laissé un mot : « Je comprends. Je ne suis que la personne qui t'a donné la vie. » Signé avec une larme.", "Serrures changées. {a.first} s'est fait faire un double… chez le serrurier qui a posé la nouvelle. Il est de mèche."], en: ["I changed the locks that day. {a.first} tried the key the next week and left a note: “I understand. I'm only your parent.” Signed with a tear.", "Locks changed. {a.first} got a copy made… from the locksmith who installed the new one. He's in on it."] }, fx: { rel: -6, money: -120, stress: -2 } },
          { w: 1, text: { fr: ["J'ai changé les serrures. {a.first} est revenu{a:|e}, a trouvé porte close et a attendu sur le palier six heures avec {w:food}. Les voisins m'ont traité{|e} de monstre.", "J'ai changé les serrures. {a.first} est entré{a:|e} par le balcon. Au 4e étage. À 63 ans. Respect."], en: ["I changed the locks. {a.first} came back, found the door shut and waited on the landing for six hours with {w:food}. The neighbors called me a monster.", "I changed the locks. {a.first} came in through the balcony. Fourth floor. At 63. Respect."] }, fx: { rel: -3, karma: -2, money: -120 } },
        ],
      },
      {
        label: { fr: 'Faire visiter, tout', en: 'Give the full tour' },
        out: [
          { w: 1, text: { fr: ["J'ai fait visiter, menottes comprises. {a.first} a dit : « De mon temps on utilisait des cravates. » J'ai désormais des visions que je ne peux pas effacer.", "Visite complète, sans honte. {a.first} a trouvé mon jouet dans la salle de bains et l'a pris pour un masseur de nuque. {a:Il|Elle} l'a essayé sur son cou. Devant moi."], en: ["I gave the full tour, handcuffs included. {a.first} said: “In my day we used neckties.” I now have images I cannot unsee.", "Full tour, no shame. {a.first} found my toy in the bathroom and mistook it for a neck massager. {a:He|She} tried it on {a:his|her} neck. In front of me."] }, fx: { happy: -3, stress: 5 }, mood: 'sick' },
          { w: 1, text: { fr: ["Visite guidée. {a.first} a passé l'aspirateur, repassé mes slips et laissé {w:food} au frigo. Honnêtement : merci.", "J'ai assumé le bazar. {a.first} a tout nettoyé en pleurant un peu. L'appart n'a jamais été aussi propre. Moi, si."], en: ["Guided tour. {a.first} vacuumed, ironed my underwear and left {w:food} in the fridge. Honestly: thanks.", "I owned the mess. {a.first} cleaned it all while crying a little. The place has never been this clean."] }, fx: { rel: 6, happy: 3 } },
        ],
      },
    ],
  },
  {
    id: 'f2_par_grey_divorce',
    icon: '💔',
    cat: 'family',
    rating: 1,
    actor: 'parent',
    scene: { place: 'home', mood: 'shock', prop: 'cake' },
    when: { age: [22, 60], has: ['mother', 'father'] },
    weight: 4,
    once: true,
    text: {
      fr: [
        "Repas de famille. {a.first} tapote son verre : « On a une annonce. Après [[35|38|41]] ans, ton père et ta mère divorcent. » Puis {a:il|elle} coupe le gâteau, comme si de rien n'était.",
        "{a.first} t'appelle : tes parents se séparent. Motif officiel : « on ne supporte plus la façon dont l'autre mâche ». Motif officieux : {w:hobby}.",
        "Tes parents divorcent après des décennies. {a.first} part vivre {w:far_place} avec un sac à dos et une liste de « choses que je n'ai jamais pu faire ». Elle commence par « dormir en étoile ».",
        "{a.rel} t'annonce le divorce sur le groupe WhatsApp familial, entre une photo représentant {w:animal} et un GIF de chaton. Ton autre parent a réagi avec un pouce levé.",
      ],
      en: [
        "Family dinner. {a.first} taps a glass: “We have an announcement. After [[35|38|41]] years, your mom and dad are getting divorced.” Then {a:he|she} cuts the cake like nothing happened.",
        "{a.first} calls: your parents are splitting up. Official reason: “we can't stand the way the other one chews anymore.” Unofficial reason: {w:hobby}.",
        "Your parents are divorcing after decades. {a.first} is moving to live {w:far_place} with a backpack and a list of “things I never got to do.” Item one: “sleep diagonally.”",
        "{a.first} announces the divorce in the family group chat, between a photo of {w:animal} and a kitten GIF. Your other parent reacted with a thumbs-up.",
      ],
    },
    choices: [
      {
        label: { fr: 'Choisir un camp', en: 'Pick a side' },
        out: [
          { w: 1, text: { fr: ["J'ai choisi le camp de {a.my}. Résultat : Noël en deux services, deux dindes, deux fois plus de questions sur ma vie amoureuse.", "J'ai pris parti pour {a.my}. L'autre m'a envoyé une carte d'anniversaire signée « ton ancien parent préféré »."], en: ["I sided with {a.my}. Result: Christmas in two shifts, two turkeys, twice as many questions about my love life.", "I took {a.my}'s side. The other one sent me a birthday card signed “your former favorite parent.”"] }, fx: { rel: 10, happy: -4, stress: 4 } },
          { w: 1, text: { fr: ["J'ai choisi le camp de {a.my}. Une semaine plus tard, ils se sont remis ensemble et m'en veulent tous les deux.", "J'ai pris parti. Ils se sont réconciliés le lendemain, et je suis officiellement « celui ou celle qui a voulu nous séparer »."], en: ["I picked {a.my}'s side. A week later they got back together and both resent me.", "I took a side. They made up the next day, and I'm officially “the one who tried to split us up.”"] }, fx: { rel: -8, happy: -5 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Rester neutre (Suisse)', en: 'Stay neutral (Switzerland)' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["Je suis resté{|e} neutre. J'ai deux fois plus de repas, deux fois plus de cadeaux. Le divorce, c'est un business.", "Neutralité totale. Chacun me raconte sa version. Je hoche la tête et j'encaisse les chèques d'anniversaire en double."], en: ["I stayed neutral. Twice the dinners, twice the presents. Divorce is a business.", "Total neutrality. Each tells me their version. I nod and cash the double birthday checks."] }, fx: { happy: 3, money: 200 } },
          { w: 1, text: { fr: ["La neutralité m'a transformé{|e} en messager. J'ai transporté entre eux une fondue, un chien et trois cartons de rancune.", "Rester neutre, c'est passer ses dimanches à faire l'aller-retour avec {w:object} « qui est à moi, dis-lui »."], en: ["Neutrality turned me into a courier. I ferried a fondue set, a dog and three boxes of grudges between them.", "Staying neutral means spending Sundays driving back and forth with {w:object} “that's mine, tell {a:him|her}.”"] }, fx: { stress: 6, happy: -2 } },
        ],
      },
      {
        label: { fr: 'Fêter leur liberté', en: 'Celebrate their freedom' },
        out: [
          { w: 1, text: { fr: ["J'ai organisé une fête de divorce. {a.first} a dansé sur la table. L'autre est venu{a:|e} aussi, avec un rencard. Ambiance électrique, buffet excellent.", "Fête de divorce surprise : gâteau en forme d'alliance cassée. {a.first} a ri aux larmes. Puis juste les larmes."], en: ["I threw a divorce party. {a.first} danced on the table. The other one came too, with a date. Electric atmosphere, excellent buffet.", "Surprise divorce party: a cake shaped like a broken wedding ring. {a.first} laughed till {a:he|she} cried. Then just cried."] }, fx: { happy: 5, rel: 6 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai fêté ça trop fort. {a.first} a trouvé ça déplacé et m'a rappelé que j'étais « le fruit de cette union ratée ». Gâteau amer.", "Ma fête de divorce a été mal reçue. Personne n'est venu, sauf l'oncle bourré. Il a fait un discours sur le mariage pendant 40 minutes."], en: ["I celebrated a little too hard. {a.first} found it inappropriate and reminded me I'm “the product of that failed union.” Bitter cake.", "My divorce party went over badly. Nobody came except the drunk uncle. He gave a 40-minute speech about marriage."] }, fx: { rel: -6, happy: -3 } },
        ],
      },
    ],
  },
  {
    id: 'f2_par_new_lover_ex',
    icon: '😱',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    scene: { place: 'home', mood: 'shock', prop: 'wine' },
    when: { age: [24, 60], has: 'parent' },
    weight: 3,
    once: true,
    text: {
      fr: [
        "{a.rel} te présente enfin la nouvelle personne qui partage sa vie. Tu la reconnais tout de suite : c'est ton ex du lycée. Celle ou celui qui t'a largué{|e} par texto {w:time}.",
        "Dîner pour rencontrer « la nouvelle personne dans la vie » de {a.first}. Elle entre. C'est ton ex. Elle t'appelle encore « {w:nickname} ». {a.first} trouve ça « trop mignon ».",
        "{a.first} est amoureux{a:|se} comme un ado. L'heureux élu a 20 ans de moins, adore {w:hobby}, et tu as passé deux ans dans son lit à la fac. Le monde est petit. Trop petit.",
        "Grosse annonce de {a.rel} : {a:il|elle} se remarie. Avec ton ex. Celle ou celui qui a gardé ton {w:object} après la rupture. Le faire-part est déjà imprimé.",
      ],
      en: [
        "{a.first} finally introduces {a:his|her} new partner. You recognize them instantly: it's your high-school ex. The one who dumped you by text {w:time}.",
        "Dinner to meet “the new person in {a.first}'s life.” They walk in. It's your ex. They still call you “{w:nickname}.” {a.first} thinks that's “adorable.”",
        "{a.first} is in love like a teenager. The lucky one is 20 years younger, loves {w:hobby}, and you spent two years in their bed in college. Small world. Way too small.",
        "Big announcement from {a.first}: {a:he|she}'s remarrying. Your ex. The one who kept your {w:object} after the breakup. The invitations are already printed.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout balancer à table', en: 'Spill it at the table' },
        out: [
          { w: 1, text: { fr: ["J'ai tout balancé entre le fromage et le dessert. {a.first} a renversé la saucière, mon ex s'est étouffé{|e} avec un cornichon. Il a fallu une manœuvre de Heimlich. Par moi.", "« Au fait, on a couché ensemble pendant deux ans, tous les deux. » Le vin a giclé par le nez de {a.my}. La nappe ne s'en est jamais remise."], en: ["I spilled everything between the cheese and dessert. {a.first} knocked over the gravy, my ex choked on a pickle. Someone had to do the Heimlich. Me.", "“By the way, I slept with them for two years.” Wine shot out of {a.my}'s nose. The tablecloth never recovered."] }, fx: { rel: -15, happy: 3, stress: 6 }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai tout dit. {a.first} a haussé les épaules : « Je sais, c'est comme ça qu'on s'est rencontrés : on parlait de toi. » Je n'ai plus de questions. Que des cauchemars.", "J'ai lâché la bombe. {a.first} était déjà au courant et trouvait ça « pratique pour les anniversaires ». Je suis rentré{|e} à pied, sous la pluie, pour l'ambiance."], en: ["I told them everything. {a.first} shrugged: “I know, that's how we met: we were talking about you.” I have no more questions. Only nightmares.", "I dropped the bomb. {a.first} already knew and finds it “handy for birthdays.” I walked home in the rain, for atmosphere."] }, fx: { happy: -8, stress: 8 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Sourire et vomir après', en: 'Smile, vomit later' },
        out: [
          { w: 2, text: { fr: ["J'ai souri toute la soirée. Puis j'ai vomi dans le bac à fleurs de la voisine, en jet, comme un tuyau d'arrosage. Un geste très mature.", "Sourire figé pendant trois heures. Ensuite, vomi dans le taxi. Le chauffeur m'a facturé 80 € de « nettoyage émotionnel »."], en: ["I smiled all evening. Then projectile-vomited into the neighbor's flower box, like a garden hose. Very mature.", "Frozen smile for three hours. Then vomit in the cab. The driver charged me $80 for “emotional cleaning.”"] }, fx: { happy: -6, health: -2, rel: 3, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: ["J'ai souri. Au mariage, j'ai été désigné{|e} témoin. J'ai porté les alliances de mon ex et de {a.my}. Ma thérapeute a demandé une augmentation.", "J'ai gardé le sourire. Au repas de Noël, mon ex m'a appelé{|e} « mon petit beau-bébé ». J'ai mangé la dinde avec rage."], en: ["I smiled. At the wedding I was named witness. I carried the rings for my ex and {a.my}. My therapist asked for a raise.", "I kept smiling. At Christmas my ex called me “my little step-baby.” I ate the turkey with rage."] }, fx: { happy: -8, karma: 4, stress: 6 } },
        ],
      },
      {
        label: { fr: 'Saboter la romance', en: 'Sabotage the romance' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai ressorti les vieux textos de mon ex. Il y en avait un sur la taille du nez de {a.my}. Rupture en 24 h. Je suis un monstre efficace.", "J'ai sabordé l'histoire avec {w:object} et un peu de mauvaise foi. Ils ont rompu. {a.first} pleure. Je mange de la glace en culpabilisant à moitié."], en: ["I dug up my ex's old texts. One was about the size of {a.my}'s nose. Breakup in 24 hours. I'm an efficient monster.", "I torpedoed it with {w:object} and some bad faith. They broke up. {a.first} is crying. I'm eating ice cream, half guilty."] }, fx: { rel: -6, karma: -6, happy: 4 } },
          { w: 1, text: { fr: ["Mon sabotage les a rapprochés. Ils m'ont remercié{|e} dans leurs vœux de mariage : « sans toi on ne se serait jamais autant soudés ». Applaudissements.", "Le sabotage a échoué et mon ex est maintenant mon beau-parent officiel. {a:Il|Elle} me fait des remarques sur ma coupe de cheveux. Comme avant."], en: ["My sabotage brought them closer. They thanked me in their vows: “without you we'd never have bonded like this.” Applause.", "The sabotage failed and my ex is now officially my step-parent. They comment on my haircut. Just like old times."] }, fx: { happy: -6, rel: -2, stress: 5 }, mood: 'cry' },
        ],
      },
    ],
  },
  // ───────────────────────────── parents · getting old ─────────────────────────────
  {
    id: 'f2_par_moves_in',
    icon: '🧳',
    cat: 'family',
    rating: 1,
    actor: 'parent',
    vars: { amount: [400, 1500] },
    scene: { place: 'home', mood: 'neutral', prop: 'suitcase' },
    when: { age: [32, 70], has: 'parent', movedOut: true, noFlag: 'f2_par_lodger' },
    weight: 5,
    cooldown: 10,
    text: {
      fr: [
        "{a.rel} ne peut plus vivre seul{a:|e} : {a:il|elle} a mis le feu à sa cuisine en faisant {w:food}. {a:Il|Elle} est sur ton paillasson avec trois valises et un cactus. « Juste quelques semaines. »",
        "{a.first} vend sa maison et propose, « pour se rapprocher », de s'installer dans ta chambre d'amis. Tu n'as pas de chambre d'amis. {a:Il|Elle} a déjà mesuré ton bureau.",
        "Après une chute {w:at_place}, {a.rel} a besoin de quelqu'un. Le reste de la famille a « un empêchement ». Tous les regards se tournent vers toi, et vers ton canapé-lit.",
        "{a.first} t'appelle : « J'ai lu un article, les familles vivaient ensemble autrefois, c'était mieux. » Bruit de valise à roulettes en fond. {a:Il|Elle} est déjà dans ton ascenseur.",
      ],
      en: [
        "{a.first} can't live alone anymore: {a:he|she} set the kitchen on fire making {w:food}. {a:He|She}'s on your doorstep with three suitcases and a cactus. “Just a few weeks.”",
        "{a.first} is selling the house and offering, “to be closer,” to move into your guest room. You don't have a guest room. {a:He|She} has already measured your office.",
        "After a fall {w:at_place}, {a.first} needs someone. The rest of the family all have “a conflict.” Every eye turns to you, and to your sofa bed.",
        "{a.first} calls: “I read that families used to live together, it was better.” Sound of a rolling suitcase in the background. {a:He|She}'s already in your elevator.",
      ],
    },
    choices: [
      {
        label: { fr: 'Accueillir à bras ouverts', en: 'Welcome with open arms' },
        out: [
          { w: 2, text: { fr: ["J'ai installé {a.my} dans le bureau. Le premier soir, on a regardé {w:show} ensemble. Le deuxième, {a:il|elle} a repeint la cuisine en jaune sans demander.", "J'ai dit oui. {a.first} a apporté 40 cartons, un aquarium et ses habitudes. Je ne suis plus chez moi, mais on mange très bien."], en: ["I set {a.my} up in the office. The first night, we watched {w:show} together. The second, {a:he|she} painted the kitchen yellow without asking.", "I said yes. {a.first} brought 40 boxes, an aquarium and all {a:his|her} habits. It's no longer my home, but the food is great."] }, fx: { rel: 12, karma: 6, stress: 5, flag: 'f2_par_lodger', schedule: { key: 'f2_par_lodger', years: 1 } }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai accepté. Dès la première semaine, {a.my} a réorganisé mes placards, jeté mes vieux t-shirts et appelé mon couple « une colocation ».", "Oui, bien sûr. {a.first} s'est installé{a:|e} et a immédiatement pris possession de la télécommande. Je dors sur le canapé. Chez moi."], en: ["I agreed. In the first week {a.my} reorganized my closets, threw out my old T-shirts and called my love life “a flatshare.”", "Yes, of course. {a.first} moved in and immediately seized the remote. I sleep on the couch. In my own home."] }, fx: { rel: 8, stress: 8, happy: -3, flag: 'f2_par_lodger', schedule: { key: 'f2_par_lodger', years: 1 } } },
        ],
      },
      {
        label: { fr: 'Payer une résidence', en: 'Pay for a care home' },
        out: [
          { w: 2, text: { fr: ["J'ai trouvé une résidence à {$amount} par mois, avec piscine et bingo. {a.first} y a trouvé un{a:e|} amoureux{a:se|} en trois jours. Je suis soulagé{|e} et un peu jaloux{|se}.", "Résidence chic, {$amount} le mois. {a.first} m'envoie des photos de son cours d'aquagym. {a:Il|Elle} n'a jamais été aussi heureux{a:|se}."], en: ["I found a care home at {$amount} a month, with a pool and bingo. {a.first} found a sweetheart in three days. I'm relieved and slightly jealous.", "Fancy residence, {$amount} a month. {a.first} sends me photos from aqua aerobics. {a:He|She} has never been happier."] }, fx: { money: '-amount', rel: 2, happy: 3 } },
          { w: 1, text: { fr: ["Résidence payée ({$amount}). {a.first} a dit à tout le personnel que je l'avais « abandonné{a:|e} comme un chien sur l'autoroute ». Les aides-soignantes me crachent dessus du regard.", "J'ai payé une résidence. {a.first} s'est évadé{a:|e} deux fois en déambulateur et a été retrouvé{a:|e} {w:at_place}."], en: ["Care home paid ({$amount}). {a.first} told the entire staff I “dumped {a:him|her} like a dog on the highway.” The nurses glare daggers at me.", "I paid for a care home. {a.first} escaped twice on a walker and was found {w:at_place}."] }, fx: { money: '-amount', rel: -10, karma: -2 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Refiler à la fratrie', en: 'Pass to a sibling' },
        if: { has: 'sibling' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai convaincu la fratrie que {a.my} serait « tellement mieux » chez eux, avec un jardin. Ça a marché. Je suis l'enfant préféré, à distance.", "J'ai organisé un vote familial truqué. {a.first} part vivre chez mon frère ou ma sœur. Je paierai les cadeaux de Noël en compensation."], en: ["I convinced my siblings {a.my} would be “so much better off” at their place, with a garden. It worked. I'm the favorite child, from a distance.", "I organized a rigged family vote. {a.first} is moving in with one of my siblings. I'll pay for Christmas presents as compensation."] }, fx: { karma: -4, happy: 4, rel: -2 } },
          { w: 1, text: { fr: ["J'ai essayé de refiler {a.my} à la fratrie. Ils m'ont tous bloqué{|e} en même temps. {a.first} est sur mon canapé. Pour longtemps.", "Ma tentative a échoué et toute la famille sait que j'ai voulu « me débarrasser » de {a.my}. Le groupe WhatsApp s'est enflammé."], en: ["I tried to pass {a.my} to my siblings. They all blocked me at once. {a.first} is on my couch. For a long time.", "My attempt failed and the whole family knows I tried to “get rid of” {a.my}. The group chat went up in flames."] }, fx: { rel: -8, stress: 6, flag: 'f2_par_lodger', schedule: { key: 'f2_par_lodger', years: 1 } }, mood: 'angry' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_lodger',
    icon: '🩲',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    chainOnly: true,
    scene: { place: 'home', mood: 'shock', prop: 'robe' },
    when: { flag: 'f2_par_lodger' },
    text: {
      fr: [
        "Un an de cohabitation avec {a.rel}. {a:Il|Elle} se promène désormais à poil dans le salon « parce qu'il fait chaud », a bouché les toilettes deux fois et organise des soirées belote {w:time}.",
        "{a.first} vit chez toi depuis un an. Ta salle de bains sent {w:smell}, ton frigo déborde de restes périmés, dont {w:food}, et {a:il|elle} a installé {w:animal} dans ta baignoire « temporairement ».",
        "Cohabitation, jour 365. {a.first} a ramené un{a:e|} « ami{a:e|} » rencontré{a:e|} au club de bridge. Tu as entendu des bruits à travers le mur. Des bruits de bridge, tu te répètes en boucle.",
        "{a.rel} a pris le contrôle total de ta maison : planning des repas affiché, Wi-Fi coupé à 22 h, et son dentier qui trempe dans TON verre à dents. Tu as {age} ans et un couvre-feu.",
      ],
      en: [
        "One year living with {a.first}. {a:He|She} now walks around the living room naked “because it's hot,” has clogged the toilet twice and hosts card nights {w:time}.",
        "{a.first} has lived with you for a year. Your bathroom smells like {w:smell}, your fridge is full of expired {w:food}, and {a:he|she} put {w:animal} in your bathtub “temporarily.”",
        "Living together, day 365. {a.first} brought home a “friend” from bridge club. You heard noises through the wall. Bridge noises, you keep telling yourself.",
        "{a.first} has taken total control of your home: meal plan on the fridge, Wi-Fi off at 10 p.m., and {a:his|her} dentures soaking in YOUR toothbrush glass. You're {age} and you have a curfew.",
      ],
    },
    choices: [
      {
        label: { fr: 'Poser des règles', en: 'Lay down rules' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: ["J'ai affiché un règlement intérieur. Article 1 : le slip est obligatoire. {a.first} a signé en râlant. La paix est revenue.", "Réunion de cohabitation. On a trouvé un accord : {a:il|elle} garde le salon le mardi, je garde ma dignité le reste du temps."], en: ["I posted house rules. Article 1: underwear is mandatory. {a.first} signed while grumbling. Peace returned.", "Roommate meeting. We reached a deal: {a:he|she} gets the living room on Tuesdays, I keep my dignity the rest of the time."] }, fx: { rel: 3, stress: -4 } },
          { w: 1, text: { fr: ["J'ai voulu poser des règles. {a.first} a ressorti mon carnet de notes de CM2 et lu mes appréciations à voix haute. J'ai perdu l'autorité morale.", "Mes règles ont été accueillies par un pet sonore et un « on verra ». Rien n'a changé."], en: ["I tried to lay down rules. {a.first} pulled out my fifth-grade report card and read the comments out loud. I lost all moral authority.", "My rules were met with a loud fart and a “we'll see.” Nothing changed."] }, fx: { happy: -4, stress: 5 } },
        ],
      },
      {
        label: { fr: 'Trouver un appart', en: 'Find them a flat' },
        out: [
          { w: 2, text: { fr: ["J'ai trouvé un petit appart pour {a.my}, à deux rues. {a:Il|Elle} vient manger tous les soirs, mais repart dormir chez {a:lui|elle}. C'est le bonheur parfait.", "{a.my} a déménagé dans un studio au rez-de-chaussée. Le jour du départ, j'ai pleuré. De joie. Mais aussi un peu de tristesse."], en: ["I found {a.my} a little flat two streets away. {a:He|She} comes over for dinner every night, but sleeps at {a:his|her} place. Perfect happiness.", "{a.my} moved into a ground-floor studio. On moving day I cried. Of joy. But also a little sadness."] }, fx: { happy: 8, stress: -8, rel: 4, money: -800, unflag: 'f2_par_lodger' }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai trouvé un appart. {a.first} l'a visité, a déclaré qu'il avait « une mauvaise énergie » et a déballé ses valises chez moi à nouveau.", "{a.my} a refusé de partir et s'est enchaîné{a:|e} au radiateur avec un antivol de vélo. On en est là."], en: ["I found a flat. {a.first} toured it, declared it had “bad energy” and unpacked at my place again.", "{a.my} refused to leave and chained {a:himself|herself} to the radiator with a bike lock. That's where we are."] }, fx: { stress: 6, happy: -4 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Accepter le chaos', en: 'Embrace the chaos' },
        out: [
          { w: 1, text: { fr: ["J'ai lâché prise. Maintenant je joue à la belote avec {a.my} et ses potes de 80 ans. Ils trichent tous. J'ai perdu 300 €. Meilleures soirées de ma vie.", "J'ai accepté. On se promène tous les deux en peignoir, on mange {w:food} devant la télé à 18 h. Je suis devenu{|e} {a:mon père|ma mère}."], en: ["I let go. Now I play cards with {a.my} and {a:his|her} 80-year-old buddies. They all cheat. I lost $300. Best nights of my life.", "I gave in. We both wander around in bathrobes, eating {w:food} in front of the TV at 6 p.m. I've become my {a:father|mother}."] }, fx: { happy: 4, rel: 10, money: -300, unflag: 'f2_par_lodger' }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai accepté le chaos. Le chaos a inondé la salle de bains : {a.my} a fait tomber son dentier dans les toilettes et tiré la chasse « par réflexe ». Le plombier en parle encore.", "Le chaos a gagné. Les toilettes ont débordé en geyser brun jusqu'au couloir. {a.first} a accusé le chat. On n'a pas de chat."], en: ["I embraced the chaos. The chaos flooded the bathroom: {a.my} dropped {a:his|her} dentures in the toilet and flushed “out of reflex.” The plumber still talks about it.", "Chaos won. The toilet overflowed in a brown geyser down the hallway. {a.first} blamed the cat. We don't have a cat."] }, fx: { happy: -5, money: -400, visual: 'poop', unflag: 'f2_par_lodger' }, mood: 'sick' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_car_keys',
    icon: '🔑',
    cat: 'family',
    rating: 0,
    actor: 'parent',
    scene: { place: 'home', mood: 'sad', prop: 'keys' },
    when: { age: [38, 75], has: 'parent' },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "{a.rel} a encore pris un rond-point à contresens. Cette fois, {a:il|elle} a emporté {w:object} et une partie du massif de fleurs de la mairie. Il faut lui parler des clés de voiture.",
        "{a.first} est rentré{a:|e} avec {w:vehicle} encastré dans le pare-chocs. {a:Il|Elle} jure qu'il « était déjà là ». La famille t'a désigné{|e} pour la conversation qui fâche.",
        "{a.first} conduit maintenant à 30 km/h sur l'autoroute, clignotant allumé en permanence, en écoutant {w:song} à fond. La gendarmerie l'a ramené{a:|e} deux fois ce mois-ci.",
        "Le garagiste t'appelle : la calandre de la voiture de {a.rel} porte les traces d'une rencontre avec {w:animal}, et un panneau « STOP » coincé dans le coffre. Il est temps.",
      ],
      en: [
        "{a.first} took another roundabout the wrong way. This time {a:he|she} took out {w:object} and half of the town hall's flowerbed. Time for the car-keys talk.",
        "{a.first} came home with {w:vehicle} wedged in the bumper. {a:He|She} swears it “was already there.” The family has picked you for the dreaded conversation.",
        "{a.first} now drives 20 mph on the highway, blinker always on, blasting {w:song}. The police have escorted {a:him|her} home twice this month.",
        "The mechanic calls: {a.first}'s car has traces of {w:animal} on the grille and a STOP sign stuck in the trunk. It's time.",
      ],
    },
    choices: [
      {
        label: { fr: 'La conversation douce', en: 'The gentle talk' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai parlé avec douceur. {a.first} m'a tendu les clés en pleurant un peu. On lui a offert une trottinette électrique. Les piétons ont peur, mais moins.", "Conversation délicate, mais réussie. {a.first} prend maintenant le bus et y a déjà un fan-club de retraités."], en: ["I spoke gently. {a.first} handed me the keys, crying a little. We got {a:him|her} an e-scooter. Pedestrians are scared, but less.", "Delicate conversation, but successful. {a.first} takes the bus now and already has a fan club of retirees."] }, fx: { rel: 4, karma: 4 } },
          { w: 1, text: { fr: ["J'ai été très doux{|ce}. {a.first} a hoché la tête, puis a démarré en trombe pendant que je parlais. Je l'ai regardé{a:|e} partir en marche arrière.", "{a.my} a fait semblant d'accepter et caché un double des clés dans ses chaussettes de contention. Personne n'ose fouiller."], en: ["I was very gentle. {a.first} nodded, then floored it while I was still talking. I watched {a:him|her} leave in reverse.", "{a.my} pretended to agree and hid a spare key in {a:his|her} socks. Nobody dares to search."] }, fx: { rel: -3, stress: 4 } },
        ],
      },
      {
        label: { fr: 'Cacher les clés', en: 'Hide the keys' },
        out: [
          { w: 2, text: { fr: ["J'ai caché les clés dans le congélateur. {a.first} les cherche depuis trois mois en accusant le voisin. Le voisin a déménagé.", "Clés planquées. {a.first} pense avoir perdu la mémoire et s'est mis{a:|e} aux mots croisés pour « entraîner son cerveau ». Effet secondaire positif."], en: ["I hid the keys in the freezer. {a.first} has been searching for three months, blaming the neighbor. The neighbor moved away.", "Keys hidden. {a.first} thinks {a:he|she} is losing {a:his|her} memory and took up crosswords to “train the brain.” Positive side effect."] }, fx: { karma: -1, rel: 1 } },
          { w: 1, text: { fr: ["J'ai caché les clés. {a.first} a démarré la voiture avec un tournevis, comme dans les films. Je ne savais pas qu'{a:il|elle} avait ce passé.", "{a.my} a trouvé les clés en dix minutes : « Le congélateur, sérieusement ? C'est là que je cachais tes bonbons. »"], en: ["I hid the keys. {a.first} hotwired the car with a screwdriver, like in the movies. I had no idea about this past.", "{a.my} found the keys in ten minutes: “The freezer, really? That's where I used to hide your candy.”"] }, fx: { stress: 4, smarts: -1 } },
        ],
      },
      {
        label: { fr: 'Faire passer un test', en: 'Organize a driving test' },
        out: [
          { w: 1, text: { fr: ["Test sur le parking du supermarché. {a.first} a réussi un créneau parfait, puis renversé six chariots et un vigile. Le vigile va bien.", "J'ai organisé un test. {a.first} l'a réussi haut la main et m'a fait remarquer que c'est moi qui ai des points en moins. Silence gêné."], en: ["Test in the supermarket parking lot. {a.first} parallel-parked perfectly, then knocked over six carts and a security guard. The guard is fine.", "I set up a test. {a.first} passed with flying colors and pointed out I'm the one who's lost points on my license. Awkward silence."] }, fx: { happy: 2, rel: 3 } },
          { w: 1, text: { fr: ["Le test a fini dans un fossé, avec moi sur le siège passager et une vache qui nous regardait. {a.first} a rendu les clés de {a:lui|elle}-même.", "Pendant le test, {a.my} a confondu frein et accélérateur. On a traversé une haie. Les clés sont maintenant sous scellés."], en: ["The test ended in a ditch, me in the passenger seat and a cow staring at us. {a.first} handed over the keys voluntarily.", "During the test {a.my} mixed up the brake and gas. We went through a hedge. The keys are now under lock and key."] }, fx: { health: -3, stress: 3, rel: 2 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_hoarder',
    icon: '📦',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    scene: { place: 'home', mood: 'sick', prop: 'boxes' },
    when: { age: [30, 70], has: 'parent' },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "Tu rends visite à {a.rel}. La maison est remplie du sol au plafond : journaux de 1994, {w:object} en quatorze exemplaires, et un couloir étroit qui mène à la cuisine. Ça sent {w:smell}.",
        "{a.first} « garde tout, ça peut servir ». Dans le garage : 300 pots de yaourt vides, {w:vehicle} en pièces détachées et un animal empaillé ({w:animal}) que personne ne se souvient avoir acheté.",
        "Les voisins se plaignent d'une odeur. Chez {a.first}, tu trouves {w:gross} sur une pile de magazines, un frigo qui bourdonne de mouches et {a:lui|elle}, serein{a:|e}, en train de lire au milieu.",
        "{a.rel} t'appelle à l'aide : {a:il|elle} ne retrouve plus sa chambre. Littéralement. Elle est quelque part derrière les cartons {w:brand}.",
      ],
      en: [
        "You visit {a.first}. The house is packed floor to ceiling: newspapers from 1994, {w:object} times fourteen, and a narrow tunnel leading to the kitchen. It smells like {w:smell}.",
        "{a.first} “keeps everything, it might come in handy.” In the garage: 300 empty yogurt cups, {w:vehicle} in pieces and a taxidermy specimen ({w:animal}) nobody remembers buying.",
        "The neighbors complain about a smell. At {a.first}'s place you find {w:gross} on a pile of magazines, a fridge buzzing with flies and {a:him|her}, serene, reading in the middle of it all.",
        "{a.first} calls for help: {a:he|she} can't find {a:his|her} bedroom anymore. Literally. It's somewhere behind the boxes from {w:brand}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Grand ménage forcé', en: 'Forced deep clean' },
        out: [
          { w: 1, text: { fr: ["Trois bennes, deux week-ends. Sous le canapé, j'ai trouvé un raton laveur momifié et mon doudou de 1992. J'ai gardé le doudou. Le raton aussi, par respect.", "Grand ménage. {a.first} a pleuré à chaque sac poubelle. Mais on a retrouvé la salle à manger, et une nappe qu'on croyait perdue depuis Mitterrand."], en: ["Three dumpsters, two weekends. Under the couch I found a mummified raccoon and my 1992 teddy bear. I kept the teddy. The raccoon too, out of respect.", "Deep clean. {a.first} cried over every trash bag. But we found the dining room, and a tablecloth lost since the '80s."] }, fx: { rel: -2, karma: 4, health: -2 } },
          { w: 1, text: { fr: ["En soulevant un carton, j'ai déclenché une avalanche de bocaux. L'un contenait un truc liquide et marron. Il a éclaté sur moi. J'ai vomi trois fois et brûlé mes vêtements dans le jardin.", "Une pile de journaux s'est effondrée et a libéré une colonie de cafards. Ils ont couru sur mon visage. J'ai hurlé comme {w:animal}. {a.first} a dit : « Ils sont gentils. »"], en: ["Lifting a box, I triggered an avalanche of jars. One held something brown and liquid. It burst all over me. I threw up three times and burned my clothes in the yard.", "A pile of newspapers collapsed and released a cockroach colony. They ran across my face. I screamed like {w:animal}. {a.first} said: “They're friendly.”"] }, fx: { health: -5, happy: -6, visual: 'poop' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Vendre sur internet', en: 'Sell it online' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai tout mis en vente. Un collectionneur a acheté la pile de magazines de 1994 pour 3 000 €. {a.first} réclame sa part en pleurant.", "Vente en ligne : {w:object} est parti à prix d'or. On a partagé les gains. {a.first} a racheté des cartons « pour ranger »."], en: ["I listed everything online. A collector bought the 1994 magazine pile for $3,000. {a.first} demands a cut, in tears.", "Online sale: {w:object} sold for a fortune. We split the money. {a.first} bought more boxes “for storage.”"] }, fx: { money: 1500, rel: 3, happy: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["Personne n'a rien acheté sauf un type louche qui voulait « juste le raton empaillé ». Il paie en liquide. Je n'ai pas posé de questions.", "J'ai passé trois mois à vendre des trucs à 2 €. {a.first} a racheté la moitié en douce sur un autre compte."], en: ["Nobody bought anything except a shady guy who wanted “just the stuffed raccoon.” Paid cash. I asked no questions.", "I spent three months selling stuff for $2. {a.first} secretly bought half of it back from another account."] }, fx: { money: 40, stress: 5 } },
        ],
      },
      {
        label: { fr: 'Appeler une émission', en: 'Call a TV show' },
        out: [
          { w: 1, text: { fr: ["Une émission de télé est venue tout vider. {a.first} a pleuré à l'écran devant un psy en pull rose. Audience record. On nous reconnaît {w:at_place}.", "On est passés à la télé dans « Ma maison, ma décharge ». {a.first} est devenu{a:|e} un mème. Les dons ont payé le ménage."], en: ["A TV show came and emptied everything. {a.first} cried on camera in front of a therapist in a pink sweater. Record ratings. People recognize us {w:at_place}.", "We were on TV, on “My House, My Dump.” {a.first} became a meme. Donations paid for the cleanup."] }, fx: { fame: 3, rel: -5, followers: 3000 } },
          { w: 1, text: { fr: ["L'équipe télé a fui au bout d'une heure : un caméraman a vomi dans son propre casque. L'émission a été annulée. La maison a gagné.", "Le présentateur a disparu dans la maison pendant 20 minutes. On l'a retrouvé coincé entre deux frigos, en état de choc. Procès en cours."], en: ["The TV crew fled after an hour: a cameraman puked into his own headset. The show got cancelled. The house won.", "The host vanished inside the house for 20 minutes. We found him wedged between two fridges, in shock. Lawsuit pending."] }, fx: { happy: -3, stress: 4, money: -300 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_cult_fortune',
    icon: '🕯️',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    vars: { amount: [20000, 120000] },
    scene: { place: 'villa', mood: 'shock', prop: 'candle' },
    when: { age: [28, 70], has: 'parent' },
    weight: 3,
    once: true,
    text: {
      fr: [
        "{a.rel} t'annonce qu'{a:il|elle} va léguer tout son argent ({$amount}) à son nouveau « guide spirituel », un certain Sylvain qui vit {w:far_place} et parle avec {w:animal}.",
        "{a.first} a rejoint un groupe de « méditation » qui se réunit {w:at_place}. Tenue obligatoire : toge blanche. Cotisation : {$amount}. Le gourou roule en {w:vehicle} doré.",
        "{a.first} ne répond plus au téléphone, s'appelle maintenant « Rayon d'Aube » et veut vendre la maison familiale pour financer la « grande ascension » prévue mardi.",
        "Testament modifié : {a.rel} lègue {$amount} à « l'Église du Saint Croissant », dont le gourou affirme {w:conspiracy}. Ta part : un bracelet en cuivre « énergétique ».",
      ],
      en: [
        "{a.first} announces {a:he|she}'s leaving all {a:his|her} money ({$amount}) to {a:his|her} new “spiritual guide,” a guy named Sylvain who lives {w:far_place} and talks to {w:animal}.",
        "{a.first} joined a “meditation” group that meets {w:at_place}. Dress code: white robe. Membership fee: {$amount}. The guru drives a gold-plated {w:vehicle}.",
        "{a.first} stopped answering the phone, now goes by “Dawn Ray” and wants to sell the family house to fund the “great ascension” scheduled for Tuesday.",
        "Will updated: {a.first} is leaving {$amount} to “the Church of the Holy Croissant,” whose guru claims {w:conspiracy}. Your share: a copper “energy” bracelet.",
      ],
    },
    choices: [
      {
        label: { fr: 'Infiltrer la secte', en: 'Infiltrate the cult' },
        out: [
          { w: 1, odds: { smarts: 2 }, text: { fr: ["J'ai infiltré la secte en toge. J'ai filmé le gourou en train de compter les billets dans son jacuzzi. {a.first} a vu la vidéo et est rentré{a:|e} à la maison, en toge.", "Infiltration réussie : le gourou était en fait un ancien vendeur de cuisines. {a.first} a récupéré son argent et l'a dénoncé{a:|e}. Il est en prison, à méditer pour de vrai."], en: ["I infiltrated the cult in a robe. I filmed the guru counting cash in his hot tub. {a.first} saw the video and came home, still in the robe.", "Successful infiltration: the guru was a former kitchen salesman. {a.first} got the money back and reported him. He's in prison, meditating for real."] }, fx: { rel: 12, karma: 6, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai infiltré la secte. Le gourou m'a fait boire une tisane. Je me suis réveillé{|e} trois jours plus tard, en toge, rebaptisé{|e} « Brise du Soir ». {a.first} est fier{a:|e} de moi.", "Infiltration ratée : on m'a démasqué{|e} et rasé{|e} les sourcils pendant la cérémonie. {a.first} n'a rien dit. {a:Il|Elle} a juste fredonné."], en: ["I infiltrated the cult. The guru made me drink herbal tea. I woke up three days later in a robe, renamed “Evening Breeze.” {a.first} is proud of me.", "Infiltration failed: they unmasked me and shaved off my eyebrows during the ceremony. {a.first} said nothing. Just hummed."] }, fx: { looks: -5, happy: -6, smarts: -2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Saisir un avocat', en: 'Call a lawyer' },
        out: [
          { w: 1, text: { fr: ["Avocat, expertise psychiatrique, tutelle. {a.first} ne me parle plus, mais l'argent est bloqué. Je suis le méchant de l'histoire. Un méchant riche, potentiellement.", "Procès gagné : le gourou n'a rien touché. {a.first} m'a traité{|e} « d'âme sombre ». J'ai encadré le jugement."], en: ["Lawyer, psychiatric evaluation, guardianship. {a.first} won't talk to me, but the money is frozen. I'm the villain. A potentially rich villain.", "Lawsuit won: the guru got nothing. {a.first} called me “a dark soul.” I framed the ruling."] }, fx: { rel: -15, money: -3000, stress: 5 } },
          { w: 1, text: { fr: ["J'ai perdu le procès. Le gourou avait un meilleur avocat, payé avec l'argent de {a.my}. Il m'a envoyé une carte de remerciement.", "Le juge était membre de la secte. Je l'ai compris quand il a sorti sa toge sous sa robe."], en: ["I lost the lawsuit. The guru had a better lawyer, paid with {a.my}'s money. He sent me a thank-you card.", "The judge was a cult member. I realized it when he wore the white robe under his black one."] }, fx: { money: -6000, happy: -8 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Rejoindre la secte', en: 'Join the cult' },
        out: [
          { w: 1, text: { fr: ["J'ai rejoint la secte avec {a.my}. Repas végétaux, chants à 5 h du matin, et une orgie de câlins le jeudi. Honnêtement, mon stress a disparu. Mon compte en banque aussi.", "Je suis entré{|e} dans la secte. J'ai grimpé les échelons en six mois. Je suis maintenant vice-gourou. {a.first} m'obéit. Ça change."], en: ["I joined the cult with {a.my}. Plant-based meals, chanting at 5 a.m., and a group cuddle orgy on Thursdays. Honestly, my stress vanished. So did my bank account.", "I joined. I climbed the ranks in six months. I'm now vice-guru. {a.first} obeys me. That's new."] }, fx: { stress: -10, money: -4000, rel: 10, karma: -3 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai rejoint la secte pour garder un œil sur {a.my}. La « grande ascension » consistait à sauter d'un toit en drap blanc. Le gourou a sauté le premier. Il s'est écrasé comme une crêpe. Splash. Tout le monde est rentré.", "Le jour de l'ascension, le gourou s'est élancé du clocher… et s'est empalé sur la girouette. Ambiance. {a.first} a dit : « Bon, on rentre ? »"], en: ["I joined to keep an eye on {a.my}. The “great ascension” meant jumping off a roof in a white sheet. The guru jumped first. He went splat like a pancake. Everyone went home.", "On ascension day, the guru leapt from the bell tower… and got impaled on the weather vane. Awkward. {a.first} said: “So, shall we go home?”"] }, fx: { rel: 8, happy: 3, visual: 'gore' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_fake_ill',
    icon: '🤒',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    scene: { place: 'hospital', mood: 'sad', prop: 'bed' },
    when: { age: [25, 70], has: 'parent' },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "{a.rel} t'appelle d'une voix mourante : « Je crois que c'est la fin. Viens vite. » Tu traverses le pays. {a:Il|Elle} t'ouvre en pleine forme, avec {w:food} au four : « Oh, ça va mieux. »",
        "Troisième « crise cardiaque » de {a.first} cette année, toujours le jour de ton anniversaire, toujours quand tu as prévu autre chose. Le médecin parle de « gaz ».",
        "{a.first} est à l'hôpital « au plus mal ». Tu arrives en larmes. {a:Il|Elle} est en train de draguer tout le personnel soignant et de manger {w:food} en regardant {w:show}.",
        "{a.rel} a envoyé à toute la famille une photo de {a:lui|elle} sous perfusion. En zoomant, tu vois que la perfusion est accrochée à un porte-manteau et remplie de rosé.",
      ],
      en: [
        "{a.first} calls in a dying voice: “I think this is the end. Come quickly.” You cross the country. {a:He|She} opens the door in great shape, {w:food} in the oven: “Oh, I'm better now.”",
        "{a.first}'s third “heart attack” this year, always on your birthday, always when you have other plans. The doctor says “gas.”",
        "{a.first} is in the hospital “at death's door.” You arrive in tears. {a:He|She} is flirting with the entire nursing staff and eating {w:food} while watching {w:show}.",
        "{a.first} sent the whole family a photo of {a:himself|herself} on an IV. Zooming in, you see the IV hangs from a coat rack and is full of rosé.",
      ],
    },
    choices: [
      {
        label: { fr: 'Jouer le jeu', en: 'Play along' },
        out: [
          { w: 2, text: { fr: ["J'ai joué le jeu : j'ai veillé {a.my} toute la nuit. Au matin, {a:il|elle} a dansé le madison avec le kiné. Miracle de la médecine.", "J'ai fait semblant d'y croire. {a.first} a eu ce qu'{a:il|elle} voulait : moi, à son chevet, pendant trois jours. Et franchement, c'était bien."], en: ["I played along: I sat by {a.my} all night. In the morning {a:he|she} line-danced with the physical therapist. A medical miracle.", "I pretended to believe it. {a.first} got what {a:he|she} wanted: me, at the bedside, for three days. And honestly, it was nice."] }, fx: { rel: 10, stress: 4, karma: 3 } },
          { w: 1, text: { fr: ["J'ai joué le jeu et appelé le prêtre pour l'extrême-onction. {a.first} a guéri instantanément. Le prêtre a pris l'apéro avec nous.", "Je suis rentré{|e} dans son jeu au point d'organiser ses funérailles. {a.first} a vu le devis et a ressuscité en hurlant : « 6 000 € pour un cercueil ?! »"], en: ["I played along and called the priest for last rites. {a.first} recovered instantly. The priest stayed for drinks.", "I played along so hard I started planning the funeral. {a.first} saw the quote and resurrected, screaming: “$6,000 for a coffin?!”"] }, fx: { happy: 5, rel: 2 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Ne plus venir', en: 'Stop coming' },
        out: [
          { w: 2, text: { fr: ["J'ai ignoré le dernier appel. C'était encore un faux. Mais j'ai culpabilisé tout le week-end et bu deux bouteilles de vin, seul{|e}, devant {w:movie}.", "La quatrième fois, je ne suis pas venu{|e}. {a.first} a raconté à tout le quartier que j'attendais son héritage."], en: ["I ignored the latest call. It was fake again. But I felt guilty all weekend and drank two bottles of wine alone in front of {w:movie}.", "The fourth time, I didn't come. {a.first} told the whole neighborhood I'm waiting for the inheritance."] }, fx: { rel: -8, happy: -3 } },
          { w: 1, text: { fr: ["J'ai ignoré l'appel. Cette fois, c'était vrai : un calcul rénal de la taille d'une olive. {a.first} me l'a envoyé dans une boîte, avec un mot : « Tu vois ? »", "Je ne suis pas venu{|e}. C'était une vraie appendicite. On me l'a montrée dans un bocal à la sortie. Je n'oublierai jamais cette couleur."], en: ["I ignored the call. This time it was real: a kidney stone the size of an olive. {a.first} mailed it to me in a box with a note: “See?”", "I didn't come. It was a real appendicitis. They showed it to me in a jar afterwards. I'll never forget that color."] }, fx: { rel: -12, happy: -6, karma: -4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire pareil', en: 'Fight fire with fire' },
        out: [
          { w: 1, text: { fr: ["J'ai fait semblant d'être malade moi aussi. On s'est retrouvés tous les deux sur le canapé, à gémir et manger des crêpes. Meilleur week-end depuis des années.", "J'ai simulé une maladie encore plus grave. {a.first} a accouru, en pleine forme, avec {w:food}. On s'est regardés. On a compris. Pacte de sincérité signé."], en: ["I faked being sick too. We ended up together on the couch, moaning and eating crêpes. Best weekend in years.", "I faked something even worse. {a.first} rushed over, in perfect health, with {w:food}. We looked at each other. We understood. Honesty pact signed."] }, fx: { rel: 8, happy: 6 }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai simulé une gastro. Par la loi de l'ironie, j'ai attrapé une vraie gastro le lendemain. J'ai repeint les toilettes. {a.first} m'a soigné{|e} avec un air triomphant.", "Ma fausse maladie est devenue vraie : intoxication alimentaire carabinée. Vomi en jet, sueurs, prières. {a.first} : « Bon. Maintenant tu sais ce que je vis. »"], en: ["I faked a stomach bug. By the law of irony, I caught a real one the next day. I repainted the toilet. {a.first} nursed me with a triumphant look.", "My fake illness became real: brutal food poisoning. Projectile vomit, sweats, prayers. {a.first}: “Well. Now you know what I go through.”"] }, fx: { health: -5, rel: 4, disease: 'gastro' }, mood: 'sick' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_ashes',
    icon: '⚱️',
    cat: 'family',
    rating: 2,
    actor: { role: 'parent', living: false },
    scene: { place: 'beach', mood: 'sad', prop: 'urn', fx: 'ghost' },
    when: { age: [20, 85], test: parentsAllDead },
    weight: 4,
    once: true,
    text: {
      fr: [
        "L'urne de {a.rel} trône sur ton étagère depuis des mois, juste derrière {w:object}. Il est temps de disperser les cendres, comme {a.first} le voulait : face à la mer, {w:weather}.",
        "Tu décides enfin de disperser les cendres de {a.first}. {a:Il|Elle} voulait reposer « là où {a:il|elle} avait été le plus heureux{a:|se} » : {w:at_place}. Tu ne poses pas de questions.",
        "Les cendres de {a.rel} sont dans une boîte à biscuits depuis l'incinération. Ce matin, tu as failli les mettre dans ton café. C'est un signe : il faut organiser la dispersion.",
        "Selon ses dernières volontés, {a.first} veut que ses cendres soient dispersées pendant que tout le monde chante {w:song}. Tu as loué une enceinte.",
      ],
      en: [
        "{a.first}'s urn has been on your shelf for months, next to {w:object}. Time to scatter the ashes like {a:he|she} wanted: facing the sea, {w:weather}.",
        "You finally decide to scatter {a.first}'s ashes. {a:He|She} wanted to rest “where I was happiest”: {w:at_place}. You don't ask questions.",
        "{a.first}'s ashes have been in a cookie tin since the cremation. This morning you almost put them in your coffee. It's a sign: time to organize the scattering.",
        "According to {a:his|her} last wishes, {a.first} wants the ashes scattered while everyone sings {w:song}. You rented a speaker.",
      ],
    },
    choices: [
      {
        label: { fr: 'Cérémonie émouvante', en: 'A moving ceremony' },
        out: [
          { w: 1, text: { fr: ["J'ai ouvert l'urne face au vent. Le vent a tourné. J'ai {a.my} dans les yeux, dans la bouche et jusque dans le slip. Tout le monde a ri en pleurant. {a:Il|Elle} aurait adoré.", "Rafale au mauvais moment : les cendres de {a.my} ont recouvert ma tante de la tête aux pieds. Elle a éternué. J'ai encore un bout de {a.my} dans la narine gauche, je crois."], en: ["I opened the urn facing the wind. The wind turned. I got {a.my} in my eyes, my mouth and my underwear. Everyone laughed while crying. {a:He|She} would have loved it.", "Gust at the wrong moment: {a.my}'s ashes covered my aunt head to toe. She sneezed. I think I still have a bit of {a.my} in my left nostril."] }, fx: { happy: 2, health: -1, karma: 3 }, mood: 'cry' },
          { w: 1, text: { fr: ["Les cendres sont parties doucement vers l'horizon, dans un rayon de soleil. Un dauphin a sauté au loin. Je suis resté{|e} une heure, assis{|e} dans le sable. Merci pour tout.", "Cérémonie parfaite. La famille a raconté des anecdotes sur {a.my}, dont une très, très gênante sur un mariage en 1985. On a ri jusqu'au coucher du soleil."], en: ["The ashes drifted gently toward the horizon in a sunbeam. A dolphin jumped in the distance. I sat in the sand for an hour. Thank you for everything.", "Perfect ceremony. The family shared stories about {a.my}, including a very, very embarrassing one about a 1985 wedding. We laughed till sunset."] }, fx: { happy: 8, stress: -8, karma: 3 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'En garder un peu', en: 'Keep a little' },
        out: [
          { w: 1, text: { fr: ["J'ai gardé une pincée de {a.my} dans un pendentif. Le jour où il s'est ouvert {w:at_place}, une dame a cru que c'était de la drogue. Longue discussion avec la sécurité.", "J'ai mis un peu de {a.my} dans un sablier. {a:Il|Elle} mesure maintenant la cuisson de mes œufs. {a:Il|Elle} adorait les œufs mollets."], en: ["I kept a pinch of {a.my} in a pendant. The day it popped open {w:at_place}, a lady thought it was drugs. Long chat with security.", "I put some of {a.my} in an hourglass. {a:He|She} now times my boiled eggs. {a:He|She} loved soft-boiled eggs."] }, fx: { happy: 4 } },
          { w: 1, text: { fr: ["J'ai gardé un peu de cendres dans un bocal. Mon coloc a cru que c'était du poivre gris et en a mis dans ses pâtes. Il a dit : « C'est bon, ça, c'est quoi ? » Je n'ai jamais répondu.", "Le bocal de cendres est tombé dans le bac à litière. Le chat a fait son affaire dessus avant que je réagisse. Je n'en parlerai jamais à personne. Sauf ici."], en: ["I kept some ashes in a jar. My roommate thought it was gray pepper and put it in his pasta. He said: “This is good, what is it?” I never answered.", "The jar fell into the litter box. The cat did its business on it before I could react. I will never tell anyone. Except here."] }, fx: { happy: -4, karma: -2, visual: 'poop' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Feu d\'artifice', en: 'Fireworks send-off' },
        out: [
          { w: 1, text: { fr: ["J'ai fait mettre les cendres dans une fusée de feu d'artifice. {a.first} a explosé en bouquet rose au-dessus de la plage. Le plus beau départ possible.", "Les cendres de {a.my} ont fini dans un feu d'artifice. Gerbe dorée, applaudissements, tout le village est venu. {a:Il|Elle} n'a jamais été aussi populaire."], en: ["I had the ashes packed into a firework. {a.first} exploded into a pink bouquet over the beach. The most beautiful exit possible.", "{a.my}'s ashes went out in a firework. Golden shower of sparks, applause, the whole village came. {a:He|She} was never this popular."] }, fx: { happy: 10, money: -800, visual: 'explosion' }, mood: 'proud' },
          { w: 1, text: { fr: ["La fusée est partie à l'horizontale et a explosé dans la haie des voisins. Leur cabanon a brûlé. {a.first} a eu une sortie de scène digne d'un film d'action.", "Le feu d'artifice a raté : la fusée a fait trois tours et a atterri dans le barbecue des voisins. Leurs saucisses sont maintenant aromatisées à {a.my}."], en: ["The rocket went sideways and exploded in the neighbors' hedge. Their shed burned down. {a.first} got an action-movie exit.", "The firework failed: the rocket spun three times and landed in the neighbors' barbecue. Their sausages are now {a.my}-flavored."] }, fx: { money: -2500, happy: 2, visual: 'fire' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_estate_war',
    icon: '🪑',
    cat: 'family',
    rating: 2,
    actor: 'sibling',
    scene: { place: 'home', mood: 'angry', prop: 'boxes' },
    when: { age: [22, 85], has: 'sibling', test: aParentDead },
    weight: 5,
    cooldown: 10,
    text: {
      fr: [
        "Partage des affaires du parent décédé. Tout se passe bien jusqu'à ce que {a.rel} pose la main sur {w:object}. Le même que tu convoites depuis 1998. Les regards se croisent. Western.",
        "{a.first} est arrivé{a:|e} avec une camionnette à 7 h du matin, « pour aider au tri ». La moitié de la maison est déjà chargée, y compris {w:object} et le chat.",
        "Réunion chez le notaire. {a.first} sort un post-it jauni : « Le service en porcelaine sera pour mon enfant préféré. » {a:Il|Elle} affirme que c'est {a:lui|elle}. L'écriture ressemble étrangement à la sienne.",
        "{a.rel} et toi, debout dans le salon vide, chacun tenant un bout de la même horloge comtoise. Personne ne lâche. Il est 23 h. Ça dure depuis {w:time}.",
      ],
      en: [
        "Dividing up the late parent's things. All goes well until {a.first} puts a hand on {w:object}. The very one you've coveted since 1998. Eyes lock. Western standoff.",
        "{a.first} showed up with a van at 7 a.m. “to help sort things.” Half the house is already loaded, including {w:object} and the cat.",
        "Meeting at the lawyer's. {a.first} pulls out a yellowed sticky note: “The china set goes to my favorite child.” {a:He|She} claims that's {a:him|her}. The handwriting looks suspiciously like {a:his|hers}.",
        "{a.first} and you, standing in the empty living room, each holding one end of the same grandfather clock. Nobody lets go. It's 11 p.m. This has been going on since {w:time}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Bagarre générale', en: 'All-out brawl' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: ["Bagarre dans le salon. J'ai mis un coup de coude à {a.my}, {a:il|elle} m'a mordu l'oreille. Il y avait du sang sur le tapis persan, que personne ne voulait de toute façon. J'ai gagné l'objet. Et une cicatrice.", "On s'est battus comme des chiffonniers. {a.first} a pris un vase sur la tête, j'ai perdu une dent. Notre parent nous regardait depuis la photo sur la cheminée. Avec déception."], en: ["Brawl in the living room. I elbowed {a.my}, {a:he|she} bit my ear. Blood on the Persian rug, which nobody wanted anyway. I won the object. And a scar.", "We fought like alley cats. {a.first} took a vase to the head, I lost a tooth. Our parent watched from the photo on the mantel. Disappointed."] }, fx: { health: -6, rel: -15, happy: 2, visual: 'gore' }, mood: 'angry' },
          { w: 1, text: { fr: ["J'ai lancé l'assaut, j'ai glissé sur le parquet ciré et je me suis ouvert l'arcade sur la commode. {a.first} est parti{a:|e} avec tout, en me laissant un pansement.", "Bagarre ratée : je me suis coincé le dos en tirant sur l'horloge. {a.first} l'a emportée pendant que je rampais vers le canapé."], en: ["I charged, slipped on the polished floor and split my eyebrow on the dresser. {a.first} left with everything, and left me a Band-Aid.", "Failed brawl: I threw out my back pulling on the clock. {a.first} carried it off while I crawled toward the couch."] }, fx: { health: -8, happy: -6, rel: -8, disease: 'back_pain' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Tirer à pile ou face', en: 'Flip a coin' },
        out: [
          { w: 1, text: { fr: ["Pile ou face. J'ai gagné. {a.first} a exigé le meilleur des trois. Puis des cinq. À 41 lancers, on a ri comme quand on était petits. Je lui ai laissé l'objet.", "On a tout réparti à pile ou face, objet par objet. Ça a pris neuf heures. C'était la plus belle journée qu'on ait passée ensemble depuis l'enfance."], en: ["Heads or tails. I won. {a.first} demanded best of three. Then five. By throw 41 we were laughing like when we were kids. I let {a:him|her} have it.", "We split everything by coin toss, item by item. It took nine hours. It was the best day we'd spent together since childhood."] }, fx: { rel: 12, happy: 5, karma: 3 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai perdu à pile ou face. Plus tard, j'ai découvert que {a.my} avait une pièce à deux faces identiques. {a:Il|Elle} l'avait depuis la colo de 1996.", "La pièce est tombée dans la grille d'aération. On a démonté le plancher pour la récupérer. La maison ne vaut plus rien."], en: ["I lost the coin toss. Later I found out {a.my} had a two-headed coin. {a:He|She} had it since summer camp in 1996.", "The coin fell into the air vent. We tore up the floorboards to get it. The house is now worthless."] }, fx: { rel: -6, happy: -3 } },
        ],
      },
      {
        label: { fr: 'Tout laisser', en: 'Let them have it all' },
        out: [
          { w: 2, text: { fr: ["J'ai tout laissé à {a.my}. J'ai juste gardé une vieille photo et la recette secrète de la tarte. Je dors très bien. {a:Il|Elle}, un peu moins.", "« Prends tout. » {a.first} a été tellement déstabilisé{a:|e} qu'{a:il|elle} m'a rendu la moitié en pleurant. Victoire morale et matérielle."], en: ["I left everything to {a.my}. I just kept an old photo and the secret pie recipe. I sleep great. {a:He|She} sleeps a bit less.", "“Take it all.” {a.first} was so thrown that {a:he|she} gave me half back, crying. Moral and material victory."] }, fx: { karma: 8, rel: 8, happy: 2 } },
          { w: 1, text: { fr: ["J'ai tout laissé. Un mois plus tard, {a.my} a vendu {w:object} 40 000 € à un antiquaire. C'était un original. Je me suis allongé{|e} par terre une journée entière.", "Je lui ai laissé la vieille commode moche. Un tiroir secret contenait des lingots. {a.first} m'a envoyé une carte postale {w:far_place}."], en: ["I left everything. A month later {a.my} sold {w:object} to an antique dealer for $40,000. It was an original. I lay on the floor for an entire day.", "I let {a:him|her} have the ugly old dresser. A secret drawer held gold bars. {a.first} sent me a postcard from somewhere exotic."] }, fx: { happy: -10, karma: 4 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_par_secret_tape',
    icon: '📼',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    scene: { place: 'home', mood: 'shock', prop: 'vhs' },
    when: { age: [18, 60], has: 'parent' },
    weight: 3,
    once: true,
    text: {
      fr: [
        "En rangeant le grenier de {a.rel}, tu trouves une cassette VHS étiquetée « NE PAS REGARDER (1987) ». Tu la regardes. C'est un téléfilm érotique : « Le facteur sonne toujours deux fois à Palavas ». {a.first} a le premier rôle.",
        "Un collègue t'envoie un lien : « C'est pas ton parent, là ? » Une vidéo de 1984 où {a.first}, en justaucorps fluo moulant, danse sur {w:song} dans un clip très, très suggestif.",
        "Tu découvres que {a.first} a posé pour un calendrier caritatif « coquin » en 1989. Le mois de juillet. Avec seulement {w:object} pour cacher l'essentiel.",
        "Au vide-grenier, un inconnu s'arrête devant {a.rel}, rougit et murmure : « Vous êtes… la star de ‘Chaleur sous la couette 3’ ? » {a.first} répond : « On ne parle pas de ça devant les enfants. » Tu as {age} ans.",
      ],
      en: [
        "Cleaning out {a.first}'s attic, you find a VHS labeled “DO NOT WATCH (1987).” You watch it. It's an erotic TV movie: “The Mailman Always Rings Twice in Palm Springs.” {a.first} plays the lead.",
        "A coworker sends you a link: “Isn't that your parent?” A 1984 video of {a.first} in neon spandex, dancing to {w:song} in a very, very suggestive music video.",
        "You discover {a.first} posed for a “naughty” charity calendar in 1989. Month of July. With only {w:object} covering the essentials.",
        "At a yard sale, a stranger stops in front of {a.first}, blushes and whispers: “Are you… the star of ‘Heat Under the Covers 3’?” {a.first} replies: “We don't talk about that in front of the kids.” You're {age}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Ne jamais en parler', en: 'Never speak of it' },
        out: [
          { w: 2, text: { fr: ["J'ai rangé la cassette et je n'en ai jamais parlé. Mais à chaque repas de famille, quand {a.my} dit « passe-moi le sel », j'entends la musique de saxo.", "Silence radio. J'ai juste arrêté de regarder {a.my} dans les yeux. Ça fait trois ans."], en: ["I put the tape away and never mentioned it. But at every family dinner, when {a.my} says “pass the salt,” I hear the saxophone music.", "Radio silence. I just stopped looking {a.my} in the eye. It's been three years."] }, fx: { stress: 5, happy: -3 }, mood: 'sick' },
          { w: 1, text: { fr: ["Je n'ai rien dit. Mais {a.my} a remarqué que la cassette avait été rembobinée. {a:Il|Elle} m'a fait un clin d'œil au dîner. J'ai fait tomber ma fourchette.", "Je n'en ai pas parlé. {a.first} non plus. Mais {a:il|elle} m'a offert un saxophone à Noël. Message reçu, et je n'ai rien demandé."], en: ["I said nothing. But {a.my} noticed the tape had been rewound. {a:He|She} winked at me over dinner. I dropped my fork.", "I didn't bring it up. Neither did {a.my}. But {a:he|she} gave me a saxophone for Christmas. Message received, and unwanted."] }, fx: { stress: 7 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'En parler franchement', en: 'Talk about it openly' },
        out: [
          { w: 1, text: { fr: ["J'en ai parlé. {a.first} a éclaté de rire : « J'avais besoin d'argent pour payer ta couveuse. » Je me sens à la fois touché{|e} et souillé{|e}.", "Conversation franche. {a.first} m'a raconté les coulisses, sans filtre. J'ai appris le mot « doublure de fesses ». J'aurais préféré mourir jeune."], en: ["I brought it up. {a.first} burst out laughing: “I needed money for your incubator.” I feel touched and soiled at the same time.", "Frank conversation. {a.first} told me the behind-the-scenes stories, unfiltered. I learned the term “butt double.” I would have preferred to die young."] }, fx: { rel: 6, stress: 4 } },
          { w: 1, text: { fr: ["J'en ai parlé. {a.first} a nié, puis s'est enfermé{a:|e} dans la salle de bains. Mon autre parent est venu me dire, très calmement : « Le saxophoniste, c'était moi. »", "J'ai abordé le sujet. {a.first} m'a giflé{|e}, puis m'a dédicacé la jaquette. Je ne sais pas quoi faire de ces deux informations."], en: ["I brought it up. {a.first} denied it, then locked {a:himself|herself} in the bathroom. My other parent came over and said, very calmly: “The saxophonist was me.”", "I raised the subject. {a.first} slapped me, then autographed the cover. I don't know what to do with these two pieces of information."] }, fx: { happy: -4, stress: 6, rel: -4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'La vendre en ligne', en: 'Sell it online' },
        out: [
          { w: 1, text: { fr: ["J'ai vendu la VHS à un collectionneur pour 600 €. Elle est devenue culte sur un forum de cinéma bis. {a.first} reçoit des lettres de fans. {a:Il|Elle} est ravi{a:|e}.", "Vente aux enchères en ligne : 1 200 €. {a.first} a exigé 50 %, en tant qu'« ayant droit ». On a partagé un restaurant gastronomique dans un malaise absolu."], en: ["I sold the VHS to a collector for $600. It became a cult hit on a B-movie forum. {a.first} gets fan mail. {a:He|She} is thrilled.", "Online auction: $1,200. {a.first} demanded 50% as the “rights holder.” We shared a fancy dinner in absolute awkwardness."] }, fx: { money: 600, rel: 4, happy: 3 } },
          { w: 1, text: { fr: ["J'ai mis la cassette en vente. {a.first} l'a rachetée, anonymement, pour 900 €. Je l'ai découvert en voyant le colis sur sa table. Personne n'a rien dit.", "L'annonce est devenue virale. Toute la ville a vu le film. {a.first} ne peut plus aller {w:to_place} sans qu'on siffle. {a:Il|Elle} ne m'a jamais pardonné."], en: ["I listed the tape. {a.first} bought it back anonymously for $900. I found out when I saw the package on {a:his|her} table. Nobody said a word.", "The listing went viral. The whole town watched the movie. {a.first} can't go anywhere without wolf whistles. {a:He|She} never forgave me."] }, fx: { rel: -15, money: 900, karma: -4 }, mood: 'shock' },
        ],
      },
    ],
  },
  // ───────────────────────────── grandparents ─────────────────────────────
  {
    id: 'f2_gp_war_story',
    icon: '🎖️',
    cat: 'family',
    rating: 0,
    actor: 'grandparent',
    scene: { place: 'home', mood: 'sleepy', prop: 'armchair' },
    when: { age: [5, 40], has: 'grandparent' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "{a.rel} te raconte pour la 40e fois comment {a:il|elle} a traversé {w:far_place} à pied en 1962, avec seulement {w:food} et une boussole cassée. Les détails changent à chaque fois.",
        "Dimanche chez {a.first}. Au dessert, {a:il|elle} commence : « De mon temps… » Tu connais la suite. Il y a {w:animal}, un bal populaire et une bagarre avec un curé.",
        "{a.first} t'explique qu'{a:il|elle} a connu {w:celeb} « avant qu'il soit connu ». Version d'aujourd'hui : ils ont partagé {w:drink} {w:at_place}. Version de Noël dernier : c'était au service militaire.",
        "{a.rel} sort l'album photo. Sur chaque photo, {a:il|elle} pointe quelqu'un : « Lui, il est mort. Elle, morte. Lui, mort aussi, mais d'une façon rigolote. » Ça va prendre l'après-midi.",
      ],
      en: [
        "{a.first} tells you for the 40th time how {a:he|she} crossed the land on foot, ending up {w:far_place} in 1962 with only {w:food} and a broken compass. The details change every time.",
        "Sunday at {a.first}'s. At dessert {a:he|she} starts: “Back in my day…” You know what's coming. There's {w:animal}, a village dance and a fistfight with a priest.",
        "{a.first} explains {a:he|she} knew {w:celeb} “before they were famous.” Today's version: they shared {w:drink} {w:at_place}. Last Christmas's version: it was in the army.",
        "{a.first} pulls out the photo album. On each photo {a:he|she} points at someone: “Him, dead. Her, dead. Him, dead too, but in a funny way.” This will take all afternoon.",
      ],
    },
    choices: [
      {
        label: { fr: 'Écouter, vraiment', en: 'Really listen' },
        out: [
          { w: 2, text: { fr: ["J'ai écouté vraiment, en posant des questions. {a.first} s'est illuminé{a:|e}. J'ai appris un truc de dingue sur notre famille, que je garderai pour moi.", "J'ai écouté jusqu'au bout. {a.first} m'a serré la main très fort à la fin : « Tu es le seul ou la seule qui écoute. » J'ai eu un petit nœud dans la gorge."], en: ["I really listened and asked questions. {a.first} lit up. I learned something wild about our family that I'll keep to myself.", "I listened to the very end. {a.first} squeezed my hand hard: “You're the only one who listens.” I got a little lump in my throat."] }, fx: { rel: 10, smarts: 2, karma: 3 }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai écouté. Trois heures. L'histoire s'est terminée par « … et c'est comme ça que j'ai perdu mon doigt. » {a.first} a dix doigts. Je n'ai pas osé demander.", "J'ai écouté religieusement. {a.first} s'est endormi{a:|e} au milieu de sa propre histoire. J'attends toujours la fin."], en: ["I listened. Three hours. The story ended with “…and that's how I lost my finger.” {a.first} has ten fingers. I didn't dare ask.", "I listened religiously. {a.first} fell asleep in the middle of {a:his|her} own story. Still waiting for the ending."] }, fx: { rel: 5, happy: 1 } },
        ],
      },
      {
        label: { fr: 'Enregistrer en podcast', en: 'Record it as a podcast' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai enregistré {a.my} pour un podcast. « Les chroniques de {a.first} » ont 12 000 auditeurs. {a:Il|Elle} exige des droits d'auteur en bonbons.", "J'ai lancé le podcast de {a.my}. {a:Il|Elle} a reçu un mail d'un éditeur. Livre prévu à Noël. Je suis son agent."], en: ["I recorded {a.my} for a podcast. “The {a.first} Chronicles” has 12,000 listeners. {a:He|She} demands royalties in candy.", "I launched {a.my}'s podcast. {a:He|She} got an email from a publisher. Book coming out at Christmas. I'm the agent."] }, fx: { rel: 8, followers: 1500, fame: 1, happy: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai enregistré une heure. En réécoutant, on n'entendait rien, sauf {w:sound} et {a.my} qui disait « hein ? » toutes les deux minutes. Zéro écoute.", "Le podcast a fait trois écoutes : moi, {a.my} et un bot russe. {a:Il|Elle} est quand même fier{a:|e}."], en: ["I recorded for an hour. Playing it back, there was only {w:sound} and {a.my} saying “huh?” every two minutes. Zero listens.", "The podcast got three listens: me, {a.my} and a Russian bot. {a:He|She} is proud anyway."] }, fx: { rel: 4, happy: 1 } },
        ],
      },
      {
        label: { fr: 'Corriger les erreurs', en: 'Fact-check it' },
        out: [
          { w: 1, text: { fr: ["J'ai fait remarquer qu'en 1962 on ne pouvait pas avoir de smartphone. {a.first} m'a regardé{|e} longuement, puis a dit : « Toi, tu n'auras rien sur le testament. »", "J'ai pointé les incohérences. {a.first} a lancé : « Et toi, tu étais où, en 1962 ? » Imparable."], en: ["I pointed out you couldn't have a smartphone in 1962. {a.first} stared at me for a long time, then said: “You're out of the will.”", "I pointed out the inconsistencies. {a.first} shot back: “And where were YOU in 1962?” Unbeatable."] }, fx: { rel: -6, smarts: 1 } },
          { w: 1, text: { fr: ["J'ai vérifié sur Internet. L'histoire était vraie. Toute. Même le passage avec {w:animal}. Je regarde {a.my} différemment maintenant.", "J'ai voulu démonter l'histoire. {a.first} a sorti une coupure de journal de 1962 avec sa photo. Respect absolu."], en: ["I checked online. The story was true. All of it. Even the part with {w:animal}. I look at {a.my} differently now.", "I tried to debunk it. {a.first} pulled out a 1962 newspaper clipping with {a:his|her} photo. Absolute respect."] }, fx: { rel: 6, smarts: 2 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_gp_card_money',
    icon: '💌',
    cat: 'family',
    rating: 0,
    actor: 'grandparent',
    vars: { amount: [5, 60] },
    scene: { place: 'home', mood: 'happy', prop: 'card' },
    when: { age: [5, 17], has: 'grandparent' },
    weight: 8,
    cooldown: 2,
    text: {
      fr: [
        "Carte d'anniversaire de {a.rel}, écrite en lettres tremblantes. « Pour mon petit trésor qui a [[6|7|9]] ans » (tu en as {age}). Dedans : {$amount} et un ticket de bus de 1991.",
        "{a.first} te glisse un billet plié en seize dans la main, avec un clin d'œil de conspirateur : « Ne dis rien à tes parents. » C'est {$amount}. Tu te sens très riche, et un peu complice.",
        "Colis de {a.first} : {w:gift}, {w:food} emballé dans du papier journal, et une enveloppe avec {$amount}. Le mot dit : « Achète-toi quelque chose d'utile, pas des bêtises. »",
        "{a.rel} t'appelle pour savoir si tu as « bien reçu le petit quelque chose ». La carte est arrivée ouverte, tu as reçu {$amount}… et un autocollant représentant {w:animal}.",
      ],
      en: [
        "Birthday card from {a.first}, in shaky handwriting. “For my little treasure who's turning [[6|7|9]]” (you're {age}). Inside: {$amount} and a bus ticket from 1991.",
        "{a.first} slips a bill folded sixteen times into your hand, with a conspiratorial wink: “Don't tell your parents.” It's {$amount}. You feel very rich, and a little complicit.",
        "Package from {a.first}: {w:gift}, {w:food} wrapped in newspaper, and an envelope with {$amount}. The note says: “Buy yourself something useful, not junk.”",
        "{a.first} calls to check you “got the little something.” The card arrived open; you got {$amount}… and a sticker of {w:animal}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout claquer en bonbons', en: 'Blow it on candy' },
        out: [
          { w: 2, text: { fr: ["J'ai tout dépensé en bonbons. J'ai eu mal au ventre pendant deux jours et je ne regrette rien.", "Bonbons, chips et une bague en plastique qui clignote. {a.first} serait horrifié{a:|e}. Moi, je suis au paradis."], en: ["I spent it all on candy. Stomachache for two days, no regrets.", "Candy, chips and a blinking plastic ring. {a.first} would be horrified. I'm in heaven."] }, fx: { money: 'amount', happy: 6, health: -2 }, mood: 'happy' },
          { w: 1, text: { fr: ["Orgie de bonbons. J'ai vomi un arc-en-ciel sur le tapis du salon. Mes parents ont confisqué le reste « pour la famille ».", "J'ai mangé tous les bonbons d'un coup. Ma dent du fond a dit adieu. Le dentiste a coûté dix fois le cadeau."], en: ["Candy binge. I puked a rainbow on the living-room rug. My parents confiscated the rest “for the family.”", "I ate all the candy at once. My back tooth said goodbye. The dentist cost ten times the gift."] }, fx: { health: -4, happy: -2 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Épargner', en: 'Save it' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai mis l'argent dans ma tirelire cochon. Je suis un petit banquier. {a.first} a pleuré de fierté au téléphone.", "Épargne responsable. J'ai noté la somme dans un carnet, avec la date et une étoile. Je deviens bizarre."], en: ["I put the money in my piggy bank. I'm a little banker. {a.first} cried with pride on the phone.", "Responsible saving. I wrote the amount in a notebook, with the date and a star. I'm becoming weird."] }, fx: { money: 'amount', discipline: 3, rel: 4 } },
          { w: 1, text: { fr: ["J'ai épargné. Mon grand frère a trouvé la tirelire. La tirelire est vide et il a un nouveau jeu vidéo. La vie est injuste.", "J'ai caché l'argent si bien que je ne l'ai jamais retrouvé. Il est quelque part dans la maison. Un jour, peut-être."], en: ["I saved it. An older kid in the family found the piggy bank. It's empty, and they have a new video game. Life is unfair.", "I hid the money so well I never found it again. It's somewhere in the house. Someday, maybe."] }, fx: { happy: -4 } },
        ],
      },
      {
        label: { fr: 'Appeler pour remercier', en: 'Call to say thanks' },
        out: [
          { w: 2, text: { fr: ["J'ai appelé {a.my} pour remercier. {a:Il|Elle} était tellement content{a:|e} qu'{a:il|elle} a renvoyé un autre billet la semaine suivante. Le système marche.", "Coup de fil de remerciement. {a.first} m'a parlé 45 minutes de ses voisins. Mais j'ai entendu le sourire dans sa voix."], en: ["I called {a.my} to say thanks. {a:He|She} was so happy {a:he|she} sent another bill the next week. The system works.", "Thank-you call. {a.first} talked for 45 minutes about the neighbors. But I could hear the smile in {a:his|her} voice."] }, fx: { money: 'amount', rel: 10, karma: 2 }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai appelé pour remercier. {a.first} ne se souvenait pas avoir envoyé quoi que ce soit et m'a demandé de rendre l'argent « au monsieur ».", "J'ai remercié {a.my}, qui a conclu par « Et tes notes, alors ? ». Le piège s'est refermé."], en: ["I called to say thanks. {a.first} didn't remember sending anything and asked me to give the money back “to the gentleman.”", "I thanked {a.my}, who wrapped up with “And how are your grades?” The trap snapped shut."] }, fx: { rel: 4, stress: 2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_gp_wrong_name',
    icon: '🌀',
    cat: 'family',
    rating: 0,
    actor: 'grandparent',
    scene: { place: 'home', mood: 'sad', prop: 'armchair' },
    when: { age: [10, 55], has: 'grandparent' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "{a.rel} commence à perdre la mémoire. Aujourd'hui, {a:il|elle} t'appelle par le nom de son ancien chien, puis te demande si tu as « bien rangé le tracteur ».",
        "{a.first} te prend pour {w:celeb}. {a:Il|Elle} te demande un autographe, très ému{a:|e}, et te dit que {a:il|elle} a tous tes disques.",
        "Quand tu arrives, {a.first} te sourit : « Ah, le plombier ! » Puis {a:il|elle} te montre une fuite imaginaire sous l'évier et te propose {w:drink} pour la peine.",
        "{a.rel} raconte à tout le monde que tu es {w:weird_job} et que tu vis {w:far_place}. Tu es assis{|e} juste à côté, avec ta part de tarte.",
      ],
      en: [
        "{a.first} is starting to lose {a:his|her} memory. Today {a:he|she} calls you by the name of {a:his|her} old dog, then asks if you “put the tractor away.”",
        "{a.first} thinks you're {w:celeb}. {a:He|She} asks for an autograph, deeply moved, and says {a:he|she} owns all your records.",
        "When you arrive, {a.first} smiles: “Ah, the plumber!” Then {a:he|she} shows you an imaginary leak under the sink and offers you {w:drink} for your trouble.",
        "{a.first} tells everyone you're {w:weird_job} and live {w:far_place}. You're sitting right next to {a:him|her}, with your slice of pie.",
      ],
    },
    choices: [
      {
        label: { fr: 'Jouer le rôle', en: 'Play the part' },
        out: [
          { w: 2, text: { fr: ["J'ai joué le rôle à fond. J'ai signé l'autographe, réparé la fuite imaginaire et accepté le verre. {a.first} a passé la meilleure journée du mois.", "J'ai répondu au nom du chien. J'ai même aboyé un peu. {a.first} a ri aux éclats. C'est tout ce qui compte."], en: ["I played the part all the way. Signed the autograph, fixed the imaginary leak and accepted the drink. {a.first} had the best day of the month.", "I answered to the dog's name. I even barked a little. {a.first} laughed like a kid. That's all that matters."] }, fx: { rel: 10, karma: 5, happy: 3 }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai joué le jeu. {a.first} m'a payé{|e} 20 € pour la « réparation ». J'ai essayé de refuser. {a:Il|Elle} a insisté avec une force surprenante.", "Je suis entré{|e} dans le rôle. {a.first} m'a confié des secrets de famille qu'{a:il|elle} n'aurait jamais dits à son petit-enfant. Je ne sais pas quoi en faire."], en: ["I played along. {a.first} paid me $20 for the “repair.” I tried to refuse. {a:He|She} insisted with surprising strength.", "I stayed in character. {a.first} told me family secrets {a:he|she} would never have told a grandchild. I don't know what to do with them."] }, fx: { rel: 6, money: 20, stress: 2 } },
        ],
      },
      {
        label: { fr: 'Rappeler qui je suis', en: 'Remind them who I am' },
        out: [
          { w: 1, text: { fr: ["J'ai doucement rappelé à {a.my} qui j'étais. Un éclair dans ses yeux : « Mais oui ! Tu as grandi ! » On a regardé les vieilles photos ensemble.", "J'ai montré une photo de nous deux. {a.first} a reconnu le moment, a pleuré un peu, puis m'a appelé{|e} par mon prénom. Victoire fragile, mais victoire."], en: ["I gently reminded {a.my} who I was. A spark in {a:his|her} eyes: “Of course! You've grown!” We looked at old photos together.", "I showed a photo of the two of us. {a.first} recognized the moment, cried a little, then called me by my name. Fragile victory, but a victory."] }, fx: { rel: 8, happy: 4 }, mood: 'cry' },
          { w: 1, text: { fr: ["J'ai insisté sur mon identité. {a.first} s'est méfié{a:|e} et a appelé la police pour signaler « un individu qui se fait passer pour un membre de la famille ».", "J'ai expliqué qui j'étais. {a.first} a hoché la tête et m'a demandé si le tracteur était rangé. On en était au même point."], en: ["I insisted on who I was. {a.first} got suspicious and called the police to report “someone pretending to be family.”", "I explained who I was. {a.first} nodded and asked if the tractor was put away. Back to square one."] }, fx: { stress: 4, happy: -3 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Rendre visite plus souvent', en: 'Visit more often' },
        out: [
          { w: 2, text: { fr: ["J'ai décidé de venir chaque dimanche. Certaines semaines {a.my} me reconnaît, d'autres non. Mais on mange {w:food} et on rit toujours.", "Je passe maintenant tous les dimanches. On joue aux dominos. {a.first} triche, je fais semblant de ne pas voir. Rituel sacré."], en: ["I decided to come every Sunday. Some weeks {a.my} recognizes me, some weeks not. But we eat {w:food} and we always laugh.", "I come by every Sunday now. We play dominoes. {a.first} cheats, I pretend not to notice. Sacred ritual."] }, fx: { rel: 12, happy: 4, karma: 4 }, mood: 'happy' },
          { w: 1, text: { fr: ["Je viens plus souvent. {a.first} m'a présenté{|e} à toute la résidence comme « son nouveau fiancé ou sa nouvelle fiancée ». J'ai été accueilli{|e} avec des applaudissements.", "Mes visites régulières ont un effet : {a.my} se souvient de mon prénom. Mais m'appelle aussi « la personne qui vient manger mes gâteaux »."], en: ["I visit more often. {a.first} introduced me to the whole care home as “my new sweetheart.” I got a round of applause.", "My regular visits are working: {a.my} remembers my name. But also calls me “the one who comes to eat my cookies.”"] }, fx: { rel: 8, happy: 2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_gp_dementia_trash',
    icon: '🫢',
    cat: 'family',
    rating: 2,
    actor: 'grandparent',
    scene: { place: 'home', mood: 'shock', prop: 'turkey' },
    when: { age: [18, 60], has: 'grandparent' },
    weight: 5,
    cooldown: 6,
    text: {
      fr: [
        "Repas de famille. {a.first}, qui perd un peu la tête, se lève et annonce : « Tonton Jean-Pierre n'est pas le fils de qui vous croyez. C'était le facteur. Il avait des mains de pianiste. » Personne ne mâche.",
        "{a.first} n'a plus de filtre. Au dessert, {a:il|elle} décrit avec précision la nuit de noces de 1958, puis traite ta tante de « {w:insult} » et réclame {w:drink}.",
        "{a.first} a confondu le prêtre venu {a:le|la} bénir avec un ancien amant. {a:Il|Elle} lui pince les fesses en hurlant « {w:swear} Tu n'as pas changé ! » Le prêtre ne sait plus où se mettre.",
        "À l'anniversaire de mariage de tes parents, {a.rel} attrape le micro et révèle que ta mère « a fait la vaisselle avec la moitié du village en 85 ». Puis {a:il|elle} chante {w:song}.",
      ],
      en: [
        "Family dinner. {a.first}, who's losing it a bit, stands up and announces: “Uncle Jean-Pierre's father isn't who you think. It was the mailman. He had pianist's hands.” Nobody chews.",
        "{a.first} has no filter left. At dessert {a:he|she} describes the 1958 wedding night in great detail, then calls your aunt a “{w:insult}” and demands {w:drink}.",
        "{a.first} mistook the priest who came to bless {a:him|her} for an old lover. {a:He|She} pinches his butt, yelling “{w:swear} You haven't changed!” The priest doesn't know where to look.",
        "At your parents' anniversary, {a.first} grabs the mic and reveals your mother “did the dishes with half the village in '85.” Then {a:he|she} sings {w:song}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Changer de sujet', en: 'Change the subject' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai crié « QUI VEUT DU FROMAGE ? ». Diversion réussie à 80 %. Le facteur est resté dans tous les esprits.", "J'ai lancé un débat sur la météo. {a.first} a enchaîné sur la météo « de la nuit où j'ai trompé {a:ta grand-mère|ton grand-père} ». Échec."], en: ["I yelled “WHO WANTS CHEESE?” Diversion 80% successful. The mailman stayed on everyone's mind.", "I started a debate about the weather. {a.first} moved on to the weather “the night I cheated on {a:your grandmother|your grandfather}.” Failure."] }, fx: { rel: 2, stress: 3 } },
          { w: 1, text: { fr: ["J'ai changé de sujet. {a.first} m'a pointé{|e} du doigt : « Toi, tu es le portrait craché du facteur. » Toute la table s'est tournée vers moi.", "J'ai voulu détourner l'attention. {a.first} a enchaîné : « Et toi, tu fais quoi au lit ? » Je suis parti{|e} chercher le pain. Pendant deux heures."], en: ["I changed the subject. {a.first} pointed at me: “You're the spitting image of the mailman.” The whole table turned to me.", "I tried to divert attention. {a.first} continued: “And you, what are you like in bed?” I went to get bread. For two hours."] }, fx: { happy: -4, stress: 6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Poser des questions', en: 'Ask follow-up questions' },
        out: [
          { w: 1, text: { fr: ["J'ai posé des questions. Beaucoup. J'ai découvert que {a.my} avait eu une vie sexuelle plus riche que tout l'arbre généalogique réuni. J'ai pris des notes. Puis je les ai brûlées.", "J'ai creusé. {a.first} a tout raconté, dates et positions comprises. Ma mère a quitté la table. Moi, j'ai commandé une deuxième part de gâteau."], en: ["I asked questions. Lots. I discovered {a.my} had a richer sex life than the entire family tree combined. I took notes. Then I burned them.", "I dug deeper. {a.first} told everything, dates and positions included. My mom left the table. I ordered a second slice of cake."] }, fx: { happy: 5, rel: 6, stress: 3 }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai demandé des détails. Les détails comprenaient une grange, un accordéon et de l'huile de foie de morue. Je ne mangerai plus jamais de poisson.", "Mes questions ont déclenché une révélation sur moi : j'ai été conçu{|e} « sur la machine à laver, en essorage ». Je ne peux plus faire de lessive."], en: ["I asked for details. The details included a barn, an accordion and cod liver oil. I will never eat fish again.", "My questions triggered a revelation about me: I was conceived “on the washing machine, during the spin cycle.” I can't do laundry anymore."] }, fx: { happy: -3, stress: 5 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Filmer pour la postérité', en: 'Film it for posterity' },
        out: [
          { w: 1, text: { fr: ["J'ai tout filmé. La vidéo « {a:Papi|Mamie} balance tout » est devenue l'archive familiale la plus regardée. On la passe à chaque Noël.", "J'ai filmé. Les révélations de {a.my} ont lancé trois tests ADN dans la famille. Tonton est officiellement le fils du facteur. Il est ravi, le facteur était beau."], en: ["I filmed everything. The video “Grandparent Spills It All” became the most-watched family archive. We play it every Christmas.", "I filmed it. {a.first}'s revelations launched three DNA tests in the family. Uncle is officially the mailman's son. He's thrilled, the mailman was handsome."] }, fx: { happy: 6, rel: 4 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai filmé et posté. Le facteur, 91 ans, a vu la vidéo et a débarqué au déjeuner du dimanche avec des fleurs. {a.first} l'a embrassé à pleine bouche. Mon autre grand-parent a fait un malaise.", "La vidéo a fuité sur {w:app}. 200 000 vues. Ma mère ne me parle plus. {a.first} a reçu des demandes en mariage."], en: ["I filmed and posted it. The mailman, now 91, saw the video and showed up at Sunday lunch with flowers. {a.first} kissed him full on the mouth. My other grandparent fainted.", "The video leaked on {w:app}. 200,000 views. My mom isn't speaking to me. {a.first} got marriage proposals."] }, fx: { followers: 5000, rel: 3, karma: -4 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_gp_dating_app',
    icon: '👵',
    cat: 'family',
    rating: 1,
    actor: 'grandparent',
    scene: { place: 'home', mood: 'happy', prop: 'phone' },
    when: { age: [16, 50], has: 'grandparent' },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "{a.rel} veut s'inscrire sur {w:app} et a besoin de ton aide pour la photo de profil. {a:Il|Elle} a déjà choisi : une photo de {a:lui|elle} en 1971, {w:at_place}, avec des pattes d'eph'.",
        "{a.first} t'annonce, rayonnant{a:|e} : « J'ai un rencard ! » Avec quelqu'un rencontré sur {w:app}. Ils vont {w:to_place}. {a:Il|Elle} veut des conseils de séduction. À toi.",
        "{a.first} a 82 ans et plus de matchs que toi sur {w:app}. Bio : « {a:Veuf|Veuve} dynamique, aime {w:hobby}, dentier amovible, cœur disponible. »",
        "{a.rel} t'envoie des captures d'écran de ses conversations sur {w:app} pour avoir ton avis. L'un de ses prétendants signe tous ses messages par « {w:nickname} ».",
      ],
      en: [
        "{a.first} wants to sign up for {w:app} and needs your help with the profile picture. {a:He|She} has already picked one: a 1971 photo of {a:himself|herself} {w:at_place}, in bell-bottoms.",
        "{a.first} announces, beaming: “I have a date!” With someone met on {w:app}. They're going {w:to_place}. {a:He|She} wants seduction tips. From you.",
        "{a.first} is 82 and has more matches than you on {w:app}. Bio: “Dynamic {a:widower|widow}, loves {w:hobby}, removable dentures, heart available.”",
        "{a.first} sends you screenshots of {a:his|her} {w:app} chats for your opinion. One suitor signs every message “{w:nickname}.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Coacher à fond', en: 'Full coaching mode' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["J'ai coaché {a.my} comme un pro. Nouvelle photo, bio drôle. Trois rencards en une semaine. {a:Il|Elle} rentre plus tard que moi le samedi.", "Coaching réussi. {a.first} a trouvé l'amour avec un{a:e|} retraité{a:e|} qui fait de la moto. Ils partent en road trip. Je garde le chat."], en: ["I coached {a.my} like a pro. New photo, funny bio. Three dates in a week. {a:He|She} comes home later than me on Saturdays.", "Coaching successful. {a.first} found love with a biker retiree. They're going on a road trip. I'm cat-sitting."] }, fx: { rel: 10, happy: 5 }, mood: 'happy' },
          { w: 1, text: { fr: ["Mes conseils ont trop bien marché : {a.my} se fait maintenant draguer {w:at_place} par des gens de 40 ans. Je dois jouer les chaperons.", "Coaching parfait, sauf un détail : {a.my} a utilisé ma phrase d'accroche avec mon propre prof d'université. Ils se voient le mardi."], en: ["My advice worked too well: {a.my} now gets hit on {w:at_place} by 40-year-olds. I have to play chaperone.", "Perfect coaching, except for one detail: {a.my} used my pickup line on my own college professor. They meet on Tuesdays."] }, fx: { rel: 6, stress: 4 } },
        ],
      },
      {
        label: { fr: 'Vérifier les prétendants', en: 'Vet the suitors' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai enquêté. Le prétendant n°1 était un brouteur qui voulait des cartes cadeaux. Je l'ai démasqué. {a.first} m'appelle « mon détective ».", "Vérification faite : le prétendant est un vrai retraité, ancien champion de pétanque. J'ai validé. {a.first} m'a fait un clin d'œil gênant."], en: ["I investigated. Suitor #1 was a scammer who wanted gift cards. I exposed him. {a.first} calls me “my detective.”", "Background check done: the suitor is a real retiree, former bocce champion. Approved. {a.first} gave me an awkward wink."] }, fx: { rel: 8, karma: 4, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai voulu enquêter. {a.first} l'a très mal pris : « Je n'ai pas besoin d'un chaperon, j'ai survécu à la guerre froide. »", "Ma vérification a révélé que le prétendant était… mon autre grand-parent, sous pseudo. Ils étaient divorcés depuis 30 ans. Ils se sont remis ensemble."], en: ["I tried to investigate. {a.first} took it badly: “I don't need a chaperone, I survived the Cold War.”", "My check revealed the suitor was… my other grandparent, under a fake name. They'd been divorced for 30 years. They got back together."] }, fx: { rel: -2, happy: 3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Refuser, trop bizarre', en: 'Refuse, too weird' },
        out: [
          { w: 1, text: { fr: ["J'ai refusé d'aider. {a.first} a demandé à mon cousin. Il lui a fait un profil avec un filtre chien. {a:Il|Elle} a 400 matchs.", "J'ai dit non. {a.first} s'est débrouillé{a:|e} seul{a:|e} et a mis comme photo un selfie involontaire de ses narines. Ça a marché quand même."], en: ["I refused to help. {a.first} asked my cousin. He made a profile with a dog filter. {a:He|She} has 400 matches.", "I said no. {a.first} figured it out alone and used an accidental nostril selfie as the photo. It worked anyway."] }, fx: { rel: -3 } },
          { w: 1, text: { fr: ["J'ai refusé. {a.first} m'a regardé{|e} avec tristesse : « À mon âge, chaque jour compte. » J'ai culpabilisé pendant une semaine.", "J'ai refusé, et {a.my} a fini par aller au bal des seniors. {a:Il|Elle} est revenu{a:|e} à 4 h du matin, sans chaussures. Je n'ai rien demandé."], en: ["I refused. {a.first} looked at me sadly: “At my age, every day counts.” I felt guilty for a week.", "I refused, and {a.my} went to the seniors' dance instead. Came home at 4 a.m., shoeless. I didn't ask."] }, fx: { rel: -5, happy: -2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_gp_force_feed',
    icon: '🍲',
    cat: 'family',
    rating: 0,
    actor: 'grandparent',
    scene: { place: 'home', mood: 'sick', prop: 'pot' },
    when: { age: [4, 35], has: 'grandparent' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Déjeuner chez {a.rel}. Entrée, plat, deuxième plat, fromage, trois desserts. Tu as fini. {a.first} te ressert {w:food} : « Tu es tout{|e} maigre, on ne te nourrit pas ? »",
        "{a.first} a cuisiné pour douze. Vous êtes trois. {a:Il|Elle} te regarde manger avec l'intensité d'un aigle, une louche à la main, prêt{a:|e} à frapper.",
        "Chez {a.first}, refuser une assiette est une insulte à toute la lignée. Ton ventre fait {w:sound}. Ton assiette déborde encore. Au menu : {w:food}.",
        "{a.rel} a préparé sa spécialité : {w:food} « à l'ancienne », qui mijote depuis mardi. Ça dégage {w:smell}. Tout le monde te regarde, c'est ton tour de goûter.",
      ],
      en: [
        "Lunch at {a.first}'s. Starter, main, second main, cheese, three desserts. You're done. {a.first} serves you more {w:food}: “You're so skinny, does nobody feed you?”",
        "{a.first} cooked for twelve. There are three of you. {a:He|She} watches you eat with the intensity of an eagle, ladle in hand, ready to strike.",
        "At {a.first}'s, refusing a plate is an insult to the entire bloodline. Your stomach makes {w:sound}. Your plate is still overflowing with {w:food}.",
        "{a.first} made {a:his|her} specialty: old-fashioned {w:food}, simmering since Tuesday. It gives off {w:smell}. Everyone's looking at you: your turn to taste.",
      ],
    },
    choices: [
      {
        label: { fr: 'Manger, par amour', en: 'Eat, out of love' },
        out: [
          { w: 2, text: { fr: ["J'ai tout mangé. {a.first} a pleuré de bonheur. J'ai dû défaire mon pantalon et dormir trois heures sur le canapé, comme un python.", "J'ai fini l'assiette. Et la suivante. {a.first} m'a déclaré{|e} « petit-enfant préféré » devant tout le monde."], en: ["I ate it all. {a.first} cried with joy. I had to unbutton my pants and sleep for three hours on the couch, like a python.", "I finished the plate. And the next one. {a.first} declared me “favorite grandchild” in front of everyone."] }, fx: { rel: 10, weight: 0.03, happy: 3, health: -1 }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai mangé par politesse. Je me suis senti{|e} gonfler comme une montgolfière. Le trajet du retour a été une épreuve olympique.", "J'ai tout avalé. {a.first} a dit « bon, maintenant le dessert ». J'ai vu ma vie défiler."], en: ["I ate out of politeness. I felt myself inflating like a hot-air balloon. The drive home was an Olympic event.", "I swallowed everything. {a.first} said “right, now dessert.” My life flashed before my eyes."] }, fx: { health: -3, weight: 0.04, rel: 6 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Nourrir le chien en douce', en: 'Feed the dog secretly' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai glissé la moitié de l'assiette au chien sous la table. Le chien et moi sommes maintenant liés à vie.", "Opération chien réussie. {a.first} est fier{a:|e} de mon appétit. Le chien a pris deux kilos."], en: ["I slipped half the plate to the dog under the table. The dog and I are now bonded for life.", "Dog operation successful. {a.first} is proud of my appetite. The dog gained four pounds."] }, fx: { happy: 4, rel: 4 } },
          { w: 1, text: { fr: ["Le chien a refusé. Même le chien. {a.first} a vu l'assiette par terre et a compris. Silence glacial jusqu'au café.", "Le chien a tout mangé puis vomi sur les chaussons de {a.my}. Enquête ouverte. Je suis le principal suspect."], en: ["The dog refused. Even the dog. {a.first} saw the plate on the floor and understood. Icy silence until coffee.", "The dog ate it all, then threw up on {a.my}'s slippers. Investigation open. I'm the prime suspect."] }, fx: { rel: -6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Demander la recette', en: 'Ask for the recipe' },
        out: [
          { w: 2, text: { fr: ["J'ai demandé la recette. {a.first} m'a dicté pendant une heure, avec des mesures comme « une poignée » et « jusqu'à ce que ça chante ». Un trésor.", "{a.my} m'a confié la recette secrète, à condition de ne la donner à personne « surtout pas à ta tante ». Je suis l'héritier ou l'héritière culinaire."], en: ["I asked for the recipe. {a.first} dictated for an hour, with measurements like “a handful” and “until it sings.” A treasure.", "{a.my} gave me the secret recipe, on the condition I never share it, “especially not with your aunt.” I'm the culinary heir."] }, fx: { rel: 8, smarts: 2 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai demandé la recette. L'ingrédient secret était {w:food}. Et un peu de saindoux. Beaucoup de saindoux. Je ne regarderai plus jamais ce plat pareil.", "Recette obtenue. Je l'ai refaite chez moi. Résultat immangeable. {a.first} m'a dit : « Il manque l'amour. Et le sel. »"], en: ["I asked for the recipe. The secret ingredient was {w:food}. And some lard. A lot of lard. I'll never see that dish the same way again.", "Recipe obtained. I made it at home. Inedible. {a.first} said: “It's missing love. And salt.”"] }, fx: { rel: 4, happy: -1 } },
        ],
      },
    ],
  },
  {
    id: 'f2_gp_fake_death',
    icon: '⚰️',
    cat: 'family',
    rating: 2,
    actor: 'grandparent',
    scene: { place: 'cemetery', mood: 'cry', prop: 'coffin' },
    when: { age: [14, 60], has: 'grandparent' },
    weight: 3,
    once: true,
    text: {
      fr: [
        "Faire-part reçu : {a.rel} est mort{a:|e} « paisiblement, {w:time} ». Enterrement samedi. Bizarrement, le faire-part précise : « Venez nombreux, je compte. »",
        "On t'annonce le décès de {a.first}. Cérémonie demain {w:weather}. Détail étrange : le cercueil est fermé, et il y a un trou de la taille d'un œil dans le couvercle.",
        "{a.first} est décédé{a:|e}. Toute la famille se retrouve au cimetière. Tu remarques que le cercueil a des petits trous d'aération, et qu'il éternue de temps en temps.",
        "Triste nouvelle : {a.rel} nous a quittés. Le notaire convoque tout le monde « juste après l'enterrement, c'est important ». Le cercueil vient de tousser.",
      ],
      en: [
        "Funeral notice: {a.first} died “peacefully, {w:time}.” Burial on Saturday. Oddly, the notice adds: “Please come, I'm counting.”",
        "You're told {a.first} has passed away. Ceremony tomorrow {w:weather}. Strange detail: the casket is closed, and there's an eye-sized hole in the lid.",
        "{a.first} has died. The whole family gathers at the cemetery. You notice the casket has little air holes, and sneezes now and then.",
        "Sad news: {a.first} has left us. The lawyer is summoning everyone “right after the burial, it's important.” The casket just coughed.",
      ],
    },
    choices: [
      {
        label: { fr: 'Éloge sincère', en: 'Heartfelt eulogy' },
        out: [
          { w: 2, text: { fr: ["J'ai fait un éloge sincère, la voix brisée. J'ai parlé de nos dimanches et de sa tarte. Le cercueil a reniflé. Fort.", "Mon discours était magnifique. Toute l'assemblée pleurait. Une voix dans le cercueil a dit « oh, c'est trop gentil ». Silence total."], en: ["I gave a heartfelt eulogy, voice cracking. I talked about our Sundays and {a:his|her} pie. The casket sniffled. Loudly.", "My speech was beautiful. Everyone was crying. A voice inside the casket said “oh, that's so sweet.” Total silence."] }, fx: { rel: 10, karma: 4, chain: 'f2_gp_fake_death_reveal' }, mood: 'cry' },
          { w: 1, text: { fr: ["J'ai fait mon éloge. Au milieu, le couvercle s'est soulevé de deux centimètres, un œil m'a fixé{|e}, puis s'est refermé. J'ai fini mon discours en tremblant.", "J'ai parlé avec émotion. Puis j'ai entendu un « pfff » dans le cercueil au moment où je mentionnais sa cuisine. Vexé{a:|e}, même mort{a:|e}."], en: ["I gave my eulogy. Halfway through, the lid rose an inch, an eye stared at me, then it closed again. I finished my speech shaking.", "I spoke with emotion. Then I heard a “pfff” from the casket when I mentioned {a:his|her} cooking. Offended, even dead."] }, fx: { rel: 6, stress: 4, chain: 'f2_gp_fake_death_reveal' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Parler héritage', en: 'Ask about the will' },
        out: [
          { w: 1, text: { fr: ["Au cimetière, j'ai demandé à voix haute qui récupérait la maison. Le cercueil a vibré de colère. Ça s'annonce mal pour moi.", "J'ai demandé au notaire combien il y avait sur le compte. Un « ESPÈCE DE VAUTOUR » a retenti depuis le cercueil. J'ai blêmi."], en: ["At the cemetery I asked out loud who gets the house. The casket shook with rage. This is going badly for me.", "I asked the lawyer how much was in the account. A “YOU VULTURE” boomed from the casket. I went pale."] }, fx: { rel: -15, karma: -5, chain: 'f2_gp_fake_death_reveal' }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai demandé discrètement pour l'héritage. Ma cousine a fait pareil, mais pas discrètement. Le cercueil a craché « TOI, TU N'AURAS RIEN » en direction de ma cousine. Ouf.", "J'ai murmuré une question sur le testament. Personne n'a entendu, sauf le cercueil, qui a toussé de manière très accusatrice."], en: ["I discreetly asked about the inheritance. My cousin did too, but not discreetly. The casket spat “YOU GET NOTHING” in my cousin's direction. Phew.", "I whispered a question about the will. Nobody heard except the casket, which coughed very accusingly."] }, fx: { rel: -4, chain: 'f2_gp_fake_death_reveal' } },
        ],
      },
      {
        label: { fr: 'Ouvrir le cercueil', en: 'Open the casket' },
        out: [
          { w: 1, text: { fr: ["J'ai ouvert le cercueil. {a.first} était dedans, bien vivant{a:|e}, avec une lampe frontale, des mots croisés et un sandwich. « Tu as gâché la surprise. »", "J'ai soulevé le couvercle. {a.first} m'a fait « chut » et m'a tendu un bonbon. J'ai refermé. Je suis complice maintenant."], en: ["I opened the casket. {a.first} was inside, very much alive, with a headlamp, crosswords and a sandwich. “You ruined the surprise.”", "I lifted the lid. {a.first} went “shh” and handed me a candy. I closed it. I'm an accomplice now."] }, fx: { happy: 6, rel: 4, chain: 'f2_gp_fake_death_reveal' }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai ouvert le cercueil d'un coup. {a.first} a eu tellement peur qu'{a:il|elle} a fait un vrai malaise. Les pompes funèbres ont dit : « Bon, au moins on est sur place. » {a:Il|Elle} s'en est remis{a:|e}. De justesse.", "J'ai arraché le couvercle. {a.first} a sursauté, s'est cogné le front et a saigné du nez sur le capitonnage en satin. Ça faisait très film d'horreur."], en: ["I flung the casket open. {a.first} got such a fright {a:he|she} had an actual fainting spell. The undertakers said: “Well, at least we're already here.” {a:He|She} pulled through. Barely.", "I ripped off the lid. {a.first} jumped, hit {a:his|her} forehead and bled from the nose all over the satin lining. Very horror movie."] }, fx: { rel: -4, stress: 6, visual: 'gore', chain: 'f2_gp_fake_death_reveal' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_gp_fake_death_reveal',
    icon: '🧟',
    cat: 'family',
    rating: 2,
    actor: 'grandparent',
    chainOnly: true,
    scene: { place: 'cemetery', mood: 'shock', prop: 'coffin', fx: 'ghost' },
    text: {
      fr: [
        "{a.rel} sort du cercueil devant toute la famille, bras levés : « SURPRISE ! Je voulais savoir qui viendrait. » Ta tante s'évanouit dans la fosse. {a.first} sort un carnet : « Bon. J'ai pris des notes. »",
        "Le couvercle s'ouvre en grinçant. {a.first} se redresse, recoiffe sa mèche et annonce : « J'ai entendu TOUT ce que vous avez dit. Le testament va changer. » Un cousin fuit en courant.",
        "{a.first} jaillit du cercueil comme un diable de sa boîte. Le curé fait un signe de croix, l'enfant de chœur lâche l'encensoir, et quelqu'un crie « {w:swear} »",
        "« Je suis vivant{a:|e}, bande de vautours ! » {a.first} enjambe le cercueil et pointe chaque membre de la famille du doigt, en lisant une liste qu'{a:il|elle} a écrite pendant la cérémonie.",
      ],
      en: [
        "{a.first} climbs out of the casket in front of the whole family, arms up: “SURPRISE! I wanted to see who'd show up.” Your aunt faints into the grave. {a.first} pulls out a notebook: “Right. I took notes.”",
        "The lid creaks open. {a.first} sits up, fixes {a:his|her} hair and announces: “I heard EVERYTHING you said. The will is changing.” A cousin runs away.",
        "{a.first} bursts out of the casket like a jack-in-the-box. The priest crosses himself, the altar boy drops the censer, and someone yells “{w:swear}”",
        "“I'm alive, you vultures!” {a.first} climbs out of the casket and points at each family member, reading from a list {a:he|she} wrote during the ceremony.",
      ],
    },
    choices: [
      {
        label: { fr: 'Applaudir', en: 'Applaud' },
        out: [
          { w: 2, text: { fr: ["J'ai applaudi. Puis tout le monde a applaudi. {a.first} a salué comme au théâtre. On a fini au restaurant avec le buffet prévu pour la veillée. Meilleur enterrement de ma vie.", "J'ai lancé une standing ovation. {a.first} m'a désigné{|e} « seul héritier valable ». Le reste de la famille me déteste. Ça me va."], en: ["I applauded. Then everyone applauded. {a.first} bowed like at the theater. We ended up eating the wake buffet at a restaurant. Best funeral of my life.", "I started a standing ovation. {a.first} named me “the only worthy heir.” The rest of the family hates me. Fine by me."] }, fx: { rel: 12, happy: 8 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai applaudi, seul{|e}. Le reste de la famille était trop occupé à repêcher ma tante dans la fosse. Elle s'est cassé le coccyx. {a.first} était ravi{a:|e} : « Elle m'a toujours énervé{a:|e}. »", "Mes applaudissements ont été couverts par les sirènes : quelqu'un avait appelé le SAMU pour ma tante. Le SAMU a cru que c'était {a.first} le malade. Quiproquo de deux heures."], en: ["I applauded, alone. The rest of the family was busy fishing my aunt out of the grave. She broke her tailbone. {a.first} was delighted: “She always annoyed me.”", "My applause was drowned out by sirens: someone had called an ambulance for my aunt. The paramedics thought {a.first} was the patient. Two-hour mix-up."] }, fx: { rel: 6, happy: 4 } },
        ],
      },
      {
        label: { fr: 'Hurler de colère', en: 'Scream in anger' },
        out: [
          { w: 1, text: { fr: ["J'ai hurlé que c'était la blague la plus cruelle de l'univers. {a.first} a haussé les épaules : « À mon âge, il faut tester son public. » On ne s'est pas parlé pendant un mois.", "J'ai explosé : « J'ai pris un jour de congé ! » {a.first} m'a remboursé le jour avec un billet de 20 € de 2002."], en: ["I screamed that it was the cruelest joke in the universe. {a.first} shrugged: “At my age you have to test your audience.” We didn't speak for a month.", "I exploded: “I took a day off work!” {a.first} reimbursed me with a $20 bill from 2002."] }, fx: { rel: -10, stress: -2, money: 20 }, mood: 'angry' },
          { w: 1, text: { fr: ["J'ai crié si fort qu'{a.my} s'est rallongé{a:|e} dans le cercueil et a refermé le couvercle. « Réveillez-moi quand vous serez calmes. » Le croque-mort a commencé à visser.", "J'ai hurlé. {a.first} m'a pointé{|e} du doigt et a lu sa liste : « Toi, tu as regardé ton téléphone pendant l'éloge. » Touché. J'ai perdu."], en: ["I yelled so loudly that {a.my} lay back down in the casket and closed the lid. “Wake me when you've all calmed down.” The undertaker started screwing it shut.", "I screamed. {a.first} pointed at me and read from the list: “You looked at your phone during the eulogy.” Busted. I lost."] }, fx: { rel: -6, happy: -3 } },
        ],
      },
      {
        label: { fr: 'Filmer la résurrection', en: 'Film the resurrection' },
        out: [
          { w: 1, text: { fr: ["J'ai filmé. « Mon grand-parent sort de son cercueil » a fait 3 millions de vues. Une émission veut {a.my} pour un spin-off. {a:Il|Elle} exige une loge.", "La vidéo est devenue virale. {a.first} fait maintenant des conférences sur « mourir pour mieux vivre ». Payé{a:|e} 2 000 € la date."], en: ["I filmed it. “My grandparent climbs out of the casket” got 3 million views. A show wants {a.my} for a spin-off. {a:He|She} demands a dressing room.", "The video went viral. {a.first} now gives talks on “dying to live better.” Paid $2,000 a gig."] }, fx: { followers: 15000, fame: 3, rel: 6 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai filmé, mais au moment clé, j'avais mis la caméra frontale. On ne voit que ma tête qui hurle. Les commentaires se moquent de mes narines.", "J'ai filmé la scène. Le pasteur m'a confisqué le téléphone : « Un peu de respect pour les morts. » {a.first} : « Je ne suis pas mort{a:|e}. » Lui : « Pas encore. »"], en: ["I filmed it, but at the key moment I had the front camera on. You only see my face screaming. The comments mock my nostrils.", "I filmed the scene. The minister confiscated my phone: “Some respect for the dead.” {a.first}: “I'm not dead.” Him: “Not yet.”"] }, fx: { happy: -2, followers: 300 } },
        ],
      },
    ],
  },
  {
    id: 'f2_gp_wild_youth',
    icon: '🎸',
    cat: 'family',
    rating: 1,
    actor: 'grandparent',
    scene: { place: 'home', mood: 'shock', prop: 'photo' },
    when: { age: [10, 50], has: 'grandparent' },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "Dans une boîte à chaussures chez {a.rel}, tu trouves des photos de {a:lui|elle} en 1969 : crête punk, veste en cuir et {w:vehicle} volé. Au dos : « Avant la prison ».",
        "{a.first} t'avoue, entre deux tasses de thé, qu'{a:il|elle} a été {w:weird_job} pendant dix ans, puis braqueur{a:|se} de bureaux de poste. « Que des petits. »",
        "Un vieux monsieur aborde {a.first} {w:at_place} : « Tu te souviens de Woodstock ? » {a.first} rougit comme un{a:|e} ado et lui fait un signe pour qu'il se taise.",
        "Sous le lit de {a.rel}, une malle : perruques, faux passeports et un article de journal titré « Le Gang des Mamies Fantômes frappe encore ». La photo est floue, mais ce chapeau…",
      ],
      en: [
        "In a shoebox at {a.first}'s, you find photos of {a:him|her} in 1969: punk mohawk, leather jacket and a stolen {w:vehicle}. On the back: “Before prison.”",
        "Between two cups of tea, {a.first} confesses {a:he|she} was {w:weird_job} for ten years, then robbed post offices. “Only small ones.”",
        "An old man approaches {a.first} {w:at_place}: “Remember Woodstock?” {a.first} blushes like a teenager and signals him to shut up.",
        "Under {a.first}'s bed, a trunk: wigs, fake passports and a newspaper article titled “The Phantom Grannies Gang Strikes Again.” The photo is blurry, but that hat…",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout vouloir savoir', en: 'Demand the whole story' },
        out: [
          { w: 2, text: { fr: ["{a.my} m'a tout raconté, les yeux brillants. Les cavales, les concerts, la fois où {a:il|elle} a mordu un flic. Je l'admire plus que n'importe quel super-héros.", "J'ai eu droit à la version intégrale. Ça a duré toute la nuit, avec {w:drink} et des photos interdites. Je veux être comme {a.my} quand je serai vieux ou vieille."], en: ["{a.my} told me everything, eyes sparkling. The getaways, the concerts, the time {a:he|she} bit a cop. I admire {a:him|her} more than any superhero.", "I got the full version. It lasted all night, with {w:drink} and forbidden photos. I want to be like {a.my} when I'm old."] }, fx: { rel: 12, happy: 5 }, mood: 'happy' },
          { w: 1, text: { fr: ["{a.my} m'a tout raconté, puis m'a fait jurer le secret en me serrant le poignet avec une force inquiétante. « Le délai de prescription, c'est pas encore fini pour tout. »", "J'ai insisté. {a.first} m'a raconté une histoire qui se termine par « et c'est pour ça qu'on n'a jamais retrouvé le corps ». Je pense que c'était une blague."], en: ["{a.my} told me everything, then made me swear secrecy, gripping my wrist with worrying strength. “The statute of limitations isn't up on all of it.”", "I insisted. {a.first} told me a story that ended with “and that's why they never found the body.” I think it was a joke."] }, fx: { rel: 6, stress: 4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Le dire à la famille', en: 'Tell the family' },
        out: [
          { w: 1, text: { fr: ["J'ai tout balancé au repas de Noël. Mes parents ont blêmi. {a.first} a levé son verre : « À ma jeunesse ! » Tout le monde a trinqué, même mon oncle gendarme.", "J'ai révélé le passé de {a.my}. Mon père a avoué qu'il s'en doutait : « Ça explique les serrures crochetées. »"], en: ["I spilled it all at Christmas dinner. My parents went pale. {a.first} raised a glass: “To my youth!” Everyone toasted, even my cop uncle.", "I revealed {a.my}'s past. My dad admitted he suspected it: “That explains the lock-picking.”"] }, fx: { happy: 4, rel: 2 } },
          { w: 1, text: { fr: ["J'ai cafté. {a.first} m'a regardé{|e} dans les yeux et a dit : « Je me souviendrai de ça. » Depuis, je reçois des cartes d'anniversaire sans signature. Très inquiétant.", "J'ai trahi le secret. {a.first} a nié avec un aplomb de professionnel{a:|le}. Tout le monde m'a cru{|e} fou ou folle."], en: ["I snitched. {a.first} looked me in the eye and said: “I'll remember this.” Since then I get unsigned birthday cards. Very unsettling.", "I betrayed the secret. {a.first} denied it with professional composure. Everyone thought I was crazy."] }, fx: { rel: -10, stress: 3 } },
        ],
      },
      {
        label: { fr: 'Demander des leçons', en: 'Ask for lessons' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["{a.my} m'a appris à crocheter une serrure avec une épingle à cheveux, « pour les urgences ». J'ai réussi au troisième essai. {a:Il|Elle} était fier{a:|e}.", "Leçon de vie de {a.my} : comment mentir à un policier, comment danser le rock, comment repérer un tricheur au poker. Plus utile que toute ma scolarité."], en: ["{a.my} taught me to pick a lock with a hairpin, “for emergencies.” I got it on the third try. {a:He|She} was proud.", "Life lesson from {a.my}: how to lie to a cop, how to swing dance, how to spot a poker cheat. More useful than all my schooling."] }, fx: { smarts: 3, rel: 8, karma: -2 }, mood: 'proud' },
          { w: 1, text: { fr: ["{a.my} m'a donné une leçon de conduite « comme en 69 ». On a semé une voiture de police sans le vouloir. {a:Il|Elle} n'a pas perdu la main.", "J'ai demandé une leçon. {a.first} m'a fait faire le guet devant la boulangerie pendant qu'{a:il|elle} « empruntait » des croissants. J'ai 15 minutes de casier, moralement."], en: ["{a.my} gave me a driving lesson “like in '69.” We accidentally lost a police car. {a:He|She} hasn't lost the touch.", "I asked for a lesson. {a.first} made me keep lookout at the bakery while {a:he|she} “borrowed” croissants. Morally, I now have a record."] }, fx: { happy: 6, heat: 3, karma: -2 }, mood: 'party' },
        ],
      },
    ],
  },
  {
    id: 'f2_gp_moonshine',
    icon: '🥃',
    cat: 'family',
    rating: 2,
    actor: 'grandparent',
    scene: { place: 'home', mood: 'party', prop: 'bottle' },
    when: { age: [18, 55], has: 'grandparent' },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "{a.rel} sort de la cave une bouteille sans étiquette : sa gnôle maison, distillée dans la baignoire. « 72 degrés, ça réveille les morts. » Le bouchon fume légèrement.",
        "Fin de repas chez {a.first}. Arrive le « petit digestif » : un liquide jaune où flotte {w:animal}. {a:Il|Elle} te sert un verre à moutarde plein à ras bord.",
        "{a.first} t'emmène dans la grange pour te montrer son alambic, « fabriqué avec {w:object} et un peu d'audace ». {a:Il|Elle} te tend une louche : « Goûte, c'est la cuvée {age}. »",
        "{a.rel} veut trinquer « à l'ancienne ». La bouteille de prune a 40 ans, elle dégage {w:smell}, et ton oncle a perdu un sourcil la dernière fois.",
      ],
      en: [
        "{a.first} brings up an unlabeled bottle from the cellar: homemade moonshine, distilled in the bathtub. “144 proof, it wakes the dead.” The cork is lightly smoking.",
        "End of dinner at {a.first}'s. Here comes the “little digestif”: a yellow liquid with {w:animal} floating in it. {a:He|She} pours you a mustard glass filled to the brim.",
        "{a.first} takes you to the barn to show off {a:his|her} still, “built from {w:object} and a little nerve.” {a:He|She} hands you a ladle: “Taste it, it's the {age} vintage.”",
        "{a.first} wants a toast “the old-fashioned way.” The plum brandy is 40 years old, gives off {w:smell}, and your uncle lost an eyebrow last time.",
      ],
    },
    choices: [
      {
        label: { fr: 'Cul sec', en: 'Bottoms up' },
        out: [
          { w: 1, odds: { health: 1 }, text: { fr: ["Cul sec. J'ai vu Dieu, il m'a fait un clin d'œil. {a.first} a hurlé de joie : « Enfin un vrai ! » Je me suis réveillé{|e} dans la brouette.", "J'ai bu d'un trait. Mes yeux ont pleuré du feu, j'ai parlé allemand pendant une heure et dansé avec {a.my} sur la table. Légendaire."], en: ["Bottoms up. I saw God, he winked at me. {a.first} whooped: “Finally, a real one!” I woke up in the wheelbarrow.", "I downed it. My eyes cried fire, I spoke German for an hour and danced on the table with {a.my}. Legendary."] }, fx: { rel: 10, happy: 6, health: -3, addiction: ['alcohol', 5] }, mood: 'party' },
          { w: 1, text: { fr: ["Cul sec. J'ai vomi un geyser jaune sur le chien, qui est parti en courant et n'est jamais revenu. {a.first} a dit : « C'est normal, la première fois. »", "J'ai avalé. Mon œsophage a fondu, j'ai rendu mon repas en trois jets dans le jardin, dont un sur les tomates. {a.first} dit que c'est de l'engrais."], en: ["Bottoms up. I sprayed a yellow geyser on the dog, which ran away and never came back. {a.first} said: “That's normal, the first time.”", "I swallowed. My esophagus melted, I brought my dinner back up in three jets in the garden, one on the tomatoes. {a.first} says it's fertilizer."] }, fx: { health: -8, happy: -3, rel: 4, visual: 'poop' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Faire semblant', en: 'Fake the sip' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai vidé discrètement mon verre dans la plante verte. Elle est morte dans la nuit. {a.first} croit que je tiens l'alcool comme un docker.", "J'ai fait semblant de boire et versé la gnôle dans mes chaussettes. Mes pieds sont désinfectés pour dix ans."], en: ["I discreetly emptied my glass into the houseplant. It died overnight. {a.first} thinks I hold my liquor like a dockworker.", "I faked the sip and poured the moonshine into my socks. My feet are disinfected for the next decade."] }, fx: { rel: 6, happy: 3 } },
          { w: 1, text: { fr: ["{a.my} m'a vu{|e} verser mon verre dans le pot de fleurs. Regard glacial. {a:Il|Elle} m'a resservi un double « pour la peine ». Pas d'échappatoire.", "Grillé{|e}. {a.first} m'a forcé{|e} à boire le verre ET celui de mon cousin. Je me suis réveillé{|e} avec un tatouage de tracteur au henné."], en: ["{a.my} saw me pour my glass into the flowerpot. Icy stare. {a:He|She} poured me a double “as punishment.” No escape.", "Busted. {a.first} made me drink my glass AND my cousin's. I woke up with a henna tractor tattoo."] }, fx: { health: -4, rel: -3, happy: -2 } },
        ],
      },
      {
        label: { fr: 'Racheter la recette', en: 'Buy the recipe' },
        out: [
          { w: 1, text: { fr: ["J'ai racheté la recette contre une promesse d'héritage. J'ai lancé « La Gnôle de {a.first} » en bouteilles artisanales. Les hipsters adorent. Un client est devenu aveugle d'un œil, mais il revient.", "J'ai commercialisé la gnôle familiale. Succès local fou, {w:at_place} on se l'arrache. {a.first} touche 10 % et se croit milliardaire."], en: ["I bought the recipe for a promise of inheritance. I launched “{a.first}'s Moonshine” in craft bottles. Hipsters love it. One customer went blind in one eye, but he keeps coming back.", "I marketed the family moonshine. Huge local hit, people fight over it {w:at_place}. {a.first} gets 10% and thinks {a:he|she}'s a billionaire."] }, fx: { money: 2000, rel: 8, heat: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai tenté de distiller moi-même. Mon alambic a explosé et soufflé la porte du garage. J'ai perdu mes sourcils et une partie de ma frange. {a.first} était plié{a:|e} de rire.", "Ma première distillation a fini en boule de feu. Les pompiers ont dit que ça sentait « la prune et l'erreur humaine »."], en: ["I tried distilling myself. My still exploded and blew off the garage door. I lost my eyebrows and part of my bangs. {a.first} was doubled over laughing.", "My first batch ended in a fireball. The firefighters said it smelled of “plums and human error.”"] }, fx: { health: -6, looks: -4, money: -600, visual: 'explosion' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_gp_will_promise',
    icon: '🏡',
    cat: 'family',
    rating: 1,
    actor: 'grandparent',
    scene: { place: 'home', mood: 'neutral', prop: 'teacup' },
    when: { age: [15, 55], has: 'grandparent' },
    weight: 5,
    cooldown: 7,
    text: {
      fr: [
        "{a.rel} te prend la main : « La maison, ce sera pour toi. Ne le dis à personne. » Ton cousin t'avoue le lendemain qu'{a:il|elle} lui a dit exactement la même chose. Et à la voisine. Et au facteur.",
        "{a.first} t'emmène au grenier et pointe {w:object} : « Ça vaut une fortune. Ce sera à toi quand je serai parti{a:|e}. » Une étiquette en dessous indique « 3 € – vide-grenier 1997 ».",
        "{a.first} a pris l'habitude de menacer tout le monde : « Attention, je peux encore changer mon testament. » Hier, {a:il|elle} a déshérité un petit-fils parce qu'il a ri devant {w:show}.",
        "{a.rel} organise une « réunion testament » chaque Noël et redistribue ses biens selon qui a apporté le meilleur cadeau. Tu as apporté {w:gift}. Mauvais calcul.",
      ],
      en: [
        "{a.first} takes your hand: “The house will be yours. Don't tell anyone.” The next day your cousin admits {a:he|she} told him the exact same thing. And the neighbor. And the mailman.",
        "{a.first} takes you to the attic and points at {w:object}: “That's worth a fortune. It'll be yours when I'm gone.” A sticker underneath reads “$3 – yard sale 1997.”",
        "{a.first} has taken to threatening everyone: “Careful, I can still change my will.” Yesterday {a:he|she} disinherited a grandson for laughing during {w:show}.",
        "{a.first} holds a “will meeting” every Christmas and reallocates everything according to who brought the best present. You brought {w:gift}. Bad move.",
      ],
    },
    choices: [
      {
        label: { fr: 'Devenir le chouchou', en: 'Become the favorite' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: ["J'ai multiplié les visites, les fleurs et les compliments. {a.first} m'a officiellement désigné{|e} héritier ou héritière. Les cousins me surnomment « la sangsue ».", "Opération chouchou réussie. {a.first} parle de moi à tout le monde, et a modifié le testament devant moi. Cousins furieux."], en: ["I stepped up the visits, flowers and compliments. {a.first} officially named me heir. The cousins call me “the leech.”", "Favorite operation successful. {a.first} talks about me to everyone and changed the will in front of me. Furious cousins."] }, fx: { rel: 12, karma: -3 } },
          { w: 1, text: { fr: ["J'ai joué au petit-enfant parfait. {a.first} a tout vu venir : « Tu crois que je suis né{a:|e} de la dernière pluie ? » Désormais déshérité{|e}, par principe.", "Mon numéro de charme était trop gros. {a.first} a légué la maison au chat. Le chat ne me regarde même pas."], en: ["I played the perfect grandchild. {a.first} saw right through it: “You think I was born yesterday?” Now disinherited, on principle.", "My charm offensive was too obvious. {a.first} left the house to the cat. The cat won't even look at me."] }, fx: { rel: -6, happy: -3 } },
        ],
      },
      {
        label: { fr: 'S\'en ficher', en: 'Not care at all' },
        out: [
          { w: 2, text: { fr: ["Je m'en fiche, je viens pour les crêpes. {a.first} a trouvé ça tellement rafraîchissant qu'{a:il|elle} m'a mis{|e} en haut de la liste. Ironie.", "J'ai dit que je préférais qu'{a:il|elle} vive le plus longtemps possible. {a.first} a pleuré et m'a donné sa montre sur le champ."], en: ["I don't care, I come for the crêpes. {a.first} found that so refreshing {a:he|she} put me at the top of the list. Irony.", "I said I'd rather {a:he|she} live as long as possible. {a.first} cried and gave me {a:his|her} watch on the spot."] }, fx: { rel: 10, karma: 5, happy: 3 }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai dit que l'héritage ne m'intéressait pas. {a.first} m'a pris{|e} au mot. Le testament mentionne mon nom une seule fois : « pour sa franchise, un tire-bouchon ».", "Je m'en fiche, et je l'ai dit. {a.first} m'a légué {w:object}. Seulement {w:object}."], en: ["I said the inheritance didn't interest me. {a.first} took me at my word. The will mentions me once: “for {a:his|her} honesty, a corkscrew.”", "I don't care, and I said so. {a.first} left me {w:object}. Just that."] }, fx: { happy: -1, karma: 2 } },
        ],
      },
      {
        label: { fr: 'Dénoncer l\'arnaque', en: 'Expose the scam' },
        out: [
          { w: 1, text: { fr: ["J'ai réuni tous les cousins : {a.my} avait promis la maison à onze personnes. On a ri. Puis on a créé un groupe WhatsApp « Les Héritiers de Rien ».", "J'ai organisé une confrontation familiale. {a.first} a avoué en riant : « Comme ça, vous venez tous me voir. » Génie maléfique."], en: ["I gathered all the cousins: {a.my} had promised the house to eleven people. We laughed. Then we made a group chat called “Heirs of Nothing.”", "I organized a family confrontation. {a.first} admitted, laughing: “That way, you all come to visit.” Evil genius."] }, fx: { happy: 4, rel: 2 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai dénoncé le stratagème. {a.first} a convoqué le notaire le jour même et tout légué. Bénéficiaire : {w:celeb}. Le fan-club a déjà envoyé une carte de remerciement.", "J'ai voulu jouer les justiciers. {a.first} m'a fait asseoir et a dit : « Tu n'as rien compris à la vie. » Puis m'a servi une tarte. J'ai rien compris, effectivement."], en: ["I exposed the scheme. {a.first} called the lawyer that day and left everything to {w:celeb}. The fan club already sent a thank-you card.", "I tried to play the hero. {a.first} sat me down and said: “You understand nothing about life.” Then served me pie. I indeed understood nothing."] }, fx: { rel: -8, happy: -2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_gp_driving',
    icon: '🚗',
    cat: 'family',
    rating: 1,
    actor: 'grandparent',
    scene: { place: 'park', mood: 'shock', prop: 'car' },
    when: { age: [6, 16], has: 'grandparent' },
    weight: 6,
    cooldown: 4,
    text: {
      fr: [
        "{a.rel} t'emmène à l'école en voiture. {a:Il|Elle} conduit au milieu de la route, insulte les cyclistes et vient de traverser un rond-point. Par le milieu. Sur la pelouse.",
        "Mercredi avec {a.first}. Sur l'autoroute, {a:il|elle} roule à 40 km/h, clignotant gauche allumé depuis Lyon, en écoutant {w:song} à fond. Un camion klaxonne. {a.first} lui fait un doigt.",
        "{a.first} t'emmène {w:to_place} dans sa vieille voiture qui sent {w:smell}. Les freins font {w:sound}. {a:Il|Elle} te dit de ne pas t'inquiéter, « ils font ça depuis 1994 ».",
        "{a.rel} se gare. Enfin, {a:il|elle} s'arrête. En travers de trois places handicapées, le pare-chocs dans un buisson. « Parfait. » Tu as peur de mourir, et aussi faim.",
      ],
      en: [
        "{a.first} drives you to school. {a:He|She} drives down the middle of the road, insults cyclists and just went through a roundabout. Through the middle. Over the grass.",
        "Wednesday with {a.first}. On the highway {a:he|she} drives 25 mph, left blinker on for the last 50 miles, blasting {w:song}. A truck honks. {a.first} flips it off.",
        "{a.first} takes you {w:to_place} in an old car that smells like {w:smell}. The brakes make {w:sound}. {a:He|She} says not to worry, “they've been doing that since 1994.”",
        "{a.first} parks. Well, stops. Across three disabled spots, bumper in a bush. “Perfect.” You're scared to die, and also hungry.",
      ],
    },
    choices: [
      {
        label: { fr: 'S\'accrocher et prier', en: 'Hold on and pray' },
        out: [
          { w: 2, text: { fr: ["Je me suis accroché{|e} à la poignée jusqu'à en avoir des crampes. On est arrivés. Vivants. {a.first} m'a acheté une glace pour fêter ça. Je crois qu'{a:il|elle} avait eu peur aussi.", "J'ai prié tous les saints que je connais. Ça a marché. Je suis arrivé{|e} à l'école en avance, en sueur, plus croyant{|e} qu'un pape."], en: ["I gripped the handle until my hand cramped. We arrived. Alive. {a.first} bought me ice cream to celebrate. I think {a:he|she} was scared too.", "I prayed to every saint I know. It worked. I got to school early, sweaty, more devout than the pope."] }, fx: { stress: 4, rel: 4 } },
          { w: 1, text: { fr: ["On a fini dans le fossé, doucement, comme une feuille morte. {a.first} a sorti un thermos de chocolat chaud en attendant la dépanneuse. Meilleure matinée de l'année.", "On a embouti le portail de l'école. Personne n'est blessé, mais le directeur a fait une crise cardiaque. Légère."], en: ["We ended up in a ditch, gently, like a falling leaf. {a.first} pulled out a thermos of hot chocolate while we waited for the tow truck. Best morning of the year.", "We rammed the school gate. Nobody hurt, but the principal had a heart attack. A mild one."] }, fx: { health: -2, happy: 3, rel: 2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Jouer au copilote', en: 'Play co-pilot' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai guidé {a.my} comme un pilote de rallye : « Freine ! Gauche ! Le stop, LE STOP ! » On est arrivés sans incident. On fait équipe maintenant.", "J'ai annoncé chaque panneau et chaque piéton. {a.first} m'a appelé{|e} « mon GPS d'amour ». Zéro accident ce mois-ci."], en: ["I guided {a.my} like a rally co-driver: “Brake! Left! Stop sign!” We arrived without incident. We're a team now.", "I called out every sign and every pedestrian. {a.first} calls me “my lovely GPS.” Zero accidents this month."] }, fx: { rel: 8, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai voulu aider. {a.first} a mal pris mes conseils et accéléré « pour me montrer ». Flash du radar. La photo est encadrée dans son salon.", "« Je conduis depuis 1958, je n'ai pas besoin d'un morveux pour me guider. » Puis {a:il|elle} est rentré{a:|e} dans un poteau. En silence."], en: ["I tried to help. {a.first} took offense and sped up “to show me.” Speed camera flash. The photo is framed in {a:his|her} living room.", "“I've been driving since 1958, I don't need a snotty kid to guide me.” Then {a:he|she} hit a pole. In silence."] }, fx: { rel: -3, stress: 4 } },
        ],
      },
      {
        label: { fr: 'Tout raconter aux parents', en: 'Tell my parents' },
        out: [
          { w: 1, text: { fr: ["J'ai tout raconté à mes parents. Ils ont confisqué les clés de {a.my}. {a:Il|Elle} me boude, mais j'ai sans doute sauvé une dizaine de cyclistes.", "J'ai cafté. Mes parents ont organisé une « réunion voiture ». {a.first} a cédé, puis a acheté un vélo électrique. Les cyclistes ont désormais un nouvel ennemi : {a:lui|elle}."], en: ["I told my parents everything. They confiscated {a.my}'s keys. {a:He|She} is sulking, but I probably saved a dozen cyclists.", "I snitched. My parents held a “car meeting.” {a.first} gave in, then bought an e-bike. Cyclists now have a new enemy: {a:him|her}."] }, fx: { rel: -6, karma: 3 } },
          { w: 1, text: { fr: ["Mes parents ne m'ont pas cru{|e} : « {a.first} conduit très bien. » Puis ils sont montés avec {a:lui|elle}. Ils sont revenus pâles et silencieux.", "J'ai prévenu mes parents, qui ont ri. Le lendemain, la voiture de {a.my} était dans la vitrine de la boulangerie. Ils ne rient plus."], en: ["My parents didn't believe me: “{a.first} drives just fine.” Then they rode with {a:him|her}. They came back pale and silent.", "I warned my parents, who laughed. The next day, {a.my}'s car was in the bakery window. They're not laughing anymore."] }, fx: { happy: 3, smarts: 1 } },
        ],
      },
    ],
  },
  // ───────────────────────────── siblings ─────────────────────────────
  {
    id: 'f2_sib_blame',
    icon: '🏺',
    cat: 'family',
    rating: 0,
    actor: 'sibling',
    scene: { place: 'home', mood: 'angry', prop: 'vase' },
    when: { age: [5, 12], has: 'sibling' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "{a.rel} vient de casser {w:object} en jouant au ballon dans le salon. Avant même que le bruit s'arrête, {a:il|elle} pointe le doigt vers toi en criant : « C'EST PAS MOI ! »",
        "Il y a du feutre indélébile sur le canapé. {a.first} a les mains pleines de feutre. {a:Il|Elle} te regarde, puis regarde tes parents : « C'est {first}. Je l'ai vu{|e}. »",
        "Le poisson rouge flotte. {a.first} tient la boîte de nourriture vide. Tes parents arrivent. {a.first} éclate en sanglots et te désigne. Une performance qui mériterait un rôle dans {w:movie}.",
        "Quelqu'un a mangé tout le gâteau d'anniversaire de papa. {a.first} a du chocolat jusqu'aux oreilles et un alibi en béton : « J'étais avec {first}. »",
      ],
      en: [
        "{a.first} just broke {w:object} playing ball in the living room. Before the noise even stops, {a:he|she} points at you, screaming: “IT WASN'T ME!”",
        "There's permanent marker on the couch. {a.first}'s hands are covered in marker. {a:He|She} looks at you, then at your parents: “It was {first}. I saw it.”",
        "The goldfish is floating. {a.first} is holding the empty food box. Your parents walk in. {a.first} bursts into tears and points at you. A performance worthy of {w:movie}.",
        "Someone ate all of dad's birthday cake. {a.first} has chocolate up to the ears and an ironclad alibi: “I was with {first}.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Protester', en: 'Protest' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai plaidé ma cause comme un avocat : les mains de {a.my} étaient la preuve. Verdict : {a:il|elle} est privé{a:|e} de dessert. Justice.", "J'ai démonté son alibi point par point. Mes parents ont applaudi. {a.first} a été condamné{a:|e} à vider le lave-vaisselle pendant un mois."], en: ["I pleaded my case like a lawyer: {a.my}'s hands were the evidence. Verdict: no dessert for {a:him|her}. Justice.", "I dismantled the alibi point by point. My parents applauded. {a.first} was sentenced to a month of unloading the dishwasher."] }, fx: { happy: 5, rel: -4 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai protesté. {a.first} a pleuré plus fort. Les larmes ont gagné. Je suis puni{|e} pour un crime que je n'ai pas commis. Je m'en souviendrai jusqu'à ma mort.", "Personne ne m'a cru{|e}. {a.first} m'a fait un petit sourire derrière le dos de mes parents. La guerre est déclarée."], en: ["I protested. {a.first} cried harder. The tears won. I'm punished for a crime I didn't commit. I'll remember this until I die.", "Nobody believed me. {a.first} gave me a little smile behind our parents' backs. War is declared."] }, fx: { happy: -5, rel: -6 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Couvrir {a.first}', en: 'Cover for them' },
        out: [
          { w: 2, text: { fr: ["J'ai pris la faute sur moi. {a.first} me doit une faveur à vie. Je l'ai noté dans mon carnet secret.", "J'ai dit que c'était moi. Puni{|e}, mais {a.my} m'a donné ses bonbons pendant une semaine. Excellente affaire."], en: ["I took the blame. {a.first} owes me a lifelong favor. I wrote it in my secret notebook.", "I said it was me. Grounded, but {a.my} gave me {a:his|her} candy for a week. Excellent deal."] }, fx: { rel: 10, karma: 4, happy: -1 } },
          { w: 1, text: { fr: ["J'ai couvert {a.my}. Le lendemain, {a:il|elle} a recommencé et m'a encore accusé{|e}. Leçon apprise : ne jamais négocier avec les terroristes.", "J'ai assumé à sa place. Mes parents m'ont puni{|e} deux fois plus parce que « tu es censé{|e} montrer l'exemple »."], en: ["I covered for {a.my}. The next day {a:he|she} did it again and blamed me again. Lesson learned: never negotiate with terrorists.", "I took the fall. My parents punished me twice as hard because “you're supposed to set the example.”"] }, fx: { happy: -4, rel: 2 } },
        ],
      },
      {
        label: { fr: 'Accuser le chien', en: 'Blame the dog' },
        out: [
          { w: 1, text: { fr: ["On a accusé le chien ensemble, {a.my} et moi. Alliance historique. Le chien a été privé de croquettes. Il nous regarde avec mépris.", "Le chien a été désigné coupable. {a.first} et moi avons fait un pacte secret. Le chien sait. Le chien se souviendra."], en: ["We blamed the dog together, {a.my} and me. Historic alliance. The dog lost its treats. It looks at us with contempt.", "The dog was found guilty. {a.first} and I made a secret pact. The dog knows. The dog will remember."] }, fx: { rel: 8, happy: 3, karma: -2 } },
          { w: 1, text: { fr: ["J'ai accusé le chien. On n'a pas de chien. Mes parents m'ont regardé{|e} longuement, puis ont pris rendez-vous chez un psy pour enfants.", "« C'est le chien. » Le chien était chez mamie depuis une semaine. Échec cuisant."], en: ["I blamed the dog. We don't have a dog. My parents stared at me for a long time, then booked a child psychologist.", "“It was the dog.” The dog had been at grandma's for a week. Spectacular failure."] }, fx: { happy: -3, smarts: -1 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_sib_clothes',
    icon: '👕',
    cat: 'family',
    rating: 0,
    actor: 'sibling',
    scene: { place: 'home', mood: 'angry', prop: 'closet' },
    when: { age: [12, 22], has: 'sibling' },
    weight: 7,
    cooldown: 3,
    text: {
      fr: [
        "Ton t-shirt préféré a disparu. Tu le retrouves sur une photo {w:app} de {a.rel}, prise {w:at_place}. Il y a une tache dessus. Origine probable : {w:food}.",
        "{a.first} est sorti{a:|e} ce soir avec ta veste, tes chaussures et ton parfum. Tu le sais parce que tu as dû sortir avec ses vieilles affaires qui sentent {w:smell}.",
        "Ton pull tout neuf est dans le panier à linge, déformé, troué, et sentant la cigarette. {a.first} jure qu'il « était déjà comme ça ». {a:Il|Elle} le porte encore.",
        "Tu cherches ton jean depuis trois jours. {a.first} entre dans la cuisine en le portant, avec un naturel désarmant, et te demande si tu as vu son chargeur. Qui est aussi le tien.",
      ],
      en: [
        "Your favorite T-shirt is missing. You find it in {a.first}'s {w:app} photo, taken {w:at_place}. There's a stain on it. Likely source: {w:food}.",
        "{a.first} went out tonight in your jacket, your shoes and your perfume. You know because you had to go out in {a:his|her} old stuff that smells like {w:smell}.",
        "Your brand-new sweater is in the laundry basket, stretched, holey and smelling of cigarettes. {a.first} swears it “was already like that.” {a:He|She} is still wearing it.",
        "You've been looking for your jeans for three days. {a.first} walks into the kitchen wearing them, completely casual, and asks if you've seen {a:his|her} charger. Which is also yours.",
      ],
    },
    choices: [
      {
        label: { fr: 'Représailles', en: 'Retaliate' },
        out: [
          { w: 1, text: { fr: ["J'ai pris ses affaires préférées et je les ai portées à l'école. Pour une fois, on était à égalité. On a même rigolé.", "J'ai mis son t-shirt fétiche dans une machine à 90 °C. Il fait maintenant la taille d'un hamster. Vengeance accomplie."], en: ["I took {a:his|her} favorite stuff and wore it to school. For once, we were even. We even laughed about it.", "I washed {a:his|her} lucky T-shirt at 190°F. It's now hamster-sized. Vengeance achieved."] }, fx: { happy: 4, rel: -3 } },
          { w: 1, text: { fr: ["Représailles ratées : j'ai pris sa veste, mais {a.my} l'avait déjà « empruntée » à un ami qui me l'a reprise devant tout le monde.", "Ma vengeance a dégénéré en bataille de vêtements dans le couloir. Les parents ont confisqué toute la garde-robe. On porte des pyjamas pour aller en cours."], en: ["Revenge failed: I took {a:his|her} jacket, but {a.my} had already “borrowed” it from a friend who took it back from me in front of everyone.", "My revenge escalated into a clothes battle in the hallway. Our parents confiscated the entire wardrobe. We wear pajamas to school."] }, fx: { happy: -3, rel: -4 } },
        ],
      },
      {
        label: { fr: 'Cadenas sur l\'armoire', en: 'Padlock the closet' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai posé un cadenas. Mes affaires sont en sécurité. {a.first} a essayé de le crocheter avec une fourchette pendant deux heures. Divertissant.", "Cadenas installé. {a.first} a dû porter ses propres vêtements pendant un mois. Ça lui a fait du bien, je crois."], en: ["I installed a padlock. My stuff is safe. {a.first} spent two hours trying to pick it with a fork. Entertaining.", "Padlock installed. {a.first} had to wear {a:his|her} own clothes for a month. It was good for {a:him|her}, I think."] }, fx: { happy: 3, discipline: 2 } },
          { w: 1, text: { fr: ["{a.my} a démonté les gonds de l'armoire. Le cadenas est intact. L'armoire est vide. Respect.", "J'ai perdu la clé du cadenas. Mes vêtements sont prisonniers. {a.first} me prête les siens, avec un sourire satisfait."], en: ["{a.my} took the closet door off its hinges. The padlock is intact. The closet is empty. Respect.", "I lost the padlock key. My clothes are hostages. {a.first} lends me {a:his|hers}, with a satisfied smile."] }, fx: { happy: -3 } },
        ],
      },
      {
        label: { fr: 'Proposer un échange', en: 'Propose a swap deal' },
        out: [
          { w: 2, text: { fr: ["On a signé un contrat d'échange de vêtements, avec clauses et pénalités. Notre garde-robe a doublé. Business familial.", "Accord trouvé : on partage tout, sauf les sous-vêtements. Paix durable, style doublé."], en: ["We signed a clothes-swap contract, with clauses and penalties. Our wardrobes doubled. Family business.", "Deal reached: we share everything except underwear. Lasting peace, double the style."] }, fx: { rel: 8, happy: 4, looks: 2 }, mood: 'happy' },
          { w: 1, text: { fr: ["L'échange a duré une semaine. Puis {a.my} a « perdu » ma veste en cuir {w:at_place}. Le contrat est caduc.", "On a échangé. {a.first} a rendu mes fringues avec des taches non identifiées. J'ai préféré ne pas demander."], en: ["The swap lasted a week. Then {a.my} “lost” my leather jacket {w:at_place}. The contract is void.", "We swapped. {a.first} returned my clothes with unidentified stains. I chose not to ask."] }, fx: { rel: -4, happy: -2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_sib_favorite',
    icon: '🏆',
    cat: 'family',
    rating: 1,
    actor: 'sibling',
    scene: { place: 'home', mood: 'sad', prop: 'trophy' },
    when: { age: [18, 55], has: ['sibling', 'parent'] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "Chez tes parents, le mur du salon est couvert de photos de {a.rel} : diplômes, mariage, {w:animal} adopté. Toi, tu as une photo. Floue. De dos. À 4 ans.",
        "Au repas de famille, tes parents passent vingt minutes à vanter la promotion de {a.first}. Quand tu annonces la tienne, on te répond : « C'est bien. Tu peux passer le sel ? »",
        "{a.first} reçoit {w:gift} pour son anniversaire. Toi, pour le tien, tu as reçu une carte avec le prénom de {a.first} barré et le tien écrit au-dessus.",
        "Tes parents ont fait graver une plaque « À notre fierté » pour {a.rel}. Tu as découvert qu'ils ont aussi un groupe WhatsApp à trois, sans toi, qui s'appelle « Les Vrais ».",
      ],
      en: [
        "At your parents' house, the living-room wall is covered in photos of {a.first}: diplomas, wedding, adopted {w:animal}. You have one photo. Blurry. From behind. Age 4.",
        "At family dinner, your parents spend twenty minutes praising {a.first}'s promotion. When you announce yours, the reply is: “That's nice. Can you pass the salt?”",
        "{a.first} gets {w:gift} for {a:his|her} birthday. For yours, you got a card with {a.first}'s name crossed out and yours written above it.",
        "Your parents had a plaque engraved “To our pride and joy” for {a.first}. You discovered they also have a three-person group chat without you, called “The Real Ones.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Mettre les pieds dans le plat', en: 'Call it out' },
        out: [
          { w: 1, text: { fr: ["J'ai tout déballé à table. Silence. Puis {a.my} m'a soutenu{|e} : « C'est vrai, ils ont toujours fait ça. » On a trinqué contre nos parents. Fraternité retrouvée.", "J'ai explosé. Mes parents ont nié, puis ajouté ma photo sur le mur. Une photo de {a.my} avec moi flou en arrière-plan. Progrès."], en: ["I unloaded it all at dinner. Silence. Then {a.my} backed me up: “It's true, they've always done that.” We toasted against our parents. Siblinghood restored.", "I exploded. My parents denied it, then added a photo of me to the wall. A photo of {a.my} with me blurry in the background. Progress."] }, fx: { rel: 8, happy: 3, stress: -3 } },
          { w: 1, text: { fr: ["J'ai mis les pieds dans le plat. {a.first} a levé les yeux au ciel : « Toujours à faire ton intéressant{|e}. » Mes parents ont hoché la tête. Trois contre un.", "Ma sortie a mal tourné : on m'a accusé{|e} de « gâcher le repas », et {a.my} a reçu une part de gâteau supplémentaire pour son « calme »."], en: ["I called it out. {a.first} rolled {a:his|her} eyes: “Always making it about you.” My parents nodded. Three against one.", "My outburst backfired: I was accused of “ruining dinner,” and {a.my} got an extra slice of cake for staying “so calm.”"] }, fx: { rel: -8, happy: -5 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Devenir meilleur', en: 'Out-achieve them' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: ["J'ai mis les bouchées doubles : diplôme, marathon, adoption d'un animal ({w:animal}). Mes parents ont acheté un deuxième mur.", "Je me suis surpassé{|e}. Mes parents ont enfin dit « on est fiers de toi ». Puis « comme {a.first} ». Presque."], en: ["I doubled down: diploma, marathon, adopted {w:animal}. My parents bought a second wall.", "I outdid myself. My parents finally said “we're proud of you.” Then “just like {a.first}.” Almost."] }, fx: { discipline: 4, happy: 4, stress: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai tout donné pour les impressionner. {a.first} a annoncé une grossesse le même jour. Personne n'a écouté mon discours.", "J'ai couru un marathon. {a.first} a couru le même, plus vite, avec un costume intégral représentant {w:animal}. Fin de la compétition."], en: ["I gave everything to impress them. {a.first} announced a pregnancy that same day. Nobody heard my speech.", "I ran a marathon. {a.first} ran the same one, faster, dressed as {w:animal}. Competition over."] }, fx: { happy: -5, stress: 6, athletic: 2 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'En rire', en: 'Laugh it off' },
        out: [
          { w: 2, text: { fr: ["J'en ai ri avec {a.my}. On a même fait un jeu : à chaque compliment des parents pour {a:lui|elle}, on boit. Je suis rentré{|e} en taxi.", "J'ai pris le parti d'en rire. {a.first} m'a avoué que la pression d'être le chouchou est épuisante. On s'est échangé nos rôles pour un week-end."], en: ["I laughed about it with {a.my}. We even made a game: every time our parents compliment {a:him|her}, we drink. I went home in a cab.", "I chose to laugh. {a.first} admitted the pressure of being the favorite is exhausting. We swapped roles for a weekend."] }, fx: { rel: 6, happy: 4 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai ri. Puis j'ai pleuré dans la voiture, en écoutant {w:song}. Puis j'ai englouti {w:food} au drive, en entier. La thérapie, c'est cher.", "Rire jaune. J'ai cumulé les sarcasmes toute la soirée. {a.first} m'a pris{|e} à part : « Ça va, toi ? » Non."], en: ["I laughed. Then cried in the car, listening to {w:song}. Then ate {w:food} whole at the drive-thru. Therapy is expensive.", "Forced laugh. Sarcasm all evening. {a.first} took me aside: “Are you okay?” No."] }, fx: { happy: -3, weight: 0.01, rel: 3 } },
        ],
      },
    ],
  },
  {
    id: 'f2_sib_mlm',
    icon: '🧴',
    cat: 'family',
    rating: 1,
    actor: 'sibling',
    vars: { amount: [300, 2500] },
    scene: { place: 'apartment', mood: 'neutral', prop: 'bottles' },
    when: { age: [20, 60], has: 'sibling' },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "{a.rel} t'invite à « un apéro entre amis ». Il y a des flûtes de mousseux tiède, un PowerPoint et des huiles essentielles {w:brand}. « Ce n'est PAS une pyramide, c'est un triangle d'opportunités. »",
        "{a.first} t'envoie un message vocal de 6 minutes avec une musique motivante derrière : {a:il|elle} est « entrepreneur{a:|e} indépendant{a:|e} » et a « une opportunité qui va changer ta vie ». Mise de départ : {$amount}.",
        "{a.first} a quitté son CDI pour vendre des leggings « qui affinent » et des compléments « inspirés » par {w:food}. {a:Il|Elle} veut que tu deviennes son « downline ». Tu ne sais pas ce que c'est. Ça sonne sale.",
        "Repas de famille : {a.rel} distribue des échantillons de crème anti-âge « miraculeuse » à tout le monde, même au chien des voisins. Kit de démarrage : {$amount}. « Tu seras ton propre patron ! »",
      ],
      en: [
        "{a.first} invites you to “drinks with friends.” There's lukewarm sparkling wine, a PowerPoint and {w:brand} essential oils. “It's NOT a pyramid, it's a triangle of opportunity.”",
        "{a.first} sends you a 6-minute voice memo with motivational music in the background: {a:he|she}'s an “independent entrepreneur” with “an opportunity that will change your life.” Buy-in: {$amount}.",
        "{a.first} quit a steady job to sell “slimming” leggings and supplements made from {w:food}. {a:He|She} wants you to be {a:his|her} “downline.” You don't know what that means. It sounds dirty.",
        "Family dinner: {a.first} hands out samples of “miracle” anti-aging cream to everyone, even the neighbors' dog. Starter kit: {$amount}. “You'll be your own boss!”",
      ],
    },
    choices: [
      {
        label: { fr: 'Investir par amour', en: 'Invest out of love' },
        out: [
          { w: 1, text: { fr: ["J'ai payé {$amount} par amour. J'ai maintenant 40 litres d'huile de lavande dans mon garage. Ma maison sent la grand-mère. {a.first} m'appelle « mon partenaire business ».", "J'ai investi {$amount}. J'ai vendu deux flacons, à ma mère. {a.first} a été promu{a:|e} « diamant saphir ». Moi, « ruiné{|e} bronze »."], en: ["I paid {$amount} out of love. I now have ten gallons of lavender oil in my garage. My house smells like a grandma. {a.first} calls me “my business partner.”", "I invested {$amount}. I sold two bottles, to my mom. {a.first} got promoted to “sapphire diamond.” Me: “broke bronze.”"] }, fx: { money: '-amount', rel: 10, happy: -3 } },
          { w: 1, text: { fr: ["J'ai investi {$amount}, et miracle : j'ai recruté trois collègues. Je gagne plus que {a.my}. {a:Il|Elle} ne me parle plus. Je suis devenu{|e} le monstre.", "Mise de {$amount}, et contre toute attente, ça a marché pour moi. J'ai une Twingo rose offerte par l'entreprise. Je me déteste un peu."], en: ["I invested {$amount}, and miracle: I recruited three coworkers. I earn more than {a.my}. {a:He|She} won't talk to me. I've become the monster.", "{$amount} in, and against all odds, it worked for me. The company gave me a pink compact car. I hate myself a little."] }, fx: { money: 1500, rel: -5, karma: -3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Refuser poliment', en: 'Politely decline' },
        out: [
          { w: 2, text: { fr: ["J'ai refusé gentiment. {a.first} m'a traité{|e} de « mentalité de pauvre » puis m'a ajouté{|e} à 14 groupes Facebook de motivation. Je me désabonne encore.", "« Non merci. » {a.first} a répondu par une citation sur le courage, signée {w:celeb}. Puis m'a envoyé un catalogue tous les lundis."], en: ["I politely declined. {a.first} said I have a “poverty mindset,” then added me to 14 motivational Facebook groups. I'm still unsubscribing.", "“No thanks.” {a.first} replied with a quote about courage from {w:celeb}. Then sent me a catalog every Monday."] }, fx: { rel: -4, stress: 2 } },
          { w: 1, text: { fr: ["J'ai refusé. Six mois plus tard, {a.my} avait tout perdu et dormait sur mon canapé avec 300 leggings. Je lui ai pris une paire. Ils affinent vraiment.", "Refus poli. {a.first} a vidé son compte, puis est venu{a:|e} pleurer chez moi. J'ai sorti {w:drink} et je l'ai écouté{a:|e} jusqu'à 3 h."], en: ["I declined. Six months later {a.my} had lost everything and was sleeping on my couch with 300 leggings. I took a pair. They really are slimming.", "Polite no. {a.first} emptied {a:his|her} bank account, then came over to cry. I opened {w:drink} and listened until 3 a.m."] }, fx: { rel: 6, karma: 3 } },
        ],
      },
      {
        label: { fr: 'Démontrer l\'arnaque', en: 'Prove it\'s a scam' },
        out: [
          { w: 1, odds: { smarts: 2 }, text: { fr: ["J'ai sorti un tableur. Avec des graphiques. {a.first} a vu les chiffres, a pâli, puis a quitté l'entreprise. {a:Il|Elle} m'a remercié{|e} avec une boîte de leggings gratuits.", "J'ai expliqué le schéma de Ponzi avec des Kinder. {a.first} a compris, a pleuré et s'est fait rembourser. Je suis le cerveau de la famille."], en: ["I pulled out a spreadsheet. With charts. {a.first} saw the numbers, went pale, then quit. Thanked me with a box of free leggings.", "I explained the Ponzi scheme using chocolate eggs. {a.first} understood, cried and got a refund. I'm the family brain."] }, fx: { rel: 8, smarts: 3, karma: 3 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai voulu démontrer l'arnaque. {a.first} m'a répondu « les gens qui réussissent ont toujours des détracteurs ». Je suis officiellement un « hater ».", "Ma démonstration était parfaite. {a.first} a simplement dit « tu es jaloux{|se} » et m'a bloqué{|e} sur tous les réseaux."], en: ["I tried to prove it was a scam. {a.first} replied “successful people always have haters.” I'm officially a “hater.”", "My demonstration was flawless. {a.first} simply said “you're jealous” and blocked me everywhere."] }, fx: { rel: -10, stress: 3 }, mood: 'angry' },
        ],
      },
    ],
  },
  {
    id: 'f2_sib_secret',
    icon: '🤫',
    cat: 'family',
    rating: 1,
    actor: 'sibling',
    scene: { place: 'park', mood: 'shock', prop: 'phone' },
    when: { age: [16, 55], has: 'sibling' },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "Tu surprends {a.rel} {w:at_place}, déguisé{a:|e} avec une perruque et des lunettes noires. {a:Il|Elle} te supplie : « Ne dis RIEN aux parents. » Tu découvres qu'{a:il|elle} est en réalité {w:weird_job}, pas avocat{a:|e}.",
        "Par erreur, {a.first} t'envoie un message destiné à quelqu'un d'autre : « Personne ne doit savoir pour {w:far_place}. Surtout pas ma famille. » Puis : « IGNORE ÇA ». Trop tard.",
        "{a.first} t'avoue en larmes un secret énorme : {a:il|elle} a raté ses études il y a cinq ans, et a fait semblant depuis. La remise de diplôme ? Une location de toge. Le diplôme ? Imprimé {w:at_place}.",
        "Tu tombes sur le deuxième téléphone de {a.rel}. Dedans : des dizaines de photos montrant {w:animal} et des messages codés. {a:Il|Elle} arrive derrière toi : « Il faut qu'on parle. »",
      ],
      en: [
        "You catch {a.first} {w:at_place}, disguised in a wig and sunglasses. {a:He|She} begs: “Don't tell our parents ANYTHING.” You discover {a:he|she} is actually {w:weird_job}, not a lawyer.",
        "{a.first} accidentally texts you a message meant for someone else: “No one can know about the place I'm going. Especially not my family.” Then: “IGNORE THAT.” Too late.",
        "{a.first} tearfully confesses a huge secret: {a:he|she} failed out of college five years ago and has been faking it ever since. The graduation? A rented gown. The diploma? Printed {w:at_place}.",
        "You stumble upon {a.first}'s second phone. Inside: dozens of photos of {w:animal} and coded messages. {a:He|She} appears behind you: “We need to talk.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Garder le secret', en: 'Keep the secret' },
        out: [
          { w: 2, text: { fr: ["J'ai juré de me taire. {a.first} m'a serré{|e} dans ses bras comme jamais. On partage maintenant un secret, et ça nous lie.", "Bouche cousue. {a.first} me doit une dette éternelle, et je compte bien la réclamer un jour."], en: ["I swore to stay silent. {a.first} hugged me like never before. We share a secret now, and it binds us.", "Lips sealed. {a.first} owes me an eternal debt, and I intend to collect someday."] }, fx: { rel: 12, karma: 2, schedule: { key: 'f2_sib_secret_out', years: 2 } }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai promis de garder le secret. Depuis, je dois mentir à chaque repas de famille. Mon œil tressaute dès qu'on prononce le prénom de {a.my}.", "Je garde le secret, mais ça me ronge. J'ai fait trois cauchemars où je le révèle en direct à la télé."], en: ["I promised to keep the secret. Now I have to lie at every family dinner. My eye twitches whenever someone says {a.my}'s name.", "I'm keeping the secret, but it's eating me alive. I've had three nightmares about blurting it out on live TV."] }, fx: { rel: 8, stress: 6, schedule: { key: 'f2_sib_secret_out', years: 2 } } },
        ],
      },
      {
        label: { fr: 'Négocier mon silence', en: 'Sell my silence' },
        rating: 1,
        out: [
          { w: 2, text: { fr: ["Mon silence a un prix : {a.my} fait ma vaisselle pendant un an et me paie un week-end {w:far_place}. Le chantage, c'est la famille.", "J'ai négocié. {a.first} m'a cédé sa place de parking, son abonnement streaming et 200 €. Je suis un requin."], en: ["My silence has a price: {a.my} does my dishes for a year and pays for a weekend getaway. Blackmail is family.", "I negotiated. {a.first} gave me {a:his|her} parking spot, streaming subscription and $200. I'm a shark."] }, fx: { money: 200, rel: -6, karma: -4, happy: 4, schedule: { key: 'f2_sib_secret_out', years: 2 } } },
          { w: 1, text: { fr: ["J'ai voulu faire chanter {a.my}. {a:Il|Elle} a souri et sorti mon propre secret, celui de 2011. Match nul, guerre froide.", "Chantage tenté. {a.first} avait des captures d'écran sur moi depuis le lycée. On a signé un pacte de destruction mutuelle assurée."], en: ["I tried to blackmail {a.my}. {a:He|She} smiled and pulled out my own secret, the one from 2011. Draw, cold war.", "Blackmail attempted. {a.first} had screenshots on me from high school. We signed a mutually-assured-destruction pact."] }, fx: { rel: -10, stress: 5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Tout dire aux parents', en: 'Tell our parents' },
        out: [
          { w: 1, text: { fr: ["J'ai tout dit. Nos parents ont hurlé, puis pleuré, puis… ont avoué qu'ils avaient eux aussi un secret. Repas de famille le plus long de l'histoire.", "J'ai cafté. Les parents l'ont très bien pris, mieux que prévu. {a.first} m'en veut quand même, mais respire mieux."], en: ["I told them everything. Our parents screamed, then cried, then… admitted they had a secret too. Longest family dinner in history.", "I snitched. Our parents took it well, better than expected. {a.first} still resents me, but breathes easier."] }, fx: { rel: -8, karma: 2, stress: -3 } },
          { w: 1, text: { fr: ["J'ai cafté. {a.first} a été déshérité{a:|e} « temporairement ». Je suis désormais le traître officiel. On ne m'invite plus aux anniversaires.", "Tout révélé. Les parents ont fait un malaise collectif. {a.first} m'a envoyé un seul message : « Judas. »"], en: ["I snitched. {a.first} was “temporarily” disinherited. I'm now the official traitor. No more birthday invites.", "All revealed. Our parents had a joint meltdown. {a.first} sent me one message: “Judas.”"] }, fx: { rel: -20, happy: -4 }, mood: 'sad' },
        ],
      },
    ],
  },
  {
    id: 'f2_sib_secret_out',
    icon: '💣',
    cat: 'family',
    rating: 1,
    actor: 'sibling',
    chainOnly: true,
    scene: { place: 'home', mood: 'shock', prop: 'cake' },
    text: {
      fr: [
        "Deux ans ont passé. Au repas de Noël, le secret de {a.rel} éclate : quelqu'un a vu une vidéo. Tous les regards se tournent vers toi : « Tu savais ? »",
        "Le secret de {a.first} a fini par sortir, à cause d'un tag sur {w:app}. Tes parents sont furieux. Et {a.first} te soupçonne d'avoir parlé. Ce n'était pas toi. Cette fois.",
        "Anniversaire de mariage des parents. Un invité lâche par accident le secret de {a.first}. Silence de mort. {a.first} te regarde avec des yeux de chien battu : « Aide-moi. »",
        "Le secret de {a.rel} est désormais public : un article est paru dans le journal local, photo à l'appui, {w:at_place}. Ton téléphone vibre : c'est toute la famille en même temps.",
      ],
      en: [
        "Two years later. At Christmas dinner, {a.first}'s secret blows up: someone saw a video. Every eye turns to you: “Did you know?”",
        "{a.first}'s secret finally got out, thanks to a tag on {w:app}. Your parents are furious. And {a.first} suspects you talked. It wasn't you. This time.",
        "Your parents' anniversary. A guest accidentally drops {a.first}'s secret. Dead silence. {a.first} gives you puppy eyes: “Help me.”",
        "{a.first}'s secret is now public: an article came out in the local paper, with a photo, {w:at_place}. Your phone buzzes: the whole family at once.",
      ],
    },
    choices: [
      {
        label: { fr: 'Défendre {a.first}', en: 'Defend them' },
        out: [
          { w: 2, text: { fr: ["Je me suis levé{|e} et j'ai défendu {a.my} avec un discours enflammé. Les parents ont fini par applaudir. {a.first} m'a dit merci les yeux mouillés. Lien indestructible.", "J'ai pris sa défense. Ça a tout changé : la famille a accepté la vérité. {a.first} me considère comme son garde du corps émotionnel."], en: ["I stood up and defended {a.my} with a fiery speech. Our parents ended up applauding. {a.first} thanked me with wet eyes. Unbreakable bond.", "I took {a:his|her} side. It changed everything: the family accepted the truth. {a.first} calls me {a:his|her} emotional bodyguard."] }, fx: { rel: 15, karma: 4, happy: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["Je l'ai défendu{a:|e}. Résultat : on est maintenant deux dans la ligne de tir. Repas fini dans la voiture, à manger des chips ensemble.", "J'ai pris sa défense, et les parents ont compris que je savais depuis deux ans. Double peine. Mais {a.my} et moi, on est soudés."], en: ["I defended {a:him|her}. Result: now we're both in the line of fire. Dinner ended in the car, eating chips together.", "I took {a:his|her} side, and our parents realized I'd known for two years. Double punishment. But {a.my} and I are tight."] }, fx: { rel: 10, stress: 4 } },
        ],
      },
      {
        label: { fr: 'Faire l\'innocent', en: 'Play dumb' },
        out: [
          { w: 1, text: { fr: ["J'ai joué l'étonnement total, avec une main sur la bouche. Oscar mérité. {a.first} m'a fait un clin d'œil reconnaissant.", "« Quoi ?! Je n'en avais AUCUNE idée ! » Tout le monde m'a cru{|e}. {a.first} a apprécié la performance."], en: ["I played total shock, hand over mouth. Oscar-worthy. {a.first} gave me a grateful wink.", "“What?! I had NO idea!” Everyone believed me. {a.first} appreciated the performance."] }, fx: { rel: 4, karma: -1 } },
          { w: 1, text: { fr: ["J'ai fait l'innocent. Mauvais choix : {a.my} a affirmé publiquement que je savais tout et que je l'avais encouragé{a:|e}. Je n'avais rien encouragé du tout.", "Mon jeu d'acteur était nul. Ma mère a lâché : « Tu mens comme quand tu avais six ans. » Exposé{|e}."], en: ["I played dumb. Bad move: {a.my} announced publicly that I knew everything and encouraged it. I encouraged nothing.", "My acting was terrible. My mom said: “You lie like you did at age six.” Exposed."] }, fx: { rel: -6, happy: -3 } },
        ],
      },
      {
        label: { fr: 'Révéler mon secret', en: 'Drop my own secret' },
        out: [
          { w: 1, text: { fr: ["Pour faire diversion, j'ai révélé mon propre secret. Bombe atomique. Plus personne ne parle de {a.my}. {a:Il|Elle} m'a envoyé des fleurs. Moi, je suis en exil.", "J'ai lâché un secret encore plus gros pour sauver {a.my}. Sacrifice héroïque. On parle encore de ce Noël dans toute la famille."], en: ["To create a diversion, I revealed my own secret. Nuclear bomb. Nobody talks about {a.my} anymore. {a:He|She} sent me flowers. I'm in exile.", "I dropped an even bigger secret to save {a.my}. Heroic sacrifice. The whole family still talks about that Christmas."] }, fx: { rel: 15, happy: -6, stress: 6 }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai voulu révéler mon secret, mais je n'en ai pas. J'en ai inventé un sur le moment : « Je suis membre d'une secte. Notre dieu : {w:hobby} ». Ma mère m'a cru{|e}.", "J'ai improvisé un secret. Il était tellement bizarre que tout le monde m'a envoyé{|e} consulter. {a.first} s'en est tiré{a:|e} sans une égratignure."], en: ["I wanted to reveal my secret, but I don't have one. I made one up on the spot: “I'm in a cult. Our god: {w:hobby}.” My mom believed me.", "I improvised a secret. It was so weird that everyone sent me to therapy. {a.first} got away without a scratch."] }, fx: { rel: 8, happy: -2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_sib_baby_name',
    icon: '🍼',
    cat: 'family',
    rating: 0,
    actor: 'sibling',
    scene: { place: 'hospital', mood: 'angry', prop: 'baby' },
    when: { age: [22, 45], has: 'sibling' },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "{a.rel} vient d'avoir un bébé. Le prénom ? Celui que tu gardes secrètement depuis tes 12 ans pour ton futur enfant. Tu l'avais confié à {a:lui|elle} un soir {w:at_place}. Trahison.",
        "Annonce de naissance de {a.first} : le bébé s'appelle comme {w:celeb}. Avec un tréma. Et un trait d'union. Toute la famille fait semblant de trouver ça joli.",
        "{a.first} te demande ton avis sur le prénom du bébé. Sa liste finale : « Kaïlyss », « Brooklynn » et « {w:nickname} ». {a:Il|Elle} te regarde avec des yeux pleins d'espoir.",
        "{a.rel} a appelé son bébé comme toi. Officiellement « en ton honneur ». Officieusement, tout le monde appelle maintenant le bébé par ton prénom et toi par « le grand ou la grande ».",
      ],
      en: [
        "{a.first} just had a baby. The name? The one you've secretly saved since age 12 for your future child. You told {a:him|her} one night {w:at_place}. Betrayal.",
        "{a.first}'s birth announcement: the baby is named after {w:celeb}. With an umlaut. And a hyphen. The whole family pretends it's lovely.",
        "{a.first} asks your opinion on the baby's name. Final list: “Kaylissse,” “Brooklynnn” and “{w:nickname}.” {a:He|She} looks at you with hopeful eyes.",
        "{a.first} named the baby after you. Officially “in your honor.” Unofficially, everyone now uses your name for the baby and calls you “the big one.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Dire la vérité', en: 'Be honest' },
        out: [
          { w: 1, text: { fr: ["J'ai été honnête. {a.first} a été blessé{a:|e}, puis a changé d'avis au dernier moment. Le bébé s'appelle normalement. Il me remerciera dans 18 ans.", "J'ai dit franchement ce que je pensais. {a.first} m'a remercié{|e} : personne n'avait osé. Le prénom a été sauvé de justesse."], en: ["I was honest. {a.first} was hurt, then changed {a:his|her} mind at the last minute. The baby has a normal name. The kid will thank me in 18 years.", "I said what I really thought. {a.first} thanked me: nobody else dared. The name was saved at the last second."] }, fx: { rel: 4, karma: 3 } },
          { w: 1, text: { fr: ["J'ai été honnête. {a.first} ne m'a pas parlé pendant trois mois et a gardé le prénom par principe. Le bébé me regarde bizarrement.", "Ma franchise a coûté cher : je ne suis plus parrain ou marraine. Le poste a été donné à un collègue de {a.my} qui a « adoré le prénom »."], en: ["I was honest. {a.first} didn't speak to me for three months and kept the name out of principle. The baby looks at me funny.", "My honesty cost me: I'm no longer the godparent. The job went to {a.my}'s coworker, who “loved the name.”"] }, fx: { rel: -10, happy: -3 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Sourire et applaudir', en: 'Smile and clap' },
        out: [
          { w: 2, text: { fr: ["J'ai souri. J'ai dit que c'était « original ». C'est le mot que tout le monde utilise quand c'est moche. {a.first} était ravi{a:|e}.", "« Magnifique ! » J'ai menti avec tout mon cœur. Le bébé est adorable, de toute façon. Même avec ce prénom."], en: ["I smiled. I said it was “unique.” That's the word everyone uses when it's ugly. {a.first} was thrilled.", "“Beautiful!” I lied with all my heart. The baby is adorable anyway. Even with that name."] }, fx: { rel: 6, karma: -1 } },
          { w: 1, text: { fr: ["J'ai applaudi. {a.first} m'a demandé{|e} comme parrain ou marraine sur le champ. Je vais devoir prononcer ce prénom au baptême, devant un prêtre.", "J'ai fait semblant d'aimer. Maintenant je dois le graver sur une gourmette en or. Le bijoutier a ri."], en: ["I clapped. {a.first} asked me to be godparent on the spot. I'll have to say that name at the christening, in front of a priest.", "I pretended to love it. Now I have to engrave it on a gold bracelet. The jeweler laughed."] }, fx: { rel: 8, money: -150 } },
        ],
      },
      {
        label: { fr: 'Proposer un surnom', en: 'Suggest a nickname' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai proposé un surnom affectueux. Toute la famille l'a adopté. Le vrai prénom n'existe plus que sur les papiers officiels. Mission sauvetage réussie.", "J'ai trouvé un diminutif génial. {a.first} l'adore. Le bébé aussi, je crois. Il a souri. Ou il a fait caca."], en: ["I suggested an affectionate nickname. The whole family adopted it. The real name only exists on official documents now. Rescue mission accomplished.", "I came up with a great nickname. {a.first} loves it. So does the baby, I think. It smiled. Or pooped."] }, fx: { rel: 6, happy: 3 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai proposé « {w:nickname} » comme surnom. Ça a pris. Le bébé a maintenant un surnom encore pire que son prénom. C'est ma faute.", "Mon surnom a été rejeté : « Tu te moques ? » {a.first} est vexé{a:|e} jusqu'au premier anniversaire."], en: ["I suggested “{w:nickname}” as a nickname. It stuck. The baby now has a nickname even worse than the name. My fault.", "My nickname got rejected: “Are you mocking us?” {a.first} stayed offended until the first birthday."] }, fx: { rel: -3, happy: 2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_sib_reality_tv',
    icon: '📺',
    cat: 'family',
    rating: 2,
    actor: 'sibling',
    scene: { place: 'studio', mood: 'shock', prop: 'tv' },
    when: { age: [18, 50], has: 'sibling' },
    weight: 4,
    cooldown: 10,
    text: {
      fr: [
        "{a.rel} est candidat{a:|e} dans {w:show}. Épisode 3 : {a:il|elle} pleure dans un jacuzzi en racontant que tu lui as « volé son enfance » en 2003, en lui piquant sa Game Boy.",
        "Tu allumes la télé : {a.first} est dans {w:show}, bourré{a:|e}, en train de se battre avec un candidat appelé « Kévin le Taureau » pour un pot de pâte à tartiner. La production a mis ton nom en bandeau : « {Son frère|Sa sœur} ne l'a jamais soutenu{a:|e} ».",
        "{a.first} a été sélectionné{a:|e} pour une émission de téléréalité. Dans le confessionnal, {a:il|elle} révèle que tu as fait pipi au lit jusqu'à tes 11 ans. 4 millions de téléspectateurs.",
        "Le portrait de famille de {a.rel} dans {w:show} : ta photo de classe floutée, ta mère qui pleure, et toi, filmé{|e} à ton insu en train de sortir les poubelles en caleçon.",
      ],
      en: [
        "{a.first} is on {w:show}. Episode 3: {a:he|she} cries in a hot tub, saying you “stole {a:his|her} childhood” in 2003 by taking {a:his|her} Game Boy.",
        "You turn on the TV: {a.first} is on {w:show}, drunk, wrestling a contestant named “Kevin the Bull” over a jar of chocolate spread. The producers put your name in the caption: “Sibling never supported {a:him|her}.”",
        "{a.first} got cast on a reality show. In the confessional, {a:he|she} reveals you wet the bed until age 11. 4 million viewers.",
        "{a.first}'s family segment on {w:show}: your blurred class photo, your mom crying, and you, filmed without consent taking out the trash in your underwear.",
      ],
    },
    choices: [
      {
        label: { fr: 'Contre-interview', en: 'Give a counter-interview' },
        out: [
          { w: 1, text: { fr: ["J'ai donné une interview à un magazine people. J'ai raconté la fois où {a.my} a vomi dans le sac de la mariée. Audience record. On se déteste en direct, et on est payés.", "Contre-attaque médiatique : j'ai révélé que {a.my} dormait avec un doudou jusqu'à 25 ans. Les réseaux ont explosé. Ma mère a coupé son téléphone."], en: ["I gave an interview to a gossip magazine. I told the story of {a.my} throwing up in the bride's handbag. Record ratings. We hate each other live, and we're getting paid.", "Media counterattack: I revealed {a.my} slept with a stuffed animal until 25. Social media exploded. Mom turned off her phone."] }, fx: { fame: 3, followers: 8000, rel: -12, money: 1000 }, mood: 'angry' },
          { w: 1, text: { fr: ["Mon interview a été coupée au montage pour me faire passer pour un monstre. On me reconnaît {w:at_place} et on me crache dessus. Littéralement, une fois.", "La production a remonté mon interview. On m'entend dire « {a.first} est une ordure » alors que je parlais de mon aspirateur."], en: ["My interview was edited to make me look like a monster. People recognize me {w:at_place} and spit at me. Literally, once.", "The producers re-cut my interview. You hear me say “{a.first} is trash” when I was talking about my vacuum cleaner."] }, fx: { happy: -8, fame: 2, stress: 6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Soutenir en public', en: 'Support them publicly' },
        out: [
          { w: 1, text: { fr: ["J'ai posté un message de soutien. {a.first} l'a lu à l'antenne en pleurant. Les fans m'adorent. J'ai reçu des demandes en mariage et une bouteille de parfum.", "Message de soutien posté. {a.first} m'a dédié sa victoire finale. J'ai été invité{|e} sur le plateau. J'ai trébuché en direct, ce qui a fait un GIF."], en: ["I posted a message of support. {a.first} read it on air, crying. The fans love me. I got marriage proposals and a bottle of perfume.", "Support message posted. {a.first} dedicated the final win to me. I was invited on set. I tripped on live TV, which became a GIF."] }, fx: { rel: 12, followers: 5000, happy: 4 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai soutenu {a.my}. Trois jours plus tard, {a:il|elle} s'est fait éliminer pour avoir déféqué dans le jacuzzi. Mon tweet de soutien est devenu un mème.", "Mon soutien est tombé pile la semaine du scandale : {a.my} a vomi sur l'animateur en direct. J'ai effacé mon post. Les captures restent."], en: ["I supported {a.my}. Three days later {a:he|she} got eliminated for pooping in the hot tub. My support tweet became a meme.", "My support landed the very week of the scandal: {a.my} vomited on the host live. I deleted my post. The screenshots remain."] }, fx: { happy: -4, followers: 2000, fame: 1 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Ignorer, déménager', en: 'Ignore it, move away' },
        out: [
          { w: 1, text: { fr: ["J'ai ignoré l'émission. J'ai changé de coupe de cheveux et pris un nouveau nom sur les réseaux. Personne ne m'a reconnu{|e}. Paix intérieure.", "J'ai fait comme si de rien n'était. L'émission a été annulée au bout de quatre épisodes. {a.first} est revenu{a:|e} travailler {w:at_place}, comme avant."], en: ["I ignored the show. New haircut, new name online. Nobody recognized me. Inner peace.", "I acted like nothing happened. The show was cancelled after four episodes. {a.first} went back to working {w:at_place}, like before."] }, fx: { stress: -3, happy: 2 } },
          { w: 1, text: { fr: ["Impossible d'ignorer : ma voisine regarde l'émission fenêtre ouverte, à fond. J'entends ma propre famille se déchirer à travers le mur.", "J'ai voulu ignorer. Mon patron, lui, regarde l'émission. En réunion, il m'a demandé si je faisais « toujours pipi au lit »."], en: ["Impossible to ignore: my neighbor watches the show with the window open, full volume. I hear my own family tearing itself apart through the wall.", "I tried to ignore it. My boss, however, watches the show. In a meeting he asked if I “still wet the bed.”"] }, fx: { happy: -5, stress: 5, perf: -4 } },
        ],
      },
    ],
  },
  {
    id: 'f2_sib_prank_war',
    icon: '🎭',
    cat: 'family',
    rating: 2,
    actor: 'sibling',
    scene: { place: 'home', mood: 'party', prop: 'bucket' },
    when: { age: [15, 45], has: 'sibling' },
    weight: 6,
    cooldown: 4,
    text: {
      fr: [
        "La guerre des farces avec {a.rel} entre dans sa troisième année. Ce matin, tu as trouvé {w:animal} dans ta douche et ta brosse à dents trempée dans {w:drink}. C'est ton tour de riposter.",
        "{a.first} a remplacé la crème de tes Oreo par du dentifrice et collé tes affaires au plafond. Sur un post-it : « À toi de jouer, {w:nickname}. »",
        "Dernier coup de {a.first} : ta voiture entièrement emballée dans du film plastique, avec {w:object} à l'intérieur et une sonnerie qui joue {w:song} toutes les 10 minutes.",
        "{a.rel} a mis du colorant bleu dans le pommeau de douche. Tu ressembles à un Schtroumpf depuis trois jours. Il est temps de passer aux choses sérieuses.",
      ],
      en: [
        "The prank war with {a.first} enters its third year. This morning you found {w:animal} in your shower and your toothbrush soaked in {w:drink}. Your turn to strike back.",
        "{a.first} replaced your Oreo filling with toothpaste and glued your stuff to the ceiling. On a sticky note: “Your move, {w:nickname}.”",
        "{a.first}'s latest: your car fully shrink-wrapped, with {w:object} inside and a ringer that plays {w:song} every 10 minutes.",
        "{a.first} put blue dye in the showerhead. You've looked like a Smurf for three days. Time to get serious.",
      ],
    },
    choices: [
      {
        label: { fr: 'Farce de génie', en: 'Genius prank' },
        out: [
          { w: 1, odds: { smarts: 2 }, text: { fr: ["J'ai rempli sa chambre de 3 000 gobelets d'eau. Il a fallu six heures pour la vider. {a.first} a hissé le drapeau blanc. Victoire totale.", "J'ai fait croire à {a.my} qu'{a:il|elle} avait gagné au loto, avec une fausse lettre officielle. {a:Il|Elle} a démissionné. Oups. Victoire, mais à quel prix ?"], en: ["I filled {a:his|her} room with 3,000 cups of water. It took six hours to empty. {a.first} waved the white flag. Total victory.", "I made {a.my} believe {a:he|she} won the lottery, with a fake official letter. {a:He|She} quit {a:his|her} job. Oops. Victory, but at what cost?"] }, fx: { happy: 8, rel: 2 }, mood: 'party' },
          { w: 1, text: { fr: ["Ma farce a raté : le seau d'eau placé au-dessus de la porte est tombé sur notre grand-mère. Elle a glissé, s'est ouvert le menton et a mis du sang partout sur le carrelage. Elle rigole encore, avec ses trois points de suture.", "J'ai voulu piéger {a.my} avec un faux serpent. {a:Il|Elle} a eu le réflexe de le frapper avec une poêle. J'étais derrière. Nez cassé, sang sur les murs, fou rire général."], en: ["My prank backfired: the bucket over the door landed on our grandmother. She slipped, split her chin and bled all over the tiles. She's still laughing, with three stitches.", "I tried to scare {a.my} with a fake snake. {a:He|She} reflexively hit it with a frying pan. I was behind it. Broken nose, blood on the walls, everyone in hysterics."] }, fx: { health: -6, happy: 2, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Escalade nucléaire', en: 'Nuclear escalation' },
        out: [
          { w: 1, text: { fr: ["J'ai mis un laxatif dans son café avant son entretien d'embauche. {a.first} a repeint les toilettes de l'entreprise en direct, sous les yeux du DRH. {a:Il|Elle} a été embauché{a:|e} : « On aime les gens qui n'ont pas peur de rien. »", "Laxatif dans le gâteau d'anniversaire de {a.my}. Le gâteau a été mangé par toute la famille. Explosion collective. On a fait la queue devant les toilettes jusqu'à minuit."], en: ["I put laxatives in {a:his|her} coffee before a job interview. {a.first} redecorated the company bathroom live, in front of HR. {a:He|She} got hired: “We like people who aren't afraid of anything.”", "Laxatives in {a.my}'s birthday cake. The whole family ate the cake. Collective explosion. We queued for the bathroom until midnight."] }, fx: { happy: 5, rel: -8, karma: -5, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: ["J'ai lâché des grillons dans sa voiture. 2 000 grillons. {a.first} a hurlé sur l'autoroute et percuté un panneau. {a:Il|Elle} va bien, la voiture non. Fin de la guerre, par décret parental.", "J'ai fait livrer {w:animal} vivant chez {a.my}. Il a tout cassé, y compris {a.my}. Cheville foulée. La guerre est suspendue pour raison médicale."], en: ["I released crickets in {a:his|her} car. 2,000 crickets. {a.first} screamed on the highway and hit a sign. {a:He|She} is fine; the car isn't. War ended by parental decree.", "I had {w:animal} delivered alive to {a.my}'s place. It wrecked everything, including {a.my}. Sprained ankle. War suspended for medical reasons."] }, fx: { rel: -12, money: -600, karma: -4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Proposer l\'armistice', en: 'Offer an armistice' },
        out: [
          { w: 1, text: { fr: ["J'ai proposé une trêve avec un gâteau. {a.first} a accepté. Le gâteau était un piège : il était en éponge. {a:Il|Elle} a croqué dedans. Je suis un monstre et je l'assume.", "Armistice signé, avec un câlin. Trois jours plus tard, j'ai trouvé mes chaussures pleines de gelée. La paix n'existe pas dans cette famille."], en: ["I offered a truce with a cake. {a.first} accepted. The cake was a trap: it was a sponge. {a:He|She} bit into it. I'm a monster and I own it.", "Armistice signed, with a hug. Three days later I found my shoes full of jelly. Peace doesn't exist in this family."] }, fx: { happy: 4, rel: 3 } },
          { w: 1, text: { fr: ["On a signé une vraie paix. Puis on s'est alliés contre notre cousin, la nouvelle cible. Il ne s'en remettra jamais.", "Armistice durable. On a fait une compilation vidéo de toutes nos farces pour l'anniversaire de nos parents. Ils ont découvert qui avait inondé le garage en 2009."], en: ["We signed a real peace. Then teamed up against our cousin, the new target. He'll never recover.", "Lasting armistice. We made a video compilation of all our pranks for our parents' anniversary. They found out who flooded the garage in 2009."] }, fx: { rel: 10, happy: 5 }, mood: 'happy' },
        ],
      },
    ],
  },
  {
    id: 'f2_sib_family_house',
    icon: '🏚️',
    cat: 'family',
    rating: 1,
    actor: 'sibling',
    vars: { amount: [15000, 80000] },
    scene: { place: 'home', mood: 'sad', prop: 'sign' },
    when: { age: [30, 80], has: 'sibling', test: aParentDead },
    weight: 4,
    cooldown: 10,
    text: {
      fr: [
        "La maison de votre enfance est à vous deux maintenant. {a.first} veut la vendre {$amount} à un promoteur qui va la raser pour construire {w:brand}. Toi, tu as encore ta chambre de 1997 en tête.",
        "{a.first} t'appelle : « Il faut décider pour la maison. » Le toit fuit, le jardin est envahi par {w:animal} et ton prénom est toujours gravé dans le chambranle de la cuisine.",
        "Réunion chez le notaire. {a.first} a déjà trouvé un acheteur pour la maison familiale : {$amount}, un couple qui veut « tout casser pour faire un loft ». Tu sens ta gorge se serrer.",
        "Vous faites un dernier tour de la maison de votre enfance avec {a.rel}. Dans le grenier, vous retrouvez {w:object} et la cachette secrète où vous planquiez vos bonbons. Il faut décider : vendre ou garder ?",
      ],
      en: [
        "Your childhood home belongs to both of you now. {a.first} wants to sell it for {$amount} to a developer who'll tear it down to build {w:brand}. You can still picture your 1997 bedroom.",
        "{a.first} calls: “We need to decide about the house.” The roof leaks, the yard is overrun by {w:animal} and your name is still carved in the kitchen doorframe.",
        "Meeting at the lawyer's. {a.first} already found a buyer for the family home: {$amount}, a couple who want to “gut it for a loft.” Your throat tightens.",
        "One last walk through your childhood home with {a.first}. In the attic you find {w:object} and the secret stash where you hid candy. Time to decide: sell or keep?",
      ],
    },
    choices: [
      {
        label: { fr: 'Vendre et partager', en: 'Sell and split' },
        out: [
          { w: 2, text: { fr: ["On a vendu. J'ai touché ma part, pleuré dans la voiture et gardé une brique en souvenir. {a.first} a gardé la boîte aux lettres. On l'a fait à deux, c'est ce qui compte.", "Vente signée. On a dîné ensemble ce soir-là, en se racontant nos pires souvenirs dans cette maison. Fou rire et larmes."], en: ["We sold. I got my share, cried in the car and kept a brick as a souvenir. {a.first} kept the mailbox. We did it together, that's what matters.", "Sale signed. We had dinner together that night, telling our worst memories of that house. Laughter and tears."] }, fx: { money: 'amount', rel: 6, happy: -2 } },
          { w: 1, text: { fr: ["On a vendu. Six mois plus tard, l'acheteur a trouvé un trésor de pièces d'or dans le mur. Il a fait la une du journal. {a.first} et moi, on a regardé la photo sans rien dire.", "Vendue. {a.first} a gardé une plus grosse part « pour les frais ». Quels frais ? Mystère. On ne se parle plus qu'à Noël."], en: ["We sold. Six months later the buyer found a stash of gold coins in the wall. Front-page news. {a.first} and I looked at the photo in silence.", "Sold. {a.first} kept a bigger share “for expenses.” What expenses? Mystery. We only talk at Christmas now."] }, fx: { money: 'amount', rel: -8, happy: -5 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Racheter sa part', en: 'Buy them out' },
        out: [
          { w: 1, text: { fr: ["J'ai racheté la part de {a.my}. La maison est à moi, avec ses fuites, ses souvenirs et ses fantômes. Je dors dans ma chambre d'enfant. C'est bizarre et parfait.", "Rachat conclu. J'ai rénové la maison pièce par pièce. {a.first} vient le dimanche, et on mange dans la même cuisine qu'à six ans."], en: ["I bought out {a.my}'s share. The house is mine, with its leaks, memories and ghosts. I sleep in my childhood bedroom. Weird and perfect.", "Buyout done. I renovated room by room. {a.first} comes on Sundays, and we eat in the same kitchen as when we were six."] }, fx: { money: '-amount', happy: 6, rel: 6, asset: 'h_house' }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai racheté la maison. Première nuit : la chaudière a explosé, une canalisation a pété et un raton laveur est tombé du plafond. {a.first} m'a envoyé un texto : « Bonne chance 😘 ».", "Rachat fait. La maison s'effondre petit à petit. J'ai investi tout mon argent dans des souvenirs et de la moisissure."], en: ["I bought the house. First night: the boiler exploded, a pipe burst and a raccoon fell from the ceiling. {a.first} texted: “Good luck 😘.”", "Buyout done. The house is slowly collapsing. I've invested all my money in memories and mold."] }, fx: { money: '-amount', happy: -4, stress: 6, asset: 'h_house' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'En faire un Airbnb', en: 'Turn it into an Airbnb' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["On l'a mise sur Airbnb, « Maison d'enfance authentique, vintage 1997 ». Les touristes adorent le papier peint. On partage les revenus. Business et nostalgie.", "Location saisonnière lancée. Les clients laissent cinq étoiles et des commentaires sur « l'ambiance familiale ». S'ils savaient."], en: ["We listed it on Airbnb: “Authentic childhood home, vintage 1997.” Tourists love the wallpaper. We split the income. Business and nostalgia.", "Vacation rental launched. Guests leave five stars and comments about “the family vibe.” If only they knew."] }, fx: { money: 2000, rel: 6 }, mood: 'proud' },
          { w: 1, text: { fr: ["Premier locataire Airbnb : un groupe d'enterrement de vie de garçon. Ils ont vomi dans ma chambre d'enfant et cassé le lustre de mamie. Note : 2 étoiles. Ils nous ont mis 2 étoiles.", "L'Airbnb a été un désastre : un client a organisé une fête de 200 personnes. La police est venue. {a.first} m'accuse. Je l'accuse. Le voisin nous accuse tous les deux."], en: ["First Airbnb guests: a bachelor party. They puked in my childhood bedroom and broke grandma's chandelier. Rating: 2 stars. THEY gave US 2 stars.", "The Airbnb was a disaster: a guest threw a 200-person party. The police came. {a.first} blames me. I blame {a:him|her}. The neighbor blames us both."] }, fx: { money: -1500, rel: -6, stress: 6 }, mood: 'angry' },
        ],
      },
    ],
  },
  {
    id: 'f2_sib_couch',
    icon: '🛋️',
    cat: 'family',
    rating: 2,
    actor: 'sibling',
    scene: { place: 'apartment', mood: 'angry', prop: 'couch' },
    when: { age: [22, 60], has: 'sibling', movedOut: true },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "{a.rel} dort sur ton canapé « juste une semaine, le temps de se retourner ». Ça fait huit mois. Le canapé a pris la forme de son corps et dégage {w:smell}.",
        "{a.first} squatte ton salon depuis la rupture. {a:Il|Elle} ne travaille pas, mange tes restes, laisse ses chaussettes sales sur la table basse et pète en dormant comme {w:sound}.",
        "{a.rel} « de passage » a transformé ton salon en garçonnière : {w:object} partout, des boîtes de pizza en pyramide et un poster représentant {w:celeb} scotché sur ta télé.",
        "{a.first} t'a laissé un mot sur le frigo : « J'ai invité des potes hier, désolé{a:|e} pour la baignoire. » Tu n'oses pas aller voir la baignoire.",
      ],
      en: [
        "{a.first} has been sleeping on your couch “just for a week, to get back on my feet.” It's been eight months. The couch has molded to {a:his|her} body and smells like {w:smell}.",
        "{a.first} has squatted your living room since the breakup. {a:He|She} doesn't work, eats your leftovers, leaves dirty socks on the coffee table and farts in {a:his|her} sleep like {w:sound}.",
        "Your “just passing through” sibling turned your living room into a bachelor pad: {w:object} everywhere, pizza boxes stacked in a pyramid and a poster of {w:celeb} taped to your TV.",
        "{a.first} left a note on the fridge: “Had some friends over last night, sorry about the bathtub.” You don't dare go look at the bathtub.",
      ],
    },
    choices: [
      {
        label: { fr: 'Ultimatum', en: 'Ultimatum' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: ["Ultimatum : dehors dans 15 jours. {a.first} a trouvé un appart en 14. Et un boulot. La peur, ça motive. On s'aime à nouveau, à distance.", "J'ai posé une date limite. {a.first} a pleuré, puis s'est réveillé{a:|e} : nouveau job, nouvel appart. {a:Il|Elle} m'a offert un canapé neuf pour s'excuser."], en: ["Ultimatum: out in 15 days. {a.first} found a place in 14. And a job. Fear is a great motivator. We love each other again, at a distance.", "I set a deadline. {a.first} cried, then woke up: new job, new place. {a:He|She} bought me a new couch as an apology."] }, fx: { rel: 4, happy: 6, stress: -5 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai posé un ultimatum. {a.first} a répondu en installant un rideau de douche autour du canapé « pour plus d'intimité ». C'est maintenant sa chambre officielle.", "Ultimatum ignoré. {a.first} a ramené un nouveau crush. Ils sont deux sur le canapé maintenant. Les bruits la nuit me hantent."], en: ["I issued an ultimatum. {a.first} responded by hanging a shower curtain around the couch “for privacy.” It's now officially {a:his|her} bedroom.", "Ultimatum ignored. {a.first} brought home a new crush. Now there are two on the couch. The noises at night haunt me."] }, fx: { happy: -6, stress: 8 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Inspecter la baignoire', en: 'Inspect the bathtub' },
        out: [
          { w: 1, text: { fr: ["J'ai ouvert la porte de la salle de bains. Dans la baignoire : de la jelly verte, une perruque, et un poisson vivant. J'ai refermé. J'ai pris une douche à la salle de sport pendant un mois.", "La baignoire contenait {w:gross} et quelque chose qui bougeait. J'ai vomi dans le lavabo, puis dans le panier à linge. Puis j'ai tout brûlé."], en: ["I opened the bathroom door. In the tub: green jelly, a wig and a live fish. I closed it. I showered at the gym for a month.", "The tub contained {w:gross} and something that moved. I threw up in the sink, then in the laundry basket. Then I burned everything."] }, fx: { happy: -6, health: -2, rel: -6, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: ["La baignoire était impeccable. Trop impeccable. {a.first} avait tout nettoyé, y compris des preuves. Je n'ai jamais su ce qui s'était passé, et c'est peut-être mieux.", "Baignoire propre, avec un mot : « Je t'aime, merci de m'héberger. » J'ai fondu. {a.first} peut rester encore un mois."], en: ["The tub was spotless. Too spotless. {a.first} had cleaned everything, including evidence. I never found out what happened, and maybe that's for the best.", "Clean tub, with a note: “Love you, thanks for having me.” I melted. {a.first} can stay another month."] }, fx: { rel: 6, happy: 2 } },
        ],
      },
      {
        label: { fr: 'Exiger un loyer', en: 'Charge rent' },
        out: [
          { w: 1, text: { fr: ["J'ai exigé un loyer. {a.first} m'a payé en « services » : cuisine, ménage, et un massage des pieds que je n'avais pas demandé. Le ménage est nickel. Le reste, flou.", "Loyer exigé : 300 €. {a.first} a payé en pièces de 2 centimes, dans un seau. J'ai compté pendant trois heures."], en: ["I demanded rent. {a.first} paid in “services”: cooking, cleaning and a foot massage I never asked for. The cleaning is spotless. The rest, blurry.", "Rent demanded: $300. {a.first} paid in pennies, in a bucket. I counted for three hours."] }, fx: { money: 200, rel: -2 } },
          { w: 1, text: { fr: ["J'ai réclamé un loyer. {a.first} a appelé nos parents en pleurant. Résultat : c'est moi qui paie une partie de son téléphone. Je ne comprends pas comment.", "{a.my} a accepté de payer un loyer, puis m'a emprunté l'argent du loyer. Puis m'a remboursé avec mon propre argent. Je suis dans une boucle infinie."], en: ["I asked for rent. {a.first} called our parents in tears. Result: I'm now paying part of {a:his|her} phone bill. I don't understand how.", "{a.my} agreed to pay rent, then borrowed the rent money from me. Then paid me back with my own money. I'm in an infinite loop."] }, fx: { money: -200, stress: 5 } },
        ],
      },
    ],
  },
  {
    id: 'f2_sib_bachelor',
    icon: '🍾',
    cat: 'family',
    rating: 2,
    actor: 'sibling',
    vars: { amount: [400, 2000] },
    scene: { place: 'party', mood: 'party', prop: 'champagne' },
    when: { age: [21, 50], has: 'sibling' },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "{a.rel} se marie et t'a confié son enterrement de vie de {a:garçon|jeune fille}. Budget : {$amount}. Lieu : {w:far_place}. Il y a une limousine, un déguisement (thème : {w:animal}) et des décisions à prendre.",
        "Enterrement de vie de {a:garçon|jeune fille} de {a.first}, 2 h du matin. {a:Il|Elle} est déguisé{a:|e} (thème : {w:animal}), debout sur une table, et vient de commander une tournée pour tout le bar avec ta carte bleue.",
        "Pour l'enterrement de vie de {a:garçon|jeune fille} de {a.first}, ses potes ont réservé un numéro de strip-tease : quelqu'un déguisé en {w:weird_job}. Il est minuit, {a.first} pleure parce qu'{a:il|elle} « aime tellement tout le monde ».",
        "Lendemain d'enterrement de vie de {a:garçon|jeune fille} : {a.first} s'est réveillé{a:|e} {w:at_place}, avec un tatouage frais, un sourcil en moins et aucun souvenir. Le mariage est dans 48 h.",
      ],
      en: [
        "{a.first} is getting married and put you in charge of the {a:bachelor|bachelorette} party. Budget: {$amount}. Location: somewhere wild. There's a limo, a costume (theme: {w:animal}) and decisions to make.",
        "{a.first}'s {a:bachelor|bachelorette} party, 2 a.m. {a:He|She} is in costume (theme: {w:animal}), standing on a table, and just ordered a round for the whole bar on your card.",
        "For {a.first}'s {a:bachelor|bachelorette} party, the friends booked a stripper dressed as {w:weird_job}. It's midnight, and {a.first} is crying because {a:he|she} “loves everyone so much.”",
        "Morning after the {a:bachelor|bachelorette} party: {a.first} woke up {w:at_place}, with a fresh tattoo, one eyebrow missing and no memory. The wedding is in 48 hours.",
      ],
    },
    choices: [
      {
        label: { fr: 'Ambiance maximale', en: 'Maximum party' },
        out: [
          { w: 1, text: { fr: ["Soirée légendaire. {a.first} a fini en slip dans une fontaine, en chantant {w:song}. J'ai payé {$amount} et je ne regrette rien. Les photos sont dans un coffre-fort.", "On a tout donné : karaoké, limousine, bagarre d'oreillers à 4 h. {a.first} m'a dit « meilleure nuit de ma vie ». Moi aussi, je crois. Je ne me souviens de rien."], en: ["Legendary night. {a.first} ended up in underwear in a fountain, singing {w:song}. I paid {$amount} and regret nothing. The photos are in a safe.", "We went all out: karaoke, limo, pillow fight at 4 a.m. {a.first} said “best night of my life.” Mine too, I think. I don't remember anything."] }, fx: { money: '-amount', rel: 12, happy: 8, health: -3 }, mood: 'party' },
          { w: 1, text: { fr: ["Trop d'ambiance : {a.my} a vomi dans la limousine, sur le chauffeur, puis sur moi. On a fini au commissariat parce qu'{a:il|elle} a voulu « libérer » un homard au restaurant.", "La soirée a dérapé : shots de tequila, chute dans un escalier, deux dents cassées pour {a.my}. Sur les photos du mariage, {a:il|elle} sourit bouche fermée."], en: ["Too much party: {a.my} threw up in the limo, on the driver, then on me. We ended up at the police station because {a:he|she} tried to “free” a lobster at a restaurant.", "The night went off the rails: tequila shots, a fall down the stairs, two broken teeth for {a.my}. In the wedding photos {a:he|she} smiles with {a:his|her} mouth closed."] }, fx: { money: '-amount', health: -4, rel: 4, heat: 3, visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Soirée sage', en: 'Keep it classy' },
        out: [
          { w: 2, text: { fr: ["J'ai organisé un atelier poterie et un dîner chic. {a.first} était ému{a:|e}. Ses potes s'ennuyaient à mourir, mais {a:il|elle} a adoré.", "Soirée raffinée : dégustation de vins et jeux de société. {a.first} m'a remercié{|e} d'avoir évité le « cliché ». Les potes sont partis faire la fête sans nous."], en: ["I organized a pottery workshop and a fancy dinner. {a.first} was touched. {a:His|Her} friends were bored to death, but {a:he|she} loved it.", "Classy night: wine tasting and board games. {a.first} thanked me for avoiding the “cliché.” The friends went partying without us."] }, fx: { money: -300, rel: 8, happy: 3 } },
          { w: 1, text: { fr: ["Soirée sage annulée par les potes de {a.my}, qui ont kidnappé {a:le|la} futur{a:|e} marié{a:|e} pour l'emmener à Amsterdam. Je l'ai appris sur Instagram.", "Ma soirée poterie a été jugée « digne d'une maison de retraite ». On m'a retiré l'organisation. Je suis officiellement ringard{|e}."], en: ["My classy night was cancelled by {a.my}'s friends, who kidnapped the {a:groom|bride}-to-be to Amsterdam. I found out on Instagram.", "My pottery night was deemed “nursing-home material.” I got fired from organizing. I'm the official square."] }, fx: { happy: -5, rel: -3 } },
        ],
      },
      {
        label: { fr: 'Préparer un discours', en: 'Prep a roast speech' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai écrit un discours de témoin avec toutes les anecdotes honteuses de {a.my}. Au mariage, même les grands-parents pleuraient de rire. Standing ovation.", "Mon discours était un chef-d'œuvre d'humour et d'émotion. {a.first} m'a serré{|e} dans ses bras pendant cinq minutes. Le DJ a dû attendre."], en: ["I wrote a best-man/maid-of-honor speech packed with {a.my}'s most shameful stories. At the wedding, even the grandparents cried laughing. Standing ovation.", "My speech was a masterpiece of humor and emotion. {a.first} hugged me for five minutes. The DJ had to wait."] }, fx: { rel: 12, happy: 6, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai raconté l'anecdote de l'enterrement de vie au mariage. Sa future moitié n'était pas au courant. Le mariage a eu lieu quand même, mais sans dessert.", "Mon discours contenait une blague sur l'ex de {a.my}. L'ex était dans la salle. À la table d'honneur. C'était la mère du marié."], en: ["I told the bachelor-party story at the wedding. The future spouse didn't know about it. The wedding still happened, but without dessert.", "My speech included a joke about {a.my}'s ex. The ex was in the room. At the head table. It was the groom's mother."] }, fx: { rel: -12, happy: -4 }, mood: 'shock' },
        ],
      },
    ],
  },
  // ───────────────────────────── DNA tests & family secrets ─────────────────────────────
  {
    id: 'f2_dna_kit',
    icon: '🧬',
    cat: 'family',
    rating: 1,
    actor: 'parent',
    scene: { place: 'home', mood: 'shock', prop: 'dna' },
    when: { age: [18, 65], has: 'parent', noFlag: ['f2_dna_halfsib', 'f2_dna_done'] },
    weight: 5,
    once: true,
    text: {
      fr: [
        "{a.rel} t'offre un test ADN pour ton anniversaire, « pour s'amuser ». Les résultats arrivent : 12 % viking, 3 % « non identifié », et un demi-frère ou une demi-sœur qui vit {w:far_place}. {a.first} devient très pâle.",
        "Tu as craché dans un tube pour un test ADN {w:brand}. Résultat : une correspondance « parent proche » avec un inconnu. Tu montres l'écran à {a.first}, qui laisse tomber {w:object}.",
        "Test ADN reçu. Bonne nouvelle : tu es 8 % italien. Mauvaise nouvelle : le site te propose de « rencontrer ta demi-sœur ou ton demi-frère ». {a.first} tousse très fort dans la pièce d'à côté.",
        "Pour Noël, toute la famille a fait un test ADN. {a.first} a refusé de faire le sien « pour des raisons religieuses ». Ton test révèle un membre de la famille que personne ne connaît. {a.first} a soudain très chaud.",
      ],
      en: [
        "{a.first} gives you a DNA test for your birthday, “just for fun.” Results: 12% Viking, 3% “unidentified,” and a half-sibling living {w:far_place}. {a.first} goes very pale.",
        "You spat in a tube for a DNA test from {w:brand}. Result: a “close relative” match with a stranger. You show the screen to {a.first}, who drops {w:object}.",
        "DNA test results in. Good news: you're 8% Italian. Bad news: the site suggests you “meet your half-sibling.” {a.first} coughs very loudly in the next room.",
        "For Christmas, the whole family did DNA tests. {a.first} refused “for religious reasons.” Your test reveals a relative nobody knows about. {a.first} is suddenly very warm.",
      ],
    },
    choices: [
      {
        label: { fr: 'Contacter l\'inconnu', en: 'Contact the match' },
        out: [
          { w: 2, text: { fr: ["J'ai envoyé un message. Réponse en dix minutes : « J'ai attendu ce moment toute ma vie. » On a prévu de se rencontrer. {a.first} a avoué une aventure en 1989, la voix tremblante.", "J'ai écrit à l'inconnu. L'inconnu était aussi choqué que moi. On a les mêmes oreilles. {a.first} a dû tout raconter. Repas de famille annulé jusqu'à nouvel ordre."], en: ["I sent a message. Reply in ten minutes: “I've waited for this moment my whole life.” We set up a meeting. {a.first} confessed to a 1989 affair, voice shaking.", "I wrote to the stranger. They were as shocked as I was. We have the same ears. {a.first} had to tell everything. Family dinners cancelled until further notice."] }, fx: { rel: -6, stress: 5, flag: 'f2_dna_halfsib' }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai contacté l'inconnu. {a.first} a pris les devants et tout avoué avant que je finisse ma phrase : un amour de vacances, un été {w:far_place}. On a pleuré tous les deux.", "Message envoyé. Le soir même, {a.my} a sorti une vieille photo d'un tiroir : « Je voulais te le dire depuis 30 ans. » Câlin long et bizarre."], en: ["I contacted the match. {a.first} got ahead of it and confessed before I finished my sentence: a vacation romance, one summer abroad. We both cried.", "Message sent. That evening {a.my} pulled an old photo from a drawer: “I've wanted to tell you for 30 years.” Long, weird hug."] }, fx: { rel: 4, stress: 3, flag: 'f2_dna_halfsib' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Confronter {a.first}', en: 'Confront them' },
        out: [
          { w: 1, text: { fr: ["J'ai posé le résultat sur la table. {a.first} a tout nié, puis accusé le labo, puis Internet, puis {w:celeb}. Puis tout avoué. Il y a un demi-quelqu'un quelque part.", "Confrontation au café. {a.first} a renversé sa tasse, s'est effondré{a:|e} et a raconté une histoire digne d'une telenovela. J'ai besoin d'un verre."], en: ["I put the result on the table. {a.first} denied it all, then blamed the lab, then the internet, then {w:celeb}. Then confessed everything. There's a half-someone out there.", "Confrontation over coffee. {a.first} spilled the cup, broke down and told a story worthy of a telenovela. I need a drink."] }, fx: { rel: -10, stress: 6, flag: 'f2_dna_halfsib' }, mood: 'angry' },
          { w: 1, text: { fr: ["J'ai confronté {a.my}. Grand silence, puis : « C'est une erreur du labo. » Le labo a confirmé. Puis {a.my} a changé de sujet pendant cinq ans.", "{a.my} a juré que c'était un cousin éloigné. Le site affiche « 50 % d'ADN partagé ». Je ne suis pas biologiste, mais bon."], en: ["I confronted {a.my}. Long silence, then: “It's a lab error.” The lab confirmed it wasn't. Then {a.my} changed the subject for five years.", "{a.my} swore it was a distant cousin. The site says “50% shared DNA.” I'm no biologist, but come on."] }, fx: { rel: -6, stress: 4, flag: 'f2_dna_done' } },
        ],
      },
      {
        label: { fr: 'Supprimer le compte', en: 'Delete the account' },
        out: [
          { w: 2, text: { fr: ["J'ai supprimé mon profil. Certaines boîtes ne doivent pas être ouvertes. {a.first} m'a fait un câlin sans savoir pourquoi. Je crois qu'{a:il|elle} sait.", "Compte supprimé, résultats brûlés. On a mangé {w:food} et regardé {w:show}. La paix a un prix, et c'est l'ignorance."], en: ["I deleted my profile. Some boxes should stay closed. {a.first} hugged me without knowing why. I think {a:he|she} knows.", "Account deleted, results burned. We ate {w:food} and watched {w:show}. Peace has a price, and it's ignorance."] }, fx: { rel: 4, stress: 2, flag: 'f2_dna_done' } },
          { w: 1, text: { fr: ["J'ai supprimé mon compte. Trop tard : l'inconnu m'a retrouvé{|e} sur {w:app}. Message : « Salut, je crois qu'on a le même père ou la même mère. » Cette personne a mes sourcils.", "J'ai voulu tout effacer, mais l'inconnu avait déjà écrit à toute la famille. Le groupe WhatsApp brûle."], en: ["I deleted my account. Too late: the stranger found me on {w:app}. Message: “Hi, I think we share a parent.” They have my eyebrows.", "I tried to erase everything, but the stranger had already written to the whole family. The group chat is on fire."] }, fx: { stress: 6, flag: 'f2_dna_halfsib' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_dna_halfsib',
    icon: '👥',
    cat: 'family',
    rating: 1,
    actor: { create: { role: 'acquaintance', age: [-12, 12], gender: 'any' } },
    scene: { place: 'park', mood: 'shock', prop: 'coffee' },
    when: { age: [18, 70], flag: 'f2_dna_halfsib' },
    weight: 12,
    once: true,
    text: {
      fr: [
        "Rendez-vous {w:at_place} avec {a.first}, ton demi-{a:frère|sœur} révélé{a:|e} par le test ADN. {a:Il|Elle} arrive. Même nez. Même rire. Même façon bizarre de tenir sa tasse.",
        "{a.first}, ton demi-{a:frère|sœur} biologique, t'attend avec {w:gift} et un album photo de sa vie. {a:Il|Elle} est {w:weird_job} et vit {w:far_place}. Tu as l'impression de te regarder dans un miroir déformant.",
        "Premier contact avec {a.first}, {a:le demi-frère|la demi-sœur} dont tu ignorais l'existence. {a:Il|Elle} commence par : « Alors, c'est toi qui as eu les vacances à la mer ? »",
        "{a.first} débarque pour la première fois. {a:Il|Elle} a ton menton, ton allergie aux chats et apparemment le même goût pour {w:food}. C'est terrifiant et merveilleux.",
      ],
      en: [
        "Meeting {w:at_place} with {a.first}, your half-{a:brother|sister} revealed by the DNA test. {a:He|She} walks in. Same nose. Same laugh. Same weird way of holding a mug.",
        "{a.first}, your biological half-{a:brother|sister}, is waiting with {w:gift} and a photo album of {a:his|her} life. {a:He|She} is {w:weird_job} and lives {w:far_place}. It's like looking into a funhouse mirror.",
        "First contact with {a.first}, the half-sibling you never knew existed. {a:He|She} opens with: “So you're the one who got the beach vacations?”",
        "{a.first} shows up for the first time. {a:He|She} has your chin, your cat allergy and apparently the same taste for {w:food}. It's terrifying and wonderful.",
      ],
    },
    choices: [
      {
        label: { fr: 'Accueillir dans la famille', en: 'Welcome to the family' },
        out: [
          { w: 2, text: { fr: ["J'ai serré {a.first} dans mes bras. On a parlé six heures. J'ai un{a:|e} demi-{a:frère|sœur} et un nouveau meilleur allié pour les repas de famille.", "Accueil chaleureux. {a.first} est venu{a:|e} au repas de Noël. Mes parents ont fait une tête… mais à la fin, tout le monde dansait."], en: ["I hugged {a.first}. We talked for six hours. I have a half-{a:brother|sister} and a new best ally for family dinners.", "Warm welcome. {a.first} came to Christmas dinner. My parents' faces… but by the end, everyone was dancing."] }, fx: { actorRole: 'sibling', rel: 30, happy: 8, unflag: 'f2_dna_halfsib', flag: 'f2_dna_done' }, mood: 'love' },
          { w: 1, text: { fr: ["Je l'ai intégré{a:|e} à la famille. {a.first} a immédiatement réclamé sa part d'héritage. Avec un avocat. Le rêve s'est un peu terni.", "Bienvenue dans la famille ! Une semaine plus tard, {a.first} dormait sur mon canapé « en attendant ». J'ai maintenant deux frères et sœurs parasites."], en: ["I brought {a:him|her} into the family. {a.first} immediately demanded a share of the inheritance. With a lawyer. The dream lost some shine.", "Welcome to the family! A week later {a.first} was sleeping on my couch “for now.” I now have two freeloading siblings."] }, fx: { actorRole: 'sibling', rel: 15, stress: 5, unflag: 'f2_dna_halfsib', flag: 'f2_dna_done' } },
        ],
      },
      {
        label: { fr: 'Rester prudent', en: 'Keep some distance' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["On a échangé nos numéros. Un message de temps en temps, une carte d'anniversaire. C'est doux, sans pression. Une famille de plus, à petite dose.", "Je suis resté{|e} prudent{|e}. On se voit deux fois par an {w:at_place}. Ça nous va bien."], en: ["We swapped numbers. A text now and then, a birthday card. Sweet, no pressure. Extra family, in small doses.", "I kept it careful. We meet twice a year {w:at_place}. Suits us fine."] }, fx: { actorRole: 'friend', rel: 10, happy: 3, unflag: 'f2_dna_halfsib', flag: 'f2_dna_done' } },
          { w: 1, text: { fr: ["J'ai été trop distant{|e}. {a.first} l'a mal pris et m'a écrit une lettre de six pages sur « l'abandon ». Je ne l'avais pas abandonné{a:|e}, je ne {a:le|la} connaissais même pas.", "Ma prudence a été vue comme du rejet. {a.first} a coupé les ponts. Je pense à {a:lui|elle} chaque fois que je me vois dans un miroir."], en: ["I was too distant. {a.first} took it badly and wrote me a six-page letter about “abandonment.” I didn't abandon {a:him|her}, I didn't know {a:him|her}.", "My caution came across as rejection. {a.first} cut ties. I think of {a:him|her} every time I look in a mirror."] }, fx: { happy: -4, unflag: 'f2_dna_halfsib', flag: 'f2_dna_done' }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Comparer les parents', en: 'Compare notes on the parent' },
        out: [
          { w: 1, text: { fr: ["On a comparé nos souvenirs du parent commun. Même manie de chanter faux sous la douche, même allergie au rangement. On a ri pendant des heures. Lien instantané.", "On a fait la liste des défauts hérités. Elle fait deux pages. On a décidé de fonder un club de soutien."], en: ["We compared memories of our shared parent. Same habit of singing off-key in the shower, same allergy to tidying. We laughed for hours. Instant bond.", "We listed our inherited flaws. Two pages long. We decided to start a support group."] }, fx: { actorRole: 'sibling', rel: 20, happy: 5, unflag: 'f2_dna_halfsib', flag: 'f2_dna_done' }, mood: 'happy' },
          { w: 1, text: { fr: ["La comparaison a mal tourné : {a.first} a eu les vacances au ski, moi les colonies pourries. On s'est disputés sur qui avait eu « la meilleure version » du parent.", "Comparaison amère : {a.first} a reçu une voiture à 18 ans. Moi, un vélo. D'occasion. Sans selle."], en: ["The comparison went badly: {a.first} got ski trips, I got crappy summer camps. We argued over who got “the better version” of the parent.", "Bitter comparison: {a.first} got a car at 18. I got a bike. Secondhand. No seat."] }, fx: { rel: 5, happy: -4, unflag: 'f2_dna_halfsib', flag: 'f2_dna_done' }, mood: 'angry' },
        ],
      },
    ],
  },
  {
    id: 'f2_dna_not_dad',
    icon: '🧪',
    cat: 'family',
    rating: 2,
    actor: 'father',
    scene: { place: 'home', mood: 'shock', prop: 'envelope' },
    when: { age: [18, 60], has: 'father', noFlag: 'f2_dna_done' },
    weight: 3,
    once: true,
    text: {
      fr: [
        "Résultat de ton test ADN : 0 % de correspondance avec {a.rel}. Ton vrai père biologique serait {w:weird_job} qui vit {w:far_place}. {a.first} lit par-dessus ton épaule et dit : « Je m'en doutais, tu n'as jamais aimé le foot. »",
        "Le labo est formel : {a.first} n'est pas ton père biologique. Ta mère, interrogée, avoue « un week-end au camping de Palavas en [[1989|1991|1994]] » et un moniteur de planche à voile nommé Rodrigue.",
        "Test ADN reçu. Il y a une erreur : {a.first} n'est pas ton père. Ce n'est pas une erreur. Le vrai s'appelle Gérard, il est {w:weird_job} et il a 14 autres enfants biologiques. C'était un « donneur très généreux ».",
        "{a.rel} t'appelle en pleurs : {a:il|elle} a fait un test ADN en cachette avec ta brosse à dents. Tu n'es pas son enfant biologique. Puis {a:il|elle} ajoute : « Mais tu restes mon enfant, abruti. »",
      ],
      en: [
        "Your DNA results: 0% match with {a.first}. Your biological father is apparently {w:weird_job} living {w:far_place}. {a.first} reads over your shoulder and says: “I knew it, you never liked football.”",
        "The lab is clear: {a.first} is not your biological father. Your mother, questioned, admits to “a weekend at a campsite in [[1989|1991|1994]]” and a windsurfing instructor named Rodrigo.",
        "DNA test results. There's a mistake: {a.first} isn't your father. It's not a mistake. The real one is Gérard, {w:weird_job}, with 14 other biological kids. He was “a very generous donor.”",
        "{a.first} calls you in tears: {a:he|she} did a secret DNA test with your toothbrush. You're not {a:his|her} biological child. Then {a:he|she} adds: “But you're still my kid, you idiot.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Papa reste papa', en: 'Dad is still dad' },
        out: [
          { w: 2, text: { fr: ["J'ai serré {a.my} dans mes bras : « Tu es mon père. Point. » Il a pleuré dans mon cou et m'a mis de la morve sur l'épaule. Le plus beau moment de notre vie.", "« L'ADN, je m'en fous. » {a.first} a sorti une bouteille qu'il gardait « pour une grande occasion ». On s'est bourré la gueule ensemble. Père et enfant, pour toujours."], en: ["I hugged {a.my}: “You're my dad. Period.” He cried into my neck and got snot on my shoulder. The best moment of our lives.", "“I don't care about DNA.” {a.first} pulled out a bottle he'd saved “for a special occasion.” We got wasted together. Father and child, forever."] }, fx: { rel: 25, happy: 8, karma: 5, flag: 'f2_dna_done' }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai dit que {a.my} restait mon père. Il a hoché la tête, puis demandé si le vrai pouvait payer une partie de mes études, « rétroactivement ». On rigole. Il ne rigole pas.", "On a décidé que rien ne changeait. Mais au barbecue, {a.my} me regarde parfois en plissant les yeux, en cherchant une ressemblance avec un moniteur de planche."], en: ["I said {a.my} is still my dad. He nodded, then asked whether the real one could cover part of my tuition “retroactively.” We laughed. He wasn't laughing.", "We decided nothing changes. But at barbecues, {a.my} sometimes squints at me, looking for a resemblance to a windsurfing instructor."] }, fx: { rel: 10, happy: 2, flag: 'f2_dna_done' } },
        ],
      },
      {
        label: { fr: 'Rencontrer le vrai', en: 'Meet the bio dad' },
        out: [
          { w: 1, text: { fr: ["J'ai rencontré mon géniteur. Il a mes oreilles, mon rire et 14 autres enfants qui étaient tous là, par hasard. On a fait un barbecue géant. {a.first} est venu aussi. Ambiance très étrange mais saucisses excellentes.", "J'ai retrouvé mon père biologique. Il m'a serré la main et m'a proposé de rejoindre son « business ». C'était une pyramide de compléments alimentaires."], en: ["I met my biological father. He has my ears, my laugh and 14 other kids who all happened to be there. Giant barbecue. {a.first} came too. Very strange atmosphere, excellent sausages.", "I found my biological father. He shook my hand and offered me a spot in his “business.” It was a supplement pyramid scheme."] }, fx: { happy: 4, rel: -6, stress: 4, flag: 'f2_dna_done' }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai rencontré le vrai. Il était en caleçon léopard, a pété en me disant bonjour et m'a demandé 200 €. J'ai serré {a.my} dans mes bras en rentrant. Très fort.", "Rendez-vous avec mon géniteur : il a vomi dans un pot de fleurs au bout de trois bières et m'a appelé par le mauvais prénom. Je suis rentré{|e} chez mon vrai père."], en: ["I met the real one. He was in leopard boxers, farted while saying hello and asked me for $200. I hugged {a.my} very tight when I got home.", "Meeting my sperm donor: he puked in a flowerpot after three beers and called me by the wrong name. I went home to my real dad."] }, fx: { rel: 15, happy: -2, money: -200, flag: 'f2_dna_done' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Exiger des comptes', en: 'Demand answers' },
        out: [
          { w: 1, text: { fr: ["J'ai réuni mes parents pour un interrogatoire. Ma mère a tout avoué. {a.first} a ri : « Je le savais depuis le début, j'ai fait le test en 1998. » Tout le monde savait, sauf moi.", "Grande explication familiale. Révélation bonus : {a.my} non plus n'est pas le fils biologique de son père. C'est une tradition familiale."], en: ["I gathered my parents for an interrogation. Mom confessed everything. {a.first} laughed: “I've known all along, I took the test in 1998.” Everyone knew except me.", "Big family showdown. Bonus revelation: {a.my} isn't his own father's biological son either. It's a family tradition."] }, fx: { rel: 4, stress: 6, flag: 'f2_dna_done' }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai exigé des explications. Le repas a fini en bataille de purée. Ma mère a fondu en larmes, {a.my} a cassé une assiette, et le chien a mangé le rôti dans la confusion.", "Mes questions ont déclenché une guerre. {a.first} dort à l'hôtel depuis une semaine. Je me sens à la fois coupable et légitime."], en: ["I demanded explanations. Dinner ended in a mashed-potato fight. Mom burst into tears, {a.my} broke a plate, and the dog ate the roast in the chaos.", "My questions started a war. {a.first} has been sleeping in a hotel for a week. I feel guilty and justified at the same time."] }, fx: { rel: -12, stress: 8, flag: 'f2_dna_done' }, mood: 'angry' },
        ],
      },
    ],
  },
  {
    id: 'f2_secret_uncle',
    icon: '🕵️',
    cat: 'family',
    rating: 1,
    actor: 'parent',
    scene: { place: 'home', mood: 'shock', prop: 'photo' },
    when: { age: [12, 55], has: 'parent' },
    weight: 5,
    once: true,
    text: {
      fr: [
        "En fouillant le grenier, tu trouves une photo de famille où un visage a été découpé aux ciseaux. {a.first} soupire : « C'est ton oncle Bernard. On n'en parle pas. » Puis {a:il|elle} en parle pendant deux heures.",
        "Un homme sonne à la porte : « Bonjour, je suis l'oncle Michel. » {a.first} lui claque la porte au nez et te dit : « Tu n'as pas d'oncle Michel. » Il re-sonne avec {w:gift}.",
        "{a.first}, après avoir descendu {w:drink} puis un deuxième, laisse échapper : « Si ton oncle n'était pas en prison, il serait là ce soir. » Toute la table se fige. Tu n'as jamais entendu parler d'un oncle.",
        "Tu découvres l'existence d'un oncle caché qui vit {w:far_place} et qui a été rayé de la famille en 1993 après une sombre histoire avec {w:animal} et le maire du village.",
      ],
      en: [
        "Digging through the attic, you find a family photo with one face cut out. {a.first} sighs: “That's your uncle Bernard. We don't talk about him.” Then talks about him for two hours.",
        "A man rings the doorbell: “Hello, I'm uncle Michel.” {a.first} slams the door in his face and tells you: “You don't have an uncle Michel.” He rings again, holding {w:gift}.",
        "After two glasses of {w:drink}, {a.first} lets slip: “If your uncle weren't in prison, he'd be here tonight.” The table freezes. You've never heard of any uncle.",
        "You discover a hidden uncle who lives {w:far_place} and was cut off from the family in 1993 after a murky incident involving {w:animal} and the village mayor.",
      ],
    },
    choices: [
      {
        label: { fr: 'Enquêter', en: 'Investigate' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai enquêté et retrouvé l'oncle. Il est charmant, un peu escroc, et il connaît des secrets sur {a.my} que je n'aurais pas dû entendre. On se voit en cachette.", "Enquête bouclée : l'oncle avait volé {w:object} lors d'un mariage en 1993. C'est tout. Trente ans de silence pour ça. Je l'ai invité à Noël."], en: ["I investigated and found the uncle. He's charming, a bit of a crook, and knows secrets about {a.my} I shouldn't have heard. We meet in secret.", "Case closed: the uncle stole {w:object} at a wedding in 1993. That's all. Thirty years of silence for that. I invited him for Christmas."] }, fx: { happy: 5, smarts: 2, rel: -3 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai cherché l'oncle. Il m'a emprunté 500 € dans les cinq premières minutes. Je comprends maintenant pourquoi la famille l'a effacé.", "J'ai retrouvé l'oncle. Il m'a raconté sa version. Elle contredit totalement celle de {a.my}. Je ne sais plus qui croire."], en: ["I tracked down the uncle. He borrowed $500 in the first five minutes. I now understand why the family erased him.", "I found the uncle. He told me his version. It totally contradicts {a.my}'s. I don't know who to believe."] }, fx: { money: -500, happy: -3, stress: 3 } },
        ],
      },
      {
        label: { fr: 'Laisser tomber', en: 'Let it go' },
        out: [
          { w: 2, text: { fr: ["J'ai respecté le silence familial. Certaines histoires sont mieux enterrées. {a.first} m'a remercié{|e} d'un regard. On a parlé d'autre chose.", "J'ai laissé tomber. Mais je regarde la photo découpée chaque fois que je passe au grenier, en imaginant le pire."], en: ["I respected the family silence. Some stories are better buried. {a.first} thanked me with a look. We talked about something else.", "I let it go. But I look at the cut-up photo every time I'm in the attic, imagining the worst."] }, fx: { rel: 4 } },
          { w: 1, text: { fr: ["J'ai laissé tomber, mais l'oncle, lui, n'a pas lâché : il a débarqué au mariage de ma cousine avec un mariachi. Retour fracassant.", "J'ai tourné la page. L'oncle aussi : il est mort deux ans plus tard en léguant sa fortune… à moi, « le seul qui ne m'a jamais insulté ». {a.first} est furieux{a:|se}."], en: ["I let it go, but the uncle didn't: he crashed my cousin's wedding with a mariachi band. Spectacular comeback.", "I moved on. So did the uncle: he died two years later and left his fortune… to me, “the only one who never insulted me.” {a.first} is furious."] }, fx: { happy: 4, money: 3000, rel: -4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Exiger la vérité', en: 'Demand the truth' },
        out: [
          { w: 1, text: { fr: ["J'ai exigé la vérité. {a.first} a craqué : l'oncle avait épousé l'ex de la famille, vendu la maison de mémé et fui avec un cirque. Je veux un film.", "La vérité est sortie : l'oncle est en fait le grand amour de jeunesse de {a.my}, pas son frère. Personne n'a jamais dit qu'il était l'oncle. J'ai mal à la tête."], en: ["I demanded the truth. {a.first} cracked: the uncle had married someone's ex, sold great-grandma's house and run off with a circus. I want a movie.", "The truth came out: the “uncle” was actually {a.my}'s great teenage love, not a brother. Nobody ever said he was an uncle. My head hurts."] }, fx: { stress: 4, smarts: 1 }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai insisté. {a.first} s'est fermé{a:|e} comme une huître et m'a interdit de remonter au grenier. J'ai désormais deux mystères au lieu d'un.", "J'ai exigé des réponses. {a.first} a dit : « Quand tu seras grand{|e}. » J'ai {age} ans."], en: ["I pushed. {a.first} shut down like an oyster and banned me from the attic. Now I have two mysteries instead of one.", "I demanded answers. {a.first} said: “When you're older.” I'm {age}."] }, fx: { rel: -5, stress: 3 } },
        ],
      },
    ],
  },
  {
    id: 'f2_secret_found_at',
    icon: '🥚',
    cat: 'family',
    rating: 0,
    actor: 'parent',
    scene: { place: 'home', mood: 'shock', prop: 'cabbage' },
    when: { age: [5, 13], has: 'parent' },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "Tu demandes à {a.rel} d'où viennent les bébés. {a:Il|Elle} répond, très sérieusement : « Toi, on t'a trouvé{|e} {w:at_place}, dans un carton, avec {w:object} pour seul doudou. » Tu ne sais pas si c'est une blague.",
        "{a.first} t'explique que tu as été « livré{|e} par erreur » par {w:brand}. « On a voulu te renvoyer, mais le délai de rétractation était passé. »",
        "Ton copain dit qu'il a été trouvé dans un chou. Tu demandes à {a.first}. {a:Il|Elle} hésite, puis dit : « Toi, c'était dans {w:food}. Un gros. »",
        "Pendant le dîner, {a.rel} lâche : « Tu sais que tu as été échangé{|e} à la maternité ? On voulait {w:animal}, on t'a eu{|e} toi. » Tout le monde rit, sauf toi.",
      ],
      en: [
        "You ask {a.first} where babies come from. {a:He|She} answers, dead serious: “We found you {w:at_place}, in a box, with {w:object} as your only teddy.” You can't tell if it's a joke.",
        "{a.first} explains you were “delivered by mistake” by {w:brand}. “We tried to send you back, but the return window had closed.”",
        "Your friend says he was found in a cabbage patch. You ask {a.first}. {a:He|She} hesitates, then says: “You were found in {w:food}. A big one.”",
        "At dinner, {a.first} drops: “You know you were swapped at the hospital? We ordered {w:animal}, we got you.” Everyone laughs except you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Pleurer', en: 'Cry' },
        out: [
          { w: 2, text: { fr: ["J'ai pleuré. {a.first} s'est senti{a:|e} tellement coupable qu'{a:il|elle} m'a sorti l'album de naissance et acheté une glace. Ça valait le coup de pleurer.", "J'ai fondu en larmes. {a.first} a juré que c'était une blague et m'a raconté ma vraie naissance. C'était beaucoup moins drôle, et plus dégoûtant."], en: ["I cried. {a.first} felt so guilty {a:he|she} brought out my baby album and bought me ice cream. Totally worth crying.", "I burst into tears. {a.first} swore it was a joke and told me about my real birth. It was much less funny, and grosser."] }, fx: { rel: 4, happy: 2 } },
          { w: 1, text: { fr: ["J'ai pleuré. {a.first} a insisté : « Mais c'est vrai, on a même gardé le carton. » {a:Il|Elle} m'a montré un carton. J'ai des doutes depuis.", "Mes larmes n'ont rien changé : toute la famille s'y est mise, chacun avec sa version. Je viendrais d'un chou, d'un œuf ou d'un colis."], en: ["I cried. {a.first} insisted: “But it's true, we even kept the box.” {a:He|She} showed me a box. I've had doubts ever since.", "My tears changed nothing: the whole family joined in, each with a different version. I came from a cabbage, an egg or a package."] }, fx: { happy: -4, stress: 3 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Retourner la blague', en: 'Turn the joke around' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai répondu : « Ah. Alors je vais chercher mes vrais parents. Ils sont sûrement riches. » J'ai fait ma valise. {a.first} a paniqué et a tout avoué en riant.", "« Super, alors je ne suis pas obligé{|e} de vous obéir. » Logique imparable. {a.first} a mis dix minutes à trouver une réponse."], en: ["I replied: “Oh. Then I'll go find my real parents. They're probably rich.” I packed a bag. {a.first} panicked and confessed, laughing.", "“Great, so I don't have to obey you.” Flawless logic. {a.first} took ten minutes to find a comeback."] }, fx: { smarts: 3, happy: 4, rel: 3 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai annoncé à toute l'école que j'avais été trouvé{|e} {w:at_place}. La maîtresse a appelé les services sociaux. {a.first} a passé un après-midi très long à s'expliquer.", "J'ai répété la blague à la maîtresse, en pleurant. Convocation des parents. {a.first} ne fait plus de blagues."], en: ["I told the whole school I'd been found {w:at_place}. The teacher called child services. {a.first} spent a very long afternoon explaining.", "I repeated the joke to my teacher, crying. Parents summoned. {a.first} doesn't make jokes anymore."] }, fx: { happy: 2, rel: -3 } },
        ],
      },
      {
        label: { fr: 'Vérifier les preuves', en: 'Check the evidence' },
        out: [
          { w: 1, text: { fr: ["J'ai fouillé les tiroirs et trouvé mon bracelet de naissance et une photo de moi, tout rouge et fripé, dans les bras de {a.my}. Rassuré{|e}. Un peu dégoûté{|e} par la photo.", "J'ai mené l'enquête : j'ai la même tache de naissance que {a.my}. Dossier classé. {a:Il|Elle} était impressionné{a:|e} par mon sérieux."], en: ["I searched the drawers and found my hospital bracelet and a photo of me, red and wrinkly, in {a.my}'s arms. Reassured. A little grossed out by the photo.", "I investigated: I have the same birthmark as {a.my}. Case closed. {a:He|She} was impressed by my thoroughness."] }, fx: { smarts: 2, rel: 5 } },
          { w: 1, text: { fr: ["En fouillant, je suis tombé{|e} sur les cadeaux de Noël cachés. J'ai oublié la question de mes origines. Ce fut un Noël sans surprise.", "J'ai fouillé partout et trouvé… le vrai carton. Avec mon nom dessus. {a.first} a expliqué que c'était celui du berceau. Je n'ai pas totalement cru."], en: ["Digging around, I found the hidden Christmas presents. I forgot all about my origins. It was a surprise-free Christmas.", "I searched everywhere and found… the actual box. With my name on it. {a.first} explained it was the crib's box. I'm not fully convinced."] }, fx: { happy: 1, stress: 2 } },
        ],
      },
    ],
  },
  // ───────────────────────────── the family group chat ─────────────────────────────
  {
    id: 'f2_chat_wrong_group',
    icon: '📲',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    scene: { place: 'apartment', mood: 'shock', prop: 'phone' },
    when: { age: [18, 60], has: 'parent' },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "Tu viens d'envoyer une photo très, très osée de toi en sous-vêtements, censée aller à ton crush. Destinataire réel : le groupe WhatsApp « Famille ❤️ ». {a.first} est en train d'écrire…",
        "Message vocal envoyé par erreur au groupe familial : 40 secondes où tu décris en détail ce que tu comptes faire ce soir avec quelqu'un, et à quel endroit. {a.first} a réagi avec un 😳.",
        "Tu as envoyé « J'ai trop hâte de te sentir contre moi ce soir 🍆💦 » au groupe « Les {last} » au lieu de ta conversation privée. {a.first} répond : « Qui ça ? »",
        "Capture d'écran envoyée par erreur au groupe familial : ton historique de recherche. On y lit « {w:celeb} sans vêtements », « comment cacher une gueule de bois à sa famille » et « {w:food} aphrodisiaque ».",
      ],
      en: [
        "You just sent a very, very racy photo of yourself in underwear, meant for your crush. Actual recipient: the family group chat “Family ❤️.” {a.first} is typing…",
        "Voice memo sent by mistake to the family group: 40 seconds describing in detail what you plan to do tonight with someone, and where. {a.first} reacted with 😳.",
        "You sent “Can't wait to feel you against me tonight 🍆💦” to the “{last} Family” group instead of your private chat. {a.first} replies: “Who?”",
        "Screenshot sent by mistake to the family group: your search history. It reads “{w:celeb} naked,” “how to hide a hangover from family” and “{w:food} aphrodisiac.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Supprimer pour tous', en: 'Delete for everyone' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai supprimé en 4 secondes. Record mondial. Personne n'a rien vu, sauf {a.my}, qui m'a envoyé en privé : « Mets un pull, tu vas attraper froid. »", "Suppression éclair. Seule mamie avait ouvert, mais elle n'avait pas ses lunettes. Elle a répondu : « Joli paysage ! »"], en: ["Deleted in 4 seconds. World record. Nobody saw it except {a.my}, who messaged me privately: “Put on a sweater, you'll catch a cold.”", "Lightning deletion. Only grandma had opened it, but she didn't have her glasses. She replied: “Lovely landscape!”"] }, fx: { happy: 2, stress: -2 } },
          { w: 1, text: { fr: ["Trop tard : quelqu'un a fait une capture d'écran. Elle circule maintenant dans la branche des cousins. Mon oncle a commenté « 🔥 ». Je veux changer de famille.", "J'ai supprimé, mais la notification avait déjà été lue par 14 personnes. Au repas de dimanche, personne ne m'a regardé{|e} dans les yeux. Sauf tonton, trop."], en: ["Too late: someone screenshotted it. It's now circulating among the cousins. My uncle commented “🔥.” I want a new family.", "I deleted it, but 14 people had already read the notification. At Sunday lunch, nobody looked me in the eye. Except my uncle, too much."] }, fx: { happy: -8, stress: 8 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Dire « piraté{|e} »', en: 'Claim I got hacked' },
        out: [
          { w: 1, text: { fr: ["J'ai écrit « J'AI ÉTÉ PIRATÉ{|E} ». {a.first} a répondu : « Le pirate a ton tatouage de dauphin sur la fesse ? » Échec et mat.", "« Désolé{|e}, mon téléphone a été volé ! » Puis j'ai envoyé un « lol » depuis le même téléphone. Génie du crime."], en: ["I wrote “I GOT HACKED.” {a.first} replied: “Does the hacker have your dolphin tattoo on the butt?” Checkmate.", "“Sorry, my phone got stolen!” Then I sent “lol” from the same phone. Criminal mastermind."] }, fx: { happy: -5, rel: -2 } },
          { w: 1, text: { fr: ["J'ai prétendu avoir été piraté{|e}. Toute la famille a changé ses mots de passe, sauf mamie qui a envoyé le sien dans le groupe. On a tous oublié ma photo.", "Mon excuse de piratage a marché : {a.my} a lancé une alerte sécurité et toute la famille s'est concentrée sur les « hackers russes ». Sauvé{|e}."], en: ["I claimed I got hacked. The whole family changed their passwords, except grandma, who posted hers in the group. Everyone forgot my photo.", "My hacking excuse worked: {a.my} sounded a security alert and the whole family focused on “Russian hackers.” Saved."] }, fx: { happy: 3, karma: -2 } },
        ],
      },
      {
        label: { fr: 'Assumer avec un mème', en: 'Own it with a meme' },
        out: [
          { w: 1, text: { fr: ["J'ai envoyé un GIF où {w:celeb} hausse les épaules. Fou rire collectif. {a.first} a renommé le groupe « Famille ❤️ (et {first} 🔥) ».", "J'ai assumé avec humour. Mon cousin a enchaîné avec une photo encore pire. Le groupe est devenu un concours. Il a été supprimé par l'administrateur, {a.my}."], en: ["I sent a GIF of {w:celeb} shrugging. Collective laughter. {a.first} renamed the group “Family ❤️ (and {first} 🔥).”", "I owned it with humor. My cousin followed up with an even worse photo. The group turned into a contest. It was deleted by the admin, {a.my}."] }, fx: { happy: 5, rel: 3 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai voulu en rire. {a.first} a répondu par un pavé de 400 mots sur « la décence » et a quitté le groupe. Puis est revenu{a:|e} pour ajouter « Et mets un pull. »", "Mon mème n'a pas aidé. Mamie a demandé ce que voulait dire 🍆. Personne n'a osé répondre. Elle a cherché sur Google, devant tout le monde, à la fête des voisins."], en: ["I tried to laugh it off. {a.first} replied with a 400-word essay on “decency” and left the group. Then came back to add “And put on a sweater.”", "My meme didn't help. Grandma asked what 🍆 means. Nobody dared answer. She googled it, in front of everyone, at the block party."] }, fx: { rel: -6, stress: 4 } },
        ],
      },
    ],
  },
  {
    id: 'f2_chat_gifs',
    icon: '🌞',
    cat: 'family',
    rating: 0,
    actor: 'parent',
    scene: { place: 'apartment', mood: 'neutral', prop: 'phone' },
    when: { age: [16, 70], has: 'parent' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Chaque matin à 6 h 02, {a.rel} envoie dans le groupe familial une image scintillante « Bonne journée ! » avec {w:animal} et une rose en 3D. Ce matin, c'était une vidéo qui joue {w:song}.",
        "{a.first} a découvert les stickers. Ton téléphone a vibré 87 fois pendant ta réunion. Tous des chatons qui dansent. Un seul message avait du texte : « Tu as mangé ? »",
        "{a.first} partage dans le groupe une fausse info du genre « Attention, {w:food} donne le cancer, partagez à 10 personnes ». Ta cousine répond par « Source ? ». La guerre commence.",
        "Le groupe « Famille » compte 412 messages non lus. Tu ouvres. C'est {a.first} qui a envoyé 300 photos floues prises {w:at_place}, sujet unique : {w:object}, une par une, avec « regardez ! » à chaque fois.",
      ],
      en: [
        "Every morning at 6:02, {a.first} posts a glittery “Have a great day!” image in the family group, with {w:animal} and a 3D rose. This morning it was a video that plays {w:song}.",
        "{a.first} discovered stickers. Your phone buzzed 87 times during your meeting. All dancing kittens. Only one message had text: “Did you eat?”",
        "{a.first} shares fake news in the group like “Warning, {w:food} causes cancer, share with 10 people.” Your cousin replies “Source?” The war begins.",
        "The “Family” group has 412 unread messages. You open it. It's {a.first}, who sent 300 blurry photos of {w:object} {w:at_place}, one by one, with “look!” each time.",
      ],
    },
    choices: [
      {
        label: { fr: 'Mettre en sourdine', en: 'Mute the group' },
        out: [
          { w: 2, text: { fr: ["Groupe en sourdine pour un an. La paix. Je l'ouvre le dimanche, avec un café, comme on lit le journal. C'est presque agréable.", "Silence total. J'ai raté une info importante : tonton s'est marié. Personne n'a remarqué mon absence."], en: ["Group muted for a year. Peace. I open it on Sundays with coffee, like reading the paper. Almost pleasant.", "Total silence. I missed one important update: my uncle got married. Nobody noticed I wasn't there."] }, fx: { stress: -4, happy: 2 } },
          { w: 1, text: { fr: ["J'ai mis en sourdine. {a.first} a remarqué que je ne réagissais plus et a appelé la police pour « vérifier que je suis vivant{|e} ». Les gendarmes ont vu mes 412 messages non lus.", "Sourdine activée. {a.first} a créé un deuxième groupe, juste avec moi, appelé « Pour être sûr{a:|e} que tu lises »."], en: ["I muted it. {a.first} noticed I wasn't reacting anymore and called the police to “check I'm alive.” The officers saw my 412 unread messages.", "Mute on. {a.first} created a second group, just with me, called “To make sure you read.”"] }, fx: { rel: -3, stress: 2 } },
        ],
      },
      {
        label: { fr: 'Répondre en GIF', en: 'Reply with GIFs' },
        out: [
          { w: 2, text: { fr: ["J'ai répondu avec un GIF encore plus kitsch. {a.first} était aux anges. C'est notre langage maintenant : des chatons et des roses scintillantes.", "Duel de GIFs avec {a.my}. Toute la famille s'y est mise. Le groupe est un feu d'artifice de mauvais goût. Je n'ai jamais été aussi proche de {a.my}."], en: ["I replied with an even tackier GIF. {a.first} was over the moon. It's our language now: kittens and glittery roses.", "GIF duel with {a.my}. The whole family joined. The group is a fireworks show of bad taste. I've never been closer to {a.my}."] }, fx: { rel: 8, happy: 3 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai envoyé un GIF un peu limite par erreur. Un chaton qui fait un doigt. {a.first} l'a adopté et l'envoie maintenant à tout le monde, y compris au curé.", "Mon GIF a été mal interprété : {a.my} a cru que je me moquais. Réponse : « Je ne suis pas si {a:vieux|vieille} que ça. » Puis 14 stickers de chiens tristes."], en: ["I accidentally sent a slightly edgy GIF. A kitten flipping the bird. {a.first} adopted it and now sends it to everyone, including the priest.", "My GIF was misread: {a.my} thought I was mocking {a:him|her}. Reply: “I'm not THAT old.” Then 14 sad-dog stickers."] }, fx: { happy: 2, rel: -1 } },
        ],
      },
      {
        label: { fr: 'Fact-checker', en: 'Fact-check it' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai envoyé trois sources sérieuses. {a.first} a répondu : « Merci mon cœur, j'ai appris un truc. » Une victoire de la science. Rare.", "J'ai démonté la fausse info avec bienveillance. {a.first} a supprimé son message et m'a demandé de vérifier les prochains avant envoi. Je suis {le modérateur officiel|la modératrice officielle}."], en: ["I posted three solid sources. {a.first} replied: “Thanks sweetheart, I learned something.” A victory for science. Rare.", "I gently debunked the fake news. {a.first} deleted the post and asked me to check the next ones before sending. I'm the official moderator."] }, fx: { smarts: 2, rel: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai fact-checké. {a.first} m'a accusé{|e} d'être « payé{|e} par le système ». Ma tante a pris son parti. Guerre de tranchées jusqu'à Noël.", "J'ai voulu corriger. Le groupe s'est divisé en deux camps. Il existe maintenant « Famille » et « Famille (les vrais) ». Je suis dans aucun des deux."], en: ["I fact-checked. {a.first} accused me of being “paid by the system.” My aunt took {a:his|her} side. Trench warfare until Christmas.", "I tried to correct it. The group split into two camps. There's now “Family” and “Family (the real ones).” I'm in neither."] }, fx: { rel: -6, stress: 4 }, mood: 'angry' },
        ],
      },
    ],
  },
  {
    id: 'f2_chat_conspiracy',
    icon: '🛸',
    cat: 'family',
    rating: 1,
    actor: 'parent',
    scene: { place: 'home', mood: 'angry', prop: 'phone' },
    when: { age: [18, 70], has: 'parent' },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "{a.rel} a découvert YouTube. Depuis, {a:il|elle} est persuadé{a:|e} {w:conspiracy} et le partage dans le groupe familial avec 14 points d'exclamation.",
        "Au repas de dimanche, {a.first} t'explique, la bouche pleine ({w:food}), qu'{a:il|elle} a « fait ses recherches » : il est évident {w:conspiracy}. Ton oncle hoche la tête.",
        "{a.first} a quitté la chorale pour un groupe Facebook de 40 000 membres qui pensent {w:conspiracy}. {a:Il|Elle} veut que tu viennes à la réunion de jeudi {w:at_place}.",
        "{a.rel} t'envoie une vidéo de 3 h 47 intitulée « ILS NE VEULENT PAS QUE TU SACHES », avec ce message : « Regarde jusqu'au bout, après tu comprendras. Gros bisous. »",
      ],
      en: [
        "{a.first} discovered YouTube. Since then {a:he|she}'s convinced {w:conspiracy} and shares it in the family group with 14 exclamation marks.",
        "At Sunday lunch, {a.first} explains, mouth full of {w:food}, that {a:he|she} “did the research”: it's obvious {w:conspiracy}. Your uncle nods along.",
        "{a.first} left the choir for a 40,000-member Facebook group that believes {w:conspiracy}. {a:He|She} wants you at Thursday's meeting {w:at_place}.",
        "{a.first} sends you a 3-hour-47-minute video titled “THEY DON'T WANT YOU TO KNOW,” with this message: “Watch till the end, then you'll understand. Big hugs.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Débattre calmement', en: 'Debate calmly' },
        out: [
          { w: 1, odds: { smarts: 2 }, text: { fr: ["J'ai posé des questions au lieu d'attaquer. Au bout de trois mois, {a.my} a quitté le groupe. {a:Il|Elle} est revenu{a:|e} à la chorale. Victoire lente mais totale.", "Débat calme, arguments solides. {a.first} a fini par dire : « Bon, peut-être que je me suis emballé{a:|e}. » J'ai encadré la phrase."], en: ["I asked questions instead of attacking. After three months {a.my} left the group and went back to the choir. Slow but total victory.", "Calm debate, solid arguments. {a.first} finally said: “Okay, maybe I got carried away.” I framed the sentence."] }, fx: { rel: 6, smarts: 2, karma: 3 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai débattu deux heures. À la fin, {a.my} m'a regardé{|e} avec pitié : « Ils t'ont bien eu{|e}, toi. » Je suis maintenant le mouton de la famille.", "Débat calme ? Pas pour longtemps. Au bout de 20 minutes, on hurlait. Sujet : est-il vrai {w:conspiracy} ? Le chien s'est caché sous la table."], en: ["I debated for two hours. At the end {a.my} looked at me with pity: “They really got you, didn't they.” I'm now the family sheep.", "Calm debate? Not for long. Twenty minutes in we were screaming about whether {w:conspiracy}. The dog hid under the table."] }, fx: { stress: 6, rel: -4 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Surenchérir', en: 'Out-crazy them' },
        out: [
          { w: 1, text: { fr: ["J'ai répondu que, moi, je savais de source sûre {w:conspiracy}. {a.first} a été tellement perturbé{a:|e} par ma théorie qu'{a:il|elle} a remis en question toutes les siennes. Thérapie par l'absurde.", "J'ai inventé une théorie encore plus folle. {a.first} l'a partagée dans son groupe. Elle a 12 000 likes. J'ai créé un monstre."], en: ["I replied that I knew for a fact {w:conspiracy}. {a.first} was so rattled by my theory {a:he|she} questioned all of {a:his|hers}. Therapy by absurdity.", "I made up an even crazier theory. {a.first} shared it in the group. It has 12,000 likes. I've created a monster."] }, fx: { happy: 5, karma: -2 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai surenchéri pour rire. {a.first} m'a pris{|e} au sérieux et m'a présenté{|e} à son groupe comme « un éveillé ». Je suis maintenant {modérateur|modératrice} malgré moi.", "Ma blague a été reprise par un influenceur complotiste. Ma tête est sur une affiche. {a.first} est très fier{a:|e}."], en: ["I played along for laughs. {a.first} took me seriously and introduced me to the group as “an awakened one.” I'm now a moderator against my will.", "My joke got picked up by a conspiracy influencer. My face is on a poster. {a.first} is very proud."] }, fx: { stress: 4, followers: 500 } },
        ],
      },
      {
        label: { fr: 'Couper le Wi-Fi', en: 'Cut their Wi-Fi' },
        out: [
          { w: 1, text: { fr: ["J'ai « accidentellement » débranché la box de {a.my} pendant mes vacances chez {a:lui|elle}. Une semaine sans Internet. {a:Il|Elle} a jardiné, lu un livre et oublié ses théories.", "Box débranchée en douce. {a.first} y a vu la preuve {w:conspiracy}. Ça a confirmé toutes ses craintes. Échec stratégique."], en: ["I “accidentally” unplugged {a.my}'s router during my stay. One week without internet. {a:He|She} gardened, read a book and forgot all the theories.", "Router secretly unplugged. {a.first} thought it was an attack proving {w:conspiracy}. It confirmed every fear. Strategic failure."] }, fx: { rel: 3, karma: -1 } },
          { w: 1, text: { fr: ["J'ai coupé le Wi-Fi. {a.first} est allé{a:|e} regarder les vidéos à la médiathèque, avec le son à fond. Toute la médiathèque est maintenant convaincue.", "{a.my} a découvert le sabotage et m'a accusé{|e} d'être « un agent ». Je ne suis plus invité{|e} aux anniversaires."], en: ["I cut the Wi-Fi. {a.first} went to watch the videos at the library, volume maxed. The whole library is now convinced.", "{a.my} found out about the sabotage and accused me of being “an agent.” I'm no longer invited to birthdays."] }, fx: { rel: -8, stress: 3 } },
        ],
      },
    ],
  },
  {
    id: 'f2_chat_voice_note',
    icon: '🎙️',
    cat: 'family',
    rating: 2,
    actor: 'grandparent',
    scene: { place: 'apartment', mood: 'sick', prop: 'phone', fx: 'poop' },
    when: { age: [14, 60], has: 'grandparent' },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "{a.rel} a envoyé dans le groupe familial un message vocal de 14 minutes. Visiblement enregistré par erreur, aux toilettes. On entend {w:sound}, des grognements, et à la fin : « Allô ? Allô ? Ça marche ce truc ? »",
        "Nouveau vocal de {a.first} : 6 min 30 de froissement de poche, une dispute avec la caissière {w:at_place}, puis un pet monumental et un « oups ». Toute la famille a écouté jusqu'au bout.",
        "{a.first} a envoyé une vidéo au groupe familial. Elle dure 20 minutes et montre l'intérieur de sa narine, en gros plan, pendant qu'{a:il|elle} cherche le bouton pour arrêter.",
        "Vocal de {a.rel}, envoyé à 3 h du matin : on l'entend ronfler, marmonner « {w:celeb} » en dormant et dire des choses très précises sur une nuit de 1974.",
      ],
      en: [
        "{a.first} sent the family group a 14-minute voice memo. Clearly recorded by accident, on the toilet. You hear {w:sound}, grunting, and at the end: “Hello? Hello? Is this thing working?”",
        "New voice memo from {a.first}: 6 min 30 of pocket rustling, an argument with a cashier {w:at_place}, then a monumental fart and an “oops.” The whole family listened to the end.",
        "{a.first} sent a video to the family group. It's 20 minutes long and shows the inside of {a:his|her} nostril, in close-up, while {a:he|she} looks for the stop button.",
        "Voice memo from {a.first}, sent at 3 a.m.: snoring, sleep-talking about {w:celeb}, and very specific details about a night in 1974.",
      ],
    },
    choices: [
      {
        label: { fr: 'Prévenir gentiment', en: 'Gently tell them' },
        out: [
          { w: 2, text: { fr: ["J'ai appelé {a.my} pour lui expliquer. {a:Il|Elle} a ri pendant dix minutes, puis m'a demandé de lui réapprendre à « arrêter le bouton rouge ». Moment précieux.", "Je l'ai prévenu{a:|e} en privé. {a:Il|Elle} était mort{a:|e} de honte, puis a dit : « Bah, au moins ils savent que je suis en vie. » Philosophie."], en: ["I called {a.my} to explain. {a:He|She} laughed for ten minutes, then asked me to re-teach how to “stop the red button.” Precious moment.", "I told {a:him|her} privately. {a:He|She} was mortified, then said: “Well, at least they know I'm alive.” Philosophy."] }, fx: { rel: 8, karma: 2 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai voulu expliquer, mais {a.my} a répondu par un nouveau vocal. Encore aux toilettes. C'est devenu une tradition.", "Je l'ai prévenu{a:|e}. {a:Il|Elle} a supprimé… le groupe entier. Trois ans de photos de famille. Disparus."], en: ["I tried to explain, but {a.my} replied with another voice memo. Also on the toilet. It's a tradition now.", "I told {a:him|her}. {a:He|She} deleted… the entire group. Three years of family photos. Gone."] }, fx: { happy: -3, rel: 2 } },
        ],
      },
      {
        label: { fr: 'En faire un remix', en: 'Make a remix' },
        out: [
          { w: 1, text: { fr: ["J'ai remixé le vocal en morceau techno. « {a:Papi|Mamie} Bass » tourne en boucle à toutes les fêtes de famille. {a.first} danse dessus sans savoir que c'est {a:lui|elle}.", "Mon remix a fait 50 000 écoutes. {a.first} est une star de la techno sans le savoir. Un DJ berlinois veut {a:le|la} rencontrer."], en: ["I remixed the voice memo into a techno track. “Grandparent Bass” plays on loop at every family party. {a.first} dances to it without knowing it's {a:him|her}.", "My remix got 50,000 plays. {a.first} is a techno star without knowing it. A Berlin DJ wants to meet {a:him|her}."] }, fx: { happy: 6, followers: 2000 }, mood: 'party' },
          { w: 1, text: { fr: ["{a.my} a découvert le remix à un mariage. Silence de mort, puis {a:il|elle} a pris le micro : « Le prochain pet sera pour ton héritage. » Rideau.", "Mon remix a été entendu par {a.my}, vexé{a:|e} à vie. Je suis rayé{|e} du testament. Pour un pet."], en: ["{a.my} discovered the remix at a wedding. Dead silence, then {a:he|she} grabbed the mic: “The next fart is going on your inheritance.” Curtain.", "{a.my} heard my remix and is offended for life. I'm out of the will. Over a fart."] }, fx: { rel: -12, happy: 2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Répondre pareil', en: 'Reply in kind' },
        out: [
          { w: 1, text: { fr: ["J'ai répondu par un vocal de moi aux toilettes, avec effets sonores. Toute la famille a suivi. Le groupe est devenu un concert de chasse d'eau. Unité familiale.", "J'ai répondu avec mon propre vocal trash. Mamie et papi ont ri. Mes parents, non. Les cousins ont surenchéri. Le groupe est maintenant interdit aux moins de 18 ans."], en: ["I replied with a voice memo of myself on the toilet, with sound effects. The whole family followed. The group became a flushing concert. Family unity.", "I answered with my own trashy memo. The grandparents laughed. My parents didn't. The cousins escalated. The group is now 18+."] }, fx: { happy: 4, rel: 4 }, mood: 'party' },
          { w: 1, text: { fr: ["Ma réponse s'est retrouvée par erreur dans le groupe du boulot. Mon chef a répondu par un pouce. Je n'ose plus aller aux toilettes au bureau.", "J'ai voulu répondre pareil, mais je me suis trompé{|e} de conversation : c'est mon ex qui a reçu 3 minutes de bruits de digestion. Réponse : « toujours pareil »."], en: ["My reply went to the work group by mistake. My boss replied with a thumbs-up. I can't use the office bathroom anymore.", "I tried to reply in kind but picked the wrong chat: my ex got 3 minutes of digestion noises. They replied “same as always.”"] }, fx: { happy: -5, perf: -3 }, mood: 'shock' },
        ],
      },
    ],
  },
  // ───────────────────────────── family reunions ─────────────────────────────
  {
    id: 'f2_reu_questions',
    icon: '🍗',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    scene: { place: 'park', mood: 'angry', prop: 'bbq' },
    when: { age: [22, 55], has: 'parent' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Grande réunion de famille au barbecue. {a.first} te présente à la cantonade : « Et voilà {first}, toujours pas marié{|e}, toujours pas de gosses, mais en bonne santé, hein. » Tonton Gérard rote.",
        "Réunion de famille. En vingt minutes, on t'a demandé ton salaire, si tu « fais attention à ta ligne » et quand tu vas « enfin faire un enfant ». {a.first} sourit, ravi{a:|e} : ce n'est pas {a:lui|elle} qui a posé les questions, mais c'est tout comme.",
        "Fête des cousins. Tonton Gérard, qui en est à son sixième verre ({w:drink}), te demande devant tout le monde si tu es « toujours avec ce type louche ou t'as changé de bord ». {a.first} fait semblant de chercher la moutarde.",
        "Au buffet de la réunion familiale, ta tante pince ta bouée : « Ça profite, hein ! » {a.first} ajoute : « Faut dire que {first} engloutit {w:food} comme un aspirateur. » Euh, merci. Il est 12 h 15. La journée sera longue.",
      ],
      en: [
        "Big family reunion barbecue. {a.first} introduces you to the crowd: “And here's {first}, still not married, still no kids, but healthy at least.” Uncle Gérard burps.",
        "Family reunion. Within twenty minutes you've been asked your salary, whether you're “watching your weight” and when you'll “finally have a baby.” {a.first} smiles, delighted: {a:he|she} didn't ask, but might as well have.",
        "Cousins' party. Uncle Gérard, wasted on {w:drink}, asks you in front of everyone if you're “still with that shady guy or did you switch teams.” {a.first} pretends to look for the mustard.",
        "At the reunion buffet, your aunt pinches your love handle: “Someone's eating well!” {a.first} adds: “Well, {first} does inhale {w:food}.” Uh, thanks. It's 12:15 p.m. Long day ahead.",
      ],
    },
    choices: [
      {
        label: { fr: 'Mentir en grand', en: 'Lie spectacularly' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai annoncé que j'étais fiancé{|e} à un chirurgien milliardaire qui vit {w:far_place}. Silence admiratif. {a.first} a pleuré de joie. Je vais devoir inventer un mariage maintenant.", "J'ai dit que je gagnais 15 000 € par mois dans la crypto. Tonton Gérard m'a demandé un prêt. Trois cousins aussi. Le mensonge a un coût."], en: ["I announced I'm engaged to a billionaire surgeon who lives {w:far_place}. Admiring silence. {a.first} cried with joy. Now I have to invent a wedding.", "I said I make $15,000 a month in crypto. Uncle Gérard asked me for a loan. So did three cousins. Lies have a cost."] }, fx: { happy: 5, karma: -3, rel: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai menti sur mon salaire. Mon cousin travaille dans la même boîte. Il a éclaté de rire et a dit mon vrai salaire à voix haute, au micro du karaoké.", "Mon mensonge s'est effondré quand {a.my} a demandé à voir une photo du « fiancé ». J'ai montré {w:celeb}. Mamie l'a reconnu."], en: ["I lied about my salary. My cousin works at the same company. He burst out laughing and announced my real salary on the karaoke mic.", "My lie collapsed when {a.my} asked to see a photo of the “fiancé.” I showed {w:celeb}. Grandma recognized them."] }, fx: { happy: -6, rel: -4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Retourner les questions', en: 'Turn the tables' },
        out: [
          { w: 1, text: { fr: ["J'ai demandé à tonton Gérard combien de fois il avait été arrêté pour conduite en état d'ivresse. Puis à ma tante où en était son troisième divorce. Le silence s'est fait. On m'a laissé{|e} tranquille.", "J'ai retourné chaque question avec un sourire. « Et toi, tonton, ta prostate ? » Applaudissements discrets des cousins. {a.first} a failli s'étouffer."], en: ["I asked Uncle Gérard how many times he'd been arrested for drunk driving. Then asked my aunt how her third divorce was going. Silence fell. They left me alone.", "I turned every question around with a smile. “And you, uncle, how's your prostate?” Quiet applause from the cousins. {a.first} nearly choked."] }, fx: { happy: 6, rel: -4 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai retourné les questions. Tonton Gérard a répondu à toutes, en détail, avec des photos sur son téléphone. Dont une de sa prostate. J'ai perdu.", "Mauvaise idée : ma tante a adoré qu'on s'intéresse à elle et m'a raconté son divorce pendant trois heures, en me tenant le poignet."], en: ["I turned the questions around. Uncle Gérard answered all of them, in detail, with photos on his phone. Including one of his prostate. I lost.", "Bad idea: my aunt loved the attention and told me about her divorce for three hours, gripping my wrist."] }, fx: { happy: -4, stress: 5 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Se cacher avec les ados', en: 'Hide with the teens' },
        out: [
          { w: 2, text: { fr: ["Je me suis réfugié{|e} à la table des ados. On a joué sur nos téléphones en silence pendant trois heures. Personne ne m'a posé de question. Le paradis.", "Planqué{|e} derrière le barbecue avec les cousins de 15 ans. Ils m'ont trouvé{|e} « cringe mais ça va ». Je prends."], en: ["I took refuge at the teens' table. We played on our phones in silence for three hours. Nobody asked me anything. Paradise.", "Hid behind the grill with the 15-year-old cousins. They found me “cringe but okay.” I'll take it."] }, fx: { happy: 3, stress: -3 } },
          { w: 1, text: { fr: ["Les ados m'ont démasqué{|e} et m'ont demandé de leur acheter de l'alcool. J'ai refusé. Ils m'ont dénoncé{|e} à {a.my} pour « comportement bizarre ».", "La table des ados m'a rejeté{|e}. J'ai fini à la table des enfants, avec un gobelet en plastique et un clown. Le clown m'a posé des questions sur mon salaire."], en: ["The teens spotted me and asked me to buy them alcohol. I refused. They reported me to {a.my} for “acting weird.”", "The teens' table rejected me. I ended up at the kids' table, with a plastic cup and a clown. The clown asked about my salary."] }, fx: { happy: -3, stress: 3 } },
        ],
      },
    ],
  },
  {
    id: 'f2_reu_charades',
    icon: '🎲',
    cat: 'family',
    rating: 0,
    actor: 'sibling',
    scene: { place: 'home', mood: 'party', prop: 'cards' },
    when: { age: [8, 70], has: 'sibling' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Soirée jeux en famille. Au mime, {a.rel} doit faire deviner {w:movie}. Ça fait huit minutes qu'{a:il|elle} se roule par terre en imitant {w:animal}. Personne ne trouve. Tout le monde pleure de rire.",
        "Pictionary familial. {a.first} dessine un truc qui évoque {w:object} pour faire deviner « liberté ». La dispute commence avant même la fin du sablier.",
        "Partie de Time's Up avec {a.first} en équipe. {a:Il|Elle} ne connaît pas {w:celeb}, mime {w:hobby} comme un pied et accuse ensuite le sablier d'être « truqué ».",
        "Jeu du « Qui suis-je ? ». {a.first} a « {w:celeb} » collé sur le front et pose des questions de plus en plus bizarres : « Est-ce que je sens {w:smell} ? »",
      ],
      en: [
        "Family game night. At charades, {a.first} has to act out {w:movie}. For eight minutes {a:he|she}'s been rolling on the floor imitating {w:animal}. Nobody gets it. Everyone's crying laughing.",
        "Family Pictionary. {a.first} draws what looks like {w:object} to convey “freedom.” The argument starts before the timer runs out.",
        "Playing Time's Up with {a.first} as a teammate. {a:He|She} doesn't know {w:celeb}, mimes {w:hobby} terribly, then accuses the timer of being “rigged.”",
        "“Who am I?” game. {a.first} has “{w:celeb}” stuck to the forehead and asks weirder and weirder questions: “Do I smell like {w:smell}?”",
      ],
    },
    choices: [
      {
        label: { fr: 'Jouer pour gagner', en: 'Play to win' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai trouvé chaque réponse en trois secondes. Victoire écrasante. {a.first} m'a traité{|e} de {tricheur|tricheuse} et a renversé le plateau. Classique.", "On a gagné grâce à moi. J'ai fait un tour d'honneur autour de la table. {a.first} a exigé une revanche jusqu'à 2 h du matin."], en: ["I guessed every answer in three seconds. Crushing victory. {a.first} called me a cheater and flipped the board. Classic.", "We won thanks to me. I did a victory lap around the table. {a.first} demanded rematches until 2 a.m."] }, fx: { happy: 5, rel: -2, smarts: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai joué trop sérieusement. J'ai crié sur ma propre grand-mère parce qu'elle mimait mal. Toute la famille m'a regardé{|e} comme un monstre.", "Mon esprit de compétition a ruiné la soirée. {a.first} a dit « c'est juste un jeu », ce qui m'a rendu{|e} encore plus {fou|folle}."], en: ["I played too seriously. I yelled at my own grandmother for bad miming. The whole family looked at me like a monster.", "My competitive streak ruined the evening. {a.first} said “it's just a game,” which made me even crazier."] }, fx: { rel: -6, stress: 4 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Saboter pour rire', en: 'Sabotage for fun' },
        out: [
          { w: 2, text: { fr: ["J'ai mimé tous mes mots en imitant tonton. Fou rire général, y compris tonton. Personne n'a gagné. Tout le monde a gagné.", "J'ai donné des indices absurdes exprès. {a.first} a rejoint le chaos. La partie est devenue un spectacle d'improvisation. Meilleure soirée de l'année."], en: ["I mimed every word by impersonating our uncle. Everyone in hysterics, uncle included. Nobody won. Everybody won.", "I gave absurd clues on purpose. {a.first} joined the chaos. The game turned into an improv show. Best night of the year."] }, fx: { happy: 7, rel: 8 }, mood: 'party' },
          { w: 1, text: { fr: ["Mon sabotage n'a fait rire que moi. {a.first} a rangé le jeu en silence. La soirée s'est terminée devant {w:show}, sans un mot.", "J'ai saboté. Ma mère a découvert que je trichais depuis 1998 au Monopoly aussi. Procès familial ouvert."], en: ["My sabotage only made me laugh. {a.first} put the game away in silence. The evening ended in front of {w:show}, without a word.", "I sabotaged. My mom discovered I've been cheating at Monopoly since 1998 too. Family trial opened."] }, fx: { rel: -4, happy: -1 } },
        ],
      },
      {
        label: { fr: 'Faire équipe avec {a.first}', en: 'Team up with them' },
        out: [
          { w: 2, text: { fr: ["Équipe imbattable : on se comprend d'un regard depuis l'enfance. On a écrasé tout le monde. {a.first} m'a fait un check comme quand on avait dix ans.", "On a fait équipe. Télépathie fraternelle : {a:il|elle} a trouvé {w:movie} en me voyant juste lever un sourcil. Les autres crient à la triche."], en: ["Unbeatable team: we've understood each other with a look since childhood. We crushed everyone. {a.first} gave me a fist bump like when we were ten.", "We teamed up. Sibling telepathy: {a:he|she} guessed {w:movie} from me just raising an eyebrow. The others cry foul."] }, fx: { rel: 10, happy: 5 }, mood: 'happy' },
          { w: 1, text: { fr: ["On a fait équipe. Ça a viré à la dispute de 1996 sur qui avait cassé la console. Le jeu est resté sur la table. La rancune, elle, est repartie avec nous.", "Équipe catastrophe : on ne s'est compris sur rien. {a.first} a mimé « dauphin », j'ai dit « tonton Gérard ». Il était là."], en: ["We teamed up. It turned into the 1996 argument over who broke the console. The game stayed on the table. The grudge came home with us.", "Disaster team: we understood nothing. {a.first} mimed “dolphin,” I said “Uncle Gérard.” He was right there."] }, fx: { rel: -4, happy: 2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_reu_photo',
    icon: '📸',
    cat: 'family',
    rating: 0,
    actor: 'parent',
    scene: { place: 'park', mood: 'happy', prop: 'camera' },
    when: { age: [5, 60], has: 'parent' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "{a.rel} a réservé un photographe pour LA photo de famille. Tout le monde en chemise blanche, {w:weather}. Tonton cligne des yeux à chaque flash, le chien veut mourir et toi, tu as {w:food} entre les dents.",
        "Photo de famille annuelle. {a.first} hurle des consignes comme un général : « Souriez ! Pas comme ça ! Rentrez le ventre ! » On est à la 87e prise.",
        "{a.first} veut une photo de famille « originale », tous déguisés en {w:animal}. Le photographe pro a déjà l'air de regretter sa carrière.",
        "Séance photo familiale {w:at_place}. {a.first} a tout organisé : tenues assorties, pose pyramide, et toi tout en bas, portant trois cousins sur le dos.",
      ],
      en: [
        "{a.first} booked a photographer for THE family photo. Everyone in white shirts, {w:weather}. Your uncle blinks at every flash, the dog wants to die and you have {w:food} in your teeth.",
        "Annual family photo. {a.first} barks orders like a general: “Smile! Not like that! Suck in your stomachs!” This is take 87.",
        "{a.first} wants an “original” family photo, everyone dressed as {w:animal}. The pro photographer already looks like he regrets his career.",
        "Family photo shoot {w:at_place}. {a.first} organized everything: matching outfits, pyramid pose, and you at the bottom carrying three cousins on your back.",
      ],
    },
    choices: [
      {
        label: { fr: 'Sourire parfait', en: 'Perfect smile' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["J'ai fait mon meilleur sourire. La photo est magnifique, elle trône au-dessus de la cheminée. Seul détail : on voit tonton se curer le nez au fond.", "Photo parfaite. {a.first} l'a fait imprimer sur des mugs, des t-shirts et un plaid. J'ai mon propre visage sur ma couverture."], en: ["I gave my best smile. The photo is gorgeous, hanging above the fireplace. One detail: you can see my uncle picking his nose in the back.", "Perfect photo. {a.first} printed it on mugs, T-shirts and a blanket. My own face is on my blanket now."] }, fx: { happy: 4, rel: 5 }, mood: 'happy' },
          { w: 1, text: { fr: ["Mon « sourire parfait » ressemble à celui d'un tueur en série. {a.first} a gardé cette photo-là. Elle est sur la carte de vœux envoyée à 200 personnes.", "J'ai souri pile au moment où j'éternuais. La photo me montre en pleine explosion. {a.first} trouve ça « authentique »."], en: ["My “perfect smile” looks like a serial killer's. {a.first} picked that photo. It's on the holiday card sent to 200 people.", "I smiled right as I sneezed. The photo shows me mid-explosion. {a.first} thinks it's “authentic.”"] }, fx: { happy: -3, looks: -1 } },
        ],
      },
      {
        label: { fr: 'Faire l\'idiot', en: 'Photobomb it' },
        out: [
          { w: 1, text: { fr: ["J'ai fait des oreilles de lapin à {a.my} sur chaque photo. On n'a aucune photo sérieuse. Mais la meilleure est devenue la photo de profil de toute la famille.", "Grimace sur chaque cliché. {a.first} a d'abord hurlé, puis ri. La photo « ratée » est notre préférée."], en: ["I gave {a.my} bunny ears in every shot. We have no serious photos. But the best one became the whole family's profile picture.", "A face in every shot. {a.first} yelled at first, then laughed. The “ruined” photo is our favorite."] }, fx: { happy: 5, rel: 4 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai fait l'idiot. {a.first} a payé le photographe 400 € et m'a facturé{|e} la séance. Je rembourse en mensualités.", "Mon photobomb a provoqué une chute en cascade de la pyramide familiale. Mamie s'est foulé le poignet. La photo est spectaculaire."], en: ["I acted up. {a.first} paid the photographer $400 and billed me for the session. I'm paying it back in installments.", "My photobomb caused a domino collapse of the family pyramid. Grandma sprained her wrist. The photo is spectacular."] }, fx: { money: -100, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Prendre le contrôle', en: 'Take over as director' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai pris les choses en main : placement, lumière, blague au bon moment. Photo réussie en deux prises. {a.first} m'a officiellement nommé{|e} photographe de la famille. À vie.", "J'ai dirigé la séance. On a fini en 10 minutes au lieu de 3 heures. Tout le monde m'adore. {a.first} est un peu vexé{a:|e}."], en: ["I took charge: positions, lighting, joke at the right moment. Great photo in two takes. {a.first} officially named me family photographer. For life.", "I directed the shoot. Done in 10 minutes instead of 3 hours. Everyone loves me. {a.first} is a little miffed."] }, fx: { rel: 3, happy: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai voulu diriger. {a.first} et moi nous sommes disputés le contrôle de l'appareil. Il est tombé dans la piscine. Pas de photo cette année.", "Prise de contrôle ratée : je me suis placé{|e} en hauteur pour cadrer et je suis tombé{|e} de l'escabeau sur le gâteau."], en: ["I tried to direct. {a.first} and I fought over the camera. It fell in the pool. No photo this year.", "Takeover failed: I climbed up high to frame the shot and fell off the stepladder onto the cake."] }, fx: { rel: -4, health: -2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_reu_gastro',
    icon: '🤢',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    scene: { place: 'home', mood: 'sick', prop: 'pot', fx: 'poop' },
    when: { age: [10, 75], has: 'parent' },
    weight: 5,
    cooldown: 6,
    text: {
      fr: [
        "Repas de famille de 25 personnes. {a.first} a préparé sa fameuse terrine, qui a passé la nuit dans le coffre de la voiture {w:weather}. Elle dégage {w:smell}. Tout le monde en reprend.",
        "La tante Odile a apporté {w:food} « fait maison ». Il est d'une couleur inhabituelle. {a.first} t'en sert une énorme part en chuchotant : « Mange, sinon elle va pleurer. »",
        "Trois heures après le déjeuner chez {a.first}, ton ventre fait {w:sound}. Tu regardes autour de toi : tonton est vert, ta cousine transpire, et il n'y a qu'une seule salle de bains.",
        "{a.rel} a décongelé un rôti « de 2019, mais congelé, donc ça compte pas ». Il y a 18 invités. Tu sens que l'histoire va mal finir pour les canalisations.",
      ],
      en: [
        "Family dinner for 25. {a.first} made the famous terrine, which spent the night in the car trunk {w:weather}. It gives off {w:smell}. Everyone has seconds.",
        "Aunt Odile brought homemade {w:food}. It's an unusual color. {a.first} serves you a huge portion, whispering: “Eat it or she'll cry.”",
        "Three hours after lunch at {a.first}'s, your stomach makes {w:sound}. You look around: your uncle is green, your cousin is sweating, and there's only one bathroom.",
        "{a.first} thawed a roast “from 2019, but it was frozen so it doesn't count.” There are 18 guests. You sense this will end badly for the plumbing.",
      ],
    },
    choices: [
      {
        label: { fr: 'Courir aux toilettes', en: 'Sprint to the bathroom' },
        out: [
          { w: 1, odds: { athletic: 2 }, text: { fr: ["J'ai sprinté et décroché les toilettes en premier. Les 24 autres ont fait la queue en se tordant. J'entendais les supplications à travers la porte. Je suis resté{|e} 40 minutes. Sans honte.", "Premier{|e} arrivé{|e}, premier{|e} servi{|e}. Quand je suis ressorti{|e}, tonton avait abandonné et utilisait le seau à champagne. Image gravée à vie."], en: ["I sprinted and claimed the toilet first. The other 24 queued, doubled over. I could hear pleading through the door. I stayed 40 minutes. No shame.", "First come, first served. When I came out, my uncle had given up and was using the champagne bucket. Image burned in forever."] }, fx: { health: -4, happy: 2, disease: 'food_poisoning' }, mood: 'sick' },
          { w: 1, text: { fr: ["Trop lent{|e}. J'ai fini dans le jardin, derrière le cerisier, avec ma cousine dans le buisson d'à côté. On ne s'est jamais regardés en face depuis. La haie, elle, ne s'en est pas remise.", "Je n'ai pas eu le temps d'arriver. Le tapis persan du couloir est mort au combat. {a.first} m'a facturé le pressing. 600 €."], en: ["Too slow. I ended up in the yard behind the cherry tree, with my cousin in the next bush. We've never looked each other in the eye since. The hedge never recovered.", "I didn't make it. The hallway Persian rug died in action. {a.first} billed me for the cleaning. $600."] }, fx: { health: -6, happy: -6, disease: 'food_poisoning', money: -150 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Ne rien manger', en: 'Eat nothing' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai prétexté un régime. Seul{|e} survivant{|e} sur 25. J'ai passé la soirée à apporter du Coca et du papier toilette. Je suis {le héros|l'héroïne} de cette famille.", "Je n'ai rien touché. Le soir, toute la famille gémissait sur les canapés. J'ai mangé le dessert, seul{|e}, en paix. Il était excellent."], en: ["I claimed I was on a diet. Sole survivor out of 25. I spent the evening delivering soda and toilet paper. I'm the family hero.", "I touched nothing. That night the whole family was moaning on the couches. I ate dessert alone, in peace. It was excellent."] }, fx: { happy: 4, karma: 2, rel: -2 }, mood: 'proud' },
          { w: 1, text: { fr: ["Je n'ai rien mangé, ce qui a vexé {a.my} à mort. Puis tout le monde a été malade sauf moi. {a:Il|Elle} m'accuse maintenant d'avoir « porté la poisse ».", "J'ai refusé de manger. Ma tante a pleuré dans la cuisine. Puis elle a été malade elle-même. Puis elle m'a remercié{|e}."], en: ["I ate nothing, which offended {a.my} deeply. Then everyone got sick except me. {a:He|She} now accuses me of “jinxing it.”", "I refused to eat. My aunt cried in the kitchen. Then she got sick herself. Then she thanked me."] }, fx: { rel: -6 } },
        ],
      },
      {
        label: { fr: 'Accuser la terrine', en: 'Blame the terrine' },
        out: [
          { w: 1, text: { fr: ["J'ai accusé la terrine devant tout le monde. {a.first} a juré qu'elle était parfaite, en a repris une tranche pour le prouver, et a passé la nuit aux urgences. Vérité confirmée.", "J'ai lancé une enquête sanitaire familiale. Le coupable : les huîtres de tonton, achetées « à un mec sur un parking ». La terrine est innocentée."], en: ["I blamed the terrine in front of everyone. {a.first} swore it was perfect, ate another slice to prove it and spent the night in the ER. Truth confirmed.", "I launched a family health investigation. The culprit: my uncle's oysters, bought “from a guy in a parking lot.” The terrine is cleared."] }, fx: { rel: -4, happy: 3 } },
          { w: 1, text: { fr: ["J'ai accusé la terrine. Mais c'est moi qui avais apporté la mayonnaise. La mayonnaise était tiède depuis mardi. Toute la famille m'a regardé{|e}. J'ai pris un taxi.", "Accusation lancée, puis retour de flamme : le seul plat que personne d'autre n'avait mangé, c'était ma salade. Et je n'étais pas malade."], en: ["I blamed the terrine. But I was the one who brought the mayo. The mayo had been lukewarm since Tuesday. Everyone stared at me. I called a cab.", "Accusation made, then backfire: the only dish nobody else ate was my salad. And I wasn't sick."] }, fx: { rel: -8, karma: -2 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_reu_regift',
    icon: '🎁',
    cat: 'family',
    rating: 0,
    actor: 'parent',
    scene: { place: 'home', mood: 'shock', prop: 'gift' },
    when: { age: [14, 70], has: 'parent' },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "Noël. {a.first} te tend un paquet avec un grand sourire. C'est {w:gift}. Le même que celui que tu lui as offert l'an dernier. Avec ta carte encore dedans.",
        "Anniversaire. {a.first} t'offre {w:gift}, emballé dans du papier qui porte encore l'étiquette « Pour {a.first}, de la part de Tatie ». {a:Il|Elle} ne s'en rend pas compte.",
        "{a.first} ouvre le cadeau que tu as mis trois semaines à choisir : {w:gift}. {a:Il|Elle} dit « oh… merci », le pose et ne le regarde plus jamais. Tu le retrouves en vente sur internet le lendemain.",
        "Échange de cadeaux en famille. Tu reçois {w:gift} de la part de {a.rel}. Le prix est encore collé dessus : 1,99 €, rayon « déstockage ».",
      ],
      en: [
        "Christmas. {a.first} hands you a package with a big smile. It's {w:gift}. The same one you gave {a:him|her} last year. With your card still inside.",
        "Birthday. {a.first} gives you {w:gift}, wrapped in paper that still has the tag “For {a.first}, from Auntie.” {a:He|She} doesn't notice.",
        "{a.first} opens the present you spent three weeks choosing: {w:gift}. {a:He|She} says “oh… thanks,” sets it down and never looks at it again. The next day you find it listed for sale online.",
        "Family gift exchange. You get {w:gift} from {a.first}. The price tag is still on: $1.99, clearance aisle.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le faire remarquer', en: 'Point it out' },
        out: [
          { w: 1, text: { fr: ["J'ai lu ma propre carte à voix haute. {a.first} a rougi, puis éclaté de rire. C'est devenu une tradition : le même cadeau tourne dans la famille depuis.", "« C'est marrant, c'est le mien. » {a.first} a avoué, et on a ri jusqu'au dessert. Le cadeau est maintenant un trophée familial."], en: ["I read my own card out loud. {a.first} blushed, then burst out laughing. It became a tradition: the same gift has been circulating in the family ever since.", "“Funny, that's mine.” {a.first} confessed, and we laughed until dessert. The gift is now a family trophy."] }, fx: { happy: 5, rel: 6 }, mood: 'happy' },
          { w: 1, text: { fr: ["Je l'ai fait remarquer. {a.first} s'est vexé{a:|e} : « Tu sais combien c'est dur de te trouver un cadeau ? » Ambiance glaciale jusqu'à la bûche.", "J'ai pointé l'étiquette. Tatie était à table. Tatie a tout compris. Tatie ne parle plus à {a.my}."], en: ["I pointed it out. {a.first} got offended: “Do you know how hard you are to shop for?” Icy atmosphere until dessert.", "I pointed at the tag. Auntie was at the table. Auntie understood everything. Auntie no longer speaks to {a.my}."] }, fx: { rel: -5 } },
        ],
      },
      {
        label: { fr: 'Remercier, sincère', en: 'Thank them sincerely' },
        out: [
          { w: 2, text: { fr: ["J'ai remercié avec un grand sourire. Ce n'est pas le cadeau qui compte. {a.first} m'a serré{|e} dans ses bras. C'était sincère, de son côté au moins.", "« Merci, c'est exactement ce que je voulais. » {a.first} était ravi{a:|e}. Un mensonge de Noël, ça ne compte pas."], en: ["I said thank you with a big smile. It's not the gift that counts. {a.first} hugged me. Sincere, on {a:his|her} side at least.", "“Thanks, it's exactly what I wanted.” {a.first} was delighted. Christmas lies don't count."] }, fx: { rel: 6, karma: 2 } },
          { w: 1, text: { fr: ["J'ai remercié trop chaleureusement. {a.first} m'en a offert trois autres identiques pour mon anniversaire, « puisque tu aimes tellement ».", "J'ai fait semblant d'adorer. Maintenant, {a.my} m'en offre un chaque année. J'ai une collection de onze."], en: ["I thanked {a:him|her} too warmly. {a.first} gave me three more identical ones for my birthday, “since you love it so much.”", "I pretended to love it. Now {a.my} gives me one every year. I have a collection of eleven."] }, fx: { rel: 4, happy: -2 } },
        ],
      },
      {
        label: { fr: 'Le revendre aussi', en: 'Resell it too' },
        out: [
          { w: 1, text: { fr: ["Je l'ai revendu 15 € en ligne. L'acheteur était… {a.first}, qui le cherchait pour l'offrir à quelqu'un. Le cercle de la vie.", "Revente express. J'ai acheté une pizza avec l'argent. Personne n'a jamais rien su. Jusqu'à aujourd'hui."], en: ["I resold it online for $15. The buyer was… {a.first}, who was looking for one to gift someone. The circle of life.", "Express resale. I bought a pizza with the money. Nobody ever knew. Until today."] }, fx: { money: 15, happy: 3 } },
          { w: 1, text: { fr: ["Je l'ai mis en vente. {a.first} a vu l'annonce et a laissé un commentaire public : « Merci pour le cadeau. Bisous, {a:papa|maman}. » Grillé{|e}.", "J'ai revendu le cadeau. {a.first} a demandé à le voir au repas suivant. J'ai dû le racheter deux fois son prix."], en: ["I listed it for sale. {a.first} saw the listing and left a public comment: “Thanks for the gift. Love, {a:Dad|Mom}.” Busted.", "I resold the gift. {a.first} asked to see it at the next dinner. I had to buy it back for twice the price."] }, fx: { rel: -5, money: -20 }, mood: 'shock' },
        ],
      },
    ],
  },
  // ───────────────────────────── your own kids ─────────────────────────────
  {
    id: 'f2_kid_flush',
    icon: '🚽',
    cat: 'parenting',
    rating: 0,
    actor: 'child',
    scene: { place: 'home', mood: 'shock', prop: 'toilet' },
    when: { age: [18, 60], has: 'child', test: allKids(1, 5) },
    weight: 7,
    cooldown: 3,
    text: {
      fr: [
        "{a.first} a découvert la chasse d'eau. En une matinée, {a:il|elle} a fait disparaître {w:object}, tes clés de voiture et le doudou de la voisine. Les toilettes font {w:sound}.",
        "Tu entends {a.first} applaudir dans la salle de bains. Mauvais signe. {a:Il|Elle} vient de jeter {w:object} dans les toilettes « pour voir s'il sait nager ».",
        "{a.first}, {a.age} ans, t'annonce fièrement : « J'ai donné un bain à ton téléphone. » Ton téléphone est au fond des toilettes. Avec {w:food}.",
        "Le plombier sort des canalisations, dans l'ordre : trois Lego, {w:object}, une brosse à dents et le passeport de ton conjoint. {a.first} applaudit chaque découverte.",
      ],
      en: [
        "{a.first} discovered the toilet flush. In one morning {a:he|she} made {w:object}, your car keys and the neighbor's teddy bear disappear. The toilet makes {w:sound}.",
        "You hear {a.first} clapping in the bathroom. Bad sign. {a:He|She} just threw {w:object} in the toilet “to see if it can swim.”",
        "{a.first}, age {a.age}, proudly announces: “I gave your phone a bath.” Your phone is at the bottom of the toilet. With {w:food}.",
        "The plumber pulls from the pipes, in order: three Lego bricks, {w:object}, a toothbrush and your partner's passport. {a.first} applauds each discovery.",
      ],
    },
    choices: [
      {
        label: { fr: 'Plonger la main', en: 'Go in bare-handed' },
        out: [
          { w: 1, text: { fr: ["J'ai plongé le bras jusqu'au coude. J'ai récupéré l'objet, et aussi quelque chose que je préfère oublier. {a.first} m'a applaudi{|e} comme {un héros|une héroïne}.", "Main dans la cuvette, opération réussie. J'ai désinfecté mon bras pendant 20 minutes. {a.first} veut recommencer « pour que tu refasses le jeu »."], en: ["I went in up to the elbow. I got the object back, and also something I'd rather forget. {a.first} cheered me like a hero.", "Hand in the bowl, operation successful. I disinfected my arm for 20 minutes. {a.first} wants to do it again “so you can play the game again.”"] }, fx: { happy: 2, rel: 4, health: -1 } },
          { w: 1, text: { fr: ["J'ai plongé la main. Trop tard, c'était parti. J'ai juste réussi à tirer la chasse par accident avec le coude. Inondation de la salle de bains.", "Rien récupéré. Bras mouillé, dignité noyée. {a.first} a ri si fort qu'{a:il|elle} a eu le hoquet."], en: ["I went in. Too late, it was gone. I just managed to flush again with my elbow by accident. Bathroom flooded.", "Nothing recovered. Wet arm, drowned dignity. {a.first} laughed so hard {a:he|she} got hiccups."] }, fx: { happy: -3, money: -100 } },
        ],
      },
      {
        label: { fr: 'Appeler le plombier', en: 'Call a plumber' },
        out: [
          { w: 2, text: { fr: ["Le plombier a tout récupéré pour 180 €. Il a donné un autocollant à {a.first} et lui a dit « bon travail ». Je ne suis pas d'accord.", "Plombier : 180 €. Il m'a dit qu'il voyait ça tous les jours, mais qu'il n'avait jamais trouvé {w:object}. Une première."], en: ["The plumber got everything back for $180. He gave {a.first} a sticker and said “good job.” I disagree.", "Plumber: $180. He said he sees this every day, but had never found {w:object}. A first."] }, fx: { money: -180, stress: 2 } },
          { w: 1, text: { fr: ["Le plombier a dû démonter toute la cuvette. Facture : 650 €. {a.first} l'a suivi partout et veut maintenant devenir plombier. C'est une vocation à 650 €.", "Le plombier est venu, a tout réparé, puis {a.first} a jeté ses lunettes dans les toilettes pendant qu'il rangeait. Deuxième intervention."], en: ["The plumber had to take the whole toilet apart. Bill: $650. {a.first} followed him everywhere and now wants to be a plumber. A $650 career choice.", "The plumber came, fixed everything, then {a.first} flushed his glasses while he was packing up. Second call-out."] }, fx: { money: -650, rel: 3 } },
        ],
      },
      {
        label: { fr: 'Verrou de sécurité', en: 'Install a toilet lock' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai installé un verrou de sécurité sur la cuvette. {a.first} l'a regardé, a soupiré et est passé{a:|e} à la poubelle. Nouveau terrain de jeu.", "Verrou installé. Problème réglé. Le seul inconvénient : à 3 h du matin, je n'arrive plus à l'ouvrir moi-même."], en: ["I installed a toilet lock. {a.first} stared at it, sighed and moved on to the trash can. New playground.", "Lock installed. Problem solved. Only downside: at 3 a.m. I can't open it myself."] }, fx: { stress: -2, discipline: 2 } },
          { w: 1, text: { fr: ["{a.first} a ouvert le verrou de sécurité en quatre secondes. Le fabricant aimerait {a:le|la} recruter.", "{a.first} a contourné le verrou et a jeté le verrou lui-même dans les toilettes. Je respecte, en un sens."], en: ["{a.first} opened the safety lock in four seconds. The manufacturer would like to hire {a:him|her}.", "{a.first} bypassed the lock and flushed the lock itself. I respect it, in a way."] }, fx: { stress: 4, smarts: 1 } },
        ],
      },
    ],
  },
  {
    id: 'f2_kid_loud_public',
    icon: '📢',
    cat: 'parenting',
    rating: 1,
    actor: 'child',
    scene: { place: 'park', mood: 'shock', prop: 'bus' },
    when: { age: [20, 60], has: 'child', test: allKids(3, 7) },
    weight: 7,
    cooldown: 3,
    text: {
      fr: [
        "Dans le bus bondé, {a.first} pointe un monsieur du doigt et demande très fort : « Pourquoi le monsieur il a un gros ventre ? Il a un bébé dedans ? » Le monsieur entend tout.",
        "Caisse du supermarché. {a.first} annonce à la file entière : « {Papa|Maman} fait des gros prouts le soir et après il faut ouvrir la fenêtre. » La caissière ne sait plus où regarder.",
        "Au restaurant, {a.first} répète à voix haute un mot que tu as dit dans la voiture, quand un type t'a fait une queue de poisson. {w:swear} Ça résonne dans toute la salle.",
        "À l'enterrement de la grand-tante, {a.first} demande, très fort : « Elle sent {w:smell}, la dame dans la boîte ? » Le curé s'interrompt.",
      ],
      en: [
        "On the packed bus, {a.first} points at a man and asks loudly: “Why does that man have a big tummy? Is there a baby in it?” The man hears every word.",
        "Supermarket checkout. {a.first} announces to the entire line: “{Daddy|Mommy} does big farts at night and then we have to open the window.” The cashier doesn't know where to look.",
        "At the restaurant, {a.first} loudly repeats a word you said in the car when someone cut you off. “{w:swear}” It echoes through the whole room.",
        "At your great-aunt's funeral, {a.first} asks, very loudly: “Does the lady in the box smell like {w:smell}?” The priest stops mid-sentence.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rire nerveusement', en: 'Laugh nervously' },
        out: [
          { w: 1, text: { fr: ["J'ai ri nerveusement. Les gens autour ont ri aussi. Le monsieur au gros ventre a même dit « c'est des jumeaux ». Tension désamorcée.", "Mon rire nerveux a contaminé tout le monde. Même le curé. {a.first} a cru que c'était un spectacle et a salué."], en: ["I laughed nervously. People around laughed too. The big-bellied man even said “it's twins.” Tension defused.", "My nervous laugh spread to everyone. Even the priest. {a.first} thought it was a show and took a bow."] }, fx: { happy: 3, stress: -1 } },
          { w: 1, text: { fr: ["Mon rire nerveux a été pris pour de la moquerie. Le monsieur m'a fait une remarque cinglante sur mes cernes. Mérité.", "J'ai ri. {a.first} a pris ça pour un encouragement et a recommencé, plus fort, en désignant quelqu'un d'autre."], en: ["My nervous laugh was taken as mockery. The man made a cutting remark about my eye bags. Deserved.", "I laughed. {a.first} took it as encouragement and did it again, louder, pointing at someone else."] }, fx: { happy: -3, stress: 3 } },
        ],
      },
      {
        label: { fr: 'Expliquer la politesse', en: 'Teach some manners' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai expliqué calmement qu'on ne dit pas ces choses-là à voix haute. {a.first} a hoché la tête, puis a chuchoté la même question. Progrès.", "Leçon de politesse réussie. {a.first} s'est excusé{a:|e} auprès du monsieur, qui lui a donné un bonbon. Morale floue, mais efficace."], en: ["I calmly explained we don't say those things out loud. {a.first} nodded, then whispered the same question. Progress.", "Manners lesson successful. {a.first} apologized to the man, who gave {a:him|her} a candy. Muddled moral, but effective."] }, fx: { rel: 4, discipline: 2 } },
          { w: 1, text: { fr: ["J'ai fait la leçon. {a.first} a répondu, tout aussi fort : « Mais toi aussi tu l'as dit, dans la voiture ! » Toute la salle m'a regardé{|e}.", "Leçon ratée : {a.first} a demandé pourquoi c'est mal de dire la vérité. Je n'avais pas de réponse. Le monsieur non plus."], en: ["I lectured. {a.first} replied, just as loudly: “But YOU said it too, in the car!” The whole room looked at me.", "Lesson failed: {a.first} asked why it's bad to tell the truth. I had no answer. Neither did the man."] }, fx: { happy: -4, stress: 3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire semblant d\'être étranger', en: 'Pretend it\'s not mine' },
        out: [
          { w: 1, text: { fr: ["J'ai regardé ailleurs, comme si cet enfant n'était pas le mien. {a.first} a crié « {PAPA|MAMAN} ? » en me tirant la manche. Plan raté.", "J'ai fait semblant de ne pas connaître {a.first}. Une dame a appelé la sécurité pour « enfant abandonné ». J'ai dû prouver au vigile que j'étais {le père|la mère}."], en: ["I looked away, as if this child weren't mine. {a.first} yelled “{DAD|MOM}?” tugging my sleeve. Plan failed.", "I pretended not to know {a.first}. A lady called security about an “abandoned child.” I had to prove I was the parent to the guard."] }, fx: { rel: -4, happy: -2 } },
          { w: 1, text: { fr: ["J'ai fait comme si de rien n'était et changé d'arrêt de bus. Personne ne m'a reconnu{|e}. {a.first} a trouvé ça très drôle. Complicité.", "J'ai pris un air détaché et j'ai sifflé {w:song}. Ça a marché. Le malaise est passé au monsieur, qui est descendu au prochain arrêt."], en: ["I acted like nothing happened and got off at a different stop. Nobody recognized me. {a.first} found it hilarious. Bonding.", "I put on a detached air and whistled {w:song}. It worked. The awkwardness passed to the man, who got off at the next stop."] }, fx: { happy: 2, karma: -1 } },
        ],
      },
    ],
  },
  {
    id: 'f2_kid_project_late',
    icon: '✂️',
    cat: 'parenting',
    rating: 0,
    actor: 'child',
    scene: { place: 'home', mood: 'shock', prop: 'glue' },
    when: { age: [22, 60], has: 'child', test: allKids(6, 12) },
    weight: 7,
    cooldown: 3,
    text: {
      fr: [
        "21 h 47. {a.first} se souvient soudain qu'{a:il|elle} doit rendre demain une maquette du château de Versailles. En carton. Avec des fontaines qui marchent.",
        "{a.first} t'annonce au coucher : « Ah, au fait, demain je dois apporter un déguisement pour le spectacle. Thème : {w:animal}. » Il est 22 h. Tu as {w:object} et du scotch.",
        "Mot dans le cahier de {a.first}, découvert à 21 h : « Apporter demain un gâteau fait maison pour 28 élèves, sans gluten, sans lactose, sans noix. »",
        "{a.first} doit présenter un exposé sur {w:celeb} demain. {a:Il|Elle} n'a rien commencé et pleure sur le canapé avec {w:food} dans la main.",
      ],
      en: [
        "9:47 p.m. {a.first} suddenly remembers {a:he|she} has to turn in a model of the Palace of Versailles tomorrow. In cardboard. With working fountains.",
        "{a.first} tells you at bedtime: “Oh, by the way, tomorrow I need a costume for the show. Theme: {w:animal}.” It's 10 p.m. You have {w:object} and tape.",
        "Note in {a.first}'s notebook, discovered at 9 p.m.: “Bring a homemade cake tomorrow for 28 students, gluten-free, dairy-free, nut-free.”",
        "{a.first} has to present a report on {w:celeb} tomorrow. {a:He|She} hasn't started and is crying on the couch holding {w:food}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Nuit blanche ensemble', en: 'All-nighter together' },
        out: [
          { w: 2, text: { fr: ["On a bricolé jusqu'à 2 h du matin. Le résultat est moche, collant et parfait. {a.first} s'est endormi{a:|e} sur la table, de la colle dans les cheveux. Souvenir éternel.", "Nuit blanche. À 3 h, on riait comme des fous en collant des bouchons. {a.first} a eu 15/20. Moi, une crise de dos."], en: ["We crafted until 2 a.m. The result is ugly, sticky and perfect. {a.first} fell asleep on the table with glue in {a:his|her} hair. Eternal memory.", "All-nighter. At 3 a.m. we were laughing like maniacs, gluing corks. {a.first} got a B. I got back pain."] }, fx: { rel: 10, happy: 3, health: -2 }, mood: 'happy' },
          { w: 1, text: { fr: ["On a veillé toute la nuit. À 6 h, le chat a marché sur la maquette. On a tout recommencé en pleurant. Le chat est puni.", "Nuit blanche. J'ai fini par tout faire seul{|e} pendant que {a.first} dormait. La maîtresse a écrit : « Bravo aux parents. »"], en: ["We stayed up all night. At 6 a.m. the cat walked on the model. We redid it all, crying. The cat is grounded.", "All-nighter. I ended up doing it all alone while {a.first} slept. The teacher wrote: “Well done, parents.”"] }, fx: { rel: 4, stress: 6, health: -3 }, mood: 'sleepy' },
        ],
      },
      {
        label: { fr: 'Acheter un truc tout fait', en: 'Buy something ready-made' },
        out: [
          { w: 1, text: { fr: ["Supermarché ouvert jusqu'à 22 h. J'ai acheté un gâteau industriel et je l'ai abîmé exprès pour qu'il ait l'air fait maison. La maîtresse a demandé la recette.", "J'ai trouvé le déguisement ({w:animal}) en ligne avec livraison express. {a.first} était la star du spectacle. Personne ne saura."], en: ["Supermarket open until 10 p.m. I bought a store cake and roughed it up so it looked homemade. The teacher asked for the recipe.", "Found the costume ({w:animal}) online with express delivery. {a.first} was the star of the show. Nobody will ever know."] }, fx: { money: -40, rel: 4, karma: -1 } },
          { w: 1, text: { fr: ["Le truc tout fait avait encore l'étiquette du magasin. Un autre parent l'a remarqué. Je suis le sujet de conversation du groupe WhatsApp des parents.", "J'ai acheté une maquette en kit. Elle était en allemand, avec 400 pièces. On a fini à 4 h du matin quand même."], en: ["The store-bought thing still had the price tag. Another parent noticed. I'm the hot topic in the parents' group chat.", "I bought a model kit. Instructions in German, 400 pieces. We still finished at 4 a.m."] }, fx: { money: -60, stress: 4 } },
        ],
      },
      {
        label: { fr: 'Leçon de responsabilité', en: 'Teach responsibility' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: ["J'ai refusé d'aider : « Tu assumes. » {a.first} a rendu un truc minable, a eu une mauvaise note et prépare maintenant ses devoirs trois jours à l'avance. Ça a marché.", "Leçon donnée. {a.first} a improvisé un exposé avec {w:object} comme accessoire. La maîtresse a adoré « l'audace »."], en: ["I refused to help: “Your problem.” {a.first} turned in something terrible, got a bad grade and now prepares homework three days ahead. It worked.", "Lesson given. {a.first} improvised a report using {w:object} as a prop. The teacher loved the “boldness.”"] }, fx: { discipline: 3, rel: -2 } },
          { w: 1, text: { fr: ["J'ai voulu donner une leçon. {a.first} a pleuré toute la nuit, je n'ai pas dormi non plus, et j'ai fini par tout faire à 5 h du matin. Leçon apprise par moi.", "{a.first} a raconté à la maîtresse que je l'avais « abandonné{a:|e} ». Convocation lundi."], en: ["I tried to teach a lesson. {a.first} cried all night, I didn't sleep either, and I ended up doing it all at 5 a.m. The lesson was for me.", "{a.first} told the teacher I “abandoned” {a:him|her}. Meeting on Monday."] }, fx: { stress: 6, rel: -4 }, mood: 'sad' },
        ],
      },
    ],
  },
  {
    id: 'f2_kid_is_bully',
    icon: '🥊',
    cat: 'parenting',
    rating: 1,
    actor: 'child',
    scene: { place: 'school', mood: 'shock', prop: 'desk' },
    when: { age: [24, 60], has: 'child', test: allKids(6, 13) },
    weight: 6,
    cooldown: 4,
    text: {
      fr: [
        "Convocation chez le directeur. Tu t'attends à ce que {a.first} soit victime. Surprise : c'est {a.first} qui a racketté trois CE1 et fondé un « syndicat de la cour » qui prélève 10 % des goûters.",
        "La maîtresse t'appelle : {a.first} a mordu un camarade, renversé {w:food} sur la tête d'un autre et traité la maîtresse de « {w:insult} ». Elle hésite entre colère et admiration.",
        "{a.first} est devenu{a:|e} le caïd de la cour de récré. {a:Il|Elle} a un garde du corps de 7 ans, un surnom (« {w:nickname} ») et un trafic de cartes Pokémon florissant.",
        "Un autre parent t'aborde {w:at_place}, furieux : {a.first} a « humilié » son fils en public avec une imitation parfaite de sa façon de courir. Toute l'école la refait.",
      ],
      en: [
        "Called to the principal's office. You expect {a.first} to be the victim. Surprise: {a.first} shook down three second-graders and founded a “playground union” that takes 10% of everyone's snacks.",
        "The teacher calls: {a.first} bit a classmate, dumped {w:food} on another's head and called the teacher a “{w:insult}.” She's torn between anger and admiration.",
        "{a.first} has become the playground kingpin. {a:He|She} has a 7-year-old bodyguard, a nickname (“{w:nickname}”) and a thriving Pokémon card racket.",
        "Another parent corners you {w:at_place}, furious: {a.first} “humiliated” their son in public with a perfect impression of the way he runs. The whole school does it now.",
      ],
    },
    choices: [
      {
        label: { fr: 'Punition exemplaire', en: 'Serious punishment' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["Privé{a:|e} d'écrans, lettre d'excuses, rendez-vous avec la victime. {a.first} a compris. Le syndicat est dissous. Les goûters sont libres.", "Punition sévère, discussion longue. {a.first} a pleuré, s'est excusé{a:|e}, et est maintenant ami{a:|e} avec sa victime. Fin heureuse, pour une fois."], en: ["No screens, apology letter, meeting with the victim. {a.first} got it. The union is dissolved. Snacks are free again.", "Harsh punishment, long talk. {a.first} cried, apologized and is now friends with the victim. Happy ending, for once."] }, fx: { rel: -4, karma: 4, discipline: 3 } },
          { w: 1, text: { fr: ["J'ai puni {a.first}. {a:Il|Elle} a continué le business en secret, depuis sa chambre, par talkie-walkie. Je crois que j'élève un parrain de la mafia.", "Punition donnée. {a.first} a simplement délégué la gestion du syndicat à son lieutenant. Rien n'a changé."], en: ["I punished {a.first}. {a:He|She} kept the business going in secret from {a:his|her} room, by walkie-talkie. I think I'm raising a mob boss.", "Punishment given. {a.first} just delegated the union to {a:his|her} lieutenant. Nothing changed."] }, fx: { stress: 5, rel: -6 } },
        ],
      },
      {
        label: { fr: 'Discuter vraiment', en: 'Have a real talk' },
        out: [
          { w: 2, text: { fr: ["On a parlé longtemps. {a.first} se faisait embêter avant, et a voulu « devenir le plus fort ». On a pleuré tous les deux. Je l'ai inscrit{a:|e} au judo. Ça canalise.", "Discussion à cœur ouvert. {a.first} m'a avoué se sentir seul{a:|e}. On a organisé un goûter avec toute la classe. Le caïd est devenu le roi des fêtes."], en: ["We talked for a long time. {a.first} used to get picked on and wanted to “become the strongest.” We both cried. I signed {a:him|her} up for judo. It's channeled now.", "Heart-to-heart. {a.first} admitted feeling lonely. We threw a party for the whole class. The kingpin became the party king."] }, fx: { rel: 10, happy: 3, karma: 3 }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai voulu discuter. {a.first} m'a écouté{|e}, puis m'a proposé 10 % des bénéfices pour que je {a:le|la} laisse tranquille. J'ai été tenté{|e}.", "La discussion a révélé que {a.first} a appris tout ça en me regardant négocier avec le garagiste. Prise de conscience brutale."], en: ["I tried to talk. {a.first} listened, then offered me 10% of the profits to leave {a:him|her} alone. I was tempted.", "The talk revealed {a.first} learned all this watching me haggle with the mechanic. Brutal realization."] }, fx: { smarts: 1, stress: 3 } },
        ],
      },
      {
        label: { fr: 'Défendre mon enfant', en: 'Defend my kid' },
        out: [
          { w: 1, text: { fr: ["J'ai défendu {a.first} bec et ongles face au directeur. On a gagné. {a.first} me regarde comme un super-héros. L'autre parent me déteste. Ça me va.", "J'ai contesté la sanction. Le directeur a cédé. {a.first} m'a offert sa meilleure carte Pokémon en remerciement. Elle vaut 300 €."], en: ["I defended {a.first} tooth and nail against the principal. We won. {a.first} looks at me like a superhero. The other parent hates me. Fine.", "I challenged the punishment. The principal caved. {a.first} gave me {a:his|her} best Pokémon card as thanks. It's worth $300."] }, fx: { rel: 10, karma: -4 } },
          { w: 1, text: { fr: ["J'ai défendu mon enfant. Puis on m'a montré la vidéo. J'ai eu honte, jusqu'au fond de mes chaussettes. Excuses publiques à la kermesse.", "J'ai crié sur le directeur. Résultat : {a.first} est exclu{a:|e} trois jours et moi interdit{|e} d'accompagner les sorties scolaires."], en: ["I defended my kid. Then they showed me the video. I was ashamed down to my socks. Public apology at the school fair.", "I yelled at the principal. Result: {a.first} got suspended for three days and I'm banned from chaperoning field trips."] }, fx: { happy: -5, rel: 2, karma: -3 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_kid_youtuber',
    icon: '🎬',
    cat: 'parenting',
    rating: 1,
    actor: 'child',
    scene: { place: 'home', mood: 'shock', prop: 'camera' },
    when: { age: [25, 65], has: 'child', test: allKids(8, 16) },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "{a.first} veut devenir {a:youtubeur|youtubeuse}. Sa première vidéo : toi, filmé{|e} en caméra cachée en train de chanter {w:song} sous la douche. 38 000 vues. Titre : « MON PARENT EST GÊNANT 😂 ».",
        "{a.first} a lancé une chaîne. Concept : « Je fais réagir mes parents à des trucs bizarres ». Aujourd'hui, {a:il|elle} te fait goûter {w:food} sans te dire ce que c'est.",
        "Tu découvres que {a.first} filme toute la famille depuis des mois. Sa chaîne a 120 000 abonnés. Ta crise de nerfs pendant le montage d'un meuble {w:brand} a 2 millions de vues.",
        "{a.first} t'annonce, très sérieux{a:|se} : « Je ne ferai pas d'études. Je serai influenceur{a:|se}, comme {w:celeb}. » {a:Il|Elle} a 14 abonnés, dont toi.",
      ],
      en: [
        "{a.first} wants to be a YouTuber. First video: you, caught on hidden camera singing {w:song} in the shower. 38,000 views. Title: “MY PARENT IS SO CRINGE 😂.”",
        "{a.first} started a channel. Concept: “Making my parents react to weird stuff.” Today {a:he|she} makes you taste {w:food} without telling you what it is.",
        "You discover {a.first} has been filming the whole family for months. The channel has 120,000 subscribers. Your meltdown assembling a cabinet from {w:brand} has 2 million views.",
        "{a.first} announces, dead serious: “I'm not going to college. I'll be an influencer, like {w:celeb}.” {a:He|She} has 14 subscribers, including you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Devenir la star', en: 'Become the star' },
        out: [
          { w: 1, text: { fr: ["J'ai joué le jeu. On fait des vidéos ensemble chaque samedi. On a 200 000 abonnés. Les gens m'arrêtent {w:at_place} pour une photo. Je suis un parent-influenceur. Pathétique et génial.", "Je suis devenu{|e} la vedette de la chaîne. Une marque nous paie pour vanter {w:food}. {a.first} négocie mon cachet. Mon enfant est mon agent."], en: ["I played along. We make videos together every Saturday. 200,000 subscribers. People stop me {w:at_place} for photos. I'm a parent-influencer. Pathetic and awesome.", "I became the channel's star. A brand pays us to promote {w:food}. {a.first} negotiates my fee. My child is my agent."] }, fx: { rel: 10, followers: 20000, fame: 3, money: 1500 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai voulu être la star. J'en ai fait trop. La vidéo s'appelle maintenant « Mon parent essaie d'être drôle (ÉCHEC) ». Elle cartonne. À mes dépens.", "Je me suis investi{|e} dans la chaîne. {a.first} m'a « viré{|e} » au bout de deux semaines : « Tu fais baisser l'engagement. »"], en: ["I tried to be the star. I overdid it. The video is now called “My parent tries to be funny (FAIL).” It's a hit. At my expense.", "I got invested in the channel. {a.first} “fired” me after two weeks: “You're killing the engagement.”"] }, fx: { happy: -4, followers: 3000 } },
        ],
      },
      {
        label: { fr: 'Interdire les vidéos', en: 'Ban the videos' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: ["J'ai fait supprimer les vidéos et posé des règles : pas de famille sans accord. {a.first} a boudé, puis s'est mis{a:|e} à filmer des expériences scientifiques. Moins de vues, plus de dignité.", "Interdiction totale. {a.first} a protesté, puis a lancé un blog BD à la place. Il est génial, et je n'apparais que sous forme de pingouin."], en: ["I had the videos deleted and set rules: no family without consent. {a.first} sulked, then started filming science experiments. Fewer views, more dignity.", "Total ban. {a.first} protested, then started a comics blog instead. It's brilliant, and I only appear as a penguin."] }, fx: { rel: -4, happy: 3, discipline: 2 } },
          { w: 1, text: { fr: ["J'ai interdit. {a.first} a fait une vidéo pour se plaindre de ma « censure ». 400 000 vues. Les commentaires me traitent de {dictateur|dictatrice}.", "Interdiction posée. Les abonnés de {a.first} ont lancé un hashtag pour me faire céder. J'ai reçu des menaces de la part d'enfants de 10 ans."], en: ["I banned it. {a.first} made a video complaining about my “censorship.” 400,000 views. The comments call me a dictator.", "Ban issued. {a.first}'s subscribers launched a hashtag to make me cave. I received threats from 10-year-olds."] }, fx: { rel: -8, stress: 6, followers: 1000 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Exiger mes droits', en: 'Demand royalties' },
        out: [
          { w: 1, text: { fr: ["J'ai exigé 30 % des revenus, en tant {qu'acteur principal|qu'actrice principale}. {a.first} a accepté. Je touche 4,12 € par mois. C'est le principe qui compte.", "Négociation réussie : {a.first} me reverse une part, et on met le reste de côté pour ses études. Business familial sain."], en: ["I demanded 30% of revenue as lead actor. {a.first} agreed. I earn $4.12 a month. It's the principle.", "Successful negotiation: {a.first} pays me a cut, and the rest goes into a college fund. Healthy family business."] }, fx: { money: 50, rel: 4, smarts: 1 } },
          { w: 1, text: { fr: ["{a.first} a refusé de partager et m'a fait signer, avec un sourire, un « contrat d'image » rédigé au crayon. J'ai signé sans lire. Je lui appartiens.", "J'ai réclamé mes droits. {a.first} m'a facturé en retour « 14 ans de câlins non rémunérés ». On est quittes."], en: ["{a.first} refused to share and had me sign, with a smile, an “image rights contract” written in pencil. I signed without reading. I belong to {a:him|her} now.", "I claimed my royalties. {a.first} billed me back for “14 years of unpaid hugs.” We're even."] }, fx: { happy: 2, rel: 2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_kid_tattoo',
    icon: '🐉',
    cat: 'parenting',
    rating: 1,
    actor: 'child',
    scene: { place: 'home', mood: 'shock', prop: 'tattoo' },
    when: { age: [30, 70], has: 'child', test: allKids(16, 22) },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "{a.first} rentre avec un pansement suspect sur l'avant-bras. Dessous : un tatouage censé représenter {w:animal}, mais qui évoque plutôt {w:object}. « C'est symbolique. » De quoi, personne ne sait.",
        "{a.first} s'est fait tatouer ton prénom sur la nuque. Avec une faute d'orthographe. {a:Il|Elle} est ému{a:|e}, toi aussi, mais pas pour les mêmes raisons.",
        "{a.first} t'annonce son nouveau tatouage : une citation en chinois qui signifie « force et honneur ». Ton collègue chinois la lit : ça veut dire « {w:food} à volonté ».",
        "Tatouage surprise : {a.first} s'est fait tatouer le visage d'une star sur le mollet : {w:celeb}. Le tatoueur avait visiblement du mal avec les yeux. Le résultat te fixera pour toujours.",
      ],
      en: [
        "{a.first} comes home with a suspicious bandage on the forearm. Under it: a tattoo of {w:animal} that looks like {w:object}. “It's symbolic.” Of what, nobody knows.",
        "{a.first} got your name tattooed on the back of {a:his|her} neck. Misspelled. {a:He|She} is moved, so are you, but for different reasons.",
        "{a.first} shows off a new tattoo: a Chinese quote meaning “strength and honor.” Your Chinese coworker reads it: it means “all-you-can-eat {w:food}.”",
        "Surprise tattoo: {a.first} got {w:celeb}'s face inked on the calf. The artist clearly struggled with the eyes. It will stare at you forever.",
      ],
    },
    choices: [
      {
        label: { fr: 'Hurler', en: 'Freak out' },
        out: [
          { w: 1, text: { fr: ["J'ai hurlé. {a.first} a hurlé plus fort : « C'est MON corps ! » Puis a remarqué mon propre tatouage raté de 1998. Hypocrisie démasquée.", "J'ai fait une scène. {a.first} a claqué la porte. Le lendemain, {a:il|elle} portait des manches longues par 35 °C, pour me faire culpabiliser. Ça a marché."], en: ["I screamed. {a.first} screamed louder: “It's MY body!” Then noticed my own botched tattoo from 1998. Hypocrisy exposed.", "I made a scene. {a.first} slammed the door. The next day {a:he|she} wore long sleeves in 95°F heat to guilt-trip me. It worked."] }, fx: { rel: -8, stress: 4 }, mood: 'angry' },
          { w: 1, text: { fr: ["J'ai hurlé. {a.first} est reparti{a:|e} se faire faire un deuxième tatouage « pour la rébellion ». C'est un pouce levé vers moi. Ironique.", "Mes cris ont convaincu {a.first} de le faire retirer au laser. 1 200 €. C'est moi qui paie, évidemment."], en: ["I screamed. {a.first} went straight back for a second tattoo “for rebellion.” It's a thumbs-up aimed at me. Ironic.", "My screaming convinced {a.first} to get it lasered off. $1,200. I'm paying, obviously."] }, fx: { rel: -4, money: -400 } },
        ],
      },
      {
        label: { fr: 'Se faire tatouer aussi', en: 'Get matching ink' },
        out: [
          { w: 1, text: { fr: ["On s'est fait tatouer le même petit cœur, ensemble. {a.first} a pleuré, moi aussi (de douleur). Lien indélébile, littéralement.", "Tatouage parent-enfant assorti. Les copains de {a.first} me trouvent « trop stylé{|e} ». Je n'ai jamais été aussi cool."], en: ["We got the same little heart tattoo together. {a.first} cried, so did I (from pain). An indelible bond, literally.", "Matching parent-child tattoos. {a.first}'s friends think I'm “so cool.” I've never been cooler."] }, fx: { rel: 12, happy: 5, looks: 1 }, mood: 'love' },
          { w: 1, text: { fr: ["Je me suis fait tatouer aussi. Le tatoueur a confondu les modèles. J'ai {w:celeb} sur la fesse. {a.first} ne s'en remet pas, de rire.", "Mon tatouage s'est infecté. J'ai eu de la fièvre, du pus et un bras gonflé comme un jambon. {a.first} m'a soigné{|e}. Rôles inversés."], en: ["I got one too. The artist mixed up the designs. I have {w:celeb} on my butt. {a.first} can't stop laughing.", "My tattoo got infected. Fever, pus and an arm swollen like a ham. {a.first} nursed me. Roles reversed."] }, fx: { health: -4, rel: 6, looks: -2 } },
        ],
      },
      {
        label: { fr: 'Rester zen', en: 'Stay calm' },
        out: [
          { w: 2, text: { fr: ["J'ai dit : « Il est très beau. » {a.first} s'attendait à une dispute et n'a pas su quoi faire. {a:Il|Elle} m'a fait un câlin, déstabilisé{a:|e}.", "Zen absolu. J'ai posé des questions sur la signification. {a.first} m'a raconté une histoire touchante. Le tatouage reste moche, mais l'histoire est belle."], en: ["I said: “It's very beautiful.” {a.first} was expecting a fight and didn't know what to do. {a:He|She} hugged me, thrown off.", "Total zen. I asked about the meaning. {a.first} told me a touching story. The tattoo is still ugly, but the story is beautiful."] }, fx: { rel: 8, karma: 2 } },
          { w: 1, text: { fr: ["Je suis resté{|e} zen à l'extérieur. À l'intérieur, j'ai crié pendant trois jours. Mon ulcère va bien, merci.", "Ma réaction trop calme a vexé {a.first}, qui voulait provoquer : « Tu t'en fiches de moi, en fait. » On ne gagne jamais."], en: ["I stayed calm on the outside. Inside, I screamed for three days. My ulcer is fine, thanks.", "My overly calm reaction offended {a.first}, who wanted a reaction: “You don't even care about me.” You can never win."] }, fx: { stress: 5, rel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_kid_party',
    icon: '🏚️',
    cat: 'parenting',
    rating: 2,
    actor: 'child',
    scene: { place: 'home', mood: 'shock', prop: 'cups', fx: 'poop' },
    when: { age: [30, 65], has: 'child', test: allKids(14, 18) },
    weight: 5,
    cooldown: 5,
    text: {
      fr: [
        "Tu rentres de week-end un jour plus tôt. La maison est dévastée : vomi dans le bac à linge, {w:object} dans la piscine, et un inconnu endormi dans ta baignoire. {a.first} jure qu'il y avait « juste trois potes ».",
        "Les voisins t'envoient une vidéo : ta maison, 2 h du matin, 140 ados, de la musique à fond et quelqu'un qui saute du toit dans la haie. {a.first} répond à tes appels en chuchotant « je dors ».",
        "Retour de vacances. Le salon sent {w:smell}, le chien porte un soutien-gorge, et il y a un trou en forme d'ado dans le placo. {a.first} fait semblant de réviser.",
        "{a.first} a organisé une « petite soirée » pendant ton absence. Bilan : le lustre au sol, ta voiture repeinte et {w:animal} enfermé dans les toilettes, que personne n'a amené.",
      ],
      en: [
        "You come home from a weekend a day early. The house is wrecked: vomit in the laundry basket, {w:object} in the pool and a stranger asleep in your bathtub. {a.first} swears there were “just three friends.”",
        "The neighbors send you a video: your house, 2 a.m., 140 teenagers, music blasting and someone jumping off the roof into the hedge. {a.first} answers your calls whispering “I'm asleep.”",
        "Back from vacation. The living room smells like {w:smell}, the dog is wearing a bra, and there's a teenager-shaped hole in the drywall. {a.first} pretends to study.",
        "{a.first} threw a “small get-together” while you were away. Damage report: chandelier on the floor, your car repainted and {w:animal} locked in the bathroom that nobody brought.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exploser de colère', en: 'Blow up' },
        out: [
          { w: 2, text: { fr: ["J'ai explosé. {a.first} est privé{a:|e} de sortie, de téléphone et d'Internet jusqu'à ses 30 ans. {a:Il|Elle} a nettoyé le vomi à la brosse à dents. La sienne.", "Colère monumentale. Le voisin a applaudi par la fenêtre. {a.first} a dû rembourser chaque dégât en tondant les pelouses du quartier pendant tout l'été."], en: ["I exploded. {a.first} is grounded, no phone, no internet until age 30. Scrubbed the vomit with a toothbrush. {a:His|Her} own.", "Monumental anger. The neighbor applauded from the window. {a.first} had to pay for every bit of damage by mowing lawns all summer."] }, fx: { rel: -10, money: -800, stress: 6, discipline: 2 }, mood: 'angry' },
          { w: 1, text: { fr: ["J'ai hurlé si fort que l'inconnu dans la baignoire s'est réveillé, a vomi sur mes chaussures et s'est enfui en caleçon. Il a oublié son téléphone. C'était le fils du maire.", "Explosion de rage. Je me suis tordu la cheville sur une canette en tapant du pied. {a.first} m'a conduit{|e} aux urgences. Sans permis."], en: ["I yelled so loud the stranger in the tub woke up, puked on my shoes and fled in his boxers. He forgot his phone. It was the mayor's son.", "Explosion of rage. I twisted my ankle on a can while stomping. {a.first} drove me to the ER. Without a license."] }, fx: { health: -4, rel: -6, stress: 8 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire nettoyer en silence', en: 'Silent treatment, clean-up' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["Pas un mot. J'ai juste tendu les gants et la serpillière. {a.first} a nettoyé pendant 14 heures. Le silence était pire que des cris. {a:Il|Elle} ne recommencera jamais.", "Silence glacial. {a.first} a tout récuré, en pleurant un peu. La maison n'a jamais été aussi propre. Je devrais partir en week-end plus souvent."], en: ["Not a word. I just handed over gloves and a mop. {a.first} cleaned for 14 hours. The silence was worse than yelling. {a:He|She} will never do it again.", "Icy silence. {a.first} scrubbed everything, crying a little. The house has never been cleaner. I should go away more often."] }, fx: { rel: -2, happy: 2, discipline: 3 } },
          { w: 1, text: { fr: ["Silence radio. {a.first} a fait venir tous les fêtards pour nettoyer. Ils ont fait une deuxième fête pendant le ménage. J'ai capitulé.", "En nettoyant, {a.first} a trouvé dans le canapé un truc gluant non identifié et a vomi à son tour. Cycle sans fin."], en: ["Radio silence. {a.first} brought all the partygoers back to clean. They threw a second party while cleaning. I gave up.", "While cleaning, {a.first} found something sticky and unidentified in the couch and threw up too. Endless cycle."] }, fx: { stress: 5 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Raconter mes fêtes', en: 'Share my own party stories' },
        out: [
          { w: 1, text: { fr: ["J'ai raconté ma pire fête d'ado, celle de la voiture dans la piscine. {a.first} m'a regardé{|e} avec un respect nouveau. On a nettoyé ensemble, en riant.", "Au lieu de crier, j'ai avoué mes propres bêtises de jeunesse. {a.first} a promis de ne plus recommencer « sans me prévenir ». Compromis bizarre, mais honnête."], en: ["I told the story of my worst teen party, the one with the car in the pool. {a.first} looked at me with new respect. We cleaned together, laughing.", "Instead of yelling, I confessed my own youthful screwups. {a.first} promised not to do it again “without telling me first.” Weird compromise, but honest."] }, fx: { rel: 10, happy: 3 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai raconté mes fêtes de jeunesse. {a.first} les a trouvées « pathétiques » et m'a montré les stories de sa soirée. 140 ados, un DJ, un lama. J'ai été battu{|e} à plate couture.", "Erreur : {a.first} a enregistré mes confessions et les a envoyées à mes parents. Mamie m'a appelé{|e} pour me punir. À mon âge."], en: ["I shared my teen party stories. {a.first} found them “pathetic” and showed me the stories from {a:his|her} party. 140 teens, a DJ, a llama. I was utterly outclassed.", "Mistake: {a.first} recorded my confessions and sent them to my parents. Grandma called to punish me. At my age."] }, fx: { happy: -3, rel: 2 } },
        ],
      },
    ],
  },
  {
    id: 'f2_kid_grunts',
    icon: '🦍',
    cat: 'parenting',
    rating: 0,
    actor: 'child',
    scene: { place: 'home', mood: 'sad', prop: 'headphones' },
    when: { age: [28, 65], has: 'child', test: allKids(13, 17) },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "{a.first} communique maintenant uniquement par grognements. « Ça s'est passé comment, l'école ? » « Mmh. » « Tu veux {w:food} ? » « Hm. » Tu as élevé un ours.",
        "{a.first} t'envoie un texto depuis sa chambre, à 5 mètres : « T koi le mdp wifi ». C'est la conversation la plus longue de la semaine.",
        "Ça fait trois jours que {a.first} ne sort de sa chambre que pour piller le frigo. Sous la porte filtre {w:smell}. Tu entends parfois {w:sound}.",
        "Tu as demandé à {a.first} comment s'appelle son meilleur ami. {a:Il|Elle} t'a regardé{|e} comme si tu étais {w:animal}, a remis son casque et est parti{a:|e}.",
      ],
      en: [
        "{a.first} now communicates exclusively in grunts. “How was school?” “Mmh.” “Want some {w:food}?” “Hm.” You raised a bear.",
        "{a.first} texts you from {a:his|her} room, 15 feet away: “wats the wifi pw.” Longest conversation of the week.",
        "For three days {a.first} has only left {a:his|her} room to raid the fridge. A smell of {w:smell} seeps under the door. Sometimes you hear {w:sound}.",
        "You asked {a.first} what {a:his|her} best friend's name is. {a:He|She} looked at you like you were {w:animal}, put the headphones back on and left.",
      ],
    },
    choices: [
      {
        label: { fr: 'Couper le Wi-Fi', en: 'Cut the Wi-Fi' },
        out: [
          { w: 2, text: { fr: ["J'ai coupé le Wi-Fi. {a.first} est sorti{a:|e} de sa chambre en dix secondes et m'a parlé pendant vingt minutes. En hurlant, mais quand même.", "Wi-Fi coupé. {a.first} a découvert qu'on avait une famille. On a dîné ensemble. {a:Il|Elle} a même souri, une fois, en parlant du chat."], en: ["I cut the Wi-Fi. {a.first} came out in ten seconds and talked to me for twenty minutes. Screaming, but still.", "Wi-Fi off. {a.first} discovered we have a family. We had dinner together. {a:He|She} even smiled once, talking about the cat."] }, fx: { rel: 3, happy: 3 } },
          { w: 1, text: { fr: ["J'ai coupé le Wi-Fi. {a.first} s'est connecté{a:|e} au réseau du voisin, dont {a:il|elle} avait le mot de passe depuis deux ans. Échec.", "{a.first} a réagi à la coupure en passant en 5G avec MON forfait. Facture : 340 €."], en: ["I cut the Wi-Fi. {a.first} connected to the neighbor's network, whose password {a:he|she} had for two years. Failure.", "{a.first} responded by switching to 5G on MY phone plan. Bill: $340."] }, fx: { money: -150, stress: 4 } },
        ],
      },
      {
        label: { fr: 'Parler leur langue', en: 'Speak their language' },
        out: [
          { w: 1, text: { fr: ["J'ai envoyé un mème à {a.first}. Pas de réponse. Puis un « mdr » trois heures plus tard. C'est le plus beau message que j'aie jamais reçu.", "J'ai appris le jargon ado. J'ai dit « c'est le seum » au dîner. {a.first} a ri. Vraiment ri. Le dégel commence."], en: ["I sent {a.first} a meme. No reply. Then “lol” three hours later. The most beautiful message I've ever received.", "I learned teen slang. I said “no cap, that's mid” at dinner. {a.first} laughed. Actually laughed. The thaw begins."] }, fx: { rel: 8, happy: 4 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai essayé l'argot ado. {a.first} a rougi de honte et m'a supplié{|e} d'arrêter, avec plus de mots qu'en un mois. Victoire indirecte.", "J'ai parlé en grognements, moi aussi. On grogne maintenant tous les deux. Le chat est perturbé."], en: ["I tried teen slang. {a.first} blushed with shame and begged me to stop, using more words than in a month. Indirect victory.", "I started grunting too. Now we both grunt. The cat is confused."] }, fx: { rel: 4, happy: 2 } },
        ],
      },
      {
        label: { fr: 'Attendre que ça passe', en: 'Wait it out' },
        out: [
          { w: 2, text: { fr: ["J'ai patienté. Un soir, à 23 h, {a.first} est venu{a:|e} s'asseoir sur mon lit et m'a parlé pendant deux heures de ses peurs et de ses amours. Ça valait l'attente.", "J'ai laissé faire. Six mois plus tard, l'ours est redevenu un humain qui dit bonjour. Parfois même merci."], en: ["I waited. One night at 11 p.m., {a.first} came and sat on my bed and talked for two hours about fears and crushes. Worth the wait.", "I let it be. Six months later, the bear turned back into a human who says hello. Sometimes even thank you."] }, fx: { rel: 10, karma: 2 }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai attendu. J'attends toujours. Il paraît que ça se termine vers 25 ans.", "J'ai patienté. {a.first} a fini par sortir de sa chambre… pour aller vivre chez un pote. Le silence continue, ailleurs."], en: ["I waited. I'm still waiting. Apparently it ends around 25.", "I waited. {a.first} finally came out of the room… to go live at a friend's house. The silence continues, elsewhere."] }, fx: { happy: -3 }, mood: 'sad' },
        ],
      },
    ],
  },
  {
    id: 'f2_kid_weird_career',
    icon: '🎪',
    cat: 'parenting',
    rating: 0,
    actor: 'child',
    vars: { amount: [2000, 10000] },
    scene: { place: 'home', mood: 'shock', prop: 'diploma' },
    when: { age: [38, 75], has: 'child', test: allKids(18, 30) },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "{a.first} t'annonce qu'{a:il|elle} arrête ses études de médecine pour devenir {w:weird_job}. « C'est ma passion. » Tu as payé {$amount} de frais d'inscription cette année.",
        "Grand discours de {a.first} au dîner : {a:il|elle} part vivre {w:far_place} pour se consacrer à sa passion : {w:hobby}. À plein temps. Sans salaire. « L'argent, c'est un concept. »",
        "{a.first} a démissionné de son CDI pour se lancer dans {w:hobby} professionnel{a:|le}. {a:Il|Elle} a besoin d'un petit prêt de {$amount} pour « le matériel ».",
        "{a.first} t'apprend fièrement qu'{a:il|elle} a été embauché{a:|e} comme {w:weird_job}. Tu ne savais même pas que ce métier existait. Le salaire non plus, apparemment.",
      ],
      en: [
        "{a.first} announces {a:he|she}'s quitting med school to become {w:weird_job}. “It's my passion.” You paid {$amount} in tuition this year.",
        "Big speech from {a.first} at dinner: {a:he|she}'s moving to live {w:far_place} to devote {a:himself|herself} to {w:hobby}. Full time. No salary. “Money is a concept.”",
        "{a.first} quit a steady job to go pro in {w:hobby}. {a:He|She} needs a small loan of {$amount} “for equipment.”",
        "{a.first} proudly tells you {a:he|she} got hired as {w:weird_job}. You didn't even know that job existed. Neither does the salary, apparently.",
      ],
    },
    choices: [
      {
        label: { fr: 'Soutenir le rêve', en: 'Support the dream' },
        out: [
          { w: 1, text: { fr: ["J'ai soutenu {a.first}, et j'ai prêté {$amount}. Trois ans plus tard, {a:il|elle} est {a:le meilleur|la meilleure} du pays dans son domaine bizarre. Interview à la télé. Je pleure de fierté.", "J'ai dit « vas-y ». {a.first} a réussi au-delà de tout. {a:Il|Elle} m'a remboursé{|e} le double et m'appelle chaque dimanche pour me remercier."], en: ["I backed {a.first} and lent {$amount}. Three years later {a:he|she}'s the best in the country at that weird thing. TV interview. I cry with pride.", "I said “go for it.” {a.first} succeeded beyond everything. Paid me back double and calls every Sunday to thank me."] }, fx: { money: '-amount', rel: 15, happy: 8 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai soutenu le rêve. Le rêve a duré huit mois, puis {a.first} est revenu{a:|e} vivre dans sa chambre d'enfant. Avec le matériel. Partout.", "J'ai financé {$amount}. {a.first} a tout dépensé en un mois et m'a envoyé une carte postale. Elle est belle, au moins."], en: ["I supported the dream. The dream lasted eight months, then {a.first} moved back into {a:his|her} childhood bedroom. With the equipment. Everywhere.", "I funded {$amount}. {a.first} spent it all in a month and sent me a postcard. It's a nice postcard, at least."] }, fx: { money: '-amount', rel: 6, stress: 5 } },
        ],
      },
      {
        label: { fr: 'Exiger un plan B', en: 'Demand a plan B' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["On a négocié : la passion le week-end, un vrai boulot en semaine. {a.first} a râlé, puis compris. {a:Il|Elle} cumule les deux avec succès.", "Plan B exigé. {a.first} a fini sa formation, puis a lancé sa passion en parallèle. Sage et heureux{a:|se}. Je suis le parent le plus soulagé du monde."], en: ["We negotiated: passion on weekends, a real job on weekdays. {a.first} grumbled, then understood. Now juggles both successfully.", "Plan B required. {a.first} finished the degree, then launched the passion on the side. Wise and happy. I'm the most relieved parent on earth."] }, fx: { rel: 4, happy: 4 } },
          { w: 1, text: { fr: ["J'ai exigé un plan B. {a.first} m'a reproché de « tuer ses rêves comme papy a tué les miens ». Repas de Noël glacial.", "Mon plan B a été rejeté. {a.first} est parti{a:|e} quand même, sans un sou. On se parle par cartes postales."], en: ["I demanded a plan B. {a.first} accused me of “killing dreams like grandpa killed mine.” Icy Christmas dinner.", "My plan B was rejected. {a.first} left anyway, penniless. We communicate by postcard."] }, fx: { rel: -10, stress: 4 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Essayer moi aussi', en: 'Try it myself' },
        out: [
          { w: 1, text: { fr: ["Pour comprendre, j'ai essayé la passion de {a.first} pendant un week-end. J'ai adoré. On a monté un duo parent-enfant. On est connus dans trois départements.", "J'ai testé. C'était génial. {a.first} est ravi{a:|e} et un peu inquiet{a:|e} : je suis meilleur{|e} que {a:lui|elle}."], en: ["To understand, I tried {a.first}'s passion for a weekend. I loved it. We formed a parent-child duo. We're known in three counties.", "I tried it. It was great. {a.first} is thrilled and slightly worried: I'm better at it."] }, fx: { rel: 12, happy: 6, fame: 1 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai essayé. Je me suis blessé{|e} {w:bodypart} dès la première heure. {a.first} a dit : « C'est pour ça que c'est un métier. » Je respecte, maintenant.", "J'ai tenté le coup. J'ai été nul{|le}, ridicule et filmé{|e}. {a.first} a gagné la discussion sans dire un mot."], en: ["I tried. I hurt my {w:bodypart} in the first hour. {a.first} said: “That's why it's a profession.” I respect it now.", "I gave it a shot. I was terrible, ridiculous and filmed. {a.first} won the argument without saying a word."] }, fx: { health: -3, rel: 6 } },
        ],
      },
    ],
  },
  {
    id: 'f2_kid_partner',
    icon: '😳',
    cat: 'parenting',
    rating: 2,
    actor: 'child',
    scene: { place: 'home', mood: 'shock', prop: 'wine' },
    when: { age: [42, 85], has: 'child', test: allKids(20, 50) },
    weight: 4,
    cooldown: 8,
    text: {
      fr: [
        "{a.first} amène enfin sa nouvelle moitié dîner à la maison. Elle a ton âge. Elle connaît ton surnom d'enfance. Et c'était ton premier amour, en 1991, {w:at_place}.",
        "{a.first} te présente l'amour de sa vie : ton ancien patron, celui qui t'a viré{|e} pour avoir {w:crime_small}. Il te serre la main en souriant : « Le monde est petit, hein ? »",
        "Dîner de présentation. La nouvelle personne dans la vie de {a.first} a 38 ans de plus, roule en {w:vehicle} doré et t'appelle « {beau-papa|belle-maman} » dès l'entrée.",
        "{a.first} est raide dingue de quelqu'un rencontré sur {w:app}. Cette personne se présente : c'est ton ex-conjoint. Cette personne a apporté une bouteille de vin. Ton vin. Celui de la cave d'avant le divorce.",
      ],
      en: [
        "{a.first} finally brings the new partner home for dinner. They're your age. They know your childhood nickname. And they were your first love, in 1991, {w:at_place}.",
        "{a.first} introduces the love of {a:his|her} life: your former boss, the one who fired you for {w:crime_small}. He shakes your hand, smiling: “Small world, huh?”",
        "Meet-the-parents dinner. {a.first}'s new partner is 38 years older, drives a gold-plated {w:vehicle} and calls you “{Dad-in-law|Mom-in-law}” at the door.",
        "{a.first} is head over heels for someone from {w:app}. The person introduces themselves: it's your ex-spouse. They brought a bottle of wine. Your wine. From the cellar before the divorce.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rester digne', en: 'Stay dignified' },
        out: [
          { w: 1, text: { fr: ["J'ai été parfaitement poli{|e} tout le dîner. Puis j'ai vomi dans le lave-vaisselle quand personne ne regardait. Discrètement, avec classe.", "Dignité absolue. J'ai souri, servi le gigot et posé des questions sur leurs projets. Ils se sont séparés trois semaines plus tard. Le karma travaille pour moi."], en: ["I was perfectly polite all dinner. Then I threw up in the dishwasher when nobody was looking. Discreetly, with class.", "Absolute dignity. I smiled, served the lamb and asked about their plans. They broke up three weeks later. Karma works for me."] }, fx: { karma: 4, stress: 6, rel: 6 }, mood: 'sick' },
          { w: 1, text: { fr: ["J'ai gardé mon calme. Puis ils ont annoncé leurs fiançailles au dessert. J'ai avalé ma cuillère. Littéralement, la petite. Radio aux urgences.", "Dignité tenue jusqu'à ce que la nouvelle moitié me demande « Alors, toujours ce grain de beauté sur la fesse ? ». J'ai lâché le plat."], en: ["I stayed calm. Then they announced their engagement at dessert. I swallowed my spoon. Literally, the little one. ER X-ray.", "Dignity held until the new partner asked “So, still got that mole on your butt?” I dropped the dish."] }, fx: { health: -4, stress: 8 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Tout révéler', en: 'Reveal everything' },
        out: [
          { w: 1, text: { fr: ["J'ai tout raconté à {a.first}, en détail, avec photos d'époque. {a:Il|Elle} a regardé sa moitié, puis moi, puis a vomi dans la saucière. Rupture le soir même.", "J'ai lâché la bombe. {a.first} a mis 30 secondes à comprendre, puis a hurlé « BEURK » si fort que le chien s'est caché. Couple dissous. Thérapie familiale réservée."], en: ["I told {a.first} everything, in detail, with vintage photos. {a:He|She} looked at the partner, then at me, then threw up in the gravy boat. Breakup that night.", "I dropped the bomb. {a.first} took 30 seconds to process, then yelled “EWWW” so loud the dog hid. Couple dissolved. Family therapy booked."] }, fx: { rel: -6, happy: 3, stress: 4 }, mood: 'sick' },
          { w: 1, text: { fr: ["J'ai tout révélé. {a.first} a haussé les épaules : « On sait. On trouve que ça fait une jolie histoire. » Je suis {le seul|la seule} que ça choque, apparemment.", "Révélation faite. Ils sont restés ensemble. Au mariage, j'ai dû porter un badge « parent de l'un, ex de l'autre ». Ambiance."], en: ["I revealed everything. {a.first} shrugged: “We know. We think it's a sweet story.” Apparently I'm the only one who's shocked.", "Revealed. They stayed together. At the wedding I had to wear a badge saying “parent of one / ex of the other.” Lovely atmosphere."] }, fx: { happy: -8, stress: 6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Saboter discrètement', en: 'Quietly sabotage' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai glissé quelques anecdotes « innocentes » sur les défauts de la personne. Ronflements, avarice, pieds qui puent. {a.first} a ouvert les yeux en deux semaines.", "Sabotage subtil : j'ai invité la personne à un repas de famille avec tonton Gérard. Elle a fui avant le fromage."], en: ["I slipped in a few “innocent” anecdotes about the person's flaws. Snoring, stinginess, smelly feet. {a.first} saw the light in two weeks.", "Subtle sabotage: I invited the person to a family dinner with Uncle Gérard. They fled before the cheese."] }, fx: { karma: -3, happy: 4, rel: 2 } },
          { w: 1, text: { fr: ["{a.first} a découvert mon sabotage et ne m'a pas invité{|e} au mariage. J'ai regardé la cérémonie en direct sur Instagram, seul{|e}, avec {w:drink}.", "Le sabotage s'est retourné contre moi : ils se sont rapprochés « contre l'adversité ». C'est-à-dire contre moi."], en: ["{a.first} discovered my sabotage and didn't invite me to the wedding. I watched the ceremony live on Instagram, alone, with {w:drink}.", "The sabotage backfired: they grew closer “in the face of adversity.” Meaning me."] }, fx: { rel: -15, happy: -6 }, mood: 'cry' },
        ],
      },
    ],
  },
  {
    id: 'f2_kid_grandkid_name',
    icon: '👶',
    cat: 'parenting',
    rating: 0,
    actor: 'child',
    scene: { place: 'hospital', mood: 'shock', prop: 'baby' },
    when: { age: [42, 85], has: 'child', test: allKids(22, 50) },
    weight: 5,
    cooldown: 6,
    text: {
      fr: [
        "{a.first} vient d'avoir un bébé. Tu es grand-parent ! Le prénom : « {w:brand} ». Comme la marque. « C'est original. » Le bébé te regarde avec l'air de dire « aide-moi ».",
        "Ton petit-enfant est né. {a.first} t'annonce le prénom avec fierté : « Kaïden-Brooklyn-{w:nickname} ». Tu dois le répéter trois fois. Tu n'y arrives pas.",
        "À la maternité, {a.first} te met le bébé dans les bras : « Je te présente {w:celeb}. Enfin, c'est son prénom maintenant. » Tu souris très fort.",
        "{a.first} a choisi pour son bébé un prénom « inspiré de la nature » : Tempête-Lavande. Tu as {w:gift} dans les mains, avec le mauvais prénom brodé dessus.",
      ],
      en: [
        "{a.first} just had a baby. You're a grandparent! The name: “{w:brand}.” Like the brand. “It's original.” The baby looks at you like it's saying “help me.”",
        "Your grandchild is born. {a.first} proudly announces the name: “Kayden-Brooklyn-{w:nickname}.” You have to repeat it three times. You can't.",
        "At the maternity ward, {a.first} puts the baby in your arms: “Meet {w:celeb}. I mean, that's the name now.” You smile very hard.",
        "{a.first} picked a “nature-inspired” name for the baby: Storm-Lavender. You're holding {w:gift} with the wrong name embroidered on it.",
      ],
    },
    choices: [
      {
        label: { fr: 'Adorer le prénom', en: 'Love the name' },
        out: [
          { w: 2, text: { fr: ["J'ai dit que c'était magnifique. {a.first} a pleuré de bonheur. Le bébé a fait un rot. Je pense que c'était un commentaire.", "« Quel joli prénom ! » Mensonge de grand-parent, le plus noble de tous. {a.first} m'a nommé{|e} baby-sitter officiel{|le}."], en: ["I said it was beautiful. {a.first} cried with joy. The baby burped. I think it was a comment.", "“What a lovely name!” A grandparent's lie, the noblest of all. {a.first} named me official babysitter."] }, fx: { rel: 10, happy: 5 }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai fait semblant d'adorer. Résultat : {a.first} veut appeler le deuxième bébé comme moi, mais avec un tréma et un « y ». Tout est de ma faute.", "J'ai tellement aimé le prénom que {a.first} m'a demandé{|e} de le faire tatouer. J'ai dit oui par politesse. J'ai maintenant « Tempête-Lavande » sur l'épaule."], en: ["I pretended to love it. Result: {a.first} wants to name the second baby after me, but with an umlaut and a “y.” It's all my fault.", "I loved the name so much that {a.first} asked me to get it tattooed. I said yes to be polite. I now have “Storm-Lavender” on my shoulder."] }, fx: { rel: 8, happy: -2 } },
        ],
      },
      {
        label: { fr: 'Inventer un surnom', en: 'Invent a nickname' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai trouvé un surnom tout doux. Toute la famille l'a adopté. Le bébé grandira sans savoir son vrai prénom avant l'école. Je l'ai sauvé{|e}.", "Mon surnom a pris. Le bébé y répond. {a.first} a fini par l'utiliser aussi, en soupirant. Victoire de grand-parent."], en: ["I came up with a soft nickname. The whole family adopted it. The baby will grow up not knowing the real name until school. I saved them.", "My nickname stuck. The baby responds to it. {a.first} ended up using it too, with a sigh. Grandparent victory."] }, fx: { rel: 4, happy: 4 } },
          { w: 1, text: { fr: ["{a.first} a interdit mon surnom : « Tu ne respectes pas nos choix. » Je dis le vrai prénom en grimaçant à chaque fois. Le bébé le sent.", "Mon surnom a été jugé « ringard ». {a.first} a lancé un débat sur le groupe familial. 48 messages. Le bébé dort, lui."], en: ["{a.first} banned my nickname: “You don't respect our choices.” I say the real name with a grimace every time. The baby can tell.", "My nickname was deemed “old-fashioned.” {a.first} started a debate in the family group. 48 messages. The baby is asleep."] }, fx: { rel: -5 } },
        ],
      },
      {
        label: { fr: 'Dire franchement', en: 'Say it straight' },
        out: [
          { w: 1, text: { fr: ["J'ai dit franchement que l'enfant allait en baver à l'école. {a.first} a réfléchi… et ajouté un deuxième prénom normal. Compromis honorable.", "Franchise de grand-parent. {a.first} a ri : « On voulait voir ta tête. Il s'appelle Paul. » Je me suis assis{|e}, soulagé{|e}."], en: ["I said straight out the kid would suffer at school. {a.first} thought about it… and added a normal middle name. Honorable compromise.", "Grandparent honesty. {a.first} laughed: “We wanted to see your face. His name is Paul.” I sat down, relieved."] }, fx: { rel: 4, happy: 5 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai dit ce que je pensais. {a.first} m'a interdit de voir le bébé pendant un mois. J'ai envoyé des fleurs et une lettre d'excuses. Avec le bon prénom, bien orthographié.", "Ma franchise a créé un froid polaire. Je regarde les photos du bébé sur Instagram, comme un inconnu."], en: ["I said what I thought. {a.first} banned me from seeing the baby for a month. I sent flowers and an apology letter. With the name spelled right.", "My honesty created a polar chill. I look at baby photos on Instagram, like a stranger."] }, fx: { rel: -12, happy: -5 }, mood: 'sad' },
        ],
      },
    ],
  },
  {
    id: 'f2_kid_measure_house',
    icon: '📏',
    cat: 'parenting',
    rating: 2,
    actor: 'child',
    scene: { place: 'home', mood: 'angry', prop: 'tape' },
    when: { age: [62, 100], has: 'child', test: allKids(25, 80) },
    weight: 5,
    cooldown: 6,
    text: {
      fr: [
        "Tu surprends {a.first} en train de mesurer ton salon au mètre ruban, en chuchotant au téléphone : « Oui, on cassera ce mur quand… enfin, plus tard. » Tu es assis{|e} dans ton fauteuil. Vivant{|e}.",
        "Pour ton anniversaire, {a.first} t'offre {w:gift} et une brochure pour une maison de retraite « avec piscine ». Le dossier d'inscription est déjà pré-rempli. Signé, même.",
        "{a.first} a mis des post-it sur tes meubles : « moi », « moi », « à vendre », « poubelle ». Il y en a un sur ton chat. Il y en a un sur toi : « à voir ».",
        "Tu tousses une fois au dîner. {a.first} sort aussitôt son téléphone et demande, l'air de rien : « Au fait, le notaire, c'est toujours le même ? » Tes petits-enfants regardent tes bijoux.",
      ],
      en: [
        "You catch {a.first} measuring your living room with a tape measure, whispering into the phone: “Yes, we'll knock down this wall once… well, later.” You're sitting right there in your armchair. Alive.",
        "For your birthday, {a.first} gives you {w:gift} and a brochure for a retirement home “with a pool.” The application is already filled out. Signed, even.",
        "{a.first} put sticky notes on your furniture: “mine,” “mine,” “sell,” “trash.” There's one on your cat. There's one on you: “TBD.”",
        "You cough once at dinner. {a.first} immediately pulls out a phone and asks casually: “By the way, is the lawyer still the same one?” Your grandkids are eyeing your jewelry.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout dépenser', en: 'Spend it all' },
        out: [
          { w: 2, text: { fr: ["J'ai vendu la maison, acheté un camping-car et je sillonne les routes avec une bande d'amis de 81 ans. Dernière carte postale : {w:far_place}. J'envoie des cartes postales à {a.first} : « Il ne restera rien. Bisous. »", "J'ai claqué l'héritage en croisières, en champagne et en cours de salsa. {a.first} a fait une crise de nerfs. Moi, une crise de rire."], en: ["I sold the house, bought an RV and I'm touring with a gang of 81-year-old friends. Last postcard: {w:far_place}. I send {a.first} postcards: “There'll be nothing left. Love.”", "I blew the inheritance on cruises, champagne and salsa lessons. {a.first} had a meltdown. I had a laughing fit."] }, fx: { happy: 12, rel: -10, money: -15000 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai commencé à tout dépenser. Puis je me suis cassé le col du fémur en dansant la salsa. {a.first} m'a soigné{|e} avec un sourire de vautour. Mais m'a soigné{|e}.", "Grand plan « tout dépenser ». J'ai acheté une Porsche. Je l'ai plantée dans le portail le premier jour. Il reste de l'héritage, finalement."], en: ["I started spending it all. Then broke my hip dancing salsa. {a.first} nursed me with a vulture's smile. But nursed me.", "Big “spend it all” plan. I bought a Porsche. Crashed it into the gate on day one. Turns out there's still inheritance left."] }, fx: { health: -10, money: -8000, happy: 2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Changer le testament', en: 'Change the will' },
        out: [
          { w: 1, text: { fr: ["J'ai légué toute ma fortune au refuge, et plus précisément à son pensionnaire préféré : {w:animal}. J'ai envoyé une copie à {a.first} par recommandé. Je ne l'ai jamais vu{a:|e} aussi attentionné{a:|e} depuis.", "Nouveau testament : tout ira à la personne qui me rendra visite le plus souvent. {a.first} vient tous les jours. Avec des fleurs. Ça marche du feu de dieu."], en: ["I left my entire fortune to the animal shelter, specifically to its favorite resident: {w:animal}. I sent {a.first} a copy by certified mail. {a:He|She} has never been so attentive since.", "New will: everything goes to whoever visits me most. {a.first} comes every day. With flowers. Works like a charm."] }, fx: { rel: 8, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai changé le testament en faveur de mon aide-soignant. {a.first} a engagé un avocat et un détective. Le détective a déterré une vieille liaison de 1987. Guerre totale.", "J'ai modifié le testament par vengeance. {a.first} l'a appris et a fait un malaise. On s'est retrouvés tous les deux aux urgences, dans des lits voisins. On a fini par rire."], en: ["I changed the will in favor of my caregiver. {a.first} hired a lawyer and a private investigator. The PI dug up a 1987 affair of mine. All-out war.", "I changed the will out of spite. {a.first} found out and fainted. We ended up in neighboring ER beds. We ended up laughing."] }, fx: { rel: -8, stress: 6 } },
        ],
      },
      {
        label: { fr: 'Faire le mort', en: 'Fake my death' },
        out: [
          { w: 1, text: { fr: ["J'ai fait semblant de m'effondrer au dîner. {a.first} a sorti un mètre ruban avant d'appeler le SAMU. J'ai ouvert un œil. Le regard qu'on a échangé restera dans l'histoire.", "J'ai joué le mort dans mon fauteuil. {a.first} a fondu en larmes, des vraies, et a crié « je t'aime ». Je me suis relevé{|e}. Câlin long, et une gifle méritée."], en: ["I faked a collapse at dinner. {a.first} pulled out a tape measure before calling the ambulance. I opened one eye. The look we exchanged will go down in history.", "I played dead in my armchair. {a.first} burst into tears, real ones, and cried “I love you.” I sat up. Long hug, and a well-deserved slap."] }, fx: { rel: 6, happy: 5 }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai fait le mort trop bien. Les pompiers m'ont massé le cœur et cassé deux côtes. {a.first} a filmé. La vidéo s'appelle « {Papy|Mamie} ressuscite (encore) ».", "Mon numéro a été si réaliste que {a.first} a fait une crise de panique et s'est cogné la tête contre la table. Sang sur la nappe. On a fini à deux aux urgences."], en: ["I played dead too well. The paramedics did CPR and broke two of my ribs. {a.first} filmed it. The video is called “Grandparent Resurrects (Again).”", "My act was so realistic {a.first} had a panic attack and banged {a:his|her} head on the table. Blood on the tablecloth. We both ended up in the ER."] }, fx: { health: -8, rel: -4, visual: 'gore' }, mood: 'shock' },
        ],
      },
    ],
  },
  // ───────────────────────────── in-laws ─────────────────────────────
  {
    id: 'f2_inlaw_first_dinner',
    icon: '🍷',
    cat: 'love',
    rating: 1,
    actor: 'spouse',
    scene: { place: 'villa', mood: 'shock', prop: 'wine' },
    when: { age: [20, 60], has: 'spouse', noFlag: 'f2_inlaw_war' },
    weight: 6,
    cooldown: 8,
    text: {
      fr: [
        "Dîner chez les parents de {a.first}. Ton beau-père te fixe en découpant le rôti avec un couteau de chasse. Ta belle-mère demande « et vous faites quoi, exactement ? » pour la troisième fois.",
        "Premier vrai repas avec ta belle-famille. Ils servent {w:food}, que tu détestes. Ta belle-mère surveille ton assiette. {a.first} te fait des yeux suppliants sous la table.",
        "La mère de {a.first} sort l'album photo de son enfance et pointe chaque ex : « Lui, il était médecin. Elle, avocate. Et toi, tu es… {job}. » Silence.",
        "Chez tes beaux-parents, tout est blanc : les murs, le canapé, la moquette. On te tend un verre de vin rouge plein à ras bord. {a.first} retient son souffle.",
      ],
      en: [
        "Dinner at {a.first}'s parents'. Your father-in-law stares at you while carving the roast with a hunting knife. Your mother-in-law asks “and what is it you do, exactly?” for the third time.",
        "First real meal with the in-laws. They serve {w:food}, which you hate. Your mother-in-law watches your plate. {a.first} gives you pleading eyes under the table.",
        "{a.first}'s mother pulls out the childhood photo album and points at every ex: “That one was a doctor. That one, a lawyer. And you're… {job}.” Silence.",
        "At your in-laws', everything is white: the walls, the couch, the carpet. Someone hands you a glass of red wine filled to the brim. {a.first} holds {a:his|her} breath.",
      ],
    },
    choices: [
      {
        label: { fr: 'Charmer à fond', en: 'Turn on the charm' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["J'ai complimenté le rôti, la maison et les chaussures de ma belle-mère. Elle a rougi. Mon beau-père m'a montré sa collection de timbres. Je suis adopté{|e}.", "Opération séduction réussie. À la fin du repas, ma belle-mère m'appelait « mon petit » et proposait de me tricoter un pull. {a.first} n'en revient pas."], en: ["I complimented the roast, the house and my mother-in-law's shoes. She blushed. My father-in-law showed me his stamp collection. I'm adopted.", "Charm offensive successful. By the end of dinner my mother-in-law was calling me “sweetie” and offering to knit me a sweater. {a.first} can't believe it."] }, fx: { rel: 8, happy: 5 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'en ai trop fait. Ma belle-mère a cru que je la draguais. Mon beau-père a reposé son couteau de chasse très lentement. Nous sommes ennemis.", "Trop de charme : j'ai renversé le vin rouge sur le canapé blanc en faisant un grand geste. La tache a la forme de mon avenir dans cette famille."], en: ["I overdid it. My mother-in-law thought I was hitting on her. My father-in-law set down the hunting knife very slowly. We are enemies.", "Too much charm: I spilled the red wine on the white couch with a big gesture. The stain is shaped like my future in this family."] }, fx: { rel: -6, stress: 6, flag: 'f2_inlaw_war' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Être moi-même', en: 'Just be myself' },
        out: [
          { w: 1, text: { fr: ["J'ai été moi-même : blagues nulles, rire trop fort, appétit d'ogre. Mon beau-père a éclaté de rire. Il était comme moi, avant le mariage.", "Authenticité totale. Ma belle-mère m'a trouvé{|e} « rafraîchissant{|e} ». C'est un compliment, je crois. {a.first} m'a embrassé{|e} dans la voiture."], en: ["I was myself: bad jokes, laughing too loud, the appetite of an ogre. My father-in-law burst out laughing. He used to be like me, before marriage.", "Total authenticity. My mother-in-law found me “refreshing.” A compliment, I think. {a.first} kissed me in the car."] }, fx: { rel: 6, happy: 4 } },
          { w: 1, text: { fr: ["Être moi-même incluait, apparemment, parler politique au fromage. Mon beau-père est persuadé {w:conspiracy}. On a crié. On ne se parle plus.", "J'ai été naturel{|le}. Trop. J'ai lâché un rot sonore au dessert et dit « {w:swear} » quand j'ai fait tomber ma fourchette. Ma belle-mère a prié."], en: ["Being myself, apparently, included talking politics over cheese. My father-in-law is convinced {w:conspiracy}. We yelled. We no longer speak.", "I was natural. Too natural. I let out a loud burp at dessert and said “{w:swear}” when I dropped my fork. My mother-in-law prayed."] }, fx: { rel: -4, stress: 5, flag: 'f2_inlaw_war' }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Fuir aux toilettes', en: 'Hide in the bathroom' },
        out: [
          { w: 1, text: { fr: ["Je me suis réfugié{|e} 25 minutes aux toilettes. J'ai découvert leur magazine préféré, des revues de chasse. J'ai eu des sujets de conversation pour la suite. Sauvé{|e}.", "Pause toilettes stratégique. J'y ai croisé le chien de la famille, qui fuyait aussi. On est amis maintenant. C'est mon seul allié."], en: ["I hid in the bathroom for 25 minutes. I discovered their favorite magazines: hunting reviews. I had conversation topics for the rest of the night. Saved.", "Strategic bathroom break. I met the family dog in there, also hiding. We're friends now. My only ally."] }, fx: { happy: 2, rel: 2 } },
          { w: 1, text: { fr: ["Je suis resté{|e} trop longtemps aux toilettes. En sortant, toute la famille était persuadée que j'avais la diarrhée. Ma belle-mère m'a donné du charbon. Devant tout le monde.", "J'ai bouché les toilettes de mes beaux-parents. Pas de ventouse. J'ai dû appeler {a.first} à l'aide. Mon beau-père est venu aussi. Avec un regard que je n'oublierai jamais."], en: ["I stayed in the bathroom too long. When I came out, the whole family was convinced I had diarrhea. My mother-in-law gave me charcoal pills. In front of everyone.", "I clogged my in-laws' toilet. No plunger. I had to call {a.first} for help. My father-in-law came too. With a look I'll never forget."] }, fx: { happy: -6, rel: -2, flag: 'f2_inlaw_war' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'f2_inlaw_war',
    icon: '⚔️',
    cat: 'love',
    rating: 2,
    actor: 'spouse',
    scene: { place: 'home', mood: 'angry', prop: 'turkey' },
    when: { age: [20, 75], has: 'spouse', flag: 'f2_inlaw_war' },
    weight: 9,
    cooldown: 3,
    text: {
      fr: [
        "La guerre froide avec ta belle-mère continue. Ce Noël, elle t'a offert {w:gift} avec une carte : « Pour {first}, en espérant que tu t'améliores. » {a.first} fait semblant de ne pas avoir lu.",
        "Ta belle-mère débarque à l'improviste, passe un doigt ganté de blanc sur ton étagère et le montre à {a.first} comme une pièce à conviction. « Mon pauvre enfant. »",
        "Repas de famille chez tes beaux-parents. Ton beau-père a placé ta chaise à côté de la porte des toilettes. Ta portion est deux fois plus petite. Il te sourit.",
        "Ta belle-mère a ouvert un groupe WhatsApp « Les vrais amis de {a.first} ». Tu n'y es pas. Tu le sais parce que {a.first} a laissé son téléphone ouvert sur une photo de toi, entourée en rouge.",
      ],
      en: [
        "The cold war with your mother-in-law continues. This Christmas she gave you {w:gift} with a card: “For {first}, hoping you'll improve.” {a.first} pretends not to have read it.",
        "Your mother-in-law drops by unannounced, runs a white-gloved finger over your shelf and shows it to {a.first} like evidence. “My poor child.”",
        "Family dinner at your in-laws'. Your father-in-law put your chair next to the bathroom door. Your portion is half the size. He smiles at you.",
        "Your mother-in-law started a group chat called “{a.first}'s Real Friends.” You're not in it. You know because {a.first} left the phone open on a photo of you, circled in red.",
      ],
    },
    choices: [
      {
        label: { fr: 'Contre-attaque', en: 'Counter-attack' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai cuisiné sa propre recette, en mieux, devant toute la famille. Les compliments ont plu. Ma belle-mère a goûté, a pâli et a dit « pas mal ». Victoire historique.", "J'ai offert à ma belle-mère un cadeau parfait, réfléchi, émouvant. Elle n'a rien trouvé à redire. Elle est furieuse. Je suis ravi{|e}."], en: ["I cooked her own recipe, better, in front of the whole family. Compliments rained down. My mother-in-law tasted it, went pale and said “not bad.” Historic victory.", "I gave my mother-in-law a perfect, thoughtful, moving gift. She couldn't find anything to criticize. She's furious. I'm delighted."] }, fx: { happy: 6, rel: 4, unflag: 'f2_inlaw_war' }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai mis un laxatif dans sa verveine. Elle a passé la soirée de Noël enfermée aux toilettes en chantant pour couvrir les bruits. Tout le monde a entendu quand même. {a.first} sait que c'est moi.", "Contre-attaque ratée : j'ai voulu échanger les verres pour lui faire boire du vinaigre. Je me suis trompé{|e}. J'ai craché du vinaigre sur la nappe brodée de 1902."], en: ["I put laxatives in her herbal tea. She spent Christmas Eve locked in the bathroom, singing to cover the noises. Everyone heard anyway. {a.first} knows it was me.", "Counter-attack failed: I tried to swap glasses so she'd drink vinegar. I mixed them up. I spat vinegar all over the embroidered 1902 tablecloth."] }, fx: { rel: -10, karma: -5, happy: 3, visual: 'poop' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Exiger que {a.first} choisisse', en: 'Make them pick a side' },
        out: [
          { w: 1, text: { fr: ["J'ai posé un ultimatum à {a.first}. {a:Il|Elle} a appelé sa mère et lui a dit d'arrêter. Silence de trois jours, puis une tarte aux pommes déposée devant ma porte. La paix, à sa manière.", "{a.first} a choisi mon camp, enfin. Sa mère a pleuré, son père a grogné, mais les attaques ont cessé. Je suis aimé{|e}, officiellement."], en: ["I gave {a.first} an ultimatum. {a:He|She} called {a:his|her} mother and told her to stop. Three days of silence, then an apple pie left at my door. Peace, her way.", "{a.first} finally took my side. {a:His|Her} mother cried, {a:his|her} father grumbled, but the attacks stopped. I'm officially loved."] }, fx: { rel: 10, happy: 6, unflag: 'f2_inlaw_war' }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai exigé que {a.first} choisisse. {a:Il|Elle} a hésité. Trois secondes. C'était trois secondes de trop. On a dormi dos à dos pendant un mois.", "Ultimatum posé. {a.first} est allé{a:|e} dormir chez ses parents « pour réfléchir ». Ma belle-mère m'a envoyé une photo d'{a:lui|elle} en pyjama sur leur canapé. Avec un clin d'œil."], en: ["I made {a.first} choose. {a:He|She} hesitated. Three seconds. Three seconds too many. We slept back to back for a month.", "Ultimatum issued. {a.first} went to sleep at {a:his|her} parents' “to think.” My mother-in-law sent me a photo of {a:him|her} in pajamas on their couch. With a wink emoji."] }, fx: { rel: -12, happy: -6 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Tuer par la gentillesse', en: 'Kill with kindness' },
        out: [
          { w: 2, odds: { karma: 1 }, text: { fr: ["J'ai été d'une gentillesse insupportable. Fleurs, appels, compliments. Ma belle-mère a craqué au bout de trois mois : « Bon, ça va, tu es gentil{|le}. » Traité de paix signé autour d'un café.", "Gentillesse inlassable. Ma belle-mère a fini par m'inviter seul{|e} à déjeuner. Elle m'a raconté sa propre belle-mère, un monstre. On a ri. Alliance improbable."], en: ["I was unbearably kind. Flowers, calls, compliments. My mother-in-law cracked after three months: “Fine, you're nice.” Peace treaty signed over coffee.", "Relentless kindness. My mother-in-law eventually invited me to lunch alone. She told me about her own mother-in-law, a monster. We laughed. Unlikely alliance."] }, fx: { rel: 8, karma: 4, unflag: 'f2_inlaw_war' }, mood: 'happy' },
          { w: 1, text: { fr: ["Ma gentillesse a été interprétée comme de l'hypocrisie. Ma belle-mère a dit à toute la famille que je « préparais quelque chose ». Je ne préparais rien. Maintenant, si.", "J'ai été adorable. Elle a été odieuse. J'ai craqué au bout d'une semaine en lui disant ses quatre vérités, devant le gâteau d'anniversaire de mamie."], en: ["My kindness was read as hypocrisy. My mother-in-law told the whole family I was “planning something.” I wasn't. Now I am.", "I was adorable. She was awful. I snapped after a week and told her exactly what I thought, in front of grandma's birthday cake."] }, fx: { stress: 6, rel: -4 } },
        ],
      },
    ],
  },
  {
    id: 'f2_inlaw_swingers',
    icon: '🍍',
    cat: 'love',
    rating: 2,
    actor: 'spouse',
    scene: { place: 'villa', mood: 'shock', prop: 'pineapple' },
    when: { age: [25, 70], has: 'spouse' },
    weight: 3,
    once: true,
    text: {
      fr: [
        "Tes beaux-parents vous invitent, {a.first} et toi, à une « soirée entre amis » chez eux. Il y a un ananas à l'envers sur la porte, une bassine de clés de voiture à l'entrée et de la musique d'ambiance très suggestive.",
        "Week-end chez les parents de {a.first}. Dans la salle de bains, tu trouves une boîte « soirées du samedi » contenant des menottes, un masque vénitien et {w:object}. La belle-mère passe la tête : « Ah, tu as trouvé nos jouets ! »",
        "Le père de {a.first} te prend à part, un verre à la main ({w:drink}) : « Tu sais, avec ma femme, on est très… ouverts. Si un jour vous voulez essayer, on organise des soirées. » {a.first} est juste à côté.",
        "Ta belle-mère t'ajoute par erreur dans un groupe WhatsApp nommé « Les Libertins du Samedi ». Photo de profil : elle, en peignoir, avec un clin d'œil. 46 membres.",
      ],
      en: [
        "Your in-laws invite you and {a.first} to a “get-together with friends” at their place. There's an upside-down pineapple on the door, a bowl of car keys by the entrance and very suggestive mood music.",
        "Weekend at {a.first}'s parents'. In the bathroom you find a box labeled “Saturday nights” containing handcuffs, a Venetian mask and {w:object}. Your mother-in-law pokes her head in: “Oh, you found our toys!”",
        "{a.first}'s father pulls you aside, a glass of {w:drink} in hand: “You know, my wife and I are very… open. If you two ever want to try, we host parties.” {a.first} is standing right there.",
        "Your mother-in-law accidentally adds you to a group chat called “Saturday Swingers.” Profile picture: her, in a bathrobe, winking. 46 members.",
      ],
    },
    choices: [
      {
        label: { fr: 'Fuir immédiatement', en: 'Flee immediately' },
        out: [
          { w: 2, text: { fr: ["J'ai attrapé {a.first} par le bras et on a couru jusqu'à la voiture sans dire au revoir. On n'en a jamais reparlé. On ne mange plus jamais d'ananas.", "Fuite instantanée. Dans la voiture, {a.first} et moi n'avons pas dit un mot pendant 40 km. Puis on a éclaté de rire jusqu'à pleurer. Ça nous a soudés."], en: ["I grabbed {a.first} by the arm and we ran to the car without saying goodbye. We never spoke of it again. We never eat pineapple anymore.", "Instant escape. In the car, {a.first} and I didn't say a word for 25 miles. Then we burst out laughing until we cried. It brought us closer."] }, fx: { rel: 6, happy: 2, stress: 4 }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai fui, mais j'avais laissé mes clés dans la bassine à l'entrée. J'ai dû revenir les chercher. Un monsieur en string léopard me les a tendues en me faisant un clin d'œil.", "En fuyant, j'ai trébuché sur un pouf en forme de cœur et je suis tombé{|e} dans le jacuzzi. Il était occupé. Par mon beau-père."], en: ["I fled, but I'd left my keys in the bowl at the entrance. I had to go back for them. A man in a leopard thong handed them to me with a wink.", "While fleeing, I tripped over a heart-shaped ottoman and fell into the hot tub. It was occupied. By my father-in-law."] }, fx: { happy: -6, stress: 8 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Rester poli, sobre', en: 'Stay polite, sober' },
        out: [
          { w: 1, text: { fr: ["Je suis resté{|e} poli{|e}, j'ai bu un jus d'orange et parlé jardinage avec un couple très souriant. Je suis parti{|e} à 21 h. Rien vu, rien entendu, tout compris.", "Politesse de façade. J'ai mangé trois feuilletés, dit « non merci » quarante fois, et appris qu'un ancien ministre fréquente leurs soirées. Information précieuse."], en: ["I stayed polite, drank orange juice and talked gardening with a very smiley couple. Left at 9 p.m. Saw nothing, heard nothing, understood everything.", "Polite facade. I ate three pastries, said “no thanks” forty times and learned a former minister attends their parties. Valuable information."] }, fx: { stress: 4, smarts: 1 } },
          { w: 1, text: { fr: ["Je suis resté{|e} par politesse. Ma belle-mère m'a présenté{|e} à tout le monde comme « la chair fraîche ». J'ai fait semblant d'avoir une gastro et je suis parti{|e} en courant.", "Rester poli{|e} a été mal interprété : on m'a tendu un masque vénitien et une serviette. J'ai dit que j'avais un train. Il était 23 h. Il n'y a pas de gare."], en: ["I stayed to be polite. My mother-in-law introduced me to everyone as “fresh meat.” I faked a stomach bug and ran out.", "Staying polite was misread: someone handed me a Venetian mask and a towel. I said I had a train to catch. It was 11 p.m. There's no train station."] }, fx: { happy: -5, stress: 8 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'En parler à {a.first}', en: 'Talk to {a.first} about it' },
        out: [
          { w: 1, text: { fr: ["{a.first} était au courant depuis l'adolescence : « Pourquoi tu crois que je dormais chez des copains tous les samedis ? » On a décidé de les aimer… de loin.", "J'en ai parlé avec {a.first}, qui a pris ça avec philosophie : « Au moins, ils sont heureux. » On a fixé une règle : on ne dort plus jamais chez eux."], en: ["{a.first} had known since adolescence: “Why do you think I slept at friends' every Saturday?” We decided to love them… from a distance.", "I talked to {a.first}, who took it philosophically: “At least they're happy.” We set one rule: we never sleep over there again."] }, fx: { rel: 8, happy: 3 }, mood: 'love' },
          { w: 1, text: { fr: ["{a.first} a été traumatisé{a:|e}. On a dû payer six séances de psy. Le psy a demandé l'adresse des soirées « pour une amie ».", "J'en ai parlé. {a.first} n'en savait rien et a fait une crise de nerfs. Depuis, chaque repas de famille ressemble à une prise d'otages polie."], en: ["{a.first} was traumatized. We had to pay for six therapy sessions. The therapist asked for the party address “for a friend.”", "I brought it up. {a.first} had no idea and had a meltdown. Since then, every family dinner feels like a polite hostage situation."] }, fx: { rel: 2, stress: 6, money: -400 } },
        ],
      },
    ],
  },
  {
    id: 'f2_inlaw_xmas_choice',
    icon: '🎄',
    cat: 'love',
    rating: 1,
    actor: 'spouse',
    scene: { place: 'home', mood: 'angry', prop: 'tree' },
    when: { age: [22, 75], has: 'spouse' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Décembre. La question qui tue : Noël chez tes parents ou chez ceux de {a.first} ? Les deux mères ont déjà acheté la dinde. {a.first} te regarde comme si c'était toi, la dinde.",
        "{a.first} a promis Noël à sa famille. Tu as promis Noël à la tienne. Personne ne l'a dit à l'autre. Il reste neuf jours et deux dindes de 7 kg.",
        "Ta belle-mère appelle {a.first} : « Cette année, c'est chez nous, évidemment. L'an dernier, c'était chez eux, et tu as été malade. » Tu n'as rien à voir avec la gastro de l'an dernier. Enfin, presque rien.",
        "Négociations de Noël avec {a.first}. Sur la table : un tableau Excel, l'historique des cinq derniers Noëls et un argument massue de ta part : « Ma mère a préparé {w:food}. »",
      ],
      en: [
        "December. The killer question: Christmas at your parents' or at {a.first}'s? Both mothers have already bought the turkey. {a.first} looks at you like you're the turkey.",
        "{a.first} promised Christmas to {a:his|her} family. You promised Christmas to yours. Nobody told the other. Nine days left and two 15-pound turkeys.",
        "Your mother-in-law calls {a.first}: “This year it's at ours, obviously. Last year it was at theirs and you got sick.” You had nothing to do with last year's stomach bug. Well, almost nothing.",
        "Christmas negotiations with {a.first}. On the table: a spreadsheet, the history of the last five Christmases and your killer argument: “My mom made {w:food}.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire les deux', en: 'Do both' },
        out: [
          { w: 1, text: { fr: ["Réveillon chez les uns, déjeuner chez les autres, 400 km entre les deux. Deux dindes, trois bûches, zéro sommeil. On a vomi sur une aire d'autoroute. Joyeux Noël.", "Double Noël. J'ai mangé deux repas de six plats. J'ai pris 3 kg en 24 h. Tout le monde est content, sauf mon pantalon."], en: ["Christmas Eve at one family's, lunch at the other's, 250 miles apart. Two turkeys, three Yule logs, zero sleep. We threw up at a highway rest stop. Merry Christmas.", "Double Christmas. I ate two six-course meals. Gained 6 pounds in 24 hours. Everyone's happy except my pants."] }, fx: { rel: 6, weight: 0.03, health: -2, stress: 5 }, mood: 'sick' },
          { w: 1, text: { fr: ["On a voulu faire les deux. Tempête de neige, voiture bloquée, réveillon dans une station-service avec un routier et {w:food} sous cellophane. Le plus beau Noël de notre vie, en fait.", "Faire les deux s'est mal passé : on est arrivés en retard partout. Les deux familles nous en veulent. On a fini Noël en tête-à-tête, avec des chips. C'était parfait."], en: ["We tried to do both. Snowstorm, car stuck, Christmas Eve in a gas station with a trucker and shrink-wrapped {w:food}. Best Christmas of our lives, actually.", "Doing both went badly: we were late everywhere. Both families are mad. We ended Christmas alone together, with chips. It was perfect."] }, fx: { rel: 10, happy: 4 }, mood: 'love' },
        ],
      },
      {
        label: { fr: 'Inviter tout le monde', en: 'Host everyone' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai invité les deux familles chez nous. Les deux mères se sont disputé la cuisine, puis se sont découvert une haine commune pour leurs maris. Elles sont maintenant meilleures amies.", "Noël commun chez nous. Mon père et mon beau-père ont fini bourrés au karaoké en chantant {w:song}. Les mamies ont dansé. Miracle de Noël."], en: ["I invited both families to our place. The two mothers fought over the kitchen, then discovered a shared hatred of their husbands. They're best friends now.", "Joint Christmas at ours. My dad and father-in-law ended up drunk at karaoke singing {w:song}. The grandmas danced. Christmas miracle."] }, fx: { rel: 10, happy: 8, money: -500 }, mood: 'party' },
          { w: 1, text: { fr: ["Les deux familles réunies. Au bout d'une heure : débat politique, puis bataille de marrons glacés. Ma belle-mère a pris une bûche en pleine tête. Littéralement, la bûche de Noël.", "J'ai réuni tout le monde. Ma tante a révélé un secret sur ma belle-mère. Ma belle-mère en a révélé un sur ma tante. Le sapin a pris feu. Pas de lien, mais quand même."], en: ["Both families together. One hour in: political debate, then a candied-chestnut fight. My mother-in-law took a Yule log to the face. Literally, the dessert.", "I gathered everyone. My aunt revealed a secret about my mother-in-law. My mother-in-law revealed one about my aunt. The tree caught fire. Unrelated, but still."] }, fx: { rel: -6, stress: 8, money: -500, visual: 'fire' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Fuir au soleil', en: 'Escape somewhere sunny' },
        out: [
          { w: 2, text: { fr: ["On a annoncé à tout le monde qu'on partait {w:far_place} pour Noël. Les deux familles sont furieuses, unies dans leur colère. On a bu des cocktails sur la plage. Aucun regret.", "Noël en amoureux au soleil. On a envoyé une photo en maillot aux deux familles. Ma belle-mère a répondu « ingrats ». On l'a encadrée."], en: ["We told everyone we were going away for Christmas. Both families are furious, united in anger. We drank cocktails on the beach. No regrets.", "Christmas for two in the sun. We sent a swimsuit photo to both families. My mother-in-law replied “ungrateful.” We framed it."] }, fx: { rel: 8, happy: 8, money: -2000 }, mood: 'love' },
          { w: 1, text: { fr: ["On est partis au soleil. Coup de soleil au troisième degré, intoxication alimentaire à l'hôtel. On a passé Noël aux urgences locales. Les deux familles ont dit « c'est le karma ».", "Évasion ensoleillée. Problème : les deux familles ont eu la même idée et réservé le même hôtel pour nous faire la surprise. Noël à douze, en maillot."], en: ["We went somewhere sunny. Third-degree sunburn, food poisoning at the hotel. We spent Christmas at the local ER. Both families said “that's karma.”", "Sunny escape. Problem: both families had the same idea and booked the same hotel to surprise us. Christmas for twelve, in swimsuits."] }, fx: { health: -4, money: -2000, happy: -2 }, mood: 'sick' },
        ],
      },
    ],
  },
  // ───────────────────────────── feed lines (auto) ─────────────────────────────
  {
    id: 'f2_auto_mom_call',
    icon: '📞',
    cat: 'family',
    rating: 0,
    auto: true,
    actor: 'parent',
    scene: { place: 'apartment', mood: 'neutral', prop: 'phone' },
    when: { age: [20, 60], has: 'parent', movedOut: true },
    weight: 6,
    cooldown: 3,
    text: {
      fr: [
        "{a.my} m'a appelé{|e} {w:time} pour me demander si j'avais bien mangé. J'avais mangé {w:food}. Je n'ai pas osé le dire.",
        "{a.my} m'a laissé un message vocal de neuf minutes pour me raconter que la voisine a adopté {w:animal}. Fin du message : « Rappelle-moi, c'est important. »",
        "{a.my} m'a appelé{|e} trois fois pendant une réunion pour savoir si je préférais {w:food} ou des lasagnes dimanche. J'ai répondu « lasagnes » en chuchotant, devant mon boss.",
        "{a.my} m'a appelé{|e} pour me dire qu'{a:il|elle} avait rêvé de moi {w:far_place}. « C'était un signe. » De quoi, personne ne sait.",
      ],
      en: [
        "{a.my} called me {w:time} to ask if I'd eaten properly. I'd eaten {w:food}. I didn't dare say so.",
        "{a.my} left me a nine-minute voicemail about the neighbor adopting {w:animal}. End of message: “Call me back, it's important.”",
        "{a.my} called me three times during a meeting to ask if I'd prefer {w:food} or lasagna on Sunday. I whispered “lasagna” in front of my boss.",
        "{a.my} called to say {a:he|she} dreamed about me {w:far_place}. “It was a sign.” Of what, nobody knows.",
      ],
    },
    fx: { rel: 2, happy: 1 },
  },
  {
    id: 'f2_auto_chat_ping',
    icon: '🔔',
    cat: 'family',
    rating: 0,
    auto: true,
    actor: 'parent',
    scene: { place: 'apartment', mood: 'neutral', prop: 'phone' },
    when: { age: [16, 70], has: 'parent' },
    weight: 6,
    cooldown: 3,
    text: {
      fr: [
        "Le groupe WhatsApp familial a explosé : 247 notifications. Tout ça parce que {a.my} a posté une photo floue représentant {w:animal} en demandant « c'est quoi ça ? ».",
        "{a.my} a envoyé dans le groupe familial une chaîne « à partager à 10 personnes sinon malheur ». Mamie l'a partagée à 40. On est protégés pour des siècles.",
        "{a.my} a changé la photo du groupe familial pour une photo de moi à 3 ans, tout nu{|e} dans une bassine. 14 réactions « 😍 ».",
        "Le groupe familial a débattu deux heures pour savoir qui apporte {w:food} dimanche. Personne n'a voulu. C'est moi qui apporte {w:food}.",
      ],
      en: [
        "The family group chat blew up: 247 notifications. All because {a.my} posted a blurry photo of {w:animal} asking “what is this?”",
        "{a.my} sent a chain letter to the family group: “share with 10 people or bad luck.” Grandma shared it with 40. We're protected for centuries.",
        "{a.my} changed the family group photo to one of me at age 3, naked in a washtub. 14 “😍” reactions.",
        "The family group debated for two hours over who brings {w:food} on Sunday. Nobody wanted to. I'm bringing {w:food}.",
      ],
    },
    fx: { stress: 2, rel: 1 },
  },
  {
    id: 'f2_auto_gp_sweets',
    icon: '🍬',
    cat: 'family',
    rating: 0,
    auto: true,
    actor: 'grandparent',
    scene: { place: 'home', mood: 'happy', prop: 'candy' },
    when: { age: [4, 14], has: 'grandparent' },
    weight: 6,
    cooldown: 3,
    text: {
      fr: [
        "{a.my} m'a glissé un billet et {w:food} en cachette, avec un clin d'œil : « Chut, c'est notre secret. »",
        "Chez {a.my}, j'ai eu le droit de manger des bonbons au petit-déjeuner et de regarder {w:show} jusqu'à minuit. Meilleure nuit de l'année.",
        "{a.my} m'a appris un jeu de cartes et a triché tout l'après-midi. Je n'ai rien dit. J'ai gagné quand même. {a:Il|Elle} était fier{a:|e}.",
        "{a.my} m'a offert {w:gift} « parce que tu as grandi ». Je n'ai pas grandi depuis la semaine dernière. Je n'ai rien dit.",
      ],
      en: [
        "{a.my} secretly slipped me a bill and {w:food}, with a wink: “Shh, our secret.”",
        "At {a.my}'s, I was allowed candy for breakfast and {w:show} until midnight. Best night of the year.",
        "{a.my} taught me a card game and cheated all afternoon. I said nothing. I won anyway. {a:He|She} was proud.",
        "{a.my} gave me {w:gift} “because you've grown.” I haven't grown since last week. I said nothing.",
      ],
    },
    fx: { happy: 3, rel: 3 },
  },
  {
    id: 'f2_auto_sib_tag',
    icon: '🏷️',
    cat: 'family',
    rating: 1,
    auto: true,
    actor: 'sibling',
    scene: { place: 'apartment', mood: 'angry', prop: 'phone' },
    when: { age: [14, 45], has: 'sibling' },
    weight: 6,
    cooldown: 3,
    text: {
      fr: [
        "{a.my} m'a identifié{|e} sur {w:app} dans une photo de moi bourré{|e} {w:at_place}, en 2016. 300 likes. Ma boss a liké.",
        "{a.my} a posté une vidéo de moi en train de ronfler la bouche ouverte, avec en fond {w:song}. Elle tourne dans toute la famille.",
        "{a.my} a raconté sur {w:app} la fois où j'ai pleuré devant {w:movie}. Avec photo. J'ai répondu avec une photo de son appareil dentaire de 2008. Guerre ouverte.",
        "{a.my} m'a tagué{|e} sous un mème « ce cousin qui ne rembourse jamais ». Ce n'est même pas moi qui ne rembourse jamais. C'est {a:lui|elle}.",
      ],
      en: [
        "{a.my} tagged me on {w:app} in a photo of me drunk {w:at_place} in 2016. 300 likes. My boss liked it.",
        "{a.my} posted a video of me snoring with my mouth open, set to {w:song}. It's going around the whole family.",
        "{a.my} told the story on {w:app} of the time I cried watching {w:movie}. With a photo. I replied with a photo of {a:his|her} 2008 braces. Open war.",
        "{a.my} tagged me under a meme about “that cousin who never pays you back.” I'm not even the one who never pays back. {a:He|She} is.",
      ],
    },
    fx: { happy: -2, rel: -2 },
  },
  {
    id: 'f2_auto_kid_sold',
    icon: '💸',
    cat: 'parenting',
    rating: 0,
    auto: true,
    actor: 'child',
    scene: { place: 'home', mood: 'shock', prop: 'phone' },
    when: { age: [25, 65], has: 'child', test: allKids(8, 15) },
    weight: 6,
    cooldown: 3,
    text: {
      fr: [
        "{a.my} a vendu {w:object} de la maison sur {w:app} pour s'acheter des cartes Pokémon. C'était à moi. Je l'aimais bien.",
        "{a.my} a organisé un vide-grenier devant la maison pendant que je dormais. {a:Il|Elle} a vendu ma veste préférée 2 € à la voisine.",
        "{a.my} a monté un stand de limonade et facturé 5 € le verre aux voisins. Bénéfice : 80 €. {a:Il|Elle} m'a refusé un prêt.",
        "{a.my} a revendu tous ses cadeaux de Noël sur {w:app} avant le Nouvel An. Je suis à la fois horrifié{|e} et {fier|fière}.",
      ],
      en: [
        "{a.my} sold {w:object} from the house on {w:app} to buy Pokémon cards. It was mine. I liked it.",
        "{a.my} held a yard sale in front of the house while I was asleep. Sold my favorite jacket to the neighbor for $2.",
        "{a.my} set up a lemonade stand and charged the neighbors $5 a glass. Profit: $80. Refused me a loan.",
        "{a.my} resold all the Christmas presents on {w:app} before New Year's. I'm horrified and proud at the same time.",
      ],
    },
    fx: { happy: -1, rel: 1, money: -20 },
  },
  {
    id: 'f2_auto_par_toilet',
    icon: '🧻',
    cat: 'family',
    rating: 2,
    auto: true,
    actor: 'parent',
    scene: { place: 'apartment', mood: 'sick', prop: 'toilet', fx: 'poop' },
    when: { age: [18, 65], has: 'parent', movedOut: true },
    weight: 5,
    cooldown: 4,
    text: {
      fr: [
        "{a.my} est passé{a:|e} prendre un café, a bouché mes toilettes et s'est enfui{a:|e} sans rien dire. J'ai découvert le carnage à minuit. L'odeur rappelait {w:smell}, en pire.",
        "{a.my} a pété pendant le dîner chez moi, très fort, et a accusé mon chat. Mon chat est parti de la pièce, vexé.",
        "{a.my} a utilisé ma salle de bains 40 minutes avec un journal. En sortant : « Je te conseille d'attendre un peu. » J'ai attendu deux heures.",
        "{a.my} a fait tomber son dentier dans ma soupe et l'a récupéré avec la louche, puis a continué à servir. Personne n'a repris de soupe.",
      ],
      en: [
        "{a.my} came by for coffee, clogged my toilet and fled without a word. I discovered the carnage at midnight. It smelled like {w:smell}, but worse.",
        "{a.my} farted loudly during dinner at my place and blamed my cat. My cat left the room, offended.",
        "{a.my} used my bathroom for 40 minutes with a newspaper. On the way out: “I'd wait a bit if I were you.” I waited two hours.",
        "{a.my} dropped {a:his|her} dentures in my soup, fished them out with the ladle, then kept serving. Nobody had seconds.",
      ],
    },
    fx: { happy: -2, stress: 2 },
  },
  {
    id: 'f2_auto_inlaw_comment',
    icon: '🙄',
    cat: 'love',
    rating: 1,
    auto: true,
    actor: 'spouse',
    scene: { place: 'home', mood: 'angry', prop: 'phone' },
    when: { age: [22, 75], has: 'spouse' },
    weight: 6,
    cooldown: 3,
    text: {
      fr: [
        "La mère de {a.first} a commenté mon poids devant tout le monde : « Tu t'es bien remplumé{|e} ! » Puis m'a resservi trois fois.",
        "Le père de {a.first} m'a appelé{|e} par le prénom de l'ex de {a.first}. Pour la quatrième fois. Je commence à penser que c'est exprès.",
        "Ma belle-mère a offert à {a.first} un livre intitulé « Comment survivre à un mauvais mariage ». Pour son anniversaire. Devant moi.",
        "Ma belle-famille m'a envoyé une carte de vœux. Mon prénom est mal orthographié. Celui du chien est parfait.",
      ],
      en: [
        "{a.first}'s mother commented on my weight in front of everyone: “Someone's filled out nicely!” Then served me three more helpings.",
        "{a.first}'s father called me by {a.first}'s ex's name. For the fourth time. I'm starting to think it's on purpose.",
        "My mother-in-law gave {a.first} a book titled “How to Survive a Bad Marriage.” For {a:his|her} birthday. In front of me.",
        "My in-laws sent me a holiday card. My name is misspelled. The dog's is perfect.",
      ],
    },
    fx: { happy: -2, stress: 2 },
  },
  {
    id: 'f2_auto_cousin_vomit',
    icon: '🤮',
    cat: 'family',
    rating: 2,
    auto: true,
    actor: 'sibling',
    scene: { place: 'party', mood: 'sick', prop: 'bucket', fx: 'poop' },
    when: { age: [18, 60], has: 'sibling' },
    weight: 5,
    cooldown: 4,
    text: {
      fr: [
        "Au mariage du cousin, {a.my} a trop bu et a vomi dans {w:object} posé sur la table d'honneur. Le marié a applaudi. La mariée, non.",
        "À la fête de famille, {a.my} a enchaîné les shots, a dansé sur {w:song} et a fini par vomir dans la piscine gonflable des enfants. Les enfants ont crié de joie, puis d'horreur.",
        "Au baptême de la nièce, {a.my} a pris un fou rire pendant la messe et a lâché un pet si sonore que le curé s'est arrêté net. J'ai fait semblant de ne pas {a:le|la} connaître.",
        "Anniversaire de mamie : {a.my} s'est étouffé{a:|e} en mangeant {w:food} et en a recraché un morceau pile dans le gâteau. Mamie a soufflé ses bougies quand même. Personne n'a mangé de gâteau.",
      ],
      en: [
        "At our cousin's wedding, {a.my} drank too much and threw up into {w:object} on the head table. The groom applauded. The bride did not.",
        "At the family party, {a.my} downed shots, danced to {w:song} and ended up puking in the kids' inflatable pool. The kids screamed with joy, then horror.",
        "At our niece's christening, {a.my} got the giggles during mass and let out a fart so loud the priest stopped dead. I pretended not to know {a:him|her}.",
        "Grandma's birthday: {a.my} choked on {w:food} and spat a chunk right into the cake. Grandma blew out her candles anyway. Nobody ate cake.",
      ],
    },
    fx: { happy: 2, rel: -1 },
  },
];
