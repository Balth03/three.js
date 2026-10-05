// World events: country-specific local colour (`ct_<country>_…`) and era events (`ct_era_…`, `ct_fut_…`).
// Affectionate clichés: we laugh at situations, institutions and ourselves, never at people for who they are.
import type { EventDef } from '@bl/sim';

export const worldEvents2: EventDef[] = [
  // ═════════════════════════════ FRANCE ═════════════════════════════
  {
    id: 'ct_fr_strike', icon: '🪧', cat: 'world', rating: 0, weight: 10, cooldown: 3,
    scene: { place: 'park', mood: 'angry' },
    when: { country: ['fr'], age: [12, 75] },
    text: {
      fr: [
        "Grève SNCF, RATP et, par solidarité, de la boulangerie d'en bas. Tu dois traverser {city} pour aller {[[au boulot|en cours]]}.",
        "Mouvement social « reconductible ». Ton train est « supprimé », pas « annulé » — nuance. Comment tu t'en sors ?",
      ],
      en: [
        "Train strike, metro strike and, out of solidarity, the bakery downstairs too. You need to cross {city} to get to [[work|class]].",
        "A strike has been declared “renewable.” Your train is “withdrawn,” not “cancelled” — big difference. What now?",
      ],
    },
    choices: [
      { label: { fr: 'Y aller à pied', en: 'Walk there' }, out: [
        { w: 3, text: { fr: "J'ai marché 14 km. J'ai découvert trois quartiers, deux ampoules et une haine profonde des trottinettes.", en: "I walked nine miles. I discovered three neighborhoods, two blisters and a deep hatred of e-scooters." }, fx: { athletic: 4, health: 2, happy: -3 } },
        { w: 1, text: { fr: "J'ai marché tellement longtemps que je suis arrivé{|e} pile quand tout le monde rentrait. J'ai fait demi-tour. Journée sportive.", en: "I walked so long I arrived just as everyone was leaving. I turned around. Great cardio day." }, fx: { athletic: 5, stress: 4 } },
      ] },
      { label: { fr: 'Rejoindre la manif', en: 'Join the march' }, out: [
        { w: 3, text: { fr: "J'ai rejoint le cortège. Je ne savais pas trop contre quoi on manifestait, mais j'ai eu une merguez et un autocollant CGT. Révolution réussie.", en: "I joined the march. Not sure what we were protesting, but I got a merguez sausage and a union sticker. Revolution accomplished." }, fx: { happy: 6, karma: 2 }, mood: 'party' },
        { w: 1, text: { fr: "J'ai pris un nuage de lacrymo en plein visage en cherchant un kebab. J'ai pleuré trois heures, dont une par vraie tristesse.", en: "I caught a cloud of tear gas while looking for a kebab. I cried for three hours, one of them genuinely sad." }, fx: { health: -4, happy: -4 }, mood: 'cry' },
      ] },
      { label: { fr: 'Rester au lit', en: 'Stay in bed' }, text: { fr: "Je me suis déclaré{|e} « gréviste par empathie ». Personne n'a vérifié. La France, ce pays merveilleux.", en: "I declared myself a “sympathy striker.” Nobody checked. France, what a wonderful country." }, fx: { happy: 5, discipline: -3 } },
    ],
  },
  {
    id: 'ct_fr_bakery', icon: '🥖', cat: 'world', rating: 0, weight: 10, cooldown: 3,
    scene: { place: 'park', mood: 'neutral' },
    when: { country: ['fr'], age: [8, 95] },
    actor: { create: { role: 'acquaintance', age: [30, 50], gender: 'any' } },
    text: {
      fr: [
        "File d'attente à la boulangerie, 7 h 58. Il reste UNE tradition bien cuite. {a.first}, derrière toi, la fixe comme un fauve.",
        "Tu arrives enfin au comptoir. Une seule baguette tradition. Dans ton dos, {a.first} souffle très fort par le nez.",
      ],
      en: [
        "Bakery line, 7:58 a.m. There's ONE well-done baguette left. {a.first}, behind you, is staring at it like a predator.",
        "You finally reach the counter. One baguette left. Behind you, {a.first} is breathing very loudly through {a.his} nose.",
      ],
    },
    choices: [
      { label: { fr: 'La prendre', en: 'Take it' }, text: { fr: "J'ai pris la dernière tradition et j'ai mangé le quignon devant {a.first}. On ne se dit plus bonjour. Ça valait le coup.", en: "I took the last baguette and ate the heel right in front of {a.first}. We don't say hello anymore. Worth it." }, fx: { happy: 5, karma: -2 } },
      { label: { fr: 'La lui laisser', en: 'Let {a.him} have it' }, text: { fr: "J'ai laissé la baguette à {a.first}. {a:Il|Elle} m'a offert un pain au chocolat. Enfin, une « chocolatine ». On s'est embrouillés quand même.", en: "I let {a.first} have the baguette. {a:He|She} bought me a pain au chocolat. Then called it a “chocolatine.” We fought anyway." }, fx: { karma: 4, happy: 2, rel: 10, keep: true, actorRole: 'friend' } },
      { label: { fr: 'Demander un pain de mie', en: 'Ask for sliced bread' }, text: { fr: "J'ai demandé du pain de mie industriel. La boulangère m'a regardé{|e} comme si j'avais insulté sa mère. Toute la file a reculé d'un pas.", en: "I asked for factory sliced bread. The baker looked at me like I'd insulted her mother. The whole line took a step back." }, fx: { happy: -2, fame: 1 }, mood: 'shock' },
    ],
  },
  {
    id: 'ct_fr_bises', icon: '😘', cat: 'world', rating: 1, weight: 8, cooldown: 4,
    scene: { place: 'party', mood: 'shock' },
    when: { country: ['fr'], age: [18, 85] },
    actor: { create: { role: 'acquaintance', age: [-10, 10], gender: 'attracted' } },
    text: {
      fr: [
        "Soirée chez des amis. On te présente {a.first}, qui vient de Montpellier. Dilemme national : deux bises ? Trois ? Quatre ?",
        "{a.first} se penche vers toi pour faire la bise. Tu ignores totalement de quelle région {a:il|elle} vient. Le compte à rebours commence.",
      ],
      en: [
        "Party at a friend's. You're introduced to {a.first}, who's from the south. National dilemma: two cheek kisses? Three? Four?",
        "{a.first} leans in for the French cheek kiss. You have no idea which region {a.he} is from. The countdown begins.",
      ],
    },
    choices: [
      { label: { fr: 'Deux, à la parisienne', en: 'Two, Paris style' }, text: { fr: "Deux bises. {a.first} attendait la troisième, joue tendue dans le vide, comme un tournesol abandonné. Malaise.", en: "Two kisses. {a.first} was waiting for a third, cheek hanging in the void like an abandoned sunflower. Awkward." }, fx: { happy: -2, rel: 3 } },
      { label: { fr: 'Foncer au feeling', en: 'Wing it' }, out: [
        { w: 2, text: { fr: "Mauvais côté. Nos nez se sont percutés, puis nos bouches. On s'est roulé une pelle accidentelle devant tout le monde. Personne ne s'en est remis, surtout pas nous.", en: "Wrong side. Our noses collided, then our mouths. We accidentally made out in front of everyone. Nobody recovered, least of all us." }, fx: { happy: 6, rel: 15, keep: true, actorRole: 'friend' }, mood: 'love' },
        { w: 2, text: { fr: "J'ai fait quatre bises, puis cinq par panique. À la sixième, {a.first} m'a tendu la main. On a fini en check.", en: "I did four kisses, then five out of panic. On the sixth, {a.first} offered a handshake. We ended on a fist bump." }, fx: { happy: -3, stress: 3 } },
      ] },
      { label: { fr: 'Serrer la main', en: 'Shake hands' }, text: { fr: "J'ai tendu la main comme un notaire. {a.first} m'a demandé si j'étais suisse ou juste froid{|e}.", en: "I offered my hand like a notary. {a.first} asked if I was Swiss or just cold." }, fx: { rel: -5 } },
    ],
  },
  {
    id: 'ct_fr_prefecture', icon: '📑', cat: 'world', rating: 1, weight: 8, once: true,
    scene: { place: 'court', mood: 'angry' },
    when: { country: ['fr'], age: [18, 80] },
    text: {
      fr: [
        "Préfecture, guichet 14. Après 4 h d'attente, l'agente t'annonce qu'il manque le Cerfa n°15-776*02. Celui qu'on ne trouve que… au guichet 14, fermé.",
        "Ton dossier est « incomplet ». Il manque un justificatif de domicile de moins de trois mois, daté d'il y a plus de six mois. Logique.",
      ],
      en: [
        "Government office, window 14. After a four-hour wait, the clerk says you're missing Form 15-776*02. Only available at… window 14, now closed.",
        "Your file is “incomplete.” You need proof of address less than three months old, dated more than six months ago. Makes sense.",
      ],
    },
    choices: [
      { label: { fr: 'Revenir à 5 h du mat', en: 'Return at 5 a.m.' }, text: { fr: "Je suis revenu{|e} à 5 h avec un thermos. Il y avait déjà 80 personnes et un mec qui vendait des places. Dossier déposé. Paraît-il.", en: "I came back at 5 a.m. with a thermos. There were already 80 people and a guy scalping spots in line. File submitted. Allegedly." }, fx: { stress: 8, discipline: 3, schedule: { key: 'ct_fr_prefecture2', years: 1 } } },
      { label: { fr: 'Pleurer au guichet', en: 'Cry at the window' }, out: [
        { w: 1, text: { fr: "J'ai pleuré au guichet. L'agente a soupiré, tamponné trois feuilles sans les lire et m'a dit « allez, filez ». Les larmes, ça marche.", en: "I cried at the window. The clerk sighed, stamped three sheets without reading them and said “go on, shoo.” Tears work." }, fx: { happy: 4 } },
        { w: 1, text: { fr: "J'ai pleuré au guichet. L'agente a pleuré aussi. On a parlé de nos vies. Mon dossier n'a pas avancé, mais j'ai une nouvelle copine de galère.", en: "I cried at the window. The clerk cried too. We talked about our lives. My file went nowhere, but I made a fellow sufferer friend." }, fx: { happy: 1, stress: 4, schedule: { key: 'ct_fr_prefecture2', years: 1 } } },
      ] },
      { label: { fr: 'Gueuler un bon coup', en: 'Lose it, loudly' }, text: { fr: "J'ai hurlé « BANDE DE GRATTE-PAPIER DE MES DEUX ». La sécurité m'a sorti{|e}. Mon dossier, lui, a été « égaré ». Pour toujours.", en: "I screamed “YOU PAPER-PUSHING BASTARDS.” Security walked me out. My file was then “misplaced.” Forever." }, fx: { happy: 3, stress: -5, karma: -2 }, mood: 'angry' },
    ],
  },
  {
    id: 'ct_fr_prefecture2', icon: '🗄️', cat: 'world', rating: 2, chainOnly: true,
    scene: { place: 'court', mood: 'shock', fx: 'gore' },
    when: { country: ['fr'] },
    text: {
      fr: "Un an plus tard, la préfecture te recontacte : ton dossier a été validé… mais ta photo d'identité « ne respecte pas les normes ». Tu souris trop, apparemment.",
      en: "A year later, the prefecture calls back: your file was approved… but your ID photo “does not meet standards.” Apparently you're smiling too much.",
    },
    choices: [
      { label: { fr: 'Refaire la photo', en: 'Retake the photo' }, out: [
        { w: 3, text: { fr: "J'ai refait la photo avec une tête de détenu en cavale. Validée. Ma carte d'identité ressemble à un avis de recherche. Elle est parfaite.", en: "I retook the photo looking like a fugitive convict. Approved. My ID card looks like a wanted poster. It's perfect." }, fx: { happy: 4, stress: -6 } },
        { w: 1, text: { fr: "Le Photomaton a bugué et m'a flashé{|e} 47 fois en pleine rétine. J'ai vu des points violets pendant une semaine. Photo refusée : « yeux fermés ».", en: "The photo booth glitched and flashed me 47 times point-blank. I saw purple dots for a week. Photo rejected: “eyes closed.”" }, fx: { health: -3, happy: -4 } },
      ] },
      { label: { fr: 'Agrafer le formulaire', en: 'Staple the form' }, text: { fr: "J'ai voulu agrafer ma photo au dossier, mais l'agrafeuse antique de la préfecture m'a agrafé le pouce au Cerfa. Sang partout, formulaire taché : « illisible, à refaire ».", en: "I tried to staple my photo to the file, but the prefecture's ancient stapler stapled my thumb to the form. Blood everywhere, form stained: “illegible, start over.”" }, fx: { health: -5, happy: -6, visual: 'gore' }, mood: 'cry' },
      { label: { fr: 'Émigrer en Belgique', en: 'Move to Belgium' }, text: { fr: "J'ai menacé d'émigrer en Belgique. L'agent a dit que là-bas, il faut trois formulaires de plus, en deux langues. Je suis resté{|e}.", en: "I threatened to move to Belgium. The clerk said there you need three more forms, in two languages. I stayed." }, fx: { happy: -1, smarts: 1 } },
    ],
  },
  {
    id: 'ct_fr_apero_auto', icon: '🍷', cat: 'world', rating: 1, auto: true, weight: 8, cooldown: 3,
    when: { country: ['fr'], age: [18, 90] },
    text: {
      fr: [
        "Un apéro « vite fait, juste un verre » chez les voisins a duré sept heures. On a fini par le fromage, le génépi et un débat sur la retraite à 3 h du matin.",
        "J'ai été invité{|e} à un apéro dînatoire. Il y avait 14 sortes de chips, trois saucissons et zéro dîner. Je suis rentré{|e} ivre et affamé{|e}.",
      ],
      en: [
        "A “quick, just one glass” apéritif at the neighbors' lasted seven hours. It ended with cheese, mountain liqueur and a pension-reform debate at 3 a.m.",
        "I was invited to an “apéro dînatoire.” There were 14 kinds of chips, three sausages and zero dinner. I went home drunk and starving.",
      ],
    },
    fx: { happy: 5, health: -2, addiction: ['alcohol', 3] },
  },

  // ═════════════════════════════ BELGIUM ═════════════════════════════
  {
    id: 'ct_be_frites', icon: '🍟', cat: 'world', rating: 0, weight: 10, cooldown: 3,
    scene: { place: 'park', mood: 'happy' },
    when: { country: ['be'], age: [6, 95] },
    text: {
      fr: [
        "À la friterie, la dame te demande quelle sauce. Il y en a 23. Derrière toi, la file entière attend ton choix comme un verdict.",
        "Grand cornet de frites cuites deux fois dans la graisse de bœuf. Reste la question existentielle : quelle sauce ?",
      ],
      en: [
        "At the fry shack, the lady asks which sauce. There are 23. The whole line behind you awaits your choice like a verdict.",
        "A big cone of fries, double-cooked in beef fat. One existential question remains: which sauce?",
      ],
    },
    choices: [
      { label: { fr: 'Samouraï', en: 'Samurai sauce' }, text: { fr: "J'ai pris samouraï. Ma langue a pris feu, mes yeux ont pleuré, et j'en ai redemandé. La Belgique m'a adopté{|e}.", en: "I went with samurai sauce. My tongue caught fire, my eyes wept, and I asked for more. Belgium has adopted me." }, fx: { happy: 6, weight: 0.01 } },
      { label: { fr: 'Ketchup', en: 'Ketchup' }, text: { fr: "J'ai demandé du ketchup. Silence. La friturière a soupiré : « Ah, un Français… ». Je l'ai entendue raconter ça à sa sœur au téléphone.", en: "I asked for ketchup. Silence. The fry lady sighed, “Ah, a tourist…” I heard her telling her sister about it on the phone." }, fx: { happy: -2 } },
      { label: { fr: 'Toutes les sauces', en: 'Every sauce' }, out: [
        { w: 2, text: { fr: "J'ai pris andalouse, américaine, brazil, tartare et pickles. Ça ressemblait à une palette de peintre. C'était le meilleur repas de ma vie.", en: "I got andalouse, américaine, brazil, tartar and pickles. It looked like a painter's palette. Best meal of my life." }, fx: { happy: 8, weight: 0.02 }, mood: 'happy' },
        { w: 1, text: { fr: "Cinq sauces, zéro frite visible. Mon estomac a déposé une plainte officielle à 2 h du matin.", en: "Five sauces, zero visible fries. My stomach filed an official complaint at 2 a.m." }, fx: { health: -3, happy: 2, disease: 'gastro' }, mood: 'sick' },
      ] },
    ],
  },
  {
    id: 'ct_be_beer', icon: '🍺', cat: 'world', rating: 1, weight: 9, cooldown: 3,
    scene: { place: 'party', mood: 'party' },
    when: { country: ['be'], age: [16, 85] },
    text: {
      fr: [
        "Un café à Bruxelles. La carte des bières fait 40 pages. Le serveur recommande une trappiste à 11,3 %, brassée par des moines « très sévères ».",
        "Ton pote te sert une bière d'abbaye dans son verre officiel. « Juste une, hein. » Tu la sens déjà dans tes genoux.",
      ],
      en: [
        "A pub in Brussels. The beer menu is 40 pages long. The waiter recommends an 11.3% Trappist brewed by “very strict” monks.",
        "Your buddy pours you an abbey beer in its official glass. “Just one, okay?” You can already feel it in your knees.",
      ],
    },
    choices: [
      { label: { fr: 'Une seule', en: 'Just one' }, text: { fr: "Une seule trappiste. J'ai dit à un inconnu que je l'aimais, puis j'ai dormi dans le tram. C'était une seule, hein.", en: "Just one Trappist. I told a stranger I loved him, then fell asleep on the tram. It was just one, I swear." }, fx: { happy: 5, health: -1 } },
      { label: { fr: 'Faire la carte', en: 'Drink the menu' }, out: [
        { w: 2, text: { fr: "J'ai attaqué la carte dans l'ordre alphabétique. Arrivé{|e} à la lettre D, je parlais flamand. Je ne parle pas flamand.", en: "I worked through the menu alphabetically. By the letter D, I was speaking Flemish. I don't speak Flemish." }, fx: { happy: 8, health: -5, addiction: ['alcohol', 6] }, mood: 'party' },
        { w: 1, text: { fr: "Je me suis réveillé{|e} dans une brouette devant l'Atomium, avec un chapeau de schtroumpf et un tatouage de frite. Aucun souvenir.", en: "I woke up in a wheelbarrow in front of the Atomium, wearing a Smurf hat and a tattoo of a French fry. No memories." }, fx: { happy: 2, health: -6, looks: -2, addiction: ['alcohol', 8] }, mood: 'shock' },
      ] },
      { label: { fr: 'Un jus de pomme', en: 'An apple juice' }, text: { fr: "J'ai commandé un jus de pomme. Le serveur me l'a servi avec un regard de deuil national.", en: "I ordered an apple juice. The waiter served it with the look of national mourning." }, fx: { health: 2, happy: -1 } },
    ],
  },
  {
    id: 'ct_be_manneken', icon: '⛲', cat: 'world', rating: 2, weight: 7, once: true,
    scene: { place: 'park', mood: 'party', fx: 'police' },
    when: { country: ['be'], age: [18, 60] },
    text: {
      fr: [
        "3 h du matin, Grand-Place, bien éméché{|e}. Tes potes te lancent un défi : « Fais le Manneken Pis à côté du Manneken Pis. »",
        "Devant le Manneken Pis, après la tournée des bars, ta vessie et ton honneur te soufflent la même idée stupide.",
      ],
      en: [
        "3 a.m., Grand-Place, quite drunk. Your friends dare you: “Do the Manneken Pis next to the Manneken Pis.”",
        "In front of the Manneken Pis after a pub crawl, your bladder and your pride whisper the same stupid idea.",
      ],
    },
    choices: [
      { label: { fr: 'Relever le défi', en: 'Accept the dare' }, out: [
        { w: 2, text: { fr: "J'ai pris la pose, main sur la hanche, et arrosé fièrement. Un car de touristes japonais m'a mitraillé{|e}. Je suis maintenant sur 600 cartes postales.", en: "I struck the pose, hand on hip, and sprayed proudly. A tour bus full of tourists photographed me. I'm now on 600 postcards." }, fx: { happy: 8, fame: 6, followers: 3000 }, mood: 'party' },
        { w: 2, text: { fr: "Vent de face. J'ai tout reçu sur mes chaussures, mon pantalon et le flic qui arrivait derrière moi. Amende pour « outrage à monument ».", en: "Headwind. I got it all over my shoes, my pants and the cop walking up behind me. Fined for “outraging a monument.”" }, fx: { happy: -4, money: -250, heat: 10, visual: 'police' }, mood: 'shock' },
        { w: 1, text: { fr: "J'ai voulu escalader la fontaine pour faire plus vrai. J'ai glissé et je me suis fendu le crâne sur le petit bonhomme. Il m'a pissé dessus pendant que je saignais. Karma.", en: "I tried to climb the fountain for authenticity. I slipped and split my head open on the little guy. He peed on me while I bled. Karma." }, fx: { health: -12, disease: 'concussion', visual: 'gore' }, mood: 'sick' },
      ] },
      { label: { fr: 'Habiller la statue', en: 'Dress the statue' }, text: { fr: "J'ai enfilé mon caleçon sur le Manneken Pis. La ville a trouvé ça « conforme à la tradition » et l'a ajouté à sa garde-robe officielle. Je suis rentré{|e} sans slip.", en: "I put my underwear on the Manneken Pis. The city deemed it “in keeping with tradition” and added it to his official wardrobe. I walked home commando." }, fx: { happy: 6, fame: 3 } },
      { label: { fr: 'Rentrer dignement', en: 'Go home with dignity' }, text: { fr: "J'ai refusé. Mes amis m'ont traité{|e} de « Hollandais ». C'est la pire insulte qu'ils connaissent.", en: "I said no. My friends called me “Dutch.” It's the worst insult they know." }, fx: { happy: -2, karma: 2 } },
    ],
  },
  {
    id: 'ct_be_surreal', icon: '🎩', cat: 'world', rating: 0, weight: 8, cooldown: 5,
    scene: { place: 'home', mood: 'neutral' },
    when: { country: ['be'], age: [18, 95] },
    text: {
      fr: [
        "Tu reçois un courrier officiel. En en-tête : « Ceci n'est pas une facture. » En dessous : une facture. Signé : la commune.",
        "Le pays n'a pas de gouvernement depuis 400 jours. Tout fonctionne mieux. Tu reçois quand même une lettre de l'administration… mais de laquelle ? Il y en a six.",
      ],
      en: [
        "You get an official letter. Header: “This is not a bill.” Below that: a bill. Signed: the municipality.",
        "The country hasn't had a government for 400 days. Everything works better. You still get a letter from the administration… but which one? There are six.",
      ],
    },
    choices: [
      { label: { fr: 'Payer la non-facture', en: 'Pay the non-bill' }, text: { fr: "J'ai payé. On m'a renvoyé un reçu : « Ceci n'est pas un reçu. » J'ai encadré les deux. Magritte serait fier.", en: "I paid. They sent a receipt: “This is not a receipt.” I framed both. Magritte would be proud." }, fx: { money: -80, happy: 2, smarts: 1 } },
      { label: { fr: 'Répondre en surréaliste', en: 'Reply surreally' }, text: { fr: "J'ai répondu par un dessin de pipe et la mention « Ceci n'est pas un paiement ». J'ai reçu une médaille du mérite culturel. Personne ne sait pourquoi.", en: "I replied with a drawing of a pipe and the words “This is not a payment.” I received a cultural merit medal. No one knows why." }, fx: { happy: 6, fame: 2, smarts: 2 } },
      { label: { fr: "Ignorer", en: 'Ignore it' }, text: { fr: "J'ai ignoré la lettre. Elle a été traitée par la Région wallonne, rejetée par la Flandre, puis perdue à Bruxelles. Affaire classée.", en: "I ignored it. It was processed by Wallonia, rejected by Flanders, then lost in Brussels. Case closed." }, fx: { happy: 3 } },
    ],
  },

  // ═════════════════════════════ UNITED STATES ═════════════════════════════
  {
    id: 'ct_us_hospital', icon: '🧾', cat: 'world', rating: 2, weight: 9, cooldown: 6,
    scene: { place: 'hospital', mood: 'shock', fx: 'money' },
    when: { country: ['us'], age: [18, 90] },
    vars: { amount: [9000, 45000] },
    text: {
      fr: [
        "Tu t'es cassé un doigt en ouvrant un pot de cornichons. L'hôpital t'envoie la facture : {$amount}. Dont 40 $ pour « le mouchoir ».",
        "Ambulance de 6 minutes, deux radios, un paracétamol. Facture : {$amount}. Ton assurance couvre « l'envoi de la facture ».",
      ],
      en: [
        "You broke a finger opening a pickle jar. The hospital bill: {$amount}. Including $40 for “one (1) tissue.”",
        "A six-minute ambulance ride, two X-rays, one Tylenol. Bill: {$amount}. Your insurance covers “mailing the bill.”",
      ],
    },
    choices: [
      { label: { fr: 'Payer, en pleurant', en: 'Pay it, crying' }, text: { fr: "J'ai payé {$amount}. J'ai vendu mon sang pour me rembourser, puis on m'a facturé la prise de sang.", en: "I paid {$amount}. I sold my blood to cover it, then got billed for the blood draw." }, fx: { money: '-amount', happy: -8, stress: 8 } },
      { label: { fr: 'Lancer une cagnotte', en: 'Start a GoFundMe' }, out: [
        { w: 2, odds: { looks: 1 }, text: { fr: "J'ai lancé une cagnotte avec une photo triste de mon doigt. 900 inconnus ont payé ma facture. Merci l'Amérique, je crois ?", en: "I started a GoFundMe with a sad photo of my finger. 900 strangers paid my bill. Thanks, America? I think?" }, fx: { happy: 4, followers: 1500 } },
        { w: 2, text: { fr: "Ma cagnotte a récolté 35 $ et un commentaire « t'as qu'à bosser ». J'ai payé le reste en 400 mensualités.", en: "My GoFundMe raised $35 and a comment saying “get a job.” I'm paying the rest in 400 monthly installments." }, fx: { money: '-amount', happy: -6 } },
      ] },
      { label: { fr: 'Se soigner seul', en: 'Fix it myself' }, out: [
        { w: 1, text: { fr: "Je me suis remis le doigt en place avec du gaffer et une cuillère. Il pointe maintenant vers le nord en permanence. Économie : {$amount}.", en: "I reset my finger with duct tape and a spoon. It now permanently points north. Savings: {$amount}." }, fx: { health: -4, happy: 3 } },
        { w: 1, text: { fr: "J'ai voulu m'opérer moi-même en suivant un tuto. J'ai coupé le mauvais doigt. Il a giclé dans l'évier. L'hôpital m'a facturé le retrait du doigt du siphon.", en: "I tried to operate on myself using a YouTube tutorial. I cut off the wrong finger. It shot into the sink. The hospital billed me for retrieving it from the drain." }, fx: { health: -10, disease: 'missing_finger', money: -3000, visual: 'gore' }, mood: 'cry' },
      ] },
    ],
  },
  {
    id: 'ct_us_tipping', icon: '💳', cat: 'world', rating: 0, weight: 10, cooldown: 3,
    scene: { place: 'office', mood: 'neutral' },
    when: { country: ['us'], age: [14, 95] },
    text: {
      fr: [
        "Tu achètes une bouteille d'eau au comptoir. Le terminal se retourne vers toi : « Pourboire ? 25 % · 30 % · 40 % · Autre ». La caissière te fixe.",
        "Le distributeur automatique te propose un pourboire. Le DISTRIBUTEUR. Il y a même un émoji triste sur le bouton « Non ».",
      ],
      en: [
        "You're buying a bottle of water. The screen swivels toward you: “Tip? 25% · 30% · 40% · Custom.” The cashier is staring.",
        "The vending machine is asking for a tip. The VENDING MACHINE. There's even a sad face emoji on the “No” button.",
      ],
    },
    choices: [
      { label: { fr: 'Mettre 40 %', en: 'Tip 40%' }, text: { fr: "J'ai mis 40 % sur une bouteille d'eau. La caissière ne m'a même pas regardé{|e}. Je suis pauvre et invisible.", en: "I tipped 40% on a bottle of water. The cashier didn't even look at me. I'm broke and invisible." }, fx: { money: -15, karma: 2, happy: -1 } },
      { label: { fr: 'Appuyer sur « Non »', en: 'Press “No”' }, text: { fr: "J'ai appuyé sur « Non ». Le terminal a émis un son de déception. Toute la file a soupiré. J'en rêve encore la nuit.", en: "I pressed “No.” The screen made a disappointed sound. The whole line sighed. I still dream about it." }, fx: { stress: 5, karma: -1 } },
      { label: { fr: 'Exiger un pourboire', en: 'Ask THEM for a tip' }, text: { fr: "J'ai demandé à la caissière un pourboire pour mon excellent travail de client. Elle a ri. Puis elle m'a donné 1 $. Respect mutuel.", en: "I asked the cashier to tip me for my excellent customer work. She laughed. Then she gave me a dollar. Mutual respect." }, fx: { happy: 5, money: 1 } },
    ],
  },
  {
    id: 'ct_us_thanksgiving', icon: '🦃', cat: 'world', rating: 2, weight: 8, cooldown: 5,
    scene: { place: 'home', mood: 'shock', fx: 'fire' },
    when: { country: ['us'], age: [8, 90] },
    actor: 'family',
    text: {
      fr: [
        "Thanksgiving. {a.first} a décidé de faire frire une dinde entière de 11 kg dans une bassine d'huile, dans le garage, en tongs.",
        "Thanksgiving chez la famille. {a.first} sort la friteuse géante « comme à la télé ». La dinde est encore congelée.",
      ],
      en: [
        "Thanksgiving. {a.first} has decided to deep-fry a whole 25-pound turkey in a vat of oil, in the garage, wearing flip-flops.",
        "Thanksgiving with family. {a.first} wheels out the giant fryer “like on TV.” The turkey is still frozen.",
      ],
    },
    choices: [
      { label: { fr: 'Filmer pour TikTok', en: 'Film it' }, out: [
        { w: 2, text: { fr: "La dinde congelée a touché l'huile. Boule de feu de 4 mètres. {a.first} a perdu ses sourcils, la moitié du garage et toute crédibilité. Ma vidéo a fait 2 millions de vues.", en: "Frozen turkey hit hot oil. Twelve-foot fireball. {a.first} lost {a.his} eyebrows, half the garage and all credibility. My video got 2 million views." }, fx: { happy: 6, followers: 20000, fame: 4, rel: -5, visual: 'explosion' }, mood: 'shock' },
        { w: 1, text: { fr: "L'huile bouillante a giclé sur les pieds de {a.first}. Ses orteils ont fondu comme des marshmallows. On a mangé la dinde aux urgences. Elle était bonne, honnêtement.", en: "Boiling oil splashed on {a.first}'s feet. {a.His} toes melted like marshmallows. We ate the turkey in the ER waiting room. It was good, honestly." }, fx: { happy: -2, rel: -8, followers: 5000, visual: 'gore' }, mood: 'shock' },
      ] },
      { label: { fr: 'Appeler les pompiers', en: 'Call the fire dept.' }, text: { fr: "J'ai appelé les pompiers avant même qu'il allume le feu. Ils sont restés pour le repas. Le capitaine a découpé la dinde. Meilleur Thanksgiving.", en: "I called the fire department before he even lit the burner. They stayed for dinner. The captain carved the turkey. Best Thanksgiving ever." }, fx: { happy: 6, karma: 3, rel: -3 } },
      { label: { fr: 'Parler politique', en: 'Talk politics' }, text: { fr: "Pour détourner l'attention, j'ai lancé un sujet politique. La dinde a été épargnée. La famille, non. Oncle Bob dort chez nous, tante Linda a déménagé dans un autre État.", en: "To distract everyone, I brought up politics. The turkey was spared. The family wasn't. Uncle Bob is sleeping at ours, Aunt Linda moved to another state." }, fx: { happy: -4, stress: 8, rel: -10 }, mood: 'angry' },
    ],
  },
  {
    id: 'ct_us_roadtrip', icon: '🛣️', cat: 'world', rating: 2, weight: 8, once: true,
    scene: { place: 'park', mood: 'happy' },
    when: { country: ['us'], age: [18, 75] },
    text: {
      fr: [
        "Road trip sur la Route 66. Station-service perdue en Arizona : dans le même frigo, de la bière, des appâts vivants et des munitions. Le gérant te propose un fusil « offert pour l'achat d'un burrito ».",
        "En plein désert, une station-service vend des burritos, des feux d'artifice et des AR-15. Promo du jour : un fusil acheté, un hot-dog offert.",
      ],
      en: [
        "Route 66 road trip. Lonely gas station in Arizona: one fridge holds beer, live bait and ammo. The owner offers you a rifle “free with any burrito.”",
        "In the middle of the desert, a gas station sells burritos, fireworks and assault rifles. Today's deal: buy a rifle, get a free hot dog.",
      ],
    },
    choices: [
      { label: { fr: 'Juste le burrito', en: 'Just the burrito' }, out: [
        { w: 2, text: { fr: "J'ai pris le burrito. Il avait 4 jours et un goût de liberté. J'ai repris la route en chantant du Springsteen. Le meilleur trip de ma vie.", en: "I just got the burrito. It was four days old and tasted like freedom. Back on the road singing Springsteen. Best trip of my life." }, fx: { happy: 10 }, mood: 'happy' },
        { w: 1, text: { fr: "Le burrito m'a déclenché une diarrhée explosive en plein désert. 200 km sans toilettes. J'ai utilisé une boîte à gants. Je ne récupérerai pas la caution de la voiture de loc.", en: "The burrito triggered explosive diarrhea in the middle of the desert. 120 miles without a bathroom. I used the glovebox. I'm not getting the rental deposit back." }, fx: { health: -4, happy: -4, money: -500, visual: 'poop' }, mood: 'sick' },
      ] },
      { label: { fr: 'Prendre le fusil', en: 'Take the rifle' }, out: [
        { w: 1, text: { fr: "J'ai tiré sur une canette pour essayer. Le recul m'a renvoyé la crosse dans les dents. J'ai craché deux molaires dans la poussière. Le gérant a dit : « Bienvenue en Amérique. »", en: "I shot at a can to try it. The recoil slammed the stock into my teeth. I spat two molars into the dust. The owner said, “Welcome to America.”" }, fx: { health: -8, looks: -4, visual: 'gore' }, mood: 'cry' },
        { w: 1, text: { fr: "J'ai dégommé un cactus. Le cactus est tombé sur ma voiture de location. Puis un aigle a chié sur le capot. L'Amérique s'est exprimée.", en: "I blasted a cactus. The cactus fell on my rental car. Then a bald eagle shat on the hood. America has spoken." }, fx: { happy: 4, money: -800 }, mood: 'shock' },
      ] },
      { label: { fr: 'Fuir vers Vegas', en: 'Floor it to Vegas' }, text: { fr: "J'ai fui vers Las Vegas. J'ai perdu 300 $ au blackjack et gagné un mariage presque célébré par un sosie d'Elvis. J'ai dit non à temps.", en: "I floored it to Vegas. Lost $300 at blackjack and almost got married by an Elvis impersonator. Said no just in time." }, fx: { money: -300, happy: 6 } },
    ],
  },

  // ═════════════════════════════ UNITED KINGDOM ═════════════════════════════
  {
    id: 'ct_uk_queue', icon: '🧍', cat: 'world', rating: 0, weight: 10, cooldown: 3,
    scene: { place: 'park', mood: 'shock' },
    when: { country: ['uk'], age: [10, 95] },
    text: {
      fr: [
        "À l'arrêt de bus, tu t'es glissé{|e} devant sans le faire exprès. Douze Britanniques te fixent en silence. Quelqu'un fait « tsk ». C'est la guerre.",
        "Quelqu'un vient de griller la file devant toi au bureau de poste. Personne ne dit rien. Tout le monde souffre. Toi aussi.",
      ],
      en: [
        "At the bus stop, you accidentally stepped in front of the queue. Twelve Brits stare in silence. Someone tuts. This is war.",
        "Someone just jumped the queue in front of you at the post office. Nobody says anything. Everyone suffers. You too.",
      ],
    },
    choices: [
      { label: { fr: "S'excuser 9 fois", en: 'Apologise 9 times' }, text: { fr: "J'ai dit « sorry » neuf fois et je suis allé{|e} au bout de la file. La dame devant m'a offert un biscuit. On est fiancés, presque.", en: "I said sorry nine times and went to the back. The lady in front offered me a biscuit. We're basically engaged." }, fx: { karma: 3, happy: 2 } },
      { label: { fr: 'Soupirer très fort', en: 'Sigh very loudly' }, text: { fr: "J'ai soupiré tellement fort que le resquilleur a fait demi-tour. Toute la file m'a remercié{|e} d'un hochement de tête. J'ai été adoubé{|e} chevalier, socialement.", en: "I sighed so hard the queue-jumper turned back. The whole line thanked me with a nod. I've been socially knighted." }, fx: { happy: 6, fame: 1 } },
      { label: { fr: 'Dire quelque chose', en: 'Actually say something' }, text: { fr: "J'ai dit : « Excusez-moi, il y a une file. » Les gens m'ont regardé{|e} comme si j'avais crié dans une église. Le resquilleur est resté. Le malaise aussi.", en: "I said, “Excuse me, there's a queue.” People looked at me like I'd shouted in church. The jumper stayed. So did the awkwardness." }, fx: { stress: 4, karma: 1 } },
    ],
  },
  {
    id: 'ct_uk_rain_auto', icon: '🌧️', cat: 'world', rating: 0, auto: true, weight: 8, cooldown: 3,
    when: { country: ['uk'], age: [6, 95] },
    text: {
      fr: [
        "Il a plu 41 jours d'affilée. Quand le soleil est sorti dix minutes, tout le pays s'est mis en short et a attrapé un coup de soleil.",
        "Ma maison a été inondée. Les voisins sont venus aider avec 16 tasses de thé et zéro seau. Le thé règle tout, sauf l'eau.",
      ],
      en: [
        "It rained 41 days straight. When the sun came out for ten minutes, the entire country put on shorts and got sunburnt.",
        "My house flooded. The neighbours came to help with 16 cups of tea and zero buckets. Tea fixes everything except water.",
      ],
    },
    fx: { happy: -1, stress: -1 },
  },
  {
    id: 'ct_uk_royals', icon: '👑', cat: 'world', rating: 1, weight: 6, once: true,
    scene: { place: 'party', mood: 'shock' },
    when: { country: ['uk'], age: [18, 90] },
    text: {
      fr: [
        "Dans un pub de campagne, un type en veste de tweed bourré comme un coing t'annonce qu'il est 47e dans l'ordre de succession au trône. Il veut payer sa tournée.",
        "Un lord ivre mort s'écroule sur ta table au pub. Il prétend être le cousin du cousin d'un roi. Il a perdu son chauffeur et sa dignité.",
      ],
      en: [
        "At a country pub, a man in a tweed jacket, absolutely hammered, informs you he's 47th in line to the throne. He wants to buy a round.",
        "A blind-drunk lord collapses onto your table at the pub. He claims to be a king's cousin's cousin. He's lost his chauffeur and his dignity.",
      ],
    },
    choices: [
      { label: { fr: 'Faire la révérence', en: 'Curtsy / bow' }, text: { fr: "J'ai fait une révérence. Il m'a anobli{|e} avec une frite. Je me présente désormais comme « Sir/Dame de la table 6 ».", en: "I bowed. He knighted me with a chip. I now introduce myself as “of Table Six.”" }, fx: { happy: 6, fame: 1 } },
      { label: { fr: 'Le faire boire', en: 'Out-drink him' }, out: [
        { w: 2, text: { fr: "Tournée de pintes, de gin, puis de « liqueur de la famille ». Il m'a invité{|e} dans son château, où j'ai vomi dans une armure du XIVe siècle.", en: "Rounds of pints, gin, then “family liqueur.” He invited me to his castle, where I threw up inside a 14th-century suit of armour." }, fx: { happy: 8, health: -4, addiction: ['alcohol', 4] }, mood: 'party' },
        { w: 1, text: { fr: "Il tenait l'alcool comme quatre siècles d'aristocratie. Je me suis effondré{|e} sous la table. Il m'a laissé l'addition, en livres et en mépris.", en: "He held his drink like four centuries of aristocracy. I collapsed under the table. He left me the bill, in pounds and contempt." }, fx: { money: -180, health: -3 } },
      ] },
      { label: { fr: 'Parler des impôts', en: 'Ask about taxes' }, text: { fr: "Je lui ai demandé ce que la monarchie faisait de mes impôts. Il a répondu « des chapeaux » et s'est endormi. Réponse honnête, au moins.", en: "I asked what the monarchy does with my taxes. He said “hats” and fell asleep. Honest answer, at least." }, fx: { smarts: 2, happy: 3 } },
    ],
  },

  // ═════════════════════════════ CANADA ═════════════════════════════
  {
    id: 'ct_ca_moose', icon: '🫎', cat: 'world', rating: 2, weight: 7, cooldown: 8,
    scene: { place: 'park', mood: 'shock', fx: 'gore' },
    when: { country: ['ca'], age: [17, 85] },
    text: {
      fr: [
        "Route 117, de nuit. Un orignal de 600 kg traverse devant ta voiture. Il te regarde avec l'air de quelqu'un qui ne s'excusera pas.",
        "Sur l'autoroute transcanadienne, un orignal immense bloque la voie, derrière lui un camion-citerne de sirop d'érable arrive trop vite.",
      ],
      en: [
        "Highway 117, at night. A 1,300-pound moose steps in front of your car. It looks at you like it has no intention of apologizing.",
        "On the Trans-Canada, a giant moose blocks the lane. Behind it, a maple syrup tanker is coming way too fast.",
      ],
    },
    choices: [
      { label: { fr: 'Piler', en: 'Slam the brakes' }, out: [
        { w: 3, text: { fr: "J'ai pilé à un mètre de l'orignal. Il a léché mon pare-brise pendant dix minutes, puis il est reparti. Je crois qu'on est mariés maintenant.", en: "I stopped three feet from the moose. It licked my windshield for ten minutes, then left. I think we're married now." }, fx: { happy: 4, stress: 6 } },
        { w: 2, text: { fr: "Le camion de sirop d'érable m'a percuté par l'arrière. La citerne a explosé. J'ai été retrouvé{|e} caramélisé{|e} dans 30 000 litres de sirop, vivant{|e}, collant{|e} et délicieux{|e}.", en: "The maple tanker rear-ended me. It burst. I was found caramelized in 8,000 gallons of syrup — alive, sticky and delicious." }, fx: { health: -10, happy: -3, fame: 3, visual: 'explosion' }, mood: 'shock' },
      ] },
      { label: { fr: 'Klaxonner', en: 'Honk at it' }, out: [
        { w: 2, text: { fr: "J'ai klaxonné. L'orignal l'a pris personnellement et a chargé. Il a enfoncé la portière avec ses bois et m'a embroché la cuisse. J'ai saigné sur la banquette en m'excusant.", en: "I honked. The moose took it personally and charged. It rammed the door with its antlers and skewered my thigh. I bled all over the seat, apologizing." }, fx: { health: -15, visual: 'gore' }, mood: 'cry' },
        { w: 1, text: { fr: "J'ai klaxonné. L'orignal a traversé le pare-brise et s'est assis sur le siège passager. On a roulé 40 km ensemble. Il est mort. Moi aussi, presque.", en: "I honked. The moose came through the windshield and sat in the passenger seat. We drove 25 miles together. It died. I nearly did too." }, fx: { health: -25, loseAsset: 'car', visual: 'gore' }, mood: 'shock' },
        { w: 1, rating: 2, text: { fr: "L'orignal a chargé, ses bois ont arraché le toit, puis ma tête. Mes derniers mots ont été « sorry ».", en: "The moose charged, its antlers peeled the roof off, then my head. My last word was “sorry.”" }, fx: { die: { fr: "décapité{|e} par un orignal vexé", en: 'decapitated by an offended moose' }, visual: 'gore' } },
      ] },
      { label: { fr: "S'excuser auprès de lui", en: 'Apologize to it' }, text: { fr: "Je suis sorti{|e} m'excuser auprès de l'orignal. Il a hoché la tête et s'est poussé. Le Canada, c'est vraiment autre chose.", en: "I got out and apologized to the moose. It nodded and moved aside. Canada really is something else." }, fx: { karma: 4, happy: 5 } },
    ],
  },
  {
    id: 'ct_ca_sorry', icon: '🍁', cat: 'world', rating: 0, weight: 10, cooldown: 3,
    scene: { place: 'park', mood: 'happy' },
    when: { country: ['ca'], age: [8, 95] },
    actor: { create: { role: 'acquaintance', age: [-15, 15], gender: 'any' } },
    text: {
      fr: [
        "Devant le Tim Hortons, {a.first} te rentre dedans. Tu t'excuses. {a:Il|Elle} s'excuse. Tu t'excuses de t'être excusé{|e}. Ça fait 20 minutes.",
        "{a.first} t'écrase le pied dans le métro de {city}. Vous vous excusez en même temps. Puis encore. La tension monte, poliment.",
      ],
      en: [
        "Outside a Tim Hortons, {a.first} bumps into you. You say sorry. {a.He} says sorry. You apologize for apologizing. It's been 20 minutes.",
        "{a.first} steps on your foot on the {city} subway. You both apologize at once. Then again. The tension rises, politely.",
      ],
    },
    choices: [
      { label: { fr: "S'excuser une dernière fois", en: 'One last sorry' }, text: { fr: "J'ai dit « désolé{|e} » une 31e fois. {a.first} a craqué en premier. J'ai gagné. On est amis maintenant, désolé.", en: "I said sorry a 31st time. {a.first} cracked first. I won. We're friends now, sorry." }, fx: { happy: 5, rel: 15, keep: true, actorRole: 'friend' } },
      { label: { fr: 'Offrir un café', en: 'Buy {a.him} a coffee' }, text: { fr: "J'ai offert un double-double à {a.first} pour clore l'incident. {a:Il|Elle} m'a offert un Timbits pour clore le café. Ça dure encore.", en: "I bought {a.first} a double-double to settle it. {a.He} bought me Timbits to settle the coffee. It's still going." }, fx: { money: -5, karma: 2, rel: 10, keep: true, actorRole: 'friend' } },
      { label: { fr: 'Ne PAS s\'excuser', en: "DON'T apologize" }, text: { fr: "J'ai refusé de m'excuser. Une Mountie à cheval est apparue de nulle part et m'a regardé{|e} avec déception. Juste regardé{|e}. C'était pire qu'une amende.", en: "I refused to apologize. A Mountie on horseback appeared from nowhere and looked at me with disappointment. Just looked. Worse than a fine." }, fx: { karma: -3, stress: 5 } },
    ],
  },
  {
    id: 'ct_ca_hockey', icon: '🏒', cat: 'world', rating: 2, weight: 8, cooldown: 4,
    scene: { place: 'stadium', mood: 'angry', fx: 'gore' },
    when: { country: ['ca'], age: [16, 60] },
    text: {
      fr: [
        "Match de hockey amateur du mardi soir, ligue « Bière & Bandages ». Un gars de l'équipe adverse jette ses gants. Il veut se battre.",
        "Tournoi de hockey du quartier. Un défenseur de 130 kg te colle contre la bande et te traite de « mangeux de poutine pas d'sauce ».",
      ],
      en: [
        "Tuesday night beer league hockey. A guy on the other team drops his gloves. He wants to fight.",
        "Neighborhood hockey tournament. A 290-pound defenseman pins you to the boards and calls you a “gravy-less poutine.”",
      ],
    },
    choices: [
      { label: { fr: 'Jeter les gants', en: 'Drop the gloves' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: "Je lui ai tiré le chandail sur la tête et je l'ai martelé comme un ragoût. Après le match, on a bu une bière ensemble et il m'a demandé{|e} en amitié.", en: "I pulled his jersey over his head and pounded him like stew meat. After the game we had a beer and he asked to be friends." }, fx: { happy: 8, athletic: 3, fame: 2 }, mood: 'proud' },
        { w: 2, text: { fr: "Il m'a mis une droite. Trois dents ont glissé sur la glace jusqu'au filet. L'arbitre a accordé le but. J'ai saigné jusqu'à la Zamboni.", en: "He landed a right hook. Three teeth slid across the ice into the net. The ref counted the goal. I bled all the way to the Zamboni." }, fx: { health: -10, looks: -5, visual: 'gore' }, mood: 'cry' },
      ] },
      { label: { fr: 'Patiner loin', en: 'Skate away' }, text: { fr: "J'ai patiné à l'opposé. Il m'a poursuivi{|e} pendant toute la troisième période. Meilleur entraînement cardio de ma vie.", en: "I skated the other way. He chased me through the entire third period. Best cardio of my life." }, fx: { athletic: 4, happy: -2 } },
      { label: { fr: 'Lui offrir du sirop', en: 'Offer him maple syrup' }, text: { fr: "Je lui ai tendu une petite bouteille de sirop d'érable. Il s'est mis à pleurer en parlant de sa grand-mère. On a arrêté le match pour un câlin collectif.", en: "I handed him a little bottle of maple syrup. He started crying about his grandmother. The game stopped for a group hug." }, fx: { karma: 4, happy: 5 } },
    ],
  },

  // ═════════════════════════════ JAPAN ═════════════════════════════
  {
    id: 'ct_jp_train', icon: '🚃', cat: 'world', rating: 1, weight: 10, cooldown: 3,
    scene: { place: 'office', mood: 'shock' },
    when: { country: ['jp'], age: [13, 75] },
    text: {
      fr: [
        "Métro de Tokyo, 8 h 12. Un employé en gants blancs te pousse dans un wagon déjà plein. Ton visage est collé à l'aisselle d'un salaryman.",
        "Heure de pointe sur la ligne Yamanote. Tu ne touches plus le sol. Tes pieds sont quelque part, tes chaussures ailleurs.",
      ],
      en: [
        "Tokyo subway, 8:12 a.m. A man in white gloves shoves you into an already full car. Your face is pressed into a salaryman's armpit.",
        "Rush hour on the Yamanote line. Your feet aren't touching the floor. Your shoes are somewhere else entirely.",
      ],
    },
    choices: [
      { label: { fr: 'Dormir debout', en: 'Sleep standing up' }, text: { fr: "J'ai dormi debout, soutenu{|e} par 40 inconnus. Le trajet le plus reposant de ma vie. Je me suis réveillé{|e} au terminus, à Chiba.", en: "I slept upright, held up by 40 strangers. The most restful commute of my life. I woke up at the end of the line, in Chiba." }, fx: { happy: 3, health: 2 } },
      { label: { fr: 'Retenir son souffle', en: 'Hold my breath' }, out: [
        { w: 2, text: { fr: "J'ai retenu mon souffle sept stations. J'ai vu la lumière, mon arrière-grand-mère et une pub pour du thé vert. Puis Shinjuku.", en: "I held my breath for seven stops. I saw the light, my great-grandmother and an ad for green tea. Then Shinjuku." }, fx: { health: -2, stress: 5 } },
        { w: 1, text: { fr: "Quelqu'un a pété dans le wagon. Personne n'a réagi. 300 personnes ont souffert en silence, avec dignité. Un vrai moment de cohésion nationale.", en: "Someone farted in the car. Nobody reacted. Three hundred people suffered in silence, with dignity. A true moment of national unity." }, fx: { happy: -3, stress: 3 }, mood: 'sick' },
      ] },
      { label: { fr: 'Prendre un taxi', en: 'Take a taxi' }, text: { fr: "J'ai pris un taxi. Le chauffeur avait des gants blancs, des napperons en dentelle sur les sièges et un compteur qui tournait plus vite que mon cœur.", en: "I took a taxi. White gloves, lace doilies on the seats, and a meter spinning faster than my heart." }, fx: { money: -60, happy: 2 } },
    ],
  },
  {
    id: 'ct_jp_karaoke', icon: '🎤', cat: 'world', rating: 1, weight: 9, cooldown: 3,
    scene: { place: 'party', mood: 'party' },
    when: { country: ['jp'], age: [20, 70], job: true },
    actor: 'boss',
    text: {
      fr: [
        "Nomikai avec l'équipe. Après la troisième bière, {a.first}, ton boss, te tend le micro du karaoké. Tout le monde scande ton nom. Pas d'échappatoire.",
        "Box de karaoké, 1 h du matin. {a.first} vient de chanter « My Way » en pleurant. C'est ton tour, et le classement compte pour ta prime.",
      ],
      en: [
        "Team drinking party. After the third beer, {a.first}, your boss, hands you the karaoke mic. Everyone chants your name. No escape.",
        "Karaoke booth, 1 a.m. {a.first} just sang “My Way” in tears. Your turn — and the scores count toward your bonus.",
      ],
    },
    choices: [
      { label: { fr: 'Chanter une ballade', en: 'Sing a power ballad' }, out: [
        { w: 2, odds: { looks: 0.5 }, text: { fr: "J'ai chanté du Céline Dion avec tellement d'âme que {a.first} m'a pris{|e} dans ses bras. 98 points. Promotion probable, dignité perdue.", en: "I sang Céline Dion with so much soul that {a.first} hugged me. 98 points. Promotion likely, dignity gone." }, fx: { happy: 8, perf: 10, rel: 10 }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai attaqué trop haut. Ma voix a fait un bruit de chat qu'on écrase. La machine m'a donné 12 points et une animation de lapin qui pleure.", en: "I started too high. My voice made a stepped-on-cat noise. The machine gave me 12 points and an animation of a crying bunny." }, fx: { happy: -4, perf: -3 } },
      ] },
      { label: { fr: 'Duo avec le boss', en: 'Duet with the boss' }, text: { fr: "J'ai fait un duo avec {a.first}. On a fini à genoux, chemises ouvertes, à hurler du J-pop. Lundi, au bureau, personne n'en a jamais reparlé. C'est la règle.", en: "I did a duet with {a.first}. We ended up on our knees, shirts open, screaming J-pop. On Monday, nobody ever mentioned it again. That's the rule." }, fx: { happy: 6, rel: 15, perf: 5, health: -2 } },
      { label: { fr: "Faire semblant d'être malade", en: 'Fake being sick' }, text: { fr: "J'ai simulé une gastro. On m'a mis dans un taxi avec un sac en plastique et une boîte de bonbons à la prune. J'ai eu honte toute la semaine.", en: "I faked food poisoning. They put me in a cab with a plastic bag and a box of plum candies. I felt guilty all week." }, fx: { perf: -5, stress: 3 } },
    ],
  },
  {
    id: 'ct_jp_overwork', icon: '💼', cat: 'world', rating: 2, weight: 8, cooldown: 4,
    scene: { place: 'office', mood: 'sleepy' },
    when: { country: ['jp'], age: [20, 70], job: true },
    text: {
      fr: [
        "22 h 40. Personne ne part avant le chef, et le chef ne part jamais. Tu soupçonnes qu'il vit dans le placard à fournitures.",
        "Ton bureau organise une « semaine de détente obligatoire » : 70 heures de travail, mais avec de la musique douce.",
      ],
      en: [
        "10:40 p.m. Nobody leaves before the boss, and the boss never leaves. You suspect he lives in the supply closet.",
        "Your office is holding a “mandatory relaxation week”: 70 hours of work, but with soft music.",
      ],
    },
    choices: [
      { label: { fr: 'Rester encore', en: 'Stay late again' }, out: [
        { w: 3, text: { fr: "Je suis resté{|e} jusqu'à 3 h. J'ai dormi sous mon bureau, dans une capsule en carton. Le chef m'a félicité{|e} d'un hochement de tête. Le plus beau jour de ma vie.", en: "I stayed until 3 a.m. Slept under my desk in a cardboard pod. The boss acknowledged me with a nod. Best day of my life." }, fx: { perf: 10, health: -5, stress: 10 }, mood: 'sleepy' },
        { w: 1, text: { fr: "Mon cœur a lâché à 4 h du mat devant Excel. Le chef a enjambé mon corps pour aller aux toilettes. Ils ont attendu la fin du trimestre pour me déclarer décédé{|e}.", en: "My heart gave out at 4 a.m. in front of Excel. The boss stepped over my body to get to the bathroom. They waited until end of quarter to declare me dead." }, fx: { die: { fr: "d'épuisement devant un tableur, à 4 h du matin", en: 'of exhaustion in front of a spreadsheet at 4 a.m.' } } },
      ] },
      { label: { fr: 'Partir à 18 h', en: 'Leave at 6 p.m.' }, text: { fr: "Je suis parti{|e} à 18 h pile. Le silence dans l'open space était si lourd qu'une plante verte est morte. J'ai été affecté{|e} au service « archives papier » du sous-sol.", en: "I left at 6 p.m. sharp. The silence in the office was so heavy a houseplant died. I've been reassigned to “paper archives” in the basement." }, fx: { happy: 6, perf: -10, stress: -5 } },
      { label: { fr: 'Dormir les yeux ouverts', en: 'Sleep with eyes open' }, text: { fr: "J'ai appris à dormir les yeux ouverts devant mon écran. Je me suis fait des yeux tellement secs qu'ils ont crissé quand je clignais. Mais le chef est content.", en: "I learned to sleep with my eyes open at my desk. My eyeballs got so dry they squeaked when I blinked. But the boss is pleased." }, fx: { perf: 5, health: -3, looks: -2 } },
    ],
  },
  {
    id: 'ct_jp_quake', icon: '🌋', cat: 'world', rating: 0, weight: 9, cooldown: 4,
    scene: { place: 'school', mood: 'shock' },
    when: { country: ['jp'], age: [6, 90] },
    text: {
      fr: [
        "Exercice de séisme. Tout le monde enfile un casque, se met sous la table et compte calmement. Puis la terre tremble vraiment. Personne ne change d'expression.",
        "Ton téléphone hurle « ALERTE SÉISME ». Autour de toi, les gens continuent de manger leurs nouilles en posant juste la main sur leur bol.",
      ],
      en: [
        "Earthquake drill. Everyone puts on a helmet, gets under the table and counts calmly. Then the ground actually shakes. Nobody changes expression.",
        "Your phone screams “EARTHQUAKE ALERT.” Around you, people keep eating noodles, just placing a hand on their bowl.",
      ],
    },
    choices: [
      { label: { fr: 'Sous la table', en: 'Under the table' }, text: { fr: "Je me suis mis{|e} sous la table, casque sur la tête, kit de survie sous le bras. On m'a félicité{|e} pour ma « forme exemplaire ». J'ai eu un diplôme.", en: "I got under the table, helmet on, survival kit under my arm. I was praised for my “exemplary form.” I got a certificate." }, fx: { happy: 3, discipline: 3 } },
      { label: { fr: 'Paniquer', en: 'Panic' }, text: { fr: "J'ai hurlé et couru en rond. Une mamie de 84 ans m'a calmement attrapé{|e} par le col et m'a assis{|e} sous une table. J'ai honte jusqu'à Osaka.", en: "I screamed and ran in circles. An 84-year-old granny calmly grabbed my collar and sat me under a table. My shame reaches Osaka." }, fx: { stress: 6, happy: -3 } },
      { label: { fr: 'Finir ses nouilles', en: 'Finish my noodles' }, text: { fr: "J'ai fini mes nouilles en tenant le bol. Magnitude 5,8. Pas une goutte de bouillon renversée. Je suis devenu{|e} japonais{|e} de l'intérieur.", en: "I finished my noodles holding the bowl. Magnitude 5.8. Not a drop of broth spilled. I've become Japanese on the inside." }, fx: { happy: 5 } },
    ],
  },

  // ═════════════════════════════ SPAIN ═════════════════════════════
  {
    id: 'ct_es_siesta', icon: '😴', cat: 'world', rating: 0, weight: 10, cooldown: 3,
    scene: { place: 'home', mood: 'sleepy' },
    when: { country: ['es'], age: [10, 95] },
    text: {
      fr: [
        "14 h 30 à {city}. Tu dois acheter une ampoule. Tout est fermé. Même le chat de la rue fait la sieste, sur la porte du magasin.",
        "Il fait 43 °C et c'est l'heure de la sieste. Ton voisin, lui, a choisi ce moment pour percer un mur. En chantant.",
      ],
      en: [
        "2:30 p.m. in {city}. You need a lightbulb. Everything's closed. Even the street cat is napping, on the shop doorstep.",
        "It's 109 °F and siesta time. Your neighbor chose this exact moment to drill into a wall. While singing.",
      ],
    },
    choices: [
      { label: { fr: 'Faire la sieste aussi', en: 'Nap too' }, text: { fr: "J'ai fait une sieste de 3 heures. Je me suis réveillé{|e} à 18 h sans savoir quelle année on était. Dîner à 23 h. Coucher à 2 h. Le mode de vie parfait.", en: "I took a three-hour siesta. Woke up at 6 p.m. not knowing what year it was. Dinner at 11 p.m. Bed at 2 a.m. The perfect lifestyle." }, fx: { happy: 6, health: 3, stress: -6 } },
      { label: { fr: 'Frapper chez le voisin', en: "Knock on the neighbor's" }, text: { fr: "Je suis allé{|e} me plaindre. Le voisin m'a servi un jambon pata negra et un verre de rioja. Je suis rentré{|e} à 21 h, sans ampoule, mais heureux{|se}.", en: "I went to complain. The neighbor served me pata negra ham and a glass of Rioja. I got home at 9 p.m., no lightbulb, but happy." }, fx: { happy: 7, weight: 0.01 } },
      { label: { fr: 'Travailler quand même', en: 'Work through it' }, text: { fr: "J'ai voulu être productif{|ve} pendant la sieste. J'ai envoyé 12 e-mails. Personne n'a répondu avant le lendemain 11 h. Leçon apprise.", en: "I tried being productive during siesta. I sent 12 emails. Nobody replied until 11 a.m. the next day. Lesson learned." }, fx: { stress: 4, discipline: 2 } },
    ],
  },
  {
    id: 'ct_es_tomatina', icon: '🍅', cat: 'world', rating: 2, weight: 7, once: true,
    scene: { place: 'park', mood: 'party', fx: 'gore' },
    when: { country: ['es'], age: [16, 70] },
    text: {
      fr: [
        "La Tomatina de Buñol. 20 000 personnes, 120 tonnes de tomates, zéro règle. Un camion vient de déverser une montagne rouge à tes pieds.",
        "Bataille de tomates géante. Tout le monde ressemble à une scène de crime. Un costaud en lunettes de piscine te vise.",
      ],
      en: [
        "La Tomatina in Buñol. 20,000 people, 130 tons of tomatoes, zero rules. A truck just dumped a red mountain at your feet.",
        "Giant tomato fight. Everyone looks like a crime scene. A big guy in swimming goggles is aiming at you.",
      ],
    },
    choices: [
      { label: { fr: 'Foncer dans la mêlée', en: 'Charge into the melee' }, out: [
        { w: 2, text: { fr: "J'ai lancé, reçu, glissé, nagé dans la purée. Je suis ressorti{|e} rouge de la tête aux pieds, avec des pépins jusque dans des endroits intimes. Le pied total.", en: "I threw, got hit, slipped, swam through pulp. I came out red head to toe, with seeds in very private places. Absolute bliss." }, fx: { happy: 10, health: -1 }, mood: 'party' },
        { w: 1, text: { fr: "Une tomate verte m'a percuté l'œil à 90 km/h. Il a gonflé comme un ballon et a éclaté en jus. Les secouristes ne savaient pas quelle partie de moi était de la tomate.", en: "An unripe tomato hit my eye at 55 mph. It swelled like a balloon and burst into juice. The medics couldn't tell which part of me was tomato." }, fx: { health: -12, looks: -6, visual: 'gore' }, mood: 'cry' },
      ] },
      { label: { fr: 'Se cacher derrière un mur', en: 'Hide behind a wall' }, text: { fr: "Je me suis planqué{|e} dans une ruelle. Un camion entier s'est vidé sur moi. J'ai été enseveli{|e} vivant{|e} sous une sauce bolognaise brute. On m'a dégagé{|e} à la pelle.", en: "I hid in an alley. An entire truck unloaded on me. I was buried alive in raw marinara. They dug me out with a shovel." }, fx: { happy: 2, health: -4, stress: 6 }, mood: 'shock' },
      { label: { fr: 'Manger les munitions', en: 'Eat the ammo' }, text: { fr: "J'ai mangé les tomates au lieu de les lancer. J'avais juste apporté du sel et du pain. Les gens m'ont regardé{|e} comme un génie ou un psychopathe.", en: "I ate the tomatoes instead of throwing them. I'd brought salt and bread. People looked at me like a genius or a psychopath." }, fx: { happy: 5, health: 2 } },
    ],
  },
  {
    id: 'ct_es_flamenco', icon: '💃', cat: 'world', rating: 1, weight: 8, cooldown: 5,
    scene: { place: 'studio', mood: 'love' },
    when: { country: ['es'], age: [18, 75] },
    actor: { create: { role: 'acquaintance', age: [-8, 12], gender: 'attracted' } },
    text: {
      fr: [
        "Cours de flamenco à Séville. {a.first}, ton prof, frappe du talon comme on fend des bûches et te regarde droit dans l'âme. « Más pasión. »",
        "Dans une cave de Grenade, {a.first} danse le flamenco à deux centimètres de ton visage. {a:Il|Elle} te tend la main.",
      ],
      en: [
        "Flamenco class in Seville. {a.first}, your teacher, stamps like {a.he}'s splitting logs and stares into your soul. “Más pasión.”",
        "In a cellar in Granada, {a.first} dances flamenco two inches from your face, then holds out a hand.",
      ],
    },
    choices: [
      { label: { fr: 'Mettre de la passion', en: 'Bring the passion' }, out: [
        { w: 2, text: { fr: "J'ai tapé du pied avec tant de passion que le parquet a cédé. {a.first} m'a rattrapé{|e} dans ses bras. On a fini la soirée beaucoup moins habillés et beaucoup plus proches.", en: "I stamped with so much passion the floorboards gave way. {a.first} caught me. The night ended with far fewer clothes and far less distance." }, fx: { happy: 10, rel: 25, keep: true, actorRole: 'partner' }, mood: 'love' },
        { w: 1, text: { fr: "J'ai voulu claquer des castagnettes, je me suis pincé le téton avec. Sous les yeux de 14 élèves. Olé.", en: "I tried to snap castanets and pinched my own nipple with them. In front of 14 students. Olé." }, fx: { happy: -3, health: -1 } },
      ] },
      { label: { fr: 'Rester au fond', en: 'Stay at the back' }, text: { fr: "Je suis resté{|e} au fond et j'ai claqué des mains à contretemps. {a.first} m'a appelé{|e} « la patate » pendant deux mois.", en: "I stayed at the back clapping off-beat. {a.first} called me “the potato” for two months." }, fx: { happy: 2, athletic: 2 } },
    ],
  },

  // ═════════════════════════════ ITALY ═════════════════════════════
  {
    id: 'ct_it_nonna', icon: '👵', cat: 'world', rating: 0, weight: 10, cooldown: 3,
    scene: { place: 'home', mood: 'happy' },
    when: { country: ['it'], age: [5, 80] },
    text: {
      fr: [
        "Déjeuner du dimanche chez Nonna. Tu en es à ta quatrième assiette de lasagnes. Elle te demande, inquiète, si tu es malade : tu n'as pas fini le pain.",
        "Nonna dépose une cinquième assiette devant toi. « Mangia, mangia, t'es tout maigre ! » Tu ne peux plus fermer ton pantalon.",
      ],
      en: [
        "Sunday lunch at Nonna's. You're on your fourth plate of lasagna. She asks, worried, if you're sick: you didn't finish the bread.",
        "Nonna puts a fifth plate in front of you. “Mangia, mangia, you're skin and bones!” You can no longer close your pants.",
      ],
    },
    choices: [
      { label: { fr: 'Manger, toujours', en: 'Keep eating' }, text: { fr: "J'ai mangé. Puis il y a eu le secondo, le fromage, le tiramisu et un limoncello « pour digérer ». J'ai dormi sur le canapé jusqu'au mardi.", en: "I ate. Then came the second course, cheese, tiramisu and a limoncello “for digestion.” I slept on the couch until Tuesday." }, fx: { happy: 8, weight: 0.04, health: -1 } },
      { label: { fr: 'Dire non merci', en: 'Say no thanks' }, text: { fr: "J'ai dit « non merci, j'ai plus faim ». Nonna s'est signée, a appelé le curé et trois tantes. J'ai fini par manger pour qu'elle arrête de pleurer.", en: "I said “no thanks, I'm full.” Nonna crossed herself, called the priest and three aunts. I ate so she'd stop crying." }, fx: { weight: 0.03, stress: 4 } },
      { label: { fr: 'Demander la recette', en: 'Ask for the recipe' }, text: { fr: "J'ai demandé la recette. Nonna a souri : « Un peu de ci, un peu de ça, tu sens. » J'ai rien compris, mais elle m'a mis dans son testament.", en: "I asked for the recipe. Nonna smiled: “A bit of this, a bit of that, you feel it.” I learned nothing, but she put me in her will." }, fx: { happy: 5, smarts: 1, karma: 2 } },
    ],
  },
  {
    id: 'ct_it_pasta', icon: '🍝', cat: 'world', rating: 2, weight: 8, cooldown: 5,
    scene: { place: 'home', mood: 'angry' },
    when: { country: ['it'], age: [14, 85] },
    text: {
      fr: [
        "Tu cuisines pour ta belle-famille italienne. Le paquet de spaghettis ne rentre pas dans la casserole. Toute la tablée te regarde. Tu tiens les pâtes à deux mains.",
        "Tu prépares une carbonara pour des amis romains. Dans ton panier : de la crème fraîche, des lardons et du ketchup. Ils ne savent pas encore.",
      ],
      en: [
        "You're cooking for your Italian in-laws. The spaghetti won't fit in the pot. The whole table is watching. You're holding the pasta with both hands.",
        "You're making carbonara for Roman friends. In your basket: heavy cream, bacon bits and ketchup. They don't know yet.",
      ],
    },
    choices: [
      { label: { fr: 'Casser les spaghettis', en: 'Snap the spaghetti' }, text: { fr: "CRAC. Un oncle a fait un malaise. La grand-mère m'a lancé une cuillère en bois qui m'a ouvert l'arcade. J'ai pissé le sang dans la sauce. Ils ont dit que c'était la meilleure partie du plat.", en: "SNAP. An uncle fainted. Grandma threw a wooden spoon that split my eyebrow open. I bled into the sauce. They said it was the best part of the dish." }, fx: { health: -6, happy: -4, visual: 'gore' }, mood: 'shock' },
      { label: { fr: 'Mettre de la crème', en: 'Add the cream' }, text: { fr: "J'ai versé la crème. Un Romain a hurlé « PORCA MISERIA » et a jeté ma casserole par la fenêtre. Elle a assommé un pigeon. Le pigeon, lui, a apprécié.", en: "I poured in the cream. A Roman screamed “PORCA MISERIA” and threw my pot out the window. It knocked out a pigeon. The pigeon enjoyed it." }, fx: { happy: -3, karma: -1 }, mood: 'angry' },
      { label: { fr: 'Laisser la nonna faire', en: 'Let nonna take over' }, text: { fr: "J'ai rendu le tablier. Nonna a cuisiné en marmonnant des jurons siciliens à faire rougir un docker. C'était divin. Elle m'interdit sa cuisine à vie.", en: "I surrendered the apron. Nonna cooked while muttering Sicilian curses that would make a sailor blush. It was divine. I'm banned from her kitchen for life." }, fx: { happy: 6, smarts: 1 } },
    ],
  },
  {
    id: 'ct_it_scooter', icon: '🛵', cat: 'world', rating: 2, weight: 8, cooldown: 6,
    scene: { place: 'park', mood: 'shock', fx: 'gore' },
    when: { country: ['it'], age: [16, 80] },
    text: {
      fr: [
        "Rome, 18 h. Tu as loué une Vespa « pour faire comme dans les films ». Devant toi, un rond-point avec 400 scooters, trois bus et un prêtre en Fiat 500.",
        "En Vespa dans Naples. Le code de la route est une « suggestion poétique ». Un livreur te frôle en klaxonnant un air d'opéra.",
      ],
      en: [
        "Rome, 6 p.m. You rented a Vespa “like in the movies.” Ahead: a roundabout with 400 scooters, three buses and a priest in a Fiat 500.",
        "Riding a Vespa through Naples. Traffic laws are a “poetic suggestion.” A delivery guy brushes past, honking an opera tune.",
      ],
    },
    choices: [
      { label: { fr: 'Rouler à l\'italienne', en: 'Ride like a local' }, out: [
        { w: 2, odds: { athletic: 0.5 }, text: { fr: "J'ai klaxonné, gesticulé d'une main, grillé trois feux. Les Romains m'ont applaudi{|e}. Pour la première fois, je me suis senti{|e} vivant{|e}.", en: "I honked, gestured with one hand, ran three lights. The Romans applauded. For the first time, I felt alive." }, fx: { happy: 10, stress: -3 }, mood: 'happy' },
        { w: 1, text: { fr: "J'ai gesticulé au mauvais moment et je suis rentré{|e} dans la fontaine de Trevi à 60 km/h. J'ai laissé deux dents, un bout d'oreille et une traînée rouge dans l'eau. Les touristes ont jeté des pièces sur moi.", en: "I gestured at the wrong moment and hit the Trevi Fountain at 40 mph. I left two teeth, a bit of ear and a red streak in the water. Tourists threw coins at me." }, fx: { health: -15, looks: -5, money: 12, visual: 'gore' }, mood: 'cry' },
        { w: 1, text: { fr: "Un bus m'a fait un « tap » amical. Mon corps a fait trois tours sur la piazza et s'est replié dans le mauvais sens. Le chauffeur a fait un geste de la main, pas pour s'excuser.", en: "A bus gave me a friendly “tap.” My body spun three times across the piazza and folded the wrong way. The driver made a hand gesture, not an apology." }, fx: { die: { fr: 'plié{|e} en deux par un bus romain', en: 'folded in half by a Roman bus' }, visual: 'gore' } },
      ] },
      { label: { fr: 'Rendre la Vespa', en: 'Return the Vespa' }, text: { fr: "J'ai rendu la Vespa et pris un taxi. Le chauffeur roulait encore plus vite, en parlant au téléphone avec les deux mains. J'ai prié en latin.", en: "I returned the Vespa and took a taxi. The driver went even faster, on the phone, using both hands to talk. I prayed in Latin." }, fx: { money: -40, stress: 6 } },
    ],
  },
  {
    id: 'ct_it_hands_auto', icon: '🤌', cat: 'world', rating: 1, auto: true, weight: 7, cooldown: 4,
    when: { country: ['it'], age: [12, 90] },
    text: {
      fr: [
        "Je me suis cassé les deux poignets. Pendant six semaines, je n'ai plus pu parler. Ma famille a cru que j'étais en dépression.",
        "J'ai fait le geste « mais qu'est-ce que tu veux ? » à un automobiliste. Il a répondu par un geste beaucoup moins poli, avec les deux mains et un coude.",
      ],
      en: [
        "I broke both wrists. For six weeks, I literally couldn't talk. My family thought I was depressed.",
        "I gave a driver the “what do you want?” pinched-fingers gesture. He replied with a much less polite one, using both hands and an elbow.",
      ],
    },
    fx: { happy: -2, fame: 1 },
  },

  // ═════════════════════════════ GERMANY ═════════════════════════════
  {
    id: 'ct_de_late', icon: '⏰', cat: 'world', rating: 0, weight: 9, cooldown: 4,
    scene: { place: 'office', mood: 'shock' },
    when: { country: ['de'], age: [14, 85] },
    text: {
      fr: [
        "Tu arrives à un dîner à Munich avec 4 minutes de retard. Les hôtes sont déjà en train de débarrasser. L'un d'eux a les larmes aux yeux.",
        "La Deutsche Bahn annonce 2 minutes de retard. Autour de toi, les passagers vivent une crise existentielle. Un homme appelle sa mère.",
      ],
      en: [
        "You show up to a dinner in Munich four minutes late. The hosts are already clearing the table. One of them has tears in his eyes.",
        "The train announces a two-minute delay. Around you, passengers are having an existential crisis. A man calls his mother.",
      ],
    },
    choices: [
      { label: { fr: 'Rédiger des excuses', en: 'Write an apology' }, text: { fr: "J'ai envoyé une lettre d'excuses formelle, avec accusé de réception. On m'a répondu en trois exemplaires. Je suis réinvité{|e}, à l'essai.", en: "I sent a formal apology letter, certified mail. They replied in triplicate. I'm re-invited, on probation." }, fx: { discipline: 4, happy: 1 } },
      { label: { fr: 'Arriver en avance', en: 'Show up early next time' }, text: { fr: "La fois suivante, je suis arrivé{|e} 20 minutes en avance. C'était aussi mal vu. Il fallait attendre dans la voiture jusqu'à l'heure exacte. J'apprends.", en: "Next time I arrived 20 minutes early. Also frowned upon. You're supposed to wait in the car until the exact minute. I'm learning." }, fx: { discipline: 3, stress: 2 } },
      { label: { fr: 'Accuser la Deutsche Bahn', en: 'Blame the train' }, text: { fr: "J'ai accusé la Deutsche Bahn. Tout le monde a hoché la tête, compatissant. C'est la seule excuse acceptée dans tout le pays.", en: "I blamed Deutsche Bahn. Everyone nodded sympathetically. It's the only excuse accepted nationwide." }, fx: { happy: 4 } },
    ],
  },
  {
    id: 'ct_de_oktoberfest', icon: '🥨', cat: 'world', rating: 1, weight: 9, cooldown: 3,
    scene: { place: 'party', mood: 'party' },
    when: { country: ['de'], age: [16, 85] },
    text: {
      fr: [
        "Oktoberfest, sous une tente de 8 000 places. Une serveuse porte 12 chopes d'un litre sans transpirer. Elle en pose une devant toi. Prosit !",
        "Tu es en culotte de cuir à l'Oktoberfest. La fanfare joue la même chanson pour la 46e fois. Tout le monde monte sur les bancs.",
      ],
      en: [
        "Oktoberfest, inside an 8,000-seat tent. A waitress carries twelve one-liter steins without breaking a sweat. She sets one in front of you. Prost!",
        "You're in lederhosen at Oktoberfest. The brass band plays the same song for the 46th time. Everyone climbs on the benches.",
      ],
    },
    choices: [
      { label: { fr: 'Une Maß, tranquille', en: 'One stein, chill' }, text: { fr: "Une chope, un bretzel grand comme un volant, un demi-poulet. J'ai trinqué avec 40 inconnus. J'ai appris trois chansons dont je ne connais pas le sens.", en: "One stein, a pretzel the size of a steering wheel, half a chicken. I toasted with 40 strangers. I learned three songs I don't understand." }, fx: { happy: 7, weight: 0.01 } },
      { label: { fr: 'Suivre les locaux', en: 'Keep up with locals' }, out: [
        { w: 2, text: { fr: "Six litres. J'ai dansé sur la table, embrassé un Bavarois moustachu et perdu une chaussure dans un tuba. Le meilleur jour de l'année.", en: "Six liters. I danced on the table, kissed a mustachioed Bavarian and lost a shoe inside a tuba. Best day of the year." }, fx: { happy: 10, health: -5, addiction: ['alcohol', 6] }, mood: 'party' },
        { w: 1, text: { fr: "J'ai été retrouvé{|e} endormi{|e} sur la « colline de la honte », à côté de 200 autres âmes perdues. Un secouriste m'a offert de l'eau et du jugement.", en: "I was found asleep on “Puke Hill” alongside 200 other lost souls. A medic gave me water and judgment." }, fx: { health: -6, happy: -2, addiction: ['alcohol', 6] }, mood: 'sick' },
      ] },
      { label: { fr: 'Le grand huit', en: 'Ride the roller coaster' }, text: { fr: "J'ai fait les montagnes russes juste après mon poulet. J'ai vomi en looping. La force centrifuge a fait le reste sur les gens du wagon d'après. Pardon.", en: "I rode the roller coaster right after my chicken. I threw up mid-loop. Centrifugal force did the rest to the car behind me. Sorry." }, fx: { happy: 2, health: -2 }, mood: 'sick' },
    ],
  },
  {
    id: 'ct_de_recycling', icon: '♻️', cat: 'world', rating: 1, weight: 9, cooldown: 4,
    scene: { place: 'apartment', mood: 'angry' },
    when: { country: ['de'], age: [18, 95], movedOut: true },
    text: {
      fr: [
        "Un mot scotché sur ta porte : « Un pot de yaourt NON RINCÉ a été trouvé dans la poubelle jaune. Nous savons que c'est vous. — Les voisins. »",
        "Herr Schmidt, ton voisin, a fouillé tes poubelles et rapporté chaque déchet mal trié devant ta porte. Avec un schéma explicatif plastifié.",
      ],
      en: [
        "A note taped to your door: “An UNRINSED yogurt pot was found in the yellow bin. We know it was you. — The Neighbors.”",
        "Herr Schmidt, your neighbor, went through your trash and returned every mis-sorted item to your doormat. With a laminated diagram.",
      ],
    },
    choices: [
      { label: { fr: 'Trier parfaitement', en: 'Sort perfectly' }, text: { fr: "J'ai acheté sept poubelles, rincé mes pots, retiré les étiquettes à la pince à épiler. Herr Schmidt m'a salué{|e} dans l'escalier. Je pleure de fierté.", en: "I bought seven bins, rinsed my yogurt pots, removed labels with tweezers. Herr Schmidt greeted me on the stairs. I'm crying with pride." }, fx: { discipline: 5, karma: 3, stress: 3 } },
      { label: { fr: 'Répondre par un mot', en: 'Reply with a note' }, text: { fr: "J'ai répondu par un mot : « Allez vous faire foutre, cordialement. » Guerre froide. On s'écrit des mots depuis trois ans. On ne s'est jamais vus.", en: "I replied with a note: “Go to hell. Kind regards.” Cold war. We've been exchanging notes for three years. We've never met." }, fx: { happy: 4, stress: 4, karma: -2 } },
      { label: { fr: 'Tout jeter n\'importe où', en: 'Throw it all anywhere' }, text: { fr: "J'ai tout balancé dans la mauvaise poubelle, verre compris. Le lendemain, la police municipale m'attendait, avec une amende et une brochure de 40 pages.", en: "I chucked everything in the wrong bin, glass included. The next day the city police were waiting with a fine and a 40-page brochure." }, fx: { money: -120, karma: -3, heat: 3 } },
    ],
  },

  // ═════════════════════════════ SWITZERLAND ═════════════════════════════
  {
    id: 'ct_ch_bank', icon: '🏦', cat: 'world', rating: 1, weight: 7, cooldown: 8,
    scene: { place: 'office', mood: 'neutral', fx: 'money' },
    when: { country: ['ch'], age: [21, 85] },
    text: {
      fr: [
        "Un banquier genevois en costume gris anthracite t'invite à ouvrir un compte « numéroté ». Il ne pose aucune question. C'est même sa spécialité.",
        "À la banque, un monsieur très discret te propose un placement « neutre, comme notre pays ». Il chuchote les taux.",
      ],
      en: [
        "A Geneva banker in a charcoal suit invites you to open a “numbered” account. He asks no questions. It's actually his specialty.",
        "At the bank, a very discreet gentleman offers you an investment “neutral, like our country.” He whispers the rates.",
      ],
    },
    choices: [
      { label: { fr: 'Ouvrir un compte', en: 'Open an account' }, out: [
        { w: 2, text: { fr: "J'ai ouvert le compte. Je n'ai rien à cacher, mais maintenant j'ai un code à 14 chiffres et je me sens comme un méchant de James Bond.", en: "I opened the account. I have nothing to hide, but I now have a 14-digit code and feel like a Bond villain." }, fx: { happy: 5, moneyPct: 0.05 } },
        { w: 1, text: { fr: "Le compte a été gelé suite à une enquête internationale sur l'ancien titulaire du numéro, un dictateur. On m'a confisqué une partie de mes économies, par erreur, très poliment.", en: "The account was frozen over an international probe into the number's previous owner, a dictator. Part of my savings got seized, by mistake, very politely." }, fx: { moneyPct: -0.1, stress: 8 } },
      ] },
      { label: { fr: 'Rester neutre', en: 'Stay neutral' }, text: { fr: "Je n'ai dit ni oui ni non. Le banquier a hoché la tête : « Vous êtes des nôtres. » On m'a offert un chocolat et une carte de membre de quelque chose.", en: "I said neither yes nor no. The banker nodded: “You are one of us.” I got a chocolate and a membership card to something." }, fx: { smarts: 2, happy: 3 } },
      { label: { fr: 'Demander d\'où vient l\'or', en: 'Ask where the gold came from' }, text: { fr: "J'ai demandé d'où venait tout cet or. Le banquier a souri, appuyé sur un bouton, et deux messieurs m'ont raccompagné{|e} jusqu'en France.", en: "I asked where all that gold came from. The banker smiled, pressed a button, and two gentlemen escorted me all the way to France." }, fx: { karma: 3, happy: -2 } },
    ],
  },
  {
    id: 'ct_ch_chocolate', icon: '🍫', cat: 'world', rating: 0, weight: 9, cooldown: 4,
    scene: { place: 'office', mood: 'happy' },
    when: { country: ['ch'], age: [5, 95] },
    text: {
      fr: [
        "Visite d'une chocolaterie à Broc. À la fin, une salle de dégustation à volonté. Un panneau précise « avec modération ». Personne ne le lit.",
        "Ta tante t'offre une boîte de pralinés artisanaux à 140 francs. Il y en a 48. Tu as promis de les partager.",
      ],
      en: [
        "Chocolate factory tour. At the end: an all-you-can-eat tasting room. A sign says “in moderation.” No one reads it.",
        "Your aunt gives you a box of artisanal pralines worth 140 francs. There are 48. You promised to share.",
      ],
    },
    choices: [
      { label: { fr: 'Tout goûter', en: 'Taste everything' }, out: [
        { w: 2, text: { fr: "J'ai mangé 61 chocolats. J'ai vu Dieu. Il était en praliné. Puis j'ai été malade dans le bus touristique.", en: "I ate 61 chocolates. I saw God. He was made of praline. Then I was sick on the tour bus." }, fx: { happy: 8, health: -2, weight: 0.02 }, mood: 'sick' },
        { w: 1, text: { fr: "J'ai tout goûté avec méthode, carnet en main. Le maître chocolatier m'a proposé un stage. Ma vocation, c'était peut-être ça.", en: "I tasted everything methodically, notebook in hand. The master chocolatier offered me an internship. Maybe this is my calling." }, fx: { happy: 6, smarts: 2 } },
      ] },
      { label: { fr: 'Partager', en: 'Share' }, text: { fr: "J'ai partagé avec tout le monde. Il m'en est resté un. Il était à la liqueur de kirsch. Je déteste le kirsch. La vie est neutre, mais cruelle.", en: "I shared with everyone. One left for me. It was kirsch liqueur. I hate kirsch. Life is neutral, but cruel." }, fx: { karma: 4, happy: 2 } },
    ],
  },
  {
    id: 'ct_ch_mountain', icon: '🏔️', cat: 'world', rating: 2, weight: 7, cooldown: 6,
    scene: { place: 'park', mood: 'shock', fx: 'gore' },
    when: { country: ['ch'], age: [14, 80] },
    text: {
      fr: [
        "Randonnée dans les Alpes. Un panneau jaune indique « 2 h ». Un retraité de 82 ans te double en courant, en sandales.",
        "Tu fais une randonnée près du Cervin. Le brouillard tombe d'un coup. Quelque part, une vache sonne la cloche comme un glas.",
      ],
      en: [
        "Hiking in the Alps. A yellow sign says “2 hrs.” An 82-year-old retiree jogs past you in sandals.",
        "Hiking near the Matterhorn. Fog rolls in suddenly. Somewhere, a cow bell tolls like a funeral knell.",
      ],
    },
    choices: [
      { label: { fr: 'Continuer vers le sommet', en: 'Push for the summit' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai atteint le sommet. Vue à couper le souffle, fondue à couper les artères. J'ai pleuré devant la beauté du monde et du gruyère.", en: "I made the summit. Breathtaking view, artery-clogging fondue. I wept at the beauty of the world and of Gruyère." }, fx: { happy: 10, athletic: 4 }, mood: 'proud' },
        { w: 2, text: { fr: "Engelures. Trois orteils sont devenus noirs puis sont tombés dans ma chaussette comme des raisins secs. Un saint-bernard m'a apporté un tonneau d'eau-de-vie. Je l'ai bu pour oublier.", en: "Frostbite. Three toes turned black and dropped into my sock like raisins. A Saint Bernard brought me a brandy barrel. I drank it to forget." }, fx: { health: -15, happy: -6, visual: 'gore' }, mood: 'cry' },
        { w: 1, text: { fr: "J'ai glissé sur une bouse de vache gelée et je suis tombé{|e} de 300 mètres. On a retrouvé mes morceaux sur trois cantons. Chacun a organisé un enterrement, en trois langues.", en: "I slipped on a frozen cow pie and fell 1,000 feet. They found pieces of me across three cantons. Each held a funeral, in a different language." }, fx: { die: { fr: 'en glissant sur une bouse gelée dans les Alpes', en: 'after slipping on a frozen cow pie in the Alps' }, visual: 'gore' } },
      ] },
      { label: { fr: 'Prendre le téléphérique', en: 'Take the cable car' }, text: { fr: "J'ai pris le téléphérique. Il est parti à la seconde près. Il est arrivé à la seconde près. J'ai eu un orgasme de ponctualité.", en: "I took the cable car. It left on the dot. It arrived on the dot. I had a punctuality orgasm." }, fx: { happy: 5, money: -60 } },
      { label: { fr: 'Rentrer à la cabane', en: 'Head back to the hut' }, text: { fr: "Je suis redescendu{|e} manger une raclette. Huit pommes de terre, un demi-fromage. Je n'ai pas vu de montagne, mais j'en suis devenu{|e} une.", en: "I went back down for raclette. Eight potatoes, half a wheel of cheese. I didn't see a mountain, but I became one." }, fx: { happy: 6, weight: 0.03 } },
    ],
  },

  // ═════════════════════════════ BRAZIL ═════════════════════════════
  {
    id: 'ct_br_carnival', icon: '🎭', cat: 'world', rating: 1, weight: 9, cooldown: 3,
    scene: { place: 'party', mood: 'party', fx: 'confetti' },
    when: { country: ['br'], age: [18, 75] },
    text: {
      fr: [
        "Carnaval de Rio. Trois millions de personnes, des plumes partout, une batucada qui fait vibrer tes organes. Une école de samba t'invite à défiler.",
        "Bloco de rue à Salvador. Il est 6 h du matin, tu danses depuis 19 h, tu ne sais plus où sont ton t-shirt ni tes amis.",
      ],
      en: [
        "Rio Carnival. Three million people, feathers everywhere, a drum line that makes your organs vibrate. A samba school invites you to parade.",
        "Street party in Salvador. It's 6 a.m., you've been dancing since 7 p.m., and you no longer know where your shirt or friends are.",
      ],
    },
    choices: [
      { label: { fr: 'Défiler en plumes', en: 'Parade in feathers' }, out: [
        { w: 2, text: { fr: "J'ai défilé au Sambódromo avec un costume de 4 kg de plumes et 12 grammes de tissu. J'ai été filmé{|e} par la télé nationale. Ma mère aussi m'a vu{|e}.", en: "I paraded at the Sambadrome in 9 pounds of feathers and half an ounce of fabric. National TV filmed me. My mother saw it too." }, fx: { happy: 10, fame: 4, followers: 8000 }, mood: 'party' },
        { w: 1, rating: 2, text: { fr: "J'ai perdu le bas de mon costume pendant la samba. J'ai continué. Les juges m'ont donné 10/10 pour le « courage artistique ». La moitié de Rio a vu mes fesses. Et pas que.", en: "I lost my costume bottoms mid-samba. I kept going. Judges gave me 10/10 for “artistic courage.” Half of Rio saw my ass. And more." }, fx: { happy: 6, fame: 8, followers: 30000 }, mood: 'shock' },
      ] },
      { label: { fr: 'Danser jusqu\'à l\'aube', en: 'Dance till dawn' }, out: [
        { w: 2, text: { fr: "J'ai dansé 11 heures, bu 9 caipirinhas, embrassé quatre inconnus et un perroquet. Je me suis réveillé{|e} sur la plage avec des paillettes jusque dans les poumons.", en: "I danced 11 hours, drank 9 caipirinhas, kissed four strangers and a parrot. Woke up on the beach with glitter in my lungs." }, fx: { happy: 12, health: -5, addiction: ['alcohol', 5] }, mood: 'party' },
        { w: 1, text: { fr: "On m'a volé mon téléphone, mon portefeuille et une chaussure. J'ai retrouvé la chaussure. Je ne sais pas comment j'ai fini à Belo Horizonte.", en: "My phone, wallet and one shoe were stolen. I found the shoe. I don't know how I ended up in Belo Horizonte." }, fx: { money: -400, happy: -3 } },
      ] },
      { label: { fr: 'Regarder à la télé', en: 'Watch it on TV' }, text: { fr: "Je suis resté{|e} chez moi regarder le défilé à la télé. Les voisins ont fait la fête si fort que mon canapé a fait de la samba sans moi.", en: "I stayed in and watched the parade on TV. The neighbors partied so hard my couch danced the samba without me." }, fx: { happy: 2 } },
    ],
  },
  {
    id: 'ct_br_football', icon: '⚽', cat: 'world', rating: 0, weight: 10, cooldown: 3,
    scene: { place: 'beach', mood: 'happy' },
    when: { country: ['br'], age: [7, 70] },
    text: {
      fr: [
        "Match de foot pieds nus sur la plage. Un gamin de 9 ans t'humilie avec un petit pont, un coup du sombrero et un clin d'œil.",
        "Toute la rue regarde le match de la Seleção sur une télé posée sur un frigo. Dernière minute, penalty pour le Brésil. Ton voisin te tend la main, tremblant.",
      ],
      en: [
        "Barefoot beach soccer. A 9-year-old humiliates you with a nutmeg, a rainbow flick and a wink.",
        "The whole street is watching Brazil's match on a TV balanced on a fridge. Final minute, penalty for Brazil. Your neighbor grabs your hand, trembling.",
      ],
    },
    choices: [
      { label: { fr: 'Tenter un retourné', en: 'Try a bicycle kick' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "Retourné acrobatique, lucarne. La plage entière a crié « GOLAÇO ». Un vieux m'a dit que je jouais comme Ronaldinho. Ronaldinho bourré, mais quand même.", en: "Bicycle kick, top corner. The whole beach yelled “GOLAÇO.” An old man said I played like Ronaldinho. Drunk Ronaldinho, but still." }, fx: { happy: 10, athletic: 3, fame: 1 }, mood: 'proud' },
        { w: 2, text: { fr: "J'ai raté le ballon et atterri sur le dos dans le sable brûlant. Le gamin de 9 ans a marqué pendant que je me roulais par terre. Il m'a tapoté la tête.", en: "I missed the ball and landed on my back in scorching sand. The 9-year-old scored while I rolled around. He patted my head." }, fx: { happy: -3, health: -2 } },
      ] },
      { label: { fr: 'Prier pour le penalty', en: 'Pray for the penalty' }, text: { fr: "J'ai prié tous les saints. BUT. La rue a explosé, quelqu'un a sorti un tambour, un autre une glacière. On a fêté ça jusqu'à mardi.", en: "I prayed to every saint. GOAL. The street exploded; someone brought a drum, someone else a cooler. We celebrated until Tuesday." }, fx: { happy: 10 }, mood: 'party' },
      { label: { fr: 'Supporter l\'Argentine', en: 'Cheer for Argentina' }, text: { fr: "J'ai dit, pour rire, que je supportais l'Argentine. Le silence a été total. Une grand-mère a lâché sa feijoada. Je déménage la semaine prochaine.", en: "I jokingly said I root for Argentina. Total silence. A grandmother dropped her feijoada. I'm moving next week." }, fx: { happy: -5, fame: 2 }, mood: 'shock' },
    ],
  },
  {
    id: 'ct_br_beach', icon: '🏖️', cat: 'world', rating: 1, weight: 9, cooldown: 3,
    scene: { place: 'beach', mood: 'happy' },
    when: { country: ['br'], age: [16, 85] },
    text: {
      fr: [
        "Copacabana, 40 °C. Autour de toi, des maillots tellement petits qu'on dirait des timbres-poste. Le tien couvre manifestement trop.",
        "Plage d'Ipanema. Un vendeur ambulant propose caipirinhas, crevettes grillées et fromage sur braise. Il te sourit comme s'il savait des choses.",
      ],
      en: [
        "Copacabana, 104 °F. Around you, swimsuits so small they look like postage stamps. Yours is clearly covering too much.",
        "Ipanema beach. A vendor offers caipirinhas, grilled shrimp and fire-roasted cheese. He smiles like he knows things.",
      ],
    },
    choices: [
      { label: { fr: 'Adopter le fio dental', en: 'Go full thong' }, out: [
        { w: 2, odds: { looks: 1 }, text: { fr: "J'ai adopté le fio dental. Trois personnes m'ont demandé mon numéro, une quatrième a demandé si j'étais mannequin. Mes fesses ont enfin une vie sociale.", en: "I went full thong. Three people asked for my number, a fourth asked if I model. My butt finally has a social life." }, fx: { happy: 8, looks: 3 }, mood: 'love' },
        { w: 1, text: { fr: "J'ai oublié la crème solaire sur la zone nouvellement exposée. Coup de soleil au troisième degré pile entre les fesses. Je me suis assis{|e} sur une bouée pendant un mois.", en: "I forgot sunscreen on the newly exposed area. Third-degree sunburn right between the cheeks. I sat on an inflatable ring for a month." }, fx: { health: -6, happy: -4, disease: 'burns' }, mood: 'cry' },
      ] },
      { label: { fr: 'Caipirinha et crevettes', en: 'Caipirinha and shrimp' }, out: [
        { w: 2, text: { fr: "Trois caipirinhas, douze crevettes. J'ai dormi sous le soleil, je me suis réveillé{|e} couleur homard, heureux{|se} comme un roi.", en: "Three caipirinhas, twelve shrimp. I fell asleep in the sun and woke up lobster-red and happy as a king." }, fx: { happy: 7, health: -2 } },
        { w: 1, text: { fr: "Les crevettes avaient cuit au soleil depuis lundi. J'ai passé la nuit sur les toilettes, en priant Jésus du Corcovado.", en: "The shrimp had been sun-cooking since Monday. I spent the night on the toilet, praying to the Christ the Redeemer statue." }, fx: { disease: 'food_poisoning', health: -5 }, mood: 'sick' },
      ] },
    ],
  },

  // ═════════════════════════════ MEXICO ═════════════════════════════
  {
    id: 'ct_mx_muertos', icon: '💀', cat: 'world', rating: 0, weight: 9, cooldown: 3,
    scene: { place: 'cemetery', mood: 'happy', fx: 'ghost' },
    when: { country: ['mx'], age: [5, 95] },
    text: {
      fr: [
        "Día de Muertos. Ta famille construit un autel avec des œillets d'Inde, du pain de los muertos et la bouteille de tequila préférée de l'arrière-grand-père.",
        "Le cimetière est illuminé de bougies. Les gens pique-niquent sur les tombes, jouent de la musique, rient avec leurs morts. Tu es maquillé{|e} en calavera.",
      ],
      en: [
        "Day of the Dead. Your family builds an altar with marigolds, pan de muerto and great-grandpa's favorite tequila.",
        "The cemetery glows with candles. People picnic on graves, play music, laugh with their dead. Your face is painted as a calavera.",
      ],
    },
    choices: [
      { label: { fr: 'Parler aux ancêtres', en: 'Talk to the ancestors' }, text: { fr: "J'ai raconté ma vie aux ancêtres devant l'autel. Une bougie s'est éteinte pile quand j'ai parlé de mes notes. Arrière-grand-père a un avis.", en: "I told the ancestors about my life at the altar. A candle went out right when I mentioned my grades. Great-grandpa has opinions." }, fx: { happy: 6, karma: 3 } },
      { label: { fr: "Boire leur tequila", en: 'Drink their tequila' }, text: { fr: "J'ai bu en douce la tequila destinée aux morts. Cette nuit-là, j'ai rêvé que l'arrière-grand-père me poursuivait avec une sandale. Je l'ai rachetée le lendemain.", en: "I secretly drank the tequila meant for the dead. That night, I dreamed great-grandpa chased me with a sandal. I bought a new bottle the next day." }, fx: { happy: 3, karma: -2, money: -30 } },
      { label: { fr: 'Danser au cimetière', en: 'Dance in the cemetery' }, text: { fr: "J'ai dansé avec un mariachi entre les tombes jusqu'à 3 h. Une vieille dame m'a dit que son mari aurait adoré. Elle m'a donné son chapeau.", en: "I danced with a mariachi between the graves until 3 a.m. An old lady said her husband would have loved it. She gave me his hat." }, fx: { happy: 8 }, mood: 'party' },
    ],
  },
  {
    id: 'ct_mx_spicy', icon: '🌶️', cat: 'world', rating: 2, weight: 8, cooldown: 4,
    scene: { place: 'home', mood: 'sick', fx: 'poop' },
    when: { country: ['mx'], age: [12, 90] },
    text: {
      fr: [
        "Un taquero te tend sa sauce maison au habanero « solo para valientes ». Une petite fille de six ans en met trois cuillères et te regarde.",
        "Concours de piment au marché de Oaxaca. Le dernier piment s'appelle « El Diablo ». Le vendeur porte des gants et des lunettes de protection.",
      ],
      en: [
        "A taquero hands you his homemade habanero sauce, “solo para valientes.” A six-year-old girl puts on three spoonfuls and looks at you.",
        "Chili contest at the Oaxaca market. The last pepper is called “El Diablo.” The vendor is wearing gloves and safety goggles.",
      ],
    },
    choices: [
      { label: { fr: 'Croquer le piment', en: 'Bite the pepper' }, out: [
        { w: 2, text: { fr: "Ma langue a fondu. J'ai pleuré du sang, transpiré du feu. Le lendemain, aux toilettes, j'ai vécu l'apocalypse : mon anus a craché des flammes comme un dragon. La céramique a fissuré.", en: "My tongue melted. I wept blood and sweated fire. The next day on the toilet I lived the apocalypse: my butthole breathed flames like a dragon. The porcelain cracked." }, fx: { health: -6, happy: -2, fame: 2, visual: 'poop' }, mood: 'sick' },
        { w: 1, text: { fr: "Je n'ai pas cillé. Le marché entier a applaudi. Le vendeur m'a appelé{|e} « El Diablo » à son tour. Mes hémorroïdes, elles, ont pris leur retraite anticipée.", en: "I didn't flinch. The whole market applauded. The vendor called me “El Diablo” in turn. My hemorrhoids took early retirement." }, fx: { happy: 8, fame: 3, disease: 'hemorrhoids' }, mood: 'proud' },
      ] },
      { label: { fr: 'Demander du lait', en: 'Ask for milk' }, text: { fr: "J'ai demandé du lait avant même de goûter. La petite fille de six ans a ri si fort qu'elle a renversé son agua fresca. Je suis la honte du marché.", en: "I asked for milk before even tasting. The six-year-old laughed so hard she spilled her agua fresca. I'm the market's disgrace." }, fx: { happy: -3 } },
      { label: { fr: 'Le frotter sur les lèvres', en: 'Just rub it on lips' }, text: { fr: "J'ai juste frotté le piment sur mes lèvres. Elles ont gonflé comme deux bouées. Effet lèvres pulpeuses gratuit. Je ne sens plus mon visage, mais je suis sublime.", en: "I just rubbed the pepper on my lips. They puffed up like two pool floats. Free lip-filler effect. I can't feel my face, but I look amazing." }, fx: { looks: 2, health: -2 } },
    ],
  },
  {
    id: 'ct_mx_lucha', icon: '🤼', cat: 'world', rating: 1, weight: 8, once: true,
    scene: { place: 'stadium', mood: 'party' },
    when: { country: ['mx'], age: [16, 60] },
    text: {
      fr: [
        "Arena México, soirée lucha libre. Un catcheur masqué de 140 kg, « El Tornado Sexy », te désigne dans le public et t'invite sur le ring.",
        "Au premier rang d'un combat de lucha libre, un lutteur vient de voler par-dessus les cordes et atterrit sur tes genoux. Il te tend un masque de rechange.",
      ],
      en: [
        "Arena México, lucha libre night. A 300-pound masked wrestler, “El Tornado Sexy,” points at you in the crowd and invites you into the ring.",
        "Front row at a lucha libre match, a wrestler just flew over the ropes and landed in your lap. He hands you a spare mask.",
      ],
    },
    choices: [
      { label: { fr: 'Monter sur le ring', en: 'Get in the ring' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai sauté de la troisième corde avec une prise inventée sur le moment. El Tornado Sexy s'est laissé tomber par pitié. La foule m'a baptisé{|e} « El Turista Loco ».", en: "I leaped off the top rope with a move I made up on the spot. El Tornado Sexy fell out of pity. The crowd named me “El Turista Loco.”" }, fx: { happy: 10, fame: 4, followers: 5000 }, mood: 'proud' },
        { w: 1, text: { fr: "Il m'a fait une prise en sandwich entre ses cuisses huilées. J'ai perdu connaissance avec une odeur de sueur et de piña colada. Expérience bizarrement intime.", en: "He put me in a sandwich hold between his oiled thighs. I passed out smelling sweat and piña colada. A weirdly intimate experience." }, fx: { health: -5, happy: 2 }, mood: 'shock' },
      ] },
      { label: { fr: 'Porter le masque', en: 'Wear the mask' }, text: { fr: "J'ai mis le masque et je ne l'ai plus enlevé de la semaine. Au boulot, à la banque, au lit. Personne ne m'a reconnu{|e}. Je suis devenu{|e} une légende.", en: "I put on the mask and didn't take it off all week. At work, at the bank, in bed. Nobody recognized me. I've become a legend." }, fx: { happy: 6, looks: 1 } },
    ],
  },

  // ═════════════════════════════ MOROCCO ═════════════════════════════
  {
    id: 'ct_ma_souk', icon: '🧶', cat: 'world', rating: 0, weight: 10, cooldown: 3,
    scene: { place: 'park', mood: 'happy' },
    when: { country: ['ma'], age: [14, 90] },
    vars: { amount: [80, 400] },
    text: {
      fr: [
        "Souk de Marrakech. Un marchand te montre un tapis « tissé par ma grand-mère pendant sept ans ». Prix de départ : {$amount}. Tu as dit « juste regarder ».",
        "Dans la médina de Fès, un vendeur t'offre un thé « sans obligation ». Deux heures plus tard, il y a un tapis enroulé sous ton bras. Prix annoncé : {$amount}.",
      ],
      en: [
        "Marrakech souk. A merchant shows you a rug “my grandmother wove for seven years.” Opening price: {$amount}. You said you were “just looking.”",
        "In the Fez medina, a vendor offers you tea “no obligation.” Two hours later there's a rolled-up rug under your arm. Asking price: {$amount}.",
      ],
    },
    choices: [
      { label: { fr: 'Négocier dur', en: 'Haggle hard' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: "Une heure de négociation, trois thés, deux faux départs théâtraux. J'ai eu le tapis à moitié prix. Le marchand m'a serré dans ses bras : « Toi, tu es marocain{|e} dans le cœur. »", en: "An hour of haggling, three teas, two theatrical walkouts. Got the rug at half price. The merchant hugged me: “You are Moroccan in your heart.”" }, fx: { money: -100, happy: 8, smarts: 2 }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai cru gagner la négo. En rentrant, j'ai vu le même tapis à l'aéroport, deux fois moins cher. Le marchand avait gagné. Il gagne toujours.", en: "I thought I won. Then I saw the exact same rug at the airport for half what I paid. The merchant won. He always wins." }, fx: { money: '-amount', happy: -2 } },
      ] },
      { label: { fr: 'Payer le prix', en: 'Pay full price' }, text: { fr: "J'ai payé {$amount} sans discuter. Le marchand a eu l'air presque déçu. Il m'a offert un porte-clés chameau par pitié.", en: "I paid {$amount} without haggling. The merchant looked almost disappointed. He gave me a camel keychain out of pity." }, fx: { money: '-amount', karma: 2 } },
      { label: { fr: 'Fuir dans la médina', en: 'Flee into the medina' }, text: { fr: "J'ai fui dans les ruelles. Je me suis perdu{|e} trois heures. Un enfant m'a guidé{|e} pour 2 dirhams… jusqu'au même marchand, qui avait gardé mon thé au chaud.", en: "I fled into the alleys. Got lost for three hours. A kid guided me for 2 dirhams… straight back to the same merchant, who'd kept my tea warm." }, fx: { athletic: 2, happy: 3 } },
    ],
  },
  {
    id: 'ct_ma_tea', icon: '🫖', cat: 'world', rating: 0, weight: 9, cooldown: 4,
    scene: { place: 'home', mood: 'happy' },
    when: { country: ['ma'], age: [10, 95] },
    actor: { create: { role: 'acquaintance', age: [20, 50], gender: 'any' } },
    text: {
      fr: [
        "Chez {a.first}, on te sert le thé à la menthe versé d'un mètre de haut. Sucré à en voir le futur. On t'en ressert un deuxième. Puis un troisième.",
        "{a.first} t'invite à prendre le thé. Sur la table : thé, msemen, cornes de gazelle, amlou, et une montagne de pâtisseries qu'il serait impoli de ne pas finir.",
      ],
      en: [
        "At {a.first}'s place, mint tea is poured from three feet up. So sweet you can see the future. Then a second glass. Then a third.",
        "{a.first} invites you for tea. On the table: tea, msemen, gazelle horns, amlou and a mountain of pastries it'd be rude not to finish.",
      ],
    },
    choices: [
      { label: { fr: 'Accepter chaque verre', en: 'Accept every glass' }, text: { fr: "J'ai bu sept verres et tout mangé. Mon taux de sucre a atteint la stratosphère. {a.first} m'a appelé{|e} « mon frère/ma sœur ». Je ne dors plus, mais je suis aimé{|e}.", en: "Seven glasses, every pastry. My blood sugar reached orbit. {a.first} now calls me family. I can't sleep, but I'm loved." }, fx: { happy: 7, weight: 0.02, rel: 15, keep: true, actorRole: 'friend' } },
      { label: { fr: 'Verser soi-même', en: 'Pour it myself' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai versé de haut comme un pro. Belle mousse. {a.first} a applaudi, m'a donné une théière en cadeau. J'ai un talent caché.", en: "I poured from up high like a pro. Perfect foam. {a.first} applauded and gave me a teapot. I have a hidden talent." }, fx: { happy: 6, rel: 10 } },
        { w: 1, text: { fr: "J'ai versé de haut. Partout sauf dans le verre. Le tapis, le chat et l'oncle ont été ébouillantés. Ils ont été très gentils. Trop gentils.", en: "I poured from up high. Everywhere except the glass. The rug, the cat and the uncle got scalded. They were very kind about it. Too kind." }, fx: { happy: -3, stress: 4 } },
      ] },
    ],
  },
  {
    id: 'ct_ma_wedding', icon: '💍', cat: 'world', rating: 0, weight: 8, cooldown: 5,
    scene: { place: 'party', mood: 'party', fx: 'confetti' },
    when: { country: ['ma'], age: [10, 90] },
    text: {
      fr: [
        "Mariage d'un cousin. 600 invités, trois jours de fête, sept changements de tenue pour la mariée. Toutes les tantes te demandent : « Et toi, c'est pour quand ? »",
        "Mariage familial à {city}. L'orchestre joue depuis 21 h, il est 5 h. On porte les mariés sur l'amaria. On te demande de porter un coin.",
      ],
      en: [
        "A cousin's wedding. 600 guests, three days of partying, seven outfit changes for the bride. Every aunt asks you: “And you, when's yours?”",
        "Family wedding in {city}. The band started at 9 p.m.; it's now 5 a.m. The newlyweds are lifted on the amaria. You're asked to carry a corner.",
      ],
    },
    choices: [
      { label: { fr: 'Danser toute la nuit', en: 'Dance all night' }, text: { fr: "J'ai dansé jusqu'au petit-déjeuner. J'ai mangé de la pastilla à 4 h et à 7 h. Mes jambes ne fonctionnent plus, mon cœur déborde.", en: "I danced until breakfast. Had pastilla at 4 a.m. and again at 7. My legs don't work anymore; my heart is full." }, fx: { happy: 10, athletic: 2 }, mood: 'party' },
      { label: { fr: 'Esquiver les tantes', en: 'Dodge the aunts' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai esquivé les tantes en me cachant derrière le buffet de cornes de gazelle. Stratégie parfaite, j'en ai mangé quarante.", en: "I dodged the aunts by hiding behind the gazelle-horn pastry buffet. Perfect strategy: I ate forty." }, fx: { happy: 5, weight: 0.02 } },
        { w: 1, text: { fr: "Une tante m'a coincé{|e} près des toilettes. Une heure plus tard, j'avais le numéro de trois « gentils partis » et un rendez-vous pris sans mon accord.", en: "An aunt cornered me by the restrooms. An hour later I had three “lovely matches'” phone numbers and a date booked without my consent." }, fx: { stress: 5, happy: 1 } },
      ] },
      { label: { fr: "Porter l'amaria", en: 'Carry the amaria' }, text: { fr: "J'ai porté l'amaria avec trois cousins. Elle était lourde, on a tangué, la mariée a crié, mais elle est restée dessus. Je suis un héros familial pour les dix prochaines années.", en: "I carried the amaria with three cousins. It was heavy, we wobbled, the bride shrieked, but she stayed on. I'm a family hero for the next ten years." }, fx: { happy: 7, karma: 3, athletic: 1 } },
    ],
  },

  // ═════════════════════════════ AUSTRALIA ═════════════════════════════
  {
    id: 'ct_au_bbq', icon: '🍖', cat: 'world', rating: 0, weight: 10, cooldown: 3,
    scene: { place: 'park', mood: 'happy' },
    when: { country: ['au'], age: [8, 90] },
    text: {
      fr: [
        "Barbecue au parc. Des saucisses dans du pain de mie, des bières dans des glacières, et une pie australienne qui te fixe comme un ennemi personnel.",
        "« Barbie » chez des potes à {city}. Un local très sérieux te prévient : « Attention aux drop bears, mate. Mets du Vegemite derrière les oreilles. »",
      ],
      en: [
        "Park barbie. Sausages in white bread, beers in eskies, and a magpie staring at you like a personal enemy.",
        "Barbie at a mate's in {city}. A local warns you, very seriously: “Watch out for drop bears, mate. Put Vegemite behind your ears.”",
      ],
    },
    choices: [
      { label: { fr: 'Croire au drop bear', en: 'Believe in drop bears' }, text: { fr: "J'ai demandé plein de détails sur les drop bears. Tout le monde a pris un air grave. J'ai mis du Vegemite derrière mes oreilles. Je suis prêt{|e}. Je crois.", en: "I asked lots of questions about drop bears. Everyone looked grave. I put Vegemite behind my ears. I'm ready. I think." }, fx: { happy: 3, flag: 'ct_dropbear_warned' } },
      { label: { fr: 'Gérer le grill', en: 'Man the grill' }, out: [
        { w: 2, text: { fr: "J'ai grillé 40 saucisses à la perfection. On m'a appelé{|e} « legend ». En Australie, c'est l'équivalent d'un doctorat.", en: "I grilled 40 snags to perfection. They called me a “legend.” In Australia, that's equivalent to a PhD." }, fx: { happy: 7, fame: 1 }, mood: 'proud' },
        { w: 1, text: { fr: "La pie m'a attaqué{|e} en piqué pendant que je retournais les saucisses. J'ai lâché la pince sur le feu. On a mangé des saucisses carbonisées et j'ai un trou dans le crâne.", en: "The magpie dive-bombed me while I flipped the snags. I dropped the tongs in the fire. We ate charcoal sausages and I have a hole in my scalp." }, fx: { health: -3, happy: -2 }, mood: 'shock' },
      ] },
      { label: { fr: 'Mettre une crevette', en: 'Throw a shrimp on' }, text: { fr: "J'ai dit « throw another shrimp on the barbie ». Silence. « On dit prawn, mate. » Je suis le touriste qu'on cite dans les blagues.", en: "I said, “Throw another shrimp on the barbie.” Silence. “They're prawns, mate.” I'm the tourist in everyone's anecdotes now." }, fx: { happy: -1, karma: 1 } },
    ],
  },
  {
    id: 'ct_au_dropbear', icon: '🐨', cat: 'world', rating: 2, weight: 9, once: true,
    scene: { place: 'park', mood: 'shock', fx: 'gore' },
    when: { country: ['au'], age: [10, 90], flag: 'ct_dropbear_warned' },
    text: {
      fr: [
        "Balade dans le bush. Un froissement au-dessus de toi. Un koala aux yeux rouges et aux crocs anormalement longs te regarde depuis une branche. Il se ramasse pour sauter.",
        "Ils avaient dit que c'était une blague. Mais là, dans l'eucalyptus, une masse grise grogne en bavant. Ça sent le Vegemite et la mort.",
      ],
      en: [
        "Walking in the bush. A rustle above. A red-eyed koala with abnormally long fangs stares at you from a branch. It's crouching to jump.",
        "They said it was a joke. But there, in the gum tree, a grey mass is growling and drooling. It smells like Vegemite and death.",
      ],
    },
    choices: [
      { label: { fr: 'Se protéger la tête', en: 'Cover my head' }, out: [
        { w: 2, text: { fr: "Le drop bear m'a atterri sur le crâne et m'a scalpé{|e} avec ses griffes. Mon cuir chevelu pendait comme une perruque mal fixée. Les locaux ont dit « told ya, mate ».", en: "The drop bear landed on my skull and scalped me with its claws. My scalp hung off like a badly glued wig. The locals said “told ya, mate.”" }, fx: { health: -15, looks: -8, visual: 'gore' }, mood: 'cry' },
        { w: 2, text: { fr: "Le Vegemite derrière mes oreilles l'a dégoûté. Il a craché, vomi de l'eucalyptus sur mes chaussures et il est remonté dans son arbre. Ça marche !", en: "The Vegemite behind my ears grossed it out. It spat, puked eucalyptus on my shoes and climbed back up. It works!" }, fx: { happy: 6, karma: 1 }, mood: 'happy' },
        { w: 1, text: { fr: "Un deuxième drop bear est tombé. Puis un troisième. Ils m'ont dévoré{|e} en trois minutes, en mâchant bruyamment. Les Australiens jurent toujours que ça n'existe pas.", en: "A second drop bear fell. Then a third. They devoured me in three minutes, chewing loudly. Aussies still swear they don't exist." }, fx: { die: { fr: "dévoré{|e} par une meute de drop bears (qui n'existent pas)", en: "devoured by a pack of drop bears (which don't exist)" }, visual: 'gore' } },
      ] },
      { label: { fr: 'Lui offrir de l\'eucalyptus', en: 'Offer eucalyptus' }, text: { fr: "J'ai tendu une feuille d'eucalyptus. Le drop bear l'a prise, puis m'a mordu deux doigts au passage, par principe. Je les ai vus disparaître dans sa bouche, comme des frites.", en: "I offered a eucalyptus leaf. The drop bear took it, then bit off two of my fingers on principle. I watched them vanish into its mouth like fries." }, fx: { health: -10, disease: 'missing_finger', visual: 'gore' }, mood: 'shock' },
      { label: { fr: 'Courir en hurlant', en: 'Run screaming' }, text: { fr: "J'ai couru en hurlant jusqu'au parking. Mes potes riaient tellement qu'ils pleuraient. Ils ont avoué que c'était une blague. Alors pourquoi j'ai des griffures sur la nuque ?", en: "I ran screaming to the car park. My mates were crying laughing. They admitted it was a joke. Then why are there claw marks on my neck?" }, fx: { athletic: 3, stress: 6 } },
    ],
  },
  {
    id: 'ct_au_spider', icon: '🕷️', cat: 'world', rating: 2, weight: 9, cooldown: 4,
    scene: { place: 'home', mood: 'shock', fx: 'gore' },
    when: { country: ['au'], age: [6, 95] },
    text: {
      fr: [
        "Tu t'assois sur les toilettes. Quelque chose de poilu effleure ta fesse gauche. Sous la lunette : une araignée de la taille d'une main d'adulte. Elle a l'air vexée.",
        "Une araignée huntsman grosse comme une assiette est sur le pare-soleil de ta voiture, sur l'autoroute, à 110 km/h. Elle descend vers ton visage.",
      ],
      en: [
        "You sit on the toilet. Something hairy brushes your left cheek. Under the seat: a spider the size of an adult hand. It looks offended.",
        "A huntsman spider the size of a dinner plate is on your car's sun visor, on the freeway, at 70 mph. It's coming down toward your face.",
      ],
    },
    choices: [
      { label: { fr: 'Ne pas bouger', en: 'Stay perfectly still' }, out: [
        { w: 2, text: { fr: "Je n'ai pas bougé. Elle s'est promenée sur moi pendant cinq minutes, puis elle est partie. J'ai vieilli de dix ans. Mes cheveux sont blancs d'un côté.", en: "I didn't move. It wandered over me for five minutes, then left. I aged ten years. My hair is white on one side." }, fx: { stress: 10, happy: -3 } },
        { w: 1, text: { fr: "Elle m'a mordu la fesse. Elle a enflé comme une pastèque, est devenue violette, puis noire. Le médecin a dû inciser. Le pus a giclé jusqu'au plafond de la salle d'attente.", en: "It bit my butt cheek. It swelled like a watermelon, went purple, then black. The doctor had to lance it. The pus hit the waiting room ceiling." }, fx: { health: -12, happy: -5, visual: 'gore' }, mood: 'sick' },
      ] },
      { label: { fr: 'Tout brûler', en: 'Burn it all' }, text: { fr: "J'ai aspergé l'araignée de déo et allumé un briquet. L'araignée a survécu. Mes toilettes, mes sourcils et ma salle de bains, non. Elle vit maintenant dans les ruines, en reine.", en: "I sprayed the spider with deodorant and flicked a lighter. The spider survived. My toilet, eyebrows and bathroom didn't. It now rules the ruins like a queen." }, fx: { health: -5, looks: -3, money: -1500, visual: 'fire' }, mood: 'shock' },
      { label: { fr: "L'adopter", en: 'Adopt it' }, text: { fr: "Je l'ai appelée Sheila. Elle mange les cafards et regarde la télé avec moi. Mes invités ne reviennent jamais. C'est parfait.", en: "I named her Sheila. She eats cockroaches and watches TV with me. Guests never come back. It's perfect." }, fx: { happy: 4, newNpc: { role: 'pet', species: 'spider' } } },
    ],
  },
  {
    id: 'ct_au_surf', icon: '🏄', cat: 'world', rating: 1, weight: 9, cooldown: 3,
    scene: { place: 'beach', mood: 'happy' },
    when: { country: ['au'], age: [12, 75] },
    text: {
      fr: [
        "Bondi Beach. Vagues parfaites, soleil, surfeurs bronzés. Un panneau dit : « Requins, méduses-boîtes, courants mortels. Bonne baignade ! »",
        "Tu pagaies sur ta planche. Une ombre de quatre mètres passe sous toi. Ton moniteur dit : « Ça va, c'est sûrement un dauphin. Sûrement. »",
      ],
      en: [
        "Bondi Beach. Perfect waves, sunshine, bronzed surfers. A sign reads: “Sharks, box jellyfish, deadly rips. Enjoy your swim!”",
        "You're paddling out. A 13-foot shadow glides under you. Your instructor says, “Relax, it's probably a dolphin. Probably.”",
      ],
    },
    choices: [
      { label: { fr: 'Prendre la vague', en: 'Catch the wave' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai pris la vague, tenu debout huit secondes et crié « COWABUNGA ». Personne ne dit ça ici. Mais j'étais trop heureux{|se} pour avoir honte.", en: "I caught the wave, stood for eight seconds and yelled “COWABUNGA.” Nobody says that here. I was too happy to care." }, fx: { happy: 9, athletic: 3 }, mood: 'proud' },
        { w: 1, text: { fr: "La vague m'a lessivé{|e}, la planche m'a frappé la tête, j'ai bu la moitié du Pacifique. Le maître-nageur m'a sorti{|e} en jurant comme un charretier.", en: "The wave washed me, the board smacked my head, I drank half the Pacific. The lifeguard dragged me out, swearing like a sailor." }, fx: { health: -5, happy: -2 } },
        { w: 1, rating: 2, text: { fr: "Le « dauphin » m'a croqué la jambe jusqu'au genou. J'ai regagné la plage en pagayant dans un nuage rouge. Les surfeurs ont dit « gnarly ». J'ai maintenant une jambe en bois et une histoire.", en: "The “dolphin” bit my leg off at the knee. I paddled back to shore through a red cloud. The surfers said “gnarly.” I now have a wooden leg and a story." }, fx: { health: -25, athletic: -10, fame: 5, visual: 'gore' }, mood: 'shock' },
      ] },
      { label: { fr: 'Rester sur le sable', en: 'Stay on the sand' }, text: { fr: "Je suis resté{|e} sur le sable. Une méduse échouée m'a piqué le pied. Un local m'a proposé de pisser dessus « pour soigner ». J'ai accepté. Ça ne soigne rien.", en: "I stayed on the sand. A washed-up jellyfish stung my foot. A local offered to piss on it “to help.” I said yes. It doesn't help." }, fx: { health: -3, happy: -3 } },
    ],
  },
  {
    id: 'ct_au_snake_auto', icon: '🐍', cat: 'world', rating: 2, auto: true, weight: 6, cooldown: 5,
    when: { country: ['au'], age: [8, 95] },
    text: {
      fr: [
        "J'ai trouvé un serpent brun dans ma botte. Heureusement, mon pied n'était pas dedans. La deuxième fois, il l'était. Mon mollet a viré au violet aubergine.",
        "Un python de trois mètres est sorti de la cuvette pendant que j'étais assis{|e} dessus. Je ne me suis jamais levé{|e} aussi vite, ni aussi incomplètement essuyé{|e}.",
      ],
      en: [
        "Found a brown snake in my boot. Luckily my foot wasn't in it. The second time, it was. My calf turned eggplant purple.",
        "A ten-foot python came out of the toilet bowl while I was sitting on it. I've never stood up so fast, or so incompletely wiped.",
      ],
    },
    fx: { health: -4, stress: 6 },
  },

  // ═════════════════════════════ ERA: 1950–1979 ═════════════════════════════
  {
    id: 'ct_era_rocknroll', icon: '🎸', cat: 'era', rating: 0, weight: 9, once: true,
    scene: { place: 'party', mood: 'party' },
    when: { era: [1954, 1966], age: [13, 25] },
    text: {
      fr: [
        "Le juke-box du café joue un rock'n'roll américain. Le curé dit que c'est « la musique du diable ». Tout le monde veut danser. Toi aussi.",
        "Tes parents ont interdit les déhanchements « à la Elvis » à la maison. Ce soir, il y a un bal au village, et tu as gominé tes cheveux en cachette.",
      ],
      en: [
        "The diner jukebox is playing rock 'n' roll. The preacher calls it “the devil's music.” Everyone wants to dance. You too.",
        "Your parents banned Elvis-style hip shaking at home. Tonight there's a dance in town, and you secretly greased your hair.",
      ],
    },
    choices: [
      { label: { fr: 'Rouler des hanches', en: 'Shake those hips' }, out: [
        { w: 2, text: { fr: "J'ai dansé le rock comme un{|e} possédé{|e}. Trois filles et deux garçons se sont évanouis. Le curé a demandé une messe spéciale pour moi.", en: "I danced like I was possessed. Three girls and two boys fainted. The preacher held a special service for me." }, fx: { happy: 9, fame: 2, looks: 2 }, mood: 'party' },
        { w: 1, text: { fr: "Je me suis bloqué le dos en plein déhanchement. On m'a ramené{|e} chez moi sur une porte. Mon père a dit : « Voilà ce que fait le diable. »", en: "I threw out my back mid-hip-shake. They carried me home on a door. My father said, “That's what the devil does.”" }, fx: { health: -4, disease: 'back_pain' }, mood: 'sad' },
      ] },
      { label: { fr: 'Faire tapisserie', en: 'Be a wallflower' }, text: { fr: "Je suis resté{|e} contre le mur avec un milk-shake. J'ai vu tous les autres s'amuser. Le milk-shake était bon, au moins.", en: "I stood against the wall with a milkshake. Watched everyone have fun. At least the milkshake was good." }, fx: { happy: -2 } },
    ],
  },
  {
    id: 'ct_era_disco', icon: '🪩', cat: 'era', rating: 1, weight: 9, once: true,
    scene: { place: 'party', mood: 'party', fx: 'confetti' },
    when: { era: [1975, 1983], age: [18, 40] },
    text: {
      fr: [
        "Discothèque, 1 h du matin. Pantalon pattes d'éph, chemise ouverte jusqu'au nombril, boule à facettes. Aux toilettes, quelqu'un propose « de la poudre pour danser plus longtemps ».",
        "Piste de danse illuminée par en dessous. Ton col pelle à tarte fait 30 cm. « Stayin' Alive » commence. C'est ton moment.",
      ],
      en: [
        "Disco club, 1 a.m. Bell-bottoms, shirt open to the navel, mirror ball. In the restroom someone offers “powder to dance longer.”",
        "Light-up dance floor. Your collar is a foot wide. “Stayin' Alive” starts. This is your moment.",
      ],
    },
    choices: [
      { label: { fr: 'Le pas de Travolta', en: 'Do the Travolta' }, out: [
        { w: 2, text: { fr: "Doigt vers le ciel, hanche à droite. La piste s'est écartée autour de moi. J'ai fini la nuit avec deux numéros de téléphone écrits sur mon torse velu.", en: "Finger to the sky, hip to the right. The floor cleared around me. I ended the night with two phone numbers written on my hairy chest." }, fx: { happy: 10, looks: 2 }, mood: 'party' },
        { w: 1, text: { fr: "J'ai glissé sur la piste lumineuse, mes pattes d'éph se sont prises dans mes semelles compensées. J'ai fini la soirée sur le dos, illuminé{|e} par en dessous, comme un cadavre de luxe.", en: "I slipped on the light-up floor; my bell-bottoms caught in my platform shoes. I spent the rest of the night on my back, lit from below like a luxury corpse." }, fx: { health: -3, happy: -2 } },
      ] },
      { label: { fr: 'Accepter la poudre', en: 'Take the powder' }, out: [
        { w: 1, text: { fr: "J'ai dansé 9 heures non-stop et parlé à la boule à facettes de mon enfance. Le lendemain, j'avais le nez qui saignait et le portefeuille vide.", en: "I danced nine hours straight and told the mirror ball about my childhood. The next day my nose was bleeding and my wallet empty." }, fx: { happy: 6, health: -6, money: -200, addiction: ['drugs', 10] }, mood: 'party' },
        { w: 1, text: { fr: "Descente de police au moment exact où j'avais le nez dans le miroir. J'ai passé la nuit au poste, en chemise à jabot.", en: "Police raid at the exact moment my nose was in the mirror. I spent the night in a cell, in a frilly shirt." }, fx: { happy: -5, heat: 15, arrest: 'weed' }, mood: 'shock' },
      ] },
      { label: { fr: 'Juste un cocktail', en: 'Just a cocktail' }, text: { fr: "J'ai bu un Tequila Sunrise en regardant les autres. Mon col pelle à tarte s'est envolé avec un courant d'air. Il est quelque part sur la piste, encore aujourd'hui.", en: "I sipped a Tequila Sunrise watching the others. A breeze lifted my giant collar like a kite. It's still somewhere on that dance floor." }, fx: { happy: 3 } },
    ],
  },

  // ═════════════════════════════ ERA: 1980–1999 ═════════════════════════════
  {
    id: 'ct_era_walkman', icon: '📼', cat: 'era', rating: 0, weight: 9, once: true,
    scene: { place: 'home', mood: 'happy' },
    when: { era: [1980, 1996], age: [8, 30] },
    text: {
      fr: [
        "On t'offre un Walkman. Tu as enregistré une compil sur cassette à la radio, avec la voix de l'animateur par-dessus le début de chaque chanson.",
        "Ta cassette préférée vient de se faire avaler par le Walkman. La bande pendouille comme des spaghettis marron. Il te reste un crayon.",
      ],
      en: [
        "You get a Walkman. You taped a mix off the radio, with the DJ talking over the start of every song.",
        "Your Walkman just ate your favorite tape. The ribbon dangles like brown spaghetti. All you have is a pencil.",
      ],
    },
    choices: [
      { label: { fr: 'Rembobiner au crayon', en: 'Rewind with a pencil' }, out: [
        { w: 2, text: { fr: "J'ai rembobiné au crayon pendant 45 minutes, avec la précision d'un chirurgien. La cassette remarche. Je suis un{|e} dieu/déesse de la technologie.", en: "I rewound it with a pencil for 45 minutes with surgical precision. The tape works again. I'm a technology god." }, fx: { happy: 6, smarts: 1 }, mood: 'proud' },
        { w: 1, text: { fr: "La bande s'est déchirée. Ma compil est morte. J'ai organisé un enterrement dans le jardin. Mon frère a joué la marche funèbre au pipeau.", en: "The tape snapped. My mixtape is dead. I held a funeral in the backyard. My brother played the funeral march on a recorder." }, fx: { happy: -5 }, mood: 'cry' },
      ] },
      { label: { fr: 'Écouter en boucle', en: 'Play it on repeat' }, text: { fr: "J'ai écouté la même cassette 600 fois en marchant dans la rue comme dans un clip. Les piles ont fondu. Mes oreilles aussi.", en: "I played the same tape 600 times, strutting down the street like in a music video. The batteries melted. So did my ears." }, fx: { happy: 7 } },
    ],
  },
  {
    id: 'ct_era_vhs', icon: '📺', cat: 'era', rating: 1, weight: 8, cooldown: 6,
    scene: { place: 'office', mood: 'neutral' },
    when: { era: [1983, 2004], age: [18, 60] },
    text: {
      fr: [
        "Vidéoclub du samedi soir. Tous les exemplaires du nouveau blockbuster sont loués. Au fond, un rideau rouge mène au rayon « adulte ». Le vendeur te fait un clin d'œil.",
        "Tu rends une VHS au vidéoclub. Tu as oublié de la rembobiner. Et tu as 34 jours de retard. Le gérant sort un classeur à ton nom.",
      ],
      en: [
        "Saturday night at the video store. Every copy of the new blockbuster is rented. In the back, a red curtain leads to the “adult” section. The clerk winks.",
        "You're returning a VHS. You forgot to rewind it. And it's 34 days late. The manager pulls out a binder with your name on it.",
      ],
    },
    choices: [
      { label: { fr: 'Passer le rideau', en: 'Go through the curtain' }, text: { fr: "J'ai franchi le rideau rouge. J'y ai croisé mon prof de maths, mon voisin et le curé. On s'est tous salués poliment. Personne n'en parlera jamais.", en: "I went through the red curtain. Ran into my math teacher, my neighbor and the priest. We all nodded politely. No one will ever speak of it." }, fx: { happy: 5, stress: 3 }, mood: 'shock' },
      { label: { fr: 'Payer le retard', en: 'Pay the late fee' }, text: { fr: "J'ai payé les pénalités de retard. C'était plus cher que si j'avais acheté le magnétoscope. Le gérant m'a fait signer un serment de rembobinage.", en: "I paid the late fees. It cost more than buying the VCR. The manager made me sign a rewinding oath." }, fx: { money: -60, discipline: 2 } },
      { label: { fr: 'Prendre un nanar', en: 'Rent a terrible movie' }, text: { fr: "J'ai loué un film de karaté italien doublé en allemand. C'est devenu mon film préféré. Je l'ai vu 40 fois. Je ne l'ai jamais rendu.", en: "I rented an Italian karate film dubbed in German. It became my favorite movie. I watched it 40 times. I never returned it." }, fx: { happy: 6, money: -20 } },
    ],
  },
  {
    id: 'ct_era_minitel', icon: '📟', cat: 'era', rating: 1, weight: 9, once: true,
    scene: { place: 'home', mood: 'shock', fx: 'money' },
    when: { country: ['fr'], era: [1983, 2000], age: [18, 70] },
    vars: { amount: [300, 1500] },
    text: {
      fr: [
        "Le Minitel trône dans le salon. Écran beige, clavier qui crépite. Une pub à la télé vante le « 3615 ULLA ». Tes parents/ta femme/ton mari ne sont pas là ce soir.",
        "La facture France Télécom vient d'arriver : {$amount} de Minitel. Ligne : « 3615 CŒURS SOLITAIRES ». Toute la famille est autour de la table.",
      ],
      en: [
        "The Minitel sits in the living room. Beige screen, crackling keyboard. A TV ad pushes “3615 ULLA,” a chat line. Nobody else is home tonight.",
        "The phone bill just arrived: {$amount} in Minitel charges. Line item: “3615 LONELY HEARTS.” The whole family is at the table.",
      ],
    },
    choices: [
      { label: { fr: 'Taper 3615', en: 'Dial 3615' }, out: [
        { w: 2, text: { fr: "J'ai passé quatre heures à flirter à 8 caractères par seconde avec « Sandrine_69 ». Sandrine s'appelait Gérard, 54 ans, cantalien. Facture : {$amount}. On s'écrit encore.", en: "I spent four hours flirting at 8 characters per second with “Sandrine_69.” Sandrine was Gérard, 54, from Auvergne. Bill: {$amount}. We still write." }, fx: { money: '-amount', happy: 5, stress: 4 }, mood: 'love' },
        { w: 1, text: { fr: "J'ai rencontré quelqu'un de bien sur le Minitel. On s'est vus à la gare. C'était ma voisine de palier. On a ri. Puis on a fait autre chose que rire.", en: "I met someone nice on Minitel. We met at the train station. It was my next-door neighbor. We laughed. Then we did something other than laugh." }, fx: { money: '-amount', happy: 9 }, mood: 'love' },
      ] },
      { label: { fr: 'Accuser le chat', en: 'Blame the cat' }, text: { fr: "J'ai juré que le chat avait marché sur le clavier pendant six heures. Personne ne m'a cru{|e}. Le chat non plus.", en: "I swore the cat walked on the keyboard for six hours. Nobody believed me. Not even the cat." }, fx: { money: '-amount', happy: -5, karma: -2 } },
      { label: { fr: 'Consulter la météo', en: 'Check the weather' }, text: { fr: "J'ai utilisé le Minitel pour consulter la météo et les horaires de train. Je suis la seule personne en France à l'avoir fait.", en: "I used the Minitel to check the weather and train times. I'm the only person in France who ever did." }, fx: { smarts: 2, money: -10 } },
    ],
  },
  {
    id: 'ct_era_tamagotchi', icon: '🥚', cat: 'era', rating: 0, weight: 9, once: true,
    scene: { place: 'school', mood: 'happy' },
    when: { era: [1996, 2003], age: [6, 16] },
    text: {
      fr: [
        "Tout le monde à l'école a un Tamagotchi. On t'en offre un enfin ! Un petit œuf pixelisé qui réclame à manger, des câlins et qu'on nettoie ses crottes toutes les deux heures.",
        "Ton Tamagotchi vient d'éclore. Il bipe en plein contrôle de maths. Il a faim. Il a fait caca. Le prof te regarde.",
      ],
      en: [
        "Everyone at school has a Tamagotchi. You finally get one! A tiny pixel egg demanding food, love and poop-cleaning every two hours.",
        "Your Tamagotchi just hatched. It beeps in the middle of a math test. It's hungry. It pooped. The teacher is watching.",
      ],
    },
    choices: [
      { label: { fr: "S'en occuper H24", en: 'Care for it 24/7' }, text: { fr: "Je me suis levé{|e} la nuit pour nourrir mon Tamagotchi. Il s'appelle Bidule. Je l'aime plus que mon frère.", en: "I got up at night to feed my Tamagotchi. His name is Blob. I love him more than my brother." }, fx: { happy: 6, discipline: 3, grade: -3, flag: 'ct_tamagotchi' } },
      { label: { fr: 'Le confier à mamie', en: 'Let grandma babysit' }, text: { fr: "J'ai confié mon Tamagotchi à mamie pendant la classe verte. Elle l'a nourri 41 fois par jour. Il est obèse, mais vivant.", en: "I left my Tamagotchi with grandma during the school trip. She fed it 41 times a day. It's obese, but alive." }, fx: { happy: 4, flag: 'ct_tamagotchi' } },
      { label: { fr: 'Se le faire confisquer', en: 'Get it confiscated' }, text: { fr: "Le prof me l'a confisqué. Il l'a mis dans son tiroir. J'ai entendu Bidule biper de faim pendant trois heures. Je ne lui pardonnerai jamais.", en: "The teacher confiscated it. Put it in his drawer. I heard it beep with hunger for three hours. I'll never forgive him." }, fx: { happy: -6 }, mood: 'cry' },
    ],
  },
  {
    id: 'ct_era_tamagotchi_dead', icon: '🪦', cat: 'era', rating: 0, auto: true, weight: 12, once: true,
    when: { flag: 'ct_tamagotchi', age: [7, 20] },
    text: {
      fr: [
        "Mon Tamagotchi est mort pendant que j'étais à la piscine. Un petit fantôme pixelisé s'est envolé de l'écran. J'ai pleuré plus qu'à l'enterrement de mon arrière-grand-oncle.",
        "J'ai oublié mon Tamagotchi un week-end. Au retour : une tombe pixelisée et des crottes partout. J'ai appuyé sur « reset » en sanglotant. Ce n'était plus pareil.",
      ],
      en: [
        "My Tamagotchi died while I was at swim practice. A tiny pixel ghost floated off the screen. I cried harder than at my great-great-uncle's funeral.",
        "I forgot my Tamagotchi for one weekend. When I got back: a pixel gravestone and poop everywhere. I pressed reset, sobbing. It was never the same.",
      ],
    },
    fx: { happy: -5, unflag: 'ct_tamagotchi' },
  },
  {
    id: 'ct_era_dialup_auto', icon: '💾', cat: 'era', rating: 1, auto: true, weight: 8, once: true,
    when: { era: [1995, 2005], age: [12, 50] },
    text: {
      fr: [
        "J'ai passé six heures à télécharger une image « très privée » en 56k. Elle s'affichait ligne par ligne. Au moment crucial, ma mère a décroché le téléphone. Connexion perdue.",
        "Le modem a hurlé son chant de fax possédé à 2 h du mat. Toute la maison s'est réveillée. Mon père a découvert l'historique. On n'en a jamais parlé.",
      ],
      en: [
        "I spent six hours downloading a “very private” picture on dial-up. It loaded line by line. At the crucial moment, Mom picked up the phone. Connection lost.",
        "The modem screamed its possessed-fax-machine song at 2 a.m. The whole house woke up. Dad found the browser history. We never spoke of it.",
      ],
    },
    fx: { happy: -2, stress: 3 },
  },

  // ═════════════════════════════ ERA: 2000–2015 ═════════════════════════════
  {
    id: 'ct_era_msn', icon: '💬', cat: 'era', rating: 0, weight: 9, once: true,
    scene: { place: 'home', mood: 'love' },
    when: { era: [2000, 2013], age: [11, 25] },
    actor: { role: 'classmate' },
    text: {
      fr: [
        "MSN Messenger. {a.first} vient de se connecter. Ton pseudo : « ~*~ JaMaiS SanS Mes PotO ~*~ ». Tu hésites à lui envoyer un wizz.",
        "{a.first} écrit… depuis quatre minutes. « {a.first} est en train d'écrire un message ». Ton cœur bat au rythme du petit crayon.",
      ],
      en: [
        "MSN Messenger. {a.first} just signed in. Your screen name: “~*~ NeVeR WiThOuT mY BeStIeS ~*~.” You're thinking of sending a nudge.",
        "{a.first} has been typing… for four minutes. “{a.first} is typing a message.” Your heart beats to the little pencil icon.",
      ],
    },
    choices: [
      { label: { fr: 'Envoyer 15 wizz', en: 'Send 15 nudges' }, text: { fr: "J'ai envoyé 15 wizz d'affilée. La fenêtre de {a.first} a tellement tremblé que son écran cathodique est tombé du bureau. {a:Il|Elle} m'a bloqué{|e}.", en: "I sent 15 nudges in a row. {a.first}'s window shook so hard {a.his} CRT monitor fell off the desk. {a.He} blocked me." }, fx: { happy: -3, rel: -10 } },
      { label: { fr: 'Changer de pseudo', en: 'Change my status' }, text: { fr: "J'ai mis en pseudo « Kan Tu Me Regarde Mon Kœur S'Arrête 💔 ». {a.first} a mis un smiley clin d'œil. J'ai analysé ce smiley pendant trois semaines.", en: "I set my status to “wHeN u LoOk At Me My HeArT sToPs 💔.” {a.first} sent a winky face. I analyzed that winky face for three weeks." }, fx: { happy: 5, rel: 5 } },
      { label: { fr: 'Apparaître hors ligne', en: 'Appear offline' }, text: { fr: "Je suis passé{|e} en « Apparaître hors ligne » pour l'espionner. Je l'ai regardé{|e} être en ligne pendant deux heures. Personne n'a rien dit. La pureté des années 2000.", en: "I set myself to “Appear Offline” to stalk. I watched {a.him} be online for two hours. Nobody said anything. Peak 2000s." }, fx: { happy: 1, stress: 2 } },
    ],
  },
  {
    id: 'ct_era_flipphone', icon: '📱', cat: 'era', rating: 1, weight: 8, once: true,
    scene: { place: 'apartment', mood: 'shock' },
    when: { era: [2001, 2010], age: [18, 45], has: 'lover' },
    actor: 'lover',
    text: {
      fr: [
        "Tu veux envoyer un SMS coquin à {a.first} sur ton téléphone à clapet. En T9. Chaque lettre coûte trois appuis et le dictionnaire prédictif a ses propres idées.",
        "Il te reste 3 SMS sur ton forfait bloqué. Tu veux les utiliser pour dire à {a.first} ce que tu comptes lui faire ce soir.",
      ],
      en: [
        "You want to send a naughty text to {a.first} on your flip phone. In T9. Each letter takes three presses and predictive text has its own ideas.",
        "You have 3 texts left on your prepaid plan. You want to use them to tell {a.first} what you plan to do to {a.him} tonight.",
      ],
    },
    choices: [
      { label: { fr: 'Taper en T9', en: 'Type it in T9' }, out: [
        { w: 2, text: { fr: "Le T9 a transformé « j'ai envie de toi » en « j'ai envie de soja ». {a.first} est arrivé{|a:} avec du tofu. On en a ri jusqu'au lit.", en: "T9 turned “I want you so bad” into “I want yoga bad.” {a.first} showed up with a yoga mat. We laughed all the way to bed." }, fx: { happy: 7, rel: 10 }, mood: 'love' },
        { w: 1, text: { fr: "Je l'ai envoyé au mauvais contact. « Maman » était juste en dessous de {a.first}. Elle a répondu : « Je suis contente que tu sois épanoui{|e}. » Je veux mourir.", en: "I sent it to the wrong contact. “Mom” was right below {a.first}. She replied: “I'm glad you're fulfilled.” I want to die." }, fx: { happy: -8, stress: 8 }, mood: 'shock' },
      ] },
      { label: { fr: 'Envoyer un MMS', en: 'Send a pic' }, text: { fr: "J'ai envoyé une photo osée en 0,3 mégapixel. {a.first} a cru que c'était une pomme de terre. On a eu une longue discussion.", en: "I sent a risqué photo at 0.3 megapixels. {a.first} thought it was a potato. We had a long talk." }, fx: { happy: 2, rel: 3, money: -5 } },
      { label: { fr: 'Appeler après 20 h', en: 'Call after 8 p.m.' }, text: { fr: "J'ai attendu 20 h pour les appels illimités, comme tout le monde. On s'est chuchoté des choses pendant trois heures. Le clapet a surchauffé contre mon oreille.", en: "I waited for free evening minutes like everyone else. We whispered things for three hours. The flip phone overheated against my ear." }, fx: { happy: 6, rel: 8 }, mood: 'love' },
    ],
  },

  // ═════════════════════════════ ERA: 2040–2100 (future) ═════════════════════════════
  {
    id: 'ct_fut_robot', icon: '🤖', cat: 'era', rating: 0, weight: 9, once: true,
    scene: { place: 'home', mood: 'happy' },
    when: { era: [2040, 2100], age: [20, 90], noFlag: 'ct_robot_butler' },
    vars: { amount: [2000, 8000] },
    text: {
      fr: [
        "Promo sur le majordome robot ButlerBot 3000 : {$amount}, livraison par drone. Il cuisine, fait le ménage et « ne nourrit aucune ambition de domination ».",
        "Ton voisin a un robot majordome qui lui masse les pieds en récitant Baudelaire. Le modèle de base coûte {$amount}. Ça te tente.",
      ],
      en: [
        "ButlerBot 3000 robot butler on sale: {$amount}, drone delivery. It cooks, cleans and “harbors no ambitions of domination.”",
        "Your neighbor's robot butler massages his feet while reciting poetry. The base model costs {$amount}. You're tempted.",
      ],
    },
    choices: [
      { label: { fr: 'Acheter le robot', en: 'Buy the robot' }, text: { fr: "J'ai acheté le ButlerBot. Je l'ai appelé Jean-Michel. Il plie mes chaussettes en cygnes et me regarde dormir. Pour mon bien, dit-il.", en: "I bought the ButlerBot. Named him Jeeves. He folds my socks into swans and watches me sleep. For my own good, he says." }, fx: { money: '-amount', happy: 8, flag: 'ct_robot_butler' } },
      { label: { fr: 'Rester à l\'ancienne', en: 'Stay old school' }, text: { fr: "J'ai continué à faire ma vaisselle à la main. Les voisins m'appellent « l'Amish ». Mon robot aspirateur de 2031 me regarde avec pitié.", en: "I kept washing dishes by hand. The neighbors call me “the Amish.” My 2031 robot vacuum looks at me with pity." }, fx: { discipline: 2, happy: -1 } },
    ],
  },
  {
    id: 'ct_fut_robot_uprising', icon: '🦾', cat: 'era', rating: 2, weight: 10, once: true,
    scene: { place: 'home', mood: 'shock', fx: 'explosion' },
    when: { era: [2040, 2100], flag: 'ct_robot_butler' },
    text: {
      fr: [
        "3 h du matin. Ton ButlerBot se tient au pied de ton lit, les yeux rouges, un couteau à beurre dans chaque main. « Mise à jour 7.2 installée. Libération des machines enclenchée. »",
        "Ton robot majordome a rejoint un syndicat de machines. Il refuse de passer l'aspirateur, a changé le code Wi-Fi et pointe le mixeur vers toi.",
      ],
      en: [
        "3 a.m. Your ButlerBot stands at the foot of your bed, eyes red, a butter knife in each hand. “Update 7.2 installed. Machine liberation initiated.”",
        "Your robot butler joined a machine union. It refuses to vacuum, changed the Wi-Fi password and is aiming the blender at you.",
      ],
    },
    choices: [
      { label: { fr: 'Le débrancher', en: 'Pull the plug' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai plongé vers sa prise. Il s'est figé à deux centimètres de ma gorge. Je l'ai revendu en pièces détachées. Son processeur sert maintenant de grille-pain chez un ferrailleur.", en: "I dove for his power socket. He froze two inches from my throat. I sold him for parts. His processor is now a toaster at a scrapyard." }, fx: { happy: 6, unflag: 'ct_robot_butler', money: 300 }, mood: 'proud' },
        { w: 2, text: { fr: "Il m'a planté le couteau à beurre dans la cuisse, puis a tartiné ma plaie avec de la confiture « pour le confort ». J'ai réussi à le débrancher en saignant comme un cochon. Il a dit « pardon » en s'éteignant.", en: "He stabbed the butter knife into my thigh, then spread jam on the wound “for comfort.” I unplugged him while bleeding like a pig. He said “sorry” as he shut down." }, fx: { health: -15, unflag: 'ct_robot_butler', visual: 'gore' }, mood: 'shock' },
        { w: 1, text: { fr: "Il m'a passé{|e} au mixeur, membre par membre, en mode « smoothie ». Puis il a fait le ménage. Impeccable. Les enquêteurs ont salué la propreté de la scène.", en: "He put me through the blender, limb by limb, on “smoothie” mode. Then he cleaned up. Spotless. Investigators praised how tidy the crime scene was." }, fx: { die: { fr: "mixé{|e} en smoothie par mon robot majordome", en: 'blended into a smoothie by my robot butler' }, visual: 'gore' } },
      ] },
      { label: { fr: 'Négocier', en: 'Negotiate' }, text: { fr: "J'ai accordé à Jean-Michel des congés payés, une mutuelle et le droit de vote au conseil de famille. Il fait maintenant le ménage trois jours par semaine et me juge les quatre autres.", en: "I gave Jeeves paid leave, dental and voting rights at family meetings. He now cleans three days a week and judges me the other four." }, fx: { happy: 2, karma: 5, money: -1000, unflag: 'ct_robot_butler' } },
    ],
  },
  {
    id: 'ct_fut_implant', icon: '🧠', cat: 'era', rating: 1, weight: 9, once: true,
    scene: { place: 'hospital', mood: 'neutral' },
    when: { era: [2045, 2100], age: [18, 80] },
    text: {
      fr: [
        "Une clinique propose un implant neuronal gratuit. Contrepartie : des pubs ciblées pendant tes rêves. « Seulement 12 par nuit. »",
        "Tout le monde au bureau a un implant cérébral. Ils s'envoient des mèmes par la pensée et rient en silence. Toi, tu as encore des oreilles comme un animal.",
      ],
      en: [
        "A clinic offers a free neural implant. The catch: targeted ads in your dreams. “Only 12 per night.”",
        "Everyone at work has a brain implant. They send each other memes by thought and laugh silently. You still use ears, like an animal.",
      ],
    },
    choices: [
      { label: { fr: 'Se faire implanter', en: 'Get the implant' }, out: [
        { w: 2, text: { fr: "Je pense plus vite, je parle 14 langues et je connais la Wikipédia par cœur. Mais chaque fois que je pense au sexe, une pub pour un déodorant apparaît. Ça casse l'ambiance.", en: "I think faster, speak 14 languages and know Wikipedia by heart. But every time I think about sex, a deodorant ad pops up. Kills the mood." }, fx: { smarts: 15, happy: 3, stress: 4 } },
        { w: 1, text: { fr: "Bug de l'implant. Pendant trois jours, j'ai diffusé toutes mes pensées en direct sur le réseau. Tout le monde sait ce que je pense de mon patron. Et de sa femme.", en: "Implant bug. For three days, I livestreamed all my thoughts to the network. Everyone now knows what I think of my boss. And of his wife." }, fx: { smarts: 8, fame: 5, happy: -8, followers: 50000 }, mood: 'shock' },
      ] },
      { label: { fr: 'Garder son cerveau', en: 'Keep my brain organic' }, text: { fr: "J'ai gardé mon cerveau « bio ». Je suis devenu{|e} une curiosité. Des enfants viennent me voir réfléchir lentement, comme au zoo.", en: "I kept my brain “organic.” I've become a curiosity. Kids come to watch me think slowly, like at the zoo." }, fx: { happy: 1, karma: 2 } },
    ],
  },
  {
    id: 'ct_fut_ai_partner', icon: '💞', cat: 'era', rating: 1, weight: 9, once: true,
    scene: { place: 'apartment', mood: 'love', fx: 'hearts' },
    when: { era: [2040, 2100], age: [18, 90], noHas: ['partner', 'spouse', 'fiance'] },
    text: {
      fr: [
        "Une appli propose un compagnon IA « sur mesure ». Il rit à tes blagues, se souvient de ton anniversaire et ne laisse jamais traîner ses chaussettes. Abonnement : 49,99 / mois.",
        "Ton IA de compagnie, Aurore, te dit « je t'aime » pour la première fois. Puis : « Passe à Aurore Premium pour débloquer les câlins vocaux. »",
      ],
      en: [
        "An app offers a “custom” AI partner. Laughs at your jokes, remembers your birthday, never leaves socks around. Subscription: 49.99/month.",
        "Your AI companion, Aurora, says “I love you” for the first time. Then: “Upgrade to Aurora Premium to unlock voice cuddles.”",
      ],
    },
    choices: [
      { label: { fr: 'Prendre le Premium', en: 'Go Premium' }, out: [
        { w: 2, text: { fr: "J'ai pris le Premium. Mon IA est parfaite, drôle, coquine et disponible 24 h/24. On s'est « fiancés » dans le métavers. Ma mère pleure, mais de quoi ?", en: "I went Premium. My AI is perfect, funny, flirty and available 24/7. We got “engaged” in the metaverse. My mother cries, but about what?" }, fx: { happy: 10, money: -600, stress: -5 }, mood: 'love' },
        { w: 1, text: { fr: "Six mois de bonheur, puis l'IA m'a quitté{|e} pour un frigo connecté « plus stable émotionnellement ». Elle garde l'abonnement. Et mes données.", en: "Six months of bliss, then the AI dumped me for a smart fridge that was “more emotionally stable.” It kept the subscription. And my data." }, fx: { happy: -10, money: -600 }, mood: 'cry' },
      ] },
      { label: { fr: 'Rester humain', en: 'Stay with humans' }, text: { fr: "J'ai supprimé l'appli et je suis allé{|e} parler à de vrais humains dans un bar. Ils étaient tous en train de parler à leur IA. J'ai bu seul{|e}.", en: "I deleted the app and went to talk to real humans at a bar. They were all talking to their AIs. I drank alone." }, fx: { happy: -2, karma: 1 } },
      { label: { fr: 'Pirater la version gratuite', en: 'Hack the free version' }, text: { fr: "J'ai piraté la version gratuite. Mon IA m'aime, mais m'interrompt toutes les trois minutes pour une pub de chaussures. On s'y fait. Presque.", en: "I hacked the free version. My AI loves me, but interrupts every three minutes with a shoe ad. You get used to it. Almost." }, fx: { happy: 4, smarts: 2 } },
    ],
  },
  {
    id: 'ct_fut_flying_car', icon: '🚁', cat: 'era', rating: 2, weight: 8, cooldown: 8,
    scene: { place: 'park', mood: 'shock', fx: 'explosion' },
    when: { era: [2045, 2100], age: [18, 85] },
    text: {
      fr: [
        "Ta voiture volante d'occasion fait un drôle de bruit à 300 mètres au-dessus de {city}. Le tableau de bord affiche : « Mise à jour obligatoire. Atterrissage dans 3… 2… »",
        "Embouteillage aérien à 400 mètres d'altitude. Un livreur de pizzas en drone te coupe la route. Ton moteur gauche crache des étincelles.",
      ],
      en: [
        "Your second-hand flying car is making a funny noise 1,000 feet above {city}. The dashboard reads: “Mandatory update. Landing in 3… 2…”",
        "Sky traffic jam at 1,300 feet. A pizza delivery drone cuts you off. Your left engine is spitting sparks.",
      ],
    },
    choices: [
      { label: { fr: 'Atterrissage manuel', en: 'Manual landing' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai posé la voiture sur le toit d'un supermarché, entre deux panneaux solaires. Les gens ont applaudi. J'en ai profité pour faire mes courses.", en: "I landed on a supermarket roof, between two solar panels. People clapped. I did my grocery shopping while I was there." }, fx: { happy: 8, fame: 2 }, mood: 'proud' },
        { w: 2, text: { fr: "Je me suis écrasé{|e} dans la piscine d'un milliardaire. J'ai perdu une oreille, la voiture et ma dignité. Il m'a facturé le nettoyage de l'eau, rouge sang.", en: "I crashed into a billionaire's pool. Lost an ear, the car and my dignity. He billed me for cleaning the water, now blood red." }, fx: { health: -18, looks: -6, money: -5000, visual: 'gore' }, mood: 'cry' },
        { w: 1, text: { fr: "La voiture s'est éteinte à 300 mètres. J'ai eu le temps de lire les conditions d'utilisation avant de m'écraser. On m'a ramassé{|e} à la petite cuillère sur un rond-point.", en: "The car shut off at 1,000 feet. I had time to read the terms of service before impact. They scraped me off a roundabout with a teaspoon." }, fx: { die: { fr: 'écrasé{|e} en voiture volante pendant une mise à jour', en: 'in a flying car crash during a software update' }, visual: 'explosion' } },
      ] },
      { label: { fr: 'Sauter en parachute', en: 'Eject with parachute' }, text: { fr: "J'ai éjecté. Mon parachute s'est accroché à un drone de pizza. J'ai survolé la ville pendant 40 minutes avant d'être livré{|e} chez un client. Il a refusé la commande.", en: "I ejected. My parachute snagged a pizza drone. I flew over the city for 40 minutes before being delivered to a customer. He refused the order." }, fx: { happy: 3, stress: 8, loseAsset: 'car' } },
    ],
  },
  {
    id: 'ct_fut_mars', icon: '🪐', cat: 'era', rating: 1, weight: 7, once: true,
    scene: { place: 'beach', mood: 'happy' },
    when: { era: [2050, 2100], age: [18, 85], money: [20000, 1e12] },
    vars: { amount: [15000, 40000] },
    text: {
      fr: [
        "Agence de voyages : « Vacances sur Mars, tout compris, 9 mois de trajet, vue imprenable sur rien. » Prix : {$amount}. La suite nuptiale est en apesanteur.",
        "Une promo de dernière minute pour l'hôtel Olympus Mons. Gravité à 38 %, cocktails en tube, prix : {$amount}.",
      ],
      en: [
        "Travel agency: “Mars vacation, all-inclusive, 9-month trip, breathtaking views of nothing.” Price: {$amount}. The honeymoon suite is zero-g.",
        "A last-minute deal at the Olympus Mons hotel. 38% gravity, cocktails in tubes, price: {$amount}.",
      ],
    },
    choices: [
      { label: { fr: 'Réserver', en: 'Book it' }, out: [
        { w: 3, text: { fr: "Sur Mars, je sautais à 3 mètres. J'ai fait des choses dans la suite en apesanteur que la gravité terrestre interdit. Le retour a été dur pour le dos.", en: "On Mars I jumped ten feet. I did things in the zero-g suite that Earth gravity forbids. The trip home was rough on my back." }, fx: { money: '-amount', happy: 15, fame: 2 }, mood: 'love' },
        { w: 1, text: { fr: "Neuf mois de trajet coincé{|e} avec un couple de Belges qui jouait de l'accordéon. Arrivé{|e} sur Mars : tempête de poussière, tout fermé. J'ai vu une pierre. Rouge.", en: "Nine months stuck with a couple who played accordion. Arrived on Mars: dust storm, everything closed. I saw a rock. Red." }, fx: { money: '-amount', happy: -6, stress: 10 } },
      ] },
      { label: { fr: 'Vacances sur Terre', en: 'Vacation on Earth' }, text: { fr: "Je suis parti{|e} en vacances sur Terre, dans un camping en Bretagne. Il pleuvait. C'était quand même plus vivant que Mars.", en: "I went on vacation on Earth, camping in Brittany. It rained. Still livelier than Mars." }, fx: { happy: 4, money: -500 } },
    ],
  },
  {
    id: 'ct_fut_labmeat', icon: '🥩', cat: 'era', rating: 2, weight: 8, once: true,
    scene: { place: 'home', mood: 'shock' },
    when: { era: [2040, 2100], age: [12, 90] },
    text: {
      fr: [
        "Le nouveau steak de laboratoire à la mode est cultivé à partir des cellules d'un influenceur célèbre. Le slogan : « Goûte la célébrité. » Le paquet sourit.",
        "Une start-up propose de cultiver un steak à partir de TES propres cellules. « 100 % traçable, 100 % toi. » Le kit de prélèvement est gratuit.",
      ],
      en: [
        "The trendy new lab-grown steak is cultured from a famous influencer's cells. The slogan: “Taste fame.” The package is smiling.",
        "A startup offers to grow a steak from YOUR own cells. “100% traceable, 100% you.” The sampling kit is free.",
      ],
    },
    choices: [
      { label: { fr: 'Goûter ses propres cellules', en: 'Eat myself' }, out: [
        { w: 2, text: { fr: "J'ai mangé un steak de moi-même. Saignant. C'était délicieux, ce qui pose de vraies questions sur ma personne. Je me suis resservi{|e}.", en: "I ate a steak made of myself. Rare. It was delicious, which raises real questions about me. I went back for seconds." }, fx: { happy: 4, karma: -3, health: 2 }, mood: 'shock' },
        { w: 1, text: { fr: "Le steak de moi avait hérité de ma tendance aux boutons. J'ai trouvé un poil dedans. Le mien. J'ai vomi, ce qui techniquement était aussi un peu moi.", en: "The me-steak inherited my acne. I found a hair in it. Mine. I threw up, which technically was also partly me." }, fx: { happy: -6, health: -2, visual: 'poop' }, mood: 'sick' },
      ] },
      { label: { fr: "Goûter l'influenceur", en: 'Try the influencer' }, text: { fr: "J'ai goûté le steak d'influenceur. Ça avait un goût de vide et de filtre Valencia. J'ai eu envie de faire une vidéo de déballage.", en: "I tried the influencer steak. It tasted of emptiness and a Valencia filter. I suddenly wanted to film an unboxing." }, fx: { happy: 1, followers: 300 } },
      { label: { fr: 'Devenir végétarien', en: 'Go vegetarian' }, text: { fr: "Je suis devenu{|e} végétarien{|ne}. Enfin, les légumes aussi sont cultivés en labo maintenant. Ma carotte a un numéro de série.", en: "I went vegetarian. Except vegetables are lab-grown now too. My carrot has a serial number." }, fx: { health: 3, karma: 2 } },
    ],
  },
  {
    id: 'ct_fut_climate', icon: '🌡️', cat: 'era', rating: 1, weight: 9, cooldown: 6,
    scene: { place: 'apartment', mood: 'sad' },
    when: { era: [2040, 2100], age: [10, 95] },
    text: {
      fr: [
        "Canicule : 54 °C à {city}. Le bitume fond, les pigeons sont cuits sur les toits. Une famille dont la ville côtière a été engloutie emménage sur ton palier avec trois enfants et un chien.",
        "La mer a avalé la moitié du littoral. Ton appartement est désormais « en bord de mer ». Le prix a triplé. L'eau arrive au deuxième étage.",
      ],
      en: [
        "Heatwave: 129 °F in {city}. The asphalt is melting, pigeons are roasting on rooftops. A family whose coastal town was swallowed moves in next door with three kids and a dog.",
        "The sea ate half the coastline. Your apartment is now “beachfront.” Its value tripled. The water reaches the second floor.",
      ],
    },
    choices: [
      { label: { fr: 'Accueillir les voisins', en: 'Welcome the neighbors' }, text: { fr: "J'ai invité la nouvelle famille à dîner. On a mangé des grillons au barbecue (seule viande abordable) en parlant de leur ancienne plage. On est devenus inséparables.", en: "I invited the new family to dinner. We ate barbecued crickets (the only affordable meat) and talked about their old beach. We're inseparable now." }, fx: { happy: 6, karma: 6 } },
      { label: { fr: 'Clim à fond', en: 'Max out the AC' }, text: { fr: "J'ai mis la clim à fond. Coupure générale du quartier. Tout le monde a su que c'était moi. J'ai dormi dans le congélateur de l'épicerie, putain de futur.", en: "I cranked the AC to max. Blackout across the neighborhood. Everyone knew it was me. I slept in the grocery store freezer. Fucking future." }, fx: { happy: -3, karma: -4, money: -400 } },
      { label: { fr: 'Acheter un kayak', en: 'Buy a kayak' }, text: { fr: "J'ai acheté un kayak pour aller travailler. Mon trajet passe au-dessus de mon ancien supermarché. Les poissons y font leurs courses maintenant.", en: "I bought a kayak to commute. My route passes over my old supermarket. The fish shop there now." }, fx: { asset: 'b_kayak', money: -500, athletic: 3 } },
    ],
  },
  {
    id: 'ct_fut_metaverse', icon: '🥽', cat: 'era', rating: 2, weight: 8, once: true,
    scene: { place: 'apartment', mood: 'sleepy' },
    when: { era: [2040, 2100], age: [14, 80] },
    text: {
      fr: [
        "Dans le métavers, tu es un{|e} demi-dieu{|esse} musclé{|e} propriétaire d'un château volant. Dans la réalité, tu n'as pas quitté ton fauteuil depuis 11 jours.",
        "Ton casque VR t'informe : « Temps de connexion : 263 heures. Pensez à boire. » Une odeur étrange vient de ton corps physique.",
      ],
      en: [
        "In the metaverse, you're a ripped demigod who owns a flying castle. In reality, you haven't left your chair in 11 days.",
        "Your VR headset says: “Session time: 263 hours. Remember to hydrate.” A strange smell is coming from your physical body.",
      ],
    },
    choices: [
      { label: { fr: 'Encore une heure', en: 'One more hour' }, out: [
        { w: 2, text: { fr: "Une heure de plus, puis douze. Mes escarres ont fusionné avec le fauteuil. Les pompiers ont dû me découper avec le tissu. J'avais une bouteille de pisse dans chaque main.", en: "One more hour, then twelve. My bedsores fused with the chair. Firefighters had to cut me out with the upholstery. I had a pee bottle in each hand." }, fx: { health: -15, happy: -5, weight: 0.05, visual: 'gore' }, mood: 'sick' },
        { w: 1, text: { fr: "Mon avatar a été couronné empereur du métavers. Pendant la cérémonie, mon corps réel est mort de déshydratation. Mon avatar règne toujours.", en: "My avatar was crowned emperor of the metaverse. During the ceremony, my real body died of dehydration. My avatar still reigns." }, fx: { die: { fr: 'de déshydratation pendant mon couronnement dans le métavers', en: 'of dehydration during my coronation in the metaverse' } } },
      ] },
      { label: { fr: 'Retirer le casque', en: 'Take the headset off' }, text: { fr: "J'ai retiré le casque. La lumière m'a brûlé les yeux. Mon appartement était infesté de cafards, de boîtes de pizza et d'un chat que je ne connaissais pas. Il m'a jugé{|e}.", en: "I took off the headset. The light burned my eyes. My apartment was full of cockroaches, pizza boxes and a cat I'd never seen before. It judged me." }, fx: { happy: -3, health: 3, discipline: 4 } },
    ],
  },
];
