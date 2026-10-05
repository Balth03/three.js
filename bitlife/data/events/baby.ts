// Baby & toddler events (ages 0–7): newborn chaos, teething, potty training, preschool, tantrums,
// grandparents, parents bickering, holidays, imaginary friends and kid logic.
// At 1–2 the player has no real agency: choices are baby-style (cry, smile, poop, grab).
// Ratings here: 1 = parents swearing / drunk relatives, 2 = gross-out (poop, vomit, snot, scraped knees).
// Absolutely nothing sexual: every character in this file is a small child or their family.
import type { EventDef } from '@bl/sim';

export const babyEvents: EventDef[] = [
  // ───────────────────────────── feed-only diary lines ─────────────────────────────
  {
    id: 'bb_auto_newborn',
    icon: '👶',
    cat: 'baby',
    auto: true,
    once: true,
    when: { age: [1, 1] },
    text: {
      fr: [
        "Cette année, j'ai dormi seize heures par jour. Mes parents, seize heures au total.",
        "J'ai réveillé mes parents 1 400 fois cette année. Ils ont désormais le regard vide de deux vétérans revenus du front.",
      ],
      en: [
        "This year I slept sixteen hours a day. My parents slept sixteen hours total.",
        "I woke my parents up 1,400 times this year. They now have the thousand-yard stare of two war veterans.",
      ],
    },
    fx: { happy: 2, health: 2 },
  },
  {
    id: 'bb_auto_why',
    icon: '❓',
    cat: 'weird',
    auto: true,
    once: true,
    when: { age: [3, 5] },
    text: {
      fr: [
        "J'ai demandé « pourquoi ? » 412 fois en une journée. Vers 21 h, on m'a répondu « parce que la vie est une souffrance ». Je n'ai plus rien demandé.",
        "« Pourquoi les poissons ont pas de bras ? Pourquoi le monsieur il est vieux ? Pourquoi tu pleures ? » Grosse journée de questions pour mes parents.",
      ],
      en: [
        "I asked “why?” 412 times in one day. Around 9 p.m., the answer was “because life is suffering.” I stopped asking.",
        "“Why don't fish have arms? Why is that man old? Why are you crying?” Big day of questions for my parents.",
      ],
    },
    fx: { smarts: 3 },
  },
  {
    id: 'bb_auto_tablet',
    icon: '📱',
    cat: 'weird',
    auto: true,
    once: true,
    when: { age: [2, 5], era: [2012, 2100] },
    text: {
      fr: [
        "Pendant la sieste de mes parents, j'ai déverrouillé un téléphone avec leur pouce et commandé 48 rouleaux de papier toilette et un kayak gonflable.",
        "J'ai passé une heure sur la tablette sans surveillance. J'ai regardé 200 vidéos d'œufs surprises et changé la langue du téléphone en finnois.",
      ],
      en: [
        "During my parents' nap, I unlocked a phone with their thumb and ordered 48 rolls of toilet paper and an inflatable kayak.",
        "I spent an hour on the tablet unsupervised. I watched 200 surprise-egg videos and switched the phone's language to Finnish.",
      ],
    },
    fx: { happy: 4, smarts: 1 },
  },
  {
    id: 'bb_auto_fries',
    icon: '🍟',
    cat: 'weird',
    auto: true,
    once: true,
    when: { age: [4, 7] },
    text: {
      fr: [
        "J'ai planté une frite dans le jardin pour faire pousser un arbre à frites. Je l'arrose tous les matins. Rien. La nature est une arnaque.",
        "J'ai enterré une pièce dans le bac à sable pour faire pousser un arbre à sous. Un écureuil l'a déterrée. C'est lui le riche, maintenant.",
      ],
      en: [
        "I planted a French fry in the garden to grow a French fry tree. I water it every morning. Nothing. Nature is a scam.",
        "I buried a coin in the sandbox to grow a money tree. A squirrel dug it up. He's the rich one now.",
      ],
    },
    fx: { happy: 2, smarts: -1 },
  },
  {
    id: 'bb_auto_goldfish',
    icon: '🐠',
    cat: 'family',
    auto: true,
    once: true,
    rating: 1,
    when: { age: [3, 7] },
    text: {
      fr: [
        "Mon poisson rouge s'est mis à nager sur le dos. On m'a dit qu'il « partait en vacances à la mer » et on a tiré la chasse. J'attends toujours sa carte postale.",
        "Mon poisson rouge Bubulle est mort. Le lendemain, Bubulle était vivant, orange vif et vingt grammes plus gros. Je ne suis pas dupe.",
      ],
      en: [
        "My goldfish started swimming upside down. I was told he was “going on vacation to the sea” and the toilet got flushed. Still waiting on that postcard.",
        "My goldfish Bubbles died. The next day, Bubbles was alive, bright orange and an ounce heavier. I'm not an idiot.",
      ],
    },
    fx: { happy: -2, smarts: 2 },
  },
  {
    id: 'bb_auto_dad_swear',
    icon: '🤬',
    cat: 'family',
    auto: true,
    once: true,
    rating: 1,
    when: { age: [3, 6] },
    text: {
      fr: [
        "Papa s'est cogné le petit orteil contre le pied du lit. J'ai appris onze mots nouveaux en quatre secondes. Je les ai tous ressortis au goûter chez Mamie.",
        "Papa a reçu le ballon de foot que j'ai tiré dans un endroit très sensible. Il a dit « ma… bordel… de… couilles » en rampant. Je l'ai noté.",
      ],
      en: [
        "Dad stubbed his toe on the bed frame. I learned eleven new words in four seconds. I used every single one at Grandma's tea party.",
        "I kicked a soccer ball straight into Dad's very sensitive area. He said “holy… shit… my… balls” while crawling away. I took notes.",
      ],
    },
    fx: { smarts: 2, happy: 3 },
  },
  {
    id: 'bb_auto_baptism',
    icon: '🍾',
    cat: 'family',
    auto: true,
    once: true,
    rating: 1,
    when: { age: [1, 2] },
    text: {
      fr: [
        "À mon baptême, tonton [[Gérard|Jean-Mi|Pascal]] a fait un discours bourré de vingt-cinq minutes et m'a appelé{|e} par le nom de son chien. Trois fois.",
        "À ma fête de naissance, tonton [[Gérard|Jean-Mi|Pascal]] s'est endormi dans le bac à fleurs avant le gâteau. Il me tenait dans ses bras deux minutes plus tôt.",
      ],
      en: [
        "At my christening, Uncle [[Gary|Big Mike|Dale]] gave a twenty-five-minute drunk speech and called me by his dog's name. Three times.",
        "At my baby shower, Uncle [[Gary|Big Mike|Dale]] passed out in the flower bed before the cake. He'd been holding me two minutes earlier.",
      ],
    },
    fx: { happy: 2 },
  },
  {
    id: 'bb_auto_grandma_drive',
    icon: '🚗',
    cat: 'family',
    auto: true,
    once: true,
    rating: 1,
    when: { age: [2, 6] },
    text: {
      fr: [
        "Mamie m'a emmené{|e} à la crèche en insultant tous les automobilistes. J'ai appris que les gens en Audi sont « tous des trous du cul ».",
        "En voiture, Papi a traité un cycliste de « fils de moule ». Je l'ai répété en boucle jusqu'à Noël. Personne ne sait ce que ça veut dire, même pas Papi.",
      ],
      en: [
        "Grandma drove me to daycare cursing out every driver on the road. I learned that people who drive Audis are “all assholes.”",
        "In the car, Grandpa called a cyclist a “son of a clam.” I repeated it nonstop until Christmas. Nobody knows what it means, not even Grandpa.",
      ],
    },
    fx: { happy: 3, smarts: 1 },
  },
  {
    id: 'bb_auto_blowout',
    icon: '💩',
    cat: 'baby',
    auto: true,
    cooldown: 2,
    rating: 2,
    when: { age: [1, 2] },
    text: {
      fr: [
        "J'ai fait une explosion de couche dans le siège auto. Ça remontait jusqu'à la nuque. Le mot « pompiers » a été prononcé.",
        "J'ai fait caca si fort dans mon body qu'il a fallu le découper aux ciseaux et l'enterrer au fond de la poubelle avec les honneurs militaires.",
      ],
      en: [
        "I had a diaper blowout in the car seat. It went all the way up to my neck. The words “fire department” were spoken.",
        "I pooped so hard in my onesie it had to be cut off with scissors and buried in the trash with full military honors.",
      ],
    },
    fx: { happy: 3, visual: 'poop' },
  },
  {
    id: 'bb_auto_snot',
    icon: '🤧',
    cat: 'baby',
    auto: true,
    cooldown: 3,
    rating: 2,
    when: { age: [2, 6] },
    text: {
      fr: [
        "J'ai mangé une crotte de nez de la taille d'un petit pois. Je la gardais pour l'hiver.",
        "J'ai eu un rhume de deux mois. Ma lèvre supérieure est devenue un toboggan à morve verte, en service 24 h sur 24.",
      ],
      en: [
        "I ate a booger the size of a pea. I'd been saving it for winter.",
        "I had a two-month cold. My upper lip became a green snot slide, open 24/7.",
      ],
    },
    fx: { health: -1, happy: 1 },
  },

  // ───────────────────────────── babyhood (1–2): no agency, only vibes ─────────────────────────────
  {
    id: 'bb_newborn_visit',
    icon: '👵',
    cat: 'baby',
    once: true,
    when: { age: [1, 1] },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Toute la famille débarque pour te voir. Une tante que personne ne connaît te pince les joues en hurlant « qu'{il|elle} est chou ! » à quatre centimètres de ton visage.",
        "C'est le défilé : douze adultes qui sentent le parfum et le café se penchent sur ton berceau pour dire que tu ressembles « à ton grand-père ». Ton grand-père a 80 ans et une verrue.",
      ],
      en: [
        "The whole family shows up to see you. An aunt nobody recognizes pinches your cheeks, screaming “so cute!” two inches from your face.",
        "It's a parade: twelve adults smelling of perfume and coffee lean over your crib to say you look “just like your grandpa.” Your grandpa is 80 and has a wart.",
      ],
    },
    choices: [
      { label: { fr: 'Pleurer', en: 'Cry' }, text: { fr: "J'ai hurlé dès qu'on m'a touché{|e}. La tante a dit que j'avais « du caractère ». Traduction : je suis insupportable.", en: "I screamed the second anyone touched me. The aunt said I had “personality.” Translation: I'm unbearable." }, fx: { happy: 2 } },
      {
        label: { fr: 'Sourire', en: 'Smile' },
        out: [
          { w: 3, text: { fr: "J'ai fait mon plus beau sourire. Toute la famille a fondu. C'était un pet.", en: "I gave my best smile. The whole family melted. It was gas." }, fx: { looks: 2, happy: 3 }, mood: 'happy' },
          { w: 1, rating: 2, text: { fr: "J'ai souri, puis j'ai régurgité un demi-biberon de lait tiède dans le décolleté de la tante. Elle a gardé le sourire. Pas le chemisier.", en: "I smiled, then threw up half a bottle of warm milk right down the aunt's blouse. She kept smiling. Not the blouse." }, fx: { happy: 4 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Attraper ses lunettes', en: 'Grab her glasses' }, text: { fr: "J'ai arraché les lunettes de la tante et je les ai sucées comme une sucette. Elle n'y voit plus rien depuis.", en: "I yanked off the aunt's glasses and sucked on them like a lollipop. She hasn't seen clearly since." }, fx: { happy: 4, athletic: 1 } },
      { label: { fr: 'Faire caca', en: 'Poop' }, text: { fr: "J'ai rempli ma couche pile quand elle m'a pris{|e} dans ses bras. Elle m'a rendu{|e} à mes parents en 0,3 seconde.", en: "I filled my diaper the moment she picked me up. She handed me back to my parents in 0.3 seconds." }, fx: { happy: 3 } },
    ],
  },
  {
    id: 'bb_teething',
    icon: '🦷',
    cat: 'health',
    actor: 'parent',
    once: true,
    when: { age: [1, 2] },
    scene: { place: 'home', mood: 'cry' },
    text: {
      fr: [
        "Tes premières dents percent. Tu as l'impression que des Lego essaient de sortir de tes gencives.",
        "Tu baves comme un saint-bernard, tes gencives brûlent, et {a.rel} te tend un anneau de dentition sorti du frigo avec un regard suppliant.",
      ],
      en: [
        "Your first teeth are coming in. It feels like Lego bricks are trying to escape your gums.",
        "You're drooling like a Saint Bernard and your gums are on fire, and {a.rel} holds out a chilled teething ring with a pleading look.",
      ],
    },
    choices: [
      { label: { fr: 'Hurler toute la nuit', en: 'Scream all night' }, text: { fr: "J'ai pleuré de 22 h à 6 h, et {a.my} a fini par demander conseil au grille-pain.", en: "I cried from 10 p.m. to 6 a.m., and {a.my} ended up asking the toaster for advice." }, fx: { happy: -2, rel: -4 } },
      { label: { fr: 'Ronger la télécommande', en: 'Chew the remote' }, text: { fr: "J'ai rongé la télécommande jusqu'à changer de chaîne avec mes gencives. Le bouton « volume » est perdu à jamais.", en: "I gnawed the remote until I could change channels with my gums. The volume button is gone forever." }, fx: { happy: 4 } },
      { label: { fr: 'Mordre un doigt', en: 'Bite a finger' }, text: { fr: "J'ai mordu le doigt de {a.my} avec ma toute première dent. Le cri a été entendu jusqu'au bout de la rue.", en: "I bit {a.my}'s finger with my very first tooth. The scream was heard at the end of the street." }, fx: { happy: 3, athletic: 1, rel: -3 } },
    ],
  },
  {
    id: 'bb_dirt',
    icon: '🪱',
    cat: 'baby',
    cooldown: 3,
    when: { age: [1, 3] },
    scene: { place: 'park', mood: 'happy' },
    text: {
      fr: [
        "Au parc, tu viens de découvrir la terre. C'est marron, c'est gratuit, et personne ne te regarde.",
        "Tes parents scrollent sur leur téléphone. Devant toi : un bac à fleurs plein de bonne terre bien grasse, et quelque chose qui bouge dedans.",
      ],
      en: [
        "At the park, you've just discovered dirt. It's brown, it's free, and nobody's watching.",
        "Your parents are scrolling on their phones. In front of you: a flower bed full of rich, juicy dirt, and something wiggling in it.",
      ],
    },
    choices: [
      {
        label: { fr: 'Goûter la terre', en: 'Taste the dirt' },
        out: [
          { w: 2, text: { fr: "J'ai mangé une poignée de terre. Arrière-goût de cailloux, belle longueur en bouche.", en: "I ate a handful of dirt. Notes of gravel, lingering finish." }, fx: { happy: 3, health: -1 } },
          { w: 1, text: { fr: "J'ai mangé de la terre. Selon le pédiatre, ça renforce l'immunité. Selon ma famille, je suis un animal.", en: "I ate dirt. According to the pediatrician, it builds immunity. According to my family, I'm an animal." }, fx: { health: 2, happy: 2 } },
        ],
      },
      { label: { fr: 'Manger le ver', en: 'Eat the worm' }, rating: 2, text: { fr: "J'ai aspiré un ver de terre entier comme un spaghetti. Il gigotait encore en descendant. Je crois qu'il vit en moi maintenant.", en: "I slurped an entire earthworm like a noodle. It was still wiggling on the way down. I think it lives inside me now." }, fx: { happy: 2, health: -2 }, mood: 'sick' },
      { label: { fr: 'Faire un pâté', en: 'Make a mud pie' }, text: { fr: "J'ai fait un magnifique pâté de boue et je l'ai offert à un inconnu sur un banc. Il l'a gardé sur ses genoux par politesse.", en: "I made a gorgeous mud pie and offered it to a stranger on a bench. He kept it on his lap out of politeness." }, fx: { happy: 4, karma: 2 } },
    ],
  },
  {
    id: 'bb_pacifier',
    icon: '🍼',
    cat: 'baby',
    actor: 'parent',
    once: true,
    when: { age: [1, 2] },
    scene: { place: 'home', mood: 'cry' },
    text: {
      fr: [
        "Ta tétine vient de tomber par terre en plein centre commercial, et {a.rel} la ramasse, la regarde, et la met dans sa propre bouche pour « la laver ».",
        "Ta tétine a roulé sous le canapé, dans la zone grise où vivent les moutons de poussière et les pièces de Lego perdues. Tu sens la panique monter.",
      ],
      en: [
        "Your pacifier just hit the floor in the middle of the mall, and {a.rel} picks it up, looks at it, and pops it in their own mouth to “clean it.”",
        "Your pacifier rolled under the couch, into the gray zone where dust bunnies and lost Lego pieces live. Panic is rising.",
      ],
    },
    choices: [
      { label: { fr: 'Hurler pour la ravoir', en: 'Scream for it' }, text: { fr: "J'ai hurlé jusqu'à récupérer ma tétine. Elle avait un goût de poussière et de victoire.", en: "I screamed until I got my pacifier back. It tasted like dust and victory." }, fx: { happy: 3, rel: -2, flag: 'bb_pacifier', schedule: { key: 'bb_pacifier_fairy', years: 2 } } },
      { label: { fr: 'Exiger celle de secours', en: 'Demand the backup' }, text: { fr: "J'en ai maintenant trois : une dans la bouche, une dans chaque main. Je suis un{|e} collectionneu{r|se}.", en: "I now have three: one in my mouth, one in each hand. I'm a collector." }, fx: { happy: 4, flag: 'bb_pacifier', schedule: { key: 'bb_pacifier_fairy', years: 2 } } },
      { label: { fr: 'Sucer mon pouce', en: 'Suck my thumb' }, text: { fr: "J'ai découvert mon pouce. Il est toujours là, il ne tombe jamais par terre. Révolution.", en: "I discovered my thumb. It's always there and it never falls on the floor. Revolutionary." }, fx: { happy: 2, discipline: 2 } },
    ],
  },
  {
    id: 'bb_pacifier_fairy',
    icon: '🧚',
    cat: 'family',
    actor: 'parent',
    chainOnly: true,
    when: { age: [3, 5], flag: 'bb_pacifier' },
    scene: { place: 'home', mood: 'sad' },
    text: {
      fr: [
        "{a.rel} t'annonce que la fée des tétines passe ce soir récupérer les tiennes « pour les bébés qui en ont besoin ». C'est un racket, ni plus ni moins.",
        "Le dentiste a parlé : tes dents ressemblent à un pare-chocs tordu. Ce soir, toutes les tétines partent chez la « fée des tétines ».",
      ],
      en: [
        "{a.rel} announces that the Pacifier Fairy is coming tonight to collect yours “for the babies who need them.” This is a shakedown, plain and simple.",
        "The dentist has spoken: your teeth look like a bent bumper. Tonight, every pacifier goes to the “Pacifier Fairy.”",
      ],
    },
    choices: [
      { label: { fr: 'Tout donner', en: 'Hand them over' }, text: { fr: "J'ai donné mes tétines à la fée. Elle m'a laissé un camion de pompiers. Meilleur deal de ma vie.", en: "I gave my pacifiers to the fairy. She left me a fire truck. Best deal of my life." }, fx: { happy: 2, discipline: 4, rel: 4, unflag: 'bb_pacifier' } },
      {
        label: { fr: 'En cacher une', en: 'Hide one in a sock' },
        out: [
          { w: 2, text: { fr: "J'ai planqué une tétine dans une chaussette. Je la tète en secret la nuit, comme un agent double.", en: "I stashed a pacifier in a sock. I suck on it secretly at night, like a double agent." }, fx: { happy: 4, karma: -2 } },
          { w: 1, text: { fr: "Le chien a trouvé ma cachette et mangé la tétine. Double deuil.", en: "The dog found my stash and ate the pacifier. Double grief." }, fx: { happy: -4, unflag: 'bb_pacifier' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Négocier', en: 'Negotiate' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai négocié : toutes mes tétines contre deux jouets et un McDo. La fée a accepté. Elle avait l'air fatiguée.", en: "I negotiated: all my pacifiers for two toys and a Happy Meal. The fairy accepted. She looked tired." }, fx: { happy: 4, smarts: 2, unflag: 'bb_pacifier' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai tenté de négocier. La fée ne négocie pas avec les terroristes.", en: "I tried to negotiate. The fairy doesn't negotiate with terrorists." }, fx: { happy: -3, unflag: 'bb_pacifier' } },
        ],
      },
    ],
  },
  {
    id: 'bb_first_steps',
    icon: '👣',
    cat: 'baby',
    actor: 'parent',
    once: true,
    weight: 6,
    when: { age: [1, 2] },
    scene: { place: 'home', mood: 'proud' },
    text: {
      fr: [
        "Tu tiens debout en t'agrippant à la table basse, et {a.rel} filme, accroupi{a:|e} à deux mètres, bras tendus. C'est maintenant ou jamais.",
        "Tes jambes tremblent comme celles d'un faon sous caféine. Tout le salon retient son souffle.",
      ],
      en: [
        "You're standing, clinging to the coffee table, and {a.rel} is filming, crouched six feet away, arms open. It's now or never.",
        "Your legs are wobbling like a fawn on espresso. The whole living room holds its breath.",
      ],
    },
    choices: [
      { label: { fr: 'Aller vers les bras', en: 'Walk to the open arms' }, text: { fr: "J'ai fait cinq pas pile dans les bras de {a.my}. La vidéo a été envoyée à 43 personnes qui s'en fichent.", en: "I took five steps straight into {a.my}'s arms. The video was sent to 43 people who don't care." }, fx: { athletic: 3, happy: 3, rel: 6 } },
      { label: { fr: 'Foncer vers la poubelle', en: 'Head for the trash can' }, text: { fr: "Mes premiers pas m'ont conduit{|e} droit à la poubelle de la cuisine. J'ai des priorités.", en: "My first steps took me straight to the kitchen trash can. I have priorities." }, fx: { athletic: 3, happy: 4 } },
      { label: { fr: 'Rester à quatre pattes', en: 'Keep crawling' }, text: { fr: "J'ai décidé que marcher, c'était surfait. Je rampe à une vitesse terrifiante, comme un petit crocodile.", en: "I decided walking is overrated. I crawl at terrifying speed, like a tiny crocodile." }, fx: { happy: 2, athletic: 1 } },
      { label: { fr: 'Tomber sur les fesses', en: 'Fall on my butt' }, text: { fr: "J'ai fait un pas, puis je suis tombé{|e} sur les fesses. La couche a amorti. Merci la couche.", en: "I took one step, then landed on my butt. The diaper absorbed the impact. Thank you, diaper." }, fx: { happy: 1, athletic: 1 } },
    ],
  },
  {
    id: 'bb_mirror',
    icon: '🪞',
    cat: 'baby',
    once: true,
    when: { age: [1, 2] },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Dans le miroir de l'entrée, il y a un autre bébé. Il te fixe. Il fait exactement les mêmes gestes que toi. C'est une provocation.",
        "Tu découvres un bébé dans la porte vitrée du four. Il copie tout ce que tu fais. Tu le détestes et tu l'adores à la fois.",
      ],
      en: [
        "There's another baby in the hallway mirror. It's staring at you. It copies your every move. This is a provocation.",
        "You've found a baby in the oven door. It copies everything you do. You hate it and love it at the same time.",
      ],
    },
    choices: [
      { label: { fr: 'Lui sourire', en: 'Smile at it' }, text: { fr: "J'ai souri au bébé du miroir. Il m'a souri aussi. On est meilleurs amis. Il s'appelle Moi.", en: "I smiled at the mirror baby. It smiled back. We're best friends. Its name is Me." }, fx: { happy: 4, looks: 2 } },
      { label: { fr: 'Lui taper dessus', en: 'Smack it' }, text: { fr: "J'ai frappé le bébé du miroir. Il m'a frappé{|e} exactement au même moment. Match nul, front rouge.", en: "I smacked the mirror baby. It hit me back at the exact same time. A draw, red forehead." }, fx: { happy: 1, health: -1, athletic: 1 } },
      { label: { fr: 'Lécher le miroir', en: 'Lick the mirror' }, text: { fr: "J'ai léché le miroir pendant dix minutes. Il est désormais flou. Comme moi.", en: "I licked the mirror for ten minutes. It's now blurry. Like me." }, fx: { happy: 3, smarts: -1 } },
    ],
  },
  {
    id: 'bb_vaccine',
    icon: '💉',
    cat: 'health',
    cooldown: 3,
    when: { age: [1, 6] },
    scene: { place: 'hospital', mood: 'cry' },
    text: {
      fr: [
        "Le docteur s'approche avec une seringue et un sourire de méchant de Disney. « Tu ne vas rien sentir », ment-il.",
        "Visite des vaccins. La salle d'attente sent l'alcool et la peur, et un enfant hurle derrière la porte. C'est ton tour.",
      ],
      en: [
        "The doctor approaches with a syringe and a Disney-villain smile. “You won't feel a thing,” he lies.",
        "Vaccine day. The waiting room smells of rubbing alcohol and fear, and a kid is screaming behind the door. You're next.",
      ],
    },
    choices: [
      { label: { fr: 'Hurler', en: 'Scream' }, text: { fr: "J'ai hurlé si fort que tous les enfants de la salle d'attente ont pleuré par solidarité.", en: "I screamed so loud every kid in the waiting room cried in solidarity." }, fx: { health: 3, happy: -2 } },
      { label: { fr: 'Serrer les dents', en: 'Be brave' }, text: { fr: "Je n'ai pas bronché. J'ai eu un autocollant de licorne que j'ai porté sur le front pendant trois semaines.", en: "I didn't flinch. I got a unicorn sticker and wore it on my forehead for three weeks." }, fx: { health: 3, discipline: 3, happy: 2 }, mood: 'proud' },
      {
        label: { fr: 'Mordre le docteur', en: 'Bite the doctor' },
        out: [
          { w: 2, text: { fr: "J'ai mordu le docteur au poignet. Il a dit « ça arrive » avec la voix de quelqu'un qui envisage une reconversion.", en: "I bit the doctor's wrist. He said “it happens” in the voice of a man considering a career change." }, fx: { health: 3, happy: 3, karma: -3 } },
          { w: 1, text: { fr: "J'ai mordu le docteur. Il m'a repiqué{|e} « par erreur ». Respect mutuel.", en: "I bit the doctor. He jabbed me a second time “by accident.” Mutual respect." }, fx: { health: 3, happy: -3 } },
        ],
      },
    ],
  },
  {
    id: 'bb_first_haircut',
    icon: '✂️',
    cat: 'baby',
    actor: 'parent',
    once: true,
    when: { age: [1, 4] },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Premier passage chez le coiffeur. On t'assoit sur un faux cheval en plastique, et un monsieur s'approche avec une tondeuse qui vrombit.",
        "Tes cheveux te tombent dans les yeux, et {a.rel} a décidé de te couper la frange soi-même, « c'est pas compliqué ».",
      ],
      en: [
        "Your first trip to the barber. They sit you on a plastic horse, and a man approaches with a buzzing clipper.",
        "Your hair is in your eyes, and {a.rel} has decided to cut your bangs at home, “how hard can it be.”",
      ],
    },
    choices: [
      { label: { fr: 'Rester immobile', en: 'Sit perfectly still' }, text: { fr: "Je n'ai pas bougé d'un poil. On a gardé une mèche dans une enveloppe, comme une relique sacrée.", en: "I didn't move a hair. They kept a lock in an envelope, like a holy relic." }, fx: { looks: 4, rel: 3 } },
      {
        label: { fr: 'Gigoter', en: 'Wriggle' },
        out: [
          { w: 1, text: { fr: "J'ai gigoté. Résultat : une frange en escalier, digne d'un moine qui a perdu un pari.", en: "I wriggled. Result: staircase bangs, like a monk who lost a bet." }, fx: { looks: -5, happy: 1 } },
          { w: 1, text: { fr: "J'ai gigoté et la tondeuse a tracé une autoroute au milieu de mon crâne. On a dû tout raser. Look « petit bagnard ».", en: "I wriggled and the clipper carved a highway down the middle of my head. Everything had to go. Tiny-convict chic." }, fx: { looks: -4, happy: -1 } },
        ],
      },
      { label: { fr: 'Pleurer', en: 'Cry' }, text: { fr: "J'ai pleuré pendant toute la coupe. Sur la photo souvenir, j'ai la tête d'un otage.", en: "I cried through the whole haircut. In the souvenir photo, I look like a hostage." }, fx: { happy: -3, looks: 2 } },
    ],
  },
  {
    id: 'bb_daycare_first',
    icon: '🧸',
    cat: 'baby',
    actor: 'parent',
    once: true,
    when: { age: [1, 2] },
    scene: { place: 'school', mood: 'cry' },
    text: {
      fr: [
        "Premier jour à la crèche. Une pièce pleine de bébés qui hurlent, mâchouillent des cubes et sentent le lait caillé. Tes nouveaux collègues.",
        "{a.rel} te dépose à la crèche, te fait au revoir et repart en sanglotant plus fort que tous les bébés réunis.",
      ],
      en: [
        "First day at daycare. A room full of screaming babies chewing on blocks and smelling of sour milk. Your new coworkers.",
        "{a.rel} drops you off at daycare, waves goodbye and leaves sobbing louder than all the babies combined.",
      ],
    },
    choices: [
      { label: { fr: 'Pleurer en chœur', en: 'Join the crying choir' }, text: { fr: "J'ai rejoint la chorale des pleurs. On a tenu trois heures. Les puéricultrices ont craqué avant nous.", en: "I joined the crying choir. We lasted three hours. The staff cracked before we did." }, fx: { happy: -2, rel: 2 } },
      { label: { fr: 'Voler le meilleur jouet', en: 'Steal the best toy' }, text: { fr: "J'ai volé le seul camion qui fait du bruit. Je suis devenu{|e} le caïd de la section des bébés.", en: "I stole the only truck that makes noise. I'm now the kingpin of the baby room." }, fx: { happy: 4, karma: -2 } },
      { label: { fr: "M'endormir direct", en: 'Fall asleep instantly' }, text: { fr: "Je me suis endormi{|e} dans la piscine à balles. On m'a cherché{|e} pendant vingt minutes.", en: "I fell asleep in the ball pit. They searched for me for twenty minutes." }, fx: { happy: 2, health: 2 } },
    ],
  },

  // ───────────────────────────── preschool ─────────────────────────────
  {
    id: 'bb_preschool_show',
    icon: '🎭',
    cat: 'school',
    actor: 'parent',
    once: true,
    when: { age: [3, 5], school: 'preschool' },
    scene: { place: 'school', mood: 'proud' },
    text: {
      fr: [
        "Spectacle de fin d'année à {school}. Tu es déguisé{|e} en [[carotte|nuage|brosse à dents]]. Ton rôle : rester debout et ne pas pleurer.",
        "Kermesse de la maternelle : tu dois chanter une chanson sur les saisons devant 80 parents armés de téléphones.",
      ],
      en: [
        "End-of-year show at {school}. You're dressed as a [[carrot|cloud|toothbrush]]. Your role: stand there and don't cry.",
        "Preschool recital: you have to sing a song about the seasons in front of 80 parents armed with phones.",
      ],
    },
    choices: [
      { label: { fr: 'Chanter le plus fort', en: 'Sing the loudest' }, text: { fr: "J'ai chanté tellement fort qu'on n'entendait plus que moi, avec deux temps d'avance sur tout le monde. Une star est née.", en: "I sang so loud you could only hear me, two beats ahead of everyone else. A star is born." }, fx: { happy: 5, fame: 2 } },
      { label: { fr: 'Faire coucou', en: 'Wave at my parents' }, text: { fr: "J'ai passé tout le spectacle à faire coucou à {a.my}. C'est la seule chose qu'on voit sur la vidéo.", en: "I spent the whole show waving at {a.my}. It's the only thing you can see in the video." }, fx: { happy: 3, rel: 6 } },
      { label: { fr: 'Me curer le nez', en: 'Pick my nose' }, rating: 2, text: { fr: "Je me suis curé le nez pendant tout le spectacle, au premier rang, sous le projecteur. J'ai même mangé la récolte. Les parents ont applaudi par réflexe.", en: "I picked my nose through the entire show, front row, under the spotlight. I even ate the harvest. The parents clapped out of reflex." }, fx: { happy: 3, looks: -3 } },
      { label: { fr: 'Fondre en larmes', en: 'Burst into tears' }, text: { fr: "J'ai pleuré puis quitté la scène en courant. Le légume en larmes est entrée dans la légende de l'école.", en: "I cried and ran off stage. The weeping vegetable became a school legend." }, fx: { happy: -4 }, mood: 'cry' },
    ],
  },
  {
    id: 'bb_preschool_pockets',
    icon: '🐌',
    cat: 'school',
    actor: 'parent',
    cooldown: 3,
    when: { age: [3, 5], school: 'preschool' },
    vars: { amount: [1, 5] },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "En vidant tes poches après l'école, {a.rel} trouve trois cailloux, un bouchon, une dent qui n'est pas à toi et un escargot vivant.",
        "Tu ramènes de la maternelle ta « collection » : des marrons, une plume de pigeon et quatre escargots, tous baptisés Kevin.",
      ],
      en: [
        "Emptying your pockets after school, {a.rel} finds three pebbles, a bottle cap, a tooth that isn't yours and a live snail.",
        "You bring home your preschool “collection”: chestnuts, a pigeon feather and four snails, all named Kevin.",
      ],
    },
    choices: [
      { label: { fr: 'Exiger un terrarium', en: 'Demand a terrarium' }, text: { fr: "J'ai exigé un terrarium pour mes escargots. Au matin, ils étaient tous au plafond de ma chambre.", en: "I demanded a terrarium for my snails. By morning, they were all on my bedroom ceiling." }, fx: { happy: 4, smarts: 2 } },
      { label: { fr: 'Revendre à la récré', en: 'Sell it at recess' }, text: { fr: "J'ai revendu ma collection de cailloux à la récré pour {$amount}. Premier business, aucun scrupule.", en: "I sold my pebble collection at recess for {$amount}. First business, zero scruples." }, fx: { money: 'amount', smarts: 2 }, mood: 'proud' },
      { label: { fr: 'Laisser tout jeter', en: 'Let it all go' }, text: { fr: "J'ai laissé tout partir à la poubelle sans rien dire. Le soir, je pleurais pour Kevin.", en: "I let it all go in the trash without a word. That night, I cried for Kevin." }, fx: { happy: -3, discipline: 2 }, mood: 'sad' },
    ],
  },

  // ───────────────────────────── tantrums & kid logic ─────────────────────────────
  {
    id: 'bb_tantrum_supermarket',
    icon: '😤',
    cat: 'family',
    actor: 'parent',
    once: true,
    when: { age: [2, 4] },
    scene: { place: 'home', mood: 'angry' },
    text: {
      fr: [
        "À la caisse du supermarché, les bonbons sont rangés exactement à ta hauteur, et {a.rel} vient de dire non. La guerre est déclarée.",
        "Tu veux le paquet de céréales avec le dinosaure dessus. Pas un autre. CELUI-LÀ. Et {a.rel} ose dire qu'on en a déjà à la maison.",
      ],
      en: [
        "At the checkout, the candy is placed exactly at your eye level, and {a.rel} just said no. War is declared.",
        "You want the cereal box with the dinosaur on it. Not another one. THAT ONE. And {a.rel} dares to say there's some at home.",
      ],
    },
    choices: [
      {
        label: { fr: 'Me rouler par terre', en: 'Roll on the floor' },
        out: [
          { w: 2, text: { fr: "Je me suis jeté{|e} au sol en hurlant comme un phoque blessé. Une dame a filmé. On m'a acheté les bonbons pour que ça s'arrête.", en: "I threw myself on the floor howling like a wounded seal. A lady filmed it. I got the candy just to make it stop." }, fx: { happy: 5, rel: -5, flag: 'bb_tyrant' } },
          { w: 1, text: { fr: "Je me suis roulé{|e} par terre. On m'a laissé{|e} là et on a continué les courses. J'ai suivi, humilié{|e}, trois rayons plus loin.", en: "I rolled on the floor. They left me there and kept shopping. I followed, humiliated, three aisles later." }, fx: { happy: -3, discipline: 3 } },
        ],
      },
      { label: { fr: 'Faire tomber la pyramide', en: 'Topple the can pyramid' }, text: { fr: "J'ai tiré une boîte à la base de la pyramide. Deux cents boîtes de petits pois. Bruit magnifique. On n'a plus le droit d'aller dans ce magasin.", en: "I pulled one can from the bottom of the pyramid. Two hundred cans of peas. Glorious noise. We're banned from that store now." }, fx: { happy: 6, rel: -8, karma: -3, flag: 'bb_tyrant' } },
      { label: { fr: 'Bouder en silence', en: 'Sulk silently' }, text: { fr: "J'ai boudé en silence jusqu'à la voiture. Puis dans la voiture. Puis jusqu'à mardi.", en: "I sulked silently all the way to the car. Then in the car. Then until Tuesday." }, fx: { discipline: 3, happy: -1 } },
    ],
  },
  {
    id: 'bb_banana',
    icon: '🍌',
    cat: 'weird',
    actor: 'parent',
    once: true,
    when: { age: [2, 4] },
    scene: { place: 'home', mood: 'cry' },
    text: {
      fr: [
        "{a.rel} a cassé ta banane en deux pour te la donner. CASSÉ. EN DEUX. Ta vie est ruinée.",
        "Ton toast a été coupé en carrés alors que tu voulais des triangles. Tu fixes l'assiette comme si on avait renversé ton chien.",
      ],
      en: [
        "{a.rel} broke your banana in half before handing it to you. BROKE IT. IN HALF. Your life is ruined.",
        "Your toast was cut into squares when you wanted triangles. You stare at the plate like someone ran over your dog.",
      ],
    },
    choices: [
      { label: { fr: 'Exiger réparation', en: 'Demand it be fixed' }, text: { fr: "J'ai exigé qu'on recolle ma banane. On a essayé avec du scotch. Ce n'était pas pareil. Rien ne sera jamais plus pareil.", en: "I demanded they glue my banana back together. They tried tape. It wasn't the same. Nothing will ever be the same." }, fx: { happy: -4, rel: -3 } },
      { label: { fr: 'Hurler dix minutes', en: 'Scream for ten minutes' }, text: { fr: "J'ai hurlé dix minutes, puis j'ai mangé les deux morceaux en reniflant. Tout ça pour ça.", en: "I screamed for ten minutes, then ate both halves while sniffling. All that for nothing." }, fx: { happy: 1 } },
      { label: { fr: 'Accepter la tragédie', en: 'Accept the tragedy' }, text: { fr: "J'ai accepté que le monde est cruel et que les bananes se cassent. J'ai pris dix ans d'un coup.", en: "I accepted that the world is cruel and bananas break. I aged ten years in one afternoon." }, fx: { smarts: 2, discipline: 3 } },
    ],
  },
  {
    id: 'bb_potty_chart',
    icon: '🚽',
    cat: 'baby',
    actor: 'parent',
    once: true,
    when: { age: [2, 3] },
    scene: { place: 'home', mood: 'proud' },
    text: {
      fr: [
        "{a.rel} a installé un pot en plastique dans le salon et un tableau d'autocollants sur le frigo. Un pipi, un autocollant. Tu flaires le business.",
        "Début de l'apprentissage de la propreté : un pot en forme de grenouille et une chanson ridicule que tes parents chantent à chaque tentative.",
      ],
      en: [
        "{a.rel} put a plastic potty in the living room and a sticker chart on the fridge. One pee, one sticker. You smell a business opportunity.",
        "Potty training begins: a frog-shaped potty and a ridiculous song your parents sing at every attempt.",
      ],
    },
    choices: [
      { label: { fr: 'Facturer à la goutte', en: 'Bill per drop' }, text: { fr: "J'ai fait quatorze micro-pipis dans la journée pour quatorze autocollants. Le barème a été revu dès le lendemain.", en: "I did fourteen micro-pees in one day for fourteen stickers. The rate card was revised the next morning." }, fx: { smarts: 3, happy: 3, flag: 'bb_potty_pro' } },
      { label: { fr: 'Utiliser le pot', en: 'Use the potty properly' }, text: { fr: "J'ai fait pipi dans le pot du premier coup. Toute la famille a applaudi et Papi a versé une larme.", en: "I peed in the potty on the first try. The whole family applauded and Grandpa shed a tear." }, fx: { discipline: 4, rel: 5, flag: 'bb_potty_pro' }, mood: 'proud' },
      { label: { fr: 'Le porter en chapeau', en: 'Wear it as a hat' }, text: { fr: "J'ai porté le pot comme un casque toute la journée. Heureusement, il était encore vide.", en: "I wore the potty as a helmet all day. Luckily, it was still empty." }, fx: { happy: 4, rel: -2 } },
    ],
  },

  // ───────────────────────────── family: siblings, grandparents, pets ─────────────────────────────
  {
    id: 'bb_sibling_fries',
    icon: '😾',
    cat: 'family',
    actor: 'sibling',
    cooldown: 3,
    when: { age: [2, 7], has: 'sibling' },
    scene: { place: 'home', mood: 'angry' },
    text: {
      fr: [
        "{a.rel} a eu trois frites de plus que toi. Tu les as comptées. Deux fois.",
        "Tout le monde s'extasie parce que {a.first} a fait un dessin. C'est un rond. Toi, tu fais des ronds depuis des années, et personne n'a jamais rien dit.",
      ],
      en: [
        "{a.rel} got three more fries than you. You counted. Twice.",
        "Everyone is gushing because {a.first} drew a picture. It's a circle. You've been drawing circles for years and nobody ever said a thing.",
      ],
    },
    choices: [
      { label: { fr: 'Exiger un recomptage', en: 'Demand a recount' }, text: { fr: "J'ai exigé un recomptage officiel des frites. On m'a donné les trois manquantes et un regard très fatigué.", en: "I demanded an official fry recount. I got the three missing ones and a very tired look." }, fx: { happy: 3, rel: -2 } },
      { label: { fr: 'Lécher son assiette', en: 'Lick their plate' }, text: { fr: "J'ai léché toutes les frites de {a.first}. Elles sont à moi maintenant. C'est la loi.", en: "I licked every one of {a.first}'s fries. They're mine now. That's the law." }, fx: { happy: 5, rel: -8, karma: -2 } },
      { label: { fr: 'Refaire le bébé', en: 'Act like a baby again' }, text: { fr: "J'ai réclamé un biberon et parlé comme un bébé pendant une semaine pour récupérer l'attention. Ça a marché. Un peu.", en: "I demanded a bottle and talked like a baby for a week to win back attention. It worked. Sort of." }, fx: { happy: 2, smarts: -2 } },
      { label: { fr: 'Lui faire un câlin', en: 'Give them a hug' }, text: { fr: "J'ai fait un gros câlin à {a.first}. Tout le monde a trouvé ça adorable. J'en ai profité pour lui piquer une frite.", en: "I gave {a.first} a big hug. Everyone found it adorable. I used the moment to steal a fry." }, fx: { rel: 4, happy: 3 } },
    ],
  },
  {
    id: 'bb_grandparent_candy',
    icon: '🍬',
    cat: 'family',
    actor: 'grandparent',
    cooldown: 3,
    when: { age: [2, 7] },
    scene: { place: 'home', mood: 'happy' },
    text: {
      fr: [
        "Chez {a.rel}, les règles n'existent pas. Il est 19 h, tu as déjà mangé quatre paquets de bonbons, et {a:il|elle} t'en tend un cinquième en chuchotant « ne dis rien à tes parents ».",
        "{a.rel} te garde pour le week-end. Au dîner : de la mousse au chocolat. Au dessert : de la mousse au chocolat.",
      ],
      en: [
        "At {a.rel}'s place, rules don't exist. It's 7 p.m., you've already eaten four bags of candy, and {a.he} hands you a fifth, whispering “don't tell your parents.”",
        "{a.rel} is babysitting you for the weekend. Dinner: chocolate mousse. Dessert: chocolate mousse.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout manger', en: 'Eat everything' },
        out: [
          { w: 2, text: { fr: "J'ai tout mangé. Je suis rentré{|e} à la maison en vibrant comme un téléphone. Mes parents ont compris.", en: "I ate it all. I came home vibrating like a phone. My parents knew." }, fx: { happy: 6, health: -3, rel: 5 } },
          { w: 1, text: { fr: "J'ai tout mangé et je suis resté{|e} éveillé{|e} jusqu'à 2 h du matin à discuter avec les rideaux.", en: "I ate it all and stayed up until 2 a.m. having a conversation with the curtains." }, fx: { happy: 4, health: -2, rel: 3 } },
        ],
      },
      { label: { fr: 'Garder le secret', en: 'Keep the secret' }, text: { fr: "J'ai juré de ne rien dire. Le secret a tenu jusqu'à ce que mes parents voient ma langue bleu électrique.", en: "I swore not to tell. The secret held until my parents saw my electric-blue tongue." }, fx: { happy: 4, rel: 6, karma: -1 } },
      { label: { fr: 'Tout balancer', en: 'Snitch' }, text: { fr: "J'ai tout balancé à mes parents. Le week-end suivant, chez {a.my}, il n'y avait plus que des clémentines.", en: "I snitched to my parents. The next weekend at {a.my}'s, there was nothing but clementines." }, fx: { rel: -6, karma: 2, health: 2 } },
    ],
  },
  {
    id: 'bb_grandparent_drums',
    icon: '🥁',
    cat: 'family',
    actor: 'grandparent',
    once: true,
    when: { age: [3, 7] },
    scene: { place: 'home', mood: 'party' },
    text: {
      fr: [
        "Pour ton anniversaire, {a.rel} t'offre une batterie complète. {a:Il|Elle} regarde tes parents avec le sourire d'une vengeance qui mijote depuis trente ans.",
        "{a.rel} débarque avec une trompette, un sifflet et un xylophone. « Pour développer ton oreille », lance {a:il|elle} en repartant très vite.",
      ],
      en: [
        "For your birthday, {a.rel} gives you a full drum kit. {a:He|She} looks at your parents with the smile of a revenge thirty years in the making.",
        "{a.rel} shows up with a trumpet, a whistle and a xylophone. “To train your ear,” {a.he} says, leaving very quickly.",
      ],
    },
    choices: [
      { label: { fr: 'Jouer à 6 h du matin', en: 'Play at 6 a.m.' }, text: { fr: "J'ai donné un concert tous les matins à 6 h. Mes parents parlent de « crime contre l'humanité », et {a.my} est ravi{a:|e}.", en: "I gave a concert every morning at 6 a.m. My parents call it a “crime against humanity,” and {a.my} is delighted." }, fx: { happy: 6, rel: 6 } },
      { label: { fr: "M'entraîner sérieusement", en: 'Practice seriously' }, text: { fr: "J'ai travaillé tous les jours. Je joue maintenant « Au clair de la lune » en entier. Faux, mais en entier.", en: "I practiced every day. I can now play “Twinkle Twinkle” all the way through. Off-key, but all the way." }, fx: { happy: 3, discipline: 4, smarts: 1 } },
      { label: { fr: 'Taper sur tout', en: 'Hit everything' }, text: { fr: "J'ai découvert qu'on peut taper sur tout : les casseroles, la télé, la tête de papa pendant sa sieste.", en: "I discovered you can drum on anything: pots, the TV, Dad's head during his nap." }, fx: { happy: 5, athletic: 1, rel: 2 } },
    ],
  },
  {
    id: 'bb_pet_lick',
    icon: '🐶',
    cat: 'pet',
    actor: 'pet',
    once: true,
    when: { age: [1, 3], has: 'pet' },
    scene: { place: 'home', mood: 'happy' },
    text: {
      fr: [
        "{a.first}, l'animal de la maison, renifle ton couffin, puis te lèche le visage de l'oreille au menton. Longuement. Méthodiquement.",
        "Tu es par terre sur ton tapis d'éveil quand {a.first} décide que ton visage est une gamelle.",
      ],
      en: [
        "{a.first}, the family pet, sniffs your bassinet, then licks your face from ear to chin. Slowly. Methodically.",
        "You're lying on your play mat when {a.first} decides your face is a food bowl.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rire aux éclats', en: 'Giggle' },
        out: [
          { w: 3, text: { fr: "J'ai rigolé si fort que {a.first} a continué pendant dix minutes. On est liés pour la vie.", en: "I giggled so hard {a.first} kept going for ten minutes. We're bonded for life." }, fx: { happy: 6, rel: 10 } },
          { w: 1, rating: 2, text: { fr: "J'ai rigolé. Puis j'ai vu {a.first} se lécher longuement le derrière et revenir finir mon visage là où il s'était arrêté.", en: "I giggled. Then I watched {a.first} give its butt a long, thorough lick and come back to finish my face where it left off." }, fx: { happy: 2, health: -2, rel: 4 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Attraper sa queue', en: 'Grab its tail' }, text: { fr: "J'ai attrapé la queue de {a.first}. Il a poussé un cri que je n'avais jamais entendu. Moi non plus, d'ailleurs.", en: "I grabbed {a.first}'s tail. It made a noise I'd never heard before. Neither had I, honestly." }, fx: { happy: 3, rel: -6 } },
      { label: { fr: 'Lécher en retour', en: 'Lick it back' }, text: { fr: "Je lui ai léché la tête en retour. Respect mutuel, poils plein la bouche.", en: "I licked its head right back. Mutual respect, mouth full of fur." }, fx: { happy: 4, health: -1, rel: 6 } },
    ],
  },

  // ───────────────────────────── holidays & parties ─────────────────────────────
  {
    id: 'bb_birthday_party',
    icon: '🎂',
    cat: 'party',
    actor: 'parent',
    cooldown: 2,
    when: { age: [3, 7] },
    scene: { place: 'party', mood: 'party', fx: 'confetti' },
    text: {
      fr: [
        "C'est ta fête d'anniversaire ! {age} bougies, douze enfants surexcités et un gâteau en forme de [[dinosaure|licorne|camion-poubelle]].",
        "Ton anniversaire : tout le monde chante faux, il y a des ballons partout, et {a.rel} a déjà l'air épuisé{a:|e} à 14 h 05.",
      ],
      en: [
        "It's your birthday party! {age} candles, twelve hyper kids and a cake shaped like a [[dinosaur|unicorn|garbage truck]].",
        "Your birthday: everyone sings off-key, there are balloons everywhere, and {a.rel} already looks exhausted at 2:05 p.m.",
      ],
    },
    choices: [
      {
        label: { fr: 'Souffler les bougies', en: 'Blow out the candles' },
        out: [
          { w: 2, text: { fr: "J'ai soufflé les {age} bougies d'un coup. Mon vœu : un vrai dinosaure. J'attends.", en: "I blew out all {age} candles in one go. My wish: a real dinosaur. Still waiting." }, fx: { happy: 6, rel: 2 } },
          { w: 1, rating: 2, text: { fr: "J'ai soufflé avec tant d'enthousiasme que j'ai postillonné une pluie de bave sur tout le gâteau. Personne n'en a repris.", en: "I blew so enthusiastically I sprayed a mist of spit over the whole cake. Nobody had seconds." }, fx: { happy: 4, karma: -1 } },
        ],
      },
      { label: { fr: 'Déchirer les cadeaux', en: 'Rip open every present' }, text: { fr: "J'ai ouvert quatorze cadeaux en trois minutes sans lire une seule carte, et j'ai dit « je l'ai déjà » à la moitié des invités.", en: "I opened fourteen presents in three minutes without reading a single card, and said “I already have that” to half the guests." }, fx: { happy: 6, karma: -3 } },
      { label: { fr: 'Pleurer pendant la chanson', en: 'Cry during the song' }, text: { fr: "Tout le monde m'a fixé{|e} en chantant. J'ai éclaté en sanglots. Trop de pression sociale.", en: "Everyone stared at me while singing. I burst into tears. Too much social pressure." }, fx: { happy: -3 }, mood: 'cry' },
    ],
  },
  {
    id: 'bb_santa_mall',
    icon: '🎅',
    cat: 'holiday',
    actor: 'parent',
    cooldown: 2,
    when: { age: [2, 6] },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Photo avec le Père Noël du centre commercial. Sa barbe tient avec un élastique, il porte des baskets fluo et il regarde l'horloge.",
        "Quarante-cinq minutes de queue pour voir le Père Noël. Il te regarde avec les yeux d'un homme qui en est à son 312e enfant de la journée.",
      ],
      en: [
        "Photo with the mall Santa. His beard is held on with an elastic band, he's wearing neon sneakers and he keeps checking the clock.",
        "Forty-five minutes in line to see Santa. He looks at you with the eyes of a man on his 312th kid of the day.",
      ],
    },
    choices: [
      { label: { fr: 'Hurler de terreur', en: 'Scream in terror' }, text: { fr: "J'ai hurlé dès qu'il a fait « Oh oh oh ». La photo de moi en larmes trône depuis sur la cheminée.", en: "I screamed the moment he went “Ho ho ho.” The photo of me sobbing has been on the mantelpiece ever since." }, fx: { happy: -3, rel: 2 } },
      { label: { fr: 'Tirer sur sa barbe', en: 'Pull his beard' }, text: { fr: "J'ai tiré sur sa barbe. Elle est tombée. En dessous : le boucher du quartier. Tout un monde s'est effondré.", en: "I pulled his beard. It came off. Underneath: the neighborhood butcher. An entire world collapsed." }, fx: { smarts: 3, happy: -2 } },
      { label: { fr: 'Demander un truc bizarre', en: 'Ask for something weird' }, text: { fr: "J'ai demandé au Père Noël [[une tronçonneuse|un vrai requin|une sœur moins nulle]]. Il a répondu « on verra ». Je sais ce que ça veut dire.", en: "I asked Santa for [[a chainsaw|a real shark|a less lame sister]]. He said “we'll see.” I know what that means." }, fx: { happy: 2, smarts: 1 } },
    ],
  },
  {
    id: 'bb_easter',
    icon: '🐰',
    cat: 'holiday',
    cooldown: 2,
    when: { age: [3, 7] },
    scene: { place: 'park', mood: 'happy' },
    text: {
      fr: [
        "Chasse aux œufs dans le jardin ! Les adultes ont caché des chocolats partout, et douze cousins affamés t'entourent.",
        "Le lapin de Pâques est passé. Il a semé des œufs en chocolat dans le jardin, et une cousine porte déjà un panier de la taille d'une baignoire.",
      ],
      en: [
        "Easter egg hunt in the yard! The grown-ups hid chocolate everywhere, and twelve starving cousins surround you.",
        "The Easter Bunny came by. He scattered chocolate eggs across the yard, and one cousin is already carrying a basket the size of a bathtub.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout rafler', en: 'Grab everything' },
        out: [
          { w: 2, text: { fr: "J'ai bousculé deux cousins et récolté 43 œufs. Mamie m'a surnommé{|e} « petit cœur de pierre ».", en: "I shoved two cousins and collected 43 eggs. Grandma nicknamed me “little heart of stone.”" }, fx: { happy: 6, health: -2, karma: -3 } },
          { w: 1, rating: 2, text: { fr: "J'ai ramassé un bel œuf marron et tiède dans l'herbe. Pas un œuf. Pas du chocolat. Un cadeau du chien des voisins. Je l'ai découvert en croquant.", en: "I picked up a nice warm brown egg in the grass. Not an egg. Not chocolate. A gift from the neighbors' dog. I found out on the first bite." }, fx: { happy: -5, health: -2, visual: 'poop' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Partager', en: 'Share' }, text: { fr: "J'ai partagé mes œufs avec la plus petite cousine. Elle m'a remercié{|e} en les mangeant tous devant moi.", en: "I shared my eggs with the littlest cousin. She thanked me by eating all of them in front of me." }, fx: { karma: 5, happy: 2 } },
      { label: { fr: "Manger l'emballage", en: 'Eat the foil too' }, text: { fr: "J'ai mangé mes œufs avec le papier alu. Ça croque, ça fait mal aux plombages que je n'ai pas encore, je recommande.", en: "I ate my eggs foil and all. Crunchy, hurts fillings I don't even have yet, would recommend." }, fx: { happy: 3, health: -2 } },
    ],
  },
  {
    id: 'bb_tooth_fairy',
    icon: '🧚',
    cat: 'holiday',
    actor: 'parent',
    once: true,
    when: { age: [5, 7] },
    vars: { amount: [2, 10] },
    scene: { place: 'home', mood: 'sleepy' },
    text: {
      fr: [
        "Ta première dent tombée est sous l'oreiller. La petite souris passe cette nuit. Tu as des questions sur son modèle économique.",
        "Tu as une dent qui bouge et un tarif en tête : un copain de l'école affirme avoir touché un billet pour une molaire.",
      ],
      en: [
        "Your first lost tooth is under the pillow. The Tooth Fairy comes tonight. You have questions about her business model.",
        "You've got a wobbly tooth and a price in mind: a kid at school claims he got a whole bill for a molar.",
      ],
    },
    choices: [
      {
        label: { fr: "Sous l'oreiller", en: 'Under the pillow' },
        out: [
          { w: 3, text: { fr: "Au réveil, la dent avait disparu et {$amount} l'avait remplacée. Je regarde désormais mes autres dents avec appétit.", en: "When I woke up, the tooth was gone and {$amount} had replaced it. I now look at my other teeth with hunger." }, fx: { money: 'amount', happy: 4 } },
          { w: 1, rating: 1, text: { fr: "Au réveil, il y avait un ticket à gratter à la place de ma dent. Perdant. La petite souris traverse visiblement une mauvaise passe.", en: "When I woke up, there was a scratch card where my tooth had been. A loser. The Tooth Fairy is clearly going through a rough patch." }, fx: { happy: -2, smarts: 1 } },
        ],
      },
      { label: { fr: 'Arracher la suivante', en: 'Yank the next one' }, rating: 2, text: { fr: "J'ai attaché une autre dent à la poignée de porte et claqué la porte. Du sang plein le pyjama, la dent toujours en place, et une petite souris très inquiète.", en: "I tied another tooth to the door handle and slammed the door. Blood all over my pajamas, tooth still in place, and one very worried Tooth Fairy." }, fx: { health: -4, happy: -2 }, mood: 'cry' },
      {
        label: { fr: 'Mettre un caillou', en: 'Try a pebble instead' },
        out: [
          { w: 1, text: { fr: "J'ai glissé un petit caillou blanc sous l'oreiller. La petite souris l'a pris et m'a laissé un mot : « Bien essayé. »", en: "I slipped a little white pebble under my pillow. The Tooth Fairy took it and left me a note: “Nice try.”" }, fx: { smarts: 2, karma: -2 } },
          { w: 1, odds: { smarts: 1 }, text: { fr: "Ça a marché : {$amount} pour un caillou. J'ai commencé à ramasser tout le gravier de l'allée.", en: "It worked: {$amount} for a pebble. I started collecting all the gravel in the driveway." }, fx: { money: 'amount', karma: -3, smarts: 2, flag: 'bb_tooth_scam' }, mood: 'proud' },
        ],
      },
    ],
  },

  // ───────────────────────────── fears, toys, firsts ─────────────────────────────
  {
    id: 'bb_dark',
    icon: '🌑',
    cat: 'weird',
    actor: 'parent',
    cooldown: 2,
    when: { age: [3, 6] },
    scene: { place: 'home', mood: 'shock', fx: 'ghost' },
    text: {
      fr: [
        "La lumière est éteinte. Le porte-manteau dans le coin de ta chambre a exactement la forme d'un homme avec un chapeau qui attend.",
        "Il est 23 h. Un craquement dans le couloir. Probablement la maison qui « travaille ». Probablement.",
      ],
      en: [
        "The light is off. The coat rack in the corner of your room is shaped exactly like a man in a hat, waiting.",
        "It's 11 p.m. A creak in the hallway. Probably just the house “settling.” Probably.",
      ],
    },
    choices: [
      { label: { fr: 'Appeler 14 fois', en: 'Call out 14 times' }, text: { fr: "J'ai appelé {a.my} quatorze fois. À la quinzième, j'ai gagné le droit de dormir dans le grand lit, coincé{|e} entre deux ronflements.", en: "I called {a.my} fourteen times. On the fifteenth, I won the right to sleep in the big bed, wedged between two snores." }, fx: { happy: 3, rel: -2 } },
      { label: { fr: 'Combattre le monstre', en: 'Fight the monster' }, text: { fr: "J'ai attaqué le porte-manteau avec mon sabre en mousse. Il est tombé. J'ai gagné. Le manteau de papa ne s'en est jamais remis.", en: "I attacked the coat rack with my foam sword. It went down. I won. Dad's coat never recovered." }, fx: { happy: 4, athletic: 2, discipline: 1 }, mood: 'proud' },
      { label: { fr: 'Sous la couette', en: 'Hide under the covers' }, text: { fr: "J'ai dormi entièrement sous la couette, pas un orteil dehors. Les monstres ne traversent pas les couettes, c'est scientifique.", en: "I slept fully under the covers, not one toe out. Monsters can't get through blankets, it's science." }, fx: { happy: -1, health: -1 } },
    ],
  },
  {
    id: 'bb_toy_store',
    icon: '🪀',
    cat: 'family',
    actor: 'parent',
    cooldown: 2,
    when: { age: [3, 7] },
    scene: { place: 'home', mood: 'happy' },
    text: {
      fr: [
        "Au magasin de jouets, tu as repéré un château pirate avec des canons qui tirent pour de vrai. Il coûte le prix d'une voiture d'occasion.",
        "{a.rel} t'emmène acheter « un petit jouet, un seul ». Il y a quatre allées de jouets. Ton cerveau surchauffe.",
      ],
      en: [
        "At the toy store, you've spotted a pirate castle with cannons that actually fire. It costs as much as a used car.",
        "{a.rel} takes you to buy “one little toy, just one.” There are four aisles of toys. Your brain is overheating.",
      ],
    },
    choices: [
      {
        label: { fr: 'Supplier', en: 'Beg' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "J'ai fait les yeux du Chat Potté pendant cinq minutes. J'ai eu le château.", en: "I did the Puss in Boots eyes for five minutes. I got the castle." }, fx: { happy: 7, rel: -2 } },
          { w: 1, text: { fr: "J'ai supplié. On m'a acheté une balle rebondissante en solde. « C'est l'intention qui compte », paraît-il.", en: "I begged. I got a clearance-bin bouncy ball. “It's the thought that counts,” apparently." }, fx: { happy: -1 } },
        ],
      },
      { label: { fr: 'Le planquer dans le caddie', en: 'Sneak it into the cart' }, text: { fr: "J'ai planqué un robot sous les rouleaux de papier toilette. Il est passé à la caisse sans problème. J'ai découvert la contrebande.", en: "I hid a robot under the toilet paper. It went through checkout no problem. I've discovered smuggling." }, fx: { happy: 5, karma: -2, smarts: 1 } },
      { label: { fr: 'Refaire le coup du magasin', en: 'Pull the tantrum stunt again' }, if: { flag: 'bb_tyrant' }, text: { fr: "J'ai refait mon numéro du supermarché. Mais l'effet de surprise était perdu : on m'a laissé{|e} en plan entre deux peluches géantes.", en: "I pulled my supermarket routine again. But the element of surprise was gone: they left me stranded between two giant teddy bears." }, fx: { happy: -3, discipline: 2, unflag: 'bb_tyrant' } },
      { label: { fr: 'Choisir sagement', en: 'Pick something small' }, text: { fr: "J'ai pris une petite voiture sans faire d'histoire. Au retour, j'ai eu une glace en bonus. La sagesse paie.", en: "I picked a little toy car without any fuss. On the way home, I got bonus ice cream. Wisdom pays." }, fx: { rel: 5, discipline: 3, happy: 2 } },
    ],
  },
  {
    id: 'bb_bike',
    icon: '🛴',
    cat: 'baby',
    actor: 'parent',
    once: true,
    when: { age: [4, 7] },
    scene: { place: 'park', mood: 'proud' },
    text: {
      fr: [
        "Tu as reçu ta première draisienne. Pas de pédales, pas de freins, juste ta foi et une descente.",
        "{a.rel} t'a trouvé un vélo d'occasion sur internet. Il est rose fluo, deux tailles trop grand, et il a déjà vécu plusieurs vies.",
      ],
      en: [
        "You got your first balance bike. No pedals, no brakes, just faith and a downhill slope.",
        "{a.rel} found you a secondhand bike online. It's neon pink, two sizes too big, and it has clearly lived several lives.",
      ],
    },
    choices: [
      {
        label: { fr: 'Dévaler la pente', en: 'Bomb down the hill' },
        out: [
          { w: 2, text: { fr: "J'ai dévalé la rue à toute allure jusqu'à la haie du voisin. Je suis ressorti{|e} de l'autre côté avec des feuilles dans les oreilles. Vitesse maximale atteinte.", en: "I bombed down the street straight into the neighbor's hedge. I came out the other side with leaves in my ears. Top speed achieved." }, fx: { athletic: 4, happy: 5 }, mood: 'happy' },
          { w: 1, rating: 2, text: { fr: "J'ai dévalé la pente et embrassé le bitume. Genou en steak haché, gravillons incrustés, sang jusque dans la chaussette. J'ai exigé huit pansements.", en: "I bombed down the hill and kissed the asphalt. Knee like ground beef, gravel embedded, blood all the way down into my sock. I demanded eight band-aids." }, fx: { health: -5, happy: -2, athletic: 2 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Y aller doucement', en: 'Take it slow' }, text: { fr: "J'ai roulé à deux à l'heure sur le trottoir. Un escargot m'a doublé. Mais je suis vivant{|e}.", en: "I rode at one mile an hour on the sidewalk. A snail passed me. But I'm alive." }, fx: { athletic: 2, discipline: 2 } },
      { label: { fr: 'Refuser de monter', en: 'Refuse to get on' }, text: { fr: "J'ai refusé de monter sur ce truc. Il dort au garage depuis, à côté du vélo d'appartement de papa.", en: "I refused to get on that thing. It's been sleeping in the garage ever since, next to Dad's exercise bike." }, fx: { happy: -1 } },
    ],
  },
  {
    id: 'bb_swim',
    icon: '🏊',
    cat: 'sport',
    actor: 'parent',
    once: true,
    when: { age: [4, 7] },
    scene: { place: 'beach', mood: 'shock' },
    text: {
      fr: [
        "Premier cours de natation. Un maître-nageur en short rouge te demande de mettre la tête sous l'eau. Il est complètement fou.",
        "Tu portes des brassards orange, un bonnet trop serré et la certitude que tu vas mourir dans un mètre vingt d'eau.",
      ],
      en: [
        "First swimming lesson. A lifeguard in red shorts asks you to put your head underwater. He's clearly insane.",
        "You're wearing orange floaties, a cap that's too tight and the certainty that you will die in four feet of water.",
      ],
    },
    choices: [
      {
        label: { fr: 'Sauter dans le bassin', en: 'Jump in' },
        out: [
          { w: 2, text: { fr: "J'ai sauté. J'ai bu la moitié de la piscine, mais j'ai fait trois mouvements de grenouille. Le maître-nageur était fier.", en: "I jumped. I drank half the pool, but I did three frog kicks. The instructor was proud." }, fx: { athletic: 4, happy: 3, flag: 'bb_swimmer', schedule: { key: 'bb_swim_badge', years: 1 } }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai sauté sans mes brassards. Le maître-nageur a dû plonger tout habillé. J'ai découvert que je flotte comme un fer à repasser.", en: "I jumped in without my floaties. The instructor had to dive in fully clothed. I learned I float like a brick." }, fx: { health: -2, happy: -3 } },
        ],
      },
      { label: { fr: "M'accrocher au bord", en: 'Cling to the edge' }, text: { fr: "Je suis resté{|e} accroché{|e} au bord pendant 45 minutes. Diplôme de la Moule.", en: "I clung to the edge for 45 minutes. Barnacle Certificate." }, fx: { happy: -2, discipline: 1 } },
      { label: { fr: 'Faire pipi dans l\'eau', en: 'Pee in the pool' }, rating: 2, text: { fr: "J'ai fait pipi dans la piscine en souriant au maître-nageur. Un petit nuage tiède. Personne n'a rien vu. Tout le monde l'a senti.", en: "I peed in the pool while smiling at the instructor. A small warm cloud. Nobody saw. Everybody felt it." }, fx: { happy: 4, karma: -3 } },
    ],
  },
  {
    id: 'bb_swim_badge',
    icon: '🥇',
    cat: 'sport',
    chainOnly: true,
    when: { age: [5, 8], flag: 'bb_swimmer' },
    scene: { place: 'beach', mood: 'proud' },
    text: {
      fr: [
        "C'est le jour du test pour l'insigne « Petit Dauphin ». Il faut nager 25 mètres. Un gamin de quatre ans vient de le faire en papillon.",
        "Fin de saison à la piscine : le maître-nageur sort les médailles en plastique. Il te reste à traverser le grand bain.",
      ],
      en: [
        "It's test day for the “Little Dolphin” badge. You have to swim 25 meters. A four-year-old just did it butterfly stroke.",
        "End of the season at the pool: the instructor is handing out plastic medals. All you have to do is cross the deep end.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout donner', en: 'Give it everything' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai traversé le grand bain en recrachant de l'eau à chaque mouvement. Insigne « Petit Dauphin » obtenu. Je l'ai fait coudre sur mon pyjama.", en: "I crossed the deep end spitting water at every stroke. “Little Dolphin” badge earned. I had it sewn onto my pajamas." }, fx: { athletic: 5, happy: 6, unflag: 'bb_swimmer' }, mood: 'proud' },
          { w: 1, text: { fr: "À mi-chemin, j'ai attrapé la perche du maître-nageur. Insigne « Petit Bouchon ».", en: "Halfway across, I grabbed the instructor's pole. “Little Cork” badge." }, fx: { athletic: 2, happy: -2, unflag: 'bb_swimmer' } },
        ],
      },
      { label: { fr: 'Marcher au fond', en: 'Walk on the bottom' }, text: { fr: "J'ai marché au fond du petit bain en faisant semblant de nager avec les bras. Insigne obtenu, honneur perdu.", en: "I walked along the bottom of the shallow end, fake-swimming with my arms. Badge earned, honor lost." }, fx: { happy: 3, karma: -3, unflag: 'bb_swimmer' } },
    ],
  },
  {
    id: 'bb_lost_beach',
    icon: '🏖️',
    cat: 'travel',
    once: true,
    when: { age: [3, 7] },
    scene: { place: 'beach', mood: 'cry' },
    text: {
      fr: [
        "Tu as suivi un cerf-volant sur la plage. Maintenant, tous les parasols se ressemblent et tous les parents ont le même maillot.",
        "Plage bondée. Tu reviens de la buvette avec une glace à la main et aucune idée de l'endroit où sont tes parents.",
      ],
      en: [
        "You followed a kite down the beach. Now every umbrella looks the same and every parent is wearing the same swimsuit.",
        "Packed beach. You come back from the snack stand with an ice cream and zero idea where your parents are.",
      ],
    },
    choices: [
      { label: { fr: 'Aller au poste de secours', en: 'Go to the lifeguard' }, text: { fr: "Le maître-nageur a annoncé au mégaphone : « {Le|La} petit{|e} {first} attend ses parents. » Ils sont arrivés au bout de vingt minutes. Vingt.", en: "The lifeguard announced over the megaphone: “Little {first} is waiting for their parents.” They showed up after twenty minutes. Twenty." }, fx: { happy: -2, discipline: 2 } },
      { label: { fr: 'Adopter une autre famille', en: 'Join another family' }, text: { fr: "Je me suis installé{|e} sous le parasol d'une autre famille. Ils avaient des chips. Mes parents m'ont retrouvé{|e} deux heures plus tard en train de jouer aux cartes avec leur grand-père.", en: "I set up camp under another family's umbrella. They had chips. My parents found me two hours later playing cards with their grandpa." }, fx: { happy: 5, karma: -1 }, mood: 'happy' },
      { label: { fr: 'Pleurer très fort', en: 'Cry really loud' }, text: { fr: "J'ai pleuré si fort que trois plages ont été alertées. Mes parents sont arrivés en courant, avec la tête de gens que les autres parents jugent.", en: "I cried so loud three beaches were alerted. My parents came running, with the faces of people being judged by every other parent." }, fx: { happy: -3 } },
    ],
  },

  // ───────────────────────────── imaginary friend (chain) ─────────────────────────────
  {
    id: 'bb_imaginary_bernard',
    icon: '🕴️',
    cat: 'weird',
    once: true,
    weight: 6,
    when: { age: [3, 6] },
    scene: { place: 'home', mood: 'neutral' },
    text: {
      fr: [
        "Ton ami imaginaire s'appelle Bernard. Il a 52 ans, il est expert-comptable et il soupire beaucoup.",
        "Depuis peu, tu parles à Bernard, ton ami imaginaire. Bernard porte une cravate, déteste les lundis et te conseille de « diversifier ton épargne ».",
      ],
      en: [
        "Your imaginary friend is named Bernard. He's 52, he's an accountant and he sighs a lot.",
        "Lately you've been talking to Bernard, your imaginary friend. Bernard wears a tie, hates Mondays and advises you to “diversify your savings.”",
      ],
    },
    choices: [
      { label: { fr: 'Écouter Bernard', en: 'Listen to Bernard' }, text: { fr: "J'ai écouté Bernard. J'ai ouvert un compte épargne dans ma tirelire et j'ai déclaré mes bonbons.", en: "I listened to Bernard. I opened a savings account in my piggy bank and declared my candy." }, fx: { smarts: 4, happy: 2, flag: 'bb_bernard', schedule: { key: 'bb_imaginary_bernard_back', years: 3 } } },
      { label: { fr: 'Accuser Bernard', en: 'Blame Bernard' }, text: { fr: "J'ai cassé le vase du salon et accusé Bernard. Mes parents ont puni Bernard. Bernard ne me parle plus.", en: "I broke the living-room vase and blamed Bernard. My parents punished Bernard. Bernard isn't speaking to me." }, fx: { happy: 3, karma: -3, flag: 'bb_bernard', schedule: { key: 'bb_imaginary_bernard_back', years: 3 } } },
      { label: { fr: 'Virer Bernard', en: 'Fire Bernard' }, text: { fr: "J'ai viré Bernard. Il est parti avec sa calculatrice imaginaire et le peu de dignité qui lui restait.", en: "I fired Bernard. He left with his imaginary calculator and what little dignity he had left." }, fx: { discipline: 2, happy: -1 } },
    ],
  },
  {
    id: 'bb_imaginary_bernard_back',
    icon: '📊',
    cat: 'weird',
    chainOnly: true,
    when: { age: [6, 10], flag: 'bb_bernard' },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Bernard est de retour. Ton ami imaginaire a fait un burn-out, il veut « se reconvertir dans la poterie » et dort sur ton tapis.",
        "Bernard réapparaît, divorcé, et te demande si tu peux l'héberger « quelques semaines, le temps de se retourner ».",
      ],
      en: [
        "Bernard is back. Your imaginary friend burned out, wants to “pivot into pottery” and is sleeping on your rug.",
        "Bernard reappears, divorced, and asks if he can crash with you “for a few weeks, just until he gets back on his feet.”",
      ],
    },
    choices: [
      { label: { fr: "L'héberger", en: 'Let him stay' }, text: { fr: "J'ai hébergé Bernard. Il fait la vaisselle imaginaire et me laisse des post-it imaginaires sur le frigo.", en: "I took Bernard in. He does the imaginary dishes and leaves imaginary sticky notes on the fridge." }, fx: { happy: 4, karma: 3 } },
      { label: { fr: "Dire que j'ai grandi", en: "Say I've grown up" }, text: { fr: "J'ai dit à Bernard que j'étais trop grand{|e} maintenant. Il a hoché la tête, ajusté sa cravate et disparu pour de bon.", en: "I told Bernard I'm too big for him now. He nodded, straightened his tie and vanished for good." }, fx: { smarts: 3, happy: -2, unflag: 'bb_bernard' }, mood: 'sad' },
    ],
  },

  // ───────────────────────────── rating 1: swearing parents, drunk relatives ─────────────────────────────
  {
    id: 'bb_first_word',
    icon: '🗣️',
    cat: 'baby',
    actor: 'parent',
    once: true,
    rating: 1,
    when: { age: [1, 2] },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Toute la famille est penchée sur toi, téléphone en main. C'est le moment de ton premier mot.",
        "{a.rel} répète « dis maman, dis papa » depuis vingt minutes. Tu as autre chose en tête.",
      ],
      en: [
        "The whole family is leaning over you, phones out. It's time for your first word.",
        "{a.rel} has been repeating “say mama, say dada” for twenty minutes. You have other ideas.",
      ],
    },
    choices: [
      { label: { fr: 'Dire « maman » ou « papa »', en: 'Say mama or dada' }, text: { fr: "J'ai dit « [[maman|papa]] ». L'autre parent a fait semblant d'être content pour l'autre.", en: "I said “[[mama|dada]].” The other parent pretended to be happy about it." }, fx: { rel: 6, happy: 3 } },
      { label: { fr: 'Le mot de la voiture', en: 'The word from the car' }, text: { fr: "J'ai dit « putain ». Clairement, distinctement, devant Mamie. On sait tous d'où ça vient.", en: "I said “fuck.” Loud and clear, in front of Grandma. We all know where I got it." }, fx: { happy: 5, smarts: 2, rel: -3, flag: 'bb_potty_mouth' } },
      { label: { fr: 'Dire « Alexa »', en: 'Say “Alexa”' }, text: { fr: "Mon premier mot a été « Alexa ». L'enceinte a lancé de la musique. Mes parents ont eu un vrai moment de remise en question.", en: "My first word was “Alexa.” The speaker started playing music. My parents had a real moment of self-reflection." }, fx: { happy: 3, smarts: 3 } },
    ],
  },
  {
    id: 'bb_plane',
    icon: '✈️',
    cat: 'travel',
    actor: 'parent',
    once: true,
    rating: 1,
    when: { age: [1, 3] },
    scene: { place: 'beach', mood: 'angry' },
    text: {
      fr: [
        "Vol de six heures. Tu es sur les genoux de {a.rel}, rangée 23. Autour de toi, 180 adultes qui ont payé pour dormir.",
        "Décollage. Tes oreilles se bouchent. Le monsieur en costume à côté vient d'enfiler un masque de sommeil, plein d'espoir.",
      ],
      en: [
        "Six-hour flight. You're on {a.rel}'s lap, row 23. Around you, 180 adults who paid to sleep.",
        "Takeoff. Your ears pop. The man in the suit next to you just put on a sleep mask, full of hope.",
      ],
    },
    choices: [
      { label: { fr: 'Hurler tout le vol', en: 'Scream the whole flight' }, text: { fr: "J'ai hurlé six heures non-stop. Le monsieur en costume a commandé quatre whiskies et lâché « bordel de merde » à voix haute. Applaudissements à l'atterrissage, pas pour moi.", en: "I screamed for six hours straight. The suit guy ordered four whiskeys and said “goddamn motherfucker” out loud. Applause on landing, not for me." }, fx: { happy: 3, rel: -5 } },
      { label: { fr: 'Taper dans le siège', en: 'Kick the seat' }, text: { fr: "J'ai donné 1 400 coups de pied dans le siège de devant. La dame s'est retournée et m'a traité{|e} de « petit enfoiré » avec un grand sourire.", en: "I kicked the seat in front 1,400 times. The lady turned around and called me a “little shit” with a big smile." }, fx: { happy: 4, karma: -2 } },
      { label: { fr: 'Dormir', en: 'Sleep' }, text: { fr: "J'ai dormi tout le vol. Mes parents, eux, n'ont pas osé bouger un orteil pendant six heures.", en: "I slept the whole flight. My parents didn't dare move a toe for six hours." }, fx: { rel: 6, health: 2 } },
    ],
  },
  {
    id: 'bb_wedding_tantrum',
    icon: '💒',
    cat: 'family',
    actor: 'parent',
    once: true,
    rating: 1,
    when: { age: [2, 5] },
    scene: { place: 'party', mood: 'shock' },
    text: {
      fr: [
        "Mariage d'un cousin. Pendant les vœux, dans le silence absolu de l'église, tu décides que c'est le moment idéal pour t'exprimer.",
        "Au mariage de ta tante, c'est toi qui portes les alliances sur un petit coussin. Tout le monde compte sur toi. Grosse erreur.",
      ],
      en: [
        "A cousin's wedding. During the vows, in the dead silence of the church, you decide it's the perfect moment to express yourself.",
        "At your aunt's wedding, you're the ring bearer with a tiny pillow. Everyone is counting on you. Big mistake.",
      ],
    },
    choices: [
      { label: { fr: 'Hurler « J\'AI FAIM »', en: "Yell “I'M HUNGRY”" }, text: { fr: "J'ai hurlé « J'AI FAIIIM » pile au moment du « oui ». Le curé a perdu le fil, tonton a éclaté de rire et le marié a dit « putain » dans le micro.", en: "I yelled “I'M HUNGRYYY” right at the “I do.” The priest lost his place, an uncle burst out laughing and the groom said “fuck” into the mic." }, fx: { happy: 5, rel: -4, fame: 1 } },
      { label: { fr: 'Lancer les alliances', en: 'Throw the rings' }, text: { fr: "J'ai lancé les alliances dans l'allée comme des frisbees. Trois oncles bourrés ont rampé sous les bancs pour les retrouver.", en: "I flung the rings down the aisle like frisbees. Three drunk uncles crawled under the pews to find them." }, fx: { happy: 6, rel: -6, karma: -2 } },
      { label: { fr: 'Être sage', en: 'Behave' }, text: { fr: "J'ai été parfait{|e}. Puis je me suis endormi{|e} sous la table du buffet avec un chou de la pièce montée dans chaque main.", en: "I was perfect. Then I fell asleep under the buffet table with a cream puff in each hand." }, fx: { rel: 5, discipline: 2 } },
    ],
  },
  {
    id: 'bb_preschool_bad_word',
    icon: '🤐',
    cat: 'school',
    actor: 'parent',
    once: true,
    rating: 1,
    when: { age: [3, 6], school: 'preschool' },
    scene: { place: 'school', mood: 'shock' },
    text: {
      fr: [
        "En classe, la maîtresse demande ce que vos parents font le week-end. Tu as la réponse, et elle est très détaillée.",
        "Pendant le « Quoi de neuf ? » à {school}, tu lèves la main. Tu as entendu des choses à la maison.",
      ],
      en: [
        "In class, the teacher asks what your parents do on weekends. You have the answer, and it's very detailed.",
        "During show-and-tell at {school}, you raise your hand. You've heard things at home.",
      ],
    },
    choices: [
      { label: { fr: 'Parler du voisin', en: 'Talk about the neighbor' }, text: { fr: "J'ai annoncé à toute la classe que le voisin est « un gros connard qui se gare comme un pied ». La maîtresse a convoqué mes parents. Le voisin a été mis au courant.", en: "I told the whole class our neighbor is “a giant dickhead who parks like a moron.” The teacher called my parents in. The neighbor found out." }, fx: { happy: 4, rel: -6, karma: -2 } },
      { label: { fr: "Raconter l'apéro", en: 'Describe happy hour' }, text: { fr: "J'ai expliqué que maman boit tous les soirs à 18 h « son jus de raisin qui rend rigolo ». La maîtresse a pris des notes.", en: "I explained that Mom drinks her “grape juice that makes her silly” every night at 6. The teacher took notes." }, fx: { happy: 3, rel: -5 } },
      { label: { fr: 'Placer mon premier mot', en: 'Use my very first word' }, if: { flag: 'bb_potty_mouth' }, text: { fr: "J'ai ressorti mon mot préféré depuis toujours, celui que j'ai dit avant « maman ». Toute la classe l'a adopté. Je suis un{|e} pionni{er|ère}.", en: "I busted out my favorite word of all time, the one I said before “mama.” The whole class adopted it. I'm a pioneer." }, fx: { happy: 5, fame: 1, rel: -4 } },
      { label: { fr: 'Parler de dinosaures', en: 'Talk about dinosaurs' }, text: { fr: "J'ai parlé de mes dinosaures pendant dix minutes. Sujet sûr, aucune convocation.", en: "I talked about my dinosaurs for ten minutes. Safe topic, no parent-teacher meeting." }, fx: { smarts: 2 } },
    ],
  },
  {
    id: 'bb_parents_fight',
    icon: '🍽️',
    cat: 'family',
    actor: 'parent',
    cooldown: 3,
    rating: 1,
    when: { age: [2, 7] },
    scene: { place: 'home', mood: 'angry' },
    text: {
      fr: [
        "Tes parents se disputent dans la cuisine. Tu entends « ta mère », « encore », et un mot qui commence par « con » et qui ne finit pas par « fiture ».",
        "Ça hurle dans le salon. Le sujet : qui a oublié de sortir les poubelles. Le niveau : divorce imminent. Une assiette vole.",
      ],
      en: [
        "Your parents are fighting in the kitchen. You hear “your mother,” “again,” and a word that starts with “f” and doesn't end in “udge.”",
        "There's yelling in the living room. The topic: who forgot to take out the trash. The level: imminent divorce. A plate flies.",
      ],
    },
    choices: [
      { label: { fr: 'Me boucher les oreilles', en: 'Cover my ears' }, text: { fr: "Je me suis caché{|e} sous la couette avec mon doudou en chantant très fort. Le doudou a tout entendu quand même.", en: "I hid under the covers with my teddy, singing very loudly. Teddy heard everything anyway." }, fx: { happy: -4, stress: 4 }, mood: 'sad' },
      {
        label: { fr: "M'interposer", en: 'Get between them' },
        out: [
          { w: 2, text: { fr: "J'ai débarqué en pyjama en criant « ARRÊTEZ ». Ils se sont tus net, honteux, et ont commandé une pizza.", en: "I barged in wearing pajamas and yelled “STOP.” They froze, ashamed, and ordered a pizza." }, fx: { rel: 6, karma: 3, happy: 2 } },
          { w: 1, text: { fr: "Je me suis interposé{|e}. Ils m'ont dit en chœur « va te coucher, bordel ». Au moins, ils étaient d'accord sur un truc.", en: "I stepped in. They both said “go to bed, dammit” in perfect unison. At least they agreed on something." }, fx: { happy: -3 } },
        ],
      },
      { label: { fr: 'Profiter du chaos', en: 'Raid the cookie jar' }, text: { fr: "Pendant qu'ils s'engueulaient, j'ai vidé la boîte de biscuits. Chaque dispute a son gagnant.", en: "While they screamed at each other, I emptied the cookie jar. Every fight has a winner." }, fx: { happy: 4, health: -1, karma: -1 } },
    ],
  },
  {
    id: 'bb_parents_car',
    icon: '🚙',
    cat: 'travel',
    actor: 'parent',
    cooldown: 3,
    rating: 1,
    when: { age: [3, 7] },
    scene: { place: 'home', mood: 'angry' },
    text: {
      fr: [
        "Route des vacances : neuf heures de bouchons. Devant, tes parents se disputent sur le GPS et la sortie qu'« on vient de rater, bravo ».",
        "En voiture, tes parents s'insultent à voix basse pour que tu n'entendes pas. Tu entends tout.",
      ],
      en: [
        "Vacation road trip: nine hours of traffic. Up front, your parents are fighting about the GPS and the exit “we just missed, great job.”",
        "In the car, your parents are insulting each other under their breath so you won't hear. You hear everything.",
      ],
    },
    choices: [
      { label: { fr: 'Demander si on arrive', en: 'Ask if we\'re there yet' }, text: { fr: "J'ai demandé « c'est quand qu'on arrive ? » toutes les trois minutes. Au 47e, un gros mot de quatre lettres a retenti et on s'est arrêtés sur la bande d'arrêt d'urgence.", en: "I asked “are we there yet?” every three minutes. On the 47th, a four-letter word rang out and we pulled over on the shoulder." }, fx: { happy: 3, rel: -4 } },
      { label: { fr: 'Prendre parti', en: 'Pick a side' }, text: { fr: "J'ai pris le parti de {a.my}. L'autre a monté le son de la radio et n'a plus dit un mot jusqu'à la frontière.", en: "I sided with {a.my}. The other one cranked up the radio and didn't say a word until the border." }, fx: { rel: 6 } },
      { label: { fr: 'Répéter leurs insultes', en: 'Repeat their insults' }, text: { fr: "J'ai tout répété à voix haute : « abruti », « grosse vache », « tu conduis comme ta mère ». Fou rire général. Dispute terminée.", en: "I repeated everything out loud: “moron,” “cow,” “you drive like your mother.” Everyone cracked up. Fight over." }, fx: { happy: 5, rel: 3, smarts: 1 } },
    ],
  },
  {
    id: 'bb_grandparent_poker',
    icon: '🃏',
    cat: 'family',
    actor: 'grandparent',
    once: true,
    rating: 1,
    when: { age: [5, 7] },
    scene: { place: 'home', mood: 'happy' },
    text: {
      fr: [
        "{a.rel} te garde et s'ennuie. {a:Il|Elle} sort un jeu de cartes et un sachet de caramels : « Je vais t'apprendre le poker. Pas un mot à tes parents. »",
        "Chez {a.rel}, tu as découvert le tiercé, le loto et l'art de hurler « allez, allez, sale bourrin ! » devant la télé.",
      ],
      en: [
        "{a.rel} is babysitting and bored. {a:He|She} pulls out a deck of cards and a bag of caramels: “I'm going to teach you poker. Not a word to your parents.”",
        "At {a.rel}'s place, you've discovered horse racing, scratch cards and the art of screaming “come on, you useless nag!” at the TV.",
      ],
    },
    choices: [
      {
        label: { fr: 'Miser mes bonbons', en: 'Bet my candy' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai bluffé avec une paire de deux et raflé tous les caramels de {a.my}. {a:Il|Elle} m'a regardé{|e} avec fierté et un peu de peur.", en: "I bluffed with a pair of twos and took all of {a.my}'s caramels. {a:He|She} looked at me with pride and a little fear." }, fx: { happy: 6, smarts: 3, rel: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai perdu mes bonbons, mon goûter et ma petite voiture. Rien ne m'a été rendu : « C'est la vie, gamin{|e}. »", en: "I lost my candy, my snack and my toy car. Nothing was returned: “That's life, kid.”" }, fx: { happy: -4, smarts: 2 } },
        ],
      },
      { label: { fr: 'Apprendre à tricher', en: 'Learn to cheat' }, text: { fr: "J'ai appris à cacher un as dans ma manche. Une compétence pour la vie.", en: "I learned to hide an ace up my sleeve. A skill for life." }, fx: { smarts: 2, karma: -3, rel: 4 } },
      { label: { fr: 'Refuser', en: 'Refuse' }, text: { fr: "J'ai déclaré que les jeux d'argent, c'était mal. Déçu{a:|e}, {a.my} a regardé un jeu télé en grommelant.", en: "I declared gambling is bad. Disappointed, {a.my} watched a game show while grumbling." }, fx: { karma: 2, rel: -3 } },
    ],
  },
  {
    id: 'bb_birthday_clown',
    icon: '🤡',
    cat: 'party',
    once: true,
    rating: 1,
    when: { age: [4, 7] },
    scene: { place: 'party', mood: 'shock' },
    text: {
      fr: [
        "Pour ton anniversaire, tes parents ont engagé un clown pas cher. Il sent la bière, il a une cigarette derrière l'oreille et il appelle tous les enfants « mon pote ».",
        "Le clown de ta fête arrive avec une heure de retard. Son nez rouge tient au scotch et il gonfle les ballons avec beaucoup de haine.",
      ],
      en: [
        "For your birthday, your parents hired a cheap clown. He smells like beer, has a cigarette behind his ear and calls every kid “buddy.”",
        "Your party clown shows up an hour late. His red nose is held on with tape and he inflates balloons with a lot of hatred.",
      ],
    },
    choices: [
      { label: { fr: 'Rire à ses blagues', en: 'Laugh at his jokes' }, text: { fr: "J'ai ri à toutes ses blagues, même celle sur son ex-femme. Il m'a fait un ballon en forme de chien. Ou de saucisse.", en: "I laughed at all his jokes, even the one about his ex-wife. He made me a balloon dog. Or a sausage." }, fx: { happy: 5 } },
      { label: { fr: 'Lui arracher le nez', en: 'Rip off his nose' }, text: { fr: "J'ai tiré sur son nez rouge. Il a juré « nom de Dieu de petit con » devant douze enfants et quatre mamans. Meilleure fête de l'année.", en: "I yanked his red nose. He swore “goddamn little bastard” in front of twelve kids and four moms. Best party of the year." }, fx: { happy: 6, karma: -2 } },
      { label: { fr: 'Avoir peur', en: 'Get scared' }, text: { fr: "Le clown m'a terrifié{|e}. J'ai fini la fête caché{|e} dans la machine à laver. Phobie des clowns à vie.", en: "The clown terrified me. I spent the rest of the party hiding in the washing machine. Lifelong fear of clowns." }, fx: { happy: -5 }, mood: 'cry' },
    ],
  },
  {
    id: 'bb_santa_drunk',
    icon: '🎄',
    cat: 'holiday',
    once: true,
    rating: 1,
    when: { age: [3, 7] },
    scene: { place: 'home', mood: 'party' },
    text: {
      fr: [
        "Le soir de Noël, le Père Noël sonne à la porte. Il a la voix de tonton [[Didier|Fred|Bruno]], son pull, et il titube exactement comme lui après le digestif.",
        "Au réveillon, le Père Noël arrive en retard, sentant le vin chaud. Il trébuche dans le sapin en criant « ho ho ho… oh merde ».",
      ],
      en: [
        "On Christmas Eve, Santa rings the doorbell. He has Uncle [[Dave|Rick|Steve]]'s voice, his sweater, and sways exactly like him after the brandy.",
        "On Christmas Eve, Santa shows up late, reeking of mulled wine. He trips into the tree yelling “ho ho ho… oh shit.”",
      ],
    },
    choices: [
      { label: { fr: 'Y croire très fort', en: 'Believe really hard' }, text: { fr: "J'ai choisi de croire. Le Père Noël m'a donné mes cadeaux et s'est endormi sur le canapé. Les rennes devaient être crevés aussi.", en: "I chose to believe. Santa gave me my presents and passed out on the couch. The reindeer must've been wiped too." }, fx: { happy: 6 } },
      { label: { fr: "C'est tonton !", en: "It's my uncle!" }, text: { fr: "J'ai hurlé « C'EST TONTON ! ». Le Père Noël a juré, sa barbe est tombée dans la bûche. Fin de la magie, début de la lucidité.", en: "I yelled “IT'S MY UNCLE!” Santa swore and his beard fell into the Yule log. End of the magic, start of clarity." }, fx: { smarts: 4, happy: -2 } },
      { label: { fr: 'En profiter', en: 'Shake him down' }, text: { fr: "J'ai profité de son état pour négocier trois cadeaux de plus. Il a dit oui à tout. Le lendemain, il ne se souvenait de rien.", en: "I took advantage of his condition to negotiate three extra presents. He said yes to everything. The next day he remembered nothing." }, fx: { happy: 5, smarts: 2, karma: -1 }, mood: 'proud' },
    ],
  },
  {
    id: 'bb_godparent_bbq',
    icon: '🍖',
    cat: 'party',
    once: true,
    rating: 1,
    when: { age: [3, 7] },
    scene: { place: 'park', mood: 'party' },
    text: {
      fr: [
        "Barbecue chez ton parrain. Il est 15 h, il en est à son huitième « petit rosé » et il a décidé de faire ton éducation.",
        "Ta marraine, lunettes de soleil et verre de sangria à la main, te prend à part au barbecue : « Viens là, je vais t'apprendre la vie. »",
      ],
      en: [
        "Barbecue at your godfather's. It's 3 p.m., he's on his eighth “little glass of rosé” and he's decided to take charge of your education.",
        "Your godmother, sunglasses on and sangria in hand, pulls you aside at the barbecue: “C'mere, I'm gonna teach you about life.”",
      ],
    },
    choices: [
      { label: { fr: "Roter l'alphabet", en: 'Burp the alphabet' }, text: { fr: "J'ai appris à roter l'alphabet jusqu'à la lettre P. Ovation des adultes éméchés, regard noir de mes parents.", en: "I learned to burp the alphabet up to the letter P. Standing ovation from the tipsy adults, death stare from my parents." }, fx: { happy: 5 } },
      { label: { fr: 'Un chant de supporters', en: 'A soccer chant' }, text: { fr: "J'ai appris un chant de supporters plein d'insultes contre l'arbitre. Je le chante à la boulangerie.", en: "I learned a soccer chant full of insults about the referee. I sing it at the bakery." }, fx: { happy: 4, karma: -1 } },
      { label: { fr: 'Aller jouer ailleurs', en: 'Go play elsewhere' }, text: { fr: "Je suis parti{|e} jouer avec les autres enfants. On a fait griller une limace sur le coin du barbecue. Personne n'a voulu goûter.", en: "I went to play with the other kids. We grilled a slug on the corner of the barbecue. Nobody wanted a taste." }, fx: { happy: 4 } },
    ],
  },
  {
    id: 'bb_question_bus',
    icon: '🚌',
    cat: 'weird',
    actor: 'parent',
    once: true,
    rating: 1,
    when: { age: [3, 6] },
    scene: { place: 'park', mood: 'shock' },
    text: {
      fr: [
        "Dans le bus bondé, tu remarques un monsieur. Tu as une question, et tu vas la poser très, très fort.",
        "À la boulangerie, une dame devant toi a un énorme grain de beauté poilu. Ton cerveau vient d'activer ta bouche sans consulter personne.",
      ],
      en: [
        "On the packed bus, you notice a man. You have a question, and you're going to ask it very, very loudly.",
        "At the bakery, the lady in front of you has a huge hairy mole. Your brain just activated your mouth without consulting anyone.",
      ],
    },
    choices: [
      { label: { fr: '« Pourquoi il pue ? »', en: '“Why does he stink?”' }, text: { fr: "J'ai demandé à voix haute pourquoi le monsieur sentait « comme les toilettes de Mamie ». Silence total. On est descendus à l'arrêt suivant.", en: "I asked out loud why the man smelled “like Grandma's toilet.” Dead silence. We got off at the next stop." }, fx: { happy: 4, rel: -4 } },
      { label: { fr: '« C\'est une sorcière ? »', en: '“Is she a witch?”' }, text: { fr: "J'ai demandé si la dame était une sorcière ou une pirate. Elle m'a répondu « ta gueule, morveux ». J'ai appris qu'on pouvait dire ça aux enfants.", en: "I asked if the lady was a witch or a pirate. She said “shut your mouth, you little snot.” I learned you're allowed to say that to kids." }, fx: { happy: -2, smarts: 2 } },
      { label: { fr: 'Chuchoter', en: 'Whisper it' }, text: { fr: "J'ai chuchoté ma question. Sauf qu'un chuchotement d'enfant porte à trente mètres : tout le monde a entendu, et {a.my} a fait semblant de ne pas me connaître.", en: "I whispered my question. Except a kid's whisper carries a hundred feet: everybody heard, and {a.my} pretended not to know me." }, fx: { happy: 2, rel: -2 } },
    ],
  },
  {
    id: 'bb_restaurant',
    icon: '🍝',
    cat: 'baby',
    actor: 'parent',
    once: true,
    rating: 1,
    when: { age: [1, 2] },
    scene: { place: 'party', mood: 'angry' },
    text: {
      fr: [
        "Tes parents tentent un « petit resto comme avant ». Toi, tu es dans une chaise haute, avec un regard qui dit « essayez pour voir ».",
        "Restaurant chic, nappes blanches, serveur coincé, et {a.rel} a juré que « tout va bien se passer ».",
      ],
      en: [
        "Your parents are attempting a “nice dinner out like old times.” You're in a high chair, with a look that says “go ahead, try me.”",
        "Fancy restaurant, white tablecloths, uptight waiter, and {a.rel} swore that “it's going to be fine.”",
      ],
    },
    choices: [
      { label: { fr: 'Lancer les spaghettis', en: 'Throw the spaghetti' }, text: { fr: "J'ai lancé une poignée de spaghettis sur la table d'à côté. Ils sont restés collés au monsieur, et j'ai entendu {a.my} murmurer « putain, on aurait dû prendre une baby-sitter ».", en: "I flung a handful of spaghetti at the next table. It stuck to the man, and I heard {a.my} mutter “fuck, we should've gotten a babysitter.”" }, fx: { happy: 5, rel: -5 } },
      { label: { fr: 'Hurler', en: 'Scream' }, text: { fr: "J'ai hurlé dès l'arrivée des entrées. Le dessert a fini dans une barquette en alu. Le resto, c'est terminé pour dix ans.", en: "I screamed as soon as the appetizers arrived. Dessert ended up in a foil container. Restaurants are over for ten years." }, fx: { happy: 2, rel: -4 } },
      { label: { fr: 'Sourire au serveur', en: 'Smile at the waiter' }, text: { fr: "J'ai souri au serveur toute la soirée. Dessert offert. Mes parents ont compris que j'étais un investissement.", en: "I smiled at the waiter all evening. Free dessert. My parents realized I'm an investment." }, fx: { looks: 2, rel: 5, happy: 3 } },
      { label: { fr: "M'endormir dans les pâtes", en: 'Fall asleep in my pasta' }, text: { fr: "Je me suis endormi{|e} la tête dans l'assiette. Mes parents ont fini leur bouteille en paix, en me regardant ronfler dans la sauce tomate.", en: "I fell asleep face-first in my plate. My parents finished their bottle in peace, watching me snore into the marinara." }, fx: { rel: 6, happy: 1 } },
    ],
  },
  {
    id: 'bb_parents_silent',
    icon: '📨',
    cat: 'family',
    actor: 'parent',
    cooldown: 3,
    rating: 1,
    when: { age: [4, 7] },
    scene: { place: 'home', mood: 'neutral' },
    text: {
      fr: [
        "Tes parents ne se parlent plus depuis trois jours. Ils passent par toi : « Dis à l'autre que son connard de copain a encore appelé. »",
        "Ambiance glaciale à la maison, et {a.rel} te charge d'un message pour l'autre : « Dis-lui que je suis au courant pour la carte bleue, ce trou du cul. »",
      ],
      en: [
        "Your parents haven't spoken in three days. They go through you: “Tell your other parent their asshole buddy called again.”",
        "The house is frozen solid, and {a.rel} gives you a message for the other one: “Tell them I know about the credit card, the jackass.”",
      ],
    },
    choices: [
      { label: { fr: 'Transmettre mot pour mot', en: 'Pass it on word for word' }, text: { fr: "J'ai transmis le message mot pour mot, avec l'intonation. Ça a relancé la guerre pour deux semaines.", en: "I delivered the message word for word, with the tone. It restarted the war for two weeks." }, fx: { happy: -2, smarts: 2, rel: -2 } },
      { label: { fr: 'Embellir le message', en: 'Make it nicer' }, text: { fr: "J'ai transformé « va te faire voir » en « je t'aime ». Ils se sont réconciliés. Je suis un génie de la diplomatie.", en: "I turned “go to hell” into “I love you.” They made up. I'm a diplomatic genius." }, fx: { karma: 5, happy: 3, rel: 4 }, mood: 'proud' },
      { label: { fr: 'Facturer le service', en: 'Charge for the service' }, text: { fr: "J'ai exigé un bonbon par message. À la fin de la semaine, j'avais une carie et un monopole.", en: "I charged one candy per message. By the end of the week, I had a cavity and a monopoly." }, fx: { happy: 4, health: -2, smarts: 2 } },
    ],
  },
  {
    id: 'bb_preschool_late',
    icon: '⏰',
    cat: 'school',
    actor: 'parent',
    once: true,
    rating: 1,
    when: { age: [3, 5], school: 'preschool' },
    scene: { place: 'school', mood: 'sad' },
    text: {
      fr: [
        "Il est 19 h. Tous les enfants de {school} sont partis. Il ne reste que toi, la maîtresse et son regard noir, et {a.rel} ne répond pas au téléphone.",
        "Personne n'est venu te chercher à la sortie. La directrice joue au Uno avec toi en appelant un à un tous les numéros de ta fiche.",
      ],
      en: [
        "It's 7 p.m. Every kid at {school} has gone home. It's just you, the teacher and her death glare, and {a.rel} isn't picking up.",
        "Nobody came to pick you up. The principal plays Uno with you while calling every number on your emergency card.",
      ],
    },
    choices: [
      { label: { fr: 'Attendre sagement', en: 'Wait patiently' }, text: { fr: "J'ai attendu jusqu'à 19 h 40, quand {a.my} a déboulé en courant, avec une haleine de rosé et une histoire de « pot de départ ».", en: "I waited until 7:40, when {a.my} came running in with rosé breath and a story about “someone's going-away drinks.”" }, fx: { happy: -3, rel: -6 } },
      { label: { fr: 'Tout raconter', en: 'Tell the teacher everything' }, text: { fr: "Pour passer le temps, j'ai raconté à la maîtresse tout ce qui se passe à la maison. Absolument tout. Elle a pris des notes.", en: "To pass the time, I told the teacher everything that happens at home. Absolutely everything. She took notes." }, fx: { smarts: 2, rel: -3 } },
      { label: { fr: 'Gagner au Uno', en: 'Win at Uno' }, text: { fr: "J'ai battu la directrice au Uno six fois d'affilée. Elle a lâché « sale gosse » entre ses dents.", en: "I beat the principal at Uno six times in a row. She muttered “little brat” under her breath." }, fx: { smarts: 3, happy: 3 }, mood: 'proud' },
    ],
  },
  {
    id: 'bb_horror_movie',
    icon: '🔪',
    cat: 'family',
    actor: 'parent',
    once: true,
    rating: 1,
    when: { age: [4, 7] },
    scene: { place: 'home', mood: 'shock', fx: 'ghost' },
    text: {
      fr: [
        "Tes parents regardent un film d'horreur en croyant que tu dors. Tu ne dors pas. Tu es derrière le canapé. Quelqu'un vient de se faire découper à la tronçonneuse.",
        "Tu te lèves pour un verre d'eau et tu tombes sur le film de tes parents : un clown tueur dans les égouts. Tu restes. Tu n'aurais pas dû.",
      ],
      en: [
        "Your parents are watching a horror movie thinking you're asleep. You're not. You're behind the couch. Someone just got chainsawed.",
        "You get up for a glass of water and stumble onto your parents' movie: a killer clown in the sewers. You stay. You shouldn't have.",
      ],
    },
    choices: [
      { label: { fr: "Regarder jusqu'au bout", en: 'Watch to the end' }, text: { fr: "J'ai tout regardé. Je n'ai plus dormi pendant trois mois et je fais pipi la lumière allumée, porte ouverte.", en: "I watched the whole thing. I didn't sleep for three months and I now pee with the light on and the door open." }, fx: { happy: -5, health: -2, smarts: 1 } },
      { label: { fr: 'Crier', en: 'Scream' }, text: { fr: "J'ai hurlé au moment du jump scare. Mes parents ont hurlé encore plus fort en me voyant, et {a.my} a renversé sa bière sur le chat.", en: "I screamed at the jump scare. My parents screamed even louder when they saw me, and {a.my} spilled beer all over the cat." }, fx: { happy: -2, rel: 2 } },
      { label: { fr: 'Retourner me coucher', en: 'Go back to bed' }, text: { fr: "Je suis retourné{|e} me coucher sans un mot. Pendant des années, j'ai cru que les égouts étaient habités par des clowns. Je n'ai aucune preuve du contraire.", en: "I went back to bed without a word. For years, I believed sewers were full of clowns. I have no proof otherwise." }, fx: { happy: -1 } },
    ],
  },
  {
    id: 'bb_flatpack',
    icon: '🔩',
    cat: 'family',
    actor: 'parent',
    once: true,
    rating: 1,
    when: { age: [1, 3] },
    scene: { place: 'home', mood: 'angry' },
    text: {
      fr: [
        "Tes parents montent ton nouveau lit en kit. Ça fait trois heures. Il reste six vis, une pièce mystère et aucun espoir.",
        "Le salon est jonché de planches, d'une notice en suédois et de deux adultes qui ne s'aiment plus du tout.",
      ],
      en: [
        "Your parents are assembling your new flat-pack bed. It's been three hours. There are six screws left, one mystery piece and no hope.",
        "The living room is covered in planks, a Swedish instruction manual and two adults who no longer love each other at all.",
      ],
    },
    choices: [
      { label: { fr: 'Cacher une vis', en: 'Hide a screw' }, text: { fr: "J'ai caché la vis numéro 114 dans ma couche. Le lit tient debout par miracle, et {a.my} a maudit trois générations de Suédois.", en: "I hid screw number 114 in my diaper. The bed stands by sheer miracle, and {a.my} cursed three generations of Swedes." }, fx: { happy: 4, rel: -3 } },
      { label: { fr: 'Applaudir les gros mots', en: 'Clap at every swear' }, text: { fr: "J'ai applaudi chaque fois que quelqu'un disait « putain ». J'ai énormément applaudi.", en: "I clapped every time someone said “fuck.” I clapped a lot." }, fx: { happy: 5, smarts: 1 } },
      { label: { fr: 'Mâchouiller la notice', en: 'Chew the manual' }, text: { fr: "J'ai mâchouillé la notice, page 7. La page 7 était importante. Le lit penche depuis.", en: "I chewed the manual, page 7. Page 7 was important. The bed has leaned ever since." }, fx: { happy: 3, rel: -2 } },
    ],
  },
  {
    id: 'bb_neighbor_party',
    icon: '🎉',
    cat: 'baby',
    actor: 'parent',
    once: true,
    rating: 1,
    when: { age: [1, 3] },
    scene: { place: 'home', mood: 'sleepy' },
    text: {
      fr: [
        "Il est 3 h du matin et les voisins du dessus font la fête. La basse fait vibrer ton berceau. Tu trouves ça incroyable.",
        "Soirée chez les voisins : techno, rires, verres qui cassent. Tu ne dors pas, et {a.rel} non plus, en pyjama à la fenêtre.",
      ],
      en: [
        "It's 3 a.m. and the upstairs neighbors are partying. The bass is shaking your crib. You think it's amazing.",
        "Party next door: techno, laughing, glasses breaking. You're not sleeping, and neither is {a.rel}, at the window in pajamas.",
      ],
    },
    choices: [
      { label: { fr: 'Danser dans le berceau', en: 'Dance in my crib' }, text: { fr: "J'ai dansé dans mon berceau toute la nuit. Mes parents ont hurlé « BANDE DE CONNARDS » par la fenêtre. Les voisins ont monté le son.", en: "I danced in my crib all night. My parents screamed “BUNCH OF ASSHOLES” out the window. The neighbors turned it up." }, fx: { happy: 6, rel: -2 }, mood: 'party' },
      { label: { fr: 'Hurler en rythme', en: 'Scream along' }, text: { fr: "J'ai crié en rythme jusqu'à 6 h. Les voisins sont descendus s'excuser, ont vu la tête de mes parents et sont repartis acheter des bouchons d'oreille.", en: "I screamed on beat until 6 a.m. The neighbors came down to apologize, saw my parents' faces and left to buy earplugs." }, fx: { happy: 4 } },
      { label: { fr: 'Dormir quand même', en: 'Sleep through it' }, text: { fr: "J'ai dormi comme une pierre. Mes parents, eux, ont passé la nuit à taper au plafond avec un manche à balai.", en: "I slept like a rock. My parents spent the night banging on the ceiling with a broom handle." }, fx: { health: 2, rel: 3 } },
    ],
  },

  // ───────────────────────────── rating 2: gross-out ─────────────────────────────
  {
    id: 'bb_crayon',
    icon: '🖍️',
    cat: 'baby',
    actor: 'parent',
    once: true,
    rating: 2,
    when: { age: [2, 4] },
    scene: { place: 'home', mood: 'shock', fx: 'poop' },
    text: {
      fr: [
        "Tu as mangé un crayon de cire bleu entier. Le lendemain, {a.rel} change ta couche et pousse un cri : c'est du bleu Schtroumpf.",
        "Pendant le coloriage, tu as goûté le vert, le rouge et le jaune. Le résultat, deux jours plus tard dans la couche, est un véritable arc-en-ciel.",
      ],
      en: [
        "You ate an entire blue crayon. The next day, {a.rel} changes your diaper and screams: it's Smurf blue.",
        "During coloring time, you tasted green, red and yellow. The result, two days later in your diaper, is a genuine rainbow.",
      ],
    },
    choices: [
      { label: { fr: 'Manger le rouge aussi', en: 'Eat the red one too' }, text: { fr: "J'ai mangé le rouge. Le lendemain, {a.my} a cru à une hémorragie et m'a emmené{|e} aux urgences. Le médecin a juste demandé « crayon ? ».", en: "I ate the red one. The next day, {a.my} thought I was hemorrhaging and rushed me to the ER. The doctor just asked: “Crayon?”" }, fx: { happy: 3, health: -2 } },
      { label: { fr: 'Peindre avec', en: 'Fingerpaint with it' }, text: { fr: "J'ai profité de la couche ouverte pour faire de la peinture au doigt sur la table à langer. Œuvre multicolore, odeur indescriptible.", en: "I took advantage of the open diaper to fingerpaint on the changing table. Multicolor masterpiece, indescribable smell." }, fx: { happy: 4, rel: -6, visual: 'poop' } },
      { label: { fr: 'Sourire fièrement', en: 'Grin proudly' }, text: { fr: "J'ai fait un sourire bleu jusqu'aux oreilles. La photo est encadrée dans le couloir.", en: "I gave a blue ear-to-ear grin. The photo is framed in the hallway." }, fx: { happy: 3, rel: 3 } },
    ],
  },
  {
    id: 'bb_cat_food',
    icon: '🐱',
    cat: 'pet',
    actor: 'pet',
    once: true,
    rating: 2,
    when: { age: [1, 3], has: 'pet' },
    scene: { place: 'home', mood: 'sick' },
    text: {
      fr: [
        "La gamelle de {a.first} est à ta hauteur, pleine de croquettes qui sentent le poisson et le carton mouillé. Personne ne regarde.",
        "Tu viens de découvrir la gamelle de {a.first}. Des petites boulettes marron qui croustillent. Des céréales, sûrement.",
      ],
      en: [
        "{a.first}'s bowl is right at your level, full of kibble that smells like fish and wet cardboard. Nobody's watching.",
        "You've just discovered {a.first}'s food bowl. Little brown crunchy pellets. Cereal, probably.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout manger', en: 'Eat it all' },
        out: [
          { w: 2, text: { fr: "J'ai vidé la gamelle. {a.first} m'a fixé{|e} avec une haine pure. Ensuite, j'ai vomi du saumon reconstitué sur le tapis du salon.", en: "I cleaned out the bowl. {a.first} stared at me with pure hatred. Then I threw up reconstituted salmon on the living-room rug." }, fx: { happy: 2, health: -3, rel: -5 }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai mangé les croquettes. Je n'ai jamais eu les cheveux aussi brillants.", en: "I ate the kibble. My hair has never been shinier." }, fx: { happy: 3, looks: 2, health: 1 } },
        ],
      },
      { label: { fr: "Boire l'eau de la gamelle", en: 'Drink from the water bowl' }, text: { fr: "J'ai bu l'eau de la gamelle à quatre pattes, avec les poils et la bave qui flottent. Goût de vieille éponge.", en: "I drank from the water bowl on all fours, fur and drool floating in it. Tasted like an old sponge." }, fx: { happy: 2, health: -2 } },
      { label: { fr: 'Partager', en: 'Share with it' }, text: { fr: "Une croquette pour moi, une pour {a.first}, et ainsi de suite. On est maintenant frères de croquettes.", en: "One kibble for me, one for {a.first}, and so on. We're kibble siblings now." }, fx: { rel: 8, health: -1, happy: 3 } },
    ],
  },
  {
    id: 'bb_bath_poop',
    icon: '🛁',
    cat: 'baby',
    actor: 'parent',
    once: true,
    rating: 2,
    when: { age: [1, 3] },
    scene: { place: 'home', mood: 'shock', fx: 'poop' },
    text: {
      fr: [
        "C'est l'heure du bain : des bulles, un canard en plastique et {a.rel} qui chante faux. Soudain, tu sens une petite pression familière…",
        "Bain du soir. Tu joues avec ton canard quand tu sens que quelque chose d'autre va bientôt flotter dans l'eau avec lui.",
      ],
      en: [
        "Bath time: bubbles, a rubber duck and {a.rel} singing off-key. Suddenly, you feel a familiar little pressure…",
        "Evening bath. You're playing with your duck when you sense something else is about to join it in the water.",
      ],
    },
    choices: [
      { label: { fr: 'Laisser faire la nature', en: 'Let nature take its course' }, text: { fr: "Un petit sous-marin brun a fait surface entre les bulles, et {a.my} a hurlé « CODE MARRON » avant de me sortir de l'eau comme on désamorce une bombe.", en: "A little brown submarine surfaced among the bubbles, and {a.my} yelled “CODE BROWN” before lifting me out like a bomb being defused." }, fx: { happy: 5, rel: -3, visual: 'poop' } },
      { label: { fr: 'Jouer avec', en: 'Play with it' }, text: { fr: "J'ai cru que c'était un nouveau jouet. Je l'ai attrapé et brandi fièrement. Le canard en plastique a été jeté avec.", en: "I thought it was a new toy. I grabbed it and held it up proudly. The rubber duck got thrown out with it." }, fx: { happy: 4, health: -2, rel: -6, visual: 'poop' } },
      { label: { fr: 'Juste un petit pipi', en: 'Just a little pee' }, text: { fr: "Je me suis contenté{|e} d'un pipi tiède et discret dans le bain. Personne n'a rien remarqué. Sauf le canard.", en: "I settled for a warm, discreet pee in the bath. Nobody noticed. Except the duck." }, fx: { happy: 3 } },
    ],
  },
  {
    id: 'bb_diaper',
    icon: '🧷',
    cat: 'baby',
    actor: 'parent',
    cooldown: 2,
    rating: 2,
    when: { age: [1, 2] },
    scene: { place: 'home', mood: 'shock', fx: 'poop' },
    text: {
      fr: [
        "Table à langer : {a.rel} retire ta couche, se penche, et commet l'erreur de placer son visage exactement dans l'axe.",
        "{a.rel} vient de te mettre une couche toute propre. Tu sens que c'est le moment idéal pour l'inaugurer.",
      ],
      en: [
        "Changing table: {a.rel} takes off your diaper, leans in, and makes the mistake of putting their face directly in the line of fire.",
        "{a.rel} just put a fresh, clean diaper on you. You sense it's the perfect moment to christen it.",
      ],
    },
    choices: [
      { label: { fr: 'Arroser', en: 'Open fire' }, text: { fr: "J'ai lâché un jet de pipi continu d'une portée de 80 cm : œil gauche de {a.my}, mur, plafond. Record familial.", en: "I fired a continuous stream with a 3-foot range: {a.my}'s left eye, the wall, the ceiling. Family record." }, fx: { happy: 5, rel: -4 } },
      { label: { fr: 'Inaugurer la couche propre', en: 'Christen the clean diaper' }, text: { fr: "J'ai attendu qu'elle soit bien fermée, puis j'ai tout lâché en regardant {a.my} droit dans les yeux. Domination totale.", en: "I waited until it was fully fastened, then let it all go while staring {a.my} dead in the eyes. Total domination." }, fx: { happy: 5, rel: -5, visual: 'poop' } },
      { label: { fr: 'Mettre le pied dedans', en: 'Kick the dirty diaper' }, text: { fr: "J'ai donné un coup de talon dans la couche sale ouverte. Il y en avait sur mon pied, sur la table, sur la manche de {a.my} et, mystérieusement, sur la lampe.", en: "I stomped my heel into the open dirty diaper. It got on my foot, the table, {a.my}'s sleeve and, mysteriously, the lamp." }, fx: { happy: 4, rel: -6, visual: 'poop' } },
    ],
  },
  {
    id: 'bb_daycare_germs',
    icon: '🦠',
    cat: 'health',
    cooldown: 3,
    rating: 2,
    when: { age: [1, 3] },
    scene: { place: 'school', mood: 'sick' },
    text: {
      fr: [
        "À la crèche, un bébé à la morve vert fluo te tend son jouet, qu'il suçote depuis une demi-heure. Il a l'air si gentil.",
        "Un enfant de la crèche t'éternue en pleine bouche. Tu sens une petite pluie tiède et le début d'une longue amitié virale.",
      ],
      en: [
        "At daycare, a baby with neon-green snot hands you its toy, which it's been sucking on for half an hour. It seems so nice.",
        "A daycare kid sneezes right into your mouth. You feel a warm little drizzle and the start of a long viral friendship.",
      ],
    },
    choices: [
      { label: { fr: 'Accepter le jouet', en: 'Take the toy' }, text: { fr: "J'ai pris le jouet et je l'ai sucé à mon tour. Deux jours plus tard, toute la famille avait la gastro. Vomi en stéréo dans toute la maison.", en: "I took the toy and sucked on it too. Two days later, the whole family had the stomach flu. Vomit in stereo throughout the house." }, fx: { health: -4, happy: -2, disease: 'gastro' }, mood: 'sick' },
      { label: { fr: 'Éternuer en retour', en: 'Sneeze back' }, text: { fr: "Je lui ai éternué dessus à mon tour, puis on s'est essuyé la morve mutuellement sur les joues. Amis pour la vie, malades pour la semaine.", en: "I sneezed right back on him, then we wiped our snot on each other's cheeks. Friends for life, sick for a week." }, fx: { health: -3, happy: 3, disease: 'cold' } },
      {
        label: { fr: 'Ramper loin', en: 'Crawl away' },
        out: [
          { w: 1, text: { fr: "J'ai rampé vers le coin propre de la crèche. Il n'existe pas.", en: "I crawled toward the clean corner of the daycare. It doesn't exist." }, fx: { health: -2, disease: 'cold' } },
          { w: 1, text: { fr: "J'ai rampé loin de lui à une vitesse impressionnante. Système immunitaire intact, fierté immense.", en: "I crawled away at impressive speed. Immune system intact, pride enormous." }, fx: { happy: 3, athletic: 2 }, mood: 'proud' },
        ],
      },
    ],
  },
  {
    id: 'bb_preschool_accident',
    icon: '💦',
    cat: 'school',
    once: true,
    rating: 2,
    when: { age: [3, 4], school: 'preschool' },
    scene: { place: 'school', mood: 'cry' },
    text: {
      fr: [
        "En pleine ronde à {school}, tu réalises que ton envie de pipi était plus pressante que prévu. Une flaque tiède s'élargit sous tes chaussures.",
        "À la sieste, tu te réveilles sur un lit de camp étrangement chaud et humide. Ton petit voisin te regarde avec horreur.",
      ],
      en: [
        "In the middle of circle time at {school}, you realize you needed to pee more urgently than you thought. A warm puddle spreads under your shoes.",
        "At nap time, you wake up on a cot that's strangely warm and damp. The kid on the next cot stares at you in horror.",
      ],
    },
    choices: [
      { label: { fr: 'Accuser le voisin', en: 'Blame the kid next to me' }, text: { fr: "J'ai pointé du doigt le petit d'à côté. Il a pleuré, j'ai gardé ma dignité. La maîtresse n'a pas cru un mot.", en: "I pointed at the kid next to me. He cried, I kept my dignity. The teacher didn't believe a word." }, fx: { happy: 2, karma: -4 } },
      { label: { fr: 'Faire comme si de rien', en: 'Act natural' }, text: { fr: "J'ai continué la ronde en clapotant dans mes chaussures. Ensuite, pantalon de rechange de l'école : rose, trop court, avec des moutons.", en: "I kept dancing in circles, squelching in my shoes. Then came the school's spare pants: pink, too short, with sheep on them." }, fx: { happy: -3, looks: -2 } },
      { label: { fr: 'Assumer fièrement', en: 'Own it proudly' }, text: { fr: "J'ai annoncé à toute la classe « J'ai fait pipi ! » comme si c'était un exploit sportif. Deux camarades ont applaudi.", en: "I announced to the whole class “I peed!” like it was an athletic achievement. Two classmates applauded." }, fx: { happy: 3, smarts: -1 } },
      { label: { fr: 'Invoquer mon record', en: 'Cite my potty record' }, if: { flag: 'bb_potty_pro' }, text: { fr: "J'ai rappelé à la maîtresse que j'étais champion{|ne} du pot à la maison. Elle a répondu « visiblement pas ici ». Humiliation.", en: "I reminded the teacher that I'm a potty champion at home. She replied, “Clearly not here.” Humiliation." }, fx: { happy: -3, smarts: 1 } },
    ],
  },
  {
    id: 'bb_potty_proud',
    icon: '💩',
    cat: 'baby',
    actor: 'parent',
    once: true,
    rating: 2,
    when: { age: [2, 3] },
    scene: { place: 'home', mood: 'proud', fx: 'poop' },
    text: {
      fr: [
        "Tes parents reçoivent des amis à dîner. Tu viens de réussir ton premier caca dans le pot. Une telle œuvre mérite un public.",
        "Pour la première fois, c'est dans le pot et pas dans la couche. Tu es au sommet de ta gloire. Ça mérite une exposition.",
      ],
      en: [
        "Your parents have friends over for dinner. You just pulled off your first poop in the potty. A work like this deserves an audience.",
        "For the first time, it's in the potty and not the diaper. You're at the peak of your glory. This deserves an exhibition.",
      ],
    },
    choices: [
      { label: { fr: 'Apporter le pot à table', en: 'Bring the potty to dinner' }, text: { fr: "J'ai traversé le salon en portant mon pot à deux mains et je l'ai posé sur la table, entre le fromage et le pain. Les invités ne sont jamais revenus.", en: "I crossed the living room carrying my potty with both hands and set it on the table, between the cheese and the bread. The guests never came back." }, fx: { happy: 6, rel: -6, visual: 'poop' } },
      { label: { fr: 'Lui dire au revoir', en: 'Wave it goodbye' }, text: { fr: "J'ai tiré la chasse en pleurant et en criant « au revoir caca ! ». Un deuil sincère.", en: "I flushed it while crying and shouting “bye-bye poopy!” A sincere farewell." }, fx: { happy: 2, discipline: 3 } },
      { label: { fr: 'Exiger une photo', en: 'Demand a photo' }, if: { era: [2012, 2100] }, text: { fr: "J'ai exigé qu'on prenne mon œuvre en photo. Elle a été envoyée par erreur sur le groupe WhatsApp de la famille. Mamie a répondu « Bravo !! » avec trois cœurs.", en: "I demanded a photo of my masterpiece. It got sent by mistake to the family group chat. Grandma replied “Well done!!” with three hearts." }, fx: { happy: 5, rel: 2 } },
    ],
  },
  {
    id: 'bb_sibling_booger',
    icon: '👃',
    cat: 'family',
    actor: 'sibling',
    cooldown: 3,
    rating: 2,
    when: { age: [3, 7], has: 'sibling' },
    scene: { place: 'home', mood: 'angry' },
    text: {
      fr: [
        "{a.rel} t'a piqué ton dessert. Tu as un doigt dans le nez, une crotte de nez de belle taille et une idée.",
        "{a.first} refuse de te prêter sa console. Pendant ce temps, son verre de jus de pomme est sans surveillance.",
      ],
      en: [
        "{a.rel} stole your dessert. You have a finger up your nose, a sizable booger and an idea.",
        "{a.first} won't let you play their console. Meanwhile, their glass of apple juice is unguarded.",
      ],
    },
    choices: [
      { label: { fr: 'Crotte de nez dans son yaourt', en: 'Booger in their yogurt' }, text: { fr: "J'ai planté ma plus belle crotte de nez dans le yaourt de {a.first}. {a:Il|Elle} a tout mangé en disant « il est bon, ce yaourt ».", en: "I planted my finest booger in {a.first}'s yogurt. {a:He|She} ate the whole thing and said, “This yogurt's good.”" }, fx: { happy: 6, karma: -4, rel: -2 } },
      { label: { fr: 'Cracher dans son jus', en: 'Spit in their juice' }, text: { fr: "J'ai craché dans son jus de pomme et remué avec mon doigt. {a:Il|Elle} l'a bu en me regardant droit dans les yeux. Respect.", en: "I spat in their apple juice and stirred it with my finger. {a:He|She} drank it while staring me right in the eyes. Respect." }, fx: { happy: 4, karma: -3 } },
      { label: { fr: 'Le dire aux parents', en: 'Tell on them' }, text: { fr: "J'ai couru pleurer chez les parents. {a.first} a été puni{a:|e}, et moi j'ai eu son dessert.", en: "I ran to my parents crying. {a.first} got punished, and I got their dessert." }, fx: { happy: 3, rel: -5 } },
    ],
  },
  {
    id: 'bb_birthday_vomit',
    icon: '🤮',
    cat: 'party',
    once: true,
    rating: 2,
    when: { age: [3, 7] },
    scene: { place: 'party', mood: 'sick' },
    text: {
      fr: [
        "Anniversaire chez un copain : château gonflable, quatre parts de gâteau, deux litres de soda et des bonbons qui piquent. Tu sautes.",
        "Goûter d'anniversaire : tu as mangé tous les bonbons du gâteau, trois saucisses cocktail et une barbe à papa. Maintenant, on fait du tourniquet.",
      ],
      en: [
        "A friend's birthday party: bouncy castle, four slices of cake, two liters of soda and sour candy. You bounce.",
        "Birthday party: you ate all the candy off the cake, three cocktail sausages and a cotton candy. Now it's merry-go-round time.",
      ],
    },
    choices: [
      { label: { fr: 'Continuer', en: 'Keep going' }, text: { fr: "J'ai continué. J'ai vomi en plein vol, un arc-en-ciel parfait, sur huit enfants à la fois. On ne m'a plus jamais invité{|e}.", en: "I kept going. I threw up mid-air, a perfect rainbow arc, onto eight kids at once. I was never invited again." }, fx: { happy: 2, health: -3 }, mood: 'sick' },
      {
        label: { fr: 'Courir aux toilettes', en: 'Run for the bathroom' },
        out: [
          { w: 1, text: { fr: "J'ai couru aux toilettes. Je n'y suis pas arrivé{|e}. Le couloir des parents de mon copain s'en souvient encore.", en: "I ran for the bathroom. I didn't make it. My friend's parents' hallway still remembers." }, fx: { happy: -3, health: -2 } },
          { w: 1, text: { fr: "Je suis arrivé{|e} aux toilettes à temps. J'ai vomi proprement, puis je suis retourné{|e} manger du gâteau. Champion{|ne}.", en: "I made it to the toilet in time. I puked neatly, then went back for more cake. Champion." }, fx: { happy: 4, health: -1 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Dans le sac-cadeau', en: 'Into the goody bag' }, text: { fr: "J'ai vomi discrètement dans mon sac de bonbons. Le soir, mes parents l'ont ouvert pour voir ce que j'avais gagné.", en: "I discreetly threw up in my goody bag. That night, my parents opened it to see what I'd won." }, fx: { happy: 1, health: -2 } },
    ],
  },
  {
    id: 'bb_wall_poop',
    icon: '🎨',
    cat: 'baby',
    actor: 'parent',
    once: true,
    rating: 2,
    when: { age: [1, 3] },
    scene: { place: 'home', mood: 'shock', fx: 'poop' },
    text: {
      fr: [
        "Fin de la sieste. Personne n'est venu te chercher. Ta couche est pleine et tes mains sont libres. Le mur blanc à côté du lit t'inspire.",
        "Tu as réussi à enlever ta couche tout{|e} seul{|e}. À l'intérieur : de la peinture. Gratuite. Et le papier peint de la chambre est tout neuf.",
      ],
      en: [
        "Nap time's over. Nobody came to get you. Your diaper is full and your hands are free. The white wall next to the crib inspires you.",
        "You managed to take your diaper off all by yourself. Inside: paint. Free paint. And the nursery wallpaper is brand new.",
      ],
    },
    choices: [
      { label: { fr: 'Une fresque murale', en: 'Paint a mural' }, text: { fr: "J'ai peint une fresque monumentale sur le mur, les barreaux du lit et une partie du plafond. Quand {a.my} a ouvert la porte, l'odeur l'a fait reculer d'un mètre. Œuvre détruite à l'eau de Javel. Les vrais artistes sont toujours incompris.", en: "I painted a monumental mural across the wall, the crib bars and part of the ceiling. When {a.my} opened the door, the smell knocked them back three feet. Masterpiece destroyed with bleach. True artists are never understood." }, fx: { happy: 6, rel: -8, visual: 'poop' } },
      { label: { fr: 'Repeindre le doudou', en: 'Paint my teddy' }, text: { fr: "J'ai repeint mon doudou en marron. Il a fait trois machines à 90 degrés. Il n'a plus d'yeux, mais il est toujours là.", en: "I painted my teddy brown. It went through three hot washes. It has no eyes anymore, but it's still here." }, fx: { happy: 3, rel: -4 } },
      { label: { fr: "Appeler à l'aide", en: 'Call for help' }, text: { fr: "J'ai crié jusqu'à ce que quelqu'un arrive. On m'a félicité{|e} pour ma retenue artistique.", en: "I yelled until someone came. I was congratulated on my artistic restraint." }, fx: { rel: 5, discipline: 3 } },
    ],
  },
  {
    id: 'bb_car_vomit',
    icon: '🤢',
    cat: 'travel',
    actor: 'parent',
    cooldown: 3,
    rating: 2,
    when: { age: [1, 5] },
    scene: { place: 'home', mood: 'sick' },
    text: {
      fr: [
        "Route de montagne, 37 virages. Tu viens de manger un croissant et de boire un jus d'orange. Ton estomac commence à faire des vagues.",
        "Ça fait deux heures que tu es dans ton siège auto, et {a.rel} n'arrête pas de demander « ça va, derrière ? ». Non. Pas du tout.",
      ],
      en: [
        "Mountain road, 37 hairpin turns. You just had a croissant and an orange juice. Your stomach is starting to make waves.",
        "You've been in your car seat for two hours, and {a.rel} keeps asking “everything okay back there?” No. Not at all.",
      ],
    },
    choices: [
      {
        label: { fr: 'Prévenir', en: 'Warn them' },
        out: [
          { w: 1, text: { fr: "J'ai dit « j'ai mal au ventre ». On s'est arrêtés à temps sur le bas-côté. J'ai vomi sur une vache. Elle n'a rien dit.", en: "I said “my tummy hurts.” We pulled over just in time. I threw up on a cow. She didn't say anything." }, fx: { happy: 1, health: -1 } },
          { w: 1, text: { fr: "J'ai dit « j'ai mal au ventre » une seconde trop tard. Jet de croissant sur l'appui-tête de {a.my}, et un peu dans ses cheveux.", en: "I said “my tummy hurts” one second too late. Croissant spray all over {a.my}'s headrest, and a bit in their hair." }, fx: { health: -2, rel: -5 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Tout retenir', en: 'Hold it in' }, text: { fr: "J'ai tout retenu pendant 30 kilomètres, puis tout lâché d'un coup dans mon bonnet. La voiture sent l'orange aigre depuis trois ans.", en: "I held it in for twenty miles, then let it all out at once into my beanie. The car has smelled of sour orange for three years." }, fx: { health: -2, discipline: 3 } },
      { label: { fr: 'Viser la fenêtre', en: 'Aim for the window' }, text: { fr: "J'ai visé la fenêtre. Elle était fermée. Effet cascade sur la portière, et les vitres électriques ne marchent plus jamais.", en: "I aimed for the window. It was closed. Waterfall effect down the door, and the power windows never worked again." }, fx: { happy: -2, health: -2, rel: -3 } },
    ],
  },
  {
    id: 'bb_scraped_knee',
    icon: '🩹',
    cat: 'health',
    actor: 'parent',
    cooldown: 3,
    rating: 2,
    when: { age: [3, 7] },
    scene: { place: 'park', mood: 'cry' },
    text: {
      fr: [
        "Tu as glissé sur le gravier du parc. Ton genou ressemble à une pizza margherita, gravillons en garniture, et le sang coule jusque dans ta chaussette.",
        "Chute de trottinette. Tes deux paumes sont écorchées, ton genou pisse le sang et un petit caillou est incrusté dedans. Tu le regardes, fasciné{|e}.",
      ],
      en: [
        "You slipped on the park gravel. Your knee looks like a margherita pizza with gravel toppings, and blood is running down into your sock.",
        "Scooter wipeout. Both palms are scraped raw, your knee is gushing blood and there's a little pebble embedded in it. You stare at it, fascinated.",
      ],
    },
    choices: [
      { label: { fr: 'Hurler à la mort', en: 'Scream bloody murder' }, text: { fr: "J'ai hurlé si fort que tout le parc a cru à un enlèvement, et {a.my} a dû me porter jusqu'à la maison comme un soldat blessé.", en: "I screamed so loud the whole park thought it was a kidnapping, and {a.my} had to carry me home like a wounded soldier." }, fx: { happy: -3, health: -3, rel: 3 } },
      { label: { fr: 'Exiger douze pansements', en: 'Demand twelve band-aids' }, text: { fr: "J'ai exigé douze pansements à paillettes. Mon genou ressemblait à une momie. J'ai fait le tour de l'école pour le montrer.", en: "I demanded twelve glitter band-aids. My knee looked like a mummy. I toured the whole school showing it off." }, fx: { happy: 4, health: -2, fame: 1 }, mood: 'proud' },
      { label: { fr: 'Lécher la plaie', en: 'Lick the wound' }, text: { fr: "J'ai léché la plaie comme un chat. Goût de fer et de gravier, et {a.my} a failli tourner de l'œil.", en: "I licked the wound like a cat. Tasted of iron and gravel, and {a.my} nearly fainted." }, fx: { happy: 1, health: -3 } },
    ],
  },
];
