// Childhood events (ages 0–12): babyhood, preschool, primary school, family life, pets, first friends.
import type { EventDef } from '@bl/sim';

export const childhoodEvents: EventDef[] = [
  // ───────────────────────────── feed-only diary lines ─────────────────────────────
  {
    id: 'ch_auto_first_word',
    icon: '🗣️',
    cat: 'baby',
    auto: true,
    once: true,
    when: { age: [1, 2] },
    text: {
      fr: [
        "Mon premier mot a été « [[frigo|non|aspirateur|wifi]] ». Mes parents espéraient « maman » ou « papa ». Raté.",
        "J'ai prononcé mon premier mot : « [[frigo|non|aspirateur|wifi]] ». Toute la famille débat encore de sa signification profonde.",
      ],
      en: [
        "My first word was \"[[fridge|no|vacuum|wifi]]\". My parents were hoping for \"mama\" or \"dada\". Nope.",
        "I said my first word: \"[[fridge|no|vacuum|wifi]]\". The whole family is still debating its deeper meaning.",
      ],
    },
    fx: { happy: 3, smarts: 2 },
  },
  {
    id: 'ch_auto_first_steps',
    icon: '👣',
    cat: 'baby',
    auto: true,
    once: true,
    when: { age: [1, 2] },
    text: {
      fr: [
        "J'ai fait mes premiers pas ! Trois, exactement, avant d'atterrir dans le panier à linge.",
        "J'ai marché tout{|e} seul{|e} du canapé jusqu'à la table basse. Puis la table basse et moi avons eu une discussion frontale.",
      ],
      en: [
        "I took my first steps! Three, to be exact, before landing in the laundry basket.",
        "I walked all by myself from the couch to the coffee table. Then the coffee table and I had a head-on discussion.",
      ],
    },
    fx: { happy: 3, athletic: 2 },
  },
  {
    id: 'ch_auto_cardboard',
    icon: '📦',
    cat: 'baby',
    auto: true,
    once: true,
    when: { age: [1, 4] },
    text: {
      fr: [
        "On m'a offert un jouet très cher. J'ai joué pendant trois semaines avec le carton.",
        "J'ai reçu un garage en plastique avec ascenseur et sons réalistes. J'ai préféré le papier bulle.",
      ],
      en: [
        "I got a very expensive toy. I played with the box for three weeks.",
        "I got a plastic garage with a working lift and realistic sounds. I preferred the bubble wrap.",
      ],
    },
    fx: { happy: 4 },
  },
  {
    id: 'ch_auto_dinosaurs',
    icon: '🦕',
    cat: 'weird',
    auto: true,
    once: true,
    when: { age: [4, 8] },
    text: {
      fr: [
        "Je connais désormais le nom de 47 dinosaures. Personne ne me l'a demandé, mais je le dis à tout le monde.",
        "J'ai corrigé un adulte qui confondait tyrannosaure et allosaure. Il ne s'en est pas remis.",
      ],
      en: [
        "I now know the names of 47 dinosaurs. Nobody asked, but I tell everyone anyway.",
        "I corrected a grown-up who mixed up a T. rex and an allosaurus. He never recovered.",
      ],
    },
    fx: { smarts: 3 },
  },
  {
    id: 'ch_auto_monster',
    icon: '👻',
    cat: 'weird',
    auto: true,
    once: true,
    when: { age: [3, 7] },
    text: {
      fr: [
        "J'ai passé la nuit à surveiller le placard. Le monstre n'est pas sorti. Il est malin.",
        "J'ai exigé une veilleuse, deux doudous et une inspection complète sous le lit. Le monstre a dû déménager.",
      ],
      en: [
        "I spent the night watching the closet. The monster never came out. It's clever.",
        "I demanded a night light, two stuffed animals and a full under-the-bed inspection. The monster must have moved out.",
      ],
    },
    fx: { happy: -2, health: -1 },
  },
  {
    id: 'ch_auto_puddles',
    icon: '🌧️',
    cat: 'weird',
    auto: true,
    cooldown: 3,
    when: { age: [3, 9] },
    text: {
      fr: ["J'ai sauté dans toutes les flaques du trajet de l'école. Mes chaussettes sont devenues des éponges.", "Il a plu toute la journée. J'ai fait des courses de feuilles mortes dans le caniveau. Victoire de la feuille jaune.", "J'ai vu {w:animal} dans le jardin et je lui ai construit une maison en cailloux. Mon invité n'est pas resté. Quel ingrat.", "Il a neigé ! J'ai fait un bonhomme de neige et je l'ai appelé {w:nickname}. Il a fondu le lendemain. J'ai organisé des funérailles [[très émouvantes|avec des biscuits|en pyjama]].", "J'ai creusé un trou dans le jardin tout l'après-midi pour atteindre la Chine. J'ai trouvé {w:object}. C'est presque pareil."],
      en: ["I jumped in every puddle on the way to school. My socks are now sponges.", "It rained all day. I raced dead leaves down the gutter. The yellow leaf won.", "I saw {w:animal} in the yard and built it a house out of pebbles. My guest didn't stay. How rude.", "It snowed! I built a snowman and named him {w:nickname}. He melted the next day. I held a [[very moving|cookie-catered|pajama]] funeral.", "I dug a hole in the yard all afternoon to reach China. I found {w:object}. Close enough."],
    },
    fx: { happy: 3, health: -1 },
  },

  // ───────────────────────────── babyhood & toddler ─────────────────────────────
  {
    id: 'ch_baby_night',
    icon: '🍼',
    cat: 'baby',
    actor: 'parent',
    cooldown: 2,
    when: { age: [1, 2] },
    scene: { place: 'home', mood: 'sleepy', prop: 'crib' },
    text: {
      fr: [
        "Il est 3 h du matin. Tout le monde dort. Tu sens monter en toi une envie irrépressible de t'exprimer.",
        "La maison est silencieuse. Beaucoup trop silencieuse à ton goût, et {a.rel} ronfle dans la pièce d'à côté.",
      ],
      en: [
        "It's 3 a.m. Everyone is asleep. You feel an irresistible urge to express yourself.",
        "The house is quiet. Far too quiet for your taste, and {a.rel} is snoring in the next room.",
      ],
    },
    choices: [
      {
        label: { fr: 'Hurler à pleins poumons', en: 'Scream my lungs out' },
        out: [
          { w: 3, text: { fr: "J'ai hurlé jusqu'à ce que {a:mon père|ma mère} débarque en pyjama, les yeux à moitié fermés. Mission accomplie.", en: "I screamed until {a:my dad|my mom} stumbled in wearing pajamas, eyes half shut. Mission accomplished." }, fx: { happy: 4, rel: -3 } },
          { w: 1, text: { fr: "J'ai hurlé si fort que les voisins ont tapé au mur. J'ai pris ça pour des applaudissements.", en: "I screamed so loudly the neighbors banged on the wall. I took it as applause." }, fx: { happy: 2, rel: -6 } },
        ],
      },
      { label: { fr: 'Babiller gaiement', en: 'Babble cheerfully' }, text: { fr: "J'ai raconté ma journée au plafond pendant une heure. Il a très bien écouté.", en: "I told the ceiling about my day for an hour. It was a great listener." }, fx: { happy: 3, smarts: 1 } },
      { label: { fr: 'Se rendormir', en: 'Go back to sleep' }, text: { fr: "Je me suis rendormi{|e} comme un ange, au grand étonnement de {a:mon père|ma mère}.", en: "I fell back asleep like an angel, to the amazement of {a:my dad|my mom}." }, fx: { rel: 6, health: 2 } },
    ],
  },
  {
    id: 'ch_food_throw',
    icon: '🥦',
    cat: 'baby',
    actor: 'parent',
    cooldown: 2,
    when: { age: [1, 3] },
    scene: { place: 'home', mood: 'angry', prop: 'spoon' },
    text: {
      fr: [
        "{a.rel} approche une cuillère de purée de brocolis en faisant l'avion. L'avion est vert. L'avion sent bizarre.",
        "C'est l'heure du repas : une compote d'un beige inquiétant t'attend, et {a.rel} sourit beaucoup trop.",
      ],
      en: [
        "{a.rel} brings a spoonful of broccoli mash towards you, making airplane noises. The airplane is green. The airplane smells weird.",
        "Mealtime: an alarmingly beige purée awaits you, and {a.rel} is smiling way too much.",
      ],
    },
    choices: [
      { label: { fr: 'Ouvrir grand', en: 'Open wide' }, text: { fr: "J'ai tout mangé sans broncher. On m'a applaudi{|e} comme si j'avais eu le bac.", en: "I ate everything without a fuss. I got a standing ovation like I'd graduated." }, fx: { health: 3, rel: 4 } },
      {
        label: { fr: 'Tout jeter par terre', en: 'Throw it on the floor' },
        out: [
          { w: 2, text: { fr: "J'ai lancé ma purée par terre avec une précision remarquable. Personne n'a applaudi.", en: "I hurled my purée onto the floor with remarkable precision. Nobody clapped." }, fx: { happy: 3, rel: -4 } },
          { w: 1, text: { fr: "J'ai repeint la cuisine en vert. Une œuvre engagée, incomprise de son vivant.", en: "I repainted the kitchen green. A bold statement piece, misunderstood in its time." }, fx: { happy: 5, rel: -8 } },
        ],
      },
      { label: { fr: 'Serrer les lèvres', en: 'Clamp my mouth shut' }, text: { fr: "J'ai gardé la bouche fermée pendant 40 minutes. Le brocoli et moi, c'est fini.", en: "I kept my mouth shut for 40 minutes. Broccoli and I are over." }, fx: { happy: 2, discipline: 2, rel: -2 } },
    ],
  },
  {
    id: 'ch_wall_drawing',
    icon: '🖍️',
    cat: 'family',
    actor: 'parent',
    once: true,
    when: { age: [2, 5] },
    scene: { place: 'home', mood: 'proud', prop: 'marker' },
    text: {
      fr: [
        "Tu as trouvé un feutre indélébile oublié sur la table. Le mur blanc du salon te regarde. Il a l'air de s'ennuyer, ce mur.",
        "Un feutre ! Et juste à côté, un mur tout propre que {a.rel} vient de repeindre. Le destin a parlé.",
      ],
      en: [
        "You found a permanent marker left on the table. The white living-room wall stares at you. That wall looks bored.",
        "A marker! And right next to it, a spotless wall {a.rel} just repainted. Destiny has spoken.",
      ],
    },
    choices: [
      {
        label: { fr: 'Peindre une fresque', en: 'Paint a mural' },
        out: [
          { w: 2, text: { fr: "J'ai dessiné une fresque géante de la famille. Tout le monde a douze doigts, mais on m'a dit que c'était « très expressif ».", en: "I drew a giant family mural. Everyone has twelve fingers, but I was told it was \"very expressive\"." }, fx: { happy: 6, rel: -3, flag: 'little_artist' }, mood: 'proud' },
          { w: 2, text: { fr: "J'ai couvert le mur de gribouillis. Le repeindre a coûté un week-end entier et beaucoup de patience parentale.", en: "I covered the wall in scribbles. Repainting it cost a whole weekend and a lot of parental patience." }, fx: { happy: 4, rel: -8 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Dessiner sur une feuille', en: 'Use paper instead' }, text: { fr: "J'ai sagement dessiné sur une feuille : un soleil avec des lunettes de soleil. Il trône désormais sur le frigo.", en: "I drew nicely on paper: a sun wearing sunglasses. It now rules from the fridge door." }, fx: { happy: 3, rel: 5, flag: 'little_artist' } },
      { label: { fr: 'Accuser la fratrie', en: 'Blame my siblings' }, if: { has: 'sibling' }, text: { fr: "J'ai gribouillé le mur puis accusé le reste de la fratrie. Personne n'y a cru : j'avais du feutre jusqu'aux oreilles.", en: "I scribbled on the wall and blamed my siblings. Nobody bought it: I had marker up to my ears." }, fx: { karma: -4, rel: -4 } },
    ],
  },
  {
    id: 'ch_imaginary_friend',
    icon: '🫥',
    cat: 'weird',
    once: true,
    when: { age: [3, 6] },
    scene: { place: 'home', mood: 'happy' },
    text: {
      fr: [
        "Tu as un nouvel ami : [[Monsieur Biscotte|Gérard le dragon|Capitaine Chaussette]]. Il est invisible, mais il a beaucoup d'opinions.",
        "Depuis quelques jours, tu mets un couvert de plus à table pour [[Monsieur Biscotte|Gérard le dragon|Capitaine Chaussette]], ton ami invisible. Il ne mange jamais ses légumes non plus.",
      ],
      en: [
        "You have a new friend: [[Mister Biscuit|Gerald the Dragon|Captain Sock]]. He's invisible, but he has a lot of opinions.",
        "For a few days now, you've been setting an extra place at the table for [[Mister Biscuit|Gerald the Dragon|Captain Sock]], your invisible friend. He never eats his vegetables either.",
      ],
    },
    choices: [
      { label: { fr: 'Le garder pour toujours', en: 'Keep him forever' }, text: { fr: "Mon ami imaginaire et moi sommes inséparables. Il me laisse toujours gagner aux cartes.", en: "My imaginary friend and I are inseparable. He always lets me win at cards." }, fx: { happy: 6, flag: 'imaginary_friend', schedule: { key: 'ch_imaginary_return', years: 4 } } },
      {
        label: { fr: 'Le présenter aux parents', en: 'Introduce him to my parents' },
        out: [
          { w: 2, text: { fr: "J'ai présenté mon ami imaginaire à mes parents. Ils lui ont serré la main avec le plus grand sérieux.", en: "I introduced my imaginary friend to my parents. They shook his hand with the utmost seriousness." }, fx: { happy: 4, flag: 'imaginary_friend', schedule: { key: 'ch_imaginary_return', years: 4 } } },
          { w: 1, text: { fr: "Mes parents ont pris rendez-vous chez un psy. Le psy a trouvé mon ami imaginaire très sympathique.", en: "My parents booked a therapist. The therapist found my imaginary friend very likeable." }, fx: { happy: 2, smarts: 2 } },
        ],
      },
      { label: { fr: 'Lui dire adieu', en: 'Say goodbye' }, text: { fr: "J'ai dit adieu à mon ami imaginaire. Il est parti vivre dans une ferme imaginaire, très loin, avec plein d'espace pour courir.", en: "I said goodbye to my imaginary friend. He went to live on an imaginary farm, far away, with lots of room to run." }, fx: { happy: -3, discipline: 3 }, mood: 'sad' },
    ],
  },
  {
    id: 'ch_imaginary_return',
    icon: '🥸',
    cat: 'weird',
    chainOnly: true,
    when: { age: [6, 12], flag: 'imaginary_friend' },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Ton vieil ami imaginaire est de retour. Il porte une moustache, a un crédit immobilier et veut « parler de votre relation ».",
        "Surprise : ton ami imaginaire refait surface. Il dit avoir fait le tour de l'Amérique du Sud et ne s'est visiblement pas rasé depuis.",
      ],
      en: [
        "Your old imaginary friend is back. He has a mustache, a mortgage, and wants to \"talk about your relationship\".",
        "Surprise: your imaginary friend has resurfaced. He claims he backpacked across South America and clearly hasn't shaved since.",
      ],
    },
    choices: [
      { label: { fr: 'Lui faire un câlin', en: 'Give him a hug' }, text: { fr: "J'ai retrouvé mon ami imaginaire. On a joué aux cartes toute la soirée. Il triche toujours.", en: "I reunited with my imaginary friend. We played cards all evening. He still cheats." }, fx: { happy: 6 } },
      { label: { fr: "Dire que j'ai grandi", en: "Say I've grown up" }, text: { fr: "J'ai expliqué à mon ami imaginaire que j'étais grand{|e} maintenant. Il l'a pris avec dignité, puis il a claqué une porte imaginaire.", en: "I explained to my imaginary friend that I'm a big kid now. He took it with dignity, then slammed an imaginary door." }, fx: { smarts: 3, happy: -2, unflag: 'imaginary_friend' } },
      { label: { fr: 'Lui refiler mes devoirs', en: 'Make him do my homework' }, text: { fr: "Mon ami imaginaire a fait mes devoirs. J'ai eu zéro : la maîtresse n'a vu qu'une feuille blanche.", en: "My imaginary friend did my homework. I got a zero: the teacher only saw a blank sheet." }, fx: { happy: 2, smarts: -2, grade: -5 } },
    ],
  },
  {
    id: 'ch_supermarket_lost',
    icon: '🛒',
    cat: 'family',
    actor: 'parent',
    once: true,
    when: { age: [3, 6] },
    scene: { place: 'park', mood: 'cry', prop: 'cart' },
    text: {
      fr: [
        "Tu t'es retourné{|e} deux secondes devant les céréales et {a.rel} a disparu. Le supermarché est soudain immense.",
        "Perdu{|e} entre les surgelés et les couches, tu réalises que la main que tu tiens n'est pas du tout celle de {a.rel}.",
      ],
      en: [
        "You turned around for two seconds in front of the cereal and {a.rel} vanished. The supermarket suddenly feels enormous.",
        "Lost between the frozen aisle and the diapers, you realise the hand you're holding is not {a.rel}'s at all.",
      ],
    },
    choices: [
      { label: { fr: 'Pleurer au rayon fromages', en: 'Wail in the cheese aisle' }, text: { fr: "J'ai pleuré si fort au rayon fromages qu'un employé m'a offert un mini-fromage pour me calmer. Puis on m'a retrouvé{|e}.", en: "I cried so loudly in the cheese aisle that a staff member gave me a cheese stick to calm me down. Then I was found." }, fx: { happy: -3 }, mood: 'cry' },
      { label: { fr: "Aller à l'accueil", en: 'Go to the help desk' }, text: { fr: "Je suis allé{|e} à l'accueil. On a appelé {a:mon père|ma mère} au micro devant tout le magasin. Grand moment de solitude pour {a:lui|elle}.", en: "I went to the help desk. They paged {a:my dad|my mom} over the loudspeaker in front of the whole store. A proud moment for {a:him|her}." }, fx: { smarts: 3, discipline: 2 } },
      {
        label: { fr: 'Explorer le rayon jouets', en: 'Explore the toy aisle' },
        out: [
          { w: 2, text: { fr: "J'ai profité de ma liberté au rayon jouets. On m'a retrouvé{|e} une heure plus tard, déguisé{|e} en pirate.", en: "I made the most of my freedom in the toy aisle. They found me an hour later, dressed as a pirate." }, fx: { happy: 8, rel: -5 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai ouvert trois boîtes de jouets avant qu'on me retrouve. {a:Mon père a|Ma mère a} dû tout payer, en silence.", en: "I opened three toy boxes before anyone found me. {a:My dad|My mom} had to pay for all of them, in silence." }, fx: { happy: 6, rel: -8 } },
        ],
      },
      { label: { fr: 'Suivre un manteau familier', en: 'Follow a familiar coat' }, text: { fr: "J'ai suivi quelqu'un qui portait le même manteau que {a:mon père|ma mère}. C'était un vigile. Il m'a ramené{|e} à l'accueil, très gentiment.", en: "I followed someone wearing the same coat as {a:my dad|my mom}. It was a security guard. He very kindly walked me back to the front desk." }, fx: { happy: -2, smarts: -1 } },
    ],
  },

  // ───────────────────────────── preschool & friends ─────────────────────────────
  {
    id: 'ch_preschool_toy',
    icon: '🚒',
    cat: 'friends',
    cooldown: 3,
    when: { age: [2, 6], school: 'preschool' },
    actor: { create: { role: 'classmate', age: [-1, 1], gender: 'any' } },
    scene: { place: 'school', mood: 'angry', prop: 'toy' },
    text: {
      fr: [
        "{a.first} vient de t'arracher des mains le camion de pompiers. TON camion de pompiers. Celui que tu avais vu en premier.",
        "À la récré, {a.first} s'est emparé{a:|e} de la seule pelle du bac à sable. L'injustice est totale.",
      ],
      en: [
        "{a.first} just snatched the fire truck out of your hands. YOUR fire truck. The one you saw first.",
        "At recess, {a.first} grabbed the only shovel in the sandbox. The injustice is absolute.",
      ],
    },
    choices: [
      { label: { fr: 'Mordre', en: 'Bite' }, text: { fr: "J'ai mordu {a.first}. J'ai récupéré le jouet, puis passé l'après-midi au coin à réfléchir à mes actes. Je ne regrette rien.", en: "I bit {a.first}. I got the toy back, then spent the afternoon in the corner thinking about my actions. No regrets." }, fx: { happy: 2, karma: -4, discipline: -2, actorRole: 'enemy' } },
      {
        label: { fr: 'Proposer de partager', en: 'Offer to share' },
        out: [
          { w: 2, text: { fr: "J'ai proposé de partager. {a.first} a accepté et on a joué ensemble jusqu'au goûter.", en: "I offered to share. {a.first} agreed and we played together until snack time." }, fx: { happy: 5, karma: 3, rel: 15, actorRole: 'friend' }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai proposé de partager. {a.first} m'a tiré la langue et est parti{a:|e} avec le jouet.", en: "I offered to share. {a.first} stuck their tongue out and walked off with the toy." }, fx: { happy: -3, karma: 2 } },
        ],
      },
      { label: { fr: 'Prévenir la maîtresse', en: 'Tell the teacher' }, text: { fr: "J'ai tout raconté à la maîtresse. Justice a été rendue, avec un tampon « bravo » sur la main.", en: "I told the teacher everything. Justice was served, along with a gold star stamp on my hand." }, fx: { discipline: 3, happy: 2 } },
    ],
  },
  {
    id: 'ch_first_friend',
    icon: '🥐',
    cat: 'friends',
    once: true,
    when: { age: [3, 8], school: ['preschool', 'primary'] },
    actor: { create: { role: 'classmate', age: [-1, 1], gender: 'any' } },
    scene: { place: 'school', mood: 'happy', prop: 'snack' },
    text: {
      fr: [
        "{a.first}, assis{a:|e} à côté de toi, te tend la moitié de son pain au chocolat sans un mot. Ou de sa chocolatine. Le débat attendra : c'est un geste fort.",
        "À la cantine, {a.first} t'annonce que vous êtes désormais « amis pour la vie ». Tu n'as pas été consulté{|e}.",
      ],
      en: [
        "{a.first}, sitting next to you, silently hands you half of their chocolate croissant. This is a serious gesture.",
        "In the cafeteria, {a.first} announces that you two are now \"friends for life\". You were not consulted.",
      ],
    },
    choices: [
      { label: { fr: 'Accepter avec joie', en: 'Accept gladly' }, text: { fr: "J'ai accepté le goûter et l'amitié de {a.first}. Pacte scellé avec les doigts pleins de chocolat.", en: "I accepted {a.first}'s snack and friendship. Pact sealed with chocolatey fingers." }, fx: { happy: 8, rel: 20, actorRole: 'friend' }, mood: 'happy' },
      { label: { fr: 'Offrir ma compote', en: 'Offer my applesauce' }, text: { fr: "J'ai offert ma compote à {a.first} en échange. Le début d'un grand partenariat commercial.", en: "I gave {a.first} my applesauce in return. The start of a great trade partnership." }, fx: { happy: 6, karma: 2, rel: 15, actorRole: 'friend' } },
      { label: { fr: 'Refuser poliment', en: 'Politely decline' }, text: { fr: "J'ai poliment refusé. Je préfère choisir mes amis moi-même, merci.", en: "I politely declined. I prefer to pick my own friends, thank you." }, fx: { happy: -1, discipline: 1 } },
    ],
  },

  // ───────────────────────────── primary school ─────────────────────────────
  {
    id: 'ch_bully',
    icon: '😤',
    cat: 'school',
    cooldown: 4,
    when: { age: [6, 12], school: 'primary', noFlag: 'bully_victim' },
    actor: { create: { role: 'classmate', age: [1, 2], gender: 'any' } },
    vars: { amount: [2, 10] },
    scene: { place: 'school', mood: 'angry' },
    text: {
      fr: [
        "{a.first}, un{a:|e} grand{a:|e} de la classe du dessus, te bloque le passage dans la cour et exige {$amount} pour « la taxe de récré ».",
        "À la sortie des toilettes, {a.first} t'attend, bras croisés. Tarif du jour pour passer : {$amount}.",
      ],
      en: [
        "{a.first}, a big kid from the grade above, blocks your way in the playground and demands {$amount} as a \"recess tax\".",
        "Outside the bathroom, {a.first} is waiting, arms crossed. Today's toll: {$amount}.",
      ],
    },
    choices: [
      { label: { fr: 'Payer', en: 'Pay up' }, text: { fr: "J'ai payé {$amount} à {a.first}. Ma tirelire pleure, et moi un peu aussi.", en: "I paid {a.first} {$amount}. My piggy bank is crying, and so am I, a little." }, fx: { money: '-amount', happy: -5, flag: 'bully_victim', actorRole: 'enemy' }, mood: 'sad' },
      {
        label: { fr: 'Se battre', en: 'Fight back' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai foncé sur {a.first}, qui a trébuché dans le bac à sable devant toute l'école. Depuis, on me respecte.", en: "I charged at {a.first}, who tripped into the sandbox in front of the whole school. People respect me now." }, fx: { happy: 8, athletic: 3, flag: 'stood_up_bully', actorRole: 'enemy' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai voulu me battre. Je me suis retrouvé{|e} la tête dans la poubelle à papiers. Recyclé{|e}.", en: "I tried to fight. I ended up head-first in the paper bin. Recycled." }, fx: { happy: -8, health: -3, flag: 'bully_victim', actorRole: 'enemy' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Prévenir la maîtresse', en: 'Tell the teacher' }, text: { fr: "J'ai prévenu la maîtresse. {a.first} a été puni{a:|e} et m'a promis une revanche « épique ».", en: "I told the teacher. {a.first} got detention and promised me an \"epic\" revenge." }, fx: { discipline: 2, happy: 2, actorRole: 'enemy' } },
      {
        label: { fr: 'Faire une blague', en: 'Crack a joke' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai sorti une blague si drôle que {a.first} a éclaté de rire et m'a laissé{|e} passer. L'humour, arme absolue.", en: "I told a joke so funny that {a.first} burst out laughing and let me through. Humor: the ultimate weapon." }, fx: { happy: 6, smarts: 2 } },
          { w: 1, text: { fr: "Ma blague est tombée à plat. J'ai payé {$amount}, plus des intérêts moraux.", en: "My joke fell flat. I paid {$amount}, plus emotional interest." }, fx: { money: '-amount', happy: -6, flag: 'bully_victim', actorRole: 'enemy' } },
        ],
      },
    ],
  },
  {
    id: 'ch_bully_again',
    icon: '📒',
    cat: 'school',
    once: true,
    when: { age: [7, 12], flag: 'bully_victim' },
    actor: 'enemy',
    vars: { amount: [5, 20] },
    scene: { place: 'school', mood: 'angry' },
    text: {
      fr: [
        "{a.first} est de retour. Inflation oblige, la taxe de récré passe à {$amount}.",
        "{a.first} t'attend devant le portail avec un petit carnet. Apparemment, tu as {$amount} d'arriérés.",
      ],
      en: [
        "{a.first} is back. Due to inflation, the recess tax is now {$amount}.",
        "{a.first} is waiting by the gate with a little notebook. Apparently you owe {$amount} in arrears.",
      ],
    },
    choices: [
      { label: { fr: 'Payer, encore', en: 'Pay, again' }, text: { fr: "J'ai encore payé {a.first}. La prochaine fois, je demande un reçu.", en: "I paid {a.first} again. Next time I'm asking for a receipt." }, fx: { money: '-amount', happy: -6 }, mood: 'sad' },
      {
        label: { fr: 'Prendre des cours de karaté', en: 'Take karate lessons' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai pris des cours de karaté en secret. À la récré suivante, une seule posture a suffi : {a.first} ne m'approche plus.", en: "I took karate lessons in secret. At the next recess, one stance was enough: {a.first} keeps their distance now." }, fx: { athletic: 6, happy: 8, unflag: 'bully_victim', flag: 'stood_up_bully' }, mood: 'proud' },
          { w: 1, text: { fr: "Après trois cours de karaté, j'ai défié {a.first}. Je me suis froissé un muscle en saluant.", en: "After three karate lessons, I challenged {a.first}. I pulled a muscle while bowing." }, fx: { athletic: 2, health: -3, happy: -3 } },
        ],
      },
      { label: { fr: 'Former une alliance', en: 'Form an alliance' }, text: { fr: "J'ai réuni tous les petits de la cour. Face à quinze élèves de CP très en colère, {a.first} a renoncé.", en: "I rallied all the little kids in the playground. Faced with fifteen very angry first-graders, {a.first} gave up." }, fx: { karma: 4, happy: 8, unflag: 'bully_victim', flag: 'stood_up_bully' }, mood: 'party' },
      {
        label: { fr: 'Proposer un partenariat', en: 'Pitch a business deal' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai proposé à {a.first} de devenir son comptable. Nous sommes désormais associés. Je touche 10 %.", en: "I offered to be {a.first}'s accountant. We're business partners now. I get 10%." }, fx: { smarts: 4, karma: -3, unflag: 'bully_victim', actorRole: 'friend' } },
          { w: 1, text: { fr: "{a.first} n'a pas compris le mot « partenariat ». J'ai payé {$amount} quand même.", en: "{a.first} didn't understand the word \"partnership\". I paid {$amount} anyway." }, fx: { money: '-amount', happy: -4 } },
        ],
      },
    ],
  },
  {
    id: 'ch_report_card',
    icon: '📝',
    cat: 'school',
    actor: 'parent',
    cooldown: 2,
    when: { age: [6, 12], school: 'primary' },
    scene: { place: 'home', mood: 'neutral', prop: 'report' },
    text: {
      fr: [
        "Le bulletin scolaire est arrivé et {a.rel} l'ouvre lentement, comme une lettre des impôts.",
        "Fin du trimestre : ton bulletin dort dans ton cartable. Il pèse étonnamment lourd, et {a.rel} te demande déjà s'il est arrivé.",
      ],
      en: [
        "Your report card has arrived and {a.rel} opens it slowly, like a letter from the tax office.",
        "End of term: your report card sits in your schoolbag. It feels surprisingly heavy, and {a.rel} is already asking about it.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le montrer fièrement', en: 'Show it proudly' },
        out: [
          { w: 1, odds: { smarts: 1.5 }, text: { fr: "Bulletin excellent ! Il est affiché sur le frigo, entre la liste de courses et un aimant de Barcelone.", en: "Excellent report card! It's on the fridge, between the shopping list and a magnet from Barcelona." }, fx: { happy: 6, rel: 5 }, mood: 'proud' },
          { w: 1, text: { fr: "« Peut mieux faire » dans toutes les matières, même en récréation. On m'a confisqué la console.", en: "\"Could do better\" in every subject, even recess. My console was confiscated." }, fx: { happy: -5, rel: -3 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Imiter la signature', en: 'Forge the signature' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai imité la signature de {a:mon père|ma mère}. Un travail d'orfèvre. Personne n'a rien remarqué.", en: "I forged {a:my dad|my mom}'s signature. A work of art. Nobody noticed a thing." }, fx: { happy: 4, karma: -4 } },
          { w: 1, text: { fr: "J'ai imité la signature de {a:mon père|ma mère}. On aurait dit un gribouillis de poule. Convoqué{|e} chez le directeur.", en: "I forged {a:my dad|my mom}'s signature. It looked like a chicken had scribbled it. Sent to the principal's office." }, fx: { happy: -6, discipline: -2, karma: -3, rel: -6 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Le cacher au congélateur', en: 'Hide it in the freezer' }, text: { fr: "J'ai caché mon bulletin au congélateur, sous les petits pois. On l'a retrouvé en juin, congelé et toujours aussi décevant.", en: "I hid my report card in the freezer, under the peas. It was found in June, frozen and still just as disappointing." }, fx: { happy: -2, rel: -4 } },
      { label: { fr: 'Promettre de bosser', en: 'Promise to work harder' }, text: { fr: "J'ai juré de travailler plus. J'ai tenu une semaine et demie. Un record personnel.", en: "I swore to work harder. I lasted a week and a half. A personal best." }, fx: { grade: 5, discipline: 2, rel: 2 } },
    ],
  },
  {
    id: 'ch_school_play',
    icon: '🎭',
    cat: 'school',
    once: true,
    when: { age: [5, 11], school: 'primary' },
    scene: { place: 'school', mood: 'proud', prop: 'stage' },
    text: {
      fr: [
        "Spectacle de fin d'année : tu as décroché le rôle de [[l'arbre n°3|la carotte qui parle|le nuage triste]]. Toute la famille sera là, téléphone levé.",
        "La maîtresse te confie un rôle dans la pièce de l'école : [[l'arbre n°3|la carotte qui parle|le nuage triste]]. Une seule réplique. Elle doit être parfaite.",
      ],
      en: [
        "End-of-year show: you landed the role of [[Tree #3|the Talking Carrot|the Sad Cloud]]. The whole family will be there, phones up.",
        "The teacher gives you a part in the school play: [[Tree #3|the Talking Carrot|the Sad Cloud]]. One line. It has to be perfect.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout donner', en: 'Give it everything' },
        out: [
          { w: 1, text: { fr: "J'ai joué mon rôle avec une intensité dramatique bouleversante. Une grand-mère du deuxième rang a pleuré.", en: "I played my part with heartbreaking dramatic intensity. A grandma in the second row cried." }, fx: { happy: 8, looks: 2, revealTalent: true }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai tellement tout donné que j'ai renversé le décor. Ovation debout, mais surtout pour le concierge qui a tout rattrapé.", en: "I gave it so much that I knocked over the set. Standing ovation, mostly for the janitor who caught it." }, fx: { happy: 2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Improviser', en: 'Improvise' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai improvisé un monologue de six minutes. La pièce n'avait plus aucun sens, mais toute la salle a ri.", en: "I improvised a six-minute monologue. The play no longer made any sense, but the whole audience laughed." }, fx: { happy: 6, smarts: 3 }, mood: 'party' },
          { w: 1, text: { fr: "J'ai improvisé et j'ai oublié de m'arrêter. On a dû baisser le rideau sur moi.", en: "I improvised and forgot to stop. They had to lower the curtain on me." }, fx: { happy: -3 } },
        ],
      },
      { label: { fr: 'Faire coucou au public', en: 'Wave at the audience' }, text: { fr: "J'ai passé tout le spectacle à faire coucou à ma famille. Ma réplique ? Quelle réplique ?", en: "I spent the entire show waving at my family. My line? What line?" }, fx: { happy: 5, discipline: -1 } },
      { label: { fr: 'Paniquer en silence', en: 'Freeze up' }, text: { fr: "Le trac m'a paralysé{|e}. Je suis resté{|e} immobile tout le spectacle, ce qui, au fond, collait assez bien au texte.", en: "Stage fright froze me solid. I stood still for the whole show, which, honestly, fit the script pretty well." }, fx: { happy: -3, discipline: 2 }, mood: 'shock' },
    ],
  },
  {
    id: 'ch_art_contest',
    icon: '🎨',
    cat: 'school',
    once: true,
    when: { age: [6, 11], school: 'primary', flag: 'little_artist' },
    scene: { place: 'school', mood: 'proud', prop: 'easel' },
    text: {
      fr: [
        "{school} organise un concours de dessin sur le thème « Mon héros ». Tes années de fresques murales vont enfin servir.",
        "La maîtresse annonce un concours de dessin. Tu sens le talent bouillonner dans ta trousse depuis ta toute première œuvre.",
      ],
      en: [
        "{school} is holding a drawing contest on the theme \"My hero\". Your years of wall murals are finally paying off.",
        "The teacher announces a drawing contest. You've felt talent bubbling in your pencil case ever since your very first masterpiece.",
      ],
    },
    choices: [
      {
        label: { fr: 'Dessiner un super-héros', en: 'Draw a superhero' },
        out: [
          { w: 2, text: { fr: "J'ai dessiné un super-héros très musclé. Deuxième place, derrière un dessin de chaton. Le jury était acheté.", en: "I drew a very muscular superhero. Second place, behind a kitten drawing. The jury was bought." }, fx: { happy: 4 } },
          { w: 1, text: { fr: "J'ai gagné le concours ! Mon dessin est affiché dans le hall. Je signe déjà des autographes imaginaires.", en: "I won the contest! My drawing hangs in the main hall. I'm already signing imaginary autographs." }, fx: { happy: 10, revealTalent: true }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Dessiner ma famille', en: 'Draw my family' }, text: { fr: "J'ai dessiné ma famille. Ma grand-mère a pleuré, mon père a demandé pourquoi il était vert.", en: "I drew my family. Grandma cried, Dad asked why he was green." }, fx: { happy: 5, karma: 2 } },
      {
        label: { fr: "Tenter l'art abstrait", en: 'Go abstract' },
        out: [
          { w: 1, text: { fr: "J'ai rendu une feuille avec un seul point noir au milieu. Le jury a parlé de « génie précoce ».", en: "I handed in a sheet with a single black dot in the middle. The jury called it \"precocious genius\"." }, fx: { happy: 8, smarts: 3, revealTalent: true }, mood: 'proud' },
          { w: 2, text: { fr: "J'ai rendu une feuille presque blanche. La maîtresse a cru que j'avais oublié de dessiner.", en: "I handed in an almost blank sheet. The teacher thought I'd forgotten to draw." }, fx: { happy: -3 } },
        ],
      },
    ],
  },

  // ───────────────────────────── family life ─────────────────────────────
  {
    id: 'ch_lost_tooth',
    icon: '🦷',
    cat: 'family',
    once: true,
    when: { age: [5, 8] },
    vars: { amount: [1, 5] },
    scene: { place: 'home', mood: 'happy', prop: 'tooth' },
    text: {
      fr: [
        "Ta première dent de lait vient de tomber dans ta tartine. Tu as désormais un trou très stylé.",
        "En croquant dans une pomme, tu as senti un petit « clic ». Ta première dent est tombée !",
      ],
      en: [
        "Your first baby tooth just fell into your toast. You now have a very stylish gap.",
        "Biting into an apple, you felt a little \"click\". Your first tooth fell out!",
      ],
    },
    choices: [
      {
        label: { fr: "Sous l'oreiller", en: 'Under the pillow' },
        out: [
          { w: 3, text: { fr: "La petite souris est passée : {$amount} sous mon oreiller. Je me demande ce qu'elle fait de toutes ces dents.", en: "The Tooth Fairy came: {$amount} under my pillow. I wonder what she does with all those teeth." }, fx: { money: 'amount', happy: 6 }, mood: 'happy' },
          { w: 1, text: { fr: "La petite souris n'est jamais passée. On m'a expliqué qu'elle était « en grève ». Je trouve ça louche.", en: "The Tooth Fairy never showed up. I was told she was \"on strike\". Sounds fishy to me." }, fx: { happy: -4, flag: 'magic_skeptic' }, mood: 'sad' },
        ],
      },
      { label: { fr: 'La garder en souvenir', en: 'Keep it as a souvenir' }, text: { fr: "J'ai gardé ma dent dans une boîte d'allumettes. Je la montre à tous les invités. Tous les invités sont gênés.", en: "I kept my tooth in a matchbox. I show it to every guest. Every guest is uncomfortable." }, fx: { happy: 3 } },
      { label: { fr: 'La vendre dans la cour', en: 'Sell it at recess' }, text: { fr: "J'ai vendu ma dent {$amount} à un camarade qui comptait arnaquer la petite souris. Les affaires sont les affaires.", en: "I sold my tooth for {$amount} to a classmate planning to scam the Tooth Fairy. Business is business." }, fx: { money: 'amount', karma: -2, smarts: 1 } },
    ],
  },
  {
    id: 'ch_santa_letter',
    icon: '🎅',
    cat: 'family',
    actor: 'parent',
    once: true,
    when: { age: [3, 6] },
    scene: { place: 'home', mood: 'happy', prop: 'letter' },
    text: {
      fr: [
        "C'est bientôt Noël ! Tu dictes ta lettre au Père Noël à {a.rel}, qui écrit en soupirant.",
        "Le grand moment de l'année est arrivé : la lettre au Père Noël. Tu dictes, et {a.rel} tient le stylo, l'air inquiet.",
      ],
      en: [
        "Christmas is coming! You dictate your letter to Santa to {a.rel}, who writes it down with a sigh.",
        "The big moment of the year has arrived: the letter to Santa. You dictate, and {a.rel} holds the pen, looking worried.",
      ],
    },
    choices: [
      { label: { fr: 'Exiger un poney', en: 'Demand a pony' }, text: { fr: "J'ai demandé un poney. J'ai reçu un poney en peluche. Les adultes appellent ça « gérer les attentes ».", en: "I asked for a pony. I got a stuffed pony. Grown-ups call this \"managing expectations\"." }, fx: { happy: 3, schedule: { key: 'ch_santa_reveal', years: 3 } } },
      { label: { fr: 'Une liste raisonnable', en: 'A reasonable list' }, text: { fr: "J'ai demandé des feutres et un livre. Le Père Noël a été si ému qu'il a ajouté un vélo.", en: "I asked for markers and a book. Santa was so moved that he threw in a bike." }, fx: { happy: 8, karma: 3, schedule: { key: 'ch_santa_reveal', years: 3 } }, mood: 'happy' },
      {
        label: { fr: 'Une liste de 47 pages', en: 'A 47-page list' },
        out: [
          { w: 2, text: { fr: "J'ai dicté une liste de 47 cadeaux, classés par priorité. J'en ai reçu deux. Le Père Noël a des soucis de budget.", en: "I dictated a list of 47 presents, ranked by priority. I got two. Santa has budget issues." }, fx: { happy: 2, smarts: 1, schedule: { key: 'ch_santa_reveal', years: 3 } } },
          { w: 1, text: { fr: "Ma liste était si longue que le Père Noël m'a répondu : « On va se calmer. » J'ai eu des chaussettes.", en: "My list was so long that Santa wrote back: \"Let's calm down.\" I got socks." }, fx: { happy: -3, schedule: { key: 'ch_santa_reveal', years: 3 } }, mood: 'sad' },
        ],
      },
      { label: { fr: 'La paix dans le monde', en: 'World peace' }, text: { fr: "J'ai demandé la paix dans le monde. Le Père Noël n'a pas pu, alors il m'a offert un jeu de société. C'est un début.", en: "I asked for world peace. Santa couldn't manage it, so he got me a board game. It's a start." }, fx: { karma: 6, happy: 3, schedule: { key: 'ch_santa_reveal', years: 3 } } },
    ],
  },
  {
    id: 'ch_santa_reveal',
    icon: '🎁',
    cat: 'family',
    chainOnly: true,
    actor: 'parent',
    when: { age: [5, 10] },
    scene: { place: 'home', mood: 'shock', prop: 'gift' },
    text: {
      fr: [
        "Réveillé{|e} en pleine nuit de Noël, tu surprends {a.rel} en train de déposer des cadeaux sous le sapin. Avec une fausse barbe de travers.",
        "La nuit de Noël, tu descends discrètement boire un verre d'eau… et tu tombes sur {a.rel}, la bouche pleine du biscuit laissé pour le Père Noël.",
      ],
      en: [
        "Waking up in the middle of Christmas Eve, you catch {a.rel} putting presents under the tree. Wearing a crooked fake beard.",
        "On Christmas Eve, you sneak downstairs for a glass of water… and run into {a.rel}, mouth full of the cookie left out for Santa.",
      ],
    },
    choices: [
      { label: { fr: "Faire comme si de rien n'était", en: 'Pretend I saw nothing' }, text: { fr: "J'ai fait semblant de n'avoir rien vu. Tant que les cadeaux arrivent, le Père Noël existe.", en: "I pretended I saw nothing. As long as the presents keep coming, Santa exists." }, fx: { happy: 4, smarts: 2, flag: 'knows_santa' } },
      { label: { fr: '« Je le savais ! »', en: '"I knew it!"' }, text: { fr: "J'ai crié « Je le savais ! » en pleine nuit. {a:Mon père a|Ma mère a} sursauté et renversé le sapin.", en: "I yelled \"I knew it!\" in the middle of the night. {a:My dad|My mom} jumped and knocked over the tree." }, fx: { happy: -2, rel: -3, flag: 'knows_santa' }, mood: 'shock' },
      {
        label: { fr: 'Monnayer mon silence', en: 'Sell my silence' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai proposé un marché : je ne dis rien aux plus petits, en échange d'un cadeau de plus chaque année. Contrat signé sur une serviette en papier.", en: "I offered a deal: I keep quiet around the little ones, in exchange for one extra present a year. Contract signed on a paper napkin." }, fx: { happy: 8, karma: -3, rel: -2, flag: 'knows_santa' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai tenté de négocier mon silence. On m'a renvoyé{|e} au lit sans bûche de Noël.", en: "I tried to negotiate my silence. I was sent back to bed with no Christmas dessert." }, fx: { happy: -5, flag: 'knows_santa' }, mood: 'sad' },
        ],
      },
      { label: { fr: '« Et la petite souris ?! »', en: '"And the Tooth Fairy?!"' }, if: { flag: 'magic_skeptic' }, text: { fr: "J'ai compris d'un coup que la petite souris était une arnaque, elle aussi. Ma vision du monde s'est effondrée en dix secondes.", en: "It hit me all at once: the Tooth Fairy was a scam too. My entire worldview collapsed in ten seconds." }, fx: { smarts: 4, happy: -6, flag: 'knows_santa' }, mood: 'shock' },
    ],
  },
  {
    id: 'ch_sibling_fight',
    icon: '📺',
    cat: 'family',
    actor: 'sibling',
    cooldown: 3,
    when: { age: [3, 12], has: 'sibling' },
    scene: { place: 'home', mood: 'angry', prop: 'remote' },
    text: {
      fr: [
        "{a.rel} a pris la télécommande et refuse de la rendre. C'était TON tour. Il y a des témoins.",
        "Quelqu'un a mangé la dernière part de gâteau, et {a.rel} a du chocolat sur le menton et un regard d'une innocence suspecte.",
      ],
      en: [
        "{a.rel} grabbed the remote and won't give it back. It was YOUR turn. There are witnesses.",
        "Someone ate the last slice of cake, and {a.rel} has chocolate on {a.his} chin and a suspiciously innocent look.",
      ],
    },
    choices: [
      {
        label: { fr: 'Attaque de chatouilles', en: 'Tickle attack' },
        out: [
          { w: 2, text: { fr: "J'ai lancé une attaque de chatouilles sur {a:mon frère|ma sœur}. On a fini par terre, morts de rire tous les deux.", en: "I launched a tickle attack on {a:my brother|my sister}. We ended up on the floor, both crying with laughter." }, fx: { happy: 6, rel: 5 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai lancé une attaque de chatouilles. {a:Mon frère m'a|Ma sœur m'a} mordu{|e}. La guerre est déclarée.", en: "I launched a tickle attack. {a:My brother|My sister} bit me. This means war." }, fx: { happy: -3, rel: -6, health: -1 }, mood: 'angry' },
        ],
      },
      { label: { fr: '{a:Le|La} dénoncer', en: 'Tell on {a.him}' }, text: { fr: "J'ai tout raconté aux parents. {a:Mon frère a été puni|Ma sœur a été punie}, et j'ai gagné un ennemi juré pour la semaine.", en: "I told our parents everything. {a:My brother|My sister} got punished, and I gained a sworn enemy for the week." }, fx: { rel: -8, discipline: 2, happy: 2 } },
      { label: { fr: 'Négocier', en: 'Negotiate' }, text: { fr: "J'ai négocié : la télé contre mes frites du dimanche. Accord trouvé, l'ONU est impressionnée.", en: "I negotiated: the TV in exchange for my Sunday fries. Deal reached, the UN is impressed." }, fx: { rel: 4, smarts: 2 } },
      { label: { fr: 'Bouder avec élégance', en: 'Sulk with dignity' }, text: { fr: "J'ai laissé couler. Je suis au-dessus de ça. Enfin, je boude dans ma chambre, mais avec beaucoup de classe.", en: "I let it go. I'm above this. Well, I'm sulking in my room, but with great class." }, fx: { karma: 3, happy: -2 } },
    ],
  },
  {
    id: 'ch_grandparent_visit',
    icon: '👵',
    cat: 'family',
    actor: 'grandparent',
    cooldown: 3,
    when: { age: [3, 12] },
    vars: { amount: [5, 40] },
    scene: { place: 'home', mood: 'love', prop: 'money' },
    text: {
      fr: [
        "{a.rel} te pince la joue, déclare que tu as « drôlement grandi » et te glisse {$amount} dans la main. « Surtout, ne le dis pas à tes parents. »",
        "Visite chez {a.rel} : la maison sent la soupe et l'armoire ancienne. Au moment de partir, {a.he} sort {$amount} d'un vieux porte-monnaie.",
      ],
      en: [
        "{a.rel} pinches your cheek, declares that you've \"grown so much\" and slips {$amount} into your hand. \"Don't tell your parents.\"",
        "Visiting {a.rel}: the house smells of soup and old wardrobes. As you leave, {a.he} pulls {$amount} out of an ancient coin purse.",
      ],
    },
    choices: [
      { label: { fr: 'Remercier par un câlin', en: 'Say thanks with a hug' }, text: { fr: "J'ai fait un énorme câlin à {a:mon grand-père|ma grand-mère} et empoché {$amount}. Tout le monde y gagne.", en: "I gave {a:my grandpa|my grandma} a huge hug and pocketed {$amount}. Everybody wins." }, fx: { money: 'amount', rel: 8, happy: 5 }, mood: 'love' },
      {
        label: { fr: 'Demander le double', en: 'Ask for double' },
        out: [
          { w: 1, text: { fr: "J'ai demandé le double. {a:Mon grand-père a|Ma grand-mère a} trouvé ça « culotté » et m'a quand même donné {$amount}, plus un sermon gratuit.", en: "I asked for double. {a:My grandpa|My grandma} called it \"cheeky\" and still gave me {$amount}, plus a free lecture." }, fx: { money: 'amount', rel: -3, happy: 3 } },
          { w: 1, text: { fr: "J'ai demandé le double. Résultat : zéro, et un long discours sur « les jeunes d'aujourd'hui ».", en: "I asked for double. Result: nothing, and a long speech about \"kids these days\"." }, fx: { rel: -6, happy: -3 } },
        ],
      },
      { label: { fr: "Refuser l'argent", en: 'Refuse the money' }, text: { fr: "J'ai refusé l'argent. {a:Mon grand-père me l'a|Ma grand-mère me l'a} glissé dans la poche quand même. On ne lutte pas contre un grand-parent.", en: "I refused the money. {a:My grandpa|My grandma} slipped it into my pocket anyway. You can't fight a grandparent." }, fx: { money: 'amount', karma: 4, rel: 6 } },
      { label: { fr: 'Écouter ses histoires', en: 'Listen to old stories' }, text: { fr: "J'ai écouté {a:mon grand-père|ma grand-mère} raconter son enfance pendant deux heures. J'ai appris des mots que je n'ai pas le droit de répéter.", en: "I listened to {a:my grandpa|my grandma} tell childhood stories for two hours. I learned words I'm not allowed to repeat." }, fx: { money: 'amount', smarts: 3, rel: 10 } },
    ],
  },
  {
    id: 'ch_bike',
    icon: '🚲',
    cat: 'family',
    actor: 'parent',
    once: true,
    when: { age: [4, 8] },
    scene: { place: 'park', mood: 'proud', prop: 'bike' },
    text: {
      fr: [
        "Aujourd'hui, {a.rel} enlève les petites roues de ton vélo. « Je te tiens, je te tiens… » Tu sais très bien qu'{a.he} ne te tient pas.",
        "C'est le grand jour : vélo sans petites roues, pente douce, et {a.rel} qui court derrière toi en hurlant des encouragements.",
      ],
      en: [
        "Today {a.rel} takes the training wheels off your bike. \"I've got you, I've got you…\" You know full well {a.he} doesn't.",
        "It's the big day: no training wheels, a gentle slope, and {a.rel} running behind you shouting encouragement.",
      ],
    },
    choices: [
      {
        label: { fr: 'Pédaler à fond', en: 'Pedal like crazy' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai pédalé comme un{|e} champion{|ne}. Je ne savais pas freiner, mais je savais rouler.", en: "I pedaled like a champion. I didn't know how to brake, but I sure knew how to ride." }, fx: { athletic: 5, happy: 8 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai pédalé à fond jusqu'au buisson le plus proche. Plâtre au bras, mais couvert de dessins de tous les copains.", en: "I pedaled full speed into the nearest bush. Cast on my arm, but covered in my friends' doodles." }, fx: { health: -5, happy: -2, disease: 'broken_arm' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Y aller doucement', en: 'Take it slow' }, text: { fr: "J'ai roulé à deux à l'heure pendant une heure. Un escargot m'a doublé, mais je suis resté{|e} debout.", en: "I rode at two miles an hour for an hour. A snail overtook me, but I stayed upright." }, fx: { athletic: 2, discipline: 2 } },
      { label: { fr: 'Remettre les petites roues', en: 'Keep the training wheels' }, text: { fr: "J'ai exigé qu'on remette les petites roues. Je les garderai jusqu'à 30 ans s'il le faut.", en: "I demanded the training wheels go back on. I'll keep them until I'm 30 if I have to." }, fx: { happy: 2, athletic: -2 } },
    ],
  },
  {
    id: 'ch_lemonade',
    icon: '🍋',
    cat: 'money',
    once: true,
    when: { age: [6, 12] },
    vars: { amount: [5, 30] },
    scene: { place: 'park', mood: 'happy', prop: 'lemonade' },
    text: {
      fr: [
        "Il fait 32 degrés. Tu installes un stand de limonade devant chez toi avec un carton et une ambition démesurée.",
        "Tu lances ta première entreprise : un stand de limonade. Capital de départ : trois citrons et un grand sourire.",
      ],
      en: [
        "It's 90 degrees out. You set up a lemonade stand in front of your house with a cardboard box and boundless ambition.",
        "You're launching your first business: a lemonade stand. Starting capital: three lemons and a big smile.",
      ],
    },
    choices: [
      { label: { fr: 'Prix honnêtes', en: 'Fair prices' }, text: { fr: "J'ai vendu ma limonade à prix honnête. Bénéfice : {$amount}. Le capitalisme bienveillant existe.", en: "I sold lemonade at a fair price. Profit: {$amount}. Wholesome capitalism exists." }, fx: { money: 'amount', karma: 2, happy: 5 }, mood: 'happy' },
      {
        label: { fr: 'Tarif « artisanal »', en: '"Artisanal" pricing' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "J'ai vendu ma limonade trois fois trop cher en la disant « artisanale ». Les gens ont adoré. Bénéfice : {$amount}.", en: "I sold my lemonade at triple price by calling it \"artisanal\". People loved it. Profit: {$amount}." }, fx: { money: 'amount', smarts: 3, karma: -2 }, mood: 'proud' },
          { w: 1, text: { fr: "Personne n'a voulu payer ma limonade « premium ». J'ai tout bu moi-même. Mal au ventre jusqu'au soir.", en: "Nobody wanted to pay for my \"premium\" lemonade. I drank it all myself. Stomachache until bedtime." }, fx: { happy: -3, health: -1 } },
        ],
      },
      {
        label: { fr: 'Inventer une recette', en: 'Invent a secret recipe' },
        out: [
          { w: 1, text: { fr: "J'ai ajouté du sirop de menthe et du basilic. Un voisin a dit « audacieux ». Je crois que c'était un compliment.", en: "I added mint syrup and basil. A neighbor said \"bold\". I think it was a compliment." }, fx: { happy: 3, smarts: 2 } },
          { w: 1, text: { fr: "J'ai confondu le sel et le sucre. Mon unique client a tout recraché en direct. Fin de l'aventure.", en: "I mixed up the salt and the sugar. My only customer spat it out on the spot. End of the venture." }, fx: { happy: -4 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Vendre à la famille', en: 'Sell to family only' }, text: { fr: "Mes seuls clients ont été mes parents, qui ont payé avec mon propre argent de poche. Bénéfice net : discutable.", en: "My only customers were my parents, who paid with my own allowance. Net profit: debatable." }, fx: { happy: 2 } },
    ],
  },

  // ───────────────────────────── health ─────────────────────────────
  {
    id: 'ch_chickenpox',
    icon: '🔴',
    cat: 'health',
    once: true,
    when: { age: [3, 10] },
    scene: { place: 'home', mood: 'sick', prop: 'spots' },
    text: {
      fr: [
        "Tu te réveilles couvert{|e} de petits boutons rouges. Le médecin confirme : c'est la varicelle. Tu ressembles à une pizza.",
        "Ça gratte. Ça gratte partout. Tu as attrapé la varicelle, comme la moitié de ta classe.",
      ],
      en: [
        "You wake up covered in little red spots. The doctor confirms: it's chickenpox. You look like a pepperoni pizza.",
        "It itches. It itches everywhere. You caught chickenpox, like half your class.",
      ],
    },
    choices: [
      { label: { fr: 'Gratter sans retenue', en: 'Scratch freely' }, text: { fr: "J'ai tout gratté. Il me reste une petite cicatrice sur le nez. Elle a du caractère.", en: "I scratched everything. I've got a little scar on my nose now. It has character." }, fx: { disease: 'chickenpox', looks: -3, happy: 2 } },
      { label: { fr: 'Résister héroïquement', en: 'Resist heroically' }, text: { fr: "J'ai résisté à l'envie de me gratter pendant deux semaines. Je suis devenu{|e} une légende de la volonté.", en: "I resisted the urge to scratch for two whole weeks. I became a legend of willpower." }, fx: { disease: 'chickenpox', discipline: 5, happy: -2 }, mood: 'proud' },
      { label: { fr: 'Aller quand même à la fête', en: 'Go to the party anyway' }, text: { fr: "Je suis allé{|e} à l'anniversaire d'un copain avec mes boutons. Toute la classe a eu la varicelle. On m'appelle Patient Zéro.", en: "I went to a friend's birthday party with my spots. The whole class caught chickenpox. They call me Patient Zero." }, fx: { disease: 'chickenpox', karma: -5, happy: 4 } },
    ],
  },

  // ───────────────────────────── pets ─────────────────────────────
  {
    id: 'ch_pet_request',
    icon: '🐶',
    cat: 'pet',
    actor: 'parent',
    once: true,
    when: { age: [5, 11], noHas: 'pet' },
    scene: { place: 'home', mood: 'happy', prop: 'pet' },
    text: {
      fr: [
        "Tu supplies {a.rel} d'adopter un animal. Tu as préparé un exposé, des dessins et une petite larme, au cas où.",
        "Depuis trois semaines, tu ne parles que d'animaux, et {a.rel} semble sur le point de craquer.",
      ],
      en: [
        "You beg {a.rel} to adopt a pet. You've prepared a presentation, drawings and a single tear, just in case.",
        "For three weeks you've talked about nothing but animals, and {a.rel} looks ready to crack.",
      ],
    },
    choices: [
      {
        label: { fr: 'Réclamer un chien', en: 'Beg for a dog' },
        out: [
          { w: 1, text: { fr: "J'ai eu un chiot ! Il a mangé une chaussure dès le premier soir. Je l'aime déjà.", en: "I got a puppy! He ate a shoe on the very first night. I already love him." }, fx: { happy: 12, newNpc: { role: 'pet', species: 'dog', age: [0, 1], abs: true } }, mood: 'love' },
          { w: 1, text: { fr: "Pas de chien, « trop de responsabilités ». J'ai eu un poisson rouge. On a les compagnons qu'on mérite.", en: "No dog, \"too much responsibility\". I got a goldfish. You get the companion you deserve." }, fx: { happy: 4, newNpc: { role: 'pet', species: 'fish', age: [0, 1], abs: true } } },
        ],
      },
      { label: { fr: 'Demander un hamster', en: 'Ask for a hamster' }, text: { fr: "J'ai eu un hamster. Il dort le jour et fait la fête la nuit. On se comprend.", en: "I got a hamster. He sleeps all day and parties all night. We get each other." }, fx: { happy: 8, newNpc: { role: 'pet', species: 'hamster', age: [0, 1], abs: true } }, mood: 'happy' },
      { label: { fr: 'Un chat, par pitié', en: 'A cat, please' }, text: { fr: "J'ai eu un chaton. Il m'ignore royalement, sauf quand il a faim. C'est lui le chef, maintenant.", en: "I got a kitten. He royally ignores me, except when he's hungry. He's the boss now." }, fx: { happy: 10, newNpc: { role: 'pet', species: 'cat', age: [0, 1], abs: true } }, mood: 'love' },
      { label: { fr: 'Exiger un tigre', en: 'Demand a tiger' }, text: { fr: "J'ai demandé un tigre. Après de longues négociations, j'ai obtenu un chat tigré. Victoire diplomatique.", en: "I asked for a tiger. After lengthy negotiations, I got a tabby cat. A diplomatic victory." }, fx: { happy: 8, smarts: 1, newNpc: { role: 'pet', species: 'cat', age: [0, 1], abs: true } } },
    ],
  },
  {
    id: 'ch_pet_homework',
    icon: '🐾',
    cat: 'pet',
    actor: 'pet',
    once: true,
    when: { age: [6, 12], school: 'primary', has: 'pet' },
    scene: { place: 'school', mood: 'shock', prop: 'pet' },
    text: {
      fr: [
        "Catastrophe : {a.first}, ton animal, a [[mangé|vomi sur|caché]] ton devoir de maths. La maîtresse attend, la main tendue.",
        "Ce matin, ton exposé était posé sur la table. Ce soir, il est en partie dans l'estomac de {a.first}. La maîtresse ne va jamais te croire.",
      ],
      en: [
        "Disaster: {a.first}, your pet, [[ate|threw up on|hid]] your math homework. The teacher is waiting, hand outstretched.",
        "This morning your project was on the table. Tonight it's partly in {a.first}'s stomach. The teacher will never believe you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Dire la vérité', en: 'Tell the truth' },
        out: [
          { w: 1, text: { fr: "J'ai dit la vérité. La maîtresse a ricané et m'a mis zéro. La vérité est surcotée.", en: "I told the truth. The teacher smirked and gave me a zero. The truth is overrated." }, fx: { grade: -5, happy: -3 } },
          { w: 1, text: { fr: "J'ai dit la vérité. La maîtresse, qui a trois chats, m'a cru{|e} sur-le-champ.", en: "I told the truth. The teacher, who owns three cats, believed me on the spot." }, fx: { happy: 4 } },
        ],
      },
      { label: { fr: 'Apporter les preuves', en: 'Bring the evidence' }, text: { fr: "J'ai apporté les restes du devoir dans un sac congélation. La classe était fascinée, la maîtresse beaucoup moins.", en: "I brought the remains of my homework in a freezer bag. The class was fascinated, the teacher much less so." }, fx: { smarts: 2, happy: 3, grade: -2 } },
      { label: { fr: 'Tout refaire la nuit', en: 'Redo it overnight' }, text: { fr: "J'ai tout refait pendant la nuit. Résultat : 14/20 et des cernes de ministre.", en: "I redid it overnight. Result: a B and the eye bags of a CEO." }, fx: { discipline: 4, grade: 4, health: -1 } },
      { label: { fr: 'Gronder {a.first}', en: 'Scold {a.first}' }, text: { fr: "J'ai sévèrement grondé {a.first}, qui a répondu en faisant pipi sur mon cartable. Message reçu.", en: "I sternly scolded {a.first}, who responded by peeing on my schoolbag. Message received." }, fx: { rel: -5, happy: -3 } },
    ],
  },
  {
    id: 'ch_class_pet',
    icon: '🐹',
    cat: 'pet',
    once: true,
    when: { age: [6, 11], school: 'primary' },
    scene: { place: 'home', mood: 'happy', prop: 'hamster' },
    text: {
      fr: [
        "Honneur suprême : c'est toi qui gardes Caramel, le hamster de la classe, pendant le week-end.",
        "La maîtresse te confie le cochon d'Inde de la classe pour les vacances. Il s'appelle Napoléon et il a l'air de juger tout le monde.",
      ],
      en: [
        "Supreme honour: you get to look after Caramel, the class hamster, for the weekend.",
        "The teacher trusts you with the class guinea pig for the holidays. His name is Napoleon and he seems to judge everyone.",
      ],
    },
    choices: [
      { label: { fr: 'En prendre grand soin', en: 'Take great care of it' }, text: { fr: "J'ai bichonné la mascotte de la classe : brossage, musique classique et bâtonnets de carotte bio. Elle est rentrée plus détendue que moi.", en: "I pampered the class pet: brushing, classical music and organic carrot sticks. It went back more relaxed than me." }, fx: { karma: 4, happy: 4, discipline: 2 } },
      {
        label: { fr: 'Lui apprendre des tours', en: 'Teach it tricks' },
        out: [
          { w: 1, text: { fr: "J'ai appris à la mascotte de la classe à faire un tour sur elle-même. Lundi, j'étais une star.", en: "I taught the class pet to spin in a circle. On Monday, I was a star." }, fx: { happy: 8, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai voulu dresser la mascotte de la classe. Elle m'a mordu le doigt et a boudé tout le week-end.", en: "I tried to train the class pet. It bit my finger and sulked all weekend." }, fx: { health: -1, happy: -2 } },
        ],
      },
      {
        label: { fr: 'La laisser se balader', en: 'Let it roam free' },
        out: [
          { w: 2, text: { fr: "J'ai laissé la mascotte se balader dans la maison. Elle a disparu trois jours, puis on l'a retrouvée endormie dans un chausson.", en: "I let the class pet roam the house. It vanished for three days, then turned up asleep in a slipper." }, fx: { happy: -4, karma: -2 } },
          { w: 1, text: { fr: "La mascotte s'est échappée pour de bon. J'ai acheté un sosie à l'animalerie. Personne n'a rien vu. Sauf moi, toutes les nuits, dans mes cauchemars.", en: "The class pet escaped for good. I bought a lookalike at the pet store. Nobody noticed. Except me, every night, in my nightmares." }, fx: { karma: -5, happy: -3, money: -15 }, mood: 'shock' },
        ],
      },
    ],
  },
];
