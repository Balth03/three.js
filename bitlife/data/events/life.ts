// Everyday life events: pets, holidays & celebrations, travel, neighbours, household chaos.
import type { EventDef } from '@bl/sim';

export const lifeEvents: EventDef[] = [
  // ═════════════════════════════ PETS ═════════════════════════════
  {
    id: 'lf_pet_gross_snack',
    icon: '🤮',
    cat: 'pet',
    rating: 1,
    actor: 'pet',
    when: { has: 'pet', age: [16, 99] },
    weight: 9,
    cooldown: 4,
    scene: { place: 'home', mood: 'sick', prop: 'trash' },
    text: {
      fr: [
        "{a.first} a fouillé la poubelle de la salle de bain et a avalé quelque chose d'indéfinissable, avec un fil. {a:Il|Elle} a l'air très fi{a:er|ère} de {a:lui|elle}.",
        "{a.first} a mangé ton string sale. Entier. Ça fait deux jours. Rien n'est ressorti, ni d'un côté ni de l'autre.",
      ],
      en: [
        "{a.first} raided the bathroom bin and swallowed something unidentifiable with a string attached. Looks extremely proud.",
        "{a.first} ate your dirty thong. Whole. It's been two days. Nothing has come out, at either end.",
      ],
    },
    choices: [
      {
        label: { fr: 'Attendre que ça sorte', en: 'Wait it out' },
        out: [
          { w: 3, text: { fr: "Trois jours plus tard, c'est ressorti dans le jardin, intact, devant les voisins qui prenaient l'apéro. J'ai dit bonjour. Personne n'a répondu.", en: "Three days later it came out in the garden, intact, in front of the neighbours having drinks. I waved. Nobody waved back." }, fx: { happy: -3, rel: 2, visual: 'poop' }, mood: 'shock' },
          { w: 1, text: { fr: "Ça n'est jamais ressorti. Opération d'urgence. Le véto m'a rendu l'objet dans un sachet zippé, « en souvenir ».", en: "It never came out. Emergency surgery. The vet handed me the item in a zip bag, “as a keepsake”." }, fx: { money: -1800, stress: 8, rel: -3 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Foncer chez le véto', en: 'Rush to the vet' }, text: { fr: "Le véto a fait vomir {a.first} sur la table. J'ai dû identifier publiquement le contenu devant une salle d'attente pleine. J'ai menti.", en: "The vet made {a.first} throw up on the table. I had to publicly identify the contents in front of a full waiting room. I lied." }, fx: { money: -350, happy: -4, rel: 5 }, mood: 'shock' },
      { label: { fr: 'Ranger la poubelle', en: 'Hide the bin' }, text: { fr: "J'ai rangé la poubelle dans un placard. {a.first} a ouvert le placard. On n'est clairement pas au même niveau intellectuel.", en: "I put the bin in a cupboard. {a.first} opened the cupboard. We are clearly not on the same intellectual level." }, fx: { smarts: -1, happy: -2 } },
    ],
  },
  {
    id: 'lf_vet_bill',
    icon: '🩺',
    cat: 'pet',
    rating: 0,
    actor: 'pet',
    when: { has: 'pet', age: [18, 99] },
    vars: { amount: [600, 4500] },
    weight: 9,
    cooldown: 5,
    scene: { place: 'hospital', mood: 'sad', prop: 'stethoscope' },
    text: {
      fr: [
        "{a.first} boite depuis trois jours. Le véto annonce une opération à {$amount}. Il le dit en caressant son nouveau 4x4.",
        "Le véto a trouvé « un petit truc » sur {a.first}. Le devis pour enlever le petit truc : {$amount}. Le truc est vraiment très petit.",
      ],
      en: [
        "{a.first} has been limping for three days. The vet quotes {$amount} for surgery. He says it while stroking his brand-new SUV keys.",
        "The vet found “a little something” on {a.first}. The quote to remove the little something: {$amount}. It is a very little something.",
      ],
    },
    choices: [
      { label: { fr: 'Payer, évidemment', en: 'Pay, obviously' }, text: { fr: "J'ai payé. {a.first} va très bien et me regarde comme si rien ne s'était passé. Moi, je mange des pâtes jusqu'en mars.", en: "I paid. {a.first} is doing great and looks at me like nothing happened. I'm eating plain pasta until March." }, fx: { money: '-amount', rel: 15, happy: 4 }, mood: 'happy' },
      {
        label: { fr: 'Remède de grand-mère', en: 'Home remedy' },
        out: [
          { w: 1, text: { fr: "Bouillon de poulet, câlins et une vidéo YouTube d'un type en Ohio. Ça a marché. Je ne saurai jamais pourquoi.", en: "Chicken broth, cuddles and a YouTube video by a guy in Ohio. It worked. I'll never know why." }, fx: { rel: 5, happy: 5 }, mood: 'proud' },
          { w: 1, text: { fr: "Le remède de grand-mère a empiré les choses. Retour chez le véto, qui a doublé le prix « pour l'automédication ».", en: "The home remedy made it worse. Back to the vet, who doubled the price “for the self-medication”." }, fx: { money: -2500, rel: -5, stress: 10 }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Négocier le prix', en: 'Haggle' }, text: { fr: "J'ai négocié comme au souk. Le véto a baissé de 10 % et m'a facturé « consultation commerciale ». Match nul.", en: "I haggled like at a bazaar. The vet knocked off 10% and billed me a “commercial consultation”. A draw." }, fx: { money: -900, smarts: 2, rel: 8 } },
    ],
  },
  {
    id: 'lf_couch_massacre',
    icon: '🛋️',
    cat: 'pet',
    rating: 0,
    actor: 'pet',
    when: { has: 'pet', age: [10, 99] },
    weight: 10,
    cooldown: 4,
    scene: { place: 'home', mood: 'shock', prop: 'couch' },
    text: {
      fr: [
        "Tu rentres : le canapé est éventré, il neige de la mousse dans le salon, et {a.first} dort au milieu, paisible, comme un dieu de la destruction au repos.",
        "{a.first} a transformé le canapé neuf en griffoir géant. Il reste trois coussins et la notice. {a:Il|Elle} a épargné la notice.",
      ],
      en: [
        "You come home: the couch is gutted, foam is snowing over the living room, and {a.first} is asleep in the middle, serene, like a resting god of destruction.",
        "{a.first} turned the new couch into a giant scratching post. Three cushions and the manual survive. The manual was spared.",
      ],
    },
    choices: [
      { label: { fr: 'Gronder sévèrement', en: 'Scold firmly' }, text: { fr: "J'ai fait un discours ferme sur le respect du mobilier. {a.first} a bâillé à la moitié et s'est léché le derrière à la fin.", en: "I gave a firm speech about respecting furniture. {a.first} yawned halfway through and licked their butt at the end." }, fx: { rel: -5, stress: 4 } },
      { label: { fr: 'Racheter un canapé', en: 'Buy a new couch' }, text: { fr: "J'ai racheté un canapé. {a.first} l'a inspecté pendant dix minutes, comme un chef de chantier qui prépare la démolition.", en: "I bought a new couch. {a.first} inspected it for ten minutes, like a foreman planning the demolition." }, fx: { money: -800, happy: 2 } },
      { label: { fr: 'Accepter le chaos', en: 'Embrace the chaos' }, text: { fr: "J'ai gardé le canapé éventré. C'est devenu « style industriel ». Les invités s'assoient sur les ressorts. Personne ne revient.", en: "I kept the gutted couch. It's “industrial style” now. Guests sit on the springs. Nobody comes back." }, fx: { happy: 3, rel: 6, looks: -1 }, mood: 'happy' },
    ],
  },
  {
    id: 'lf_dog_humps_guest',
    icon: '🐕',
    cat: 'pet',
    rating: 1,
    actor: 'pet',
    when: { has: 'pet', age: [18, 99] },
    weight: 8,
    cooldown: 6,
    scene: { place: 'home', mood: 'shock', prop: 'dinner' },
    text: {
      fr: [
        "Dîner chic à la maison. {a.first} a choisi ce moment pour s'accoupler frénétiquement avec la jambe de ton invité le plus important. Avec contact visuel.",
        "Ta belle-mère est en visite. {a.first} est tombé{a:|e} amoureu{a:x|se} de son mollet. Ça dure depuis le fromage. Personne n'ose intervenir.",
      ],
      en: [
        "Fancy dinner at your place. {a.first} picked this moment to frantically hump the leg of your most important guest. With eye contact.",
        "Your mother-in-law is visiting. {a.first} has fallen in love with her calf. It's been going on since the cheese course. Nobody dares intervene.",
      ],
    },
    choices: [
      { label: { fr: 'Faire comme si de rien', en: 'Pretend nothing is happening' }, text: { fr: "J'ai continué à parler de l'immobilier très fort. L'invité aussi. On a tenu vingt minutes. C'était le dîner le plus long de ma vie.", en: "I kept talking about property prices really loudly. So did the guest. We held out for twenty minutes. Longest dinner of my life." }, fx: { stress: 10, happy: -3, smarts: 1 }, mood: 'shock' },
      { label: { fr: "« C'est de l'affection »", en: '“It means they like you”' }, text: { fr: "J'ai expliqué que c'était « de la dominance affectueuse ». L'invité est reparti avec une tache sur le pantalon et un regard vide.", en: "I explained it was “affectionate dominance”. The guest left with a stain on their trousers and a thousand-yard stare." }, fx: { happy: -5, karma: -2 } },
      { label: { fr: 'Filmer pour Internet', en: 'Film it for the internet' }, text: { fr: "J'ai filmé. 400 000 vues. L'invité m'a bloqué{|e} partout, y compris sur LinkedIn.", en: "I filmed it. 400,000 views. The guest blocked me everywhere, LinkedIn included." }, fx: { followers: 3000, fame: 2, happy: 4, karma: -3 }, mood: 'happy' },
    ],
  },
  {
    id: 'lf_cat_rat_gift',
    icon: '🐀',
    cat: 'pet',
    rating: 2,
    actor: 'pet',
    when: { has: 'pet', age: [16, 99] },
    weight: 8,
    cooldown: 5,
    scene: { place: 'home', mood: 'shock', prop: 'pillow', fx: 'gore' },
    text: {
      fr: [
        "Tu te réveilles avec quelque chose d'humide sur l'oreiller. C'est la moitié avant d'un rat. {a.first} te fixe depuis le pied du lit, la moitié arrière dans la gueule. C'est un cadeau.",
        "{a.first} a disposé sur ton paillasson, en ligne parfaite : un rat éventré, sa queue, et ce que tu crois être son foie. Une œuvre d'art contemporain.",
      ],
      en: [
        "You wake up with something damp on your pillow. It's the front half of a rat. {a.first} stares at you from the foot of the bed, back half in mouth. It's a gift.",
        "{a.first} arranged on your doormat, in a perfect line: a disembowelled rat, its tail, and what you believe is its liver. Contemporary art.",
      ],
    },
    choices: [
      { label: { fr: 'Hurler', en: 'Scream' }, text: { fr: "J'ai hurlé si fort que le voisin a appelé les flics. Ils ont vu le rat, ont vomi dans l'escalier et sont repartis sans rien dire.", en: "I screamed so loud the neighbour called the cops. They saw the rat, puked on the stairs and left without a word." }, fx: { stress: 10, happy: -5, rel: -3, visual: 'gore' }, mood: 'shock' },
      { label: { fr: 'Remercier poliment', en: 'Say thank you' }, text: { fr: "J'ai dit « merci, c'est trop » et j'ai ramassé les tripes avec une spatule. {a.first} était ravi{a:|e}. Le lendemain, il y avait deux rats.", en: "I said “thank you, you shouldn't have” and scooped the guts with a spatula. {a.first} was thrilled. Next morning there were two rats." }, fx: { rel: 12, happy: -2, karma: 2 }, mood: 'neutral' },
      { label: { fr: 'Changer de draps… et de vie', en: 'Burn the sheets' }, text: { fr: "J'ai brûlé les draps dans le jardin. Puis l'oreiller. Puis, par principe, le matelas. Le voisin trouve que je prends l'écologie très à cœur.", en: "I burned the sheets in the garden. Then the pillow. Then, on principle, the mattress. The neighbour thinks I'm very serious about composting." }, fx: { money: -400, stress: -4, visual: 'fire' } },
    ],
  },
  {
    id: 'lf_pet_runaway',
    icon: '🪧',
    cat: 'pet',
    rating: 0,
    actor: 'pet',
    when: { has: 'pet', age: [8, 99] },
    weight: 7,
    cooldown: 8,
    scene: { place: 'park', mood: 'sad', prop: 'poster' },
    text: {
      fr: [
        "La porte était mal fermée. {a.first} a disparu. Sa gamelle est pleine et ton cœur est vide.",
        "{a.first} a profité d'un livreur distrait pour prendre la fuite. Dernière position connue : en train de courir vers l'autoroute avec un saucisson.",
      ],
      en: [
        "The door wasn't shut properly. {a.first} is gone. The food bowl is full and your heart is empty.",
        "{a.first} used a distracted delivery guy to make a break for it. Last seen: sprinting towards the motorway with a salami.",
      ],
    },
    choices: [
      {
        label: { fr: 'Coller des affiches', en: 'Put up posters' },
        out: [
          { w: 3, text: { fr: "J'ai collé 300 affiches. Une vieille dame a ramené {a.first} le soir même, en réclamant la récompense que je n'avais pas promise.", en: "I put up 300 posters. An old lady brought {a.first} back that night, demanding the reward I never offered." }, fx: { money: -50, happy: 8, rel: 5 }, mood: 'happy' },
          { w: 2, text: { fr: "Les affiches n'ont rien donné. Juste des appels de gens qui voulaient savoir si j'étais célibataire. J'attends à côté de la gamelle.", en: "The posters got nothing. Just calls from people asking if I'm single. I wait by the food bowl." }, fx: { happy: -10, stress: 6, schedule: { key: 'lf_pet_return', years: 1 } }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Fouiller le quartier', en: 'Search the area' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai couru six kilomètres en criant son nom. J'ai retrouvé {a.first} chez le boucher, adopté{a:|e} par toute l'équipe.", en: "I ran four miles shouting the name. Found {a.first} at the butcher's, adopted by the whole staff." }, fx: { athletic: 4, happy: 6, rel: 4 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai fouillé toute la nuit. Rien. {a.first} a peut-être enfin trouvé sa vraie vocation. Je laisse la fenêtre ouverte.", en: "I searched all night. Nothing. Maybe {a.first} finally found their true calling. I leave the window open." }, fx: { happy: -10, health: -2, schedule: { key: 'lf_pet_return', years: 2 } }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Laisser partir', en: 'Let it go' }, text: { fr: "Je me suis dit que {a.first} était parti{a:|e} vivre sa meilleure vie. J'ai pleuré dans la gamelle. Je l'ai gardée.", en: "I told myself {a.first} left to live their best life. I cried into the food bowl. I kept it." }, fx: { happy: -12, actorGone: true }, mood: 'cry' },
    ],
  },
  {
    id: 'lf_pet_return',
    icon: '🐾',
    cat: 'pet',
    rating: 0,
    chainOnly: true,
    actor: 'pet',
    scene: { place: 'home', mood: 'shock', prop: 'door' },
    text: {
      fr: [
        "On gratte à la porte. C'est {a.first}. Plus gros{a:|se}, bronzé{a:|e}, avec un collier que tu n'as jamais acheté.",
        "Après des mois d'absence, {a.first} est sur le paillasson, comme si de rien n'était. {a:Il|Elle} réclame sa gamelle. Sur un ton de reproche.",
      ],
      en: [
        "Something scratches at the door. It's {a.first}. Fatter, tanned, wearing a collar you never bought.",
        "After months away, {a.first} is sitting on the doormat like nothing happened, demanding dinner. In an accusatory tone.",
      ],
    },
    choices: [
      { label: { fr: 'Fondre en larmes', en: 'Burst into tears' }, text: { fr: "J'ai pleuré, j'ai serré {a.first} fort, j'ai ouvert trois boîtes de pâtée. Je ne poserai pas de questions sur le collier.", en: "I cried, hugged {a.first} hard, opened three tins of food. I won't ask about the collar." }, fx: { happy: 18, rel: 20 }, mood: 'love' },
      { label: { fr: 'Enquêter sur le collier', en: 'Investigate the collar' }, text: { fr: "Le collier venait d'une famille à l'autre bout de la ville. {a.first} vivait une double vie. On partage la garde, maintenant. J'ai les week-ends.", en: "The collar belonged to a family across town. {a.first} was living a double life. We share custody now. I get weekends." }, fx: { happy: 6, rel: -5, smarts: 2 }, mood: 'shock' },
    ],
  },
  {
    id: 'lf_pet_death_sad',
    icon: '🌈',
    cat: 'pet',
    rating: 0,
    actor: 'pet',
    when: { has: 'pet', age: [6, 99], chance: 0.5 },
    weight: 5,
    cooldown: 6,
    scene: { place: 'home', mood: 'cry', prop: 'basket' },
    text: {
      fr: [
        "{a.first} est très {a:vieux|vieille} maintenant. Ce matin, {a:il|elle} n'a pas voulu se lever. Le véto dit qu'il est temps.",
        "{a.first} dort de plus en plus et mange de moins en moins. Tu sais ce que ça veut dire, même si tu fais semblant que non.",
      ],
      en: [
        "{a.first} is very old now. This morning, {a.he} wouldn't get up. The vet says it's time.",
        "{a.first} sleeps more and eats less every day. You know what it means, even if you pretend you don't.",
      ],
    },
    choices: [
      { label: { fr: 'Rester jusqu’au bout', en: 'Stay until the end' }, text: { fr: "Je suis resté{|e} jusqu'au bout, la main sur sa tête. {a.first} est parti{a:|e} en ronronnant, ou presque. La maison est trop calme.", en: "I stayed until the end, hand on that little head. {a.first} left peacefully. The house is far too quiet." }, fx: { happy: -18, karma: 5, actorDie: true }, mood: 'cry' },
      { label: { fr: 'Une dernière journée', en: 'One last perfect day' }, text: { fr: "On a eu une dernière journée parfaite : plage, jambon, sieste au soleil. Puis {a.first} s'est endormi{a:|e} pour de bon. Je garde le jambon en souvenir. Non, je l'ai mangé.", en: "We had one last perfect day: beach, ham, nap in the sun. Then {a.first} fell asleep for good. I kept the ham as a memento. No, I ate it." }, fx: { happy: -12, karma: 4, actorDie: true }, mood: 'sad' },
      { label: { fr: 'Ne pas y croire', en: 'Refuse to accept it' }, text: { fr: "J'ai refusé d'y croire, j'ai dépensé une fortune en traitements. {a.first} a tenu six mois de plus, puis est parti{a:|e} quand même. J'ai tout donné.", en: "I refused to accept it and spent a fortune on treatments. {a.first} lasted six more months, then left anyway. I gave it everything." }, fx: { happy: -10, money: -3000, rel: 10, actorDie: true }, mood: 'cry' },
    ],
  },
  {
    id: 'lf_pet_death_absurd',
    icon: '💥',
    cat: 'pet',
    rating: 2,
    actor: 'pet',
    when: { has: 'pet', age: [16, 99], chance: 0.5 },
    weight: 4,
    cooldown: 10,
    scene: { place: 'home', mood: 'shock', prop: 'blender', fx: 'gore' },
    text: {
      fr: [
        "{a.first} a mâchouillé le câble du robot ménager pendant que tu faisais un smoothie. Il y a eu un éclair, une odeur de barbecue et du poil jusqu'au plafond.",
        "{a.first} s'est endormi{a:|e} dans le tambour de la machine à laver. Tu as lancé un programme 90 °C essorage 1400 tours. Il y a des morceaux dans le filtre.",
      ],
      en: [
        "{a.first} chewed through the blender cable while you were making a smoothie. A flash, a barbecue smell, and fur all the way to the ceiling.",
        "{a.first} fell asleep inside the washing machine. You ran a 90 °C cycle, 1400 rpm spin. There are chunks in the filter.",
      ],
    },
    choices: [
      { label: { fr: 'Enterrer les restes', en: 'Bury what’s left' }, text: { fr: "J'ai enterré ce que j'ai pu récupérer dans une boîte à chaussures. Taille 36. Il restait de la place. J'ai pleuré, puis j'ai vomi, puis j'ai repleuré.", en: "I buried what I could recover in a shoebox. Small size. There was room to spare. I cried, then puked, then cried again." }, fx: { happy: -15, health: -2, actorDie: true, visual: 'gore' }, mood: 'cry' },
      { label: { fr: 'Faire empailler', en: 'Get it stuffed' }, text: { fr: "Le taxidermiste a fait de son mieux avec ce qu'il avait. Le résultat ressemble à un sac de poils avec un œil. Il trône sur la cheminée. Les invités évitent le salon.", en: "The taxidermist did his best with what he had. The result looks like a fur bag with one eye. It sits on the mantelpiece. Guests avoid the living room." }, fx: { happy: -8, money: -600, actorDie: true, karma: -2 }, mood: 'sad' },
      { label: { fr: 'Accuser l’électroménager', en: 'Sue the manufacturer' }, text: { fr: "J'ai attaqué le fabricant. Ils m'ont envoyé un bon de réduction de 15 % et une carte de condoléances en chinois. Je l'ai encadrée.", en: "I sued the manufacturer. They sent a 15% off coupon and a condolence card in Mandarin. I framed it." }, fx: { happy: -12, money: 200, actorDie: true }, mood: 'angry' },
    ],
  },
  {
    id: 'lf_pet_insta',
    icon: '📸',
    cat: 'pet',
    rating: 0,
    actor: 'pet',
    when: { has: 'pet', age: [12, 99], noFlag: 'lf_petfluencer' },
    weight: 6,
    once: true,
    scene: { place: 'home', mood: 'happy', prop: 'phone' },
    text: {
      fr: [
        "Tu as posté une photo de {a.first} avec une tête de comptable déprimé. 2 millions de likes en une nuit. Des marques t'écrivent.",
        "Une vidéo de {a.first} qui tombe du canapé au ralenti est devenue virale. Les commentaires disent « icône », « légende » et « mon père spirituel ».",
      ],
      en: [
        "You posted a pic of {a.first} looking like a depressed accountant. Two million likes overnight. Brands are sliding into your DMs.",
        "A slow-motion video of {a.first} falling off the couch went viral. Comments say “icon”, “legend” and “my spiritual father”.",
      ],
    },
    choices: [
      { label: { fr: 'Ouvrir un compte dédié', en: 'Start a fan account' }, text: { fr: "J'ai créé un compte pour {a.first}. Il a plus d'abonnés que moi en une semaine. Je suis désormais son assistant{|e}.", en: "I started an account for {a.first}. Within a week it had more followers than me. I am now the assistant." }, fx: { followers: 25000, fame: 5, happy: 8, flag: 'lf_petfluencer' }, mood: 'proud' },
      { label: { fr: 'Protéger sa vie privée', en: 'Protect their privacy' }, text: { fr: "J'ai refusé d'exploiter {a.first}. {a:Il|Elle} m'a regardé{|e} comme si je venais de refuser un contrat à six chiffres. Ce qui est le cas.", en: "I refused to exploit {a.first}. I got a look like I'd just turned down a six-figure deal. Which I had." }, fx: { karma: 4, rel: 5 } },
    ],
  },
  {
    id: 'lf_pet_brand_deal',
    icon: '🤑',
    cat: 'pet',
    rating: 1,
    actor: 'pet',
    when: { has: 'pet', flag: 'lf_petfluencer' },
    weight: 8,
    once: true,
    scene: { place: 'studio', mood: 'happy', prop: 'camera', fx: 'money' },
    text: {
      fr: [
        "Une marque de croquettes propose un contrat à {a.first}. Une autre, plus louche, propose un partenariat pour du « CBD premium pour animaux ». Le chèque est trois fois plus gros.",
        "Le compte de {a.first} explose. Un agent de Los Angeles veut le représenter. Il porte des lunettes de soleil en intérieur et sent la vodka.",
      ],
      en: [
        "A kibble brand offers {a.first} a contract. A shadier one offers a partnership for “premium pet CBD”. The cheque is three times bigger.",
        "{a.first}'s account is exploding. An agent from LA wants to represent them. He wears sunglasses indoors and smells like vodka.",
      ],
    },
    choices: [
      { label: { fr: 'Contrat croquettes', en: 'Kibble deal' }, text: { fr: "{a.first} est l'égérie des croquettes. Son visage est sur des camions. On m'arrête dans la rue pour me demander comment {a:il|elle} va.", en: "{a.first} is the face of a kibble brand. Billboards, trucks. Strangers stop me in the street to ask how {a.he}'s doing." }, fx: { money: 8000, followers: 20000, happy: 6 }, mood: 'proud' },
      {
        label: { fr: 'Le CBD louche', en: 'The shady CBD' },
        out: [
          { w: 2, text: { fr: "Le chèque était énorme. Les produits étaient de l'herbe du jardin dans des sachets dorés. Mais le chèque était énorme.", en: "The cheque was huge. The product was garden grass in gold pouches. But the cheque was huge." }, fx: { money: 25000, karma: -6, followers: 10000 }, mood: 'happy' },
          { w: 1, text: { fr: "La marque a été démantelée par la police. On a retrouvé le visage de {a.first} sur des preuves. J'ai passé une après-midi en garde à vue avec une litière.", en: "The brand got busted by the police. {a.first}'s face was on the evidence. I spent an afternoon in custody with a litter box." }, fx: { money: 5000, heat: 15, followers: -15000, stress: 12 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Signer avec l’agent', en: 'Sign with the agent' }, text: { fr: "L'agent a pris 40 %, a vendu des NFT de {a.first} et a disparu au Mexique. On garde la gloire. Juste la gloire.", en: "The agent took 40%, sold NFTs of {a.first} and vanished to Mexico. We kept the fame. Just the fame." }, fx: { money: 1500, fame: 6, followers: 30000, happy: -3 } },
    ],
  },
  {
    id: 'lf_adopt_more',
    icon: '🏡',
    cat: 'pet',
    rating: 0,
    when: { has: 'pet', age: [18, 99] },
    weight: 7,
    cooldown: 6,
    scene: { place: 'park', mood: 'love', prop: 'cage' },
    text: {
      fr: [
        "Le refuge fait une journée portes ouvertes. Tu y vas « juste pour regarder ». Tout le monde sait comment ça se termine.",
        "Un collègue « doit se séparer » d'un animal d'urgence, pour des raisons qu'il refuse de détailler. Ton animal actuel aurait bien besoin de compagnie. Ou pas.",
      ],
      en: [
        "The shelter is having an open day. You go “just to look”. Everyone knows how this ends.",
        "A coworker “has to rehome” an animal urgently, for reasons he refuses to explain. Your current pet could use some company. Or not.",
      ],
    },
    choices: [
      { label: { fr: 'Un chat en plus', en: 'Another cat' }, text: { fr: "J'ai pris un chat borgne qui s'appelle Monsieur. Il a pris possession de mon lit dès la première nuit. J'ai déménagé sur le canapé.", en: "I took a one-eyed cat. He seized my bed the first night. I've moved to the couch." }, fx: { happy: 8, newNpc: { role: 'pet', species: 'cat' } }, mood: 'love' },
      { label: { fr: 'Un chien de plus', en: 'Another dog' }, text: { fr: "J'ai adopté un chien qui a peur des feuilles. Les deux animaux se reniflent depuis trois jours. Je crois que c'est un mariage.", en: "I adopted a dog who's afraid of leaves. The two have been sniffing each other for three days. I think it's a wedding." }, fx: { happy: 8, athletic: 2, newNpc: { role: 'pet', species: 'dog' } }, mood: 'happy' },
      { label: { fr: 'Le perroquet', en: 'The parrot' }, text: { fr: "J'ai pris le perroquet. Il connaît quarante mots, dont trente-huit gros mots et le code Wi-Fi de son ancien propriétaire.", en: "I took the parrot. He knows forty words: thirty-eight swear words and his previous owner's Wi-Fi password." }, fx: { happy: 6, newNpc: { role: 'pet', species: 'parrot' } }, mood: 'shock' },
      { label: { fr: 'Le serpent… ou la chèvre', en: 'The snake… or the goat' }, out: [
        { w: 1, text: { fr: "J'ai pris le serpent. Il me regarde dormir. Le soir, je compte les autres animaux. Pour l'instant, le compte est bon.", en: "I took the snake. It watches me sleep. Every night I count the other pets. So far, the numbers add up." }, fx: { happy: 4, stress: 4, newNpc: { role: 'pet', species: 'snake' } }, mood: 'neutral' },
        { w: 1, text: { fr: "J'ai pris la chèvre. Elle a mangé le courrier, un rideau et le permis de construire du voisin. Elle s'appelle Brigitte. C'est ma meilleure amie.", en: "I took the goat. She ate the mail, a curtain and the neighbour's building permit. Her name is Brenda. She's my best friend." }, fx: { happy: 10, newNpc: { role: 'pet', species: 'goat' } }, mood: 'happy' },
      ] },
    ],
  },
  {
    id: 'lf_pet_auto',
    icon: '🐾',
    cat: 'pet',
    rating: 0,
    auto: true,
    actor: 'pet',
    when: { has: 'pet' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "{a.first} a fait ses cinq minutes de folie à 3 h du matin : sprint dans le couloir, saut sur mon visage, retour au calme. Rituel sacré.",
        "{a.first} a passé l'année à dormir sur mes vêtements propres. Uniquement les propres. Jamais les sales.",
      ],
      en: [
        "{a.first} did the nightly 3 a.m. zoomies: sprint down the hall, leap onto my face, back to calm. Sacred ritual.",
        "{a.first} spent the year sleeping on my clean laundry. Only the clean laundry. Never the dirty pile.",
      ],
    },
    fx: { happy: 3, rel: 2 },
  },
  {
    id: 'lf_pet_poop_auto',
    icon: '💩',
    cat: 'pet',
    rating: 2,
    auto: true,
    actor: 'pet',
    when: { has: 'pet', age: [14, 99] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "{a.first} a chié dans ma chaussure pour protester contre le changement de croquettes. J'ai mis la chaussure avant de comprendre. Le pied entier.",
        "{a.first} a eu la diarrhée sur le tapis berbère. J'ai frotté pendant deux heures. Le tapis a maintenant un motif. Il a un nom : « Remords ».",
      ],
      en: [
        "{a.first} shat in my shoe to protest the new kibble. I put the shoe on before I realised. Whole foot.",
        "{a.first} had diarrhoea on the Persian rug. I scrubbed for two hours. The rug has a new pattern now. I call it “Regret”.",
      ],
    },
    fx: { happy: -4, rel: -2, visual: 'poop' },
  },

  // ═════════════════════════════ HOLIDAYS & CELEBRATIONS ═════════════════════════════
  {
    id: 'lf_bday_surprise',
    icon: '🎉',
    cat: 'party',
    rating: 1,
    when: { age: [20, 70], has: 'anyFriend' },
    actor: 'anyFriend',
    weight: 7,
    cooldown: 8,
    scene: { place: 'party', mood: 'party', prop: 'cake', fx: 'confetti' },
    text: {
      fr: [
        "Pour ton anniversaire, {a.first} t'a organisé une fête surprise. Tu ouvres la porte… en peignoir, avec un masque à l'argile et une bouteille de rosé à la main. Trente personnes crient « SURPRISE ».",
        "{a.first} a organisé une fête surprise pour ton anniversaire. Problème : tu as découvert le groupe WhatsApp il y a deux semaines, y compris le message « on l'invite par pitié ».",
      ],
      en: [
        "For your birthday, {a.first} threw you a surprise party. You open the door… in a bathrobe, clay mask on, bottle of rosé in hand. Thirty people yell “SURPRISE”.",
        "{a.first} organised a surprise party for your birthday. Problem: you found the WhatsApp group two weeks ago, including the message “we're only inviting them out of pity”.",
      ],
    },
    choices: [
      { label: { fr: 'Assumer à fond', en: 'Own it' }, text: { fr: "J'ai gardé le peignoir toute la soirée et j'ai fini le rosé au goulot sur la table basse. Légende. Le masque a fissuré pendant le karaoké.", en: "I kept the bathrobe on all night and finished the rosé standing on the coffee table. Legend. The mask cracked during karaoke." }, fx: { happy: 12, rel: 10, health: -3 }, mood: 'party' },
      { label: { fr: 'Faire semblant d’être surpris', en: 'Fake surprise' }, text: { fr: "J'ai joué la surprise comme une actrice de télénovela. Tout le monde y a cru. Sauf celui qui « m'invite par pitié ». Je l'ai fixé toute la soirée.", en: "I acted surprised like a telenovela star. Everyone bought it. Except the pity-invite guy. I stared at him all night." }, fx: { happy: 6, rel: 5, smarts: 1 }, mood: 'happy' },
      { label: { fr: 'Fermer la porte', en: 'Close the door' }, text: { fr: "J'ai refermé la porte et je suis allé{|e} me coucher. Ils ont fait la fête dans le couloir sans moi. J'ai entendu qu'elle était géniale.", en: "I closed the door and went to bed. They partied in the hallway without me. I heard it was great." }, fx: { happy: -4, rel: -15, stress: -5 }, mood: 'sleepy' },
    ],
  },
  {
    id: 'lf_bday_40',
    icon: '4️⃣',
    cat: 'party',
    rating: 0,
    priority: true,
    once: true,
    when: { age: [40, 40] },
    scene: { place: 'home', mood: 'neutral', prop: 'cake' },
    text: {
      fr: [
        "Tu as 40 ans. Ce matin, tu as fait un bruit en te levant du lit. Un vrai bruit, involontaire, venu du dos.",
        "40 ans. Tes amis t'ont offert une canne en plastique « pour rire ». Ton genou, lui, ne rit pas.",
      ],
      en: [
        "You're 40. This morning you made a noise getting out of bed. A real, involuntary noise, from your back.",
        "40. Your friends gave you a plastic walking cane “as a joke”. Your knee is not laughing.",
      ],
    },
    choices: [
      { label: { fr: 'Crise de la quarantaine', en: 'Midlife crisis' }, text: { fr: "J'ai acheté une veste en cuir, un abonnement de muscu et un ukulélé. J'ai utilisé la veste.", en: "I bought a leather jacket, a gym membership and a ukulele. I used the jacket." }, fx: { money: -1500, happy: 8, looks: 2 }, mood: 'party' },
      { label: { fr: 'Accepter avec sagesse', en: 'Accept it gracefully' }, text: { fr: "J'ai accepté mes 40 ans avec sagesse. Je me suis couché{|e} à 21 h 30. C'était merveilleux.", en: "I accepted turning 40 with wisdom. I went to bed at 9:30 p.m. It was wonderful." }, fx: { happy: 4, stress: -8, health: 2 }, mood: 'sleepy' },
      { label: { fr: 'Mentir sur son âge', en: 'Lie about it' }, text: { fr: "Désormais, j'ai 34 ans. Personne ne me croit, mais tout le monde est trop poli pour le dire.", en: "From now on, I'm 34. Nobody believes me, but everyone is too polite to say so." }, fx: { happy: 5, karma: -1 } },
    ],
  },
  {
    id: 'lf_bday_50',
    icon: '5️⃣',
    cat: 'party',
    rating: 1,
    priority: true,
    once: true,
    when: { age: [50, 50] },
    scene: { place: 'hospital', mood: 'shock', prop: 'glove' },
    text: {
      fr: [
        "Joyeux 50 ans ! Ton médecin t'a offert ton cadeau : une coloscopie. Il enfile déjà le gant.",
        "Tu as 50 ans. Tu reçois par la poste, le jour même, une pub pour des obsèques prépayées et un échantillon de crème pour hémorroïdes. L'univers est au courant.",
      ],
      en: [
        "Happy 50th! Your doctor's present: a colonoscopy. He's already snapping on the glove.",
        "You're 50. The same day, the mail brings a prepaid-funeral flyer and a free sample of haemorrhoid cream. The universe knows.",
      ],
    },
    choices: [
      { label: { fr: 'Grosse fête', en: 'Throw a huge party' }, text: { fr: "J'ai fait une fête monstre. J'ai dansé sur Gala, je me suis bloqué le dos sur « Freed from Desire » et j'ai fini la soirée allongé{|e} sur le parquet, heureu{x|se}.", en: "I threw a massive party. Danced like it was 1997, threw my back out to “Freed from Desire” and ended the night lying on the floor, happy." }, fx: { happy: 12, health: -4, money: -2000, disease: 'back_pain' }, mood: 'party' },
      { label: { fr: 'Faire le bilan', en: 'Take stock' }, text: { fr: "J'ai fait le bilan de ma vie avec une bouteille de whisky. Le bilan était mitigé. Le whisky, excellent.", en: "I reviewed my life with a bottle of whisky. The review was mixed. The whisky was excellent." }, fx: { smarts: 3, happy: -2, addiction: ['alcohol', 5] }, mood: 'sad' },
      { label: { fr: 'Faire le check-up', en: 'Get the checkup' }, text: { fr: "J'ai fait la coloscopie. Le médecin a dit « tout est propre ». C'est le plus beau compliment qu'on m'ait fait cette année.", en: "I got the colonoscopy. The doctor said “all clean in there”. Best compliment I got all year." }, fx: { health: 6, happy: 2 }, mood: 'proud' },
    ],
  },
  {
    id: 'lf_bday_60',
    icon: '6️⃣',
    cat: 'party',
    rating: 2,
    priority: true,
    once: true,
    when: { age: [60, 60] },
    scene: { place: 'party', mood: 'shock', prop: 'cake', fx: 'fire' },
    text: {
      fr: [
        "Pour tes 60 ans, la famille a mis toutes les bougies sur le gâteau. 60 bougies. Le détecteur de fumée s'est déclenché, les pompiers sont venus, et tu as soufflé si fort que ton dentier a atterri dans la crème.",
        "60 ans. Pendant le discours de ton petit-neveu, tu as éternué si fort que tu t'es légèrement fait pipi dessus. Devant tout le monde. En pantalon beige.",
      ],
      en: [
        "For your 60th, the family put every candle on the cake. Sixty candles. The smoke alarm went off, the fire brigade showed up, and you blew so hard your dentures landed in the frosting.",
        "60. During your great-nephew's speech, you sneezed so hard you peed a little. In front of everyone. In beige trousers.",
      ],
    },
    choices: [
      { label: { fr: 'Rire de soi', en: 'Laugh it off' }, text: { fr: "J'ai ri. J'ai ri si fort que c'est reparti, un peu. On a mis une serviette sur ma chaise et on a continué la fête. Ça, c'est la famille.", en: "I laughed. Laughed so hard it happened again, a bit. They put a towel on my chair and the party went on. That's family." }, fx: { happy: 10, looks: -2, visual: 'confetti' }, mood: 'happy' },
      { label: { fr: 'Accuser le chien', en: 'Blame the dog' }, text: { fr: "J'ai accusé le chien. Il n'y a pas de chien. Tout le monde a hoché la tête avec une infinie compassion.", en: "I blamed the dog. There is no dog. Everyone nodded with infinite compassion." }, fx: { happy: -4, karma: -1, stress: 6 }, mood: 'shock' },
      { label: { fr: 'Acheter des couches', en: 'Buy adult diapers' }, text: { fr: "J'ai acheté des protections « pour la sérénité ». Le lendemain, j'ai fait du trampoline avec mes petits-enfants sans aucune peur. Liberté.", en: "I bought “peace-of-mind” pads. The next day I jumped on the trampoline with the grandkids, fearless. Freedom." }, fx: { happy: 6, athletic: 2, money: -40 }, mood: 'proud' },
    ],
  },
  {
    id: 'lf_xmas_drama',
    icon: '🎄',
    cat: 'holiday',
    rating: 0,
    when: { age: [14, 99], has: 'family' },
    weight: 8,
    cooldown: 4,
    scene: { place: 'home', mood: 'angry', prop: 'tree' },
    text: {
      fr: [
        "Réveillon de Noël. Entre la dinde et la bûche, ta tante révèle que ton cousin n'est « pas vraiment le fils de son père ». Le cousin a 34 ans et il est en train de découper la dinde.",
        "Noël en famille. La question fuse au moment du fromage : « Et toi, c'est pour quand ? ». Toute la table se tourne vers toi. Même le chat.",
      ],
      en: [
        "Christmas Eve. Between the turkey and the Yule log, your aunt reveals your cousin is “not really his father's son”. The cousin is 34 and currently carving the turkey.",
        "Family Christmas. During the cheese course, the question drops: “So, when's it your turn?”. The whole table turns towards you. Even the cat.",
      ],
    },
    choices: [
      { label: { fr: 'Jouer les médiateurs', en: 'Play peacemaker' }, text: { fr: "J'ai lancé un Trivial Pursuit pour détendre l'ambiance. Il a fini en accusation de triche, un plateau retourné et un oncle qui dort dans sa voiture.", en: "I suggested Trivial Pursuit to calm things down. It ended with cheating accusations, a flipped board and an uncle sleeping in his car." }, fx: { stress: 8, karma: 3, happy: -2 } },
      { label: { fr: 'Sortir le pop-corn', en: 'Grab the popcorn' }, text: { fr: "Je me suis resservi{|e} de la bûche et j'ai profité du spectacle. Meilleur Noël depuis des années. Je n'ai même pas eu à ouvrir de cadeaux.", en: "I grabbed more Yule log and enjoyed the show. Best Christmas in years. I didn't even need presents." }, fx: { happy: 8, weight: 0.02 }, mood: 'happy' },
      { label: { fr: 'Partir en douce', en: 'Sneak out' }, text: { fr: "J'ai prétexté un appel urgent et j'ai fini le réveillon seul{|e} au kebab, avec un type qui m'a raconté sa vie. Franchement ? Plus calme.", en: "I faked an urgent call and finished Christmas Eve alone at a kebab shop, with a guy who told me his life story. Honestly? More peaceful." }, fx: { happy: 3, stress: -6 } },
    ],
  },
  {
    id: 'lf_xmas_gift_fail',
    icon: '🎁',
    cat: 'holiday',
    rating: 0,
    when: { age: [12, 99] },
    weight: 8,
    cooldown: 4,
    scene: { place: 'home', mood: 'neutral', prop: 'gift' },
    text: {
      fr: [
        "Échange de cadeaux. Tu ouvres le tien : un pull avec ta propre tête tricotée dessus. En plus gros. Avec des rennes qui sortent de tes oreilles.",
        "Tu offres à ta belle-sœur le parfum que tu as reçu d'elle l'an dernier. Elle reconnaît le paquet. C'est le même papier. Avec son écriture.",
      ],
      en: [
        "Gift exchange. You open yours: a sweater with your own face knitted on it. Bigger. With reindeer coming out of your ears.",
        "You give your sister-in-law the perfume she gave you last year. She recognises the package. Same wrapping. Her handwriting.",
      ],
    },
    choices: [
      { label: { fr: '« Oh, j’adore ! »', en: '“Oh, I love it!”' }, text: { fr: "J'ai dit « j'adore » avec le sourire d'un otage. On m'a pris en photo. La photo est sur le frigo de toute la famille.", en: "I said “I love it” with a hostage smile. They took a picture. It's now on every family fridge." }, fx: { happy: -2, karma: 2 } },
      { label: { fr: 'Revendre en ligne', en: 'Sell it online' }, text: { fr: "Je l'ai revendu sur Internet. L'acheteur était mon oncle. Il l'a offert à quelqu'un d'autre. Ça tourne.", en: "I sold it online. The buyer was my uncle. He regifted it. The circle continues." }, fx: { money: 25, happy: 3 } },
      { label: { fr: 'Dire la vérité', en: 'Tell the truth' }, text: { fr: "J'ai été honnête. Il y a eu un silence, puis des larmes, puis une interdiction de Noël pour deux ans. Mais je ne recevrai plus de pull.", en: "I was honest. There was a silence, then tears, then a two-year Christmas ban. But no more sweaters." }, fx: { happy: 2, stress: 5, karma: -1 } },
    ],
  },
  {
    id: 'lf_nye_uncle',
    icon: '🥃',
    cat: 'holiday',
    rating: 1,
    when: { age: [16, 99] },
    weight: 8,
    cooldown: 5,
    scene: { place: 'party', mood: 'party', prop: 'champagne' },
    text: {
      fr: [
        "Nouvel An en famille. À 23 h 40, ton oncle Gérard est torse nu, a vidé trois bouteilles de crémant et tente de faire un discours sur « les vraies valeurs ». Il pleure déjà.",
        "Réveillon du 31. Ton oncle complètement bourré te prend à part pour te confier, en postillonnant, qu'il « a toujours su » que tu étais le plus raté de la famille. Mais « avec amour ».",
      ],
      en: [
        "New Year's Eve with family. At 11:40 p.m. Uncle Gary is shirtless, three bottles of bubbly deep, attempting a speech about “real values”. He's already crying.",
        "December 31st. Your hammered uncle pulls you aside to tell you, spitting, that he “always knew” you were the family failure. But “with love”.",
      ],
    },
    choices: [
      { label: { fr: 'Le suivre au bar', en: 'Match his drinking' }, text: { fr: "J'ai bu avec lui. À minuit, on chantait du Johnny sur le toit de la voiture. Réveillé{|e} dans la baignoire avec un chapeau pointu.", en: "I drank with him. At midnight we were singing power ballads on the car roof. Woke up in the bathtub wearing a party hat." }, fx: { happy: 10, health: -5, addiction: ['alcohol', 6] }, mood: 'party' },
      { label: { fr: 'Le filmer', en: 'Film him' }, text: { fr: "J'ai tout filmé. La vidéo est diffusée chaque année au réveillon. Gérard ne revient plus. Ça fait de l'espace.", en: "I filmed everything. The video now plays every New Year's. Uncle Gary doesn't come anymore. More room on the couch." }, fx: { happy: 6, karma: -3, followers: 500 } },
      { label: { fr: 'Le coucher', en: 'Put him to bed' }, text: { fr: "Je l'ai porté jusqu'au canapé. Il m'a vomi sur l'épaule en murmurant « bonne année ». C'est l'intention qui compte.", en: "I carried him to the couch. He puked on my shoulder whispering “happy new year”. It's the thought that counts." }, fx: { karma: 4, happy: -3 }, mood: 'sick' },
    ],
  },
  {
    id: 'lf_nye_auto',
    icon: '🎆',
    cat: 'holiday',
    rating: 0,
    auto: true,
    when: { age: [16, 99] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Bonne résolution du Nouvel An : aller à la salle de sport. J'ai tenu jusqu'au 4 janvier. Le 4 au matin.",
        "Bonne résolution : arrêter le sucre. J'ai fêté ma première semaine sans sucre avec un gâteau.",
      ],
      en: [
        "New Year's resolution: go to the gym. I lasted until January 4th. The morning of the 4th.",
        "New Year's resolution: quit sugar. I celebrated my first sugar-free week with a cake.",
      ],
    },
    fx: { happy: 1, discipline: -2 },
  },
  {
    id: 'lf_halloween_costume',
    icon: '🎃',
    cat: 'holiday',
    rating: 1,
    when: { age: [18, 60] },
    weight: 8,
    cooldown: 4,
    scene: { place: 'party', mood: 'party', prop: 'pumpkin' },
    text: {
      fr: [
        "Soirée Halloween. Tu arrives déguisé{|e}… et tout le monde est en tenue normale. C'était une soirée « cocktail chic ». Le message était dans le mail que tu n'as pas lu.",
        "Halloween. Tu dois choisir un costume. Le magasin n'a plus que trois options : « infirmière sexy », « banane gonflable » et « Ministre de l'Intérieur ».",
      ],
      en: [
        "Halloween party. You show up in costume… and everyone's in normal clothes. It was a “cocktail chic” evening. It said so in the email you didn't read.",
        "Halloween. You need a costume. The store has three options left: “sexy nurse”, “inflatable banana” and “a sitting politician”.",
      ],
    },
    choices: [
      { label: { fr: 'Le costume sexy', en: 'The sexy one' }, text: { fr: "J'ai porté le costume sexy. Trois numéros récoltés, une engueulade avec un vrai infirmier et une cystite. Bilan positif.", en: "I wore the sexy costume. Three phone numbers, an argument with an actual nurse and a bladder infection. Net positive." }, fx: { happy: 8, looks: 3, health: -2 }, mood: 'love' },
      { label: { fr: 'La banane gonflable', en: 'The inflatable banana' }, text: { fr: "J'étais la banane. Le ventilateur interne a lâché vers minuit. J'ai fini la soirée en banane fanée, assise par terre. On m'a pris pour une métaphore.", en: "I was the banana. The internal fan died around midnight. Spent the rest of the night as a wilted banana, sitting on the floor. People thought I was a metaphor." }, fx: { happy: 6, fame: 1 }, mood: 'happy' },
      { label: { fr: 'Le politicien', en: 'The politician' }, text: { fr: "J'étais déguisé{|e} en ministre. J'ai serré des mains toute la soirée et promis des trucs que je n'ai pas tenus. Plus réaliste que prévu.", en: "I went as a politician. Shook hands all night and made promises I didn't keep. More realistic than planned." }, fx: { happy: 4, karma: -2, smarts: 1 } },
    ],
  },
  {
    id: 'lf_halloween_trash',
    icon: '🩸',
    cat: 'holiday',
    rating: 2,
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 6,
    scene: { place: 'party', mood: 'shock', prop: 'pumpkin', fx: 'gore' },
    text: {
      fr: [
        "Tu as voulu faire un costume « zombie ultra-réaliste » avec du faux sang maison. Recette : sirop de maïs, colorant et un peu trop de confiance en toi. Tu dois traverser la ville comme ça.",
        "Soirée Halloween. Tu creuses ta citrouille avec un couteau électrique « pour gagner du temps ». La lame glisse. Il y a du rouge partout. Les invités applaudissent : ils pensent que c'est fait exprès.",
      ],
      en: [
        "You wanted an “ultra-realistic zombie” costume with homemade fake blood. Recipe: corn syrup, food colouring and too much self-confidence. You have to cross town like this.",
        "Halloween party. You carve your pumpkin with an electric knife “to save time”. The blade slips. There's red everywhere. Guests applaud: they think it's part of the act.",
      ],
    },
    choices: [
      {
        label: { fr: 'Continuer la soirée', en: 'Keep partying' },
        out: [
          { w: 2, text: { fr: "J'ai fait la soirée en pissant le sang. Meilleur costume, premier prix, une bouteille de vodka. J'ai perdu connaissance au moment de la photo. On a gardé le bout de doigt dans un verre à shot.", en: "I partied on while gushing blood. Best costume, first prize, a bottle of vodka. I passed out during the photo. We kept the fingertip in a shot glass." }, fx: { happy: 6, health: -12, disease: 'missing_finger', fame: 2, visual: 'gore' }, mood: 'party' },
          { w: 1, text: { fr: "Le faux sang a attiré toutes les guêpes du quartier. J'ai couru dans la rue en hurlant, couvert{|e} de sirop et d'insectes. Les enfants ont fui. Une mère a appelé un prêtre.", en: "The fake blood attracted every wasp in the neighbourhood. I ran screaming down the street covered in syrup and insects. Children fled. A mother called a priest." }, fx: { health: -6, happy: -5, disease: 'allergies' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Aller aux urgences', en: 'Go to the ER' }, text: { fr: "Aux urgences, personne n'a cru que j'étais vraiment blessé{|e}. J'ai attendu quatre heures entre un Batman ivre et une nonne enceinte. Douze points de suture.", en: "At the ER, nobody believed I was actually hurt. I waited four hours between a drunk Batman and a pregnant nun. Twelve stitches." }, fx: { health: -4, money: -300, stress: 6 }, mood: 'sick' },
    ],
  },
  {
    id: 'lf_valentine',
    icon: '💘',
    cat: 'love',
    rating: 0,
    actor: 'lover',
    when: { has: 'lover', age: [16, 99] },
    weight: 8,
    cooldown: 3,
    scene: { place: 'home', mood: 'love', prop: 'roses', fx: 'hearts' },
    text: {
      fr: [
        "C'est la Saint-Valentin. Tu as complètement oublié. {a.first} te tend un cadeau emballé avec soin. Tu as dix secondes.",
        "Saint-Valentin. {a.first} a réservé un restaurant gastronomique où chaque plat est une mousse servie sur une pierre. Tu as faim, et c'est 200 balles par tête.",
      ],
      en: [
        "It's Valentine's Day. You completely forgot. {a.first} hands you a carefully wrapped gift. You have ten seconds.",
        "Valentine's Day. {a.first} booked a fancy restaurant where every course is a foam served on a rock. You're starving, and it's 200 bucks a head.",
      ],
    },
    choices: [
      { label: { fr: 'Improviser un cadeau', en: 'Improvise a gift' }, text: { fr: "J'ai offert un « bon pour un massage » écrit au dos d'un ticket de caisse. {a.first} a fait semblant d'être touché{a:|e}. J'ai fait semblant d'y croire.", en: "I gave a “voucher for one massage” written on the back of a receipt. {a.first} pretended to be touched. I pretended to believe it." }, fx: { rel: -4, happy: -1 } },
      { label: { fr: 'Avouer l’oubli', en: 'Confess you forgot' }, text: { fr: "J'ai avoué. {a.first} a ri, puis m'a fait payer le resto, le taxi et un collier. L'honnêteté, ça coûte cher.", en: "I confessed. {a.first} laughed, then made me pay for dinner, the cab and a necklace. Honesty is expensive." }, fx: { money: -400, rel: 6, karma: 2 }, mood: 'love' },
      { label: { fr: 'Kebab après le resto', en: 'Kebab after dinner' }, text: { fr: "Après les mousses sur pierre, on est allés manger un kebab sur un banc, main dans la main. Le plus beau moment de la soirée. Et le moins cher.", en: "After the foam-on-rocks, we got a kebab on a bench, holding hands. Best moment of the night. And the cheapest." }, fx: { money: -200, rel: 12, happy: 8 }, mood: 'love' },
    ],
  },
  {
    id: 'lf_valentine_trash',
    icon: '🌹',
    cat: 'love',
    rating: 2,
    actor: 'lover',
    when: { has: 'lover', age: [18, 99] },
    weight: 6,
    cooldown: 5,
    scene: { place: 'home', mood: 'shock', prop: 'candles', fx: 'fire' },
    text: {
      fr: [
        "Pour la Saint-Valentin, tu as préparé une surprise pour {a.first} : pétales de rose sur le lit, 80 bougies, et toi nu{|e} au milieu. Tu as oublié que les rideaux sont en polyester.",
        "{a.first} t'a offert pour la Saint-Valentin un « coffret coquin » acheté sur un site chinois. La notice est en cyrillique et un des objets vibre si fort que la vaisselle tremble.",
      ],
      en: [
        "For Valentine's, you prepared a surprise for {a.first}: rose petals on the bed, 80 candles, and you naked in the middle. You forgot the curtains are polyester.",
        "{a.first} got you a “naughty box” from a sketchy overseas website for Valentine's. The manual is in Cyrillic and one item vibrates so hard the dishes rattle.",
      ],
    },
    choices: [
      {
        label: { fr: 'Foncer quand même', en: 'Go for it anyway' },
        out: [
          { w: 2, text: { fr: "Les rideaux ont pris feu au moment crucial. Les pompiers sont arrivés, j'avais encore une plume dans les fesses. Le capitaine a dit « on a déjà vu pire ». Il mentait.", en: "The curtains caught fire at the crucial moment. The firefighters arrived; I still had a feather in my butt. The captain said “we've seen worse”. He was lying." }, fx: { happy: -4, rel: 8, money: -1200, visual: 'fire' }, mood: 'shock' },
          { w: 2, text: { fr: "Nuit légendaire. Le voisin du dessous a laissé un mot : « Bravo. Mais le lustre est tombé. » Je l'ai encadré à côté du lit.", en: "Legendary night. The downstairs neighbour left a note: “Bravo. But my chandelier fell.” I framed it next to the bed." }, fx: { happy: 12, rel: 15, stress: -10 }, mood: 'love' },
          { w: 1, text: { fr: "L'objet chinois a fait sauter les plombs de tout l'immeuble. Trois étages dans le noir. Tout le monde sait d'où ça venait.", en: "The overseas gadget blew the fuses for the whole building. Three floors in darkness. Everyone knows which flat it came from." }, fx: { happy: 4, rel: 5, fame: 1, visual: 'explosion' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Plateau-télé plutôt', en: 'TV dinner instead' }, text: { fr: "On a tout rangé dans un placard et on a mangé des pâtes devant une série. {a.first} s'est endormi{a:|e} avant le générique. C'est ça, l'amour.", en: "We stuffed it all in a cupboard and ate pasta in front of a show. {a.first} fell asleep before the credits. That's love." }, fx: { happy: 4, rel: 4, stress: -4 }, mood: 'sleepy' },
    ],
  },
  {
    id: 'lf_friend_wedding',
    icon: '💒',
    cat: 'party',
    rating: 1,
    actor: 'anyFriend',
    when: { has: 'anyFriend', age: [20, 70] },
    weight: 7,
    cooldown: 4,
    scene: { place: 'castle', mood: 'party', prop: 'cake' },
    text: {
      fr: [
        "{a.first} se marie et t'a demandé de faire le discours. Tu as trois coupes de champagne dans le nez et une anecdote sur son ex qui ne devrait jamais sortir.",
        "Mariage de {a.first}. Tu es à la table 14, « les célibataires », entre un cousin qui vend des cryptos et une tante qui te demande si tu es « toujours toute seule ».",
      ],
      en: [
        "{a.first} is getting married and asked you to give a speech. You're three champagnes deep and have an anecdote about their ex that should never see daylight.",
        "{a.first}'s wedding. You're at table 14, “the singles”, between a cousin who sells crypto and an aunt asking if you're “still all alone”.",
      ],
    },
    choices: [
      { label: { fr: 'L’anecdote interdite', en: 'The forbidden story' }, text: { fr: "J'ai raconté l'histoire de l'ex, de la tente et du camping-car. La mariée a ri. Le marié, non. Ils ont divorcé huit mois plus tard. Je n'y suis pour rien. Un peu.", en: "I told the story of the ex, the tent and the RV. The bride laughed. The groom didn't. They divorced eight months later. Not my fault. A little." }, fx: { happy: 6, rel: -15, fame: 1 }, mood: 'shock' },
      { label: { fr: 'Discours émouvant', en: 'A touching speech' }, text: { fr: "J'ai fait un discours si beau que le DJ a pleuré. {a.first} m'a serré{|e} dans ses bras. J'ai fini sous la table avec le cousin crypto.", en: "I gave a speech so beautiful the DJ cried. {a.first} hugged me. I ended up under the table with the crypto cousin." }, fx: { happy: 8, rel: 15, health: -2 }, mood: 'happy' },
      { label: { fr: 'Draguer à la table 14', en: 'Flirt at table 14' }, text: { fr: "J'ai dragué tout ce qui bougeait à la table 14. J'ai fini dans le vestiaire avec un témoin. Nos vestes se sont mélangées. Je porte toujours la sienne.", en: "I flirted with everyone at table 14. Ended up in the cloakroom with a groomsman. Our jackets got mixed up. I still wear his." }, fx: { happy: 10, looks: 1, karma: -1 }, mood: 'love' },
    ],
  },
  {
    id: 'lf_baby_shower',
    icon: '🍼',
    cat: 'party',
    rating: 2,
    actor: 'anyFriend',
    when: { has: 'anyFriend', age: [22, 50] },
    weight: 6,
    cooldown: 5,
    scene: { place: 'home', mood: 'sick', prop: 'diaper', fx: 'poop' },
    text: {
      fr: [
        "Baby shower de {a.first}. Le jeu du jour : deviner la marque de chocolat fondu dans des couches. Tu goûtes la couche n° 4. Ce n'est pas du chocolat. Quelqu'un a confondu avec les couches du vrai bébé de la voisine.",
        "{a.first} organise une baby shower avec gâteau en forme d'utérus, cocktails sans alcool et une prise d'empreinte du ventre au plâtre. Il te reste six heures à tenir, sobre.",
      ],
      en: [
        "{a.first}'s baby shower. Today's game: guess the melted chocolate bar in each diaper. You taste diaper #4. It's not chocolate. Someone mixed them up with the neighbour's actual baby's diapers.",
        "{a.first} is throwing a baby shower: uterus-shaped cake, mocktails and a plaster cast of the belly. You have six sober hours to survive.",
      ],
    },
    choices: [
      { label: { fr: 'Recracher en silence', en: 'Spit discreetly' }, text: { fr: "J'ai recraché dans une serviette et dit « Kinder ? ». J'ai gagné. Le prix : un body. J'ai vomi dedans dans la voiture.", en: "I spat into a napkin and said “Kit Kat?”. I won. The prize: a onesie. I puked in it in the car." }, fx: { health: -5, happy: -6, disease: 'gastro', visual: 'poop' }, mood: 'sick' },
      { label: { fr: 'Corser les cocktails', en: 'Spike the mocktails' }, text: { fr: "J'ai versé une bouteille de vodka dans le punch sans alcool. Les tantes ont dansé sur la table. La future maman était la seule sobre. Elle me déteste et me remercie à la fois.", en: "I poured a bottle of vodka into the mocktail punch. The aunts danced on the table. The mother-to-be was the only sober one. She hates me and thanks me." }, fx: { happy: 10, rel: -6, karma: -3 }, mood: 'party' },
      { label: { fr: 'Offrir un cadeau sincère', en: 'Give a real gift' }, text: { fr: "J'ai offert un tire-lait électrique haut de gamme. {a.first} a pleuré. Je ne saurai jamais si c'était de joie ou de peur.", en: "I gave a top-of-the-line electric breast pump. {a.first} cried. I'll never know if it was joy or fear." }, fx: { money: -250, rel: 12, karma: 3 }, mood: 'happy' },
    ],
  },
  {
    id: 'lf_gender_reveal',
    icon: '💨',
    cat: 'party',
    rating: 1,
    when: { age: [20, 70], has: 'anyFriend' },
    weight: 6,
    once: true,
    scene: { place: 'park', mood: 'shock', prop: 'smoke', fx: 'fire' },
    text: {
      fr: [
        "Tu es invité{|e} à une gender reveal. Le futur papa a commandé un fumigène « qualité militaire » sur Internet. Il est en train de lire la notice à l'envers.",
        "Gender reveal party. Le canon à confettis est relié à une bouteille de gaz « pour l'effet ». Il fait 38 °C, il n'a pas plu depuis deux mois, et il y a une forêt derrière.",
      ],
      en: [
        "You're invited to a gender reveal. The dad-to-be ordered a “military-grade” smoke bomb online. He's reading the instructions upside down.",
        "Gender reveal party. The confetti cannon is hooked to a gas canister “for effect”. It's 100 °F, it hasn't rained in two months, and there's a forest right behind.",
      ],
    },
    choices: [
      { label: { fr: 'Reculer de 50 mètres', en: 'Step back 50 metres' }, text: { fr: "J'ai reculé. Ça a explosé rose, puis orange, puis la forêt. On a vu le résultat depuis l'espace. C'est une fille, et trois hectares en moins.", en: "I stepped back. It exploded pink, then orange, then forest. You could see it from space. It's a girl, and seven fewer acres." }, fx: { happy: 4, smarts: 2, visual: 'fire' }, mood: 'shock' },
      { label: { fr: 'Aider à allumer', en: 'Help light it' }, text: { fr: "J'ai aidé à allumer. J'ai perdu mes sourcils et une partie de ma frange. Mon visage a désormais une expression de surprise permanente. C'était un garçon.", en: "I helped light it. Lost my eyebrows and half my fringe. My face is now permanently surprised. It was a boy." }, fx: { looks: -6, health: -4, disease: 'burns', visual: 'explosion' }, mood: 'shock' },
      { label: { fr: 'Prétexter une migraine', en: 'Fake a migraine' }, text: { fr: "J'ai prétexté une migraine. J'ai vu le reste aux infos de 20 h. Je n'ai jamais été aussi content{|e} d'avoir menti.", en: "I faked a migraine. Saw the rest on the evening news. I've never been so glad I lied." }, fx: { happy: 5, karma: -1 } },
    ],
  },
  {
    id: 'lf_xmas_auto',
    icon: '🦃',
    cat: 'holiday',
    rating: 2,
    auto: true,
    when: { age: [16, 99] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "À Noël, mon cousin a vomi les huîtres dans la crèche. Le petit Jésus a été évacué. On l'a retrouvé en mars, derrière le radiateur.",
        "Noël : j'ai mangé tellement de foie gras que j'ai eu une crise de goutte le 26 et une diarrhée le 27. Le 28, j'ai remangé du foie gras.",
      ],
      en: [
        "At Christmas, my cousin puked oysters into the nativity scene. Baby Jesus was evacuated. We found him in March, behind the radiator.",
        "Christmas: I ate so much foie gras I had gout on the 26th and diarrhoea on the 27th. On the 28th I had more foie gras.",
      ],
    },
    fx: { happy: 2, health: -3, weight: 0.02 },
  },
  {
    id: 'lf_fireworks_auto',
    icon: '🎇',
    cat: 'holiday',
    rating: 2,
    auto: true,
    when: { age: [16, 70] },
    weight: 4,
    cooldown: 8,
    text: {
      fr: [
        "Feu d'artifice maison pour la fête nationale. La fusée est partie à l'horizontale. Elle a traversé le barbecue, deux saucisses et le chapeau de mon beau-frère. Il a toujours ses oreilles. Presque.",
        "J'ai tenu une fusée à la main « comme dans les films ». J'ai encore mes dix doigts mais je ne les sens plus que les jours de pluie.",
      ],
      en: [
        "DIY fireworks for the national holiday. The rocket went horizontal. It went through the grill, two sausages and my brother-in-law's hat. He still has his ears. Mostly.",
        "I held a rocket in my hand “like in the movies”. I still have all ten fingers, but I can only feel them when it rains.",
      ],
    },
    fx: { happy: 3, health: -4, visual: 'explosion' },
  },

  // ═════════════════════════════ TRAVEL ═════════════════════════════
  {
    id: 'lf_lost_luggage',
    icon: '🧳',
    cat: 'travel',
    rating: 0,
    when: { age: [18, 99] },
    weight: 8,
    cooldown: 4,
    scene: { place: 'beach', mood: 'angry', prop: 'suitcase' },
    text: {
      fr: [
        "Tu atterris pour une semaine au soleil. Ta valise, elle, est partie à Oulan-Bator. Tu as sur toi un jean, une polaire et un oreiller cervical.",
        "Le tapis à bagages tourne depuis 45 minutes. Il ne reste qu'une valise : la tienne, ouverte, vide, avec un mot qui dit « désolé ».",
      ],
      en: [
        "You land for a week in the sun. Your suitcase, however, went to Ulaanbaatar. You have jeans, a fleece and a neck pillow.",
        "The baggage carousel has been spinning for 45 minutes. One bag left: yours, open, empty, with a note that says “sorry”.",
      ],
    },
    choices: [
      { label: { fr: 'Exiger un dédommagement', en: 'Demand compensation' }, text: { fr: "Après quatorze formulaires et un appel à un centre d'appels au Portugal, la compagnie m'a remboursé 37 €. Et un bon pour un sandwich.", en: "After fourteen forms and a call centre in Portugal, the airline refunded me $40. And a sandwich voucher." }, fx: { money: 40, stress: 10 }, mood: 'angry' },
      { label: { fr: 'Tout racheter sur place', en: 'Buy everything there' }, text: { fr: "J'ai passé la semaine en t-shirt « I ♥ Benidorm » et en short de bain fluo. La valise est revenue le jour du départ. Elle avait l'air reposée.", en: "I spent the week in an “I ♥ Cancún” tee and neon swim shorts. The suitcase showed up the day I left. It looked well-rested." }, fx: { money: -300, happy: 4 }, mood: 'happy' },
      { label: { fr: 'Vivre en polaire', en: 'Live in the fleece' }, text: { fr: "J'ai fait toute la semaine en polaire à 35 °C. J'ai perdu trois kilos d'eau et toute dignité. Les locaux m'appellent « le yéti ».", en: "I spent the whole week in a fleece at 95 °F. Lost six pounds of water and all dignity. The locals call me “the yeti”." }, fx: { health: -3, weight: -0.02, happy: -3 }, mood: 'sick' },
    ],
  },
  {
    id: 'lf_airport_security',
    icon: '🛃',
    cat: 'travel',
    rating: 1,
    when: { age: [18, 99] },
    weight: 7,
    cooldown: 5,
    scene: { place: 'office', mood: 'shock', prop: 'scanner', fx: 'police' },
    text: {
      fr: [
        "Contrôle de sécurité à l'aéroport. Le scanner sonne. L'agent sort de ton bagage à main, devant toute la file, un objet en silicone rose que tu avais complètement oublié.",
        "L'agent de sécurité a l'air de passer une mauvaise journée et toi, tu as un pot de confiture de 500 g dans ton sac. Il enfile un gant d'un geste lent.",
      ],
      en: [
        "Airport security. The scanner beeps. In front of the whole line, the officer pulls from your carry-on a pink silicone object you had completely forgotten about.",
        "The security officer is clearly having a bad day, and you have a 500 g jar of jam in your bag. He slowly snaps on a glove.",
      ],
    },
    choices: [
      { label: { fr: 'Assumer fièrement', en: 'Own it proudly' }, text: { fr: "J'ai dit « c'est pour le stress ». L'agent a hoché la tête avec respect. Un mec dans la file m'a applaudi{|e}. J'ai raté mon avion quand même.", en: "I said “it's for stress”. The officer nodded with respect. A guy in line clapped. I still missed my flight." }, fx: { happy: 2, stress: -2, money: -200 }, mood: 'proud' },
      {
        label: { fr: 'Protester', en: 'Protest' },
        out: [
          { w: 2, text: { fr: "J'ai protesté. Fouille complète en salle privée. Le gant était froid, l'agent silencieux, et la confiture confisquée. Il l'a mangée devant moi.", en: "I protested. Full search in a private room. The glove was cold, the officer silent, and the jam confiscated. He ate it in front of me." }, fx: { happy: -8, stress: 10 }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai tellement protesté que j'ai été inscrit{|e} sur une liste. Je ne sais pas laquelle. Depuis, je suis fouillé{|e} même à la poste.", en: "I protested so much I got put on a list. I don't know which one. Now I get searched even at the post office." }, fx: { heat: 10, stress: 8 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Manger la confiture', en: 'Eat the jam on the spot' }, text: { fr: "J'ai mangé les 500 g de confiture à la cuillère devant la file. Le liquide n'était plus un problème. Mon pancréas, si.", en: "I ate the whole jar of jam with a spoon in front of the line. Liquids were no longer an issue. My pancreas was." }, fx: { health: -3, happy: 3, weight: 0.01 }, mood: 'sick' },
    ],
  },
  {
    id: 'lf_cruise',
    icon: '🚢',
    cat: 'travel',
    rating: 2,
    when: { age: [18, 99], money: [3000, 1e12] },
    weight: 6,
    cooldown: 6,
    scene: { place: 'beach', mood: 'sick', prop: 'ship', fx: 'poop' },
    text: {
      fr: [
        "Croisière de rêve en Méditerranée. Jour 2 : un norovirus se propage à bord. 3 000 passagers, 1 200 toilettes, et un buffet à volonté que personne ne veut quitter.",
        "Ta croisière tout compris tourne au cauchemar : tempête, vagues de dix mètres, et un orchestre qui joue « My Heart Will Go On » pendant que le pont se couvre de vomi.",
      ],
      en: [
        "Dream Mediterranean cruise. Day 2: norovirus spreads on board. 3,000 passengers, 1,200 toilets, and an all-you-can-eat buffet nobody wants to leave.",
        "Your all-inclusive cruise becomes a nightmare: storm, 30-foot waves, and a band playing “My Heart Will Go On” while the deck gets carpeted in vomit.",
      ],
    },
    choices: [
      { label: { fr: 'Se barricader en cabine', en: 'Barricade the cabin' }, text: { fr: "Je me suis enfermé{|e} dans ma cabine avec des chips et du gel hydroalcoolique. J'ai entendu des choses dans le couloir que je n'oublierai jamais. Survécu{|e}.", en: "I locked myself in my cabin with crisps and hand sanitiser. I heard things in that corridor I'll never forget. Survived." }, fx: { happy: -6, stress: 12, money: -2500 }, mood: 'shock' },
      {
        label: { fr: 'Profiter du buffet', en: 'Hit the buffet' },
        out: [
          { w: 2, text: { fr: "J'ai mangé au buffet vide comme un roi. Deux jours plus tard, j'ai repeint la cabine des deux côtés à la fois. Le steward a démissionné.", en: "I ate like a king at the empty buffet. Two days later I repainted the cabin from both ends at once. The steward resigned." }, fx: { health: -10, money: -2500, disease: 'gastro', visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: "Estomac en titane : seul{|e} au buffet pendant une semaine, homards à volonté. J'ai pris quatre kilos. Le capitaine m'a nommé{|e} « passager de l'année ».", en: "Iron stomach: alone at the buffet for a week, unlimited lobster. I gained nine pounds. The captain named me “passenger of the year”." }, fx: { happy: 10, weight: 0.04, money: -2500 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Exiger un remboursement', en: 'Demand a refund' }, text: { fr: "J'ai menacé la compagnie d'un procès en direct sur TikTok. Ils m'ont remboursé à moitié et offert une autre croisière. Je ne la prendrai jamais.", en: "I threatened the cruise line with a lawsuit live on TikTok. They refunded half and offered another cruise. I will never take it." }, fx: { money: -1200, followers: 2000, stress: 6 }, mood: 'angry' },
    ],
  },
  {
    id: 'lf_safari',
    icon: '🦛',
    cat: 'travel',
    rating: 2,
    when: { age: [18, 90], money: [5000, 1e12] },
    weight: 5,
    cooldown: 8,
    scene: { place: 'park', mood: 'shock', prop: 'jeep', fx: 'gore' },
    text: {
      fr: [
        "Safari au Kenya. Le guide dit de ne surtout pas sortir de la jeep. Un touriste allemand sort de la jeep pour faire un selfie avec un hippopotame.",
        "Safari de luxe. La nuit, sous ta tente, quelque chose renifle la toile. Quelque chose de gros. Avec une haleine de zèbre.",
      ],
      en: [
        "Safari in Kenya. The guide says never leave the jeep. A German tourist leaves the jeep to take a selfie with a hippo.",
        "Luxury safari. At night, in your tent, something sniffs the canvas. Something big. With zebra breath.",
      ],
    },
    choices: [
      { label: { fr: 'Filmer la scène', en: 'Film it' }, text: { fr: "J'ai filmé. L'hippopotame a ouvert la gueule et l'Allemand est devenu deux Allemands, puis aucun. Le guide a soupiré : « Chaque saison. » La vidéo a été retirée de partout sauf de mon cerveau.", en: "I filmed it. The hippo opened its jaws and the German became two Germans, then none. The guide sighed: “Every season.” The video got taken down everywhere except my brain." }, fx: { happy: -6, stress: 12, disease: 'ptsd', visual: 'gore' }, mood: 'shock' },
      {
        label: { fr: 'Sortir de la tente', en: 'Step out of the tent' },
        out: [
          { w: 3, text: { fr: "C'était un phacochère. Il m'a regardé{|e}, a pété, et il est parti. J'ai dormi dans la jeep.", en: "It was a warthog. It looked at me, farted, and left. I slept in the jeep." }, fx: { happy: 2, stress: 5 }, mood: 'neutral' },
          { w: 1, text: { fr: "C'était un lion. Il a pris mon bras en souvenir. Le reste de moi a été rapatrié en business, enfin.", en: "It was a lion. It took my arm as a souvenir. The rest of me finally got flown home in business class." }, fx: { die: { fr: 'dévoré{|e} par un lion pendant un safari « tout confort »', en: 'eaten by a lion on a “luxury” safari' }, visual: 'gore' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Faire le mort', en: 'Play dead' }, text: { fr: "J'ai fait le mort toute la nuit. Le matin, la bête était partie et j'avais uriné dans mon sac de couchage. Le sac est resté au Kenya.", en: "I played dead all night. By morning the beast was gone and I'd peed in my sleeping bag. The bag stayed in Kenya." }, fx: { happy: -3, stress: 8, money: -5000 }, mood: 'shock' },
    ],
  },
  {
    id: 'lf_paris_syndrome',
    icon: '🗼',
    cat: 'travel',
    rating: 0,
    when: { age: [18, 99] },
    weight: 6,
    cooldown: 8,
    scene: { place: 'park', mood: 'sad', prop: 'tower' },
    text: {
      fr: [
        "Tu visites enfin Paris. Le serveur t'a méprisé{|e} en trois langues, un pigeon t'a chié sur l'épaule et quelqu'un t'a vendu une Tour Eiffel lumineuse qui ne s'allume pas. Tu ressens un vide immense.",
        "Voyage romantique à Paris. Il pleut, le métro sent l'urine et le croissant coûte 3,80 €. Tu fais une crise de « syndrome de Paris » au pied de Montmartre.",
      ],
      en: [
        "You finally visit Paris. The waiter despised you in three languages, a pigeon pooped on your shoulder and someone sold you a light-up Eiffel Tower that doesn't light up. You feel an immense void.",
        "Romantic trip to Paris. It's raining, the metro smells like pee and a croissant costs $4. You have a full-blown “Paris syndrome” breakdown at the foot of Montmartre.",
      ],
    },
    choices: [
      { label: { fr: 'Rentrer dépité{|e}', en: 'Go home crushed' }, text: { fr: "Je suis rentré{|e} plus tôt. J'ai regardé « Ratatouille » pour me consoler. C'était mieux en dessin animé.", en: "I went home early. Watched “Ratatouille” to feel better. It was better as a cartoon." }, fx: { happy: -6, money: -800 }, mood: 'sad' },
      { label: { fr: 'Devenir parisien{|ne}', en: 'Become Parisian' }, text: { fr: "J'ai acheté un béret, j'ai commencé à soupirer et à mépriser les touristes. En trois jours, j'étais plus parisien{|ne} que les Parisiens.", en: "I bought a beret and started sighing and despising tourists. In three days I was more Parisian than the Parisians." }, fx: { happy: 6, looks: 2, karma: -2 }, mood: 'proud' },
      { label: { fr: 'Manger jusqu’à guérir', en: 'Eat until it passes' }, text: { fr: "Fromage, vin, baguette, pâtisseries. Le syndrome est passé au bout de la quatrième boulangerie. Le cholestérol, non.", en: "Cheese, wine, baguettes, pastries. The syndrome passed by the fourth bakery. The cholesterol didn't." }, fx: { happy: 10, weight: 0.03, health: -2 }, mood: 'happy' },
    ],
  },
  {
    id: 'lf_vegas_wedding',
    icon: '💍',
    cat: 'travel',
    rating: 1,
    when: { age: [21, 70], noHas: ['spouse'], noFlag: 'lf_vegas_wed' },
    actor: { create: { role: 'acquaintance', age: [-8, 8], gender: 'attracted' } },
    weight: 5,
    cooldown: 10,
    scene: { place: 'casino', mood: 'party', prop: 'ring', fx: 'hearts' },
    text: {
      fr: [
        "Week-end à Las Vegas. Tu te réveilles dans une suite qui n'est pas la tienne, avec une alliance au doigt et {a.first} qui ronfle à côté. Il y a une photo d'Elvis sur la table de nuit. Elvis est sur la photo avec vous.",
        "3 h du matin à Vegas. Tu as gagné 2 000 $ au craps et {a.first}, rencontré{a:|e} il y a quatre heures, te propose de vous marier « dans la chapelle drive-in, pour rire ».",
      ],
      en: [
        "Weekend in Vegas. You wake up in a suite that isn't yours, a wedding ring on your finger and {a.first} snoring next to you. There's a photo of Elvis on the nightstand. Elvis is in the photo with you.",
        "3 a.m. in Vegas. You've just won $2,000 at craps and {a.first}, whom you met four hours ago, suggests getting married “at the drive-thru chapel, for a laugh”.",
      ],
    },
    choices: [
      { label: { fr: 'Rester marié{|e}', en: 'Stay married' }, text: { fr: "On a décidé de rester mariés. Pourquoi pas ? On ne connaît pas nos noms de famille, mais Elvis a dit que c'était pour la vie.", en: "We decided to stay married. Why not? We don't know each other's last names, but Elvis said it was forever." }, fx: { happy: 10, actorRole: 'spouse', flag: 'lf_vegas_wed', schedule: { key: 'lf_vegas_aftermath', years: 1 } }, mood: 'love' },
      { label: { fr: 'Annuler en vitesse', en: 'Annul it fast' }, text: { fr: "Annulation express à 9 h du matin. Le juge était le même Elvis, en peignoir. Il m'a facturé le double « pour la peine ».", en: "Express annulment at 9 a.m. The judge was the same Elvis, in a bathrobe. He charged me double “for the heartbreak”." }, fx: { money: -600, happy: -2 }, mood: 'neutral' },
      { label: { fr: 'Fuir par la fenêtre', en: 'Escape through the window' }, rating: 2, text: { fr: "J'ai fui par la fenêtre de la salle de bain en slip, avec une seule chaussure. J'ai traversé le Strip comme ça. Un touriste japonais m'a donné 5 $ et pris en photo. Je suis toujours marié{|e}, quelque part.", en: "I escaped through the bathroom window in my underwear, one shoe on. Crossed the Strip like that. A tourist gave me $5 and a photo. I'm still married, somewhere." }, fx: { happy: 4, money: 5, fame: 1, karma: -3 }, mood: 'shock' },
    ],
  },
  {
    id: 'lf_vegas_aftermath',
    icon: '📜',
    cat: 'love',
    rating: 1,
    chainOnly: true,
    actor: 'spouse',
    when: { flag: 'lf_vegas_wed', has: 'spouse' },
    scene: { place: 'home', mood: 'neutral', prop: 'papers' },
    text: {
      fr: [
        "Un an après Vegas, toujours marié{|e} à {a.first}. Tu viens de découvrir qu'{a:il|elle} a un casier, trois enfants au Nevada et une phobie des fourchettes.",
        "Un an que tu es marié{|e} à {a.first}, rencontré{a:|e} ivre à Vegas. Étonnamment, ça marche. Enfin, ça marche comme une Twingo de 2003 : en faisant du bruit.",
      ],
      en: [
        "One year after Vegas, still married to {a.first}. You just found out about a criminal record, three kids in Nevada and a phobia of forks.",
        "One year married to {a.first}, met blackout drunk in Vegas. Surprisingly, it works. Well, it works like a 2003 hatchback: noisily.",
      ],
    },
    choices: [
      { label: { fr: 'Renouveler les vœux', en: 'Renew the vows' }, text: { fr: "On a renouvelé nos vœux, sobres cette fois. C'était moins drôle mais plus sincère. Elvis n'était pas dispo, on a pris un sosie de Michel Sardou.", en: "We renewed our vows, sober this time. Less fun, more sincere. Elvis wasn't available, so we got a Tom Jones impersonator." }, fx: { happy: 10, rel: 20 }, mood: 'love' },
      { label: { fr: 'Divorcer', en: 'Divorce' }, text: { fr: "On a divorcé à l'amiable. Enfin, presque : {a.first} a gardé le grille-pain et ma dignité. On se souhaite les anniversaires.", en: "We divorced amicably. Mostly: {a.first} kept the toaster and my dignity. We still text on birthdays." }, fx: { money: -3000, happy: -4, actorRole: 'ex', unflag: 'lf_vegas_wed' }, mood: 'sad' },
    ],
  },
  {
    id: 'lf_timeshare',
    icon: '🏝️',
    cat: 'travel',
    rating: 0,
    when: { age: [25, 99], money: [2000, 1e12] },
    vars: { amount: [4000, 15000] },
    weight: 6,
    cooldown: 8,
    scene: { place: 'villa', mood: 'neutral', prop: 'brochure' },
    text: {
      fr: [
        "En vacances, un type souriant t'offre un cocktail et une « présentation de 20 minutes ». Six heures plus tard, il te tend un contrat de multipropriété à {$amount} pour une semaine par an à Torremolinos. En février.",
        "On t'a offert un séjour gratuit. La seule condition : écouter un commercial. Il s'appelle Kevin, il ne cligne jamais des yeux et il a verrouillé la porte.",
      ],
      en: [
        "On vacation, a smiling guy offers you a cocktail and a “20-minute presentation”. Six hours later, he hands you a {$amount} timeshare contract for one week a year in a resort town. In February.",
        "You won a free stay. The only condition: listen to a salesman. His name is Kevin, he never blinks, and he's locked the door.",
      ],
    },
    choices: [
      { label: { fr: 'Signer pour sortir', en: 'Sign to escape' }, text: { fr: "J'ai signé pour qu'on me laisse partir. Je suis propriétaire d'une semaine dans un studio qui sent le chlore et les regrets. Pour toujours. Même mes enfants en hériteront.", en: "I signed just to be let out. I now own one week in a studio that smells of chlorine and regret. Forever. My children will inherit it." }, fx: { money: '-amount', happy: -8, smarts: -2 }, mood: 'sad' },
      { label: { fr: 'Le contre-arnaquer', en: 'Out-scam him' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai bu tous les cocktails gratuits, mangé le buffet, et à la fin j'ai essayé de vendre mon assurance-vie à Kevin. Il a signé.", en: "I drank every free cocktail, ate the buffet, and at the end I sold Kevin a life insurance policy. He signed." }, fx: { money: 500, happy: 8, smarts: 2 }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai voulu jouer au plus malin. Kevin est un professionnel. Je suis reparti{|e} avec deux semaines au lieu d'une.", en: "I tried to outsmart him. Kevin is a professional. I left with two weeks instead of one." }, fx: { money: -8000, happy: -10 }, mood: 'shock' },
      ] },
      { label: { fr: 'Simuler un malaise', en: 'Fake a medical emergency' }, text: { fr: "J'ai simulé une crise cardiaque. Kevin a appelé l'ambulance… et a essayé de vendre une multipropriété aux ambulanciers. J'ai fui pendant ce temps-là.", en: "I faked a heart attack. Kevin called an ambulance… and pitched a timeshare to the paramedics. I escaped while he was at it." }, fx: { happy: 5, stress: -2, karma: -1 }, mood: 'happy' },
    ],
  },
  {
    id: 'lf_travel_diarrhea',
    icon: '🌮',
    cat: 'travel',
    rating: 2,
    when: { age: [18, 99] },
    weight: 7,
    cooldown: 5,
    scene: { place: 'beach', mood: 'sick', prop: 'toilet', fx: 'poop' },
    text: {
      fr: [
        "Tu as mangé un taco de rue « authentique » au Mexique. Deux heures plus tard, ton intestin a déclaré l'indépendance. Tu es dans un bus de six heures sans toilettes.",
        "Vacances en Inde : tu as bu l'eau du robinet « juste une gorgée ». Le Delhi Belly arrive au moment précis où tu visites le Taj Mahal, en pantalon blanc.",
      ],
      en: [
        "You ate an “authentic” street taco in Mexico. Two hours later, your bowels declared independence. You're on a six-hour bus with no toilet.",
        "Holiday in India: you drank tap water, “just one sip”. Delhi belly strikes at the exact moment you're touring the Taj Mahal, in white trousers.",
      ],
    },
    choices: [
      {
        label: { fr: 'Serrer les fesses', en: 'Clench and pray' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: "J'ai tenu six heures. Six. Je transpirais, je priais, je parlais à Dieu en espagnol. J'ai atteint les toilettes de la gare en hurlant de joie. Mon plus grand exploit sportif.", en: "I held it for six hours. Six. I sweated, I prayed, I spoke to God in Spanish. I made it to the station toilet screaming with joy. My greatest athletic achievement." }, fx: { discipline: 6, happy: 6, athletic: 2 }, mood: 'proud' },
          { w: 2, text: { fr: "J'ai lâché au kilomètre 214. Dans le silence le plus total. Le bus entier s'est retourné. Une grand-mère s'est signée. Le chauffeur m'a fait descendre en plein désert.", en: "I lost the battle at mile 133. In complete silence. The entire bus turned around. A grandmother crossed herself. The driver dropped me off in the middle of the desert." }, fx: { happy: -12, health: -6, disease: 'food_poisoning', visual: 'poop' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Demander l’arrêt d’urgence', en: 'Demand an emergency stop' }, text: { fr: "J'ai supplié le chauffeur. Il s'est arrêté au bord d'un champ de maïs. Quarante passagers m'ont regardé{|e} faire, accroupi{|e}, sans le moindre buisson. Un fermier a pris une photo.", en: "I begged the driver. He stopped by a cornfield. Forty passengers watched me squat with no bush in sight. A farmer took a picture." }, fx: { happy: -8, health: -3, looks: -2, visual: 'poop' }, mood: 'shock' },
      { label: { fr: 'Les médicaments', en: 'Take the meds' }, text: { fr: "J'ai avalé une boîte entière d'anti-diarrhéiques. Ça a marché. Trop bien. Je n'ai plus été aux toilettes pendant neuf jours. J'ai ramené le Mexique dans mes intestins.", en: "I swallowed an entire box of anti-diarrhoea pills. It worked. Too well. I didn't go for nine days. I brought Mexico home inside me." }, fx: { health: -4, happy: -3 }, mood: 'sick' },
    ],
  },
  {
    id: 'lf_hike_lost',
    icon: '🥾',
    cat: 'travel',
    rating: 2,
    when: { age: [18, 80] },
    weight: 6,
    cooldown: 6,
    scene: { place: 'park', mood: 'shock', prop: 'backpack' },
    text: {
      fr: [
        "Randonnée « facile, 2 h » d'après l'appli. Neuf heures plus tard, tu es perdu{|e} en forêt sans réseau, avec une barre de céréales et un demi-litre d'eau. La nuit tombe.",
        "Tu as quitté le sentier balisé « pour un raccourci ». Ça fait deux jours. Tu as mangé une baie violette inconnue et tu parles maintenant à un écureuil qui s'appelle Bernard.",
      ],
      en: [
        "“Easy, 2-hour” hike according to the app. Nine hours later you're lost in the woods with no signal, one granola bar and half a litre of water. Night is falling.",
        "You left the marked trail “for a shortcut”. That was two days ago. You ate an unknown purple berry and now you talk to a squirrel named Bernard.",
      ],
    },
    choices: [
      {
        label: { fr: 'Boire son urine', en: 'Drink your own pee' },
        out: [
          { w: 2, text: { fr: "J'ai bu mon urine comme Bear Grylls. Ça n'avait rien d'héroïque. Les secours m'ont trouvé{|e} deux heures plus tard, à 300 mètres du parking, la bouche pleine de regrets.", en: "I drank my own pee like Bear Grylls. Nothing heroic about it. Rescuers found me two hours later, 300 yards from the parking lot, mouth full of regret." }, fx: { happy: -6, health: -3, fame: 1 }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai survécu quatre jours. Je suis ressorti{|e} de la forêt hirsute, sauvage, avec une couronne de feuilles. Les médias m'appellent « l'homme des bois ». Bernard me manque.", en: "I survived four days. Came out of the forest feral, with a crown of leaves. The media call me “the wild one”. I miss Bernard." }, fx: { fame: 6, athletic: 6, health: -8, followers: 8000 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Suivre l’écureuil', en: 'Follow the squirrel' }, text: { fr: "J'ai suivi Bernard. Il m'a mené{|e} jusqu'à un camping. Personne ne me croit. Les baies m'ont fait halluciner pendant trois jours. Bernard aussi, peut-être.", en: "I followed Bernard. He led me to a campsite. Nobody believes me. The berries made me trip for three days. Maybe Bernard too." }, fx: { happy: 6, health: -4, smarts: -2 }, mood: 'happy' },
      { label: { fr: 'Appeler les secours', en: 'Call for rescue' }, text: { fr: "J'ai trouvé une barre de réseau en haut d'un arbre. L'hélico est venu. La facture aussi : héliportage, 4 200 €. Le pilote a pris une photo pour son Insta.", en: "I found one bar of signal at the top of a tree. The helicopter came. So did the bill: $4,500. The pilot took a selfie for his Insta." }, fx: { money: -4500, stress: 8, health: -2 }, mood: 'neutral' },
    ],
  },
  {
    id: 'lf_volcano',
    icon: '🌋',
    cat: 'travel',
    rating: 2,
    when: { age: [18, 85] },
    weight: 4,
    cooldown: 10,
    scene: { place: 'beach', mood: 'shock', prop: 'volcano', fx: 'fire' },
    text: {
      fr: [
        "Excursion sur un volcan actif en Islande. Le guide t'interdit d'approcher la coulée. Il est parti pisser. La lave est vraiment, vraiment jolie de près.",
        "Pendant ton voyage à Hawaï, le volcan se réveille. Les sirènes hurlent. Un touriste à côté de toi essaie de faire griller une saucisse sur la lave avec un bâton de selfie.",
      ],
      en: [
        "Excursion to an active volcano in Iceland. The guide says don't go near the flow. He went off to pee. The lava is really, really pretty up close.",
        "During your trip to Hawaii, the volcano wakes up. Sirens wail. A tourist next to you is trying to roast a hot dog on the lava with a selfie stick.",
      ],
    },
    choices: [
      {
        label: { fr: 'Approcher pour la photo', en: 'Get closer for the photo' },
        out: [
          { w: 3, text: { fr: "J'ai eu la photo du siècle. J'ai aussi perdu mes semelles, qui ont fondu, et mes sourcils, qui ont pris feu. 200 000 likes.", en: "I got the photo of the century. I also lost my soles, which melted, and my eyebrows, which caught fire. 200,000 likes." }, fx: { followers: 10000, health: -6, looks: -3, disease: 'burns' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai glissé. Il y a eu un « pshhht » très bref, une odeur de bacon et un nuage de vapeur en forme de moi. Le guide a fini sa pause pipi.", en: "I slipped. There was a very brief “pssssht”, a smell of bacon and a steam cloud shaped like me. The guide finished his pee break." }, fx: { die: { fr: 'tombé{|e} dans la lave en voulant faire un selfie', en: 'fell into lava while taking a selfie' }, visual: 'fire' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Griller la saucisse aussi', en: 'Roast a hot dog too' }, text: { fr: "J'ai fait griller ma saucisse sur la lave. Elle a été carbonisée en 0,3 seconde, avec le bâton et le bout de ma manche. Meilleur hot-dog de ma vie quand même.", en: "I roasted my hot dog on the lava. Carbonised in 0.3 seconds, along with the stick and the end of my sleeve. Still the best hot dog of my life." }, fx: { happy: 8, health: -2 }, mood: 'happy' },
      { label: { fr: 'Courir au bateau', en: 'Run for the boat' }, text: { fr: "J'ai couru jusqu'au bateau d'évacuation en bousculant une famille entière. J'ai survécu. La famille aussi, mais elle m'a reconnu{|e} sur la vidéo.", en: "I ran for the evacuation boat, shoving an entire family aside. I survived. So did they, but they recognised me in the video." }, fx: { athletic: 3, karma: -6, stress: 10 }, mood: 'shock' },
    ],
  },
  {
    id: 'lf_sunburn_auto',
    icon: '🦞',
    cat: 'travel',
    rating: 0,
    auto: true,
    when: { age: [16, 99] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Je me suis endormi{|e} sur la plage sans crème solaire. Je suis rentré{|e} de vacances avec la marque de mon livre sur le ventre et le teint d'un homard.",
        "Vacances au camping. Il a plu sept jours sur sept. J'ai joué au Uno sous une tente pendant 168 heures. Je connais désormais la haine.",
      ],
      en: [
        "I fell asleep on the beach without sunscreen. Came home with the outline of my book on my belly and the complexion of a lobster.",
        "Camping holiday. It rained seven days out of seven. I played Uno in a tent for 168 hours. I now know true hatred.",
      ],
    },
    fx: { happy: -2, health: -1 },
  },
  {
    id: 'lf_hotel_walls',
    icon: '🏨',
    cat: 'travel',
    rating: 1,
    when: { age: [18, 99] },
    weight: 7,
    cooldown: 5,
    scene: { place: 'apartment', mood: 'sleepy', prop: 'bed' },
    text: {
      fr: [
        "Hôtel à 39 € la nuit. Les murs sont en papier à cigarette. Le couple d'à côté fait l'amour depuis deux heures avec la régularité d'un métronome et le volume d'un stade.",
        "Ta chambre d'hôtel a des punaises de lit. Tu le découvres à 3 h du matin, en voyant ton oreiller bouger tout seul.",
      ],
      en: [
        "A $39-a-night hotel. The walls are made of rolling paper. The couple next door has been going at it for two hours with the rhythm of a metronome and the volume of a stadium.",
        "Your hotel room has bed bugs. You find out at 3 a.m. when you see your pillow moving on its own.",
      ],
    },
    choices: [
      { label: { fr: 'Taper au mur', en: 'Bang on the wall' }, text: { fr: "J'ai tapé au mur. Ils ont pris ça pour des encouragements et ont accéléré. J'ai dormi dans la baignoire avec des boules Quies.", en: "I banged on the wall. They took it as encouragement and sped up. I slept in the bathtub with earplugs." }, fx: { happy: -4, stress: 6, health: -1 }, mood: 'sleepy' },
      { label: { fr: 'Faire pareil, plus fort', en: 'Retaliate, louder' }, if: { has: 'lover' }, text: { fr: "On a répondu. Plus fort. Ça a tourné au concours. Au petit-déjeuner, tout l'étage nous a regardés en silence. Le couple d'à côté nous a salués avec respect.", en: "We responded. Louder. It turned into a contest. At breakfast, the whole floor stared at us in silence. The couple next door nodded with respect." }, fx: { happy: 10, stress: -6, karma: -1 }, mood: 'love' },
      { label: { fr: 'Exiger une autre chambre', en: 'Demand a new room' }, text: { fr: "Le réceptionniste m'a changé de chambre. Dans la nouvelle, des punaises de lit. J'ai ramené des passagers clandestins à la maison. Ils vont bien, merci.", en: "The receptionist moved me. The new room had bed bugs. I brought stowaways home. They're doing great, thanks." }, fx: { happy: -6, money: -500, stress: 8 }, mood: 'angry' },
    ],
  },
  {
    id: 'lf_seagull_attack',
    icon: '🐦',
    cat: 'travel',
    rating: 2,
    when: { age: [14, 99] },
    weight: 6,
    cooldown: 6,
    scene: { place: 'beach', mood: 'angry', prop: 'sandwich', fx: 'gore' },
    text: {
      fr: [
        "Sur la plage, tu déballes un sandwich jambon-beurre. Une mouette de la taille d'un caniche fond sur toi en piqué, les yeux remplis de haine.",
        "Une bande de mouettes a repéré tes frites. Elles se positionnent en formation. L'une d'elles a un œil en moins et clairement plus rien à perdre.",
      ],
      en: [
        "On the beach, you unwrap a ham sandwich. A seagull the size of a poodle dive-bombs you, eyes full of hatred.",
        "A gang of seagulls has spotted your fries. They're forming up. One of them is missing an eye and clearly has nothing left to lose.",
      ],
    },
    choices: [
      {
        label: { fr: 'Défendre son repas', en: 'Defend your lunch' },
        out: [
          { w: 2, text: { fr: "J'ai combattu. La mouette m'a arraché le sandwich, un morceau de lobe d'oreille et ma dignité, puis m'a chié dessus en s'envolant. Ça pissait le sang. Les enfants applaudissaient la mouette.", en: "I fought. The gull took the sandwich, a chunk of earlobe and my dignity, then shat on me as it flew off. Blood everywhere. The kids cheered for the gull." }, fx: { health: -5, happy: -6, looks: -2, visual: 'gore' }, mood: 'angry' },
          { w: 1, odds: { athletic: 1 }, text: { fr: "Je l'ai attrapée au vol d'un revers de serviette. Elle s'est écrasée dans le sable, sonnée. Ses copines ont battu en retraite. Je suis le roi de la plage. Une association m'a porté plainte.", en: "I swatted it out of the air with a towel. It crashed in the sand, dazed. Its friends retreated. I am king of the beach. An animal charity filed a complaint." }, fx: { happy: 8, athletic: 2, karma: -3 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Sacrifier les frites', en: 'Sacrifice the fries' }, text: { fr: "J'ai lancé les frites au loin pour faire diversion. Ça a déclenché une guerre civile entre mouettes. Trois morts, des plumes partout. J'ai mangé mon sandwich en paix.", en: "I threw the fries far away as a diversion. It sparked a seagull civil war. Three dead, feathers everywhere. I ate my sandwich in peace." }, fx: { happy: 5, smarts: 2 }, mood: 'happy' },
    ],
  },

  // ═════════════════════════════ NEIGHBOURS ═════════════════════════════
  {
    id: 'lf_noisy_neighbour',
    icon: '🔊',
    cat: 'neighbour',
    rating: 2,
    when: { age: [18, 99], movedOut: true },
    weight: 8,
    cooldown: 5,
    scene: { place: 'apartment', mood: 'angry', prop: 'speaker' },
    text: {
      fr: [
        "Le voisin du dessus fait des squats à 5 h du mat', passe l'aspirateur à minuit et chante du Lara Fabian sous la douche. Faux. Avec émotion.",
        "Tous les soirs à 23 h, le lit du voisin cogne contre ton mur. Toujours 4 minutes. Toujours suivi d'un « pardon » étouffé.",
      ],
      en: [
        "The upstairs neighbour does squats at 5 a.m., vacuums at midnight and sings Céline Dion in the shower. Off-key. With feeling.",
        "Every night at 11 p.m., the neighbour's bed bangs against your wall. Always 4 minutes. Always followed by a muffled “sorry”.",
      ],
    },
    choices: [
      { label: { fr: 'Mot passif-agressif', en: 'Passive-aggressive note' }, text: { fr: "J'ai laissé un mot dans le hall : « Certains travaillent. Merci de votre compréhension. » Le lendemain, quelqu'un avait écrit en dessous : « Pas toi apparemment ». Guerre ouverte.", en: "I left a note in the lobby: “Some of us work. Thank you for your understanding.” Next day someone had written underneath: “Not you apparently”. Open war." }, fx: { stress: 8, happy: -3 }, mood: 'angry' },
      { label: { fr: 'Aller frapper', en: 'Knock on the door' }, text: { fr: "J'ai frappé. Le voisin a ouvert en serviette, en sueur, très gêné. On a fini par boire une bière ensemble. Il fait toujours du bruit, mais maintenant on s'aime bien.", en: "I knocked. The neighbour opened in a towel, sweaty, very embarrassed. We ended up having a beer. He's still loud, but now we like each other." }, fx: { happy: 4, stress: -4, karma: 2 }, mood: 'happy' },
      { label: { fr: 'Applaudir à chaque fois', en: 'Applaud every time' }, text: { fr: "J'ai commencé à applaudir à la fin de chaque séance. Puis à crier des notes : « 6/10, manque d'endurance ». Le bruit a cessé. Pour toujours. Je crois qu'ils ont rompu.", en: "I started applauding at the end of every session. Then shouting scores: “6/10, needs stamina”. The noise stopped. Forever. I think they broke up." }, fx: { happy: 8, karma: -3, stress: -6 }, mood: 'proud' },
    ],
  },
  {
    id: 'lf_neighbour_dog',
    icon: '🐶',
    cat: 'neighbour',
    rating: 0,
    when: { age: [16, 99], movedOut: true },
    weight: 8,
    cooldown: 5,
    scene: { place: 'home', mood: 'angry', prop: 'fence' },
    text: {
      fr: [
        "Le chien du voisin aboie sans interruption depuis 6 h. Il aboie sur les oiseaux, sur le vent, sur le concept même de mardi.",
        "Le chien du voisin, un minuscule chihuahua nommé Satan, t'attend chaque matin devant ta porte pour mordre ta cheville. Toujours la gauche.",
      ],
      en: [
        "The neighbour's dog has been barking non-stop since 6 a.m. At birds, at the wind, at the very concept of Tuesday.",
        "The neighbour's dog, a tiny chihuahua named Satan, waits outside your door every morning to bite your ankle. Always the left one.",
      ],
    },
    choices: [
      { label: { fr: 'L’amadouer', en: 'Win it over' }, text: { fr: "J'ai amadoué le chien avec du jambon. Maintenant, il m'aime d'un amour fou et aboie de joie dès qu'il me voit. Donc tout le temps. C'est pire.", en: "I won the dog over with ham. Now it loves me madly and barks with joy every time it sees me. So, constantly. It's worse." }, fx: { happy: 2, karma: 2 }, mood: 'happy' },
      { label: { fr: 'Se plaindre au voisin', en: 'Complain to the owner' }, text: { fr: "Le voisin m'a répondu que son chien « s'exprime ». Je lui ai répondu que moi aussi, et j'ai mis du heavy metal à fond. On est quittes.", en: "The neighbour said his dog is “expressing itself”. I said so am I and blasted heavy metal. We're even." }, fx: { stress: 4, happy: 2 }, mood: 'angry' },
      { label: { fr: 'Porter des jambières', en: 'Wear shin guards' }, text: { fr: "J'ai acheté des protège-tibias de foot. Satan s'est cassé une dent dessus. Depuis, il me respecte. On a un pacte de non-agression.", en: "I bought football shin guards. Satan chipped a tooth on them. Now he respects me. We have a non-aggression pact." }, fx: { happy: 5, money: -30, smarts: 1 }, mood: 'proud' },
    ],
  },
  {
    id: 'lf_hedge_war',
    icon: '🌳',
    cat: 'neighbour',
    rating: 0,
    when: { age: [25, 99], asset: 'house' },
    actor: { create: { role: 'acquaintance', age: [5, 25], gender: 'any' } },
    weight: 6,
    cooldown: 10,
    scene: { place: 'home', mood: 'angry', prop: 'hedge' },
    text: {
      fr: [
        "Ton voisin {a.full} mesure ta haie avec un mètre ruban. Elle dépasse de 12 centimètres sur son terrain. {a:Il|Elle} a pris des photos. {a:Il|Elle} a un classeur.",
        "{a.full}, ton voisin{a:|e}, a taillé ta haie de son côté « pour rendre service ». Il en reste un bâton avec trois feuilles. Ta haie avait 40 ans.",
      ],
      en: [
        "Your neighbour {a.full} is measuring your hedge with a tape measure. It overhangs their property by five inches. They've taken photos. They have a binder.",
        "{a.full}, your neighbour, trimmed your hedge from their side “as a favour”. What's left is a stick with three leaves. Your hedge was 40 years old.",
      ],
    },
    choices: [
      { label: { fr: 'Tailler, s’excuser', en: 'Trim it and apologise' }, text: { fr: "J'ai taillé la haie au millimètre et apporté un gâteau. {a.first} a mesuré le gâteau. Il était conforme.", en: "I trimmed the hedge to the millimetre and brought a cake. {a.first} measured the cake. It was compliant." }, fx: { karma: 3, stress: -2 }, mood: 'neutral' },
      { label: { fr: 'Déclarer la guerre', en: 'Declare war' }, text: { fr: "J'ai planté du bambou à croissance rapide le long de la limite. {a.first} a répondu par un nain de jardin qui me fait un doigt. C'est la guerre.", en: "I planted fast-growing bamboo along the property line. {a.first} answered with a garden gnome giving me the finger. It's war." }, fx: { happy: 4, stress: 6, actorRole: 'enemy', flag: 'lf_hedge_war', schedule: { key: 'lf_hedge_war_2', years: 1 } }, mood: 'angry' },
      { label: { fr: 'Prendre un avocat', en: 'Lawyer up' }, text: { fr: "J'ai pris un avocat. {a.first} aussi. Les frais ont dépassé la valeur des deux maisons. La haie a gagné.", en: "I got a lawyer. So did {a.first}. The legal fees exceeded the value of both houses. The hedge won." }, fx: { money: -4000, stress: 10 }, mood: 'sad' },
    ],
  },
  {
    id: 'lf_hedge_war_2',
    icon: '⚔️',
    cat: 'neighbour',
    rating: 1,
    chainOnly: true,
    actor: 'enemy',
    when: { flag: 'lf_hedge_war' },
    scene: { place: 'home', mood: 'angry', prop: 'gnome', fx: 'explosion' },
    text: {
      fr: [
        "La guerre des haies avec {a.first} entre dans sa deuxième année. {a:Il|Elle} a installé une caméra braquée sur ta salle de bain, et toi un épouvantail à son effigie. Ça dégénère.",
        "{a.first} a déversé du désherbant sur ton potager à minuit. En représailles, tu envisages des choses que la Convention de Genève interdit.",
      ],
      en: [
        "The hedge war with {a.first} enters its second year. They've installed a camera pointed at your bathroom; you've put up a scarecrow in their likeness. Things are escalating.",
        "{a.first} dumped weedkiller on your vegetable patch at midnight. In retaliation, you're considering things the Geneva Convention prohibits.",
      ],
    },
    choices: [
      { label: { fr: 'Armistice', en: 'Armistice' }, text: { fr: "On a signé un armistice autour d'un barbecue. On s'est saoulés, on a pleuré, on a arraché la haie ensemble à 2 h du matin. Meilleurs ennemis.", en: "We signed an armistice over a barbecue. Got drunk, cried, ripped out the hedge together at 2 a.m. Best enemies." }, fx: { happy: 10, stress: -10, actorRole: 'friend', unflag: 'lf_hedge_war' }, mood: 'happy' },
      {
        label: { fr: 'Opération Fumier', en: 'Operation Manure' },
        out: [
          { w: 2, text: { fr: "Trois tonnes de fumier livrées sur sa pelouse le jour de l'anniversaire de sa fille. {a.first} a déménagé. J'ai racheté son terrain. La haie est à moi.", en: "Three tonnes of manure delivered onto their lawn on their daughter's birthday. {a.first} moved out. I bought their lot. The hedge is mine." }, fx: { happy: 12, karma: -8, money: -2000, visual: 'poop', actorGone: true, unflag: 'lf_hedge_war' }, mood: 'proud' },
          { w: 1, text: { fr: "Le camion de fumier s'est trompé d'adresse. Il a tout déversé chez moi. {a.first} a filmé en buvant un café.", en: "The manure truck got the wrong address. It dumped everything on my lawn. {a.first} filmed it while sipping coffee." }, fx: { happy: -10, stress: 10, visual: 'poop' }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Déménager', en: 'Move away' }, text: { fr: "J'ai mis la maison en vente. {a.first} a mis un panneau « voisin infernal » devant pendant toutes les visites. Ça a pris deux ans.", en: "I put the house up for sale. {a.first} put a “hellish neighbour” sign out front during every viewing. It took two years." }, fx: { stress: 12, happy: -6, unflag: 'lf_hedge_war' }, mood: 'sad' },
    ],
  },
  {
    id: 'lf_neighbour_flirt',
    icon: '😏',
    cat: 'neighbour',
    rating: 1,
    when: { age: [18, 75], movedOut: true },
    actor: { create: { role: 'acquaintance', age: [-10, 10], gender: 'attracted' } },
    weight: 7,
    cooldown: 6,
    scene: { place: 'apartment', mood: 'love', prop: 'sugar' },
    text: {
      fr: [
        "{a.first}, ton voisin{a:|e} du palier, vient pour la quatrième fois cette semaine « emprunter du sucre ». {a:Il|Elle} n'a jamais rien cuisiné. {a:Il|Elle} porte un peignoir entrouvert.",
        "{a.first}, du troisième, t'a souri dans l'ascenseur, a appuyé sur le bouton stop et a dit : « On a le temps ».",
      ],
      en: [
        "{a.first}, your neighbour across the hall, is here for the fourth time this week to “borrow sugar”. They've never baked anything. The bathrobe is half open.",
        "{a.first} from the third floor smiled at you in the elevator, hit the stop button and said: “We've got time.”",
      ],
    },
    choices: [
      { label: { fr: 'Prêter le sucre… et plus', en: 'Lend the sugar… and more' }, text: { fr: "J'ai prêté le sucre. Puis le café. Puis le lit. Maintenant on se croise dans l'escalier avec des clins d'œil, et toute la copropriété est au courant.", en: "I lent the sugar. Then the coffee. Then the bed. Now we wink in the stairwell, and the whole building knows." }, fx: { happy: 10, stress: -5, actorRole: 'partner' }, mood: 'love' },
      { label: { fr: 'Rester voisin', en: 'Keep it neighbourly' }, text: { fr: "J'ai donné le paquet entier de sucre et refermé la porte. {a.first} n'est plus jamais revenu{a:|e}. J'ai plus de sucre, mais j'ai ma paix.", en: "I handed over the whole bag of sugar and closed the door. {a.first} never came back. No more sugar, but I have peace." }, fx: { karma: 2, happy: -1 } },
      { label: { fr: 'Fuir par l’escalier', en: 'Take the stairs forever' }, text: { fr: "Depuis, je prends l'escalier. Neuf étages, deux fois par jour. Je n'ai jamais été aussi musclé{|e}. Merci, {a.first}.", en: "Since then, I take the stairs. Nine floors, twice a day. Never been fitter. Thanks, {a.first}." }, fx: { athletic: 5, stress: 4 } },
    ],
  },
  {
    id: 'lf_neighbour_killer',
    icon: '🔪',
    cat: 'neighbour',
    rating: 2,
    when: { age: [18, 90], movedOut: true },
    weight: 3,
    once: true,
    scene: { place: 'home', mood: 'shock', prop: 'freezer', fx: 'gore' },
    text: {
      fr: [
        "Ton voisin, Monsieur Dubois, si gentil, qui tond sa pelouse le dimanche, te demande de garder son congélateur pendant ses vacances. Il est très lourd. Il y a un pied qui dépasse.",
        "L'odeur chez le voisin devient insupportable. En regardant par sa fenêtre, tu vois un mur couvert de photos de gens du quartier. Dont toi. Ta photo est entourée en rouge.",
      ],
      en: [
        "Your neighbour, sweet Mr. Dobbs who mows his lawn on Sundays, asks you to look after his chest freezer while he's on vacation. It's very heavy. A foot is sticking out.",
        "The smell from next door is becoming unbearable. Peeking through the window, you see a wall covered in photos of people from the street. Including you. Your photo is circled in red.",
      ],
    },
    choices: [
      { label: { fr: 'Appeler la police', en: 'Call the police' }, text: { fr: "J'ai appelé la police. Ils ont trouvé onze personnes réparties dans quarante Tupperware étiquetés par date. Je suis passé{|e} au JT. Ma maison a perdu 40 % de sa valeur.", en: "I called the police. They found eleven people across forty Tupperware boxes, labelled by date. I was on the evening news. My house lost 40% of its value." }, fx: { fame: 8, karma: 10, stress: 15, followers: 15000, visual: 'police' }, mood: 'shock' },
      {
        label: { fr: 'Enquêter soi-même', en: 'Investigate yourself' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "Je suis entré{|e} chez lui. J'ai trouvé la tête de l'ancien facteur dans le bac à légumes, avec un persil dans la bouche. J'ai tout filmé et j'ai fui. Il a pris perpète. J'ai signé un contrat avec Netflix.", en: "I broke in. Found the old mailman's head in the crisper drawer, a sprig of parsley in its mouth. Filmed everything and ran. He got life. I signed a Netflix deal." }, fx: { fame: 12, money: 40000, stress: 20, disease: 'ptsd', visual: 'gore' }, mood: 'shock' },
          { w: 1, text: { fr: "Monsieur Dubois est rentré plus tôt. Il m'a proposé un thé. Le thé était très bon. Tout est devenu flou. On m'a retrouvé{|e} dans le congélateur, à côté du facteur.", en: "Mr. Dobbs came home early. He offered me tea. The tea was lovely. Everything went blurry. They found me in the freezer, next to the mailman." }, fx: { die: { fr: 'découpé{|e} en morceaux et congelé{|e} par mon voisin si serviable', en: 'chopped up and frozen by my oh-so-helpful neighbour' }, visual: 'gore' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Ne rien voir', en: 'See nothing' }, text: { fr: "J'ai rangé le congélateur au garage et je n'ai rien demandé. Monsieur Dubois m'apporte des terrines faites maison chaque Noël. Je ne les mange pas. Je les enterre.", en: "I put the freezer in the garage and asked no questions. Mr. Dobbs brings me homemade pâté every Christmas. I don't eat it. I bury it." }, fx: { karma: -10, stress: 12, flag: 'lf_killer_friend' }, mood: 'neutral' },
    ],
  },
  {
    id: 'lf_neighbour_auto',
    icon: '📦',
    cat: 'neighbour',
    rating: 2,
    auto: true,
    when: { age: [18, 99], movedOut: true },
    weight: 6,
    cooldown: 4,
    text: {
      fr: [
        "La voisine nudiste a fait son jardinage devant ma fenêtre tout l'été. Elle a 78 ans. J'ai vu des choses pendre que je ne pourrai jamais « dé-voir ».",
        "Un colis a été livré chez moi par erreur. Il venait d'un sex-shop, au nom du curé de la paroisse. Je l'ai rendu en main propre. On ne se regarde plus pendant la messe.",
      ],
      en: [
        "My nudist neighbour gardened in front of my window all summer. She's 78. I saw things dangling that I can never unsee.",
        "A package was delivered to me by mistake. From a sex shop, addressed to the parish priest. I hand-delivered it. We avoid eye contact at Mass now.",
      ],
    },
    fx: { happy: 1, stress: 2 },
  },

  // ═════════════════════════════ EVERYDAY ═════════════════════════════
  {
    id: 'lf_power_cut',
    icon: '🕯️',
    cat: 'home',
    rating: 0,
    when: { age: [10, 99] },
    weight: 8,
    cooldown: 4,
    scene: { place: 'home', mood: 'neutral', prop: 'candle' },
    text: {
      fr: [
        "Panne de courant générale. Plus de Wi-Fi, plus de télé, plus de frigo. Tu vas devoir parler aux gens de ta maison.",
        "Coupure d'électricité pendant trois jours. Le congélateur commence à pleurer. Il contient 12 kg de viande que tu ne te souviens pas avoir achetés.",
      ],
      en: [
        "Total blackout. No Wi-Fi, no TV, no fridge. You're going to have to talk to the people you live with.",
        "Power cut for three days. The freezer has started weeping. It contains 25 pounds of meat you don't remember buying.",
      ],
    },
    choices: [
      { label: { fr: 'Soirée bougies', en: 'Candlelit evening' }, text: { fr: "Soirée bougies et jeux de société. C'était charmant jusqu'à ce que le Monopoly tourne au règlement de comptes. On a rallumé le courant juste à temps.", en: "Candlelit evening and board games. Charming until Monopoly turned into a blood feud. The power came back just in time." }, fx: { happy: 5, stress: -3 }, mood: 'happy' },
      { label: { fr: 'Barbecue géant', en: 'Giant barbecue' }, text: { fr: "J'ai fait griller les 12 kg de viande et invité tout le quartier. On s'est fait des amis. Un voisin a reconnu « son » gigot. Je n'ai rien dit.", en: "I grilled all the meat and invited the whole street. Made friends. One neighbour recognised “his” leg of lamb. I said nothing." }, fx: { happy: 8, karma: 3, weight: 0.02 }, mood: 'party' },
      { label: { fr: 'Dormir 14 heures', en: 'Sleep 14 hours' }, text: { fr: "Sans écran, je me suis couché{|e} à 19 h. J'ai dormi quatorze heures. Je n'ai jamais été aussi reposé{|e}. Je ne recommencerai jamais.", en: "With no screens, I went to bed at 7 p.m. Slept fourteen hours. Never felt so rested. Will never do it again." }, fx: { health: 4, stress: -8 }, mood: 'sleepy' },
    ],
  },
  {
    id: 'lf_plumbing',
    icon: '🚽',
    cat: 'home',
    rating: 2,
    when: { age: [18, 99], movedOut: true },
    vars: { amount: [300, 2500] },
    weight: 7,
    cooldown: 5,
    scene: { place: 'home', mood: 'sick', prop: 'plunger', fx: 'poop' },
    text: {
      fr: [
        "Les toilettes sont bouchées. Tu tires la chasse « une dernière fois pour voir ». Le niveau monte. Il monte. Il déborde. C'est un geyser marron, et il ne s'arrête pas.",
        "Le tuyau d'évacuation de l'immeuble a cédé. Tout ce que les voisins du dessus ont produit cette semaine ressort par ta baignoire. Ça bouillonne.",
      ],
      en: [
        "The toilet is clogged. You flush “one last time to see”. The water rises. And rises. It overflows. It's a brown geyser, and it won't stop.",
        "The building's main drain pipe burst. Everything the upstairs neighbours produced this week is coming up through your bathtub. It's bubbling.",
      ],
    },
    choices: [
      { label: { fr: 'Appeler un plombier', en: 'Call a plumber' }, text: { fr: "Le plombier est arrivé quatre heures après, a regardé, a dit « ah ouais quand même » et m'a facturé {$amount}. Il a retrouvé dans le tuyau une poupée Barbie et des dents.", en: "The plumber showed up four hours later, looked, said “oh wow” and charged me {$amount}. He found a Barbie doll and some teeth in the pipe." }, fx: { money: '-amount', stress: 6, visual: 'poop' }, mood: 'sick' },
      {
        label: { fr: 'Ventouse et courage', en: 'Plunger and courage' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai ventousé comme un dieu grec. Un bruit de succion titanesque, et tout est reparti. J'ai levé la ventouse au ciel comme Excalibur.", en: "I plunged like a Greek god. A titanic sucking noise, and it all went down. I raised the plunger to the sky like Excalibur." }, fx: { happy: 8, athletic: 2 }, mood: 'proud' },
          { w: 2, text: { fr: "J'ai ventousé trop fort. Ça a fait l'effet inverse. Je l'ai pris en pleine face, bouche ouverte. J'ai pris quatre douches. Je me sens toujours sale. Gastro offerte.", en: "I plunged too hard. It had the opposite effect. Took it full in the face, mouth open. Four showers later, I still feel dirty. Bonus stomach bug." }, fx: { happy: -12, health: -6, disease: 'gastro', visual: 'poop' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Fermer la porte, fuir', en: 'Close the door, leave' }, text: { fr: "J'ai fermé la porte de la salle de bain, mis une serviette en dessous et je suis allé{|e} dormir chez ma mère. Ça fait trois semaines. Je n'ose pas rentrer.", en: "I closed the bathroom door, stuffed a towel underneath and went to sleep at my mom's. That was three weeks ago. I'm afraid to go home." }, fx: { stress: 10, money: -800 }, mood: 'shock' },
    ],
  },
  {
    id: 'lf_ikea',
    icon: '🪛',
    cat: 'home',
    rating: 1,
    when: { age: [18, 99], movedOut: true },
    weight: 8,
    cooldown: 4,
    scene: { place: 'apartment', mood: 'angry', prop: 'flatpack' },
    text: {
      fr: [
        "Samedi chez IKEA. Tu étais venu{|e} acheter une ampoule. Tu ressors avec 47 bougies chauffe-plat, un ficus en plastique et une armoire PAX de 230 kg en kit.",
        "Tu montes une armoire suédoise depuis cinq heures. Il te reste 14 vis, une cheville, et l'armoire est montée à l'envers. La petite clé Allen te regarde avec mépris.",
      ],
      en: [
        "Saturday at the Swedish flatpack store. You came for a light bulb. You leave with 47 tealights, a plastic fig tree and a 500-pound wardrobe in a box.",
        "You've been assembling a Swedish wardrobe for five hours. You have 14 screws left over, one dowel, and the wardrobe is upside down. The little Allen key looks at you with contempt.",
      ],
    },
    choices: [
      { label: { fr: 'Tout démonter', en: 'Start over' }, text: { fr: "J'ai tout démonté et remonté. Six heures de plus. J'ai inventé onze nouveaux gros mots, dont un en suédois. L'armoire tient debout. Elle penche un peu. Comme moi.", en: "I took it apart and rebuilt it. Six more hours. I invented eleven new swear words, one in Swedish. The wardrobe stands. It leans a bit. Like me." }, fx: { discipline: 4, stress: 10, happy: 3 }, mood: 'proud' },
      { label: { fr: 'Utiliser la colle', en: 'Glue it' }, text: { fr: "J'ai tout fixé au pistolet à colle et au gros scotch. Ça tient. Ne jamais ouvrir la porte de gauche. Ne jamais.", en: "I fixed everything with a hot glue gun and duct tape. It holds. Never open the left door. Ever." }, fx: { happy: 4, smarts: -1 }, mood: 'neutral' },
      { label: { fr: 'Payer un monteur', en: 'Hire someone' }, text: { fr: "J'ai payé un monteur. Il a tout fait en 25 minutes, en sifflotant, sans notice. Il a utilisé toutes les vis. Je me suis senti{|e} profondément inutile.", en: "I hired a handyman. He did it in 25 minutes, whistling, no instructions. He used every single screw. I felt profoundly useless." }, fx: { money: -150, happy: -2, stress: -6 } },
    ],
  },
  {
    id: 'lf_car_wash',
    icon: '🚗',
    cat: 'home',
    rating: 1,
    when: { age: [18, 99], asset: 'car' },
    weight: 7,
    cooldown: 5,
    scene: { place: 'park', mood: 'shock', prop: 'car' },
    text: {
      fr: [
        "Station de lavage automatique. Tu as oublié de fermer la fenêtre côté passager. Les rouleaux géants arrivent. Lentement. Inexorablement.",
        "Un groupe de pom-pom girls organise un lavage de voiture caritatif. Ta voiture est si sale qu'elles se concertent avant d'approcher.",
      ],
      en: [
        "Automatic car wash. You forgot to close the passenger window. The giant brushes are coming. Slowly. Inexorably.",
        "A cheerleading squad is holding a charity car wash. Your car is so dirty they huddle up before approaching.",
      ],
    },
    choices: [
      { label: { fr: 'Fermer en panique', en: 'Panic-close the window' }, out: [
        { w: 1, text: { fr: "J'ai fermé la fenêtre à temps. Mon cœur a battu à 180. Je me suis senti{|e} comme dans un film d'action. Le film d'action le plus nul du monde.", en: "I closed the window just in time. Heart rate 180. I felt like an action hero. In the world's lamest action movie." }, fx: { happy: 4, stress: 3 }, mood: 'proud' },
        { w: 1, text: { fr: "Trop tard. J'ai pris trois litres de mousse au parfum « cerise sauvage » en pleine tête. La voiture sent la cerise depuis deux ans. Moi aussi.", en: "Too late. Three litres of “wild cherry” foam right in the face. The car has smelled like cherry for two years. So have I." }, fx: { happy: -4, looks: -1, money: -100 }, mood: 'shock' },
      ] },
      { label: { fr: 'Donner généreusement', en: 'Donate generously' }, text: { fr: "J'ai donné 50 balles pour la cause. Elles ont nettoyé pendant une heure. Elles ont trouvé deux frites fossilisées et une chaussure qui n'est pas à moi.", en: "I donated 50 bucks. They scrubbed for an hour. They found two fossilised fries and a shoe that isn't mine." }, fx: { money: -50, karma: 4, happy: 3 }, mood: 'happy' },
      { label: { fr: 'Laisser la crasse', en: 'Keep the dirt' }, text: { fr: "J'ai gardé la voiture sale. Quelqu'un a écrit « lave-moi » sur la vitre arrière. Puis quelqu'un d'autre a dessiné un pénis. C'est devenu une œuvre collective.", en: "I kept the car dirty. Someone wrote “wash me” on the back window. Then someone else drew a penis. It's a collaborative artwork now." }, fx: { happy: 1, looks: -1 } },
    ],
  },
  {
    id: 'lf_diy_gore',
    icon: '🪚',
    cat: 'home',
    rating: 2,
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 6,
    scene: { place: 'home', mood: 'shock', prop: 'saw', fx: 'gore' },
    text: {
      fr: [
        "Tu as regardé un tuto YouTube de 4 minutes et tu as acheté une scie circulaire. Ce week-end, tu construis une terrasse. Tu n'as jamais tenu un tournevis.",
        "Bricolage du dimanche : tu tiens la planche avec la main gauche, la meuleuse avec la main droite, et tu regardes ton téléphone avec les deux yeux.",
      ],
      en: [
        "You watched a 4-minute YouTube tutorial and bought a circular saw. This weekend you're building a deck. You've never held a screwdriver.",
        "Sunday DIY: you're holding the plank with your left hand, the angle grinder with your right, and looking at your phone with both eyes.",
      ],
    },
    choices: [
      {
        label: { fr: 'Foncer', en: 'Go for it' },
        out: [
          { w: 2, text: { fr: "La scie a mordu. Mon index s'est envolé au-dessus de la haie et a atterri dans la piscine du voisin. Le sang giclait en rythme sur la terrasse. Le voisin m'a rendu le doigt dans un sac de glaçons. Trop tard.", en: "The saw bit. My index finger flew over the hedge and landed in the neighbour's pool. Blood spurted rhythmically across the deck. The neighbour returned the finger in a bag of ice. Too late." }, fx: { health: -12, disease: 'missing_finger', happy: -10, visual: 'gore' }, mood: 'shock' },
          { w: 2, odds: { smarts: 1 }, text: { fr: "Contre toute attente, j'ai construit une terrasse magnifique. Elle est légèrement en pente. Les verres glissent tout seuls vers le jardin. C'est une feature.", en: "Against all odds, I built a beautiful deck. It slopes slightly. Drinks slide off into the garden on their own. It's a feature." }, fx: { happy: 10, smarts: 2, money: -600 }, mood: 'proud' },
          { w: 1, text: { fr: "La meuleuse a rebondi et m'a ouvert le mollet comme une fermeture éclair. J'ai vu mon propre muscle. Il était plus petit que prévu. Soixante points de suture.", en: "The grinder kicked back and unzipped my calf. I saw my own muscle. It was smaller than expected. Sixty stitches." }, fx: { health: -15, athletic: -4, money: -900, visual: 'gore' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Engager un artisan', en: 'Hire a pro' }, text: { fr: "J'ai engagé un artisan. Il a commencé, encaissé l'acompte, et disparu. Il reste quatre planches et un trou. Il ne répond plus depuis 2019.", en: "I hired a contractor. He started, cashed the deposit and vanished. There are four planks and a hole. He hasn't answered since 2019." }, fx: { money: -2000, stress: 8 }, mood: 'angry' },
    ],
  },
  {
    id: 'lf_lost_keys',
    icon: '🔑',
    cat: 'home',
    rating: 0,
    when: { age: [14, 99] },
    weight: 8,
    cooldown: 4,
    scene: { place: 'apartment', mood: 'angry', prop: 'door' },
    text: {
      fr: [
        "Tu es devant ta porte. Il pleut. Il est 23 h. Tes clés sont à l'intérieur, sur la table, bien au chaud, en train de se moquer de toi.",
        "Tu as perdu tes clés. Tu as tout retourné pendant deux heures. Elles étaient dans ta main.",
      ],
      en: [
        "You're outside your door. It's raining. It's 11 p.m. Your keys are inside, on the table, warm and dry, laughing at you.",
        "You lost your keys. You turned the whole place upside down for two hours. They were in your hand.",
      ],
    },
    choices: [
      { label: { fr: 'Appeler un serrurier', en: 'Call a locksmith' }, text: { fr: "Le serrurier a ouvert en huit secondes avec une radio et m'a facturé 380 €. Huit secondes. J'ai changé de métier dans ma tête.", en: "The locksmith opened it in eight seconds with a credit card and charged me $400. Eight seconds. I mentally changed careers." }, fx: { money: -400, stress: 4 }, mood: 'angry' },
      {
        label: { fr: 'Passer par la fenêtre', en: 'Climb through the window' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai escaladé la gouttière comme Spider-Man. Je suis rentré{|e} par la fenêtre. Puis j'ai réalisé que j'étais chez le voisin. Il regardait la télé. On a fini le film ensemble.", en: "I scaled the drainpipe like Spider-Man and climbed in through the window. Then I realised I was at the neighbour's. He was watching TV. We finished the movie together." }, fx: { athletic: 3, happy: 6 }, mood: 'shock' },
          { w: 1, text: { fr: "Je suis resté{|e} coincé{|e} à mi-corps dans la fenêtre. Les pompiers ont dû me désincarcérer, les fesses à l'air côté rue. Le quartier entier a filmé.", en: "I got stuck halfway through the window. Firefighters had to extract me, butt hanging out towards the street. The whole neighbourhood filmed it." }, fx: { happy: -6, health: -2, followers: 1500 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Dormir chez un ami', en: 'Crash at a friend’s' }, text: { fr: "J'ai dormi sur le canapé d'un pote, à côté de son chat qui m'a fixé{|e} toute la nuit. Le matin, mes clés étaient dans ma poche de manteau. Depuis le début.", en: "I slept on a friend's couch next to his cat, who stared at me all night. In the morning, my keys were in my coat pocket. All along." }, fx: { happy: -2, smarts: -1 } },
    ],
  },
  {
    id: 'lf_phone_toilet',
    icon: '📱',
    cat: 'home',
    rating: 2,
    when: { age: [14, 99] },
    weight: 8,
    cooldown: 5,
    scene: { place: 'home', mood: 'shock', prop: 'toilet', fx: 'poop' },
    text: {
      fr: [
        "Ton téléphone a glissé de ta poche arrière… dans la cuvette. Que tu n'avais pas encore tirée. Il est au fond, l'écran allumé, avec une notification « Maman : tu m'appelles ? ».",
        "Tu scrollais aux toilettes. Ton téléphone a plongé. Il vibre encore, quelque part sous ce que tu viens de produire.",
      ],
      en: [
        "Your phone slid out of your back pocket… into the toilet. Which you hadn't flushed yet. It's at the bottom, screen lit, notification: “Mom: call me?”.",
        "You were scrolling on the toilet. Your phone took a dive. It's still vibrating, somewhere underneath what you just produced.",
      ],
    },
    choices: [
      { label: { fr: 'Plonger la main', en: 'Go in bare-handed' }, text: { fr: "J'ai plongé la main jusqu'au coude. J'ai récupéré le téléphone. Je l'ai mis dans du riz. Le riz, je l'ai jeté. Ma main, j'hésite encore.", en: "I went in up to the elbow. Got the phone. Put it in rice. Threw away the rice. Still debating about the hand." }, fx: { happy: -6, health: -2, visual: 'poop' }, mood: 'sick' },
      { label: { fr: 'Tirer la chasse', en: 'Flush it' }, text: { fr: "J'ai tiré la chasse. Le téléphone est parti. Toutes mes photos, mes contacts, mes nudes. Quelque part dans les égouts, un rat a accès à mon iCloud.", en: "I flushed. The phone is gone. All my photos, contacts, nudes. Somewhere in the sewers, a rat has access to my iCloud." }, fx: { money: -900, happy: -8 }, mood: 'cry' },
      { label: { fr: 'Gants et pince à barbecue', en: 'Gloves and BBQ tongs' }, text: { fr: "Gants de vaisselle, pince à barbecue, masque. Opération chirurgicale. Le téléphone marche. Il sent juste un peu. Les gens me demandent pourquoi je l'éloigne de mon visage en appelant.", en: "Rubber gloves, barbecue tongs, face mask. Surgical operation. The phone works. It just smells a bit. People ask why I hold it at arm's length on calls." }, fx: { happy: 2, smarts: 2 }, mood: 'proud' },
    ],
  },
  {
    id: 'lf_food_mixup',
    icon: '🥡',
    cat: 'home',
    rating: 1,
    when: { age: [16, 99] },
    weight: 8,
    cooldown: 4,
    scene: { place: 'apartment', mood: 'shock', prop: 'takeout' },
    text: {
      fr: [
        "Tu as commandé un burger. Le livreur t'apporte un plateau de sushis pour douze personnes et un mot : « Joyeux enterrement de vie de jeune fille, Sabrina ! » Le paiement est déjà fait.",
        "Le livreur s'est trompé de commande. Tu reçois un sac en papier contenant un repas thaï et… une petite pochette de poudre blanche agrafée au ticket.",
      ],
      en: [
        "You ordered a burger. The driver brings a sushi platter for twelve and a note: “Happy bachelorette, Sabrina!” It's already paid for.",
        "The delivery got mixed up. You receive a paper bag with a Thai meal and… a small baggie of white powder stapled to the receipt.",
      ],
    },
    choices: [
      { label: { fr: 'Tout manger', en: 'Eat everything' }, text: { fr: "J'ai mangé les sushis pour douze. Seul{|e}. En regardant une téléréalité. Sabrina, si tu lis ça : félicitations, et désolé{|e}.", en: "I ate the sushi for twelve. Alone. Watching reality TV. Sabrina, if you read this: congratulations, and sorry." }, fx: { happy: 8, health: -3, weight: 0.03, karma: -2 }, mood: 'happy' },
      {
        label: { fr: 'Prévenir le resto', en: 'Call the restaurant' },
        out: [
          { w: 2, text: { fr: "J'ai appelé le resto. Ils m'ont offert le repas et un bon de réduction pour ma « grande honnêteté ». J'ai appris le lendemain que le cuisinier avait été arrêté.", en: "I called the restaurant. They comped the meal and gave me a coupon for my “great honesty”. Next day I learned the cook got arrested." }, fx: { karma: 5, happy: 3 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai appelé. Un homme avec une voix très calme m'a demandé mon adresse « pour récupérer le petit sachet ». Il est venu. Il m'a remercié. Il connaît mon adresse, maintenant.", en: "I called. A very calm voice asked for my address “to pick up the little bag”. He came. He thanked me. He knows where I live now." }, fx: { stress: 12, heat: 5 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Garder le petit sachet', en: 'Keep the baggie' }, rating: 2, text: { fr: "J'ai gardé le sachet. C'était de la farine. Ou pas. J'ai passé la nuit à nettoyer ma cuisine au coton-tige en écoutant de la techno. Le carrelage n'a jamais été aussi propre.", en: "I kept the baggie. It was flour. Or not. I spent the night cleaning my kitchen with Q-tips while listening to techno. The tiles have never been cleaner." }, fx: { happy: 6, health: -6, addiction: ['drugs', 8], heat: 5 }, mood: 'party' },
    ],
  },
  {
    id: 'lf_jury_duty',
    icon: '⚖️',
    cat: 'civic',
    rating: 1,
    when: { age: [18, 80], prison: false },
    weight: 6,
    cooldown: 10,
    scene: { place: 'court', mood: 'sleepy', prop: 'gavel' },
    text: {
      fr: [
        "Tu es convoqué{|e} comme juré{|e} dans un procès d'assises. L'accusé est poursuivi pour avoir volé 400 nains de jardin. Le procès doit durer trois semaines.",
        "Juré{|e} au tribunal. L'accusé est très beau, l'avocat de la défense pleure à chaque plaidoirie, et un autre juré dort la bouche ouverte depuis lundi.",
      ],
      en: [
        "You've been summoned for jury duty. The defendant is accused of stealing 400 garden gnomes. The trial is expected to last three weeks.",
        "Jury duty. The defendant is very attractive, the defence lawyer cries at every closing argument, and another juror has been asleep with their mouth open since Monday.",
      ],
    },
    choices: [
      { label: { fr: 'Prendre ça au sérieux', en: 'Take it seriously' }, text: { fr: "J'ai pris des notes, analysé chaque preuve, posé des questions. J'étais le seul. Les autres ont voté « coupable » pour rentrer plus tôt. Justice.", en: "I took notes, analysed every piece of evidence, asked questions. I was the only one. The others voted “guilty” to go home early. Justice." }, fx: { smarts: 4, karma: 3, stress: 6 }, mood: 'proud' },
      { label: { fr: 'Draguer l’accusé', en: 'Flirt with the defendant' }, text: { fr: "J'ai fait des clins d'œil à l'accusé pendant trois semaines. Il a été acquitté. On s'est revus. Il m'a offert un nain de jardin. Je pose pas de questions.", en: "I winked at the defendant for three weeks. He was acquitted. We met up. He gave me a garden gnome. I don't ask questions." }, fx: { happy: 8, karma: -4 }, mood: 'love' },
      { label: { fr: 'Esquiver la convocation', en: 'Dodge it' }, text: { fr: "J'ai dit au juge que je croyais que tous les flics étaient des reptiliens. Il m'a renvoyé{|e} chez moi. Mais il a noté mon nom.", en: "I told the judge I believe all cops are lizard people. He sent me home. But he wrote down my name." }, fx: { happy: 4, heat: 3 }, mood: 'neutral' },
    ],
  },
  {
    id: 'lf_game_show',
    icon: '📺',
    cat: 'fame',
    rating: 0,
    when: { age: [18, 85] },
    vars: { amount: [5000, 60000] },
    weight: 4,
    once: true,
    scene: { place: 'studio', mood: 'happy', prop: 'buzzer', fx: 'money' },
    text: {
      fr: [
        "Tu as été sélectionné{|e} pour un jeu télé ! Tu es en finale. La dernière question vaut {$amount}. Le présentateur sourit avec ses 32 facettes : « Quelle est la capitale du Burkina Faso ? »",
        "Jeu télé du midi. Tu as tout gagné jusqu'ici. Pour {$amount}, il faut faire tourner la roue. Ou repartir avec le lot de consolation : un service à raclette.",
      ],
      en: [
        "You got selected for a TV game show! You're in the final. The last question is worth {$amount}. The host flashes 32 veneers: “What is the capital of Burkina Faso?”",
        "Lunchtime game show. You've won everything so far. For {$amount}, you have to spin the wheel. Or leave with the consolation prize: a fondue set.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout risquer', en: 'Go for it' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "« Ouagadougou ! » Les confettis sont tombés, j'ai pleuré, le présentateur m'a serré{|e} dans ses bras. Il sentait le fond de teint et le succès. J'ai gagné {$amount}.", en: "“Ouagadougou!” Confetti fell, I cried, the host hugged me. He smelled of foundation and success. I won {$amount}." }, fx: { money: 'amount', happy: 15, fame: 5, visual: 'confetti' }, mood: 'party' },
          { w: 1, text: { fr: "J'ai répondu « Burkina » avec beaucoup d'assurance. Silence en plateau. Je suis reparti{|e} avec un mug. Ma famille m'appelle « Burkina » depuis.", en: "I answered “Burkina” with great confidence. Silence in the studio. I left with a mug. My family has called me “Burkina” ever since." }, fx: { happy: -6, fame: 3 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Prendre la raclette', en: 'Take the fondue set' }, text: { fr: "J'ai pris le service à raclette. Sur Internet, on me traite de lâche. Mais l'hiver, c'est moi qui ris. Avec du fromage.", en: "I took the fondue set. People online call me a coward. But in winter, I'm the one laughing. With cheese." }, fx: { happy: 5, fame: 2 }, mood: 'happy' },
    ],
  },
  {
    id: 'lf_radio_contest',
    icon: '📻',
    cat: 'fame',
    rating: 1,
    when: { age: [16, 90] },
    weight: 5,
    cooldown: 8,
    scene: { place: 'home', mood: 'happy', prop: 'radio', fx: 'money' },
    text: {
      fr: [
        "Tu es le 10e auditeur à appeler la radio ! Pour gagner deux places de concert et 2 000 €, l'animateur te demande de raconter en direct ton « pire moment au lit ».",
        "Concours radio : le premier qui vient au studio avec le logo de la station tatoué gagne une voiture. Tu as un feutre indélébile et une heure.",
      ],
      en: [
        "You're the 10th caller! To win two concert tickets and $2,000, the DJ asks you to describe, live on air, your “worst moment in bed”.",
        "Radio contest: first person to show up at the studio with the station's logo tattooed on them wins a car. You have a Sharpie and one hour.",
      ],
    },
    choices: [
      { label: { fr: 'Tout raconter', en: 'Tell it all' }, text: { fr: "J'ai raconté l'histoire de la crampe, du chat et des menottes en direct. J'ai gagné. Ma mère écoutait. Mon patron aussi. Mon ex a appelé pour corriger des détails.", en: "I told the cramp, cat and handcuffs story live. I won. My mother was listening. So was my boss. My ex called in to correct some details." }, fx: { money: 2000, happy: 6, fame: 3, stress: 6 }, mood: 'shock' },
      {
        label: { fr: 'Le faux tatouage', en: 'The fake tattoo' },
        out: [
          { w: 1, text: { fr: "Mon faux tatouage au feutre a convaincu le stagiaire. J'ai gagné une voiture ! C'était une Twingo de 2004 avec 300 000 km. Elle roule. Parfois.", en: "My Sharpie tattoo fooled the intern. I won a car! A 2004 hatchback with 190,000 miles. It runs. Sometimes." }, fx: { asset: 'c_twingo', happy: 12 }, mood: 'party' },
          { w: 1, text: { fr: "Quelqu'un était arrivé avant moi avec un vrai tatouage sur le front. Il a gagné. Je suis resté{|e} avec le logo au feutre sur le bras pendant deux semaines. Il ne partait pas.", en: "Someone beat me to it with a real tattoo on his forehead. He won. I had the Sharpie logo on my arm for two weeks. It wouldn't come off." }, fx: { happy: -4, looks: -1 }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Raccrocher', en: 'Hang up' }, text: { fr: "J'ai raccroché par panique. La personne suivante a raconté une histoire avec un concombre et a gagné. Je l'ai entendue. Je regrette de ne pas avoir raccroché la radio.", en: "I panicked and hung up. The next caller told a story involving a cucumber and won. I heard it. I regret not turning off the radio." }, fx: { happy: -2 } },
    ],
  },
  {
    id: 'lf_everyday_auto',
    icon: '🦶',
    cat: 'home',
    rating: 2,
    auto: true,
    when: { age: [14, 99] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "J'ai marché pieds nus dans une crotte de chien encore tiède en sortant les poubelles. Elle est passée entre mes orteils. J'ai crié comme dans un film d'horreur.",
        "J'ai éternué en m'épilant les sourcils à la pince. Il ne m'en reste qu'un. Et un bout de paupière.",
      ],
      en: [
        "I stepped barefoot in a still-warm dog turd while taking the bins out. It squished between my toes. I screamed like a horror movie.",
        "I sneezed while tweezing my eyebrows. I have one left. And a chunk of eyelid.",
      ],
    },
    fx: { happy: -3, visual: 'poop' },
  },
  {
    id: 'lf_chores_auto',
    icon: '📬',
    cat: 'home',
    rating: 0,
    auto: true,
    when: { age: [18, 99], movedOut: true },
    weight: 7,
    cooldown: 3,
    text: {
      fr: [
        "J'ai passé deux heures au téléphone avec mon opérateur Internet. J'ai été transféré{|e} onze fois. La dernière personne m'a conseillé de « débrancher et rebrancher ». Ça a marché.",
        "J'ai fait un tri dans le placard sous l'évier. J'y ai trouvé onze sacs plastiques contenant d'autres sacs plastiques. Une poupée russe de la honte.",
      ],
      en: [
        "I spent two hours on the phone with my internet provider. Transferred eleven times. The last person told me to “unplug it and plug it back in”. It worked.",
        "I cleaned out the cupboard under the sink. Found eleven plastic bags full of other plastic bags. A Russian doll of shame.",
      ],
    },
    fx: { stress: 2, happy: 1 },
  },
];
