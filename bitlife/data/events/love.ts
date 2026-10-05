// Love & sex life events (18+): dating apps, one-night stands, cheating, in-laws, weddings, divorces, exes, weirdness.
// Created romantic actors keep a minimum age of 18: offsets [-6, 8] are only used when the player is 24+.
import type { EventDef } from '@bl/sim';

export const loveEvents: EventDef[] = [
  // ───────────────────────────── dating ─────────────────────────────
  {
    id: 'lv_app_bio',
    icon: '✍️',
    cat: 'love',
    rating: 0,
    scene: { place: 'apartment', mood: 'sleepy', prop: 'phone' },
    when: { age: [18, 60], noHas: 'lover' },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Tu crées ton profil sur une appli de rencontre. Case « bio » : 500 caractères pour résumer ton âme. Ou au moins tes hobbies.", "Ton profil de rencontre n'a eu aucun match en trois semaines. Même les bots t'ignorent. Il est temps de réécrire ta bio."],
      en: ["You're setting up a dating profile. The 'bio' box: 500 characters to sum up your soul. Or at least your hobbies.", "Your dating profile hasn't had a single match in three weeks. Even the bots ignore you. Time to rewrite the bio."],
    },
    choices: [
      {
        label: { fr: 'Être honnête', en: 'Be honest' },
        out: [
          { w: 2, text: { fr: "J'ai écrit « J'aime dormir et le fromage ». 43 matchs. Le fromage, ça rassemble.", en: "I wrote 'I like naps and cheese.' 43 matches. Cheese brings people together." }, fx: { happy: 6 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai été totalement honnête. Personne n'a matché. L'honnêteté est surcotée.", en: 'I was completely honest. Nobody matched. Honesty is overrated.' }, fx: { happy: -4 } },
        ],
      },
      {
        label: { fr: 'Mentir un peu', en: 'Lie a little' },
        out: [
          { w: 2, text: { fr: "Je me suis ajouté 8 cm, un master et un voilier. Les matchs pleuvent. Le premier rendez-vous va être compliqué.", en: "I added three inches, a master's degree and a sailboat. The matches are pouring in. First dates will be tricky." }, fx: { happy: 5, karma: -3 } },
          { w: 1, text: { fr: "J'ai prétendu parler couramment italien. Mon premier match m'a écrit en italien. J'ai répondu « pizza ». Fin.", en: "I claimed to speak fluent Italian. My first match wrote to me in Italian. I replied 'pizza'. The end." }, fx: { happy: -3, karma: -2 } },
        ],
      },
      { label: { fr: 'Photo avec un chien', en: 'Pose with a dog' }, text: { fr: "J'ai emprunté le chien du voisin pour une photo. Tout le monde demande des nouvelles du chien. Personne ne demande les miennes.", en: "I borrowed the neighbor's dog for a photo. Everyone asks how the dog is doing. Nobody asks about me." }, fx: { happy: 2 } },
      { label: { fr: 'Swiper sans réfléchir', en: 'Swipe mindlessly' }, text: { fr: "J'ai swipé à droite jusqu'à me faire une tendinite du pouce. L'amour moderne, c'est de la kiné.", en: 'I swiped right until I got thumb tendinitis. Modern love is basically physiotherapy.' }, fx: { happy: 2, open: 'dating' } },
    ],
  },
  {
    id: 'lv_first_date',
    icon: '🍝',
    cat: 'love',
    rating: 0,
    actor: { create: { role: 'acquaintance', age: [-6, 8], gender: 'attracted' } },
    vars: { amount: [60, 180] },
    scene: { place: 'party', mood: 'love', prop: 'candle' },
    when: { age: [24, 60], noHas: 'lover' },
    weight: 10,
    cooldown: 3,
    text: {
      fr: ["Premier rendez-vous avec {a.first}, {a.age} ans, dans un restaurant qui sert les plats sur des tuiles en ardoise. L'addition arrive. {a:Il|Elle} ne bouge pas d'un millimètre.", "{a.first} ({a.age} ans) est charmant{a:|e}, drôle, et vient de commander le plat le plus cher de la carte « puisque c'est toi qui invites, non ? »"],
      en: ["First date with {a.first}, {a.age}, at a restaurant that serves food on roof slates. The bill arrives. {a:He|She} doesn't move a muscle.", "{a.first} ({a.age}) is charming, funny, and just ordered the most expensive dish on the menu 'since you're paying, right?'"],
    },
    choices: [
      {
        label: { fr: 'Tout payer', en: 'Pay for everything' },
        out: [
          { w: 2, text: { fr: "J'ai payé {$amount} avec le sourire. {a.first} m'a rappelé{|e} le lendemain. L'amour, ça se finance.", en: "I paid {$amount} with a smile. {a.first} called me the next day. Love requires funding." }, fx: { money: '-amount', happy: 8, rel: 12, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "J'ai payé {$amount}. {a.first} m'a remercié{|e} d'un « t'es vraiment un{|e} super pote ». Friendzoné{|e} à prix d'or.", en: "I paid {$amount}. {a.first} thanked me with 'you're such a great friend'. Friendzoned at premium rates." }, fx: { money: '-amount', happy: -5 } },
        ],
      },
      {
        label: { fr: "Partager l'addition", en: 'Split the bill' },
        out: [
          { w: 1, text: { fr: "On a partagé l'addition au centime près, avec une appli. {a.first} a trouvé ça « très mature ». On se revoit samedi.", en: "We split the bill to the cent, using an app. {a.first} called it 'very mature'. We're meeting again Saturday." }, fx: { money: -50, happy: 6, rel: 8, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "J'ai proposé de partager. {a.first} m'a regardé{|e} comme si je proposais de partager un rein. Pas de deuxième rendez-vous.", en: "I suggested splitting. {a.first} looked at me as if I'd suggested splitting a kidney. No second date." }, fx: { money: -50, happy: -4 } },
        ],
      },
      { label: { fr: 'Simuler un appel urgent', en: 'Fake an emergency call' }, text: { fr: "J'ai simulé un appel de l'hôpital et je suis parti{|e} en courant. Je suis la personne la plus lâche du restaurant. Mais solvable.", en: "I faked a call from the hospital and ran out. I'm the biggest coward in that restaurant. But a solvent one." }, fx: { karma: -5, happy: 2 } },
    ],
  },
  {
    id: 'lv_date_crypto',
    icon: '🪙',
    cat: 'love',
    rating: 0,
    actor: { create: { role: 'acquaintance', age: [-6, 8], gender: 'attracted' } },
    vars: { amount: [100, 1000] },
    scene: { place: 'party', mood: 'shock', prop: 'tablet' },
    when: { age: [24, 55], noHas: 'lover' },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Ton rendez-vous {a.first} parle depuis 50 minutes de son « portefeuille de jetons ». {a:Il|Elle} vient de te proposer d'investir dans le DogeBanane. Pour « notre avenir ».", "À peine assis{|e}, {a.first} sort une tablette pleine de graphiques : « Avant le dessert, laisse-moi te présenter une opportunité qui va changer ta vie. »"],
      en: ["Your date {a.first} has been talking about {a:his|her} 'token portfolio' for 50 minutes. {a:He|She} just suggested you invest in DogeBanana. For 'our future'.", "You've barely sat down when {a.first} pulls out a tablet full of charts: 'Before dessert, let me show you an opportunity that will change your life.'"],
    },
    choices: [
      {
        label: { fr: 'Investir par amour', en: 'Invest for love' },
        out: [
          { w: 1, text: { fr: "J'ai mis {$amount} dans le DogeBanane. Il a doublé en une semaine. {a.first} et moi, on est riches et amoureux. Je n'y comprends toujours rien.", en: "I put {$amount} into DogeBanana. It doubled in a week. {a.first} and I are rich and in love. I still don't understand any of it." }, fx: { money: 'amount', happy: 10, rel: 15, actorRole: 'partner' }, mood: 'love' },
          { w: 3, text: { fr: "J'ai investi {$amount}. Le DogeBanane a disparu en une nuit, {a.first} aussi. Il me reste un t-shirt « TO THE MOON ».", en: "I invested {$amount}. DogeBanana vanished overnight, and so did {a.first}. All I have left is a 'TO THE MOON' t-shirt." }, fx: { money: '-amount', happy: -8 }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Fuir poliment', en: 'Politely flee' }, text: { fr: "J'ai prétexté une allergie aux graphiques et je suis parti{|e}. Mon compte en banque m'a remercié{|e}.", en: 'I claimed to be allergic to charts and left. My bank account thanked me.' }, fx: { happy: 3 } },
      { label: { fr: 'Contre-attaquer', en: 'Counterattack' }, text: { fr: "J'ai riposté avec trente minutes sur mon livret d'épargne. {a.first} s'est endormi{a:|e} sur sa tablette. Match nul.", en: '{a.first} fell asleep on the tablet after I countered with thirty minutes about my savings account. A draw.' }, fx: { happy: 4 } },
    ],
  },
  {
    id: 'lv_speed_dating',
    icon: '⏱️',
    cat: 'love',
    rating: 0,
    actor: { create: { role: 'acquaintance', age: [-5, 8], gender: 'attracted' } },
    scene: { place: 'party', mood: 'neutral', prop: 'hourglass' },
    when: { age: [23, 60], noHas: 'lover' },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Soirée speed dating : sept minutes par personne. En face de toi, {a.first}, {a.age} ans, attaque : « Alors, ton plus gros défaut, à part être en retard ? »", "Le speed dating touche à sa fin. Ton dernier tête-à-tête, {a.first}, a apporté son propre sablier, « pour être sûr{a:|e} »."],
      en: ["Speed dating night: seven minutes per person. Across from you, {a.first}, {a.age}, opens with: 'So, what's your worst flaw, besides being late?'", "Speed dating is wrapping up. Your last one-on-one, {a.first}, brought {a:his|her} own hourglass 'just to be sure'."],
    },
    choices: [
      {
        label: { fr: 'Sortir le grand jeu', en: 'Turn on the charm' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "J'ai sorti mes meilleures anecdotes en sept minutes chrono. {a.first} a coché « oui » trois fois sur sa fiche. Rendez-vous pris.", en: "I delivered my best anecdotes in seven minutes flat. {a.first} ticked 'yes' three times on the form. Date set." }, fx: { happy: 10, rel: 15, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "J'ai parlé si vite que {a.first} a cru que je faisais un AVC et a appelé un serveur.", en: '{a.first} thought I was having a stroke because I talked so fast, and called a waiter.' }, fx: { happy: -5, stress: 4 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Questions pièges', en: 'Ask trick questions' }, text: { fr: "J'ai demandé à {a.first} comment {a:il|elle} survivrait à une invasion de canards. Sa réponse était terrifiante et brillante. Depuis, on s'envoie des mèmes.", en: 'I asked {a.first} how {a:he|she} would survive a duck invasion. The answer was terrifying and brilliant. We trade memes now.' }, fx: { happy: 5, actorRole: 'friend', rel: 10 } },
      { label: { fr: 'Filer au buffet', en: 'Hit the buffet' }, text: { fr: "J'ai passé le reste de la soirée au buffet. J'ai trouvé l'amour : des mini-quiches.", en: 'I spent the rest of the night at the buffet. I found love: mini quiches.' }, fx: { happy: 4, weight: 0.02 } },
    ],
  },
  {
    id: 'lv_app_match',
    icon: '📲',
    cat: 'love',
    rating: 1,
    actor: { create: { role: 'acquaintance', age: [-6, 8], gender: 'attracted' } },
    scene: { place: 'party', mood: 'shock', prop: 'phone' },
    when: { age: [24, 55], noHas: 'lover' },
    weight: 10,
    cooldown: 3,
    text: {
      fr: ["Rendez-vous Tinder avec {a.first}, {a.age} ans. {a:Il|Elle} est venu{a:|e} avec sa mère. « Elle voulait juste vérifier que t'es pas un{|e} psychopathe. » La mère commande une entrée.", "Ton match {a.first} arrive au bar déjà bien éméché{a:|e}, te prend pour quelqu'un d'autre, puis finit ton verre. C'est un début."],
      en: ["Tinder date with {a.first}, {a.age}. {a:He|She} brought {a:his|her} mother. 'She just wanted to make sure you're not a psycho.' The mother orders a starter.", 'Your match {a.first} shows up at the bar already tipsy, mistakes you for someone else, then finishes your drink. It\'s a start.'],
    },
    choices: [
      {
        label: { fr: 'Jouer le jeu', en: 'Roll with it' },
        out: [
          { w: 2, text: { fr: "J'ai joué le jeu. Soirée absurde, fou rire, puis un baiser sous un lampadaire qui clignotait. On remet ça.", en: 'I rolled with it. Absurd night, giggles, then a kiss under a flickering streetlight. We\'re doing it again.' }, fx: { happy: 10, rel: 15, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "J'ai joué le jeu. À minuit, {a.first} m'a demandé de lui avancer 200 balles « pour un truc ». Je suis rentré{|e} seul{|e}, en Uber, en méditant.", en: "I rolled with it. At midnight, {a.first} asked me to spot {a.him} 200 bucks 'for a thing'. I went home alone, in an Uber, reflecting." }, fx: { money: -30, happy: -6 } },
        ],
      },
      { label: { fr: 'Prétexter une fuite', en: 'Fake a burst pipe' }, text: { fr: "J'ai prétexté une fuite d'eau chez moi. {a.first} m'a écrit trois jours après : « Alors, cette fuite ? » J'ai bloqué le numéro.", en: "I claimed a pipe burst at home. Three days later {a.first} texted: 'So, how's the leak?' I blocked the number." }, fx: { happy: 2, karma: -2 } },
      { label: { fr: 'Boire pour rattraper', en: 'Drink to catch up' }, text: { fr: "J'ai bu pour rattraper {a.first}. Je me suis réveillé{|e} avec un tatouage « YOLO ». Il est écrit « YOOL ».", en: "I drank to catch up with {a.first}. I woke up with a 'YOLO' tattoo. It says 'YOOL'." }, fx: { happy: -3, health: -3, looks: -2, addiction: ['alcohol', 3] }, mood: 'sick' },
    ],
  },
  {
    id: 'lv_catfish',
    icon: '🎣',
    cat: 'love',
    rating: 1,
    actor: { create: { role: 'acquaintance', age: [-6, 8], gender: 'attracted' } },
    scene: { place: 'park', mood: 'shock', prop: 'bench' },
    when: { age: [24, 60], noHas: 'lover' },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Ça fait trois mois que tu parles avec {a.first} en ligne. Photos de rêve, humour parfait, jamais dispo en visio. {a:Il|Elle} accepte enfin un rendez-vous au parc.", "{a.first}, ton crush virtuel depuis des mois, te donne enfin rendez-vous. {a:Il|Elle} précise : « Je ressemble un peu moins à mes photos en vrai. »"],
      en: ["You've been chatting with {a.first} online for three months. Dream photos, perfect humor, never free for a video call. {a:He|She} finally agrees to meet at the park.", "{a.first}, your online crush for months, finally agrees to meet. {a:He|She} adds: 'I look a little less like my photos in real life.'"],
    },
    choices: [
      {
        label: { fr: 'Y aller', en: 'Go' },
        out: [
          { w: 2, text: { fr: "Sur le banc m'attendait un monsieur de 58 ans nommé Gérard. « {a.first}, c'est moi. » On a parlé deux heures. Gérard est sympa. Mais Gérard n'est pas {a.first}.", en: "Waiting on the bench was a 58-year-old man named Gérard. '{a.first}? That's me.' We talked for two hours. Gérard is nice. But Gérard is not {a.first}." }, fx: { happy: -8, stress: 5 }, mood: 'shock' },
          { w: 1, text: { fr: "{a.first} était encore mieux qu'en photo. Sa caméra était juste cassée depuis 2019. Je suis sous le charme.", en: "{a.first} was even better than the photos. {a:His|Her} camera had just been broken since 2019. I'm smitten." }, fx: { happy: 12, rel: 20, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "{a.first} était en fait un robot d'arnaque qui voulait mes coordonnées bancaires. Je les ai données. Par amour.", en: "{a.first} was actually a scam bot after my bank details. I gave them. For love." }, fx: { money: -500, happy: -10 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Exiger une visio', en: 'Demand a video call' },
        out: [
          { w: 1, text: { fr: "{a.first} est apparu{a:|e} à l'écran : réel{a:|le}, un peu flou, très mignon{a:|ne}. Soulagement total.", en: '{a.first} appeared on screen: real, a bit blurry, very cute. Total relief.' }, fx: { happy: 8, rel: 10, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "{a.first} a coupé la caméra en criant « problème de wifi », mais j'ai eu le temps d'apercevoir une moustache grise.", en: "{a.first} killed the camera yelling 'wifi problems', but I caught a glimpse of a grey mustache." }, fx: { happy: -5 } },
        ],
      },
      { label: { fr: 'Envoyer un pote', en: 'Send a friend instead' }, text: { fr: "J'ai envoyé un pote en éclaireur. Il est revenu fiancé à Gérard, 58 ans. Je suis témoin au mariage.", en: "I sent a buddy to scout. He came back engaged to Gérard, 58. I'm the best man at the wedding." }, fx: { happy: 6, karma: 2 } },
    ],
  },
  {
    id: 'lv_dick_pic',
    icon: '🍆',
    cat: 'love',
    rating: 2,
    actor: { create: { role: 'acquaintance', age: [-6, 8], gender: 'attracted' } },
    scene: { place: 'apartment', mood: 'shock', prop: 'phone' },
    when: { age: [24, 55] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: ["Tu matches avec {a.first}, {a.age} ans. Avant même un « salut », {a:il|elle} t'envoie une photo de son anatomie la plus intime, cadrée et éclairée comme un Caravage. Avec un filtre paillettes.", "Troisième message de {a.first} : une photo de son entrejambe, prise dans les toilettes d'une station-service. On voit le distributeur de savon. On voit beaucoup trop de choses."],
      en: ["You match with {a.first}, {a.age}. Before even a 'hi', {a:he|she} sends you a photo of {a:his|her} most private anatomy, framed and lit like a Caravaggio. With a glitter filter.", "Third message from {a.first}: a crotch shot taken in a gas station restroom. You can see the soap dispenser. You can see way too much."],
    },
    choices: [
      { label: { fr: 'Critiquer la photo', en: 'Review the photo' }, text: { fr: "J'ai répondu par une critique d'art détaillée : composition 4/10, lumière 2/10, sujet « décevant ». {a.first} m'a bloqué{|e}. J'ai encadré ma critique.", en: "I replied with a detailed art review: composition 4/10, lighting 2/10, subject 'underwhelming'. {a.first} blocked me. I framed my review." }, fx: { happy: 8 }, mood: 'proud' },
      { label: { fr: 'Répondre par une courgette', en: 'Reply with a zucchini' }, text: { fr: "J'ai répondu par la photo d'une courgette XXL, légende : « On parlait de ça ? ». {a.first} a fait une crise d'ego. Je me suis senti{|e} toute-puissant{|e}.", en: "I replied with a photo of a massive zucchini captioned 'were we talking about this?'. {a.first} had an ego meltdown. I felt all-powerful." }, fx: { happy: 6 } },
      { label: { fr: 'Signaler et bloquer', en: 'Report and block' }, text: { fr: "J'ai signalé le profil. L'appli m'a remercié{|e}, puis m'a proposé {a.first} en « profil suggéré » le lendemain.", en: "I reported the profile. The app thanked me, then suggested {a.first} as a 'recommended profile' the next day." }, fx: { happy: -3, karma: 2 } },
    ],
  },
  {
    id: 'lv_ghosted',
    icon: '👻',
    cat: 'love',
    rating: 0,
    auto: true,
    scene: { place: 'apartment', mood: 'sad', prop: 'phone' },
    when: { age: [18, 60], noHas: 'lover' },
    weight: 6,
    cooldown: 5,
    text: {
      fr: ["Après trois rendez-vous parfaits, je me suis fait ghoster. Plus un message. Je vérifie sur Insta que la personne est vivante. Elle l'est. Elle va très bien.", "Mon match m'a ghosté{|e} pile au moment où je lui envoyais un poème. Le poème est resté sur « distribué ». Moi aussi."],
      en: ["After three perfect dates, I got ghosted. Not a word. I check Insta to see if they're alive. They are. They're doing great.", "My match ghosted me right as I sent them a poem. The poem stayed on 'delivered'. So did I."],
    },
    fx: { happy: -5 },
  },

  // ───────────────────────────── one-night stands ─────────────────────────────
  {
    id: 'lv_one_night',
    icon: '🍸',
    cat: 'love',
    rating: 1,
    actor: { create: { role: 'acquaintance', age: [0, 6], gender: 'attracted' } },
    scene: { place: 'party', mood: 'party', prop: 'cocktail' },
    when: { age: [18, 40], noHas: 'lover' },
    weight: 10,
    cooldown: 3,
    text: {
      fr: ["En soirée, {a.first} danse collé{a:|e} à toi depuis une heure et te glisse à l'oreille : « On va chez toi ou chez moi ? » Tu en es à ton quatrième mojito.", "Fin de soirée. {a.first}, rencontré{a:|e} il y a trois heures près du buffet, propose de « prolonger la soirée ». Ses intentions sont aussi claires que son regard."],
      en: ["At a party, {a.first} has been dancing pressed against you for an hour and whispers: 'Your place or mine?' You're on your fourth mojito.", "End of the night. {a.first}, whom you met three hours ago by the buffet, suggests you 'keep the party going'. {a:His|Her} intentions are crystal clear."],
    },
    choices: [
      {
        label: { fr: 'Chez moi !', en: 'My place!' },
        out: [
          { w: 2, text: { fr: "Nuit torride avec {a.first}. Le lendemain, mes voisins avaient glissé un mot sous ma porte. Il disait juste : « Bravo. »", en: "Steamy night with {a.first}. The next day my neighbors slipped a note under my door. It just said: 'Bravo.'" }, fx: { happy: 12, stress: -6, flag: 'lv_onenight' }, mood: 'love' },
          { w: 1, text: { fr: "{a.first} s'est endormi{a:|e} sur mon canapé avant même le premier bisou. Au réveil, {a:il|elle} avait vidé mon frigo et était parti{a:|e}.", en: '{a.first} fell asleep on my couch before the first kiss. By morning {a:he|she} had emptied my fridge and left.' }, fx: { happy: -2 } },
        ],
      },
      { label: { fr: 'Chez toi !', en: 'Your place!' }, text: { fr: "Je suis parti{|e} chez {a.first}. La nuit a été mémorable. Le réveil, beaucoup moins.", en: "I went back to {a.first}'s place. The night was memorable. The morning, much less so." }, fx: { happy: 10, flag: 'lv_onenight', chain: 'lv_walk_of_shame' }, mood: 'love' },
      {
        label: { fr: 'Juste un numéro', en: 'Just a number' },
        out: [
          { w: 1, text: { fr: "J'ai demandé son numéro. {a.first} m'a donné celui d'une pizzeria. La pizza était bonne.", en: '{a.first} gave me the number of a pizza place when I asked for {a:his|hers}. The pizza was good.' }, fx: { happy: 1 } },
          { w: 1, text: { fr: "On a échangé nos numéros. On s'écrit tous les jours depuis. Je crois que c'est sérieux.", en: "We swapped numbers. We've texted every day since. I think it's serious." }, fx: { happy: 8, rel: 12, actorRole: 'partner' }, mood: 'love' },
        ],
      },
    ],
  },
  {
    id: 'lv_walk_of_shame',
    icon: '👠',
    cat: 'love',
    rating: 1,
    chainOnly: true,
    scene: { place: 'apartment', mood: 'sleepy', prop: 'shoe' },
    when: { age: [18, 60] },
    text: {
      fr: ["Lendemain matin chez {a.first}. Tu te réveilles avec un chat sur la tête, une seule chaussure et aucun souvenir du code de la porte. {a.first} dort encore.", "7 h 12. Tu ouvres les yeux chez {a.first}. Il y a un poster de dauphin au plafond et {ton caleçon|ta culotte} reste introuvable. Le walk of shame commence."],
      en: ["Morning after at {a.first}'s place. You wake up with a cat on your head, one shoe and zero memory of the door code. {a.first} is still asleep.", "7:12 a.m. You open your eyes at {a.first}'s place. There's a dolphin poster on the ceiling and your underwear is nowhere to be found. The walk of shame begins."],
    },
    choices: [
      {
        label: { fr: 'Filer en douce', en: 'Sneak out' },
        out: [
          { w: 2, text: { fr: "J'ai traversé la ville en tenue de soirée à 8 h du matin, une chaussure à la main. La boulangère m'a offert un croissant. Par pitié.", en: 'I crossed town in party clothes at 8 a.m., one shoe in hand. The bakery lady gave me a croissant. Out of pity.' }, fx: { happy: 3, looks: -2 } },
          { w: 1, text: { fr: "En filant en douce, j'ai croisé les parents de {a.first} dans l'escalier. Ils m'ont proposé un café. J'ai accepté. C'était très, très long.", en: "Sneaking out, I ran into {a.first}'s parents on the stairs. They offered me coffee. I accepted. It was very, very long." }, fx: { stress: 6, happy: -3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Préparer le petit-déj', en: 'Make breakfast' },
        out: [
          { w: 1, text: { fr: "J'ai fait des crêpes. {a.first} s'est réveillé{a:|e} avec un grand sourire. On s'est revus. Puis encore. Apparemment, on sort ensemble.", en: "I made pancakes. {a.first} woke up with a big smile. We saw each other again. And again. Apparently we're dating." }, fx: { happy: 10, rel: 15, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "J'ai fait des œufs brouillés. Le coloc de {a.first} les a mangés, puis m'a demandé qui j'étais. Personne ne savait vraiment.", en: "I made scrambled eggs. {a.first}'s roommate ate them, then asked who I was. Nobody really knew." }, fx: { happy: -2 } },
        ],
      },
      { label: { fr: 'Voler un sweat', en: 'Steal a hoodie' }, text: { fr: "Je suis reparti{|e} avec le sweat de {a.first}. Il sent bon. Je ne le rendrai jamais. C'est mon trophée.", en: "I left with {a.first}'s hoodie. It smells nice. I'm never giving it back. It's my trophy." }, fx: { happy: 5, karma: -2 } },
    ],
  },
  {
    id: 'lv_one_night_trash',
    icon: '🦞',
    cat: 'love',
    rating: 2,
    actor: { create: { role: 'acquaintance', age: [0, 8], gender: 'attracted' } },
    scene: { place: 'apartment', mood: 'sick', prop: 'lobster' },
    when: { age: [18, 45], noHas: 'lover' },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Gueule de bois intersidérale. Tu te réveilles dans un lit qui n'est pas le tien, à côté de {a.first}, en pyjama licorne. Toi, tu portes un casque de chantier. Rien d'autre.", "Hier soir, tu as roulé des pelles à {a.first} sur une table de billard, sous les applaudissements du bar. Ce matin, tu te réveilles dans sa baignoire. Il y a un homard vivant dans le lavabo."],
      en: ["Interstellar hangover. You wake up in a bed that isn't yours, next to {a.first} in a unicorn onesie. You're wearing a hard hat. Nothing else.", "Last night you made out with {a.first} on a pool table while the whole bar cheered. This morning you wake up in {a:his|her} bathtub. There's a live lobster in the sink."],
    },
    choices: [
      {
        label: { fr: 'Reconstituer la soirée', en: 'Reconstruct the night' },
        out: [
          { w: 1, text: { fr: "J'ai reconstitué la soirée grâce aux stories de 14 inconnus. J'ai fait un strip-tease sur du Céline Dion et kidnappé le homard. Je suis une légende locale.", en: "I pieced the night together from 14 strangers' stories. I did a striptease to Celine Dion and kidnapped the lobster. I'm a local legend." }, fx: { fame: 3, followers: 800, happy: 6, karma: -2, flag: 'lv_onenight' }, mood: 'party' },
          { w: 1, text: { fr: "{a.first} m'a tout raconté en détail. Tout. J'aurais préféré ne jamais savoir, pour le homard.", en: '{a.first} told me everything in detail. Everything. I wish I never knew about the lobster.' }, fx: { happy: -4, stress: 6, flag: 'lv_onenight' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Fuir par la fenêtre', en: 'Escape out the window' },
        out: [
          { w: 2, text: { fr: "Je suis sorti{|e} par la fenêtre du rez-de-chaussée, en casque de chantier. Les ouvriers d'en face m'ont applaudi{|e}. Respect mutuel.", en: 'I climbed out the ground-floor window in my hard hat. The construction workers across the street applauded. Mutual respect.' }, fx: { happy: 4, flag: 'lv_onenight' } },
          { w: 1, text: { fr: "J'ai sauté par la fenêtre. Premier étage, pas rez-de-chaussée. Cheville en vrac, dignité en miettes, fesses à l'air.", en: 'I jumped out the window. Second floor, not ground floor. Busted ankle, shattered dignity, bare butt.' }, fx: { disease: 'sprain', health: -6, happy: -5, flag: 'lv_onenight' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Proposer un deuxième round', en: 'Go for round two' },
        out: [
          { w: 1, text: { fr: "J'ai proposé un deuxième round. {a.first} a dit oui, et on a fait la grasse mat' jusqu'à 17 h. On se revoit samedi. Avec le homard.", en: "I suggested round two. {a.first} said yes, and we slept in until 5 p.m. We're seeing each other Saturday. With the lobster." }, fx: { happy: 10, rel: 15, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "J'ai proposé un deuxième round. {a.first} m'a tendu mes affaires, un plan du métro et un Doliprane.", en: '{a.first} answered my round-two offer by handing me my clothes, a subway map and an aspirin.' }, fx: { happy: -6 } },
        ],
      },
    ],
  },
  {
    id: 'lv_std_scare',
    icon: '🦠',
    cat: 'health',
    rating: 2,
    scene: { place: 'hospital', mood: 'sick', prop: 'clipboard' },
    when: { age: [18, 65], flag: 'lv_onenight' },
    weight: 10,
    cooldown: 3,
    text: {
      fr: ["Depuis ta dernière aventure d'un soir, ça gratte. Beaucoup. Tu te grattes en réunion, au supermarché et chez ta grand-mère. Il serait temps de consulter.", "Ça brûle quand tu fais pipi. Tu as cherché tes symptômes sur Internet : selon Google, tu as soit une IST, soit trois jours à vivre."],
      en: ["Ever since your last one-night stand, it itches. A lot. You scratch in meetings, at the supermarket and at your grandma's. Might be time to see someone.", "It burns when you pee. You googled your symptoms: according to the internet, you have either an STD or three days to live."],
    },
    choices: [
      {
        label: { fr: 'Aller au dépistage', en: 'Get tested' },
        out: [
          { w: 2, text: { fr: "Dépistage : IST confirmée. Le médecin m'a donné des antibiotiques et un regard plein de jugement. Je dois prévenir mes partenaires. Toute la liste.", en: "Test results: STD confirmed. The doctor gave me antibiotics and a deeply judgmental look. I have to notify my partners. The whole list." }, fx: { disease: 'std', happy: -6, stress: 6, unflag: 'lv_onenight' }, mood: 'sick' },
          { w: 1, text: { fr: "Fausse alerte : allergie à ma nouvelle lessive bio. J'ai pleuré de soulagement dans la salle d'attente, devant des gens inquiets.", en: 'False alarm: allergic to my new organic detergent. I sobbed with relief in the waiting room, in front of worried strangers.' }, fx: { happy: 6, stress: -6, unflag: 'lv_onenight' }, mood: 'happy' },
          { w: 1, text: { fr: "Le médecin a regardé, puis appelé deux collègues pour qu'ils regardent aussi, « pour la science ». Rien de grave. Je suis désormais un cas d'école.", en: "The doctor looked, then called two colleagues to look too, 'for science'. Nothing serious. I'm now a textbook case." }, fx: { happy: -2, fame: 1, unflag: 'lv_onenight' } },
        ],
      },
      { label: { fr: "Soigner à l'ail", en: 'Treat it with garlic' }, text: { fr: "J'ai suivi un remède trouvé sur un forum : ail, vinaigre, prière. Ça brûle dix fois plus et je sens la vinaigrette. Verdict du médecin : IST, et « vous êtes sérieux{|se} ? ».", en: "I followed a forum remedy: garlic, vinegar, prayer. It burns ten times worse and I smell like salad dressing. Doctor's verdict: STD, and 'are you serious?'." }, fx: { disease: 'std', health: -6, happy: -8, unflag: 'lv_onenight' }, mood: 'sick' },
      {
        label: { fr: 'Ignorer', en: 'Ignore it' },
        out: [
          { w: 1, text: { fr: "J'ai ignoré le problème. Il est parti tout seul. Je ne saurai jamais ce que c'était, et c'est très bien comme ça.", en: "I ignored it. It went away on its own. I'll never know what it was, and that's fine." }, fx: { happy: 2, unflag: 'lv_onenight' } },
          { w: 2, text: { fr: "J'ai ignoré le problème. Le problème ne m'a pas ignoré{|e}. IST carabinée et trois semaines à marcher comme un cow-boy.", en: "I ignored the problem. The problem did not ignore me. Raging STD and three weeks of walking like a cowboy." }, fx: { disease: 'std', health: -8, happy: -8, unflag: 'lv_onenight' }, mood: 'sick' },
        ],
      },
    ],
  },

  // ───────────────────────────── cheating ─────────────────────────────
  {
    id: 'lv_tempted',
    icon: '😏',
    cat: 'love',
    rating: 1,
    actor: { create: { role: 'acquaintance', age: [0, 8], gender: 'attracted' } },
    scene: { place: 'party', mood: 'love', prop: 'cocktail' },
    when: { age: [20, 60], has: 'lover' },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["À un afterwork, {a.first}, {a.age} ans, te fait du rentre-dedans sans aucune subtilité. Tu es en couple. Tu le sais. Ton troisième verre, beaucoup moins.", "{a.first}, rencontré{a:|e} au mariage d'un pote, te fixe depuis le buffet et vient de te faire passer une serviette : « On s'éclipse ? »"],
      en: ["At after-work drinks, {a.first}, {a.age}, is hitting on you with zero subtlety. You're in a relationship. You know it. Your third drink, much less so.", "{a.first}, whom you met at a friend's wedding, has been staring at you from the buffet and just passed you a napkin: 'Shall we sneak off?'"],
    },
    choices: [
      {
        label: { fr: 'Craquer', en: 'Give in' },
        out: [
          { w: 2, text: { fr: "J'ai craqué. Puis j'ai menti à la maison. Puis j'ai recraqué. J'ai désormais deux vies et un agenda à code couleur.", en: 'I gave in. Then I lied at home. Then I gave in again. I now have two lives and a color-coded calendar.' }, fx: { happy: 8, stress: 10, karma: -10, rel: 15, flag: 'cheating', actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "J'ai craqué. Au moment critique, {a.first} m'a appelé{|e} par le mauvais prénom. Je suis rentré{|e} vexé{|e}, mais techniquement fidèle.", en: '{a.first} called me by the wrong name at the critical moment. I went home offended, but technically faithful.' }, fx: { happy: -3, karma: -5 } },
        ],
      },
      { label: { fr: 'Rester fidèle', en: 'Stay faithful' }, text: { fr: "J'ai montré une photo de mon couple à {a.first}. {a:Il|Elle} a dit « dommage » et s'est rabattu{a:|e} sur le DJ.", en: "I showed {a.first} a photo of my partner. {a:He|She} said 'shame' and moved on to the DJ." }, fx: { karma: 6, happy: 2 } },
      { label: { fr: 'Juste flirter', en: 'Just flirt' }, text: { fr: "J'ai juste flirté un peu. En rentrant, j'ai culpabilisé si fort que j'ai fait le ménage de tout l'appartement à 2 h du matin.", en: 'I just flirted a little. Back home, I felt so guilty I cleaned the entire apartment at 2 a.m.' }, fx: { karma: -2, stress: 4 } },
    ],
  },
  {
    id: 'lv_caught_cheating',
    icon: '🕵️',
    cat: 'love',
    rating: 1,
    actor: 'lover',
    scene: { place: 'home', mood: 'angry', prop: 'phone' },
    when: { age: [18, 80], flag: 'cheating' },
    weight: 14,
    cooldown: 2,
    text: {
      fr: ["{a.first} a trouvé des messages sur ton téléphone. Ton contact « Plombier » t'envoie des cœurs et des selfies en peignoir. {a.first} attend une explication, bras croisés.", "{a.first} a trouvé un ticket de resto pour deux, daté d'un soir où tu étais « à la salle de sport ». Tu n'as jamais mis les pieds dans une salle de sport. {a:Il|Elle} le sait."],
      en: ["{a.first} found messages on your phone. Your contact 'Plumber' sends you hearts and bathrobe selfies. {a.first} is waiting for an explanation, arms crossed.", "{a.first} found a restaurant receipt for two, from a night you were 'at the gym'. You've never set foot in a gym. {a:He|She} knows it."],
    },
    choices: [
      {
        label: { fr: 'Tout nier', en: 'Deny everything' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai tout nié avec un aplomb d'avocat. {a.first} m'a cru{|e}. Je me dégoûte un peu. Pas assez pour arrêter.", en: '{a.first} believed me after I denied everything like a seasoned lawyer. I disgust myself a little. Not enough to stop.' }, fx: { rel: -5, karma: -6, stress: 6 } },
          { w: 2, text: { fr: "J'ai tout nié. {a.first} a sorti des captures d'écran imprimées, classées, surlignées. Mes affaires étaient sur le palier une heure plus tard.", en: '{a.first} pulled out printed, filed, highlighted screenshots when I denied it. My stuff was on the landing an hour later.' }, fx: { rel: -60, actorRole: 'ex', happy: -12, unflag: 'cheating' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Avouer et supplier', en: 'Confess and beg' },
        out: [
          { w: 1, text: { fr: "J'ai tout avoué en pleurant. {a.first} m'a accordé une seconde chance, et un mot de passe sur tous mes appareils.", en: "I confessed everything in tears. {a.first} gave me a second chance, and put passwords on all my devices." }, fx: { rel: -25, karma: 3, happy: -6, unflag: 'cheating' } },
          { w: 1, text: { fr: "J'ai avoué. {a.first} a balancé mes vêtements par la fenêtre. Mon {caleçon|soutien-gorge} préféré a atterri sur le scooter du voisin.", en: "I confessed. {a.first} threw my clothes out the window. My favorite underwear landed on the neighbor's scooter." }, fx: { rel: -70, actorRole: 'ex', happy: -12, unflag: 'cheating' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Retourner la situation', en: 'Flip it around' }, text: { fr: "J'ai accusé {a.first} de fouiller dans mon téléphone. Ça a marché dix secondes. Puis {a:il|elle} m'a quitté{|e} pour mauvaise foi aggravée.", en: 'I accused {a.first} of snooping through my phone. It worked for ten seconds. Then {a:he|she} dumped me for aggravated bad faith.' }, fx: { rel: -50, actorRole: 'ex', karma: -5, happy: -8, unflag: 'cheating' }, mood: 'sad' },
    ],
  },
  {
    id: 'lv_caught_in_closet',
    icon: '🚪',
    cat: 'love',
    rating: 2,
    actor: 'lover',
    scene: { place: 'home', mood: 'shock', prop: 'wardrobe' },
    when: { age: [18, 75], flag: 'cheating' },
    weight: 8,
    cooldown: 2,
    text: {
      fr: ["Bruit de clés dans la serrure. {a.first} rentre deux heures plus tôt. Toi, tu es en chaussettes, avec ta liaison, dans le dressing. Il fait très chaud et très silencieux.", "{a.first} ouvre la porte de la chambre au pire moment. Ta liaison et toi, sous la couette, faites semblant d'être un tas de linge sale. Un tas de linge qui respire fort."],
      en: ["Keys in the lock. {a.first} is home two hours early. You're in your socks, with your fling, inside the closet. It's very hot and very quiet.", "{a.first} opens the bedroom door at the worst possible moment. You and your fling, under the duvet, pretend to be a pile of laundry. A pile of laundry that's breathing heavily."],
    },
    choices: [
      { label: { fr: "« C'est pas ce que tu crois »", en: "'It's not what it looks like'" }, text: { fr: "J'ai dit « C'est pas ce que tu crois ». {a.first} a demandé ce que c'était, alors. J'ai dit « un cours de yoga ». Mes affaires ont volé par la fenêtre. Moi aussi, presque.", en: "I said 'It's not what it looks like.' {a.first} asked what it was, then. I said 'yoga class'. My stuff flew out the window. Nearly me too." }, fx: { rel: -60, actorRole: 'ex', happy: -12, unflag: 'cheating' }, mood: 'cry' },
      {
        label: { fr: 'Sauter par la fenêtre', en: 'Jump out the window' },
        out: [
          { w: 1, text: { fr: "J'ai sauté par la fenêtre en {caleçon|culotte}. Bras cassé, buisson de ronces, voisins aux balcons. Le quartier m'appelle désormais « l'Écureuil ».", en: "I jumped out the window in my underwear. Broken arm, bramble bush, neighbors on their balconies. The whole block calls me 'the Squirrel' now." }, fx: { disease: 'broken_arm', health: -8, happy: -8, rel: -50, actorRole: 'ex', unflag: 'cheating' }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai atterri sur le barbecue des voisins, en pleine fête d'anniversaire. On m'a servi une merguez. {a.first} m'a largué{|e} au mégaphone depuis le balcon.", en: "I landed on the neighbors' barbecue in the middle of a birthday party. Someone handed me a sausage. {a.first} dumped me through a megaphone from the balcony." }, fx: { rel: -60, actorRole: 'ex', happy: -6, unflag: 'cheating' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: "L'inviter à se joindre", en: 'Invite {a.him} to join' },
        out: [
          { w: 3, text: { fr: "J'ai proposé à {a.first} de nous rejoindre. La gifle a été si sonore que le voisin a appelé les pompiers. C'est fini, et j'ai un acouphène.", en: 'I invited {a.first} to join us. The slap was so loud the neighbor called the fire department. It\'s over, and I have tinnitus.' }, fx: { rel: -70, actorRole: 'ex', health: -4, happy: -8, unflag: 'cheating' }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai proposé à {a.first} de nous rejoindre. Long silence. Puis : « ...Je vais chercher du vin. » Je ne comprends plus rien à ma vie.", en: "I invited {a.first} to join us. Long silence. Then: '...I'll get the wine.' I no longer understand my own life." }, fx: { rel: 5, happy: 10, karma: -3, unflag: 'cheating' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'lv_cheat_auto',
    icon: '🤥',
    cat: 'love',
    rating: 1,
    auto: true,
    scene: { place: 'home', mood: 'shock', prop: 'phone' },
    when: { age: [18, 80], flag: 'cheating', has: 'lover' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["Cette année, j'ai inventé onze séminaires, trois enterrements et un stage de poterie pour couvrir mes infidélités. Je n'ai jamais eu autant d'imagination.", "J'ai failli envoyer « bisous mon cœur » à la mauvaise personne. Mon téléphone contient désormais deux contacts « Mon cœur ». Je vis dans la terreur."],
      en: ["This year I invented eleven seminars, three funerals and a pottery workshop to cover my affairs. I've never been so creative.", "I nearly sent 'love you babe' to the wrong person. My phone now has two contacts named 'Babe'. I live in terror."],
    },
    fx: { stress: 8, karma: -3, happy: 2 },
  },

  // ───────────────────────────── jealousy & routine ─────────────────────────────
  {
    id: 'lv_jealous_gym',
    icon: '💪',
    cat: 'love',
    rating: 0,
    actor: 'lover',
    scene: { place: 'home', mood: 'angry', prop: 'dumbbell' },
    when: { age: [18, 65] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["{a.first} s'est inscrit{a:|e} à la salle de sport. Son coach s'appelle Enzo-Valentin, mesure 1,92 m et lui envoie des « bravo champion{a:|ne} 💪 » à 23 h.", "Depuis trois semaines, {a.first} parle de « son coach » au moins six fois par repas. Tu commences à détester les protéines."],
      en: ["{a.first} joined a gym. {a:His|Her} trainer is called Enzo-Valentin, is six-foot-four and texts {a.him} 'great job champ 💪' at 11 p.m.", "For three weeks, {a.first} has mentioned 'my trainer' at least six times per meal. You're starting to hate protein."],
    },
    choices: [
      {
        label: { fr: "M'inscrire aussi", en: 'Join the gym too' },
        out: [
          { w: 1, text: { fr: "Je me suis inscrit{|e} à la même salle. Enzo-Valentin est adorable, marié et fan de crochet. Et moi, j'ai des abdos.", en: "I joined the same gym. Enzo-Valentin is adorable, married and into crochet. And now I have abs." }, fx: { athletic: 6, happy: 4, rel: 5 }, mood: 'proud' },
          { w: 1, text: { fr: "Je me suis inscrit{|e} pour surveiller. Je me suis froissé un muscle dont j'ignorais l'existence en soulevant 4 kg.", en: "I joined to keep an eye on things. I pulled a muscle I didn't know existed lifting ten pounds." }, fx: { health: -5, disease: 'sprain', happy: -3 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Faire une scène', en: 'Make a scene' }, text: { fr: "J'ai fait une crise de jalousie devant toute la salle. Enzo-Valentin m'a proposé un cours de gestion des émotions. Offert.", en: 'I threw a jealous fit in front of the whole gym. Enzo-Valentin offered me an anger-management class. Free of charge.' }, fx: { rel: -8, happy: -4, stress: 4 }, mood: 'angry' },
      { label: { fr: 'Faire confiance', en: 'Trust {a.him}' }, text: { fr: "J'ai fait confiance à {a.first}. {a:Il|Elle} a perdu 5 kg et m'a offert un massage pour me remercier. La confiance, ça muscle.", en: 'I trusted {a.first}. {a:He|She} lost ten pounds and gave me a massage to say thanks. Trust builds muscle.' }, fx: { rel: 8, happy: 4 } },
    ],
  },
  {
    id: 'lv_jealous_ai',
    icon: '🤖',
    cat: 'love',
    rating: 0,
    actor: 'lover',
    scene: { place: 'apartment', mood: 'angry', prop: 'laptop' },
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["{a.first} t'accuse de parler plus à ton assistant IA qu'à {a:lui|elle}. C'est vrai. Mais l'IA, elle, ne laisse pas traîner ses chaussettes.", "{a.first} a trouvé ton historique avec l'IA. Tu lui as demandé 47 fois « comment savoir si mon couple va bien »."],
      en: ["{a.first} accuses you of talking to your AI assistant more than to {a.him}. Which is true. But the AI doesn't leave socks everywhere.", "{a.first} found your chat history with the AI. You asked it 47 times 'how do I know if my relationship is okay'."],
    },
    choices: [
      { label: { fr: "Désinstaller l'IA", en: 'Uninstall the AI' }, text: { fr: "J'ai désinstallé l'IA devant {a.first}, solennellement. Le soir même, j'ai dû lui demander la météo, une recette et le sens de la vie.", en: 'I solemnly uninstalled the AI in front of {a.first}. That same night I had to ask {a.him} for the weather, a recipe and the meaning of life.' }, fx: { rel: 10, smarts: -2 } },
      {
        label: { fr: "Demander conseil à l'IA", en: 'Ask the AI for advice' },
        out: [
          { w: 1, text: { fr: "L'IA m'a pondu un poème de douze strophes pour me faire pardonner. {a.first} a pleuré. De rire, mais quand même.", en: 'The AI wrote me a twelve-stanza apology poem. {a.first} cried. From laughing, but still.' }, fx: { rel: 4, happy: 4 } },
          { w: 1, text: { fr: "L'IA m'a conseillé de « valider ses émotions ». J'ai dit à {a.first} : « Je valide tes émotions. » {a:Il|Elle} a claqué la porte.", en: "The AI told me to 'validate {a:his|her} feelings'. I told {a.first}: 'I validate your feelings.' {a:He|She} slammed the door." }, fx: { rel: -10, happy: -3 } },
        ],
      },
      { label: { fr: 'Les présenter', en: 'Introduce them' }, text: { fr: "J'ai présenté {a.first} à l'IA. Désormais, c'est {a:lui|elle} qui lui parle tous les soirs. Je suis {jaloux|jalouse}.", en: 'I introduced {a.first} to the AI. Now {a:he|she} talks to it every night. I\'m jealous.' }, fx: { rel: 3, happy: -2 } },
    ],
  },
  {
    id: 'lv_wrong_name',
    icon: '😳',
    cat: 'love',
    rating: 2,
    actor: 'lover',
    scene: { place: 'home', mood: 'shock', prop: 'bed' },
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Moment intime avec {a.first}. Au point culminant, tu cries un prénom. Pas le sien. Celui de ton ex. Ou de ton patron. Tu ne sais plus. {a:Il|Elle} s'est arrêté{a:|e} net.", "En plein câlin très coquin, tu lâches un « Oh oui, Gérard ! ». Tu ne connais aucun Gérard. {a.first} te dévisage comme un contrôleur fiscal."],
      en: ["Intimate moment with {a.first}. At the peak, you yell a name. Not {a:his|hers}. Your ex's. Or your boss's. You're not sure. {a:He|She} stopped dead.", "In the middle of some very naughty cuddling, you moan 'Oh yes, Gérard!'. You don't know any Gérard. {a.first} stares at you like a tax auditor."],
    },
    choices: [
      { label: { fr: "Inventer un dieu grec", en: 'Invent a Greek god' }, text: { fr: "J'ai prétendu que c'était le nom d'un dieu grec de la passion. {a.first} a vérifié sur Wikipédia. Il n'existe aucun dieu Gérard.", en: "I claimed it was the name of a Greek god of passion. {a.first} checked Wikipedia. There is no god named Gérard." }, fx: { rel: -10, happy: -4 } },
      {
        label: { fr: 'Contre-attaquer', en: 'Counterattack' },
        out: [
          { w: 1, text: { fr: "J'ai accusé {a.first} d'avoir un amant secret appelé Gérard. Ça n'avait aucun sens, mais l'attaque surprise a marché. On a fini en fou rire.", en: 'I accused {a.first} of having a secret lover named Gérard. It made no sense, but the surprise attack worked. We ended up in fits of laughter.' }, fx: { rel: 2, happy: 4 } },
          { w: 1, text: { fr: "La contre-attaque a échoué. {a.first} a dormi sur le canapé et, par vengeance, rebaptisé le chat « Gérard ».", en: "The counterattack failed. {a.first} slept on the couch and, out of spite, renamed the cat 'Gérard'." }, fx: { rel: -12, happy: -5 } },
        ],
      },
      { label: { fr: 'Crier le bon prénom ×10', en: 'Yell the right name ×10' }, text: { fr: "Pour compenser, j'ai crié le prénom de {a.first} dix fois, très fort. Les voisins ont tapé au mur. On a explosé de rire. Sauvé{|e}.", en: "To make up for it, I yelled {a.first}'s name ten times, very loudly. The neighbors banged on the wall. We cracked up. Saved." }, fx: { rel: 6, happy: 6 }, mood: 'love' },
    ],
  },
  {
    id: 'lv_routine_netflix',
    icon: '📺',
    cat: 'love',
    rating: 0,
    auto: true,
    actor: 'lover',
    scene: { place: 'home', mood: 'sleepy', prop: 'tv' },
    when: { age: [18, 85] },
    weight: 6,
    cooldown: 4,
    text: {
      fr: ["{a.first} et moi avons passé 2 h 40 à choisir un film. On a fini par regarder le même épisode que d'habitude. Endormissement collectif au générique.", "Notre vie de couple : raclette, série, dodo à 22 h 15. {a.first} appelle ça « notre rituel ». Ma mère appelle ça « la retraite »."],
      en: ["{a.first} and I spent 2 hours 40 minutes picking a movie. We ended up watching the same episode as always. Mutual unconsciousness by the opening credits.", "Our love life: raclette, a series, bed by 10:15. {a.first} calls it 'our ritual'. My mom calls it 'retirement'."],
    },
    fx: { happy: 3, rel: 3, stress: -2 },
  },
  {
    id: 'lv_couple_rut',
    icon: '🛋️',
    cat: 'love',
    rating: 0,
    actor: 'lover',
    vars: { amount: [200, 800] },
    scene: { place: 'home', mood: 'sleepy', prop: 'couch' },
    when: { age: [25, 80] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Samedi soir. {a.first} et toi êtes en pyjama à 19 h, en train de comparer deux marques de lessive. Ton couple vient de prendre quarante ans d'un coup.", "Ce soir, {a.first} t'a demandé « On commande ou on fait des pâtes ? » pour la 312e fois de l'année. La flamme est là, mais en mode veille."],
      en: ["Saturday night. You and {a.first} are in pajamas at 7 p.m., comparing two brands of laundry detergent. Your relationship just aged forty years.", "Tonight {a.first} asked 'Takeout or pasta?' for the 312th time this year. The flame is there, but in standby mode."],
    },
    choices: [
      { label: { fr: 'Week-end surprise', en: 'Surprise weekend' }, text: { fr: "J'ai organisé un week-end surprise à la mer. Il a plu, l'hôtel sentait le chou, et on a ri comme au début. Ça valait bien {$amount}.", en: "I planned a surprise weekend at the beach. It rained, the hotel smelled of cabbage, and we laughed like in the early days. Worth every bit of {$amount}." }, fx: { money: '-amount', rel: 12, happy: 10 }, mood: 'love' },
      {
        label: { fr: 'Cours de salsa', en: 'Salsa lessons' },
        out: [
          { w: 1, text: { fr: "J'ai inscrit notre couple à la salsa. {a.first} a un rythme fou. Moi, j'ai écrasé deux fois le pied du prof. On adore.", en: "I signed us up for salsa. {a.first} has crazy rhythm. I stepped on the teacher's foot twice. We love it." }, fx: { rel: 8, athletic: 3, happy: 5 }, mood: 'happy' },
          { w: 1, text: { fr: "Cours de salsa : dispute sur qui guide, dès la première minute. Retour aux pâtes du samedi, avec soulagement.", en: 'Salsa class: argument over who leads within the first minute. Back to Saturday pasta, with relief.' }, fx: { rel: -3, happy: -1 } },
        ],
      },
      { label: { fr: 'Accepter la routine', en: 'Embrace the routine' }, text: { fr: "J'ai accepté notre routine. Le pyjama, c'est l'amour qui a arrêté de faire semblant.", en: 'I embraced our routine. Pajamas are just love that stopped pretending.' }, fx: { happy: 3, stress: -4, rel: 3 } },
    ],
  },
  {
    id: 'lv_anniversary',
    icon: '🗓️',
    cat: 'love',
    rating: 0,
    actor: 'lover',
    scene: { place: 'home', mood: 'shock', prop: 'gift' },
    when: { age: [18, 85] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["{a.first} t'accueille avec un dîner aux chandelles et un paquet cadeau. « Joyeux anniversaire, mon amour. » Ton cerveau : écran bleu.", "{a.first} te demande, l'air innocent, si tu sais quel jour on est. Tu sens que la réponse n'est pas « mardi »."],
      en: ["{a.first} greets you with a candlelit dinner and a wrapped gift. 'Happy anniversary, my love.' Your brain: blue screen.", "{a.first} innocently asks if you know what day it is. You sense the answer isn't 'Tuesday'."],
    },
    choices: [
      {
        label: { fr: 'Bluffer', en: 'Bluff' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai lâché « Ton vrai cadeau arrive demain, c'est une surprise » avec un aplomb parfait. Nuit blanche à commander un cadeau en express. Sauvé{|e}.", en: "I said 'Your real gift arrives tomorrow, it's a surprise' with perfect confidence. All-nighter ordering a gift with express shipping. Saved." }, fx: { rel: 3, stress: 6, money: -150 } },
          { w: 1, text: { fr: "J'ai bluffé. {a.first} m'a demandé de quel anniversaire je parlais. Je me suis trompé{|e} d'année. Et de mois.", en: '{a.first} asked which anniversary I meant. I got the year wrong. And the month.' }, fx: { rel: -15, happy: -6 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Fleurs de station-service', en: 'Gas station flowers' }, text: { fr: "J'ai couru acheter des fleurs à la station-service. Elles étaient emballées avec un sachet de bœuf séché. {a.first} a apprécié l'effort. Le bœuf, moins.", en: "I ran to buy gas station flowers. They came bundled with a bag of beef jerky. {a.first} appreciated the effort. The jerky, less so." }, fx: { rel: -4, money: -15 } },
      { label: { fr: 'Avouer', en: 'Confess' }, text: { fr: "J'ai avoué avoir oublié. {a.first} a mangé les deux desserts devant moi, lentement, en me fixant. C'était terrifiant.", en: "I confessed I'd forgotten. {a.first} ate both desserts in front of me, slowly, staring at me. It was terrifying." }, fx: { rel: -8, happy: -2 }, mood: 'sad' },
    ],
  },
  {
    id: 'lv_couple_therapy',
    icon: '🗣️',
    cat: 'love',
    rating: 1,
    actor: 'lover',
    vars: { amount: [150, 600] },
    scene: { place: 'office', mood: 'neutral', prop: 'couch' },
    when: { age: [22, 85] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Thérapie de couple avec {a.first}. La psy vous demande de « nommer une chose que vous aimez chez l'autre ». {a.first} réfléchit depuis quatre minutes.", "Séance de thérapie de couple à {$amount}. La thérapeute vous demande de vous regarder dans les yeux pendant deux minutes. {a.first} cligne beaucoup. Toi, tu as envie de pleurer ou de rire."],
      en: ["Couples therapy with {a.first}. The therapist asks you to 'name one thing you love about the other'. {a.first} has been thinking for four minutes.", "A couples therapy session at {$amount}. The therapist asks you to look into each other's eyes for two minutes. {a.first} blinks a lot. You want to cry or laugh."],
    },
    choices: [
      {
        label: { fr: 'Jouer le jeu à fond', en: 'Commit fully' },
        out: [
          { w: 2, text: { fr: "J'ai tout déballé : mes peurs, mes rêves, l'affaire de la raclette de 2021. On s'est retrouvés. La psy a pris des notes, et un mouchoir.", en: 'I let it all out: my fears, my dreams, the raclette incident of 2021. We found each other again. The therapist took notes, and a tissue.' }, fx: { money: '-amount', rel: 15, happy: 6, stress: -6 }, mood: 'love' },
          { w: 1, text: { fr: "J'ai été si honnête que {a.first} a appris trois choses qu'{a:il|elle} ignorait. J'en ai trop dit. Beaucoup trop.", en: 'I was so honest that {a.first} learned three things {a:he|she} didn\'t know. I said too much. Way too much.' }, fx: { money: '-amount', rel: -15, stress: 8 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Tout mettre sur son dos', en: 'Blame it all on {a.him}' }, text: { fr: "J'ai utilisé la séance pour lister les défauts de {a.first}, par ordre alphabétique. La psy m'a demandé de venir seul{|e} la prochaine fois.", en: "I used the session to list {a.first}'s flaws in alphabetical order. The therapist asked me to come alone next time." }, fx: { money: '-amount', rel: -12, happy: 2 } },
      { label: { fr: 'Sécher pour un resto', en: 'Skip it for dinner' }, text: { fr: "On a séché la thérapie et dépensé l'argent au resto. Meilleure séance de l'année.", en: 'We skipped therapy and spent the money on dinner. Best session of the year.' }, fx: { rel: 8, happy: 6, money: -80 }, mood: 'happy' },
    ],
  },
  {
    id: 'lv_fetish',
    icon: '🎭',
    cat: 'love',
    rating: 2,
    actor: 'lover',
    scene: { place: 'home', mood: 'shock', prop: 'costume' },
    when: { age: [20, 75] },
    weight: 6,
    cooldown: 8,
    text: {
      fr: ["{a.first} rougit et t'avoue un fantasme secret : que tu te déguises en contrôleur des impôts et que tu lui reproches ses notes de frais. Avec un accent autrichien.", "Après deux verres, {a.first} te confie son petit fétichisme : les pieds. Pas n'importe lesquels. Les tiens. {a:Il|Elle} a déjà acheté du vernis et un tabouret."],
      en: ["{a.first} blushes and confesses a secret fantasy: you, dressed as a tax inspector, scolding {a.him} about expense reports. With an Austrian accent.", "After two drinks, {a.first} confides {a:his|her} little fetish: feet. Not just any feet. Yours. {a:He|She} has already bought nail polish and a stool."],
    },
    choices: [
      {
        label: { fr: 'Jouer le jeu', en: 'Play along' },
        out: [
          { w: 2, text: { fr: "J'ai joué le jeu avec un sérieux absolu. {a.first} n'a jamais été aussi heureux{a:|se}. Je ne verrai plus jamais certains objets du quotidien de la même façon.", en: '{a.first} has never been happier since I played along with total seriousness. I will never look at certain household objects the same way.' }, fx: { rel: 15, happy: 6 }, mood: 'love' },
          { w: 1, text: { fr: "J'ai joué le jeu, mais j'ai éclaté de rire au pire moment. {a.first} a boudé trois jours. Puis on en a ri ensemble.", en: 'I played along, but burst out laughing at the worst moment. {a.first} sulked for three days. Then we laughed about it together.' }, fx: { rel: -2, happy: 4 } },
        ],
      },
      { label: { fr: 'Proposer un échange', en: 'Propose a trade' }, text: { fr: "J'ai accepté, à condition qu'{a:il|elle} réalise mon fantasme à moi : regarder le Seigneur des Anneaux en version longue, sans parler. Tout le monde a souffert. Tout le monde a gagné.", en: "I agreed, on condition {a:he|she} fulfill my fantasy: watching the extended Lord of the Rings without talking. Everyone suffered. Everyone won." }, fx: { rel: 10, happy: 6 } },
      { label: { fr: 'Fuir à toutes jambes', en: 'Run for the hills' }, text: { fr: "J'ai dit non, très vite, en reculant vers la porte. {a.first} a dit « je plaisantais ». {a:Il|Elle} ne plaisantait pas. Le tabouret est toujours dans le placard.", en: "I said no, very fast, backing toward the door. {a.first} said 'I was joking'. {a:He|She} wasn't. The stool is still in the closet." }, fx: { rel: -10, happy: -2, stress: 4 } },
    ],
  },
  {
    id: 'lv_breakup_text',
    icon: '💬',
    cat: 'love',
    rating: 1,
    actor: 'partner',
    scene: { place: 'apartment', mood: 'cry', prop: 'phone' },
    when: { age: [18, 60] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: ["Notification : {a.first} t'a écrit. « Jcrois kon devrait faire une pause. Bisous 🙂 ». Une pause de quoi ? Le smiley rend tout pire.", "{a.first} te quitte par SMS. Un seul message, avec le GIF d'un chat qui fait au revoir. Tu regardes le chat en boucle."],
      en: ["Notification: {a.first} texted you. 'i think we shud take a break. xoxo 🙂'. A break from what? The smiley makes it worse.", "{a.first} dumps you by text. One message, with a GIF of a cat waving goodbye. You watch the cat on loop."],
    },
    choices: [
      { label: { fr: 'Répondre dignement', en: 'Reply with dignity' }, text: { fr: "J'ai répondu « D'accord, je te souhaite le meilleur. » Puis j'ai pleuré trois heures sous la douche, habillé{|e}.", en: "I replied 'Okay, I wish you the best.' Then I cried for three hours in the shower, fully clothed." }, fx: { happy: -10, rel: -20, actorRole: 'ex' }, mood: 'cry' },
      {
        label: { fr: 'Pavé de 3 000 mots', en: 'Send a 3,000-word essay' },
        out: [
          { w: 2, text: { fr: "J'ai envoyé un pavé de 3 000 mots, avec sommaire et annexes. {a.first} a répondu « ok ». Juste « ok ».", en: "I sent a 3,000-word essay, with a table of contents and appendices. {a.first} replied 'ok'. Just 'ok'." }, fx: { happy: -12, rel: -30, actorRole: 'ex', stress: 6 }, mood: 'cry' },
          { w: 1, text: { fr: "Mon pavé était si beau que {a.first} a changé d'avis. On est de nouveau ensemble. Je crois que je suis devenu{|e} écrivain{|e}.", en: '{a.first} changed {a:his|her} mind because my essay was so beautiful. We\'re back together. I think I\'m a writer now.' }, fx: { rel: 15, happy: 6, smarts: 2 }, mood: 'love' },
        ],
      },
      { label: { fr: 'Prétendre rompre avant', en: 'Claim I dumped them first' }, text: { fr: "J'ai répondu : « Trop tard, je t'ai quitté{a:|e} il y a dix minutes, t'as pas eu mon message ? » Petite victoire, gros chagrin.", en: "I replied: 'Too late, I dumped you ten minutes ago, didn't you get my message?' Small victory, big heartbreak." }, fx: { happy: -4, rel: -30, actorRole: 'ex' }, mood: 'sad' },
    ],
  },

  // ───────────────────────────── family & in-laws ─────────────────────────────
  {
    id: 'lv_inlaws_dinner',
    icon: '🍖',
    cat: 'love',
    rating: 0,
    actor: 'lover',
    scene: { place: 'home', mood: 'neutral', prop: 'roast' },
    when: { age: [18, 60] },
    weight: 8,
    cooldown: 6,
    text: {
      fr: ["Dîner chez les parents de {a.first}. Son père t'a serré la main pendant onze secondes en te fixant. Sa mère t'a demandé ton salaire avant l'apéro.", "Premier repas avec la belle-famille. Le père de {a.first} découpe le gigot avec un couteau de chasse et te demande ce que tu « comptes faire avec {a:mon fils|ma fille} »."],
      en: ["Dinner at {a.first}'s parents'. {a:His|Her} father shook your hand for eleven seconds while staring you down. {a:His|Her} mother asked about your salary before drinks.", "First meal with the in-laws. {a.first}'s father carves the roast with a hunting knife and asks what your 'intentions are with {a:my son|my daughter}'."],
    },
    choices: [
      {
        label: { fr: 'Complimenter le gigot', en: 'Praise the roast' },
        out: [
          { w: 2, text: { fr: "J'ai complimenté le gigot avec une telle passion que la mère de {a.first} m'a confié sa recette secrète. Je suis adopté{|e}.", en: "I praised the roast so passionately that {a.first}'s mother gave me her secret recipe. I've been adopted." }, fx: { rel: 10, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai complimenté le gigot. C'était du tofu. Le père de {a.first} est végan depuis 1987. Silence glacial.", en: "I praised the roast. It was tofu. {a.first}'s father has been vegan since 1987. Icy silence." }, fx: { rel: -3, happy: -3 } },
        ],
      },
      {
        label: { fr: 'Parler politique', en: 'Talk politics' },
        out: [
          { w: 1, text: { fr: "Le père de {a.first} et moi avons découvert que nous détestons exactement les mêmes gens. Meilleurs potes.", en: "{a.first}'s father and I discovered we hate exactly the same people. Best buddies." }, fx: { rel: 6, happy: 5 } },
          { w: 2, text: { fr: "J'ai abordé la politique entre le fromage et le dessert. Le dessert n'a jamais été servi.", en: 'I brought up politics between the cheese and dessert. Dessert was never served.' }, fx: { rel: -12, stress: 6 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Boire pour tenir', en: 'Drink to cope' }, text: { fr: "J'ai bu pour gérer le stress. J'ai fini par appeler la mère de {a.first} « maman » et par pleurer dans le jardin. Ils m'aiment bien, je crois.", en: "I drank to manage the stress. I ended up calling {a.first}'s mother 'mom' and crying in the garden. I think they like me." }, fx: { rel: 2, happy: -2, health: -2 } },
    ],
  },
  {
    id: 'lv_inlaws_toilet',
    icon: '🚽',
    cat: 'love',
    rating: 2,
    actor: 'lover',
    scene: { place: 'home', mood: 'shock', prop: 'plunger', fx: 'poop' },
    when: { age: [18, 60] },
    weight: 6,
    cooldown: 8,
    text: {
      fr: ["Premier week-end chez les parents de {a.first}. Après la choucroute de mamie, tu bouches les toilettes. Les seules de la maison. La chasse ne fait plus que « glou ». Toute la famille attend pour le dessert.", "Chez tes futurs beaux-parents, tu viens de commettre un crime dans les toilettes du rez-de-chaussée. L'eau monte. Le niveau monte. On frappe : « Tout va bien ? C'est l'heure de la photo de famille ! »"],
      en: ["First weekend at {a.first}'s parents'. After grandma's sauerkraut, you clog the toilet. The only one in the house. The flush just goes 'glug'. The whole family is waiting for dessert.", "At your future in-laws', you just committed a crime in the downstairs toilet. The water is rising. The level is rising. A knock: 'Everything okay? It's time for the family photo!'"],
    },
    choices: [
      { label: { fr: 'Déboucher à mains nues', en: 'Unclog bare-handed' }, text: { fr: "J'ai débouché à la main, comme un vétérinaire qui fait vêler une vache. Personne n'a rien su. Je me suis lavé les mains 48 fois. Je ne suis plus {le même|la même}.", en: "I unclogged it by hand, like a vet delivering a calf. Nobody ever knew. I washed my hands 48 times. I'm not the same person anymore." }, fx: { happy: -4, stress: 6, rel: 2, visual: 'poop' }, mood: 'sick' },
      {
        label: { fr: 'Accuser le chien', en: 'Blame the dog' },
        out: [
          { w: 1, text: { fr: "J'ai accusé le chien. Le chien est un chihuahua de 2 kg. Le père de {a.first} m'a regardé{|e} longuement, puis m'a tendu une ventouse.", en: "I blamed the dog. The dog is a four-pound chihuahua. {a.first}'s father stared at me for a long time, then handed me a plunger." }, fx: { rel: -8, happy: -4, karma: -3 } },
          { w: 1, text: { fr: "J'ai accusé le chien. Ils m'ont cru{|e}. Le chien a été mis au régime. Je porterai ce secret dans la tombe.", en: "I blamed the dog. They believed me. The dog was put on a diet. I'll take this secret to my grave." }, fx: { rel: 3, karma: -6 } },
        ],
      },
      { label: { fr: 'Fuir par la fenêtre', en: 'Flee out the window' }, text: { fr: "J'ai fui par la fenêtre des toilettes, laissant derrière moi l'inondation et ma réputation. {a.first} m'a écrit : « Mon père veut te parler. Il a mis des gants. »", en: "I fled through the bathroom window, leaving behind the flood and my reputation. {a.first} texted: 'My dad wants to talk to you. He's wearing gloves.'" }, fx: { rel: -15, happy: -6, stress: 8 }, mood: 'shock' },
    ],
  },
  {
    id: 'lv_toy_parents',
    icon: '🎁',
    cat: 'family',
    rating: 2,
    actor: 'parent',
    scene: { place: 'home', mood: 'shock', prop: 'suitcase' },
    when: { age: [18, 45] },
    weight: 4,
    once: true,
    text: {
      fr: ["En t'aidant à faire ta valise, {a.rel} tombe sur ton jouet intime. {a:Il|Elle} le brandit devant toute la famille : « C'est quoi, ce truc qui vibre ? »", "À Noël, {a.rel} a « rangé ta chambre ». Ton jouet pour adultes trône désormais sur la cheminée, entre les santons. {a:Il|Elle} croit que c'est un masseur pour la nuque. {a:Il|Elle} l'a testé."],
      en: ["While helping you pack, {a.rel} finds your intimate toy. {a:He|She} holds it up in front of the whole family: 'What's this buzzing thing?'", "At Christmas, {a.rel} 'tidied your room'. Your adult toy now sits on the mantelpiece between the nativity figurines. {a:He|She} thinks it's a neck massager. {a:He|She} tried it."],
    },
    choices: [
      { label: { fr: '« Un masseur pour la nuque »', en: "'It's a neck massager'" }, text: { fr: "J'ai confirmé : masseur pour la nuque. Du coup, {a.my} en a commandé trois de plus pour toute la famille. Mamie adore le sien. Je ne dormirai plus jamais.", en: "I confirmed: neck massager. So {a.my} ordered three more for the whole family. Grandma loves hers. I will never sleep again." }, fx: { happy: -4, stress: 8, rel: 5 }, mood: 'shock' },
      {
        label: { fr: 'Assumer', en: 'Own it' },
        out: [
          { w: 1, text: { fr: "J'ai dit : « Oui, c'est un sextoy, j'ai {age} ans. » Silence. Puis mon oncle a demandé : « C'est quelle marque ? » Le repas a pris une tournure inattendue.", en: "I said: 'Yes, it's a sex toy, I'm {age}.' Silence. Then my uncle asked: 'What brand?' Dinner took an unexpected turn." }, fx: { happy: 4, rel: -3, stress: 4 } },
          { w: 1, text: { fr: "J'ai assumé. Résultat : {a.my} a fait un malaise, puis un discours de vingt minutes sur « les mœurs de ma génération ». On n'en reparlera jamais.", en: "I owned it. Result: {a.my} nearly fainted, then gave a twenty-minute speech on 'the morals of my generation'. We will never speak of it again." }, fx: { rel: -8, happy: -3 } },
        ],
      },
      { label: { fr: 'Faire diversion', en: 'Create a diversion' }, text: { fr: "J'ai renversé la dinde pour faire diversion. Le chien est parti avec la dinde. Et avec le jouet. On l'a retrouvé dans le jardin. Les voisins aussi.", en: "I knocked over the turkey as a diversion. The dog ran off with the turkey. And the toy. We found it in the garden. So did the neighbors." }, fx: { happy: 2, stress: 5, karma: -1 } },
    ],
  },

  // ───────────────────────────── moving in, proposals, weddings ─────────────────────────────
  {
    id: 'lv_toilet_paper',
    icon: '🧻',
    cat: 'love',
    rating: 0,
    actor: 'lover',
    scene: { place: 'apartment', mood: 'angry', prop: 'toilet_paper' },
    when: { age: [18, 85], flag: 'ad_cohabiting' },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Vivre avec {a.first}, c'est découvrir qu'{a:il|elle} met le rouleau de papier toilette à l'envers. Par en dessous. Comme un animal.", "{a.first} laisse ses cheveux dans la douche, ses tasses dans l'évier et ses chaussettes dans des endroits qui défient la physique. Ce matin : une chaussette dans le grille-pain."],
      en: ["Living with {a.first} means discovering {a:he|she} hangs the toilet paper the wrong way. Under. Like an animal.", "{a.first} leaves hair in the shower, mugs in the sink and socks in physics-defying places. This morning: a sock in the toaster."],
    },
    choices: [
      {
        label: { fr: 'Tableau des corvées', en: 'Chore chart' },
        out: [
          { w: 1, text: { fr: "J'ai créé un tableau des corvées avec des gommettes. {a.first} l'a respecté six jours. Record mondial.", en: 'I made a chore chart with stickers. {a.first} followed it for six days. World record.' }, fx: { rel: 4, happy: 3 } },
          { w: 1, text: { fr: "Le tableau des corvées a déclenché une guerre. {a.first} a ajouté une colonne « trucs agaçants que tu fais ». Elle était longue.", en: "The chore chart started a war. {a.first} added a column called 'annoying things you do'. It was long." }, fx: { rel: -6, stress: 5 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Vengeance silencieuse', en: 'Silent revenge' }, text: { fr: "Chaque nuit, je retourne le rouleau. Chaque matin, {a.first} le remet à l'envers. On n'en a jamais parlé. C'est ça, le couple.", en: "Every night I flip the roll. Every morning {a.first} flips it back. We've never discussed it. That's what love is." }, fx: { happy: 2, stress: 2 } },
      { label: { fr: 'Lâcher prise', en: 'Let it go' }, text: { fr: "J'ai décidé de lâcher prise. J'ai trouvé une deuxième chaussette dans le congélateur. Je lâche toujours prise.", en: "I decided to let it go. I found a second sock in the freezer. I'm still letting it go." }, fx: { stress: -3, rel: 3 } },
    ],
  },
  {
    id: 'lv_ikea_move_in',
    icon: '🪛',
    cat: 'love',
    rating: 1,
    actor: 'partner',
    scene: { place: 'apartment', mood: 'angry', prop: 'boxes' },
    when: { age: [18, 60], noFlag: 'ad_cohabiting' },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Avec {a.first}, vous emménagez enfin ensemble. Première épreuve : monter une armoire suédoise de 214 pièces. La notice n'a pas de mots, juste un petit bonhomme qui sourit.", "{a.first} débarque avec ses cartons, son ficus et une commode en kit. Il manque la vis 118F. Le couple vacille."],
      en: ["You and {a.first} are finally moving in together. First trial: assembling a 214-piece Swedish wardrobe. The manual has no words, just a little smiling man.", "{a.first} shows up with boxes, a ficus and a flat-pack dresser. Screw 118F is missing. The relationship wobbles."],
    },
    choices: [
      {
        label: { fr: 'Suivre la notice', en: 'Follow the manual' },
        out: [
          { w: 2, text: { fr: "On a suivi la notice étape par étape. Six heures, quatre jurons par minute, et une armoire debout. Notre couple est indestructible.", en: 'We followed the manual step by step. Six hours, four swear words per minute, and a standing wardrobe. Our relationship is indestructible.' }, fx: { flag: 'ad_cohabiting', moveOut: true, rel: 12, happy: 8 }, mood: 'proud' },
          { w: 1, text: { fr: "L'armoire tient debout, mais ses portes s'ouvrent face au mur. On a décidé de vivre avec.", en: 'The wardrobe stands, but its doors open facing the wall. We decided to live with it.' }, fx: { flag: 'ad_cohabiting', moveOut: true, rel: 6, happy: 4 } },
        ],
      },
      {
        label: { fr: 'Laisser {a.first} gérer', en: 'Let {a.first} handle it' },
        out: [
          { w: 1, text: { fr: "J'ai laissé {a.first} monter l'armoire. {a:Il|Elle} a fini en sueur, en larmes et en jurant comme un charretier. Je l'ai filmé{a:|e}. Grave erreur.", en: "I let {a.first} build the wardrobe. {a:He|She} ended up sweaty, in tears and swearing like a sailor. I filmed it. Big mistake." }, fx: { flag: 'ad_cohabiting', moveOut: true, rel: -10, happy: 3 } },
          { w: 1, text: { fr: "{a.first} a tout monté seul{a:|e}, sans notice, en vingt minutes. Je l'ai trouvé{a:|e} incroyablement sexy.", en: '{a.first} assembled everything alone, without the manual, in twenty minutes. I found it incredibly hot.' }, fx: { flag: 'ad_cohabiting', moveOut: true, rel: 15, happy: 8 }, mood: 'love' },
        ],
      },
      { label: { fr: 'Annuler le projet', en: 'Call off the move' }, text: { fr: "Au troisième « passe-moi la clé Allen », on a compris que c'était trop tôt. Chacun chez soi, et l'armoire chez personne.", en: "By the third 'pass me the Allen key', we realized it was too soon. Separate homes, and the wardrobe in nobody's." }, fx: { rel: -8, happy: -3 } },
    ],
  },
  {
    id: 'lv_propose_fail',
    icon: '💍',
    cat: 'love',
    rating: 1,
    actor: { role: 'partner', minRel: 50 },
    vars: { amount: [500, 3000] },
    scene: { place: 'party', mood: 'love', prop: 'ring' },
    when: { age: [20, 60], noHas: ['fiance', 'spouse'] },
    weight: 6,
    cooldown: 4,
    text: {
      fr: ["Tu as acheté une bague à {$amount} et tu comptes demander {a.first} en mariage. Reste à choisir la mise en scène. Ton cœur bat à 180.", "C'est décidé : ce soir, tu demandes {a.first} en mariage. La bague t'a coûté {$amount} et tes trois derniers ongles."],
      en: ["You bought a {$amount} ring and you're going to propose to {a.first}. Now to pick the setting. Your heart is racing.", "It's decided: tonight you propose to {a.first}. The ring cost you {$amount} and your last three fingernails."],
    },
    choices: [
      {
        label: { fr: 'Bague dans le champagne', en: 'Ring in the champagne' },
        out: [
          { w: 1, text: { fr: "{a.first} a dit oui, en larmes, après avoir failli s'étouffer avec la bague. Romantique et médical.", en: '{a.first} said yes, in tears, after nearly choking on the ring. Romantic and medical.' }, fx: { money: '-amount', happy: 15, rel: 20, actorRole: 'fiance', visual: 'hearts' }, mood: 'love' },
          { w: 1, text: { fr: "{a.first} a bu sa coupe cul sec. Avec la bague. Direction les urgences.", en: '{a.first} downed the glass in one go. Ring included. Off to the ER.' }, fx: { money: '-amount', happy: -5, chain: 'lv_ring_er' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Kiss cam au stade', en: 'Stadium kiss cam' },
        out: [
          { w: 1, text: { fr: "Ma demande est passée sur l'écran géant devant 40 000 personnes. {a.first} a dit oui. Le stade a hurlé plus fort que pour le but.", en: '{a.first} said yes on the jumbotron in front of 40,000 people. The stadium roared louder than for the goal.' }, fx: { money: '-amount', happy: 15, rel: 20, actorRole: 'fiance', fame: 5, visual: 'confetti' }, mood: 'love' },
          { w: 1, text: { fr: "Sur l'écran géant, devant 40 000 personnes, {a.first} a dit non. Puis est parti{a:|e} chercher une bière. La vidéo a 3 millions de vues.", en: '{a.first} said no on the jumbotron in front of 40,000 people. Then went to get a beer. The video has 3 million views.' }, fx: { money: '-amount', happy: -15, rel: -40, actorRole: 'ex', fame: 10, followers: 5000 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Simple, à la maison', en: 'Simple, at home' },
        out: [
          { w: 2, text: { fr: "Je me suis agenouillé{|e} dans la cuisine, entre la poubelle et le lave-vaisselle. {a.first} a dit oui. Le lave-vaisselle a bipé, comme pour bénir notre union.", en: '{a.first} said yes when I knelt in the kitchen, between the trash can and the dishwasher. The dishwasher beeped, as if blessing our union.' }, fx: { money: '-amount', happy: 12, rel: 15, actorRole: 'fiance' }, mood: 'love' },
          { w: 1, text: { fr: "Je me suis agenouillé{|e}. {a.first} a cru que je cherchais une lentille et s'est mis{a:|e} à quatre pattes pour m'aider. J'ai dû expliquer. Oui, finalement.", en: "When I knelt, {a.first} thought I'd lost a contact lens and got on all fours to help. I had to explain. Yes, eventually." }, fx: { money: '-amount', happy: 12, rel: 15, actorRole: 'fiance' }, mood: 'love' },
        ],
      },
    ],
  },
  {
    id: 'lv_ring_er',
    icon: '🩻',
    cat: 'love',
    rating: 2,
    chainOnly: true,
    vars: { amount: [400, 2500] },
    scene: { place: 'hospital', mood: 'shock', prop: 'xray', fx: 'poop' },
    when: { age: [18, 80] },
    text: {
      fr: ["Aux urgences, le médecin examine la radio : la bague est bien dans l'estomac de {a.first}. « Elle ressortira naturellement d'ici 48 h. » Il te tend une paire de gants.", "Radio formelle : ta bague de fiançailles est en transit dans l'intestin de {a.first}. Le médecin, hilare, te conseille « une passoire et du courage »."],
      en: ["At the ER, the doctor studies the X-ray: the ring is in {a.first}'s stomach. 'It'll come out naturally within 48 hours.' He hands you a pair of gloves.", "X-ray confirmed: your engagement ring is in transit through {a.first}'s intestines. The doctor, giggling, recommends 'a colander and courage'."],
    },
    choices: [
      { label: { fr: 'Fouiller avec courage', en: 'Dig in bravely' }, text: { fr: "Deux jours à inspecter chaque passage aux toilettes avec une passoire et des gants Mapa. J'ai récupéré la bague. {a.first} a dit oui. Je l'ai désinfectée quatorze fois.", en: "Two days inspecting every bathroom trip with a colander and dish gloves. I got the ring back. {a.first} said yes. I disinfected it fourteen times." }, fx: { happy: 8, rel: 20, stress: 8, actorRole: 'fiance', visual: 'poop' }, mood: 'proud' },
      { label: { fr: 'Racheter une bague', en: 'Buy another ring' }, text: { fr: "J'ai racheté une bague à {$amount}. La première finira dans une station d'épuration. {a.first} a dit oui, un peu gêné{a:|e}.", en: "I bought another ring for {$amount}. The first one will end up at a sewage plant. {a.first} said yes, a little embarrassed." }, fx: { money: '-amount', rel: 15, happy: 8, actorRole: 'fiance' }, mood: 'love' },
      { label: { fr: 'Y voir un signe', en: 'Take it as a sign' }, text: { fr: "J'y ai vu un signe du destin. Un signe digestif. On a remis la demande à plus tard. Beaucoup plus tard.", en: 'I took it as a sign from fate. A digestive sign. We postponed the proposal. Indefinitely.' }, fx: { rel: -10, happy: -6 }, mood: 'sad' },
    ],
  },
  {
    id: 'lv_bachelor_party',
    icon: '🍾',
    cat: 'love',
    rating: 2,
    actor: 'fiance',
    scene: { place: 'party', mood: 'party', prop: 'banana_costume' },
    when: { age: [20, 70], has: 'fiance' },
    weight: 8,
    once: true,
    text: {
      fr: ["Ton enterrement de vie de {garçon|jeune fille} dégénère : costume de banane, karaoké, shots de tequila. Tes potes ont réservé un « spectacle privé » sur Leboncoin. Le danseur qui arrive, c'est le cousin de {a.first}.", "Ton enterrement de vie de {garçon|jeune fille} s'est terminé quelque part à Amsterdam. Tu ne sais pas comment. Ton téléphone affiche 37 appels manqués de {a.first} et une photo de toi avec un tatouage tout frais."],
      en: ["Your {bachelor|bachelorette} party is spiraling: banana costume, karaoke, tequila shots. Your friends booked a 'private show' off Craigslist. The dancer who shows up is {a.first}'s cousin.", "Your {bachelor|bachelorette} party ended somewhere in Amsterdam. You don't know how. Your phone shows 37 missed calls from {a.first} and a photo of you with a fresh tattoo."],
    },
    choices: [
      {
        label: { fr: 'Effacer les preuves', en: 'Delete the evidence' },
        out: [
          { w: 1, text: { fr: "J'ai effacé toutes les photos de tous les téléphones. Sauf un, qui a tout posté sur le groupe WhatsApp familial. Mariage tendu en perspective.", en: 'I deleted every photo from every phone. Except one, which posted everything to the family WhatsApp group. Tense wedding ahead.' }, fx: { rel: -15, happy: -6, stress: 8 }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai tout effacé, nettoyé, nié. {a.first} ne saura jamais. Moi, je n'oublierai jamais.", en: "I deleted, scrubbed, denied. {a.first} will never know. I will never forget." }, fx: { stress: 4, happy: 3 } },
        ],
      },
      {
        label: { fr: 'Tout avouer', en: 'Confess everything' },
        out: [
          { w: 2, text: { fr: "J'ai tout avoué à {a.first}. {a:Il|Elle} a ri dix minutes, puis m'a montré les photos de son propre enterrement de vie. C'était pire. C'est ça, l'amour.", en: "I confessed everything to {a.first}. {a:He|She} laughed for ten minutes, then showed me photos from {a:his|her} own party. Worse. That's love." }, fx: { rel: 8, happy: 6 }, mood: 'love' },
          { w: 1, text: { fr: "J'ai avoué. {a.first} a annulé le mariage et gardé le traiteur pour une fête de rupture. J'étais pas invité{|e}.", en: '{a.first} called off the wedding after my confession and kept the caterer for a breakup party. I wasn\'t invited.' }, fx: { rel: -60, actorRole: 'ex', happy: -14 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Prolonger la fête', en: 'Keep partying' }, text: { fr: "J'ai prolongé la fête deux jours de plus. Je me suis réveillé{|e} avec un perroquet, une amende belge et une gueule de bois à l'échelle géologique.", en: 'I kept partying for two more days. I woke up with a parrot, a Belgian fine and a hangover of geological proportions.' }, fx: { health: -8, happy: 6, money: -400, rel: -8, addiction: ['alcohol', 6] }, mood: 'sick' },
    ],
  },
  {
    id: 'lv_wedding_day',
    icon: '💒',
    cat: 'love',
    rating: 1,
    actor: 'fiance',
    scene: { place: 'party', mood: 'shock', prop: 'cake' },
    when: { age: [20, 80], has: 'fiance' },
    weight: 10,
    cooldown: 2,
    text: {
      fr: ["Le jour J. Le DJ est ivre mort, le traiteur s'est trompé de date et ton témoin vient de perdre les alliances dans les toilettes de la salle des fêtes. {a.first} n'est pas encore au courant.", "Ton mariage avec {a.first} commence dans une heure. Ton ex est dans la salle, il pleut des cordes et l'oncle Patrick a apporté sa guitare."],
      en: ["The big day. The DJ is blackout drunk, the caterer got the date wrong and your best man just lost the rings in the venue toilet. {a.first} doesn't know yet.", "Your wedding to {a.first} starts in an hour. Your ex is in the crowd, it's pouring rain and Uncle Patrick brought his guitar."],
    },
    choices: [
      {
        label: { fr: 'Improviser avec panache', en: 'Improvise with flair' },
        out: [
          { w: 2, text: { fr: "Alliances en bonbons, buffet commandé au kebab du coin, DJ remplacé par l'oncle Patrick. Plus beau mariage de l'année, selon les invités bourrés.", en: 'Candy rings, buffet ordered from the corner kebab shop, DJ replaced by Uncle Patrick. Best wedding of the year, according to the drunk guests.' }, fx: { happy: 14, rel: 15, actorRole: 'spouse', visual: 'confetti', chain: 'lv_honeymoon' }, mood: 'party' },
          { w: 1, text: { fr: "J'ai improvisé. Le kebab a intoxiqué 40 invités, dont l'officier d'état civil. On est quand même mariés. Entre deux allers-retours aux toilettes.", en: 'I improvised. The kebab poisoned 40 guests, including the officiant. We still got married. Between bathroom runs.' }, fx: { happy: 6, rel: 10, actorRole: 'spouse', chain: 'lv_honeymoon' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: "Gérer mon ex", en: 'Deal with my ex' },
        out: [
          { w: 1, text: { fr: "Quand l'officier a demandé si quelqu'un s'opposait au mariage, mon ex a levé la main. Pour demander où étaient les toilettes. Panique, fou rire, puis oui.", en: "When the officiant asked if anyone objected, my ex raised a hand. To ask where the bathroom was. Panic, laughter, then 'I do'." }, fx: { happy: 12, rel: 12, actorRole: 'spouse', chain: 'lv_honeymoon' }, mood: 'love' },
          { w: 1, text: { fr: "Mon ex a pris le micro pour un discours de vingt minutes sur nos vacances en Crète. {a.first} a dit oui quand même, mais en serrant les dents.", en: 'My ex grabbed the mic for a twenty-minute speech about our holiday in Crete. {a.first} said yes anyway, through gritted teeth.' }, fx: { happy: 4, rel: 2, actorRole: 'spouse', chain: 'lv_honeymoon' }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Tout annuler', en: 'Call it all off' }, text: { fr: "J'ai tout annulé devant 120 invités et une pièce montée à quatre étages. {a.first} est parti{a:|e} avec la pièce montée. Entière.", en: 'I called it all off in front of 120 guests and a four-tier cake. {a.first} left with the cake. The whole thing.' }, fx: { rel: -60, actorRole: 'ex', happy: -12 }, mood: 'cry' },
    ],
  },
  {
    id: 'lv_honeymoon',
    icon: '🏝️',
    cat: 'love',
    rating: 1,
    chainOnly: true,
    vars: { amount: [800, 4000] },
    scene: { place: 'beach', mood: 'love', prop: 'cocktail' },
    when: { age: [18, 85] },
    text: {
      fr: ["Lune de miel avec {a.first} ! Le forfait « Paradis tout compris » coûte {$amount}. L'hôtel ressemble beaucoup moins à la brochure. La piscine est verte.", "Voyage de noces : {a.first} et toi débarquez sous les tropiques. Il fait 38 °C, les moustiques ont la taille d'un pigeon et la chambre a deux lits jumeaux. Le tout pour {$amount}."],
      en: ["Honeymoon with {a.first}! The 'All-Inclusive Paradise' package costs {$amount}. The hotel looks a lot less like the brochure. The pool is green.", "Honeymoon: you and {a.first} land in the tropics. It's 100°F, the mosquitoes are pigeon-sized and the room has twin beds. All for {$amount}."],
    },
    choices: [
      { label: { fr: 'Ne pas quitter la chambre', en: 'Never leave the room' }, text: { fr: "On n'a pas quitté la chambre de la semaine. Le personnel a commencé à s'inquiéter. Le panneau « Ne pas déranger » a fondu au soleil.", en: "We didn't leave the room all week. The staff started to worry. The 'Do Not Disturb' sign melted in the sun." }, fx: { money: '-amount', happy: 12, rel: 15, stress: -8, visual: 'hearts' }, mood: 'love' },
      {
        label: { fr: 'Tout visiter', en: 'See everything' },
        out: [
          { w: 1, text: { fr: "Volcans, temples, plages : on a tout vu. J'ai pris un coup de soleil en forme de maillot. {a.first} m'appelle « le drapeau ».", en: "Volcanoes, temples, beaches: we saw it all. I got a swimsuit-shaped sunburn. {a.first} calls me 'the flag'." }, fx: { money: '-amount', happy: 8, rel: 8, looks: -2 }, mood: 'happy' },
          { w: 1, text: { fr: "Excursion au marché local : turista carabinée pour nous deux. Lune de miel aux toilettes, chacun son tour.", en: 'Trip to the local market: raging food poisoning for both of us. Honeymoon on the toilet, taking turns.' }, fx: { money: '-amount', disease: 'food_poisoning', happy: -4, rel: 4 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Rester à la maison', en: 'Stay home' }, text: { fr: "On a annulé et regardé des documentaires sur Bali depuis le canapé. Même résultat, zéro moustique.", en: 'We cancelled and watched Bali documentaries from the couch. Same result, zero mosquitoes.' }, fx: { rel: 3, happy: 3 } },
    ],
  },
  {
    id: 'lv_preg_scare',
    icon: '🧪',
    cat: 'love',
    rating: 1,
    actor: 'lover',
    scene: { place: 'apartment', mood: 'shock', prop: 'test' },
    when: { age: [18, 48], orientation: ['straight'] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Retard de règles. Trois jours. Puis six. {a.first} et toi êtes plantés devant un test de grossesse comme devant un ticket de loto. Personne ne respire.", "Un test de grossesse attend sur le bord du lavabo. Trois minutes de lecture. {a.first} a déjà choisi un prénom, acheté un monospace et fait un ulcère. Mentalement."],
      en: ["Late period. Three days. Then six. You and {a.first} are standing over a pregnancy test like it's a lottery ticket. Nobody breathes.", "A pregnancy test sits on the edge of the sink. Three minutes to wait. {a.first} has already picked a name, bought a minivan and developed an ulcer. Mentally."],
    },
    choices: [
      {
        label: { fr: 'Regarder ensemble', en: 'Look together' },
        out: [
          { w: 2, text: { fr: "Négatif. Cri de joie, puis petit pincement bizarre, puis pizza. Ascenseur émotionnel complet.", en: 'Negative. A cry of joy, then a weird little pang, then pizza. Full emotional rollercoaster.' }, fx: { happy: 6, stress: -6, rel: 6 }, mood: 'happy' },
          { w: 1, text: { fr: "Test illisible. On en a acheté six autres. Tous négatifs. Le pharmacien nous appelle « les habitués ».", en: "Unreadable test. We bought six more. All negative. The pharmacist calls us 'the regulars'." }, fx: { happy: 2, stress: 4, money: -60 } },
          { w: 1, text: { fr: "Négatif. Mais trois jours de panique m'ont fait vieillir de dix ans. J'ai trouvé un cheveu blanc. Puis deux.", en: 'Negative. But three days of panic aged me ten years. I found a grey hair. Then two.' }, fx: { stress: 10, looks: -2, happy: -2 } },
        ],
      },
      { label: { fr: 'Paniquer sur un tableur', en: 'Panic on a spreadsheet' }, text: { fr: "J'ai calculé le coût d'un enfant jusqu'à ses 18 ans sur un tableur. Crise d'angoisse. Le test était négatif depuis le début : personne ne l'avait regardé.", en: "I calculated the cost of raising a kid to 18 in a spreadsheet. Panic attack. The test had been negative all along: nobody had looked at it." }, fx: { stress: 12, happy: -4 }, mood: 'shock' },
      { label: { fr: 'Laisser faire le destin', en: 'Let fate decide' }, text: { fr: "Négatif. {a.first} a eu l'air un poil déçu{a:|e}. Longue discussion sur l'avenir. Pour l'instant, on adopte un cactus.", en: 'Negative. {a.first} looked a tiny bit disappointed. Long talk about the future. For now, we\'re adopting a cactus.' }, fx: { rel: 8, happy: 3 }, mood: 'love' },
    ],
  },

  // ───────────────────────────── marriage & divorce ─────────────────────────────
  {
    id: 'lv_sexless_marriage',
    icon: '🥶',
    cat: 'love',
    rating: 2,
    actor: 'spouse',
    scene: { place: 'home', mood: 'sleepy', prop: 'bed' },
    when: { age: [28, 85] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: ["Avec {a.first}, la dernière fois que vous avez fait l'amour, c'était pendant une éclipse lunaire. Ton lit sert désormais à plier le linge.", "{a.first} vient de te proposer une « soirée coquine ». Tu t'es préparé{|e} mentalement. C'était un plateau de fromages et le dernier épisode de « Questions pour un champion »."],
      en: ["With {a.first}, the last time you had sex was during a lunar eclipse. Your bed is now mainly for folding laundry.", "{a.first} just suggested a 'naughty night in'. You mentally prepared yourself. It was a cheese board and the latest episode of 'Jeopardy!'."],
    },
    choices: [
      {
        label: { fr: "Planifier dans l'agenda", en: 'Put it in the calendar' },
        out: [
          { w: 1, text: { fr: "J'ai bloqué « Câlin » le jeudi à 21 h dans l'agenda partagé, rappel 15 minutes avant. Contre toute attente, ça marche. Romantisme : 2/10. Résultats : 9/10.", en: "I booked 'Cuddle' Thursdays at 9 p.m. in the shared calendar, reminder 15 minutes before. Against all odds, it works. Romance: 2/10. Results: 9/10." }, fx: { rel: 10, happy: 8, stress: -4 }, mood: 'love' },
          { w: 1, text: { fr: "J'ai bloqué un créneau dans l'agenda partagé. {a.first} l'a décliné : « conflit avec la réunion de copropriété ».", en: "I booked a slot in the shared calendar. {a.first} declined it: 'conflict with HOA meeting'." }, fx: { rel: -4, happy: -6 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Tenue affriolante', en: 'Sexy outfit' },
        out: [
          { w: 1, text: { fr: "J'ai sorti une tenue affriolante. {a.first} a dit « oh là là », puis s'est endormi{a:|e} sur le canapé. Mais c'était un « oh là là » sincère.", en: "I put on a sexy outfit. {a.first} said 'oh my', then fell asleep on the couch. But it was a sincere 'oh my'." }, fx: { happy: 2, rel: 4, money: -60 } },
          { w: 1, text: { fr: "Tenue sexy, bougies, musique. {a.first} a eu un tel choc qu'on a fini aux urgences pour palpitations. Puis la suite à la maison. Victoire.", en: "Sexy outfit, candles, music. {a.first} was so shocked we ended up in the ER for palpitations. Then the rest at home. Victory." }, fx: { rel: 12, happy: 10, money: -60 }, mood: 'love' },
        ],
      },
      { label: { fr: 'Accepter le désert', en: 'Embrace the drought' }, text: { fr: "J'ai accepté. Notre passion, désormais, c'est le Scrabble. On est très, très bons au Scrabble.", en: "I accepted it. Our passion is now Scrabble. We're very, very good at Scrabble." }, fx: { smarts: 4, happy: -2, rel: 2 } },
    ],
  },
  {
    id: 'lv_sexless_auto',
    icon: '🌵',
    cat: 'love',
    rating: 2,
    auto: true,
    actor: 'spouse',
    scene: { place: 'home', mood: 'sleepy', prop: 'bed' },
    when: { age: [30, 85] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["Ma vie sexuelle avec {a.first} est si morte que les toiles d'araignée ont des toiles d'araignée. Notre matelas est comme neuf. Littéralement.", "Cette année, {a.first} et moi avons eu plus de rendez-vous chez le dentiste que de câlins. Le dentiste, au moins, nous touche."],
      en: ["My sex life with {a.first} is so dead the cobwebs have cobwebs. Our mattress is like new. Literally.", "This year {a.first} and I had more dentist appointments than intimate moments. At least the dentist touches us."],
    },
    fx: { happy: -3, rel: -2 },
  },
  {
    id: 'lv_divorce_war',
    icon: '⚖️',
    cat: 'love',
    rating: 2,
    actor: 'spouse',
    vars: { amount: [3000, 25000] },
    scene: { place: 'court', mood: 'angry', prop: 'gavel' },
    when: { age: [22, 90], has: 'spouse' },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["{a.first} demande le divorce. Son avocat s'appelle Maître Requin. C'est son vrai nom. Il réclame la maison, la voiture, le chien et la moitié de tes vinyles.", "La guerre est déclarée : {a.first} a engagé un avocat, changé les serrures et commencé à vendre tes fringues sur Vinted. Le divorce va coûter dans les {$amount}. Minimum."],
      en: ["{a.first} is filing for divorce. {a:His|Her} lawyer is named Mr. Shark. That's his real name. He wants the house, the car, the dog and half your vinyl collection.", "War is declared: {a.first} hired a lawyer, changed the locks and started selling your clothes on eBay. The divorce will cost around {$amount}. Minimum."],
    },
    choices: [
      {
        label: { fr: 'Guerre totale', en: 'Total war' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "Deux ans de procédure, mais j'ai gardé la maison, le chien et les vinyles. {a.first} a eu la machine à pain. Les avocats ont eu {$amount}.", en: "Two years of litigation, but I kept the house, the dog and the vinyl. {a.first} got the bread machine. The lawyers got {$amount}." }, fx: { money: '-amount', happy: 4, stress: 15, rel: -50, actorRole: 'ex', flag: 'lv_divorced' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai tout perdu, sauf un tabouret et ma rancune. Les avocats se sont offert des yachts avec mes {$amount}.", en: 'I lost everything except a stool and my grudge. The lawyers bought yachts with my {$amount}.' }, fx: { money: '-amount', happy: -15, stress: 15, rel: -60, actorRole: 'ex', flag: 'lv_divorced' }, mood: 'cry' },
        ],
      },
      { label: { fr: "Divorce à l'amiable", en: 'Amicable split' }, text: { fr: "Divorce à l'amiable : on a partagé les meubles, les amis et le compte Netflix. On a même pleuré ensemble chez le notaire. Il nous a facturé les mouchoirs.", en: "Amicable divorce: we split the furniture, the friends and the Netflix account. We even cried together at the lawyer's. He billed us for the tissues." }, fx: { money: -1500, happy: -6, rel: 5, actorRole: 'ex', flag: 'lv_divorced' }, mood: 'sad' },
      {
        label: { fr: 'Supplier', en: 'Beg' },
        out: [
          { w: 1, text: { fr: "J'ai supplié à genoux dans le salon, puis au supermarché, devant les surgelés. {a.first} a accepté une dernière chance, surtout pour faire cesser le spectacle.", en: "I begged on my knees in the living room, then at the supermarket, by the frozen foods. {a.first} agreed to one last chance, mostly to end the show." }, fx: { rel: 15, happy: -2, fame: 1 } },
          { w: 1, text: { fr: "J'ai supplié. {a.first} a filmé et transmis la vidéo à son avocat comme « pièce à conviction ». Ça m'a coûté {$amount} et mon honneur.", en: "I begged. {a.first} filmed it and sent the video to {a:his|her} lawyer as 'evidence'. It cost me {$amount} and my honor." }, fx: { money: '-amount', rel: -40, actorRole: 'ex', flag: 'lv_divorced', happy: -12 }, mood: 'cry' },
        ],
      },
    ],
  },
  {
    id: 'lv_divorce_auto',
    icon: '🍷',
    cat: 'love',
    rating: 2,
    auto: true,
    scene: { place: 'home', mood: 'party', prop: 'barbecue' },
    when: { age: [22, 90], flag: 'lv_divorced' },
    weight: 8,
    once: true,
    text: {
      fr: ["J'ai fêté mon divorce en brûlant notre photo de mariage dans le barbecue. Les saucisses avaient un goût de rancune. Délicieux.", "J'ai croisé mon ex au supermarché avec sa nouvelle conquête. J'ai fait semblant d'être passionné{|e} par les cotons-tiges pendant vingt minutes. J'en ai acheté huit paquets."],
      en: ["I celebrated my divorce by burning our wedding photo in the barbecue. The sausages tasted of resentment. Delicious.", "I ran into my ex at the supermarket with their new fling. I pretended to be fascinated by cotton swabs for twenty minutes. I bought eight packs."],
    },
    fx: { happy: 3, stress: -2, unflag: 'lv_divorced' },
  },

  // ───────────────────────────── exes ─────────────────────────────
  {
    id: 'lv_ex_texts',
    icon: '🌙',
    cat: 'love',
    rating: 1,
    actor: 'ex',
    scene: { place: 'apartment', mood: 'sleepy', prop: 'phone' },
    when: { age: [18, 60] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["2 h 17. Ton téléphone vibre. {a.first}, ton ex : « t réveillé{|e} ? 👀 ». Puis : « jpense à toi ». Puis : « c'était pas pour toi ». Puis : « si en fait ».", "{a.first}, ton ex, like trois de tes photos de 2019 à minuit, puis écrit : « on prend un verre, juste pour parler ? ». Les ex ne veulent jamais « juste parler »."],
      en: ["2:17 a.m. Your phone buzzes. {a.first}, your ex: 'u up? 👀'. Then: 'thinkin bout u'. Then: 'wrong person'. Then: 'jk it was u'.", "{a.first}, your ex, likes three of your 2019 photos at midnight, then writes: 'drink? just to talk?'. Exes never 'just talk'."],
    },
    choices: [
      {
        label: { fr: 'Se remettre ensemble', en: 'Get back together' },
        if: { noHas: 'lover' },
        out: [
          { w: 1, text: { fr: "On s'est remis ensemble. Tous nos potes ont levé les yeux au ciel en même temps. Cette fois, c'est la bonne. Sûrement.", en: "We got back together. All our friends rolled their eyes in unison. This time it's for real. Probably." }, fx: { rel: 20, happy: 8, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "On a retenté le coup. Ça a duré exactement neuf jours, comme la dernière fois, pour exactement la même raison.", en: 'We gave it another shot. It lasted exactly nine days, like last time, for exactly the same reason.' }, fx: { rel: -10, happy: -6 }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Y aller quand même', en: 'Go anyway' }, if: { has: 'lover' }, text: { fr: "J'ai rejoint {a.first} « juste pour parler ». On n'a pas beaucoup parlé. Je mène désormais une double vie, comme dans une mauvaise série.", en: "I met {a.first} 'just to talk'. There wasn't much talking. I'm now living a double life, like in a bad TV drama." }, fx: { happy: 6, karma: -10, stress: 8, rel: 10, flag: 'cheating' }, mood: 'love' },
      { label: { fr: 'Bloquer partout', en: 'Block everywhere' }, text: { fr: "J'ai bloqué {a.first} partout, y compris sur LinkedIn et l'appli de la boulangerie. Je me sens libre. Et un peu dramatique.", en: "I blocked {a.first} everywhere, including LinkedIn and the bakery app. I feel free. And a little dramatic." }, fx: { happy: 4, stress: -3, rel: -20 } },
      { label: { fr: '« Nouveau tel, c ki ? »', en: "'New phone, who dis?'" }, text: { fr: "J'ai répondu « nouveau tel, c ki ? ». {a.first} a écrit un pavé de 800 mots. Je l'ai lu en mangeant des chips. Délicieux.", en: "I replied 'new phone, who dis?'. {a.first} wrote an 800-word essay. I read it while eating chips. Delicious." }, fx: { happy: 6, rel: -10 } },
    ],
  },
  {
    id: 'lv_ex_wedding_invite',
    icon: '💌',
    cat: 'love',
    rating: 0,
    actor: 'ex',
    scene: { place: 'home', mood: 'shock', prop: 'letter' },
    when: { age: [20, 70] },
    weight: 5,
    cooldown: 8,
    text: {
      fr: ["Tu reçois un faire-part : {a.first}, ton ex, se marie. Avec un mot manuscrit : « Ça me ferait vraiment plaisir que tu viennes ! 😊 ». Le smiley te semble menaçant.", "{a.first}, ton ex, t'invite à son mariage. Tu es à la table 14 : « Amis lointains et erreurs de jeunesse »."],
      en: ["You get a wedding invitation: {a.first}, your ex, is getting married. With a handwritten note: 'It would mean a lot if you came! 😊'. The smiley feels threatening.", "{a.first}, your ex, invites you to the wedding. You're at table 14: 'Distant friends and youthful mistakes'."],
    },
    choices: [
      {
        label: { fr: 'Y aller, rayonnant{|e}', en: 'Go, looking stunning' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "Je suis venu{|e} sublime, j'ai dansé toute la nuit et attrapé le bouquet. {a.first} a fait la tête. Victoire.", en: 'I showed up gorgeous, danced all night and caught the bouquet. {a.first} sulked. Victory.' }, fx: { happy: 10, looks: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai fait un discours que personne n'avait demandé. On en parle encore dans la famille de {a.first}.", en: "I gave a speech nobody asked for. {a.first}'s family still talks about it." }, fx: { happy: -6, karma: -2 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Cadeau passif-agressif', en: 'Passive-aggressive gift' }, text: { fr: "J'ai offert un livre intitulé « Survivre à un divorce ». Avec un marque-page.", en: "I gave a book titled 'Surviving Divorce'. With a bookmark." }, fx: { happy: 6, karma: -4, rel: -10 } },
      { label: { fr: 'Décliner poliment', en: 'Politely decline' }, text: { fr: "J'ai décliné avec un message très mature. Puis j'ai regardé toutes les stories du mariage à 3 h du matin.", en: 'I declined with a very mature message. Then I watched every wedding story at 3 a.m.' }, fx: { happy: -2 } },
    ],
  },
  {
    id: 'lv_ex_revenge_song',
    icon: '🎤',
    cat: 'love',
    rating: 2,
    actor: 'ex',
    vars: { amount: [500, 3000] },
    scene: { place: 'studio', mood: 'shock', prop: 'microphone' },
    when: { age: [18, 60] },
    weight: 4,
    cooldown: 8,
    text: {
      fr: ["{a.first}, ton ex, vient de sortir un rap sur votre rupture. Titre : « Deux minutes chrono ». Le refrain parle de tes performances au lit. Ça cartonne sur TikTok.", "{a.first}, ton ex, a lancé un podcast : « Mon ex, ce désastre ». Épisode 4 : « Ses pieds ». 200 000 écoutes. Tes collègues sont abonnés."],
      en: ["{a.first}, your ex, just dropped a rap track about your breakup. Title: 'Two Minutes Flat'. The chorus is about your performance in bed. It's blowing up on TikTok.", "{a.first}, your ex, launched a podcast: 'My Ex, the Disaster'. Episode 4: 'The Feet'. 200,000 listens. Your coworkers are subscribed."],
    },
    choices: [
      {
        label: { fr: 'Riposter en musique', en: 'Drop a diss track' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai sorti ma réponse : « Une minute, et c'était par pitié ». Disque d'or. {a.first} a quitté le pays.", en: "I dropped my reply: 'One Minute, Out of Pity'. Gold record. {a.first} left the country." }, fx: { fame: 10, followers: 20000, happy: 12 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai sorti un diss track. Ma voix déraille au refrain. Grâce à moi, le morceau de {a.first} a doublé ses vues.", en: "I dropped a diss track. My voice cracks on the chorus. Thanks to me, {a.first}'s track doubled its views." }, fx: { fame: 4, happy: -8 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Attaquer en justice', en: 'Sue' }, text: { fr: "J'ai attaqué en diffamation. Au tribunal, le juge fredonnait le refrain. J'ai perdu et payé {$amount}.", en: 'I sued for defamation. In court, the judge was humming the chorus. I lost and paid {$amount}.' }, fx: { money: '-amount', happy: -6, stress: 6 }, mood: 'angry' },
      { label: { fr: 'Assumer en public', en: 'Own it publicly' }, text: { fr: "J'ai partagé le morceau avec « Désolé{|e}, j'étais crevé{|e} ce soir-là 😅 ». Internet m'adore. Je n'ai jamais eu autant de propositions.", en: "I shared the track with 'Sorry, I was really tired that night 😅'. The internet loves me. I've never had so many offers." }, fx: { fame: 5, happy: 8, followers: 5000 }, mood: 'happy' },
    ],
  },

  // ───────────────────────────── weird & trash ─────────────────────────────
  {
    id: 'lv_love_triangle',
    icon: '🔺',
    cat: 'love',
    rating: 1,
    actor: { create: { role: 'acquaintance', age: [0, 6], gender: 'attracted' } },
    scene: { place: 'party', mood: 'sad', prop: 'drinks' },
    when: { age: [18, 40], noHas: 'lover' },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["{a.first}, {a.age} ans, te plaît énormément. Problème : ton coloc craque aussi, et {a.first} avoue hésiter « entre vous deux ». Quelque part, il existe un tableur Excel.", "{a.first} sort avec toi le mardi et avec ton coloc le jeudi. Tout le monde est au courant. {a.first} appelle ça « un planning optimisé »."],
      en: ["You're really into {a.first}, {a.age}. Problem: your roommate is too, and {a.first} admits to being torn 'between you two'. Somewhere, an Excel sheet exists.", "{a.first} dates you on Tuesdays and your roommate on Thursdays. Everyone knows. {a.first} calls it 'an optimized schedule'."],
    },
    choices: [
      {
        label: { fr: 'Me battre pour {a.first}', en: 'Fight for {a.first}' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "Artillerie lourde : dîner, poème, playlist. {a.first} m'a choisi{|e}. Mon coloc ne me parle plus, mais a gardé le mot de passe du Wi-Fi.", en: "Heavy artillery: dinner, a poem, a playlist. {a.first} chose me. My roommate doesn't speak to me anymore but kept the Wi-Fi password." }, fx: { happy: 10, rel: 15, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "J'ai tout donné. {a.first} a choisi mon coloc. Ils roucoulent dans la chambre d'à côté. Les murs sont très fins.", en: '{a.first} chose my roommate despite my best efforts. They coo in the next room. The walls are very thin.' }, fx: { happy: -12, stress: 6 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Proposer un trouple', en: 'Suggest a throuple' },
        out: [
          { w: 1, text: { fr: "J'ai proposé un trouple. Tout le monde a dit oui. Les courses sont compliquées, mais on rit beaucoup.", en: 'I suggested a throuple. Everyone said yes. Grocery shopping is complicated, but we laugh a lot.' }, fx: { happy: 8, rel: 10, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "J'ai proposé un trouple. Silence de mort. {a.first} et mon coloc sont partis ensemble. J'ai gardé la plante verte.", en: '{a.first} and my roommate left together after a deathly silence. I kept the houseplant.' }, fx: { happy: -8 }, mood: 'sad' },
        ],
      },
      { label: { fr: "M'effacer", en: 'Step aside' }, text: { fr: "J'ai laissé la place à mon coloc. Au mariage, j'étais témoin. Discours vengeur déguisé en blagues. Standing ovation.", en: 'I stepped aside for my roommate. At the wedding, I was the witness. Vengeful speech disguised as jokes. Standing ovation.' }, fx: { karma: 6, happy: -2 } },
    ],
  },
  {
    id: 'lv_stalker',
    icon: '👀',
    cat: 'love',
    rating: 1,
    actor: { create: { role: 'acquaintance', age: [0, 15], gender: 'any' } },
    scene: { place: 'home', mood: 'shock', prop: 'roses' },
    when: { age: [20, 70] },
    weight: 4,
    cooldown: 10,
    text: {
      fr: ["Quelqu'un dépose des roses sur ton paillasson chaque matin. Aujourd'hui, une lettre : « Tu étais magnifique hier au supermarché, rayon surgelés. — {a.first} ». Tu ne connais aucun{a:|e} {a.first}.", "Un{a:|e} certain{a:|e} {a.first} commente toutes tes photos depuis six mois, connaît ton emploi du temps par cœur et vient d'emménager sur ton palier. Pure coïncidence, {a:il|elle} le jure."],
      en: ["Someone leaves roses on your doormat every morning. Today, a letter: 'You looked stunning yesterday at the supermarket, frozen foods aisle. — {a.first}'. You don't know any {a.first}.", "Someone named {a.first} has commented on every photo of yours for six months, knows your schedule by heart and just moved in across the hall. Pure coincidence, {a:he|she} swears."],
    },
    choices: [
      {
        label: { fr: 'Porter plainte', en: 'File a complaint' },
        out: [
          { w: 1, text: { fr: "J'ai porté plainte. Le policier m'a demandé si les roses étaient jolies. Ordonnance d'éloignement obtenue. {a.first} m'envoie désormais des roses à distance réglementaire.", en: 'I filed a complaint. The officer asked if the roses were nice. Restraining order granted. {a.first} now sends roses from a legal distance.' }, fx: { stress: 5, happy: -2, actorRole: 'enemy', flag: 'lv_stalker', schedule: { key: 'lv_stalker_back', years: 2 } } },
          { w: 1, text: { fr: "J'ai porté plainte. Quelques semaines plus tard, {a.first} a déménagé à l'autre bout du pays. Je dors enfin.", en: 'I filed a complaint. A few weeks later, {a.first} moved to the other side of the country. I can finally sleep.' }, fx: { stress: -5, happy: 5 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Confronter {a.first}', en: 'Confront {a.first}' },
        out: [
          { w: 1, text: { fr: "J'ai confronté {a.first}. {a:Il|Elle} a pleuré, s'est excusé{a:|e}, puis m'a demandé si j'étais libre jeudi. Non.", en: 'I confronted {a.first}. {a:He|She} cried, apologized, then asked if I was free Thursday. No.' }, fx: { stress: 4, actorRole: 'enemy', flag: 'lv_stalker', schedule: { key: 'lv_stalker_back', years: 2 } } },
          { w: 1, text: { fr: "J'ai confronté {a.first}. {a:Il|Elle} m'a montré un album photo de moi, relié cuir, avec index. J'ai déménagé le lendemain.", en: '{a.first} showed me a leather-bound photo album of me, with an index, when I confronted {a.him}. I moved out the next day.' }, fx: { stress: 10, happy: -6, money: -800, moveOut: true }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Ignorer', en: 'Ignore it' }, text: { fr: "J'ai ignoré les roses. J'en ai maintenant 212. Mon appart ressemble à un funérarium, mais il sent bon.", en: 'I ignored the roses. I now have 212. My apartment looks like a funeral parlor, but it smells nice.' }, fx: { stress: 6, actorRole: 'enemy', flag: 'lv_stalker', schedule: { key: 'lv_stalker_back', years: 2 } } },
    ],
  },
  {
    id: 'lv_stalker_back',
    icon: '🌹',
    cat: 'love',
    rating: 1,
    chainOnly: true,
    actor: 'enemy',
    scene: { place: 'home', mood: 'shock', prop: 'sweater' },
    when: { age: [20, 80], flag: 'lv_stalker' },
    text: {
      fr: ["{a.first} est de retour. Tu l'as reconnu{a:|e} dans le bus : {a:il|elle} portait un t-shirt avec ta tête dessus. Et un téléobjectif.", "Un colis anonyme : un pull tricoté main à tes initiales et un mot. « Deux ans que je pense à toi. Tu as changé de coiffure. J'approuve. — {a.first} »"],
      en: ["{a.first} is back. You spotted {a.him} on the bus: {a:he|she} was wearing a t-shirt with your face on it. And carrying a telephoto lens.", "An anonymous package: a hand-knitted sweater with your initials and a note. 'Two years thinking of you. You changed your hair. I approve. — {a.first}'"],
    },
    choices: [
      {
        label: { fr: 'Appeler la police', en: 'Call the police' },
        out: [
          { w: 1, text: { fr: "Cette fois, la police a pris l'affaire au sérieux : {a.first} a été arrêté{a:|e} avec un carnet de 400 pages sur moi. Ils m'en ont lu des extraits. C'était très bien écrit.", en: '{a.first} was arrested this time, with a 400-page notebook about me. They read me excerpts. It was very well written.' }, fx: { stress: -8, happy: 6, actorGone: true, unflag: 'lv_stalker' }, mood: 'happy' },
          { w: 1, text: { fr: "La police m'a conseillé de « changer de numéro et de ville ». J'ai changé de numéro et de ville.", en: "The police advised me to 'change my number and my city'. I changed my number and my city." }, fx: { stress: 6, money: -1000, moveOut: true, actorGone: true, unflag: 'lv_stalker' }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Négocier un traité', en: 'Negotiate a treaty' }, text: { fr: "J'ai négocié avec {a.first} : {a:il|elle} me laisse tranquille, je like un post par mois. Le traité de paix tient. Bizarrement.", en: '{a.first} and I negotiated: {a:he|she} leaves me alone, I like one post a month. The peace treaty holds. Weirdly.' }, fx: { stress: -4, rel: 10, unflag: 'lv_stalker' } },
      { label: { fr: 'Garder le pull', en: 'Keep the sweater' }, text: { fr: "J'ai gardé le pull. Il est vraiment très chaud. Je déteste qu'il soit aussi chaud.", en: 'I kept the sweater. It is really, really warm. I hate how warm it is.' }, fx: { happy: 2, stress: 4, karma: -1, unflag: 'lv_stalker' } },
    ],
  },
  {
    id: 'lv_swingers',
    icon: '🍍',
    cat: 'love',
    rating: 2,
    actor: 'lover',
    scene: { place: 'villa', mood: 'party', prop: 'pineapple' },
    when: { age: [25, 70] },
    weight: 4,
    once: true,
    text: {
      fr: ["Thierry et Sandrine, les voisins bronzés toute l'année, vous invitent, {a.first} et toi, à une « soirée ananas » dans leur villa. Dress code : peignoir. Il y a un bol de clés de voiture à l'entrée.", "Au barbecue, Sandrine te glisse un flyer : « Soirée libertine samedi, couples ouverts d'esprit bienvenus 😘 ». Thierry fait un clin d'œil à {a.first}. Puis à toi. Puis aux merguez."],
      en: ["Thierry and Sandrine, the neighbors with the year-round tan, invite you and {a.first} to a 'pineapple party' at their villa. Dress code: bathrobe. There's a bowl of car keys by the door.", "At the barbecue, Sandrine slips you a flyer: 'Swingers night Saturday, open-minded couples welcome 😘'. Thierry winks at {a.first}. Then at you. Then at the sausages."],
    },
    choices: [
      {
        label: { fr: 'Y aller par curiosité', en: 'Go out of curiosity' },
        out: [
          { w: 2, text: { fr: "Soirée passée à manger des chips en peignoir en évitant tout contact visuel. Départ à 22 h, fou rire dans la voiture.", en: 'Spent the night eating chips in a bathrobe, avoiding all eye contact. Left at 10 p.m., giggling all the way home.' }, fx: { rel: 8, happy: 6, flag: 'lv_swingers' }, mood: 'happy' },
          { w: 1, text: { fr: "{a.first} s'est beaucoup, beaucoup amusé{a:|e}. Moi, j'ai parlé placements immobiliers trois heures avec un monsieur tout nu. Notre couple traverse une phase.", en: "{a.first} had a lot, a LOT of fun. I spent three hours discussing real estate with a naked man. Our relationship is going through a phase." }, fx: { rel: -12, happy: -6, stress: 6, flag: 'lv_swingers' }, mood: 'shock' },
          { w: 1, text: { fr: "Ambiance survoltée, peignoirs qui volent. Je ne raconterai rien. Mais on y retourne le mois prochain. {a.first} a déjà réservé.", en: "Electric atmosphere, flying bathrobes. I'm not saying anything. But we're going back next month. {a.first} already booked." }, fx: { rel: 10, happy: 10, karma: -2, flag: 'lv_swingers' }, mood: 'party' },
        ],
      },
      { label: { fr: 'Décliner poliment', en: 'Politely decline' }, text: { fr: "J'ai décliné poliment. Depuis, Thierry nous fait un clin d'œil appuyé chaque matin. Même en sortant les poubelles.", en: 'I politely declined. Ever since, Thierry gives us a heavy wink every morning. Even while taking out the trash.' }, fx: { happy: 2 } },
      { label: { fr: 'Prévenir le syndic', en: 'Report to the HOA' }, text: { fr: "J'ai signalé la soirée au syndic de copropriété. Le président du syndic était sur la liste des invités. Il m'a regardé{|e} avec pitié.", en: 'I reported the party to the HOA. The HOA president was on the guest list. He looked at me with pity.' }, fx: { karma: -2, happy: -3 } },
    ],
  },
  {
    id: 'lv_swingers_after',
    icon: '🍍',
    cat: 'love',
    rating: 2,
    auto: true,
    scene: { place: 'home', mood: 'shock', prop: 'pineapple' },
    when: { age: [25, 75], flag: 'lv_swingers' },
    weight: 8,
    once: true,
    text: {
      fr: ["Depuis la soirée chez Thierry et Sandrine, je ne peux plus regarder un ananas sans rougir. Au supermarché, je change de rayon.", "Thierry et Sandrine m'ont envoyé une carte de vœux. Sur la photo, ils sont en peignoir, à côté d'un ananas. Je ne l'ai pas aimantée sur le frigo."],
      en: ["Since the party at Thierry and Sandrine's, I can't look at a pineapple without blushing. I switch aisles at the supermarket.", "Thierry and Sandrine sent me a holiday card. In the photo, they're in bathrobes, next to a pineapple. It did not go on the fridge."],
    },
    fx: { happy: 2, stress: 2 },
  },
  {
    id: 'lv_sugar',
    icon: '💸',
    cat: 'love',
    rating: 2,
    actor: { create: { role: 'acquaintance', age: [20, 35], gender: 'attracted' } },
    vars: { amount: [800, 4000] },
    scene: { place: 'mansion', mood: 'shock', prop: 'envelope', fx: 'money' },
    when: { age: [18, 30] },
    weight: 4,
    once: true,
    text: {
      fr: ["Un{a:|e} certain{a:|e} {a.first}, {a.age} ans, Rolex au poignet et yacht en photo de profil, te propose d'être ton {a:sugar daddy|sugar mommy}. Contre « compagnie et discrétion » : {$amount} par mois.", "{a.first}, {a.age} ans, millionnaire en {a:costume|tailleur} de lin, t'invite à dîner et pose une enveloppe sur la table : {$amount}. « Pour tes études. Ou tes ongles. Je ne juge pas. »"],
      en: ["Someone named {a.first}, {a.age}, Rolex on the wrist and a yacht as profile pic, offers to be your {a:sugar daddy|sugar mommy}. In exchange for 'company and discretion': {$amount} a month.", "{a.first}, {a.age}, a millionaire in a linen {a:suit|pantsuit}, takes you to dinner and slides an envelope across the table: {$amount}. 'For your studies. Or your nails. No judgment.'"],
    },
    choices: [
      {
        label: { fr: 'Accepter le deal', en: 'Take the deal' },
        out: [
          { w: 2, text: { fr: "J'ai accepté. Restos étoilés, sacs de luxe et conversations interminables sur le golf. {a.first} paie, je souris. Mon âme est en location.", en: 'I accepted. Michelin-star dinners, designer bags and endless conversations about golf. {a.first} pays, I smile. My soul is for rent.' }, fx: { money: 'amount', happy: 8, karma: -8, looks: 3, flag: 'lv_sugar', keep: true, schedule: { key: 'lv_sugar_end', years: 2 } }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai accepté. Au premier dîner, {a.first} m'a présenté{|e} comme « {mon neveu|ma nièce} » à ses associés. Malaise. Mais l'enveloppe était épaisse.", en: "I accepted. At the first dinner, {a.first} introduced me to {a:his|her} associates as '{my nephew|my niece}'. Awkward. But the envelope was thick." }, fx: { money: 'amount', happy: 4, karma: -8, stress: 4, flag: 'lv_sugar', keep: true, schedule: { key: 'lv_sugar_end', years: 2 } } },
        ],
      },
      {
        label: { fr: 'Négocier à la hausse', en: 'Negotiate up' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "J'ai négocié comme un requin. {a.first} a monté l'offre et ajouté une voiture. Une Twingo, mais quand même. Wall Street a perdu un talent.", en: "I negotiated like a shark. {a.first} raised the offer and threw in a car. A tiny hatchback, but still. Wall Street lost a talent." }, fx: { money: 'amount', asset: 'c_twingo', happy: 10, karma: -8, flag: 'lv_sugar', keep: true, schedule: { key: 'lv_sugar_end', years: 2 } }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai voulu négocier. {a.first} a trouvé ça « vulgaire » et a fait la même offre à la personne de la table d'à côté.", en: "I tried to negotiate. {a.first} found it 'vulgar' and made the same offer to the person at the next table." }, fx: { happy: -4 } },
        ],
      },
      { label: { fr: 'Refuser avec dignité', en: 'Refuse with dignity' }, text: { fr: "J'ai refusé avec dignité. Puis j'ai voulu payer mes pâtes premier prix avec ma dignité. Elle n'est pas acceptée en caisse.", en: 'I refused with dignity. Then I tried to pay for my store-brand pasta with my dignity. The cashier didn\'t accept it.' }, fx: { karma: 6, happy: -2 } },
    ],
  },
  {
    id: 'lv_sugar_end',
    icon: '🥀',
    cat: 'love',
    rating: 2,
    chainOnly: true,
    vars: { amount: [1000, 6000] },
    scene: { place: 'mansion', mood: 'shock', prop: 'dog' },
    when: { age: [18, 40], flag: 'lv_sugar' },
    text: {
      fr: ["Deux ans de vie de luxe aux frais de {a.first}. Ce matin, sa moitié légitime débarque dans le penthouse avec un avocat et un golden retriever très en colère.", "{a.first} t'annonce que sa « fortune » était un crédit à 23 % et que les huissiers arrivent. {a:Il|Elle} te demande si tu peux « dépanner ». Avec l'argent qu'{a:il|elle} t'a donné."],
      en: ["Two years of luxury on {a.first}'s dime. This morning {a:his|her} lawful spouse storms into the penthouse with a lawyer and a very angry golden retriever.", "{a.first} announces {a:his|her} 'fortune' was a 23% interest loan and the bailiffs are coming. {a:He|She} asks if you can 'help out'. With the money {a:he|she} gave you."],
    },
    choices: [
      { label: { fr: 'Filer avec les bijoux', en: 'Run with the jewelry' }, text: { fr: "Je suis parti{|e} par l'escalier de service avec deux montres et un collier. Revendus {$amount}. Le golden retriever m'a mordu{|e} la fesse au passage.", en: 'I left by the service stairs with two watches and a necklace. Sold for {$amount}. The golden retriever bit my butt on the way out.' }, fx: { money: 'amount', karma: -10, health: -3, unflag: 'lv_sugar', actorGone: true }, mood: 'shock' },
      { label: { fr: 'Tout rendre', en: 'Give it all back' }, text: { fr: "J'ai tout rendu, sauf un peignoir en soie. Retour aux pâtes, mais en peignoir en soie.", en: 'I gave everything back, except a silk robe. Back to pasta, but in a silk robe.' }, fx: { karma: 6, happy: -6, unflag: 'lv_sugar', actorGone: true } },
      {
        label: { fr: 'Tomber amoureux{|se} pour de vrai', en: 'Actually fall in love' },
        out: [
          { w: 1, text: { fr: "J'ai réalisé que j'aimais vraiment {a.first}, ruiné{a:|e} ou pas. Deux-pièces, pâtes, bonheur. Dans cet ordre.", en: 'I realized I truly loved {a.first}, broke or not. Tiny flat, pasta, happiness. In that order.' }, fx: { rel: 25, happy: 10, actorRole: 'partner', unflag: 'lv_sugar' }, mood: 'love' },
          { w: 1, text: { fr: "J'ai déclaré ma flamme. {a.first} a soupiré « Oh non, pas encore » et m'a remplacé{|e} par quelqu'un de plus jeune le soir même.", en: "I declared my love. {a.first} sighed 'Oh no, not again' and replaced me with someone younger that same night." }, fx: { happy: -10, unflag: 'lv_sugar', actorGone: true }, mood: 'cry' },
        ],
      },
    ],
  },
];
