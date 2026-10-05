// Young adult life (18–32): university, first apartment, festivals & nightlife, travel,
// quarter-life crisis, adulting fails, gym, crypto, dogs, parents & friends' weddings, hangovers.
import type { EventDef } from '@bl/sim';

export const youngEvents: EventDef[] = [
  // ───────────────────────────── université ─────────────────────────────
  {
    id: 'yo_freshers_hazing',
    icon: '🪣',
    cat: 'uni',
    rating: 2,
    scene: { place: 'uni', mood: 'shock', prop: 'bucket' },
    when: { age: [18, 20], school: 'uni' },
    weight: 8,
    once: true,
    text: {
      fr: ["Semaine d'intégration à {school}. Des troisièmes années déguisés en moines te tendent un seau : bière tiède, nuoc-mâm et un truc qui bouge. « Cul sec, bizut. »", "Week-end d'intégration : on t'a bandé les yeux, recouvert{|e} de farine et de sauce barbecue, et un type en slip léopard hurle « RAMPE, LARVE ! » dans un mégaphone."],
      en: ["Freshers' week at {school}. Third-years dressed as monks hand you a bucket: warm beer, fish sauce and something that moves. 'Down it, fresher.'", "Initiation weekend: you've been blindfolded, coated in flour and barbecue sauce, and a guy in leopard briefs is screaming 'CRAWL, LARVA!' through a megaphone."],
    },
    choices: [
      {
        label: { fr: 'Boire le seau', en: 'Chug the bucket' },
        out: [
          { w: 3, text: { fr: "J'ai bu le seau. Le truc qui bougeait, c'était un poisson rouge. Il vit quelque part en moi. J'ai vomi un arc-en-ciel sur le président du BDE, qui m'a sacré{|e} « légende de la promo ».", en: "I chugged the bucket. The thing that moved was a goldfish. It lives somewhere inside me now. I puked a rainbow on the student union president, who crowned me 'class legend'." }, fx: { happy: 6, health: -6, fame: 2, addiction: ['alcohol', 5] }, mood: 'party' },
          { w: 1, text: { fr: "Trois gorgées, puis mon estomac a tout renvoyé en jet sur douze personnes, dont un prof qui passait par là. Mon surnom pour les trois ans à venir : « Le Geyser ».", en: "Three gulps, then my stomach fire-hosed it all over twelve people, including a professor who happened to walk by. My nickname for the next three years: 'The Geyser'." }, fx: { health: -5, happy: -4, fame: 3 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Refuser poliment', en: 'Politely refuse' }, text: { fr: "J'ai refusé. On m'a déclaré{|e} « traître à la promo » et scotché{|e} à un lampadaire pendant deux heures. Mais j'ai gardé tous mes organes.", en: "I refused. I was declared a 'class traitor' and duct-taped to a lamppost for two hours. But I kept all my organs." }, fx: { happy: -4, karma: 3, discipline: 3 } },
      {
        label: { fr: "Balancer à l'administration", en: 'Report them' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai dénoncé le bizutage. Le BDE a été dissous. J'ai été haï{|e} trois semaines, puis élu{|e} au nouveau BDE. La politique, c'est ça.", en: "I reported the hazing. The student union got dissolved. I was hated for three weeks, then elected to the new one. That's politics." }, fx: { karma: 6, happy: 2 } },
          { w: 1, text: { fr: "L'administration a « pris note ». Le lendemain, ma chambre était remplie de 400 gobelets d'eau posés au sol. J'ai mis deux heures à atteindre mon lit.", en: "The administration 'took note'. The next day, my room was filled with 400 cups of water on the floor. It took me two hours to reach my bed." }, fx: { karma: 4, happy: -5, stress: 5 } },
        ],
      },
    ],
  },
  {
    id: 'yo_roommate_hell',
    icon: '🐍',
    cat: 'uni',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'snake' },
    when: { age: [18, 24], school: 'uni' },
    actor: { create: { role: 'acquaintance', age: [-1, 2], gender: 'same' } },
    weight: 9,
    cooldown: 4,
    text: {
      fr: ["{a:Ton nouveau coloc|Ta nouvelle coloc} de résidence, {a.first}, joue du didgeridoo à 3 h du matin, élève un python nommé Gérard et pratique la « méditation nue » sur ton lit pendant que tu es en cours.", "{a.first}, {a:ton coloc|ta coloc} de chambre universitaire, ne se lave plus « pour préserver son microbiome ». Ça fait onze jours. Ton microbiome à toi demande l'asile politique."],
      en: ["Your new dorm roommate, {a.first}, plays the didgeridoo at 3 a.m., keeps a python named Gerald and practices 'naked meditation' on your bed while you're in class.", "{a.first}, your dorm roommate, has stopped showering 'to protect the microbiome'. It's been eleven days. Your own microbiome is requesting political asylum."],
    },
    choices: [
      { label: { fr: 'Embrasser le chaos', en: 'Embrace the chaos' }, text: { fr: "J'ai adopté le chaos. On joue du didgeridoo en duo maintenant, et Gérard le python dort entre nous deux. Les voisins de palier ont déménagé.", en: 'I embraced the chaos. We play didgeridoo duets now, and Gerald the python sleeps between us. The neighbors moved out.' }, fx: { happy: 6, stress: 3, rel: 25, actorRole: 'friend' }, mood: 'happy' },
      {
        label: { fr: 'Changer de chambre', en: 'Request a room change' },
        out: [
          { w: 2, text: { fr: "Le formulaire de changement faisait neuf pages. Ma nouvelle coloc collectionne les rognures d'ongles de pied. Dans des bocaux. Étiquetés par année.", en: 'The room change form was nine pages long. My new roommate collects toenail clippings. In jars. Labeled by year.' }, fx: { happy: -4, stress: 4 } },
          { w: 1, text: { fr: "Changement accepté ! Mon nouveau coloc étudie, dort et plie ses chaussettes en triangle. Je m'ennuie un peu, mais j'ai de meilleures notes.", en: 'Change approved! My new roommate studies, sleeps and folds his socks into triangles. I am slightly bored, but my grades are up.' }, fx: { happy: 4, grade: 4 } },
        ],
      },
      { label: { fr: 'Vengeance au hareng', en: 'Herring revenge' }, text: { fr: "J'ai cousu un hareng fumé dans son matelas. Personne n'a rien remarqué pendant un mois. Puis tout l'étage a remarqué en même temps.", en: 'I sewed a smoked herring into their mattress. Nobody noticed for a month. Then the whole floor noticed at once.' }, fx: { happy: 3, karma: -3, rel: -20, actorRole: 'enemy' }, mood: 'angry' },
    ],
  },
  {
    id: 'yo_energy_cram',
    icon: '🥫',
    cat: 'uni',
    rating: 1,
    scene: { place: 'uni', mood: 'shock', prop: 'cans' },
    when: { age: [18, 27], school: 'uni' },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Partiel de {major} demain, 8 h. Il est 22 h et tu n'as rien ouvert. Sur ton bureau, 14 canettes de boisson énergisante goût « Tempête Tropicale Extrême ».", "Nuit blanche en vue. Ton plan : six canettes énergisantes, du café soluble mangé à la petite cuillère, et l'espoir."],
      en: ["{major} exam tomorrow, 8 a.m. It's 10 p.m. and you haven't opened a thing. On your desk: 14 cans of 'Extreme Tropical Storm' energy drink.", 'All-nighter incoming. Your plan: six energy drinks, instant coffee eaten with a spoon, and hope.'],
    },
    choices: [
      {
        label: { fr: 'Tout boire', en: 'Drink them all' },
        out: [
          { w: 2, text: { fr: "À la neuvième canette, j'entendais les couleurs. J'ai écrit 14 pages en 40 minutes. Le prof a noté : « Brillant, mais pourquoi tout en majuscules ? »", en: "By can number nine I could hear colors. I wrote 14 pages in 40 minutes. The professor wrote: 'Brilliant, but why is it all in caps?'" }, fx: { grade: 10, health: -6, stress: 8 }, mood: 'proud' },
          { w: 1, text: { fr: "Mon cœur battait si vite qu'il a fini l'examen avant moi. Les urgences m'ont gardé{|e} la nuit. Le partiel s'est très bien passé, sans moi.", en: 'My heart was beating so fast it finished the exam before I did. The ER kept me overnight. The exam went great, without me.' }, fx: { health: -12, grade: -8 }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai tout bu, tout retenu, puis je n'ai plus dormi pendant quatre jours. Un raton laveur m'a fait un exposé sur la TVA. Il était très clair.", en: "I drank it all, learned it all, then didn't sleep for four days. A raccoon gave me a presentation on sales tax. Very clear speaker." }, fx: { grade: 4, smarts: 2, disease: 'insomnia' }, mood: 'sleepy' },
        ],
      },
      {
        label: { fr: 'Dormir et prier', en: 'Sleep and pray' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai dormi huit heures. Mon cerveau reposé a deviné la moitié des réponses et inventé l'autre avec un aplomb remarquable.", en: 'I slept eight hours. My rested brain guessed half the answers and invented the rest with remarkable confidence.' }, fx: { grade: 2, health: 3 } },
          { w: 1, text: { fr: "J'ai dormi comme un bébé. J'ai répondu comme un bébé.", en: 'I slept like a baby. I answered like a baby.' }, fx: { grade: -6, happy: 3 } },
        ],
      },
      { label: { fr: 'Revendre les canettes', en: 'Resell the cans' }, text: { fr: "J'ai revendu mes canettes à prix d'or au couloir en panique. J'ai raté le partiel, mais j'ai de quoi faire les courses pendant un mois.", en: "I sold my cans at insane prices to a panicking hallway. I failed the exam, but I've got a month of groceries covered." }, fx: { money: 60, grade: -5, happy: 4 } },
    ],
  },
  {
    id: 'yo_plagiarism',
    icon: '📋',
    cat: 'uni',
    rating: 1,
    scene: { place: 'uni', mood: 'sleepy', prop: 'laptop' },
    when: { age: [18, 28], school: 'uni' },
    vars: { amount: [50, 300] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Ton dossier de {major} est à rendre demain. Il te reste une option : le faire écrire par une IA et changer trois mots. Ou copier le blog d'un inconnu de 2009.", "30 pages à rendre dans six heures. Un site propose des « dissertations clé en main » à {$amount}. Le logo est un hibou qui fait un clin d'œil."],
      en: ["Your {major} paper is due tomorrow. One option left: have an AI write it and change three words. Or copy some stranger's blog from 2009.", "30 pages due in six hours. A website offers 'turnkey essays' for {$amount}. The logo is a winking owl."],
    },
    choices: [
      {
        label: { fr: 'Copier-coller', en: 'Copy-paste it all' },
        out: [
          { w: 1, text: { fr: "J'ai rendu un dossier magnifique. Il contenait encore la phrase « En tant que modèle de langage, je ne peux pas… ». Convocation immédiate.", en: "I turned in a beautiful paper. It still contained the sentence 'As a language model, I cannot…'. Summoned immediately." }, fx: { grade: -10, stress: 10, karma: -5, chain: 'yo_plagiarism_hearing' }, mood: 'shock' },
          { w: 1, text: { fr: "Copier-coller intégral. 17/20. Le prof a écrit : « Enfin quelqu'un qui sait écrire. » Ma conscience m'a rendu copie blanche.", en: "Full copy-paste. A+. The professor wrote: 'Finally, someone who can write.' My conscience handed in a blank page." }, fx: { grade: 10, karma: -6 } },
        ],
      },
      {
        label: { fr: 'Acheter la dissert', en: 'Buy the essay' },
        out: [
          { w: 1, text: { fr: "J'ai payé {$amount} et reçu 30 pages sur la reproduction des escargots. Mon sujet, c'était la Révolution française. J'ai rendu quand même. Personne n'a rien dit.", en: 'I paid {$amount} and got 30 pages on snail reproduction. My topic was the French Revolution. I turned it in anyway. Nobody said a thing.' }, fx: { money: '-amount', grade: -6, happy: -3 } },
          { w: 1, text: { fr: "Pour {$amount}, un doctorant épuisé m'a pondu un travail correct et un petit mot : « Bon courage dans la vie. » 14/20.", en: "For {$amount}, an exhausted PhD student wrote me a decent paper and a little note: 'Good luck with life.' B+." }, fx: { money: '-amount', grade: 6, karma: -4 } },
        ],
      },
      { label: { fr: 'Écrire moi-même', en: 'Write it myself' }, text: { fr: "J'ai écrit 30 pages en une nuit en pleurant sur mon clavier. C'était nul, mais c'était mon nul à moi. 11/20.", en: 'I wrote 30 pages in one night, crying onto my keyboard. It was bad, but it was my own bad. C.' }, fx: { grade: 3, discipline: 5, stress: 6, health: -2 }, mood: 'proud' },
    ],
  },
  {
    id: 'yo_plagiarism_hearing',
    icon: '⚖️',
    cat: 'uni',
    chainOnly: true,
    scene: { place: 'uni', mood: 'shock', prop: 'desk' },
    when: { age: [18, 30] },
    text: {
      fr: ["Commission de discipline. Cinq profs alignés te regardent comme un cafard sur une pièce montée. Le doyen tient ta copie avec une pince à épiler.", "Tu es convoqué{|e} pour plagiat. Le président de la commission a surligné en jaune chaque phrase volée. La copie est entièrement jaune."],
      en: ['Disciplinary committee. Five professors in a row stare at you like a cockroach on a wedding cake. The dean holds your paper with tweezers.', "You've been summoned for plagiarism. The committee chair highlighted every stolen sentence in yellow. The paper is entirely yellow."],
    },
    choices: [
      { label: { fr: 'Avouer en pleurant', en: 'Confess and cry' }, text: { fr: "J'ai tout avoué en sanglotant. Ils ont été émus. Zéro au module, mais je reste inscrit{|e}. Le doyen m'a tendu un mouchoir, puis me l'a facturé.", en: 'I confessed everything, sobbing. They were moved. Zero for the course, but I stay enrolled. The dean handed me a tissue, then billed me for it.' }, fx: { grade: -10, karma: 3, happy: -5 }, mood: 'cry' },
      {
        label: { fr: 'Nier en bloc', en: 'Deny everything' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai plaidé « l'inspiration convergente ». Un prof a hoché la tête. Ils ont abandonné, épuisés. Je suis officiellement innocent{|e}.", en: "I argued 'convergent inspiration'. One professor nodded. They gave up, exhausted. I am officially innocent." }, fx: { karma: -4, happy: 4 } },
          { w: 1, text: { fr: "Ils ont projeté la page d'origine à côté de ma copie, avec les mêmes fautes de frappe. Exclu{|e}. Le doyen a souri pour la première fois depuis 1994.", en: 'They projected the original page next to mine, same typos and all. Expelled. The dean smiled for the first time since 1994.' }, fx: { expel: true, happy: -15, stress: 10 }, mood: 'cry' },
        ],
      },
      { label: { fr: "Accuser l'IA", en: 'Blame the AI' }, text: { fr: "J'ai expliqué que l'IA m'avait « influencé{|e} ». Blâme et formation obligatoire « Éthique et numérique ». Animée par une IA.", en: "I explained that the AI had 'influenced' me. Official warning and a mandatory 'Digital Ethics' course. Taught by an AI." }, fx: { grade: -5, stress: 4 } },
    ],
  },
  {
    id: 'yo_erasmus',
    icon: '✈️',
    cat: 'uni',
    scene: { place: 'uni', mood: 'happy', prop: 'suitcase' },
    when: { age: [19, 25], school: 'uni' },
    weight: 7,
    once: true,
    text: {
      fr: ["Ta fac te propose un semestre d'échange à l'étranger. Les anciens disent qu'on y apprend une langue, trois recettes et zéro cours.", "Le bureau des relations internationales a une place pour toi : six mois à l'étranger, une bourse ridicule et une coloc avec un type qui ne mange que des céréales et une fille qui ne parle qu'en mèmes."],
      en: ['Your university offers you an exchange semester abroad. Former students say you learn one language, three recipes and zero coursework.', "The international office has a spot for you: six months abroad, a laughable grant, and roommates including a guy who only eats cereal and a girl who only speaks in memes."],
    },
    choices: [
      { label: { fr: "Partir à l'aventure", en: 'Go abroad' }, text: { fr: "J'ai fait ma valise avec trois pulls et un dictionnaire. Je reviens dans un an, changé{|e}. Normalement.", en: "I packed three sweaters and a dictionary. Back in a year, a changed person. Supposedly." }, fx: { happy: 8, stress: 3, flag: 'yo_erasmus', schedule: { key: 'yo_erasmus_back', years: 1 } }, mood: 'happy' },
      { label: { fr: 'Rester au chaud', en: 'Stay home' }, text: { fr: "J'ai décliné. Je suivrai l'échange des autres en story, avec un paquet de chips et une légère amertume.", en: "I declined. I'll follow everyone else's exchange on their stories, with a bag of chips and mild bitterness." }, fx: { happy: -3, grade: 2 } },
    ],
  },
  {
    id: 'yo_erasmus_back',
    icon: '🍻',
    cat: 'uni',
    rating: 1,
    chainOnly: true,
    scene: { place: 'party', mood: 'party', prop: 'beer' },
    when: { age: [19, 28], flag: 'yo_erasmus' },
    text: {
      fr: ["Retour d'échange. Tu as pris six kilos de bière locale, appris à dire « encore une tournée » en neuf langues, et tes notes sont arrivées dans une enveloppe qui sent le regret.", "Ton semestre à l'étranger est fini. Tu as un accent que personne ne croit, un tatouage dans un alphabet inconnu, et tu dis « chez nous, là-bas » en parlant d'un pays où tu as passé cinq mois."],
      en: ["Back from your exchange. You gained 13 pounds of local beer, learned to say 'one more round' in nine languages, and your grades arrived in an envelope that smells of regret.", "Your semester abroad is over. You have an accent nobody believes, a tattoo in an unknown alphabet, and you say 'back home' about a country you lived in for five months."],
    },
    choices: [
      { label: { fr: 'En parler à tout le monde', en: 'Talk about it nonstop' }, text: { fr: "J'ai parlé de mon échange pendant huit mois sans pause. Mes amis ont créé un groupe « Survivants de l'Erasmus de {first} ». Je n'y suis pas.", en: "I talked about my exchange for eight months straight. My friends started a group chat called 'Survivors of {first}'s Exchange'. I'm not in it." }, fx: { happy: 6, smarts: 3, weight: 0.04 } },
      {
        label: { fr: "Revoir mon amour d'échange", en: 'Visit my exchange fling' },
        out: [
          { w: 1, text: { fr: "J'ai repris l'avion pour revoir mon amour d'échange. Il ou elle m'a ouvert avec un nouvel étudiant d'échange, en peignoir. Le mien. Celui que j'avais oublié.", en: 'I flew back to see my exchange fling. They opened the door with a new exchange student wearing a bathrobe. Mine. The one I left behind.' }, fx: { money: -300, happy: -8 }, mood: 'cry' },
          { w: 1, text: { fr: "Un week-end magique, puis on a réalisé que sans alcool, on ne parlait pas vraiment la même langue. Rupture propre, bisous, bon vent.", en: "One magical weekend, then we realized that sober, we didn't really speak the same language. Clean breakup, kisses, safe travels." }, fx: { money: -300, happy: 4 }, mood: 'love' },
        ],
      },
      { label: { fr: 'Rattraper les cours', en: 'Catch up on classes' }, text: { fr: "J'ai rattrapé six mois de cours en trois semaines. J'ai découvert que les « crédits ECTS » n'étaient pas qu'une légende urbaine.", en: "I caught up on six months of classes in three weeks. Turns out 'transfer credits' aren't just an urban legend." }, fx: { grade: 6, stress: 6, discipline: 4 } },
    ],
  },
  {
    id: 'yo_debt_dread',
    icon: '📉',
    cat: 'uni',
    scene: { place: 'apartment', mood: 'sad', prop: 'letter' },
    when: { age: [20, 30], school: 'uni' },
    vars: { amount: [8000, 45000] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Tu reçois le relevé de ton prêt étudiant : {$amount}. À ce rythme, tu auras fini de rembourser à 58 ans, juste à temps pour aider tes enfants à s'endetter.", "Lettre de la banque : « Le remboursement de votre prêt étudiant de {$amount} débutera dans six mois. » Tu la ranges dans le tiroir des choses qui n'existent pas."],
      en: ["Your student loan statement arrives: {$amount}. At this rate you'll be done paying at 58, just in time to help your kids go into debt.", "Letter from the bank: 'Repayment of your {$amount} student loan begins in six months.' You file it in the drawer of things that don't exist."],
    },
    choices: [
      { label: { fr: 'Faire un tableur', en: 'Make a spreadsheet' }, text: { fr: "J'ai fait un tableau de remboursement. Il faisait 412 lignes. J'ai fermé l'ordinateur et je suis allé{|e} m'allonger dans le noir.", en: 'I made a repayment spreadsheet. It had 412 rows. I closed the laptop and went to lie down in the dark.' }, fx: { stress: 6, smarts: 2, discipline: 4 } },
      { label: { fr: 'Ignorer le problème', en: 'Ignore it' }, text: { fr: "J'ai rangé la lettre dans le tiroir. Le tiroir est plein. Je crois qu'il grogne la nuit.", en: 'I put the letter in the drawer. The drawer is full now. I think it growls at night.' }, fx: { stress: 3, happy: 2 } },
      { label: { fr: 'Prendre un job de nuit', en: 'Take a night job' }, text: { fr: "J'ai pris un job de nuit dans une station-service. J'ai mis de côté un peu d'argent et appris à reconnaître les gens qui achètent du lait et des allumettes à 3 h.", en: 'I took a night shift at a gas station. I saved a little money and learned to recognize people who buy milk and matches at 3 a.m.' }, fx: { money: 1500, health: -4, grade: -4, stress: 4 } },
    ],
  },
  {
    id: 'yo_campus_protest',
    icon: '📢',
    cat: 'uni',
    rating: 1,
    scene: { place: 'uni', mood: 'angry', prop: 'banner', fx: 'police' },
    when: { age: [18, 27], school: 'uni' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["Le campus est bloqué. Des étudiants ont empilé des chaises devant l'amphi et scandent des slogans contre la hausse des frais d'inscription. L'un d'eux distribue des croissants révolutionnaires.", "Manif sur le campus contre la réforme. Les CRS arrivent au bout de la rue. Quelqu'un te tend un mégaphone et une banderole « NI DIEU NI PARTIELS »."],
      en: ["The campus is blockaded. Students have stacked chairs in front of the lecture hall and are chanting against the tuition hike. One of them is handing out revolutionary croissants.", "Campus protest against the reform. Riot police are at the end of the street. Someone hands you a megaphone and a banner reading 'NO GODS NO FINALS'."],
    },
    choices: [
      {
        label: { fr: 'En première ligne', en: 'Front line' },
        out: [
          { w: 2, text: { fr: "Mon discours improvisé au mégaphone a fait le tour des réseaux. Puis j'ai mangé du gaz lacrymo. J'ai pleuré pour la cause, littéralement.", en: 'My improvised megaphone speech went viral. Then I ate a face full of tear gas. I cried for the cause, literally.' }, fx: { fame: 4, followers: 800, health: -4, karma: 4, visual: 'police' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai fini au poste pour avoir lancé un œuf sur un commissaire. L'œuf était dur. Ça compte comme une arme, apparemment.", en: 'I ended up at the station for throwing an egg at a police captain. It was hard-boiled. That counts as a weapon, apparently.' }, fx: { arrest: 'vandal', heat: 10, visual: 'police' }, mood: 'shock' },
        ],
      },
      { label: { fr: "Juste pour l'ambiance", en: 'Just for the vibes' }, text: { fr: "J'ai rejoint le blocus pour les croissants et la guitare. Trois nuits dans un amphi, un sac de couchage partagé, et un ou deux baisers révolutionnaires.", en: 'I joined the blockade for the croissants and the guitar. Three nights in a lecture hall, a shared sleeping bag, and a revolutionary kiss or two.' }, fx: { happy: 7, grade: -3 }, mood: 'love' },
      { label: { fr: 'Escalader les chaises', en: 'Climb the barricade' }, text: { fr: "J'ai escaladé les chaises pour aller en cours. J'étais seul{|e} avec le prof. Il a fait cours quand même. À moi. Deux heures. Avec des questions.", en: 'I climbed the chairs to get to class. It was just me and the professor. He taught anyway. To me. Two hours. With questions.' }, fx: { grade: 4, karma: -2, happy: -3 } },
    ],
  },
  {
    id: 'yo_dorm_fire',
    icon: '🔥',
    cat: 'uni',
    rating: 2,
    scene: { place: 'uni', mood: 'shock', prop: 'smoke', fx: 'fire' },
    when: { age: [18, 25], school: 'uni' },
    weight: 5,
    once: true,
    text: {
      fr: ["Alarme incendie à 2 h du matin. Pas un exercice : un voisin d'étage a voulu faire une raclette au chalumeau. Le couloir crache des flammes et une odeur de fromage carbonisé.", "Ta résidence brûle. Départ de feu : ton voisin qui séchait son caleçon au micro-ondes. Tu as dix secondes pour choisir ce que tu sauves."],
      en: ["Fire alarm at 2 a.m. Not a drill: someone on your floor tried to make raclette with a blowtorch. The hallway is spitting flames and the smell of charred cheese.", 'Your dorm is on fire. Cause: your neighbor drying his boxers in the microwave. You have ten seconds to decide what to save.'],
    },
    choices: [
      {
        label: { fr: 'Sauver mon PC', en: 'Save my laptop' },
        out: [
          { w: 2, text: { fr: "J'ai traversé les flammes pour sauver mon portable et mon mémoire. J'ai perdu mes sourcils. Ils ont repoussé, mais en diagonale.", en: 'I ran through the flames to save my laptop and my thesis. I lost my eyebrows. They grew back, but diagonally.' }, fx: { looks: -5, health: -6, grade: 5, disease: 'burns', visual: 'fire' } },
          { w: 1, text: { fr: "Le PC a fondu. Moi, à moitié. J'ai maintenant une cicatrice en forme de touche « Échap » sur la fesse, ce qui est poétique.", en: "The laptop melted. So did half of me. I now have a scar shaped like the 'Esc' key on my butt, which is poetic." }, fx: { health: -12, looks: -6, disease: 'burns', visual: 'fire' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Sauver le voisin', en: 'Save the neighbor' }, text: { fr: "J'ai traîné le voisin dehors, toujours en caleçon (l'autre, pas celui du micro-ondes). Le journal local m'a surnommé{|e} « le héros du reblochon ».", en: "I dragged the neighbor out, still in his boxers (the other pair, not the microwave ones). The local paper called me 'the cheese-fire hero'." }, fx: { karma: 10, fame: 5, health: -4, visual: 'fire' }, mood: 'proud' },
      { label: { fr: 'Sauver le fromage', en: 'Save the cheese' }, text: { fr: "J'ai sauvé la meule. On a fini la raclette sur le parking en regardant brûler le bâtiment, éclairés par les flammes. Une des meilleures soirées de ma vie.", en: 'I saved the cheese wheel. We finished the raclette in the parking lot, lit by the flames of the burning building. One of the best nights of my life.' }, fx: { happy: 10, karma: -3, weight: 0.02, visual: 'fire' }, mood: 'party' },
    ],
  },
  {
    id: 'yo_weird_exam',
    icon: '❓',
    cat: 'uni',
    scene: { place: 'uni', mood: 'shock', prop: 'paper' },
    when: { age: [18, 28], school: 'uni' },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Examen final de {major}. Le prof distribue le sujet : une seule question. « Pourquoi ? » Quatre heures. Calculatrice interdite.", "Ton professeur, réputé pour ses méthodes « innovantes », annonce que l'examen se fera en danse contemporaine. Sujet : la thermodynamique. Cinq minutes de préparation."],
      en: ["{major} final. The professor hands out the exam: one question. 'Why?' Four hours. No calculators.", "Your professor, known for 'innovative' methods, announces the exam will be performed as contemporary dance. Topic: thermodynamics. Five minutes to prepare."],
    },
    choices: [
      {
        label: { fr: 'Le minimalisme', en: 'Go minimalist' },
        out: [
          { w: 1, text: { fr: "J'ai écrit « Pourquoi pas ? » et je suis sorti{|e} au bout de 30 secondes. 20/20. Le prof a pleuré de joie.", en: "I wrote 'Why not?' and left after 30 seconds. Perfect score. The professor wept with joy." }, fx: { grade: 15, happy: 8 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai écrit « Pourquoi pas ? ». Le prof a répondu « Parce que. » et m'a mis 2/20.", en: "I wrote 'Why not?'. The professor wrote back 'Because.' and gave me an F." }, fx: { grade: -10, happy: -3 } },
        ],
      },
      {
        label: { fr: 'Y aller à fond', en: 'Commit fully' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai dansé l'entropie en me roulant par terre pendant six minutes. Le prof a parlé de « génie ». Mes camarades, de « crise ».", en: "I danced entropy by rolling on the floor for six minutes. The professor called it 'genius'. My classmates called it 'a seizure'." }, fx: { grade: 10, fame: 2, athletic: 2 } },
          { w: 1, text: { fr: "Je me suis claqué un mollet en plein « chaos moléculaire ». 9/20 et des béquilles.", en: "I pulled a calf muscle mid-'molecular chaos'. A D-minus and crutches." }, fx: { grade: -2, disease: 'sprain' } },
        ],
      },
      { label: { fr: 'Écrire douze pages', en: 'Write twelve pages' }, text: { fr: "J'ai rendu douze pages de philosophie dense. Le prof n'a lu que la première ligne, mais elle était bonne. 13/20.", en: 'I turned in twelve pages of dense philosophy. The professor only read the first line, but it was a good line. B.' }, fx: { grade: 5, smarts: 3 } },
    ],
  },
  {
    id: 'yo_frat_party',
    icon: '🍺',
    cat: 'party',
    rating: 2,
    scene: { place: 'party', mood: 'party', prop: 'keg' },
    when: { age: [18, 25], school: 'uni' },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Soirée de l'asso « Kappa Kappa Kebab ». Au milieu du salon : un fût de bière, un type tête en bas qui fait un keg stand depuis 40 secondes, et une piscine gonflable remplie de jelly shots.", "Finale du tournoi de beer-pong de la fac. Ton adversaire, surnommé « Le Kraken », n'a jamais perdu. Il boit sa bière par les narines. La foule scande ton prénom (mal prononcé)."],
      en: ["'Kappa Kappa Kebab' frat party. In the living room: a keg, a guy upside down doing a 40-second keg stand, and an inflatable pool full of jello shots.", "Campus beer pong final. Your opponent, known as 'The Kraken', has never lost. He drinks beer through his nostrils. The crowd chants your name (mispronounced)."],
    },
    choices: [
      {
        label: { fr: 'Record de keg stand', en: 'Keg stand record' },
        out: [
          { w: 2, text: { fr: "58 secondes, record de la fac. Puis tout est ressorti par le nez, la bouche et, je crois, une oreille. Un geyser doré sur trente personnes. On m'a porté{|e} en triomphe, en évitant de me toucher.", en: 'Fifty-eight seconds, campus record. Then it all came back out through my nose, mouth and, I believe, one ear. A golden geyser over thirty people. They carried me in triumph, careful not to touch me.' }, fx: { fame: 4, health: -6, happy: 8, addiction: ['alcohol', 8] }, mood: 'party' },
          { w: 1, text: { fr: "À 45 secondes, j'ai lâché prise. Je suis tombé{|e} sur la tête, rebondi{|e} sur un mec, et fini{|e} dans la piscine de jelly shots. Commotion, mais parfum fraise.", en: 'At 45 seconds I lost my grip. I landed on my head, bounced off a guy and ended up in the jello shot pool. Concussion, but strawberry-scented.' }, fx: { health: -10, happy: 2, disease: 'concussion' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Battre le Kraken', en: 'Beat the Kraken' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai battu le Kraken. Il s'est effondré en larmes et m'a remis sa casquette. Je suis le nouveau Kraken. C'est une lourde charge.", en: "I beat the Kraken. He collapsed in tears and handed me his cap. I am the new Kraken. It's a heavy burden." }, fx: { fame: 3, happy: 10, addiction: ['alcohol', 5] }, mood: 'proud' },
          { w: 1, text: { fr: "10-0 pour le Kraken. J'ai bu dix gobelets de bière tiède qui avaient traîné par terre, cheveux et capsules compris, puis vomi dans la machine à laver de l'asso. Elle était en marche.", en: "10-0, Kraken. I drank ten cups of warm floor beer, hair and bottle caps included, then threw up into the frat's washing machine. It was running." }, fx: { health: -6, happy: -4 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Draguer à la buanderie', en: 'Flirt in the laundry room' }, text: { fr: "J'ai fini la soirée dans la buanderie avec quelqu'un qui sentait la tequila et la mauvaise idée. Le sèche-linge n'oubliera jamais ce qu'il a vu. Je n'ai jamais su son prénom.", en: "I ended the night in the laundry room with someone who smelled of tequila and bad decisions. The dryer will never forget what it saw. I never got their name." }, fx: { happy: 8, karma: -1 }, mood: 'love' },
    ],
  },
  {
    id: 'yo_auto_lecture',
    icon: '💤',
    cat: 'uni',
    auto: true,
    scene: { place: 'uni', mood: 'sleepy' },
    when: { age: [18, 28], school: 'uni' },
    weight: 7,
    cooldown: 3,
    text: {
      fr: ["Je me suis endormi{|e} en amphi de {major} et réveillé{|e} deux heures plus tard en plein cours de droit maritime. J'ai pris des notes par politesse.", "J'ai assisté à un cours entier avant de comprendre que je n'étais même pas inscrit{|e} dans cette matière. C'était passionnant. J'y retourne mardi."],
      en: ['I fell asleep in my {major} lecture and woke up two hours later in the middle of a maritime law class. I took notes out of politeness.', "I sat through an entire lecture before realizing I wasn't even enrolled in that subject. It was fascinating. I'm going back Tuesday."],
    },
    fx: { smarts: 2 },
  },
  {
    id: 'yo_campus_streak',
    icon: '🏃',
    cat: 'uni',
    rating: 2,
    scene: { place: 'uni', mood: 'shock', prop: 'fountain' },
    when: { age: [18, 26], school: 'uni' },
    weight: 5,
    once: true,
    text: {
      fr: ["Pari perdu au poker. Le gage : traverser le campus entièrement nu{|e}, en plein jour, pendant les portes ouvertes. Des parents prennent des photos de la fontaine. Tu es à côté de la fontaine.", "Ton groupe de TD a gagné le pari : tu dois courir nu{|e} autour de la bibliothèque universitaire avec juste un casque de chantier et des chaussettes. Le gardien est un ancien rugbyman."],
      en: ['You lost a poker bet. The forfeit: streak across campus, fully naked, in broad daylight, during open day. Parents are taking photos of the fountain. You are next to the fountain.', "Your study group won the bet: you must run naked around the university library wearing only a hard hat and socks. The security guard is a former rugby player."],
    },
    choices: [
      {
        label: { fr: 'Payer ma dette, à poil', en: 'Pay up, naked' },
        out: [
          { w: 2, text: { fr: "J'ai couru nu{|e} en hurlant l'hymne de la fac. Une mère de famille a applaudi. Un lycéen a décidé de s'inscrire « pour l'ambiance ». Je suis une légende.", en: 'I streaked across campus belting the school anthem. A mom applauded. A high schooler decided to enroll "for the vibe". I am a legend.' }, fx: { fame: 5, happy: 10, followers: 2000, karma: -1 }, mood: 'party' },
          { w: 1, text: { fr: "Le gardien m'a plaqué{|e} dans un massif d'orties. Je me suis gratté{|e} des endroits que je ne nommerai pas pendant une semaine. Avertissement disciplinaire en prime.", en: "The guard tackled me into a patch of stinging nettles. I scratched places I won't name for a week. Plus a disciplinary warning." }, fx: { health: -6, happy: -4, grade: -4, heat: 5 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Négocier le slip', en: 'Negotiate underwear' }, text: { fr: "J'ai négocié un slip léopard. J'ai l'air encore plus ridicule qu'à poil, mais je suis légalement couvert{|e}.", en: "I negotiated leopard-print briefs. I look even more ridiculous than naked, but I'm legally covered." }, fx: { happy: 3, fame: 2 } },
      { label: { fr: 'Me dégonfler', en: 'Chicken out' }, text: { fr: "Je me suis dégonflé{|e}. Mon groupe de TD m'appelle « Poulet » depuis. Même le prof a commencé.", en: "I chickened out. My study group calls me 'Chicken' now. Even the professor started doing it." }, fx: { happy: -5 } },
    ],
  },

  // ───────────────────────────── premier appart ─────────────────────────────
  {
    id: 'yo_coloc_wars',
    icon: '🍳',
    cat: 'home',
    rating: 1,
    scene: { place: 'apartment', mood: 'angry', prop: 'dishes' },
    when: { age: [18, 30], movedOut: true },
    actor: { create: { role: 'acquaintance', age: [-3, 3], gender: 'any' } },
    weight: 9,
    cooldown: 4,
    text: {
      fr: ["La guerre de la vaisselle fait rage dans ta coloc. {a.first} laisse une poêle « tremper » depuis 19 jours. Une forme de vie y a développé un système politique.", "{a.first}, {a:ton coloc|ta coloc}, ne communique plus que par Post-it passifs-agressifs. Le dernier, collé sur ton yaourt : « C'est bien de manger. C'est mieux de racheter du PQ. Bisous. »"],
      en: ["The dish war is raging in your shared flat. {a.first} has left a pan 'soaking' for 19 days. A life form inside has developed a political system.", "{a.first}, your flatmate, now communicates only through passive-aggressive Post-its. The latest, stuck on your yogurt: 'Eating is nice. Buying toilet paper is nicer. Kisses.'"],
    },
    choices: [
      {
        label: { fr: 'Réunion de coloc', en: 'Call a house meeting' },
        out: [
          { w: 1, text: { fr: "Réunion avec ordre du jour et tableau blanc. {a.first} est venu{a:|e} en peignoir avec un verre de vin. On a voté un planning de ménage. Personne ne l'a jamais respecté.", en: '{a.first} showed up to my agenda-and-whiteboard house meeting in a bathrobe with a glass of wine. We voted on a chore chart. Nobody ever followed it.' }, fx: { happy: 2, stress: -2, rel: 5 } },
          { w: 1, text: { fr: "La réunion a dégénéré : {a.first} a ressorti l'affaire du fromage de l'an dernier. On ne se parle plus que par l'intermédiaire de la plante verte.", en: "The meeting went nuclear: {a.first} brought up last year's cheese incident. We now speak only through the houseplant." }, fx: { rel: -15, stress: 6 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Guerre des Post-it', en: 'Post-it warfare' }, text: { fr: "J'ai répondu par un Post-it. Puis dix. Puis j'ai tapissé sa porte. {a.first} a riposté sur le frigo. Le frigo est devenu jaune. La poêle, elle, trempe toujours.", en: "I replied with a Post-it. Then ten. Then I wallpapered their door. {a.first} retaliated on the fridge. The fridge is now yellow. The pan is still soaking." }, fx: { happy: 3, stress: 4, rel: -8 } },
      { label: { fr: 'Faire la vaisselle', en: 'Just do the dishes' }, text: { fr: "J'ai lavé la poêle. Quelque chose m'a mordu{|e}. Six heures de ménage plus tard, {a.first} m'a dit : « T'avais pas besoin, j'allais le faire. »", en: "I washed the pan. Something bit me. Six hours of cleaning later, {a.first} said: 'You didn't have to, I was going to do it.'" }, fx: { health: -2, karma: 4, rel: 4, happy: -3 } },
    ],
  },
  {
    id: 'yo_ikea_rage',
    icon: '🔩',
    cat: 'home',
    rating: 1,
    scene: { place: 'apartment', mood: 'angry', prop: 'boxes' },
    when: { age: [18, 32], movedOut: true },
    weight: 8,
    once: true,
    text: {
      fr: ["Livraison de ton premier lit en kit : le modèle « SKRÜMPFLÅG ». 147 pièces, une clé Allen, et une notice où le petit bonhomme a l'air nettement plus serein que toi.", "Tu montes seul{|e} ta première commode en kit. Il est 23 h, tu as monté les tiroirs à l'envers, et le chat du voisin s'est assis dans la seule boîte de vis."],
      en: ["Your first flat-pack bed has arrived: the 'SKRÜMPFLÅG'. 147 parts, one Allen key, and a manual in which the little cartoon man looks far calmer than you.", "You're assembling your first flat-pack dresser alone. It's 11 p.m., the drawers are upside down, and the neighbor's cat is sitting in the only box of screws."],
    },
    choices: [
      {
        label: { fr: 'Suivre la notice', en: 'Follow the manual' },
        out: [
          { w: 2, text: { fr: "Quatre heures, deux ampoules et un coup de marteau sur le pouce plus tard, c'était monté. Ça penche légèrement à gauche, comme mes convictions. Putain, je suis fier{|e}.", en: "Four hours, two blisters and one hammered thumb later, it was done. It leans slightly left, like my politics. Damn, I'm proud." }, fx: { happy: 6, discipline: 3, health: -1 }, mood: 'proud' },
          { w: 1, text: { fr: "Monté. À 3 h du matin, le lit s'est replié sur moi comme un piège à loup. On m'a retrouvé{|e} coincé{|e} entre deux lattes, en position fœtale, en train d'insulter la Suède.", en: 'Assembled. At 3 a.m. the bed folded on me like a bear trap. I was found wedged between two slats in the fetal position, cursing Sweden.' }, fx: { health: -6, happy: -4, disease: 'back_pain' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Improviser', en: 'Freestyle it' }, text: { fr: "J'ai ignoré la notice. Le résultat ressemble à une œuvre d'art contemporain intitulée « Colère ». Il me reste 31 vis. Je dors dedans quand même.", en: "I ignored the manual. The result looks like a contemporary art piece titled 'Rage'. I have 31 screws left over. I sleep in it anyway." }, fx: { happy: 2, stress: 4 } },
      { label: { fr: 'Tout défoncer', en: 'Smash it' }, text: { fr: "J'ai insulté le meuble en suédois approximatif puis je l'ai pulvérisé à coups de pied. Je dors sur un matelas par terre, mais je me sens libre.", en: 'I cursed at the furniture in broken Swedish and then kicked it to pieces. I sleep on a mattress on the floor now, but I feel free.' }, fx: { stress: -6, money: -150, happy: 3 }, mood: 'angry' },
    ],
  },
  {
    id: 'yo_landlord_scam',
    icon: '🏚️',
    cat: 'home',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'keys' },
    when: { age: [18, 30] },
    vars: { amount: [500, 2000] },
    weight: 7,
    cooldown: 6,
    text: {
      fr: ["Tu trouves l'appart parfait en ligne : 45 m², centre-ville, loyer dérisoire. Le proprio, « actuellement en mission sur une plateforme pétrolière », te demande de virer {$amount} de caution avant la visite.", "Visite d'un « studio cosy ». En vrai : 9 m², le lit est en mezzanine au-dessus des toilettes, la douche est dans la cuisine. Le proprio demande {$amount} en liquide « pour le dossier »."],
      en: ["You find the perfect apartment online: huge, downtown, ridiculously cheap. The landlord, 'currently working on an oil rig', asks you to wire a {$amount} deposit before the viewing.", "Viewing a 'cozy studio'. Reality: 100 sq ft, the bed is a loft above the toilet, the shower is in the kitchen. The landlord wants {$amount} in cash 'for the file'."],
    },
    choices: [
      {
        label: { fr: 'Payer la caution', en: 'Pay the deposit' },
        out: [
          { w: 1, text: { fr: "J'ai payé {$amount}. Le proprio a disparu, son numéro aussi. L'adresse était celle d'un kebab. Le gérant m'a offert des frites par pitié.", en: "I paid {$amount}. The landlord vanished, so did his number. The address was a kebab shop. The owner gave me free fries out of pity." }, fx: { money: '-amount', happy: -10, stress: 8 }, mood: 'cry' },
          { w: 1, text: { fr: "Miracle, l'appart existait ! Il était juste infesté de punaises de lit et posé au-dessus d'une boîte techno. J'ai signé quand même. Je dors en rythme.", en: 'Miracle, the place was real! It was just infested with bedbugs and sitting on top of a techno club. I signed anyway. I sleep in rhythm now.' }, fx: { money: '-amount', happy: -2, stress: 4 } },
        ],
      },
      { label: { fr: 'Signaler l’annonce', en: 'Report the listing' }, text: { fr: "J'ai signalé l'annonce. Elle a été republiée le lendemain avec mes propres photos de profil. C'est moi l'arnaqueur, maintenant.", en: "I reported the listing. It was reposted the next day using my own profile photos. I'm the scammer now, apparently." }, fx: { karma: 4, happy: -2, smarts: 2 } },
      { label: { fr: 'Négocier le studio-WC', en: 'Haggle for the toilet loft' }, text: { fr: "J'ai négocié le studio-toilettes à moitié prix. Je fais pipi et je dors au même endroit. Optimisation de l'espace, comme ils disent.", en: "I haggled the toilet-loft down to half price. I pee and sleep in the same spot. Space optimization, as they say." }, fx: { money: -300, happy: -3, moveOut: true } },
    ],
  },
  {
    id: 'yo_cockroaches',
    icon: '🪳',
    cat: 'home',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock', prop: 'roach' },
    when: { age: [18, 32], movedOut: true },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Tu allumes la cuisine à 2 h du matin. Une cinquantaine de cafards se figent, te regardent, puis se dispersent comme une foule après un concert. L'un d'eux emporte une de tes chips.", "Ce matin, tu as senti quelque chose bouger dans ta bouche au réveil. C'était un cafard. Il avait l'air aussi surpris que toi."],
      en: ['You flip on the kitchen light at 2 a.m. About fifty cockroaches freeze, stare at you, then scatter like a crowd after a concert. One of them is dragging away one of your chips.', 'This morning you felt something wriggling in your mouth when you woke up. It was a cockroach. It looked as surprised as you were.'],
    },
    choices: [
      {
        label: { fr: 'Bombe insecticide', en: 'Bug bomb the place' },
        out: [
          { w: 2, text: { fr: "Trois bombes, une nuit chez un pote. Au retour : des cadavres partout et un seul survivant, énorme, qui m'attendait sur l'oreiller. On s'est compris.", en: 'Three bug bombs, one night at a friend\'s. When I got back: corpses everywhere and one lone survivor, enormous, waiting on my pillow. We understood each other.' }, fx: { happy: -3, money: -40, stress: 4 } },
          { w: 1, text: { fr: "Quatre bombes insecticides, juste à côté de la gazinière allumée. Je n'avais pas lu « inflammable ». BOUM. Les cafards ont survécu. Mes sourcils et ma dignité, non.", en: "Four bug bombs, right next to the lit stove. I didn't read the word 'flammable'. BOOM. The roaches survived. My eyebrows and dignity did not." }, fx: { health: -10, money: -400, disease: 'burns', visual: 'explosion' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Leur donner des noms', en: 'Name them all' }, text: { fr: "Je les ai baptisés. Jean-Michel, Brenda, Kévin… J'en suis à 312. Brenda a eu des petits. Je suis grand-{père|mère}, en quelque sorte.", en: "I named them. Brian, Brenda, Kevin… I'm up to 312. Brenda had babies. I'm a grandparent, sort of." }, fx: { happy: 2, smarts: -3, stress: 3, health: -2 } },
      { label: { fr: 'Appeler le proprio', en: 'Call the landlord' }, text: { fr: "Le proprio m'a dit : « Des cafards ? Ce sont des locataires comme vous. » Puis il a raccroché. J'ai hurlé dans un coussin. Un cafard en est sorti.", en: "The landlord said: 'Cockroaches? They're tenants, just like you.' Then he hung up. I screamed into a pillow. A cockroach came out of it." }, fx: { stress: 6, happy: -4 }, mood: 'angry' },
    ],
  },
  {
    id: 'yo_loud_neighbours',
    icon: '🛏️',
    cat: 'home',
    rating: 2,
    scene: { place: 'apartment', mood: 'sleepy', prop: 'ceiling' },
    when: { age: [18, 32], movedOut: true },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Tes voisins du dessus ont une vie sexuelle d'athlètes olympiques. Le lustre tremble, le plafond craque, et à 3 h du matin quelqu'un hurle « OUI, GÉRARD, OUI ! » pour la quatrième fois de la nuit.", "Depuis une semaine, la tête de lit des voisins cogne contre ton mur à 128 BPM pile, avec des cris en rythme. Tu as commencé à mixer dessus."],
      en: ["Your upstairs neighbors have the sex life of Olympic athletes. The light fixture shakes, the ceiling creaks, and at 3 a.m. someone screams 'YES, GERALD, YES!' for the fourth time tonight.", "For a week, the neighbors' headboard has been banging on your wall at exactly 128 BPM, with screams on the beat. You've started DJing over it."],
    },
    choices: [
      {
        label: { fr: 'Taper au plafond', en: 'Bang on the ceiling' },
        out: [
          { w: 1, text: { fr: "J'ai tapé au plafond avec un balai. Ils ont pris ça pour des encouragements. Ça a duré deux heures de plus, avec rappel.", en: 'I banged the ceiling with a broom. They took it as encouragement. It lasted two more hours, with an encore.' }, fx: { stress: 6, happy: -4 }, mood: 'angry' },
          { w: 1, text: { fr: "Silence. Puis on a frappé à ma porte : Gérard, 74 ans, en peignoir ouvert, m'a présenté ses excuses et un pot de confiture. Sa femme m'a fait un clin d'œil. Je ne regarderai plus jamais la confiture pareil.", en: "Silence. Then a knock: Gerald, 74, in a loosely tied bathrobe, offered his apologies and a jar of jam. His wife winked at me. I will never look at jam the same way." }, fx: { happy: 3, stress: -2 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Glisser des notes', en: 'Slip them score cards' }, text: { fr: "J'ai glissé sous leur porte des cartons de notes façon jury de patinage : 9,5 – 9,8 – 10. Le lendemain, un mot : « Merci ! Ce soir on vise le 10 partout. » Ils l'ont eu.", en: "I slid figure-skating-style score cards under their door: 9.5 – 9.8 – 10. Next day, a note: 'Thanks! Going for straight tens tonight.' They got them." }, fx: { happy: 5, stress: 3 }, mood: 'happy' },
      { label: { fr: 'Riposter en musique', en: 'Retaliate with music' }, text: { fr: "J'ai passé « Hakuna Matata » à fond à chaque séance. Toute la résidence associe désormais Le Roi Lion à Gérard. Moi le premier. Mon enfance est morte.", en: "I blasted 'Hakuna Matata' every single session. The whole building now associates The Lion King with Gerald. Me first. My childhood is dead." }, fx: { stress: -2, happy: 4, karma: -2 } },
    ],
  },
  {
    id: 'yo_first_cooking',
    icon: '🍗',
    cat: 'home',
    rating: 2,
    scene: { place: 'apartment', mood: 'sick', prop: 'pot', fx: 'poop' },
    when: { age: [18, 30], movedOut: true },
    weight: 8,
    once: true,
    text: {
      fr: ["Premier dîner chez toi ! Six amis invités et la recette la plus ambitieuse de YouTube : poulet farci aux fruits de mer et à la crème. Le poulet est rose. Très rose. Il a l'air vivant.", "Tu cuisines pour la première fois pour des invités : lasagnes maison. Tu as laissé la viande hachée dehors deux jours « pour qu'elle se détende ». Elle sent le fromage. Il n'y a pas encore de fromage."],
      en: ['Your first dinner party! Six friends invited and the most ambitious recipe on YouTube: chicken stuffed with seafood and cream. The chicken is pink. Very pink. It looks alive.', "First time cooking for guests: homemade lasagna. You left the ground beef out for two days 'to let it relax'. It smells like cheese. There is no cheese in it yet."],
    },
    choices: [
      {
        label: { fr: 'Servir avec aplomb', en: 'Serve with confidence' },
        out: [
          { w: 2, text: { fr: "À 23 h, sept personnes se battaient pour une seule salle de bain. Il y avait de la diarrhée au plafond. Je n'ai jamais compris comment. Plus personne ne vient dîner chez moi.", en: "By 11 p.m., seven people were fighting over one bathroom. There was diarrhea on the ceiling. I never figured out how. Nobody comes to dinner anymore." }, fx: { health: -8, happy: -8, disease: 'food_poisoning', visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: "Miracle : mes amis n'ont rien eu. Moi si. Seul{|e} aux toilettes de 22 h à 6 h, à négocier avec mes intestins pendant qu'ils dansaient à côté.", en: 'Miracle: my friends were fine. I was not. Alone on the toilet from 10 p.m. to 6 a.m., negotiating with my intestines while they danced next door.' }, fx: { health: -6, disease: 'food_poisoning', visual: 'poop' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Commander en douce', en: 'Secretly order pizza' }, text: { fr: "J'ai commandé des pizzas et je les ai servies dans mes plats en jurant que c'était fait maison. Tout le monde a voulu la recette. « Secret de famille. »", en: "I ordered pizza and served it in my own dishes, swearing it was homemade. Everyone wanted the recipe. 'Family secret.'" }, fx: { money: -80, happy: 6, karma: -2 } },
      { label: { fr: 'Tout jeter et avouer', en: 'Bin it and confess' }, text: { fr: "J'ai tout jeté et avoué. On a mangé des chips et des saucisses froides par terre. Meilleur dîner de ma vie.", en: 'I threw it all out and confessed. We ate chips and cold hot dogs on the floor. Best dinner of my life.' }, fx: { happy: 5, smarts: 2 }, mood: 'happy' },
    ],
  },
  {
    id: 'yo_washing_flood',
    icon: '🫧',
    cat: 'home',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'washer' },
    when: { age: [18, 32], movedOut: true },
    vars: { amount: [300, 1500] },
    weight: 7,
    cooldown: 6,
    text: {
      fr: ["Ta machine à laver vient de rendre l'âme en plein essorage. Elle a traversé la salle de bain en sautillant, arraché son tuyau, et l'eau coule chez la voisine du dessous. La voisine qui a 14 chats.", "Tu rentres : 5 cm d'eau mousseuse dans l'appart. La machine a fui toute la journée. En bas, quelqu'un tambourine à ta porte en hurlant un truc sur son plafond, bordel de merde."],
      en: ["Your washing machine just died mid-spin. It hopped across the bathroom, ripped out its hose, and water is pouring into the downstairs neighbor's place. The neighbor with 14 cats.", "You come home to two inches of soapy water. The washer leaked all day. Downstairs, someone is pounding on your door screaming about their goddamn ceiling."],
    },
    choices: [
      { label: { fr: "Appeler l'assurance", en: 'Call the insurance' }, text: { fr: "Quatorze formulaires, trois experts et neuf mois plus tard, l'assurance m'a remboursé une somme qui couvre à peine un paquet de lessive. La voisine m'appelle « l'Inondation ».", en: "Fourteen forms, three adjusters and nine months later, the insurance paid me roughly the price of a box of detergent. The neighbor calls me 'The Flood'." }, fx: { stress: 10, money: -200, happy: -4 } },
      {
        label: { fr: 'Amadouer la voisine', en: 'Charm the neighbor' },
        out: [
          { w: 1, text: { fr: "J'ai apporté des croquettes de luxe pour ses 14 chats. Elle m'a pardonné et servi du thé. Je suis reparti{|e} avec un chaton et une dette morale.", en: 'I brought luxury cat food for all 14 cats. She forgave me and made tea. I left with a kitten and a moral debt.' }, fx: { happy: 4, karma: 3, newNpc: { role: 'pet', species: 'cat', age: [0, 1], abs: true } }, mood: 'love' },
          { w: 1, text: { fr: "Elle m'a envoyé une facture de {$amount} pour « préjudice moral félin ». Les chats avaient l'air ravis.", en: "She sent me a {$amount} bill for 'feline emotional damages'. The cats looked delighted." }, fx: { money: '-amount', stress: 5 } },
        ],
      },
      { label: { fr: "Faire le mort", en: 'Pretend not to be home' }, text: { fr: "J'ai éteint la lumière et je suis resté{|e} allongé{|e} dans l'eau, en silence, pendant qu'elle tambourinait. Le syndic m'a retrouvé{|e} quand même. Il a des clés.", en: "I turned off the lights and lay silently in the water while she pounded on the door. The building manager found me anyway. He has keys." }, fx: { stress: 6, money: -500, health: -2 }, mood: 'sad' },
    ],
  },
  {
    id: 'yo_auto_fridge',
    icon: '🧊',
    cat: 'home',
    auto: true,
    scene: { place: 'apartment', mood: 'neutral' },
    when: { age: [18, 32], movedOut: true },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["Inventaire de mon frigo : un pot de moutarde, un demi-citron et une bière laissée par l'ancien locataire. J'ai fait un dîner « tapas ».", "J'ai reçu ma première facture d'électricité et compris pourquoi mes parents éteignaient toujours la lumière en hurlant."],
      en: ["My fridge inventory: one jar of mustard, half a lemon and a beer left by the previous tenant. I made a 'tapas' dinner.", 'I got my first electricity bill and finally understood why my parents always screamed while turning off the lights.'],
    },
    fx: { happy: -1 },
  },
  {
    id: 'yo_moving_day',
    icon: '📦',
    cat: 'home',
    scene: { place: 'apartment', mood: 'sleepy', prop: 'boxes' },
    when: { age: [18, 30], movedOut: true },
    weight: 6,
    once: true,
    text: {
      fr: ["Jour de déménagement. Douze amis avaient promis de venir. Il y en a deux : l'un a mal au dos, l'autre a apporté sa guitare. Ton canapé ne passe pas dans l'escalier.", "Déménagement au sixième sans ascenseur. Le camion loué est trop petit, il pleut, et ton frigo vient de t'échapper au quatrième."],
      en: ["Moving day. Twelve friends promised to help. Two showed up: one has a bad back, the other brought his guitar. Your couch won't fit up the stairs.", 'Moving into a sixth-floor walk-up. The rental van is too small, it\'s raining, and your fridge just slipped out of your hands on the fourth floor.'],
    },
    choices: [
      { label: { fr: 'Promettre des pizzas', en: 'Bribe with pizza' }, text: { fr: "J'ai promis des pizzas. Neuf amis sont apparus par magie, ont porté trois cartons et mangé onze pizzas.", en: 'I promised pizza. Nine friends magically appeared, carried three boxes and ate eleven pizzas.' }, fx: { money: -120, happy: 5 } },
      { label: { fr: 'Scier le canapé', en: 'Saw the couch in half' }, text: { fr: "J'ai scié le canapé en deux pour le faire passer. J'ai maintenant deux fauteuils très tristes.", en: 'I sawed the couch in half to get it through. I now own two very sad armchairs.' }, fx: { happy: 2, money: -50 } },
      { label: { fr: 'Tout porter seul', en: 'Carry everything myself' }, text: { fr: "J'ai tout monté seul{|e}. Je me suis découvert des muscles et une hernie.", en: 'I carried it all up myself. I discovered new muscles and a hernia.' }, fx: { athletic: 4, disease: 'back_pain' }, mood: 'proud' },
    ],
  },
  {
    id: 'yo_parents_visit',
    icon: '🥧',
    cat: 'home',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'pie' },
    when: { age: [18, 32], movedOut: true },
    actor: 'parent',
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Coup de sonnette. C'est {a.rel}, venu{a:|e} « faire une surprise » avec une tarte. Chez toi : 14 bouteilles vides, une pyramide de cartons de pizza, du linge sur le lustre et un truc pas très légal dans un bocal à cornichons.", "{a.rel} débarque pour voir « comment tu vis ». Tu as 40 secondes pour cacher les preuves de ta vie d'adulte : le cendrier, les menottes en fourrure rose et la vaisselle de la Toussaint."],
      en: ["Doorbell. It's {a.rel}, here to 'surprise you' with a pie. Your place: 14 empty bottles, a pizza box pyramid, laundry on the light fixture and something not entirely legal in a pickle jar.", "{a.rel} drops by to see 'how you live'. You have 40 seconds to hide the evidence of adulthood: the ashtray, the pink fluffy handcuffs and the dishes from last month."],
    },
    choices: [
      {
        label: { fr: 'Tout dans la douche', en: 'Shove it all in the shower' },
        out: [
          { w: 1, text: { fr: "Tout dans la douche, rideau tiré, mais {a.my} a voulu se laver les mains. Le rideau est tombé. Les menottes aussi. Nous avons eu une conversation de trois heures.", en: 'Everything in the shower, curtain closed, but {a.my} wanted to wash up. The curtain fell. So did the handcuffs. We had a three-hour conversation.' }, fx: { rel: -10, stress: 8 }, mood: 'shock' },
          { w: 1, text: { fr: "Tout dans la douche, sourire crispé : {a.my} n'a rien vu et m'a félicité{|e} pour « ce petit nid si propre ». Je suis un génie du crime.", en: "Everything in the shower, tight smile, and {a.my} saw nothing and praised my 'tidy little nest'. I am a criminal mastermind." }, fx: { rel: 8, happy: 5 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Accuser un coloc', en: 'Blame a roommate' }, text: { fr: "J'ai tout mis sur le dos d'un coloc imaginaire nommé Kevin, et {a.my} veut maintenant « parler à Kevin ». Kevin n'existe pas, mais il a désormais un compte Facebook.", en: "I blamed everything on an imaginary roommate named Kevin, and now {a.my} wants to 'have a word with Kevin'. Kevin doesn't exist, but he now has a Facebook account." }, fx: { rel: 2, karma: -3, stress: 4 } },
      { label: { fr: 'Assumer', en: 'Own it' }, text: { fr: "J'ai ouvert les bras en disant « Bienvenue chez moi », et {a.my} a posé la tarte, fait le ménage quatre heures en soupirant et m'a laissé{|e} un Tupperware de lasagnes. Aucun regret.", en: "I spread my arms and said 'Welcome home', and {a.my} set the pie down, cleaned for four hours while sighing, and left me a Tupperware of lasagna. No regrets." }, fx: { rel: 4, happy: 6 }, mood: 'happy' },
    ],
  },
  {
    id: 'yo_house_party',
    icon: '🎊',
    cat: 'party',
    rating: 2,
    scene: { place: 'apartment', mood: 'party', prop: 'cups', fx: 'confetti' },
    when: { age: [18, 30], movedOut: true },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["Tu organises une « petite soirée, dix personnes max ». À minuit, il y a 70 inconnus, un DJ que personne n'a invité, et un type qui nage tout habillé dans ta baignoire avec une dinde surgelée.", "Lendemain de soirée chez toi. Bilan : ton canapé est mouillé (ce n'est pas de l'eau), quelqu'un a chié dans ta douche, et un inconnu dort dans ton placard, dans ton peignoir."],
      en: ["You throw a 'small get-together, ten people max'. By midnight there are 70 strangers, a DJ nobody invited, and a guy swimming fully clothed in your bathtub with a frozen turkey.", "Morning after your party. Damage report: your couch is wet (not water), somebody took a dump in your shower, and a stranger is asleep in your closet, wearing your bathrobe."],
    },
    choices: [
      {
        label: { fr: 'Tout le monde dehors', en: 'Everybody out' },
        out: [
          { w: 1, text: { fr: "J'ai coupé la musique et hurlé « LA POLICE ! ». Tout le monde a fui en 30 secondes, y compris deux vrais flics en civil venus pour le buffet.", en: "I killed the music and yelled 'COPS!'. Everyone fled in 30 seconds, including two actual plainclothes cops who'd come for the buffet." }, fx: { happy: 3, karma: 1 } },
          { w: 1, text: { fr: "J'ai voulu mettre tout le monde dehors. C'est le DJ qui m'a mis dehors, moi. J'ai dormi sur mon propre paillasson.", en: 'I tried to kick everyone out. The DJ kicked me out instead. I slept on my own doormat.' }, fx: { happy: -6, stress: 6 }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Rejoindre le chaos', en: 'Join the chaos' }, text: { fr: "J'ai fait du body-surf sur mes propres meubles jusqu'à l'aube. Bilan : dégâts monstres, plainte des voisins, et des confettis qui vivront dans mes chaussettes pour l'éternité.", en: 'I crowd-surfed on my own furniture until dawn. Total: monstrous damage, a noise complaint, and confetti that will live in my socks for eternity.' }, fx: { money: -1800, happy: 10, visual: 'confetti' }, mood: 'party' },
      { label: { fr: 'Nettoyer la douche', en: 'Clean the shower' }, text: { fr: "J'ai nettoyé la douche avec des gants, un masque et une volonté de fer. Il y avait du maïs. Je n'avais pas servi de maïs. Une semaine de cauchemars.", en: "I cleaned the shower with gloves, a mask and an iron will. There was corn in it. I hadn't served corn. A week of nightmares." }, fx: { happy: -8, stress: 5, karma: 3, visual: 'poop' }, mood: 'sick' },
    ],
  },

  // ───────────────────────────── adulting ─────────────────────────────
  {
    id: 'yo_bureaucracy',
    icon: '🗂️',
    cat: 'adulting',
    scene: { place: 'office', mood: 'sleepy', prop: 'ticket' },
    when: { age: [18, 32] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Pour obtenir ton attestation de résidence, il te faut un justificatif de domicile. Pour le justificatif, il te faut l'attestation. La dame du guichet mange un sandwich en te regardant.", "Quatre heures de queue à la préfecture. Ton ticket : 847. L'écran affiche : 12. Un pigeon dans la salle d'attente a l'air d'attendre aussi."],
      en: ['To get your proof of residence, you need a utility bill. To get the utility bill, you need proof of residence. The clerk eats a sandwich while staring at you.', 'Four hours in line at the DMV. Your ticket: 847. The screen says: 12. A pigeon in the waiting room seems to be waiting too.'],
    },
    choices: [
      {
        label: { fr: 'Rester poli', en: 'Stay polite' },
        out: [
          { w: 1, text: { fr: "Six heures de sourire. La dame m'a dit « revenez demain avec le formulaire B-27 ». Le formulaire B-27 n'existe pas.", en: "Six hours of smiling. The clerk said 'come back tomorrow with form B-27'. Form B-27 does not exist." }, fx: { stress: 8, happy: -4, karma: 2 } },
          { w: 1, text: { fr: "Mon sourire l'a fait fondre. Elle m'a fait passer devant tout le monde et ajouté un tampon « pour le plaisir ». Elle s'appelle Josiane. Je l'aime.", en: "My smile melted her heart. She bumped me to the front and added an extra stamp 'just for fun'. Her name is Barbara. I love her." }, fx: { happy: 6, karma: 2 }, mood: 'love' },
        ],
      },
      { label: { fr: 'Craquer', en: 'Lose it' }, text: { fr: "J'ai craqué. La sécurité m'a raccompagné{|e} dehors. Le pigeon, lui, a eu son rendez-vous.", en: 'I snapped. Security escorted me out. The pigeon got its appointment.' }, fx: { stress: -3, happy: -5 }, mood: 'angry' },
      { label: { fr: 'Tenter en ligne', en: 'Try the website' }, text: { fr: "Le site plantait à chaque étape et me demandait d'identifier des feux tricolores. J'en vois dans mes rêves.", en: 'The website crashed at every step and kept asking me to identify traffic lights. I see them in my dreams.' }, fx: { stress: 6, smarts: 1 } },
    ],
  },
  {
    id: 'yo_taxes_first',
    icon: '🧾',
    cat: 'adulting',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'forms' },
    when: { age: [19, 30] },
    vars: { amount: [100, 800] },
    weight: 7,
    once: true,
    text: {
      fr: ["Ta première déclaration d'impôts. 47 cases, des mots comme « quotient familial » et « revenus fonciers », et une petite voix intérieure qui dit « coche au pif, putain ».", "Le fisc t'écrit : il est temps de déclarer. Le formulaire demande si tu as des « personnes à charge ». Ton chat te fixe avec insistance."],
      en: ["Your first tax return. 47 boxes, words like 'dependent exemption' and 'adjusted gross income', and a little inner voice saying 'just tick random shit'.", "The tax office writes: time to file. The form asks if you have any 'dependents'. Your cat stares at you meaningfully."],
    },
    choices: [
      {
        label: { fr: 'Déclarer le chat', en: 'Claim the cat' },
        out: [
          { w: 1, text: { fr: "J'ai déclaré mon chat à charge. Deux ans plus tard, un contrôleur est venu vérifier que « Monsieur Moustache » était bien scolarisé. Redressement et amende.", en: "I claimed my cat as a dependent. Two years later an auditor came to check that 'Mr. Whiskers' was enrolled in school. Back taxes and a fine." }, fx: { money: -600, stress: 8, heat: 3 }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai déclaré mon chat. Le logiciel a validé. Bug ou reconnaissance officielle, je ne sais pas. Monsieur Moustache est fier.", en: "I claimed my cat. The software accepted it. Glitch or official recognition, I'll never know. Mr. Whiskers is proud." }, fx: { money: 300, karma: -3 } },
        ],
      },
      { label: { fr: 'Appeler les parents', en: 'Call my parents' }, text: { fr: "Mon père a mis trois heures à trouver ses lunettes, puis on a rempli la déclaration ensemble en s'engueulant. J'ai appris des jurons que je ne connaissais pas.", en: 'My dad took three hours to find his glasses, then we filled it out together while yelling. I learned curse words I never knew existed.' }, fx: { stress: 3, happy: 2, smarts: 2 } },
      {
        label: { fr: 'Cocher au pif', en: 'Wing it' },
        out: [
          { w: 1, text: { fr: "Coché au hasard. Le fisc me rembourse {$amount}. Je n'ai rien compris et je ne pose aucune question.", en: "Random boxes. The tax office is refunding me {$amount}. I understand nothing and ask no questions." }, fx: { money: 'amount', happy: 5 } },
          { w: 1, text: { fr: "Majoration de {$amount} et une lettre d'une froideur polaire. Même l'enveloppe avait l'air déçue.", en: 'A {$amount} penalty and an ice-cold letter. Even the envelope looked disappointed.' }, fx: { money: '-amount', stress: 8 } },
        ],
      },
    ],
  },
  {
    id: 'yo_auto_adulting',
    icon: '🥚',
    cat: 'adulting',
    auto: true,
    scene: { place: 'apartment', mood: 'proud' },
    when: { age: [18, 28] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["J'ai appelé ma mère pour savoir combien de temps cuire un œuf dur. Elle a ri deux minutes avant de répondre. Pendant ce temps, l'œuf a explosé.", "J'ai pris mon premier rendez-vous médical tout{|e} seul{|e}, par téléphone. J'ai transpiré, bégayé et répondu « vous aussi » à « au revoir ». Une victoire.", "J'ai fait ma première machine tout{|e} seul{|e}. J'ai mis {w:object} avec le blanc. Tout est rose maintenant, même mes certitudes.", "J'ai rempli ma première déclaration d'impôts. J'ai coché une case au hasard. Le fisc m'a renvoyé un courrier qui commence par « {w:exclaim} ».", "Pour mon premier vrai dîner d'adulte, j'ai invité des amis et servi {w:food}. Tout le monde a été très poli. Quelqu'un a commandé une pizza en cachette."],
      en: ["I called my mom to ask how long to boil an egg. She laughed for two minutes before answering. Meanwhile, the egg exploded.", "I booked my first doctor's appointment by myself, by phone. I sweated, stuttered and replied 'you too' to 'goodbye'. A victory.", "I did my first load of laundry by myself. I put {w:object} in with the whites. Everything's pink now, even my convictions.", "I filed my first tax return. I ticked a random box. The tax office sent back a letter that begins with '{w:exclaim}'.", "For my first real grown-up dinner party, I invited friends and served {w:food}. Everyone was very polite. Someone secretly ordered pizza."],
    },
    fx: { happy: 2, smarts: 1 },
  },
  {
    id: 'yo_quarter_life',
    icon: '🌀',
    cat: 'adulting',
    rating: 1,
    scene: { place: 'apartment', mood: 'sad', prop: 'ceiling' },
    when: { age: [24, 30] },
    weight: 8,
    once: true,
    text: {
      fr: ["Tu as {age} ans et tu viens de réaliser que des gens nés après toi votent, conduisent et ont des enfants. Ça fait trois heures que tu fixes ton plafond en te demandant si la vie, c'est juste payer un loyer et aimer les plaids.", "Crise du quart de vie : sur Instagram, un ancien du lycée achète une maison, un autre court un ultra-trail en Himalaya, et toi tu t'es réjoui{|e} ce matin d'une promo sur le papier toilette."],
      en: ["You're {age} and just realized that people born after you vote, drive and have kids. You've been staring at the ceiling for three hours wondering if life is just paying rent and loving blankets.", "Quarter-life crisis: on Instagram, one high school classmate just bought a house, another is running an ultramarathon in the Himalayas, and this morning you got excited about a toilet paper sale."],
    },
    choices: [
      {
        label: { fr: 'Tout plaquer', en: 'Drop everything' },
        out: [
          { w: 1, text: { fr: "J'ai tout plaqué pour élever des chèvres à la campagne. Au bout de trois semaines, une chèvre a mangé mon téléphone et mes illusions. Je suis rentré{|e}.", en: 'I dropped everything to raise goats in the countryside. Three weeks in, a goat ate my phone and my illusions. I came back.' }, fx: { happy: 4, money: -800, stress: -6 } },
          { w: 1, text: { fr: "Je suis parti{|e} devenir prof de yoga sous les tropiques. J'ai donné un seul cours, à un chien. Mais quel bronzage.", en: 'I left to become a yoga teacher in the tropics. I taught exactly one class, to a dog. But what a tan.' }, fx: { money: -1500, looks: 3, happy: 6 } },
        ],
      },
      { label: { fr: 'Commencer une thérapie', en: 'Start therapy' }, text: { fr: "La psy m'a demandé de parler de ma mère. J'ai parlé de ma mère 45 minutes. Puis de mon père. Puis du chat. Je vais mieux, et je suis fauché{|e}.", en: 'The therapist asked me to talk about my mother. I talked about my mother for 45 minutes. Then my father. Then the cat. I feel better, and I am broke.' }, fx: { money: -400, stress: -10, happy: 6 } },
      { label: { fr: 'Acheter une moto', en: 'Buy a motorcycle' }, text: { fr: "J'ai acheté une moto pour me sentir vivant{|e}. Je me suis senti{|e} très vivant{|e} en tombant devant un arrêt de bus bondé. La moto dort au garage. Mon ego, à l'hôpital.", en: "I bought a motorcycle to feel alive. I felt extremely alive falling over in front of a packed bus stop. The bike sleeps in the garage. My ego is in the hospital." }, fx: { money: -3000, happy: 2, disease: 'sprain' } },
      { label: { fr: 'Ouvrir une bouteille', en: 'Uncork a bottle' }, text: { fr: "J'ai ouvert une bouteille de vin et créé une playlist intitulée « {age} ans et déjà fini{|e} ». Elle dure neuf heures. Je l'ai écoutée en entier.", en: "I opened a bottle of wine and made a playlist called '{age} and already washed up'. It's nine hours long. I listened to all of it." }, fx: { addiction: ['alcohol', 6], happy: 2, stress: -3 }, mood: 'cry' },
    ],
  },
  {
    id: 'yo_comparison',
    icon: '🛥️',
    cat: 'adulting',
    scene: { place: 'apartment', mood: 'sad', prop: 'phone' },
    when: { age: [22, 32] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: ["Le gamin qui mangeait de la colle en CE1 est devenu millionnaire grâce à une appli de livraison de croquettes. Il poste son yacht avec la légende « Never give up ».", "Une ancienne camarade de classe vient d'être classée dans les « 30 under 30 » d'un magazine. Ta réussite de la semaine : avoir rendu un livre à la bibliothèque à l'heure."],
      en: ["The kid who ate glue in second grade became a millionaire with a pet food delivery app. He just posted his yacht with the caption 'Never give up'.", "A former classmate just made a magazine's '30 under 30' list. Your big win this week: returning a library book on time."],
    },
    choices: [
      { label: { fr: 'Liker et pleurer', en: 'Like it and cry' }, text: { fr: "J'ai liké, commenté « trop fier de toi », puis pleuré sous la douche. Un classique.", en: "I liked it, commented 'so proud of you', then cried in the shower. A classic." }, fx: { happy: -5, stress: 3 }, mood: 'cry' },
      {
        label: { fr: 'Demander un job', en: 'Ask for a job' },
        out: [
          { w: 1, text: { fr: "Je lui ai écrit. Il m'a nommé{|e} « Chief Happiness Officer » de sa start-up. Elle a fait faillite un mois plus tard. J'ai gardé le sweat.", en: "I messaged him. He made me 'Chief Happiness Officer' at his startup. It went bankrupt a month later. I kept the hoodie." }, fx: { happy: 3, money: 500 } },
          { w: 1, text: { fr: "Je lui ai écrit. Il m'a envoyé le lien de sa formation en ligne « Deviens millionnaire » à 997.", en: "I messaged him. He sent me a link to his online course, 'Become a Millionaire', for 997." }, fx: { happy: -3, smarts: 1 } },
        ],
      },
      { label: { fr: 'Supprimer Instagram', en: 'Delete Instagram' }, text: { fr: "J'ai supprimé l'appli. Pendant deux jours, je me suis senti{|e} libre et supérieur{|e}. Puis je l'ai réinstallée pour « vérifier un truc ».", en: "I deleted the app. For two days I felt free and superior. Then I reinstalled it to 'check something'." }, fx: { happy: 3, discipline: 2 } },
    ],
  },
  {
    id: 'yo_wisdom_teeth',
    icon: '🦷',
    cat: 'adulting',
    rating: 1,
    scene: { place: 'hospital', mood: 'sleepy', prop: 'gauze' },
    when: { age: [18, 26] },
    weight: 6,
    once: true,
    text: {
      fr: ["Tu sors de chez le dentiste sans tes quatre dents de sagesse, les joues d'un hamster et la tête pleine d'anesthésiants. Ton pote te filme dans la voiture.", "Encore sous sédatifs après l'arrachage de tes dents de sagesse, tu viens de demander l'assistante dentaire en mariage. Puis la plante verte."],
      en: ["You leave the dentist minus four wisdom teeth, with hamster cheeks and a head full of anesthetic. Your buddy is filming you in the car.", "Still sedated after your wisdom teeth removal, you just proposed to the dental assistant. Then to the potted plant."],
    },
    choices: [
      { label: { fr: 'Laisser filmer', en: 'Let them film' }, text: { fr: "Sur la vidéo, je pleure parce que « les nuages sont trop gentils » et je demande si je suis mort{|e}. Deux millions de vues. Une marque de glaces m'a contacté{|e}.", en: "In the video I'm sobbing because 'the clouds are too nice' and asking if I'm dead. Two million views. An ice cream brand reached out." }, fx: { followers: 20000, fame: 6, happy: 4 }, mood: 'happy' },
      { label: { fr: 'Supprimer la vidéo', en: 'Delete the footage' }, text: { fr: "J'ai supprimé la vidéo. Il en avait déjà fait quatorze copies. Il menace de la projeter à mon futur mariage.", en: "I deleted the video. He'd already made fourteen copies. He's threatening to play it at my future wedding." }, fx: { happy: -2, stress: 3 } },
      { label: { fr: 'Purée pendant un mois', en: 'Mashed potatoes only' }, text: { fr: "Trois semaines de purée. J'ai perdu quatre kilos et le goût de vivre.", en: 'Three weeks of mashed potatoes. I lost eight pounds and the will to live.' }, fx: { weight: -0.03, happy: -3, looks: 1 } },
    ],
  },

  // ───────────────────────────── fêtes, festivals, nuits ─────────────────────────────
  {
    id: 'yo_festival_drugs',
    icon: '🎪',
    cat: 'party',
    rating: 2,
    scene: { place: 'park', mood: 'party', prop: 'stage' },
    when: { age: [18, 30] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["Festival de musique, jour 3. Il a plu, tu as perdu une chaussure dans la boue, et un type torse nu peint en vert, qui se présente comme « Dédé le Druide », te tend une gélule « faite maison avec amour ».", "4 h du matin sous le chapiteau techno. Tes potes ont disparu, ton pied nu baigne dans une substance non identifiée, et quelqu'un te propose « un petit bonbon pour tenir jusqu'au lever du soleil »."],
      en: ["Music festival, day 3. It rained, you lost a shoe in the mud, and a shirtless guy painted green who calls himself 'Dave the Druid' offers you a capsule 'homemade with love'.", "4 a.m. under the techno tent. Your friends have vanished, your bare foot is soaking in an unidentified substance, and someone offers you 'a little candy to last till sunrise'."],
    },
    choices: [
      {
        label: { fr: 'Gober la gélule', en: 'Take the capsule' },
        out: [
          { w: 2, text: { fr: "J'ai dansé 14 heures d'affilée. J'ai fait des câlins à des inconnus, à un arbre et à une enceinte. Le lendemain, je n'avais plus de mâchoire, juste un sourire coincé.", en: "I danced for 14 hours straight. I hugged strangers, a tree and a speaker. The next day I no longer had a jaw, just a stuck smile." }, fx: { happy: 12, health: -8, addiction: ['drugs', 12] }, mood: 'party' },
          { w: 1, text: { fr: "La gélule m'a convaincu{|e} que les toilettes sèches étaient un portail vers une autre dimension. J'y suis entré{|e}. Tête la première. J'en suis ressorti{|e} couvert{|e} de choses que l'humanité ne devrait jamais toucher. Les gens applaudissaient.", en: 'The capsule convinced me the festival porta-potty was a portal to another dimension. I went in. Head first. I came out covered in things humanity should never touch. People applauded.' }, fx: { health: -10, happy: -6, addiction: ['drugs', 10], disease: 'gastro', visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: "Mauvais trip. Six heures à la tente de secours à expliquer à une bénévole que mes orteils complotaient contre moi. Elle m'a tenu la main. C'est ma meilleure amie maintenant.", en: 'Bad trip. Six hours in the first aid tent explaining to a volunteer that my toes were plotting against me. She held my hand. She is my best friend now.' }, fx: { health: -6, stress: 8, addiction: ['drugs', 8] }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Rester à la bière', en: 'Stick to beer' }, text: { fr: "Je suis resté{|e} à la bière tiède hors de prix. J'en ai bu onze. Je me suis endormi{|e} debout devant la scène, comme un cheval.", en: 'I stuck to overpriced warm beer. I had eleven. I fell asleep standing up in front of the stage, like a horse.' }, fx: { money: -100, addiction: ['alcohol', 6], happy: 5 } },
      { label: { fr: 'Rentrer à la tente', en: 'Go back to my tent' }, text: { fr: "Ma tente était occupée par un couple inconnu, très, très occupé. J'ai dormi dans la voiture de quelqu'un d'autre. Avec son chien.", en: "My tent was occupied by a couple I didn't know, very, very busy. I slept in someone else's car. With their dog." }, fx: { happy: -3, stress: 3 } },
    ],
  },
  {
    id: 'yo_rave_lost',
    icon: '🐰',
    cat: 'party',
    rating: 2,
    scene: { place: 'party', mood: 'shock', prop: 'speakers' },
    when: { age: [18, 30] },
    weight: 6,
    cooldown: 4,
    text: {
      fr: ["Rave illégale dans un entrepôt désaffecté. Ton téléphone est mort, tes amis ont disparu, et tu ne sais plus si la sortie est derrière le mur d'enceintes ou derrière la fosse à mousse.", "Perdu{|e} dans une rave en pleine forêt. Il est 6 h, la musique ne s'arrête pas, et un homme déguisé en lapin te propose de « suivre le lapin blanc »."],
      en: ["Illegal rave in an abandoned warehouse. Your phone is dead, your friends are gone, and you can't tell if the exit is behind the speaker wall or the foam pit.", "Lost at a rave in the middle of a forest. It's 6 a.m., the music won't stop, and a man in a bunny costume invites you to 'follow the white rabbit'."],
    },
    choices: [
      {
        label: { fr: 'Suivre le lapin', en: 'Follow the rabbit' },
        out: [
          { w: 1, text: { fr: "J'ai suivi le lapin jusqu'à sa camionnette, où sa grand-mère m'a servi une soupe et appelé un taxi. Meilleur lapin du monde.", en: 'I followed the rabbit to his van, where his grandma served me soup and called me a cab. Best rabbit ever.' }, fx: { happy: 6, karma: 2 }, mood: 'happy' },
          { w: 1, text: { fr: "Le lapin a enlevé son costume. Dessous, il était nu, à part une banane accrochée à la taille. « Bienvenue dans la famille. » J'ai couru 4 km dans les bois, pieds nus, sans me retourner.", en: "The rabbit took off his costume. Underneath, he was naked except for a fanny pack. 'Welcome to the family.' I ran 4 km through the woods barefoot without looking back." }, fx: { athletic: 3, health: -4, stress: 6 }, mood: 'shock' },
        ],
      },
      { label: { fr: "Danser jusqu'au bout", en: 'Dance till the end' }, text: { fr: "J'ai dansé jusqu'à ce que les flics coupent le courant à 11 h. J'ai perdu une chaussure, mon portefeuille et ma dignité, mais gagné des mollets en acier.", en: 'I danced until the cops cut the power at 11 a.m. I lost a shoe, my wallet and my dignity, but gained steel calves.' }, fx: { health: -4, athletic: 4, money: -60, happy: 6, visual: 'police' }, mood: 'party' },
      { label: { fr: 'Dormir dans une enceinte', en: 'Nap in a speaker' }, text: { fr: "Je me suis endormi{|e} roulé{|e} en boule dans un caisson de basses. Réveil sourd{|e} d'une oreille, sur un camion, en route pour une autre rave à 300 km.", en: 'I fell asleep curled up inside a subwoofer. Woke up deaf in one ear, on a truck, headed to another rave 300 km away.' }, fx: { health: -6, happy: -2, stress: 4 } },
    ],
  },
  {
    id: 'yo_tattoo',
    icon: '🖋️',
    cat: 'party',
    rating: 1,
    scene: { place: 'studio', mood: 'party', prop: 'needle' },
    when: { age: [18, 30], noFlag: 'yo_tattoo_bad' },
    weight: 7,
    once: true,
    text: {
      fr: ["Il est 2 h du matin, tu as bu six mojitos, et un tatoueur au néon clignotant te propose « un petit souvenir » à moitié prix. Ses mains tremblent un peu. Il dit que c'est le froid.", "Après une soirée trop arrosée, tes potes te traînent dans un salon de tatouage ouvert 24 h/24. Le tatoueur s'appelle Snake et porte un « MAMAM » tatoué sur le front."],
      en: ["It's 2 a.m., you've had six mojitos, and a tattoo parlor with a flickering neon sign offers 'a little souvenir' at half price. The artist's hands are shaking a bit. He says it's the cold.", "After a boozy night, your friends drag you into a 24-hour tattoo parlor. The artist is called Snake and has 'MOHTER' tattooed on his forehead."],
    },
    choices: [
      { label: { fr: 'Le prénom de ma moitié', en: "My partner's name" }, if: { has: 'lover' }, text: { fr: "Je me suis fait tatouer le prénom de ma moitié sur le cœur. Snake a fait une faute. C'est maintenant le nom d'une marque de lessive.", en: "I got my partner's name tattooed over my heart. Snake misspelled it. It's now the name of a laundry detergent." }, fx: { happy: -2, looks: -2, flag: 'yo_tattoo_bad' } },
      { label: { fr: 'Un dauphin tribal', en: 'A tribal dolphin' }, text: { fr: "J'ai demandé un dauphin tribal. J'ai un dauphin tribal. Avec des yeux humains. Il me suit du regard dans le miroir.", en: 'I asked for a tribal dolphin. I have a tribal dolphin. With human eyes. It follows me in the mirror.' }, fx: { looks: -3, happy: 2, flag: 'yo_tattoo_bad' } },
      { label: { fr: 'Une phrase en elfique', en: 'A phrase in Elvish' }, text: { fr: "J'ai fait tatouer une phrase en elfique sur la fesse. D'après un forum de fans, elle signifie « Je suis une saucisse ». Le forum est formel.", en: "I got a phrase in Elvish tattooed on my butt. According to a fan forum, it means 'I am a sausage'. The forum is unanimous." }, fx: { happy: 1, looks: -1, flag: 'yo_tattoo_bad' } },
      { label: { fr: 'Repartir sans rien', en: 'Walk away' }, text: { fr: "Je suis reparti{|e} avec juste un kebab. Le lendemain, mon pote avait « NO REGERTS » sur le mollet. J'ai bien fait.", en: "I left with nothing but a kebab. The next day my buddy had 'NO REGERTS' on his calf. Good call." }, fx: { happy: 3, discipline: 3 } },
    ],
  },
  {
    id: 'yo_tattoo_removal',
    icon: '🔦',
    cat: 'party',
    rating: 1,
    scene: { place: 'hospital', mood: 'sad', prop: 'laser' },
    when: { age: [19, 35], flag: 'yo_tattoo_bad' },
    vars: { amount: [400, 2000] },
    weight: 8,
    once: true,
    text: {
      fr: ["Ton tatouage de soirée te nargue tous les matins dans le miroir. Un dermato peut l'effacer au laser : {$amount} et « une douleur comparable à de l'huile bouillante, mais en rythme ».", "Au mariage de ton cousin, quelqu'un a photographié ton tatouage raté. La photo tourne dans toute la famille, avec un commentaire de ta grand-mère : « Mon Dieu. »"],
      en: ["Your drunk tattoo taunts you in the mirror every morning. A dermatologist can laser it off: {$amount} and 'pain comparable to boiling oil, but rhythmic'.", "At your cousin's wedding someone photographed your botched tattoo. It's circulating through the whole family with a comment from your grandma: 'Dear God.'"],
    },
    choices: [
      { label: { fr: 'Laser', en: 'Laser it off' }, text: { fr: "Huit séances à {$amount} au total. J'ai hurlé à chaque fois. Il reste une vague tache qu'on prend pour une carte de la Belgique. Je dis que c'est voulu.", en: "Eight sessions, {$amount} total. I screamed every time. What's left is a faint smudge people mistake for a map of Belgium. I say it's intentional." }, fx: { money: '-amount', health: -2, happy: 4, unflag: 'yo_tattoo_bad' } },
      {
        label: { fr: 'Recouvrir', en: 'Cover it up' },
        out: [
          { w: 1, text: { fr: "J'ai fait recouvrir l'erreur par un énorme tigre. Le tigre est raté aussi. J'ai maintenant deux regrets superposés.", en: 'I had the mistake covered with a huge tiger. The tiger is botched too. I now have two layered regrets.' }, fx: { money: -300, looks: -2, happy: -3 } },
          { w: 1, text: { fr: "Recouvrement magnifique : une rose noire. Plus personne ne sait ce qu'il y avait dessous. Sauf moi. Et Snake.", en: 'Gorgeous cover-up: a black rose. Nobody knows what was underneath anymore. Except me. And Snake.' }, fx: { money: -300, looks: 3, happy: 6, unflag: 'yo_tattoo_bad' }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Assumer', en: 'Own it' }, text: { fr: "J'assume. Je dis que c'est une référence ironique. Personne ne comprend la référence, mais tout le monde hoche la tête.", en: "I own it. I say it's an ironic reference. Nobody gets the reference, but everyone nods." }, fx: { happy: 3, stress: -2 } },
    ],
  },
  {
    id: 'yo_wake_other_city',
    icon: '🦢',
    cat: 'party',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'cone' },
    when: { age: [18, 32] },
    vars: { amount: [200, 1500] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["Tu te réveilles sur un banc de gare routière à 600 km de chez toi, en peignoir d'hôtel, un cône de chantier sous le bras et un piercing au téton que tu ne te connaissais pas.", "Tu ouvres les yeux dans une baignoire d'hôtel, dans une ville où tu n'as jamais mis les pieds. À côté de toi : un cygne, très calme, et une note de room service de {$amount} à ton nom."],
      en: ["You wake up on a bus station bench 400 miles from home, wearing a hotel bathrobe, holding a traffic cone and sporting a nipple piercing you don't remember getting.", 'You open your eyes in a hotel bathtub, in a city you have never set foot in. Next to you: a swan, very calm, and a {$amount} room service bill in your name.'],
    },
    choices: [
      {
        label: { fr: 'Reconstituer la nuit', en: 'Retrace the night' },
        out: [
          { w: 1, text: { fr: "Mes stories ont tout raconté : karaoké, mariage d'inconnus, course-poursuite avec un vigile, et moi en train de lécher une statue en bronze. 40 000 vues. Ma mère a liké.", en: 'My stories told the whole tale: karaoke, crashing a stranger\'s wedding, a chase with a security guard, and me licking a bronze statue. 40,000 views. My mom liked it.' }, fx: { followers: 3000, fame: 3, happy: 2, stress: 6 }, mood: 'shock' },
          { w: 1, text: { fr: "Mon relevé bancaire a parlé : 14 shots, un bus de nuit et {$amount} dans une boutique de souvenirs. J'ai un T-shirt « J'aime cette ville » et aucun souvenir de la ville.", en: "My bank statement spilled it: 14 shots, a night bus and {$amount} at a souvenir shop. I own an 'I love this city' T-shirt and no memory of the city." }, fx: { money: '-amount', happy: -3 } },
        ],
      },
      { label: { fr: 'Rentrer en stop', en: 'Hitchhike home' }, text: { fr: "Stop en peignoir, cône sous le bras. Un routier m'a ramené{|e} en me racontant son divorce pendant six heures. J'ai gardé le cône. Il s'appelle Bernard.", en: 'Hitchhiking in a bathrobe, cone under my arm. A trucker drove me home while describing his divorce for six hours. I kept the cone. His name is Bernard.' }, fx: { happy: 3, karma: 1 } },
      { label: { fr: 'Appeler mes parents', en: 'Call my parents' }, text: { fr: "Ma mère a fait 600 km pour venir me chercher sans dire un mot. Le silence a duré tout le trajet et une partie de Noël.", en: "My mom drove 400 miles to pick me up without saying a word. The silence lasted the whole ride and part of Christmas." }, fx: { happy: -4, stress: 4 }, mood: 'sad' },
    ],
  },
  {
    id: 'yo_hangover_monster',
    icon: '🤮',
    cat: 'party',
    rating: 2,
    scene: { place: 'apartment', mood: 'sick', prop: 'bucket' },
    when: { age: [18, 32] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["Lendemain de cuite. Ta bouche a le goût d'un cendrier de bar-tabac, ta tête est un concert de djembé, et une traînée de vomi part de ton lit pour s'arrêter devant le frigo. Elle raconte une histoire.", "La pire gueule de bois de ta vie. Ton VTC t'a facturé des « frais de nettoyage — catégorie 3 », et tu as envoyé à 4 h du matin à ton ex un message vocal de neuf minutes qui commence par un rot."],
      en: ["The morning after. Your mouth tastes like a dive bar ashtray, your head is a djembe concert, and a trail of puke runs from your bed to the fridge. It tells a story.", "Worst hangover of your life. Your rideshare billed you a 'Category 3 cleaning fee', and at 4 a.m. you sent your ex a nine-minute voice note that starts with a burp."],
    },
    choices: [
      { label: { fr: 'Remède de grand-mère', en: "Grandma's remedy" }, text: { fr: "J'ai bu un mélange d'œuf cru, de Tabasco et de jus de cornichon. Je l'ai revomi en quatre secondes, mais avec élégance. Ça va mieux.", en: 'I drank raw egg, Tabasco and pickle juice. I threw it back up in four seconds, but elegantly. I feel better.' }, fx: { health: 2, happy: -2 } },
      { label: { fr: 'Soigner le mal par le mal', en: 'Hair of the dog' }, text: { fr: "Une bière au petit-déj. À midi, j'étais de nouveau bourré{|e}. Le cycle de la vie.", en: 'A beer for breakfast. By noon I was drunk again. The circle of life.' }, fx: { addiction: ['alcohol', 10], happy: 4, health: -4 }, mood: 'party' },
      { label: { fr: 'Mourir sous la couette', en: 'Die under the duvet' }, text: { fr: "Journée entière en position fœtale à promettre à Dieu de ne plus jamais boire. Dieu a ri. Puis il a rigolé encore en voyant mon historique d'appels.", en: 'A full day in the fetal position, promising God I would never drink again. God laughed. Then laughed harder at my call history.' }, fx: { health: -3, happy: -4 }, mood: 'sick' },
    ],
  },
  {
    id: 'yo_auto_hangover',
    icon: '🥴',
    cat: 'party',
    rating: 1,
    auto: true,
    scene: { place: 'apartment', mood: 'sleepy' },
    when: { age: [18, 32] },
    weight: 6,
    cooldown: 3,
    text: {
      fr: ["J'ai juré de ne plus jamais boire. Pour la 41e fois. C'était sincère, comme les 40 précédentes.", "Gueule de bois du dimanche : j'ai fixé le plafond six heures et mangé des chips sans lever la tête de l'oreiller. Une performance."],
      en: ["I swore I'd never drink again. For the 41st time. I meant it, just like the previous 40.", 'Sunday hangover: I stared at the ceiling for six hours and ate chips without lifting my head off the pillow. A performance.'],
    },
    fx: { health: -2, happy: -1 },
  },
  {
    id: 'yo_auto_kebab',
    icon: '🥙',
    cat: 'party',
    rating: 2,
    auto: true,
    scene: { place: 'apartment', mood: 'sick' },
    when: { age: [18, 32] },
    weight: 6,
    cooldown: 3,
    text: {
      fr: ["À 4 h du matin, j'ai commandé un kebab sauce samouraï-fromagère. Je me suis endormi{|e} dessus. Réveil avec une frite dans l'oreille et des oignons à un endroit qui ne voit jamais le soleil.", "J'ai vomi dans le sac de mon kebab, puis j'ai fini le kebab. Je ne sais plus qui je suis devenu{|e}."],
      en: ['At 4 a.m. I ordered a kebab with extra garlic-cheese sauce. I fell asleep on it. Woke up with a fry in my ear and onions in a place that never sees the sun.', "I threw up into my kebab bag, then finished the kebab. I don't know who I've become."],
    },
    fx: { health: -3, weight: 0.02, happy: 1 },
  },
  {
    id: 'yo_lover_parents_weekend',
    icon: '🛌',
    cat: 'love',
    rating: 2,
    scene: { place: 'home', mood: 'love', prop: 'bed' },
    when: { age: [18, 32], has: 'parent' },
    actor: 'lover',
    weight: 6,
    cooldown: 5,
    text: {
      fr: ["Week-end chez tes parents avec {a.first}. On vous a installés dans ta chambre d'ado : lit de 90 cm qui grince au moindre soupir, poster de boys band au mur, et la chambre de tes parents derrière une cloison en carton.", "Nuit chez tes parents avec {a.first}. Minuit. {a.first} te lance un regard lourd de sous-entendus. Le lit grince déjà quand tu respires. De l'autre côté du mur, ton père tousse."],
      en: ["Weekend at your parents' with {a.first}. You've been put in your childhood bedroom: a twin bed that squeaks at every sigh, a boy band poster on the wall, and your parents' room behind a cardboard wall.", "Night at your parents' place with {a.first}. Midnight. {a.first} gives you a very loaded look. The bed squeaks when you breathe. On the other side of the wall, your dad coughs."],
    },
    choices: [
      {
        label: { fr: 'Tenter la discrétion', en: 'Attempt discretion' },
        out: [
          { w: 2, text: { fr: "Discrétion absolue tentée. Le lit a couiné comme un canard qu'on égorge. À 8 h, mon père a servi le café sans un mot, puis a posé une bombe de dégrippant à côté de mon bol.", en: 'Absolute discretion attempted. The bed squealed like a strangled duck. At 8 a.m. my dad served coffee without a word, then set a can of WD-40 next to my mug.' }, fx: { rel: 10, happy: 6, stress: 4 }, mood: 'shock' },
          { w: 1, text: { fr: "Le sommier a cédé dans un fracas d'apocalypse. Ma mère a déboulé avec une batte de baseball et allumé la lumière. Personne n'a mangé au petit-déjeuner.", en: 'The bed frame collapsed with an apocalyptic crash. My mom burst in with a baseball bat and flipped on the light. Nobody ate breakfast.' }, fx: { rel: 5, happy: -4, stress: 8 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Dormir sagement', en: 'Behave and sleep' }, text: { fr: "On a dormi sagement, collés, en sueur, dans 90 cm. {a.first} m'a mis trois coups de genou. Au petit-déj, ma mère a demandé avec un clin d'œil si on avait « bien dormi ».", en: "We slept like saints, glued together, sweating, in a twin bed. {a.first} kneed me three times. At breakfast my mom winked and asked if we 'slept well'." }, fx: { rel: 2, happy: -2 } },
      { label: { fr: 'Migrer au salon', en: 'Sneak to the living room' }, text: { fr: "On s'est repliés au salon. Le chien nous a fixés toute la nuit sans cligner des yeux. Je ne pourrai plus jamais m'asseoir sur ce canapé à Noël.", en: "We relocated to the living room. The dog stared at us all night without blinking. I can never sit on that couch at Christmas again." }, fx: { rel: 8, happy: 5, karma: -1 }, mood: 'love' },
    ],
  },

  // ───────────────────────────── voyages ─────────────────────────────
  {
    id: 'yo_backpacking',
    icon: '🎒',
    cat: 'travel',
    rating: 1,
    scene: { place: 'beach', mood: 'happy', prop: 'backpack' },
    when: { age: [19, 30] },
    vars: { amount: [800, 3000] },
    weight: 6,
    once: true,
    text: {
      fr: ["Tu pars faire le tour de l'Asie du Sud-Est en sac à dos avec {$amount} d'économies et la ferme intention de « te trouver ». Ton sac pèse 22 kilos, dont six de chaussettes.", "Six mois de backpacking : auberges à trois sous, sarouel à éléphants et un Australien nommé Dazza qui te suit depuis trois pays. Grande décision ce soir."],
      en: ["You're off backpacking around Southeast Asia with {$amount} in savings and a firm intention to 'find yourself'. Your pack weighs 50 pounds, 13 of them socks.", "Six months of backpacking: dirt-cheap hostels, elephant harem pants and an Australian named Dazza who's been following you for three countries. Big decision tonight."],
    },
    choices: [
      {
        label: { fr: 'Full Moon Party', en: 'Full Moon Party' },
        out: [
          { w: 2, text: { fr: "Peinture fluo sur le corps, seau de cocktail, saut au-dessus de la corde enflammée. Il me reste une cicatrice et un vague souvenir d'avoir épousé Dazza symboliquement sur la plage.", en: 'Neon body paint, cocktail buckets, jumping over the flaming rope. I have a scar and a vague memory of symbolically marrying Dazza on the beach.' }, fx: { money: '-amount', happy: 12, addiction: ['alcohol', 8], health: -4 }, mood: 'party' },
          { w: 1, text: { fr: "J'ai sauté au-dessus de la corde enflammée. J'ai atterri dessus. Mon sarouel a pris feu. Les éléphants n'ont pas survécu.", en: "I jumped over the flaming rope. I landed on it. My harem pants caught fire. The elephants did not survive." }, fx: { money: '-amount', health: -8, disease: 'burns', visual: 'fire' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Retraite de méditation', en: 'Meditation retreat' }, text: { fr: "Dix jours de silence dans un monastère. Jour 3, j'ai pleuré devant une fourmi. Jour 10, j'avais trouvé la paix intérieure. Je l'ai reperdue à l'aéroport, au tapis à bagages.", en: 'Ten days of silence in a monastery. Day 3, I cried at an ant. Day 10, I found inner peace. I lost it again at the airport baggage carousel.' }, fx: { money: '-amount', happy: 8, stress: -15, smarts: 3 }, mood: 'happy' },
      { label: { fr: "Donner des cours d'anglais", en: 'Teach English for cash' }, text: { fr: "J'ai enseigné l'anglais à des enfants adorables pour financer le voyage. Mon anglais est moyen. Ils ont tous mon accent maintenant. Pardon au monde entier.", en: "I taught English to adorable kids to fund the trip. My English is mediocre. They all have my accent now. Sorry, world." }, fx: { money: 600, karma: 3, happy: 5 } },
    ],
  },
  {
    id: 'yo_travel_belly',
    icon: '🚌',
    cat: 'travel',
    rating: 2,
    scene: { place: 'park', mood: 'sick', prop: 'bus', fx: 'poop' },
    when: { age: [18, 32] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: ["En voyage, tu as mangé une brochette « mystère » sur un marché de nuit. Trois heures plus tard, tu montes dans un bus de nuit de onze heures. Sans toilettes. Ton ventre fait des bruits de dauphin.", "Jour 4 de tes vacances : ton estomac a décidé de rejeter tout ce que tu as mangé depuis le collège. Ton vol de retour décolle dans six heures."],
      en: ['While traveling, you ate a "mystery skewer" at a night market. Three hours later you board an eleven-hour night bus. No toilet. Your stomach is making dolphin noises.', 'Day 4 of your vacation: your stomach has decided to reject everything you have eaten since middle school. Your flight home leaves in six hours.'],
    },
    choices: [
      {
        label: { fr: 'Serrer les fesses', en: 'Clench and pray' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: "J'ai serré les fesses pendant des heures en récitant l'alphabet à l'envers. J'ai tenu. Je suis une légende de la volonté humaine.", en: 'I clenched for hours, reciting the alphabet backwards. I held it. I am a legend of human willpower.' }, fx: { health: -4, discipline: 8, happy: 4 }, mood: 'proud' },
          { w: 2, text: { fr: "Au bout de sept heures, j'ai perdu la bataille. Dans le bus. Dans un virage. Quarante passagers ont vécu ça avec moi. Le chauffeur m'a déposé{|e} au bord de la route avec un sac plastique et sa bénédiction.", en: 'Seven hours in, I lost the battle. On the bus. Around a curve. Forty passengers experienced it with me. The driver dropped me on the roadside with a plastic bag and his blessing.' }, fx: { health: -8, happy: -10, disease: 'food_poisoning', visual: 'poop' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Médicaments à fond', en: 'Max out the meds' }, text: { fr: "J'ai avalé tant d'anti-diarrhéiques que je ne suis plus allé{|e} aux toilettes pendant neuf jours. J'avais peur d'exploser à la douane.", en: "I took so many anti-diarrhea pills I didn't go for nine days. I was afraid I'd explode at customs." }, fx: { health: -3, happy: 2, stress: 4 } },
      { label: { fr: 'Aller à la clinique', en: 'Go to a local clinic' }, text: { fr: "Le médecin m'a donné une perfusion, une banane et un regard plein de pitié pour les touristes qui mangent n'importe quoi. Ça coûtait trois fois rien.", en: 'The doctor gave me an IV, a banana and a look full of pity for tourists who eat anything. It cost next to nothing.' }, fx: { money: -20, health: 6 } },
    ],
  },
  {
    id: 'yo_passport_stolen',
    icon: '🛂',
    cat: 'travel',
    scene: { place: 'office', mood: 'shock', prop: 'passport' },
    when: { age: [18, 32] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["En voyage, on t'a volé ton sac : passeport, carte bancaire et tes seuls sous-vêtements propres. Tu es à 9 000 km de chez toi avec trois pièces et un ticket de métro.", "Ton passeport a disparu à l'aéroport. Le policier local prend ta déposition en mangeant des chips et écrit ton nom avec trois fautes. Ton vol part dans deux heures."],
      en: ["While traveling, someone stole your bag: passport, bank card and your only clean underwear. You're 6,000 miles from home with three coins and a metro ticket.", 'Your passport vanished at the airport. The local officer takes your statement while eating chips and spells your name with three mistakes. Your flight leaves in two hours.'],
    },
    choices: [
      { label: { fr: "Aller à l'ambassade", en: 'Go to the embassy' }, text: { fr: "Quatre jours dans la file de l'ambassade avec une famille en sandales, un influenceur en pleurs et un monsieur qui avait perdu son passeport « dans un cocotier ». J'ai eu mon laissez-passer. On s'écrit encore.", en: "Four days in the embassy line with a family in sandals, a sobbing influencer and a man who lost his passport 'in a coconut tree'. I got my emergency papers. We still keep in touch." }, fx: { happy: 2, stress: 6, money: -150 } },
      { label: { fr: 'Appeler les parents', en: 'Call mom and dad' }, if: { has: 'parent' }, text: { fr: "Mes parents m'ont viré de l'argent et un sermon de 45 minutes sur « les sacs bananes, ça existe ».", en: "My parents wired me money and a 45-minute lecture on how 'fanny packs exist, you know'." }, fx: { money: 300, happy: -2 } },
      {
        label: { fr: 'Me débrouiller', en: 'Hustle my way home' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "J'ai joué de la guitare dans la rue avec une guitare empruntée. J'ai gagné plus en trois jours qu'en un mois de job étudiant.", en: 'I busked with a borrowed guitar. I made more in three days than in a month of part-time work.' }, fx: { money: 400, happy: 8, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: "Je ne sais pas jouer de la guitare. Les passants m'ont donné de l'argent pour que j'arrête. Ça compte.", en: "I can't play guitar. People gave me money to stop. It counts." }, fx: { money: 50, happy: 2 } },
        ],
      },
    ],
  },
  {
    id: 'yo_hostel',
    icon: '🛏️',
    cat: 'travel',
    rating: 2,
    scene: { place: 'apartment', mood: 'angry', prop: 'bunk' },
    when: { age: [18, 30] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: ["Auberge de jeunesse, dortoir de 16 lits. Le type de la couchette du dessus dort nu, ronfle comme un tracteur et se coupe les ongles de pied au-dessus de ta tête à 7 h du matin.", "Dortoir d'auberge. Le couple de la couchette d'en face pense que tout le monde dort. Tout le monde ne dort pas. Seize personnes fixent le plafond en silence pendant que le lit grince en rythme."],
      en: ['Youth hostel, 16-bed dorm. The guy in the bunk above sleeps naked, snores like a tractor and clips his toenails over your head at 7 a.m.', "Hostel dorm. The couple in the opposite bunk thinks everyone's asleep. Everyone is not asleep. Sixteen people stare silently at the ceiling while the bed squeaks in rhythm."],
    },
    choices: [
      { label: { fr: "Se plaindre à l'accueil", en: 'Complain at reception' }, text: { fr: "Le réceptionniste, défoncé, m'a proposé un « surclassement » : une chambre avec un seul voisin. Il a un harmonica et aucune pudeur.", en: "The stoned receptionist offered me an 'upgrade': a room with only one roommate. He has a harmonica and no shame." }, fx: { happy: -2, stress: 3 } },
      { label: { fr: "Riposte à l'œuf dur", en: 'Boiled egg retaliation' }, text: { fr: "J'ai mangé un œuf dur et un fromage qui pue à 6 h du matin, dans le noir, en mastiquant fort. Le dortoir entier a évacué. J'ai eu la chambre pour moi tout{|e} seul{|e}.", en: 'At 6 a.m. I ate a hard-boiled egg and a stinky cheese in the dark, chewing loudly. The whole dorm evacuated. I had the room all to myself.' }, fx: { happy: 6, karma: -3 } },
      { label: { fr: 'Commenter en direct', en: 'Live commentary' }, text: { fr: "J'ai commenté la scène à voix haute façon documentaire animalier. Le dortoir a éclaté de rire, le coupable a salué, et on est tous allés boire une bière ensemble.", en: 'I narrated the scene out loud like a nature documentary. The dorm burst out laughing, the culprit took a bow, and we all went for a beer together.' }, fx: { happy: 8, fame: 1 }, mood: 'party' },
    ],
  },
  {
    id: 'yo_nudist_beach',
    icon: '🏖️',
    cat: 'travel',
    rating: 2,
    scene: { place: 'beach', mood: 'shock', prop: 'towel' },
    when: { age: [18, 32] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["En vacances, tu poses ta serviette sur une plage sublime et étrangement calme. Tu lèves les yeux : un retraité tout nu fait la salutation au soleil juste devant toi. Quarante autres derrière lui. Ce n'est pas une plage normale.", "Tu as suivi un panneau « Plage sauvage » et atterri sur une plage naturiste. Un monsieur nu te propose un beach-volley. Quand il saute, tout bouge. Absolument tout."],
      en: ["On vacation, you lay your towel on a gorgeous, oddly quiet beach. You look up: a naked retiree is doing sun salutations right in front of you. Forty more behind him. This is not a normal beach.", "You followed a sign saying 'Wild Beach' and ended up on a nudist beach. A naked man invites you to play volleyball. When he jumps, everything moves. Absolutely everything."],
    },
    choices: [
      {
        label: { fr: 'Jouer le jeu', en: 'When in Rome' },
        out: [
          { w: 2, text: { fr: "Tout enlevé, beach-volley, libération totale. Coup de soleil sur des zones qui n'avaient jamais vu le jour. J'ai marché comme un cow-boy pendant cinq jours.", en: 'Stripped, played volleyball, total liberation. Sunburn on regions that had never seen daylight. I walked like a cowboy for five days.' }, fx: { happy: 8, health: -4 }, mood: 'happy' },
          { w: 1, text: { fr: "Un crabe m'a pincé là où il ne fallait absolument pas. Mon cri a fait le tour de la baie. Les naturistes en parlent encore.", en: 'A crab pinched me exactly where it absolutely should not. My scream echoed across the bay. The nudists still talk about it.' }, fx: { health: -6, happy: -3, fame: 1 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Rester en maillot', en: 'Keep my swimsuit on' }, text: { fr: "Seule personne habillée, donc, curieusement, la plus indécente. Tout le monde me fixait comme un pervers.", en: 'The only clothed person, and therefore, oddly, the most indecent. Everyone stared at me like I was the pervert.' }, fx: { happy: -2, stress: 3 } },
      { label: { fr: 'Fuir', en: 'Flee' }, text: { fr: "J'ai fui en courant, et traversé en plein milieu un tournoi de pétanque naturiste. Ces images ne partiront jamais.", en: 'I ran, straight through the middle of a nudist bocce tournament. Those images will never leave me.' }, fx: { happy: -4, stress: 4, smarts: -1 } },
    ],
  },
  {
    id: 'yo_auto_photos',
    icon: '📸',
    cat: 'travel',
    auto: true,
    scene: { place: 'beach', mood: 'happy' },
    when: { age: [18, 32] },
    weight: 6,
    cooldown: 4,
    text: {
      fr: ["Revenu{|e} de vacances avec 2 300 photos. 1 900 sont des couchers de soleil identiques. Les 400 autres, mon pouce.", "Week-end à l'étranger : j'ai passé 60 % du temps à chercher du wifi et 40 % à chercher des toilettes gratuites. Très enrichissant.", "Week-end {w:far_place} : 400 photos, dont 380 où {w:animal} me vole la vedette. Je ne regrette rien.", "J'ai posté mes photos de vacances. Seul commentaire, celui de ma tante : « C'est {w:at_place} ? » Non. C'étaient les Maldives.", "Mon téléphone a créé un diaporama « Ton année en souvenirs » sur {w:song}. Il y a surtout des captures d'écran de factures et {w:food} sous tous les angles."],
      en: ["Back from vacation with 2,300 photos. 1,900 are identical sunsets. The other 400 are my thumb.", "Weekend abroad: I spent 60% of it looking for wifi and 40% looking for free bathrooms. Very enriching.", "Weekend {w:far_place}: 400 photos, 380 of which feature {w:animal} stealing the show. No regrets.", "I posted my vacation photos. Only comment, from my aunt: 'Is that {w:at_place}?' No. It was the Maldives.", "My phone made a 'Your Year in Memories' slideshow set to {w:song}. It's mostly screenshots of bills and {w:food} from every angle."],
    },
    fx: { happy: 3, money: -150 },
  },

  // ───────────────────────────── gym, argent, hustle ─────────────────────────────
  {
    id: 'yo_gym_membership',
    icon: '🏋️',
    cat: 'gym',
    scene: { place: 'stadium', mood: 'proud', prop: 'dumbbell' },
    when: { age: [18, 32] },
    vars: { amount: [200, 600] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: ["1er janvier. Tu t'inscris à la salle avec un abonnement d'un an à {$amount}. « Cette année, c'est la bonne. » Le vendeur a un sourire de requin.", "La salle du quartier fait une promo : abonnement « sans engagement » à {$amount}. Les petites lignes font quatre pages et mentionnent ton premier enfant."],
      en: ["January 1st. You sign up for a one-year gym membership at {$amount}. 'This is my year.' The salesman has a shark's smile.", "The local gym has a deal: 'no commitment' membership for {$amount}. The fine print is four pages long and mentions your firstborn."],
    },
    choices: [
      {
        label: { fr: 'Y aller vraiment', en: 'Actually go' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: "Contre toute attente, trois séances par semaine toute l'année. J'ai des abdos. J'en parle beaucoup trop.", en: 'Against all odds, three sessions a week all year. I have abs. I talk about them way too much.' }, fx: { money: '-amount', athletic: 8, looks: 4, health: 5, happy: 4, weight: -0.04 }, mood: 'proud' },
          { w: 2, text: { fr: "Deux fois en janvier, une fois en février, puis plus jamais. Je paie toujours. C'est mon don mensuel à la salle.", en: "Twice in January, once in February, then never again. I'm still paying. It's my monthly donation to the gym." }, fx: { money: '-amount', happy: -3 } },
        ],
      },
      { label: { fr: 'Résilier direct', en: 'Try to cancel' }, text: { fr: "Pour résilier, il fallait un recommandé, un pigeon voyageur et une photo de moi en larmes. J'ai abandonné. Je paie encore.", en: 'To cancel I needed certified mail, a carrier pigeon and a photo of me crying. I gave up. Still paying.' }, fx: { money: '-amount', stress: 5 } },
      { label: { fr: 'Courir dehors', en: 'Just run outside' }, text: { fr: "J'ai couru dehors, gratuitement. Une fois. Un chien m'a poursuivi{|e} et j'ai battu mon record personnel.", en: 'I ran outside, for free. Once. A dog chased me and I set a personal record.' }, fx: { athletic: 3, health: 2, happy: 2 } },
    ],
  },
  {
    id: 'yo_gym_fart',
    icon: '💨',
    cat: 'gym',
    rating: 2,
    scene: { place: 'stadium', mood: 'shock', prop: 'bench', fx: 'poop' },
    when: { age: [18, 32] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: ["Salle de sport, heure de pointe. Tu tentes ton record au développé couché devant une rangée de types bodybuildés qui se filment. Ton ventre gargouille : chili con carne hier soir.", "Cours de yoga collectif, posture du chien tête en bas. Silence total. Vingt personnes respirent profondément. Toi, tu sens que ton corps prépare quelque chose de terrible."],
      en: ["Gym, rush hour. You're going for a bench press PR in front of a row of bodybuilders filming themselves. Your stomach gurgles: chili last night.", 'Group yoga class, downward dog. Total silence. Twenty people breathing deeply. You can feel your body preparing something terrible.'],
    },
    choices: [
      {
        label: { fr: 'Pousser à fond', en: 'Push through' },
        out: [
          { w: 2, text: { fr: "J'ai poussé de toutes mes forces. La barre est montée, et pas qu'elle : un pet de trois secondes, puissant, avec écho. Un bodybuildeur a lâché son haltère. On m'appelle « La Trompette » maintenant.", en: "I pushed with everything I had. The bar went up, and so did something else: a three-second fart, powerful, with echo. A bodybuilder dropped his dumbbell. They call me 'The Trumpet' now." }, fx: { athletic: 3, happy: -4, fame: 2 }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai poussé si fort que ce n'était pas qu'un pet. Je suis reparti{|e} en marchant de profil, une serviette nouée à la taille, devant vingt témoins.", en: 'I pushed so hard it was not just a fart. I left walking sideways, a towel tied around my waist, in front of twenty witnesses.' }, fx: { happy: -10, stress: 6, visual: 'poop' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Accuser le voisin', en: 'Blame the next guy' }, text: { fr: "J'ai lâché le monstre et fixé mon voisin avec dégoût. Tout le monde l'a regardé, lui. Il a quitté la salle. Je vis avec ça.", en: "I unleashed the beast and stared at the guy next to me in disgust. Everyone looked at him. He left the gym. I live with that." }, fx: { karma: -4, happy: 4 } },
      { label: { fr: 'Fuir aux toilettes', en: 'Run for the toilet' }, text: { fr: "J'ai couru aux toilettes accroupi{|e}, tel un crabe. J'ai survécu. La porte, elle, ne fermait pas.", en: "I scuttled to the toilet crouched like a crab. I survived. The door didn't lock." }, fx: { happy: -3, health: 1 } },
    ],
  },
  {
    id: 'yo_steroids',
    icon: '💉',
    cat: 'gym',
    rating: 2,
    scene: { place: 'stadium', mood: 'angry', prop: 'syringe' },
    when: { age: [18, 32] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["Au vestiaire, un certain « Tonton Gainz », 130 kilos de veines, te propose des « vitamines spéciales » en seringue. « Trois mois et t'es un frigo américain. »", "Le coach de ta salle te glisse une boîte de pilules sans étiquette. « C'est légal. Enfin, sur un bateau, dans les eaux internationales. »"],
      en: ["In the locker room, a guy called 'Uncle Gainz', 290 pounds of veins, offers you 'special vitamins' in a syringe. 'Three months and you're a side-by-side fridge.'", "Your gym coach slips you an unlabeled box of pills. 'It's legal. Well, on a boat, in international waters.'"],
    },
    choices: [
      {
        label: { fr: 'Devenir un frigo', en: 'Become a fridge' },
        out: [
          { w: 2, text: { fr: "15 kilos de muscle en trois mois. Plus de l'acné dans le dos en forme de constellation, une voix qui déraille et des crises de rage contre des bocaux de cornichons. J'ai cassé un vrai frigo.", en: "Thirty pounds of muscle in three months. Plus back acne shaped like a constellation, a voice that cracks and rage fits against pickle jars. I broke an actual fridge." }, fx: { athletic: 12, looks: -4, health: -10, stress: 8, weight: 0.05, addiction: ['drugs', 8] }, mood: 'angry' },
          { w: 1, text: { fr: "Le foie a dit non. Il l'a dit très fort, en jaune. Urgences, peau couleur Simpson, et un médecin qui ne rigolait pas du tout.", en: 'My liver said no. It said it loudly, in yellow. ER, Simpsons-colored skin, and a doctor who was not laughing at all.' }, fx: { health: -18, disease: 'liver_disease' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Refuser poliment', en: 'Politely decline' }, text: { fr: "J'ai refusé. Tonton Gainz m'a dit « respect » en me broyant la main. Poignet foulé deux semaines. Mais naturellement.", en: "I declined. Uncle Gainz said 'respect' and crushed my hand. Sprained wrist for two weeks. But all natural." }, fx: { disease: 'sprain', karma: 2 } },
      { label: { fr: 'Le balancer', en: 'Report him' }, text: { fr: "J'ai prévenu la direction. Tonton Gainz a été viré. Le lendemain, mon vélo avait été noué en forme de bretzel.", en: 'I told management. Uncle Gainz got banned. The next day my bike had been tied into a pretzel.' }, fx: { karma: 4, happy: -2 } },
    ],
  },
  {
    id: 'yo_crypto',
    icon: '🪙',
    cat: 'money',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'phone' },
    when: { age: [18, 32], noFlag: 'yo_crypto_bag' },
    actor: 'anyFriend',
    vars: { amount: [300, 4000] },
    weight: 7,
    cooldown: 6,
    text: {
      fr: ["{a.first} spamme le groupe WhatsApp depuis une semaine : « $PIZZACOIN va faire x1000, je vous jure sur ma mère. » {a:Il|Elle} veut que tu mettes {$amount}. Sa mère n'est pas au courant.", "{a.first} t'appelle à 2 h du matin, essoufflé{a:|e} : « Achète du ShibaFloki2 MAINTENANT. » Le logo est un chien qui fume un cigare. La blockchain a été codée par un gamin de 14 ans."],
      en: ["{a.first} has been spamming the group chat all week: '$PIZZACOIN is gonna 1000x, I swear on my mother.' They want you to put in {$amount}. Their mother has not been informed.", "{a.first} calls you at 2 a.m., out of breath: 'Buy ShibaFloki2 NOW.' The logo is a dog smoking a cigar. The blockchain was coded by a 14-year-old."],
    },
    choices: [
      { label: { fr: 'Tout miser', en: 'Go all in' }, text: { fr: "J'ai mis {$amount} dans la crypto de {a.first}. Trois applis de cours installées, je regarde le graphique toutes les quatre minutes, même aux toilettes. Surtout aux toilettes.", en: "I put {$amount} into {a.first}'s crypto. Three price apps installed, I check the chart every four minutes, even on the toilet. Especially on the toilet." }, fx: { money: '-amount', stress: 8, rel: 5, flag: 'yo_crypto_bag', schedule: { key: 'yo_crypto_crash', years: 1 } } },
      { label: { fr: 'Un tout petit peu', en: 'Just a little' }, text: { fr: "J'ai mis 50 balles « pour rigoler ». Je les considère déjà comme perdus, comme mes cheveux à 40 ans.", en: "I put in 50 bucks 'for fun'. I already consider it gone, like my hair at 40." }, fx: { money: -50, rel: 3 } },
      { label: { fr: 'Refuser', en: 'Say no' }, text: { fr: "J'ai refusé. {a.first} m'a traité{|e} de « boomer ». J'ai {age} ans.", en: "I said no. {a.first} called me a 'boomer'. I'm {age}." }, fx: { rel: -5, happy: -1 } },
    ],
  },
  {
    id: 'yo_crypto_crash',
    icon: '🚀',
    cat: 'money',
    rating: 1,
    chainOnly: true,
    scene: { place: 'apartment', mood: 'shock', prop: 'chart' },
    when: { age: [18, 35], flag: 'yo_crypto_bag' },
    actor: 'anyFriend',
    vars: { amount: [5000, 40000] },
    text: {
      fr: ["Ta crypto de l'an dernier vient de bouger. Énormément. Tu ouvres l'appli d'une main tremblante, un œil fermé.", "{a.first} t'envoie un seul message : un émoji fusée. Ou c'était un cercueil ? Tu ouvres ton portefeuille crypto."],
      en: ["Last year's crypto just moved. A lot. You open the app with a shaking hand, one eye closed.", '{a.first} sends you a single message: a rocket emoji. Or was it a coffin? You open your crypto wallet.'],
    },
    choices: [
      {
        label: { fr: 'Regarder le graphique', en: 'Look at the chart' },
        out: [
          { w: 3, text: { fr: "-99,7 %. Le développeur est parti avec la caisse et poste des photos de lui en jet-ski. Mon portefeuille vaut quatre centimes. {a.first} dit que c'est « le moment d'en racheter ».", en: "-99.7%. The developer ran off with the money and posts photos of himself on a jet ski. My wallet is worth four cents. {a.first} says it's 'time to buy the dip'." }, fx: { happy: -10, stress: 10, rel: -15, unflag: 'yo_crypto_bag' }, mood: 'cry' },
          { w: 1, text: { fr: "x40 ! J'ai tout revendu immédiatement, les mains moites : {$amount}. {a.first}, lui, a tout gardé « pour la lune ». Le lendemain, la lune s'est effondrée.", en: "40x! I sold everything immediately with sweaty hands: {$amount}. {a.first} held 'for the moon'. The next day, the moon collapsed." }, fx: { money: 'amount', happy: 15, rel: 5, visual: 'money', unflag: 'yo_crypto_bag' }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Ne jamais regarder', en: 'Never look' }, text: { fr: "Tant que je ne regarde pas, je suis à la fois riche et ruiné{|e}. Schrödinger serait fier de moi.", en: "As long as I don't look, I'm both rich and broke. Schrödinger would be proud." }, fx: { stress: -2, happy: 2, unflag: 'yo_crypto_bag' } },
    ],
  },
  {
    id: 'yo_donation',
    icon: '🧪',
    cat: 'money',
    rating: 2,
    scene: { place: 'hospital', mood: 'shock', prop: 'cup' },
    when: { age: [18, 30], money: [-1000000, 2000] },
    vars: { amount: [50, 900] },
    weight: 5,
    once: true,
    text: {
      fr: ["Fauché{|e} comme les blés, tu tombes sur une annonce : une clinique de fertilité de {city} rémunère les dons de « matériel génétique » {$amount}. Tu regardes ton compte. Tu regardes ton entrejambe.", "Ta coloc te parle d'un « job facile » : donner ses gamètes à la science pour {$amount}. Il paraît qu'il y a même des magazines dans la petite pièce. Ils datent de 1997."],
      en: ["Flat broke, you spot an ad: a fertility clinic in {city} pays {$amount} for donations of 'genetic material'. You look at your bank account. You look at your crotch.", "Your flatmate mentions an 'easy gig': donating your reproductive cells to science for {$amount}. Apparently there are even magazines in the little room. From 1997."],
    },
    choices: [
      {
        label: { fr: 'Faire le don', en: 'Do it for science' },
        out: [
          { w: 2, text: { fr: "Prise de sang, questionnaire sur mes ancêtres jusqu'au Moyen Âge, et une infirmière qui toquait au pire moment pour demander si « tout se passait bien ». J'ai touché {$amount}. Quelque part, un jour, des petits {first} existeront.", en: "Blood test, a questionnaire about my ancestors back to the Middle Ages, and a nurse who knocked at the worst possible moment to ask if 'everything was going okay'. I got {$amount}. Somewhere, someday, little {first}s will exist." }, fx: { money: 'amount', happy: 2, stress: 4, karma: 2 } },
          { w: 1, text: { fr: "Refusé : « qualité insuffisante ». Je n'ai jamais été aussi humilié{|e} par un microscope.", en: "Rejected: 'insufficient quality'. I have never been so humiliated by a microscope." }, fx: { happy: -8 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Mentir sur le formulaire', en: 'Lie on the form' }, text: { fr: "J'ai déclaré 1,90 m, un doctorat et zéro allergie. Quelque part, une famille attend un génie athlétique. Elle aura un enfant allergique aux chats qui mange de la colle.", en: "I claimed to be 6'3\" with a PhD and zero allergies. Somewhere, a family awaits an athletic genius. They'll get a cat-allergic kid who eats glue." }, fx: { money: 'amount', karma: -6, happy: 3 } },
      { label: { fr: 'Laisser tomber', en: 'Nope out' }, text: { fr: "J'ai renoncé et revendu mon vieux téléphone à la place. Moins de magazines, plus de dignité.", en: 'I backed out and sold my old phone instead. Fewer magazines, more dignity.' }, fx: { money: 60, happy: 1 } },
    ],
  },
  {
    id: 'yo_medical_trial',
    icon: '💊',
    cat: 'money',
    rating: 2,
    scene: { place: 'hospital', mood: 'neutral', prop: 'pills' },
    when: { age: [18, 32] },
    vars: { amount: [500, 3000] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["Un laboratoire paie {$amount} pour tester un nouveau médicament pendant deux semaines. Nom de code : XR-77. Effets secondaires possibles : « fatigue, nausées, sueurs bleues, impression d'être observé par les oiseaux ».", "Pour payer ton loyer, tu t'inscris à un essai clinique payé {$amount}. Ton voisin de chambre est un étudiant en philo qui est là « depuis 2017 » et parle aux pigeons."],
      en: ["A lab pays {$amount} to test a new drug for two weeks. Code name: XR-77. Possible side effects: 'fatigue, nausea, blue sweat, feeling watched by birds'.", "To make rent, you sign up for a clinical trial paying {$amount}. Your roommate is a philosophy student who's been there 'since 2017' and talks to pigeons."],
    },
    choices: [
      {
        label: { fr: 'Signer', en: 'Sign up' },
        out: [
          { w: 2, text: { fr: "J'ai touché {$amount} et transpiré bleu pendant trois mois. Mes draps ressemblent à un Schtroumpf écrasé. Ça partira, paraît-il.", en: "I got {$amount} and sweated blue for three months. My sheets look like a squashed Smurf. It'll go away, apparently." }, fx: { money: 'amount', looks: -4, health: -4, happy: 3, visual: 'money' } },
          { w: 1, text: { fr: "Effet secondaire non listé : des flatulences sonores toutes les onze minutes, précises comme une horloge suisse. Les chercheurs ont pris énormément de notes. J'ai touché {$amount}.", en: "Unlisted side effect: loud flatulence every eleven minutes, precise as a Swiss watch. The researchers took a LOT of notes. I got {$amount}." }, fx: { money: 'amount', health: -6, happy: -5, visual: 'poop' }, mood: 'shock' },
          { w: 1, text: { fr: "Le XR-77 m'a fait pousser un troisième téton. Il est très sensible à la météo. Je l'appelle Gaston. {$amount} quand même.", en: "XR-77 grew me a third nipple. It's very sensitive to the weather. I call it Gaston. Still got {$amount}." }, fx: { money: 'amount', looks: -3, fame: 1 } },
        ],
      },
      { label: { fr: 'Refuser', en: 'Decline' }, text: { fr: "J'ai préféré vendre mes fringues en ligne. Un inconnu m'a demandé si je vendais aussi mes chaussettes « portées, bien portées ». J'ai bloqué l'inconnu. Puis j'ai hésité.", en: "I sold my clothes online instead. A stranger asked if I also sold socks, 'worn, well worn'. I blocked the stranger. Then I hesitated." }, fx: { money: 40, happy: -1 } },
    ],
  },

  // ───────────────────────────── chien ─────────────────────────────
  {
    id: 'yo_get_dog',
    icon: '🐶',
    cat: 'pet',
    scene: { place: 'park', mood: 'love', prop: 'dog' },
    when: { age: [20, 32], noHas: 'pet' },
    weight: 7,
    once: true,
    text: {
      fr: ["Au refuge, un chien à trois pattes et à l'oreille mâchouillée te regarde comme si tu étais la dernière frite du paquet. Il s'appelle Biscotte.", "Une portée de chiots est à donner au marché. L'un d'eux s'est endormi sur ta chaussure et refuse d'en descendre."],
      en: ['At the shelter, a three-legged dog with a chewed ear looks at you like you are the last fry in the bag. His name is Biscuit.', 'A litter of puppies is up for grabs at the market. One of them fell asleep on your shoe and refuses to get off.'],
    },
    choices: [
      { label: { fr: "L'adopter", en: 'Adopt him' }, text: { fr: "Je l'ai adopté. Il a mangé mon canapé, mes chaussures et un bout de mur. Il dort sur ma tête. Je n'ai jamais été aussi heureu{x|se}.", en: "I adopted him. He ate my couch, my shoes and part of a wall. He sleeps on my head. I've never been happier." }, fx: { happy: 12, stress: -4, flag: 'yo_dog', newNpc: { role: 'pet', species: 'dog', age: [0, 3], abs: true } }, mood: 'love' },
      { label: { fr: 'Pas maintenant', en: 'Not right now' }, text: { fr: "J'ai dit non, le cœur brisé. J'y repense chaque fois que je vois un paillasson.", en: 'I said no, heartbroken. I think about it every time I see a doormat.' }, fx: { happy: -4 }, mood: 'sad' },
      { label: { fr: 'Plutôt un chat', en: 'Get a cat instead' }, text: { fr: "J'ai adopté un chat à la place. Il me regarde comme si j'étais son employé{|e} en période d'essai.", en: "I adopted a cat instead. He looks at me like I'm his employee on probation." }, fx: { happy: 8, newNpc: { role: 'pet', species: 'cat', age: [0, 3], abs: true } } },
    ],
  },
  {
    id: 'yo_dog_chaos',
    icon: '🐕',
    cat: 'pet',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock', prop: 'dog', fx: 'poop' },
    when: { age: [20, 35], flag: 'yo_dog', has: 'pet' },
    vars: { amount: [150, 800] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: ["Ton chien a avalé un string entier. Pas le tien. Il le ressort maintenant, lentement, par le mauvais bout, sur le tapis du salon, pendant un dîner avec tes parents. Ta mère tient sa fourchette en l'air.", "Ton chien a trouvé la poubelle de la salle de bain. Il revient au salon, fier comme un paon, pile quand ton rencard arrive, avec dans la gueule quelque chose qui ressemble beaucoup à un préservatif usagé."],
      en: ["Your dog swallowed an entire thong. Not yours. He's now passing it, slowly, out the wrong end, on the living room rug, during dinner with your parents. Your mother's fork is frozen midair.", "Your dog raided the bathroom trash. He trots back into the living room, proud as a peacock, right as your date arrives, holding something that looks a lot like a used condom."],
    },
    choices: [
      { label: { fr: 'Faire comme si de rien', en: 'Act natural' }, text: { fr: "J'ai continué à parler de la météo pendant que le chien terminait son œuvre. Personne n'a rien dit. On n'en parlera jamais. Jamais.", en: "I kept talking about the weather while the dog finished his masterpiece. Nobody said anything. We will never speak of it. Ever." }, fx: { happy: -6, stress: 6, visual: 'poop' }, mood: 'shock' },
      { label: { fr: 'Accuser le voisin', en: 'Blame the neighbor' }, text: { fr: "J'ai affirmé que c'était au voisin. Le voisin est un prêtre de 80 ans. L'explication n'a convaincu personne.", en: "I claimed it was the neighbor's. The neighbor is an 80-year-old priest. Nobody bought it." }, fx: { karma: -3, happy: -3 } },
      { label: { fr: 'Foncer chez le véto', en: 'Rush to the vet' }, text: { fr: "Urgence véto : {$amount}. Le vétérinaire a ri si fort qu'il a dû s'asseoir. La radio est maintenant encadrée dans sa salle d'attente.", en: 'Emergency vet: {$amount}. The vet laughed so hard he had to sit down. The X-ray is now framed in his waiting room.' }, fx: { money: '-amount', happy: -2 } },
    ],
  },

  // ───────────────────────────── famille & amis ─────────────────────────────
  {
    id: 'yo_parents_marriage',
    icon: '💍',
    cat: 'family',
    scene: { place: 'home', mood: 'neutral', prop: 'cheese' },
    when: { age: [24, 32], noHas: 'spouse' },
    actor: 'parent',
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["Repas de famille. Entre le fromage et le dessert, {a.rel} pose sa fourchette : « Alors, c'est pour quand le mariage ? Les voisins ont déjà trois petits-enfants. TROIS. »", "{a.rel} t'appelle « pour rien de spécial » puis enchaîne : « La fille de la voisine se marie. Le fils du boulanger se marie. Même le chien des Martin s'est trouvé quelqu'un. Et toi ? »"],
      en: ["Family dinner. Between the cheese and dessert, {a.rel} puts down the fork: 'So, when's the wedding? The neighbors already have three grandkids. THREE.'", "{a.rel} calls 'about nothing special' and then: 'The neighbor's daughter is getting married. The baker's son is getting married. Even the Martins' dog found someone. And you?'"],
    },
    choices: [
      { label: { fr: 'Inventer un amour', en: 'Invent a fiancé' }, text: { fr: "J'ai inventé un amour secret nommé Alex, pompier et violoniste, et {a.my} a déjà réservé une salle des fêtes. Je dois trouver un Alex avant juin.", en: "I invented a secret love named Alex, a firefighter and violinist, and {a.my} has already booked a venue. I need to find an Alex by June." }, fx: { rel: 8, stress: 8, karma: -2 } },
      { label: { fr: 'Parler politique', en: 'Bring up politics' }, text: { fr: "J'ai lancé le sujet de la politique pour faire diversion. Ça a marché : l'oncle Patrick a renversé la table. Plus personne ne parle de mariage.", en: 'I brought up politics as a diversion. It worked: Uncle Patrick flipped the table. Nobody is talking about weddings anymore.' }, fx: { rel: -3, happy: 2 } },
      { label: { fr: 'Dire la vérité', en: 'Tell the truth' }, text: { fr: "J'ai dit que j'étais heureu{x|se} comme ça, et {a.my} a hoché la tête, souri, puis m'a inscrit{|e} sur un site de rencontres le soir même.", en: "I said I'm happy as I am, and {a.my} nodded, smiled, then signed me up for a dating site that same night." }, fx: { rel: 3, happy: -2 } },
    ],
  },
  {
    id: 'yo_parents_setup',
    icon: '🕯️',
    cat: 'family',
    rating: 1,
    scene: { place: 'home', mood: 'shock', prop: 'candles' },
    when: { age: [22, 32], noHas: 'lover' },
    actor: 'parent',
    weight: 7,
    cooldown: 5,
    text: {
      fr: ["Dîner « tout à fait innocent » chez tes parents. Par pure coïncidence, l'enfant célibataire d'une collègue de {a.first} est assis à côté de toi. Il y a des bougies. {a.first} te fait un clin d'œil toutes les dix secondes.", "{a.first} t'a créé un profil sur un site de rencontres « pour t'aider ». Ta photo date de ta communion. Ta bio : « Mange bien, propre sur soi, rembourse ses dettes. » Tu as déjà un rendez-vous."],
      en: ["A 'totally innocent' dinner at your parents'. By pure coincidence, the single offspring of {a.first}'s coworker is seated next to you. There are candles. {a.first} winks at you every ten seconds.", "{a.first} made you a dating profile 'to help'. Your photo is from your first communion. Your bio: 'Eats well, clean, pays debts.' You already have a date."],
    },
    choices: [
      {
        label: { fr: 'Jouer le jeu', en: 'Play along' },
        out: [
          { w: 1, text: { fr: "La personne était drôle, cultivée, et aussi gênée que moi. On a ri de nos parents toute la soirée, puis un peu plus tard dans sa voiture. On se revoit, juste pour les embêter.", en: "They were funny, smart and just as mortified as I was. We laughed about our parents all evening, and a bit later in their car. We're seeing each other again, just to annoy them." }, fx: { happy: 8, rel: 10 }, mood: 'love' },
          { w: 1, text: { fr: "Mon rencard m'a parlé de sa collection de timbres de pays disparus pendant trois heures, puis a demandé l'addition « séparée, au centime près ».", en: "My date talked about their collection of stamps from countries that no longer exist for three hours, then asked to split the bill 'down to the cent'." }, fx: { happy: -4, rel: 5 } },
        ],
      },
      { label: { fr: 'Saboter', en: 'Sabotage it' }, text: { fr: "J'ai mangé avec les doigts, parlé de mes cafards et mentionné mon ex onze fois. Ça a marché. {a.first} ne me parle plus jusqu'à Noël.", en: "I ate with my hands, talked about my cockroaches and mentioned my ex eleven times. It worked. {a.first} isn't speaking to me until Christmas." }, fx: { rel: -12, happy: 4 } },
      { label: { fr: 'Fuir par les toilettes', en: 'Escape via the bathroom' }, text: { fr: "Je me suis enfui{|e} par la fenêtre des toilettes. Elle était plus petite que dans les films. Les pompiers ont dû m'extraire, les fesses à l'air. {a.first} a pris des photos.", en: "I escaped through the bathroom window. It was smaller than in the movies. The fire department had to extract me, butt first. {a.first} took photos." }, fx: { health: -2, rel: -5, fame: 1, happy: -3 }, mood: 'shock' },
    ],
  },
  {
    id: 'yo_best_man_speech',
    icon: '🎤',
    cat: 'family',
    rating: 2,
    scene: { place: 'party', mood: 'shock', prop: 'microphone' },
    when: { age: [22, 32] },
    actor: 'anyFriend',
    weight: 7,
    once: true,
    text: {
      fr: ["{a.first} se marie et tu es {le témoin|la témoin}. Discours devant 180 invités, la belle-famille et un curé. Tu as bu quatre coupes et ta fiche est tombée dans le velouté.", "Ton moment est arrivé : discours de témoin au mariage de {a.first}. Dans ta poche, deux versions. La gentille. Et celle qui raconte l'enterrement de vie à Prague."],
      en: ["{a.first} is getting married and you're the {best man|maid of honor}. A speech in front of 180 guests, the in-laws and a priest. You've had four glasses of champagne and your notes fell in the soup.", "It's your moment: {best man|maid of honor} speech at {a.first}'s wedding. In your pocket, two versions. The nice one. And the one about the bachelor weekend in Prague."],
    },
    choices: [
      {
        label: { fr: 'La version gentille', en: 'The nice version' },
        out: [
          { w: 1, text: { fr: "Émotion, larmes, applaudissements. Une grand-mère m'a embrassé{|e} sur la bouche. Par accident, je crois. Je crois.", en: 'Emotion, tears, applause. A grandmother kissed me on the mouth. By accident, I think. I think.' }, fx: { rel: 15, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "Fiche trempée de soupe : j'ai lu « beaucoup de bonheur » comme « beaucoup de beurre ». Tout le monde a applaudi le beurre.", en: "Soup-soaked notes: I read 'much happiness' as 'much butter'. Everyone applauded the butter." }, fx: { rel: 8, happy: 3 } },
        ],
      },
      {
        label: { fr: 'La version Prague', en: 'The Prague version' },
        out: [
          { w: 2, text: { fr: "J'ai raconté Prague. Le strip-teaseur, le cygne, la nuit en cellule et l'histoire du tatouage sur la fesse. Silence de mort. Le curé s'est signé. {a.first} m'a regardé{|e} comme un meurtrier. La belle-famille est partie avant le gâteau.", en: "I told the Prague story. The stripper, the swan, the night in a cell and the butt tattoo. Dead silence. The priest crossed himself. {a.first} looked at me like a murderer. The in-laws left before the cake." }, fx: { rel: -30, happy: -6, fame: 3, flag: 'yo_speech_disaster' }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai raconté Prague. Contre toute attente, la salle a hurlé de rire, curé compris. On m'a fait refaire le discours au dessert. Légende.", en: 'I told the Prague story. Against all odds, the room howled with laughter, priest included. They made me do it again at dessert. Legend.' }, fx: { rel: 10, happy: 10, fame: 3 }, mood: 'party' },
        ],
      },
      { label: { fr: 'Improviser bourré', en: 'Improvise drunk' }, text: { fr: "« Je connais {a.first} depuis… » Puis j'ai pleuré, chanté du Johnny et lancé le micro dans la pièce montée. Elle s'est effondrée sur un oncle. Il va bien. La pièce montée, non.", en: "'I've known {a.first} since…' Then I cried, sang Bon Jovi and threw the mic into the wedding cake. It collapsed onto an uncle. He's fine. The cake is not." }, fx: { rel: -15, happy: 2, addiction: ['alcohol', 6], flag: 'yo_speech_disaster' }, mood: 'party' },
    ],
  },
  {
    id: 'yo_auto_speech',
    icon: '📹',
    cat: 'family',
    rating: 2,
    auto: true,
    scene: { place: 'home', mood: 'sad' },
    when: { age: [22, 40], flag: 'yo_speech_disaster' },
    weight: 8,
    once: true,
    text: {
      fr: ["La vidéo de mon discours de témoin a été vue 40 000 fois sous le titre « Le témoin qui a parlé du strip-teaseur ». On me reconnaît à la boulangerie. On me sert en dernier.", "Je ne suis pas invité{|e} au baptême du premier enfant de mes amis. Le carton précisait « sans {first} ». Ils ont pris la peine de l'imprimer."],
      en: ["The video of my wedding speech got 40,000 views under the title 'The best man who mentioned the stripper'. I get recognized at the bakery. They serve me last.", "I'm not invited to my friends' first baby's christening. The card said 'no {first}'. They took the trouble to print it."],
    },
    fx: { happy: -4, fame: 2, followers: 1500 },
  },
  {
    id: 'yo_auto_wedding_season',
    icon: '💒',
    cat: 'family',
    auto: true,
    scene: { place: 'party', mood: 'party' },
    when: { age: [25, 32] },
    weight: 6,
    cooldown: 3,
    text: {
      fr: ["Cette année, cinq mariages. J'ai ruiné mon compte en cadeaux, dansé cinq fois sur « Joe le taxi » et pleuré une fois, au mauvais mariage.", "Saison des mariages : j'ai mangé tant de petits fours que ma tenue a demandé grâce. J'ai attrapé un bouquet sans le vouloir. Tout le monde m'a regardé{|e} avec pitié."],
      en: ["Five weddings this year. I drained my account on gifts, danced to 'YMCA' five times and cried once, at the wrong wedding.", 'Wedding season: I ate so many canapés my outfit begged for mercy. I caught a bouquet by accident. Everyone looked at me with pity.'],
    },
    fx: { money: -600, happy: 3, weight: 0.02 },
  },
];
