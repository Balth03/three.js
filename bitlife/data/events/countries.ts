// Country-flavoured events: 8 per country (fr, be, us, uk, ca, jp, es, it, de, ch, br, mx, ma, au), gated by `when.country`.
// Affectionate local clichés: bureaucracy, weather, food snobbery, sport, transport, tourists, customs. Never peoples, never religions.
// Chains: cy_fr_admin → cy_fr_admin_2, cy_us_er_bill → cy_us_collector, cy_ca_moose → cy_ca_moose_back,
// cy_ch_bank → cy_ch_bank_2, cy_mx_lucha → cy_mx_lucha_2 (all via schedule).
import type { EventDef } from '@bl/sim';

export const countryEvents: EventDef[] = [
  // ═════════════════════════════ FRANCE ═════════════════════════════
  {
    id: 'cy_fr_baguette',
    icon: '🥖',
    cat: 'country',
    rating: 0,
    scene: { place: 'home', mood: 'happy', prop: 'baguette' },
    when: { country: ['fr'], age: [6, 12] },
    actor: 'parent',
    vars: { amount: [2, 6] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "{a.rel} te tend {$amount} et une mission sacrée : « Une baguette pas trop cuite, et tu rends la monnaie. » À la boulangerie, onze personnes font la queue, plus {w:animal} qui attend son tour très poliment.",
        "Mission boulangerie ! {a.rel} veut « une tradition, pas une baguette d'usine, hein ». Tu as {$amount} dans la main, la file déborde sur le trottoir et ça sent le croissant chaud jusqu'au bout de la rue.",
        "Premier achat tout{|e} seul{|e} à la boulangerie. Depuis la maison, tu répètes ta phrase dans ta tête : « Bonjour madame, une baguette s'il vous plaît. » Arrivé{|e} au comptoir, ton cerveau affiche un écran bleu.",
        "{a.rel} t'envoie chercher le pain {w:weather}. Tu as {$amount}, la baguette coûte presque rien, et la vitrine des bonbons à dix centimes te fait des clins d'œil [[insistants|indécents|très professionnels]].",
      ],
      en: [
        "{a.rel} hands you {$amount} and a sacred mission: “One baguette, not too crispy, and bring back the change.” At the bakery, eleven people are queuing, plus {w:animal} patiently waiting its turn.",
        "Bakery mission! {a.rel} wants “a proper traditional loaf, not a factory baguette, okay?” You've got {$amount} in your fist, the line spills onto the sidewalk and the whole street smells of warm croissants.",
        "Your first solo bakery run. All the way there you rehearse your line: “Hello madam, one baguette please.” At the counter, your brain displays a blue screen of death.",
        "{a.rel} sends you to get bread {w:weather}. You've got {$amount}, the baguette costs next to nothing, and the ten-cent candy display is winking at you [[insistently|indecently|very professionally]].",
      ],
    },
    choices: [
      {
        label: { fr: 'Croquer le quignon', en: 'Bite off the tip' },
        out: [
          { w: 3, text: { fr: ["J'ai mangé le quignon sur le chemin du retour. Puis la moitié. {a.my} a reçu un bâton de pain de douze centimètres et une explication très floue.", "Le quignon a disparu avant le coin de la rue, comme le veut la tradition nationale. Personne n'a été surpris, surtout pas {a.my}."], en: ["I ate the tip on the way home. Then half the loaf. {a.my} received a five-inch bread stick and a very vague explanation.", "The tip vanished before the corner, as national tradition demands. Nobody was surprised, least of all {a.my}."] }, fx: { happy: 6, rel: -5, weight: 0.01 }, mood: 'happy' },
          { w: 1, text: { fr: ["En croquant le quignon, je me suis planté la croûte dans la gencive. J'ai saigné sur la baguette. {a.my} l'a quand même servie au dîner."], en: ["Biting the tip, I stabbed my gum with the crust. I bled on the baguette. {a.my} served it at dinner anyway."] }, fx: { health: -2, happy: 2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Claquer la monnaie', en: 'Blow the change' },
        out: [
          { w: 2, text: { fr: ["J'ai dépensé toute la monnaie en fraises Tagada et en crocodiles. {a.my} a compté les pièces, puis les bonbons, puis a soupiré pendant quatre minutes.", "Sachet de bonbons à {$amount}, mâchoire collée pour l'après-midi. Le dentiste me remercie d'avance."], en: ["I spent all the change on gummy strawberries and sour crocodiles. {a.my} counted the coins, then the candy, then sighed for four minutes.", "A {$amount} candy bag and a jaw glued shut all afternoon. My dentist thanks me in advance."] }, fx: { happy: 7, health: -2, rel: -5 }, mood: 'happy' },
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai complimenté la coiffure de la boulangère et obtenu une chouquette gratuite. À mon âge, j'ai compris le capitalisme.", "J'ai négocié trois bonbons pour le prix de deux en citant « la crise ». La boulangère a ri et cédé. Je vais faire HEC."], en: ["I complimented the baker's hairdo and got a free cream puff. At my age, I already understand capitalism.", "I haggled three candies for the price of two by mentioning “the economy”. The baker laughed and caved. I'm going to business school."] }, fx: { happy: 5, smarts: 3 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Paniquer au comptoir', en: 'Freeze at the counter' },
        text: { fr: ["J'ai dit « Bonjour maman, une baguette s'il vous plaît » à la boulangère. Elle m'a appelé{|e} « mon lapin » et m'a donné une chouquette de consolation.", "J'ai bégayé, pointé un éclair au café du doigt et payé avec toute ma tirelire mentale. Je suis rentré{|e} avec un éclair et sans pain."], en: ["I said “Hi mom, one baguette please” to the baker. She called me “sweetie” and gave me a consolation cream puff.", "I stammered, pointed at a coffee éclair and paid with my entire mental piggy bank. I came home with an éclair and no bread."] },
        fx: { happy: 2, stress: 3 },
      },
    ],
  },
  {
    id: 'cy_fr_greve',
    icon: '🚆',
    cat: 'country',
    rating: 1,
    scene: { place: 'office', mood: 'angry', prop: 'train' },
    when: { country: ['fr'], age: [18, 66], job: true },
    vars: { amount: [40, 140] },
    weight: 9,
    cooldown: 3,
    text: {
      fr: [
        "Grève générale des transports, épisode [[4|7|12]] de la saison. Le panneau de la gare affiche « supprimé » sur toutes les lignes, sauf un train qui finit {w:far_place}. Ton patron attend « tout le monde à 9 h, sans exception ».",
        "Ce matin, c'est grève. Pas une grève normale : une grève reconductible, dans le cadre d'un mouvement interprofessionnel, contre une réforme dont personne n'a lu le titre. Les syndicats le justifient {w:excuse}. Tu habites à 14 kilomètres de {employer}.",
        "Il n'y a plus de métro, plus de bus, plus de tram. Il reste {w:vehicle} et ta dignité. Ton chef t'envoie un SMS : « On compte sur toi, hein. » Un Uber coûte {$amount}.",
        "La grève est partie pour durer, et à {city} le trafic est « fortement perturbé », ce qui veut dire qu'il n'existe plus. Des syndicalistes distribuent {w:food} devant la gare. Ça sent la lutte. Tu es en retard.",
      ],
      en: [
        "General transport strike, episode [[4|7|12]] of the season. The station board reads “cancelled” on every line, except one train that ends up {w:far_place}. Your boss expects “everyone at 9 a.m., no exceptions.”",
        "It's strike day. Not a normal strike: a rolling, cross-sector, open-ended strike against a reform nobody has read the title of. The unions justify it {w:excuse}. You live nine miles from {employer}.",
        "No metro, no bus, no tram. All that's left is {w:vehicle} and your dignity. Your boss texts: “Counting on you, okay?” An Uber costs {$amount}.",
        "The strike is here to stay, and in {city} traffic is “severely disrupted”, which means it no longer exists. Union guys are handing out {w:food} outside the station. Smells like struggle. You're late.",
      ],
    },
    choices: [
      {
        label: { fr: 'Y aller à pied', en: 'Walk there' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["Quatorze kilomètres à pied, ça use les souliers. Je suis arrivé{|e} à 11 h, en sueur, avec une ampoule de la taille d'un œuf. Mon chef m'a demandé pourquoi j'étais en retard.", "J'ai marché deux heures en écoutant un podcast sur la marche. Je me suis découvert{|e} une passion et un tendon d'Achille."], en: ["Nine miles on foot. I arrived at 11 a.m., drenched, with a blister the size of an egg. My boss asked why I was late.", "I walked two hours listening to a podcast about walking. I discovered a passion and an Achilles tendon."] }, fx: { athletic: 4, health: -2, perf: 2, stress: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["À mi-chemin, je me suis fait renverser par une trottinette en grève de freins. J'ai fini la matinée aux urgences, elles aussi en grève, mais « en service minimum ».", "J'ai pris un raccourci. Il n'en était pas un. Je suis arrivé{|e} dans une autre commune, à l'heure du déjeuner, pieds en sang."], en: ["Halfway there, I got hit by an e-scooter whose brakes were also on strike. I spent the morning in the ER, which was also on strike, but “providing minimum service”.", "I took a shortcut. It wasn't one. I ended up in another town at lunchtime, feet bleeding."] }, fx: { health: -6, stress: 6 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Rejoindre la grève', en: 'Join the strike' },
        out: [
          { w: 2, text: { fr: ["J'ai rejoint le piquet de grève. Merguez, vin rouge en cubi et chants révolutionnaires. Je ne sais toujours pas contre quoi on manifestait, mais j'étais contre de tout mon cœur.", "J'ai défilé de République à Nation avec une pancarte « {w:exclaim} » parce qu'il ne restait plus de slogans. Une journaliste m'a interviewé{|e}. J'ai dit « c'est inadmissible ». Ça a suffi."], en: ["I joined the picket line. Sausages, boxed red wine and revolutionary songs. I still don't know what we were protesting, but I was against it with all my heart.", "I marched across town with a sign reading “{w:exclaim}” because they'd run out of slogans. A reporter interviewed me. I said “it's unacceptable”. That was enough."] }, fx: { happy: 8, perf: -6, karma: 2 }, mood: 'party' },
          { w: 1, text: { fr: ["Mon chef m'a vu{|e} au journal de 20 h, en train de danser sur un camion de la CGT avec un mégaphone. Le lendemain, il m'a accueilli{|e} d'un « Bien dormi, camarade ? »."], en: ["My boss saw me on the evening news, dancing on a union truck with a megaphone. Next day he greeted me with “Sleep well, comrade?”"] }, fx: { happy: 4, perf: -10, fame: 1 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Payer un VTC', en: 'Pay for a ride' },
        out: [
          { w: 1, text: { fr: ["J'ai payé {$amount} pour faire 14 kilomètres en deux heures dans les bouchons, avec un chauffeur qui m'a expliqué sa théorie : {w:conspiracy}. Je suis arrivé{|e} à l'heure du déjeuner.", "Le VTC m'a coûté {$amount}. Le chauffeur était mon ancien prof de maths, reconverti. Il m'a quand même demandé de réciter mes tables."], en: ["I paid {$amount} to go nine miles in two hours of gridlock, with a driver explaining his theory {w:conspiracy}. I arrived at lunchtime.", "The ride cost me {$amount}. The driver was my old math teacher, career change. He still made me recite my times tables."] }, fx: { money: '-amount', stress: 3, perf: 2 }, mood: 'neutral' },
        ],
      },
    ],
  },
  {
    id: 'cy_fr_admin',
    icon: '📑',
    cat: 'country',
    rating: 1,
    scene: { place: 'office', mood: 'angry', prop: 'papers' },
    when: { country: ['fr'], age: [18, 85] },
    weight: 7,
    once: true,
    text: {
      fr: [
        "Troisième rendez-vous à la préfecture de {city} pour renouveler un papier. Le guichetier regarde ton dossier et soupire : « Il manque un justificatif de domicile de moins de trois mois. » Tu as apporté quatorze justificatifs. Ils ont tous quatre mois. Dans la salle d'attente, quelqu'un est venu avec {w:animal}.",
        "La CAF te demande un formulaire Cerfa n° [[12345*07|65432*03|13750*05]] pour prouver que tu n'as pas besoin du formulaire. Le site internet plante depuis 2019. Le numéro d'appel est surtaxé et passe {w:song} en boucle.",
        "Tu dois faire tamponner un document à la mairie. La mairie demande l'avis de la sous-préfecture, qui renvoie vers le centre des impôts, qui t'envoie {w:at_place} chercher un papier qui n'existe plus depuis 1987.",
        "Dossier de carte grise : refusé. Motif : « signature non conforme ». Tu as signé comme d'habitude. Apparemment, ta signature habituelle n'est pas conforme à ta signature habituelle. Le guichetier mange {w:food} et ferme dans quatre minutes.",
      ],
      en: [
        "Third appointment at the {city} prefecture to renew one document. The clerk looks at your file and sighs: “You're missing proof of address less than three months old.” You brought fourteen proofs of address. They're all four months old. In the waiting room, someone brought {w:animal}.",
        "The benefits office needs form no. [[12345*07|65432*03|13750*05]] to prove you don't need the form. The website has been crashing since 2019. The hotline is premium-rate and plays {w:song} on a loop.",
        "You need a stamp from the town hall. The town hall needs the sub-prefecture's opinion, which redirects you to the tax office, which sends you {w:at_place} to fetch a document that hasn't existed since 1987.",
        "Car registration file: rejected. Reason: “non-compliant signature.” You signed like always. Apparently your usual signature doesn't match your usual signature. The clerk is eating {w:food} and closes in four minutes.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rester poli{|e}', en: 'Stay polite' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai souri, rempli six formulaires et attendu trois heures. Le dossier est « en cours de traitement ». Un délai de « quelques semaines à quelques années ».", "J'ai dit « je comprends tout à fait » onze fois. La dame a fini par me tamponner un truc. Je ne sais pas quoi. J'ai le tampon, c'est l'essentiel."], en: ["I smiled, filled out six forms and waited three hours. The file is “being processed.” Timeframe: “a few weeks to a few years.”", "I said “I completely understand” eleven times. The lady eventually stamped something. I don't know what. I have the stamp, that's what matters."] }, fx: { stress: 6, karma: 2, schedule: { key: 'cy_fr_admin_2', years: 1 } }, mood: 'sleepy' },
        ],
      },
      {
        label: { fr: 'Péter un câble', en: 'Lose it' },
        out: [
          { w: 2, text: { fr: ["J'ai hurlé « {w:swear} » dans la salle d'attente. Tout le monde a applaudi. Le vigile m'a raccompagné{|e} dehors, mais il applaudissait aussi.", "J'ai crié que j'allais écrire au Président. Le guichetier m'a tendu un formulaire pour écrire au Président. Il fallait un justificatif de domicile."], en: ["I screamed “{w:swear}” in the waiting room. Everyone applauded. The security guard walked me out, but he was clapping too.", "I yelled that I'd write to the President. The clerk handed me a form for writing to the President. It required proof of address."] }, fx: { happy: 4, stress: -4, karma: -2, schedule: { key: 'cy_fr_admin_2', years: 1 } }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Abandonner', en: 'Give up' },
        text: { fr: ["J'ai abandonné. Je vis désormais sans ce papier, dans une zone grise administrative, comme un fantôme qui paie quand même ses impôts.", "J'ai rangé le dossier dans un tiroir marqué « plus tard ». Le tiroir contient déjà des dossiers de 2011. C'est mon tiroir de la honte."], en: ["I gave up. I now live without that document, in an administrative grey zone, like a ghost who still pays taxes.", "I filed the folder in a drawer labeled “later.” The drawer already holds files from 2011. It's my drawer of shame."] },
        fx: { stress: -2, happy: -2, schedule: { key: 'cy_fr_admin_2', years: 1 } },
      },
    ],
  },
  {
    id: 'cy_fr_admin_2',
    icon: '⚰️',
    cat: 'country',
    rating: 2,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock', prop: 'letter', fx: 'ghost' },
    when: { country: ['fr'], age: [18, 95] },
    text: {
      fr: [
        "Une lettre recommandée de l'administration, enfin. « Suite à une erreur de saisie, vous êtes déclaré{|e} décédé{|e} depuis le 12 mars. Nous vous prions d'agréer nos sincères condoléances. » Ta carte Vitale ne marche plus. Ton dossier, lui, est toujours en cours.",
        "Un an après ton dossier, réponse officielle : tu es mort{|e}. Administrativement. Ta banque a gelé ton compte, ta mutuelle t'a envoyé {w:gift} « en souvenir » et ton opérateur téléphonique continue de te prélever.",
        "Courrier du jour : un acte de décès. Le tien. Cause du décès : « non renseignée ». Il manque, bien sûr, un justificatif de domicile de moins de trois mois pour contester.",
        "Le fameux dossier a été traité. Résultat : « Usager inexistant. » Tu existes pourtant : tu viens de te cogner {w:bodypart} contre le meuble à chaussures et ça fait un mal de chien.",
      ],
      en: [
        "A registered letter from the administration, at last. “Due to a data-entry error, you have been declared deceased since March 12. Please accept our sincere condolences.” Your health card no longer works. Your file is still being processed.",
        "A year after your paperwork, the official answer: you're dead. Administratively. Your bank froze your account, your health insurer sent {w:gift} “in memory,” and your phone company keeps billing you anyway.",
        "Today's mail: a death certificate. Yours. Cause of death: “not specified.” To contest it, you need, of course, proof of address less than three months old.",
        "The famous file has been processed. Result: “User does not exist.” Yet you exist: you just smashed your {w:bodypart} on the shoe rack and it hurts like hell.",
      ],
    },
    choices: [
      {
        label: { fr: 'Prouver que je vis', en: 'Prove I am alive' },
        out: [
          { w: 2, text: { fr: ["Je suis allé{|e} à la mairie en personne. On m'a demandé un certificat de vie. Signé par un médecin. Le médecin a refusé : « Vous êtes mort{|e}, je ne soigne pas les morts. » J'ai pleuré, ce qui a été jugé « peu probant ».", "J'ai ressuscité en six mois, quatre formulaires et une prise de sang. Jésus l'a fait en trois jours, mais lui n'avait pas affaire à la CPAM."], en: ["I went to the town hall in person. They asked for a certificate of life. Signed by a doctor. The doctor refused: “You're dead, I don't treat dead people.” I cried, which was deemed “inconclusive.”", "I came back to life in six months, four forms and a blood test. Some people did it in three days, but they never had to deal with French social security."] }, fx: { stress: 10, happy: -4 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Profiter de ma mort', en: 'Enjoy being dead' },
        out: [
          { w: 2, text: { fr: ["Mort{|e} officiellement, j'ai arrêté de payer les amendes, les impôts et la redevance. Les huissiers n'osent pas frapper chez un mort. C'est la meilleure année de ma vie, enfin, de ma mort.", "J'ai organisé mon propre enterrement pour voir qui viendrait. Huit personnes, dont une qui a dansé sur ma tombe. Je l'ai noté{|e} dans un carnet."], en: ["Officially dead, I stopped paying fines, taxes and the TV license. Bailiffs don't dare knock on a dead person's door. Best year of my life. Well, of my death.", "I threw my own funeral to see who'd show up. Eight people, one of whom danced on my grave. I wrote their name in a little notebook."] }, fx: { happy: 10, money: 800, karma: -4, visual: 'ghost' }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai voulu hanter mon guichetier préféré en drap blanc. Il a fait une crise cardiaque. Lui, il est vraiment mort. Son dossier a été traité en deux heures."], en: ["I tried to haunt my favorite clerk wearing a bedsheet. He had a heart attack. He's actually dead. His file was processed in two hours."] }, fx: { happy: 3, karma: -10, visual: 'ghost' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'cy_fr_bise',
    icon: '😘',
    cat: 'country',
    rating: 0,
    scene: { place: 'party', mood: 'neutral', prop: 'cheek' },
    when: { country: ['fr'], age: [16, 85] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: [
        "Soirée chez des amis d'amis. Une inconnue s'approche pour te faire la bise. Problème : tu viens de {city}, elle vient de Montpellier, et personne ne sait si on en fait deux, trois ou quatre. Vos visages avancent. Le destin se joue à gauche ou à droite.",
        "Quinze personnes arrivent au barbecue en même temps. Il faut faire la bise à chacun. À deux bises chacun, ça fait trente bises. À quatre bises, tu seras encore là au dessert. Le premier de la liste dégage {w:smell}.",
        "Un type que tu ne connais pas approche, joue en avant. Bise ? Poignée de main ? Check ? Accolade virile ? Il hésite aussi, {w:food} dans une main. Vous êtes deux à jouer au poker de la politesse.",
        "Pot de départ au bureau. Ton chef fait la bise à tout le monde sauf à toi : il te tend la main. Tu avances la joue. Il avance la main. Ta joue rencontre sa main. Un silence. Puis {w:sound}.",
      ],
      en: [
        "Party at a friend of a friend's. A stranger leans in for the cheek kiss. Problem: you're from {city}, she's from Montpellier, and nobody knows if it's two, three or four kisses. Your faces approach. Destiny hangs on left or right.",
        "Fifteen people arrive at the barbecue at once. You have to cheek-kiss every single one. At two kisses each, that's thirty kisses. At four, you'll still be here for dessert. The first one in line gives off {w:smell}.",
        "A guy you don't know approaches, cheek first. Kiss? Handshake? Fist bump? Manly hug? He's hesitating too, holding {w:food}. You're both playing politeness poker.",
        "Office farewell drinks. Your boss cheek-kisses everyone except you: he offers a hand. You offer a cheek. He offers a hand. Your cheek meets his hand. Silence. Then {w:sound}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Deux bises, à gauche', en: 'Two kisses, left first' },
        out: [
          { w: 2, text: { fr: ["Deux bises nettes, sans bavure. La France entière est fière de moi. J'ai serré des mains imaginaires de satisfaction.", "Gauche, droite, terminé. Une exécution de championnat du monde. L'autre personne est repartie en hochant la tête, admirative."], en: ["Two clean kisses, flawless. All of France is proud of me. I shook imaginary hands in satisfaction.", "Left, right, done. A world-championship performance. The other person walked away nodding, impressed."] }, fx: { happy: 4, looks: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["On est parti{|e}s du même côté. Nos nez se sont percutés comme deux voitures tamponneuses. J'ai saigné du nez sur sa chemise. On est amis maintenant, liés par le sang.", "Elle en voulait trois, j'en ai fait deux. Elle est restée la joue tendue dans le vide pendant cinq longues secondes. J'y repense la nuit."], en: ["We both went the same way. Our noses collided like bumper cars. I bled on their shirt. We're friends now, bound by blood.", "She wanted three, I did two. She stayed there, cheek offered to the void, for five long seconds. I think about it at night."] }, fx: { health: -2, stress: 4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Quatre bises, à fond', en: 'Four kisses, full send' },
        out: [
          { w: 1, text: { fr: ["Quatre bises, bien sonores. La personne était parisienne. Elle m'a regardé{|e} comme si j'avais tenté de lui manger la tête.", "J'ai fait quatre bises à tout le monde. Au bout de la douzième personne, j'avais des crampes aux joues et une odeur de onze parfums différents."], en: ["Four loud kisses. The person was Parisian. She looked at me like I'd tried to eat her head.", "I gave everyone four kisses. By person twelve, my cheeks were cramping and I smelled of eleven different perfumes."] }, fx: { happy: 2, stress: 2 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Tendre la main', en: 'Offer a handshake' },
        text: { fr: ["J'ai tendu la main fermement. On m'a traité{|e} de « Suisse ». Puis on m'a fait la bise quand même, par-dessus la main, comme une prise de catch.", "J'ai serré la main, très droit{|e}. Quelqu'un a chuchoté « c'est un DRH, ou quoi ? ». Je n'ai pas été réinvité{|e}."], en: ["I offered a firm handshake. Someone called me “Swiss”. Then kissed me anyway, right over the hand, like a wrestling move.", "I shook hands, very upright. Someone whispered “Is that an HR manager or what?” I was not invited back."] },
        fx: { happy: -1, discipline: 2 },
      },
    ],
  },
  {
    id: 'cy_fr_apero',
    icon: '🫒',
    cat: 'country',
    rating: 2,
    scene: { place: 'party', mood: 'party', prop: 'pastis' },
    when: { country: ['fr'], age: [18, 75] },
    weight: 9,
    cooldown: 3,
    text: {
      fr: [
        "Les voisins t'invitent à « un petit apéro, vite fait ». Il est 23 h 40. Tu as mangé quatorze cacahuètes, trois chips et une olive. On t'a servi six pastis. Personne ne parle d'aller dîner. Personne ne parlera jamais d'aller dîner. La conversation porte sur {w:hobby} depuis deux heures.",
        "Apéro dînatoire chez Gérard. « Dînatoire » signifie : un saucisson, une barquette de tomates cerises et {w:drink}, mais en quantité industrielle. Gérard sort sa troisième bouteille de rosé « pour finir ».",
        "« On se fait un apéro ? » Il est 18 h. À 2 h du matin, tu es toujours sur la terrasse, tu as perdu une chaussure, tu débats avec {w:celeb} au téléphone et quelqu'un vient de sortir la planche de charcuterie « de secours ».",
        "Apéro géant chez ton oncle. Il y a du pastis, du rosé, de la bière, et un alcool de prune fait maison dans une bouteille de Destop recyclée. L'oncle insiste : « Tu goûtes, ça soigne tout. »",
      ],
      en: [
        "The neighbors invite you for “a quick little drink”. It's 11:40 p.m. You've eaten fourteen peanuts, three chips and one olive. They've poured you six pastis. Nobody mentions dinner. Nobody will ever mention dinner. The conversation has been about {w:hobby} for two hours.",
        "“Dinner-style” aperitif at Gérard's. “Dinner-style” means one salami, a tray of cherry tomatoes and {w:drink}, but in industrial quantities. Gérard opens his third bottle of rosé “to finish up.”",
        "“Quick drink?” It's 6 p.m. At 2 a.m. you're still on the terrace, you've lost a shoe, you're arguing with {w:celeb} on the phone and someone just brought out the “emergency” charcuterie board.",
        "Giant aperitif at your uncle's. There's pastis, rosé, beer, and homemade plum brandy in a recycled drain-cleaner bottle. Your uncle insists: “Have a taste, it cures everything.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Encore un dernier', en: 'One last one' },
        out: [
          { w: 2, text: { fr: ["« Un dernier » a duré jusqu'à 4 h. J'ai vomi dans le figuier des voisins, puis sur le chat, puis encore dans le figuier pour finir proprement. Le figuier a donné ses meilleures figues l'été suivant.", "J'ai bu le dernier, puis le dernier dernier, puis celui « pour la route ». Je me suis réveillé{|e} dans le hamac, une rondelle de saucisson collée sur le front comme un troisième œil."], en: ["“One last one” lasted until 4 a.m. I puked in the neighbors' fig tree, then on the cat, then in the fig tree again to finish neatly. The tree gave its best figs ever the next summer.", "I had the last one, then the last last one, then one “for the road.” I woke up in the hammock with a slice of salami stuck to my forehead like a third eye."] }, fx: { happy: 8, health: -6, addiction: ['alcohol', 6], visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: ["J'ai goûté l'alcool de prune de l'oncle. J'ai vu {w:celeb} danser la Macarena, puis Dieu, puis plus rien pendant onze heures. Je suis aveugle de l'œil gauche jusqu'à jeudi.", "Le tord-boyaux de l'oncle m'a fait fondre deux plombages et le fond du verre. Mes cordes vocales ont pris leur retraite."], en: ["I tasted my uncle's plum brandy. I saw {w:celeb} dance the Macarena, then God, then nothing for eleven hours. I'm blind in my left eye until Thursday.", "Uncle's moonshine melted two fillings and the bottom of the glass. My vocal cords took early retirement."] }, fx: { health: -12, happy: 4, addiction: ['alcohol', 10] }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Exiger un vrai dîner', en: 'Demand actual dinner' },
        out: [
          { w: 1, text: { fr: ["J'ai demandé « on mange quand ? ». Silence glacial. On m'a tendu un bol de chips au vinaigre, sans un mot. J'ai compris que j'avais rompu un pacte sacré.", "J'ai commandé une pizza sur la terrasse. Les voisins ont fait semblant d'être choqués, puis ont mangé les trois quarts. Je n'ai eu que la croûte."], en: ["I asked, “When do we eat?” Icy silence. Someone handed me a bowl of salt-and-vinegar chips without a word. I'd broken a sacred pact.", "I ordered a pizza to the terrace. The neighbors pretended to be shocked, then ate three quarters of it. I got the crust."] }, fx: { happy: -2, weight: 0.01 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Fuir par la haie', en: 'Escape through the hedge' },
        out: [
          { w: 1, text: { fr: ["J'ai prétexté une envie pressante et je me suis échappé{|e} par la haie de thuyas. J'y ai laissé un bout de pantalon et une partie de ma fesse gauche.", "Évasion par la haie réussie. Mais elle donnait sur un autre apéro. Ils m'ont accueilli{|e} avec un pastis. C'est sans fin."], en: ["I faked an urgent bathroom need and escaped through the hedge. I left behind part of my pants and part of my left buttock.", "Hedge escape successful. But it led into another aperitif. They welcomed me with a pastis. It never ends."] }, fx: { health: -3, happy: 3 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'cy_fr_tour',
    icon: '🚴',
    cat: 'country',
    rating: 0,
    scene: { place: 'park', mood: 'party', prop: 'bike', fx: 'confetti' },
    when: { country: ['fr'], age: [6, 95] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Le Tour de France passe dans ton village ! Depuis 7 h du matin, tout le monde attend sur le bord de la route avec des glacières. La caravane publicitaire arrive et lance des porte-clés en plastique comme des grenades. Ton voisin a déjà attrapé {w:object}.",
        "Étape du Tour près de {city}. Un type en slip léopard court à côté des coureurs en hurlant. Une mamie a peint le nom d'un coureur sur la route avec de la peinture de clôture. Tu as une place au premier rang.",
        "Le peloton passe dans [[deux|trois|quatre]] minutes. Tu attends depuis six heures sous le soleil. Les coureurs vont passer en neuf secondes chrono. Un camion publicitaire vient de te lancer un saucisson en pleine poitrine.",
        "Grande nouvelle au village : le Tour passe devant la boulangerie. Le maire a fait repeindre les ronds-points, la télé est là, et ton voisin a enfilé un costume représentant {w:animal} pour passer à l'antenne.",
      ],
      en: [
        "The Tour de France is coming through your village! Since 7 a.m. everyone's been waiting roadside with coolers. The promo caravan arrives, hurling plastic keychains like grenades. Your neighbor already caught {w:object}.",
        "A Tour stage near {city}. A guy in leopard-print briefs sprints next to the riders, screaming. A granny painted a cyclist's name on the road with fence paint. You've got a front-row spot.",
        "The peloton passes in [[two|three|four]] minutes. You've been waiting six hours in the sun. The riders will be gone in nine seconds flat. A promo truck just threw a salami at your chest.",
        "Big news in the village: the Tour is passing the bakery. The mayor had the roundabouts repainted, TV crews are here, and your neighbor dressed up as {w:animal} to get on air.",
      ],
    },
    choices: [
      {
        label: { fr: 'Courir à côté', en: 'Run alongside' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai couru 200 mètres à côté du maillot jaune en criant « Allez ! ». Je suis passé{|e} à la télé quatre secondes. Ma grand-mère a enregistré le passage et le montre à tous ses invités.", "J'ai sprinté avec le peloton jusqu'au virage. Un coureur m'a dit « dégage » en italien. C'est le plus beau jour de ma vie."], en: ["I ran 200 yards next to the yellow jersey screaming “Go!” I was on TV for four seconds. Grandma recorded it and shows it to every guest.", "I sprinted with the peloton to the bend. A rider told me to get lost in Italian. Best day of my life."] }, fx: { happy: 10, athletic: 2, fame: 1 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai trébuché devant le peloton. Quarante coureurs m'ont évité{|e} au millimètre. J'ai été insulté{|e} en neuf langues et filmé{|e} par un hélicoptère."], en: ["I tripped in front of the peloton. Forty riders dodged me by an inch. I was cursed at in nine languages and filmed from a helicopter."] }, fx: { health: -3, stress: 6, fame: 2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Chasser les goodies', en: 'Hunt the freebies' },
        out: [
          { w: 2, text: { fr: ["J'ai ramassé onze casquettes, quatre bobs, deux porte-clés, un paquet de madeleines et {w:object}. J'ai plongé devant un enfant pour le dernier bob. Je n'ai aucun regret.", "Bilan : un sac entier de goodies inutiles, dont un sifflet en forme de vache. Mon salon ressemble à une station-service de 1994."], en: ["I collected eleven caps, four bucket hats, two keychains, a pack of madeleines and {w:object}. I dove in front of a child for the last hat. No regrets.", "Haul: a whole bag of useless freebies, including a cow-shaped whistle. My living room looks like a 1994 gas station."] }, fx: { happy: 6, karma: -1 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Peindre mon nom sur la route', en: 'Paint my name on the road' },
        text: { fr: ["J'ai peint mon prénom en lettres géantes sur la route. Un hélicoptère l'a filmé. On a vu « {first} » à la télé nationale pendant deux secondes. Je suis une légende locale.", "J'ai voulu écrire « ALLEZ {first} » mais il n'y avait plus de peinture après « ALLE ». Les commentateurs se sont demandé ce que ça voulait dire pendant une minute entière."], en: ["I painted my first name in giant letters on the road. A helicopter filmed it. “{first}” was on national TV for two seconds. I'm a local legend.", "I meant to write “GO {first}” but ran out of paint after “G”. The commentators spent a whole minute wondering what it meant."] },
        fx: { happy: 7, fame: 1 },
      },
    ],
  },
  {
    id: 'cy_fr_fromage',
    icon: '🧀',
    cat: 'country',
    rating: 2,
    scene: { place: 'home', mood: 'sick', prop: 'cheese', fx: 'poop' },
    when: { country: ['fr'], age: [20, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Repas de famille. Ton oncle Bernard sort fièrement « un petit fromage de chez un producteur » : un époisses affiné onze semaines. Le fromage a bougé tout seul. Les chiens du quartier se sont mis à hurler.",
        "Au dessert, on apporte le plateau de fromages. Il y en a quatorze. Celui du milieu dégage {w:smell}, mais en pire, et il coule lentement vers le bord de la table comme s'il voulait s'enfuir.",
        "Ton beau-père te met au défi de finir le maroilles « de la cave ». Il est conservé dans une boîte hermétique, elle-même dans une boîte hermétique, elle-même dans le garage. Les mouches refusent d'en approcher. Le garage dégage {w:smell}, version apocalypse.",
        "Soirée raclette, mais un cousin a apporté un fromage corse « avec les asticots, c'est la tradition ». Les asticots ont l'air en meilleure santé que toi. Tout le monde te regarde.",
      ],
      en: [
        "Family dinner. Uncle Bernard proudly unveils “a little cheese from a small producer”: an époisses aged eleven weeks. The cheese moved on its own. Every dog in the neighborhood started howling.",
        "Dessert brings the cheese board. There are fourteen. The one in the middle gives off {w:smell}, only worse, and it's slowly oozing toward the edge of the table like it's trying to escape.",
        "Your father-in-law dares you to finish the maroilles “from the cellar.” It's kept in an airtight box, inside another airtight box, inside the garage. Flies refuse to go near it. The garage gives off {w:smell}, apocalypse edition.",
        "Raclette night, but a cousin brought a Corsican cheese “with the maggots, it's traditional.” The maggots look healthier than you. Everyone is staring at you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Manger une grosse part', en: 'Eat a big slice' },
        out: [
          { w: 2, odds: { health: 1 }, text: { fr: ["J'ai mangé une part énorme sans broncher. L'oncle a pleuré de fierté. Mon haleine a fait tomber une mouche en plein vol et décoller le papier peint.", "Délicieux. Vraiment. Mais pendant trois jours, mes pets ont eu un goût de cave humide. Mon partenaire dort dans la baignoire."], en: ["I ate a massive slice without flinching. My uncle wept with pride. My breath knocked a fly out of the air and peeled the wallpaper.", "Delicious. Truly. But for three days my farts tasted like a damp cellar. My partner sleeps in the bathtub."] }, fx: { happy: 6, looks: -2, weight: 0.02 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai vomi en jet sur le plateau de fromages. Le jet a atteint quatre fromages et un cousin. L'oncle a dit que « ça arrive aux meilleurs » et a continué à manger autour.", "Mon estomac a déposé une plainte. Diagnostic : intoxication. Le médecin a juste dit « époisses ? » en hochant la tête."], en: ["I projectile-vomited over the cheese board. The stream hit four cheeses and a cousin. My uncle said “happens to the best of us” and kept eating around it.", "My stomach filed a complaint. Diagnosis: food poisoning. The doctor just said “époisses?” and nodded."] }, fx: { health: -8, disease: 'food_poisoning', visual: 'poop' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Le cacher dans la plante', en: 'Hide it in the plant' },
        out: [
          { w: 1, text: { fr: ["J'ai glissé ma part dans le pot du ficus. Le ficus était mort le lendemain matin. Tante Josiane m'accuse d'avoir « une aura négative ».", "Caché dans la plante verte. Deux semaines plus tard, le salon de l'oncle sentait l'enfer. Il a appelé un dératiseur. Je me tais."], en: ["I slipped my slice into the ficus pot. The ficus was dead the next morning. Aunt Josiane says I have “a negative aura.”", "Hidden in the houseplant. Two weeks later, my uncle's living room smelled like hell. He called an exterminator. I'm saying nothing."] }, fx: { happy: 3, karma: -3 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Critiquer le fromage', en: 'Diss the cheese' },
        rating: 2,
        text: { fr: ["J'ai dit que ça sentait « le slip de randonneur ». L'oncle m'a traité{|e} de « {w:insult} » et m'a rayé{|e} de son testament. Je n'aurai jamais sa cave à vin.", "J'ai osé dire que je préférais le fromage en tranches sous plastique. Un silence de mort. Ma grand-mère a lâché son dentier. On ne m'adresse plus la parole depuis."], en: ["I said it smelled “like a hiker's underpants.” My uncle called me “{w:insult}” and cut me out of his will. I'll never get his wine cellar.", "I dared say I preferred plastic-wrapped cheese slices. Dead silence. Grandma clutched her pearls. Nobody's spoken to me since."] },
        fx: { happy: 2, karma: -2, stress: 3 },
      },
    ],
  },
  // ═════════════════════════════ BELGIQUE ═════════════════════════════
  {
    id: 'cy_be_frites',
    icon: '🍟',
    cat: 'country',
    rating: 0,
    scene: { place: 'park', mood: 'happy', prop: 'fries' },
    when: { country: ['be'], age: [6, 14] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Sortie à la friterie du coin avec ta famille. Au-dessus du comptoir, un panneau liste 47 sauces : andalouse, samouraï, américaine, brazil, pickles, géante… Le friturier te fixe. Il attend ta décision comme un juge.",
        "Tu as le droit de commander tout{|e} seul{|e} au fritkot. Le monsieur derrière la vitre a des avant-bras comme des jambons et une moustache qui a connu deux guerres. « Et avec ça, une sauce ? »",
        "Les frites ici sont cuites deux fois dans de la graisse de bœuf, et le friturier en est très fier. Devant toi, un client commande une mitraillette : une demi-baguette, deux fricadelles, des frites et trois sauces. Tu es impressionné{|e}.",
        "C'est vendredi soir à {city} : friterie ! Dans la file, il y a un monsieur en costume, {w:animal} et une mamie qui commande « un grand cornet, sel, mayonnaise, comme en 1962 ».",
      ],
      en: [
        "A trip to the local fry shack with your family. Above the counter, a sign lists 47 sauces: andalouse, samurai, américaine, brazil, pickles, giant… The fry guy is staring at you. He awaits your verdict like a judge.",
        "You're allowed to order on your own at the fritkot. The man behind the glass has forearms like hams and a moustache that's seen two wars. “And with that, a sauce?”",
        "Fries here are double-fried in beef fat, and the fry guy is very proud of it. In front of you, someone orders a mitraillette: half a baguette, two sausages, fries and three sauces. You're in awe.",
        "Friday night in {city}: fry shack time! In line there's a man in a suit, {w:animal} and a granny ordering “a large cone, salt, mayo, like in 1962.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Andalouse, évidemment', en: 'Andalouse, obviously' },
        out: [
          { w: 2, text: { fr: ["Andalouse. Le friturier a hoché la tête, une seule fois, avec respect. J'ai mangé mes frites comme un adulte, en regardant la pluie.", "J'ai pris andalouse et le friturier m'a rajouté des frites « parce que t'as bon goût, toi ». Je suis devenu{|e} un habitué à vie."], en: ["Andalouse. The fry guy nodded once, with respect. I ate my fries like an adult, watching the rain.", "I picked andalouse and the fry guy threw in extra fries “because you've got taste, kid.” I'm a regular for life."] }, fx: { happy: 6, weight: 0.01 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Demander du ketchup', en: 'Ask for ketchup' },
        out: [
          { w: 2, text: { fr: ["J'ai demandé du ketchup. Le friturier a posé sa pelle. La friterie est devenue silencieuse. Un monsieur a lâché sa fricadelle. J'ai eu mon ketchup, mais plus jamais de sourire.", "« Du ketchup ? Tu es Français ou quoi ? » Toute la file a ri. J'ai rougi jusqu'aux oreilles et mangé mes frites sans rien."], en: ["I asked for ketchup. The fry guy put down his scoop. The shack went silent. A man dropped his sausage. I got my ketchup, but never another smile.", "“Ketchup? What are you, French?” The whole line laughed. I turned red to the ears and ate my fries plain."] }, fx: { happy: -3, stress: 3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Goûter toutes les sauces', en: 'Try every sauce' },
        out: [
          { w: 2, odds: { health: 1 }, text: { fr: ["J'ai trempé une frite dans chacune des 47 sauces. Mon cornet ressemblait à une palette de peintre. J'ai eu mal au ventre jusqu'au lendemain midi, mais j'ai trouvé ma sauce préférée.", "Défi relevé : 47 sauces, 47 frites. Le friturier m'a offert un autocollant « Champion de la friterie ». Il est sur mon cartable."], en: ["I dipped a fry in each of the 47 sauces. My cone looked like a painter's palette. Stomach ache until lunch the next day, but I found my favorite sauce.", "Challenge done: 47 sauces, 47 fries. The fry guy gave me a “Fry Shack Champion” sticker. It's on my schoolbag."] }, fx: { happy: 8, health: -2, weight: 0.02 }, mood: 'proud' },
          { w: 1, text: { fr: ["À la sauce numéro 23, j'ai vomi sur mes chaussures. La sauce numéro 24 était déjà dans le cornet. Le friturier a dit « c'est la samouraï, ça arrive »."], en: ["At sauce number 23 I threw up on my shoes. Sauce 24 was already in the cone. The fry guy said, “That's the samurai, happens.”"] }, fx: { health: -4, happy: -2 }, mood: 'sick' },
        ],
      },
    ],
  },
  {
    id: 'cy_be_pluie',
    icon: '🌦️',
    cat: 'country',
    rating: 0,
    scene: { place: 'park', mood: 'shock', prop: 'sun' },
    when: { country: ['be'], age: [8, 95] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Il pleut à {city} depuis 41 jours. Ce matin, un rayon de soleil traverse les nuages. Les gens sortent des maisons, les yeux plissés, comme des taupes. Un voisin pleure. Un autre appelle la météo pour vérifier.",
        "Alerte : il fait 19 °C et il ne pleut pas. Les terrasses sont prises d'assaut, les Belges sont en short, et quelqu'un a déjà allumé un barbecue {w:at_place}. Tout le monde sait que ça ne durera pas.",
        "La météo annonce « éclaircies passagères ». En Belgique, ça veut dire qu'entre deux averses, tu auras quatre minutes de ciel gris clair. Tu as un parapluie, un K-way et un plan.",
        "Grand soleil sur {city}. C'est tellement rare que le journal télévisé fait une édition spéciale. Un expert explique comment reconnaître le soleil et quoi faire si on en croise un.",
      ],
      en: [
        "It's been raining in {city} for 41 days. This morning a ray of sunshine pierces the clouds. People stumble out of their houses squinting like moles. One neighbor is crying. Another calls the weather service to check.",
        "Alert: it's 66°F and not raining. Terraces are stormed, Belgians are in shorts, and someone's already fired up a barbecue {w:at_place}. Everyone knows it won't last.",
        "The forecast says “brief sunny spells.” In Belgium that means between two downpours you'll get four minutes of light grey sky. You have an umbrella, a rain jacket and a plan.",
        "Bright sunshine over {city}. It's so rare the TV news runs a special edition. An expert explains how to recognize the sun and what to do if you encounter one.",
      ],
    },
    choices: [
      {
        label: { fr: 'Courir en terrasse', en: 'Rush to a terrace' },
        out: [
          { w: 2, text: { fr: ["J'ai trouvé une place en terrasse, commandé un verre et levé le visage vers le ciel. Quatre minutes après, déluge. J'ai fini mon verre sous l'auvent, trempé{|e} et heureux{|se}.", "Terrasse conquise de haute lutte. J'ai attrapé un coup de soleil en vingt minutes : ma peau avait oublié ce que c'était."], en: ["I grabbed a terrace seat, ordered a drink and turned my face to the sky. Four minutes later, deluge. I finished my drink under the awning, soaked and happy.", "Terrace conquered after a fierce battle. I got sunburned in twenty minutes: my skin had forgotten what the sun was."] }, fx: { happy: 7, health: -1 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Garder le parapluie', en: 'Keep the umbrella' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai gardé mon parapluie ouvert en plein soleil. Les gens se sont moqués de moi. À 14 h 03, la grêle est tombée. Je suis le seul à être rentré sec. Je suis un prophète.", "Parapluie ouvert, K-way fermé. On m'a pris{|e} pour un touriste. Puis l'averse est arrivée et tout le monde est venu s'abriter sous mon parapluie. Je fais payer."], en: ["I kept my umbrella open in full sunshine. People laughed. At 2:03 p.m., hail. I was the only one who got home dry. I am a prophet.", "Umbrella open, rain jacket zipped. People thought I was a tourist. Then the shower hit and everyone crowded under my umbrella. I'm charging rent."] }, fx: { happy: 4, smarts: 2 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Prendre une photo', en: 'Take a photo' },
        text: { fr: ["J'ai photographié le soleil pour prouver qu'il existe. Ma photo a fait 4 000 partages sur {w:app}. Les commentaires : « fake », « photoshop », « c'est en Espagne ça ».", "J'ai filmé le ciel bleu pendant dix minutes. C'est maintenant mon fond d'écran, et je le regarde en novembre pour ne pas craquer."], en: ["I photographed the sun to prove it exists. My picture got 4,000 shares on {w:app}. Comments: “fake”, “photoshop”, “that's Spain.”", "I filmed the blue sky for ten minutes. It's now my wallpaper, and I look at it in November so I don't crack."] },
        fx: { happy: 5, followers: 200 },
      },
    ],
  },
  {
    id: 'cy_be_compromis',
    icon: '🏛️',
    cat: 'country',
    rating: 1,
    scene: { place: 'court', mood: 'neutral', prop: 'flag' },
    when: { country: ['be'], age: [25, 85] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Le pays n'a plus de gouvernement depuis [[412|541|589]] jours. Les trains roulent, les impôts tombent, les frites sont bonnes. Un journaliste te demande dans la rue : « Est-ce que le gouvernement vous manque ? » Tu dois réfléchir.",
        "Les négociations pour former un gouvernement s'éternisent. Il y a maintenant neuf ministres de la Santé, sept parlements et un comité chargé de décider de quel côté du rond-point on met le panneau. Ton voisin propose de te présenter.",
        "Ta copropriété de {city} n'arrive pas à décider de la couleur de la façade. Solution typiquement belge : on peint la moitié gauche en jaune, la moitié droite en rouge, et le milieu en beige « pour ne froisser personne ». On te demande ton avis.",
        "Réunion de quartier : faut-il un panneau bilingue, trilingue ou un pictogramme {w:animal} pour indiquer la boulangerie ? Ça dure depuis trois heures. On a déjà formé deux sous-commissions et une cellule de crise.",
      ],
      en: [
        "The country has had no government for [[412|541|589]] days. Trains run, taxes get collected, fries are great. A reporter stops you in the street: “Do you miss having a government?” You have to think about it.",
        "Coalition talks drag on. There are now nine health ministers, seven parliaments and a committee deciding which side of the roundabout the sign goes on. Your neighbor suggests you run.",
        "Your {city} condo board can't agree on the façade color. A typically Belgian solution: paint the left half yellow, the right half red, and the middle beige “so nobody gets offended.” They want your opinion.",
        "Neighborhood meeting: should the bakery sign be bilingual, trilingual or a pictogram of {w:animal}? It's been three hours. Two sub-committees and a crisis unit have already been formed.",
      ],
    },
    choices: [
      {
        label: { fr: 'Proposer un compromis', en: 'Broker a compromise' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai proposé un compromis tellement flou que tout le monde a cru avoir gagné. On m'a surnommé{|e} « le Médiateur ». J'ai reçu une médaille en chocolat et une invitation à une autre réunion.", "Mon compromis : chacun a tort, mais à tour de rôle. Adopté à l'unanimité moins une abstention de principe. Je suis un génie politique belge."], en: ["I proposed a compromise so vague everyone thought they'd won. They nicknamed me “the Mediator.” I got a chocolate medal and an invitation to another meeting.", "My compromise: everyone is wrong, but in turns. Passed unanimously minus one abstention on principle. I am a Belgian political genius."] }, fx: { smarts: 3, karma: 3, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["Mon compromis a fâché tout le monde. Ils se sont réconciliés pour me détester ensemble. Unité nationale retrouvée grâce à moi. De rien."], en: ["My compromise angered everyone. They reconciled just to hate me together. National unity restored thanks to me. You're welcome."] }, fx: { happy: -3, karma: 4 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Fonder un parti', en: 'Found a party' },
        out: [
          { w: 2, text: { fr: ["J'ai fondé le Parti des Frites Pour Tous. Programme : des frites, de la bière, et pas de réunion après 18 h. 4 % des voix. Je suis faiseur de roi dans trois communes.", "J'ai fondé un parti dans un café. On était cinq. Au bout de deux bières, on s'était scindés en deux tendances. Au bout de quatre, on était sept partis."], en: ["I founded the Fries For All Party. Platform: fries, beer, and no meetings after 6 p.m. Four percent of the vote. I'm kingmaker in three towns.", "I founded a party in a café. There were five of us. After two beers we'd split into two factions. After four, we were seven parties."] }, fx: { happy: 6, fame: 3 }, mood: 'party' },
        ],
      },
      {
        label: { fr: "M'en foutre royalement", en: "Couldn't care less" },
        text: { fr: ["J'ai dit au journaliste que je m'en foutais tant que la friterie restait ouverte. Ma réponse est passée au JT. 70 % des gens ont dit qu'ils pensaient pareil.", "J'ai quitté la réunion pour aller boire une trappiste. Quand je suis revenu{|e}, ils votaient encore sur l'ordre du jour de la prochaine réunion."], en: ["I told the reporter I didn't give a damn as long as the fry shack stayed open. My answer aired on the news. Seventy percent of people said they felt the same.", "I left the meeting for a Trappist beer. When I came back, they were still voting on the agenda for the next meeting."] },
        fx: { happy: 4, stress: -3 },
      },
    ],
  },
  {
    id: 'cy_be_bd',
    icon: '💬',
    cat: 'country',
    rating: 1,
    scene: { place: 'park', mood: 'proud', prop: 'spray' },
    when: { country: ['be'], age: [14, 40] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "À {city}, les murs sont couverts de fresques de BD. Il reste un grand pignon tout gris à côté de ta rue. Tu as des feutres, des bombes de peinture et une idée : {w:celeb} en super-héros des frites.",
        "Le festival de BD cherche des jeunes talents. Tu as dessiné une planche où un inspecteur à houppette enquête sur la disparition d'une fricadelle, avec {w:animal} comme acolyte. Le jury est composé de trois dessinateurs barbus.",
        "Tu passes tes nuits à dessiner une BD sur ta vie. Le héros te ressemble, mais en plus beau. Le méchant ressemble à ton prof de maths, mais en plus moche. Un éditeur de {city} veut te rencontrer.",
        "Ta mère a retrouvé ton carnet de croquis. Il y a 200 pages de BD, dont une histoire avec {w:animal} qui devient bourgmestre. Elle dit que c'est « soit du génie, soit inquiétant ».",
      ],
      en: [
        "In {city}, the walls are covered with comic-strip murals. There's one big grey gable left near your street. You've got markers, spray cans and an idea: {w:celeb} as a fry-themed superhero.",
        "The comic festival is looking for young talent. You drew a page where a quiff-haired detective investigates a missing meatball sausage, with {w:animal} as a sidekick. The jury is three bearded cartoonists.",
        "You spend your nights drawing a comic about your life. The hero looks like you, but hotter. The villain looks like your math teacher, but uglier. A {city} publisher wants to meet you.",
        "Your mom found your sketchbook. It has 200 pages of comics, including a story about {w:animal} who becomes mayor. She says it's “either genius or concerning.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Peindre le mur', en: 'Paint the wall' },
        out: [
          { w: 2, text: { fr: ["J'ai peint le pignon en une nuit. Le lendemain, la commune a voulu me mettre une amende, puis l'a classé « patrimoine culturel ». Compromis belge : j'ai payé l'amende et reçu une plaque.", "Ma fresque est devenue un spot à touristes. Des Japonais se font photographier devant tous les jours. Personne ne sait que c'est moi."], en: ["I painted the gable in one night. Next day the city wanted to fine me, then declared it “cultural heritage.” Belgian compromise: I paid the fine and got a plaque.", "My mural became a tourist spot. Tour groups get photographed in front of it daily. Nobody knows it's me."] }, fx: { happy: 9, fame: 3, money: -150 }, mood: 'proud' },
          { w: 1, text: { fr: ["Je suis tombé{|e} de l'échelle au milieu de la fresque. Mon super-héros n'a qu'une jambe et moi, un plâtre. La commune trouve ça « audacieux »."], en: ["I fell off the ladder halfway through. My superhero has one leg and I have a cast. The city calls it “bold.”"] }, fx: { health: -8, disease: 'sprain', happy: 2 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: "Voir l'éditeur", en: 'Meet the publisher' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["L'éditeur a adoré. Tirage : 800 exemplaires. J'en ai vendu 600 à ma famille. Les 200 autres servent à caler des meubles à Liège.", "J'ai signé un contrat pour trois albums. Avance : de quoi payer quatre cornets de frites. Mais je suis officiellement auteur de BD."], en: ["The publisher loved it. Print run: 800 copies. I sold 600 to my family. The other 200 are propping up furniture in Liège.", "I signed for three albums. Advance: enough for four cones of fries. But I'm officially a comic author."] }, fx: { happy: 8, fame: 2, money: 300 }, mood: 'proud' },
          { w: 1, text: { fr: ["L'éditeur a dit que mon style ressemblait « à un enfant de 6 ans qui dessine avec le pied gauche ». Puis il a dit « putain, c'est frais » et m'a proposé un fanzine."], en: ["The publisher said my style looked “like a six-year-old drawing with their left foot.” Then he said “damn, that's fresh” and offered me a zine."] }, fx: { happy: 3, smarts: 1 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Tout brûler', en: 'Burn it all' },
        text: { fr: ["J'ai jeté mes carnets dans la cheminée, comme un artiste maudit. Ma mère les a sauvés, en a scanné trois, et elle les poste sur {w:app} en disant « c'est de mon enfant ».", "J'ai déchiré ma BD par dépit. Deux mois plus tard, j'en ai recommencé une. Elle parle d'un dessinateur qui déchire sa BD. Méta."], en: ["I threw my sketchbooks in the fireplace, tortured-artist style. My mom rescued them, scanned three, and posts them on {w:app} captioned “my kid did this.”", "I tore up my comic out of spite. Two months later I started another one. It's about a cartoonist who tears up his comic. Meta."] },
        fx: { happy: -3, stress: -2 },
      },
    ],
  },
  {
    id: 'cy_be_fois',
    icon: '🤡',
    cat: 'country',
    rating: 1,
    scene: { place: 'party', mood: 'angry', prop: 'beer' },
    when: { country: ['be'], age: [18, 85] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Un Français en vacances à {city} t'aborde au café : « Une fois, savez-vous, hein ? » Il éclate de rire. Il fait la même blague depuis le petit-déjeuner. Il commande « une Stella, une fois ! ».",
        "Ton beau-frère parisien est en visite. Depuis son arrivée, il a dit « une fois » 46 fois, imité l'accent 20 fois et demandé si les Belges savaient compter jusqu'à « septante ». Il reste encore quatre jours.",
        "Soirée avec des collègues français. L'un d'eux raconte une blague belge qu'il trouve hilarante. Elle parle d'un Belge qui achète un frigo pour le mettre dans le désert. Tout le monde te regarde. Il tient encore {w:drink} à la main.",
        "Un touriste français t'arrête dans la rue pour demander où se trouve « le petit garçon qui fait pipi », en riant très fort. Il porte un béret, un t-shirt avec une frite et une odeur d'aftershave {w:at_place}.",
      ],
      en: [
        "A French tourist in {city} corners you at the café: “Une fois, you know, eh?” He bursts out laughing. He's been doing the same joke since breakfast. He orders “a Stella, une fois!”",
        "Your Parisian brother-in-law is visiting. Since he arrived he's said “une fois” 46 times, done the accent 20 times and asked if Belgians can count to “septante.” Four days left.",
        "Drinks with French coworkers. One tells a Belgian joke he finds hilarious. It's about a Belgian who buys a fridge to take into the desert. Everyone looks at you. He's still holding {w:drink}.",
        "A French tourist stops you in the street to ask where “the little peeing boy” is, laughing very loudly. He's wearing a beret, a t-shirt with a fry on it and aftershave you could smell {w:at_place}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Contre-attaquer', en: 'Counterattack' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai sorti l'artillerie : les grèves, les fromages qui puent, et le fait qu'ils disent « quatre-vingt-dix-neuf » comme une équation. Il n'a plus parlé de la soirée. Victoire.", "Je lui ai demandé pourquoi les Français ont inventé « soixante-dix » s'ils ne savent pas compter plus loin que soixante. Il a cherché la réponse pendant trois jours."], en: ["I brought out the artillery: strikes, stinky cheese, and the fact they say ninety-nine as “four-twenty-ten-nine,” like an equation. He didn't speak for the rest of the night. Victory.", "I asked why the French say seventy as “sixty-ten” if they can't count past sixty. He searched for the answer for three days."] }, fx: { happy: 8, smarts: 2 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Lui servir une triple', en: 'Serve him a tripel' },
        out: [
          { w: 2, text: { fr: ["Je lui ai offert une triple à 11 degrés, « comme de la limonade chez nous ». Deux verres plus tard, il pleurait dans mes bras en disant que la Belgique était le plus beau pays du monde.", "Une bière d'abbaye, puis une autre. À la troisième, il a chanté « Brabançonne » de travers sur la table, et c'est lui qui a fini par dire « une fois » avec l'accent. Converti."], en: ["I bought him an 11% tripel, “like lemonade for us.” Two glasses later, he was crying in my arms saying Belgium was the most beautiful country in the world.", "One abbey beer, then another. By the third, he was mangling the national anthem on the table, and saying “une fois” in a perfect accent. Converted."] }, fx: { happy: 9, karma: -1 }, mood: 'party' },
          { w: 1, text: { fr: ["Il a tenu une gorgée et demie, puis il a vomi dans son béret. Il l'a remis sur sa tête par réflexe. Je garde la vidéo pour son mariage."], en: ["He lasted a sip and a half, then puked into his beret. He put it back on his head by reflex. I'm saving the video for his wedding."] }, fx: { happy: 10, karma: -3 }, mood: 'party' },
        ],
      },
      {
        label: { fr: 'Rire poliment', en: 'Laugh politely' },
        text: { fr: ["J'ai ri poliment, comme on rit à une blague d'oncle. Il s'est senti encouragé et en a fait onze autres. J'ai perdu des années de vie.", "J'ai ri jaune, puis vert, puis je suis parti{|e} aux toilettes et je ne suis jamais revenu{|e}. Il m'attend peut-être encore."], en: ["I laughed politely, like at an uncle's joke. He felt encouraged and did eleven more. I lost years of my life.", "I laughed weakly, then went to the bathroom and never came back. He might still be waiting."] },
        fx: { stress: 4, karma: 2 },
      },
    ],
  },
  {
    id: 'cy_be_biere',
    icon: '🍺',
    cat: 'country',
    rating: 2,
    scene: { place: 'party', mood: 'party', prop: 'beer' },
    when: { country: ['be'], age: [18, 75] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Un bar de {city} propose 800 bières. La carte fait la taille d'un annuaire. Chaque bière a son propre verre, et le serveur refuse catégoriquement de servir une Kwak dans un verre à Chimay. « On n'est pas des bêtes. »",
        "Dégustation de trappistes entre amis. La première fait 8 degrés, la deuxième 10, la troisième 12, et la quatrième a été brassée par des moines qui « n'en vendent qu'à ceux qui les méritent ». Tu as mangé {w:food} il y a cinq heures.",
        "Le serveur t'apporte une bière dans un verre en forme de botte, un autre dans un verre à pied en bois, et le dernier dans quelque chose qui ressemble à {w:object}. Il faut tout finir avant la fermeture.",
        "Ton pote flamand t'emmène dans son café préféré, où on boit des lambics « au goût de grange ». Il te promet que ça sent {w:smell} au début, mais qu'on s'habitue « au bout de trois verres ».",
      ],
      en: [
        "A bar in {city} offers 800 beers. The menu is the size of a phone book. Each beer has its own glass, and the waiter flatly refuses to serve a Kwak in a Chimay glass. “We're not animals.”",
        "Trappist tasting with friends. The first is 8%, the second 10%, the third 12%, and the fourth was brewed by monks who “only sell it to those who deserve it.” You ate {w:food} five hours ago.",
        "The waiter brings one beer in a boot-shaped glass, another in a wooden stand, and the last in something resembling {w:object}. Everything must be finished before closing.",
        "Your Flemish buddy takes you to his favorite café, where they serve lambics that “taste like a barn.” He promises it smells like {w:smell} at first but you “get used to it after three glasses.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Toute la carte', en: 'The whole menu' },
        out: [
          { w: 2, text: { fr: ["À la neuvième, j'ai embrassé le serveur sur le crâne. À la onzième, j'ai tenté de faire pipi dans une fontaine, comme Manneken-Pis, mais en moins mignon. La police a appelé ça « un hommage mal compris ».", "J'ai vomi dans le verre de Kwak, celui avec le support en bois. Le serveur l'a pris comme une insulte personnelle à la Belgique. J'ai dû payer le verre, et des excuses."], en: ["By the ninth, I kissed the waiter on the head. By the eleventh, I tried to pee in a fountain like Manneken-Pis, but less cute. The police called it “a misunderstood tribute.”", "I puked into the Kwak glass, the one with the wooden stand. The waiter took it as a personal insult to Belgium. I had to pay for the glass, plus an apology."] }, fx: { happy: 9, health: -8, addiction: ['alcohol', 8], karma: -2, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: ["Je me suis réveillé{|e} dans un champ de houblon près de Poperinge, avec un verre à Duvel dans la main et aucun souvenir des trois dernières provinces. Un tracteur m'a ramené{|e}.", "J'ai fini allongé{|e} sous la table, en chantant une chanson flamande que je ne connais pas. Les habitués m'ont mis une couverture et un verre d'eau. Les Belges sont des gens bien."], en: ["I woke up in a hop field near Poperinge holding a Duvel glass, with no memory of the last three provinces. A tractor brought me home.", "I ended up lying under the table singing a Flemish song I don't know. The regulars gave me a blanket and a glass of water. Belgians are good people."] }, fx: { happy: 6, health: -6, addiction: ['alcohol', 6] }, mood: 'sleepy' },
        ],
      },
      {
        label: { fr: 'Commander une pils', en: 'Order a lager' },
        out: [
          { w: 1, text: { fr: ["J'ai commandé une pils banale. Le serveur a soupiré si fort que la mousse de toutes les bières du bar est retombée. Mes potes ont fait semblant de ne pas me connaître.", "Une pils. Le serveur m'a servi dans un verre en plastique avec une paille, « pour aller avec ton niveau ». J'ai tout bu, en silence, humilié{|e}."], en: ["I ordered a basic lager. The waiter sighed so hard every beer in the bar lost its head. My friends pretended not to know me.", "A lager. The waiter served it in a plastic cup with a straw, “to match your level.” I drank it all, in silence, humiliated."] }, fx: { happy: -2, health: 1 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Défier le moine', en: 'Challenge the monk beer' },
        out: [
          { w: 1, odds: { health: 1 }, text: { fr: ["La bière des moines était si bonne que j'ai pleuré. Littéralement. Une larme de malt. J'ai compris le sens de la vie, puis je l'ai oublié en rentrant.", "J'ai bu la bière légendaire. Elle avait un goût de caramel, de pain et de victoire. Le patron m'a serré la main : « Tu es digne. »"], en: ["The monk beer was so good I cried. Literally. A single tear of malt. I understood the meaning of life, then forgot it on the way home.", "I drank the legendary beer. It tasted of caramel, bread and victory. The owner shook my hand: “You are worthy.”"] }, fx: { happy: 10, addiction: ['alcohol', 3] }, mood: 'happy' },
          { w: 1, text: { fr: ["La quatrième trappiste m'a attaqué par derrière. J'ai fait un câlin à un lampadaire pendant une heure en lui racontant mon enfance. Il a été très à l'écoute."], en: ["The fourth Trappist ambushed me. I hugged a lamppost for an hour, telling it about my childhood. It was a great listener."] }, fx: { happy: 5, health: -5, stress: -4 }, mood: 'sleepy' },
        ],
      },
    ],
  },
  {
    id: 'cy_be_doudou',
    icon: '🐉',
    cat: 'country',
    rating: 2,
    scene: { place: 'park', mood: 'party', prop: 'dragon', fx: 'gore' },
    when: { country: ['be'], age: [16, 70] },
    weight: 6,
    cooldown: 4,
    text: {
      fr: [
        "Ducasse de Mons, le Doudou ! Saint Georges combat le dragon sur la Grand-Place, et la foule se bat pour arracher les crins de la queue du dragon : ça porte bonheur toute l'année. Il y a 20 000 personnes, de la bière partout, et des coudes.",
        "Le Lumeçon commence. Les « hommes blancs » protègent la queue du dragon. Toi, tu as bu quatre bières, mangé {w:food}, et un inconnu en sueur t'a juré que c'était « maintenant ou jamais » pour attraper un crin.",
        "Carnaval de Binche. Des Gilles en sabots et chapeaux de plumes d'autruche lancent des oranges dans la foule. Fort. Très fort. Certaines vitrines sont protégées par des grillages. Tu es en première ligne, la bouche ouverte.",
        "Tu es dans la foule du Doudou, collé{|e} contre un monsieur qui sent {w:smell}. Le dragon passe tout près. Sa queue fouette l'air au-dessus de ta tête. Le crin est à portée de main.",
      ],
      en: [
        "The Doudou festival in Mons! Saint George fights the dragon on the main square, and the crowd fights to rip hairs from the dragon's tail: it brings luck all year. There are 20,000 people, beer everywhere, and elbows.",
        "The Lumeçon begins. The “men in white” guard the dragon's tail. You've had four beers, eaten {w:food}, and a sweaty stranger swore it's “now or never” to grab a hair.",
        "Binche carnival. Gilles in clogs and ostrich-feather hats are throwing oranges into the crowd. Hard. Very hard. Some shop windows are protected with wire mesh. You're in the front row, mouth open.",
        "You're in the Doudou crowd, squeezed against a man who gives off {w:smell}. The dragon passes close. Its tail whips the air above your head. A tail hair is within reach.",
      ],
    },
    choices: [
      {
        label: { fr: 'Plonger sur la queue', en: 'Dive for the tail' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai plongé, attrapé un crin, et reçu dix-sept coudes dans les côtes. J'ai craché une dent dans la foule, mais j'ai mon crin. Un an de chance pour une molaire, c'est un bon deal.", "J'ai arraché une poignée de crins avec un bout de ruban. La foule m'a porté{|e} en triomphe, puis lâché{|e} sur les pavés. Je saigne, mais je suis béni{|e}."], en: ["I dove, grabbed a hair, and took seventeen elbows to the ribs. I spat a tooth into the crowd, but I got my hair. A year of luck for one molar: good deal.", "I tore off a fistful of hair with a scrap of ribbon. The crowd carried me in triumph, then dropped me on the cobblestones. I'm bleeding, but blessed."] }, fx: { happy: 10, health: -7, visual: 'gore' }, mood: 'party' },
          { w: 1, text: { fr: ["Un homme blanc m'a balayé{|e} d'un coup de bâton dans les tibias. Je me suis réveillé{|e} sur une civière, avec une orange de Binche coincée dans l'oreille. Mauvais festival.", "J'ai raté la queue et chopé une perruque. C'était celle d'une dame. Elle m'a poursuivi{|e} jusqu'à la gare en hurlant en wallon."], en: ["A man in white swept my legs with a stick. I woke up on a stretcher with a Binche orange stuck in my ear. Wrong festival.", "I missed the tail and grabbed a wig. It belonged to a lady. She chased me to the train station screaming in Walloon."] }, fx: { health: -10, happy: -2, visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Attraper une orange', en: 'Catch an orange' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: ["J'ai attrapé une orange à une main. Un Gille m'a fait un clin d'œil sous ses plumes. Je ne la mangerai jamais, elle est sur ma cheminée et elle pourrit doucement.", "Orange attrapée au vol, et une deuxième pour ma voisine. Les gens m'ont applaudi{|e}. Ma main est rouge, mais mon cœur aussi."], en: ["I caught an orange one-handed. A Gille winked at me under his feathers. I'll never eat it; it's on my mantelpiece, slowly rotting.", "Caught an orange mid-air, and a second for the lady next to me. People clapped. My hand is red, but so is my heart."] }, fx: { happy: 7, athletic: 1 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai pris l'orange en pleine bouche. Elle a explosé. Deux dents ont suivi. J'ai bu ma bière avec une paille pour le reste du carnaval, en souriant comme un pirate."], en: ["I took the orange straight in the mouth. It exploded. Two teeth followed. I drank my beer through a straw for the rest of the carnival, grinning like a pirate."] }, fx: { health: -8, looks: -3, happy: 3, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Rester au bar', en: 'Stay at the bar' },
        text: { fr: ["Je suis resté{|e} en terrasse à regarder le chaos de loin, une bière à la main. Un crin de dragon est tombé dans mon verre par pur hasard. La chance vient à ceux qui attendent.", "Bar, bière, frites. J'ai vu un type se faire piétiner pour un crin. Je l'ai applaudi. C'est ma façon de participer."], en: ["I stayed on the terrace watching the chaos from afar, beer in hand. A dragon hair fell into my glass by pure chance. Luck comes to those who wait.", "Bar, beer, fries. I watched a guy get trampled for a tail hair. I applauded him. That's how I participate."] },
        fx: { happy: 5, addiction: ['alcohol', 2] },
      },
    ],
  },
  {
    id: 'cy_be_chocolat',
    icon: '🍫',
    cat: 'country',
    rating: 2,
    scene: { place: 'office', mood: 'happy', prop: 'chocolate' },
    when: { country: ['be'], age: [18, 70] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Tu décroches un job d'été dans une chocolaterie artisanale de {city}. Le maître chocolatier te présente la cuve de praliné : quatre tonnes de pur bonheur qui tournent lentement. « Règle numéro un : on ne goûte pas. » Il s'en va.",
        "Visite guidée d'une usine de chocolat. Le guide te met en garde contre la passerelle au-dessus de la cuve. Tu es au premier rang, et tu as faim depuis {w:time}.",
        "Concours de pralines à {city} : tu es juré{|e}. Il y a 140 pralines à goûter en trois heures. La première est fourrée au spéculoos. La deuxième, au gin. La troisième, tu ne veux pas savoir. Tu as encore {w:food} sur l'estomac.",
        "Le chocolatier du coin te propose un « stage de découverte ». Tu portes une charlotte, une blouse blanche, et une odeur de cacao te colle à la peau. Ton pantalon commence déjà à serrer.",
      ],
      en: [
        "You land a summer job at an artisan chocolate maker in {city}. The master chocolatier shows you the praline vat: four tons of pure joy slowly churning. “Rule number one: no tasting.” He leaves.",
        "Guided tour of a chocolate factory. The guide warns you about the catwalk above the vat. You're in the front row, and you've been hungry since {w:time}.",
        "Praline contest in {city}: you're a judge. There are 140 pralines to taste in three hours. The first has a speculoos filling. The second, gin. The third, you don't want to know. You still have {w:food} sitting in your stomach.",
        "The local chocolatier offers you a “discovery internship.” You wear a hairnet, a white coat, and cocoa smell sticks to your skin. Your pants are already getting tight.",
      ],
    },
    choices: [
      {
        label: { fr: 'Goûter la cuve', en: 'Taste the vat' },
        out: [
          { w: 3, text: { fr: ["J'ai plongé un doigt, puis la main, puis le bras jusqu'au coude. Le chocolatier m'a surpris{|e} le visage entier dans le praliné. Viré{|e}, mais avec trois kilos en plus et zéro regret.", "Une cuillère, puis dix. J'ai mangé tellement de praliné que j'ai eu des sueurs au chocolat. Mes draps sentent le Mon Chéri. Mon foie a envoyé un courrier recommandé."], en: ["I dipped a finger, then a hand, then my arm to the elbow. The chocolatier caught me face-first in the praline. Fired, but six pounds heavier and zero regrets.", "One spoon, then ten. I ate so much praline I got chocolate sweats. My sheets smell like bonbons. My liver sent a formal complaint."] }, fx: { happy: 9, weight: 0.04, fired: true }, mood: 'happy' },
          { w: 1, text: { fr: ["Je me suis penché{|e} trop loin. Plouf. Quatre tonnes de praliné. J'ai coulé lentement, en souriant. On a retrouvé mon corps sous forme de praline géante, qui a été vendue par erreur au marché de Noël.", "J'ai glissé sur la passerelle et je suis tombé{|e} dans la cuve. Le mélangeur m'a transformé{|e} en ganache. Mes funérailles sentaient délicieusement bon."], en: ["I leaned too far. Splash. Four tons of praline. I sank slowly, smiling. My body was found as a giant praline, mistakenly sold at the Christmas market.", "I slipped off the catwalk into the vat. The mixer turned me into ganache. My funeral smelled delicious."] }, fx: { die: { fr: 'noyé{|e} dans quatre tonnes de praliné', en: 'drowned in four tons of praline' }, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Rester professionnel{|le}', en: 'Stay professional' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["Je n'ai rien goûté. Pas une miette. Le chocolatier m'a promu{|e} « apprenti officiel ». Le soir, chez moi, j'ai mangé une tablette de supermarché en pleurant de frustration.", "J'ai résisté trois heures, puis j'ai léché la spatule en cachette dans les toilettes. Personne n'a rien vu. Je me sens sale et heureux{|se}."], en: ["I tasted nothing. Not a crumb. The chocolatier promoted me to “official apprentice.” At home, I ate a supermarket bar, crying with frustration.", "I resisted for three hours, then secretly licked the spatula in the bathroom. Nobody saw. I feel dirty and happy."] }, fx: { discipline: 4, happy: 2, money: 400 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Inventer une praline', en: 'Invent a praline' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai inventé la praline frites-mayo. Le chocolatier a hurlé. Puis il a goûté. Puis il en a fait sa spécialité de Noël. Je n'ai touché aucun droit d'auteur.", "Ma praline au spéculoos et à la bière brune a gagné un prix local. Ma photo est dans la vitrine, à côté d'une praline en forme de ma tête."], en: ["I invented the fries-and-mayo praline. The chocolatier screamed. Then tasted it. Then made it his Christmas special. I got zero royalties.", "My speculoos-and-dark-beer praline won a local award. My photo is in the window, next to a praline shaped like my head."] }, fx: { happy: 8, fame: 2, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["Ma praline au fromage de Herve a été goûtée par une inspectrice d'hygiène. Elle a vomi dans son sac. La boutique a fermé une semaine. Ça sentait l'œuf pourri jusqu'à la gare."], en: ["My Herve-cheese praline was tasted by a health inspector. She puked into her handbag. The shop closed for a week. It smelled of rotten eggs all the way to the station."] }, fx: { happy: -4, karma: -2, visual: 'poop' }, mood: 'shock' },
        ],
      },
    ],
  },
  // ═════════════════════════════ ÉTATS-UNIS ═════════════════════════════
  {
    id: 'cy_us_tipping',
    icon: '💳',
    cat: 'country',
    rating: 0,
    scene: { place: 'office', mood: 'shock', prop: 'tablet' },
    when: { country: ['us'], age: [18, 85] },
    vars: { amount: [3, 9] },
    weight: 9,
    cooldown: 3,
    text: {
      fr: [
        "Tu achètes une bouteille d'eau à {$amount} dans un café de {city}. La caissière retourne la tablette vers toi : « Pourboire ? 20 %, 25 %, 30 % ». Elle a juste tendu la bouteille. Elle te regarde droit dans les yeux.",
        "Borne de commande en libre-service : tu as tout fait toi-même. L'écran te propose quand même un pourboire de 22 %, 28 % ou 35 %. Il n'y a personne derrière la borne. Juste {w:animal} qui te fixe à travers la vitrine.",
        "Ton café coûte {$amount}. Le terminal te demande un pourboire « pour l'équipe », un autre « pour la planète », et un troisième pour {w:celeb}. Une file de douze personnes attend derrière toi.",
        "Le livreur a laissé ta commande {w:at_place} au lieu de chez toi. L'application te demande quand même de noter « l'expérience » et de laisser un pourboire. Le bouton « 0 % » est minuscule et gris.",
      ],
      en: [
        "You buy a {$amount} bottle of water at a café in {city}. The cashier swivels the tablet toward you: “Tip? 20%, 25%, 30%.” She just handed you a bottle. She's looking you dead in the eye.",
        "Self-service kiosk: you did everything yourself. The screen still suggests a tip of 22%, 28% or 35%. There's nobody behind the kiosk. Just {w:animal} staring at you through the window.",
        "Your coffee costs {$amount}. The terminal asks for a tip “for the team,” another “for the planet,” and a third for {w:celeb}. Twelve people are waiting behind you.",
        "The delivery guy left your order {w:at_place} instead of at your place. The app still asks you to rate “the experience” and leave a tip. The “0%” button is tiny and grey.",
      ],
    },
    choices: [
      {
        label: { fr: 'Appuyer sur 0 %', en: 'Press 0%' },
        out: [
          { w: 2, text: { fr: ["J'ai appuyé sur « Pas de pourboire ». La tablette a émis un bruit de déception. La caissière a soupiré. Toute la file m'a jugé{|e}. J'ai bu mon eau dans la honte.", "Zéro pour cent. La caissière a dit « Have a blessed day » avec une voix qui voulait dire exactement le contraire. Je ne remettrai jamais les pieds ici."], en: ["I pressed “No tip.” The tablet made a disappointed sound. The cashier sighed. The entire line judged me. I drank my water in shame.", "Zero percent. The cashier said “Have a blessed day” in a voice that meant the exact opposite. I'll never set foot here again."] }, fx: { stress: 4, karma: -2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Payer 30 %', en: 'Tip 30%' },
        out: [
          { w: 2, text: { fr: ["J'ai mis 30 % sur une bouteille d'eau. Personne ne m'a remercié{|e}. J'ai fait mes comptes : à ce rythme, je donnerai plus en pourboires qu'en loyer d'ici mars.", "30 %. La caissière a souri, une fois. Je me suis senti{|e} bon{|ne}, puis pauvre, puis manipulé{|e} par une tablette. Le capitalisme est un long tunnel."], en: ["I tipped 30% on a bottle of water. Nobody thanked me. Did the math: at this rate I'll spend more on tips than rent by March.", "30%. The cashier smiled, once. I felt good, then poor, then manipulated by a tablet. Capitalism is a long tunnel."] }, fx: { money: -15, karma: 3, happy: 1 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Pourboire personnalisé', en: 'Custom tip' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["Pourboire personnalisé : 1 centime, avec le message « Pour ton avenir ». La caissière a éclaté de rire. On est amis sur {w:app} maintenant.", "J'ai mis un pourboire de 3,14 $, « pour la culture ». Le gérant l'a affiché au mur. Je suis la légende du café."], en: ["Custom tip: one cent, with the message “For your future.” The cashier burst out laughing. We're friends on {w:app} now.", "I tipped $3.14, “for culture.” The manager pinned it to the wall. I'm a café legend."] }, fx: { happy: 5 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai voulu taper 2 % et j'ai tapé 200 %. La transaction est passée. La caissière m'a fait un câlin. Mon banquier, beaucoup moins."], en: ["I meant to type 2% and typed 200%. It went through. The cashier hugged me. My banker, much less so."] }, fx: { money: -25, karma: 4, happy: -2 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'cy_us_roadtrip',
    icon: '🚐',
    cat: 'country',
    rating: 0,
    scene: { place: 'park', mood: 'happy', prop: 'rv' },
    when: { country: ['us'], age: [55, 85] },
    weight: 7,
    cooldown: 6,
    text: {
      fr: [
        "Retraite oblige, tu pars en camping-car sur la Route 66. Au programme : la plus grosse pelote de ficelle du monde, la plus grande poêle à frire du monde, et un motel où le néon dit « VAC NCY ».",
        "Road trip vers le Grand Canyon. Ton camping-car fait la taille d'un pavillon de banlieue et consomme comme une centrale électrique. Ton GPS vient de t'envoyer sur une piste en terre {w:weather}.",
        "Tu traverses le Nevada en camping-car. Il n'y a rien sur 200 kilomètres, puis un panneau : « Dernière station avant l'enfer, hot-dogs à 99 cents ». Le pompiste ressemble à {w:celeb}.",
        "Ton club de retraités organise un road trip de six semaines. Le convoi compte quatorze camping-cars, un chihuahua par véhicule, et un GPS par personne, qui donnent tous des itinéraires différents. Départ de {city}.",
      ],
      en: [
        "Retired life: you hit Route 66 in an RV. On the menu: the world's largest ball of twine, the world's largest frying pan, and a motel whose neon sign reads “VAC NCY.”",
        "Road trip to the Grand Canyon. Your RV is the size of a suburban house and drinks fuel like a power plant. Your GPS just sent you down a dirt road {w:weather}.",
        "You're crossing Nevada by RV. Nothing for 120 miles, then a sign: “Last Gas Before Hell, 99-cent hot dogs.” The attendant looks like {w:celeb}.",
        "Your retirees' club is organizing a six-week road trip. The convoy has fourteen RVs, one chihuahua per vehicle, and one GPS per person, all giving different directions. Departure: {city}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Voir toutes les attractions', en: 'See every roadside attraction' },
        out: [
          { w: 2, text: { fr: ["J'ai vu la plus grosse pelote de ficelle, le plus gros cactus en béton et un dinosaure qui vend des assurances. J'ai acheté onze magnets. Ma voiture ressemble à un frigo.", "J'ai photographié la plus grande chaise du monde. Puis le plus grand clou. Puis {w:object} géant, à moins que ce soit juste une sculpture ratée. Meilleures vacances de ma vie."], en: ["I saw the largest ball of twine, the largest concrete cactus and a dinosaur that sells insurance. I bought eleven fridge magnets. My RV looks like a fridge.", "I photographed the world's largest chair. Then the largest nail. Then what was either a giant version of {w:object} or just a failed sculpture. Best vacation of my life."] }, fx: { happy: 10, stress: -5, money: -300 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Prendre un raccourci', en: 'Take a shortcut' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["Le raccourci m'a mené{|e} à un diner perdu où on sert des pancakes de la taille d'un enjoliveur. Le patron m'a raconté sa vie pendant trois heures. Il a vu un OVNI, deux fois.", "Raccourci réussi : j'ai gagné vingt minutes, vu un coyote et découvert une ville fantôme. J'y ai laissé mon nom dans le livre d'or. Je suis le premier visiteur depuis 1983."], en: ["The shortcut led to a lost diner serving hubcap-sized pancakes. The owner told me his life story for three hours. He's seen a UFO, twice.", "Shortcut worked: saved twenty minutes, saw a coyote and found a ghost town. I signed its guestbook. First visitor since 1983."] }, fx: { happy: 8, smarts: 1 }, mood: 'happy' },
          { w: 1, text: { fr: ["Le camping-car s'est ensablé dans le désert. On a attendu six heures. Un shérif est arrivé, a ri pendant dix minutes, puis nous a tractés avec un pick-up et un chapeau."], en: ["The RV got stuck in the desert sand. We waited six hours. A sheriff showed up, laughed for ten minutes, then towed us out with a pickup and a hat."] }, fx: { stress: 8, health: -2, money: -200 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Rester au motel', en: 'Stay at the motel' },
        text: { fr: ["J'ai passé trois jours au motel VAC NCY. La piscine avait une couleur de soupe aux pois, la télé captait une seule chaîne de télé-achat. J'ai acheté un couteau qui coupe les chaussures.", "Motel en bord de route. Le réceptionniste m'a donné la clé de la chambre 13 en évitant mon regard. Rien ne s'est passé. C'est presque décevant."], en: ["Three days at the VAC NCY motel. The pool was pea-soup green and the TV got one home-shopping channel. I bought a knife that cuts through shoes.", "Roadside motel. The receptionist handed me the key to room 13 without meeting my eyes. Nothing happened. Almost disappointing."] },
        fx: { happy: 3, stress: -3 },
      },
    ],
  },
  {
    id: 'cy_us_football',
    icon: '🏈',
    cat: 'country',
    rating: 0,
    scene: { place: 'stadium', mood: 'angry', prop: 'football' },
    when: { country: ['us'], age: [8, 17] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Sélections pour l'équipe de football américain de {school}. Le coach a un sifflet, une casquette et une veine sur le front qui pulse en rythme. Il hurle « HUSTLE » à chaque phrase, même pour dire bonjour.",
        "Le vendredi soir, à {city}, toute la ville vient voir le match du lycée. Le stade est plus grand que la mairie. Les pom-pom girls ont un budget plus gros que la bibliothèque. Le coach veut te tester comme receveur.",
        "Ton père rêve que tu deviennes quarterback. Il a acheté un maillot à ton nom, un casque, et il crie depuis les tribunes avec {w:object} dans la main. Tu préférerais {w:activity}.",
        "Le coach te place en défense contre un élève de ton âge qui pèse 110 kilos et qui a déjà une barbe. On dit qu'il a mangé {w:food} au petit déjeuner. Avec l'emballage.",
      ],
      en: [
        "Tryouts for the {school} football team. The coach has a whistle, a cap and a forehead vein that pulses rhythmically. He yells “HUSTLE” in every sentence, including hello.",
        "Friday night in {city}: the whole town comes to watch the school game. The stadium is bigger than city hall. The cheer squad has a bigger budget than the library. The coach wants to try you as receiver.",
        "Your dad dreams of you becoming quarterback. He bought a jersey with your name, a helmet, and he yells from the stands holding {w:object}. You'd rather be {w:activity}.",
        "The coach puts you on defense against a kid your age who weighs 240 pounds and already has a beard. Rumor says he ate {w:food} for breakfast. Wrapper included.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout donner', en: 'Give it everything' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai attrapé une passe impossible en plongeant. Le coach a crié « THAT'S WHAT I'M TALKING ABOUT » pendant deux minutes. Je suis dans l'équipe. Mon père pleure dans sa casquette.", "J'ai couru si vite que le coach m'a demandé si je me dopais. J'ai répondu « aux céréales ». Il a noté ça. Je suis titulaire."], en: ["I caught an impossible pass in a dive. The coach yelled “THAT'S WHAT I'M TALKING ABOUT” for two minutes. I made the team. Dad is crying into his cap.", "I ran so fast the coach asked if I was doping. I said “cereal.” He wrote that down. I'm a starter."] }, fx: { happy: 9, athletic: 4, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["Le géant barbu m'a plaqué{|e}. J'ai fait trois saltos arrière et atterri dans le stand de hot-dogs. J'ai vu des étoiles et un hot-dog. Commotion légère."], en: ["The bearded giant tackled me. I did three backflips and landed in the hot dog stand. I saw stars and a hot dog. Mild concussion."] }, fx: { health: -8, disease: 'concussion', happy: -2 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Devenir mascotte', en: 'Become the mascot' },
        out: [
          { w: 2, text: { fr: ["Je suis devenu{|e} la mascotte : un costume de blaireau géant qui sent la sueur de six générations. La foule m'adore. Personne ne sait qui est dedans. C'est parfait.", "En mascotte, j'ai fait un salto et perdu la tête du costume en plein match. Silence total. Puis ovation. Le lendemain, j'étais en une du journal local."], en: ["I became the mascot: a giant badger suit that smells of six generations of sweat. The crowd loves me. Nobody knows who's inside. Perfect.", "As the mascot, I did a flip and lost the costume head mid-game. Total silence. Then a standing ovation. Next day I was on the front page of the local paper."] }, fx: { happy: 7, fame: 2 }, mood: 'party' },
        ],
      },
      {
        label: { fr: 'Faire semblant de boiter', en: 'Fake a limp' },
        text: { fr: ["J'ai simulé une blessure au genou pendant l'échauffement. Le coach m'a envoyé{|e} à l'infirmerie, qui m'a envoyé{|e} en club d'échecs. J'y suis très heureux{|se}.", "J'ai boité de manière très convaincante. Trop : on m'a mis{|e} sur une civière, emmené{|e} sous les applaudissements. Mon père croit que je suis un héros blessé."], en: ["I faked a knee injury during warm-ups. The coach sent me to the nurse, who sent me to chess club. I'm very happy there.", "I limped very convincingly. Too convincingly: they stretchered me off to applause. Dad thinks I'm a wounded hero."] },
        fx: { happy: 4, athletic: -1, karma: -1 },
      },
    ],
  },
  {
    id: 'cy_us_er_bill',
    icon: '🧾',
    cat: 'country',
    rating: 1,
    scene: { place: 'hospital', mood: 'shock', prop: 'bill', fx: 'money' },
    when: { country: ['us'], age: [18, 85] },
    vars: { amount: [3500, 22000] },
    weight: 7,
    once: true,
    text: {
      fr: [
        "Tu t'es tordu la cheville en descendant d'un trottoir à {city}. Ambulance, radio, aspirine, attelle. La facture arrive : {$amount}. Dont 38 $ pour « une poignée de main de l'infirmière » et 112 $ pour « présence d'une fenêtre ».",
        "Petit passage aux urgences pour une coupure au doigt. Douze minutes, trois points de suture, un pansement à licornes. Facture : {$amount}. Ton assurance couvre « l'émotion, mais pas les soins ».",
        "Tu t'es évanoui{|e} au supermarché à cause de la clim. Tu t'es réveillé{|e} dans une ambulance en criant « Pas d'ambulance, j'ai pas les moyens ! ». Trop tard. Facture : {$amount}.",
        "Ton assurance santé vient de refuser ta prise en charge {w:excuse}. Montant à régler : {$amount}. Une ligne indique « Frais de facturation de la facture : 45 $ ».",
      ],
      en: [
        "You twisted your ankle stepping off a curb in {city}. Ambulance, X-ray, aspirin, splint. The bill arrives: {$amount}. Including $38 for “nurse handshake” and $112 for “presence of a window.”",
        "Quick ER visit for a cut finger. Twelve minutes, three stitches, a cartoon band-aid. Bill: {$amount}. Your insurance covers “emotional support, not care.”",
        "You fainted at the supermarket because of the AC. You woke up in an ambulance screaming “No ambulance, I can't afford it!” Too late. Bill: {$amount}.",
        "Your health insurer just denied your claim {w:excuse}. Amount due: {$amount}. One line reads “Bill-billing fee: $45.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Payer, en pleurant', en: 'Pay, crying' },
        out: [
          { w: 2, text: { fr: ["J'ai payé {$amount}. Ma carte de crédit a émis un petit cri. J'ai vendu ma console, mon vélo et un rein symbolique. Ma cheville va mieux, mon compte en banque est en soins intensifs.", "J'ai réglé la facture en 36 mensualités. Je finirai de payer ma cheville en même temps que mon prêt étudiant, vers 2061."], en: ["I paid {$amount}. My credit card let out a little scream. I sold my console, my bike and a metaphorical kidney. My ankle is better; my bank account is in intensive care.", "I set up 36 monthly payments. I'll finish paying off my ankle around the same time as my student loans, circa 2061."] }, fx: { money: '-amount', stress: 10, happy: -6, visual: 'money' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Lancer une cagnotte', en: 'Start a GoFundMe' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["Cagnotte en ligne : « Aidez-moi à payer ma cheville ». 400 inconnus m'ont donné de l'argent. Un milliardaire a mis 5 $. J'ai tout payé et je crois de nouveau en l'humanité. Pas au système.", "Ma cagnotte est devenue virale grâce à une photo de ma cheville avec un petit chapeau. J'ai récolté assez pour la facture et des béquilles en carbone."], en: ["Online fundraiser: “Help me pay for my ankle.” 400 strangers chipped in. A billionaire gave $5. I paid it off and believe in humanity again. Not in the system.", "My fundraiser went viral thanks to a photo of my ankle wearing a tiny hat. I raised enough for the bill and carbon-fiber crutches."] }, fx: { happy: 6, fame: 2, karma: 2 }, mood: 'happy' },
          { w: 1, text: { fr: ["Ma cagnotte a récolté 27 $, dont 20 de ma mère et 7 d'un bot. J'ai payé ce que j'ai pu. Le reste est parti au recouvrement. Ils ont l'air sympas, au téléphone."], en: ["My fundraiser raised $27: $20 from my mom and $7 from a bot. I paid what I could. The rest went to collections. They sound nice on the phone."] }, fx: { happy: -4, stress: 6, schedule: { key: 'cy_us_collector', years: 1 } }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Ignorer la facture', en: 'Ignore the bill' },
        text: { fr: ["J'ai rangé la facture sous l'aimant du frigo, puis sous le frigo. Le problème a disparu de ma vue. Pas de mon dossier de crédit.", "J'ai répondu à l'hôpital « nouveau téléphone, qui est-ce ? ». J'ai bloqué leur numéro. Ils ont d'autres numéros. Beaucoup d'autres."], en: ["I put the bill under the fridge magnet, then under the fridge. The problem left my sight. Not my credit report.", "I replied to the hospital “new phone, who dis?” and blocked their number. They have other numbers. Many others."] },
        fx: { stress: -2, happy: 2, schedule: { key: 'cy_us_collector', years: 1 } },
      },
    ],
  },
  {
    id: 'cy_us_collector',
    icon: '📞',
    cat: 'country',
    rating: 2,
    chainOnly: true,
    scene: { place: 'home', mood: 'angry', prop: 'phone', fx: 'money' },
    when: { country: ['us'], age: [18, 90] },
    vars: { amount: [800, 6000] },
    text: {
      fr: [
        "Un recouvreur de dettes nommé Chad t'appelle pour la 41e fois cette semaine. Il connaît ton prénom, ton adresse, ton groupe sanguin et le nom de ton premier animal. Il veut {$amount} « tout de suite, mon pote ».",
        "Chad, du recouvrement, s'est garé devant chez toi. Il a une thermos, des sandwichs et une patience infinie. Il agite une banderole « TU ME DOIS {$amount} » chaque fois que tu passes devant la fenêtre.",
        "La vieille facture d'hôpital est revenue, majorée. Chad, le recouvreur, t'appelle même {w:time}. Il te propose « une solution créative » pour régler {$amount}.",
        "Chad a laissé un message sur ton répondeur : il chante {w:song} avec les paroles modifiées pour parler de ta dette de {$amount}. C'est presque beau. C'est surtout terrifiant.",
      ],
      en: [
        "A debt collector named Chad is calling you for the 41st time this week. He knows your name, address, blood type and your first pet's name. He wants {$amount} “right now, buddy.”",
        "Chad from collections has parked outside your house. He has a thermos, sandwiches and infinite patience. He waves a banner reading “YOU OWE ME {$amount}” whenever you pass the window.",
        "The old hospital bill is back, with interest. Chad the collector calls you even {w:time}. He's offering a “creative solution” to settle {$amount}.",
        "Chad left a voicemail: he's singing {w:song} with the lyrics rewritten about your {$amount} debt. It's almost beautiful. Mostly terrifying.",
      ],
    },
    choices: [
      {
        label: { fr: 'Écouter sa solution', en: 'Hear his solution' },
        out: [
          { w: 2, text: { fr: ["La « solution créative » de Chad : un rein. « T'en as deux, mon pote. » J'ai refusé. Il m'a proposé un bout de foie à la place. On a négocié une dent de sagesse. Elle était déjà cariée.", "Chad m'a proposé d'effacer la dette si je participais à un essai clinique. Depuis, je vois les couleurs en musique et un de mes orteils est devenu vert. Dette effacée."], en: ["Chad's “creative solution”: a kidney. “You've got two, buddy.” I refused. He offered to take part of my liver instead. We settled on a wisdom tooth. It already had a cavity.", "Chad offered to wipe the debt if I joined a clinical trial. Now I hear colors and one of my toes turned green. Debt cleared."] }, fx: { health: -8, stress: -4, visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Payer Chad', en: 'Pay Chad' },
        out: [
          { w: 1, text: { fr: ["J'ai payé {$amount}. Chad a eu l'air sincèrement triste : « Tu vas me manquer, mon pote. » Il m'envoie encore des cartes à Noël. Avec des intérêts.", "J'ai payé la dette en pièces de 1 cent, livrées dans une brouette. Chad a mis quatre heures à compter. On est quittes, et on se déteste."], en: ["I paid {$amount}. Chad looked genuinely sad: “I'll miss you, buddy.” He still sends me Christmas cards. With interest.", "I paid the debt in pennies, delivered by wheelbarrow. Chad took four hours counting. We're square, and we hate each other."] }, fx: { money: '-amount', stress: -8, visual: 'money' }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Fuir au Canada', en: 'Flee to Canada' },
        out: [
          { w: 1, text: { fr: ["J'ai roulé jusqu'à la frontière canadienne en pleine nuit. Le douanier m'a demandé « motif du séjour ? ». J'ai dit « Chad ». Il a hoché la tête, compréhensif, et m'a donné un sirop d'érable.", "Je me suis enfui{|e} au Canada pour un week-end. Chad m'y attendait, avec deux cafés. « Je suis aussi recouvreur ici, mon pote. »"], en: ["I drove to the Canadian border in the middle of the night. The officer asked, “Purpose of visit?” I said “Chad.” He nodded in understanding and handed me maple syrup.", "I fled to Canada for a weekend. Chad was waiting there with two coffees. “I collect here too, buddy.”"] }, fx: { happy: 4, stress: 4, money: -300 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'cy_us_hoa',
    icon: '🦩',
    cat: 'country',
    rating: 1,
    scene: { place: 'home', mood: 'angry', prop: 'lawn' },
    when: { country: ['us'], age: [25, 85] },
    vars: { amount: [150, 900] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "L'association des propriétaires de ton lotissement t'envoie une amende de {$amount}. Motif : ton gazon fait 2 centimètres de trop, et ton flamant rose en plastique est « d'une teinte de rose non approuvée ».",
        "Linda, la présidente du comité de quartier, a mesuré ta pelouse avec une règle. Puis ta boîte aux lettres. Puis ton chien. Elle t'a laissé un mot plastifié et une amende de {$amount}.",
        "Nouvelle lettre du comité de quartier de {city} : ta poubelle a été sortie à 18 h 02 au lieu de 18 h. Ta porte de garage est « beige foncé » au lieu de « beige clair ». Total : {$amount}.",
        "Le comité des propriétaires a interdit {w:object} dans les jardins. Tu en as un. Il t'a été offert par ta grand-mère morte. Linda menace d'une amende de {$amount}.",
      ],
      en: [
        "Your subdivision's homeowners association fines you {$amount}. Reason: your lawn is an inch too long, and your plastic flamingo is “an unapproved shade of pink.”",
        "Linda, the HOA president, measured your lawn with a ruler. Then your mailbox. Then your dog. She left you a laminated note and a {$amount} fine.",
        "New letter from your {city} HOA: your trash can went out at 6:02 p.m. instead of 6:00. Your garage door is “dark beige” instead of “light beige.” Total: {$amount}.",
        "The HOA has banned {w:object} from front yards. You have one. Your late grandmother gave it to you. Linda threatens a {$amount} fine.",
      ],
    },
    choices: [
      {
        label: { fr: 'Payer et tondre', en: 'Pay and mow' },
        out: [
          { w: 2, text: { fr: ["J'ai payé {$amount}, tondu à la règle et repeint le flamant. Linda m'a félicité{|e} avec une carte « Bon voisin ». J'ai perdu une partie de mon âme.", "J'ai payé et obéi. Mon jardin est maintenant parfaitement identique aux 300 autres. Parfois, je rentre chez le voisin par erreur."], en: ["I paid {$amount}, mowed with a ruler and repainted the flamingo. Linda congratulated me with a “Good Neighbor” card. I lost part of my soul.", "I paid and complied. My yard is now identical to the 300 others. Sometimes I walk into the neighbor's house by mistake."] }, fx: { money: '-amount', stress: 4, discipline: 2 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Déclarer la guerre', en: 'Declare war' },
        out: [
          { w: 2, text: { fr: ["J'ai installé 140 flamants roses en plastique, puis un panneau « Linda, cette pelouse est pour toi ». Elle a appelé la police. La police a ri. Puis m'a demandé où acheter les flamants.", "J'ai laissé pousser la pelouse jusqu'aux genoux et j'ai déclaré mon jardin « réserve naturelle ». Une famille de ratons laveurs s'y est installée. Linda pleure tous les matins."], en: ["I installed 140 plastic flamingos and a sign reading “Linda, this lawn's for you.” She called the cops. The cops laughed. Then asked where I'd bought the flamingos.", "I let the lawn grow knee-high and declared my yard a “nature preserve.” A raccoon family moved in. Linda cries every morning."] }, fx: { happy: 10, karma: -2, money: -200 }, mood: 'party' },
          { w: 1, text: { fr: ["Linda m'a poursuivi{|e} en justice. J'ai perdu. Le juge était membre du même comité. Il m'a regardé{|e} par-dessus ses lunettes et a dit « beige foncé, vraiment ? »."], en: ["Linda sued me. I lost. The judge was on the same HOA. He looked at me over his glasses and said, “Dark beige? Really?”"] }, fx: { money: '-amount', happy: -5, stress: 6 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Devenir président{|e}', en: 'Run the HOA' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["Je me suis présenté{|e} contre Linda et j'ai gagné de 3 voix. Première mesure : les flamants roses sont obligatoires. Deuxième mesure : la pelouse de Linda est trop courte. Je suis devenu{|e} Linda.", "Élu{|e} président{|e} du comité. Le pouvoir m'est monté à la tête : j'ai mesuré la haie de ma propre mère. Je me déteste et je l'ai quand même verbalisée."], en: ["I ran against Linda and won by 3 votes. First decree: flamingos are mandatory. Second: Linda's lawn is too short. I have become Linda.", "Elected HOA president. Power went to my head: I measured my own mother's hedge. I hate myself and I still fined her."] }, fx: { happy: 7, karma: -3, fame: 1 }, mood: 'proud' },
        ],
      },
    ],
  },
  {
    id: 'cy_us_portion',
    icon: '🥩',
    cat: 'country',
    rating: 2,
    scene: { place: 'party', mood: 'sick', prop: 'steak', fx: 'poop' },
    when: { country: ['us'], age: [18, 80] },
    vars: { amount: [70, 120] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Un steakhouse texan propose un défi : un steak de 2 kilos, une pomme de terre de la taille d'un chat, des haricots et un milkshake, en une heure. Réussi : c'est gratuit et ta photo va au mur. Raté : {$amount}.",
        "Tu commandes un « petit » soda. On te tend un gobelet de deux litres avec une paille de la taille d'un tuyau d'arrosage. Le « grand » est livré sur un chariot. Le restaurant propose aussi un burger nommé « Le Pontage ».",
        "Au restaurant de {city}, la serveuse pose devant toi une assiette où l'on pourrait garer {w:vehicle}. « C'est la portion enfant », dit-elle. Le menu propose un défi à {$amount} : « Le Monstre ».",
        "Concours de mangeurs de hot-dogs à {city}. Le champion en titre, Big Earl, en a mangé 74 l'an dernier. Il s'échauffe en avalant {w:food}. Le premier prix est une ceinture plus large.",
      ],
      en: [
        "A Texas steakhouse has a challenge: a 72-ounce steak, a potato the size of a cat, beans and a milkshake, in one hour. Win: it's free and your photo goes on the wall. Lose: {$amount}.",
        "You order a “small” soda. They hand you a half-gallon cup with a straw the size of a garden hose. The “large” comes on a cart. The menu also has a burger called “The Bypass.”",
        "At a diner in {city}, the waitress sets down a plate big enough to park {w:vehicle} on. “That's the kids' portion,” she says. The menu offers a {$amount} challenge: “The Monster.”",
        "Hot dog eating contest in {city}. Reigning champion Big Earl ate 74 last year. He's warming up by swallowing {w:food}. First prize is a wider belt.",
      ],
    },
    choices: [
      {
        label: { fr: 'Relever le défi', en: 'Take the challenge' },
        out: [
          { w: 1, odds: { health: 1 }, text: { fr: ["J'ai tout fini en 58 minutes. Les serveurs ont sonné une cloche. Ma photo est au mur, à côté d'un camionneur de 160 kilos et d'un ours. J'ai transpiré de la sauce barbecue pendant trois jours.", "Victoire. J'ai eu les « sueurs de viande » toute la nuit et j'ai rêvé de vaches qui me demandaient des comptes. Mais c'était gratuit."], en: ["I finished in 58 minutes. The staff rang a bell. My photo is on the wall next to a 350-pound trucker and a bear. I sweated barbecue sauce for three days.", "Victory. I had meat sweats all night and dreamed of cows demanding answers. But it was free."] }, fx: { happy: 10, fame: 1, weight: 0.04, health: -3 }, mood: 'proud' },
          { w: 2, text: { fr: ["À la minute 41, j'ai vomi un geyser de purée et de steak sur le panneau « Hall of Fame ». Trois clients ont applaudi par réflexe. J'ai payé {$amount} et la note du nettoyage.", "J'ai abandonné, la joue gonflée comme un hamster. Puis j'ai vomi dans le milkshake, qui a débordé. Le cuisinier a juste dit « Encore un ». Ils ont un seau prévu pour ça."], en: ["At minute 41 I puked a geyser of mashed potato and steak onto the Hall of Fame sign. Three diners applauded by reflex. I paid {$amount} plus cleaning.", "I gave up, cheeks puffed like a hamster. Then I puked into the milkshake, which overflowed. The cook just said, “Another one.” They have a bucket for this."] }, fx: { money: '-amount', health: -6, happy: -4, visual: 'poop' }, mood: 'sick' },
          { w: 1, rating: 2, text: { fr: ["Au dernier morceau, mon estomac a explosé comme une piñata. Il y a eu des haricots au plafond. Ma photo est quand même au mur, en noir et blanc, avec une bougie."], en: ["On the last bite my stomach burst like a piñata. There were beans on the ceiling. My photo is on the wall anyway, in black and white, with a candle."] }, fx: { die: { fr: "explosé{|e} au dernier morceau d'un steak de deux kilos", en: 'burst on the last bite of a 72-ounce steak' }, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Commander une salade', en: 'Order a salad' },
        out: [
          { w: 1, text: { fr: ["J'ai commandé une salade. Elle était servie dans un saladier de la taille d'une baignoire, avec du bacon, du fromage frit et une sauce ranch au litre. 1 800 calories. C'était la plus légère.", "Ma salade avait onze tranches de bacon et un œuf frit dans un donut. La serveuse m'a dit « c'est notre option santé, chéri »."], en: ["I ordered a salad. It came in a bathtub-sized bowl with bacon, fried cheese and a quart of ranch. 1,800 calories. It was the lightest thing on the menu.", "My salad had eleven strips of bacon and a fried egg in a donut. The waitress said, “That's our healthy option, hon.”"] }, fx: { weight: 0.02, happy: 3 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Défier Big Earl', en: 'Challenge Big Earl' },
        out: [
          { w: 1, odds: { health: 1 }, text: { fr: ["J'ai mangé 31 hot-dogs avant de voir des couleurs. Big Earl en a mangé 80 et m'a donné une tape amicale qui m'a fait recracher les dix derniers. Respect mutuel.", "J'ai tenu le rythme de Big Earl pendant quatre minutes. Puis mon corps s'est éteint comme un vieux PC. Je me suis réveillé{|e} avec une moutarde dans l'oreille."], en: ["I ate 31 hot dogs before seeing colors. Big Earl ate 80 and gave me a friendly slap that made me spit up the last ten. Mutual respect.", "I kept pace with Big Earl for four minutes. Then my body shut down like an old PC. I woke up with mustard in my ear."] }, fx: { health: -6, weight: 0.03, happy: 4, visual: 'poop' }, mood: 'sick' },
        ],
      },
    ],
  },
  {
    id: 'cy_us_guns',
    icon: '🔫',
    cat: 'country',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'rifle', fx: 'explosion' },
    when: { country: ['us'], age: [18, 75] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Tu ouvres un compte en banque à {city}. Cadeau de bienvenue : un fusil. Pas un grille-pain, pas un stylo : un fusil. Le conseiller te demande si tu préfères la crosse rose ou camouflage.",
        "Ton voisin Gary a une arme dans chaque pièce, « au cas où ». Même dans la salle de bain. Même dans le frigo, derrière le ketchup. Il t'invite à son barbecue, où il compte « tirer sur le gâteau pour le couper ».",
        "Gary, ton voisin, a acheté un lance-flammes pour enlever la neige de son allée. Il te propose de l'essayer {w:weather}. Il porte un t-shirt « Sécurité d'abord » et pas de sourcils.",
        "Au supermarché de {city}, entre les céréales et {w:food}, il y a un rayon munitions. Une mamie compare deux boîtes de cartouches avec ses lunettes de lecture. Le caissier te demande si tu veux « la carte fidélité arme + cookies ».",
      ],
      en: [
        "You open a bank account in {city}. Welcome gift: a rifle. Not a toaster, not a pen: a rifle. The banker asks if you'd prefer the pink or camo stock.",
        "Your neighbor Gary has a gun in every room, “just in case.” Even the bathroom. Even the fridge, behind the ketchup. He invites you to his barbecue, where he plans to “shoot the cake to cut it.”",
        "Gary next door bought a flamethrower to clear the snow off his driveway. He invites you to try it {w:weather}. He's wearing a “Safety First” t-shirt and no eyebrows.",
        "At a {city} supermarket, between the cereal and {w:food}, there's an ammo aisle. A granny compares two boxes of cartridges with her reading glasses. The cashier asks if you want the “guns + cookies loyalty card.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Demander un grille-pain', en: 'Ask for a toaster instead' },
        out: [
          { w: 2, text: { fr: ["J'ai demandé un grille-pain à la place. Le conseiller m'a regardé{|e} comme si j'étais communiste. Il m'a finalement donné un grille-pain… en forme de revolver.", "Pas d'arme, merci. On m'a offert à la place un porte-clés en forme de balle et un sermon de vingt minutes sur la liberté. Je suis ressorti{|e} plus libre et plus fatigué{|e}."], en: ["I asked for a toaster instead. The banker looked at me like I was a communist. He eventually gave me a toaster… shaped like a revolver.", "No gun, thanks. Instead I got a bullet-shaped keychain and a twenty-minute sermon on freedom. I walked out freer and more tired."] }, fx: { happy: 3, karma: 2 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Aller au barbecue de Gary', en: "Go to Gary's barbecue" },
        out: [
          { w: 2, text: { fr: ["Gary a tiré sur le gâteau pour le couper. Il a raté le gâteau, touché le barbecue, qui a explosé. Les saucisses ont volé jusqu'au jardin d'à côté. Gary a dit « parfait, c'est grillé ».", "Au barbecue, Gary a voulu faire une démonstration sur sa propre boîte aux lettres. Elle a volé en morceaux, ainsi que celle du voisin et un nain de jardin. Le nain a eu un enterrement."], en: ["Gary shot the cake to cut it. He missed the cake, hit the grill, which exploded. Sausages flew into the next yard. Gary said, “Perfect, they're grilled.”", "At the barbecue Gary did a demo on his own mailbox. It blew to pieces, along with the neighbor's and a garden gnome. The gnome got a funeral."] }, fx: { happy: 7, stress: 4, visual: 'explosion' }, mood: 'shock' },
          { w: 1, text: { fr: ["Gary a sorti le lance-flammes pour allumer les braises. J'ai perdu mes sourcils, mes cils et la moitié de ma frange. Gary m'a tapé dans le dos : « Bienvenue au club. »"], en: ["Gary brought out the flamethrower to light the coals. I lost my eyebrows, eyelashes and half my bangs. Gary slapped my back: “Welcome to the club.”"] }, fx: { health: -6, looks: -6, disease: 'burns', visual: 'fire' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Essayer le lance-flammes', en: 'Try the flamethrower' },
        out: [
          { w: 1, text: { fr: ["J'ai déneigé l'allée en dix secondes. Puis la haie. Puis la niche. Le chien était ailleurs, heureusement. Gary m'a dit que j'avais « un don ».", "Le lance-flammes était génial. J'ai fait fondre la neige, le bitume et une partie de ma semelle. Je marche de travers maintenant, mais je suis libre."], en: ["I cleared the driveway in ten seconds. Then the hedge. Then the doghouse. The dog was elsewhere, luckily. Gary said I had “a gift.”", "The flamethrower was awesome. I melted the snow, the asphalt and part of my shoe sole. I walk crooked now, but I'm free."] }, fx: { happy: 9, karma: -2, visual: 'fire' }, mood: 'party' },
          { w: 1, rating: 2, text: { fr: ["J'ai trébuché sur une plaque de verglas en tenant le lance-flammes. Je me suis transformé{|e} en torche humaine en hurlant « {w:exclaim} ». Gary a filmé. La vidéo a fait 12 millions de vues. Pas moi."], en: ["I slipped on ice holding the flamethrower. I became a human torch screaming “{w:exclaim}” Gary filmed it. The video got 12 million views. I didn't make it."] }, fx: { die: { fr: 'transformé{|e} en torche humaine en déneigeant au lance-flammes', en: 'turned into a human torch while clearing snow with a flamethrower' }, visual: 'fire' }, mood: 'shock' },
        ],
      },
    ],
  },
  // ═════════════════════════════ ROYAUME-UNI ═════════════════════════════
  {
    id: 'cy_uk_queue',
    icon: '🧍',
    cat: 'country',
    rating: 0,
    scene: { place: 'office', mood: 'angry', prop: 'queue' },
    when: { country: ['uk'], age: [6, 90] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "File d'attente à la poste de {city}. Vingt-trois personnes, alignées au millimètre, dans un silence de cathédrale. Soudain, un homme en jogging passe devant tout le monde. Personne ne dit rien. Tout le monde souffre.",
        "Tu fais la queue pour le bus depuis douze minutes. Une dame arrive avec {w:object} et se place devant toi, l'air de rien. Derrière toi, un monsieur toussote. C'est l'équivalent britannique d'un appel à la révolte.",
        "Il y a deux files au guichet et personne ne sait laquelle est la bonne. Une troisième file se forme pour décider. Tu es au milieu de ce chaos parfaitement ordonné, {w:weather}.",
        "La file pour le stand de glaces fait le tour du parc. Un touriste demande s'il peut « juste passer devant pour une question ». Vingt Britanniques le fixent. Personne ne parle, mais la température baisse de dix degrés.",
      ],
      en: [
        "Queue at the {city} post office. Twenty-three people, lined up to the millimetre, in cathedral silence. Suddenly, a man in a tracksuit walks straight to the front. Nobody says anything. Everybody suffers.",
        "You've been queuing for the bus for twelve minutes. A woman arrives holding {w:object} and slots in front of you, casually. Behind you, a man clears his throat. That's the British equivalent of a call to arms.",
        "There are two queues at the counter and nobody knows which is right. A third queue forms to decide. You're in the middle of this perfectly orderly chaos, {w:weather}.",
        "The ice-cream queue wraps around the park. A tourist asks if he can “just pop to the front with a quick question.” Twenty Brits stare at him. Nobody speaks, but the temperature drops ten degrees.",
      ],
    },
    choices: [
      {
        label: { fr: 'Soupirer très fort', en: 'Sigh loudly' },
        out: [
          { w: 2, text: { fr: ["J'ai soupiré. Puis j'ai fait « tsss ». Le resquilleur n'a rien remarqué, mais trois personnes m'ont adressé un regard de profonde gratitude. C'était le plus beau moment de ma semaine.", "J'ai soupiré si fort qu'une vieille dame a hoché la tête. On a échangé un regard. On est meilleurs amis maintenant. On ne s'est jamais parlé."], en: ["I sighed. Then tutted. The queue-jumper didn't notice, but three people gave me looks of profound gratitude. Best moment of my week.", "I sighed so hard an old lady nodded. We exchanged a look. We're best friends now. We've never spoken."] }, fx: { happy: 4, stress: -2 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Dire quelque chose', en: 'Say something' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: ["J'ai dit « Excusez-moi, je crois qu'il y a une file ». Il s'est excusé quatre fois et il est retourné au fond. Toute la poste a applaudi. Je suis un héros national.", "« Je suis désolé{|e}, mais je crois que la file commence là-bas. » Il a rougi, s'est excusé, a reculé. J'ai tremblé pendant une heure. Le courage britannique a un prix."], en: ["I said, “Excuse me, I think there's a queue.” He apologised four times and went to the back. The whole post office applauded. I'm a national hero.", "“I'm so sorry, but I think the queue starts back there.” He blushed, apologised, retreated. I shook for an hour. British courage comes at a price."] }, fx: { happy: 8, karma: 3, stress: 3 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai voulu protester, mais il est sorti de ma bouche « Désolé{|e} ! ». Puis je me suis excusé{|e} d'avoir dit désolé. Il est passé devant moi aussi.", "J'ai ouvert la bouche, puis je l'ai refermée. J'y penserai tous les soirs pendant onze ans en imaginant ce que j'aurais pu dire."], en: ["I tried to protest, but what came out was “Sorry!” Then I apologised for saying sorry. He cut in front of me too.", "I opened my mouth, then closed it. I'll think about it every night for eleven years, imagining what I could have said."] }, fx: { stress: 5, happy: -3 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Rejoindre la mauvaise file', en: 'Join the wrong queue' },
        text: { fr: ["J'ai fait vingt minutes de queue avant de comprendre que c'était la file pour une boucherie. J'ai acheté une saucisse pour ne pas perdre la face.", "Je me suis mis{|e} dans une file au hasard, par réflexe. C'était une file pour un casting. J'ai été pris{|e} comme figurant{|e} dans une série policière."], en: ["I queued twenty minutes before realising it was for a butcher's. I bought a sausage so as not to lose face.", "I joined a random queue out of reflex. It was a casting call. I got cast as an extra in a crime drama."] },
        fx: { happy: 3 },
      },
    ],
  },
  {
    id: 'cy_uk_tea',
    icon: '🫖',
    cat: 'country',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'teacup' },
    when: { country: ['uk'], age: [10, 95] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Un invité étranger prépare le thé chez toi. Il met le lait AVANT l'eau. Puis il passe la tasse au micro-ondes. Ta grand-mère vient de s'asseoir très lentement, comme si ses jambes avaient lâché.",
        "Au bureau de {city}, c'est ton tour de faire la tournée de thé. Quatorze collègues, quatorze commandes : « lait, deux sucres », « juste montré au sachet », « couleur de vieux chêne », « comme ma mère ». Tu as noté sur ta main.",
        "Ta nouvelle coloc a acheté une bouilloire « design » qui met onze minutes à bouillir. Onze minutes. Dans un pays qui vit à coups de thé. Tu sens monter {w:sound} dans ta poitrine.",
        "Une crise grave frappe la famille : il ne reste plus un seul sachet de thé à la maison. {w:exclaim} Les magasins ferment dans six minutes, il pleut, et ta tante a déjà parlé d'« appeler un avocat ».",
      ],
      en: [
        "A foreign guest makes tea at your place. He puts the milk in FIRST. Then microwaves the mug. Your grandmother has just sat down very slowly, as if her legs gave out.",
        "At the {city} office, it's your turn to do the tea round. Fourteen coworkers, fourteen orders: “milk, two sugars,” “just show it the bag,” “colour of old oak,” “like my mum makes it.” You wrote it on your hand.",
        "Your new flatmate bought a “designer” kettle that takes eleven minutes to boil. Eleven minutes. In a country that runs on tea. You feel {w:sound} rising in your chest.",
        "A grave crisis hits the family: not a single teabag left in the house. {w:exclaim} The shops close in six minutes, it's raining, and your aunt has already mentioned “calling a solicitor.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire le thé parfait', en: 'Make the perfect cuppa' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["Eau frémissante, quatre minutes d'infusion, une goutte de lait, couleur biscuit. Les quatorze collègues ont bu en silence, puis l'un d'eux a murmuré « splendide ». Je suis promu{|e} officieusement.", "Thé parfait. Ma grand-mère a goûté, fermé les yeux et dit « enfin quelqu'un de bien dans cette famille ». Mes frères et sœurs ne me parlent plus."], en: ["Just-off-the-boil water, four-minute brew, a dash of milk, biscuit-coloured. Fourteen coworkers drank in silence, then one whispered, “Lovely.” I've been unofficially promoted.", "Perfect cuppa. Grandma sipped, closed her eyes and said, “Finally, someone decent in this family.” My siblings aren't speaking to me."] }, fx: { happy: 6, karma: 2, perf: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai inversé deux commandes. Brenda de la compta a reçu un thé sans sucre. Elle n'a rien dit. Elle a juste posé la tasse et me regarde depuis, sans cligner des yeux."], en: ["I mixed up two orders. Brenda from accounts got hers without sugar. She said nothing. She just set the mug down and has been staring at me ever since, unblinking."] }, fx: { stress: 5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Défendre le micro-ondes', en: 'Defend the microwave' },
        out: [
          { w: 1, text: { fr: ["J'ai dit que le micro-ondes, « c'est pratique ». Le silence a duré si longtemps qu'une horloge s'est arrêtée. On m'a retiré mon mug préféré. Il est sous scellés.", "J'ai défendu l'invité. La famille a voté. J'ai été exclu{|e} de la tournée de thé à vie et rétrogradé{|e} à « préposé{|e} aux biscuits »."], en: ["I said the microwave is “handy.” The silence lasted so long a clock stopped. My favourite mug was confiscated. It's in an evidence bag.", "I defended the guest. The family voted. I'm banned from the tea round for life and demoted to “biscuit duty.”"] }, fx: { happy: -3, karma: 1 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Courir au magasin', en: 'Sprint to the shop' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: ["J'ai couru sous la pluie, glissé deux fois, et atteint le magasin à 17 h 59. J'ai acheté 480 sachets. La famille m'a accueilli{|e} comme un soldat revenant du front.", "Sprint réussi. J'ai même pris des biscuits. Ma tante a retiré sa menace d'avocat et m'a couché{|e} sur son testament."], en: ["I ran through the rain, slipped twice, and reached the shop at 5:59 p.m. Bought 480 teabags. The family welcomed me like a soldier home from the front.", "Sprint successful. I even got biscuits. My aunt dropped the solicitor threat and put me in her will."] }, fx: { happy: 7, athletic: 2 }, mood: 'proud' },
        ],
      },
    ],
  },
  {
    id: 'cy_uk_weather',
    icon: '🌧️',
    cat: 'country',
    rating: 1,
    scene: { place: 'park', mood: 'sad', prop: 'umbrella' },
    when: { country: ['uk'], age: [18, 80] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Le journal annonce « la canicule » : 23 °C. Tout {city} s'est mis torse nu dans les parcs. Les tabloïds parlent de « fournaise » et les trains sont annulés parce que les rails ont « un peu chaud ».",
        "Tu organises un barbecue « estival » dans le jardin. Il fait 14 °C, il bruine de côté, et tes invités sont en short et en polaire. Les saucisses refusent de cuire par principe.",
        "Premier jour de soleil de l'année. Ton voisin a enlevé son t-shirt à 9 h. À 9 h 20, il est rouge homard. À 10 h, il pleut à nouveau. Il reste dehors par fierté, avec {w:drink}.",
        "Il a plu 300 jours cette année à {city}. Les gens parlent de la météo dans chaque conversation : « Pas terrible, hein ? » « Ça pourrait être pire. » « On dirait qu'il va pleuvoir. » Il pleut déjà.",
      ],
      en: [
        "The papers announce a “heatwave”: 73°F. All of {city} has gone shirtless in the parks. The tabloids say “scorcher” and trains are cancelled because the rails are “a bit warm.”",
        "You host a “summer” barbecue in the garden. It's 57°F, drizzling sideways, and your guests are in shorts and fleeces. The sausages refuse to cook on principle.",
        "First sunny day of the year. Your neighbour took his shirt off at 9 a.m. By 9:20 he's lobster red. By 10 it's raining again. He stays out of pride, holding {w:drink}.",
        "It rained 300 days in {city} this year. Every conversation is about the weather: “Not great, is it?” “Could be worse.” “Looks like rain.” It's already raining.",
      ],
    },
    choices: [
      {
        label: { fr: 'Barbecue quand même', en: 'Barbecue anyway' },
        out: [
          { w: 2, text: { fr: ["Barbecue sous la pluie, sous un parasol qui s'est envolé chez les voisins. Les saucisses étaient crues dedans et carbonisées dehors. Tout le monde a dit « lovely ». Personne ne le pensait.", "J'ai grillé sous un parapluie, une bière tiède à la main. Un invité a dit « c'est presque l'été ». On a tous ri jaune, puis on est rentrés manger des chips."], en: ["Barbecue in the rain, under a parasol that blew into the neighbours' garden. Sausages raw inside, charcoal outside. Everyone said “lovely.” Nobody meant it.", "I grilled under an umbrella, warm beer in hand. A guest said, “Almost summer.” We all laughed bitterly, then went inside to eat crisps."] }, fx: { happy: 5, health: -1 }, mood: 'happy' },
          { w: 1, text: { fr: ["Le barbecue jetable a mis le feu à la pelouse, qui était pourtant détrempée. Exploit physique. Les pompiers sont venus, ont mangé trois saucisses et sont repartis."], en: ["The disposable barbecue set the lawn on fire, even though it was soaked. A feat of physics. The fire brigade came, ate three sausages and left."] }, fx: { happy: 3, stress: 4, visual: 'fire' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Bronzer à 23 °C', en: 'Sunbathe at 73°F' },
        out: [
          { w: 2, text: { fr: ["J'ai bronzé deux heures sans crème, « parce qu'on n'est pas en Espagne ». Je suis rouge, je pèle et j'ai la forme de mon t-shirt en blanc. Je ressemble à un drapeau.", "Coup de soleil intégral par 23 °C. Le médecin m'a demandé si j'étais allé{|e} à Ibiza. J'ai dit « Hyde Park ». Il n'était pas surpris."], en: ["I sunbathed two hours with no sunscreen, “because it's not Spain.” I'm red, peeling, with a white t-shirt shape. I look like a flag.", "Full-body sunburn at 73°F. The doctor asked if I'd been to Ibiza. I said “the park.” He wasn't surprised."] }, fx: { health: -4, looks: -3, happy: 4 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Râler sur la météo', en: 'Moan about the weather' },
        text: { fr: ["J'ai râlé sur la météo avec onze inconnus différents dans la journée. Ce sont mes interactions sociales les plus riches de l'année. Bloody hell, quel temps.", "J'ai dit « bloody weather » au moins quarante fois. C'est thérapeutique. Ça remplace le psy, et c'est remboursé par personne."], en: ["I moaned about the weather with eleven different strangers today. My richest social interactions of the year. Bloody hell, what weather.", "I said “bloody weather” at least forty times. It's therapeutic. It replaces therapy, and nobody reimburses it."] },
        fx: { happy: 3, stress: -3 },
      },
    ],
  },
  {
    id: 'cy_uk_royal',
    icon: '👑',
    cat: 'country',
    rating: 1,
    scene: { place: 'castle', mood: 'shock', prop: 'crown' },
    when: { country: ['uk'], age: [20, 85] },
    weight: 5,
    once: true,
    text: {
      fr: [
        "Tu es invité{|e} à une garden-party royale. On t'a appris la révérence pendant trois heures. Le Duc de Petit-Ronflement, quarante-septième dans l'ordre de succession, s'approche de toi avec {w:drink}.",
        "Un membre mineur de la famille royale inaugure le nouveau rond-point de {city}. Tu es au premier rang. Il te tend la main. Personne ne t'a dit si on la serre, si on l'embrasse ou si on fait un salto.",
        "Le protocole a placé ta chaise à côté d'une comtesse de 97 ans qui ne connaît que deux sujets : ses corgis et {w:hobby}. La Duchesse de Quelque-Part te regarde manger tes scones de travers.",
        "Tu travailles comme serveur{|se} lors d'un dîner au château. Sur ton plateau : des petits fours, une coupe de champagne, et la responsabilité de ne pas éternuer sur un Lord. Un Prince te demande où sont les toilettes.",
      ],
      en: [
        "You're invited to a royal garden party. They spent three hours teaching you to bow. The Duke of Little Snoring, forty-seventh in line to the throne, approaches you holding {w:drink}.",
        "A minor royal is opening {city}'s new roundabout. You're in the front row. He extends his hand. Nobody told you whether to shake it, kiss it or do a backflip.",
        "Protocol seated you next to a 97-year-old countess who only talks about her corgis and {w:hobby}. The Duchess of Somewhere watches you eat your scone the wrong way.",
        "You're working as a waiter at a castle dinner. On your tray: canapés, a glass of champagne, and the responsibility not to sneeze on a Lord. A Prince asks you where the loo is.",
      ],
    },
    choices: [
      {
        label: { fr: 'Révérence parfaite', en: 'Perfect bow' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["Révérence parfaite. Le Duc a hoché la tête, une fois. J'ai découpé la photo dans le journal local et je l'ai encadrée. Elle est au-dessus des toilettes, pour que tout le monde la voie.", "Révérence impeccable. Le Duc m'a dit « Charmant ». Un seul mot. Je le répète en boucle depuis trois semaines, avec l'accent."], en: ["Perfect bow. The Duke nodded, once. I cut the photo out of the local paper and framed it. It hangs above the loo so everyone sees it.", "Flawless bow. The Duke said “Charming.” One word. I've been repeating it for three weeks, in the accent."] }, fx: { happy: 7, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["Pendant la révérence, mon pantalon a craqué du côté sud. Le Duc a fait semblant de ne rien entendre, avec un professionnalisme admirable. Le photographe, non."], en: ["Mid-bow, my trousers split at the back. The Duke pretended not to hear with admirable professionalism. The photographer did not."] }, fx: { happy: -3, fame: 2, stress: 5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Check du poing', en: 'Fist bump' },
        out: [
          { w: 1, text: { fr: ["J'ai tendu le poing au Duc. Il l'a regardé comme {w:object}. Puis il a tapé, maladroitement. Les gardes ont bougé d'un centimètre. Je suis sur la liste rouge du palais.", "J'ai fait un check au Prince. Il a souri et dit « Cool ». Le lendemain, les tabloïds titraient « LE PRINCE ET LE ROTURIER ». Ma mère a acheté vingt exemplaires."], en: ["I offered the Duke a fist bump. He looked at it like it was {w:object}. Then bumped it, awkwardly. The guards moved one inch. I'm on the palace blacklist.", "I fist-bumped the Prince. He smiled and said “Cool.” Next day the tabloids ran “THE PRINCE AND THE COMMONER.” My mum bought twenty copies."] }, fx: { happy: 8, fame: 3 }, mood: 'party' },
        ],
      },
      {
        label: { fr: "Parler d'argent", en: 'Ask about the money' },
        out: [
          { w: 1, text: { fr: ["J'ai demandé au Duc combien coûtait l'entretien de ses neuf châteaux. Il a répondu « Pardon ? » et s'est éloigné en marchant à reculons, ce qui est apparemment le protocole pour fuir.", "J'ai demandé où partaient mes impôts. Un majordome m'a raccompagné{|e} jusqu'à la grille avec une politesse glaciale et un scone dans une serviette, « pour la route »."], en: ["I asked the Duke how much his nine castles cost to maintain. He said “I beg your pardon?” and walked away backwards, which is apparently the protocol for fleeing.", "I asked where my taxes go. A butler escorted me to the gate with icy politeness and a scone wrapped in a napkin, “for the road.”"] }, fx: { happy: 4, karma: 2, fame: 1 }, mood: 'angry' },
        ],
      },
    ],
  },
  {
    id: 'cy_uk_nhs',
    icon: '🏥',
    cat: 'country',
    rating: 1,
    scene: { place: 'hospital', mood: 'sleepy', prop: 'phone' },
    when: { country: ['uk'], age: [25, 95] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Tu as mal au dos depuis trois semaines. Pour un rendez-vous chez le médecin traitant, il faut appeler à 8 h pile. À 8 h 00 et 3 secondes, tu es le 47e en attente. Tu fais ça {w:weather} depuis lundi.",
        "Ton cabinet médical de {city} propose un rendez-vous dans neuf semaines, un mardi à 7 h 10, avec un médecin remplaçant qui s'appelle « Dr. TBC ». Ou bien une consultation par téléphone, « entre 8 h et 18 h ».",
        "Six heures aux urgences pour un doigt tordu. À côté de toi : un homme avec {w:object} coincé dans le pantalon, une dame qui chante, et un adolescent qui saigne d'un sourcil en jouant sur son téléphone.",
        "Le standard de ton cabinet passe {w:song} en musique d'attente depuis 52 minutes. Une voix enregistrée répète « votre appel est important pour nous ». Tu commences à la croire et à l'aimer.",
      ],
      en: [
        "Your back has hurt for three weeks. To get a GP appointment, you must call at exactly 8 a.m. At 8:00 and 3 seconds, you're 47th in the queue. You've been doing this {w:weather} since Monday.",
        "Your {city} surgery offers an appointment in nine weeks, a Tuesday at 7:10 a.m., with a locum called “Dr. TBC.” Or a phone consultation, “between 8 a.m. and 6 p.m.”",
        "Six hours in A&E for a bent finger. Next to you: a man with {w:object} stuck in his trousers, a woman singing, and a teenager bleeding from an eyebrow while gaming on his phone.",
        "Your surgery's switchboard has been playing {w:song} as hold music for 52 minutes. A recorded voice repeats “your call is important to us.” You're starting to believe her. And love her.",
      ],
    },
    choices: [
      {
        label: { fr: 'Attendre stoïquement', en: 'Wait stoically' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai attendu sans râler, comme un vrai Britannique. Le médecin m'a vu{|e} sept minutes, m'a dit de prendre du paracétamol et de « voir comment ça évolue ». C'était gratuit. Je l'aime.", "Après neuf semaines, le mal de dos était passé. J'ai gardé le rendez-vous par politesse et j'ai parlé de la météo avec le médecin pendant dix minutes."], en: ["I waited without moaning, like a true Brit. The doctor saw me for seven minutes, told me to take paracetamol and “see how it goes.” It was free. I love him.", "After nine weeks, my back had healed. I kept the appointment out of politeness and talked about the weather with the doctor for ten minutes."] }, fx: { health: 4, stress: 3 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Exagérer les symptômes', en: 'Exaggerate symptoms' },
        out: [
          { w: 1, text: { fr: ["J'ai dit au téléphone que j'avais « une douleur thoracique, une jambe qui part et une vision floue ». On m'a envoyé une ambulance. J'avais juste une crampe. L'infirmière m'a traité{|e} de « muppet ». Bien mérité.", "J'ai simulé un évanouissement aux urgences. On m'a fait passer devant tout le monde, puis on m'a renvoyé{|e} au fond quand j'ai réclamé un sandwich."], en: ["I told the phone line I had “chest pain, a leg giving out and blurred vision.” They sent an ambulance. It was a cramp. The nurse called me a “muppet.” Deserved.", "I faked a faint in A&E. They rushed me to the front, then sent me to the back when I asked for a sandwich."] }, fx: { karma: -4, stress: 2, health: 2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Me soigner seul{|e}', en: 'Self-treat' },
        text: { fr: ["Je me suis soigné{|e} avec du thé, une bouillotte et un forum internet. Diagnostic du forum : soit une entorse, soit une maladie tropicale rarissime. J'ai pris un autre thé.", "J'ai mis {w:food} congelé sur mon dos pendant une semaine. Ça n'a rien soigné, mais j'ai dîné après."], en: ["I treated myself with tea, a hot water bottle and an internet forum. The forum's diagnosis: either a sprain or an extremely rare tropical disease. I had another tea.", "I put frozen {w:food} on my back for a week. It cured nothing, but I had dinner afterwards."] },
        fx: { health: -2, happy: 2 },
      },
    ],
  },
  {
    id: 'cy_uk_pub',
    icon: '🍻',
    cat: 'country',
    rating: 2,
    scene: { place: 'party', mood: 'party', prop: 'pint' },
    when: { country: ['uk'], age: [18, 70] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Vendredi, pub de {city}. Tu es dans un « round » avec neuf collègues. Le système est simple : chacun paie une tournée. Neuf tournées. Neuf pintes. Il est 17 h 30. Ton tour est le dernier.",
        "Quiz au pub du quartier. Ton équipe s'appelle « Quiz Team Aguilera » et a déjà bu trois pichets. Question 14 : « Quelle est la capitale du Burkina Faso ? » Ton collègue répond « {w:celeb} ».",
        "Le patron du pub sonne la cloche du dernier service. 22 h 50. Panique générale : trente personnes commandent deux pintes chacune « pour finir ». Ton estomac contient déjà six pintes et {w:food}.",
        "Soirée au pub après le match. Les supporters chantent depuis trois heures une chanson dont les paroles sont uniquement « {w:insult} » et le nom de l'arbitre. Ton voisin de comptoir veut t'apprendre la suite.",
      ],
      en: [
        "Friday, a pub in {city}. You're in a round with nine coworkers. Simple system: everyone buys a round. Nine rounds. Nine pints. It's 5:30 p.m. You're last.",
        "Pub quiz night. Your team is called “Quiz Team Aguilera” and has already drunk three jugs. Question 14: “What's the capital of Burkina Faso?” Your coworker answers “{w:celeb}.”",
        "The landlord rings the bell for last orders. 10:50 p.m. Mass panic: thirty people order two pints each “to finish.” Your stomach already holds six pints and {w:food}.",
        "Post-match pub night. The fans have been singing for three hours a song whose lyrics are just “{w:insult}” and the referee's name. The guy next to you at the bar wants to teach you the next verse.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rester pour ma tournée', en: 'Stay for my round' },
        out: [
          { w: 2, text: { fr: ["J'ai tenu jusqu'à ma tournée. Neuvième pinte. J'ai vomi dans le chapeau d'un client, puis je me suis excusé{|e} auprès du chapeau. On a fini au kebab à 2 h, où j'ai demandé l'oignon en mariage.", "J'ai payé ma tournée, la dixième « pour l'honneur », et je me suis réveillé{|e} à Blackpool avec un cône de signalisation sur la tête et un tatouage temporaire « MUM » à l'envers."], en: ["I made it to my round. Ninth pint. I threw up in a stranger's hat, then apologised to the hat. We ended up at a kebab shop at 2 a.m., where I proposed to an onion.", "I bought my round, a tenth “for honour,” and woke up in Blackpool with a traffic cone on my head and a temporary “MUM” tattoo, upside down."] }, fx: { happy: 8, health: -7, addiction: ['alcohol', 7], money: -80, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: ["J'ai payé ma tournée et je suis devenu{|e} une légende du pub. Mon nom est sur une plaque au-dessus du tabouret du coin. Ma vessie, elle, a démissionné."], en: ["I bought my round and became a pub legend. My name is on a plaque above the corner stool. My bladder has resigned."] }, fx: { happy: 10, fame: 1, health: -4, addiction: ['alcohol', 5], money: -80 }, mood: 'party' },
        ],
      },
      {
        label: { fr: 'Filer avant ma tournée', en: 'Leave before my round' },
        out: [
          { w: 2, text: { fr: ["Je suis parti{|e} discrètement avant ma tournée. Le lundi, au bureau, personne ne m'a parlé. Mon prénom a été rayé du groupe de messagerie. C'est pire que la prison.", "J'ai prétexté une urgence familiale et fui avant ma tournée. Un collègue m'a vu{|e} au kebab d'en face trois minutes plus tard. Je suis un paria pour l'éternité."], en: ["I slipped out before my round. On Monday at the office nobody spoke to me. I was removed from the group chat. Worse than prison.", "I faked a family emergency and fled before my round. A coworker saw me at the kebab shop across the street three minutes later. I'm a pariah forever."] }, fx: { karma: -6, happy: -4, money: 30 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Gagner le quiz', en: 'Win the quiz' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai répondu « Ouagadougou ». Silence admiratif. On a gagné un bon de 20 livres et un pichet, qu'on a bu, puis on a perdu le bon. Équipe soudée.", "J'ai trouvé toutes les réponses de la catégorie « Fromages ». On a gagné. L'équipe adverse a crié à la triche et s'est battue avec un tabouret."], en: ["I answered “Ouagadougou.” Admiring silence. We won a £20 voucher and a jug, which we drank, then lost the voucher. Team bonding.", "I nailed every answer in the “Cheese” round. We won. The rival team cried cheating and started a fight with a stool."] }, fx: { happy: 7, smarts: 2, addiction: ['alcohol', 3] }, mood: 'proud' },
        ],
      },
    ],
  },
  {
    id: 'cy_uk_politics',
    icon: '🥬',
    cat: 'country',
    rating: 2,
    scene: { place: 'court', mood: 'shock', prop: 'lettuce' },
    when: { country: ['uk'], age: [25, 85] },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "Quatrième Premier ministre de l'année. Un tabloïd a filmé une laitue en direct pour voir qui tiendrait le plus longtemps. La laitue a gagné. Ton parti local cherche désespérément un candidat. Tu es le seul à être venu à la réunion.",
        "Le gouvernement est tombé pendant que tu te brossais les dents. Le nouveau a démissionné pendant ton petit-déjeuner. À midi, ton nom figure sur une liste de « personnalités ministrables », juste après {w:celeb}.",
        "Scandale à Westminster : un député a facturé aux contribuables {w:object}, une niche de luxe pour son canard et un « tapis de méditation en or ». On te propose de le remplacer à {city}.",
        "Le Parlement débat depuis onze heures sur la forme des files d'attente nationales. Un député s'est endormi sur un autre. On t'offre un siège à la Chambre des Lords parce qu'il en reste un, coincé entre deux barons de 104 ans.",
      ],
      en: [
        "Fourth Prime Minister this year. A tabloid livestreamed a lettuce to see who'd last longer. The lettuce won. Your local party is desperate for a candidate. You're the only one who showed up to the meeting.",
        "The government fell while you brushed your teeth. The new one resigned during breakfast. By noon, your name is on a list of “potential ministers,” right after {w:celeb}.",
        "Scandal in Westminster: an MP expensed {w:object}, a luxury house for his duck and a “gold meditation mat.” You're offered his seat in {city}.",
        "Parliament has been debating the shape of national queues for eleven hours. One MP fell asleep on another. You're offered a seat in the House of Lords because there's one left, wedged between two 104-year-old barons.",
      ],
    },
    choices: [
      {
        label: { fr: 'Devenir ministre', en: 'Become a minister' },
        out: [
          { w: 2, text: { fr: ["J'ai été nommé{|e} ministre des Affaires Diverses. J'ai tenu six jours, soit deux de plus que la laitue. Un tabloïd a titré « PIRE QUE LE LÉGUME ». J'ai encadré la une.", "Ministre pendant 48 heures. J'ai eu le temps de signer une loi rendant le thé obligatoire, de déclencher un scandale avec mes notes de frais et de démissionner en pleurant devant le 10."], en: ["I was appointed Minister for Miscellaneous Affairs. I lasted six days, two more than the lettuce. A tabloid ran “WORSE THAN THE VEG.” I framed the front page.", "Minister for 48 hours. Long enough to sign a law making tea mandatory, spark an expenses scandal and resign in tears outside Number 10."] }, fx: { fame: 6, happy: 4, stress: 10 }, mood: 'shock' },
          { w: 1, text: { fr: ["Pendant ma conférence de presse, un militant m'a jeté une laitue entière. En pleine bouche. J'ai mâché par réflexe, en direct. C'est devenu le mème de l'année. J'ai démissionné en salade."], en: ["During my press conference, a protester threw a whole lettuce at me. Right in the mouth. I chewed on reflex, live on TV. Meme of the year. I resigned, dressed like a salad."] }, fx: { fame: 8, happy: -6, followers: 50000 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Prendre le siège de Lord', en: 'Take the Lords seat' },
        out: [
          { w: 1, text: { fr: ["Je suis Lord à vie. Je touche une indemnité pour venir dormir dans un fauteuil rouge. Un baron de 104 ans m'a pété dessus pendant un discours sur la pêche. Personne n'a réagi. C'est la tradition.", "J'ai siégé chez les Lords avec une perruque et une robe en hermine. J'ai voté contre une loi sans savoir de quoi elle parlait. Le baron à côté de moi est mort pendant le vote. Il a voté aussi."], en: ["I'm a Lord for life. I get an allowance to come and nap in a red armchair. A 104-year-old baron farted on me during a speech on fishing. Nobody reacted. It's tradition.", "I sat in the Lords in a wig and ermine robe. I voted against a bill without knowing what it was about. The baron next to me died during the vote. He voted too."] }, fx: { money: 3000, happy: 6, fame: 2 }, mood: 'sleepy' },
        ],
      },
      {
        label: { fr: 'Soutenir la laitue', en: 'Back the lettuce' },
        text: { fr: ["J'ai lancé une pétition pour nommer la laitue Première ministre. 400 000 signatures. Elle a été plus stable que tous les autres. Puis elle a pourri. Comme les autres.", "J'ai fait campagne pour la laitue avec des t-shirts « LETTUCE LEAD ». Elle a fini troisième, devant deux vrais partis. Je ne suis pas sûr{|e} que ce soit drôle."], en: ["I launched a petition to make the lettuce Prime Minister. 400,000 signatures. It was more stable than all the others. Then it rotted. Like the others.", "I campaigned for the lettuce with “LETTUCE LEAD” t-shirts. It came third, ahead of two real parties. I'm not sure that's funny."] },
        fx: { happy: 7, fame: 2 },
      },
    ],
  },
  {
    id: 'cy_uk_stag',
    icon: '🦌',
    cat: 'country',
    rating: 2,
    scene: { place: 'party', mood: 'party', prop: 'costume', fx: 'police' },
    when: { country: ['uk'], age: [21, 50] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "Enterrement de vie de garçon à Newcastle, en janvier. Il fait 2 °C. Tout le monde est en t-shirt, sauf le futur marié, dans un costume géant représentant {w:animal}. Programme : 14 pubs, un kebab, et « on verra ».",
        "Enterrement de vie de jeune fille à {city}. Vingt femmes en voile rose, une couronne lumineuse et un gonflable en forme d'organe masculin de deux mètres. Tu es la seule personne sobre. Il est 15 h.",
        "Le témoin a tout organisé : départ à 10 h, laser game, brasserie, karaoké, puis « surprise ». Tu as vu la surprise dans le coffre : des menottes en fourrure, du ruban adhésif et {w:object}.",
        "C'est ton enterrement de vie de célibataire. Tes potes t'ont habillé{|e} en dresseur de pigeons, avec un vrai pigeon et {w:object} en accessoire. Ils ont prévu de te laisser quelque part avant minuit.",
      ],
      en: [
        "Stag do in Newcastle, in January. It's 36°F. Everyone's in t-shirts, except the groom, in a giant costume of {w:animal}. The plan: 14 pubs, a kebab, and “we'll see.”",
        "Hen do in {city}. Twenty women in pink veils, a light-up crown and a six-foot inflatable shaped like a certain male organ. You're the only sober person. It's 3 p.m.",
        "The best man organised everything: 10 a.m. start, laser tag, brewery, karaoke, then “surprise.” You saw the surprise in the boot: fluffy handcuffs, duct tape and {w:object}.",
        "It's your own stag/hen party. Your mates dressed you as a pigeon trainer, with an actual pigeon and {w:object} as a prop. They're planning to leave you somewhere before midnight.",
      ],
    },
    choices: [
      {
        label: { fr: 'Suivre le programme', en: 'Follow the plan' },
        out: [
          { w: 2, text: { fr: ["Pub numéro 9 : le marié s'est retrouvé menotté nu à un lampadaire, avec juste une chaussette stratégique. Un policier l'a détaché en soupirant : « Le troisième ce soir. » On a fini le programme sans lui.", "On a été virés de 6 pubs sur 14. Record battu. J'ai embrassé le gonflable géant sur une photo qui me suivra jusqu'à ma mort. Ma grand-mère l'a déjà vue."], en: ["Pub number 9: the groom ended up handcuffed naked to a lamppost with only a strategic sock. A copper freed him with a sigh: “Third one tonight.” We finished the route without him.", "We got kicked out of 6 pubs out of 14. Record broken. I kissed the giant inflatable in a photo that will follow me to my grave. My gran has already seen it."] }, fx: { happy: 10, health: -6, addiction: ['alcohol', 6], visual: 'police' }, mood: 'party' },
          { w: 1, text: { fr: ["Je me suis réveillé{|e} seul{|e} sur un ferry pour Amsterdam, en costume de pigeon, avec le pigeon. Aucun souvenir, aucun passeport. Le pigeon, lui, avait l'air de savoir."], en: ["I woke up alone on a ferry to Amsterdam, in a pigeon costume, with the pigeon. No memory, no passport. The pigeon seemed to know something."] }, fx: { happy: 4, stress: 10, money: -400 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Être le parent responsable', en: 'Be the responsible one' },
        out: [
          { w: 2, text: { fr: ["J'ai tenu les cheveux de quatre personnes, ramassé un sourcil rasé et négocié avec deux videurs. Je suis rentré{|e} à 4 h, sobre et traumatisé{|e}. On m'a remercié{|e} en me mettant dans le discours du mariage.", "J'ai été le chauffeur, l'infirmier, le psy et l'avocat. Personne ne s'en souvient. Moi, je me souviens de tout. Absolument tout. Je vais faire chanter tout le monde."], en: ["I held back four people's hair, picked up a shaved eyebrow and negotiated with two bouncers. Got home at 4 a.m., sober and traumatised. They thanked me with a mention in the wedding speech.", "I was the driver, nurse, therapist and lawyer. Nobody remembers. I remember everything. Absolutely everything. I'm going to blackmail them all."] }, fx: { karma: 5, stress: 6, happy: 2 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Fuir le gonflable', en: 'Flee the inflatable' },
        text: { fr: ["Je me suis enfui{|e} quand ils ont sorti le gonflable géant. Il m'a poursuivi{|e} dans la rue, porté par le vent. Les passants ont cru à un monstre de film d'horreur. Je n'ai rien contre.", "J'ai simulé une gastro et je suis rentré{|e} regarder {w:show}. J'ai raté la soirée du siècle et je n'ai aucun regret."], en: ["I fled when they brought out the giant inflatable. The wind carried it after me down the street. Passers-by thought it was a horror-movie monster. I have no objection.", "I faked a stomach bug and went home to watch {w:show}. I missed the night of the century and have zero regrets."] },
        fx: { happy: 3, karma: -1 },
      },
    ],
  },
  // ═════════════════════════════ CANADA ═════════════════════════════
  {
    id: 'cy_ca_sorry',
    icon: '🙇',
    cat: 'country',
    rating: 0,
    scene: { place: 'park', mood: 'happy', prop: 'maple' },
    when: { country: ['ca'], age: [10, 90] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Un inconnu te marche sur le pied au supermarché de {city}. Il dit « sorry ». Tu dis « sorry ». Il redit « sorry » pour avoir dit sorry. Ça fait maintenant quatre minutes. Personne ne veut perdre.",
        "Tu tiens la porte du café pour quelqu'un. Cette personne la tient à son tour pour toi. Puis toi pour elle. Il y a maintenant une file de onze personnes derrière vous, qui attendent poliment en souriant {w:weather}.",
        "Tu as accidentellement percuté {w:object} avec ton chariot. Avant que tu aies pu t'excuser, son propriétaire s'excuse d'avoir mis son objet sur ton chemin. Il insiste pour t'offrir un café.",
        "Accrochage léger sur le parking. Les deux conducteurs sortent. Tu t'attends à des cris. L'autre conducteur fond en larmes en s'excusant, puis te propose des biscuits. Il a même un formulaire de constat déjà rempli à ta place.",
      ],
      en: [
        "A stranger steps on your foot at a {city} grocery store. He says “sorry.” You say “sorry.” He says “sorry” for saying sorry. It's been four minutes. Nobody wants to lose.",
        "You hold the café door for someone. They hold it back for you. Then you for them. There's now a line of eleven people behind you, waiting politely and smiling {w:weather}.",
        "You accidentally bumped your cart into {w:object}. Before you can apologise, its owner apologises for leaving it in your way. He insists on buying you a coffee.",
        "Minor fender-bender in the parking lot. Both drivers get out. You expect yelling. The other driver bursts into tears apologising, then offers you cookies. He even filled out the accident report on your behalf.",
      ],
    },
    choices: [
      {
        label: { fr: 'Gagner le duel de sorry', en: 'Win the sorry duel' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai dit « sorry » 27 fois, sans faiblir. L'autre a craqué au 26e et a dit « thank you » par erreur. Il est parti humilié. Je suis le Canadien le plus poli de la province.", "Le duel a duré 9 minutes. On a fini par s'excuser en chœur, puis on est allés boire un café ensemble. On part en camping le mois prochain."], en: ["I said “sorry” 27 times without faltering. The other guy cracked at 26 and said “thank you” by mistake. He left humiliated. I'm the politest person in the province.", "The duel lasted 9 minutes. We ended up apologising in unison, then went for coffee together. We're going camping next month."] }, fx: { happy: 5, karma: 3 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Ne pas dire pardon', en: "Don't apologise" },
        out: [
          { w: 1, text: { fr: ["Je n'ai pas dit pardon. Tout le magasin s'est figé. Une mamie a laissé tomber son sirop d'érable. On m'a regardé{|e} comme un criminel de guerre. J'ai dit « sorry » en sortant, trop tard.", "J'ai simplement dit « ça va ». Un employé m'a demandé si j'étais américain{|e}. Personne ne m'a souri jusqu'au printemps."], en: ["I didn't apologise. The whole store froze. A granny dropped her maple syrup. People looked at me like a war criminal. I said “sorry” on the way out, too late.", "I just said “it's fine.” A clerk asked if I was American. Nobody smiled at me until spring."] }, fx: { karma: -3, stress: 3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Offrir un café', en: 'Buy them a coffee' },
        text: { fr: ["J'ai offert un café pour m'excuser de m'excuser. L'autre m'a offert un beignet pour s'excuser du café. On est maintenant bloqués dans une boucle de générosité qui coûte 40 $ par semaine.", "J'ai payé un café à l'inconnu. Il m'a remercié{|e} si fort qu'il s'est excusé de m'avoir remercié{|e} trop fort. Je l'ai quitté au bout d'une heure, épuisé{|e} de gentillesse."], en: ["I bought a coffee to apologise for apologising. He bought me a donut to apologise for the coffee. We're now stuck in a generosity loop costing $40 a week.", "I bought the stranger a coffee. He thanked me so loudly that he apologised for thanking me too loudly. I left after an hour, exhausted by kindness."] },
        fx: { happy: 4, karma: 4, money: -6 },
      },
    ],
  },
  {
    id: 'cy_ca_moose',
    icon: '🫎',
    cat: 'country',
    rating: 1,
    scene: { place: 'park', mood: 'shock', prop: 'moose' },
    when: { country: ['ca'], age: [16, 80] },
    weight: 6,
    once: true,
    text: {
      fr: [
        "Route forestière près de {city}. Un orignal de 600 kilos se tient au milieu de la route et regarde ta voiture. Fixement. Il a l'air de trouver ta voiture très séduisante. Il commence à frotter ses bois contre le capot.",
        "Tu sors les poubelles à 6 h du matin. Un orignal est en train de manger tes géraniums. Il te regarde. Tu le regardes. Il mâche lentement. Tu tiens toujours ton sac poubelle, qui sent {w:smell}.",
        "Un orignal a bloqué l'accès à ton chalet. Il est couché devant la porte comme un gros chien de garde de deux mètres. Il ronfle. Tu as {w:food} dans un sac et une envie très pressante.",
        "L'orignal du coin, surnommé « Gérald » par les habitants, a décidé que ta boîte aux lettres était sa nouvelle copine. Il lui fait la cour tous les matins depuis une semaine. Le facteur refuse de venir.",
      ],
      en: [
        "Forest road near {city}. A 1,300-pound moose stands in the middle of the road staring at your car. Intensely. It seems to find your car very attractive. It starts rubbing its antlers against the hood.",
        "You take out the trash at 6 a.m. A moose is eating your geraniums. It looks at you. You look at it. It chews slowly. You're still holding the garbage bag, which gives off {w:smell}.",
        "A moose is blocking the door to your cabin. It's lying there like a six-foot guard dog. Snoring. You've got {w:food} in a bag and an urgent need to pee.",
        "The local moose, nicknamed “Gerald” by residents, has decided your mailbox is his new girlfriend. He's been courting it every morning for a week. The mailman refuses to come.",
      ],
    },
    choices: [
      {
        label: { fr: 'Klaxonner', en: 'Honk' },
        out: [
          { w: 1, text: { fr: ["J'ai klaxonné. L'orignal l'a pris comme un défi amoureux. Il a chargé. Ma portière a maintenant la forme exacte de son front. L'assurance a classé ça dans « actes de Dieu canadiens ».", "Coup de klaxon. L'orignal a sauté, atterri sur le toit d'une voiture garée, puis s'est enfui. Le propriétaire est sorti en pyjama, a vu le toit et a dit « ah, encore »."], en: ["I honked. The moose took it as a mating challenge. It charged. My door now has the exact shape of its forehead. Insurance filed it under “Canadian acts of God.”", "One honk. The moose jumped, landed on the roof of a parked car, then ran off. The owner came out in pajamas, saw the roof and said, “Oh, again.”"] }, fx: { stress: 8, money: -1200, happy: -3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Attendre poliment', en: 'Wait politely' },
        out: [
          { w: 2, text: { fr: ["J'ai attendu 2 h 40. L'orignal a fini mes géraniums, ma haie et le pneu de secours. Puis il est parti en me regardant, comme pour dire merci. Je crois qu'on a un lien.", "J'ai attendu en silence. L'orignal s'est approché, m'a reniflé{|e} et m'a léché le visage avec une langue de la taille d'un tapis de bain. J'ai été adopté{|e}."], en: ["I waited 2 hours 40. The moose finished my geraniums, my hedge and the spare tire. Then it left, looking back at me, like a thank-you. I think we have a bond.", "I waited in silence. The moose came closer, sniffed me and licked my face with a tongue the size of a bathmat. I've been adopted."] }, fx: { happy: 6, stress: -2, flag: 'cy_ca_moose', schedule: { key: 'cy_ca_moose_back', years: 2 } }, mood: 'love' },
        ],
      },
      {
        label: { fr: 'Caresser le museau', en: 'Pet the snout' },
        out: [
          { w: 1, text: { fr: ["J'ai caressé son museau. Il était doux comme du velours. Il a éternué sur moi. Un litre de morve d'orignal. J'ai senti {w:smell} pendant une semaine, mais j'ai un ami.", "Je l'ai caressé. Il a apprécié. Il est revenu le lendemain avec sa femme. Je crois que j'ai signé pour quelque chose."], en: ["I petted its snout. Soft as velvet. It sneezed on me. A quart of moose snot. I smelled like {w:smell} for a week, but I have a friend.", "I petted it. It liked that. It came back the next day with its wife. I think I signed up for something."] }, fx: { happy: 7, looks: -2, flag: 'cy_ca_moose', schedule: { key: 'cy_ca_moose_back', years: 2 } }, mood: 'love' },
          { w: 1, text: { fr: ["Il n'a pas aimé. Un coup de bois dans le ventre, et j'ai volé trois mètres dans un tas de neige. J'ai crié « {w:swear} ». Il m'a regardé{|e} comme si c'était moi, le problème."], en: ["It did not like that. One antler to the stomach and I flew ten feet into a snowbank. I yelled “{w:swear}” It looked at me like I was the problem."] }, fx: { health: -10, happy: -3 }, mood: 'sick' },
        ],
      },
    ],
  },
  {
    id: 'cy_ca_moose_back',
    icon: '🫎',
    cat: 'country',
    rating: 0,
    chainOnly: true,
    scene: { place: 'home', mood: 'love', prop: 'moose', fx: 'hearts' },
    when: { country: ['ca'], age: [16, 90], flag: 'cy_ca_moose' },
    text: {
      fr: [
        "Tu reconnais immédiatement la silhouette dans le jardin : c'est ton orignal. Il est revenu, avec une femelle et deux petits. Ils te regardent tous, comme si tu leur devais quelque chose. Peut-être des géraniums.",
        "Ton orignal est de retour. Il a pris du poids, perdu un bois, et il porte autour du cou {w:object} qu'il a dû voler quelque part. Il s'installe sur ta pelouse comme chez lui.",
        "Le journal local de {city} parle d'un orignal qui attend tous les matins devant la même maison. La tienne. Les voisins t'appellent maintenant « la personne de l'orignal ».",
        "Deux ans après votre rencontre, l'orignal revient chaque printemps. Cette année, il a amené toute sa famille. Ils ont mangé le potager, la clôture et une chaise de jardin. Ils ont l'air heureux.",
      ],
      en: [
        "You recognise the silhouette in the yard immediately: it's your moose. It's back, with a female and two calves. They're all staring at you like you owe them something. Geraniums, maybe.",
        "Your moose is back. It's gained weight, lost an antler, and wears {w:object} around its neck, probably stolen somewhere. It settles on your lawn like it owns the place.",
        "The {city} local paper writes about a moose that waits every morning in front of the same house. Yours. The neighbors now call you “the moose person.”",
        "Two years after you met, the moose returns every spring. This year it brought the whole family. They ate the vegetable patch, the fence and a lawn chair. They look happy.",
      ],
    },
    choices: [
      {
        label: { fr: 'Les nourrir', en: 'Feed them' },
        out: [
          { w: 2, text: { fr: ["Je leur ai donné quatre sacs de pommes. Le petit m'a suivi{|e} jusqu'à la porte. Je l'ai appelé « Sorry ». La famille revient chaque année. Ma pelouse n'existe plus. Mon cœur déborde.", "J'ai nourri la famille d'orignaux tout le printemps. Mon jardin est un désert, mais des touristes paient pour les photographier. J'ai mis une boîte à pourboires."], en: ["I gave them four bags of apples. The calf followed me to the door. I named it “Sorry.” The family comes back every year. My lawn no longer exists. My heart is full.", "I fed the moose family all spring. My yard is a desert, but tourists pay to photograph them. I put out a tip jar."] }, fx: { happy: 10, karma: 4, money: 200, visual: 'hearts' }, mood: 'love' },
        ],
      },
      {
        label: { fr: 'Appeler la faune', en: 'Call wildlife services' },
        text: { fr: ["Le garde-faune est venu, a regardé l'orignal, l'orignal l'a regardé. Ils se sont mis d'accord sans parler. Le garde est reparti. L'orignal est resté. Il a toujours gagné.", "J'ai appelé les services de la faune. Ils m'ont demandé « Gérald ? ». Il est connu. Il a un dossier. Ils n'interviennent plus pour lui depuis 2017."], en: ["The wildlife officer came, looked at the moose, the moose looked at him. They reached an agreement without words. The officer left. The moose stayed. It always wins.", "I called wildlife services. They asked, “Gerald?” He's known. He has a file. They stopped intervening for him in 2017."] },
        fx: { happy: -2, karma: -2, unflag: 'cy_ca_moose' },
      },
    ],
  },
  {
    id: 'cy_ca_winter',
    icon: '🥶',
    cat: 'country',
    rating: 0,
    scene: { place: 'school', mood: 'shock', prop: 'pole' },
    when: { country: ['ca'], age: [6, 12] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Récré à -32 °C. L'école ne ferme qu'à partir de -40. Tu portes six couches de vêtements et tu ne peux plus plier les bras. Un grand de CM2 te met au défi de lécher le poteau du drapeau.",
        "Il a neigé 1,20 m pendant la nuit à {city}. Ta porte d'entrée est bloquée. Ton père creuse un tunnel avec une pelle et une détermination inquiétante. Tu veux construire un fort de neige géant avant l'école.",
        "Ta mère t'habille pour l'école : collants, pantalon, pantalon de neige, deux pulls, manteau, cache-cou, tuque, mitaines et bottes. Ça prend 25 minutes. Tu as envie de faire pipi, maintenant.",
        "Bataille de boules de neige à la récré, {w:weather}. Ton équipe est encerclée. Le chef ennemi, un élève de 3e année nommé Kevin, prépare une boule de neige glacée aussi grosse que {w:food}.",
      ],
      en: [
        "Recess at -26°F. School only closes at -40. You're wearing six layers and can't bend your arms. A big fifth-grader dares you to lick the flagpole.",
        "Four feet of snow fell overnight in {city}. The front door is blocked. Your dad is digging a tunnel with a shovel and worrying determination. You want to build a giant snow fort before school.",
        "Your mom dresses you for school: tights, pants, snow pants, two sweaters, coat, neck warmer, toque, mittens and boots. It takes 25 minutes. You need to pee. Now.",
        "Snowball fight at recess, {w:weather}. Your team is surrounded. The enemy leader, a third-grader named Kevin, is packing an ice ball the size of {w:food}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Lécher le poteau', en: 'Lick the pole' },
        out: [
          { w: 3, text: { fr: ["Ma langue est restée collée au poteau. J'ai crié « aidez-moi » mais ça sonnait comme « aaaiiihhhooo ». Un concierge est venu avec de l'eau tiède. Toute l'école a regardé. Je suis célèbre, en mal.", "Collé{|e}. Vingt minutes. Un professeur a pris une photo pour « le journal de l'école ». Ma langue a encore la forme du poteau."], en: ["My tongue stuck to the pole. I yelled “help me” but it came out “aaaiiihhhooo.” A janitor came with warm water. The whole school watched. I'm famous, the bad way.", "Stuck. Twenty minutes. A teacher took a photo for “the school newsletter.” My tongue is still pole-shaped."] }, fx: { health: -3, happy: -3, fame: 1 }, mood: 'cry' },
          { w: 1, text: { fr: ["J'ai fait semblant de lécher, de très près, sans toucher. Le grand y a cru et a essayé de faire mieux. C'est lui qui est resté collé. Je suis un génie tactique."], en: ["I pretended to lick it, very close, without touching. The big kid believed it and tried to outdo me. He got stuck. I'm a tactical genius."] }, fx: { happy: 8, smarts: 2 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Construire un fort', en: 'Build a snow fort' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai construit un fort de neige avec deux pièces, une fenêtre et un drapeau. Mes voisins sont venus le visiter. Il est resté debout jusqu'en avril. J'ai pleuré à sa fonte.", "Fort de neige géant. On y a tenu un siège de trois récrés contre Kevin. Victoire totale. Les livres d'histoire de l'école en parlent encore."], en: ["I built a snow fort with two rooms, a window and a flag. The neighbors came to visit. It stood until April. I cried when it melted.", "Giant snow fort. We held a three-recess siege against Kevin. Total victory. The school history books still mention it."] }, fx: { happy: 9, athletic: 2 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Rester à l\'intérieur', en: 'Stay inside' },
        text: { fr: ["J'ai demandé à rester à l'intérieur. La maîtresse a dit « tu n'es pas en sucre ». Puis il a fait -41 et l'école a fermé. J'ai eu raison avant tout le monde.", "J'ai simulé un rhume pour rester au chaud. Le lendemain, j'avais vraiment un rhume. Le karma est canadien : poli mais efficace."], en: ["I asked to stay inside. The teacher said “you're not made of sugar.” Then it hit -41 and school closed. I was right before everyone.", "I faked a cold to stay warm. The next day I had a real cold. Karma is Canadian: polite but effective."] },
        fx: { happy: 2, health: -1 },
      },
    ],
  },
  {
    id: 'cy_ca_maple',
    icon: '🍁',
    cat: 'country',
    rating: 1,
    scene: { place: 'office', mood: 'neutral', prop: 'barrel', fx: 'money' },
    when: { country: ['ca'], age: [18, 70] },
    vars: { amount: [2000, 9000] },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "Un type louche t'aborde dans un bar de {city}. Il a un plan : voler des barils dans la Réserve stratégique de sirop d'érable. Oui, ça existe. « Personne surveille du sirop, man. » Ta part : {$amount}.",
        "Tu travailles à l'entrepôt de la Réserve stratégique de sirop d'érable. 50 000 barils. Un collègue te montre qu'il a remplacé le sirop de quelques barils par de l'eau. Il te propose {$amount} pour fermer les yeux.",
        "Ton oncle a une érablière et la saison des sucres commence. Il te propose de l'aider à faire bouillir 400 litres de sève pour faire 10 litres de sirop. Ça prend 3 jours, et il y a {w:animal} dans la cabane.",
        "Marché noir du sirop d'érable : un contact te propose des barils « tombés du camion » à moitié prix. Il porte une chemise à carreaux, une tuque et un regard de trafiquant. Il veut {$amount}.",
      ],
      en: [
        "A shady guy approaches you in a {city} bar. He has a plan: steal barrels from the Strategic Maple Syrup Reserve. Yes, that exists. “Nobody guards syrup, man.” Your cut: {$amount}.",
        "You work at the Strategic Maple Syrup Reserve warehouse. 50,000 barrels. A coworker shows you he's swapped the syrup in a few barrels for water. He offers you {$amount} to look the other way.",
        "Your uncle has a sugar shack and sugaring season is starting. He wants help boiling 100 gallons of sap into 2.5 gallons of syrup. It takes 3 days, and there's {w:animal} in the shack.",
        "Maple syrup black market: a contact offers barrels that “fell off a truck” at half price. He wears plaid, a toque and a smuggler's stare. He wants {$amount}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Entrer dans le coup', en: 'Get in on it' },
        out: [
          { w: 2, text: { fr: ["On a volé 18 barils de nuit. J'ai touché {$amount}. J'ai des taches de sirop jusqu'aux coudes, et les abeilles du quartier me suivent partout. C'est le crime le plus collant de l'histoire.", "Coup réussi. J'ai {$amount} et je ne peux plus voir une crêpe sans transpirer. Les flics enquêtent sur « le Gang du Sirop ». Ils ont des empreintes. Elles sont sucrées."], en: ["We stole 18 barrels at night. I got {$amount}. I'm covered in syrup to the elbows and every bee in the neighborhood follows me. Stickiest crime in history.", "Heist done. I've got {$amount} and I can't look at a pancake without sweating. The cops are investigating “the Syrup Gang.” They have fingerprints. Sweet ones."] }, fx: { money: 'amount', karma: -6, heat: 15, visual: 'money' }, mood: 'proud' },
          { w: 1, text: { fr: ["On s'est fait prendre. Un baril s'est renversé et on s'est retrouvés collés au sol de l'entrepôt comme des mouches sur du papier. Les policiers ont mis une heure à nous décoller."], en: ["We got caught. A barrel tipped over and we got stuck to the warehouse floor like flies on flypaper. The cops took an hour to peel us off."] }, fx: { arrest: 'burglary', karma: -4, visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Aider à la cabane', en: 'Help at the sugar shack' },
        out: [
          { w: 2, text: { fr: ["Trois jours à faire bouillir de la sève. J'ai bu du caribou, mangé de la tire sur la neige et chanté des chansons à répondre. Je sens le sirop jusqu'à l'âme.", "J'ai brassé, goûté, re-goûté. J'ai fait de la tire d'érable sur la neige, qui m'a arraché un plombage. Mon oncle m'a dit « t'es des nôtres asteure »."], en: ["Three days boiling sap. I drank caribou wine, ate maple taffy on snow and sang call-and-response songs. I smell like syrup down to my soul.", "I stirred, tasted, re-tasted. I made maple taffy on snow, which ripped out a filling. My uncle said, “You're one of us now.”"] }, fx: { happy: 9, health: -1, weight: 0.02 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Dénoncer le trafic', en: 'Report it' },
        text: { fr: ["J'ai prévenu la police. L'enquête a fait la une : « Le Grand Vol du Sirop ». On m'a remis une médaille en forme de feuille d'érable et un an de crêpes gratuites.", "J'ai dénoncé le trafiquant. Il m'a regardé{|e} avec tristesse et a dit « sorry » en se faisant menotter. Même les criminels sont polis ici."], en: ["I tipped off the police. The case made headlines: “The Great Syrup Heist.” I got a maple-leaf medal and a year of free pancakes.", "I reported the smuggler. He looked at me sadly and said “sorry” as they cuffed him. Even criminals are polite here."] },
        fx: { karma: 6, fame: 1, happy: 3 },
      },
    ],
  },
  {
    id: 'cy_ca_hockey',
    icon: '🏒',
    cat: 'country',
    rating: 2,
    scene: { place: 'stadium', mood: 'angry', prop: 'puck', fx: 'gore' },
    when: { country: ['ca'], age: [16, 55] },
    weight: 7,
    cooldown: 3,
    text: {
      fr: [
        "Ligue de garage de {city}, mardi 23 h. Ton équipe, les Castors Enragés, joue contre un dentiste, deux plombiers et un comptable qui patine comme un bulldozer. Le comptable vient de te fixer en mimant de t'égorger.",
        "Match de hockey amateur. Le gars d'en face t'a mis un coup de crosse « par accident », puis un deuxième, puis un troisième. Il enlève ses gants. Il te regarde. Dans le hockey canadien, c'est une invitation.",
        "Ton coéquipier, un camionneur de 130 kilos, se fait bousculer. Les règles non écrites du hockey sont claires : quelqu'un doit répondre. Tout le banc se tourne vers toi.",
        "Finale de ligue au petit aréna de {city}. Les gradins sont pleins : 40 personnes, {w:animal} et un vendeur de frites. Il reste deux minutes. Tu as la rondelle et un défenseur barbu fonce sur toi.",
      ],
      en: [
        "Beer league in {city}, Tuesday 11 p.m. Your team, the Rabid Beavers, faces a dentist, two plumbers and an accountant who skates like a bulldozer. The accountant just stared at you and mimed slitting your throat.",
        "Amateur hockey game. The guy across slashed you “by accident,” then again, then a third time. He drops his gloves. He looks at you. In Canadian hockey, that's an invitation.",
        "Your teammate, a 290-pound trucker, gets shoved. The unwritten rules of hockey are clear: someone has to answer. The whole bench turns to look at you.",
        "League final at the little {city} arena. The stands are packed: 40 people, {w:animal} and a fries vendor. Two minutes left. You've got the puck and a bearded defenseman is charging.",
      ],
    },
    choices: [
      {
        label: { fr: 'Jeter les gants', en: 'Drop the gloves' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["On s'est battus comme dans les années 70. J'ai tiré son chandail sur sa tête et cogné. Il a perdu une dent, moi deux. On s'est serré la main en sang, puis on a bu une bière ensemble. Canada.", "Bagarre réglementaire. Mon nez a giclé sur la glace comme une tomate. L'arbitre a laissé faire pendant deux minutes par respect. Puis cinq minutes de pénalité chacun, et un câlin."], en: ["We fought like it was the '70s. I pulled his jersey over his head and swung. He lost a tooth, I lost two. We shook hands, bleeding, then shared a beer. Canada.", "Regulation fight. My nose squirted on the ice like a tomato. The ref let it go two minutes out of respect. Then five-minute majors each, and a hug."] }, fx: { happy: 8, health: -8, looks: -3, visual: 'gore' }, mood: 'party' },
          { w: 1, text: { fr: ["Il m'a mis un uppercut si fort que mon casque a fait trois tours. Je me suis réveillé{|e} dans le vestiaire, un sac de petits pois sur la tête, mon équipe chantant mon nom. On a perdu 9-1."], en: ["He landed an uppercut so hard my helmet spun three times. I woke up in the locker room with a bag of frozen peas on my head, my team chanting my name. We lost 9-1."] }, fx: { health: -12, disease: 'concussion', visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Foncer au but', en: 'Drive to the net' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai dribblé le défenseur barbu et logé la rondelle dans la lucarne. Le vendeur de frites a fait la vague tout seul. On a gagné une coupe en plastique qu'on remplit de bière.", "But ! J'ai glissé sur le ventre jusqu'à la bande pour célébrer, comme les pros. J'ai heurté la bande. Fêlure de côte. Ça valait le coup."], en: ["I deked the bearded defenseman and roofed it top shelf. The fries vendor did the wave all by himself. We won a plastic cup that we fill with beer.", "Goal! I slid on my belly to the boards to celebrate, like the pros. I hit the boards. Cracked rib. Worth it."] }, fx: { happy: 10, athletic: 3, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["Le défenseur m'a écrasé{|e} contre la baie vitrée. Mon visage est resté imprimé sur le plexiglas toute la saison. Les gamins viennent le prendre en photo.", "J'ai pris la rondelle à 140 km/h dans la bouche. Trois dents ont rebondi sur la glace. Le vendeur de frites les a ramassées et me les a rendues, gentiment, dans un cornet."], en: ["The defenseman crushed me into the glass. My face stayed printed on the plexi all season. Kids come to take photos of it.", "I took a 90-mph puck to the mouth. Three teeth bounced across the ice. The fries vendor picked them up and handed them back, kindly, in a paper cone."] }, fx: { health: -10, looks: -4, visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Rester au banc', en: 'Stay on the bench' },
        text: { fr: ["Je suis resté{|e} au banc à manger des bonbons. Mes coéquipiers m'ont surnommé{|e} « le Zamboni » parce que je ne sers qu'entre les périodes. C'est presque affectueux.", "Je suis resté{|e} assis{|e}. Un coéquipier m'a regardé{|e} avec une telle déception que j'ai fait don de mon équipement à une école. Je fais du curling, maintenant."], en: ["I stayed on the bench eating candy. My teammates nicknamed me “the Zamboni” because I'm only useful between periods. It's almost affectionate.", "I stayed seated. A teammate looked at me with such disappointment that I donated my gear to a school. I curl now."] },
        fx: { happy: -2, athletic: -1 },
      },
    ],
  },
  {
    id: 'cy_ca_poutine',
    icon: '🍟',
    cat: 'country',
    rating: 2,
    scene: { place: 'party', mood: 'sick', prop: 'poutine', fx: 'poop' },
    when: { country: ['ca'], age: [18, 70] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "3 h du matin à Montréal après une soirée. Tu commandes une poutine format « familial » : frites, fromage en grains qui fait « couic » sous la dent, sauce brune, et un supplément « smoked meat ». Ton estomac te supplie d'arrêter.",
        "Casse-croûte de bord de route. Le menu propose une poutine « Défi du Bûcheron » : 3 kilos, saucisses, bacon, oignons frits et {w:food} par-dessus. Ta photo au mur si tu finis. Une ambulance si tu échoues.",
        "Concours de poutine au festival de {city}. Le champion en titre, Ti-Guy, en mange quatre kilos en dix minutes et repart en patinant. Ton ami t'a inscrit{|e} sans te demander, {w:excuse}.",
        "Ton coloc québécois est outré : tu as osé dire que la poutine « c'est juste des frites avec de la sauce ». Il t'en prépare une maison pour te convertir. Le fromage couine. La sauce fume. Tu as peur.",
      ],
      en: [
        "3 a.m. in Montreal after a night out. You order a “family size” poutine: fries, cheese curds that squeak on your teeth, brown gravy, and extra smoked meat. Your stomach begs you to stop.",
        "Roadside diner. The menu features the “Lumberjack Challenge” poutine: 6.5 pounds, sausages, bacon, fried onions and {w:food} on top. Your photo on the wall if you finish. An ambulance if you fail.",
        "Poutine contest at the {city} festival. Reigning champ Ti-Guy eats nine pounds in ten minutes and skates off. Your friend signed you up without asking, {w:excuse}.",
        "Your Québécois roommate is outraged: you dared say poutine is “just fries with gravy.” He's making you a homemade one to convert you. The cheese squeaks. The gravy smokes. You're scared.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout engloutir', en: 'Inhale it all' },
        out: [
          { w: 2, text: { fr: ["J'ai tout fini. À 4 h, j'ai vomi une poutine presque intacte dans la neige, encore chaude, en forme de cœur. Un passant l'a prise en photo. C'est devenu l'emblème de mon quartier.", "Poutine engloutie. Mes artères ont envoyé un faire-part. J'ai dormi 14 heures et rêvé que j'étais une frite dans une mer de sauce. C'était paisible."], en: ["I finished it all. At 4 a.m. I puked an almost intact poutine into the snow, still warm, heart-shaped. A passerby photographed it. It's now my neighborhood's emblem.", "Poutine inhaled. My arteries sent out an announcement. I slept 14 hours and dreamed I was a fry in a sea of gravy. It was peaceful."] }, fx: { happy: 8, health: -6, weight: 0.03, visual: 'poop' }, mood: 'sick' },
          { w: 1, odds: { health: 1 }, text: { fr: ["J'ai battu Ti-Guy. Il a pleuré, puis m'a remis sa ceinture de champion, en cuir et en fromage en grains. Le festival m'a nommé{|e} ambassadeur. Je ne peux plus fermer mon manteau.", "Défi du Bûcheron réussi. Le cuisinier m'a serré la main avec respect. Ma photo est au mur. Mon médecin l'a vue et a pleuré."], en: ["I beat Ti-Guy. He cried, then handed me his champion belt, made of leather and cheese curds. The festival named me ambassador. I can't close my coat anymore.", "Lumberjack Challenge done. The cook shook my hand with respect. My photo is on the wall. My doctor saw it and cried."] }, fx: { happy: 10, fame: 2, health: -4, weight: 0.04 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Critiquer la poutine', en: 'Criticise the poutine' },
        out: [
          { w: 1, text: { fr: ["J'ai dit que le fromage « couinait bizarrement ». Mon coloc m'a fixé{|e}, a posé son assiette et a déménagé le lendemain. Il m'a laissé un mot : « Tabarnouche. »", "J'ai suggéré d'ajouter du ketchup. Le cuisinier du casse-croûte m'a mis dehors avec une louche. J'ai été banni{|e} de trois comtés."], en: ["I said the cheese “squeaked weirdly.” My roommate stared at me, set down his plate and moved out the next day. He left a note: “Tabarnouche.”", "I suggested adding ketchup. The diner cook chased me out with a ladle. I'm banned from three counties."] }, fx: { happy: -3, karma: -2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Partager', en: 'Share it' },
        text: { fr: ["J'ai partagé ma poutine avec un inconnu assis sur le trottoir. Il m'a raconté sa vie, puis la mienne, qu'il connaissait étrangement bien. On ne s'est jamais revus. Je pense à lui en hiver.", "Poutine partagée avec trois amis et un raton laveur qui passait. Le raton laveur a pris le plus gros morceau. Respect."], en: ["I shared my poutine with a stranger sitting on the curb. He told me his life story, then mine, which he knew strangely well. Never saw him again. I think of him in winter.", "Poutine shared with three friends and a passing raccoon. The raccoon took the biggest piece. Respect."] },
        fx: { happy: 5, karma: 3 },
      },
    ],
  },
  {
    id: 'cy_ca_bear',
    icon: '🐻',
    cat: 'country',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'bear', fx: 'gore' },
    when: { country: ['ca'], age: [18, 80] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: [
        "Week-end au chalet. Un ours noir est entré dans la cuisine par la porte-moustiquaire. Il mange ton barbecue, tes guimauves et la poubelle. Tu as une crosse de hockey et un pyjama à orignaux.",
        "Camping dans un parc national près de {city}. 3 h du matin. Quelque chose renifle ta tente. Quelque chose de gros. Ça sent {w:smell}. Tu as oublié {w:food} dans ton sac de couchage.",
        "Un ours a pris possession de ta voiture. Il est assis au volant, la ceinture mal attachée, et klaxonne de temps en temps. Les voisins filment. Tu as tes clés dans la main et aucun plan.",
        "Rando en forêt. Le panneau disait « Zone d'ours, faites du bruit ». Tu as chanté {w:song} à pleins poumons. Un grizzly vient d'apparaître. Il n'a pas l'air d'aimer la chanson.",
      ],
      en: [
        "Weekend at the cabin. A black bear came into the kitchen through the screen door. It's eating your barbecue, your marshmallows and the trash. You've got a hockey stick and moose pajamas.",
        "Camping in a national park near {city}. 3 a.m. Something is sniffing your tent. Something big. It gives off {w:smell}. You forgot {w:food} in your sleeping bag.",
        "A bear has taken over your car. It's sitting behind the wheel, seatbelt badly fastened, honking now and then. Neighbors are filming. You have your keys in hand and no plan.",
        "Forest hike. The sign said “Bear area, make noise.” You belted out {w:song} at full volume. A grizzly just appeared. It doesn't seem to like the song.",
      ],
    },
    choices: [
      {
        label: { fr: 'Se battre avec la crosse', en: 'Fight with the stick' },
        out: [
          { w: 2, text: { fr: ["J'ai frappé l'ours avec ma crosse de hockey. Il m'a regardé{|e}, a pris la crosse et l'a cassée en deux comme un cure-dent. Puis il est reparti avec le barbecue. Je l'ai remercié, par réflexe.", "Un coup de crosse sur le museau. L'ours a reculé, vexé, et s'est enfui avec un paquet de guimauves. J'ai été sacré{|e} héros du lac. Je tremble encore."], en: ["I whacked the bear with my hockey stick. It looked at me, took the stick and snapped it like a toothpick. Then it left with the barbecue. I thanked it, out of reflex.", "One stick to the snout. The bear backed off, offended, and ran away with a bag of marshmallows. I'm now the hero of the lake. Still shaking."] }, fx: { happy: 6, stress: 8, fame: 1 }, mood: 'shock' },
          { w: 1, text: { fr: ["L'ours m'a donné une gifle qui m'a fait faire un salto dans le lac. J'ai perdu un bout d'oreille, qu'il a mangé comme une guimauve. Il est reparti satisfait.", "Mauvaise idée. L'ours a répondu par un coup de patte qui m'a arraché un morceau de mollet. Il l'a dégusté devant moi, en me regardant, sans se presser."], en: ["The bear slapped me into a backflip into the lake. I lost part of an ear, which it ate like a marshmallow. It left satisfied.", "Bad idea. The bear answered with a swipe that tore off a chunk of my calf. It savored it in front of me, staring, taking its time."] }, fx: { health: -18, looks: -5, visual: 'gore' }, mood: 'sick' },
          { w: 1, rating: 2, text: { fr: ["L'ours a gagné. Très nettement. Le garde forestier a retrouvé ma crosse, une pantoufle et la moitié d'un pyjama à orignaux. L'ours, lui, a pris trois kilos."], en: ["The bear won. Decisively. The ranger found my hockey stick, one slipper and half of my moose pajamas. The bear gained six pounds."] }, fx: { die: { fr: 'dévoré{|e} par un ours en pyjama à orignaux', en: 'eaten by a bear while wearing moose pajamas' }, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire le mort', en: 'Play dead' },
        out: [
          { w: 2, text: { fr: ["J'ai fait le mort. L'ours m'a reniflé, m'a léché l'oreille et s'est assis sur moi pendant vingt minutes, comme sur un pouf. Puis il a lâché un pet monumental et il est parti.", "Imitation de cadavre parfaite. L'ours a perdu tout intérêt et a mangé {w:food} à la place. J'ai survécu, mais je sens l'ours pour toujours."], en: ["I played dead. The bear sniffed me, licked my ear and sat on me for twenty minutes like a beanbag. Then it let out a monumental fart and left.", "Perfect fake death. The bear lost interest and ate {w:food} instead. I survived, but I smell like bear forever."] }, fx: { stress: 10, happy: 2, visual: 'poop' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Courir', en: 'Run' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: ["J'ai couru plus vite que jamais. Je n'avais pas besoin de battre l'ours, seulement mon beau-frère. Il va bien. Il a un peu moins de fesse.", "J'ai couru, sauté dans la voiture et démarré en trombe. Avec l'ours à la place du passager. On a fait trois kilomètres ensemble avant qu'il descende. Il a mis la radio."], en: ["I ran faster than ever. I didn't need to outrun the bear, just my brother-in-law. He's fine. He has slightly less butt.", "I ran, jumped in the car and floored it. With the bear in the passenger seat. We rode two miles together before it got out. It changed the radio station."] }, fx: { athletic: 3, stress: 8, karma: -2 }, mood: 'shock' },
        ],
      },
    ],
  },
  // ═════════════════════════════ JAPON ═════════════════════════════
  {
    id: 'cy_jp_vending',
    icon: '🥫',
    cat: 'country',
    rating: 0,
    scene: { place: 'park', mood: 'happy', prop: 'vending_machine' },
    when: { country: ['jp'], age: [6, 90] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Au coin de ta rue à {city}, un nouveau distributeur automatique est apparu. Il vend de la soupe de maïs chaude en canette, des parapluies, des œufs durs, du pain en boîte et {w:object}. Il te dit « bonjour » d'une voix enregistrée.",
        "Tu es au sommet d'une montagne, à deux heures de marche de toute civilisation. Il y a un distributeur automatique. Il fonctionne. Il propose 48 boissons, dont un café au lait qui sort brûlant et un soda au melon qui dégage {w:smell}.",
        "Le distributeur de la gare a un bouton mystère : « ??? ». Le prix est normal. Les gens autour de toi l'évitent soigneusement. Un lycéen te dit qu'un jour, quelqu'un a obtenu {w:gift}.",
        "Un distributeur de {city} propose des ramen chauds, une cravate de rechange, des chaussettes et un bouquet de fleurs « en cas d'oubli d'anniversaire ». Tu as des pièces et une curiosité insatiable.",
      ],
      en: [
        "On your corner in {city}, a new vending machine has appeared. It sells hot corn soup in a can, umbrellas, boiled eggs, bread in a can and {w:object}. It says “welcome” in a recorded voice.",
        "You're on a mountaintop, two hours' hike from civilization. There's a vending machine. It works. It offers 48 drinks, including a scalding café au lait and a melon soda that gives off {w:smell}.",
        "The station vending machine has a mystery button: “???”. Normal price. People around you avoid it carefully. A high schooler tells you someone once got {w:gift}.",
        "A {city} vending machine sells hot ramen, a spare necktie, socks and a bouquet “in case you forgot an anniversary.” You've got coins and insatiable curiosity.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le bouton mystère', en: 'The mystery button' },
        out: [
          { w: 2, text: { fr: ["Bouton mystère : une canette de « Sueur d'athlète », une vraie boisson. Elle a un goût de pamplemousse et de vestiaire. J'en ai racheté six.", "Le bouton mystère m'a donné {w:gift} en canette. Je ne sais pas comment ils l'ont fait rentrer dedans. Je ne veux pas savoir."], en: ["Mystery button: a can of “Athlete Sweat,” a real drink. It tastes of grapefruit and locker room. I bought six more.", "The mystery button gave me {w:gift} in a can. I don't know how they fit it inside. I don't want to know."] }, fx: { happy: 6 }, mood: 'happy' },
          { w: 1, text: { fr: ["Le distributeur m'a donné une canette de soupe d'anguille gélifiée. Je l'ai bue par politesse envers la machine. Elle m'a dit « merci ». J'ai pleuré un peu."], en: ["The machine gave me a can of jellied eel soup. I drank it out of politeness to the machine. It said “thank you.” I cried a little."] }, fx: { happy: 2, health: -1 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Soupe de maïs chaude', en: 'Hot corn soup' },
        out: [
          { w: 2, text: { fr: ["Soupe de maïs en canette, brûlante. Il reste toujours trois grains au fond que personne n'arrive à attraper. J'ai passé dix minutes à taper la canette. C'est une méditation.", "J'ai bu la soupe en regardant la neige tomber. C'était le meilleur repas de ma vie, et il coûtait 130 yens. J'ai fait une révérence à la machine."], en: ["Canned corn soup, scalding hot. There are always three kernels stuck at the bottom that nobody can get out. I spent ten minutes tapping the can. It's a meditation.", "I drank the soup watching snow fall. Best meal of my life, and it cost 130 yen. I bowed to the machine."] }, fx: { happy: 5, health: 1 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Tout acheter', en: 'Buy one of everything' },
        text: { fr: ["J'ai acheté un article de chaque. Je rentre avec un parapluie, une cravate, deux œufs, du pain en boîte et un bouquet. Ma mère croit que j'ai une double vie.", "J'ai vidé la machine. Le livreur est arrivé, m'a vu{|e}, a hoché la tête avec respect et l'a remplie à nouveau. Je l'ai revidée. C'est notre jeu, maintenant."], en: ["I bought one of each item. I'm walking home with an umbrella, a necktie, two eggs, canned bread and a bouquet. My mom thinks I have a double life.", "I emptied the machine. The restocker arrived, saw me, nodded with respect and refilled it. I emptied it again. It's our game now."] },
        fx: { happy: 6, money: -40 },
      },
    ],
  },
  {
    id: 'cy_jp_bento',
    icon: '🍱',
    cat: 'country',
    rating: 0,
    scene: { place: 'school', mood: 'shock', prop: 'bento' },
    when: { country: ['jp'], age: [6, 12] },
    actor: 'parent',
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Pause déjeuner à l'école. Le bento de ton voisin représente un panda en riz qui mange un bambou en concombre. Celui de ta voisine reproduit La Joconde en algues. {a.rel} t'a fait un bento. Tu n'oses pas l'ouvrir.",
        "À {school}, c'est l'heure du ménage : les élèves nettoient eux-mêmes la classe et les couloirs. Tu as tiré les toilettes. En ouvrant la porte, tu découvres {w:object} et une odeur mystérieuse.",
        "Concours du plus beau bento de la classe. {a.rel} s'est {a:levé|levée} à 4 h du matin pour te préparer quelque chose. Tu as entendu des bruits de découpe et un juron à travers le mur. Ton cartable dégage {w:smell}.",
        "Le maître annonce que demain, chacun doit apporter un bento « qui raconte une histoire ». {a.rel} a l'air très, très {a:motivé|motivée}. Des emporte-pièces en forme d'animaux ont été achetés. Et aussi {w:food}.",
      ],
      en: [
        "Lunch break at school. Your neighbor's bento is a rice panda eating a cucumber bamboo. The girl next to you has the Mona Lisa in seaweed. {a.rel} made you a bento. You don't dare open it.",
        "At {school}, it's cleaning time: students clean the classroom and halls themselves. You drew the toilets. Opening the door, you find {w:object} and a mysterious smell.",
        "Prettiest bento contest in class. {a.rel} got up at 4 a.m. to make you something. You heard chopping and a curse word through the wall. You smell {w:smell} in your backpack.",
        "The teacher announces that tomorrow everyone must bring a bento “that tells a story.” {a.rel} looks very, very motivated. Animal-shaped cutters have been purchased. Also {w:food}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Ouvrir fièrement', en: 'Open it proudly' },
        out: [
          { w: 2, text: { fr: ["{a.my} avait fait un samouraï en omelette combattant un dragon en saucisse. Toute la classe s'est levée pour applaudir. Le maître a pris une photo. J'ai gagné le concours.", "Mon bento représentait ma tête en riz, avec des larmes en sauce soja. C'était étrangement ressemblant. Tout le monde a voulu une photo."], en: ["{a.my} had made an omelette samurai fighting a sausage dragon. The whole class stood to applaud. The teacher took a photo. I won the contest.", "My bento was my own face in rice, with soy-sauce tears. It was eerily accurate. Everyone wanted a picture."] }, fx: { happy: 9, rel: 8 }, mood: 'proud' },
          { w: 1, text: { fr: ["Le bento de {a.my} était censé être un chat. Il ressemblait à un accident de voiture. Un camarade a demandé « c'est quoi ce monstre ? ». J'ai répondu « l'amour »."], en: ["{a.my}'s bento was supposed to be a cat. It looked like a car crash. A classmate asked, “What's that monster?” I said, “Love.”"] }, fx: { happy: 3, rel: 5 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Nettoyer à fond', en: 'Clean like a pro' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai frotté les toilettes jusqu'à pouvoir m'y voir. Le directeur est passé, a inspecté, et m'a fait un petit signe de tête. C'est la plus haute distinction de l'école.", "J'ai tout nettoyé, même sous les lavabos. J'y ai trouvé une gomme de 1994 et un mot d'amour non envoyé. Je l'ai gardé. C'est mon trésor."], en: ["I scrubbed the toilets until I could see my reflection. The principal walked by, inspected, and gave me a tiny nod. Highest honor at the school.", "I cleaned everything, even under the sinks. I found an eraser from 1994 and an unsent love note. I kept it. It's my treasure."] }, fx: { discipline: 4, happy: 3, grade: 2 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Échanger mon bento', en: 'Trade my bento' },
        text: { fr: ["J'ai échangé mon bento contre le panda en riz. J'ai mangé le panda. Il était moins bon que beau. Mon voisin a adoré mon onigiri tout simple. Le monde est étrange.", "J'ai troqué mon bento contre trois bonbons et une carte Pokémon brillante. {a.my} ne doit jamais le savoir."], en: ["I traded my bento for the rice panda. I ate the panda. It was prettier than tasty. My neighbor loved my plain rice ball. The world is strange.", "I swapped my bento for three candies and a shiny trading card. {a.my} must never know."] },
        fx: { happy: 4, rel: -3 },
      },
    ],
  },
  {
    id: 'cy_jp_train',
    icon: '🚇',
    cat: 'country',
    rating: 1,
    scene: { place: 'office', mood: 'shock', prop: 'train' },
    when: { country: ['jp'], age: [18, 65] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Heure de pointe à Tokyo. Des employés en gants blancs poussent les passagers dans le wagon comme on tasse une valise. Ton visage est collé contre l'aisselle d'un salarié et ton pied gauche est quelque part, mais pas avec toi.",
        "Ton train a 47 secondes de retard. La compagnie ferroviaire présente ses excuses officielles par haut-parleur, puis distribue des « certificats de retard » à présenter à ton employeur. Le conducteur s'incline sur le quai.",
        "Dans le métro de {city}, le silence est total. Personne ne parle, personne ne téléphone. Soudain, ton téléphone sonne à plein volume avec {w:song}. Cinquante personnes ne te regardent pas, très fort.",
        "Tu t'es endormi{|e} dans le train, comme tout le monde. Ta tête a glissé sur l'épaule d'un monsieur en costume. Il ne bouge pas. Il ne dira rien. Tu baves légèrement sur sa veste hors de prix. Il dégage {w:smell}.",
      ],
      en: [
        "Rush hour in Tokyo. Staff in white gloves push passengers into the car like packing a suitcase. Your face is pressed into a salaryman's armpit and your left foot is somewhere, but not with you.",
        "Your train is 47 seconds late. The railway company apologizes officially over the loudspeaker, then hands out “delay certificates” to show your employer. The driver bows on the platform.",
        "On the {city} subway, total silence. Nobody talks, nobody calls. Suddenly your phone rings at full volume with {w:song}. Fifty people are not looking at you, very intensely.",
        "You fell asleep on the train, like everyone. Your head slid onto a suited man's shoulder. He doesn't move. He'll never say anything. You're drooling slightly on his very expensive jacket. He smells of {w:smell}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Accepter mon sort', en: 'Accept my fate' },
        out: [
          { w: 2, text: { fr: ["J'ai voyagé 40 minutes sans toucher le sol, porté{|e} par la foule. À l'arrivée, j'avais perdu une chaussure et gagné une cravate qui n'est pas la mienne. J'ai la carte de visite de quelqu'un dans ma poche.", "J'ai fermé les yeux et je me suis laissé{|e} porter. Une forme de zen. À la sortie, mon costume était froissé en forme de trois autres personnes."], en: ["I rode 40 minutes without touching the floor, carried by the crowd. At my stop I'd lost a shoe and gained a tie that isn't mine. Someone's business card is in my pocket.", "I closed my eyes and let myself be carried. A kind of zen. When I got out, my suit was creased in the shape of three other people."] }, fx: { stress: 4, happy: -1 }, mood: 'sleepy' },
        ],
      },
      {
        label: { fr: 'Utiliser le certificat', en: 'Use the certificate' },
        out: [
          { w: 2, text: { fr: ["J'ai présenté mon certificat de retard de 47 secondes à mon chef. Il l'a lu, l'a tamponné, l'a classé dans un dossier « Retards ferroviaires 2026 ». Il y en a douze. Tous à mon nom.", "Mon chef a accepté le certificat, mais m'a demandé pourquoi je n'avais pas pris le train précédent « par prudence ». Je suis arrivé{|e} une heure en avance tous les jours depuis."], en: ["I showed my boss my 47-second delay certificate. He read it, stamped it, and filed it in a folder labeled “Rail Delays 2026.” There are twelve. All mine.", "My boss accepted the certificate, but asked why I hadn't taken the earlier train “as a precaution.” I've arrived an hour early every day since."] }, fx: { discipline: 3, stress: 2, perf: 1 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Répondre au téléphone', en: 'Answer the phone' },
        out: [
          { w: 1, text: { fr: ["J'ai décroché et parlé à voix haute. Un vieux monsieur a soupiré. Une collégienne a filmé. J'ai fait la une d'un forum : « Le monstre du wagon 4 ». J'ai changé de ligne.", "J'ai répondu en chuchotant, la main devant la bouche. C'était ma mère. Elle voulait savoir si j'avais mangé. Tout le wagon a entendu « oui maman ». Ils ont souri, discrètement."], en: ["I picked up and spoke out loud. An old man sighed. A schoolgirl filmed. I made the front page of a forum: “The Monster of Car 4.” I changed lines.", "I answered in a whisper, hand over my mouth. It was my mom. She wanted to know if I'd eaten. The whole car heard “yes, Mom.” They smiled, discreetly."] }, fx: { stress: 5, happy: -2 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'cy_jp_karaoke',
    icon: '🎤',
    cat: 'country',
    rating: 1,
    scene: { place: 'party', mood: 'party', prop: 'microphone' },
    when: { country: ['jp'], age: [22, 65], job: true },
    actor: 'boss',
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Nomikai : soirée obligatoire avec les collègues de {employer}. Après le restaurant et deux bars, direction le karaoké. {a.first}, {a:ton chef|ta cheffe}, chante une ballade enka de neuf minutes en pleurant. Puis {a:il|elle} te tend le micro.",
        "1 h du matin, cabine de karaoké, sixième tournée de bière. {a.first} est debout sur le canapé, cravate autour de la tête, et hurle {w:song}. {a:Il|Elle} dit que ton tour arrive « et que l'avancement en dépend ».",
        "Ton équipe t'emmène au karaoké pour fêter un contrat. La règle tacite : on ne refuse jamais un verre servi par son supérieur, et on ne chante jamais mieux que {a:lui|elle}. {a.first} chante faux comme {w:animal}.",
        "Le karaoké est fourni avec des tambourins, des perruques et une télécommande de 400 boutons. {a.first} a choisi un duo pour vous deux : une chanson d'amour. {a:Il|Elle} te fixe avec sérieux.",
      ],
      en: [
        "Nomikai: mandatory drinks with your {employer} coworkers. After dinner and two bars, off to karaoke. {a.first}, your boss, sings a nine-minute enka ballad in tears. Then hands you the mic.",
        "1 a.m., karaoke booth, sixth round of beers. {a.first} is standing on the couch, tie around his head, screaming {w:song}. {a.first} says your turn is next “and your promotion depends on it.”",
        "Your team takes you to karaoke to celebrate a deal. Unspoken rule: never refuse a drink poured by your superior, and never sing better than the boss. {a.first} sings as off-key as {w:animal}.",
        "The karaoke booth comes with tambourines, wigs and a 400-button remote. {a.first} picked a duet for the two of you: a love song. {a.first} is staring at you very seriously.",
      ],
    },
    choices: [
      {
        label: { fr: 'Chanter à fond', en: 'Sing your heart out' },
        out: [
          { w: 2, text: { fr: ["J'ai chanté {w:song} avec une passion déchirante. {a.my} a pleuré, m'a serré{|e} dans ses bras et m'a appelé{|e} « mon enfant spirituel ». Le lundi, {a:il|elle} a fait comme si rien ne s'était passé. Mais j'ai eu une prime.", "J'ai fait un duo avec {a.my}, à genoux, perruque rose sur la tête. {a:Il|Elle} a frappé la mesure au tambourin. On ne s'en parlera jamais. Mais l'avancement est arrivé."], en: ["I sang {w:song} with heart-wrenching passion. {a.my} cried, hugged me and called me {a.his} “spiritual child.” On Monday, {a.he} acted like nothing happened. But I got a bonus.", "I did a duet with {a.my}, on my knees, pink wig on. {a.first} kept time on the tambourine. We'll never speak of it. But the promotion came."] }, fx: { happy: 8, perf: 6, rel: 10, addiction: ['alcohol', 3] }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai trop bien chanté. Mieux que {a.my}. Silence glacial. On m'a muté{|e} au service des archives au sous-sol, à côté de la chaudière.", "J'ai chanté si fort que j'ai cassé le micro. Le gérant a facturé 30 000 yens. {a.my} a payé, en me regardant comme un investissement raté."], en: ["I sang too well. Better than {a.my}. Icy silence. I've been transferred to the basement archives, next to the boiler.", "I sang so loud I broke the mic. The manager charged 30,000 yen. {a.my} paid, looking at me like a bad investment."] }, fx: { perf: -5, rel: -8, happy: -2 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Remplir les verres', en: 'Keep pouring drinks' },
        out: [
          { w: 2, text: { fr: ["J'ai passé la soirée à remplir les verres de tout le monde, en m'inclinant. Personne n'a remarqué que je ne buvais rien. Je suis un ninja de la politesse.", "Je servais, ils buvaient. À 3 h, j'étais le seul debout. J'ai mis tout le monde dans des taxis et récupéré la carte de crédit de {a.my}, qu'{a:il|elle} m'a confiée « pour toujours »."], en: ["I spent the night refilling everyone's glass, bowing. Nobody noticed I wasn't drinking. I'm a politeness ninja.", "I poured, they drank. By 3 a.m. I was the only one standing. I put everyone in taxis and kept {a.my}'s credit card, which {a.he} entrusted to me “forever.”"] }, fx: { discipline: 3, perf: 4, rel: 5 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Prétexter le dernier train', en: 'Claim the last train' },
        text: { fr: ["J'ai dit que je devais attraper le dernier train. Tout le monde a hoché la tête, compréhensif. J'ai raté le train exprès, pour rien, et dormi dans un cybercafé. Liberté.", "J'ai fui en évoquant le dernier train. {a.my} m'a envoyé un selfie en larmes, avec la légende « tu manques à l'équipe ». Je la garde pour son pot de départ."], en: ["I said I had to catch the last train. Everyone nodded, understanding. I missed it on purpose, for nothing, and slept in an internet café. Freedom.", "I fled citing the last train. {a.my} sent me a selfie in tears captioned “the team misses you.” Saving it for {a.his} retirement party."] },
        fx: { happy: 3, rel: -4, stress: -2 },
      },
    ],
  },
  {
    id: 'cy_jp_capsule',
    icon: '🛏️',
    cat: 'country',
    rating: 1,
    scene: { place: 'apartment', mood: 'sleepy', prop: 'capsule' },
    when: { country: ['jp'], age: [18, 60] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Tu as raté le dernier train. Options : hôtel-capsule (une boîte de 1 m sur 2 avec une télé), manga café (un fauteuil, 9 000 mangas et une boisson à volonté), ou banc public {w:weather}.",
        "Nuit en hôtel-capsule à {city}. Ta capsule est entre un salarié qui ronfle comme une tronçonneuse et un touriste qui sent {w:smell}. Le rideau ne ferme qu'à moitié. Il est 2 h 40.",
        "Tu as trop bu et tu as raté le dernier métro. Il est 0 h 47. Un monsieur en costume dort debout contre un poteau, parfaitement immobile, sa mallette à la main. Il a l'air de maîtriser la situation.",
        "Le manga café propose une cabine pour la nuit, une douche, des boissons à volonté et la collection complète d'une série de 107 tomes. Tu dois être au bureau à 9 h. Tu as {w:food} dans ton sac.",
      ],
      en: [
        "You missed the last train. Options: capsule hotel (a 3-by-6-foot box with a TV), manga café (an armchair, 9,000 manga and free drinks), or a park bench {w:weather}.",
        "Night at a {city} capsule hotel. Your capsule is between a salaryman snoring like a chainsaw and a tourist who gives off {w:smell}. The curtain only half closes. It's 2:40 a.m.",
        "You drank too much and missed the last subway. It's 12:47 a.m. A man in a suit is sleeping upright against a pole, perfectly still, briefcase in hand. He seems to have it under control.",
        "The manga café offers a booth for the night, a shower, unlimited drinks and the complete 107-volume run of a series. You have to be at work at 9. You've got {w:food} in your bag.",
      ],
    },
    choices: [
      {
        label: { fr: 'Hôtel-capsule', en: 'Capsule hotel' },
        out: [
          { w: 2, text: { fr: ["J'ai dormi dans ma capsule comme un bébé dans un placard. Le matin, je me suis cogné la tête en me levant, comme tout le monde. On s'est tous salués en se frottant le front.", "Capsule confortable, mais le voisin parlait dans son sommeil. Il a récité un rapport trimestriel entier. J'ai appris des choses sur l'industrie du boulon."], en: ["I slept in my capsule like a baby in a cupboard. In the morning I hit my head getting up, like everyone. We all greeted each other rubbing our foreheads.", "Comfy capsule, but my neighbor talked in his sleep. He recited an entire quarterly report. I learned things about the bolt industry."] }, fx: { health: 2, stress: -2, money: -40 }, mood: 'sleepy' },
        ],
      },
      {
        label: { fr: 'Manga café', en: 'Manga café' },
        out: [
          { w: 2, text: { fr: ["Je voulais lire un tome et dormir. J'ai lu 38 tomes. À 8 h 50, j'ai couru au bureau, les yeux rouges, en pleurant la mort d'un personnage secondaire. Mon chef a cru à un deuil.", "J'ai bu 14 sodas à volonté et lu jusqu'à l'aube. Je n'ai pas dormi, mais je connais maintenant tous les secrets d'une famille de ninjas fictifs."], en: ["I meant to read one volume and sleep. I read 38. At 8:50 a.m. I ran to the office, red-eyed, crying over a side character's death. My boss thought I was grieving.", "I drank 14 free sodas and read until dawn. No sleep, but I now know every secret of a fictional ninja family."] }, fx: { happy: 7, health: -3, perf: -2 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Dormir debout', en: 'Sleep standing up' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: ["J'ai imité le monsieur au poteau. J'ai dormi debout cinq heures. Je me suis réveillé{|e} reposé{|e}, la cravate impeccable. J'ai atteint un niveau supérieur de salarié.", "J'ai dormi debout contre un distributeur. Il m'a gardé{|e} au chaud. Au matin, un agent de propreté m'a souhaité une bonne journée avec une révérence."], en: ["I copied the man at the pole. Slept standing for five hours. Woke up rested, tie impeccable. I've reached a higher level of salaryman.", "I slept standing against a vending machine. It kept me warm. In the morning, a cleaner bowed and wished me a good day."] }, fx: { discipline: 4, health: -1 }, mood: 'proud' },
          { w: 1, text: { fr: ["Je me suis endormi{|e} debout, puis j'ai basculé lentement, comme un arbre, sur trois passants. On est tous tombés comme des dominos. Personne n'a crié. Tout le monde s'est excusé."], en: ["I fell asleep standing, then slowly toppled like a tree onto three passersby. We all went down like dominoes. Nobody yelled. Everybody apologized."] }, fx: { health: -3, stress: 3 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'cy_jp_onsen',
    icon: '♨️',
    cat: 'country',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'onsen' },
    when: { country: ['jp'], age: [18, 85] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "Onsen de montagne. Règles : on se lave entièrement avant d'entrer, on entre tout nu, la petite serviette va sur la tête et JAMAIS dans l'eau, et les tatouages sont interdits. Tu as un tatouage représentant {w:animal} sur la fesse, fait à 19 ans.",
        "Bain thermal public. Tu es nu{|e}, assis{|e} sur un petit tabouret, à te laver devant un miroir. À côté de toi, un monsieur de 80 ans se savonne avec une concentration de chirurgien. Il te regarde te savonner. Tu le fais mal.",
        "Onsen en plein air sous la neige. Des singes sauvages se baignent dans le bassin voisin. L'un d'eux te regarde avec mépris, puis vient voler ta petite serviette. Tu es tout nu dans la neige.",
        "Ryokan traditionnel près de {city}. Le bain est à 44 °C. Les habitués y entrent lentement en disant « aaaah ». Toi, tu as l'impression d'être {w:food} en train de cuire.",
      ],
      en: [
        "Mountain onsen. Rules: wash completely before entering, go in fully naked, the little towel goes on your head and NEVER in the water, and tattoos are banned. You have a tattoo of {w:animal} on your butt, from when you were 19.",
        "Public hot spring. You're naked on a little stool, washing in front of a mirror. Next to you, an 80-year-old man soaps himself with a surgeon's focus. He watches you soap yourself. You're doing it wrong.",
        "Open-air onsen in the snow. Wild monkeys are bathing in the next pool. One of them looks at you with contempt, then steals your little towel. You're stark naked in the snow.",
        "Traditional inn near {city}. The bath is 111°F. Regulars slip in slowly, going “aaaah.” You feel like {w:food} being cooked.",
      ],
    },
    choices: [
      {
        label: { fr: 'Cacher le tatouage', en: 'Hide the tattoo' },
        out: [
          { w: 2, text: { fr: ["J'ai collé un pansement géant sur ma fesse. Il s'est décollé dans l'eau et a flotté jusqu'au visage d'un monsieur. On m'a raccompagné{|e} à la sortie, tout nu{|e}, avec une révérence.", "J'ai marché à reculons jusqu'au bassin pour cacher mon tatouage. J'ai glissé sur le carrelage et fait un grand écart nu devant douze retraités. L'un d'eux a applaudi."], en: ["I stuck a giant band-aid on my butt. It came off in the water and floated to a man's face. I was escorted out, naked, with a bow.", "I walked backwards to the pool to hide my tattoo. I slipped on the tiles and did the splits naked in front of twelve retirees. One of them clapped."] }, fx: { happy: -3, stress: 6, health: -2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Suivre le rituel', en: 'Follow the ritual' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["Lavage parfait, serviette sur la tête, entrée lente avec un « aaaah » réglementaire. Le vieux monsieur m'a fait un signe de tête. J'ai atteint le nirvana, avec les testicules ou les seins cuits à point.", "J'ai suivi le rituel à la lettre. Vingt minutes à 44 °C. Je suis ressorti{|e} rouge comme un homard, détendu{|e} comme une nouille, et totalement en paix."], en: ["Perfect wash, towel on head, slow entry with a regulation “aaaah.” The old man nodded at me. I reached nirvana, with my private parts cooked medium-rare.", "I followed the ritual to the letter. Twenty minutes at 111°F. I came out lobster-red, relaxed as a noodle, and completely at peace."] }, fx: { happy: 9, stress: -10, health: 3 }, mood: 'happy' },
          { w: 1, text: { fr: ["Je suis resté{|e} trop longtemps. Je me suis évanoui{|e} dans le bassin, nu{|e}, et trois papis m'ont sorti{|e} comme un sac de riz. Ils m'ont posé{|e} sur un banc avec la serviette sur le visage, par pudeur. Pour eux."], en: ["I stayed in too long. I fainted in the pool, naked, and three grandpas hauled me out like a sack of rice. They laid me on a bench with the towel over my face, for modesty. Theirs."] }, fx: { health: -5, happy: -2 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Chasser le singe', en: 'Chase the monkey' },
        out: [
          { w: 1, text: { fr: ["J'ai poursuivi le singe tout nu{|e} dans la neige. Un car de touristes est arrivé. J'apparais dans 400 albums de vacances, flouté{|e} au mieux. Le singe a gardé la serviette.", "Le singe m'a rendu ma serviette... après s'être essuyé les fesses avec. Puis il m'a mordu{|e} le mollet. J'ai fini la soirée à l'infirmerie, nu{|e} sous une couverture."], en: ["I chased the monkey naked through the snow. A tour bus arrived. I appear in 400 vacation albums, blurred at best. The monkey kept the towel.", "The monkey gave back my towel… after wiping its butt with it. Then it bit my calf. I spent the evening at the infirmary, naked under a blanket."] }, fx: { happy: 2, health: -4, fame: 1 }, mood: 'angry' },
        ],
      },
    ],
  },
  {
    id: 'cy_jp_salaryman',
    icon: '💼',
    cat: 'country',
    rating: 2,
    scene: { place: 'office', mood: 'sleepy', prop: 'desk' },
    when: { country: ['jp'], age: [22, 62], job: true },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Il est 22 h 30 chez {employer}. Ton travail est fini depuis 18 h. Mais ton chef est encore là, et personne ne part avant le chef. Le chef, lui, attend que le directeur parte. Le directeur dort à son bureau depuis 2019.",
        "Ton entreprise organise sa réunion pour préparer la réunion qui préparera la réunion de lundi. Il faut 14 tampons sur le document. Le tampon numéro 9 est en vacances {w:far_place}.",
        "Tu as pris un jour de congé. Le premier en trois ans. Le lendemain, tes collègues t'accueillent avec un silence lourd et une boîte de gâteaux d'excuse, qu'on attend que TU leur offres.",
        "Un collègue s'est endormi debout pendant la réunion du matin. Personne ne le réveille : c'est un signe d'implication. Le directeur cite son « dévouement exemplaire ». Tu sens tes paupières tomber {w:time}.",
      ],
      en: [
        "It's 10:30 p.m. at {employer}. Your work was done at 6. But your boss is still here, and nobody leaves before the boss. The boss waits for the director to leave. The director has been asleep at his desk since 2019.",
        "Your company is holding a meeting to prepare the meeting that will prepare Monday's meeting. The document needs 14 stamps. Stamp number 9 is on vacation {w:far_place}.",
        "You took a day off. The first in three years. The next day, coworkers greet you with heavy silence and expect YOU to bring a box of apology cakes.",
        "A coworker fell asleep standing in the morning meeting. Nobody wakes him: it's a sign of dedication. The director praises his “exemplary devotion.” You feel your eyelids dropping {w:time}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rester encore', en: 'Stay even later' },
        out: [
          { w: 2, text: { fr: ["Je suis resté{|e} jusqu'à 2 h. Le chef est parti à 1 h 58. Je suis rentré{|e} dormir quatre heures, debout dans le train. Mon corps est devenu une cravate.", "J'ai fait semblant de travailler jusqu'à minuit en ouvrant et fermant le même tableur. Mon chef m'a félicité{|e} pour ma « productivité ». Il faisait la même chose."], en: ["I stayed until 2 a.m. The boss left at 1:58. I went home to sleep four hours, standing on the train. My body has become a necktie.", "I pretended to work until midnight, opening and closing the same spreadsheet. My boss praised my “productivity.” He was doing the same thing."] }, fx: { perf: 5, health: -5, stress: 8 }, mood: 'sleepy' },
          { w: 1, rating: 2, text: { fr: ["J'ai travaillé 31 heures d'affilée. On m'a retrouvé{|e} au matin, mort{|e} à mon bureau, le stylo encore en main et un sourire poli sur le visage. Mon chef a fait remarquer que j'avais terminé le dossier."], en: ["I worked 31 hours straight. They found me in the morning, dead at my desk, pen still in hand, polite smile on my face. My boss noted that I had finished the file."] }, fx: { die: { fr: 'au bureau, après 31 heures sans dormir, en finissant un dossier', en: 'at my desk after 31 hours without sleep, finishing a report' } }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Partir à 18 h pile', en: 'Leave at 6 p.m. sharp' },
        out: [
          { w: 1, text: { fr: ["Je me suis levé{|e} à 18 h pile et j'ai dit « bonne soirée ». Le bureau entier m'a regardé{|e} comme si j'avais crié une insulte en me déshabillant. Le lendemain, mon bureau avait été déplacé près des toilettes.", "Je suis parti{|e} à l'heure. Je me suis senti{|e} vivant{|e}. J'ai vu le soleil se coucher pour la première fois depuis des années. J'ai pleuré. Puis j'ai reçu 40 mails."], en: ["I stood up at 6 p.m. sharp and said “good evening.” The whole office looked at me like I'd shouted an insult while stripping. Next day my desk had been moved next to the toilets.", "I left on time. I felt alive. I saw a sunset for the first time in years. I cried. Then I got 40 emails."] }, fx: { happy: 8, perf: -6, stress: -6 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Dormir sous le bureau', en: 'Nap under the desk' },
        text: { fr: ["J'ai dormi sous mon bureau, comme un chat. Personne ne m'a vu{|e}. Au réveil, j'avais le motif de la moquette imprimé sur la joue et une promotion pour « présence continue ».", "Sieste sous le bureau. J'ai découvert que trois collègues dormaient aussi sous les leurs. On a formé un club secret. On s'appelle « les Taupes »."], en: ["I slept under my desk like a cat. Nobody saw me. I woke up with the carpet pattern printed on my cheek and a promotion for “continuous presence.”", "Nap under the desk. I discovered three coworkers also sleep under theirs. We formed a secret club. We're called “the Moles.”"] },
        fx: { health: 3, perf: 2, happy: 3 },
      },
    ],
  },
  {
    id: 'cy_jp_toilet',
    icon: '🚽',
    cat: 'country',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'toilet', fx: 'poop' },
    when: { country: ['jp'], age: [14, 90] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "Toilettes high-tech dans un restaurant de {city}. Le couvercle s'est levé tout seul en te voyant. Le siège est chauffé. Il y a 38 boutons, tous en japonais, et un haut-parleur qui joue des bruits de ruisseau.",
        "Chez ta belle-famille, les toilettes ont une télécommande murale de la taille d'un clavier. Un bouton représente un jet d'eau, un autre un sèche-cheveux, un troisième une note de musique et un quatrième ce qui ressemble à {w:animal}.",
        "Les toilettes de l'hôtel te saluent en musique, s'illuminent en bleu et proposent un « mode massage ». Tu as mangé {w:food} il y a une heure, et ton ventre exige d'utiliser l'appareil de toute urgence.",
        "Tu as appuyé sur un bouton au hasard dans les toilettes du bureau. Rien ne s'est passé. Puis un deuxième. Toujours rien. Tu entends maintenant un vrombissement inquiétant monter dans la cuvette.",
      ],
      en: [
        "High-tech toilet at a {city} restaurant. The lid lifted by itself when it saw you. The seat is heated. There are 38 buttons, all in Japanese, and a speaker playing babbling-brook sounds.",
        "At your in-laws', the toilet has a wall remote the size of a keyboard. One button shows a water jet, another a hair dryer, a third a musical note and a fourth what looks like {w:animal}.",
        "The hotel toilet greets you with music, lights up blue and offers “massage mode.” You ate {w:food} an hour ago, and your gut demands the device immediately.",
        "You pressed a random button on the office toilet. Nothing happened. Then a second. Still nothing. Now you hear an ominous whirring rising from the bowl.",
      ],
    },
    choices: [
      {
        label: { fr: 'Appuyer partout', en: 'Press everything' },
        out: [
          { w: 2, text: { fr: ["J'ai appuyé sur tous les boutons. Un jet d'eau tiède m'a frappé l'arrière-train à la pression d'une lance à incendie, suivi d'un sèche-cheveux et d'une chanson. Je suis ressorti{|e} propre comme jamais et trempé{|e} jusqu'aux omoplates.", "Le jet est parti trop haut, trop fort. Il a nettoyé le plafond, la porte et mes lunettes. Le restaurant entier a entendu mon cri. Personne n'a commenté. C'est le Japon."], en: ["I pressed every button. A warm jet hit my backside with the pressure of a fire hose, followed by a hair dryer and a song. I came out cleaner than ever and soaked up to the shoulder blades.", "The jet went too high, too hard. It washed the ceiling, the door and my glasses. The whole restaurant heard me scream. Nobody commented. It's Japan."] }, fx: { happy: 4, stress: 4, visual: 'poop' }, mood: 'shock' },
          { w: 1, text: { fr: ["Le bouton « massage » s'est bloqué. J'ai vibré pendant vingt minutes, assis{|e}, impuissant{|e}, pendant que la cuvette jouait une valse. Un technicien est venu. Il a soupiré. Il connaissait ce modèle."], en: ["The “massage” button jammed. I vibrated for twenty minutes, seated, helpless, while the toilet played a waltz. A technician came. He sighed. He knew this model."] }, fx: { happy: 3, stress: 6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire ça vite', en: 'Do it fast' },
        out: [
          { w: 2, text: { fr: ["J'ai fait ce que j'avais à faire en dix secondes, mais je n'ai pas trouvé la chasse. J'ai appuyé sur un bouton : ça a lancé une fanfare et un désodorisant au jasmin. Le problème est resté. J'ai fui.", "J'ai voulu tirer la chasse. J'ai déclenché l'alarme d'urgence. Une employée a frappé à la porte en demandant si j'étais vivant{|e}. J'ai répondu « hai » en pleurant, pantalon aux chevilles."], en: ["I did my business in ten seconds but couldn't find the flush. Pressed a button: it played a fanfare and sprayed jasmine freshener. The problem stayed. I fled.", "I tried to flush. I set off the emergency alarm. A staff member knocked asking if I was alive. I answered “hai,” crying, pants around my ankles."] }, fx: { stress: 7, happy: -2 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Adopter la technologie', en: 'Embrace the technology' },
        text: { fr: ["J'ai lu le manuel en entier. J'ai réglé la température, la pression, l'angle et la musique. J'en ai acheté une pour chez moi. Ma vie a changé. Je ne peux plus aller aux toilettes ailleurs.", "J'ai passé quarante minutes dans ces toilettes. Ce sont les meilleures quarante minutes de mon voyage. J'ai laissé un avis cinq étoiles. Pour les toilettes."], en: ["I read the whole manual. Set temperature, pressure, angle and music. Bought one for home. My life changed. I can't use toilets anywhere else now.", "I spent forty minutes in that toilet. The best forty minutes of my trip. I left a five-star review. For the toilet."] },
        fx: { happy: 7, money: -300 },
      },
    ],
  },
  // ═════════════════════════════ ESPAGNE ═════════════════════════════
  {
    id: 'cy_es_siesta',
    icon: '😴',
    cat: 'country',
    rating: 0,
    scene: { place: 'home', mood: 'sleepy', prop: 'shutter' },
    when: { country: ['es'], age: [8, 95] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Il est 15 h à {city}. Il fait 41 °C. Toutes les boutiques ont baissé leur rideau de fer. Les rues sont vides. Même les chiens dorment à l'ombre. Toi, tu as besoin d'urgence d'un tournevis, et rien n'ouvre avant 17 h 30. Tu n'as sous la main que {w:object}.",
        "Heure de la sieste. Toute la ville dort. Ton voisin du dessus, lui, a décidé que c'était le moment parfait pour {w:activity} en tapant des pieds. Tu entends {w:sound} à travers le plafond.",
        "Tu as essayé de rester éveillé{|e} pendant la sieste, par principe. Il fait si chaud que tes paupières pèsent chacune trois kilos. Le ventilateur tourne lentement en grinçant comme une berceuse diabolique.",
        "Ton premier été en tant que retraité{|e} à {city}. Tu as maintenant le droit de faire la sieste tous les jours, de 14 h à 18 h, sans culpabilité. Ta famille dit que tu dors plus que le chat.",
      ],
      en: [
        "It's 3 p.m. in {city}. It's 106°F. Every shop has rolled down its metal shutter. The streets are empty. Even the dogs are asleep in the shade. You urgently need a screwdriver, and nothing opens before 5:30. All you have is {w:object}.",
        "Siesta time. The whole town is asleep. Your upstairs neighbor, however, decided it was the perfect moment for {w:activity}, stomping. You hear {w:sound} through the ceiling.",
        "You tried to stay awake through the siesta, on principle. It's so hot each eyelid weighs six pounds. The fan turns slowly, creaking like a demonic lullaby.",
        "Your first summer as a retiree in {city}. You're now allowed to nap every day, 2 to 6 p.m., guilt-free. Your family says you sleep more than the cat.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire la sieste', en: 'Take the siesta' },
        out: [
          { w: 3, text: { fr: ["J'ai dormi trois heures, persiennes fermées, avec un drap mouillé sur le ventre. Je me suis réveillé{|e} avec la marque de l'oreiller sur la joue et l'envie de vivre jusqu'à 3 h du matin.", "Sieste parfaite. J'ai rêvé que je faisais la sieste. Je me suis réveillé{|e} fatigué{|e} d'avoir trop dormi dans mon rêve. Puis j'en ai refait une."], en: ["I slept three hours, shutters closed, a damp sheet on my belly. Woke up with a pillow crease on my cheek and the will to live until 3 a.m.", "Perfect siesta. I dreamed I was taking a siesta. I woke up tired from oversleeping in my dream. Then I took another."] }, fx: { happy: 6, health: 3, stress: -6 }, mood: 'sleepy' },
        ],
      },
      {
        label: { fr: 'Frapper à un rideau', en: 'Bang on a shutter' },
        out: [
          { w: 1, text: { fr: ["J'ai frappé au rideau de la quincaillerie. Le patron a ouvert, en slip, l'œil vitreux, m'a donné un tournevis gratuitement pour que je parte vite, et a refermé sans un mot.", "J'ai tambouriné sur le rideau. Une voix a crié « ¡Que es la siesta, hombre! » depuis le balcon. Puis un seau d'eau est tombé. C'était rafraîchissant, au fond."], en: ["I knocked on the hardware store shutter. The owner opened up in his underwear, glassy-eyed, gave me a free screwdriver so I'd leave, and shut it without a word.", "I hammered on the shutter. A voice yelled “It's siesta, man!” from a balcony. Then a bucket of water fell. Refreshing, really."] }, fx: { happy: 2, stress: 3 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Résister au sommeil', en: 'Fight the sleep' },
        text: { fr: ["J'ai lutté contre la sieste avec trois cafés. À 16 h, je me suis endormi{|e} debout contre le frigo, la tasse à la main. On m'a retrouvé{|e} là à 18 h, avec un chat sur l'épaule.", "J'ai voulu être productif{|ve} pendant la sieste. Je suis sorti{|e} {w:weather} et j'ai attrapé une insolation en dix minutes. L'Espagne gagne toujours."], en: ["I fought the siesta with three coffees. At 4 p.m., I fell asleep standing against the fridge, mug in hand. They found me there at 6, with a cat on my shoulder.", "I tried to be productive during the siesta. I went out {w:weather} and got heatstroke in ten minutes. Spain always wins."] },
        fx: { health: -2, stress: 2 },
      },
    ],
  },
  {
    id: 'cy_es_futbol',
    icon: '⚽',
    cat: 'country',
    rating: 0,
    scene: { place: 'school', mood: 'angry', prop: 'jersey' },
    when: { country: ['es'], age: [6, 16] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "C'est la semaine du Clásico. À l'école, la cour est coupée en deux : les blancs d'un côté, les blaugrana de l'autre. Ton meilleur ami vient de passer dans l'autre camp. Tout le monde attend que tu choisisses.",
        "Ton grand-père supporte le Real, ton père supporte le Barça, et ta mère supporte « n'importe qui pourvu que ça se termine ». Le repas de dimanche coïncide avec le match. Il y a {w:food} sur la table et de la tension dans l'air.",
        "Tournoi de foot de {school}. Tu joues avec un maillot trop grand de {w:celeb}, floqué par erreur. Le gardien adverse mesure 1,80 m à 11 ans et a déjà de la moustache.",
        "Ton oncle t'a offert un ballon dédicacé par une star. Ta cousine prétend que la signature est fausse et ressemble à {w:animal} qui aurait marché sur la feuille. La famille est divisée.",
      ],
      en: [
        "It's Clásico week. At school, the playground is split in two: whites on one side, blaugrana on the other. Your best friend just defected. Everyone is waiting for you to choose.",
        "Grandpa supports Real, Dad supports Barça, and Mom supports “whoever, as long as it ends.” Sunday lunch coincides with the match. There's {w:food} on the table and tension in the air.",
        "{school} football tournament. You're playing in an oversized {w:celeb} jersey, printed by mistake. The opposing keeper is 5'11\" at 11 and already has a moustache.",
        "Your uncle gave you a ball signed by a star. Your cousin claims the signature is fake and looks like {w:animal} walked across it. The family is divided.",
      ],
    },
    choices: [
      {
        label: { fr: 'Choisir un camp', en: 'Pick a side' },
        out: [
          { w: 2, text: { fr: ["J'ai choisi le camp de mon grand-père. Il m'a offert un maillot et pleuré de joie. Mon père m'a regardé{|e} comme un traître. On ne se parle que de la météo depuis.", "J'ai choisi le Barça. Mon grand-père a fait semblant de s'évanouir. Puis il m'a donné 20 € quand même, « pour que tu changes d'avis ». Je réfléchis."], en: ["I picked Grandpa's side. He gave me a jersey and wept with joy. Dad looked at me like a traitor. We only talk about the weather now.", "I picked Barça. Grandpa pretended to faint. Then gave me 20 euros anyway, “so you'll change your mind.” I'm thinking about it."] }, fx: { happy: 5, money: 20 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Marquer en tournoi', en: 'Score in the tournament' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai dribblé trois joueurs et le gardien moustachu. But ! J'ai fait la célébration de mon idole, glissé sur les genoux et déchiré mon pantalon. Le meilleur jour de ma vie.", "But du talon, sans le faire exprès. L'entraîneur a crié « ¡Golazo! ». J'ai fait semblant d'avoir visé. Je mentirai jusqu'à ma mort."], en: ["I dribbled past three players and the mustached keeper. Goal! I did my idol's celebration, knee-slid and ripped my pants. Best day of my life.", "Backheel goal, by accident. The coach yelled “Golazo!” I pretended I meant it. I'll lie about it until I die."] }, fx: { happy: 9, athletic: 3 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai tiré si fort que le ballon a atterri dans le jardin du voisin, qui a un chien. Le ballon n'est jamais revenu. Le chien non plus, je crois."], en: ["I kicked so hard the ball landed in the neighbor's yard, where there's a dog. The ball never came back. Neither did the dog, I think."] }, fx: { happy: -2, athletic: 1 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Déclarer ma neutralité', en: 'Declare neutrality' },
        text: { fr: ["J'ai dit que je préférais le basket. La cour entière s'est tue. Deux camps ennemis se sont unis pour me détester. J'ai réconcilié l'Espagne contre moi.", "Je me suis déclaré{|e} neutre, comme la Suisse. Résultat : personne ne m'a passé le ballon pendant deux semaines. J'ai lu des livres. J'ai pris de l'avance en maths."], en: ["I said I preferred basketball. The whole playground went silent. Two enemy camps united to hate me. I reconciled Spain against myself.", "I declared neutrality, like Switzerland. Result: nobody passed me the ball for two weeks. I read books. Got ahead in math."] },
        fx: { smarts: 2, happy: -2 },
      },
    ],
  },
  {
    id: 'cy_es_tortilla',
    icon: '🥔',
    cat: 'country',
    rating: 0,
    scene: { place: 'home', mood: 'angry', prop: 'tortilla' },
    when: { country: ['es'], age: [10, 90] },
    actor: 'grandparent',
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Repas de famille. La grande question revient, comme chaque année : la tortilla, avec ou sans oignon ? {a.rel} est pour l'oignon. Ton oncle est contre. Les couverts tremblent. Tout le monde se tourne vers toi.",
        "{a.rel} t'a préparé une tortilla de pommes de terre « baveuse », comme il faut. {a:Il|Elle} te regarde manger avec une intensité de juge olympique. Tu as déjà mangé {w:food} avant de venir.",
        "Tu as ramené une tortilla de supermarché au repas de famille de {city}. {a.rel} l'a regardée comme on regarde {w:animal} mort sur le paillasson. Il y a un silence de plomb.",
        "{a.rel} dit que tu es trop maigre et remplit ton assiette pour la quatrième fois : tortilla, croquetas, jamón, pain. « Tu ne manges rien ! » Tu as déjà défait le bouton de ton pantalon.",
      ],
      en: [
        "Family lunch. The big question returns, as every year: tortilla, with or without onion? {a.rel} is pro-onion. Your uncle is against. The cutlery trembles. Everyone turns to you.",
        "{a.rel} made you a potato tortilla, runny in the middle, the proper way, and watches you eat with the intensity of an Olympic judge. You already ate {w:food} before coming.",
        "You brought a store-bought tortilla to the family lunch in {city}. {a.rel} looked at it like {w:animal} lying dead on the doormat. Leaden silence.",
        "{a.rel} says you're too skinny and fills your plate for the fourth time: tortilla, croquetas, jamón, bread. “You're not eating anything!” You've already undone your top button.",
      ],
    },
    choices: [
      {
        label: { fr: 'Avec oignon !', en: 'With onion!' },
        out: [
          { w: 2, text: { fr: ["J'ai dit « avec oignon ». {a.my} m'a embrassé{|e} sur les deux joues et m'a promis sa recette secrète. Mon oncle a quitté la table. Il est revenu pour le dessert, par faiblesse.", "Avec oignon. La moitié de la table a applaudi, l'autre a sifflé. On a voté. Égalité. On a fait deux tortillas. Personne n'a gagné, tout le monde a grossi."], en: ["I said “with onion.” {a.my} kissed me on both cheeks and promised me the secret recipe. My uncle left the table. He came back for dessert, out of weakness.", "With onion. Half the table cheered, half booed. We voted. Tie. We made two tortillas. Nobody won, everyone gained weight."] }, fx: { happy: 6, rel: 8, weight: 0.01 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Sans oignon !', en: 'No onion!' },
        out: [
          { w: 2, text: { fr: ["J'ai dit « sans oignon ». {a.my} a posé sa fourchette, lentement. Puis {a:il|elle} a dit « je ne te reconnais plus ». J'ai mangé ma part dans un silence de funérailles.", "Sans oignon. Mon oncle m'a fait un clin d'œil. {a.my} m'a servi{|e} une part deux fois plus petite que celle du chien. Message reçu."], en: ["I said “no onion.” {a.my} slowly put down the fork. Then said, “I don't know you anymore.” I ate my slice in funeral silence.", "No onion. My uncle winked at me. {a.my} served me a slice half the size of the dog's. Message received."] }, fx: { happy: -2, rel: -6 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Tout manger', en: 'Eat everything' },
        out: [
          { w: 1, odds: { health: 1 }, text: { fr: ["J'ai tout mangé, quatre assiettes. {a.my} a pleuré de bonheur et m'a donné un tupperware « pour ce soir ». Il pèse trois kilos. J'ai roulé jusqu'à la voiture.", "J'ai fini la tortilla, les croquetas et le pain. {a.my} a dit « tu vois, tu avais faim ». J'ai fait une sieste de quatre heures sur son canapé, sous une couverture en crochet."], en: ["I ate it all, four plates. {a.my} cried with joy and gave me a tupperware “for tonight.” It weighs six pounds. I rolled to the car.", "I finished the tortilla, croquetas and bread. {a.my} said, “See, you were hungry.” I took a four-hour nap on the couch under a crochet blanket."] }, fx: { happy: 7, rel: 10, weight: 0.03 }, mood: 'happy' },
        ],
      },
    ],
  },
  {
    id: 'cy_es_cena',
    icon: '🕙',
    cat: 'country',
    rating: 1,
    scene: { place: 'party', mood: 'party', prop: 'tapas' },
    when: { country: ['es'], age: [18, 70] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Tes amis espagnols t'invitent à dîner « tôt ». Tôt, c'est 22 h 30. À minuit, on commande les tapas. À 2 h, on va en boîte. À 7 h, on mange des churros au chocolat. Tu as faim depuis 19 h et tu tiens à peine debout.",
        "Tu es arrivé{|e} au restaurant à 20 h. Il était vide, à part un couple de touristes allemands et un serveur qui mangeait {w:food} en regardant la télé. Les Espagnols arrivent à 22 h 45, frais comme des roses.",
        "Soirée tapas à {city} : on change de bar à chaque plat. Un bar pour les croquettes, un pour les poivrons, un pour le jambon, un pour {w:drink}. Il est minuit, tu en es au neuvième bar.",
        "Ton collègue t'a proposé « un verre vite fait après le travail ». Il est 4 h du matin. Tu es sur une terrasse, il danse le flamenco avec un inconnu, et quelqu'un vient de commander « la dernière » pour la huitième fois.",
      ],
      en: [
        "Your Spanish friends invite you to an “early” dinner. Early means 10:30 p.m. Tapas get ordered at midnight. Clubbing at 2. Churros with chocolate at 7 a.m. You've been hungry since 7 p.m. and can barely stand.",
        "You got to the restaurant at 8 p.m. It was empty except for a German tourist couple and a waiter eating {w:food} in front of the TV. The Spaniards arrive at 10:45, fresh as daisies.",
        "Tapas night in {city}: a new bar for every dish. One for croquetas, one for peppers, one for ham, one for {w:drink}. It's midnight, you're on bar number nine.",
        "Your coworker suggested “a quick drink after work.” It's 4 a.m. You're on a terrace, he's dancing flamenco with a stranger, and someone just ordered “the last one” for the eighth time.",
      ],
    },
    choices: [
      {
        label: { fr: "Tenir jusqu'aux churros", en: 'Last until churros' },
        out: [
          { w: 2, odds: { health: 1 }, text: { fr: ["J'ai tenu jusqu'à 7 h. Churros, chocolat épais comme du goudron, lever de soleil. Je suis allé{|e} travailler sans dormir. Mes collègues espagnols aussi. Ils étaient en pleine forme. Moi, je suis mort{|e} intérieurement.", "Dîner à minuit, boîte à 2 h, churros à l'aube. Je n'ai jamais été aussi heureux{|se} et aussi fatigué{|e}. J'ai compris que les Espagnols ont une batterie cachée."], en: ["I made it to 7 a.m. Churros, chocolate thick as tar, sunrise. Went to work without sleeping. So did my Spanish coworkers. They were thriving. I died inside.", "Dinner at midnight, club at 2, churros at dawn. Never been happier or more exhausted. I've realized Spaniards have a hidden battery."] }, fx: { happy: 10, health: -4, addiction: ['alcohol', 3] }, mood: 'party' },
          { w: 1, text: { fr: ["Je me suis endormi{|e} la tête dans le plat de patatas bravas à 1 h 30. Mes amis ont continué la soirée autour de moi. Ils m'ont réveillé{|e} pour les churros, puis je me suis rendormi{|e} dedans."], en: ["I fell asleep face-first in the patatas bravas at 1:30. My friends partied on around me. They woke me for churros, then I fell asleep in those too."] }, fx: { happy: 4, looks: -2 }, mood: 'sleepy' },
        ],
      },
      {
        label: { fr: 'Manger avant de venir', en: 'Eat before going' },
        out: [
          { w: 1, text: { fr: ["J'ai dîné à 19 h chez moi, comme un retraité, puis je suis allé{|e} au « dîner » à 22 h 30. J'ai dû remanger. Deux dîners. J'ai pris quatre kilos en un séjour.", "J'ai mangé en cachette {w:food} avant de sortir. À table, on m'a demandé pourquoi je ne mangeais pas. J'ai dit que j'étais « au régime ». On m'a servi double, par pitié."], en: ["I ate dinner at 7 p.m. at home like a retiree, then went to the “dinner” at 10:30. Had to eat again. Two dinners. Gained eight pounds in one trip.", "I secretly ate {w:food} before heading out. At the table they asked why I wasn't eating. I said I was “on a diet.” They served me double, out of pity."] }, fx: { weight: 0.03, happy: 4 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Rentrer à minuit', en: 'Go home at midnight' },
        text: { fr: ["Je suis rentré{|e} à minuit. Mes amis m'ont regardé{|e} partir avec inquiétude, comme si j'étais malade. L'un d'eux m'a demandé « tu vas bien ? Tu es triste ? ».", "J'ai dit bonne nuit à minuit, au moment où les plats arrivaient. Un serveur m'a demandé si c'était une urgence médicale. Je suis rentré{|e} affamé{|e} et honteux{|se}."], en: ["I went home at midnight. My friends watched me leave with concern, as if I were ill. One asked, “Are you okay? Are you sad?”", "I said goodnight at midnight, just as the food arrived. A waiter asked if it was a medical emergency. I went home starving and ashamed."] },
        fx: { health: 2, happy: -3 },
      },
    ],
  },
  {
    id: 'cy_es_gordo',
    icon: '🎟️',
    cat: 'country',
    rating: 1,
    scene: { place: 'office', mood: 'shock', prop: 'lottery', fx: 'money' },
    when: { country: ['es'], age: [18, 90] },
    vars: { amount: [8000, 60000] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: [
        "C'est la loterie de Noël, El Gordo. Tout le bureau achète un billet en commun, chacun pour 20 €. Tu as dit non, « parce que c'est de l'arnaque ». Le 22 décembre, des enfants chantent les numéros à la télé. Tes collègues hurlent.",
        "Ta grand-mère joue au Gordo depuis 1961 avec le même numéro. Elle t'a confié son billet pendant qu'elle allait aux toilettes. Tu viens de le poser à côté de ton café, juste sous {w:food}. Il est un peu mouillé.",
        "Tout {city} est devant la télé : on tire le Gordo. Ton boulanger a vendu le billet gagnant. Tu as un ticket dans ta poche, acheté chez lui {w:time}, entre deux baguettes. Le présentateur lit le premier chiffre.",
        "Le bar du coin a vendu des parts du billet de loterie de Noël à tout le quartier. Le patron annonce que le billet a gagné. Puis il dit qu'il a « peut-être » oublié qui a payé quoi. Il y a {$amount} à partager.",
      ],
      en: [
        "It's the Christmas lottery, El Gordo. The whole office buys a shared ticket, €20 each. You said no, “because it's a scam.” On December 22, children sing the numbers on TV. Your coworkers scream.",
        "Your grandma has played El Gordo since 1961 with the same number. She handed you her ticket while she went to the bathroom. You just set it down next to your coffee, beside {w:food}. It's a bit wet.",
        "All of {city} is glued to the TV: El Gordo draw. Your baker sold the winning ticket. You've got a ticket in your pocket, bought from him {w:time}, between two baguettes. The host reads the first digit.",
        "The corner bar sold shares of the Christmas lottery ticket to the whole neighborhood. The owner announces it won. Then says he “might” have forgotten who paid for what. There's {$amount} to split.",
      ],
    },
    choices: [
      {
        label: { fr: 'Vérifier le billet', en: 'Check the ticket' },
        out: [
          { w: 1, text: { fr: ["Mon billet était le bon. J'ai gagné {$amount}. J'ai crié, embrassé le boulanger et ouvert du cava sur le trottoir. Toute la rue a bu à ma santé. Ma famille m'aime soudain énormément.", "J'ai gagné {$amount} ! J'ai dansé sur la table du bar avec des inconnus. Le soir même, quatorze cousins dont je n'avais jamais entendu parler m'ont appelé{|e}."], en: ["My ticket was the one. I won {$amount}. I screamed, kissed the baker and popped cava on the sidewalk. The whole street drank to me. My family suddenly loves me enormously.", "I won {$amount}! I danced on the bar table with strangers. That same evening, fourteen cousins I'd never heard of called me."] }, fx: { money: 'amount', happy: 15, visual: 'money' }, mood: 'party' },
          { w: 3, text: { fr: ["À un chiffre près. Un seul. J'ai regardé le billet pendant une heure, puis je l'ai mangé, lentement, en pleurant. Le boulanger m'a offert un croissant de consolation.", "Perdu. Mes collègues, eux, ont gagné. Ils ont démissionné le lendemain en dansant. Je suis seul{|e} au bureau avec le chef, qui n'avait pas joué non plus. On se regarde. On ne dit rien."], en: ["Off by one digit. One. I stared at the ticket for an hour, then ate it, slowly, crying. The baker gave me a consolation croissant.", "Lost. My coworkers won. They quit the next day, dancing. I'm alone in the office with the boss, who didn't play either. We look at each other. We say nothing."] }, fx: { happy: -8, stress: 4 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Réclamer ma part', en: 'Claim my share' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: ["J'ai juré avoir payé ma part au bar. Le patron m'a regardé{|e} longtemps, puis a dit « oui, je me souviens de ta tête ». J'ai touché une part. Je n'avais rien payé. J'irai en enfer, en première classe.", "J'ai sorti un vieux ticket de caisse froissé en guise de « preuve ». Ça a marché. Le quartier entier ment depuis. Le bar a fait faillite. Joyeux Noël."], en: ["I swore I'd paid my share at the bar. The owner stared at me a long time, then said, “Yeah, I remember your face.” I got a share. I hadn't paid. I'll go to hell, first class.", "I pulled out an old crumpled receipt as “proof.” It worked. The whole neighborhood has been lying ever since. The bar went bankrupt. Merry Christmas."] }, fx: { money: 3000, karma: -8, visual: 'money' }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Rester digne', en: 'Stay dignified' },
        text: { fr: ["Je n'ai rien réclamé. J'ai dit « félicitations » à tout le monde, avec un sourire de façade et une envie de hurler. Le soir, j'ai acheté un billet pour l'an prochain. Douze, en fait.", "J'ai fait semblant de ne pas être déçu{|e}. Puis j'ai joué {w:song} au karaoké du bar en pleurant. Tout le monde a compris. On m'a offert des tapas."], en: ["I claimed nothing. I said “congratulations” to everyone with a fake smile and a desire to scream. That night I bought a ticket for next year. Twelve, actually.", "I pretended not to be disappointed. Then sang {w:song} at the bar's karaoke, crying. Everyone understood. They bought me tapas."] },
        fx: { karma: 3, happy: -2, money: -240 },
      },
    ],
  },
  {
    id: 'cy_es_tomatina',
    icon: '🍅',
    cat: 'country',
    rating: 2,
    scene: { place: 'park', mood: 'party', prop: 'tomato', fx: 'gore' },
    when: { country: ['es'], age: [18, 60] },
    weight: 6,
    cooldown: 4,
    text: {
      fr: [
        "La Tomatina de Buñol ! 20 000 personnes, 120 tonnes de tomates trop mûres, une heure de bataille. Des camions déversent des montagnes de tomates dans la rue. Tu portes des lunettes de piscine et un t-shirt blanc qui ne le restera pas.",
        "Le signal de la Tomatina retentit. Une tomate t'explose dans l'oreille. Une autre dans la bouche. Un Australien torse nu te charge avec une poubelle pleine de purée. Ça sent {w:smell} et le ketchup tiède.",
        "Avant la bataille de tomates, il y a le « palo jabón » : un poteau couvert de savon avec un jambon en haut. Des gens grimpent les uns sur les autres. Tu es en bas de la pyramide humaine, {w:weather}.",
        "Fin de la Tomatina. Tu as de la tomate partout : dans les cheveux, les narines, les oreilles et des endroits que tu ignorais. Une dame arrose les participants avec un tuyau d'arrosage. Tu fais la queue derrière un touriste rouge vif et {w:animal}.",
      ],
      en: [
        "La Tomatina in Buñol! 20,000 people, 120 tons of overripe tomatoes, one hour of battle. Trucks dump mountains of tomatoes into the street. You're wearing swim goggles and a white t-shirt that won't stay white.",
        "The Tomatina signal goes off. A tomato explodes in your ear. Another in your mouth. A shirtless Australian charges you with a trash can full of purée. It smells like {w:smell} and warm ketchup.",
        "Before the tomato fight there's the “palo jabón”: a soap-covered pole with a ham on top. People climb on each other. You're at the bottom of the human pyramid, {w:weather}.",
        "End of the Tomatina. You have tomato everywhere: in your hair, nostrils, ears and places you didn't know you had. A lady hoses down participants with a garden hose. You're in line behind a bright-red tourist and {w:animal}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Bombarder tout le monde', en: 'Bombard everyone' },
        out: [
          { w: 2, text: { fr: ["J'ai lancé 400 tomates en une heure. J'ai touché un Japonais, un notaire en vacances et moi-même par ricochet. J'ai trouvé un bout de tomate dans mon nombril trois jours plus tard.", "Bataille épique. J'ai fait un tir parfait dans la bouche ouverte d'un Anglais qui hurlait. Il a avalé et dit « cheers ». On est amis sur {w:app}."], en: ["I threw 400 tomatoes in an hour. Hit a Japanese tourist, a vacationing notary and myself on a rebound. Found a piece of tomato in my belly button three days later.", "Epic battle. I landed a perfect shot in the open mouth of a screaming Englishman. He swallowed and said “cheers.” We're friends on {w:app}."] }, fx: { happy: 10, athletic: 2 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai glissé sur 30 cm de purée et me suis retrouvé{|e} sous la foule. Piétiné{|e} par 200 personnes en tongs. J'ai craché des pépins pendant une semaine et perdu un ongle de pied, qui est resté à Buñol."], en: ["I slipped on a foot of purée and ended up under the crowd. Trampled by 200 people in flip-flops. I spat seeds for a week and lost a toenail, which stayed in Buñol."] }, fx: { health: -8, happy: 2, visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Grimper au poteau', en: 'Climb the pole' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: ["J'ai escaladé la pyramide humaine en marchant sur des têtes et j'ai attrapé le jambon ! Ovation. On m'a porté{|e} en triomphe. Le jambon a un goût de savon, mais c'est le goût de la gloire.", "J'ai décroché le jambon. Une foule de 20 000 personnes a scandé mon prénom. J'ai partagé le jambon avec tout le monde. Il a fait trois mètres."], en: ["I scaled the human pyramid by stepping on heads and grabbed the ham! Ovation. Carried in triumph. The ham tastes of soap, but it's the taste of glory.", "I got the ham. A crowd of 20,000 chanted my name. I shared the ham with everyone. It went three feet."] }, fx: { happy: 12, fame: 2, athletic: 2 }, mood: 'proud' },
          { w: 2, text: { fr: ["J'ai glissé sur le savon et je suis retombé{|e} sur la pyramide, qui s'est effondrée comme un château de cartes. Dix-sept blessés légers. On m'appelle « El Bolo » à Buñol.", "Arrivé{|e} à mi-poteau, mon short a glissé. Il est resté sur le poteau. Moi, je suis retombé{|e} cul nu dans la foule. 20 000 personnes ont applaudi. Mon short est devenu une relique."], en: ["I slipped on the soap and fell back onto the pyramid, which collapsed like a house of cards. Seventeen minor injuries. In Buñol they call me “The Bowling Ball.”", "Halfway up, my shorts slipped off. They stayed on the pole. I fell bare-assed into the crowd. 20,000 people cheered. My shorts are now a relic."] }, fx: { happy: 4, health: -4, fame: 1 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Regarder du balcon', en: 'Watch from a balcony' },
        text: { fr: ["J'ai loué un balcon pour regarder au sec. Une tomate a quand même fait trois étages pour m'exploser en pleine figure. Le lanceur m'a fait un signe. Respect.", "J'ai regardé la bataille depuis un balcon avec une sangria. C'était magnifique, rouge et dégoûtant. À la fin, la rue entière ressemblait à une scène de film d'horreur italien."], en: ["I rented a balcony to stay dry. A tomato still flew three floors to explode in my face. The thrower waved. Respect.", "I watched from a balcony with a sangria. Beautiful, red and disgusting. By the end, the whole street looked like an Italian horror movie set."] },
        fx: { happy: 5, money: -60 },
      },
    ],
  },
  {
    id: 'cy_es_guiri',
    icon: '🦞',
    cat: 'country',
    rating: 2,
    scene: { place: 'beach', mood: 'angry', prop: 'sangria', fx: 'poop' },
    when: { country: ['es'], age: [18, 60] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Été à la plage. Tu es serveur{|se} dans une station balnéaire. Un groupe de touristes rouges comme des homards, en chaussettes-sandales, commande 14 seaux de sangria à 10 h du matin et demande où se trouve « la vraie Espagne ».",
        "Ton appartement à {city} est entouré de locations touristiques. À 4 h du matin, un groupe d'enterrement de vie de garçon chante {w:song} sur le balcon d'en face. L'un d'eux est déguisé en pénis géant. Un autre essaie de sauter dans la piscine depuis le troisième étage.",
        "Un touriste te demande ton chemin en criant très lentement, comme si tu étais sourd{|e} : « LA-PLA-YA ? » Il porte un sombrero mexicain, un maillot de foot et un coup de soleil en forme de débardeur.",
        "Ta plage préférée est envahie. Il y a des serviettes jusqu'à l'eau, un type qui joue de la musique sur une enceinte grosse comme {w:object}, et un vendeur qui propose « mojito, cerveza, massage, mangue ».",
      ],
      en: [
        "Summer at the beach. You're a waiter at a resort. A group of tourists red as lobsters, in socks and sandals, orders 14 buckets of sangria at 10 a.m. and asks where “the real Spain” is.",
        "Your {city} apartment is surrounded by tourist rentals. At 4 a.m., a stag party sings {w:song} on the balcony opposite. One is dressed as a giant penis. Another is trying to jump into the pool from the third floor.",
        "A tourist asks for directions by shouting very slowly, as if you were deaf: “THE-BEACH-UH?” He's wearing a Mexican sombrero, a football shirt and a tank-top-shaped sunburn.",
        "Your favorite beach is overrun. Towels right to the waterline, a guy blasting music from a speaker as big as {w:object}, and a vendor offering “mojito, cerveza, massage, mango.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Servir avec le sourire', en: 'Serve with a smile' },
        out: [
          { w: 2, text: { fr: ["J'ai servi les 14 seaux. À 11 h, l'un d'eux a vomi de la sangria sur mes chaussures, puis s'est excusé en vomissant à nouveau, sur l'autre chaussure. Symétrie parfaite. Pourboire : 2 €.", "J'ai souri toute la journée. Le soir, j'avais une crampe à la mâchoire, 80 € de pourboires et de la crème solaire de 30 inconnus sur les mains."], en: ["I served all 14 buckets. At 11, one of them puked sangria on my shoes, then apologized by puking again, on the other shoe. Perfect symmetry. Tip: €2.", "I smiled all day. By evening I had a jaw cramp, €80 in tips and thirty strangers' sunscreen on my hands."] }, fx: { money: 80, happy: -2, stress: 5, visual: 'poop' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Envoyer au mauvais endroit', en: 'Send them the wrong way' },
        out: [
          { w: 2, text: { fr: ["J'ai indiqué « la vraie Espagne » : une zone industrielle à 14 km, à pied, sous 40 °C. Ils sont partis, reconnaissants. Je les ai revus sur {w:app}, en larmes, devant une usine de ciment.", "Je les ai envoyés vers « la plage secrète des locaux ». C'était la station d'épuration. Ils ont posé leurs serviettes. Ils ont trouvé ça authentique."], en: ["I pointed to “the real Spain”: an industrial zone 9 miles away, on foot, at 104°F. They left, grateful. I saw them later on {w:app}, crying in front of a cement plant.", "I sent them to “the locals' secret beach.” It was the sewage plant. They laid out their towels. They found it authentic."] }, fx: { happy: 9, karma: -4 }, mood: 'party' },
        ],
      },
      {
        label: { fr: 'Appeler la police', en: 'Call the police' },
        out: [
          { w: 1, text: { fr: ["J'ai appelé la police pour le balcon. Le type déguisé en pénis géant a sauté dans la piscine pile au moment où les policiers arrivaient. Il a raté. Il a atterri dans une haie. Le costume l'a sauvé. Les flics ont applaudi.", "La police est venue, a confisqué l'enceinte et le sombrero. Le touriste a pleuré pour le sombrero. Pas pour l'enceinte. Les priorités de chacun."], en: ["I called the cops about the balcony. The guy in the giant penis costume jumped for the pool just as they arrived. Missed. Landed in a hedge. The costume saved him. The cops applauded.", "Police came and confiscated the speaker and the sombrero. The tourist cried over the sombrero. Not the speaker. Everyone has priorities."] }, fx: { happy: 6, karma: 2, visual: 'police' }, mood: 'happy' },
        ],
      },
    ],
  },
  {
    id: 'cy_es_sanfermin',
    icon: '🐂',
    cat: 'country',
    rating: 2,
    scene: { place: 'stadium', mood: 'shock', prop: 'bull', fx: 'gore' },
    when: { country: ['es'], age: [18, 60] },
    weight: 5,
    cooldown: 5,
    text: {
      fr: [
        "Pampelune, San Fermín, 8 h du matin. Tu es en blanc avec un foulard rouge, au milieu de milliers de coureurs qui n'ont pas dormi. Un pétard explose. Six taureaux de 600 kilos arrivent au bout de la rue. Ils n'ont pas l'air d'avoir bien dormi non plus.",
        "Tes potes t'ont convaincu{|e} de faire l'encierro, {w:excuse}. Tu as bu de la sangria jusqu'à 6 h. Le taureau le plus proche s'appelle, d'après le programme, « Asesino ». Il te regarde.",
        "Tu cours dans les rues de Pampelune. Derrière toi : des sabots. Devant toi : un touriste qui fait un selfie. À ta gauche : une palissade. Au-dessus : des spectateurs qui crient « {w:exclaim} ».",
        "Fêtes de San Fermín. Tu n'as pas voulu courir, tu es juste sorti{|e} acheter {w:food}. Tu as pris la mauvaise rue. Elle est pleine de gens en blanc qui courent en hurlant. Tu entends un meuglement.",
      ],
      en: [
        "Pamplona, San Fermín, 8 a.m. You're dressed in white with a red scarf, among thousands of runners who haven't slept. A rocket goes off. Six 1,300-pound bulls appear at the end of the street. They don't look well rested either.",
        "Your buddies convinced you to run with the bulls, {w:excuse}. You drank sangria until 6 a.m. The nearest bull, according to the program, is named “Asesino.” It's looking at you.",
        "You're running through Pamplona. Behind you: hooves. In front: a tourist taking a selfie. To your left: a barricade. Above: spectators yelling “{w:exclaim}”",
        "San Fermín festival. You didn't want to run, you just went out to buy {w:food}. Wrong street. It's full of people in white running and screaming. You hear a bellow.",
      ],
    },
    choices: [
      {
        label: { fr: 'Courir comme un dératé', en: 'Run like hell' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai couru 800 mètres en hurlant comme une sirène, sauté par-dessus un Australien et atteint l'arène vivant{|e}. Le taureau est passé à 30 cm. J'ai mouillé ma tenue blanche. Elle n'est plus blanche.", "J'ai couru si vite que j'ai doublé un taureau. Il m'a regardé{|e}, surpris. Je suis passé{|e} dans le journal : « Le touriste qui a humilié Asesino »."], en: ["I ran half a mile screaming like a siren, leapt over an Australian and reached the arena alive. The bull passed a foot away. I wet my white outfit. It's no longer white.", "I ran so fast I overtook a bull. It looked at me, surprised. I made the paper: “The tourist who humiliated Asesino.”"] }, fx: { happy: 10, athletic: 3, stress: 8 }, mood: 'proud' },
          { w: 1, text: { fr: ["Le taureau m'a encorné{|e} par le fond du pantalon et m'a promené{|e} sur 50 mètres comme un drapeau. Ma fesse gauche a désormais deux trous de plus. Le taureau a l'air content.", "Coup de corne dans la cuisse. Le sang a giclé sur trois touristes, qui ont cru que ça faisait partie du spectacle et ont applaudi. Je suis parti{|e} en ambulance sous les vivats."], en: ["The bull gored me through the seat of my pants and paraded me 50 yards like a flag. My left buttock now has two extra holes. The bull looks pleased.", "Horn to the thigh. Blood sprayed three tourists, who thought it was part of the show and applauded. I left by ambulance to cheers."] }, fx: { health: -15, happy: -3, visual: 'gore' }, mood: 'sick' },
          { w: 1, rating: 2, text: { fr: ["Asesino a mérité son nom. Il m'a encorné{|e}, lancé{|e} en l'air, rattrapé{|e} et piétiné{|e}. On a retrouvé mon foulard rouge sur une corne et ma chaussure sur un balcon. Le taureau a eu sa photo dans le journal."], en: ["Asesino earned his name. He gored me, tossed me, caught me and trampled me. They found my red scarf on a horn and my shoe on a balcony. The bull got his photo in the paper."] }, fx: { die: { fr: "encorné{|e} par un taureau nommé Asesino à Pampelune", en: 'gored by a bull named Asesino in Pamplona' }, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Escalader la palissade', en: 'Climb the barricade' },
        out: [
          { w: 2, text: { fr: ["J'ai escaladé la palissade en trois secondes, comme un chat. Un vieux monsieur m'a tendu un verre de vin : « Tu as fait ça très bien, pour un lâche. » Je l'accepte.", "Je me suis jeté{|e} sur la palissade. Mon pantalon y est resté accroché, moi de l'autre côté. Les taureaux ont piétiné mon pantalon. Je l'ai fait encadrer."], en: ["I scaled the barricade in three seconds, like a cat. An old man handed me a glass of wine: “You did that very well, for a coward.” I'll take it.", "I threw myself over the barricade. My pants got snagged and stayed, I landed on the other side. The bulls trampled my pants. I had them framed."] }, fx: { happy: 4, stress: 4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire le mort', en: 'Play dead' },
        out: [
          { w: 1, text: { fr: ["Je me suis roulé{|e} en boule par terre. Six taureaux et 2 000 coureurs m'ont enjambé{|e}. Quelqu'un m'a marché sur la tête. Un taureau m'a reniflé{|e}, a soufflé et a continué. J'ai rampé jusqu'à un bar.", "J'ai fait le mort. Un taureau a fait caca à côté de moi, en me regardant dans les yeux. C'était un message. Je l'ai reçu."], en: ["I curled into a ball on the ground. Six bulls and 2,000 runners stepped over me. Someone stepped on my head. A bull sniffed me, snorted and moved on. I crawled to a bar.", "I played dead. A bull pooped next to me, looking me in the eye. It was a message. I received it."] }, fx: { health: -4, stress: 6, visual: 'poop' }, mood: 'sick' },
        ],
      },
    ],
  },
];
