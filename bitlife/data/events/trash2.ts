// Trash 2: cartoon gore (Happy Tree Friends style), gross-out, dark humour, sleazy adults-only situations,
// absurd revenge, karma for the rich/cops/bosses/influencers, hangovers, tattoos, gym, surgery, animals, food horror.
// ALL rating 2, adults only. cat 'trash'.
import type { EventDef } from '@bl/sim';

export const trash2Events: EventDef[] = [
  // ═════════════════════════════ GORE CARTOON — accidents façon Happy Tree Friends ═════════════════════════════

  // ── Trampoline de la mort ──
  {
    id: 'tr_trampoline',
    icon: '🤸',
    cat: 'trash',
    rating: 2,
    scene: { place: 'park', mood: 'party', prop: 'trampoline', fx: 'gore' },
    when: { age: [18, 65] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Barbecue chez ton beau-frère. Il a installé un trampoline géant à côté de la clôture électrique, d'une girouette pointue et {w:object}. Il te tend {w:drink} : « Allez, un salto, t'es pas une {w:insult} ! »",
        "Trois verres dans le nez, tu te retrouves debout sur un trampoline de jardin. Les ressorts grincent comme {w:sound}. En contrebas : une haie de rosiers, un barbecue allumé et le chien qui attend.",
        "Le trampoline du voisin est en solde sur Leboncoin, « légèrement rouillé, aucun mort à déplorer (pour l'instant) ». Tu le testes {w:weather} devant toute la rue.",
        "Anniversaire d'un pote de trente-cinq ans qui a loué un trampoline gonflable « pour adultes ». Il y a déjà une dent sur la toile. Tout le monde scande ton nom.",
      ],
      en: [
        "BBQ at your brother-in-law's. He set up a giant trampoline next to the electric fence, a pointy weathervane and {w:object}. He hands you {w:drink}: 'Come on, do a flip, don't be a {w:insult}!'",
        "Three drinks deep, you find yourself standing on a backyard trampoline. The springs squeak like {w:sound}. Below: a rosebush hedge, a lit grill and the dog, waiting.",
        "The neighbour's trampoline is on sale online, 'slightly rusty, no deaths so far'. You test it {w:weather} in front of the whole street.",
        "A buddy's 35th birthday, and he rented an inflatable 'adult' trampoline. There's already a tooth stuck in the mesh. Everyone's chanting your name.",
      ],
    },
    choices: [
      {
        label: { fr: 'Triple salto arrière', en: 'Triple backflip' },
        out: [
          { w: 3, odds: { athletic: 1 }, text: { fr: ["J'ai claqué un triple salto parfait. Les invités ont hurlé. Mon slip, lui, est resté au deuxième tour, accroché à la girouette.", "Triple salto, réception nickel, ovation. J'ai salué et vomi {w:food} sur la nappe en même temps. Le public a applaudi encore plus fort."], en: ["I landed a perfect triple backflip. Guests screamed. My underwear stayed behind on the second rotation, hooked on the weathervane.", "Triple flip, clean landing, ovation. I bowed and threw up {w:food} on the tablecloth at the same time. The crowd cheered even louder."] }, fx: { happy: 10, fame: 2, athletic: 2 }, mood: 'proud' },
          { w: 3, text: { fr: ["J'ai rebondi de travers, traversé la haie de rosiers et atterri sur le barbecue. J'ai désormais une grille tatouée sur la fesse gauche. Le chien m'a léché{|e} avec appétit, puis {w:animal} aussi.", "Je suis parti{|e} en vrille, mon genou a rencontré mon nez avec un bruit de pastèque. Du sang partout sur la toile, façon Pollock. Mon beau-frère a filmé en 4K en criant « {w:swear} »"], en: ["I bounced sideways, crashed through the rosebushes and landed on the grill. I now have grill marks on my left butt cheek. The dog licked me with real appetite, then {w:animal} did too.", "I spun out, my knee met my nose with a watermelon sound. Blood all over the mat, Jackson Pollock style. My brother-in-law filmed it in 4K, yelling '{w:swear}'"] }, fx: { health: -12, looks: -5, disease: 'burns', visual: 'gore' }, mood: 'cry' },
          { w: 1, text: { fr: ["Le ressort a lâché pile au moment de l'impulsion. J'ai décollé comme un bouchon de champagne et fini empalé{|e} sur la girouette du toit. Elle indique désormais le nord en permanence.", "J'ai rebondi si haut que j'ai traversé la ligne électrique. Mes cheveux ont pris feu en hélicoptère. On a retrouvé mes chaussures dans le jardin d'en face, encore fumantes."], en: ["The spring snapped right as I jumped. I launched like a champagne cork and got skewered on the rooftop weathervane. It now points north permanently.", "I bounced so high I went through the power line. My hair caught fire helicopter-style. They found my shoes smoking in the yard across the street."] }, fx: { die: { fr: "empalé{|e} sur une girouette après un salto de trop", en: 'skewered on a weathervane after one flip too many' }, visual: 'gore' } },
        ],
      },
      {
        label: { fr: 'Pousser le beauf dessus', en: 'Push the brother-in-law on' },
        out: [
          { w: 2, text: { fr: ["J'ai poussé mon beau-frère sur le trampoline. Il a rebondi une fois, deux fois, puis dans la piscine gonflable des gamins. Pas d'eau dedans. Bruit de sac de patates.", "Je l'ai poussé. Il a fait un rebond, un cri aigu, et s'est pris la girouette dans la narine. Elle a ressorti un bout de cervelle et une crotte de nez. On a dit que c'était le vent."], en: ["I pushed my brother-in-law onto the trampoline. He bounced once, twice, then into the kids' inflatable pool. No water in it. Sack-of-potatoes sound.", "I pushed him. One bounce, a high-pitched scream, and the weathervane went up his nostril. It came out with a bit of brain and a booger. We blamed the wind."] }, fx: { happy: 10, karma: -4, visual: 'gore' }, mood: 'happy' },
          { w: 1, text: { fr: ["Je l'ai poussé, il m'a agrippé{|e} au dernier moment. On a rebondi ensemble, enlacés comme deux amants, jusque dans le bac à compost.", "Il s'est retenu à mon tee-shirt. On a décollé à deux et atterri dans la clôture électrique. On a clignoté comme un sapin de Noël pendant dix secondes."], en: ["I pushed him, he grabbed me at the last second. We bounced together, entwined like lovers, straight into the compost bin.", "He grabbed my T-shirt. We took off together and landed on the electric fence. We blinked like a Christmas tree for ten seconds."] }, fx: { health: -6, happy: 2, visual: 'gore' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Rester au barbecue', en: 'Stay by the grill' }, text: { fr: ["Je suis resté{|e} au barbecue avec mes saucisses. Trois invités sont partis aux urgences. Moi, je suis reparti{|e} avec les restes. Victoire, et {w:object} en bonus.", "J'ai regardé les autres se démolir en mangeant {w:food}. Meilleur spectacle de l'été, et j'ai encore toutes mes dents."], en: ["I stayed by the grill with my sausages. Three guests went to the ER. I went home with the leftovers. Victory, plus {w:object} as a bonus.", "I watched everyone else wreck themselves while eating {w:food}. Best show of the summer, and I still have all my teeth."] }, fx: { happy: 4, stress: -2 } },
    ],
  },

  // ── Ventilateur de plafond ──
  {
    id: 'tr_ceiling_fan',
    icon: '🌀',
    cat: 'trash',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'apartment', mood: 'party', prop: 'fan', fx: 'gore' },
    when: { age: [18, 50] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Soirée chez toi. {a.first}, complètement fait{a:|e}, saute pour s'accrocher au ventilateur de plafond en hurlant « JE SUIS UN HÉLICOPTÈRE ». Le ventilo est en position 3.",
        "{a.first} a parié qu'{a:il|elle} pouvait faire dix tours accroché{a:|e} au ventilateur de plafond. Il est 2 h, tout le monde filme, et la vis du plafond fait {w:sound}.",
        "Il fait 38 degrés, ton ventilo de plafond tourne à fond. {a.first} monte sur la table avec {w:drink} et regarde les pales avec des yeux d'enfant.",
        "« Tiens mon verre », dit {a.first}. C'est la dernière phrase prononcée avant chaque catastrophe de l'histoire. {a:Il|Elle} vise le ventilateur de plafond.",
      ],
      en: [
        "Party at your place. {a.first}, absolutely hammered, leaps to grab the ceiling fan screaming 'I AM A HELICOPTER'. The fan is on setting 3.",
        "{a.first} bet they could do ten spins hanging from the ceiling fan. It's 2 a.m., everyone's filming, and the ceiling screw makes {w:sound}.",
        "It's 100 degrees, your ceiling fan is going full blast. {a.first} climbs on the table with {w:drink} and looks at the blades with a child's eyes.",
        "'Hold my drink,' says {a.first}. Last words before every disaster in history. They're eyeing the ceiling fan.",
      ],
    },
    choices: [
      {
        label: { fr: 'Monter le ventilo en 5', en: 'Crank it to 5' },
        out: [
          { w: 3, text: { fr: ["J'ai mis en 5. {a.first} a fait quatorze tours, puis a été catapulté{a:|e} par la fenêtre ouverte. {a:Il|Elle} a atterri dans la benne du voisin et a levé le pouce. Une dent manquait.", "Position 5. {a.first} est devenu{a:|e} une toupie humaine qui a aspergé tout le salon de vomi en spirale parfaite. Mon plafond ressemble à une œuvre d'art contemporain qui sent {w:smell}."], en: ["I cranked it to 5. {a.first} did fourteen spins, then got flung out the open window. They landed in the neighbour's dumpster and gave a thumbs up. A tooth was missing.", "Setting 5. {a.first} became a human spinning top that sprayed the whole living room with vomit in a perfect spiral. My ceiling looks like modern art that smells like {w:smell}."] }, fx: { happy: 12, karma: -5, rel: -5, visual: 'gore' }, mood: 'party' },
          { w: 1, text: { fr: ["Le ventilo s'est décroché avec un morceau de plafond. Les pales ont scalpé {a.first}, rasé ma plante verte et coupé le gâteau en parts égales. Efficace.", "Le ventilo a lâché et tourné au sol comme une tondeuse folle. Il a coupé les lacets de tout le monde et le petit orteil de {a.first}, retrouvé dans le guacamole."], en: ["The fan ripped out with a chunk of ceiling. The blades scalped {a.first}, mowed my houseplant and cut the cake into equal slices. Efficient.", "The fan fell and spun across the floor like a mad lawnmower. It cut everyone's shoelaces and {a.first}'s pinky toe, later found in the guacamole."] }, fx: { happy: 6, rel: -10, money: -400, visual: 'gore' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Couper le courant', en: 'Kill the power' }, text: { fr: ["J'ai coupé le disjoncteur. {a.first} est resté{a:|e} pendu{a:|e} dans le noir, immobile, en chantant {w:song}. Les voisins ont appelé un exorciste et {w:weird_job}.", "J'ai tout coupé à temps. {a.first} m'a surnommé{|e} {w:nickname} le rabat-joie, puis a vomi dans mon aquarium. Le poisson rouge a survécu, pas son moral."], en: ["I flipped the breaker. {a.first} hung there in the dark, motionless, singing {w:song}. The neighbours called an exorcist and {w:weird_job}.", "I cut the power in time. {a.first} called me a buzzkill, then threw up in my fish tank. The goldfish survived. Its morale didn't."] }, fx: { karma: 4, rel: 4, happy: -2 } },
      { label: { fr: 'Filmer pour TikTac', en: 'Film it for TikTac' }, out: [
        { w: 2, text: { fr: ["J'ai filmé. {a.first} a tourné, hurlé, puis s'est pris le lustre en pleine face. 2 millions de vues. Les commentaires demandent une suite, et {w:celeb} a liké.", "J'ai filmé en ralenti. On voit très bien le moment où la chaussure de {a.first} part dans l'écran plat. Viral en une heure."], en: ["I filmed it. {a.first} spun, screamed, then took the chandelier to the face. 2 million views. The comments are demanding a sequel, and {w:celeb} liked it.", "I filmed in slow-mo. You can clearly see {a.first}'s shoe flying into the flat-screen. Viral within an hour."] }, fx: { followers: 15000, fame: 3, rel: -8 }, mood: 'happy' },
        { w: 1, text: { fr: ["J'ai filmé en vertical, comme un{|e} amateur. Personne n'a regardé. {a.first} a perdu deux dents pour 14 vues, dont 3 de ma mère.", "Mon téléphone n'avait plus de batterie. {a.first} s'est fracassé{a:|e} le coccyx pour rien. Pour la postérité, il ne reste que les taches de sang."], en: ["I filmed vertically like an amateur. Nobody watched. {a.first} lost two teeth for 14 views, 3 of them from my mom.", "My phone was dead. {a.first} smashed their tailbone for nothing. All that remains for posterity is the bloodstains."] }, fx: { rel: -6, happy: -2 } },
      ] },
    ],
  },

  // ── Fourchette à fondue ──
  {
    id: 'tr_fondue_fork',
    icon: '🫕',
    cat: 'trash',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'fondue', fx: 'gore' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Soirée fondue savoyarde. Huit fourchettes, un caquelon bouillant, et Gérard, qui raconte une blague en agitant sa fourchette comme un chef d'orchestre bourré. Il est à quinze centimètres de ton œil.",
        "Fondue chez des amis. Ton pain tombe dans le fromage. La règle dit : gage. La tablée hurle. Ta voisine brandit sa pique à fondue pour « t'aider à le repêcher ».",
        "Fondue à 1 000 degrés chez tata. Quelqu'un renverse le réchaud à alcool. Une flamme bleue court sur la nappe vers {w:object}. Tout le monde a encore sa fourchette en main.",
        "Le caquelon fume, le fromage forme des fils de trois mètres, et ton oncle se penche par-dessus toi pour piquer ton morceau. {w:swear} Sa fourchette fonce vers ta tête.",
      ],
      en: [
        "Cheese fondue night. Eight forks, a boiling pot, and Gerard, telling a joke while waving his fork like a drunk conductor. He's six inches from your eye.",
        "Fondue at friends'. Your bread falls into the cheese. The rule says: forfeit. The table roars. Your neighbour brandishes her fondue skewer to 'help fish it out'.",
        "Volcanic fondue at your aunt's. Someone knocks over the burner. A blue flame races across the tablecloth toward {w:object}. Everyone's still holding their forks.",
        "The pot is smoking, the cheese is making ten-foot strings, and your uncle leans over you to steal your piece. {w:swear} His fork is heading for your head.",
      ],
    },
    choices: [
      {
        label: { fr: 'Esquiver comme Neo', en: 'Dodge like Neo' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai esquivé en arrière façon Matrix. La fourchette s'est plantée dans la joue de Gérard. Il a fini la soirée avec un cube de pain accroché au visage, comme un piercing gourmand.", "J'ai esquivé. La pique a crevé le ballon d'anniversaire, le chat a pris peur et s'est jeté dans le caquelon. Le chat va bien. Le fromage a désormais des poils."], en: ["I dodged backward Matrix-style. The fork stabbed Gerard's cheek. He spent the rest of the night with a bread cube stuck on his face, like a gourmet piercing.", "I dodged. The skewer popped the birthday balloon, the cat panicked and jumped in the pot. The cat's fine. The cheese now has fur in it."] }, fx: { happy: 8, athletic: 1 }, mood: 'happy' },
          { w: 2, text: { fr: ["Trop lent{|e}. La pique a embroché mon globe oculaire avec un « plop » de raisin. Mon œil est tombé dans le fromage. Gérard l'a mangé en croyant que c'était une pomme de terre.", "J'ai esquivé du mauvais côté. La fourchette a traversé mon lobe d'oreille, et le fromage brûlant a coulé dans mon conduit auditif. J'entends désormais en Gruyère."], en: ["Too slow. The skewer speared my eyeball with a grape-like 'plop'. My eye fell into the cheese. Gerard ate it thinking it was a potato.", "I dodged the wrong way. The fork went through my earlobe, and boiling cheese ran into my ear canal. I now hear in Gruyère."] }, fx: { health: -15, looks: -8, visual: 'gore', disease: 'burns' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Contre-attaque à la fourchette', en: 'Fork counterattack' }, out: [
        { w: 2, text: { fr: ["J'ai paré avec ma propre fourchette. Duel d'escrime au-dessus du caquelon. Deux doigts tranchés, un lustre décroché et le plus beau souvenir de la famille depuis la mort de papi.", "Je l'ai piqué{|e} à la cuisse en légitime défense. Il a crié « TOUCHÉ ! » et on a continué à manger. Le sang s'est mélangé au vin blanc, personne n'a vu la différence."], en: ["I parried with my own fork. Fencing duel over the fondue pot. Two fingers sliced, one chandelier down, and the family's best memory since grandpa died.", "I stabbed him in the thigh in self-defence. He yelled 'TOUCHÉ!' and we kept eating. The blood mixed with the white wine, nobody noticed the difference."] }, fx: { happy: 10, health: -4, visual: 'gore' }, mood: 'party' },
        { w: 1, text: { fr: ["Ma contre-attaque a renversé le caquelon sur les genoux du tonton. Il a hurlé une octave au-dessus de Céline Dion. Il ne pourra plus avoir d'enfants, ce qui est une bonne nouvelle pour l'humanité.", "J'ai riposté et touché le réchaud. Boule de feu au comté. Mes sourcils ont fondu comme du fromage à raclette."], en: ["My counterattack tipped the pot into my uncle's lap. He screamed an octave above Celine Dion. He can no longer have children, which is good news for humanity.", "I struck back and hit the burner. Comté fireball. My eyebrows melted like raclette."] }, fx: { happy: 4, looks: -4, karma: -3, visual: 'fire' }, mood: 'shock' },
      ] },
      { label: { fr: 'Plonger sous la table', en: 'Dive under the table' }, text: { fr: ["J'ai plongé sous la table. J'y ai trouvé le chien, une chaussette et le dentier de mémé. Au-dessus, ça hurlait. Je suis resté{|e} en bas jusqu'au dessert.", "Sous la table, j'ai survécu. J'ai juste reçu une goutte de fromage brûlant dans le décolleté et les pieds de Gérard sous le nez, qui sentaient {w:smell}."], en: ["I dove under the table. I found the dog, a sock and granny's dentures. Above, people were screaming. I stayed down there until dessert.", "Under the table, I survived. Just a drop of molten cheese down my shirt and Gerard's feet under my nose, smelling like {w:smell}."] }, fx: { stress: 3, happy: -1 } },
    ],
  },

  // ── Toboggan aquatique ──
  {
    id: 'tr_waterslide',
    icon: '🌊',
    cat: 'trash',
    rating: 2,
    scene: { place: 'beach', mood: 'shock', prop: 'waterslide', fx: 'gore' },
    when: { age: [18, 60] },
    weight: 6,
    cooldown: 15,
    text: {
      fr: [
        "Aquaparc low cost. Le toboggan « Kamikaze » fait 40 mètres de chute libre. Le maître-nageur, 16 ans, dort. Il y a une vis qui dépasse dans le tube, et des traces rouges dans le bassin d'arrivée.",
        "Tu es en haut du toboggan noir. Panneau : « Interdit aux cardiaques, aux femmes enceintes et aux gens qui tiennent à leur maillot ». La file derrière toi s'impatiente.",
        "Au parc aquatique, quelqu'un a mis {w:food} dans le toboggan pour « aller plus vite ». Ça sent {w:smell}. C'est ton tour.",
        "Le toboggan « Tsunami Infernal » vient de rouvrir après « un léger incident ». Il reste un morceau de maillot de bain et une phalange coincés dans le premier virage.",
      ],
      en: [
        "Budget water park. The 'Kamikaze' slide is a 130-foot free fall. The 16-year-old lifeguard is asleep. There's a screw sticking out inside the tube and red streaks in the landing pool.",
        "You're at the top of the black slide. Sign: 'Not for heart patients, pregnant women, or people attached to their swimsuit.' The line behind you is getting impatient.",
        "At the water park, someone put {w:food} in the slide to 'go faster'. It smells like {w:smell}. It's your turn.",
        "The 'Infernal Tsunami' slide just reopened after 'a minor incident'. A piece of swimsuit and a finger bone are still stuck in the first bend.",
      ],
    },
    choices: [
      {
        label: { fr: 'Y aller tête la première', en: 'Go headfirst' },
        out: [
          { w: 2, text: { fr: ["Je suis descendu{|e} à 90 km/h. La vis m'a ouvert du menton au nombril comme une fermeture éclair. Le bassin est devenu rose fraise. Les enfants ont cru à une animation.", "La vis a décollé mon cuir chevelu d'un coup net. Il a fini sa course dans le bassin, flottant comme une méduse velue. Le maître-nageur l'a repêché à l'épuisette."], en: ["I went down at 55 mph. The screw unzipped me from chin to belly button. The pool turned strawberry pink. The kids thought it was a show.", "The screw peeled my scalp clean off. It finished the ride in the pool, floating like a hairy jellyfish. The lifeguard fished it out with a net."] }, fx: { health: -18, looks: -10, visual: 'gore' }, mood: 'cry' },
          { w: 2, text: { fr: ["Descente parfaite. Mon maillot, lui, n'a pas suivi. Je suis arrivé{|e} tout nu{|e} devant un club de retraités en aquagym. Ils m'ont noté{|e} 6 sur 10.", "J'ai fait la descente en hurlant. À l'arrivée, mon maillot était remonté si haut qu'on a dû appeler un spéliologue pour le récupérer."], en: ["Perfect descent. My swimsuit didn't make it. I arrived stark naked in front of a seniors' aqua aerobics class. They gave me a 6 out of 10.", "I screamed all the way down. At the bottom, my swimsuit had gone up so far they had to call a caver to retrieve it."] }, fx: { happy: 4, looks: -2, stress: 4 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Pousser le gosse devant', en: 'Let the rude guy go first' }, text: { fr: ["J'ai laissé passer le gros lourd qui doublait tout le monde. On l'a entendu crier dans le tube pendant vingt secondes. Il est ressorti en deux parties, mais toujours aussi insupportable.", "J'ai fait passer devant le mec qui m'avait lancé « {w:insult} ». La vis l'a épilé intégralement. Il est sorti lisse comme un dauphin, et furieux."], en: ["I let the jerk who was cutting the line go first. We heard him scream in the tube for twenty seconds. He came out in two pieces, but just as annoying.", "I let the guy who called me a {w:insult} go first. The screw waxed him completely. He came out smooth as a dolphin, and furious."] }, fx: { happy: 8, karma: -3, visual: 'gore' }, mood: 'happy' },
      { label: { fr: 'Redescendre par l\'escalier', en: 'Walk back down' }, text: { fr: ["J'ai redescendu les 200 marches sous les huées. Un enfant de six ans m'a traité{|e} de poule mouillée. Je lui ai répondu qu'au moins j'avais encore mon scalp.", "Je suis redescendu{|e} à pied. Je me suis tordu la cheville sur la dernière marche glissante. L'univers voulait sa part."], en: ["I walked back down the 200 steps to boos. A six-year-old called me a chicken. I replied that at least I still had my scalp.", "I walked down. I twisted my ankle on the last slippery step. The universe wanted its cut."] }, fx: { happy: -3, health: -2 } },
    ],
  },

  // ── Jacuzzi aspirant ──
  {
    id: 'tr_hot_tub',
    icon: '🛁',
    cat: 'trash',
    rating: 2,
    scene: { place: 'villa', mood: 'shock', prop: 'jacuzzi', fx: 'poop' },
    when: { age: [18, 80] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Location Airbnb avec jacuzzi. L'eau est verdâtre, il flotte un pansement et {w:gross}. Tu t'assois quand même. La bonde d'aspiration te happe une fesse avec un bruit de ventouse.",
        "Jacuzzi d'hôtel à 3 h du matin. Tu es seul{|e}, bourré{|e}, et la bouche d'aspiration vient de capturer ton maillot. Puis ce qu'il y a dedans.",
        "Le jacuzzi du camping « Les Flots Bleus » n'a pas été nettoyé depuis 2011. Les bulles sentent {w:smell}. Un type sort de l'eau avec une éruption cutanée en forme de France.",
        "Tu testes le jacuzzi de ton patron pendant sa fête. Tu lâches {w:sound} sous l'eau. Les bulles remontent pile sous le nez de sa femme.",
      ],
      en: [
        "Airbnb with a hot tub. The water's greenish, a band-aid and {w:gross} are floating in it. You sit down anyway. The suction drain grabs one butt cheek with a plunger sound.",
        "Hotel hot tub at 3 a.m. You're alone, drunk, and the suction vent just captured your swimsuit. Then what's inside it.",
        "The hot tub at the 'Blue Waves' campsite hasn't been cleaned since 2011. The bubbles smell like {w:smell}. A guy climbs out with a rash shaped like France.",
        "You're testing your boss's hot tub during his party. You let out {w:sound} underwater. The bubbles surface right under his wife's nose.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tirer comme un{|e} malade', en: 'Yank free' },
        out: [
          { w: 2, text: { fr: ["J'ai tiré d'un coup sec. Bruit de bouchon de champagne géant. Je me suis libéré{|e}, mais une partie de ma dignité et deux centimètres carrés de fesse sont restés dans la bonde.", "J'ai tiré. Le jacuzzi a refoulé d'un coup et projeté un geyser d'eau tiède, de poils et d'une dent humaine sur toute la terrasse."], en: ["I yanked hard. Giant champagne cork sound. I got free, but part of my dignity and an inch of butt stayed in the drain.", "I pulled. The hot tub backflushed all at once, blasting a geyser of lukewarm water, body hair and a human tooth across the deck."] }, fx: { health: -6, happy: -4, visual: 'poop' }, mood: 'shock' },
          { w: 1, text: { fr: ["Coincé{|e} quatre heures. Les pompiers ont dû vidanger le jacuzzi avec moi dedans, comme une moule. La vidéo du camion a fait le tour de la caserne.", "J'ai appelé à l'aide. Le gérant m'a dégagé{|e} au pied-de-biche. J'ai un suçon de 15 centimètres sur la fesse, rond et parfait comme un hublot."], en: ["Stuck for four hours. Firefighters had to drain the tub with me inside, like a mussel. The video went around the entire station.", "I called for help. The manager pried me out with a crowbar. I have a six-inch hickey on my butt, round and perfect like a porthole."] }, fx: { happy: -8, stress: 6, disease: 'hemorrhoids' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Accuser le voisin de bulle', en: 'Blame the guy next to me' }, text: { fr: ["J'ai fixé le monsieur à côté avec dégoût, en secouant la tête. Tout le monde l'a regardé. Il est sorti en pleurant. J'ai le jacuzzi pour moi tout{|e} seul{|e}.", "J'ai pointé du doigt un vieux monsieur : « C'est lui, je l'ai vu ! » Il a nié. Personne ne l'a cru. Il est parti avec sa serviette et ce qui lui restait d'honneur."], en: ["I stared at the man next to me in disgust, shaking my head. Everyone looked at him. He left in tears. I have the hot tub all to myself.", "I pointed at an old man: 'It was him, I saw it!' He denied it. Nobody believed him. He left with his towel and what was left of his honour."] }, fx: { happy: 6, karma: -5 }, mood: 'happy' },
      { label: { fr: 'Sortir, et vite', en: 'Get out, fast' }, out: [
        { w: 2, text: { fr: ["Je suis sorti{|e} en vitesse. Le lendemain, j'avais une infection qui gratte à des endroits que je ne nommerai pas. Le médecin a pris une photo « pour un congrès ».", "Je suis sorti{|e}, mais trop tard : trois jours de fièvre et des boutons sur les fesses en forme de constellation."], en: ["I got out fast. The next day I had an itchy infection in places I won't name. The doctor took a picture 'for a conference'.", "I got out, but too late: three days of fever and butt pimples shaped like a constellation."] }, fx: { health: -6, disease: 'acne', looks: -3 }, mood: 'sick' },
        { w: 1, text: { fr: ["Je suis sorti{|e} à temps. Derrière moi, le jacuzzi a fait {w:sound} et s'est mis à bouillonner marron. Le gérant a fermé la zone avec du ruban de police.", "J'ai fui avant la catastrophe. Dix minutes plus tard, un enfant y a fait caca. Dieu existe, et il protège les lâches."], en: ["I got out in time. Behind me, the tub made {w:sound} and started bubbling brown. The manager taped off the area with police tape.", "I fled before disaster. Ten minutes later, a kid pooped in it. God exists and protects cowards."] }, fx: { happy: 4, karma: 1 } },
      ] },
    ],
  },

  // ── Destructeur de documents et cravate du patron ──
  {
    id: 'tr_shredder_boss',
    icon: '📄',
    cat: 'trash',
    rating: 2,
    actor: 'boss',
    scene: { place: 'office', mood: 'shock', prop: 'shredder', fx: 'gore' },
    when: { age: [18, 70], job: true },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "{a.first}, ton {a:patron|patronne}, se penche au-dessus du destructeur de documents pour faire disparaître « des preuves comptables ». Sa cravate pend à deux centimètres des lames. Le bouton « marche » est sous ta main.",
        "{a.first} te hurle dessus en broyant tes notes de frais. Sa longue écharpe en soie glisse doucement vers la gueule du destructeur industriel. {a:Il|Elle} ne remarque rien.",
        "Le destructeur de documents a un bouton « TURBO ». {a.first}, qui vient de t'annoncer zéro augmentation, se penche dessus pour y jeter ton évaluation annuelle.",
        "« Ici, on est une famille », dit {a.first} en déchiquetant ta demande de congés. Sa cravate Hermès entre lentement dans la machine. Tu pourrais dire quelque chose.",
      ],
      en: [
        "{a.first}, your boss, leans over the paper shredder to get rid of 'accounting evidence'. Their tie dangles an inch from the blades. The 'on' button is right under your hand.",
        "{a.first} is yelling at you while shredding your expense reports. Their long silk scarf slides slowly toward the industrial shredder's mouth. They notice nothing.",
        "The shredder has a 'TURBO' button. {a.first}, who just announced zero raise, leans over it to toss in your annual review.",
        "'We're a family here,' says {a.first}, shredding your vacation request. Their designer tie is slowly entering the machine. You could say something.",
      ],
    },
    choices: [
      {
        label: { fr: 'Appuyer sur TURBO', en: 'Hit TURBO' },
        out: [
          { w: 2, text: { fr: ["TURBO. La cravate a tiré {a.first} vers le bas, face contre la machine. Le destructeur a mangé la cravate, la chemise et un bout de moustache, puis a calé. {a:Il|Elle} est resté{a:|e} collé{a:|e} là, à genoux, pendant toute la réunion.", "J'ai appuyé. Le destructeur a avalé l'écharpe, puis une oreille, recrachée en confettis roses sur le tableau des objectifs. L'objectif « zéro accident » a été raté de peu."], en: ["TURBO. The tie yanked {a.first} down, face against the machine. The shredder ate the tie, the shirt and part of a moustache, then stalled. They stayed stuck there, kneeling, through the whole meeting.", "I pressed it. The shredder swallowed the scarf, then an ear, spat out as pink confetti onto the goals board. The 'zero accidents' goal was narrowly missed."] }, fx: { happy: 14, karma: -6, rel: -20, perf: -10, visual: 'gore' }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai appuyé, mais la machine s'est bloquée. {a.first} s'est retourné{a:|e} et a vu mon doigt sur le bouton. On s'est regardés longtemps. Je suis viré{|e}.", "TURBO. Le destructeur a pris feu à cause des fausses factures. Alarme incendie, évacuation, et les flics ont trouvé ce qu'il restait des preuves. {a.first} est en garde à vue, et moi au chômage."], en: ["I pressed it, but the machine jammed. {a.first} turned around and saw my finger on the button. We stared at each other for a long time. I'm fired.", "TURBO. The shredder caught fire from all the fake invoices. Fire alarm, evacuation, and the cops found what was left of the evidence. {a.first} is in custody, I'm unemployed."] }, fx: { fired: true, happy: 2, karma: 2 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Le sauver, chantage', en: 'Save them, then blackmail' }, text: { fr: ["J'ai débranché la machine in extremis et récupéré les « preuves comptables » à moitié broyées. {a.first} m'a augmenté{|e} de 20 % dans l'heure, sans que je dise un mot.", "J'ai sauvé {a.first} et glissé : « Joli dossier, au fait. » Le soir même, j'avais une place de parking et une mutuelle en or."], en: ["I unplugged the machine at the last second and pocketed the half-shredded 'accounting evidence'. {a.first} gave me a 20% raise within the hour, without me saying a word.", "I saved {a.first} and whispered: 'Nice file, by the way.' That evening I had a parking spot and gold-plated health insurance."] }, fx: { money: 3000, promote: true, karma: -3, rel: -5 }, mood: 'proud' },
      { label: { fr: 'Ne rien dire, sourire', en: 'Say nothing, smile' }, text: { fr: ["Je n'ai rien dit. La machine a avalé la cravate et {a.first} s'est retrouvé{a:|e} le front collé au plastique. {a:Il|Elle} a hurlé « AIDEZ-MOI » et tout l'open space a continué à taper sur son clavier.", "J'ai souri. {a.first} s'est étranglé{a:|e} à moitié jusqu'à ce que le stagiaire coupe le courant. Le stagiaire a été promu. Moi j'ai eu le meilleur après-midi de ma carrière."], en: ["I said nothing. The machine swallowed the tie and {a.first} ended up forehead-glued to the plastic. They screamed 'HELP ME' and the whole open space kept typing.", "I smiled. {a.first} half-choked until the intern cut the power. The intern got promoted. I had the best afternoon of my career."] }, fx: { happy: 10, karma: -2 }, mood: 'happy' },
    ],
  },

  // ── Ski contre sapin ──
  {
    id: 'tr_ski_tree',
    icon: '⛷️',
    cat: 'trash',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'ski', fx: 'gore' },
    when: { age: [18, 70] },
    weight: 5,
    cooldown: 15,
    text: {
      fr: [
        "Station de ski, piste noire, après trois vins chauds et une tartiflette. Tu as loué des skis « freestyle » sans savoir freiner. Droit devant : un sapin, un télésiège et un moniteur nommé Jean-Sébastien.",
        "Tu dévales la piste à 80 km/h, les bâtons en l'air. Un snowboardeur assis au milieu roule un joint. À droite, un ravin. À gauche, une file d'enfants de l'école de ski.",
        "Au sommet du télésiège, ton ami te parie {w:drink} que tu ne descends pas le couloir hors-piste en slip. Il neige {w:weather}. Tu es déjà à moitié déshabillé{|e}.",
        "Tes fixations viennent de lâcher en pleine descente. Tu glisses sur les fesses, de plus en plus vite, vers le chalet-restaurant et sa baie vitrée.",
      ],
      en: [
        "Ski resort, black run, after three mulled wines and a cheese casserole. You rented 'freestyle' skis without knowing how to brake. Straight ahead: a pine tree, a chairlift and an instructor named Jean-Sébastien.",
        "You're flying down the slope at 50 mph, poles in the air. A snowboarder sits in the middle rolling a joint. To the right, a ravine. To the left, a line of ski-school kids.",
        "At the top of the chairlift, your friend bets you {w:drink} that you won't ski the off-piste couloir in your underwear. It's snowing {w:weather}. You're already half undressed.",
        "Your bindings just snapped mid-run. You're sliding on your butt, faster and faster, toward the mountain restaurant and its huge glass window.",
      ],
    },
    choices: [
      {
        label: { fr: 'Viser le moniteur', en: 'Aim for the instructor' },
        out: [
          { w: 2, text: { fr: ["J'ai percuté Jean-Sébastien en plein torse. On a roulé ensemble en boule de neige géante jusqu'en bas. À l'arrivée, il avait mon bâton planté dans la cuisse et moi son bonnet dans la bouche.", "Strike. Le moniteur a volé dans les airs, ses dents ont tracé un joli arc dans la neige, rouge sur blanc. Les touristes japonais ont applaudi."], en: ["I hit Jean-Sébastien square in the chest. We rolled together into a giant snowball all the way down. At the bottom, he had my pole stuck in his thigh and I had his beanie in my mouth.", "Strike. The instructor flew into the air, his teeth drawing a lovely arc in the snow, red on white. Japanese tourists applauded."] }, fx: { happy: 6, health: -6, karma: -3, visual: 'gore' }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai raté le moniteur et embrassé le sapin à pleine vitesse. Mes deux jambes sont parties de chaque côté du tronc. Le bruit a fait tomber la neige des branches. On m'a descendu{|e} en luge, plié{|e} en V.", "Le sapin m'a stoppé{|e} net. Le bonhomme de neige d'à côté est désormais rose, avec un de mes incisives en guise de nez."], en: ["I missed the instructor and hugged the tree at full speed. One leg on each side of the trunk. The sound knocked the snow off the branches. They took me down on a sled, folded in a V.", "The tree stopped me dead. The snowman next to it is now pink, with one of my front teeth as its nose."] }, fx: { health: -18, disease: 'broken_arm', happy: -8, visual: 'gore' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Me jeter dans la poudreuse', en: 'Bail into the powder' }, out: [
        { w: 2, text: { fr: ["Je me suis jeté{|e} dans la poudreuse. J'ai disparu entièrement. On m'a retrouvé{|e} au printemps. Non, je plaisante : au bout de vingt minutes, grâce au chien d'avalanche qui m'a pissé dessus.", "Plongeon dans la poudreuse. Seuls mes skis dépassaient, comme dans un dessin animé. Un snowboardeur a pris une photo avant de m'aider."], en: ["I dove into the powder. I vanished completely. They found me in the spring. Kidding: after twenty minutes, thanks to the avalanche dog peeing on me.", "Dove into the powder. Only my skis stuck out, cartoon-style. A snowboarder took a picture before helping me out."] }, fx: { health: -3, happy: 2, disease: 'cold' } },
        { w: 1, text: { fr: ["La poudreuse cachait un rocher. J'ai fait un soleil complet et atterri sur la tête. Depuis, j'appelle ma mère « Maître Yoda ».", "J'ai plongé. Il y avait un caillou, puis un deuxième. J'ai dévalé le reste en rouleau humain, ramassant un écureuil au passage."], en: ["The powder hid a rock. I did a full cartwheel and landed on my head. Since then, I call my mom 'Master Yoda'.", "I dove. There was a rock, then a second one. I rolled the rest of the way as a human snowball, picking up a squirrel on the way."] }, fx: { health: -10, smarts: -3, disease: 'concussion' }, mood: 'sick' },
      ] },
      { label: { fr: 'Traverser le chalet', en: 'Crash through the chalet' }, text: { fr: ["J'ai traversé la baie vitrée du chalet et atterri dans le caquelon de raclette d'une famille belge. Ils m'ont offert un verre. J'avais du verre partout et du fromage dans le slip.", "Je suis entré{|e} par la vitre, les skis en premier, et j'ai fini sur le bar. Le barman m'a demandé : « Vin chaud ? » J'ai dit oui en saignant du front."], en: ["I crashed through the chalet's glass wall and landed in a Belgian family's raclette. They offered me a drink. I had glass everywhere and cheese in my underwear.", "I came in through the window skis-first and ended up on the bar. The bartender asked: 'Mulled wine?' I said yes, bleeding from the forehead."] }, fx: { health: -8, happy: 6, money: -800, visual: 'gore' }, mood: 'party' },
    ],
  },

  // ── Boule de bowling ──
  {
    id: 'tr_bowling_finger',
    icon: '🎳',
    cat: 'trash',
    rating: 2,
    scene: { place: 'party', mood: 'shock', prop: 'bowling', fx: 'gore' },
    when: { age: [18, 80] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Bowling d'entreprise. Ton doigt est coincé dans une boule de 7 kilos taille enfant. Ton tour arrive, tout le monde crie ton nom, ton doigt devient violet comme {w:food} pourrie.",
        "Au bowling, tu as glissé tes doigts dans la boule et entendu un « scrouitch ». Quelque chose de mou au fond. Les chaussures de location sentent {w:smell}. Il faut lancer.",
        "Soirée bowling avec ton ex et sa nouvelle conquête. Tu prends la boule la plus lourde pour impressionner tout le monde. Ton doigt reste coincé dedans au moment de l'élan.",
        "Strike décisif pour gagner {w:gift}. Mais ton pouce est encastré dans la boule et la piste vient d'être cirée comme une patinoire.",
      ],
      en: [
        "Company bowling night. Your finger's stuck in a 15-pound kids' ball. It's your turn, everyone's chanting your name, and your finger is turning purple like rotten {w:food}.",
        "At the bowling alley, you slip your fingers into the ball and hear a 'squelch'. Something soft at the bottom. The rental shoes smell like {w:smell}. You have to throw.",
        "Bowling night with your ex and their new fling. You grab the heaviest ball to impress everyone. Your finger stays jammed inside as you swing.",
        "The decisive strike to win {w:gift}. But your thumb is lodged in the ball and the lane was just waxed like an ice rink.",
      ],
    },
    choices: [
      {
        label: { fr: 'Lancer quand même', en: 'Throw anyway' },
        out: [
          { w: 2, text: { fr: ["J'ai lancé. La boule est partie avec mon doigt dedans. Strike. Les quilles sont tombées, mon doigt a fait le tour de la machine et est ressorti par le retour de boules. Je l'ai récupéré tout chaud.", "J'ai lancé, mon doigt est resté dans la boule et moi j'ai suivi, glissant à plat ventre sur la piste. On a fait strike ensemble. J'ai fini coincé{|e} dans la machine à quilles."], en: ["I threw. The ball left with my finger inside. Strike. The pins fell, my finger went around the machine and came back out the ball return. I picked it up, still warm.", "I threw, my finger stayed in the ball and I followed, sliding belly-down along the lane. We got a strike together. I ended up stuck in the pinsetter."] }, fx: { health: -10, disease: 'missing_finger', happy: 2, visual: 'gore' }, mood: 'cry' },
          { w: 1, text: { fr: ["La boule a fait un salto arrière et atterri sur le pied de mon ex. Craquement de biscotte. Je jure que c'était un accident. Je le jurerai devant n'importe quel tribunal.", "Lancer raté : la boule a décollé en arrière et traversé l'écran des scores. GAME OVER, littéralement. Le gérant m'a interdit{|e} à vie."], en: ["The ball did a backflip and landed on my ex's foot. Crunch like a cracker. I swear it was an accident. I'll swear it in any court.", "Botched throw: the ball flew backward and went through the score screen. GAME OVER, literally. The manager banned me for life."] }, fx: { happy: 8, karma: -2, money: -300 }, mood: 'happy' },
        ],
      },
      { label: { fr: 'Beurre et prière', en: 'Butter and prayer' }, text: { fr: ["J'ai demandé du beurre au snack. Un collègue a tiré, un autre m'a tenu le bras. Mon doigt est sorti avec un « plop » de bouteille, mais mon ongle est resté au fond.", "On a essayé l'huile de friture. Mon doigt est sorti, rouge et luisant comme une saucisse. Je sens les frites depuis une semaine."], en: ["I asked for butter at the snack bar. One coworker pulled, another held my arm. My finger came out with a bottle 'pop', but my nail stayed inside.", "We tried fryer oil. My finger came out red and shiny like a sausage. I've smelled like fries for a week."] }, fx: { health: -3, happy: -2 } },
      { label: { fr: 'Accuser la boule hantée', en: 'Blame the haunted ball' }, text: { fr: ["J'ai déclaré que la boule était maudite. Elle a été mise de côté, enveloppée dans une serviette, et le bowling a fait venir un prêtre. Mon doigt est toujours dedans, d'ailleurs.", "J'ai crié que la boule avait essayé de me manger. Tout le monde a reculé. On a gagné la soirée par forfait, l'équipe adverse avait trop peur."], en: ["I declared the ball cursed. It was set aside, wrapped in a towel, and the alley called in a priest. My finger's still in it, by the way.", "I yelled that the ball tried to eat me. Everyone backed off. We won the night by forfeit, the other team was too scared."] }, fx: { happy: 4, smarts: -1 } },
    ],
  },

  // ── Montagnes russes ──
  {
    id: 'tr_rollercoaster',
    icon: '🎢',
    cat: 'trash',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'rollercoaster', fx: 'gore' },
    when: { age: [18, 70] },
    weight: 5,
    cooldown: 15,
    text: {
      fr: [
        "Fête foraine de province. Les montagnes russes « Le Dévoreur » ont été montées par un forain nommé Dédé qui a encore trois vis dans la main. Ta barre de sécurité ne se verrouille pas. Le wagon démarre.",
        "Dans le wagon devant toi, un influenceur filme en se tenant debout. Le premier looping arrive. Tu as mangé {w:food} et une barbe à papa juste avant.",
        "Les montagnes russes font {w:sound} à chaque virage. Ton voisin de siège hurle déjà. Dans la descente, tu vois une poutre très basse.",
        "Attraction « Kamikaze 3000 », dernière vérification de sécurité en 1997. Un panneau dit : « Gardez la tête dans le wagon. » Ton voisin, très grand, l'a mal lu.",
      ],
      en: [
        "Small-town fair. 'The Devourer' rollercoaster was assembled by a carny named Dédé who still has three screws in his hand. Your safety bar won't lock. The car starts moving.",
        "In the car ahead of you, an influencer is filming while standing up. The first loop is coming. You just ate {w:food} and cotton candy.",
        "The rollercoaster makes {w:sound} at every turn. Your seatmate is already screaming. On the drop, you spot a very low beam.",
        "The 'Kamikaze 3000' ride, last safety check in 1997. A sign says: 'Keep your head inside the car.' Your very tall seatmate misread it.",
      ],
    },
    choices: [
      {
        label: { fr: 'Lever les bras', en: 'Hands in the air' },
        out: [
          { w: 2, text: { fr: ["J'ai levé les bras. Mon vomi a fait le looping avec moi et a atterri pile sur l'influenceur, en direct. Il a perdu 40 000 abonnés. J'en ai gagné autant.", "Bras en l'air, j'ai tout vomi dans le premier looping. Le vomi a tourné en orbite et rattrapé le wagon au deuxième passage. Douche tiède garantie pour tout le monde."], en: ["I raised my arms. My vomit did the loop with me and landed right on the influencer, live. He lost 40,000 followers. I gained as many.", "Arms up, I threw up everything in the first loop. The vomit went into orbit and caught up with the car on the second pass. Warm shower for everyone."] }, fx: { happy: 8, followers: 8000, health: -2, visual: 'poop' }, mood: 'party' },
          { w: 2, text: { fr: ["Le grand type à côté a gardé la tête haute. La poutre aussi. Sa tête a continué le tour toute seule, en souriant, et a fini dans le bac à barbe à papa. Dédé a dit « ça arrive ».", "J'ai levé les bras, la poutre est passée à un cheveu. Mon voisin, lui, a laissé son scalp et sa perruque sur la poutre. On les voit encore à chaque tour."], en: ["The tall guy next to me kept his head up. So did the beam. His head finished the ride on its own, smiling, and landed in the cotton candy tub. Dédé said 'it happens'.", "I raised my arms, the beam missed me by a hair. My neighbour left his scalp and his wig on it. You can still see them every lap."] }, fx: { happy: -4, stress: 10, disease: 'ptsd', visual: 'gore' }, mood: 'shock' },
          { w: 1, text: { fr: ["Ma barre de sécurité s'est ouverte au sommet. J'ai décollé comme un pigeon d'argile, traversé le stand de chamboule-tout et fini dans la grande roue, encastré{|e} dans la nacelle d'un couple qui s'embrassait.", "La barre a lâché dans le looping. J'ai continué tout droit, en ligne droite, jusque dans le parking. On m'a retrouvé{|e} à plat sur le capot d'une Twingo, en étoile de mer."], en: ["My safety bar opened at the top. I launched like a clay pigeon, crashed through the ring-toss stand and ended up in the Ferris wheel, wedged in the gondola of a kissing couple.", "The bar gave out in the loop. I kept going straight, into the parking lot. They found me splattered starfish-style on the hood of a hatchback."] }, fx: { die: { fr: "éjecté{|e} des montagnes russes de Dédé, en plein looping", en: "ejected from Dédé's rollercoaster mid-loop" }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'S\'agripper et prier', en: 'Hold on and pray' }, text: { fr: ["Je me suis agrippé{|e} si fort que j'ai arraché la barre de sécurité. Je suis descendu{|e} avec elle dans les bras, comme un trophée. Dédé me l'a fait payer 200 balles.", "J'ai prié tous les dieux. L'un d'eux a répondu : j'ai survécu, couvert{|e} du vomi de l'inconnu de derrière. J'ai encore un bout de chips dans l'oreille."], en: ["I held on so hard I ripped off the safety bar. I got off carrying it like a trophy. Dédé charged me 200 bucks for it.", "I prayed to every god. One answered: I survived, covered in the vomit of the stranger behind me. I still have a chip in my ear."] }, fx: { money: -200, stress: 6, happy: -2 } },
    ],
  },

  // ── Piñata pour adultes ──
  {
    id: 'tr_pinata',
    icon: '🪅',
    cat: 'trash',
    rating: 2,
    scene: { place: 'party', mood: 'party', prop: 'pinata', fx: 'gore' },
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Anniversaire des 40 ans d'un collègue. On te bande les yeux, on te fait tourner douze fois et on te met une batte de baseball dans les mains. Quelque part, il y a une piñata. Et des invités.",
        "La piñata représente {w:celeb}. Tu as les yeux bandés, {w:drink} dans le sang, et une batte en aluminium. Quelqu'un crie « À GAUCHE ! », quelqu'un d'autre « À DROITE ! ».",
        "Piñata géante à la fête de ton voisin, remplie, paraît-il, de « surprises pour adultes ». Les yeux bandés, tu entends {w:sound} juste devant toi. C'est peut-être la piñata. Peut-être pas.",
        "On t'a bandé les yeux avec une chaussette qui sent {w:smell}. Tu tiens un manche de pioche. La foule hurle. Tu ne sais plus où est le nord, ni la piñata, ni la grand-mère.",
      ],
      en: [
        "A coworker's 40th. They blindfold you, spin you twelve times and put a baseball bat in your hands. Somewhere there's a piñata. And guests.",
        "The piñata is shaped like {w:celeb}. You're blindfolded, full of {w:drink}, holding an aluminium bat. Someone yells 'LEFT!', someone else 'RIGHT!'.",
        "Giant piñata at your neighbour's party, filled, allegedly, with 'adult surprises'. Blindfolded, you hear {w:sound} right in front of you. Might be the piñata. Might not.",
        "They blindfolded you with a sock that smells like {w:smell}. You're holding a pickaxe handle. The crowd's roaring. You no longer know where north is, or the piñata, or grandma.",
      ],
    },
    choices: [
      {
        label: { fr: 'Frapper de toutes mes forces', en: 'Swing with everything' },
        out: [
          { w: 2, text: { fr: ["J'ai frappé. « Crac ». Ce n'était pas la piñata, c'était l'hôte. Ses dents ont giclé comme des bonbons et les enfants des voisins se sont battus pour les ramasser. {w:swear}", "Grand coup de batte. J'ai touché le marié par erreur, ses lunettes et une incisive ont volé jusque dans le bol de punch. Il a dit « c'est rien » avec un sifflement de bouilloire."], en: ["I swung. 'Crack.' Not the piñata, the host. His teeth sprayed out like candy and the neighbours' kids fought to collect them. {w:swear}", "Big swing. I hit the groom by mistake, his glasses and a front tooth flew into the punch bowl. He said 'it's fine' with a kettle whistle."] }, fx: { happy: 8, karma: -4, visual: 'gore' }, mood: 'shock' },
          { w: 2, text: { fr: ["J'ai éventré la piñata. Il en est tombé des préservatifs, des mini-bouteilles et {w:gross}. Tout le monde s'est jeté au sol comme des mouettes sur une frite.", "Je l'ai explosée du premier coup. Une pluie de confettis, de bonbons et d'un dentier, celui de mémé, qui l'avait caché là pour une raison que personne ne connaît."], en: ["I gutted the piñata. Out fell condoms, mini liquor bottles and {w:gross}. Everyone dove to the floor like seagulls on a fry.", "I busted it on the first swing. A rain of confetti, candy and dentures, granny's, who had hidden them in there for reasons nobody knows."] }, fx: { happy: 10, stress: -4 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai tourné sur moi-même et me suis assommé{|e} avec ma propre batte. Je me suis réveillé{|e} avec les bonbons dans la bouche, posés là par des invités farceurs.", "La batte m'a glissé des mains et a traversé la fenêtre du voisin. Il est sorti en peignoir, avec {w:object} à la main, prêt à se battre."], en: ["I spun around and knocked myself out with my own bat. I woke up with candy in my mouth, placed there by prankster guests.", "The bat slipped out of my hands and went through the neighbour's window. He came out in a bathrobe holding {w:object}, ready to fight."] }, fx: { health: -6, disease: 'concussion', happy: -2 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Tricher, soulever le bandeau', en: 'Cheat, peek' }, text: { fr: ["J'ai triché et visé directement la piñata. J'ai tout récupéré. Les enfants m'ont traité{|e} de tricheur{|euse}. Je leur ai lancé : « Bienvenue dans la vraie vie, {w:insult}. »", "J'ai soulevé le bandeau, défoncé la piñata et ramassé toutes les mignonnettes. J'ai fini bourré{|e} dans la haie à 21 h. Rentable."], en: ["I cheated and went straight for the piñata. I got everything. The kids called me a cheater. I told them: 'Welcome to real life, {w:insult}.'", "I lifted the blindfold, smashed the piñata and grabbed all the mini bottles. I was passed out in the hedge by 9 p.m. Worth it."] }, fx: { happy: 6, karma: -3, addiction: ['alcohol', 4] } },
    ],
  },

  // ── Chandelle romaine ──
  {
    id: 'tr_roman_candle',
    icon: '🎆',
    cat: 'trash',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'park', mood: 'party', prop: 'fireworks', fx: 'explosion' },
    when: { age: [18, 55] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "14 juillet. {a.first} sort une caisse de feux d'artifice achetés « à un mec sur un parking ». L'étiquette est en cyrillique. {a:Il|Elle} propose de les allumer « à la main, c'est plus authentique ».",
        "Réveillon. {a.first} veut faire un « duel de chandelles romaines » comme dans les vidéos. Tu tiens déjà la tienne. La sienne est pointée vers ton entrejambe.",
        "{a.first}, fin saoul{a:|e}, s'est coincé une fusée dans la poche arrière du jean « pour libérer les mains ». La mèche est allumée. Il reste cinq secondes.",
        "Fête au camping. {a.first} a fabriqué une « mégafusée » avec {w:object} et des trucs du garage. Tu ne sais pas ce qu'il y a dedans. Personne ne sait. Même pas {a:lui|elle}.",
      ],
      en: [
        "Fourth of July. {a.first} pulls out a crate of fireworks bought 'from a guy in a parking lot'. The label's in Cyrillic. They suggest lighting them 'by hand, it's more authentic'.",
        "New Year's Eve. {a.first} wants a 'Roman candle duel' like in the videos. You're already holding yours. Theirs is pointed at your crotch.",
        "{a.first}, wasted, jammed a rocket into the back pocket of their jeans 'to free up the hands'. The fuse is lit. Five seconds left.",
        "Campsite party. {a.first} built a 'mega-rocket' out of {w:object} and stuff from the garage. You don't know what's in it. Nobody does. Not even them.",
      ],
    },
    choices: [
      {
        label: { fr: 'Accepter le duel', en: 'Accept the duel' },
        out: [
          { w: 2, text: { fr: ["Duel accepté. Une boule verte m'a atteint{|e} au torse, une rouge a cramé les sourcils de {a.first}. On ressemblait à deux Schtroumpfs grillés. Meilleur réveillon de l'histoire.", "On s'est canardés comme des cow-boys. Une fusée a fini dans le slip de {a.first}, qui a dansé une gigue irlandaise en hurlant {w:swear}"], en: ["Duel on. A green ball hit me in the chest, a red one torched {a.first}'s eyebrows. We looked like two grilled Smurfs. Best New Year's ever.", "We shot at each other like cowboys. One rocket ended up in {a.first}'s underwear, and they did an Irish jig screaming {w:swear}"] }, fx: { happy: 12, health: -6, rel: 8, disease: 'burns', visual: 'explosion' }, mood: 'party' },
          { w: 1, text: { fr: ["Ma chandelle a explosé dans ma main. Trois doigts sont partis vers les étoiles en éclairant le ciel de rose. Un enfant au loin a crié « Ooooh ! ».", "La caisse entière a pris feu. Le parking a ressemblé à Bagdad pendant dix minutes. {a.first} a perdu une oreille. Je l'ai retrouvée le lendemain dans ma capuche."], en: ["My candle exploded in my hand. Three fingers went to the stars, lighting the sky pink. A kid in the distance went 'Ooooh!'.", "The whole crate caught fire. The parking lot looked like a war zone for ten minutes. {a.first} lost an ear. I found it the next day in my hood."] }, fx: { health: -15, disease: 'missing_finger', happy: -6, visual: 'explosion' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Arracher la fusée de sa poche', en: 'Rip the rocket out' }, out: [
        { w: 2, text: { fr: ["J'ai arraché la fusée de son jean et je l'ai jetée au hasard. Elle est entrée par la fenêtre de la caravane du proprio du camping. Ses rideaux brûlent encore. On a filé.", "Je l'ai sauvé{a:|e}. La fusée a fait trois tours et a explosé dans {w:vehicle} qui passait par là. On a fui en courant, morts de rire."], en: ["I yanked the rocket out of their jeans and threw it randomly. It went through the campsite owner's trailer window. His curtains are still burning. We bolted.", "I saved them. The rocket did three laps and blew up inside {w:vehicle} parked nearby. We ran off, dying of laughter."] }, fx: { rel: 12, karma: 2, heat: 8, visual: 'fire' }, mood: 'happy' },
        { w: 1, text: { fr: ["Trop tard. La fusée a décollé avec le jean et une partie de ce qu'il y avait dedans. {a.first} a fini la soirée en caleçon, avec une fesse carbonisée et une nouvelle peur du ciel.", "Elle est partie au moment où je tirais. {a.first} a été propulsé{a:|e} sur trois mètres, comme un missile humain, et a atterri dans la piscine des voisins."], en: ["Too late. The rocket took off with the jeans and part of what was in them. {a.first} finished the night in boxers, with a charred butt cheek and a new fear of the sky.", "It went off as I pulled. {a.first} got launched ten feet like a human missile and landed in the neighbours' pool."] }, fx: { rel: 4, happy: 6, visual: 'explosion' }, mood: 'shock' },
      ] },
      { label: { fr: 'Filer derrière la voiture', en: 'Hide behind the car' }, text: { fr: ["Je me suis planqué{|e} derrière la bagnole. J'ai entendu un « FIOUUU », un « BOUM » et un « OH NON MON {w:bodypart} ». J'ai attendu que ça sente moins le cochon grillé pour sortir.", "Je me suis caché{|e}. Quand je suis sorti{|e}, {a.first} n'avait plus de cheveux et le chien des voisins avait changé de couleur."], en: ["I hid behind the car. I heard a 'FWEEE', a 'BOOM' and an 'OH NO MY {w:bodypart}'. I waited until it smelled less like roast pork before coming out.", "I hid. When I came out, {a.first} had no hair left and the neighbours' dog had changed colour."] }, fx: { stress: 2, happy: 3 } },
    ],
  },

  // ── Cocotte-minute ──
  {
    id: 'tr_pressure_cooker',
    icon: '🍲',
    cat: 'trash',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'pot', fx: 'explosion' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Ta cocotte-minute de 1983 siffle comme une locomotive possédée. Dedans : six kilos de haricots rouges pour une soirée chili. La soupape tremble. Tes invités arrivent dans cinq minutes.",
        "Tu as mis {w:food} dans la cocotte-minute « pour aller plus vite ». Elle fait {w:sound}, le couvercle se bombe comme un ventre de femme enceinte. Il ne reste qu'une solution : le bouton rouge.",
        "La cocotte-minute héritée de mamie vibre sur la gazinière, la soupape crache une vapeur brune qui sent {w:smell}. Le chat s'enfuit. Le chat sait.",
        "Un dimanche, en plein pot-au-feu, la cocotte-minute émet un sifflement que tu n'avais jamais entendu. Une fissure apparaît sur le couvercle. Ton oncle s'approche pour « regarder de plus près ».",
      ],
      en: [
        "Your 1983 pressure cooker is whistling like a possessed locomotive. Inside: thirteen pounds of kidney beans for chili night. The valve is shaking. Guests arrive in five minutes.",
        "You put {w:food} in the pressure cooker 'to go faster'. It's making {w:sound}, the lid is bulging like a pregnant belly. Only one option left: the red button.",
        "Grandma's inherited pressure cooker is vibrating on the stove, the valve spitting brown steam that smells like {w:smell}. The cat runs. The cat knows.",
        "Sunday, mid-stew, the pressure cooker emits a whistle you've never heard before. A crack appears on the lid. Your uncle walks over to 'take a closer look'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Ouvrir le couvercle', en: 'Open the lid' },
        out: [
          { w: 2, text: { fr: ["J'ai ouvert. Geyser de haricots bouillants. Le plafond, les murs, le chat : tout est devenu chili. Mes invités ont mangé à la cuillère directement sur le lustre.", "Le couvercle a décollé comme une soucoupe volante, traversé le plafond et atterri chez la voisine du dessus, en plein dans son {w:food}. Elle n'a toujours pas compris."], en: ["I opened it. Geyser of boiling beans. Ceiling, walls, cat: all chili now. My guests ate straight off the chandelier with spoons.", "The lid took off like a flying saucer, went through the ceiling and landed upstairs, right in my neighbour's {w:food}. She still doesn't get it."] }, fx: { health: -8, disease: 'burns', money: -500, visual: 'explosion' }, mood: 'shock' },
          { w: 1, text: { fr: ["Le couvercle m'a scalpé{|e} au passage et s'est planté dans le mur comme un frisbee ninja. J'ai une raie au milieu permanente. Les haricots étaient délicieux.", "La vapeur m'a cuit le visage à point. Mes joues sont rose jambon. Un invité m'a demandé si j'avais fait un soin du visage. J'ai dit oui, à 120 degrés."], en: ["The lid scalped me on the way out and stuck in the wall like a ninja frisbee. I now have a permanent middle part. The beans were delicious.", "The steam cooked my face medium-rare. My cheeks are ham pink. A guest asked if I'd had a facial. I said yes, at 250 degrees."] }, fx: { health: -12, looks: -6, disease: 'burns', visual: 'fire' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Évacuer l\'immeuble', en: 'Evacuate the building' }, out: [
        { w: 2, text: { fr: ["J'ai tiré l'alarme incendie et évacué tout l'immeuble. Quinze minutes plus tard, la cocotte a explosé dans le vide. Les pompiers ont trouvé des haricots jusque sur le balcon d'en face. Héros.", "Évacuation générale. Tout le monde en pyjama dehors, {w:weather}. La cocotte a juste fait « pfff ». On m'a détesté{|e} pendant six mois."], en: ["I pulled the fire alarm and evacuated the whole building. Fifteen minutes later, the cooker blew up in an empty flat. Firefighters found beans on the balcony across the street. Hero.", "Full evacuation. Everyone outside in pyjamas, {w:weather}. The cooker just went 'pfff'. Everyone hated me for six months."] }, fx: { karma: 4, happy: 2, stress: 4 }, mood: 'neutral' },
        { w: 1, text: { fr: ["Pendant que j'évacuais, mon oncle est resté à côté de la cocotte « pour surveiller ». Il a pris le couvercle en plein front. Il va bien, il parle juste en alexandrins depuis.", "Tout le monde est sorti, sauf le chat, qui est revenu chercher ses croquettes. Il est ressorti en volant, propulsé par le souffle, couvert de pot-au-feu. Il a neuf vies, il en reste huit."], en: ["While I evacuated, my uncle stayed by the cooker 'to keep an eye on it'. He took the lid right on the forehead. He's fine, he just speaks in rhyme now.", "Everyone got out except the cat, who went back for his kibble. He came out flying, blown by the blast, covered in stew. Nine lives, eight left."] }, fx: { happy: 6, karma: 1, visual: 'explosion' }, mood: 'shock' },
      ] },
      { label: { fr: 'Appuyer sur la soupape', en: 'Press the valve' }, text: { fr: ["J'ai appuyé sur la soupape avec une louche. Jet de vapeur au visage, sifflement à réveiller les morts, et la cocotte s'est calmée. Moi non. Je n'ai plus de cils.", "J'ai appuyé. La cocotte a émis {w:sound} interminable, comme un pet de géant, puis s'est tue. Mes invités, arrivés pile à ce moment-là, m'ont regardé{|e} bizarrement."], en: ["I pressed the valve with a ladle. Steam jet to the face, a whistle loud enough to wake the dead, and the cooker calmed down. I didn't. I have no eyelashes left.", "I pressed it. The cooker made an endless {w:sound}, like a giant's fart, then went quiet. My guests, arriving at that exact moment, gave me a weird look."] }, fx: { looks: -2, stress: 2 } },
    ],
  },

  // ── Sculpture sur glace à la tronçonneuse ──
  {
    id: 'tr_ice_sculpture',
    icon: '🧊',
    cat: 'trash',
    rating: 2,
    scene: { place: 'castle', mood: 'party', prop: 'chainsaw', fx: 'gore' },
    when: { age: [18, 75] },
    weight: 5,
    cooldown: 15,
    text: {
      fr: [
        "Mariage au château. Le « sculpteur sur glace » engagé par les mariés est un cousin qui a vu deux tutos YouTube. Il démarre sa tronçonneuse au milieu des invités, cravate au vent.",
        "Le cygne en glace du buffet fond sous un soleil de plomb. Le marié, ivre, décide de le « réparer » à la tronçonneuse. Tu es juste à côté, avec ton assiette de petits fours.",
        "Animation de mariage : « tronçonneuse et glace pilée ». Le sculpteur te désigne au hasard pour l'aider à tenir le bloc. Il a les mains qui tremblent et son haleine trahit {w:drink}.",
        "Au vin d'honneur, la tronçonneuse du sculpteur s'emballe et lui échappe des mains. Elle tournoie au sol comme une toupie folle vers la pièce montée, les demoiselles d'honneur et toi.",
      ],
      en: [
        "Wedding at a castle. The 'ice sculptor' hired by the couple is a cousin who watched two YouTube tutorials. He fires up his chainsaw in the middle of the guests, tie flapping.",
        "The ice swan on the buffet is melting under a scorching sun. The drunk groom decides to 'fix it' with a chainsaw. You're right next to it with your plate of canapés.",
        "Wedding entertainment: 'chainsaw and crushed ice'. The sculptor picks you at random to hold the block. His hands are shaking and his breath smells of {w:drink}.",
        "At the cocktail hour, the sculptor's chainsaw goes rogue and slips out of his hands. It spins across the floor like a mad top toward the wedding cake, the bridesmaids, and you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Plonger dans la pièce montée', en: 'Dive into the cake' },
        out: [
          { w: 2, text: { fr: ["J'ai plongé dans la pièce montée. 300 choux à la crème m'ont sauvé la vie. La tronçonneuse a coupé le cygne, la nappe et la traîne de la mariée en lanières. Elle avait une robe à franges, c'était tendance.", "Plongeon dans la pièce montée. J'en suis ressorti{|e} couvert{|e} de caramel comme un beignet humain. La tronçonneuse, elle, a fini dans la fontaine à champagne, qui a giclé en rose."], en: ["I dove into the cake. 300 cream puffs saved my life. The chainsaw cut the swan, the tablecloth and the bride's train into strips. Fringe dress, very trendy.", "Cake dive. I came out covered in caramel like a human doughnut. The chainsaw ended up in the champagne fountain, which sprayed pink."] }, fx: { happy: 10, looks: -2, karma: 1 }, mood: 'party' },
          { w: 1, text: { fr: ["La tronçonneuse a été plus rapide. Elle m'a tranché la pointe {w:bodypart} et le haut de la cravate du témoin. Le sang sur la glace, c'était magnifique, façon sorbet framboise. Le photographe a adoré.", "Elle m'a frôlé{|e} et m'a coupé un bout d'oreille, qui a atterri dans la coupe de la belle-mère. Elle l'a bu. Personne n'a rien dit."], en: ["The chainsaw was faster. It sliced the tip of my {w:bodypart} and the top of the best man's tie. Blood on ice looked gorgeous, like raspberry sorbet. The photographer loved it.", "It grazed me and took off a piece of my ear, which landed in the mother-in-law's glass. She drank it. Nobody said a word."] }, fx: { health: -14, looks: -5, visual: 'gore' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Plaquer le cousin', en: 'Tackle the cousin' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai plaqué le cousin façon rugby avant qu'il ne démarre. Il a lâché la tronçonneuse dans le lac du château. Un cygne, un vrai, l'a regardée couler avec mépris. On m'a remercié{|e} au micro.", "Placage parfait. Le cousin a atterri dans le buffet de fruits de mer. Il avait une langouste accrochée à l'oreille. Les invités ont scandé mon prénom toute la nuit."], en: ["I rugby-tackled the cousin before he started. He dropped the chainsaw into the castle lake. A real swan watched it sink with contempt. They thanked me on the mic.", "Perfect tackle. The cousin landed in the seafood buffet with a lobster clamped to his ear. The guests chanted my name all night."] }, fx: { happy: 10, karma: 6, athletic: 2 }, mood: 'proud' },
        { w: 1, text: { fr: ["Je l'ai plaqué, mais la tronçonneuse est partie dans les airs, a fait trois tours et s'est plantée dans la table d'honneur entre les mariés. Ils se sont regardés. Le mariage a duré quatre mois.", "Je l'ai plaqué et on est tombés tous les deux sur le bloc de glace. J'ai la langue collée dessus depuis vingt minutes. Les invités prennent des selfies."], en: ["I tackled him, but the chainsaw went airborne, did three spins and stuck into the head table between the newlyweds. They looked at each other. The marriage lasted four months.", "I tackled him and we both fell onto the ice block. My tongue's been stuck to it for twenty minutes. Guests are taking selfies."] }, fx: { happy: 4, health: -3 }, mood: 'shock' },
      ] },
      { label: { fr: 'Filmer en grimpant sur une chaise', en: 'Film from a chair' }, text: { fr: ["J'ai filmé depuis une chaise. La vidéo du cousin courant après sa tronçonneuse dans la roseraie a été vue 3 millions de fois. Les mariés m'ont bloqué{|e} partout.", "J'ai tout filmé. La mariée a vu la vidéo pendant sa nuit de noces et a hurlé {w:swear} Mon compte a explosé."], en: ["I filmed from a chair. The video of the cousin chasing his chainsaw through the rose garden got 3 million views. The newlyweds blocked me everywhere.", "I filmed everything. The bride watched it on her wedding night and screamed {w:swear} My account blew up."] }, fx: { followers: 20000, fame: 3, karma: -2 }, mood: 'happy' },
    ],
  },

  // ── Bar à lancer de hache ──
  {
    id: 'tr_axe_bar',
    icon: '🪓',
    cat: 'trash',
    rating: 2,
    scene: { place: 'party', mood: 'party', prop: 'axe', fx: 'gore' },
    when: { age: [18, 65] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Bar à haches « Le Viking Bourré ». Le concept : de l'alcool et des haches. Personne n'a jamais trouvé ça bizarre. Ton tour. Le serveur boit {w:drink} au goulot à côté de la cible.",
        "Team building au lancer de hache. Ton chef de projet, qui t'a humilié{|e} en réunion, est en train de ramasser une hache juste à côté de la cible. Ton bras se lève tout seul.",
        "Au bar à haches, ton date veut t'impressionner. {w:exclaim} Sa hache rebondit sur le mur et revient en tournoyant comme un boomerang vers vous deux.",
        "Enterrement de vie de garçon au lancer de hache. Le futur marié est déguisé en cible, à sa demande. Tout le monde a bu. Le moniteur vérifie son téléphone.",
      ],
      en: [
        "'The Drunk Viking' axe bar. The concept: alcohol and axes. Nobody ever found that weird. Your turn. The waiter is chugging {w:drink} next to the target.",
        "Axe-throwing team building. Your project manager, who humiliated you in a meeting, is picking up an axe right next to the target. Your arm lifts on its own.",
        "At the axe bar, your date wants to impress you. {w:exclaim} Their axe bounces off the wall and comes spinning back like a boomerang toward both of you.",
        "Bachelor party at axe throwing. The groom is dressed as a target, his own idea. Everyone's drunk. The instructor is checking his phone.",
      ],
    },
    choices: [
      {
        label: { fr: 'Lancer comme un Viking', en: 'Throw like a Viking' },
        out: [
          { w: 2, text: { fr: ["Lancer parfait. Plein centre. Le bar a crié « SKÅL ! » et on m'a offert une corne d'hydromel. J'ai vomi dans la corne. On me l'a offerte quand même.", "J'ai lancé avec un cri de guerre. La hache s'est plantée dans la cible, puis la cible s'est effondrée sur le moniteur. Il a dit « pas grave » avec une bosse grosse comme {w:food}."], en: ["Perfect throw. Bullseye. The bar yelled 'SKÅL!' and I got a horn of mead. I threw up in the horn. They let me keep it anyway.", "I threw with a war cry. The axe stuck in the target, then the target collapsed onto the instructor. He said 'no biggie' with a bump the size of {w:food}."] }, fx: { happy: 10, athletic: 2 }, mood: 'proud' },
          { w: 2, text: { fr: ["La hache a rebondi sur le cadre et est revenue me raser la moitié du crâne au passage. J'ai désormais une coupe « mulet asymétrique ». Trois personnes m'ont demandé l'adresse de mon coiffeur.", "Rebond. La hache a tranché la queue de cheval du serveur et s'est plantée dans le bar, entre deux pintes. Silence total. Puis le serveur a dit : « On garde la queue de cheval pour la déco. »"], en: ["The axe bounced off the frame and came back to shave half my head on the way. I now have an 'asymmetric mullet'. Three people asked for my barber's address.", "Rebound. The axe sliced off the waiter's ponytail and stuck in the bar between two pints. Dead silence. Then the waiter said: 'We'll keep the ponytail as decor.'"] }, fx: { looks: -5, happy: 4, visual: 'gore' }, mood: 'shock' },
          { w: 1, text: { fr: ["La hache m'a glissé des doigts en arrière. Elle s'est plantée dans le pied du futur marié. Il s'est marié en béquilles, avec un orteil en moins dans un bocal sur l'autel.", "J'ai lâché trop tard. La hache est partie au plafond, a décroché la tête de cerf empaillée qui est tombée pile sur le crâne du patron du bar. Il porte la tête depuis. Il refuse de l'enlever."], en: ["The axe slipped backward out of my fingers. It stuck in the groom's foot. He got married on crutches, with a toe in a jar on the altar.", "I let go too late. The axe hit the ceiling and knocked down the stuffed deer head, which landed right on the bar owner's skull. He's been wearing it since. He refuses to take it off."] }, fx: { happy: 6, karma: -3, visual: 'gore' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Juste boire', en: 'Just drink' }, text: { fr: ["J'ai juste bu. Beaucoup. Je me suis endormi{|e} sous la table en serrant une hache comme un doudou. Le personnel n'a pas osé me réveiller.", "J'ai bu sept hydromels et défié le serveur au bras de fer. Il m'a cassé le poignet sans poser sa bière. {w:swear}"], en: ["I just drank. A lot. I fell asleep under the table hugging an axe like a teddy bear. The staff didn't dare wake me.", "I drank seven meads and challenged the waiter to arm-wrestling. He broke my wrist without putting his beer down. {w:swear}"] }, fx: { happy: 4, health: -4, addiction: ['alcohol', 5] } },
    ],
  },

  // ── Clôture électrique ──
  {
    id: 'tr_electric_fence',
    icon: '⚡',
    cat: 'trash',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'fence', fx: 'fire' },
    when: { age: [18, 70] },
    weight: 5,
    cooldown: 15,
    text: {
      fr: [
        "Retour de mariage à la campagne, 3 h du matin. Ta vessie va exploser. La seule option : un champ, avec une clôture électrique pour vaches. Tes potes te jurent qu'elle est coupée.",
        "Rando avec des amis. Tu as descendu {w:drink}, puis un deuxième, puis un troisième. Une clôture électrique bourdonne au bord du chemin. Un panneau dit « 10 000 volts ». Ton ami dit « c'est pour les vaches, pas pour nous ».",
        "Festival en plein champ. Les toilettes sèches sentent {w:smell}, la file fait 200 mètres. Derrière la tente, une clôture électrique. Personne ne regarde.",
        "Tu fais pipi dans la nature, {w:weather}, quand tu remarques trop tard le fil électrique à hauteur de jet. Le fermier t'observe depuis son tracteur, curieux.",
      ],
      en: [
        "Heading home from a country wedding, 3 a.m. Your bladder's about to burst. Only option: a field with an electric cow fence. Your friends swear it's off.",
        "Hiking with friends. You've downed {w:drink}, then another, then a third. An electric fence hums by the trail. A sign says '10,000 volts'. Your friend says 'it's for cows, not us'.",
        "Field festival. The compost toilets smell like {w:smell}, the line is 200 yards long. Behind the tent: an electric fence. Nobody's watching.",
        "You're peeing in the wild, {w:weather}, when you notice too late the electric wire at stream height. The farmer watches from his tractor, curious.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire pipi sur la clôture', en: 'Pee on the fence' },
        out: [
          { w: 3, text: { fr: ["Elle n'était pas coupée. Le courant est remonté par le jet jusqu'à mes plombages. J'ai vu Dieu, ma grand-mère morte et la grille des programmes de 1994. Mes cheveux sont restés dressés trois jours.", "Bzzzt. J'ai fait un bond de deux mètres en arrière, la braguette ouverte, en hurlant une note que seuls les dauphins peuvent entendre. Les vaches ont applaudi avec leurs sabots."], en: ["It wasn't off. The current ran up the stream to my fillings. I saw God, my dead grandma and the 1994 TV schedule. My hair stood up for three days.", "Bzzzt. I leapt six feet backward, fly open, screaming a note only dolphins can hear. The cows applauded with their hooves."] }, fx: { health: -8, happy: -4, visual: 'fire' }, mood: 'shock' },
          { w: 2, text: { fr: ["Elle était vraiment coupée. J'ai fait pipi tranquillement en regardant les étoiles. Puis le fermier l'a rallumée. Pendant. {w:swear}", "J'ai visé, ça a grésillé, une étincelle bleue a illuminé le champ. J'ai perdu connaissance et je me suis réveillé{|e} avec une vache qui me léchait le visage."], en: ["It really was off. I peed peacefully, looking at the stars. Then the farmer switched it back on. Mid-stream. {w:swear}", "I aimed, it crackled, a blue spark lit up the field. I passed out and woke up with a cow licking my face."] }, fx: { health: -10, fertility: -10, visual: 'fire' }, mood: 'cry' },
          { w: 1, text: { fr: ["10 000 volts, sur la zone la plus conductrice de l'anatomie. J'ai fumé comme un saucisson sur le grill. Le fermier a dit à la gendarmerie : « J'avais mis un panneau. »", "Le courant m'a traversé{|e} de part en part. Mes chaussures ont fondu, mes cheveux ont pris feu, et je suis tombé{|e} raide dans la bouse, les bras en croix."], en: ["10,000 volts, on the most conductive part of the anatomy. I smoked like a sausage on the grill. The farmer told the police: 'I put up a sign.'", "The current went right through me. My shoes melted, my hair caught fire, and I fell stiff into the cow dung, arms spread."] }, fx: { die: { fr: "électrocuté{|e} en faisant pipi sur une clôture pour vaches", en: 'electrocuted while peeing on a cow fence' }, visual: 'fire' } },
        ],
      },
      { label: { fr: 'Pousser un pote dessus', en: 'Push a buddy onto it' }, text: { fr: ["J'ai poussé mon pote sur la clôture. Il a dansé le Moonwalk électrique et s'est mis à parler espagnol. Il n'a jamais appris l'espagnol. Les vaches étaient terrifiées.", "Je l'ai poussé. Il a crépité comme {w:food} au micro-ondes et s'est relevé en hurlant « JE VOIS LES SONS ». Il veut recommencer."], en: ["I pushed my buddy onto the fence. He did an electric moonwalk and started speaking Spanish. He never learned Spanish. The cows were terrified.", "I pushed him. He crackled like {w:food} in a microwave and got up screaming 'I CAN SEE SOUNDS'. He wants to go again."] }, fx: { happy: 10, karma: -4 }, mood: 'happy' },
      { label: { fr: 'Me retenir jusqu\'à la maison', en: 'Hold it until home' }, text: { fr: ["Je me suis retenu{|e} 45 minutes en voiture, en chantant {w:song} pour penser à autre chose. J'ai fait pipi sur le paillasson. Le mien, heureusement.", "Je me suis retenu{|e}. Au premier dos-d'âne, ma vessie a capitulé sur le siège passager. La voiture sent la ferme depuis."], en: ["I held it for 45 minutes in the car, singing {w:song} to distract myself. I peed on the doormat. Mine, thankfully.", "I held it. At the first speed bump, my bladder surrendered on the passenger seat. The car has smelled like a farm ever since."] }, fx: { happy: -3, stress: 4 } },
    ],
  },

  // ── Jet-ski du banquier ──
  {
    id: 'tr_jetski_banker',
    icon: '🚤',
    cat: 'trash',
    rating: 2,
    scene: { place: 'beach', mood: 'happy', prop: 'jetski', fx: 'gore' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "À la plage, un banquier en Rolex fait des cercles en jet-ski au milieu des baigneurs en hurlant « JE PAIE VOS SALAIRES ». Il se rapproche de la bouée où une mouette fait la sieste. Et de toi.",
        "Un trader bronzé façon cuir de sac à main slalome en jet-ski entre les enfants. Sa casquette dit « BOSS ». Sa femme filme. Il vient d'éclabousser ta serviette et ton {w:food}.",
        "Un héritier de 25 ans fait des figures en jet-ski dans la zone de baignade, champagne à la main. Un banc de méduses géantes dérive vers lui. Tu as un ballon de plage dans les mains.",
        "Un promoteur immobilier en jet-ski crie au maître-nageur qu'il va « racheter la plage ». Juste derrière lui, sous l'eau, tu aperçois un aileron. Ou un très gros {w:animal}.",
      ],
      en: [
        "At the beach, a banker in a Rolex is circling on a jet ski through the swimmers yelling 'I PAY YOUR SALARIES'. He's getting close to the buoy where a seagull is napping. And to you.",
        "A trader tanned like a leather handbag is slaloming between kids on a jet ski. His cap says 'BOSS'. His wife films. He just splashed your towel and your {w:food}.",
        "A 25-year-old heir is doing jet ski tricks in the swimming zone, champagne in hand. A swarm of giant jellyfish drifts toward him. You're holding a beach ball.",
        "A real estate developer on a jet ski shouts at the lifeguard that he'll 'buy the beach'. Right behind him, underwater, you see a fin. Or a very large {w:animal}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Lancer le ballon', en: 'Throw the ball' },
        out: [
          { w: 2, text: { fr: ["Le ballon l'a touché en pleine tête. Il a fait un salto arrière, perdu sa Rolex et atterri à plat ventre sur les méduses. Il est ressorti rouge, boursouflé, et sa femme a continué de filmer en souriant.", "Pile dans la nuque. Il est tombé, le jet-ski a continué sans lui et s'est encastré dans son propre yacht. Sa Rolex est au fond. J'ai plongé la chercher. Elle est à moi."], en: ["The ball hit him square in the head. He backflipped, lost his Rolex and belly-flopped onto the jellyfish. He came out red and puffy, and his wife kept filming, smiling.", "Right in the neck. He fell, the jet ski kept going without him and crashed into his own yacht. His Rolex sank. I dove for it. It's mine now."] }, fx: { happy: 12, karma: 4, money: 4000 }, mood: 'happy' },
          { w: 1, text: { fr: ["Raté. Le ballon a touché la mouette, qui s'est vengée sur moi. Pendant ce temps, l'aileron a rejoint le banquier. On n'a retrouvé que sa casquette « BOSS » et un bras qui faisait encore un doigt d'honneur. La plage a applaudi.", "J'ai raté, mais le requin, lui, non. Un « CHOMP », une gerbe rouge façon jacuzzi à la grenadine, et il ne restait que le jet-ski qui tournait en rond. Sa femme a demandé si l'assurance couvrait ça."], en: ["Missed. The ball hit the seagull, which took revenge on me. Meanwhile, the fin reached the banker. All they found was his 'BOSS' cap and an arm still flipping the bird. The beach applauded.", "I missed, but the shark didn't. One 'CHOMP', a red spray like a grenadine jacuzzi, and only the jet ski remained, circling. His wife asked if insurance covered that."] }, fx: { happy: 8, stress: 4, visual: 'gore' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Prévenir le maître-nageur', en: 'Alert the lifeguard' }, text: { fr: ["J'ai prévenu le maître-nageur. Il a haussé les épaules : « Il m'a traité de pauvre ce matin. » On s'est assis ensemble pour regarder. Les méduses ont fait le reste.", "Le maître-nageur a sifflé. Le banquier lui a jeté un billet de 500 et a continué. Dix secondes plus tard, il a percuté {w:object} qui flottait là et a fait un vol plané de toute beauté."], en: ["I told the lifeguard. He shrugged: 'He called me poor this morning.' We sat down together to watch. The jellyfish did the rest.", "The lifeguard blew his whistle. The banker tossed him a 500 note and kept going. Ten seconds later he hit {w:object} floating there and did a gorgeous flying dive."] }, fx: { happy: 8, karma: 2 }, mood: 'happy' },
      { label: { fr: 'Applaudir le requin', en: 'Cheer for the shark' }, text: { fr: ["J'ai encouragé le requin comme au match. Toute la plage s'y est mise. Le banquier est sorti de l'eau en courant sur l'eau, comme Jésus, mais en plus moche. Il a vendu son jet-ski le soir même.", "J'ai crié « ALLEZ LE REQUIN ! ». Le requin a juste mordu le jet-ski, recraché un morceau de Rolex et s'en est allé. Même lui ne voulait pas de ce type."], en: ["I cheered for the shark like at a match. The whole beach joined in. The banker ran out of the sea on the water like Jesus, only uglier. He sold his jet ski that same evening.", "I yelled 'GO SHARK!'. The shark just bit the jet ski, spat out a piece of Rolex and swam off. Even it didn't want that guy."] }, fx: { happy: 10, karma: 1 } },
    ],
  },

  // ═════════════════════════════ GROSS-OUT — caca, vomi, fluides ═════════════════════════════

  // ── Diarrhée dans le téléphérique ──
  {
    id: 'tr_cable_car_diarrhea',
    icon: '🚡',
    cat: 'trash',
    rating: 2,
    scene: { place: 'park', mood: 'sick', prop: 'cablecar', fx: 'poop' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Téléphérique bloqué à 300 mètres au-dessus du vide. Dix touristes serrés dans la cabine. Ton ventre fait {w:sound}. La tartiflette de midi a décidé de partir. Maintenant.",
        "La cabine du téléphérique s'arrête net. Annonce : « Panne technique, durée estimée : deux heures. » Ton intestin répond par un gargouillis de baleine. Il n'y a ni toilettes, ni fenêtre qui s'ouvre.",
        "Tu es dans un téléphérique bondé avec une classe de retraités allemands. Les huîtres d'hier soir te rappellent leur existence par une crampe digne d'un accouchement. La cabine tangue.",
        "Coincé{|e} dans le téléphérique, tu sens arriver une catastrophe. À côté de toi, un influenceur fait un live « vue de rêve ». Tu as {w:object} dans ton sac. Et beaucoup de désespoir.",
      ],
      en: [
        "Cable car stuck 1,000 feet above the void. Ten tourists packed in the cabin. Your stomach makes {w:sound}. Lunch's cheese casserole has decided to leave. Now.",
        "The cable car stops dead. Announcement: 'Technical failure, estimated time: two hours.' Your gut replies with a whale gurgle. No toilet, and no window that opens.",
        "You're in a crowded cable car with a group of German retirees. Last night's oysters remind you they exist with a cramp worthy of childbirth. The cabin sways.",
        "Stuck in the cable car, you feel disaster coming. Next to you, an influencer is livestreaming 'dream view'. You have {w:object} in your bag. And a lot of despair.",
      ],
    },
    choices: [
      {
        label: { fr: 'Serrer les fesses', en: 'Clench and pray' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai serré pendant deux heures, en sueur, les yeux révulsés, en récitant {w:song} à l'envers. Arrivé{|e} en bas, j'ai couru, poussé un enfant et atteint les toilettes. Mon plus grand exploit sportif.", "J'ai tenu. Un retraité allemand m'a tenu la main, en silence, comme un frère d'armes. On ne s'est jamais reparlé, mais on se comprend."], en: ["I clenched for two hours, sweating, eyes rolled back, reciting {w:song} backward. At the bottom I ran, shoved a kid, and reached the toilet. My greatest athletic achievement.", "I held it. A German retiree held my hand in silence like a brother in arms. We never spoke again, but we understand each other."] }, fx: { discipline: 4, stress: 8, happy: 4 }, mood: 'proud' },
          { w: 2, text: { fr: ["J'ai tenu une heure et cinquante-huit minutes. Puis le téléphérique a redémarré d'un coup sec. Mon pantalon a explosé comme une piñata marron. Les vitres de la cabine sont devenues opaques.", "J'ai perdu le combat. Le bruit a fait taire tout le monde, l'odeur a fait pleurer une Allemande. L'influenceur a coupé son live en hurlant {w:swear}"], en: ["I held on for one hour and fifty-eight minutes. Then the cable car restarted with a jolt. My pants exploded like a brown piñata. The cabin windows went opaque.", "I lost the battle. The sound silenced everyone, the smell made a German lady cry. The influencer cut his live, screaming {w:swear}"] }, fx: { happy: -12, looks: -4, stress: 6, visual: 'poop' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Utiliser le sac de l\'influenceur', en: 'Use the influencer\'s bag' }, text: { fr: ["J'ai attrapé le sac à dos de marque de l'influenceur et je m'en suis servi{|e}, en plein live. 200 000 personnes ont vu le pire moment de sa vie. Et du mien. Il m'a remercié{|e} pour les vues.", "J'ai réquisitionné son sac Louis Vuitton. Tout le monde a tourné le dos par politesse, sauf sa caméra, qui tournait toujours. Il a fait le buzz de l'année."], en: ["I grabbed the influencer's designer backpack and used it, live on air. 200,000 people saw the worst moment of his life. And mine. He thanked me for the views.", "I commandeered his designer bag. Everyone turned around out of politeness, except his camera, still rolling. He went viral for the year."] }, fx: { happy: 4, karma: -4, followers: 5000, fame: 2, visual: 'poop' }, mood: 'shock' },
      { label: { fr: 'Accuser un retraité', en: 'Blame a retiree' }, text: { fr: ["J'ai pointé du doigt le plus vieux de la cabine en disant « Herr Müller ! » d'un air outré. Tout le monde l'a regardé. Il a haussé les épaules et a dit : « Ja, possible. » Respect éternel.", "J'ai lâché ce qui devait sortir, discrètement, et désigné un monsieur âgé. Il s'est excusé. Il s'est excusé ! Je dormirai mal pendant des années."], en: ["I pointed at the oldest guy in the cabin, outraged: 'Herr Müller!' Everyone looked at him. He shrugged and said: 'Ja, possible.' Eternal respect.", "I let out what had to come out, discreetly, and pointed at an elderly man. He apologised. He apologised! I'll sleep badly for years."] }, fx: { happy: 4, karma: -6 } },
    ],
  },

  // ── Entretien d'embauche et diarrhée ──
  {
    id: 'tr_interview_poop',
    icon: '💼',
    cat: 'trash',
    rating: 2,
    scene: { place: 'office', mood: 'sick', prop: 'chair', fx: 'poop' },
    when: { age: [18, 60], job: false },
    weight: 6,
    cooldown: 10,
    text: {
      fr: [
        "Entretien d'embauche pour le job de tes rêves. Le DRH te demande « Où vous voyez-vous dans cinq ans ? ». Ton ventre, lui, se voit aux toilettes dans cinq secondes. Le kebab d'hier soir frappe à la porte.",
        "Face à trois recruteurs, tu sens une bulle de gaz se former. Une grosse. Une qui a de l'ambition. Elle a été nourrie avec {w:food}. La salle est minuscule et sans fenêtre.",
        "« Parlez-nous de vos défauts », dit la recruteuse. Au même moment, ton intestin émet {w:sound} audible depuis le couloir. Tout le monde a entendu. Tout le monde fait semblant que non.",
        "Entretien en visio, mais en direct de tes toilettes, parce que ta gastro ne t'a laissé aucun choix. Tu as mis un fond d'écran « bibliothèque ». La chasse d'eau est juste derrière toi.",
      ],
      en: [
        "Job interview for your dream job. HR asks 'Where do you see yourself in five years?'. Your stomach sees itself in the bathroom in five seconds. Last night's kebab is knocking.",
        "Facing three recruiters, you feel a gas bubble forming. A big one. An ambitious one. It was raised on {w:food}. The room is tiny and windowless.",
        "'Tell us about your weaknesses,' says the recruiter. At that very moment, your gut emits {w:sound} audible from the hallway. Everyone heard. Everyone pretends they didn't.",
        "Video interview, but live from your toilet, because your stomach bug gave you no choice. You set a 'library' background. The flush handle is right behind you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Assumer, avec aplomb', en: 'Own it confidently' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai dit : « Mon défaut ? Je ne lâche jamais rien. Sauf ça. » Ils ont ri jusqu'aux larmes. J'ai été embauché{|e}. Mon surnom au bureau est désormais « Le Souffle ».", "J'ai regardé le DRH droit dans les yeux : « Ça, c'est la transparence dont votre boîte a besoin. » Il m'a serré la main. J'ai le job, et une réputation."], en: ["I said: 'My weakness? I never let anything go. Except that.' They laughed until they cried. I got hired. My office nickname is now 'The Breeze'.", "I looked HR straight in the eye: 'That's the transparency your company needs.' He shook my hand. I got the job, and a reputation."] }, fx: { happy: 10, open: 'jobs' }, mood: 'proud' },
          { w: 2, text: { fr: ["J'ai voulu assumer en souriant, mais ce n'était pas qu'un pet. La chaise en tissu ne s'en est jamais remise. La recruteuse a ouvert la porte et dit : « Nous vous rappellerons. » Elle a vomi dans le couloir.", "J'ai assumé. L'odeur, elle, a assumé encore plus. L'alarme incendie s'est déclenchée. Les recruteurs m'ont envoyé un mail de refus avant même que je sois sorti{|e} du parking."], en: ["I tried to own it with a smile, but it wasn't just a fart. The fabric chair never recovered. The recruiter opened the door and said: 'We'll call you.' She threw up in the hallway.", "I owned it. The smell owned it even harder. The fire alarm went off. The recruiters sent a rejection email before I'd even left the parking lot."] }, fx: { happy: -10, stress: 8, visual: 'poop' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Demander les toilettes', en: 'Ask for the bathroom' }, text: { fr: ["J'ai demandé les toilettes. Elles étaient en panne. J'ai utilisé celles du PDG, qui est entré pendant. Il m'a regardé{|e}, j'ai dit « Bonjour, je suis le candidat ». Il a refermé la porte doucement.", "Toilettes de l'entreprise : pas de papier. J'ai utilisé mon CV. Les trois exemplaires. Je suis revenu{|e} en entretien les mains vides et l'âme lavée."], en: ["I asked for the bathroom. It was out of order. I used the CEO's, who walked in mid-session. He looked at me, I said 'Hi, I'm the candidate.' He gently closed the door.", "Company bathroom: no paper. I used my résumé. All three copies. I went back into the interview empty-handed with a clean soul."] }, fx: { happy: -4, stress: 4 } },
      { label: { fr: 'Accuser le recruteur', en: 'Blame the recruiter' }, text: { fr: ["J'ai fixé le recruteur de gauche en fronçant le nez. Les deux autres l'ont regardé aussi. Il a rougi. J'ai été embauché{|e} et lui viré trois semaines plus tard. Le capitalisme, c'est la jungle.", "J'ai dit : « Pas de souci, Bertrand, ça arrive à tout le monde. » Bertrand ne s'en est jamais remis. J'ai eu le poste, lui a eu un surnom."], en: ["I stared at the recruiter on the left, wrinkling my nose. The other two looked at him too. He blushed. I got hired and he got fired three weeks later. Capitalism is a jungle.", "I said: 'No worries, Bertrand, it happens to everyone.' Bertrand never recovered. I got the job, he got a nickname."] }, fx: { karma: -6, happy: 8, open: 'jobs' }, mood: 'happy' },
    ],
  },

  // ── Premier rendez-vous et accident ──
  {
    id: 'tr_date_shart',
    icon: '💨',
    cat: 'trash',
    rating: 2,
    actor: { create: { role: 'acquaintance', age: [20, 45], abs: true, gender: 'attracted' } },
    scene: { place: 'party', mood: 'love', prop: 'candle', fx: 'poop' },
    when: { age: [18, 60], noHas: 'spouse' },
    weight: 6,
    cooldown: 10,
    text: {
      fr: [
        "Premier rendez-vous avec {a.first}, rencontré{a:|e} sur {w:app}. Restaurant chic, bougies, jazz. Tu as mangé un chili trois piments avant de venir, par stress. Ton ventre gargouille sur le solo de saxo.",
        "Rendez-vous parfait avec {a.first}. Vous riez, vous vous frôlez. Puis tu éternues. Et pas que. Il y a eu un bruit de serpillière mouillée dans ton pantalon blanc.",
        "{a.first} t'embrasse sur le canapé. C'est le moment. Mais ton intestin, gavé avec {w:food}, réclame la parole. Fort. Très fort.",
        "Dîner chez {a.first}. {a:Il|Elle} a cuisiné un plat aux choux et aux haricots. Ton ventre se gonfle comme une montgolfière. {a:Il|Elle} te propose un câlin « serré ».",
      ],
      en: [
        "First date with {a.first}, met on {w:app}. Fancy restaurant, candles, jazz. You ate a triple-pepper chili beforehand out of nerves. Your stomach gurgles over the sax solo.",
        "Perfect date with {a.first}. You laugh, you brush hands. Then you sneeze. And not only that. There was a wet-mop sound in your white pants.",
        "{a.first} is kissing you on the couch. This is the moment. But your gut, fed on {w:food}, demands to speak. Loudly. Very loudly.",
        "Dinner at {a.first}'s. They cooked a cabbage and bean dish. Your stomach inflates like a hot-air balloon. They suggest a 'tight' hug.",
      ],
    },
    choices: [
      {
        label: { fr: 'Avouer avec humour', en: 'Confess with humour' },
        out: [
          { w: 2, text: { fr: ["J'ai dit : « Bon, maintenant tu connais tout de moi. » {a.first} a ri si fort qu'{a:il|elle} a lâché le même. On a ouvert la fenêtre et on a fini la nuit ensemble. L'amour, le vrai.", "J'ai avoué. {a.first} a répondu : « Moi j'ai fait pire au dernier date, j'ai vomi dans le sac du mec. » On était faits l'un pour l'autre."], en: ["I said: 'Well, now you know everything about me.' {a.first} laughed so hard they let out the same. We opened the window and spent the night together. True love.", "I confessed. {a.first} replied: 'I did worse on my last date, I threw up in the guy's bag.' We were made for each other."] }, fx: { happy: 12, rel: 20, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai fait une blague. {a.first} s'est levé{a:|e}, a payé sa moitié et est parti{a:|e} sans un mot. Le serveur m'a apporté un désodorisant avec l'addition.", "J'ai voulu en rire, mais {a.first} avait déjà ouvert la fenêtre et sauté par-dessus. Premier étage, heureusement. {a:Il|Elle} m'a bloqué{|e} depuis l'ambulance."], en: ["I made a joke. {a.first} stood up, paid their half and left without a word. The waiter brought me air freshener with the bill.", "I tried to laugh it off, but {a.first} had already opened the window and jumped out. First floor, luckily. They blocked me from the ambulance."] }, fx: { happy: -8, looks: -2 }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Fuir aux toilettes', en: 'Flee to the bathroom' }, text: { fr: ["J'ai couru aux toilettes et j'y suis resté{|e} 40 minutes. J'ai entendu {a.first} demander au serveur si j'étais mort{|e}. En sortant, j'ai jeté mon caleçon par la fenêtre. On s'est revus. Je n'ai jamais rien dit.", "Fuite aux toilettes. Il n'y avait pas de papier, juste {w:object}. J'ai improvisé. Je suis revenu{|e} avec une tête de survivant{|e} de guerre. {a.first} avait commandé le dessert. Pour {a:lui|elle} seul{a:|e}."], en: ["I ran to the bathroom and stayed 40 minutes. I heard {a.first} ask the waiter if I was dead. On the way out, I threw my underwear out the window. We saw each other again. I never said a word.", "Bathroom escape. No paper, just {w:object}. I improvised. I came back looking like a war survivor. {a.first} had ordered dessert. For one."] }, fx: { happy: -4, rel: 2 } },
      { label: { fr: 'Accuser le chien', en: 'Blame the dog' }, text: { fr: ["J'ai accusé le chien. Il n'y avait pas de chien. {a.first} a cherché le chien partout pendant dix minutes. On s'est quittés là-dessus, et je pense qu'{a:il|elle} le cherche encore.", "J'ai dit : « Ton chien est malade, non ? » {a.first} m'a regardé{|e} : « Je n'ai pas de chien. C'est un chat. Et il est mort la semaine dernière. » Silence. Puis {a:il|elle} a pleuré. Puis moi aussi, pour d'autres raisons."], en: ["I blamed the dog. There was no dog. {a.first} searched for the dog for ten minutes. That's how we parted, and I think they're still looking.", "I said: 'Your dog's sick, right?' {a.first} looked at me: 'I don't have a dog. It was a cat. And it died last week.' Silence. Then they cried. Then so did I, for other reasons."] }, fx: { happy: -2, karma: -3 } },
    ],
  },

  // ── L'étron de la piscine ──
  {
    id: 'tr_pool_turd',
    icon: '🏊',
    cat: 'trash',
    rating: 2,
    scene: { place: 'beach', mood: 'shock', prop: 'pool', fx: 'poop' },
    when: { age: [18, 85] },
    weight: 6,
    cooldown: 10,
    text: {
      fr: [
        "Piscine municipale, un dimanche bondé. Un étron de belle taille flotte tranquillement vers toi, comme un sous-marin en mission. Le maître-nageur te regarde. Tout le monde te regarde.",
        "Tu nages tranquillement quand tu sens quelque chose de mou te frôler {w:bodypart}. Tu te retournes. C'est marron. Ça flotte. Et une mère de famille hurle : « C'EST LUI ! » en te pointant du doigt.",
        "Bassin olympique. Quelque chose de suspect remonte à la surface pile à côté de toi. Ça sent {w:smell}. Le chronomètre du club de natation s'arrête. Trente nageurs te fixent.",
        "Aquagym du jeudi. Au milieu du cours, un « cadeau » remonte du fond, entouré d'un petit nuage. La prof, très calme, demande : « Qui ? » Tous les regards se tournent vers toi, parce que tu es nouveau{|elle}.",
      ],
      en: [
        "Public pool on a packed Sunday. A sizeable turd floats calmly toward you like a submarine on a mission. The lifeguard is looking at you. Everyone's looking at you.",
        "You're swimming peacefully when you feel something soft brush your {w:bodypart}. You turn around. It's brown. It floats. And a mom screams 'IT WAS HIM!' pointing at you.",
        "Olympic pool. Something suspicious surfaces right next to you. It smells like {w:smell}. The swim club's stopwatch stops. Thirty swimmers stare at you.",
        "Thursday aqua aerobics. Mid-class, a 'gift' rises from the bottom, surrounded by a little cloud. The very calm instructor asks: 'Who?' All eyes turn to you, because you're new.",
      ],
    },
    choices: [
      {
        label: { fr: 'L\'attraper et le croquer', en: 'Grab it and bite it' },
        out: [
          { w: 2, text: { fr: ["Je l'ai attrapé et croqué dedans devant tout le monde. C'était une barre chocolatée. Un enfant l'avait jetée pour faire une blague. Trois personnes ont vomi dans le bassin. Le bassin a été vidé. J'étais fier{|e}.", "J'ai mordu dedans comme dans Caddyshack, persuadé{|e} que c'était une barre chocolatée. Ce n'était pas une barre chocolatée. {w:swear}"], en: ["I grabbed it and bit into it in front of everyone. It was a candy bar. A kid had thrown it as a prank. Three people threw up in the pool. The pool was drained. I was proud.", "I bit into it like in Caddyshack, convinced it was a candy bar. It was not a candy bar. {w:swear}"] }, fx: { happy: 6, fame: 1, visual: 'poop' }, mood: 'happy' },
          { w: 1, text: { fr: ["Ce n'était pas une barre chocolatée. J'ai eu une gastro de dix jours et un surnom à vie. Les maîtres-nageurs m'appellent « Requin Marron ».", "J'ai croqué, persuadé{|e} de faire une blague géniale. Le goût m'a appris que je me trompais. J'ai vomi dans le bassin, ce qui a déclenché une réaction en chaîne de vomi chez quarante nageurs."], en: ["It wasn't a candy bar. I got a ten-day stomach bug and a lifelong nickname. The lifeguards call me 'Brown Shark'.", "I bit, convinced I was pulling off a genius joke. The taste taught me otherwise. I threw up in the pool, triggering a chain reaction of vomit among forty swimmers."] }, fx: { health: -10, disease: 'gastro', happy: -6, visual: 'poop' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Accuser un gamin', en: 'Blame a kid' }, text: { fr: ["J'ai pointé un enfant au hasard : « C'est lui ! » Sa mère l'a sorti de l'eau en lui tirant l'oreille. L'enfant m'a regardé{|e} avec une haine qu'on ne voit que dans les westerns. Il se vengera dans vingt ans.", "J'ai accusé le petit gros avec des brassards. Tout le monde m'a cru{|e}. Même lui, à la fin, a commencé à douter. J'ai l'impression d'avoir créé un super-vilain."], en: ["I pointed at a random kid: 'It was him!' His mom pulled him out by the ear. The kid looked at me with a hatred you only see in westerns. He'll get revenge in twenty years.", "I blamed the chubby kid with the armbands. Everyone believed me. Even he started to doubt himself. I feel like I created a supervillain."] }, fx: { karma: -6, happy: 4 } },
      { label: { fr: 'Fuir en crawl', en: 'Flee doing the crawl' }, text: { fr: ["J'ai fui en crawl si vite que j'ai battu le record du club. L'entraîneur m'a proposé une licence. J'ai refusé : je ne retournerai jamais dans cette eau.", "J'ai crawlé comme un dauphin sous cocaïne. Derrière moi, la foule a créé un tsunami de panique. Le maître-nageur a sorti l'épuisette, l'air las. Ce n'était pas sa première fois."], en: ["I fled doing the crawl so fast I broke the club record. The coach offered me a membership. I refused: I'm never going back in that water.", "I swam like a dolphin on espresso. Behind me, the crowd created a tsunami of panic. The lifeguard grabbed the net, weary. It wasn't his first time."] }, fx: { athletic: 3, happy: 2 } },
    ],
  },

  // ── Toilettes d'avion ──
  {
    id: 'tr_plane_toilet',
    icon: '✈️',
    cat: 'trash',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'plane', fx: 'poop' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Vol low cost de six heures. Tu es assis{|e} sur les toilettes de l'avion quand tu appuies sur la chasse sans te lever. L'aspiration sous vide se referme sur toi comme la bouche d'un trou noir.",
        "Turbulences pile pendant que tu es aux toilettes de l'avion. Le contenu de la cuvette se soulève en apesanteur, comme dans un documentaire de la NASA. Une goutte flotte vers ton visage.",
        "File d'attente devant l'unique toilette de l'avion. Celui qui en sort a laissé {w:smell} et {w:gross} sur le lavabo. Ton tour. Le voyant « attachez vos ceintures » s'allume.",
        "Tu t'es enfermé{|e} dans les toilettes de l'avion avec ton ou ta partenaire pour rejoindre le « club des 10 000 mètres ». L'hôtesse frappe. Le loquet est coincé. L'avion entame sa descente.",
      ],
      en: [
        "Six-hour budget flight. You're sitting on the airplane toilet when you hit flush without getting up. The vacuum seals onto you like the mouth of a black hole.",
        "Turbulence right while you're in the airplane bathroom. The bowl's contents lift in zero gravity like a NASA documentary. A droplet floats toward your face.",
        "Line in front of the only airplane toilet. The guy who comes out left {w:smell} and {w:gross} on the sink. Your turn. The seatbelt sign lights up.",
        "You locked yourself in the airplane bathroom with your partner to join the 'mile high club'. The flight attendant knocks. The latch is stuck. The plane starts its descent.",
      ],
    },
    choices: [
      {
        label: { fr: 'Forcer pour sortir', en: 'Force my way out' },
        out: [
          { w: 2, text: { fr: ["J'ai tiré, la cuvette a lâché avec un « SCHLOUP » de ventouse de plombier. Une partie de ma fesse est restée à 10 000 mètres. Elle survole sans doute {w:far_place} en ce moment.", "J'ai forcé la porte, je suis sorti{|e} le pantalon aux chevilles devant tout le chariot repas. L'hôtesse a demandé « Poulet ou poisson ? » sans ciller. Professionnelle."], en: ["I pulled, the bowl let go with a plunger 'SHLOOP'. Part of my butt cheek stayed at 30,000 feet. It's probably flying over {w:far_place} right now.", "I forced the door, stumbled out with my pants at my ankles in front of the meal cart. The flight attendant asked 'Chicken or fish?' without blinking. Professional."] }, fx: { health: -5, happy: -6, visual: 'poop' }, mood: 'shock' },
          { w: 1, text: { fr: ["La porte a cédé pendant une turbulence. J'ai été projeté{|e} dans l'allée, avec tout ce qui flottait. Le pilote a annoncé : « Mesdames et messieurs, nous traversons une zone… de merde. » Rire général.", "J'ai poussé si fort que la porte s'est décrochée. Le contenu de la cuvette a suivi le mouvement. Le rang 23 a eu droit à une douche que personne n'avait commandée."], en: ["The door gave during turbulence. I was thrown into the aisle along with everything floating. The pilot announced: 'Ladies and gentlemen, we're crossing a zone of... crap.' Everyone laughed.", "I pushed so hard the door came off. The bowl's contents followed through. Row 23 got a shower nobody ordered."] }, fx: { happy: -8, karma: -2, visual: 'poop' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Appeler l\'hôtesse', en: 'Call the flight attendant' }, text: { fr: ["J'ai sonné. L'hôtesse est arrivée avec un pied-de-biche et un sourire figé. Elle m'a décroché{|e} en disant : « Troisième fois cette semaine. » On m'a offert un parfum duty-free pour mon silence.", "L'hôtesse a ouvert, a vu la scène et a refermé. Elle est revenue avec le copilote et {w:object}. Je n'ai pas compris l'objet. Ça a marché quand même."], en: ["I rang. The flight attendant arrived with a crowbar and a frozen smile. She unstuck me, saying: 'Third time this week.' They gave me a duty-free perfume for my silence.", "The flight attendant opened, saw the scene and closed it again. She came back with the copilot and {w:object}. I didn't understand the object. It worked anyway."] }, fx: { happy: 2, stress: 4 } },
      { label: { fr: 'Accepter mon destin', en: 'Accept my fate' }, text: { fr: ["Je suis resté{|e} assis{|e} jusqu'à l'atterrissage. Les passagers ont fait la queue devant la porte, puis ont abandonné. Un enfant a glissé un mot sous la porte : « Courage. »", "J'ai attendu. Six heures. J'ai lu le magazine de la compagnie trois fois. Je connais maintenant tous les parfums duty-free par cœur, et {w:song} à force de l'entendre."], en: ["I stayed seated until landing. Passengers lined up outside the door, then gave up. A kid slipped a note under the door: 'Hang in there.'", "I waited. Six hours. I read the in-flight magazine three times. I now know every duty-free perfume by heart, and {w:song} from hearing it so much."] }, fx: { stress: 6, happy: -3 } },
    ],
  },

  // ── Éternuement sur la pièce montée ──
  {
    id: 'tr_cake_sneeze',
    icon: '🤧',
    cat: 'trash',
    rating: 2,
    scene: { place: 'party', mood: 'shock', prop: 'cake' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 10,
    text: {
      fr: [
        "Mariage de ta cousine. On te demande de tenir la pièce montée pendant la photo. Ton rhume des foins choisit ce moment précis. Tu sens arriver l'éternuement du siècle.",
        "Gâteau d'anniversaire de ton patron, 60 bougies. Tu te penches pour l'aider à souffler. Une crotte de nez grosse comme {w:food} se décroche pile au-dessus de la crème.",
        "Baptême chez ta belle-famille. Tu as un rhume monstrueux et tu es chargé{|e} de servir le gâteau. Ton nez coule comme un robinet. La belle-mère te regarde comme {w:animal} qui va mordre.",
        "Tu es au buffet d'un cocktail chic. Il y a {w:food} et une fontaine de chocolat. Ton nez te chatouille violemment. Une ministre tend son verre vers la fontaine juste à côté de toi.",
      ],
      en: [
        "Your cousin's wedding. They ask you to hold the wedding cake for the photo. Your hay fever chooses that exact moment. You feel the sneeze of the century coming.",
        "Your boss's birthday cake, 60 candles. You lean in to help him blow them out. A booger the size of {w:food} comes loose right over the frosting.",
        "Christening at your in-laws'. You have a monster cold and you're in charge of serving the cake. Your nose is running like a faucet. Your mother-in-law watches you like {w:animal} about to bite.",
        "You're at the buffet of a fancy cocktail party. There's {w:food} and a chocolate fountain. Your nose tickles violently. A government minister holds her glass out to the fountain right next to you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Éternuer en se retournant', en: 'Turn and sneeze' },
        out: [
          { w: 2, text: { fr: ["Je me suis retourné{|e} pour éternuer… pile sur la mariée. Une giclée verte a traversé son voile comme un filet de pêche. La photo est encadrée chez ses parents. Elle est floue, heureusement.", "Je me suis retourné{|e}, l'éternuement a atterri sur le prêtre. Il a béni le moment, résigné. {w:swear}"], en: ["I turned to sneeze... right onto the bride. A green spray went through her veil like a fishing net. The photo is framed at her parents' house. It's blurry, thankfully.", "I turned around, and the sneeze landed on the priest. He blessed the moment, resigned. {w:swear}"] }, fx: { happy: -4, karma: -1, looks: -2 }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai réussi à éternuer dans mon coude. Le seul problème : la pièce montée était dans ce bras-là. Elle a volé sur trois mètres et s'est écrasée sur le DJ. Il a lancé {w:song} pour détendre l'atmosphère.", "Éternuement dans le coude, ok. Mais l'effort m'a fait lâcher un pet sonore. Le photographe a dit : « Parfait, on la refait. »"], en: ["I managed to sneeze into my elbow. Only problem: the cake was in that arm. It flew ten feet and splattered on the DJ. He put on {w:song} to lighten the mood.", "Sneezed into the elbow, fine. But the effort made me let out a loud fart. The photographer said: 'Perfect, let's do it again.'"] }, fx: { happy: 2, stress: 3 } },
        ],
      },
      { label: { fr: 'Éternuer dans le gâteau', en: 'Sneeze into the cake' }, text: { fr: ["J'ai éternué dans la crème, à pleine puissance. Un cratère est apparu, décoré de mes microbes. J'ai lissé avec le doigt et servi les parts. Tout le monde a adoré. Trois personnes ont eu la grippe.", "Atchoum dans le gâteau. J'ai rajouté des pépites de chocolat par-dessus pour camoufler. La belle-mère a repris deux fois. Elle a été malade quinze jours. Je n'ai aucun regret."], en: ["I sneezed into the frosting at full blast. A crater appeared, decorated with my germs. I smoothed it with my finger and served the slices. Everyone loved it. Three people caught the flu.", "Achoo into the cake. I added chocolate chips on top to cover it. My mother-in-law had seconds. She was sick for two weeks. I regret nothing."] }, fx: { karma: -6, happy: 6 }, mood: 'happy' },
      { label: { fr: 'Me pincer le nez à mort', en: 'Pinch my nose hard' }, out: [
        { w: 2, text: { fr: ["J'ai bloqué l'éternuement. La pression est ressortie par les oreilles avec un sifflement de cocotte-minute. J'entends un acouphène en si bémol depuis.", "Je me suis pincé le nez si fort que l'éternuement est ressorti par les yeux. Mes globes oculaires ont fait « bloup » et sont revenus en place. J'ai vu Jésus, puis ma cousine, déçue."], en: ["I blocked the sneeze. The pressure came out through my ears with a pressure-cooker whistle. I've had tinnitus in B-flat ever since.", "I pinched my nose so hard the sneeze came out through my eyes. My eyeballs went 'bloop' and popped back in. I saw Jesus, then my cousin, disappointed."] }, fx: { health: -4, disease: 'ear_infection' }, mood: 'shock' },
        { w: 1, text: { fr: ["J'ai tenu. Personne n'a rien vu. J'ai passé le reste du mariage avec un nez qui gouttait discrètement dans mon champagne. Personne n'est parfait.", "J'ai retenu l'éternuement, il est sorti par l'autre côté. Un pet de concours. Le gâteau est indemne, ma réputation non."], en: ["I held it. Nobody noticed. I spent the rest of the wedding with my nose quietly dripping into my champagne. Nobody's perfect.", "I held back the sneeze; it came out the other end. A champion fart. The cake survived, my reputation didn't."] }, fx: { happy: 1 } },
      ] },
    ],
  },

  // ── Bouton qui explose sur l'écran du patron ──
  {
    id: 'tr_zit_boss',
    icon: '🔴',
    cat: 'trash',
    rating: 2,
    actor: 'boss',
    scene: { place: 'office', mood: 'shock', prop: 'computer' },
    when: { age: [18, 65], job: true },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Tu as un bouton sur le menton, gros comme une cerise, prêt à exploser. {a.first}, ton {a:patron|patronne}, te convoque et te demande de te pencher sur son écran pour voir un tableau Excel. Tout près. Trop près.",
        "Réunion en tête-à-tête avec {a.first}. Ton furoncle au front pulse comme un cœur. Tu le grattes nerveusement. Il émet un léger {w:sound}.",
        "{a.first} t'humilie devant tout le monde en t'accusant d'avoir « une hygiène douteuse ». Ironie : tu as un bouton énorme sur le nez, et {a:il|elle} est juste en face de toi, la bouche ouverte.",
        "Pause café. Tu te regardes dans le reflet de la machine : un bouton blanc géant te fixe. Tu appuies un peu. Pile à ce moment, {a.first} se penche pour prendre {w:drink}.",
      ],
      en: [
        "You have a zit on your chin, big as a cherry, ready to blow. {a.first}, your boss, calls you in and asks you to lean over their screen to look at a spreadsheet. Close. Too close.",
        "One-on-one meeting with {a.first}. The boil on your forehead is pulsing like a heart. You scratch it nervously. It emits a faint {w:sound}.",
        "{a.first} humiliates you in front of everyone, accusing you of 'questionable hygiene'. Irony: you have a huge zit on your nose, and they're right in front of you, mouth open.",
        "Coffee break. You look at your reflection in the machine: a giant whitehead stares back. You press a little. Right then, {a.first} leans in to grab {w:drink}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le percer, maintenant', en: 'Pop it, now' },
        out: [
          { w: 2, text: { fr: ["Je l'ai pressé. Un jet de pus a traversé la pièce comme un tir de sniper et s'est collé pile sur le front de {a.first}. {a:Il|Elle} a cru que c'était de la mayonnaise. {a:Il|Elle} l'a goûté.", "J'ai appuyé. Le bouton a giclé sur l'écran de {a.first}, en plein sur la colonne « Augmentations ». La cellule est désormais illisible. Personne n'a été augmenté cette année."], en: ["I squeezed it. A jet of pus crossed the room like a sniper shot and landed right on {a.first}'s forehead. They thought it was mayonnaise. They tasted it.", "I pressed. The zit squirted onto {a.first}'s screen, right on the 'Raises' column. The cell is now unreadable. Nobody got a raise this year."] }, fx: { happy: 10, karma: -3, rel: -10, looks: 2 }, mood: 'happy' },
          { w: 1, text: { fr: ["Le bouton a résisté, puis cédé d'un coup avec du sang. J'ai repeint le clavier de {a.first}. {a:Il|Elle} a appelé les ressources humaines pour « agression biologique ». Je suis sous avertissement.", "J'ai pressé, rien. J'ai pressé plus fort. Mon nez a saigné à gros bouillons sur le contrat que {a.first} allait signer avec le client. Le client a trouvé ça « authentique ». Contrat signé."], en: ["The zit resisted, then gave all at once, with blood. I repainted {a.first}'s keyboard. They called HR for 'biological assault'. I'm on a warning.", "I squeezed, nothing. I squeezed harder. My nose bled buckets onto the contract {a.first} was about to sign with a client. The client found it 'authentic'. Contract signed."] }, fx: { perf: -8, happy: 3, rel: -6, visual: 'gore' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Le cacher avec un post-it', en: 'Cover it with a Post-it' }, text: { fr: ["J'ai collé un post-it jaune sur le bouton. {a.first} n'a rien dit pendant toute la réunion. Le soir, j'ai décollé le post-it : le bouton était dessus, comme un fossile.", "J'ai mis un post-it marqué « Urgent ». Tout le monde l'a lu. Trois collègues m'ont demandé de quoi il s'agissait. J'ai répondu : « Confidentiel. »"], en: ["I stuck a yellow Post-it over the zit. {a.first} said nothing the whole meeting. In the evening, I peeled it off: the zit was on it, like a fossil.", "I stuck on a Post-it marked 'Urgent'. Everyone read it. Three coworkers asked what it was about. I said: 'Confidential.'"] }, fx: { happy: 2, perf: 2 } },
      { label: { fr: 'Le lui montrer fièrement', en: 'Show it off proudly' }, text: { fr: ["J'ai désigné mon bouton : « Regardez, c'est votre management qui m'a fait ça. » {a.first} est resté{a:|e} sans voix. Les collègues ont applaudi. Le bouton a eu plus de respect que moi en cinq ans.", "Je l'ai montré à {a.first} : « Il s'appelle {w:nickname}. Il est plus productif que vous. » J'ai fait rire tout l'open space. J'ai un entretien disciplinaire lundi."], en: ["I pointed at my zit: 'Look, your management did this to me.' {a.first} was speechless. Coworkers applauded. The zit earned more respect than I did in five years.", "I showed it to {a.first}: 'His name is {w:nickname}. He's more productive than you.' The whole open space laughed. I have a disciplinary meeting Monday."] }, fx: { happy: 8, perf: -6, rel: -8 }, mood: 'proud' },
    ],
  },

  // ── Huîtres de la honte ──
  {
    id: 'tr_oysters',
    icon: '🦪',
    cat: 'trash',
    rating: 2,
    scene: { place: 'beach', mood: 'sick', prop: 'oysters', fx: 'poop' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Une cabane de bord de route vend « 24 huîtres + 1 litre de blanc = 5 € ». Les huîtres sont tièdes, elles ont l'air de te juger. Une mouette refuse d'y toucher. Tu as faim.",
        "Buffet à volonté « Mer et Merveilles », dernier service. Les huîtres sont sorties depuis 15 h, {w:weather}. L'une d'elles bouge encore. Ou c'est autre chose qui bouge dedans.",
        "Ton beau-père a ramassé des moules sur un rocher près de la sortie des égouts. « C'est bio », dit-il. Elles sentent {w:smell}. Il t'en tend une pleine assiette.",
        "Au marché, un poissonnier louche te propose des huîtres « de la veille, ou de l'avant-veille, ou de la semaine dernière ». Prix cassé. Ton estomac te supplie de dire non.",
      ],
      en: [
        "A roadside shack sells '24 oysters + 1 litre of white wine = $5'. The oysters are lukewarm and seem to judge you. A seagull refuses to touch them. You're hungry.",
        "'Sea and Wonders' all-you-can-eat buffet, last service. The oysters have been out since 3 p.m., {w:weather}. One of them is still moving. Or something inside it is.",
        "Your father-in-law gathered mussels from a rock near the sewer outlet. 'It's organic,' he says. They smell like {w:smell}. He hands you a full plate.",
        "At the market, a shady fishmonger offers you oysters 'from yesterday, or the day before, or last week'. Rock-bottom price. Your stomach begs you to say no.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout gober', en: 'Slurp them all' },
        out: [
          { w: 3, text: { fr: ["J'ai tout gobé. Trois heures plus tard, j'ai vécu une expérience mystique : j'ai vomi et fait l'inverse en même temps, dans une baignoire, en pleurant. On parle d'un phénomène physique que la science n'explique pas.", "J'ai mangé les 24. Le soir, mon corps a expulsé chaque huître par l'issue de secours la plus proche, à des vitesses supersoniques. Le carrelage de ma salle de bain a dû être changé."], en: ["I slurped them all. Three hours later I had a mystical experience: I threw up and did the opposite at the same time, in a bathtub, crying. A physical phenomenon science cannot explain.", "I ate all 24. That night my body expelled each oyster through the nearest emergency exit at supersonic speeds. My bathroom tiles had to be replaced."] }, fx: { health: -12, disease: 'food_poisoning', happy: -8, weight: -0.03, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: ["Miracle : rien. Mon estomac est une forteresse. Le beau-père, lui, a passé la nuit aux urgences. Il a juré que c'était à cause du vin. On sait tous que non.", "J'ai tout mangé et je n'ai rien eu. J'ai trouvé une perle dans la dernière. Elle était fausse, mais j'étais vivant{|e}, alors j'ai pleuré de joie."], en: ["Miracle: nothing. My stomach is a fortress. My father-in-law spent the night in the ER. He swore it was the wine. We all know it wasn't.", "I ate them all and nothing happened. I found a pearl in the last one. It was fake, but I was alive, so I cried with joy."] }, fx: { happy: 8, health: 2 }, mood: 'happy' },
        ],
      },
      { label: { fr: 'En faire manger à mon ennemi', en: 'Feed them to a rival' }, text: { fr: ["J'ai offert le plateau à mon voisin insupportable, « en cadeau de réconciliation ». Il a passé quatre jours collé aux toilettes. On l'entendait à travers le mur. C'était comme une symphonie.", "J'ai emballé les huîtres et je les ai déposées chez ce {w:insult} de collègue qui vole mes yaourts. Il ne vole plus rien. Il ne sort plus de chez lui."], en: ["I gave the platter to my unbearable neighbour 'as a peace offering'. He spent four days glued to his toilet. We heard him through the wall. It was like a symphony.", "I wrapped the oysters and dropped them at the place of that {w:insult} coworker who steals my yogurts. He doesn't steal anymore. He doesn't leave his home anymore."] }, fx: { karma: -6, happy: 10 }, mood: 'happy' },
      { label: { fr: 'Nourrir la mouette', en: 'Feed the seagull' }, text: { fr: ["J'ai donné une huître à la mouette. Elle l'a avalée, a fait trois pas, a vomi, et s'est envolée en zigzag. Elle a lâché un missile blanc sur la cabane en partant. Justice.", "La mouette a mangé l'huître et a eu une diarrhée aérienne sur un cabriolet décapoté. Le conducteur a hurlé {w:swear} Moi, je mangeais une gaufre, en paix."], en: ["I gave the seagull an oyster. It swallowed it, took three steps, threw up, and flew off zigzagging. It dropped a white missile on the shack as it left. Justice.", "The seagull ate the oyster and had airborne diarrhoea all over a convertible. The driver screamed {w:swear} I ate a waffle, in peace."] }, fx: { happy: 6 } },
    ],
  },

  // ── Squat et legging blanc ──
  {
    id: 'tr_gym_shart',
    icon: '🏋️',
    cat: 'trash',
    rating: 2,
    scene: { place: 'stadium', mood: 'shock', prop: 'barbell', fx: 'poop' },
    when: { age: [18, 65] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Salle de sport bondée. Tu tentes un squat à 100 kilos en legging blanc, devant le miroir et devant le coach le plus canon de la ville. Tu as mangé {w:food} il y a vingt minutes. Mauvaise idée.",
        "Squat lourd. Le coach crie « POUSSE ! POUSSE ! ». Tu pousses. Tu sens quelque chose qui pousse aussi, mais pas dans le bon sens.",
        "Cours collectif de fessiers. La prof hurle « CONTRACTEZ ! ». Tout le monde est collé, en rangées, face au miroir. Ton ventre émet {w:sound}. Ta voisine de tapis tourne la tête.",
        "Tu es au soulevé de terre, rouge comme une tomate. Derrière toi, un influenceur fitness filme sa séance pour 300 000 abonnés. Ton intestin a un plan.",
      ],
      en: [
        "Packed gym. You attempt a 220-pound squat in white leggings, in front of the mirror and the hottest coach in town. You ate {w:food} twenty minutes ago. Bad idea.",
        "Heavy squat. The coach yells 'PUSH! PUSH!'. You push. You feel something else pushing too, but not in the right direction.",
        "Glutes class. The instructor screams 'SQUEEZE!'. Everyone's packed in rows facing the mirror. Your stomach makes {w:sound}. The woman on the next mat turns her head.",
        "You're deadlifting, red as a tomato. Behind you, a fitness influencer is filming his session for 300,000 followers. Your gut has a plan.",
      ],
    },
    choices: [
      {
        label: { fr: 'Pousser quand même', en: 'Push anyway' },
        out: [
          { w: 2, text: { fr: ["J'ai poussé. J'ai validé les 100 kilos. Et autre chose. Mon legging blanc a pris une teinte « café crème » en direct dans le miroir. L'influenceur a crié {w:swear} et la vidéo a fait 4 millions de vues.", "J'ai poussé, ça a lâché. Un bruit de klaxon mouillé a résonné dans toute la salle. Le coach a baissé les yeux, la musique s'est arrêtée. J'ai reposé la barre et je suis parti{|e} à reculons."], en: ["I pushed. I hit the 220 pounds. And something else. My white leggings turned 'latte' live in the mirror. The influencer yelled {w:swear} and the video got 4 million views.", "I pushed, it gave. A wet honk echoed through the whole gym. The coach looked down, the music stopped. I put the bar back and walked out backward."] }, fx: { happy: -12, followers: 2000, athletic: 2, visual: 'poop' }, mood: 'cry' },
          { w: 1, text: { fr: ["J'ai poussé. Juste un pet, mais un pet de légende, qui a fait trembler les haltères. Le coach m'a regardé{|e} avec respect : « Ça, c'est de la puissance. » Il m'a demandé mon numéro.", "Pet monumental pendant la remontée. Toute la salle a applaudi, comme pour un record. J'ai salué. C'était le plus beau jour de ma vie de sportif{|ve}."], en: ["I pushed. Just a fart, but a legendary fart that shook the dumbbells. The coach looked at me with respect: 'That's power.' He asked for my number.", "Monumental fart on the way up. The whole gym applauded, like for a record. I bowed. Best day of my athletic life."] }, fx: { happy: 10, athletic: 3 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Abandonner et courir', en: 'Drop it and run' }, text: { fr: ["J'ai lâché la barre, qui a roulé sur le pied d'un bodybuilder. Il a hurlé comme un bébé. J'ai couru aux toilettes. Elles étaient occupées par trois mecs qui se faisaient des piqûres. J'ai improvisé dans la douche.", "J'ai tout lâché et sprinté vers les vestiaires en serrant les fesses comme si je tenais un billet de 500. J'ai atteint les toilettes. Mon meilleur chrono de l'année."], en: ["I dropped the bar, which rolled onto a bodybuilder's foot. He screamed like a baby. I ran to the bathroom. It was occupied by three guys giving each other injections. I improvised in the shower.", "I dropped everything and sprinted to the locker room, clenching like I was holding a $500 bill. I made it to the toilet. My best time of the year."] }, fx: { happy: 2, athletic: 1, karma: -1 } },
    ],
  },

  // ── Kebab de 3 h du matin ──
  {
    id: 'tr_kebab_3am',
    icon: '🥙',
    cat: 'trash',
    rating: 2,
    scene: { place: 'park', mood: 'sick', prop: 'kebab' },
    when: { age: [18, 70] },
    weight: 7,
    cooldown: 8,
    text: {
      fr: [
        "3 h du matin, sortie de boîte. Le seul kebab ouvert s'appelle « Chez Momo l'Inspecteur Sanitaire ». La broche tourne depuis 2019. Une patte dépasse de la viande. Une patte à quatre doigts.",
        "Tu as commandé un kebab « spécial maison ». Le cuisinier a mis {w:food} dedans, puis une sauce verte non identifiée. Quelque chose a bougé sous la salade. Tu es trop bourré{|e} pour avoir peur.",
        "Le kebab de l'angle n'a jamais été inspecté. Le cuisinier gratte la broche avec la même spatule que celle qu'il utilise pour se gratter le dos. Il te tend ton sandwich. Il est tiède. Il palpite.",
        "Au fond de ton kebab, tu trouves {w:gross}. Le patron hausse les épaules : « C'est le goût de la maison. » Il est 4 h, il pleut, et tu as très faim.",
      ],
      en: [
        "3 a.m., leaving the club. The only kebab shop open is called 'Momo the Health Inspector'. The spit has been turning since 2019. A paw sticks out of the meat. A four-fingered paw.",
        "You ordered a 'house special' kebab. The cook put {w:food} in it, then an unidentified green sauce. Something moved under the lettuce. You're too drunk to be scared.",
        "The corner kebab shop has never been inspected. The cook scrapes the spit with the same spatula he uses to scratch his back. He hands you your sandwich. It's lukewarm. It's throbbing.",
        "At the bottom of your kebab you find {w:gross}. The owner shrugs: 'That's the house flavour.' It's 4 a.m., it's raining, and you're very hungry.",
      ],
    },
    choices: [
      {
        label: { fr: 'Manger, c\'est la vie', en: 'Eat it, YOLO' },
        out: [
          { w: 2, text: { fr: ["J'ai tout mangé. C'était le meilleur kebab de ma vie. Le lendemain, mes toilettes ont reçu un message en morse. Trois jours de feu. J'y retournerai samedi.", "J'ai mangé. Puis j'ai vomi sur un policier en VTT, qui a vomi à son tour. Une réaction en chaîne jusqu'au bout de la rue. On a fini en garde à vue, mais tous les deux soulagés."], en: ["I ate it all. Best kebab of my life. The next day my toilet received a message in Morse code. Three days of fire. I'm going back Saturday.", "I ate. Then I threw up on a bike cop, who threw up in turn. A chain reaction to the end of the street. We ended up in custody, but both relieved."] }, fx: { happy: 6, health: -8, disease: 'food_poisoning', weight: 0.02, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: ["J'ai croqué, la viande a croqué en retour. J'ai désormais une petite morsure sur la lèvre et une vraie peur des broches. Momo m'a offert le dessert pour s'excuser.", "Mon kebab contenait une dent. Pas la mienne. Momo a dit « bonne chance, c'est la fève ». J'ai gagné un kebab gratuit. Je l'ai pris à emporter. Pour mon pire ennemi."], en: ["I bit in, and the meat bit back. I now have a small bite mark on my lip and a real fear of kebab spits. Momo gave me free dessert to apologise.", "My kebab contained a tooth. Not mine. Momo said 'lucky you, that's the prize'. I won a free kebab. I took it to go. For my worst enemy."] }, fx: { happy: 2, health: -3 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Le jeter sur la vitrine', en: 'Throw it at the window' }, text: { fr: ["J'ai balancé le kebab contre la vitrine. Il a glissé lentement en laissant une trace blanche et verte, comme une limace géante. Momo est sorti avec sa broche. J'ai couru jusqu'au matin.", "Je l'ai lancé. La sauce samouraï a dessiné une œuvre abstraite sur la vitre. Un passant a pris une photo et l'a vendue en NFT. Il est millionnaire, et moi j'ai toujours faim."], en: ["I hurled the kebab at the window. It slid down slowly, leaving a white and green trail like a giant slug. Momo came out with his spit. I ran until morning.", "I threw it. The hot sauce drew an abstract masterpiece on the glass. A passerby took a picture and sold it as an NFT. He's a millionaire, and I'm still hungry."] }, fx: { happy: 4, heat: 3 } },
      { label: { fr: 'Appeler l\'hygiène', en: 'Call the health inspector' }, text: { fr: ["J'ai appelé les services d'hygiène à 4 h. On m'a répondu : « Chez Momo ? On sait. On y mange tous. » Ils ont raccroché. Je suis rentré{|e} le ventre vide et la foi brisée.", "J'ai signalé le kebab. L'inspecteur est venu le lendemain, a mangé un menu, et a mis cinq étoiles. Il a été hospitalisé le soir même."], en: ["I called the health department at 4 a.m. They said: 'Momo's? We know. We all eat there.' They hung up. I went home hungry and faithless.", "I reported the kebab shop. The inspector came the next day, ate a combo meal and gave it five stars. He was hospitalised that evening."] }, fx: { karma: 2, happy: -2 } },
    ],
  },

  // ── Doigt dans le burger ──
  {
    id: 'tr_burger_finger',
    icon: '🍔',
    cat: 'trash',
    rating: 2,
    scene: { place: 'party', mood: 'shock', prop: 'burger', fx: 'gore' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Fast-food du centre-ville. Tu croques dans ton burger « Triple Bacon Monstre » et tu sens quelque chose de dur. Tu ouvres le pain : c'est un doigt. Avec une alliance. Et du vernis rose.",
        "Au restaurant chic, ton tartare contient un ongle. Puis un deuxième. Puis un tatouage « MAMAN ». Le serveur te demande si « tout se passe bien ».",
        "Tu trouves une dent dans ton {w:food}. Le cuisinier a un trou dans le sourire. Il te fait coucou depuis la cuisine.",
        "Ta pizza livrée par {w:app} contient un pansement usagé, un cheveu de 40 cm et {w:gross}. Le livreur attend son pourboire en souriant.",
      ],
      en: [
        "Downtown fast food. You bite into your 'Triple Bacon Monster' burger and feel something hard. You open the bun: it's a finger. With a wedding ring. And pink nail polish.",
        "At a fancy restaurant, your steak tartare contains a fingernail. Then a second one. Then a tattoo that says 'MOM'. The waiter asks if 'everything is to your liking'.",
        "You find a tooth in your {w:food}. The cook has a gap in his smile. He waves at you from the kitchen.",
        "Your pizza delivered via {w:app} contains a used band-aid, a 16-inch hair and {w:gross}. The delivery guy waits for his tip, smiling.",
      ],
    },
    choices: [
      {
        label: { fr: 'Porter plainte, gros sous', en: 'Sue for big money' },
        out: [
          { w: 2, text: { fr: ["J'ai attaqué la chaîne en justice. Ils ont payé pour que je me taise, et j'ai signé un accord de confidentialité. Je ne peux rien dire. Sauf que le doigt appartenait au directeur régional.", "Procès gagné. J'ai touché un joli chèque. J'ai gardé le doigt dans un bocal, sur ma cheminée. Il sert de porte-clés à la fête des Morts."], en: ["I sued the chain. They paid me to keep quiet, I signed an NDA. I can't say anything. Except that the finger belonged to the regional manager.", "Lawsuit won. I got a nice check. I kept the finger in a jar on my mantelpiece. It doubles as a key holder on Halloween."] }, fx: { money: 15000, happy: 10, karma: -1 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai porté plainte, mais leur avocat a prouvé que le doigt était… le mien. J'avais coupé mon doigt en ouvrant mon soda sans m'en rendre compte. J'étais vraiment très bourré{|e}.", "Le juge a mangé dans le même fast-food le midi même. Il a eu une indigestion et a reporté le procès. Puis le fast-food a fermé. Puis le juge aussi."], en: ["I sued, but their lawyer proved the finger was... mine. I'd cut it off opening my soda without noticing. I was really, really drunk.", "The judge ate at the same fast-food place that very lunchtime. He got indigestion and postponed the trial. Then the restaurant closed. Then so did the judge."] }, fx: { money: -2000, happy: -6, disease: 'missing_finger' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Finir le burger quand même', en: 'Finish the burger anyway' }, text: { fr: ["J'ai mis le doigt de côté, comme un cornichon, et j'ai fini mon burger. On ne gâche pas la nourriture. J'ai mis l'alliance au clou : 300 balles.", "J'ai fini le plat. Le chef est venu me féliciter en personne. Il lui manquait un doigt. On s'est compris sans rien dire, et il m'a offert {w:drink}."], en: ["I set the finger aside like a pickle and finished my burger. Don't waste food. I pawned the ring: 300 bucks.", "I finished the meal. The chef came out to congratulate me in person. He was missing a finger. We understood each other without a word, and he offered me {w:drink}."] }, fx: { money: 300, karma: -2, health: -3 }, mood: 'neutral' },
      { label: { fr: 'Le poster en ligne', en: 'Post it online' }, text: { fr: ["J'ai posté la photo du doigt avec le hashtag #DoigtDeLaChance. 3 millions de vues. La chaîne a perdu 20 % en Bourse. Un milliardaire a vendu ses actions en catastrophe. Je suis heureux{|se}.", "J'ai filmé le doigt en train de « danser » sur {w:song}. La vidéo a explosé. La police a ouvert une enquête. Le doigt appartenait à un cuisinier licencié qui voulait se venger. Respect."], en: ["I posted a photo of the finger with #LuckyFinger. 3 million views. The chain dropped 20% on the stock market. A billionaire panic-sold his shares. I'm happy.", "I filmed the finger 'dancing' to {w:song}. The video blew up. Police opened an investigation. The finger belonged to a fired cook seeking revenge. Respect."] }, fx: { followers: 25000, fame: 3, happy: 6 }, mood: 'happy' },
    ],
  },

  // ── Frigo du coloc ──
  {
    id: 'tr_fridge_horror',
    icon: '🧫',
    cat: 'trash',
    rating: 2,
    scene: { place: 'apartment', mood: 'sick', prop: 'fridge' },
    when: { age: [18, 50] },
    weight: 6,
    cooldown: 10,
    text: {
      fr: [
        "Le frigo de la colocation n'a pas été nettoyé depuis trois ans. Au fond, un Tupperware émet {w:sound}. Le couvercle se soulève tout seul. Quelque chose de vert te fait un clin d'œil.",
        "Ton coloc est parti en Erasmus en laissant {w:food} dans le frigo. C'était il y a 14 mois. L'odeur traverse la porte fermée. Les voisins pensent qu'il y a un cadavre.",
        "Un yaourt de 2019 au fond du frigo a développé une civilisation. Tu vois des petites routes dans la moisissure. Tu crois apercevoir une église.",
        "Tu ouvres le bac à légumes : la salade a fondu en un liquide noir qui sent {w:smell}. Ton coloc te regarde : « Ne touche pas, c'est mon kombucha. »",
      ],
      en: [
        "The shared-flat fridge hasn't been cleaned in three years. At the back, a Tupperware makes {w:sound}. The lid lifts on its own. Something green winks at you.",
        "Your roommate left for a study abroad year leaving {w:food} in the fridge. That was 14 months ago. The smell gets through the closed door. The neighbours think there's a corpse.",
        "A 2019 yogurt at the back of the fridge has developed a civilisation. You can see little roads in the mould. You think you spot a church.",
        "You open the veggie drawer: the lettuce has melted into a black liquid that smells like {w:smell}. Your roommate looks at you: 'Don't touch, that's my kombucha.'",
      ],
    },
    choices: [
      {
        label: { fr: 'Goûter, par science', en: 'Taste it, for science' },
        out: [
          { w: 2, text: { fr: ["J'ai goûté. Ça avait un goût de pieds, de batterie et de regret. J'ai vu des couleurs pendant trois jours et parlé à mon grille-pain. Il m'a donné de bons conseils.", "J'ai trempé un doigt. Une seconde plus tard, mon visage est devenu vert, puis violet, puis j'ai vomi un arc-en-ciel sur le coloc. Il a dit que c'était le meilleur kombucha qu'il ait jamais fait."], en: ["I tasted it. It tasted like feet, batteries and regret. I saw colours for three days and talked to my toaster. It gave good advice.", "I dipped a finger. A second later my face went green, then purple, then I threw up a rainbow on my roommate. He said it was the best kombucha he ever made."] }, fx: { health: -8, smarts: -2, disease: 'gastro' }, mood: 'sick' },
          { w: 1, text: { fr: ["J'ai goûté et… c'était délicieux. Je me suis mis{|e} à vendre la moisissure du frigo comme « fromage artisanal vegan ». J'ai gagné 2 000 balles. Trois clients sont à l'hôpital.", "J'ai goûté, et j'ai développé une immunité totale contre tout. Je peux désormais manger {w:gross} sans broncher. C'est mon seul super-pouvoir."], en: ["I tasted it and... it was delicious. I started selling the fridge mould as 'artisanal vegan cheese'. I made 2,000 bucks. Three customers are in hospital.", "I tasted it and developed total immunity to everything. I can now eat {w:gross} without flinching. It's my only superpower."] }, fx: { money: 2000, karma: -3, health: 2 }, mood: 'happy' },
        ],
      },
      { label: { fr: 'Brûler le frigo', en: 'Burn the fridge' }, text: { fr: ["J'ai sorti le frigo sur le trottoir et je l'ai aspergé d'alcool à brûler. Il a brûlé vert. On a entendu des petits cris. Les voisins ont applaudi depuis les balcons. Les pompiers ont dit « bien joué ».", "J'ai mis le feu au Tupperware dans l'évier. La fumée a pris la forme d'un visage hurlant avant de disparaître. Je n'en parle à personne. Mon coloc a déménagé le lendemain."], en: ["I dragged the fridge onto the sidewalk and doused it with methylated spirits. It burned green. We heard little screams. Neighbours applauded from their balconies. The firefighters said 'good job'.", "I set the Tupperware on fire in the sink. The smoke took the shape of a screaming face before vanishing. I don't talk about it. My roommate moved out the next day."] }, fx: { happy: 8, heat: 4, money: -300, visual: 'fire' }, mood: 'happy' },
      { label: { fr: 'Le servir au coloc', en: 'Serve it to the roommate' }, text: { fr: ["J'ai servi le yaourt au coloc dans un joli bol avec une feuille de menthe. Il a dit « mmm, c'est maison ? ». J'ai dit oui. Techniquement, c'est vrai. Il a été absent une semaine.", "J'ai mélangé la moisissure dans les pâtes du coloc. Il a pris deux assiettes et m'a demandé la recette. Je lui ai répondu : « Le temps. »"], en: ["I served the yogurt to my roommate in a pretty bowl with a mint leaf. He said 'mmm, homemade?'. I said yes. Technically true. He was out sick for a week.", "I mixed the mould into my roommate's pasta. He had seconds and asked for the recipe. I told him: 'Time.'"] }, fx: { karma: -5, happy: 8 }, mood: 'happy' },
    ],
  },

  // ── Toilettes en éruption ──
  {
    id: 'tr_toilet_geyser',
    icon: '🚽',
    cat: 'trash',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'toilet', fx: 'poop' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Dîner chic chez toi avec tes beaux-parents. Tu tires la chasse. Un gargouillis caverneux remonte des profondeurs. L'eau monte. Puis elle continue de monter. Puis elle sort.",
        "Les toilettes de ton appart font {w:sound} depuis une heure. Tu as invité ton nouveau crush à dîner. Il ou elle vient de te demander « où sont les toilettes ? ».",
        "Panne des égouts dans tout l'immeuble. Tu es le seul à habiter au rez-de-chaussée. Le siphon de ta douche commence à faire des bulles marron qui sentent {w:smell}.",
        "Ta belle-mère est aux toilettes depuis vingt minutes. Un cri. Puis un bruit de geyser. Puis elle ressort, mouillée, avec {w:gross} sur l'épaule.",
      ],
      en: [
        "Fancy dinner at home with your in-laws. You flush. A cavernous gurgle rises from the depths. The water rises. Then keeps rising. Then comes out.",
        "Your flat's toilet has been making {w:sound} for an hour. You invited your new crush to dinner. They just asked 'where's the bathroom?'.",
        "The whole building's sewer is backed up. You're the only ground-floor tenant. Your shower drain starts bubbling brown bubbles that smell like {w:smell}.",
        "Your mother-in-law has been in the bathroom for twenty minutes. A scream. Then a geyser sound. Then she comes out, soaked, with {w:gross} on her shoulder.",
      ],
    },
    choices: [
      {
        label: { fr: 'Ventouse et courage', en: 'Plunger and courage' },
        out: [
          { w: 2, text: { fr: ["J'ai attaqué à la ventouse. Trois coups. Au quatrième, le geyser m'a frappé{|e} en plein visage, à la verticale, comme Old Faithful version égout. Le lustre en a pris aussi. Le dîner était fini.", "J'ai pompé comme un{|e} forcené{|e}. J'ai libéré le bouchon : une couche, un hamster mort et le dentier du précédent locataire. J'ai gardé le dentier. Je ne sais pas pourquoi."], en: ["I attacked with the plunger. Three pumps. On the fourth, the geyser hit me square in the face, vertically, like Old Faithful sewer edition. The chandelier got some too. Dinner was over.", "I pumped like a maniac. I freed the clog: a diaper, a dead hamster and the previous tenant's dentures. I kept the dentures. I don't know why."] }, fx: { happy: -8, looks: -3, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: ["J'ai débouché du premier coup, en héros. Mes beaux-parents ont applaudi. Mon beau-père m'a dit : « Enfin quelqu'un de manuel dans cette famille. » J'ai été intégré{|e} à la famille ce soir-là.", "Un coup de ventouse, un « gloups » et c'était réglé. J'ai mérité ma part de gâteau, et un respect nouveau au sein de la famille."], en: ["I unclogged it on the first try like a hero. My in-laws applauded. My father-in-law said: 'Finally someone handy in this family.' I was accepted into the family that night.", "One plunge, a 'glug', and done. I earned my slice of cake, and new respect within the family."] }, fx: { happy: 8, karma: 2 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Accuser le beau-père', en: 'Blame the father-in-law' }, text: { fr: ["J'ai dit : « Qui a mangé le chou à midi ? » Tout le monde a regardé mon beau-père. Il a rougi, nié, puis avoué. Il ne l'avait pas fait. Mais il était tellement sûr de lui-même que si.", "J'ai murmuré à ma belle-mère que c'était son mari. Elle a hoché la tête, résignée : « Comme en 1987. » Je ne veux pas savoir ce qui s'est passé en 1987."], en: ["I said: 'Who had cabbage for lunch?' Everyone looked at my father-in-law. He blushed, denied, then confessed. He hadn't done it. But he was so sure he had.", "I whispered to my mother-in-law that it was her husband. She nodded, resigned: 'Like in 1987.' I don't want to know what happened in 1987."] }, fx: { happy: 6, karma: -4 } },
      { label: { fr: 'Fuir par la fenêtre', en: 'Escape out the window' }, text: { fr: ["J'ai fait semblant d'aller chercher du pain et je suis parti{|e} par la fenêtre. Je suis revenu{|e} deux heures plus tard. Tout le monde était encore là, en silence, les pieds dans l'eau marron.", "J'ai sauté par la fenêtre en criant « JE REVIENS ». Je suis allé{|e} {w:to_place}. J'ai éteint mon téléphone. Ma belle-famille m'appelle maintenant « {le fugitif|la fugitive} »."], en: ["I pretended to go buy bread and left through the window. I came back two hours later. Everyone was still there, silent, feet in brown water.", "I jumped out the window yelling 'BE RIGHT BACK'. I went {w:to_place}. I turned off my phone. My in-laws now call me 'the fugitive'."] }, fx: { happy: 2, stress: -2, karma: -2 } },
    ],
  },

  // ── Concours de hot-dogs ──
  {
    id: 'tr_hotdog_contest',
    icon: '🌭',
    cat: 'trash',
    rating: 2,
    scene: { place: 'stadium', mood: 'party', prop: 'hotdog', fx: 'poop' },
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Fête du village : concours du plus gros mangeur de hot-dogs. Premier prix : {w:gift} et une coupe en plastique. Tes adversaires : un routier de 140 kilos et une mamie silencieuse qui fait peur.",
        "Le concours de hot-dogs commence. Dix minutes pour en avaler un maximum. À côté de toi, un mec a déjà vomi dans son propre seau et continue de manger. C'est un professionnel.",
        "Tu en es à ton 18e hot-dog. Ton ventre gonfle comme {w:object} sous pression. Les spectateurs scandent ton nom. Ton estomac, lui, scande « NON ».",
        "Concours de bouffe sponsorisé par {w:brand}. Le règlement autorise à tremper le pain dans l'eau. La mamie trempe dans du pastis. Elle mène 22 à 14.",
      ],
      en: [
        "Village fair: hot dog eating contest. First prize: {w:gift} and a plastic trophy. Your opponents: a 300-pound trucker and a silent, terrifying granny.",
        "The hot dog contest begins. Ten minutes to eat as many as possible. Next to you, a guy already threw up in his own bucket and keeps eating. He's a professional.",
        "You're on your 18th hot dog. Your belly is swelling like {w:object} under pressure. The crowd chants your name. Your stomach chants 'NO'.",
        "Eating contest sponsored by {w:brand}. The rules allow dipping the bun in water. The granny dips hers in pastis. She leads 22 to 14.",
      ],
    },
    choices: [
      {
        label: { fr: 'Jusqu\'à la mort', en: 'Until death' },
        out: [
          { w: 2, text: { fr: ["J'ai mangé 31 hot-dogs. Record du village. Au moment de soulever la coupe, j'ai vomi les 31 sur le maire, en un seul jet continu, comme une lance à incendie. Il a remis la coupe quand même, trempé.", "Au 25e hot-dog, mon ventre a fait un bruit de ballon de baudruche. J'ai gagné, puis j'ai pété si fort que la tente du concours s'est envolée."], en: ["I ate 31 hot dogs. Village record. As I raised the trophy, I threw up all 31 on the mayor in one continuous stream, like a fire hose. He handed over the trophy anyway, drenched.", "At hot dog 25, my belly made a balloon noise. I won, then farted so hard the contest tent blew away."] }, fx: { happy: 10, health: -6, weight: 0.03, fame: 1, visual: 'poop' }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai perdu contre la mamie. 41 à 29. Elle a mangé le dernier hot-dog en me regardant dans les yeux, sans cligner. J'ai vomi de peur, et un peu par respect.", "La mamie m'a battu{|e}, puis elle a mangé mon seau de restes. Je pense qu'elle n'est pas humaine. Je pense que c'est une légende urbaine."], en: ["I lost to the granny. 41 to 29. She ate the last hot dog staring me in the eyes, unblinking. I threw up from fear, and a little out of respect.", "The granny beat me, then she ate my leftover bucket. I don't think she's human. I think she's an urban legend."] }, fx: { happy: -4, health: -4, weight: 0.02 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Tricher, cacher dans les poches', en: 'Cheat, hide them in pockets' }, text: { fr: ["J'ai caché 12 hot-dogs dans mon pantalon. J'ai gagné. Au moment de monter sur le podium, ils sont tous tombés, un par un, comme des saucisses de clown. Le chien du maire s'est servi.", "J'ai planqué des hot-dogs dans mon soutif, dans mes chaussettes et dans {w:object}. J'ai été disqualifié{|e}, mais j'ai mangé pendant une semaine."], en: ["I hid 12 hot dogs in my pants. I won. As I climbed the podium, they all fell out one by one like clown sausages. The mayor's dog helped himself.", "I stashed hot dogs in my bra, my socks and {w:object}. I got disqualified, but I ate for a week."] }, fx: { happy: 6, karma: -3 } },
    ],
  },

  // ── Défi du piment ──
  {
    id: 'tr_chili_challenge',
    icon: '🌶️',
    cat: 'trash',
    rating: 2,
    scene: { place: 'party', mood: 'sick', prop: 'chili', fx: 'fire' },
    when: { age: [18, 70] },
    weight: 5,
    cooldown: 15,
    text: {
      fr: [
        "Un restaurant propose le défi « Piment de l'Enfer » : manger un Carolina Reaper entier sans boire. Gagnant : photo au mur. Perdants : photo au mur aussi, mais en larmes.",
        "Ton pote a acheté sur internet une sauce piquante de 9 millions de Scoville. L'étiquette montre une tête de mort qui pleure. Il en met une goutte sur {w:food} et te le tend.",
        "Défi entre collègues : le piment le plus fort du monde, filmé pour les réseaux. Ton chef est déjà rouge, en sueur, et vient de pleurer du sang. Ton tour.",
        "Soirée tacos. L'hôte a mis « un peu » de sauce de sa grand-mère mexicaine. Ta première bouchée te fait voir {w:celeb} en tenue de diable qui te fait coucou.",
      ],
      en: [
        "A restaurant offers the 'Hell Pepper' challenge: eat a whole Carolina Reaper without drinking. Winner: photo on the wall. Losers: photo on the wall too, but crying.",
        "Your buddy bought a 9-million-Scoville hot sauce online. The label shows a crying skull. He puts a drop on {w:food} and hands it to you.",
        "Office challenge: the hottest pepper in the world, filmed for socials. Your boss is already red, sweating, and just cried blood. Your turn.",
        "Taco night. The host added 'a little' of his Mexican grandma's sauce. Your first bite makes you see {w:celeb} dressed as the devil, waving at you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout croquer d\'un coup', en: 'Eat it in one bite' },
        out: [
          { w: 3, text: { fr: ["J'ai croqué. Mes oreilles ont sifflé comme une bouilloire, mes yeux ont pleuré de la lave. Le lendemain, aux toilettes, j'ai compris le sens du mot « apocalypse ». Mon cul a craché des flammes comme un dragon.", "J'ai tout mangé. J'ai perdu la vue dix minutes et vomi une flamme bleue. Les voisins de table ont reculé. J'ai ma photo au mur, en larmes, avec de la morve jusqu'au menton."], en: ["I bit. My ears whistled like a kettle, my eyes cried lava. The next day on the toilet I understood the meaning of 'apocalypse'. My butt breathed fire like a dragon.", "I ate it all. I went blind for ten minutes and threw up a blue flame. The next table backed away. My photo's on the wall, crying, with snot down to my chin."] }, fx: { health: -8, happy: 4, disease: 'hemorrhoids', visual: 'fire' }, mood: 'cry' },
          { w: 1, text: { fr: ["J'ai croqué et j'ai pris feu. Littéralement. Combustion spontanée. Il ne restait de moi qu'une paire de baskets fumantes et un petit tas de cendres qui sentait le chili. Ma photo est au mur. En urne.", "Le piment a fait fondre mon estomac comme de l'acide dans un film d'horreur. J'ai fumé des oreilles et explosé en feu d'artifice rouge. Le resto a renommé le plat en mon honneur."], en: ["I bit and caught fire. Literally. Spontaneous combustion. All that remained was a pair of smoking sneakers and a little pile of chili-scented ash. My photo's on the wall. In an urn.", "The pepper melted my stomach like acid in a horror movie. Smoke came out of my ears and I exploded in red fireworks. The restaurant renamed the dish in my honour."] }, fx: { die: { fr: "en combustion spontanée après le défi du Piment de l'Enfer", en: 'by spontaneous combustion after the Hell Pepper challenge' }, visual: 'fire' } },
        ],
      },
      { label: { fr: 'Le mettre dans le plat du chef', en: 'Slip it in the boss\'s plate' }, text: { fr: ["J'ai glissé la sauce dans le plat de mon chef. Il a croqué, a tourné rouge, puis violet, puis il a couru vers la fontaine en arrachant sa cravate. Il est en arrêt maladie. Ambiance au bureau : excellente.", "J'ai mis trois gouttes dans son café. Il a craché le café sur le PDG. Le PDG l'a viré sur place. Je suis désormais responsable d'équipe. Le piment, c'est la vie."], en: ["I slipped the sauce into my boss's plate. He bit, turned red, then purple, then ran to the water fountain tearing off his tie. He's on sick leave. Office mood: excellent.", "I put three drops in his coffee. He spat the coffee on the CEO. The CEO fired him on the spot. I'm now team lead. Chili is life."] }, fx: { happy: 10, karma: -5 }, mood: 'happy' },
      { label: { fr: 'Refuser comme un adulte', en: 'Decline like an adult' }, text: { fr: ["J'ai refusé. Tout le monde m'a traité{|e} de petite nature. Le lendemain, tout le monde était aux toilettes sauf moi. Qui rit maintenant, {w:insult} ?", "J'ai refusé poliment et commandé {w:food}. J'ai regardé les autres pleurer de la lave en mangeant tranquillement. Spectacle parfait."], en: ["I declined. Everyone called me a wimp. The next day, everyone was on the toilet except me. Who's laughing now, {w:insult}?", "I politely declined and ordered {w:food}. I watched the others cry lava while eating peacefully. Perfect show."] }, fx: { happy: 4, smarts: 1 } },
    ],
  },

  // ── Épilation intégrale ratée ──
  {
    id: 'tr_wax_fail',
    icon: '🍯',
    cat: 'trash',
    rating: 2,
    scene: { place: 'studio', mood: 'shock', prop: 'wax' },
    when: { age: [18, 65] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Institut de beauté « Lisse comme un Dauphin ». Tu as réservé une épilation intégrale, au maillot. L'esthéticienne est stagiaire, c'est son premier jour, et la cire fume comme {w:food} oubliée sur le feu.",
        "Ton ou ta partenaire t'a offert une épilation intégrale « pour pimenter les choses ». L'esthéticienne étale la cire bouillante en sifflotant {w:song}. Elle a les mains qui tremblent.",
        "Tu as voulu faire l'épilation toi-même, à la maison, avec un tuto. La cire est collée partout. Tu es à quatre pattes, collé{|e} au tapis de bain par une zone très sensible.",
        "Épilation du dos en salon. L'esthéticienne dit « ça ne fera pas mal ». Elle ment. Elle ment toujours. Elle a déjà arraché trois bandes et une partie de ton âme.",
      ],
      en: [
        "'Smooth as a Dolphin' beauty salon. You booked a full bikini wax. The beautician is an intern, it's her first day, and the wax is smoking like {w:food} left on the stove.",
        "Your partner gave you a full wax 'to spice things up'. The beautician spreads boiling wax while whistling {w:song}. Her hands are shaking.",
        "You tried waxing yourself at home with a tutorial. The wax is everywhere. You're on all fours, stuck to the bath mat by a very sensitive area.",
        "Back wax at the salon. The beautician says 'it won't hurt'. She's lying. They always lie. She's already ripped off three strips and part of your soul.",
      ],
    },
    choices: [
      {
        label: { fr: 'Arracher d\'un coup sec', en: 'Rip it off in one go' },
        out: [
          { w: 2, text: { fr: ["Elle a arraché. J'ai hurlé si fort que le salon voisin a appelé la police. La bande contenait des poils, de la peau et une partie de mon enfance. {w:swear}", "Un coup sec. J'ai vu la lumière blanche. La bande a emporté une couche d'épiderme. J'étais lisse, mais rose vif, comme un jambon de Noël."], en: ["She ripped. I screamed so loud the salon next door called the police. The strip contained hair, skin and part of my childhood. {w:swear}", "One quick pull. I saw the white light. The strip took a layer of skin with it. I was smooth, but bright pink, like a Christmas ham."] }, fx: { health: -5, looks: 3, stress: 6 }, mood: 'cry' },
          { w: 1, text: { fr: ["La cire était trop chaude. Brûlure au deuxième degré dans une zone que je ne peux pas montrer au médecin sans pleurer. Le médecin a pleuré aussi.", "Elle a raté son geste et la bande s'est collée à sa main et à mon entrejambe en même temps. On a été reliés pendant vingt minutes. On est amis maintenant, ou au moins complices."], en: ["The wax was too hot. Second-degree burn somewhere I can't show a doctor without crying. The doctor cried too.", "She botched the move and the strip stuck to her hand and my crotch at the same time. We were connected for twenty minutes. We're friends now, or at least accomplices."] }, fx: { health: -10, disease: 'burns', happy: -6 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Fuir à moitié épilé{|e}', en: 'Flee half-waxed' }, text: { fr: ["Je me suis levé{|e} et j'ai fui avec une bande collée et la moitié des poils. Je suis rentré{|e} chez moi comme un chat de gouttière mal tondu. Mon ou ma partenaire a éclaté de rire pendant une heure.", "J'ai payé et fui, à moitié lisse. J'ai désormais une zone en damier, comme un terrain de foot. C'est original, au moins."], en: ["I got up and fled with one strip still stuck and half my hair. I got home looking like a badly shaved alley cat. My partner laughed for an hour.", "I paid and fled, half smooth. I now have a checkerboard pattern down there, like a soccer field. Original, at least."] }, fx: { happy: -2, looks: -2 } },
      { label: { fr: 'Exiger l\'anesthésie', en: 'Demand anaesthesia' }, text: { fr: ["J'ai exigé une anesthésie. On m'a donné un verre de rhum et un bout de bois à mordre, comme dans un film de pirates. J'ai survécu. Le bout de bois, non.", "On m'a proposé une crème anesthésiante. J'en ai mis trop. Je n'ai plus rien senti, à cet endroit, pendant deux jours. C'était troublant, pour mon couple."], en: ["I demanded anaesthesia. They gave me a glass of rum and a stick to bite, like in a pirate movie. I survived. The stick didn't.", "They offered numbing cream. I used too much. I couldn't feel a thing down there for two days. It was confusing for my relationship."] }, fx: { stress: -2, health: -2 } },
    ],
  },

  // ═════════════════════════════ HUMOUR NOIR — enterrements, morgue, crémation ═════════════════════════════

  // ── Cercueil qui dévale ──
  {
    id: 'tr_casket_drop',
    icon: '⚰️',
    cat: 'trash',
    rating: 2,
    scene: { place: 'cemetery', mood: 'shock', prop: 'coffin', fx: 'ghost' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Enterrement de l'oncle Raymond. On te désigne comme porteur de cercueil. Les marches de l'église sont verglacées. Les trois autres porteurs ont 80 ans. L'oncle Raymond pesait 140 kilos.",
        "Tu portes le cercueil de ta grand-tante quand tu remarques que la poignée en plastique craque. Ton voisin de poignée a bu {w:drink} au petit-déjeuner. L'escalier fait quarante marches.",
        "Messe d'enterrement. Le cercueil repose sur des tréteaux de location qui grincent. Le prêtre éternue. Un tréteau glisse. Toute l'assemblée retient son souffle.",
        "Au cimetière, les croque-morts descendent le cercueil dans la fosse avec des sangles usées. L'une d'elles commence à craquer. Le défunt, ton grand-oncle, va peut-être faire une dernière sortie.",
      ],
      en: [
        "Uncle Raymond's funeral. You're appointed pallbearer. The church steps are icy. The other three pallbearers are 80. Uncle Raymond weighed 300 pounds.",
        "You're carrying your great-aunt's casket when you notice the plastic handle cracking. The guy on the next handle had {w:drink} for breakfast. The staircase has forty steps.",
        "Funeral mass. The casket rests on rented trestles that creak. The priest sneezes. A trestle slips. The whole congregation holds its breath.",
        "At the cemetery, the undertakers lower the casket into the grave with worn straps. One starts to tear. The deceased, your great-uncle, might make one last appearance.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tenir bon, héroïquement', en: 'Hold on heroically' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai tenu seul{|e} le cercueil pendant que les trois papis glissaient sur les marches comme des pingouins. Je l'ai descendu jusqu'au corbillard. On m'a applaudi{|e} dans une église. Première fois.", "J'ai retenu le cercueil d'une main et un papi de l'autre. La famille m'a offert {w:gift} pour me remercier. Raymond m'aurait détesté{|e} pour ça."], en: ["I held the casket alone while the three grandpas slid down the steps like penguins. I got it all the way to the hearse. I got applause in a church. A first.", "I held the casket with one hand and a grandpa with the other. The family gave me {w:gift} as thanks. Raymond would have hated me for it."] }, fx: { happy: 8, karma: 4, athletic: 2 }, mood: 'proud' },
          { w: 2, text: { fr: ["Le cercueil a glissé, dévalé les quarante marches comme une luge et s'est ouvert en bas. Oncle Raymond a roulé sur le trottoir et s'est arrêté pile devant la boulangerie, en costume, assis. La boulangère a crié « Monsieur Raymond ! Vous voulez votre baguette ? »", "Le cercueil a dévalé l'escalier, traversé la route et percuté {w:vehicle}. Le couvercle s'est ouvert, le défunt a fait un vol plané majestueux jusqu'au bac à fleurs. Toute la famille s'est mise à rire. Lui aussi, peut-être."], en: ["The casket slipped, slid down forty steps like a toboggan and burst open at the bottom. Uncle Raymond rolled onto the sidewalk and stopped right in front of the bakery, in a suit, sitting up. The baker yelled 'Mr. Raymond! Want your usual baguette?'", "The casket slid down the steps, crossed the road and hit {w:vehicle}. The lid flew open and the deceased did a majestic flying dive into a flower bed. The whole family burst out laughing. Maybe he did too."] }, fx: { happy: 6, stress: 4, visual: 'ghost' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Lâcher et faire le signe de croix', en: 'Let go and cross myself' }, text: { fr: ["J'ai lâché et fait un signe de croix. Le cercueil est tombé sur le pied du prêtre. Il a juré comme un charretier, en latin. La famille a trouvé que c'était un très bel hommage.", "J'ai tout lâché en criant « IL BOUGE ! ». Panique générale. Une tante s'est évanouie, un oncle a fui. Il ne bougeait pas. Mais l'ambiance était enfin vivante."], en: ["I let go and crossed myself. The casket fell on the priest's foot. He swore like a sailor, in Latin. The family thought it was a lovely tribute.", "I let go of everything screaming 'HE MOVED!'. Mass panic. An aunt fainted, an uncle ran. He didn't move. But the mood was finally alive."] }, fx: { happy: 6, karma: -3 } },
      { label: { fr: 'Filmer pour l\'héritage', en: 'Film it for the inheritance' }, text: { fr: ["J'ai filmé la chute. La vidéo est passée dans une émission de bêtisiers. Avec les droits, j'ai touché plus que l'héritage. Raymond, de là-haut, doit être vert. Enfin, plus vert qu'avant.", "J'ai filmé. Le notaire a vu la vidéo, a éclaté de rire et m'a confié en douce qu'il y avait une clause « le premier qui rit hérite ». J'ai ri en premier."], en: ["I filmed the fall. The video aired on a blooper show. With the royalties, I made more than the inheritance. Raymond must be green up there. Well, greener than before.", "I filmed. The notary watched the video, burst out laughing, and quietly told me there was a clause: 'whoever laughs first inherits'. I laughed first."] }, fx: { money: 3000, happy: 6, karma: -2 }, mood: 'happy' },
    ],
  },

  // ── Erreur à la morgue → chaîne : réveil ──
  {
    id: 'tr_morgue_mixup',
    icon: '🏷️',
    cat: 'trash',
    rating: 2,
    scene: { place: 'hospital', mood: 'shock', prop: 'morgue', fx: 'ghost' },
    when: { age: [18, 90], noFlag: 'tr_morgue' },
    weight: 4,
    once: true,
    text: {
      fr: [
        "Tu fais un malaise après {w:drink} de trop et tombes dans un sommeil si profond que l'interne de garde, épuisé, te déclare mort{|e}. Tu sens qu'on t'accroche une étiquette à l'orteil. Il fait froid. Très froid.",
        "Tu viens identifier le corps d'un lointain cousin à la morgue. L'employé, coiffé comme {w:celeb}, se trompe de tiroir et ouvre… un tiroir vide à ton nom.",
        "Après une anesthésie ratée, tu ouvres les yeux dans le noir, nu{|e}, dans un tiroir métallique. Une voix dehors dit : « Le {first} {last}, on le crame à 14 h. »",
        "Un brancard t'emmène vers la morgue alors que tu es bien vivant{|e}, juste paralysé{|e} par la péridurale. Les deux brancardiers parlent de leur match de foot. Tu ne peux pas bouger, juste cligner.",
      ],
      en: [
        "You pass out after one {w:drink} too many and fall into a sleep so deep the exhausted intern on call declares you dead. You feel a tag being tied to your toe. It's cold. Very cold.",
        "You come to identify a distant cousin's body at the morgue. The attendant, with the same haircut as {w:celeb}, opens the wrong drawer and finds... an empty drawer with your name on it.",
        "After a botched anaesthesia, you open your eyes in the dark, naked, in a metal drawer. A voice outside says: 'The {first} {last} one, we burn at 2 p.m.'",
        "A gurney is wheeling you to the morgue while you're very much alive, just paralysed by the epidural. The two orderlies are talking about their football game. You can't move, only blink.",
      ],
    },
    choices: [
      { label: { fr: 'Hurler', en: 'Scream' }, text: { fr: ["J'ai hurlé. L'interne a hurlé plus fort. Un brancardier s'est évanoui, un autre a jeté son café sur le plafond. On m'a rendu mes vêtements en s'excusant, mais pas mon orteil, étiqueté et égaré.", "J'ai poussé un cri d'outre-tombe. Le croque-mort a fait une crise cardiaque. On a mis son corps dans mon tiroir, encore tiède. J'ai mis son manteau. Le cercle de la vie."], en: ["I screamed. The intern screamed louder. One orderly fainted, another threw his coffee at the ceiling. They returned my clothes apologetically, but not my toe tag, lost forever.", "I let out a scream from beyond the grave. The mortician had a heart attack. They put him in my drawer, still warm. I took his coat. The circle of life."] }, fx: { stress: 10, happy: -2, disease: 'ptsd', flag: 'tr_morgue', chain: 'tr_morgue_wake' }, mood: 'shock' },
      { label: { fr: 'Faire le mort, par curiosité', en: 'Play dead, out of curiosity' }, text: { fr: ["J'ai fait le mort pour voir. J'ai entendu des trucs fous : l'interne trompe sa femme avec l'anesthésiste, et le chef de service vend des reins sur {w:app}. J'ai tout noté.", "Je suis resté{|e} immobile, curieux{|se}. Les employés de la morgue ont fait une pause déjeuner sur mon tiroir. J'ai appris la recette de la blanquette de Josiane. Elle est très bonne."], en: ["I played dead to see what happens. I heard wild stuff: the intern cheats on his wife with the anaesthetist, and the department head sells kidneys on {w:app}. I took notes.", "I stayed still, curious. The morgue staff had their lunch break on my drawer. I learned Josiane's veal stew recipe. It's very good."] }, fx: { smarts: 3, flag: 'tr_morgue', chain: 'tr_morgue_wake' }, mood: 'neutral' },
    ],
  },
  {
    id: 'tr_morgue_wake',
    icon: '🔥',
    cat: 'trash',
    rating: 2,
    chainOnly: true,
    scene: { place: 'hospital', mood: 'shock', prop: 'crematorium', fx: 'fire' },
    when: { flag: 'tr_morgue' },
    text: {
      fr: [
        "Malgré tout, la paperasse te déclare officiellement mort{|e}. Ton tiroir glisse vers le four crématoire. Une étiquette dit « 14 h ». Il est 13 h 58. Le technicien met ses écouteurs et lance {w:song}.",
        "L'administration refuse de te « ressusciter » sans le formulaire Cerfa 666-B. En attendant, ton dossier part à la crémation. Le tapis roulant démarre. Tu sens déjà {w:smell}.",
        "Le directeur des pompes funèbres jure qu'il va « régler ça ». Puis il te pousse vers le four par erreur, parce que tu portes le même pyjama que le défunt d'à côté.",
        "Ta famille a déjà vendu ta voiture, partagé tes affaires et loué ta chambre sur Airbnb. Et le crématorium, très ponctuel, a lancé la procédure. Le four ronronne.",
      ],
      en: [
        "Despite everything, the paperwork officially declares you dead. Your drawer slides toward the crematorium oven. A tag says '2 p.m.'. It's 1:58. The technician puts on his headphones and plays {w:song}.",
        "The administration refuses to 'resurrect' you without Form 666-B. Meanwhile, your file goes to cremation. The conveyor starts. You can already smell {w:smell}.",
        "The funeral director swears he'll 'sort it out'. Then he pushes you toward the oven by mistake, because you're wearing the same pyjamas as the deceased next door.",
        "Your family already sold your car, split your stuff and rented your room on Airbnb. And the very punctual crematorium has started the procedure. The oven purrs.",
      ],
    },
    choices: [
      {
        label: { fr: 'Taper sur la porte', en: 'Bang on the door' },
        out: [
          { w: 3, text: { fr: ["J'ai tapé comme un{|e} sourd{|e}. Le technicien a enlevé ses écouteurs à la dernière seconde. Je suis ressorti{|e} avec les sourcils cramés et une odeur de merguez. Ma famille a dû rendre ma voiture.", "J'ai cogné, j'ai hurlé, j'ai chanté {w:song} plus fort que lui. Il m'a sorti{|e} juste à temps, rôti{|e} des pieds. J'ai porté plainte. J'ai gagné. Mes pieds non."], en: ["I banged like crazy. The technician took off his headphones at the last second. I came out with charred eyebrows and a smell of grilled sausage. My family had to give back my car.", "I banged, screamed, sang {w:song} louder than him. He pulled me out just in time, feet roasted. I sued. I won. My feet didn't."] }, fx: { health: -10, disease: 'burns', money: 20000, unflag: 'tr_morgue', visual: 'fire' }, mood: 'shock' },
          { w: 1, text: { fr: ["Personne n'a entendu. J'ai été crématisé{|e} vivant{|e}, en chantant. Ma famille a reçu une urne et une facture. À la cérémonie, ma tante a dit : « On aurait juré qu'{il|elle} tapait. » On en rit encore dans la famille.", "Les écouteurs du technicien étaient à fond. Le four a fait « fwoosh ». J'ai fini en urne sur la cheminée de ma belle-mère, qui m'utilise comme presse-papier."], en: ["Nobody heard. I was cremated alive, singing. My family received an urn and an invoice. At the service, my aunt said: 'You'd swear they were knocking.' The family still laughs about it.", "The technician's headphones were maxed out. The oven went 'fwoosh'. I ended up in an urn on my mother-in-law's mantelpiece, used as a paperweight."] }, fx: { die: { fr: "incinéré{|e} vivant{|e} à cause d'une erreur administrative", en: 'cremated alive due to an administrative error' }, visual: 'fire' } },
        ],
      },
      { label: { fr: 'Attaquer l\'administration', en: 'Sue the administration' }, text: { fr: ["J'ai sauté du tapis, nu{|e}, et couru au service administratif avec mon étiquette au pied. J'ai rempli le Cerfa 666-B en direct. L'employée m'a dit : « Il manque la signature du défunt. » J'ai signé. Elle a tamponné.", "J'ai sauté du tapis et fait un procès. J'ai obtenu des dommages et intérêts et un certificat de décès encadré. Je ne paie plus d'impôts : officiellement, je suis mort{|e}."], en: ["I jumped off the conveyor, naked, and ran to the admin office with the tag on my toe. I filled out Form 666-B on the spot. The clerk said: 'The deceased's signature is missing.' I signed. She stamped it.", "I jumped off the conveyor and sued. I got damages and a framed death certificate. I don't pay taxes anymore: officially, I'm dead."] }, fx: { money: 10000, happy: 10, unflag: 'tr_morgue' }, mood: 'proud' },
    ],
  },

  // ── Crémation : le pacemaker explose ──
  {
    id: 'tr_cremation_boom',
    icon: '💥',
    cat: 'trash',
    rating: 2,
    scene: { place: 'cemetery', mood: 'shock', prop: 'crematorium', fx: 'explosion' },
    when: { age: [18, 90] },
    weight: 5,
    cooldown: 15,
    text: {
      fr: [
        "Crémation de papy Marcel. Le technicien te demande, l'air de rien : « Il avait un pacemaker ? » Tu ne sais pas. Le four est déjà allumé. Marcel est déjà dedans.",
        "Au crématorium, la famille se recueille devant la vitre du four. Tu te souviens soudain que l'oncle défunt avait {w:object} dans la poche de son costume. Et un briquet tempête. Et un pacemaker.",
        "Cérémonie de crémation pour ta grand-tante. Le maître de cérémonie lance {w:song}, sa chanson préférée. Derrière la vitre, quelque chose fait « bip… bip… biiiip ».",
        "Ton cousin a glissé « un dernier souvenir » dans le cercueil avant la crémation : une boîte de pétards de 14 juillet, la passion de pépé. Le four atteint 900 degrés.",
      ],
      en: [
        "Grandpa Marcel's cremation. The technician casually asks: 'Did he have a pacemaker?' You don't know. The oven's already on. Marcel's already inside.",
        "At the crematorium, the family gathers in front of the oven window. You suddenly remember the late uncle had {w:object} in his suit pocket. And a storm lighter. And a pacemaker.",
        "Cremation service for your great-aunt. The officiant plays {w:song}, her favourite song. Behind the window, something goes 'beep... beep... beeeep'.",
        "Your cousin slipped 'one last keepsake' into the coffin before cremation: a box of firecrackers, grandpa's passion. The oven hits 1,650 degrees.",
      ],
    },
    choices: [
      {
        label: { fr: 'Se jeter au sol', en: 'Hit the floor' },
        out: [
          { w: 2, text: { fr: ["Je me suis jeté{|e} au sol. BOUM. La porte du four a sauté, une pluie de cendres chaudes a recouvert la famille. On ressemblait tous à des ramoneurs. Mamie a dit : « Il est partout maintenant, comme il voulait. »", "J'ai plongé. L'explosion a soufflé les vitres et envoyé un morceau de papy (la rotule, je crois) dans le chignon de ma tante. Elle ne l'a remarqué qu'au buffet."], en: ["I threw myself on the floor. BOOM. The oven door blew off, a rain of hot ashes covered the family. We all looked like chimney sweeps. Grandma said: 'He's everywhere now, like he wanted.'", "I dove. The explosion blew out the windows and sent a piece of grandpa (the kneecap, I think) into my aunt's bun. She only noticed at the buffet."] }, fx: { happy: 6, stress: 6, visual: 'explosion' }, mood: 'shock' },
          { w: 1, text: { fr: ["Trop tard. Le souffle m'a projeté{|e} contre l'orgue électrique, qui s'est mis à jouer tout seul. Mes cheveux sont gris de cendre de tonton. Je ne sais pas si je dois les laver ou les enterrer.", "L'explosion a lancé les pétards dans toute la salle. Feu d'artifice funéraire. Le prêtre a pris une fusée dans la soutane. Le plus bel enterrement du département, selon la presse locale."], en: ["Too late. The blast threw me against the electric organ, which started playing by itself. My hair is grey with my uncle's ashes. I don't know whether to wash it or bury it.", "The explosion launched the firecrackers across the room. Funeral fireworks. The priest took a rocket in the cassock. Best funeral in the county, according to the local paper."] }, fx: { health: -6, happy: 4, disease: 'burns', visual: 'fire' }, mood: 'party' },
        ],
      },
      { label: { fr: 'Applaudir, c\'est son style', en: 'Applaud, it\'s so him' }, text: { fr: ["J'ai applaudi l'explosion en criant « BRAVO PAPY ! ». Toute la famille a suivi. Le technicien a pleuré. On a réservé le même four pour mamie, avec plus de pétards.", "J'ai lancé une ola. Même le croque-mort s'y est mis. On est repartis avec une urne à moitié vide et un souvenir indélébile, et {w:gross} sur nos chaussures."], en: ["I applauded the explosion shouting 'BRAVO GRANDPA!'. The whole family joined in. The technician cried. We booked the same oven for grandma, with more firecrackers.", "I started a wave. Even the undertaker joined. We left with a half-empty urn, an unforgettable memory, and {w:gross} on our shoes."] }, fx: { happy: 10, karma: 1 }, mood: 'party' },
    ],
  },

  // ── Cendres de papi dans le shaker ──
  {
    id: 'tr_ashes_protein',
    icon: '🥤',
    cat: 'trash',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'apartment', mood: 'shock', prop: 'shaker', fx: 'ghost' },
    when: { age: [18, 70] },
    weight: 5,
    cooldown: 15,
    text: {
      fr: [
        "{a.first}, {a:ton pote|ta pote} obsédé{a:|e} par la muscu, est venu{a:|e} dormir chez toi. Ce matin, {a:il|elle} a pris « la poudre protéinée dans la boîte grise » pour son shaker. La boîte grise, c'était l'urne de ton grand-père.",
        "Tu rentres et trouves {a.first} en train de faire des pompes en buvant un shaker gris. « Ta whey a un goût bizarre, un peu fumé », dit {a:il|elle}. L'urne de mamie est ouverte sur le plan de travail.",
        "{a.first} a mélangé les cendres de ton chien avec {w:drink}, persuadé{a:|e} que c'était de la créatine. {a:Il|Elle} en est à son troisième verre et se sent « super en forme ».",
        "Tu cherches l'urne de tonton Gégé partout. Puis tu vois {a.first} sortir de ta cuisine avec une moustache grise et un grand sourire : « Ta protéine bio est incroyable, j'ai pris deux kilos de muscle. »",
      ],
      en: [
        "{a.first}, your gym-obsessed buddy, slept over. This morning they used 'the protein powder in the grey tub' for their shaker. The grey tub was your grandfather's urn.",
        "You come home to find {a.first} doing push-ups while drinking a grey shake. 'Your whey tastes weird, kinda smoky,' they say. Grandma's urn is open on the counter.",
        "{a.first} mixed your dog's ashes with {w:drink}, convinced it was creatine. They're on their third glass and feeling 'super pumped'.",
        "You're looking everywhere for Uncle Gégé's urn. Then {a.first} comes out of your kitchen with a grey moustache and a big smile: 'Your organic protein is amazing, I gained four pounds of muscle.'",
      ],
    },
    choices: [
      {
        label: { fr: 'Lui dire la vérité', en: 'Tell them the truth' },
        out: [
          { w: 2, text: { fr: ["J'ai dit la vérité. {a.first} a vomi papy dans l'évier, puis dans le pot de fleurs, puis sur moi. Papy est maintenant réparti dans tout l'appartement. Comme il aimait voyager, c'est bien.", "Je lui ai dit. {a:Il|Elle} est devenu{a:|e} blanc{a:|he}, puis gris, puis {a:il|elle} a fait un rot qui sentait le crématorium. On a fait une petite minute de silence pour papy, devant les toilettes."], en: ["I told the truth. {a.first} threw grandpa up in the sink, then in the flower pot, then on me. Grandpa is now spread throughout the apartment. He loved to travel, so that's nice.", "I told them. They went white, then grey, then burped something that smelled like a crematorium. We held a minute of silence for grandpa, in front of the toilet."] }, fx: { happy: 4, rel: -5, visual: 'poop' }, mood: 'shock' },
          { w: 1, text: { fr: ["Je lui ai dit. {a:Il|Elle} a haussé les épaules : « Ben, il est en moi maintenant, il vit à travers mes biceps. » {a:Il|Elle} a fini le shaker. Je ne sais pas si c'est beau ou dégueulasse.", "Je lui ai tout avoué. {a:Il|Elle} a réfléchi trois secondes, puis : « Il était costaud, ton papi ? » J'ai dit oui. {a:Il|Elle} a repris un shaker."], en: ["I told them. They shrugged: 'Well, he's in me now, he lives on through my biceps.' They finished the shake. I don't know if that's beautiful or disgusting.", "I confessed everything. They thought for three seconds, then: 'Was your grandpa jacked?' I said yes. They had another shake."] }, fx: { happy: 6, rel: 6 }, mood: 'happy' },
        ],
      },
      { label: { fr: 'Remplacer par de la vraie whey', en: 'Refill it with real whey' }, text: { fr: ["J'ai rempli l'urne de vraie protéine vanille et je n'ai rien dit à personne. Aux funérailles officielles, on a dispersé papy en mer. Les mouettes ont adoré. Elles sont toutes devenues énormes.", "J'ai remplacé papy par du cacao en poudre. Ma mère l'a mis sur sa cheminée et lui parle tous les soirs. Je n'ai jamais eu le courage de lui dire. Papy, lui, est dans les abdos de {a.first}."], en: ["I filled the urn with real vanilla protein and told no one. At the official service, we scattered grandpa at sea. The seagulls loved it. They all got huge.", "I replaced grandpa with cocoa powder. My mom put it on her mantelpiece and talks to it every night. I never had the heart to tell her. Grandpa's in {a.first}'s abs."] }, fx: { karma: -4, happy: 4 } },
      { label: { fr: 'Goûter aussi', en: 'Have a sip too' }, text: { fr: ["J'ai goûté. C'était un peu crayeux, avec une note boisée et {w:smell}. J'ai pris trois kilos de muscle en un mois. Merci papy. Tu me portes encore, à ta façon.", "On a fini l'urne à deux en faisant des squats. J'ai senti la force de mes ancêtres. Puis une crampe. Puis la honte. Puis encore la force."], en: ["I tasted it. A bit chalky, with a woody note and {w:smell}. I gained six pounds of muscle in a month. Thanks grandpa. You still carry me, in your own way.", "We finished the urn together while doing squats. I felt the strength of my ancestors. Then a cramp. Then shame. Then strength again."] }, fx: { athletic: 4, karma: -3, rel: 8 }, mood: 'proud' },
    ],
  },

  // ── Éloge funèbre façon clash ──
  {
    id: 'tr_eulogy_roast',
    icon: '🎤',
    cat: 'trash',
    rating: 2,
    scene: { place: 'cemetery', mood: 'angry', prop: 'mic' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Enterrement de ton ancien chef, Jean-Michel, l'homme qui t'a fait pleurer dans les toilettes pendant cinq ans. Sa veuve te demande de dire « quelques mots gentils ». Tu montes au pupitre.",
        "On te demande de faire l'éloge funèbre de ton oncle Gérard, qui a gâché tous les Noëls de ton enfance avec ses blagues racistes et son haleine qui dégageait {w:smell}. Le micro est allumé. Tout le monde attend.",
        "Funérailles de ton ex-beau-père, un {w:insult} de première catégorie. Personne n'a voulu parler. Le prêtre te regarde avec des yeux suppliants. Tu as bu {w:drink} pour te donner du courage.",
        "Le défunt, ton ancien proprio, t'a volé ta caution, ton chat et ta dignité. La famille veut que tu prennes la parole « car tu l'as bien connu ». Oh oui, tu l'as bien connu.",
      ],
      en: [
        "Funeral of your former boss Jean-Michel, the man who made you cry in the bathroom for five years. His widow asks you to say 'a few kind words'. You step up to the lectern.",
        "You're asked to give the eulogy for your uncle Gérard, who ruined every Christmas of your childhood with his bigoted jokes and {w:smell}. The mic is on. Everyone's waiting.",
        "Funeral of your ex-father-in-law, a top-tier {w:insult}. Nobody wanted to speak. The priest looks at you with pleading eyes. You had {w:drink} for courage.",
        "The deceased, your former landlord, stole your deposit, your cat and your dignity. The family wants you to speak 'since you knew him well'. Oh, you knew him well.",
      ],
    },
    choices: [
      { label: { fr: 'Le roast intégral', en: 'Full roast' }, out: [
        { w: 2, text: { fr: ["J'ai commencé par « Jean-Michel était un connard ». Silence. Puis un rire, au fond. Puis toute l'église. Même la veuve. Standing ovation. On m'a réservé{|e} pour trois autres enterrements.", "J'ai lâché : « Il est enfin aussi froid que son cœur. » Fou rire général. Le prêtre a dû s'asseoir. Le cercueil, je le jure, a vibré."], en: ["I started with 'Jean-Michel was an asshole.' Silence. Then a laugh at the back. Then the whole church. Even the widow. Standing ovation. I got booked for three more funerals.", "I said: 'He's finally as cold as his heart.' Everyone cracked up. The priest had to sit down. The coffin, I swear, vibrated."] }, fx: { happy: 14, fame: 2, karma: -2 }, mood: 'proud' },
        { w: 1, text: { fr: ["J'ai déroulé mes vingt pages de griefs. Au bout de quarante minutes, la famille m'a sorti{|e} de force, pendant que je hurlais « ET LA CAUTION, JEAN-MICHEL ? ». On m'a interdit{|e} de cimetière.", "Mon roast a choqué la veuve, qui s'est jetée sur moi. On s'est battus au-dessus de la fosse, et on est tombés dedans, sur le cercueil. Le fossoyeur a commencé à reboucher par réflexe."], en: ["I read my twenty pages of grievances. After forty minutes, the family dragged me out while I screamed 'AND MY DEPOSIT, JEAN-MICHEL?'. I'm banned from the cemetery.", "My roast shocked the widow, who jumped me. We fought over the grave and fell in, onto the coffin. The gravedigger started filling it in out of habit."] }, fx: { happy: 6, karma: -5, health: -4 }, mood: 'angry' },
      ] },
      { label: { fr: 'Mentir avec talent', en: 'Lie beautifully' }, text: { fr: ["J'ai improvisé un discours bouleversant sur un homme généreux qui n'a jamais existé. Toute l'assemblée a pleuré. La veuve m'a donné sa Rolex. Je l'ai revendue le jour même. Merci Jean-Michel.", "J'ai raconté qu'il avait sauvé {w:animal} d'un incendie. C'était faux. Le journal local en a fait un article. On a donné son nom à une rue. La rue est en sens interdit, comme lui."], en: ["I improvised a heartbreaking speech about a generous man who never existed. The whole crowd wept. The widow gave me his Rolex. I sold it that same day. Thanks, Jean-Michel.", "I said he once saved {w:animal} from a fire. Not true. The local paper wrote an article. They named a street after him. It's a one-way street, like him."] }, fx: { money: 2500, karma: -3, smarts: 2 }, mood: 'happy' },
      { label: { fr: 'Juste lire la liste de courses', en: 'Read my grocery list' }, text: { fr: ["J'ai sorti un papier et lu ma liste de courses avec beaucoup d'émotion : « Lait. Œufs. PQ. » Les gens ont trouvé ça poétique. Une tante m'a demandé une copie.", "J'ai lu, la voix tremblante : « Du jambon, {w:food}, des piles. » La veuve a éclaté en sanglots : « C'est exactement ce qu'il achetait. » Je suis un génie malgré moi."], en: ["I pulled out a piece of paper and read my grocery list with great emotion: 'Milk. Eggs. Toilet paper.' People found it poetic. An aunt asked for a copy.", "I read, voice trembling: 'Ham, {w:food}, batteries.' The widow burst into tears: 'That's exactly what he used to buy.' I'm a genius by accident."] }, fx: { happy: 8, smarts: 1 } },
    ],
  },

  // ── Thanatopracteur clown ──
  {
    id: 'tr_clown_embalming',
    icon: '🤡',
    cat: 'trash',
    rating: 2,
    scene: { place: 'cemetery', mood: 'shock', prop: 'coffin' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 15,
    text: {
      fr: [
        "Veillée funèbre de ta tante Simone. Le thanatopracteur, stagiaire, a un peu forcé sur le maquillage : rouge à lèvres jusqu'aux oreilles, fard bleu électrique, joues rouges. On dirait un clown qui a perdu un pari.",
        "Le cercueil ouvert de ton grand-oncle révèle un sourire figé, énorme, comme s'il venait de voir {w:celeb} sortir de la douche. Les coins de sa bouche sont tenus par des agrafes visibles.",
        "Le thanatopracteur a mal recousu les paupières de ton cousin. Un œil est resté ouvert et semble suivre les gens dans la pièce, comme la Joconde. Les enfants pleurent. Les adultes aussi.",
        "Ta grand-mère est exposée avec la perruque de quelqu'un d'autre. Une perruque afro arc-en-ciel. Le registre des pompes funèbres indique : « Mme Simone ? Ou M. Bozo ? »",
      ],
      en: [
        "Wake for your aunt Simone. The trainee embalmer went a bit heavy on the makeup: lipstick up to the ears, electric blue eyeshadow, red cheeks. She looks like a clown who lost a bet.",
        "Your great-uncle's open casket reveals a frozen, enormous grin, as if he'd just seen {w:celeb} stepping out of the shower. The corners of his mouth are held up with visible staples.",
        "The embalmer badly stitched your cousin's eyelids. One eye stayed open and seems to follow people around the room like the Mona Lisa. The kids are crying. So are the adults.",
        "Your grandma is on display wearing someone else's wig. A rainbow afro wig. The funeral home's register reads: 'Mrs. Simone? Or Mr. Bozo?'",
      ],
    },
    choices: [
      { label: { fr: 'Prendre un selfie', en: 'Take a selfie' }, out: [
        { w: 2, text: { fr: ["J'ai pris un selfie avec tata Simone, langue tirée, pouce levé. La photo a fait le tour de la famille. Mamie l'a mise en fond d'écran. C'est la première fois qu'elle rit depuis 1974.", "Selfie avec le défunt souriant. Je l'ai légendé « Il est parti heureux ». 50 000 likes. Les pompes funèbres m'ont proposé un partenariat."], en: ["I took a selfie with Aunt Simone, tongue out, thumbs up. The photo went around the family. Grandma set it as her wallpaper. First time she's laughed since 1974.", "Selfie with the smiling deceased. Caption: 'He left happy.' 50,000 likes. The funeral home offered me a sponsorship."] }, fx: { happy: 8, followers: 3000, karma: -2 }, mood: 'happy' },
        { w: 1, text: { fr: ["Pendant le selfie, j'ai trébuché et fait tomber le corps du cercueil. Tata Simone a atterri sur moi, face contre face, son maquillage de clown s'est imprimé sur mon visage. J'ai gardé l'empreinte toute la messe.", "Le flash a fait sursauter le neveu, qui a renversé le cercueil. Le défunt a roulé sous le buffet. On l'a retrouvé au dessert, avec un petit four collé au front."], en: ["During the selfie I tripped and knocked the body out of the casket. Aunt Simone landed on me face to face, and her clown makeup printed onto my face. I kept the imprint through the whole service.", "The flash startled the nephew, who knocked the casket over. The deceased rolled under the buffet table. We found him at dessert with a canapé stuck to his forehead."] }, fx: { happy: 4, karma: -4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Retoucher le maquillage', en: 'Fix the makeup' }, text: { fr: ["J'ai sorti ma trousse de maquillage et refait tata Simone façon drag-queen, paillettes et faux cils. La famille a trouvé ça « audacieux ». Elle n'a jamais été aussi belle de son vivant.", "J'ai voulu retoucher, mais mon mouchoir a enlevé un sourcil entier. J'ai dessiné le reste au feutre {w:brand}. Le défunt semble désormais perpétuellement surpris."], en: ["I pulled out my makeup kit and redid Aunt Simone drag-queen style, glitter and false lashes. The family found it 'bold'. She never looked so good while alive.", "I tried to fix it, but my tissue wiped off a whole eyebrow. I drew the rest with a {w:brand} marker. The deceased now looks permanently surprised."] }, fx: { happy: 6, karma: 2, looks: 1 } },
      { label: { fr: 'Faire un procès', en: 'Sue the funeral home' }, text: { fr: ["J'ai attaqué les pompes funèbres. Le stagiaire a dû venir s'excuser déguisé en clown, comme punition symbolique. J'ai touché un dédommagement. Tata Simone aurait adoré l'argent, pas le clown.", "J'ai menacé d'un procès. Les pompes funèbres m'ont offert un cercueil gratuit, « pour plus tard ». Je l'utilise comme coffre à jouets en attendant."], en: ["I sued the funeral home. The trainee had to come apologise dressed as a clown, as symbolic punishment. I got compensation. Aunt Simone would have loved the money, not the clown.", "I threatened to sue. The funeral home offered me a free coffin 'for later'. I'm using it as a toy chest in the meantime."] }, fx: { money: 2000, happy: 4 } },
    ],
  },

  // ── Le mort pète ──
  {
    id: 'tr_corpse_fart',
    icon: '👻',
    cat: 'trash',
    rating: 2,
    scene: { place: 'cemetery', mood: 'shock', prop: 'coffin', fx: 'ghost' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Veillée en silence autour du cercueil ouvert de ton grand-père. Tu te penches pour l'embrasser une dernière fois. Le corps émet un pet long, grave, interminable. Les gaz de décomposition. Toute la famille t'a vu{|e} pencher.",
        "Pendant la minute de silence, le défunt laisse échapper {w:sound}. Puis un autre. Le prêtre continue sa prière en accélérant. Ta mère te regarde, persuadée que c'est toi.",
        "Tu lis un poème devant le cercueil quand le mort lâche un vent si puissant que sa cravate se soulève. L'odeur arrive deux secondes plus tard. Elle évoque {w:smell}, mais en pire.",
        "La veillée de ton oncle dure depuis trois heures dans une pièce surchauffée. Le corps se met à faire des gargouillis. Puis le ventre se gonfle. Le croque-mort recule discrètement vers la sortie.",
      ],
      en: [
        "Silent wake around your grandfather's open casket. You lean in to kiss him one last time. The body lets out a long, deep, endless fart. Decomposition gases. The whole family saw you lean in.",
        "During the minute of silence, the deceased lets out {w:sound}. Then another. The priest speeds up his prayer. Your mom looks at you, convinced it was you.",
        "You're reading a poem by the casket when the corpse lets rip a wind so strong his tie lifts. The smell arrives two seconds later. It's like {w:smell}, but worse.",
        "Your uncle's wake has lasted three hours in an overheated room. The body starts gurgling. Then the belly swells. The undertaker discreetly backs toward the exit.",
      ],
    },
    choices: [
      { label: { fr: 'Accuser papy', en: 'Blame grandpa' }, text: { fr: ["J'ai pointé le cercueil : « C'est lui ! » Personne ne m'a cru{|e}. J'ai été désigné{|e} officiellement comme le péteur de l'enterrement. On m'en parle encore à chaque mariage.", "J'ai crié : « C'EST PAPY ! » Ma grand-mère a hoché la tête : « Oui, il faisait ça tous les soirs. » Toute la famille a ri, puis pleuré, puis ouvert les fenêtres."], en: ["I pointed at the casket: 'It was him!' Nobody believed me. I was officially named the funeral farter. They still bring it up at every wedding.", "I yelled: 'IT WAS GRANDPA!' My grandma nodded: 'Yes, he did that every night.' The whole family laughed, then cried, then opened the windows."] }, fx: { happy: 6, stress: 3 } },
      { label: { fr: 'Répondre par un pet', en: 'Fart back' }, out: [
        { w: 2, text: { fr: ["J'ai répondu par un pet, en hommage. Mon oncle a suivi. Puis mon cousin. Un concert de pets funéraires. Le prêtre a béni la cacophonie. Papy aurait adoré.", "J'ai pété en retour, solennel{|le}. Le mort a répondu. Un dialogue s'est installé. La famille a appelé ça « la dernière conversation ». Je pleure encore en y repensant, de rire."], en: ["I farted back as a tribute. My uncle followed. Then my cousin. A concert of funeral farts. The priest blessed the cacophony. Grandpa would have loved it.", "I farted back, solemnly. The corpse answered. A dialogue began. The family called it 'the last conversation'. I still cry thinking about it, from laughing."] }, fx: { happy: 12, karma: 1 }, mood: 'party' },
        { w: 1, text: { fr: ["J'ai voulu faire un petit pet d'hommage. Ce n'était pas qu'un pet. J'ai dû quitter l'enterrement en marchant comme un pingouin. Papy m'a battu{|e}, même mort.", "Mon pet d'hommage a été suivi d'un ballonnement du mort, puis d'une explosion de gaz qui a fait sauter un bouton de sa veste dans l'œil du prêtre. Le prêtre a crié {w:swear}"], en: ["I wanted to do a little tribute fart. It wasn't just a fart. I had to leave the funeral walking like a penguin. Grandpa beat me, even dead.", "My tribute fart was followed by the corpse bloating, then a gas burst that popped a button off his jacket into the priest's eye. The priest yelled {w:swear}"] }, fx: { happy: 2, looks: -2, visual: 'poop' }, mood: 'shock' },
      ] },
      { label: { fr: 'Fuir avant l\'explosion', en: 'Flee before it blows' }, text: { fr: ["J'ai senti le danger et je suis sorti{|e} fumer une cigarette. Trente secondes plus tard, le ventre de tonton a cédé. J'ai vu la famille sortir en courant, verte, en hurlant. J'avais bien fait.", "J'ai prétexté un appel et filé. Dans mon dos, un « PLOP » humide, puis des cris. Ma cousine est sortie avec {w:gross} dans les cheveux. Elle ne m'a jamais pardonné d'avoir fui."], en: ["I sensed danger and went outside for a smoke. Thirty seconds later my uncle's belly gave way. I watched the family run out, green, screaming. Good call.", "I pretended to take a call and slipped out. Behind me, a wet 'PLOP', then screams. My cousin came out with {w:gross} in her hair. She never forgave me for fleeing."] }, fx: { happy: 4, karma: -1 } },
    ],
  },

  // ── Testament du riche oncle ──
  {
    id: 'tr_rich_will',
    icon: '📜',
    cat: 'trash',
    rating: 2,
    scene: { place: 'mansion', mood: 'angry', prop: 'will', fx: 'money' },
    when: { age: [18, 90] },
    weight: 5,
    cooldown: 20,
    text: {
      fr: [
        "Lecture du testament de ton grand-oncle milliardaire, un homme qui licenciait ses employés par fax le soir de Noël. Le notaire ouvre l'enveloppe. Toute la famille bave comme {w:animal} devant {w:food}.",
        "Ton oncle, roi de l'immobilier et des expulsions en hiver, vient de mourir étouffé par une olive. Le notaire annonce : « Il lègue toute sa fortune… à son chat. Et à vous, il lègue… ceci. » Il te tend une boîte en carton.",
        "Testament de ta tante richissime, celle qui appelait les serveurs « toi là ». Clause spéciale : l'héritier devra « passer une nuit dans le mausolée avec la défunte ». Personne ne se porte volontaire.",
        "Le notaire lit : « À {mon neveu|ma nièce} {first}, que je n'ai jamais aimé{|e}, je lègue ma collection d'ongles de pieds, classée par année. » Il te tend un album photo très épais.",
      ],
      en: [
        "Reading of the will of your billionaire great-uncle, a man who fired employees by fax on Christmas Eve. The notary opens the envelope. The whole family drools like {w:animal} in front of {w:food}.",
        "Your uncle, king of real estate and winter evictions, just choked to death on an olive. The notary announces: 'He leaves his entire fortune... to his cat. And to you, he leaves... this.' He hands you a cardboard box.",
        "Will of your filthy-rich aunt, the one who called waiters 'hey you'. Special clause: the heir must 'spend one night in the mausoleum with the deceased'. Nobody volunteers.",
        "The notary reads: 'To my dear relative {first}, whom I never liked, I leave my toenail collection, sorted by year.' He hands you a very thick photo album.",
      ],
    },
    choices: [
      { label: { fr: 'Accepter la clause', en: 'Accept the clause' }, out: [
        { w: 2, text: { fr: ["J'ai passé la nuit dans le mausolée. À 3 h, le cercueil a fait {w:sound}. J'ai fait pipi dans mon pantalon, mais j'ai tenu. Au matin, j'étais riche et j'avais les cheveux blancs.", "J'ai dormi à côté de la tante. Elle sentait le formol et {w:smell}. J'ai hérité de la villa et du yacht. Je dors avec la lumière allumée depuis, mais sur un yacht."], en: ["I spent the night in the mausoleum. At 3 a.m., the coffin made {w:sound}. I peed my pants, but I held on. In the morning I was rich and had white hair.", "I slept next to my aunt. She smelled of formaldehyde and {w:smell}. I inherited the villa and the yacht. I've slept with the lights on ever since, but on a yacht."] }, fx: { money: 80000, stress: 10, happy: 8, visual: 'money' }, mood: 'proud' },
        { w: 1, text: { fr: ["Au milieu de la nuit, j'ai entendu frapper de l'intérieur du cercueil. J'ai fui. Le lendemain, on m'a annoncé que c'était un raton laveur. L'héritage est allé au raton laveur.", "Je me suis enfui{|e} à minuit, sous les ricanements d'un hibou. Le notaire a donné la fortune au cousin le plus détesté, qui avait tenu toute la nuit en jouant {w:hobby} contre le cercueil."], en: ["In the middle of the night, I heard knocking from inside the coffin. I fled. The next day they told me it was a raccoon. The inheritance went to the raccoon.", "I ran off at midnight to the snickering of an owl. The notary gave the fortune to the most hated cousin, who had stayed all night playing {w:hobby} against the coffin."] }, fx: { happy: -6, stress: 6 }, mood: 'sad' },
      ] },
      { label: { fr: 'Ouvrir la boîte en carton', en: 'Open the box' }, out: [
        { w: 2, text: { fr: ["La boîte contenait un dentier en or massif. Je l'ai fait fondre. Le reste de la famille, qui avait hérité de dettes, me regarde depuis avec une haine délicieuse.", "Dans la boîte : les clés d'un coffre-fort {w:far_place}. Dedans, des lingots et un mot : « Le chat aura tout, sauf ça. Ne dis rien à ta mère. »"], en: ["The box contained solid gold dentures. I melted them down. The rest of the family, who inherited debts, now looks at me with delicious hatred.", "In the box: the keys to a safe {w:far_place}. Inside, gold bars and a note: 'The cat gets everything except this. Don't tell your mother.'"] }, fx: { money: 25000, happy: 10, visual: 'money' }, mood: 'happy' },
        { w: 1, text: { fr: ["La boîte contenait {w:gross} et un mot : « Pour tout ce que tu m'as coûté en cadeaux de Noël. » Même mort, il a trouvé le moyen de m'humilier. Respect, quelque part.", "Dans la boîte, une photo de lui faisant un doigt d'honneur, signée. Je l'ai encadrée. C'est le seul cadeau sincère qu'il m'ait jamais fait."], en: ["The box contained {w:gross} and a note: 'For everything you cost me in Christmas presents.' Even dead, he found a way to humiliate me. Respect, somehow.", "In the box, a photo of him flipping the bird, signed. I framed it. It's the only sincere gift he ever gave me."] }, fx: { happy: -2 }, mood: 'angry' },
      ] },
      { label: { fr: 'Kidnapper le chat héritier', en: 'Kidnap the heir cat' }, text: { fr: ["J'ai kidnappé le chat milliardaire et je l'ai adopté. Légalement, je gère sa fortune. Il mange du caviar, je roule en Porsche. Il me méprise. Comme tonton.", "J'ai pris le chat. Il m'a griffé{|e} au visage, a fait pipi sur le testament et s'est enfui chez le voisin. Le voisin est désormais milliardaire. Il n'a jamais rien compris."], en: ["I kidnapped the billionaire cat and adopted him. Legally, I manage his fortune. He eats caviar, I drive a Porsche. He despises me. Like my uncle did.", "I took the cat. It clawed my face, peed on the will and ran off to the neighbour's. The neighbour is now a billionaire. He never understood a thing."] }, fx: { money: 15000, karma: -4, heat: 4 } },
    ],
  },

  // ── Cousin influenceur à l'enterrement ──
  {
    id: 'tr_funeral_live',
    icon: '📱',
    cat: 'trash',
    rating: 2,
    scene: { place: 'cemetery', mood: 'angry', prop: 'phone', fx: 'gore' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Ton cousin Kévin, influenceur « lifestyle et deuil positif », fait un live à l'enterrement de mamie. Il marche à reculons au bord de la tombe ouverte en disant : « Mettez un cœur pour mamie, code promo MAMIE20. »",
        "Au cimetière, ta cousine influenceuse se filme en pleurs, puis vérifie la lumière, puis recommence. Elle te demande de tenir sa perche à selfie au-dessus du cercueil. Elle a 400 000 abonnés et zéro honte.",
        "Un influenceur que personne ne connaît s'est incrusté à l'enterrement pour faire du contenu « authentique ». Il fait un unboxing de la gerbe de fleurs et recule vers la fosse.",
        "Ton cousin Kévin fait danser les croque-morts sur {w:song} pour une tendance TikTac. Il ne regarde pas où il met les pieds. La tombe fait deux mètres de profondeur.",
      ],
      en: [
        "Your cousin Kevin, a 'lifestyle and positive grief' influencer, is livestreaming grandma's funeral. He walks backward along the open grave saying: 'Drop a heart for grandma, promo code GRANNY20.'",
        "At the cemetery, your influencer cousin films herself crying, checks the lighting, then starts again. She asks you to hold her selfie stick over the coffin. She has 400,000 followers and zero shame.",
        "An influencer nobody knows crashed the funeral to make 'authentic' content. He's unboxing the flower wreath and backing toward the grave.",
        "Your cousin Kevin is making the pallbearers dance to {w:song} for a TikTac trend. He isn't watching his step. The grave is six feet deep.",
      ],
    },
    choices: [
      { label: { fr: 'Un petit coup de coude', en: 'A little nudge' }, out: [
        { w: 2, text: { fr: ["Un petit coup de coude, l'air de rien. Kévin est tombé dans la fosse, sur le cercueil, téléphone en main, en direct. Le live a fait 2 millions de vues. Il m'a remercié{|e}. Il a une jambe dans le plâtre et un sponsor de béquilles.", "Je l'ai poussé d'un rien. Il a fait un salto arrière dans la tombe et son téléphone a filmé sa chute en ralenti. Ses abonnés ont cru à un coup de pub. Il a vendu des tee-shirts « J'ai survécu à l'enterrement de mamie »."], en: ["A little nudge, casually. Kevin fell into the grave, onto the coffin, phone in hand, live. The stream got 2 million views. He thanked me. He has a leg in a cast and a crutch sponsor.", "I gave him the tiniest push. He backflipped into the grave and his phone filmed the fall in slow-mo. His followers thought it was a stunt. He sold 'I survived grandma's funeral' T-shirts."] }, fx: { happy: 12, karma: -3 }, mood: 'happy' },
        { w: 1, text: { fr: ["Je l'ai poussé un peu trop fort. Il est tombé tête la première sur le coin du cercueil. Ses dents se sont plantées dans le bois verni comme des clous. Le cercueil de mamie a désormais un sourire. Elle aurait ri.", "Coup de coude, chute, et la pelle du fossoyeur qui l'attendait en bas. Clang. Ses abonnés ont vu ses dents voler en direct. Il a lancé un code promo dentiste."], en: ["I pushed a bit too hard. He fell headfirst onto the corner of the coffin. His teeth stuck into the varnished wood like nails. Grandma's coffin now has a smile. She would've laughed.", "Nudge, fall, and the gravedigger's shovel waiting at the bottom. Clang. His followers saw his teeth fly live. He launched a dentist promo code."] }, fx: { happy: 8, karma: -5, visual: 'gore' }, mood: 'shock' },
      ] },
      { label: { fr: 'Lui piquer son téléphone', en: 'Steal his phone' }, text: { fr: ["Je lui ai arraché le téléphone et je l'ai jeté dans la fosse. Il a plongé pour le récupérer. Le fossoyeur, un peu sourd, a commencé à reboucher. On l'a sorti au bout de dix minutes. Il a fait un live depuis la tombe.", "J'ai pris son téléphone et j'ai fait un live à sa place, en lisant ses messages privés à voix haute. Ses 400 000 abonnés ont appris qu'il achetait ses abonnés. Carrière terminée. Mamie était vengée."], en: ["I snatched his phone and threw it into the grave. He dove after it. The slightly deaf gravedigger started filling it in. We pulled him out after ten minutes. He did a live from the grave.", "I took his phone and went live in his place, reading his DMs out loud. His 400,000 followers learned he bought his followers. Career over. Grandma was avenged."] }, fx: { happy: 10, karma: 3, followers: 5000 }, mood: 'proud' },
      { label: { fr: 'Faire un duo avec lui', en: 'Join his content' }, text: { fr: ["J'ai rejoint la danse. On a fait une chorégraphie autour du cercueil. Ma mère m'a déshérité{|e} sur place. Mais j'ai gagné 30 000 abonnés et un contrat avec {w:brand}.", "J'ai dansé avec Kévin. La vidéo a été reprise par les journaux du monde entier : « Honte nationale ». J'ai une page Wikipédia, maintenant. Section « Controverses »."], en: ["I joined the dance. We choreographed a routine around the coffin. My mother disinherited me on the spot. But I gained 30,000 followers and a deal with {w:brand}.", "I danced with Kevin. The video was picked up by newspapers worldwide: 'National Disgrace'. I have a Wikipedia page now. Section: 'Controversies'."] }, fx: { followers: 30000, fame: 4, karma: -5 }, mood: 'party' },
    ],
  },

  // ═════════════════════════════ DIALOGUES CRUS & INSULTES ═════════════════════════════

  // ── Rage au volant ──
  {
    id: 'tr_road_rage',
    icon: '🚗',
    cat: 'trash',
    rating: 2,
    actor: { create: { role: 'enemy', age: [25, 60], abs: true, gender: 'any' } },
    scene: { place: 'park', mood: 'angry', prop: 'car', fx: 'police' },
    when: { age: [18, 85] },
    weight: 7,
    cooldown: 8,
    text: {
      fr: [
        "Feu rouge. Un SUV de 3 tonnes te colle au pare-chocs, klaxonne et {a.first}, au volant, baisse sa vitre : « Tu démarres, {w:insult} ? » Le feu est encore rouge.",
        "Sur le parking du supermarché, {a.first} te vole ta place en souriant, puis te fait un doigt d'honneur avec une bague en diamant. Sa plaque d'immatriculation dit « BO55 ».",
        "Bouchon sur le périph. {a.first} te double par la bande d'arrêt d'urgence en hurlant : « Moi, j'ai un rendez-vous important, pas comme toi, {w:insult} ! »",
        "{a.first} te fait une queue de poisson, pile devant toi, puis pile, puis te hurle dessus parce que tu as failli lui rentrer dedans. Sa vitre arrière arbore un autocollant « Je roule pour Jésus ».",
      ],
      en: [
        "Red light. A 3-ton SUV tailgates you, honks, and {a.first}, at the wheel, rolls down the window: 'You gonna move, {w:insult}?' The light's still red.",
        "In the supermarket parking lot, {a.first} steals your spot with a smile, then flips you off with a diamond ring. Their licence plate says 'BO55'.",
        "Traffic jam on the ring road. {a.first} passes you on the hard shoulder yelling: 'I have an important meeting, unlike you {w:insult}!'",
        "{a.first} cuts you off, slams the brakes right in front of you, then yells at you because you almost hit them. Their rear window has a 'Jesus Drives With Me' sticker.",
      ],
    },
    choices: [
      { label: { fr: 'Duel d\'insultes', en: 'Insult duel' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai baissé ma vitre et sorti l'artillerie : « Ta mère est tellement grosse qu'elle a son propre code postal, et ton SUV compense quelque chose de minuscule. » Tout le carrefour a applaudi. {a.first} a calé de honte.", "J'ai répondu : « {w:insult}, même ton GPS fait demi-tour quand il te voit. » {a.first} a cherché une réplique pendant vingt secondes, puis a pleuré. Le feu est passé au vert. J'ai démarré en douceur."], en: ["I rolled down my window and brought out the artillery: 'Your mom's so big she has her own zip code, and your SUV is compensating for something tiny.' The whole intersection applauded. {a.first} stalled from shame.", "I replied: '{w:insult}, even your GPS makes a U-turn when it sees you.' {a.first} searched for a comeback for twenty seconds, then cried. The light turned green. I drove off smoothly."] }, fx: { happy: 12, stress: -6 }, mood: 'proud' },
        { w: 1, text: { fr: ["Le duel a dégénéré. {a.first} est sorti{a:|e} avec une batte, j'ai répondu avec {w:object}. On s'est battus en plein carrefour. Un policier en trottinette nous a embarqués tous les deux.", "On s'est insultés si fort qu'un car scolaire entier s'est arrêté pour écouter. Les profs ont porté plainte. J'ai eu une amende pour « pollution sonore et pédagogie négative »."], en: ["The duel escalated. {a.first} got out with a bat, I answered with {w:object}. We fought in the middle of the intersection. A cop on a scooter hauled us both in.", "We insulted each other so loudly an entire school bus stopped to listen. The teachers filed a complaint. I got a fine for 'noise pollution and negative education'."] }, fx: { health: -5, heat: 12, money: -200 }, mood: 'angry' },
      ] },
      { label: { fr: 'Vengeance discrète', en: 'Quiet revenge' }, text: { fr: ["Je l'ai suivi{a:|e} jusqu'à son bureau et j'ai mis une sardine dans la prise d'air de son SUV. Au bout de trois jours de canicule, sa voiture sentait le port de Marseille en août. {a:Il|Elle} l'a revendue à perte.", "J'ai attendu qu'{a:il|elle} se gare, et j'ai collé sur son pare-brise une feuille : « Je conduis comme {w:animal} et j'ai {w:gross} à la place du cerveau. » {a:Il|Elle} a roulé avec toute la journée sans la voir."], en: ["I followed them to their office and stuck a sardine in their SUV's air intake. After three days of heatwave, the car smelled like a fishing port in August. They sold it at a loss.", "I waited for them to park and stuck a note on their windshield: 'I drive like {w:animal} and have {w:gross} for a brain.' They drove around all day without noticing."] }, fx: { happy: 10, karma: -3 }, mood: 'happy' },
      { label: { fr: 'Sourire et respirer', en: 'Smile and breathe' }, text: { fr: ["J'ai souri et fait un cœur avec mes mains. {a.first} est devenu{a:|e} fou{a:|lle} de rage, a démarré en trombe, grillé le feu et s'est fait flasher par trois radars. Le karma roule en Twingo.", "J'ai respiré profondément. {a.first} a accéléré, glissé sur {w:food} tombé d'un camion et percuté une poubelle. Le couvercle s'est rabattu sur son toit ouvrant. J'ai klaxonné poliment en passant."], en: ["I smiled and made a heart with my hands. {a.first} went insane with rage, floored it, ran the light and got flashed by three speed cameras. Karma drives a hatchback.", "I breathed deeply. {a.first} accelerated, skidded on {w:food} that fell off a truck and crashed into a bin. The lid flipped onto their sunroof. I honked politely as I passed."] }, fx: { karma: 4, happy: 6, stress: -4 } },
    ],
  },

  // ── Discours de mariage trop honnête ──
  {
    id: 'tr_wedding_speech',
    icon: '🥂',
    cat: 'trash',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'castle', mood: 'party', prop: 'mic' },
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Mariage de {a.first}. Tu es témoin. Tu as bu six coupes et {w:drink}. On te tend le micro pour le discours. Tu connais tous les secrets de {a.first}. Vraiment tous.",
        "C'est l'heure du discours du témoin. {a.first} te supplie du regard de ne pas parler de « l'histoire du camping ». La belle-famille est catholique pratiquante. Le micro grésille.",
        "Tu as préparé un discours émouvant pour le mariage de {a.first}. Mais en montant sur scène, tu vois la personne qu'{a:il|elle} vient d'épouser embrasser le DJ derrière la tente.",
        "Le micro est à toi. 200 invités. {a.first} t'a fait jurer de « rester classe ». Tu as une liste de toutes ses ex, de ses arrestations et de ce qu'{a:il|elle} a fait {w:at_place} en 2015.",
      ],
      en: [
        "{a.first}'s wedding. You're the best man/maid of honour. You've had six glasses of champagne and {w:drink}. They hand you the mic for the speech. You know all of {a.first}'s secrets. Every single one.",
        "Time for the best man/maid of honour speech. {a.first} begs you with their eyes not to mention 'the camping story'. The in-laws are devout Catholics. The mic crackles.",
        "You prepared a touching speech for {a.first}'s wedding. But as you step on stage, you see their new spouse making out with the DJ behind the tent.",
        "The mic is yours. 200 guests. {a.first} made you swear to 'keep it classy'. You have a list of all their exes, their arrests and what they did {w:at_place} in 2015.",
      ],
    },
    choices: [
      { label: { fr: 'Tout balancer', en: 'Spill everything' }, out: [
        { w: 2, text: { fr: ["J'ai raconté l'histoire du camping, celle du chien et celle de la pharmacie à 3 h du matin. La grand-mère s'est évanouie. Le père de la mariée a ri jusqu'à la crise d'asthme. {a.first} m'a pardonné{|e}… vers 4 h, bourré{a:|e}.", "J'ai lu la liste des ex, par ordre chronologique, avec les notes sur 10. Trois d'entre eux étaient dans la salle. L'un a levé son verre. Le marié a demandé le divorce avant le dessert."], en: ["I told the camping story, the dog story and the 3 a.m. pharmacy story. Grandma fainted. The bride's father laughed until he had an asthma attack. {a.first} forgave me... around 4 a.m., wasted.", "I read the list of exes in chronological order, with ratings out of 10. Three of them were in the room. One raised a glass. The spouse filed for divorce before dessert."] }, fx: { happy: 12, rel: -15, fame: 1 }, mood: 'party' },
        { w: 1, text: { fr: ["J'ai tout balancé, y compris le DJ. Le marié et le DJ se sont battus sur la piste. La pièce montée a volé. Une chaise a traversé la verrière. {a.first} m'a serré dans ses bras : « Merci. Tu m'as sauvé{a:|e}. »", "J'ai révélé l'histoire du DJ. Bagarre générale, vin rouge sur les robes blanches, oncle Bernard en slip sur une table. Le meilleur mariage de ma vie. Le mariage a duré 6 heures."], en: ["I spilled everything, including the DJ. The spouse and the DJ fought on the dance floor. The cake flew. A chair went through the glass roof. {a.first} hugged me: 'Thank you. You saved me.'", "I revealed the DJ story. Brawl, red wine on white dresses, Uncle Bernard in his underwear on a table. Best wedding of my life. The marriage lasted 6 hours."] }, fx: { happy: 10, rel: 15, karma: 4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Discours ultra mielleux', en: 'Super sappy speech' }, text: { fr: ["J'ai fait un discours si mielleux que des gens ont eu des caries. J'ai comparé leur amour à « {w:food} chaud un soir d'hiver ». Tout le monde a pleuré. Je ne sais toujours pas ce que ça voulait dire.", "J'ai lu un poème que j'ai écrit sur une serviette en papier : « Votre amour est comme {w:animal}, sauvage et un peu sale. » Standing ovation. Je ne me souviens de rien."], en: ["I gave a speech so sappy people got cavities. I compared their love to 'warm {w:food} on a winter night'. Everyone cried. I still don't know what that meant.", "I read a poem I wrote on a napkin: 'Your love is like {w:animal}, wild and a bit dirty.' Standing ovation. I remember nothing."] }, fx: { happy: 6, rel: 10 }, mood: 'love' },
      { label: { fr: 'Vomir sur le micro', en: 'Puke on the mic' }, text: { fr: ["J'ai ouvert la bouche pour parler, et c'est le champagne qui a parlé. En jet. Sur le micro, sur la nappe, sur la mariée. Le son amplifié du vomi a résonné dans tout le château. Personne n'oubliera.", "J'ai dit « Mesdames, messieurs… » puis j'ai vomi dans le seau à champagne. Le DJ a lancé {w:song} pour couvrir le bruit. Ça a mis l'ambiance, étrangement."], en: ["I opened my mouth to speak, and the champagne spoke. In a jet. On the mic, the tablecloth, the bride. The amplified sound of vomit echoed through the whole castle. Nobody will forget.", "I said 'Ladies and gentlemen...' then threw up in the champagne bucket. The DJ played {w:song} to cover the noise. It somehow got the party going."] }, fx: { happy: -4, rel: -8, health: -2, visual: 'poop' }, mood: 'sick' },
    ],
  },

  // ── Réveillon : vérités qui fâchent ──
  {
    id: 'tr_xmas_truth',
    icon: '🎄',
    cat: 'trash',
    rating: 2,
    actor: 'parent',
    scene: { place: 'home', mood: 'angry', prop: 'turkey' },
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 10,
    text: {
      fr: [
        "Réveillon en famille. Après le troisième verre, {a.rel} lance : « Alors, toujours rien de mieux dans ta vie ? » Ton oncle ajoute que tu as « pris du poids ». Tu as {w:drink} dans la main et rien à perdre.",
        "Repas de Noël. Ton cousin parfait annonce sa promotion, sa grossesse et son marathon. {a.rel} te regarde : « Et toi ? » Tu as un couteau à dinde dans la main.",
        "Dîner de famille. Ta tante te demande pour la 14e fois quand tu vas « te caser », ton oncle explique {w:conspiracy}, et {a.rel} critique ton {w:object}. Ton verre est vide. Ta patience aussi.",
        "Au moment de la bûche, {a.rel} révèle devant tout le monde ton dossier médical, ta rupture et ton découvert bancaire, « parce qu'on est en famille ». Le silence est épais comme la mayonnaise.",
      ],
      en: [
        "Christmas Eve with family. After the third glass, {a.rel} asks: 'So, still nothing better going on in your life?' Your uncle adds that you've 'put on weight'. You're holding {w:drink} and have nothing to lose.",
        "Christmas dinner. Your perfect cousin announces their promotion, pregnancy and marathon. {a.rel} looks at you: 'And you?' You're holding the turkey knife.",
        "Family dinner. Your aunt asks for the 14th time when you'll 'settle down', your uncle explains {w:conspiracy}, and {a.rel} criticises your {w:object}. Your glass is empty. So is your patience.",
        "At dessert, {a.rel} reveals your medical records, your breakup and your overdraft to everyone, 'because we're family'. The silence is thick as mayonnaise.",
      ],
    },
    choices: [
      { label: { fr: 'Balancer tous les secrets', en: 'Drop every secret' }, out: [
        { w: 2, text: { fr: ["Je me suis levé{|e} : « Tonton trompe tata depuis 1998, mon cousin parfait achète ses médailles en ligne, et papy a un compte OnlyFans. » La dinde est restée intacte. Plus personne n'avait faim. Moi si.", "J'ai tout déballé, par ordre alphabétique. Ma tante a jeté la bûche sur mon oncle. Mon oncle a riposté avec la dinde. Bataille de bouffe générale. Meilleur Noël depuis vingt ans."], en: ["I stood up: 'Uncle's been cheating on auntie since 1998, my perfect cousin buys his medals online, and grandpa has an OnlyFans.' The turkey stayed untouched. Nobody was hungry anymore. I was.", "I unloaded everything, in alphabetical order. My aunt threw the yule log at my uncle. My uncle retaliated with the turkey. Full food fight. Best Christmas in twenty years."] }, fx: { happy: 14, rel: -15, karma: -2 }, mood: 'party' },
        { w: 1, text: { fr: ["J'ai tout balancé. Puis {a.rel} a balancé à son tour : « Tu es adopté{|e}. » Silence total. Puis papy : « Et moi je suis ton vrai père. » Personne n'a touché à la bûche.", "J'ai lâché les secrets. Ma grand-mère a répondu en lâchant les siens, qui étaient pires. Bien pires. Il y avait un pirate, un casino et un voyage {w:far_place}. On a tous appris quelque chose."], en: ["I spilled everything. Then {a.rel} spilled back: 'You're adopted.' Dead silence. Then grandpa: 'And I'm your real father.' Nobody touched the yule log.", "I dropped the secrets. My grandma replied by dropping hers, which were worse. Much worse. There was a pirate, a casino and a trip {w:far_place}. We all learned something."] }, fx: { happy: -4, stress: 8, rel: -10 }, mood: 'shock' },
      ] },
      { label: { fr: 'Répondre par l\'absurde', en: 'Answer with nonsense' }, text: { fr: ["J'ai répondu calmement : « Je suis en couple avec {w:celeb}, je gagne des millions en élevant des escargots et je pars vivre {w:far_place}. » Ils m'ont cru{|e}. Ils me demandent des nouvelles à chaque appel.", "J'ai annoncé que j'étais devenu{|e} {w:weird_job}. Personne n'a osé poser de questions. Mon oncle m'a demandé si ça payait bien. J'ai dit « en nature »."], en: ["I calmly replied: 'I'm dating {w:celeb}, I make millions breeding snails, and I'm moving {w:far_place}.' They believed me. They ask for updates every call.", "I announced I'd become {w:weird_job}. Nobody dared ask questions. My uncle asked if it paid well. I said 'in kind'."] }, fx: { happy: 8, smarts: 1 }, mood: 'happy' },
      { label: { fr: 'Saouler toute la table', en: 'Get the whole table drunk' }, text: { fr: ["J'ai servi tout le monde à ras bord, toute la soirée. À minuit, mon oncle chantait du Céline Dion en slip, ma tante dormait dans la dinde et {a.rel} m'a dit « je t'aime » pour la première fois. Mission accomplie.", "J'ai rempli les verres en continu. Au dessert, plus personne ne se souvenait de mes échecs, ni de son propre nom. Papy a vomi dans le sapin. Joyeux Noël."], en: ["I filled everyone's glass to the brim all night. By midnight, my uncle was singing Celine Dion in his underwear, my aunt was asleep in the turkey, and {a.rel} said 'I love you' for the first time. Mission accomplished.", "I kept the glasses full nonstop. By dessert, nobody remembered my failures, or their own name. Grandpa threw up in the Christmas tree. Merry Christmas."] }, fx: { happy: 10, rel: 6, addiction: ['alcohol', 4] }, mood: 'party' },
    ],
  },

  // ── Cliente insupportable ──
  {
    id: 'tr_karen',
    icon: '💇',
    cat: 'trash',
    rating: 2,
    actor: { create: { role: 'acquaintance', age: [35, 65], abs: true, gender: 'any' } },
    scene: { place: 'office', mood: 'angry', prop: 'counter' },
    when: { age: [18, 70], job: true },
    weight: 7,
    cooldown: 8,
    text: {
      fr: [
        "Au boulot, {a.first}, coupe au carré et lunettes de soleil sur la tête, exige de « parler à ton supérieur » parce que {w:food} était « trop chaud ». {a:Il|Elle} te claque des doigts sous le nez.",
        "{a.first} hurle dans la boutique depuis dix minutes parce que tu as refusé un coupon expiré en 2017. {a:Il|Elle} filme en disant « je vais te détruire sur Facebook, {w:insult} ».",
        "Un client, {a.first}, te jette {w:object} au visage parce que la file avance trop lentement. Puis {a:il|elle} te demande ton prénom « pour la plainte ».",
        "{a.first} a renversé son café exprès sur ton comptoir et exige que tu nettoies « avec le sourire ». {a:Il|Elle} répète que {a:il|elle} « paie ton salaire ». {a:Il|Elle} a acheté un chewing-gum.",
      ],
      en: [
        "At work, {a.first}, bob haircut and sunglasses on the head, demands to 'speak to your manager' because {w:food} was 'too hot'. They snap their fingers in your face.",
        "{a.first} has been screaming in the store for ten minutes because you refused a coupon that expired in 2017. They're filming, saying 'I'll destroy you on Facebook, {w:insult}'.",
        "A customer, {a.first}, throws {w:object} at your face because the line is moving too slowly. Then they ask for your first name 'for the complaint'.",
        "{a.first} spilled their coffee on your counter on purpose and demands you clean it 'with a smile'. They keep repeating that they 'pay your salary'. They bought a stick of gum.",
      ],
    },
    choices: [
      { label: { fr: 'Exploser en direct', en: 'Explode, live' }, out: [
        { w: 2, text: { fr: ["J'ai craqué : « Écoute-moi bien, {w:insult}. Ton coupon, tu peux te le rouler et te le mettre là où le soleil ne brille pas. » Les autres clients ont applaudi. La vidéo de {a.first} m'a rendu{|e} célèbre. J'ai été viré{|e} quand même.", "J'ai hurlé plus fort que {a.first}, monté{|e} sur le comptoir, et récité tout ce que je pensais de sa coupe de cheveux. {a:Il|Elle} est parti{a:|e} en pleurant. Mon patron m'a viré{|e}, puis m'a payé une bière en douce."], en: ["I snapped: 'Listen here, {w:insult}. Roll up your coupon and shove it where the sun don't shine.' Other customers applauded. {a.first}'s video made me famous. I got fired anyway.", "I screamed louder than {a.first}, climbed onto the counter and recited everything I thought of their haircut. They left crying. My boss fired me, then secretly bought me a beer."] }, fx: { happy: 14, fired: true, followers: 20000, fame: 2 }, mood: 'proud' },
        { w: 1, text: { fr: ["J'ai explosé, mais {a.first} était inspecteur{a:|rice} mystère de la direction. Promotion immédiate pour « caractère ». Je n'ai rien compris. Je ne pose pas de questions.", "Mon pétage de plombs a été filmé par un client, et ça a fait le buzz. {w:brand} m'a proposé un contrat pub : « Le seul employé honnête du pays ». J'ai démissionné en direct à la télé."], en: ["I exploded, but {a.first} was a mystery inspector from head office. Instant promotion for 'character'. I didn't understand. I don't ask questions.", "My meltdown was filmed by a customer and went viral. {w:brand} offered me an ad deal: 'The only honest employee in the country'. I quit live on TV."] }, fx: { happy: 12, promote: true, money: 2000 }, mood: 'happy' },
      ] },
      { label: { fr: 'Vengeance de serveur', en: 'Service-worker revenge' }, text: { fr: ["J'ai souri, je me suis excusé{|e}, et j'ai préparé sa commande avec beaucoup d'amour et un peu de {w:bodypart}. Je ne dirai rien de plus. {a.first} a dit que c'était « bien meilleur ».", "J'ai été parfait{|e}. Puis j'ai écrit son numéro sur la porte des toilettes de la gare avec « Appelez-moi pour un massage gratuit ». {a.first} a reçu 400 appels ce soir-là."], en: ["I smiled, apologised, and prepared their order with lots of love and a bit of my {w:bodypart}. I'll say no more. {a.first} said it was 'much better'.", "I was perfect. Then I wrote their number on the train station bathroom door with 'Call for a free massage'. {a.first} got 400 calls that night."] }, fx: { happy: 10, karma: -5 }, mood: 'happy' },
      { label: { fr: 'Appeler le « manager »', en: 'Call the "manager"' }, text: { fr: ["J'ai appelé mon « manager ». C'était mon collègue Mamadou, 2 mètres, voix de basse, qui a regardé {a.first} en silence pendant trente secondes. {a:Il|Elle} est parti{a:|e} à reculons. On s'est tapé dans la main.", "J'ai fait venir le « manager » : le stagiaire de 16 ans avec un badge en carton. Il a dit « non » calmement. {a.first} a fait une crise de nerfs dans les sauces. Le stagiaire a été embauché."], en: ["I called my 'manager'. It was my coworker Mamadou, 6'7\", bass voice, who stared at {a.first} in silence for thirty seconds. They backed out. We high-fived.", "I brought in the 'manager': the 16-year-old intern with a cardboard badge. He calmly said 'no'. {a.first} had a meltdown in the sauce aisle. The intern got hired."] }, fx: { happy: 8, karma: 2, perf: 4 } },
    ],
  },

  // ── Message d'insulte sur l'appli ──
  {
    id: 'tr_dating_insult',
    icon: '💬',
    cat: 'trash',
    rating: 2,
    actor: { create: { role: 'acquaintance', age: [20, 50], abs: true, gender: 'attracted' } },
    scene: { place: 'apartment', mood: 'angry', prop: 'phone' },
    when: { age: [18, 60], noHas: 'spouse' },
    weight: 7,
    cooldown: 8,
    text: {
      fr: [
        "Sur {w:app}, {a.first} t'a écrit après trois messages : « T'es moins bien qu'en photo, mais je suis bourré{a:|e}, ça te dit ? » Tu tiens ton téléphone comme une grenade.",
        "Après un date correct, {a.first} t'envoie : « Désolé{a:|e}, tu manges comme {w:animal} et tu ris comme {w:sound}. Bonne chance. » Tu as trois heures devant toi et beaucoup de vocabulaire.",
        "{a.first} t'a ghosté{|e} pendant trois mois, puis t'envoie à 3 h : « Tu dors ? ». Suivi d'une photo de son {w:bodypart} en gros plan, sans contexte.",
        "Ton match {a.first} t'envoie un pavé expliquant {w:conspiracy}, puis demande pourquoi tu ne réponds pas, puis te traite de {w:nickname}. Le tout en sept minutes.",
      ],
      en: [
        "On {w:app}, after three messages, {a.first} writes: 'You're less hot than your pics, but I'm drunk, wanna hang?' You're holding your phone like a grenade.",
        "After a decent date, {a.first} texts: 'Sorry, you eat like {w:animal} and laugh like {w:sound}. Good luck.' You have three hours to kill and a big vocabulary.",
        "{a.first} ghosted you for three months, then texts at 3 a.m.: 'U up?'. Followed by a close-up photo of their {w:bodypart}, no context.",
        "Your match {a.first} sends you a wall of text explaining {w:conspiracy}, then asks why you're not answering, then calls you {w:nickname}. All in seven minutes.",
      ],
    },
    choices: [
      { label: { fr: 'Réponse nucléaire', en: 'Nuclear reply' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai répondu : « Toi, t'as la conversation d'un rond-point et le charisme d'une chaussette mouillée. Ta mère aurait dû avaler. » {a.first} a supprimé son compte. J'ai encadré la capture.", "J'ai écrit un roman de 2 000 mots, avec chapitres, sur ses défauts. J'ai fini par « Bisous, {w:insult} ». {a:Il|Elle} m'a demandé{|e} en mariage. J'ai bloqué."], en: ["I replied: 'You have the conversation skills of a roundabout and the charisma of a wet sock. Your mom should've swallowed.' {a.first} deleted their account. I framed the screenshot.", "I wrote a 2,000-word novel, with chapters, about their flaws. I ended with 'Kisses, {w:insult}'. They proposed. I blocked them."] }, fx: { happy: 12, stress: -4 }, mood: 'proud' },
        { w: 1, text: { fr: ["Ma réponse nucléaire a été partagée par {a.first} sur les réseaux pour me ridiculiser. Ça s'est retourné contre {a:lui|elle} : 200 000 personnes l'ont insulté{a:|e} à ma place. Je n'ai rien eu à faire.", "J'ai répondu fort. {a:Il|Elle} a répondu plus fort. À 5 h du matin, on s'insultait en vocal. À 6 h, on était au lit ensemble. Je ne comprends pas l'amour moderne."], en: ["{a.first} shared my nuclear reply online to humiliate me. It backfired: 200,000 people insulted them on my behalf. I didn't have to do anything.", "I replied hard. They replied harder. By 5 a.m. we were insulting each other in voice notes. By 6 a.m. we were in bed together. I don't understand modern love."] }, fx: { happy: 10, followers: 5000, rel: 10 }, mood: 'love' },
      ] },
      { label: { fr: 'Envoyer une photo de mon pied', en: 'Send a photo of my foot' }, text: { fr: ["J'ai répondu avec une photo de mon pied, ongle incarné en gros plan, sans contexte. {a.first} a répondu « 🥵 ». Je n'avais pas prévu ça. J'ai gagné 50 balles en vendant la photo.", "J'ai envoyé une photo de {w:gross} en très haute définition. {a.first} a vomi et m'a bloqué{|e}. Puis m'a débloqué{|e} pour me demander où je l'avais trouvé. Les gens sont étranges."], en: ["I replied with a photo of my foot, ingrown toenail in close-up, no context. {a.first} replied '🥵'. Didn't see that coming. I made 50 bucks selling the photo.", "I sent a photo of {w:gross} in ultra HD. {a.first} threw up and blocked me. Then unblocked me to ask where I found it. People are weird."] }, fx: { happy: 8, money: 50 }, mood: 'happy' },
      { label: { fr: 'Le transférer à sa mère', en: 'Forward it to their mom' }, text: { fr: ["J'ai retrouvé sa mère sur Facebook et je lui ai transféré la conversation. Elle a répondu : « Je suis désolée, je l'ai mal élevé{a:|e}. » Puis elle m'a proposé un café. On est amies maintenant.", "J'ai transféré à sa mère, son patron et son club de {w:hobby}. {a.first} a dû faire des excuses publiques. Sa mère m'envoie des cartes à Noël."], en: ["I found their mom on Facebook and forwarded the conversation. She replied: 'I'm sorry, I raised them badly.' Then she invited me for coffee. We're friends now.", "I forwarded it to their mom, their boss and their {w:hobby} club. {a.first} had to make a public apology. Their mom sends me Christmas cards."] }, fx: { happy: 10, karma: 1 }, mood: 'happy' },
    ],
  },

  // ── Murs trop fins ──
  {
    id: 'tr_thin_walls',
    icon: '🧱',
    cat: 'trash',
    rating: 2,
    scene: { place: 'apartment', mood: 'angry', prop: 'wall' },
    when: { age: [18, 80] },
    weight: 7,
    cooldown: 8,
    text: {
      fr: [
        "Il est 3 h du matin. Tes voisins du dessus font des choses d'adultes depuis deux heures, sur un lit qui grince comme {w:sound}. Ils crient des prénoms. Pas toujours les mêmes.",
        "Les murs de ton immeuble sont en papier mâché. Le voisin de gauche hurle « OUI CHÉRIE OUI » sur le rythme de {w:song}. Tu as un rendez-vous à 7 h. Tes boules Quies ont fondu.",
        "Ta voisine ramène quelqu'un de nouveau chaque soir. Ce soir, ça cogne si fort contre le mur que ton cadre est tombé sur ta tête. Tu entends : « Attends, on change de pièce. »",
        "Les voisins se sont mis à faire l'amour sur leur balcon, juste au-dessus du tien, {w:weather}. Une petite culotte tombe dans ton barbecue. Puis une chaussette. Puis un fouet.",
      ],
      en: [
        "It's 3 a.m. Your upstairs neighbours have been doing adult things for two hours, on a bed that squeaks like {w:sound}. They're screaming names. Not always the same ones.",
        "Your building's walls are made of papier-mâché. The neighbour on the left is yelling 'YES HONEY YES' to the beat of {w:song}. You have a meeting at 7 a.m. Your earplugs melted.",
        "Your neighbour brings someone new home every night. Tonight it's banging so hard against the wall that your picture frame fell on your head. You hear: 'Wait, let's switch rooms.'",
        "The neighbours started making love on their balcony right above yours, {w:weather}. A pair of panties drops onto your grill. Then a sock. Then a whip.",
      ],
    },
    choices: [
      { label: { fr: 'Applaudir et noter', en: 'Applaud and rate them' }, text: { fr: ["Quand ça s'est arrêté, j'ai applaudi fort et crié : « 6 sur 10, manque de rythme au deuxième acte ! » Silence total. Le lendemain, dans l'ascenseur, le voisin n'osait plus me regarder. La paix depuis.", "J'ai glissé un mot sous leur porte : « Belle performance. Le monsieur peut mieux faire. Note : 7/20. » Ils ont déménagé un mois plus tard. Victoire par KO."], en: ["When it stopped, I applauded loudly and yelled: '6 out of 10, rhythm issues in the second act!' Dead silence. The next day in the elevator, the neighbour couldn't look at me. Peace ever since.", "I slipped a note under their door: 'Nice performance. The gentleman can do better. Score: 7/20.' They moved out a month later. Victory by knockout."] }, fx: { happy: 10, stress: -4 }, mood: 'happy' },
      { label: { fr: 'Mettre de la musique de film d\'horreur', en: 'Blast horror movie music' }, out: [
        { w: 2, text: { fr: ["J'ai mis la musique de « Psychose » à fond, collée au mur. Les cris ont changé de nature. Le voisin a fait une panne. Définitive, d'après sa femme, qui m'a remercié{|e} dans l'escalier.", "J'ai lancé des cris de bébé qui pleure, en boucle. Ils se sont arrêtés net. J'ai entendu : « Tu m'avais dit que t'avais pas d'enfants ! » Rupture. Silence éternel."], en: ["I blasted the 'Psycho' theme against the wall. The screams changed in nature. The neighbour lost his... momentum. Permanently, according to his wife, who thanked me on the stairs.", "I played crying baby sounds on loop. They stopped dead. I heard: 'You said you didn't have kids!' Breakup. Eternal silence."] }, fx: { happy: 10, karma: -1 }, mood: 'happy' },
        { w: 1, text: { fr: ["La musique d'horreur les a… excités encore plus. Ils ont tapé au mur pour me demander de monter le son. J'ai abandonné et dormi dans la baignoire.", "Ils ont pris ma musique pour une invitation. Ils ont frappé à ma porte à 4 h avec {w:drink} et un grand sourire. J'ai fait semblant d'être mort{|e}."], en: ["The horror music... turned them on even more. They knocked on the wall asking me to turn it up. I gave up and slept in the bathtub.", "They took my music as an invitation. They knocked at 4 a.m. with {w:drink} and big smiles. I pretended to be dead."] }, fx: { happy: -4, stress: 6 }, mood: 'shock' },
      ] },
      { label: { fr: 'Me joindre au chœur', en: 'Join the chorus' }, text: { fr: ["J'ai simulé moi aussi, très fort, tout{|e} seul{|e}, contre le mur. Les voisins se sont arrêtés, impressionnés. Le lendemain, ils m'ont laissé un mot : « Respect. » On a une relation saine maintenant.", "J'ai répondu en hurlant des noms de {w:food} avec passion. Le voisin du dessous a appelé la police, persuadé qu'il y avait une orgie culinaire. Il n'avait pas tort."], en: ["I faked it too, very loudly, alone, against the wall. The neighbours stopped, impressed. The next day they left me a note: 'Respect.' We have a healthy relationship now.", "I answered by passionately screaming the names of {w:food}. The downstairs neighbour called the police, convinced there was a culinary orgy. He wasn't wrong."] }, fx: { happy: 8, heat: 2 } },
    ],
  },

  // ── Soirée fondue… échangiste ──
  {
    id: 'tr_swingers',
    icon: '🗝️',
    cat: 'trash',
    rating: 2,
    scene: { place: 'villa', mood: 'shock', prop: 'bowl' },
    when: { age: [25, 75] },
    weight: 5,
    cooldown: 15,
    text: {
      fr: [
        "Tes nouveaux voisins, très sympas, t'invitent à une « soirée fondue ». En arrivant, tu remarques un bol de clés de voiture sur la table, des peignoirs à l'entrée et pas l'ombre d'un caquelon.",
        "Une collègue t'invite à « une soirée entre amis, tenue décontractée ». Décontractée signifie apparemment « en serviette ». Il y a un buffet, {w:drink} et un couple de retraités nus qui joue au Scrabble.",
        "Tu arrives à l'anniversaire d'un pote d'enfance. L'ambiance est tamisée, la musique est {w:song}, et ton ancienne prof de maths te fait un clin d'œil depuis le jacuzzi.",
        "La soirée « jeux de société » de tes voisins tourne à l'étrange : le jeu, c'est « Twister sans vêtements », et la roue est déjà en train de tourner. Ta voisine te tend un peignoir.",
      ],
      en: [
        "Your very friendly new neighbours invite you to a 'fondue night'. When you arrive, you notice a bowl of car keys on the table, bathrobes at the door, and no fondue pot in sight.",
        "A coworker invites you to 'a casual get-together, relaxed dress code'. Relaxed apparently means 'towel'. There's a buffet, {w:drink}, and a naked retired couple playing Scrabble.",
        "You arrive at a childhood friend's birthday. The lighting is dim, the music is {w:song}, and your old math teacher winks at you from the hot tub.",
        "Your neighbours' 'board game night' gets weird: the game is 'Twister without clothes', and the spinner is already spinning. Your neighbour hands you a bathrobe.",
      ],
    },
    choices: [
      { label: { fr: 'Rester pour le buffet', en: 'Stay for the buffet' }, out: [
        { w: 2, text: { fr: ["Je suis resté{|e} habillé{|e}, assis{|e} au buffet toute la soirée, en mangeant des mini-quiches. Des gens nus venaient me parler de leurs impôts. J'ai passé une excellente soirée, sans rien faire. Les quiches étaient divines.", "J'ai expliqué que j'étais juste là pour la fondue. Ils ont fini par en faire une, pour moi, tout nus autour du caquelon. Le fromage giclait. Il y a eu des brûlures à des endroits inédits."], en: ["I stayed dressed, sitting at the buffet all evening eating mini quiches. Naked people came to chat about their taxes. I had a great evening, doing nothing. The quiches were divine.", "I explained I was just there for the fondue. They ended up making one, for me, all naked around the pot. Cheese splattered. There were burns in unprecedented places."] }, fx: { happy: 8, weight: 0.01 }, mood: 'happy' },
        { w: 1, text: { fr: ["J'ai mangé au buffet. Puis j'ai pioché une clé dans le bol, par réflexe, en croyant que c'était un jeu. J'ai passé la nuit chez un couple charmant à parler de {w:hobby}. Ils m'ont trouvé{|e} « très ouvert{|e} ».", "Le buffet était top. Mais j'ai mangé une fraise qui « avait déjà servi ». Je n'ai pas demandé à quoi. Je ne veux pas savoir."], en: ["I ate at the buffet. Then I drew a key from the bowl by reflex, thinking it was a game. I spent the night at a lovely couple's place talking about {w:hobby}. They found me 'very open-minded'.", "The buffet was great. But I ate a strawberry that 'had already been used'. I didn't ask for what. I don't want to know."] }, fx: { happy: 4, stress: 2 }, mood: 'shock' },
      ] },
      { label: { fr: 'Fuir en hurlant', en: 'Run away screaming' }, text: { fr: ["J'ai fui en hurlant « JE SUIS VENU{|E} POUR LA FONDUE ! ». Dans ma fuite, j'ai renversé le Scrabble et le couple de retraités. Ils ont perdu leur partie. Ils m'en veulent plus pour ça que pour le reste.", "J'ai couru jusqu'à ma voiture. Je me suis rendu compte que ma clé était dans le bol. J'ai dû revenir, la chercher, devant tout le monde, dans le bol. Les gens ont applaudi."], en: ["I fled screaming 'I CAME FOR THE FONDUE!'. On my way out I knocked over the Scrabble and the retired couple. They lost their game. They're madder about that than anything else.", "I ran to my car. Then I realised my key was in the bowl. I had to go back and fish it out, in front of everyone, from the bowl. People applauded."] }, fx: { stress: 6, happy: 2 } },
      { label: { fr: 'Jouer, en adulte consentant', en: 'Play along, consenting adult' }, text: { fr: ["J'ai joué. Je ne dirai rien, sauf que je ne regarderai plus jamais ma voisine, ni le Twister, ni un caquelon, de la même manière. On s'invite tous les mois maintenant.", "J'ai dit « pourquoi pas ». La nuit a été longue, joyeuse et très souple. Le lendemain, j'avais une courbature à {w:bodypart} et un sourire niais. Pas de détails."], en: ["I played. I'll say nothing, except I'll never look at my neighbour, Twister, or a fondue pot the same way again. We do it monthly now.", "I said 'why not'. The night was long, joyful and very flexible. The next day I had a sore {w:bodypart} and a goofy grin. No details."] }, fx: { happy: 12, stress: -6, disease: 'std' }, mood: 'love' },
    ],
  },

  // ── Le patron au sex-shop ──
  {
    id: 'tr_sexshop_boss',
    icon: '🛍️',
    cat: 'trash',
    rating: 2,
    actor: 'boss',
    scene: { place: 'studio', mood: 'shock', prop: 'shop' },
    when: { age: [18, 70], job: true },
    weight: 6,
    cooldown: 15,
    text: {
      fr: [
        "Tu entres dans un sex-shop pour acheter un cadeau rigolo d'enterrement de vie de jeune fille. Au rayon « cuir et menottes », tu tombes nez à nez avec {a.first}, ton {a:patron|patronne}, un fouet à la main.",
        "En caisse du sex-shop, la personne devant toi achète une combinaison en latex, du lubrifiant parfum {w:food} et une cagoule. Elle se retourne. C'est {a.first}. Ton {a:patron|patronne}.",
        "{a.first}, ton {a:patron|patronne} si austère, sort du sex-shop « Plaisirs d'Antan » avec un sac énorme au moment où tu passes devant. Vos regards se croisent. Le sac fait {w:sound}.",
        "Tu travailles au sex-shop le week-end, en secret. Ce samedi, {a.first}, ton {a:patron|patronne} du lundi au vendredi, entre et te demande conseil sur « quelque chose de puissant ».",
      ],
      en: [
        "You walk into a sex shop to buy a funny bachelorette gift. In the 'leather and handcuffs' aisle, you come face to face with {a.first}, your boss, holding a whip.",
        "At the sex shop checkout, the person ahead of you is buying a latex suit, {w:food}-flavoured lube and a gimp mask. They turn around. It's {a.first}. Your boss.",
        "{a.first}, your oh-so-stern boss, walks out of the 'Old-Timey Pleasures' sex shop with an enormous bag just as you pass by. Your eyes meet. The bag makes {w:sound}.",
        "You secretly work at a sex shop on weekends. This Saturday, {a.first}, your Monday-to-Friday boss, walks in and asks your advice on 'something powerful'.",
      ],
    },
    choices: [
      { label: { fr: 'Conseiller avec expertise', en: 'Give expert advice' }, text: { fr: ["J'ai fait comme si de rien n'était et conseillé {a.first} avec un professionnalisme absolu. {a:Il|Elle} est reparti{a:|e} avec trois articles. Lundi, j'ai eu une prime et un bureau avec fenêtre. Personne n'a jamais rien dit.", "J'ai recommandé le modèle « Tsunami Turbo ». {a.first} a rougi et m'a remercié{|e}. Depuis, en réunion, {a:il|elle} ne me contredit plus jamais. Un simple regard suffit."], en: ["I acted like nothing was weird and advised {a.first} with total professionalism. They left with three items. Monday, I got a bonus and an office with a window. Nobody ever said a word.", "I recommended the 'Turbo Tsunami' model. {a.first} blushed and thanked me. Since then, they never contradict me in meetings. A single look is enough."] }, fx: { money: 1500, perf: 10, rel: 10 }, mood: 'proud' },
      { label: { fr: 'Prendre une photo discrète', en: 'Snap a discreet photo' }, out: [
        { w: 2, text: { fr: ["J'ai pris une photo. Je ne l'ai jamais utilisée. Je l'ai juste mise en fond d'écran de mon téléphone pro, que je pose bien en vue pendant les entretiens annuels. Augmentation de 15 %.", "J'ai pris la photo. Lundi, j'ai glissé une banane sur le bureau de {a.first} avec un clin d'œil. {a:Il|Elle} a compris. J'ai eu mes vacances en août."], en: ["I took a photo. Never used it. I just set it as the wallpaper on my work phone, which I leave in plain sight during annual reviews. 15% raise.", "I took the photo. Monday I left a banana on {a.first}'s desk with a wink. They got it. I got my vacation in August."] }, fx: { money: 2500, karma: -4, rel: -10 }, mood: 'happy' },
        { w: 1, text: { fr: ["Le flash s'est déclenché. {a.first} m'a vu{|e}. On s'est regardés longtemps, au milieu des godemichés. Puis {a:il|elle} m'a pris en photo aussi, avec mon panier. Égalité. Guerre froide.", "J'ai pris la photo, mais {a.first} a pris la mienne en même temps, un fouet dans une main, {w:object} dans l'autre. On a signé un pacte de non-agression sur un ticket de caisse."], en: ["The flash went off. {a.first} saw me. We stared at each other among the dildos. Then they took a photo of me too, with my basket. Tie. Cold war.", "I took the photo, but {a.first} took mine at the same moment, a whip in one hand, {w:object} in the other. We signed a non-aggression pact on a receipt."] }, fx: { stress: 6, rel: -5 }, mood: 'shock' },
      ] },
      { label: { fr: 'Fuir derrière les poupées', en: 'Hide behind the blow-up dolls' }, text: { fr: ["Je me suis caché{|e} derrière un présentoir de poupées gonflables. L'une s'est dégonflée sur moi avec un bruit de pet. {a.first} s'est retourné{a:|e}, a vu une poupée qui gémissait et s'est enfui{a:|e}. Personne n'a gagné.", "J'ai plongé derrière les poupées gonflables et je suis resté{|e} immobile, la bouche ouverte, pour me fondre dans le décor. Un client m'a demandé{|e} combien je coûtais. J'ai dit « trop cher pour toi, {w:insult} »."], en: ["I hid behind a display of blow-up dolls. One deflated on me with a fart noise. {a.first} turned around, saw a moaning doll and fled. Nobody won.", "I dove behind the blow-up dolls and stayed still, mouth open, to blend in. A customer asked how much I cost. I said 'too much for you, {w:insult}'."] }, fx: { happy: 6, stress: 2 } },
    ],
  },

  // ── Menottes et pompiers ──
  {
    id: 'tr_handcuffs',
    icon: '🔗',
    cat: 'trash',
    rating: 2,
    actor: 'lover',
    scene: { place: 'home', mood: 'love', prop: 'handcuffs', fx: 'hearts' },
    when: { age: [18, 75] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Soirée coquine avec {a.first}. Menottes à fourrure rose, ton poignet attaché au montant du lit. Puis {a.first} cherche la clé. Partout. Le chat a l'air très content de lui.",
        "Tu es menotté{|e} au radiateur, en tenue de {w:weird_job}, pour un jeu de rôle avec {a.first}. La clé vient de tomber dans le conduit d'aération. La belle-mère sonne à la porte.",
        "{a.first} t'a attaché{|e} au lit « pour une surprise ». La surprise : {a:il|elle} s'est endormi{a:|e} à côté et ronfle comme {w:sound}. Tu as envie de faire pipi.",
        "Week-end romantique. Vous avez testé les menottes achetées 3 € sur {w:app}. Elles ne s'ouvrent plus. Elles sont maintenant soudées. {a.first} est attaché{a:|e} à toi par la cheville.",
      ],
      en: [
        "Naughty night with {a.first}. Pink fluffy handcuffs, your wrist chained to the bedpost. Then {a.first} looks for the key. Everywhere. The cat looks very pleased with itself.",
        "You're handcuffed to the radiator dressed as {w:weird_job} for a roleplay with {a.first}. The key just fell into the air vent. Your mother-in-law rings the doorbell.",
        "{a.first} tied you to the bed 'for a surprise'. The surprise: they fell asleep next to you and are snoring like {w:sound}. You need to pee.",
        "Romantic weekend. You tried the $3 handcuffs from {w:app}. They won't open. They're welded shut now. {a.first} is chained to you by the ankle.",
      ],
    },
    choices: [
      { label: { fr: 'Appeler les pompiers', en: 'Call the firefighters' }, out: [
        { w: 2, text: { fr: ["Les pompiers sont arrivés à six. Ils ont scié les menottes en gardant un sérieux remarquable, jusqu'à ce que l'un d'eux remarque ma tenue et éclate de rire. Mon histoire est désormais la légende de la caserne.", "Les pompiers sont venus avec une pince hydraulique. Le plus jeune a pris une photo « pour la formation ». On est en couverture du calendrier interne. De dos, heureusement."], en: ["Six firefighters showed up. They sawed the handcuffs with remarkable composure, until one noticed my outfit and burst out laughing. My story is now the station's legend.", "The firefighters came with hydraulic cutters. The youngest took a picture 'for training'. We're on the cover of the internal calendar. From behind, thankfully."] }, fx: { happy: 6, rel: 6, stress: 4 }, mood: 'happy' },
        { w: 1, text: { fr: ["Le pompier qui est venu, c'était mon ex. Il a pris son temps. Beaucoup de temps. Il a commenté. Il a sifflé {w:song}. {a.first} et moi n'en avons plus jamais parlé.", "Les pompiers ont dû défoncer la porte. Les voisins ont tout vu : moi, menotté{|e}, en tenue de {w:weird_job}, et {a.first} en train de manger des chips. Réunion de copropriété spéciale le mois prochain."], en: ["The firefighter who came was my ex. He took his time. A lot of time. He commented. He whistled {w:song}. {a.first} and I never spoke of it again.", "The firefighters had to break down the door. The neighbours saw everything: me, cuffed, dressed as {w:weird_job}, and {a.first} eating chips. Special building meeting next month."] }, fx: { happy: -6, stress: 8, rel: -4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Se libérer façon Houdini', en: 'Escape like Houdini' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: ["Je me suis déboîté le pouce comme dans les films et j'ai glissé la main hors de la menotte. Cri de douleur, puis de victoire. {a.first} a trouvé ça « incroyablement sexy ». On a remis ça. Sans menottes.", "J'ai fait des contorsions dignes du Cirque du Soleil. Je me suis libéré{|e}. J'ai aussi déboîté mon épaule. {a.first} m'a emmené{|e} aux urgences, en peignoir."], en: ["I dislocated my thumb like in the movies and slipped my hand out. Scream of pain, then victory. {a.first} found it 'incredibly sexy'. We went again. No cuffs.", "I pulled off Cirque du Soleil-level contortions. I got free. I also dislocated my shoulder. {a.first} drove me to the ER in a bathrobe."] }, fx: { health: -5, rel: 10, happy: 6 }, mood: 'love' },
        { w: 1, text: { fr: ["J'ai tiré si fort que j'ai arraché le montant du lit. Je me suis promené{|e} toute la soirée avec un bout de lit accroché au poignet, comme un bagnard. On a commandé une pizza comme ça.", "J'ai tiré. Le lit s'est effondré. Le voisin du dessous a cru à un tremblement de terre et a évacué l'immeuble. On a dû expliquer à tout le monde, menotte au poignet."], en: ["I pulled so hard I ripped the bedpost off. I walked around all evening with a chunk of bed attached to my wrist like a convict. We ordered pizza like that.", "I pulled. The bed collapsed. The downstairs neighbour thought it was an earthquake and evacuated the building. We had to explain to everyone, cuff still on."] }, fx: { happy: 6, money: -300 }, mood: 'shock' },
      ] },
    ],
  },

  // ── Plage naturiste par erreur ──
  {
    id: 'tr_nudist_beach',
    icon: '🍑',
    cat: 'trash',
    rating: 2,
    scene: { place: 'beach', mood: 'shock', prop: 'umbrella', fx: 'fire' },
    when: { age: [18, 85] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Tu as posé ta serviette sur une plage magnifique et déserte. Vingt minutes plus tard, un club de volley de retraités tout nus s'installe autour de toi. Le filet est juste au-dessus de ta tête.",
        "Plage naturiste. Tu as décidé de « tenter l'expérience ». Tu as oublié la crème solaire sur certaines zones qui n'ont jamais vu le soleil. Il fait 38 degrés, {w:weather}.",
        "Tu fais ton footing sur la plage quand tu réalises que tu es {le seul|la seule} à porter des vêtements. Un monsieur nu te regarde avec mépris : « Textile ! » Il tient {w:food} à la main.",
        "Sur la plage naturiste, ton chef de service, ta belle-mère et ton dentiste sont tous là, nus, à moins de dix mètres. Ils ne t'ont pas encore vu{|e}. Toi, tu as tout vu.",
      ],
      en: [
        "You laid your towel on a gorgeous, deserted beach. Twenty minutes later, a naked seniors' volleyball club sets up around you. The net is right above your head.",
        "Nudist beach. You decided to 'give it a try'. You forgot sunscreen on certain areas that have never seen the sun. It's 100 degrees, {w:weather}.",
        "You're jogging on the beach when you realise you're the only one wearing clothes. A naked man looks at you with contempt: 'Textile!' He's holding {w:food}.",
        "At the nudist beach, your department head, your mother-in-law and your dentist are all there, naked, less than ten yards away. They haven't seen you yet. You've seen everything.",
      ],
    },
    choices: [
      { label: { fr: 'Tout enlever, assumer', en: 'Strip and own it' }, out: [
        { w: 2, text: { fr: ["J'ai tout enlevé. Trois heures plus tard, j'avais des coups de soleil à des endroits que mon médecin a refusé de regarder sans ses lunettes de soleil. J'ai marché comme un cow-boy pendant une semaine.", "Je me suis mis{|e} nu{|e} et j'ai joué au volley avec les retraités. Ils m'ont massacré{|e}. Un smash de Gisèle, 78 ans, m'a touché{|e} à un endroit stratégique. J'ai vu des étoiles."], en: ["I took it all off. Three hours later I had sunburns in places my doctor refused to look at without sunglasses. I walked like a cowboy for a week.", "I got naked and played volleyball with the retirees. They destroyed me. A spike from Gisèle, 78, hit me in a strategic spot. I saw stars."] }, fx: { health: -6, happy: 6, disease: 'burns', visual: 'fire' }, mood: 'shock' },
        { w: 1, text: { fr: ["J'ai tout enlevé, et un crabe a trouvé ma zone la plus sensible très accueillante. Mon cri a fait s'envoler toutes les mouettes de la côte. Les naturistes m'ont applaudi{|e} par solidarité.", "Je me suis déshabillé{|e} pile au moment où ma belle-mère m'a reconnu{|e}. Elle m'a fait signe, toute nue, avec un grand sourire. J'ai besoin de dix ans de thérapie."], en: ["I stripped, and a crab found my most sensitive area very welcoming. My scream sent every seagull on the coast flying. The nudists applauded in solidarity.", "I undressed right as my mother-in-law recognised me. She waved at me, naked, beaming. I need ten years of therapy."] }, fx: { health: -4, happy: -6, disease: 'ptsd' }, mood: 'cry' },
      ] },
      { label: { fr: 'Fuir sous la serviette', en: 'Flee under the towel' }, text: { fr: ["Je me suis enroulé{|e} dans ma serviette comme un burrito et j'ai rampé jusqu'au parking. Les naturistes m'ont hué{|e} : « TEXTILE ! TEXTILE ! » J'ai encore des cauchemars de fesses ridées.", "J'ai fui sous ma serviette, mais un coup de vent l'a emportée. J'ai couru tout{|e} habillé{|e} au milieu de 200 personnes nues. Le seul bizarre, c'était moi."], en: ["I rolled myself up in my towel like a burrito and crawled to the parking lot. The nudists booed me: 'TEXTILE! TEXTILE!' I still have nightmares of wrinkly butts.", "I fled under my towel, but a gust of wind took it. I ran fully clothed through 200 naked people. I was the weird one."] }, fx: { stress: 4, happy: -2 } },
      { label: { fr: 'Prendre une photo du boss', en: 'Snap a photo of the boss' }, text: { fr: ["J'ai pris une photo de mon chef de service, de dos, en train de ramasser un coquillage. Je ne m'en servirai jamais. Mais savoir qu'elle existe me suffit à supporter les réunions du lundi.", "J'ai pris la photo, et mon chef m'a vu{|e}. On s'est regardés. Il a pris une photo de moi en retour. Équilibre de la terreur. On ne s'est plus jamais contredits."], en: ["I took a photo of my department head from behind, bending over to pick up a seashell. I'll never use it. But knowing it exists gets me through Monday meetings.", "I took the photo, and my boss saw me. We stared. He took a photo of me in return. Balance of terror. We never contradicted each other again."] }, fx: { happy: 8, karma: -2 }, mood: 'happy' },
    ],
  },

  // ── Photo coquine dans le groupe famille ──
  {
    id: 'tr_wrong_group',
    icon: '📲',
    cat: 'trash',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'phone' },
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 15,
    text: {
      fr: [
        "Tu viens d'envoyer une photo très, très osée destinée à ton crush. En fait, tu l'as envoyée sur le groupe WhatsApp « Famille ❤️ », 34 membres, dont mamie et le curé du village.",
        "Erreur de destinataire : ton vocal coquin de deux minutes est parti sur le groupe « Équipe Compta ». Tu y dis des choses sur {w:food} et des menottes. Trois personnes l'ont déjà écouté.",
        "Tu as envoyé une photo de toi en sous-vêtements, de dos, avec {w:object}, sur le groupe des parents d'élèves au lieu de ton ou ta partenaire. Le message est marqué « Lu par 47 ».",
        "Ta photo intime est partie dans le groupe « Copropriété Les Lilas ». Le syndic a déjà réagi avec un pouce levé. La gardienne a répondu « 😳 ». Ton voisin demande « c'est le 3e étage ? ».",
      ],
      en: [
        "You just sent a very, very racy photo meant for your crush. Actually, you sent it to the 'Family ❤️' WhatsApp group, 34 members, including grandma and the village priest.",
        "Wrong recipient: your two-minute naughty voice note went to the 'Accounting Team' group. In it you say things about {w:food} and handcuffs. Three people have already listened.",
        "You sent a photo of yourself in underwear, from behind, with {w:object}, to the school parents' group instead of your partner. The message says 'Read by 47'.",
        "Your intimate photo went to the 'Lilac Residence Owners' group. The property manager already reacted with a thumbs up. The concierge replied '😳'. Your neighbour asks 'is that 3rd floor?'.",
      ],
    },
    choices: [
      { label: { fr: 'Prétendre un piratage', en: 'Claim I was hacked' }, out: [
        { w: 2, text: { fr: ["J'ai écrit « PIRATAGE ! Ne cliquez pas ! ». Mamie a répondu : « Trop tard, mais tu as pris de belles fesses, tu tiens ça de ton grand-père. » Le curé a quitté le groupe.", "J'ai crié au piratage. Personne n'y a cru, parce que la photo avait été prise dans ma salle de bain avec ma serviette brodée à mon prénom. {w:swear}"], en: ["I wrote 'HACKED! Don't click!'. Grandma replied: 'Too late, but you've got a nice behind, you get it from your grandfather.' The priest left the group.", "I claimed I was hacked. Nobody believed it, because the photo was taken in my bathroom with my name-embroidered towel. {w:swear}"] }, fx: { stress: 8, happy: -4 }, mood: 'shock' },
        { w: 1, text: { fr: ["J'ai crié au piratage, et c'est passé. Sauf que mon oncle a écrit « Hacker ou pas, joli grain de beauté ». Il faut que je le bloque. Il faut que je le bloque à vie.", "Personne n'a douté du piratage, sauf ma mère, qui m'a appelé{|e} pour me dire : « Je reconnais ce lit, c'est celui que je t'ai offert. »"], en: ["I claimed I was hacked, and it worked. Except my uncle wrote 'Hacker or not, nice mole.' I need to block him. For life.", "Nobody doubted the hack, except my mom, who called to say: 'I recognise that bed, I bought it for you.'"] }, fx: { stress: 4 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Assumer fièrement', en: 'Own it proudly' }, text: { fr: ["J'ai écrit : « Oui, c'est moi. De rien. » Mamie a mis un cœur. Ma tante a demandé le nom de ma salle de sport. Le curé a enregistré la photo. Je n'ai plus aucune limite.", "J'ai assumé : « Profitez, c'est gratuit aujourd'hui. » Ma cousine a répondu par sa propre photo. Le groupe famille est devenu incontrôlable. Noël va être spécial."], en: ["I wrote: 'Yes, that's me. You're welcome.' Grandma sent a heart. My aunt asked which gym I go to. The priest saved the photo. I have no boundaries left.", "I owned it: 'Enjoy, it's free today.' My cousin replied with her own photo. The family group became uncontrollable. Christmas is going to be special."] }, fx: { happy: 8, looks: 2, stress: -2 }, mood: 'proud' },
      { label: { fr: 'Changer de pays', en: 'Move to another country' }, text: { fr: ["J'ai jeté mon téléphone dans la Seine et réservé un aller simple {w:far_place}. Je suis revenu{|e} six mois plus tard. Tout le monde avait oublié, sauf mamie, qui l'a imprimée et accrochée dans la cuisine.", "J'ai sérieusement regardé les vols pour {w:far_place}. Puis j'ai réalisé que le groupe avait déjà été envahi par une photo de chat. L'humanité a la mémoire d'un poisson rouge, et ça m'a sauvé{|e}."], en: ["I threw my phone in the river and booked a one-way ticket {w:far_place}. I came back six months later. Everyone had forgotten, except grandma, who printed it and hung it in the kitchen.", "I seriously looked at flights {w:far_place}. Then I realised the group had already been flooded with cat photos. Humanity has a goldfish memory, and that saved me."] }, fx: { money: -800, stress: -4 } },
    ],
  },

  // ── Réveil chez un inconnu ──
  {
    id: 'tr_morning_after',
    icon: '🛏️',
    cat: 'trash',
    rating: 2,
    actor: { create: { role: 'acquaintance', age: [22, 55], abs: true, gender: 'attracted' } },
    scene: { place: 'apartment', mood: 'shock', prop: 'bed' },
    when: { age: [18, 60], noHas: 'spouse' },
    weight: 6,
    cooldown: 10,
    text: {
      fr: [
        "Tu te réveilles dans un lit inconnu, avec une gueule de bois monumentale. À côté de toi, {a.first} ronfle. Au mur : cinquante animaux empaillés qui te fixent, dont {w:animal} avec un chapeau.",
        "Réveil difficile. Tu es chez {a.first}, rencontré{a:|e} hier soir. Tu ouvres la porte de la salle de bain : il y a une poupée grandeur nature à ton effigie, et une deuxième, inachevée.",
        "Tu ouvres un œil. {a.first} te sourit tendrement en te tendant {w:drink}. Derrière {a:lui|elle}, sa mère, en robe de chambre, attend avec un plateau de croissants : « Alors, c'est toi la nouvelle personne ? »",
        "Le matin, {a.first} t'annonce, tout content{a:|e}, qu'{a:il|elle} a déjà parlé de toi à sa famille, réservé la salle des fêtes et choisi les prénoms des enfants. Vous vous êtes rencontrés il y a neuf heures.",
      ],
      en: [
        "You wake up in a strange bed with a monumental hangover. Next to you, {a.first} is snoring. On the wall: fifty stuffed animals staring at you, including {w:animal} wearing a hat.",
        "Rough wake-up. You're at {a.first}'s place, met last night. You open the bathroom door: there's a life-size doll that looks like you, and a second, unfinished one.",
        "You open one eye. {a.first} smiles tenderly, handing you {w:drink}. Behind them, their mother in a bathrobe waits with a tray of croissants: 'So, you're the new one?'",
        "In the morning, {a.first} happily announces they've already told their family about you, booked the village hall and picked names for the kids. You met nine hours ago.",
      ],
    },
    choices: [
      { label: { fr: 'Fuite en slip', en: 'Escape in underwear' }, out: [
        { w: 2, text: { fr: ["J'ai ramassé mes vêtements et fui par la fenêtre en slip. Premier étage, atterrissage dans une haie de rosiers. J'ai fait le trajet en bus avec des épines dans les fesses. Un retraité m'a offert sa place.", "J'ai fui à quatre pattes, en silence. J'ai oublié une chaussure. {a.first} a posté une annonce « À qui appartient cette chaussure ? » façon Cendrillon. Toute la ville me cherche."], en: ["I grabbed my clothes and fled out the window in my underwear. First floor, landing in a rosebush. I took the bus home with thorns in my butt. A retiree gave me his seat.", "I fled on all fours, silently. I forgot a shoe. {a.first} posted an ad 'Who owns this shoe?' Cinderella-style. The whole town is looking for me."] }, fx: { health: -3, happy: 2, stress: 4 }, mood: 'shock' },
        { w: 1, text: { fr: ["En fuyant, j'ai trébuché sur un hibou empaillé et réveillé tout le monde. La mère de {a.first} m'a rattrapé{|e} dans l'escalier avec un croissant. Je suis resté{|e} pour le petit-déj. Ça fait trois ans.", "Je me suis enfui{|e}, mais {a.first} habitait à côté de chez moi. On se croise tous les jours à la boulangerie. {a:Il|Elle} me fait coucou. Je déménage."], en: ["Fleeing, I tripped over a stuffed owl and woke everyone up. {a.first}'s mother caught me on the stairs with a croissant. I stayed for breakfast. That was three years ago.", "I escaped, but {a.first} lives next door to me. We bump into each other every day at the bakery. They wave. I'm moving."] }, fx: { happy: 4, rel: 10, actorRole: 'partner' }, mood: 'love' },
      ] },
      { label: { fr: 'Rester pour les croissants', en: 'Stay for croissants' }, text: { fr: ["Je suis resté{|e}. Les croissants étaient divins. {a.first} était charmant{a:|e}, sa mère aussi, les animaux empaillés un peu moins. On se revoit samedi. Je vais apporter {w:gift}.", "J'ai mangé les croissants en regardant le lion empaillé dans les yeux. Il m'a semblé qu'il approuvait. {a.first} et moi, c'est peut-être le début de quelque chose. Ou d'un documentaire."], en: ["I stayed. The croissants were divine. {a.first} was charming, so was their mom, the stuffed animals less so. We're seeing each other Saturday. I'll bring {w:gift}.", "I ate croissants staring the stuffed lion in the eyes. It seemed to approve. {a.first} and I might be the start of something. Or of a documentary."] }, fx: { happy: 8, rel: 15, actorRole: 'partner' }, mood: 'love' },
      { label: { fr: 'Dire la vérité brutale', en: 'Brutal honesty' }, text: { fr: ["J'ai dit : « Écoute, c'était sympa, mais ta déco me donne envie d'appeler la police. » {a.first} a ri. Puis pleuré. Puis m'a lancé un hibou empaillé. Je l'ai gardé. Il s'appelle Gérard.", "J'ai dit franchement : « Je ne me souviens ni de ton prénom, ni de comment je suis arrivé{|e} ici. » {a:Il|Elle} m'a répondu : « Moi non plus, je ne suis pas chez moi. » On a fui ensemble."], en: ["I said: 'Look, it was nice, but your decor makes me want to call the cops.' {a.first} laughed. Then cried. Then threw a stuffed owl at me. I kept it. His name is Gérard.", "I said frankly: 'I don't remember your name or how I got here.' They replied: 'Me neither, this isn't my place.' We fled together."] }, fx: { happy: 6, karma: 1 } },
    ],
  },

  // ═════════════════════════════ VENGEANCES ABSURDES ═════════════════════════════

  // ── Guerre de voisinage (3 étapes) ──
  {
    id: 'tr_nwar_1',
    icon: '💩',
    cat: 'trash',
    rating: 2,
    scene: { place: 'home', mood: 'angry', prop: 'lawn', fx: 'poop' },
    when: { age: [20, 85], noFlag: 'tr_nwar' },
    weight: 5,
    once: true,
    text: {
      fr: [
        "Pour la cinquième fois cette semaine, le chien du voisin, Gérald, a déposé un énorme étron sur ton paillasson. Gérald, le voisin, te salue depuis sa fenêtre en sirotant {w:drink}. Il sait.",
        "Ton voisin Gérald tond sa pelouse tous les dimanches à 7 h, garde ta poubelle « parce qu'elle est mieux que la sienne » et laisse son chien faire caca devant ta porte. Ce matin, tu as marché dedans pieds nus.",
        "Le voisin, Gérald, a garé son camping-car sur ta place, s'est branché sur ton électricité et a laissé {w:gross} sur ta boîte aux lettres. Il t'a dit « bonjour voisin ! » avec un grand sourire.",
        "Gérald, ton voisin, a coupé ta haie « parce qu'elle lui faisait de l'ombre » et l'a remplacée par une rangée de nains de jardin qui te font des doigts d'honneur. Son chien a fait caca au milieu.",
      ],
      en: [
        "For the fifth time this week, the neighbour's dog has left a massive turd on your doormat. Gérald, the neighbour, waves from his window, sipping {w:drink}. He knows.",
        "Your neighbour Gérald mows his lawn every Sunday at 7 a.m., keeps your bin 'because it's nicer than his', and lets his dog poop at your door. This morning, you stepped in it barefoot.",
        "Gérald, the neighbour, parked his RV in your spot, plugged into your electricity and left {w:gross} on your mailbox. He said 'morning, neighbour!' with a big smile.",
        "Gérald, your neighbour, cut down your hedge 'because it shaded his yard' and replaced it with a row of garden gnomes flipping you off. His dog pooped in the middle.",
      ],
    },
    choices: [
      { label: { fr: 'Lui rendre son colis', en: 'Return the package' }, text: { fr: ["J'ai ramassé l'étron, je l'ai emballé dans un joli papier cadeau avec un ruban, et je l'ai déposé sur son paillasson avec une carte : « Je crois que c'est à vous. » La guerre est déclarée.", "J'ai mis la crotte dans un sac en papier, je l'ai posé devant sa porte, j'ai sonné, et j'ai mis le feu au sac. Il l'a piétiné en pantoufles. La guerre a commencé."], en: ["I picked up the turd, wrapped it in pretty gift paper with a ribbon, and left it on his doormat with a card: 'I believe this is yours.' War is declared.", "I put the poop in a paper bag, left it at his door, rang the bell, and lit the bag on fire. He stomped on it in slippers. The war began."] }, fx: { happy: 10, karma: -2, flag: 'tr_nwar', schedule: { key: 'tr_nwar_2', years: 1 }, visual: 'poop' }, mood: 'happy' },
      { label: { fr: 'Engrais ultra-puissant', en: 'Super fertiliser revenge' }, text: { fr: ["J'ai versé quinze litres d'engrais sur sa pelouse, en forme de pénis géant. Trois semaines plus tard, un phallus vert fluo de vingt mètres poussait sur son terrain, visible depuis les avions. Il a riposté, évidemment.", "J'ai écrit « GÉRALD PUE » à l'engrais sur sa pelouse. L'herbe a poussé plus haut à cet endroit. Les voisins prenaient des photos. Il a juré vengeance."], en: ["I poured four gallons of fertiliser on his lawn in the shape of a giant penis. Three weeks later, a sixty-foot neon-green phallus grew on his property, visible from planes. He retaliated, obviously.", "I wrote 'GÉRALD STINKS' in fertiliser on his lawn. The grass grew taller there. The neighbours took pictures. He swore revenge."] }, fx: { happy: 12, karma: -3, flag: 'tr_nwar', schedule: { key: 'tr_nwar_2', years: 1 } }, mood: 'happy' },
      { label: { fr: 'Discuter calmement', en: 'Talk it out calmly' }, text: { fr: ["Je suis allé{|e} discuter calmement avec Gérald. Il m'a écouté{|e}, a hoché la tête, et m'a claqué la porte au nez. Le lendemain, il y avait deux crottes. Je laisse tomber, pour l'instant.", "J'ai tenté le dialogue. Gérald m'a répondu que son chien « a le droit de s'exprimer ». J'ai acheté un tuyau d'arrosage haute pression. Pour l'instant, il est dans le garage."], en: ["I went to talk calmly with Gérald. He listened, nodded, and slammed the door in my face. The next day there were two turds. I'm letting it go, for now.", "I tried dialogue. Gérald replied that his dog 'has the right to express himself'. I bought a high-pressure hose. For now it's in the garage."] }, fx: { karma: 3, stress: 4 } },
    ],
  },
  {
    id: 'tr_nwar_2',
    icon: '🦨',
    cat: 'trash',
    rating: 2,
    chainOnly: true,
    scene: { place: 'home', mood: 'angry', prop: 'lawn', fx: 'poop' },
    when: { flag: 'tr_nwar' },
    text: {
      fr: [
        "La guerre avec Gérald s'est intensifiée. Ce matin, ta voiture est recouverte de 500 post-it formant le mot « TOCARD ». Ta boîte aux lettres est pleine de {w:food} périmé. Il faut riposter.",
        "Gérald a lâché une mouffette dans ton jardin. Ta maison sent {w:smell} puissance mille. Les voisins changent de trottoir. Lui sifflote sur son balcon avec des jumelles.",
        "Gérald a branché un haut-parleur contre ton mur qui diffuse {w:song} en boucle, de 3 h à 6 h du matin. Tu n'as pas dormi depuis neuf jours. Tes yeux font des bruits.",
        "Gérald a inscrit ton adresse et ton numéro sur un site de rencontres pour amateurs de {w:hobby}. Tu reçois 80 messages par jour. Il a aussi peint ta boîte aux lettres en rose fluo.",
      ],
      en: [
        "The war with Gérald has escalated. This morning, your car is covered in 500 sticky notes spelling 'LOSER'. Your mailbox is full of expired {w:food}. Time to strike back.",
        "Gérald released a skunk in your yard. Your house smells like {w:smell} times a thousand. Neighbours cross the street. He whistles on his balcony with binoculars.",
        "Gérald plugged a speaker against your wall that plays {w:song} on loop from 3 to 6 a.m. You haven't slept in nine days. Your eyes are making noises.",
        "Gérald signed up your address and number on a dating site for {w:hobby} fans. You get 80 messages a day. He also painted your mailbox neon pink.",
      ],
    },
    choices: [
      { label: { fr: 'Catapulte à fumier', en: 'Manure catapult' }, text: { fr: ["J'ai construit une catapulte dans mon jardin et j'ai bombardé sa maison avec 300 kilos de fumier de cheval. Ça a duré toute la nuit. Sa piscine est devenue une fosse à purin. Il a juré l'apocalypse.", "Catapulte, fumier, et un tir parfait par sa fenêtre ouverte pendant son dîner d'anniversaire. Ses invités ont fui en hurlant. Il m'a envoyé une lettre : « Tu vas le payer. » Je l'attends."], en: ["I built a catapult in my yard and bombarded his house with 600 pounds of horse manure. It lasted all night. His pool turned into a slurry pit. He swore apocalypse.", "Catapult, manure, and a perfect shot through his open window during his birthday dinner. His guests fled screaming. He sent me a letter: 'You'll pay for this.' I'm waiting."] }, fx: { happy: 14, karma: -4, heat: 6, schedule: { key: 'tr_nwar_3', years: 1 }, visual: 'poop' }, mood: 'happy' },
      { label: { fr: 'Annonce « maison à donner »', en: '"Free house" listing' }, text: { fr: ["J'ai posté une annonce : « Maison à donner, entrez sans frapper, servez-vous ». Le week-end suivant, 200 personnes ont vidé sa maison. Un couple a même emporté sa baignoire. Il a promis une guerre totale.", "J'ai mis sa maison sur {w:app} comme « squat festif gratuit ». 150 fêtards ont débarqué. Il a fallu trois jours et deux escadrons de CRS. Gérald m'a regardé{|e} avec des yeux de tueur."], en: ["I posted an ad: 'House free to a good home, walk right in, help yourselves.' The next weekend, 200 people emptied his house. A couple even took his bathtub. He promised total war.", "I listed his house on {w:app} as a 'free party squat'. 150 partygoers showed up. It took three days and two riot squads. Gérald looked at me with killer eyes."] }, fx: { happy: 12, karma: -5, heat: 8, schedule: { key: 'tr_nwar_3', years: 1 } }, mood: 'happy' },
      { label: { fr: 'Demander la paix', en: 'Sue for peace' }, text: { fr: ["J'ai sonné chez Gérald avec un drapeau blanc et {w:drink}. Il a accepté la trêve, on a trinqué. Puis son chien a fait caca sur mon pied. Gérald a ri. La paix a duré quatre secondes. Mais j'ai décidé de lâcher l'affaire. Il a gagné.", "J'ai proposé la paix. On a signé un traité sur une nappe en papier. Je l'ai fait encadrer. Gérald l'a utilisé pour ramasser les crottes de son chien. J'abandonne, je déménage."], en: ["I rang Gérald's bell with a white flag and {w:drink}. He accepted the truce, we toasted. Then his dog pooped on my foot. Gérald laughed. Peace lasted four seconds. But I decided to let it go. He won.", "I offered peace. We signed a treaty on a paper tablecloth. I had it framed. Gérald used it to pick up his dog's poop. I give up, I'm moving."] }, fx: { karma: 4, happy: -4, unflag: 'tr_nwar' } },
    ],
  },
  {
    id: 'tr_nwar_3',
    icon: '💣',
    cat: 'trash',
    rating: 2,
    chainOnly: true,
    scene: { place: 'home', mood: 'angry', prop: 'lawn', fx: 'explosion' },
    when: { flag: 'tr_nwar' },
    text: {
      fr: [
        "La guerre avec Gérald atteint son apogée. Il a loué une pelleteuse. Il creuse une tranchée entre vos deux maisons. Il porte un casque militaire et chante {w:song} en creusant.",
        "Gérald a installé un canon à eau sur son toit et t'arrose dès que tu sors. Tu as un plan. Il implique une montgolfière, 50 kilos de paillettes et {w:animal}.",
        "Le quartier entier a choisi son camp. Ta rue est divisée en deux, comme Berlin. Gérald a fait imprimer des tee-shirts « Team Gérald ». Ce soir, c'est la bataille finale.",
        "Gérald a creusé sous ta piscine, a dressé une armée de pigeons pour chier sur ta voiture et a corrompu ton facteur. C'est l'heure de l'ultime vengeance.",
      ],
      en: [
        "The war with Gérald reaches its peak. He rented an excavator. He's digging a trench between your two houses. He's wearing a military helmet and singing {w:song} while digging.",
        "Gérald installed a water cannon on his roof and hoses you every time you step outside. You have a plan. It involves a hot-air balloon, 100 pounds of glitter and {w:animal}.",
        "The whole neighbourhood has picked sides. Your street is split in two like Berlin. Gérald printed 'Team Gérald' T-shirts. Tonight is the final battle.",
        "Gérald dug under your pool, trained an army of pigeons to poop on your car and bribed your mail carrier. It's time for the ultimate revenge.",
      ],
    },
    choices: [
      {
        label: { fr: 'Fosse septique piégée', en: 'Booby-trapped septic tank' },
        out: [
          { w: 2, text: { fr: ["J'ai trafiqué les canalisations pour que sa fosse septique refoule. Quand il a tiré la chasse, un geyser marron de quinze mètres a jailli de ses toilettes, de ses éviers et de sa piscine. Gérald a vendu sa maison la semaine suivante. VICTOIRE TOTALE.", "J'ai relié ma fosse septique à son arrosage automatique. À 6 h du matin, son jardin s'est transformé en champ de bataille de la Somme, version caca. Il est parti vivre chez sa sœur. Le quartier m'a érigé une statue en carton."], en: ["I rigged the pipes so his septic tank would back up. When he flushed, a 50-foot brown geyser shot out of his toilets, sinks and pool. Gérald sold his house the next week. TOTAL VICTORY.", "I connected my septic tank to his automatic sprinklers. At 6 a.m. his garden turned into a WWI battlefield, poop edition. He moved in with his sister. The neighbourhood built me a cardboard statue."] }, fx: { happy: 20, karma: -6, unflag: 'tr_nwar', visual: 'poop' }, mood: 'proud' },
          { w: 1, text: { fr: ["Le piège a fonctionné… à l'envers. Le geyser est sorti chez moi. De mes toilettes, de mes éviers, de ma douche, de mon frigo (je ne sais pas comment). Gérald a applaudi depuis son balcon. Il a gagné la guerre.", "Ma fosse a refoulé chez nous deux. On s'est retrouvés tous les deux dans la rue, couverts de merde, à se regarder. Puis on a éclaté de rire. On est amis maintenant. Le chien fait toujours caca chez moi."], en: ["The trap worked... backward. The geyser came out at my place. My toilets, my sinks, my shower, my fridge (I don't know how). Gérald applauded from his balcony. He won the war.", "The septic tank backed up at both our places. We ended up in the street, both covered in crap, looking at each other. Then we burst out laughing. We're friends now. The dog still poops at my place."] }, fx: { happy: -6, money: -3000, unflag: 'tr_nwar', visual: 'poop' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Bombe à paillettes géante', en: 'Giant glitter bomb' },
        out: [
          { w: 2, text: { fr: ["J'ai largué 50 kilos de paillettes depuis une montgolfière pile au-dessus de sa maison. Pour le reste de sa vie, Gérald brillera. Sa maison est visible depuis l'espace. Il a fini par déménager {w:far_place}. Il brille encore là-bas.", "Les paillettes ont tout recouvert : sa maison, son chien, sa voiture, son âme. Le chien ressemble à une boule disco. Gérald s'est rendu, à genoux, en scintillant. J'ai gagné."], en: ["I dropped 100 pounds of glitter from a hot-air balloon right over his house. For the rest of his life, Gérald will sparkle. His house is visible from space. He eventually moved {w:far_place}. He still sparkles there.", "The glitter covered everything: his house, his dog, his car, his soul. The dog looks like a disco ball. Gérald surrendered on his knees, sparkling. I won."] }, fx: { happy: 18, karma: -3, unflag: 'tr_nwar', visual: 'confetti' }, mood: 'proud' },
          { w: 1, text: { fr: ["Le vent a tourné. Les paillettes et la montgolfière sont retombées sur moi. Et sur le maire, qui passait. J'ai été arrêté{|e} pour « attentat scintillant ». Gérald a témoigné contre moi en souriant.", "La montgolfière s'est accrochée à une ligne électrique. Explosion de paillettes enflammées au-dessus du quartier. Magnifique et illégal. Les gendarmes m'attendaient à l'atterrissage."], en: ["The wind turned. The glitter and the balloon came down on me. And on the mayor, who was passing by. I was arrested for 'sparkly terrorism'. Gérald testified against me, smiling.", "The balloon snagged a power line. Explosion of flaming glitter over the neighbourhood. Gorgeous and illegal. The police were waiting when I landed."] }, fx: { arrest: 'vandal', unflag: 'tr_nwar', visual: 'explosion' }, mood: 'shock' },
        ],
      },
    ],
  },
];
