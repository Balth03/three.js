// Adult life events (18–80): university, first apartment, work, love, money, health, family, weirdness.
import type { EventDef } from '@bl/sim';

export const adultEvents: EventDef[] = [
  // ───────────────────────────── university ─────────────────────────────
  {
    id: 'ad_uni_exam',
    icon: '📚',
    cat: 'uni',
    scene: { place: 'uni', mood: 'sleepy', prop: 'books' },
    when: { age: [18, 28], school: 'uni' },
    weight: 10,
    cooldown: 2,
    text: {
      fr: ["Tes partiels de {major} sont dans trois jours. Tu n'as ouvert ton manuel qu'une seule fois : pour caler une table.", "Semaine d'examens à {school}. La bibliothèque sent le café froid et la panique. Quelle est ta stratégie ?"],
      en: ["Your {major} finals are in three days. You've opened the textbook exactly once: to level a table.", "Exam week at {school}. The library smells of cold coffee and panic. What's your strategy?"],
    },
    choices: [
      {
        label: { fr: 'Réviser jour et nuit', en: 'Cram day and night' },
        out: [
          { w: 4, odds: { smarts: 1 }, text: { fr: "J'ai révisé jusqu'à 4 h du matin. J'ai cartonné aux partiels, et vu mon café me parler.", en: 'I studied until 4 a.m. I aced my finals, and my coffee started talking to me.' }, fx: { grade: 12, smarts: 3, stress: 8, health: -2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai tellement révisé que je me suis endormi{|e} pendant l'examen. Sur ma copie. En bavant dessus.", en: 'I studied so hard I fell asleep during the exam. On my paper. Drooling on it.' }, fx: { grade: -5, stress: 5 } },
          { w: 1, text: { fr: "Trois nuits blanches plus tard, j'avais tout retenu, plus une migraine qui m'a suivi{|e} tout le semestre.", en: 'Three all-nighters later, I remembered everything, plus a migraine that followed me all semester.' }, fx: { grade: 8, disease: 'migraine' } },
        ],
      },
      {
        label: { fr: 'Antisèche dans la trousse', en: 'Hide a cheat sheet' },
        out: [
          { w: 2, text: { fr: "Mon antisèche était un chef-d'œuvre de micro-écriture. Ça a marché. Ma conscience, elle, a quelques questions.", en: 'My cheat sheet was a masterpiece of micro-writing. It worked. My conscience has a few questions.' }, fx: { grade: 8, karma: -5 } },
          { w: 1, text: { fr: "Le surveillant a trouvé mon antisèche. Il l'a lue en entier, a corrigé deux fautes d'orthographe, puis m'a mis zéro.", en: 'The proctor found my cheat sheet. He read it all, corrected two spelling mistakes, then gave me a zero.' }, fx: { grade: -15, karma: -3, happy: -6, stress: 6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Improviser le jour J', en: 'Wing it' },
        out: [
          { w: 1, text: { fr: "J'ai tout misé sur l'intervention divine. Dieu était visiblement en partiels, lui aussi.", en: 'I bet everything on divine intervention. Apparently God had exams too.' }, fx: { grade: -8, happy: -3 } },
          { w: 1, odds: { smarts: 0.5 }, text: { fr: "J'ai improvisé avec un aplomb remarquable. Le prof a trouvé ma copie « audacieuse ». J'ai eu la moyenne pile.", en: "I improvised with remarkable confidence. The professor called my paper 'bold'. I passed by a hair." }, fx: { grade: 2, happy: 4 } },
        ],
      },
    ],
  },
  {
    id: 'ad_uni_roommate',
    icon: '🛏️',
    cat: 'uni',
    scene: { place: 'apartment', mood: 'angry', prop: 'fridge' },
    when: { age: [18, 26], school: 'uni' },
    weight: 10,
    cooldown: 3,
    text: {
      fr: ["Ton coloc pille ton frigo. Hier, ton yaourt. Ce matin, ta pizza. Celle avec ton prénom écrit dessus au marqueur.", "Ton coloc a « emprunté » ta brosse à dents, ton chargeur et ton dernier paquet de pâtes. Pour lui, c'est du partage."],
      en: ['Your roommate keeps raiding your fridge. Yesterday, your yogurt. This morning, your pizza. The one with your name on it in marker.', "Your roommate 'borrowed' your toothbrush, your charger and your last pack of pasta. They call it sharing."],
    },
    choices: [
      {
        label: { fr: 'Discussion entre adultes', en: 'Have the talk' },
        out: [
          { w: 2, text: { fr: "J'ai eu une vraie conversation d'adulte avec mon coloc. Il a pleuré, moi aussi, et on a fait un planning du frigo plastifié.", en: 'I had a real grown-up talk with my roommate. We both cried and made a laminated fridge schedule.' }, fx: { happy: 5, stress: -3 } },
          { w: 1, text: { fr: "J'ai confronté mon coloc. Il m'a regardé{|e} droit dans les yeux en mangeant mon fromage. Depuis, c'est la guerre froide.", en: 'I confronted my roommate. They looked me dead in the eye while eating my cheese. It has been a cold war ever since.' }, fx: { happy: -5, stress: 6 } },
        ],
      },
      { label: { fr: 'Piéger la nourriture', en: 'Booby-trap the food' }, text: { fr: "J'ai rempli un pot de mayonnaise avec de la crème vanille. Il ne m'a plus jamais rien volé. Ni adressé la parole.", en: 'I filled a mayonnaise jar with vanilla pudding. They never stole from me again. Or spoke to me.' }, fx: { happy: 8, karma: -2 } },
      {
        label: { fr: 'Laisser couler', en: 'Let it slide' },
        out: [
          { w: 1, text: { fr: "J'ai laissé couler. En prime, mon coloc m'a refilé sa grippe. Le partage jusqu'au bout.", en: 'I let it slide. As a bonus, my roommate gave me their flu. Sharing all the way.' }, fx: { happy: -4, disease: 'flu' }, mood: 'sick' },
          { w: 2, text: { fr: "Je me suis acheté un mini-frigo avec cadenas. Mon frigo. Ma forteresse.", en: 'I bought a mini-fridge with a padlock. My fridge. My fortress.' }, fx: { money: -120, happy: 4 } },
        ],
      },
    ],
  },
  {
    id: 'ad_uni_party',
    icon: '🎉',
    cat: 'uni',
    mature: true,
    scene: { place: 'party', mood: 'party', prop: 'cups' },
    when: { age: [18, 25], school: 'uni' },
    weight: 10,
    cooldown: 2,
    text: {
      fr: ["Grosse soirée étudiante ce soir chez un type de ta promo dont personne ne connaît le prénom. Au programme : musique, gobelets rouges et un canapé qui ne survivra pas.", "L'asso étudiante organise une soirée « Toges et Paillettes ». Tu as un partiel demain à 8 h."],
      en: ['Big student party tonight at the place of some guy from your class whose name nobody knows. On the menu: music, red cups and a couch that will not survive.', "The student union is throwing a 'Togas & Glitter' party. You have an exam tomorrow at 8 a.m."],
    },
    choices: [
      {
        label: { fr: 'Y aller à fond', en: 'Go all in' },
        out: [
          { w: 3, text: { fr: "J'ai dansé sur une table, gagné un tournoi de baby-foot et appris le prénom de l'hôte au petit matin. Inoubliable.", en: "I danced on a table, won a foosball tournament and learned the host's name at dawn. Unforgettable." }, fx: { happy: 12, health: -3, grade: -3 } },
          { w: 1, text: { fr: "Je me suis réveillé{|e} dans une baignoire, déguisé{|e} en pirate. Aucun souvenir. Une photo circule.", en: 'I woke up in a bathtub dressed as a pirate. No memory. A photo is circulating.' }, fx: { happy: 2, health: -5, fame: 2, stress: 5 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Juste un verre', en: 'Just one drink' }, text: { fr: "Un verre, deux discussions profondes sur le sens de la vie, retour à minuit. J'étais fier{|e} de moi.", en: 'One drink, two deep conversations about the meaning of life, home by midnight. I was proud of myself.' }, fx: { happy: 6, discipline: 3 } },
      { label: { fr: 'Rester réviser', en: 'Stay in and study' }, text: { fr: "J'ai révisé pendant que les basses faisaient trembler mes murs. Le lendemain, tout le monde avait mal au crâne sauf moi.", en: 'I studied while the bass shook my walls. The next day, everyone had a headache except me.' }, fx: { grade: 6, happy: -3 } },
    ],
  },
  {
    id: 'ad_uni_internship',
    icon: '💼',
    cat: 'uni',
    scene: { place: 'office', mood: 'proud', prop: 'laptop' },
    when: { age: [19, 28], school: 'uni' },
    weight: 8,
    once: true,
    text: {
      fr: ["Une boîte te propose un stage de six mois. Rémunération : « de l'expérience » et un accès illimité à la machine à café.", "Tu décroches un entretien de stage. Le recruteur te demande où tu te vois dans cinq ans. Honnêtement ? Au lit."],
      en: ["A company offers you a six-month internship. Pay: 'experience' and unlimited access to the coffee machine.", 'You land an internship interview. The recruiter asks where you see yourself in five years. Honestly? In bed.'],
    },
    choices: [
      {
        label: { fr: 'Accepter le stage', en: 'Take the internship' },
        out: [
          { w: 3, odds: { discipline: 1 }, text: { fr: "J'ai fait des photocopies, des cafés et un tableau Excel si beau que mon tuteur a versé une larme. Il m'a dit de l'appeler un jour.", en: 'I made photocopies, coffee and a spreadsheet so beautiful my mentor shed a tear. He told me to call him someday.' }, fx: { smarts: 5, stress: 5, flag: 'ad_intern_network' }, mood: 'proud' },
          { w: 1, text: { fr: "Six mois à trier des trombones par couleur. J'ai appris que je ne voulais jamais faire ce métier. C'est déjà ça.", en: "Six months sorting paperclips by color. I learned I never want to do this job. That's something." }, fx: { smarts: 2, happy: -4 } },
        ],
      },
      {
        label: { fr: 'Exiger un salaire', en: 'Ask to be paid' },
        out: [
          { w: 1, text: { fr: "J'ai osé demander à être payé{|e}. Ils ont dit oui ! Une petite gratification et un badge à mon nom.", en: 'I dared to ask to be paid. They said yes! A small stipend and a badge with my name on it.' }, fx: { money: 400, happy: 6, flag: 'ad_intern_network' } },
          { w: 2, text: { fr: "J'ai demandé un salaire. Ils ont ri, puis donné le stage au neveu du directeur.", en: "I asked for a salary. They laughed, then gave the internship to the director's nephew." }, fx: { happy: -5 } },
        ],
      },
      { label: { fr: "Profiter de l'été", en: 'Enjoy the summer' }, text: { fr: "J'ai décliné. L'été est court, la vie aussi, et mon CV peut bien attendre.", en: 'I declined. Summer is short, so is life, and my résumé can wait.' }, fx: { happy: 7, discipline: -3 } },
    ],
  },

  // ───────────────────────────── home ─────────────────────────────
  {
    id: 'ad_first_apartment',
    icon: '🏠',
    cat: 'home',
    scene: { place: 'apartment', mood: 'shock', prop: 'boxes' },
    when: { age: [18, 35], movedOut: true },
    weight: 12,
    once: true,
    text: {
      fr: ["Ton premier appart ! 19 m², une fenêtre avec vue sur un mur, et un voisin du dessus qui semble faire des claquettes à 3 h du matin.", "Bienvenue chez toi ! Le chauffe-eau fait un bruit de baleine mourante et la porte des toilettes ne ferme pas. Le rêve."],
      en: ['Your first apartment! 200 sq ft, a window with a view of a wall, and an upstairs neighbor who seems to tap-dance at 3 a.m.', "Welcome home! The water heater sounds like a dying whale and the bathroom door won't close. Living the dream."],
    },
    choices: [
      {
        label: { fr: 'Pendre la crémaillère', en: 'Throw a housewarming' },
        out: [
          { w: 2, text: { fr: "J'ai pendu la crémaillère. Quinze personnes dans un studio : record battu, ainsi qu'un verre à pied.", en: 'I threw a housewarming. Fifteen people in a studio: a record was broken, and so was a wine glass.' }, fx: { happy: 10, money: -80 }, mood: 'party' },
          { w: 1, text: { fr: "J'ai monté le canapé tout{|e} seul{|e} au 5e sans ascenseur. Mon dos ne me l'a jamais pardonné.", en: 'I carried the couch up to the 5th floor alone, no elevator. My back never forgave me.' }, fx: { happy: 3, disease: 'back_pain' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Tout décorer', en: 'Decorate everything' }, text: { fr: "J'ai acheté des plantes, une guirlande lumineuse et un tapis hors de prix. Les plantes sont mortes en trois semaines, mais quelle ambiance.", en: 'I bought plants, fairy lights and an overpriced rug. The plants died within three weeks, but what a vibe.' }, fx: { money: -300, happy: 8 } },
      {
        label: { fr: 'Monter voir le voisin', en: 'Knock upstairs' },
        out: [
          { w: 1, text: { fr: "Je suis monté{|e} chez le voisin. C'est un retraité adorable qui apprend vraiment les claquettes. Il m'a offert du gâteau.", en: "I went upstairs. It's a lovely retiree who is genuinely learning to tap-dance. He gave me cake." }, fx: { happy: 6, karma: 3 } },
          { w: 1, text: { fr: "Le voisin m'a claqué la porte au nez, puis a repris ses claquettes. Plus fort.", en: 'The neighbor slammed the door in my face, then resumed tap-dancing. Louder.' }, fx: { happy: -4, stress: 6 }, mood: 'angry' },
        ],
      },
    ],
  },

  // ───────────────────────────── work ─────────────────────────────
  {
    id: 'ad_coworker',
    icon: '🙄',
    cat: 'work',
    actor: 'coworker',
    scene: { place: 'office', mood: 'angry', prop: 'mug' },
    when: { age: [18, 67], job: true },
    weight: 10,
    cooldown: 3,
    text: {
      fr: ["{a.first}, {a.rel}, mange du hareng fumé au bureau, siffle en tapant et répond « hmm hmm » à tout. Aujourd'hui, {a.he} t'a piqué ton mug.", "{a.first} vient de présenter ton idée en réunion. Comme si c'était la sienne. Avec tes slides."],
      en: ["{a.first}, your coworker, eats smoked herring at {a:his|her} desk, whistles while typing and answers 'mm-hmm' to everything. Today, {a.he} stole your mug.", '{a.first} just pitched your idea in the meeting. As if it were {a:his|hers}. With your slides.'],
    },
    choices: [
      {
        label: { fr: 'Mettre les choses au clair', en: 'Set things straight' },
        out: [
          { w: 2, text: { fr: "J'ai mis les choses au clair avec {a.first}. {a:Il|Elle} s'est excusé{a:|e}, la bouche pleine de hareng.", en: 'I set things straight with {a.first}. {a:He|She} apologized, mouth full of herring.' }, fx: { rel: -5, happy: 4, stress: -3, perf: 3 } },
          { w: 1, text: { fr: "J'ai haussé le ton. C'est moi qui ai été convoqué{|e} par les RH. La vie est injuste.", en: 'I raised my voice. I was the one summoned by HR. Life is unfair.' }, fx: { rel: -10, happy: -6, perf: -10 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Vengeance mesquine', en: 'Petty revenge' }, text: { fr: "J'ai passé l'ordinateur de {a.first} en finnois. Ça fait trois jours. {a:Il|Elle} n'ose rien dire.", en: "I switched {a.first}'s computer to Finnish. It's been three days. {a:He|She} doesn't dare say anything." }, fx: { happy: 8, karma: -3, rel: -8 } },
      {
        label: { fr: "Tenter l'amitié", en: 'Try friendship' },
        out: [
          { w: 1, text: { fr: "J'ai invité {a.first} à déjeuner. On s'est découvert une passion commune pour les documentaires sur les phoques. Inséparables.", en: 'I took {a.first} to lunch. We discovered a shared passion for seal documentaries. Inseparable.' }, fx: { rel: 15, happy: 5 } },
          { w: 1, text: { fr: "J'ai tenté l'amitié. {a.first} m'a parlé de ses cryptomonnaies pendant deux heures. Je n'ai plus de joie.", en: 'I tried friendship. {a.first} talked to me about crypto for two hours. I have no joy left.' }, fx: { rel: 3, happy: -3 } },
        ],
      },
    ],
  },
  {
    id: 'ad_boss_raise',
    icon: '📈',
    cat: 'work',
    actor: 'boss',
    vars: { amount: [300, 1500] },
    scene: { place: 'office', mood: 'neutral', prop: 'chart' },
    when: { age: [20, 67], job: true },
    weight: 10,
    cooldown: 3,
    text: {
      fr: ["{a.first}, {a.rel}, est de bonne humeur aujourd'hui : {a.he} a fredonné dans l'ascenseur. C'est le moment ou jamais de parler argent.", "Ça fait des mois que tu fais le travail de trois personnes chez {employer}. {a.first}, {a.rel}, vient de passer devant ton bureau en sifflotant. C'est l'occasion."],
      en: ["{a.first}, your boss, is in a good mood today: {a.he} hummed in the elevator. It's now or never to talk money.", "You've been doing the work of three people at {employer} for months. {a.first}, your boss, just walked past your desk whistling. Here's your chance."],
    },
    choices: [
      {
        label: { fr: 'Demander une augmentation', en: 'Ask for a raise' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: "J'ai défendu mon cas avec un PowerPoint de 14 slides. {a.first} a craqué à la slide 9 : prime de {$amount} !", en: 'I made my case with a 14-slide PowerPoint. {a.first} caved at slide 9: a {$amount} bonus!' }, fx: { money: 'amount', happy: 8, rel: 3 }, mood: 'proud' },
          { w: 2, text: { fr: "{a.first} m'a répondu que « ce n'était pas le moment ». Apparemment, ce n'est jamais le moment depuis 2009.", en: "{a.first} told me 'now's not the time'. Apparently it hasn't been the time since 2009." }, fx: { happy: -6, stress: 4 } },
          { w: 1, text: { fr: "J'ai négocié si bien que {a.first} m'a proposé une promotion. Je n'ai toujours pas compris comment.", en: "I negotiated so well that {a.first} offered me a promotion. I still don't understand how." }, fx: { promote: true, happy: 12, rel: 5 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Proposer un gros projet', en: 'Pitch a big project' },
        out: [
          { w: 1, text: { fr: "J'ai pitché mon projet. {a.first} a adoré et me l'a confié. Ainsi que tous mes week-ends.", en: 'I pitched my project. {a.first} loved it and handed it to me. Along with all my weekends.' }, fx: { perf: 10, stress: 8, rel: 8 } },
          { w: 1, text: { fr: "Mon projet a été jugé « trop ambitieux ». Traduction : trop de travail pour {a.first}.", en: "My project was deemed 'too ambitious'. Translation: too much work for {a.first}." }, fx: { perf: -3, happy: -3 } },
        ],
      },
      { label: { fr: 'Faire profil bas', en: 'Keep my head down' }, text: { fr: "Je n'ai rien dit. J'ai continué à bosser en silence, comme un ficus très productif.", en: 'I said nothing. I kept working in silence, like a very productive ficus.' }, fx: { perf: 4, happy: -2 } },
    ],
  },
  {
    id: 'ad_office_party',
    icon: '🥂',
    cat: 'work',
    mature: true,
    scene: { place: 'party', mood: 'party', prop: 'champagne' },
    when: { age: [18, 67], job: true },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["Pot de fin d'année chez {employer} ! Chips molles, mousseux tiède et karaoké obligatoire.", "La soirée d'entreprise bat son plein. Le DRH danse la macarena avec une conviction inquiétante. Le micro du karaoké te fait de l'œil."],
      en: ['Year-end party at {employer}! Soggy chips, lukewarm bubbly and mandatory karaoke.', 'The company party is in full swing. The HR director is doing the Macarena with alarming conviction. The karaoke mic is calling your name.'],
    },
    choices: [
      {
        label: { fr: 'Prendre le micro', en: 'Grab the mic' },
        out: [
          { w: 2, text: { fr: "J'ai chanté « I Will Survive » avec mes tripes. Standing ovation. Même la compta a pleuré.", en: "I sang 'I Will Survive' from the gut. Standing ovation. Even accounting cried." }, fx: { happy: 10, perf: 5, fame: 1 } },
          { w: 1, text: { fr: "J'ai massacré du Céline Dion devant toute la direction. On en reparlera à mon pot de départ.", en: "I butchered Céline Dion in front of the entire leadership team. They'll bring it up at my farewell party." }, fx: { happy: -4, perf: -5, stress: 5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Dévaliser le buffet', en: 'Raid the buffet' },
        out: [
          { w: 5, text: { fr: "J'ai mangé 43 mini-quiches. Record de l'étage. Personne n'a osé me le contester.", en: 'I ate 43 mini quiches. A floor record. Nobody dared challenge me.' }, fx: { happy: 6, health: -2 } },
          { w: 1, text: { fr: "Ma prise de sang du lundi n'a pas aimé les petits fours. Le médecin a prononcé le mot « diabète ».", en: "My Monday blood test did not enjoy the canapés. The doctor said the word 'diabetes'." }, fx: { happy: -6, disease: 'diabetes' }, mood: 'sick' },
        ],
      },
      { label: { fr: "Filer à l'anglaise", en: 'Sneak out early' }, text: { fr: "Je suis parti{|e} sans dire au revoir à 20 h 12. Le lendemain, personne ne l'avait remarqué. Vexant, mais efficace.", en: 'I left without saying goodbye at 8:12 p.m. The next day, nobody had noticed. Hurtful, but efficient.' }, fx: { happy: 3, stress: -3 } },
      {
        label: { fr: 'Dire ses vérités au big boss', en: 'Speak my mind to the CEO' },
        out: [
          { w: 2, text: { fr: "J'ai dit au directeur que sa cravate était hideuse. Il a ri. Il la porte tous les jours depuis. On est potes, je crois.", en: "I told the CEO his tie was hideous. He laughed. He's worn it every day since. We're friends, I think." }, fx: { perf: 5, happy: 6 } },
          { w: 1, text: { fr: "Deux coupes de mousseux et j'ai dit au directeur ce que je pensais vraiment de lui. Il a salué ma franchise. Par lettre recommandée.", en: 'Two glasses of bubbly and I told the CEO what I really thought of him. He appreciated my honesty. By certified letter.' }, fx: { fired: true, happy: -8 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'ad_burnout',
    icon: '🔥',
    cat: 'work',
    scene: { place: 'office', mood: 'cry', prop: 'laptop' },
    when: { age: [22, 65], job: true, stat: { stress: [55, 100] } },
    weight: 10,
    cooldown: 5,
    text: {
      fr: ["Tu réponds à des mails dans ton sommeil. Ce matin, tu as signé « Cordialement » en disant au revoir à ta boulangère.", "Ton médecin a regardé ta tension, puis ton agenda, puis toi. « Vous savez ce que c'est, un week-end ? »"],
      en: ["You answer emails in your sleep. This morning you said 'Best regards' to the baker on your way out.", "Your doctor looked at your blood pressure, then your calendar, then you. 'Do you know what a weekend is?'"],
    },
    choices: [
      { label: { fr: 'Prendre un congé', en: 'Take time off' }, text: { fr: "J'ai pris trois semaines. J'ai dormi, marché en forêt et parlé à un canard. Je revis.", en: 'I took three weeks off. I slept, walked in the woods and talked to a duck. I feel alive again.' }, fx: { stress: -15, happy: 8, perf: -5 }, mood: 'happy' },
      {
        label: { fr: 'Serrer les dents', en: 'Push through' },
        out: [
          { w: 2, text: { fr: "J'ai serré les dents. Résultat : je ne dors plus. Mon oreiller et moi, c'est fini.", en: "I pushed through. Result: I don't sleep anymore. My pillow and I are over." }, fx: { disease: 'insomnia', stress: 8, perf: 8 }, mood: 'sleepy' },
          { w: 1, text: { fr: "J'ai tenu jusqu'à m'effondrer sur mon clavier. Le médecin a parlé d'épuisement, puis de dépression. J'ai mis du temps à l'entendre.", en: 'I held on until I collapsed on my keyboard. The doctor talked about exhaustion, then depression. It took me a while to hear it.' }, fx: { disease: 'depression', stress: 10, health: -5, happy: -10 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Tout plaquer', en: 'Quit everything' }, text: { fr: "J'ai démissionné par mail, à 3 h du matin, en majuscules. Puis j'ai dormi quinze heures d'affilée.", en: 'I quit by email, at 3 a.m., in all caps. Then I slept fifteen hours straight.' }, fx: { quitJob: true, stress: -20, happy: 10 } },
      { label: { fr: 'Voir un psy', en: 'See a therapist' }, text: { fr: "J'ai commencé une thérapie. Première séance : j'ai pleuré cinquante minutes et payé pour ça. Ça m'a fait un bien fou.", en: 'I started therapy. First session: I cried for fifty minutes and paid for the privilege. It did me a world of good.' }, fx: { money: -240, stress: -10, happy: 5 } },
    ],
  },
  {
    id: 'ad_unemployed',
    icon: '📉',
    cat: 'work',
    vars: { amount: [200, 1200] },
    scene: { place: 'home', mood: 'sad', prop: 'newspaper' },
    when: { age: [18, 64], job: false, school: 'none' },
    weight: 10,
    cooldown: 3,
    text: {
      fr: ["Ça fait des mois que tu cherches du boulot. Ton CV a été lu plus souvent par ta mère que par un recruteur.", "Ta conseillère emploi te demande, très sérieusement, si tu as « envisagé une reconversion dans l'élevage d'escargots »."],
      en: ["You've been job hunting for months. Your résumé has been read more often by your mom than by any recruiter.", "Your employment counselor asks, very seriously, whether you've 'considered a career change into snail farming'."],
    },
    choices: [
      {
        label: { fr: 'Postuler partout', en: 'Apply everywhere' },
        out: [
          { w: 2, text: { fr: "J'ai envoyé 112 candidatures. Réponses : deux refus automatiques et une arnaque à la pyramide.", en: 'I sent 112 applications. Replies: two automatic rejections and a pyramid scheme.' }, fx: { happy: -4, discipline: 4 } },
          { w: 1, odds: { smarts: 1 }, text: { fr: "À force de postuler, j'ai décroché un entretien. Allez, on y croit.", en: 'All that applying got me an interview. Come on, we believe.' }, fx: { happy: 6, open: 'jobs' } },
        ],
      },
      { label: { fr: 'Rappeler mon tuteur de stage', en: 'Call my old mentor' }, if: { flag: 'ad_intern_network' }, text: { fr: "J'ai rappelé mon ancien tuteur de stage. Il se souvenait encore de mon tableau Excel. Il m'a ouvert son carnet d'adresses.", en: 'I called my old internship mentor. He still remembered my spreadsheet. He opened his address book for me.' }, fx: { happy: 8, open: 'jobs' } },
      {
        label: { fr: 'Me lancer en freelance', en: 'Go freelance' },
        out: [
          { w: 1, text: { fr: "Je me suis lancé{|e} en freelance. Premier client : ma tante, qui m'a payé{|e} en pots de confiture.", en: 'I went freelance. First client: my aunt, who paid me in jars of jam.' }, fx: { money: 30, happy: 2 } },
          { w: 1, odds: { smarts: 0.5 }, text: { fr: "Mon activité de freelance a démarré sur les chapeaux de roue : {$amount} dès le premier mois !", en: 'My freelance business took off: {$amount} in the very first month!' }, fx: { money: 'amount', happy: 8 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Faire une pause', en: 'Take a break' }, text: { fr: "J'ai arrêté de chercher quelque temps et regardé l'intégrale d'une série coréenne. Je ne regrette rien.", en: 'I stopped looking for a while and binged an entire Korean drama. No regrets.' }, fx: { happy: 5, discipline: -4 } },
    ],
  },

  // ───────────────────────────── love ─────────────────────────────
  {
    id: 'ad_dating_match',
    icon: '📱',
    cat: 'love',
    actor: { create: { role: 'partner', age: [-4, 4], gender: 'attracted' } },
    scene: { place: 'apartment', mood: 'love', prop: 'phone' },
    when: { age: [18, 50], noHas: 'lover' },
    weight: 10,
    cooldown: 3,
    text: {
      fr: ["Ça matche sur l'appli ! {a.first}, {a.age} ans, « aime les voyages, les tacos et les gens qui ne posent pas avec un poisson ». Tu tentes ta chance ?", "{a.first} ({a.age} ans) t'écrit à 1 h du matin : « Tu préfères affronter un canard de la taille d'un cheval ou cent chevaux de la taille d'un canard ? » C'est prometteur."],
      en: ["It's a match! {a.first}, {a.age}, 'loves travel, tacos and people who don't pose with a fish.' Shoot your shot?", "{a.first} ({a.age}) messages you at 1 a.m.: 'Would you rather fight one horse-sized duck or a hundred duck-sized horses?' Promising."],
    },
    choices: [
      {
        label: { fr: 'Proposer un rendez-vous', en: 'Ask for a date' },
        out: [
          { w: 2, text: { fr: "Premier rendez-vous avec {a.first} : on a parlé quatre heures et fermé le restaurant. Je crois que c'est le début de quelque chose.", en: "First date with {a.first}: we talked for four hours and closed the restaurant. I think it's the start of something." }, fx: { happy: 12, rel: 15, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "{a.first} ressemblait vaguement à ses photos. De très loin. Dans le brouillard. On a passé une soirée sympa, en amis.", en: '{a.first} vaguely resembled the photos. From very far away. In fog. We had a nice evening, as friends.' }, fx: { happy: 2 } },
          { w: 1, text: { fr: "{a.first} m'a posé un lapin. J'ai mangé deux desserts seul{|e}, avec dignité.", en: '{a.first} stood me up. I ate two desserts alone, with dignity.' }, fx: { happy: -6 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Répondre par un mème', en: 'Reply with a meme' },
        out: [
          { w: 1, text: { fr: "J'ai répondu par un mème de chat. {a.first} a répondu par un mème de chat. C'est ça, l'amour moderne.", en: "I replied with a cat meme. {a.first} replied with a cat meme. That's modern love." }, fx: { happy: 8, rel: 10, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "J'ai envoyé un mème. {a.first} ne l'a pas compris. Fin de l'histoire.", en: "I sent a meme. {a.first} didn't get it. The end." }, fx: { happy: -2 } },
        ],
      },
      { label: { fr: "Supprimer l'appli", en: 'Delete the app' }, text: { fr: "J'ai supprimé l'appli et je suis allé{|e} me coucher. Mon lit ne m'a jamais déçu{|e}.", en: 'I deleted the app and went to bed. My bed has never let me down.' }, fx: { happy: 2, stress: -2 } },
    ],
  },
  {
    id: 'ad_move_in',
    icon: '🔑',
    cat: 'love',
    actor: 'partner',
    scene: { place: 'apartment', mood: 'love', prop: 'boxes' },
    when: { age: [19, 50], noFlag: 'ad_cohabiting' },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["{a.first} te propose d'emménager ensemble. {a:Il|Elle} a déjà mesuré ta bibliothèque et décidé qu'elle irait « à la cave ».", "Ça fait des mois que {a.first} dort chez toi six soirs sur sept. {a:Il|Elle} suggère de rendre ça officiel."],
      en: ["{a.first} wants to move in together. {a:He|She} has already measured your bookshelf and decided it's going 'in the basement'.", '{a.first} has been sleeping over six nights a week for months. {a:He|She} suggests making it official.'],
    },
    choices: [
      {
        label: { fr: 'Oui, emménageons !', en: "Yes, let's do it!" },
        out: [
          { w: 3, text: { fr: "On a emménagé ensemble. On s'est disputés sur l'emplacement du canapé, puis on a mangé des pizzas dessus. Le bonheur.", en: 'We moved in together. We argued about where the couch should go, then ate pizza on it. Bliss.' }, fx: { happy: 10, rel: 15, flag: 'ad_cohabiting', moveOut: true }, mood: 'love' },
          { w: 1, text: { fr: "Une semaine de vie commune et j'ai découvert que {a.first} ronfle comme un tracteur. Je l'aime quand même. Je crois.", en: 'One week of living together and I discovered {a.first} snores like a tractor. I love {a.him} anyway. I think.' }, fx: { happy: 3, rel: 5, flag: 'ad_cohabiting', moveOut: true }, mood: 'sleepy' },
        ],
      },
      {
        label: { fr: "C'est trop tôt", en: "It's too soon" },
        out: [
          { w: 1, text: { fr: "J'ai dit que c'était trop tôt. {a.first} a répondu « d'accord » avec un sourire qui voulait dire tout sauf d'accord.", en: "I said it was too soon. {a.first} said 'okay' with a smile that meant anything but okay." }, fx: { rel: -10, happy: -2 } },
          { w: 1, text: { fr: "J'ai demandé un peu plus de temps. {a.first} a compris. On a quand même fait un double des clés.", en: 'I asked for a bit more time. {a.first} understood. We made a spare key anyway.' }, fx: { rel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'ad_jealous_partner',
    icon: '😤',
    cat: 'love',
    actor: 'lover',
    scene: { place: 'home', mood: 'angry', prop: 'phone' },
    when: { age: [18, 60] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["{a.first} a lu ton téléphone par-dessus ton épaule et exige de savoir qui est « Kévin Plombier ». C'est ton plombier.", "{a.first} boude depuis que tu as liké une photo de ton ex. Un coucher de soleil. Posté il y a quatre ans."],
      en: ["{a.first} read your phone over your shoulder and demands to know who 'Kevin Plumber' is. He's your plumber.", '{a.first} has been sulking since you liked a photo posted by your ex. A sunset. From four years ago.'],
    },
    choices: [
      { label: { fr: 'Rassurer avec tendresse', en: 'Reassure gently' }, text: { fr: "J'ai rassuré {a.first} avec patience et une pile de crêpes. Crise évitée.", en: 'I reassured {a.first} with patience and a stack of pancakes. Crisis averted.' }, fx: { rel: 8, happy: 3 } },
      { label: { fr: 'Tendre mon téléphone', en: 'Hand over my phone' }, text: { fr: "J'ai tendu mon téléphone. {a.first} a tout lu et s'est excusé{a:|e}. {a:Il|Elle} a aussi vu mon historique de recherche. Gênant.", en: 'I handed over my phone. {a.first} read everything and apologized. {a:He|She} also saw my search history. Awkward.' }, fx: { rel: 5, happy: -2 } },
      {
        label: { fr: 'Se fâcher tout rouge', en: 'Lose my temper' },
        out: [
          { w: 3, text: { fr: "J'ai explosé : la confiance, c'est la base ! On s'est réconciliés trois jours plus tard autour d'un kebab.", en: 'I exploded: trust is everything! We made up three days later over a kebab.' }, fx: { rel: -5, happy: -3, stress: 5 } },
          { w: 1, text: { fr: "La dispute a dégénéré. {a.first} a fait sa valise. Puis l'a défaite. Puis refaite. C'est fini.", en: "The fight escalated. {a.first} packed a bag. Then unpacked it. Then packed it again. It's over." }, fx: { rel: -40, actorRole: 'ex', happy: -10 }, mood: 'cry' },
        ],
      },
    ],
  },
  {
    id: 'ad_partner_proposes',
    icon: '💍',
    cat: 'love',
    actor: { role: 'partner', minRel: 55 },
    scene: { place: 'park', mood: 'love', prop: 'ring' },
    when: { age: [20, 55], noHas: ['fiance', 'spouse'] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: ["{a.first} pose un genou à terre au milieu du parc. Un pigeon s'arrête pour regarder. {a:Il|Elle} sort un écrin : « Veux-tu m'épouser ? »", "Au restaurant, le serveur apporte un fondant avec une bague plantée dedans. {a.first} te regarde, tremblant{a:|e} : « Alors ? »"],
      en: ["{a.first} gets down on one knee in the middle of the park. A pigeon stops to watch. {a:He|She} pulls out a ring box: 'Will you marry me?'", "At the restaurant, the waiter brings a lava cake with a ring stuck in it. {a.first} looks at you, trembling: 'So?'"],
    },
    choices: [
      { label: { fr: 'Oui, mille fois oui', en: 'Yes, a thousand times' }, text: { fr: "J'ai dit oui ! {a.first} a pleuré, des inconnus ont applaudi et j'ai failli avaler la bague de bonheur.", en: 'I said yes! {a.first} cried, strangers applauded and I nearly swallowed the ring out of joy.' }, fx: { happy: 15, rel: 20, actorRole: 'fiance' }, mood: 'love' },
      { label: { fr: 'Je dois réfléchir', en: 'I need to think' }, text: { fr: "J'ai demandé du temps. {a.first} a rangé l'écrin. Le silence dans le taxi du retour a duré mille ans.", en: 'I asked for time. {a.first} put the ring away. The silence in the cab home lasted a thousand years.' }, fx: { rel: -12, happy: -4 } },
      { label: { fr: 'Non, désolé{|e}', en: 'No, sorry' }, text: { fr: "J'ai dit non. {a.first} est parti{a:|e} en courant. Avec la bague. En me laissant l'addition.", en: '{a.first} ran off when I said no. With the ring. Leaving me the bill.' }, fx: { rel: -60, actorRole: 'ex', happy: -8, money: -80 }, mood: 'sad' },
    ],
  },
  {
    id: 'ad_wedding_planning',
    icon: '💒',
    cat: 'love',
    actor: 'fiance',
    scene: { place: 'party', mood: 'love', prop: 'cake' },
    when: { age: [20, 75], has: 'fiance' },
    weight: 12,
    cooldown: 2,
    text: {
      fr: ["Les préparatifs du mariage avec {a.first} tournent au cauchemar logistique. Ta future belle-mère veut un lâcher de colombes, ton oncle veut faire un discours.", "{a.first} te montre un tableur de quatorze onglets intitulé « MARIAGE — v27 FINAL (vraiment) ». Il est temps de trancher."],
      en: ['Wedding planning with {a.first} is becoming a logistical nightmare. Your future mother-in-law wants a dove release, your uncle wants to give a speech.', "{a.first} shows you a fourteen-tab spreadsheet titled 'WEDDING — v27 FINAL (really)'. Time to decide."],
    },
    choices: [
      {
        label: { fr: 'Le grand mariage', en: 'The big wedding' },
        out: [
          { w: 3, text: { fr: "On s'est mariés devant 180 invités, dont 60 que je n'avais jamais vus. Une colombe a mangé un bout de la pièce montée. Magnifique.", en: "We got married in front of 180 guests, 60 of whom I'd never seen. A dove ate part of the cake. Magnificent." }, fx: { happy: 15, rel: 15, money: -7000, actorRole: 'spouse' }, mood: 'love' },
          { w: 1, text: { fr: "Mariage grandiose, mais l'oncle a fait son discours. 47 minutes, dont 30 sur sa coloscopie. On est mariés quand même.", en: 'Grand wedding, but the uncle gave his speech. 47 minutes, 30 of them about his colonoscopy. We got married anyway.' }, fx: { happy: 8, rel: 10, money: -7000, actorRole: 'spouse' } },
        ],
      },
      { label: { fr: 'Petite mairie intime', en: 'Small and simple' }, text: { fr: "On s'est dit oui à la mairie, en jean, avec deux témoins et des sandwichs. Le plus beau jour de ma vie.", en: 'We said yes at city hall, in jeans, with two witnesses and sandwiches. The best day of my life.' }, fx: { happy: 12, rel: 12, money: -500, actorRole: 'spouse' }, mood: 'love' },
      { label: { fr: 'Fuguer à Las Vegas', en: 'Elope to Vegas' }, text: { fr: "On s'est enfuis à Las Vegas et mariés devant un sosie d'Elvis. Nos mères ne nous parlent plus, mais quel souvenir.", en: "We ran off to Vegas and got married by an Elvis impersonator. Our moms aren't speaking to us, but what a memory." }, fx: { happy: 12, rel: 10, money: -1500, actorRole: 'spouse' }, mood: 'party' },
      { label: { fr: 'Tout annuler', en: 'Call it off' }, text: { fr: "J'ai annulé le mariage. {a.first} a gardé la bague, la plante verte et tous nos amis communs.", en: 'I called off the wedding. {a.first} kept the ring, the houseplant and all our mutual friends.' }, fx: { happy: -10, rel: -50, actorRole: 'ex' }, mood: 'sad' },
    ],
  },
  {
    id: 'ad_want_kids',
    icon: '🐾',
    cat: 'love',
    actor: 'lover',
    scene: { place: 'apartment', mood: 'love', prop: 'cat' },
    when: { age: [24, 45], flag: 'ad_cohabiting', noHas: 'child' },
    weight: 8,
    once: true,
    text: {
      fr: ["{a.first} soupire devant une poussette dans la rue. Puis devant une autre. Puis devant une pub pour des couches. Message reçu : {a.he} veut agrandir la famille.", "Un dimanche soir, {a.first} lâche, l'air de rien : « Tu ne trouves pas que l'appart est un peu... vide ? »"],
      en: ['{a.first} sighs at a stroller in the street. Then another. Then at a diaper ad. Message received: {a.he} wants to grow the family.', "One Sunday evening, {a.first} casually says: 'Don't you think the apartment feels a little... empty?'"],
    },
    choices: [
      { label: { fr: 'Adopter un chat', en: 'Adopt a cat' }, text: { fr: "On a adopté un chat. Il nous méprise tous les deux avec une parfaite équité. On l'adore.", en: 'We adopted a cat. He despises us both with perfect fairness. We adore him.' }, fx: { happy: 10, rel: 10, newNpc: { role: 'pet', species: 'chat' } }, mood: 'happy' },
      { label: { fr: 'Adopter un chien', en: 'Adopt a dog' }, text: { fr: "On a adopté un chien qui mange les chaussettes et aime chaque humain qu'il croise. La famille s'agrandit !", en: 'We adopted a dog who eats socks and loves every human he meets. The family is growing!' }, fx: { happy: 10, rel: 10, athletic: 3, newNpc: { role: 'pet', species: 'chien' } }, mood: 'happy' },
      { label: { fr: 'Parler bébé sérieusement', en: 'Talk babies seriously' }, text: { fr: "On a eu une longue discussion sur les bébés. Conclusion provisoire : on commence par une plante verte et on avise.", en: "We had a long talk about babies. Tentative conclusion: we'll start with a houseplant and take it from there." }, fx: { rel: 6, happy: 3 } },
      { label: { fr: 'Pas maintenant', en: 'Not right now' }, text: { fr: "J'ai dit que je n'étais pas prêt{|e}. {a.first} a acheté un cactus et l'a baptisé « Bébé ». Message reçu.", en: "I said I wasn't ready. {a.first} bought a cactus and named it 'Baby'. Message received." }, fx: { rel: -8 } },
    ],
  },

  // ───────────────────────────── money ─────────────────────────────
  {
    id: 'ad_found_wallet',
    icon: '👛',
    cat: 'moral',
    vars: { amount: [50, 600] },
    scene: { place: 'park', mood: 'neutral', prop: 'wallet' },
    when: { age: [18, 80] },
    weight: 8,
    cooldown: 6,
    text: {
      fr: ["Tu trouves un portefeuille sur un banc. Dedans : {$amount}, une carte d'identité et la photo d'un monsieur qui pose fièrement avec une citrouille géante.", "Un portefeuille traîne sur le trottoir. Il contient {$amount} et une carte de fidélité de crêperie presque complète."],
      en: ['You find a wallet on a bench. Inside: {$amount}, an ID card and a photo of a man proudly posing with a giant pumpkin.', 'A wallet lies on the sidewalk. It holds {$amount} and an almost-full crêpe shop loyalty card.'],
    },
    choices: [
      {
        label: { fr: 'Le rendre', en: 'Return it' },
        out: [
          { w: 3, text: { fr: "J'ai rendu le portefeuille à son propriétaire. Il m'a serré{|e} dans ses bras si fort que j'ai entendu craquer quelque chose.", en: 'I returned the wallet to its owner. He hugged me so hard I heard something crack.' }, fx: { karma: 8, happy: 5 } },
          { w: 1, text: { fr: "J'ai rendu le portefeuille. En récompense, le propriétaire m'a offert un ticket de métro. C'est l'intention qui compte.", en: 'I returned the wallet. As a reward, the owner gave me a subway ticket. It\'s the thought that counts.' }, fx: { karma: 8, money: 3, happy: 3 } },
        ],
      },
      {
        label: { fr: "Garder l'argent", en: 'Keep the cash' },
        out: [
          { w: 3, text: { fr: "J'ai gardé les billets et glissé le portefeuille vide dans une boîte aux lettres. Mon âme vaut donc {$amount}.", en: 'I kept the bills and dropped the empty wallet in a mailbox. So my soul is worth {$amount}.' }, fx: { money: 'amount', karma: -10 } },
          { w: 1, text: { fr: "J'ai empoché l'argent. Une caméra de surveillance a tout filmé. J'ai dû tout rendre et m'expliquer au commissariat.", en: 'I pocketed the money. A security camera caught everything. I had to give it all back and explain myself at the police station.' }, fx: { karma: -8, happy: -8, stress: 8 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Le déposer à la police', en: 'Drop it at the police' }, text: { fr: "J'ai déposé le portefeuille au commissariat. Le policier a soupiré comme si je lui apportais du travail. Ce qui était le cas.", en: 'I dropped the wallet at the police station. The officer sighed as if I had brought him work. Which I had.' }, fx: { karma: 5 } },
    ],
  },
  {
    id: 'ad_scam_call',
    icon: '☎️',
    cat: 'money',
    vars: { amount: [200, 1500] },
    scene: { place: 'home', mood: 'shock', prop: 'phone' },
    when: { age: [18, 80] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Un certain « agent Microsoft » t'appelle : ton ordinateur est infecté, mais il peut le sauver pour {$amount} en cartes cadeaux. Il a l'air très pressé.", "Un SMS t'annonce que ton colis est bloqué. Pour le libérer, il suffit de régler {$amount} de « frais de douane » et de donner le nom de ton premier animal."],
      en: ["Some 'Microsoft agent' calls you: your computer is infected, but he can save it for {$amount} in gift cards. He sounds very rushed.", "A text says your package is stuck. To release it, just pay {$amount} in 'customs fees' and share the name of your first pet."],
    },
    choices: [
      {
        label: { fr: 'Suivre les instructions', en: 'Do as they say' },
        out: [
          { w: 2, text: { fr: "J'ai tout fait comme on me l'a dit. Mon compte a perdu {$amount}. Mon ordinateur, lui, va très bien, merci.", en: 'I did exactly as told. My account lost {$amount}. My computer is doing great, thanks.' }, fx: { money: '-amount', happy: -10, smarts: -2 }, mood: 'cry' },
          { w: 1, text: { fr: "J'allais payer quand ma banque a bloqué l'opération. Ma conseillère m'a appelé{|e} pour me sermonner gentiment.", en: 'I was about to pay when my bank blocked the transaction. My banker called to gently scold me.' }, fx: { happy: -3, smarts: 1 } },
        ],
      },
      { label: { fr: 'Le faire tourner en bourrique', en: 'Waste their time' }, text: { fr: "J'ai joué l'innocent{|e} très lent{|e} pendant 45 minutes. L'arnaqueur a fini par m'insulter et raccrocher. Victoire.", en: 'I played a very slow innocent for 45 minutes. The scammer ended up swearing at me and hanging up. Victory.' }, fx: { happy: 8, karma: 2, smarts: 1 } },
      { label: { fr: 'Raccrocher net', en: 'Hang up' }, text: { fr: "J'ai coupé sans un mot. L'instinct de survie numérique, ça ne s'apprend pas.", en: "I cut them off without a word. Digital survival instinct can't be taught." }, fx: { smarts: 2 } },
    ],
  },
  {
    id: 'ad_scratch_ticket',
    icon: '🎟️',
    cat: 'money',
    mature: true,
    vars: { amount: [100, 2000] },
    scene: { place: 'home', mood: 'neutral', prop: 'ticket' },
    when: { age: [18, 80] },
    weight: 6,
    cooldown: 2,
    text: {
      fr: ["Au bureau de tabac, un ticket à gratter « Millionnaire du Dimanche » te fait de l'œil. Ton intuition dit oui. Ton banquier dit non.", "Le buraliste te tend un ticket à gratter en jurant que « c'est celui-là, le gagnant ». Il dit ça à tout le monde."],
      en: ["At the corner shop, a 'Sunday Millionaire' scratch ticket is winking at you. Your gut says yes. Your banker says no.", "The shopkeeper hands you a scratch ticket, swearing 'this is the winner'. He says that to everyone."],
    },
    choices: [
      {
        label: { fr: 'En gratter un', en: 'Scratch one' },
        out: [
          { w: 6, text: { fr: "J'ai gratté. Perdu. Il ne manquait qu'un symbole, comme d'habitude.", en: 'I scratched. Lost. Just one symbol short, as usual.' }, fx: { money: -5, happy: -1 } },
          { w: 3, text: { fr: "J'ai gratté et gagné... le prix du ticket. J'en ai racheté un. Perdu.", en: 'I scratched and won... the price of the ticket. I bought another. Lost.' }, fx: { money: -5 } },
          { w: 1, text: { fr: "J'ai gratté et gagné {$amount} ! J'ai crié si fort que le buraliste a fait tomber son présentoir de chewing-gums.", en: 'I scratched and won {$amount}! I screamed so loud the shopkeeper knocked over his gum display.' }, fx: { money: 'amount', happy: 12 }, mood: 'party' },
        ],
      },
      {
        label: { fr: 'En acheter vingt', en: 'Buy twenty' },
        out: [
          { w: 4, text: { fr: "J'ai acheté vingt tickets. Bilan : trois micro-gains, une corne au pouce et un portefeuille en deuil.", en: 'I bought twenty tickets. Result: three tiny wins, a callus on my thumb and a wallet in mourning.' }, fx: { money: -100, happy: -5 } },
          { w: 1, text: { fr: "Vingt tickets, et le dernier était le bon : {$amount} ! Je me sens invincible, ce qui est exactement le problème.", en: "Twenty tickets, and the last one was the winner: {$amount}! I feel invincible, which is exactly the problem." }, fx: { money: 'amount', happy: 10 }, mood: 'party' },
        ],
      },
      { label: { fr: 'Garder mes sous', en: 'Keep my money' }, text: { fr: "J'ai résisté. Statistiquement, je viens de gagner le prix d'un ticket.", en: "I resisted. Statistically, I just won the price of a ticket." }, fx: { smarts: 1, discipline: 2 } },
    ],
  },

  // ───────────────────────────── friends ─────────────────────────────
  {
    id: 'ad_lend_friend',
    icon: '🤝',
    cat: 'friends',
    actor: 'anyFriend',
    vars: { amount: [200, 2000] },
    scene: { place: 'home', mood: 'neutral', prop: 'money' },
    when: { age: [18, 65], noFlag: 'ad_lent_money' },
    weight: 8,
    cooldown: 6,
    text: {
      fr: ["{a.first} t'appelle, gêné{a:|e} : {a.he} a besoin de {$amount} pour « un truc urgent ». Tu n'oses pas demander quel truc.", "{a.first} a un plan infaillible : un food-truck de raclette végane. Il ne lui manque que {$amount}. Les tiens."],
      en: ["{a.first} calls you, embarrassed: {a.he} needs {$amount} for 'something urgent'. You don't dare ask what.", '{a.first} has a foolproof plan: a vegan raclette food truck. All {a.he} needs is {$amount}. Yours.'],
    },
    choices: [
      { label: { fr: "Prêter l'argent", en: 'Lend the money' }, text: { fr: "J'ai prêté {$amount} à {a.first}. {a:Il|Elle} m'a juré de me rembourser « très vite ». On verra bien.", en: "I lent {a.first} {$amount}. {a:He|She} swore to pay me back 'real soon'. We'll see." }, fx: { money: '-amount', rel: 10, karma: 3, flag: 'ad_lent_money', schedule: { key: 'ad_lend_payback', years: 2 } } },
      { label: { fr: 'Refuser poliment', en: 'Politely decline' }, text: { fr: "J'ai refusé. {a.first} a dit qu'{a:il|elle} comprenait, avec la voix de quelqu'un qui ne comprend pas du tout.", en: "I said no. {a.first} said {a.he} understood, in the voice of someone who absolutely did not." }, fx: { rel: -10 } },
      { label: { fr: 'Offrir sans retour', en: 'Make it a gift' }, text: { fr: "J'ai donné {$amount} à {a.first} en lui interdisant de me rembourser. Je me suis senti{|e} comme un milliardaire de série télé.", en: 'I gave {a.first} {$amount} and forbade any repayment. I felt like a TV-show billionaire.' }, fx: { money: '-amount', rel: 20, karma: 8, happy: 4 }, mood: 'proud' },
    ],
  },
  {
    id: 'ad_lend_payback',
    icon: '💸',
    cat: 'friends',
    chainOnly: true,
    actor: 'anyone',
    vars: { amount: [250, 2500] },
    scene: { place: 'home', mood: 'shock', prop: 'envelope' },
    text: {
      fr: ["Tu te souviens de l'argent prêté à {a.first} il y a deux ans ? {a:Il|Elle} se tient devant ta porte, l'air mystérieux, les mains dans les poches.", "{a.first} t'invite à déjeuner « pour parler de notre petite affaire ». Ton portefeuille frissonne d'espoir."],
      en: ['Remember the money you lent {a.first} two years ago? {a:He|She} is standing at your door looking mysterious, hands in pockets.', "{a.first} invites you to lunch 'to discuss our little arrangement'. Your wallet shivers with hope."],
    },
    choices: [
      {
        label: { fr: 'Réclamer mon dû', en: 'Ask for my money' },
        out: [
          { w: 3, text: { fr: "{a.first} m'a tendu une enveloppe : {$amount}, intérêts compris, et une carte « Merci d'avoir cru en moi ». J'ai failli pleurer.", en: "{a.first} handed me an envelope: {$amount}, interest included, and a card saying 'Thanks for believing in me'. I almost cried." }, fx: { money: 'amount', rel: 10, happy: 8, unflag: 'ad_lent_money' }, mood: 'happy' },
          { w: 2, text: { fr: "{a.first} m'a expliqué que le projet avait « pivoté ». En clair : l'argent s'est envolé. J'ai eu droit à un porte-clés en dédommagement.", en: "{a.first} explained that the project had 'pivoted'. Translation: the money is gone. I got a keychain as compensation." }, fx: { happy: -8, rel: -15, unflag: 'ad_lent_money' }, mood: 'angry' },
          { w: 1, text: { fr: "{a.first} m'a remboursé{|e} en nature : une caisse de quarante kilos de citrons. Je ne sais pas quoi en faire.", en: '{a.first} paid me back in kind: a crate of ninety pounds of lemons. I have no idea what to do with them.' }, fx: { happy: -2, rel: 3, unflag: 'ad_lent_money' } },
        ],
      },
      { label: { fr: 'Passer l\'éponge', en: 'Let it go' }, text: { fr: "J'ai dit à {a.first} d'oublier cette dette. {a:Il|Elle} m'a serré{|e} dans ses bras. L'amitié n'a pas de prix. Enfin si, un prix précis, mais passons.", en: "I told {a.first} to forget the debt. {a:He|She} hugged me. Friendship is priceless. Well, it has a very specific price, but never mind." }, fx: { rel: 15, karma: 6, unflag: 'ad_lent_money' }, mood: 'proud' },
    ],
  },
  {
    id: 'ad_friend_wedding',
    icon: '💐',
    cat: 'friends',
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'happy', prop: 'flowers' },
    when: { age: [22, 45] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["{a.first} se marie et te demande d'être son témoin. Tu as trois semaines pour écrire un discours et apprendre à tenir debout dans une tenue trop chère.", "Mariage de {a.first} ! Tu es placé{|e} à la table des célibataires, entre un cousin qui collectionne les fourchettes et une tante qui pleure déjà."],
      en: ['{a.first} is getting married and wants you in the wedding party. You have three weeks to write a speech and learn to stand up in an overpriced outfit.', "{a.first}'s wedding! You're seated at the singles' table, between a cousin who collects forks and an aunt who's already crying."],
    },
    choices: [
      {
        label: { fr: 'Faire un discours', en: 'Give a speech' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "Mon discours a fait rire, puis pleurer, puis rire encore. {a.first} m'a serré{|e} dans ses bras. Grand moment.", en: '{a.first} hugged me after my speech made everyone laugh, cry, then laugh again. A great moment.' }, fx: { rel: 15, happy: 8, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: "Mon discours a dérivé sur l'ex de {a.first}. Silence de mort. Le DJ a lancé « La danse des canards » pour sauver la soirée.", en: "My speech drifted onto {a.first}'s ex. Dead silence. The DJ put on the Chicken Dance to save the night." }, fx: { rel: -12, happy: -6 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Régner sur la piste', en: 'Own the dance floor' }, text: { fr: "J'ai dansé jusqu'à 4 h du matin. J'ai perdu une chaussure et gagné l'amitié éternelle de la grand-mère de la mariée.", en: "I danced until 4 a.m. I lost a shoe and won the eternal friendship of the bride's grandmother." }, fx: { happy: 10, athletic: 2, rel: 5 }, mood: 'party' },
      {
        label: { fr: 'Attraper le bouquet', en: 'Catch the bouquet' },
        out: [
          { w: 1, text: { fr: "J'ai attrapé le bouquet en plongeant par-dessus une demoiselle d'honneur. La foule a hurlé. Je ne regrette rien.", en: 'I caught the bouquet by diving over a bridesmaid. The crowd roared. No regrets.' }, fx: { happy: 6, karma: -1 } },
          { w: 1, text: { fr: "En sautant pour le bouquet, je me suis pris le pied dans la nappe. La pièce montée ne s'en est jamais remise.", en: 'Jumping for the bouquet, I caught my foot in the tablecloth. The wedding cake never recovered.' }, fx: { happy: -5, rel: -5 }, mood: 'shock' },
        ],
      },
    ],
  },

  // ───────────────────────────── family ─────────────────────────────
  {
    id: 'ad_parent_sick',
    icon: '🏥',
    cat: 'family',
    actor: 'parent',
    scene: { place: 'hospital', mood: 'sad', prop: 'flowers' },
    when: { age: [28, 65] },
    weight: 6,
    once: true,
    text: {
      fr: ["{a.rel} t'appelle depuis l'hôpital. {a:Il|Elle} essaie de plaisanter, mais sa voix tremble : les médecins ont trouvé « quelque chose ».", "{a.rel} a fait un malaise au supermarché, entre les biscottes et les lentilles. {a:Il|Elle} est en observation, et tu sens que ce n'est pas rien."],
      en: ["{a.rel} calls you from the hospital. {a:He|She} tries to joke, but {a:his|her} voice is shaking: the doctors found 'something'.", "{a.rel} collapsed at the supermarket, between the crackers and the lentils. {a:He|She}'s under observation, and you can tell it's serious."],
    },
    choices: [
      { label: { fr: 'Être à son chevet', en: 'Stay by the bedside' }, text: { fr: "J'ai passé des semaines au chevet de {a.my}. On a parlé de tout, regardé des jeux télé nuls et ri comme jamais. Je n'oublierai pas.", en: "I spent weeks at {a.my}'s bedside. We talked about everything, watched terrible game shows and laughed like never before. I won't forget it." }, fx: { rel: 20, happy: 4, stress: 6, karma: 5, perf: -5 }, mood: 'cry' },
      {
        label: { fr: 'Payer les meilleurs soins', en: 'Pay for the best care' },
        out: [
          { w: 2, text: { fr: "J'ai payé une clinique privée pour {a.my}. {a:Il|Elle} va mieux et se plaint de la nourriture, ce qui est très bon signe.", en: "I paid for a private clinic for {a.my}. {a:He|She}'s getting better and complaining about the food, which is a very good sign." }, fx: { money: -3000, rel: 10, happy: 6 } },
          { w: 1, text: { fr: "J'ai payé les meilleurs spécialistes. Ils ont confirmé ce que disaient les autres, mais avec de plus beaux stylos.", en: 'I paid for the best specialists. They confirmed what the others said, but with nicer pens.' }, fx: { money: -3000, rel: 5, happy: -4 } },
        ],
      },
      { label: { fr: 'Appeler de temps en temps', en: 'Call now and then' }, text: { fr: "J'ai appelé {a.my} quelques fois. Je me disais que je passerais le week-end prochain. Puis le suivant.", en: "I called {a.my} a few times. I kept telling myself I'd visit next weekend. Then the one after." }, fx: { rel: -10, karma: -4, happy: -3 }, mood: 'sad' },
    ],
  },

  // ───────────────────────────── moral / weird ─────────────────────────────
  {
    id: 'ad_stranger_help',
    icon: '🧳',
    cat: 'moral',
    scene: { place: 'park', mood: 'neutral', prop: 'suitcase' },
    when: { age: [18, 70] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Une vieille dame se bat avec une valise énorme en haut des escaliers du métro. Ton train part dans deux minutes, et la valise semble contenir un piano.", "Une mamie te fait signe : sa valise est coincée dans le tourniquet du métro et la file derrière elle commence à gronder. Ton train part dans deux minutes."],
      en: ['An old lady is wrestling a huge suitcase at the top of the subway stairs. Your train leaves in two minutes, and the suitcase seems to contain a piano.', 'A granny waves at you: her suitcase is stuck in the subway turnstile and the line behind her is starting to grumble. Your train leaves in two minutes.'],
    },
    choices: [
      {
        label: { fr: 'Porter la valise', en: 'Carry the suitcase' },
        out: [
          { w: 3, text: { fr: "J'ai aidé la vieille dame. Elle m'a donné un bonbon à la violette datant sans doute de 1987 et m'a appelé{|e} « mon petit ange ».", en: "I helped the old lady. She gave me a violet candy probably dating from 1987 and called me 'my little angel'." }, fx: { karma: 8, happy: 5 } },
          { w: 1, text: { fr: "J'ai aidé la mamie et raté mon train. Elle m'a glissé de quoi prendre un taxi. Le karma paie cash.", en: 'I helped the granny and missed my train. She slipped me cab money. Karma pays in cash.' }, fx: { karma: 8, money: 40, happy: 4 } },
          { w: 1, text: { fr: "J'ai soulevé la valise. Mon dos a émis un bruit que je n'avais jamais entendu de ma vie.", en: 'I lifted the suitcase. My back made a sound I had never heard in my life.' }, fx: { karma: 6, disease: 'back_pain' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Courir vers mon train', en: 'Run for my train' }, text: { fr: "J'ai couru vers mon train en évitant son regard. Je l'ai eu. Ma conscience, elle, l'a raté.", en: 'I ran for my train, avoiding her eyes. I caught it. My conscience missed it.' }, fx: { karma: -5, happy: -2 } },
      { label: { fr: 'Déléguer à un costaud', en: 'Delegate to a big guy' }, text: { fr: "J'ai pointé un grand costaud du doigt : « Vous, aidez madame. » Il a obéi. J'ai un talent caché pour le management.", en: "I pointed at a big guy: 'You, help the lady.' He obeyed. I have a hidden talent for management." }, fx: { karma: 2, discipline: 2 } },
    ],
  },
  {
    id: 'ad_fortune_teller',
    icon: '🔮',
    cat: 'weird',
    vars: { fee: [20, 30] },
    scene: { place: 'park', mood: 'neutral', prop: 'crystal_ball' },
    when: { age: [18, 65] },
    weight: 4,
    once: true,
    text: {
      fr: ["Une voyante au foulard violet t'arrête dans la rue : « Je vois ton avenir, mon enfant. Pour {$fee}, je le vois même en détail. »", "Madame Irma, « voyante diplômée », a ouvert un cabinet entre le kebab et la laverie. Sa boule de cristal clignote en LED. La séance coûte {$fee}."],
      en: ["A fortune teller in a purple scarf stops you in the street: 'I see your future, child. For {$fee}, I even see it in detail.'", "Madame Irma, 'certified psychic', has opened a parlor between the kebab shop and the laundromat. Her crystal ball blinks in LED. A reading costs {$fee}."],
    },
    choices: [
      {
        label: { fr: 'Me faire tirer les cartes', en: 'Get a reading' },
        out: [
          { w: 2, text: { fr: "La voyante a retourné une carte, pâli, et murmuré : « Une grande fortune t'attend... bientôt. » J'ai payé pour de l'espoir.", en: "The fortune teller flipped a card, went pale and whispered: 'A great fortune awaits you... soon.' I paid for hope." }, fx: { money: '-fee', happy: 5, flag: 'ad_prophecy' } },
          { w: 1, text: { fr: "La voyante m'a prédit la rencontre d'un grand amour brun et poilu. Le lendemain, un labrador m'a suivi{|e} sur deux kilomètres.", en: 'The fortune teller predicted I would meet a great love, tall, dark and hairy. The next day, a Labrador followed me for over a mile.' }, fx: { money: '-fee', happy: 6 } },
        ],
      },
      { label: { fr: 'Tester ses pouvoirs', en: 'Test her powers' }, text: { fr: "J'ai demandé à la voyante de deviner mon prénom. Elle a répondu « Gérard ». Je suis reparti{|e} sans payer, le cœur léger.", en: "I asked the fortune teller to guess my name. She said 'Gerald'. I left without paying, light of heart." }, fx: { happy: 4, smarts: 2 } },
      { label: { fr: 'Passer mon chemin', en: 'Walk on by' }, text: { fr: "J'ai poliment décliné. Elle m'a crié que je le regretterais. Elle avait l'air d'y croire très fort.", en: "I politely declined. She yelled that I'd regret it. She seemed to really believe it." }, fx: { stress: 3 } },
    ],
  },
  {
    id: 'ad_celebrity_mistake',
    icon: '🌟',
    cat: 'weird',
    scene: { place: 'park', mood: 'shock', prop: 'camera' },
    when: { age: [18, 60] },
    weight: 4,
    once: true,
    text: {
      fr: ["Une bande d'ados se met à hurler en te voyant : ils sont persuadés que tu es une star de la téléréalité. L'un d'eux pleure déjà.", "En terrasse, une touriste te demande un selfie et un autographe. Elle te prend pour {le chanteur|la chanteuse} du générique d'une série. Elle n'en démord pas."],
      en: ["A pack of teenagers starts screaming when they see you: they're convinced you're a reality TV star. One of them is already crying.", "On a café terrace, a tourist asks for a selfie and an autograph. She thinks you're the singer of some TV theme song. She won't let it go."],
    },
    choices: [
      {
        label: { fr: 'Jouer le jeu', en: 'Play along' },
        out: [
          { w: 2, text: { fr: "J'ai signé des autographes, posé pour des selfies et promis un album pour l'été. Je suis une star, au moins dans ce quartier.", en: "I signed autographs, posed for selfies and promised an album by summer. I'm a star, at least in this neighborhood." }, fx: { happy: 10, fame: 3, karma: -2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai joué la star jusqu'à ce que la vraie célébrité passe au coin de la rue. On m'a regardé{|e} avec un mépris absolu.", en: 'I played the star until the real celebrity walked around the corner. People looked at me with absolute contempt.' }, fx: { happy: -4, fame: 1 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Dire la vérité', en: 'Tell the truth' }, text: { fr: "J'ai expliqué que je n'étais personne. Personne ne m'a cru{|e}, et tout le monde m'a pris{|e} en photo quand même.", en: "I explained I was nobody. Nobody believed me, and everyone took my picture anyway." }, fx: { happy: 3, karma: 2 } },
      { label: { fr: 'Fuir en courant', en: 'Run for it' }, text: { fr: "J'ai pris la fuite, ce qui a convaincu tout le monde que j'étais vraiment célèbre. Je suis en tendance dans mon quartier.", en: "I ran away, which convinced everyone I was truly famous. I'm trending in my neighborhood." }, fx: { fame: 2, athletic: 1 } },
    ],
  },
  {
    id: 'ad_midlife_crisis',
    icon: '🏍️',
    cat: 'midlife',
    scene: { place: 'home', mood: 'shock', prop: 'motorbike' },
    when: { age: [40, 55] },
    weight: 10,
    once: true,
    text: {
      fr: ["Tu viens de trouver un cheveu blanc. Puis douze. Une petite voix te souffle que la vie passe vite et qu'il te faut d'urgence une moto, un tatouage ou une guitare électrique.", "{age} ans. Tu te réveilles à 3 h du matin en te demandant si tu as « vraiment vécu ». Ton navigateur est ouvert sur des annonces de voiliers."],
      en: ['You just found a gray hair. Then twelve. A little voice whispers that life is short and you urgently need a motorcycle, a tattoo or an electric guitar.', "{age}. You wake up at 3 a.m. wondering whether you've 'really lived'. Your browser is open on sailboat listings."],
    },
    choices: [
      {
        label: { fr: 'Acheter une décapotable', en: 'Buy a convertible' },
        out: [
          { w: 2, text: { fr: "Je me suis offert une décapotable rouge. Je roule cheveux au vent. Enfin, ceux qui restent.", en: 'I bought myself a red convertible. I drive with the wind in my hair. What\'s left of it.' }, fx: { money: -9000, happy: 12, looks: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "Décapotable rouge achetée. Premier jour : un orage. Deuxième jour : un pigeon. Troisième jour : une amende.", en: 'Red convertible bought. Day one: a thunderstorm. Day two: a pigeon. Day three: a speeding ticket.' }, fx: { money: -9200, happy: 2, stress: 4 } },
        ],
      },
      {
        label: { fr: 'Me faire tatouer', en: 'Get a tattoo' },
        out: [
          { w: 2, text: { fr: "Je me suis fait tatouer un loup qui hurle à la lune. Mes proches trouvent ça « intéressant ». Moi, je trouve ça puissant.", en: "I got a tattoo of a wolf howling at the moon. My loved ones call it 'interesting'. I call it powerful." }, fx: { money: -200, happy: 8, looks: 1 } },
          { w: 1, text: { fr: "Le tatoueur a écrit « NO REGERT ». Je regrette.", en: "The tattoo artist wrote 'NO REGERTS'. I regret." }, fx: { money: -200, happy: -6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Courir un marathon', en: 'Train for a marathon' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai couru mon premier marathon. J'ai fini juste derrière un type déguisé en banane, mais j'ai fini.", en: 'I ran my first marathon. I finished right behind a guy dressed as a banana, but I finished.' }, fx: { athletic: 10, health: 6, happy: 10 }, mood: 'proud' },
          { w: 1, text: { fr: "Au bilan médical avant le marathon, on m'a découvert de l'hypertension. Le marathon attendra, les cachets non.", en: "The pre-marathon checkup found high blood pressure. The marathon can wait; the pills can't." }, fx: { disease: 'hypertension', health: -4, happy: -5 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Accepter le temps qui passe', en: 'Embrace getting older' }, text: { fr: "J'ai acheté une crème antirides et un fauteuil très confortable. La sagesse, c'est surtout un bon fauteuil.", en: 'I bought anti-wrinkle cream and a very comfortable armchair. Wisdom is mostly a good armchair.' }, fx: { happy: 4, stress: -5, smarts: 2 } },
    ],
  },

  // ───────────────────────────── feed-only (auto) ─────────────────────────────
  {
    id: 'ad_pigeon',
    icon: '🐦',
    cat: 'weird',
    auto: true,
    scene: { place: 'park', mood: 'shock', prop: 'sandwich' },
    when: { age: [18, 80] },
    weight: 4,
    cooldown: 10,
    text: {
      fr: ["Un pigeon a fondu en piqué sur mon sandwich et me l'a arraché des mains. Je l'ai poursuivi sur trois rues. Il a gagné.", "Au parc, un pigeon m'a volé mon jambon-beurre, puis m'a fixé{|e} en le mangeant. J'ai perdu mon déjeuner et ma dignité."],
      en: ['A pigeon dive-bombed my sandwich and tore it out of my hands. I chased it for three blocks. It won.', 'At the park, a pigeon stole my ham sandwich, then stared at me while eating it. I lost my lunch and my dignity.'],
    },
    fx: { happy: -3 },
  },
  {
    id: 'ad_alien',
    icon: '👽',
    cat: 'weird',
    auto: true,
    scene: { place: 'park', mood: 'shock', prop: 'ufo' },
    when: { age: [18, 80] },
    weight: 1,
    once: true,
    text: {
      fr: ["Des lumières étranges ont plané au-dessus de chez moi cette nuit. Un petit être vert m'a demandé son chemin, puis il est reparti. Personne ne me croit.", "J'ai été brièvement enlevé{|e} par des extraterrestres. Ils m'ont examiné{|e}, ont eu l'air déçus, puis m'ont reposé{|e} sur mon paillasson."],
      en: ['Strange lights hovered over my place last night. A little green being asked me for directions, then left. Nobody believes me.', 'I was briefly abducted by aliens. They examined me, looked disappointed, then dropped me back on my doormat.'],
    },
    fx: { stress: 5, happy: 2 },
  },
  {
    id: 'ad_overtime',
    icon: '⏰',
    cat: 'work',
    auto: true,
    scene: { place: 'office', mood: 'sleepy', prop: 'clock' },
    when: { age: [18, 67], job: true },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["J'ai enchaîné les heures sup tout le mois. Mon chef m'a remercié{|e} par mail. Pas une prime : un mail.", "Encore une soirée au bureau chez {employer}. Le gardien et moi, on s'appelle par nos prénoms maintenant."],
      en: ['I racked up overtime all month. My boss thanked me by email. Not a bonus: an email.', 'Another late night at the office at {employer}. The night guard and I are on a first-name basis now.'],
    },
    fx: { perf: 5, stress: 5, happy: -2 },
  },
  {
    id: 'ad_aunt_inheritance',
    icon: '💰',
    cat: 'money',
    auto: true,
    vars: { amount: [500, 5000] },
    scene: { place: 'home', mood: 'happy', prop: 'letter' },
    when: { age: [25, 80] },
    weight: 3,
    once: true,
    text: {
      fr: ["Une grand-tante dont j'ignorais l'existence m'a légué {$amount} et un service à thé en forme de chats. J'ai pleuré par politesse. Et un peu pour le service à thé.", "Le notaire m'a appelé{|e} : tante Josette, croisée une fois en 1998, m'a laissé {$amount}. Le testament précise : « Pour {le petit|la petite} qui ne m'a pas mordue »."],
      en: ["A great-aunt I didn't know existed left me {$amount} and a cat-shaped tea set. I cried out of politeness. And a little for the tea set.", "The notary called: Aunt Josette, whom I met once in 1998, left me {$amount}. The will says: 'For the little one who didn't bite me.'"],
    },
    fx: { money: 'amount', happy: 6 },
  },
  {
    id: 'ad_tax_bill',
    icon: '🧾',
    cat: 'money',
    auto: true,
    vars: { amount: [150, 1200] },
    scene: { place: 'home', mood: 'sad', prop: 'letter' },
    when: { age: [20, 80] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Le fisc m'a écrit une lettre pleine de mots compliqués et d'un seul chiffre très clair : {$amount} à payer. J'ai payé en pleurant.", "Redressement fiscal surprise : je dois {$amount} à cause d'une case cochée il y a trois ans. Je ne coche plus jamais rien."],
      en: ['The tax office sent me a letter full of complicated words and one very clear number: {$amount} owed. I paid it in tears.', "Surprise tax adjustment: I owe {$amount} because of a box I ticked three years ago. I'm never ticking anything again."],
    },
    fx: { money: '-amount', happy: -5, stress: 4 },
  },
  {
    id: 'ad_prophecy_true',
    icon: '✨',
    cat: 'weird',
    auto: true,
    vars: { amount: [40, 60] },
    scene: { place: 'home', mood: 'happy', prop: 'money' },
    when: { age: [19, 80], flag: 'ad_prophecy' },
    weight: 6,
    once: true,
    text: {
      fr: ["La voyante avait raison : une fortune m'attendait. J'ai trouvé {$amount} dans la poche d'un vieux manteau. À son échelle, c'est énorme.", "Prophétie accomplie : j'ai gagné {$amount} au loto du club de pétanque. La voyante avait vu juste, à quelques millions près."],
      en: ['The fortune teller was right: a fortune awaited me. I found {$amount} in an old coat pocket. By her standards, that\'s huge.', 'Prophecy fulfilled: I won {$amount} in the bowling club raffle. The fortune teller was right, give or take a few million.'],
    },
    fx: { money: 'amount', happy: 5, unflag: 'ad_prophecy' },
  },
  {
    id: 'ad_grandkids_hint',
    icon: '🧸',
    cat: 'family',
    auto: true,
    actor: 'child',
    scene: { place: 'home', mood: 'happy', prop: 'toys' },
    when: { age: [55, 80], has: 'child' },
    weight: 6,
    once: true,
    text: {
      fr: ["{a.first} m'a demandé si je pourrais « garder quelqu'un » certains mercredis, dans un futur pas si lointain. J'ai compris. J'ai acheté des Lego en cachette.", "{a.first} est passé{a:|e} avec un sourire bizarre et m'a demandé si j'aimais toujours « les tout petits ». Je crois que je vais devenir grand-{père|mère}."],
      en: ["{a.first} asked if I could 'babysit someone' on some Wednesdays in the not-so-distant future. I got the hint. I secretly bought Legos.", "{a.first} came by with a strange smile and asked if I still liked 'little ones'. I think I'm going to be a grandparent."],
    },
    fx: { happy: 6, rel: 5 },
  },
];
