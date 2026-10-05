// Step 2 actions: prison, vices, body, social media, leisure, money UIs.
import type { ActionDef } from '@bl/sim';
import { addLine, L } from '@bl/sim';

const respect = (n: number) => ({ fn: ({ life }: { life: { prison?: { respect: number } } }) => { if (life.prison) life.prison.respect = Math.max(0, Math.min(100, life.prison.respect + n)); } });

export const actions2: ActionDef[] = [
  // ───────── Prison
  { id: 'p_workout', tab: 'prison', group: 'prison', icon: '💪', label: { fr: 'Muscu dans la cour', en: 'Work out in the yard' }, limit: 3,
    out: [{ text: { fr: ['J\'ai soulevé des haltères faits de sacs de linge. Je deviens une armoire.', 'Pompes, tractions, regards menaçants. La routine.'], en: ['I lifted weights made of laundry bags. I\'m becoming a wardrobe.', 'Push-ups, pull-ups, menacing stares. The routine.'] }, fx: { athletic: 5, health: 3, looks: 1, ...respect(3) } }] },
  { id: 'p_library', tab: 'prison', group: 'prison', icon: '📚', label: { fr: 'Bibliothèque de la prison', en: 'Prison library' }, limit: 3,
    out: [{ text: { fr: ['J\'ai lu « Le Comte de Monte-Cristo ». Je prends des notes.', 'J\'ai lu le code pénal de A à Z. Je connais mieux la loi que mon avocat.'], en: ['I read "The Count of Monte Cristo". Taking notes.', 'I read the penal code cover to cover. I now know the law better than my lawyer.'] }, fx: { smarts: 4, ...respect(-1) } }] },
  { id: 'p_job', tab: 'prison', group: 'prison', icon: '🧺', label: { fr: 'Travailler à la blanchisserie', en: 'Work in the laundry' }, limit: 1,
    out: [{ text: { fr: 'J\'ai plié 4 000 caleçons pour 12 centimes de l\'heure. Le capitalisme a trouvé son paradis.', en: 'I folded 4,000 pairs of underpants for 12 cents an hour. Capitalism found its paradise.' }, fx: { money: 80, karma: 2, counter: 'prisonGood' } }] },
  { id: 'p_fight', tab: 'prison', group: 'prison', icon: '👊', rating: 1, label: { fr: 'Déclencher une baston', en: 'Start a fight' }, limit: 2,
    out: [
      { w: 1, odds: { athletic: 1 }, text: { fr: ['J\'ai éclaté un caïd sur une table de la cantine. Purée, petits pois et dents partout.', 'J\'ai gagné la baston à coups de plateau-repas. Respect immédiat.'], en: ['I smashed a gang boss onto a cafeteria table. Mash, peas and teeth everywhere.', 'Won the fight with a lunch tray. Instant respect.'] }, fx: { health: -6, karma: -3, visual: 'gore', ...respect(15) }, mood: 'angry' },
      { w: 1, text: { fr: 'Je me suis fait démonter. J\'ai passé une semaine à l\'infirmerie avec un œil qui pend.', en: 'I got destroyed. Spent a week in the infirmary with an eye hanging out.' }, fx: { health: -20, visual: 'gore', ...respect(-8) }, mood: 'cry' },
      { w: 0.3, text: { fr: 'Les gardiens sont intervenus à la matraque. Deux ans de plus pour « violences ».', en: 'Guards stepped in with batons. Two more years for "violence".' }, fx: { health: -10, jail: 2 }, mood: 'sad' },
    ] },
  { id: 'p_gang', tab: 'prison', group: 'prison', icon: '🐍', rating: 1, label: { fr: 'Rejoindre un gang', en: 'Join a gang' }, limit: 1, when: { noFlag: 'p_ganged' },
    out: [
      { w: 2, text: { fr: 'Les Cobras m\'ont accepté{|e} après un bizutage que je ne raconterai jamais. J\'ai un tatouage de serpent sur la fesse.', en: 'The Cobras accepted me after an initiation I\'ll never talk about. I have a snake tattoo on my butt.' }, fx: { flag: 'p_ganged', karma: -5, health: -5, ...respect(30) } },
      { w: 1, text: { fr: 'Le chef du gang m\'a regardé{|e} de haut en bas et a éclaté de rire. Refusé{|e}.', en: 'The gang leader looked me up and down and burst out laughing. Rejected.' }, fx: { happy: -5, ...respect(-5) } },
    ] },
  { id: 'p_riot', tab: 'prison', group: 'prison', icon: '🔥', rating: 1, label: { fr: 'Lancer une émeute', en: 'Start a riot' }, limit: 1,
    out: [
      { w: 2, text: { fr: 'L\'aile B a brûlé ses matelas. On a tenu deux heures avant les gaz lacrymo. Légendaire.', en: 'Wing B burned its mattresses. We held two hours before the tear gas. Legendary.' }, fx: { visual: 'fire', karma: -5, health: -8, ...respect(25) }, mood: 'party' },
      { w: 1, text: { fr: 'L\'émeute a fini en bain de sang. Je me suis pris une balle en caoutchouc dans les parties et cinq ans de plus.', en: 'The riot turned into a bloodbath. Took a rubber bullet to the groin and five more years.' }, fx: { visual: 'gore', health: -25, jail: 5 }, mood: 'cry' },
      { w: 0.15, text: { fr: '', en: '' }, fx: { die: { fr: 'piétiné{|e} pendant une émeute de prison', en: 'trampled during a prison riot' } } },
    ] },
  { id: 'p_snitch', tab: 'prison', group: 'prison', icon: '🐀', label: { fr: 'Balancer un codétenu', en: 'Snitch on an inmate' }, limit: 1,
    out: [
      { w: 2, text: { fr: 'J\'ai tout balancé au directeur. Il m\'a promis une remise de peine. Les autres m\'appellent « le rat ».', en: 'I told the warden everything. He promised a reduced sentence. The others call me "the rat".' }, fx: { fn: ({ life }) => { if (life.prison) { life.prison.years = Math.max(life.prison.served + 1, life.prison.years - 2); life.prison.respect = Math.max(0, life.prison.respect - 30); } }, karma: -5 } },
      { w: 1, rating: undefined, text: { fr: 'Quelqu\'un a su. On m\'a retrouvé{|e} dans les douches avec un savon très mal placé et des côtes cassées.', en: 'Someone found out. They found me in the showers with a badly placed bar of soap and broken ribs.' }, fx: { health: -25, visual: 'gore', ...respect(-30) }, mood: 'cry' },
    ] },
  { id: 'p_tattoo', tab: 'prison', group: 'prison', icon: '🖋️', label: { fr: 'Se faire tatouer', en: 'Get a prison tattoo' }, limit: 1,
    out: [
      { w: 2, text: { fr: 'Tatouage fait avec un moteur de walkman et de l\'encre de stylo : une tête de mort. Ou un chou-fleur.', en: 'Tattooed with a walkman motor and pen ink: a skull. Or a cauliflower.' }, fx: { looks: -3, ...respect(8) } },
      { w: 1, text: { fr: 'L\'aiguille était infectée. Mon bras a doublé de volume et sent le camembert.', en: 'The needle was infected. My arm doubled in size and smells like brie.' }, fx: { health: -10, looks: -4 } },
    ] },
  { id: 'p_pray', tab: 'prison', group: 'prison', icon: '🙏', label: { fr: 'Trouver la foi', en: 'Find religion' }, limit: 1,
    out: [{ text: { fr: 'J\'ai rejoint le groupe de prière. Je ne sais pas si Dieu écoute, mais l\'aumônier apporte des madeleines.', en: 'I joined the prayer group. Not sure God listens, but the chaplain brings cookies.' }, fx: { happy: 5, karma: 4, counter: 'prisonGood' } }] },
  { id: 'p_smuggle', tab: 'prison', group: 'prison', icon: '📦', rating: 1, label: { fr: 'Trafiquer en cellule', en: 'Run contraband' }, limit: 1,
    out: [
      { w: 2, text: { fr: 'J\'ai monté un trafic de nouilles instantanées et de téléphones. Je suis le Jeff Bezos du bloc C.', en: 'I ran a ramen-and-phones racket. I\'m the Jeff Bezos of Block C.' }, fx: { money: 1500, ...respect(10) } },
      { w: 1, text: { fr: 'Fouille surprise. Ils ont trouvé un téléphone dans un endroit que je préfère taire. Mitard.', en: 'Surprise search. They found a phone somewhere I\'d rather not say. Solitary.' }, fx: { happy: -10, jail: 1 } },
    ] },
  { id: 'p_escape', tab: 'prison', group: 'prison', icon: '🏃', label: { fr: 'Tenter une évasion', en: 'Attempt an escape' }, limit: 1, open: 'minigame:escape' },
  { id: 'p_parole', tab: 'prison', group: 'prison', icon: '🕊️', label: { fr: 'Demander une libération conditionnelle', en: 'Request parole' }, limit: 1, open: 'parole' },
  { id: 'p_appeal', tab: 'prison', group: 'prison', icon: '⚖️', label: { fr: 'Faire appel', en: 'Appeal' }, limit: 1, open: 'appeal' },
  { id: 'p_doctor', tab: 'prison', group: 'prison', icon: '🩺', label: { fr: 'Infirmerie', en: 'Infirmary' }, limit: 1,
    out: [{ text: { fr: 'L\'infirmier m\'a donné un Doliprane pour tout, y compris ma jambe cassée.', en: 'The nurse gave me an aspirin for everything, including my broken leg.' }, fx: { health: 5, fn: ({ life, content, rand }) => { for (const c of life.conditions.slice()) { const d = content.diseases.find((x) => x.id === c.id); if (d && !d.chronic && rand() < d.curable * 0.5) life.conditions = life.conditions.filter((x) => x !== c); } } } }] },

  // ───────── Vices
  { id: 'drink', tab: 'activities', group: 'vices', icon: '🍺', rating: 1, label: { fr: 'Boire un coup', en: 'Go drinking' }, when: { age: [16, 120] }, limit: 3, cost: 25,
    out: [
      { w: 4, text: { fr: ['Quelques bières en terrasse. J\'ai refait le monde et oublié mon écharpe.', 'Apéro qui a duré six heures. J\'ai appelé mon ex. Deux fois.'], en: ['A few beers on a terrace. Fixed the world, forgot my scarf.', 'Happy hour that lasted six hours. I called my ex. Twice.'] }, fx: { happy: 6, health: -2, addiction: ['alcohol', 8] } },
      { w: 1, rating: 2, text: { fr: 'Black-out total. Je me suis réveillé{|e} dans un caddie, en slip, avec un traffic cone sur la tête et du vomi dans les oreilles.', en: 'Total blackout. Woke up in a shopping cart, in my underwear, a traffic cone on my head and puke in my ears.' }, fx: { happy: -2, health: -6, addiction: ['alcohol', 15], visual: 'poop' } },
    ] },
  { id: 'smoke', tab: 'activities', group: 'vices', icon: '🚬', rating: 1, label: { fr: 'Fumer une clope', en: 'Smoke a cigarette' }, when: { age: [14, 120] }, limit: 2, cost: 10,
    out: [{ text: { fr: ['J\'ai fumé une clope en ayant l\'air cool. J\'avais surtout l\'air d\'un hareng fumé.', 'Une cigarette, puis deux. Mes poumons m\'écrivent des lettres de rupture.'], en: ['I smoked a cigarette looking cool. Mostly I looked like a smoked herring.', 'One cigarette, then two. My lungs are writing me breakup letters.'] }, fx: { happy: 3, health: -2, looks: -1, addiction: ['tobacco', 12] } }] },
  { id: 'weed', tab: 'activities', group: 'vices', icon: '🌿', rating: 1, label: { fr: 'Fumer un joint', en: 'Smoke a joint' }, when: { age: [15, 120] }, limit: 2, cost: 20,
    out: [
      { w: 3, text: { fr: ['J\'ai fumé un joint et regardé un documentaire sur les loutres. Profond.', 'Fou rire de deux heures à cause d\'une chaise. Puis j\'ai mangé un pot de Nutella entier.'], en: ['I smoked a joint and watched an otter documentary. Deep.', 'Two-hour giggle fit because of a chair. Then I ate an entire jar of Nutella.'] }, fx: { happy: 7, smarts: -1, addiction: ['drugs', 6], weight: 0.01 } },
      { w: 1, text: { fr: 'Parano totale. J\'étais persuadé{|e} que mon frigo m\'espionnait pour la CIA.', en: 'Total paranoia. I was convinced my fridge was spying on me for the CIA.' }, fx: { happy: -4, stress: 8, addiction: ['drugs', 6] } },
    ] },
  { id: 'hard_drugs', tab: 'activities', group: 'vices', icon: '❄️', rating: 2, label: { fr: 'Prendre de la coke', en: 'Do cocaine' }, when: { age: [18, 120] }, limit: 2, cost: 150,
    out: [
      { w: 3, text: { fr: ['J\'ai sniffé une ligne aux toilettes d\'un rooftop et j\'ai pitché ma start-up à un lavabo pendant quarante minutes.', 'Nuit blanche sous coke. J\'ai repeint mon appart et écrit un roman de 300 pages. Illisible.'], en: ['Did a line in a rooftop bathroom and pitched my startup to a sink for forty minutes.', 'All-nighter on coke. Repainted my flat and wrote a 300-page novel. Unreadable.'] }, fx: { happy: 9, health: -6, addiction: ['drugs', 22] } },
      { w: 1, text: { fr: 'Mon nez s\'est mis à saigner comme une fontaine de Rome. Le voisin a cru à un meurtre.', en: 'My nose started gushing like a Roman fountain. The neighbour thought it was a murder.' }, fx: { health: -12, addiction: ['drugs', 20], visual: 'gore' } },
      { w: 0.12, text: { fr: '', en: '' }, fx: { die: { fr: 'd\'une overdose de cocaïne, le nez dans un sachet', en: 'of a cocaine overdose, face down in a baggie' } } },
    ] },
  { id: 'shrooms', tab: 'activities', group: 'vices', icon: '🍄', rating: 2, label: { fr: 'Champignons hallucinogènes', en: 'Magic mushrooms' }, when: { age: [18, 120] }, limit: 1, cost: 40,
    out: [
      { w: 2, text: { fr: 'J\'ai parlé avec un arbre pendant six heures. Il m\'a révélé le sens de la vie. J\'ai oublié.', en: 'I talked to a tree for six hours. It revealed the meaning of life. I forgot.' }, fx: { happy: 8, smarts: 1, addiction: ['drugs', 8] } },
      { w: 1, text: { fr: 'Bad trip : j\'ai vu ma grand-mère morte sortir du micro-ondes. Elle m\'a reproché de ne jamais appeler.', en: 'Bad trip: my dead grandma came out of the microwave and complained I never call.' }, fx: { happy: -10, stress: 15, addiction: ['drugs', 8], visual: 'ghost' } },
    ] },
  { id: 'rehab', tab: 'activities', group: 'vices', icon: '🏥', label: { fr: 'Cure de désintox', en: 'Go to rehab' }, when: { test: (l) => Object.values(l.addictions).some((v) => v >= 20) }, limit: 1, cost: 4000,
    out: [
      { w: 3, text: { fr: 'Trente jours de désintox, de cercles de parole et de tisane au fenouil. Je me sens neuf.', en: 'Thirty days of rehab, talking circles and fennel tea. I feel brand new.' }, fx: { happy: 4, health: 8, counter: 'rehab', fn: ({ life }) => { for (const k in life.addictions) life.addictions[k] = Math.max(0, life.addictions[k] - 55); } } },
      { w: 1, text: { fr: 'Je me suis enfui{|e} de la cure au bout de trois jours en escaladant le mur. Il y avait un bar juste en face.', en: 'I escaped rehab after three days by climbing the wall. There was a bar right across the street.' }, fx: { happy: -3, fn: ({ life }) => { for (const k in life.addictions) life.addictions[k] = Math.max(0, life.addictions[k] - 10); } } },
    ] },
  { id: 'casino', tab: 'activities', group: 'vices', icon: '🃏', label: { fr: 'Jouer au blackjack', en: 'Play blackjack' }, when: { age: [18, 120] }, limit: 2, open: 'minigame:blackjack', scene: { place: 'casino' } },
  { id: 'slots', tab: 'activities', group: 'vices', icon: '🎰', label: { fr: 'Machines à sous', en: 'Slot machines' }, when: { age: [18, 120] }, limit: 3, cost: 100, scene: { place: 'casino' },
    out: [
      { w: 6, text: { fr: ['La machine a mangé mes jetons en clignotant joyeusement.', 'J\'ai perdu, mais la machine faisait de jolis bruits.'], en: ['The machine ate my chips, blinking happily.', 'I lost, but the machine made pretty noises.'] }, fx: { happy: -2, addiction: ['gambling', 8] } },
      { w: 2, text: { fr: 'Trois cerises ! J\'ai doublé ma mise et crié comme un goret.', en: 'Three cherries! Doubled my bet and squealed like a pig.' }, fx: { money: 200, happy: 5, addiction: ['gambling', 10] } },
      { w: 0.2, text: { fr: '777 ! JACKPOT ! Les lumières, les sirènes, la vieille d\'à côté m\'a embrassé{|e} sur la bouche.', en: '777! JACKPOT! Lights, sirens, the old lady next to me kissed me on the mouth.' }, fx: { money: 50000, happy: 15, addiction: ['gambling', 20], visual: 'money' } },
    ] },
  { id: 'strip', tab: 'activities', group: 'vices', icon: '💃', rating: 2, label: { fr: 'Club de striptease', en: 'Strip club' }, when: { age: [18, 120] }, limit: 1, cost: 300,
    out: [
      { w: 2, text: { fr: 'J\'ai claqué mon salaire en billets de 5 glissés dans des strings. Le videur m\'appelle « mon prince ».', en: 'I blew my paycheck in fives tucked into G-strings. The bouncer calls me "my prince".' }, fx: { happy: 6, karma: -1 } },
      { w: 1, text: { fr: 'Sur scène, la danseuse, c\'était ma prof de maths du collège. On s\'est reconnus. J\'ai payé pour qu\'elle arrête.', en: 'The dancer on stage was my old math teacher. We recognised each other. I paid her to stop.' }, fx: { happy: -4, stress: 6 } },
    ] },
  { id: 'escort', tab: 'activities', group: 'vices', icon: '💋', rating: 2, label: { fr: 'Appeler une escort', en: 'Call an escort' }, when: { age: [18, 120] }, limit: 1, cost: 400,
    out: [
      { w: 3, text: { fr: 'Une soirée « de compagnie » très professionnelle. Elle a regardé l\'heure trois fois et m\'a laissé une note de satisfaction de 2/5.', en: 'A very professional "companionship" evening. She checked the time three times and left me a 2/5 rating.' }, fx: { happy: 4, karma: -2 } },
      { w: 1, text: { fr: 'Ça me brûle quand je fais pipi. Merci pour le souvenir.', en: 'It burns when I pee. Thanks for the souvenir.' }, fx: { disease: 'std', happy: -6 } },
      { w: 0.6, text: { fr: 'C\'était un flic infiltré. Les menottes, c\'était pas pour jouer.', en: 'It was an undercover cop. The handcuffs were not for fun.' }, fx: { arrest: 'vandal', visual: 'police' } },
    ] },

  // ───────── Body
  { id: 'surgery', tab: 'activities', group: 'body', icon: '💉', label: { fr: 'Chirurgie esthétique', en: 'Plastic surgery' }, when: { age: [18, 100] }, limit: 1, cost: 6000, scene: { place: 'hospital' },
    out: [
      { w: 4, text: { fr: ['Nouveau nez, nouvelle vie. Je ressemble presque à mon filtre Instagram.', 'Lifting complet. Je ne peux plus fermer les yeux, mais quel regard !'], en: ['New nose, new me. I almost look like my Instagram filter.', 'Full facelift. I can\'t close my eyes anymore, but what a look!'] }, fx: { looks: 12, happy: 6, counter: 'surgeries' } },
      { w: 1, rating: 2, text: { fr: 'Le chirurgien était bourré. On m\'a greffé une fesse sur la joue. Mon visage ressemble à un sac de nouilles écrasé et je saigne par le nombril.', en: 'The surgeon was drunk. They grafted a butt cheek onto my face. My face looks like a squashed bag of noodles and I\'m bleeding from my belly button.' }, fx: { looks: -18, health: -10, visual: 'gore', counter: 'surgeries' }, mood: 'cry' },
      { w: 1, text: { fr: 'Botox raté : j\'ai l\'air perpétuellement surpris{|e}. Même à l\'enterrement de mon oncle.', en: 'Botched botox: I look permanently surprised. Even at my uncle\'s funeral.' }, fx: { looks: -5, counter: 'surgeries' } },
    ] },
  { id: 'lipo', tab: 'activities', group: 'body', icon: '🧈', label: { fr: 'Liposuccion', en: 'Liposuction' }, when: { age: [18, 100] }, limit: 1, cost: 5000, scene: { place: 'hospital' },
    out: [
      { w: 3, text: { fr: 'On m\'a aspiré huit litres de gras. Ils m\'ont proposé d\'en faire du savon.', en: 'They sucked out eight litres of fat. They offered to make soap out of it.' }, fx: { weight: -0.18, looks: 6, health: -2 } },
      { w: 1, rating: 2, text: { fr: 'La canule a percé un truc important. J\'ai giclé comme une bouteille de ketchup sur l\'interne.', en: 'The cannula pierced something important. I squirted like a ketchup bottle all over the intern.' }, fx: { weight: -0.08, health: -15, visual: 'gore' } },
    ] },
  { id: 'therapy', tab: 'activities', group: 'mind', icon: '🛋️', label: { fr: 'Voir un psy', en: 'See a therapist' }, when: { age: [8, 120] }, limit: 2, cost: 90,
    out: [
      { w: 3, text: { fr: ['Une heure à parler de ma mère. Le psy a hoché la tête 47 fois. Je me sens mieux.', 'Le psy m\'a dit que mes problèmes venaient de mon enfance. Comme d\'hab.'], en: ['An hour talking about my mother. The therapist nodded 47 times. I feel better.', 'The therapist said my problems come from my childhood. As usual.'] }, fx: { happy: 6, stress: -12, fn: ({ life, rand }) => { const d = life.conditions.find((c) => c.id === 'depression' || c.id === 'anxiety' || c.id === 'ptsd'); if (d && rand() < 0.35) life.conditions = life.conditions.filter((x) => x !== d); } } },
      { w: 1, text: { fr: 'Mon psy s\'est endormi. Je lui ai quand même payé la séance.', en: 'My therapist fell asleep. I still paid for the session.' }, fx: { happy: -1 } },
    ] },
  { id: 'vacation', tab: 'activities', group: 'fun', icon: '🏝️', label: { fr: 'Partir en vacances', en: 'Go on vacation' }, when: { age: [18, 120] }, limit: 1, cost: 2500, scene: { place: 'beach' },
    out: [
      { w: 4, text: { fr: ['Une semaine aux Baléares. Coup de soleil en forme de maillot, mais heureux{|se}.', 'Road trip en Italie : des pâtes, des églises, et un vol de portefeuille à Naples.', 'Vacances au ski : je suis rentré{|e} avec un genou en moins et un moniteur en plus.'], en: ['A week in the Balearics. Swimsuit-shaped sunburn, but happy.', 'Italian road trip: pasta, churches, and a stolen wallet in Naples.', 'Ski trip: came back with one knee less and a ski instructor more.'] }, fx: { happy: 12, stress: -15 } },
      { w: 1, text: { fr: 'Turista sévère au Mexique. J\'ai vu les toilettes de l\'hôtel plus que la plage.', en: 'Severe Montezuma\'s revenge in Mexico. Saw the hotel toilet more than the beach.' }, fx: { happy: -3, health: -4, visual: 'poop' } },
      { w: 0.2, rating: 2, text: { fr: '', en: '' }, fx: { die: { fr: 'dévoré{|e} par un requin pendant un selfie, en Australie', en: 'eaten by a shark while taking a selfie in Australia' } } },
    ] },
  { id: 'adopt_more', tab: 'activities', group: 'fun', icon: '🐈', label: { fr: 'Promener un chien du refuge', en: 'Walk a shelter dog' }, when: { age: [10, 100] }, limit: 1,
    out: [{ text: { fr: 'J\'ai promené un vieux chien du refuge. Il a pété tout le long. On s\'est compris.', en: 'I walked an old shelter dog. He farted the whole way. We bonded.' }, fx: { happy: 4, karma: 3 } }] },

  // ───────── Social media
  { id: 'post', tab: 'activities', group: 'social', icon: '📱', label: { fr: 'Poster sur les réseaux', en: 'Post on social media' }, when: { age: [13, 120], era: [2006, 3000] }, limit: 3,
    out: [
      { w: 4, odds: { looks: 0.8 }, text: { fr: ['J\'ai posté un selfie avec la bouche en canard. 12 likes, dont ma mère.', 'Photo de mon brunch : avocado toast et désespoir.'], en: ['Posted a duckface selfie. 12 likes, including my mom.', 'Photo of my brunch: avocado toast and despair.'] }, fx: { followers: 40, happy: 2 } },
      { w: 1, odds: { looks: 1, fame: 1 }, text: { fr: 'Ma vidéo de chat qui tombe d\'une étagère a fait 3 millions de vues ! Je suis une star d\'internet.', en: 'My video of a cat falling off a shelf got 3 million views! I\'m internet famous.' }, fx: { followers: 25000, fame: 6, happy: 8, visual: 'confetti' } },
      { w: 0.6, rating: 1, text: { fr: 'Un vieux tweet de 2012 a refait surface. Les internautes demandent ma tête sur un plateau.', en: 'An old tweet from 2012 resurfaced. The internet wants my head on a plate.' }, fx: { followers: -2000, happy: -8, fame: 2 } },
    ] },
  { id: 'live', tab: 'activities', group: 'social', icon: '🎥', label: { fr: 'Faire un live en streaming', en: 'Go live on stream' }, when: { age: [13, 120], era: [2014, 3000], followers: [200, 1e12] }, limit: 2,
    out: [
      { w: 3, text: { fr: 'Live de 6 heures à jouer et à répondre au chat. Un mec m\'a donné 50 balles pour que je mange un piment.', en: '6-hour stream answering chat. Some guy paid 50 bucks to watch me eat a chili.' }, fx: { followers: 1500, money: 200, happy: 3 } },
      { w: 1, rating: 2, text: { fr: 'J\'ai oublié de couper le live en allant aux toilettes. 40 000 personnes ont entendu mon intestin s\'exprimer. Je suis viral{|e}.', en: 'Forgot to end the stream while going to the toilet. 40,000 people heard my bowels speak. I went viral.' }, fx: { followers: 30000, happy: -6, fame: 4, visual: 'poop' } },
    ] },
  { id: 'clout', tab: 'activities', group: 'social', icon: '💣', rating: 1, label: { fr: 'Lancer une polémique', en: 'Start a controversy' }, when: { age: [16, 120], era: [2008, 3000] }, limit: 1,
    out: [
      { w: 2, text: { fr: 'J\'ai déclaré que les pâtes carbonara se font à la crème. L\'Italie entière m\'a déclaré la guerre. +50 000 abonnés.', en: 'I said carbonara is made with cream. All of Italy declared war on me. +50,000 followers.' }, fx: { followers: 50000, fame: 5, karma: -4 } },
      { w: 1, text: { fr: 'Ma polémique a fait un flop. Même les trolls m\'ont ignoré{|e}.', en: 'My controversy flopped. Even the trolls ignored me.' }, fx: { happy: -5 } },
    ] },
  { id: 'buyfollowers', tab: 'activities', group: 'social', icon: '🤖', label: { fr: 'Acheter des abonnés', en: 'Buy followers' }, when: { age: [16, 120], era: [2010, 3000] }, limit: 1, cost: 800,
    out: [{ text: { fr: 'J\'ai acheté 20 000 abonnés. Ce sont tous des bots indonésiens qui commentent « nice pic » sous mes photos d\'enterrement.', en: 'I bought 20,000 followers. All Indonesian bots commenting "nice pic" under my funeral photos.' }, fx: { followers: 20000, karma: -2 } }] },

  // ───────── Money UIs
  { id: 'realestate', tab: 'assets', group: 'shop', icon: '🏠', label: { fr: 'Agence immobilière', en: 'Real estate' }, when: { age: [18, 120] }, open: 'realestate' },
  { id: 'dealership', tab: 'assets', group: 'shop', icon: '🚗', label: { fr: 'Concession auto & bateaux', en: 'Cars, boats & jets' }, when: { age: [16, 120] }, open: 'cars' },
  { id: 'luxury', tab: 'assets', group: 'shop', icon: '💎', label: { fr: 'Boutique de luxe', en: 'Luxury shop' }, when: { age: [18, 120] }, open: 'shop' },
  { id: 'stocks', tab: 'assets', group: 'shop', icon: '📈', label: { fr: 'Bourse & crypto', en: 'Stocks & crypto' }, when: { age: [18, 120] }, open: 'stocks' },
  { id: 'bank', tab: 'assets', group: 'shop', icon: '🏦', label: { fr: 'Banque & prêts', en: 'Bank & loans' }, when: { age: [18, 120] }, open: 'bank' },
  { id: 'business', tab: 'career', group: 'job', icon: '🏢', label: { fr: 'Mon entreprise', en: 'My business' }, when: { age: [18, 120] }, open: 'business' },
  { id: 'crimes', tab: 'activities', group: 'crime', icon: '🦹', label: { fr: 'Crimes', en: 'Crime' }, when: { age: [6, 120] }, open: 'crime' },
];

void addLine; void L;
