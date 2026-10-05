// Crime & justice events: prison life, street crime, life with a criminal record.
import type { EventDef } from '@bl/sim';

const CELLMATE = { create: { role: 'acquaintance' as const, age: [-10, 20] as [number, number], gender: 'same' as const } };
const STRANGER = { create: { role: 'acquaintance' as const, age: [-10, 20] as [number, number], gender: 'any' as const } };

export const crimeEvents: EventDef[] = [
  // ───────────────────────────── feed-only lines ─────────────────────────────
  {
    id: 'cr_auto_letter',
    icon: '✉️',
    cat: 'prison',
    auto: true,
    cooldown: 3,
    when: { prison: true },
    text: {
      fr: [
        "J'ai enfin reçu du courrier en prison. C'était une pub pour des piscines hors-sol. J'ai lu le catalogue onze fois.",
        "Mon correspondant de prison m'a écrit huit pages sur son chat. Je connais maintenant ce chat mieux que ma propre famille.",
        "Ma mère m'a envoyé un colis. Dedans : {w:food}, une photo où elle pose avec {w:animal} et une lettre qui commence par « Je ne suis pas en colère, je suis déçue ». Tout avait été ouvert et goûté par les gardiens.",
        "J'ai reçu une lettre d'un fan qui me demande une mèche de cheveux et mon avis sur {w:show}. Les gardiens l'ont lue avant moi et ont souligné les fautes. Il y en avait [[douze|vingt-trois|quarante]].",
        "Courrier du jour : une carte postale envoyée {w:far_place} par un ancien codétenu. Il a écrit juste « Liberté ! » et dessiné {w:animal}. Je l'ai accrochée au mur. Je la regarde tous les soirs.",
      ],
      en: [
        "I finally got mail in prison. It was an ad for above-ground pools. I read the catalog eleven times.",
        "My prison pen pal wrote me eight pages about his cat. I now know that cat better than my own family.",
        "Mom sent me a care package. Inside: {w:food}, a photo of her posing with {w:animal} and a letter that begins 'I'm not angry, I'm disappointed.' Everything had been opened and tasted by the guards.",
        "I got a letter from a fan asking for a lock of my hair and my opinion on {w:show}. The guards read it before me and underlined the mistakes. There were [[twelve|twenty-three|forty]].",
        "Today's mail: a postcard sent from {w:far_place} by a former cellmate. All he wrote was 'Freedom!' plus a drawing of {w:animal}. I pinned it to the wall. I look at it every night.",
      ],
    },
    fx: { happy: 2 },
  },
  {
    id: 'cr_auto_ramen',
    icon: '🍜',
    cat: 'prison',
    auto: true,
    cooldown: 3,
    when: { prison: true },
    text: {
      fr: [
        "En prison, les nouilles instantanées servent de monnaie. J'ai économisé 40 sachets. Je suis le banquier central de l'aile B.",
        "J'ai échangé trois sachets de soupe contre une paire de chaussettes propres et un secret. Le secret était décevant. Les chaussettes, non.",
        "J'ai troqué [[cinq|huit|douze]] sachets de nouilles contre {w:object}, une création artisanale de l'aile C. Je ne sais pas à quoi ça sert, mais tout le monde en veut un. Je suis un investisseur.",
        "Krach boursier dans l'aile B : quelqu'un a fait entrer {w:food} en douce et les nouilles ont perdu la moitié de leur valeur. Mon épargne s'est effondrée. J'ai mangé mes économies.",
        "J'ai inventé une recette secrète : nouilles instantanées, chips écrasées et un ingrédient secret : {w:food}. On me paie en sachets pour une portion. Je suis le chef étoilé du bloc.",
      ],
      en: [
        "In prison, instant noodles are currency. I've saved up 40 packs. I am the Federal Reserve of B Block.",
        "I traded three soup packets for a pair of clean socks and a secret. The secret was disappointing. The socks were not.",
        "I traded [[five|eight|twelve]] noodle packs for {w:object}, an artisanal creation from C Block. No idea what it's for, but everyone wants one. I'm an investor.",
        "Stock market crash in B Block: someone smuggled in {w:food} and noodles lost half their value. My savings collapsed. I ate my nest egg.",
        "I invented a secret recipe: instant noodles, crushed chips and a secret ingredient: {w:food}. People pay me in packets for a serving. I'm the Michelin-star chef of the block.",
      ],
    },
    fx: { happy: 3 },
  },
  {
    id: 'cr_auto_snore',
    icon: '😴',
    cat: 'prison',
    rating: 1,
    auto: true,
    cooldown: 3,
    when: { prison: true },
    text: {
      fr: [
        "Mon codétenu ronfle comme un tracteur qui s'accouple avec une tronçonneuse. J'ai dormi quatre heures cette année. Au total.",
        "Le détenu d'à côté chante du Johnny toute la nuit. Faux. Je commence à comprendre pourquoi il a pris perpète.",
        "Mon codétenu fait {w:sound} en dormant, toutes les nuits, à heure fixe. J'ai essayé les boules Quies, {w:object} et la prière. Rien ne marche. Je dors debout pendant la promenade.",
        "Le type de la cellule d'en face parle en dormant. Cette nuit, il a avoué {w:crime_small}, puis {w:crime_small}. Je prends des notes. Ça peut servir.",
        "Mon voisin de cellule pète comme {w:vehicle} qui démarre un matin d'hiver, [[trois|sept|douze]] fois par nuit. Toute l'aile dégage {w:smell}. Les gardiens font leur ronde avec un masque.",
      ],
      en: [
        "My cellmate snores like a tractor mating with a chainsaw. I slept four hours this year. Total.",
        "The guy in the next cell sings power ballads all night. Off-key. I'm starting to understand why he got life.",
        "My cellmate makes {w:sound} in his sleep, every night, like clockwork. I tried earplugs, {w:object} and prayer. Nothing works. I sleep standing up in the yard.",
        "The guy across the hall talks in his sleep. Last night he confessed to {w:crime_small}, then to {w:crime_small}. I'm taking notes. Could come in handy.",
        "My cell neighbor farts like {w:vehicle} starting on a winter morning, [[three|seven|twelve]] times a night. The entire wing gives off {w:smell}. The guards do their rounds wearing masks.",
      ],
    },
    fx: { happy: -3, health: -1, stress: 3 },
  },
  {
    id: 'cr_auto_food_poison',
    icon: '🤮',
    cat: 'prison',
    rating: 2,
    auto: true,
    cooldown: 4,
    when: { prison: true },
    text: {
      fr: [
        "Le « bœuf bourguignon » de la cantine bougeait encore. J'ai passé trois jours sur le trône de la cellule, sous les yeux de mon codétenu, à évacuer l'enfer par les deux bouts.",
        "J'ai trouvé une dent dans mon hachis parmentier. Pas la mienne. J'ai vomi si fort qu'un petit pois est ressorti par mon nez.",
      ],
      en: [
        "The cafeteria “beef stew” was still moving. I spent three days on the cell toilet, in full view of my cellmate, expelling hell from both ends.",
        "I found a tooth in my shepherd's pie. Not mine. I puked so hard a pea came out of my nose.",
      ],
    },
    fx: { disease: 'food_poisoning', health: -6, happy: -5, visual: 'poop' },
  },
  {
    id: 'cr_auto_cop_stare',
    icon: '🚓',
    cat: 'crime',
    rating: 1,
    auto: true,
    cooldown: 3,
    when: { age: [14, 99], counter: { crimes: [3, 999] } },
    text: {
      fr: [
        "Une voiture de police a ralenti à ma hauteur. Le flic m'a fixé{|e} en mâchant son chewing-gum. J'ai fait semblant de relacer une chaussure à scratch.",
        "J'ai sursauté en entendant une sirène. C'était une ambulance. Puis un camion de glaces. J'ai la conscience un peu chargée.",
        "Un flic m'a dévisagé{|e} {w:at_place} pendant [[dix|trente|quarante-cinq]] secondes. J'ai acheté {w:food} pour avoir l'air normal{|e}. Je déteste ça. J'ai tout mangé quand même.",
        "Un policier m'a demandé l'heure dans la rue. J'ai paniqué, j'ai dit « {w:excuse} » et je suis parti{|e} en courant. Il m'a regardé{|e} partir sans comprendre. Moi non plus.",
        "Une voiture de police s'est garée derrière {w:vehicle}, juste à côté de moi. Mon cœur a fait {w:sound}. Les flics sont descendus acheter des donuts. J'ai mis deux heures à m'en remettre.",
      ],
      en: [
        "A cop car slowed down next to me. The officer stared, chewing gum. I pretended to tie a Velcro shoe.",
        "I jumped at the sound of a siren. It was an ambulance. Then an ice cream truck. My conscience is a little loaded.",
        "A cop stared at me {w:at_place} for [[ten|thirty|forty-five]] seconds. I bought {w:food} to look normal. I hate that stuff. I ate it all anyway.",
        "A cop asked me for the time on the street. I panicked, said '{w:excuse}' and ran off. He watched me go, confused. So was I.",
        "A police car parked behind {w:vehicle}, right next to me. My heart made {w:sound}. The cops got out to buy donuts. It took me two hours to recover.",
      ],
    },
    fx: { stress: 4 },
  },
  {
    id: 'cr_auto_hood_news',
    icon: '📰',
    cat: 'crime',
    rating: 2,
    auto: true,
    cooldown: 4,
    when: { age: [14, 99] },
    text: {
      fr: [
        "Un type a été arrêté dans ma rue en slip, couvert de pâte à tartiner, en hurlant qu'il était le Messie. Il a mordu un policier. Le policier a dit : « Hmm. Noisette. »",
        "Le dealer de mon quartier a lancé une carte de fidélité : dix achats, le onzième offert. Le capitalisme a gagné, même là.",
        "Fait divers du quartier : un mec bourré a volé {w:vehicle}, l'a conduit dans la fontaine, puis s'est endormi dedans en chantant {w:song}. Les flics ont attendu la fin du couplet pour l'arrêter.",
        "Dans ma rue, une mamie a mis en fuite un cambrioleur en lui balançant {w:object} à la tête. Il a fini aux urgences avec {w:bodypart} en vrac. Elle a fini dans le journal, en photo, avec le pouce levé.",
        "Les nouvelles du quartier : un type a été arrêté avec [[douze|quarante|cent]] kilos d'une substance inconnue. Le labo a analysé : c'était {w:gross}. Le technicien a démissionné. {w:swear}",
      ],
      en: [
        "A guy was arrested on my street in his underwear, covered in chocolate spread, screaming he was the Messiah. He bit a cop. The cop said: “Hmm. Hazelnut.”",
        "The neighborhood dealer launched a loyalty card: buy ten, get the eleventh free. Capitalism wins, even there.",
        "Local news: a drunk guy stole {w:vehicle}, drove it into the fountain, then fell asleep in it singing {w:song}. The cops waited for the end of the verse to arrest him.",
        "On my street, a granny chased off a burglar by hurling {w:object} at his head. He ended up in the ER with a wrecked {w:bodypart}. She ended up in the paper, photographed with a thumbs-up.",
        "Neighborhood news: a guy was arrested with [[twelve|forty|a hundred]] kilos of an unknown substance. The lab analyzed it: it was {w:gross}. The technician quit. {w:swear}",
      ],
    },
    fx: { happy: 3 },
  },

  // ───────────────────────────── prison: cell life ─────────────────────────────
  {
    id: 'cr_cellmate_intro',
    icon: '🛏️',
    cat: 'prison',
    scene: { place: 'prison', mood: 'neutral' },
    when: { prison: true },
    cooldown: 3,
    actor: CELLMATE,
    text: {
      fr: [
        "Ton nouveau codétenu, {a.first}, pose son baluchon sur la couchette du haut. {a:Il|Elle} te fixe longuement, puis demande si tu préfères le côté fenêtre. Il n'y a pas de fenêtre.",
        "{a.first} débarque dans ta cellule avec une plante verte en pot et un sourire inquiétant. « On va bien s'entendre, toi et moi. » La plante a l'air sceptique.",
        "Nouveau{a:|lle} codétenu{a:|e} : {a.first}, condamné{a:|e} pour {w:crime_small} en récidive. {a:Il|Elle} déballe {w:object} et le pose sur ton étagère. « Ça, c'est chez moi. »",
        "{a.first} entre dans la cellule en fredonnant {w:song}. {a:Il|Elle} dégage {w:smell} et te tend la main. « Appelle-moi {w:nickname}. Tout le monde le fait. Ceux qui ne le font pas… » {a:Il|Elle} ne finit pas sa phrase.",
        "Ton nouveau colocataire carcéral, {a.first}, s'installe avec {w:object}, [[trois|cinq|onze]] paquets de cartes et un regard de joueur professionnel. « Tu joues au poker ? Non ? Tu vas apprendre. »",
      ],
      en: [
        "Your new cellmate, {a.first}, drops a bundle on the top bunk, stares at you for a long time, then asks if you prefer the window side. There is no window.",
        "{a.first} moves into your cell with a potted plant and an unsettling smile. “We're gonna get along just fine.” The plant looks skeptical.",
        "New cellmate: {a.first}, a repeat offender convicted of {w:crime_small}. {a:He|She} unpacks {w:object} and sets it on your shelf. 'That's my spot.'",
        "{a.first} walks into the cell humming {w:song}. {a:He|She} gives off {w:smell} and holds out a hand. 'Call me {w:nickname}. Everyone does. The ones who don't…' {a:He|She} doesn't finish the sentence.",
        "Your new prison roommate, {a.first}, settles in with {w:object}, [[three|five|eleven]] decks of cards and the eyes of a professional gambler. 'You play poker? No? You'll learn.'",
      ],
    },
    choices: [
      {
        label: { fr: 'Sympathiser', en: 'Make friends' },
        out: [
          { w: 3, text: { fr: ["J'ai partagé mes nouilles avec {a.first}. On a parlé jusqu'à 3 h du matin de nos procès respectifs. J'ai {a:un|une} pote. Derrière des barreaux, mais {a:un|une} pote.", "J'ai offert à {a.first} un sachet de nouilles en signe de paix. On a découvert qu'on aimait tous les deux {w:hobby}. On prépare un club en cellule. Deux membres. Très sélect."], en: ["I shared my noodles with {a.first}. We talked until 3 a.m. about our trials. I have a buddy. Behind bars, but a buddy.", "I gave {a.first} a noodle packet as a peace offering. Turns out we both love {w:hobby}. We're starting a club in our cell. Two members. Very exclusive."] }, fx: { happy: 6, rel: 20, actorRole: 'friend' }, mood: 'happy' },
          { w: 1, text: { fr: ["{a.first} m'a raconté sa vie pendant six heures. Toute sa vie. Depuis la maternelle. J'ai demandé un transfert de cellule par écrit, en trois exemplaires.", "J'ai voulu sympathiser. {a.first} m'a expliqué {w:conspiracy}, puis m'a demandé de signer une pétition. J'ai signé. Je ne sais pas ce que j'ai signé."], en: ["{a.first} told me their life story for six hours. All of it. Starting from kindergarten. I requested a cell transfer in writing, in triplicate.", "I tried to be friendly. {a.first} explained {w:conspiracy}, then asked me to sign a petition. I signed. I don't know what I signed."] }, fx: { happy: -4, stress: 4 }, mood: 'sleepy' },
        ],
      },
      {
        label: { fr: 'Marquer mon territoire', en: 'Establish dominance' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: ["J'ai balancé le baluchon de {a.first} par terre pour montrer qui commande. {a:Il|Elle} a compris. {a:Il|Elle} fait mon lit tous les matins depuis.", "J'ai posé mes règles : la couchette du bas est à moi, la ventilation aussi. {a.first} a hoché la tête sans un mot. Le lendemain, {a:il|elle} m'appelait « chef »."], en: ["I threw {a.first}'s bundle on the floor to show who's boss. Message received. {a:He|She} has made my bed every morning since.", "I laid down the rules: bottom bunk is mine, so is the air vent. {a.first} nodded silently. The next day, {a:he|she} was calling me 'boss'."] }, fx: { happy: 4, rel: -10 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai voulu jouer les caïds. {a.first} m'a fait une clé de bras en me demandant poliment d'arrêter. J'ai arrêté. Très poliment aussi.", "J'ai montré les dents. {a.first} a souri, a plié {w:object} à mains nues et m'a demandé si j'avais autre chose à dire. Je n'avais rien d'autre à dire."], en: ["I tried to act tough. {a.first} put me in an armlock and politely asked me to stop. I stopped. Very politely.", "I bared my teeth. {a.first} smiled, bent {w:object} with bare hands and asked if I had anything else to say. I didn't."] }, fx: { health: -6, happy: -5 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Ignorer', en: 'Ignore them' },
        text: { fr: ["J'ai tourné le dos à {a.first} et fixé le mur pendant trois semaines. Le mur et moi sommes très proches, maintenant.", "J'ai ignoré {a.first}. {a:Il|Elle} a fini par parler à sa plante. Puis la plante a fini par me parler à moi. Je ne dors plus très bien."], en: ["I turned my back on {a.first} and stared at the wall for three weeks. The wall and I are very close now.", "I ignored {a.first}. {a:He|She} ended up talking to the plant. Then the plant started talking to me. I don't sleep well anymore."] },
        fx: { happy: -2 },
      },
    ],
  },
  {
    id: 'cr_visit_lover',
    icon: '💌',
    cat: 'prison',
    scene: { place: 'prison', mood: 'love' },
    when: { prison: true, age: [16, 120] },
    cooldown: 2,
    actor: 'lover',
    text: {
      fr: [
        "{a.first} est venu{a:|e} au parloir. {a:Il|Elle} a mis sa plus belle tenue et pleure déjà derrière la vitre en plexiglas.",
        "Parloir : {a.first} te fait coucou derrière la vitre. {a:Il|Elle} a apporté une photo de votre canapé, parce que le canapé te manque.",
      ],
      en: [
        "{a.first} came to the visiting room. {a:He|She} wore {a.his} best outfit and is already crying behind the plexiglass.",
        "Visiting hours: {a.first} waves at you through the glass. {a:He|She} brought a photo of your couch, because you miss the couch.",
      ],
    },
    choices: [
      {
        label: { fr: 'Promettre de changer', en: 'Promise to change' },
        text: { fr: "J'ai juré à {a.first} que j'allais changer. {a:Il|Elle} a collé sa main contre la vitre. Le gardien a nettoyé les traces de doigts en soupirant.", en: "I swore to {a.first} I'd change. {a:He|She} pressed a hand against the glass. The guard wiped off the fingerprints with a sigh." },
        fx: { rel: 10, happy: 6, karma: 2 },
        mood: 'love',
      },
      {
        label: { fr: "Demander d'attendre", en: 'Ask them to wait' },
        out: [
          { w: 2, text: { fr: "{a.first} a promis de m'attendre. On a calculé : je sortirai avant le prochain téléphone à la mode, mais pas de beaucoup.", en: "{a.first} promised to wait for me. We did the math: I'll be out before the next phone model, but not by much." }, fx: { rel: 5, happy: 5 }, mood: 'love' },
          { w: 1, text: { fr: "{a.first} a pris une grande inspiration et m'a quitté{|e} par interphone. Le gardien a fait « aïe » à ma place.", en: "{a.first} took a deep breath and dumped me over the intercom. The guard went “ouch” on my behalf." }, fx: { actorRole: 'ex', happy: -15, rel: -30 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Parler logistique', en: 'Talk logistics' },
        text: { fr: "J'ai passé tout le parloir à demander à {a.first} d'arroser mes plantes et de payer mes amendes. Le romantisme est mort, mais mes plantes vivent.", en: "I spent the whole visit asking {a.first} to water my plants and pay my fines. Romance is dead, but my plants are alive." },
        fx: { rel: -5, stress: -3 },
      },
    ],
  },
  {
    id: 'cr_visit_parent',
    icon: '🎂',
    cat: 'prison',
    scene: { place: 'prison', mood: 'sad' },
    when: { prison: true },
    cooldown: 3,
    actor: 'parent',
    text: {
      fr: [
        "{a.rel} est venu{a:|e} au parloir avec un gâteau fait maison. Le gardien l'inspecte avec la méfiance d'un douanier devant une valise qui fait tic-tac.",
        "Visite surprise : {a.rel} est là, avec un gâteau au chocolat et la tête de quelqu'un qui a beaucoup répété son sermon dans la voiture.",
      ],
      en: [
        "{a.rel} came to visit with a homemade cake. The guard inspects it like a customs officer facing a ticking suitcase.",
        "Surprise visit: {a.rel} is here, with a chocolate cake and the face of someone who rehearsed a lecture the whole drive.",
      ],
    },
    choices: [
      {
        label: { fr: 'Manger le gâteau', en: 'Eat the cake' },
        out: [
          { w: 3, text: { fr: "Le gâteau était délicieux. Pas de lime dedans. Juste de l'amour et beaucoup trop de beurre.", en: "The cake was delicious. No file inside. Just love and way too much butter." }, fx: { rel: 8, happy: 6 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai croqué dans le gâteau : il y avait une lime à ongles dedans. J'ai levé les yeux vers {a.my}, qui m'a fait un clin d'œil. Le gardien aussi a vu le clin d'œil. Un an de plus.", en: "I bit into the cake: there was a nail file inside. I looked up at {a.my}, who winked. The guard saw the wink too. One more year." }, fx: { jail: 1, rel: 15, happy: -5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: "M'excuser", en: 'Apologize' },
        text: { fr: "J'ai demandé pardon. On m'a répondu : « Je ne suis pas fâché{a:|e}, je suis déçu{a:|e}. » C'est pire. C'est toujours pire.", en: "I apologized. The answer: “I'm not angry, I'm disappointed.” That's worse. It's always worse." },
        fx: { rel: 10, happy: -2, karma: 3 },
      },
      {
        label: { fr: 'Râler sur la bouffe', en: 'Complain about food' },
        text: { fr: "J'ai passé tout le parloir à critiquer la cantine. Résultat : je me suis fait gronder en prison, par ma famille, sur mon manque de gratitude. Un exploit.", en: "I spent the whole visit trashing the cafeteria. Result: I got scolded in prison, by family, for being ungrateful. Quite the achievement." },
        fx: { rel: -6, happy: 1 },
      },
    ],
  },
  {
    id: 'cr_prison_job',
    icon: '🔧',
    cat: 'prison',
    scene: { place: 'prison', mood: 'neutral' },
    when: { prison: true },
    cooldown: 3,
    vars: { amount: [10, 60] },
    text: {
      fr: [
        "L'administration te propose un boulot : fabriquer des plaques d'immatriculation pour trois fois rien de l'heure, éplucher des patates en cuisine, ou plier des draps à la buanderie.",
        "Le directeur affiche les postes disponibles : atelier plaques, cuisine, ou rien. « Rien » est le poste le plus demandé.",
        "Offre d'emploi au parloir : atelier plaques, cuisine ou glandouille. Le dernier détenu de la cuisine a été viré pour avoir servi {w:food} à tout le monde trois jours de suite. Le poste est libre.",
        "Le surveillant chef passe dans les cellules avec un formulaire. « Plaques, cuisine, ou tu restes à {w:activity} toute la journée ? » Le salaire : [[30 centimes|50 centimes|un euro]] de l'heure. La gloire.",
        "Les postes de travail sont affichés à côté d'une photo où {w:celeb} serre la main du directeur. Plaques d'immatriculation ou cuisine. Le détenu derrière toi dit que la cuisine, « c'est là qu'on mange en douce ».",
      ],
      en: [
        "The administration offers you a job: stamping license plates for pennies an hour, peeling potatoes in the kitchen, or folding sheets in the laundry.",
        "The warden posts the available jobs: license plates, kitchen, or nothing. “Nothing” is the most popular position.",
        "Job posting in the visiting room: license plates, kitchen, or slacking off. The last kitchen inmate got fired for serving {w:food} to everyone three days straight. The spot is open.",
        "The head guard comes around with a form. 'License plates, kitchen, or you sit around {w:activity} all day?' Pay: [[30 cents|50 cents|a dollar]] an hour. Glory.",
        "The job openings are posted next to a photo of {w:celeb} shaking the warden's hand. License plates or kitchen. The inmate behind you says the kitchen is 'where you sneak food'.",
      ],
    },
    choices: [
      {
        label: { fr: "Plaques d'immatriculation", en: 'License plates' },
        text: { fr: ["J'ai fabriqué 4 000 plaques. J'ai gagné {$amount} et je reconnais maintenant chaque voiture que j'ai fabriquée dans les séries policières.", "J'ai tamponné des plaques toute l'année pour {$amount}. J'ai glissé mes initiales dans un numéro. Quelque part, {w:vehicle} roule avec ma signature."], en: ["I stamped 4,000 plates. I earned {$amount}, and now I recognize my own work in every cop show.", "I stamped plates all year for {$amount}. I slipped my initials into one number. Somewhere, {w:vehicle} is driving around with my signature."] },
        fx: { money: 'amount', discipline: 3, counter: 'prisonGood' },
      },
      {
        label: { fr: 'Cuisine', en: 'Kitchen' },
        out: [
          { w: 2, text: { fr: ["J'ai épluché des patates. Énormément de patates. J'en rêve la nuit. Elles ont des visages. Mais j'ai gagné {$amount}.", "J'ai bossé en cuisine. J'ai gagné {$amount} et le respect de tout le bloc grâce à ma sauce secrète. Le secret : on y écrase {w:food}."], en: ["I peeled potatoes. So many potatoes. I dream about them. They have faces. But I earned {$amount}.", "I worked in the kitchen. I earned {$amount} and the whole block's respect thanks to my secret sauce. The secret: you crush {w:food} into it."] }, fx: { money: 'amount', discipline: 2, counter: 'prisonGood' } },
          { w: 1, text: { fr: ["J'ai mis du sucre à la place du sel dans la soupe de 600 détenus. Mutinerie évitée de justesse. Renvoyé{|e} de la cuisine le soir même.", "J'ai fait brûler le ragoût de tout le bloc. L'alarme incendie a sonné pendant [[une heure|deux heures|toute la nuit]]. Viré{|e} de la cuisine et surnommé{|e} « le Pyromane » à vie."], en: ["I used sugar instead of salt in soup for 600 inmates. A riot was narrowly avoided. Fired from the kitchen that night.", "I burned the stew for the whole block. The fire alarm rang for [[an hour|two hours|the whole night]]. Fired from the kitchen and nicknamed 'the Arsonist' for life."] }, fx: { happy: -3, stress: 5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Refuser', en: 'Refuse' },
        text: { fr: ["J'ai refusé de travailler. J'ai droit au repos. Et j'ai beaucoup de temps pour le prendre.", "J'ai refusé. J'ai passé l'année à {w:activity} sur ma couchette. Productivité : zéro. Paix intérieure : maximale."], en: ["I refused to work. I'm entitled to rest. And I have a lot of time to take it.", "I refused. I spent the year {w:activity} on my bunk. Productivity: zero. Inner peace: maximum."] },
        fx: { happy: 2, discipline: -3 },
      },
    ],
  },
  {
    id: 'cr_therapy',
    icon: '🗣️',
    cat: 'prison',
    scene: { place: 'prison', mood: 'neutral' },
    when: { prison: true },
    cooldown: 3,
    text: {
      fr: [
        "Séance de thérapie de groupe. La psy te tend le « bâton de parole », un bout de bois décoré de gommettes. Douze détenus tatoués attendent que tu partages tes émotions.",
        "Atelier « Gestion de la colère ». Le type assis à ta gauche a cassé sa chaise en arrivant. La psy sourit nerveusement et te donne la parole.",
        "Thérapie de groupe. Aujourd'hui, chacun doit dire quel animal il serait. Le braqueur à ta droite a dit {w:animal}, en pleurant. C'est ton tour. Tout le monde te regarde.",
        "Séance de thérapie. La psy a apporté {w:object} « pour libérer les émotions ». Un détenu s'est déjà assis dessus. Elle passe la parole au suivant : toi. [[Douze|Quinze|Vingt]] paires d'yeux tatoués te fixent.",
        "Atelier « Parlons de nos mamans ». La psy met {w:song} en fond sonore pour détendre l'atmosphère. Ça ne marche pas. Un colosse pleure déjà dans sa capuche. À toi.",
      ],
      en: [
        "Group therapy. The counselor hands you the “talking stick,” a piece of wood decorated with stickers. Twelve tattooed inmates wait for you to share your feelings.",
        "Anger management class. The guy to your left broke his chair sitting down. The counselor smiles nervously and gives you the floor.",
        "Group therapy. Today, everyone has to say what animal they'd be. The armed robber on your right said {w:animal}, in tears. It's your turn. Everyone's staring.",
        "Therapy session. The counselor brought {w:object} 'to release emotions'. An inmate already sat on it. She passes the floor to the next person: you. [[Twelve|Fifteen|Twenty]] pairs of tattooed eyes stare at you.",
        "'Let's Talk About Our Moms' workshop. The counselor plays {w:song} in the background to ease the mood. It's not working. A giant is already crying into his hoodie. Your turn.",
      ],
    },
    choices: [
      {
        label: { fr: 'Vider mon sac', en: 'Open up' },
        out: [
          { w: 2, text: { fr: ["J'ai parlé de mon enfance, de mes choix, de mes regrets. Un braqueur de deux mètres m'a pris dans ses bras en reniflant. Progrès.", "J'ai tout déballé : mon enfance, mes erreurs, la fois où j'ai pleuré devant {w:movie}. Toute la salle a applaudi. Un tueur à gages m'a donné son mouchoir."], en: ["I talked about my childhood, my choices, my regrets. A seven-foot armed robber hugged me, sniffling. Progress.", "I unloaded everything: my childhood, my mistakes, the time I cried at {w:movie}. The whole room applauded. A hitman gave me his tissue."] }, fx: { happy: 6, stress: -8, karma: 2, counter: 'prisonGood' }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai ouvert mon cœur. Un détenu a tout répété dans la cour. Mes traumatismes s'échangent maintenant contre des cigarettes.", "J'ai partagé mes peurs les plus intimes. Le lendemain, tout le bloc m'appelait « {w:nickname} ». Je ne parlerai plus jamais de mes émotions."], en: ["I opened my heart. An inmate repeated everything in the yard. My traumas are now traded for cigarettes.", "I shared my deepest fears. The next day, the whole block was calling me '{w:nickname}'. I'll never talk about my feelings again."] }, fx: { happy: -5, stress: 5 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Inventer une histoire', en: 'Make something up' },
        text: { fr: ["J'ai raconté que j'étais un ancien agent secret. La psy a pris des notes. Trois détenus m'ont demandé un autographe.", "J'ai inventé que j'avais été {w:weird_job} avant la prison, et que tout avait dérapé à cause d'un client. La psy a été très touchée. Le groupe aussi. C'était l'intrigue de {w:movie}."], en: ["I said I used to be a secret agent. The counselor took notes. Three inmates asked for my autograph.", "I made up that I'd been {w:weird_job} before prison, and that it all went wrong because of a client. The counselor was very moved. So was the group. It was the plot of {w:movie}."] },
        fx: { smarts: 1, happy: 3 },
      },
      {
        label: { fr: 'Me taire', en: 'Stay silent' },
        text: { fr: ["J'ai gardé le silence pendant une heure. La psy a écrit « progrès lents » dans mon dossier et dessiné un petit nuage triste à côté.", "Je me suis tu{|e}. Le silence a duré si longtemps que le colosse à côté de moi s'est endormi sur mon épaule. Je n'ai pas bougé. C'était presque thérapeutique."], en: ["I stayed silent for an hour. The counselor wrote “slow progress” in my file and drew a little sad cloud next to it.", "I said nothing. The silence lasted so long the giant next to me fell asleep on my shoulder. I didn't move. It was almost therapeutic."] },
        fx: { happy: -1 },
      },
    ],
  },
  {
    id: 'cr_library',
    icon: '📚',
    cat: 'prison',
    scene: { place: 'prison', mood: 'neutral' },
    when: { prison: true },
    cooldown: 3,
    text: {
      fr: [
        "La bibliothèque de la prison compte 312 livres, dont 40 exemplaires du même polar et un code pénal annoté au feutre par un détenu très en colère.",
        "Le bibliothécaire de la prison, un faussaire à la retraite, te recommande « un classique ». Il te tend un magazine de déco de 1997.",
        "Bibliothèque de la prison. Le rayon « Évasion » est vide, évidemment. Il reste un code pénal, 40 exemplaires d'un polar, un guide sur {w:hobby} et un vieux magazine de déco. Le bibliothécaire te fixe.",
        "Le bibliothécaire de la prison, condamné pour {w:crime_small}, te recommande ses trois livres préférés : le code pénal, un polar dont il a déchiré la fin, et un magazine de déco de 1997. « Choisis bien. »",
        "Jour de bibliothèque. Ça dégage {w:smell} et le vieux papier. Sur la table : un code pénal annoté, [[quarante|trente-neuf|quarante et un]] exemplaires du même polar, et un magazine de déco de 1997 avec {w:celeb} en couverture.",
      ],
      en: [
        "The prison library has 312 books, including 40 copies of the same thriller and a criminal code annotated in marker by a very angry inmate.",
        "The prison librarian, a retired forger, recommends “a classic.” He hands you a 1997 home decor magazine.",
        "Prison library. The 'Escape' section is empty, obviously. What's left: a criminal code, 40 copies of a thriller, a guide to {w:hobby} and an old decor magazine. The librarian is watching you.",
        "The prison librarian, convicted of {w:crime_small}, recommends his three favorite books: the criminal code, a thriller whose ending he tore out, and a 1997 decor magazine. 'Choose wisely.'",
        "Library day. It gives off {w:smell} and old paper. On the table: an annotated criminal code, [[forty|thirty-nine|forty-one]] copies of the same thriller, and a 1997 decor magazine with {w:celeb} on the cover.",
      ],
    },
    choices: [
      {
        label: { fr: 'Étudier le droit', en: 'Study law' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai dévoré le code pénal. J'ai trouvé trois vices de procédure dans mon dossier et une faute de frappe dans mon nom. Mon avocat ne m'avait rien dit. Mon avocat ne m'a jamais rien dit.", "J'ai étudié le droit jour et nuit. Maintenant, je donne des consultations juridiques dans la cour contre des sachets de nouilles. J'ai [[douze|vingt|trente]] clients et zéro diplôme."], en: ["I devoured the criminal code. I found three procedural errors in my case and a typo in my name. My lawyer never told me. My lawyer never told me anything.", "I studied law day and night. Now I give legal consultations in the yard for noodle packets. I have [[twelve|twenty|thirty]] clients and zero degrees."] }, fx: { smarts: 6, flag: 'cr_jailhouse_lawyer' }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai lu le code pénal en entier. Conclusion : je suis encore plus coupable que je ne le pensais.", "J'ai essayé de lire le code pénal. Je me suis endormi{|e} à la page 4, la bouche ouverte, et j'ai bavé sur l'article 311. Le bibliothécaire m'a fait payer l'amende en nouilles."], en: ["I read the entire criminal code. Conclusion: I'm even guiltier than I thought.", "I tried to read the criminal code. I fell asleep on page 4, mouth open, and drooled on section 311. The librarian fined me in noodles."] }, fx: { smarts: 4, happy: -3 } },
        ],
      },
      {
        label: { fr: 'Lire le polar', en: 'Read the thriller' },
        text: { fr: ["J'ai lu les 40 exemplaires du même polar, au cas où la fin changerait. C'est toujours le jardinier.", "J'ai lu le polar. Le coupable, c'est le jardinier. J'ai écrit une suite où le jardinier s'évade. Elle circule dans tout le bloc. Les gardiens l'ont confisquée « par précaution »."], en: ["I read all 40 copies of the same thriller, in case the ending changed. It's always the gardener.", "I read the thriller. The gardener did it. I wrote a sequel where the gardener escapes. It's circulating through the whole block. The guards confiscated it 'as a precaution'."] },
        fx: { happy: 4, smarts: 2 },
      },
      {
        label: { fr: 'Le magazine de 1997', en: 'The 1997 magazine' },
        text: { fr: ["J'ai lu le magazine de déco de 1997. J'ai appris qu'il fallait absolument une lampe à lave et des rideaux en perles. Je sors avec un plan.", "J'ai lu le magazine de 1997 de la première à la dernière page. J'ai redécoré ma cellule avec {w:object} et du papier toilette. Mon codétenu dit que c'est « très feng shui »."], en: ["I read the 1997 decor magazine. I learned I absolutely need a lava lamp and beaded curtains. I'll walk out with a plan.", "I read the 1997 magazine cover to cover. I redecorated my cell with {w:object} and toilet paper. My cellmate says it's 'very feng shui'."] },
        fx: { happy: 2 },
      },
    ],
  },
  {
    id: 'cr_parole_nerves',
    icon: '📋',
    cat: 'prison',
    scene: { place: 'prison', mood: 'neutral' },
    when: { prison: true },
    cooldown: 2,
    text: {
      fr: [
        "Ton audience de libération conditionnelle approche. Tu répètes ton discours devant le « miroir » de la cellule, une plaque de métal tordue. Ton reflet a l'air coupable.",
        "La commission de libération conditionnelle se réunit bientôt. Tu as une chemise propre, un discours, et des aisselles qui transpirent rien qu'en y pensant.",
        "Audience de libération dans [[trois jours|une semaine|48 heures]]. Ton codétenu te conseille de dire que tu as découvert {w:hobby} pour « montrer que tu as changé ». Ta mère conseille de pleurer. Ton avocat ne répond plus.",
        "La commission t'attend demain. Tu as rédigé un discours de repentance sur {w:object} faute de papier. Il fait [[deux|six|onze]] pages. Tu le connais par cœur. Tu transpires quand même.",
        "Ta libération conditionnelle se joue cette semaine. Le dernier détenu à y être allé a dit « {w:excuse} » et a pris deux ans de plus. Tu as {w:smell} sous les bras rien que d'y penser.",
      ],
      en: [
        "Your parole hearing is coming up. You rehearse your speech in front of the cell “mirror,” a dented metal plate. Your reflection looks guilty.",
        "The parole board meets soon. You have a clean shirt, a speech, and armpits that sweat just thinking about it.",
        "Parole hearing in [[three days|a week|48 hours]]. Your cellmate advises you to say you've discovered {w:hobby} to 'show you've changed'. Your mom says to cry. Your lawyer stopped answering.",
        "The board expects you tomorrow. You wrote your remorse speech on {w:object} for lack of paper. It's [[two|six|eleven]] pages long. You know it by heart. You're sweating anyway.",
        "Your parole is decided this week. The last inmate who went said '{w:excuse}' and got two more years. Your armpits give off {w:smell} just thinking about it.",
      ],
    },
    choices: [
      {
        label: { fr: "Aller à l'audience", en: 'Go to the hearing' },
        text: { fr: ["J'ai mis ma chemise la moins orange, j'ai respiré un grand coup et je suis entré{|e} dans la salle.", "Je me suis coiffé{|e} avec de l'eau et du savon, j'ai serré les fesses et je suis entré{|e} devant la commission."], en: ["I put on my least orange shirt, took a deep breath and walked into the room.", "I styled my hair with water and soap, clenched everything and walked in to face the board."] },
        fx: { stress: 4, open: 'parole' },
      },
      {
        label: { fr: 'Citer la jurisprudence', en: 'Cite case law' },
        if: { flag: 'cr_jailhouse_lawyer' },
        text: { fr: ["J'ai cité trois arrêts de cour d'appel et un vice de procédure. La commission m'a regardé{|e} comme un chien qui parle. Ils ont accepté de m'écouter.", "J'ai sorti un classeur de jurisprudence annoté au stylo à bille. Le président de la commission a enlevé ses lunettes, impressionné. Ils m'ont laissé parler."], en: ["I cited three appellate rulings and a procedural flaw. The board looked at me like a talking dog. They agreed to hear me out.", "I pulled out a binder of case law annotated in ballpoint pen. The board chairman took off his glasses, impressed. They let me speak."] },
        fx: { smarts: 2, counter: 'prisonGood', open: 'parole' },
        mood: 'proud',
      },
      {
        label: { fr: 'Répéter encore', en: 'Rehearse more' },
        text: { fr: ["J'ai répété mon discours 300 fois. Mon codétenu le connaît par cœur et pleure à la fin, à chaque fois.", "J'ai répété encore et encore, devant le mur, les rats et le gardien de nuit. Le gardien m'a donné des conseils de diction. Il a fait du théâtre."], en: ["I rehearsed my speech 300 times. My cellmate knows it by heart and cries at the end every single time.", "I rehearsed again and again, in front of the wall, the rats and the night guard. The guard gave me diction tips. He used to do theater."] },
        fx: { counter: 'prisonGood', stress: -3, discipline: 2 },
      },
      {
        label: { fr: 'Paniquer', en: 'Panic' },
        text: { fr: ["J'ai fait une crise d'angoisse et respiré dans un sachet de chips vide pendant vingt minutes. Ça sentait le paprika. J'ai repoussé l'audience.", "J'ai paniqué si fort que j'ai oublié mon propre nom devant la porte. On a reporté l'audience. Je suis retourné{|e} en cellule en tremblant comme une feuille."], en: ["I had a panic attack and breathed into an empty chip bag for twenty minutes. It smelled like paprika. I postponed the hearing.", "I panicked so hard I forgot my own name at the door. They postponed the hearing. I went back to my cell shaking like a leaf."] },
        fx: { happy: -4, stress: 8 },
        mood: 'shock',
      },
    ],
  },
  {
    id: 'cr_barber',
    icon: '💈',
    cat: 'prison',
    scene: { place: 'prison', mood: 'shock' },
    when: { prison: true },
    cooldown: 4,
    weight: 6,
    actor: CELLMATE,
    text: {
      fr: [
        "On t'a nommé{|e} barbier de la prison. Premier client : {a.first}, terreur de l'aile C, qui veut « juste rafraîchir les côtés ». Tes mains tremblent. Tes ciseaux sont en plastique.",
        "Le barbier de la prison a été libéré. Devine qui hérite de la tondeuse ? Et devine qui s'assoit en premier ? {a.first}, qui a mangé le dernier barbier. Selon la rumeur.",
        "Ton premier client au salon de la prison : {a.first}, qui te montre une photo où {w:celeb} pose fièrement et dit « comme ça ». Ta tondeuse fait {w:sound}. {a:Il|Elle} a [[deux|trois|onze]] cicatrices sur le crâne.",
        "Tu es le nouveau barbier du bloc. {a.first} s'assoit, croise les bras et dit : « Si tu me rates, je t'enferme avec {w:animal}… » Tu ne sais pas {a:s'il|si elle} plaisante. Tu ne veux pas savoir.",
        "Salon de coiffure de la prison. Ton outil : une tondeuse qui dégage {w:smell}. Ton client : {a.first}, qui veut « un dégradé américain ». Le dernier qui l'a raté travaille maintenant à la buanderie. Avec un œil au beurre noir.",
      ],
      en: [
        "You've been named prison barber. First client: {a.first}, terror of C Block, who wants “just a little off the sides.” Your hands shake. Your scissors are plastic.",
        "The prison barber got released. Guess who inherits the clippers? And guess who sits down first? {a.first}, who ate the last barber. Allegedly.",
        "Your first client at the prison salon: {a.first}, who shows you a photo of {w:celeb} posing proudly and says 'like that'. Your clippers make {w:sound}. {a:He|She} has [[two|three|eleven]] scars on the scalp.",
        "You're the block's new barber. {a.first} sits down, crosses {a:his|her} arms and says: 'Mess this up and I'll lock you in with {w:animal}…' You can't tell if it's a joke. You don't want to know.",
        "Prison barbershop. Your tool: clippers giving off {w:smell}. Your client: {a.first}, who wants 'a fade'. The last guy who botched it now works in the laundry. With a black eye.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire de mon mieux', en: 'Do my best' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai fait à {a.first} un dégradé parfait. {a:Il|Elle} s'est admiré{a:|e} dans le dos d'une cuillère et a hoché la tête. J'ai désormais une clientèle et des privilèges.", "Coupe parfaite. {a.first} a pleuré d'émotion devant le miroir en métal. Désormais, on fait la queue devant ma cellule et on me paie avec {w:food}."], en: ["I gave {a.first} a perfect fade. {a:He|She} admired it in the back of a spoon and nodded. I now have a clientele and privileges.", "Perfect cut. {a.first} cried with emotion in front of the metal mirror. Now there's a line outside my cell and people pay me in {w:food}."] }, fx: { happy: 6, rel: 15, actorRole: 'friend', counter: 'prisonGood', flag: 'cr_barber' }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai raté le dégradé. {a.first} ressemble à un moine qui a perdu un pari. {a:Il|Elle} m'a regardé{|e} très longtemps. Je dors avec un œil ouvert.", "J'ai éternué en pleine coupe. {a.first} a maintenant une raie [[en zigzag|en forme d'éclair|qui fait le tour du crâne]]. {a:Il|Elle} dit que c'est volontaire. Tout le monde fait semblant de le croire."], en: ["I botched the fade. {a.first} looks like a monk who lost a bet. {a:He|She} stared at me for a long time. I now sleep with one eye open.", "I sneezed mid-cut. {a.first} now has a part [[in a zigzag|shaped like a lightning bolt|that goes all the way around the head]]. {a:He|She} says it's intentional. Everyone pretends to believe it."] }, fx: { actorRole: 'enemy', stress: 10, happy: -4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Proposer une crête', en: 'Suggest a mohawk' },
        text: { fr: ["J'ai convaincu {a.first} de tenter la crête. Une semaine plus tard, toute l'aile C porte une crête. Je suis un influenceur carcéral.", "J'ai proposé une crête à {a.first}. {a:Il|Elle} a accepté à condition qu'elle soit « style {w:band} ». Le résultat a lancé une mode. Les gardiens commencent à s'inquiéter."], en: ["I talked {a.first} into a mohawk. A week later, all of C Block has mohawks. I am a prison influencer.", "I suggested a mohawk to {a.first}. {a:He|She} agreed on the condition that it be '{w:band} style'. The result started a trend. The guards are getting worried."] },
        fx: { happy: 8, fame: 1, rel: 10, flag: 'cr_barber' },
        mood: 'happy',
      },
      {
        label: { fr: 'Démissionner', en: 'Quit' },
        text: { fr: ["J'ai rendu mes ciseaux avant d'avoir une erreur capillaire sur la conscience.", "J'ai démissionné avant même la première mèche. Mieux vaut vivre lâche que mourir coiffeur."], en: ["I handed back my scissors before I had a hair crime on my conscience.", "I quit before the first snip. Better to live a coward than die a hairdresser."] },
        fx: { happy: -1 },
      },
    ],
  },
  {
    id: 'cr_gang_recruit',
    icon: '🥄',
    cat: 'prison',
    rating: 1,
    scene: { place: 'prison', mood: 'shock' },
    when: { prison: true, noFlag: 'cr_gang' },
    cooldown: 4,
    actor: { create: { role: 'acquaintance', age: [-5, 15], gender: 'same' } },
    text: {
      fr: [
        "{a.first}, chef{a:|fe} des « Cuillères Noires », te coince à la laverie. Protection totale en échange de ta loyauté éternelle. Et de ton dessert. Tous les jours.",
        "Dans la cour, {a.first} et ses Cuillères Noires t'encerclent. « Ici, soit t'as un gang, soit t'es un repas. Choisis. »",
      ],
      en: [
        "{a.first}, leader of the “Black Spoons,” corners you in the laundry room. Total protection in exchange for eternal loyalty. And your dessert. Every day.",
        "In the yard, {a.first} and the Black Spoons surround you. “In here, either you've got a gang or you're lunch. Pick.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Rejoindre le gang', en: 'Join the gang' },
        text: { fr: "J'ai rejoint les Cuillères Noires. Rite d'initiation : manger une savonnette entière. Je rote des bulles, mais je suis protégé{|e}.", en: "I joined the Black Spoons. Initiation: eat an entire bar of soap. I burp bubbles, but I'm protected." },
        fx: { flag: 'cr_gang', happy: 3, health: -3, karma: -3, rel: 10 },
        mood: 'proud',
      },
      {
        label: { fr: 'Refuser poliment', en: 'Politely decline' },
        out: [
          { w: 2, text: { fr: "J'ai décliné poliment. {a.first} a hoché la tête, l'air vexé{a:|e}. Depuis, je dors avec mes chaussures.", en: "I politely declined. {a.first} nodded, looking offended. I've been sleeping with my shoes on ever since." }, fx: { stress: 6 } },
          { w: 1, text: { fr: "J'ai refusé. Le soir même, trois types m'ont « aidé{|e} » à descendre les escaliers. Plusieurs fois. Dans les deux sens.", en: "I said no. That night, three guys “helped” me down the stairs. Several times. In both directions." }, fx: { health: -12, actorRole: 'enemy' }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Demander à réfléchir', en: 'Ask for time' },
        text: { fr: "J'ai dit que je voulais réfléchir. {a.first} m'a laissé jusqu'à la fin de la soupe. J'ai mangé ma soupe très, très lentement.", en: "I said I needed to think. {a.first} gave me until I finished my soup. I ate that soup very, very slowly." },
        fx: { stress: 3 },
      },
    ],
  },
  {
    id: 'cr_escape_plan',
    icon: '🕳️',
    cat: 'prison',
    rating: 1,
    scene: { place: 'prison', mood: 'shock' },
    when: { prison: true, noFlag: 'cr_escape_plan' },
    cooldown: 4,
    weight: 6,
    actor: CELLMATE,
    text: {
      fr: [
        "{a.first}, ton codétenu, décolle le poster de dauphin au-dessus de son lit. Derrière : un trou. « Une cuillère par jour, on sort dans six ans. Ou deux, si tu creuses aussi. »",
        "{a.first} te montre une cuillère tordue et un sourire de génie du mal. « Le mur est en placo. Le directeur a économisé sur les travaux. On creuse ? »",
      ],
      en: [
        "{a.first}, your cellmate, peels back the dolphin poster above the bunk. Behind it: a hole. “One spoon a day, we're out in six years. Or two, if you dig too.”",
        "{a.first} shows you a bent spoon and an evil genius grin. “The wall's drywall. The warden cheaped out on construction. Shall we dig?”",
      ],
    },
    choices: [
      {
        label: { fr: 'Creuser avec lui', en: 'Start digging' },
        text: { fr: "J'ai commencé à creuser à la cuillère. Je cache les gravats dans mes chaussettes et je les sème dans la cour en marchant comme un pingouin.", en: "I started digging with a spoon. I hide the rubble in my socks and scatter it in the yard, walking like a penguin." },
        fx: { flag: 'cr_escape_plan', discipline: 3, stress: 4, rel: 10 },
        mood: 'proud',
      },
      {
        label: { fr: 'Le balancer', en: 'Rat them out' },
        text: { fr: "J'ai dénoncé {a.first} aux gardiens. {a:Il|Elle} a pris trois ans de plus. Moi, une barre chocolatée et une réputation de balance.", en: "I reported {a.first} to the guards. {a:He|She} got three more years. I got a candy bar and a reputation as a snitch." },
        fx: { counter: 'prisonGood', flag: 'cr_snitch', actorRole: 'enemy', karma: -5 },
      },
      {
        label: { fr: "Faire l'aveugle", en: 'Play dumb' },
        text: { fr: "J'ai fait comme si je n'avais rien vu. Toutes les nuits, j'entends {a.first} gratter. Comme une souris géante très déterminée.", en: "I pretended I saw nothing. Every night I hear {a.first} scratching. Like a giant, very determined mouse." },
        fx: { stress: 2 },
      },
    ],
  },
  {
    id: 'cr_snitch_offer',
    icon: '🐀',
    cat: 'prison',
    rating: 1,
    scene: { place: 'prison', mood: 'neutral' },
    when: { prison: true, noFlag: 'cr_snitch' },
    cooldown: 4,
    text: {
      fr: [
        "Le gardien-chef te convoque. « Qui planque les téléphones dans l'aile B ? Un nom, et ton dossier devient tout propre. Sinon, ta cellule risque d'avoir… une fuite. »",
        "Un gardien te glisse dans un couloir : « T'as l'air malin. Les gens malins, ils voient des choses. Et ils me les racontent. »",
      ],
      en: [
        "The head guard calls you in. “Who's hiding the phones in B Block? Give me a name and your file gets squeaky clean. Otherwise your cell might spring… a leak.”",
        "A guard corners you in a hallway: “You look smart. Smart people see things. And they tell me about them.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Donner un nom', en: 'Give a name' },
        out: [
          { w: 2, text: { fr: "J'ai donné un nom. Le gardien a tenu parole : bonne conduite notée au dossier. Mais dans la cour, les regards ont changé.", en: "I gave a name. The guard kept his word: good behavior noted in my file. But in the yard, the looks have changed." }, fx: { flag: 'cr_snitch', counter: 'prisonGood', karma: -6 } },
          { w: 1, text: { fr: "J'ai balancé un nom au hasard. C'était celui du gardien-chef lui-même. Long silence. Un mois de mitard pour « humour ».", en: "I blurted out a random name. It was the head guard's own. Long silence. A month in the hole for “comedy.”" }, fx: { stress: 8, happy: -5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Me taire', en: 'Say nothing' },
        text: { fr: "Je l'ai fixé sans un mot pendant cinq minutes. Il a fini par me renvoyer. Le lendemain, ma cellule avait effectivement une fuite. Elle sentait le pipi.", en: "I stared at him without a word for five minutes. He finally sent me away. The next day, my cell did have a leak. It smelled like pee." },
        fx: { happy: -4, karma: 2 },
      },
      {
        label: { fr: 'Inventer un complot', en: 'Invent a conspiracy' },
        text: { fr: "J'ai inventé un réseau international de trafic de chaussettes. Le gardien a pris des notes pendant une heure. Une enquête est ouverte.", en: "I made up an international sock-trafficking ring. The guard took notes for an hour. An investigation has been opened." },
        fx: { smarts: 2, happy: 5 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'cr_prison_wedding',
    icon: '💍',
    cat: 'prison',
    rating: 1,
    scene: { place: 'prison', mood: 'love', fx: 'hearts' },
    when: { prison: true, age: [18, 120], noHas: 'spouse' },
    once: true,
    weight: 4,
    actor: 'lover',
    text: {
      fr: [
        "{a.first} veut t'épouser. Ici. Dans la chapelle de la prison, entre un crucifix en contreplaqué et un gardien qui mâche un chewing-gum. Les alliances ont été fouillées deux fois.",
        "{a.first} a rempli 14 formulaires pour obtenir le droit de t'épouser en prison. Le 15e est un formulaire de mariage. Il ne manque que ta signature.",
      ],
      en: [
        "{a.first} wants to marry you. Here. In the prison chapel, between a plywood crucifix and a gum-chewing guard. The rings were searched twice.",
        "{a.first} filled out 14 forms for the right to marry you in prison. The 15th is the marriage license. It just needs your signature.",
      ],
    },
    choices: [
      {
        label: { fr: 'Dire oui', en: 'Say yes' },
        out: [
          { w: 3, text: { fr: "J'ai épousé {a.first} en combinaison orange. Un gardien a servi de témoin. La nuit de noces a duré 45 minutes, sur un matelas qui sentait la Javel, avec une caméra dans le coin.", en: "I married {a.first} in an orange jumpsuit. A guard was our witness. The wedding night lasted 45 minutes, on a mattress that smelled of bleach, with a camera in the corner." }, fx: { actorRole: 'spouse', happy: 15, rel: 20, flag: 'cr_prison_wed', visual: 'hearts' }, mood: 'love' },
          { w: 1, text: { fr: "On s'est dit oui. Pendant le baiser, l'alarme d'évasion a retenti et tout le monde s'est couché au sol. Nos photos de mariage montrent surtout du carrelage.", en: "We said “I do.” During the kiss, the escape alarm went off and everyone hit the floor. Our wedding photos are mostly tiles." }, fx: { actorRole: 'spouse', happy: 10, rel: 15, flag: 'cr_prison_wed' }, mood: 'love' },
        ],
      },
      {
        label: { fr: 'Attendre la sortie', en: 'Wait until release' },
        text: { fr: "J'ai dit à {a.first} que je voulais l'épouser dehors, au soleil, sans fouille au corps. {a:Il|Elle} a dit qu'{a:il|elle} attendrait. Je crois.", en: "I told {a.first} I wanted to marry outside, in the sun, without a strip search. {a:He|She} said {a:he|she}'d wait. I think." },
        fx: { rel: -3 },
      },
      {
        label: { fr: 'Refuser', en: 'Refuse' },
        text: { fr: "J'ai refusé. {a.first} a jeté le bouquet contre la vitre du parloir. Les pétales sont restés collés dessus pendant des semaines.", en: "I said no. {a.first} threw the bouquet at the visiting room glass. The petals stayed stuck there for weeks." },
        fx: { actorRole: 'ex', happy: -10, rel: -30 },
        mood: 'cry',
      },
    ],
  },
  {
    id: 'cr_hunger_strike',
    icon: '🍽️',
    cat: 'prison',
    rating: 1,
    scene: { place: 'prison', mood: 'angry' },
    when: { prison: true },
    cooldown: 5,
    text: {
      fr: [
        "Les détenus lancent une grève de la faim pour protester contre la gelée verte du jeudi. On compte sur ta solidarité. Et sur ton estomac.",
        "Grève de la faim générale : le directeur a supprimé le ketchup « pour raisons budgétaires ». Le même jour, il a changé de voiture.",
        "Le bloc entre en grève de la faim : la cantine a servi {w:food} [[six|neuf|quatorze]] jours d'affilée et ça commence à dégager {w:smell}. Les meneurs passent de cellule en cellule. Tu en es ?",
        "Grève de la faim ! La direction a remplacé le dessert du dimanche par {w:object}, « pour l'éducation ». Le mouvement prend de l'ampleur. Ton estomac fait déjà {w:sound}.",
        "Les détenus refusent de manger tant que la télé de la salle commune restera bloquée sur {w:show}. Ça fait trois jours. Certains ont déjà craqué et mangé leur savon. On attend ta décision.",
      ],
      en: [
        "The inmates are launching a hunger strike to protest Thursday's green jello. They're counting on your solidarity. And your stomach.",
        "General hunger strike: the warden cut ketchup “for budget reasons.” The same day, he bought a new car.",
        "The block is going on hunger strike: the cafeteria served {w:food} [[six|nine|fourteen]] days in a row and it's starting to give off {w:smell}. The ringleaders are going cell to cell. Are you in?",
        "Hunger strike! Management replaced Sunday dessert with {w:object}, 'for educational purposes'. The movement is growing. Your stomach is already making {w:sound}.",
        "The inmates refuse to eat until the common-room TV stops being stuck on {w:show}. It's been three days. Some have already cracked and eaten their soap. Your call.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire la grève', en: 'Join the strike' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai tenu onze jours. Onze. La direction a cédé : la gelée est désormais… violette. Victoire historique.", "J'ai tenu jusqu'au bout. La direction a cédé et a organisé un banquet de réconciliation : {w:food} pour tout le monde. On a tous été malades. Mais on a gagné."], en: ["I lasted eleven days. Eleven. The administration caved: the jello is now… purple. A historic victory.", "I held out until the end. Management caved and threw a reconciliation banquet: {w:food} for everyone. We all got sick. But we won."] }, fx: { health: -10, weight: -0.05, happy: 5, discipline: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai craqué au deuxième jour et mangé un tube de colle en douce. Les autres m'ont surpris{|e}, la bouche pleine. Traître{|sse} à la cause.", "J'ai flanché le troisième jour : j'ai acheté {w:food} qu'un gardien vendait sous le manteau. Les autres m'ont vu{|e}. Je suis exclu{|e} du mouvement et des conversations."], en: ["I cracked on day two and secretly ate a glue stick. The others caught me with my mouth full. Traitor to the cause.", "I caved on day three: I bought {w:food} a guard was selling under the counter. The others saw me. I've been kicked out of the movement and all conversations."] }, fx: { health: -2, happy: -5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Manger en cachette', en: 'Eat in secret' },
        text: { fr: ["J'ai fait la grève le jour et mangé des barres de céréales la nuit sous ma couverture. Je suis le seul gréviste de l'histoire à avoir pris du poids.", "J'ai fait semblant de faire la grève. La nuit, je négociais {w:food} avec un gardien corrompu. J'ai pris [[deux|trois|cinq]] kilos. J'ai dit que c'était de la rétention d'eau due au stress."], en: ["I striked by day and ate granola bars under my blanket at night. I'm the only hunger striker in history to gain weight.", "I pretended to strike. At night, I bought {w:food} from a crooked guard. I gained [[four|six|ten]] pounds. I said it was stress-related water retention."] },
        fx: { weight: 0.05, happy: 3, karma: -2 },
      },
      {
        label: { fr: 'Mener la grève', en: 'Lead the strike' },
        out: [
          { w: 1, text: { fr: ["J'ai pris la tête du mouvement. Interview dans le journal local, titre : « Le Gandhi de la gamelle ». Ma famille a encadré l'article.", "J'ai mené la grève avec des discours enflammés dans la cour. La direction a cédé au bout d'une semaine. Les détenus m'ont porté{|e} en triomphe. Un peu trop haut. Je me suis cogné{|e} au plafond."], en: ["I led the movement. Interview in the local paper, headline: “The Gandhi of the Mess Hall.” My family framed the article.", "I led the strike with fiery speeches in the yard. Management caved after a week. The inmates carried me in triumph. A little too high. I hit the ceiling."] }, fx: { fame: 4, health: -8, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai mené la grève. La direction m'a transféré{|e} au mitard « pour préserver ma santé ». Merci la démocratie.", "J'ai pris la tête du mouvement. Le lendemain, tous les autres avaient repris les repas et j'étais seul{|e} à jeûner. Personne ne m'a prévenu{|e}. J'ai tenu par fierté. Et par bêtise."], en: ["I led the strike. The administration moved me to solitary “to protect my health.” Thanks, democracy.", "I led the movement. The next day, everyone else was eating again and I was the only one fasting. Nobody told me. I held out out of pride. And stupidity."] }, fx: { stress: 8, health: -5 }, mood: 'angry' },
        ],
      },
    ],
  },

  // ───────────────────────────── prison: trash ─────────────────────────────
  {
    id: 'cr_gang_war',
    icon: '🍴',
    cat: 'prison',
    rating: 2,
    scene: { place: 'prison', mood: 'angry', fx: 'gore' },
    when: { prison: true, flag: 'cr_gang' },
    cooldown: 3,
    actor: CELLMATE,
    text: {
      fr: [
        "Guerre ouverte dans la cour de promenade : Cuillères Noires contre Fourchettes Sanglantes. {a.first}, du camp d'en face, fonce sur toi avec un plateau-repas aiguisé.",
        "La cour de promenade se transforme en champ de bataille. Des haltères volent. Quelqu'un hurle « POUR LE PUDDING ! ». {a.first} te désigne du doigt.",
      ],
      en: [
        "All-out war in the exercise yard: Black Spoons versus Bloody Forks. {a.first}, from the other side, charges at you with a sharpened lunch tray.",
        "The exercise yard becomes a battlefield. Dumbbells are flying. Someone screams “FOR THE PUDDING!” {a.first} points straight at you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Charger', en: 'Charge' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai esquivé et collé à {a.first} un coup de boule qui a fait voler deux incisives dans la gamelle d'un gardien. Le gang m'appelle désormais « le Dentiste ».", en: "I dodged and headbutted {a.first} so hard two front teeth flew into a guard's lunch. The gang now calls me “the Dentist.”" }, fx: { happy: 6, health: -5, karma: -5, actorRole: 'enemy', counter: 'violent', visual: 'gore' }, mood: 'proud' },
          { w: 1, text: { fr: "Le plateau de {a.first} m'a ouvert l'arcade comme une boîte de sardines. J'ai pissé le sang sur trois mètres. L'infirmier m'a recousu au fil dentaire.", en: "{a.first}'s tray opened my eyebrow like a sardine can. I sprayed blood across ten feet. The nurse stitched me up with dental floss." }, fx: { health: -18, visual: 'gore' }, mood: 'sick' },
          { w: 0.25, text: { fr: "J'ai pris le plateau en pleine carotide. Le sang a giclé jusqu'au mirador. Le gardien là-haut a juste dit : « Ah. Quand même. »", en: "I took the tray right in the carotid. Blood sprayed all the way up the watchtower. The guard up there just said: “Huh. Wow.”" }, fx: { die: { fr: "égorgé{|e} par un plateau-repas aiguisé pendant une guerre de gangs", en: 'throat-slit by a sharpened lunch tray in a gang war' }, visual: 'gore' } },
        ],
      },
      {
        label: { fr: 'Me planquer derrière Bébert', en: 'Hide behind Big Bob' },
        text: { fr: "Je me suis planqué{|e} derrière Bébert, 160 kilos de muscles et de tatouages de maman. Il a tout pris. Il n'a rien senti. Il a demandé si c'était l'heure du goûter.", en: "I hid behind Big Bob, 350 pounds of muscle and “MOM” tattoos. He took every hit. Felt nothing. Asked if it was snack time." },
        fx: { happy: 2, karma: -1 },
      },
      {
        label: { fr: 'Finir le travail', en: 'Finish the job' },
        text: { fr: "J'ai fini le travail avec une fourchette en plastique fondue. Ça a pris du temps. Beaucoup de temps. {a.first} est parti{a:|e} à la morgue en trois sacs, et moi au mitard avec dix ans de rab.", en: "I finished the job with a melted plastic fork. It took a while. A long while. {a.first} left for the morgue in three bags, and I left for solitary with ten extra years." },
        fx: { actorDie: true, jail: 10, karma: -20, counter: ['crimes', 'violent'], visual: 'gore' },
        mood: 'angry',
      },
    ],
  },
  {
    id: 'cr_riot',
    icon: '🔥',
    cat: 'prison',
    rating: 2,
    scene: { place: 'prison', mood: 'shock', fx: 'fire' },
    when: { prison: true },
    cooldown: 5,
    weight: 6,
    text: {
      fr: [
        "L'émeute éclate parce que la cantine a remplacé les frites par du chou-fleur vapeur. Matelas en feu, gardiens en fuite, et quelqu'un fait du roller avec la tête du mannequin de secourisme.",
        "Émeute générale ! Le directeur hurle dans un mégaphone, les détenus hurlent plus fort, et un type joue de la batterie sur un gardien casqué.",
      ],
      en: [
        "A riot breaks out because the cafeteria replaced fries with steamed cauliflower. Mattresses on fire, guards fleeing, and someone is roller-skating with the CPR dummy's head.",
        "Full-scale riot! The warden is yelling into a megaphone, the inmates yell louder, and a guy is playing drums on a helmeted guard.",
      ],
    },
    choices: [
      {
        label: { fr: "Rejoindre l'émeute", en: 'Join the riot' },
        out: [
          { w: 2, text: { fr: "J'ai balancé une télé du deuxième étage sur un bouclier anti-émeute. Le gardien en dessous a fait « plonk ». On a récupéré les frites. Et moi un an de rab.", en: "I threw a TV off the second tier onto a riot shield. The guard underneath went “plonk.” We got the fries back. I got an extra year." }, fx: { jail: 1, happy: 8, karma: -5, counter: 'violent', visual: 'fire' }, mood: 'party' },
          { w: 1, text: { fr: "Une balle en caoutchouc m'a éclaté le genou comme une pastèque tombée du camion. J'ai rampé jusqu'au réfectoire en laissant une traînée rouge, façon escargot.", en: "A rubber bullet burst my kneecap like a watermelon falling off a truck. I crawled to the mess hall leaving a red trail, snail-style." }, fx: { health: -20, visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Me cacher sous le lit', en: 'Hide under the bunk' },
        text: { fr: "Je me suis caché{|e} sous ma couchette avec un paquet de biscuits. J'ai tout entendu, rien vu, et fini les biscuits.", en: "I hid under my bunk with a pack of cookies. Heard everything, saw nothing, finished the cookies." },
        fx: { happy: 1, stress: 5 },
      },
      {
        label: { fr: 'Aider les gardiens', en: 'Help the guards' },
        out: [
          { w: 2, text: { fr: "J'ai aidé un gardien à se barricader dans la buanderie. Il m'a serré la main en pleurant et a écrit un rapport élogieux. Il sentait l'adoucissant et la peur.", en: "I helped a guard barricade himself in the laundry. He shook my hand in tears and wrote a glowing report. He smelled of fabric softener and fear." }, fx: { counter: 'prisonGood', karma: 5 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai aidé les gardiens. Toute l'aile B m'a vu{|e}. Je suis maintenant officiellement une balance, et mon oreiller a été rempli de purée.", en: "I helped the guards. All of B Block saw me. I'm officially a snitch now, and my pillow got stuffed with mashed potatoes." }, fx: { counter: 'prisonGood', flag: 'cr_snitch', happy: -6 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'cr_canteen_fight',
    icon: '🍮',
    cat: 'prison',
    rating: 2,
    scene: { place: 'prison', mood: 'angry', fx: 'gore' },
    when: { prison: true },
    cooldown: 3,
    actor: CELLMATE,
    text: {
      fr: [
        "À la cantine, {a.first} vient de voler ton pudding. TON pudding. Le seul truc comestible de la semaine. Tout le réfectoire retient son souffle.",
        "{a.first} plonge son doigt dans ta purée, le lèche, et te regarde droit dans les yeux. Le réfectoire entier se tait. Même les mouches.",
      ],
      en: [
        "In the cafeteria, {a.first} just stole your pudding. YOUR pudding. The only edible thing all week. The whole room holds its breath.",
        "{a.first} sticks a finger in your mashed potatoes, licks it, and looks you dead in the eye. The entire cafeteria goes quiet. Even the flies.",
      ],
    },
    choices: [
      {
        label: { fr: "Défendre mon honneur", en: 'Defend my honor' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai écrasé mon plateau sur le crâne de {a.first}. Purée, sang et dents ont décoré le mur comme un Pollock. J'ai récupéré le pudding. Il avait un goût de victoire et de fer.", en: "I smashed my tray over {a.first}'s skull. Potatoes, blood and teeth decorated the wall like a Pollock. I got my pudding back. It tasted of victory and iron." }, fx: { happy: 8, health: -3, karma: -3, actorRole: 'enemy', counter: 'violent', visual: 'gore' }, mood: 'proud' },
          { w: 1, text: { fr: "{a.first} m'a planté une fourchette dans la cuisse et l'a tournée comme un tire-bouchon. J'ai poussé un contre-ut. Le pudding a fini par terre, piétiné. Comme ma dignité.", en: "{a.first} stabbed a fork in my thigh and twisted it like a corkscrew. I hit a high C. The pudding ended up on the floor, trampled. Like my dignity." }, fx: { health: -15, happy: -6, visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Laisser couler', en: 'Let it go' },
        text: { fr: "J'ai laissé faire. Tout le réfectoire m'a regardé{|e} comme un yaourt périmé. Ma réputation a pris dix ans d'un coup.", en: "I let it slide. The whole cafeteria looked at me like expired yogurt. My reputation aged ten years in one second." },
        fx: { happy: -6, stress: 4 },
      },
      {
        label: { fr: 'Proposer un deal', en: 'Offer a deal' },
        text: { fr: "J'ai proposé à {a.first} d'échanger le pudding contre une paire de chaussettes propres. Deal accepté. Ici, les chaussettes propres valent plus que l'or.", en: "I offered {a.first} a pair of clean socks for the pudding. Deal. In here, clean socks are worth more than gold." },
        fx: { rel: 10, happy: 2 },
      },
    ],
  },
  {
    id: 'cr_shower_soap',
    icon: '🧼',
    cat: 'prison',
    rating: 2,
    scene: { place: 'prison', mood: 'shock' },
    when: { prison: true, age: [18, 120] },
    cooldown: 6,
    weight: 6,
    actor: CELLMATE,
    text: {
      fr: [
        "Aux douches, ta savonnette t'échappe et glisse au milieu du carrelage. Silence de mort. Vingt détenus fixent le savon. {a.first} se racle la gorge. C'est le cliché le plus vieux du monde, et tu es dedans.",
        "Ta savonnette tombe. Le temps s'arrête. Quelque part, un harmonica joue une note triste. {a.first} murmure : « Oh non. Pas ce film-là. »",
      ],
      en: [
        "In the showers, your soap slips and slides to the middle of the floor. Dead silence. Twenty inmates stare at the soap. {a.first} clears {a.his} throat. It's the oldest cliché in the world, and you're in it.",
        "Your soap drops. Time stops. Somewhere, a harmonica plays one sad note. {a.first} whispers: “Oh no. Not this movie.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Le ramasser fièrement', en: 'Pick it up proudly' },
        out: [
          { w: 2, text: { fr: "Je l'ai ramassé en faisant un grand écart façon film d'action. Je me suis déchiré l'aine avec un bruit de velcro. Personne n'a ri. Tout le monde avait de la peine. C'est pire.", en: "I picked it up doing a full action-movie split. Tore my groin with a Velcro sound. Nobody laughed. Everyone felt sorry for me. That's worse." }, fx: { health: -8, athletic: 2 }, mood: 'cry' },
          { w: 1, text: { fr: "Je me suis penché{|e}, j'ai glissé sur le savon et je me suis vautré{|e} à poil devant toute l'aile B. Le claquement de mes fesses sur le carrelage mouillé hante encore les nuits de {a.first}.", en: "I bent down, slipped on the soap and wiped out stark naked in front of all of B Block. The slap of my butt on the wet tiles still haunts {a.first}'s nightmares." }, fx: { health: -5, happy: -6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Shooter dedans', en: 'Kick it' },
        text: { fr: "J'ai shooté la savonnette comme un penalty. Elle a traversé les douches et percuté le front d'un gardien. Lucarne. Une semaine de mitard, mais quel but.", en: "I kicked the soap like a penalty shot. It flew across the showers and smacked a guard in the forehead. Top corner. A week in solitary, but what a goal." },
        fx: { happy: 5, stress: 4, discipline: -2 },
        mood: 'proud',
      },
      {
        label: { fr: "L'abandonner", en: 'Abandon it' },
        text: { fr: "J'ai laissé le savon. Pour toujours. Je sens désormais le vestiaire de rugby après prolongation, mais j'ai gardé mon honneur. Et des champignons entre les orteils.", en: "I left the soap. Forever. I now smell like a locker room after overtime, but I kept my honor. And a fungus between my toes." },
        fx: { happy: -3, looks: -4 },
      },
    ],
  },
  {
    id: 'cr_smuggling',
    icon: '📱',
    cat: 'prison',
    rating: 2,
    scene: { place: 'prison', mood: 'neutral' },
    when: { prison: true },
    cooldown: 3,
    vars: { amount: [200, 2000] },
    text: {
      fr: [
        "Un détenu te propose de faire entrer un téléphone par le parloir. Rémunération : {$amount}. Cachette prévue : « là où le soleil ne brille jamais ». Il insiste beaucoup sur les guillemets.",
        "Le caïd de l'aile C cherche une mule pour faire rentrer un téléphone. Paie : {$amount}. Il te tend un pot de vaseline avec un clin d'œil professionnel.",
      ],
      en: [
        "An inmate wants you to smuggle a phone in through the visiting room. Pay: {$amount}. Planned hiding spot: “where the sun don't shine.” He really leans on the air quotes.",
        "C Block's kingpin needs a mule to bring in a phone. Pay: {$amount}. He hands you a jar of petroleum jelly with a professional wink.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire la mule', en: 'Be the mule' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: "J'ai fait entrer le téléphone. Le trajet a été long, douloureux et très intime. Il a vibré deux fois en route. J'ai empoché {$amount} et je marche bizarrement depuis.", en: "I got the phone in. The trip was long, painful and very intimate. It vibrated twice on the way. I pocketed {$amount} and I've walked funny ever since." }, fx: { money: 'amount', health: -4, counter: 'crimes' }, mood: 'proud' },
          { w: 1, text: { fr: "Le téléphone a sonné pendant la fouille. Sonnerie : « Bella Ciao », à fond. Le gardien a enfilé un gant. Deux ans de plus et un souvenir que je n'oublierai jamais.", en: "The phone rang during the search. Ringtone: “Bella Ciao,” full volume. The guard snapped on a glove. Two more years and a memory I'll never forget." }, fx: { jail: 2, happy: -10, visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Corrompre un gardien', en: 'Bribe a guard' },
        out: [
          { w: 2, text: { fr: "J'ai filé toute ma part à un gardien, qui a fait passer le téléphone dans sa gamelle. Zéro bénéfice, mais la satisfaction d'avoir corrompu l'État. Et c'est plus hygiénique.", en: "I gave my whole cut to a guard, who smuggled the phone in his lunchbox. Zero profit, but the joy of corrupting the State. And it's more hygienic." }, fx: { counter: 'crimes', karma: -2, happy: 3 } },
          { w: 1, text: { fr: "Le gardien a pris l'enveloppe, puis m'a dénoncé{|e} quand même. Il a touché une prime. Moi, un an de rab. La justice, toujours intègre quand ça rapporte.", en: "The guard took the envelope, then reported me anyway. He got a bonus. I got another year. Justice: always upright when there's money in it." }, fx: { jail: 1, happy: -6 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Refuser', en: 'Refuse' },
        text: { fr: "J'ai refusé. Mon corps n'est pas un bagage cabine.", en: "I said no. My body is not a carry-on." },
        fx: { counter: 'prisonGood', karma: 2 },
      },
    ],
  },
  {
    id: 'cr_tattoo',
    icon: '🖋️',
    cat: 'prison',
    rating: 2,
    scene: { place: 'prison', mood: 'neutral' },
    when: { prison: true },
    cooldown: 4,
    text: {
      fr: [
        "Un détenu tatoueur te propose ses services : aiguille de couture, encre de stylo bille, moteur de rasoir électrique. Il a lui-même un dauphin tatoué qui ressemble à une hernie.",
        "Salon de tatouage clandestin, cellule 214. Le tatoueur stérilise son aiguille en léchant dessus. « T'inquiète, j'ai jamais eu de plainte. Enfin, les plaignants sont morts. »",
      ],
      en: [
        "An inmate tattoo artist offers his services: sewing needle, ballpoint ink, an electric razor motor. His own dolphin tattoo looks like a hernia.",
        "Underground tattoo parlor, cell 214. The artist sterilizes his needle by licking it. “Relax, never had a complaint. Well, the complainers died.”",
      ],
    },
    choices: [
      {
        label: { fr: "Une larme sous l'œil", en: 'A teardrop' },
        out: [
          { w: 2, text: { fr: "J'ai une larme tatouée sous l'œil. Tout le monde croit que j'ai tué quelqu'un. En vrai, j'ai juste pleuré pendant la séance.", en: "I have a teardrop tattooed under my eye. Everyone thinks I killed someone. Truth is, I just cried during the session." }, fx: { looks: -2, happy: 4, flag: 'cr_prison_tattoo' } },
          { w: 1, text: { fr: "Le tatoueur a éternué en pleine séance. J'ai maintenant une virgule sous l'œil, comme une faute de ponctuation permanente.", en: "The artist sneezed mid-session. I now have a comma under my eye, like a permanent punctuation error." }, fx: { looks: -5, happy: -3, flag: 'cr_prison_tattoo' }, mood: 'sad' },
        ],
      },
      {
        label: { fr: "Le prénom de mon amour", en: "My lover's name" },
        if: { has: 'lover' },
        text: { fr: "Je me suis fait tatouer le prénom de l'amour de ma vie sur le torse. Avec deux fautes. On dirait un sirop contre la toux.", en: "I got the love of my life's name tattooed on my chest. With two typos. It looks like a brand of cough syrup." },
        fx: { happy: 2, looks: -3, flag: 'cr_prison_tattoo' },
      },
      {
        label: { fr: 'Un tigre dans le dos', en: 'A tiger on my back' },
        out: [
          { w: 2, text: { fr: "Tête de tigre sur tout le dos. Magnifique. Les autres détenus me respectent. Ma future belle-famille, beaucoup moins.", en: "A tiger's head across my whole back. Gorgeous. The other inmates respect me. My future in-laws, much less." }, fx: { looks: 2, happy: 6, flag: 'cr_prison_tattoo' }, mood: 'proud' },
          { w: 1, text: { fr: "Le tigre s'est infecté. Il a gonflé, suinté un pus jaune fluo, et ressemble maintenant à un hamster noyé. L'infirmier a vomi dans l'évier en le voyant.", en: "The tiger got infected. It swelled up, oozed neon yellow pus, and now looks like a drowned hamster. The nurse threw up in the sink when he saw it." }, fx: { health: -12, looks: -4, flag: 'cr_prison_tattoo', visual: 'gore' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Non merci', en: 'No thanks' },
        text: { fr: "J'ai décliné. Je préfère garder mon hépatite pour une occasion spéciale.", en: "I declined. I'm saving my hepatitis for a special occasion." },
        fx: { health: 1 },
      },
    ],
  },
  {
    id: 'cr_escape_night',
    icon: '🚽',
    cat: 'prison',
    rating: 2,
    scene: { place: 'prison', mood: 'shock', fx: 'poop' },
    when: { prison: true, flag: 'cr_escape_plan' },
    cooldown: 2,
    text: {
      fr: [
        "Après des mois de cuillère, le tunnel débouche… quelque part. Ça sent l'égout, la liberté et le kebab de 2009. C'est maintenant ou jamais.",
        "La dernière cuillerée de plâtre tombe. De l'autre côté : le noir total, un courant d'air tiède et un bruit de chasse d'eau. La liberté a une odeur. Elle n'est pas terrible.",
      ],
      en: [
        "After months of spoon work, the tunnel opens up… somewhere. It smells of sewage, freedom and a 2009 kebab. It's now or never.",
        "The last spoonful of plaster falls away. On the other side: total darkness, a warm draft and the sound of a flushing toilet. Freedom has a smell. It's not great.",
      ],
    },
    choices: [
      {
        label: { fr: 'Ramper vers la liberté', en: 'Crawl to freedom' },
        text: { fr: "J'ai rampé dans 400 mètres de canalisation à caca. J'ai avalé des choses. Des choses ont essayé de m'avaler. Au bout : un mur, des projecteurs, et une dernière chance.", en: "I crawled through 400 yards of poop pipe. I swallowed things. Things tried to swallow me. At the end: a wall, searchlights, and one last chance." },
        fx: { unflag: 'cr_escape_plan', health: -3, open: 'minigame:escape', visual: 'poop' },
      },
      {
        label: { fr: 'Vendre le tunnel', en: 'Sell the tunnel' },
        text: { fr: "J'ai vendu l'accès au tunnel à un mafieux de l'aile C. Il est resté coincé au niveau des hanches. La nuit, on l'entend encore chanter dans les murs.", en: "I sold tunnel access to a mobster from C Block. He got stuck at the hips. At night you can still hear him singing inside the walls." },
        fx: { unflag: 'cr_escape_plan', money: 2500, counter: 'crimes', karma: -4, visual: 'money' },
        mood: 'happy',
      },
      {
        label: { fr: "Envoyer un éclaireur", en: 'Send a scout first' },
        text: { fr: "J'ai envoyé un codétenu en éclaireur. Le tunnel s'est effondré sur lui avec un bruit de soufflé raté. On n'a retrouvé que ses claquettes. Paix à ses pieds.", en: "I sent a cellmate ahead to scout. The tunnel collapsed on him with the sound of a failed soufflé. All they found were his flip-flops. Rest in peace, feet." },
        fx: { unflag: 'cr_escape_plan', karma: -8, stress: 6, visual: 'gore' },
        mood: 'shock',
      },
      {
        label: { fr: 'Tout reboucher', en: 'Fill it back in' },
        text: { fr: "J'ai rebouché le tunnel avec de la purée de la cantine. Ça tient mieux que du béton. C'est très inquiétant, quand on y pense.", en: "I filled the tunnel back in with cafeteria mashed potatoes. It holds better than concrete. Which is deeply worrying if you think about it." },
        fx: { unflag: 'cr_escape_plan', counter: 'prisonGood' },
      },
    ],
  },
  {
    id: 'cr_snitch_payback',
    icon: '🔪',
    cat: 'prison',
    rating: 2,
    scene: { place: 'prison', mood: 'shock', fx: 'gore' },
    when: { prison: true, flag: 'cr_snitch' },
    cooldown: 3,
    actor: CELLMATE,
    vars: { amount: [300, 3000] },
    text: {
      fr: [
        "Dans la file de la cantine, {a.first} se colle derrière toi et murmure : « Les balances, on les découpe. » Tu sens un truc pointu contre tes reins. Probablement pas une baguette.",
        "Tu rentres dans ta cellule : un rat mort sur ton oreiller, avec ton nom écrit au ketchup. {a.first} t'attend dans le couloir, une cuillère limée à la main.",
      ],
      en: [
        "In the lunch line, {a.first} presses up behind you and whispers: “Snitches get sliced.” Something sharp pokes your kidneys. Probably not a breadstick.",
        "You walk into your cell: a dead rat on your pillow, your name written in ketchup. {a.first} is waiting in the hallway with a sharpened spoon.",
      ],
    },
    choices: [
      {
        label: { fr: 'Courir', en: 'Run' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai sprinté jusqu'aux gardiens en hurlant. J'ai renversé trois plateaux et un aumônier. Vivant{|e}, mais l'aumônier ne me parle plus.", en: "I sprinted to the guards screaming. Knocked over three trays and a chaplain. Alive, but the chaplain won't talk to me anymore." }, fx: { stress: 6 }, mood: 'shock' },
          { w: 1, text: { fr: "{a.first} m'a planté{|e} trois fois dans la fesse gauche avant que j'atteigne la porte. Je fuis comme une gourde percée et je m'assiérai de travers pour le restant de mes jours.", en: "{a.first} stabbed me three times in the left buttock before I reached the door. I leak like a punctured water bottle and I'll sit sideways for the rest of my life." }, fx: { health: -20, visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Négocier', en: 'Pay up' },
        text: { fr: "J'ai offert {$amount} à {a.first} pour passer l'éponge. Les balances paient leurs dettes. Littéralement.", en: "I offered {a.first} {$amount} to let it go. Snitches pay their debts. Literally." },
        fx: { money: '-amount', unflag: 'cr_snitch', happy: -3 },
      },
      {
        label: { fr: 'Me battre', en: 'Fight back' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai retourné sa cuillère contre {a.first} et je l'ai enfoncée dans son œil. Ça a fait « pop ». Il a giclé un truc gélatineux sur le menu du jour. Plus personne ne m'appelle « balance ».", en: "I turned the spoon on {a.first} and drove it into {a.his} eye. It went “pop.” Something gelatinous squirted onto the menu board. Nobody calls me a snitch anymore." }, fx: { health: -5, jail: 3, karma: -10, unflag: 'cr_snitch', actorRole: 'enemy', counter: 'violent', visual: 'gore' }, mood: 'angry' },
          { w: 0.6, text: { fr: "J'ai voulu me battre. Mauvaise idée. Je me suis vidé{|e} de mon sang entre le hachis parmentier et la compote, sous les applaudissements.", en: "I tried to fight. Bad idea. I bled out between the shepherd's pie and the applesauce, to a round of applause." }, fx: { die: { fr: "saigné{|e} comme un cochon dans la file de la cantine pour avoir balancé", en: 'bled out like a pig in the lunch line for snitching' }, visual: 'gore' } },
        ],
      },
    ],
  },
  {
    id: 'cr_solitary',
    icon: '🪳',
    cat: 'prison',
    rating: 2,
    scene: { place: 'prison', mood: 'sad' },
    when: { prison: true },
    cooldown: 4,
    text: {
      fr: [
        "Mitard. Quatre mètres carrés, une ampoule qui grésille et un cafard qui te fixe depuis le coin. Ça fait douze jours. Tu commences à trouver le cafard intellectuellement stimulant.",
        "Isolement total. Ton seul contact humain : la main du gardien qui glisse un plateau sous la porte. Tu as donné un prénom à cette main. Elle s'appelle Brigitte.",
      ],
      en: [
        "Solitary. Forty square feet, a buzzing light bulb and a cockroach staring at you from the corner. Day twelve. You're starting to find the cockroach intellectually stimulating.",
        "Total isolation. Your only human contact: the guard's hand sliding a tray under the door. You've named the hand. Her name is Brenda.",
      ],
    },
    choices: [
      {
        label: { fr: 'Me faire un ami', en: 'Make a friend' },
        text: { fr: "J'ai baptisé le cafard Jean-Michel. On a parlé philo, politique, de nos ex. Le jour de ma sortie, un gardien l'a écrasé sous mes yeux. Son jus jaune a giclé sur ma chaussure. Je ne m'en remettrai jamais.", en: "I named the cockroach Gerald. We discussed philosophy, politics, our exes. The day I got out, a guard stomped him right in front of me. His yellow juice splattered my shoe. I'll never get over it." },
        fx: { happy: -8, stress: 5, visual: 'gore' },
        mood: 'cry',
      },
      {
        label: { fr: 'Faire des pompes', en: 'Do push-ups' },
        text: { fr: "J'ai fait 4 000 pompes et 2 000 abdos. Je suis sorti{|e} du mitard bâti{|e} comme un frigo américain. Avec la conversation d'un frigo américain.", en: "I did 4,000 push-ups and 2,000 sit-ups. I came out of solitary built like a fridge. With the conversational skills of a fridge." },
        fx: { athletic: 8, smarts: -2, health: 3 },
        mood: 'proud',
      },
      {
        label: { fr: 'Cogner la porte', en: 'Bang on the door' },
        out: [
          { w: 1, text: { fr: "J'ai hurlé pendant six heures. Le gardien a hurlé en retour. On a fini par chanter du Céline Dion en canon. Moment fort.", en: "I screamed for six hours. The guard screamed back. We ended up singing Céline Dion in a round. Beautiful moment." }, fx: { happy: 3, stress: -3 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai frappé la porte en acier jusqu'à me péter trois phalanges. Mes doigts pointent maintenant dans trois directions, comme une girouette un jour de tempête.", en: "I punched the steel door until I broke three knuckles. My fingers now point in three directions, like a weathervane in a storm." }, fx: { health: -10, visual: 'gore' }, mood: 'cry' },
        ],
      },
    ],
  },

  // ───────────────────────────── street life ─────────────────────────────
  {
    id: 'cr_witness',
    icon: '👀',
    cat: 'crime',
    scene: { place: 'park', mood: 'shock' },
    when: { age: [12, 99] },
    cooldown: 6,
    actor: STRANGER,
    vars: { amount: [100, 1500] },
    text: {
      fr: [
        "Tu vois {a.first} braquer la supérette du coin, cagoule en forme de lapin sur la tête. Vos regards se croisent. {a:Il|Elle} pose un doigt sur ses lèvres.",
        "En sortant du pressing, tu tombes sur {a.first} en train de forcer une voiture avec un cintre. {a:Il|Elle} te fait un petit signe de la main, très détendu{a:|e}.",
        "{w:time}, tu surprends {a.first} en train de sortir {w:at_place} avec {w:object} sous le bras et une alarme qui hurle derrière {a:lui|elle}. {a:Il|Elle} te fait un clin d'œil.",
        "Tu vois {a.first} voler {w:vehicle} en plein jour, avec une décontraction déconcertante. {a:Il|Elle} règle même le rétroviseur avant de démarrer. Puis {a:il|elle} te remarque. Silence.",
        "{a.first}, portant un masque qui représente {w:celeb}, vient de vider la caisse de la boulangerie. En sortant, {a:il|elle} te croise, s'arrête et te tend [[un croissant|une baguette|un éclair]]. « On ne s'est jamais vus. »",
      ],
      en: [
        "You see {a.first} robbing the corner store, wearing a bunny-shaped ski mask. Your eyes meet. {a:He|She} puts a finger to {a.his} lips.",
        "Leaving the dry cleaner's, you catch {a.first} breaking into a car with a coat hanger. {a:He|She} gives you a little wave, totally relaxed.",
        "{w:time}, you catch {a.first} walking out {w:at_place} with {w:object} under {a.his} arm and an alarm blaring behind {a:him|her}. {a:He|She} winks at you.",
        "You watch {a.first} steal {w:vehicle} in broad daylight, with unsettling calm. {a:He|She} even adjusts the mirror before driving off. Then {a:he|she} spots you. Silence.",
        "{a.first}, wearing a mask of {w:celeb}, just emptied the bakery's till. On the way out, {a:he|she} bumps into you, stops and hands you [[a croissant|a baguette|an éclair]]. 'We never met.'",
      ],
    },
    choices: [
      {
        label: { fr: 'Témoigner', en: 'Testify' },
        out: [
          { w: 2, text: { fr: ["J'ai témoigné. {a.first} a pris trois ans. Au procès, {a:il|elle} m'a fait le signe « je te surveille » avec deux doigts. Pendant toute l'audience.", "J'ai témoigné. {a.first} a été condamné{a:|e}. Depuis, je reçois chaque mois une carte postale de prison, sans texte, juste un dessin de lapin. Je dors mal."], en: ["I testified. {a.first} got three years. During the trial, {a:he|she} did the “I'm watching you” gesture at me. The entire time.", "I testified. {a.first} was convicted. Since then, I get a postcard from prison every month, no words, just a drawing of a bunny. I don't sleep well."] }, fx: { actorRole: 'enemy', karma: 6, stress: 6 } },
          { w: 1, text: { fr: ["J'ai appelé la police. Ils sont arrivés 50 minutes plus tard, ont pris ma déposition, puis l'ont oubliée sur le toit de la voiture. {a.first} court toujours, et connaît mon adresse.", "J'ai témoigné, mais le policier a écrit mon nom de travers et l'adresse de {a.first} à la place de la mienne. {a.first} a reçu ma convocation. {a:Il|Elle} est venu{a:|e} me la rapporter."], en: ["I called the police. They showed up 50 minutes later, took my statement, then left it on the roof of the car. {a.first} is still at large, and knows my address.", "I testified, but the cop misspelled my name and wrote {a.first}'s address instead of mine. {a.first} got my summons. {a:He|She} came over to hand-deliver it."] }, fx: { actorRole: 'enemy', stress: 10, karma: 3 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: "Je n'ai rien vu", en: 'I saw nothing' },
        text: { fr: ["Je n'ai rien vu. Rien du tout. J'ai même acheté des chips dans la supérette juste après. La caissière tremblait encore en me rendant la monnaie.", "Je n'ai rien vu. J'ai regardé {w:animal} sur le trottoir avec une concentration extrême jusqu'à ce que tout soit fini. Je suis un témoin parfait : aveugle."], en: ["I saw nothing. Nothing at all. I even bought chips at the store right after. The cashier was still shaking when she gave me change.", "I saw nothing. I stared at {w:animal} on the sidewalk with extreme focus until it was all over. I'm the perfect witness: blind."] },
        fx: { karma: -5, happy: -2 },
      },
      {
        label: { fr: 'Réclamer ma part', en: 'Ask for a cut' },
        out: [
          { w: 1, text: { fr: ["J'ai rattrapé {a.first} pour réclamer ma part. {a:Il|Elle} m'a donné {$amount} pour mon silence, plus un clin d'œil. Partenaires.", "J'ai réclamé ma part à {a.first}. {a:Il|Elle} a ri, puis m'a tendu {$amount} et sa carte de visite. Je crois que je viens d'être recruté{|e}."], en: ["I caught up with {a.first} and asked for a cut. {a:He|She} gave me {$amount} for my silence, plus a wink. Partners.", "I asked {a.first} for my cut. {a:He|She} laughed, then handed me {$amount} and a business card. I think I've just been recruited."] }, fx: { money: 'amount', karma: -6, counter: 'crimes', actorRole: 'friend', heat: 5 }, mood: 'happy' },
          { w: 1, text: { fr: ["J'ai réclamé ma part. J'ai reçu un coup de coude dans le nez. Mon nez fait maintenant un angle intéressant.", "J'ai voulu ma part. {a.first} m'a donné un coup de pied dans le tibia et s'est enfui{a:|e} avec {w:object}. Je boite et je n'ai rien. Le crime ne paie pas, surtout pour les témoins."], en: ["I asked for a cut. I got an elbow to the nose. My nose now has an interesting angle.", "I wanted my cut. {a.first} kicked me in the shin and ran off with {w:object}. I'm limping and I got nothing. Crime doesn't pay, especially for witnesses."] }, fx: { health: -8, looks: -3 }, mood: 'sad' },
        ],
      },
    ],
  },
  {
    id: 'cr_informant_offer',
    icon: '🕵️',
    cat: 'crime',
    scene: { place: 'park', mood: 'neutral' },
    when: { age: [16, 80], noFlag: 'cr_informant' },
    cooldown: 8,
    weight: 6,
    vars: { amount: [300, 1500] },
    text: {
      fr: [
        "Un inspecteur en imperméable te paie un café et des croissants. « On sait que tu connais du monde. Deviens nos yeux et nos oreilles. On paie bien. Enfin, on paie. »",
        "Un flic en civil s'assoit à côté de toi sur un banc et fait semblant de lire le journal à l'envers. « Psst. Ça te dirait de devenir indic ? »",
        "Un inspecteur t'aborde {w:at_place}, déguisé (très mal) en touriste. Il t'offre {w:food} et murmure : « Toi, tu entends des choses. Nous, on paie pour les entendre. »",
        "Un type en imperméable, {w:weather}, te tend une carte de visite qui dit seulement « Police. Discrète. » Il veut un indic dans le quartier. Il te paiera [[en liquide|en tickets restaurant|en bons d'achat]].",
        "L'inspecteur Ducros, surnommé « {w:nickname} », t'attend devant chez toi avec deux cafés. « Je ne vais pas tourner autour du pot. On a besoin d'une balance. Et tu as une tête de balance. »",
      ],
      en: [
        "A detective in a trench coat buys you coffee and croissants. “We know you know people. Be our eyes and ears. We pay well. Well, we pay.”",
        "A plainclothes cop sits next to you on a bench, pretending to read an upside-down newspaper. “Psst. How'd you like to be an informant?”",
        "A detective approaches you {w:at_place}, disguised (very badly) as a tourist. He offers you {w:food} and whispers: 'You hear things. We pay to hear them.'",
        "A guy in a trench coat, {w:weather}, hands you a business card that just says 'Police. Discreet.' He wants an informant in the neighborhood. He'll pay [[in cash|in meal vouchers|in store credit]].",
        "Inspector Ducros, known as '{w:nickname}', is waiting outside your place with two coffees. 'I won't beat around the bush. We need a snitch. And you've got a snitch's face.'",
      ],
    },
    choices: [
      {
        label: { fr: 'Accepter', en: 'Accept' },
        text: { fr: ["J'ai accepté de devenir indic. Nom de code : « Croissant ». J'ai touché {$amount} pour dénoncer un voisin qui trie mal ses déchets.", "Je suis devenu{|e} indic. J'ai touché {$amount} pour signaler un voisin qui s'amusait à {w:crime_small}. L'inspecteur a été ravi. Le voisin, moins."], en: ["I agreed to be an informant. Codename: “Croissant.” I got {$amount} for reporting a neighbor who doesn't sort his recycling.", "I became an informant. I got {$amount} for reporting a neighbor who kept {w:crime_small}. The detective was thrilled. The neighbor, less so."] },
        fx: { money: 'amount', flag: 'cr_informant', heat: -20, schedule: { key: 'cr_informant_burned', years: 2 } },
      },
      {
        label: { fr: 'Refuser', en: 'Decline' },
        text: { fr: ["J'ai refusé, mais j'ai gardé les croissants. L'inspecteur a boudé. Il m'a même laissé l'addition.", "J'ai dit non. L'inspecteur a soupiré, a repris son café et m'a dit « on se reverra ». Depuis, une voiture banalisée est garée devant chez moi [[le mardi|tous les soirs|un jour sur deux]]."], en: ["I said no, but kept the croissants. The detective sulked. He even left me the bill.", "I said no. The detective sighed, took back his coffee and said 'we'll meet again'. Since then, an unmarked car has been parked outside my place [[on Tuesdays|every night|every other day]]."] },
        fx: { happy: 2 },
      },
      {
        label: { fr: 'Exiger un badge', en: 'Demand a badge' },
        text: { fr: ["J'ai demandé un badge, une arme et une voiture banalisée. L'inspecteur a ri si fort qu'il a renversé son café sur sa cravate.", "J'ai exigé un badge et {w:vehicle} de fonction. L'inspecteur m'a donné un autocollant « Shérif » sorti d'un paquet de céréales. Je le porte avec fierté."], en: ["I asked for a badge, a gun and an unmarked car. The detective laughed so hard he spilled coffee on his tie.", "I demanded a badge and {w:vehicle} as a company car. The detective gave me a 'Sheriff' sticker from a cereal box. I wear it with pride."] },
        fx: { happy: 3 },
      },
    ],
  },
  {
    id: 'cr_car_stolen',
    icon: '🚗',
    cat: 'crime',
    scene: { place: 'home', mood: 'shock' },
    when: { asset: 'car' },
    cooldown: 8,
    weight: 6,
    text: {
      fr: [
        "Ce matin, ta place de parking est vide. À la place de ta voiture : une flaque d'huile et un emballage de kebab. Le kebab, eux au moins, ils l'ont fini.",
        "Tu sors de chez toi, clés en main. Plus de voiture. Juste un mot sur le trottoir : « Merci ! ». Ils sont polis, au moins.",
        "Ta voiture a disparu {w:time}. À sa place, quelqu'un a garé {w:vehicle}, avec les clés sur le contact et un mot : « On échange ? » Tu n'as pas été consulté{|e}.",
        "Plus de voiture. La caméra du voisin montre {w:animal} qui traverse la rue, puis un type en peignoir qui démarre ta voiture en [[huit|douze|quatre]] secondes. Il a même mis le clignotant.",
        "Ta voiture a été volée. Tout ce qu'il reste sur la place : {w:object}, {w:smell} et des traces de pneus en forme de cœur. Le voleur avait le sens de l'humour. Toi, moins.",
      ],
      en: [
        "This morning, your parking spot is empty. Where your car was: an oil stain and a kebab wrapper. At least they finished the kebab.",
        "You walk out, keys in hand. No car. Just a note on the sidewalk: “Thanks!” At least they're polite.",
        "Your car vanished {w:time}. In its place, someone parked {w:vehicle}, keys in the ignition and a note: 'Trade?' Nobody asked you.",
        "No more car. The neighbor's camera shows {w:animal} crossing the street, then a guy in a bathrobe starting your car in [[eight|twelve|four]] seconds. He even used his turn signal.",
        "Your car was stolen. All that's left in the spot: {w:object}, {w:smell} and tire marks shaped like a heart. The thief had a sense of humor. You, less so.",
      ],
    },
    choices: [
      {
        label: { fr: 'Porter plainte', en: 'File a report' },
        out: [
          { w: 2, text: { fr: ["J'ai porté plainte. Le policier a tapé ma déposition avec deux doigts en soupirant et m'a dit « on vous rappelle ». On ne m'a jamais rappelé{|e}.", "J'ai porté plainte. Le policier m'a demandé la couleur de la voiture, puis s'il y avait {w:food} dedans. J'ai dit non. Il a eu l'air déçu et a classé l'affaire."], en: ["I filed a report. The officer typed my statement with two fingers, sighing, and said “we'll call you.” Nobody ever called.", "I filed a report. The officer asked the car's color, then whether there was {w:food} inside. I said no. He looked disappointed and closed the case."] }, fx: { loseAsset: 'car', happy: -8, stress: 5 }, mood: 'sad' },
          { w: 1, text: { fr: ["Ma voiture a été retrouvée trois semaines plus tard, en flammes, au milieu d'un champ. Elle était sur les réseaux avant moi.", "La police a retrouvé ma voiture {w:far_place}, avec [[dix mille|vingt mille|quarante mille]] kilomètres de plus au compteur et un autocollant « J'ai vu la mer ». Elle a eu une vie plus riche que moi."], en: ["My car was found three weeks later, on fire, in the middle of a field. It went viral before I did.", "The police found my car {w:far_place}, with [[six thousand|twelve thousand|twenty-five thousand]] more miles on it and an 'I saw the sea' bumper sticker. It's had a richer life than me."] }, fx: { loseAsset: 'car', happy: -10, visual: 'fire' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Mener l’enquête', en: 'Investigate myself' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai mené l'enquête. Mon voisin l'avait « empruntée » pour aller voir sa belle-mère. Il me l'a rendue avec le plein et une tarte aux pommes.", "J'ai enquêté comme dans les séries. J'ai retrouvé ma voiture {w:at_place}, intacte, avec {w:object} sur la banquette arrière. Je n'ai jamais su d'où ça venait. Je n'ai pas posé de questions."], en: ["I investigated. My neighbor had “borrowed” it to visit his mother-in-law. He returned it with a full tank and an apple pie.", "I investigated like on TV. I found my car {w:at_place}, intact, with {w:object} on the back seat. I never found out where it came from. I didn't ask questions."] }, fx: { happy: 6, smarts: 2 }, mood: 'happy' },
          { w: 2, text: { fr: ["J'ai joué les détectives pendant deux semaines. Résultat : zéro voiture, mais un magnifique tableau en liège avec des fils rouges.", "J'ai enquêté jour et nuit. J'ai fini par accuser à tort mon facteur, ma belle-sœur et {w:celeb}. La voiture, elle, n'est jamais revenue."], en: ["I played detective for two weeks. Result: zero cars, but a gorgeous corkboard with red string.", "I investigated day and night. I ended up wrongly accusing my mailman, my sister-in-law and {w:celeb}. The car never came back."] }, fx: { loseAsset: 'car', happy: -6, smarts: 2 } },
        ],
      },
      {
        label: { fr: 'Hausser les épaules', en: 'Shrug it off' },
        text: { fr: ["J'ai haussé les épaules. Elle avait 300 000 km et un siège qui sentait le chien mouillé. Bon courage au voleur.", "J'ai haussé les épaules et pris le bus. Une semaine plus tard, le voleur a ramené la voiture avec un mot : « Elle ne démarre pas en côte. Bon courage. »"], en: ["I shrugged. It had 200,000 miles and a seat that smelled like wet dog. Good luck to the thief.", "I shrugged and took the bus. A week later, the thief brought the car back with a note: 'Won't start on hills. Good luck.'"] },
        fx: { loseAsset: 'car', happy: -2 },
      },
    ],
  },
  {
    id: 'cr_street_gang',
    icon: '🐕',
    cat: 'crime',
    rating: 1,
    scene: { place: 'park', mood: 'neutral' },
    when: { age: [14, 30], noFlag: 'cr_street_gang' },
    cooldown: 5,
    actor: { create: { role: 'acquaintance', age: [-3, 6], gender: 'any' } },
    text: {
      fr: [
        "{a.first}, qui squatte en bas de ton immeuble avec un pitbull et un sac banane, te propose de rejoindre son crew. « On fait du business. Du gros business. » Le pitbull a l'air d'accord.",
        "Le crew du quartier recrute. {a.first} t'explique les avantages : protection, argent facile, un surnom cool. Les inconvénients : « la prison, la mort, tout ça. »",
      ],
      en: [
        "{a.first}, who hangs out downstairs with a pit bull and a fanny pack, invites you into the crew. “We do business. Big business.” The pit bull seems to agree.",
        "The neighborhood crew is recruiting. {a.first} lists the perks: protection, easy money, a cool nickname. The downsides: “prison, death, that kinda stuff.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Rejoindre le crew', en: 'Join the crew' },
        text: { fr: "J'ai rejoint le crew de {a.first}. Rite d'entrée : voler un panneau stop. Mon surnom : « Panneau ». J'espérais mieux.", en: "I joined {a.first}'s crew. Initiation: steal a stop sign. My street name: “Stop Sign.” I was hoping for better." },
        fx: { flag: 'cr_street_gang', heat: 10, counter: 'crimes', karma: -5, actorRole: 'friend' },
        mood: 'proud',
      },
      {
        label: { fr: 'Refuser', en: 'Decline' },
        text: { fr: "J'ai dit non merci. {a.first} a haussé les épaules. Le pitbull, lui, m'a fixé{|e} jusqu'à ce que je disparaisse au coin de la rue.", en: "I said no thanks. {a.first} shrugged. The pit bull stared at me until I disappeared around the corner." },
        fx: { stress: 2 },
      },
      {
        label: { fr: 'Les dénoncer', en: 'Report them' },
        text: { fr: "J'ai signalé le crew de {a.first} à la police. Trois jours plus tard, mon paillasson était en feu. Une coïncidence, sûrement.", en: "I reported {a.first}'s crew to the police. Three days later, my doormat was on fire. A coincidence, surely." },
        fx: { actorRole: 'enemy', karma: 3, happy: -5, visual: 'fire' },
        mood: 'shock',
      },
    ],
  },
  {
    id: 'cr_mafia_offer',
    icon: '🎩',
    cat: 'crime',
    rating: 1,
    scene: { place: 'casino', mood: 'neutral' },
    when: { age: [18, 75], noFlag: 'cr_mafia' },
    cooldown: 8,
    weight: 5,
    actor: { create: { role: 'acquaintance', age: [10, 35], gender: 'any' } },
    vars: { amount: [5000, 40000], big: [15000, 90000] },
    text: {
      fr: [
        "{a.first}, en costume trois pièces, se fait appeler « Parrain » même par son dentiste. {a:Il|Elle} t'offre {$amount} pour transporter « des valises » d'un point A à un point B. Sans préciser A, B, ni les valises.",
        "Dîner dans un restaurant italien vide. {a.first} coupe ses spaghettis au couteau, ce qui est déjà un crime. « J'ai un petit boulot pour toi. {$amount}. Ne pose pas de questions. »",
      ],
      en: [
        "{a.first}, in a three-piece suit, makes even the dentist call {a.him} “Godfather.” {a:He|She} offers you {$amount} to move “some suitcases” from point A to point B. No details on A, B, or the suitcases.",
        "Dinner in an empty Italian restaurant. {a.first} cuts spaghetti with a knife, which is already a crime. “I got a little job for you. {$amount}. Don't ask questions.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Accepter', en: 'Accept' },
        out: [
          { w: 3, text: { fr: "J'ai transporté les valises sans poser de questions. L'une faisait tic-tac, l'autre gémissait. J'ai touché {$amount} et une poignée de main qui m'a broyé trois doigts.", en: "I moved the suitcases, no questions asked. One was ticking, one was moaning. I got {$amount} and a handshake that crushed three fingers." }, fx: { money: 'amount', flag: 'cr_mafia', counter: 'crimes', heat: 15, karma: -6, visual: 'money' }, mood: 'happy' },
          { w: 1, text: { fr: "Contrôle routier au point A et demi. Les valises contenaient 40 kilos de « farine ». Le chien renifleur a fait une crise d'extase.", en: "Traffic stop at point A-and-a-half. The suitcases held 90 pounds of “flour.” The sniffer dog had a religious experience." }, fx: { flag: 'cr_mafia', arrest: 'drugtraffic', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Refuser poliment', en: 'Politely decline' },
        out: [
          { w: 2, text: { fr: "J'ai refusé poliment. {a.first} a souri : « Personne ne me refuse. Mais pour toi, je fais une exception. » Depuis, je regarde sous ma voiture tous les matins.", en: "I politely declined. {a.first} smiled: “Nobody says no to me. But for you, I'll make an exception.” I check under my car every morning now." }, fx: { stress: 8 } },
          { w: 1, text: { fr: "J'ai refusé. Le lendemain, j'ai trouvé une tête de cheval dans mon lit. En peluche. Le message est passé quand même.", en: "I said no. The next day I found a horse head in my bed. A plush one. The message still got through." }, fx: { stress: 12, happy: -5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Négocier le prix', en: 'Negotiate' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai négocié. {a.first} a éclaté de rire, m'a pincé la joue et a monté à {$big}. J'ai fait le job. Je suis maintenant « le neveu préféré ».", en: "I negotiated. {a.first} burst out laughing, pinched my cheek and went up to {$big}. I did the job. I'm now “the favorite nephew.”" }, fx: { money: 'big', flag: 'cr_mafia', counter: 'crimes', heat: 20, karma: -6, visual: 'money' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai voulu négocier. {a.first} a cassé un gressin très, très lentement en me fixant. J'ai accepté le prix de départ et transporté les valises en tremblant.", en: "I tried to negotiate. {a.first} snapped a breadstick very, very slowly while staring at me. I took the original price and moved the suitcases, shaking." }, fx: { money: 'amount', flag: 'cr_mafia', counter: 'crimes', heat: 15, stress: 6 } },
        ],
      },
    ],
  },
  {
    id: 'cr_found_gun',
    icon: '🔫',
    cat: 'crime',
    rating: 1,
    scene: { place: 'park', mood: 'shock' },
    when: { age: [14, 90], noFlag: 'cr_has_gun' },
    cooldown: 10,
    weight: 5,
    vars: { amount: [200, 900] },
    text: {
      fr: [
        "En sortant les poubelles, tu trouves un pistolet dans le conteneur à verre, entre une bouteille de rosé et un bocal de cornichons. Il est chargé. Les cornichons, non.",
        "Au fond d'un buisson du parc, quelque chose brille. Un revolver. À côté, un sandwich entamé. Quelqu'un a eu une journée compliquée.",
      ],
      en: [
        "Taking out the trash, you find a pistol in the glass recycling bin, between a bottle of rosé and a jar of pickles. It's loaded. The pickles aren't.",
        "Something glints at the bottom of a park bush. A revolver. Next to it, a half-eaten sandwich. Someone had a rough day.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le rapporter aux flics', en: 'Turn it in' },
        out: [
          { w: 2, text: { fr: "J'ai apporté l'arme au commissariat. Ils m'ont gardé{|e} quatre heures et pris mes empreintes « par routine ». La prochaine fois, je la laisse aux cornichons.", en: "I brought it to the station. They kept me four hours and took my prints “as routine.” Next time, I'm leaving it with the pickles." }, fx: { karma: 4, stress: 3 } },
          { w: 1, text: { fr: "J'ai rapporté le flingue. Il avait servi dans trois braquages. Les flics étaient si contents qu'ils ont failli me mettre les trois sur le dos.", en: "I turned in the gun. It had been used in three robberies. The cops were so thrilled they almost pinned all three on me." }, fx: { heat: 15, stress: 8 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Le garder', en: 'Keep it' },
        text: { fr: "J'ai gardé le pistolet sous mon matelas. Je dors mal : je sens le canon à travers les ressorts, comme la princesse au petit pois, version faits divers.", en: "I kept the gun under my mattress. I sleep badly: I can feel the barrel through the springs, like the Princess and the Pea, true-crime edition." },
        fx: { flag: 'cr_has_gun', heat: 5, stress: 4 },
      },
      {
        label: { fr: 'Le revendre', en: 'Sell it' },
        out: [
          { w: 2, text: { fr: "J'ai revendu l'arme à un type louche sur un parking pour {$amount}. Il m'a payé en pièces. Ça pesait plus lourd que le flingue.", en: "I sold it to a shady guy in a parking lot for {$amount}. He paid in coins. They weighed more than the gun." }, fx: { money: 'amount', counter: 'crimes', heat: 8, karma: -4 }, mood: 'happy' },
          { w: 1, text: { fr: "L'acheteur était un flic en civil. Il avait même un badge accroché à la ceinture. Je n'avais pas fait attention au badge.", en: "The buyer was an undercover cop. He even had a badge on his belt. I hadn't noticed the badge." }, fx: { jail: 2, visual: 'police' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'cr_basement',
    icon: '🏚️',
    cat: 'crime',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock' },
    when: { age: [18, 90] },
    cooldown: 10,
    weight: 5,
    actor: { create: { role: 'acquaintance', age: [5, 40], gender: 'any' } },
    vars: { amount: [200, 1000] },
    text: {
      fr: [
        "Ton voisin {a.first} passe ses nuits dans sa cave. Il en sort des bruits de scie, des odeurs chimiques et, une fois, ce qui ressemblait à un chant grégorien.",
        "Chaque soir à 23 h, {a.first} descend à la cave avec une bâche, une pelle et un sourire. Il remonte à 4 h sans la bâche. Mais toujours avec le sourire.",
      ],
      en: [
        "Your neighbor {a.first} spends nights in the basement. From down there: sawing noises, chemical smells and, once, what sounded like Gregorian chanting.",
        "Every night at 11 p.m., {a.first} goes down to the basement with a tarp, a shovel and a smile. Comes back up at 4 a.m. without the tarp. Still smiling.",
      ],
    },
    choices: [
      {
        label: { fr: 'Aller voir', en: 'Go take a look' },
        out: [
          { w: 2, text: { fr: "J'ai jeté un œil par le soupirail : {a.first} construit un circuit de trains miniatures. Gigantesque. J'ai eu droit à quatre heures de visite guidée. J'aurais préféré un cadavre.", en: "I peeked through the basement window: {a.first} is building a model railroad. A gigantic one. I got a four-hour guided tour. I'd have preferred a corpse." }, fx: { happy: -2, rel: 10 }, mood: 'sleepy' },
          { w: 1, text: { fr: "{a.first} cultive 300 plants de cannabis sous des lampes. Il m'a offert un sachet pour mon silence. Mon silence est désormais très, très détendu.", en: "{a.first} is growing 300 cannabis plants under lamps. Gave me a baggie for my silence. My silence is now very, very relaxed." }, fx: { addiction: ['drugs', 5], happy: 6, karma: -2 }, mood: 'party' },
          { w: 1, text: { fr: "{a.first} distille de la gnôle de patate. On a goûté. J'ai perdu la vue pendant 40 minutes et la notion du temps pour la semaine.", en: "{a.first} distills potato moonshine. We tasted it. I went blind for 40 minutes and lost track of time for the week." }, fx: { health: -6, addiction: ['alcohol', 5], happy: 3 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Appeler la police', en: 'Call the police' },
        out: [
          { w: 1, text: { fr: "J'ai appelé la police. Une unité d'élite a défoncé la porte de la cave. C'était un club de lecture qui lisait Proust à voix haute. Tout le monde a été très gêné.", en: "I called the police. A SWAT team kicked in the basement door. It was a book club reading Proust aloud. Everyone was very embarrassed." }, fx: { actorRole: 'enemy', happy: -3 }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai appelé les flics. Ils ont trouvé un labo de drogue et une collection de nains de jardin volés. {a.first} a été embarqué{a:|e} en peignoir. Prime de dénonciation : {$amount}.", en: "I called the cops. They found a drug lab and a stash of stolen garden gnomes. {a.first} was hauled off in a bathrobe. Snitch reward: {$amount}." }, fx: { money: 'amount', karma: 5, actorGone: true, visual: 'police' }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Ne pas m’en mêler', en: 'Mind my business' },
        text: { fr: "J'ai acheté des bouchons d'oreilles. Ce que fait {a.first} dans sa cave le regarde. Et ça le regardera jusqu'à la fin des temps.", en: "I bought earplugs. Whatever {a.first} does in that basement is {a.his} business. And it'll stay {a.his} business until the end of time." },
        fx: { stress: 2 },
      },
    ],
  },
  {
    id: 'cr_heist_invite',
    icon: '🗺️',
    cat: 'crime',
    rating: 2,
    scene: { place: 'office', mood: 'neutral' },
    when: { age: [18, 70] },
    cooldown: 8,
    weight: 5,
    actor: { create: { role: 'acquaintance', age: [-5, 15], gender: 'any' } },
    text: {
      fr: [
        "{a.first}, qui se fait appeler « le Cerveau », t'invite dans un entrepôt. Plans de banque, maquette en briques de construction, cinq types en lunettes de soleil la nuit. « Il nous manque un chauffeur. Ou un appât. On verra. »",
        "Un message anonyme : « Casse de banque. Gros butin. Viens seul{|e}. Apporte des chips. » Signé : le Cerveau, alias {a.first}, qui a aussi signé de son vrai nom par réflexe.",
      ],
      en: [
        "{a.first}, who goes by “the Brain,” invites you to a warehouse. Bank blueprints, a model built out of toy bricks, five guys wearing sunglasses at night. “We need a driver. Or bait. We'll see.”",
        "An anonymous message: “Bank heist. Big score. Come alone. Bring chips.” Signed: the Brain, a.k.a. {a.first}, who also signed their real name out of habit.",
      ],
    },
    choices: [
      {
        label: { fr: "J'en suis", en: "I'm in" },
        text: { fr: "J'ai serré la main du Cerveau. Le casse, c'est ce soir. J'ai mis mes meilleures baskets de course.", en: "I shook the Brain's hand. The heist is tonight. I put on my best running shoes." },
        fx: { stress: 5, chain: 'cr_heist_night' },
        mood: 'proud',
      },
      {
        label: { fr: 'Décliner', en: 'Pass' },
        text: { fr: "J'ai décliné poliment. Le Cerveau a dit « dommage, il y avait des sandwichs ». Je regrette surtout les sandwichs.", en: "I politely passed. The Brain said “shame, there were sandwiches.” I mostly regret the sandwiches." },
        fx: { happy: -1 },
      },
      {
        label: { fr: 'Les balancer', en: 'Rat them out' },
        text: { fr: "J'ai appelé la police en sortant. Descente musclée : c'était le tournage d'un film amateur. Je suis crédité{|e} au générique comme « Balance n° 1 ».", en: "I called the police on my way out. Full raid: it was an amateur film shoot. I'm in the end credits as “Snitch #1.”" },
        fx: { karma: 2, happy: -2, fame: 1 },
      },
    ],
  },
  {
    id: 'cr_heist_night',
    icon: '💰',
    cat: 'crime',
    rating: 2,
    chainOnly: true,
    scene: { place: 'office', mood: 'shock', fx: 'money' },
    vars: { amount: [20000, 150000], cut: [5000, 40000] },
    text: {
      fr: [
        "Minuit. Le Cerveau distribue des masques d'anciens présidents. Plan : conduit d'aération, perceuse, coffre, sortie avant que le vigile finisse sa sieste. Ton rôle a changé trois fois depuis ce matin.",
        "Le casse commence. Le vigile ronfle, la perceuse chauffe, et un membre de l'équipe vient d'avouer qu'il est claustrophobe. Dans le conduit d'aération.",
      ],
      en: [
        "Midnight. The Brain hands out ex-president masks. The plan: air vent, drill, vault, out before the guard finishes his nap. Your role has changed three times since this morning.",
        "The heist begins. The guard is snoring, the drill is heating up, and a crew member just admitted he's claustrophobic. Inside the air vent.",
      ],
    },
    choices: [
      {
        label: { fr: 'Foncer au coffre', en: 'Go for the vault' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "Le casse a marché comme au cinéma. Ma part : {$amount} en petites coupures qui sentent la cave. J'ai pleuré de joie dans un sac de billets.", en: "The heist went like a movie. My share: {$amount} in small bills that smell like a basement. I wept with joy into a bag of cash." }, fx: { money: 'amount', counter: 'crimes', heat: 40, karma: -10, visual: 'money' }, mood: 'party' },
          { w: 1, text: { fr: "L'alarme a sonné. Le Cerveau a été le premier à fuir, en me laissant les sacs et son masque. La police m'a trouvé{|e} assis{|e} sur le butin, en train de compter.", en: "The alarm went off. The Brain was first out the door, leaving me the bags and his mask. The police found me sitting on the loot, counting." }, fx: { arrest: 'bank', counter: 'crimes', visual: 'police' }, mood: 'shock' },
          { w: 0.4, text: { fr: "Le perceur a mal dosé la dynamite. Le coffre a tenu bon. Moi, j'ai été réparti{|e} sur trois étages et dans un distributeur de boissons.", en: "The safecracker got the dynamite dose wrong. The vault held. I, however, was distributed across three floors and a vending machine." }, fx: { die: { fr: 'pulvérisé{|e} par la dynamite pendant un casse de banque raté', en: 'splattered by dynamite during a botched bank heist' }, visual: 'explosion' } },
        ],
      },
      {
        label: { fr: 'Rester au volant', en: 'Stay in the car' },
        out: [
          { w: 2, text: { fr: "Je suis resté{|e} au volant. Les autres sont ressortis en courant avec les sacs, j'ai démarré en faisant crisser les pneus. Ma part de chauffeur : {$cut}.", en: "I stayed at the wheel. The others ran out with the bags, I peeled out screeching. My driver's cut: {$cut}." }, fx: { money: 'cut', counter: 'crimes', heat: 25, karma: -6, visual: 'money' }, mood: 'happy' },
          { w: 1, text: { fr: "J'attendais dans la voiture. Un agent de la fourrière m'a collé une amende pour stationnement gênant, puis il a vu les cagoules sur la banquette.", en: "I waited in the car. A parking officer gave me a ticket for illegal parking, then noticed the ski masks on the back seat." }, fx: { arrest: 'bank', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: "Trahir l'équipe", en: 'Betray the crew' },
        text: { fr: "J'ai prévenu la police à la dernière seconde contre l'immunité. Depuis l'arrière du fourgon, le Cerveau m'a fixé{|e} en mimant très lentement : « T'es mort{|e}. »", en: "I tipped off the police at the last second in exchange for immunity. From the back of the van, the Brain stared at me, slowly mouthing: “You're dead.”" },
        fx: { actorRole: 'enemy', flag: 'cr_snitch', karma: -2, heat: -10, visual: 'police' },
      },
    ],
  },
  {
    id: 'cr_mafia_favor',
    icon: '⚰️',
    cat: 'crime',
    rating: 2,
    scene: { place: 'park', mood: 'shock', fx: 'gore' },
    when: { age: [18, 90], flag: 'cr_mafia' },
    cooldown: 4,
    text: {
      fr: [
        "Le Parrain a un service à te demander. Dans ton coffre : un tapis roulé, très lourd, avec deux pieds en chaussettes qui dépassent. « Va le planter dans la forêt. Et rapporte le tapis, c'est un persan. »",
        "Coup de fil à 3 h du matin : « Le neveu a fait une bêtise. Il y a un monsieur dans la baignoire. Apporte de la javel, une scie et de la musique douce. »",
      ],
      en: [
        "The Godfather needs a favor. In your trunk: a rolled-up rug, very heavy, with two socked feet sticking out. “Go plant him in the woods. And bring back the rug, it's Persian.”",
        "Phone call at 3 a.m.: “The nephew made a mistake. There's a gentleman in the bathtub. Bring bleach, a saw and some smooth jazz.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire le job', en: 'Do the job' },
        out: [
          { w: 3, text: { fr: "J'ai creusé toute la nuit sous la pluie. Le tapis est revenu propre, le monsieur est resté là-bas. Le Parrain m'a offert une montre en or encore tiède.", en: "I dug all night in the rain. The rug came back clean, the gentleman stayed behind. The Godfather gave me a gold watch that was still warm." }, fx: { asset: 'l_watch', karma: -15, counter: 'crimes', heat: 10, stress: 10 }, mood: 'neutral' },
          { w: 1, text: { fr: "Pendant que je creusais, le « mort » s'est réveillé et m'a mordu le mollet. J'ai dû finir le travail à la pelle. Il y a eu des éclaboussures. Beaucoup. Jusque dans mes oreilles.", en: "While I was digging, the “corpse” woke up and bit my calf. I had to finish the job with the shovel. There was splatter. A lot. Even in my ears." }, fx: { health: -5, karma: -20, counter: ['crimes', 'violent'], stress: 12, visual: 'gore' }, mood: 'sick' },
          { w: 1, text: { fr: "Un joggeur matinal m'a vu{|e} avec la pelle et les pieds qui dépassaient. Il a filmé. Il a 2 millions de vues. Moi, un rendez-vous au tribunal.", en: "An early-morning jogger saw me with the shovel and the feet sticking out. He filmed it. He's got 2 million views. I've got a court date." }, fx: { arrest: 'murder', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Tout balancer aux flics', en: 'Go to the cops' },
        out: [
          { w: 1, text: { fr: "J'ai tout balancé à la police. Protection des témoins : je m'appelle désormais Gérard et j'habite au-dessus d'un magasin de matelas à 800 km de chez moi.", en: "I told the police everything. Witness protection: my name is now Gerald and I live above a mattress store 500 miles from home." }, fx: { unflag: 'cr_mafia', karma: 8, happy: -6, heat: -30 } },
          { w: 1, text: { fr: "J'ai tout balancé à la police. Le commissaire déjeune le dimanche avec le Parrain. Il m'a rendu mon portefeuille, vide, avec un conseil gratuit : déménager.", en: "I told the police everything. The police chief has Sunday lunch with the Godfather. He handed back my wallet, empty, with free advice: move." }, fx: { unflag: 'cr_mafia', stress: 15, money: -2000 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Refuser', en: 'Refuse' },
        text: { fr: "J'ai dit au Parrain que je ne faisais pas les enterrements. Il a hoché la tête. Le lendemain, ma voiture a explosé. Pas moi : j'étais aux toilettes. La constipation m'a sauvé la vie.", en: "I told the Godfather I don't do burials. He nodded. Next day, my car exploded. Not me: I was on the toilet. Constipation saved my life." },
        fx: { unflag: 'cr_mafia', loseAsset: 'car', stress: 15, visual: 'explosion' },
        mood: 'shock',
      },
    ],
  },
  {
    id: 'cr_informant_burned',
    icon: '🥐',
    cat: 'crime',
    rating: 2,
    chainOnly: true,
    scene: { place: 'apartment', mood: 'shock', fx: 'gore' },
    when: { flag: 'cr_informant', prison: false, rating: 2 },
    text: {
      fr: [
        "Ta couverture d'indic a sauté : quelqu'un a oublié ton dossier « Croissant » sur la photocopieuse du commissariat. Ce soir, trois types en survêtement t'attendent en bas avec des battes de baseball. Personne ne joue au baseball ici.",
        "Un message sur ton téléphone : « Salut Croissant 🥐 ». Puis un caillou dans ta fenêtre. Puis trois silhouettes avec des battes. Les flics t'ont grillé{|e} pour économiser un timbre.",
      ],
      en: [
        "Your informant cover is blown: someone left your “Croissant” file on the station photocopier. Tonight, three guys in tracksuits are waiting downstairs with baseball bats. Nobody here plays baseball.",
        "A text on your phone: “Hi Croissant 🥐.” Then a rock through your window. Then three silhouettes holding bats. The cops burned you to save on a stamp.",
      ],
    },
    choices: [
      {
        label: { fr: 'Fuir par la fenêtre', en: 'Out the window' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai sauté du premier étage dans une haie de thuyas. Je me suis empalé{|e} une branche dans la fesse, mais j'ai semé les battes.", en: "I jumped from the second floor into a hedge. Impaled my butt on a branch, but I lost the bats." }, fx: { health: -8, unflag: 'cr_informant' }, mood: 'shock' },
          { w: 0.4, text: { fr: "J'ai sauté par la fenêtre. Mauvais étage : le cinquième. J'ai atterri sur leur voiture. La voiture et moi avons rendu l'âme dans un grand bruit de tôle.", en: "I jumped out the window. Wrong floor: the sixth. I landed on their car. The car and I both died in a great crunch of sheet metal." }, fx: { die: { fr: "tombé{|e} du cinquième étage en fuyant les gens que j'avais balancés", en: 'fell six floors fleeing the people I had snitched on' }, visual: 'gore' } },
        ],
      },
      {
        label: { fr: "Appeler l'inspecteur", en: 'Call my handler' },
        text: { fr: "J'ai appelé l'inspecteur. Messagerie : « Je suis en congé jusqu'au 15. » Les types m'ont pété les deux genoux et sont repartis avec mon micro-ondes.", en: "I called my handler. Voicemail: “I'm on vacation until the 15th.” The guys shattered both my knees and left with my microwave." },
        fx: { health: -20, unflag: 'cr_informant', visual: 'gore' },
        mood: 'cry',
      },
      {
        label: { fr: 'Me battre', en: 'Fight' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai attrapé une poêle en fonte et fait un home run sur le premier. Ses dents ont rebondi sur le palier comme du pop-corn. Les deux autres ont détalé.", en: "I grabbed a cast-iron pan and hit a home run on the first guy. His teeth bounced across the landing like popcorn. The other two bolted." }, fx: { health: -5, karma: -3, unflag: 'cr_informant', counter: 'violent', visual: 'gore' }, mood: 'proud' },
          { w: 1, text: { fr: "Trois contre un. Ils m'ont tabassé{|e} comme une piñata d'anniversaire. Des choses sont sorties de moi qui n'auraient jamais dû voir la lumière du jour.", en: "Three on one. They beat me like a birthday piñata. Things came out of me that were never meant to see daylight." }, fx: { health: -25, unflag: 'cr_informant', visual: 'gore' }, mood: 'cry' },
        ],
      },
    ],
  },
  {
    id: 'cr_road_rage',
    icon: '🤬',
    cat: 'crime',
    rating: 2,
    scene: { place: 'park', mood: 'angry' },
    when: { age: [17, 90], asset: 'car' },
    cooldown: 5,
    actor: STRANGER,
    text: {
      fr: [
        "Un SUV te fait une queue de poisson au feu rouge. {a.first} en sort en hurlant, une batte de cricket à la main et une veine qui palpite sur le front comme un ver de terre en panique.",
        "Tu klaxonnes une fois. Une seule. {a.first} descend de sa camionnette, torse nu, un démonte-pneu à la main, en hurlant des insultes sur ta mère et ta carrosserie.",
      ],
      en: [
        "An SUV cuts you off at a red light. {a.first} gets out screaming, a cricket bat in hand and a vein throbbing on {a.his} forehead like a panicked earthworm.",
        "You honk once. Just once. {a.first} climbs out of a van, shirtless, tire iron in hand, screaming insults about your mother and your paint job.",
      ],
    },
    choices: [
      {
        label: { fr: 'Sortir aussi', en: 'Get out too' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai esquivé et collé à {a.first} un coup de tête qui lui a fait avaler son chewing-gum et deux molaires. Tout le carrefour a klaxonné pour m'encourager.", en: "I ducked and headbutted {a.first} so hard {a:he|she} swallowed {a.his} gum and two molars. The whole intersection honked in support." }, fx: { happy: 6, karma: -4, counter: 'violent', visual: 'gore' }, mood: 'proud' },
          { w: 1, text: { fr: "{a.first} m'a explosé le rétroviseur, puis la rotule. J'ai fini étalé{|e} sur mon capot comme une décoration de Noël sanglante.", en: "{a.first} smashed my side mirror, then my kneecap. I ended up sprawled across my hood like a bloody Christmas ornament." }, fx: { health: -18, visual: 'gore' }, mood: 'cry' },
          { w: 0.5, text: { fr: "La police est arrivée en pleine bagarre. On a été menottés au même banc du commissariat, à se faire la gueule pendant six heures.", en: "The police showed up mid-brawl. We got cuffed to the same bench at the station and sulked at each other for six hours." }, fx: { heat: 20, stress: 6, visual: 'police' }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Verrouiller les portes', en: 'Lock the doors' },
        text: { fr: "J'ai verrouillé les portes et souri très fort. {a.first} a tapé ma vitre jusqu'à se casser un ongle, puis est reparti{a:|e} en pleurant. Le feu était vert depuis longtemps.", en: "I locked the doors and smiled really hard. {a.first} pounded on my window until {a:he|she} broke a nail, then left crying. The light had been green for ages." },
        fx: { happy: 4 },
        mood: 'happy',
      },
      {
        label: { fr: 'Appeler le crew', en: 'Call the crew' },
        if: { flag: 'cr_street_gang' },
        text: { fr: "J'ai passé un coup de fil. En deux minutes, quatre scooters ont encerclé le SUV. {a.first} est rentré{a:|e} à pied. En chaussettes. Sans le SUV.", en: "I made one call. Two minutes later, four scooters surrounded the SUV. {a.first} walked home. In socks. Without the SUV." },
        fx: { happy: 8, karma: -5, heat: 8, counter: 'crimes' },
        mood: 'proud',
      },
    ],
  },
  {
    id: 'cr_mugged',
    icon: '🔪',
    cat: 'crime',
    rating: 2,
    scene: { place: 'park', mood: 'shock', fx: 'gore' },
    when: { age: [14, 90] },
    cooldown: 6,
    vars: { amount: [20, 400] },
    text: {
      fr: [
        "Une ruelle sombre, un réverbère en panne, et un type avec un cutter qui réclame « ton portefeuille, ton téléphone et ta veste, elle est trop belle ».",
        "Un gamin en trottinette électrique te braque avec un tournevis. « La thune ! » Il a l'air d'avoir quatorze ans et beaucoup plus de détermination que toi.",
      ],
      en: [
        "A dark alley, a dead streetlight, and a guy with a box cutter asking for “your wallet, your phone, and your jacket, it's really nice.”",
        "A kid on an electric scooter holds you up with a screwdriver. “Cash!” He looks fourteen and far more determined than you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout donner', en: 'Hand it all over' },
        text: { fr: "J'ai tout donné, veste comprise. Il m'a remercié{|e} et m'a conseillé de déménager dans un meilleur quartier. Il avait raison.", en: "I handed it all over, jacket included. He thanked me and suggested I move to a better neighborhood. He had a point." },
        fx: { money: '-amount', happy: -8 },
        mood: 'sad',
      },
      {
        label: { fr: 'Résister', en: 'Fight back' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "Je lui ai mis un coup de genou là où ça compte. Il s'est plié en deux en couinant comme un jouet pour chien. Je suis reparti{|e} avec SON portefeuille.", en: "I kneed him where it counts. He folded in half, squeaking like a dog toy. I walked off with HIS wallet." }, fx: { money: 'amount', happy: 10 }, mood: 'proud' },
          { w: 2, text: { fr: "J'ai résisté. Il m'a ouvert la joue au cutter, j'ai pissé le sang comme une fontaine de jardin, mais j'ai gardé ma veste. Et une cicatrice de pirate.", en: "I fought back. He sliced my cheek open, I spurted blood like a garden fountain, but I kept my jacket. And a pirate scar." }, fx: { health: -15, looks: -4, visual: 'gore' }, mood: 'cry' },
          { w: 0.3, text: { fr: "J'ai voulu jouer les héros. Le cutter a trouvé mon artère fémorale. J'ai repeint la ruelle en rouge en douze secondes chrono.", en: "I tried to be a hero. The blade found my femoral artery. I painted the alley red in twelve seconds flat." }, fx: { die: { fr: 'vidé{|e} de mon sang dans une ruelle pour une veste', en: 'bled out in an alley over a jacket' }, visual: 'gore' } },
        ],
      },
      {
        label: { fr: 'Sortir le flingue', en: 'Pull the gun' },
        if: { flag: 'cr_has_gun' },
        text: { fr: "J'ai sorti le flingue trouvé dans les poubelles. Le type a hurlé, lâché son arme et détalé si vite qu'il a perdu une chaussure. Je l'ai gardée. Pointure 44.", en: "I pulled out the gun from the trash. The guy screamed, dropped his blade and ran so fast he lost a shoe. I kept it. Size 11." },
        fx: { happy: 8, heat: 5 },
        mood: 'proud',
      },
      {
        label: { fr: 'Faire le mort', en: 'Play dead' },
        text: { fr: "Je me suis effondré{|e} en faisant le mort. Il m'a fait les poches quand même, puis il m'a mis{|e} en position latérale de sécurité. Un braqueur secouriste.", en: "I collapsed and played dead. He went through my pockets anyway, then put me in the recovery position. A mugger with first-aid training." },
        fx: { money: '-amount', happy: -3 },
      },
    ],
  },
  {
    id: 'cr_bad_cop',
    icon: '🍩',
    cat: 'crime',
    rating: 2,
    scene: { place: 'park', mood: 'angry', fx: 'police' },
    when: { age: [16, 90] },
    cooldown: 5,
    vars: { amount: [50, 300] },
    text: {
      fr: [
        "Contrôle d'identité au coin de ta rue. Le policier tapote ta carte avec sa lampe. « Ça va coûter cher, ce regard insolent. Sauf si on s'arrange. » Il a du sucre glace sur la moustache et la main déjà tendue.",
        "Un flic te contrôle pour « traversée suspecte ». Le passage piéton était vert. Il soupire : « On peut faire ça vite, ou on peut faire ça au poste pendant neuf heures. »",
      ],
      en: [
        "ID check on your corner. The officer taps your card with his flashlight. “That insolent look's gonna cost you. Unless we work something out.” He has powdered sugar on his mustache and his hand already out.",
        "A cop stops you for “suspicious crossing.” The walk signal was on. He sighs: “We can do this fast, or we can do this at the station for nine hours.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Payer le bakchich', en: 'Pay the bribe' },
        text: { fr: "J'ai glissé {$amount} dans la main du flic. Il a dit « bonne journée, citoyen » et s'est offert une douzaine de beignets. La police de proximité, la vraie.", en: "I slipped {$amount} into the cop's hand. He said “have a nice day, citizen” and bought himself a dozen donuts. Community policing at its finest." },
        fx: { money: '-amount', karma: -2, happy: -3 },
      },
      {
        label: { fr: 'Filmer la scène', en: 'Film it' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai tout filmé. 3 millions de vues. Le flic a été « sanctionné » : muté dans un bureau avec une meilleure machine à café. Moi, j'ai reçu un contrôle fiscal mystérieux le mois suivant.", en: "I filmed it all. 3 million views. The cop was “disciplined”: transferred to an office with a better coffee machine. I got a mysterious tax audit the next month." }, fx: { fame: 3, followers: 30000, happy: 3, stress: 5 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai sorti mon téléphone. Il me l'a confisqué « comme pièce à conviction ». Puis il est tombé dans une flaque. Puis sous sa botte. Plusieurs fois.", en: "I took out my phone. He confiscated it “as evidence.” Then it fell in a puddle. Then under his boot. Several times." }, fx: { happy: -6, heat: 10 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Refuser', en: 'Refuse' },
        text: { fr: "J'ai refusé. Il m'a fouillé{|e} pendant 40 minutes, trouvé un trombone et m'a embarqué{|e} pour « port d'arme ». Le juge a ri. Le flic, pas du tout.", en: "I refused. He frisked me for 40 minutes, found a paperclip and booked me for “carrying a weapon.” The judge laughed. The cop did not." },
        fx: { heat: 15, stress: 8, karma: 2, visual: 'police' },
        mood: 'angry',
      },
    ],
  },

  // ───────────────────────────── criminal record ─────────────────────────────
  {
    id: 'cr_hood_rep',
    icon: '😎',
    cat: 'crime',
    scene: { place: 'park', mood: 'proud' },
    when: { age: [16, 70], record: true },
    cooldown: 5,
    text: {
      fr: [
        "Depuis ta sortie de prison, les gamins du quartier te regardent comme une légende. L'un d'eux te demande un autographe sur son cartable. Un autre veut savoir s'il est vrai que tu as mordu un gardien.",
        "Au café du coin, on t'appelle « l'Ancien ». Le patron te sert sans que tu commandes et ne te fait jamais payer. Par respect. Ou par peur. Tu n'as pas demandé.",
      ],
      en: [
        "Since you got out of prison, the neighborhood kids look at you like a legend. One asks you to sign his backpack. Another wants to know if it's true you bit a guard.",
        "At the corner café they call you “the Veteran.” The owner serves you without you ordering and never charges. Out of respect. Or fear. You didn't ask.",
      ],
    },
    choices: [
      {
        label: { fr: 'Jouer la légende', en: 'Play the legend' },
        text: { fr: "J'ai raconté mes années de taule en les enjolivant à peine. Apparemment, j'ai combattu un ours. Les gamins m'apportent des canettes en offrande.", en: "I told my prison stories, barely embellished. Apparently I fought a bear. The kids bring me soda cans as offerings." },
        fx: { happy: 6, fame: 2, karma: -2 },
        mood: 'proud',
      },
      {
        label: { fr: 'Faire la morale', en: 'Give a lecture' },
        text: { fr: "Je leur ai expliqué que le crime ne paie pas. Un gamin m'a demandé combien je gagnais maintenant. J'ai changé de sujet.", en: "I explained that crime doesn't pay. One kid asked how much I make now. I changed the subject." },
        fx: { karma: 5, happy: -1 },
      },
      {
        label: { fr: 'Signer le cartable', en: 'Sign the backpack' },
        text: { fr: "J'ai signé le cartable. Sa mère m'a crié dessus depuis le balcon pendant cinq minutes. Puis elle m'a demandé un selfie.", en: "I signed the backpack. His mom yelled at me from the balcony for five minutes. Then asked for a selfie." },
        fx: { happy: 4, fame: 1 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'cr_job_reject',
    icon: '📄',
    cat: 'crime',
    scene: { place: 'office', mood: 'sad' },
    when: { age: [18, 65], record: true, job: false },
    cooldown: 4,
    text: {
      fr: [
        "Entretien d'embauche. Tout se passe bien jusqu'à LA question : « Avez-vous un casier judiciaire ? » Le recruteur a déjà ton dossier sous les yeux. Il l'a surligné en jaune.",
        "Le formulaire de candidature comporte une case : « Condamnations passées ». Elle fait deux centimètres. Il t'en faudrait une page.",
      ],
      en: [
        "Job interview. Everything goes great until THE question: “Do you have a criminal record?” The recruiter already has your file in front of him. He highlighted it in yellow.",
        "The application form has a box: “Past convictions.” It's one inch wide. You'd need a full page.",
      ],
    },
    choices: [
      {
        label: { fr: 'Dire la vérité', en: 'Tell the truth' },
        out: [
          { w: 1, text: { fr: "J'ai tout avoué. Le recruteur a été touché par ma franchise et m'a proposé une période d'essai. C'est un début.", en: "I confessed everything. The recruiter was touched by my honesty and offered me a trial period. It's a start." }, fx: { happy: 6, karma: 3, open: 'jobs' }, mood: 'happy' },
          { w: 2, text: { fr: "J'ai dit la vérité. Il a souri, hoché la tête et m'a raccompagné{|e} jusqu'à la sortie « pour vérifier que je ne volais pas l'agrafeuse ».", en: "I told the truth. He smiled, nodded and walked me to the exit “to make sure I didn't steal the stapler.”" }, fx: { happy: -6 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Mentir', en: 'Lie' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai dit que c'était un homonyme. Il m'a cru{|e}. Je commence lundi, et je dois juste me souvenir que je n'ai jamais été en prison. Facile.", en: "I said it was someone with the same name. He bought it. I start Monday, I just have to remember I was never in prison. Easy." }, fx: { happy: 4, karma: -3, open: 'jobs' }, mood: 'proud' },
          { w: 2, text: { fr: "J'ai menti. Il a sorti ma photo d'identité judiciaire. Je souriais dessus. Pourquoi est-ce que je souriais ?", en: "I lied. He pulled out my mugshot. I was smiling in it. Why was I smiling?" }, fx: { happy: -8 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Vanter mes compétences', en: 'Pitch my skills' },
        text: { fr: "J'ai mis en avant mes compétences : crochetage, négociation sous pression, gestion de stock de nouilles. Il a pris des notes. Puis il a appelé la sécurité.", en: "I highlighted my skills: lockpicking, negotiating under pressure, noodle inventory management. He took notes. Then called security." },
        fx: { happy: -4, smarts: 1 },
      },
    ],
  },
  {
    id: 'cr_excon_meetup',
    icon: '🍺',
    cat: 'crime',
    rating: 1,
    scene: { place: 'party', mood: 'party' },
    when: { age: [18, 80], record: true },
    cooldown: 5,
    actor: CELLMATE,
    vars: { amount: [1000, 8000] },
    text: {
      fr: [
        "Tu croises {a.first}, ton ancien codétenu, au rayon surgelés. {a:Il|Elle} t'invite à boire un verre « pour le bon vieux temps ». Traduction : {a:il|elle} a un plan.",
        "{a.first}, de ton ancienne cellule, t'a retrouvé{|e} sur les réseaux. Message : « Bière ce soir ? J'ai un truc à te proposer. Rien d'illégal. Enfin, presque. »",
      ],
      en: [
        "You bump into {a.first}, your old cellmate, in the frozen food aisle. {a:He|She} invites you for a drink “for old times' sake.” Translation: {a:he|she} has a plan.",
        "{a.first}, from your old cell, found you online. Message: “Beer tonight? Got something for you. Nothing illegal. Well, almost.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Juste un verre', en: 'Just a drink' },
        out: [
          { w: 2, text: { fr: "On a bu des bières en se remémorant nos meilleures fouilles au corps. {a.first} a pleuré en parlant de la purée du jeudi. Une vraie amitié est née.", en: "We drank beers reminiscing about our best strip searches. {a.first} cried talking about Thursday's mashed potatoes. A real friendship was born." }, fx: { actorRole: 'friend', happy: 6, addiction: ['alcohol', 3] }, mood: 'party' },
          { w: 1, text: { fr: "Au troisième verre, {a.first} m'a proposé de braquer un fourgon blindé « vite fait ». J'ai prétexté une envie pressante et je suis sorti{|e} par la fenêtre des toilettes.", en: "Three drinks in, {a.first} suggested we rob an armored truck “real quick.” I faked a bathroom emergency and climbed out the restroom window." }, fx: { stress: 4, rel: -5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Écouter son plan', en: 'Hear the plan' },
        out: [
          { w: 1, text: { fr: "Le plan : cambrioler la villa du juge qui nous a condamnés. On a pris {$amount} en liquide et sa collection de perruques. Le crime, c'est comme le vélo.", en: "The plan: burgle the villa of the judge who sentenced us. We took {$amount} in cash and his wig collection. Crime is like riding a bike." }, fx: { money: 'amount', counter: 'crimes', heat: 15, karma: -6, actorRole: 'friend', visual: 'money' }, mood: 'party' },
          { w: 1, text: { fr: "Le plan a foiré en dix minutes : le juge était chez lui, en peignoir, avec un fusil. {a.first} a donné mon nom aux flics avant même qu'on lui pose la question.", en: "The plan fell apart in ten minutes: the judge was home, in a bathrobe, with a shotgun. {a.first} gave the cops my name before they even asked." }, fx: { arrest: 'burglary', actorRole: 'enemy', visual: 'police' }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Faire semblant de rien', en: 'Pretend not to know them' },
        text: { fr: "J'ai fait mine de ne pas reconnaître {a.first}. {a:Il|Elle} a crié mon numéro d'écrou dans tout le supermarché. Les clients se sont écartés comme la mer Rouge.", en: "I pretended not to recognize {a.first}. {a:He|She} yelled my inmate number across the whole supermarket. Shoppers parted like the Red Sea." },
        fx: { happy: -4 },
      },
    ],
  },
  {
    id: 'cr_dating_record',
    icon: '🔍',
    cat: 'crime',
    rating: 1,
    scene: { place: 'party', mood: 'love' },
    when: { age: [18, 70], record: true, noHas: 'lover' },
    cooldown: 5,
    actor: { create: { role: 'acquaintance', age: [-5, 5], gender: 'attracted' } },
    text: {
      fr: [
        "Premier rendez-vous avec {a.first}. Tout se passe bien, jusqu'à ce qu'{a:il|elle} pose son téléphone sur la table, ouvert sur ta photo d'identité judiciaire. « Alors… c'est vrai ? »",
        "En plein dîner, {a.first} sort une feuille imprimée : ton casier judiciaire, annoté au stabilo. « J'ai quelques questions avant le dessert. »",
      ],
      en: [
        "First date with {a.first}. It's going great, until {a:he|she} sets {a.his} phone on the table, open to your mugshot. “So… is it true?”",
        "Mid-dinner, {a.first} pulls out a printout: your criminal record, annotated in highlighter. “I have a few questions before dessert.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout raconter', en: 'Tell everything' },
        out: [
          { w: 1, text: { fr: "J'ai tout raconté. {a.first} a trouvé ça très excitant. On a fini la soirée chez moi à jouer avec de vraies menottes. Sans les clés. Le serrurier a été très discret.", en: "I told everything. {a.first} found it very exciting. We ended the night at my place playing with real handcuffs. No keys. The locksmith was very discreet." }, fx: { actorRole: 'partner', happy: 10, rel: 20 }, mood: 'love' },
          { w: 1, text: { fr: "J'ai raconté ma vie de taulard{|e}. {a.first} est allé{a:|e} « aux toilettes » et n'est jamais revenu{a:|e}. L'addition, elle, est restée.", en: "I told my jailbird story. {a.first} went “to the restroom” and never came back. The check stayed, though." }, fx: { happy: -6 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Accuser mon jumeau', en: 'Blame my evil twin' },
        text: { fr: "J'ai dit que c'était mon jumeau maléfique. {a.first} a fait semblant de me croire. On a fini le dessert en silence.", en: "I said it was my evil twin. {a.first} pretended to believe me. We finished dessert in silence." },
        fx: { happy: -2 },
      },
      {
        label: { fr: 'Retourner la question', en: 'Turn the tables' },
        text: { fr: "J'ai demandé à {a.first} pourquoi {a:il|elle} vérifiait le casier de ses rencards. {a:Il|Elle} a rougi : {a:il|elle} a un dossier aussi. Deux récidivistes, un tiramisu. L'amour.", en: "I asked {a.first} why {a:he|she} background-checks dates. {a:He|She} blushed: {a:he|she} has a record too. Two repeat offenders, one tiramisu. Love." },
        fx: { actorRole: 'partner', happy: 8, rel: 15 },
        mood: 'love',
      },
    ],
  },
  {
    id: 'cr_documentary',
    icon: '🎥',
    cat: 'crime',
    rating: 1,
    scene: { place: 'studio', mood: 'proud' },
    when: { age: [18, 90], counter: { crimes: [5, 999] } },
    once: true,
    weight: 4,
    vars: { amount: [2000, 15000] },
    text: {
      fr: [
        "Une journaliste veut tourner un documentaire sur ta carrière criminelle. Titre provisoire : « {first} {last}, le fléau de {city} ». Elle promet de flouter ton visage. Peut-être.",
        "Une plateforme de streaming veut faire une série documentaire sur toi. Huit épisodes. Musique angoissante, drones au-dessus de {city}, et ta grand-tante interviewée en larmes.",
      ],
      en: [
        "A journalist wants to shoot a documentary about your criminal career. Working title: “{first} {last}: The Scourge of {city}.” She promises to blur your face. Maybe.",
        "A streaming platform wants a docuseries about you. Eight episodes. Ominous music, drone shots over {city}, and your great-aunt interviewed in tears.",
      ],
    },
    choices: [
      {
        label: { fr: 'Accepter', en: 'Accept' },
        text: { fr: "J'ai accepté. J'ai joué mon propre rôle, en mieux éclairé. On m'a même maquillé{|e}.", en: "I agreed. I played myself, with better lighting. They even did my makeup." },
        fx: { fame: 5, heat: 10, flag: 'cr_documentary', schedule: { key: 'cr_doc_release', years: 1 } },
        mood: 'proud',
      },
      {
        label: { fr: 'Exiger un cachet', en: 'Demand a fee' },
        text: { fr: "J'ai exigé {$amount} et le droit de choisir la musique. Ce sera du saxophone. Énormément de saxophone.", en: "I demanded {$amount} and the right to pick the music. It'll be saxophone. So much saxophone." },
        fx: { money: 'amount', fame: 4, heat: 10, flag: 'cr_documentary', schedule: { key: 'cr_doc_release', years: 1 } },
        mood: 'happy',
      },
      {
        label: { fr: 'Refuser', en: 'Refuse' },
        text: { fr: "J'ai refusé. Elle a fait le documentaire quand même, sur mon voisin, qui a volé un yaourt en 2004. Il est célèbre maintenant.", en: "I said no. She made the documentary anyway, about my neighbor, who once stole a yogurt in 2004. He's famous now." },
        fx: { happy: -3 },
      },
    ],
  },
  {
    id: 'cr_doc_release',
    icon: '📺',
    cat: 'crime',
    rating: 1,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock' },
    when: { flag: 'cr_documentary', prison: false },
    text: {
      fr: [
        "Le documentaire sur ta vie est sorti. Numéro un des tendances. Titre final : « {first} : génie du crime ou simple crétin ? » Le public a voté. Massivement.",
        "Ça y est, ton documentaire est en ligne. Ton téléphone vibre sans arrêt depuis 6 h du matin. Ta mère t'a envoyé un seul message : « Pourquoi ? »",
      ],
      en: [
        "The documentary about your life is out. Number one trending. Final title: “{first}: Criminal Genius or Total Moron?” The public has voted. Overwhelmingly.",
        "Your documentary just dropped. Your phone hasn't stopped buzzing since 6 a.m. Your mom sent a single message: “Why?”",
      ],
    },
    choices: [
      {
        label: { fr: 'Regarder', en: 'Watch it' },
        out: [
          { w: 1, text: { fr: "Le montage me fait passer pour un cerveau du crime. Des fans m'écrivent. Une marque de baskets veut me sponsoriser. La police aussi a des questions.", en: "The edit makes me look like a criminal mastermind. Fans write to me. A sneaker brand wants to sponsor me. The police also have questions." }, fx: { fame: 12, followers: 50000, happy: 10, heat: 20, unflag: 'cr_documentary' }, mood: 'proud' },
          { w: 1, text: { fr: "Ils ont gardé la scène où je pleure parce que j'ai oublié ma cagoule. C'est devenu un mème. Partout. Pour toujours.", en: "They kept the scene where I cry because I forgot my ski mask. It became a meme. Everywhere. Forever." }, fx: { fame: 8, followers: 20000, happy: -10, unflag: 'cr_documentary' }, mood: 'cry' },
          { w: 1, text: { fr: "Le documentaire montre clairement mon visage, mon adresse et deux braquages jamais élucidés. La police a regardé la saison entière en une nuit.", en: "The documentary clearly shows my face, my address and two unsolved robberies. The police binge-watched the whole season in one night." }, fx: { fame: 6, arrest: 'robstore', unflag: 'cr_documentary', visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Ne pas regarder', en: "Don't watch" },
        text: { fr: "Je n'ai pas regardé. Je l'ai appris par ma boulangère, qui me fait désormais payer d'avance.", en: "I didn't watch. I heard about it from my baker, who now makes me pay up front." },
        fx: { fame: 6, happy: -2, unflag: 'cr_documentary' },
      },
    ],
  },
  {
    id: 'cr_victim_revenge',
    icon: '🔨',
    cat: 'crime',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock', fx: 'gore' },
    when: { age: [20, 90], counter: { crimes: [5, 999] } },
    cooldown: 10,
    weight: 4,
    actor: STRANGER,
    vars: { amount: [500, 5000] },
    text: {
      fr: [
        "{a.first} sonne chez toi. Il y a des années, tu lui as tout pris : son portefeuille, son vélo, sa dignité. {a:Il|Elle} a passé ce temps à faire du MMA et du CrossFit. {a:Il|Elle} tient un marteau. Et un sourire.",
        "Une ancienne victime, {a.first}, t'attend sur ton palier. {a:Il|Elle} a imprimé une photo de toi, l'a punaisée sur un mannequin et l'a démoli au marteau pendant des mois. Pour l'entraînement.",
      ],
      en: [
        "{a.first} rings your doorbell. Years ago, you took everything: {a.his} wallet, {a.his} bike, {a.his} dignity. {a:He|She} spent the time since doing MMA and CrossFit. {a:He|She} is holding a hammer. And a smile.",
        "A past victim, {a.first}, is waiting on your landing. {a:He|She} printed your photo, pinned it to a dummy and smashed it with a hammer for months. For practice.",
      ],
    },
    choices: [
      {
        label: { fr: "M'excuser à genoux", en: 'Beg on my knees' },
        out: [
          { w: 2, text: { fr: "Je me suis jeté{|e} à genoux et j'ai pleuré toutes les larmes de mon corps. {a.first} m'a pardonné{|e}, puis est reparti{a:|e} avec ma télé « pour les intérêts ».", en: "I dropped to my knees and cried my eyes out. {a.first} forgave me, then left with my TV “for the interest.”" }, fx: { karma: 5, happy: -5 }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai supplié. {a.first} a écouté, hoché la tête… et m'a écrasé les deux pouces au marteau. Crac. Crac. J'écris ce journal avec le nez.", en: "I begged. {a.first} listened, nodded… then smashed both my thumbs with the hammer. Crack. Crack. I'm typing this diary with my nose." }, fx: { health: -15, visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Me battre', en: 'Fight' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai paré le marteau avec une poêle. DING ! Le marteau a rebondi et {a.first} s'est assommé{a:|e} tout{a:|e} seul{a:|e}. Je l'ai allongé{a:|e} sur un banc avec un pansement et une boîte de chocolats.", en: "I blocked the hammer with a frying pan. DING! It bounced back and {a.first} knocked {a.him}self out. I laid {a.him} on a bench with a band-aid and a box of chocolates." }, fx: { happy: 5, karma: 2 }, mood: 'proud' },
          { w: 2, text: { fr: "{a.first} m'a démonté{|e} avec méthode. Du sang au plafond, sur le chat, sur mon diplôme encadré. Je me suis réveillé{|e} à l'hôpital, plâtré{|e} comme une momie.", en: "{a.first} took me apart methodically. Blood on the ceiling, on the cat, on my framed diploma. I woke up in the hospital in a full-body cast like a mummy." }, fx: { health: -25, disease: 'broken_arm', actorRole: 'enemy', visual: 'gore' }, mood: 'cry' },
          { w: 0.4, text: { fr: "Le marteau a fait un bruit de pastèque. C'était ma tête.", en: "The hammer made a watermelon sound. That was my head." }, fx: { die: { fr: 'massacré{|e} au marteau par une ancienne victime venue se venger', en: 'hammered to death by a former victim out for revenge' }, visual: 'gore' } },
        ],
      },
      {
        label: { fr: 'Rembourser', en: 'Pay them back' },
        text: { fr: "Je lui ai fait un virement de {$amount}, intérêts compris, avec un smiley. {a.first} a rangé le marteau. On est quittes. Le smiley l'a un peu énervé{a:|e}, quand même.", en: "I wired {a.him} {$amount}, interest included, with a smiley face. {a.first} put the hammer away. We're even. The smiley annoyed {a.him} a little, though." },
        fx: { money: '-amount', karma: 6, stress: -5 },
      },
    ],
  },
  {
    id: 'cr_parole_officer',
    icon: '🧪',
    cat: 'crime',
    rating: 2,
    scene: { place: 'office', mood: 'angry' },
    when: { age: [18, 90], record: true },
    cooldown: 4,
    actor: { create: { role: 'acquaintance', age: [5, 30], gender: 'any' } },
    text: {
      fr: [
        "Ton agent{a:|e} de probation, {a.first}, exige un test d'urine. Maintenant. Devant {a:lui|elle}. Avec un gobelet trop petit et une porte qui ne ferme pas. {a:Il|Elle} mange un sandwich au thon en même temps.",
        "Rendez-vous de probation. {a.first} te tend un gobelet en plastique sans lever les yeux de son sandwich. « Tu connais la musique. Et ne fais pas comme la dernière fois. »",
      ],
      en: [
        "Your probation officer, {a.first}, demands a urine test. Right now. In front of {a.him}. With a cup that's too small and a door that won't close. {a:He|She} is eating a tuna sandwich at the same time.",
        "Probation meeting. {a.first} hands you a plastic cup without looking up from {a.his} sandwich. “You know the drill. And don't do what you did last time.”",
      ],
    },
    choices: [
      {
        label: { fr: "M'exécuter", en: 'Comply' },
        out: [
          { w: 2, text: { fr: "J'ai rempli le gobelet sous son regard, en sifflotant pour me donner du courage. Résultat négatif. {a.first} a fini son sandwich d'une main, l'autre sur le gobelet tiède.", en: "I filled the cup under {a.his} gaze, whistling for courage. Negative. {a.first} finished the sandwich one-handed, the other hand on the warm cup." }, fx: { happy: -4, karma: 1 } },
          { w: 1, text: { fr: "Le gobelet a débordé. Sur le sandwich. On s'est regardés dans un silence absolu. {a.first} a pris une bouchée quand même, par principe.", en: "The cup overflowed. Onto the sandwich. We stared at each other in total silence. {a.first} took a bite anyway, on principle." }, fx: { happy: -2, stress: 6, heat: 10 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: "L'urine d'un pote", en: "A buddy's urine" },
        out: [
          { w: 1, text: { fr: "J'ai rendu l'urine de mon pote Kevin, planquée dans ma chaussette. Test négatif aux drogues. Mais positif au diabète. Je dois appeler Kevin.", en: "I handed in my buddy Kevin's urine, smuggled in my sock. Negative for drugs. Positive for diabetes. I need to call Kevin." }, fx: { happy: 4, karma: -2 }, mood: 'happy' },
          { w: 1, text: { fr: "Le flacon a éclaté dans ma chaussette dans le couloir. J'ai fait « splotch » à chaque pas jusqu'au bureau. {a.first} a tout de suite compris.", en: "The vial burst in my sock in the hallway. I went “squelch” with every step to the office. {a.first} figured it out immediately." }, fx: { jail: 1, visual: 'police' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: "L'envoyer chier", en: 'Tell them off' },
        text: { fr: "J'ai dit à {a.first} ce que je pensais de son sandwich, de sa cravate et de la justice de ce pays. Ça m'a coûté six mois de bracelet électronique, et ça valait chaque seconde.", en: "I told {a.first} exactly what I thought of the sandwich, the tie and this country's justice system. It cost me six months of ankle monitor, and it was worth every second." },
        fx: { happy: 8, heat: 20, stress: -5 },
        mood: 'angry',
      },
    ],
  },
];
