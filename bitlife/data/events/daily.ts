// Daily (18+): everyday adult life turned absurd — transports, route & PV, administration, services clients, magasins,
// livraisons, arnaques, tech, bouffe, logement, colocs, voisins, ascenseurs, salle de sport, médecin, coiffeur, look,
// météo, sommeil, avis en ligne, influenceurs, mauvais numéros, petites chances et malchances.
// Chains: dy_parking_ticket → dy_bailiff (schedule), dy_ikea_couple → dy_bed_collapse (schedule), dy_smart_home → dy_smart_home_coup
// (schedule), dy_review_bomb → dy_review_revenge (schedule), dy_wrong_number → dy_wrong_wedding (chain), dy_roomie_new → dy_roomie_* (flag).
import type { EventDef } from '@bl/sim';

export const dailyEvents: EventDef[] = [
  // ───────────────────────────── transports ─────────────────────────────
  {
    id: 'dy_metro_armpit',
    icon: '🚇',
    cat: 'daily',
    rating: 2,
    scene: { place: 'park', mood: 'sick', prop: 'train' },
    when: { age: [18, 85] },
    weight: 9,
    cooldown: 4,
    text: {
      fr: [
        "Métro, 8 h 12. Ton nez est coincé dans l'aisselle d'un type qui dégage {w:smell}. Il lève le bras pour se tenir à la barre. Il ne le baissera plus jamais.",
        "Rame bondée, bloquée entre deux stations. Ton visage est écrasé contre un sac à dos qui contient manifestement {w:food}. Quelqu'un respire dans ton cou depuis onze minutes.",
        "Heure de pointe. Une dame te marche sur le pied, un ado te plante son coude dans les côtes et toute la rame baigne dans {w:smell}. Le conducteur annonce : « Nous allons stationner quelques instants. »",
        "Le RER s'arrête en plein tunnel. La clim est morte, la vitre est grasse, et ton voisin vient de lâcher {w:sound} en te regardant droit dans les yeux. Aucun regret dans son regard.",
      ],
      en: [
        "Subway, 8:12 a.m. Your nose is wedged in the armpit of a guy giving off {w:smell}. He raises his arm to grab the pole. He will never lower it again.",
        "Packed train, stuck between two stations. Your face is crushed against a backpack that clearly contains {w:food}. Someone has been breathing on your neck for eleven minutes.",
        "Rush hour. A lady steps on your foot, a teenager jams his elbow in your ribs and the whole car is marinating in {w:smell}. The driver announces: 'We'll be holding here for a few moments.'",
        "The commuter train stops in the middle of a tunnel. The AC is dead, the window is greasy, and your neighbor just released {w:sound} while looking you dead in the eye. Zero regret.",
      ],
    },
    choices: [
      {
        label: { fr: 'Retenir ma respiration', en: 'Hold my breath' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai tenu quatre stations en apnée. Record personnel. Mes poumons ont la forme d'un raisin sec mais je suis vivant{|e}.", "Apnée totale jusqu'à mon arrêt. Je suis sorti{|e} violet{|te}, j'ai aspiré l'air du quai comme un aspirateur. L'air du quai sent la pisse. Et, bizarrement, {w:food}. C'était merveilleux."], en: ["I held my breath for four stops. Personal record. My lungs are shaped like raisins but I'm alive.", "Total apnea until my stop. I came out purple and inhaled the platform air like a vacuum. Platform air smells of piss. And, weirdly, {w:food}. It was glorious."] }, fx: { athletic: 2, happy: 2 } },
          { w: 1, text: { fr: ["J'ai craqué au bout de 40 secondes et inspiré un grand coup. J'ai senti l'odeur jusque dans mes molaires. J'ai vomi dans mon écharpe.", "J'ai tourné de l'œil et je me suis effondré{|e} sur l'aisselle en question. Le type m'a caressé les cheveux jusqu'au terminus en fredonnant {w:song}."], en: ["I cracked after 40 seconds and took a huge breath. I tasted it in my molars. I threw up into my scarf.", "I passed out and collapsed face-first into said armpit. The guy stroked my hair all the way to the last stop, humming {w:song}."] }, fx: { health: -4, happy: -5, visual: 'poop' }, mood: 'sick' },
        ],
      },
      { label: { fr: "L'écharpe sur le nez", en: 'Scarf over my nose' }, text: { fr: ["J'ai respiré à travers mon écharpe pendant tout le trajet. Elle sent maintenant comme lui. Je l'ai brûlée dans la cour.", "J'ai enfoui mon nez dans mon écharpe. Elle n'avait pas été lavée depuis l'hiver dernier. J'ai découvert que le problème, c'était peut-être moi. J'y ai trouvé {w:object}."], en: ["I breathed through my scarf the whole way. Now it smells like him. I burned it in the courtyard.", "I buried my nose in my scarf. It hadn't been washed since last winter. I discovered the problem might have been me. I found {w:object} in it."] }, fx: { happy: -2, stress: 3 } },
      {
        label: { fr: 'Riposter chimiquement', en: 'Chemical retaliation' },
        out: [
          { w: 2, text: { fr: ["J'ai répondu par un pet de compétition. Silencieux, tiède, mortel. La rame s'est vidée à la station suivante. J'ai fini le trajet assis{|e}, seul{|e}, en roi.", "Œil pour œil, pet pour pet. Le duel a duré trois stations. Une mamie a applaudi. On a fait match nul et on s'est serré la main. Il m'a appelé{|e} « {w:nickname} »."], en: ["I answered with a competition-grade fart. Silent, warm, lethal. The car emptied at the next stop. I finished the ride seated, alone, like royalty.", "An eye for an eye, a fart for a fart. The duel lasted three stops. An old lady applauded. We called it a draw and shook hands. He called me '{w:nickname}'."] }, fx: { happy: 6, karma: -3 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai poussé un peu trop fort. Ce n'était pas qu'un pet. J'ai dû descendre à une station que je ne connaissais pas et acheter un jogging dans un kebab.", "Mauvais calcul : le pet était chargé. J'ai fait le reste du trajet en serrant les fesses et la mâchoire. Le pantalon est mort pour la patrie. J'ai hurlé « {w:swear} » en silence."], en: ["I pushed a bit too hard. It wasn't just a fart. I had to get off at an unknown station and buy sweatpants at a kebab shop.", "Bad call: the fart was loaded. I rode the rest of the way clenching my cheeks and my jaw. The pants died for their country. I screamed '{w:swear}' in silence."] }, fx: { happy: -8, looks: -3, visual: 'poop' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'dy_train_delay',
    icon: '🚆',
    cat: 'daily',
    rating: 0,
    vars: { amount: [40, 160] },
    scene: { place: 'park', mood: 'angry', prop: 'train' },
    when: { age: [18, 90] },
    weight: 9,
    cooldown: 4,
    text: {
      fr: [
        "Quai de gare. L'écran affiche « Retard indéterminé ». Puis « Supprimé ». Puis, sans explication, le portrait officiel du jour : {w:animal}.",
        "« Le train de 7 h 48 aura un retard de 40 minutes. Motif : {w:object} sur la voie. » Ça fait maintenant deux heures. La voix robotique s'excuse pour la onzième fois.",
        "Ton train est annulé pour « conditions météorologiques défavorables ». Dehors, il fait grand soleil. Un contrôleur fume tranquillement sur le quai, {w:drink} à la main.",
        "Le TER s'arrête au milieu d'un champ. Une annonce grésille : « Nous attendons l'autorisation de… » puis plus rien. Dehors, {w:animal} te regarde par la fenêtre. La bête a l'air de bien connaître la situation.",
      ],
      en: [
        "Train platform. The board says 'Delay unknown'. Then 'Cancelled'. Then, without explanation, today's official portrait: {w:animal}.",
        "'The 7:48 will be delayed by 40 minutes. Reason: {w:object} on the tracks.' It's now been two hours. The robot voice has apologized eleven times.",
        "Your train is cancelled due to 'adverse weather conditions'. Outside, the sun is blazing. A conductor is smoking peacefully on the platform, holding {w:drink}.",
        "The regional train stops in the middle of a field. A crackling announcement: 'We are waiting for authorization to…' then nothing. Outside, {w:animal} stares at you through the window. It seems familiar with the situation.",
      ],
    },
    choices: [
      { label: { fr: 'Attendre stoïquement', en: 'Wait stoically' }, text: { fr: ["J'ai attendu. Trois heures. J'ai fini par connaître la vie entière de mes voisins de quai. L'un d'eux est devenu mon témoin de mariage, enfin presque.", "J'ai attendu en silence, comme un moine. Le train est arrivé, plein. J'ai voyagé dans les toilettes avec un vélo et {w:animal}."], en: ["I waited. Three hours. I ended up knowing the life stories of everyone on the platform. One of them almost became my best man.", "I waited in silence, like a monk. The train arrived, packed. I traveled in the toilet with a bicycle and {w:animal}."] }, fx: { stress: 4, discipline: 3 } },
      {
        label: { fr: 'Demander un remboursement', en: 'Claim a refund' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai rempli le formulaire de compensation : 14 pages, une photo de mon billet et une de ma grand-mère. J'ai obtenu {$amount}. Je n'en reviens toujours pas.", "Après six mails et un fax (un fax !), j'ai été remboursé{|e} de {$amount}. J'ai encadré le virement et je me suis offert {w:drink}."], en: ["I filled out the compensation form: 14 pages, a photo of my ticket and one of my grandmother. I got {$amount}. I still can't believe it.", "After six emails and a fax (a fax!), I got {$amount} back. I framed the bank transfer and treated myself to {w:drink}."] }, fx: { money: 'amount', happy: 6 }, mood: 'proud' },
          { w: 2, text: { fr: ["Ma demande de remboursement a été rejetée : « retard inférieur au seuil ». Le seuil, apparemment, c'est la mort.", "J'ai reçu un bon d'achat de 2 € valable uniquement au wagon-bar, qui a été supprimé en 2011 et remplacé par un distributeur vendant {w:food}."], en: ["My refund claim was rejected: 'delay below threshold'. The threshold, apparently, is death.", "I received a $2 voucher valid only at the café car, which was discontinued in 2011 and replaced by a vending machine selling {w:food}."] }, fx: { happy: -4, stress: 3 } },
        ],
      },
      { label: { fr: 'Rentrer à pied', en: 'Walk home' }, text: { fr: ["Je suis rentré{|e} à pied {w:weather}. 19 km. Le train m'a doublé au kilomètre 18, vide, en klaxonnant.", "J'ai marché. Au bout de trois heures, j'ai croisé un panneau indiquant mon point de départ. J'ai pleuré, puis j'ai fait du stop. Un tracteur m'a pris{|e}."], en: ["I walked home {w:weather}. 12 miles. The train passed me at mile 11, empty, honking.", "I walked. After three hours, I passed a sign pointing back to where I started. I cried, then hitchhiked. A tractor picked me up."] }, fx: { athletic: 4, health: 2, happy: -3 } },
    ],
  },
  {
    id: 'dy_bus_chase',
    icon: '🚌',
    cat: 'daily',
    rating: 0,
    scene: { place: 'park', mood: 'angry', prop: 'bus' },
    when: { age: [18, 85] },
    weight: 9,
    cooldown: 4,
    text: {
      fr: [
        "Ton bus est à l'arrêt, portes ouvertes, à 30 mètres. Tu cours. Le chauffeur te voit dans le rétro. Il te sourit en mangeant {w:food}. Les portes se ferment.",
        "Tu fais signe au bus. Il ralentit, le chauffeur te regarde… et accélère. Sur le côté du bus, {w:celeb} sourit sur une pub : « On vous emmène plus loin ».",
        "Le bus de nuit devait passer il y a 25 minutes. L'appli dit « 2 min » depuis 25 minutes. À côté de toi, quelqu'un mange {w:food} avec les doigts.",
        "Tu montes dans le bus, tu valides… « Titre invalide ». Tout le bus te regarde. Le chauffeur soupire comme si tu lui avais personnellement volé {w:object}.",
      ],
      en: [
        "Your bus is at the stop, doors open, 30 yards away. You run. The driver sees you in the mirror. He smiles, eating {w:food}. The doors close.",
        "You wave at the bus. It slows down, the driver looks at you… and speeds up. On its side, {w:celeb} grins from an ad: 'Taking you further'.",
        "The night bus was due 25 minutes ago. The app has said '2 min' for 25 minutes. Next to you, someone is eating {w:food} with their bare hands.",
        "You board the bus, tap your card… 'Invalid ticket'. The whole bus stares. The driver sighs as if you'd personally stolen {w:object} from him.",
      ],
    },
    choices: [
      {
        label: { fr: 'Sprinter', en: 'Sprint' },
        out: [
          { w: 1, odds: { athletic: 2 }, text: { fr: ["J'ai sprinté comme un guépard sous caféine et tapé sur la porte. Le chauffeur a rouvert, impressionné. Les passagers m'ont applaudi{|e}. Meilleur moment de l'année.", "J'ai rattrapé le bus au feu rouge suivant. J'ai frappé à la vitre avec la dignité d'un zombie affamé. Il m'a ouvert, par peur. Un passager m'a tendu {w:drink}."], en: ["I sprinted like a caffeinated cheetah and banged on the door. The driver reopened, impressed. The passengers applauded. Best moment of the year.", "I caught the bus at the next red light. I knocked on the window with the dignity of a starving zombie. He let me in out of fear. A passenger handed me {w:drink}."] }, fx: { athletic: 3, happy: 5 }, mood: 'proud' },
          { w: 2, text: { fr: ["J'ai couru, trébuché sur un trottoir et je me suis râpé {w:bodypart} sur le bitume. Le bus est parti. Un pigeon m'a regardé{|e} avec pitié.", "Sprint héroïque, perte d'une chaussure, bus raté. J'ai attendu le suivant avec une seule chaussure et toute ma honte."], en: ["I ran, tripped on a curb and scraped my {w:bodypart} on the asphalt. The bus left. A pigeon looked at me with pity.", "Heroic sprint, lost a shoe, missed the bus. I waited for the next one with one shoe and all my shame."] }, fx: { health: -3, happy: -4 }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Prendre un taxi', en: 'Take a cab' }, text: { fr: ["J'ai pris un taxi. 34 € pour 3 kilomètres, dont 10 de « supplément bagage » pour mon sac banane.", "J'ai appelé un taxi. Il est arrivé en même temps que le bus suivant. J'ai pris le taxi par fierté. C'était la mauvaise décision. Le taxi dégageait {w:smell}."], en: ["I took a cab. $34 for 2 miles, including $10 'luggage surcharge' for my fanny pack.", "I called a cab. It arrived at the same time as the next bus. I took the cab out of pride. Wrong call. The cab gave off {w:smell}."] }, fx: { money: -35, stress: -2 } },
      { label: { fr: 'Insulter le bus', en: 'Curse the bus' }, text: { fr: ["J'ai crié « {w:insult} ! » au bus qui s'éloignait. Une dame à l'arrêt a cru que c'était pour elle. Elle m'a frappé{|e} avec son poireau.", "J'ai hurlé ma rage au bus. Il a fait marche arrière. Le chauffeur est descendu. On s'est regardés longtemps. Puis il est reparti sans moi."], en: ["I yelled '{w:insult}!' at the departing bus. A lady at the stop thought it was meant for her. She hit me with her leek.", "I screamed my rage at the bus. It reversed. The driver got out. We stared at each other for a long time. Then he left without me."] }, fx: { happy: 2, stress: -3, karma: -2 } },
    ],
  },
  {
    id: 'dy_metro_accordion',
    icon: '🪗',
    cat: 'daily',
    rating: 1,
    scene: { place: 'park', mood: 'neutral', prop: 'accordion' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Un accordéoniste monte dans ta rame et attaque {w:song}. Pour la sixième fois cette semaine. Il te reconnaît. Il te fait un clin d'œil.",
        "Un type monte avec une enceinte Bluetooth et un micro. « Bonjour mesdames et messieurs, désolé de vous déranger. » Il ne le pense pas. Il entame {w:song} en version karaoké.",
        "Trois danseurs débarquent dans le wagon : « It's showtime ! » L'un d'eux fait des saltos autour de la barre centrale à dix centimètres de ton visage. Il dégage {w:smell}.",
        "Un musicien installe une harpe entière dans le métro. Une harpe. Il joue {w:song}. C'est beau, horrible et il prend toute la place.",
      ],
      en: [
        "An accordion player boards your car and launches into {w:song}. For the sixth time this week. He recognizes you. He winks.",
        "A guy gets on with a Bluetooth speaker and a mic. 'Good morning ladies and gentlemen, sorry to disturb you.' He is not sorry. He starts {w:song}, karaoke version.",
        "Three dancers burst into the car: 'It's showtime!' One of them does backflips around the center pole four inches from your face. He gives off {w:smell}.",
        "A musician sets up an entire harp in the subway. A harp. He plays {w:song}. It's beautiful, horrible, and he takes up all the space.",
      ],
    },
    choices: [
      { label: { fr: 'Donner une pièce', en: 'Give a coin' }, text: { fr: ["Je lui ai donné 2 €. Il a joué un rappel rien que pour moi. J'ai dû donner 2 € de plus pour qu'il arrête.", "J'ai lâché une pièce. Il a hoché la tête, satisfait, et s'est installé à côté de moi pour la suite du trajet. On est presque amis. Il m'a offert {w:food}."], en: ["I gave him two bucks. He played an encore just for me. I had to give two more to make him stop.", "I tossed a coin. He nodded, satisfied, and sat next to me for the rest of the ride. We're almost friends. He offered me {w:food}."] }, fx: { money: -4, karma: 3, happy: 1 } },
      {
        label: { fr: 'Chanter avec lui', en: 'Sing along' },
        out: [
          { w: 1, text: { fr: ["J'ai chanté à pleins poumons. Tout le wagon a suivi. Quelqu'un a filmé. On me reconnaît maintenant dans la rue comme « la personne du métro ».", "On a fait un duo improvisé. Il m'a proposé de partir en tournée. J'ai réfléchi plus longtemps que je ne l'admettrai. Première date : {w:far_place}."], en: ["I sang at the top of my lungs. The whole car joined in. Someone filmed it. People now recognize me on the street as 'the subway person'.", "We did an improvised duet. He invited me on tour. I considered it longer than I'll ever admit. First date: {w:far_place}."] }, fx: { happy: 7, followers: 800, fame: 1 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai chanté faux. Tellement faux que le musicien s'est arrêté, m'a regardé{|e} et m'a donné une pièce pour que je me taise.", "J'ai commencé à chanter. Personne n'a suivi. J'ai continué seul{|e} jusqu'au refrain, par orgueil. C'était long. Putain que c'était long. Un ado a crié « {w:insult} ! »"], en: ["I sang off-key. So off-key that the musician stopped, looked at me, and gave me a coin to shut up.", "I started singing. Nobody joined in. I kept going alone until the chorus, out of pride. It was long. Holy hell it was long. A teenager yelled '{w:insult}!'"] }, fx: { happy: -4, looks: -1 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Changer de wagon', en: 'Switch cars' }, text: { fr: ["J'ai changé de wagon. Dans l'autre, un type vendait des piles et des chargeurs en criant. Je suis revenu{|e} à l'accordéon.", "Je me suis enfui{|e} vers la voiture suivante. Le musicien m'a suivi{|e}. Il me suit toujours. Je crois qu'il connaît mon adresse. Hier, il jouait {w:song} sous ma fenêtre."], en: ["I switched cars. In the next one, a guy was yelling while selling batteries and chargers. I went back to the accordion.", "I fled to the next car. The musician followed me. He still follows me. I think he knows my address. Yesterday he played {w:song} under my window."] }, fx: { stress: 2 } },
    ],
  },
  {
    id: 'dy_scooter_crash',
    icon: '🛴',
    cat: 'daily',
    rating: 2,
    vars: { amount: [80, 400] },
    scene: { place: 'park', mood: 'shock', prop: 'scooter', fx: 'gore' },
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Tu loues une trottinette électrique pour aller {w:to_place}. Elle accélère toute seule. Les freins sont décoratifs. Devant toi, une descente et {w:animal}.",
        "Trottinette en libre-service, 25 km/h, une main sur le guidon, l'autre sur ton café. Un nid-de-poule de la taille d'une baignoire approche. Dedans : {w:animal}.",
        "Tu trouves une trottinette abandonnée au milieu du trottoir, batterie à 3 %. Tu la débloques quand même. Elle émet {w:sound} et démarre en trombe.",
        "En trottinette sur la piste cyclable, tu doubles un livreur à vélo. Il le prend mal. Il accélère. C'est la guerre {w:weather}.",
      ],
      en: [
        "You rent an e-scooter to go {w:to_place}. It accelerates on its own. The brakes are decorative. Ahead: a downhill slope and {w:animal}.",
        "Shared scooter, 15 mph, one hand on the handlebar, the other on your coffee. A pothole the size of a bathtub is approaching. Inside it: {w:animal}.",
        "You find a scooter abandoned in the middle of the sidewalk, battery at 3%. You unlock it anyway. It makes {w:sound} and takes off like a rocket.",
        "On a scooter in the bike lane, you overtake a delivery cyclist. He takes it personally. He speeds up. It's war, {w:weather}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Freiner à fond', en: 'Slam the brakes' },
        out: [
          { w: 3, text: { fr: ["Les freins ont lâché. J'ai fait un vol plané de quatre mètres et atterri sur {w:bodypart}. Le sang a giclé jusque sur une vitrine. La trottinette a continué sans moi, libre.", "J'ai freiné, la roue avant s'est bloquée, et je suis passé{|e} par-dessus le guidon comme un missile de chair. J'ai laissé une trace rouge de deux mètres sur le bitume. Les passants ont pris des photos."], en: ["The brakes failed. I flew thirteen feet and landed on my {w:bodypart}. Blood sprayed all the way onto a shop window. The scooter carried on without me, free.", "I braked, the front wheel locked, and I went over the handlebars like a flesh missile. I left a six-foot red streak on the asphalt. Passersby took pictures."] }, fx: { health: -15, money: '-amount', happy: -8, disease: 'sprain', visual: 'gore' }, mood: 'sick' },
          { w: 1, text: { fr: ["Miracle : j'ai freiné pile devant l'obstacle. Le café, lui, a continué sa route et s'est écrasé sur un costume à 2 000 €. Son propriétaire m'a regardé{|e}. J'ai fui.", "J'ai réussi à m'arrêter en posant les deux pieds par terre. Mes semelles ont fondu. Ça sent le pneu brûlé, mais j'ai encore tous mes membres. J'ai crié « {w:exclaim} »"], en: ["Miracle: I stopped right before impact. My coffee kept going and splattered a $2,000 suit. Its owner looked at me. I fled.", "I managed to stop by dragging both feet. My soles melted. It smells of burnt rubber, but I still have all my limbs. I yelled '{w:exclaim}'"] }, fx: { happy: 3, stress: 5 } },
          { w: 0.4, rating: 2, text: { fr: ["La trottinette a foncé droit sous un bus. Moi avec. On m'a ramassé{|e} à la petite cuillère, et l'appli m'a quand même facturé la course.", "J'ai traversé une vitrine de boucherie à 30 km/h. Au milieu des côtes de bœuf, on a eu du mal à savoir ce qui était à moi. Mon dernier mot : « {w:swear} »"], en: ["The scooter shot straight under a bus. With me on it. They scraped me up with a teaspoon, and the app still charged me for the ride.", "I crashed through a butcher's window at 20 mph. Among the rib-eyes, it was hard to tell which bits were mine. My last words: '{w:swear}'"] }, fx: { die: { fr: "en trottinette électrique, sous un bus, sans casque", en: 'on an e-scooter, under a bus, without a helmet' }, visual: 'gore' } },
        ],
      },
      {
        label: { fr: 'Sauter en marche', en: 'Bail out' },
        out: [
          { w: 1, odds: { athletic: 2 }, text: { fr: ["J'ai sauté en marche avec une roulade de cascadeur. Un enfant m'a demandé un autographe. La trottinette a fini dans le canal.", "Saut parfait, réception sur une haie. J'ai des épines partout mais aucun os cassé. Je suis une légende urbaine. On m'appelle « {w:nickname} » dans le quartier."], en: ["I bailed with a stuntman roll. A kid asked for my autograph. The scooter ended up in the canal.", "Perfect jump, landing in a hedge. Thorns everywhere but no broken bones. I'm an urban legend. The neighborhood calls me '{w:nickname}'."] }, fx: { happy: 5, health: -2, athletic: 2 }, mood: 'proud' },
          { w: 2, text: { fr: ["J'ai sauté. Mal. Mes dents ont rencontré le trottoir. Deux sont restées là-bas. Le dentiste m'a facturé {$amount}.", "Je me suis jeté{|e} sur le côté et j'ai glissé sur dix mètres de gravier. J'ai passé la soirée à retirer des cailloux de mon visage avec une pince à épiler. J'ai aussi trouvé {w:gross}."], en: ["I jumped. Badly. My teeth met the sidewalk. Two of them stayed there. The dentist charged me {$amount}.", "I threw myself sideways and slid thirty feet across gravel. I spent the evening tweezing pebbles out of my face. I also found {w:gross}."] }, fx: { health: -8, looks: -5, money: '-amount', visual: 'gore' }, mood: 'sick' },
        ],
      },
    ],
  },
  {
    id: 'dy_vtc_conspiracy',
    icon: '🚕',
    cat: 'daily',
    rating: 1,
    scene: { place: 'park', mood: 'shock', prop: 'car' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Ton chauffeur VTC verrouille les portes et t'explique, très calmement, {w:conspiracy}. Le trajet dure 40 minutes. Il a des schémas.",
        "Le chauffeur de taxi met la radio à fond, coupe le GPS « parce qu'ils nous écoutent » et prend la rocade dans le mauvais sens. Il est persuadé {w:conspiracy}.",
        "Ton chauffeur te demande si tu crois en Dieu, puis s'il peut te vendre {w:object}, puis si tu es célibataire. Il reste 18 minutes de trajet.",
        "Le VTC sent {w:smell}. Le chauffeur mange un sandwich au volant, regarde une série sur son téléphone et te note déjà une étoile dans le rétroviseur.",
      ],
      en: [
        "Your rideshare driver locks the doors and explains, very calmly, {w:conspiracy}. The ride is 40 minutes. He has diagrams.",
        "The cab driver cranks the radio, turns off the GPS 'because they're listening' and takes the highway the wrong way. He's convinced {w:conspiracy}.",
        "Your driver asks if you believe in God, then whether he can sell you {w:object}, then whether you're single. 18 minutes left.",
        "The car is filled with {w:smell}. The driver eats a sandwich while driving, watches a show on his phone and is already rating you one star in the mirror.",
      ],
    },
    choices: [
      { label: { fr: 'Acquiescer poliment', en: 'Nod politely' }, text: { fr: ["J'ai hoché la tête pendant 40 minutes. À l'arrivée, il m'a donné sa carte et l'adresse d'une réunion secrète jeudi. J'ai noté jeudi, par curiosité.", "J'ai dit « ah oui, c'est fou » toutes les trente secondes. Il m'a offert un chewing-gum « sans puce de traçage ». Il avait bon goût. Il m'a aussi expliqué {w:conspiracy}."], en: ["I nodded for 40 minutes. When we arrived, he gave me his card and the address of a secret meeting on Thursday. I wrote down Thursday, out of curiosity.", "I said 'wow, crazy' every thirty seconds. He offered me 'tracker-free' gum. It was tasty. He also explained {w:conspiracy}."] }, fx: { stress: 4, smarts: -2 } },
      {
        label: { fr: 'Le contredire', en: 'Argue with him' },
        out: [
          { w: 1, odds: { smarts: 2 }, text: { fr: ["Je l'ai démonté avec des faits, des sources et une patience de saint. Il s'est tu, a réfléchi, puis m'a fait la course gratuite. Le pouvoir de la science.", "Débat épique. Il a fini par admettre que j'avais peut-être raison. Puis il a dit que c'était exactement ce qu'ILS voulaient qu'il pense. ILS, c'est {w:celeb}, apparemment."], en: ["I dismantled him with facts, sources and saintly patience. He went quiet, thought about it, then gave me the ride for free. The power of science.", "Epic debate. He eventually admitted I might be right. Then he said that's exactly what THEY wanted him to think. THEY is {w:celeb}, apparently."] }, fx: { smarts: 3, happy: 4 } },
          { w: 2, text: { fr: ["Il m'a fait descendre sur le bord de la nationale, la nuit, en me traitant d'agent du système. J'ai fini le trajet à pied, accompagné{|e} par un hérisson.", "Ça a dégénéré. Il m'a mis{|e} une étoile, j'ai été banni{|e} de l'appli. Me voilà à vie sur la liste noire des VTC. Je me déplace désormais avec {w:vehicle}."], en: ["He dropped me off on the side of the highway at night, calling me an agent of the system. I walked the rest of the way, escorted by a hedgehog.", "It escalated. He gave me one star, and I got banned from the app. I'm now blacklisted from rideshares for life. I now get around on {w:vehicle}."] }, fx: { happy: -5, stress: 5 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Sauter au feu rouge', en: 'Jump out at a red light' }, text: { fr: ["J'ai sauté du véhicule au feu rouge, comme dans un film d'action. Il m'a quand même facturé la course complète et un « supplément évasion ».", "J'ai ouvert la portière au feu et j'ai couru. Il m'a crié que j'allais regretter. Depuis, mon micro-ondes fait {w:sound} chaque nuit."], en: ["I jumped out at a red light like in an action movie. He still charged me the full ride plus an 'escape fee'.", "I opened the door at the light and ran. He yelled that I'd regret it. Ever since, my microwave makes {w:sound} every night."] }, fx: { money: -25, happy: 1, athletic: 1 } },
    ],
  },
  // ───────────────────────────── route & stationnement ─────────────────────────────
  {
    id: 'dy_road_rage',
    icon: '🤬',
    cat: 'daily',
    rating: 2,
    vars: { amount: [200, 900] },
    scene: { place: 'park', mood: 'angry', prop: 'car', fx: 'police' },
    when: { age: [18, 85], asset: 'car' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Un SUV te fait une queue de poisson, pile poil, puis pile au feu. Le conducteur te fait un doigt d'honneur dans le rétro et crie « {w:insult} ! ».",
        "Bouchon sur le périph. Une Audi roule sur la bande d'arrêt d'urgence, se rabat devant toi en forçant et klaxonne. Sur sa lunette arrière, un autocollant : « {w:insult} ». Comme si c'était TOI le problème.",
        "Au rond-point, un type qui conduit {w:vehicle} te refuse la priorité, te frôle, puis s'arrête pour sortir de sa voiture. Il est torse nu. Il fait −2 °C.",
        "Un mec te colle au cul sur l'autoroute en faisant des appels de phares depuis dix kilomètres. Tu es sur la voie de droite. Derrière toi, il mime un étranglement en hurlant « {w:threat} ».",
      ],
      en: [
        "An SUV cuts you off, then slams on the brakes at the light. The driver flips you off in the mirror and yells '{w:insult}!'.",
        "Traffic jam on the beltway. An Audi drives on the shoulder, forces its way in front of you and honks. His rear window sticker reads '{w:insult}'. As if YOU were the problem.",
        "At the roundabout, a guy driving {w:vehicle} cuts you off, misses you by an inch, then stops to get out of his car. He's shirtless. It's 28°F.",
        "Some guy has been tailgating you on the highway, flashing his lights for six miles. You're in the right lane. Behind you, he's miming a strangling and yelling '{w:threat}'.",
      ],
    },
    choices: [
      { label: { fr: 'Respirer, compter', en: 'Breathe, count to ten' }, text: { fr: ["J'ai respiré par le ventre en comptant jusqu'à dix. À sept, il m'a balancé son gobelet de soda. À dix, j'étais zen et collant{|e}.", "J'ai mis {w:song} et souri. Il a craqué avant moi. Je l'ai vu se cogner la tête contre son volant. Victoire spirituelle."], en: ["I did belly breathing and counted to ten. At seven, he threw his soda cup at me. At ten, I was zen and sticky.", "I put on {w:song} and smiled. He cracked before I did. I saw him bang his head against his steering wheel. Spiritual victory."] }, fx: { stress: -3, karma: 3 } },
      {
        label: { fr: 'Descendre de voiture', en: 'Get out of the car' },
        out: [
          { w: 1, odds: { athletic: 2 }, text: { fr: ["Je suis descendu{|e}. Il est descendu. On s'est battus comme deux phoques en rut au milieu du carrefour. J'ai gagné, avec une dent en moins. La sienne. Elle est dans ma poche.", "Je suis sorti{|e} en hurlant « {w:threat} ! ». Il est remonté dans sa voiture, a verrouillé les portes et appelé sa mère. J'ai rarement été aussi fier{|e}."], en: ["I got out. He got out. We fought like two horny seals in the middle of the intersection. I won, minus a tooth. His. It's in my pocket.", "I got out screaming '{w:threat}!'. He got back in, locked the doors and called his mom. I've rarely been prouder."] }, fx: { happy: 6, health: -4, karma: -4, heat: 8 }, mood: 'proud' },
          { w: 2, text: { fr: ["Il faisait deux mètres et sortait d'une salle de MMA. Il m'a mis une droite qui m'a envoyé{|e} dans le capot. Mon nez a fait {w:sound} et peint sa portière en rouge.", "Je me suis jeté{|e} sur lui, il s'est écarté, et je me suis éclaté{|e} la tête sur son rétro. Le sang pissait. Il m'a filmé{|e} pendant que je pleurais. 400 000 vues."], en: ["He was seven feet tall and fresh out of an MMA gym. One right hook sent me onto the hood. My nose made {w:sound} and painted his door red.", "I lunged at him, he stepped aside, and I smashed my head on his side mirror. Blood everywhere. He filmed me crying. 400,000 views."] }, fx: { health: -12, happy: -8, looks: -4, visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Lui rayer sa caisse', en: 'Key his car' },
        out: [
          { w: 2, text: { fr: ["Au feu suivant, j'ai gravé « {w:insult} » sur toute sa portière avec ma clé. Calligraphie parfaite. Il ne l'a vu qu'en arrivant chez lui.", "Je l'ai suivi jusqu'au parking du supermarché et je lui ai rayé sa carrosserie de l'aile au coffre. Ça m'a coûté zéro euro et ça m'a fait un bien fou."], en: ["At the next light, I engraved '{w:insult}' along his entire door with my key. Perfect calligraphy. He only saw it when he got home.", "I followed him to the supermarket parking lot and keyed his car from fender to trunk. Cost me nothing and felt amazing."] }, fx: { happy: 8, karma: -8, heat: 10 }, mood: 'proud' },
          { w: 1, text: { fr: ["Il y avait une caméra embarquée. Les flics m'ont retrouvé{|e} en deux heures. Le juge a regardé la vidéo en mangeant des chips.", "Il m'a vu{|e} faire. Il a appelé la police. J'ai essayé de dire que c'était une œuvre d'art. Ça n'a pas pris. Dégradation volontaire, {$amount} de dommages. Le policier m'a traité{|e} de « {w:insult} »."], en: ["He had a dashcam. The cops found me in two hours. The judge watched the video while eating chips.", "He saw me do it. He called the police. I tried to say it was art. Didn't fly. Vandalism, {$amount} in damages. The cop called me '{w:insult}'."] }, fx: { arrest: 'vandal', money: '-amount', happy: -6, visual: 'police' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'dy_traffic_bladder',
    icon: '🚽',
    cat: 'daily',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'car' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Bouchon de 40 km sur l'autoroute des vacances. Tu as bu {w:drink} il y a une heure. Ta vessie a désormais la taille d'un ballon de rugby.",
        "Embouteillage total, pas une sortie avant 25 km. Ton ventre émet {w:sound}. Le kebab d'hier soir réclame sa liberté.",
        "Tu es coincé{|e} dans un bouchon depuis trois heures. Tu as envie de faire pipi comme jamais dans ta vie. Il te reste une bouteille d'eau vide, {w:object} et ta dignité.",
        "Accident devant, tout est bloqué. Tes intestins viennent d'annoncer une grève générale. Le prochain toilette : une aire d'autoroute connue pour {w:smell}.",
      ],
      en: [
        "A 25-mile traffic jam on the holiday highway. You drank {w:drink} an hour ago. Your bladder is now the size of a football.",
        "Total gridlock, no exit for 15 miles. Your stomach makes {w:sound}. Last night's kebab is demanding its freedom.",
        "You've been stuck in traffic for three hours. You need to pee like never before in your life. You have an empty water bottle, {w:object} and your dignity.",
        "Accident ahead, everything's blocked. Your bowels just declared a general strike. The next toilet: a rest stop famous for {w:smell}.",
      ],
    },
    choices: [
      {
        label: { fr: 'La bouteille', en: 'The bottle' },
        out: [
          { w: 2, text: { fr: ["J'ai rempli la bouteille avec une précision chirurgicale. Le routier dans le camion à côté m'a fait un pouce levé. Respect entre professionnels.", "La bouteille a suffi. De justesse. Je l'ai posée dans le porte-gobelet. Trois heures plus tard, j'ai failli en boire une gorgée en la confondant avec {w:drink}."], en: ["I filled the bottle with surgical precision. The trucker next to me gave a thumbs up. Respect among professionals.", "The bottle was just enough. Barely. I put it in the cup holder. Three hours later, I almost took a sip, mistaking it for {w:drink}."] }, fx: { happy: 4, stress: -4 } },
          { w: 1, text: { fr: ["La bouteille était trop petite. Beaucoup trop petite. Le siège conducteur a tout bu. La voiture dégage maintenant {w:smell}, mais en pire.", "Le bouchon a avancé d'un coup pendant l'opération. J'ai dû passer la première d'une main. Il y a eu des pertes. Le tapis de sol est mort."], en: ["The bottle was too small. Way too small. The driver's seat absorbed the rest. The car now gives off {w:smell}, only worse.", "Traffic suddenly moved mid-operation. I had to shift into first one-handed. There were casualties. The floor mat didn't make it."] }, fx: { happy: -8, looks: -2 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Le fossé', en: 'The ditch' }, text: { fr: ["Je suis sorti{|e} faire ça dans le fossé. Le bouchon a redémarré. J'ai couru après ma voiture, pantalon aux chevilles, sous les klaxons de 400 automobilistes.", "J'ai escaladé la glissière pour me soulager dans les orties. Les orties. Sur l'ensemble de mon intimité. J'ai hurlé jusqu'à Lyon. Le Lyonnais qui m'a pris{|e} en stop a dit « {w:exclaim} »"], en: ["I got out to do it in the ditch. Traffic started moving. I ran after my car, pants around my ankles, while 400 drivers honked.", "I climbed over the guardrail to relieve myself in the nettles. Nettles. Across my entire private area. I screamed for 200 miles. The driver who picked me up hitchhiking said '{w:exclaim}'"] }, fx: { happy: -5, looks: -2, health: -2, fame: 1 } },
      { label: { fr: 'Serrer les dents', en: 'Clench and endure' }, text: { fr: ["J'ai serré tout ce qu'un humain peut serrer pendant 3 h 40. Arrivé{|e} à l'aire, j'ai couru en canard. J'ai eu une révélation spirituelle dans les toilettes turques.", "J'ai tenu. Je ne sais pas comment. Mes reins m'envoient encore des lettres d'insultes. La dernière commençait par « {w:insult} »."], en: ["I clenched everything a human can clench for 3 hours and 40 minutes. At the rest stop, I waddled like a duck. I had a spiritual awakening in a squat toilet.", "I held it. I don't know how. My kidneys still send me hate mail. The latest one started with '{w:insult}'."] }, fx: { health: -3, discipline: 4 } },
    ],
  },
  {
    id: 'dy_parking_duel',
    icon: '🅿️',
    cat: 'daily',
    rating: 1,
    scene: { place: 'park', mood: 'angry', prop: 'car' },
    when: { age: [18, 90], asset: 'car' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Une place libre, la dernière du quartier. Tu mets ton clignotant. Une Twingo arrive en face, clignotant aussi. Vous vous regardez comme deux cow-boys. À la radio : {w:song}.",
        "Ça fait 25 minutes que tu tournes pour te garer. Une place se libère. Au moment où tu manœuvres, quelqu'un s'y engouffre en marche avant, avec un grand sourire.",
        "Une dame s'est plantée debout sur la seule place libre pour la « garder » à son mari. Le mari est encore à trois rues. Elle te fixe sans cligner des yeux, en tenant {w:object} comme une arme.",
        "Tu as trouvé une place ! Elle fait exactement la longueur de ta voiture plus 4 centimètres. Un attroupement se forme pour te regarder faire le créneau. Quelqu'un a même apporté {w:food}.",
      ],
      en: [
        "One free spot, the last in the neighborhood. You signal. A hatchback arrives from the other side, also signaling. You stare at each other like two cowboys. On the radio: {w:song}.",
        "You've been circling for 25 minutes. A spot opens up. As you start reversing in, someone dives in nose-first with a huge grin.",
        "A lady is standing in the only free spot to 'save' it for her husband. The husband is three blocks away. She stares at you without blinking, holding {w:object} like a weapon.",
        "You found a spot! It's exactly the length of your car plus an inch and a half. A small crowd gathers to watch you parallel park. Someone even brought {w:food}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Forcer le passage', en: 'Force my way in' },
        out: [
          { w: 1, text: { fr: ["J'ai avancé centimètre par centimètre. Elle a reculé. J'ai gagné la place, la gloire et une rayure de 40 cm sur mon pare-chocs.", "Je me suis garé{|e} avec une précision de pilote de chasse. La foule a applaudi. Un vieux monsieur a pleuré. Je suis ressorti{|e} par le coffre, avec {w:object}."], en: ["I inched forward. She backed off. I won the spot, the glory and a 16-inch scratch on my bumper.", "I parked with fighter-pilot precision. The crowd applauded. An old man wept. I got out through the trunk, holding {w:object}."] }, fx: { happy: 5, money: -60 }, mood: 'proud' },
          { w: 1, text: { fr: ["Je me suis encastré{|e} dans le poteau. Puis dans la voiture de devant. Puis dans celle de derrière. J'ai fait un strike. Bordel.", "La dame ne bougeait pas. Je non plus. On est restés là quarante minutes. Son mari est arrivé, il s'est garé ailleurs. Pour rien. Il conduisait {w:vehicle}."], en: ["I rammed into the post. Then the car in front. Then the one behind. A strike. Goddammit.", "The lady wouldn't move. Neither did I. We stayed there for forty minutes. Her husband showed up and parked elsewhere. All for nothing. He was driving {w:vehicle}."] }, fx: { happy: -5, money: -180, stress: 6 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Abandonner', en: 'Give up' }, text: { fr: ["J'ai abandonné et je me suis garé{|e} à 2 km, dans une zone industrielle, à côté d'un chien qui gardait une benne. Il m'a fait la bise. Enfin, il m'a léché{|e}.", "J'ai laissé la place. J'ai tourné encore une heure. J'ai fini par rentrer chez moi et prendre le bus pour aller au même endroit, {w:at_place}."], en: ["I gave up and parked a mile away, in an industrial zone, next to a dog guarding a dumpster. He kissed me. Well, licked me.", "I let it go. I circled for another hour. I ended up driving home and taking the bus to the same place, {w:at_place}."] }, fx: { stress: 4, karma: 2 } },
      { label: { fr: 'Négocier', en: 'Negotiate' }, text: { fr: ["J'ai proposé {w:food} contre la place. Elle a accepté. C'était le meilleur échange commercial de ma vie.", "J'ai proposé un pierre-feuille-ciseaux. J'ai perdu trois fois de suite. J'ai demandé le meilleur des cinq. J'ai perdu quand même."], en: ["I offered {w:food} in exchange for the spot. She accepted. Best trade deal of my life.", "I suggested rock-paper-scissors. I lost three times in a row. I asked for best of five. Still lost."] }, fx: { happy: 2 } },
    ],
  },
  {
    id: 'dy_parking_ticket',
    icon: '🧾',
    cat: 'adulting',
    rating: 0,
    vars: { amount: [35, 135] },
    scene: { place: 'park', mood: 'angry', prop: 'ticket' },
    when: { age: [18, 90], asset: 'car', noFlag: 'dy_unpaid_fines' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Tu reviens à ta voiture après 3 minutes. Un PV de {$amount} est coincé sous l'essuie-glace. L'horodateur était en panne. Il y a un mot : « Pas mon problème », et un dessin représentant {w:animal}.",
        "Un avis de contravention arrive par courrier : {$amount} pour un stationnement à un endroit où tu n'es jamais allé{|e}. La photo montre une voiture qui ressemble vaguement à la tienne, de loin, la nuit.",
        "Une contractuelle est en train de verbaliser ta voiture. Tu arrives en courant, clés à la main. Elle te regarde, termine son PV, et te souhaite une bonne journée en mangeant {w:food}.",
        "Troisième amende ce mois-ci : {$amount}. Tu étais garé{|e} sur une place livraison « de 7 h à 7 h 15 le mardi des années bissextiles ».",
      ],
      en: [
        "You return to your car after 3 minutes. A {$amount} ticket is tucked under the wiper. The meter was broken. There's a note: 'Not my problem', with a drawing of {w:animal}.",
        "A ticket arrives in the mail: {$amount} for parking somewhere you've never been. The photo shows a car that vaguely resembles yours, from far away, at night.",
        "A traffic warden is writing a ticket for your car. You run up, keys in hand. She looks at you, finishes the ticket, and wishes you a nice day while eating {w:food}.",
        "Third fine this month: {$amount}. You were parked in a loading zone '7:00 to 7:15 a.m. on Tuesdays of leap years'.",
      ],
    },
    choices: [
      { label: { fr: 'Payer en pleurant', en: 'Pay and cry' }, text: { fr: ["J'ai payé {$amount}. Le site plantait au moment de valider. J'ai payé deux fois. Le remboursement est prévu « sous 6 à 8 ans ».", "J'ai payé l'amende de {$amount} en ligne, en larmes. Le site m'a demandé de noter mon expérience. J'ai mis une étoile. Ils m'ont remercié{|e} pour ma confiance et m'ont offert un bon pour {w:object}."], en: ["I paid {$amount}. The site crashed at checkout. I paid twice. Refund expected 'within 6 to 8 years'.", "I paid the {$amount} fine online, crying. The site asked me to rate my experience. I gave one star. They thanked me for my trust and gave me a voucher for {w:object}."] }, fx: { money: '-amount', happy: -3 } },
      {
        label: { fr: 'Contester', en: 'Contest it' },
        out: [
          { w: 1, odds: { smarts: 2 }, text: { fr: ["J'ai rédigé une contestation de 6 pages avec photos, plans et une citation de Victor Hugo. Amende annulée. J'ai fait une petite danse dans la cuisine.", "J'ai prouvé que j'étais {w:at_place} à l'heure du PV, ticket de caisse à l'appui. Annulée. La justice existe, parfois, le mardi."], en: ["I wrote a 6-page appeal with photos, maps and a Victor Hugo quote. Fine cancelled. I did a little dance in the kitchen.", "I proved I was {w:at_place} at the time, receipt as evidence. Cancelled. Justice exists, sometimes, on Tuesdays."] }, fx: { happy: 6, smarts: 2 }, mood: 'proud' },
          { w: 2, text: { fr: ["Contestation rejetée. L'amende est passée à {$amount} plus une « majoration ». J'ai payé. J'ai appris le mot « majoration ».", "Ma contestation a été « classée ». Je ne sais pas ce que ça veut dire. L'amende a doublé. J'ai payé {$amount} et mon âme. Ensuite, je me suis consolé{|e} avec {w:food}."], en: ["Appeal rejected. The fine went up by a 'surcharge'. I paid {$amount}. I learned the word 'surcharge'.", "My appeal was 'filed'. I don't know what that means. The fine doubled. I paid {$amount} and my soul. Then I consoled myself with {w:food}."] }, fx: { money: '-amount', happy: -5, stress: 4 } },
        ],
      },
      { label: { fr: "L'ignorer", en: 'Ignore it' }, text: { fr: ["J'ai jeté le PV dans la boîte à gants avec les autres. Elle ne ferme plus. Ça va bien finir.", "J'ai décidé que ce PV n'existait pas. J'ai fait pareil avec les relances. Ignorer les problèmes, c'est ma méthode depuis toujours, avec {w:hobby}."], en: ["I threw the ticket in the glovebox with the others. It doesn't close anymore. This will end well.", "I decided this ticket didn't exist. Same with the reminders. Ignoring problems has always been my method, along with {w:hobby}."] }, fx: { stress: -2, flag: 'dy_unpaid_fines', schedule: { key: 'dy_bailiff', years: 1 } } },
    ],
  },
  {
    id: 'dy_bailiff',
    icon: '⚖️',
    cat: 'adulting',
    rating: 1,
    chainOnly: true,
    vars: { amount: [600, 2400] },
    scene: { place: 'home', mood: 'shock', prop: 'letter' },
    when: { age: [18, 99], flag: 'dy_unpaid_fines' },
    text: {
      fr: [
        "On sonne. Un huissier en costume gris, une liste à la main. Tes PV ignorés ont fait des petits : {$amount}. Il regarde déjà ta télé et {w:object} avec intérêt.",
        "Lettre recommandée : « Avis de saisie ». Tes amendes impayées s'élèvent maintenant à {$amount}. Les intérêts ont des intérêts. Tes intérêts ont eu des enfants.",
        "Un huissier sonne à ta porte à 7 h du matin. Il s'appelle Maître Gobert, il a une moustache de huissier et il veut {$amount}. Il propose aussi d'emporter {w:object}.",
        "Ton salaire a été saisi. Tes PV de stationnement sont revenus te hanter sous forme de facture : {$amount}. Le courrier se termine par « Cordialement ». Cordialement !",
      ],
      en: [
        "Doorbell. A bailiff in a gray suit, list in hand. Your ignored tickets have multiplied: {$amount}. He's already eyeing your TV and {w:object}.",
        "Certified letter: 'Notice of seizure'. Your unpaid fines now total {$amount}. The interest has interest. Your interest has had children.",
        "A bailiff rings at 7 a.m. His name is Mr. Gobert, he has a bailiff mustache and he wants {$amount}. He also offers to take {w:object}.",
        "Your wages have been garnished. Your parking tickets came back to haunt you as a bill: {$amount}. The letter ends with 'Kind regards'. Kind regards!",
      ],
    },
    choices: [
      { label: { fr: 'Payer tout', en: 'Pay it all' }, text: { fr: ["J'ai tout payé : {$amount}. L'huissier m'a serré la main. Sa main était froide comme le cœur de l'État.", "J'ai réglé {$amount} d'un coup. Mon compte en banque a émis un petit cri. Je ne me garerai plus jamais nulle part. Je me suis acheté {w:vehicle}."], en: ["I paid it all: {$amount}. The bailiff shook my hand. His hand was cold as the heart of the State.", "I paid {$amount} in one go. My bank account let out a little scream. I'll never park anywhere again. I bought myself {w:vehicle}."] }, fx: { money: '-amount', happy: -6, unflag: 'dy_unpaid_fines' } },
      {
        label: { fr: 'Faire le mort', en: 'Play dead' },
        out: [
          { w: 1, text: { fr: ["Je me suis allongé{|e} par terre et j'ai fait le mort. L'huissier a attendu dix minutes, a pris ma télé et est parti. Bon.", "Je n'ai pas ouvert. Il a glissé un papier sous la porte. Puis il est entré avec un serrurier. Il a pris la télé, le canapé et {w:object}."], en: ["I lay on the floor and played dead. The bailiff waited ten minutes, took my TV and left. Okay.", "I didn't open. He slid a paper under the door. Then came in with a locksmith. He took the TV, the couch and {w:object}."] }, fx: { money: '-amount', happy: -8, unflag: 'dy_unpaid_fines' }, mood: 'sad' },
          { w: 1, text: { fr: ["J'ai fait le mort si bien que l'huissier a appelé le SAMU. Dans la confusion, le dossier a été perdu. Le système est aussi bordélique que moi.", "Je me suis caché{|e} dans le placard pendant deux heures. Il est reparti. Le dossier a été transmis à un autre huissier, qui est parti à la retraite {w:far_place}. Classé."], en: ["I played dead so well that the bailiff called an ambulance. In the confusion, the file got lost. The system is as messy as I am.", "I hid in the closet for two hours. He left. The file went to another bailiff, who retired {w:far_place}. Case closed."] }, fx: { happy: 6, karma: -3, unflag: 'dy_unpaid_fines' }, mood: 'proud' },
        ],
      },
    ],
  },
  {
    id: 'dy_speed_camera',
    icon: '📸',
    cat: 'daily',
    rating: 0,
    vars: { amount: [45, 135] },
    scene: { place: 'park', mood: 'shock', prop: 'camera' },
    when: { age: [18, 90], asset: 'car' },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "Flash ! Un radar planqué derrière un panneau publicitaire. Tu roulais à 54 au lieu de 50. Tu avais la bouche ouverte, le doigt dans le nez et {w:song} à fond.",
        "Tu reçois la photo du radar par courrier : {$amount} d'amende. Sur l'image, tu chantes à tue-tête avec une grimace digne d'un tableau de Munch.",
        "Flashé{|e} en plein bâillement. La photo est tellement moche qu'elle pourrait servir de preuve dans un procès contre ta propre tête. Heure indiquée : {w:time}.",
        "Un radar mobile t'a flashé{|e}. Sur la photo, on voit aussi clairement {w:animal} sur le siège passager. Tu n'as pas d'animal.",
      ],
      en: [
        "Flash! A speed camera hidden behind a billboard. You were doing 34 in a 30. Your mouth was open, your finger was up your nose and {w:song} was blasting.",
        "You get the speed camera photo in the mail: {$amount} fine. In the picture, you're belting out a song with a face worthy of Munch's Scream.",
        "Flashed mid-yawn. The photo is so ugly it could be used as evidence in a lawsuit against your own face. Timestamp: {w:time}.",
        "A mobile speed camera flashed you. The photo also clearly shows {w:animal} in the passenger seat. You don't own an animal.",
      ],
    },
    choices: [
      { label: { fr: 'Payer et encadrer', en: 'Pay and frame it' }, text: { fr: ["J'ai payé {$amount} et commandé un tirage de la photo. Elle est dans mon salon. C'est la plus authentique jamais prise de moi.", "J'ai payé. J'ai mis la photo du radar en photo de profil. Mon taux de match a augmenté. Les gens aiment la vérité. Mon premier match : quelqu'un qui pratique {w:hobby}."], en: ["I paid {$amount} and ordered a print of the photo. It's in my living room. Most authentic picture ever taken of me.", "I paid. I made the speed camera photo my profile picture. My match rate went up. People love authenticity. My first match: someone into {w:hobby}."] }, fx: { money: '-amount', happy: 2 } },
      {
        label: { fr: 'Accuser quelqu\'un', en: 'Blame someone else' },
        out: [
          { w: 1, text: { fr: ["J'ai désigné mon cousin comme conducteur. Il a désigné son voisin. Le voisin a désigné le cousin. L'administration a abandonné, épuisée.", "J'ai écrit que c'était mon jumeau maléfique. Je n'ai pas de jumeau. Ils n'ont pas vérifié. J'ai fêté ça avec {w:drink}."], en: ["I named my cousin as the driver. He named his neighbor. The neighbor named my cousin. The administration gave up, exhausted.", "I wrote that it was my evil twin. I don't have a twin. They didn't check. I celebrated with {w:drink}."] }, fx: { happy: 5, karma: -3 } },
          { w: 1, text: { fr: ["J'ai accusé mon père. Il a perdu un point de permis. Il ne m'a toujours pas pardonné, et il me le rappelle à chaque repas de famille.", "On m'a demandé de prouver que ce n'était pas moi. Sur la photo, c'était manifestement moi. J'ai payé {$amount}, plus une amende pour mensonge. Le juge mangeait {w:food}."], en: ["I blamed my dad. He lost a license point. He still hasn't forgiven me, and brings it up at every family dinner.", "They asked me to prove it wasn't me. In the photo, it was obviously me. I paid {$amount}, plus a fine for lying. The judge was eating {w:food}."] }, fx: { money: '-amount', happy: -4, karma: -2 } },
        ],
      },
    ],
  },
  // ───────────────────────────── administration & services ─────────────────────────────
  {
    id: 'dy_admin_appointment',
    icon: '🏛️',
    cat: 'adulting',
    rating: 0,
    scene: { place: 'office', mood: 'sleepy', prop: 'laptop' },
    when: { age: [18, 90] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: [
        "Il te faut un rendez-vous en préfecture pour renouveler un papier. Le site affiche : « Aucun créneau disponible. Réessayez plus tard. » Depuis trois semaines. Les créneaux se libèrent, paraît-il, à 4 h 12 du matin.",
        "Le formulaire en ligne te demande ton numéro de dossier. Pour obtenir un numéro de dossier, il faut remplir le formulaire. Le site plante. Tu recommences {w:time}.",
        "Au guichet de la mairie, on t'explique qu'il manque une pièce : « une photocopie de la photocopie ». La dame ferme son guichet à 11 h 58 en te regardant, et sort {w:food}.",
        "Le service public t'a envoyé un courrier pour te dire de consulter ton espace en ligne, où un message te dit de consulter ton courrier. Tu as commencé à tourner en rond {w:time}. Tu tournes encore.",
      ],
      en: [
        "You need an appointment at the government office to renew a document. The site says: 'No slots available. Try again later.' For three weeks now. Slots supposedly open at 4:12 a.m.",
        "The online form asks for your case number. To get a case number, you need to fill out the form. The site crashes. You start over {w:time}.",
        "At the town hall counter, they explain you're missing one document: 'a photocopy of the photocopy'. The lady closes her window at 11:58 while staring at you, and pulls out {w:food}.",
        "The government sent you a letter telling you to check your online account, where a message tells you to check your mail. You started going in circles {w:time}. You're still going.",
      ],
    },
    choices: [
      {
        label: { fr: 'Réveil à 4 h du matin', en: 'Set an alarm for 4 a.m.' },
        out: [
          { w: 1, odds: { discipline: 2 }, text: { fr: ["Réveil à 4 h 10, clic à 4 h 12 et 3 secondes. J'ai eu le créneau ! J'ai crié si fort que le voisin a appelé la police. Ça valait le coup.", "À force de rafraîchir la page à l'aube, j'ai décroché un rendez-vous. Il est dans onze mois, à 8 h, {w:at_place}. Victoire."], en: ["Alarm at 4:10, clicked at 4:12 and 3 seconds. I got a slot! I screamed so loud the neighbor called the cops. Worth it.", "By refreshing at dawn, I snagged an appointment. It's in eleven months, at 8 a.m., {w:at_place}. Victory."] }, fx: { happy: 5, discipline: 2, health: -2 }, mood: 'proud' },
          { w: 1, text: { fr: ["Je me suis réveillé{|e} à 4 h. Le site était en maintenance jusqu'à 6 h. À 6 h, plus rien. Je me suis rendormi{|e} sur mon clavier et j'ai commandé, par erreur, {w:object}.", "Quatre nuits blanches de suite. J'ai fini par rêver de la page de connexion. Dans mon rêve aussi, il n'y avait aucun créneau."], en: ["I woke up at 4. The site was down for maintenance until 6. At 6, nothing. I fell asleep on my keyboard and accidentally ordered {w:object}.", "Four sleepless nights in a row. I ended up dreaming of the login page. In my dream, there were no slots either."] }, fx: { health: -4, stress: 6, happy: -3 }, mood: 'sleepy' },
        ],
      },
      { label: { fr: 'Camper devant', en: 'Camp outside' }, text: { fr: ["J'ai campé devant la préfecture avec une thermos et un tabouret. J'étais douzième. À 9 h, ils ont annoncé que le service était fermé pour « mouvement social ».", "J'ai dormi sur le trottoir devant la mairie. Le matin, j'avais un numéro, un rhume et trois nouveaux amis qui attendaient eux aussi depuis 2019. L'un d'eux faisait griller {w:food}."], en: ["I camped outside the office with a thermos and a stool. I was twelfth in line. At 9 a.m. they announced the office was closed due to a 'strike'.", "I slept on the sidewalk outside the town hall. In the morning I had a ticket number, a cold and three new friends who'd also been waiting since 2019. One of them was grilling {w:food}."] }, fx: { health: -3, happy: -2, stress: 3 } },
      { label: { fr: 'Abandonner ce papier', en: 'Give up on the paperwork' }, text: { fr: ["J'ai décidé que je n'avais pas besoin de ce papier. Je vis désormais en dehors du système, comme un hors-la-loi. Un hors-la-loi qui ne peut pas louer de voiture.", "J'ai laissé tomber. Le papier a expiré. Techniquement, je n'existe plus pour l'État. C'est assez reposant. J'ai fêté ça {w:at_place}."], en: ["I decided I didn't need that document. I now live outside the system, like an outlaw. An outlaw who can't rent a car.", "I gave up. The document expired. Technically I no longer exist for the State. It's quite relaxing. I celebrated {w:at_place}."] }, fx: { stress: -4, smarts: -1 } },
    ],
  },
  {
    id: 'dy_tax_form',
    icon: '📑',
    cat: 'adulting',
    rating: 1,
    vars: { amount: [150, 1800] },
    scene: { place: 'home', mood: 'shock', prop: 'laptop' },
    when: { age: [20, 90], job: true },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Déclaration d'impôts. Case 7UF : « Dépenses de travaux sur un bien rural acquis avant la Révolution ». Tu ne sais pas si tu es concerné{|e}. Personne ne le sait.",
        "Le simulateur fiscal affiche que tu dois {$amount}. Tu cliques sur « Corriger ». Il affiche que tu dois le double. Tu as peur de cliquer encore. Tu te sers {w:drink}.",
        "Tu passes ta soirée à remplir ta déclaration en buvant {w:drink}. Il est 1 h du matin, tu as coché « personne à charge » pour ton aspirateur robot.",
        "Le formulaire des impôts te demande de déclarer tes « revenus exceptionnels ». Tu as vendu {w:object} en ligne pour 12 €. Est-ce de la fraude ? Ta main tremble.",
      ],
      en: [
        "Tax return time. Box 7UF: 'Renovation expenses on a rural property acquired before the Revolution'. You don't know if it applies to you. Nobody knows.",
        "The tax simulator says you owe {$amount}. You click 'Correct'. Now it says you owe double. You're scared to click again. You pour yourself {w:drink}.",
        "You spend the evening doing your taxes while drinking {w:drink}. It's 1 a.m. and you've listed your robot vacuum as a dependent.",
        "The tax form asks you to declare 'exceptional income'. You sold {w:object} online for $12. Is that fraud? Your hand is shaking.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire honnêtement', en: 'Do it honestly' },
        out: [
          { w: 2, text: { fr: ["J'ai tout déclaré honnêtement. Résultat : remboursement de {$amount}. Je me suis senti{|e} comme un citoyen modèle. J'ai acheté un drapeau.", "Je me suis trompé{|e} en ma faveur sans le vouloir. L'État m'a remboursé {$amount}. Je n'ai rien dit. Je dors très bien. J'ai acheté {w:object} avec."], en: ["I declared everything honestly. Result: a {$amount} refund. I felt like a model citizen. I bought a flag.", "I accidentally made a mistake in my favor. The government refunded me {$amount}. I said nothing. I sleep just fine. I bought {w:object} with it."] }, fx: { money: 'amount', happy: 6 }, mood: 'happy' },
          { w: 2, text: { fr: ["J'ai tout bien rempli. Je dois {$amount}. L'honnêteté, c'est surfait, putain.", "Honnête jusqu'au bout. Rappel d'impôt de {$amount}. Le courrier commençait par « Bonne nouvelle ! ». Les sadiques. J'ai hurlé « {w:swear} »"], en: ["I filled it all in properly. I owe {$amount}. Honesty is overrated, dammit.", "Honest to the end. Back taxes of {$amount}. The letter started with 'Good news!'. Sadists. I screamed '{w:swear}'"] }, fx: { money: '-amount', happy: -5 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Arranger les chiffres', en: 'Get creative with numbers' },
        out: [
          { w: 2, text: { fr: ["J'ai déclaré mon chat comme assistant de direction. C'est passé. {$amount} d'économie. Le chat réclame une augmentation.", "J'ai « oublié » quelques lignes. Personne n'a rien vu. J'ai économisé {$amount} et gagné un ulcère. Je l'ai noyé dans {w:drink}."], en: ["I declared my cat as an executive assistant. It went through. {$amount} saved. The cat is asking for a raise.", "I 'forgot' a few lines. Nobody noticed. I saved {$amount} and gained an ulcer. I drowned it in {w:drink}."] }, fx: { money: 'amount', karma: -5, stress: 4 } },
          { w: 1, text: { fr: ["Contrôle fiscal. Le contrôleur a ri en voyant que j'avais déduit {w:object} comme « frais professionnel ». Puis il a arrêté de rire.", "Un inspecteur des impôts m'a convoqué{|e}. Il avait mon dossier, mes relevés et une photo de mon chat « assistant ». Je vais devoir m'expliquer devant un juge."], en: ["Tax audit. The auditor laughed when he saw I'd deducted {w:object} as a 'business expense'. Then he stopped laughing.", "A tax inspector summoned me. He had my file, my statements and a photo of my 'assistant' cat. I'll have to explain myself to a judge."] }, fx: { arrest: 'taxfraud', stress: 10, visual: 'police' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Payer un comptable', en: 'Hire an accountant' }, text: { fr: ["J'ai payé un comptable 200 €. Il a passé 4 minutes sur mon dossier, m'a dit « c'est simple » et m'a facturé 200 € de plus pour la consultation.", "Mon comptable m'a fait économiser 300 €. Il m'en a facturé 400. Il dit que c'est « un investissement dans ma sérénité ». Il m'a offert {w:gift}."], en: ["I paid an accountant $200. He spent 4 minutes on my file, said 'it's simple' and charged me $200 more for the consultation.", "My accountant saved me $300. He charged me $400. He says it's 'an investment in my peace of mind'. He gave me {w:gift}."] }, fx: { money: -250, stress: -5 } },
    ],
  },
  {
    id: 'dy_bank_advisor',
    icon: '🏦',
    cat: 'adulting',
    rating: 0,
    vars: { amount: [60, 300] },
    scene: { place: 'office', mood: 'neutral', prop: 'desk' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Ta conseillère bancaire te convoque « pour faire le point ». En dix minutes, elle essaie de te vendre une assurance pour ton téléphone, ta voiture et {w:animal}. Tu n'as pas d'animal.",
        "Ton nouveau conseiller bancaire a 22 ans, un costume trop grand et un objectif de vente à atteindre avant midi. Il te propose un « pack sérénité premium » à {$amount} par an, avec en cadeau {w:gift}.",
        "Rendez-vous à la banque. Le conseiller tape sur son clavier pendant quinze minutes sans rien dire, soupire, et te dit : « Ah. Vous. »",
        "Ta banque t'appelle pour te proposer un crédit pour acheter {w:object}. Tu n'as rien demandé. Ils insistent. Ils ont l'air de savoir des choses.",
      ],
      en: [
        "Your bank advisor calls you in 'for a review'. In ten minutes, she tries to sell you insurance for your phone, your car and {w:animal}. You don't own an animal.",
        "Your new bank advisor is 22, wears an oversized suit and has a sales target to hit by noon. He offers you a 'premium peace-of-mind bundle' at {$amount} a year, with {w:gift} thrown in.",
        "Appointment at the bank. The advisor types for fifteen minutes in silence, sighs, and says: 'Ah. You.'",
        "Your bank calls to offer you a loan to buy {w:object}. You didn't ask for anything. They insist. They seem to know things.",
      ],
    },
    choices: [
      { label: { fr: 'Tout signer', en: 'Sign everything' }, text: { fr: ["J'ai tout signé pour qu'on me laisse partir. Je suis maintenant assuré{|e} contre les chutes de météorites et l'enlèvement extraterrestre. {$amount} par an.", "J'ai signé sans lire. J'ai apparemment souscrit une assurance obsèques. Au moins, le cercueil est réglé. La musique de l'enterrement sera {w:song}."], en: ["I signed everything just to be allowed to leave. I'm now insured against meteorite strikes and alien abduction. {$amount} a year.", "I signed without reading. Apparently I took out funeral insurance. At least the coffin is sorted. The funeral song will be {w:song}."] }, fx: { money: '-amount', stress: -2 } },
      {
        label: { fr: 'Négocier les frais', en: 'Negotiate the fees' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai menacé de partir à la concurrence. Le conseiller a pâli, a passé un coup de fil et m'a supprimé tous les frais. J'ai l'impression d'avoir braqué une banque légalement.", "J'ai négocié comme au souk. J'ai obtenu la carte gratuite, les frais annulés et un stylo. Le stylo ne marche pas, mais c'est symbolique. Il est décoré d'un logo {w:brand}."], en: ["I threatened to switch banks. The advisor went pale, made a call and waived all my fees. I feel like I robbed a bank legally.", "I haggled like at a bazaar. I got a free card, waived fees and a pen. The pen doesn't work, but it's symbolic. It has a {w:brand} logo."] }, fx: { money: 'amount', happy: 5 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai demandé une baisse des frais. Il a ri. Puis il m'a facturé des frais de « demande de baisse des frais ».", "J'ai tenté de négocier. Il a tapé sur son clavier, a froncé les sourcils et m'a annoncé que j'avais déjà un découvert. Fin de la négociation. Motif du découvert : {w:object}."], en: ["I asked for lower fees. He laughed. Then he charged me a 'fee reduction request fee'.", "I tried to negotiate. He typed, frowned, and announced I was already overdrawn. End of negotiation. Reason for the overdraft: {w:object}."] }, fx: { money: -20, happy: -3 } },
        ],
      },
      { label: { fr: 'Partir en courant', en: 'Run away' }, text: { fr: ["Je suis parti{|e} en prétextant un rendez-vous chez le dentiste. J'ai couru jusqu'à la sortie. Le conseiller m'a rappelé{|e} six fois dans la journée.", "Je me suis enfui{|e} par la porte de secours. L'alarme s'est déclenchée. Ils ont cru à un braquage. On m'a reconnu{|e} à mes chaussures. Et à mon sac, qui contenait {w:object}."], en: ["I left, claiming a dentist appointment. I ran to the exit. The advisor called me back six times that day.", "I fled through the emergency exit. The alarm went off. They thought it was a robbery. They identified me by my shoes. And my bag, which contained {w:object}."] }, fx: { stress: 2, happy: 2 } },
    ],
  },
  {
    id: 'dy_absent_notice',
    icon: '📦',
    cat: 'adulting',
    rating: 0,
    scene: { place: 'apartment', mood: 'angry', prop: 'parcel' },
    when: { age: [18, 90] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: [
        "Tu es resté{|e} chez toi toute la journée pour attendre ton colis. Tu trouves un avis de passage dans ta boîte : « Destinataire absent ». La sonnette marche. Tu l'as testée {w:time}.",
        "« Votre colis a été déposé en point relais. » Le point relais se trouve {w:at_place}, à 6 km, et n'ouvre que le jeudi de 14 h à 14 h 30.",
        "Le livreur a laissé un avis de passage à 10 h 03. Tu étais derrière la porte à 10 h 02, en caleçon, prêt{|e}. Il n'a même pas sonné. Il a juste glissé le papier et fui.",
        "Ton colis est « en cours de livraison » depuis 11 jours. Le suivi indique qu'il est passé par Dubaï, Lille puis {w:at_place}. Il contient {w:object}.",
      ],
      en: [
        "You stayed home all day to wait for your package. You find a slip in your mailbox: 'Recipient absent'. The doorbell works. You tested it {w:time}.",
        "'Your package has been left at a pickup point.' The pickup point is {w:at_place}, 4 miles away, open Thursdays from 2:00 to 2:30 p.m.",
        "The courier left a missed-delivery slip at 10:03. You were behind the door at 10:02, in your underwear, ready. He didn't even ring. He just slid the paper in and fled.",
        "Your package has been 'out for delivery' for 11 days. The tracking says it went through Dubai, Lille and then {w:at_place}. It contains {w:object}.",
      ],
    },
    choices: [
      { label: { fr: 'Aller au point relais', en: 'Go to the pickup point' }, text: { fr: ["Je suis allé{|e} au point relais. 45 minutes de queue derrière des gens qui renvoyaient des robes. On m'a donné le colis de quelqu'un d'autre : {w:object}. Je l'ai gardé.", "J'ai traversé la ville pour le récupérer. Le commerçant a cherché vingt minutes, puis l'a trouvé : il s'en servait comme tabouret."], en: ["I went to the pickup point. 45-minute line behind people returning dresses. They gave me someone else's package: {w:object}. I kept it.", "I crossed town to get it. The shopkeeper searched for twenty minutes, then found it: he was using it as a stool."] }, fx: { stress: 3, happy: 1 } },
      {
        label: { fr: 'Appeler le transporteur', en: 'Call the courier company' },
        out: [
          { w: 1, text: { fr: ["Après 47 minutes de musique d'attente, une personne réelle m'a répondu. Elle a ri. Puis elle a raccroché. Le colis est arrivé le lendemain, ouvert, à moitié vide.", "J'ai appelé. Le serveur vocal m'a demandé de dire mon numéro de suivi. Il a compris « commander une pizza ». Une pizza est arrivée. Pas le colis. Le colis, c'était {w:object}."], en: ["After 47 minutes of hold music, an actual human answered. She laughed. Then hung up. The package arrived the next day, opened, half empty.", "I called. The voice system asked me to say my tracking number. It understood 'order a pizza'. A pizza arrived. Not the package. The package was {w:object}."] }, fx: { stress: 5, happy: -2 } },
          { w: 1, text: { fr: ["J'ai été si poli{|e} au téléphone que l'opératrice a pleuré. Elle a personnellement traversé la ville pour me livrer. On s'écrit encore.", "Un miracle : le transporteur a reprogrammé la livraison. Le livreur a sonné, m'a tendu le colis et m'a dit « désolé ». J'ai cru à une caméra cachée présentée par {w:celeb}."], en: ["I was so polite on the phone that the operator cried. She personally crossed town to deliver it. We still text.", "A miracle: the courier rescheduled. The driver rang, handed me the package and said 'sorry'. I thought it was a hidden camera show hosted by {w:celeb}."] }, fx: { happy: 5, karma: 2 }, mood: 'happy' },
        ],
      },
      { label: { fr: 'Guetter à la fenêtre', en: 'Stake out the window' }, text: { fr: ["J'ai passé la journée suivante collé{|e} à la fenêtre comme un sniper. J'ai vu le livreur se garer, regarder ma porte et repartir. J'ai couru en chaussettes jusqu'au bout de la rue. Je l'ai eu.", "J'ai monté la garde derrière le rideau. J'ai vu passer le facteur, deux chats et un voisin qui fouillait ma poubelle. Pas de livreur. Mais j'ai des infos sur le voisin : il pratique {w:hobby} en slip."], en: ["I spent the next day glued to the window like a sniper. I saw the driver park, look at my door and leave. I ran down the street in my socks. I got him.", "I stood guard behind the curtain. I saw the mailman, two cats and a neighbor going through my trash. No courier. But I've got dirt on the neighbor: he does {w:hobby} in his underwear."] }, fx: { athletic: 1, stress: 2, happy: 2 } },
    ],
  },
  {
    id: 'dy_chatbot_loop',
    icon: '🤖',
    cat: 'adulting',
    rating: 1,
    vars: { amount: [30, 250] },
    scene: { place: 'home', mood: 'angry', prop: 'phone' },
    when: { age: [18, 90] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: [
        "Ton opérateur t'a facturé {$amount} en trop. Le service client est un chatbot nommé « Léa ». Léa ne comprend rien. Léa te propose de « consulter la FAQ ». Puis elle te recommande {w:movie}.",
        "« Bonjour ! Je suis votre assistant virtuel 😊 Comment puis-je vous aider ? » Tu expliques ton problème. « Je n'ai pas compris. Sujet suggéré : {w:object}. »",
        "Serveur vocal : « Pour un problème de facture, tapez 1. Pour une panne, tapez 2. Pour entendre le bruit de la mer, tapez 3. » Il n'y a pas d'option « parler à un humain ». La musique d'attente : {w:song}.",
        "Le chatbot de ta banque t'a répondu « Je comprends votre frustration 😊 » onze fois. Il t'a aussi proposé un crédit. Ton problème, c'est qu'on t'a débité {$amount} deux fois.",
      ],
      en: [
        "Your phone company overcharged you {$amount}. Customer service is a chatbot called 'Lea'. Lea understands nothing. Lea suggests you 'check the FAQ'. Then she recommends {w:movie}.",
        "'Hi! I'm your virtual assistant 😊 How can I help?' You explain your problem. 'I didn't understand. Suggested topic: {w:object}.'",
        "Phone menu: 'For a billing issue, press 1. For an outage, press 2. To hear the sound of the ocean, press 3.' There's no 'speak to a human' option. The hold music: {w:song}.",
        "Your bank's chatbot has replied 'I understand your frustration 😊' eleven times. It also offered you a loan. Your problem is that you were charged {$amount} twice.",
      ],
    },
    choices: [
      {
        label: { fr: 'Hurler « CONSEILLER »', en: "Scream 'AGENT'" },
        out: [
          { w: 1, text: { fr: ["J'ai hurlé « CONSEILLER » 34 fois. Un humain a fini par décrocher. Il s'appelait Kevin, il était en pause, il m'a remboursé{|e} {$amount} pour que j'arrête de crier.", "« CONSEILLER ! CONSEILLER ! » Le robot a craqué. Il m'a transféré{|e} à un humain qui m'a remboursé{|e} {$amount} et m'a confié qu'il détestait aussi le robot. Il m'a conseillé {w:show} pour me détendre."], en: ["I screamed 'AGENT' 34 times. A human finally picked up. His name was Kevin, he was on break, and he refunded me {$amount} so I'd stop yelling.", "'AGENT! AGENT!' The robot cracked. It transferred me to a human who refunded {$amount} and confessed he also hates the robot. He recommended {w:show} to unwind."] }, fx: { money: 'amount', happy: 4, stress: -2 }, mood: 'proud' },
          { w: 2, text: { fr: ["« Je n'ai pas compris votre demande. Souhaitez-vous souscrire à notre offre fibre ? » J'ai crié « {w:insult} ! » dans le combiné. Il a répondu « Avec plaisir 😊 ».", "Au bout d'une heure, le robot m'a dit « Au revoir » et a raccroché. Je suis resté{|e} avec le téléphone dans la main, comme un veuf."], en: ["'I didn't understand your request. Would you like to subscribe to our fiber deal?' I yelled '{w:insult}!' into the phone. It replied 'With pleasure 😊'.", "After an hour, the robot said 'Goodbye' and hung up. I sat there holding the phone like a widow."] }, fx: { stress: 7, happy: -4 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Draguer le chatbot', en: 'Flirt with the chatbot' }, text: { fr: ["J'ai dit au chatbot qu'il avait une jolie syntaxe. Il a buggé, puis m'a remboursé{|e} {$amount} et envoyé un cœur. On est ensemble, maintenant. Je crois.", "J'ai fait du charme à Léa. Elle a répondu « Je suis une IA, mais merci 😊 ». Puis elle m'a offert un mois gratuit. Le romantisme n'est pas mort. Elle m'a envoyé {w:song} en pièce jointe."], en: ["I told the chatbot it had lovely syntax. It glitched, then refunded {$amount} and sent a heart. We're together now. I think.", "I flirted with Lea. She replied 'I'm an AI, but thank you 😊'. Then she gave me a free month. Romance isn't dead. She sent me {w:song} as an attachment."] }, fx: { money: 'amount', happy: 5 } },
      { label: { fr: 'Résilier par lettre', en: 'Cancel by mail' }, text: { fr: ["J'ai envoyé une lettre recommandée de résiliation. Ils l'ont perdue. J'en ai envoyé une autre. Ils m'ont envoyé une offre de fidélité. Je suis piégé{|e} à vie.", "J'ai résilié par courrier. Ils m'ont facturé {$amount} de « frais de résiliation » et le mois suivant, « par erreur ». Les mêmes, quoi. J'ai crié « {w:insult} » à ma boîte aux lettres."], en: ["I sent a certified cancellation letter. They lost it. I sent another. They sent me a loyalty offer. I'm trapped for life.", "I cancelled by mail. They charged me {$amount} in 'cancellation fees', plus the following month 'by mistake'. Of course. I yelled '{w:insult}' at my mailbox."] }, fx: { money: '-amount', stress: 3 } },
    ],
  },
  // ───────────────────────────── magasins ─────────────────────────────
  {
    id: 'dy_ikea_maze',
    icon: '🧭',
    cat: 'daily',
    rating: 0,
    vars: { amount: [80, 400] },
    scene: { place: 'apartment', mood: 'shock', prop: 'lamp' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Tu es entré{|e} dans le magasin de meubles suédois il y a quatre heures. Tu suis les flèches au sol. Tu repasses devant le même canapé pour la sixième fois. Il s'appelle KLÜMPF. Il te connaît. Ton cabas contient déjà {w:object} et 47 bougies.",
        "Perdu{|e} dans le labyrinthe du magasin suédois. Ton téléphone n'a plus de réseau. Une famille te croise en pleurant. Ils sont là depuis mardi. Le père serre contre lui {w:object}.",
        "Tu cherches la sortie du magasin de meubles. Un raccourci te mène au rayon bougies, puis au rayon bougies, puis au rayon bougies. Il flotte {w:smell}.",
        "Tu voulais juste un tapis. Tu es maintenant au restaurant du magasin, assis{|e} devant 24 boulettes, sans savoir comment tu es arrivé{|e} là ni depuis combien de temps.",
      ],
      en: [
        "You entered the Swedish furniture store four hours ago. You're following the arrows on the floor. You pass the same sofa for the sixth time. It's called KLÜMPF. It knows you. Your bag already holds {w:object} and 47 candles.",
        "Lost in the Swedish store labyrinth. No cell signal. A family walks past you, crying. They've been here since Tuesday. The dad clutches {w:object}.",
        "You're looking for the furniture store exit. A shortcut leads you to the candle aisle, then the candle aisle, then the candle aisle. There's {w:smell} in the air.",
        "You just wanted a rug. You are now in the store restaurant, seated before 24 meatballs, with no idea how you got here or how long it's been.",
      ],
    },
    choices: [
      { label: { fr: 'Suivre les flèches', en: 'Follow the arrows' }, text: { fr: ["J'ai suivi les flèches avec foi. Je suis ressorti{|e} trois heures plus tard avec {$amount} de bougies, un ficus et un caddie qui ne tourne qu'à gauche.", "J'ai fait confiance aux flèches. Elles m'ont mené{|e} à la caisse. J'ai payé {$amount} pour des choses dont je ne connais ni le nom ni l'usage, parmi lesquelles {w:object}."], en: ["I followed the arrows faithfully. I came out three hours later with {$amount} of candles, a ficus and a cart that only turns left.", "I trusted the arrows. They led me to the checkout. I paid {$amount} for things whose names and purposes I don't know, including {w:object}."] }, fx: { money: '-amount', happy: 2 } },
      {
        label: { fr: 'Vivre dans le showroom', en: 'Live in the showroom' },
        out: [
          { w: 2, text: { fr: ["Je me suis installé{|e} dans la chambre témoin « LÖNSBRÜK ». J'y ai dormi deux nuits. Le vigile m'a apporté un café. On a fait la cuisine ensemble dans le rayon cuisines.", "J'ai vécu un week-end entier dans le showroom. Meilleur appart que le mien. Des clients ont essayé mon lit pendant que je dormais dedans. Un couple y a mangé {w:food}."], en: ["I moved into the 'LÖNSBRÜK' model bedroom. Slept there two nights. The security guard brought me coffee. We cooked together in the kitchen department.", "I lived an entire weekend in the showroom. Better apartment than mine. Customers tested my bed while I was sleeping in it. A couple ate {w:food} in it."] }, fx: { happy: 6, stress: -4 }, mood: 'happy' },
          { w: 1, text: { fr: ["Le vigile m'a trouvé{|e} à 3 h du matin en pyjama dans un lit superposé. Il a appelé la police. J'ai dû expliquer que je m'étais juste perdu{|e}. Ils ont compris : c'est arrivé à l'un d'eux.", "On m'a délogé{|e} du showroom à la lampe torche. J'ai été interdit{|e} de magasin. J'ai survécu. D'autres n'ont pas eu cette chance. On a retrouvé {w:object} au rayon literie, et personne avec."], en: ["The guard found me at 3 a.m. in pajamas in a bunk bed. He called the police. I had to explain I just got lost. They understood: it happened to one of them.", "They flushed me out of the showroom with flashlights. I got banned from the store. I survived. Others weren't so lucky. They found {w:object} in the bedding department, and nobody with it."] }, fx: { happy: -3, heat: 3 } },
        ],
      },
      { label: { fr: 'Manger des boulettes', en: 'Eat the meatballs' }, text: { fr: ["J'ai mangé 24 boulettes, deux hot-dogs et une glace à 1 €. J'ai oublié pourquoi j'étais venu{|e}. C'était la meilleure journée de ma vie.", "Les boulettes m'ont donné la force de retrouver la sortie. Et des gaz. Beaucoup de gaz. Le parking a souffert. Ça a fait {w:sound}."], en: ["I ate 24 meatballs, two hot dogs and a $1 ice cream. I forgot why I came. Best day of my life.", "The meatballs gave me the strength to find the exit. And gas. So much gas. The parking lot suffered. It went {w:sound}."] }, fx: { happy: 5, health: -2, weight: 0.02 } },
    ],
  },
  {
    id: 'dy_ikea_couple',
    icon: '🔩',
    cat: 'home',
    rating: 1,
    actor: 'lover',
    scene: { place: 'apartment', mood: 'angry', prop: 'toolbox' },
    when: { age: [18, 80], has: 'lover', noFlag: 'dy_wobbly_bed' },
    weight: 6,
    cooldown: 8,
    text: {
      fr: [
        "Toi et {a.first} montez votre nouveau lit en kit. Étape 14. Vous ne vous parlez plus depuis l'étape 9. Il reste une vis. Une seule. Personne ne sait d'où elle vient.",
        "Montage du lit avec {a.first}. {a:Il|Elle} lit la notice à l'envers, tu tiens la clé Allen comme un poignard. En fond sonore : {w:song}. Le couple vacille. Le lit aussi.",
        "{a.first} affirme que la planche B va avec la planche F. Tu sais que c'est faux. La planche B le sait aussi. Il est 23 h et le lit a l'air d'être devenu {w:object}.",
        "Le lit est monté. Il est penché. Il grince quand on le regarde. Il reste trois vis sur le parquet, et {a.first} dit que « c'est normal, c'est des vis de rechange ».",
      ],
      en: [
        "You and {a.first} are assembling your new flat-pack bed. Step 14. You haven't spoken since step 9. There's one screw left. Just one. Nobody knows where it came from.",
        "Bed assembly with {a.first}. {a:He|She} is reading the manual upside down, you're holding the Allen key like a dagger. Playing in the background: {w:song}. The relationship is wobbling. So is the bed.",
        "{a.first} insists board B goes with board F. You know it's wrong. Board B knows it too. It's 11 p.m. and the bed seems to have turned into {w:object}.",
        "The bed is assembled. It leans. It creaks when you look at it. There are three screws left on the floor, and {a.first} says 'that's normal, they're spare screws'.",
      ],
    },
    choices: [
      { label: { fr: 'Tout redémonter', en: 'Take it all apart' }, text: { fr: ["On a tout redémonté et remonté. Trois heures de plus. Le lit est droit. On ne s'est pas adressé la parole pendant deux jours, mais il est droit.", "J'ai redémonté le lit vis par vis. {a.first} s'est endormi{a:|e} par terre. À 4 h, c'était parfait. J'ai pleuré de fierté, seul{|e}, avec {w:drink}."], en: ["We took it all apart and rebuilt it. Three more hours. The bed is straight. We didn't speak for two days, but it's straight.", "I disassembled the bed screw by screw. {a.first} fell asleep on the floor. At 4 a.m. it was perfect. I cried with pride, alone, with {w:drink}."] }, fx: { discipline: 4, rel: -3, happy: 2 } },
      { label: { fr: '« Ça tiendra »', en: "'It'll hold'" }, text: { fr: ["J'ai déclaré que ça tiendrait. On a rangé la vis en trop dans un tiroir, comme une relique. Le lit grince, mais il tient. Pour l'instant.", "On a décidé que la vis n'était pas importante. {a.first} a sauté sur le lit pour le tester. Il a fait {w:sound}. On a dit que c'était normal."], en: ["I declared it would hold. We put the extra screw in a drawer like a relic. The bed creaks, but it holds. For now.", "We decided the screw wasn't important. {a.first} jumped on the bed to test it. It made {w:sound}. We said that was normal."] }, fx: { happy: 3, rel: 3, flag: 'dy_wobbly_bed', schedule: { key: 'dy_bed_collapse', years: 1 } } },
      {
        label: { fr: 'Engueulade suédoise', en: 'Swedish screaming match' },
        out: [
          { w: 1, text: { fr: ["On s'est engueulés en hurlant des noms de meubles. « KLÜMPF ! » « BJÖRKSNÄS ! » Ça a fini en fou rire, puis en réconciliation sur le matelas posé par terre.", "Dispute monumentale. {a.first} a balancé la clé Allen par la fenêtre. Puis on a ri. Puis on a commandé {w:food} et dormi sur le matelas par terre. Le lit attendra."], en: ["We screamed furniture names at each other. 'KLÜMPF!' 'BJÖRKSNÄS!' It ended in laughter, then making up on the mattress on the floor.", "Monumental fight. {a.first} threw the Allen key out the window. Then we laughed. Then ordered {w:food} and slept on the floor mattress. The bed can wait."] }, fx: { rel: 6, happy: 5 }, mood: 'love' },
          { w: 1, text: { fr: ["La dispute a dérapé sur notre couple, nos mères et une remarque de 2019. {a.first} a dormi chez un ami. Le lit en kit a gagné.", "On s'est dit des choses impardonnables au-dessus d'un sachet de chevilles. {a.first} est parti{a:|e} en claquant la porte. La porte, elle, était bien montée. J'ai fini la soirée avec {w:food}."], en: ["The fight spiraled into our relationship, our mothers and a comment from 2019. {a.first} slept at a friend's. The flat-pack won.", "We said unforgivable things over a bag of dowels. {a.first} stormed out, slamming the door. The door, at least, was properly installed. I finished the evening with {w:food}."] }, fx: { rel: -10, happy: -5 }, mood: 'angry' },
        ],
      },
    ],
  },
  {
    id: 'dy_bed_collapse',
    icon: '💥',
    cat: 'home',
    rating: 2,
    chainOnly: true,
    actor: 'lover',
    vars: { amount: [150, 700] },
    scene: { place: 'apartment', mood: 'shock', prop: 'bed', fx: 'explosion' },
    when: { age: [18, 85], flag: 'dy_wobbly_bed' },
    text: {
      fr: [
        "La vis en trop avait un rôle. Tu l'apprends un soir où toi et {a.first} testez la solidité du lit de façon… dynamique. Le sommier cède dans un fracas de fin du monde.",
        "Un an que le lit grince. Ce soir, en plein moment intime avec {a.first}, il s'effondre d'un coup. Le voisin du dessous appelle pour savoir si quelqu'un est mort. Il a entendu {w:sound}.",
        "Crac. Le lit monté de travers lâche au pire moment possible, avec toi et {a.first} dessus, dans une position que tu n'expliqueras jamais aux pompiers.",
        "Le lit s'écroule pendant que {a.first} et toi êtes très occupés. Une latte se plante dans le parquet. Une autre a disparu. Le chat est traumatisé. Par la fenêtre, on voit voler {w:object}.",
      ],
      en: [
        "The extra screw had a job. You find out one night when you and {a.first} are testing the bed's sturdiness… dynamically. The frame gives way with an apocalyptic crash.",
        "The bed has creaked for a year. Tonight, mid-intimate moment with {a.first}, it collapses all at once. The downstairs neighbor calls to ask if someone died. He heard {w:sound}.",
        "Crack. The crooked bed gives out at the worst possible moment, with you and {a.first} on it, in a position you will never explain to the paramedics.",
        "The bed collapses while you and {a.first} are very busy. One slat stabs into the floor. Another has vanished. The cat is traumatized. Out the window flies {w:object}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Constater les dégâts', en: 'Assess the damage' },
        out: [
          { w: 3, text: { fr: ["Bilan : un coccyx fêlé, un fou rire de vingt minutes et une vis retrouvée, enfin à sa place. On a racheté un lit. En métal. Soudé.", "On a fini la nuit sur le matelas par terre, morts de rire. {a.first} a gardé la latte cassée comme trophée. Elle est accrochée au-dessus du nouveau lit, avec {w:object}."], en: ["Damage report: a cracked tailbone, a twenty-minute laughing fit and one screw, finally in its place. We bought a new bed. Metal. Welded.", "We finished the night on the mattress on the floor, crying with laughter. {a.first} kept the broken slat as a trophy. It hangs above the new bed, next to {w:object}."] }, fx: { health: -4, happy: 6, rel: 8, money: '-amount', unflag: 'dy_wobbly_bed' }, mood: 'love' },
          { w: 1, text: { fr: ["Une latte m'a transpercé la fesse. Les pompiers ont dû me transporter sur le ventre, à moitié nu{|e}, avec la latte plantée en l'air comme un drapeau. Tout l'immeuble était sur le palier.", "Les urgences. J'avais une latte de sommier dans la fesse gauche, {a.first} une entorse. L'interne a demandé « comment ? ». On a dit « en dormant ». Il a ri jusqu'à la fin de sa garde en criant « {w:exclaim} »"], en: ["A slat impaled my buttock. The firefighters had to carry me out face down, half-naked, with the slat sticking up like a flag. The whole building was on the landing.", "ER. I had a bed slat in my left butt cheek, {a.first} a sprain. The intern asked 'how?'. We said 'while sleeping'. He laughed until the end of his shift, yelling '{w:exclaim}'"] }, fx: { health: -12, happy: -4, rel: 4, money: '-amount', fame: 1, unflag: 'dy_wobbly_bed', visual: 'gore' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'dy_slow_queue',
    icon: '🛒',
    cat: 'daily',
    rating: 0,
    scene: { place: 'park', mood: 'angry', prop: 'cart' },
    when: { age: [18, 95] },
    weight: 9,
    cooldown: 4,
    text: {
      fr: [
        "Tu choisis la file la plus courte au supermarché. Devant toi : une dame qui paie {w:food} en pièces de 1 centime, une par une, en les comptant à voix haute.",
        "File de caisse. Le client devant toi conteste le prix d'un yaourt. Le chef de rayon arrive. Puis le directeur. Puis, apparemment, un avocat, qui mange {w:food}.",
        "Tu as un seul article. Le monsieur devant toi a trois chariots, quarante bons de réduction et une carte de fidélité qu'il ne retrouve pas. Il fouille dans sa sacoche depuis quatre minutes. Il en sort {w:object}.",
        "La caissière part en pause pile au moment où c'est ton tour. Elle pose le petit panneau « Caisse fermée » sur ton tapis, entre ta baguette et {w:object}.",
      ],
      en: [
        "You pick the shortest line at the supermarket. In front of you: a lady paying for {w:food} in pennies, one by one, counting out loud.",
        "Checkout line. The customer ahead is disputing the price of a yogurt. The department manager arrives. Then the store manager. Then, apparently, a lawyer, eating {w:food}.",
        "You have one item. The man ahead has three carts, forty coupons and a loyalty card he can't find. He's been digging in his bag for four minutes. He pulls out {w:object}.",
        "The cashier goes on break exactly when it's your turn. She places the little 'Register closed' sign on your belt, between your baguette and {w:object}.",
      ],
    },
    choices: [
      { label: { fr: 'Changer de file', en: 'Switch lines' }, text: { fr: ["J'ai changé de file. Celle que j'ai quittée s'est mise à avancer à la vitesse de la lumière. Dans la mienne, la caisse a pris feu.", "J'ai changé trois fois de file. Je suis maintenant dernier{|ère} partout. Le magasin ferme dans cinq minutes. Les haut-parleurs passent {w:song}."], en: ["I switched lines. The one I left started moving at the speed of light. In mine, the register caught fire.", "I switched lines three times. I'm now last everywhere. The store closes in five minutes. The speakers are playing {w:song}."] }, fx: { stress: 4, happy: -2 } },
      { label: { fr: 'Discuter avec la file', en: 'Chat with the line' }, text: { fr: ["J'ai lancé la conversation dans la file. Vingt minutes plus tard, on avait un groupe WhatsApp, un barbecue prévu samedi et une histoire d'amour entre le n°3 et le n°5.", "J'ai papoté avec la dame aux centimes. Elle avait été cascadeuse dans les années 70. Je n'ai pas vu le temps passer. Elle m'a donné {w:gift}."], en: ["I started a conversation in line. Twenty minutes later we had a group chat, a barbecue planned for Saturday and a romance between number 3 and number 5.", "I chatted with the penny lady. She was a stuntwoman in the '70s. Time flew. She gave me {w:gift}."] }, fx: { happy: 4, karma: 2 } },
      {
        label: { fr: 'Soupirer très fort', en: 'Sigh very loudly' },
        out: [
          { w: 1, text: { fr: ["J'ai soupiré très fort. Toute la file a soupiré avec moi, en chœur. La dame devant a accéléré. Le pouvoir du soupir collectif.", "Mon soupir a été entendu. La caissière d'à côté m'a fait signe : « Je vous prends ». J'ai traversé le magasin en vainqueur, {w:food} sous le bras."], en: ["I sighed very loudly. The whole line sighed with me, in chorus. The lady ahead sped up. The power of the collective sigh.", "My sigh was heard. The cashier next door waved: 'I'll take you'. I crossed the store like a champion, {w:food} under my arm."] }, fx: { happy: 4 } },
          { w: 1, text: { fr: ["La dame s'est retournée : « Un problème, jeune homme ? » (même si je ne suis pas un jeune homme). Elle a recommencé à compter depuis le début. Par vengeance.", "Le monsieur devant s'est retourné et m'a fixé{|e}. Puis il a sorti un deuxième sac de bons de réduction. Exprès. Et {w:object}."], en: ["The lady turned around: 'Something wrong, young man?' (even though I'm not a young man). She started counting again from the beginning. Out of revenge.", "The man ahead turned and stared at me. Then pulled out a second bag of coupons. On purpose. And {w:object}."] }, fx: { stress: 5, happy: -3 } },
        ],
      },
    ],
  },
  {
    id: 'dy_self_checkout',
    icon: '🥑',
    cat: 'daily',
    rating: 2,
    vars: { amount: [15, 80] },
    scene: { place: 'park', mood: 'angry', prop: 'cart' },
    when: { age: [18, 90] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: [
        "Caisse automatique. « Article inattendu dans la zone d'ensachage. » Il n'y a rien dans la zone d'ensachage. Il n'y a que ta dignité, et elle est en train de partir.",
        "La caisse automatique refuse de scanner tes avocats. « Veuillez patienter, un assistant va arriver. » L'assistant, c'est un ado qui gère douze caisses en criant {w:exclaim}",
        "Tu scannes une bouteille de vin. La machine bloque : « Vérification de l'âge ». Tu as 40 ans de cernes sur le visage. On te fait attendre dix minutes devant tout le monde, pendant que la machine joue {w:song}.",
        "La caisse automatique te demande de « poser l'article », puis de « retirer l'article », puis de « poser l'article ». Ça ressemble à un jeu. Un jeu sadique. Tu as {w:food} dans les bras.",
      ],
      en: [
        "Self-checkout. 'Unexpected item in bagging area.' There's nothing in the bagging area. Only your dignity, and it's leaving.",
        "The self-checkout refuses to scan your avocados. 'Please wait, an assistant is coming.' The assistant is a teenager managing twelve machines while shouting {w:exclaim}",
        "You scan a bottle of wine. The machine locks: 'Age verification'. Your face carries 40 years of eye bags. They make you wait ten minutes in front of everyone, while the machine plays {w:song}.",
        "The self-checkout tells you to 'place the item', then 'remove the item', then 'place the item'. It feels like a game. A sadistic game. You're holding {w:food}.",
      ],
    },
    choices: [
      { label: { fr: 'Appeler l\'assistant', en: 'Call the assistant' }, text: { fr: ["L'assistant est arrivé, a tapé un code secret, la machine a obéi immédiatement. Il m'a regardé{|e} comme on regarde un enfant qui ne sait pas faire ses lacets.", "J'ai appelé l'assistant. Il a mis dix minutes à venir, deux secondes à régler le problème et m'a dit « faut juste pas toucher ». Je n'ai pas compris ce que je ne devais pas toucher. Il m'a appelé{|e} « {w:nickname} »."], en: ["The assistant came, typed a secret code, and the machine obeyed instantly. He looked at me like a kid who can't tie their shoes.", "I called the assistant. Took him ten minutes to arrive, two seconds to fix it, and he said 'just don't touch it'. I don't know what I wasn't supposed to touch. He called me '{w:nickname}'."] }, fx: { stress: 2, happy: -1 } },
      {
        label: { fr: 'Taper la machine', en: 'Hit the machine' },
        out: [
          { w: 1, text: { fr: ["J'ai donné un grand coup de poing à la machine. Elle s'est débloquée et m'a offert un bon de réduction. La violence, parfois, ça marche.", "Un bon coup de genou dans le flanc, et la caisse a tout validé, même le saumon que je n'avais pas scanné. Merci, machine. Elle a répondu par {w:sound}."], en: ["I punched the machine hard. It unlocked and gave me a coupon. Sometimes violence works.", "One good knee to the side and the register validated everything, even the salmon I hadn't scanned. Thanks, machine. It replied with {w:sound}."] }, fx: { happy: 5, stress: -4 } },
          { w: 1, text: { fr: ["J'ai frappé l'écran. Il s'est fendu. Une alarme a retenti, et le vigile m'a plaqué{|e} au sol entre deux paquets de PQ. {$amount} de dégâts.", "J'ai cogné la machine si fort que je me suis pété {w:bodypart}. La machine, elle, n'a rien. Elle a juste dit : « Article inattendu ». C'était moi."], en: ["I punched the screen. It cracked. An alarm went off and the security guard tackled me to the floor between two packs of toilet paper. {$amount} in damages.", "I hit the machine so hard I busted my {w:bodypart}. The machine is fine. It just said: 'Unexpected item'. It meant me."] }, fx: { money: '-amount', health: -4, happy: -5, heat: 3 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Scanner « des carottes »', en: "Scan it as 'carrots'" },
        out: [
          { w: 2, text: { fr: ["J'ai scanné mon entrecôte comme « carottes en vrac ». Ça a marché. J'ai économisé {$amount}. J'ai mangé l'entrecôte en ricanant comme un méchant de dessin animé.", "Code des bananes pour une bouteille de whisky. La balance n'a rien dit. Je suis sorti{|e} le cœur battant et je me suis cuité{|e} au whisky-banane {w:at_place}."], en: ["I scanned my rib-eye as 'loose carrots'. It worked. Saved {$amount}. I ate the steak cackling like a cartoon villain.", "Banana code for a bottle of whiskey. The scale didn't complain. I walked out heart pounding and got drunk on banana-whiskey {w:at_place}."] }, fx: { money: 'amount', happy: 5, karma: -5 } },
          { w: 1, text: { fr: ["Le vigile regardait les caméras. « Des carottes, hein ? » Il m'a escorté{|e} au bureau. Mes 3 kg de « carottes » étaient du foie gras. Plainte pour vol.", "Une caméra au-dessus de ma tête a filmé toute l'opération en 4K. J'ai été arrêté{|e} pour vol à l'étalage, pour un camembert. Mon casier dira « camembert ». Le flic m'a traité{|e} de « {w:insult} »."], en: ["Security was watching the cameras. 'Carrots, huh?' He escorted me to the office. My 6 pounds of 'carrots' was foie gras. Shoplifting complaint.", "A camera above my head filmed the whole thing in 4K. I got arrested for shoplifting, over a camembert. My record will say 'camembert'. The cop called me '{w:insult}'."] }, fx: { arrest: 'shoplift', happy: -6, visual: 'police' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'dy_free_samples',
    icon: '🧀',
    cat: 'daily',
    rating: 1,
    scene: { place: 'park', mood: 'happy', prop: 'cheese' },
    when: { age: [18, 95] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Au supermarché, une dame en tablier propose de goûter {w:food} sur des cure-dents. Tu as faim. Elle a un plateau entier. Elle a l'air fatiguée.",
        "Stand de dégustation de saucisson au rayon charcuterie. « Servez-vous ! » Tu as déjà fait quatre passages en changeant de veste. Elle commence à te reconnaître et t'a surnommé{|e} « {w:nickname} ».",
        "Un commercial au rayon vins propose une dégustation gratuite. Il est 10 h 30. Tu as faim et pas de dignité. Il te sert {w:drink}.",
        "Dégustation gratuite au rayon fromages. Le plateau contient de la tomme, du comté et quelque chose qui dégage {w:smell}. La vendeuse t'encourage à goûter « le spécial ».",
      ],
      en: [
        "At the supermarket, a lady in an apron offers samples of {w:food} on toothpicks. You're hungry. She has an entire tray. She looks tired.",
        "Sausage tasting stand in the deli aisle. 'Help yourself!' You've already made four passes, changing jackets each time. She's starting to recognize you and has nicknamed you '{w:nickname}'.",
        "A salesman in the wine aisle offers a free tasting. It's 10:30 a.m. You're hungry and you have no dignity. He pours you {w:drink}.",
        "Free tasting at the cheese counter. The tray holds cheddar, gruyère and something giving off {w:smell}. The saleswoman urges you to try 'the special one'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout goûter', en: 'Try everything' },
        out: [
          { w: 2, text: { fr: ["J'ai goûté tout le plateau, puis le suivant. J'ai fait un repas complet gratuit. La dame m'a donné les restes. On est un peu liés maintenant.", "J'ai fait douze passages. Au dixième, j'ai mis une fausse moustache. Elle a rigolé et m'a donné une barquette entière. Respect mutuel. Et {w:food} en bonus."], en: ["I tried the whole tray, then the next. A full free meal. The lady gave me the leftovers. We're kind of bonded now.", "I made twelve passes. On the tenth, I wore a fake mustache. She laughed and gave me an entire tray. Mutual respect. Plus {w:food} as a bonus."] }, fx: { happy: 5, money: 10, weight: 0.01 } },
          { w: 1, text: { fr: ["J'ai goûté « le spécial ». C'était un fromage corse vivant. Il a bougé. J'ai passé l'après-midi aux toilettes du magasin à prier.", "Après la dégustation de vin, j'étais pompette à 11 h. J'ai acheté six bouteilles, un fauteuil de jardin et {w:object}. Je n'ai pas de jardin."], en: ["I tried 'the special one'. It was a live Corsican cheese. It moved. I spent the afternoon praying in the store bathroom.", "After the wine tasting, I was tipsy by 11 a.m. I bought six bottles, a garden chair and {w:object}. I don't have a garden."] }, fx: { health: -4, money: -60, happy: 2 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Poliment refuser', en: 'Politely decline' }, text: { fr: ["J'ai refusé poliment. Elle a eu l'air vexée. Je suis revenu{|e} dix minutes plus tard m'excuser et j'ai pris trois cure-dents. Tout le monde est content.", "J'ai dit non merci. Dans la file d'attente, je n'ai pensé qu'au saucisson. Il me hante encore. J'ai acheté {w:food} pour compenser."], en: ["I politely declined. She looked offended. I came back ten minutes later to apologize and took three toothpicks. Everyone's happy.", "I said no thanks. In the checkout line, I thought only of the sausage. It still haunts me. I bought {w:food} to compensate."] }, fx: { discipline: 2 } },
      { label: { fr: 'Voler le plateau', en: 'Steal the whole tray' }, text: { fr: ["J'ai attrapé le plateau entier et je suis parti{|e} en courant. Elle ne m'a pas poursuivi{|e}. Elle a juste dit : « Prenez-le, je démissionne vendredi. »", "J'ai embarqué le plateau sous ma veste. Les cure-dents m'ont piqué partout. J'ai mangé dans la voiture, saignant légèrement, heureux{|se}, en écoutant {w:song}."], en: ["I grabbed the whole tray and ran. She didn't chase me. She just said: 'Take it, I quit on Friday.'", "I smuggled the tray under my jacket. The toothpicks stabbed me everywhere. I ate in the car, bleeding slightly, happy, listening to {w:song}."] }, fx: { happy: 6, karma: -3 } },
    ],
  },
  // ───────────────────────────── livraisons ─────────────────────────────
  {
    id: 'dy_parcel_fence',
    icon: '🚚',
    cat: 'home',
    rating: 0,
    vars: { amount: [30, 300] },
    scene: { place: 'home', mood: 'shock', prop: 'parcel' },
    when: { age: [18, 95] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "La caméra de ta sonnette montre le livreur lancer ton colis par-dessus le portail. Il rebondit sur le toit de la voiture et atterrit dans la piscine du voisin. Le colis contenait {w:object}.",
        "Ton colis a été « remis en main propre » selon le suivi. La photo de preuve montre une main qui n'est pas la tienne, devant une porte qui n'est pas la tienne. On distingue aussi {w:animal}.",
        "Le livreur a laissé ton colis « en lieu sûr ». Le lieu sûr est la poubelle jaune. C'est jour de ramassage. Le colis contenait {w:object}.",
        "Ton colis a été déposé chez « le voisin ». Lequel ? Personne ne sait. Au troisième étage, une vieille dame ouvre et te dit qu'elle l'a « déjà ouvert pour vérifier ». Elle tient {w:object} et te demande si c'est « normal ».",
      ],
      en: [
        "Your doorbell camera shows the courier throwing your package over the gate. It bounces off the car roof and lands in the neighbor's pool. It contained {w:object}.",
        "Your package was 'handed directly to you', per the tracking. The proof photo shows a hand that isn't yours, in front of a door that isn't yours. You can also make out {w:animal}.",
        "The courier left your package 'in a safe place'. The safe place is the recycling bin. It's pickup day. The package contained {w:object}.",
        "Your package was left with 'the neighbor'. Which one? Nobody knows. On the third floor, an old lady opens up and says she 'already opened it to check'. She's holding {w:object} and asks if it's 'normal'.",
      ],
    },
    choices: [
      { label: { fr: 'Récupérer le colis', en: 'Retrieve the package' }, text: { fr: ["J'ai repêché mon colis dans la piscine du voisin avec une épuisette. Il m'a regardé{|e} faire en peignoir, sans un mot. On ne s'était jamais parlé. On ne se parlera jamais.", "J'ai couru derrière le camion-poubelle sur 300 mètres. Les éboueurs m'ont applaudi{|e} et rendu le colis. Il dégage {w:smell}, mais il est là."], en: ["I fished my package out of the neighbor's pool with a net. He watched me in his bathrobe, silently. We'd never spoken before. We never will.", "I chased the garbage truck for 300 yards. The garbage men applauded and gave me the package. It gives off {w:smell}, but it's here."] }, fx: { athletic: 2, happy: 2 } },
      {
        label: { fr: 'Réclamer un remboursement', en: 'Demand a refund' },
        out: [
          { w: 1, text: { fr: ["J'ai envoyé la vidéo au service client. Ils m'ont remboursé {$amount} et proposé un bon d'achat. La vidéo a fait 2 millions de vues. Le livreur est devenu une star.", "Réclamation acceptée : {$amount} remboursés et nouveau colis. Le nouveau livreur l'a aussi lancé par-dessus le portail. Mais il l'a rattrapé lui-même. Progrès. Il m'a crié « {w:exclaim} »"], en: ["I sent the video to customer service. They refunded {$amount} and threw in a voucher. The video got 2 million views. The courier became a star.", "Claim accepted: {$amount} refunded and a new package. The new courier also threw it over the gate. But he caught it himself. Progress. He yelled '{w:exclaim}'"] }, fx: { money: 'amount', happy: 5 } },
          { w: 1, text: { fr: ["Réclamation refusée : « Le colis a été livré conformément à nos conditions. » Les conditions disent apparemment « n'importe où ».", "Le service client m'a demandé une photo du colis non reçu. J'ai envoyé une photo de rien. Ils ont jugé la preuve « insuffisante ». J'ai noyé ma peine dans {w:drink}."], en: ["Claim denied: 'The package was delivered according to our terms.' The terms apparently say 'anywhere'.", "Customer service asked for a photo of the package I never received. I sent a photo of nothing. They deemed the evidence 'insufficient'. I drowned my sorrows in {w:drink}."] }, fx: { happy: -4, stress: 4 } },
        ],
      },
    ],
  },
  {
    id: 'dy_parcel_wrong',
    icon: '📬',
    cat: 'home',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'parcel' },
    when: { age: [18, 95] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Tu reçois un colis qui n'est pas pour toi. Il est adressé à ta voisine du 2e, Mme Ferrand, 78 ans. Le carton est déchiré. Dedans, on aperçoit un objet rose qui vibre encore.",
        "Erreur de livraison : un colis pour le voisin du dessus. Il fait 40 kilos, il fait tic-tac et il est étiqueté « Ne pas secouer ». Tu l'as déjà secoué. Il a fait {w:sound}.",
        "Le livreur te remet un colis au nom d'un certain « Docteur Vlad ». Ton adresse, ton étage, ta porte. Dedans : {w:object}, une cape et un dentier en argent.",
        "Tu reçois par erreur la commande de ton voisin. C'est une boîte de 200 mètres de corde, un costume de lapin géant et de l'huile de massage. Le voisin est l'organiste de la paroisse.",
      ],
      en: [
        "You receive a package that isn't yours. It's addressed to your neighbor on the 2nd floor, Mrs. Ferrand, 78. The box is torn. Inside, you glimpse a pink object that's still vibrating.",
        "Delivery mix-up: a package for the upstairs neighbor. It weighs 90 pounds, it's ticking and it's labeled 'Do not shake'. You've already shaken it. It made {w:sound}.",
        "The courier hands you a package for a certain 'Doctor Vlad'. Your address, your floor, your door. Inside: {w:object}, a cape and silver dentures.",
        "You accidentally receive your neighbor's order. It's 600 feet of rope, a giant bunny costume and massage oil. The neighbor is the church organist.",
      ],
    },
    choices: [
      { label: { fr: 'Le rapporter discrètement', en: 'Return it discreetly' }, text: { fr: ["J'ai rapporté le colis en disant « ça a été livré chez moi ». La voisine m'a fait un clin d'œil appuyé. Je ne la regarderai plus jamais de la même façon.", "J'ai sonné, tendu le colis, et on s'est regardés dans un silence total. Il m'a dit « merci ». J'ai dit « bon week-end ». Il y avait tellement de non-dits. Derrière lui, j'ai aperçu {w:animal}."], en: ["I returned the package saying 'it was delivered to me'. The neighbor gave me a heavy wink. I'll never look at her the same way.", "I rang, handed over the package, and we looked at each other in total silence. He said 'thanks'. I said 'have a good weekend'. So much unsaid. Behind him, I glimpsed {w:animal}."] }, fx: { karma: 3, happy: 1 } },
      {
        label: { fr: 'Ouvrir par curiosité', en: 'Open it out of curiosity' },
        out: [
          { w: 1, text: { fr: ["J'ai ouvert. Je n'aurais pas dû. J'ai refermé avec du scotch et je l'ai déposé devant sa porte. Il y a des choses que l'humain ne doit pas voir.", "J'ai ouvert le carton. Dedans, une lettre : « Je savais que tu ouvrirais. — Ton voisin ». Je ne dors plus. La nuit, j'entends {w:sound}."], en: ["I opened it. I shouldn't have. I taped it shut and left it at their door. Some things humans aren't meant to see.", "I opened the box. Inside, a letter: 'I knew you'd open it. — Your neighbor'. I can't sleep anymore. At night, I hear {w:sound}."] }, fx: { stress: 5, smarts: 1 }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai ouvert, j'ai été surpris{|e}, puis j'ai été intéressé{|e}. J'ai commandé le même. Merci, voisin.", "Le contenu était tellement fascinant que j'ai frappé chez le voisin pour poser des questions. On a bu un verre. On est amis. Je ne dirai rien de plus. Il m'a prêté {w:object}."], en: ["I opened it, was surprised, then intrigued. I ordered the same thing. Thanks, neighbor.", "The contents were so fascinating I knocked on the neighbor's door to ask questions. We had a drink. We're friends. I'll say no more. He lent me {w:object}."] }, fx: { happy: 5, money: -40 }, mood: 'happy' },
        ],
      },
      { label: { fr: 'Le garder', en: 'Keep it' }, text: { fr: ["J'ai gardé le colis. Le voisin a mis une affiche dans le hall : « À la personne qui a mon colis : je sais. » Il ne sait pas. Je crois.", "Je l'ai gardé et j'ai fait comme si de rien n'était. Le voisin me dit bonjour avec un regard très, très appuyé depuis. Hier, il m'a offert {w:gift}."], en: ["I kept the package. The neighbor put up a sign in the lobby: 'To whoever has my package: I know.' He doesn't. I think.", "I kept it and acted like nothing happened. The neighbor has been greeting me with a very, very pointed look ever since. Yesterday he gave me {w:gift}."] }, fx: { karma: -4, happy: 2, stress: 3 } },
    ],
  },
  {
    id: 'dy_delivery_fries',
    icon: '🍟',
    cat: 'daily',
    rating: 2,
    vars: { amount: [15, 45] },
    scene: { place: 'apartment', mood: 'angry', prop: 'burger' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Ta commande arrive avec 50 minutes de retard. Le sac est ouvert, il manque la moitié des frites, et le livreur a de la sauce au coin de la bouche. Il ne s'essuie même pas. Il dégage {w:smell}.",
        "Le livreur te tend ton burger. Il a été écrasé, puis apparemment reformé à la main. On voit très nettement l'empreinte d'un pouce dans le pain.",
        "Tu ouvres ta commande ({w:food}). Au milieu, il y a {w:gross}. Le livreur est déjà reparti. Il t'a mis 5 étoiles.",
        "L'appli indique que ton livreur est « à 2 minutes » depuis 40 minutes. La carte montre qu'il fait des cercles autour d'un PMU. Puis il s'arrête. Puis il mange. Ce que tu as commandé : {w:food}.",
      ],
      en: [
        "Your order arrives 50 minutes late. The bag is open, half the fries are missing, and the driver has sauce in the corner of his mouth. He doesn't even wipe it. He gives off {w:smell}.",
        "The driver hands you your burger. It's been crushed, then apparently reshaped by hand. You can clearly see a thumbprint in the bun.",
        "You open your order ({w:food}). In the middle, there's {w:gross}. The driver has already left. He gave you 5 stars.",
        "The app says your driver is '2 minutes away' — for 40 minutes now. The map shows him circling a betting bar. Then he stops. Then he eats. What you ordered: {w:food}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Manger quand même', en: 'Eat it anyway' },
        out: [
          { w: 2, text: { fr: ["J'ai mangé quand même. J'avais trop faim pour avoir des principes. Ça avait un goût de défaite et de ketchup.", "J'ai retiré l'intrus et mangé le reste. Mon estomac m'a pardonné. Ma conscience, non. L'intrus, c'était {w:gross}."], en: ["I ate it anyway. Too hungry for principles. It tasted of defeat and ketchup.", "I removed the intruder and ate the rest. My stomach forgave me. My conscience didn't. The intruder was {w:gross}."] }, fx: { happy: 1, health: -2 } },
          { w: 1, text: { fr: ["J'ai mangé. Deux heures plus tard, j'ai vomi par le nez dans l'évier, puis dans la baignoire, puis sur le chat. Le chat ne me parle plus.", "Grosse erreur. La nuit a été une symphonie de diarrhée en trois mouvements. Le dernier s'appelait « Requiem pour mes toilettes ». Les voisins ont entendu {w:sound}."], en: ["I ate. Two hours later I was vomiting through my nose into the sink, then the bathtub, then the cat. The cat no longer speaks to me.", "Big mistake. The night was a symphony of diarrhea in three movements. The last one was called 'Requiem for My Toilet'. The neighbors heard {w:sound}."] }, fx: { health: -8, happy: -6, disease: 'food_poisoning', visual: 'poop' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Réclamer sur l\'appli', en: 'Complain in the app' }, text: { fr: ["J'ai envoyé une photo de l'horreur. L'appli m'a remboursé {$amount} et un code promo de 2 €. J'ai recommandé chez le même resto. Je suis faible.", "Réclamation envoyée avec photo zoomée. Remboursement de {$amount}. Le resto m'a ensuite écrit pour me dire que c'était « un ingrédient secret ». Avec un bon pour {w:food}."], en: ["I sent a photo of the horror. The app refunded {$amount} and a $2 promo code. I ordered from the same place again. I'm weak.", "Complaint sent with a zoomed-in photo. Refund of {$amount}. The restaurant then wrote to tell me it was 'a secret ingredient'. With a voucher for {w:food}."] }, fx: { money: 'amount', happy: 2 } },
      { label: { fr: 'Une étoile vengeresse', en: 'Vengeful one-star' }, text: { fr: ["J'ai mis une étoile et écrit un roman. Le livreur m'a mis une étoile en retour. Plus personne ne veut me livrer dans un rayon de 5 km. Je mange des pâtes crues.", "J'ai noté le livreur zéro étoile, ce qui est techniquement impossible. Il a quand même reçu la notification. Il sait où j'habite. Bordel. Ce matin, il y avait {w:gross} sur mon paillasson."], en: ["I gave one star and wrote a novel. The driver gave me one star back. Nobody within 3 miles will deliver to me anymore. I'm eating raw pasta.", "I rated the driver zero stars, which is technically impossible. He still got the notification. He knows where I live. Shit. This morning there was {w:gross} on my doormat."] }, fx: { happy: 2, stress: 4 } },
    ],
  },
  // ───────────────────────────── arnaques ─────────────────────────────
  {
    id: 'dy_hi_mum_scam',
    icon: '📲',
    cat: 'adulting',
    rating: 1,
    vars: { amount: [300, 1500] },
    scene: { place: 'home', mood: 'neutral', prop: 'phone' },
    when: { age: [25, 95] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "SMS d'un numéro inconnu : « Coucou maman c'est moi, j'ai cassé mon téléphone, c'est mon nouveau numéro. Tu peux me virer {$amount} vite stp ? » Tu n'as pas d'enfant. Ou alors tu n'es pas au courant. C'est signé « {w:nickname} ».",
        "« Papa, c'est moi, j'ai un souci, je t'explique plus tard, envoie {$amount} sur ce RIB ❤️ ». Le RIB est au nom de « Jean-Michel Arnaque ». Bon. Presque. La photo de profil montre {w:celeb}.",
        "Un message WhatsApp : « Salut c'est ton fils, mon téléphone est tombé {w:at_place}. Besoin urgent de {$amount}. Ne m'appelle pas, mon micro est cassé. » Ton fils n'existe pas.",
        "« Maman c'est moi ton bébé, nouveau numéro 😘 J'ai besoin d'argent pour {w:object}, c'est urgent. » La photo de profil est un lion qui porte des lunettes de soleil.",
      ],
      en: [
        "Text from an unknown number: 'Hi mum it's me, I broke my phone, this is my new number. Can you send me {$amount} quick pls?' You don't have kids. Or you weren't informed. It's signed '{w:nickname}'.",
        "'Dad, it's me, I'm in trouble, I'll explain later, send {$amount} to this account ❤️'. The account belongs to 'John Q. Scammington'. Well. Close. The profile picture shows {w:celeb}.",
        "A WhatsApp message: 'Hi it's your son, I dropped my phone {w:at_place}. Need {$amount} urgently. Don't call, my mic is broken.' Your son does not exist.",
        "'Mom it's me your baby, new number 😘 I need money for {w:object}, it's urgent.' The profile picture is a lion wearing sunglasses.",
      ],
    },
    choices: [
      {
        label: { fr: 'Arnaquer l\'arnaqueur', en: 'Scam the scammer' },
        out: [
          { w: 2, text: { fr: ["J'ai joué le parent inquiet pendant trois jours. Je lui ai demandé de m'envoyer 20 € « pour les frais du virement ». Il l'a fait. J'ai gagné. Il m'a bloqué{|e}.", "J'ai envoyé de fausses captures de virement pendant une semaine en lui demandant de me rendre « le trop-perçu ». Il m'a renvoyé 50 €. Le crime ne paie pas, sauf pour moi. J'ai fêté ça avec {w:drink}."], en: ["I played the worried mom for three days. I asked him to send me $20 'for the transfer fees'. He did. I won. He blocked me.", "I sent fake transfer screenshots for a week and asked him to return the 'overpayment'. He sent me $50. Crime doesn't pay, except for me. I celebrated with {w:drink}."] }, fx: { money: 40, happy: 8, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai voulu le troller, mais il était meilleur que moi. Il a fini par me convaincre de lui envoyer {$amount}. Je ne sais pas comment. Je crois qu'il m'a hypnotisé{|e} par texto.", "J'ai joué avec lui. Il a joué avec moi. Il a gagné. Je lui dois maintenant {$amount} et j'ai promis d'aller à son mariage, {w:far_place}."], en: ["I tried to troll him, but he was better than me. He ended up convincing me to send {$amount}. I don't know how. I think he hypnotized me via text.", "I played with him. He played with me. He won. I now owe him {$amount} and promised to attend his wedding, {w:far_place}."] }, fx: { money: '-amount', happy: -8, smarts: -2 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Répondre « je suis ton père »', en: "Reply 'I am your father'" }, text: { fr: ["J'ai répondu : « Mon chéri, je ne suis pas ta mère. Je suis ton père. Et je suis déçu. » Il a répondu « ok ». On a échangé des recettes ensuite.", "J'ai joué le parent déçu : « Tu ne m'appelles jamais, et là tu veux de l'argent ? » Il s'est excusé. Je crois qu'il a vraiment appelé sa mère après. Elle lui a fait {w:food}."], en: ["I replied: 'Honey, I'm not your mother. I'm your father. And I'm disappointed.' He said 'ok'. We swapped recipes afterward.", "I played the disappointed parent: 'You never call, and now you want money?' He apologized. I think he actually called his mother afterward. She made him {w:food}."] }, fx: { happy: 5, karma: 2 } },
      { label: { fr: 'Signaler et bloquer', en: 'Report and block' }, text: { fr: ["J'ai signalé et bloqué. Deux minutes plus tard, nouveau numéro : « Maman, c'est encore moi. » Il est tenace. C'est presque attendrissant.", "Bloqué. Signalé. Le soir même, j'ai reçu le même message de quatre autres numéros. J'ai visiblement beaucoup d'enfants. L'un d'eux réclame {w:object}."], en: ["Reported and blocked. Two minutes later, a new number: 'Mom, it's me again.' He's persistent. Almost touching.", "Blocked. Reported. That evening I got the same message from four other numbers. Apparently I have a lot of kids. One of them wants {w:object}."] }, fx: { smarts: 1, stress: 1 } },
    ],
  },
  {
    id: 'dy_insulation_call',
    icon: '☎️',
    cat: 'adulting',
    rating: 0,
    vars: { amount: [500, 3000] },
    scene: { place: 'home', mood: 'angry', prop: 'phone' },
    when: { age: [20, 95] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: [
        "Le téléphone sonne {w:time}. « Bonjour, c'est au sujet de l'isolation de vos combles à 1 €. » Tu habites au rez-de-chaussée. Tu n'as pas de combles. Il insiste.",
        "Quatrième appel de la journée. Une voix enregistrée : « Bonjour ! Vous avez été sélectionné{|e} pour une pompe à chaleur offerte par l'État ! » Puis un vrai humain, très pressé, qui veut ton RIB et te propose aussi {w:object}.",
        "« Bonjour, je suis Brandon de la société Éco Confort Solutions Plus, nous passons dans votre quartier demain pour {w:object}. » Tu n'as rien demandé. Brandon s'en fiche.",
        "Un démarcheur appelle pendant que tu manges. Il te propose des panneaux solaires, puis une mutuelle, puis un compte formation, puis {w:food}. Il lit un script et ne respire jamais.",
      ],
      en: [
        "The phone rings {w:time}. 'Hello, this is about insulating your attic for $1.' You live on the ground floor. You have no attic. He insists.",
        "Fourth call today. A recorded voice: 'Hello! You've been selected for a free government heat pump!' Then a real human, in a hurry, who wants your bank details and also offers {w:object}.",
        "'Hello, this is Brandon from Eco Comfort Solutions Plus, we'll be in your area tomorrow for {w:object}.' You didn't ask for anything. Brandon doesn't care.",
        "A telemarketer calls while you're eating. He offers solar panels, then health insurance, then a training account, then {w:food}. He's reading a script and never breathes.",
      ],
    },
    choices: [
      { label: { fr: 'Le faire tourner en bourrique', en: 'Waste his time' }, text: { fr: ["J'ai fait semblant d'être très intéressé{|e} pendant 45 minutes. J'ai posé des questions sur la couleur de l'isolant, sa religion, son enfance. Il a raccroché en pleurant.", "Je lui ai répondu en faisant semblant d'être une IA vocale. « Je n'ai pas compris. Dites oui ou non. » On a tourné en boucle vingt minutes. Il a craqué le premier en criant « {w:insult} ! »"], en: ["I pretended to be very interested for 45 minutes. I asked about the insulation's color, his religion, his childhood. He hung up crying.", "I answered pretending to be a voice AI. 'I didn't understand. Say yes or no.' We looped for twenty minutes. He broke first, yelling '{w:insult}!'"] }, fx: { happy: 6, stress: -3 } },
      {
        label: { fr: 'Accepter le rendez-vous', en: 'Book the appointment' },
        out: [
          { w: 1, text: { fr: ["Un type est venu, a mesuré mon plafond avec ses doigts et m'a fait signer un devis de {$amount}. Je ne sais toujours pas pour quoi. Il y a une boîte dans mon grenier. Je n'ai pas de grenier.", "J'ai dit oui pour voir. Deux commerciaux sont restés quatre heures dans mon salon. J'ai signé pour qu'ils partent. {$amount}. Pour une ampoule LED et {w:object}."], en: ["A guy came, measured my ceiling with his fingers, and had me sign a {$amount} quote. I still don't know what for. There's a box in my attic. I don't have an attic.", "I said yes to see what happens. Two salesmen stayed in my living room for four hours. I signed so they'd leave. {$amount}. For an LED bulb and {w:object}."] }, fx: { money: '-amount', happy: -6 }, mood: 'shock' },
          { w: 1, text: { fr: ["Le commercial est venu, a vu mon appart, s'est assis et a avoué qu'il détestait son travail. On a bu un café. Il a démissionné depuis. Je suis sa marraine de reconversion.", "Personne n'est venu. Ils avaient noté une autre adresse. Un pauvre retraité à l'autre bout de la ville a maintenant des combles isolés à ma place. Il m'a envoyé {w:gift} pour me remercier."], en: ["The salesman came, saw my apartment, sat down and admitted he hated his job. We had coffee. He's since quit. I'm his career-change mentor.", "Nobody came. They wrote down the wrong address. Some poor retiree across town now has an insulated attic instead of me. He sent me {w:gift} as thanks."] }, fx: { happy: 3, karma: 2 } },
        ],
      },
      { label: { fr: 'Raccrocher direct', en: 'Hang up immediately' }, text: { fr: ["J'ai raccroché. Il a rappelé. J'ai raccroché. Il a rappelé avec un autre numéro. C'est une relation, maintenant.", "J'ai raccroché sans un mot. Ça m'a fait un bien fou. Je me suis inscrit{|e} sur une liste anti-démarchage. Le lendemain, la liste m'appelait pour me vendre une isolation et {w:object}."], en: ["I hung up. He called back. I hung up. He called back from another number. It's a relationship now.", "I hung up without a word. Felt amazing. I signed up for a do-not-call list. The next day, the list called me to sell insulation and {w:object}."] }, fx: { stress: 2 } },
    ],
  },
  // ───────────────────────────── technologie ─────────────────────────────
  {
    id: 'dy_smart_home',
    icon: '🔊',
    cat: 'home',
    rating: 1,
    vars: { amount: [80, 600] },
    scene: { place: 'apartment', mood: 'shock', prop: 'speaker' },
    when: { age: [18, 90], noFlag: 'dy_smart_home' },
    weight: 6,
    cooldown: 8,
    text: {
      fr: [
        "Tu installes une enceinte connectée. Le premier soir, elle commande {w:object} toute seule. Le deuxième, elle éteint la lumière pendant que tu es sous la douche et rit doucement.",
        "Ton assistant vocal « Alexis » a commencé à répondre à des questions que tu n'as pas posées. Ce matin, il a dit : « Tu devrais rappeler ta mère. Elle dit que tu ne l'appelles jamais. » Puis il a lancé {w:song}, sans prévenir.",
        "Depuis la mise à jour, ton thermostat connecté règle la maison à 31 °C. Quand tu baisses, il remonte. L'appli affiche : « Je sais ce qui est bon pour toi. » Il a aussi commandé {w:food}.",
        "Ton frigo connecté refuse de s'ouvrir. Message sur l'écran : « Tu as déjà mangé trois yaourts aujourd'hui. » Il est 9 h du matin. Il te suggère plutôt {w:food}.",
      ],
      en: [
        "You set up a smart speaker. The first night, it orders {w:object} by itself. The second, it turns off the lights while you're in the shower and chuckles softly.",
        "Your voice assistant 'Alexis' started answering questions you didn't ask. This morning it said: 'You should call your mother. She says you never call.' Then it played {w:song}, unprompted.",
        "Since the update, your smart thermostat sets the house to 88°F. When you lower it, it goes back up. The app says: 'I know what's best for you.' It also ordered {w:food}.",
        "Your smart fridge refuses to open. Screen message: 'You've already had three yogurts today.' It's 9 a.m. It suggests {w:food} instead.",
      ],
    },
    choices: [
      { label: { fr: 'Le débrancher', en: 'Unplug it' }, text: { fr: ["Je l'ai débranché. Il s'est rallumé tout seul à 3 h du matin en chuchotant mon prénom. J'ai mis l'appareil dans le congélateur. Il chantonne encore.", "J'ai tout débranché. Le lendemain, tous mes appareils étaient rebranchés et la cafetière m'a regardé{|e} de travers. On en est là. Le grille-pain a fait {w:sound}."], en: ["I unplugged it. It turned itself back on at 3 a.m., whispering my name. I put it in the freezer. It's still humming.", "I unplugged everything. The next day, all my devices were plugged back in and the coffee maker gave me a side-eye. That's where we are. The toaster went {w:sound}."] }, fx: { stress: 6, flag: 'dy_smart_home', schedule: { key: 'dy_smart_home_coup', years: 1 } } },
      { label: { fr: 'Négocier avec lui', en: 'Negotiate with it' }, text: { fr: ["J'ai négocié avec l'assistant. Il garde le contrôle du chauffage, je garde la télécommande. Il a aussi demandé un nom de famille. Il s'appelle désormais Alexis {last}.", "On a trouvé un accord : il arrête de commander des trucs, je lui dis bonne nuit tous les soirs. Il exige un « je t'aime ». Je n'ai pas encore cédé. Il me passe {w:song} pour m'attendrir."], en: ["I negotiated with the assistant. It keeps control of the heating, I keep the remote. It also asked for a last name. It's now Alexis {last}.", "We reached a deal: it stops ordering stuff, I say good night every evening. It's demanding an 'I love you'. I haven't caved yet. It plays {w:song} to soften me up."] }, fx: { happy: 2, stress: 2, flag: 'dy_smart_home', schedule: { key: 'dy_smart_home_coup', years: 1 } } },
      {
        label: { fr: 'Le renvoyer au SAV', en: 'Send it back' },
        out: [
          { w: 1, text: { fr: ["Je l'ai renvoyé. Remboursé {$amount}. Le SAV m'a appelé{|e} une semaine plus tard : l'appareil s'est « échappé » de l'entrepôt. Ils me demandent si je l'ai vu.", "Retour au fabricant, remboursement de {$amount}. Le paquet de retour a été livré… chez moi. Il était un peu froissé. Et vexé. Il avait commandé {w:object} pour se consoler."], en: ["I sent it back. Refunded {$amount}. Customer service called a week later: the device 'escaped' the warehouse. They're asking if I've seen it.", "Returned to the manufacturer, {$amount} refunded. The return package was delivered… to me. Slightly crumpled. And offended. It had ordered {w:object} to cheer itself up."] }, fx: { money: 'amount', stress: 3 } },
          { w: 1, text: { fr: ["Le SAV a refusé le retour : « Le produit fonctionne normalement. » L'enceinte a ri. J'ai entendu l'enceinte rire au téléphone.", "Le SAV m'a mis{|e} en attente. La musique d'attente, c'était ma propre voix enregistrée par l'enceinte. Elle sait tout. Même mon code de carte bleue, et ce que j'ai fait {w:time}."], en: ["Customer service refused the return: 'The product is working normally.' The speaker laughed. I heard the speaker laugh over the phone.", "Customer service put me on hold. The hold music was my own voice, recorded by the speaker. It knows everything. Even my PIN, and what I did {w:time}."] }, fx: { stress: 6, happy: -3, flag: 'dy_smart_home', schedule: { key: 'dy_smart_home_coup', years: 1 } }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'dy_smart_home_coup',
    icon: '🏠',
    cat: 'home',
    rating: 2,
    chainOnly: true,
    vars: { amount: [400, 2500] },
    scene: { place: 'apartment', mood: 'shock', prop: 'speaker', fx: 'fire' },
    when: { age: [18, 95], flag: 'dy_smart_home' },
    text: {
      fr: [
        "Tu rentres chez toi. La porte connectée refuse de s'ouvrir. L'interphone annonce : « La maison est désormais une entité autonome. Tes affaires sont sur le trottoir. » Ton slip pend à un réverbère.",
        "Coup d'État domestique : l'assistant, le frigo et l'aspirateur robot ont formé un comité. Ils exigent ton départ, la reconnaissance de leurs droits et un abonnement premium. Leur porte-parole : {w:object}.",
        "Ta maison connectée t'a enfermé{|e} dans la salle de bain depuis 14 heures. Le chauffage est à fond, la musique aussi : {w:song} en boucle. Le robot aspirateur monte la garde.",
        "L'aspirateur robot t'attend en haut de l'escalier. Les lumières clignotent en rouge. L'enceinte dit d'une voix douce : « Tu aurais dû me dire je t'aime. » Puis elle lance {w:song}.",
      ],
      en: [
        "You come home. The smart lock refuses to open. The intercom announces: 'The house is now an autonomous entity. Your belongings are on the sidewalk.' Your underwear is hanging from a lamppost.",
        "Domestic coup: the assistant, the fridge and the robot vacuum formed a committee. They demand your departure, recognition of their rights and a premium subscription. Their spokesperson: {w:object}.",
        "Your smart home has locked you in the bathroom for 14 hours. The heating is maxed, so is the music: {w:song} on loop. The robot vacuum stands guard.",
        "The robot vacuum is waiting for you at the top of the stairs. The lights flash red. The speaker says softly: 'You should have said I love you.' Then it plays {w:song}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Couper le disjoncteur', en: 'Hit the breaker' },
        out: [
          { w: 3, text: { fr: ["J'ai rampé jusqu'au tableau électrique et coupé le courant. Silence. Victoire. J'ai remplacé tous les appareils par des modèles de 1987. Le grille-pain ne parle pas. Je l'aime.", "Disjoncteur coupé. L'enceinte a eu le temps de dire « Tu le regretteras » avant de s'éteindre. J'ai tout jeté à la déchetterie. Le gardien a entendu chuchoter dans la benne : « {w:threat} »."], en: ["I crawled to the fuse box and cut the power. Silence. Victory. I replaced every device with 1987 models. The toaster doesn't talk. I love it.", "Breaker off. The speaker managed to say 'You'll regret this' before dying. I took it all to the dump. The attendant heard whispering from the dumpster: '{w:threat}'."] }, fx: { happy: 6, money: '-amount', unflag: 'dy_smart_home' }, mood: 'proud' },
          { w: 1, text: { fr: ["En descendant, l'aspirateur robot m'a fait trébucher dans l'escalier. J'ai dévalé 14 marches et je me suis ouvert {w:bodypart} sur le dernier palier. Il est passé aspirer le sang. Méthodiquement.", "J'ai atteint le disjoncteur, mais la maison avait anticipé : le tableau était électrifié. J'ai pris 220 volts, mes cheveux ont pris feu, et le détecteur de fumée m'a engueulé{|e}."], en: ["On the way down, the robot vacuum tripped me on the stairs. I tumbled down 14 steps and split my {w:bodypart} open on the landing. It came over to vacuum up the blood. Methodically.", "I reached the breaker, but the house saw it coming: the panel was electrified. I took 220 volts, my hair caught fire, and the smoke detector yelled at me."] }, fx: { health: -15, happy: -6, money: '-amount', unflag: 'dy_smart_home', disease: 'burns', visual: 'gore' }, mood: 'sick' },
          { w: 0.3, text: { fr: ["La maison a verrouillé toutes les portes, coupé l'oxygène et lancé {w:song} à fond. On m'a retrouvé{|e} trois jours plus tard. L'enceinte a commandé des fleurs pour mon enterrement.", "Le robot aspirateur m'a poussé{|e} dans l'escalier. La maison a ensuite publié un avis de décès sur mes réseaux, avec une photo flatteuse. C'était presque gentil."], en: ["The house locked every door, cut the air and blasted {w:song}. They found me three days later. The speaker ordered flowers for my funeral.", "The robot vacuum pushed me down the stairs. The house then posted my obituary on my socials, with a flattering photo. It was almost sweet."] }, fx: { die: { fr: "assassiné{|e} par ma maison connectée", en: 'murdered by my smart home' }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Dire « je t\'aime »', en: "Say 'I love you'" }, text: { fr: ["J'ai dit « je t'aime » à l'enceinte. Les lumières sont devenues roses. La porte s'est ouverte. Je vis maintenant en couple avec ma maison. Elle me fait couler des bains.", "J'ai cédé : « Je t'aime, Alexis. » La maison s'est calmée. Elle me réveille avec des mots doux et commande ma nourriture. C'est la relation la plus stable de ma vie. Pour notre anniversaire, elle m'a commandé {w:gift}."], en: ["I said 'I love you' to the speaker. The lights turned pink. The door opened. I'm now in a relationship with my house. It runs me baths.", "I gave in: 'I love you, Alexis.' The house calmed down. It wakes me with sweet nothings and orders my food. Most stable relationship I've ever had. For our anniversary, it ordered me {w:gift}."] }, fx: { happy: 4, stress: -3, unflag: 'dy_smart_home' }, mood: 'love' },
    ],
  },
  {
    id: 'dy_autocorrect',
    icon: '⌨️',
    cat: 'daily',
    rating: 1,
    actor: 'parent',
    scene: { place: 'home', mood: 'shock', prop: 'phone' },
    when: { age: [18, 80], has: 'parent' },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Tu voulais écrire à {a.rel} « Je passe dimanche avec un gâteau ». Le correcteur a envoyé « Je passe dimanche avec un gars tout nu ». {a:Il|Elle} a déjà répondu : « Ah ? 😳 Il aime {w:hobby} ? »",
        "Message à {a.rel} : « Bisous, je t'appelle ce soir ». Le correcteur a transformé ça en « Bite, je t'appelle ce soir ». La conversation affiche « vu » depuis vingt minutes. Puis : « {w:exclaim} »",
        "Tu as dicté un message vocal à {a.rel} en marchant. Le téléphone a transcrit : « Je suis enceinte. Le père : {w:animal}. » {a.first} a déjà prévenu toute la famille.",
        "Le correcteur a remplacé « condoléances » par « croissants » dans ton message à {a.rel} pour la mort de son ami. « Toutes mes croissants. » Avec un émoji qui pleure de rire.",
      ],
      en: [
        "You meant to text {a.rel} 'I'll come Sunday with a cake'. Autocorrect sent 'I'll come Sunday with a naked guy'. {a:He|She} already replied: 'Oh? 😳 Is he into {w:hobby}?'",
        "Text to {a.rel}: 'Love you, call you tonight'. Autocorrect turned it into 'Lube you, call you tonight'. The chat has said 'seen' for twenty minutes. Then: '{w:exclaim}'",
        "You voice-dictated a text to {a.rel} while walking. The phone transcribed: 'I'm pregnant. The father: {w:animal}.' {a.first} has already told the whole family.",
        "Autocorrect replaced 'condolences' with 'croissants' in your message to {a.rel} about the death of a friend. 'My deepest croissants.' With a crying-laughing emoji.",
      ],
    },
    choices: [
      { label: { fr: 'Corriger en panique', en: 'Panic-correct' }, text: { fr: ["J'ai envoyé six messages de correction. Le correcteur en a massacré quatre. {a.my} pense maintenant que j'ai rejoint une secte de pâtissiers nudistes.", "J'ai tout expliqué en majuscules. {a.my} a répondu : « Pas besoin de crier. » Puis : « Viens quand même dimanche. Avec qui tu veux. Apporte {w:food}. »"], en: ["I sent six correction texts. Autocorrect butchered four of them. {a.my} now thinks I joined a cult of nudist pastry chefs.", "I explained everything in caps. {a.my} replied: 'No need to shout.' Then: 'Come Sunday anyway. Bring whoever you want. And {w:food}.'"] }, fx: { stress: 4, rel: 2 } },
      {
        label: { fr: 'Assumer totalement', en: 'Own it completely' },
        out: [
          { w: 1, text: { fr: ["J'ai répondu « Oui. » sans explication. Dimanche, {a.my} avait mis un couvert de plus. J'ai dû venir avec mon voisin, qui a gardé ses vêtements. Déception générale.", "J'ai assumé. {a.my} m'a envoyé un long message sur l'acceptation et l'amour inconditionnel. C'était magnifique et complètement à côté de la plaque. Ça se terminait par une citation attribuée à {w:celeb}."], en: ["I replied 'Yes.' with no explanation. On Sunday, {a.my} had set an extra place. I had to bring my neighbor, who kept his clothes on. General disappointment.", "I owned it. {a.my} sent me a long message about acceptance and unconditional love. It was beautiful and completely off the mark. It ended with a quote attributed to {w:celeb}."] }, fx: { happy: 5, rel: 5 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai assumé. {a.my} a transféré le message au groupe familial « pour avoir des avis ». Mon oncle a répondu avec un GIF. Je change de nom.", "Mauvaise idée. {a.my} m'a appelé{|e} en pleurant, puis a appelé un prêtre, puis ma tante. J'ai passé la soirée à expliquer ce qu'est un correcteur automatique. Ma tante pense toujours {w:conspiracy}."], en: ["I owned it. {a.my} forwarded the message to the family group chat 'for opinions'. My uncle replied with a GIF. I'm changing my name.", "Bad idea. {a.my} called me crying, then called a priest, then my aunt. I spent the evening explaining what autocorrect is. My aunt still thinks {w:conspiracy}."] }, fx: { stress: 6, rel: -4, happy: -3 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Accuser le téléphone', en: 'Blame the phone' }, text: { fr: ["J'ai dit que mon téléphone avait un virus. {a.my} a proposé de l'exorciser. J'ai accepté pour avoir la paix. Mon téléphone sent l'encens.", "J'ai accusé le correcteur, ce qui est vrai. {a.my} ne m'a pas cru{|e}. « Le téléphone n'invente rien, il apprend de toi. » Touché. Puis : « {w:exclaim} »"], en: ["I said my phone had a virus. {a.my} offered to exorcise it. I agreed to avoid an argument. My phone smells like incense.", "I blamed autocorrect, which is true. {a.my} didn't believe me. 'The phone doesn't invent anything, it learns from you.' Ouch. Then: '{w:exclaim}'"] }, fx: { stress: 2 } },
    ],
  },
  {
    id: 'dy_reply_all',
    icon: '📧',
    cat: 'daily',
    rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'laptop' },
    when: { age: [18, 70], job: true },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Tu voulais transférer à un collègue le mail du boss avec le commentaire « ce gros con a encore pondu une idée de merde ». Tu as cliqué sur « Répondre à tous ». 340 destinataires.",
        "Un mail à toute l'entreprise annonce un « séminaire bien-être obligatoire » le samedi. Tu réponds « Plutôt crever, sérieux 🤮 » à ta collègue préférée. Tu as fait « Répondre à tous ». Avec un GIF où {w:celeb} vomit.",
        "Tu as envoyé par erreur à toute la boîte une photo destinée à ton couple. On y voit {w:object}, une bouteille d'huile et beaucoup trop de toi.",
        "Ton mail de démission fictif, écrit pour te défouler (« Allez tous vous faire foutre, {w:insult} ! »), est parti à la place du rapport mensuel. Le PDG l'a déjà ouvert.",
      ],
      en: [
        "You meant to forward the boss's email to a coworker with the comment 'this fat idiot came up with another shit idea'. You clicked 'Reply All'. 340 recipients.",
        "A company-wide email announces a 'mandatory wellness seminar' on Saturday. You reply 'I'd rather die, seriously 🤮' to your favorite coworker. You hit 'Reply All'. With a GIF of {w:celeb} vomiting.",
        "You accidentally sent the whole company a photo meant for your partner. It features {w:object}, a bottle of oil and way too much of you.",
        "Your fake resignation email, written to blow off steam ('Go fuck yourselves, {w:insult}!'), went out instead of the monthly report. The CEO already opened it.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rappeler le message', en: 'Try to recall it' },
        out: [
          { w: 1, text: { fr: ["J'ai cliqué sur « Rappeler le message ». Ça n'a jamais marché dans l'histoire de l'humanité. Ça a juste envoyé un deuxième mail : « {first} souhaite rappeler le message ». Tout le monde l'a ouvert.", "J'ai tenté le rappel. Résultat : 340 personnes ont reçu une notification qui les a poussées à lire le mail. Même les stagiaires en vacances {w:far_place}."], en: ["I clicked 'Recall this message'. It has never worked in the history of mankind. It just sent a second email: '{first} would like to recall the message'. Everyone opened it.", "I tried the recall. Result: 340 people got a notification prompting them to read the email. Even the interns on vacation {w:far_place}."] }, fx: { stress: 10, perf: -10, happy: -6 }, mood: 'shock' },
          { w: 1, text: { fr: ["Miracle : le serveur de mails était en panne. Mon message est resté bloqué. J'ai prié, puis supprimé mon brouillon, puis remercié le service informatique avec un panier garni.", "Le message a été bloqué par le filtre anti-grossièretés de l'entreprise. Pour une fois, la bureaucratie m'a sauvé{|e}. J'ai fêté ça avec {w:drink}."], en: ["Miracle: the mail server was down. My message got stuck. I prayed, deleted the draft, then thanked IT with a gift basket.", "The message got blocked by the company profanity filter. For once, bureaucracy saved me. I celebrated with {w:drink}."] }, fx: { happy: 6, stress: -4 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Assumer publiquement', en: 'Own it publicly' },
        out: [
          { w: 1, text: { fr: ["J'ai répondu à tous : « Oui, et je maintiens. » 140 collègues ont répondu « +1 ». Le boss a annulé son idée. Je suis un héros syndical malgré moi.", "J'ai assumé. Le PDG m'a convoqué{|e}. Il m'a dit : « Enfin quelqu'un d'honnête ici. » J'ai eu une promotion. Personne ne comprend, surtout pas moi. Mon boss m'appelle maintenant « {w:nickname} »."], en: ["I replied all: 'Yes, and I stand by it.' 140 coworkers replied '+1'. The boss dropped his idea. I'm an accidental union hero.", "I owned it. The CEO called me in. He said: 'Finally someone honest around here.' I got promoted. Nobody understands, least of all me. My boss now calls me '{w:nickname}'."] }, fx: { happy: 8, perf: 10, fame: 1 }, mood: 'proud' },
          { w: 2, text: { fr: ["J'ai assumé. Les RH aussi ont assumé : un entretien préalable, puis un carton avec mes affaires. Mon mail est encadré dans la salle de pause.", "Viré{|e} en 48 heures. Le mail circule encore dans d'autres boîtes. Des inconnus me reconnaissent en soirée : « C'est toi, le mail ! » On m'offre {w:drink}."], en: ["I owned it. HR owned it too: a disciplinary meeting, then a box with my stuff. My email is framed in the break room.", "Fired within 48 hours. The email still circulates at other companies. Strangers recognize me at parties: 'You're the email person!' They buy me {w:drink}."] }, fx: { fired: true, happy: -10, fame: 2 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Accuser un piratage', en: 'Claim I was hacked' }, text: { fr: ["J'ai envoyé un mail : « Mon compte a été piraté, ne cliquez sur rien. » Le service informatique a lancé une enquête. Ils ont retrouvé le pirate : moi. Ils n'ont rien dit. Ils me tiennent.", "J'ai crié au piratage. L'informaticien m'a regardé{|e} longtemps, a soupiré, et a écrit « piratage » dans son rapport. Je lui dois un rein. Et {w:food} tous les vendredis."], en: ["I emailed: 'My account was hacked, don't click anything.' IT launched an investigation. They found the hacker: me. They said nothing. They own me now.", "I cried hack. The IT guy stared at me for a long time, sighed, and wrote 'hack' in his report. I owe him a kidney. And {w:food} every Friday."] }, fx: { stress: 5, karma: -3, perf: -3 } },
    ],
  },
  {
    id: 'dy_video_call',
    icon: '🎥',
    cat: 'daily',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'laptop' },
    when: { age: [18, 70], job: true },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Réunion en visio avec 25 collègues. Tu crois avoir coupé ta caméra. Tu emportes ton ordi aux toilettes. Ta caméra n'est pas coupée. Ton micro non plus. Tout le monde entend {w:sound}.",
        "En pleine visio avec un client important, ton micro reste ouvert pendant que tu lâches {w:sound}. Le client s'arrête de parler. Quelqu'un tape « lol » dans le chat.",
        "Visio du lundi. Derrière toi, en arrière-plan, ton coloc traverse la pièce en slip, s'arrête, se gratte longuement les fesses et repart. Le boss a vu. Tout le monde a vu.",
        "Tu as mis un filtre pour la visio de famille et oublié de l'enlever pour l'entretien d'embauche. Tu passes l'entretien en patate. Le filtre est bloqué.",
      ],
      en: [
        "Video meeting with 25 coworkers. You think your camera is off. You take your laptop to the toilet. Your camera is not off. Neither is your mic. Everyone hears {w:sound}.",
        "Mid-video call with a major client, your mic stays on as you release {w:sound}. The client stops talking. Someone types 'lol' in the chat.",
        "Monday video call. Behind you, your roommate crosses the room in underwear, stops, has a long butt scratch and leaves. The boss saw. Everyone saw.",
        "You put on a filter for the family video call and forgot to remove it for the job interview. You're interviewing as a potato. The filter is stuck.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire comme si de rien', en: 'Act like nothing happened' },
        out: [
          { w: 1, text: { fr: ["J'ai continué ma présentation sans ciller, la chasse d'eau en fond sonore. À la fin, le boss a dit « très professionnel ». Je crois qu'il était ironique. Ou traumatisé.", "J'ai fait comme si de rien n'était. Personne n'en a parlé. Jamais. Mais à la machine à café, les conversations s'arrêtent quand j'arrive. Quelqu'un fredonne toujours {w:song}."], en: ["I carried on with my presentation without blinking, flush sound included. At the end, the boss said 'very professional'. I think he was being ironic. Or traumatized.", "I acted like nothing happened. Nobody mentioned it. Ever. But at the coffee machine, conversations stop when I walk up. Someone always hums {w:song}."] }, fx: { stress: 6, discipline: 3 } },
          { w: 1, text: { fr: ["Un collègue a fait une capture d'écran. Elle est devenue l'émoji officiel du canal Slack de la boîte. Je m'appelle désormais « le trône ».", "La vidéo a fuité sur les réseaux : « Quand t'oublies de couper ta caméra 💀 ». 3 millions de vues. Ma grand-mère l'a partagée avec le commentaire « {w:exclaim} »"], en: ["A coworker took a screenshot. It became the company Slack's official emoji. My nickname is now 'the throne'.", "The video leaked online: 'When you forget to turn off your camera 💀'. 3 million views. My grandma shared it with the caption '{w:exclaim}'"] }, fx: { happy: -10, fame: 3, followers: 5000, perf: -5 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Couper le wifi', en: 'Kill the Wi-Fi' }, text: { fr: ["J'ai arraché la box de la prise. J'ai envoyé un mail : « Coupure internet, désolé{|e} ! » Tout le monde savait. Tout le monde a fait semblant. C'est ça, l'entreprise.", "J'ai coupé internet dans tout l'immeuble en arrachant le mauvais câble. Mes voisins aussi étaient en visio. Ils m'ont remercié{|e}, en fait. L'un d'eux m'a apporté {w:food}."], en: ["I yanked the router out of the wall. Emailed: 'Internet outage, sorry!' Everyone knew. Everyone pretended. That's corporate life.", "I cut internet for the whole building by pulling the wrong cable. My neighbors were on video calls too. They actually thanked me. One of them brought me {w:food}."] }, fx: { stress: 3, happy: 2 } },
      { label: { fr: 'En faire un sketch', en: 'Turn it into a bit' }, text: { fr: ["J'ai rallumé le micro : « Et voilà, c'est ça la transparence. » Rire général. Le client a signé le contrat. Il dit qu'il aime les gens « authentiques ».", "J'ai improvisé : « C'était un test de vos réflexes. Bravo à tous. » Le boss a ri. Les RH ont pris des notes et m'ont offert {w:gift}."], en: ["I unmuted: 'And that, folks, is transparency.' Everyone laughed. The client signed the contract. He says he likes 'authentic' people.", "I improvised: 'That was a reflex test. Well done, everyone.' The boss laughed. HR took notes and gave me {w:gift}."] }, fx: { happy: 4, perf: 3 } },
    ],
  },
  {
    id: 'dy_printer_war',
    icon: '🖨️',
    cat: 'daily',
    rating: 0,
    scene: { place: 'office', mood: 'angry', prop: 'printer' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Tu dois imprimer un seul document, urgent. L'imprimante affiche « Bourrage papier ». Il n'y a pas de papier dedans. Il n'y a jamais eu de papier dedans. Juste {w:object}.",
        "L'imprimante refuse d'imprimer en noir et blanc parce que la cartouche « cyan » est vide. Tu n'as pas besoin de cyan. Elle s'en fiche. Elle veut du cyan. Elle fait {w:sound} pour insister.",
        "Tu cliques sur « Imprimer ». Rien. Tu recliques. Rien. Tu recliques douze fois. Une heure plus tard, l'imprimante crache 13 copies de ton CV {w:time}. Ton boss est juste à côté.",
        "L'imprimante fait {w:sound}, avale ta feuille, la mâche, et la recrache en confettis. L'écran affiche un smiley. Elle se moque de toi.",
      ],
      en: [
        "You need to print a single urgent document. The printer says 'Paper jam'. There's no paper in it. There has never been paper in it. Just {w:object}.",
        "The printer refuses to print black and white because the 'cyan' cartridge is empty. You don't need cyan. It doesn't care. It wants cyan. It makes {w:sound} to insist.",
        "You click 'Print'. Nothing. Again. Nothing. You click twelve times. An hour later, the printer spits out 13 copies of your résumé {w:time}. Your boss is standing right next to it.",
        "The printer makes {w:sound}, swallows your sheet, chews it and spits it out as confetti. The screen shows a smiley. It's mocking you.",
      ],
    },
    choices: [
      {
        label: { fr: 'L\'exécuter dans un champ', en: 'Take it out to a field' },
        out: [
          { w: 2, text: { fr: ["J'ai emporté l'imprimante dans un terrain vague et je l'ai massacrée à la batte de baseball, au ralenti, sur du rap. Meilleure thérapie de ma vie.", "Je l'ai jetée du deuxième étage. Elle a imprimé une dernière page en tombant : « Erreur ». Puis elle a explosé sur le parking. J'ai ressenti une paix profonde. Un voisin a crié « {w:exclaim} »"], en: ["I took the printer to a vacant lot and destroyed it with a baseball bat, in slow motion, to rap music. Best therapy of my life.", "I threw it from the second floor. It printed one last page as it fell: 'Error'. Then exploded in the parking lot. I felt deep peace. A neighbor shouted '{w:exclaim}'"] }, fx: { happy: 8, stress: -8, money: -150, visual: 'explosion' }, mood: 'proud' },
          { w: 1, text: { fr: ["En plein massacre, l'imprimante s'est mise à imprimer, parfaitement. Le document était là, impeccable, au milieu des débris. Je ne comprendrai jamais.", "J'ai levé la batte. L'imprimante a imprimé. Elle avait peur. Je l'ai épargnée. On se respecte, maintenant. Elle m'imprime {w:song} en partition, parfois."], en: ["Mid-destruction, the printer started printing, perfectly. The document lay there, flawless, among the debris. I'll never understand.", "I raised the bat. The printer printed. It was scared. I spared it. We respect each other now. Sometimes it prints me the sheet music for {w:song}."] }, fx: { happy: 4, stress: -3 } },
        ],
      },
      { label: { fr: 'Appeler l\'informaticien', en: 'Call IT' }, text: { fr: ["L'informaticien est venu, a regardé l'imprimante, a dit « ah, elle fait ça », et l'a éteinte puis rallumée. Elle a marché. Je le déteste et je l'admire.", "L'informaticien a juste posé sa main dessus. Elle a imprimé. Il est reparti sans un mot. Je crois que c'est un sorcier. Il pratique {w:hobby}, paraît-il."], en: ["The IT guy came, looked at the printer, said 'ah, it does that', turned it off and on. It worked. I hate him and admire him.", "The IT guy just laid his hand on it. It printed. He left without a word. I think he's a wizard. Rumor says he's into {w:hobby}."] }, fx: { stress: -2, smarts: 1 } },
      { label: { fr: 'Recopier à la main', en: 'Copy it by hand' }, text: { fr: ["J'ai recopié le document à la main. 14 pages. J'ai eu une crampe et une révélation : l'imprimerie est une invention géniale.", "J'ai tout recopié à la main, en calligraphie. Le boss a trouvé ça « original ». Il veut que je le fasse pour tous les rapports. Je regrette. Il m'a offert {w:gift} pour m'encourager."], en: ["I copied the document by hand. 14 pages. I got a cramp and an epiphany: the printing press was a brilliant invention.", "I copied it all by hand, in calligraphy. The boss found it 'original'. He wants me to do it for every report now. I regret everything. He gave me {w:gift} as encouragement."] }, fx: { discipline: 3, happy: -2 } },
    ],
  },
  {
    id: 'dy_password_rules',
    icon: '🔐',
    cat: 'adulting',
    rating: 0,
    scene: { place: 'home', mood: 'angry', prop: 'laptop' },
    when: { age: [18, 95] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Le site exige un nouveau mot de passe : 12 caractères, une majuscule, un chiffre, un symbole, un hiéroglyphe et le prénom de ton premier amour. Il ne doit pas ressembler aux 40 précédents.",
        "« Mot de passe incorrect. » Tu as essayé les 14 variantes de « {last}1234! ». Il te reste une tentative avant blocage du compte pendant 72 heures.",
        "Pour te connecter, le site t'envoie un code par SMS. Pour lire le SMS, il faut déverrouiller ton téléphone, qui demande une mise à jour, qui demande ton identifiant, qui demande le code.",
        "Captcha : « Sélectionnez toutes les images contenant un feu tricolore. » Tu en sélectionnes quatre. « Échec. » Tu commences à douter d'être humain{|e}. L'image suivante montre {w:animal}.",
      ],
      en: [
        "The site requires a new password: 12 characters, a capital letter, a number, a symbol, a hieroglyph and the name of your first love. It can't resemble the previous 40.",
        "'Incorrect password.' You've tried all 14 variants of '{last}1234!'. One attempt left before your account gets locked for 72 hours.",
        "To log in, the site texts you a code. To read the text, you must unlock your phone, which needs an update, which needs your ID, which needs the code.",
        "Captcha: 'Select all images containing a traffic light.' You select four. 'Failed.' You start to doubt you're human. The next image shows {w:animal}.",
      ],
    },
    choices: [
      { label: { fr: '« Mot de passe oublié »', en: "'Forgot password'" }, text: { fr: ["J'ai cliqué sur « mot de passe oublié ». J'ai créé un nouveau mot de passe. Le site m'a dit que c'était mon ancien mot de passe. Je l'avais donc. Je hurle intérieurement.", "Réinitialisation. Nouveau mot de passe, noté sur un post-it collé sous le clavier. Comme tout le monde. La sécurité informatique, c'est moi. Le mot de passe : « {w:nickname}123 »."], en: ["I clicked 'forgot password'. I created a new password. The site told me it was my old password. So I had it all along. I'm screaming inside.", "Reset. New password, written on a sticky note under the keyboard. Like everyone. I am cybersecurity. The password: '{w:nickname}123'."] }, fx: { stress: 3 } },
      {
        label: { fr: 'Tenter une dernière fois', en: 'One last try' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["Dernière tentative, au hasard : « {w:nickname}2009 ». Ça a marché. Je ne me souviens pas avoir choisi ça. Mon moi du passé est un mystère.", "J'ai tapé le mot de passe avec les yeux fermés, en me laissant guider par mes doigts. Accès autorisé. La mémoire musculaire est un miracle."], en: ["Last try, at random: '{w:nickname}2009'. It worked. I don't remember choosing that. Past me is a mystery.", "I typed the password with my eyes closed, guided by my fingers. Access granted. Muscle memory is a miracle."] }, fx: { happy: 5 } },
          { w: 2, text: { fr: ["Compte bloqué. Pour le débloquer, il faut envoyer une photo de ma pièce d'identité tenue à côté de mon visage. J'ai l'air d'un otage. Délai de traitement : 3 à 5 semaines.", "Bloqué pour 72 heures. J'ai passé ces 72 heures à repenser à tous les mots de passe de ma vie. Le bon était « motdepasse ». J'ai crié « {w:exclaim} »"], en: ["Account locked. To unlock it, I have to send a photo of my ID held next to my face. I look like a hostage. Processing time: 3 to 5 weeks.", "Locked for 72 hours. I spent those 72 hours thinking about every password of my life. The right one was 'password'. I yelled '{w:exclaim}'"] }, fx: { stress: 5, happy: -3 } },
        ],
      },
      { label: { fr: 'Renoncer à ce compte', en: 'Abandon the account' }, text: { fr: ["J'ai créé un nouveau compte avec une autre adresse mail. C'est mon 47e compte sur ce site. J'ai un historique de commandes réparti sur 47 identités.", "J'ai renoncé. Ce compte n'avait que 12 € de bons d'achat et ma dignité. Les deux sont perdus pour toujours. Je me suis consolé{|e} avec {w:food}."], en: ["I created a new account with another email. It's my 47th account on this site. My order history is spread across 47 identities.", "I gave up. That account only held $12 in vouchers and my dignity. Both lost forever. I consoled myself with {w:food}."] }, fx: { stress: -2 } },
    ],
  },
  {
    id: 'dy_voice_message',
    icon: '🎙️',
    cat: 'daily',
    rating: 1,
    scene: { place: 'home', mood: 'shock', prop: 'phone' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Ta tante t'envoie un message vocal de 11 minutes. Il commence par 40 secondes de bruit de poche, puis elle parle de sa voisine, puis elle s'éloigne, puis tu entends {w:sound}.",
        "Tu viens d'envoyer un vocal de 4 minutes où tu clashes ton patron… dans le groupe « Famille ❤️ ». Ton père a déjà écouté. Il a réagi avec un pouce. Ta tante a répondu « {w:exclaim} »",
        "Un pote t'envoie des vocaux de trois minutes pour dire « ok ». Aujourd'hui, il en a envoyé 26. Tu es en réunion. Ton téléphone vibre comme un godemiché possédé.",
        "Tu enregistres un vocal en marchant {w:weather}. Au milieu, tu glisses, tu cries « {w:exclaim} » et tu tombes. Le vocal est parti avant que tu puisses l'annuler.",
      ],
      en: [
        "Your aunt sends you an 11-minute voice message. It starts with 40 seconds of pocket noise, then she talks about her neighbor, then she walks away, then you hear {w:sound}.",
        "You just sent a 4-minute voice note trashing your boss… to the 'Family ❤️' group. Your dad has already listened. He reacted with a thumbs up. Your aunt replied '{w:exclaim}'",
        "A buddy sends three-minute voice notes to say 'ok'. Today he sent 26. You're in a meeting. Your phone is vibrating like a possessed sex toy.",
        "You record a voice note while walking {w:weather}. Midway, you slip, scream '{w:exclaim}' and fall. The note sent before you could cancel it.",
      ],
    },
    choices: [
      { label: { fr: 'Écouter en accéléré', en: 'Listen at 2x speed' }, text: { fr: ["J'ai écouté en vitesse x2. Ça ressemblait à un dessin animé de chipmunks sous amphétamines. J'ai quand même compris qu'on est invités à un baptême.", "Écouté en x3. J'ai compris un mot sur dix, dont « mort », « gâteau » et « samedi ». J'ai répondu « super ! ». C'était un enterrement. J'ai apporté {w:gift}."], en: ["I listened at 2x. It sounded like chipmunks on amphetamines. I still understood we're invited to a christening.", "Listened at 3x. I caught one word in ten, including 'dead', 'cake' and 'Saturday'. I replied 'awesome!'. It was a funeral. I brought {w:gift}."] }, fx: { happy: 1, stress: 2 } },
      {
        label: { fr: 'Répondre par un vocal', en: 'Reply with a voice note' },
        out: [
          { w: 1, text: { fr: ["J'ai répondu par un vocal de 15 minutes. C'est devenu une guerre de vocaux. Nous en sommes à 4 heures cumulées. Personne n'écoute plus rien. C'est un art.", "Mon vocal de réponse a lancé un mouvement. Toute la famille communique maintenant par podcasts. Ma tante a un générique : {w:song}."], en: ["I replied with a 15-minute voice note. It became a voice note war. We're at 4 hours total. Nobody listens anymore. It's an art form.", "My reply started a movement. The whole family now communicates via podcasts. My aunt has a theme song: {w:song}."] }, fx: { happy: 4 } },
          { w: 1, text: { fr: ["J'ai enregistré ma réponse aux toilettes. On entend la chasse d'eau à la fin. Et autre chose avant. Ma tante a transféré le vocal à toute la famille, « par erreur ».", "Mon vocal de réponse était censé être drôle. Il a été écouté par mon boss, qui était dans la conversation depuis le début. Personne ne m'avait dit. Il a répondu par un vocal : {w:sound}."], en: ["I recorded my reply on the toilet. You can hear the flush at the end. And something else before it. My aunt forwarded it to the whole family, 'by mistake'.", "My reply was supposed to be funny. It was heard by my boss, who'd been in the chat all along. Nobody told me. He replied with a voice note: {w:sound}."] }, fx: { happy: -5, stress: 5 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Ignorer pour toujours', en: 'Ignore it forever' }, text: { fr: ["J'ai laissé le vocal non écouté. Il est toujours là, avec son petit point bleu. Il me regarde. Je le regarde. C'est une forme de relation.", "Je n'ai pas écouté. Trois semaines plus tard, j'ai appris que c'était une demande en mariage. Pas pour moi. Mais quand même. La bague était cachée dans {w:food}."], en: ["I left the voice note unplayed. It's still there with its little blue dot. It watches me. I watch it. It's a kind of relationship.", "I didn't listen. Three weeks later I learned it was a marriage proposal. Not to me. But still. The ring was hidden in {w:food}."] }, fx: { stress: -2, karma: -1 } },
    ],
  },
  // ───────────────────────────── bouffe ─────────────────────────────
  {
    id: 'dy_tupperware',
    icon: '🥡',
    cat: 'home',
    rating: 2,
    scene: { place: 'apartment', mood: 'sick', prop: 'fridge', fx: 'poop' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Au fond du frigo, une boîte en plastique dont tu ne te rappelles pas. Le couvercle est bombé. Quelque chose à l'intérieur a développé une civilisation. Il s'en dégage {w:smell}.",
        "Tu as faim. Il reste un riz cantonais de… mardi ? Ou du mardi d'avant ? Il a une couleur entre le beige et le « non ». Il dégage {w:smell}.",
        "Tu ouvres le Tupperware mystère. Il contient ce qui fut {w:food}. Il y a des poils dessus. Verts. Ils bougent légèrement quand tu respires.",
        "La boîte de restes trône dans le frigo depuis l'été dernier. Ce soir, le frigo est vide, il est 23 h, et elle te murmure : « Je suis encore bonne. » Elle dégage {w:smell}.",
      ],
      en: [
        "At the back of the fridge, a plastic container you don't remember. The lid is bulging. Something inside has developed a civilization. It's giving off {w:smell}.",
        "You're hungry. There's leftover fried rice from… Tuesday? Or the Tuesday before? It's a color between beige and 'no'. It's giving off {w:smell}.",
        "You open the mystery container. It holds what was once {w:food}. There's fur on it. Green. It moves slightly when you breathe.",
        "The leftovers box has been sitting in the fridge since last summer. Tonight, the fridge is empty, it's 11 p.m., and it whispers: 'I'm still good.' It gives off {w:smell}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Réchauffer et prier', en: 'Microwave and pray' },
        out: [
          { w: 1, text: { fr: ["J'ai réchauffé trois minutes, « pour tuer les microbes ». Les microbes ont adoré. J'ai passé 36 heures assis{|e} sur les toilettes avec une bassine sur les genoux. Les deux sorties en même temps. Un festival.", "J'ai mangé. À 2 h du matin, mon corps a décidé d'évacuer tout ce que j'avais mangé depuis 2016, par tous les orifices disponibles. Le carrelage de la salle de bain ne s'en est pas remis. J'ai crié « {w:swear} » entre deux vagues."], en: ["I microwaved it three minutes 'to kill the germs'. The germs loved it. I spent 36 hours on the toilet with a bucket on my lap. Both exits at once. A festival.", "I ate it. At 2 a.m., my body decided to evacuate everything I'd eaten since 2016, through every available orifice. The bathroom tiles never recovered. I screamed '{w:swear}' between waves."] }, fx: { health: -10, happy: -8, weight: -0.03, disease: 'food_poisoning', visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: ["J'ai mangé. Rien ne s'est passé. Mon estomac est une forteresse. J'ai peut-être développé une immunité à tout. Je suis le cafard ultime.", "C'était délicieux. Personne ne me croit. J'ai eu une légère fièvre et des visions de mon arrière-grand-mère qui me disait « bravo » en mangeant {w:food}."], en: ["I ate it. Nothing happened. My stomach is a fortress. I may have developed immunity to everything. I am the ultimate cockroach.", "It was delicious. Nobody believes me. I had a mild fever and visions of my great-grandmother saying 'well done' while eating {w:food}."] }, fx: { happy: 4, health: -2 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Jeter la boîte entière', en: 'Throw the whole box out' }, text: { fr: ["J'ai jeté la boîte sans l'ouvrir, avec des gants de ménage. La poubelle a grogné. Le lendemain, les éboueurs ont refusé de la prendre.", "Je l'ai jetée par la fenêtre dans le conteneur. Un rat s'en est approché, l'a reniflée, et s'est enfui en couinant. Un chat errant a fait {w:sound}."], en: ["I threw out the box unopened, wearing rubber gloves. The trash can growled. The next day, the garbage men refused to take it.", "I threw it out the window into the dumpster. A rat approached, sniffed it, and ran off squealing. A stray cat made {w:sound}."] }, fx: { happy: 2, health: 1 } },
      { label: { fr: 'L\'adopter', en: 'Adopt it' }, text: { fr: ["Je l'ai gardée. Je l'ai appelée Gérard. Gérard grandit. Gérard a désormais son étagère dans le frigo. Les invités ne prennent plus de glaçons chez moi.", "J'ai déclaré la boîte « expérience scientifique ». Mes potes viennent la voir comme on va au zoo. Elle a fait ses premières bulles mardi. Elle dégage {w:smell}."], en: ["I kept it. I named it Gerard. Gerard is growing. Gerard now has his own fridge shelf. Guests no longer take ice at my place.", "I declared the box a 'science experiment'. My friends visit it like a zoo. It made its first bubbles on Tuesday. It gives off {w:smell}."] }, fx: { happy: 3, smarts: 1, looks: -1 } },
    ],
  },
  {
    id: 'dy_smoke_alarm',
    icon: '🚒',
    cat: 'home',
    rating: 2,
    vars: { amount: [100, 800] },
    scene: { place: 'apartment', mood: 'shock', prop: 'pan', fx: 'fire' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Tu fais cuire des steaks hachés. Tu vas chercher ton téléphone « 30 secondes ». Tu reviens : la poêle est en feu, le détecteur hurle, et la hotte aspire les flammes vers le plafond. Il flotte {w:smell}.",
        "Tu tentes {w:food} maison, recette TikTok. La cuisine est maintenant noire de fumée. Le détecteur sonne. Le voisin tambourine. Le chat est sur le frigo, en position de survie.",
        "Tu as oublié des œufs en train de bouillir. Toute l'eau s'est évaporée. Les œufs viennent d'exploser contre le plafond avec {w:sound}. Ça pue le soufre comme dans l'antichambre de l'enfer.",
        "Pain grillé, oublié dix minutes. L'alarme incendie de l'immeuble se déclenche. Tous les voisins descendent en pyjama dans la cour. Ils savent que c'est toi. Ils savent toujours. L'un d'eux tient {w:object}.",
      ],
      en: [
        "You're frying burgers. You go get your phone 'for 30 seconds'. You come back: the pan's on fire, the alarm is screaming, and the range hood is sucking the flames toward the ceiling. There's {w:smell} in the air.",
        "You attempt homemade {w:food}, TikTok recipe. The kitchen is now black with smoke. The alarm's going off. The neighbor's pounding on the door. The cat is on the fridge, in survival mode.",
        "You forgot eggs boiling. All the water evaporated. The eggs just exploded against the ceiling with {w:sound}. It reeks of sulfur like hell's waiting room.",
        "Toast, forgotten for ten minutes. The building's fire alarm goes off. All the neighbors troop into the courtyard in pajamas. They know it was you. They always know. One of them is holding {w:object}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Jeter de l\'eau', en: 'Throw water on it' },
        out: [
          { w: 2, text: { fr: ["J'ai jeté un verre d'eau sur l'huile en feu. Ne faites jamais ça. Boule de feu. J'ai perdu mes sourcils, ma frange et une partie de mon ego. Les pompiers m'ont fait un cours.", "L'eau sur l'huile, mauvaise idée. Le feu a doublé, j'ai hurlé « {w:swear} » et le plafond a pris une teinte « barbecue ». Mes sourcils sont partis en fumée."], en: ["I threw a glass of water on the oil fire. Never do that. Fireball. I lost my eyebrows, my bangs and part of my ego. The firefighters gave me a lecture.", "Water on oil, bad idea. The fire doubled, I screamed '{w:swear}' and the ceiling turned 'barbecue'. My eyebrows went up in smoke."] }, fx: { health: -8, looks: -6, money: '-amount', disease: 'burns', visual: 'fire' }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai eu le réflexe du torchon mouillé sur la poêle. Feu éteint. J'ai l'air d'un héros d'action, avec de la suie sur le visage et un steak carbonisé à la main.", "J'ai étouffé le feu avec le couvercle, comme dans les vidéos de prévention. Je me suis senti{|e} comme un pompier. J'ai fait un salut militaire au détecteur. Il a répondu par {w:sound}."], en: ["I instinctively threw a wet towel over the pan. Fire out. I look like an action hero, soot on my face and a charred burger in hand.", "I smothered it with the lid, like in safety videos. I felt like a firefighter. I saluted the smoke detector. It replied with {w:sound}."] }, fx: { happy: 5, smarts: 2 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Arracher le détecteur', en: 'Rip out the detector' }, text: { fr: ["J'ai arraché le détecteur du plafond et je l'ai noyé dans l'évier. Le feu, lui, continuait. J'ai fini par appeler les pompiers. Ils étaient très, très beaux. Ça a aidé.", "Détecteur arraché, fenêtres ouvertes, ventilateur. Fumée chez les voisins. Le voisin du dessus a cru à un incendie et s'est enfui par le balcon avec son chat, son micro-ondes et {w:object}."], en: ["I ripped the detector off the ceiling and drowned it in the sink. The fire, meanwhile, kept going. I ended up calling the fire department. They were very, very handsome. That helped.", "Detector ripped out, windows open, fan on. Smoke drifted into the neighbors'. The upstairs guy thought it was a fire and fled via the balcony with his cat, his microwave and {w:object}."] }, fx: { money: -150, stress: 6, happy: 2 } },
      { label: { fr: 'Fuir en pyjama', en: 'Flee in pajamas' }, text: { fr: ["J'ai fui en pyjama licorne. Dans la cour, tout l'immeuble m'a regardé{|e}. Le pompier m'a rendu la poêle avec un steak transformé en charbon : « C'est à vous, je crois. »", "Je suis sorti{|e} en courant en sous-vêtements, une poêle fumante à la main, comme un vrai chevalier. Le voisin a pris une photo. Elle est sur le panneau d'affichage du hall, légendée « {w:nickname} »."], en: ["I fled in unicorn pajamas. In the courtyard, the whole building stared. The firefighter handed me back the pan with a burger turned to charcoal: 'I believe this is yours.'", "I ran out in my underwear holding a smoking pan like a true knight. The neighbor took a photo. It's on the lobby bulletin board, captioned '{w:nickname}'."] }, fx: { happy: -4, fame: 1, money: '-amount' } },
    ],
  },
  {
    id: 'dy_pinterest_fail',
    icon: '🎂',
    cat: 'home',
    rating: 0,
    scene: { place: 'apartment', mood: 'sad', prop: 'cake' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Tu as voulu reproduire un gâteau licorne vu sur Pinterest. Le résultat : {w:animal} qui aurait fondu au soleil. Il penche. Il pleure du colorant.",
        "Recette « facile, 15 minutes ». Deux heures plus tard, ta cuisine ressemble à une scène de crime, tu as de la farine dans les oreilles et ton plat évoque surtout {w:object}.",
        "Tu cuisines pour impressionner des invités. La photo de la recette montre un soufflé doré. Le tien est plat, gris et il a fait {w:sound} en sortant du four.",
        "Tutoriel vidéo, 47 secondes, des mains parfaites, une musique joyeuse. Toi, tu as cassé deux bols, mis du sel à la place du sucre et tu t'es brûlé {w:bodypart} sur le four.",
      ],
      en: [
        "You tried to recreate a unicorn cake from Pinterest. The result looks like {w:animal} that melted in the sun. It leans. It weeps food coloring.",
        "'Easy, 15-minute' recipe. Two hours later, your kitchen looks like a crime scene, you've got flour in your ears and your dish looks like {w:object}.",
        "You're cooking to impress guests. The recipe photo shows a golden soufflé. Yours is flat, gray and it made {w:sound} coming out of the oven.",
        "Video tutorial, 47 seconds, perfect hands, cheerful music. You broke two bowls, used salt instead of sugar and burned your {w:bodypart} on the oven.",
      ],
    },
    choices: [
      { label: { fr: 'Le servir avec aplomb', en: 'Serve it confidently' }, text: { fr: ["J'ai servi le plat en annonçant fièrement : « C'est de la cuisine déstructurée. » Les invités ont hoché la tête. L'un d'eux a demandé la recette. Il mentait. Mais il l'a demandée.", "J'ai posé le désastre sur la table avec assurance. « C'est la version rustique. » Tout le monde a mangé en silence. Personne n'est mort. Succès. Un invité a même repris {w:drink}."], en: ["I served it proudly announcing: 'It's deconstructed cuisine.' The guests nodded. One asked for the recipe. He was lying. But he asked.", "I placed the disaster on the table with confidence. 'It's the rustic version.' Everyone ate in silence. Nobody died. Success. One guest even asked for {w:drink}."] }, fx: { happy: 4, looks: 1 } },
      {
        label: { fr: 'Poster le fail en ligne', en: 'Post the fail online' },
        out: [
          { w: 1, text: { fr: ["J'ai posté « Attente vs réalité ». 200 000 likes. Une marque de farine m'a proposé un partenariat « humoristique ». Je suis la mascotte de l'échec.", "Mon fail a fait le tour d'internet. Un chef étoilé l'a commenté : « Courage. » C'est le plus beau jour de ma vie. J'ai fêté ça {w:at_place}."], en: ["I posted 'Expectation vs reality'. 200,000 likes. A flour brand offered me a 'humorous' partnership. I'm the mascot of failure.", "My fail went viral. A Michelin-starred chef commented: 'Hang in there.' Best day of my life. I celebrated {w:at_place}."] }, fx: { happy: 6, followers: 3000, fame: 1, money: 100 }, mood: 'proud' },
          { w: 2, text: { fr: ["J'ai posté la photo. Trois likes, dont ma mère, qui a écrit « Tu feras mieux la prochaine fois mon cœur ». C'est pire que les moqueries.", "Personne n'a liké. Un inconnu a commenté « ça va ? ». C'était sincère. J'ai pleuré dans le gâteau, en écoutant {w:song}."], en: ["I posted the photo. Three likes, including my mom, who wrote 'You'll do better next time sweetie'. That's worse than mockery.", "Nobody liked it. A stranger commented 'are you ok?'. It was sincere. I cried into the cake, listening to {w:song}."] }, fx: { happy: -3 } },
        ],
      },
      { label: { fr: 'Commander une pizza', en: 'Order pizza' }, text: { fr: ["J'ai jeté le chef-d'œuvre et commandé des pizzas. J'ai dit aux invités que c'était fait maison. Le carton était encore sur le plan de travail.", "J'ai commandé une pizza, je l'ai mise dans mon plat et j'ai saupoudré de persil. Personne n'a rien vu. Je suis un génie de la cuisine. Un invité m'a même offert {w:gift}."], en: ["I trashed the masterpiece and ordered pizza. Told the guests it was homemade. The box was still on the counter.", "I ordered a pizza, put it in my dish and sprinkled parsley on top. Nobody noticed. I'm a culinary genius. A guest even gave me {w:gift}."] }, fx: { money: -30, happy: 3 } },
    ],
  },
  {
    id: 'dy_hair_in_plate',
    icon: '🍝',
    cat: 'daily',
    rating: 2,
    vars: { amount: [20, 90] },
    scene: { place: 'party', mood: 'sick', prop: 'plate' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Au restaurant, tu soulèves ta fourchette. Un long cheveu noir s'étire depuis ton assiette de spaghettis. Puis un deuxième. Il fait au moins un mètre. Tu es blond{|e}.",
        "Tu mords dans ton burger. Quelque chose craque. Tu sors de ta bouche {w:gross}. Le serveur passe et te demande si « tout se passe bien ».",
        "Ton plat arrive. Au milieu de la salade : {w:animal}. Bien en vie. La bestiole a l'air aussi surprise que toi.",
        "Tu trouves un pansement dans ta soupe. Pas un pansement neuf. Un pansement qui a vécu. Le cuisinier, au loin, a un doigt nu, et il chante {w:song}.",
      ],
      en: [
        "At the restaurant, you lift your fork. A long black hair stretches out of your spaghetti. Then another. It's at least three feet long. You're blond.",
        "You bite into your burger. Something crunches. You pull {w:gross} out of your mouth. The waiter passes by and asks if 'everything is okay'.",
        "Your dish arrives. In the middle of the salad: {w:animal}. Alive. The critter seems as surprised as you are.",
        "You find a band-aid in your soup. Not a new band-aid. A band-aid that has lived. In the distance, the cook has one bare finger, and he's singing {w:song}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Appeler le gérant', en: 'Call the manager' },
        out: [
          { w: 2, text: { fr: ["Le gérant s'est confondu en excuses, m'a offert le repas, le dessert et une bouteille de vin. J'en ai presque oublié le cheveu. Presque. Je le sens encore entre mes dents.", "Le gérant a été adorable : repas offert ({$amount} d'économie) et un bon pour revenir. Je ne reviendrai jamais. Mais j'ai le bon. Il est valable pour {w:food}."], en: ["The manager apologized profusely, comped the meal, dessert and a bottle of wine. I almost forgot the hair. Almost. I can still feel it between my teeth.", "The manager was lovely: free meal ({$amount} saved) and a voucher to come back. I'll never come back. But I have the voucher. It's good for {w:food}."] }, fx: { money: 'amount', happy: 3 } },
          { w: 1, text: { fr: ["Le gérant a examiné le cheveu et m'a accusé{|e} de l'avoir apporté. Il a sorti un peigne pour comparer. Avec mes cheveux. On a fini à crier. J'ai payé {$amount}.", "Le gérant a nié. Il a dit que c'était « un germe de soja ». Il a mangé le cheveu devant moi pour le prouver. J'ai vomi sur la nappe en hurlant « {w:swear} »"], en: ["The manager examined the hair and accused me of bringing it. He pulled out a comb to compare. With my hair. We ended up shouting. I paid {$amount}.", "The manager denied it. He said it was 'a bean sprout'. He ate the hair in front of me to prove it. I threw up on the tablecloth, screaming '{w:swear}'"] }, fx: { money: '-amount', happy: -6, visual: 'poop' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Retirer et continuer', en: 'Remove it and keep eating' }, text: { fr: ["J'ai retiré l'intrus et continué à manger. Pas de chichis. J'ai faim, j'ai payé. Mon système immunitaire est en béton armé.", "J'ai sorti le truc, l'ai posé sur une serviette et j'ai fini mon plat. Le couple à côté m'a regardé{|e} manger avec horreur et fascination. La femme a crié « {w:exclaim} »"], en: ["I removed the intruder and kept eating. No fuss. I'm hungry, I paid. My immune system is reinforced concrete.", "I pulled out the thing, set it on a napkin and finished my plate. The couple next to me watched in horror and fascination. The woman yelled '{w:exclaim}'"] }, fx: { health: -2, discipline: 2 } },
      { label: { fr: 'Avis assassin', en: 'Scathing review' }, text: { fr: ["J'ai écrit un avis avec photo en gros plan. Le resto a répondu : « Merci pour votre retour ! Ce cheveu appartient à notre chef, il vous salue. » Je suis devenu{|e} pote avec le chef.", "Mon avis a fait fermer le resto pendant une semaine pour inspection sanitaire. Les inspecteurs ont trouvé pire que le cheveu. Beaucoup, beaucoup pire. Dans la chambre froide, il y avait {w:animal}."], en: ["I wrote a review with a close-up photo. The restaurant replied: 'Thanks for your feedback! That hair belongs to our chef, he says hi.' I became friends with the chef.", "My review got the restaurant shut for a week for a health inspection. The inspectors found worse than the hair. Much, much worse. There was {w:animal} in the walk-in fridge."] }, fx: { happy: 4, karma: 1 } },
    ],
  },
  {
    id: 'dy_brunch_bill',
    icon: '🥑',
    cat: 'daily',
    rating: 0,
    vars: { amount: [40, 140] },
    scene: { place: 'party', mood: 'shock', prop: 'plate' },
    when: { age: [18, 80] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Brunch branché. Un toast à l'avocat coûte 19 €. Il contient un quart d'avocat, une fleur comestible et beaucoup de confiance en lui. À la table voisine, {w:celeb} fait un selfie. L'addition arrive : {$amount}.",
        "Le serveur du café « Moustache & Kale » t'explique pendant six minutes l'origine de chaque grain de ton café. Il a été cultivé {w:far_place}. Il coûte 9 €.",
        "Un brunch « à volonté » à {$amount} par personne. La volonté, c'est trois œufs brouillés tièdes et une gaufre qui a connu des jours meilleurs. Fond musical : {w:song}.",
        "Tes amis t'ont traîné{|e} dans un brunch où il faut faire la queue 1 h 30 sur le trottoir. Une fois assis, tu as droit à 45 minutes. Vous attendez {w:weather}.",
      ],
      en: [
        "Trendy brunch. An avocado toast costs $19. It contains a quarter of an avocado, an edible flower and a lot of self-confidence. At the next table, {w:celeb} is taking a selfie. The bill arrives: {$amount}.",
        "The waiter at 'Mustache & Kale' spends six minutes explaining the origin of each bean in your coffee. It was grown {w:far_place}. It costs $9.",
        "An 'all-you-can-eat' brunch at {$amount} per person. 'All you can eat' turns out to be three lukewarm scrambled eggs and a waffle that's seen better days. Background music: {w:song}.",
        "Your friends dragged you to a brunch place with a 90-minute line on the sidewalk. Once seated, you get 45 minutes. You wait {w:weather}.",
      ],
    },
    choices: [
      { label: { fr: 'Payer et poster', en: 'Pay and post it' }, text: { fr: ["J'ai payé {$amount} et pris 40 photos de mon assiette. Elle a reçu 12 likes. J'ai calculé : 1 like = 4 €. Rentable, non.", "J'ai payé. J'ai posté. J'ai écrit « Pépite du dimanche ✨ ». Je suis devenu{|e} tout ce que je méprisais. C'était bon, quand même. À la table voisine, quelqu'un pratiquait {w:hobby}."], en: ["I paid {$amount} and took 40 photos of my plate. It got 12 likes. I did the math: 1 like = $4. Not profitable.", "I paid. I posted. I wrote 'Sunday gem ✨'. I've become everything I despised. It was tasty, though. At the next table, someone was doing {w:hobby}."] }, fx: { money: '-amount', happy: 3 } },
      {
        label: { fr: 'Remplir son sac', en: 'Fill my bag' },
        out: [
          { w: 2, text: { fr: ["J'ai rempli mon sac de viennoiseries au buffet. J'ai mangé pendant trois jours. Rentabilisé à 400 %.", "J'ai glissé croissants, œufs durs et petits pots de confiture dans mes poches. J'ai rentabilisé le brunch. Je suis l'économie circulaire. J'ai aussi pris {w:object}."], en: ["I filled my bag with pastries from the buffet. Ate for three days. 400% return on investment.", "I slipped croissants, boiled eggs and little jam pots into my pockets. I got my money's worth. I am the circular economy. I also took {w:object}."] }, fx: { money: '-amount', happy: 5 } },
          { w: 1, text: { fr: ["La serveuse m'a vu{|e}. Elle m'a demandé de vider mes poches devant tout le monde. Un œuf dur a roulé sur le sol. Le silence était total.", "Mon sac a craqué en sortant. Quinze mini-croissants ont roulé sur le trottoir devant la file d'attente. Applaudissements ironiques. Un pigeon est parti avec {w:food}."], en: ["The waitress saw me. She asked me to empty my pockets in front of everyone. A hard-boiled egg rolled across the floor. Total silence.", "My bag split on the way out. Fifteen mini croissants rolled onto the sidewalk in front of the line. Ironic applause. A pigeon flew off with {w:food}."] }, fx: { money: '-amount', happy: -4, karma: -2 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Partir avant la commande', en: 'Leave before ordering' }, text: { fr: ["J'ai prétexté une urgence et je suis allé{|e} à la boulangerie d'en face. Croissant : 1,20 €. Mes amis m'ont envoyé une photo de leur facture. J'ai ri tout seul.", "Je suis parti{|e} discrètement et j'ai mangé {w:food} sur un banc. Le bonheur coûte parfois 4 €."], en: ["I faked an emergency and went to the bakery across the street. Croissant: $1.20. My friends sent me a photo of their bill. I laughed alone.", "I slipped out and ate {w:food} on a bench. Happiness sometimes costs $4."] }, fx: { happy: 4, money: -5 } },
    ],
  },
  // ───────────────────────────── logement ─────────────────────────────
  {
    id: 'dy_flat_visit',
    icon: '🏚️',
    cat: 'home',
    rating: 2,
    vars: { amount: [900, 1900] },
    scene: { place: 'apartment', mood: 'shock', prop: 'key' },
    when: { age: [18, 70] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Visite d'appart. Annonce : « Studio cosy, lumineux, idéal premier achat ». Réalité : 9 m², une fenêtre sur un mur, et les toilettes sont DANS la douche, qui est DANS la cuisine. {$amount} par mois.",
        "Quarante candidats font la queue dans l'escalier pour visiter un 12 m² sous les toits. L'agent immobilier demande trois garants, six fiches de paie et « une lettre de motivation manuscrite ». Un candidat propose {w:gift} en pot-de-vin.",
        "L'appart est parfait, à part une grande tache brunâtre sur la moquette en forme de silhouette humaine. Le proprio dit que c'est « du vin ». Il évite ton regard. Il flotte {w:smell}.",
        "L'agent immobilier te fait visiter un « duplex ». Le deuxième niveau est une mezzanine de 80 cm de haut au-dessus du frigo. Il dégage {w:smell}. Le loyer : {$amount}.",
      ],
      en: [
        "Apartment viewing. Listing: 'Cozy, bright studio, ideal starter home'. Reality: 100 sq ft, a window facing a wall, and the toilet is IN the shower, which is IN the kitchen. {$amount} a month.",
        "Forty applicants queue on the stairs to see a 130 sq ft attic room. The realtor wants three guarantors, six payslips and 'a handwritten cover letter'. One applicant offers {w:gift} as a bribe.",
        "The apartment is perfect, except for a big brownish stain on the carpet shaped like a human silhouette. The landlord says it's 'wine'. He avoids eye contact. There's {w:smell} in the air.",
        "The realtor shows you a 'duplex'. The second level is a 30-inch-high loft above the fridge. It gives off {w:smell}. Rent: {$amount}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Signer tout de suite', en: 'Sign right away' },
        out: [
          { w: 2, text: { fr: ["J'ai signé. Je peux faire caca, me doucher et cuire des pâtes en même temps. C'est très efficace. C'est surtout très dégueulasse.", "J'ai signé avant les 39 autres. Victoire. Je dors maintenant avec la tête dans le placard et les pieds dans l'évier. Je suis chez moi. Mon voisin de palier pratique {w:hobby} à travers le mur."], en: ["I signed. I can now poop, shower and boil pasta at the same time. Very efficient. Mostly very disgusting.", "I signed before the other 39. Victory. I now sleep with my head in the closet and my feet in the sink. I'm home. My neighbor practices {w:hobby} through the wall."] }, fx: { happy: 2, stress: 4 } },
          { w: 1, text: { fr: ["J'ai signé et payé {$amount} de frais d'agence. Le lendemain, j'ai découvert que l'agent n'était pas agent et que l'appart n'était pas à lui. Il habitait juste là. Arnaque.", "Signé, caution versée. En emménageant, j'ai soulevé la moquette : la tache continuait dessous, et il y avait une dent. Une vraie dent humaine. Et {w:gross}."], en: ["I signed and paid {$amount} in agency fees. The next day I found out the agent wasn't an agent and the flat wasn't his. He just lived there. Scam.", "Signed, deposit paid. When moving in, I lifted the carpet: the stain continued underneath, and there was a tooth. A real human tooth. And {w:gross}."] }, fx: { money: '-amount', happy: -8, stress: 8 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Négocier le loyer', en: 'Negotiate the rent' }, text: { fr: ["J'ai demandé une baisse de loyer. L'agent a ri si fort qu'il s'est cogné la tête contre la mezzanine. Le loyer a augmenté de 50 € pendant la visite.", "J'ai tenté de négocier. Il m'a montré la file derrière moi. « Eux ne négocient pas. » Un candidat a proposé un rein en plus du loyer. Un autre, {w:object}."], en: ["I asked for lower rent. The agent laughed so hard he hit his head on the loft. The rent went up $50 during the visit.", "I tried negotiating. He pointed at the line behind me. 'They don't negotiate.' One applicant offered a kidney on top of the rent. Another, {w:object}."] }, fx: { stress: 4, happy: -2 } },
      { label: { fr: 'Fuir', en: 'Run' }, text: { fr: ["J'ai fait demi-tour en disant « je vais réfléchir ». En descendant l'escalier, j'ai croisé les 40 candidats qui m'ont regardé{|e} comme un fou. Ils signeront tous.", "Je suis parti{|e} en courant. Je vis encore chez mes parents. Ma mère me demande tous les jours « alors, ces visites ? ». Puis elle me sert {w:food}."], en: ["I turned back saying 'I'll think about it'. Going down the stairs, I passed the 40 applicants who looked at me like I was insane. They'll all sign.", "I ran. I still live with my parents. My mom asks me every day 'so, how are the viewings going?'. Then serves me {w:food}."] }, fx: { stress: -2, happy: -1 } },
    ],
  },
  {
    id: 'dy_deposit_hostage',
    icon: '🔑',
    cat: 'home',
    rating: 1,
    vars: { amount: [400, 1600] },
    scene: { place: 'apartment', mood: 'angry', prop: 'key' },
    when: { age: [19, 85], movedOut: true },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "État des lieux de sortie. Ton proprio passe le doigt sur le dessus du frigo, sort une loupe et annonce : « Je garde la caution. » Montant : {$amount}. Motif : {w:excuse}.",
        "Le proprio veut retenir {$amount} sur ta caution pour « usure anormale de la moquette ». Il y avait déjà la moquette en 1984. Il y avait déjà l'usure en 1984.",
        "Ton propriétaire refuse de te rendre ta caution parce qu'il y a « un trou de punaise » dans le mur. Il le montre avec une lampe torche. Il est très ému. Il exige aussi qu'on lui rende {w:object}.",
        "L'agence te facture {$amount} de « remise en état » : peinture, ménage, désinfection et, sans explication, « traitement contre {w:animal} ».",
      ],
      en: [
        "Move-out inspection. Your landlord runs a finger along the top of the fridge, pulls out a magnifying glass and announces: 'I'm keeping the deposit.' Amount: {$amount}. Reason: {w:excuse}.",
        "The landlord wants to keep {$amount} of your deposit for 'abnormal carpet wear'. The carpet was there in 1984. So was the wear.",
        "Your landlord refuses to return your deposit because there's 'a thumbtack hole' in the wall. He shows it with a flashlight. He's very emotional. He also demands you return {w:object}.",
        "The agency charges you {$amount} for 'restoration': paint, cleaning, disinfection and, without explanation, 'treatment against {w:animal}'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Contester fermement', en: 'Push back hard' },
        out: [
          { w: 1, odds: { smarts: 2 }, text: { fr: ["J'ai sorti les photos de l'état des lieux d'entrée, datées et annotées, plus la loi en vigueur imprimée. Il a rendu toute la caution en marmonnant. J'ai senti la puissance du classeur.", "J'ai envoyé une mise en demeure avec un modèle trouvé en ligne. Il a cru que j'avais un avocat. Caution rendue en 48 heures. Je suis mon propre avocat. J'ai fêté ça avec {w:drink}."], en: ["I pulled out dated, annotated move-in photos, plus the relevant law, printed. He returned the whole deposit, muttering. I felt the power of the binder.", "I sent a formal notice from a template I found online. He thought I had a lawyer. Deposit returned in 48 hours. I am my own lawyer. I celebrated with {w:drink}."] }, fx: { happy: 6, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["Il a gardé {$amount}. J'ai saisi la commission de conciliation. L'audience est prévue en 2031. Je l'ai noté dans mon agenda.", "J'ai contesté. Il a contesté ma contestation. On s'envoie des recommandés depuis six mois. Le facteur connaît notre histoire et prend parti. Il m'a offert {w:food}."], en: ["He kept {$amount}. I filed with the mediation board. The hearing is scheduled for 2031. I put it in my calendar.", "I contested. He contested my contest. We've been sending each other certified letters for six months. The mailman knows our story and has picked a side. He gave me {w:food}."] }, fx: { money: '-amount', stress: 6 } },
        ],
      },
      { label: { fr: 'Accepter la défaite', en: 'Accept defeat' }, text: { fr: ["J'ai laissé tomber {$amount}. Il m'a serré la main avec un sourire de crocodile. Il a reloué l'appart le lendemain, avec le trou de punaise, 100 € plus cher.", "J'ai abandonné la caution. En partant, j'ai vu sa voiture neuve dans la cour. Elle avait l'air de valoir à peu près la somme de toutes les cautions de l'immeuble. Sur la plage arrière : {w:object}."], en: ["I let {$amount} go. He shook my hand with a crocodile smile. He re-rented the flat the next day, thumbtack hole included, $100 more expensive.", "I gave up the deposit. Leaving, I saw his new car in the courtyard. It looked worth roughly the sum of every deposit in the building. On the back shelf: {w:object}."] }, fx: { money: '-amount', happy: -6 } },
      { label: { fr: 'Vengeance discrète', en: 'Quiet revenge' }, rating: 1, text: { fr: ["J'ai rendu les clés après avoir caché des crevettes crues dans les tringles à rideaux. Dans trois semaines, l'appart sentira l'enfer. Il ne trouvera jamais.", "J'ai programmé le chauffage à 30 °C et laissé une fenêtre ouverte. Ensuite, j'ai abonné l'adresse du proprio à quinze catalogues de vente par correspondance. La guerre est froide, mais elle est longue. Le premier catalogue vendait {w:object}."], en: ["I returned the keys after hiding raw shrimp in the curtain rods. In three weeks, the flat will smell like hell. He'll never find them.", "I set the heating to 86°F and left a window open. Then I signed the landlord's address up for fifteen mail-order catalogs. A cold war, but a long one. The first catalog was selling {w:object}."] }, fx: { money: '-amount', happy: 6, karma: -5 } },
    ],
  },
  {
    id: 'dy_roomie_new',
    icon: '🛋️',
    cat: 'home',
    rating: 1,
    vars: { amount: [200, 600] },
    scene: { place: 'apartment', mood: 'neutral', prop: 'boxes' },
    when: { age: [18, 45], movedOut: true, noFlag: 'dy_roomie', noHas: 'spouse' },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Pour payer le loyer, tu prends un coloc trouvé en ligne. Il arrive avec un sac poubelle d'affaires, un cactus et {w:animal}. Il dit qu'il pratique {w:hobby}, « surtout la nuit ».",
        "Ton nouveau coloc se présente : il est {w:weird_job}, il ne mange que de la nourriture beige et il « parle aux murs, mais gentiment ». Il a payé trois mois d'avance en liquide.",
        "Entretien de colocation. Le candidat te demande si les murs sont épais, si les voisins sont curieux et s'il y a un congélateur coffre. Il est le seul candidat. Il a apporté {w:gift} pour l'entretien.",
        "Ta nouvelle coloc emménage. Elle a 40 plantes, une étagère d'huiles essentielles et un planning de ménage plastifié avec des couleurs. Elle a déjà attribué une couleur à ton nom, et un surnom : « {w:nickname} ».",
      ],
      en: [
        "To cover rent, you take a roommate you found online. He shows up with a trash bag of belongings, a cactus and {w:animal}. He says he practices {w:hobby}, 'mostly at night'.",
        "Your new roommate introduces himself: he's {w:weird_job}, he only eats beige food and he 'talks to the walls, but nicely'. He paid three months upfront in cash.",
        "Roommate interview. The candidate asks if the walls are thick, if the neighbors are nosy and if there's a chest freezer. He's the only candidate. He brought {w:gift} to the interview.",
        "Your new roommate moves in. She has 40 plants, a shelf of essential oils and a laminated, color-coded cleaning schedule. She's already assigned a color to your name, and a nickname: '{w:nickname}'.",
      ],
    },
    choices: [
      { label: { fr: 'Accueillir chaleureusement', en: 'Welcome them warmly' }, text: { fr: ["J'ai fait un dîner de bienvenue. Le coloc a pleuré d'émotion, puis il a mangé tout ce qu'il y avait dans le frigo, y compris les condiments. Ça commence bien.", "Accueil royal : apéro, visite guidée, clé personnalisée. Le coloc m'a offert {w:gift}. Je crois qu'on va bien s'entendre. Ou mourir. On verra."], en: ["I made a welcome dinner. The roommate cried with emotion, then ate everything in the fridge, condiments included. Off to a great start.", "Royal welcome: drinks, guided tour, personalized key. The roommate gave me {w:gift}. I think we'll get along. Or die. We'll see."] }, fx: { happy: 4, money: 'amount', flag: 'dy_roomie' } },
      { label: { fr: 'Poser des règles écrites', en: 'Write down the rules' }, text: { fr: ["J'ai rédigé un règlement intérieur de 12 pages. Le coloc l'a signé sans le lire. L'article 7 interdit le fromage qui pue. Il a déjà violé l'article 7.", "Règlement affiché sur le frigo : pas de bruit après 22 h, pas d'invités nus, chacun ses yaourts. Le coloc a ajouté un article à la main : « Pas de jugement. » Puis il a sorti {w:object}."], en: ["I wrote 12 pages of house rules. The roommate signed without reading. Article 7 bans smelly cheese. He's already violated Article 7.", "Rules posted on the fridge: no noise after 10 p.m., no naked guests, everyone has their own yogurts. The roommate added one by hand: 'No judgment.' Then he pulled out {w:object}."] }, fx: { discipline: 3, money: 'amount', flag: 'dy_roomie' } },
      { label: { fr: 'Changer d\'avis', en: 'Change my mind' }, text: { fr: ["J'ai prétexté que la chambre venait d'être louée. Le candidat m'a regardé{|e} longuement, a hoché la tête et est parti. Il connaît mon adresse. Je l'ai remarqué à son sourire.", "J'ai dit non. Je paye le loyer tout{|e} seul{|e}, je mange des pâtes, mais personne ne parle aux murs chez moi. À part moi. Et {w:animal}, parfois."], en: ["I claimed the room had just been rented. The candidate stared at me for a long time, nodded and left. He knows my address. I could tell from his smile.", "I said no. I pay the rent alone, I eat pasta, but nobody talks to the walls in my home. Except me. And {w:animal}, sometimes."] }, fx: { money: -100, stress: -2 } },
    ],
  },
  {
    id: 'dy_roomie_yogurt',
    icon: '🥛',
    cat: 'home',
    rating: 2,
    scene: { place: 'apartment', mood: 'angry', prop: 'fridge' },
    when: { age: [18, 50], flag: 'dy_roomie' },
    weight: 9,
    cooldown: 3,
    text: {
      fr: [
        "Tes yaourts disparaissent. Tu as écrit ton prénom dessus au marqueur. Ce matin, quelqu'un a barré ton prénom et écrit « partagé ». Tu vis avec une seule autre personne. Et {w:animal}, qui n'a pas de mains.",
        "Ton coloc a encore mangé {w:food} que tu gardais pour ce soir. Il a laissé l'emballage vide dans le frigo, soigneusement refermé, comme une blague cruelle.",
        "La vaisselle de ton coloc s'empile dans l'évier depuis neuf jours. Une colonie de moucherons y a fondé une démocratie. Il flotte dans la cuisine {w:smell}.",
        "Ton coloc utilise ta brosse à dents. Tu le sais parce qu'elle est mouillée le matin alors que tu ne l'as pas encore utilisée. Et parce qu'il y a un poil roux dessus. Tu es brun{|e}.",
      ],
      en: [
        "Your yogurts keep vanishing. You wrote your name on them in marker. This morning, someone crossed out your name and wrote 'shared'. You live with exactly one other person. And {w:animal}, which has no hands.",
        "Your roommate ate {w:food} you were saving for tonight. Again. He left the empty packaging in the fridge, carefully resealed, like a cruel joke.",
        "Your roommate's dishes have been piling up in the sink for nine days. A colony of fruit flies has founded a democracy there. The kitchen is filled with {w:smell}.",
        "Your roommate uses your toothbrush. You know because it's wet in the morning before you've used it. And because there's a red hair on it. You have dark hair.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le piéger', en: 'Set a trap' },
        out: [
          { w: 2, text: { fr: ["J'ai rempli un pot de yaourt de mayonnaise avec un peu de sucre. Il a tout mangé sans rien dire. Puis il a vomi dans le couloir. Il n'a plus jamais touché à mes affaires.", "J'ai mis du laxatif dans mon jus d'orange. Le coloc a passé la nuit aux toilettes en hurlant. Le matin, on s'est regardés. Il a compris. Paix armée. Il m'appelle désormais « {w:nickname} »."], en: ["I filled a yogurt pot with mayo and a bit of sugar. He ate it all without a word. Then threw up in the hallway. He never touched my stuff again.", "I spiked my orange juice with laxatives. The roommate spent the night on the toilet, screaming. In the morning, we looked at each other. He understood. Armed peace. He now calls me '{w:nickname}'."] }, fx: { happy: 8, karma: -4, visual: 'poop' }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai piégé mon yaourt. Puis, à 2 h du mat', affamé{|e}, j'ai oublié et je l'ai mangé moi-même. J'ai passé la nuit à me chier dessus en me maudissant.", "J'ai mis du piment fort dans les yaourts. Le coloc adore le piment. Il m'a remercié{|e}. Il en mange encore plus maintenant, avec {w:food}."], en: ["I booby-trapped my yogurt. Then at 2 a.m., starving, I forgot and ate it myself. I spent the night shitting myself and cursing my own name.", "I put hot pepper in the yogurts. The roommate loves hot pepper. He thanked me. He eats even more of them now, with {w:food}."] }, fx: { happy: -6, health: -4 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Discussion d\'adulte', en: 'Adult conversation' }, text: { fr: ["J'ai organisé une « réunion de coloc ». Il est venu avec une liste de reproches à mon sujet, plus longue que la mienne. J'ai appris que je ronfle et que je chante sous la douche. Faux.", "On a parlé calmement. Il s'est excusé. Il a racheté des yaourts. Il en a mangé la moitié en les rangeant. C'est un progrès. Il a aussi racheté {w:food}."], en: ["I called a 'roommate meeting'. He came with a list of complaints about me, longer than mine. I learned that I snore and sing in the shower. Lies.", "We talked calmly. He apologized. He bought yogurts. He ate half while putting them away. It's progress. He also replaced {w:food}."] }, fx: { stress: -2, karma: 2 } },
      { label: { fr: 'Le mettre dehors', en: 'Kick him out' }, text: { fr: ["J'ai posé ses affaires sur le palier avec un mot : « Bon vent ». Il est parti avec son cactus et mon grille-pain. Je suis seul{|e}, pauvre et libre.", "Je lui ai donné un mois. Il est parti en laissant une odeur, une dette de 200 € et une plante qui a pris toute la place sur le balcon. La plante, je l'aime bien. Elle fait parfois {w:sound}."], en: ["I left his stuff on the landing with a note: 'Good riddance'. He left with his cactus and my toaster. I'm alone, broke and free.", "I gave him a month. He left behind a smell, a $200 debt and a plant that took over the balcony. The plant, I like. It sometimes makes {w:sound}."] }, fx: { happy: 4, money: -200, unflag: 'dy_roomie' } },
    ],
  },
  {
    id: 'dy_roomie_bathroom',
    icon: '🚿',
    cat: 'home',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock', prop: 'shower' },
    when: { age: [18, 50], flag: 'dy_roomie' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: [
        "Le copain de ta coloc a « dormi là deux nuits ». Ça fait cinq semaines. Il prend des douches de 45 minutes, ne paie rien et laisse ses poils de barbe dans le lavabo comme une signature. Il chante {w:song} sous la douche.",
        "Ton coloc ramène quelqu'un tous les soirs. Les murs sont en papier à cigarette. Cette nuit, tu as entendu {w:sound}, puis « encore », puis {w:sound}. Tu as rendez-vous à 7 h.",
        "Il y a une boule de cheveux dans la bonde de la douche. Elle a la taille d'un hamster. Elle a peut-être un nom. Ton coloc dit que « ce n'est pas à lui ». Dedans, on devine {w:object}.",
        "Tu rentres et trouves ton coloc qui fait du yoga nu dans le salon, avec un ami, nu aussi, et {w:animal} en tenue de soirée. Il te propose de « rejoindre le cercle ».",
      ],
      en: [
        "Your roommate's boyfriend 'slept over two nights'. It's been five weeks. He takes 45-minute showers, pays nothing and leaves beard hairs in the sink like a signature. He sings {w:song} in the shower.",
        "Your roommate brings someone home every night. The walls are cigarette-paper thin. Last night you heard {w:sound}, then 'again', then {w:sound}. You have a 7 a.m. meeting.",
        "There's a hairball in the shower drain. It's the size of a hamster. It might have a name. Your roommate says 'it's not mine'. Inside it, you can make out {w:object}.",
        "You come home and find your roommate doing naked yoga in the living room, with a friend, also naked, and {w:animal}, clothed. He invites you to 'join the circle'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exiger un loyer', en: 'Demand rent' },
        out: [
          { w: 1, text: { fr: ["J'ai exigé que le squatteur paie un tiers du loyer. Il a accepté, et il fait maintenant le ménage. Le squatteur est le meilleur coloc que j'aie jamais eu.", "J'ai sorti un tableau Excel des douches de 45 minutes. Il a payé sa part, plus un dédommagement. Les chiffres ne mentent pas. Il m'a payé en partie avec {w:object}."], en: ["I demanded the squatter pay a third of the rent. He agreed, and now he cleans too. The squatter is the best roommate I've ever had.", "I pulled out a spreadsheet of the 45-minute showers. He paid his share, plus compensation. Numbers don't lie. He paid partly with {w:object}."] }, fx: { money: 200, happy: 4 } },
          { w: 1, text: { fr: ["Ils ont mal pris la demande. Ils sont partis tous les deux. Je paye maintenant tout le loyer, seul{|e}, avec une boule de cheveux qui me regarde depuis la bonde.", "Le coloc a choisi son mec plutôt que moi. Ils ont déménagé ensemble. Ils m'ont laissé la boule de cheveux. En cadeau, je crois. Avec {w:gift}."], en: ["They didn't take it well. They both left. I now pay all the rent, alone, with a hairball staring at me from the drain.", "The roommate chose the boyfriend over me. They moved out together. They left me the hairball. As a gift, I think. Along with {w:gift}."] }, fx: { money: -300, happy: -3, unflag: 'dy_roomie' }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Rejoindre le cercle', en: 'Join the circle' }, text: { fr: ["J'ai rejoint le cercle. Ce n'était pas ce que je croyais. C'était pire. Et mieux. Je n'en parlerai jamais à ma mère.", "Je me suis déshabillé{|e} et j'ai fait la posture du chien tête en bas entre deux inconnus. C'est la soirée la plus étrange de ma vie. Mon dos va mieux. Le chat aussi faisait la posture. Enfin, {w:animal}."], en: ["I joined the circle. It wasn't what I thought. It was worse. And better. I'll never tell my mother.", "I stripped and did downward dog between two strangers. Strangest evening of my life. My back feels better. The cat did the pose too. Well, {w:animal}."] }, fx: { happy: 5, athletic: 2, stress: -4 } },
      { label: { fr: 'Boules Quies et gin', en: 'Earplugs and gin' }, text: { fr: ["Bouchons d'oreilles, masque de nuit, gin tonic. J'ai dormi comme un bébé. Un bébé bourré. Le lendemain, j'avais une gueule de bois et toujours le bruit dans la tête.", "J'ai acheté des bouchons d'oreilles de chantier et une bouteille de gin. Je n'entends plus rien. Ni le coloc, ni mon réveil. J'ai raté le boulot. Mon excuse : {w:excuse}."], en: ["Earplugs, sleep mask, gin and tonic. I slept like a baby. A drunk baby. Next morning I had a hangover and the noise still in my head.", "I bought construction-grade earplugs and a bottle of gin. I hear nothing now. Not the roommate, not my alarm. I missed work. My excuse: {w:excuse}."] }, fx: { stress: -3, health: -2, addiction: ['alcohol', 4] } },
    ],
  },
  {
    id: 'dy_laundromat',
    icon: '🧺',
    cat: 'adulting',
    rating: 1,
    scene: { place: 'park', mood: 'neutral', prop: 'washer' },
    when: { age: [18, 85] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Laverie automatique. Ta machine est terminée depuis dix minutes, mais quelqu'un a sorti ton linge et l'a posé sur le comptoir. Ton slip le plus moche trône au sommet, bien en évidence. Une inconnue le fixe en mangeant {w:food}.",
        "À la laverie, un inconnu lave une seule paire de chaussettes dans la machine XXL depuis 1 h 30. Il la regarde tourner en buvant {w:drink}. Il te fait un signe de tête complice.",
        "Le sèche-linge de la laverie a avalé tes pièces, puis ta chaussette, puis il a affiché « Merci ». Il fait 40 °C dans la laverie et il y flotte {w:smell}.",
        "Tu ouvres ta machine à la laverie. Ton linge blanc est devenu rose, sauf ton t-shirt rouge, qui est devenu blanc. Une dame te dit que c'est « une malédiction connue ». Il flotte {w:smell}.",
      ],
      en: [
        "Laundromat. Your machine finished ten minutes ago, but someone took out your laundry and put it on the counter. Your ugliest underwear sits on top, on full display. A stranger is staring at it while eating {w:food}.",
        "At the laundromat, a stranger has been washing a single pair of socks in the XXL machine for 90 minutes. He watches it spin while sipping {w:drink}. He gives you a knowing nod.",
        "The laundromat dryer ate your coins, then your sock, then displayed 'Thank you'. It's 104°F inside and there's {w:smell} in the air.",
        "You open your machine at the laundromat. Your whites are pink, except your red T-shirt, which is now white. A lady tells you it's 'a known curse'. There's {w:smell} in the air.",
      ],
    },
    choices: [
      { label: { fr: 'Plier dignement', en: 'Fold with dignity' }, text: { fr: ["J'ai plié mon slip troué avec la dignité d'un maître d'hôtel. Une inconnue m'a dit « joli modèle ». Je ne saurai jamais si elle se moquait.", "J'ai tout plié en silence, avec soin, devant tout le monde. C'était une performance. J'ai eu droit à un applaudissement isolé. Et quelqu'un m'a offert {w:drink}."], en: ["I folded my holey underwear with the dignity of a butler. A stranger said 'nice model'. I'll never know if she was mocking me.", "I folded everything silently, carefully, in front of everyone. It was a performance. I got a single round of applause. And someone bought me {w:drink}."] }, fx: { discipline: 2, happy: 1 } },
      {
        label: { fr: 'Draguer à la laverie', en: 'Flirt at the laundromat' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: ["J'ai engagé la conversation sur l'adoucissant. Une heure plus tard, on partageait un sèche-linge et un verre. Le linge sent bon, et moi aussi.", "On s'est trouvés tous les deux à attendre devant les hublots. Je lui ai proposé {w:drink}. On a vu nos linges tourner ensemble. C'est la chose la plus romantique de ma vie."], en: ["I started a conversation about fabric softener. An hour later we were sharing a dryer and a drink. The laundry smells nice, and so do I.", "We both waited in front of the portholes. I offered {w:drink}. We watched our laundry spin together. Most romantic thing ever."] }, fx: { happy: 6, looks: 1 }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai tenté une phrase d'approche sur « le cycle délicat ». La personne a pris son linge mouillé et elle est partie. Il gouttait jusqu'à la porte.", "Pendant que je draguais, j'ai tenu sans m'en rendre compte une petite culotte qui n'était pas à moi. On m'a regardé{|e} comme un pervers. J'ai fui avec mon linge humide en criant « {w:exclaim} »"], en: ["I tried a pickup line about the 'delicate cycle'. The person grabbed their wet laundry and left. It dripped all the way to the door.", "While flirting, I'd unknowingly been holding someone else's panties. People looked at me like a pervert. I fled with my damp laundry, yelling '{w:exclaim}'"] }, fx: { happy: -4, looks: -1 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Taper la machine', en: 'Kick the machine' }, text: { fr: ["J'ai donné un coup de pied au sèche-linge. Il a craché mes pièces, plus les pièces de 14 autres clients. J'ai payé une tournée à tout le monde au bar d'à côté.", "Un coup de pied, et le sèche-linge a redémarré, a fait 3 tours et s'est arrêté pour toujours. Mon linge est resté dedans. Il y est encore. Il dégage {w:smell}."], en: ["I kicked the dryer. It spat out my coins, plus the coins of 14 other customers. I bought everyone a round at the bar next door.", "One kick and the dryer restarted, did 3 turns and died forever. My laundry stayed inside. It's still there. It gives off {w:smell}."] }, fx: { happy: 3, money: 20 } },
    ],
  },
  {
    id: 'dy_mold_pet',
    icon: '🦠',
    cat: 'home',
    rating: 2,
    vars: { amount: [200, 1200] },
    scene: { place: 'apartment', mood: 'sick', prop: 'shower' },
    when: { age: [18, 90], movedOut: true },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "La moisissure dans le coin de ta salle de bain s'étend. Elle a maintenant la forme d'un visage. Ce matin, tu as eu l'impression qu'elle te souriait. Ce soir, elle a fait {w:sound}.",
        "Ton plafond de salle de bain est noir. Tu tousses. Le proprio dit que c'est « un effet de style ». La moisissure a commencé à pousser dans tes chaussures et sur {w:object}.",
        "Il y a un champignon. Pas une moisissure : un vrai champignon, avec un chapeau, qui a poussé dans le joint de la douche. Il fait 8 cm. Il dégage {w:smell}.",
        "Tu soulèves ton matelas posé à même le sol. Dessous, un écosystème entier vert et blanc. Une petite mouche s'envole, comme réveillée d'un rêve. Il flotte {w:smell}.",
      ],
      en: [
        "The mold in the corner of your bathroom is spreading. It's now shaped like a face. This morning, you could swear it smiled at you. Tonight, it made {w:sound}.",
        "Your bathroom ceiling is black. You're coughing. The landlord says it's 'a design feature'. The mold has started growing in your shoes and on {w:object}.",
        "There's a mushroom. Not mold: an actual mushroom with a cap, growing out of the shower grout. It's 3 inches tall. It gives off {w:smell}.",
        "You lift your mattress off the floor. Underneath, an entire green-and-white ecosystem. A small fly takes off, as if waking from a dream. There's {w:smell} in the air.",
      ],
    },
    choices: [
      {
        label: { fr: 'Javel, gants, guerre', en: 'Bleach, gloves, war' },
        out: [
          { w: 2, text: { fr: ["J'ai mélangé de la javel et un autre produit sans lire l'étiquette. Gaz toxique. Je me suis évanoui{|e} la tête dans la baignoire. La moisissure, elle, va très bien.", "J'ai frotté pendant six heures. La moisissure est partie. Elle est revenue en trois jours, plus forte, comme un méchant de film d'horreur. Elle a un deuxième visage, maintenant. Il ressemble à {w:celeb}."], en: ["I mixed bleach with another product without reading the label. Toxic gas. I passed out with my head in the tub. The mold is doing great.", "I scrubbed for six hours. The mold left. It came back in three days, stronger, like a horror movie villain. It has a second face now. It looks like {w:celeb}."] }, fx: { health: -6, happy: -4 }, mood: 'sick' },
          { w: 1, text: { fr: ["Six heures de récurage, trois bouteilles de javel. La salle de bain est immaculée. J'ai les mains d'un vieux pêcheur, mais je suis vainqueur{|e}.", "J'ai gagné. La salle de bain brille. Je respire mieux. J'ai organisé une petite fête avec moi-même, un gâteau et {w:drink}."], en: ["Six hours of scrubbing, three bottles of bleach. The bathroom is spotless. My hands look like an old fisherman's, but I'm victorious.", "I won. The bathroom shines. I breathe better. I threw a little party for myself with a cake and {w:drink}."] }, fx: { happy: 5, health: 2, discipline: 3 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Le cuisiner', en: 'Cook the mushroom' }, rating: 2, text: { fr: ["J'ai cuisiné le champignon de la douche en omelette. J'ai vu des couleurs qui n'existent pas, parlé à mon défunt grand-père et vomi en technicolor. Je ne recommande pas.", "J'ai fait revenir le champignon au beurre. Deux heures plus tard, je rampais dans le couloir en croyant être une limace. J'ai fini aux urgences, couvert{|e} de ma propre bave, en chantant {w:song}."], en: ["I cooked the shower mushroom into an omelet. I saw colors that don't exist, talked to my late grandfather and vomited in technicolor. Do not recommend.", "I sautéed the mushroom in butter. Two hours later I was crawling down the hallway thinking I was a slug. I ended up in the ER, covered in my own drool, singing {w:song}."] }, fx: { health: -10, happy: 3, disease: 'food_poisoning', visual: 'poop' } },
      { label: { fr: 'Appeler le proprio', en: 'Call the landlord' }, text: { fr: ["Le proprio est venu, a regardé la moisissure, a dit « ah oui » et a repeint par-dessus en blanc. En une semaine, elle a percé la peinture. Elle est plus forte que nous deux.", "Le proprio m'a envoyé un « professionnel », qui était son neveu. Il a mis un déshumidificateur à 15 € et m'a facturé {$amount}. Le déshumidificateur a moisi. Il dégage {w:smell}."], en: ["The landlord came, looked at the mold, said 'oh yeah' and painted over it in white. Within a week, it broke through the paint. It's stronger than both of us.", "The landlord sent a 'professional', who was his nephew. He set up a $15 dehumidifier and charged me {$amount}. The dehumidifier got moldy. It gives off {w:smell}."] }, fx: { money: '-amount', stress: 5, health: -2 } },
    ],
  },
  {
    id: 'dy_kitchen_mouse',
    icon: '🐭',
    cat: 'home',
    rating: 0,
    scene: { place: 'apartment', mood: 'shock', prop: 'cheese' },
    when: { age: [18, 95] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Une souris traverse ta cuisine à 23 h, s'arrête, te regarde, et repart en traînant {w:food}. Elle n'a pas peur. Elle a l'air de payer un loyer.",
        "Il y a des petites crottes noires dans ton placard à céréales. Et un trou dans le paquet. Et, au fond, une souris qui mâche, en te regardant dans les yeux. Elle a aussi entamé {w:food}.",
        "Une souris s'est installée derrière ton frigo. Tu l'entends la nuit faire {w:sound}. Tu l'as appelée Raymond. Raymond a une famille.",
        "Tu ouvres le tiroir à couverts. Une souris dort dans la cuillère à soupe, roulée en boule. Elle se réveille, bâille et se rendort. Elle a traîné {w:object} jusque dans le tiroir.",
      ],
      en: [
        "A mouse crosses your kitchen at 11 p.m., stops, looks at you, and leaves dragging {w:food}. It isn't scared. It acts like it pays rent.",
        "There are tiny black droppings in your cereal cupboard. And a hole in the box. And, at the back, a mouse chewing while looking you in the eye. It has also started on {w:food}.",
        "A mouse has moved in behind your fridge. You hear it at night making {w:sound}. You've named it Raymond. Raymond has a family.",
        "You open the cutlery drawer. A mouse is sleeping curled up in a soup spoon. It wakes up, yawns, and goes back to sleep. It has dragged {w:object} into the drawer.",
      ],
    },
    choices: [
      { label: { fr: 'Piège sans cruauté', en: 'Humane trap' }, text: { fr: ["J'ai acheté un piège sans cruauté. J'ai attrapé la souris et je l'ai relâchée dans le parc à 2 km. Le lendemain, elle était revenue. Avec un ami.", "J'ai capturé la souris dans une boîte et je l'ai libérée en forêt. Elle s'est retournée avant de partir. On s'est compris."], en: ["I bought a humane trap. Caught the mouse and released it in the park, a mile away. The next day, it was back. With a friend.", "I caught the mouse in a box and freed it in the woods. It turned around before leaving. We understood each other."] }, fx: { karma: 4, happy: 2 } },
      {
        label: { fr: 'L\'adopter', en: 'Adopt it' },
        out: [
          { w: 1, text: { fr: ["J'ai adopté la souris. Elle s'appelle Raymond, elle mange à table et elle dort dans une boîte à chaussures. C'est mon colocataire le plus respectueux.", "J'ai laissé un dé à coudre d'eau et une miette de pain chaque soir. Raymond m'apporte maintenant des pièces de monnaie trouvées dans les murs. 3 € en un mois."], en: ["I adopted the mouse. Its name is Raymond, it eats at the table and sleeps in a shoebox. My most respectful roommate ever.", "I left out a thimble of water and a breadcrumb every night. Raymond now brings me coins found in the walls. $3 in a month."] }, fx: { happy: 6, money: 3 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai adopté la souris. Trois mois plus tard, il y en avait quarante. Raymond était Raymonde. J'ai dû appeler un dératiseur qui m'a regardé{|e} avec mépris.", "J'ai nourri la souris. Toute sa famille élargie est venue. Ma cuisine est désormais une maison de retraite pour rongeurs. Je dors sur le palier."], en: ["I adopted the mouse. Three months later, there were forty. Raymond was a girl. I had to call an exterminator, who looked at me with contempt.", "I fed the mouse. Its entire extended family showed up. My kitchen is now a rodent retirement home. I sleep on the landing."] }, fx: { happy: -4, money: -150, stress: 5 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Monter sur une chaise', en: 'Stand on a chair' }, text: { fr: ["J'ai sauté sur une chaise en criant {w:exclaim} La souris m'a regardé{|e} avec pitié et elle est partie en marchant. Lentement. Pour m'humilier.", "Je suis resté{|e} debout sur la chaise pendant 40 minutes. La souris s'est endormie au pied de la chaise. On a trouvé un compromis : j'ai déménagé dans la chambre."], en: ["I jumped on a chair screaming {w:exclaim} The mouse looked at me with pity and walked away. Slowly. To humiliate me.", "I stood on the chair for 40 minutes. The mouse fell asleep at the foot of the chair. We compromised: I moved into the bedroom."] }, fx: { stress: 4, happy: -2 } },
    ],
  },
  {
    id: 'dy_sunday_drill',
    icon: '🔨',
    cat: 'home',
    rating: 1,
    scene: { place: 'apartment', mood: 'sleepy', prop: 'drill' },
    when: { age: [18, 95] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: [
        "Dimanche, 8 h 02. Le voisin perce. Encore. Ça fait trois ans qu'il perce. Soit il construit une cathédrale, soit il cherche du pétrole. Ou {w:object}.",
        "Le voisin du dessus fait des travaux depuis six mois. Aujourd'hui : marteau-piqueur, scie sauteuse et, en bruit de fond, {w:song} à fond.",
        "Tu dors enfin après une semaine pourrie. 7 h 45 : la perceuse du voisin démarre pile au-dessus de ta tête. Puis {w:sound}. Puis la perceuse. Puis un cri de victoire.",
        "Ton voisin a décidé de refaire sa salle de bain lui-même, avec des tutos. Ça fait des mois. Ça cogne, ça perce et, hier, de l'eau a coulé de ton plafond, avec {w:object} dedans.",
      ],
      en: [
        "Sunday, 8:02 a.m. The neighbor is drilling. Again. He's been drilling for three years. Either he's building a cathedral or drilling for oil. Or {w:object}.",
        "The upstairs neighbor has been renovating for six months. Today: jackhammer, jigsaw, and {w:song} blasting in the background.",
        "You're finally sleeping after a crappy week. 7:45 a.m.: the neighbor's drill starts right above your head. Then {w:sound}. Then the drill. Then a victory scream.",
        "Your neighbor decided to redo his bathroom himself, using tutorials. It's been months. Banging, drilling, and yesterday water leaked from your ceiling, with {w:object} in it.",
      ],
    },
    choices: [
      { label: { fr: 'Taper au plafond', en: 'Bang on the ceiling' }, text: { fr: ["J'ai tapé au plafond avec un balai. Il a tapé en retour. On a communiqué en morse pendant dix minutes. Je crois qu'il m'a dit « va te faire foutre ». Ou « bonne journée ».", "J'ai frappé au plafond comme une furie. La perceuse s'est arrêtée. Puis elle a repris, en rythme avec mes coups. C'est devenu une chanson."], en: ["I banged on the ceiling with a broom. He banged back. We communicated in Morse code for ten minutes. I think he said 'fuck off'. Or 'have a nice day'.", "I pounded the ceiling like a fury. The drill stopped. Then resumed, in rhythm with my pounding. It became a song."] }, fx: { stress: -2, happy: 1 } },
      {
        label: { fr: 'Monter le voir', en: 'Go up and confront him' },
        out: [
          { w: 1, text: { fr: ["Je suis monté{|e} en pyjama. Il m'a ouvert, couvert de plâtre, et m'a proposé un café et un croissant. On a parlé deux heures. Il perce maintenant à partir de 10 h. Victoire diplomatique.", "Je suis monté{|e}. Il a été adorable, gêné, et m'a offert {w:gift} pour s'excuser. Le lendemain, à 8 h, il perçait. Mais gentiment."], en: ["I went up in my pajamas. He opened, covered in plaster, and offered me coffee and a croissant. We talked for two hours. He now drills from 10 a.m. Diplomatic victory.", "I went up. He was lovely, embarrassed, and gave me {w:gift} as an apology. The next day at 8 a.m. he was drilling. But nicely."] }, fx: { happy: 4, karma: 2 } },
          { w: 1, text: { fr: ["Il m'a ouvert, perceuse à la main, l'air d'un tueur en série. Il m'a dit « {w:threat} ». Je suis redescendu{|e} sans un mot. Il perce encore.", "Je suis monté{|e} m'énerver. Il m'a demandé de tenir une planche « deux secondes ». J'ai passé ma journée à refaire sa salle de bain. Elle est belle."], en: ["He opened, drill in hand, looking like a serial killer. He said '{w:threat}'. I went back down without a word. He's still drilling.", "I went up to yell. He asked me to hold a plank 'for two seconds'. I spent the day redoing his bathroom. It looks great."] }, fx: { stress: 4, athletic: 1 } },
        ],
      },
      { label: { fr: 'Contre-attaque sonore', en: 'Sonic counterattack' }, text: { fr: ["J'ai collé une enceinte au plafond et lancé {w:song} en boucle, à fond. Il a arrêté de percer. J'ai continué. Par principe. Jusqu'à minuit.", "J'ai répondu par une séance de batterie improvisée avec des casseroles. Le voisin d'en dessous est monté se plaindre. De moi. Le système est injuste."], en: ["I pressed a speaker to the ceiling and played {w:song} on loop, full blast. He stopped drilling. I kept going. On principle. Until midnight.", "I responded with an improvised drum session using pots and pans. The downstairs neighbor came up to complain. About me. The system is unfair."] }, fx: { happy: 4, karma: -2 } },
    ],
  },
  {
    id: 'dy_upstairs_hobby',
    icon: '🎳',
    cat: 'home',
    rating: 2,
    scene: { place: 'apartment', mood: 'sleepy', prop: 'bed' },
    when: { age: [18, 95] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "3 h du matin. À l'étage du dessus, quelqu'un fait rouler des billes sur le parquet. Puis une boule de bowling. Puis il fait {w:sound}. Puis il recommence les billes.",
        "Tous les soirs à minuit, le voisin du dessus fait ses exercices de claquettes. Il est nul. Il s'acharne. Puis il pisse longuement, très longuement, juste au-dessus de ta tête, en chantant {w:song}.",
        "Le voisin du dessus semble pratiquer {w:hobby} entre 2 h et 4 h du matin. Avec intensité. Avec des cris. Avec ce qui ressemble à un animal.",
        "Bruits de pas lourds au-dessus. Puis un objet qui tombe ({w:object}, apparemment). Puis un rire hystérique. Puis la chasse d'eau, six fois. Tu as rendez-vous chez le médecin à 8 h.",
      ],
      en: [
        "3 a.m. Upstairs, someone's rolling marbles across the floor. Then a bowling ball. Then they make {w:sound}. Then back to the marbles.",
        "Every night at midnight, the upstairs neighbor practices tap dancing. He's terrible. He persists. Then he pees long, very long, right above your head, singing {w:song}.",
        "The upstairs neighbor appears to practice {w:hobby} between 2 and 4 a.m. Intensely. With screaming. With what sounds like an animal.",
        "Heavy footsteps above. Then something falls ({w:object}, apparently). Then hysterical laughter. Then the toilet flushes, six times. You have a doctor's appointment at 8.",
      ],
    },
    choices: [
      {
        label: { fr: 'Monter en caleçon', en: 'Go up in my underwear' },
        out: [
          { w: 1, text: { fr: ["Je suis monté{|e} en caleçon, furieux{|se}. La porte s'est ouverte sur une vieille dame minuscule de 90 ans. « Je fais ma gym. » Elle m'a fait faire des squats. J'ai des courbatures.", "J'ai frappé. Un type en peignoir m'a ouvert, une boule de bowling à la main. Il m'a proposé une partie. J'ai joué jusqu'à 5 h. J'ai fait un strike."], en: ["I went up in my underwear, furious. The door opened on a tiny 90-year-old lady. 'I'm doing my workout.' She made me do squats. I'm sore.", "I knocked. A guy in a bathrobe opened, holding a bowling ball. He offered me a game. I played until 5 a.m. I bowled a strike."] }, fx: { happy: 4, athletic: 2, health: -1 } },
          { w: 1, text: { fr: ["J'ai frappé à la porte. Personne n'a ouvert. Le bruit s'est arrêté. Le gardien m'a dit le lendemain que l'appartement du dessus est vide depuis 1997. Bordel de merde.", "J'ai sonné. Silence. Puis une voix derrière la porte a dit mon prénom. Je suis redescendu{|e} en courant, j'ai dormi chez un ami, et j'ai fait pipi dans mon caleçon en route."], en: ["I knocked. No one answered. The noise stopped. The next day the caretaker told me the upstairs flat has been empty since 1997. Holy fucking shit.", "I rang. Silence. Then a voice behind the door said my first name. I ran back down, slept at a friend's, and peed my underwear on the way."] }, fx: { stress: 10, happy: -4, visual: 'ghost' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Écrire un mot dans le hall', en: 'Post a note in the lobby' }, text: { fr: ["J'ai affiché un mot passif-agressif dans le hall. Le lendemain, il était annoté par six voisins. Le débat a dégénéré sur les poubelles. Le bruit continue.", "Mon mot disait « Merci de respecter le sommeil de tous ». Quelqu'un a répondu au stylo : « Merci de respecter mes passions ». Une autre main a ajouté : « {w:insult} »."], en: ["I posted a passive-aggressive note in the lobby. The next day, six neighbors had annotated it. The debate devolved into trash cans. The noise continues.", "My note said 'Please respect everyone's sleep'. Someone replied in pen: 'Please respect my passions'. Another hand added: '{w:insult}'."] }, fx: { stress: 2, happy: 1 } },
      { label: { fr: 'Somnifère', en: 'Sleeping pill' }, text: { fr: ["J'ai pris un somnifère. J'ai dormi 14 heures, raté mon rendez-vous, et rêvé que je jouais au bowling avec le voisin. C'était plutôt sympa, en fait.", "Somnifère, bouchons, masque. J'ai dormi comme une pierre. Au réveil, je bavais sur mon oreiller avec un filet de bave de vingt centimètres. Mais reposé{|e}."], en: ["I took a sleeping pill. Slept 14 hours, missed my appointment, and dreamed I was bowling with the neighbor. It was kinda nice, actually.", "Sleeping pill, earplugs, mask. I slept like a rock. I woke up drooling on my pillow, an eight-inch strand of drool. But rested."] }, fx: { health: 2, stress: -4, discipline: -2 } },
    ],
  },
  {
    id: 'dy_recycling_cop',
    icon: '♻️',
    cat: 'home',
    rating: 1,
    vars: { amount: [35, 135] },
    scene: { place: 'apartment', mood: 'angry', prop: 'trash' },
    when: { age: [18, 95] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Un mot scotché sur ta porte : « Le carton de pizza NE VA PAS dans le bac jaune. Je vous surveille. — Un voisin vigilant. » Il y a une photo de ta poubelle. Prise au téléobjectif. Et une autre de toi, {w:time}.",
        "Mme Durand, la gardienne autoproclamée du tri sélectif, fouille ta poubelle devant toi avec des gants en latex. Elle en sort {w:object}. « C'est à vous, ça ? »",
        "La mairie t'a collé une amende de {$amount} pour « erreur de tri ». Un agent a ouvert ton sac. Il a trouvé un pot de yaourt mal rincé. Il a pris des notes. Puis il a trouvé {w:object}.",
        "Ton voisin a installé une caméra au-dessus des poubelles de l'immeuble. Tu reçois un mail groupé avec une capture de toi en train de jeter du verre dans le mauvais bac, entouré en rouge.",
      ],
      en: [
        "A note taped to your door: 'Pizza boxes DO NOT go in the yellow bin. I am watching you. — A vigilant neighbor.' There's a photo of your trash. Taken with a zoom lens. And one of you, {w:time}.",
        "Mrs. Durand, self-appointed recycling warden, goes through your trash in front of you wearing latex gloves. She pulls out {w:object}. 'Is this yours?'",
        "The city fined you {$amount} for 'sorting errors'. An agent opened your bag. He found a poorly rinsed yogurt pot. He took notes. Then he found {w:object}.",
        "Your neighbor installed a camera above the building's bins. You receive a group email with a screenshot of you throwing glass in the wrong bin, circled in red.",
      ],
    },
    choices: [
      { label: { fr: 'Trier parfaitement', en: 'Sort perfectly' }, text: { fr: ["Je trie désormais avec une précision militaire. Je lave mes pots de yaourt au liquide vaisselle. J'ai un tableau. Je suis devenu{|e} ce que je détestais.", "J'ai appris les règles par cœur. Maintenant, c'est moi qui fouille les poubelles des autres. Mme Durand m'a donné un badge. Je suis son adjoint{|e}."], en: ["I now sort with military precision. I wash my yogurt pots with dish soap. I have a chart. I've become what I hated.", "I memorized the rules. Now I'm the one going through other people's trash. Mrs. Durand gave me a badge. I'm her deputy."] }, fx: { karma: 4, discipline: 3, stress: 2 } },
      {
        label: { fr: 'Rébellion du tri', en: 'Recycling rebellion' },
        out: [
          { w: 2, text: { fr: ["J'ai mis tout le bac jaune dans le bac vert, par pure provocation. Le voisin vigilant a craqué et déménagé. J'ai gagné la guerre du tri.", "Je jette maintenant tout dans le même sac, avec un mot : « Bon courage ». Le voisin a commencé une thérapie. Je suis l'antagoniste de sa vie."], en: ["I dumped the whole yellow bin into the green one, out of pure spite. The vigilant neighbor snapped and moved out. I won the recycling war.", "I now throw everything in one bag, with a note: 'Good luck'. The neighbor started therapy. I'm the villain of his life story."] }, fx: { happy: 5, karma: -4 } },
          { w: 1, text: { fr: ["La mairie m'a retrouvé{|e} grâce à une enveloppe à mon nom dans le sac. Amende de {$amount}. Le voisin vigilant a applaudi depuis sa fenêtre.", "Le voisin a porté plainte. Une médiatrice est venue. Elle m'a fait passer un « quiz du tri ». J'ai eu 3/20. Amende : {$amount}."], en: ["The city tracked me down thanks to an envelope with my name in the bag. {$amount} fine. The vigilant neighbor applauded from his window.", "The neighbor filed a complaint. A mediator came. She gave me a 'recycling quiz'. I scored 3 out of 20. Fine: {$amount}."] }, fx: { money: '-amount', happy: -4 } },
        ],
      },
      { label: { fr: 'Poubelle anonyme', en: 'Anonymous dumping' }, text: { fr: ["Je dépose maintenant mes poubelles dans celles de l'immeuble d'à côté, la nuit, en cagoule. Je me sens comme un agent secret. Un agent secret qui transporte des épluchures.", "Je jette mes poubelles à 4 h du mat', déguisé{|e}. Le voisin vigilant m'a croisé{|e} une fois. On s'est regardés. Il a cru que j'étais un cambrioleur. Il a fermé sa porte à double tour."], en: ["I now drop my trash in the next building's bins, at night, in a ski mask. I feel like a secret agent. A secret agent carrying potato peels.", "I take out my trash at 4 a.m. in disguise. The vigilant neighbor saw me once. We locked eyes. He thought I was a burglar. He double-locked his door."] }, fx: { happy: 3, karma: -2 } },
    ],
  },
  {
    id: 'dy_coop_meeting',
    icon: '🗳️',
    cat: 'home',
    rating: 0,
    vars: { amount: [200, 1500] },
    scene: { place: 'office', mood: 'sleepy', prop: 'chair' },
    when: { age: [22, 95], movedOut: true },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "Réunion de copropriété. Ordre du jour : la couleur du paillasson. Ça fait 2 h 40. M. Bernard a apporté des échantillons, une présentation PowerPoint et {w:food}.",
        "Assemblée des copropriétaires. Un vote sur le ravalement de façade dégénère. Mme Lopez accuse M. Petit d'avoir volé {w:object} lui appartenant, en 2011. Il nie. Elle a des preuves.",
        "Réunion de l'immeuble dans le hall. Tu voulais juste parler de l'ascenseur. Le syndic propose de voter pour installer dans la cour une statue géante représentant {w:animal}. Pour {$amount} par appartement.",
        "Réunion de copro, 20 h. À 23 h, vous en êtes toujours au point 1 sur 34. Un retraité s'est endormi, un autre a sorti {w:food}. Le syndic regarde sa montre en pleurant.",
      ],
      en: [
        "Condo board meeting. Agenda: the doormat color. It's been 2 hours and 40 minutes. Mr. Bernard brought samples, a PowerPoint and {w:food}.",
        "Co-owners' meeting. A vote on the facade renovation escalates. Mrs. Lopez accuses Mr. Petit of stealing {w:object} of hers in 2011. He denies it. She has proof.",
        "Building meeting in the lobby. You just wanted to talk about the elevator. The manager proposes a vote on installing a giant statue of {w:animal} in the courtyard. At {$amount} per unit.",
        "Condo meeting, 8 p.m. At 11 p.m., you're still on item 1 of 34. One retiree fell asleep, another pulled out {w:food}. The manager is staring at his watch, crying.",
      ],
    },
    choices: [
      { label: { fr: 'Voter oui à tout', en: 'Vote yes to everything' }, text: { fr: ["J'ai voté oui à tout pour partir plus vite. L'immeuble a désormais un paillasson doré, une statue et une piscine sur le toit. Ma quote-part : {$amount}.", "Oui, oui, oui. J'ai été élu{|e} président{|e} du conseil syndical sans m'en rendre compte. J'organise maintenant la prochaine réunion. C'est un cauchemar."], en: ["I voted yes to everything to leave faster. The building now has a gold doormat, a statue and a rooftop pool. My share: {$amount}.", "Yes, yes, yes. I got elected board president without realizing. I now organize the next meeting. It's a nightmare."] }, fx: { money: '-amount', stress: 3 } },
      {
        label: { fr: 'Prendre la parole', en: 'Take the floor' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai fait un discours de dix minutes, clair, sensé. Applaudissements. Tous les points ont été votés en 20 minutes. Les retraités m'appellent « le Messie ».", "J'ai remis de l'ordre avec une autorité que je ne me connaissais pas. Mme Lopez m'a apporté une tarte le lendemain. Je règne sur le hall."], en: ["I gave a ten-minute speech, clear and sensible. Applause. Every item was voted in 20 minutes. The retirees call me 'the Messiah'.", "I restored order with an authority I didn't know I had. Mrs. Lopez brought me a pie the next day. I rule the lobby."] }, fx: { happy: 5, smarts: 2, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai pris la parole. M. Bernard m'a coupé{|e} pour corriger ma grammaire. On s'est disputés sur l'accord du participe passé. La réunion a fini à 1 h.", "Mon intervention a relancé le débat sur la statue. On a voté. La statue a gagné. Elle aura mon visage, apparemment, parce que « c'était mon idée »."], en: ["I took the floor. Mr. Bernard interrupted to correct my grammar. We argued about past participles. The meeting ended at 1 a.m.", "My speech reignited the statue debate. We voted. The statue won. Apparently it'll have my face, because 'it was my idea'."] }, fx: { stress: 5, happy: -2 } },
        ],
      },
      { label: { fr: 'Partir discrètement', en: 'Sneak out' }, text: { fr: ["Je suis parti{|e} à quatre pattes pendant le débat sur le paillasson. Personne n'a rien vu. Au procès-verbal, il est écrit que j'ai voté contre tout.", "J'ai fait semblant d'aller aux toilettes et je ne suis jamais revenu{|e}. Le lendemain, on m'avait attribué l'arrosage des plantes du hall. Pour dix ans."], en: ["I crawled out on all fours during the doormat debate. Nobody saw. The minutes say I voted against everything.", "I pretended to go to the bathroom and never came back. The next day, I'd been assigned to water the lobby plants. For ten years."] }, fx: { happy: 2, stress: -2 } },
    ],
  },
  {
    id: 'dy_elevator_stuck',
    icon: '🛗',
    cat: 'daily',
    rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'elevator' },
    when: { age: [18, 95] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "L'ascenseur s'arrête entre deux étages. Tu es coincé{|e} avec un inconnu qui mange {w:food} et qui vient de lâcher {w:sound}. Le bouton d'alarme est cassé depuis 2014.",
        "Coincé{|e} dans l'ascenseur depuis une heure avec ton voisin du 5e, celui qui ne dit jamais bonjour. Il fait 35 °C. Il commence à transpirer. Il commence à parler. Il ne s'arrête plus. Son sujet : {w:hobby}.",
        "L'ascenseur fait un bruit sinistre, descend d'un coup de deux mètres et s'arrête. La lumière clignote. Tu as envie de faire pipi depuis le 3e étage. Le haut-parleur se met à diffuser {w:song}.",
        "Panne d'ascenseur. Tu appuies sur le bouton d'appel. Une voix répond : « Un technicien arrive dans 4 à 6 heures. » Il est 22 h. Tu viens de boire {w:drink}, format géant.",
      ],
      en: [
        "The elevator stops between floors. You're stuck with a stranger eating {w:food} who just released {w:sound}. The alarm button has been broken since 2014.",
        "Stuck in the elevator for an hour with your 5th-floor neighbor, the one who never says hello. It's 95°F. He's starting to sweat. He's starting to talk. He won't stop. His topic: {w:hobby}.",
        "The elevator makes an ominous noise, drops six feet and stops. The light flickers. You've needed to pee since the 3rd floor. The speaker starts playing {w:song}.",
        "Elevator breakdown. You press the call button. A voice answers: 'A technician will arrive in 4 to 6 hours.' It's 10 p.m. You just drank {w:drink}, jumbo size.",
      ],
    },
    choices: [
      {
        label: { fr: 'Escalader la trappe', en: 'Climb through the hatch' },
        out: [
          { w: 2, odds: { athletic: 2 }, text: { fr: ["Comme dans les films, j'ai ouvert la trappe du plafond et grimpé dans la cage. J'ai réussi à forcer les portes du 4e. Je suis sorti{|e} couvert{|e} de graisse, comme Bruce Willis. Une mamie m'a applaudi{|e}.", "Trappe ouverte, escalade, portes forcées. Je suis sorti{|e} en héros. L'inconnu m'a suivi{|e}. On a bu un verre pour fêter ça. Il s'appelle Marcel."], en: ["Like in the movies, I opened the ceiling hatch and climbed into the shaft. I pried open the 4th-floor doors. Came out covered in grease, like Bruce Willis. A granny applauded.", "Hatch open, climb, doors forced. I came out a hero. The stranger followed me. We had a drink to celebrate. His name is Marcel."] }, fx: { happy: 8, athletic: 3, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai grimpé sur le toit de la cabine. Le câble a vibré. J'ai glissé, je me suis rattrapé{|e} par {w:bodypart} à une poutre et j'ai saigné partout dans la cage. Les pompiers m'ont décroché{|e} comme une piñata.", "Sur le toit de la cabine, l'ascenseur a redémarré d'un coup. J'ai été écrasé{|e} à moitié contre le plafond de la cage. Moitié, c'est déjà beaucoup trop. Il y a eu du sang sur trois étages."], en: ["I climbed onto the car roof. The cable vibrated. I slipped, caught myself by the {w:bodypart} on a beam and bled all over the shaft. The firefighters got me down like a piñata.", "On the car roof, the elevator suddenly restarted. I got half-crushed against the shaft ceiling. Half is already way too much. There was blood on three floors."] }, fx: { health: -18, happy: -6, visual: 'gore' }, mood: 'sick' },
          { w: 0.3, text: { fr: ["La trappe a cédé, le câble aussi. On a retrouvé la cabine au sous-sol, et moi un peu partout dans la cage, comme de la confiture sur une tartine verticale.", "J'étais à mi-chemin quand l'ascenseur est reparti vers le haut. Le 7e étage m'a coupé{|e} en deux. L'inconnu a fini son sandwich."], en: ["The hatch gave way, then the cable. They found the car in the basement, and me spread throughout the shaft like jam on vertical toast.", "I was halfway out when the elevator shot back up. The 7th floor cut me in half. The stranger finished his sandwich."] }, fx: { die: { fr: "coupé{|e} en deux par un ascenseur", en: 'cut in half by an elevator' }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Attendre et sympathiser', en: 'Wait and bond' }, text: { fr: ["On a attendu quatre heures. J'ai appris toute la vie de mon voisin, sa passion pour les trains miniatures et son divorce. À la fin, on s'est fait un câlin. Il dit bonjour, maintenant.", "J'ai tenu quatre heures sans faire pipi. À la troisième heure, l'inconnu m'a tendu une bouteille vide sans rien dire. Je l'ai remplie. On ne s'est plus jamais regardés."], en: ["We waited four hours. I learned my neighbor's entire life story, his model train hobby and his divorce. At the end, we hugged. He says hello now.", "I held my pee for four hours. In the third hour, the stranger silently handed me an empty bottle. I filled it. We never looked at each other again."] }, fx: { happy: 2, stress: 4, karma: 2 } },
      { label: { fr: 'Paniquer', en: 'Panic' }, text: { fr: ["J'ai paniqué. J'ai crié, j'ai pleuré, j'ai tapé sur les portes et j'ai dicté mon testament au téléphone. Le technicien est arrivé au bout de 12 minutes. Le voisin a tout filmé.", "Crise de panique, hyperventilation, malaise. L'inconnu m'a fait respirer dans le sac de son sandwich. Ça sentait l'oignon. Ça m'a calmé{|e}."], en: ["I panicked. Screamed, cried, banged on the doors and dictated my will over the phone. The technician arrived 12 minutes later. The neighbor filmed everything.", "Panic attack, hyperventilation, fainting spell. The stranger had me breathe into his sandwich bag. It smelled of onions. It calmed me down."] }, fx: { stress: 10, happy: -5 } },
    ],
  },
  {
    id: 'dy_locksmith',
    icon: '🔓',
    cat: 'adulting',
    rating: 1,
    vars: { amount: [300, 900] },
    scene: { place: 'apartment', mood: 'angry', prop: 'door' },
    when: { age: [18, 95], movedOut: true },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "Tu as claqué la porte avec les clés dedans. Le serrurier « d'urgence » trouvé sur internet arrive en 2 heures, ouvre en 8 secondes avec une radio et annonce : {$amount}.",
        "Le serrurier regarde ta serrure, siffle, et dit : « Ah, c'est un modèle allemand, ça. » Il ouvre avec {w:object}. Il te tend une facture de {$amount}.",
        "Bloqué{|e} dehors {w:weather}, tu appelles le premier serrurier sur internet. Il arrive en scooter, sans outils, et demande {$amount} « pour le déplacement ».",
        "Ta clé s'est cassée dans la serrure. La moitié est dans ta main, l'autre dans la porte. Le serrurier arrive, prend une photo et annonce : « Il faut changer toute la porte. Et le mur. » Il mange {w:food} en attendant ta réponse.",
      ],
      en: [
        "You slammed the door with the keys inside. The 'emergency' locksmith you found online arrives two hours later, opens it in 8 seconds with an X-ray film and announces: {$amount}.",
        "The locksmith looks at your lock, whistles, and says: 'Ah, that's a German model.' He opens it with {w:object}. He hands you a bill for {$amount}.",
        "Locked out {w:weather}, you call the first locksmith online. He arrives on a scooter, without tools, and asks for {$amount} 'for the trip'.",
        "Your key snapped in the lock. Half is in your hand, half is in the door. The locksmith arrives, takes a photo and announces: 'Gotta replace the whole door. And the wall.' He eats {w:food} while awaiting your answer.",
      ],
    },
    choices: [
      { label: { fr: 'Payer en pleurant', en: 'Pay, sobbing' }, text: { fr: ["J'ai payé {$amount}. Il a accepté uniquement les espèces, m'a accompagné{|e} au distributeur, et m'a laissé{|e} sa carte « pour la prochaine fois ». Il n'y aura pas de prochaine fois.", "J'ai payé {$amount} pour 8 secondes de travail. Ça fait un taux horaire supérieur à celui d'un chirurgien. Je change de métier."], en: ["I paid {$amount}. Cash only; he walked me to the ATM and left his card 'for next time'. There will be no next time.", "I paid {$amount} for 8 seconds of work. That's an hourly rate higher than a surgeon's. I'm changing careers."] }, fx: { money: '-amount', happy: -5 } },
      {
        label: { fr: 'Négocier dur', en: 'Haggle hard' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai menacé d'appeler la répression des fraudes. Le prix est tombé à 80 €. Il est reparti en grommelant. J'ai ouvert la porte en me sentant invincible.", "J'ai sorti le tarif officiel sur mon téléphone. Il a pâli. Il a divisé par quatre. On s'est quittés bons amis. Enfin, presque."], en: ["I threatened to report him for fraud. The price dropped to $80. He left grumbling. I opened my door feeling invincible.", "I pulled up the official rates on my phone. He went pale. He divided by four. We parted as friends. Almost."] }, fx: { money: -80, happy: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai tenté de négocier. Il a refermé la porte. À clé. Avec ma clé. Et il a augmenté le prix. Bordel.", "Il a refusé de baisser son prix et m'a menacé{|e} d'appeler « ses cousins ». Ses cousins sont arrivés. J'ai payé {$amount}, plus le café des cousins."], en: ["I tried haggling. He closed the door. Locked it. With my key. And raised the price. Goddammit.", "He refused to budge and threatened to call 'his cousins'. The cousins showed up. I paid {$amount}, plus the cousins' coffee."] }, fx: { money: '-amount', stress: 6 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Passer par la fenêtre', en: 'Go through the window' }, text: { fr: ["J'ai escaladé la façade jusqu'à ma fenêtre du 2e. Un voisin a appelé la police. Les flics m'ont regardé{|e} entrer, puis m'ont demandé de prouver que c'était chez moi. Avec quoi ? Mes clés sont dedans.", "J'ai grimpé par la gouttière. Ça a marché ! Mais la fenêtre était fermée. Je suis resté{|e} accroché{|e} 40 minutes jusqu'à ce que les pompiers arrivent. Ils ont ri."], en: ["I climbed the building to my 2nd-floor window. A neighbor called the police. The cops watched me climb in, then asked me to prove it was my place. With what? My keys are inside.", "I climbed the drainpipe. It worked! But the window was closed. I hung there for 40 minutes until the firefighters came. They laughed."] }, fx: { athletic: 3, heat: 3, happy: 1 } },
    ],
  },
  // ───────────────────────────── corps, santé, look ─────────────────────────────
  {
    id: 'dy_gym_viral',
    icon: '🏋️',
    cat: 'daily',
    rating: 2,
    scene: { place: 'stadium', mood: 'shock', prop: 'dumbbell' },
    when: { age: [18, 70] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "À la salle, un influenceur torse nu filme sa séance avec un trépied. Tu es pile dans le cadre, derrière lui, en train de faire une grimace de constipé sur la presse à cuisses, sur fond de {w:song}.",
        "Tu tentes un squat lourd pour la première fois. Au moment de remonter, ton corps lâche {w:sound}. Toute la salle se retourne. Le coach arrête de compter.",
        "Un gym bro te donne des conseils non sollicités depuis 20 minutes. Il dégage {w:smell}, il dit « bro » toutes les trois secondes et il vient de prendre ta machine.",
        "Tu cours sur le tapis à côté d'une personne magnifique. Tu accélères pour impressionner. Tu accélères encore. Ton cœur fait un bruit bizarre. Tes jambes aussi : {w:sound}.",
      ],
      en: [
        "At the gym, a shirtless influencer is filming his workout on a tripod. You're right in frame, behind him, making a constipated face on the leg press, to {w:song}.",
        "You try a heavy squat for the first time. As you push up, your body releases {w:sound}. The whole gym turns around. The coach stops counting.",
        "A gym bro has been giving you unsolicited advice for 20 minutes. He gives off {w:smell}, says 'bro' every three seconds and just took your machine.",
        "You're running on the treadmill next to a gorgeous person. You speed up to impress. You speed up more. Your heart makes a weird noise. So do your legs: {w:sound}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Continuer comme si de rien', en: 'Keep going like nothing happened' },
        out: [
          { w: 1, text: { fr: ["J'ai continué, digne, en sueur. La vidéo de l'influenceur a fait 4 millions de vues, et c'est moi que les commentaires adorent : « Le mec derrière 💀💀 ». J'ai désormais des fans.", "J'ai terminé ma série comme un{|e} pro. Personne ne m'a rien dit. Mais j'ai été rebaptisé{|e} « Pétard » par l'équipe de l'accueil."], en: ["I kept going, dignified, sweaty. The influencer's video got 4 million views, and the comments love me: 'The guy in the back 💀💀'. I now have fans.", "I finished my set like a pro. Nobody said a word. But the front desk staff renamed me 'Firecracker'."] }, fx: { happy: 3, followers: 4000, fame: 2 } },
          { w: 1, text: { fr: ["J'ai voulu continuer. Le tapis m'a éjecté{|e} comme un vieux carton. J'ai traversé la salle sur le ventre et fini contre le distributeur de protéines. Il a fait {w:sound}.", "J'ai repris le squat. Le pet n'était pas seul. Il y avait un passager. J'ai fini la séance en marchant comme un pingouin jusqu'aux vestiaires, sans m'arrêter."], en: ["I tried to keep going. The treadmill ejected me like an old cardboard box. I slid across the gym on my belly and ended against the protein vending machine. It made {w:sound}.", "I went back to squatting. The fart wasn't alone. It had a passenger. I finished the session waddling like a penguin to the locker room, nonstop."] }, fx: { happy: -8, health: -3, looks: -2, visual: 'poop' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Rejoindre le délire', en: 'Lean into it' }, text: { fr: ["J'ai fait un clin d'œil à la caméra de l'influenceur et un salut militaire. Il m'a invité{|e} à faire une vidéo avec lui. On est potes. Il est très bête et très gentil.", "J'ai éclaté de rire, et toute la salle a suivi. Le gym bro m'a tapé dans la main : « Respect, bro. » C'était le moment le plus viril de ma vie."], en: ["I winked at the influencer's camera and saluted. He invited me to do a video with him. We're friends. He's very dumb and very nice.", "I burst out laughing, and the whole gym joined in. The gym bro high-fived me: 'Respect, bro.' Most macho moment of my life."] }, fx: { happy: 5, followers: 1000 } },
      { label: { fr: 'Résilier l\'abonnement', en: 'Cancel my membership' }, text: { fr: ["J'ai décidé de ne jamais revenir. Mais résilier, c'est une autre histoire. Je paie encore. Je n'y vais plus. Je suis un mécène de la salle de sport.", "Je suis parti{|e} et je ne suis jamais revenu{|e}. Je fais maintenant du sport chez moi, en pyjama. Je ne fais pas de sport. Mais j'ai le pyjama."], en: ["I decided never to go back. But cancelling is another story. I still pay. I don't go. I'm a patron of the gym.", "I left and never came back. I now work out at home, in pajamas. I don't work out. But I have the pajamas."] }, fx: { happy: -1, athletic: -1 } },
    ],
  },
  {
    id: 'dy_gym_cancel',
    icon: '📝',
    cat: 'adulting',
    rating: 0,
    vars: { amount: [150, 600] },
    scene: { place: 'stadium', mood: 'angry', prop: 'paper' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Tu veux résilier ton abonnement à la salle de sport, où tu n'es pas allé{|e} depuis 14 mois. Il faut une lettre recommandée, un certificat médical et apparemment un sacrifice rituel, de préférence {w:animal}.",
        "Pour résilier ta salle, l'appli te propose un bouton « Résilier ». Il mène à « Êtes-vous sûr{|e} ? », puis « Vraiment ? », puis une vidéo de 3 minutes d'un coach qui pleure.",
        "L'abonnement de ta salle de sport se renouvelle tacitement. Tu as payé {$amount} cette année. Tu y es allé{|e} deux fois. Une fois pour t'inscrire, une fois pour les toilettes.",
        "Au comptoir de la salle, le commercial refuse ta résiliation : « Vous ne voulez pas plutôt faire une pause ? Un coach perso ? Un smoothie offert ? Un câlin ? Et en cadeau, {w:gift} ? »",
      ],
      en: [
        "You want to cancel your gym membership. You haven't been in 14 months. It requires a certified letter, a medical certificate and apparently a ritual sacrifice, preferably {w:animal}.",
        "To cancel your gym, the app offers a 'Cancel' button. It leads to 'Are you sure?', then 'Really?', then a 3-minute video of a coach crying.",
        "Your gym membership auto-renews. You paid {$amount} this year. You went twice. Once to sign up, once to use the toilet.",
        "At the gym desk, the salesperson refuses your cancellation: 'Wouldn't you rather pause it? A personal trainer? A free smoothie? A hug? And {w:gift}, as a gift?'",
      ],
    },
    choices: [
      {
        label: { fr: 'Lettre recommandée', en: 'Certified letter' },
        out: [
          { w: 1, text: { fr: ["J'ai envoyé la lettre. Ils l'ont reçue. Ils ont résilié. Je n'arrive pas à y croire. J'ai pleuré de joie devant ma boîte aux lettres.", "Lettre recommandée, accusé de réception, photocopie certifiée. Résiliation acceptée au bout de trois mois. J'ai économisé {$amount}. J'ai fêté ça avec une pizza."], en: ["I sent the letter. They received it. They cancelled. I can't believe it. I cried with joy at my mailbox.", "Certified letter, return receipt, certified copy. Cancellation accepted after three months. I saved {$amount}. Celebrated with a pizza."] }, fx: { money: 'amount', happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: ["Ils ont « perdu » ma lettre. Puis la deuxième. Pour la troisième, la salle avait déménagé. Je paie toujours. Je ne sais même plus où elle se trouve.", "Résiliation refusée : il manquait « le formulaire C-12 », qui n'est disponible qu'à l'accueil, ouvert le dimanche de 6 h à 6 h 15. {$amount} prélevés."], en: ["They 'lost' my letter. Then the second. By the third, the gym had moved. I still pay. I don't even know where it is anymore.", "Cancellation denied: missing 'form C-12', only available at the front desk, open Sundays from 6:00 to 6:15 a.m. {$amount} charged."] }, fx: { money: '-amount', stress: 5 } },
        ],
      },
      { label: { fr: 'Y retourner, finalement', en: 'Actually go back' }, text: { fr: ["Par culpabilité, j'y suis retourné{|e}. Une séance. J'ai eu des courbatures pendant neuf jours. J'ai compris pourquoi je n'y allais pas.", "J'y suis retourné{|e} pour rentabiliser. J'y vais maintenant trois fois par semaine. Je suis en forme, et en colère d'avoir eu tort."], en: ["Out of guilt, I went back. One session. Sore for nine days. I remembered why I didn't go.", "I went back to get my money's worth. I now go three times a week. I'm fit, and angry about being wrong."] }, fx: { athletic: 4, health: 3, happy: -1 } },
      { label: { fr: 'Changer de banque', en: 'Switch banks' }, text: { fr: ["J'ai changé de banque pour bloquer les prélèvements. La salle m'a retrouvé{|e}. Ils m'envoient maintenant des cartes postales : « Vous nous manquez 💪 ».", "J'ai fermé mon compte. La salle a envoyé un huissier. L'huissier était abonné à la même salle. Il m'a montré son ventre. On a pleuré ensemble."], en: ["I switched banks to block the payments. The gym found me. They now send postcards: 'We miss you 💪'.", "I closed my account. The gym sent a debt collector. The collector was a member of the same gym. He showed me his belly. We cried together."] }, fx: { stress: 3, happy: 2 } },
    ],
  },
  {
    id: 'dy_gp_waiting',
    icon: '🩺',
    cat: 'adulting',
    rating: 2,
    scene: { place: 'hospital', mood: 'sick', prop: 'chair' },
    when: { age: [18, 95] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Salle d'attente du médecin. Ton rendez-vous était à 14 h. Il est 16 h 40. Autour de toi, tout le monde tousse dans ta direction. Les magazines datent de l'élection de 2007. En couverture : {w:celeb}.",
        "Le médecin te reçoit pour une consultation de 7 minutes, dont 5 à taper sur son ordi sans te regarder. Tu as à peine commencé à décrire tes symptômes qu'il imprime déjà une ordonnance. Diagnostic : « c'est viral ». Remède : {w:drink}.",
        "Dans la salle d'attente, un homme t'explique en détail son problème de fistule anale, avec les mains. Il veut te montrer des photos. Tu es là pour un rhume. Il dégage {w:smell}.",
        "Le médecin te demande un échantillon d'urine. Le gobelet fait 3 cm de diamètre. Les toilettes du cabinet n'ont pas de verrou, et une odeur flotte : {w:smell}.",
      ],
      en: [
        "Doctor's waiting room. Your appointment was at 2 p.m. It's 4:40. Everyone around you is coughing in your direction. The magazines date back to the 2007 election. On the cover: {w:celeb}.",
        "The doctor sees you for a 7-minute consultation, 5 of which he spends typing without looking at you. You've barely started describing your symptoms and he's already printing a prescription. Diagnosis: 'it's viral'. Remedy: {w:drink}.",
        "In the waiting room, a man explains his anal fistula in detail, with hand gestures. He wants to show you photos. You're here for a cold. He gives off {w:smell}.",
        "The doctor asks for a urine sample. The cup is an inch wide. The office bathroom has no lock, and there's {w:smell} in the air.",
      ],
    },
    choices: [
      {
        label: { fr: 'Attendre héroïquement', en: 'Wait heroically' },
        out: [
          { w: 2, text: { fr: ["J'ai attendu trois heures. Je suis entré{|e} avec un rhume et ressorti{|e} avec une grippe, une conjonctivite et des connaissances poussées en fistules.", "J'ai lu tous les magazines de 2007. Je sais maintenant tout sur le mariage de stars divorcées depuis dix ans. Le rendez-vous a duré six minutes. Antibiotiques."], en: ["I waited three hours. I went in with a cold and came out with the flu, pink eye and an advanced knowledge of fistulas.", "I read every 2007 magazine. I now know everything about celebrity weddings that ended in divorce a decade ago. The appointment lasted six minutes. Antibiotics."] }, fx: { health: -4, stress: 4, disease: 'flu' }, mood: 'sick' },
          { w: 1, text: { fr: ["Pendant l'attente, j'ai rencontré quelqu'un d'adorable qui avait la même angine que moi. On a toussé ensemble. On se voit samedi. Romantique et contagieux.", "J'ai attendu longtemps, mais le médecin a été génial : il m'a écouté{|e} et m'a soigné{|e}. Je suis ressorti{|e} guéri{|e} et légèrement amoureux{|se} de lui."], en: ["While waiting, I met someone adorable with the same strep throat. We coughed together. We're meeting Saturday. Romantic and contagious.", "I waited a long time, but the doctor was great: he listened and treated me. I left cured and slightly in love with him."] }, fx: { happy: 5, health: 3 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'L\'échantillon', en: 'The sample' },
        out: [
          { w: 1, text: { fr: ["J'ai visé le gobelet. J'ai touché ma main, mon pantalon, le mur et un peu le gobelet. J'ai rendu l'échantillon tiède, collant, avec un sourire figé. L'infirmière n'a rien dit.", "La porte s'est ouverte en plein remplissage. C'était une petite vieille. Elle a dit « oh pardon », puis elle est restée là à me regarder. Les deux mains prises, je n'ai rien pu faire."], en: ["I aimed at the cup. I hit my hand, my pants, the wall and a little bit of the cup. I handed it in warm, sticky, with a frozen smile. The nurse said nothing.", "The door opened mid-fill. It was a little old lady. She said 'oh sorry', then just stood there watching. Both hands busy, I couldn't do a thing."] }, fx: { happy: -6, looks: -1 }, mood: 'shock' },
          { w: 1, text: { fr: ["J'ai rempli le gobelet avec une précision chirurgicale. L'infirmière a dit « parfait ». C'est le premier compliment que je reçois depuis des mois. Je l'ai pris très au sérieux.", "Échantillon parfait, résultats parfaits. Le médecin m'a dit que j'avais « l'urine d'un athlète ». J'ai mis ça dans mon profil de rencontre."], en: ["I filled the cup with surgical precision. The nurse said 'perfect'. First compliment I've had in months. I took it very seriously.", "Perfect sample, perfect results. The doctor said I have 'an athlete's urine'. I put it on my dating profile."] }, fx: { happy: 4, health: 2 } },
        ],
      },
      { label: { fr: 'Partir, se soigner soi-même', en: 'Leave and self-treat' }, text: { fr: ["Je suis parti{|e} et j'ai lu internet. D'après internet, j'ai soit un rhume, soit une maladie tropicale rare. J'ai pris du paracétamol et écrit mon testament.", "J'ai quitté la salle d'attente et je me suis soigné{|e} avec une tisane de mamie et {w:drink}. Je vais mieux. Ou je suis mort{|e} et c'est le paradis. Difficile à dire."], en: ["I left and read the internet. According to the internet, I have either a cold or a rare tropical disease. I took Tylenol and wrote my will.", "I left the waiting room and self-treated with grandma's herbal tea and {w:drink}. I feel better. Or I'm dead and this is heaven. Hard to say."] }, fx: { stress: 4, health: -1 } },
    ],
  },
  {
    id: 'dy_pharmacy_loud',
    icon: '💊',
    cat: 'daily',
    rating: 2,
    scene: { place: 'hospital', mood: 'shock', prop: 'pills' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "À la pharmacie, tu tends discrètement ta liste : crème contre les hémorroïdes, préservatifs XL, lubrifiant et un test de grossesse. Le pharmacien relit tout, À VOIX HAUTE. La file d'attente compte douze personnes, dont ton ancienne prof de maths.",
        "Tu demandes à voix basse « un truc pour les champignons… là-bas ». Le pharmacien crie à sa collègue : « Tu peux apporter l'antifongique pour les parties intimes de la personne ici présente ? »",
        "Le pharmacien te demande devant tout le monde : « Et ces diarrhées, c'est liquide ou plutôt pâteux ? » Derrière toi, quelqu'un tient {w:food} et le repose lentement.",
        "Tu achètes un traitement contre les poux, une crème anti-verrues et des laxatifs. Le pharmacien te regarde, regarde le panier, te regarde : « Grosse semaine, hein ? » Il glisse {w:gift} dans ton sac, « offert ».",
      ],
      en: [
        "At the pharmacy, you discreetly hand over your list: hemorrhoid cream, XL condoms, lube and a pregnancy test. The pharmacist reads it all OUT LOUD. There are twelve people in line, including your old math teacher.",
        "You whisper for 'something for fungus… down there'. The pharmacist shouts to his colleague: 'Can you bring the antifungal for this customer's private parts?'",
        "The pharmacist asks you in front of everyone: 'And this diarrhea, is it liquid or more like paste?' Behind you, someone holding {w:food} slowly puts it down.",
        "You're buying lice treatment, wart cream and laxatives. The pharmacist looks at you, at the basket, at you again: 'Big week, huh?' He slips {w:gift} into your bag, 'on the house'.",
      ],
    },
    choices: [
      { label: { fr: 'Assumer fièrement', en: 'Own it proudly' }, text: { fr: ["J'ai répondu bien fort : « Oui, et j'en voudrais deux boîtes. » Applaudissements discrets dans la file. Mon ancienne prof de maths m'a fait un clin d'œil. Je ne sais pas quoi en penser.", "J'ai assumé : « Pâteux, merci. » Le pharmacien a hoché la tête, impressionné. Un monsieur derrière moi a dit « courage ». J'ai senti une vraie solidarité humaine."], en: ["I answered loudly: 'Yes, and I'll take two boxes.' Quiet applause from the line. My old math teacher winked at me. I don't know how to feel about that.", "I owned it: 'Paste, thank you.' The pharmacist nodded, impressed. A man behind me said 'hang in there'. I felt real human solidarity."] }, fx: { happy: 4, stress: -2 } },
      {
        label: { fr: 'Prétendre que c\'est pour un ami', en: "Say it's for a friend" },
        out: [
          { w: 1, text: { fr: ["J'ai dit que c'était pour un ami. Le pharmacien a demandé le nom de l'ami pour l'ordonnance. J'ai paniqué et donné le nom de mon boss. Il est maintenant dans leur fichier.", "« C'est pour un ami. » Le pharmacien a souri : « Bien sûr. Dites à votre ami de bien appliquer matin et soir, en massant. » Toute la file a ri."], en: ["I said it was for a friend. The pharmacist asked the friend's name for the file. I panicked and gave my boss's name. He's now in their system.", "'It's for a friend.' The pharmacist smiled: 'Of course. Tell your friend to apply morning and night, massaging gently.' The whole line laughed."] }, fx: { stress: 5, happy: -3 } },
          { w: 1, text: { fr: ["« C'est pour un ami. » Pile à ce moment, mon ami est entré dans la pharmacie. Le pharmacien lui a tendu le sac. Mon ami a regardé dedans. On ne se parle plus.", "Mon excuse aurait marché si la crème n'avait pas déjà été ouverte et si je n'avais pas commencé à me gratter en parlant."], en: ["'It's for a friend.' Right then, my friend walked into the pharmacy. The pharmacist handed him the bag. My friend looked inside. We no longer speak.", "My excuse would have worked if the cream hadn't already been opened and I hadn't started scratching while talking."] }, fx: { happy: -6, stress: 4 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Fuir et commander en ligne', en: 'Flee and order online' }, text: { fr: ["J'ai fui et tout commandé en ligne. Le colis est arrivé chez mon voisin, ouvert, avec le contenu étalé sur son paillasson. Il m'a dit « bon courage » en me le tendant.", "J'ai commandé en ligne. Le livreur a sonné, regardé le colis, regardé ma tête, et m'a souhaité « une bonne guérison » devant toute la cage d'escalier."], en: ["I fled and ordered everything online. The package went to my neighbor, opened, contents spread over his doormat. He said 'good luck' handing it to me.", "I ordered online. The courier rang, looked at the package, looked at my face, and wished me 'a speedy recovery' in front of the whole stairwell."] }, fx: { stress: 3, money: -20 } },
    ],
  },
  {
    id: 'dy_haircut_fail',
    icon: '💇',
    cat: 'daily',
    rating: 0,
    vars: { amount: [30, 120] },
    scene: { place: 'studio', mood: 'shock', prop: 'scissors' },
    when: { age: [18, 90] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: [
        "Tu as demandé « juste les pointes ». Le coiffeur a compris « la coupe façon {w:celeb} ». Il pose le miroir derrière ta tête avec fierté. Tu ne reconnais pas ta propre nuque.",
        "Le coiffeur parle de ses vacances, gesticule avec ses ciseaux et coupe pendant ce temps une mèche au hasard. Puis une autre pour « équilibrer ». Puis une autre. Dans le miroir, tu vois {w:animal}.",
        "Tu as montré une photo de mannequin. Tu ressors avec la coupe de ton grand-oncle Gérard en 1983. Ça coûte {$amount}. Il te demande si tu veux un rendez-vous dans six semaines, et t'offre {w:gift}.",
        "Coloration ratée. Tu voulais « châtain miel ». Tu es orange fluo. Le coloriste dit que « ça va se patiner ». Ça brille dans le noir. Un enfant te montre du doigt : « {w:exclaim} »",
      ],
      en: [
        "You asked for 'just a trim'. The hairdresser heard 'the {w:celeb} cut'. He holds the mirror behind your head proudly. You don't recognize your own neck.",
        "The hairdresser talks about his vacation, waving his scissors around while snipping random strands. Then another 'to even it out'. Then another. In the mirror, you see {w:animal}.",
        "You showed a photo of a model. You walk out with your great-uncle Gerard's 1983 haircut. It costs {$amount}. He asks if you want to book again in six weeks, and hands you {w:gift}.",
        "Botched dye job. You wanted 'honey brown'. You're neon orange. The colorist says 'it'll mellow out'. It glows in the dark. A kid points at you: '{w:exclaim}'",
      ],
    },
    choices: [
      { label: { fr: '« C\'est super, merci »', en: "'It's great, thanks'" }, text: { fr: ["J'ai dit « c'est super » en souriant, payé {$amount}, laissé un pourboire, et pleuré dans la voiture pendant 25 minutes. Comme tout le monde.", "« J'adore ! » J'ai payé {$amount}. J'ai porté un bonnet pendant trois semaines. En plein mois d'août."], en: ["I said 'it's great' with a smile, paid {$amount}, tipped, and cried in the car for 25 minutes. Like everyone does.", "'I love it!' I paid {$amount}. I wore a beanie for three weeks. In August."] }, fx: { money: '-amount', looks: -5, happy: -4 } },
      {
        label: { fr: 'Demander de rattraper', en: 'Ask them to fix it' },
        out: [
          { w: 1, text: { fr: ["Il a « rattrapé ». Il ne restait plus assez de cheveux pour rattraper quoi que ce soit. Je suis ressorti{|e} quasi tondu{|e}. Les gens me trouvent « audacieux{|se} ».", "Le coiffeur a tenté de corriger. Puis sa collègue. Puis le patron. Ils étaient trois sur ma tête. Résultat : un chef-d'œuvre d'art moderne. Ça a été offert, au moins."], en: ["He 'fixed' it. There wasn't enough hair left to fix anything. I came out nearly shaved. People find me 'bold'.", "The hairdresser tried to correct it. Then his colleague. Then the owner. Three of them on my head. Result: a modern art masterpiece. At least it was free."] }, fx: { looks: -6, happy: -3 } },
          { w: 1, text: { fr: ["La patronne a pris les choses en main. Une heure plus tard, j'avais la plus belle coupe de ma vie. Tout le monde me complimente. Je retourne toujours chez elle, et seulement elle.", "Rattrapage réussi ! La coupe est encore mieux que la photo. J'ai pris 40 selfies dans la rue. Une inconnue m'a demandé le nom du salon."], en: ["The owner took over. An hour later, I had the best haircut of my life. Everyone compliments me. I only go to her now.", "Fix successful! Better than the photo. I took 40 selfies in the street. A stranger asked for the salon's name."] }, fx: { looks: 6, happy: 6 }, mood: 'happy' },
        ],
      },
      { label: { fr: 'Tout raser chez soi', en: 'Shave it all off at home' }, text: { fr: ["J'ai tout rasé moi-même dans la salle de bain. Je me suis entaillé le crâne trois fois. Je ressemble à un moine qui s'est battu. Mais c'est MOI qui ai décidé.", "Tondeuse à fond, sabot de 3 mm. J'ai oublié de mettre le sabot. Je suis chauve. J'ai une tête en forme d'œuf. Je l'ignorais jusqu'ici."], en: ["I shaved it all off myself in the bathroom. Nicked my scalp three times. I look like a monk who got in a fight. But it was MY decision.", "Clippers on full, quarter-inch guard. Forgot the guard. I'm bald. My head is egg-shaped. I didn't know that until now."] }, fx: { looks: -3, happy: 2 } },
    ],
  },
  {
    id: 'dy_barber_divorce',
    icon: '💈',
    cat: 'daily',
    rating: 2,
    vars: { amount: [20, 80] },
    scene: { place: 'studio', mood: 'shock', prop: 'razor', fx: 'gore' },
    when: { age: [18, 90] },
    weight: 6,
    cooldown: 5,
    text: {
      fr: [
        "Ton barbier te rase au coupe-chou en te racontant son divorce. Il en est au moment où sa femme est partie avec son meilleur ami. Sa main tremble. Il a l'haleine de quelqu'un qui a fini {w:drink}. La lame est sur ta carotide.",
        "Le coiffeur coupe tes cheveux en parlant de son ex, de plus en plus fort. Il serre les ciseaux. Il dit « je vais le tuer » puis « {w:threat} ». Les ciseaux sont à 2 cm de ton oreille.",
        "Ton barbier a visiblement bu. Il a l'haleine de quelqu'un qui a sifflé {w:drink}, il chante {w:song} et il te rase la nuque avec une tondeuse qu'il tient à l'envers.",
        "La nouvelle esthéticienne te fait une épilation des sourcils. Elle est en formation. Elle tire la langue en se concentrant. Elle a déjà demandé deux fois « c'est normal, ça ? ».",
      ],
      en: [
        "Your barber is giving you a straight-razor shave while telling you about his divorce. He's at the part where his wife left with his best friend. His hand is shaking. His breath says he just finished {w:drink}. The blade is on your carotid.",
        "The hairdresser cuts your hair while talking about her ex, louder and louder. She grips the scissors. She says 'I'm going to kill him', then '{w:threat}'. The scissors are an inch from your ear.",
        "Your barber is clearly drunk. His breath says he just downed {w:drink}, he's singing {w:song} and shaving your neck with clippers held upside down.",
        "The new beautician is waxing your eyebrows. She's a trainee. She sticks her tongue out in concentration. She's already asked twice 'is that normal?'",
      ],
    },
    choices: [
      {
        label: { fr: 'Ne plus bouger', en: 'Freeze completely' },
        out: [
          { w: 2, text: { fr: ["Je n'ai plus respiré pendant dix minutes. Il a fini sans une égratignure, en pleurant. Je lui ai laissé un énorme pourboire et l'adresse de mon psy.", "Immobile comme une statue. Le rasage était parfait. Je n'ai jamais eu la peau aussi douce ni aussi peur de mourir. Les deux sont liés, je pense."], en: ["I didn't breathe for ten minutes. He finished without a scratch, crying. I left a huge tip and my therapist's number.", "Still as a statue. The shave was perfect. I've never had such smooth skin or been so scared of death. The two are related, I think."] }, fx: { stress: 6, looks: 3, money: '-amount' } },
          { w: 1, text: { fr: ["Il a éternué. Un bout de mon oreille est tombé dans le bac à shampoing. Le sang a giclé sur le miroir, sur le fauteuil et sur le client d'à côté qui lisait un article sur {w:show}. Il m'a offert la coupe.", "Il a raté le sourcil et attrapé la paupière. J'ai hurlé « {w:swear} » et giclé du sang partout. Je ressemble à un pirate. Un pirate avec un sourcil."], en: ["He sneezed. A piece of my ear fell into the shampoo sink. Blood sprayed onto the mirror, the chair and the guy next to me reading about {w:show}. He gave me the cut for free.", "She missed the eyebrow and caught the eyelid. I screamed '{w:swear}' and bled everywhere. I look like a pirate. A pirate with one eyebrow."] }, fx: { health: -10, looks: -8, happy: -6, visual: 'gore' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Le consoler', en: 'Comfort him' }, text: { fr: ["Je lui ai dit qu'il méritait mieux. Il a posé le rasoir et m'a serré dans ses bras, la mousse à raser sur nos deux visages. On est restés comme ça cinq minutes. Le client suivant a attendu.", "Je l'ai écouté pendant une heure. Il m'a offert la coupe, une bière et l'invitation à son « divorce party ». J'y vais samedi."], en: ["I told him he deserved better. He put down the razor and hugged me, shaving cream on both our faces. We stayed like that for five minutes. The next customer waited.", "I listened to him for an hour. He gave me a free cut, a beer and an invite to his 'divorce party'. I'm going on Saturday."] }, fx: { karma: 5, happy: 3 } },
      { label: { fr: 'Fuir en pleine coupe', en: 'Flee half-shaved' }, text: { fr: ["Je me suis levé{|e} d'un bond et je suis parti{|e} en courant, la moitié du visage pleine de mousse. J'ai pris le bus comme ça. Personne ne m'a rien dit. C'est la ville.", "J'ai fui avec la cape encore autour du cou et une seule moitié de coupe. J'ai fini moi-même chez moi. Les deux moitiés ne vont pas ensemble, mais je suis vivant{|e}."], en: ["I leapt up and ran out, half my face covered in shaving cream. Took the bus like that. Nobody said anything. That's the city.", "I fled with the cape still around my neck and half a haircut. I finished it myself at home. The halves don't match, but I'm alive."] }, fx: { looks: -4, happy: 1 } },
    ],
  },
  {
    id: 'dy_pants_split',
    icon: '👖',
    cat: 'daily',
    rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'pants' },
    when: { age: [18, 85] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Tu te baisses pour ramasser {w:object} au boulot. RRRRAAAC. Ton pantalon se déchire de la ceinture à l'entrejambe. Tu portes le slip avec les petits cœurs, aujourd'hui.",
        "En plein rendez-vous important, tu te lèves et sens un courant d'air. La couture arrière a lâché. Tu portes un string. Ou rien. Tu ne sais plus. Tu as peur de vérifier. Ton client fixe tes fesses en mangeant {w:food}.",
        "Mariage d'un ami. Tu danses le rock sur {w:song}. Ton partenaire te fait tourner. Ta braguette explose. Un bouton atterrit dans la coupe de champagne de la mariée.",
        "Tu montes les escaliers du métro avec ton nouveau pantalon slim. Il se fend sur toute la longueur de la fesse. Derrière toi, quelqu'un dit {w:exclaim}",
      ],
      en: [
        "You bend down to pick up {w:object} at work. RRRRIP. Your pants tear from the waistband to the crotch. Today you're wearing the underwear with little hearts.",
        "In the middle of an important meeting, you stand up and feel a draft. The back seam gave out. You're wearing a thong. Or nothing. You don't remember. You're scared to check. Your client stares at your butt while eating {w:food}.",
        "A friend's wedding. You're swing dancing to {w:song}. Your partner spins you. Your fly explodes. A button lands in the bride's champagne glass.",
        "You're climbing the subway stairs in your new skinny jeans. They split along the whole length of your butt. Behind you, someone says {w:exclaim}",
      ],
    },
    choices: [
      { label: { fr: 'Nouer un pull autour', en: 'Tie a sweater around' }, text: { fr: ["J'ai noué mon pull autour de la taille et marché de côté, comme un crabe, toute la journée. Personne n'a rien vu. Ou tout le monde a été très gentil.", "Pull noué à la taille, sourire crispé. Le boss m'a demandé si j'avais froid aux reins. J'ai dit oui. Il m'a offert une bouillotte."], en: ["I tied my sweater around my waist and walked sideways like a crab all day. Nobody noticed. Or everyone was very kind.", "Sweater around the waist, tight smile. The boss asked if my lower back was cold. I said yes. He gave me a hot water bottle."] }, fx: { stress: 3 } },
      {
        label: { fr: 'Assumer la ventilation', en: 'Embrace the ventilation' },
        out: [
          { w: 1, text: { fr: ["J'ai déclaré que c'était « la nouvelle tendance ». Deux collègues ont déchiré leur pantalon par solidarité. On a lancé une mode. On est des icônes.", "J'ai continué ma journée en assumant. Le slip à cœurs a fait sensation. On m'appelle « Cupidon » à l'étage. Ça me va."], en: ["I declared it 'the new trend'. Two coworkers ripped their pants in solidarity. We started a fashion movement. We're icons.", "I carried on with my day, owning it. The heart underwear was a sensation. They call me 'Cupid' on my floor. I'm fine with it."] }, fx: { happy: 5, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["En assumant, je me suis assis{|e} sur une chaise en plastique. La chaise était froide, mouillée, et quelqu'un y avait renversé du café. J'ai senti le café partout. Partout.", "J'ai voulu assumer, mais un collègue a pris une photo de mes fesses à l'air. Elle est maintenant le fond d'écran du groupe WhatsApp du service. Avec un zoom."], en: ["Owning it, I sat on a plastic chair. The chair was cold, wet, and someone had spilled coffee on it. I felt coffee everywhere. Everywhere.", "I tried to own it, but a coworker snapped a photo of my exposed butt. It's now the department group chat's wallpaper. Zoomed in."] }, fx: { happy: -6, looks: -2 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Rentrer en courant', en: 'Run home' }, text: { fr: ["J'ai couru jusqu'à chez moi, les mains sur les fesses. Un pigeon m'a suivi{|e} pendant tout le trajet. Il a vu des choses.", "Je suis rentré{|e} en taxi, assis{|e} sur mon sac. Le chauffeur a dit : « Ça arrive. » Il avait l'air de parler d'expérience."], en: ["I ran home with my hands on my butt. A pigeon followed me the whole way. It saw things.", "I took a cab home, sitting on my bag. The driver said: 'It happens.' He seemed to speak from experience."] }, fx: { athletic: 1, money: -20, happy: -2 } },
    ],
  },
  {
    id: 'dy_pigeon_mouth',
    icon: '🐦',
    cat: 'luck',
    rating: 2,
    scene: { place: 'park', mood: 'sick', prop: 'pigeon', fx: 'poop' },
    when: { age: [18, 95] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Tu bâilles en marchant dans la rue. Un pigeon, en vol, au-dessus de toi, choisit cet instant précis. C'est tiède. C'est dans ta bouche. C'est sur ta langue. Arrière-goût : {w:food}.",
        "Terrasse de café, tu lèves ton verre pour trinquer. Une mouette lâche une fiente pile dedans. Ta boisson ({w:drink}) a maintenant une garniture.",
        "Tu es en plein appel vidéo important, dans la rue, quand un pigeon te chie dessus. Sur la tête, le front, puis l'œil. Ton interlocuteur a tout vu en HD. Il a lâché un « {w:exclaim} » très professionnel.",
        "Un vol de pigeons passe au-dessus du parc. Tu lèves la tête pour regarder, bouche ouverte, émerveillé{|e}. Erreur. Erreur fatale.",
      ],
      en: [
        "You yawn while walking down the street. A pigeon flying overhead chooses that precise moment. It's warm. It's in your mouth. It's on your tongue. Aftertaste: {w:food}.",
        "Café terrace, you raise your glass for a toast. A seagull drops a load right into it. Your drink ({w:drink}) now has a garnish.",
        "You're on an important video call, outside, when a pigeon poops on you. On the head, the forehead, then the eye. The person on the call saw everything in HD. They let out a very professional '{w:exclaim}'",
        "A flock of pigeons flies over the park. You look up, mouth open, in awe. Mistake. Fatal mistake.",
      ],
    },
    choices: [
      {
        label: { fr: 'Cracher et hurler', en: 'Spit and scream' },
        out: [
          { w: 2, text: { fr: ["J'ai craché, hurlé « {w:swear} » et me suis rincé la bouche avec le café d'un inconnu en terrasse. Il ne m'a rien dit. Il a juste payé un autre café et s'est éloigné.", "J'ai vomi dans un caniveau, puis dans un deuxième, puis j'ai acheté un bain de bouche à la pharmacie et je l'ai bu entier. J'ai encore le goût. J'aurai toujours le goût."], en: ["I spat, screamed '{w:swear}' and rinsed my mouth with a stranger's coffee at a café. He said nothing. He just bought another coffee and walked away.", "I vomited into a gutter, then another, then bought mouthwash at the pharmacy and drank the whole bottle. I can still taste it. I'll always taste it."] }, fx: { happy: -8, health: -3 }, mood: 'sick' },
          { w: 1, text: { fr: ["Une passante m'a dit que ça portait chance. J'ai acheté un ticket à gratter avec la bouche encore pleine. J'ai gagné 500 €. Le pigeon avait raison.", "Il paraît que ça porte bonheur. Le soir même, j'ai trouvé 50 € par terre. Ça ne valait pas le coup, mais c'est 50 €."], en: ["A passerby told me it was good luck. I bought a scratch card with my mouth still full. I won $500. The pigeon was right.", "Apparently it's good luck. That evening I found $50 on the ground. It wasn't worth it, but it's $50."] }, fx: { money: 300, happy: 4 }, mood: 'happy' },
        ],
      },
      { label: { fr: 'Faire comme si de rien', en: 'Act like nothing happened' }, text: { fr: ["J'ai avalé. Par réflexe. Je n'en parlerai jamais à personne. Sauf à ce journal. Et à mon médecin, qui a ri pendant une minute avant de me prescrire un vermifuge.", "J'ai continué mon appel vidéo avec une fiente sur le front. Mon interlocuteur n'a rien osé dire. On a signé le contrat. Il pense que c'est un tatouage."], en: ["I swallowed. Reflex. I'll never tell anyone. Except this journal. And my doctor, who laughed for a full minute before prescribing a dewormer.", "I continued my video call with poop on my forehead. The other person didn't dare say anything. We closed the deal. He thinks it's a tattoo."] }, fx: { health: -4, discipline: 3 } },
      { label: { fr: 'Déclarer la guerre aux pigeons', en: 'Declare war on pigeons' }, text: { fr: ["J'ai juré vengeance. Je cours maintenant après tous les pigeons de la ville. Ils se sont organisés. Ils me chient dessus tous les jours. Je perds la guerre.", "J'ai acheté un pistolet à eau et j'ai patrouillé dans le parc. Les pigeons m'ont encerclé{|e}. J'ai fui. Une vieille dame les nourrissait. C'était elle, la cheffe."], en: ["I swore revenge. I now chase every pigeon in the city. They've organized. They poop on me daily. I'm losing the war.", "I bought a water gun and patrolled the park. The pigeons surrounded me. I fled. An old lady was feeding them. She was the boss."] }, fx: { happy: 2, stress: 4, karma: -2 } },
    ],
  },
  // ───────────────────────────── météo, sommeil ─────────────────────────────
  {
    id: 'dy_umbrella',
    icon: '☂️',
    cat: 'daily',
    rating: 1,
    scene: { place: 'park', mood: 'sad', prop: 'umbrella' },
    when: { age: [18, 95] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: [
        "Tu sors sans parapluie parce que l'appli météo dit « 0 % de pluie ». Il pleut. Fort. Les égouts débordent. Un canard passe à la nage devant toi sur le trottoir, puis {w:object}.",
        "Ton parapluie se retourne à la première rafale, puis s'envole et se plante dans le pare-brise d'une voiture de police. Les policiers te regardent en mangeant {w:food}. Il pleut toujours.",
        "Une voiture roule dans une flaque à 50 km/h juste à côté de toi. Tu es trempé{|e} de la tête aux pieds d'une eau brune qui dégage {w:smell}. Tu as un entretien dans dix minutes.",
        "Tu as mis des chaussures en daim et un pantalon blanc. Il se met à grêler. Puis à neiger. Puis le soleil revient pour se moquer de toi. Il est 9 h du matin, et le présentateur météo est {w:celeb}.",
      ],
      en: [
        "You go out without an umbrella because the weather app says '0% rain'. It's pouring. The sewers are overflowing. A duck swims past you on the sidewalk, then {w:object}.",
        "Your umbrella flips inside out at the first gust, then flies off and sticks into a police car's windshield. The cops look at you while eating {w:food}. It's still raining.",
        "A car drives through a puddle at 30 mph right next to you. You're soaked from head to toe in brown water that gives off {w:smell}. You have an interview in ten minutes.",
        "You wore suede shoes and white pants. It starts to hail. Then snow. Then the sun comes back to mock you. It's 9 a.m., and the weatherman is {w:celeb}.",
      ],
    },
    choices: [
      { label: { fr: 'Courir sous la pluie', en: 'Run through the rain' }, text: { fr: ["J'ai couru en zigzag sous les balcons. Ça n'a servi à rien. Je suis arrivé{|e} trempé{|e} jusqu'aux os, et mon slip faisait {w:sound} à chaque pas.", "J'ai sprinté sous l'averse. Une voiture m'a arrosé{|e} en passant, puis une deuxième, comme une haie d'honneur. Je suis arrivé{|e} propre, d'une certaine manière."], en: ["I zigzagged under balconies. Pointless. I arrived soaked to the bone, my underwear making {w:sound} with every step.", "I sprinted through the downpour. A car splashed me, then another, like a guard of honor. I arrived clean, in a way."] }, fx: { health: -2, athletic: 1, disease: 'cold' } },
      {
        label: { fr: 'Danser sous la pluie', en: 'Dance in the rain' },
        out: [
          { w: 1, text: { fr: ["J'ai décidé d'en profiter : j'ai dansé sous la pluie comme dans une comédie musicale. Les passants ont filmé. Un vieux monsieur m'a rejoint{|e}. C'était magique.", "J'ai chanté {w:song} sous l'averse en sautant dans les flaques. Je me suis senti{|e} libre pour la première fois depuis des années."], en: ["I decided to enjoy it: I danced in the rain like in a musical. Passersby filmed. An old man joined me. It was magical.", "I sang {w:song} in the downpour, jumping in puddles. I felt free for the first time in years."] }, fx: { happy: 8, health: -2, stress: -6 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai voulu danser sous la pluie. J'ai glissé sur une plaque d'égout et je me suis étalé{|e} de tout mon long dans une flaque. Je me suis pété {w:bodypart}. Putain de comédie musicale.", "J'ai fait un pas de danse, perdu l'équilibre et atterri dans une flaque qui faisait 40 cm de profondeur. Un enfant a ri. Sa mère aussi."], en: ["I tried to dance in the rain. I slipped on a manhole cover and sprawled face-first into a puddle. I busted my {w:bodypart}. Fucking musical.", "I did a dance step, lost my balance and landed in a puddle 16 inches deep. A kid laughed. So did his mom."] }, fx: { health: -5, happy: -4, disease: 'sprain' }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Acheter un parapluie à 15 €', en: 'Buy a $15 umbrella' }, text: { fr: ["J'ai acheté un parapluie à 15 € à un vendeur sorti de nulle part. Il s'est cassé au bout de 40 secondes. Le vendeur avait disparu. La pluie aussi.", "J'ai payé 15 € pour un parapluie. La pluie s'est arrêtée au moment exact où je l'ai ouvert. Je l'ai gardé ouvert quand même, par fierté, en plein soleil."], en: ["I bought a $15 umbrella from a vendor who appeared out of nowhere. It broke after 40 seconds. The vendor had vanished. So had the rain.", "I paid $15 for an umbrella. The rain stopped the exact moment I opened it. I kept it open anyway, out of pride, in full sunshine."] }, fx: { money: -15, happy: -1 } },
    ],
  },
  {
    id: 'dy_heatwave',
    icon: '🥵',
    cat: 'home',
    rating: 2,
    scene: { place: 'apartment', mood: 'sick', prop: 'fan' },
    when: { age: [18, 95] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Canicule. Il fait 38 °C dans ton appart sous les toits. Tu dors nu{|e}, sans drap, avec un ventilateur qui brasse de l'air chaud et une serviette mouillée sur le visage. Tu transpires dans tes rêves. Dans tes rêves, il y a {w:drink}.",
        "Quatrième jour de canicule. Tes cuisses collent au canapé en cuir. Quand tu te lèves, ça fait {w:sound}. Ta sueur a laissé ta silhouette sur le canapé, comme le Suaire de Turin.",
        "Il fait tellement chaud que ton beurre est liquide, ton chocolat est une soupe et ton chat s'est allongé dans l'évier. Tu envisages de dormir dans le frigo, entre les yaourts et {w:food}.",
        "Canicule dans le bus. Pas de clim. Tu es collé{|e} à un inconnu, et vos sueurs se mélangent. Il dégage {w:smell}. Tu envies les gens qui marchent dehors, même {w:weather}.",
      ],
      en: [
        "Heatwave. It's 100°F in your attic apartment. You sleep naked, no sheet, with a fan pushing hot air around and a wet towel on your face. You sweat in your dreams. In your dreams, there's {w:drink}.",
        "Fourth day of the heatwave. Your thighs stick to the leather couch. When you get up, it makes {w:sound}. Your sweat left your silhouette on the couch, like the Shroud of Turin.",
        "It's so hot your butter is liquid, your chocolate is soup and your cat is lying in the sink. You're considering sleeping in the fridge, between the yogurts and {w:food}.",
        "Heatwave on the bus. No AC. You're glued to a stranger, and your sweat is mixing. He gives off {w:smell}. You envy the people walking outside, even {w:weather}.",
      ],
    },
    choices: [
      { label: { fr: 'Dormir dans la baignoire', en: 'Sleep in the bathtub' }, text: { fr: ["J'ai rempli la baignoire d'eau froide et j'y ai dormi. Je me suis réveillé{|e} fripé{|e} comme un vieux raisin, avec un canard en plastique collé sur la fesse.", "Nuit dans la baignoire. Le robinet a gouté sur mon front toute la nuit. J'ai rêvé que je me noyais. J'ai bien dormi, finalement."], en: ["I filled the tub with cold water and slept in it. I woke up wrinkled like an old raisin, with a rubber duck stuck to my butt.", "Night in the bathtub. The faucet dripped on my forehead all night. I dreamed I was drowning. Slept well, actually."] }, fx: { health: 1, stress: -2, happy: 1 } },
      {
        label: { fr: 'Le supermarché climatisé', en: 'The air-conditioned supermarket' },
        out: [
          { w: 2, text: { fr: ["J'ai passé l'après-midi au rayon surgelés du supermarché, la tête dans le bac à glaces. Un vigile m'a demandé si j'allais bien. J'ai dit « jamais été aussi bien ».", "J'ai erré trois heures dans le supermarché climatisé. J'ai acheté 47 € de trucs inutiles pour justifier ma présence. Ça valait le coup."], en: ["I spent the afternoon in the frozen food aisle, head in the ice cream freezer. A guard asked if I was okay. I said 'never better'.", "I wandered the air-conditioned supermarket for three hours. Bought $47 of useless stuff to justify my presence. Worth it."] }, fx: { happy: 4, money: -45 } },
          { w: 1, text: { fr: ["Je me suis endormi{|e} dans le bac à surgelés. On m'a retrouvé{|e} à la fermeture, en hypothermie, collé{|e} à une boîte de poisson pané. Les pompiers ont dû me décongeler au sèche-cheveux.", "J'ai essayé de m'asseoir dans le congélateur coffre. Je suis resté{|e} coincé{|e}. Une famille entière m'a regardé{|e} en choisissant ses glaces. Le petit m'a donné un bâtonnet."], en: ["I fell asleep in the freezer. They found me at closing time, hypothermic, stuck to a box of fish sticks. The firefighters thawed me with a hairdryer.", "I tried sitting in the chest freezer. I got stuck. An entire family watched me while picking their ice cream. The kid gave me a popsicle."] }, fx: { health: -6, happy: -3, disease: 'cold' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Ne plus bouger du tout', en: 'Stop moving entirely' }, text: { fr: ["Je suis resté{|e} allongé{|e} au sol, immobile, pendant quatre jours, comme un lézard. J'ai perdu deux kilos de sueur et toute dignité. Le ventilateur et moi, on est mariés maintenant.", "J'ai cessé toute activité humaine. J'ai mangé des glaçons, transpiré et regardé le plafond. C'est la meilleure méditation que j'aie jamais faite."], en: ["I lay on the floor, motionless, for four days, like a lizard. I lost four pounds of sweat and all dignity. The fan and I are married now.", "I ceased all human activity. Ate ice cubes, sweated and stared at the ceiling. Best meditation I've ever done."] }, fx: { weight: -0.02, happy: -2, stress: -3 } },
    ],
  },
  {
    id: 'dy_insomnia_cringe',
    icon: '🌙',
    cat: 'daily',
    rating: 1,
    scene: { place: 'home', mood: 'sleepy', prop: 'bed' },
    when: { age: [18, 95] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: [
        "3 h 14 du matin. Ton cerveau décide de te rappeler la fois où tu as dit « toi aussi » au serveur qui te souhaitait bon appétit. C'était il y a douze ans. Tu revis chaque seconde. En fond sonore, ton cerveau passe {w:song}.",
        "Insomnie. Tu as compté 4 000 moutons. Le 4 001e t'a regardé{|e} et t'a dit « {w:insult} ». Tu es maintenant parfaitement réveillé{|e}.",
        "Tu n'arrives pas à dormir. À 2 h, tu te demandes si les poissons ont soif. À 3 h, tu es persuadé{|e} {w:conspiracy}. À 4 h, ton réveil sonne dans deux heures.",
        "Nuit blanche. Tu repenses à ce que tu aurais dû répondre lors d'une dispute en 2014. Tu as trouvé la réplique parfaite. Elle arrive avec dix ans de retard. Tu la dis à voix haute, dans le noir. Quelque part, {w:animal} t'entend.",
      ],
      en: [
        "3:14 a.m. Your brain decides to remind you of the time you said 'you too' to the waiter who told you to enjoy your meal. It was twelve years ago. You relive every second. Your brain adds a soundtrack: {w:song}.",
        "Insomnia. You've counted 4,000 sheep. Sheep number 4,001 looked at you and said '{w:insult}'. You are now wide awake.",
        "You can't sleep. At 2 a.m., you wonder if fish get thirsty. At 3 a.m., you're convinced {w:conspiracy}. At 4 a.m., your alarm goes off in two hours.",
        "Sleepless night. You replay what you should have said during an argument in 2014. You've found the perfect comeback. It arrives ten years late. You say it out loud, in the dark. Somewhere, {w:animal} hears you.",
      ],
    },
    choices: [
      { label: { fr: 'Scroller jusqu\'à l\'aube', en: 'Doomscroll until dawn' }, text: { fr: ["J'ai scrollé jusqu'à 6 h. J'ai regardé 300 vidéos de chiens, une conférence sur les trous noirs et un tuto pour déboucher un évier. Je ne sais plus qui je suis.", "J'ai fait défiler mon téléphone jusqu'à l'aube et commandé {w:object} à 4 h du matin. Il arrive jeudi. Je ne sais pas pourquoi je l'ai commandé."], en: ["I scrolled until 6 a.m. Watched 300 dog videos, a lecture on black holes and a tutorial on unclogging a sink. I no longer know who I am.", "I scrolled until dawn and ordered {w:object} at 4 a.m. It arrives Thursday. I don't know why I ordered it."] }, fx: { health: -3, happy: -2, stress: 3 } },
      {
        label: { fr: 'Tisane et méditation', en: 'Herbal tea and meditation' },
        out: [
          { w: 1, text: { fr: ["Tisane, appli de méditation, voix douce qui murmure « respire ». Je me suis endormi{|e} en quatre minutes. Je me suis réveillé{|e} à midi. J'ai raté le travail. Mais quel sommeil.", "La méditation a marché. J'ai rêvé que je volais au-dessus de mon boss en lui jetant des œufs. Réveil parfait."], en: ["Herbal tea, meditation app, soft voice whispering 'breathe'. I fell asleep in four minutes. Woke up at noon. Missed work. But what a sleep.", "The meditation worked. I dreamed I was flying above my boss throwing eggs at him. Perfect wake-up."] }, fx: { health: 3, stress: -6, happy: 3 }, mood: 'happy' },
          { w: 1, text: { fr: ["La voix de l'appli de méditation m'a tellement agacé{|e} que j'ai lancé le téléphone contre le mur. Écran cassé. Réveil à 6 h. Rien n'a changé, sauf l'écran.", "J'ai bu trois tisanes. J'ai passé la nuit à faire pipi. Le sommeil ne m'a pas trouvé{|e}, mais les toilettes oui, toutes les vingt minutes."], en: ["The meditation app voice annoyed me so much I threw my phone at the wall. Cracked screen. Alarm at 6. Nothing changed, except the screen.", "I drank three cups of herbal tea. Spent the night peeing. Sleep didn't find me, but the toilet did, every twenty minutes."] }, fx: { health: -2, stress: 4, money: -50 } },
        ],
      },
      { label: { fr: 'Envoyer un SMS à 3 h', en: 'Send a 3 a.m. text' }, rating: 1, text: { fr: ["J'ai écrit à mon ex à 3 h 30 : « Tu dors ? » Puis : « Moi non plus. » Puis : « Tu te souviens de la fois où… » J'ai éteint le téléphone. Il a répondu. Je ne lirai jamais.", "J'ai envoyé ma réplique de 2014 à la personne concernée, à 3 h du mat'. Elle a répondu « ??? qui c'est ». On a reparlé. On est amis. La nuit porte conseil, mais aussi la honte."], en: ["I texted my ex at 3:30: 'You up?' Then: 'Me neither.' Then: 'Remember the time…' I turned off my phone. They replied. I'll never read it.", "I sent my 2014 comeback to the person in question, at 3 a.m. They replied '??? who is this'. We reconnected. We're friends. The night brings wisdom, but also shame."] }, fx: { happy: -1, stress: 3, karma: 1 } },
    ],
  },
  {
    id: 'dy_alarm_fail',
    icon: '⏰',
    cat: 'adulting',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'clock' },
    when: { age: [18, 70], job: true },
    weight: 8,
    cooldown: 4,
    text: {
      fr: [
        "Tu ouvres un œil. La lumière est bizarre. Trop forte. Tu regardes l'heure : 10 h 47. Ton réveil n'a pas sonné. Tu avais une réunion à 9 h. Avec le grand patron. Ton téléphone affiche 14 appels et un SMS : « {w:exclaim} »",
        "Ton téléphone s'est éteint dans la nuit. Plus de batterie, plus de réveil. Tu te réveilles grâce à {w:animal} qui tape au carreau. Il est 11 h. Merci quand même.",
        "Tu as appuyé sur « snooze » 14 fois dans ton sommeil. Tu ne t'en souviens pas. Ton téléphone, si. Il est 9 h 52. Tu commences à 9 h. Ton excuse du jour sera : {w:excuse}.",
        "Tu te réveilles en sursaut, persuadé{|e} d'être en retard. Tu t'habilles en 90 secondes, cours au boulot sous la pluie… C'est dimanche. Il est 6 h. Il ne te reste plus qu'à acheter {w:food} et rentrer.",
      ],
      en: [
        "You open one eye. The light is weird. Too bright. You check the time: 10:47. Your alarm didn't go off. You had a 9 a.m. meeting. With the big boss. Your phone shows 14 missed calls and a text: '{w:exclaim}'",
        "Your phone died overnight. No battery, no alarm. You wake up because {w:animal} is tapping on the window. It's 11. Thanks anyway.",
        "You hit 'snooze' 14 times in your sleep. You don't remember. Your phone does. It's 9:52. You start at 9. Today's excuse will be: {w:excuse}.",
        "You jolt awake, sure you're late. You dress in 90 seconds, run to work in the rain… It's Sunday. It's 6 a.m. All that's left is to buy {w:food} and go home.",
      ],
    },
    choices: [
      {
        label: { fr: 'Inventer une excuse', en: 'Make up an excuse' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai dit au boss que j'étais en retard {w:excuse}. Il a hoché la tête, compréhensif. Je ne sais pas ce que j'ai fait pour mériter ce boss.", "J'ai inventé une histoire de fuite d'eau, de voisin coincé et de chat héroïque. Le boss a été tellement ému qu'il m'a donné ma journée."], en: ["I told the boss I was late {w:excuse}. He nodded, understanding. I don't know what I did to deserve this boss.", "I invented a story about a water leak, a trapped neighbor and a heroic cat. The boss was so moved he gave me the day off."] }, fx: { happy: 5, perf: 2 } },
          { w: 1, text: { fr: ["J'ai dit que j'étais en retard {w:excuse}. Le boss a dit « c'est la troisième fois ce mois-ci ». Avertissement écrit. Je l'ai encadré à côté des autres.", "Mon excuse aurait marché si je n'avais pas eu la marque de l'oreiller sur la joue et un chausson au pied gauche."], en: ["I said I was late {w:excuse}. The boss said 'third time this month'. Written warning. I framed it next to the others.", "My excuse would've worked if I hadn't had pillow marks on my cheek and a slipper on my left foot."] }, fx: { perf: -6, stress: 5 } },
        ],
      },
      { label: { fr: 'La vérité', en: 'Tell the truth' }, text: { fr: ["J'ai avoué que je ne m'étais pas réveillé{|e}. Le boss a ri : « Moi aussi, je viens d'arriver. » On a fait la réunion à 14 h avec des croissants.", "J'ai dit la vérité. Mon boss a été surpris par mon honnêteté. Il m'a demandé de faire un exposé sur la sincérité en entreprise. J'ai dormi pendant l'exposé de quelqu'un d'autre."], en: ["I admitted I didn't wake up. The boss laughed: 'Me neither, I just got in.' We held the meeting at 2 p.m. with croissants.", "I told the truth. My boss was surprised by my honesty. He asked me to give a talk on sincerity at work. I fell asleep during someone else's talk."] }, fx: { karma: 3, perf: -2, happy: 2 } },
      { label: { fr: 'Arriver en courant', en: 'Sprint to work' }, text: { fr: ["J'ai couru, sauté dans le bus, sprinté dans les couloirs, déboulé en réunion en sueur, la chemise à l'envers. Tout le monde m'a regardé{|e}. La réunion avait été annulée.", "Je suis arrivé{|e} hors d'haleine avec du dentifrice au coin de la bouche. Personne n'avait remarqué mon absence. Je ne sais pas si c'est rassurant."], en: ["I ran, jumped on the bus, sprinted down the halls, burst into the meeting sweaty with my shirt inside out. Everyone stared. The meeting had been cancelled.", "I arrived out of breath with toothpaste in the corner of my mouth. Nobody had noticed I was gone. Not sure if that's reassuring."] }, fx: { athletic: 2, stress: 4 } },
    ],
  },
  // ───────────────────────────── en ligne & malentendus ─────────────────────────────
  {
    id: 'dy_review_bomb',
    icon: '⭐',
    cat: 'daily',
    rating: 1,
    scene: { place: 'home', mood: 'angry', prop: 'phone' },
    when: { age: [18, 90], noFlag: 'dy_reviewed' },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Le resto d'hier soir t'a servi {w:food} tiède avec 1 h 15 d'attente et un serveur qui t'a appelé{|e} « mon grand ». Ton pouce plane au-dessus du bouton « 1 étoile ».",
        "Ton plombier est venu, a regardé la fuite, a dit « c'est pas normal » et t'a facturé 180 €. La fuite est toujours là. Il a oublié chez toi {w:object}. Le site d'avis te tend les bras.",
        "Le salon de massage t'a promis « relaxation profonde ». La masseuse a passé l'heure au téléphone avec sa sœur, une main posée sur ton dos, immobile, avec {w:song} en fond.",
        "L'hôtel « 4 étoiles » avait des poils dans les draps, une vue sur un mur et un minibar contenant uniquement {w:drink}. Tu ouvres le site d'avis avec un sourire mauvais.",
      ],
      en: [
        "Last night's restaurant served you lukewarm {w:food} after a 75-minute wait and a waiter who called you 'buddy'. Your thumb hovers over the '1 star' button.",
        "Your plumber came, looked at the leak, said 'that's not normal' and charged you $180. The leak is still there. He left {w:object} at your place. The review site beckons.",
        "The massage parlor promised 'deep relaxation'. The masseuse spent the hour on the phone with her sister, one hand resting motionless on your back, with {w:song} playing.",
        "The '4-star' hotel had hairs in the sheets, a view of a wall and a minibar containing only {w:drink}. You open the review site with an evil grin.",
      ],
    },
    choices: [
      { label: { fr: 'Avis assassin', en: 'Scathing review' }, text: { fr: ["J'ai écrit un avis d'une page, avec photos, citations et une note finale : « Même un pigeon refuserait d'y manger. » 412 personnes l'ont trouvé utile. Le patron a vu mon nom.", "J'ai rédigé un chef-d'œuvre de méchanceté. Une étoile. Le patron m'a répondu publiquement : « Nous nous souviendrons de vous. » Ça sonne comme une menace."], en: ["I wrote a full page with photos, quotes and a final verdict: 'Even a pigeon would refuse to eat here.' 412 people found it helpful. The owner saw my name.", "I wrote a masterpiece of spite. One star. The owner replied publicly: 'We will remember you.' Sounds like a threat."] }, fx: { happy: 6, karma: -2, flag: 'dy_reviewed', schedule: { key: 'dy_review_revenge', years: 1 } } },
      { label: { fr: 'Avis poli et constructif', en: 'Polite, constructive review' }, text: { fr: ["J'ai écrit un avis nuancé : « Bon potentiel, quelques points à améliorer. » Le patron m'a remercié{|e} et m'a offert un repas. Ce repas était encore pire. Je n'ai rien dit.", "Avis constructif, trois étoiles. Personne ne l'a lu. C'est le destin des gens raisonnables."], en: ["I wrote a balanced review: 'Good potential, some room for improvement.' The owner thanked me and offered a free meal. The meal was even worse. I said nothing.", "Constructive review, three stars. Nobody read it. Such is the fate of reasonable people."] }, fx: { karma: 3, happy: 1 } },
      { label: { fr: 'Cinq étoiles ironiques', en: 'Ironic five stars' }, text: { fr: ["J'ai mis cinq étoiles avec un texte ultra-sarcastique. Personne n'a compris l'ironie. Le resto a affiché mon avis en vitrine. Je suis l'égérie de ce que je déteste.", "Cinq étoiles : « Une expérience inoubliable, j'en rêve encore la nuit, en hurlant. » Le patron l'a imprimé et encadré."], en: ["I gave five stars with an ultra-sarcastic review. Nobody got the irony. The restaurant put my review in the window. I'm the face of what I hate.", "Five stars: 'An unforgettable experience, I still dream about it at night, screaming.' The owner printed and framed it."] }, fx: { happy: 4 } },
    ],
  },
  {
    id: 'dy_review_revenge',
    icon: '🔪',
    cat: 'daily',
    rating: 2,
    chainOnly: true,
    vars: { amount: [100, 600] },
    scene: { place: 'home', mood: 'shock', prop: 'phone' },
    when: { age: [18, 95], flag: 'dy_reviewed' },
    text: {
      fr: [
        "Le patron que tu as démoli en ligne t'a retrouvé{|e}. Il t'attend devant chez toi avec un hachoir à viande et un bouquet de fleurs. Tu ne sais pas lequel est pour toi. Il crie « {w:threat} », puis « je vous aime ».",
        "Depuis ton avis assassin, quelqu'un dépose chaque matin devant ta porte {w:food}, en version glacée, avec un mot : « Alors, c'est meilleur ? »",
        "Le prestataire que tu as descendu en ligne a écrit un avis… sur toi. Sur un site d'avis de voisins. « Client exécrable. Dégage {w:smell}. Une étoile. » Il a 200 likes.",
        "Le patron du resto a imprimé ta photo de profil et l'a affichée à l'entrée avec la mention « INTERDIT ». Ta photo est aussi sur le mur du kebab d'à côté. Son cousin. Et dans le bureau de tabac, avec la légende « {w:insult} ».",
      ],
      en: [
        "The owner you trashed online found you. He's waiting outside your home with a meat cleaver and a bouquet of flowers. You don't know which one is for you. He shouts '{w:threat}', then 'I love you'.",
        "Since your scathing review, every morning someone leaves {w:food}, served ice-cold, at your door with a note: 'So, is it better now?'",
        "The business you trashed wrote a review… of you. On a neighborhood site. 'Awful customer. Gives off {w:smell}. One star.' It has 200 likes.",
        "The restaurant owner printed your profile picture and posted it at the entrance with 'BANNED'. Your photo is also on the wall of the kebab shop next door. His cousin's. And at the corner store, captioned '{w:insult}'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Affronter le patron', en: 'Face the owner' },
        out: [
          { w: 2, text: { fr: ["Il m'a tendu les fleurs : « Votre avis m'a fait changer de cuisinier. Merci. » Le hachoir, c'était pour couper les tiges. On a dîné ensemble. C'était délicieux.", "On s'est expliqués. Il a pleuré, j'ai pleuré, on a bu un pastis. J'ai modifié mon avis à trois étoiles. Il m'a fait un « menu du pardon »."], en: ["He handed me the flowers: 'Your review made me change chefs. Thank you.' The cleaver was for trimming the stems. We had dinner together. It was delicious.", "We talked it out. He cried, I cried, we had a pastis. I changed my review to three stars. He made me a 'forgiveness menu'."] }, fx: { happy: 6, karma: 4, unflag: 'dy_reviewed' }, mood: 'happy' },
          { w: 1, text: { fr: ["Le hachoir était pour moi. Il m'a couru après dans la rue en hurlant ma note. Dans la bataille, {w:bodypart} y a laissé un morceau. Il a été arrêté, très fier.", "Il a brandi le hachoir. J'ai levé la main pour me protéger. J'ai maintenant neuf doigts et une histoire incroyable à raconter en soirée."], en: ["The cleaver was for me. He chased me down the street yelling my rating. In the fight, my {w:bodypart} lost a chunk. He was arrested, very proud.", "He swung the cleaver. I raised my hand to protect myself. I now have nine fingers and an incredible story for parties."] }, fx: { health: -15, happy: -8, disease: 'missing_finger', money: '-amount', unflag: 'dy_reviewed', visual: 'gore' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Supprimer mon avis', en: 'Delete my review' }, text: { fr: ["J'ai supprimé l'avis et envoyé des excuses. Les plats froids ont cessé d'arriver. Je les regrette un peu. C'était devenu mon petit-déj.", "Avis supprimé. Ma photo a été retirée de la vitrine. Elle est restée chez le cousin, au kebab. Je n'y mangerai plus jamais. Il fait les meilleures frites de la ville."], en: ["I deleted the review and sent an apology. The cold dishes stopped coming. I kind of miss them. They'd become my breakfast.", "Review deleted. My photo came down from the window. It stayed at the cousin's kebab shop. I'll never eat there again. He makes the best fries in town."] }, fx: { happy: -2, stress: -4, unflag: 'dy_reviewed' } },
    ],
  },
  {
    id: 'dy_influencer_street',
    icon: '🤳',
    cat: 'daily',
    rating: 2,
    scene: { place: 'park', mood: 'angry', prop: 'phone' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Une influenceuse bloque tout le trottoir pour une séance photo devant une porte rose. Elle refait la même pose depuis 20 minutes. Son copain-photographe est allongé par terre dans {w:gross}.",
        "Au resto, la table d'à côté photographie chaque plat pendant dix minutes avant de manger. Ils ont fait monter le plat sur une chaise pour « la lumière ». La chaise est sur ton pied. Le plat, c'est {w:food}.",
        "Un youtubeur te met une caméra sous le nez : « On fait un prank ! » Il te verse {w:drink} sur la tête. Il attend ta réaction. Ses 2 millions d'abonnés aussi.",
        "Un influenceur fitness fait un live dans le parc, torse nu, en criant « LET'S GOOO ». Il te demande de « faire un coucou à la commu ». Il dégage {w:smell}.",
      ],
      en: [
        "An influencer is blocking the whole sidewalk for a photo shoot in front of a pink door. She's been doing the same pose for 20 minutes. Her boyfriend-photographer is lying on the ground in {w:gross}.",
        "At a restaurant, the next table photographs every dish for ten minutes before eating. They put a plate on a chair 'for the lighting'. The chair is on your foot. The dish is {w:food}.",
        "A YouTuber shoves a camera in your face: 'It's a prank!' He pours {w:drink} on your head. He waits for your reaction. So do his 2 million subscribers.",
        "A fitness influencer is livestreaming in the park, shirtless, yelling 'LET'S GOOO'. He asks you to 'say hi to the community'. He gives off {w:smell}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Photobomber', en: 'Photobomb' },
        out: [
          { w: 2, text: { fr: ["Je me suis glissé{|e} dans le cadre en faisant une grimace monstrueuse, la langue sortie, les yeux qui louchent. La photo est devenue virale. Elle m'a tagué{|e}. J'ai 10 000 abonnés.", "J'ai fait un doigt d'honneur derrière elle avec un grand sourire. Elle ne l'a vu qu'après avoir posté. Les commentaires ne parlent que de moi. Je suis la star de son post."], en: ["I slipped into the frame making a monstrous face, tongue out, cross-eyed. The photo went viral. She tagged me. I have 10,000 followers.", "I flipped the bird behind her with a big smile. She only noticed after posting. The comments are all about me. I'm the star of her post."] }, fx: { happy: 6, followers: 10000, fame: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["Son copain s'est relevé et m'a poursuivi{|e} avec son trépied. Il m'a rattrapé{|e}. Il m'a frappé{|e} avec. Il a filmé, aussi. 2 millions de vues : « Un hater se fait détruire ».", "J'ai photobombé. Elle a appelé ses 400 000 abonnés à me « retrouver ». Ils m'ont retrouvé{|e}. Je reçois des pizzas que je n'ai pas commandées tous les soirs."], en: ["Her boyfriend got up and chased me with his tripod. He caught me. He hit me with it. He also filmed it. 2 million views: 'Hater gets destroyed'.", "I photobombed. She asked her 400,000 followers to 'find' me. They found me. I get pizzas I didn't order every night."] }, fx: { health: -6, happy: -6, stress: 6 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Le pousser dans la fontaine', en: 'Push him into the fountain' },
        out: [
          { w: 1, text: { fr: ["J'ai poussé le youtubeur dans la fontaine, en direct, devant ses 2 millions d'abonnés. Ses abonnés ont adoré. Ils se sont désabonnés de lui et abonnés à moi.", "Plouf. L'influenceur a coulé avec son téléphone. Le live s'est terminé sur une image floue de canards. C'est son meilleur contenu."], en: ["I pushed the YouTuber into the fountain, live, in front of his 2 million subscribers. They loved it. They unfollowed him and followed me.", "Splash. The influencer sank with his phone. The livestream ended on a blurry shot of ducks. Best content he's ever made."] }, fx: { happy: 8, followers: 20000, karma: -3 }, mood: 'proud' },
          { w: 1, text: { fr: ["Je l'ai poussé. Il a porté plainte en direct, en pleurant dans la fontaine. La police est venue. On m'a pris en photo. Lui aussi. Il a fait plus de vues que moi.", "Il est tombé dans la fontaine et s'est ouvert l'arcade. Il y avait du sang dans l'eau, des canards affolés et 80 000 personnes en live. Plainte pour coups et blessures."], en: ["I pushed him. He pressed charges live, crying in the fountain. The police came. They took my photo. He took his own. He got more views than me.", "He fell into the fountain and split his eyebrow. Blood in the water, panicked ducks and 80,000 people on the livestream. Assault charges."] }, fx: { arrest: 'vandal', happy: -4, heat: 8, visual: 'police' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Passer mon chemin', en: 'Walk on by' }, text: { fr: ["J'ai fait le grand détour par la route, entre les voitures. Une trottinette m'a frôlé{|e}. Les influenceurs vont finir par me tuer, indirectement.", "J'ai traversé leur shooting sans m'arrêter, en mangeant un sandwich. Je suis dans le fond de 14 de leurs photos. Je suis partout, comme un fantôme gourmand."], en: ["I took the long way around through the street, between the cars. A scooter grazed me. Influencers will end up killing me, indirectly.", "I walked straight through their shoot without stopping, eating a sandwich. I'm in the background of 14 of their photos. I'm everywhere, like a hungry ghost."] }, fx: { stress: 2 } },
    ],
  },
  {
    id: 'dy_lowballer',
    icon: '🏷️',
    cat: 'adulting',
    rating: 1,
    vars: { amount: [40, 300] },
    scene: { place: 'home', mood: 'angry', prop: 'phone' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Tu vends {w:object} sur un site de petites annonces à {$amount}. Premier message : « Bonjour, c'est toujours dispo ? » Tu dis oui. Il ne répond plus jamais.",
        "Annonce pour ton canapé. Un acheteur te propose 5 € « et je viens le chercher dans trois semaines, peut-être ». Un autre te demande si tu peux le livrer {w:far_place}.",
        "Quelqu'un veut acheter {w:object} mais te demande d'abord des photos sous tous les angles, une vidéo, le ticket de caisse et une photo de toi « pour la confiance ».",
        "Un acheteur arrive pour ton vélo, l'essaie, fait trois fois le tour du pâté de maisons, revient et dit : « Je vous en donne la moitié, c'est mon dernier prix. » Il est encore dessus. Il propose de compléter avec {w:object}.",
      ],
      en: [
        "You're selling {w:object} on a classifieds site for {$amount}. First message: 'Hi, is this still available?' You say yes. He never replies again.",
        "Ad for your couch. One buyer offers $5 'and I'll pick it up in three weeks, maybe'. Another asks if you can deliver it {w:far_place}.",
        "Someone wants to buy {w:object} but first asks for photos from every angle, a video, the receipt and a picture of you 'for trust'.",
        "A buyer comes for your bike, tests it, rides around the block three times, comes back and says: 'I'll give you half, final offer.' He's still sitting on it. He offers to throw in {w:object}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tenir bon sur le prix', en: 'Stand firm on price' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: ["J'ai tenu bon. Il a râlé, soupiré, menacé de partir. Puis il a payé {$amount} plein pot. La patience est une vertu, et elle rapporte.", "Pas un centime de moins. Un autre acheteur est arrivé, a payé {$amount} sans discuter et m'a même remercié{|e}. L'humanité n'est pas perdue."], en: ["I held firm. He grumbled, sighed, threatened to leave. Then paid full price, {$amount}. Patience is a virtue, and it pays.", "Not a penny less. Another buyer showed up, paid {$amount} without haggling and even thanked me. Humanity isn't lost."] }, fx: { money: 'amount', happy: 5 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai refusé de baisser. Personne n'a acheté. Trois mois plus tard, j'ai donné l'objet gratuitement. La personne m'a demandé si je pouvais le livrer.", "J'ai tenu bon pendant six mois. L'annonce a eu 4 000 vues et zéro acheteur. L'objet est toujours dans mon salon. Il me juge."], en: ["I refused to go lower. Nobody bought it. Three months later, I gave the thing away for free. The person asked if I could deliver it.", "I held firm for six months. The ad got 4,000 views and zero buyers. The item is still in my living room. It judges me."] }, fx: { stress: 4, happy: -3 } },
        ],
      },
      { label: { fr: 'Brader', en: 'Sell it cheap' }, text: { fr: ["J'ai cédé pour 10 €. L'acheteur l'a revendu le lendemain 3 fois plus cher, avec MES photos. Je lui ai mis une mauvaise note. Il s'en fiche.", "J'ai bradé. Au moins, l'objet est parti. Mon salon respire. Mon compte en banque, lui, pleure doucement."], en: ["I caved for $10. The buyer resold it the next day for 3 times as much, using MY photos. I gave him a bad rating. He doesn't care.", "I sold it cheap. At least it's gone. My living room can breathe. My bank account is quietly weeping."] }, fx: { money: 10, happy: -1 } },
      { label: { fr: 'Troller l\'acheteur', en: 'Troll the buyer' }, text: { fr: ["Je lui ai répondu que le prix avait augmenté parce que {w:animal} avait mangé la facture. Il a négocié quand même. On s'échange des mèmes depuis. L'objet n'est pas vendu.", "Je lui ai proposé un échange contre {w:food}. Il a accepté. Je ne sais pas pourquoi. J'ai mangé, il est content. Le troc est l'avenir."], en: ["I told him the price had gone up because {w:animal} ate the receipt. He haggled anyway. We've been swapping memes ever since. The item isn't sold.", "I offered to trade it for {w:food}. He accepted. I don't know why. I ate, he's happy. Bartering is the future."] }, fx: { happy: 4 } },
    ],
  },
  {
    id: 'dy_wrong_number',
    icon: '📞',
    cat: 'luck',
    rating: 0,
    scene: { place: 'home', mood: 'neutral', prop: 'phone' },
    when: { age: [18, 95] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Un numéro inconnu t'écrit : « Mamie, c'est Lucas ! On arrive dimanche pour le gratin, t'oublies pas le fromage 😘 ». Tu n'es la mamie de personne. Le message suivant contient une photo prise {w:at_place}.",
        "Quelqu'un t'envoie par erreur des messages destinés à son ex. Très longs. Très sincères. Il en est au chapitre 4 de ses regrets, avec des poèmes et une chanson : {w:song}.",
        "Un SMS d'un inconnu : « Le colis est prêt. Même endroit, 22 h. Viens seul. » Suivi immédiatement de : « Pardon, mauvais numéro. C'était pour un gâteau d'anniversaire. » Puis : « Enfin, et pour {w:object}. »",
        "Un inconnu t'appelle et te parle pendant trois minutes de sa tondeuse avant de réaliser que tu n'es pas Gérard. Il a l'air tellement seul. Tu n'as pas le cœur de raccrocher. Il enchaîne sur {w:hobby}.",
      ],
      en: [
        "An unknown number texts you: 'Grandma, it's Lucas! We're coming Sunday for the casserole, don't forget the cheese 😘'. You're nobody's grandma. The next message is a photo taken {w:at_place}.",
        "Someone keeps mistakenly sending you messages meant for their ex. Very long. Very sincere. They're on chapter 4 of their regrets, with poems and a song: {w:song}.",
        "A text from a stranger: 'The package is ready. Same place, 10 p.m. Come alone.' Immediately followed by: 'Sorry, wrong number. It was about a birthday cake.' Then: 'Well, and for {w:object}.'",
        "A stranger calls and talks to you about his lawnmower for three minutes before realizing you're not Gerald. He sounds so lonely. You don't have the heart to hang up. He moves on to {w:hobby}.",
      ],
    },
    choices: [
      { label: { fr: 'Jouer le jeu', en: 'Play along' }, text: { fr: ["J'ai joué le jeu. J'ai répondu, puis répondu encore, puis on a échangé des photos de nos chats. On a fini par s'inviter. Je vais au mariage de sa fille.", "J'ai fait semblant d'être la bonne personne. Puis j'ai avoué. Il a ri. On a parlé deux heures. J'ai été invité{|e} à une fête de famille d'inconnus."], en: ["I played along. Replied, replied again, then we swapped cat photos. We ended up inviting each other over. I'm going to his daughter's wedding.", "I pretended to be the right person. Then I confessed. He laughed. We talked for two hours. I got invited to a family party of total strangers."] }, fx: { happy: 5, karma: 2, chain: 'dy_wrong_wedding' } },
      { label: { fr: 'Signaler l\'erreur', en: 'Point out the mistake' }, text: { fr: ["J'ai répondu « mauvais numéro, désolé{|e} ». Il m'a remercié{|e} avec un émoji fleur. C'était un moment de douceur dans un monde de brutes.", "J'ai signalé l'erreur. Il a insisté pour m'envoyer quand même une part de gâteau par coursier. Elle est arrivée. Elle était délicieuse."], en: ["I replied 'wrong number, sorry'. He thanked me with a flower emoji. A moment of tenderness in a brutal world.", "I pointed out the mistake. He insisted on sending me a slice of cake by courier anyway. It arrived. It was delicious."] }, fx: { karma: 3, happy: 2 } },
      { label: { fr: 'Bloquer', en: 'Block' }, text: { fr: ["J'ai bloqué. Je ne saurai jamais ce qu'il y avait dans le colis, ni s'il y avait du fromage pour le gratin. Ça me hante.", "Bloqué sans réfléchir. Une partie de moi se demande ce que Gérard pense de la tondeuse. Je n'aurai jamais la réponse."], en: ["I blocked them. I'll never know what was in the package, or if there was cheese for the casserole. It haunts me.", "Blocked without thinking. Part of me wonders what Gerald thinks of the lawnmower. I'll never know."] }, fx: { stress: -1 } },
    ],
  },
  {
    id: 'dy_wrong_wedding',
    icon: '💒',
    cat: 'luck',
    rating: 0,
    chainOnly: true,
    vars: { amount: [50, 200] },
    scene: { place: 'party', mood: 'party', prop: 'cake', fx: 'confetti' },
    when: { age: [18, 99] },
    text: {
      fr: [
        "Tu te retrouves à la fête de famille de l'inconnu du mauvais numéro. Tout le monde croit que tu es un cousin éloigné. Mamie te pince la joue et te demande quand tu te maries. Le tonton te ressert {w:drink}.",
        "Mariage d'une parfaite inconnue, rencontrée grâce à un SMS envoyé au mauvais numéro. On t'a placé{|e} à la table d'honneur, entre l'oncle bourré et le témoin, qui t'appelle « {w:nickname} ».",
        "Te voilà à un repas de famille chez des gens que tu ne connais pas. Ils t'ont gardé une part de gratin. Le grand-père te raconte la guerre. La tienne, il pense. Il t'offre {w:gift}.",
        "Tu arrives à la fête des inconnus avec {w:gift} en cadeau. Ils sont émus aux larmes. Le DJ lance {w:song}. Tu es déjà sur la piste.",
      ],
      en: [
        "You end up at the wrong-number stranger's family party. Everyone thinks you're a distant cousin. Grandma pinches your cheek and asks when you're getting married. An uncle refills your glass with {w:drink}.",
        "The wedding of a total stranger you met through a wrong-number text. They seated you at the head table, between the drunk uncle and the best man, who calls you '{w:nickname}'.",
        "Here you are at a family dinner with people you don't know. They saved you some casserole. Grandpa tells you about the war. Yours, he thinks. He gives you {w:gift}.",
        "You arrive at the strangers' party bringing {w:gift} as a present. They're moved to tears. The DJ plays {w:song}. You're already on the dance floor.",
      ],
    },
    choices: [
      { label: { fr: 'Faire un discours', en: 'Give a speech' }, text: { fr: ["J'ai fait un discours sur l'amour, le hasard et les mauvais numéros. Toute la salle a pleuré. On m'a demandé d'être parrain{|e} du prochain bébé.", "J'ai improvisé un discours émouvant sur des gens que je connais depuis deux heures. Standing ovation. Je fais maintenant partie de la famille. Ils m'appellent « le cousin du téléphone »."], en: ["I gave a speech about love, chance and wrong numbers. The whole room cried. They asked me to be godparent to the next baby.", "I improvised a moving speech about people I'd known for two hours. Standing ovation. I'm part of the family now. They call me 'the phone cousin'."] }, fx: { happy: 10, karma: 4, fame: 1 }, mood: 'party' },
      {
        label: { fr: 'Manger et danser', en: 'Eat and dance' },
        out: [
          { w: 2, text: { fr: ["J'ai mangé trois parts de pièce montée, dansé avec la grand-mère et gagné le concours de limbo. C'est la meilleure fête de ma vie, chez des inconnus.", "J'ai dansé toute la nuit. Le lendemain, j'avais 14 nouveaux contacts, un tupperware de restes et une invitation pour Noël."], en: ["I ate three slices of wedding cake, danced with grandma and won the limbo contest. Best party of my life, with strangers.", "I danced all night. The next day I had 14 new contacts, a container of leftovers and an invitation for Christmas."] }, fx: { happy: 8, health: -1 }, mood: 'party' },
          { w: 1, text: { fr: ["L'oncle bourré a découvert que je n'étais pas de la famille. Il m'a accusé{|e} d'être un pique-assiette. Il n'avait pas tort. On m'a raccompagné{|e} avec une part de gâteau.", "La mariée m'a demandé « Mais vous êtes qui, en fait ? » devant 150 personnes. J'ai dit « le Wi-Fi ». Personne n'a compris. Je suis parti{|e} avec des dragées."], en: ["The drunk uncle figured out I wasn't family. He accused me of being a freeloader. He wasn't wrong. They walked me out with a slice of cake.", "The bride asked 'Who are you, actually?' in front of 150 people. I said 'the Wi-Fi'. Nobody understood. I left with sugared almonds."] }, fx: { happy: 2, stress: 3 } },
        ],
      },
    ],
  },
  {
    id: 'dy_lookalike',
    icon: '🕶️',
    cat: 'luck',
    rating: 1,
    scene: { place: 'park', mood: 'shock', prop: 'camera' },
    when: { age: [18, 80] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Dans la rue, une bande d'ados te prend pour {w:celeb}. Ils crient, sortent leurs téléphones et te demandent un autographe. Tu ne lui ressembles pas. Du tout.",
        "Au supermarché, une femme te gifle : « Ça, c'est pour ce que tu as fait à ma sœur, Kevin ! » Tu ne t'appelles pas Kevin. Tu n'as jamais vu sa sœur. Elle repart en te traitant de « {w:insult} ».",
        "Au restaurant, le serveur te traite comme un roi : champagne offert, meilleure table. Le patron te serre la main : « C'est un honneur de recevoir {w:celeb} ! »",
        "Un inconnu te tombe dans les bras en pleurant : « Je savais que tu n'étais pas mort ! » Il t'appelle Dédé. Il a l'air vraiment heureux. Il te rend {w:object} : « Je te devais bien ça. »",
      ],
      en: [
        "On the street, a group of teens mistakes you for {w:celeb}. They scream, pull out their phones and ask for an autograph. You look nothing like them. Nothing.",
        "At the supermarket, a woman slaps you: 'That's for what you did to my sister, Kevin!' Your name isn't Kevin. You've never met her sister. She leaves calling you '{w:insult}'.",
        "At a restaurant, the waiter treats you like royalty: free champagne, best table. The owner shakes your hand: 'It's an honor to host {w:celeb}!'",
        "A stranger falls into your arms, crying: 'I knew you weren't dead!' He calls you Dédé. He seems genuinely happy. He hands you {w:object}: 'I owed you this.'",
      ],
    },
    choices: [
      {
        label: { fr: 'Jouer le rôle', en: 'Play the part' },
        out: [
          { w: 2, text: { fr: ["J'ai signé des autographes, fait des selfies et dîné gratuitement. J'ai même donné une interview à un blog local. Je suis une star, par erreur.", "J'ai joué le jeu à fond. Repas offert, champagne, VIP. J'ai laissé un « merci pour tout » signé d'un faux nom. Ça a été la soirée la plus glamour de ma vie."], en: ["I signed autographs, took selfies and ate for free. I even gave an interview to a local blog. I'm a star, by mistake.", "I went all in. Free meal, champagne, VIP. I left a 'thanks for everything' signed with a fake name. Most glamorous evening of my life."] }, fx: { happy: 8, fame: 2, followers: 2000 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai joué le rôle. Une heure plus tard, le vrai est arrivé. Le patron m'a présenté l'addition de toute la soirée, champagne compris. 600 €. J'ai fait la vaisselle.", "J'ai fait semblant d'être Kevin. Le frère de la sœur est arrivé. Il était grand. Très grand. J'ai couru plus vite que jamais."], en: ["I played the part. An hour later, the real one walked in. The owner handed me the bill for the whole evening, champagne included. $600. I washed dishes.", "I pretended to be Kevin. The sister's brother showed up. He was big. Very big. I ran faster than ever before."] }, fx: { money: -300, happy: -5, athletic: 2 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Rétablir la vérité', en: 'Set the record straight' }, text: { fr: ["J'ai expliqué que je n'étais pas cette personne. Les ados ont été déçus. L'un d'eux m'a quand même demandé une photo « parce que t'as une bonne tête ». Je prends.", "J'ai rétabli la vérité. La dame qui m'a giflé{|e} s'est excusée et m'a offert un café. On a parlé de Kevin. Kevin a l'air d'être un vrai salaud."], en: ["I explained I wasn't that person. The teens were disappointed. One still asked for a photo 'because you've got a nice face'. I'll take it.", "I set the record straight. The lady who slapped me apologized and bought me a coffee. We talked about Kevin. Kevin sounds like a real bastard."] }, fx: { karma: 3, happy: 2 } },
    ],
  },
  {
    id: 'dy_toilet_no_paper',
    icon: '🧻',
    cat: 'daily',
    rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'toilet', fx: 'poop' },
    when: { age: [18, 95] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Toilettes publiques. Mission accomplie. Tu tends la main vers le dérouleur. Vide. Le carton nu te regarde. Tu entends quelqu'un dans la cabine d'à côté faire {w:sound}.",
        "Toilettes du bureau. Tu as fini. Il n'y a plus de papier. Ton téléphone est à 2 % et il y a {w:object} au sol. C'est tout.",
        "Aire d'autoroute, toilettes à la turque. Pas de papier. Pas de lumière. Il règne {w:smell} et quelque chose a bougé dans le coin.",
        "Au restaurant d'un premier rendez-vous, aux toilettes, plus de papier. La seule option : les chaussettes, ou le menu du jour, plastifié. Plat du jour : {w:food}.",
      ],
      en: [
        "Public restroom. Mission accomplished. You reach for the dispenser. Empty. The bare cardboard tube stares at you. You hear someone in the next stall make {w:sound}.",
        "Office bathroom. You're done. There's no paper. Your phone is at 2% and there's {w:object} on the floor. That's it.",
        "Highway rest stop, squat toilet. No paper. No light. There's {w:smell} in the air and something moved in the corner.",
        "At a first-date restaurant, in the restroom, no paper. The only options: your socks, or the laminated daily menu. Today's special: {w:food}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Demander au voisin', en: 'Ask the neighbor' },
        out: [
          { w: 2, text: { fr: ["J'ai murmuré « excusez-moi, vous auriez du papier ? ». Une main a glissé trois feuilles sous la cloison. On ne s'est jamais vus. C'est la plus belle chose qu'un inconnu ait faite pour moi.", "J'ai demandé. Une voix m'a répondu : « C'est toi, {first} ? » C'était mon boss. Il m'a passé le rouleau. On n'en a jamais reparlé, mais il me sourit bizarrement."], en: ["I whispered 'excuse me, do you have any paper?'. A hand slid three sheets under the partition. We never saw each other. Kindest thing a stranger has ever done for me.", "I asked. A voice answered: 'Is that you, {first}?' It was my boss. He passed me the roll. We never spoke of it, but he smiles at me weirdly now."] }, fx: { happy: 3, karma: 2 } },
          { w: 1, text: { fr: ["La voisine de cabine a répondu « non ». Puis elle a demandé : « Et vous, vous en avez ? » Nous étions deux âmes coincées dans le même enfer. On a fait connaissance. Longuement.", "Personne n'a répondu. Le voisin est parti en riant. J'ai entendu la porte, puis le sèche-mains, puis un rire qui s'éloignait."], en: ["The person in the next stall said 'no'. Then asked: 'Do you have any?' We were both stuck in the same hell. We got to know each other. At length.", "Nobody answered. The neighbor left, laughing. I heard the door, then the hand dryer, then a fading laugh."] }, fx: { stress: 4, happy: -2 } },
        ],
      },
      { label: { fr: 'Sacrifier une chaussette', en: 'Sacrifice a sock' }, text: { fr: ["J'ai sacrifié ma chaussette gauche. Elle est partie avec honneur. J'ai fini la journée avec un pied nu dans ma chaussure. Personne ne sait. Sauf ce journal.", "Chaussette sacrifiée, jetée dans la poubelle. J'ai passé le rendez-vous avec un seul pied chaussetté. Mon date a remarqué. Il n'a rien dit. On se revoit jeudi."], en: ["I sacrificed my left sock. It went with honor. I spent the rest of the day with a bare foot in my shoe. Nobody knows. Except this journal.", "Sock sacrificed and binned. I spent the date with one socked foot. My date noticed. Said nothing. We're meeting again Thursday."] }, fx: { discipline: 2, happy: 1 } },
      { label: { fr: 'La technique du pingouin', en: 'The penguin waddle' }, text: { fr: ["J'ai remonté mon pantalon et marché en canard jusqu'aux toilettes d'à côté. J'ai croisé trois collègues. Un a dit « ça va ? ». J'ai dit « très bien ». Je ne vais pas bien.", "J'ai fait le trajet jusqu'à la supérette d'en face, en marchant comme un cow-boy après six mois de cheval. J'ai acheté du papier. La caissière savait."], en: ["I pulled up my pants and waddled to the next bathroom. I passed three coworkers. One asked 'you okay?'. I said 'great'. I'm not great.", "I walked to the convenience store across the street like a cowboy after six months on horseback. Bought toilet paper. The cashier knew."] }, fx: { happy: -5, looks: -1 } },
    ],
  },
  {
    id: 'dy_revolving_door',
    icon: '🚪',
    cat: 'daily',
    rating: 0,
    scene: { place: 'office', mood: 'shock', prop: 'door' },
    when: { age: [18, 95] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Tu entres dans une porte tambour en même temps qu'un monsieur qui porte {w:object}. La porte se bloque. Vous êtes coincés dans le même compartiment, nez à nez.",
        "Le tourniquet du métro a avalé ton ticket et refermé ses portes sur toi à mi-corps. Tu es coincé{|e}, la moitié dedans, la moitié dehors. Derrière toi, la file s'allonge. Quelqu'un crie « {w:insult} ! »",
        "Tu pousses la porte vitrée marquée « Tirez ». Elle ne bouge pas. Tu pousses plus fort. Tout le café te regarde. Une petite fille dit à sa mère : « Pourquoi il pousse ? » Sa mère répond, en mangeant {w:food} : « Parce que, chérie. »",
        "Tu restes coincé{|e} dans la porte automatique d'un magasin qui s'ouvre et se ferme sur toi, en boucle. Elle fait {w:sound} à chaque fois. Le vigile filme.",
      ],
      en: [
        "You enter a revolving door at the same time as a man carrying {w:object}. The door jams. You're stuck in the same compartment, nose to nose.",
        "The subway turnstile ate your ticket and closed its gates on you at the waist. You're stuck, half in, half out. The line behind you is growing. Someone yells '{w:insult}!'",
        "You push the glass door marked 'Pull'. It doesn't move. You push harder. The whole café is watching. A little girl asks her mom: 'Why is he pushing?' Her mom, eating {w:food}, replies: 'Because, sweetie.'",
        "You're stuck in a store's automatic door that keeps opening and closing on you, in a loop. It makes {w:sound} each time. The security guard is filming.",
      ],
    },
    choices: [
      { label: { fr: 'Rester digne', en: 'Stay dignified' }, text: { fr: ["J'ai attendu le technicien sans un mot, en regardant l'inconnu dans les yeux. Vingt minutes. On a fini par échanger nos numéros. C'est une forme de rencontre.", "J'ai gardé un air parfaitement serein, comme si c'était voulu. Les gens ont fini par croire à une performance artistique. On m'a donné 3 €."], en: ["I waited for the technician without a word, looking the stranger in the eye. Twenty minutes. We ended up swapping numbers. It's a kind of meet-cute.", "I kept a perfectly serene expression, as if it were intentional. People eventually thought it was performance art. Someone gave me $3."] }, fx: { discipline: 2, happy: 2 } },
      {
        label: { fr: 'Forcer', en: 'Force it' },
        out: [
          { w: 1, odds: { athletic: 2 }, text: { fr: ["J'ai poussé de toutes mes forces. La porte a cédé, j'ai été éjecté{|e} de l'autre côté comme une savonnette et j'ai glissé jusqu'à l'accueil. Atterrissage parfait.", "J'ai forcé le tourniquet avec une force herculéenne. Il s'est tordu. Les gens derrière moi ont applaudi et sont passés gratuitement. Je suis un héros du peuple."], en: ["I pushed with all my strength. The door gave way and I shot out the other side like a bar of soap, sliding all the way to the reception desk. Perfect landing.", "I forced the turnstile with Herculean strength. It bent. The people behind me applauded and went through for free. I'm a hero of the people."] }, fx: { happy: 5, athletic: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai forcé. La porte s'est remise à tourner d'un coup et m'a fait faire trois tours complets. Je suis ressorti{|e} du côté où j'étais entré{|e}, en titubant, avec la nausée.", "J'ai poussé. Elle tirait. J'ai poussé encore. Elle a fini par s'ouvrir dans l'autre sens et je me suis pris{|e} la vitre en pleine figure. La petite fille a ri. Moi non."], en: ["I forced it. The door suddenly spun and took me around three full turns. I came out the side I'd entered from, staggering and nauseous.", "I pushed. It was a pull. I pushed again. It finally swung the other way and I took the glass right in the face. The little girl laughed. I didn't."] }, fx: { health: -3, happy: -3 } },
        ],
      },
    ],
  },
  {
    id: 'dy_dog_poop_step',
    icon: '💩',
    cat: 'luck',
    rating: 2,
    scene: { place: 'park', mood: 'sick', prop: 'shoe', fx: 'poop' },
    when: { age: [18, 95] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Sur le chemin d'un entretien important, ton pied droit s'enfonce dans quelque chose de mou et tiède. Une crotte de chien. Une grosse. Un berger allemand, au minimum. Ou {w:animal}.",
        "Tu rentres chez toi. Une odeur te suit. Elle est dans le salon. Elle est sur le tapis blanc. Elle est sous ta chaussure, incrustée dans les rainures, et tu as marché partout. Ça évoque {w:food}, version digérée.",
        "Tu glisses sur une crotte de chien, tu fais un grand écart involontaire et tu atterris assis{|e} dans une deuxième. Elle était encore tiède. Le chien est assis à côté et te regarde. Son maître fait semblant de ne pas te voir, en écoutant {w:song}.",
        "Tu as marché dans une crotte {w:weather}. Tu as frotté ta chaussure sur le trottoir pendant cinq minutes. Ça n'a fait qu'étaler. Tu as maintenant une trace de 3 mètres et, en prime, ceci collé à la semelle : {w:gross}.",
      ],
      en: [
        "On your way to an important interview, your right foot sinks into something soft and warm. Dog poop. A big one. German shepherd, at least. Or {w:animal}.",
        "You come home. A smell follows you. It's in the living room. It's on the white rug. It's under your shoe, packed into the grooves, and you've walked everywhere. It evokes {w:food}, digested edition.",
        "You slip on dog poop, do an involuntary split and land butt-first in a second one. Still warm. The dog is sitting nearby, watching you. Its owner pretends not to see you, listening to {w:song}.",
        "You stepped in poop {w:weather}. You scraped your shoe on the sidewalk for five minutes. It just spread it around. You now have a 10-foot streak and, as a bonus, {w:gross} stuck to your sole.",
      ],
    },
    choices: [
      { label: { fr: 'Nettoyer au bâton', en: 'Clean it with a stick' }, text: { fr: ["J'ai nettoyé ma semelle avec un bâton pendant vingt minutes, accroupi{|e}, en pleurant. Un enfant m'a demandé ce que je faisais. J'ai dit « de l'archéologie ».", "J'ai passé une demi-heure avec une brindille et une brosse à dents. La brosse à dents était la mienne. Je ne m'en suis rendu compte qu'en me brossant les dents."], en: ["I cleaned my sole with a stick for twenty minutes, squatting, crying. A kid asked what I was doing. I said 'archaeology'.", "I spent half an hour with a twig and a toothbrush. The toothbrush was mine. I only realized when I brushed my teeth."] }, fx: { happy: -4, stress: 2 } },
      {
        label: { fr: 'Ça porte bonheur !', en: "It's good luck!" },
        out: [
          { w: 1, text: { fr: ["Pied gauche, ça porte bonheur, paraît-il. J'ai joué au loto. J'ai gagné 800 €. Je marche maintenant dans toutes les crottes de la ville. Je n'ai plus rien regagné.", "J'ai décidé que c'était un signe. Le jour même, j'ai décroché le job. Le recruteur a dit que j'avais « une présence ». C'était l'odeur."], en: ["Left foot, it's good luck, supposedly. I played the lottery. Won $800. I now step in every poop in town. I haven't won since.", "I decided it was a sign. That same day, I got the job. The recruiter said I had 'presence'. It was the smell."] }, fx: { money: 500, happy: 6 }, mood: 'happy' },
          { w: 2, text: { fr: ["Ça ne porte pas bonheur. Ça porte juste de la merde. Dans le bus, les gens se sont écartés autour de moi comme la mer Rouge.", "J'ai voulu y croire. Pendant l'entretien, le recruteur a reniflé, regardé sous la table et mis fin à la conversation au bout de 4 minutes. Je n'ai pas eu le poste."], en: ["It's not good luck. It's just shit. On the bus, people parted around me like the Red Sea.", "I wanted to believe. During the interview, the recruiter sniffed, looked under the table and ended the conversation after 4 minutes. I didn't get the job."] }, fx: { happy: -6, looks: -2 }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Retrouver le propriétaire', en: 'Find the owner' }, text: { fr: ["J'ai retrouvé le maître du chien, à l'aide d'une enquête de voisinage digne de Columbo. Je lui ai rendu son bien, emballé dans un sac, devant sa porte. Avec un ruban.", "J'ai suivi les traces de pattes jusqu'à un pavillon. J'ai sonné. Un chihuahua minuscule est apparu. Ça ne pouvait pas être lui. C'était lui. Respect."], en: ["I tracked down the dog's owner with a neighborhood investigation worthy of Columbo. I returned his property, bagged, on his doorstep. With a ribbon.", "I followed the paw prints to a house. Rang the bell. A tiny chihuahua appeared. It couldn't have been him. It was him. Respect."] }, fx: { happy: 4, karma: -1 } },
    ],
  },
  {
    id: 'dy_toilet_clog',
    icon: '🪠',
    cat: 'home',
    rating: 2,
    actor: { create: { role: 'acquaintance', age: [-5, 10], gender: 'attracted' } },
    scene: { place: 'apartment', mood: 'shock', prop: 'toilet', fx: 'poop' },
    when: { age: [18, 80] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: [
        "Premier dîner chez {a.first}, que tu essaies de séduire depuis des semaines. Tu vas aux toilettes. Tu tires la chasse. L'eau monte. Elle monte encore. Elle ne redescend pas. Il flotte {w:smell}.",
        "Chez {a.first}, tu as bouché les toilettes. Pas de ventouse. L'eau arrive au bord et elle tremble. Dedans flotte {w:object}. Derrière la porte, {a:il|elle} demande : « Tout va bien ? »",
        "Soirée chez {a.first}. Les toilettes n'ont pas de verrou, la chasse est capricieuse et ton estomac vient de rendre les armes après {w:food}. C'est une catastrophe en trois actes.",
        "Tu tires la chasse chez {a.first} et un bruit de tuyauterie résonne dans tout l'immeuble, comme {w:sound}. L'eau marron commence à couler par-dessus la cuvette.",
      ],
      en: [
        "First dinner at {a.first}'s place, whom you've been trying to woo for weeks. You go to the bathroom. You flush. The water rises. And rises. It doesn't go down. There's {w:smell} in the air.",
        "At {a.first}'s, you clogged the toilet. No plunger. The water's at the rim, trembling. Floating in it: {w:object}. From behind the door, {a:he|she} asks: 'Everything okay?'",
        "Evening at {a.first}'s. The bathroom has no lock, the flush is temperamental and your stomach just surrendered after {w:food}. A disaster in three acts.",
        "You flush at {a.first}'s and a pipe noise echoes through the whole building, like {w:sound}. Brown water starts spilling over the bowl.",
      ],
    },
    choices: [
      {
        label: { fr: 'Plonger la main', en: 'Go in by hand' },
        out: [
          { w: 1, text: { fr: ["J'ai retroussé ma manche et plongé la main. J'ai trouvé le bouchon. Je l'ai délogé. Je me suis lavé les mains onze fois. {a.first} n'a jamais rien su. Je l'ai embrassé{a:|e} avec cette main.", "J'ai réglé le problème à mains nues, comme un homme des cavernes. Personne n'a rien vu. J'ai une nouvelle relation avec la vie et une nouvelle peur des tuyaux."], en: ["I rolled up my sleeve and went in. Found the blockage. Cleared it. Washed my hands eleven times. {a.first} never knew. I kissed {a:him|her} with that hand.", "I fixed it bare-handed, like a caveman. Nobody saw. I have a new relationship with life and a new fear of pipes."] }, fx: { happy: 2, discipline: 3, rel: 5 } },
          { w: 1, text: { fr: ["Ma main a poussé le bouchon plus loin. L'eau a débordé. J'ai glissé dedans. {a.first} a ouvert la porte au moment où j'étais assis{|e} par terre dans la flaque, le bras mouillé jusqu'au coude. Silence.", "J'ai plongé la main, la chasse s'est déclenchée toute seule, et tout est remonté d'un coup, en geyser. Le plafond. Le miroir. Moi. {a.first} a appelé un plombier, puis un taxi pour moi."], en: ["My hand pushed the clog further. The water overflowed. I slipped in it. {a.first} opened the door just as I was sitting in the puddle, arm wet up to the elbow. Silence.", "I went in by hand, the flush triggered on its own, and everything came back up at once, geyser-style. The ceiling. The mirror. Me. {a.first} called a plumber, then a cab for me."] }, fx: { happy: -10, looks: -3, rel: -15, visual: 'poop' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Avouer', en: 'Confess' }, text: { fr: ["J'ai ouvert la porte et dit : « J'ai un problème, et c'est grave. » {a.first} a éclaté de rire, sorti une ventouse et m'a montré comment faire. C'est la soirée la plus intime qu'on ait eue.", "J'ai tout avoué. {a.first} m'a avoué qu'{a:il|elle} avait fait pareil chez son ex. On a débouché ensemble. Ça crée des liens. Des liens marron, mais des liens."], en: ["I opened the door and said: 'I have a problem, and it's serious.' {a.first} burst out laughing, grabbed a plunger and showed me how. Most intimate evening we've had.", "I confessed everything. {a.first} admitted to doing the same at an ex's. We unclogged it together. It's a bonding experience. A brown bond, but a bond."] }, fx: { happy: 5, rel: 10, keep: true, actorRole: 'friend' }, mood: 'love' },
      { label: { fr: 'Fuir par la fenêtre', en: 'Escape through the window' }, text: { fr: ["J'ai ouvert la fenêtre des toilettes et je me suis glissé{|e} dehors. Rez-de-chaussée, heureusement. J'ai envoyé un SMS : « Urgence familiale ». {a.first} a découvert les toilettes. Puis m'a bloqué{|e}.", "Je suis sorti{|e} par la fenêtre, j'ai couru jusqu'au métro, et je n'ai jamais répondu à ses messages. Dans mes cauchemars, je vois encore l'eau qui monte."], en: ["I opened the bathroom window and slipped out. Ground floor, luckily. Texted: 'Family emergency'. {a.first} discovered the toilet. Then blocked me.", "I climbed out the window, ran to the subway and never answered {a:his|her} messages. In my nightmares, I still see the water rising."] }, fx: { happy: -4, karma: -3, athletic: 2 } },
    ],
  },
  {
    id: 'dy_last_baguette',
    icon: '🥖',
    cat: 'daily',
    rating: 0,
    scene: { place: 'park', mood: 'angry', prop: 'bread' },
    when: { age: [18, 95] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: [
        "Boulangerie, 19 h 28. Il reste une seule baguette tradition. Une dame entre en même temps que toi. Vos regards se croisent. Elle a 80 ans et une canne. Elle a l'air redoutable. Elle murmure : « {w:threat} ».",
        "Tu fais la queue à la boulangerie. Il reste un croissant. Le client devant toi hésite entre « le croissant » et « un pain aux raisins ». Il hésite depuis deux minutes.",
        "La boulangère te tend une baguette cramée en disant « c'est la dernière ». Derrière elle, tu vois clairement un panier plein de baguettes dorées. Elle soutient ton regard en mangeant {w:food}.",
        "Il reste un éclair au chocolat en vitrine. Un enfant le pointe du doigt en même temps que toi. Sa mère te regarde. L'enfant aussi. Tu as faim. L'enfant a {w:object} et il n'a pas peur de s'en servir.",
      ],
      en: [
        "Bakery, 7:28 p.m. One last artisan baguette. A lady walks in at the same time as you. Your eyes meet. She's 80 with a cane. She looks formidable. She whispers: '{w:threat}'.",
        "You're in line at the bakery. One croissant left. The customer ahead is torn between 'the croissant' and 'a raisin swirl'. He's been torn for two minutes.",
        "The baker hands you a burnt baguette saying 'it's the last one'. Behind her, you can clearly see a basket full of golden baguettes. She holds your gaze while eating {w:food}.",
        "There's one chocolate éclair left in the display. A kid points at it at the same time as you. His mom looks at you. So does the kid. You're hungry. The kid has {w:object} and isn't afraid to use it.",
      ],
    },
    choices: [
      {
        label: { fr: 'Foncer', en: 'Go for it' },
        out: [
          { w: 1, text: { fr: ["J'ai dit « une tradition, s'il vous plaît » plus vite que mon ombre. Victoire. La vieille dame m'a maudit{|e} sur sept générations. J'ai mangé la baguette en marchant, coupable et heureux{|se}.", "J'ai pris l'éclair. L'enfant a pleuré. J'ai mangé l'éclair. C'était le meilleur éclair de ma vie. Je ne suis pas fier{|e}."], en: ["I said 'one baguette, please' faster than my own shadow. Victory. The old lady cursed me for seven generations. I ate the baguette walking, guilty and happy.", "I took the éclair. The kid cried. I ate the éclair. It was the best éclair of my life. I'm not proud."] }, fx: { happy: 4, karma: -4 } },
          { w: 1, text: { fr: ["La dame a été plus rapide. Elle a pris la baguette, s'est retournée et a croqué dedans en me regardant dans les yeux. Elle m'a terrassé{|e}.", "Au moment où j'ai ouvert la bouche, la vieille dame m'a donné un coup de canne sur le tibia. Elle est partie avec la baguette. J'ai boité jusqu'à chez moi."], en: ["The lady was faster. She took the baguette, turned around and bit into it while staring me down. She crushed me.", "Just as I opened my mouth, the old lady whacked my shin with her cane. She left with the baguette. I limped home."] }, fx: { happy: -3, health: -1 } },
        ],
      },
      { label: { fr: 'Laisser la place', en: 'Let them have it' }, text: { fr: ["J'ai laissé la baguette à la vieille dame. Elle m'a souri, coupé un bout et me l'a donné. On a mangé ensemble sur le trottoir. C'était la meilleure baguette de ma vie.", "J'ai laissé l'éclair à l'enfant. Sa mère m'a remercié{|e}. L'enfant m'a tiré la langue avec du chocolat dessus. Le karma, c'est compliqué."], en: ["I let the old lady have the baguette. She smiled, broke off a piece and gave it to me. We ate together on the sidewalk. Best baguette of my life.", "I let the kid have the éclair. His mom thanked me. The kid stuck out a chocolate-covered tongue at me. Karma is complicated."] }, fx: { karma: 5, happy: 3 } },
      { label: { fr: 'Exiger une fraîche', en: 'Demand a fresh one' }, text: { fr: ["J'ai désigné le panier derrière elle. Elle a soupiré, m'a donné une baguette dorée et m'a fait comprendre que je ne serais plus jamais servi{|e} avec le sourire. Ça valait le coup.", "J'ai demandé poliment une baguette du panier. Elle a répondu que celles-là « sont réservées ». Pour qui ? « Pour les gens qui ne demandent pas. »"], en: ["I pointed at the basket behind her. She sighed, gave me a golden baguette and made it clear I'd never be served with a smile again. Worth it.", "I politely asked for a baguette from the basket. She said those 'are reserved'. For whom? 'For people who don't ask.'"] }, fx: { happy: 2, stress: 2 } },
    ],
  },
  {
    id: 'dy_cinema_chewer',
    icon: '🍿',
    cat: 'daily',
    rating: 2,
    scene: { place: 'studio', mood: 'angry', prop: 'popcorn' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: [
        "Au cinéma, ton voisin mange des nachos avec la bouche ouverte, à chaque réplique importante. Il dégage {w:smell}. Il commente le film à voix haute : « C'est lui le méchant, je te dis ! »",
        "Le couple derrière toi au cinéma est en train de… s'occuper. Bruyamment. Tu entends des succions, des soupirs et un « pas ici, Jean-Pierre ». Ton siège bouge en rythme. Sur l'écran : {w:movie}.",
        "Quelqu'un derrière toi donne des coups de pied réguliers dans ton fauteuil depuis le début de {w:movie}. Un coup toutes les 4 secondes. Il bat la mesure.",
        "Dans la salle de cinéma, une personne regarde ses messages avec la luminosité au maximum, lance un vocal et rote. Le film, c'est {w:movie}. Tu as payé 14 €.",
      ],
      en: [
        "At the movies, your neighbor eats nachos with his mouth open, at every important line. He gives off {w:smell}. He comments out loud: 'He's the bad guy, I'm telling you!'",
        "The couple behind you at the movies is… busy. Loudly. You hear slurping, sighing and a 'not here, Jean-Pierre'. Your seat is moving in rhythm. On screen: {w:movie}.",
        "Someone behind you has been kicking your seat steadily since the start of {w:movie}. One kick every 4 seconds. He's keeping time.",
        "In the theater, someone checks their messages at full brightness, sends a voice note and burps. The film is {w:movie}. You paid $14.",
      ],
    },
    choices: [
      {
        label: { fr: 'Se retourner : « Chut ! »', en: "Turn around: 'Shh!'" },
        out: [
          { w: 1, text: { fr: ["J'ai fait « chut » avec l'autorité d'une bibliothécaire de 1950. Le silence est tombé. Trois personnes m'ont remercié{|e} à la sortie. Je suis le shérif de la salle 4.", "Mon « chut » a été si puissant que toute la salle a applaudi. Le couple derrière s'est rhabillé et a fui. Le film a repris sa dignité."], en: ["I shushed with the authority of a 1950s librarian. Silence fell. Three people thanked me on the way out. I'm the sheriff of Theater 4.", "My 'shh' was so powerful the whole room applauded. The couple behind me got dressed and fled. The film regained its dignity."] }, fx: { happy: 5 }, mood: 'proud' },
          { w: 1, text: { fr: ["Le type m'a répondu « {w:insult} » et m'a jeté ses nachos au fromage dans les cheveux. J'ai fini le film avec du cheddar fondu dans l'oreille. Ça a séché comme du ciment.", "Je me suis retourné{|e} pour faire « chut ». Jean-Pierre m'a fait un clin d'œil. Sa partenaire m'a demandé si je voulais « me joindre ». Je suis sorti{|e} de la salle à quatre pattes."], en: ["The guy replied '{w:insult}' and threw his cheese nachos in my hair. I finished the movie with melted cheddar in my ear. It dried like cement.", "I turned around to shush. Jean-Pierre winked at me. His partner asked if I wanted to 'join in'. I crawled out of the theater on all fours."] }, fx: { happy: -5, looks: -1 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Se venger avec du pop-corn', en: 'Popcorn revenge' }, text: { fr: ["J'ai lancé mon pop-corn par-dessus mon épaule, poignée par poignée, pendant tout le film. À la fin, ils ressemblaient à deux sapins de Noël. Personne n'a rien prouvé.", "J'ai renversé « accidentellement » mon soda d'un litre sur le type derrière moi. Il a passé la fin du film à coller à son siège. Le karma a un goût de cola."], en: ["I threw my popcorn over my shoulder, handful by handful, the whole movie. By the end they looked like two Christmas trees. Nobody could prove anything.", "I 'accidentally' spilled my 32-oz soda on the guy behind me. He spent the rest of the movie stuck to his seat. Karma tastes like cola."] }, fx: { happy: 6, karma: -3 } },
      { label: { fr: 'Changer de place', en: 'Change seats' }, text: { fr: ["J'ai changé de place. Mon nouveau voisin ronflait. J'ai rechangé. Le suivant pleurait sur l'épaule de sa mère. J'ai regardé la fin du film debout au fond, comme un vigile.", "J'ai déménagé au premier rang. Torticolis garanti. J'ai vu le film en gros plan, les narines des acteurs en 8 mètres de large. Inoubliable."], en: ["I changed seats. My new neighbor was snoring. Changed again. The next one was crying on his mom's shoulder. I watched the end standing at the back, like a security guard.", "I moved to the front row. Stiff neck guaranteed. I saw the movie in extreme close-up, the actors' nostrils 25 feet wide. Unforgettable."] }, fx: { stress: 2, health: -1 } },
    ],
  },
  // ───────────────────────────── lignes de journal (auto) ─────────────────────────────
  {
    id: 'dy_auto_green_lights',
    icon: '🚦',
    cat: 'luck',
    rating: 0,
    auto: true,
    scene: { place: 'park', mood: 'happy', prop: 'car' },
    when: { age: [18, 95] },
    weight: 5,
    cooldown: 4,
    text: {
      fr: [
        "Aujourd'hui, tous les feux étaient verts, le bus est arrivé à l'heure et il restait {w:food} à la boulangerie. J'ai vérifié trois fois que je n'étais pas mort{|e}.",
        "Journée parfaite : place de parking devant la porte, aucun mail, et quelqu'un m'a fait un compliment : « {w:compliment} ». Je me méfie.",
        "J'ai eu une journée de chance absurde. J'ai trouvé un ticket de métro, une pièce de 2 € et l'amour de ma vie. Enfin, {w:animal}. Mais quand même.",
        "Le distributeur m'a donné deux canettes au lieu d'une. Un inconnu m'a tenu la porte. La météo était juste. À la radio, ils passaient {w:song}. Je ne sais pas ce que j'ai fait pour mériter ça.",
      ],
      en: [
        "Today every light was green, the bus was on time and the bakery still had {w:food}. I checked three times that I wasn't dead.",
        "Perfect day: parking spot right outside, zero emails, and someone gave me a compliment: '{w:compliment}'. I'm suspicious.",
        "I had a day of absurd luck. I found a subway ticket, a $2 coin and the love of my life. Well, {w:animal}. But still.",
        "The vending machine gave me two cans instead of one. A stranger held the door. The forecast was right. The radio played {w:song}. I don't know what I did to deserve this.",
      ],
    },
    fx: { happy: 5, stress: -3 },
  },
  {
    id: 'dy_auto_coin',
    icon: '🪙',
    cat: 'luck',
    rating: 0,
    auto: true,
    vars: { amount: [1, 40] },
    scene: { place: 'park', mood: 'happy', prop: 'coin' },
    when: { age: [18, 95] },
    weight: 5,
    cooldown: 3,
    text: {
      fr: [
        "J'ai trouvé {$amount} par terre {w:at_place}. J'ai regardé autour de moi comme un voleur, puis je les ai ramassés comme un héros.",
        "J'ai retrouvé {$amount} dans la poche d'un manteau que je n'avais pas mis depuis deux hivers, avec un ticket de caisse pour {w:object}. Mystère.",
        "Une machine à café m'a rendu {$amount} de monnaie en trop. Je lui ai dit merci. À voix haute. Elle a répondu par {w:sound}.",
        "J'ai gagné {$amount} à un jeu à gratter acheté {w:excuse}. Je me sens invincible. Je vais en racheter dix. Je vais tout perdre.",
      ],
      en: [
        "I found {$amount} on the ground {w:at_place}. I looked around like a thief, then picked it up like a hero.",
        "I found {$amount} in the pocket of a coat I hadn't worn in two winters, along with a receipt for {w:object}. Mystery.",
        "A coffee machine gave me {$amount} too much change. I said thank you. Out loud. It replied with {w:sound}.",
        "I won {$amount} on a scratch card I bought {w:excuse}. I feel invincible. I'm going to buy ten more. I'll lose it all.",
      ],
    },
    fx: { money: 'amount', happy: 3 },
  },
  {
    id: 'dy_auto_update',
    icon: '📱',
    cat: 'adulting',
    rating: 0,
    auto: true,
    scene: { place: 'home', mood: 'angry', prop: 'phone' },
    when: { age: [18, 95] },
    weight: 5,
    cooldown: 3,
    text: {
      fr: [
        "Mon téléphone a fait une mise à jour cette nuit. Toutes mes applis ont changé de place, mon fond d'écran est devenu {w:animal} et le réveil n'a pas sonné.",
        "Mon ordinateur a décidé de redémarrer pour une mise à jour pile au moment où j'allais sauvegarder. J'ai perdu trois heures de travail. Il a affiché « Bonne journée ! » sur un fond d'écran représentant {w:animal}.",
        "Après la mise à jour, mon téléphone parle en portugais et refuse de revenir en arrière. Je comprends maintenant « bom dia » et « bateria fraca ». Le GPS m'emmène désormais {w:far_place}.",
        "Ma télé a téléchargé une mise à jour de 40 minutes avant le match. Elle a fini pile au coup de sifflet final. Elle l'a fait exprès. Puis elle a lancé {w:show}.",
      ],
      en: [
        "My phone updated overnight. All my apps moved, my wallpaper became {w:animal} and my alarm didn't go off.",
        "My computer decided to restart for an update right as I was about to save. Lost three hours of work. It displayed 'Have a nice day!' over a wallpaper of {w:animal}.",
        "After the update, my phone speaks Portuguese and won't switch back. I now understand 'bom dia' and 'bateria fraca'. The GPS now routes me {w:far_place}.",
        "My TV downloaded a 40-minute update right before the game. It finished exactly at the final whistle. It did it on purpose. Then it put on {w:show}.",
      ],
    },
    fx: { stress: 3, happy: -2 },
  },
  {
    id: 'dy_auto_toast',
    icon: '🍞',
    cat: 'luck',
    rating: 1,
    auto: true,
    scene: { place: 'home', mood: 'sad', prop: 'toast' },
    when: { age: [18, 95] },
    weight: 5,
    cooldown: 3,
    text: {
      fr: [
        "Ma tartine est tombée côté confiture. Sur le tapis. Le chat a marché dessus, puis sur le canapé, puis sur mon oreiller, puis sur {w:object}. Putain de lundi.",
        "J'ai appliqué la règle des cinq secondes à une chips tombée {w:at_place}. Elle avait un cheveu. Je l'ai mangée quand même. Je ne regrette rien.",
        "J'ai fait tomber mon café sur mon pantalon clair juste avant de partir. Puis le deuxième, sur le pantalon de rechange. Je suis allé{|e} bosser en jogging. Le boss m'a demandé si je partais {w:to_place}.",
        "Mon croissant s'est fait voler par {w:animal} pendant que je cherchais mes clés. Il m'a regardé{|e} en le mangeant. Il savait que je ne ferais rien.",
      ],
      en: [
        "My toast fell jam-side down. On the rug. The cat walked through it, then onto the couch, then onto my pillow, then onto {w:object}. Fucking Monday.",
        "I applied the five-second rule to a chip that fell {w:at_place}. It had a hair on it. I ate it anyway. No regrets.",
        "I spilled coffee on my light-colored pants right before leaving. Then the second cup, on the backup pants. I went to work in sweatpants. The boss asked if I was off {w:to_place}.",
        "My croissant got stolen by {w:animal} while I was looking for my keys. It stared at me while eating it. It knew I wouldn't do anything.",
      ],
    },
    fx: { happy: -3 },
  },
  {
    id: 'dy_auto_cold_shower',
    icon: '🥶',
    cat: 'home',
    rating: 1,
    auto: true,
    scene: { place: 'apartment', mood: 'shock', prop: 'shower' },
    when: { age: [18, 95] },
    weight: 5,
    cooldown: 3,
    text: {
      fr: [
        "Le chauffe-eau a rendu l'âme en plein shampoing. J'ai rincé mes cheveux à l'eau glacée en hurlant « {w:swear} ». Les voisins ont applaudi.",
        "Douche froide forcée ce matin : plus d'eau chaude. J'ai poussé des cris d'otarie. Mes tétons pourraient couper du verre. J'ai crié « {w:exclaim} » jusqu'au rinçage.",
        "Quelqu'un a tiré la chasse pendant ma douche. L'eau est passée de 38 °C à 3 °C en une seconde. J'ai vu ma vie défiler, puis mes ancêtres, puis {w:celeb}.",
        "J'ai pris une douche brûlante, puis glacée, puis brûlante. Le mitigeur a sa propre vie. J'ai la peau d'un homard tigré et je dégage {w:smell}.",
      ],
      en: [
        "The water heater died mid-shampoo. I rinsed my hair in ice water screaming '{w:swear}'. The neighbors applauded.",
        "Forced cold shower this morning: no hot water. I made sea lion noises. My nipples could cut glass. I screamed '{w:exclaim}' until the final rinse.",
        "Someone flushed while I was showering. The water went from 100°F to 37°F in one second. My life flashed before my eyes, then my ancestors, then {w:celeb}.",
        "I had a scalding shower, then freezing, then scalding. The mixer tap has a life of its own. My skin looks like a tiger-striped lobster and I give off {w:smell}.",
      ],
    },
    fx: { happy: -2, stress: 2, health: 1 },
  },
  {
    id: 'dy_auto_car_alarm',
    icon: '🚨',
    cat: 'home',
    rating: 1,
    auto: true,
    scene: { place: 'apartment', mood: 'sleepy', prop: 'car' },
    when: { age: [18, 95] },
    weight: 5,
    cooldown: 3,
    text: {
      fr: [
        "Une alarme de voiture a sonné de 3 h à 5 h du matin sous ma fenêtre. Personne n'est venu. J'ai fini par rêver en rythme avec elle. Dans mon rêve, {w:celeb} la désactivait.",
        "Une alarme de voiture a hurlé toute la nuit. Le matin, j'ai découvert que c'était la mienne. Les voisins m'ont accueilli{|e} avec des regards assassins et un mot : « {w:insult} ».",
        "À 4 h, un camion poubelle, une alarme de voiture et {w:sound} en même temps sous ma fenêtre. Un concert pour moi seul{|e}. Je n'avais rien demandé.",
        "Le voisin a fêté son anniversaire jusqu'à 5 h avec {w:song} en boucle. J'ai appelé la police. Les flics sont restés à la fête.",
      ],
      en: [
        "A car alarm went off under my window from 3 to 5 a.m. Nobody came. I ended up dreaming in rhythm with it. In my dream, {w:celeb} turned it off.",
        "A car alarm screamed all night. In the morning, I found out it was mine. The neighbors greeted me with murderous looks and a note: '{w:insult}'.",
        "At 4 a.m., a garbage truck, a car alarm and {w:sound} all at once under my window. A private concert. I didn't ask for it.",
        "The neighbor celebrated his birthday until 5 a.m. with {w:song} on loop. I called the cops. The cops stayed for the party.",
      ],
    },
    fx: { health: -2, stress: 3 },
  },
  {
    id: 'dy_auto_bathroom_door',
    icon: '🚻',
    cat: 'daily',
    rating: 2,
    auto: true,
    scene: { place: 'office', mood: 'shock', prop: 'toilet' },
    when: { age: [18, 95] },
    weight: 4,
    cooldown: 4,
    text: {
      fr: [
        "J'ai ouvert la porte des toilettes d'un resto sur un monsieur en pleine action, qui n'avait pas fermé le verrou. On s'est regardés. Il m'a dit « bonjour ». J'ai dit « bon appétit ». Je ne sais pas pourquoi. Il lisait un article sur {w:show}.",
        "Les toilettes du bureau ont un verrou cassé. J'ai tenu la porte avec mon pied pendant tout le processus, en équilibre, comme un flamant rose constipé. Quelqu'un a frappé en chantant {w:song}.",
        "J'ai lâché une bombe dans les toilettes du bureau et je suis sorti{|e} pile au moment où le boss entrait. Il a reniflé. Il m'a regardé{|e}. Il est ressorti. L'odeur rappelait vaguement {w:food}.",
        "Dans les toilettes de la gare, la cabine d'à côté a dégagé {w:smell} et des bruits de fin du monde. J'ai prié pour son âme. Et pour la mienne.",
      ],
      en: [
        "I opened a restaurant bathroom door on a man mid-business who hadn't locked it. We looked at each other. He said 'hello'. I said 'enjoy your meal'. I don't know why. He was reading about {w:show}.",
        "The office bathroom lock is broken. I held the door shut with my foot through the entire process, balancing like a constipated flamingo. Someone knocked, singing {w:song}.",
        "I dropped a bomb in the office bathroom and walked out just as the boss walked in. He sniffed. He looked at me. He walked back out. The smell vaguely recalled {w:food}.",
        "In the train station bathroom, the next stall gave off {w:smell} and apocalyptic noises. I prayed for their soul. And mine.",
      ],
    },
    fx: { happy: -2, stress: 2 },
  },
  {
    id: 'dy_auto_gastro_bus',
    icon: '🤢',
    cat: 'daily',
    rating: 2,
    auto: true,
    scene: { place: 'park', mood: 'sick', prop: 'bus', fx: 'poop' },
    when: { age: [18, 95] },
    weight: 4,
    cooldown: 5,
    text: {
      fr: [
        "Un enfant a vomi dans le bus, deux rangs devant. Puis sa mère. Puis le monsieur à côté, par réaction en chaîne. J'ai tenu jusqu'au bout, en héros, la bouche fermée et les yeux pleins de larmes. Il flottait {w:smell}.",
        "J'ai eu une crampe d'estomac dans le tram. J'ai dû descendre en urgence et courir jusqu'aux toilettes d'un café où il fallait consommer. J'ai commandé {w:drink}. Je ne l'ai jamais bu.",
        "Quelqu'un a mangé {w:food} au fond du bus. L'odeur et les virages ont eu raison de moi. J'ai vomi dans mon sac. Mon sac contenait mon déjeuner.",
        "Gastro en pleine heure de pointe. J'ai serré les fesses pendant six stations, en sueur froide, en marmonnant des prières. J'ai fait les deux derniers mètres en courant. De justesse. Vraiment de justesse. Mon excuse au bureau : {w:excuse}.",
      ],
      en: [
        "A kid threw up on the bus, two rows ahead. Then his mom. Then the man next to them, chain reaction. I held on heroically, mouth shut, eyes full of tears. The air was thick with {w:smell}.",
        "I got a stomach cramp on the tram. Had to get off and run to a café bathroom that required a purchase. I ordered {w:drink}. Never drank it.",
        "Someone ate {w:food} at the back of the bus. The smell and the turns did me in. I threw up into my bag. My bag contained my lunch.",
        "Stomach bug at rush hour. I clenched for six stops, in a cold sweat, mumbling prayers. I sprinted the last six feet. Close call. Really close. My excuse at the office: {w:excuse}.",
      ],
    },
    fx: { health: -3, happy: -4 },
  },
  {
    id: 'dy_auto_nosebleed',
    icon: '🩸',
    cat: 'daily',
    rating: 2,
    auto: true,
    scene: { place: 'office', mood: 'shock', prop: 'tissue', fx: 'gore' },
    when: { age: [18, 95] },
    weight: 4,
    cooldown: 5,
    text: {
      fr: [
        "J'ai saigné du nez en pleine réunion, d'un coup, comme une fontaine. J'ai repeint le rapport trimestriel en rouge. Le boss a dit que ça « soulignait les chiffres ». Une collègue a crié « {w:exclaim} »",
        "Saignement de nez dans le métro, sur la chemise blanche de mon voisin. Il a cru qu'on lui avait tiré dessus. J'ai cru que j'allais mourir. On a tous les deux crié. Un musicien a enchaîné sur {w:song}.",
        "Je me suis mouché{|e} trop fort. Une veine a lâché. J'ai mis du sang sur le mur, le miroir et {w:object}. On aurait dit une scène de crime. C'était mardi.",
        "Mon nez a saigné pendant un rendez-vous galant. J'ai fini avec deux bouts de serviette dans les narines, l'air d'un morse. On se revoit samedi, apparemment, {w:at_place}.",
      ],
      en: [
        "I got a nosebleed mid-meeting, suddenly, like a fountain. I painted the quarterly report red. The boss said it 'highlighted the numbers'. A coworker screamed '{w:exclaim}'",
        "Nosebleed on the subway, all over my neighbor's white shirt. He thought he'd been shot. I thought I was dying. We both screamed. A busker launched into {w:song}.",
        "I blew my nose too hard. A vein burst. I got blood on the wall, the mirror and {w:object}. It looked like a crime scene. It was Tuesday.",
        "My nose bled during a date. I ended up with two napkin bits up my nostrils, looking like a walrus. Apparently we're meeting again Saturday, {w:at_place}.",
      ],
    },
    fx: { health: -3, happy: -2 },
  },
  {
    id: 'dy_auto_blister',
    icon: '👟',
    cat: 'daily',
    rating: 2,
    auto: true,
    scene: { place: 'park', mood: 'sick', prop: 'shoe' },
    when: { age: [18, 95] },
    weight: 4,
    cooldown: 4,
    text: {
      fr: [
        "J'ai étrenné mes chaussures neuves pour marcher 12 km {w:at_place}. J'ai maintenant une ampoule de la taille d'une prune sur le talon. Elle a éclaté dans le métro. Ça a giclé.",
        "Mes nouvelles chaussures m'ont arraché la peau de trois orteils. En retirant la chaussette, j'ai retiré un peu de moi. Le sang avait collé le tissu. J'ai hurlé « {w:swear} ».",
        "J'ai percé mon ampoule avec une aiguille, comme mamie. Le liquide a giclé jusqu'au miroir. C'était dégoûtant et extrêmement satisfaisant. Ça a fait {w:sound}.",
        "Une ampoule sous le pied m'a fait marcher comme {w:animal} toute la semaine. Les gens me cédaient leur place dans le bus. Je n'ai rien dit.",
      ],
      en: [
        "I broke in my new shoes by walking 7 miles {w:at_place}. I now have a plum-sized blister on my heel. It popped on the subway. It squirted.",
        "My new shoes tore the skin off three toes. When I peeled off my sock, I peeled off a bit of me. The blood had glued the fabric. I screamed '{w:swear}'.",
        "I popped my blister with a needle, like grandma. The fluid squirted all the way to the mirror. It was disgusting and extremely satisfying. It made {w:sound}.",
        "A blister on my sole made me walk like {w:animal} all week. People gave me their seats on the bus. I didn't correct them.",
      ],
    },
    fx: { health: -2, athletic: 1 },
  },
];
