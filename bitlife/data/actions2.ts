// Step 2 actions: prison, vices, body, social media, leisure, money UIs.
import type { ActionDef } from '@bl/sim';
import { addLine, L } from '@bl/sim';

const respect = (n: number) => ({ fn: ({ life }: { life: { prison?: { respect: number } } }) => { if (life.prison) life.prison.respect = Math.max(0, Math.min(100, life.prison.respect + n)); } });

export const actions2: ActionDef[] = [
  // ───────── Prison
  { id: 'p_workout', tab: 'prison', group: 'prison', icon: '💪', label: { fr: 'Muscu dans la cour', en: 'Work out in the yard' }, limit: 3,
    out: [{ text: {
      fr: ['J\'ai soulevé des haltères faits de sacs de linge. Je deviens une armoire.', 'Pompes, tractions, regards menaçants. La routine.', "J'ai fait [[200|500|1 000]] pompes dans ma cellule. Mon codétenu compte à voix haute : c'est notre lien.", "Muscu dans la cour {w:weather}. Un caïd m'a fait un signe de tête. Je monte dans la hiérarchie.", "Tractions sur le panier de basket. Les autres m'ont surnommé{|e} « {w:nickname} ». C'est un honneur, je crois."],
      en: ['I lifted weights made of laundry bags. I\'m becoming a wardrobe.', 'Push-ups, pull-ups, menacing stares. The routine.', 'I did [[200|500|1,000]] push-ups in my cell. My cellmate counts out loud: it\'s our bond.', 'Yard workout {w:weather}. A big shot gave me a nod. I\'m moving up the ladder.', 'Pull-ups on the basketball hoop. The others call me "{w:nickname}" now. An honor, I think.'],
    }, fx: { athletic: 5, health: 3, looks: 1, ...respect(3) } }] },
  { id: 'p_library', tab: 'prison', group: 'prison', icon: '📚', label: { fr: 'Bibliothèque de la prison', en: 'Prison library' }, limit: 3,
    out: [{ text: {
      fr: ['J\'ai lu « Le Comte de Monte-Cristo ». Je prends des notes.', 'J\'ai lu le code pénal de A à Z. Je connais mieux la loi que mon avocat.', "J'ai lu un manuel sur {w:hobby}. À ma sortie, je me reconvertis.", "Seul livre disponible : un guide sur la vie {w:far_place}. Je le connais par cœur. Je rêve d'ailleurs.", "J'ai lu des romans d'évasion pendant [[trois|six|dix]] heures. Pour le plaisir, évidemment. Rien à voir."],
      en: ['I read "The Count of Monte Cristo". Taking notes.', 'I read the penal code cover to cover. I now know the law better than my lawyer.', 'I read a manual on {w:hobby}. When I get out, I\'m switching careers.', 'Only book available: a guide to life {w:far_place}. I know it by heart. I dream of elsewhere.', 'I read escape novels for [[three|six|ten]] hours. Purely for pleasure, obviously. No reason.'],
    }, fx: { smarts: 4, ...respect(-1) } }] },
  { id: 'p_job', tab: 'prison', group: 'prison', icon: '🧺', label: { fr: 'Travailler à la blanchisserie', en: 'Work in the laundry' }, limit: 1,
    out: [{ text: {
      fr: ['J\'ai plié 4 000 caleçons pour 12 centimes de l\'heure. Le capitalisme a trouvé son paradis.', "J'ai lavé les draps de tout le bloc {w:time}. J'ai trouvé {w:food} dans une taie d'oreiller.", "Huit heures de repassage pour l'administration. Je repasse mieux que ma mère. Je ne lui dirai jamais.", "Blanchisserie : [[3 000|5 000|9 000]] chaussettes triées avec {w:song} en boucle à la radio. Aucune paire complète."],
      en: ['I folded 4,000 pairs of underpants for 12 cents an hour. Capitalism found its paradise.', 'I washed the whole block\'s sheets {w:time}. Found {w:food} in a pillowcase.', 'Eight hours of ironing for the administration. I iron better than my mother now. I\'ll never tell her.', 'Laundry: [[3,000|5,000|9,000]] socks sorted with {w:song} on loop on the radio. Not one matching pair.'],
    }, fx: { money: 80, karma: 2, counter: 'prisonGood' } }] },
  { id: 'p_fight', tab: 'prison', group: 'prison', icon: '👊', rating: 1, label: { fr: 'Déclencher une baston', en: 'Start a fight' }, limit: 2,
    out: [
      { w: 1, odds: { athletic: 1 }, text: {
        fr: ['J\'ai éclaté un caïd sur une table de la cantine. Purée, petits pois et dents partout.', 'J\'ai gagné la baston à coups de plateau-repas. Respect immédiat.', "J'ai assommé un caïd avec un plateau. Il a fait {w:sound} en s'écroulant.", "Baston dans la cour : j'ai mordu le nez d'un type surnommé « {w:nickname} ». On l'appelle désormais « Sans-Nez ».", "Victoire en [[trois|huit|vingt]] secondes. Les gardiens ont parié sur moi. J'ai une cote, maintenant."],
        en: ['I smashed a gang boss onto a cafeteria table. Mash, peas and teeth everywhere.', 'Won the fight with a lunch tray. Instant respect.', 'I knocked out a big shot with a tray. He made {w:sound} as he went down.', 'Yard brawl: I bit the nose of a guy called "{w:nickname}". Now they call him "No-Nose".', 'Won in [[three|eight|twenty]] seconds. The guards bet on me. I have odds now.'],
      }, fx: { health: -6, karma: -3, visual: 'gore', ...respect(15) }, mood: 'angry' },
      { w: 1, text: {
        fr: ['Je me suis fait démonter. J\'ai passé une semaine à l\'infirmerie avec un œil qui pend.', "Je me suis fait démonter. On m'a déboîté {w:bodypart} et volé mes chaussures au passage.", "Mon adversaire faisait deux têtes de plus que moi. Je me suis réveillé{|e} à l'infirmerie en chantant {w:song}.", "Mauvaise idée : j'ai provoqué le plus petit du bloc. Ancien champion de boxe. Mes dents sont restées dans la cour."],
        en: ['I got destroyed. Spent a week in the infirmary with an eye hanging out.', 'I got wrecked. They dislocated my {w:bodypart} and stole my shoes on the way out.', 'My opponent was two heads taller. I woke up in the infirmary singing {w:song}.', 'Bad idea: I picked on the smallest guy in the block. Former boxing champ. My teeth stayed in the yard.'],
      }, fx: { health: -20, visual: 'gore', ...respect(-8) }, mood: 'cry' },
      { w: 0.3, text: {
        fr: ['Les gardiens sont intervenus à la matraque. Deux ans de plus pour « violences ».', "Les matons ont tout vu {w:time}. Deux ans de rab pour « violences ».", "Matraque, menottes, mitard, puis tribunal. Deux ans de plus. Mon avocat a bâillé.", "Le directeur a visionné la vidéo [[deux|cinq|dix]] fois en mangeant {w:food}. Verdict : deux ans de plus."],
        en: ['Guards stepped in with batons. Two more years for "violence".', 'The guards saw it all {w:time}. Two extra years for "violence".', 'Baton, cuffs, solitary, then court. Two more years. My lawyer yawned.', 'The warden watched the footage [[two|five|ten]] times while eating {w:food}. Verdict: two more years.'],
      }, fx: { health: -10, jail: 2 }, mood: 'sad' },
    ] },
  { id: 'p_gang', tab: 'prison', group: 'prison', icon: '🐍', rating: 1, label: { fr: 'Rejoindre un gang', en: 'Join a gang' }, limit: 1, when: { noFlag: 'p_ganged' },
    out: [
      { w: 2, text: {
        fr: ['Les Cobras m\'ont accepté{|e} après un bizutage que je ne raconterai jamais. J\'ai un tatouage de serpent sur la fesse.', "Les Cobras m'ont accepté{|e}. Mon nom de gang : « {w:nickname} ». Pas le plus terrifiant.", "Bizutage : j'ai dû engloutir {w:food} en dix secondes devant tout le gang. Accepté{|e}.", "J'ai rejoint le gang. Poignée de main secrète en [[14|27|40]] étapes. Je la révise la nuit."],
        en: ['The Cobras accepted me after an initiation I\'ll never talk about. I have a snake tattoo on my butt.', 'The Cobras let me in. My gang name: "{w:nickname}". Not the scariest.', 'Initiation: I had to wolf down {w:food} in ten seconds in front of the whole gang. I\'m in.', 'I joined the gang. Secret handshake in [[14|27|40]] steps. I practice it at night.'],
      }, fx: { flag: 'p_ganged', karma: -5, health: -5, ...respect(30) } },
      { w: 1, text: {
        fr: ['Le chef du gang m\'a regardé{|e} de haut en bas et a éclaté de rire. Refusé{|e}.', "Refusé{|e}. Le chef a dit qu'il cherchait des tueurs, pas des « {w:nickname} ».", "Refusé{|e} : j'ai raté la poignée de main secrète et je lui ai fait un câlin par erreur.", "Le gang m'a fait passer un test dans la cour {w:weather}. J'ai pleuré au bout de [[deux|cinq|dix]] minutes. Refusé{|e}."],
        en: ['The gang leader looked me up and down and burst out laughing. Rejected.', 'Rejected. The boss said he wanted killers, not "{w:nickname}" types.', 'Rejected: I botched the secret handshake and hugged him by mistake.', 'The gang tested me in the yard {w:weather}. I cried after [[two|five|ten]] minutes. Rejected.'],
      }, fx: { happy: -5, ...respect(-5) } },
    ] },
  { id: 'p_riot', tab: 'prison', group: 'prison', icon: '🔥', rating: 1, label: { fr: 'Lancer une émeute', en: 'Start a riot' }, limit: 1,
    out: [
      { w: 2, text: {
        fr: ['L\'aile B a brûlé ses matelas. On a tenu deux heures avant les gaz lacrymo. Légendaire.', "Émeute ! J'ai lancé {w:food} sur un maton en hurlant « {w:exclaim} ». Légendaire.", "On a pris la cantine pendant [[trois|cinq|huit]] heures. Revendication principale : du ketchup.", "J'ai mené l'émeute perché{|e} sur un chariot de linge. Tout le bloc scandait mon surnom : « {w:nickname} »."],
        en: ['Wing B burned its mattresses. We held two hours before the tear gas. Legendary.', 'Riot! I threw {w:food} at a guard, yelling "{w:exclaim}" Legendary.', 'We held the cafeteria for [[three|five|eight]] hours. Main demand: ketchup.', 'I led the riot from atop a laundry cart. The whole block chanted my nickname: "{w:nickname}".'],
      }, fx: { visual: 'fire', karma: -5, health: -8, ...respect(25) }, mood: 'party' },
      { w: 1, text: {
        fr: ['L\'émeute a fini en bain de sang. Je me suis pris une balle en caoutchouc dans les parties et cinq ans de plus.', "L'émeute a mal tourné. Une grenade lacrymo m'a fracassé {w:bodypart}, et j'ai pris cinq ans de plus.", "Les CRS ont chargé {w:weather}. Piétiné{|e}, ensanglanté{|e}, et condamné{|e} à cinq ans supplémentaires.", "J'étais {le|la} seul{|e} à ne pas fuir quand les gardiens sont entrés. Crâne ouvert, [[cinq|cinq longues|cinq interminables]] années de rab."],
        en: ['The riot turned into a bloodbath. Took a rubber bullet to the groin and five more years.', 'The riot went south. A tear-gas canister smashed my {w:bodypart}, and I got five more years.', 'Riot police charged {w:weather}. Trampled, bloodied, and sentenced to five extra years.', 'I was the only one who didn\'t run when the guards came in. Split skull and [[five|five long|five endless]] extra years.'],
      }, fx: { visual: 'gore', health: -25, jail: 5 }, mood: 'cry' },
      { w: 0.15, text: { fr: '', en: '' }, fx: { die: { fr: 'piétiné{|e} pendant une émeute de prison', en: 'trampled during a prison riot' } } },
    ] },
  { id: 'p_snitch', tab: 'prison', group: 'prison', icon: '🐀', label: { fr: 'Balancer un codétenu', en: 'Snitch on an inmate' }, limit: 1,
    out: [
      { w: 2, text: {
        fr: ['J\'ai tout balancé au directeur. Il m\'a promis une remise de peine. Les autres m\'appellent « le rat ».', "J'ai balancé un codétenu {w:time}. Remise de peine promise. Les autres crachent dans ma soupe.", "J'ai vendu un codétenu au directeur. Prix : deux ans de remise et {w:food}.", "Balance assumée. Quelqu'un a dessiné un [[rat|morceau de fromage|cochon qui couine]] sur la porte de ma cellule."],
        en: ['I told the warden everything. He promised a reduced sentence. The others call me "the rat".', 'I snitched on an inmate {w:time}. Sentence reduction promised. The others spit in my soup.', 'I sold out an inmate to the warden. Price: two years off and {w:food}.', 'Proud snitch. Someone drew a [[rat|piece of cheese|squealing pig]] on my cell door.'],
      }, fx: { fn: ({ life }) => { if (life.prison) { life.prison.years = Math.max(life.prison.served + 1, life.prison.years - 2); life.prison.respect = Math.max(0, life.prison.respect - 30); } }, karma: -5 } },
      { w: 1, rating: undefined, text: {
        fr: ['Quelqu\'un a su. On m\'a retrouvé{|e} dans les douches avec un savon très mal placé et des côtes cassées.', "Quelqu'un a su. On m'a cassé {w:bodypart} dans la file de la cantine, à coups de plateau.", "Les autres ont appris que j'avais balancé. Réveil à l'infirmerie, scotché{|e} au lit, côtes en miettes.", "Représailles {w:time} : passage à tabac dans la buanderie. Mes côtes ont fait {w:sound}."],
        en: ['Someone found out. They found me in the showers with a badly placed bar of soap and broken ribs.', 'Someone found out. They broke my {w:bodypart} in the lunch line, with a tray.', 'Word got out that I snitched. Woke up in the infirmary, duct-taped to the bed, ribs in pieces.', 'Payback {w:time}: a beating in the laundry room. My ribs made {w:sound}.'],
      }, fx: { health: -25, visual: 'gore', ...respect(-30) }, mood: 'cry' },
    ] },
  { id: 'p_tattoo', tab: 'prison', group: 'prison', icon: '🖋️', label: { fr: 'Se faire tatouer', en: 'Get a prison tattoo' }, limit: 1,
    out: [
      { w: 2, text: {
        fr: ['Tatouage fait avec un moteur de walkman et de l\'encre de stylo : une tête de mort. Ou un chou-fleur.', "Tatouage de prison : le prénom de ma mère. Avec [[une|deux|trois]] fautes.", "Mon codétenu m'a tatoué {w:animal} sur l'avant-bras. Enfin, il dit que c'en est un.", "Tatouage à l'encre de stylo {w:time} : une larme sous l'œil. Je n'ai tué personne, mais ça impressionne."],
        en: ['Tattooed with a walkman motor and pen ink: a skull. Or a cauliflower.', 'Prison tattoo: my mother\'s name. With [[one typo|two typos|three typos]].', 'My cellmate tattooed {w:animal} on my forearm. Well, he says that\'s what it is.', 'Pen-ink tattoo {w:time}: a teardrop under my eye. I\'ve killed no one, but it impresses.'],
      }, fx: { looks: -3, ...respect(8) } },
      { w: 1, text: {
        fr: ['L\'aiguille était infectée. Mon bras a doublé de volume et sent le camembert.', "Tatouage infecté. Il a viré au vert {w:time} et l'infirmier a crié « {w:exclaim} ».", "L'encre, c'était du jus de chaussette. Fièvre de cheval, et mon bras sent {w:food}.", "Le tatoueur a éternué en plein milieu. Ma rose ressemble à un accident de [[vélo|tondeuse|scooter]] et elle s'est infectée."],
        en: ['The needle was infected. My arm doubled in size and smells like brie.', 'Infected tattoo. It turned green {w:time} and the nurse yelled "{w:exclaim}"', 'The ink was basically sock juice. Raging fever, and my arm smells like {w:food}.', 'The tattooist sneezed halfway through. My rose looks like a [[bike|lawnmower|scooter]] accident, and it got infected.'],
      }, fx: { health: -10, looks: -4 } },
    ] },
  { id: 'p_pray', tab: 'prison', group: 'prison', icon: '🙏', label: { fr: 'Trouver la foi', en: 'Find religion' }, limit: 1,
    out: [{ text: {
      fr: ['J\'ai rejoint le groupe de prière. Je ne sais pas si Dieu écoute, mais l\'aumônier apporte des madeleines.', "J'ai prié {w:time}. Pas de réponse divine, mais l'aumônier m'a laissé finir ses biscuits.", "Groupe de prière : on a chanté {w:song} à la guitare. Dieu a dû grimacer.", "J'ai trouvé la foi. Mon codétenu aussi, depuis qu'il a vu qu'il y avait [[du café|des gâteaux|du chauffage]] à la chapelle."],
      en: ['I joined the prayer group. Not sure God listens, but the chaplain brings cookies.', 'I prayed {w:time}. No divine answer, but the chaplain let me finish his cookies.', 'Prayer group: we sang {w:song} on guitar. God must have winced.', 'I found faith. So did my cellmate, once he saw the chapel had [[coffee|cake|heating]].'],
    }, fx: { happy: 5, karma: 4, counter: 'prisonGood' } }] },
  { id: 'p_smuggle', tab: 'prison', group: 'prison', icon: '📦', rating: 1, label: { fr: 'Trafiquer en cellule', en: 'Run contraband' }, limit: 1,
    out: [
      { w: 2, text: {
        fr: ['J\'ai monté un trafic de nouilles instantanées et de téléphones. Je suis le Jeff Bezos du bloc C.', "Business florissant : je revends {w:food} au marché noir du bloc. Je suis riche en monnaie de cantine.", "J'ai fait entrer [[12|30|50]] téléphones planqués dans des pots de yaourt. Les affaires sont les affaires.", "Mon réseau livre même {w:animal} en cellule, sur commande. Ne demandez pas comment."],
        en: ['I ran a ramen-and-phones racket. I\'m the Jeff Bezos of Block C.', 'Business is booming: I sell {w:food} on the block\'s black market. Rich in cafeteria currency.', 'I smuggled in [[12|30|50]] phones hidden in yogurt pots. Business is business.', 'My network even delivers {w:animal} to your cell, on request. Don\'t ask how.'],
      }, fx: { money: 1500, ...respect(10) } },
      { w: 1, text: {
        fr: ['Fouille surprise. Ils ont trouvé un téléphone dans un endroit que je préfère taire. Mitard.', "Fouille surprise {w:time} : ils ont trouvé {w:food} et trois téléphones dans mon matelas. Mitard.", "Mon client était une balance. Toute la marchandise saisie et un an de plus.", "Le chien renifleur, surnommé « {w:nickname} », a trouvé ma planque en [[dix secondes|deux minutes|un éternuement]]. Mitard."],
        en: ['Surprise search. They found a phone somewhere I\'d rather not say. Solitary.', 'Surprise search {w:time}: they found {w:food} and three phones in my mattress. Solitary.', 'My customer was a snitch. Whole stock seized and an extra year.', 'The sniffer dog, nicknamed "{w:nickname}", found my stash in [[ten seconds|two minutes|one sneeze]]. Solitary.'],
      }, fx: { happy: -10, jail: 1 } },
    ] },
  { id: 'p_escape', tab: 'prison', group: 'prison', icon: '🏃', label: { fr: 'Tenter une évasion', en: 'Attempt an escape' }, limit: 1, open: 'minigame:escape' },
  { id: 'p_parole', tab: 'prison', group: 'prison', icon: '🕊️', label: { fr: 'Demander une libération conditionnelle', en: 'Request parole' }, limit: 1, open: 'parole' },
  { id: 'p_appeal', tab: 'prison', group: 'prison', icon: '⚖️', label: { fr: 'Faire appel', en: 'Appeal' }, limit: 1, open: 'appeal' },
  { id: 'p_doctor', tab: 'prison', group: 'prison', icon: '🩺', label: { fr: 'Infirmerie', en: 'Infirmary' }, limit: 1,
    out: [{ text: {
      fr: ['L\'infirmier m\'a donné un Doliprane pour tout, y compris ma jambe cassée.', "L'infirmier m'a examiné{|e} {w:time}, entre deux mots fléchés. Diagnostic : « ça va passer ».", "À l'infirmerie, on m'a mis un pansement sur {w:bodypart}. Je venais pour une migraine.", "Infirmerie : une heure d'attente, un thermomètre douteux et [[deux|trois|quatre]] cachets de couleurs différentes."],
      en: ['The nurse gave me an aspirin for everything, including my broken leg.', 'The nurse examined me {w:time}, between two crosswords. Diagnosis: "it\'ll pass".', 'At the infirmary they put a band-aid on my {w:bodypart}. I came in for a migraine.', 'Infirmary: an hour\'s wait, a dubious thermometer and [[two|three|four]] pills of different colors.'],
    }, fx: { health: 5, fn: ({ life, content, rand }) => { for (const c of life.conditions.slice()) { const d = content.diseases.find((x) => x.id === c.id); if (d && !d.chronic && rand() < d.curable * 0.5) life.conditions = life.conditions.filter((x) => x !== c); } } } }] },

  // ───────── Vices
  { id: 'drink', tab: 'activities', group: 'vices', icon: '🍺', rating: 1, label: { fr: 'Boire un coup', en: 'Go drinking' }, when: { age: [16, 120] }, limit: 3, cost: 25,
    out: [
      { w: 4, text: {
        fr: ['Quelques bières en terrasse. J\'ai refait le monde et oublié mon écharpe.', 'Apéro qui a duré six heures. J\'ai appelé mon ex. Deux fois.', "Quelques verres {w:weather}. J'ai expliqué à toute la terrasse {w:conspiracy}. Tout le monde a acquiescé.", "[[Trois|Cinq|Huit]] tournées plus tard, j'ai payé un verre à un inconnu surnommé « {w:nickname} ». Meilleur ami à vie.", "Soirée au bar : on a chanté {w:song} à tue-tête jusqu'à la fermeture. Le patron a coupé le courant."],
        en: ['A few beers on a terrace. Fixed the world, forgot my scarf.', 'Happy hour that lasted six hours. I called my ex. Twice.', 'A few drinks {w:weather}. I explained to the whole terrace {w:conspiracy}. Everyone nodded.', '[[Three|Five|Eight]] rounds later, I bought a drink for a stranger nicknamed "{w:nickname}". Best friend for life.', 'Night at the bar: we belted out {w:song} until closing. The owner cut the power.'],
      }, fx: { happy: 6, health: -2, addiction: ['alcohol', 8] } },
      { w: 1, rating: 2, text: {
        fr: ['Black-out total. Je me suis réveillé{|e} dans un caddie, en slip, avec un traffic cone sur la tête et du vomi dans les oreilles.', "Réveil sur un rond-point, enlacé{|e} avec {w:animal}, du vomi jusque dans les chaussettes.", "Trou noir. D'après les vidéos, j'ai vomi tripes et boyaux sur {w:vehicle} qui passait, puis salué le conducteur.", "Coma de [[sept|douze|quinze]] heures. Réveil dans une baignoire vide, un sourcil rasé, un goût de mort dans la bouche."],
        en: ['Total blackout. Woke up in a shopping cart, in my underwear, a traffic cone on my head and puke in my ears.', 'Woke up on a roundabout, cuddling {w:animal}, puke all the way into my socks.', 'Total blackout. According to the videos, I puked my guts out onto {w:vehicle} driving by, then waved at the driver.', 'Passed out for [[seven|twelve|fifteen]] hours. Woke up in an empty bathtub, one eyebrow shaved, the taste of death in my mouth.'],
      }, fx: { happy: -2, health: -6, addiction: ['alcohol', 15], visual: 'poop' } },
    ] },
  { id: 'smoke', tab: 'activities', group: 'vices', icon: '🚬', rating: 1, label: { fr: 'Fumer une clope', en: 'Smoke a cigarette' }, when: { age: [14, 120] }, limit: 2, cost: 10,
    out: [{ text: {
      fr: ['J\'ai fumé une clope en ayant l\'air cool. J\'avais surtout l\'air d\'un hareng fumé.', 'Une cigarette, puis deux. Mes poumons m\'écrivent des lettres de rupture.', "Pause clope {w:weather}. J'ai grelotté dix minutes pour cinq bouffées. Rentable.", "J'ai voulu faire des ronds de fumée. J'ai produit un nuage informe et {w:sound}.", "Une clope [[derrière le gymnase|sur le balcon|devant la gare]]. Mes fringues sentent le cendrier pour la semaine."],
      en: ['I smoked a cigarette looking cool. Mostly I looked like a smoked herring.', 'One cigarette, then two. My lungs are writing me breakup letters.', 'Smoke break {w:weather}. Shivered ten minutes for five puffs. Worth it.', 'I tried to blow smoke rings. Produced a shapeless cloud and {w:sound}.', 'A cigarette [[behind the gym|on the balcony|outside the station]]. My clothes smell like an ashtray for a week.'],
    }, fx: { happy: 3, health: -2, looks: -1, addiction: ['tobacco', 12] } }] },
  { id: 'weed', tab: 'activities', group: 'vices', icon: '🌿', rating: 1, label: { fr: 'Fumer un joint', en: 'Smoke a joint' }, when: { age: [15, 120] }, limit: 2, cost: 20,
    out: [
      { w: 3, text: {
        fr: ['J\'ai fumé un joint et regardé un documentaire sur les loutres. Profond.', 'Fou rire de deux heures à cause d\'une chaise. Puis j\'ai mangé un pot de Nutella entier.', "J'ai fumé et je suis resté{|e} persuadé{|e} pendant une heure {w:conspiracy}. J'ai pris des notes. Illisibles.", "Un joint plus tard, j'ai mangé {w:food} et {w:food} à 3 h du matin. Les deux. En même temps.", "J'ai fumé et regardé [[un documentaire sur les méduses|des dessins animés russes|un feu de cheminée sur YouTube]] pendant trois heures. Chef-d'œuvre."],
        en: ['I smoked a joint and watched an otter documentary. Deep.', 'Two-hour giggle fit because of a chair. Then I ate an entire jar of Nutella.', 'I got high and stayed convinced for an hour {w:conspiracy}. Took notes. Unreadable.', 'One joint later, I ate {w:food} and {w:food} at 3am. Both. At once.', 'I got high and watched [[a jellyfish documentary|Russian cartoons|a YouTube fireplace]] for three hours. Masterpiece.'],
      }, fx: { happy: 7, smarts: -1, addiction: ['drugs', 6], weight: 0.01 } },
      { w: 1, text: {
        fr: ['Parano totale. J\'étais persuadé{|e} que mon frigo m\'espionnait pour la CIA.', "Parano totale : j'ai cru que {w:animal} à la fenêtre bossait pour la police.", "J'ai passé deux heures caché{|e} sous la couette parce que {w:sound} venait de la cuisine.", "Bad trip sur le [[canapé|balcon|banc du parc]] : j'ai oublié comment respirer tout seul. J'ai respiré manuellement toute la nuit."],
        en: ['Total paranoia. I was convinced my fridge was spying on me for the CIA.', 'Total paranoia: I thought {w:animal} at the window was working for the cops.', 'I spent two hours hiding under the duvet because {w:sound} came from the kitchen.', 'Bad high on the [[couch|balcony|park bench]]: I forgot how to breathe automatically. Breathed manually all night.'],
      }, fx: { happy: -4, stress: 8, addiction: ['drugs', 6] } },
    ] },
  { id: 'hard_drugs', tab: 'activities', group: 'vices', icon: '❄️', rating: 2, label: { fr: 'Prendre de la coke', en: 'Do cocaine' }, when: { age: [18, 120] }, limit: 2, cost: 150,
    out: [
      { w: 3, text: {
        fr: ['J\'ai sniffé une ligne aux toilettes d\'un rooftop et j\'ai pitché ma start-up à un lavabo pendant quarante minutes.', 'Nuit blanche sous coke. J\'ai repeint mon appart et écrit un roman de 300 pages. Illisible.', "Une ligne {w:at_place}, et j'ai parlé quatre heures sans respirer. L'inconnu en face s'est endormi debout.", "Soirée coke : je me suis pris{|e} pour {w:celeb}. J'ai signé des autographes sur des serviettes en papier.", "J'ai sniffé puis récuré l'appart [[deux|trois|cinq]] fois à 4 h du matin, à la brosse à dents. Pas la mienne."],
        en: ['Did a line in a rooftop bathroom and pitched my startup to a sink for forty minutes.', 'All-nighter on coke. Repainted my flat and wrote a 300-page novel. Unreadable.', 'One line {w:at_place}, and I talked for four hours without breathing. The stranger facing me fell asleep standing up.', 'Coke night: I thought I was {w:celeb}. Signed autographs on paper napkins.', 'I did a line, then scrubbed the flat [[two|three|five]] times at 4am with a toothbrush. Not mine.'],
      }, fx: { happy: 9, health: -6, addiction: ['drugs', 22] } },
      { w: 1, text: {
        fr: ['Mon nez s\'est mis à saigner comme une fontaine de Rome. Le voisin a cru à un meurtre.', "Saignement de nez XXL {w:at_place}. Les gens ont cru à un tournage de film d'horreur.", "Ma cloison nasale a lâché. Quand j'éternue, ça fait {w:sound} et ça éclabousse le plafond.", "Mini crise cardiaque [[au comptoir|au vestiaire|dans le taxi]]. Mon cœur cognait si fort que j'entendais le sang gicler dans mes oreilles."],
        en: ['My nose started gushing like a Roman fountain. The neighbour thought it was a murder.', 'Mega nosebleed {w:at_place}. People thought it was a horror movie shoot.', 'My septum gave up. When I sneeze it sounds like {w:sound} and splatters the ceiling.', 'Mini heart attack [[at the bar|at the coat check|in the taxi]]. My heart pounded so hard I could hear blood squirting in my ears.'],
      }, fx: { health: -12, addiction: ['drugs', 20], visual: 'gore' } },
      { w: 0.12, text: { fr: '', en: '' }, fx: { die: { fr: 'd\'une overdose de cocaïne, le nez dans un sachet', en: 'of a cocaine overdose, face down in a baggie' } } },
    ] },
  { id: 'shrooms', tab: 'activities', group: 'vices', icon: '🍄', rating: 2, label: { fr: 'Champignons hallucinogènes', en: 'Magic mushrooms' }, when: { age: [18, 120] }, limit: 1, cost: 40,
    out: [
      { w: 2, text: {
        fr: ['J\'ai parlé avec un arbre pendant six heures. Il m\'a révélé le sens de la vie. J\'ai oublié.', "J'ai mangé des champignons et vu {w:animal} me réciter du Baudelaire. Avec l'accent belge.", "Trip cosmique : pendant six heures, j'étais convaincu{|e} d'être {w:object}.", "Les murs respiraient, le tapis chantait {w:song}, et j'ai pleuré de beauté devant [[une chaise|un grille-pain|mes orteils]]."],
        en: ['I talked to a tree for six hours. It revealed the meaning of life. I forgot.', 'I ate mushrooms and watched {w:animal} recite poetry to me. With a Belgian accent.', 'Cosmic trip: for six hours I was convinced I was {w:object}.', 'The walls breathed, the rug sang {w:song}, and I wept at the beauty of [[a chair|a toaster|my toes]].'],
      }, fx: { happy: 8, smarts: 1, addiction: ['drugs', 8] } },
      { w: 1, text: {
        fr: ['Bad trip : j\'ai vu ma grand-mère morte sortir du micro-ondes. Elle m\'a reproché de ne jamais appeler.', "Bad trip : {w:celeb} a surgi du placard et m'a hurlé dessus pendant trois heures.", "J'ai vu mes mains fondre comme {w:food} au soleil. J'ai hurlé jusqu'à l'aube.", "Bad trip : persuadé{|e} d'être mort{|e}, j'ai organisé mes propres funérailles dans la baignoire. Les voisins sont venus. [[Deux|Trois|Cinq]] ont pleuré."],
        en: ['Bad trip: my dead grandma came out of the microwave and complained I never call.', 'Bad trip: {w:celeb} burst out of the closet and screamed at me for three hours.', 'I watched my hands melt like {w:food} in the sun. I screamed until dawn.', 'Bad trip: convinced I was dead, I held my own funeral in the bathtub. The neighbors came. [[Two|Three|Five]] of them cried.'],
      }, fx: { happy: -10, stress: 15, addiction: ['drugs', 8], visual: 'ghost' } },
    ] },
  { id: 'rehab', tab: 'activities', group: 'vices', icon: '🏥', label: { fr: 'Cure de désintox', en: 'Go to rehab' }, when: { test: (l) => Object.values(l.addictions).some((v) => v >= 20) }, limit: 1, cost: 4000,
    out: [
      { w: 3, text: {
        fr: ['Trente jours de désintox, de cercles de parole et de tisane au fenouil. Je me sens neuf.', "Désintox réussie. J'ai remplacé mon addiction par {w:hobby}. Mon entourage regrette presque l'ancienne.", "Un mois de cure : yoga à 6 h, cercle de parole à 10 h, purée à midi. Je suis sobre et je m'ennuie [[un peu|beaucoup|à mourir]].", "En cure, mon parrain s'appelait « {w:nickname} ». Il m'a sauvé la vie avec des métaphores sur {w:animal}."],
        en: ['Thirty days of rehab, talking circles and fennel tea. I feel brand new.', 'Rehab worked. I replaced my addiction with {w:hobby}. My family almost misses the old one.', 'A month of rehab: yoga at 6, sharing circle at 10, mashed potatoes at noon. I\'m sober and [[a bit|very|deathly]] bored.', 'My rehab sponsor was called "{w:nickname}". He saved my life with metaphors about {w:animal}.'],
      }, fx: { happy: 4, health: 8, counter: 'rehab', fn: ({ life }) => { for (const k in life.addictions) life.addictions[k] = Math.max(0, life.addictions[k] - 55); } } },
      { w: 1, text: {
        fr: ['Je me suis enfui{|e} de la cure au bout de trois jours en escaladant le mur. Il y avait un bar juste en face.', "Évadé{|e} de la cure {w:time}, par la fenêtre des toilettes. Je n'ai même pas fini le cercle de parole.", "J'ai tenu [[deux|trois|cinq]] jours en désintox avant de me faire virer pour avoir caché {w:food} sous mon matelas.", "J'ai quitté la cure en pleine nuit, déguisé{|e} en infirmi{er|ère}. Le taxi m'a déposé{|e} directement au bar."],
        en: ['I escaped rehab after three days by climbing the wall. There was a bar right across the street.', 'I escaped rehab {w:time}, through the bathroom window. Didn\'t even finish the sharing circle.', 'I lasted [[two|three|five]] days in rehab before getting kicked out for hiding {w:food} under my mattress.', 'I left rehab in the middle of the night disguised as a nurse. The cab dropped me straight at the bar.'],
      }, fx: { happy: -3, fn: ({ life }) => { for (const k in life.addictions) life.addictions[k] = Math.max(0, life.addictions[k] - 10); } } },
    ] },
  { id: 'casino', tab: 'activities', group: 'vices', icon: '🃏', label: { fr: 'Jouer au blackjack', en: 'Play blackjack' }, when: { age: [18, 120] }, limit: 2, open: 'minigame:blackjack', scene: { place: 'casino' } },
  { id: 'slots', tab: 'activities', group: 'vices', icon: '🎰', label: { fr: 'Machines à sous', en: 'Slot machines' }, when: { age: [18, 120] }, limit: 3, cost: 100, scene: { place: 'casino' },
    out: [
      { w: 6, text: {
        fr: ['La machine a mangé mes jetons en clignotant joyeusement.', 'J\'ai perdu, mais la machine faisait de jolis bruits.', "La machine jouait {w:song} pendant qu'elle avalait mes jetons. Ambiance.", "Tout perdu en [[quatre|sept|douze]] minutes. La mamie d'à côté a tenu trois heures. Elle est meilleure que moi.", "J'ai crié « {w:exclaim} » à chaque tour. Le vigile m'a demandé de me calmer. J'ai perdu quand même."],
        en: ['The machine ate my chips, blinking happily.', 'I lost, but the machine made pretty noises.', 'The machine played {w:song} while swallowing my chips. Vibes.', 'Lost it all in [[four|seven|twelve]] minutes. The granny next to me lasted three hours. She\'s better than me.', 'I yelled "{w:exclaim}" on every spin. Security asked me to calm down. I lost anyway.'],
      }, fx: { happy: -2, addiction: ['gambling', 8] } },
      { w: 2, text: {
        fr: ['Trois cerises ! J\'ai doublé ma mise et crié comme un goret.', "Trois citrons ! Mise doublée. J'ai fêté ça avec {w:food} au buffet du casino.", "Petit gain aux machines. La machine a fait {w:sound}. Moi aussi.", "J'ai doublé ma mise et j'ai tout de suite arrêté. [[Je mens|Non|Ha ha]], j'ai tout rejoué dans la foulée."],
        en: ['Three cherries! Doubled my bet and squealed like a pig.', 'Three lemons! Bet doubled. Celebrated with {w:food} at the casino buffet.', 'Small win at the slots. The machine made {w:sound}. So did I.', 'I doubled my stake and quit right away. [[Just kidding|Nope|Ha ha]], I replayed it all on the spot.'],
      }, fx: { money: 200, happy: 5, addiction: ['gambling', 10] } },
      { w: 0.2, text: {
        fr: ['777 ! JACKPOT ! Les lumières, les sirènes, la vieille d\'à côté m\'a embrassé{|e} sur la bouche.', "777 ! JACKPOT ! J'ai hurlé « {w:exclaim} » et jeté des jetons en l'air comme un rappeur.", "JACKPOT ! Le casino m'a offert une suite, le buffet à volonté et un vigile qui ne me lâche plus d'une semelle.", "777 ! Dans ma tête, j'ai déjà acheté {w:vehicle} et une maison pour vivre {w:far_place}."],
        en: ['777! JACKPOT! Lights, sirens, the old lady next to me kissed me on the mouth.', '777! JACKPOT! I screamed "{w:exclaim}" and threw chips in the air like a rapper.', 'JACKPOT! The casino comped me a suite, the all-you-can-eat buffet and a security guard who won\'t leave my side.', '777! In my head I\'ve already bought {w:vehicle} and a house to live {w:far_place}.'],
      }, fx: { money: 50000, happy: 15, addiction: ['gambling', 20], visual: 'money' } },
    ] },
  { id: 'strip', tab: 'activities', group: 'vices', icon: '💃', rating: 2, label: { fr: 'Club de striptease', en: 'Strip club' }, when: { age: [18, 120] }, limit: 1, cost: 300,
    out: [
      { w: 2, text: {
        fr: ['J\'ai claqué mon salaire en billets de 5 glissés dans des strings. Le videur m\'appelle « mon prince ».', "J'ai claqué [[200|400|900]] balles en billets froissés. La danseuse m'a appelé{|e} « {w:nickname} » toute la soirée.", "La danseuse a fait son numéro sur {w:song}. Je ne pourrai plus jamais écouter cette chanson en famille.", "Lap dance : j'ai paniqué et lui ai demandé son avis sur {w:hobby}. Elle m'a fait une remise pour que je me taise."],
        en: ['I blew my paycheck in fives tucked into G-strings. The bouncer calls me "my prince".', 'I blew [[200|400|900]] bucks in crumpled bills. The dancer called me "{w:nickname}" all night.', 'The dancer did her routine to {w:song}. I can never listen to that song with family again.', 'Lap dance: I panicked and asked her opinion on {w:hobby}. She gave me a discount to shut up.'],
      }, fx: { happy: 6, karma: -1 } },
      { w: 1, text: {
        fr: ['Sur scène, la danseuse, c\'était ma prof de maths du collège. On s\'est reconnus. J\'ai payé pour qu\'elle arrête.', "La danseuse, c'était ma voisine. Elle m'a fait un clin d'œil. Je ne pourrai plus jamais lui rendre ses colis.", "Je me suis pris un talon aiguille dans l'œil pendant un numéro trop enthousiaste. Le videur a soupiré « {w:swear} ».", "Quelqu'un m'a filmé{|e} au premier rang, la bave aux lèvres. La vidéo a été projetée {w:time}."],
        en: ['The dancer on stage was my old math teacher. We recognised each other. I paid her to stop.', 'The dancer was my neighbor. She winked at me. I can never return her parcels again.', 'Took a stiletto to the eye during an overenthusiastic routine. The bouncer sighed "{w:swear}"', 'Someone filmed me in the front row, drooling. The video got screened {w:time}.'],
      }, fx: { happy: -4, stress: 6 } },
    ] },
  { id: 'escort', tab: 'activities', group: 'vices', icon: '💋', rating: 2, label: { fr: 'Appeler une escort', en: 'Call an escort' }, when: { age: [18, 120] }, limit: 1, cost: 400,
    out: [
      { w: 3, text: {
        fr: ['Une soirée « de compagnie » très professionnelle. Elle a regardé l\'heure trois fois et m\'a laissé une note de satisfaction de 2/5.', "Soirée tarifée {w:at_place}. Elle a passé la moitié du temps au téléphone avec sa mère.", "Une heure « de compagnie ». Elle m'a appelé{|e} « {w:nickname} » et a vérifié mes billets à la lampe UV.", "J'ai payé une escort et on a fini par jouer [[au Uno|à Mario Kart|à la belote]] toute la nuit. Meilleure soirée depuis des mois."],
        en: ['A very professional "companionship" evening. She checked the time three times and left me a 2/5 rating.', 'Paid evening {w:at_place}. She spent half the time on the phone with her mom.', 'An hour of "companionship". She called me "{w:nickname}" and checked my bills under a UV light.', 'I paid an escort and we ended up playing [[Uno|Mario Kart|cards]] all night. Best night in months.'],
      }, fx: { happy: 4, karma: -2 } },
      { w: 1, text: {
        fr: ['Ça me brûle quand je fais pipi. Merci pour le souvenir.', "Démangeaisons atroces dès le lendemain. Je me gratte comme {w:animal}.", "Le médecin a regardé mes parties, a soupiré et a lâché « {w:swear} ». Pas bon signe.", "Souvenir de la soirée : une IST et une ordonnance longue comme [[le bras|un menu de brasserie|le Code civil]]."],
        en: ['It burns when I pee. Thanks for the souvenir.', 'Horrible itching the very next day. I\'m scratching like {w:animal}.', 'The doctor looked at my privates, sighed and let out "{w:swear}" Not a good sign.', 'Souvenir from the night: an STD and a prescription as long as [[my arm|a diner menu|a phone book]].'],
      }, fx: { disease: 'std', happy: -6 } },
      { w: 0.6, text: {
        fr: ['C\'était un flic infiltré. Les menottes, c\'était pas pour jouer.', "« Escort » infiltrée : elle a sorti son badge pile quand je sortais mon portefeuille.", "Descente de police {w:time}. Embarqué{|e} en caleçon devant tout l'hôtel.", "Opération de police. Le flic s'appelait « {w:nickname} » sur l'appli. J'aurais dû me méfier [[un peu|beaucoup|dès la photo]]."],
        en: ['It was an undercover cop. The handcuffs were not for fun.', 'Undercover "escort": she pulled out her badge just as I pulled out my wallet.', 'Police raid {w:time}. Hauled off in my underwear in front of the whole hotel.', 'Police sting. The cop\'s username on the app was "{w:nickname}". I should have been suspicious [[a bit|a lot|from the photo]].'],
      }, fx: { arrest: 'vandal', visual: 'police' } },
    ] },

  // ───────── Body
  { id: 'surgery', tab: 'activities', group: 'body', icon: '💉', label: { fr: 'Chirurgie esthétique', en: 'Plastic surgery' }, when: { age: [18, 100] }, limit: 1, cost: 6000, scene: { place: 'hospital' },
    out: [
      { w: 4, text: {
        fr: ['Nouveau nez, nouvelle vie. Je ressemble presque à mon filtre Instagram.', 'Lifting complet. Je ne peux plus fermer les yeux, mais quel regard !', "Rhinoplastie réussie. Dans la rue, on me prend pour {w:celeb}.", "Opération réussie {w:time}. Le chirurgien a signé mon menton comme une œuvre d'art.", "Nouveau visage. Ma propre mère m'a demandé [[qui j'étais|mes papiers|si on se connaissait]]."],
        en: ['New nose, new me. I almost look like my Instagram filter.', 'Full facelift. I can\'t close my eyes anymore, but what a look!', 'Successful nose job. People on the street mistake me for {w:celeb}.', 'Successful surgery {w:time}. The surgeon signed my chin like a work of art.', 'New face. My own mother asked [[who I was|for my ID|if we\'d met]].'],
      }, fx: { looks: 12, happy: 6, counter: 'surgeries' } },
      { w: 1, rating: 2, text: {
        fr: ['Le chirurgien était bourré. On m\'a greffé une fesse sur la joue. Mon visage ressemble à un sac de nouilles écrasé et je saigne par le nombril.', "Le chirurgien a confondu les dossiers : on m'a posé des implants de mollets dans le front. Le sang a giclé jusque sur {w:object}.", "Le bistouri a dérapé {w:time}. J'ai désormais une oreille dans le cou, et l'anesthésiste a dit « {w:swear} ».", "Lifting low-cost : ma peau est tellement tirée que mon nombril est remonté [[au menton|aux clavicules|sous l'oreille]]. Et ça suinte."],
        en: ['The surgeon was drunk. They grafted a butt cheek onto my face. My face looks like a squashed bag of noodles and I\'m bleeding from my belly button.', 'The surgeon mixed up the files: I got calf implants in my forehead. Blood squirted all the way onto {w:object}.', 'The scalpel slipped {w:time}. I now have an ear on my neck, and the anesthetist said "{w:swear}"', 'Budget facelift: my skin is so tight my belly button moved up [[to my chin|to my collarbone|under my ear]]. And it oozes.'],
      }, fx: { looks: -18, health: -10, visual: 'gore', counter: 'surgeries' }, mood: 'cry' },
      { w: 1, text: {
        fr: ['Botox raté : j\'ai l\'air perpétuellement surpris{|e}. Même à l\'enterrement de mon oncle.', "Botox raté : une paupière tombe, l'autre non. Je fais un clin d'œil permanent à [[tout le monde|mon banquier|ma grand-mère]].", "Lèvres trop gonflées. Un enfant m'a demandé si j'étais {w:animal}.", "Mon nouveau nez siffle quand je respire. Il joue presque {w:song}."],
        en: ['Botched botox: I look permanently surprised. Even at my uncle\'s funeral.', 'Botched botox: one eyelid droops, the other doesn\'t. I\'m permanently winking at [[everyone|my banker|my grandma]].', 'Overinflated lips. A kid asked if I was {w:animal}.', 'My new nose whistles when I breathe. It almost plays {w:song}.'],
      }, fx: { looks: -5, counter: 'surgeries' } },
    ] },
  { id: 'lipo', tab: 'activities', group: 'body', icon: '🧈', label: { fr: 'Liposuccion', en: 'Liposuction' }, when: { age: [18, 100] }, limit: 1, cost: 5000, scene: { place: 'hospital' },
    out: [
      { w: 3, text: {
        fr: ['On m\'a aspiré huit litres de gras. Ils m\'ont proposé d\'en faire du savon.', "Liposuccion réussie : ils ont aspiré l'équivalent de [[trois|cinq|huit]] raclettes. Ma ceinture a pleuré de joie.", "Lipo terminée : j'ai perdu de quoi remplir {w:vehicle}. Le chirurgien était fier.", "Photo avant/après : sur l'après, on me confond avec {w:celeb}. Sur l'avant aussi, en fait."],
        en: ['They sucked out eight litres of fat. They offered to make soap out of it.', 'Successful lipo: they sucked out the equivalent of [[three|five|eight]] cheese fondues. My belt wept with joy.', 'Lipo done: I lost enough to fill {w:vehicle}. The surgeon was proud.', 'Before/after photo: in the "after", people mistake me for {w:celeb}. In the "before" too, actually.'],
      }, fx: { weight: -0.18, looks: 6, health: -2 } },
      { w: 1, rating: 2, text: {
        fr: ['La canule a percé un truc important. J\'ai giclé comme une bouteille de ketchup sur l\'interne.', "La machine a refoulé {w:time} : du gras tiède a giclé sur toute l'équipe médicale.", "Le chirurgien a aspiré un bout de foie au passage. Il l'a rangé dans le frigo du service, avec {w:food}.", "J'ai saigné comme un porc pendant [[deux|trois|six]] heures. L'interne a hurlé « {w:swear} » et s'est évanoui."],
        en: ['The cannula pierced something important. I squirted like a ketchup bottle all over the intern.', 'The suction machine backfired {w:time}: warm fat sprayed the entire medical team.', 'The surgeon sucked out a bit of liver along the way. He put it in the ward fridge, next to {w:food}.', 'I bled like a stuck pig for [[two|three|six]] hours. The intern screamed "{w:swear}" and fainted.'],
      }, fx: { weight: -0.08, health: -15, visual: 'gore' } },
    ] },
  { id: 'therapy', tab: 'activities', group: 'mind', icon: '🛋️', label: { fr: 'Voir un psy', en: 'See a therapist' }, when: { age: [8, 120] }, limit: 2, cost: 90,
    out: [
      { w: 3, text: {
        fr: ['Une heure à parler de ma mère. Le psy a hoché la tête 47 fois. Je me sens mieux.', 'Le psy m\'a dit que mes problèmes venaient de mon enfance. Comme d\'hab.', "Séance de psy : j'ai raconté mon rêve récurrent avec {w:animal}. Le psy a pris beaucoup de notes.", "Le psy m'a fait dessiner ma famille. J'ai dessiné tout le monde en [[pingouins|patates|robots]]. Il a dit « intéressant ».", "Thérapie {w:time} : j'ai pleuré, j'ai ri, et j'ai appris à respirer par le ventre."],
        en: ['An hour talking about my mother. The therapist nodded 47 times. I feel better.', 'The therapist said my problems come from my childhood. As usual.', 'Therapy: I described my recurring dream with {w:animal}. The therapist took a lot of notes.', 'The therapist had me draw my family. I drew everyone as [[penguins|potatoes|robots]]. He said "interesting".', 'Therapy {w:time}: I cried, I laughed, and I learned belly breathing.'],
      }, fx: { happy: 6, stress: -12, fn: ({ life, rand }) => { const d = life.conditions.find((c) => c.id === 'depression' || c.id === 'anxiety' || c.id === 'ptsd'); if (d && rand() < 0.35) life.conditions = life.conditions.filter((x) => x !== d); } } },
      { w: 1, text: {
        fr: ['Mon psy s\'est endormi. Je lui ai quand même payé la séance.', "Mon psy a passé la séance à me raconter ses vacances {w:far_place}. J'ai payé.", "[[Huit|Douze|Quarante]] fois de suite : « Et vous, qu'en pensez-vous ? ». Je n'en sais rien, c'est pour ça que je paie.", "Séance gâchée : le psy mangeait {w:food} et m'a demandé de parler plus fort pour couvrir la mastication."],
        en: ['My therapist fell asleep. I still paid for the session.', 'My therapist spent the session telling me about his vacation {w:far_place}. I paid.', '[[Eight|Twelve|Forty]] times in a row: "And what do you think?" I don\'t know, that\'s why I\'m paying.', 'Wasted session: the therapist was eating {w:food} and asked me to speak up over the chewing.'],
      }, fx: { happy: -1 } },
    ] },
  { id: 'vacation', tab: 'activities', group: 'fun', icon: '🏝️', label: { fr: 'Partir en vacances', en: 'Go on vacation' }, when: { age: [18, 120] }, limit: 1, cost: 2500, scene: { place: 'beach' },
    out: [
      { w: 4, text: {
        fr: ['Une semaine aux Baléares. Coup de soleil en forme de maillot, mais heureux{|se}.', 'Road trip en Italie : des pâtes, des églises, et un vol de portefeuille à Naples.', 'Vacances au ski : je suis rentré{|e} avec un genou en moins et un moniteur en plus.', "Vacances {w:far_place} : j'ai vu des merveilles, mangé {w:food} tous les jours et ramené un aimant de frigo.", "Une semaine de plage {w:weather}. Le seul jour de soleil, je dormais [[jusqu'à 16 h|toute la journée|dans la voiture]]."],
        en: ['A week in the Balearics. Swimsuit-shaped sunburn, but happy.', 'Italian road trip: pasta, churches, and a stolen wallet in Naples.', 'Ski trip: came back with one knee less and a ski instructor more.', 'Vacation {w:far_place}: saw wonders, ate {w:food} every day and brought back a fridge magnet.', 'A week at the beach {w:weather}. On the one sunny day, I slept [[until 4pm|all day|in the car]].'],
      }, fx: { happy: 12, stress: -15 } },
      { w: 1, text: {
        fr: ['Turista sévère au Mexique. J\'ai vu les toilettes de l\'hôtel plus que la plage.', "Valise perdue. J'ai passé les vacances {w:far_place} avec le même t-shirt. Il tient debout tout seul.", "Intoxication alimentaire après {w:food} du buffet. J'ai plus vu les toilettes que la piscine.", "Coup de soleil au [[troisième|quatrième|cinquième]] degré. Je ressemble à un homard qui regrette ses choix."],
        en: ['Severe Montezuma\'s revenge in Mexico. Saw the hotel toilet more than the beach.', 'Lost luggage. I spent the vacation {w:far_place} in the same T-shirt. It stands up by itself.', 'Food poisoning after {w:food} from the buffet. Saw more of the toilet than the pool.', 'Sunburn of the [[third|fourth|fifth]] degree. I look like a lobster regretting its choices.'],
      }, fx: { happy: -3, health: -4, visual: 'poop' } },
      { w: 0.2, rating: 2, text: { fr: '', en: '' }, fx: { die: { fr: 'dévoré{|e} par un requin pendant un selfie, en Australie', en: 'eaten by a shark while taking a selfie in Australia' } } },
    ] },
  { id: 'adopt_more', tab: 'activities', group: 'fun', icon: '🐈', label: { fr: 'Promener un chien du refuge', en: 'Walk a shelter dog' }, when: { age: [10, 100] }, limit: 1,
    out: [{ text: {
      fr: ['J\'ai promené un vieux chien du refuge. Il a pété tout le long. On s\'est compris.', "J'ai promené un chien du refuge {w:weather}. Il a reniflé chaque poteau. Chacun. Un par un.", "Le chien du refuge s'appelait « {w:nickname} ». Il m'a traîné{|e} jusqu'au parc. On a couru. Je ne cours jamais.", "J'ai promené un chien à trois pattes. Il allait plus vite que moi. [[Humiliant|Instructif|Magnifique]]."],
      en: ['I walked an old shelter dog. He farted the whole way. We bonded.', 'I walked a shelter dog {w:weather}. He sniffed every post. Every. Single. One.', 'The shelter dog was called "{w:nickname}". He dragged me to the park. We ran. I never run.', 'I walked a three-legged dog. He was faster than me. [[Humbling|Educational|Beautiful]].'],
    }, fx: { happy: 4, karma: 3 } }] },

  // ───────── Social media
  { id: 'post', tab: 'activities', group: 'social', icon: '📱', label: { fr: 'Poster sur les réseaux', en: 'Post on social media' }, when: { age: [13, 120], era: [2006, 3000] }, limit: 3,
    out: [
      { w: 4, odds: { looks: 0.8 }, text: {
        fr: ['J\'ai posté un selfie avec la bouche en canard. 12 likes, dont ma mère.', 'Photo de mon brunch : avocado toast et désespoir.', "J'ai posté {w:food} sous [[trois|cinq|huit]] filtres. 17 likes, dont deux bots.", "Selfie {w:weather} avec la légende « vibes ». Ma tante a commenté « tu vas attraper froid ».", "J'ai partagé une citation inspirante sur fond de coucher de soleil. Trois personnes ont été inspirées. Peut-être."],
        en: ['Posted a duckface selfie. 12 likes, including my mom.', 'Photo of my brunch: avocado toast and despair.', 'Posted {w:food} under [[three|five|eight]] filters. 17 likes, two of them bots.', 'Selfie {w:weather} captioned "vibes". My aunt commented "you\'ll catch a cold".', 'Shared an inspiring quote over a sunset background. Three people were inspired. Maybe.'],
      }, fx: { followers: 40, happy: 2 } },
      { w: 1, odds: { looks: 1, fame: 1 }, text: {
        fr: ['Ma vidéo de chat qui tombe d\'une étagère a fait 3 millions de vues ! Je suis une star d\'internet.', "Ma vidéo avec {w:animal} qui danse sur {w:song} a fait des millions de vues !", "J'ai filmé ma chute dans une flaque {w:weather}. Douze millions de vues. Célèbre et trempé{|e}.", "Mon tuto « [[faire ses lacets|plier un t-shirt|cuire des pâtes]] en 3 secondes » est devenu viral. On me reconnaît dans la rue."],
        en: ['My video of a cat falling off a shelf got 3 million views! I\'m internet famous.', 'My video of {w:animal} dancing to {w:song} got millions of views!', 'I filmed myself falling into a puddle {w:weather}. Twelve million views. Famous and soaked.', 'My "[[tie your shoes|fold a T-shirt|cook pasta]] in 3 seconds" tutorial went viral. People recognize me on the street.'],
      }, fx: { followers: 25000, fame: 6, happy: 8, visual: 'confetti' } },
      { w: 0.6, rating: 1, text: {
        fr: ['Un vieux tweet de 2012 a refait surface. Les internautes demandent ma tête sur un plateau.', "Un vieux post où j'affirmais {w:conspiracy} a refait surface. Internet n'oublie rien.", "Une vieille capture où je clashais {w:celeb} a fuité. Ses fans veulent ma peau.", "Mon post ironique a été pris au premier degré par [[200 000|un million de|trois millions de]] personnes. Excuses publiques en cours."],
        en: ['An old tweet from 2012 resurfaced. The internet wants my head on a plate.', 'An old post where I claimed {w:conspiracy} resurfaced. The internet never forgets.', 'An old screenshot of me roasting {w:celeb} leaked. Their fans want my head.', 'My ironic post was taken literally by [[200,000|a million|three million]] people. Public apology in progress.'],
      }, fx: { followers: -2000, happy: -8, fame: 2 } },
    ] },
  { id: 'live', tab: 'activities', group: 'social', icon: '🎥', label: { fr: 'Faire un live en streaming', en: 'Go live on stream' }, when: { age: [13, 120], era: [2014, 3000], followers: [200, 1e12] }, limit: 2,
    out: [
      { w: 3, text: {
        fr: ['Live de 6 heures à jouer et à répondre au chat. Un mec m\'a donné 50 balles pour que je mange un piment.', "Live de [[3|5|8]] heures : le chat m'a fait {w:activity} en direct. +1 200 abonnés.", "J'ai streamé {w:time} en mangeant {w:food}. Les dons ont plu, je ne sais pas pourquoi.", "Un viewer m'a donné 100 balles pour que je chante {w:song}. J'ai chanté. J'ai honte. J'ai 100 balles."],
        en: ['6-hour stream answering chat. Some guy paid 50 bucks to watch me eat a chili.', '[[3|5|8]]-hour stream: chat had me {w:activity} live. +1,200 followers.', 'I streamed {w:time} while eating {w:food}. Donations poured in, no idea why.', 'A viewer paid 100 bucks for me to sing {w:song}. I sang. I\'m ashamed. I have 100 bucks.'],
      }, fx: { followers: 1500, money: 200, happy: 3 } },
      { w: 1, rating: 2, text: {
        fr: ['J\'ai oublié de couper le live en allant aux toilettes. 40 000 personnes ont entendu mon intestin s\'exprimer. Je suis viral{|e}.', "Caméra restée allumée pendant un rot monstrueux suivi d'un pet. Le clip s'appelle déjà « {w:nickname} en concert ».", "En plein live, {w:animal} a vomi sur mon clavier. 30 000 personnes ont vu ma réaction : {w:sound}.", "Diarrhée en plein live : j'ai couru aux toilettes, micro allumé. Le chat a écrit « RIP » [[pendant dix minutes|en boucle|en majuscules]]."],
        en: ['Forgot to end the stream while going to the toilet. 40,000 people heard my bowels speak. I went viral.', 'Camera left on during a monster burp followed by a fart. The clip is already titled "{w:nickname} Live in Concert".', 'Mid-stream, {w:animal} puked on my keyboard. 30,000 people saw my reaction: {w:sound}.', 'Diarrhea mid-stream: I ran to the toilet, mic still on. Chat typed "RIP" [[for ten minutes|on loop|in all caps]].'],
      }, fx: { followers: 30000, happy: -6, fame: 4, visual: 'poop' } },
    ] },
  { id: 'clout', tab: 'activities', group: 'social', icon: '💣', rating: 1, label: { fr: 'Lancer une polémique', en: 'Start a controversy' }, when: { age: [16, 120], era: [2008, 3000] }, limit: 1,
    out: [
      { w: 2, text: {
        fr: ['J\'ai déclaré que les pâtes carbonara se font à la crème. L\'Italie entière m\'a déclaré la guerre. +50 000 abonnés.', "J'ai posté que {w:food}, c'est [[le plat le plus surcoté de l'histoire|une insulte à la gastronomie|un crime contre l'humanité]]. Guerre civile en commentaires. +50 000 abonnés.", "J'ai affirmé en vidéo {w:conspiracy}. Les complotistes m'adorent, les autres me haïssent. Tous s'abonnent.", "J'ai lancé un clash contre {w:celeb}. Ses fans ont débarqué en masse. Moi, j'ai pris 50 000 abonnés."],
        en: ['I said carbonara is made with cream. All of Italy declared war on me. +50,000 followers.', 'I posted that {w:food} is [[the most overrated dish in history|an insult to cuisine|a crime against humanity]]. Civil war in the comments. +50,000 followers.', 'I claimed on video {w:conspiracy}. Conspiracy nuts love me, everyone else hates me. They all subscribe.', 'I started beef with {w:celeb}. Their fans stormed in. I gained 50,000 followers.'],
      }, fx: { followers: 50000, fame: 5, karma: -4 } },
      { w: 1, text: {
        fr: ['Ma polémique a fait un flop. Même les trolls m\'ont ignoré{|e}.', "J'ai attaqué {w:celeb} en vidéo. Zéro réaction. Pas même un pouce rouge.", "Polémique ratée : j'ai lancé un débat sur {w:hobby}. Trois commentaires, dont « ok ».", "J'ai posté un avis choc {w:time}. Il a fait [[2|5|9]] vues. Toutes de moi."],
        en: ['My controversy flopped. Even the trolls ignored me.', 'I trashed {w:celeb} on video. Zero reaction. Not even a thumbs-down.', 'Failed controversy: I started a debate about {w:hobby}. Three comments, one of them "ok".', 'I posted a hot take {w:time}. It got [[2|5|9]] views. All mine.'],
      }, fx: { happy: -5 } },
    ] },
  { id: 'buyfollowers', tab: 'activities', group: 'social', icon: '🤖', label: { fr: 'Acheter des abonnés', en: 'Buy followers' }, when: { age: [16, 120], era: [2010, 3000] }, limit: 1, cost: 800,
    out: [{ text: {
      fr: ['J\'ai acheté 20 000 abonnés. Ce sont tous des bots indonésiens qui commentent « nice pic » sous mes photos d\'enterrement.', "20 000 abonnés achetés. Ils s'appellent tous « {w:nickname}_8493 » et likent mes posts à 4 h du matin.", "J'ai acheté des abonnés. Mon dernier post sur {w:food} a reçu 20 000 likes et zéro commentaire humain.", "Abonnés achetés : [[20 000|une armée de|des milliers de]] comptes sans photo qui commentent « super contenu » en [[russe|portugais|binaire]]."],
      en: ['I bought 20,000 followers. All Indonesian bots commenting "nice pic" under my funeral photos.', 'Bought 20,000 followers. They\'re all named "{w:nickname}_8493" and like my posts at 4am.', 'I bought followers. My latest post about {w:food} got 20,000 likes and zero human comments.', 'Bought followers: [[20,000|an army of|thousands of]] faceless accounts commenting "great content" in [[Russian|Portuguese|binary]].'],
    }, fx: { followers: 20000, karma: -2 } }] },

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
