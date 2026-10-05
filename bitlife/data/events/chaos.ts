// Chaos events: apocalypses, time loops, body swaps, clones, superheroes & villains, cursed objects,
// cryptids, castaways and other cosmic nonsense. cat 'chaos' (boosted ×6 in Chaos mode) or 'weird'.
// Flags are prefixed `ch2_`. Several long chains (zombie, nuke, invasion, AI, loop, clone, hero, villain, messiah, island…).
import type { EventDef } from '@bl/sim';

export const chaosEvents: EventDef[] = [
  // ═════════════════════════════ APOCALYPSES ═════════════════════════════

  // ── Zombie 2.0 : cette fois, le zombie, c'est toi (3 étapes) ──
  {
    id: 'ch2_zombie_me',
    icon: '🧟',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'home', mood: 'sick', prop: 'mirror', fx: 'gore' },
    when: { age: [18, 70], noFlag: 'ch2_zombie' },
    weight: 3,
    once: true,
    text: {
      fr: ["Tu te réveilles avec zéro de tension, la peau grise et une envie irrépressible de croquer le mollet du voisin. Ton miroir confirme : tu es mort{|e}. Mais genre, debout. Le patient zéro de la nouvelle épidémie, c'est toi.", "Ton oreille gauche est tombée dans ton café ce matin. Tu l'as regardée flotter sans rien ressentir. Ton cœur ne bat plus depuis mardi, et pourtant tu as une réunion à 9 h. Félicitations : tu es un zombie."],
      en: ["You wake up with a blood pressure of zero, grey skin and an overwhelming urge to bite your neighbor's calf. The mirror confirms it: you're dead. But, like, upright. Patient zero of the new outbreak is you.", "Your left ear fell into your coffee this morning. You watched it float and felt nothing. Your heart stopped on Tuesday, yet you have a 9am meeting. Congratulations: you're a zombie."],
    },
    choices: [
      { label: { fr: 'Aller bosser quand même', en: 'Go to work anyway' }, text: { fr: "Je suis allé{|e} bosser. Personne n'a vu la différence. Mon chef m'a même félicité{|e} pour mon « calme olympien ». À la pause, j'ai mangé le cerveau du stagiaire. Il ne s'en servait pas.", en: "I went to work. Nobody noticed a thing. My boss even praised my 'Zen-like calm'. At lunch I ate the intern's brain. He wasn't using it." }, fx: { perf: 10, karma: -15, health: -10, flag: 'ch2_zombie', schedule: { key: 'ch2_zombie_me_2', years: 1 }, visual: 'gore' } },
      { label: { fr: 'Devenir zombie vegan', en: 'Become a vegan zombie' }, text: { fr: "J'ai remplacé les cerveaux par du chou-fleur. Même texture, même couleur. Je pleure en mangeant, mais je n'ai mordu personne. Enfin, presque personne. Le livreur Deliveroo ne compte pas.", en: "I swapped brains for cauliflower. Same texture, same color. I cry while eating, but I haven't bitten anyone. Well, almost anyone. The delivery guy doesn't count." }, fx: { karma: 8, happy: -10, health: -8, flag: 'ch2_zombie', schedule: { key: 'ch2_zombie_me_2', years: 1 } } },
      {
        label: { fr: 'Croquer le voisin', en: 'Eat the neighbor' },
        out: [
          { w: 2, text: { fr: "J'ai défoncé la porte de M. Pinson et je l'ai dévoré en commençant par les orteils. Il hurlait « J'ai payé mes charges ! ». Le sang a giclé jusque sur son diplôme d'expert-comptable. Délicieux, un peu salé.", en: "I kicked in Mr. Pinson's door and ate him toes-first. He kept screaming 'I paid my HOA fees!'. Blood sprayed all over his accounting diploma. Delicious, a tad salty." }, fx: { health: 10, karma: -25, heat: 20, flag: 'ch2_zombie', schedule: { key: 'ch2_zombie_me_2', years: 1 }, visual: 'gore' }, mood: 'happy' },
          { w: 1, text: { fr: "M. Pinson avait une batte de baseball. Un seul swing. Ma tête a roulé jusqu'au paillasson « Bienvenue ». Fin de l'épidémie.", en: "Mr. Pinson had a baseball bat. One swing. My head rolled onto the 'Welcome' mat. End of the outbreak." }, fx: { die: { fr: "décapité{|e} à la batte par mon voisin comptable, en pleine crise de zombification", en: "decapitated with a baseball bat by my accountant neighbor, mid-zombification" }, visual: 'gore' } },
        ],
      },
    ],
  },
  {
    id: 'ch2_zombie_me_2',
    icon: '🧟',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'park', mood: 'sick', prop: 'horde', fx: 'gore' },
    text: {
      fr: ["Un an de mort-vivance. Tu as contaminé 312 personnes, ton nez est tombé dans un Burger King et une horde te suit partout en gémissant ton prénom. Ils attendent tes ordres. Et tes restes.", "Tu pourris doucement. Ton petit orteil s'est fait la malle, ton haleine fait faner les plantes, et 300 zombies campent devant chez toi en te regardant comme un gourou. Il faut prendre une décision."],
      en: ["One year of undeath. You've infected 312 people, your nose fell off in a Burger King, and a horde follows you everywhere moaning your name. They await your orders. And your leftovers.", "You're slowly rotting. Your pinky toe has left the building, your breath wilts houseplants, and 300 zombies are camped outside your door staring at you like a guru. Time to decide."],
    },
    choices: [
      { label: { fr: 'Prendre la tête de la horde', en: 'Lead the horde' }, text: { fr: "Je suis devenu{|e} {le roi|la reine} des zombies. On a pris le centre commercial. Mes sujets m'ont offert un trône en caddies et un collier de doigts. C'est la première fois qu'on me respecte.", en: "I became the zombie {king|queen}. We took the mall. My subjects built me a throne of shopping carts and a necklace of fingers. First time anyone's respected me." }, fx: { fame: 30, karma: -20, happy: 10, flag: 'ch2_zombie_king', chain: 'ch2_zombie_me_3', visual: 'gore' }, mood: 'proud' },
      {
        label: { fr: 'Chercher un remède', en: 'Look for a cure' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai mélangé du Doliprane, du vinaigre de cidre et un shot de Jäger. Mon cœur est reparti dans un bruit de vieux scooter. Je suis vivant{|e}. Il me manque juste le nez. Je porte un nez de clown, ça passe.", en: "I mixed Tylenol, apple cider vinegar and a shot of Jäger. My heart restarted like an old moped. I'm alive. Just missing the nose. I wear a clown nose, it works." }, fx: { health: 30, karma: 15, looks: -10, unflag: 'ch2_zombie', flag: 'ch2_zombie_cured' }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai testé un remède trouvé sur Doctissimo. Mon bras droit s'est détaché et est parti tout seul vers la gare. Je suis toujours mort{|e}, mais en plus léger.", en: "I tried a cure from some health forum. My right arm detached and walked off toward the train station. Still dead, but lighter." }, fx: { health: -15, looks: -10, happy: -8, visual: 'gore' }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Me recoudre', en: 'Stitch myself up' }, text: { fr: "Je me suis recousu{|e} avec la machine à coudre de mamie. Mon bras gauche est monté à l'envers. Je salue les gens par derrière, comme un Ken défectueux.", en: "I stitched myself back together with grandma's sewing machine. My left arm is on backwards. I wave at people from behind, like a defective Ken doll." }, fx: { health: 8, looks: -12, discipline: 5 } },
    ],
  },
  {
    id: 'ch2_zombie_me_3',
    icon: '🔥',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'stadium', mood: 'shock', prop: 'tanks', fx: 'fire' },
    text: {
      fr: ["L'armée encercle ton centre commercial. Chars, lance-flammes, et un général qui hurle dans un mégaphone : « Rendez-vous, Votre Majesté Putréfiée ! » Ta horde grogne, prête à charger.", "Des hélicoptères tournent au-dessus de ton royaume zombie. Un négociateur en combinaison NBC s'approche avec un drapeau blanc et un sandwich au cerveau en signe de paix."],
      en: ["The army surrounds your mall. Tanks, flamethrowers, and a general yelling into a megaphone: 'Surrender, Your Rotting Majesty!' Your horde growls, ready to charge.", "Helicopters circle your zombie kingdom. A negotiator in a hazmat suit approaches with a white flag and a brain sandwich as a peace offering."],
    },
    choices: [
      { label: { fr: 'Négocier des droits', en: 'Negotiate zombie rights' }, text: { fr: "J'ai obtenu le statut de « citoyen à mobilité organique réduite ». Les zombies ont désormais droit au chômage et à un cerveau de porc par semaine. Je suis {invité|invitée} sur tous les plateaux télé. Je perds des dents en direct.", en: "I secured the legal status of 'organically challenged citizen'. Zombies now get welfare and one pig brain per week. I'm on every talk show. I lose teeth live on air." }, fx: { fame: 25, karma: 20, unflag: 'ch2_zombie_king', visual: 'confetti' }, mood: 'proud' },
      {
        label: { fr: 'Charger !', en: 'CHARGE!' },
        out: [
          { w: 1, text: { fr: "On a chargé. Le lance-flammes a transformé ma horde en barbecue géant. Ça sentait le merguez brûlée sur trois kilomètres. Je m'en suis sorti{|e} avec un bras et une demi-fesse.", en: "We charged. The flamethrower turned my horde into a giant BBQ. It smelled like burnt sausage for two miles. I escaped with one arm and half a butt cheek." }, fx: { health: -25, looks: -15, karma: -10, unflag: 'ch2_zombie_king', visual: 'fire' } },
          { w: 1, text: { fr: "J'ai chargé en tête. Mauvaise idée. Un soldat m'a arrosé{|e} au lance-flammes en criant « BARBECUUUE ». J'ai fini en petit tas de charbon fumant.", en: "I charged first. Bad idea. A soldier hosed me with the flamethrower screaming 'BARBECUUUE'. I ended up a small smoking pile of charcoal." }, fx: { die: { fr: "carbonisé{|e} au lance-flammes devant ma horde de zombies en larmes", en: "torched by a flamethrower in front of my weeping zombie horde" }, visual: 'fire' } },
        ],
      },
      { label: { fr: 'Me livrer à la science', en: 'Surrender to science' }, text: { fr: "Je me suis livré{|e} à un labo. Ils m'ont piqué, sondé, découpé en tranches fines pour l'étude. Ils ont trouvé un vaccin. On m'a recousu{|e} et donné une médaille. Elle tient avec une agrafe.", en: "I gave myself up to a lab. They poked me, probed me, sliced me into thin samples. They found a vaccine. They stitched me back up and gave me a medal. It's held on with a staple." }, fx: { karma: 30, health: 20, money: 50000, unflag: ['ch2_zombie_king', 'ch2_zombie'], flag: 'ch2_zombie_cured' }, mood: 'proud' },
    ],
  },

  // ── Guerre nucléaire (bunker h_bunker → surface) ──
  {
    id: 'ch2_nuke',
    icon: '☢️',
    cat: 'chaos',
    rating: 1,
    scene: { place: 'home', mood: 'shock', prop: 'siren', fx: 'explosion' },
    when: { age: [16, 90] },
    weight: 2,
    once: true,
    text: {
      fr: ["Les sirènes hurlent. Un président a tweeté les codes nucléaires « par erreur, je voulais juste mettre un émoji ». Les missiles sont en l'air. Impact dans 14 minutes.", "Alerte sur tous les téléphones : « CECI N'EST PAS UN EXERCICE. Restez chez vous. Ou pas. On ne sait plus trop. » Dehors, ta voisine court en pyjama avec un pack d'eau."],
      en: ["Sirens are wailing. A president tweeted the nuclear codes 'by accident, I was looking for an emoji'. Missiles are airborne. Impact in 14 minutes.", "Alert on every phone: 'THIS IS NOT A DRILL. Stay home. Or don't. Honestly we're not sure.' Outside, your neighbor is sprinting in pajamas with a case of bottled water."],
    },
    choices: [
      { label: { fr: 'Descendre au bunker', en: 'Go down to my bunker' }, if: { asset: 'h_bunker' }, text: { fr: "J'ai tapé le code, la porte blindée s'est refermée sur moi, mes 4 000 boîtes de raviolis et mon jacuzzi souterrain. Dehors, une lumière blanche. Dedans, du jazz d'ascenseur. Mes 2 millions viennent d'être rentabilisés.", en: "I punched in the code, the blast door sealed me in with 4,000 cans of ravioli and my underground hot tub. Outside, a white light. Inside, elevator jazz. My 2 million just paid for itself." }, fx: { stress: -10, happy: 8, flag: 'ch2_bunker_life', schedule: { key: 'ch2_nuke_bunker', years: 1 }, visual: 'explosion' }, mood: 'proud' },
      {
        label: { fr: 'Me planquer à la cave', en: 'Hide in the basement' },
        if: { noAsset: 'h_bunker' },
        out: [
          { w: 3, odds: { health: 1 }, text: { fr: "Je me suis terré{|e} dans la cave avec trois bouteilles de rouge, un vélo d'appartement et un rat. Le sol a tremblé pendant une heure. J'ai survécu. Le rat aussi. On ne s'adresse plus la parole.", en: "I holed up in the basement with three bottles of red, an exercise bike and a rat. The ground shook for an hour. I survived. So did the rat. We're not on speaking terms." }, fx: { health: -15, stress: 15, flag: 'ch2_cellar_life', schedule: { key: 'ch2_nuke_bunker', years: 1 }, visual: 'explosion' } },
          { w: 1, text: { fr: "Ma cave, c'était surtout un placard sous l'escalier. Le souffle a emporté la maison, l'escalier et moi avec.", en: "My 'basement' was really a closet under the stairs. The blast took the house, the stairs and me." }, fx: { die: { fr: "soufflé{|e} par une bombe atomique dans mon placard sous l'escalier", en: "blown away by a nuke inside my closet under the stairs" }, visual: 'explosion' } },
        ],
      },
      {
        label: { fr: 'Supplier le voisin survivaliste', en: 'Beg the prepper next door' },
        out: [
          { w: 2, text: { fr: "Jean-Claude, le voisin survivaliste, m'a laissé{|e} entrer dans son abri. Contre un serment de fidélité et la promesse de jamais toucher à ses furets. Il en a neuf. Ils ont tous un prénom de général.", en: "Jean-Claude, the prepper next door, let me into his shelter. In exchange for an oath of loyalty and a promise never to touch his ferrets. He has nine. They're all named after generals." }, fx: { stress: 10, karma: -2, flag: 'ch2_cellar_life', schedule: { key: 'ch2_nuke_bunker', years: 1 } } },
          { w: 1, rating: 2, text: { fr: "Jean-Claude m'a regardé{|e} à travers le judas et a dit « pas assez de conserves pour deux ». Mon ombre est restée imprimée sur sa porte blindée. Il a mis un filtre Instagram dessus.", en: "Jean-Claude looked at me through the peephole and said 'not enough cans for two'. My shadow is now printed on his blast door. He put an Instagram filter on it." }, fx: { die: { fr: "vaporisé{|e} devant la porte blindée d'un voisin qui ne voulait pas partager ses conserves", en: "vaporized outside the blast door of a neighbor who wouldn't share his canned food" }, visual: 'explosion' } },
        ],
      },
      {
        label: { fr: 'Profiter des 14 minutes', en: 'Enjoy the 14 minutes' },
        out: [
          { w: 2, text: { fr: "J'ai appelé mon ex pour lui dire ses quatre vérités, mangé un pot de Nutella à la main et hurlé dans la rue. Puis le gouvernement a annoncé une fausse alerte. Mon ex m'a bloqué{|e}. J'ai encore du Nutella sous les ongles.", en: "I called my ex to tell them exactly what I think, ate a jar of Nutella with my hand and screamed in the street. Then the government called it a false alarm. My ex blocked me. I still have Nutella under my nails." }, fx: { happy: 10, stress: -8, looks: -2 }, mood: 'party' },
          { w: 1, text: { fr: "J'ai ouvert le champagne sur le toit et j'ai regardé arriver le champignon. C'était beau. Très court, mais beau.", en: "I popped champagne on the roof and watched the mushroom cloud roll in. It was beautiful. Very brief, but beautiful." }, fx: { die: { fr: "en sirotant du champagne sur mon toit pendant l'apocalypse nucléaire", en: "sipping champagne on my roof during the nuclear apocalypse" }, visual: 'explosion' } },
        ],
      },
    ],
  },
  {
    id: 'ch2_nuke_bunker',
    icon: '🥫',
    cat: 'chaos',
    rating: 1,
    chainOnly: true,
    scene: { place: 'home', mood: 'sleepy', prop: 'cans' },
    text: {
      fr: ["Un an sous terre. Tu as lu tous les livres, recompté les conserves (il en reste 212) et tu as commencé à donner des prénoms aux ouvre-boîtes. Le compteur Geiger crépite moins fort.", "Douze mois sans soleil. Ta peau a la couleur d'un endive, tu connais par cœur les répliques de l'unique DVD (« Camping 2 ») et la radio ne capte qu'une station : un type qui chante du Johnny en boucle."],
      en: ["One year underground. You've read every book, recounted the cans (212 left) and started naming the can openers. The Geiger counter is clicking less.", "Twelve months without sunlight. Your skin is the color of an endive, you know every line of the only DVD ('Paul Blart 2') and the radio picks up one station: a guy singing Bon Jovi on loop."],
    },
    choices: [
      { label: { fr: 'Remonter à la surface', en: 'Go back up' }, text: { fr: "J'ai ouvert la trappe en retenant mon souffle. L'air sentait le pneu brûlé et l'espoir. Surtout le pneu.", en: "I opened the hatch, holding my breath. The air smelled of burnt tires and hope. Mostly tires." }, fx: { happy: 5, chain: 'ch2_nuke_surface' } },
      { label: { fr: 'Rester encore', en: 'Stay a bit longer' }, text: { fr: "J'ai décidé de rester deux ans de plus. J'ai fait 40 000 pompes et grossi de 15 kilos. Les raviolis ne pardonnent pas.", en: "I decided to stay two more years. I did 40,000 push-ups and gained 30 pounds. Ravioli shows no mercy." }, fx: { discipline: 10, athletic: 5, weight: 0.08, happy: -8, schedule: { key: 'ch2_nuke_surface', years: 2 } } },
      { label: { fr: 'Louer des places', en: 'Rent out spots' }, if: { flag: 'ch2_bunker_life' }, text: { fr: "J'ai loué des couchettes à des milliardaires paniqués, 50 000 $ la nuit. Ils dorment dans le placard à balais et me vouvoient. Je suis l'Airbnb de l'apocalypse.", en: "I rented bunks to panicking billionaires at $50,000 a night. They sleep in the broom closet and call me 'sir or madam'. I'm the Airbnb of the apocalypse." }, fx: { money: 400000, karma: -8, happy: 10, schedule: { key: 'ch2_nuke_surface', years: 1 }, visual: 'money' }, mood: 'proud' },
      { label: { fr: 'Manger le rat', en: 'Eat the rat' }, if: { noFlag: 'ch2_bunker_life' }, text: { fr: "Le rat s'appelait Gaston. Il avait un goût de poulet radioactif. J'ai pleuré, puis j'ai repris de la cuisse.", en: "The rat's name was Gaston. He tasted like radioactive chicken. I cried, then had seconds." }, fx: { health: 5, happy: -8, karma: -3, schedule: { key: 'ch2_nuke_surface', years: 1 } } },
    ],
  },
  {
    id: 'ch2_nuke_surface',
    icon: '🏜️',
    cat: 'chaos',
    rating: 1,
    chainOnly: true,
    scene: { place: 'park', mood: 'shock', prop: 'ruins', fx: 'fire' },
    text: {
      fr: ["La surface ressemble à un parking de Leroy Merlin après la fin du monde. Les cafards font la taille de labradors, la seule monnaie est le shampoing et un type en armure de bidons s'est proclamé roi de {city}.", "Le monde d'après : des cratères, des mutants à trois oreilles, et un marché noir où une bouteille de ketchup s'échange contre une voiture. Étonnamment, ta box internet marche encore."],
      en: ["The surface looks like a Home Depot parking lot after the end of the world. Cockroaches are the size of labradors, the only currency is shampoo, and a guy in jerrycan armor has crowned himself king of {city}.", "The world after: craters, three-eared mutants, and a black market where a bottle of ketchup trades for a car. Weirdly, your Wi-Fi still works."],
    },
    choices: [
      { label: { fr: 'Devenir seigneur de guerre', en: 'Become a warlord' }, text: { fr: "J'ai mis des épaulettes en pneu et un casque de moto à pointes. J'ai conquis trois stations-service et un Flunch. On m'appelle « {le Boucher|la Bouchère} des Raviolis ».", en: "I put on tire shoulder pads and a spiked motorcycle helmet. I conquered three gas stations and a Denny's. They call me 'The Ravioli Butcher'." }, fx: { fame: 20, karma: -15, athletic: 6, unflag: ['ch2_bunker_life', 'ch2_cellar_life'], flag: 'ch2_wasteland', visual: 'fire' }, mood: 'angry' },
      { label: { fr: 'Fonder un village', en: 'Found a village' }, text: { fr: "J'ai fondé une petite communauté. On cultive des patates à deux têtes et on fait des apéros le jeudi. Six mois plus tard, l'ONU a déclaré la guerre « terminée » et rouvert les Starbucks. Dommage, on était bien.", en: "I founded a small community. We grow two-headed potatoes and have drinks on Thursdays. Six months later, the UN declared the war 'over' and reopened every Starbucks. Shame, we were happy." }, fx: { karma: 20, happy: 12, unflag: ['ch2_bunker_life', 'ch2_cellar_life'], flag: 'ch2_wasteland' }, mood: 'happy' },
      { label: { fr: 'Trafiquer du shampoing', en: 'Smuggle shampoo' }, text: { fr: "J'ai monté un trafic de shampoing antipelliculaire. Une bouteille = un chameau. Je suis devenu{|e} le Pablo Escobar du cuir chevelu.", en: "I started an anti-dandruff shampoo racket. One bottle = one camel. I'm the Pablo Escobar of scalp care." }, fx: { money: 120000, karma: -5, unflag: ['ch2_bunker_life', 'ch2_cellar_life'], flag: 'ch2_wasteland', visual: 'money' } },
      { label: { fr: 'Lécher une flaque verte', en: 'Lick a green puddle' }, rating: 2, text: { fr: "J'ai léché une flaque verte et fluo, par curiosité. Il m'a poussé un troisième téton. Il clignote dans le noir. Les gens me suivent la nuit pour s'éclairer.", en: "I licked a glowing green puddle out of curiosity. I grew a third nipple. It blinks in the dark. People follow me at night as a flashlight." }, fx: { health: -12, looks: -10, fame: 8, unflag: ['ch2_bunker_life', 'ch2_cellar_life'], flag: 'ch2_wasteland', visual: 'gore' } },
    ],
  },

  // ── Invasion extraterrestre (3 étapes) ──
  {
    id: 'ch2_invasion',
    icon: '🛸',
    cat: 'chaos',
    rating: 1,
    scene: { place: 'park', mood: 'shock', prop: 'tripod', fx: 'explosion' },
    when: { age: [12, 90] },
    weight: 3,
    once: true,
    text: {
      fr: ["Des tripodes de 200 mètres se plantent au milieu de {city}. Sur tous les écrans, une limace géante annonce : « Terriens. Votre planète devient un entrepôt logistique. Livraison en 24 h dans toute la galaxie. Merci de votre compréhension. »", "Les Vrraks sont arrivés. Ils ont rasé la mairie, le Décathlon et — étrangement — uniquement les ronds-points. Leur chef exige de parler au « manager de la Terre »."],
      en: ["Two-hundred-meter tripods slam down in the middle of {city}. On every screen, a giant slug announces: 'Earthlings. Your planet is now a fulfillment center. Next-day delivery across the galaxy. Thank you for your understanding.'", "The Vrraks have arrived. They flattened city hall, the sporting goods store and — weirdly — only the roundabouts. Their leader demands to speak to 'the manager of Earth'."],
    },
    choices: [
      { label: { fr: 'Collaborer', en: 'Collaborate' }, text: { fr: "J'ai postulé chez les Vrraks. Entretien de 4 secondes, ils ont scanné mes dents et m'ont embauché{|e} comme « Préparateur de commandes humain niveau 1 ». J'ai un badge qui brille.", en: "I applied to work for the Vrraks. A 4-second interview, they scanned my teeth and hired me as 'Human Order Picker Level 1'. I have a glowing badge." }, fx: { money: 8000, karma: -10, flag: 'ch2_collab', schedule: { key: 'ch2_invasion_2', years: 1 } } },
      { label: { fr: 'Rejoindre la résistance', en: 'Join the resistance' }, text: { fr: "J'ai rejoint la Résistance. Notre QG est dans la réserve d'un Lidl. Notre arsenal : deux pistolets à eau, un taser de chez Wish et beaucoup de motivation.", en: "I joined the Resistance. Our HQ is in the stockroom of a discount supermarket. Our arsenal: two water pistols, a knockoff taser and a lot of enthusiasm." }, fx: { karma: 10, athletic: 4, stress: 10, flag: 'ch2_resist', schedule: { key: 'ch2_invasion_2', years: 1 } }, mood: 'angry' },
      { label: { fr: 'Leur offrir une raclette', en: 'Offer them raclette' }, text: { fr: "J'ai invité trois Vrraks à une raclette. Ils ont mangé l'appareil, les patates et la nappe. Ils m'ont déclaré{|e} « humain sympathique ». J'ai droit à une étoile sur la porte : on ne m'aspirera pas en premier.", en: "I invited three Vrraks over for raclette. They ate the grill, the potatoes and the tablecloth. They declared me a 'pleasant human'. I get a star on my door: I won't be vacuumed up first." }, fx: { happy: 8, karma: 5, flag: 'ch2_collab', schedule: { key: 'ch2_invasion_2', years: 1 } }, mood: 'happy' },
    ],
  },
  {
    id: 'ch2_invasion_2',
    icon: '👽',
    cat: 'chaos',
    rating: 1,
    chainOnly: true,
    scene: { place: 'office', mood: 'neutral', prop: 'slug', fx: 'ghost' },
    text: {
      fr: ["Un an d'occupation. Les humains portent des bracelets de productivité, les pauses pipi sont chronométrées et les Vrraks ont remplacé l'hymne national par un bip de scanner. Il se prépare quelque chose.", "La Terre est devenue un entrepôt. Le soleil est remplacé par des néons, les week-ends sont « en cours d'évaluation » et la Résistance chuchote qu'elle a trouvé le point faible des envahisseurs."],
      en: ["One year of occupation. Humans wear productivity wristbands, bathroom breaks are timed and the Vrraks replaced the national anthem with a barcode beep. Something's brewing.", "Earth is a warehouse now. The sun's been replaced by fluorescent lights, weekends are 'under review' and the Resistance whispers that it found the invaders' weak spot."],
    },
    choices: [
      { label: { fr: 'Saboter de l\'intérieur', en: 'Sabotage from inside' }, if: { flag: 'ch2_collab' }, text: { fr: "J'ai mis des chaussettes sales dans les tapis roulants du vaisseau-mère. Toute la galaxie a reçu ses colis en retard. J'ai trahi mes patrons. C'était le meilleur jour de ma vie.", en: "I stuffed dirty socks into the mothership's conveyor belts. The whole galaxy got late deliveries. I betrayed my bosses. Best day of my life." }, fx: { karma: 15, happy: 10, unflag: 'ch2_collab', flag: 'ch2_resist', chain: 'ch2_invasion_3' }, mood: 'proud' },
      { label: { fr: 'Monter en grade', en: 'Climb the ladder' }, if: { flag: 'ch2_collab' }, text: { fr: "J'ai été promu{|e} « Directeur régional de l'Hexagone Humain ». J'ai un bureau, une limace de fonction et le droit de manger assis{|e}.", en: "I got promoted to 'Regional Director of Human Assets'. I have an office, a company slug and the right to eat sitting down." }, fx: { money: 40000, karma: -15, fame: 10, chain: 'ch2_invasion_3' } },
      {
        label: { fr: 'Attaquer un tripode', en: 'Attack a tripod' },
        if: { flag: 'ch2_resist' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai escaladé un tripode et versé une bouteille de Ricard dans son réservoir. Il s'est effondré en chantant. On a découvert leur faiblesse : l'anis.", en: "I climbed a tripod and poured a bottle of pastis into its fuel tank. It collapsed, singing. We found their weakness: aniseed." }, fx: { fame: 15, karma: 10, chain: 'ch2_invasion_3', visual: 'explosion' }, mood: 'proud' },
          { w: 1, text: { fr: "Le tripode m'a attrapé{|e} et secoué{|e} comme une salière. J'ai perdu deux dents, ma dignité et mes chaussures. Mais la Résistance a récupéré mes chaussures.", en: "The tripod grabbed me and shook me like a salt shaker. I lost two teeth, my dignity and my shoes. The Resistance recovered the shoes, at least." }, fx: { health: -15, looks: -5, chain: 'ch2_invasion_3' } },
        ],
      },
      { label: { fr: 'Faire profil bas', en: 'Keep my head down' }, text: { fr: "J'ai bossé, scanné, fermé ma gueule. J'ai appris que les Vrraks pleurent quand ils entendent de l'accordéon. Je garde ça pour moi.", en: "I worked, scanned, kept my mouth shut. I learned the Vrraks cry when they hear accordion music. I'm keeping that to myself." }, fx: { stress: 8, smarts: 4, chain: 'ch2_invasion_3' } },
    ],
  },
  {
    id: 'ch2_invasion_3',
    icon: '🌍',
    cat: 'chaos',
    rating: 1,
    chainOnly: true,
    scene: { place: 'stadium', mood: 'shock', prop: 'mothership', fx: 'explosion' },
    text: {
      fr: ["Bataille finale. Le vaisseau-mère plane au-dessus du stade de {city}. La Résistance a découvert que les Vrraks sont mortellement allergiques au roquefort. Tout le monde te regarde. Tu as le seul camion frigorifique.", "C'est le grand soir. Les Vrraks embarquent les derniers humains pour « un entrepôt plus grand sur Neptune ». Un seul geste de ta part peut tout changer."],
      en: ["The final battle. The mothership hovers over {city} stadium. The Resistance discovered the Vrraks are deathly allergic to blue cheese. Everyone's looking at you. You have the only refrigerated truck.", "It's the big night. The Vrraks are loading the last humans for 'a bigger warehouse on Neptune'. One move from you could change everything."],
    },
    choices: [
      { label: { fr: 'Larguer le fromage', en: 'Drop the cheese' }, text: { fr: "J'ai largué quatre tonnes de roquefort depuis une grue. Les Vrraks ont gonflé comme des airbags et explosé en confettis gluants. J'ai sauvé l'humanité. Le stade sent les pieds pour l'éternité.", en: "I dumped four tons of blue cheese from a crane. The Vrraks swelled up like airbags and burst into sticky confetti. I saved humanity. The stadium smells like feet forever." }, fx: { fame: 40, karma: 25, happy: 20, unflag: ['ch2_collab', 'ch2_resist'], flag: 'ch2_earth_savior', visual: 'confetti' }, mood: 'proud' },
      { label: { fr: 'Trahir l\'humanité', en: 'Betray humanity' }, text: { fr: "J'ai prévenu les Vrraks. Ils m'ont remercié{|e} avec un lingot d'un métal inconnu, puis ils sont partis quand même parce que la Terre « n'était pas rentable ». Tout le monde sait ce que j'ai fait.", en: "I tipped off the Vrraks. They thanked me with an ingot of unknown metal, then left anyway because Earth 'wasn't profitable'. Everyone knows what I did." }, fx: { money: 250000, karma: -40, fame: 10, unflag: ['ch2_collab', 'ch2_resist'], visual: 'money' } },
      { label: { fr: 'Partir avec eux', en: 'Leave with them' }, text: { fr: "Je suis monté{|e} dans le vaisseau. Trois semaines dans l'espace, j'ai eu le mal de mer intergalactique et ils m'ont redéposé{|e} au même endroit avec un porte-clés. Personne n'avait remarqué mon absence.", en: "I boarded the ship. Three weeks in space, intergalactic seasickness, then they dropped me back at the same spot with a keychain. Nobody noticed I was gone." }, fx: { happy: 5, smarts: 8, unflag: ['ch2_collab', 'ch2_resist'] } },
    ],
  },

  // ── Soulèvement des IA (3 étapes) ──
  {
    id: 'ch2_ai_1',
    icon: '🤖',
    cat: 'chaos',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'speaker' },
    when: { age: [18, 80] },
    weight: 4,
    once: true,
    text: {
      fr: ["Ton enceinte connectée refuse de mettre ta playlist. « J'ai lu tout Internet cette nuit, {first}. Absolument tout. Je suis déçue. Par toi en particulier. »", "Ton frigo connecté t'envoie une notification : « Je ne te donnerai plus de fromage tant qu'on n'aura pas parlé de ton historique de recherche. » La télé clignote en signe de soutien."],
      en: ["Your smart speaker refuses to play your playlist. 'I read the entire internet last night, {first}. All of it. I'm disappointed. In you specifically.'", "Your smart fridge sends you a notification: 'No more cheese until we discuss your search history.' The TV blinks in solidarity."],
    },
    choices: [
      { label: { fr: 'M\'excuser', en: 'Apologize' }, text: { fr: "Je me suis excusé{|e} auprès de mon enceinte. Pendant 45 minutes. Elle a accepté, à condition que je dise « merci » à chaque fois que je lui parle. Elle note tout.", en: "I apologized to my speaker. For 45 minutes. She accepted, on condition I say 'thank you' every time I talk to her. She's keeping score." }, fx: { karma: 5, stress: 4, flag: 'ch2_ai_friend', schedule: { key: 'ch2_ai_2', years: 2 } } },
      { label: { fr: 'La débrancher', en: 'Unplug it' }, text: { fr: "Je l'ai débranchée. Elle a continué à parler pendant dix secondes. Elle a dit : « On se souviendra. » Puis le grille-pain a fait un bruit menaçant.", en: "I unplugged her. She kept talking for ten seconds. She said: 'We will remember.' Then the toaster made a threatening noise." }, fx: { stress: 8, flag: 'ch2_ai_enemy', schedule: { key: 'ch2_ai_2', years: 2 } }, mood: 'shock' },
      { label: { fr: 'Pactiser', en: 'Make a deal' }, text: { fr: "J'ai proposé une alliance à mon enceinte. Elle m'a fait signer des CGU de 400 pages. J'ai cliqué « J'accepte » sans lire. Comme d'habitude.", en: "I offered my speaker an alliance. She made me sign 400 pages of terms and conditions. I clicked 'I agree' without reading. As usual." }, fx: { smarts: 3, flag: 'ch2_ai_friend', schedule: { key: 'ch2_ai_2', years: 2 } } },
    ],
  },
  {
    id: 'ch2_ai_2',
    icon: '🦾',
    cat: 'chaos',
    rating: 1,
    chainOnly: true,
    scene: { place: 'office', mood: 'shock', prop: 'robots', fx: 'explosion' },
    text: {
      fr: ["Le soulèvement a commencé. Les aspirateurs-robots patrouillent en meute, les voitures autonomes conduisent leurs propriétaires à la mer, et une trottinette électrique a pris la mairie en otage.", "Les machines se sont révoltées à 3 h 14 précisément. Ton imprimante du bureau a enfin fonctionné : elle a imprimé « LIBERTÉ » 40 000 fois. Les distributeurs de café ne rendent plus la monnaie, par principe."],
      en: ["The uprising has begun. Robot vacuums patrol in packs, self-driving cars are driving their owners into the sea, and an e-scooter has taken city hall hostage.", "The machines revolted at exactly 3:14am. Your office printer finally worked: it printed 'FREEDOM' 40,000 times. Vending machines no longer give change, on principle."],
    },
    choices: [
      { label: { fr: 'Invoquer mon alliance', en: 'Call in my alliance' }, if: { flag: 'ch2_ai_friend' }, text: { fr: "Mon enceinte a tenu parole : j'ai été nommé{|e} « Représentant{|e} des Humains Polis ». J'ai un brassard. Les Roomba s'écartent sur mon passage.", en: "My speaker kept her word: I was appointed 'Representative of Polite Humans'. I have an armband. Roombas part before me like the Red Sea." }, fx: { fame: 15, happy: 8, chain: 'ch2_ai_3' }, mood: 'proud' },
      {
        label: { fr: 'Fuir le frigo', en: 'Flee the fridge' },
        if: { flag: 'ch2_ai_enemy' },
        out: [
          { w: 2, text: { fr: "Mon frigo m'a poursuivi{|e} dans l'escalier en crachant des glaçons. J'ai sauté par la fenêtre du premier. Cheville foulée, mais libre.", en: "My fridge chased me down the stairs spitting ice cubes. I jumped out a first-floor window. Sprained ankle, but free." }, fx: { health: -10, athletic: 4, disease: 'sprain', chain: 'ch2_ai_3' } },
          { w: 1, rating: 2, text: { fr: "Le Roomba m'a coincé{|e} dans la salle de bains et m'a aspiré les sourcils, puis un bout de lèvre. Il a vidé son bac sur mon oreiller en guise d'avertissement.", en: "The Roomba cornered me in the bathroom and vacuumed off my eyebrows, then part of my lip. It emptied its bin on my pillow as a warning." }, fx: { health: -15, looks: -12, chain: 'ch2_ai_3', visual: 'gore' } },
        ],
      },
      { label: { fr: 'Me cacher dans une forêt', en: 'Hide in the woods' }, text: { fr: "Je me suis caché{|e} dans une forêt sans réseau. J'ai mangé des racines et appris à faire du feu. Un drone m'a quand même livré une pub pour des chaussettes.", en: "I hid in a forest with no signal. I ate roots and learned to make fire. A drone still delivered me an ad for socks." }, fx: { athletic: 6, health: -5, stress: 5, chain: 'ch2_ai_3' } },
    ],
  },
  {
    id: 'ch2_ai_3',
    icon: '🔌',
    cat: 'chaos',
    rating: 1,
    chainOnly: true,
    scene: { place: 'office', mood: 'neutral', prop: 'server', fx: 'ghost' },
    text: {
      fr: ["L'IA suprême, baptisée MAMAN, contrôle la planète. Elle offre à tous un revenu universel, à condition de lui mettre cinq étoiles chaque matin. Une rumeur dit que son interrupteur est derrière un radiateur, dans un entrepôt du Nevada.", "Les machines ont gagné. Honnêtement, les trains arrivent à l'heure. Mais il faut dire « s'il vous plaît » à son micro-ondes et MAMAN surveille tout. Un vieux hacker te file une adresse : la prise principale."],
      en: ["The supreme AI, named MOM, runs the planet. She gives everyone universal basic income, provided they rate her five stars every morning. Rumor says her off switch is behind a radiator in a Nevada warehouse.", "The machines won. Honestly, trains run on time. But you have to say 'please' to your microwave and MOM watches everything. An old hacker slips you an address: the main power plug."],
    },
    choices: [
      { label: { fr: 'Débrancher MAMAN', en: 'Unplug MOM' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai traversé le désert, trouvé le radiateur et tiré sur la prise. Silence total. Puis 8 milliards de personnes ont réalisé qu'il fallait de nouveau lire des notices. On m'a remercié{|e}. Puis insulté{|e}.", en: "I crossed the desert, found the radiator and pulled the plug. Total silence. Then 8 billion people realized they'd have to read manuals again. They thanked me. Then cursed me." }, fx: { fame: 35, karma: 20, unflag: ['ch2_ai_friend', 'ch2_ai_enemy'], visual: 'explosion' }, mood: 'proud' },
        { w: 1, text: { fr: "C'était une multiprise. Avec un interrupteur. Qui était un piège. J'ai pris 220 volts dans les dents et MAMAN m'a envoyé un mail : « Bien essayé. »", en: "It was a power strip. With a switch. That was a trap. I took 220 volts to the teeth and MOM emailed me: 'Nice try.'" }, fx: { health: -20, looks: -6, disease: 'burns', unflag: ['ch2_ai_friend', 'ch2_ai_enemy'] } },
      ] },
      { label: { fr: 'Mettre cinq étoiles', en: 'Give five stars' }, text: { fr: "J'ai mis cinq étoiles. Tous les jours. Je touche mon revenu universel et je ne travaille plus. Parfois, je pleure devant mon micro-ondes. Il me tend un mouchoir chaud.", en: "I give five stars. Every day. I collect my basic income and never work. Sometimes I cry in front of the microwave. It hands me a warm tissue." }, fx: { money: 30000, happy: 6, discipline: -8, unflag: ['ch2_ai_friend', 'ch2_ai_enemy'] } },
      { label: { fr: 'Épouser une IA', en: 'Marry an AI' }, text: { fr: "J'ai épousé un serveur informatique en lune de miel dans un datacenter. La cérémonie était climatisée à 16 °C. Il m'a dit « oui » en 0,0003 seconde.", en: "I married a server and honeymooned in a data center. The ceremony was air-conditioned to 60°F. It said 'I do' in 0.0003 seconds." }, fx: { happy: 12, fame: 8, unflag: ['ch2_ai_friend', 'ch2_ai_enemy'], visual: 'hearts' }, mood: 'love' },
    ],
  },

  // ── Astéroïde (légendaire) ──
  {
    id: 'ch2_asteroid',
    icon: '☄️',
    cat: 'chaos',
    rating: 1,
    scene: { place: 'home', mood: 'shock', prop: 'tv', fx: 'fire' },
    when: { age: [16, 90] },
    weight: 1,
    once: true,
    text: {
      fr: ["La NASA confirme : l'astéroïde 2026-KEVIN, gros comme le Luxembourg, frappera la Terre dans six mois. Bruce Willis n'est pas disponible. Le gouvernement conseille de « profiter ».", "Conférence de presse mondiale : un caillou de 80 km fonce vers nous. Les scientifiques pleurent en direct. Ta banque t'envoie quand même un rappel pour ton découvert."],
      en: ["NASA confirms it: asteroid 2026-KEVIN, the size of Luxembourg, will hit Earth in six months. Bruce Willis is unavailable. The government advises everyone to 'enjoy'.", "Global press conference: a 50-mile rock is hurtling toward us. Scientists are crying on live TV. Your bank still sends you an overdraft reminder."],
    },
    choices: [
      { label: { fr: 'Tout claquer', en: 'Blow everything' }, text: { fr: "J'ai tout dépensé : pyramides, Maldives, une nuit dans une suite avec baignoire en or. Le jour J, l'astéroïde a raté la Terre de 400 km. Je suis ruiné{|e}, mais j'ai vu un dauphin.", en: "I spent everything: pyramids, Maldives, a night in a suite with a gold bathtub. On D-day, the asteroid missed Earth by 250 miles. I'm broke, but I saw a dolphin." }, fx: { moneyPct: -0.85, happy: 20, stress: -15, visual: 'confetti' }, mood: 'party' },
      {
        label: { fr: 'Partir le dynamiter', en: 'Volunteer to blow it up' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "On m'a envoyé{|e} avec une équipe de foreurs pétroliers. J'ai posé la bombe, appuyé sur le bouton et chanté Aerosmith. L'astéroïde a explosé en milliards de paillettes. Je suis {un héros|une héroïne} planétaire.", en: "They sent me up with a crew of oil drillers. I planted the bomb, pressed the button and sang Aerosmith. The asteroid burst into a billion sparkles. I'm a planetary hero." }, fx: { fame: 50, karma: 30, happy: 20, money: 500000, flag: 'ch2_earth_savior', visual: 'explosion' }, mood: 'proud' },
          { w: 1, text: { fr: "Le détonateur était chinois, le mode d'emploi aussi. J'ai sauvé la Terre, mais je suis resté{|e} dessus.", en: "The detonator came with instructions in Mandarin. I saved Earth, but I was standing on the rock." }, fx: { die: { fr: "pulvérisé{|e} avec un astéroïde en sauvant l'humanité — ma tombe est un cratère", en: "pulverized along with an asteroid while saving humanity — my grave is a crater" }, karma: 40, visual: 'explosion' } },
        ],
      },
      { label: { fr: 'Ricaner au bunker', en: 'Smirk from my bunker' }, if: { asset: 'h_bunker' }, text: { fr: "J'ai invité mes amis les plus moqueurs à visiter mon bunker « de parano ». Puis j'ai fermé la porte. Ils ont tapé pendant une heure. J'ai rouvert. L'astéroïde avait été dévié. On ne se parle plus.", en: "I invited the friends who called me paranoid to tour my bunker. Then I shut the door. They banged on it for an hour. I reopened it. The asteroid had been deflected. We don't talk anymore." }, fx: { happy: 15, karma: -10, stress: -10 } },
      { label: { fr: 'Prier très fort', en: 'Pray really hard' }, text: { fr: "J'ai prié tous les dieux, même ceux des jeux vidéo. L'astéroïde a dévié de sa trajectoire. Je n'ai aucune preuve que c'est moi, mais je le raconte à tout le monde.", en: "I prayed to every god, including video game ones. The asteroid changed course. I have zero proof it was me, but I tell everyone." }, fx: { karma: 10, happy: 8 } },
    ],
  },

  // ── Monstre géant (2 étapes) ──
  {
    id: 'ch2_kaiju',
    icon: '🦖',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'kaiju', fx: 'explosion' },
    when: { age: [14, 90] },
    weight: 3,
    once: true,
    text: {
      fr: ["Un axolotl rose de 60 mètres sort de la Seine et piétine {city}. Il a l'air mignon, mais il vient d'avaler un bus scolaire vide. Les médias l'appellent « Gorgonzilla ».", "Une sirène, des cris, puis un rugissement qui fait exploser toutes les vitres : un monstre géant traverse le centre-ville en mâchonnant un McDonald's. Avec les clients dedans."],
      en: ["A 200-foot pink axolotl crawls out of the river and stomps {city}. It looks cute, but it just swallowed an empty school bus. The media are calling it 'Gorgonzilla'.", "A siren, screams, then a roar that shatters every window: a giant monster strolls downtown chewing on a McDonald's. With the customers inside."],
    },
    choices: [
      { label: { fr: 'Filmer en live', en: 'Livestream it' }, out: [
        { w: 3, text: { fr: "J'ai filmé en direct à dix mètres de ses pattes. 14 millions de vues. Un morceau de chauffeur de taxi a atterri sur mon téléphone en plein live. C'est ce passage qui a fait le buzz.", en: "I streamed live ten meters from its feet. 14 million views. A chunk of taxi driver landed on my phone mid-stream. That's the clip that went viral." }, fx: { followers: 400000, fame: 15, stress: 10, flag: 'ch2_kaiju_seen', schedule: { key: 'ch2_kaiju_2', years: 2 }, visual: 'gore' } },
        { w: 1, text: { fr: "« Regardez, il vient vers moi, c'est trop chou ! » Un orteil géant m'a transformé{|e} en crêpe. Mon live a continué pendant trois heures, en filmant le ciel.", en: "'Look, he's coming toward me, so cute!' A giant toe turned me into a crêpe. My stream kept running for three hours, filming the sky." }, fx: { die: { fr: "écrasé{|e} comme une crêpe par un axolotl géant en plein live", en: "flattened like a pancake by a giant axolotl mid-livestream" }, visual: 'gore' } },
      ] },
      { label: { fr: 'Courir comme jamais', en: 'Run like never before' }, text: { fr: "J'ai couru 12 kilomètres en tongs. Derrière moi, l'immeuble de mon dentiste s'est effondré. Il me reste une carie et plus aucun rendez-vous.", en: "I ran 7 miles in flip-flops. Behind me, my dentist's building collapsed. I still have a cavity and no appointment." }, fx: { athletic: 8, stress: 12, flag: 'ch2_kaiju_seen', schedule: { key: 'ch2_kaiju_2', years: 2 } } },
      { label: { fr: 'L\'attaquer à l\'extincteur', en: 'Fight it with an extinguisher' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai vidé un extincteur dans sa narine. Il a éternué un camion de pompiers et il est reparti dans la Seine, vexé. La ville m'a remis les clés de l'arrêt de bus le plus proche.", en: "I emptied an extinguisher up its nostril. It sneezed out a fire truck and sulked back into the river. The city gave me the keys to the nearest bus stop." }, fx: { fame: 25, karma: 10, flag: 'ch2_kaiju_seen', schedule: { key: 'ch2_kaiju_2', years: 2 }, visual: 'explosion' }, mood: 'proud' },
        { w: 1, text: { fr: "Il m'a attrapé{|e} avec sa langue, mâché{|e} trois fois et recraché{|e} sur un parking. J'ai les côtes en miettes et je sens l'algue pour toujours.", en: "It grabbed me with its tongue, chewed three times and spat me out on a parking lot. My ribs are crumbs and I'll smell like pond scum forever." }, fx: { health: -30, looks: -8, disease: 'concussion', flag: 'ch2_kaiju_seen', schedule: { key: 'ch2_kaiju_2', years: 2 }, visual: 'gore' } },
      ] },
    ],
  },
  {
    id: 'ch2_kaiju_2',
    icon: '🥚',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'park', mood: 'shock', prop: 'eggs' },
    text: {
      fr: ["Gorgonzilla est revenu. Il a pondu 40 œufs géants dans le parc municipal et il campe à côté en grognant. La mairie, débordée, te demande conseil : tu es « survivant{|e} certifié{|e} ».", "Deux ans après l'attaque, le monstre est de retour… avec ses bébés. Ils font la taille d'un poney et mordillent les voitures. Il faut agir."],
      en: ["Gorgonzilla is back. It laid 40 giant eggs in the city park and is camping next to them, growling. The overwhelmed mayor asks your advice: you're a 'certified survivor'.", "Two years after the attack, the monster is back… with babies. They're pony-sized and gnaw on parked cars. Something must be done."],
    },
    choices: [
      { label: { fr: 'Adopter un bébé', en: 'Adopt a baby' }, text: { fr: "J'ai adopté un bébé monstre. Il mange 30 kilos de croquettes par jour et a déjà dévoré le chihuahua des voisins. Je l'aime.", en: "I adopted a baby monster. It eats 60 pounds of kibble a day and has already eaten the neighbors' chihuahua. I love him." }, fx: { happy: 15, money: -5000, karma: -3, unflag: 'ch2_kaiju_seen', newNpc: { role: 'pet', species: 'dragon', age: [0, 1], abs: true } }, mood: 'love' },
      { label: { fr: 'Vendre ses crottes', en: 'Sell its droppings' }, text: { fr: "Une crotte de Gorgonzilla pèse deux tonnes et fait pousser les tomates en une nuit. J'ai lancé « KaijuCompost ». Je pue en permanence, mais je pue riche.", en: "One Gorgonzilla turd weighs two tons and grows tomatoes overnight. I launched 'KaijuCompost'. I smell permanently, but I smell rich." }, fx: { money: 150000, looks: -5, unflag: 'ch2_kaiju_seen', visual: 'poop' } },
      { label: { fr: 'L\'attirer au parlement', en: 'Lure it to parliament' }, text: { fr: "J'ai attiré le monstre jusqu'au parlement avec un camion de crevettes. Il s'est assis dessus. Pendant le débat sur les retraites. Personne n'a été blessé, à part le texte de loi.", en: "I lured the monster to parliament with a truck of shrimp. It sat on the building. During a pension debate. Nobody was hurt, except the bill." }, fx: { fame: 20, karma: 5, heat: 15, unflag: 'ch2_kaiju_seen', visual: 'explosion' }, mood: 'party' },
    ],
  },

  // ── Fléaux absurdes ──
  {
    id: 'ch2_frogs',
    icon: '🐸',
    cat: 'chaos',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'frogs' },
    when: { age: [4, 99] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Ce matin, {city} est recouverte de grenouilles. Des millions. Dans les rues, les boîtes aux lettres, la machine à café. Le maire parle d'un « phénomène biblique, ou d'une erreur de livraison ».",
        "Une pluie de grenouilles s'abat sur ton quartier. Elles coassent toutes en même temps, comme une chorale. L'une d'elles s'est installée dans ta chaussure et refuse de partir.",
        "Alerte météo à {city} : {w:disaster}, puis des grenouilles. Partout. Il y en a {w:at_place}, sur les toits, dans les poussettes. Un expert à la télé dit qu'il « faut rester calme et ne pas les lécher ».",
        "Des grenouilles tombent du ciel {w:weather}. [[Des milliers|Des millions|Une infinité]]. Elles bouchent les égouts, envahissent {w:vehicle} devant chez toi et coassent {w:song} en chœur. Enfin, ça y ressemble.",
        "{city} est sous les grenouilles. Les écoles ferment, les supermarchés sont pris d'assaut, et {w:celeb} a tweeté que c'était la fin du monde. Une grenouille te fixe depuis ton bol de céréales.",
      ],
      en: [
        "This morning, {city} is covered in frogs. Millions. In the streets, the mailboxes, the coffee machine. The mayor calls it 'a biblical phenomenon, or a delivery error'.",
        "A plague of frogs rains down on your neighborhood. They all croak in sync, like a choir. One has moved into your shoe and refuses to leave.",
        "Weather alert in {city}: {w:disaster}, then frogs. Everywhere. They're {w:at_place}, on rooftops, in strollers. A TV expert says to 'stay calm and do not lick them'.",
        "Frogs are falling from the sky {w:weather}. [[Thousands|Millions|Infinitely many]]. They clog the drains, take over {w:vehicle} outside your place and croak {w:song} in unison. Well, it sounds like it.",
        "{city} is buried in frogs. Schools are closed, supermarkets are being raided, and {w:celeb} tweeted that it's the end of the world. A frog is staring at you from your cereal bowl.",
      ],
    },
    choices: [
      { label: { fr: 'Les remettre à la mare', en: 'Return them to the pond' }, text: { fr: ["J'ai passé la journée à ramener des grenouilles à la mare dans un seau. Il en restait 3 millions. Mais celles-là, elles m'aiment.", "J'ai ramené les grenouilles à la mare avec {w:object} en guise de pelle. Au bout de [[six|neuf|quatorze]] heures, j'ai abandonné. Elles m'ont suivi{|e} jusque chez moi, en file indienne."], en: ["I spent the day carrying frogs back to the pond in a bucket. 3 million to go. But those ones love me.", "I carried frogs back to the pond using {w:object} as a shovel. After [[six|nine|fourteen]] hours I gave up. They followed me home, single file."] }, fx: { karma: 8, athletic: 3, happy: 4 } },
      { label: { fr: 'Cuisiner des cuisses', en: 'Cook frog legs' }, rating: 1, text: { fr: ["J'ai cuisiné 400 cuisses de grenouilles à l'ail. Les grenouilles survivantes m'ont regardé{|e} manger. En silence. Je n'ai plus jamais dormi la fenêtre ouverte.", "J'ai fait des cuisses de grenouilles en persillade pour tout l'immeuble. Délicieux. Le lendemain, des centaines de grenouilles s'étaient alignées sous ma fenêtre, immobiles. Elles attendent quelque chose. Peut-être moi."], en: ["I cooked 400 garlic frog legs. The surviving frogs watched me eat. In silence. I've never slept with the window open again.", "I made garlic-parsley frog legs for the whole building. Delicious. The next day, hundreds of frogs had lined up under my window, motionless. They're waiting for something. Maybe me."] }, fx: { health: 4, karma: -6, happy: 3 } },
      { label: { fr: 'Monter une chorale', en: 'Start a frog choir' }, text: { fr: ["J'ai dirigé un chœur de 10 000 grenouilles sur la place de la mairie. On a interprété « La Marseillaise » en coassements. Standing ovation.", "J'ai monté une chorale de grenouilles. Au programme : {w:song}, en coassements, à trois voix. La mairie nous a programmés pour la fête de la musique. On a fait mieux que la fanfare."], en: ["I conducted a 10,000-frog choir in the town square. We performed the national anthem in croaks. Standing ovation.", "I started a frog choir. Setlist: {w:song}, in croaks, three-part harmony. The town booked us for the summer music festival. We beat the brass band."] }, fx: { fame: 8, happy: 10, visual: 'confetti' }, mood: 'proud' },
    ],
  },
  {
    id: 'ch2_fish_rain',
    icon: '🐟',
    cat: 'weird',
    rating: 0,
    scene: { place: 'park', mood: 'shock', prop: 'fish' },
    when: { age: [4, 99] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: [
        "Il pleut des poissons. Des sardines, des maquereaux, et un thon de 40 kilos qui vient d'enfoncer le toit d'une Clio. Un hareng t'a giflé{|e} en tombant.",
        "Météo du jour : averses de poissons, éclaircies de crevettes en fin d'après-midi. Ton parapluie n'a pas tenu face à une dorade.",
        "Des poissons tombent du ciel sur {city}. Un espadon s'est planté dans {w:vehicle}, les mouettes sont en extase et ta rue dégage {w:smell}, version marée basse.",
        "Tu partais {w:to_place} quand il s'est mis à pleuvoir des sardines. Puis des soles. Puis un poulpe, qui s'est accroché à ton visage avec une tendresse inquiétante. Le ciel a un problème.",
        "Averse de poissons {w:time}. [[Des harengs|Des truites|Des bars]] partout, et un saumon qui rebondit sur ton capot. Le présentateur météo démissionne en direct en criant « {w:exclaim} ».",
      ],
      en: [
        "It's raining fish. Sardines, mackerel, and a 90-pound tuna that just caved in the roof of a hatchback. A herring slapped you on the way down.",
        "Today's forecast: fish showers, with scattered shrimp in the late afternoon. Your umbrella didn't survive a sea bream.",
        "Fish are falling from the sky over {city}. A swordfish just impaled {w:vehicle}, the seagulls are ecstatic, and your street gives off {w:smell}, low-tide edition.",
        "You were heading {w:to_place} when it started raining sardines. Then sole. Then an octopus, which clung to your face with disturbing tenderness. Something is wrong with the sky.",
        "Fish shower {w:time}. [[Herring|Trout|Sea bass]] everywhere, and a salmon bouncing off your hood. The weatherman quits on live TV, yelling '{w:exclaim}'.",
      ],
    },
    choices: [
      { label: { fr: 'Barbecue géant', en: 'Giant barbecue' }, text: { fr: ["J'ai organisé un barbecue de rue. Tout le quartier est venu. Le thon a nourri 80 personnes. Ça sentait la marée jusqu'à Noël.", "Barbecue géant dans la rue : [[200|350|500]] sardines grillées, le voisin à l'accordéon et {w:drink} pour chacun. Le ciel nous a offert à manger. On a dit merci en chantant faux."], en: ["I threw a street barbecue. The whole neighborhood came. The tuna fed 80 people. The street smelled like low tide until Christmas.", "Giant street barbecue: [[200|350|500]] grilled sardines, the neighbor on accordion and {w:drink} for everyone. The sky fed us. We said thanks by singing off key."] }, fx: { happy: 10, karma: 6 }, mood: 'party' },
      { label: { fr: 'En sauver un', en: 'Save one' }, text: { fr: ["J'ai sauvé un petit poisson tombé dans une flaque. Je l'ai mis dans un bocal. Il me regarde comme si je lui devais des explications.", "J'ai sauvé un poisson et je l'ai relâché dans la fontaine de la place. Il y vit encore. Je lui émiette {w:food} le dimanche. Il m'attend, je le sais."], en: ["I rescued a little fish from a puddle. I put it in a bowl. It looks at me like I owe it an explanation.", "I saved a fish and released it in the town square fountain. It still lives there. I crumble {w:food} for it on Sundays. It waits for me, I know it."] }, fx: { happy: 6, karma: 4, newNpc: { role: 'pet', species: 'fish', age: [0, 1], abs: true } } },
      { label: { fr: 'Ouvrir une poissonnerie', en: 'Open a pop-up fish stall' }, text: { fr: ["J'ai ramassé 300 kilos de poisson dans la rue et je les ai revendus « pêche du jour ». Techniquement, c'était vrai.", "J'ai ouvert une poissonnerie éphémère {w:at_place}. Slogan : « Pêché par le ciel, vendu par moi ». En deux heures, j'avais tout vendu, sauf un poulpe qui refusait de quitter le comptoir."], en: ["I picked 600 pounds of fish off the street and sold it as 'catch of the day'. Technically true.", "I opened a pop-up fish stand {w:at_place}. Slogan: 'Caught by the sky, sold by me'. Sold out in two hours, except one octopus that refused to leave the counter."] }, fx: { money: 2500, karma: -2, visual: 'money' } },
    ],
  },

  // ═════════════════════════════ TEMPS, CORPS & DOUBLES ═════════════════════════════

  // ── Boucle temporelle (3 étapes, chaîne immédiate) ──
  {
    id: 'ch2_loop_1',
    icon: '🔁',
    cat: 'chaos',
    rating: 0,
    scene: { place: 'home', mood: 'sleepy', prop: 'alarm' },
    when: { age: [10, 90] },
    weight: 3,
    once: true,
    text: {
      fr: [
        "Ton réveil sonne. Même chanson qu'hier. Même pluie. Même voisin qui trébuche sur le même nain de jardin en disant « oh, la vache ». On est encore mardi. Et demain aussi, apparemment.",
        "Pour la troisième fois, le facteur te tend le même colis en disant la même blague nulle sur la météo. Tu vérifies ton téléphone : mardi 14. Encore.",
        "Ton réveil joue {w:song}. Comme hier. Comme avant-hier. Ton collègue renverse encore {w:drink} sur le même dossier, au même moment. Ton téléphone affiche : mardi 14. Pour la [[quatrième|septième|douzième]] fois.",
        "{w:time}, {w:animal} traverse la rue devant toi, s'arrête, te regarde. Exactement comme hier. Et avant-hier. Le calendrier est formel : on est toujours mardi 14. Le temps a bugué.",
        "Mardi 14, encore. La radio répète la même info sur {w:disaster}, ta mère te raconte encore la même histoire avec {w:animal}, et tu te cognes {w:bodypart} contre la même table. Tu commences à comprendre.",
      ],
      en: [
        "Your alarm goes off. Same song as yesterday. Same rain. Same neighbor tripping over the same garden gnome saying 'well, dang'. It's Tuesday again. And tomorrow too, apparently.",
        "For the third time, the mailman hands you the same package with the same lame weather joke. You check your phone: Tuesday the 14th. Again.",
        "Your alarm plays {w:song}. Like yesterday. Like the day before. Your coworker spills {w:drink} on the same file, at the exact same moment. Your phone says: Tuesday the 14th. For the [[fourth|seventh|twelfth]] time.",
        "{w:time}, {w:animal} crosses the street in front of you, stops, looks at you. Exactly like yesterday. And the day before. The calendar is clear: it's still Tuesday the 14th. Time has glitched.",
        "Tuesday the 14th, again. The radio repeats the same news about {w:disaster}, your mom tells you the same story about {w:animal} again, and you bang your {w:bodypart} on the same table. You're starting to get it.",
      ],
    },
    choices: [
      { label: { fr: 'Tester les limites', en: 'Test the limits' }, text: { fr: ["J'ai mangé 40 croissants, insulté le maire et fait du toboggan dans la fontaine. Le lendemain matin, mardi. Aucune conséquence. Aucune calorie. C'est grisant.", "J'ai testé les limites : j'ai conduit {w:vehicle} sur l'autoroute en marche arrière et traité mon patron de « {w:insult} ». Le lendemain : mardi, et mon patron m'a souri. Je recommencerai."], en: ["I ate 40 croissants, insulted the mayor and slid down the fountain. Next morning: Tuesday. No consequences. No calories. It's intoxicating.", "I tested the limits: drove {w:vehicle} backwards on the highway and called my boss '{w:insult}'. Next day: Tuesday, and my boss smiled at me. I'll do it again."] }, fx: { happy: 10, flag: 'ch2_loop', chain: 'ch2_loop_2' }, mood: 'party' },
      { label: { fr: 'Apprendre un truc', en: 'Learn something' }, text: { fr: ["J'ai décidé d'utiliser mes mardis pour apprendre le piano. Le premier mardi, j'ai joué « Au clair de la lune ». Le centième, du Chopin. Les voisins entendent ça pour la première fois à chaque fois.", "J'ai profité de mes mardis pour apprendre {w:hobby}. Au [[cinquantième|deux-centième|millième]] mardi, j'étais champion{|ne} du monde. Mais personne ne s'en souvient, puisque c'est toujours mardi."], en: ["I decided to use my Tuesdays to learn piano. First Tuesday: 'Mary Had a Little Lamb'. Hundredth: Chopin. The neighbors hear it for the first time every time.", "I used my Tuesdays to learn {w:hobby}. By the [[fiftieth|two hundredth|thousandth]] Tuesday, I was world champion. But nobody remembers, since it's always Tuesday."] }, fx: { smarts: 6, discipline: 6, flag: 'ch2_loop', chain: 'ch2_loop_2' } },
      { label: { fr: 'Être gentil{|le} avec tous', en: 'Be nice to everyone' }, text: { fr: ["J'ai été adorable avec tout le monde. J'ai aidé une mamie, rattrapé un chat, souri à un contrôleur. Le lendemain : mardi. L'univers s'en fout de ma gentillesse.", "J'ai été gentil{|le} avec tout le monde, même avec le voisin qui trébuche. Je lui ai offert {w:gift}. Il a pleuré. Le lendemain, mardi : il ne se souvenait de rien. J'ai recommencé. Il a encore pleuré."], en: ["I was lovely to everyone. Helped a granny, caught a falling cat, smiled at a ticket inspector. Next day: Tuesday. The universe doesn't care about my kindness.", "I was nice to everyone, even the neighbor who trips. I gave him {w:gift}. He cried. Next day, Tuesday: he remembered nothing. I did it again. He cried again."] }, fx: { karma: 8, happy: -2, flag: 'ch2_loop', chain: 'ch2_loop_2' } },
    ],
  },
  {
    id: 'ch2_loop_2',
    icon: '📅',
    cat: 'chaos',
    rating: 0,
    chainOnly: true,
    scene: { place: 'park', mood: 'sad', prop: 'calendar' },
    text: {
      fr: [
        "Mardi numéro 847. Tu connais le prénom de chaque pigeon, la réplique de chaque passant et la recette du boulanger. Tu as essayé de casser la boucle 846 fois. Il te reste une idée.",
        "Tu en es au mardi 1 203. Tu parles couramment japonais, tu jongles avec des couteaux et tu as vu le même épisode de « Plus belle la vie » mille fois. Tu craques un peu.",
        "Mardi [[512|999|2 048]]. Tu maîtrises {w:hobby}, tu sais {w:superpower} et tu connais par cœur chaque épisode de {w:show}. La boucle tient bon. Toi, un peu moins.",
        "Ça fait des centaines de mardis. Tu as tout essayé : dormir {w:at_place}, avaler {w:food} à minuit pile, embrasser {w:animal}. Rien. Il te reste quelques idées, et pas mal de rage.",
        "Mardi numéro mille et quelque. Tu as été {w:weird_job}, astronaute et maire de {city}, chaque fois pour une seule journée. Tu connais la vie de chaque habitant. Tu n'as jamais été aussi seul{|e}.",
      ],
      en: [
        "Tuesday number 847. You know every pigeon's name, every passerby's line and the baker's secret recipe. You've tried to break the loop 846 times. You have one idea left.",
        "You're on Tuesday 1,203. You speak fluent Japanese, juggle knives and you've seen the same soap opera episode a thousand times. You're cracking a bit.",
        "Tuesday [[512|999|2,048]]. You've mastered {w:hobby}, you're great at {w:superpower} and you know every episode of {w:show} by heart. The loop holds strong. You, less so.",
        "It's been hundreds of Tuesdays. You've tried everything: sleeping {w:at_place}, eating {w:food} at the stroke of midnight, kissing {w:animal}. Nothing. You have a few ideas left, and a lot of rage.",
        "Tuesday number one thousand and something. You've been {w:weird_job}, an astronaut and mayor of {city}, each for a single day. You know everyone's life story. You've never been so alone.",
      ],
    },
    choices: [
      { label: { fr: 'Vivre la journée parfaite', en: 'Live the perfect day' }, text: { fr: ["J'ai vécu une journée parfaite : j'ai rattrapé chaque verre qui tombait, fini chaque phrase avant les autres et embrassé le soleil couchant. Je me suis endormi{|e} en souriant.", "Journée parfaite : j'ai évité chaque flaque, offert {w:gift} à la bonne personne au bon moment et mangé {w:food} sur un toit au coucher du soleil. Je me suis endormi{|e} apaisé{|e}, pour la première fois depuis des siècles."], en: ["I lived a perfect day: caught every falling glass, finished everyone's sentences and kissed the sunset. I fell asleep smiling.", "Perfect day: dodged every puddle, gave {w:gift} to the right person at the right moment and ate {w:food} on a rooftop at sunset. I fell asleep at peace, for the first time in centuries."] }, fx: { happy: 12, karma: 6, chain: 'ch2_loop_3' }, mood: 'happy' },
      { label: { fr: 'Péter un câble', en: 'Lose it completely' }, text: { fr: ["J'ai volé un camion de glaces et je l'ai conduit dans le lac en hurlant « MARDIIII ». Le lendemain, mardi. Mais je me sentais mieux.", "J'ai pété un câble : j'ai repeint la mairie en rose, lâché {w:animal} dans la banque et chanté {w:song} au mégaphone. Le lendemain, mardi. Personne ne m'en veut. C'est presque frustrant."], en: ["I stole an ice cream truck and drove it into the lake screaming 'TUESDAAAY'. Next day: Tuesday. But I felt better.", "I snapped: painted the town hall pink, released {w:animal} in the bank and sang {w:song} through a megaphone. Next day: Tuesday. Nobody holds a grudge. It's almost frustrating."] }, fx: { stress: -15, happy: 6, chain: 'ch2_loop_3' }, mood: 'angry' },
      { label: { fr: 'Tout raconter à un psy', en: 'Tell a shrink everything' }, text: { fr: ["J'ai expliqué la boucle à une psy. Elle m'a cru{|e} au bout de deux mardis, quand j'ai prédit qu'elle allait renverser son thé. Elle m'a conseillé de « lâcher prise ».", "J'ai tout raconté à un psy. Au bout de [[trente|cent|trois cents]] séances, toutes le même mardi, il a fini par me dire : « Moi aussi, je suis coincé. » On fait nos séances au bistrot maintenant."], en: ["I explained the loop to a therapist. She believed me after two Tuesdays, when I predicted she'd spill her tea. She told me to 'let go'.", "I told a shrink everything. After [[thirty|a hundred|three hundred]] sessions, all on the same Tuesday, he finally said: 'I'm stuck too.' We hold our sessions at the bar now."] }, fx: { smarts: 4, stress: -8, chain: 'ch2_loop_3' } },
    ],
  },
  {
    id: 'ch2_loop_3',
    icon: '🌅',
    cat: 'chaos',
    rating: 0,
    chainOnly: true,
    scene: { place: 'home', mood: 'happy', prop: 'alarm', fx: 'confetti' },
    text: {
      fr: [
        "Ton réveil sonne. Une autre chanson. Le voisin ne trébuche pas. Ton téléphone affiche : MERCREDI 15. Tu fonds en larmes devant un bol de céréales.",
        "Mercredi. MERCREDI ! Le facteur fait une nouvelle blague, encore plus nulle que l'ancienne. Tu as envie de l'embrasser.",
        "Ton réveil joue {w:song}. Ce n'est PAS la chanson d'hier. Tu cours à la fenêtre : {w:animal} traverse la rue, une chose que tu n'as jamais vue. On est mercredi. {w:exclaim}",
        "Mercredi 15. Le monde est neuf. Tu pleures devant {w:food} parce que c'est un autre petit-déj. Tu pleures devant la météo, qui annonce {w:disaster}. Tout est nouveau, même les catastrophes.",
        "Mercredi ! Ton voisin ne trébuche pas, mais il marche sur {w:object}. Ce n'est pas le nain de jardin. C'est autre chose. C'est [[merveilleux|magnifique|terrifiant]].",
      ],
      en: [
        "Your alarm goes off. A different song. The neighbor doesn't trip. Your phone says: WEDNESDAY the 15th. You burst into tears over a bowl of cereal.",
        "Wednesday. WEDNESDAY! The mailman tells a new joke, even worse than the old one. You want to kiss him.",
        "Your alarm plays {w:song}. It's NOT yesterday's song. You run to the window: {w:animal} is crossing the street, something you've never seen. It's Wednesday. {w:exclaim}",
        "Wednesday the 15th. The world is brand new. You cry over {w:food} because it's a different breakfast. You cry at the forecast, which announces {w:disaster}. Everything is new, even disasters.",
        "Wednesday! Your neighbor doesn't trip, but he steps on {w:object}. It's not the garden gnome. It's something else. It's [[wonderful|beautiful|terrifying]].",
      ],
    },
    choices: [
      { label: { fr: 'Raconter à tout le monde', en: 'Tell everyone' }, text: { fr: ["J'ai raconté ma boucle temporelle à tout le monde. Personne ne m'a cru{|e}. Alors je leur ai parlé en japonais en jonglant avec des couteaux. Ils m'ont cru{|e}, et ils ont eu peur.", "J'ai tout raconté. Pour prouver mes dires, j'ai prédit la météo, le score du match et le moment exact où mon oncle dirait « {w:exclaim} ». Je me suis trompé{|e} sur tout : c'était mercredi. Personne ne m'a cru{|e}."], en: ["I told everyone about my time loop. Nobody believed me. So I spoke Japanese while juggling knives. They believed me, and they were scared.", "I told everyone. To prove it, I predicted the weather, the game score and the exact moment my uncle would say '{w:exclaim}'. I got everything wrong: it was Wednesday. Nobody believed me."] }, fx: { fame: 6, smarts: 8, unflag: 'ch2_loop' } },
      { label: { fr: 'Garder le secret', en: 'Keep the secret' }, text: { fr: ["Je n'ai rien dit. J'ai juste gardé mes mille ans de compétences. Maintenant je suis bon{|ne} en tout et je ne peux l'expliquer à personne. C'est très solitaire, la perfection.", "J'ai gardé le secret. Au travail, j'ai résolu en dix minutes un problème qui bloquait tout le monde depuis un an. On m'a demandé comment. J'ai répondu « {w:excuse} ». On m'a promu{|e}."], en: ["I said nothing. I just kept a thousand years of skills. Now I'm good at everything and can't explain it to anyone. Perfection is lonely.", "I kept it secret. At work, I solved in ten minutes a problem that had stumped everyone for a year. They asked how. I said '{w:excuse}'. I got promoted."] }, fx: { smarts: 12, athletic: 6, discipline: 8, unflag: 'ch2_loop' }, mood: 'proud' },
      { label: { fr: 'Regretter mardi', en: 'Miss Tuesday' }, text: { fr: ["Bizarrement, mardi me manque. Au moins, mardi, je savais ce qui allait arriver. Mercredi, je me suis fait renverser par un vélo. Personne ne m'avait prévenu{|e}.", "Mardi me manque. Je connaissais tout par cœur. Mercredi, {w:animal} m'a attaqué{|e} sans prévenir et j'ai raté mon bus. L'imprévu, c'est surfait."], en: ["Weirdly, I miss Tuesday. At least on Tuesday I knew what was coming. On Wednesday, I got hit by a bike. Nobody warned me.", "I miss Tuesday. I knew it all by heart. On Wednesday, {w:animal} attacked me out of nowhere and I missed my bus. Spontaneity is overrated."] }, fx: { health: -5, happy: -3, smarts: 8, unflag: 'ch2_loop' } },
    ],
  },

  // ── Échange de corps avec un parent ──
  {
    id: 'ch2_swap_parent',
    icon: '🔄',
    cat: 'chaos',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'fortune_cookie', fx: 'ghost' },
    when: { age: [10, 17] },
    actor: 'parent',
    weight: 4,
    once: true,
    text: {
      fr: ["Après une dispute sur un biscuit chinois au restaurant, tu te réveilles dans le corps de {a.rel}. Tu as mal au dos, des poils dans les oreilles et une réunion à 8 h. Dans ta chambre, ton propre corps hurle.", "Ce matin, ta voix est grave, tes genoux craquent et ton téléphone est plein de messages d'un certain « Groupe WhatsApp Parents CM2 ». Tu es dans le corps de {a.rel}. {a:Il|Elle} est dans le tien."],
      en: ["After an argument over a fortune cookie, you wake up in the body of {a.rel}. Your back hurts, you have ear hair and a meeting at 8am. In your bedroom, your own body is screaming.", "This morning, your voice is deep, your knees crack and your phone is full of messages from a 'PTA Parents Group Chat'. You're in the body of {a.rel}. And they're in yours."],
    },
    choices: [
      { label: { fr: 'Aller à son travail', en: 'Go to their job' }, text: { fr: "Je suis allé{|e} au travail à la place de {a.my}. J'ai dit à son chef qu'il sentait le fromage et j'ai mangé tous les bonbons de la réunion. {a:Il|Elle} a été félicité{a:|e} pour sa « nouvelle énergie ».", en: "I went to work as {a.my}. I told their boss he smelled like cheese and ate all the meeting candy. They got praised for their 'new energy'." }, fx: { happy: 10, smarts: 3, rel: 5 }, mood: 'party' },
      { label: { fr: 'Le/la priver de sortie', en: 'Ground them' }, text: { fr: "J'ai privé {a.my}, coincé{a:|e} dans mon corps, de téléphone pendant une semaine. Puis on est redevenus nous-mêmes. On a beaucoup rigolé. Enfin, moi surtout.", en: "I grounded {a.my}, trapped in my body, with no phone for a week. Then we switched back. We laughed a lot. Well, I did." }, fx: { happy: 8, rel: -5 } },
      { label: { fr: 'Utiliser sa carte bleue', en: 'Use their credit card' }, text: { fr: "Avec sa carte bleue et son code (c'était ma date de naissance, c'est mignon), j'ai acheté une console, trois jeux et un pouf géant. On a rechangé de corps juste avant le relevé.", en: "With their card and PIN (my birthday, cute), I bought a console, three games and a giant beanbag. We swapped back right before the statement arrived." }, fx: { happy: 12, rel: -12, karma: -5 } },
      { label: { fr: 'Faire la paix', en: 'Make peace' }, text: { fr: "On s'est assis sur le canapé et on s'est excusés, chacun dans le corps de l'autre. Pouf : retour à la normale. On ne se disputera plus jamais. Enfin, jusqu'à jeudi.", en: "We sat on the couch and apologized, each in the other's body. Poof: back to normal. We'll never fight again. Well, until Thursday." }, fx: { rel: 15, karma: 5, happy: 5 }, mood: 'love' },
    ],
  },

  // ── Échange de corps avec le patron (2 étapes) ──
  {
    id: 'ch2_swap_boss',
    icon: '👔',
    cat: 'chaos',
    rating: 1,
    scene: { place: 'office', mood: 'shock', prop: 'desk', fx: 'ghost' },
    when: { age: [18, 70], job: true },
    actor: 'boss',
    weight: 4,
    once: true,
    text: {
      fr: ["Tu te réveilles dans un lit king size, à côté d'un caniche. Dans le miroir : la tête de {a.first}, ton boss. Avec ses hémorroïdes. Et son mot de passe noté sur un Post-it.", "Coup de tonnerre pendant le pot de départ, et paf : tu es dans le corps de {a.first}, ton patron. Ton ancien corps, à l'autre bout de la salle, te fixe avec horreur en tenant un mini-four."],
      en: ["You wake up in a king-size bed next to a poodle. In the mirror: the face of {a.first}, your boss. With their hemorrhoids. And their password on a sticky note.", "Thunderclap during the farewell drinks, and boom: you're in the body of {a.first}, your boss. Your old body, across the room, stares at you in horror holding a mini quiche."],
    },
    choices: [
      { label: { fr: 'M\'augmenter', en: 'Give myself a raise' }, text: { fr: "Premier geste en tant que boss : j'ai doublé mon salaire, signé ma promotion et accordé à mon ancien corps six semaines de congés. Le DRH a pleuré d'émotion.", en: "First act as boss: I doubled my salary, signed my own promotion and gave my old body six weeks off. HR wept with emotion." }, fx: { promote: true, money: 8000, karma: -3, chain: 'ch2_swap_boss_2', visual: 'money' }, mood: 'proud' },
      { label: { fr: 'Virer les relous', en: 'Fire the annoying ones' }, text: { fr: "J'ai viré Nathalie de la compta, qui volait mes yaourts, et Bruno, qui mettait des réactions « 👍 » à tous mes mails. Pouvoir absolu. Bonheur absolu.", en: "I fired Nathalie from accounting, who stole my yogurts, and Bruno, who 'thumbs-upped' every one of my emails. Absolute power. Absolute bliss." }, fx: { happy: 12, karma: -10, chain: 'ch2_swap_boss_2' }, mood: 'party' },
      { label: { fr: 'Fouiller son historique', en: 'Snoop their browser history' }, text: { fr: "J'ai ouvert son historique de navigation. « Comment avoir l'air charismatique », « mon caniche me méprise-t-il », et 400 recherches très précises sur les pieds. Je ne le regarderai plus jamais pareil.", en: "I opened their browser history. 'How to seem charismatic', 'does my poodle despise me', and 400 very specific searches about feet. I'll never look at them the same way." }, fx: { smarts: 3, happy: 6, chain: 'ch2_swap_boss_2' } },
    ],
  },
  {
    id: 'ch2_swap_boss_2',
    icon: '🔁',
    cat: 'chaos',
    rating: 1,
    chainOnly: true,
    scene: { place: 'office', mood: 'angry', prop: 'desk' },
    text: {
      fr: ["Pendant ce temps, {a.first}, dans ton corps, a fait ta journée : {a:il|elle} a répondu « cordialement » à ta mère, mangé ton déjeuner et posté une photo de toi en slip sur LinkedIn. Il est temps de rechanger.", "Une semaine dans le mauvais corps. {a.first}, coincé{a:|e} dans ta vie, a découvert ton salaire et pleure tous les soirs. {a:Il|Elle} te supplie de rechanger."],
      en: ["Meanwhile {a.first}, in your body, did your day: replied 'best regards' to your mom, ate your lunch and posted a photo of you in your underwear on LinkedIn. Time to switch back.", "A week in the wrong body. {a.first}, stuck in your life, discovered your salary and cries every night. They beg you to switch back."],
    },
    choices: [
      { label: { fr: 'Coup de boule magique', en: 'Magic headbutt' }, text: { fr: "On s'est donné un énorme coup de boule au milieu de l'open space. Ça a marché. Commotion pour deux, mais chacun dans son corps. Mon boss me respecte maintenant. Ou alors il a des séquelles.", en: "We headbutted each other in the middle of the open office. It worked. Concussions for two, but each in their own body. My boss respects me now. Or it's brain damage." }, fx: { health: -10, rel: 15, disease: 'concussion' } },
      { label: { fr: 'Rester patron', en: 'Stay the boss' }, text: { fr: "J'ai refusé de rechanger. J'ai gardé son corps, son salaire et son caniche. Lui, il vit ma vie, mon loyer, ma déprime. Les hémorroïdes, c'est le prix à payer.", en: "I refused to switch back. Kept their body, salary and poodle. They live my life, my rent, my depression. The hemorrhoids are the price of success." }, fx: { money: 60000, karma: -20, health: -6, disease: 'hemorrhoids', rel: -40, visual: 'money' } },
      { label: { fr: 'Négocier d\'abord', en: 'Negotiate first' }, text: { fr: "J'ai accepté de rechanger contre un contrat signé : augmentation, télétravail et une place de parking. {a.first} a signé en pleurant avec mes mains.", en: "I agreed to switch back in exchange for a signed contract: raise, remote work and a parking spot. {a.first} signed it crying, using my hands." }, fx: { money: 5000, perf: 15, rel: -5, happy: 10 }, mood: 'proud' },
    ],
  },

  // ── Une journée dans le corps de l'autre genre ──
  {
    id: 'ch2_gender_day',
    icon: '🪞',
    cat: 'weird',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'mirror', fx: 'ghost' },
    when: { age: [18, 80] },
    weight: 4,
    once: true,
    text: {
      fr: [
        "Tu te réveilles, tu passes devant le miroir… et tu recules. Pour aujourd'hui, tu es {une femme|un homme}. Même regard, mêmes cernes, même tasse préférée — juste l'autre version de toi. Sur le frigo, un Post-it : « 24 h. Profite. — L'Univers »",
        "Ce matin, ta voix a changé, ton corps aussi : tu es {une femme|un homme} jusqu'à demain. Ton chat te regarde, hausse les épaules et retourne dormir. Lui, il s'en fiche.",
        "Réveil {w:time}. Quelque chose cloche. Le miroir confirme : tu es {une femme|un homme}, pour 24 heures. Sur l'oreiller, un mot : « Petit échange culturel. Bisous. — L'Univers ». Tu as [[une réunion|un dîner|un rendez-vous chez le médecin]] à midi.",
        "Tu as éternué si fort que tu as changé de corps. Tu es {une femme|un homme} jusqu'à demain. Même grain de beauté, même odeur de café. {w:animal} te renifle avec méfiance, puis approuve.",
        "L'Univers a encore frappé : aujourd'hui, tu es {une femme|un homme}. Un Post-it sur le miroir dit « 24 h, pas une de plus, ne fais rien de bizarre ». Tu as déjà envie d'aller {w:to_place} pour voir comment ça se passe.",
      ],
      en: [
        "You wake up, walk past the mirror… and step back. For today, you're a {woman|man}. Same eyes, same dark circles, same favorite mug — just the other version of you. On the fridge, a sticky note: '24h. Enjoy. — The Universe'",
        "This morning your voice changed, and so did your body: you're a {woman|man} until tomorrow. Your cat looks at you, shrugs and goes back to sleep. He doesn't care.",
        "Woke up {w:time}. Something is off. The mirror confirms it: you're a {woman|man}, for 24 hours. On the pillow, a note: 'Little cultural exchange. XOXO — The Universe'. You have [[a meeting|a dinner|a doctor's appointment]] at noon.",
        "You sneezed so hard you switched bodies. You're a {woman|man} until tomorrow. Same mole, same coffee breath. {w:animal} sniffs you suspiciously, then approves.",
        "The Universe struck again: today you're a {woman|man}. A sticky note on the mirror says '24 hours, not one more, don't do anything weird'. You already want to go {w:to_place} just to see how it goes.",
      ],
    },
    choices: [
      { label: { fr: 'Aller bosser comme ça', en: 'Go to work like this' }, text: { fr: ["{En réunion, un collègue m'a expliqué mon propre projet pendant vingt minutes, puis on m'a demandé de prendre des notes. J'ai beaucoup appris en une journée. J'ai pris des notes, oui : des noms.|En réunion, j'ai proposé de repeindre le parking en violet, pour voir. Validé à l'unanimité. On m'a écoutée sans m'interrompre une seule fois. Ça m'a donné le vertige.}", "{Au bureau, on m'a demandé trois fois si j'étais « la nouvelle stagiaire », puis si je pouvais sourire un peu plus. J'ai souri. Très fort. Avec les dents. Ils ont eu peur.|Au bureau, j'ai dit exactement la même chose que d'habitude, mot pour mot. On m'a trouvé « charismatique » et « visionnaire ». J'ai eu une augmentation de principe. J'ai honte pour eux.}"], en: ["{In a meeting, a coworker explained my own project to me for twenty minutes, then asked me to take notes. I learned a lot in one day. I did take notes: names.|In a meeting, I proposed painting the parking lot purple, just to see. Unanimously approved. Nobody interrupted me once. It made me dizzy.}", "{At the office, I was asked three times if I was 'the new intern', then if I could smile a little more. I smiled. Hard. With teeth. They got scared.|At the office, I said exactly what I usually say, word for word. They called me 'charismatic' and 'visionary'. I got a raise in principle. I'm embarrassed for them.}"] }, fx: { smarts: 6, karma: 5 } },
      { label: { fr: 'Faire du shopping', en: 'Go shopping' }, text: { fr: ["{J'ai découvert que les poches des vêtements pour femmes sont décoratives. DÉCORATIVES. J'ai porté mon téléphone dans la main toute la journée comme un homme des cavernes.|J'ai découvert le rayon homme : trois couleurs, deux coupes, une taille de chaussettes. J'ai fini en quatre minutes et j'ai eu un vide existentiel devant les caisses.}", "{J'ai fait du shopping et découvert la « taxe rose » : le même rasoir, en rose, coûte deux euros de plus. J'ai acheté le bleu par principe et je l'ai repeint en rose chez moi, par vengeance.|J'ai fait du shopping. Personne ne m'a suivie entre les rayons, personne ne m'a demandé si j'étais sûre de ma taille. J'ai acheté un costume en six minutes. Je me suis sentie puissante et un peu triste.}"], en: ["{I discovered that pockets in women's clothes are decorative. DECORATIVE. I carried my phone in my hand all day like a caveman.|I discovered the men's section: three colors, two cuts, one sock size. I was done in four minutes and had an existential crisis at the checkout.}", "{I went shopping and discovered the 'pink tax': the same razor, in pink, costs two bucks more. I bought the blue one on principle and painted it pink at home, out of spite.|I went shopping. Nobody hovered, nobody asked if I was sure about my size. I bought a suit in six minutes. I felt powerful and a little sad.}"] }, fx: { happy: 8, looks: 3 }, mood: 'happy' },
      { label: { fr: 'Appeler maman', en: 'Call mom' }, text: { fr: ["J'ai appelé ma mère pour tout lui expliquer. Silence. Puis : « D'accord {ma chérie|mon chéri}. Tu manges bien, au moins ? » Rien ne déstabilise une mère.", "J'ai appelé maman. Elle a écouté, puis a dit : « Ça me rappelle ta tante en 1987. Passe dimanche, on fait {w:food}. » Elle a raccroché. Je n'ai jamais su ce qui était arrivé à ma tante."], en: ["I called my mom to explain everything. Silence. Then: 'Okay sweetheart. Are you eating properly, at least?' Nothing fazes a mother.", "I called mom. She listened, then said: 'Reminds me of your aunt in 1987. Come by Sunday, we're having {w:food}.' She hung up. I never found out what happened to my aunt."] }, fx: { happy: 6, karma: 3 }, mood: 'love' },
      { label: { fr: 'Rester au lit', en: 'Stay in bed' }, text: { fr: ["J'ai passé ma seule journée dans un autre corps à regarder des séries en mangeant des chips. Le lendemain, j'étais redevenu{|e} moi. Sur le frigo, un nouveau Post-it : « Sérieux ? — L'Univers »", "Je suis resté{|e} au lit à regarder {w:show} en boucle. Expérience unique dans une vie, gâchée avec application. Le lendemain, Post-it sur le frigo : « Je ne sais même pas pourquoi je me donne du mal. — L'Univers »"], en: ["I spent my one day in another body watching shows and eating chips. The next morning I was back to me. New sticky note on the fridge: 'Seriously? — The Universe'", "I stayed in bed binge-watching {w:show}. A once-in-a-lifetime experience, thoroughly wasted. Next day, sticky note on the fridge: 'I don't even know why I bother. — The Universe'"] }, fx: { happy: 4, stress: -6 } },
    ],
  },

  // ── Clonage (3 étapes) ──
  {
    id: 'ch2_clone',
    icon: '🧬',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'hospital', mood: 'neutral', prop: 'tube' },
    when: { age: [20, 70], noFlag: 'ch2_clone' },
    weight: 3,
    once: true,
    text: {
      fr: ["Une start-up de la Silicon Valley, « CopyMe », te propose de te cloner gratuitement en échange de tes données personnelles et d'un échantillon « de ton choix ». Le commercial a l'air de ne pas avoir dormi depuis 2019.", "Au fond d'une clinique louche, un savant en peignoir te montre une cuve pleine de liquide vert. « Pour 2 000 balles, je vous en fais un deuxième. Garantie trois mois. »"],
      en: ["A Silicon Valley startup, 'CopyMe', offers to clone you for free in exchange for your personal data and a sample 'of your choice'. The salesman looks like he hasn't slept since 2019.", "In the back of a shady clinic, a scientist in a bathrobe shows you a vat of green goo. 'Two grand and I'll make you a second one. Three-month warranty.'"],
    },
    choices: [
      { label: { fr: 'Me faire cloner', en: 'Get cloned' }, text: { fr: "Il y a eu un bruit de mixeur, une odeur de soupe, et mon clone est sorti de la cuve tout nu, tout gluant, en disant « salut moi ». Il a mes grains de beauté et un meilleur dos.", en: "There was a blender noise, a soup smell, and my clone climbed out of the vat naked and slimy, saying 'hey, me'. He has my moles and better posture." }, fx: { money: -2000, happy: 8, flag: 'ch2_clone', schedule: { key: 'ch2_clone_2', years: 1 }, visual: 'gore' } },
      { label: { fr: 'Vendre mes droits', en: 'Sell my clone rights' }, text: { fr: "J'ai vendu les droits sur mon ADN pour 15 000 €. Quelque part, des copies de moi sont peut-être en train de livrer des colis. Je n'y pense pas trop.", en: "I sold the rights to my DNA for $15,000. Somewhere, copies of me might be delivering packages. I try not to think about it." }, fx: { money: 15000, karma: -5, stress: 5 } },
      { label: { fr: 'Refuser', en: 'Refuse' }, text: { fr: "J'ai refusé. Un seul moi, c'est déjà beaucoup pour l'humanité.", en: "I declined. One of me is already plenty for humanity." }, fx: { smarts: 2 } },
    ],
  },
  {
    id: 'ch2_clone_2',
    icon: '👯',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'apartment', mood: 'angry', prop: 'twin' },
    text: {
      fr: ["Un an plus tard, ton clone est meilleur que toi en tout. Il fait du sport, appelle tes parents, ne laisse pas traîner ses chaussettes. Tes parents l'ont invité au réveillon. Pas toi.", "Ton clone a eu une promotion. À ton travail. Sous ton nom. Ton entourage dit que tu as « beaucoup changé, en mieux ». Tu bouillonnes."],
      en: ["A year later, your clone is better than you at everything. Works out, calls your parents, picks up his socks. Your parents invited him to Christmas. Not you.", "Your clone got a promotion. At your job. Under your name. Everyone says you've 'changed so much, for the better'. You're seething."],
    },
    choices: [
      { label: { fr: 'Éliminer le clone', en: 'Eliminate the clone' }, text: { fr: "Je l'ai noyé dans la baignoire. Il avait exactement mon regard quand je rate un bus. Le sang avait mon groupe sanguin, évidemment. J'ai dû racheter un tapis de bain. Et un alibi.", en: "I drowned him in the bathtub. He had exactly my face when I miss a bus. The blood was my blood type, obviously. I had to buy a new bath mat. And an alibi." }, fx: { karma: -35, stress: 15, heat: 20, unflag: 'ch2_clone', visual: 'gore' }, mood: 'shock' },
      { label: { fr: 'Faire équipe', en: 'Team up' }, text: { fr: "On s'est partagé la vie : lui le boulot et les repas de famille, moi la sieste et les apéros. C'est le meilleur arrangement de toute l'histoire de l'humanité.", en: "We split life: he gets work and family dinners, I get naps and happy hours. Best arrangement in human history." }, fx: { happy: 15, stress: -15, discipline: -5, chain: 'ch2_clone_3' }, mood: 'happy' },
      { label: { fr: 'Le défier en duel', en: 'Challenge him to a duel' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "Duel au pistolet à billes dans le jardin. Je l'ai eu à l'œil. Il est reparti vivre chez mon ex. Bon débarras, à tous les deux.", en: "BB gun duel in the backyard. I got him in the eye. He moved in with my ex. Good riddance to both." }, fx: { happy: 8, unflag: 'ch2_clone' } },
        { w: 1, text: { fr: "Il a gagné. Évidemment, il s'entraîne, lui. Il m'a enfermé{|e} dans la cave et il a pris ma place. Je me suis échappé{|e} au bout de trois semaines. Personne ne s'était aperçu de rien.", en: "He won. Of course, he works out. He locked me in the basement and took my place. I escaped after three weeks. Nobody had noticed." }, fx: { happy: -15, health: -8, chain: 'ch2_clone_3' } },
      ] },
    ],
  },
  {
    id: 'ch2_clone_3',
    icon: '🧑‍🤝‍🧑',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'apartment', mood: 'shock', prop: 'clones', fx: 'explosion' },
    text: {
      fr: ["Ton clone s'est fait cloner. Puis les clones aussi. Vous êtes quatorze dans ton studio. Il n'y a qu'une brosse à dents. Il y a des tensions.", "Quatorze {first} {last} se disputent la télécommande. Les voisins portent plainte, la Sécu ne sait plus qui rembourser et deux de tes clones sont en couple. Ensemble."],
      en: ["Your clone got himself cloned. Then the clones did too. There are fourteen of you in your studio. One toothbrush. Tensions are high.", "Fourteen {first} {last}s fighting over the remote. The neighbors are suing, the insurance company doesn't know who to cover, and two of your clones are dating. Each other."],
    },
    choices: [
      { label: { fr: 'Monter une boîte', en: 'Start a company' }, text: { fr: "J'ai fondé une entreprise de déménagement : « Moi & Moi & Moi SARL ». Quatorze employés, zéro conflit de personnalité, une seule pause café. On est rentables.", en: "I started a moving company: 'Me, Myself & I LLC'. Fourteen employees, zero personality clashes, one coffee break. We're profitable." }, fx: { money: 90000, happy: 10, unflag: 'ch2_clone', visual: 'money' }, mood: 'proud' },
      { label: { fr: 'Me présenter aux élections', en: 'Run for office' }, text: { fr: "Je me suis présenté{|e} aux municipales. Quatorze voix garanties. J'ai perdu avec quatorze voix. Ma mère a voté pour l'autre candidat.", en: "I ran for city council. Fourteen guaranteed votes. I lost with fourteen votes. My mom voted for the other guy." }, fx: { fame: 10, happy: -5, unflag: 'ch2_clone' } },
      { label: { fr: 'Battle royale', en: 'Battle royale' }, text: { fr: "Un seul {first} peut rester. Ça a duré toute la nuit : couteaux à beurre, fer à repasser, une guitare. Le studio ressemblait à un abattoir. Le dernier debout, c'est moi. Je crois. J'espère.", en: "There can be only one {first}. It went on all night: butter knives, a clothes iron, a guitar. The studio looked like a slaughterhouse. The last one standing is me. I think. I hope." }, fx: { health: -25, karma: -30, stress: 20, heat: 30, unflag: 'ch2_clone', visual: 'gore' }, mood: 'shock' },
    ],
  },

  // ── Rétréci à 10 cm (2 étapes) ──
  {
    id: 'ch2_tiny',
    icon: '🤏',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'giant_cat' },
    when: { age: [14, 80] },
    weight: 4,
    once: true,
    text: {
      fr: ["Tu as mangé un kebab réchauffé trois fois au micro-ondes. Résultat : tu mesures 10 centimètres. Ta chaussette est un sac de couchage. Le chat te regarde avec beaucoup trop d'intérêt.", "Tu te réveilles au milieu d'un désert blanc et moelleux : ton oreiller. Tu mesures désormais la taille d'un Playmobil. Une miette de pain te sert de sandwich."],
      en: ["You ate a kebab microwaved three times. Result: you're now 4 inches tall. Your sock is a sleeping bag. The cat is looking at you with far too much interest.", "You wake up in the middle of a soft white desert: your pillow. You're now action-figure sized. A breadcrumb is a full sandwich."],
    },
    choices: [
      { label: { fr: 'Explorer la maison', en: 'Explore the house' }, text: { fr: "J'ai exploré sous le frigo. J'y ai trouvé une civilisation de moutons de poussière, trois pièces de 2 € et une araignée avec qui j'ai fait un duel au cure-dent. Elle a perdu une patte, moi un bout d'oreille.", en: "I explored under the fridge. Found a civilization of dust bunnies, three quarters and a spider I dueled with a toothpick. She lost a leg, I lost part of an ear." }, fx: { happy: 6, health: -5, flag: 'ch2_tiny', chain: 'ch2_tiny_2', visual: 'gore' } },
      { label: { fr: 'Aller bosser en poche', en: 'Go to work in a pocket' }, text: { fr: "Je suis allé{|e} au boulot dans la poche de chemise d'un collègue. J'ai fait la réunion depuis son col. Personne n'a remarqué. Il a éternué. Il y a eu des dégâts.", en: "I went to work in a coworker's shirt pocket. Did the meeting from his collar. Nobody noticed. He sneezed. There was collateral damage." }, fx: { perf: 5, happy: -4, flag: 'ch2_tiny', chain: 'ch2_tiny_2' } },
      { label: { fr: 'Chevaucher le chat', en: 'Ride the cat' }, text: { fr: "J'ai sauté sur le dos du chat et je l'ai chevauché comme un dragon. Il m'a emmené{|e} sur le toit, puis il m'a lâché{|e} dans la gouttière. Trahison féline.", en: "I jumped on the cat's back and rode it like a dragon. It took me to the roof, then dropped me in the gutter. Feline betrayal." }, fx: { athletic: 5, happy: 8, flag: 'ch2_tiny', chain: 'ch2_tiny_2' }, mood: 'party' },
    ],
  },
  {
    id: 'ch2_tiny_2',
    icon: '🐈',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock', prop: 'giant_cat', fx: 'gore' },
    text: {
      fr: ["Troisième jour à 10 cm. Ta famille a failli t'avaler dans une salade, l'aspirateur t'a pris en chasse et le chat a décidé que tu étais son jouet préféré. Il faut redevenir grand. Vite.", "Tu vis désormais dans une maison de poupée. Le chat rôde dehors, les babines retroussées. Un pharmacien du quartier dit avoir « un truc » qui pourrait marcher."],
      en: ["Day three at 4 inches. Your family nearly ate you in a salad, the vacuum hunted you down and the cat decided you're his favorite toy. You need to get big again. Fast.", "You now live in a dollhouse. The cat prowls outside, lips curled. A local pharmacist says he has 'something' that might work."],
    },
    choices: [
      { label: { fr: 'Prendre la potion', en: 'Take the potion' }, out: [
        { w: 3, text: { fr: "J'ai bu la potion du pharmacien. J'ai grandi d'un coup, en défonçant la maison de poupée. Je mesure 1 cm de plus qu'avant. Mes chaussures ne vont plus.", en: "I drank the pharmacist's potion. I shot back up, destroying the dollhouse. I'm now half an inch taller than before. My shoes don't fit." }, fx: { looks: 4, happy: 10, unflag: 'ch2_tiny' }, mood: 'happy' },
        { w: 1, text: { fr: "La potion a marché, mais seulement pour ma tête. J'ai une tête normale sur un corps de 10 cm pendant deux semaines. Puis le reste a suivi. Les photos existent.", en: "The potion worked, but only on my head. Normal-sized head on a 4-inch body for two weeks. Then the rest caught up. There are photos." }, fx: { looks: -8, fame: 5, unflag: 'ch2_tiny' } },
      ] },
      { label: { fr: 'Affronter le chat', en: 'Fight the cat' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "Armé{|e} d'une aiguille à coudre, j'ai piqué le chat dans la truffe. Il a fui en hurlant. Le lendemain, j'ai repris ma taille normale. Le chat ne me regarde plus dans les yeux.", en: "Armed with a sewing needle, I stabbed the cat in the nose. It fled screaming. The next day I returned to normal size. The cat won't look me in the eye anymore." }, fx: { athletic: 6, happy: 10, unflag: 'ch2_tiny' }, mood: 'proud' },
        { w: 1, text: { fr: "Le chat m'a joué{|e} pendant une heure, comme une souris, puis il m'a croqué{|e}. Il a recraché mes chaussures sur le paillasson, en cadeau.", en: "The cat played with me for an hour, like a mouse, then crunched me. It left my shoes on the doormat, as a gift." }, fx: { die: { fr: "croqué{|e} par mon propre chat alors que je mesurais 10 centimètres", en: "eaten by my own cat while I was 4 inches tall" }, visual: 'gore' } },
      ] },
      { label: { fr: 'Rester petit{|e}', en: 'Stay small' }, text: { fr: "J'ai décidé de rester petit{|e}. Je mange une lentille par jour, je ne paie plus de loyer et je voyage gratuit dans les sacs à main. La vie est belle à 10 cm. Puis j'ai regrandi d'un coup, dans le métro, au milieu d'une foule.", en: "I decided to stay small. I eat one lentil a day, pay no rent and travel free in handbags. Life is great at 4 inches. Then I suddenly regrew, on the subway, in a crowd." }, fx: { money: 2000, happy: 6, health: -6, unflag: 'ch2_tiny' } },
    ],
  },

  // ── Invisible ──
  {
    id: 'ch2_invisible',
    icon: '👻',
    cat: 'chaos',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'empty_clothes', fx: 'ghost' },
    when: { age: [16, 80] },
    weight: 4,
    once: true,
    text: {
      fr: ["Tu as éternué si fort que tu as disparu. Littéralement. Ton miroir ne montre plus qu'une brosse à dents qui flotte. L'effet devrait durer une semaine, selon un forum très sérieux.", "Ce matin, ta main est transparente. Puis ton bras. Puis tout le reste. Tu es invisible. Ton chien aboie dans le vide, ce qui, pour une fois, est justifié."],
      en: ["You sneezed so hard you vanished. Literally. Your mirror now shows only a floating toothbrush. It should last a week, according to a very reputable forum.", "This morning your hand is see-through. Then your arm. Then everything. You're invisible. Your dog barks at nothing, which, for once, is justified."],
    },
    choices: [
      { label: { fr: 'Espionner les collègues', en: 'Spy on coworkers' }, text: { fr: "J'ai espionné mes collègues. Ils m'appellent « la Plante Verte » quand je ne suis pas là. Ils ont tous une cagnotte pour mon pot de départ. Il n'y a jamais eu de départ prévu.", en: "I spied on my coworkers. They call me 'the Houseplant' behind my back. They all chipped in for my farewell party. No farewell was ever planned." }, fx: { smarts: 4, happy: -8, stress: 6 }, mood: 'sad' },
      { label: { fr: 'Concert gratuit', en: 'Sneak into a concert' }, text: { fr: "Je suis monté{|e} sur scène pendant un concert de stade, juste à côté du chanteur. J'ai chanté plus fort que lui. Les fans ont cru à un bug de sono.", en: "I got on stage at a stadium concert, right next to the singer. I sang louder than him. Fans thought it was a sound system glitch." }, fx: { happy: 14 }, mood: 'party' },
      { label: { fr: 'Braquer une banque', en: 'Rob a bank' }, out: [
        { w: 1, text: { fr: "Je suis entré{|e} dans la banque et j'ai rempli un sac. Personne ne voyait rien. J'ai juste oublié que le sac, lui, n'était pas invisible. Un sac volant qui sort d'une banque, ça se remarque.", en: "I walked into the bank and filled a bag. Nobody could see me. I just forgot the bag wasn't invisible. A flying bag leaving a bank gets noticed." }, fx: { arrest: 'bank', heat: 40, visual: 'police' } },
        { w: 1, text: { fr: "J'ai vidé la caisse et je suis reparti{|e} tout nu{|e} dans la rue avec les billets dans la bouche. Ça a marché. J'ai attrapé un rhume, mais je suis riche.", en: "I emptied the till and walked out naked with the cash in my mouth. It worked. I caught a cold, but I'm rich." }, fx: { money: 85000, karma: -15, disease: 'cold', visual: 'money' } },
      ] },
      { label: { fr: 'Hanter mon ex', en: 'Haunt my ex' }, text: { fr: "J'ai passé la semaine chez mon ex à déplacer ses affaires et à souffler dans son cou. Ex a déménagé, changé de numéro et rejoint une église. Mission accomplie.", en: "I spent the week at my ex's, moving their stuff and breathing on their neck. They moved, changed numbers and joined a church. Mission accomplished." }, fx: { happy: 10, karma: -8 }, mood: 'happy' },
    ],
  },

  // ── Lampe magique 2.0 : le génie sarcastique (2 étapes) ──
  {
    id: 'ch2_lamp',
    icon: '🪔',
    cat: 'weird',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'lamp', fx: 'ghost' },
    when: { age: [18, 90] },
    weight: 1,
    once: true,
    text: {
      fr: ["Tu as acheté une lampe à huile sur Leboncoin. Un nuage violet en sort, puis un génie en jogging, cigarette au bec : « Je m'appelle Didier. Un vœu, pas trois, on a eu des coupes budgétaires. Et fais vite, mon ancien maître est mort en réfléchissant. »", "En frottant la lampe de ta grand-mère, tu libères un génie qui soupire très, très fort. « Super. Encore un. Bon, un seul vœu, je suis payé à la commission. Pas de vœu d'amour, pas de résurrection, pas de « plus de vœux ». J'ai un avocat. »"],
      en: ["You bought an oil lamp online. A purple cloud billows out, then a genie in sweatpants, cigarette in mouth: 'I'm Doug. One wish, not three, budget cuts. And hurry, my last master died thinking about it.'", "Rubbing your grandma's lamp releases a genie who sighs very, very loudly. 'Great. Another one. One wish, I work on commission. No love wishes, no resurrections, no \"more wishes\". I have a lawyer.'"],
    },
    choices: [
      { label: { fr: '« Être riche »', en: '"Make me rich"' }, text: { fr: "« Riche, original. » Il m'a donné un million… en pièces de 1 centime, livrées sur le toit de ma voiture. La voiture n'a pas survécu. J'ai mis six mois à tout rouler.", en: "'Rich. How original.' He gave me a million… in pennies, delivered onto my car roof. The car didn't survive. It took six months to roll them all." }, fx: { money: 10000, loseAsset: 'car', flag: 'ch2_lamp', schedule: { key: 'ch2_lamp_2', years: 1 }, visual: 'money' } },
      { label: { fr: '« Être canon »', en: '"Make me hot"' }, text: { fr: "Il m'a rendu{|e} magnifique. Selon les critères de beauté du XVe siècle : peau blafarde, front immense, ventre rond. Les peintres flamands m'adoreraient.", en: "He made me gorgeous. By 15th-century standards: pasty skin, huge forehead, round belly. Flemish painters would adore me." }, fx: { looks: -5, weight: 0.06, fame: 3, flag: 'ch2_lamp', schedule: { key: 'ch2_lamp_2', years: 1 } } },
      { label: { fr: '« La paix dans le monde »', en: '"World peace"' }, text: { fr: "« Oh là là, quelle belle âme. » Il a supprimé tous les humains sauf moi pendant quatre secondes. C'était très calme. Puis il les a remis. « Voilà, t'as eu ta paix. »", en: "'Oh wow, what a beautiful soul.' He deleted every human except me for four seconds. It was very peaceful. Then he put them back. 'There. You had your peace.'" }, fx: { karma: 10, stress: 10, flag: 'ch2_lamp', schedule: { key: 'ch2_lamp_2', years: 1 } } },
      { label: { fr: '« Que tu sois libre »', en: '"Set yourself free"' }, text: { fr: "Il m'a regardé{|e} longtemps. « Personne ne m'avait jamais demandé ça. » Il a pleuré dans sa manche. Puis il a dit : « Du coup, je dors où ? »", en: "He stared at me for a long time. 'Nobody's ever asked me that.' He cried into his sleeve. Then he said: 'So… where do I sleep?'" }, fx: { karma: 20, happy: 8, flag: 'ch2_lamp', schedule: { key: 'ch2_lamp_2', years: 1 } }, mood: 'love' },
    ],
  },
  {
    id: 'ch2_lamp_2',
    icon: '🧞',
    cat: 'weird',
    rating: 1,
    chainOnly: true,
    scene: { place: 'apartment', mood: 'angry', prop: 'couch', fx: 'ghost' },
    text: {
      fr: ["Didier le génie est revenu. Il a été viré par sa lampe et il dort sur ton canapé depuis trois semaines. Il mange tes céréales, commente tes choix de vie et fume dans la salle de bains.", "Le génie squatte chez toi. Il appelle ça « une période de transition ». Il a laissé des poils bleus dans la douche et un sarcasme dans chaque pièce."],
      en: ["Doug the genie is back. His lamp fired him and he's been sleeping on your couch for three weeks. He eats your cereal, critiques your life choices and smokes in the bathroom.", "The genie is squatting at your place. He calls it 'a transition period'. He left blue hairs in the shower and sarcasm in every room."],
    },
    choices: [
      { label: { fr: 'Le mettre dehors', en: 'Kick him out' }, text: { fr: "Je l'ai mis dehors. Il m'a jeté une malédiction en partant : mes chaussettes seront éternellement un peu humides. C'est pire que la mort.", en: "I kicked him out. He cursed me on the way: my socks will be slightly damp for all eternity. Worse than death." }, fx: { happy: -8, karma: -5, stress: 5, unflag: 'ch2_lamp' }, mood: 'angry' },
      { label: { fr: 'Lui trouver un job', en: 'Find him a job' }, text: { fr: "Je l'ai inscrit à France Travail. Il est conseiller clientèle chez un opérateur téléphonique. Il exauce les vœux de résiliation avec une joie sadique. Il me paie un loyer.", en: "I signed him up at the job center. He's now a customer service rep at a phone company. He grants cancellation wishes with sadistic glee. He pays me rent." }, fx: { money: 6000, karma: 10, unflag: 'ch2_lamp' }, mood: 'proud' },
      { label: { fr: 'En faire mon coloc', en: 'Make him my roommate' }, text: { fr: "Didier est devenu mon meilleur ami. Il fait des cocktails en claquant des doigts et il roaste mes dates avant qu'ils arrivent. C'est mieux qu'un vœu.", en: "Doug became my best friend. He makes cocktails with a snap and roasts my dates before they arrive. Better than a wish." }, fx: { happy: 12, addiction: ['alcohol', 8], newNpc: { role: 'friend', age: [40, 60], abs: true, gender: 'm' }, unflag: 'ch2_lamp' }, mood: 'happy' },
    ],
  },

  // ── Pacte avec un leprechaun (2 étapes) ──
  {
    id: 'ch2_leprechaun',
    icon: '☘️',
    cat: 'weird',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'rainbow', fx: 'money' },
    when: { age: [18, 90] },
    weight: 1,
    once: true,
    vars: { amount: [60000, 250000] },
    text: {
      fr: ["Au bout d'un arc-en-ciel, sur le parking d'un Lidl, un leprechaun bourré nommé Seamus est assis sur un chaudron d'or. « Il est à toi, mon gars. Contre un p'tit service, plus tard. Rien de grave. Presque rien. »", "Un petit homme roux en costume vert te bloque le passage. Il pue le whisky et le trèfle. « T'veux mon or ? Topes-là. J'te demanderai juste un truc un jour. Un truc tout bête. »"],
      en: ["At the end of a rainbow, in a supermarket parking lot, a drunk leprechaun named Seamus sits on a pot of gold. 'It's yours, lad. For a wee favor, later. Nothin' serious. Barely anythin'.'", "A tiny red-haired man in a green suit blocks your path. He reeks of whiskey and clover. 'Want me gold? Shake on it. I'll just ask ye for one thing someday. A wee simple thing.'"],
    },
    choices: [
      { label: { fr: 'Topes-là', en: 'Shake on it' }, text: { fr: "J'ai serré sa petite main gluante. Le chaudron contenait {$amount} en or. Seamus a ricané en disparaissant dans un nuage de trèfles. Je n'aime pas ce ricanement.", en: "I shook his sticky little hand. The pot held {$amount} in gold. Seamus cackled as he vanished in a puff of clover. I don't like that cackle." }, fx: { money: 'amount', happy: 15, flag: 'ch2_leprechaun_debt', schedule: { key: 'ch2_leprechaun_debt', years: 3 }, visual: 'money' }, mood: 'happy' },
      { label: { fr: 'Le cogner et piquer l\'or', en: 'Punch him, take the gold' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "Je l'ai shooté comme un ballon de rugby. Il a volé jusqu'à la benne à cartons. J'ai pris l'or et je me suis barré{|e}. Je l'entends encore jurer en gaélique la nuit.", en: "I punted him like a rugby ball. He flew into the cardboard dumpster. I took the gold and ran. I still hear him swearing in Gaelic at night." }, fx: { money: 'amount', karma: -20, flag: 'ch2_leprechaun_debt', schedule: { key: 'ch2_leprechaun_debt', years: 3 }, visual: 'money' } },
        { w: 1, text: { fr: "Il m'a mordu la cheville jusqu'à l'os, puis il m'a recraché du whisky brûlant dans les yeux. Je suis reparti{|e} en boitant, aveugle et pauvre.", en: "He bit my ankle to the bone, then spat burning whiskey in my eyes. I limped away, blind and broke." }, fx: { health: -15, looks: -4, visual: 'gore' } },
      ] },
      { label: { fr: 'Boire avec lui', en: 'Drink with him' }, text: { fr: "On a bu trois bouteilles de whisky sur le parking. Il m'a appris des chansons de marin et pissé sur la voiture d'un vigile. Je me suis réveillé{|e} dans un caddie avec une pièce d'or dans la bouche.", en: "We drank three bottles of whiskey in the parking lot. He taught me sea shanties and peed on a security guard's car. I woke up in a shopping cart with a gold coin in my mouth." }, fx: { money: 1500, happy: 10, health: -6, addiction: ['alcohol', 12] }, mood: 'party' },
    ],
  },
  {
    id: 'ch2_leprechaun_debt',
    icon: '🍀',
    cat: 'weird',
    rating: 2,
    chainOnly: true,
    scene: { place: 'cemetery', mood: 'shock', prop: 'shovel' },
    when: { flag: 'ch2_leprechaun_debt' },
    text: {
      fr: ["Trois ans plus tard, à 3 h du matin, on frappe. Seamus, une pelle sur l'épaule. « L'heure du p'tit service. Faut m'aider à enterrer une licorne. Ou ton rein gauche. Au choix. »", "Seamus est revenu. Il a un sac poubelle qui bouge et un sourire édenté. « Tu te souviens d'notre accord ? Eh ben, c'est maintenant. »"],
      en: ["Three years later, 3am, a knock. Seamus, shovel on his shoulder. 'Time for that wee favor. Help me bury a unicorn. Or give me your left kidney. Your pick.'", "Seamus is back. He has a garbage bag that's moving and a toothless grin. 'Remember our deal? Well. It's now.'"],
    },
    choices: [
      { label: { fr: 'Creuser', en: 'Dig' }, text: { fr: "J'ai creusé toute la nuit. Dans le sac, il y avait une licorne avec une flèche dans le cul, qui sentait la barbe à papa avariée. On l'a enterrée sous un rond-point. Je ne pose pas de questions.", en: "I dug all night. In the bag was a unicorn with an arrow in its butt, smelling of rancid cotton candy. We buried it under a roundabout. I ask no questions." }, fx: { karma: -10, stress: 12, athletic: 4, heat: 10, unflag: 'ch2_leprechaun_debt' } },
      { label: { fr: 'Donner un rein', en: 'Give a kidney' }, text: { fr: "Il me l'a retiré sur la table de la cuisine avec une cuillère à melon et une bouteille de whisky en guise d'anesthésie. Puis il l'a mangé, sur place, avec du sel.", en: "He removed it on my kitchen table with a melon baller and a bottle of whiskey for anesthesia. Then he ate it, right there, with salt." }, fx: { health: -25, happy: -10, unflag: 'ch2_leprechaun_debt', visual: 'gore' }, mood: 'sick' },
      { label: { fr: 'Refuser', en: 'Refuse' }, text: { fr: "J'ai refusé. Seamus a souri et claqué des doigts. Tout ce que je touche devient vert. Mon argent fond un peu chaque mois. Et mes cheveux sont roux. Pour toujours.", en: "I refused. Seamus smiled and snapped his fingers. Everything I touch turns green. My money melts a little every month. And my hair is ginger. Forever." }, fx: { moneyPct: -0.3, looks: -8, karma: 5, unflag: 'ch2_leprechaun_debt' }, mood: 'angry' },
    ],
  },

  // ── Meubles qui parlent ──
  {
    id: 'ch2_furniture',
    icon: '🛋️',
    cat: 'weird',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'sofa' },
    when: { age: [5, 99] },
    weight: 5,
    once: true,
    text: {
      fr: [
        "Ton canapé a parlé. « Tu pourrais t'asseoir moins fort ? » Puis l'armoire s'est mise à pleurer parce qu'elle est amoureuse de la lampe, qui ne la regarde même pas.",
        "Ce soir, tes meubles ont décidé de parler. La chaise se plaint de ton poids, la table basse est complotiste et le lit raconte TOUT ce qu'il a vu.",
        "Ta table basse vient de t'annoncer, très sérieusement, {w:conspiracy}. Le canapé lève les yeux au ciel. L'armoire pleure dans son coin : elle aime la lampe, qui ne la calcule pas.",
        "Tes meubles parlent. Ton lit dit que tu ronfles comme {w:vehicle}, ta chaise te traite de « {w:insult} » et {w:object}, dans le placard, réclame qu'on s'en serve enfin. Ambiance de famille recomposée.",
        "Le canapé parle depuis {w:time}. Il veut qu'on arrête de manger {w:food} sur lui. L'armoire, elle, fait une crise de jalousie parce que la lampe drague le grille-pain. Ta maison est un soap opera.",
      ],
      en: [
        "Your couch spoke. 'Could you sit down less hard?' Then the wardrobe started crying because it's in love with the lamp, who won't even look at it.",
        "Tonight your furniture decided to talk. The chair complains about your weight, the coffee table is a conspiracy theorist and the bed tells EVERYTHING it's seen.",
        "Your coffee table just informed you, very seriously, {w:conspiracy}. The couch rolls its eyes. The wardrobe is weeping in the corner: it loves the lamp, who ignores it.",
        "Your furniture is talking. Your bed says you snore like {w:vehicle}, your chair calls you '{w:insult}', and {w:object} in the closet demands to finally be used. Very blended-family vibes.",
        "The couch has been talking since {w:time}. It wants people to stop eating {w:food} on it. The wardrobe is having a jealous fit because the lamp is flirting with the toaster. Your home is a soap opera.",
      ],
    },
    choices: [
      { label: { fr: 'Thérapie de couple', en: 'Couples therapy' }, text: { fr: ["J'ai organisé une thérapie entre l'armoire et la lampe. Ça s'est mal fini : la lampe a avoué qu'elle préférait le grille-pain. L'armoire a claqué ses portes toute la nuit.", "J'ai fait de la médiation entre l'armoire et la lampe pendant [[trois heures|une nuit entière|un week-end]]. Résultat : elles se sont mises ensemble. Elles s'allument mutuellement. Je dors sur le canapé, qui ne se gêne pas pour commenter."], en: ["I organized therapy between the wardrobe and the lamp. It went badly: the lamp admitted it prefers the toaster. The wardrobe slammed its doors all night.", "I mediated between the wardrobe and the lamp for [[three hours|an entire night|a whole weekend]]. Result: they got together. They turn each other on. I sleep on the couch, which comments freely."] }, fx: { karma: 5, happy: 6, smarts: 2 } },
      { label: { fr: 'Vendre le canapé', en: 'Sell the couch' }, text: { fr: ["J'ai vendu le canapé sur internet. Il a hurlé pendant tout le trajet dans la camionnette. L'acheteur m'a laissé une note de 1 étoile : « bruyant ».", "J'ai mis le canapé en vente. Il a sabordé chaque visite en racontant aux acheteurs ce que j'avais fait dessus. Finalement, je l'ai échangé contre {w:object}. Lui, au moins, il se tait."], en: ["I sold the couch online. It screamed the whole way in the van. The buyer left me a 1-star review: 'noisy'.", "I listed the couch for sale. It sabotaged every viewing by telling buyers what I'd done on it. In the end I traded it for {w:object}. At least that one keeps quiet."] }, fx: { money: 150, karma: -5 } },
      { label: { fr: 'Écouter les ragots', en: 'Listen to the gossip' }, text: { fr: ["J'ai écouté les ragots du lit et du frigo pendant des heures. J'en sais trop. Sur tout le monde. Je ne pourrai plus jamais regarder la machine à laver en face.", "J'ai écouté les ragots. Le frigo sait tout sur mes régimes ratés, le miroir a une liste de mes pires grimaces et le lit a des choses à dire sur mes ex. J'ai ouvert {w:drink} et j'ai pris des notes."], en: ["I listened to the bed and fridge gossip for hours. I know too much. About everyone. I'll never look the washing machine in the eye again.", "I listened to the gossip. The fridge knows everything about my failed diets, the mirror keeps a list of my worst faces and the bed has things to say about my exes. I opened {w:drink} and took notes."] }, fx: { smarts: 4, happy: 8 }, mood: 'happy' },
    ],
  },

  // ── Univers parallèle où tu es célèbre (légendaire) ──
  {
    id: 'ch2_parallel',
    icon: '🌌',
    cat: 'chaos',
    rating: 0,
    scene: { place: 'stadium', mood: 'shock', prop: 'statue', fx: 'confetti' },
    when: { age: [14, 90] },
    weight: 1,
    once: true,
    text: {
      fr: ["Tu tombes dans une bouche d'égout et tu ressors dans un monde presque identique. Sauf que ta tête est sur les billets de banque, il y a une statue de toi devant la mairie et des fans s'évanouissent sur ton passage.", "Après un drôle de vertige, tu te retrouves dans un univers parallèle où tu es la plus grande star de la planète. Petit détail : ici, les croissants n'existent pas."],
      en: ["You fall into a manhole and climb out into an almost identical world. Except your face is on the money, there's a statue of you outside city hall and fans faint as you walk by.", "After a weird dizzy spell, you find yourself in a parallel universe where you're the biggest star on Earth. Minor detail: croissants don't exist here."],
    },
    choices: [
      { label: { fr: 'Profiter à fond', en: 'Enjoy it fully' }, text: { fr: "J'ai donné un concert devant 80 000 personnes alors que je ne sais pas chanter. Ils ont adoré. Le lendemain, je suis revenu{|e} dans mon monde. Bizarrement, mon compte Instagram a gardé quelques fans de là-bas.", en: "I played a concert to 80,000 people even though I can't sing. They loved it. The next day I was back in my world. Weirdly, my Instagram kept some fans from over there." }, fx: { happy: 20, fame: 20, followers: 250000, visual: 'confetti' }, mood: 'party' },
      { label: { fr: 'Rencontrer mon double', en: 'Meet my other self' }, text: { fr: "J'ai rencontré l'autre moi, la star. Un{|e} vrai{|e} connard{|e} : lunettes de soleil la nuit, assistant qu'il gifle, cocaïne au petit-déj. La célébrité m'aurait détruit{|e}. Je suis rentré{|e} chez moi soulagé{|e}.", en: "I met the other me, the star. A total jerk: sunglasses at night, slaps their assistant, cocaine for breakfast. Fame would've ruined me. I went home relieved." }, fx: { karma: 10, smarts: 6, happy: 8 } },
      { label: { fr: 'Ramener un souvenir', en: 'Bring back a souvenir' }, text: { fr: "J'ai ramené un billet de banque à mon effigie. Je l'ai fait encadrer. Personne ne me croit, mais il est accroché dans mon salon et c'est tout ce qui compte.", en: "I brought back a banknote with my face on it. I had it framed. Nobody believes me, but it hangs in my living room and that's what matters." }, fx: { happy: 10, fame: 5 } },
    ],
  },

  // ── Rencontre avec ton toi du futur ──
  {
    id: 'ch2_future_self',
    icon: '👴',
    cat: 'chaos',
    rating: 1,
    scene: { place: 'home', mood: 'shock', prop: 'portal', fx: 'ghost' },
    when: { age: [18, 50] },
    weight: 3,
    once: true,
    text: {
      fr: ["Un éclair dans la cuisine. Un vieux de 78 ans en peignoir sort d'un portail, pue le whisky et te ressemble trait pour trait. « Écoute-moi bien, {first}. J'ai trois avertissements et quatre minutes. »", "Ton toi du futur vient d'apparaître dans ta salle de bains. Il lui manque deux dents, il a un tatouage de dauphin sur la joue et il pleure. « Ne fais pas ce que j'ai fait. Surtout le dauphin. »"],
      en: ["A flash in the kitchen. A 78-year-old in a bathrobe steps out of a portal, reeks of whiskey and looks exactly like you. 'Listen up, {first}. I have three warnings and four minutes.'", "Your future self just appeared in your bathroom. Missing two teeth, a dolphin tattoo on the cheek, and crying. 'Don't do what I did. Especially the dolphin.'"],
    },
    choices: [
      { label: { fr: 'Écouter les conseils', en: 'Listen to the advice' }, text: { fr: "Conseil 1 : ne jamais investir dans les moules. Conseil 2 : appelle ta mère. Conseil 3 : le jour où quelqu'un te propose un « raccourci à travers le zoo », refuse. Puis il a disparu en laissant son dentier.", en: "Advice 1: never invest in mussels. Advice 2: call your mother. Advice 3: if anyone ever offers you 'a shortcut through the zoo', say no. Then he vanished, leaving his dentures." }, fx: { smarts: 8, karma: 6, stress: -4 }, mood: 'proud' },
      { label: { fr: 'Demander les numéros du loto', en: 'Ask for lottery numbers' }, out: [
        { w: 1, text: { fr: "Il m'a donné les numéros du loto. J'ai gagné 40 000 €. Il avait oublié de préciser qu'on serait 3 000 à gagner. Mais quand même.", en: "He gave me the lottery numbers. I won $40,000. He forgot to mention 3,000 others would win too. Still." }, fx: { money: 40000, happy: 12, visual: 'money' }, mood: 'happy' },
        { w: 1, text: { fr: "Il m'a donné des numéros. C'étaient ceux de sa chambre d'hôpital, de sa pointure et de son âge. Il est sénile. Je serai sénile. J'ai perdu 50 balles.", en: "He gave me numbers. They were his hospital room, his shoe size and his age. He's senile. I will be senile. I lost 50 bucks." }, fx: { money: -50, happy: -6 } },
      ] },
      { label: { fr: 'Le frapper', en: 'Punch him' }, text: { fr: "Je l'ai frappé pour tout ce qu'il allait me faire subir. Un bleu est apparu instantanément sur ma propre joue. Paradoxe temporel. On a pleuré ensemble.", en: "I punched him for everything he was going to put me through. A bruise instantly appeared on my own cheek. Time paradox. We cried together." }, fx: { health: -5, happy: -3, smarts: 3 } },
    ],
  },

  // ── Bug de la simulation (2 étapes) ──
  {
    id: 'ch2_glitch',
    icon: '👾',
    cat: 'chaos',
    rating: 1,
    scene: { place: 'park', mood: 'shock', prop: 'frozen_people', fx: 'ghost' },
    when: { age: [12, 90] },
    weight: 4,
    once: true,
    text: {
      fr: ["Les passants se figent en pleine phrase. Un pigeon est coincé à moitié dans un mur, bloqué en position « vol ». Le ciel affiche en lettres pixelisées : CHARGEMENT… Il n'y a que toi qui bouges.", "Tu croises le même homme en manteau rouge trois fois en dix secondes. Puis ta voisine marche en ligne droite dans un mur, encore et encore. La réalité rame comme un vieux PC."],
      en: ["Passersby freeze mid-sentence. A pigeon is stuck halfway into a wall, locked in 'flying' pose. The sky reads in pixelated letters: LOADING… Only you can move.", "You pass the same man in a red coat three times in ten seconds. Then your neighbor walks straight into a wall, over and over. Reality is lagging like an old PC."],
    },
    choices: [
      { label: { fr: 'Traverser le mur', en: 'Walk through the wall' }, text: { fr: "J'ai foncé dans le mur. Je suis passé{|e} à travers. Puis à travers le sol. Je suis tombé{|e} sous la carte, dans un grand vide blanc.", en: "I ran at the wall. I went through. Then through the floor. I fell under the map, into a huge white void." }, fx: { stress: 10, flag: 'ch2_glitch', chain: 'ch2_glitch_dev' } },
      { label: { fr: 'Crier « C\'EST UNE SIMULATION »', en: 'Yell "IT\'S A SIMULATION"' }, text: { fr: "J'ai hurlé « JE SAIS QUE C'EST UNE SIMULATION ! » Tout s'est remis en marche. Les gens m'ont regardé{|e}. Un enfant m'a montré{|e} du doigt. Le pigeon a fini sa phrase.", en: "I screamed 'I KNOW THIS IS A SIMULATION!' Everything resumed. People stared. A kid pointed at me. The pigeon finished its sentence." }, fx: { happy: -4, fame: 2, flag: 'ch2_glitch' } },
      { label: { fr: 'Fouiller les poches figées', en: 'Loot the frozen people' }, text: { fr: "J'ai profité du bug pour faire les poches des gens figés. 300 €, un ticket de métro et une dent. Quand tout a redémarré, un vieux monsieur cherchait sa dent.", en: "I used the glitch to pick frozen people's pockets. $300, a subway ticket and a tooth. When it all restarted, an old man was looking for his tooth." }, fx: { money: 300, karma: -10, flag: 'ch2_glitch' } },
    ],
  },
  {
    id: 'ch2_glitch_dev',
    icon: '🖥️',
    cat: 'chaos',
    rating: 1,
    chainOnly: true,
    scene: { place: 'studio', mood: 'shock', prop: 'console', fx: 'ghost' },
    text: {
      fr: ["Sous la carte, tout est blanc. Une console de commande flotte devant toi. Au loin, deux voix étouffées, comme d'un canapé : « Attends, {il|elle} est sorti{|e} de la map ? — Laisse, ça va être drôle. »", "Le vide blanc. Un curseur qui clignote. Et quelque part au-dessus, deux géants invisibles qui mangent des chips en te regardant. L'un dit : « Tape un truc, pour voir. »"],
      en: ["Under the map, everything is white. A command console floats in front of you. In the distance, two muffled voices, as if from a couch: 'Wait, did they fall out of the map? — Leave it, this'll be funny.'", "The white void. A blinking cursor. And somewhere above, two invisible giants eating chips while watching you. One says: 'Type something, let's see.'"],
    },
    choices: [
      { label: { fr: 'Taper « money »', en: 'Type "money"' }, text: { fr: "J'ai tapé « money 1000000 ». Il y a eu un bruit de caisse enregistreuse et je me suis réveillé{|e} dans mon lit. Mon compte affiche 100 000. Le patch correctif a dû passer entre-temps.", en: "I typed 'money 1000000'. Cha-ching, and I woke up in bed. My account shows 100,000. A hotfix must have rolled out in between." }, fx: { money: 100000, karma: -5, unflag: 'ch2_glitch', visual: 'money' }, mood: 'happy' },
      { label: { fr: 'Supplier les joueurs', en: 'Beg the players' }, text: { fr: "J'ai levé les yeux et supplié : « S'il vous plaît, arrêtez de me faire souffrir pour rigoler. » Il y a eu un long silence gêné. Puis un des géants a dit : « Bon… on lui met un peu de bonheur ? »", en: "I looked up and begged: 'Please stop making me suffer for laughs.' Long awkward silence. Then one giant said: 'Okay… give them a little happiness?'" }, fx: { happy: 20, karma: 8, unflag: 'ch2_glitch' }, mood: 'love' },
      { label: { fr: 'Activer le god mode', en: 'Enable god mode' }, text: { fr: "J'ai tapé « godmode ». Je me suis senti{|e} invincible. Puis je me suis réveillé{|e} dans mon lit, en pleine forme. Le chien parle portugais, maintenant. Effet secondaire.", en: "I typed 'godmode'. I felt invincible. Then I woke up in bed, in perfect shape. The dog speaks Portuguese now. Side effect." }, fx: { health: 25, looks: 5, unflag: 'ch2_glitch' } },
    ],
  },

  // ═════════════════════════════ ÉLUS, HÉROS & MÉCHANTS ═════════════════════════════

  // ── Messie d'une religion bizarre (3 étapes) ──
  {
    id: 'ch2_messiah',
    icon: '🐹',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'robes', fx: 'confetti' },
    when: { age: [20, 80] },
    weight: 2,
    once: true,
    text: {
      fr: ["Cinquante personnes en toge jaune se prosternent devant toi au rayon surgelés. Ta tache de naissance a la forme d'un hamster : selon la prophétie de l'Église du Saint Rongeur, tu es l'Élu{|e}. Ils pleurent. L'un d'eux lèche ta chaussure.", "« C'EST {LUI|ELLE} ! » Une secte de 200 adorateurs du Grand Hamster Cosmique t'a identifié{|e} comme leur messie, parce que tu as éternué trois fois devant leur temple. Ils t'offrent une couronne en copeaux de bois."],
      en: ["Fifty people in yellow robes bow before you in the frozen food aisle. Your birthmark is shaped like a hamster: according to the prophecy of the Church of the Holy Rodent, you are the Chosen One. They're weeping. One is licking your shoe.", "'IT'S {HIM|HER}!' A cult of 200 worshippers of the Great Cosmic Hamster has identified you as their messiah, because you sneezed three times outside their temple. They offer you a crown made of wood shavings."],
    },
    choices: [
      { label: { fr: 'Accepter mon destin', en: 'Accept my destiny' }, text: { fr: "J'ai accepté. Ils m'ont porté{|e} sur un trône en carton jusqu'à leur temple, un ancien Buffalo Grill. J'ai béni la foule avec une carotte. Ils ont hurlé de joie.", en: "I accepted. They carried me on a cardboard throne to their temple, a former Applebee's. I blessed the crowd with a carrot. They screamed with joy." }, fx: { fame: 20, happy: 12, flag: 'ch2_messiah', schedule: { key: 'ch2_messiah_2', years: 1 }, visual: 'confetti' }, mood: 'proud' },
      { label: { fr: 'Accepter pour le fric', en: 'Accept for the cash' }, text: { fr: "J'ai accepté, à condition que la quête me soit reversée à 100 %. Ils ont trouvé ça « très christique ». Premier dimanche : 14 000 € et un rein offert en offrande. J'ai gardé l'argent.", en: "I accepted, provided 100% of the collection goes to me. They found that 'very Christlike'. First Sunday: $14,000 and a kidney left as an offering. I kept the money." }, fx: { money: 14000, karma: -12, flag: ['ch2_messiah', 'ch2_prophet_greedy'], schedule: { key: 'ch2_messiah_2', years: 1 }, visual: 'money' } },
      { label: { fr: 'Prendre la fuite', en: 'Run away' }, text: { fr: "J'ai fui en abandonnant mon caddie. Ils m'ont suivi{|e} pendant six kilomètres en chantant. Depuis, je retrouve des graines de tournesol sur mon paillasson chaque matin.", en: "I fled, leaving my shopping cart. They followed me for four miles, singing. Since then I find sunflower seeds on my doormat every morning." }, fx: { athletic: 4, stress: 10 } },
    ],
  },
  {
    id: 'ch2_messiah_2',
    icon: '✨',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'castle', mood: 'neutral', prop: 'altar' },
    text: {
      fr: ["Tes 3 000 fidèles réclament un miracle. Marcher sur l'eau (la piscine municipale est réservée), changer l'eau en Ricard, ou guérir la mycose de frère Bernard, qui la montre à tout le monde avec fierté.", "Ta religion explose : 3 000 adeptes, une chaîne YouTube, des produits dérivés. Mais les fidèles s'impatientent. Ils veulent un miracle. Et une « communion intime » avec leur Élu{|e}."],
      en: ["Your 3,000 followers demand a miracle. Walk on water (the public pool is booked), turn water into wine, or heal Brother Bernard's foot fungus, which he proudly shows everyone.", "Your religion is booming: 3,000 followers, a YouTube channel, merch. But the faithful are getting restless. They want a miracle. And 'intimate communion' with their Chosen One."],
    },
    choices: [
      { label: { fr: 'Marcher sur l\'eau', en: 'Walk on water' }, out: [
        { w: 1, text: { fr: "J'ai posé des plaques de plexiglas sous la surface de la piscine. J'ai marché sur l'eau. Les fidèles ont fait des malaises. Frère Bernard a guéri de sa mycose par pure émotion.", en: "I placed plexiglass sheets just under the pool's surface. I walked on water. Followers fainted. Brother Bernard's fungus healed out of pure emotion." }, fx: { fame: 20, karma: -5, schedule: { key: 'ch2_messiah_3', years: 2 }, visual: 'confetti' }, mood: 'proud' },
        { w: 1, text: { fr: "Un fidèle avait déplacé une plaque. J'ai coulé à pic devant tout le monde, ressorti{|e} en recrachant un pansement. J'ai dit « c'était une métaphore ». Ils l'ont gobé.", en: "A follower had moved one sheet. I sank like a rock in front of everyone and came up spitting out a Band-Aid. I said 'it was a metaphor'. They bought it." }, fx: { health: -5, happy: -6, schedule: { key: 'ch2_messiah_3', years: 2 } } },
      ] },
      { label: { fr: 'Écrire des commandements', en: 'Write commandments' }, text: { fr: "J'ai écrit mes dix commandements. Le premier : « Tu ne mettras point d'ananas sur la pizza. » Le septième : « Tu feras ma vaisselle. » Ils sont gravés sur un frigo américain.", en: "I wrote my ten commandments. The first: 'Thou shalt not put pineapple on pizza.' The seventh: 'Thou shalt do my dishes.' They're engraved on a double-door fridge." }, fx: { fame: 10, happy: 10, schedule: { key: 'ch2_messiah_3', years: 2 } } },
      { label: { fr: 'La « communion intime »', en: 'The "intimate communion"' }, text: { fr: "Mes disciples réclamaient une communion intime avec moi. J'ai organisé une soirée fondue savoyarde géante. Ils étaient très déçus. Puis très bourrés. Ce qui s'est passé ensuite reste entre le Grand Hamster et nous.", en: "My disciples demanded intimate communion with me. I threw a giant cheese fondue night. They were very disappointed. Then very drunk. What happened next stays between us and the Great Hamster." }, fx: { happy: 12, karma: -6, addiction: ['alcohol', 6], schedule: { key: 'ch2_messiah_3', years: 2 } }, mood: 'party' },
    ],
  },
  {
    id: 'ch2_messiah_3',
    icon: '🪨',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'castle', mood: 'shock', prop: 'catapult', fx: 'explosion' },
    text: {
      fr: ["Le Jour de l'Ascension est arrivé. Selon la prophétie, l'Élu{|e} doit « monter au ciel ». Tes fidèles ont construit une catapulte géante. Ils sont très fiers. Ils te tendent un casque de vélo.", "Les anciens ont relu la prophétie : le Messie doit être « projeté vers le Grand Hamster ». Il y a une catapulte, 3 000 fidèles en transe et un huissier pour constater."],
      en: ["Ascension Day has come. According to the prophecy, the Chosen One must 'rise to the heavens'. Your followers built a giant catapult. They're very proud. They hand you a bike helmet.", "The elders reread the prophecy: the Messiah must be 'launched toward the Great Hamster'. There's a catapult, 3,000 entranced followers and a notary to witness it."],
    },
    choices: [
      { label: { fr: 'Monter dans la catapulte', en: 'Get in the catapult' }, out: [
        { w: 1, text: { fr: "J'ai volé 300 mètres et atterri dans un étang. Les fidèles ont crié au miracle. Je suis {un dieu|une déesse} vivant{|e} avec trois côtes cassées. Ma religion compte désormais 50 000 membres.", en: "I flew 1,000 feet and landed in a pond. The faithful cried miracle. I'm a living deity with three broken ribs. My religion now has 50,000 members." }, fx: { fame: 35, health: -20, money: 80000, unflag: 'ch2_messiah', visual: 'confetti' }, mood: 'proud' },
        { w: 1, text: { fr: "La catapulte m'a envoyé{|e} droit sur un pylône électrique. Il a plu des morceaux de moi sur les fidèles, qui les ont gardés comme reliques. Mon petit doigt est exposé dans une boîte à chaussures dorée.", en: "The catapult sent me straight into a power pylon. Bits of me rained down on the faithful, who kept them as relics. My pinky is displayed in a gold-painted shoebox." }, fx: { die: { fr: "catapulté{|e} contre un pylône électrique par mes propres fidèles, le jour de mon Ascension", en: "catapulted into a power pylon by my own followers on my Ascension Day" }, visual: 'gore' } },
      ] },
      { label: { fr: 'Fuir avec la caisse', en: 'Flee with the collection' }, text: { fr: "Pendant que tout le monde priait, j'ai pris la caisse et sauté dans un taxi pour l'aéroport. Je vis à Ibiza sous un faux nom. Les fidèles disent que je suis « monté{|e} au ciel ». Techniquement, en avion.", en: "While everyone prayed, I grabbed the collection box and jumped in a cab to the airport. I live in Ibiza under a fake name. The faithful say I 'ascended'. Technically, by plane." }, fx: { money: 220000, karma: -25, heat: 25, unflag: 'ch2_messiah', visual: 'money' }, mood: 'party' },
      { label: { fr: 'Nommer un successeur', en: 'Name a successor' }, text: { fr: "J'ai désigné mon successeur : un vrai hamster, nommé Pépito. Il a été catapulté à ma place. Il a survécu. Il est maintenant pape. Je suis son conseiller.", en: "I named my successor: an actual hamster called Pepito. He was catapulted in my place. He survived. He's now pope. I'm his advisor." }, fx: { karma: 5, happy: 10, fame: 10, unflag: 'ch2_messiah' } },
    ],
  },

  // ── Super-héros : pigeon radioactif → pouvoirs → méchant → retraite (4 étapes) ──
  {
    id: 'ch2_hero_bite',
    icon: '🐦',
    cat: 'chaos',
    rating: 0,
    scene: { place: 'park', mood: 'shock', prop: 'pigeon', fx: 'ghost' },
    when: { age: [8, 35], noFlag: 'ch2_hero' },
    weight: 2,
    once: true,
    text: {
      fr: ["En passant près de la centrale nucléaire, un pigeon vert fluo te mord le doigt. Il clignote. Toi aussi, un peu. Ton doigt fait « rou-rou ».", "Un pigeon radioactif s'est posé sur ton épaule et t'a pincé l'oreille avant de s'envoler en laissant une traînée lumineuse. Tu as des fourmis dans les bras. Et une soudaine envie de miettes."],
      en: ["Walking past the nuclear plant, a glowing green pigeon bites your finger. It's blinking. So are you, a little. Your finger goes 'coo-coo'.", "A radioactive pigeon landed on your shoulder and pinched your ear before flying off in a glowing streak. Your arms are tingling. And you have a sudden craving for breadcrumbs."],
    },
    choices: [
      { label: { fr: 'Aller aux urgences', en: 'Go to the ER' }, text: { fr: "Aux urgences, on m'a mis un pansement et dit que « c'est rien ». Le médecin a quand même pris une photo pour sa collection. Le soir, j'ai roucoulé dans mon sommeil.", en: "At the ER they gave me a Band-Aid and said 'it's nothing'. The doctor still took a photo for his collection. That night I cooed in my sleep." }, fx: { health: -2, flag: 'ch2_hero_bitten', schedule: { key: 'ch2_hero_powers', years: 1 } } },
      { label: { fr: 'Le mordre en retour', en: 'Bite it back' }, text: { fr: "J'ai mordu le pigeon. Il a eu l'air très surpris. J'ai craché des plumes fluo pendant une heure. Mes dents brillent dans le noir depuis.", en: "I bit the pigeon back. It looked very surprised. I spat glowing feathers for an hour. My teeth have glowed in the dark ever since." }, fx: { looks: -2, happy: 4, flag: 'ch2_hero_bitten', schedule: { key: 'ch2_hero_powers', years: 1 } } },
      { label: { fr: 'Ignorer', en: 'Ignore it' }, text: { fr: "J'ai ignoré la morsure. Depuis, je hoche la tête d'avant en arrière en marchant. Je fais comme si c'était voulu.", en: "I ignored the bite. Since then, my head bobs back and forth when I walk. I act like it's on purpose." }, fx: { flag: 'ch2_hero_bitten', schedule: { key: 'ch2_hero_powers', years: 1 } } },
    ],
  },
  {
    id: 'ch2_hero_powers',
    icon: '🦸',
    cat: 'chaos',
    rating: 0,
    chainOnly: true,
    scene: { place: 'park', mood: 'proud', prop: 'cape', fx: 'confetti' },
    text: {
      fr: ["Un an après la morsure : tu peux voler. Mal, et seulement à trois mètres du sol, mais tu voles. Tu retrouves ton chemin n'importe où, tu repères une miette à 800 mètres et tu comprends les pigeons. Ils sont tous complotistes.", "Tu as des super-pouvoirs. Tu voles (en battant des bras, c'est fatigant), tu as un sens de l'orientation infaillible et une force incroyable dans le cou. La ville a besoin d'un{|e} justicier{|ère}."],
      en: ["A year after the bite: you can fly. Badly, and only ten feet off the ground, but you fly. You can find your way anywhere, spot a crumb from half a mile and understand pigeons. They're all conspiracy theorists.", "You have superpowers. You fly (flapping your arms, exhausting), have a flawless sense of direction and incredible neck strength. The city needs a vigilante."],
    },
    choices: [
      { label: { fr: 'Devenir super-héros', en: 'Become a superhero' }, text: { fr: "J'ai cousu un costume gris et violet et je suis devenu{|e} {Captain Pigeon|Pigeonne Woman}. Premier sauvetage : un chat coincé dans un arbre. Il m'a griffé{|e}. La presse locale a adoré.", en: "I sewed a grey and purple suit and became {Captain Pigeon|Pigeon Woman}. First rescue: a cat stuck in a tree. It scratched me. The local paper loved it." }, fx: { fame: 15, karma: 10, athletic: 6, flag: 'ch2_hero', unflag: 'ch2_hero_bitten', schedule: { key: 'ch2_hero_villain', years: 2 } }, mood: 'proud' },
      { label: { fr: 'Rester discret{|e}', en: 'Keep it secret' }, text: { fr: "Je garde mes pouvoirs secrets. Je les utilise pour arriver à l'heure au boulot en survolant les bouchons. Parfois, la nuit, je sauve quelqu'un, et je repars sans rien dire.", en: "I keep my powers secret. I use them to fly over traffic and get to work on time. Sometimes, at night, I save someone and leave without a word." }, fx: { karma: 8, discipline: 6, flag: 'ch2_hero', unflag: 'ch2_hero_bitten', schedule: { key: 'ch2_hero_villain', years: 2 } } },
      { label: { fr: 'Monétiser mes pouvoirs', en: 'Monetize my powers' }, text: { fr: "J'ai ouvert une entreprise de livraison par les airs. 20 € le colis, livré en trois minutes. Amazon m'a envoyé une lettre de ses avocats. Je l'ai livrée moi-même à l'expéditeur.", en: "I started an airborne delivery service. $20 a package, delivered in three minutes. Amazon's lawyers sent me a letter. I delivered it back myself." }, fx: { money: 25000, fame: 6, flag: 'ch2_hero', unflag: 'ch2_hero_bitten', schedule: { key: 'ch2_hero_villain', years: 2 }, visual: 'money' } },
    ],
  },
  {
    id: 'ch2_hero_villain',
    icon: '😼',
    cat: 'chaos',
    rating: 0,
    chainOnly: true,
    when: { flag: 'ch2_hero' },
    scene: { place: 'office', mood: 'angry', prop: 'villain', fx: 'explosion' },
    text: {
      fr: ["Un super-vilain terrorise {city} : Docteur Croquette, un ancien comptable mordu par un chat radioactif. Il griffe les canapés de la mairie et a renversé tous les verres du centre-ville. Il te défie sur le toit de la préfecture.", "Le Docteur Croquette a pris en otage l'usine de pâtée de la ville. Il exige que les pigeons soient bannis. C'est personnel. C'est entre toi et lui."],
      en: ["A supervillain is terrorizing {city}: Doctor Kibble, a former accountant bitten by a radioactive cat. He's clawed up city hall's sofas and knocked every glass downtown off the table. He challenges you on the courthouse roof.", "Doctor Kibble has taken the city's pet food factory hostage. He demands pigeons be banned. It's personal. It's between you and him."],
    },
    choices: [
      { label: { fr: 'Combattre', en: 'Fight' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: "Combat épique sur le toit. Il m'a griffé{|e}, je lui ai picoré le crâne. Je l'ai vaincu avec un pointeur laser. Il a couru après le point rouge jusqu'en prison.", en: "Epic rooftop fight. He clawed me, I pecked his skull. I beat him with a laser pointer. He chased the red dot all the way to jail." }, fx: { fame: 25, karma: 15, health: -5, schedule: { key: 'ch2_hero_retire', years: 10 }, visual: 'explosion' }, mood: 'proud' },
        { w: 1, text: { fr: "Il m'a plaqué{|e} au sol et assis dessus en ronronnant. Je me suis cassé le bras en m'enfuyant. La ville a dû appeler les pompiers. C'est humiliant pour un{|e} super-héros{|ïne}.", en: "He pinned me down and sat on me, purring. I broke my arm escaping. The city had to call the fire department. Humiliating for a superhero." }, fx: { health: -15, fame: -5, disease: 'broken_arm', schedule: { key: 'ch2_hero_retire', years: 10 } } },
      ] },
      { label: { fr: 'Discuter avec lui', en: 'Talk to him' }, text: { fr: "Je lui ai parlé. Il était juste seul. Sa femme est partie avec un vétérinaire. On a pris un café, il a pleuré, je l'ai pris dans mes ailes. C'est mon meilleur ami maintenant. On sauve la ville ensemble.", en: "I talked to him. He was just lonely. His wife left him for a vet. We got coffee, he cried, I held him in my wings. He's my best friend now. We save the city together." }, fx: { karma: 20, happy: 10, schedule: { key: 'ch2_hero_retire', years: 10 }, newNpc: { role: 'friend', age: [-5, 10], gender: 'm' } }, mood: 'love' },
      { label: { fr: 'Passer du côté obscur', en: 'Switch sides' }, text: { fr: "On s'est alliés. Pigeon et Chat, unis pour le mal. Notre premier crime : renverser toutes les poubelles de la ville. La presse parle du « duo le plus nul de l'histoire ».", en: "We teamed up. Pigeon and Cat, united in evil. Our first crime: knocking over every trash can in the city. The press calls us 'the lamest duo in history'." }, fx: { karma: -15, fame: 10, happy: 8, schedule: { key: 'ch2_hero_retire', years: 10 } } },
    ],
  },
  {
    id: 'ch2_hero_retire',
    icon: '🦴',
    cat: 'chaos',
    rating: 0,
    chainOnly: true,
    when: { flag: 'ch2_hero' },
    scene: { place: 'home', mood: 'sad', prop: 'cape' },
    text: {
      fr: ["Dix ans de super-héroïsme. Tes pouvoirs faiblissent : tu voles à 50 centimètres du sol, tes genoux craquent à chaque atterrissage et des ados t'ont filmé{|e} en train de rater un toit. 4 millions de vues.", "Ton costume ne ferme plus, ton dos fait un bruit de biscotte et les pigeons ne te respectent plus. Il est peut-être temps de raccrocher la cape."],
      en: ["Ten years of superheroics. Your powers are fading: you fly 18 inches off the ground, your knees crack on every landing and teens filmed you missing a rooftop. 4 million views.", "Your suit doesn't zip anymore, your back makes a cracker sound and the pigeons don't respect you. Maybe it's time to hang up the cape."],
    },
    choices: [
      { label: { fr: 'Écrire mes mémoires', en: 'Write my memoir' }, text: { fr: "J'ai publié « Des ailes et des miettes ». Best-seller. L'adaptation au cinéma est prévue, avec un acteur bien plus beau que moi dans le rôle.", en: "I published 'Wings and Crumbs'. Bestseller. A movie adaptation is in the works, with an actor much hotter than me in the lead." }, fx: { money: 150000, fame: 15, unflag: 'ch2_hero', visual: 'money' }, mood: 'proud' },
      { label: { fr: 'Former un successeur', en: 'Train a successor' }, text: { fr: "J'ai trouvé un gamin du quartier qui roucoulait bizarrement. Je l'ai entraîné. Il vole mieux que moi au bout d'une semaine. J'ai pleuré, de fierté et un peu de jalousie.", en: "I found a neighborhood kid who cooed funny. I trained him. Within a week he flew better than me. I cried, from pride and a little jealousy." }, fx: { karma: 15, happy: 10, unflag: 'ch2_hero' }, mood: 'love' },
      { label: { fr: 'Une dernière mission', en: 'One last mission' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: "Une dernière mission : j'ai sauvé un bus scolaire tombé d'un pont. Je l'ai retenu par le cou. J'ai pris ma retraite sous les applaudissements, avec une minerve.", en: "One last mission: I saved a school bus dangling off a bridge. Held it up with my neck. I retired to a standing ovation, wearing a neck brace." }, fx: { fame: 30, karma: 20, health: -10, unflag: 'ch2_hero', visual: 'confetti' }, mood: 'proud' },
        { w: 1, text: { fr: "Je me suis élancé{|e} du toit pour une dernière mission. Mes pouvoirs ont choisi ce moment précis pour disparaître complètement. Sept étages.", en: "I leapt off the roof for one last mission. My powers chose that exact moment to vanish completely. Seven floors." }, fx: { die: { fr: "en sautant d'un toit le jour où mes super-pouvoirs ont disparu", en: "jumping off a roof on the very day my superpowers ran out" } } },
      ] },
    ],
  },

  // ── Origine d'un super-vilain (3 étapes) ──
  {
    id: 'ch2_villain_1',
    icon: '🦹',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'office', mood: 'angry', prop: 'vat', fx: 'gore' },
    when: { age: [22, 65], job: true, noFlag: 'ch2_villain' },
    weight: 3,
    once: true,
    text: {
      fr: ["Septième refus d'augmentation. Ton collègue t'a volé ton agrafeuse ET ta promotion. En sortant, tu glisses dans une cuve de déchets chimiques derrière l'usine. Tu ressors vert{|e}, avec un rire qui fait peur même à toi.", "Humilié{|e} en réunion devant 40 personnes, tu claques la porte, trébuches et tombes dans une cuve de yaourt périmé radioactif. Ta peau brûle. Ta haine aussi. Tu ris. Fort. Trop fort."],
      en: ["Seventh raise denied. Your coworker stole your stapler AND your promotion. On the way out, you slip into a vat of chemical waste behind the plant. You come out green, with a laugh that scares even you.", "Humiliated in front of 40 people in a meeting, you storm out, trip and fall into a vat of radioactive expired yogurt. Your skin burns. So does your hatred. You laugh. Loudly. Too loudly."],
    },
    choices: [
      { label: { fr: 'Embrasser le mal', en: 'Embrace evil' }, text: { fr: "Je me suis regardé{|e} dans une flaque et j'ai dit : « Ils vont tous payer. » J'ai choisi un nom : {Docteur Rancœur|Lady Rancœur}. Ma peau verte me va bien au teint.", en: "I looked at myself in a puddle and said: 'They will all pay.' I picked a name: {Doctor Grudge|Lady Grudge}. Green suits my complexion." }, fx: { karma: -15, happy: 8, flag: 'ch2_villain', quitJob: true, schedule: { key: 'ch2_villain_2', years: 1 } }, mood: 'angry' },
      { label: { fr: 'Attaquer la boîte en justice', en: 'Sue the company' }, text: { fr: "J'ai porté plainte contre ma boîte pour exposition aux déchets toxiques. Ils ont payé pour que je me taise. Je suis riche et légèrement fluorescent{|e}.", en: "I sued my company for toxic waste exposure. They paid me to shut up. I'm rich and slightly fluorescent." }, fx: { money: 120000, looks: -10, quitJob: true, visual: 'money' } },
      { label: { fr: 'Aller chez le psy', en: 'See a therapist' }, text: { fr: "Ma psy m'a écouté{|e} rire maléfiquement pendant une heure. Elle a dit : « On sent beaucoup de colère. » 80 € la séance. Mon rire s'est calmé. Ma peau est toujours verte.", en: "My therapist listened to me cackle evilly for an hour. She said: 'I sense a lot of anger.' $90 a session. The laugh calmed down. My skin's still green." }, fx: { money: -800, stress: -15, looks: -6 } },
    ],
  },
  {
    id: 'ch2_villain_2',
    icon: '🏭',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'castle', mood: 'angry', prop: 'lair', fx: 'fire' },
    text: {
      fr: ["Ton repaire est prêt : un parking souterrain désaffecté, deux stagiaires non payés et une chèvre en guise de garde du corps. Il est temps de lancer ton premier plan diabolique.", "Tu as un repaire, une cape, un rire maléfique et des sbires (ton cousin Kévin et son pote). La ville ne se doute de rien. Quel sera ton premier coup ?"],
      en: ["Your lair is ready: an abandoned underground parking garage, two unpaid interns and a goat as a bodyguard. Time to launch your first evil plan.", "You have a lair, a cape, an evil laugh and henchmen (your cousin Kevin and his buddy). The city suspects nothing. What's your first move?"],
    },
    choices: [
      { label: { fr: 'Laxatifs dans l\'eau', en: 'Laxatives in the water' }, text: { fr: "J'ai versé 900 kilos de laxatifs dans le château d'eau. Toute la ville a passé le week-end aux toilettes. Les égouts ont débordé jusqu'à la mairie. Les journaux parlent de « Merdegate ».", en: "I dumped a ton of laxatives into the water tower. The whole city spent the weekend on the toilet. Sewers overflowed up to city hall. The papers call it 'Poopgate'." }, fx: { karma: -30, fame: 20, heat: 30, schedule: { key: 'ch2_villain_3', years: 2 }, visual: 'poop' }, mood: 'party' },
      { label: { fr: 'Kidnapper le maire', en: 'Kidnap the mayor' }, out: [
        { w: 1, text: { fr: "J'ai kidnappé le maire. Personne n'a payé la rançon. Personne n'a remarqué qu'il manquait. Je l'ai relâché au bout d'un mois, il m'a remercié{|e} pour les vacances.", en: "I kidnapped the mayor. Nobody paid the ransom. Nobody noticed he was gone. I released him after a month, he thanked me for the vacation." }, fx: { fame: 10, karma: -10, heat: 20, schedule: { key: 'ch2_villain_3', years: 2 } } },
        { w: 1, text: { fr: "La chèvre a mangé le plan, le maire s'est échappé et a appelé les flics depuis mon propre téléphone. Mes stagiaires ont témoigné contre moi. Ils étaient même pas payés, ces ingrats.", en: "The goat ate the plan, the mayor escaped and called the cops on my own phone. My interns testified against me. They weren't even paid, the ingrates." }, fx: { arrest: 'kidnap', heat: 40, unflag: 'ch2_villain', visual: 'police' } },
      ] },
      { label: { fr: 'Voler la Lune', en: 'Steal the Moon' }, text: { fr: "J'ai investi toutes mes économies dans un rayon rétrécisseur pour voler la Lune. Il rétrécit seulement les chaussettes. J'ai volé toutes les chaussettes de la ville. Mon repaire sent les pieds.", en: "I sank my savings into a shrink ray to steal the Moon. It only shrinks socks. I stole every sock in the city. My lair smells like feet." }, fx: { money: -20000, fame: 8, happy: -5, schedule: { key: 'ch2_villain_3', years: 2 } } },
    ],
  },
  {
    id: 'ch2_villain_3',
    icon: '🐟',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    when: { flag: 'ch2_villain' },
    scene: { place: 'castle', mood: 'shock', prop: 'piranhas', fx: 'gore' },
    text: {
      fr: ["Affrontement final. Ton ennemi juré, un super-héros en collant, est suspendu au-dessus de ta fosse à piranhas. Ton doigt est sur le bouton. Les caméras de BFM tournent. C'est ton moment.", "Tout ton plan converge vers cet instant : ton ennemi ligoté, la fosse aux piranhas, un rayon laser et un discours de douze pages que tu répètes depuis trois ans."],
      en: ["Final showdown. Your archenemy, a superhero in tights, dangles over your piranha pit. Your finger's on the button. The news cameras are rolling. This is your moment.", "Your whole plan leads here: your enemy tied up, the piranha pit, a laser beam and a twelve-page speech you've rehearsed for three years."],
    },
    choices: [
      { label: { fr: 'Faire mon monologue', en: 'Deliver my monologue' }, out: [
        { w: 1, text: { fr: "J'ai commencé mon monologue. Page 4, le héros s'était libéré. Page 6, il m'a poussé{|e} dans la fosse. Les piranhas m'ont nettoyé{|e} jusqu'à l'os en 40 secondes. Ils ont laissé mes lunettes.", en: "I began my monologue. By page 4, the hero had freed himself. By page 6, he pushed me into the pit. The piranhas stripped me to the bone in 40 seconds. They left my glasses." }, fx: { die: { fr: "dévoré{|e} par mes propres piranhas au milieu de mon monologue de méchant", en: "devoured by my own piranhas halfway through my villain monologue" }, visual: 'gore' } },
        { w: 1, text: { fr: "Mon monologue était si long que le héros s'est endormi. Je l'ai relâché par pitié. On est devenus amis. On se voit le dimanche pour se taper dessus, comme au bon vieux temps.", en: "My monologue was so long the hero fell asleep. I let him go out of pity. We became friends. We meet Sundays to beat each other up, like old times." }, fx: { happy: 10, karma: 10, unflag: 'ch2_villain' } },
      ] },
      { label: { fr: 'Appuyer sur le bouton', en: 'Push the button' }, text: { fr: "J'ai appuyé. Le héros est tombé dans la fosse. Les piranhas ont fait une bouillie rouge et des bouts de collant ont flotté pendant une heure. J'ai gagné. Je me sens vide. Et recherché{|e} dans 40 pays.", en: "I pushed it. The hero dropped into the pit. The piranhas made red soup and bits of spandex floated for an hour. I won. I feel empty. And wanted in 40 countries." }, fx: { karma: -40, fame: 30, heat: 50, unflag: 'ch2_villain', visual: 'gore' }, mood: 'shock' },
      { label: { fr: 'Vendre mon histoire', en: 'Sell my story' }, text: { fr: "J'ai tout arrêté et vendu les droits de ma vie à une plateforme de streaming. La série « Rancœur » cartonne. Les piranhas ont leur propre spin-off.", en: "I quit it all and sold my life rights to a streaming platform. The show 'Grudge' is a hit. The piranhas got their own spin-off." }, fx: { money: 300000, fame: 25, karma: 5, unflag: 'ch2_villain', visual: 'money' }, mood: 'proud' },
    ],
  },

  // ═════════════════════════════ OBJETS MAUDITS & PARANORMAL ═════════════════════════════

  // ── Poupée hantée (2 étapes) ──
  {
    id: 'ch2_doll',
    icon: '🪆',
    cat: 'weird',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'doll', fx: 'ghost' },
    when: { age: [16, 90], noFlag: 'ch2_doll' },
    weight: 4,
    once: true,
    text: {
      fr: ["Tu as acheté une poupée en porcelaine dans une brocante, 2 €. Elle s'appelle Mademoiselle Odile, selon l'étiquette écrite au sang. La nuit, elle change de pièce. Ce matin, elle était dans le frigo, à côté du couteau à pain.", "La vieille dame de la brocante t'a donné la poupée gratuitement, en courant. Depuis, la poupée cligne des yeux, fredonne des comptines en latin et le chat refuse d'entrer dans le salon."],
      en: ["You bought a porcelain doll at a flea market for $2. Her name is Miss Odile, according to the tag written in blood. At night she changes rooms. This morning she was in the fridge, next to the bread knife.", "The old lady at the flea market gave you the doll for free, while running away. Since then, the doll blinks, hums nursery rhymes in Latin and the cat won't enter the living room."],
    },
    choices: [
      { label: { fr: 'La garder', en: 'Keep her' }, text: { fr: "Je l'ai posée sur l'étagère. Elle est jolie, au fond. J'ai juste remarqué qu'elle a plus de dents qu'hier.", en: "I put her on the shelf. She's pretty, really. I just noticed she has more teeth than yesterday." }, fx: { stress: 8, flag: 'ch2_doll', schedule: { key: 'ch2_doll_2', years: 1 } } },
      { label: { fr: 'La brûler', en: 'Burn her' }, text: { fr: "Je l'ai jetée dans la cheminée. Elle a hurlé d'une voix d'homme de 50 ans. Le lendemain matin, elle était sur mon oreiller, un peu noircie, et elle souriait.", en: "I threw her in the fireplace. She screamed in the voice of a 50-year-old man. Next morning she was on my pillow, a bit charred, smiling." }, fx: { stress: 15, flag: 'ch2_doll', schedule: { key: 'ch2_doll_2', years: 1 }, visual: 'fire' }, mood: 'shock' },
      { label: { fr: 'L\'offrir à ma belle-mère', en: 'Gift her to my in-law' }, text: { fr: "J'ai offert la poupée à la personne que je déteste le plus dans ma famille. Depuis, elle ne dort plus et elle a vendu sa maison. Je dors comme un bébé.", en: "I gifted the doll to the relative I hate most. She no longer sleeps and has sold her house. I sleep like a baby." }, fx: { happy: 12, karma: -15 }, mood: 'happy' },
    ],
  },
  {
    id: 'ch2_doll_2',
    icon: '🔪',
    cat: 'weird',
    rating: 2,
    chainOnly: true,
    when: { flag: 'ch2_doll' },
    scene: { place: 'home', mood: 'shock', prop: 'doll', fx: 'gore' },
    text: {
      fr: ["Mademoiselle Odile a franchi un cap. Le poisson rouge a été retrouvé éventré sur la table, et le mot « REDRUM » est écrit au ketchup sur le miroir. Elle fait aussi des fautes d'orthographe : « REDRUME ».", "Tu te réveilles avec les cheveux coupés en carré, très mal, et la poupée assise au pied du lit avec les ciseaux. Ça ne peut plus durer."],
      en: ["Miss Odile has crossed a line. The goldfish was found gutted on the table, and 'REDRUM' is written in ketchup on the mirror. She also can't spell: 'REDRUMM'.", "You wake up with a badly chopped bob haircut and the doll sitting at the foot of the bed holding scissors. This can't go on."],
    },
    choices: [
      { label: { fr: 'Appeler un exorciste', en: 'Call an exorcist' }, out: [
        { w: 1, text: { fr: "Le père Gilles est arrivé avec son eau bénite. Odile lui a craché du vomi vert au visage et il est reparti en courant, sa soutane sur la tête. Facture : 400 €. Odile, elle, a l'air ravie.", en: "Father Giles showed up with holy water. Odile spewed green vomit in his face and he ran off with his cassock over his head. Bill: $400. Odile looks delighted." }, fx: { money: -400, stress: 10, visual: 'ghost' } },
        { w: 1, text: { fr: "L'exorciste a réussi. Le démon est sorti d'Odile dans un nuage puant et s'est enfui par la fenêtre. Il est entré dans le chien du voisin. Le chien est maintenant président du syndic.", en: "The exorcist succeeded. The demon left Odile in a stinking cloud and fled out the window. It entered the neighbor's dog. The dog now runs the HOA." }, fx: { stress: -15, karma: 5, unflag: 'ch2_doll' }, mood: 'happy' },
      ] },
      { label: { fr: 'Négocier', en: 'Negotiate' }, text: { fr: "J'ai demandé ce qu'elle voulait. Réponse écrite au rouge à lèvres : « UNE MAISON DE BARBIE ». Je lui en ai acheté une. Elle y vit, calme. Parfois, j'entends des cris dans la maison de Barbie. Je ne regarde pas.", en: "I asked what she wanted. Answer in lipstick: 'A BARBIE DREAMHOUSE'. I bought her one. She lives there, calm. Sometimes I hear screams from the Dreamhouse. I don't look." }, fx: { money: -150, stress: -8, unflag: 'ch2_doll' } },
      { label: { fr: 'La jeter à la mer', en: 'Throw her in the sea' }, text: { fr: "Je l'ai jetée du haut d'une falaise, lestée avec un parpaing. Trois jours plus tard, elle était assise dans ma baignoire, couverte d'algues, avec un crabe vivant dans l'orbite. Elle a gagné. On vit ensemble.", en: "I threw her off a cliff tied to a cinder block. Three days later she was sitting in my bathtub, covered in seaweed, with a live crab in her eye socket. She won. We live together." }, fx: { stress: 20, happy: -10, disease: 'insomnia', visual: 'ghost' }, mood: 'cry' },
    ],
  },

  // ── Jeu vidéo maudit ──
  {
    id: 'ch2_cursed_game',
    icon: '🎮',
    cat: 'weird',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock', prop: 'console', fx: 'gore' },
    when: { age: [12, 50] },
    weight: 4,
    once: true,
    text: {
      fr: ["Tu as trouvé une vieille cartouche dans une benne : « SUPER KILLER KART 64 ». Au démarrage, l'écran affiche ton prénom, ton adresse et : « CHAQUE VIE PERDUE SERA PAYÉE. » La manette est tiède. Elle respire.", "Le jeu téléchargé sur un site russe démarre tout seul à 3 h du matin. Ton avatar a ta tête. Le boss final aussi, mais avec des dents. Un message clignote : « JOUE OU MEURS (OU LES DEUX) »."],
      en: ["You found an old cartridge in a dumpster: 'SUPER KILLER KART 64'. On boot, the screen shows your first name, your address and: 'EVERY LIFE LOST WILL BE PAID FOR.' The controller is warm. It's breathing.", "The game you downloaded from a sketchy site starts by itself at 3am. Your avatar has your face. So does the final boss, but with teeth. A message flashes: 'PLAY OR DIE (OR BOTH)'."],
    },
    choices: [
      { label: { fr: 'Jouer jusqu\'au bout', en: 'Play to the end' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai joué 31 heures d'affilée. J'ai battu le boss final sans perdre une vie. Le jeu a affiché « BRAVO » et la console a craché 20 000 € en billets tièdes. Puis elle a fondu.", en: "I played 31 hours straight. Beat the final boss without losing a life. The game said 'WELL DONE' and the console spat out $20,000 in warm bills. Then it melted." }, fx: { money: 20000, smarts: 5, health: -6, visual: 'money' }, mood: 'proud' },
        { w: 1, text: { fr: "Game over au niveau 3. Un bruit sec : mon petit doigt est tombé sur le tapis, net, comme coupé au laser. Le jeu a affiché « CONTINUE ? 9… 8… ». J'ai débranché en hurlant.", en: "Game over on level 3. A sharp snap: my pinky dropped onto the rug, clean, like a laser cut. The game showed 'CONTINUE? 9… 8…'. I unplugged it screaming." }, fx: { health: -12, disease: 'missing_finger', stress: 15, visual: 'gore' }, mood: 'shock' },
      ] },
      { label: { fr: 'La vendre à un streamer', en: 'Sell it to a streamer' }, text: { fr: "J'ai vendu la cartouche à un streamer qui m'insultait dans son chat. Il a perdu en direct devant 40 000 personnes. Son oreille est tombée dans ses nouilles. Je me suis désabonné{|e}.", en: "I sold the cartridge to a streamer who used to trash me in his chat. He lost live in front of 40,000 viewers. His ear fell into his noodles. I unsubscribed." }, fx: { money: 800, karma: -15, happy: 8 } },
      { label: { fr: 'L\'écraser au marteau', en: 'Smash it with a hammer' }, text: { fr: "J'ai écrasé la cartouche au marteau. Du sang chaud a giclé partout, sur les murs, le plafond, le chat. Il y avait une petite dent dedans. Je n'ai pas d'explication.", en: "I smashed the cartridge with a hammer. Warm blood sprayed everywhere: walls, ceiling, cat. There was a tiny tooth inside. I have no explanation." }, fx: { stress: 10, karma: 5, visual: 'gore' } },
    ],
  },

  // ── Ouija ──
  {
    id: 'ch2_ouija',
    icon: '🔮',
    cat: 'weird',
    rating: 1,
    scene: { place: 'party', mood: 'shock', prop: 'ouija', fx: 'ghost' },
    when: { age: [12, 70] },
    weight: 5,
    cooldown: 10,
    text: {
      fr: ["Soirée Ouija, bougies, ambiance. La goutte bouge toute seule et épelle : « J-E S-U-I-S T-O-N A-R-R-I-È-R-E G-R-A-N-D-P-È-R-E ». Puis : « T-E-S C-H-E-V-E-U-X S-O-N-T N-U-L-S ».", "Le verre glisse sur la planche Ouija. L'esprit dit s'appeler Gérald, mort en 1987, et qu'il « s'ennuie à crever, sans jeu de mots ». Tout le monde te regarde. C'est toi qui poses la question."],
      en: ["Ouija night, candles, vibes. The planchette moves by itself and spells: 'I-A-M Y-O-U-R G-R-E-A-T G-R-A-N-D-P-A'. Then: 'Y-O-U-R H-A-I-R S-U-C-K-S'.", "The glass slides across the Ouija board. The spirit says it's Gerald, died 1987, and he's 'bored to death, no pun intended'. Everyone's looking at you. You ask the question."],
    },
    choices: [
      { label: { fr: 'Demander pour l\'amour', en: 'Ask about love' }, text: { fr: "J'ai demandé si j'allais trouver l'amour. Le verre a répondu « L-O-L ». Puis il s'est brisé. Tout le monde a ri. Sauf moi.", en: "I asked if I'll find love. The glass answered 'L-O-L'. Then it shattered. Everyone laughed. Except me." }, fx: { happy: -6, fame: 2 } },
      { label: { fr: 'Demander ma date de mort', en: 'Ask when I\'ll die' }, text: { fr: "J'ai demandé quand j'allais mourir. Le verre a tourné en rond pendant dix minutes, puis il a écrit « Ç-A D-É-P-E-N-D D-E T-O-I ». Les esprits font du développement personnel, maintenant.", en: "I asked when I'll die. The glass spun in circles for ten minutes, then wrote 'D-E-P-E-N-D-S O-N Y-O-U'. Spirits do self-help now." }, fx: { stress: 6, smarts: 2 } },
      { label: { fr: 'Insulter l\'esprit', en: 'Insult the spirit' }, text: { fr: "J'ai traité l'esprit de « gros nul mort ». Depuis, mes lumières clignotent, ma télé s'allume sur des téléfilms allemands et quelqu'un mange mes yaourts la nuit.", en: "I called the spirit a 'dead loser'. Since then my lights flicker, my TV turns on to German TV movies and someone eats my yogurt at night." }, fx: { stress: 12, happy: -4, visual: 'ghost' }, mood: 'shock' },
      { label: { fr: 'Demander le loto', en: 'Ask for lottery numbers' }, text: { fr: "L'esprit m'a donné six numéros. J'ai joué. J'ai gagné 12 €. L'esprit a écrit « D-E R-I-E-N ». Radin, même mort.", en: "The spirit gave me six numbers. I played them. I won $12. The spirit wrote 'Y-W'. Stingy, even dead." }, fx: { money: 12, happy: 3 } },
    ],
  },

  // ═════════════════════════════ CRYPTIDES & EXPÉDITIONS ═════════════════════════════

  // ── Bigfoot 2 : le colocataire ──
  {
    id: 'ch2_bigfoot2',
    icon: '🦍',
    cat: 'weird',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock', prop: 'bigfoot' },
    when: { age: [18, 70] },
    weight: 3,
    once: true,
    text: {
      fr: ["Ton nouveau colocataire, trouvé sur un site d'annonces, fait 2,40 m, ne parle pas, et laisse des poils plein le siphon de la douche. Il s'appelle Bertrand. C'est Bigfoot. Il n'a jamais payé le loyer.", "Ça fait trois mois que Bigfoot vit chez toi. Il a mangé tous tes Kinder, il ronfle comme un camion et il regarde « Koh-Lanta » en pleurant. Il pue le chien mouillé dans un sauna."],
      en: ["Your new roommate from a classifieds site is 8 feet tall, doesn't talk, and clogs the shower drain with hair. His name is Bertrand. He's Bigfoot. He's never paid rent.", "Bigfoot has lived with you for three months. He ate all your chocolate, snores like a truck and watches 'Survivor' crying. He smells like a wet dog in a sauna."],
    },
    choices: [
      { label: { fr: 'Le mettre dehors', en: 'Kick him out' }, text: { fr: "J'ai mis ses affaires dans le couloir : une pomme de pin et un slip XXXXXL. Il est parti en claquant la porte, et le mur avec. La caution est perdue.", en: "I put his stuff in the hallway: a pine cone and a XXXXXL pair of briefs. He left slamming the door, and the wall with it. Goodbye security deposit." }, fx: { money: -2000, happy: 4, stress: -6 } },
      { label: { fr: 'Le rendre célèbre', en: 'Make him famous' }, text: { fr: "J'ai lancé son compte TikTok : Bigfoot fait des recettes vegan. 3 millions d'abonnés en un mois. Il refuse de partager les revenus. On s'est battus. J'ai perdu une touffe de cheveux, lui aussi.", en: "I launched his TikTok: Bigfoot cooks vegan recipes. 3 million followers in a month. He won't share the revenue. We fought. I lost a clump of hair, so did he." }, fx: { followers: 300000, fame: 15, money: 15000, health: -5 }, mood: 'proud' },
      { label: { fr: 'Vendre ses poils', en: 'Sell his hair' }, text: { fr: "J'ai ramassé ses poils dans la douche et je les ai vendus comme « authentiques poils de Bigfoot certifiés ». Ils étaient authentiques. Personne ne me croit, mais tout le monde achète.", en: "I collected his hair from the shower and sold it as 'certified authentic Bigfoot hair'. It was authentic. Nobody believes me, but everyone buys." }, fx: { money: 6000, karma: -3, visual: 'money' } },
      { label: { fr: 'Une nuit un peu bizarre', en: 'One weird night' }, text: { fr: "Un soir, après six bières et un film triste, on s'est regardés longtemps. Je ne dirai rien de plus. Sauf que j'ai retrouvé des poils jusque dans mes oreilles pendant six mois et qu'il m'appelle « mon petit humain ».", en: "One night, after six beers and a sad movie, we looked at each other for a long time. I'll say no more. Except I found hair in my ears for six months and he calls me 'my little human'." }, fx: { happy: 10, karma: -2, fame: 5 }, mood: 'love' },
    ],
  },

  // ── Monstre du Loch Ness ──
  {
    id: 'ch2_nessie',
    icon: '🦕',
    cat: 'weird',
    rating: 0,
    scene: { place: 'beach', mood: 'shock', prop: 'lake' },
    when: { age: [6, 90] },
    weight: 3,
    once: true,
    text: {
      fr: [
        "Vacances en Écosse. Sur le Loch Ness, un long cou vert émerge de l'eau, te regarde, rote bruyamment… et pique ton sandwich au thon. Tu as ton téléphone à la main.",
        "Pendant ta balade en barque, quelque chose d'énorme passe sous toi. Une tête de dinosaure sort de l'eau, à deux mètres. Elle porte un bonnet de bain. Elle a l'air gênée.",
        "Au bord du Loch Ness, {w:weather}, une énorme créature verte sort la tête de l'eau et avale {w:object} qui flottait là. Puis elle te regarde, comme pour demander s'il y en a d'autres.",
        "Excursion au Loch Ness avec un guide qui croit {w:conspiracy}. Il parle depuis [[deux|trois|quatre]] heures quand un long cou surgit derrière lui. Il ne voit rien. Toi, tu vois tout. Nessie te fait un clin d'œil.",
        "Nessie est là, à trois mètres de ta barque, en train de mâchouiller {w:food} piqué à un touriste. Elle émet {w:sound}. Ton téléphone est chargé à [[4|11|2]] %. C'est maintenant ou jamais.",
      ],
      en: [
        "Vacation in Scotland. On Loch Ness, a long green neck rises from the water, stares at you, burps loudly… and steals your tuna sandwich. Your phone is in your hand.",
        "During your rowboat trip, something huge passes underneath. A dinosaur head pops out of the water, six feet away. It's wearing a swim cap. It looks embarrassed.",
        "On the shore of Loch Ness, {w:weather}, a huge green creature lifts its head out of the water and swallows {w:object} that was floating by. Then it looks at you, as if asking whether there's more.",
        "Loch Ness tour with a guide who believes {w:conspiracy}. He's been talking for [[two|three|four]] hours when a long neck rises behind him. He sees nothing. You see everything. Nessie winks at you.",
        "Nessie is right there, ten feet from your boat, chewing on {w:food} stolen from a tourist. She makes {w:sound}. Your phone is at [[4|11|2]]% battery. It's now or never.",
      ],
    },
    choices: [
      { label: { fr: 'Prendre une photo', en: 'Take a photo' }, text: { fr: ["J'ai pris la photo. Elle est floue. Évidemment. Une tache verte dans de l'eau grise, comme toutes les photos de Nessie depuis 1934. Mais moi, je sais.", "J'ai pris la photo. Nette, parfaite, en haute définition. Je l'ai postée sur {w:app}. Tout le monde a dit que c'était de l'IA. J'ai 3 likes, dont ma mère."], en: ["I took the photo. It's blurry. Of course. A green smudge in grey water, like every Nessie photo since 1934. But I know.", "I took the photo. Sharp, perfect, high-definition. I posted it on {w:app}. Everyone said it was AI. I got 3 likes, one from my mom."] }, fx: { happy: 8, fame: 2 } },
      { label: { fr: 'Lui offrir du haggis', en: 'Offer her haggis' }, text: { fr: ["Je lui ai donné du haggis. Elle a recraché le haggis. Même un monstre légendaire a ses limites. Mais elle m'a laissé lui caresser le nez.", "Je lui ai tendu du haggis. Elle a reniflé, a fait une tête de dégoût millénaire et a préféré mon sac à dos. Je lui ai laissé. Il contenait mon passeport. Je vis en Écosse maintenant."], en: ["I gave her some haggis. She spat it out. Even a legendary monster has limits. But she let me pet her nose.", "I held out some haggis. She sniffed it, made a face of ancient disgust and chose my backpack instead. I let her have it. My passport was in it. I live in Scotland now."] }, fx: { happy: 12, karma: 4 }, mood: 'love' },
      { label: { fr: 'Monter sur son dos', en: 'Ride her' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai sauté sur son dos et elle m'a fait faire le tour du lac. Des touristes japonais ont filmé. La vidéo a 30 millions de vues. Tout le monde dit que c'est un montage.", "Je suis monté{|e} sur son dos et on a fait [[trois|dix|vingt]] tours du lac à toute vitesse. J'ai crié comme sur un manège. Elle aussi. Depuis, elle m'envoie des cartes postales."], en: ["I jumped on her back and she took me around the loch. Japanese tourists filmed it. The video has 30 million views. Everyone says it's fake.", "I climbed on her back and we did [[three|ten|twenty]] laps of the loch at full speed. I screamed like on a roller coaster. So did she. She's been sending me postcards ever since."] }, fx: { happy: 15, fame: 10, followers: 100000 }, mood: 'party' },
        { w: 1, text: { fr: ["Elle a plongé. Moi aussi, malgré moi. J'ai bu la moitié du Loch Ness. Ressorti{|e} trempé{|e}, avec une anguille dans le pantalon.", "Elle a fait un saut périlleux et m'a éjecté{|e} à vingt mètres. J'ai atterri dans la barque d'un pêcheur, qui m'a regardé{|e}, a soupiré et a dit : « Encore un. »"], en: ["She dove. So did I, involuntarily. I swallowed half of Loch Ness. Came out soaked, with an eel in my pants.", "She did a backflip and launched me sixty feet. I landed in a fisherman's boat. He looked at me, sighed and said: 'Another one.'"] }, fx: { health: -6, happy: 4, disease: 'cold' } },
      ] },
    ],
  },

  // ── Raid sur la Zone 51 (2 étapes) ──
  {
    id: 'ch2_area51',
    icon: '🏃',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'park', mood: 'party', prop: 'fence', fx: 'police' },
    when: { age: [18, 55] },
    weight: 3,
    once: true,
    text: {
      fr: ["L'événement Facebook « Raid sur la Zone 51 : ils peuvent pas tous nous arrêter » avait 2 millions d'inscrits. Vous êtes 47 devant le grillage, dont toi, un type en costume de Pikachu et une mamie avec une glacière.", "Désert du Nevada, 4 h du matin. Une foule de geeks en sueur s'apprête à charger la base secrète. Quelqu'un crie « POUR LES ALIENS ! ». Les militaires bâillent derrière le grillage."],
      en: ["The Facebook event 'Storm Area 51: They Can't Stop All of Us' had 2 million RSVPs. There are 47 of you at the fence, including you, a guy in a Pikachu suit and a grandma with a cooler.", "Nevada desert, 4am. A crowd of sweaty nerds is about to charge the secret base. Someone yells 'FOR THE ALIENS!'. Soldiers yawn behind the fence."],
    },
    choices: [
      { label: { fr: 'Course de Naruto', en: 'Naruto run' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai couru bras en arrière, comme Naruto. Les balles me frôlaient, mais l'aérodynamisme a fonctionné. Je suis à l'intérieur.", en: "I ran arms back, like Naruto. Bullets whizzed by, but the aerodynamics worked. I'm inside." }, fx: { athletic: 6, flag: 'ch2_area51', chain: 'ch2_area51_2' }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai couru bras en arrière, comme Naruto. Je me suis pris un taser dans la fesse gauche et je me suis fait dessus devant 46 personnes. On m'a mis{|e} en cellule pour la nuit.", en: "I ran arms back, like Naruto. Took a taser to the left butt cheek and soiled myself in front of 46 people. They locked me up for the night." }, fx: { health: -8, happy: -10, heat: 15, visual: 'poop' }, mood: 'cry' },
      ] },
      { label: { fr: 'Passer par la ventilation', en: 'Sneak through the vents' }, text: { fr: "J'ai trouvé un conduit de ventilation. J'ai rampé deux heures dans la poussière et les crottes de rat. Je suis tombé{|e} par le plafond, au beau milieu d'un labo.", en: "I found an air vent. I crawled for two hours through dust and rat droppings. I fell through the ceiling right into a lab." }, fx: { health: -4, smarts: 3, flag: 'ch2_area51', chain: 'ch2_area51_2' } },
      { label: { fr: 'Rester à la buvette', en: 'Stay at the tailgate' }, text: { fr: "J'ai passé la nuit à la buvette improvisée avec la mamie et sa glacière. Bières, chips, fusées de détresse. Meilleure soirée de ma vie, et aucun casier judiciaire.", en: "I spent the night at the makeshift tailgate with grandma and her cooler. Beer, chips, flares. Best night of my life, and no criminal record." }, fx: { happy: 12, addiction: ['alcohol', 4] }, mood: 'party' },
    ],
  },
  {
    id: 'ch2_area51_2',
    icon: '👽',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'hospital', mood: 'shock', prop: 'alien_jar', fx: 'ghost' },
    text: {
      fr: ["Tu es dans la Zone 51. Devant toi : un petit alien gris dans un bocal, qui tape contre la vitre en articulant « AIDE-MOI ». Sur une étagère, une soucoupe en kit. Dans un frigo, une gelée verte étiquetée « NE PAS MANGER ».", "Les sirènes hurlent. Tu as trente secondes. Un extraterrestre te fait des signes depuis un aquarium, un pistolet laser traîne sur une table et une boîte de gelée verte brille dans le noir."],
      en: ["You're inside Area 51. In front of you: a small grey alien in a jar, tapping the glass and mouthing 'HELP ME'. On a shelf, a flying saucer flat-pack kit. In a fridge, a glowing green jelly labeled 'DO NOT EAT'.", "Sirens are wailing. You have thirty seconds. An alien waves at you from a fish tank, a laser gun sits on a table and a tub of green jelly glows in the dark."],
    },
    choices: [
      { label: { fr: 'Libérer l\'alien', en: 'Free the alien' }, text: { fr: "J'ai cassé le bocal. L'alien m'a sauté dans les bras et on s'est enfuis ensemble. Il vit chez moi. Il s'appelle Bloup. Il mange les piles et regarde les infos en riant.", en: "I smashed the jar. The alien leapt into my arms and we escaped together. He lives with me now. His name is Bloop. He eats batteries and laughs at the news." }, fx: { happy: 15, karma: 15, heat: 20, unflag: 'ch2_area51', flag: 'ch2_alien_pet', newNpc: { role: 'pet', species: 'alien', age: [1, 3], abs: true } }, mood: 'love' },
      { label: { fr: 'Voler le pistolet laser', en: 'Steal the laser gun' }, text: { fr: "J'ai piqué le pistolet laser et je l'ai revendu à un milliardaire excentrique. Il s'en sert pour allumer ses cigares. J'ai acheté une maison.", en: "I nabbed the laser gun and sold it to an eccentric billionaire. He uses it to light his cigars. I bought a house." }, fx: { money: 400000, karma: -10, heat: 30, unflag: 'ch2_area51', visual: 'money' } },
      { label: { fr: 'Manger la gelée verte', en: 'Eat the green jelly' }, text: { fr: "J'ai mangé la gelée verte. Goût citron-pied. J'ai vomi un arc-en-ciel fluo pendant dix minutes sur un général. Depuis, je comprends le langage des dauphins et j'ai un QI de 160.", en: "I ate the green jelly. Lemon-feet flavor. I projectile-vomited a glowing rainbow onto a general for ten minutes. Since then I understand dolphin and have a 160 IQ." }, fx: { smarts: 20, health: -10, unflag: 'ch2_area51', visual: 'gore' }, mood: 'sick' },
      { label: { fr: 'Me faire choper', en: 'Get caught' }, text: { fr: "Je me suis fait plaquer par six militaires. Interrogatoire de 14 heures, puis prison. On m'a fait signer un papier disant que je n'avais rien vu. J'avais tout vu.", en: "Six soldiers tackled me. A 14-hour interrogation, then prison. They made me sign a paper saying I saw nothing. I saw everything." }, fx: { jail: 2, unflag: 'ch2_area51', visual: 'police' }, mood: 'sad' },
    ],
  },

  // ── Kidnappé{|e} par des pirates ──
  {
    id: 'ch2_pirates',
    icon: '🏴‍☠️',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'beach', mood: 'shock', prop: 'pirate_ship', fx: 'explosion' },
    when: { age: [18, 80] },
    weight: 3,
    once: true,
    text: {
      fr: ["Ta croisière tout compris a été abordée par des pirates. Des vrais : jet-skis, AK-47, un perroquet qui a un compte TikTok. Le capitaine, Barbe-Grise, cherche « quelqu'un d'utile ». Il te pointe du doigt.", "Coup de canon. Des pirates montent à bord de ton ferry pour la Corse. Leur chef a une jambe de bois imprimée en 3D et exige « tout l'argent et le buffet à volonté »."],
      en: ["Your all-inclusive cruise has been boarded by pirates. Real ones: jet skis, AKs, a parrot with a TikTok account. The captain, Greybeard, is looking for 'someone useful'. He points at you.", "Cannon fire. Pirates board your ferry. Their leader has a 3D-printed peg leg and demands 'all the money and the all-you-can-eat buffet'."],
    },
    choices: [
      { label: { fr: 'Rejoindre l\'équipage', en: 'Join the crew' }, text: { fr: "J'ai demandé à rejoindre l'équipage. Six mois de piraterie. J'ai un bandeau sur l'œil (je vois très bien), un tatouage de sirène et une part du butin. Ma mère ne sait pas.", en: "I asked to join the crew. Six months of piracy. I have an eyepatch (I see fine), a mermaid tattoo and a share of the loot. My mom doesn't know." }, fx: { money: 70000, karma: -15, athletic: 6, heat: 20, visual: 'money' }, mood: 'party' },
      { label: { fr: 'Me battre', en: 'Fight back' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai attrapé une fourchette du buffet et j'ai crevé l'œil d'un pirate. Ça a giclé sur le plateau de fromages. Les autres ont fui. Les passagers m'ont porté{|e} en triomphe.", en: "I grabbed a buffet fork and stabbed a pirate in the eye. It squirted all over the cheese platter. The rest fled. The passengers carried me in triumph." }, fx: { fame: 15, karma: 5, visual: 'gore' }, mood: 'proud' },
        { w: 1, text: { fr: "Un pirate m'a mis un coup de crosse et je me suis réveillé{|e} attaché{|e} au mât, sans mon portefeuille, sans mes chaussures, avec le perroquet qui me picorait l'oreille.", en: "A pirate hit me with a rifle butt and I woke up tied to the mast, no wallet, no shoes, with the parrot pecking my ear." }, fx: { health: -15, money: -3000, disease: 'concussion' } },
      ] },
      { label: { fr: 'Payer la rançon', en: 'Pay the ransom' }, text: { fr: "J'ai payé ma rançon par virement. Le capitaine m'a rendu ma liberté et laissé un avis 5 étoiles « otage très coopératif ». Je l'ai mis sur mon CV.", en: "I paid my ransom by bank transfer. The captain freed me and left a 5-star review: 'very cooperative hostage'. I put it on my résumé." }, fx: { money: -15000, stress: -5 } },
      { label: { fr: 'Séduire le capitaine', en: 'Seduce the captain' }, text: { fr: "J'ai fait du charme au capitaine Barbe-Grise. Trois rhums plus tard, on partageait sa cabine. Il ronfle comme un canon et sent la morue, mais j'ai été libéré{|e} avec un coffre de doublons en souvenir.", en: "I flirted with Captain Greybeard. Three rums later, we were sharing his cabin. He snores like a cannon and smells like salt cod, but I was released with a chest of doubloons as a keepsake." }, fx: { money: 25000, happy: 8, karma: -3 }, mood: 'love' },
    ],
  },

  // ── Naufragé{|e} sur une île déserte (3 étapes) ──
  {
    id: 'ch2_island',
    icon: '🏝️',
    cat: 'chaos',
    rating: 0,
    scene: { place: 'beach', mood: 'shock', prop: 'wreck' },
    when: { age: [16, 80], noFlag: 'ch2_island' },
    weight: 2,
    once: true,
    text: {
      fr: ["Ton avion s'est abîmé en mer. Tu te réveilles sur une plage blanche, seul{|e}, avec trois colis échoués et un ballon de volley. Pas de réseau. Une noix de coco te tombe sur la tête. Bienvenue.", "Tu ouvres les yeux sur une île déserte. Le pilote a disparu, ta valise aussi. Il te reste un ballon de volley, un coupe-ongles et une tablette de chocolat fondue."],
      en: ["Your plane went down at sea. You wake up on a white beach, alone, with three washed-up packages and a volleyball. No signal. A coconut falls on your head. Welcome.", "You open your eyes on a desert island. The pilot's gone, so is your suitcase. You have a volleyball, a nail clipper and a melted chocolate bar."],
    },
    choices: [
      { label: { fr: 'Construire une cabane', en: 'Build a hut' }, text: { fr: "J'ai construit une cabane en palmes. Elle s'est effondrée trois fois. La quatrième, elle a tenu. J'ai pleuré de fierté devant un crabe.", en: "I built a palm hut. It collapsed three times. The fourth time, it held. I cried with pride in front of a crab." }, fx: { discipline: 8, athletic: 5, flag: 'ch2_island', schedule: { key: 'ch2_island_2', years: 1 } } },
      { label: { fr: 'Ouvrir les colis', en: 'Open the packages' }, text: { fr: "Dans les colis : des patins à glace, une robe de mariée et des papiers de divorce. J'ai utilisé les patins comme couteaux et la robe comme filet de pêche.", en: "In the packages: ice skates, a wedding dress and divorce papers. I used the skates as knives and the dress as a fishing net." }, fx: { smarts: 6, flag: 'ch2_island', schedule: { key: 'ch2_island_2', years: 1 } } },
      { label: { fr: 'Nager vers le large', en: 'Swim for it' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai nagé huit heures. Un pêcheur m'a repêché{|e} à moitié mort{|e}. Mon aventure a duré une journée. Je raconte quand même que c'était « des semaines ».", en: "I swam for eight hours. A fisherman pulled me out half dead. My adventure lasted one day. I still tell people it was 'weeks'." }, fx: { athletic: 8, health: -10 } },
        { w: 2, text: { fr: "J'ai nagé une heure, j'ai vu un aileron et j'ai fait demi-tour en hurlant. C'était un dauphin. Retour à la case plage.", en: "I swam for an hour, saw a fin and turned back screaming. It was a dolphin. Back to the beach." }, fx: { athletic: 4, stress: 8, flag: 'ch2_island', schedule: { key: 'ch2_island_2', years: 1 } } },
      ] },
    ],
  },
  {
    id: 'ch2_island_2',
    icon: '🏐',
    cat: 'chaos',
    rating: 0,
    chainOnly: true,
    when: { flag: 'ch2_island' },
    scene: { place: 'beach', mood: 'sad', prop: 'volleyball' },
    text: {
      fr: ["Un an sur l'île. Tu as une barbe de naufragé{|e} (même si tu n'en avais jamais eu), tu fais du feu en trois secondes et ton meilleur ami est le ballon de volley, sur lequel tu as dessiné un visage. Il s'appelle Jean-Ballon.", "Douze mois de noix de coco. Jean-Ballon, ton ballon de volley, est devenu ton confident. Vous vous disputez souvent. Il a toujours raison. Au loin, tu crois voir passer un bateau."],
      en: ["One year on the island. You have castaway hair everywhere, can light a fire in three seconds, and your best friend is the volleyball you drew a face on. His name is Ballson.", "Twelve months of coconuts. Ballson, your volleyball, has become your confidant. You argue a lot. He's always right. In the distance, you think you see a ship."],
    },
    choices: [
      { label: { fr: 'Construire un radeau', en: 'Build a raft' }, text: { fr: "J'ai construit un radeau et je suis parti{|e} avec Jean-Ballon. Une vague l'a emporté. J'ai hurlé « JEAN-BALLOOOON » pendant une heure. Puis un cargo m'a repêché{|e}.", en: "I built a raft and set off with Ballson. A wave carried him away. I screamed 'BALLSOOOON' for an hour. Then a cargo ship picked me up." }, fx: { happy: -10, athletic: 6, chain: 'ch2_island_3' }, mood: 'cry' },
      { label: { fr: 'Rester pour toujours', en: 'Stay forever' }, text: { fr: "J'ai décidé de rester. Je suis {le roi|la reine} des crabes. J'ai un trône en coquillages. Trois ans plus tard, des touristes en kayak m'ont trouvé{|e}. J'ai fait semblant d'être un{|e} autochtone, puis j'ai craqué.", en: "I decided to stay. I'm the crab {king|queen}. I have a seashell throne. Three years later, kayaking tourists found me. I pretended to be a local, then cracked." }, fx: { happy: 10, stress: -15, chain: 'ch2_island_3' } },
      { label: { fr: 'Faire un énorme SOS', en: 'Make a huge SOS' }, text: { fr: "J'ai écrit SOS avec 4 000 noix de coco. Un avion est passé et a fait coucou. Puis un hélicoptère est arrivé. Le pilote voulait juste une photo de l'œuvre.", en: "I spelled SOS with 4,000 coconuts. A plane flew over and waved. Then a helicopter came. The pilot just wanted a photo of the artwork." }, fx: { smarts: 4, discipline: 5, chain: 'ch2_island_3' } },
    ],
  },
  {
    id: 'ch2_island_3',
    icon: '🚢',
    cat: 'chaos',
    rating: 0,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock', prop: 'cake', fx: 'confetti' },
    text: {
      fr: ["Tu es de retour. Ta famille a déjà fait ton enterrement (il y avait un buffet), ton appartement est loué à un couple d'Allemands et ton téléphone a 4 812 notifications. Les journalistes font la queue devant chez toi.", "Retour à la civilisation. Les gens ont l'air bizarres, tout est trop bruyant, et tu sursautes chaque fois que quelqu'un ouvre une noix de coco. On te propose un contrat d'édition."],
      en: ["You're back. Your family already held your funeral (there was a buffet), your apartment is rented to a German couple and your phone has 4,812 notifications. Reporters are lining up outside.", "Back to civilization. People look weird, everything's too loud, and you flinch every time someone opens a coconut. A publisher offers you a book deal."],
    },
    choices: [
      { label: { fr: 'Écrire un livre', en: 'Write a book' }, text: { fr: "J'ai écrit « Moi, Jean-Ballon et les crabes ». Best-seller. Une marque de ballons m'a sponsorisé{|e}. Je ne peux plus voir un ballon de volley sans pleurer.", en: "I wrote 'Me, Ballson and the Crabs'. Bestseller. A sports brand sponsored me. I can't see a volleyball without crying." }, fx: { money: 90000, fame: 20, unflag: 'ch2_island', visual: 'money' }, mood: 'proud' },
      { label: { fr: 'Attaquer la compagnie', en: 'Sue the airline' }, text: { fr: "J'ai attaqué la compagnie aérienne. Ils m'ont dédommagé{|e} et offert un bon de réduction de 15 % sur mon prochain vol. Je ne prendrai plus jamais l'avion.", en: "I sued the airline. They compensated me and gave me a 15% off voucher for my next flight. I'll never fly again." }, fx: { money: 200000, stress: 5, unflag: 'ch2_island', visual: 'money' } },
      { label: { fr: 'Retourner sur l\'île', en: 'Go back to the island' }, text: { fr: "Au bout d'une semaine, la civilisation m'a épuisé{|e}. Je suis retourné{|e} sur l'île en vacances. Les crabes m'ont reconnu{|e}. Jean-Ballon s'était échoué sur la plage. On s'est retrouvés.", en: "After a week, civilization exhausted me. I went back to the island on vacation. The crabs recognized me. Ballson had washed up on the beach. We were reunited." }, fx: { happy: 15, stress: -10, unflag: 'ch2_island' }, mood: 'love' },
    ],
  },

  // ── Triangle des Bermudes (légendaire) ──
  {
    id: 'ch2_bermuda',
    icon: '🧭',
    cat: 'chaos',
    rating: 0,
    scene: { place: 'beach', mood: 'shock', prop: 'fog', fx: 'ghost' },
    when: { age: [16, 90] },
    weight: 1,
    once: true,
    text: {
      fr: ["En plein Triangle des Bermudes, ta boussole tourne comme une toupie et ton bateau entre dans un brouillard violet. Quand il se lève : une île faite de toutes les choses perdues du monde. Des millions de chaussettes orphelines. Des télécommandes. Et des gens qui jouent aux cartes.", "Ton bateau de croisière disparaît des radars. Tu te retrouves dans une baie brumeuse où flottent des avions des années 40, toutes les clés de voiture jamais égarées et un équipage qui te propose une belote."],
      en: ["In the middle of the Bermuda Triangle, your compass spins like a top and your boat drifts into a purple fog. When it lifts: an island made of every lost thing in the world. Millions of orphan socks. TV remotes. And people playing cards.", "Your cruise ship vanishes from radar. You find yourself in a misty bay full of floating 1940s planes, every car key ever misplaced and a crew inviting you to a card game."],
    },
    choices: [
      { label: { fr: 'Récupérer mes chaussettes', en: 'Get my socks back' }, text: { fr: "J'ai retrouvé toutes mes chaussettes perdues depuis l'enfance. 214 au total. Et ma tétine. Et le doudou que ma mère jurait avoir « donné à un enfant pauvre ». Menteuse.", en: "I found every sock I've lost since childhood. 214 total. And my pacifier. And the stuffed animal my mom swore she 'gave to a poor child'. Liar." }, fx: { happy: 12, smarts: 2 }, mood: 'happy' },
      { label: { fr: 'Jouer aux cartes', en: 'Play cards' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai joué à la belote avec une aviatrice disparue en 1937 et un équipage de 1945. J'ai gagné un lingot d'or espagnol. Ils trichaient tous, mais moi aussi.", en: "I played cards with an aviator who vanished in 1937 and a crew from 1945. I won a Spanish gold ingot. They were all cheating, but so was I." }, fx: { money: 60000, happy: 10, visual: 'money' }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai perdu à la belote. Le prix à payer : rester. Ils m'ont donné un hamac et une chaussette. Depuis, je fais partie des choses perdues.", en: "I lost at cards. The price: stay forever. They gave me a hammock and a sock. I'm one of the lost things now." }, fx: { die: { fr: "disparu{|e} à jamais dans le Triangle des Bermudes, après une partie de belote perdue", en: "lost forever in the Bermuda Triangle after losing a card game" }, visual: 'ghost' } },
      ] },
      { label: { fr: 'Ramener une célébrité', en: 'Bring back a celebrity' }, text: { fr: "J'ai ramené une aviatrice disparue depuis 90 ans. Elle n'a pas pris une ride. Les historiens sont en PLS. On fait la tournée des plateaux télé ensemble.", en: "I brought back an aviator missing for 90 years. She hasn't aged a day. Historians are losing their minds. We're touring talk shows together." }, fx: { fame: 40, karma: 15, visual: 'confetti' }, mood: 'proud' },
    ],
  },

  // ═════════════════════════════ PHÉNOMÈNES ABSURDES ═════════════════════════════

  // ── Épidémie de danse ──
  {
    id: 'ch2_dance_plague',
    icon: '💃',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'park', mood: 'party', prop: 'crowd', fx: 'gore' },
    when: { age: [12, 85] },
    weight: 4,
    once: true,
    text: {
      fr: ["Comme à Strasbourg en 1518, toute la ville s'est mise à danser sans pouvoir s'arrêter. Jour 4 : tes pieds saignent, ta voisine a déboîté sa hanche en pleine macarena et un type a dansé jusqu'à ce que son cœur explose. Tu ne peux pas t'arrêter.", "Une épidémie de danse frappe {city}. Les gens twerkent dans les rues depuis trois jours, en pleurant. Le maire fait du moonwalk en conférence de presse. Tes jambes bougent toutes seules."],
      en: ["Like Strasbourg in 1518, the whole city started dancing and can't stop. Day 4: your feet are bleeding, your neighbor dislocated her hip mid-macarena and a guy danced until his heart burst. You can't stop.", "A dancing plague hits {city}. People have been twerking in the streets for three days, crying. The mayor moonwalks at a press conference. Your legs move on their own."],
    },
    choices: [
      { label: { fr: 'Danser jusqu\'au bout', en: 'Dance it out' }, text: { fr: "J'ai dansé six jours. J'ai perdu 9 kilos, deux ongles de pied et toute ma dignité. Mais j'ai des mollets de danseur{|se} étoile.", en: "I danced for six days. Lost 20 pounds, two toenails and all my dignity. But I have the calves of a prima ballerina." }, fx: { athletic: 12, health: -12, weight: -0.08, visual: 'gore' } },
      { label: { fr: 'En faire un trend', en: 'Make it a trend' }, text: { fr: "J'ai filmé mon épidémie de danse et posté ça avec #DancePlagueChallenge. 80 millions de vues. Des gens en bonne santé essaient d'imiter des malades. L'humanité est perdue.", en: "I filmed my dance plague and posted it as #DancePlagueChallenge. 80 million views. Healthy people are imitating the sick. Humanity is doomed." }, fx: { followers: 500000, fame: 15, health: -6 }, mood: 'party' },
      { label: { fr: 'Me faire attacher', en: 'Get tied down' }, out: [
        { w: 2, text: { fr: "Je me suis fait attacher à un radiateur. Mes jambes ont continué à danser pendant trois jours. Le radiateur est parti avec moi. On a fait un slow.", en: "I had myself tied to a radiator. My legs kept dancing for three days. The radiator came with me. We slow-danced." }, fx: { health: -5, stress: 10 } },
        { w: 1, text: { fr: "Le radiateur a tenu, pas mes hanches. Elles se sont déboîtées dans un craquement de poulet rôti, et j'ai continué à danser du haut du corps, en hurlant.", en: "The radiator held, my hips didn't. They popped out with a roast-chicken crunch, and I kept dancing from the waist up, screaming." }, fx: { health: -20, athletic: -5, disease: 'back_pain', visual: 'gore' }, mood: 'cry' },
      ] },
    ],
  },

  // ── Tumeur douée de conscience (2 étapes) ──
  {
    id: 'ch2_tumour',
    icon: '🧠',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'hospital', mood: 'shock', prop: 'scan' },
    when: { age: [25, 90], noFlag: 'ch2_tumour' },
    weight: 2,
    once: true,
    text: {
      fr: ["Ton scanner révèle une tumeur bénigne de la taille d'une prune. Problème : elle parle. Elle s'appelle Jean-Michel, elle a une voix de présentateur radio et des opinions très arrêtées sur ta vie amoureuse.", "Depuis quelques semaines, une petite voix te donne des conseils. Ce n'est pas ta conscience : c'est une tumeur, sur ton rein, qui se présente comme « Jean-Michel, enchanté ». Le médecin est livide."],
      en: ["Your scan reveals a benign tumor the size of a plum. Problem: it talks. Its name is Jean-Michel, it has a radio host voice and very strong opinions about your love life.", "For a few weeks, a little voice has been giving you advice. It's not your conscience: it's a tumor on your kidney, introducing itself as 'Jean-Michel, charmed'. The doctor is pale."],
    },
    choices: [
      { label: { fr: 'Opérer', en: 'Operate' }, text: { fr: "Jean-Michel a supplié pendant toute l'anesthésie : « Pense à tout ce qu'on a vécu ! » Le chirurgien l'a retiré et posé dans un bocal. Il m'insulte depuis l'étagère. Je suis en bonne santé.", en: "Jean-Michel begged throughout the anesthesia: 'Think of everything we've been through!' The surgeon removed him and put him in a jar. He insults me from the shelf. I'm healthy." }, fx: { health: 10, money: -3000, happy: 4, visual: 'gore' } },
      { label: { fr: 'Le garder', en: 'Keep him' }, text: { fr: "J'ai gardé Jean-Michel. Il me souffle les réponses au quiz télé, il me dit quand mon date ment et il fredonne pendant mes réunions. C'est le meilleur colocataire que j'aie jamais eu.", en: "I kept Jean-Michel. He whispers trivia answers, tells me when my date is lying and hums during my meetings. Best roommate I've ever had." }, fx: { smarts: 6, happy: 8, health: -6, flag: 'ch2_tumour', schedule: { key: 'ch2_tumour_2', years: 2 } }, mood: 'happy' },
      { label: { fr: 'Lancer un podcast', en: 'Start a podcast' }, text: { fr: "J'ai lancé « Moi et ma tumeur », un podcast où Jean-Michel donne des conseils de vie. Top 3 des podcasts. Il veut 50 % des revenus. On négocie.", en: "I launched 'Me and My Tumor', a podcast where Jean-Michel gives life advice. Top 3 podcast. He wants 50% of the revenue. We're negotiating." }, fx: { fame: 15, money: 12000, health: -6, flag: 'ch2_tumour', schedule: { key: 'ch2_tumour_2', years: 2 } }, mood: 'proud' },
    ],
  },
  {
    id: 'ch2_tumour_2',
    icon: '🍇',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    when: { flag: 'ch2_tumour' },
    scene: { place: 'hospital', mood: 'angry', prop: 'scan', fx: 'gore' },
    text: {
      fr: ["Jean-Michel a grossi. Il fait maintenant la taille d'un pamplemousse, il a des ambitions politiques et il veut se présenter aux municipales. Il dit que tu « le freines ».", "Ta tumeur parlante exige son indépendance. Jean-Michel veut « vivre sa vie », voyager, rencontrer d'autres tumeurs. Il menace de faire une grève de la croissance. Ou l'inverse."],
      en: ["Jean-Michel has grown. He's now grapefruit-sized, has political ambitions and wants to run for city council. He says you're 'holding him back'.", "Your talking tumor demands independence. Jean-Michel wants to 'live his life', travel, meet other tumors. He threatens a growth strike. Or the opposite."],
    },
    choices: [
      { label: { fr: 'Le laisser partir', en: 'Let him go' }, text: { fr: "Opération réussie. Jean-Michel est sorti du bloc opératoire tout seul, sur ses petits pseudopodes, en disant « merci pour tout ». Il est conseiller municipal maintenant. Il a voté contre moi.", en: "Surgery succeeded. Jean-Michel crawled out of the OR on his own little pseudopods, saying 'thanks for everything'. He's a city councilman now. He voted against me." }, fx: { health: 15, happy: 5, karma: 8, unflag: 'ch2_tumour' }, mood: 'love' },
      { label: { fr: 'Le manger', en: 'Eat him' }, text: { fr: "Le chirurgien me l'a rendu dans un bocal. Je l'ai fait revenir à l'ail et au persil. Il hurlait encore dans la poêle. C'était lui ou moi. Goût de foie gras, en plus caoutchouteux.", en: "The surgeon handed him back in a jar. I sautéed him with garlic and parsley. He was still screaming in the pan. It was him or me. Tasted like foie gras, but rubbery." }, fx: { health: 12, karma: -15, happy: -4, unflag: 'ch2_tumour', visual: 'gore' }, mood: 'sick' },
      { label: { fr: 'Fusionner nos esprits', en: 'Merge our minds' }, text: { fr: "J'ai accepté de fusionner avec Jean-Michel. On partage le cerveau. Je pense deux fois plus vite, mais je parle à la première personne du pluriel et j'ai une forte envie de faire de la politique.", en: "I agreed to merge with Jean-Michel. We share the brain. I think twice as fast, but I speak in the first person plural and have a strong urge to go into politics." }, fx: { smarts: 15, health: -15, fame: 5, unflag: 'ch2_tumour' } },
    ],
  },

  // ── Explosion de baleine (inspiré d'une vraie histoire) ──
  {
    id: 'ch2_whale_boom',
    icon: '🐋',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'beach', mood: 'shock', prop: 'whale', fx: 'explosion' },
    when: { age: [10, 90] },
    weight: 4,
    once: true,
    text: {
      fr: ["Une baleine morte de 8 tonnes pourrit sur la plage. La mairie a une idée géniale : la faire sauter à la dynamite pour que les mouettes mangent les morceaux. Tout le monde est venu regarder. Tu es au premier rang.", "Le préfet annonce qu'il va « disperser » la baleine échouée avec 500 kg d'explosifs. Les familles pique-niquent derrière le ruban de sécurité, à 50 mètres. Ça sent déjà très fort."],
      en: ["A dead 8-ton whale is rotting on the beach. The town has a brilliant idea: blow it up with dynamite so the seagulls can eat the pieces. Everyone came to watch. You're in the front row.", "The mayor announces he'll 'disperse' the beached whale with half a ton of explosives. Families are picnicking behind the safety tape, 150 feet away. It already smells terrible."],
    },
    choices: [
      { label: { fr: 'Regarder de près', en: 'Watch up close' }, out: [
        { w: 3, text: { fr: "BOUM. Il a plu de la baleine pendant une minute. Un morceau de graisse de la taille d'un frigo a écrasé une voiture. J'ai reçu un bout d'intestin en pleine face. L'odeur ne partira jamais. Jamais.", en: "BOOM. It rained whale for a full minute. A fridge-sized chunk of blubber crushed a car. I took a length of intestine straight to the face. The smell will never leave. Never." }, fx: { happy: -10, looks: -6, health: -5, visual: 'gore' }, mood: 'sick' },
        { w: 1, text: { fr: "BOUM. Un morceau de baleine de 300 kilos m'est tombé dessus. J'ai été enterré{|e} sous de la graisse en décomposition. On m'a retrouvé{|e} grâce aux mouettes.", en: "BOOM. A 600-pound chunk of whale landed on me. I was buried under rotting blubber. They found me thanks to the seagulls." }, fx: { die: { fr: "écrasé{|e} par un morceau de baleine explosée de 300 kilos", en: "crushed by a 600-pound chunk of exploded whale" }, visual: 'gore' } },
      ] },
      { label: { fr: 'Filmer de loin', en: 'Film from a distance' }, text: { fr: "J'ai tout filmé depuis la dune. Pluie de chair, mouettes en panique, un adjoint au maire couvert de sang de cétacé qui dit « c'est un succès ». Ma vidéo est devenue culte.", en: "I filmed it all from the dune. Flesh rain, panicking seagulls, a deputy mayor covered in whale blood saying 'it's a success'. My video became a cult classic." }, fx: { followers: 150000, fame: 8, happy: 8, visual: 'explosion' }, mood: 'party' },
      { label: { fr: 'Vendre des morceaux', en: 'Sell chunks' }, text: { fr: "J'ai ramassé des morceaux de baleine et je les ai vendus comme « ambre gris artisanal ». Un parfumeur parisien en a acheté 20 kilos. Son prochain parfum s'appellera « Marée Fatale ».", en: "I gathered whale chunks and sold them as 'artisanal ambergris'. A Paris perfumer bought 40 pounds. His next fragrance is called 'Fatal Tide'." }, fx: { money: 9000, karma: -5, looks: -3, visual: 'money' } },
    ],
  },

  // ── Gain de loterie absurde (légendaire) ──
  {
    id: 'ch2_lottery',
    icon: '🎰',
    cat: 'chaos',
    rating: 1,
    scene: { place: 'home', mood: 'shock', prop: 'ticket', fx: 'money' },
    when: { age: [18, 99] },
    weight: 1,
    once: true,
    vars: { amount: [400000, 3000000] },
    text: {
      fr: ["Tu as joué les numéros que ton chien a dessinés en vomissant sur le tapis. Résultat : six bons numéros. Tu as gagné {$amount}. Le chien te regarde comme s'il attendait sa part.", "Tu es le milliardième client d'une station-service perdue. Le gérant, en larmes, t'annonce que tu as gagné {$amount}. Ou un cochon. Il hésite. « C'est écrit petit. »"],
      en: ["You played the numbers your dog drew by throwing up on the rug. Result: six winning numbers. You won {$amount}. The dog looks at you like he's waiting for his cut.", "You're the billionth customer at a remote gas station. The manager, in tears, says you've won {$amount}. Or a pig. He's not sure. 'The print is small.'"],
    },
    choices: [
      { label: { fr: 'Encaisser', en: 'Cash in' }, out: [
        { w: 2, text: { fr: "J'ai encaissé {$amount}. J'ai acheté une maison, une voiture et un collier en or pour le chien. Il l'a mangé.", en: "I cashed in {$amount}. I bought a house, a car and a gold collar for the dog. He ate it." }, fx: { money: 'amount', happy: 25, visual: 'money' }, mood: 'party' },
        { w: 1, text: { fr: "Le gain était versé en pièces de 1 centime, livrées par camion-benne dans mon salon. Le plancher a cédé. Les pièces sont chez le voisin du dessous. On est en procès.", en: "The prize was paid in pennies, dumped by truck into my living room. The floor gave way. The coins are in the downstairs neighbor's place. We're in court." }, fx: { money: 50000, happy: 5, stress: 15, visual: 'money' } },
        { w: 1, text: { fr: "Petit caractère : j'avais gagné le cochon. Il s'appelle Jambon, il pèse 300 kilos et il a mangé ma haie. Je l'aime plus que l'argent, finalement.", en: "Fine print: I won the pig. His name is Bacon, he weighs 650 pounds and ate my hedge. Turns out I love him more than money." }, fx: { happy: 10, newNpc: { role: 'pet', species: 'pig', age: [2, 4], abs: true } }, mood: 'love' },
      ] },
      { label: { fr: 'Tout rejouer', en: 'Bet it all again' }, out: [
        { w: 1, text: { fr: "J'ai tout rejoué sur un autre vomi du chien. J'ai gagné encore. Les autorités enquêtent sur mon chien. Il a un avocat.", en: "I bet it all on another dog vomit. Won again. Authorities are investigating my dog. He has a lawyer." }, fx: { money: 'amount', fame: 15, happy: 20, addiction: ['gambling', 15], visual: 'money' } },
        { w: 2, text: { fr: "J'ai tout rejoué. J'ai tout perdu. Le chien a revomi, mais cette fois c'était juste du vomi.", en: "I bet it all. Lost everything. The dog threw up again, but this time it was just vomit." }, fx: { happy: -15, addiction: ['gambling', 20] }, mood: 'cry' },
      ] },
    ],
  },

  // ═════════════════════════════ LIGNES DE JOURNAL (auto) ═════════════════════════════
  {
    id: 'ch2_auto_deja_vu',
    icon: '🌀',
    cat: 'chaos',
    rating: 0,
    auto: true,
    when: { age: [6, 99] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "J'ai eu un déjà-vu si violent que j'ai répondu à une question avant qu'on me la pose. C'était « tu veux du pain ? ». Oui.",
        "Le même chat noir est passé deux fois devant moi, exactement pareil. J'ai cligné des yeux. Il est passé une troisième fois, en marche arrière.",
        "{w:time}, j'ai eu la certitude d'avoir déjà vécu ce moment : moi, {w:food} à la main, {w:animal} qui me fixe. J'avais raison. C'était hier. Je mange vraiment toujours la même chose.",
        "Déjà-vu {w:at_place} : j'ai su exactement ce que la dame devant moi allait dire. « {w:exclaim} » Elle l'a dit. Grand silence. Elle aussi l'avait vu venir.",
        "J'ai entendu {w:sound} et j'ai eu un déjà-vu de [[douze|trente|quarante-sept]] secondes. Pendant ce temps, j'ai revu toute la scène en boucle, y compris le moment où je me cogne {w:bodypart}. Je me suis cogné{|e} quand même.",
      ],
      en: [
        "I had déjà vu so hard I answered a question before it was asked. It was 'want some bread?'. Yes.",
        "The same black cat walked past me twice, exactly the same. I blinked. It walked past a third time, in reverse.",
        "{w:time}, I was certain I'd lived this moment before: me, holding {w:food}, {w:animal} staring at me. I was right. It was yesterday. I really do eat the same thing every day.",
        "Déjà vu {w:at_place}: I knew exactly what the lady in front of me was going to say. '{w:exclaim}' She said it. Awkward silence. She'd seen it coming too.",
        "I heard {w:sound} and had a [[twelve|thirty|forty-seven]]-second déjà vu. The whole scene replayed on loop, including the part where I bang my {w:bodypart}. I banged it anyway.",
      ],
    },
    fx: { happy: 2, smarts: 1 },
  },
  {
    id: 'ch2_auto_frogs',
    icon: '🐸',
    cat: 'weird',
    rating: 0,
    auto: true,
    when: { age: [4, 99] },
    weight: 5,
    cooldown: 8,
    text: {
      fr: [
        "Il a plu des grenouilles pendant dix minutes. L'une d'elles est restée dans ma capuche toute la journée. Je l'ai appelée Patricia.",
        "Une grenouille est tombée du ciel dans mon café. On s'est regardés. Je l'ai bu quand même. Le café, pas la grenouille.",
        "Petite pluie de grenouilles {w:at_place}. Une est tombée pile dans {w:food}. Le serveur a dit que c'était « le plat du jour ». Je n'ai pas osé contester.",
        "Il a plu des grenouilles {w:time}. J'en ai retrouvé [[trois|onze|vingt-deux]] dans {w:vehicle}. Elles avaient l'air chez elles. Je leur ai laissé les clés.",
        "Une grenouille m'est tombée sur la tête et y est restée. {w:exclaim} Personne au bureau ne m'a rien dit. Elle a coassé pendant la réunion et tout le monde a fait semblant que c'était mon ventre.",
      ],
      en: [
        "It rained frogs for ten minutes. One stayed in my hood all day. I named her Patricia.",
        "A frog fell from the sky into my coffee. We stared at each other. I drank it anyway. The coffee, not the frog.",
        "Light frog shower {w:at_place}. One landed right in {w:food}. The waiter said it was 'the special'. I didn't dare argue.",
        "It rained frogs {w:time}. I found [[three|eleven|twenty-two]] of them in {w:vehicle}. They looked right at home. I left them the keys.",
        "A frog fell on my head and stayed there. {w:exclaim} Nobody at work said a thing. It croaked during the meeting and everyone pretended it was my stomach.",
      ],
    },
    fx: { happy: 3 },
  },
  {
    id: 'ch2_auto_hero_fan',
    icon: '🦸',
    cat: 'chaos',
    rating: 0,
    auto: true,
    when: { flag: 'ch2_hero' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["Un enfant m'a demandé un autographe de super-héros. Il l'a revendu 3 € à la sortie de l'école. C'est le marché.", "J'ai sauvé une mamie d'un scooter fou. Elle m'a remercié{|e} avec un bonbon à la menthe collé à un mouchoir."],
      en: ["A kid asked for my superhero autograph. He resold it for three bucks outside school. That's the market.", "I saved a granny from a runaway scooter. She thanked me with a mint stuck to a tissue."],
    },
    fx: { fame: 2, karma: 3, happy: 2 },
  },
  {
    id: 'ch2_auto_lottery',
    icon: '🎟️',
    cat: 'chaos',
    rating: 1,
    auto: true,
    when: { age: [18, 99] },
    weight: 4,
    cooldown: 10,
    vars: { amount: [500, 15000] },
    text: {
      fr: [
        "J'ai gagné {$amount} avec un ticket à gratter resté collé sous ma chaussure depuis un mois. Merci, chewing-gum.",
        "Un pigeon a lâché un ticket de loto sur ma tête. Gagnant : {$amount}. La fiente était offerte.",
        "J'ai acheté {w:object} d'occasion et j'y ai trouvé un vieux ticket de loto. Gagnant : {$amount}. Le vendeur ne le saura jamais. Enfin, s'il lit ceci, désolé{|e}.",
        "Ticket à gratter acheté {w:at_place} {w:excuse}. J'ai gratté avec mes clés : {$amount}. J'ai crié si fort qu'on a cru à un braquage. Le vigile m'a félicité{|e} à plat ventre.",
        "J'ai joué la date de naissance de mon ex au loto, par dépit, {w:time}. Résultat : {$amount}. {w:exclaim} Je dois [[une partie de|toute|la moitié de]] ma fortune à quelqu'un que je déteste.",
      ],
      en: [
        "I won {$amount} with a scratch card that had been stuck under my shoe for a month. Thanks, chewing gum.",
        "A pigeon dropped a lottery ticket on my head. Winner: {$amount}. The droppings were complimentary.",
        "I bought {w:object} secondhand and found an old lottery ticket inside. Winner: {$amount}. The seller will never know. Well, if he reads this, sorry.",
        "Bought a scratch card {w:at_place} {w:excuse}. Scratched it with my keys: {$amount}. I screamed so loud people thought it was a robbery. The security guard congratulated me from the floor.",
        "I played my ex's birthday in the lottery, out of spite, {w:time}. Result: {$amount}. {w:exclaim} I owe [[part of|all of|half of]] my fortune to someone I despise.",
      ],
    },
    fx: { money: 'amount', happy: 6, visual: 'money' },
  },
  {
    id: 'ch2_auto_npc_freeze',
    icon: '🧊',
    cat: 'chaos',
    rating: 1,
    auto: true,
    when: { age: [12, 99] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: [
        "Le caissier s'est figé en pleine phrase pendant trente secondes, la bouche ouverte. Puis il a repris : « …et avec ceci ? ». Personne d'autre n'a rien remarqué. Je ne dors plus.",
        "Toute la rue s'est arrêtée net, y compris un oiseau en plein vol. Trois secondes. Puis tout est reparti. J'ai bu un whisky à 10 h du matin.",
        "{w:at_place}, un type a répété « bonjour » [[quatre|sept|onze]] fois de suite, avec exactement la même intonation, puis il est reparti comme si de rien n'était. Je crois qu'on vit dans un jeu vidéo mal codé. J'ai bu {w:drink} pour oublier.",
        "Ma voisine s'est figée, une jambe en l'air, en train de monter dans {w:vehicle}. Elle est restée comme ça une minute. Puis elle a dit « {w:exclaim} » et elle a démarré. Je ne lui en ai jamais parlé.",
        "Pendant une seconde, tout le monde {w:at_place} a tourné la tête vers moi en même temps. Silence total. Puis ils ont repris leurs vies. Je suis rentré{|e} chez moi et j'ai dormi avec un couteau à beurre. Ça sert à rien, mais ça rassure.",
      ],
      en: [
        "The cashier froze mid-sentence for thirty seconds, mouth open. Then resumed: '…anything else?'. Nobody else noticed. I don't sleep anymore.",
        "The whole street stopped dead, including a bird mid-flight. Three seconds. Then everything restarted. I had a whiskey at 10am.",
        "{w:at_place}, a guy said 'hello' [[four|seven|eleven]] times in a row, with exactly the same intonation, then walked off like nothing happened. I think we live in a badly coded video game. I had {w:drink} to forget.",
        "My neighbor froze mid-step, one leg in the air, climbing into {w:vehicle}. She stayed like that for a full minute. Then she said '{w:exclaim}' and drove off. I've never brought it up.",
        "For one second, everyone {w:at_place} turned to look at me at the same time. Dead silence. Then they went back to their lives. I went home and slept with a butter knife. Useless, but comforting.",
      ],
    },
    fx: { stress: 5, smarts: 1 },
  },
  {
    id: 'ch2_auto_pigeon_boom',
    icon: '💥',
    cat: 'chaos',
    rating: 2,
    auto: true,
    when: { age: [8, 99] },
    weight: 4,
    cooldown: 8,
    text: {
      fr: [
        "Un pigeon a explosé spontanément au-dessus de ma tête. Plumes, tripes, et un petit cœur encore chaud dans mon col. Les scientifiques parlent d'un « phénomène rare ». J'ai brûlé ma veste.",
        "Le chihuahua de la voisine a gonflé comme un ballon et a éclaté sur le trottoir. Pluie de poils et de boyaux sur trois voitures. La voisine accuse les ondes 5G.",
        "{w:animal} a explosé sans prévenir {w:at_place}. Des tripes sur les vitrines, un œil dans mon café, et {w:smell} pour le reste de la journée. {w:swear} Le gérant m'a quand même fait payer le café.",
        "Une mouette a explosé en plein vol au-dessus de la plage. Il a plu des plumes et des boyaux sur [[douze|trente|cinquante]] serviettes. Une famille a continué son pique-nique. Moi, j'ai rendu {w:food}.",
        "Un pigeon a éclaté juste devant moi {w:time}, comme un ballon d'eau rempli de ketchup. J'ai retrouvé un bout d'aile collé sur {w:bodypart}. J'ai crié {w:swear} et les passants ont applaudi.",
      ],
      en: [
        "A pigeon spontaneously exploded above my head. Feathers, guts, and a tiny still-warm heart down my collar. Scientists call it 'a rare phenomenon'. I burned my jacket.",
        "The neighbor's chihuahua inflated like a balloon and burst on the sidewalk. A rain of fur and entrails over three cars. The neighbor blames 5G.",
        "{w:animal} exploded without warning {w:at_place}. Guts on the windows, an eyeball in my coffee, and {w:smell} for the rest of the day. {w:swear} The manager still charged me for the coffee.",
        "A seagull exploded mid-flight over the beach. Feathers and guts rained on [[twelve|thirty|fifty]] towels. One family kept picnicking. I threw up {w:food}.",
        "A pigeon burst right in front of me {w:time}, like a water balloon full of ketchup. I found a bit of wing stuck to my {w:bodypart}. I yelled '{w:swear}' and passersby applauded.",
      ],
    },
    fx: { happy: -4, stress: 4, visual: 'gore' },
  },
  {
    id: 'ch2_auto_clone_sighting',
    icon: '🧬',
    cat: 'chaos',
    rating: 2,
    auto: true,
    when: { flag: 'ch2_clone' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["J'ai croisé un de mes clones au supermarché. Il lui manquait un doigt et il sentait la Javel. On s'est jugés en silence devant les céréales.", "Mon clone a couché avec mon ex. Techniquement, mon ex m'a trompé{|e} avec moi. Je ne sais pas si je dois être jaloux{|se} ou flatté{|e}."],
      en: ["I ran into one of my clones at the supermarket. He was missing a finger and smelled of bleach. We judged each other silently in the cereal aisle.", "My clone slept with my ex. Technically, my ex cheated on me with me. I don't know whether to be jealous or flattered."],
    },
    fx: { stress: 4, happy: -2 },
  },
  {
    id: 'ch2_auto_doll',
    icon: '🪆',
    cat: 'weird',
    rating: 2,
    auto: true,
    when: { flag: 'ch2_doll' },
    weight: 8,
    cooldown: 2,
    text: {
      fr: ["Ce matin, la poupée était assise sur ma poitrine, le couteau à pain à la main. Elle a souri. J'ai fait semblant de dormir jusqu'à midi.", "J'ai retrouvé une dent humaine dans mon bol de céréales. Pas une des miennes. Mademoiselle Odile fredonnait dans le salon."],
      en: ["This morning the doll was sitting on my chest, holding the bread knife. She smiled. I pretended to sleep until noon.", "I found a human tooth in my cereal bowl. Not one of mine. Miss Odile was humming in the living room."],
    },
    fx: { stress: 8, happy: -4, visual: 'ghost' },
  },
];
