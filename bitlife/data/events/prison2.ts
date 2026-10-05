// Prison life (part 2), life with a record / police heat, and street crime that can hit anyone.
import type { EffectCtx, EventDef, Life } from '@bl/sim';
import { clamp, release } from '@bl/sim';

const ADULT: [number, number] = [18, 120];
const INSIDE = { prison: true, age: ADULT };
const CELLMATE = { create: { role: 'acquaintance' as const, age: [22, 60] as [number, number], abs: true, gender: 'same' as const } };
const CRUSH = { create: { role: 'acquaintance' as const, age: [22, 50] as [number, number], abs: true, gender: 'attracted' as const } };
const ADULT_ANY = { create: { role: 'acquaintance' as const, age: [28, 65] as [number, number], abs: true, gender: 'any' as const } };
const EX_CON = { create: { role: 'acquaintance' as const, age: [25, 60] as [number, number], abs: true, gender: 'same' as const } };

type Fn = (ctx: EffectCtx) => void;
/** Prison respect ±n. */
const resp = (n: number): Fn => ({ life }) => { if (life.prison) life.prison.respect = clamp(life.prison.respect + n); };
/** Shaves n years off the sentence (never below one more year). */
const cut = (n: number): Fn => ({ life }) => { if (life.prison) life.prison.years = Math.max(life.prison.served + 1, life.prison.years - n); };
const both = (...fs: Fn[]): Fn => (ctx) => { for (const f of fs) f(ctx); };
const breakOut: Fn = ({ life, content }) => { life.counters.escapes = (life.counters.escapes ?? 0) + 1; release(life, content, 'escape'); };
const caughtFugitive: Fn = ({ life }) => { delete life.flags.fugitive; };
const heat = (min: number) => (l: Life) => l.heat >= min;

