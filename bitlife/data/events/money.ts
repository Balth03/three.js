// Money & possessions events (16+): houses, cars, luxury, rich people problems, poverty,
// investing, business owners, influencers, windfalls, scams, taxes and gambling.
import type { EventDef } from '@bl/sim';

export const moneyEvents: EventDef[] = [
  // ───────────────────────────── house ─────────────────────────────
  {
    id: 'mo_termites',
    icon: '🐜',
    cat: 'house',
    rating: 0,
    vars: { amount: [2000, 9000] },
    scene: { place: 'home', mood: 'shock', prop: 'beam' },
    when: { age: [18, 99], asset: 'house' },
    weight: 8,
    cooldown: 8,
    text: {
      fr: ["Tu t'appuies contre la rambarde de l'escalier. Elle se transforme en sciure. Des termites ont fait de ta maison un buffet à volonté.", "Le parquet du salon sonne creux. Normal : il n'y a plus de parquet, juste une fine couche de vernis et dix mille termites repus.", "Tu ouvres le placard : {w:object} tombe en poussière. Derrière, des milliers de termites te regardent comme un serveur qui apporte l'addition.", "Un expert en bâtiment tapote ta charpente, pâlit et lâche « {w:exclaim} ». Il refuse de rester sous ton toit plus de [[deux minutes|trente secondes|le temps d'un éternuement]].", "Tes termites ont mangé la porte d'entrée pendant que tu étais {w:at_place}. Il ne reste que la poignée et le paillasson « Bienvenue ». Elles l'ont pris au mot."],
      en: ["You lean on the banister. It turns into sawdust. Termites have turned your house into an all-you-can-eat buffet.", "The living room floor sounds hollow. Of course it does: there's no floor left, just a thin coat of varnish and ten thousand well-fed termites.", "You open the closet: {w:object} crumbles to dust. Behind it, thousands of termites stare at you like a waiter bringing the check.", "A building inspector taps your rafters, goes pale and says '{w:exclaim}'. He refuses to stay under your roof for more than [[two minutes|thirty seconds|one sneeze]].", "Your termites ate the front door while you were {w:at_place}. Only the handle and the 'Welcome' mat are left. They took it literally."],
    },
    choices: [
      { label: { fr: 'Appeler un exterminateur', en: 'Call an exterminator' }, text: { fr: ["L'exterminateur a tout gazé, m'a facturé {$amount} et m'a dit « vous auriez dû m'appeler il y a cinq ans ». Merci, Nostradamus.", "L'exterminateur est arrivé en combinaison intégrale, a dit « {w:exclaim} » et m'a facturé {$amount}, dont une ligne « choc émotionnel »."], en: ["The exterminator gassed everything, charged me {$amount} and said 'you should have called me five years ago'. Thanks, Nostradamus.", "The exterminator showed up in a full hazmat suit, said '{w:exclaim}' and charged me {$amount}, including a line item for 'emotional distress'."] }, fx: { money: '-amount', stress: -4, happy: 2 } },
      {
        label: { fr: 'Traitement maison au vinaigre', en: 'DIY vinegar treatment' },
        out: [
          { w: 1, text: { fr: ["J'ai aspergé toute la maison de vinaigre blanc. Les termites sont parties. La maison sent la salade, pour toujours.", "Le vinaigre a marché. Les termites ont déménagé chez le voisin. Bizarrement, il ne m'a jamais remercié{|e}."], en: ["I sprayed the whole house with white vinegar. The termites left. The house smells like salad, forever.", "The vinegar worked. The termites moved next door. Strangely, the neighbor never thanked me."] }, fx: { money: -40, happy: 3 } },
          { w: 2, text: { fr: ["Mon traitement maison a surtout assaisonné les termites. Elles ont invité leurs cousines. Le plafond de la cuisine est tombé dans ma soupe.", "Mes termites adorent le vinaigre. Elles ont fait une fête. Le lendemain, il manquait {w:object} et la moitié de l'escalier."], en: ["My DIY treatment mostly seasoned the termites. They invited their cousins. The kitchen ceiling fell into my soup.", "My termites love vinegar. They threw a party. The next morning, {w:object} and half the staircase were missing."] }, fx: { money: '-amount', happy: -6, stress: 6 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Cohabiter avec elles', en: 'Learn to coexist' }, text: { fr: ["J'ai décidé de cohabiter. Les termites ont mangé ma table de chevet et mes plinthes, mais ont épargné mon lit. Par respect, je crois. On a un accord tacite.", "J'ai baptisé la reine des termites {w:nickname}. On s'entend bien. Elle a mangé ma bibliothèque, mais elle a épargné les livres que je n'avais pas lus."], en: ["I decided to coexist. The termites ate my nightstand and the baseboards but spared my bed. Out of respect, I think. We have an understanding.", "I named the termite queen {w:nickname}. We get along. She ate my bookcase, but she spared the books I hadn't read."] }, fx: { happy: -2, stress: 3, karma: 2 } },
    ],
  },
  {
    id: 'mo_haunted_basement',
    icon: '👻',
    cat: 'house',
    rating: 1,
    scene: { place: 'home', mood: 'shock', prop: 'candle', fx: 'ghost' },
    when: { age: [18, 99], asset: 'house', noFlag: 'mo_ghost_roommate' },
    weight: 5,
    once: true,
    text: {
      fr: ["Chaque nuit à 3 h 12, quelqu'un tire la chasse d'eau à la cave. Il n'y a pas de toilettes à la cave.", "Ta cave chuchote. Ce soir, elle a clairement dit « il reste du gratin ? ». Tu vis seul{|e}."],
      en: ["Every night at 3:12 a.m., someone flushes a toilet in the basement. There is no toilet in the basement.", "Your basement whispers. Tonight it clearly said 'is there any lasagna left?'. You live alone."],
    },
    choices: [
      {
        label: { fr: 'Faire venir un exorciste', en: 'Hire an exorcist' },
        out: [
          { w: 2, text: { fr: "Le prêtre a aspergé la cave d'eau bénite et a crié en latin. Le fantôme est parti. Le prêtre aussi, avec mon portefeuille.", en: 'The priest splashed holy water around and yelled in Latin. The ghost left. So did the priest, with my wallet.' }, fx: { money: -800, stress: -5, visual: 'ghost' } },
          { w: 1, text: { fr: "L'exorciste a vu le fantôme, a hurlé « NON, PAS LUI ! » et s'est enfui en laissant sa bible. Bon.", en: "The exorcist saw the ghost, screamed 'NO, NOT HIM!' and ran, leaving his bible behind. Okay then." }, fx: { stress: 10, happy: -4 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Lui proposer un bail', en: 'Offer it a lease' }, text: { fr: "J'ai descendu un contrat de location et un stylo. Le lendemain, il était signé d'une croix glacée. J'ai un coloc mort.", en: 'I left a lease and a pen in the basement. Next morning it was signed with an icy X. I have a dead roommate.' }, fx: { happy: 4, flag: 'mo_ghost_roommate', schedule: { key: 'mo_ghost_rent', years: 1 }, visual: 'ghost' } },
      { label: { fr: 'Condamner la porte', en: 'Brick up the door' }, text: { fr: "J'ai muré la porte de la cave. Maintenant, la chasse d'eau, c'est dans le grenier.", en: 'I bricked up the basement door. Now the flushing comes from the attic.' }, fx: { money: -300, stress: 6 } },
    ],
  },
  {
    id: 'mo_ghost_rent',
    icon: '👻',
    cat: 'house',
    rating: 1,
    chainOnly: true,
    vars: { amount: [400, 3000] },
    scene: { place: 'home', mood: 'happy', prop: 'coins', fx: 'ghost' },
    when: { flag: 'mo_ghost_roommate' },
    text: {
      fr: ["Un an de colocation avec ton fantôme. Ce matin, une pile de pièces anciennes t'attend sur la table, avec un mot : « loyer + ménage du grenier ».", "Ton coloc fantôme frappe trois coups sous la table. Bilan annuel ?"],
      en: ['One year living with your ghost. This morning a pile of antique coins sits on the table with a note: "rent + attic cleaning".', 'Your ghost roommate knocks three times under the table. Annual review?'],
    },
    choices: [
      { label: { fr: 'Encaisser le loyer', en: 'Collect the rent' }, text: { fr: "Les pièces du fantôme valaient {$amount} chez le numismate. Meilleur locataire de l'histoire : jamais de bruit, jamais de retard, jamais de pouls.", en: 'The ghost coins were worth {$amount} at the coin dealer. Best tenant ever: never loud, never late, never a pulse.' }, fx: { money: 'amount', happy: 6, visual: 'money' } },
      { label: { fr: 'Augmenter le loyer', en: 'Raise the rent' }, text: { fr: "J'ai augmenté le loyer de 20 %. Le fantôme m'a hanté{|e} toute la nuit en me montrant des graphiques sur l'inflation. Il est parti. Je suis devenu{|e} un propriétaire.", en: 'I raised the rent 20%. The ghost haunted me all night with inflation charts. It moved out. I have become a landlord.' }, fx: { unflag: 'mo_ghost_roommate', karma: -5, stress: 8 } },
    ],
  },
  {
    id: 'mo_neighbours_hell',
    icon: '🤬',
    cat: 'house',
    rating: 2,
    scene: { place: 'home', mood: 'angry', prop: 'speaker' },
    when: { age: [18, 99], asset: 'house' },
    weight: 8,
    cooldown: 6,
    text: {
      fr: ["Tes nouveaux voisins élèvent une chèvre, font du karaoké death metal jusqu'à 4 h et taillent leur haie torse nu en te fixant. Ce matin, la chèvre a chié sur ton paillasson. En forme de cœur.", "Le voisin a installé un jacuzzi face à ta fenêtre de cuisine. Il y passe ses soirées avec trois potes, en slip, à manger des kebabs dans l'eau. Les miettes flottent."],
      en: ["Your new neighbours keep a goat, do death-metal karaoke until 4 a.m. and trim their hedge shirtless while staring at you. This morning the goat took a dump on your doormat. Heart-shaped.", "The neighbour put a hot tub right in front of your kitchen window. He spends his evenings in it with three buddies, in briefs, eating kebabs in the water. The crumbs float."],
    },
    choices: [
      {
        label: { fr: 'Guerre totale', en: 'Total war' },
        out: [
          { w: 2, text: { fr: "J'ai répondu par un concert d'accordéon à 6 h du mat' et une livraison de fumier de cheval sur leur pelouse. Ils ont déménagé. La chèvre est restée. Elle est à moi maintenant.", en: 'I retaliated with a 6 a.m. accordion recital and a truckload of horse manure on their lawn. They moved out. The goat stayed. She is mine now.' }, fx: { happy: 10, karma: -5, visual: 'poop', newNpc: { role: 'pet', species: 'goat' } }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai crevé les pneus du voisin. C'était les pneus d'un flic en civil. Il trouve que je suis « une personne intéressante ».", en: 'I slashed the neighbour\'s tyres. Turns out they belonged to an off-duty cop. He now finds me "a person of interest".' }, fx: { heat: 15, happy: -4, money: -500 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Rejoindre le jacuzzi', en: 'Join the hot tub' }, text: { fr: "Je suis allé{|e} dans le jacuzzi. Kebab, bière tiède, chèvre qui regarde. Honnêtement ? Meilleure soirée de l'année. J'ai attrapé une mycose.", en: 'I got in the hot tub. Kebab, warm beer, goat watching. Honestly? Best night of the year. I caught a fungal infection.' }, fx: { happy: 8, health: -4, stress: -6 } },
      { label: { fr: 'Écrire au syndic', en: 'Write a formal letter' }, text: { fr: "J'ai rédigé une lettre de quatre pages en Times New Roman. Ils l'ont utilisée pour allumer le barbecue. Sous ma fenêtre.", en: 'I wrote a four-page letter in Times New Roman. They used it to light the barbecue. Under my window.' }, fx: { stress: 8, happy: -5 } },
    ],
  },
  {
    id: 'mo_flood',
    icon: '🌊',
    cat: 'house',
    rating: 0,
    vars: { amount: [3000, 15000] },
    scene: { place: 'home', mood: 'shock', prop: 'bucket' },
    when: { age: [18, 99], asset: 'house' },
    weight: 7,
    cooldown: 8,
    text: {
      fr: ["Un tuyau a éclaté pendant la nuit. Ton salon est devenu une piscine municipale. Un canard en plastique passe devant la télé.", "Orage biblique : ta cave est inondée jusqu'au plafond. Tes cartons de souvenirs flottent comme des petits radeaux tristes.", "Ce matin, ton salon est inondé jusqu'aux genoux. Devant la télé flotte {w:object}. Un voisin demande s'il peut venir pêcher.", "Le voisin du dessus a laissé couler son bain avant de partir deux semaines {w:far_place}. Ton plafond pleut. Ton canapé est une éponge. Ta plante verte n'a jamais été aussi heureuse.", "Après {w:disaster}, ta maison a pris l'eau. Il y a {w:animal} qui nage dans ta cuisine. Ça a l'air de lui plaire."],
      en: ["A pipe burst overnight. Your living room is now a public swimming pool. A rubber duck drifts past the TV.", "Biblical storm: your basement is flooded to the ceiling. Your boxes of memories float by like sad little rafts.", "This morning, your living room is flooded knee-deep. Floating past the TV: {w:object}. A neighbor asks if he can come fishing.", "The upstairs neighbor left his bath running before jetting off for two weeks {w:far_place}. Your ceiling is raining. Your couch is a sponge. Your houseplant has never been happier.", "After {w:disaster}, your house took on water. There's {w:animal} swimming in your kitchen. It seems to like it."],
    },
    choices: [
      {
        label: { fr: "Appeler l'assurance", en: 'Call the insurance' },
        out: [
          { w: 2, text: { fr: ["L'assurance a tout remboursé après seulement onze formulaires, quatre photos et une chanson de mon choix au téléphone.", "L'assurance a tout remboursé, mais m'a envoyé un expert qui a passé deux heures à photographier {w:object} sans m'expliquer pourquoi."], en: ["The insurance paid for everything after only eleven forms, four photos and a song of my choice over the phone.", "Insurance covered everything, but sent an assessor who spent two hours photographing {w:object} without explaining why."] }, fx: { stress: 5, happy: 2 } },
          { w: 1, text: { fr: ["L'assurance a refusé : mon contrat couvre les inondations « sauf celles avec de l'eau ». J'ai payé {$amount} de ma poche.", "L'assurance a refusé : l'inondation a eu lieu « un jour férié non couvert ». J'ai payé {$amount}. J'ai résilié. Ils m'ont facturé la résiliation."], en: ["The insurer refused: my policy covers floods 'except those involving water'. I paid {$amount} out of pocket.", "The insurer refused: the flood happened 'on a non-covered public holiday'. I paid {$amount}. I canceled. They charged me for canceling."] }, fx: { money: '-amount', stress: 10, happy: -6 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Écoper soi-même', en: 'Bail it out myself' }, text: { fr: ["J'ai écopé pendant trois jours avec une casserole. J'ai des bras de rameur olympique et une moquette qui pousse des champignons.", "J'ai écopé avec {w:object} pendant deux jours. Ça n'a servi à rien, mais j'ai trouvé un rythme. J'ai même chanté."], en: ["I bailed for three days with a saucepan. I have the arms of an Olympic rower and a carpet growing mushrooms.", "I bailed with {w:object} for two days. It was useless, but I found a rhythm. I even sang."] }, fx: { athletic: 5, health: -3, money: -600 } },
      { label: { fr: 'Ouvrir un parc aquatique', en: 'Open a water park' }, text: { fr: ["J'ai fait payer l'entrée aux gamins du quartier pour sauter dans mon salon. Rentable, jusqu'à ce que le canapé coule.", "J'ai organisé une « pool party » dans mon salon avec {w:drink} à volonté. Les pompiers sont venus. Ils sont restés."], en: ["I charged the neighbourhood kids to jump into my living room. Profitable, until the couch sank.", "I threw a pool party in my living room with {w:drink} on tap. The firefighters came. They stayed."] }, fx: { money: 200, happy: 6, karma: -2 } },
    ],
  },
  {
    id: 'mo_burglary',
    icon: '🦹',
    cat: 'house',
    rating: 1,
    scene: { place: 'home', mood: 'shock', prop: 'flashlight', fx: 'police' },
    when: { age: [18, 99], asset: 'house' },
    weight: 6,
    cooldown: 8,
    text: {
      fr: ["2 h du matin. Bruit de verre cassé au rez-de-chaussée. Quelqu'un est en train de débrancher ta télé en chuchotant « putain, c'est lourd ».", "Tu rentres de week-end : la porte est ouverte, le frigo est vide et quelqu'un a fait une sieste dans ton lit. Puis tu entends la chasse d'eau."],
      en: ["2 a.m. Breaking glass downstairs. Someone is unplugging your TV, whispering 'damn, this thing is heavy'.", 'You come home from a weekend away: door open, fridge empty, someone napped in your bed. Then you hear the toilet flush.'],
    },
    choices: [
      {
        label: { fr: 'Batte de baseball', en: 'Grab the baseball bat' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai surgi avec ma batte en hurlant comme un guerrier viking. Le cambrioleur s'est enfui en caleçon, en laissant son pantalon et son portefeuille.", en: 'I burst in with my bat screaming like a Viking. The burglar fled in his boxers, leaving his pants and his wallet.' }, fx: { happy: 8, money: 150, fame: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai raté mon swing, défoncé ma propre télé et me suis cogné{|e} contre la table basse. Le voleur a pris le reste en me souhaitant bon rétablissement.", en: 'I missed my swing, smashed my own TV and knocked myself out on the coffee table. The burglar took the rest and wished me a speedy recovery.' }, fx: { health: -10, money: -2000, disease: 'concussion' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Appeler la police', en: 'Call the police' }, text: { fr: "La police est arrivée 47 minutes plus tard, a constaté le vol, a mangé les biscuits qui restaient et m'a conseillé « une alarme ».", en: "The police arrived 47 minutes later, noted the theft, ate the remaining cookies and advised me to 'get an alarm'." }, fx: { money: -1500, stress: 6 } },
      { label: { fr: 'Faire le mort', en: 'Play dead' }, text: { fr: "Je suis resté{|e} sous la couette sans respirer. Ils ont tout pris, même mes plantes. Mais ils ont fait la vaisselle. Bizarre.", en: 'I stayed under the duvet without breathing. They took everything, even my plants. But they did the dishes. Weird.' }, fx: { money: -2500, happy: -6, stress: 8 } },
    ],
  },
  {
    id: 'mo_renovation_fail',
    icon: '🔨',
    cat: 'house',
    rating: 0,
    vars: { amount: [5000, 25000] },
    scene: { place: 'home', mood: 'shock', prop: 'hammer' },
    when: { age: [20, 99], asset: 'house' },
    weight: 7,
    cooldown: 6,
    text: {
      fr: ["Tu veux abattre une cloison pour faire une « cuisine ouverte ». Ton beau-frère dit qu'il s'y connaît. Il a regardé une vidéo.", "Un artisan te propose de refaire ta salle de bain « au black, en trois jours, sans souci ». Il a un seul tournevis et une haleine de pastis."],
      en: ["You want to knock down a wall for an 'open-plan kitchen'. Your brother-in-law says he knows what he's doing. He watched a video.", "A contractor offers to redo your bathroom 'cash, three days, no worries'. He owns one screwdriver and his breath smells of pastis."],
    },
    choices: [
      {
        label: { fr: 'Faire les travaux', en: 'Go for it' },
        out: [
          { w: 1, text: { fr: "C'était un mur porteur. La chambre du haut est maintenant au rez-de-chaussée. J'ai une cuisine très, très ouverte. Coût : {$amount}.", en: 'It was a load-bearing wall. The upstairs bedroom is now downstairs. My kitchen is very, very open. Cost: {$amount}.' }, fx: { money: '-amount', happy: -8, stress: 12 }, mood: 'shock' },
          { w: 1, text: { fr: "Contre toute attente, c'est magnifique. J'ai posté la photo avant/après. Mon beau-frère se prend désormais pour un architecte.", en: 'Against all odds, it looks gorgeous. I posted the before/after. My brother-in-law now thinks he is an architect.' }, fx: { happy: 10, money: -2000, followers: 300 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Engager des pros', en: 'Hire professionals' }, text: { fr: "Les pros ont mis huit mois au lieu de deux et m'ont facturé le double. Mais la maison tient debout, ce qui n'était pas garanti.", en: "The pros took eight months instead of two and billed double. But the house is still standing, which wasn't a given." }, fx: { money: '-amount', happy: 4, stress: 6 } },
      { label: { fr: 'Juste repeindre', en: 'Just repaint' }, text: { fr: "J'ai repeint en « gris taupe ». Tout le monde repeint en gris taupe. Je suis devenu{|e} adulte.", en: "I repainted in 'greige'. Everyone paints in greige. I have become an adult." }, fx: { money: -200, happy: 2 } },
    ],
  },
  {
    id: 'mo_airbnb',
    icon: '🛎️',
    cat: 'house',
    rating: 2,
    vars: { amount: [2000, 12000] },
    scene: { place: 'home', mood: 'shock', prop: 'keys', fx: 'poop' },
    when: { age: [18, 99], asset: 'house' },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Tu loues ta maison sur Airbnb pour le week-end. Les invités : « un petit groupe calme de six personnes, pour un anniversaire ». Profil : 0 avis, photo d'un aigle.", "Ton locataire Airbnb te laisse un avis 5 étoiles : « Super maison ! Désolé pour le cheval. »"],
      en: ["You rent your house on Airbnb for the weekend. Guests: 'a small quiet group of six, for a birthday'. Profile: 0 reviews, photo of an eagle.", "Your Airbnb guest leaves you a 5-star review: 'Great house! Sorry about the horse.'"],
    },
    choices: [
      {
        label: { fr: 'Aller voir', en: 'Go check' },
        out: [
          { w: 2, text: { fr: "Il y avait 140 personnes, un DJ sur mon frigo, quelqu'un qui vomissait dans l'aquarium et une piscine gonflable remplie de chili con carne. Un type nu m'a demandé si j'étais le traiteur. Dégâts : {$amount}.", en: "There were 140 people, a DJ on my fridge, someone puking into the fish tank and an inflatable pool full of chili con carne. A naked guy asked if I was the caterer. Damage: {$amount}." }, fx: { money: '-amount', happy: -10, stress: 12, visual: 'poop' }, mood: 'shock' },
          { w: 1, text: { fr: "Le « petit groupe calme » était un congrès de clowns. Il y avait du maquillage blanc partout, une crotte dans ma baignoire et un clown coincé dans la cheminée. Je l'ai laissé.", en: "The 'small quiet group' was a clown convention. White face paint everywhere, a turd in my bathtub and a clown stuck in the chimney. I left him there." }, fx: { money: '-amount', happy: -6, karma: -2, visual: 'poop' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Encaisser et ne rien voir', en: 'Cash in, see nothing' }, text: { fr: "J'ai encaissé et je ne suis pas rentré{|e} pendant une semaine. Quand j'ai ouvert la porte, l'odeur m'a fait pleurer d'un seul œil. L'autre avait abandonné.", en: "I took the money and didn't go home for a week. When I opened the door, the smell made one eye cry. The other one had given up." }, fx: { money: 600, happy: -6, health: -3 } },
      { label: { fr: 'Annuler la résa', en: 'Cancel the booking' }, text: { fr: "J'ai annulé. L'aigle m'a laissé un avis 1 étoile : « hôte instable, aucune vision ». Il a peut-être raison.", en: "I cancelled. The eagle left me a 1-star review: 'unstable host, no vision'. He might be right." }, fx: { happy: -2, stress: -3 } },
    ],
  },
  {
    id: 'mo_landlord',
    icon: '🧛',
    cat: 'house',
    rating: 2,
    vars: { amount: [600, 3000] },
    scene: { place: 'apartment', mood: 'angry', prop: 'letter' },
    when: { age: [18, 70], movedOut: true, noAsset: 'house' },
    weight: 9,
    cooldown: 4,
    text: {
      fr: ["Ton proprio augmente le loyer de 30 % « à cause du marché ». Le « marché », c'est son troisième jet-ski. Il ne répare toujours pas la moisissure, qu'il appelle « une texture ».", "Ton propriétaire débarque sans prévenir à 7 h du mat' « pour vérifier les détecteurs de fumée ». Il ouvre ton frigo. Il goûte ton houmous."],
      en: ["Your landlord raises the rent 30% 'because of the market'. The 'market' is his third jet ski. He still won't fix the mould, which he calls 'a texture'.", "Your landlord barges in unannounced at 7 a.m. 'to check the smoke detectors'. He opens your fridge. He tastes your hummus."],
    },
    choices: [
      { label: { fr: 'Payer en serrant les dents', en: 'Pay through gritted teeth' }, text: { fr: "J'ai payé. {$amount} de plus par an pour financer le bronzage d'un parasite en mocassins. Le capitalisme, c'est beau.", en: 'I paid. An extra {$amount} a year to fund the tan of a parasite in loafers. Capitalism is beautiful.' }, fx: { money: '-amount', happy: -6, stress: 6 } },
      {
        label: { fr: 'Le menacer d\'un avocat', en: 'Threaten a lawyer' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai cité trois articles de loi que j'ai peut-être inventés. Il a blêmi, a annulé l'augmentation et a enfin réparé la douche. Un petit pas pour l'humanité.", en: 'I cited three statutes I may have made up. He went pale, cancelled the increase and finally fixed the shower. One small step for mankind.' }, fx: { happy: 10, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "Il a souri. Son avocat, c'est son beau-frère, et son beau-frère, c'est le juge. J'ai reçu un préavis et une facture pour « usure anormale du paillasson ».", en: "He smiled. His lawyer is his brother-in-law, and his brother-in-law is the judge. I got an eviction notice and a bill for 'abnormal doormat wear'." }, fx: { money: -400, happy: -8, stress: 10 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Vengeance discrète', en: 'Quiet revenge' }, text: { fr: "J'ai payé, puis j'ai caché une crevette crue dans la tringle à rideaux avant mon prochain état des lieux. Il ne trouvera jamais. Il sentira, pour toujours.", en: 'I paid, then hid a raw shrimp inside the curtain rod. He will never find it. He will smell it, forever.' }, fx: { money: '-amount', happy: 8, karma: -3 } },
    ],
  },

  // ───────────────────────────── car ─────────────────────────────
  {
    id: 'mo_car_crash',
    icon: '💥',
    cat: 'car',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'car', fx: 'gore' },
    when: { age: [16, 99], asset: 'car' },
    weight: 6,
    cooldown: 5,
    text: {
      fr: ["Tu chantes du Céline Dion à fond sur l'autoroute quand un camion de pastèques freine pile devant toi. Tu as une demi-seconde.", "Feu orange. Un pigeon, un livreur à trottinette et un cortège de mariage arrivent en même temps au carrefour. Tu as le pied sur l'accélérateur."],
      en: ["You're belting Celine Dion on the highway when a watermelon truck slams on its brakes in front of you. You have half a second.", 'Amber light. A pigeon, a delivery guy on a scooter and a wedding procession all hit the intersection at once. Your foot is on the gas.'],
    },
    choices: [
      {
        label: { fr: 'Freiner à mort', en: 'Slam the brakes' },
        out: [
          { w: 3, text: { fr: "J'ai pilé. Le camion a quand même lâché sa cargaison. Ma voiture a été repeinte en rouge pastèque, pépins compris. On aurait dit une scène de crime fruitière. Juste un coup du lapin.", en: 'I braked. The truck still dumped its load. My car got repainted watermelon red, seeds included. It looked like a fruit crime scene. Just whiplash.' }, fx: { health: -6, money: -1500, visual: 'gore' } },
          { w: 1, text: { fr: "J'ai freiné, la voiture de derrière non. Ma voiture fait maintenant la taille d'un micro-ondes. Moi, j'en suis sorti{|e} en rampant, avec un pare-brise entier dans les cheveux.", en: "I braked, the car behind me didn't. My car is now the size of a microwave. I crawled out with an entire windshield in my hair." }, fx: { health: -15, loseAsset: 'car', disease: 'broken_arm', visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Braquer à fond', en: 'Swerve hard' },
        out: [
          { w: 2, text: { fr: "J'ai braqué, traversé une haie, un barbecue familial et une piscine hors-sol. Les saucisses ont volé partout. La voiture est morte noyée. Moi, j'ai mangé une merguez sur le brancard.", en: 'I swerved through a hedge, a family barbecue and an above-ground pool. Sausages flew everywhere. The car drowned. I ate a hot dog on the stretcher.' }, fx: { health: -8, loseAsset: 'car', happy: 2, visual: 'gore' } },
          { w: 1, text: { fr: "J'ai braqué dans un panneau « Ralentir ». Le panneau a gagné. Ma tête a fait un petit tour sur la bande d'arrêt d'urgence, sans moi.", en: "I swerved into a 'Slow Down' sign. The sign won. My head took a little stroll down the hard shoulder without me." }, fx: { die: { fr: 'décapité{|e} par un panneau « Ralentir », ironiquement', en: "decapitated by a 'Slow Down' sign, ironically" }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Fermer les yeux', en: 'Close my eyes' }, text: { fr: "J'ai fermé les yeux et lâché le volant. Quand je les ai rouverts, j'étais garé{|e} pile devant le McDo, sans une égratignure. Jésus conduit une Twingo.", en: 'I closed my eyes and let go of the wheel. When I opened them I was parked perfectly outside a McDonald\'s, not a scratch. Jesus drives a hatchback.' }, fx: { happy: 8, karma: 3 } },
    ],
  },
  {
    id: 'mo_road_trip',
    icon: '🛣️',
    cat: 'car',
    rating: 0,
    actor: 'anyFriend',
    scene: { place: 'beach', mood: 'happy', prop: 'car' },
    when: { age: [17, 70], asset: 'car' },
    weight: 7,
    cooldown: 5,
    text: {
      fr: ["{a.first} propose un road trip improvisé : ta voiture, une glacière, aucune carte et une playlist de 14 heures qu'{a:il|elle} a appelée « Vibes ».", "Week-end prolongé. {a.first} toque à ta porte avec deux sacs de chips et un regard qui dit « on part maintenant ». Le plein n'est pas fait."],
      en: ["{a.first} suggests an improvised road trip: your car, a cooler, no map, and a 14-hour playlist {a:he|she} named 'Vibes'.", "Long weekend. {a.first} knocks on your door with two bags of chips and a look that says 'we leave now'. The tank is empty."],
    },
    choices: [
      {
        label: { fr: 'On part !', en: "Let's go!" },
        out: [
          { w: 3, text: { fr: "Trois jours de route avec {a.first}, un coucher de soleil sur la mer, un auto-stoppeur qui jouait du ukulélé. On a chanté faux pendant 900 km. Parfait.", en: 'Three days on the road with {a.first}, a sunset over the sea, a hitchhiker who played ukulele. We sang off-key for 900 km. Perfect.' }, fx: { happy: 12, rel: 12, money: -400, stress: -8 }, mood: 'happy' },
          { w: 1, text: { fr: "On s'est perdus. Au bout de deux jours, on a découvert un village où tout le monde s'appelle Gérard. On ne parle pas de ce qui s'est passé à la fête de Gérard.", en: "We got lost. Two days in, we found a village where everyone is called Gerald. We don't talk about what happened at Gerald's party." }, fx: { happy: 6, rel: 8, money: -300, stress: 3 } },
        ],
      },
      { label: { fr: 'Juste une journée', en: 'Just a day trip' }, text: { fr: "Une journée au lac avec {a.first}. Sandwichs écrasés, coups de soleil, fou rire. Pas besoin de plus.", en: 'A day at the lake with {a.first}. Squashed sandwiches, sunburn, giggle fits. Nothing more needed.' }, fx: { happy: 6, rel: 6, money: -60 } },
      { label: { fr: 'Rester sur le canapé', en: 'Stay on the couch' }, text: { fr: "J'ai dit non. {a.first} est parti{a:|e} sans moi et a rencontré l'amour de sa vie sur une aire d'autoroute. Je regarde ses stories.", en: '{a.first} left without me and met the love of {a:his|her} life at a highway rest stop. I watch the stories.' }, fx: { happy: -4, rel: -6 } },
    ],
  },
  {
    id: 'mo_breakdown',
    icon: '🛠️',
    cat: 'car',
    rating: 0,
    vars: { amount: [300, 2500] },
    scene: { place: 'park', mood: 'angry', prop: 'car' },
    when: { age: [16, 99], asset: 'car' },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Ta voiture fait un bruit de canard enrhumé, crache une fumée violette et s'arrête au milieu de nulle part. Pas de réseau. Une vache te regarde.", "Voyant moteur, voyant huile, voyant batterie, et un voyant que tu n'avais jamais vu, en forme de tête de mort. La voiture s'arrête.", "Ta voiture s'arrête net sur l'autoroute. Le seul véhicule qui s'arrête pour t'aider : {w:vehicle}, conduit par un monsieur qui chante {w:song}.", "Ta voiture fait {w:sound}, puis plus rien. Sur le tableau de bord, un voyant inconnu s'allume : il représente {w:animal}.", "Panne sèche {w:weather}, au milieu de nulle part. Ta jauge d'essence te mentait depuis des mois. Tu as {w:food} et 4 % de batterie."],
      en: ["Your car makes a noise like a duck with a cold, belches purple smoke and dies in the middle of nowhere. No signal. A cow is watching you.", "Engine light, oil light, battery light, and one you had never seen before, shaped like a skull. The car stops.", "Your car dies on the highway. The only vehicle that stops to help: {w:vehicle}, driven by a man singing {w:song}.", "Your car makes {w:sound}, then nothing. On the dashboard, a light you've never seen comes on: it shows {w:animal}.", "Out of gas {w:weather}, in the middle of nowhere. Your fuel gauge has been lying to you for months. You have {w:food} and 4% battery."],
    },
    choices: [
      { label: { fr: 'Appeler un garagiste', en: 'Call a mechanic' }, text: { fr: ["Le garagiste a regardé le moteur trois secondes, a sifflé longuement, puis m'a annoncé {$amount}. Le sifflement était inclus dans le prix.", "Le garagiste a sorti {w:object} du moteur. Personne ne sait comment c'est arrivé là. Facture : {$amount}."], en: ["The mechanic looked at the engine for three seconds, whistled long and low, then said {$amount}. The whistle was included in the price.", "The mechanic pulled {w:object} out of the engine. Nobody knows how it got there. Bill: {$amount}."] }, fx: { money: '-amount', stress: 4 } },
      {
        label: { fr: 'Réparer moi-même', en: 'Fix it myself' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai tapé sur un truc avec une clé à molette au hasard. Ça a redémarré. Je ne saurai jamais pourquoi et je ne toucherai plus jamais à rien.", "J'ai regardé un tuto et tapé exactement là où le monsieur tapait. Ça a marché. Je me sens ingénieur{|e}."], en: ["I hit something with a wrench at random. It started. I'll never know why and I'll never touch anything again.", "I watched a tutorial and hit exactly where the guy hit. It worked. I feel like an engineer."] }, fx: { happy: 8, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai ouvert le capot et mis de l'huile dans le réservoir de lave-glace. Il a fallu remorquer. La vache avait l'air déçue.", "J'ai démonté une pièce pour voir. Je n'ai jamais réussi à la remettre. Elle trône sur mon étagère, entre deux bibelots et {w:object}."], en: ["I opened the hood and poured oil into the windshield washer tank. It had to be towed. The cow looked disappointed.", "I took a part off to have a look. I never managed to put it back. It sits on my shelf, between two knick-knacks and {w:object}."] }, fx: { money: '-amount', happy: -4 } },
        ],
      },
      { label: { fr: 'Abandonner la voiture', en: 'Abandon the car' }, text: { fr: ["J'ai laissé la voiture et les clés sur le contact, avec un mot : « Elle est à vous. Bonne chance. » Je suis rentré{|e} à pied, libre.", "J'ai abandonné la voiture et je suis rentré{|e} en stop dans {w:vehicle}. Le conducteur m'a raconté toute sa vie. J'aurais dû rester avec la vache."], en: ["I left the car, keys in the ignition, with a note: 'She's yours. Good luck.' I walked home, free.", "I abandoned the car and hitchhiked home in {w:vehicle}. The driver told me his whole life story. I should have stayed with the cow."] }, fx: { loseAsset: 'car', happy: 3, athletic: 3 } },
    ],
  },
  {
    id: 'mo_car_stolen',
    icon: '🚓',
    cat: 'car',
    rating: 1,
    scene: { place: 'park', mood: 'shock', prop: 'keys', fx: 'police' },
    when: { age: [16, 99], asset: 'car' },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["Tu sors de chez toi : ta voiture a disparu. À sa place, un rond d'huile et une canette de bière. Bordel.", "Ta voiture n'est plus sur le parking. Sur Facebook Marketplace, en revanche, elle est en vente, à 20 % de son prix, avec tes lunettes de soleil encore sur le tableau de bord."],
      en: ['You step outside: your car is gone. In its place, an oil stain and a beer can. Hell.', "Your car isn't in the lot anymore. It is, however, for sale on Facebook Marketplace, at 20% of its value, with your sunglasses still on the dashboard."],
    },
    choices: [
      { label: { fr: 'Porter plainte', en: 'File a report' }, text: { fr: "J'ai porté plainte. Le policier a tapé ma déposition avec deux doigts, puis m'a dit qu'on ne la retrouverait jamais. On ne l'a jamais retrouvée.", en: "I filed a report. The cop typed my statement with two fingers, then told me it would never be found. It was never found." }, fx: { loseAsset: 'car', happy: -8, stress: 6 } },
      {
        label: { fr: 'Piéger le vendeur', en: 'Sting the seller' },
        out: [
          { w: 1, text: { fr: "J'ai répondu à l'annonce, donné rendez-vous et je suis reparti{|e} au volant de MA voiture pendant que le voleur comptait des faux billets. Justice.", en: 'I answered the ad, set up a meeting and drove off in MY car while the thief counted fake bills. Justice.' }, fx: { happy: 12, fame: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "Le « vendeur » est venu avec quatre cousins et un pitbull. J'ai acheté ma propre voiture. Sans les lunettes de soleil.", en: "The 'seller' showed up with four cousins and a pit bull. I bought back my own car. Without the sunglasses." }, fx: { money: -2000, happy: -6 } },
        ],
      },
      { label: { fr: "Toucher l'assurance", en: 'Claim the insurance' }, text: { fr: "L'assurance a payé une misère : ma voiture avait apparemment « une valeur sentimentale nulle ». J'ai pleuré dans le bus.", en: "The insurer paid peanuts: my car apparently had 'zero sentimental value'. I cried on the bus." }, fx: { loseAsset: 'car', money: 1500, happy: -4 } },
    ],
  },

  // ───────────────────────────── luxury ─────────────────────────────
  {
    id: 'mo_gold_toilet',
    icon: '🚽',
    cat: 'luxury',
    rating: 2,
    scene: { place: 'mansion', mood: 'shock', prop: 'toilet', fx: 'poop' },
    when: { age: [18, 99], asset: 'l_toilet' },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["Ton invité, un banquier suisse, est coincé dans tes toilettes en or massif depuis quarante minutes. Il appelle à l'aide en trois langues. L'or ne se débouche pas à la ventouse.", "Un journaliste veut faire un reportage sur tes toilettes en or. « Pour montrer au peuple. » Tu sens un piège, mais aussi une opportunité de briller. Littéralement."],
      en: ['Your guest, a Swiss banker, has been stuck in your solid gold toilet for forty minutes. He is calling for help in three languages. Gold does not respond to a plunger.', "A journalist wants to do a feature on your gold toilet. 'To show the people.' You smell a trap, but also an opportunity to shine. Literally."],
    },
    choices: [
      { label: { fr: 'Appeler un plombier-bijoutier', en: 'Call a plumber-jeweller' }, text: { fr: "Le plombier-bijoutier a facturé au carat. Il a sorti le banquier, une montre Rolex, deux dents et ce qui ressemblait à une carrière. Le tout plaqué or.", en: 'The plumber-jeweller billed by the carat. He pulled out the banker, a Rolex, two teeth and what looked like a career. All gold-plated.' }, fx: { money: -9000, happy: -4, visual: 'poop' } },
      {
        label: { fr: 'Faire le reportage', en: 'Do the interview' },
        out: [
          { w: 1, text: { fr: "Le reportage s'appelait « Il chie sur de l'or pendant que vous mangez des pâtes ». J'ai été conspué{|e} par tout le pays. Ventes de toilettes en or : +300 %.", en: "The piece was titled 'He Craps on Gold While You Eat Pasta'. The whole country booed me. Gold toilet sales: up 300%." }, fx: { fame: 10, karma: -8, happy: -4, followers: 20000 } },
          { w: 1, text: { fr: "J'ai posé sur le trône, en peignoir, avec un cigare. Je suis devenu{|e} un mème mondial. Un musée veut exposer mes toilettes. Je refuse : je les utilise.", en: 'I posed on the throne in a bathrobe with a cigar. I became a global meme. A museum wants to exhibit my toilet. I refuse: I use it.' }, fx: { fame: 12, happy: 8, followers: 50000 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Le revendre', en: 'Sell it' }, text: { fr: "J'ai revendu mes toilettes en or à un oligarque. Il les a fait livrer par hélicoptère. Moi, je fais de nouveau caca comme un pauvre, et c'est une forme de liberté.", en: 'I sold my gold toilet to an oligarch. He had it delivered by helicopter. I poop like a peasant again, and it is a kind of freedom.' }, fx: { loseAsset: 'l_toilet', money: 1000000, happy: -3, visual: 'money' } },
    ],
  },
  {
    id: 'mo_nft',
    icon: '🐵',
    cat: 'luxury',
    rating: 2,
    scene: { place: 'apartment', mood: 'cry', prop: 'laptop' },
    when: { age: [16, 99], asset: 'l_nft' },
    weight: 6,
    once: true,
    text: {
      fr: ["Ton NFT de singe moche vaut maintenant 3 dollars et une poignée de cacahuètes. Un ado de 14 ans l'a capturé en clic droit « Enregistrer sous ». Il te nargue avec.", "Le créateur de ta collection de NFT de singes a disparu aux Bahamas avec le pognon. Son dernier tweet : « gm ». Ton singe te fixe, vide comme ton compte."],
      en: ["Your ugly monkey NFT is now worth 3 dollars and a handful of peanuts. A 14-year-old right-clicked 'Save as' on it. He's taunting you with it.", "The creator of your monkey NFT collection vanished to the Bahamas with the money. His last tweet: 'gm'. Your monkey stares at you, empty as your bank account."],
    },
    choices: [
      { label: { fr: 'HODL jusqu\'à la mort', en: 'HODL till death' }, text: { fr: "Je garde. Diamond hands. J'ai fait encadrer une capture d'écran du singe au-dessus de mon lit. Mon psy dit que c'est « un signal ».", en: "I'm holding. Diamond hands. I framed a screenshot of the monkey above my bed. My therapist calls it 'a sign'." }, fx: { happy: -6, smarts: -3 } },
      { label: { fr: 'Le refourguer à un pote', en: 'Dump it on a friend' }, text: { fr: "Je l'ai revendu à mon cousin en lui expliquant le « métavers ». Il me l'a payé avec une PS4 sans manette. Je n'ai plus de cousin.", en: "I sold it to my cousin after explaining 'the metaverse'. He paid me with a PS4 with no controller. I no longer have a cousin." }, fx: { loseAsset: 'l_nft', money: 150, karma: -4 } },
      { label: { fr: 'Pleurer en public', en: 'Cry publicly' }, text: { fr: "J'ai fait une vidéo en larmes intitulée « J'ai tout perdu (singe) ». Elle a fait 2 millions de vues. Les gens se moquent de moi en haute définition.", en: "I posted a tearful video titled 'I lost everything (monkey)'. It got 2 million views. People are laughing at me in high definition." }, fx: { followers: 15000, happy: -8, fame: 4 }, mood: 'cry' },
    ],
  },

  // ───────────────────────────── rich people problems ─────────────────────────────
  {
    id: 'mo_gold_digger',
    icon: '💅',
    cat: 'rich',
    rating: 2,
    actor: { create: { role: 'acquaintance', age: [21, 32], abs: true, gender: 'attracted' } },
    scene: { place: 'villa', mood: 'love', prop: 'champagne', fx: 'hearts' },
    when: { age: [35, 99], money: [500000, 1e12] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["{a.first}, {a.age} ans, te trouve « fascinant{|e} ». {a:Il|Elle} rit à toutes tes blagues, même celle sur la TVA. Ses yeux brillent quand tu sors ta carte Platinum.", "Au bar du palace, {a.first}, {a.age} ans, te demande ton signe astrologique, puis ton patrimoine net. Dans cet ordre, mais pas longtemps."],
      en: ["{a.first}, {a.age}, finds you 'fascinating'. {a:He|She} laughs at all your jokes, even the one about VAT. {a:His|Her} eyes sparkle when your Platinum card comes out.", 'At the hotel bar, {a.first}, {a.age}, asks for your star sign, then your net worth. In that order, but not for long.'],
    },
    choices: [
      {
        label: { fr: 'Se laisser séduire', en: 'Let it happen' },
        out: [
          { w: 2, text: { fr: "{a.first} a emménagé, puis {a:son|sa} coach, puis le chien de {a:son|sa} coach. Trois mois plus tard, {a:il|elle} était parti{a:|e} avec la Porsche, la cave à vin et mon dernier reste de dignité.", en: "{a.first} moved in, then {a:his|her} personal trainer, then the trainer's dog. Three months later {a:he|she} was gone with the sports car, the wine cellar and my last shred of dignity." }, fx: { money: -150000, happy: -10, loseAsset: 'car' }, mood: 'cry' },
          { w: 1, text: { fr: "Contre toute attente, {a.first} m'aime pour moi. Et pour mon argent. Mais aussi pour moi. On s'est mis d'accord sur 60/40.", en: 'Against all odds, {a.first} loves me for me. And for my money. But also for me. We settled on 60/40.' }, fx: { happy: 12, money: -40000, actorRole: 'partner', rel: 30 }, mood: 'love' },
        ],
      },
      { label: { fr: 'Exiger un contrat', en: 'Demand a prenup' }, text: { fr: "J'ai sorti un contrat prénuptial de 80 pages dès le deuxième cocktail. {a.first} a lu la page 1, a vomi un peu dans son mojito et a disparu. Efficace.", en: 'I pulled out an 80-page prenup at the second cocktail. {a.first} read page 1, threw up a little into {a:his|her} mojito and vanished. Effective.' }, fx: { happy: 3, smarts: 2 } },
      { label: { fr: 'Prétendre être ruiné{|e}', en: 'Pretend to be broke' }, text: { fr: "J'ai dit que j'étais criblé{|e} de dettes. {a.first} a soudain eu « un vol très tôt demain ». Il était 21 h. Je suis resté{|e} seul{|e} avec mon champagne à 900 balles.", en: "I said I was drowning in debt. {a.first} suddenly had 'a very early flight tomorrow'. It was 9 p.m. I stayed alone with my $900 champagne." }, fx: { happy: -2, karma: 2 } },
    ],
  },
  {
    id: 'mo_kidnap_threat',
    icon: '✉️',
    cat: 'rich',
    rating: 1,
    vars: { amount: [50000, 500000] },
    scene: { place: 'mansion', mood: 'shock', prop: 'letter' },
    when: { age: [18, 99], money: [500000, 1e12] },
    weight: 4,
    cooldown: 8,
    text: {
      fr: ["Lettre anonyme faite de lettres découpées dans des magazines : « {$amount} OU ON TE KIDNAPE ». Les découpages sont soignés. Ils ont même utilisé de la colle pailletée.", "Un type en cagoule te suit depuis trois jours. Il fait semblant de lire un journal. À l'envers. Tes millions te rendent intéressant{|e}."],
      en: ["Anonymous note made of letters cut from magazines: '{$amount} OR WE KIDNAP YOU'. The cutouts are neat. They even used glitter glue.", "A guy in a balaclava has been following you for three days. He pretends to read a newspaper. Upside down. Your millions make you interesting."],
    },
    choices: [
      { label: { fr: 'Engager des gardes du corps', en: 'Hire bodyguards' }, text: { fr: "J'ai engagé deux gardes du corps baraqués, Igor et Igor. Ils me suivent même aux toilettes. Je n'ai plus aucune intimité, mais je suis vivant{|e}.", en: 'I hired two massive bodyguards, Igor and Igor. They follow me to the bathroom. I have no privacy, but I am alive.' }, fx: { money: -60000, stress: -6, happy: -2 } },
      { label: { fr: 'Payer la rançon', en: 'Pay up' }, text: { fr: "J'ai payé {$amount}. Le mois suivant, j'ai reçu une deuxième lettre, avec encore plus de paillettes. On ne négocie pas avec les terroristes du scrapbooking.", en: 'I paid {$amount}. Next month I got a second letter, with even more glitter. Never negotiate with scrapbooking terrorists.' }, fx: { money: '-amount', stress: 6, happy: -6 } },
      {
        label: { fr: 'Ignorer la menace', en: 'Ignore it' },
        out: [
          { w: 3, text: { fr: "J'ai ignoré la lettre. Le type en cagoule s'est fait arrêter pour avoir essayé de kidnapper mon voisin, plus pauvre mais plus près de l'arrêt de bus.", en: 'I ignored it. The balaclava guy got arrested trying to kidnap my neighbour, who is poorer but closer to the bus stop.' }, fx: { happy: 4 } },
          { w: 1, text: { fr: "Ils m'ont enlevé{|e}, enfermé{|e} dans une cave pendant trois jours, puis relâché{|e} parce que je parlais trop de mes investissements. Ils m'ont rendu mon portefeuille, vide.", en: 'They kidnapped me, locked me in a basement for three days, then let me go because I kept talking about my investments. They returned my wallet, empty.' }, fx: { money: -20000, stress: 15, disease: 'ptsd', happy: -10 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'mo_football_club',
    icon: '⚽',
    cat: 'rich',
    rating: 0,
    vars: { amount: [150000, 450000] },
    scene: { place: 'stadium', mood: 'proud', prop: 'scarf' },
    when: { age: [25, 99], money: [500000, 1e12], noFlag: 'mo_club_owner' },
    weight: 4,
    once: true,
    text: {
      fr: ["Le FC {city}-Saint-Glinglin, club de troisième division, est à vendre pour {$amount}. Le stade a 800 places, une buvette et un gardien de 54 ans qui s'appelle Bernard.", "Un agent sportif t'appelle : « Un club de foot, ça vous dirait ? C'est très tendance chez les gens comme vous. » Prix : {$amount}, Bernard inclus."],
      en: ['FC {city} Rovers, a third-division club, is for sale for {$amount}. The stadium seats 800, has a snack bar and a 54-year-old goalkeeper named Bernard.', "A sports agent calls: 'Fancy a football club? It's very trendy with people like you.' Price: {$amount}, Bernard included."],
    },
    choices: [
      { label: { fr: 'Acheter le club', en: 'Buy the club' }, text: { fr: "J'ai acheté le club. J'ai changé les maillots pour qu'ils aient ma tête dessus. Les supporters ont chanté mon nom. Pas en bien, mais ils l'ont chanté.", en: 'I bought the club. I changed the jerseys to have my face on them. The fans chanted my name. Not nicely, but they chanted it.' }, fx: { money: '-amount', fame: 6, happy: 10, flag: 'mo_club_owner', schedule: { key: 'mo_club_season', years: 1 }, visual: 'confetti' }, mood: 'proud' },
      { label: { fr: 'Juste sponsoriser', en: 'Just sponsor them' }, text: { fr: "J'ai payé les maillots en échange de mon nom au dos. Les joueurs courent avec « {last} » écrit sur les fesses. J'ai les larmes aux yeux.", en: "I paid for the jerseys in exchange for my name on the back. The players run around with '{last}' across their butts. I'm tearing up." }, fx: { money: -10000, fame: 2, happy: 5 } },
      { label: { fr: 'Refuser', en: 'Pass' }, text: { fr: "J'ai refusé. Le club a été racheté par un fabricant de saucisses. Ils jouent maintenant sous le nom de « FC Knacki ». Ils gagnent tout.", en: "I passed. The club was bought by a sausage maker. They now play as 'FC Wiener'. They win everything." }, fx: { happy: -2 } },
    ],
  },
  {
    id: 'mo_club_season',
    icon: '🏆',
    cat: 'rich',
    rating: 0,
    chainOnly: true,
    vars: { amount: [50000, 400000] },
    scene: { place: 'stadium', mood: 'party', prop: 'trophy' },
    when: { flag: 'mo_club_owner' },
    text: {
      fr: ["Fin de la première saison de ton club. Dernier match, score nul, il reste une minute. Bernard, le gardien, te regarde depuis ses cages. L'entraîneur te demande : « On fait quoi, patron ? »", "Dernier match de la saison pour ton club. Si on gagne, montée en division supérieure. L'entraîneur te tend son carnet tactique. Il est vierge."],
      en: ["End of your club's first season. Final match, tied, one minute left. Bernard the goalie looks at you from his goal. The coach asks: 'What do we do, boss?'", "Last match of the season for your club. Win and we go up a division. The coach hands you his tactics notebook. It's blank."],
    },
    choices: [
      {
        label: { fr: 'Tous en attaque !', en: 'Everyone attack!' },
        out: [
          { w: 1, text: { fr: "Même Bernard est monté. Il a marqué de la tête à la 93e. Montée historique ! Les droits télé m'ont rapporté {$amount}. On a mis Bernard sur une statue.", en: 'Even Bernard went forward. He scored a header in the 93rd minute. Historic promotion! TV rights brought in {$amount}. We put Bernard on a statue.' }, fx: { money: 'amount', fame: 8, happy: 15, visual: 'confetti' }, mood: 'party' },
          { w: 1, text: { fr: "Tout le monde est monté, contre en face, but dans les cages vides. Relégation. Les supporters ont brûlé mon effigie. Elle était ressemblante.", en: 'Everyone went forward, counterattack, goal into the empty net. Relegation. The fans burned my effigy. It was a good likeness.' }, fx: { happy: -10, fame: 3, money: -50000, visual: 'fire' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Revendre le club', en: 'Sell the club' }, text: { fr: "J'ai revendu le club avant la fin du match, depuis la tribune, par téléphone. Plus-value : {$amount}. Bernard m'a fait un doigt d'honneur. Je l'ai mérité.", en: 'I sold the club before the final whistle, from the stands, by phone. Profit: {$amount}. Bernard gave me the finger. I earned it.' }, fx: { money: 'amount', unflag: 'mo_club_owner', karma: -3, happy: 4 } },
    ],
  },
  {
    id: 'mo_tax_exile',
    icon: '🏝️',
    cat: 'rich',
    rating: 1,
    scene: { place: 'beach', mood: 'happy', prop: 'passport', fx: 'money' },
    when: { age: [25, 99], money: [1000000, 1e12], noFlag: 'mo_tax_exile' },
    weight: 5,
    once: true,
    text: {
      fr: ["Ton conseiller fiscal, un homme bronzé en mocassins sans chaussettes, te parle d'une petite île « fiscalement très accueillante ». Le PIB local, c'est surtout des boîtes aux lettres.", "Tes impôts de l'année représentent l'équivalent de trois Lamborghini. Ton comptable tousse discrètement et murmure : « Monaco. »"],
      en: ['Your tax adviser, a tanned man in sockless loafers, mentions a small island that is "very tax friendly". The local GDP is mostly mailboxes.', "This year's tax bill is worth three Lamborghinis. Your accountant coughs discreetly and murmurs: 'Monaco.'"],
    },
    choices: [
      { label: { fr: "S'exiler au soleil", en: 'Flee to the sun' }, text: { fr: "Je suis devenu{|e} résident{|e} fiscal{|e} d'un rocher plein de yachts. Je paie 0 % d'impôts et 15 euros le café. Je m'ennuie à mourir, mais avec un bronzage parfait.", en: "I'm now a tax resident of a rock full of yachts. I pay 0% tax and $15 a coffee. I'm bored to death, but with a perfect tan." }, fx: { moneyPct: 0.08, karma: -8, happy: 4, flag: 'mo_tax_exile', visual: 'money' } },
      { label: { fr: 'Payer comme tout le monde', en: 'Pay like everyone else' }, text: { fr: "J'ai payé mes impôts. Le fisc m'a envoyé une lettre de remerciement. C'est la première fois que quelqu'un m'écrit sans me demander de l'argent. Ah non, attendez.", en: "I paid my taxes. The tax office sent a thank-you letter. First time anyone's written to me without asking for money. Oh, wait." }, fx: { karma: 8, happy: -2 } },
      { label: { fr: 'Société écran au Panama', en: 'Panama shell company' }, text: { fr: "J'ai créé « Pépito Holdings Ltd », basée dans un tiroir au Panama. Un journaliste d'investigation a commencé à me suivre sur LinkedIn. Mauvais signe.", en: "I set up 'Cookie Holdings Ltd', headquartered in a drawer in Panama. An investigative journalist started following me on LinkedIn. Bad sign." }, fx: { moneyPct: 0.05, heat: 15, karma: -6, flag: 'mo_tax_exile' } },
    ],
  },
  {
    id: 'mo_charity_gala',
    icon: '🥂',
    cat: 'rich',
    rating: 2,
    vars: { amount: [20000, 200000] },
    scene: { place: 'mansion', mood: 'party', prop: 'champagne' },
    when: { age: [21, 99], money: [500000, 1e12] },
    weight: 6,
    cooldown: 4,
    text: {
      fr: ["Gala de charité « Pour l'eau potable ». Le dîner coûte 5 000 € par tête, la fontaine à champagne fait trois mètres et personne ne sait dans quel pays il manque de l'eau. Un milliardaire pleure en regardant sa propre photo avec un enfant.", "Soirée caritative au profit des sans-abri, dans un palace où les sans-abri n'ont pas le droit d'entrer. Le thème : « Bohème chic ». Une héritière est venue déguisée en clocharde avec un sac Hermès."],
      en: ["Charity gala 'For Clean Water'. Dinner is $5,000 a head, the champagne fountain is ten feet tall and nobody knows which country is short of water. A billionaire weeps at a photo of himself with a child.", "A fundraiser for the homeless, held in a palace the homeless aren't allowed into. Theme: 'Bohemian chic'. An heiress came dressed as a hobo, carrying a Birkin."],
    },
    choices: [
      { label: { fr: 'Faire un don énorme', en: 'Make a huge donation' }, text: { fr: "J'ai donné {$amount} devant les photographes, avec un chèque géant en carton. Déductible à 66 %. Les flashs m'ont fait plus de bien que la bonne action.", en: 'I donated {$amount} in front of the cameras, with a giant cardboard cheque. Tax-deductible. The flashbulbs felt better than the good deed.' }, fx: { money: '-amount', karma: 6, fame: 5, happy: 5 } },
      { label: { fr: 'Remplir mon sac de petits fours', en: 'Stuff my bag with canapés' }, text: { fr: "J'ai rempli mon sac de homards, de macarons et de deux bouteilles de Dom Pérignon. J'ai bien mangé toute la semaine. Je suis plus pauvre que je ne le crois, mentalement.", en: 'I stuffed my bag with lobster, macarons and two bottles of Dom Pérignon. Ate well all week. I am poorer than I think, mentally.' }, fx: { happy: 6, health: 2, karma: -2 } },
      {
        label: { fr: 'Prononcer un discours honnête', en: 'Give an honest speech' },
        out: [
          { w: 1, text: { fr: "J'ai pris le micro : « Si on avait juste payé nos impôts, on ne serait pas là à bouffer du caviar pour les pauvres. » Silence de mort. Puis une standing ovation ironique. On ne m'invitera plus.", en: "I took the mic: 'If we'd just paid our taxes, we wouldn't be here eating caviar for the poor.' Dead silence. Then an ironic standing ovation. I'm never getting invited again." }, fx: { karma: 10, fame: 6, happy: 4 }, mood: 'proud' },
          { w: 1, text: { fr: "J'avais bu. Mon discours honnête a dérapé sur ma vie sexuelle, mon divorce et le décolleté de la baronne. J'ai fini dans la fontaine à champagne. Les photos sont partout.", en: "I'd been drinking. My honest speech veered into my sex life, my divorce and the baroness's cleavage. I ended up in the champagne fountain. The photos are everywhere." }, fx: { fame: 8, happy: -6, stress: 8, followers: 5000 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'mo_yacht_party',
    icon: '🛥️',
    cat: 'rich',
    rating: 2,
    scene: { place: 'beach', mood: 'party', prop: 'yacht', fx: 'gore' },
    when: { age: [21, 99], money: [500000, 1e12] },
    weight: 5,
    cooldown: 5,
    text: {
      fr: ["Soirée sur un yacht au large de Saint-Tropez. Un rappeur, deux ministres, un prince en string et une montagne de « sucre » sur la table basse que personne n'ose goûter. Un influenceur danse beaucoup trop près de l'hélice.", "Ton ami milliardaire t'invite sur son yacht de 90 mètres. Il y a un sous-marin, un héliport et un requin dans un aquarium. Il veut te montrer comment il le nourrit."],
      en: ["Yacht party off Saint-Tropez. A rapper, two ministers, a prince in a thong and a mountain of 'sugar' on the coffee table nobody dares touch. An influencer is dancing way too close to the propeller.", 'Your billionaire friend invites you onto his 300-foot yacht. It has a submarine, a helipad and a shark in a tank. He wants to show you how he feeds it.'],
    },
    choices: [
      {
        label: { fr: 'Faire la fête à fond', en: 'Party hard' },
        out: [
          { w: 2, text: { fr: "J'ai dansé jusqu'à l'aube, fait un selfie avec le prince et vomi sur un ministre qui m'a remercié{|e}. Il y avait des règles. Personne ne les connaissait.", en: "I danced till dawn, took a selfie with the prince and threw up on a minister who thanked me. There were rules. Nobody knew them." }, fx: { happy: 12, health: -5, fame: 3 }, mood: 'party' },
          { w: 1, text: { fr: "L'influenceur est tombé à l'eau. L'hélice l'a transformé en smoothie fraise-Gucci. La mer est devenue rose. La fête a continué. Le prince a dit : « Contenu. »", en: "The influencer fell overboard. The propeller turned him into a strawberry-Gucci smoothie. The sea turned pink. The party went on. The prince said: 'Content.'" }, fx: { happy: -4, stress: 12, disease: 'ptsd', visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Nourrir le requin', en: 'Feed the shark' },
        out: [
          { w: 2, text: { fr: "J'ai lancé un thon entier au requin. Il l'a avalé avec un bruit de chasse d'eau. Mon ami milliardaire a applaudi comme un enfant de cinq ans. Les riches sont des enfants avec des requins.", en: "I tossed a whole tuna to the shark. It swallowed it with a flushing sound. My billionaire friend clapped like a five-year-old. The rich are children with sharks." }, fx: { happy: 8, stress: 3 } },
          { w: 1, text: { fr: "Je me suis penché{|e} un peu trop. Le requin a pris le thon, puis ma main, puis le reste de mon bras jusqu'à l'épaule. Le sang a giclé sur le DJ, qui a monté le son. Je suis mort{|e} au son de David Guetta.", en: 'I leaned in too far. The shark took the tuna, then my hand, then the rest of my arm up to the shoulder. Blood sprayed on the DJ, who turned up the volume. I died to David Guetta.' }, fx: { die: { fr: 'dévoré{|e} par le requin domestique d\'un milliardaire, pendant un set de David Guetta', en: "eaten by a billionaire's pet shark during a David Guetta set" }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Rester au bar', en: 'Stay at the bar' }, text: { fr: "Je suis resté{|e} au bar avec le barman philippin, la seule personne normale à bord. Il m'a raconté les secrets de tous les invités. J'ai de quoi faire chanter trois ministres.", en: "I stayed at the bar with the bartender, the only normal person on board. He told me everyone's secrets. I have enough to blackmail three ministers." }, fx: { happy: 6, smarts: 3, flag: 'mo_blackmail_material' } },
    ],
  },

  // ───────────────────────────── poverty ─────────────────────────────
  {
    id: 'mo_eviction',
    icon: '📦',
    cat: 'poverty',
    rating: 1,
    scene: { place: 'apartment', mood: 'cry', prop: 'boxes' },
    when: { age: [18, 99], movedOut: true, noAsset: 'house', money: [-1e9, 2000] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Trois loyers de retard. Un huissier sonne à la porte avec un serrurier et un regard de quelqu'un qui fait ça tous les jours et dort très bien la nuit.", "Avis d'expulsion scotché sur ta porte. Tu as 48 heures. Le propriétaire a déjà fait visiter l'appart, avec toi dedans, en pyjama."],
      en: ["Three months behind on rent. A bailiff rings with a locksmith and the face of a man who does this daily and sleeps like a baby.", "Eviction notice taped to your door. You have 48 hours. The landlord already showed the place to new tenants, with you inside, in pyjamas."],
    },
    choices: [
      { label: { fr: 'Retourner chez mes parents', en: 'Move back with my parents' }, text: { fr: "Je suis retourné{|e} chez mes parents. Ma chambre d'ado est intacte, posters compris. Ma mère m'a demandé si j'avais « enfin une situation ». Merde.", en: "I moved back in with my parents. My teenage bedroom is untouched, posters included. Mom asked if I 'finally have a situation'. Crap." }, fx: { happy: -10, stress: 6, money: 300 } },
      { label: { fr: 'Squatter le canapé d\'un pote', en: "Crash on a friend's couch" }, text: { fr: "Six mois sur le canapé d'un pote. Je connais chaque ressort par son prénom. Son chat m'a adopté{|e}. Sa copine, non.", en: "Six months on a buddy's couch. I know every spring by name. His cat adopted me. His girlfriend did not." }, fx: { happy: -6, health: -3, stress: 8 } },
      {
        label: { fr: 'Négocier avec l\'huissier', en: 'Negotiate with the bailiff' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "J'ai pleuré, offert un café et parlé de mon enfance. L'huissier m'a accordé un mois. Il a pleuré aussi. On est amis Facebook maintenant.", en: "I cried, offered coffee and talked about my childhood. The bailiff gave me a month. He cried too. We're Facebook friends now." }, fx: { happy: 4, stress: -4 } },
          { w: 2, text: { fr: "L'huissier a écouté mon histoire en hochant la tête, puis a fait changer la serrure pendant que je parlais. Professionnel.", en: 'The bailiff listened to my story, nodding, then had the lock changed while I was still talking. Professional.' }, fx: { happy: -8, stress: 10 }, mood: 'cry' },
        ],
      },
    ],
  },
  {
    id: 'mo_pasta_month',
    icon: '🍝',
    cat: 'poverty',
    rating: 0,
    scene: { place: 'apartment', mood: 'sad', prop: 'pasta' },
    when: { age: [16, 99], money: [-1e9, 2000] },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Il te reste 23 € jusqu'à la fin du mois. Dans le placard : 4 kilos de coquillettes, un cube de bouillon et une boîte de maïs périmée depuis le dernier gouvernement.", "Fin de mois difficile. Ton frigo contient une moutarde, un citron fossilisé et ton reflet, triste."],
      en: ["You have $23 until the end of the month. In the cupboard: 9 pounds of macaroni, a stock cube and a can of corn that expired two governments ago.", "Rough end of the month. Your fridge contains mustard, a fossilised lemon and your reflection, looking sad."],
    },
    choices: [
      { label: { fr: 'Pâtes pendant un mois', en: 'Pasta for a month' }, text: { fr: "Trente jours de coquillettes. Coquillettes au beurre, coquillettes au ketchup, coquillettes « façon risotto ». J'ai rêvé d'un brocoli. J'ai pleuré au réveil.", en: 'Thirty days of macaroni. Buttered macaroni, ketchup macaroni, macaroni "risotto style". I dreamed of broccoli. I woke up crying.' }, fx: { happy: -5, health: -3, weight: 0.03, money: 50 } },
      { label: { fr: 'Dîner chez mes parents', en: 'Eat at my parents' }, text: { fr: "J'ai débarqué chez mes parents « par hasard » pile à l'heure du dîner, cinq soirs de suite. Ils ont compris. Ils m'ont donné des Tupperware. Je les aime.", en: "I dropped by my parents 'by chance' right at dinnertime, five nights in a row. They got it. They gave me Tupperware. I love them." }, fx: { happy: 4, health: 2 } },
      { label: { fr: 'Pique-assiette aux vernissages', en: 'Freeload at art openings' }, text: { fr: "J'ai écumé tous les vernissages gratuits de la ville. J'ai mangé 400 petits fours et dit « c'est très audacieux » devant des toiles blanches. On me prend pour un critique.", en: 'I hit every free gallery opening in town. Ate 400 canapés and said "very bold" in front of blank canvases. People think I\'m a critic.' }, fx: { happy: 6, smarts: 2 } },
    ],
  },
  {
    id: 'mo_pawn_shop',
    icon: '🏪',
    cat: 'poverty',
    rating: 1,
    vars: { amount: [80, 900] },
    scene: { place: 'park', mood: 'sad', prop: 'shop' },
    when: { age: [18, 99], money: [-1e9, 2000] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["Le prêteur sur gages examine tes affaires avec la moue d'un juge de télécrochet. Il a une dent en or et un perroquet qui dit « non » à tout.", "Le compte est à sec. Tu pousses la porte du Cash Express du coin, celui avec le néon qui grésille et les guitares tristes en vitrine."],
      en: ["The pawnbroker examines your stuff with the pout of a TV talent show judge. He has a gold tooth and a parrot that says 'no' to everything.", "Account's bone dry. You push open the door of the local Cash Express, the one with the buzzing neon and the sad guitars in the window."],
    },
    choices: [
      { label: { fr: 'Vendre ma console', en: 'Sell my console' }, text: { fr: "J'ai vendu ma console pour {$amount}. Le perroquet a dit « non ». Le type a dit « oui ». J'ai fait le deuil de 400 heures de sauvegarde.", en: 'I sold my console for {$amount}. The parrot said no. The guy said yes. I grieved 400 hours of save files.' }, fx: { money: 'amount', happy: -5 } },
      { label: { fr: "La bague de mamie", en: "Grandma's ring" }, text: { fr: "J'ai mis en gage la bague de mamie. Le type a dit que c'était du toc. Mamie m'a menti toute sa vie. J'ai eu une petite somme et une crise existentielle.", en: "I pawned grandma's ring. The guy said it was fake. Grandma lied to me her whole life. I got a little cash and an existential crisis." }, fx: { money: 60, happy: -8, karma: -2 } },
      {
        label: { fr: 'Négocier comme un chef', en: 'Haggle like a boss' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai négocié comme dans les émissions de télé. J'ai obtenu le double de {$amount} pour un grille-pain. Le perroquet a dit « bravo ». J'ignorais qu'il connaissait ce mot.", en: "I haggled like on TV. Got twice {$amount} for a toaster. The parrot said 'bravo'. I didn't know it knew that word." }, fx: { money: 'amount', happy: 8, smarts: 1 } },
          { w: 1, text: { fr: "J'ai voulu négocier. Le type m'a fait payer 20 balles pour « l'expertise ». Je suis ressorti{|e} plus pauvre qu'en entrant. Le perroquet riait.", en: "I tried haggling. He charged me 20 bucks for 'the appraisal'. I walked out poorer than I came in. The parrot was laughing." }, fx: { money: -20, happy: -5 } },
        ],
      },
    ],
  },
  {
    id: 'mo_loan_shark',
    icon: '🦈',
    cat: 'poverty',
    rating: 2,
    vars: { amount: [500, 3000] },
    scene: { place: 'apartment', mood: 'neutral', prop: 'cash' },
    when: { age: [18, 99], money: [-1e9, 2000], noFlag: 'mo_shark_debt' },
    weight: 7,
    cooldown: 5,
    text: {
      fr: ["« Crédit Rapide Sans Questions » : un type nommé Tonio te propose {$amount} cash, tout de suite. Le taux ? « On verra. » Il fait craquer ses phalanges en disant « on verra ».", "Une pub sur ton téléphone : « Besoin d'argent ? Prêt en 5 min, 0 justificatif, 1 400 % de TAEG ! » En bas, en petit : « Tonio vous retrouvera. »"],
      en: ["'Quick Loans No Questions': a guy called Tony offers you {$amount} cash, right now. The rate? 'We'll see.' He cracks his knuckles while saying 'we'll see'.", "An ad on your phone: 'Need cash? Loan in 5 min, no paperwork, 1,400% APR!' In small print: 'Tony will find you.'"],
    },
    choices: [
      { label: { fr: 'Prendre le fric', en: 'Take the money' }, text: { fr: "J'ai pris les {$amount} de Tonio. Il a souri, m'a tapoté la joue et m'a dit : « On se revoit l'année prochaine, mon chou. » J'ai entendu un genou craquer quelque part.", en: "I took Tony's {$amount}. He smiled, patted my cheek and said: 'See you next year, sweetheart.' Somewhere, a kneecap cracked." }, fx: { money: 'amount', happy: 5, stress: 8, flag: 'mo_shark_debt', schedule: { key: 'mo_shark_collect', years: 1 }, visual: 'money' } },
      { label: { fr: 'Fuir en courant', en: 'Run away' }, text: { fr: "J'ai fui. Tonio m'a regardé{|e} partir avec tendresse, comme un loup regarde un agneau qui fait du jogging.", en: 'I ran. Tony watched me go tenderly, the way a wolf watches a lamb out jogging.' }, fx: { happy: -2, athletic: 2 } },
      { label: { fr: 'Demander à la banque', en: 'Ask the bank instead' }, text: { fr: "La banque m'a refusé un prêt de 500 €, puis m'a facturé 45 € de frais de « rejet de demande ». Tonio, au moins, est honnête sur le fait qu'il est un criminel.", en: "The bank refused me a $500 loan, then charged me $45 for 'application rejection'. At least Tony is honest about being a criminal." }, fx: { money: -45, happy: -6 } },
    ],
  },
  {
    id: 'mo_shark_collect',
    icon: '🔨',
    cat: 'poverty',
    rating: 2,
    chainOnly: true,
    vars: { amount: [3000, 12000] },
    scene: { place: 'apartment', mood: 'shock', prop: 'hammer', fx: 'gore' },
    text: {
      fr: ["Tonio est revenu. Avec intérêts : {$amount}. Il est accompagné de « Petit Marcel », 140 kilos, un marteau et des yeux qui ont déjà vu des choses.", "On frappe. C'est Tonio, un an pile après. Il tient un marteau à pied-de-biche et un bouquet de fleurs. « Les fleurs, c'est pour après », dit-il."],
      en: ["Tony is back. With interest: {$amount}. He brought 'Little Marcel', 300 pounds, a hammer and eyes that have seen things.", "A knock. It's Tony, exactly a year later. He's holding a claw hammer and a bouquet. 'The flowers are for after,' he says."],
    },
    choices: [
      { label: { fr: 'Rembourser', en: 'Pay him back' }, text: { fr: "J'ai payé les {$amount}. Tonio m'a fait la bise. Petit Marcel a semblé déçu, et a cassé une chaise pour se détendre. C'était ma chaise.", en: 'I paid the {$amount}. Tony kissed me on both cheeks. Little Marcel looked disappointed and broke a chair to unwind. It was my chair.' }, fx: { money: '-amount', unflag: 'mo_shark_debt', stress: -6 } },
      {
        label: { fr: 'Plaider la pauvreté', en: 'Plead poverty' },
        out: [
          { w: 2, text: { fr: "Petit Marcel m'a broyé les deux rotules. Ça a fait le bruit d'un paquet de chips qu'on écrase. J'ai vu mon genou dans une position que seuls les flamants roses connaissent. Dette « soldée ».", en: 'Little Marcel smashed both my kneecaps. It sounded like a bag of chips being stomped. My knee bent in a direction only flamingos know. Debt "settled".' }, fx: { health: -25, unflag: 'mo_shark_debt', disease: 'arthritis', athletic: -15, visual: 'gore' }, mood: 'cry' },
          { w: 1, text: { fr: "Tonio a pris trois doigts « en acompte ». Petit Marcel les a rangés dans une boîte à bijoux. Ils ont gardé l'alliance. Dette soldée, main allégée.", en: "Tony took three fingers 'as a down payment'. Little Marcel put them in a jewellery box. They kept the ring. Debt settled, hand lightened." }, fx: { health: -15, unflag: 'mo_shark_debt', disease: 'missing_finger', visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Sauter par la fenêtre', en: 'Jump out the window' },
        out: [
          { w: 2, text: { fr: "J'ai sauté du premier étage dans une benne à ordures. J'ai disparu dans la nature en sentant le yaourt périmé. Tonio a juré de me retrouver. Je dors avec un couteau à beurre.", en: 'I jumped from the second floor into a dumpster. I vanished into the night smelling of expired yogurt. Tony swore to find me. I sleep with a butter knife.' }, fx: { health: -6, stress: 15, unflag: 'mo_shark_debt' } },
          { w: 1, text: { fr: "J'ai sauté. J'avais oublié que j'habitais au sixième. J'ai fait « splotch » sur le capot de la voiture de Tonio. Il était surtout énervé pour la peinture.", en: "I jumped. I'd forgotten I lived on the seventh floor. I went 'splotch' on the hood of Tony's car. He was mostly mad about the paint job." }, fx: { die: { fr: 'écrasé{|e} sur le capot de mon usurier, en essayant de lui échapper', en: "splattered on my loan shark's car hood while fleeing him" }, visual: 'gore' } },
        ],
      },
    ],
  },
  {
    id: 'mo_kidney',
    icon: '🫘',
    cat: 'poverty',
    rating: 2,
    vars: { amount: [8000, 30000] },
    scene: { place: 'hospital', mood: 'neutral', prop: 'cooler', fx: 'gore' },
    when: { age: [18, 70], money: [-1e9, 2000], noFlag: 'mo_one_kidney' },
    weight: 4,
    once: true,
    text: {
      fr: ["Sur un forum louche, un « Docteur Bob » propose {$amount} pour un rein. « Tu en as deux, sois pas égoïste. » L'opération a lieu dans l'arrière-salle d'un kebab.", "Un type en blouse tachée t'aborde à l'arrêt de bus : « T'as l'air d'avoir des beaux reins. Je t'en prends un, {$amount} cash. Anesthésie offerte. »"],
      en: ["On a shady forum, a 'Doctor Bob' offers {$amount} for a kidney. 'You have two, don't be selfish.' The operation takes place in the back room of a kebab shop.", "A guy in a stained lab coat approaches you at the bus stop: 'You look like you've got nice kidneys. I'll take one, {$amount} cash. Anaesthesia included.'"],
    },
    choices: [
      {
        label: { fr: 'Vendre un rein', en: 'Sell a kidney' },
        out: [
          { w: 3, text: { fr: "Je me suis réveillé{|e} dans une baignoire de glaçons avec une cicatrice en zigzag et une enveloppe de {$amount}. Le kebab m'a offert une frite. J'ai tout dépensé en deux mois, comme un rein qui part en fumée.", en: 'I woke up in an ice bath with a zigzag scar and an envelope holding {$amount}. The kebab shop gave me a free fry. I blew it all in two months, like a kidney gone up in smoke.' }, fx: { money: 'amount', health: -20, happy: -4, flag: 'mo_one_kidney', visual: 'gore' }, mood: 'sick' },
          { w: 1, text: { fr: "Docteur Bob a pris le rein. Puis, par erreur, la rate. Puis un bout de foie « en bonus ». L'enveloppe ne contenait que la moitié du prix et un coupon kebab.", en: "Doctor Bob took the kidney. Then, by mistake, the spleen. Then a bit of liver 'as a bonus'. The envelope held half the price and a kebab coupon." }, fx: { money: 4000, health: -35, disease: 'liver_disease', flag: 'mo_one_kidney', visual: 'gore' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Vendre mes cheveux', en: 'Sell my hair instead' }, text: { fr: "J'ai négocié : pas de rein, mais mes cheveux. Docteur Bob m'a rasé{|e} avec un couteau à kebab. 200 balles et une tête de moine bouddhiste qui a raté sa vocation.", en: "I negotiated: no kidney, but my hair. Doctor Bob shaved me with a kebab knife. 200 bucks and the head of a Buddhist monk who missed his calling." }, fx: { money: 200, looks: -10 } },
      { label: { fr: 'Fuir', en: 'Run' }, text: { fr: "Je suis parti{|e} en courant, les deux mains sur les reins. Je garde mes organes. Je n'ai que ça.", en: "I ran off, both hands over my kidneys. I'm keeping my organs. They're all I've got." }, fx: { happy: 2 } },
    ],
  },

  // ───────────────────────────── investing ─────────────────────────────
  {
    id: 'mo_stock_tip',
    icon: '📈',
    cat: 'invest',
    rating: 0,
    scene: { place: 'office', mood: 'neutral', prop: 'chart' },
    when: { age: [18, 99], money: [3000, 1e12] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["Un collègue qui porte une veste sans manches te chuchote un « tuyau en or » à la machine à café : « Achète du Baguette & Fils. Fais-moi confiance. Mon beau-frère livre leur farine. »", "Ton oncle, celui qui a « presque » acheté Apple en 1980, te conseille d'investir en Bourse. « Le secret, c'est d'acheter bas et de vendre haut. » Merci, tonton.", "Un influenceur en Lamborghini de location te conseille d'acheter des actions {w:brand}. « Ça va faire x100, frérot. » Il a un code promo.", "Au repas de famille, ton beau-frère veut que tu investisses dans une start-up dont le produit permet de {w:superpower}. Il a déjà misé la maison de sa mère dessus.", "Un inconnu {w:at_place} te glisse à l'oreille : « Investis dans {w:food}. Les gens auront toujours faim. » Il sent fort la conviction."],
      en: ["A coworker in a fleece vest whispers a 'golden tip' at the coffee machine: 'Buy Baguette & Fils. Trust me. My brother-in-law delivers their flour.'", "Your uncle, the one who 'almost' bought Apple in 1980, tells you to invest in stocks. 'The secret is buy low, sell high.' Thanks, Uncle.", "An influencer in a rented Lamborghini tells you to buy {w:brand} stock. 'It's gonna 100x, bro.' He has a promo code.", "At the family dinner, your brother-in-law wants you to invest in a startup that's all about {w:superpower}. He's already bet his mother's house on it.", "A stranger {w:at_place} whispers in your ear: 'Invest in {w:food}. People will always be hungry.' He reeks of conviction."],
    },
    choices: [
      { label: { fr: 'Ouvrir un compte titres', en: 'Open a trading account' }, text: { fr: ["J'ai ouvert un compte titres. J'ai l'impression d'être un loup de Wall Street. En pyjama Pikachu.", "J'ai ouvert un compte titres et regardé les courbes toute la nuit en mangeant {w:food}. Je ne comprends rien, mais je me sens riche."], en: ["I opened a brokerage account. I feel like the Wolf of Wall Street. In Pikachu pyjamas.", "I opened a brokerage account and watched the charts all night eating {w:food}. I understand nothing, but I feel rich."] }, fx: { smarts: 2, happy: 3, open: 'stocks' } },
      { label: { fr: 'Livret A, c\'est très bien', en: 'Savings account is fine' }, text: { fr: ["J'ai tout laissé sur mon livret d'épargne à 1,5 %. L'inflation me mange lentement, mais poliment.", "J'ai gardé mon argent sous le matelas. Il ne rapporte rien, mais il ne m'a jamais menti."], en: ["I left everything in my 1.5% savings account. Inflation eats me slowly, but politely.", "I kept my money under the mattress. It earns nothing, but it's never lied to me."] }, fx: { stress: -3 } },
    ],
  },
  {
    id: 'mo_crypto_bro',
    icon: '🌝',
    cat: 'invest',
    rating: 2,
    vars: { amount: [1000, 15000] },
    scene: { place: 'party', mood: 'neutral', prop: 'phone' },
    when: { age: [18, 70], money: [3000, 1e12] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["En soirée, un type nommé Kévin, lunettes de soleil à 23 h, te parle de MoonRugPull. « C'est pas une crypto, c'est un mode de vie. » Il dit « to the moon » toutes les quatre secondes. Il vit chez sa mère.", "Un crypto-bro en Lambo de location t'explique que « l'argent fiat, c'est pour les esclaves ». Il veut que tu mettes {$amount} sur un jeton dont le logo est un chien en costume."],
      en: ["At a party, a guy called Kevin, sunglasses at 11 p.m., pitches you MoonRugPull. 'It's not a crypto, it's a lifestyle.' He says 'to the moon' every four seconds. He lives with his mom.", "A crypto bro in a rented Lambo explains that 'fiat money is for slaves'. He wants you to put {$amount} into a token whose logo is a dog in a suit."],
    },
    choices: [
      {
        label: { fr: 'All-in, to the moon', en: 'All in, to the moon' },
        out: [
          { w: 3, text: { fr: "J'ai mis {$amount}. Le lendemain, le jeton valait 0,0000001. Kévin a supprimé son compte et s'est installé à Dubaï. J'ai été rug-pullé{|e} comme un tapis de salon.", en: "I put in {$amount}. Next day the token was worth 0.0000001. Kevin deleted his account and moved to Dubai. I got rug-pulled like a living room carpet." }, fx: { money: '-amount', happy: -10, smarts: -2 }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai mis {$amount}. Le jeton a fait x8 en une semaine parce qu'un milliardaire a tweeté un emoji chien. J'ai revendu. Je suis insupportable en soirée maintenant.", en: 'I put in {$amount}. The token went 8x in a week because a billionaire tweeted a dog emoji. I sold. I am now unbearable at parties.' }, fx: { money: 'amount', moneyPct: 0.05, happy: 12, visual: 'money' }, mood: 'party' },
        ],
      },
      { label: { fr: 'Regarder le marché', en: 'Check the market' }, text: { fr: "J'ai dit à Kévin que j'allais « faire mes propres recherches ». J'ai ouvert l'appli de Bourse. Kévin m'a traité{|e} de « no-coiner ». Je le vis bien.", en: "I told Kevin I'd 'do my own research'. I opened the trading app. Kevin called me a 'no-coiner'. I'm at peace with it." }, fx: { smarts: 2, open: 'stocks' } },
      { label: { fr: 'Le clasher sur sa Lambo', en: 'Roast him about the Lambo' }, text: { fr: "Je lui ai demandé le prix de location de sa Lambo à la journée. Il a rougi. Toute la soirée l'a entendu. Il est parti en Uber.", en: 'I asked him the daily rental rate on his Lambo. He turned red. The whole party heard. He left in an Uber.' }, fx: { happy: 8, karma: -1 } },
    ],
  },
  {
    id: 'mo_mlm',
    icon: '🧴',
    cat: 'invest',
    rating: 1,
    actor: { create: { role: 'acquaintance', age: [-3, 3], gender: 'any' } },
    vars: { amount: [500, 3000] },
    scene: { place: 'home', mood: 'happy', prop: 'bottles' },
    when: { age: [18, 70], noFlag: 'mo_mlm_hun' },
    weight: 7,
    cooldown: 6,
    text: {
      fr: ["{a.first}, que tu n'as pas vu{a:|e} depuis le lycée, t'écrit : « Coucou toi !!! 💖 Ça te dirait d'être TA PROPRE PATRONNE ? » Spoiler : huiles essentielles, kit de démarrage à {$amount}.", "{a.first} t'invite à « une petite soirée entre amis ». C'est une réunion de vente de compléments alimentaires. Il y a un PowerPoint. Il y a une pyramide sur le PowerPoint."],
      en: ["{a.first}, who you haven't seen since high school, messages you: 'Hey hun!!! 💖 Wanna be YOUR OWN BOSS?' Spoiler: essential oils, starter kit {$amount}.", "{a.first} invites you to 'a little get-together'. It's a supplements sales pitch. There's a PowerPoint. There's a pyramid on the PowerPoint."],
    },
    choices: [
      { label: { fr: 'Rejoindre la team', en: 'Join the team' }, text: { fr: "J'ai acheté le kit à {$amount}. Je suis maintenant « Ambassadeur·rice Diamant en devenir ». J'ai harcelé tous mes contacts. J'ai perdu onze amis en une semaine.", en: "I bought the {$amount} kit. I'm now a 'Future Diamond Ambassador'. I spammed all my contacts. Lost eleven friends in a week." }, fx: { money: '-amount', happy: 4, flag: 'mo_mlm_hun', schedule: { key: 'mo_mlm_collapse', years: 2 } } },
      { label: { fr: 'Poser des questions', en: 'Ask questions' }, text: { fr: "J'ai demandé combien {a.first} avait vraiment gagné l'an dernier. Silence. Puis : « C'est pas une question d'argent, c'est une question de liberté. » Donc zéro.", en: "I asked {a.first} how much {a:he|she} actually made last year. Silence. Then: 'It's not about money, it's about freedom.' So, zero." }, fx: { smarts: 2, happy: 3 } },
      { label: { fr: 'Bloquer', en: 'Block' }, text: { fr: "J'ai bloqué {a.first} partout. {a:Il|Elle} a créé un nouveau compte pour me dire que j'avais « une mentalité de pauvre ». J'ai bloqué ce compte aussi.", en: "I blocked {a.first} everywhere. {a:He|She} made a new account to tell me I have 'a broke mindset'. I blocked that one too." }, fx: { stress: -2 } },
    ],
  },
  {
    id: 'mo_mlm_collapse',
    icon: '🔺',
    cat: 'invest',
    rating: 1,
    chainOnly: true,
    vars: { amount: [1000, 8000] },
    scene: { place: 'home', mood: 'sad', prop: 'boxes' },
    when: { flag: 'mo_mlm_hun' },
    text: {
      fr: ["Deux ans dans ta « team ». Ton garage contient 900 flacons d'huile de lavande et ta famille ne répond plus au téléphone. Ta « upline » vient de s'acheter une Mercedes. Avec ton argent.", "La société de ton MLM fait l'objet d'une enquête. Ton garage est rempli de shakes protéinés goût « chewing-gum tropical ». Tu as {$amount} de stock invendable."],
      en: ["Two years in your 'team'. Your garage holds 900 bottles of lavender oil and your family won't pick up. Your 'upline' just bought a Mercedes. With your money.", "Your MLM company is under investigation. Your garage is full of protein shakes in 'tropical bubblegum' flavour. You're sitting on {$amount} of unsellable stock."],
    },
    choices: [
      { label: { fr: 'Tout arrêter', en: 'Quit for good' }, text: { fr: "J'ai quitté le MLM. J'ai bu un shake au chewing-gum tropical en signe de deuil. J'ai vomi rose. Je suis libre.", en: 'I quit the MLM. I drank a tropical bubblegum shake in mourning. I threw up pink. I am free.' }, fx: { unflag: 'mo_mlm_hun', money: '-amount', happy: 6, stress: -8 } },
      {
        label: { fr: 'Recruter encore plus', en: 'Recruit even harder' },
        out: [
          { w: 1, text: { fr: "J'ai recruté ma grand-mère, mon facteur et mon dentiste. Je suis passé{|e} « Diamant ». J'ai gagné {$amount} et la haine de tout mon entourage.", en: "I recruited my grandma, my mailman and my dentist. I made 'Diamond'. I earned {$amount} and the hatred of everyone I know." }, fx: { money: 'amount', karma: -10, happy: 2 } },
          { w: 2, text: { fr: "J'ai essayé de recruter mon propre psy. Il m'a facturé la séance et m'a diagnostiqué{|e} « dans une secte, mais avec des shampoings ».", en: "I tried to recruit my own therapist. He billed the session and diagnosed me as 'in a cult, but with shampoo'." }, fx: { money: -150, happy: -6, unflag: 'mo_mlm_hun' } },
        ],
      },
    ],
  },

  // ───────────────────────────── business ─────────────────────────────
  {
    id: 'mo_biz_thief',
    icon: '🧾',
    cat: 'business',
    rating: 0,
    vars: { amount: [1000, 20000] },
    scene: { place: 'office', mood: 'angry', prop: 'register' },
    when: { age: [18, 99], business: true },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Ta comptable remarque qu'il manque {$amount} dans les caisses. Au même moment, ton employé le plus discret se pointe au boulot en jet-ski.", "Les caméras de surveillance montrent un de tes employés en train de remplir son sac à dos de billets. Il fait un petit signe à la caméra."],
      en: ["Your accountant notices {$amount} missing from the till. Meanwhile your quietest employee shows up to work on a jet ski.", "Security footage shows one of your employees stuffing his backpack with cash. He gives the camera a little wave."],
    },
    choices: [
      { label: { fr: 'Le virer', en: 'Fire him' }, text: { fr: "Je l'ai viré. Il est parti en emportant l'agrafeuse, une plante et le moral de l'équipe. Il a ouvert une boîte concurrente avec mon argent.", en: 'I fired him. He left with the stapler, a plant and team morale. He opened a competing business with my money.' }, fx: { money: '-amount', stress: 4 } },
      {
        label: { fr: 'Le confronter', en: 'Confront him' },
        out: [
          { w: 1, text: { fr: "Il a tout avoué en pleurant et a remboursé en vendant son jet-ski. Il est maintenant mon employé le plus loyal. Et le plus pauvre.", en: 'He confessed in tears and paid it back by selling his jet ski. He is now my most loyal employee. And the poorest.' }, fx: { happy: 6, karma: 4 } },
          { w: 1, text: { fr: "Il a nié en bloc, en regardant la vidéo de lui-même. « C'est mon jumeau. » Il n'a pas de jumeau. Je l'ai gardé par fascination.", en: "He denied everything while watching the footage of himself. 'That's my twin.' He doesn't have a twin. I kept him out of sheer fascination." }, fx: { money: '-amount', happy: -3 } },
        ],
      },
      { label: { fr: 'Augmenter tout le monde', en: 'Give everyone a raise' }, text: { fr: "Plutôt que punir, j'ai augmenté tout le monde. Les vols ont cessé. Les bénéfices aussi, mais l'ambiance est incroyable.", en: 'Instead of punishing, I gave everyone a raise. The theft stopped. So did the profits, but the vibe is amazing.' }, fx: { money: -5000, karma: 6, happy: 4 } },
    ],
  },
  {
    id: 'mo_biz_viral',
    icon: '⭐',
    cat: 'business',
    rating: 0,
    vars: { amount: [5000, 60000] },
    scene: { place: 'office', mood: 'shock', prop: 'phone' },
    when: { age: [18, 99], business: true },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["Un client a posté une critique de ta boîte qui devient virale. 4 millions de vues. Tu n'oses pas regarder si c'est une étoile ou cinq.", "Une star de TikTok a filmé ton commerce. Le téléphone sonne sans arrêt. Le problème : tu ne sais pas encore si c'était un compliment."],
      en: ["A customer posted a review of your business that went viral. 4 million views. You don't dare check if it's one star or five.", "A TikTok star filmed your business. The phone won't stop ringing. Problem: you don't know yet if it was a compliment."],
    },
    choices: [
      {
        label: { fr: 'Regarder la vidéo', en: 'Watch the video' },
        out: [
          { w: 2, text: { fr: "Cinq étoiles ! « Meilleure expérience de ma vie, le patron est un génie. » File d'attente jusqu'au coin de la rue. J'ai gagné {$amount} ce mois-ci.", en: "Five stars! 'Best experience of my life, the owner's a genius.' Queue around the block. I made {$amount} this month." }, fx: { money: 'amount', happy: 12, fame: 4, visual: 'money' }, mood: 'proud' },
          { w: 1, text: { fr: "Une étoile. « J'ai trouvé un cheveu. Le patron m'a regardé bizarrement. » Les gens viennent prendre des selfies devant en faisant la grimace. Je fais la grimace aussi.", en: "One star. 'Found a hair. The owner looked at me funny.' People come to take selfies out front, making faces. I'm making faces too." }, fx: { happy: -8, stress: 8, money: -3000 } },
        ],
      },
      { label: { fr: 'Ignorer internet', en: 'Ignore the internet' }, text: { fr: "Je n'ai rien regardé. J'ai continué à bosser. Ma vie est plus calme que celle de tous les gens qui ont vu la vidéo.", en: "I didn't look. Kept working. My life is calmer than that of everyone who watched the video." }, fx: { stress: -4 } },
    ],
  },
  {
    id: 'mo_biz_inspector',
    icon: '🐀',
    cat: 'business',
    rating: 2,
    vars: { amount: [500, 5000] },
    scene: { place: 'office', mood: 'shock', prop: 'clipboard' },
    when: { age: [18, 99], business: true },
    weight: 6,
    cooldown: 4,
    text: {
      fr: ["Inspection sanitaire surprise. L'inspecteur ouvre ton frigo. Un rat en sort, le regarde droit dans les yeux et repart avec une saucisse. Il a un nom, ce rat. C'est Jean-Claude. C'est presque un employé.", "Le contrôleur d'hygiène soulève une dalle du faux plafond. Il en tombe un pigeon mort, un slip et un nid de cafards qui applaudissent."],
      en: ["Surprise health inspection. The inspector opens your fridge. A rat climbs out, looks him dead in the eye and leaves with a sausage. The rat has a name. It's Jean-Claude. He's practically staff.", 'The health inspector lifts a ceiling tile. Out drop a dead pigeon, a pair of underpants and a nest of cockroaches that seem to applaud.'],
    },
    choices: [
      {
        label: { fr: "Glisser une enveloppe", en: 'Slip him an envelope' },
        out: [
          { w: 2, text: { fr: "J'ai glissé {$amount} dans son bloc-notes. Il a écrit « Établissement exemplaire » en enjambant Jean-Claude. La corruption, c'est l'huile du moteur.", en: "I slipped {$amount} into his clipboard. He wrote 'Exemplary establishment' while stepping over Jean-Claude. Corruption is the oil in the engine." }, fx: { money: '-amount', karma: -5, heat: 5 } },
          { w: 1, text: { fr: "C'était un inspecteur intègre. Il a filmé l'enveloppe. J'ai pris une amende, une fermeture administrative et un portrait dans le journal local, à côté de Jean-Claude.", en: "He was an honest inspector. He filmed the envelope. I got a fine, a shutdown order and a photo in the local paper, next to Jean-Claude." }, fx: { money: -10000, happy: -10, heat: 15, fame: 2 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Dire que c\'est un hamster', en: "Claim it's a hamster" }, text: { fr: "J'ai juré que Jean-Claude était « la mascotte, un hamster de race ». L'inspecteur a ri si fort qu'il a oublié de remplir le formulaire. Sauvé{|e} par l'absurde.", en: "I swore Jean-Claude was 'the mascot, a pedigree hamster'. The inspector laughed so hard he forgot to fill in the form. Saved by absurdity." }, fx: { happy: 6, karma: -1 } },
      { label: { fr: 'Fermer et désinfecter', en: 'Close and fumigate' }, text: { fr: "J'ai tout fermé deux semaines pour désinfecter. Jean-Claude a survécu. Il est revenu avec sa famille. Ils sont 40. Ils ont des projets.", en: 'I shut down for two weeks to fumigate. Jean-Claude survived. He came back with his family. There are 40 of them. They have plans.' }, fx: { money: '-amount', stress: 6, karma: 2 } },
    ],
  },
  {
    id: 'mo_biz_sabotage',
    icon: '🔥',
    cat: 'business',
    rating: 2,
    vars: { amount: [5000, 40000] },
    scene: { place: 'office', mood: 'angry', prop: 'smoke', fx: 'fire' },
    when: { age: [18, 99], business: true },
    weight: 5,
    cooldown: 5,
    text: {
      fr: ["Ton concurrent d'en face, un type avec une moustache de méchant de dessin animé, a laissé 200 faux avis une étoile sur ta boîte et versé du sucre dans ton réservoir. Ce matin, il t'a fait un clin d'œil.", "Ton local a pris feu cette nuit. Les pompiers ont retrouvé un bidon d'essence et une carte de fidélité au nom de ton concurrent. Il est vraiment très con."],
      en: ["Your competitor across the street, a guy with a cartoon-villain moustache, left 200 fake one-star reviews and poured sugar in your gas tank. This morning he winked at you.", "Your premises caught fire last night. Firefighters found a gas can and a loyalty card in your competitor's name. He's truly a moron."],
    },
    choices: [
      { label: { fr: 'Porter plainte', en: 'Sue him' }, text: { fr: "J'ai porté plainte. Après deux ans de procédure, le juge lui a ordonné de me payer {$amount}. Il les a payés en pièces de 1 centime, livrées par brouette. J'ai compté. Il en manquait deux.", en: 'I sued. After two years in court, the judge ordered him to pay me {$amount}. He paid in pennies, delivered by wheelbarrow. I counted. Two were missing.' }, fx: { money: 'amount', stress: 8, happy: 6 } },
      {
        label: { fr: 'Vengeance enflammée', en: 'Fiery revenge' },
        out: [
          { w: 1, text: { fr: "J'ai mis un pétard dans sa poubelle. Ça a déclenché un feu qui a cramé sa boutique, sa moustache et la mienne, alors que je n'en avais pas. Les flics ont des questions.", en: "I put a firecracker in his trash can. It started a fire that torched his shop, his moustache and mine, which I didn't even have. The cops have questions." }, fx: { heat: 30, karma: -10, happy: 6, health: -5, disease: 'burns', visual: 'fire' }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai voulu cramer sa boutique. J'ai cramé la mienne, qui était déjà à moitié brûlée. Les assurances parlent de « récidive ». La police aussi.", en: "I tried to burn down his shop. I burned down mine, which was already half-burnt. The insurers call it 'recidivism'. So do the police." }, fx: { arrest: 'arson', money: '-amount', visual: 'fire' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Le racheter', en: 'Buy him out' }, text: { fr: "J'ai racheté sa boîte et je l'ai embauché comme plongeur. Il fait la vaisselle en lissant sa moustache avec haine. Je passe le voir tous les jours.", en: 'I bought his business and hired him as a dishwasher. He scrubs pots, smoothing his moustache with hatred. I visit him every day.' }, fx: { money: '-amount', happy: 12, karma: -2 }, mood: 'proud' },
    ],
  },

  // ───────────────────────────── influencers ─────────────────────────────
  {
    id: 'mo_sponsor',
    icon: '🍵',
    cat: 'influencer',
    rating: 2,
    vars: { amount: [2000, 40000] },
    scene: { place: 'studio', mood: 'happy', prop: 'ringlight', fx: 'poop' },
    when: { age: [16, 99], followers: [10000, 1e12] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["Une marque de « thé détox minceur » te propose {$amount} pour une vidéo. Ingrédient principal : un laxatif pour chevaux. Slogan : « Libère ton corps ».", "Une start-up de « tisane intestinale premium » veut un partenariat : {$amount} pour une vidéo. Slogan : « Chie ta négativité ». La composition tient en un mot, en latin, suivi de trois points d'exclamation."],
      en: ["A 'detox slimming tea' brand offers you {$amount} for a video. Main ingredient: a horse laxative. Slogan: 'Free your body'.", "A 'premium gut-cleanse tea' start-up wants a partnership: {$amount} for one video. Slogan: 'Poop out your negativity'. The ingredient list is one Latin word followed by three exclamation marks."],
    },
    choices: [
      {
        label: { fr: 'Accepter le chèque', en: 'Take the cheque' },
        out: [
          { w: 2, text: { fr: "J'ai bu le thé en direct pour prouver qu'il était « safe ». Au bout de 6 minutes, le live s'est transformé en film catastrophe. Mon intestin a fait la une. J'ai encaissé {$amount}, assis{|e}.", en: 'I drank the tea live to prove it was "safe". Six minutes in, the stream became a disaster movie. My colon made headlines. I cashed {$amount}, sitting down.' }, fx: { money: 'amount', health: -6, followers: 30000, fame: 4, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai fait la promo. Mes abonnés ont acheté le produit. Des milliers de gens ont eu la chiasse en même temps. Les égouts de trois villes ont lâché. On m'appelle « le Fléau ».", en: 'I promoted it. My followers bought it. Thousands of people got the runs simultaneously. The sewers of three cities gave out. They call me "the Plague".' }, fx: { money: 'amount', followers: -20000, karma: -10, fame: 6, visual: 'poop' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Refuser poliment', en: 'Politely decline' }, text: { fr: "J'ai refusé. Une influenceuse concurrente a accepté. Elle a trois millions d'abonnés de plus et des problèmes de rectum. Chacun ses choix.", en: "I said no. A rival influencer said yes. She has three million more followers and rectal issues. Everyone makes their choices." }, fx: { karma: 5, happy: 2 } },
      { label: { fr: 'Dénoncer la marque', en: 'Expose the brand' }, text: { fr: "J'ai publié leur mail avec une vidéo indignée. Gros buzz. La marque a changé de nom et me propose maintenant un contrat pour son « nouveau thé ». Même thé.", en: "I posted their email with an outraged video. Huge buzz. The brand renamed itself and is now offering me a deal for its 'new tea'. Same tea." }, fx: { followers: 25000, karma: 6, fame: 3 } },
    ],
  },
  {
    id: 'mo_cancelled',
    icon: '🕯️',
    cat: 'influencer',
    rating: 2,
    scene: { place: 'studio', mood: 'cry', prop: 'phone' },
    when: { age: [18, 99], followers: [10000, 1e12] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Quelqu'un a déterré un de tes tweets de 2011 : « les pigeons c'est des rats avec des ailes lol ». Le lobby des amoureux des pigeons est en guerre. Le hashtag #{first}EstFini est numéro 1.", "Une vidéo de toi en train de renvoyer ton plat au resto trois fois devient virale. Internet a décidé que tu es la pire personne de l'année. Il est 9 h."],
      en: ["Someone dug up a tweet of yours from 2011: 'pigeons r just rats with wings lol'. The pigeon lovers' lobby has declared war. #{first}IsOverParty is trending.", "A video of you sending your dish back three times at a restaurant goes viral. The internet has decided you are the worst person of the year. It's 9 a.m."],
    },
    choices: [
      { label: { fr: 'Vidéo d\'excuses en larmes', en: 'Tearful apology video' }, text: { fr: "Vidéo d'excuses classique : sweat gris, pas de maquillage, lumière triste, « je suis en train d'apprendre ». J'ai perdu des abonnés, mais j'ai gagné une catégorie YouTube à moi tout{|e} seul{|e}.", en: "Classic apology video: grey hoodie, no makeup, sad lighting, 'I'm learning and growing'. I lost followers but gained a YouTube genre all to myself." }, fx: { followers: -8000, happy: -6, stress: 6 } },
      { label: { fr: 'Doubler la mise', en: 'Double down' }, text: { fr: "J'ai posté une photo de moi en train de manger un sandwich devant des pigeons affamés. Les haters m'ont fait gagner 200 000 abonnés. Les pigeons, eux, ne m'ont pas pardonné. Ils me chient dessus partout où je vais.", en: 'I posted a photo of myself eating a sandwich in front of starving pigeons. The haters got me 200,000 new followers. The pigeons did not forgive me. They shit on me wherever I go.' }, fx: { followers: 200000, karma: -8, fame: 8, visual: 'poop' }, mood: 'proud' },
      { label: { fr: 'Disparaître six mois', en: 'Vanish for six months' }, text: { fr: "J'ai disparu six mois dans une retraite de méditation. À mon retour, plus personne ne se souvenait de moi. Ni de mes ennemis. Ni de mon mot de passe.", en: "I vanished for six months to a meditation retreat. When I came back nobody remembered me. Not my enemies. Not my password." }, fx: { followers: -30000, stress: -15, happy: 5 } },
    ],
  },
  {
    id: 'mo_fan_weirdo',
    icon: '🤳',
    cat: 'influencer',
    rating: 1,
    scene: { place: 'park', mood: 'shock', prop: 'selfie' },
    when: { age: [18, 99], followers: [10000, 1e12] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["Rencontre fans dans un centre commercial. Un type de 45 ans a ton visage tatoué sur tout le dos, en plus jeune et plus musclé. Il te tend un bocal. « C'est mes ongles de pied. Pour toi. »", "Une fan te suit depuis le café jusqu'à chez toi. Elle porte les mêmes vêtements que toi. Exactement les mêmes. Ceux d'aujourd'hui."],
      en: ["Fan meetup at a mall. A 45-year-old man has your face tattooed across his entire back, younger and buffer. He hands you a jar. 'My toenails. For you.'", "A fan follows you from the coffee shop to your house. She's wearing the same clothes as you. Exactly the same. Today's."],
    },
    choices: [
      { label: { fr: 'Sourire et fuir', en: 'Smile and flee' }, text: { fr: "J'ai souri, signé le bocal et couru jusqu'au parking. J'ai déménagé le mois suivant. Le bocal est arrivé à ma nouvelle adresse.", en: 'I smiled, signed the jar and sprinted to the parking lot. I moved out the next month. The jar arrived at my new address.' }, fx: { stress: 10, money: -1500 } },
      { label: { fr: 'En faire du contenu', en: 'Make content of it' }, text: { fr: "J'ai filmé le tatouage et le bocal. Vidéo « Mon fan le plus bizarre ». 5 millions de vues. Le fan est maintenant plus célèbre que moi. Il a son propre manager.", en: "I filmed the tattoo and the jar. Video: 'My weirdest fan'. 5 million views. The fan is now more famous than me. He has his own manager." }, fx: { followers: 40000, fame: 3, karma: -2 } },
      { label: { fr: 'Appeler la sécurité', en: 'Call security' }, text: { fr: "La sécurité l'a escorté dehors. Il criait mon nom en pleurant. Les autres fans ont filmé. Je passe pour une diva. Je garde quand même mes distances avec les bocaux.", en: 'Security escorted him out. He was crying my name. The other fans filmed it. I look like a diva. Still keeping my distance from jars.' }, fx: { followers: -2000, stress: -3 } },
    ],
  },

  // ───────────────────────────── windfalls, scams, taxes, gambling ─────────────────────────────
  {
    id: 'mo_lottery',
    icon: '🎟️',
    cat: 'luck',
    rating: 0,
    vars: { amount: [1000000, 20000000] },
    scene: { place: 'home', mood: 'happy', prop: 'ticket', fx: 'confetti' },
    when: { age: [18, 99] },
    weight: 6,
    cooldown: 3,
    text: {
      fr: ["Le buraliste te tend un ticket de loto : « La cagnotte est à {$amount} ce soir. Il faut bien que quelqu'un gagne. » Statistiquement, ce quelqu'un ne sera pas toi.", "Tu trouves un vieux ticket à gratter dans la poche de ton manteau d'hiver. Pas encore gratté. Il te regarde.", "Le buraliste te jure que le ticket gagnant de la semaine dernière a été acheté par {w:weird_job}. « La prochaine fois, ce sera peut-être toi. » Cagnotte : {$amount}.", "Tu as rêvé de six numéros cette nuit. Le sixième était « {w:animal} ». Le loto de ce soir promet {$amount}.", "Ta grand-mère t'a offert un ticket de loto « porte-bonheur », avec {w:gift}. La cagnotte est à {$amount}. Elle a déjà prévu ce qu'elle ferait de sa part."],
      en: ["The newsagent hands you a lottery ticket: 'The jackpot is {$amount} tonight. Somebody has to win.' Statistically, that somebody won't be you.", "You find an old scratch card in your winter coat pocket. Unscratched. It's looking at you.", "The newsagent swears last week's winning ticket was bought by {w:weird_job}. 'Next time, it could be you.' Jackpot: {$amount}.", "You dreamed of six numbers last night. The sixth was '{w:animal}'. Tonight's lottery promises {$amount}.", "Your grandma gave you a 'lucky' lottery ticket, along with {w:gift}. The jackpot is {$amount}. She's already planned what she'll do with her share."],
    },
    choices: [
      {
        label: { fr: 'Tenter sa chance', en: 'Try my luck' },
        out: [
          { w: 40, text: { fr: ["Perdu. J'avais deux numéros sur six. Le buraliste m'a dit « la prochaine fois ». Il dit ça à tout le monde. C'est son business plan.", "Perdu. Les numéros gagnants, c'était ma date de naissance. J'avais joué la pointure de mon ex."], en: ["Lost. I had two numbers out of six. The newsagent said 'next time'. He says that to everyone. It's his business plan.", "Lost. The winning numbers were my birthday. I'd played my ex's shoe size."] }, fx: { money: -5, happy: -1 } },
          { w: 8, text: { fr: ["J'ai gagné 50 balles ! J'ai crié dans le bureau de tabac. Un retraité m'a applaudi{|e}. J'ai rejoué les 50 balles. J'ai tout perdu.", "J'ai gagné 50 balles et je me suis offert {w:food} pour fêter ça. Le reste, je l'ai rejoué. Il n'y a plus de reste."], en: ["I won 50 bucks! I screamed in the store. A retiree clapped. I played the 50 again. Lost it all.", "I won 50 bucks and treated myself to {w:food} to celebrate. I played the rest again. There is no rest anymore."] }, fx: { happy: 4 } },
          { w: 1, text: { fr: ["JACKPOT. {$amount}. J'ai vérifié 47 fois. J'ai vomi de joie dans le caniveau. Ma famille, que je n'avais pas vue depuis 10 ans, a appelé dans l'heure.", "JACKPOT. {$amount}. J'ai hurlé « {w:exclaim} » dans le tabac et je me suis évanoui{|e} dans le présentoir à briquets. Le buraliste m'a ranimé{|e} avec un Kinder."], en: ["JACKPOT. {$amount}. I checked 47 times. I threw up with joy in the gutter. Family I hadn't seen in 10 years called within the hour.", "JACKPOT. {$amount}. I yelled '{w:exclaim}' in the shop and fainted into the lighter display. The newsagent revived me with a chocolate bar."] }, fx: { money: 'amount', happy: 30, fame: 6, visual: 'money', counter: 'lottery' }, mood: 'party' },
        ],
      },
      { label: { fr: 'Garder mes 2 €', en: 'Keep my two bucks' }, text: { fr: ["J'ai gardé mes 2 €. Le soir même, quelqu'un de ma ville a gagné. J'ai décidé de ne jamais savoir avec quels numéros.", "Je n'ai pas joué. Avec mes 2 €, je me suis acheté {w:food}. C'était bon. Ça, au moins, c'est un gain garanti."], en: ["I kept my two bucks. That very night, someone in my town won. I decided never to find out which numbers.", "I didn't play. With my two bucks, I bought {w:food}. It was good. At least that's a guaranteed win."] }, fx: { smarts: 1 } },
    ],
  },
  {
    id: 'mo_weird_uncle',
    icon: '📜',
    cat: 'luck',
    rating: 1,
    vars: { amount: [20000, 300000] },
    scene: { place: 'cemetery', mood: 'shock', prop: 'will' },
    when: { age: [18, 99] },
    weight: 3,
    once: true,
    text: {
      fr: ["Ton grand-oncle Ferdinand, l'excentrique de la famille qui vivait avec 30 chats et un mannequin appelé Ginette, est mort. Le notaire lit le testament. Il y a des conditions.", "Le notaire t'apprend qu'un oncle dont tu ignorais tout t'a légué « tous ses biens ». Il a été retrouvé momifié dans son corbillard, en pleine Lozère. La lecture du testament promet."],
      en: ["Your great-uncle Ferdinand, the family eccentric who lived with 30 cats and a mannequin named Ginette, has died. The notary reads the will. There are conditions.", "The notary informs you that an uncle you never knew has left you 'all his property'. He was found mummified in his hearse in the middle of nowhere. The will reading should be fun."],
    },
    choices: [
      { label: { fr: 'Accepter les conditions', en: 'Accept the conditions' }, text: { fr: "Condition : prononcer son éloge funèbre en slip léopard et embrasser Ginette sur la bouche, devant toute la famille. Je l'ai fait. J'ai touché {$amount}. Mamie ne me parle plus.", en: 'Condition: deliver his eulogy in leopard briefs and kiss Ginette on the mouth in front of the whole family. I did it. I got {$amount}. Grandma no longer speaks to me.' }, fx: { money: 'amount', happy: 8, fame: 2, visual: 'money' }, mood: 'proud' },
      { label: { fr: 'Prendre le corbillard', en: 'Take the hearse' }, text: { fr: "J'ai renoncé à l'argent mais j'ai pris le corbillard. Il sent encore un peu l'oncle. Les gens s'écartent sur la route. C'est le pied.", en: "I gave up the money but took the hearse. It still smells a bit like the uncle. People move aside on the road. It's awesome." }, fx: { asset: 'c_hearse', happy: 6 } },
      { label: { fr: 'Prendre les chats', en: 'Take the cats' }, text: { fr: "J'ai pris un des chats, le plus moche, celui qui a un seul œil et une haine profonde de l'humanité. Il s'appelle Satan. On s'entend bien.", en: "I took one of the cats, the ugliest one, with one eye and a deep hatred of humanity. His name is Satan. We get along." }, fx: { newNpc: { role: 'pet', species: 'cat' }, happy: 5, karma: 3 } },
    ],
  },
  {
    id: 'mo_scam_call',
    icon: '📞',
    cat: 'scam',
    rating: 0,
    vars: { amount: [300, 5000] },
    scene: { place: 'home', mood: 'neutral', prop: 'phone' },
    when: { age: [18, 99] },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["« Bonjour, ici votre banque. Votre compte a été piraté. Pour le sécuriser, donnez-moi votre code, votre date de naissance et le nom de votre premier animal. » La voix a un accent étrange et un coq chante derrière.", "SMS : « Votre colis est bloqué en douane. Payez 1,99 € de frais ici : http://la-poste-vraiment-officielle.ru »", "Message privé : « Bonjour, c'est {w:celeb}. J'ai besoin de 500 € en cartes cadeaux pour débloquer ma fortune. Je vous rembourserai le triple. » La photo est floue.", "SMS : « Maman, c'est moi, j'ai changé de numéro, envoie-moi de l'argent pour {w:food} ». Tu n'as pas d'enfant. Ou alors on ne t'a rien dit.", "Un e-mail t'annonce que tu as gagné {w:vehicle} à une loterie à laquelle tu n'as jamais joué. Il suffit de payer {$amount} de « frais de port »."],
      en: ["'Hello, this is your bank. Your account has been hacked. To secure it, give me your PIN, your date of birth and the name of your first pet.' The voice has an odd accent and a rooster crows in the background.", "Text: 'Your parcel is held at customs. Pay a $1.99 fee here: http://post-office-very-official.ru'", "DM: 'Hello, this is {w:celeb}. I need 500 bucks in gift cards to unlock my fortune. I'll pay you back triple.' The photo is blurry.", "Text: 'Mom, it's me, new number, send me money for {w:food}'. You don't have kids. Or nobody told you.", "An email says you've won {w:vehicle} in a lottery you never entered. You just need to pay {$amount} in 'shipping fees'."],
    },
    choices: [
      {
        label: { fr: 'Obéir', en: 'Do as told' },
        out: [
          { w: 3, text: { fr: ["J'ai tout donné. Le lendemain, {$amount} avaient disparu de mon compte, remplacés par une commande de 200 grille-pain livrés en Moldavie.", "J'ai tout donné. Mon compte a perdu {$amount}. En échange, j'ai reçu {w:object} par la poste. C'est déjà ça."], en: ["I gave them everything. Next day {$amount} had vanished from my account, replaced by an order of 200 toasters shipped to Moldova.", "I gave them everything. My account lost {$amount}. In exchange, I got {w:object} in the mail. Better than nothing."] }, fx: { money: '-amount', happy: -8, smarts: -2 }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai tout donné, mais mon compte était déjà à découvert. Les escrocs ont pris pitié et m'ont viré 20 balles. Même les arnaqueurs me trouvent pauvre.", "Les escrocs ont vu mon solde et ont raccroché. Le lendemain, ils m'ont envoyé une carte de soutien."], en: ["I gave them everything, but my account was already overdrawn. The scammers took pity and sent me 20 bucks. Even scammers think I am poor.", "The scammers saw my balance and hung up. The next day, they sent me a sympathy card."] }, fx: { money: 20, happy: -2 } },
        ],
      },
      { label: { fr: 'Le faire tourner en bourrique', en: 'Waste his time' }, text: { fr: ["Je l'ai gardé au téléphone 2 h en me faisant passer pour ma propre grand-mère sourde. Il a fini par raccrocher en pleurant. Je me sens utile à la société.", "Je lui ai fait croire que j'étais {w:weird_job} et je lui ai décrit mon métier pendant une heure. Il a fini par me demander des conseils de carrière."], en: ["I kept him on the line for two hours pretending to be my own deaf grandmother. He hung up crying. I feel like I served society.", "I convinced him I was {w:weird_job} and described my job for an hour. He ended up asking me for career advice."] }, fx: { happy: 8, karma: 3 } },
      { label: { fr: 'Raccrocher', en: 'Hang up' }, text: { fr: ["J'ai raccroché. Il a rappelé onze fois. Le coq aussi semblait insister.", "J'ai raccroché en criant « {w:exclaim} ». Depuis, je reçois quatre appels par jour d'un numéro qui chante."], en: ["I hung up. He called back eleven times. The rooster seemed insistent too.", "I hung up shouting '{w:exclaim}'. Since then, I get four calls a day from a number that sings."] }, fx: { stress: 2 } },
    ],
  },
  {
    id: 'mo_tax_audit',
    icon: '🧮',
    cat: 'tax',
    rating: 1,
    vars: { amount: [2000, 60000] },
    scene: { place: 'office', mood: 'shock', prop: 'papers' },
    when: { age: [22, 99], money: [20000, 1e12] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Contrôle fiscal. Un inspecteur à lunettes, sans le moindre sens de l'humour, veut voir toutes tes factures des cinq dernières années. Toi, tu as un sac Carrefour plein de tickets froissés.", "Le fisc s'intéresse à toi. Ton « bureau à domicile » déclaré en frais professionnels, c'est ton canapé. Et ton « véhicule de fonction », ta trottinette."],
      en: ["Tax audit. A bespectacled inspector with zero sense of humour wants every receipt from the last five years. You have a grocery bag full of crumpled tickets.", "The tax office is interested in you. The 'home office' you deducted is your couch. Your 'company vehicle' is your scooter."],
    },
    choices: [
      {
        label: { fr: 'Tout justifier', en: 'Justify everything' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai tout classé, tout justifié, tout surligné en trois couleurs. L'inspecteur a souri. Je crois. Il m'a même remboursé un trop-perçu. Je suis un génie de l'administratif.", en: "I sorted, justified and highlighted everything in three colours. The inspector smiled. I think. He even refunded an overpayment. I'm an admin genius." }, fx: { money: 800, happy: 8, smarts: 2 }, mood: 'proud' },
          { w: 2, text: { fr: "Mes justificatifs incluaient un ticket de McDo en « repas d'affaires avec moi-même ». Redressement : {$amount}. Plus les pénalités. Plus le mépris.", en: "My receipts included a McDonald's bill filed as a 'business meal with myself'. Reassessment: {$amount}. Plus penalties. Plus contempt." }, fx: { money: '-amount', happy: -8, stress: 10 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Montrer mon passeport exotique', en: 'Show my offshore passport' }, if: { flag: 'mo_tax_exile' }, text: { fr: "J'ai sorti mon passeport de résident d'un paradis fiscal. L'inspecteur a soupiré, rangé son dossier et murmuré « un jour, on vous aura ». Pas aujourd'hui, mon petit.", en: "I pulled out my tax-haven residency papers. The inspector sighed, closed his file and muttered 'one day we'll get you'. Not today, buddy." }, fx: { happy: 6, karma: -3 } },
      { label: { fr: 'Pleurer', en: 'Cry' }, text: { fr: "J'ai fondu en larmes en lui racontant mon divorce, ma sciatique et la mort de mon hamster en 2004. Il a réduit la note de moitié. Ma dignité, elle, a été saisie.", en: 'I broke down telling him about my divorce, my sciatica and the death of my hamster in 2004. He halved the bill. My dignity was seized.' }, fx: { money: -1000, happy: -4 } },
      { label: { fr: 'Fuir en Belgique', en: 'Flee the country' }, text: { fr: "J'ai essayé de passer la frontière dans le coffre d'un ami. Douane. Contrôle. J'ai été arrêté{|e} avec un sandwich dans la bouche.", en: "I tried crossing the border in a friend's trunk. Customs. Search. I was arrested with a sandwich in my mouth." }, fx: { arrest: 'taxfraud' } },
    ],
  },
  {
    id: 'mo_casino',
    icon: '🎰',
    cat: 'gambling',
    rating: 2,
    vars: { amount: [500, 20000] },
    scene: { place: 'casino', mood: 'party', prop: 'chips' },
    when: { age: [18, 99], money: [500, 1e12] },
    weight: 7,
    cooldown: 3,
    text: {
      fr: ["Soirée au casino. Moquette qui donne la nausée, pas d'horloge, pas de fenêtre, et une mamie qui tape sur une machine à sous en hurlant « ALLEZ MA SALOPE ». L'ambiance est électrique.", "Tu as {$amount} en poche, un costume loué et la conviction profonde d'avoir « une méthode » pour la roulette. Tu l'as vue sur YouTube."],
      en: ["Casino night. Nauseating carpet, no clocks, no windows, and a granny pounding a slot machine screaming 'COME ON, YOU BITCH'. Electric atmosphere.", "You've got {$amount} in your pocket, a rented suit and the deep conviction you've got 'a system' for roulette. You saw it on YouTube."],
    },
    choices: [
      {
        label: { fr: 'Tout sur le rouge', en: 'All on red' },
        out: [
          { w: 2, text: { fr: "Rouge ! J'ai doublé ma mise, crié comme une bête et embrassé le croupier sur le crâne. J'ai gagné {$amount}. Je suis invincible. Je reviens la semaine prochaine.", en: 'Red! I doubled up, roared like an animal and kissed the croupier on his bald head. Won {$amount}. I am invincible. Coming back next week.' }, fx: { money: 'amount', happy: 12, addiction: ['gambling', 15], visual: 'money' }, mood: 'party' },
          { w: 3, text: { fr: "Noir. J'ai perdu {$amount}, puis ma montre, puis mon costume de location. Je suis rentré{|e} en caleçon dans le bus de nuit. La mamie, elle, est repartie en limousine.", en: 'Black. I lost {$amount}, then my watch, then my rented suit. I went home in my boxers on the night bus. The granny left in a limo.' }, fx: { money: '-amount', happy: -10, addiction: ['gambling', 15] }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Ma « méthode » au blackjack', en: 'My blackjack "system"' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai compté les cartes. Deux types en costume m'ont soulevé{|e} par les aisselles et jeté{|e} dehors, avec mes gains : {$amount}. Le meilleur videur de ma vie.", en: 'I counted cards. Two men in suits lifted me by the armpits and tossed me out, winnings and all: {$amount}. Best bouncing of my life.' }, fx: { money: 'amount', happy: 8, smarts: 2, addiction: ['gambling', 10] } },
          { w: 2, text: { fr: "Ma méthode YouTube consistait à « suivre son instinct ». Mon instinct est un crétin. J'ai perdu {$amount} et j'ai pleuré dans les toilettes à côté d'un dentiste ruiné.", en: "My YouTube system was 'follow your gut'. My gut is an idiot. Lost {$amount} and cried in the restroom next to a bankrupt dentist." }, fx: { money: '-amount', happy: -8, addiction: ['gambling', 15] } },
        ],
      },
      { label: { fr: 'Juste le buffet', en: 'Just the buffet' }, text: { fr: "J'ai ignoré les tables et mangé 14 crevettes géantes au buffet gratuit. Le casino a perdu de l'argent sur moi. Je suis le seul gagnant de la soirée.", en: "I ignored the tables and ate 14 jumbo shrimp at the free buffet. The casino lost money on me. I'm the night's only winner." }, fx: { happy: 6, health: -1 } },
    ],
  },

  // ───────────────────────────── feed lines (auto) ─────────────────────────────
  {
    id: 'mo_auto_found_cash',
    icon: '💵',
    cat: 'luck',
    rating: 0,
    auto: true,
    vars: { amount: [20, 400] },
    scene: { place: 'park', mood: 'happy', prop: 'cash', fx: 'money' },
    when: { age: [16, 99] },
    weight: 5,
    cooldown: 4,
    text: {
      fr: ["J'ai trouvé {$amount} dans la poche d'un vieux jean. Le moi du passé est un héros.", "En soulevant les coussins du canapé, j'ai trouvé {$amount}, trois télécommandes et une frite de 2019. J'ai gardé l'argent.", "J'ai acheté {w:object} en brocante pour deux euros. Dedans, il y avait {$amount}. Meilleur placement de ma vie.", "J'ai vu {w:animal} traverser la rue avec {$amount} dans la gueule. Course-poursuite, butin lâché, [[aucun témoin|zéro regret|partage équitable en croquettes]].", "Ma grand-mère m'a glissé {$amount} dans la main en chuchotant « pour t'acheter {w:food} ». [[J'ai obéi.|J'ai acheté autre chose.|Je n'ai rien dit à personne.]]"],
      en: ["I found {$amount} in the pocket of old jeans. Past me is a hero.", "Lifting the couch cushions, I found {$amount}, three remotes and a french fry from 2019. I kept the money.", "I bought {w:object} at a flea market for two bucks. Inside, there was {$amount}. Best investment of my life.", "I saw {w:animal} crossing the street with {$amount} in its mouth. Chase, dropped loot, [[no witnesses|zero regrets|fair split, paid in kibble]].", "My grandma slipped {$amount} into my hand, whispering 'buy yourself {w:food}'. [[I obeyed.|I bought something else.|I told no one.]]"],
    },
    fx: { money: 'amount', happy: 4 },
  },
  {
    id: 'mo_auto_parking',
    icon: '🅿️',
    cat: 'car',
    rating: 0,
    auto: true,
    vars: { amount: [35, 135] },
    scene: { place: 'park', mood: 'angry', prop: 'ticket' },
    when: { age: [16, 99], asset: 'car' },
    weight: 6,
    cooldown: 2,
    text: {
      fr: ["J'ai pris une amende de {$amount} pour m'être garé{|e} 4 minutes devant une boulangerie. La contractuelle attendait cachée derrière un platane.", "{$amount} d'amende pour stationnement « gênant ». Gênant pour qui ? Il n'y avait personne. Juste un pigeon et la contractuelle.", "Le temps d'acheter {w:food}, j'ai pris {$amount} d'amende. Sous l'essuie-glace, la contractuelle avait dessiné un smiley. Elle me nargue.", "J'ai contesté une amende de {$amount} en expliquant que c'était une urgence : je devais {w:activity}. Réponse de l'administration : amende [[majorée|doublée|encadrée et affichée au guichet]].", "{$amount} d'amende pour stationnement sur un trottoir. Sur le même trottoir, il y a {w:vehicle} qui n'a pas bougé depuis 2017, sans la moindre contravention."],
      en: ["I got a {$amount} ticket for parking 4 minutes outside a bakery. The traffic warden was hiding behind a tree.", "{$amount} fine for 'obstructive' parking. Obstructing whom? There was nobody. Just a pigeon and the warden.", "In the time it took to buy {w:food}, I got a {$amount} ticket. Under the wiper, the warden had drawn a smiley face. She's taunting me.", "I contested a {$amount} ticket explaining it was an emergency: I had to be {w:activity}. The authorities' reply: fine [[increased|doubled|framed and hung at the front desk]].", "{$amount} fine for parking on the sidewalk. On the same sidewalk, there's {w:vehicle} that hasn't moved since 2017, without a single ticket."],
    },
    fx: { money: '-amount', happy: -3 },
  },
  {
    id: 'mo_auto_bank_fees',
    icon: '🏦',
    cat: 'poverty',
    rating: 2,
    auto: true,
    vars: { amount: [30, 250] },
    scene: { place: 'home', mood: 'angry', prop: 'letter' },
    when: { age: [18, 99], money: [-1e9, 2000] },
    weight: 6,
    cooldown: 3,
    text: {
      fr: ["Ma banque m'a facturé {$amount} de frais pour m'informer que je n'avais pas d'argent. Puis des frais pour les frais. Ces enculés ont inventé le mouvement perpétuel.", "Découvert de 3 €, agios de {$amount}. Mon banquier m'a envoyé un mail « Votre bien-être financier compte pour nous ». J'ai ri jusqu'au sang."],
      en: ["My bank charged me {$amount} in fees to inform me I had no money. Then fees for the fees. These bastards invented perpetual motion.", "Overdrawn by $3, fees of {$amount}. My banker emailed me 'Your financial wellbeing matters to us'. I laughed till I bled."],
    },
    fx: { money: '-amount', happy: -5, stress: 4 },
  },
  {
    id: 'mo_auto_cat_food',
    icon: '🥫',
    cat: 'poverty',
    rating: 1,
    auto: true,
    scene: { place: 'apartment', mood: 'sad', prop: 'can' },
    when: { age: [18, 99], money: [-1e9, 500] },
    weight: 4,
    cooldown: 5,
    text: {
      fr: ["Fin de mois. J'ai mangé une pâtée pour chat « saveur lapin ». Honnêtement, avec du pain, ça passe. Je n'ai pas de chat.", "J'ai dîné de sachets de ketchup volés au fast-food, dilués dans de l'eau chaude. J'ai appelé ça « gaspacho ». J'ai pleuré dedans, ça l'a salé."],
      en: ["End of the month. I ate a can of 'rabbit flavour' cat food. Honestly, on toast, it's fine. I don't have a cat.", "I had stolen fast-food ketchup packets dissolved in hot water for dinner. I called it 'gazpacho'. I cried into it, which seasoned it."],
    },
    fx: { happy: -5, health: -2 },
  },
  {
    id: 'mo_auto_freebies',
    icon: '📦',
    cat: 'influencer',
    rating: 1,
    auto: true,
    vars: { amount: [200, 3000] },
    scene: { place: 'studio', mood: 'happy', prop: 'boxes' },
    when: { age: [18, 99], followers: [10000, 1e12] },
    weight: 6,
    cooldown: 2,
    text: {
      fr: ["Des marques m'ont envoyé pour {$amount} de cadeaux : une gourde connectée, un masque LED et un sex-toy en forme d'avocat. J'ai tout revendu sur Vinted, sauf l'avocat.", "J'ai reçu 46 colis « gratuits » de marques qui veulent une story. J'ai revendu le tout {$amount}. Je n'ai plus de place dans mon salon. Je dors sur des sérums.", "Une marque m'a offert {w:vehicle} contre trois stories enthousiastes. J'ai tout revendu {$amount} sur Leboncoin. La marque m'a bloqué{|e} partout.", "J'ai reçu un colis « surprise » d'une marque : {w:object}, {w:food} et un code promo. J'ai tout revendu {$amount}, sauf le code promo, qui ne valait rien.", "{w:app} m'a versé {$amount} pour dire du bien de l'appli. J'ai posté une story tout sourire, {w:drink} à la main. Toujours célibataire, mais rémunéré{|e}."],
      en: ["Brands sent me {$amount} worth of gifts: a smart water bottle, an LED mask and an avocado-shaped sex toy. I resold everything online, except the avocado.", "I got 46 'free' parcels from brands wanting a story. I resold the lot for {$amount}. No room left in my living room. I sleep on serums.", "A brand gave me {w:vehicle} in exchange for three enthusiastic stories. I resold it all online for {$amount}. The brand blocked me everywhere.", "I got a 'surprise' package from a brand: {w:object}, {w:food} and a promo code. I resold everything for {$amount}, except the promo code, which was worthless.", "{w:app} paid me {$amount} to say nice things about the app. I posted a beaming story, {w:drink} in hand. Still single, but paid."],
    },
    fx: { money: 'amount', happy: 4 },
  },
  {
    id: 'mo_auto_gambling',
    icon: '🃏',
    cat: 'gambling',
    rating: 2,
    auto: true,
    vars: { amount: [300, 6000] },
    scene: { place: 'casino', mood: 'cry', prop: 'chips' },
    when: { age: [18, 99], addiction: 'gambling' },
    weight: 8,
    cooldown: 1,
    text: {
      fr: ["J'ai parié {$amount} sur un match de curling féminin moldave à 3 h du matin. J'ai perdu. Je ne connais pas les règles du curling. Ni la Moldavie.", "J'ai perdu {$amount} au poker en ligne contre un certain « xXTonton69Xx ». Il m'a écrit « gg pov con ». J'ai rechargé mon compte."],
      en: ["I bet {$amount} on Moldovan women's curling at 3 a.m. I lost. I don't know the rules of curling. Or where Moldova is.", "I lost {$amount} at online poker to someone called 'xXUncle69Xx'. He wrote 'gg loser'. I topped up my account."],
    },
    fx: { money: '-amount', happy: -6, stress: 5, addiction: ['gambling', 5] },
  },
];
