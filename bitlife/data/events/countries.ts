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
];