export const prison2Events: EventDef[] = [
  // ═════════════════════════════ PRISON: feed lines ═════════════════════════════
  {
    id: 'p2_auto_wall_calendar', icon: '📅', cat: 'prison', auto: true, cooldown: 4, when: INSIDE,
    text: {
      fr: [
        "J'ai gravé mes jours de détention sur le mur avec une cuillère. Un gardien a repeint la cellule. J'ai recommencé à zéro. Le gardien aussi.",
        "J'ai fait un calendrier en bâtons sur le mur. Mon codétenu s'en sert pour noter ses dettes de nouilles. On partage le mur, pas les comptes.",
        "J'ai marqué chaque jour de détention avec {w:object} sur le mur. J'en suis à [[212|487|1 033]] bâtons. Le gardien m'a demandé si c'était de l'art moderne. J'ai dit oui. Il a pris une photo.",
        "Mon calendrier mural compte les jours, mais j'ai perdu le fil {w:time}. Selon mes calculs, on est soit mardi, soit je suis {w:far_place}. Mon codétenu dit qu'on est jeudi. Il ment toujours.",
        "J'ai dessiné un calendrier sur le mur, avec un petit {w:animal} pour chaque dimanche. Il y a beaucoup de dimanches. Le mur ressemble maintenant à un zoo. Je m'y sens moins seul{|e}.",
      ],
      en: [
        "I carved my days inside onto the wall with a spoon. A guard repainted the cell. I started over from zero. So did the guard.",
        "I made a tally-mark calendar on the wall. My cellmate uses it to track his noodle debts. We share the wall, not the books.",
        "I've been marking each day inside on the wall using {w:object}. I'm up to [[212|487|1,033]] tally marks. The guard asked if it was modern art. I said yes. He took a picture.",
        "My wall calendar counts the days, but I lost track {w:time}. By my math, it's either Tuesday or I'm {w:far_place}. My cellmate says it's Thursday. He always lies.",
        "I drew a calendar on the wall, with a little doodle for each Sunday: {w:animal}. There are a lot of Sundays. The wall now looks like a zoo. I feel less alone.",
      ],
    },
    fx: { stress: 2, discipline: 2 },
  },
  {
    id: 'p2_auto_solitary_bricks', icon: '🧱', cat: 'prison', auto: true, cooldown: 5, when: INSIDE,
    text: {
      fr: [
        "Une semaine au mitard pour avoir chanté trop fort. Il y a 1 412 briques dans cette cellule. Une est descellée. Je ne dirai pas laquelle.",
        "Au mitard, j'ai inventé un jeu de société avec trois miettes et une ombre. J'ai gagné. L'ombre conteste encore le résultat.",
        "Mitard pour avoir chanté {w:song} à 3 h du matin. Seul{|e} entre quatre murs, j'ai donné un prénom à chaque fissure. Ma préférée s'appelle « {w:nickname} ». Elle m'écoute.",
        "[[Cinq|Sept|Dix]] jours au mitard pour avoir caché {w:food} dans mon oreiller. J'ai parlé à une mouche pendant trois jours. Elle est partie. Je crois qu'elle a été libérée avant moi.",
        "Au mitard, j'ai fait {w:activity} dans ma tête pendant des heures, juste pour garder le moral. Ça marche à moitié. J'entends {w:sound} à travers la porte et je réponds.",
      ],
      en: [
        "A week in solitary for singing too loud. There are 1,412 bricks in that cell. One of them is loose. I'm not saying which.",
        "In solitary I invented a board game with three crumbs and a shadow. I won. The shadow is still appealing the result.",
        "Solitary for singing {w:song} at 3 a.m. Alone between four walls, I named every crack. My favorite is called '{w:nickname}'. She listens to me.",
        "[[Five|Seven|Ten]] days in solitary for hiding {w:food} in my pillow. I talked to a fly for three days. It left. I think it got released before me.",
        "In solitary, I spent hours {w:activity} in my head, just to stay sane. It half works. I hear {w:sound} through the door and I answer it.",
      ],
    },
    fx: { happy: -3, smarts: 2 },
  },
  {
    id: 'p2_auto_commissary', icon: '🧴', cat: 'prison', rating: 1, auto: true, cooldown: 4, when: INSIDE,
    text: {
      fr: [
        "À la cantine de la prison, un déodorant coûte trois semaines de salaire d'atelier. J'ai choisi de sentir le fauve. Toute l'aile a fait le même choix. On s'y fait.",
        "Le café soluble a doublé de prix à la cantine. Les détenus parlent d'inflation comme des économistes. Un braqueur de banques m'a expliqué la planche à billets. Avec des gestes.",
        "Nouveau à la cantine : {w:food} à [[12|18|25]] euros. J'ai économisé deux mois pour en acheter. C'était infâme. J'ai tout mangé en pleurant de bonheur.",
        "La cantine a enfin du shampoing. Une seule marque : {w:brand}. Ça dégage {w:smell}. Tout le bloc sent pareil maintenant. Les gardiens nous confondent.",
        "Pénurie de papier toilette à la cantine. Un rouleau s'échange maintenant contre {w:object} ou deux paquets de clopes. J'ai trois rouleaux planqués sous mon matelas. Je suis riche. {w:swear}",
      ],
      en: [
        "At the prison commissary, a stick of deodorant costs three weeks of workshop wages. I chose to smell like a wild animal. The whole wing made the same choice. You get used to it.",
        "Instant coffee doubled in price at the commissary. Inmates now talk inflation like economists. A bank robber explained money printing to me. With hand gestures.",
        "New at the commissary: {w:food} for [[12|18|25]] dollars. I saved for two months to buy it. It was awful. I ate it all, crying with joy.",
        "The commissary finally has shampoo. One brand only: {w:brand}. It gives off {w:smell}. The whole block smells the same now. The guards can't tell us apart.",
        "Toilet paper shortage at the commissary. One roll now trades for {w:object} or two packs of smokes. I have three rolls stashed under my mattress. I'm rich. {w:swear}",
      ],
    },
    fx: { happy: -2, smarts: 1 },
  },
  {
    id: 'p2_auto_fan_mail', icon: '💌', cat: 'prison', rating: 1, auto: true, cooldown: 5, when: INSIDE,
    text: {
      fr: [
        "J'ai reçu une demande en mariage par courrier d'une personne que je n'ai jamais vue. Elle a joint une mèche de cheveux et le plan de table. Je suis à la table 3, à côté de sa mère.",
        "Un fan m'a écrit que mon procès avait « changé sa vie ». Il veut ma brosse à dents. Pour sa collection. Il en a déjà 40.",
        "J'ai reçu une lettre parfumée, qui dégage {w:smell}, d'une admiratrice qui me compare à {w:celeb}. Elle propose de venir au parloir en robe de mariée. Elle a déjà réservé le traiteur.",
        "Un fan m'a envoyé {w:gift} et un portrait de moi peint à l'huile, en armure. Au dos : « Mon héros ». Les gardiens l'ont confisqué. Ils l'ont accroché dans leur salle de pause.",
        "Courrier de fans de la semaine : [[trois|sept|douze]] demandes d'autographe, une demande en mariage et une lettre d'une personne qui veut que je lui apprenne {w:crime_small}. J'ai répondu à la demande en mariage. Par politesse.",
      ],
      en: [
        "I got a marriage proposal in the mail from someone I've never met. They enclosed a lock of hair and the seating chart. I'm at table 3, next to their mother.",
        "A fan wrote that my trial “changed their life.” They want my toothbrush. For their collection. They already have 40.",
        "I got a scented letter, giving off {w:smell}, from an admirer who compares me to {w:celeb}. She offers to come to visiting hours in a wedding dress. She's already booked the caterer.",
        "A fan sent me {w:gift} and an oil painting of me in armor. On the back: 'My hero.' The guards confiscated it. They hung it in their break room.",
        "This week's fan mail: [[three|seven|twelve]] autograph requests, a marriage proposal and a letter from someone who wants me to teach them {w:crime_small}. I answered the proposal. Out of politeness.",
      ],
    },
    fx: { happy: 3, fame: 1 },
  },
  {
    id: 'p2_auto_mess_mystery', icon: '🍗', cat: 'prison', rating: 2, auto: true, cooldown: 4, when: INSIDE,
    text: {
      fr: [
        "Les nuggets du jeudi contenaient une puce électronique. En cuisine, quelqu'un a crié « Adieu, Pompon ! ». Personne n'a fini son assiette. Sauf Gros Momo, qui a demandé du rab.",
        "La soupe du jour avait un œil. Il clignait. J'ai mangé autour. Il m'a suivi{|e} du regard jusqu'à la dernière cuillère.",
      ],
      en: [
        "Thursday's nuggets had a microchip in them. Someone in the kitchen yelled “Goodbye, Mr. Whiskers!” Nobody finished their plate. Except Big Momo, who asked for seconds.",
        "Today's soup had an eye in it. It blinked. I ate around it. It watched me all the way to the last spoonful.",
      ],
    },
    fx: { health: -3, happy: -3 },
  },
  {
    id: 'p2_auto_tuna_teeth', icon: '🦷', cat: 'prison', rating: 2, auto: true, cooldown: 4, when: INSIDE,
    text: {
      fr: [
        "Dans la cour, un détenu a voulu ouvrir une boîte de thon avec les dents. Il lui en reste trois. Le thon, lui, va très bien.",
        "Bagarre à la buanderie : un type s'est fait assommer avec une chaussette remplie de savonnettes. Il a les oreilles qui sentent la lavande pour le reste de sa vie.",
      ],
      en: [
        "In the yard, an inmate tried to open a can of tuna with his teeth. He has three left. The tuna is doing great.",
        "Laundry room brawl: a guy got knocked out with a sock full of soap bars. His ears will smell of lavender for the rest of his life.",
      ],
    },
    fx: { happy: 2 },
  },

  // ═════════════════════════════ PRISON: cellmates ═════════════════════════════
  {
    id: 'p2_cell_giant', icon: '😴', cat: 'prison', cooldown: 6, when: INSIDE, actor: CELLMATE,
    scene: { place: 'prison', mood: 'sleepy' },
    text: {
      fr: [
        "Ton nouveau codétenu, {a.first}, mesure 2 m 10 et ronfle comme un avion-cargo qui décolle sur une piste en gravier. Les murs vibrent. Ton dentier aussi, et tu n'as pas de dentier.",
        "{a.first}, ta nouvelle montagne de codétenu{a:|e}, s'endort en dix secondes et ronfle si fort que l'aile D a porté plainte. Il est 3 h du matin. Tu as les yeux en sang.",
        "{a.first}, ton codétenu{a:|e} de 140 kilos, ronfle comme {w:vehicle} sans pot d'échappement. Entre deux ronflements, {a:il|elle} fait {w:sound}. Ça dure depuis {w:time}. Tu craques.",
        "La nuit, {a.first} ronfle si fort que [[la lampe|le lavabo|ton matelas]] tremble. {a:Il|Elle} serre {w:object} contre sa poitrine comme un doudou. Le gardien de nuit a mis des boules Quies. Toi, tu n'en as pas.",
        "Ton codétenu géant, {a.first}, parle en dormant entre deux ronflements. Cette nuit, {a:il|elle} a récité de mémoire comment préparer {w:food}, puis a hurlé « {w:exclaim} ». Tu fixes le plafond depuis trois heures.",
      ],
      en: [
        "Your new cellmate, {a.first}, is seven feet tall and snores like a cargo plane taking off on a gravel runway. The walls shake. So do your dentures, and you don't have dentures.",
        "{a.first}, your new mountain of a cellmate, falls asleep in ten seconds and snores so loud D Block filed a complaint. It's 3 a.m. Your eyes are bleeding.",
        "{a.first}, your 300-pound cellmate, snores like {w:vehicle} with no muffler. Between snores, {a:he|she} makes {w:sound}. It's been going on since {w:time}. You're cracking.",
        "At night, {a.first} snores so loudly that [[the lamp|the sink|your mattress]] shakes. {a:He|She} clutches {w:object} like a security blanket. The night guard wears earplugs. You have none.",
        "Your giant cellmate, {a.first}, talks in {a.his} sleep between snores. Tonight {a:he|she} recited from memory how to make {w:food}, then yelled '{w:exclaim}'. You've been staring at the ceiling for three hours.",
      ],
    },
    choices: [
      { label: { fr: 'Bouchons en mie de pain', en: 'Bread earplugs' }, text: { fr: ["Je me suis fabriqué des bouchons d'oreilles en mie de pain. J'ai dormi comme un bébé. Un bébé qui sent la baguette.", "J'ai roulé de la mie de pain en boulettes et je me les suis enfoncées dans les oreilles. Ça marche. Le matin, un pigeon a essayé de me les picorer pendant la promenade."], en: ["I made earplugs out of bread. I slept like a baby. A baby that smells like a baguette.", "I rolled bread into little balls and stuffed them in my ears. It works. In the morning, a pigeon tried to peck them out during rec time."] }, fx: { happy: 4, health: 2 } },
      { label: { fr: 'Lui pincer le nez', en: 'Pinch their nose' }, out: [
        { w: 2, text: { fr: ["{a.first} s'est réveillé{a:|e} en sursaut, m'a regardé{|e}, puis s'est rendormi{a:|e} en me serrant comme une peluche. Je suis prisonnier{|e} dans la prison.", "J'ai pincé le nez de {a.first}. Silence total. Puis {a:il|elle} s'est mis{a:|e} à respirer par la bouche en faisant un bruit de cornemuse. C'était pire. Je regrette tout."], en: ["{a.first} woke with a start, stared at me, then fell back asleep hugging me like a teddy bear. I am a prisoner inside the prison.", "I pinched {a.first}'s nose. Total silence. Then {a:he|she} started breathing through {a.his} mouth, making a bagpipe noise. It was worse. I regret everything."] }, fx: { rel: 10, happy: -2 }, mood: 'shock' },
        { w: 1, text: { fr: ["{a.first} m'a mis une gifle dans son sommeil. J'ai traversé la cellule. Au matin, {a:il|elle} ne se souvenait de rien. Moi, de tout.", "{a.first} m'a attrapé{|e} le poignet sans se réveiller et l'a serré [[une heure|toute la nuit|jusqu'à l'aube]]. Je n'ai pas osé bouger. J'ai encore les marques."], en: ["{a.first} slapped me in {a.his} sleep. I flew across the cell. In the morning {a:he|she} remembered nothing. I remembered everything.", "{a.first} grabbed my wrist without waking up and squeezed it [[for an hour|all night|until dawn]]. I didn't dare move. I still have the marks."] }, fx: { health: -8, happy: -3 }, mood: 'sad' },
      ] },
      { label: { fr: 'Chanter une berceuse', en: 'Sing a lullaby' }, text: { fr: ["J'ai chanté « Au clair de la lune » à {a.first}. {a:Il|Elle} a arrêté de ronfler et m'a appelé{|e} « maman ». On ne parle jamais de cette nuit, mais on est amis.", "J'ai chanté {w:song} tout doucement. {a.first} a arrêté de ronfler, souri dans son sommeil et murmuré « encore ». Je chante tous les soirs maintenant. Toute l'aile écoute."], en: ["I sang {a.first} a lullaby. {a:He|She} stopped snoring and called me “mommy.” We never talk about that night, but we're friends now.", "I softly sang {w:song}. {a.first} stopped snoring, smiled in {a.his} sleep and whispered 'again'. I sing every night now. The whole wing listens."] }, fx: { rel: 20, actorRole: 'friend', happy: 3 }, mood: 'love' },
    ],
  },
  {
    id: 'p2_cell_philosopher', icon: '📚', cat: 'prison', rating: 1, cooldown: 8, when: INSIDE,
    actor: { create: { role: 'acquaintance', age: [35, 70], abs: true, gender: 'same' } },
    scene: { place: 'prison', mood: 'neutral' },
    text: {
      fr: [
        "Ton codétenu, {a.first}, purge quatre perpétuités pour ce que les journaux appelaient « l'affaire du congélateur ». {a:Il|Elle} cite Spinoza, plie ses chaussettes en origami, et ce soir {a:il|elle} te demande si le libre arbitre existe.",
        "{a.first}, {a:le|la} détenu{a:|e} le plus poli{a:|e} de l'aile, serait aussi le plus dangereux{a:|se}. Il paraît. Ce soir, {a:il|elle} te sert une tisane imaginaire et veut parler de Nietzsche.",
      ],
      en: [
        "Your cellmate, {a.first}, is serving four life sentences for what the papers called “the freezer business.” {a:He|She} quotes Spinoza, folds socks into origami, and tonight asks you whether free will exists.",
        "{a.first}, the politest inmate in the wing, is also supposedly the most dangerous. Tonight {a:he|she} pours you an imaginary herbal tea and wants to talk Nietzsche.",
      ],
    },
    choices: [
      { label: { fr: 'Débattre', en: 'Debate' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: "On a débattu jusqu'à l'aube. J'ai défendu le libre arbitre. {a.first} a dit : « Intéressant. Les autres disaient pareil. » Puis {a:il|elle} m'a tendu un biscuit. J'ai beaucoup appris. Je n'ai pas dormi.", en: "We debated until dawn. I defended free will. {a.first} said: “Interesting. The others said the same.” Then {a:he|she} handed me a cookie. I learned a lot. I didn't sleep." }, fx: { smarts: 6, rel: 10 }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai dit que Nietzsche était surcoté. {a.first} a souri sans rien dire pendant quatre minutes. J'ai dormi les yeux ouverts pendant un mois.", en: '{a.first} smiled silently for four minutes after I called Nietzsche overrated. I slept with my eyes open for a month.' }, fx: { stress: 10, happy: -5 }, mood: 'shock' },
      ] },
      { label: { fr: 'Tout approuver', en: 'Agree with everything' }, text: { fr: "J'ai acquiescé à tout, y compris quand {a:il|elle} se contredisait. {a.first} m'a qualifié{|e} d'« esprit souple ». Je ne sais pas si c'est un compliment ou une unité de mesure pour congélateur.", en: "I agreed with everything, even when {a:he|she} contradicted {a.him}self. {a.first} called me “a flexible mind.” I can't tell if that's a compliment or a freezer measurement." }, fx: { rel: 5, stress: 4 } },
      { label: { fr: 'Demander des cours', en: 'Ask for lessons' }, text: { fr: "{a.first} m'a donné des cours de philo tous les soirs. Kant, Platon, Camus. Je suis la personne la plus cultivée de l'aile, à part celle qui rangeait des gens au congélateur.", en: '{a.first} gave me philosophy lessons every night. Kant, Plato, Camus. I am the most cultured person in the wing, apart from the one who stored people in a freezer.' }, fx: { smarts: 10, rel: 15, actorRole: 'friend' }, mood: 'proud' },
      { label: { fr: 'Demander un transfert', en: 'Request a transfer' }, text: { fr: "J'ai demandé un transfert. Le directeur a ri : « Tout le monde demande. Personne n'obtient. Courage. » J'ai acheté un cadenas pour mon casier. Et un deuxième, pour moi.", en: "I requested a transfer. The warden laughed: “Everyone asks. Nobody gets one. Hang in there.” I bought a padlock for my locker. And a second one, for me." }, fx: { stress: 6, discipline: 2 } },
    ],
  },
  {
    id: 'p2_cell_banker', icon: '💼', cat: 'prison', once: true, when: INSIDE,
    actor: { create: { role: 'acquaintance', age: [40, 65], abs: true, gender: 'same' } },
    scene: { place: 'prison', mood: 'cry' },
    text: {
      fr: [
        "Ton codétenu, {a.first}, ex-banquier{a:|e} d'affaires, a vidé la caisse de retraite des pompiers. {a:Il|Elle} pleure chaque nuit dans une cravate en soie qu'{a:il|elle} a réussi à garder. « J'avais un jacuzzi sur mon yacht… »",
        "{a.first}, ancien{a:|ne} trader, sanglote sur la couchette du bas en répétant « Mon portefeuille, mon portefeuille… ». Pas celui en cuir. Celui en actions.",
        "{a.first}, ex-PDG condamné{a:|e} pour fraude, pleure parce que la prison ne sert pas {w:food}. {a:Il|Elle} parle encore de sa villa {w:far_place} au présent. Il est 2 h du matin.",
        "Ton codétenu {a.first}, ancien{a:|ne} banquier{a:|e}, a demandé au gardien s'il était possible de faire venir {w:object} « depuis le coffre ». Le gardien a ri. {a.first} pleure maintenant dans sa chaussette en cachemire.",
        "{a.first}, ex-gestionnaire de fortune, sanglote en regardant une photo de son yacht amarré {w:far_place}, de {a:sa femme|son mari} et de son golden retriever. Dans cet ordre. Il est [[3 h|4 h|5 h]] du matin.",
      ],
      en: [
        "Your cellmate, {a.first}, a former investment banker, drained the firefighters' pension fund. Every night {a:he|she} sobs into a silk tie {a:he|she} somehow got to keep. “I had a hot tub on my yacht…”",
        "{a.first}, an ex-trader, sobs on the bottom bunk, repeating “My portfolio, my portfolio…” Not the leather one. The stock one.",
        "{a.first}, an ex-CEO convicted of fraud, is crying because the prison doesn't serve {w:food}. {a:He|She} still talks about {a:his|her} villa {w:far_place} in the present tense. It's 2 a.m.",
        "Your cellmate {a.first}, a former banker, asked the guard if {w:object} could be brought in 'from the vault'. The guard laughed. {a.first} is now crying into a cashmere sock.",
        "{a.first}, a former wealth manager, is sobbing over a photo of {a:his|her} yacht moored {w:far_place}, {a:his wife|her husband} and {a:his|her} golden retriever. In that order. It's [[3|4|5]] a.m.",
      ],
    },
    choices: [
      { label: { fr: 'Le consoler', en: 'Comfort them' }, text: { fr: ["J'ai consolé {a.first} toute la nuit. Au matin, {a:il|elle} m'a promis un « petit tuyau boursier » le jour où on serait tirés d'affaire. {a:Il|Elle} m'a fait signer une clause de confidentialité sur du papier toilette.", "J'ai tapoté le dos de {a.first} jusqu'à l'aube. {a:Il|Elle} m'a juré qu'à sa sortie, {a:il|elle} m'offrirait {w:vehicle}. Je n'y crois pas, mais j'ai déjà choisi la couleur."], en: ["{a.first} cried on my shoulder all night. In the morning {a:he|she} promised me “a little stock tip” once we were out. {a:He|She} made me sign an NDA on toilet paper.", "I patted {a.first}'s back until dawn. {a:He|She} swore that once out, {a:he|she}'d buy me {w:vehicle}. I don't believe it, but I've already picked the color."] }, fx: { rel: 20, actorRole: 'friend', happy: 2, flag: 'p2_banker_friend', schedule: { key: 'p2_banker_tip', years: 2 } }, mood: 'love' },
      { label: { fr: 'Me moquer', en: 'Mock them' }, text: { fr: ["Je lui ai rappelé que les pompiers aussi pleuraient. {a.first} a pleuré plus fort. Toute l'aile a applaudi. Quelque part, une caserne a senti une vague de chaleur.", "Je me suis moqué{|e} de {a.first} en imitant son accent de golf. Toute l'aile a ri. {a:Il|Elle} a menacé de me poursuivre en justice. On est déjà en prison, {a:mon grand|ma grande}."], en: ["{a.first} cried even harder when I pointed out the firefighters were crying too. The whole wing applauded. Somewhere, a fire station felt a warm glow.", "I mocked {a.first} by imitating {a:his|her} country-club accent. The whole wing laughed. {a:He|She} threatened to sue me. We're already in prison, pal."] }, fx: { karma: 2, happy: 4, rel: -15 } },
      { label: { fr: 'Facturer mes épaules', en: 'Charge for my shoulder' }, text: { fr: ["J'ai facturé mon épaule à {a.first} : un paquet de café par crise de larmes. {a:Il|Elle} est devenu{a:|e} mon meilleur client. Pour la première fois de ma vie, c'est moi la banque.", "J'ai proposé un abonnement mensuel de consolation à {a.first} : [[dix|quinze|vingt]] sachets de nouilles par mois, crises illimitées. {a:Il|Elle} a négocié les frais. Vieux réflexes."], en: ["I charged {a.first} one pack of coffee per crying fit. {a:He|She} became my best customer. For the first time in my life, I'm the bank.", "I offered {a.first} a monthly consolation subscription: [[ten|fifteen|twenty]] noodle packets a month, unlimited breakdowns. {a:He|She} negotiated the fees. Old habits."] }, fx: { happy: 5, rel: -5, money: 50 } },
    ],
  },
  {
    id: 'p2_banker_tip', icon: '📈', cat: 'crime', chainOnly: true, actor: 'anyFriend', vars: { amount: [5000, 30000] },
    scene: { place: 'home', mood: 'shock', fx: 'money' },
    text: {
      fr: [
        "Une lettre de {a.first}, ton ancien{a:|ne} codétenu{a:|e} banquier{a:|e} : « Comme promis. Achète tout ce que tu peux de la société Lamatrix. Ne pose pas de questions. Brûle cette lettre. Ou mange-la. »",
        "{a.first}, ton ex-codétenu{a:|e} de la finance, t'envoie un SMS codé : « Le lama vole à minuit. Achète Lamatrix. Tout. Maintenant. » Suivi d'un émoji clin d'œil très inquiétant.",
      ],
      en: [
        "A letter from {a.first}, your former banker cellmate: “As promised. Buy as much Lamatrix stock as you can. Ask no questions. Burn this letter. Or eat it.”",
        "{a.first}, your ex-cellmate from finance, sends a coded text: “The llama flies at midnight. Buy Lamatrix. All of it. Now.” Followed by a deeply worrying winking emoji.",
      ],
    },
    choices: [
      { label: { fr: 'Tout miser', en: 'Go all in' }, out: [
        { w: 2, text: { fr: "J'ai tout misé. Lamatrix a pris 900 % en une semaine. Je ne veux pas savoir pourquoi. J'ai gagné {$amount} et un léger tic à l'œil.", en: "I went all in. Lamatrix rose 900% in a week. I don't want to know why. I made {$amount} and a slight eye twitch." }, fx: { money: 'amount', heat: 10, visual: 'money' }, mood: 'party' },
        { w: 1, text: { fr: "Lamatrix vendait des lamas connectés. Faillite le lendemain. {a.first} m'a écrit : « Oups. » J'ai perdu {$amount}.", en: 'Lamatrix sold smart llamas. Bankrupt the next day. {a.first} texted: “Oops.” I lost {$amount}.' }, fx: { money: '-amount', happy: -10, rel: -20 }, mood: 'cry' },
      ] },
      { label: { fr: 'Mettre un petit billet', en: 'Bet a little' }, text: { fr: "J'ai mis un petit billet. J'ai gagné de quoi m'offrir un très bon fromage. Je l'ai mangé en pensant à {a.first}.", en: 'I put in a little. I made enough for a very good cheese. I ate it thinking of {a.first}.' }, fx: { money: 500, happy: 4 } },
      { label: { fr: 'Brûler la lettre', en: 'Burn it' }, text: { fr: "J'ai brûlé le message. Deux mois plus tard, {a.first} et tous les acheteurs de Lamatrix tombaient pour délit d'initié. J'ai envoyé des biscuits au parloir.", en: 'I burned it. Two months later, {a.first} and every Lamatrix buyer went down for insider trading. I sent cookies to visiting hours.' }, fx: { karma: 4, happy: 3 } },
    ],
  },

  // ═════════════════════════════ PRISON: yard, mess, economy ═════════════════════════════
  {
    id: 'p2_yard_benches', icon: '🏋️', cat: 'prison', rating: 2, cooldown: 6, when: INSIDE,
    scene: { place: 'prison', mood: 'neutral' },
    text: {
      fr: [
        "Dans la cour, chaque banc appartient à un clan : les culturistes huilés, les vieux de perpète qui jouent aux échecs avec des bouchons, et les ex-bikers du club tricot. Tu as un plateau à la main et zéro allié.",
        "La politique de la cour est plus compliquée que l'ONU : banc des gros bras, banc des comptables véreux, banc des tricoteurs barbus. S'asseoir au mauvais endroit, c'est finir en écharpe. Littéralement.",
      ],
      en: [
        "In the yard, every bench belongs to a clan: the oiled-up bodybuilders, the old lifers playing chess with bottle caps, and the ex-bikers of the knitting club. You have a tray in your hands and zero allies.",
        "Yard politics are more complicated than the UN: the muscle bench, the crooked accountants' bench, the bearded knitters' bench. Sit in the wrong place and you end up as a scarf. Literally.",
      ],
    },
    choices: [
      { label: { fr: 'Banc des culturistes', en: 'Bodybuilder bench' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai fait 40 tractions devant eux. Ils m'ont adopté{|e} et frotté{|e} à l'huile pour bébé. Je brille. Je suis respecté{|e}. Je glisse de toutes les chaises.", en: "I did 40 pull-ups in front of them. They adopted me and rubbed me down with baby oil. I shine. I'm respected. I slide off every chair." }, fx: { athletic: 5, fn: resp(15) }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai voulu soulever leur haltère en béton. C'est l'haltère qui m'a soulevé{|e}. Mon épaule a fait un bruit de chips. Un culturiste a ri si fort qu'il s'est déchiré un pec.", en: 'I tried to lift their concrete dumbbell. The dumbbell lifted me. My shoulder made a potato-chip noise. One bodybuilder laughed so hard he tore a pec.' }, fx: { health: -12, visual: 'gore', fn: resp(-10) }, mood: 'cry' },
      ] },
      { label: { fr: 'Les vieux joueurs', en: 'The old chess players' }, text: { fr: "Les vieux m'ont laissé m'asseoir à condition de me taire. J'ai appris les échecs, la patience, et que l'un d'eux a dévoré un notaire en 1987. Pas aux échecs.", en: 'The old-timers let me sit if I kept quiet. I learned chess, patience, and that one of them devoured a notary in 1987. Not at chess.' }, fx: { smarts: 6, fn: resp(5) } },
      { label: { fr: 'Le club tricot', en: 'The knitting club' }, text: { fr: "Les bikers m'ont appris le point mousse. Un géant nommé Crâne m'a tricoté un bonnet. Plus personne n'ose me toucher : toucher au bonnet, c'est toucher à Crâne.", en: "The bikers taught me garter stitch. A giant named Skull knitted me a beanie. Nobody dares touch me now: touch the beanie, you touch Skull." }, fx: { happy: 6, fn: resp(10) }, mood: 'happy' },
      { label: { fr: 'Manger debout', en: 'Eat standing up' }, text: { fr: "J'ai mangé debout contre le grillage, comme un pigeon méfiant. Un vrai pigeon est venu manger avec moi. C'est mon seul allié. Il me pique mes petits pois.", en: 'I ate standing against the fence like a suspicious pigeon. An actual pigeon joined me. It is my only ally. It steals my peas.' }, fx: { happy: -4, fn: resp(-5) }, mood: 'sad' },
    ],
  },
  {
    id: 'p2_mess_lasagna', icon: '🍝', cat: 'prison', rating: 2, cooldown: 5, when: INSIDE,
    scene: { place: 'prison', mood: 'sick' },
    text: {
      fr: [
        "Au réfectoire, le cuistot — un ancien empoisonneur réinséré « en cuisine, par cohérence » — pose devant toi une lasagne qui fume, gargouille et se déplace légèrement vers la gauche.",
        "Plat du jour : « hachis surprise ». La surprise remue. Le cuistot, condamné pour avoir empoisonné le jury d'un concours de cuisine, te fixe en attendant ton verdict.",
      ],
      en: [
        "In the mess hall, the cook — a former poisoner placed “in the kitchen, for consistency” — sets down a lasagna that steams, gurgles and drifts slightly to the left.",
        "Today's special: “surprise hash.” The surprise is wriggling. The cook, convicted of poisoning the judges of a cooking contest, stares at you awaiting your verdict.",
      ],
    },
    choices: [
      { label: { fr: 'Manger quand même', en: 'Eat it anyway' }, out: [
        { w: 2, text: { fr: "J'ai mangé. C'était bon. C'est ça le plus inquiétant. Trois heures plus tard, j'ai repeint les toilettes de l'aile B dans des tons que la nature n'a jamais validés.", en: "I ate it. It was good. That's the worrying part. Three hours later I repainted B Block's toilets in colors nature never approved." }, fx: { health: -8, disease: 'gastro', visual: 'poop' }, mood: 'sick' },
        { w: 1, text: { fr: "J'ai mangé. Il ne s'est rien passé. Le cuistot a pris des notes. Je crois que je suis son groupe témoin.", en: "I ate it. Nothing happened. The cook took notes. I think I'm his control group." }, fx: { happy: -2, stress: 5 } },
      ] },
      { label: { fr: 'Complimenter le chef', en: 'Compliment the chef' }, text: { fr: "J'ai dit au cuistot que c'était « audacieux ». Il a pleuré. Depuis, j'ai double ration et il me garde les morceaux « sans rien dedans ». Je préfère ne pas savoir ce qu'il y a dans les autres.", en: "I told the cook it was “bold.” He cried. Now I get double portions and he saves me the pieces “with nothing in them.” I'd rather not know what's in the others." }, fx: { happy: 5, fn: resp(3) } },
      { label: { fr: 'Lancer sur le voisin', en: 'Throw it at someone' }, out: [
        { w: 1, text: { fr: "J'ai lancé ma lasagne sur le voisin d'en face. Bataille générale. Un plateau a fendu une arcade, du hachis a giclé au plafond, un gardien a glissé sur une boulette jusqu'à la sortie. Mitard pour tout le monde.", en: 'I hurled my lasagna across the table. Total food war. A tray split an eyebrow, hash splattered the ceiling, a guard skated out the door on a meatball. Solitary for everyone.' }, fx: { health: -5, stress: 5, visual: 'gore', fn: resp(10) }, mood: 'party' },
        { w: 1, text: { fr: "Ma lasagne a raté sa cible et atterri sur le crâne du chef de gang de l'aile C. Il l'a mangée sur sa tête, avec les doigts, en me fixant. Je dors avec une chaussure à la main.", en: "My lasagna missed and landed on the head of C Block's gang boss. He ate it off his own scalp, with his fingers, staring at me. I sleep holding a shoe." }, fx: { stress: 12, fn: resp(-10) }, mood: 'shock' },
      ] },
      { label: { fr: 'Jeûner', en: 'Fast' }, text: { fr: "J'ai jeûné toute la semaine. J'ai perdu trois kilos et toute envie de vivre. Mais pas la vie. C'est déjà ça.", en: 'I fasted all week. I lost six pounds and the will to live. But not my life. Small wins.' }, fx: { weight: -0.03, health: -2, happy: -3 } },
    ],
  },
  {
    id: 'p2_mackerel_market', icon: '🐟', cat: 'prison', rating: 1, cooldown: 6, when: INSIDE,
    scene: { place: 'prison', mood: 'shock' },
    text: {
      fr: [
        "Ici, la vraie monnaie, ce sont les boîtes de maquereau. Ce matin, panique : une rumeur dit que le directeur va autoriser le thon. Le cours du maquereau s'effondre. Tu en as 60 sous ton matelas.",
        "Krach à l'aile B : le café soluble menace de remplacer le maquereau comme monnaie de référence. Les « banquiers » de la cour courent dans tous les sens. Tes 60 boîtes planquées sous le matelas tremblent.",
      ],
      en: [
        "In here, the real currency is canned mackerel. This morning, panic: rumor says the warden will allow tuna. The mackerel market crashes. You have 60 cans under your mattress.",
        "Crash in B Block: instant coffee threatens to replace mackerel as the reserve currency. The yard “bankers” are running around in circles. Your 60 cans under the mattress tremble.",
      ],
    },
    choices: [
      { label: { fr: 'Tout garder', en: 'Hold' }, out: [
        { w: 1, text: { fr: "J'ai tenu bon. La rumeur était fausse. Le maquereau a atteint des sommets historiques. Je suis le Warren Buffett du poisson gras. Ma cellule sent le port de pêche.", en: "I held. The rumor was fake. Mackerel hit all-time highs. I'm the Warren Buffett of oily fish. My cell smells like a fishing harbor." }, fx: { happy: 6, fn: resp(8) }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai tenu bon. Le thon a été autorisé. J'ai 60 boîtes de maquereau et aucun ami. J'en mange à chaque repas. Je deviens maquereau.", en: "I held. Tuna got approved. I have 60 cans of mackerel and no friends. I eat it at every meal. I am becoming mackerel." }, fx: { happy: -6, health: -2 }, mood: 'sad' },
      ] },
      { label: { fr: 'Tout vendre', en: 'Sell everything' }, text: { fr: "J'ai tout refourgué avant le krach à un nouveau qui ne connaissait pas les règles. Je me sens comme un vrai trader : riche, sale et vaguement coupable.", en: "I dumped it all on a new guy who didn't know the rules. I feel like a real trader: rich, dirty and vaguely guilty." }, fx: { karma: -2, happy: 4, fn: resp(4) } },
      { label: { fr: 'Lancer le MaqueCoin', en: 'Launch MackCoin' }, text: { fr: "J'ai inventé le MaqueCoin, une monnaie adossée à des promesses de maquereau écrites sur du papier toilette. Bulle spéculative en trois jours. Krach en quatre. Un type m'a menacé{|e} avec un rouleau entier.", en: 'I invented MackCoin, a currency backed by mackerel IOUs written on toilet paper. Speculative bubble in three days. Crash in four. A guy threatened me with an entire roll.' }, fx: { smarts: 3, stress: 8, fn: resp(-3) } },
    ],
  },

  // ═════════════════════════════ PRISON: guards ═════════════════════════════
  {
    id: 'p2_guard_corrupt', icon: '💰', cat: 'prison', rating: 1, cooldown: 6, when: INSIDE, vars: { amount: [200, 1500] },
    scene: { place: 'prison', mood: 'neutral', fx: 'money' },
    text: {
      fr: [
        "Le surveillant Moreau te tend discrètement une carte plastifiée : « Tarifs ». Mini-frigo : {$amount}. Coussin : la moitié. Douche chaude : « sur devis ». Il accepte aussi les tickets restaurant.",
        "Le gardien Bastien a un menu de privilèges plastifié, avec des pictogrammes. L'offre phare : un mini-frigo dans ta cellule pour {$amount}. Il propose même une carte de fidélité.",
      ],
      en: [
        "Officer Moreau discreetly hands you a laminated card: “Prices.” Mini-fridge: {$amount}. Pillow: half that. Hot shower: “quote on request.” He also takes meal vouchers.",
        "Officer Bastien has a laminated privileges menu, with pictograms. The headline offer: a mini-fridge in your cell for {$amount}. He even offers a loyalty card.",
      ],
    },
    choices: [
      { label: { fr: 'Acheter le frigo', en: 'Buy the fridge' }, text: { fr: "J'ai payé {$amount}. J'ai un mini-frigo. Il ne contient qu'un yaourt et ma dignité, mais il est à moi et il ronronne la nuit.", en: "I paid {$amount}. I have a mini-fridge. It holds one yogurt and my dignity, but it's mine and it purrs at night." }, fx: { money: '-amount', happy: 8, fn: resp(5) }, mood: 'happy' },
      { label: { fr: 'Le dénoncer', en: 'Report him' }, out: [
        { w: 1, text: { fr: "J'ai dénoncé le gardien à la direction. Il a été muté… dans mon aile, comme chef. Il m'appelle « mon petit délateur » en tapotant sa matraque.", en: 'I reported the guard. He got transferred… to my wing, as supervisor. He calls me “my little snitch” while tapping his baton.' }, fx: { stress: 12, karma: 4, fn: resp(-5) }, mood: 'shock' },
        { w: 1, text: { fr: "Je l'ai dénoncé. Une enquête l'a viré. L'aile a perdu tous ses mini-frigos. Je suis à la fois un héros moral et l'ennemi public numéro un.", en: 'I reported him. An investigation fired him. The wing lost every mini-fridge. I am both a moral hero and public enemy number one.' }, fx: { karma: 6, counter: 'prisonGood', fn: resp(-15) } },
      ] },
      { label: { fr: 'Négocier', en: 'Haggle' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai négocié un pack « famille » : frigo, coussin et douche chaude pour presque rien. Le gardien m'a dit que j'aurais dû faire commerce. Je lui ai rappelé où on était.", en: 'I haggled a “family bundle”: fridge, pillow and hot shower for almost nothing. The guard said I should have gone into business. I reminded him where we were.' }, fx: { money: -100, happy: 6 }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai voulu marchander. Il a doublé les prix. Pour tout le monde. À cause de moi. Ce soir, je mange mes nouilles très, très discrètement.", en: 'I tried to haggle. He doubled the prices. For everyone. Because of me. Tonight I eat my noodles very, very quietly.' }, fx: { happy: -3, fn: resp(-8) } },
      ] },
      { label: { fr: 'Refuser poliment', en: 'Politely decline' }, text: { fr: "J'ai refusé. Il a noté mon nom dans un petit carnet. Je ne sais pas ce que ça veut dire, et c'est exactement le but.", en: "I declined. He wrote my name in a little notebook. I don't know what that means, and that's exactly the point." }, fx: { stress: 4 } },
    ],
  },
  {
    id: 'p2_guard_karaoke', icon: '🎤', cat: 'prison', rating: 2, cooldown: 6, when: INSIDE,
    scene: { place: 'prison', mood: 'angry' },
    text: {
      fr: [
        "Le gardien-chef Dumont, recalé d'un télé-crochet en 2004, réveille l'aile à 5 h 30 avec son propre album de rap. Nouvelle règle : chaque détenu doit chanter le refrain. « Mets-y de l'âme, déchet. »",
        "Le surveillant Lebrun, sadique certifié, organise un karaoké obligatoire. Celui qui chante faux récure les toilettes de l'aile avec une brosse à dents. La sienne. C'est ton tour.",
      ],
      en: [
        "Head guard Dumont, rejected from a TV talent show in 2004, wakes the wing at 5:30 a.m. blasting his own rap album. New rule: every inmate must sing the chorus. “Put some soul in it, garbage.”",
        "Officer Lebrun, certified sadist, runs mandatory karaoke. Anyone who sings off-key scrubs the wing's toilets with a toothbrush. Their own. It's your turn.",
      ],
    },
    choices: [
      { label: { fr: 'Chanter à fond', en: 'Belt it out' }, out: [
        { w: 2, text: { fr: "J'ai chanté comme si ma vie en dépendait. Ce qui était le cas. Le gardien a versé une larme et m'a nommé{|e} choriste officiel{|le}. Je chante à 5 h 30 tous les matins. J'ai gagné ? Je ne sais pas.", en: "I sang like my life depended on it. It did. The guard shed a tear and named me official backing vocalist. I sing at 5:30 every morning now. Did I win? Unclear." }, fx: { stress: 5, fn: resp(-3) } },
        { w: 1, text: { fr: "J'ai chanté faux. Très faux. J'ai récuré les chiottes à la brosse à dents pendant six heures. J'ai vu au fond de ces cuvettes des choses que même la science refuse de nommer.", en: "I sang off-key. Very off-key. I scrubbed toilets with a toothbrush for six hours. I saw things at the bottom of those bowls that science refuses to name." }, fx: { health: -4, happy: -8, visual: 'poop' }, mood: 'sick' },
      ] },
      { label: { fr: 'Saboter la sono', en: 'Sabotage the speaker' }, out: [
        { w: 1, text: { fr: "J'ai versé de la soupe dans la sono. Elle a fait des étincelles, puis un dernier « yo » déchirant avant de mourir. L'aile m'a porté{|e} en triomphe. Le gardien m'a porté{|e} au mitard.", en: 'I poured soup into the speaker. It sparked, let out one last heartbreaking “yo,” and died. The wing carried me in triumph. The guard carried me to solitary.' }, fx: { happy: 8, fn: resp(20) }, mood: 'proud' },
        { w: 1, text: { fr: "La sono a pris feu, puis le rideau, puis les sourcils du gardien. Il me hait. Je n'ai plus de sourcils non plus, par solidarité forcée. Un an de plus pour « incendie lyrique ».", en: "The speaker caught fire, then the curtain, then the guard's eyebrows. He hates me. I lost my eyebrows too, out of forced solidarity. One more year for “lyrical arson.”" }, fx: { health: -6, jail: 1, visual: 'fire', fn: resp(10) }, mood: 'shock' },
      ] },
      { label: { fr: 'Applaudir très fort', en: 'Applaud loudly' }, text: { fr: "J'ai applaudi à tout rompre en hurlant « ARTISTE ! ». Il m'a exempté{|e} de karaoké à vie. Les autres me regardent comme un traître. Un traître qui dort jusqu'à 6 h.", en: "I applauded wildly, screaming “ARTIST!” He exempted me from karaoke for life. The others look at me like a traitor. A traitor who sleeps till 6." }, fx: { happy: 3, fn: resp(-10) } },
    ],
  },
  {
    id: 'p2_guard_crush', icon: '💘', cat: 'prison', rating: 1, cooldown: 6, when: { prison: true, age: ADULT, noFlag: 'p2_guard_lover' }, actor: CRUSH,
    scene: { place: 'prison', mood: 'love' },
    text: {
      fr: [
        "{a:Le|La} surveillant{a:|e} {a.first} te glisse des petits mots dans ta purée. « Tu as de beaux yeux, matricule 4127. » Le dernier était accompagné d'un cœur dessiné au ketchup. Enfin, on espère que c'est du ketchup.",
        "{a.first}, {a:le|la} gardien{a:|ne} de l'aile, rougit chaque fois qu'{a:il|elle} fouille ta cellule. Aujourd'hui, {a:il|elle} l'a fouillée trois fois. Rien trouvé. Beaucoup soupiré.",
      ],
      en: [
        "Officer {a.first} slips little notes into your mashed potatoes. “You have pretty eyes, inmate 4127.” The last one came with a heart drawn in ketchup. Hopefully ketchup.",
        "{a.first}, the wing's guard, blushes every time {a:he|she} searches your cell. Today {a:he|she} searched it three times. Found nothing. Sighed a lot.",
      ],
    },
    choices: [
      { label: { fr: 'Flirter en retour', en: 'Flirt back' }, text: { fr: "J'ai répondu dans ma purée : « Toi aussi, gardien{a:|ne} de mon cœur. » Depuis, j'ai des yaourts en plus, des fouilles très longues et des frissons quand les clés tintent.", en: "I replied in my mashed potatoes: “You too, keeper of my heart.” Since then: extra yogurts, very long searches, and shivers whenever keys jingle." }, fx: { rel: 25, happy: 8, actorRole: 'partner', flag: 'p2_guard_lover', schedule: { key: 'p2_guard_caught', years: 1 } }, mood: 'love' },
      { label: { fr: 'Rendez-vous au placard', en: 'Meet in the closet' }, rating: 2, text: { fr: "Placard à balais, minuit. On a découvert au seau à serpillière des usages que le fabricant n'avait pas prévus. Le balai est tombé trois fois. Personne n'est venu. Tout le monde a entendu.", en: "Broom closet, midnight. We discovered uses for a mop bucket the manufacturer never intended. The broom fell over three times. Nobody came. Everybody heard." }, fx: { rel: 30, happy: 12, actorRole: 'partner', flag: 'p2_guard_lover', schedule: { key: 'p2_guard_caught', years: 1 }, visual: 'hearts' }, mood: 'love' },
      { label: { fr: 'En profiter', en: 'Use it' }, text: { fr: "J'ai joué les cœurs à prendre pour obtenir une télé, un oreiller en plumes et le choix de la radio. {a.first} pense qu'on est fiancés. Moi, je pense à mon oreiller.", en: "I played hard-to-get for a TV, a feather pillow and control of the radio. {a.first} thinks we're engaged. I think about my pillow." }, fx: { karma: -4, happy: 8, rel: 10, fn: resp(5) } },
      { label: { fr: 'Refuser gentiment', en: 'Gently refuse' }, text: { fr: "J'ai dit à {a.first} que je ne mélangeais pas amour et incarcération. {a:Il|Elle} a pleuré dans son talkie-walkie. Toute la prison a entendu. Les fouilles sont redevenues brutales et rapides.", en: "I told {a.first} I don't mix love and incarceration. {a:He|She} cried into {a.his} walkie-talkie. The whole prison heard. Searches went back to fast and rough." }, fx: { rel: -20, happy: -2 } },
    ],
  },
  {
    id: 'p2_guard_caught', icon: '📹', cat: 'prison', rating: 2, chainOnly: true, when: { prison: true, age: ADULT, flag: 'p2_guard_lover' }, actor: 'lover',
    scene: { place: 'prison', mood: 'shock' },
    text: {
      fr: [
        "Le directeur a intercepté tes petits mots à {a.first}. Il les a lus au réfectoire, au micro, en imitant ta voix. Le passage sur « tes clés qui tintent » a été ovationné.",
        "Une caméra a filmé {a.first} et toi en train de vous embrasser derrière les machines à laver. La vidéo a fait le tour de la prison. Quelqu'un l'a mise en musique. {a.first} est convoqué{a:|e} chez le directeur.",
      ],
      en: [
        "The warden intercepted your love notes to {a.first}. He read them aloud in the mess hall, on the mic, doing your voice. The bit about “your jingling keys” got a standing ovation.",
        "A camera caught you and {a.first} making out behind the washing machines. The video went around the whole prison. Someone set it to music. {a.first} has been summoned by the warden.",
      ],
    },
    choices: [
      { label: { fr: 'Tout prendre sur moi', en: 'Take the blame' }, out: [
        { w: 1, text: { fr: "J'ai pris toute la faute. {a.first} a gardé son poste et m'aime encore plus. J'ai pris un an de plus pour « corruption de fonctionnaire par le charme ». Ça les vaut.", en: "I took all the blame. {a.first} kept the job and loves me even more. I got one more year for “corrupting a civil servant through charm.” Worth it." }, fx: { jail: 1, rel: 20, karma: 3 }, mood: 'love' },
        { w: 1, text: { fr: "J'ai tout avoué. {a.first} a été viré{a:|e} sur-le-champ. {a:Il|Elle} m'attend dehors, au chômage, avec mon numéro de matricule tatoué sur l'avant-bras. C'est romantique et un peu inquiétant.", en: '{a.first} was fired on the spot after I confessed everything. {a:He|She} waits for me outside, unemployed, with my inmate number tattooed on {a.his} forearm. Romantic and slightly alarming.' }, fx: { rel: 10, happy: 3, unflag: 'p2_guard_lover' } },
      ] },
      { label: { fr: 'Nier en bloc', en: 'Deny everything' }, text: { fr: "J'ai nié : « Ce n'est pas moi sur la vidéo, c'est mon jumeau maléfique. » Je n'ai pas de jumeau. {a.first} m'a quitté{|e} pour lâcheté et a demandé sa mutation. Toute l'aile m'appelle « le Jumeau ».", en: "I denied it: “That's not me in the video, that's my evil twin.” I have no twin. {a.first} dumped me for cowardice and asked for a transfer. The whole wing calls me “the Twin.”" }, fx: { actorRole: 'ex', rel: -30, happy: -10, unflag: 'p2_guard_lover', fn: resp(-5) }, mood: 'cry' },
      { label: { fr: 'Demander sa main', en: 'Propose' }, text: { fr: "Pris{|e} la main dans le sac, j'ai posé un genou à terre devant le directeur. {a.first} a dit oui. Le directeur a dit « …bon ». Les gardiens ont pleuré dans leurs gilets pare-balles.", en: "Caught red-handed, I dropped to one knee in front of the warden. {a.first} said yes. The warden said “…fine.” The guards wept into their stab vests." }, fx: { actorRole: 'fiance', rel: 25, happy: 12, unflag: 'p2_guard_lover', visual: 'hearts' }, mood: 'love' },
    ],
  },

  // ═════════════════════════════ PRISON: solitary, visits, events ═════════════════════════════
  {
    id: 'p2_solitary_gilbert', icon: '🕳️', cat: 'prison', rating: 1, cooldown: 6, when: INSIDE,
    scene: { place: 'prison', mood: 'sleepy' },
    text: {
      fr: [
        "Mitard, jour 40. Tu as baptisé la bouche d'évacuation « Gilbert ». Ce matin, Gilbert t'a répondu. Il a une voix grave, un léger accent belge et des opinions très arrêtées sur ton procès.",
        "Mitard, jour 33. Ton seul ami est une tache d'humidité en forme de Napoléon. Aujourd'hui, elle t'a proposé un plan pour conquérir l'aile B. Il faut avouer qu'il tient la route.",
      ],
      en: [
        "Solitary, day 40. You named the floor drain “Gilbert.” This morning, Gilbert answered. He has a deep voice, a slight Belgian accent and very strong opinions about your trial.",
        "Solitary, day 33. Your only friend is a damp stain shaped like Napoleon. Today it pitched you a plan to conquer B Block. Honestly, the plan holds up.",
      ],
    },
    choices: [
      { label: { fr: 'Écouter la voix', en: 'Listen to the voice' }, out: [
        { w: 1, text: { fr: "La voix m'a conseillé de faire appel. C'était le détenu du dessous, un avocat radié qui parlait par le tuyau. Grâce à lui, j'ai eu une remise de peine. Je lui dois tout. Je ne connais pas son visage.", en: "The voice told me to appeal. It was the inmate below, a disbarred lawyer talking through the pipe. Thanks to him I got time off. I owe him everything. I've never seen his face." }, fx: { smarts: 3, happy: 5, fn: cut(1) }, mood: 'happy' },
        { w: 1, text: { fr: "J'ai suivi ses conseils pendant des semaines. À ma sortie du mitard, le psy m'a demandé à qui je parlais. J'ai répondu « Gilbert ». Il a écrit très, très longtemps.", en: "I followed its advice for weeks. When I got out, the shrink asked who I was talking to. I said “Gilbert.” He wrote for a very, very long time." }, fx: { stress: 10, happy: -5, disease: 'anxiety' }, mood: 'shock' },
      ] },
      { label: { fr: 'Chanter une comédie musicale', en: 'Sing a whole musical' }, text: { fr: "J'ai chanté l'intégrale des Misérables, tous les rôles, deux fois. Au deuxième « À la volonté du peuple », le gardien m'a sorti{|e} plus tôt pour sauver sa santé mentale.", en: "I sang the whole of Les Misérables, every part, twice. During the second “Do You Hear the People Sing,” the guard let me out early to save his own sanity." }, fx: { happy: 4, fn: resp(5) } },
      { label: { fr: '4 000 pompes par jour', en: '4,000 push-ups a day' }, text: { fr: "J'ai fait 4 000 pompes par jour. Je suis ressorti{|e} avec des bras comme des jambons et le regard d'un moine guerrier. Personne ne me parle. Tout le monde me cède sa place.", en: "I did 4,000 push-ups a day. I came out with arms like hams and the stare of a warrior monk. Nobody talks to me. Everybody gives me their seat." }, fx: { athletic: 10, happy: -3, fn: resp(12) }, mood: 'proud' },
    ],
  },
  {
    id: 'p2_cellmate_wedding', icon: '💒', cat: 'prison', rating: 2, once: true, when: INSIDE, actor: CELLMATE,
    scene: { place: 'prison', mood: 'party' },
    text: {
      fr: [
        "{a.first}, ton codétenu{a:|e}, se marie samedi avec son amour épistolaire, une personne jamais vue « qui met des cœurs sur les i ». Tu es témoin. Le gâteau a été fouillé à la baïonnette.",
        "Grand jour pour {a.first}, ton codétenu{a:|e} : mariage à la chapelle de la prison avec son amour par correspondance. Tu es témoin, tu portes un costume en papier crépon, et tu dois faire le discours.",
      ],
      en: [
        "{a.first}, your cellmate, is marrying a pen-pal sweetheart on Saturday, someone never met in person “who dots their i's with hearts.” You're the witness. The cake was searched with a bayonet.",
        "Big day for {a.first}, your cellmate: a prison-chapel wedding to a mail-order sweetheart. You're the witness, you're wearing a crepe-paper suit, and you have to give the speech.",
      ],
    },
    choices: [
      { label: { fr: 'Discours émouvant', en: 'Moving speech' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai parlé de l'amour derrière les barreaux. Même le gardien a pleuré. Les mariés m'ont offert la part de gâteau avec la lime dedans. Je l'ai rendue, par principe.", en: "I spoke about love behind bars. Even the guard cried. The couple gave me the slice of cake with the file in it. I gave it back, on principle." }, fx: { rel: 15, karma: 2, happy: 6 }, mood: 'love' },
        { w: 1, text: { fr: "J'ai commencé par « Je me souviens de sa première condamnation… ». Quatorze minutes d'anecdotes judiciaires plus tard, la belle-famille était partie avant le dessert.", en: "I opened with “I remember {a.his} first conviction…” Fourteen minutes of courtroom anecdotes later, the in-laws had left before dessert." }, fx: { rel: -10, happy: 2 } },
      ] },
      { label: { fr: 'Discours trash', en: 'Filthy speech' }, text: { fr: "J'ai raconté comment {a.first} s'était fait pincer : en slip léopard, coincé{a:|e} dans la chatière d'une bijouterie, une bague dans chaque narine. La mamie a ri si fort qu'elle a perdu son dentier dans le punch. Mariage réussi.", en: "I told everyone how {a.first} got busted: in leopard briefs, stuck in a jewelry store's cat flap, a ring up each nostril. Grandma laughed so hard her dentures fell in the punch. Great wedding." }, fx: { rel: 5, happy: 8, fn: resp(5) }, mood: 'party' },
      { label: { fr: "M'opposer au mariage", en: 'Object' }, text: { fr: "Au « que celui qui s'oppose… », j'ai levé la main pour demander les toilettes. Tout le monde a cru que je m'opposais. Bagarre générale. {a.first} a perdu une dent. L'autre l'a gardée en souvenir.", en: "At “speak now or forever…”, I raised my hand to ask for the bathroom. Everyone thought I was objecting. Full brawl. {a.first} lost a tooth. The new spouse kept it as a keepsake." }, fx: { rel: -20, health: -4, visual: 'gore', fn: resp(8) }, mood: 'shock' },
    ],
  },
  {
    id: 'p2_visit_sibling', icon: '👀', cat: 'prison', cooldown: 4, when: INSIDE, actor: 'sibling',
    scene: { place: 'prison', mood: 'angry' },
    text: {
      fr: [
        "{a.rel}, {a.first}, vient au parloir. {a:Il|Elle} a l'air ravi{a:|e}. Trop ravi{a:|e}. {a:Il|Elle} porte ta veste préférée et conduit, paraît-il, ta voiture.",
        "Parloir : {a.first} débarque avec une perche à selfie et la tête de quelqu'un qui va raconter ce moment à chaque repas de famille jusqu'à la fin des temps.",
        "{a.first} vient te voir au parloir avec {w:food} — « recette maison », jure-t-{a:il|elle} — alors que l'étiquette du supermarché est encore dessus. {a:Il|Elle} porte ta montre. Et tes chaussures. Et ton sourire en coin.",
        "Visite de {a.rel}, {a.first}, qui arrive avec [[vingt minutes|une heure|deux heures]] de retard, « {w:excuse} », dit-{a:il|elle}. {a:Il|Elle} a déjà pris ta chambre chez les parents et ta place dans le cœur de mamie.",
        "Parloir. {a.first} s'assoit en face de toi, sort son téléphone et te montre des photos de ses vacances {w:far_place}. Avec ta carte bancaire, apparemment. {a:Il|Elle} te remercie chaleureusement.",
      ],
      en: [
        "Your sibling {a.first} comes to visit. {a:He|She} looks delighted. Too delighted. {a:He|She} is wearing your favorite jacket and, apparently, driving your car.",
        "Visiting hours: {a.first} shows up with a selfie stick and the face of someone who will bring this up at every family dinner until the end of time.",
        "{a.first} visits you with {w:food} — 'my own recipe', {a:he|she} swears — with the supermarket label still on. {a:He|She} is wearing your watch. And your shoes. And your smirk.",
        "A visit from your sibling {a.first}, who shows up [[twenty minutes|an hour|two hours]] late, '{w:excuse}', {a:he|she} says. {a:He|She} has already taken your room at your parents' and your place in Grandma's heart.",
        "Visiting room. {a.first} sits across from you, pulls out a phone and shows you vacation photos {w:far_place}. Paid for with your bank card, apparently. {a:He|She} thanks you warmly.",
      ],
    },
    choices: [
      { label: { fr: 'Exiger ma veste', en: 'Demand my jacket' }, text: { fr: ["J'ai exigé ma veste. {a.first} a dit qu'elle lui « allait mieux de toute façon ». Le gardien a confirmé. Je hais ma famille et ce gardien.", "J'ai exigé ma veste. {a.first} l'a enlevée, me l'a tendue à travers la vitre… puis le gardien l'a confisquée comme « objet non autorisé ». Il la porte maintenant. Tout le monde porte ma veste sauf moi."], en: ["{a.first} said my jacket “looks better on me anyway.” The guard agreed. I hate my family and that guard.", "I demanded my jacket. {a.first} took it off and passed it toward me… and the guard confiscated it as an 'unauthorized item'. He wears it now. Everyone wears my jacket except me."] }, fx: { rel: -8, happy: -3 }, mood: 'angry' },
      { label: { fr: 'Demander des nouvelles', en: 'Ask for news' }, text: { fr: ["{a.first} m'a tout raconté : maman a transformé ma chambre en salle de yoga, le chat m'a oublié{|e}, et mon ex sort avec mon dentiste. J'aurais préféré la veste.", "J'ai demandé des nouvelles. {a.first} m'a appris que papa a découvert {w:hobby}, que mamie a un nouveau copain et que mon poisson rouge a été « remplacé ». Le monde continue sans moi."], en: ["{a.first} told me everything: Mom turned my room into a yoga studio, the cat forgot me, and my ex is dating my dentist. I would have preferred the jacket.", "I asked for news. {a.first} told me Dad discovered {w:hobby}, Grandma has a new boyfriend and my goldfish was 'replaced'. The world goes on without me."] }, fx: { happy: -5, rel: 5, smarts: 1 } },
      { label: { fr: 'Faire pitié', en: 'Play the victim' }, text: { fr: ["J'ai décrit la prison avec des détails si sordides que {a.first} a pleuré et promis de me rendre la voiture. {a:Il|Elle} a aussi mis de l'argent sur mon compte cantine. La comédie, ça paie.", "J'ai fait semblant d'avoir un rhume terrible et une tristesse infinie. {a.first} a craqué : {a:il|elle} m'a promis {w:gift} pour Noël et a juré de rendre la voiture. Je tousse encore un peu, pour entretenir."], en: ["{a.first} cried at my horribly detailed description of prison and promised to give the car back. {a:He|She} also put money on my commissary account. Acting pays.", "I faked a terrible cold and infinite sadness. {a.first} cracked: promised me {w:gift} for Christmas and swore to return the car. I still cough a little, for upkeep."] }, fx: { rel: 8, happy: 5, money: 100 }, mood: 'happy' },
    ],
  },
  {
    id: 'p2_visit_child', icon: '🖍️', cat: 'prison', cooldown: 4, when: INSIDE, actor: 'child',
    scene: { place: 'prison', mood: 'sad' },
    text: {
      fr: [
        "{a.first} vient te voir au parloir avec un dessin : toi, en pyjama rayé, derrière des barreaux, avec des larmes en forme de cœur. Titre : « {Papa|Maman} en vacances forcées ».",
        "Au parloir, {a.first} t'avoue avoir raconté à tout le monde que tu étais « en mission secrète en Antarctique ». Maintenant, tous ses amis veulent une photo de pingouin.",
      ],
      en: [
        "{a.first} comes to visit with a drawing: you, in striped pajamas, behind bars, crying heart-shaped tears. Title: “{Dad|Mom} on a Forced Vacation.”",
        "At visiting hours, {a.first} confesses to telling everyone you're “on a secret mission in Antarctica.” Now all {a.his} friends want a penguin photo.",
      ],
    },
    choices: [
      { label: { fr: 'Jouer le jeu', en: 'Play along' }, text: { fr: "J'ai expliqué à {a.first} que les barreaux protègent les gardiens de moi, agent secret ultra-dangereux. {a:Il|Elle} m'a regardé{|e} avec des étoiles dans les yeux. Les gardiens ont levé les yeux au ciel.", en: 'I told {a.first} the bars are there to protect the guards from me, a super-dangerous secret agent. {a:He|She} looked at me with stars in {a.his} eyes. The guards rolled theirs.' }, fx: { rel: 15, happy: 6 }, mood: 'happy' },
      { label: { fr: 'Dire la vérité', en: 'Tell the truth' }, text: { fr: "J'ai dit la vérité : j'ai fait une bêtise et je la paie. {a.first} a hoché la tête : « Moi aussi j'ai cassé un vase une fois. » On s'est compris. Le gardien a fait semblant d'avoir une poussière dans l'œil.", en: "I told the truth: I messed up and I'm paying for it. {a.first} nodded: “I broke a vase once too.” We understood each other. The guard pretended to have something in his eye." }, fx: { rel: 20, karma: 4, counter: 'prisonGood' }, mood: 'love' },
      { label: { fr: 'Pleurer', en: 'Cry' }, text: { fr: "J'ai fondu en larmes au milieu du parloir. {a.first} m'a tapoté la main à travers la vitre en disant « ça va aller ». Les rôles sont inversés depuis.", en: '{a.first} patted my hand through the glass saying “it\'ll be okay” while I sobbed in the middle of the visiting room. The roles have been reversed ever since.' }, fx: { rel: 8, happy: -4 }, mood: 'cry' },
    ],
  },
  {
    id: 'p2_lockdown', icon: '🔐', cat: 'prison', cooldown: 6, when: INSIDE,
    scene: { place: 'prison', mood: 'sleepy' },
    text: {
      fr: [
        "Confinement total : quelqu'un a volé le yaourt aux fruits rouges du directeur. Tout le monde reste en cellule 23 h sur 24 jusqu'à ce que le coupable se dénonce. Ça fait trois semaines. Le yaourt doit être périmé.",
        "Bouclage de la prison après une « intrusion » (un hamster dans les conduits d'aération). Trois semaines sans promenade. Tu as compté les carreaux, les cils de ton codétenu, et tes regrets.",
        "Confinement général : quelqu'un a caché {w:object} dans le bureau du directeur. Personne ne sort tant que le coupable ne s'est pas dénoncé. Ça fait [[dix jours|deux semaines|un mois]]. L'aile entière dégage {w:smell}.",
        "Lockdown après qu'un détenu a lâché {w:animal} dans le réfectoire. L'animal court toujours. Toi, tu es en cellule depuis trois semaines avec ton codétenu, qui chantonne {w:song} sans arrêt.",
        "Bouclage total : le directeur a perdu les clés de sa voiture et soupçonne tout le monde. Tu tournes en rond depuis {w:time}. Tu as fini par {w:activity} pour passer le temps. Ça ne passe pas.",
      ],
      en: [
        "Full lockdown: someone stole the warden's berry yogurt. Everyone stays in their cells 23 hours a day until the culprit confesses. It's been three weeks. That yogurt must be expired.",
        "Prison lockdown after an “intrusion” (a hamster in the air vents). Three weeks without yard time. You've counted the tiles, your cellmate's eyelashes, and your regrets.",
        "General lockdown: someone hid {w:object} in the warden's office. Nobody leaves until the culprit confesses. It's been [[ten days|two weeks|a month]]. The whole wing gives off {w:smell}.",
        "Lockdown after an inmate released {w:animal} in the mess hall. The animal is still at large. You've been locked in for three weeks with your cellmate, who keeps humming {w:song}.",
        "Total lockdown: the warden lost his car keys and suspects everyone. You've been pacing since {w:time}. You ended up {w:activity} to pass the time. Time isn't passing.",
      ],
    },
    choices: [
      { label: { fr: 'Écrire mes mémoires', en: 'Write my memoirs' }, text: { fr: ["J'ai écrit mes mémoires sur du papier toilette. Trois cents feuilles, double épaisseur. Titre : « Derrière les barreaux, devant le destin ». C'est un chef-d'œuvre. Mon codétenu pense que c'est du papier toilette.", "J'ai écrit mes mémoires. Chapitre 1 : « L'enfance ». Chapitre 2 : « L'erreur ». Chapitre 3 : « Le yaourt ». Un éditeur m'a répondu. Il veut seulement le chapitre 3."], en: ["I wrote my memoirs on toilet paper. Three hundred sheets, two-ply. Title: “Behind Bars, Before Destiny.” It's a masterpiece. My cellmate thinks it's toilet paper.", "I wrote my memoirs. Chapter 1: 'Childhood'. Chapter 2: 'The Mistake'. Chapter 3: 'The Yogurt'. A publisher wrote back. He only wants chapter 3."] }, fx: { smarts: 4, happy: 4, flag: 'p2_memoir', schedule: { key: 'p2_memoir_deal', years: 2 } }, mood: 'proud' },
      { label: { fr: 'Sport en cellule', en: 'Cell workout' }, text: { fr: ["Squats, pompes, burpees, jusqu'à ce que mon codétenu menace de me burpeer moi-même. Je suis {sec|sèche} comme une biscotte.", "J'ai fait du sport en cellule [[six|huit|dix]] heures par jour en utilisant mon codétenu comme haltère. Il a fini par aimer ça. On sort tous les deux avec des abdos."], en: ["Squats, push-ups, burpees, until my cellmate threatened to burpee me personally. I am as lean as a cracker.", "I worked out in my cell [[six|eight|ten]] hours a day using my cellmate as a dumbbell. He ended up liking it. We're both coming out with abs."] }, fx: { athletic: 6, health: 3 } },
      { label: { fr: 'Dormir', en: 'Sleep' }, text: { fr: ["J'ai dormi trois semaines. Meilleur moment de ma détention. Je recommande le confinement à tout le monde.", "J'ai dormi. Beaucoup. Tellement que les gardiens sont venus vérifier si j'étais encore vivant{|e}. Je me suis réveillé{|e} juste pour leur dire de baisser le volume."], en: ["I slept for three weeks. Best part of my sentence. I recommend lockdown to everyone.", "I slept. A lot. So much the guards came to check if I was still alive. I woke up just to tell them to keep it down."] }, fx: { happy: 4, stress: -8 }, mood: 'sleepy' },
      { label: { fr: 'Avouer pour le yaourt', en: 'Confess to the yogurt' }, text: { fr: ["J'ai avoué le vol pour faire lever le confinement. Je n'avais rien volé. Toute la prison m'acclame. Le directeur m'a collé{|e} une semaine au mitard et m'appelle « Fruits Rouges ».", "J'ai tout avoué, même ce que je n'avais pas fait. Le confinement a été levé. Les détenus m'ont offert des nouilles en remerciement. Le vrai coupable m'a offert {w:food}. Je sais qui c'est."], en: ["I confessed to end the lockdown. I hadn't stolen anything. The whole prison cheers me. The warden gave me a week in solitary and calls me “Mixed Berry.”", "I confessed everything, even what I didn't do. The lockdown was lifted. The inmates gave me noodles as thanks. The real culprit gave me {w:food}. I know who it is."] }, fx: { happy: 3, karma: 3, fn: resp(20) }, mood: 'proud' },
    ],
  },
  {
    id: 'p2_memoir_deal', icon: '📖', cat: 'crime', rating: 1, chainOnly: true, when: { flag: 'p2_memoir' }, vars: { amount: [8000, 60000] },
    scene: { place: 'home', mood: 'proud', fx: 'money' },
    text: {
      fr: [
        "Un éditeur parisien a entendu parler de tes mémoires écrites sur papier toilette. Il veut les publier telles quelles, sur papier toilette. « Concept fort. » Il propose {$amount}.",
        "Une maison d'édition veut publier tes mémoires de taule. Ils ont déjà un titre : « Évadé{|e} de moi-même ». Ils proposent {$amount} et une tournée de dédicaces dans les supermarchés.",
      ],
      en: [
        "A fancy publisher heard about your toilet-paper memoirs. They want to publish them as is, on toilet paper. “Strong concept.” They offer {$amount}.",
        "A publishing house wants your prison memoirs. They already have a title: “Escaping Myself.” They offer {$amount} and a supermarket book-signing tour.",
      ],
    },
    choices: [
      { label: { fr: 'Signer', en: 'Sign' }, text: { fr: "J'ai signé. Le livre est sorti en rouleaux, vendu dans toutes les stations-service. Les critiques le trouvent « absorbant ». J'ai touché {$amount}.", en: 'I signed. The book came out in rolls, sold at every gas station. Critics call it “absorbing.” I made {$amount}.' }, fx: { money: 'amount', fame: 8, followers: 5000, unflag: 'p2_memoir', visual: 'money' }, mood: 'party' },
      { label: { fr: 'Exiger plus', en: 'Demand more' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai exigé plus et une adaptation ciné. Ils ont dit oui. Un acteur bodybuildé jouera mon rôle. Il ne me ressemble pas du tout, et c'est tant mieux.", en: "I demanded more and a movie deal. They said yes. A ripped actor will play me. He looks nothing like me, which is for the best." }, fx: { money: 'amount', fame: 12, followers: 15000, unflag: 'p2_memoir', visual: 'money' }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai exigé plus. L'éditeur a raccroché et publié à la place les mémoires du chat d'un influenceur. Numéro un des ventes. Je déteste ce chat.", en: "I demanded more. The publisher hung up and released an influencer's cat's memoirs instead. Number one bestseller. I hate that cat." }, fx: { happy: -8, unflag: 'p2_memoir' }, mood: 'angry' },
      ] },
      { label: { fr: 'Refuser', en: 'Decline' }, text: { fr: "J'ai refusé. Mes mémoires resteront dans un tiroir, où elles finiront fatalement par retrouver leur usage d'origine.", en: 'I declined. My memoirs will stay in a drawer, where they will inevitably return to their original purpose.' }, fx: { smarts: 1, unflag: 'p2_memoir' } },
    ],
  },
  {
    id: 'p2_riot', icon: '🔥', cat: 'prison', rating: 2, cooldown: 6, when: INSIDE,
    scene: { place: 'prison', mood: 'angry', fx: 'fire' },
    text: {
      fr: [
        "Le directeur annule le spectacle de fin d'année, la comédie musicale « Les Barreaux de la Gloire » que tout le monde répète depuis six mois. L'aile C met le feu aux costumes. C'est l'émeute.",
        "Émeute ! Un gardien a zappé en pleine finale du concours de talents de la prison. Matelas en flammes, plateaux volants, et un détenu en tutu qui frappe un bouclier anti-émeute avec une prothèse de jambe.",
      ],
      en: [
        "The warden cancels the year-end show, the musical “Bars of Glory” everyone has rehearsed for six months. C Block sets the costumes on fire. It's a riot.",
        "Riot! A guard changed the channel during the prison talent show final. Mattresses ablaze, trays flying, and an inmate in a tutu beating a riot shield with a prosthetic leg.",
      ],
    },
    choices: [
      { label: { fr: 'Mener la révolte', en: 'Lead the riot' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "Debout sur une table, un matelas enflammé en guise de cape, j'ai harangué les foules. On a tenu l'aile six heures. Canon à eau, gloire éternelle, et deux ans de plus.", en: "Standing on a table with a flaming mattress for a cape, I rallied the masses. We held the wing for six hours. Water cannon, eternal glory, and two more years." }, fx: { health: -6, jail: 2, visual: 'fire', fn: resp(25) }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai crié « À l'assaut ! » en levant le poing. Une balle en caoutchouc m'a frappé{|e} pile entre les yeux. Réveil à l'infirmerie avec un bleu en forme d'écusson et deux ans de plus.", en: "I yelled “CHARGE!” with my fist in the air. A rubber bullet hit me right between the eyes. Woke up in the infirmary with a badge-shaped bruise and two more years." }, fx: { health: -15, jail: 2, visual: 'gore', fn: resp(10) }, mood: 'cry' },
      ] },
      { label: { fr: 'Me cacher dans le sèche-linge', en: 'Hide in the dryer' }, text: { fr: "Je me suis caché{|e} dans un sèche-linge industriel pendant huit heures. Quelqu'un l'a allumé à la sixième. Je suis ressorti{|e} chaud{|e}, propre et légèrement rétréci{|e}.", en: 'I hid in an industrial dryer for eight hours. Someone switched it on at hour six. I came out warm, clean and slightly shrunk.' }, fx: { health: -5, happy: -2 }, mood: 'sick' },
      { label: { fr: "Piller l'infirmerie", en: 'Loot the infirmary' }, out: [
        { w: 1, text: { fr: "Butin : 40 boîtes de paracétamol, un stéthoscope et un bocal contenant un appendice. J'ai échangé l'appendice contre trois mois de cigarettes. Le commerce, c'est le commerce.", en: 'Loot: 40 boxes of painkillers, a stethoscope and a jar holding an appendix. I traded the appendix for three months of cigarettes. Business is business.' }, fx: { happy: 5, fn: resp(8) }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai avalé une poignée de pilules au hasard. J'ai passé l'émeute à câliner un extincteur en lui disant qu'il était beau. Il l'était.", en: 'I swallowed a random handful of pills. I spent the riot hugging a fire extinguisher and telling it it was beautiful. It was.' }, fx: { happy: 8, health: -8, addiction: ['drugs', 10] }, mood: 'party' },
      ] },
      { label: { fr: 'Protéger un gardien', en: 'Protect a guard' }, text: { fr: "J'ai planqué un jeune gardien terrifié sous mon matelas. Il a témoigné en ma faveur. Remise de peine. L'aile C me surnomme « le Paillasson ».", en: 'I hid a terrified young guard under my mattress. He testified on my behalf. Time off my sentence. C Block calls me “the Doormat.”' }, fx: { karma: 8, counter: 'prisonGood', fn: both(resp(-15), cut(1)) }, mood: 'proud' },
    ],
  },
  {
    id: 'p2_tv_war', icon: '📺', cat: 'prison', rating: 2, cooldown: 5, when: INSIDE,
    scene: { place: 'prison', mood: 'angry' },
    text: {
      fr: [
        "Guerre de la télécommande : les papys de perpète veulent leur télénovela, les gros bras veulent le foot, et un ex-chef étoilé veut son émission de cuisine. Une seule télé. Une télécommande scotchée.",
        "Salle télé, 20 h 59. Le gang des « Amours Interdites » (fans de soap) fait face au gang du foot. La télécommande est au milieu de la table. Quelqu'un fait craquer ses doigts. Quelqu'un d'autre fait craquer ceux d'un autre.",
      ],
      en: [
        "Remote control war: the old lifers want their telenovela, the muscle wants football, and an ex-Michelin chef wants his cooking show. One TV. One taped-up remote.",
        "TV room, 8:59 p.m. The “Forbidden Love” gang (soap fans) faces off against the football gang. The remote sits in the middle of the table. Someone cracks their knuckles. Someone else cracks someone else's.",
      ],
    },
    choices: [
      { label: { fr: 'Arracher la télécommande', en: 'Grab the remote' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai plongé comme un gardien de but. Je l'ai. J'ai mis un documentaire sur les loutres. Silence. Puis tout le monde a pleuré devant les bébés loutres. Je suis le roi de la salle télé.", en: "I dove like a goalkeeper. Got it. I put on an otter documentary. Silence. Then everyone wept at the baby otters. I am king of the TV room." }, fx: { happy: 6, fn: resp(15) }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai attrapé la télécommande. Un papy de 82 ans m'a mordu le mollet avec son dentier, jusqu'au sang. Il ne lâchait pas. On a appelé l'infirmière, puis le dentiste, puis l'aumônier.", en: "I grabbed the remote. An 82-year-old lifer bit my calf with his dentures until it bled. He wouldn't let go. We called the nurse, then the dentist, then the chaplain." }, fx: { health: -10, visual: 'gore', fn: resp(-5) }, mood: 'cry' },
      ] },
      { label: { fr: 'Organiser un vote', en: 'Hold a vote' }, text: { fr: "Vote démocratique : télénovela 31, foot 30. Le foot a contesté. Recompte. Émeute légère. La démocratie est fragile, même ici. Surtout ici.", en: 'Democratic vote: telenovela 31, football 30. Football contested. Recount. Light rioting. Democracy is fragile, even here. Especially here.' }, fx: { smarts: 3, stress: 5 } },
      { label: { fr: 'Rejoindre les papys', en: 'Join the old-timers' }, text: { fr: "Je me suis assis{|e} avec les papys. Je suis accro à « Las Lágrimas de Esmeralda ». Si Rodrigo ne sort pas du coma, je casse quelque chose.", en: "I sat with the old-timers. I'm hooked on “Las Lágrimas de Esmeralda.” If Rodrigo doesn't wake from his coma, I'm breaking something." }, fx: { happy: 6, fn: resp(3) }, mood: 'cry' },
      { label: { fr: 'Débrancher la télé', en: 'Unplug the TV' }, text: { fr: "J'ai débranché la télé pour calmer tout le monde. Les deux gangs se sont unis contre moi. J'ai réconcilié la prison entière. Sur ma gueule.", en: "I unplugged the TV to calm everyone down. Both gangs united against me. I brought the whole prison together. On my face." }, fx: { health: -12, karma: 2, visual: 'gore', fn: resp(5) }, mood: 'sad' },
    ],
  },

  // ═════════════════════════════ PRISON: escape, parole ═════════════════════════════
  {
    id: 'p2_escape_rumour', icon: '🗺️', cat: 'prison', rating: 1, cooldown: 6, when: INSIDE,
    scene: { place: 'prison', mood: 'neutral' },
    text: {
      fr: [
        "Rumeur dans la cour : le vieux Lucien, 40 ans de taule, aurait la carte d'un passage secret vers l'extérieur. Il la vend 200 cigarettes. Il tousse beaucoup, cligne d'un seul œil et sourit trop.",
        "Il paraît que la chapelle cache un tunnel creusé par un aumônier dans les années 70. Un détenu surnommé La Fouine vend « l'accès » contre ton dessert pendant un an.",
      ],
      en: [
        "Yard rumor: old Lucien, 40 years inside, supposedly has a map of a secret way out. He's selling it for 200 cigarettes. He coughs a lot, winks with one eye only, and smiles too much.",
        "Word is the chapel hides a tunnel dug by a chaplain in the '70s. An inmate called the Weasel is selling “access” for your dessert for a year.",
      ],
    },
    choices: [
      { label: { fr: 'Acheter la carte', en: 'Buy the map' }, text: { fr: "J'ai payé. La carte était un plan de parc d'attractions photocopié. On m'a expliqué que « la liberté, c'est dans la tête ». Puis on a fumé mes 200 cigarettes devant moi.", en: 'I paid. The map was a photocopied theme-park map. I was told “freedom is in your head.” Then they smoked my 200 cigarettes in front of me.' }, fx: { happy: -6, fn: resp(-5) }, mood: 'angry' },
      { label: { fr: 'Lancer ma propre rumeur', en: 'Start my own rumor' }, text: { fr: "J'ai fait courir le bruit que j'avais mon propre tunnel. Tout le monde me paie en desserts pour réserver une place. Il n'y a pas de tunnel. Il y a juste beaucoup de desserts.", en: "I spread word that I had my own tunnel. Everyone pays me in desserts to reserve a spot. There is no tunnel. There are just a lot of desserts." }, fx: { happy: 6, karma: -3, weight: 0.03, fn: resp(8) }, mood: 'proud' },
      { label: { fr: 'Ignorer', en: 'Ignore it' }, text: { fr: "J'ai ignoré la rumeur. Deux semaines plus tard, trois détenus ont été retrouvés coincés dans le conduit d'aération de la buanderie, les fesses à l'air. J'ai bien fait.", en: 'I ignored it. Two weeks later, three inmates were found stuck in the laundry air vent, butts in the air. Good call.' }, fx: { smarts: 2 } },
      { label: { fr: 'Prévenir le directeur', en: 'Tell the warden' }, text: { fr: "J'ai prévenu le directeur. Il a fait creuser toute la cour. Ils ont trouvé deux tunnels, un squelette et la gourmette d'un certain Didier. Ma remise de peine est arrivée par courrier. Ma réputation est morte.", en: 'I told the warden. He had the whole yard dug up. They found two tunnels, a skeleton and a bracelet engraved “Didier.” My sentence reduction came in the mail. My reputation died.' }, fx: { karma: 2, counter: 'prisonGood', fn: both(cut(1), resp(-20)) } },
    ],
  },
  {
    id: 'p2_laundry_plan', icon: '🧺', cat: 'prison', rating: 1, cooldown: 6, when: { prison: true, age: ADULT, noFlag: 'p2_laundry_plan' }, actor: CELLMATE,
    scene: { place: 'prison', mood: 'neutral' },
    text: {
      fr: [
        "{a.first} te prend à part à la buanderie : « Le camion de linge sale sort à 6 h. On se cache dans les draps, on sort avec. J'ai tout calculé. » {a:Il|Elle} a calculé au dos d'une boîte de céréales.",
        "Plan de {a.first} : se planquer dans le chariot de linge, passer le portail dans le camion de la blanchisserie, et s'évader « en sentant le propre ». Il ne manque que ton oui.",
      ],
      en: [
        "{a.first} pulls you aside in the laundry room: “The dirty-laundry truck leaves at 6 a.m. We hide in the sheets and ride out. I've calculated everything.” {a:He|She} did the math on the back of a cereal box.",
        "{a.first}'s plan: hide in the laundry cart, roll through the gate in the cleaning company's truck, and escape “smelling fresh.” All it needs is your yes.",
      ],
    },
    choices: [
      { label: { fr: 'Je suis partant{|e}', en: "I'm in" }, text: { fr: "J'ai dit oui. On répète en cachette : se rouler en boule, ne pas éternuer, ne pas sentir. C'est la dernière partie qui pose problème.", en: "I said yes. We rehearse in secret: curl up, don't sneeze, don't smell. The last part is the problem." }, fx: { rel: 10, stress: 8, actorRole: 'friend', flag: 'p2_laundry_plan', schedule: { key: 'p2_laundry_day', years: 1 } }, mood: 'shock' },
      { label: { fr: 'Refuser', en: 'Refuse' }, text: { fr: "J'ai refusé. {a.first} a tenté le coup seul{a:|e}. Le camion était celui de la déchetterie. On l'a retrouvé{a:|e} vivant{a:|e}, mais couvert{a:|e} de choses.", en: '{a.first} tried it alone after I said no. The truck turned out to be the garbage truck. {a:He|She} was found alive, but covered in things.' }, fx: { rel: -5, happy: 2 } },
      { label: { fr: 'Le balancer', en: 'Snitch' }, text: { fr: "J'ai tout balancé au surveillant pour une remise de peine. {a.first} a pris deux ans de plus et me regarde comme un yaourt périmé. Mes nuits vont être longues.", en: 'I ratted the plan out for time off. {a.first} got two more years and looks at me like expired yogurt. My nights will be long.' }, fx: { karma: -8, rel: -50, actorRole: 'enemy', fn: both(cut(1), resp(-20)) }, mood: 'sad' },
    ],
  },
  {
    id: 'p2_laundry_day', icon: '🚚', cat: 'prison', rating: 2, chainOnly: true, when: { prison: true, age: ADULT, flag: 'p2_laundry_plan' }, actor: 'anyone',
    scene: { place: 'prison', mood: 'shock' },
    text: {
      fr: [
        "5 h 58. Toi et {a.first}, roulé{|e}s dans les draps sales du chariot de la blanchisserie. Ça sent la sueur, l'eau de Javel et quelque chose de mort. Les roues grincent vers le camion.",
        "Jour J. Tu es enfoui{|e} sous trois cents slips de détenus dans le chariot de linge. {a.first} est dans celui d'à côté. Le camion démarre. Un chien renifle près de la porte.",
      ],
      en: [
        "5:58 a.m. You and {a.first}, rolled up in the dirty sheets of the laundry cart. It smells of sweat, bleach and something dead. The wheels squeak toward the truck.",
        "D-Day. You're buried under three hundred inmates' underpants in the laundry cart. {a.first} is in the next one. The truck starts. A dog sniffs near the door.",
      ],
    },
    choices: [
      { label: { fr: 'Ne pas bouger', en: "Don't move" }, out: [
        { w: 1, odds: { discipline: 1 }, text: { fr: "J'ai retenu mon souffle 40 minutes. Le camion a passé le portail. Je me suis extrait{|e} des slips sur une aire d'autoroute. La liberté sent le pied.", en: 'I held my breath for 40 minutes. The truck rolled through the gate. I crawled out of the underpants at a highway rest stop. Freedom smells like feet.' }, fx: { happy: 10, unflag: 'p2_laundry_plan', fn: breakOut }, mood: 'party' },
        { w: 1, text: { fr: "Le chien m'a trouvé{|e}. Il s'est assis sur le chariot et a aboyé jusqu'à ce que je sorte, un slip sur la tête. Deux ans de plus. Le chien a eu une médaille.", en: 'The dog found me. It sat on the cart and barked until I came out with underpants on my head. Two more years. The dog got a medal.' }, fx: { health: -5, jail: 2, unflag: 'p2_laundry_plan', visual: 'police', fn: resp(10) }, mood: 'cry' },
      ] },
      { label: { fr: 'Soudoyer le chien', en: 'Bribe the dog' }, out: [
        { w: 1, text: { fr: "J'ai tendu un bout de saucisson au chien depuis les draps. Il l'a pris et s'est tu. Le camion a passé le portail. Je dois ma liberté à un berger malinois corrompu.", en: 'I held out a piece of salami from under the sheets. The dog took it and shut up. The truck rolled through. I owe my freedom to a corrupt police dog.' }, fx: { happy: 12, unflag: 'p2_laundry_plan', fn: breakOut }, mood: 'party' },
        { w: 1, text: { fr: "Le chien a pris le saucisson, et la moitié de mon doigt avec. J'ai hurlé dans les slips. Évasion annulée. Doigt aussi. Le sang a giclé sur trois cents caleçons.", en: 'The dog took the salami, and half my finger with it. I screamed into the underpants. Escape cancelled. Finger too. Blood sprayed across three hundred pairs of boxers.' }, fx: { health: -12, disease: 'missing_finger', jail: 2, unflag: 'p2_laundry_plan', visual: 'gore' }, mood: 'cry' },
      ] },
      { label: { fr: 'Abandonner', en: 'Bail out' }, text: { fr: "J'ai paniqué et jailli du chariot en criant « C'est une blague ! ». {a.first} est parti{a:|e} sans moi. J'ai reçu une carte postale des tropiques. Rien d'écrit, juste un dessin de slip.", en: "I panicked and leapt out of the cart yelling “Just kidding!” {a.first} left without me. I got a postcard from the tropics. Nothing written, just a drawing of underpants." }, fx: { happy: -6, rel: -10, unflag: 'p2_laundry_plan' }, mood: 'sad' },
    ],
  },
  {
    id: 'p2_parole_dance', icon: '💃', cat: 'prison', cooldown: 4, when: INSIDE,
    scene: { place: 'court', mood: 'neutral' },
    text: {
      fr: [
        "Audience de libération conditionnelle. La nouvelle présidente de la commission, adepte du développement personnel, te demande d'exprimer tes remords… sous forme de danse.",
        "Commission de libération conditionnelle. Le président, qui ressemble à un hibou fatigué, te demande de résumer ta peine, ta rédemption et tes projets « en un haïku ».",
        "Audience de libération. La commission, influencée par un séminaire sur {w:hobby}, te demande d'exprimer tes regrets par la danse ou en haïku. La présidente a déjà mis {w:song} sur l'enceinte.",
        "Ta libération se joue aujourd'hui. Le président de la commission, {w:object} sur les genoux et des bougies parfumées partout, te propose deux options : une danse des remords ou un haïku. [[Tu transpires.|Tes genoux tremblent.|Ton avocat est parti.]]",
        "La commission de libération a changé de méthode. Motif officiel : « {w:excuse} ». Désormais, chaque détenu doit danser ou réciter un haïku. Le précédent a fait les deux et a pris six mois de plus. Ton tour.",
      ],
      en: [
        "Parole hearing. The board's new chair, a self-help enthusiast, asks you to express your remorse… through dance.",
        "Parole board. The chairman, who looks like a tired owl, asks you to sum up your sentence, your redemption and your plans “in a haiku.”",
        "Parole hearing. The board, freshly back from a seminar on {w:hobby}, asks you to express your remorse through dance or haiku. The chair has already put {w:song} on the speaker.",
        "Your parole is on the line today. The board chairman, {w:object} on his lap and scented candles everywhere, offers two options: a remorse dance or a haiku. [[You're sweating.|Your knees are shaking.|Your lawyer left.]]",
        "The parole board changed its methods. Official reason: '{w:excuse}'. Now every inmate must dance or recite a haiku. The previous guy did both and got six more months. Your turn.",
      ],
    },
    choices: [
      { label: { fr: 'Danser mes remords', en: 'Dance my remorse' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: ["Neuf minutes de chorégraphie, roulade comprise. La présidente a pleuré. Elle a noté « très en contact avec ses émotions » dans mon dossier.", "J'ai dansé mes remords sur une musique imaginaire, avec un final au sol. La commission s'est levée pour applaudir. Le greffier a demandé le nom du chorégraphe."], en: ["Nine minutes of choreography, forward roll included. The chair cried. She wrote “deeply in touch with emotions” in my file.", "I danced my remorse to imaginary music, with a floor finish. The board gave a standing ovation. The clerk asked for the choreographer's name."] }, fx: { happy: 6, counter: 'prisonGood', fn: cut(1) }, mood: 'proud' },
        { w: 1, text: { fr: ["Je me suis pris le pied dans la chaise et j'ai fini dans les bras du procureur. Il ne m'a pas lâché{|e}. Ce n'était pas un câlin, c'était une clé de bras.", "J'ai tenté le grand écart. Mon pantalon a cédé dans un bruit de tissu déchiré. La commission a gardé son sérieux [[deux secondes|cinq secondes|une demi-seconde]]. Demande rejetée."], en: ["I tripped on a chair and landed in the prosecutor's arms. He didn't let go. It wasn't a hug, it was an armlock.", "I attempted the splits. My pants gave way with a loud rip. The board kept a straight face for [[two seconds|five seconds|half a second]]. Request denied."] }, fx: { happy: -6, health: -3 }, mood: 'sad' },
      ] },
      { label: { fr: 'Réciter un haïku', en: 'Recite a haiku' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: ["« Barreaux de métal / mon cœur a changé de forme / la soupe, non. » Le hibou a hoché la tête lentement. Je crois que je l'ai eu.", "« Cellule trop froide / j'ai compté chaque brique / je veux voir le ciel. » Le président a essuyé une larme. Il a dit : « Pas mal. Pas mal du tout. »"], en: ["“Bars of cold metal / my heart has changed its shape / the soup has not.” The owl nodded slowly. I think I got him.", "“My cell is so cold / I have counted every brick / I want to see sky.” The chairman wiped away a tear. He said: 'Not bad. Not bad at all.'"] }, fx: { smarts: 3, counter: 'prisonGood', fn: cut(1) }, mood: 'proud' },
        { w: 1, text: { fr: ["Mon haïku faisait 23 syllabes et rimait avec « menottes ». Le hibou s'est endormi. J'ai cru que c'était un oui. C'était un non.", "J'ai paniqué et récité les paroles de {w:song}. Le président a reconnu la chanson. Il a soupiré : « Ce n'est pas un haïku, c'est du plagiat. »"], en: ["My haiku had 23 syllables and rhymed with “handcuffs.” The owl fell asleep. I thought that was a yes. It was a no.", "I panicked and recited the lyrics to {w:song}. The chairman recognized it. He sighed: 'That's not a haiku, that's plagiarism.'"] }, fx: { happy: -5 }, mood: 'sad' },
      ] },
      { label: { fr: 'Refuser par dignité', en: 'Refuse with dignity' }, text: { fr: ["« Je ne danse pas, je ne fais pas de haïku, je purge ma peine. » La commission a salué ma franchise et rejeté ma demande, en toute franchise.", "J'ai refusé, bras croisés. La présidente a noté « fermé{|e} au changement ». Mon codétenu, qui a fait la danse du robot, est sorti le lendemain. Je le déteste."], en: ["“I don't dance, I don't do haiku, I serve my time.” The board praised my honesty and rejected my request, honestly.", "I refused, arms crossed. The chair wrote 'closed to change'. My cellmate, who did the robot, got out the next day. I hate him."] }, fx: { discipline: 4, happy: -3 } },
    ],
  },

  // ═════════════════════════════ PRISON: romance (adults only) ═════════════════════════════
  {
    id: 'p2_love_letters', icon: '💌', cat: 'prison', rating: 1, cooldown: 6, when: { prison: true, age: ADULT, noHas: 'lover' }, actor: CRUSH,
    scene: { place: 'prison', mood: 'love' },
    text: {
      fr: [
        "Une lettre parfumée glissée dans ton linge propre. Elle vient de {a.first}, de l'autre aile, qui t'a « vu{|e} une fois à travers le grillage » et ne pense plus qu'à toi. Il y a un dessin. Il est… généreux.",
        "Depuis trois semaines, {a.first}, détenu{a:|e} à la blanchisserie, plie tes chemises en forme de cœur. Aujourd'hui, il y avait un poème dans la poche. Il fait rimer « liberté » avec « tes jolis pieds ».",
      ],
      en: [
        "A perfumed letter slipped into your clean laundry. It's from {a.first}, in the other wing, who “saw you once through the fence” and can think of nothing else. There's a drawing. It's… generous.",
        "For three weeks, {a.first}, who works in the prison laundry, has been folding your shirts into hearts. Today there was a poem in the pocket. It rhymes “free” with “your cute knee.”",
      ],
    },
    choices: [
      { label: { fr: 'Répondre en vers', en: 'Reply in verse' }, text: { fr: "J'ai répondu par un sonnet. {a.first} par un autre. On s'échange des alexandrins via la blanchisserie. Plus belle histoire d'amour de l'histoire du linge sale.", en: "I replied with a sonnet. {a.first} sent another. We trade verses through the laundry. Greatest love story in the history of dirty laundry." }, fx: { rel: 25, happy: 10, actorRole: 'partner', visual: 'hearts' }, mood: 'love' },
      { label: { fr: 'Renvoyer un dessin', en: 'Send a drawing back' }, rating: 2, text: { fr: "J'ai renvoyé un dessin. Tout aussi généreux. Plus, peut-être. Le gardien qui trie le courrier a demandé une prime de risque. {a.first} a répondu : « Messe de dimanche. Dernier rang. Tu vas voir Dieu. »", en: "I sent a drawing back. Equally generous. More, maybe. The guard sorting mail asked for hazard pay. {a.first} replied: “Sunday mass. Back row. You'll see God.”" }, fx: { rel: 25, happy: 12, actorRole: 'partner', visual: 'hearts' }, mood: 'love' },
      { label: { fr: 'Ignorer', en: 'Ignore it' }, text: { fr: "J'ai ignoré les lettres. {a.first} a continué six mois, puis a dédié son roman au « matricule ingrat ». Il paraît que mon personnage meurt dévoré par des cygnes.", en: '{a.first} kept writing for six months after I ignored the letters, then dedicated a novel to “the ungrateful inmate.” Apparently my character gets eaten by swans.' }, fx: { happy: -1 } },
      { label: { fr: "La lire à toute l'aile", en: 'Read it to the wing' }, text: { fr: "J'ai lu la lettre à voix haute dans la cour. Gros succès. Puis {a.first} est venu{a:|e} me voir à la promenade. {a:Il|Elle} fait deux fois ma taille. On est ensemble maintenant. Je ne sais pas trop comment.", en: "I read the letter aloud in the yard. Big hit. Then {a.first} came to find me. {a:He|She} is twice my size. We're together now. I'm not quite sure how." }, fx: { rel: 10, stress: 6, actorRole: 'partner', fn: resp(5) }, mood: 'shock' },
    ],
  },
  {
    id: 'p2_conjugal', icon: '🛏️', cat: 'prison', rating: 2, cooldown: 3, when: INSIDE, actor: 'spouse',
    scene: { place: 'prison', mood: 'love', fx: 'hearts' },
    text: {
      fr: [
        "Visite conjugale avec {a.first} dans le « Pavillon Tendresse » : un préfabriqué, un poster de coucher de soleil, un matelas sous plastique et un minuteur de 45 minutes. Un gardien frappera à la 44e.",
        "{a.first} a obtenu une visite conjugale. La chambre sent la Javel et les souvenirs des autres. Le matelas fait « crouic » rien qu'en le regardant. Le gardien siffle déjà derrière la porte.",
      ],
      en: [
        "Conjugal visit with {a.first} in the “Tenderness Pavilion”: a portable cabin, a sunset poster, a plastic-wrapped mattress and a 45-minute timer. A guard will knock at minute 44.",
        "{a.first} got you a conjugal visit. The room smells of bleach and other people's memories. The mattress squeaks if you just look at it. The guard is already whistling outside the door.",
      ],
    },
    choices: [
      { label: { fr: 'Profiter de chaque minute', en: 'Use every minute' }, text: { fr: "Quarante-quatre minutes de gymnastique sur un matelas qui couinait comme un canard asthmatique. Le gardien a frappé, puis applaudi. {a.first} est reparti{a:|e} avec un grand sourire et le dos en vrac.", en: 'Forty-four minutes of gymnastics on a mattress squeaking like an asthmatic duck. The guard knocked, then applauded. {a.first} left with a huge grin and a wrecked back.' }, fx: { rel: 20, happy: 12, visual: 'hearts' }, mood: 'love' },
      { label: { fr: 'Juste parler', en: 'Just talk' }, text: { fr: "On a juste parlé, main dans la main, pendant 45 minutes. C'était doux. Le gardien n'en revenait pas. Il a demandé s'il pouvait noter ça comme « incident ».", en: "We just talked, holding hands, for 45 minutes. It was sweet. The guard couldn't believe it. He asked if he could log it as an “incident.”" }, fx: { rel: 15, happy: 6, karma: 2 }, mood: 'love' },
      { label: { fr: 'Dévorer le panier repas', en: 'Devour the picnic' }, text: { fr: "{a.first} avait apporté un panier repas. J'ai tout englouti en 40 minutes : poulet, fromage, tarte, et un bout de la nappe. Pour le reste, on s'est fait les yeux doux. J'étais trop plein{|e}.", en: '{a.first} brought a picnic. I inhaled all of it in 40 minutes: chicken, cheese, pie and part of the tablecloth. For the rest, we made eyes at each other. I was too full.' }, fx: { rel: -5, happy: 10, weight: 0.02 }, mood: 'happy' },
    ],
  },
  {
    id: 'p2_shower', icon: '🚿', cat: 'prison', rating: 2, cooldown: 5, when: INSIDE,
    scene: { place: 'prison', mood: 'shock' },
    text: {
      fr: [
        "Douches communes, 6 h. Il reste un seul jet d'eau chaude, tenu par le Yéti, un détenu au dos si poilu qu'on pourrait y perdre une savonnette. Le reste de l'eau sort à 4 °C et sent la piscine municipale.",
        "Douches de l'aile B : la grille est encore bouchée par ce qui ressemble à un chat mort. Ce n'est pas un chat. Ce sont les poils de Gégé. L'eau monte jusqu'aux chevilles. Gégé chante de l'opéra.",
      ],
      en: [
        "Communal showers, 6 a.m. One hot jet left, held by the Yeti, an inmate whose back is so hairy you could lose a bar of soap in it. The rest of the water comes out at 39°F and smells like a public pool.",
        "B Block showers: the drain is clogged again by what looks like a dead cat. It's not a cat. It's Gégé's body hair. The water is ankle-deep. Gégé is singing opera.",
      ],
    },
    choices: [
      { label: { fr: 'Réclamer le jet chaud', en: 'Claim the hot jet' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "Un coup d'épaule et le Yéti a glissé sur sa propre mousse, traversant la salle sur les fesses comme un phoque en solde. Douche chaude et respect éternel.", en: 'One shoulder check and the Yeti slipped on his own lather, sliding across the room on his butt like a discount seal. Hot shower and eternal respect.' }, fx: { happy: 6, fn: resp(12) }, mood: 'proud' },
        { w: 1, text: { fr: "Le Yéti m'a juste regardé{|e}. Puis il a pété. L'écho dans les douches a duré onze secondes. J'ai perdu connaissance et le droit à la parole.", en: 'The Yeti just looked at me. Then he farted. The echo in the showers lasted eleven seconds. I lost consciousness and my right to speak.' }, fx: { happy: -6, health: -2, fn: resp(-6) }, mood: 'sick' },
      ] },
      { label: { fr: "Douche à l'eau glacée", en: 'Ice-cold shower' }, text: { fr: "Douche à 4 °C. J'ai hurlé si aigu que les chiens du chenil ont répondu. Mes tétons pourraient rayer du verre. Mais je suis propre et réveillé{|e} pour dix ans.", en: 'A 39°F shower. I screamed so high the kennel dogs answered. My nipples could cut glass. But I\'m clean and awake for the next decade.' }, fx: { health: 2, happy: -3, discipline: 4 } },
      { label: { fr: 'Me laver au lavabo', en: 'Sink bath' }, text: { fr: "Je me suis lavé{|e} au lavabo de la cellule avec un gant et un bout de savon. Mon codétenu a regardé ailleurs. Enfin, il dit qu'il regardait ailleurs.", en: 'I washed at the cell sink with a washcloth and a sliver of soap. My cellmate looked away. Well, he says he looked away.' }, fx: { happy: -2, stress: 3 } },
      { label: { fr: 'Duo avec Gégé', en: 'Duet with Gégé' }, text: { fr: "J'ai chanté le duo de La Traviata avec Gégé, de l'eau jusqu'aux chevilles. Standing ovation, serviettes en l'air. On monte un groupe : « Les Savonnettes ».", en: 'I sang the La Traviata duet with Gégé, ankle-deep in water. Standing ovation, towels in the air. We\'re starting a band: “The Soap Bars.”' }, fx: { happy: 8, fn: resp(5) }, mood: 'party' },
    ],
  },
  {
    id: 'p2_shank', icon: '🔪', cat: 'prison', rating: 2, cooldown: 5, when: INSIDE,
    scene: { place: 'prison', mood: 'shock', fx: 'gore' },
    text: {
      fr: [
        "Dans la cour, Tête-de-Bulldozer fonce sur toi avec une règle en plastique taillée en pointe, persuadé que tu as volé son poster de dauphin. Tu as dans les mains une spork et un dictionnaire.",
        "Embuscade à la bibliothèque : un type de l'aile D te menace avec un manche de raclette aiguisé, en hurlant que tu as rendu son livre en retard. Tu as une spork, un dictionnaire et deux secondes.",
      ],
      en: [
        "In the yard, Bulldozer-Head charges at you with a plastic ruler filed to a point, convinced you stole his dolphin poster. In your hands: a spork and a dictionary.",
        "Library ambush: a D Block guy comes at you with a sharpened mop handle, screaming that you returned his book late. You have a spork, a dictionary and two seconds.",
      ],
    },
    choices: [
      { label: { fr: 'Duel à la spork', en: 'Spork duel' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: "Duel épique. Je lui ai planté la spork dans la fesse gauche. Il a hurlé comme un ténor, le sang a giclé sur trois mètres et dessiné un cœur sur le mur. Tout le monde a cru que c'était voulu. Respect.", en: 'Epic duel. I jammed the spork into his left butt cheek. He screamed like a tenor, blood sprayed ten feet and drew a heart on the wall. Everyone thought I did it on purpose. Respect.' }, fx: { health: -5, visual: 'gore', fn: resp(20) }, mood: 'proud' },
        { w: 2, text: { fr: "Sa pointe m'a ouvert la joue comme une enveloppe. J'ai riposté, la spork a cassé. J'ai pissé le sang sur le gravier devant 300 spectateurs. Douze points de suture et une cicatrice qui raconte une histoire nulle.", en: 'His point opened my cheek like an envelope. I struck back, the spork snapped. I bled all over the gravel in front of 300 spectators. Twelve stitches and a scar with a lame backstory.' }, fx: { health: -20, looks: -5, visual: 'gore', fn: resp(-5) }, mood: 'cry' },
        { w: 1, rating: 2, text: { fr: "La pointe est passée entre deux côtes. J'ai regardé mon sang gicler en rythme, comme une petite fontaine de jardin, en pensant à ce poster de dauphin que je n'avais même pas volé.", en: 'The point slid between two ribs. I watched my blood spurt in rhythm like a little garden fountain, thinking about that dolphin poster I never even stole.' }, fx: { visual: 'gore', die: { fr: 'planté{|e} dans la cour pour un poster de dauphin que je n\'avais pas volé', en: "shanked in the prison yard over a dolphin poster I never stole" } }, mood: 'cry' },
      ] },
      { label: { fr: 'Bouclier dictionnaire', en: 'Dictionary shield' }, text: { fr: "J'ai paré avec le dictionnaire. La pointe s'est plantée pile au mot « Mansuétude ». Il a lu la définition, a fondu en larmes et m'a demandé pardon. On tricote ensemble, maintenant.", en: 'I blocked with the dictionary. The point stuck right on the word “Clemency.” He read the definition, burst into tears and apologized. We knit together now.' }, fx: { smarts: 3, karma: 3, fn: resp(8) }, mood: 'happy' },
      { label: { fr: 'Fuir en hurlant', en: 'Run screaming' }, text: { fr: "J'ai couru en hurlant jusqu'à l'infirmerie, poursuivi{|e} par un type qui hurlait aussi. L'infirmière nous a mis une gifle à chacun. Il a oublié pourquoi il m'en voulait. Moi aussi.", en: 'I ran screaming to the infirmary, chased by a guy also screaming. The nurse slapped us both. He forgot why he was mad at me. So did I.' }, fx: { athletic: 3, happy: -2, fn: resp(-10) } },
    ],
  },
  {
    id: 'p2_snitch_accused', icon: '🐀', cat: 'prison', rating: 2, cooldown: 6, when: INSIDE,
    scene: { place: 'prison', mood: 'angry' },
    text: {
      fr: [
        "Rumeur dans l'aile : tu serais une balance. Ton crime : on t'a vu{|e} parler cinq minutes avec un gardien. De la météo. Des nuages, précisément. Ce matin, quelqu'un a dessiné un rat sur ta porte. Au ketchup, on espère.",
        "On t'accuse d'être un indic parce que ton courrier arrive sans avoir été ouvert. Ce matin, ta brosse à dents a été retrouvée dans les toilettes. Tête la première. Elle avait l'air d'avoir souffert.",
      ],
      en: [
        "Word in the wing: you're a snitch. Your crime: you were seen talking to a guard for five minutes. About the weather. Clouds, specifically. This morning someone drew a rat on your door. In ketchup, hopefully.",
        "You're accused of being an informant because your mail arrives unopened. This morning your toothbrush was found in the toilet. Head first. It looked like it had suffered.",
      ],
    },
    choices: [
      { label: { fr: 'Duel pour mon honneur', en: 'Duel for my honor' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai défié le caïd dans les douches. Combat sanglant : j'ai perdu une incisive, il a perdu un bout d'oreille, retrouvé plus tard dans le siphon. Les rumeurs se sont tues.", en: 'I challenged the top dog in the showers. Bloody fight: I lost an incisor, he lost a piece of ear, later found in the drain. The rumors stopped.' }, fx: { health: -12, looks: -3, visual: 'gore', fn: resp(20) }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai défié le caïd. Il m'a cassé le nez, le bras et le moral, dans cet ordre. Plus personne ne pense que je suis une balance. Ils pensent que je suis une serpillière.", en: "I challenged the top dog. He broke my nose, my arm and my spirit, in that order. Nobody thinks I'm a snitch anymore. They think I'm a mop." }, fx: { health: -22, disease: 'broken_arm', visual: 'gore', fn: resp(-10) }, mood: 'cry' },
      ] },
      { label: { fr: 'Payer un gang', en: 'Pay a gang' }, text: { fr: "J'ai payé les Moustaches de Fer en maquereaux pour qu'ils jurent de ma loyauté. Ils ont tabassé le type qui avait lancé la rumeur. Il s'avère que c'était lui, la balance.", en: 'I paid the Iron Mustaches in mackerel to vouch for my loyalty. They beat up the guy who started the rumor. Turns out he was the snitch.' }, fx: { money: -200, karma: -3, fn: resp(10) } },
      { label: { fr: 'Devenir une vraie balance', en: 'Become a real snitch' }, text: { fr: "Quitte à être accusé{|e}, autant toucher les avantages. J'ai balancé tout le monde. Remise de peine accordée. Je mange seul{|e}, je dors d'un œil, et quelqu'un met du dentifrice dans mes chaussures. Tous les jours.", en: 'If I\'m accused anyway, I might as well get the perks. I ratted everyone out. Sentence reduced. I eat alone, sleep with one eye open, and someone puts toothpaste in my shoes. Every day.' }, fx: { karma: -10, stress: 15, fn: both(cut(2), resp(-30)) }, mood: 'sad' },
    ],
  },
  {
    id: 'p2_infirmary', icon: '🩺', cat: 'prison', rating: 2, cooldown: 5, when: INSIDE,
    scene: { place: 'hospital', mood: 'shock' },
    text: {
      fr: [
        "Tu simules une grippe pour passer la journée à l'infirmerie. L'infirmière Brigitte, des mains comme des pelles et zéro patience, enfile un gant jusqu'au coude. « Ici, pour tout, c'est suppositoire. »",
        "Infirmerie de la prison. Le médecin, radié dans trois pays, te diagnostique « un peu de tout ». Son traitement universel : aspirine, vaseline et une tape dans le dos. Il ouvre déjà la vaseline.",
      ],
      en: [
        "You fake the flu to spend the day in the infirmary. Nurse Brigitte, hands like shovels and zero patience, snaps a glove on up to the elbow. “In here, everything gets a suppository.”",
        "Prison infirmary. The doctor, struck off in three countries, diagnoses you with “a bit of everything.” His universal treatment: aspirin, petroleum jelly and a pat on the back. He's already opening the jelly.",
      ],
    },
    choices: [
      { label: { fr: 'Guérir miraculeusement', en: 'Miraculous recovery' }, text: { fr: "J'ai bondi de la table en criant « Je suis guéri{|e} ! Un miracle ! ». Le gant a été rangé avec un soupir. J'entends encore son claquement dans mes cauchemars.", en: 'I leapt off the table yelling “I\'m cured! A miracle!” The glove was put away with a sigh. I still hear it snap in my nightmares.' }, fx: { happy: -2, stress: 4 }, mood: 'shock' },
      { label: { fr: 'Accepter le traitement', en: 'Accept the treatment' }, text: { fr: "J'ai accepté. Je ne parlerai jamais de ce qui s'est passé dans cette pièce. Mais j'ai eu trois jours d'arrêt, un yaourt nature et la démarche d'un cow-boy après six mois de cheval.", en: "I accepted. I will never speak of what happened in that room. But I got three days off, a plain yogurt and the walk of a cowboy after six months in the saddle." }, fx: { happy: 2, health: 3, discipline: -2 } },
      { label: { fr: 'Négocier des cachets', en: 'Haggle for pills' }, out: [
        { w: 1, text: { fr: "J'ai obtenu un plein sachet d'antidouleurs pour « mon dos ». Je les revends dans la cour. Je suis le pharmacien de l'aile B.", en: "I got a full bag of painkillers for “my back.” I resell them in the yard. I'm B Block's pharmacist now." }, fx: { money: 150, karma: -3, fn: resp(5) }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai réclamé des antidouleurs. On m'a prescrit un lavement « à titre préventif ». La tuyauterie de l'infirmerie s'en souvient encore.", en: 'I asked for painkillers. I was prescribed an enema “as a precaution.” The infirmary plumbing still remembers.' }, fx: { health: -2, happy: -8, visual: 'poop' }, mood: 'sick' },
      ] },
    ],
  },
  {
    id: 'p2_prison_cat', icon: '🐈', cat: 'prison', once: true, when: INSIDE,
    scene: { place: 'prison', mood: 'love' },
    text: {
      fr: [
        "Un chat errant s'est glissé dans la cour. Trois cents détenus, braqueurs et tueurs à gages compris, se figent en faisant « pspspsps ». Il se dirige vers toi.",
        "Un chaton maigrichon miaule sous le grillage de la cour. Le gang le plus dur de la prison est à genoux et lui parle avec une toute petite voix. C'est toi qu'il regarde.",
        "Un chat roux est entré dans la cour {w:weather}. Le caïd de l'aile B lui a tendu {w:food}. Le chat l'a ignoré et s'avance vers toi, la queue en l'air. Trois cents regards jaloux te transpercent.",
        "Un chat noir a franchi les barbelés comme si de rien n'était. Les détenus l'ont baptisé « {w:nickname} ». Il a déjà inspecté [[trois|cinq|toutes les]] cellules. Il s'arrête devant la tienne.",
        "Un chat s'est faufilé dans la cour pendant la promenade. Un tueur à gages lui chante {w:song} à voix basse. Un faussaire lui fabrique un collier. Le chat, lui, se frotte contre ta jambe.",
      ],
      en: [
        "A stray cat slipped into the yard. Three hundred inmates, robbers and hitmen included, freeze and go “pspspsps.” It's heading toward you.",
        "A scrawny kitten mews under the yard fence. The toughest gang in the prison is on its knees, talking to it in tiny voices. It's looking at you.",
        "A ginger cat wandered into the yard {w:weather}. The B Block kingpin offered it {w:food}. The cat ignored him and is walking toward you, tail up. Three hundred jealous stares pierce you.",
        "A black cat crossed the barbed wire like it was nothing. The inmates named it '{w:nickname}'. It's already inspected [[three|five|every]] cell. It stops in front of yours.",
        "A cat slipped into the yard during rec time. A hitman is softly singing {w:song} to it. A forger is making it a collar. The cat is rubbing against your leg.",
      ],
    },
    choices: [
      { label: { fr: 'Le nourrir', en: 'Feed it' }, text: { fr: ["Je lui ai donné mon jambon. Il revient chaque jour. Il s'appelle Matricule. Grâce à lui, même le caïd de l'aile me dit bonjour avec une petite voix.", "Je l'ai nourri avec {w:food} de mon plateau. Il revient tous les jours à midi pile. Les détenus m'appellent maintenant « le Gardien du chat ». C'est le titre le plus respecté de la prison."], en: ["I gave it my ham. It comes back every day. Its name is Inmate. Thanks to it, even the wing boss says hi to me in a tiny voice.", "I fed it {w:food} from my tray. It comes back every day at noon sharp. The inmates now call me 'the Cat Keeper'. It's the most respected title in the prison."] }, fx: { happy: 10, counter: 'prisonGood', fn: resp(10) }, mood: 'love' },
      { label: { fr: 'Le cacher en cellule', en: 'Hide it in my cell' }, out: [
        { w: 1, text: { fr: ["Il a dormi sur mon visage, chassé trois cafards et mangé la lettre de mon avocat. Meilleur codétenu de ma vie.", "Je l'ai caché sous mon lit pendant [[trois semaines|deux mois|six mois]]. Il a éliminé tous les rats de l'aile. Le directeur a remarqué la baisse. Il a cru que c'était sa nouvelle politique."], en: ["It slept on my face, hunted three cockroaches and ate my lawyer's letter. Best cellmate of my life.", "I hid it under my bed for [[three weeks|two months|six months]]. It wiped out every rat in the wing. The warden noticed the drop. He thought it was his new policy."] }, fx: { happy: 12, stress: -5 }, mood: 'happy' },
        { w: 1, text: { fr: ["Fouille surprise. Le gardien a trouvé le chat, s'est assis par terre et l'a papouillé vingt minutes. Rapport : « RAS ». On garde le chat.", "Le chat a miaulé pendant l'inspection. Le gardien l'a trouvé, l'a confisqué… et l'a ramené le lendemain parce que sa femme est allergique. Le chat est officiellement « détenu »."], en: ["Surprise search. The guard found the cat, sat on the floor and petted it for twenty minutes. Report: “Nothing to note.” We keep the cat.", "The cat meowed during inspection. The guard found it, confiscated it… and brought it back the next day because his wife is allergic. The cat is officially an 'inmate'."] }, fx: { happy: 10, fn: resp(5) }, mood: 'love' },
      ] },
      { label: { fr: 'Le confier à un gardien', en: 'Give it to a guard' }, text: { fr: ["Je l'ai confié à un gardien pour la SPA. Il l'a adopté. Il m'envoie des photos. Le chat a une meilleure vie que moi, et c'est très bien comme ça.", "Je l'ai confié à une gardienne. Elle m'a envoyé une photo du chat sur son canapé, avec {w:object} comme jouet. Je l'ai accrochée au-dessus de mon lit. C'est ma seule fenêtre."], en: ["I handed it to a guard for the shelter. He adopted it. He sends me photos. The cat has a better life than me, and that's just fine.", "I gave it to a female guard. She sent me a photo of the cat on her couch, with {w:object} as a toy. I pinned it above my bed. It's my only window."] }, fx: { karma: 5, happy: 4, counter: 'prisonGood' } },
    ],
  },

  // ═════════════════════════════ FREE, WITH A RECORD OR HEAT ═════════════════════════════
  {
    id: 'p2_auto_heat_drone', icon: '🛸', cat: 'crime', auto: true, cooldown: 3, when: { age: [16, 120], test: heat(40) },
    text: {
      fr: [
        "Un drone de police m'a suivi{|e} jusqu'à la boulangerie. J'ai pris un croissant. Il a pris une photo. On est un peu un couple, maintenant.",
        "La même camionnette blanche « Fleurs Bernard » est garée devant chez moi depuis trois semaines. Il n'y a jamais eu de fleurs. Il y a une antenne.",
      ],
      en: [
        "A police drone followed me to the bakery. I got a croissant. It got a photo. We're kind of a couple now.",
        "The same white “Bernie's Flowers” van has been parked outside my place for three weeks. There have never been flowers. There is an antenna.",
      ],
    },
    fx: { stress: 5 },
  },
  {
    id: 'p2_auto_mugshot_meme', icon: '🤳', cat: 'crime', rating: 1, auto: true, cooldown: 8, when: { record: true, age: [16, 120] },
    text: {
      fr: [
        "Ma photo d'identité judiciaire est devenue un mème : « Quand tu réalises que c'était pas une soirée déguisée ». Douze millions de partages. Pas un centime pour moi.",
        "Quelqu'un a imprimé mon mugshot sur des t-shirts. Ils se vendent bien au marché. J'en ai acheté un. Le vendeur ne m'a pas reconnu{|e}.",
        "Mon mugshot circule sur {w:app} avec la légende « Moi quand je dois {w:activity} un lundi ». [[Huit|Quinze|Trente]] millions de vues. Ma mère l'a partagé avec un cœur.",
        "{w:celeb} a reposté ma photo de garde à vue en disant « mood ». Depuis, des inconnus me reconnaissent {w:at_place} et me demandent des selfies. Je souris exactement comme sur la photo. C'est ce qu'ils veulent.",
        "Mon mugshot est devenu un filtre sur les réseaux. Des milliers de gens se prennent en photo avec ma tête. {w:brand} veut m'utiliser pour une pub. Mon avocat négocie. {w:swear}",
      ],
      en: [
        "My mugshot became a meme: “When you realize it wasn't a costume party.” Twelve million shares. Not a cent for me.",
        "Someone printed my mugshot on T-shirts. They sell well at the market. I bought one. The vendor didn't recognize me.",
        "My mugshot is going around on {w:app} with the caption 'Me when I have to start {w:activity} on a Monday'. [[Eight|Fifteen|Thirty]] million views. My mom shared it with a heart.",
        "{w:celeb} reposted my booking photo with the caption 'mood'. Since then, strangers recognize me {w:at_place} and ask for selfies. I make the exact same face as in the photo. It's what they want.",
        "My mugshot became a social media filter. Thousands of people take selfies with my face. {w:brand} wants me for an ad. My lawyer is negotiating. {w:swear}",
      ],
    },
    fx: { followers: 3000, fame: 3, happy: -2 },
  },
  {
    id: 'p2_cops_knock', icon: '🚪', cat: 'crime', rating: 2, cooldown: 4, when: { age: [18, 99], test: heat(30) },
    scene: { place: 'home', mood: 'shock', fx: 'police' },
    text: {
      fr: [
        "6 h 02. On cogne : « POLICE ! OUVREZ ! » Tu es en slip, un bol de céréales à la main, la bouche pleine. Derrière la porte, le bélier prend déjà son élan.",
        "BAM BAM BAM. 5 h 47 du matin. Par le judas : six flics en gilet pare-balles et un chien qui a l'air d'avoir fait l'armée.",
      ],
      en: [
        "6:02 a.m. Pounding: “POLICE! OPEN UP!” You're in your underwear, cereal bowl in hand, mouth full. Behind the door, the battering ram is already winding up.",
        "BAM BAM BAM. 5:47 a.m. Through the peephole: six cops in body armor and a dog that looks like it served in the military.",
      ],
    },
    choices: [
      { label: { fr: 'Ouvrir en slip', en: 'Open in my underwear' }, out: [
        { w: 2, text: { fr: "J'ai ouvert en slip Bob l'éponge. Ils cherchaient le voisin du dessus. Ils sont repartis en riant. Le chien a gardé ma chaussette. L'immeuble entier m'a vu{|e}.", en: 'I opened the door in SpongeBob briefs. They were after the upstairs neighbor. They left laughing. The dog kept my sock. The whole building saw me.' }, fx: { happy: -4, heat: -10 }, mood: 'shock' },
        { w: 1, text: { fr: "« Ah, c'est bien vous. » Un mandat pour une vieille affaire de vandalisme. Menottes, slip, céréales collées au menton. La photo d'arrestation est hilarante. Le juge ne rira pas.", en: '“Ah, it IS you.” A warrant for an old vandalism case. Cuffs, briefs, cereal stuck to my chin. The arrest photo is hilarious. The judge won\'t laugh.' }, fx: { arrest: 'vandal', visual: 'police' }, mood: 'cry' },
      ] },
      { label: { fr: 'Me cacher dans le frigo', en: 'Hide in the fridge' }, text: { fr: "Je me suis caché{|e} dans le frigo. Deux heures de fouille. À la fin, un flic l'a ouvert pour prendre un yaourt. On s'est regardés. Il a pris le yaourt et refermé. Merci, officier.", en: 'I hid in the fridge. Two-hour search. At the end, a cop opened it to grab a yogurt. We locked eyes. He took the yogurt and closed the door. Thank you, officer.' }, fx: { heat: -5, health: -4, happy: 3 }, mood: 'shock' },
      { label: { fr: 'Sauter par la fenêtre', en: 'Jump out the window' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai sauté, rebondi sur la benne à ordures, et filé en slip sur trois rues. Une mamie m'a applaudi{|e}. J'ai semé les flics. Pas le rhume.", en: 'I jumped, bounced off the dumpster and sprinted three blocks in my underwear. A granny applauded. I lost the cops. Not the cold.' }, fx: { heat: 15, athletic: 2, disease: 'cold' }, mood: 'proud' },
        { w: 1, text: { fr: "Deuxième étage. Atterrissage dans les rosiers du syndic. Les flics m'ont cueilli{|e} couvert{|e} d'épines et de pétales, en sang, comme une mariée qui aurait très mal tourné.", en: 'Second floor. Landed in the HOA rose bushes. The cops picked me up covered in thorns and petals, bleeding, like a bride whose day went horribly wrong.' }, fx: { health: -12, arrest: 'vandal', visual: 'gore' }, mood: 'cry' },
      ] },
      { label: { fr: 'Offrir le café', en: 'Offer coffee' }, text: { fr: "J'ai ouvert avec un plateau : café, croissants, grand sourire. Le chef a hésité, pris un croissant, et dit « On repassera ». Ils ne sont jamais repassés. Les croissants étaient au beurre.", en: 'I opened with a tray: coffee, croissants, big smile. The lead officer hesitated, took a croissant, and said “We\'ll come back.” They never did. The croissants were all-butter.' }, fx: { heat: -15, money: -10, karma: 1 }, mood: 'happy' },
    ],
  },
  {
    id: 'p2_plea_deal', icon: '🤝', cat: 'crime', rating: 1, cooldown: 6, when: { record: true, age: [18, 99], test: heat(20) },
    scene: { place: 'court', mood: 'neutral' },
    text: {
      fr: [
        "Le procureur te convoque. Son bureau sent le café froid et l'ambition. « Donne-moi ton complice, le Gros Serge, et ton dossier s'évapore. Refuse, et je te colle tout ce qui n'a pas été résolu depuis 1998. »",
        "Un substitut du procureur te propose un arrangement : tu témoignes contre ton ancien associé, Tony Spaghetti, et la police oublie ton nom. Il te tend un stylo. Le stylo est mâchouillé.",
      ],
      en: [
        "The prosecutor calls you in. The office smells of cold coffee and ambition. “Give me your partner, Big Serge, and your file evaporates. Refuse, and I'll pin everything unsolved since 1998 on you.”",
        "An assistant DA offers a deal: testify against your old associate, Tony Spaghetti, and the police forget your name. He hands you a pen. The pen has been chewed.",
      ],
    },
    choices: [
      { label: { fr: 'Accepter le marché', en: 'Take the deal' }, text: { fr: "J'ai tout balancé. Mon dossier s'est évaporé. Mon ex-associé m'a envoyé une carte postale de prison. Il y a juste écrit « BIENTÔT ». Avec un smiley.", en: 'I spilled everything. My file evaporated. My ex-partner sent me a postcard from prison. It just says “SOON.” With a smiley.' }, fx: { heat: -40, karma: -8, stress: 8, newNpc: { role: 'enemy', age: [5, 20] } }, mood: 'shock' },
      { label: { fr: 'Refuser', en: 'Refuse' }, out: [
        { w: 2, text: { fr: "J'ai refusé. Le procureur a soupiré et rangé son stylo. En sortant, il s'est abonné à mon Instagram. C'est une menace. Je le sais.", en: 'I refused. The prosecutor sighed and put away his pen. On my way out, he followed me on Instagram. It\'s a threat. I know it is.' }, fx: { heat: 15, karma: 3, stress: 6 } },
        { w: 1, text: { fr: "J'ai refusé. Trois semaines plus tard, j'étais inculpé{|e} pour une série de vols de vélos dont je n'ai aucun souvenir. Il n'avait pas menti.", en: "I refused. Three weeks later, I was charged in a string of bike thefts I have no memory of. He wasn't bluffing." }, fx: { arrest: 'bike', visual: 'police' }, mood: 'angry' },
      ] },
      { label: { fr: 'Contre-proposition', en: 'Counteroffer' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai proposé de dénoncer plutôt le chat du voisin. Le procureur a ri si fort qu'il a renversé son café sur mon dossier. Illisible. Classé sans suite.", en: "I offered to rat out the neighbor's cat instead. The prosecutor laughed so hard he spilled coffee all over my file. Illegible. Case closed." }, fx: { heat: -25, happy: 6 }, mood: 'party' },
        { w: 1, text: { fr: "J'ai proposé de dénoncer le chat du voisin. Il n'a pas ri. Il a noté « outrage » et « chat ». Mon dossier a doublé d'épaisseur.", en: "I offered to rat out the neighbor's cat. He didn't laugh. He wrote down “contempt” and “cat.” My file doubled in thickness." }, fx: { heat: 15, stress: 5 } },
      ] },
    ],
  },
  {
    id: 'p2_tabloid', icon: '📰', cat: 'crime', rating: 1, cooldown: 6, when: { record: true, age: [18, 120] },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Le journal local te fait sa une : « {first} {last}, LE MONSTRE DE {city} ». La photo te montre en train de manger un sandwich, bouche ouverte, l'air coupable de quelque chose.",
        "Un tabloïd titre : « Le délinquant qui terrorise {city} vit à côté de chez VOUS ». En réalité, tu vis à côté d'une boulangerie. La boulangerie a été floutée. Pas toi.",
      ],
      en: [
        "The local paper puts you on the front page: “{first} {last}: THE MONSTER OF {city}.” The photo shows you eating a sandwich, mouth open, looking guilty of something.",
        "A tabloid headline: “The Thug Terrorizing {city} Lives Next Door to YOU.” In reality, you live next to a bakery. The bakery was blurred. You weren't.",
      ],
    },
    choices: [
      { label: { fr: 'Porter plainte', en: 'Sue them' }, out: [
        { w: 1, text: { fr: "Diffamation ! Le juge a regardé la photo du sandwich, puis moi, et m'a donné raison. J'ai touché de quoi m'acheter énormément de sandwichs.", en: 'Defamation! The judge looked at the sandwich photo, then at me, and ruled in my favor. I got enough to buy an enormous number of sandwiches.' }, fx: { money: 3000, happy: 6 }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai porté plainte. Deuxième une : « LE MONSTRE PORTE PLAINTE ». Avec une photo de moi en train d'éternuer.", en: 'I sued. Second front page: “THE MONSTER SUES.” With a photo of me mid-sneeze.' }, fx: { money: -1500, happy: -6 }, mood: 'angry' },
      ] },
      { label: { fr: 'Jouer le jeu', en: 'Lean into it' }, text: { fr: "J'ai assumé : interviews, poses menaçantes, regard sombre. Au supermarché, on m'appelle « le Monstre » et on me laisse passer en caisse. C'est pratique.", en: 'I owned it: interviews, menacing poses, dark stares. At the supermarket people call me “the Monster” and let me cut the line. Handy.' }, fx: { fame: 6, followers: 4000, karma: -2 }, mood: 'proud' },
      { label: { fr: 'Écrire au journal', en: 'Write to the editor' }, text: { fr: "J'ai écrit une lettre polie au journal. Ils l'ont publiée sous le titre « LE MONSTRE SAIT ÉCRIRE ». C'est un progrès.", en: 'I wrote the paper a polite letter. They printed it under the headline “THE MONSTER CAN WRITE.” Progress.' }, fx: { smarts: 2, happy: 2 } },
    ],
  },
  {
    id: 'p2_excellmate', icon: '🧳', cat: 'crime', rating: 2, cooldown: 8, when: { record: true, age: [18, 99], counter: { prisonYears: [1, 999] } }, actor: EX_CON,
    scene: { place: 'apartment', mood: 'shock' },
    text: {
      fr: [
        "On sonne. C'est {a.first}, ton ancien{a:|ne} codétenu{a:|e}, avec une valise, un sac de sport qui fait tic-tac et un grand sourire : « Juste deux jours, le temps de me retourner. » {a:Il|Elle} enlève déjà ses chaussures.",
        "{a.first}, ex-voisin{a:|e} de cellule, est sur ton palier. {a:Il|Elle} vient de sortir, n'a nulle part où aller, porte encore sa tenue de prison et tient un poulet rôti visiblement volé.",
      ],
      en: [
        "Doorbell. It's {a.first}, your old cellmate, with a suitcase, a gym bag that's ticking, and a big smile: “Just two days, till I get back on my feet.” {a:He|She} is already taking off {a.his} shoes.",
        "{a.first}, your old cell neighbor, is on your doorstep. Just released, nowhere to go, still in prison clothes and holding a clearly stolen rotisserie chicken.",
      ],
    },
    choices: [
      { label: { fr: "L'héberger", en: 'Take them in' }, out: [
        { w: 2, text: { fr: "Deux jours sont devenus deux mois. {a.first} a repeint ma salle de bains, adopté mon chat et appris à faire des lasagnes. Je ne veux plus qu'{a:il|elle} parte.", en: "Two days became two months. {a.first} repainted my bathroom, adopted my cat and learned to make lasagna. I don't want {a.him} to leave." }, fx: { rel: 25, happy: 6, actorRole: 'friend' }, mood: 'happy' },
        { w: 1, text: { fr: "Au troisième jour, la police a défoncé ma porte : 40 kilos de « farine » dans ma baignoire. La farine n'était pas de la farine. On m'a embarqué{|e} avec, toujours en peignoir.", en: 'On day three the police kicked in my door: 40 kilos of “flour” in my bathtub. The flour was not flour. They took me in too, still in my bathrobe.' }, fx: { arrest: 'drugtraffic', visual: 'police' }, mood: 'cry' },
      ] },
      { label: { fr: 'Fermer la porte', en: 'Close the door' }, text: { fr: "J'ai dit non et fermé la porte. {a.first} a dormi sur mon paillasson. Au matin, le paillasson avait disparu, {a.first} aussi. Il restait un poulet rôti, bizarrement.", en: '{a.first} slept on my doormat after I said no. In the morning, the doormat was gone, and so was {a.first}. Weirdly, the chicken stayed.' }, fx: { karma: -2, happy: -2 } },
      { label: { fr: 'Lui trouver un job', en: 'Find them a job' }, text: { fr: "J'ai trouvé un boulot à {a.first} au kebab du coin. Employé{a:|e} du mois trois mois d'affilée. Le patron me remercie en frites. La réinsertion, ça marche, et ça a un goût de sauce samouraï.", en: 'I got {a.first} a job at the corner kebab shop. Employee of the month three months running. The owner thanks me in fries. Rehabilitation works, and it tastes like hot sauce.' }, fx: { karma: 8, rel: 20, actorRole: 'friend' }, mood: 'proud' },
    ],
  },
  {
    id: 'p2_po_visit', icon: '📋', cat: 'crime', cooldown: 5, when: { record: true, age: [18, 99], counter: { prisonYears: [1, 999] } }, actor: ADULT_ANY,
    scene: { place: 'apartment', mood: 'shock' },
    text: {
      fr: [
        "Visite surprise de ton agent{a:|e} de probation, {a.first}. {a:Il|Elle} inspecte ton appartement avec des gants en latex et un carnet. Problème : ta collection de 40 nains de jardin te fixe depuis le salon.",
        "{a.first}, ton agent{a:|e} de probation, débarque à l'improviste. L'évier déborde, le chat a l'air louche, et tu as oublié de cacher le panneau « STOP » volé qui te sert de table basse.",
        "On sonne {w:time} : c'est {a.first}, ton agent{a:|e} de probation. Ton salon dégage {w:smell} et {w:object} traîne bien en évidence sur la table. {a:Il|Elle} sort son carnet.",
        "Contrôle surprise de {a.first}, ton agent{a:|e} de probation. Tu étais en pyjama, plongé{|e} dans {w:hobby}. {a:Il|Elle} inspecte [[le salon|la pièce|ton frigo]] avec un air de profonde lassitude.",
        "{a.first}, ton agent{a:|e} de probation, arrive pour une inspection pile au moment où {w:animal} sort de ta salle de bain. Tu n'as pas d'animal. Tu ne sais pas d'où ça sort. {a:Il|Elle} non plus.",
      ],
      en: [
        "Surprise visit from your probation officer, {a.first}. {a:He|She} inspects your apartment with latex gloves and a notebook. Problem: your collection of 40 garden gnomes is staring from the living room.",
        "{a.first}, your probation officer, drops by unannounced. The sink is overflowing, the cat looks shifty, and you forgot to hide the stolen STOP sign you use as a coffee table.",
        "Doorbell {w:time}: it's {a.first}, your probation officer. Your living room gives off {w:smell} and {w:object} is sitting in plain sight on the table. {a:He|She} pulls out a notebook.",
        "Surprise check-in from {a.first}, your probation officer. You were deep into {w:hobby}, in pajamas. {a:He|She} inspects [[the living room|the room|your fridge]] with an air of deep weariness.",
        "{a.first}, your probation officer, arrives for an inspection just as {w:animal} walks out of your bathroom. You don't have a pet. You don't know where it came from. Neither does {a:he|she}.",
      ],
    },
    choices: [
      { label: { fr: 'Offrir un café', en: 'Offer coffee' }, text: { fr: ["J'ai offert un café. {a.first} s'est assis{a:|e} sur la table basse, a lu « STOP » et n'a rien dit. On est presque amis. Je crois qu'{a:il|elle} avait besoin de parler.", "J'ai servi un café et {w:food}. {a.first} a tout mangé, s'est détendu{a:|e} et m'a parlé de son divorce pendant une heure. Rapport : « Excellente réinsertion. »"], en: ["{a.first} accepted a coffee, sat on the coffee table, read “STOP” and said nothing. We're almost friends. I think {a:he|she} needed to talk.", "I served coffee and {w:food}. {a.first} ate everything, relaxed and talked about {a:his|her} divorce for an hour. Report: 'Excellent reintegration.'"] }, fx: { rel: 15, heat: -5 }, mood: 'happy' },
      { label: { fr: 'Tout expliquer', en: 'Explain everything' }, text: { fr: ["J'ai présenté chaque nain. Prénom, histoire, signe astrologique. {a.first} est parti{a:|e} au bout de 40 minutes en écrivant « stable, mais étrange ». Meilleur rapport de ma vie.", "J'ai tout expliqué avec un calme olympien, {w:excuse}. {a.first} a noté chaque mot, a hoché la tête et est reparti{a:|e} sans rien dire. Le rapport dit seulement : « Original. »"], en: ["I introduced every gnome. Name, backstory, star sign. {a.first} left after 40 minutes, writing “stable, but strange.” Best report of my life.", "I explained everything with Olympic calm, {w:excuse}. {a.first} wrote down every word, nodded and left without a word. The report just says: 'Original.'"] }, fx: { heat: -10, happy: 3 } },
      { label: { fr: 'Me cacher dans le placard', en: 'Hide in the closet' }, text: { fr: ["Je me suis caché{|e} dans le placard en espérant qu'{a:il|elle} parte. {a.first} a ouvert le placard. On s'est regardés. {a:Il|Elle} a écrit « coopératif ? », avec le point d'interrogation.", "Je me suis caché{|e} sous le lit. {a.first} s'est assis{a:|e} dessus pour remplir son rapport pendant [[vingt minutes|une heure|deux heures]]. J'ai retenu ma respiration. Rapport : « Absent. Lit confortable. »"], en: ["{a.first} opened the closet I was hiding in. We stared at each other. {a:He|She} wrote “cooperative?”, question mark included.", "I hid under the bed. {a.first} sat on it to fill out the report for [[twenty minutes|an hour|two hours]]. I held my breath. Report: 'Absent. Comfortable bed.'"] }, fx: { heat: 5, stress: 6 }, mood: 'shock' },
    ],
  },
  {
    id: 'p2_ankle_bracelet', icon: '⛓️', cat: 'crime', rating: 1, once: true, when: { record: true, age: [18, 99] },
    scene: { place: 'home', mood: 'sad' },
    text: {
      fr: [
        "Le juge t'a collé six mois de bracelet électronique. Il bipe si tu dépasses le portail. Il bipe aussi quand tu passes l'aspirateur, quand il pleut, et sans raison à 3 h 12 du matin.",
        "Te voilà avec un bracelet électronique à la cheville. Il est gros comme une boîte de pâté et clignote en vert. Ton chat le considère comme un ennemi personnel.",
      ],
      en: [
        "The judge slapped you with six months of ankle monitor. It beeps if you pass the gate. It also beeps when you vacuum, when it rains, and for no reason at 3:12 a.m.",
        "You've got an ankle monitor now. It's the size of a can of cat food and blinks green. Your cat considers it a personal enemy.",
      ],
    },
    choices: [
      { label: { fr: 'Respecter les règles', en: 'Follow the rules' }, text: { fr: "Pas un pas dehors. 3 000 puzzles, le portugais en autodidacte, et une télénovela de 800 épisodes. Le bracelet et moi sommes devenus très proches.", en: 'Not one step outside. 3,000 puzzles, self-taught Portuguese, and an 800-episode telenovela. The monitor and I have grown very close.' }, fx: { discipline: 8, smarts: 4, happy: -4, heat: -10, flag: 'p2_bracelet' } },
      { label: { fr: 'Le cacher pour un date', en: 'Hide it for a date' }, text: { fr: "Je l'ai caché sous une chaussette de ski pour un rendez-vous galant. Au dessert, il a bipé. J'ai dit que c'était mon pacemaker. On s'est revus. Je n'ai pas de pacemaker.", en: "I hid it under a ski sock for a date. At dessert, it beeped. I said it was my pacemaker. We went out again. I don't have a pacemaker." }, fx: { happy: 5, flag: 'p2_bracelet' }, mood: 'love' },
      { label: { fr: "L'accrocher au chien", en: 'Strap it to the dog' }, out: [
        { w: 1, text: { fr: "Je l'ai attaché au chien pour sortir en boîte. Le chien a passé la nuit chez le voisin. Le système croit que je suis sorti{|e} par la chatière. Trois mois de bracelet en plus.", en: 'I strapped it to the dog and went clubbing. The dog spent the night at the neighbor\'s. The system thinks I crawled out through the cat flap. Three extra months of monitor.' }, fx: { happy: 6, heat: 10, flag: 'p2_bracelet' }, mood: 'party' },
        { w: 1, text: { fr: "Le chien a couru jusqu'à l'aéroport. Les flics ont cru à une évasion internationale. Une unité d'élite a plaqué un golden retriever sur le tarmac. Puis moi, en boîte.", en: 'The dog ran all the way to the airport. The cops assumed an international escape. A SWAT team tackled a golden retriever on the tarmac. Then me, at the club.' }, fx: { jail: 1, visual: 'police' }, mood: 'shock' },
      ] },
    ],
  },
  {
    id: 'p2_auto_bracelet', icon: '📟', cat: 'crime', rating: 1, auto: true, cooldown: 3, when: { flag: 'p2_bracelet', age: [18, 120] },
    text: {
      fr: [
        "Mon bracelet électronique a bipé pendant l'enterrement de tante Odile. Pile pendant la minute de silence. Toute la famille s'est retournée. Même tante Odile, j'ai cru.",
        "Mon bracelet électronique capte la radio par moments. Hier, il a passé un tube des années 80 pendant mon entretien d'embauche. Le recruteur a dansé. Je n'ai pas eu le poste.",
      ],
      en: [
        "My ankle monitor beeped at Aunt Odile's funeral. Right during the minute of silence. The whole family turned around. Even Aunt Odile, I think.",
        "My ankle monitor sometimes picks up the radio. Yesterday it played an '80s hit during my job interview. The recruiter danced. I didn't get the job.",
      ],
    },
    fx: { happy: -2, stress: 3 },
  },
  {
    id: 'p2_recognized', icon: '🛒', cat: 'crime', rating: 1, cooldown: 6, when: { record: true, age: [18, 120] },
    scene: { place: 'office', mood: 'shock' },
    text: {
      fr: [
        "À la caisse du supermarché, la caissière plisse les yeux. « Vous… Vous êtes la personne du mugshot ! Celle qui louche ! » Toute la file se retourne. Un monsieur sort déjà son téléphone.",
        "À la salle de sport, un type te fixe dans le miroir. Il compare avec son téléphone, puis hurle : « C'EST LA TÊTE DE L'AVIS DE RECHERCHE ! » La moitié de la salle s'enfuit. L'autre veut un selfie.",
      ],
      en: [
        "At the supermarket checkout, the cashier squints. “You… You're the person from the mugshot! The cross-eyed one!” The whole line turns around. A man is already pulling out his phone.",
        "At the gym, a guy stares at you in the mirror. He checks his phone, then yells: “IT'S THE FACE FROM THE WANTED POSTER!” Half the gym flees. The other half wants a selfie.",
      ],
    },
    choices: [
      { label: { fr: 'Faire des selfies', en: 'Take selfies' }, text: { fr: "Selfies avec toute la file. La caissière m'a fait 10 % de réduction. Je suis une célébrité locale. Une célébrité louche, mais une célébrité.", en: "Selfies with the whole line. The cashier gave me 10% off. I'm a local celebrity. A shady celebrity, but a celebrity." }, fx: { followers: 2000, fame: 3, happy: 4 }, mood: 'party' },
      { label: { fr: 'Nier', en: 'Deny it' }, text: { fr: "J'ai dit que c'était mon sosie, un vrai sale type. Ils m'ont cru{|e}. Maintenant tout le quartier cherche mon sosie. Je ne sors plus sans lunettes.", en: "I said it was my lookalike, a real scumbag. They believed me. Now the whole neighborhood is hunting my lookalike. I don't go out without sunglasses anymore." }, fx: { stress: 5, karma: -1 } },
      { label: { fr: 'Faire peur', en: 'Scare them' }, text: { fr: "J'ai fait mon regard de mugshot. La caissière a crié, le vigile s'est caché derrière les pastèques. J'ai payé dans un silence total. J'ai oublié les œufs. Je n'y retournerai jamais.", en: "I did my mugshot stare. The cashier screamed, the security guard hid behind the watermelons. I paid in total silence. I forgot the eggs. I'm never going back." }, fx: { heat: 5, happy: 2 }, mood: 'proud' },
    ],
  },
  {
    id: 'p2_vigilante', icon: '🔦', cat: 'crime', rating: 2, cooldown: 6, when: { record: true, age: [18, 99] },
    scene: { place: 'apartment', mood: 'angry' },
    text: {
      fr: [
        "Le groupe WhatsApp « Vigilance Quartier {city} » a partagé ta photo avec la légende « DANGER ». Depuis, des retraités en gilet jaune patrouillent sous tes fenêtres avec des lampes torches et un pitbull nommé Câlin.",
        "Tes voisins ont découvert ton casier. Ce matin : une pétition dans le hall, une croix rouge sur ta boîte aux lettres, et Mme Pichon qui te filme au téléobjectif depuis son balcon, en nuisette.",
      ],
      en: [
        "The “{city} Neighborhood Watch” group chat posted your photo captioned “DANGER.” Since then, retirees in hi-vis vests patrol under your windows with flashlights and a pit bull named Cuddles.",
        "Your neighbors found out about your record. This morning: a petition in the lobby, a red X on your mailbox, and Mrs. Pichon filming you with a zoom lens from her balcony, in her nightie.",
      ],
    },
    choices: [
      { label: { fr: 'Apporter des croissants', en: 'Bring croissants' }, text: { fr: "J'ai apporté des croissants à la patrouille. Ils ont débattu une heure pour savoir s'ils étaient empoisonnés. Ils les ont mangés quand même. On est amis. Câlin aussi.", en: "I brought the patrol croissants. They debated for an hour whether they were poisoned. They ate them anyway. We're friends now. Cuddles too." }, fx: { karma: 4, happy: 4 }, mood: 'happy' },
      { label: { fr: 'Les troller', en: 'Troll them' }, text: { fr: "J'ai mis des cagoules à mes nains de jardin et je les ai déplacés chaque nuit. La patrouille a appelé la police onze fois. Mme Pichon a fait une crise de nerfs en direct dans le groupe. Meilleur mois de ma vie.", en: 'I put ski masks on my garden gnomes and moved them every night. The patrol called the police eleven times. Mrs. Pichon had a meltdown live in the group chat. Best month of my life.' }, fx: { happy: 10, heat: 8, karma: -3 }, mood: 'party' },
      { label: { fr: 'Infiltrer le groupe', en: 'Infiltrate the group' }, text: { fr: "J'ai rejoint le groupe sous un faux nom et je me suis dénoncé{|e} moi-même avec plein de faux détails. Ils me cherchent en ce moment à l'autre bout du pays. Je les encourage.", en: 'I joined the chat under a fake name and reported myself with a pile of fake details. They\'re currently searching for me across the country. I cheer them on.' }, fx: { smarts: 3, happy: 6 }, mood: 'proud' },
      { label: { fr: 'Les affronter', en: 'Confront them' }, out: [
        { w: 1, text: { fr: "Je suis sorti{|e} m'expliquer en pleine nuit. Câlin m'a mordu la fesse et n'a plus lâché. Les retraités m'ont gazé{|e} au poivre. Urgences, fesse en sang, yeux en feu.", en: 'I went out at night to explain myself. Cuddles bit my butt and wouldn\'t let go. The retirees pepper-sprayed me. ER, bleeding butt, eyes on fire.' }, fx: { health: -15, visual: 'gore' }, mood: 'cry' },
        { w: 1, text: { fr: "J'ai parlé avec mon cœur. Ils ont pleuré. Ils ont dissous le groupe. Puis ils en ont créé un nouveau, contre un autre voisin.", en: 'I spoke from the heart. They cried. They dissolved the group. Then they started a new one, about a different neighbor.' }, fx: { karma: 3, happy: 5 }, mood: 'happy' },
      ] },
    ],
  },
  {
    id: 'p2_podcast', icon: '🎙️', cat: 'crime', rating: 2, once: true, when: { record: true, age: [18, 120], counter: { crimes: [3, 9999] } },
    scene: { place: 'studio', mood: 'shock' },
    text: {
      fr: [
        "Un podcast true crime vient de te consacrer six épisodes. Les deux animatrices mangent des chips dans le micro, écorchent ton nom, ta ville et ton crime, et t'ont surnommé{|e} « le Boucher de {city} ». Ton dossier est beaucoup plus bête que ça.",
        "« Crime & Croquettes », podcast numéro un du pays, raconte ta vie en mâchant bruyamment. Selon eux, tu aurais mangé ton avocat. Tu n'as jamais mangé personne. Les commentaires t'adorent.",
      ],
      en: [
        "A true-crime podcast just devoted six episodes to you. The two hosts eat chips into the mic, butcher your name, your city and your crime, and nicknamed you “the Butcher of {city}.” Your file is way dumber than that.",
        "“Murder & Munchies,” the country's number one podcast, tells your story while chewing loudly. According to them, you ate your lawyer. You've never eaten anyone. The comments love you.",
      ],
    },
    choices: [
      { label: { fr: 'Appeler en direct', en: 'Call in live' }, text: { fr: "J'ai appelé pour rectifier. Elles ont hurlé, croqué des chips, puis m'ont demandé de raconter « le meurtre ». Il n'y a pas de meurtre. Elles ont fait un épisode entier sur mon « déni ».", en: "I called in to correct them. They screamed, crunched chips, then asked me to describe “the murder.” There is no murder. They did a whole episode on my “denial.”" }, fx: { followers: 20000, fame: 6, happy: -3 } },
      { label: { fr: 'Vendre du merch', en: 'Sell merch' }, text: { fr: "Merch officiel « Le Boucher de {city} » : t-shirts, mugs, tabliers tachés de faux sang. Rupture de stock en deux jours. Ma mère a acheté un mug. Elle ne s'en sert pas.", en: 'Official “Butcher of {city}” merch: T-shirts, mugs, aprons stained with fake blood. Sold out in two days. My mom bought a mug. She doesn\'t use it.' }, fx: { money: 4000, fame: 5, karma: -4, visual: 'money' }, mood: 'party' },
      { label: { fr: 'Les attaquer en justice', en: 'Sue them' }, text: { fr: "Mise en demeure. Elles l'ont lue à l'antenne en faisant des bruits de pets avec les aisselles. Épisode le plus écouté de leur histoire. Mon avocat m'a facturé le temps d'écoute.", en: 'Cease and desist. They read it on air while making armpit fart noises. Most-played episode in their history. My lawyer billed me for listening time.' }, fx: { money: -2000, happy: -6 }, mood: 'angry' },
    ],
  },
  {
    id: 'p2_jury_duty', icon: '⚖️', cat: 'crime', cooldown: 10, when: { record: true, age: [18, 99] },
    scene: { place: 'court', mood: 'neutral' },
    text: {
      fr: [
        "Malgré ton casier, te voilà convoqué{|e} comme juré{|e}. L'accusé est jugé exactement pour le genre de chose que tu as fait. Il te regarde. Tu le regardes. Vous vous comprenez.",
        "Erreur administrative : tu es juré{|e} dans un procès pénal. L'accusé a utilisé ta technique, ton excuse et même ta coupe de cheveux. Les autres jurés attendent ton avis de « citoyen lambda ».",
        "Convocation au tribunal comme juré{|e}, malgré ton casier. L'accusé est jugé pour {w:crime_small}, un truc que tu as fait [[deux|trois|douze]] fois. L'avocat de la défense te fixe avec espoir.",
        "Tu es juré{|e}. L'accusé a été arrêté {w:at_place}, avec {w:object} sur lui, exactement comme toi il y a quelques années. Il porte même le même survêtement. Les jurés délibèrent.",
        "Juré{|e} dans un procès. L'accusé a donné comme excuse : « {w:excuse} ». C'est mot pour mot ce que tu avais dit au juge. Les autres jurés trouvent ça ridicule. Toi, ça te touche.",
      ],
      en: [
        "Despite your record, you've been summoned for jury duty. The defendant is on trial for exactly the kind of thing you did. He looks at you. You look at him. You understand each other.",
        "Clerical error: you're on a criminal jury. The defendant used your method, your excuse and even your haircut. The other jurors await your “ordinary citizen” opinion.",
        "Summoned for jury duty, despite your record. The defendant is on trial for {w:crime_small}, something you've done [[twice|three times|twelve times]]. The defense lawyer is looking at you hopefully.",
        "You're on a jury. The defendant was arrested {w:at_place}, with {w:object} on him, exactly like you a few years ago. He's even wearing the same tracksuit. The jury deliberates.",
        "On a jury. The defendant's excuse: '{w:excuse}'. That's word for word what you told your judge. The other jurors find it ridiculous. You find it moving.",
      ],
    },
    choices: [
      { label: { fr: 'Coupable !', en: 'Guilty!' }, text: { fr: ["J'ai voté coupable avec une ferveur suspecte. Les autres jurés m'ont trouvé{|e} très convaincant{|e}. Je me suis senti{|e} propre comme un sou neuf. Un sou volé, mais neuf.", "J'ai voté coupable. En sortant, l'accusé m'a regardé{|e} et a articulé « traître ». Il avait raison. J'ai mangé {w:food} pour oublier."], en: ["I voted guilty with suspicious fervor. The other jurors found me very convincing. I felt clean as a fresh penny. A stolen penny, but fresh.", "I voted guilty. On the way out, the defendant looked at me and mouthed 'traitor'. He was right. I ate {w:food} to forget."] }, fx: { karma: 2, happy: 3 } },
      { label: { fr: 'Non coupable !', en: 'Not guilty!' }, text: { fr: ["Discours passionné sur la deuxième chance : onze jurés convaincus. Acquitté. À la sortie, il m'a fait un clin d'œil et un signe de gang que je ne connais pas.", "J'ai plaidé l'innocence avec tant de conviction que les autres jurés ont pleuré. Acquitté. L'accusé m'a envoyé {w:gift} la semaine suivante. Sans mot. Juste le cadeau."], en: ["A passionate speech about second chances: eleven jurors convinced. Acquitted. On the way out, he gave me a wink and a gang sign I don't know.", "I argued for innocence so convincingly the other jurors cried. Acquitted. The defendant sent me {w:gift} the following week. No note. Just the gift."] }, fx: { happy: 5, smarts: 2 }, mood: 'proud' },
      { label: { fr: 'Avouer mon passé', en: 'Confess my past' }, text: { fr: ["J'ai levé la main : « Monsieur le juge, moi aussi j'ai fait ça. » Le juge m'a renvoyé{|e} chez moi, l'avocat de la défense a demandé mon numéro, et l'accusé a demandé des conseils.", "J'ai tout avoué en pleine délibération. Les autres jurés m'ont regardé{|e} en silence. Le président du jury a demandé : « Et ça s'est bien passé, pour vous ? » Débat de [[deux|trois|six]] heures."], en: ["I raised my hand: “Your Honor, I did that too.” The judge sent me home, the defense lawyer asked for my number, and the defendant asked for tips.", "I confessed everything in the middle of deliberations. The other jurors stared in silence. The foreman asked: 'And how did that work out for you?' A [[two|three|six]]-hour debate followed."] }, fx: { happy: 2, heat: 5 } },
    ],
  },
  {
    id: 'p2_lawyer_bill', icon: '🧾', cat: 'crime', rating: 1, cooldown: 6, when: { record: true, age: [18, 99] }, vars: { amount: [1500, 9000] },
    scene: { place: 'office', mood: 'shock' },
    text: {
      fr: [
        "La facture de ton avocat arrive. Douze pages. Lignes notables : « Avoir pensé à votre dossier sous la douche » ; « Soupir en lisant vos SMS » ; « Mal de crâne consécutif ». Total : {$amount}.",
        "Ton avocat t'envoie sa note d'honoraires : {$amount}. Elle inclut un « déjeuner de réflexion » (un homard), des « recherches » (son abonnement streaming) et un « préjudice moral » (le sien, en te rencontrant).",
      ],
      en: [
        "Your lawyer's bill arrives. Twelve pages. Highlights: “Thinking about your case in the shower”; “Sighing while reading your texts”; “Resulting headache.” Total: {$amount}.",
        "Your lawyer sends the invoice: {$amount}. It includes a “strategy lunch” (a lobster), “research” (his streaming subscription) and “emotional damages” (his, from meeting you).",
      ],
    },
    choices: [
      { label: { fr: 'Payer', en: 'Pay' }, text: { fr: "J'ai payé {$amount}. Il m'a envoyé une carte de remerciement. Il me l'a facturée aussi.", en: 'I paid {$amount}. He sent me a thank-you card. He billed me for it too.' }, fx: { money: '-amount', happy: -4 } },
      { label: { fr: 'Contester chaque ligne', en: 'Dispute every line' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai contesté ligne par ligne. Facture réduite de moitié. Il m'a proposé un stage dans son cabinet. J'ai dit non, par vengeance.", en: 'I disputed it line by line. Bill cut in half. He offered me an internship at his firm. I said no, out of spite.' }, fx: { money: -1000, smarts: 4 }, mood: 'proud' },
        { w: 1, text: { fr: "Il m'a facturé le temps passé à lire ma contestation. J'ai pleuré dans son bureau. Il a facturé les mouchoirs. Total : {$amount}, plus les mouchoirs.", en: 'He billed me for the time spent reading my dispute. I cried in his office. He billed for the tissues. Total: {$amount}, plus tissues.' }, fx: { money: '-amount', happy: -8 }, mood: 'cry' },
      ] },
      { label: { fr: 'Payer en poulets', en: 'Pay in chickens' }, text: { fr: "J'ai proposé de payer en poulets vivants, comme au Moyen Âge. Il a accepté. Il en a trente dans son cabinet. Ils assistent aux audiences. Un a fait objection.", en: 'I offered to pay in live chickens, medieval-style. He accepted. He has thirty in his office. They attend hearings. One raised an objection.' }, fx: { money: -300, happy: 6 }, mood: 'happy' },
    ],
  },
  {
    id: 'p2_heat_tail', icon: '🚐', cat: 'crime', rating: 2, cooldown: 5, when: { age: [18, 99], test: heat(45) },
    scene: { place: 'apartment', mood: 'shock', fx: 'police' },
    text: {
      fr: [
        "Une voiture banalisée est garée devant chez toi depuis trois semaines. Dedans, toujours le même inspecteur moustachu qui mange du thon et fait pipi dans des bouteilles. Il en est à 41. Il les aligne sur le tableau de bord.",
        "Tu es filé{|e}, c'est sûr : le même type en imperméable te suit partout, même aux toilettes publiques, où il lit son journal à l'envers dans la cabine d'à côté en respirant fort.",
      ],
      en: [
        "An unmarked car has been parked outside for three weeks. Inside: the same mustached detective eating tuna and peeing into bottles. He's at 41. He lines them up on the dashboard.",
        "You're being tailed, no doubt: the same guy in a trench coat follows you everywhere, even into public restrooms, where he reads his newspaper upside down in the next stall, breathing heavily.",
      ],
    },
    choices: [
      { label: { fr: 'Lui apporter une soupe', en: 'Bring him soup' }, text: { fr: "Je lui ai apporté une soupe chaude. Il a hésité, puis l'a bue. On a parlé deux heures de son divorce. Son rapport dit que je suis « inoffensif et bon cuisinier ».", en: 'I brought him hot soup. He hesitated, then drank it. We talked about his divorce for two hours. His report says I\'m “harmless and a good cook.”' }, fx: { heat: -20, karma: 3 }, mood: 'happy' },
      { label: { fr: 'Le semer au lavage auto', en: 'Lose him at a car wash' }, text: { fr: "Je l'ai semé dans un tunnel de lavage. Il m'a suivi vitre ouverte. Il est ressorti trempé, couvert de mousse et de cire chaude, un rouleau-brosse coincé dans la moustache. Il me hait.", en: 'I lost him in a car wash. He followed me in with his window down. He came out soaked, covered in foam and hot wax, a brush roller stuck in his mustache. He hates me.' }, fx: { heat: 10, happy: 10 }, mood: 'party' },
      { label: { fr: 'Signaler un rôdeur', en: 'Report a prowler' }, text: { fr: "J'ai signalé à la police un individu louche devant chez moi. Ils ont arrêté l'inspecteur. Il a passé la nuit au poste à expliquer qu'il était de la police. Ses bouteilles ont été saisies comme pièces à conviction.", en: 'I reported a suspicious man outside my home. They arrested the detective. He spent the night at the station explaining he was a cop. His bottles were seized as evidence.' }, fx: { heat: 15, happy: 12, karma: -2 }, mood: 'party' },
    ],
  },
  {
    id: 'p2_wanted_poster', icon: '🖼️', cat: 'crime', rating: 2, cooldown: 5, when: { age: [18, 99], test: heat(60) },
    scene: { place: 'park', mood: 'shock', fx: 'police' },
    text: {
      fr: [
        "Ton portrait-robot est placardé dans toute la ville. Le dessinateur t'a fait une tête de patate dépressive avec des sourcils de méchant de dessin animé. Récompense : 500 balles. Le montant t'insulte.",
        "Avis de recherche à la boulangerie : ta tête version croquis, nez en courgette et menton fuyant. Le boulanger t'a regardé{|e}, a regardé l'affiche, puis t'a rendu la monnaie en tremblant.",
      ],
      en: [
        "Your police sketch is plastered all over town. The artist gave you the face of a depressed potato with cartoon-villain eyebrows. Reward: 500 bucks. The amount is insulting.",
        "Wanted poster at the bakery: your face, sketch version, zucchini nose and weak chin. The baker looked at you, at the poster, then gave you your change with shaking hands.",
      ],
    },
    choices: [
      { label: { fr: 'Me déguiser', en: 'Go in disguise' }, text: { fr: "Fausse moustache, perruque blonde, lunettes de soleil la nuit. Je ressemble trait pour trait à l'autre portrait-robot affiché à côté. Celui d'un tueur. Tout le monde me fuit, mais pas pour la bonne raison.", en: 'Fake mustache, blond wig, sunglasses at night. I look exactly like the other sketch posted next to mine. A killer\'s. Everyone avoids me, just for the wrong reason.' }, fx: { heat: -10, stress: 8, happy: -3 } },
      { label: { fr: 'Me rendre pour protester', en: 'Turn myself in to complain' }, text: { fr: "Je suis allé{|e} au commissariat, affiche à la main, me plaindre de la ressemblance. Ils m'ont arrêté{|e}. Le dessinateur a demandé à me voir pour « corriger deux ou trois détails ».", en: 'I went to the station, poster in hand, to complain about the likeness. They arrested me. The sketch artist asked to see me to “fix a few details.”' }, fx: { arrest: 'robstore', visual: 'police' }, mood: 'shock' },
      { label: { fr: 'Arracher les affiches', en: 'Tear down the posters' }, out: [
        { w: 1, text: { fr: "312 affiches arrachées en une nuit. Le lendemain, il y en avait 600, signées d'un meilleur dessinateur. Je suis magnifique sur la nouvelle. C'est pire.", en: '312 posters torn down in one night. The next day there were 600, by a better artist. I look gorgeous on the new one. That\'s worse.' }, fx: { heat: 10, happy: 2 } },
        { w: 1, text: { fr: "Pris{|e} en flagrant délit d'arrachage de mon propre avis de recherche. Le flic a regardé l'affiche, puis moi, puis l'affiche. Il a dû s'asseoir pour rire avant de me menotter.", en: 'Caught red-handed tearing down my own wanted poster. The cop looked at the poster, at me, at the poster. He had to sit down and laugh before cuffing me.' }, fx: { arrest: 'vandal', visual: 'police' }, mood: 'cry' },
      ] },
    ],
  },
  {
    id: 'p2_fugitive', icon: '🏃', cat: 'crime', rating: 2, cooldown: 3, when: { age: [18, 120], test: (l) => l.flags.fugitive !== undefined },
    scene: { place: 'apartment', mood: 'shock' },
    text: {
      fr: [
        "Motel miteux, chambre 13. Tu es en cavale depuis des mois. À la télé, ton visage passe entre la météo et une pub pour des couches. Le gérant regarde l'écran, puis ta fenêtre, puis son téléphone.",
        "Vie de {fugitif|fugitive} : faux nom (« Jean-Michel Innocent »), cheveux teints en orange, un sandwich par jour. Ce matin, un enfant t'a montré{|e} du doigt dans la rue en criant « LA TÉLÉ ! ».",
      ],
      en: [
        "Seedy motel, room 13. You've been on the run for months. On TV, your face appears between the weather and a diaper ad. The manager looks at the screen, then your window, then his phone.",
        "Fugitive life: fake name (“John Innocent”), hair dyed orange, one sandwich a day. This morning a kid pointed at you on the street, yelling “THE TV!”",
      ],
    },
    choices: [
      { label: { fr: 'Changer de ville', en: 'Skip town' }, out: [
        { w: 2, text: { fr: "Douze heures de bus à côté d'un type qui mangeait des œufs durs. Nouvelle ville, nouveau nom : « Kevin Innocent ». Ils ne me retrouveront jamais. Sauf avec ce nom.", en: 'Twelve hours on a bus next to a guy eating hard-boiled eggs. New town, new name: “Kevin Innocent.” They\'ll never find me. Except with that name.' }, fx: { heat: -15, happy: -3 } },
        { w: 1, text: { fr: "Le chauffeur du bus était un flic à la retraite. Il a fermé les portes, mis la radio et roulé droit au commissariat, en chantant. Retour en taule avec bonus.", en: 'The bus driver was a retired cop. He locked the doors, turned on the radio and drove straight to the station, singing. Back to prison, with a bonus.' }, fx: { jail: 3, visual: 'police', fn: caughtFugitive }, mood: 'cry' },
      ] },
      { label: { fr: 'Me rendre', en: 'Turn myself in' }, text: { fr: "J'en avais marre des sandwichs. Je me suis rendu{|e} avec une pancarte « C'EST MOI ». Le commissariat a applaudi, puis m'a renvoyé{|e} en prison avec deux ans pour l'effort.", en: 'I was sick of sandwiches. I turned myself in holding a sign: “IT\'S ME.” The station applauded, then sent me back to prison with two years for the effort.' }, fx: { jail: 2, karma: 4, fn: caughtFugitive }, mood: 'sad' },
      { label: { fr: 'Me faire refaire le visage', en: 'Get a new face' }, if: { money: [5000, 1e15] }, text: { fr: "Un chirurgien radié m'a refait le visage dans l'arrière-salle d'une pizzeria. Je ressemble à un mélange de moi et d'un lama surpris. Personne ne me reconnaît. La cicatrice derrière l'oreille saigne quand j'éternue.", en: 'A struck-off surgeon redid my face in the back room of a pizzeria. I now look like a cross between me and a surprised llama. Nobody recognizes me. The scar behind my ear bleeds when I sneeze.' }, fx: { money: -5000, looks: -10, heat: -40, visual: 'gore' }, mood: 'shock' },
    ],
  },
  {
    id: 'p2_community_service', icon: '🦺', cat: 'crime', rating: 2, cooldown: 6, when: { record: true, age: [16, 99] },
    scene: { place: 'park', mood: 'shock', fx: 'gore' },
    text: {
      fr: [
        "Travaux d'intérêt général au bord de l'autoroute, gilet orange fluo. Au bout d'une heure, ta pince à déchets attrape une main. Une vraie. Avec une bague en or, du vernis rouge, et une montre qui marche encore.",
        "TIG dans un parc : canettes, mégots, chaussettes orphelines. Sous un buisson, ta pince attrape quelque chose de mou. C'est un pied. Il porte une chaussette de Noël et une chaîne de cheville en or.",
      ],
      en: [
        "Community service on the highway shoulder, hi-vis orange vest. After an hour, your litter picker grabs a hand. A real one. With a gold ring, red nail polish and a watch that's still ticking.",
        "Community service in a park: cans, butts, orphan socks. Under a bush, your picker grabs something squishy. It's a foot. It's wearing a Christmas sock and a gold anklet.",
      ],
    },
    choices: [
      { label: { fr: 'Prévenir la police', en: 'Call the police' }, text: { fr: "J'ai appelé la police. Enquête ouverte. Les flics m'ont soupçonné{|e} trois semaines, puis remercié{|e}. Mes heures de TIG ont été doublées pour « perturbation du service ».", en: 'I called the police. Investigation opened. The cops suspected me for three weeks, then thanked me. My community service hours were doubled for “disrupting the service.”' }, fx: { heat: 5, karma: 4 } },
      { label: { fr: 'Garder le bijou', en: 'Keep the jewelry' }, text: { fr: "J'ai gardé l'or. Il valait une fortune. Depuis, j'entends un petit tic-tac la nuit alors que je n'ai pas de montre. Quelqu'un essaie de me dire quelque chose.", en: "I kept the gold. It was worth a fortune. Since then I hear a faint ticking at night even though I don't own a watch. Someone is trying to tell me something." }, fx: { money: 2500, karma: -6, heat: 10, visual: 'money' }, mood: 'shock' },
      { label: { fr: 'Le lancer au superviseur', en: 'Toss it to the supervisor' }, text: { fr: "J'ai lancé le membre au superviseur en criant « ATTRAPE ! ». Il l'a attrapé. Il a hurlé, vomi dans le fossé, puis s'est évanoui dans son propre vomi. Plus personne ne veut me superviser. TIG terminés.", en: 'I tossed the limb to the supervisor yelling “CATCH!” He caught it. He screamed, puked in the ditch, then passed out in his own puke. Nobody will supervise me anymore. Community service over.' }, fx: { happy: 8, karma: -4, visual: 'gore' }, mood: 'party' },
    ],
  },
  {
    id: 'p2_scared_straight', icon: '🏫', cat: 'crime', cooldown: 10, when: { record: true, age: [20, 99] },
    scene: { place: 'school', mood: 'neutral' },
    text: {
      fr: [
        "Un lycée t'invite à témoigner devant des terminales pour les dissuader de mal tourner. Le proviseur insiste : « Faites-leur peur. » Trois cents ados te fixent en mâchant du chewing-gum.",
        "Le centre social te demande de raconter ton parcours à des jeunes « en difficulté ». Tu es censé{|e} être un contre-exemple. Ils ont l'air de te trouver très cool, et c'est mauvais signe.",
        "Un collège t'invite pour une « conférence prévention ». Dans le gymnase, [[deux cents|trois cents|quatre cents]] ados te dévisagent. Un élève au premier rang porte un t-shirt « {w:band} World Tour ». Il te fait un signe de tête respectueux.",
        "L'association de quartier veut que tu parles de la prison à des jeunes {w:at_place}. Le responsable te tend un micro qui fait {w:sound}. Les ados ont déjà sorti leurs téléphones pour filmer.",
        "Conférence anti-délinquance dans un lycée. Juste avant toi, un policier a fait une présentation PowerPoint sur {w:crime_small}. Tout le monde dormait. Maintenant, ils se réveillent : c'est le tour de l'ancien taulard.",
      ],
      en: [
        "A high school invites you to speak to seniors and scare them straight. The principal insists: “Terrify them.” Three hundred teens stare at you, chewing gum.",
        "The community center asks you to tell your story to “at-risk” youth. You're supposed to be a cautionary tale. They seem to think you're very cool, which is a bad sign.",
        "A middle school invites you for a 'prevention talk'. In the gym, [[two hundred|three hundred|four hundred]] teens are sizing you up. A kid in the front row wears a '{w:band} World Tour' T-shirt. He gives you a respectful nod.",
        "The neighborhood association wants you to talk about prison to young people {w:at_place}. The organizer hands you a microphone that makes {w:sound}. The teens have already pulled out their phones to film.",
        "Anti-crime assembly at a high school. Right before you, a cop gave a PowerPoint on {w:crime_small}. Everyone was asleep. Now they're waking up: it's the ex-con's turn.",
      ],
    },
    choices: [
      { label: { fr: 'Leur faire peur', en: 'Terrify them' }, text: { fr: ["J'ai décrit la cantine de la prison avec tant de détails que trois élèves sont sortis en courant et qu'un a annoncé vouloir devenir notaire. Le proviseur m'a serré la main avec émotion.", "J'ai décrit les douches communes, le bruit la nuit et l'odeur du mitard. Un élève s'est évanoui. Un autre a rendu {w:object}, fruit d'un larcin commis le matin même. Mission accomplie."], en: ["I described prison food in such detail that three students ran out and one announced he wants to become an accountant. The principal shook my hand, moved.", "I described the communal showers, the noise at night and the smell of solitary. One student fainted. Another returned {w:object}, swiped that very morning. Mission accomplished."] }, fx: { karma: 6, happy: 4 }, mood: 'proud' },
      { label: { fr: 'Être honnête', en: 'Be honest' }, text: { fr: ["J'ai parlé honnêtement : erreurs, regrets, et le prix d'un déodorant en taule. Un élève est venu me remercier. Un autre m'a demandé de l'aider à effacer une mauvaise note. J'ai dit non. Fermement.", "J'ai raconté la vérité, sans fard. À la fin, une élève a levé la main et demandé si ça valait le coup. J'ai dit non. Elle a hoché la tête. Je crois que j'ai sauvé quelqu'un. Peut-être."], en: ["I spoke honestly: mistakes, regrets, and the price of deodorant inside. One student came to thank me. Another asked me to help erase a bad grade. I said no. Firmly.", "I told the truth, no sugarcoating. At the end, a student raised her hand and asked if it was worth it. I said no. She nodded. I think I saved someone. Maybe."] }, fx: { karma: 8, smarts: 2 }, mood: 'happy' },
      { label: { fr: 'Me la raconter', en: 'Brag a little' }, text: { fr: ["J'ai raconté mes exploits avec un peu trop d'enthousiasme. Trois élèves ont demandé un autographe, un a monté un club à mon nom. Le proviseur ne me réinvitera jamais.", "Je me suis un peu emballé{|e} : course-poursuite avec {w:vehicle}, évasion ratée, surnom en prison. Les élèves ont applaudi debout. Le proviseur a coupé le micro. Un prof a pris des notes."], en: ["I told my stories with a little too much enthusiasm. Three students asked for autographs, one started a fan club in my name. The principal will never invite me back.", "I got a bit carried away: a car chase with {w:vehicle}, a botched escape, my prison nickname. The students gave a standing ovation. The principal cut the mic. A teacher took notes."] }, fx: { fame: 3, karma: -5, happy: 5 }, mood: 'party' },
    ],
  },

  // ═════════════════════════════ ANYONE: street crime, cops, karma ═════════════════════════════
  {
    id: 'p2_witness', icon: '👁️', cat: 'crime', cooldown: 8, when: { age: [8, 99] },
    scene: { place: 'park', mood: 'shock', fx: 'police' },
    text: {
      fr: [
        "Un homme déguisé en croissant géant braque la pâtisserie du coin avec une baguette. Il file sur une trottinette électrique avec la caisse et trois éclairs au café. Un policier essoufflé veut ton témoignage.",
        "Sous tes yeux, quelqu'un vole la statue du nain du jardin public, la couche dans une poussette et s'enfuit en courant. Un policier arrive, rouge et transpirant : « Vous avez vu quelque chose ? »",
        "{w:time}, une femme en peignoir braque la boutique {w:at_place} en brandissant {w:object}. Elle repart sur {w:vehicle} avec la caisse. Un policier en sueur sort son calepin et se tourne vers toi.",
        "Un type cagoulé vient de voler {w:animal} dans l'animalerie et s'enfuit en serrant la bête contre lui comme un bébé. La bête a l'air d'accord. Un policier te demande ce que tu as vu, [[en mâchant un sandwich|en reprenant son souffle|en remontant son pantalon]].",
        "Braquage express : un homme portant un masque qui représente {w:celeb} vide la caisse de la supérette, s'excuse poliment et part en courant {w:weather}. Un agent arrive trois minutes trop tard et compte sur toi.",
      ],
      en: [
        "A man dressed as a giant croissant robs the corner pastry shop with a baguette. He zooms off on an e-scooter with the cash register and three éclairs. A winded cop wants your statement.",
        "Right in front of you, someone steals the gnome statue from the public garden, tucks it into a stroller and runs. A red, sweaty cop arrives: “Did you see anything?”",
        "{w:time}, a woman in a bathrobe holds up the shop {w:at_place}, armed with {w:object}. She escapes on {w:vehicle} with the till. A sweaty cop pulls out his notepad and turns to you.",
        "A masked guy just stole {w:animal} from the pet shop and is running off, cradling it like a baby. The animal seems fine with it. A cop asks what you saw, [[mid-sandwich|catching his breath|hitching up his pants]].",
        "Express robbery: a man wearing a mask of {w:celeb} empties the convenience store till, apologizes politely and runs off {w:weather}. An officer arrives three minutes late and is counting on you.",
      ],
    },
    choices: [
      { label: { fr: 'Témoigner précisément', en: 'Give a precise account' }, text: { fr: ["J'ai tout décrit avec une précision chirurgicale. Suspect arrêté en une heure. Le commissaire m'a offert un café et un badge en plastique. Je le porte encore.", "J'ai donné une description parfaite, jusqu'à la marque des chaussettes. Le suspect a été arrêté le soir même. Les flics m'ont proposé un stage. J'ai décliné, poliment."], en: ["I described everything with surgical precision. Suspect arrested within an hour. The captain gave me a coffee and a plastic badge. I still wear it.", "I gave a perfect description, down to the sock brand. The suspect was arrested that same night. The cops offered me an internship. I politely declined."] }, fx: { karma: 5, happy: 5, smarts: 2 }, mood: 'proud' },
      { label: { fr: 'En rajouter un peu', en: 'Embellish a little' }, text: { fr: ["J'ai un peu brodé : trois complices, un hélicoptère, un accent étranger. Quarante agents et un drone déployés. Ils ont arrêté un retraité qui passait par là. Je dors mal.", "J'en ai rajouté : un sous-marin, un complice qui se faisait passer pour {w:animal} et un plan d'évasion par les égouts. Le journal local a fait sa une avec mon témoignage. Le vrai voleur l'a encadrée."], en: ["I embellished a bit: three accomplices, a helicopter, a foreign accent. Forty officers and a drone deployed. They arrested a passing retiree. I sleep badly.", "I spiced it up: a submarine, an accomplice posing as {w:animal} and an escape through the sewers. The local paper put my statement on the front page. The real thief framed it."] }, fx: { karma: -4, happy: 3 } },
      { label: { fr: "N'avoir rien vu", en: 'Saw nothing' }, text: { fr: ["J'ai dit que je n'avais rien vu. Le policier a soupiré : « Comme tout le monde. » Je suis rentré{|e} avec un poids sur la conscience.", "Je n'ai rien vu. Enfin, officiellement. Le policier a noté « témoin myope » et m'a conseillé un ophtalmo. J'ai pris rendez-vous, par culpabilité."], en: ["I said I saw nothing. The cop sighed: “Like everyone.” I went home with a weight on my conscience.", "I saw nothing. Officially. The cop wrote 'near-sighted witness' and recommended an eye doctor. I booked an appointment, out of guilt."] }, fx: { karma: -2 } },
    ],
  },
  {
    id: 'p2_wrongful_arrest', icon: '🚨', cat: 'crime', rating: 1, cooldown: 12, when: { age: [18, 99], record: false },
    scene: { place: 'park', mood: 'shock', fx: 'police' },
    text: {
      fr: [
        "Des policiers te plaquent au sol en pleine rue : tu ressembles trait pour trait à « Dédé la Fouine », braqueur de supérettes recherché. Tu as une baguette sous le bras et de la confiture sur la joue.",
        "Interpellation musclée devant ton boulot : ton nom correspond à celui d'un braqueur en cavale. Six flics, un chien, un hélicoptère. Tes collègues filment depuis la fenêtre en mangeant des chips.",
      ],
      en: [
        "Cops tackle you in the middle of the street: you're the spitting image of “Eddie the Weasel,” a wanted convenience-store robber. You have a baguette under your arm and jam on your cheek.",
        "Rough arrest outside your work: your name matches a fugitive robber's. Six cops, a dog, a helicopter. Your coworkers film from the window, eating chips.",
      ],
    },
    choices: [
      { label: { fr: 'Rester calme', en: 'Stay calm' }, out: [
        { w: 3, text: { fr: "Six heures de garde à vue et trois vérifications d'empreintes plus tard, ils ont admis l'erreur. Le commissaire m'a offert un café froid et des excuses tièdes.", en: 'Six hours in holding and three fingerprint checks later, they admitted the mistake. The captain offered me a cold coffee and a lukewarm apology.' }, fx: { happy: -6, stress: 10 }, mood: 'angry' },
        { w: 1, text: { fr: "Je suis resté{|e} calme. Le juge, pressé, n'a pas lu le dossier. Me voilà jugé{|e} pour un braquage que je n'ai pas commis. Le vrai Dédé doit bien rire, quelque part.", en: "I stayed calm. The judge, in a hurry, didn't read the file. Now I'm on trial for a robbery I didn't commit. The real Eddie must be laughing somewhere." }, fx: { arrest: 'robstore' }, mood: 'cry' },
      ] },
      { label: { fr: 'Tout filmer', en: 'Film everything' }, text: { fr: "J'ai filmé pendant qu'on me plaquait. 8 millions de vues. Excuses publiques de la police. Une marque de matelas m'a même proposé une pub : « Si confortable qu'on dirait un plaquage ventral. »", en: 'I filmed while being tackled. 8 million views. Public apology from the police. A mattress brand even offered me an ad: “So comfy, it feels like being pinned by six cops.”' }, fx: { followers: 30000, fame: 5, happy: 6, health: -3 }, mood: 'proud' },
      { label: { fr: 'Hurler mon innocence', en: 'Scream my innocence' }, text: { fr: "J'ai hurlé « JE SUIS INNOCENT{|E} ! » si fort qu'un policier a lâché son taser. Sur son pied. Il a dansé une samba électrique sur le trottoir. On m'a relâché{|e}. Lui, on l'a emmené.", en: 'I screamed “I\'M INNOCENT!” so loud a cop dropped his taser. On his own foot. He did an electric samba on the sidewalk. They let me go. Him, they carried off.' }, fx: { health: -4, happy: 5 }, mood: 'party' },
    ],
  },
  {
    id: 'p2_robbed_home', icon: '🏚️', cat: 'crime', rating: 1, cooldown: 8, when: { age: [18, 120], movedOut: true },
    scene: { place: 'apartment', mood: 'shock' },
    text: {
      fr: [
        "En rentrant, ta porte est défoncée. Les cambrioleurs ont pris la télé, l'ordinateur, et laissé une note : « Déco à revoir. 2/5. » Ils ont aussi fini tes restes de pizza.",
        "Cambriolage ! Ils ont tout pris sauf ta collection de poupées en porcelaine, qu'ils ont retournées face au mur. Un mot : « Désolés. Elles nous regardaient. »",
      ],
      en: [
        "You come home to a kicked-in door. The burglars took the TV, the laptop, and left a note: “Decor needs work. 2/5.” They also finished your leftover pizza.",
        "Burglary! They took everything except your porcelain doll collection, which they turned to face the wall. A note: “Sorry. They were watching us.”",
      ],
    },
    choices: [
      { label: { fr: 'Appeler la police', en: 'Call the police' }, text: { fr: "Ils sont venus trois jours plus tard, ont pris des photos, et l'un d'eux a fini ma dernière bière. Le dossier est « en cours ». Comme 40 000 autres.", en: 'They came three days later, took photos, and one of them finished my last beer. The case is “ongoing.” Like 40,000 others.' }, fx: { money: -800, happy: -6 } },
      { label: { fr: 'Enquêter moi-même', en: 'Investigate myself' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: "Les cambrioleurs avaient posté un selfie avec ma télé sur les réseaux, devant ma propre fenêtre. J'ai tout récupéré. Ils ont pris deux ans. Ils m'ont mis 1/5.", en: 'The burglars had posted a selfie with my TV online, in front of my own window. I got everything back. They got two years. They gave me 1/5.' }, fx: { happy: 8, karma: 2 }, mood: 'proud' },
        { w: 1, text: { fr: "J'ai accusé le voisin, qui n'y était pour rien. Il m'a fait un procès. Il a gagné. Il s'est acheté une nouvelle télé. Elle ressemble à la mienne.", en: 'I accused the neighbor, who had nothing to do with it. He sued me. He won. He bought a new TV. It looks just like mine.' }, fx: { money: -1500, happy: -8 }, mood: 'angry' },
      ] },
      { label: { fr: "Gonfler l'assurance", en: 'Pad the insurance claim' }, text: { fr: "La télé est devenue un écran géant, mon vieux vélo un vélo de course en carbone. L'assurance a tout remboursé. Je suis un criminel moi aussi, maintenant. Un petit.", en: 'The TV became a giant screen, my old bike a carbon racing bike. Insurance paid it all. I\'m a criminal now too. A small one.' }, fx: { money: 2500, karma: -5, heat: 3 } },
    ],
  },
  {
    id: 'p2_karma_revenge', icon: '☯️', cat: 'crime', rating: 1, cooldown: 8, when: { age: [14, 120] },
    scene: { place: 'park', mood: 'happy' },
    text: {
      fr: [
        "Le chauffard qui t'a éclaboussé{|e} exprès la semaine dernière, en riant, vient de finir dans une fontaine. Il est debout sur le toit de sa voiture qui coule doucement, en costume, à appeler au secours. Il te reconnaît.",
        "Le type qui t'a piqué ta place de parking avec un doigt d'honneur se fait embarquer sa voiture de sport par la fourrière. Il court derrière la dépanneuse en chaussettes, en pleurant. Il te voit.",
        "La collègue qui t'a volé ton idée le mois dernier vient de glisser sur {w:food} devant tout le bureau, {w:time}. Elle est par terre, couverte de sauce. Elle croise ton regard.",
        "L'ex qui t'a largué{|e} par SMS vient de se faire larguer à son tour, en public, {w:at_place}. Son nouveau partenaire lui a jeté {w:drink} au visage. Tout dégouline. Et là, vos regards se croisent.",
        "Le voisin qui klaxonnait tous les matins à 6 h sous ta fenêtre est coincé dans sa voiture, attaqué par {w:animal}. Il hurle « {w:exclaim} ». Il te voit à la fenêtre, [[ton café à la main|en pyjama|en train de sourire]].",
      ],
      en: [
        "The driver who splashed you on purpose last week, laughing, just drove into a fountain. He's standing on the roof of his slowly sinking car, in a suit, crying for help. He recognizes you.",
        "The guy who stole your parking spot and flipped you off is watching his sports car get towed. He chases the tow truck in his socks, crying. He sees you.",
        "The coworker who stole your idea last month just slipped on {w:food} in front of the whole office, {w:time}. She's on the floor, covered in sauce. She meets your eyes.",
        "The ex who dumped you by text just got dumped in public, {w:at_place}. The new partner threw {w:drink} in their face. Everything is dripping. And then your eyes meet.",
        "The neighbor who honked under your window every morning at 6 a.m. is trapped in his car, under attack by {w:animal}. He's yelling '{w:exclaim}'. He sees you at the window, [[coffee in hand|in your pajamas|smiling]].",
      ],
    },
    choices: [
      { label: { fr: 'Lui tendre la main', en: 'Help him' }, text: { fr: ["Je l'ai aidé. Il a pleuré dans mes bras, puis m'a donné sa carte : il est juge. On ne sait jamais quand ça peut servir.", "J'ai tendu la main. Des excuses balbutiées, un regard gêné, un merci à peine audible. Je me suis senti{|e} plus grand{|e} que tout le monde. Pendant [[dix secondes|une minute|toute la journée]]."], en: ["I helped him. He cried in my arms, then handed me his card: he's a judge. You never know when that comes in handy.", "I offered a hand. Stammered apologies, an embarrassed look, a barely audible thank-you. I felt bigger than everyone. For [[ten seconds|a minute|the whole day]]."] }, fx: { karma: 8, happy: 4, heat: -10 }, mood: 'proud' },
      { label: { fr: 'Rire très fort', en: 'Laugh very loudly' }, text: { fr: ["J'ai ri, fort, les mains sur les genoux. J'ai filmé, posté, ajouté une musique de cirque. La vidéo tourne encore. La vengeance est un plat qui se mange en story.", "J'ai éclaté de rire si fort que j'en ai pleuré. Des passants m'ont rejoint{|e}. On était [[cinq|dix|vingt]] à rire en chœur. Ça reste le plus beau moment de mon année."], en: ["I laughed, hard, hands on my knees. Filmed it, posted it, added circus music. The video is still going around. Revenge is a dish best served on social media.", "I burst out laughing so hard I cried. Passersby joined in. There were [[five|ten|twenty]] of us laughing in chorus. Still the best moment of my year."] }, fx: { happy: 10, karma: -3, followers: 2000 }, mood: 'party' },
      { label: { fr: 'Lui faire coucou', en: 'Wave' }, text: { fr: ["Je lui ai fait un petit coucou de la main. Le même geste que lui, mais avec tous les doigts. Puis je suis reparti{|e} en sifflotant. L'univers a le sens de l'humour.", "Je lui ai fait coucou, en souriant de toutes mes dents, puis je suis reparti{|e} en chantonnant {w:song}. Ce visage-là, je ne l'oublierai jamais."], en: ["I gave him a little wave. Same gesture he gave me, but with all the fingers. Then I strolled off whistling. The universe has a sense of humor.", "I waved, grinning ear to ear, then walked off humming {w:song}. I'll never forget that face."] }, fx: { happy: 7 }, mood: 'happy' },
    ],
  },
  {
    id: 'p2_n_watch', icon: '🦺', cat: 'crime', once: true, when: { age: [25, 120], movedOut: true },
    scene: { place: 'home', mood: 'neutral' },
    text: {
      fr: [
        "Le Comité de Vigilance du quartier, dirigé par Gérard, gendarme retraité à moustache réglementaire, cherche des volontaires. Talkies-walkies, gilets fluo et thermos fournis. Gérard appelle les nouveaux « les bleus ».",
        "Ton voisin Gérard monte une ronde de quartier après le vol d'un nain de jardin. Il a une carte, des punaises, des fils rouges et un regard qui a vu trop de séries policières.",
        "Gérard, du comité de vigilance, sonne chez toi : quelqu'un a volé {w:object} dans le jardin de Mme Lebrun. Il recrute. Il a déjà [[trois|cinq|deux]] suspects, dont toi.",
        "Le comité de vigilance de Gérard a une nouvelle mission : traquer {w:animal} qui renverse les poubelles la nuit. Gilets fluo, lampes frontales, talkies. Il te tend un brassard.",
        "Gérard, gendarme retraité, a affiché un avis dans le hall : « Ronde de quartier. Recherche volontaires motivés. {w:band} : fans s'abstenir. » Il te regarde avec insistance depuis sa fenêtre.",
      ],
      en: [
        "The neighborhood watch committee, led by Gerald, a retired cop with a regulation mustache, is looking for volunteers. Walkie-talkies, hi-vis vests and thermoses provided. Gerald calls newcomers “rookies.”",
        "Your neighbor Gerald is starting a neighborhood watch after a garden gnome theft. He has a map, pushpins, red string, and the look of a man who has watched too many cop shows.",
        "Gerald, from the neighborhood watch, rings your bell: someone stole {w:object} from Mrs. Lebrun's yard. He's recruiting. He already has [[three|five|two]] suspects, including you.",
        "Gerald's neighborhood watch has a new mission: hunting down {w:animal} that knocks over trash cans at night. Hi-vis vests, headlamps, walkie-talkies. He hands you an armband.",
        "Gerald, retired cop, posted a notice in the lobby: 'Neighborhood watch. Seeking motivated volunteers. {w:band} fans need not apply.' He's staring at you insistently from his window.",
      ],
    },
    choices: [
      { label: { fr: "M'enrôler", en: 'Sign up' }, text: { fr: ["Première patrouille : trois heures à surveiller un buisson suspect. C'était un hérisson. Gérard l'a quand même verbalisé pour tapage nocturne.", "Je me suis enrôlé{|e}. On a patrouillé {w:weather} toute la nuit. On a arrêté un ado qui faisait du skate et le facteur, par erreur. Gérard m'a décoré{|e} d'une médaille en chocolat."], en: ["First patrol: three hours staking out a suspicious bush. It was a hedgehog. Gerald still cited it for disturbing the peace.", "I signed up. We patrolled {w:weather} all night. We stopped a teenager skateboarding and, by mistake, the mailman. Gerald awarded me a chocolate medal."] }, fx: { happy: 4, karma: 3, flag: 'p2_watch', schedule: { key: 'p2_watch_bust', years: 1 } }, mood: 'proud' },
      { label: { fr: 'Refuser', en: 'Decline' }, text: { fr: ["J'ai refusé. Gérard a noté mon refus dans son carnet. Depuis, il surveille surtout ma maison. Aux jumelles. Depuis sa cuisine.", "J'ai dit non poliment. Gérard a plissé les yeux et répondu « Intéressant. » Le lendemain, ma photo était sur son tableau de suspects, entre le chat du voisin et un livreur."], en: ["I declined. Gerald wrote it in his notebook. Since then, he mostly watches my house. With binoculars. From his kitchen.", "I politely said no. Gerald narrowed his eyes and said 'Interesting.' The next day, my photo was on his suspect board, between the neighbor's cat and a delivery guy."] }, fx: { stress: 4 } },
      { label: { fr: 'Monter un comité rival', en: 'Start a rival watch' }, text: { fr: ["J'ai monté un comité rival, plus jeune, plus cool, en trottinettes. Guerre des comités. Gérard m'accuse d'être le voleur de nain. Le quartier est coupé en deux.", "J'ai fondé ma propre milice de quartier, avec des t-shirts et un logo représentant {w:animal}. On a plus de membres que Gérard. Il a appelé la vraie police pour nous signaler. Ils ont ri."], en: ["I started a rival watch, younger, cooler, on scooters. Watch war. Gerald accuses me of being the gnome thief. The neighborhood is split in two.", "I founded my own neighborhood watch, with T-shirts and a logo featuring {w:animal}. We have more members than Gerald. He called the real police to report us. They laughed."] }, fx: { happy: 6, karma: -1 }, mood: 'party' },
    ],
  },
  {
    id: 'p2_watch_bust', icon: '🕵️', cat: 'crime', rating: 1, chainOnly: true, when: { flag: 'p2_watch', prison: false },
    scene: { place: 'park', mood: 'shock' },
    text: {
      fr: [
        "Patrouille de nuit avec Gérard. Dans le jardin du maire, une silhouette cagoulée creuse un trou à la lampe frontale. Gérard sort ses menottes de 1987. « C'est le moment, {first}. »",
        "Ton talkie-walkie grésille : « Ici Aigle Moustachu. Mouvement suspect derrière la boulangerie. » Une silhouette charge des sacs dans une camionnette. Ça sent la farine et le crime.",
      ],
      en: [
        "Night patrol with Gerald. In the mayor's garden, a hooded figure is digging a hole by headlamp. Gerald pulls out his 1987 handcuffs. “This is it, {first}.”",
        "Your walkie-talkie crackles: “This is Mustached Eagle. Suspicious movement behind the bakery.” A figure is loading bags into a van. It smells of flour and crime.",
      ],
    },
    choices: [
      { label: { fr: 'Plaquer le suspect', en: 'Tackle the suspect' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "Plaquage parfait. Un vrai cambrioleur, recherché dans trois régions. Une du journal local : « LE HÉROS EN PYJAMA ». Gérard a pleuré de fierté.", en: 'Perfect tackle. A real burglar, wanted in three counties. Local front page: “THE HERO IN PAJAMAS.” Gerald wept with pride.' }, fx: { fame: 5, karma: 6, happy: 10, followers: 1000, unflag: 'p2_watch' }, mood: 'proud' },
        { w: 1, text: { fr: "Plaquage parfait. C'était le maire, qui enterrait son hamster en secret. Il a porté plainte. Gérard a juré ne pas me connaître.", en: 'Perfect tackle. It was the mayor, secretly burying his hamster. He pressed charges. Gerald swore he\'d never met me.' }, fx: { money: -1000, heat: 10, happy: -6, unflag: 'p2_watch' }, mood: 'shock' },
      ] },
      { label: { fr: 'Appeler la vraie police', en: 'Call the real police' }, text: { fr: "Ils sont arrivés 40 minutes plus tard, le suspect avait fini. Ils ont verbalisé Gérard pour port de menottes non homologuées.", en: 'They arrived 40 minutes later; the suspect was long done. They fined Gerald for carrying unapproved handcuffs.' }, fx: { karma: 2, unflag: 'p2_watch' } },
      { label: { fr: 'Quitter le comité', en: 'Quit the watch' }, text: { fr: "J'ai rendu mon gilet fluo. Gérard m'a salué{|e} comme un soldat qui déserte. Je dors enfin la nuit.", en: 'I handed back my hi-vis vest. Gerald saluted me like a deserter. I finally sleep at night.' }, fx: { stress: -5, unflag: 'p2_watch' } },
    ],
  },
  {
    id: 'p2_police_satire', icon: '👮', cat: 'crime', rating: 1, cooldown: 8, when: { age: [16, 120] },
    scene: { place: 'park', mood: 'shock', fx: 'police' },
    text: {
      fr: [
        "Tu traverses hors du passage piéton. Quatorze policiers, deux voitures, une moto et un hélicoptère surgissent. Plaquage. Un agent lit tes droits au mégaphone. Un autre te tase « préventivement ».",
        "Contrôle pour un feu arrière cassé. Le policier pointe sa lampe sur toi, puis son arme, puis appelle des renforts, puis une unité d'élite. Tu as un hamster sur le siège passager. Il a l'air coupable.",
        "Tu as jeté un ticket de métro par terre. En [[trente secondes|une minute|dix secondes]], la rue est bouclée : chiens, drone, négociateur. Un agent hurle « {w:exclaim} » et un autre te plaque {w:at_place}.",
        "Contrôle routier. Le policier trouve {w:object} sur ta banquette arrière et appelle aussitôt la brigade antiterroriste. Trois camions, un robot démineur. Tu tentes de te justifier : c'est là {w:excuse}.",
        "Tu as klaxonné un peu fort. Une voiture de police te prend en chasse, sirènes hurlantes, suivie par {w:vehicle} de la gendarmerie. Un hélicoptère te suit {w:weather}. Tu roulais à 30.",
      ],
      en: [
        "You jaywalk. Fourteen officers, two cars, a motorcycle and a helicopter appear. Tackle. One cop reads your rights through a megaphone. Another tases you “preventively.”",
        "Pulled over for a broken taillight. The cop points his flashlight at you, then his gun, then calls backup, then SWAT. There's a hamster on your passenger seat. It looks guilty.",
        "You dropped a subway ticket on the ground. Within [[thirty seconds|a minute|ten seconds]], the street is sealed off: dogs, drone, negotiator. One cop yells '{w:exclaim}' and another tackles you {w:at_place}.",
        "Traffic stop. The cop finds {w:object} on your back seat and immediately calls the bomb squad. Three trucks, a bomb-disposal robot. You try to explain: it's there {w:excuse}.",
        "You honked a little loudly. A police car gives chase, sirens blaring, followed by {w:vehicle} from the state troopers. A helicopter tails you {w:weather}. You were going 20 mph.",
      ],
    },
    choices: [
      { label: { fr: 'Ne plus bouger', en: 'Freeze completely' }, text: { fr: ["Immobile, mains bien visibles. Ils m'ont quand même gazé{|e} au poivre, « par habitude ». Puis ils m'ont demandé une note sur 5 pour l'intervention. J'ai mis 4, par peur.", "Je n'ai plus bougé un cil. Ils m'ont relâché{|e} au bout de [[trois|cinq|huit]] heures avec une amende pour « immobilité suspecte ». J'ai payé. On ne discute pas avec un hélicoptère."], en: ["Perfectly still, hands visible. They pepper-sprayed me anyway, “out of habit.” Then they asked me to rate the intervention out of 5. I gave 4, out of fear.", "I didn't move a muscle. They released me after [[three|five|eight]] hours with a fine for 'suspicious stillness'. I paid. You don't argue with a helicopter."] }, fx: { health: -6, happy: -6, stress: 10 }, mood: 'cry' },
      { label: { fr: 'Demander son matricule', en: 'Ask for his badge number' }, out: [
        { w: 1, text: { fr: ["Il a paniqué et s'est tasé lui-même. Il a dansé sur le bitume en faisant des bruits de modem. Ses collègues ont dû choisir entre m'arrêter et l'aider. Ils ont choisi la pause café.", "J'ai demandé son matricule. Il a fouillé ses poches, n'a rien trouvé et a appelé son chef. Le chef non plus ne le connaissait pas. Ils sont repartis, vexés. J'ai gagné par forfait."], en: ["He panicked and tased himself. He danced on the asphalt making dial-up modem noises. His colleagues had to choose between arresting me and helping him. They chose a coffee break.", "I asked for his badge number. He searched his pockets, found nothing and called his boss. The boss didn't know it either. They left, offended. I won by forfeit."] }, fx: { happy: 8, heat: 5 }, mood: 'party' },
        { w: 1, text: { fr: ["Il me l'a écrit sur le front au feutre indélébile. Puis il m'a verbalisé{|e} pour « tatouage non déclaré ».", "Il m'a donné son matricule… puis m'a embarqué{|e} pour « outrage par curiosité ». J'ai passé la nuit au poste à côté d'un type arrêté pour {w:crime_small}."], en: ["He wrote it on my forehead in permanent marker. Then he fined me for an “undeclared tattoo.”", "He gave me his badge number… then hauled me in for 'contempt by curiosity'. I spent the night at the station next to a guy arrested for {w:crime_small}."] }, fx: { happy: -6, money: -135 }, mood: 'angry' },
      ] },
      { label: { fr: 'Porter plainte', en: 'File a complaint' }, text: { fr: ["Plainte à la police des polices. Le dossier a été instruit par le cousin de l'agent. Conclusion : « L'usage de l'hélicoptère était proportionné. » J'ai reçu une facture pour le kérosène.", "J'ai porté plainte. Six mois plus tard, j'ai reçu une lettre : « Après enquête, l'agent a été promu. » Il y avait une photo de lui, souriant, avec {w:animal}. Je ne sais pas pourquoi."], en: ["Complaint to Internal Affairs. The case was handled by the officer's cousin. Conclusion: “Helicopter use was proportionate.” I got a bill for the jet fuel.", "I filed a complaint. Six months later, I got a letter: 'Following investigation, the officer has been promoted.' Enclosed: a photo of him smiling with {w:animal}. I don't know why."] }, fx: { money: -200, happy: -5, karma: 2 } },
    ],
  },
  {
    id: 'p2_protest_charge', icon: '🪧', cat: 'crime', rating: 2, cooldown: 8, when: { age: [16, 120] },
    scene: { place: 'park', mood: 'angry', fx: 'police' },
    text: {
      fr: [
        "Tu manifestes pacifiquement contre la hausse du prix de la baguette. Soudain, les CRS chargent. Lacrymos, matraques, un canon à eau qui fait voler une mamie comme une feuille morte. Un flic fonce droit sur toi.",
        "Manif contre la fermeture de la piscine municipale. Ambiance kermesse, jusqu'à la charge d'une rangée de robocops. Une grenade explose à côté du stand de crêpes. Il pleut des crêpes.",
      ],
      en: [
        "You're peacefully protesting the price of bread. Suddenly, riot police charge. Tear gas, batons, a water cannon sending a granny flying like a dead leaf. A cop is running straight at you.",
        "Protest against closing the public pool. Fun-fair vibes, until a line of robocops charges. A flash grenade goes off next to the crêpe stand. It's raining crêpes.",
      ],
    },
    choices: [
      { label: { fr: 'Courir', en: 'Run' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: "Slalom entre poubelles en feu et crêpes volantes, saut de barrière, une chaussure perdue, un bar ouvert. J'ai bu une bière avec un CRS en pause. Il était gentil.", en: 'Slalom through burning trash cans and flying crêpes, hurdle a barrier, lose a shoe, find an open bar. I had a beer with an off-duty riot cop. He was nice.' }, fx: { athletic: 3, happy: 5 }, mood: 'proud' },
        { w: 1, text: { fr: "Une balle en caoutchouc m'a atteint{|e} en pleine fesse. Elle a fait « TOC ». Ma fesse est violette, en forme d'écusson officiel, et je ne m'assois plus.", en: 'A rubber bullet hit me square in the butt. It went “THOCK.” My butt cheek is purple, shaped like an official crest, and I no longer sit.' }, fx: { health: -12, visual: 'gore' }, mood: 'cry' },
      ] },
      { label: { fr: 'Mains en l\'air', en: 'Hands up' }, text: { fr: "Mains en l'air, j'ai crié « PACIFIQUE ! ». Il m'a matraqué{|e} quand même. Sur le crâne. Ça a fait « BONG », comme dans les dessins animés. J'ai vu des petits oiseaux. Puis le fourgon.", en: 'Hands up, I yelled “PEACEFUL!” He clubbed me anyway. On the skull. It went “BONG,” like in cartoons. I saw little birdies. Then the paddy wagon.' }, fx: { health: -14, heat: 10, disease: 'concussion', visual: 'gore' }, mood: 'cry' },
      { label: { fr: 'Lui lancer une crêpe', en: 'Throw a crêpe at him' }, out: [
        { w: 1, text: { fr: "Crêpe à la pâte à tartiner en pleine visière. Il a glissé, ses collègues l'ont piétiné, j'ai disparu dans la foule. Je suis une légende locale : « la Crêpe Masquée ».", en: 'A chocolate-spread crêpe right on the visor. He slipped, his buddies trampled him, I vanished into the crowd. I\'m a local legend: “the Masked Crêpe.”' }, fx: { happy: 10, heat: 15, fame: 2 }, mood: 'party' },
        { w: 1, text: { fr: "Ma crêpe a atterri sur le commissaire. Il l'a mangée, lentement, puis m'a fait arrêter pour « agression pâtissière ».", en: 'My crêpe landed on the commander. He ate it, slowly, then had me arrested for “pastry assault.”' }, fx: { arrest: 'vandal', visual: 'police' }, mood: 'shock' },
      ] },
    ],
  },
  {
    id: 'p2_pickpocket_abroad', icon: '🧳', cat: 'crime', cooldown: 8, when: { age: [16, 120] },
    scene: { place: 'park', mood: 'shock' },
    text: {
      fr: [
        "En vacances à Rome, devant une fontaine, un mime fait semblant d'être coincé dans une boîte invisible. Tu ris. Pendant ce temps, son collègue, mime aussi, mime « prendre ton portefeuille ». Il ne mime pas.",
        "En vacances à Barcelone, un charmant inconnu t'aide à essuyer une fiente de pigeon sur ton épaule. Adorable. Il a aussi ton téléphone, ta carte bancaire et ta montre. Le pigeon était complice.",
        "En vacances {w:far_place}, une dame âgée te demande de l'aider à porter {w:object}. Tu acceptes. Quand tu le reposes, ton portefeuille a disparu. La dame aussi. Elle court très vite pour son âge.",
        "Visite touristique {w:weather}. Un groupe d'enfants t'entoure pour te vendre des bracelets. Trente secondes plus tard, ils sont partis avec ton téléphone, ta montre et [[ton passeport|tes lunettes|ta dignité]]. Il te reste un bracelet.",
        "En vacances, un type qui affirme être {w:celeb} te propose une photo souvenir. Pendant que tu souris, son complice te soulage de ton portefeuille. La photo est ratée en plus.",
      ],
      en: [
        "On vacation in Rome, by a fountain, a mime pretends to be stuck in an invisible box. You laugh. Meanwhile his colleague, also a mime, mimes “taking your wallet.” He isn't miming.",
        "On vacation in Barcelona, a charming stranger helps wipe pigeon poop off your shoulder. Adorable. He also has your phone, your bank card and your watch. The pigeon was in on it.",
        "On vacation {w:far_place}, an old lady asks you to help carry {w:object}. You agree. When you put it down, your wallet is gone. So is the lady. She runs very fast for her age.",
        "Sightseeing {w:weather}. A group of kids surrounds you to sell you bracelets. Thirty seconds later, they're gone with your phone, your watch and [[your passport|your glasses|your dignity]]. You still have a bracelet.",
        "On vacation, a guy claiming to be {w:celeb} offers you a souvenir photo. While you smile, his partner relieves you of your wallet. The photo's blurry too.",
      ],
    },
    choices: [
      { label: { fr: 'Le poursuivre', en: 'Chase him' }, out: [
        { w: 1, odds: { athletic: 1 }, text: { fr: ["800 mètres de ruelles. Il s'est arrêté, essoufflé, et m'a rendu mes affaires en m'applaudissant. On a pris un café. Il m'a appris trois insultes locales.", "Je l'ai coursé à travers un marché, en sautant par-dessus {w:food} et une poussette. Il a abandonné, m'a rendu mon portefeuille et m'a serré la main. « Respect. »"], en: ["Half a mile of alleys. He stopped, out of breath, and handed my stuff back with a little round of applause. We had coffee. He taught me three local swear words.", "I chased him through a market, hurdling {w:food} and a stroller. He gave up, returned my wallet and shook my hand. 'Respect.'"] }, fx: { happy: 8, athletic: 3 }, mood: 'happy' },
        { w: 1, text: { fr: ["J'ai glissé sur un carton de pizza et percuté un vendeur de perches à selfie. Quarante perches par terre. On m'a fait payer les perches.", "J'ai couru trois rues avant de me retrouver nez à nez avec {w:animal}. On s'est regardés. J'ai fait demi-tour. Le voleur avait disparu depuis longtemps."], en: ["I slipped on a pizza box and crashed into a selfie-stick vendor. Forty sticks on the ground. They made me pay for the sticks.", "I ran three blocks before coming face to face with {w:animal}. We stared at each other. I turned back. The thief was long gone."] }, fx: { money: -300, health: -4 }, mood: 'angry' },
      ] },
      { label: { fr: 'Aller à la police', en: 'Go to the police' }, text: { fr: ["Un policier très élégant a rempli un formulaire de six pages, m'a conseillé de « faire plus attention la prochaine fois », puis recommandé un restaurant. Le restaurant était excellent.", "Au commissariat, on m'a fait patienter [[deux|trois|quatre]] heures avec d'autres touristes volés. On a fondé un groupe de soutien. On s'écrit encore."], en: ["A very elegant officer filled out a six-page form, advised me to “be more careful next time,” then recommended a restaurant. The restaurant was excellent.", "At the police station, they made me wait [[two|three|four]] hours with other robbed tourists. We founded a support group. We still write to each other."] }, fx: { money: -400, happy: -2 } },
      { label: { fr: 'Mimer mon désespoir', en: 'Mime my despair' }, text: { fr: ["À genoux, bras au ciel, j'ai mimé mon désespoir devant les touristes. Pluie de pièces. J'ai fini par gagner plus que ce qu'on m'avait volé. J'envisage une reconversion.", "J'ai mimé un homme qui a tout perdu, avec une intensité dramatique rare. Les mimes du coin m'ont proposé de rejoindre leur troupe. Le voleur faisait partie de la troupe."], en: ["On my knees, arms to the sky, I mimed my despair for the tourists. A shower of coins. I ended up making more than I lost. Considering a career change.", "I mimed a person who'd lost everything, with rare dramatic intensity. The local mimes offered me a spot in their troupe. The thief was in the troupe."] }, fx: { money: 200, happy: 6 }, mood: 'party' },
    ],
  },
  {
    id: 'p2_granny_mugger', icon: '👵', cat: 'crime', rating: 2, cooldown: 10, when: { age: [16, 120] },
    scene: { place: 'park', mood: 'shock' },
    text: {
      fr: [
        "Une adorable mamie à déambulateur te demande l'heure. Puis elle sort une bombe lacrymo de son sac à tricot : « Le portefeuille, mon chou. Et tes lunettes de soleil, elles sont jolies. »",
        "Au parc, une petite vieille en imperméable te barre la route avec sa canne : « Tu donnes tout, ou je te fais ce que j'ai fait à mon troisième mari. » Elle a le regard de quelqu'un qui a enterré des gens.",
      ],
      en: [
        "A sweet granny with a walker asks you the time. Then she pulls pepper spray out of her knitting bag: “Wallet, sweetie. And those sunglasses, they're cute.”",
        "In the park, a tiny old lady in a raincoat blocks your path with her cane: “Hand it all over, or I do to you what I did to my third husband.” She has the eyes of someone who has buried people.",
      ],
    },
    choices: [
      { label: { fr: 'Tout donner', en: 'Hand it over' }, text: { fr: "Elle a compté les billets avec un doigt mouillé, m'a pincé la joue — « tu es un bon petit » — puis a disparu à 30 km/h sur son déambulateur.", en: 'She counted the bills with a licked finger, pinched my cheek — “good kid” — and vanished at 20 mph on her walker.' }, fx: { money: -300, happy: -6 }, mood: 'sad' },
      { label: { fr: 'Résister', en: 'Resist' }, out: [
        { w: 1, text: { fr: "Gazé{|e} en pleine face, puis frappé{|e} aux tibias à coups de canne jusqu'à entendre mes os chanter. Elle est partie avec mes chaussures. Je n'en parlerai à personne.", en: 'Pepper-sprayed in the face, then caned in the shins until I heard my bones sing. She left with my shoes. I will tell no one.' }, fx: { health: -15, money: -300, visual: 'gore' }, mood: 'cry' },
        { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai esquivé, elle s'est gazée elle-même. Elle a juré comme un docker en pleurant. Police : 94 ans, 37 condamnations. On l'appelle « Mamie Braquage ».", en: 'I dodged and she pepper-sprayed herself. She swore like a sailor, crying. Police: 94 years old, 37 convictions. They call her “Grandma Heist.”' }, fx: { karma: 3, happy: 6 }, mood: 'proud' },
      ] },
      { label: { fr: 'Lui offrir un thé', en: 'Offer her tea' }, text: { fr: "Elle a accepté. Elle m'a raconté sa vie : trois braquages, deux évasions, un mari mystérieusement disparu. Elle m'a quand même pris mon portefeuille à la fin. Par principe.", en: 'She accepted. She told me her life story: three robberies, two prison breaks, one mysteriously missing husband. She still took my wallet at the end. On principle.' }, fx: { money: -150, happy: 6, smarts: 2 }, mood: 'happy' },
    ],
  },
  {
    id: 'p2_scam_call', icon: '📞', cat: 'crime', cooldown: 6, when: { age: [18, 120] },
    scene: { place: 'home', mood: 'neutral' },
    text: {
      fr: [
        "Un numéro inconnu : « Bonjour, ici le commissaire Dupont. Votre neveu est en garde à vue. Pour le libérer, achetez 2 000 euros de cartes cadeaux. » Tu n'as pas de neveu.",
        "Appel d'un « agent fédéral » à l'accent incertain : ton numéro de sécurité sociale a été « utilisé dans un trafic de flamants roses ». Pour régler ça, il lui faut tes codes bancaires. Tout de suite.",
        "Appel {w:time} : « Bonjour, ici les impôts. Vous devez une amende pour {w:crime_small}. Payez en cartes cadeaux {w:brand} ou la police arrive. » En fond, on entend {w:sound}.",
        "Un SMS : « Félicitations, vous avez gagné {w:vehicle} ! Pour le recevoir, payez [[49|99|199]] euros de frais de port. » Le numéro commence par +999. Ça n'existe pas, +999.",
        "Un « avocat » t'appelle : un riche oncle mort {w:far_place} t'a légué une fortune. Il suffit d'avancer les frais de dossier. Tu n'as jamais eu d'oncle là-bas. Il insiste : « Si, si. »",
      ],
      en: [
        "Unknown number: “Hello, this is Police Chief Johnson. Your nephew is in custody. To release him, buy $2,000 in gift cards.” You don't have a nephew.",
        "A call from a “federal agent” with an uncertain accent: your social security number was “used in a flamingo trafficking ring.” To fix it, he needs your bank codes. Right now.",
        "A call {w:time}: 'Hello, this is the tax office. You owe a fine for {w:crime_small}. Pay in {w:brand} gift cards or the police are coming.' In the background, you hear {w:sound}.",
        "A text: 'Congratulations, you've won {w:vehicle}! To receive it, pay [[49|99|199]] dollars in shipping.' The number starts with +999. There's no such thing as +999.",
        "A 'lawyer' calls: a rich uncle who died {w:far_place} left you a fortune. You just need to cover the paperwork fees. You've never had an uncle there. He insists: 'Oh yes you do.'",
      ],
    },
    choices: [
      { label: { fr: 'Le faire tourner en bourrique', en: 'Waste his time' }, text: { fr: ["Je l'ai fait patienter 47 minutes, épeler chaque mot, puis j'ai exigé de parler à son supérieur. Il a raccroché en pleurant. Le pouvoir.", "Je me suis fait passer pour un{|e} retraité{|e} sourd{|e} et je lui ai fait répéter [[vingt|trente|cinquante]] fois son numéro de badge. Il a fini par m'insulter en trois langues et raccrocher. Il me rappelle parfois. Pour parler."], en: ["I kept him on hold for 47 minutes, made him spell every word, then demanded his supervisor. He hung up crying. Power.", "I pretended to be a deaf retiree and made him repeat his badge number [[twenty|thirty|fifty]] times. He ended up cursing me in three languages and hanging up. He calls back sometimes. Just to talk."] }, fx: { happy: 8, smarts: 2 }, mood: 'party' },
      { label: { fr: 'Obéir', en: 'Do as he says' }, text: { fr: ["J'ai acheté les cartes cadeaux. Je ne sais pas pourquoi. Il avait une voix rassurante. J'ai perdu de l'argent et un peu de respect pour moi-même.", "J'ai obéi. J'ai lu les codes des cartes cadeaux à voix haute dans le magasin. La caissière a essayé de m'arrêter avec des grands gestes. Je pensais qu'elle me faisait coucou."], en: ["I bought the gift cards. I don't know why. He had a soothing voice. I lost money and a bit of self-respect.", "I complied. I read the gift card codes out loud in the store. The cashier tried to stop me with big hand signals. I thought she was waving hello."] }, fx: { money: -800, happy: -10 }, mood: 'cry' },
      { label: { fr: "Signaler l'arnaque", en: 'Report the scam' }, text: { fr: ["J'ai signalé le numéro à la vraie police. Ils ont 40 000 signalements cette semaine. Le standardiste m'a proposé une carte cadeau pour patienter. J'ai un doute.", "J'ai signalé l'arnaque. Un mois plus tard, un policier m'a rappelé pour me remercier… et m'a demandé mes coordonnées bancaires « pour la récompense ». J'ai raccroché. Je ne fais plus confiance à personne."], en: ["I reported the number to the real police. They have 40,000 reports this week. The operator offered me a gift card while I waited. I have doubts.", "I reported the scam. A month later, a cop called to thank me… and asked for my bank details 'for the reward'. I hung up. I trust no one now."] }, fx: { karma: 3, stress: 3 } },
    ],
  },
  {
    id: 'p2_car_poop', icon: '🚗', cat: 'crime', rating: 2, cooldown: 10, when: { age: [18, 120], asset: 'car' },
    scene: { place: 'home', mood: 'sick', fx: 'poop' },
    text: {
      fr: [
        "Quelqu'un a forcé ta voiture cette nuit. Il n'a rien volé. Il a juste laissé un « cadeau » bien moulé sur le siège conducteur, avec un mot : « Pour le stationnement en double file. »",
        "Ta voiture a été fracturée. L'autoradio a disparu, mais le voleur a laissé ses chaussettes, une banane entamée et, sur la banquette arrière, la preuve organique qu'il a passé un mauvais moment.",
      ],
      en: [
        "Someone broke into your car last night. Nothing stolen. They just left a nicely shaped “gift” on the driver's seat with a note: “For the double parking.”",
        "Your car got broken into. The stereo's gone, but the thief left his socks, a half-eaten banana and, on the back seat, organic proof that he was having a bad day.",
      ],
    },
    choices: [
      { label: { fr: 'Appeler la police', en: 'Call the police' }, text: { fr: "Le technicien de la scientifique a prélevé un échantillon, l'a regardé longtemps, puis a dit : « Il a mangé des asperges. » L'enquête n'a jamais avancé. L'odeur, si.", en: 'The forensic tech took a sample, studied it for a long time, then said: “He ate asparagus.” The investigation never progressed. The smell did.' }, fx: { happy: -6 }, mood: 'sick' },
      { label: { fr: 'Mener l\'enquête', en: 'Investigate' }, text: { fr: "Gants, lampe torche, loupe. J'ai identifié le coupable grâce au maïs. C'était le voisin du dessus. Je lui ai rendu la pareille dans sa boîte aux lettres. Équilibre cosmique rétabli.", en: 'Gloves, flashlight, magnifying glass. I identified the culprit by the corn. It was the upstairs neighbor. I returned the favor in his mailbox. Cosmic balance restored.' }, fx: { happy: 8, karma: -3, visual: 'poop' }, mood: 'proud' },
      { label: { fr: 'Vendre la voiture', en: 'Sell the car' }, text: { fr: "Vendue telle quelle, « avec option parfum ». L'acheteur n'a rien remarqué avant de signer. Je lui ai laissé un sapin désodorisant. Je ne suis pas un monstre.", en: 'Sold as is, “scent package included.” The buyer noticed nothing until after signing. I left him a pine air freshener. I\'m not a monster.' }, fx: { money: 2000, karma: -2, loseAsset: 'car' } },
    ],
  },
  {
    id: 'p2_briefcase_hand', icon: '💼', cat: 'crime', rating: 2, once: true, when: { age: [18, 120] }, vars: { amount: [20000, 120000] },
    scene: { place: 'park', mood: 'shock', fx: 'gore' },
    text: {
      fr: [
        "Au parc, sous un banc, tu trouves une mallette en cuir. Elle est encore menottée à une main. Juste une main. Chevalière à tête d'aigle, ongles impeccablement manucurés.",
        "En te promenant le long du canal, tu repêches une mallette. Une main coupée y est toujours menottée, comme un porte-clés géant et très mort. La mallette, elle, est pleine.",
      ],
      en: [
        "In the park, under a bench, you find a leather briefcase. It's still handcuffed to a hand. Just a hand. Eagle signet ring, flawless manicure.",
        "Walking along the canal, you fish out a briefcase. A severed hand is still cuffed to it, like a giant, very dead keychain. The briefcase is full.",
      ],
    },
    choices: [
      { label: { fr: 'Garder la mallette', en: 'Keep the briefcase' }, text: { fr: "J'ai scié la menotte avec une lime à ongles en pleurant, et compté {$amount} en billets. Depuis, une berline noire tourne autour de mon immeuble. Le conducteur n'a qu'une main.", en: 'I sawed through the cuff with a nail file, sobbing, and counted {$amount} in cash. Since then a black sedan circles my building. The driver has only one hand.' }, fx: { money: 'amount', heat: 25, karma: -8, visual: 'money' }, mood: 'shock' },
      { label: { fr: 'Appeler la police', en: 'Call the police' }, text: { fr: "Ils ont pris la main, la mallette, ma déposition et mon sandwich. On ne m'a jamais rien dit. Le lendemain, un agent m'a fait un clin d'œil. Il portait une montre neuve.", en: 'They took the hand, the briefcase, my statement and my sandwich. Nobody ever told me anything. The next day an officer winked at me. He was wearing a new watch.' }, fx: { karma: 5 } },
      { label: { fr: 'Enterrer la main', en: 'Bury the hand' }, text: { fr: "J'ai enterré la main dans le parc, petite croix et discours compris. J'ai gardé la mallette, par respect pour le défunt. Une main sous terre, {$amount} sur mon compte.", en: 'I buried the hand in the park, little cross and eulogy included. I kept the briefcase, out of respect for the deceased. One hand underground, {$amount} in my account.' }, fx: { money: 'amount', heat: 15, karma: -3, visual: 'money' }, mood: 'sad' },
    ],
  },
  {
    id: 'p2_truecrime_neighbour', icon: '🔍', cat: 'crime', rating: 1, cooldown: 10, when: { age: [16, 120] }, actor: ADULT_ANY,
    scene: { place: 'apartment', mood: 'shock' },
    text: {
      fr: [
        "Après 40 épisodes de podcasts criminels, tu es persuadé{|e} que ton voisin{a:|e} {a.first} est un tueur en série : sacs poubelle lourds la nuit, odeurs étranges, et {a:il|elle} sifflote tout le temps la même comptine.",
        "{a.first}, ton voisin{a:|e}, achète beaucoup trop de javel, de bâches et de chaux. Tu as vu tous les documentaires. Tu sais ce que ça veut dire.",
        "Ton voisin{a:|e} {a.first} sort {w:time} avec une pelle et un grand sac. Son garage dégage {w:smell}. Tu as écouté [[cinquante|cent|deux cents]] épisodes de podcasts criminels. Tout concorde.",
        "{a.first}, ton voisin{a:|e}, a été vu{a:|e} en train d'enterrer {w:object} dans son jardin à minuit. Le lendemain, {w:animal} du quartier a disparu. Tu as commencé un tableau en liège.",
        "Depuis que tu écoutes des podcasts criminels, tout chez {a.first} te paraît louche : les rideaux toujours fermés, {w:sound} la nuit, et sa « passion » pour {w:hobby}. Ça cache forcément quelque chose.",
      ],
      en: [
        "After 40 true-crime podcast episodes, you're convinced your neighbor {a.first} is a serial killer: heavy trash bags at night, strange smells, and {a:he|she} constantly whistles the same nursery rhyme.",
        "{a.first}, your neighbor, buys way too much bleach, tarp and quicklime. You've seen every documentary. You know what that means.",
        "Your neighbor {a.first} goes out {w:time} with a shovel and a big bag. {a:His|Her} garage gives off {w:smell}. You've listened to [[fifty|a hundred|two hundred]] true-crime episodes. It all adds up.",
        "{a.first}, your neighbor, was seen burying {w:object} in the yard at midnight. The next day, the neighborhood's {w:animal} vanished. You've started a corkboard.",
        "Ever since you got into true-crime podcasts, everything about {a.first} seems shady: curtains always closed, {w:sound} at night, and that 'passion' for {w:hobby}. It's definitely hiding something.",
      ],
    },
    choices: [
      { label: { fr: 'Enquêter en secret', en: 'Investigate secretly' }, out: [
        { w: 2, text: { fr: ["J'ai fouillé ses poubelles à 3 h du matin. Résultat : {a.first} fait de la taxidermie de pigeons et des confitures. {a:Il|Elle} m'a surpris{|e} la tête dans la poubelle et m'a offert un pot de figues. Je n'en suis pas {fier|fière}.", "J'ai espionné {a.first} pendant [[deux semaines|un mois|trois mois]]. Les sacs lourds, c'était du terreau. La javel, pour la piscine. La comptine, c'était pour son perroquet. Je suis la seule personne bizarre de la rue."], en: ["I went through the trash at 3 a.m. Result: {a.first} does pigeon taxidermy and makes jam. {a:He|She} caught me head-first in the bin and gave me a jar of fig jam. I'm not proud.", "I spied on {a.first} for [[two weeks|a month|three months]]. The heavy bags were potting soil. The bleach, for the pool. The nursery rhyme was for the parrot. I'm the only weirdo on the street."] }, fx: { karma: -2, happy: -3, rel: 5 }, mood: 'shock' },
        { w: 1, text: { fr: ["J'avais à moitié raison : {a.first} ne tue personne, mais écoule des faux sacs de luxe depuis sa cave. Arrêté{a:|e}. J'ai eu droit à une interview au journal télé.", "J'ai fouillé son garage. Pas de cadavre, mais une distillerie clandestine qui produit {w:drink}. {a.first} m'a proposé un verre en échange de mon silence. C'était délicieux. Je me tais."], en: ["I was half right: {a.first} doesn't kill anyone, but sells fake designer bags out of the basement. Arrested. I got interviewed on the evening news.", "I searched the garage. No corpse, but an illegal still producing {w:drink}. {a.first} offered me a glass in exchange for my silence. It was delicious. My lips are sealed."] }, fx: { fame: 4, karma: 4, happy: 8, actorGone: true }, mood: 'proud' },
      ] },
      { label: { fr: 'Lui demander en face', en: 'Ask directly' }, text: { fr: ["« Vous êtes un tueur en série ? » {a.first} a ri, puis a arrêté de rire, puis m'a fixé{|e} dix secondes. « Non. Pourquoi ? » Je déménage.", "J'ai posé la question franchement. {a.first} a soupiré : « Encore ? Vous êtes [[le troisième|la cinquième personne|le dixième]] cette année. » Puis {a:il|elle} m'a offert un café. Je ne l'ai pas bu."], en: ["“Are you a serial killer?” {a.first} laughed, then stopped laughing, then stared at me for ten seconds. “No. Why?” I'm moving.", "I asked straight out. {a.first} sighed: 'Again? You're [[the third|the fifth person|the tenth]] this year.' Then {a:he|she} offered me a coffee. I didn't drink it."] }, fx: { stress: 10, happy: -2 }, mood: 'shock' },
      { label: { fr: 'Arrêter les podcasts', en: 'Quit the podcasts' }, text: { fr: ["J'écoute maintenant de la méditation guidée. {a.first} aussi, je l'entends à travers le mur. {a:Il|Elle} fait des « ommm » très inquiétants.", "J'ai arrêté les podcasts criminels et je me suis mis{|e} aux podcasts de cuisine. Maintenant, je suis persuadé{|e} que {a.first} prépare mal sa béchamel. C'est presque pire."], en: ["I listen to guided meditation now. So does {a.first}, I can hear it through the wall. {a:He|She} makes very unsettling “ommm” sounds.", "I quit true-crime podcasts and switched to cooking podcasts. Now I'm convinced {a.first} makes béchamel wrong. It's almost worse."] }, fx: { stress: -6, happy: 2 } },
    ],
  },
  {
    id: 'p2_bank_hostage', icon: '🏦', cat: 'crime', rating: 2, cooldown: 15, when: { age: [16, 120] }, vars: { amount: [3000, 15000] },
    scene: { place: 'office', mood: 'shock', fx: 'police' },
    text: {
      fr: [
        "Tu fais la queue à la banque quand quatre types en masques de lapin géant hurlent « TOUT LE MONDE À TERRE ! ». L'un tremble. Un autre mange une carotte. Tu es à plat ventre à côté du stylo enchaîné.",
        "Braquage dans ta banque ! Masques de licorne, fusils à pompe. Le chef réclame le code du coffre au caissier, qui fond en larmes. Tu es juste à côté, avec ton chèque de 12 balles.",
      ],
      en: [
        "You're in line at the bank when four guys in giant bunny masks scream “EVERYBODY DOWN!” One is shaking. Another is eating a carrot. You're face-down next to the chained pen.",
        "Bank robbery! Unicorn masks, shotguns. The leader demands the vault code from the teller, who bursts into tears. You're right there with your 12-dollar check.",
      ],
    },
    choices: [
      { label: { fr: 'Jouer les héros', en: 'Play hero' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai fauché le plus proche. Il est tombé sur son copain, qui est tombé sur le troisième, comme des dominos à oreilles. Le quatrième s'est rendu en pleurant. Je suis passé{|e} au JT.", en: 'I swept the nearest one\'s legs. He fell into his buddy, who fell into the third, like dominoes with ears. The fourth surrendered in tears. I made the evening news.' }, fx: { fame: 8, karma: 8, happy: 12, followers: 20000 }, mood: 'proud' },
        { w: 2, text: { fr: "Un coup de crosse. Mon nez a éclaté comme une tomate trop mûre et j'ai repeint le guichet en rouge. Les otages m'ont applaudi{|e} quand même. Par pitié.", en: 'One rifle-butt to the face. My nose burst like an overripe tomato and I repainted the counter red. The hostages applauded anyway. Out of pity.' }, fx: { health: -20, looks: -4, visual: 'gore' }, mood: 'cry' },
        { w: 1, rating: 2, text: { fr: "J'ai bondi en criant « BANZAÏ ». Une décharge de chevrotine m'a cueilli{|e} en plein vol. J'ai eu le temps de voir mes tripes décorer le présentoir à prospectus, puis plus rien.", en: 'I leapt yelling “BANZAI.” A shotgun blast caught me mid-air. I had time to watch my guts decorate the brochure rack, then nothing.' }, fx: { visual: 'gore', die: { fr: 'criblé{|e} de chevrotine en jouant les héros face à des braqueurs déguisés en lapins', en: 'full of buckshot after playing hero against bank robbers in bunny masks' } }, mood: 'cry' },
      ] },
      { label: { fr: 'Rester à terre', en: 'Stay down' }, text: { fr: "45 minutes à plat ventre. Les braqueurs sont partis avec la caisse. J'ai repris ma place dans la queue. Le guichet était fermé.", en: '45 minutes face-down. The robbers left with the cash. I got back in line. The counter was closed.' }, fx: { happy: -4, stress: 8 } },
      { label: { fr: 'Aider les braqueurs', en: 'Help the robbers' }, out: [
        { w: 1, text: { fr: "Ils m'ont donné un sac à remplir et une part. À la sortie, les flics m'ont pris{|e} pour un otage traumatisé. Je suis rentré{|e} avec {$amount} et une couverture de survie.", en: 'They handed me a bag to fill and a cut. Outside, the cops took me for a traumatized hostage. I went home with {$amount} and a foil blanket.' }, fx: { money: 'amount', karma: -10, heat: 30, visual: 'money' }, mood: 'party' },
        { w: 1, text: { fr: "Les flics sont entrés pile à ce moment-là. J'étais le seul sans masque, un sac de billets à la main. Le seul identifié, aussi.", en: 'The cops burst in right then. I was the only one without a mask, holding a bag of cash. The only one identified, too.' }, fx: { arrest: 'bank', visual: 'police' }, mood: 'shock' },
      ] },
      { label: { fr: 'Voler le stylo enchaîné', en: 'Steal the chained pen' }, text: { fr: "Dans la confusion, j'ai volé le stylo enchaîné. Personne n'y était jamais arrivé. J'ai le stylo et la chaîne. Le stylo ne marche pas.", en: 'In the chaos, I stole the chained pen. Nobody had ever managed it. I have the pen and the chain. The pen doesn\'t work.' }, fx: { happy: 6, karma: -1 }, mood: 'proud' },
    ],
  },
];
