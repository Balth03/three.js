// School events (ages 3–17): preschool, primary, middle & high school.
// All characters here are minors: zero sexual content. Rating 2 = gross-out / cartoon gore / crude mouths only.
import type { EventDef } from '@bl/sim';

const TEEN: ['middle', 'high'] = ['middle', 'high'];
const KID: ['primary'] = ['primary'];

export const schoolEvents: EventDef[] = [
  // ───────────────────────────── feed-only lines ─────────────────────────────
  {
    id: 'sc_auto_fingerpaint',
    icon: '🎨',
    cat: 'school',
    auto: true,
    once: true,
    when: { school: 'preschool' },
    text: {
      fr: ["J'ai peint « maman » à la gouache. Ma mère a demandé pourquoi elle avait six jambes. Ce sont des bras. Elle a beaucoup de travail.", "J'ai fait de la peinture avec les doigts. J'en ai mis sur la feuille, sur le mur, sur Lucas et un peu dans ma bouche. Le vert a un goût de vert.", "J'ai dessiné {w:animal} pour la fête des mères. La maîtresse a cru que c'était un nuage. Maman a cru que c'était elle.", "J'ai fait un collage avec des pâtes, de la colle et {w:object}. La maîtresse l'a accroché au mur, [[loin des autres|près de la sortie|à l'envers]].", "En arts plastiques, j'ai sculpté {w:food} en pâte à modeler. Lucas a croqué dedans. On a eu chacun une note : moi 18, lui une punition."],
      en: ["I finger-painted “Mommy.” Mom asked why she had six legs. They're arms. She has a lot of work to do.", "Finger painting day. Some went on the paper, some on the wall, some on Lucas and some in my mouth. Green tastes like green.", "I drew {w:animal} for Mother's Day. The teacher thought it was a cloud. Mom thought it was her.", "I made a collage with pasta, glue and {w:object}. The teacher hung it on the wall, [[far away from the others|near the exit|upside down]].", "In art class, I sculpted {w:food} out of play-dough. Lucas bit into it. We both got marks: me an A, him a time-out."],
    },
    fx: { happy: 3 },
  },
  {
    id: 'sc_auto_canteen',
    icon: '🍽️',
    cat: 'school',
    auto: true,
    cooldown: 3,
    when: { school: KID },
    text: {
      fr: ["À la cantine, il y avait du « poisson pané ». Personne n'a pu identifier le poisson. Ni le pané.", "J'ai échangé mon yaourt nature contre un Kinder et un secret. Le secret était nul. Le Kinder, non.", "La dame de la cantine m'a servi des épinards « parce que ça rend fort ». J'ai été fort{|e} : je les ai cachés dans ma serviette, puis dans {w:object}.", "À la cantine, on nous a servi {w:food}. Lucas a juré que ça avait bougé. Personne n'a mangé. Le chef l'a pris très personnellement.", "À la cantine, j'ai échangé mon dessert contre {w:object}. Ma mère veut savoir d'où ça vient. Je ne balance pas mes sources."],
      en: ["The cafeteria served “fish sticks.” Nobody could identify the fish. Or the stick.", "I traded my plain yogurt for a chocolate bar and a secret. The secret was lame. The chocolate wasn't.", "The lunch lady gave me spinach “to grow strong.” I was strong: I hid it all in my napkin, then in {w:object}.", "The cafeteria served {w:food}. Lucas swore it moved. Nobody ate. The chef took it very personally.", "At lunch, I traded my dessert for {w:object}. My mom wants to know where it came from. I don't reveal my sources."],
    },
    fx: { happy: 1 },
  },
  {
    id: 'sc_auto_eraser',
    icon: '🧽',
    cat: 'school',
    auto: true,
    cooldown: 3,
    when: { school: KID },
    text: {
      fr: ["J'ai acheté une gomme qui sent la fraise. Je l'ai mangée. Elle ne goûte pas la fraise.", "J'ai passé tout le cours de maths à construire une tour de taille-crayons. Elle a tenu jusqu'à la récré. Moi aussi, à peine.", "J'ai échangé ma gomme contre {w:object}. Le lendemain, j'ai fait une faute et je n'avais rien pour l'effacer. Ça m'apprendra.", "En cours, j'ai dessiné {w:animal} dans la marge de mon cahier. La maîtresse a demandé qui c'était. J'ai dit « vous ». Mauvaise réponse.", "Ma trousse dégage {w:smell} depuis lundi. Personne ne sait pourquoi. Moi, si. C'est le goûter de la semaine dernière."],
      en: ["I bought a strawberry-scented eraser. I ate it. It does not taste like strawberry.", "I spent all of math class building a tower of pencil sharpeners. It lasted until recess. So did I, barely.", "I traded my eraser for {w:object}. The next day, I made a mistake and had nothing to erase it with. Lesson learned.", "In class, I drew {w:animal} in the margin of my notebook. The teacher asked who it was. I said 'you'. Wrong answer.", "My pencil case has been giving off {w:smell} since Monday. Nobody knows why. I do. It's last week's snack."],
    },
    fx: { happy: 2, grade: -1 },
  },
  {
    id: 'sc_auto_maman',
    icon: '🙈',
    cat: 'school',
    auto: true,
    once: true,
    when: { school: KID },
    text: {
      fr: ["J'ai appelé la maîtresse « maman » devant toute la classe. On en parlera encore à mon mariage.", "J'ai levé la main et j'ai dit « Papa, je peux aller aux toilettes ? » au maître. Il a dit oui. Toute la classe a dit « Papaaaa ».", "J'ai appelé la maîtresse « {w:nickname} » sans faire exprès. C'est le nom du chat. Maintenant, toute la classe l'appelle comme ça.", "En pleine dictée, j'ai levé la main pour dire que j'avais vu {w:animal} dans le jardin ce matin. Aucun rapport. La maîtresse a noté « bavard{|e} ».", "Au spectacle de fin d'année, j'ai oublié mon texte et j'ai chanté {w:song} à la place. Les parents ont applaudi. La maîtresse, [[moins|beaucoup moins|pas du tout]]."],
      en: ["I called the teacher “Mommy” in front of the whole class. They'll bring it up at my wedding.", "I raised my hand and said “Dad, can I go to the bathroom?” to the teacher. He said yes. The whole class chanted “Daaaad.”", "I accidentally called the teacher '{w:nickname}'. It's the cat's name. Now the whole class calls her that.", "In the middle of dictation, I raised my hand to say I'd seen {w:animal} in the yard that morning. Totally unrelated. The teacher wrote 'chatterbox'.", "At the end-of-year show, I forgot my lines and sang {w:song} instead. The parents applauded. The teacher, [[less so|much less so|not at all]]."],
    },
    fx: { happy: -3 },
  },
  {
    id: 'sc_auto_swear',
    icon: '🤬',
    cat: 'school',
    auto: true,
    once: true,
    rating: 1,
    when: { age: [6, 9], school: KID },
    text: {
      fr: ["J'ai appris mon premier gros mot à la récré. Je l'ai testé au dîner, en demandant de passer « les putains de petits pois ». Privé{|e} de dessert, mais respecté{|e}.", "Un CM2 m'a appris un mot magique à la récré. Je l'ai dit à la maîtresse. Ce n'était pas un mot magique.", "J'ai appris un gros mot à la récré et je l'ai utilisé pour décrire {w:food} de la cantine. La dame de la cantine était d'accord, mais m'a quand même puni{|e}.", "J'ai traité {w:animal} de « connard » au parc. Maman m'a bouché la bouche. L'animal avait l'air vexé aussi.", "J'ai crié un gros mot en me cognant contre {w:object}. Papa a demandé « où est-ce que tu as appris ça ? ». J'ai montré Papa du doigt."],
      en: ["I learned my first swear word at recess. I tried it at dinner by asking for “the goddamn peas.” No dessert, but respect.", "A fifth-grader taught me a magic word at recess. I said it to the teacher. It was not a magic word.", "I learned a swear word at recess and used it to describe {w:food} at the cafeteria. The lunch lady agreed, but punished me anyway.", "I called {w:animal} an 'asshole' at the park. Mom covered my mouth. The animal looked offended too.", "I yelled a swear word when I bumped into {w:object}. Dad asked 'where did you learn that?'. I pointed at Dad."],
    },
    fx: { happy: 2, discipline: -2 },
  },
  {
    id: 'sc_auto_alarm',
    icon: '⏰',
    cat: 'school',
    auto: true,
    cooldown: 3,
    when: { school: TEEN },
    text: {
      fr: ["J'ai dormi pendant tout le cours de philo. J'ai rêvé que je comprenais Kant. Au réveil, plus rien.", "Mon réveil a sonné neuf fois. Je l'ai éteint neuf fois. Je suis arrivé{|e} au lycée pour la cantine, ce qui est un genre de ponctualité.", "J'ai raté le bus parce que je regardais {w:animal} sur le trottoir. Ça valait le coup. Le CPE n'était pas d'accord.", "Pendant le contrôle, il y a eu {w:sound} au fond de la classe. Tout le monde a ri. Moi aussi. Le prof m'a mis un zéro « par solidarité ».", "Je me suis endormi{|e} en cours et j'ai rêvé que je mangeais {w:food}. J'ai mâché mon stylo pour de vrai. Il n'avait [[pas du tout|vraiment pas|presque]] le même goût."],
      en: ["I slept through the whole philosophy class. I dreamed I understood Kant. When I woke up, it was gone.", "My alarm rang nine times. I turned it off nine times. I arrived at school just in time for lunch, which is a kind of punctuality.", "I missed the bus because I was watching {w:animal} on the sidewalk. Worth it. The principal disagreed.", "During the test, there was {w:sound} from the back of the class. Everyone laughed. So did I. The teacher gave me a zero 'for solidarity'.", "I fell asleep in class and dreamed I was eating {w:food}. I chewed my pen for real. It tasted [[nothing|absolutely nothing|almost]] like it."],
    },
    fx: { grade: -2, discipline: -1 },
  },
  {
    id: 'sc_auto_mic',
    icon: '🎙️',
    cat: 'school',
    auto: true,
    once: true,
    rating: 1,
    when: { school: TEEN, era: [2015, 2100] },
    text: {
      fr: [
        "Cours en visio : j'ai traité la prof d'espagnol de « vieille bique » en pensant que mon micro était coupé. Il ne l'était pas. Elle a dit « gracias ».",
        "En visio, j'ai lâché un « putain mais quelle chiotte ce cours » en croyant avoir coupé le son. Trente camarades et un proviseur adjoint m'ont entendu{|e}.",
      ],
      en: [
        "Online class: I called the Spanish teacher an “old goat” thinking my mic was muted. It wasn't. She said “gracias.”",
        "On a video call I said “this class is a goddamn sewer” thinking I was muted. Thirty classmates and a vice principal heard me.",
      ],
    },
    fx: { happy: -4, grade: -3, stress: 4 },
  },
  {
    id: 'sc_auto_gum',
    icon: '🫠',
    cat: 'school',
    auto: true,
    once: true,
    rating: 2,
    when: { school: ['primary', 'middle'] },
    text: {
      fr: [
        "J'ai trouvé un chewing-gum sous ma table. Je l'ai mâché. Il avait le goût de 1997 et de la bouche de quelqu'un d'autre.",
        "Paris tenu : j'ai léché la rampe de l'escalier du bâtiment B pour deux euros. J'ai eu deux euros et une gastro.",
      ],
      en: [
        "I found a piece of gum under my desk. I chewed it. It tasted like 1997 and someone else's mouth.",
        "Bet won: I licked the stairwell handrail in Building B for two dollars. I got two dollars and a stomach bug.",
      ],
    },
    fx: { happy: -2, health: -3 },
  },

  // ───────────────────────────── preschool ─────────────────────────────
  {
    id: 'sc_pre_nap',
    icon: '😴',
    cat: 'school',
    scene: { place: 'school', mood: 'sleepy' },
    when: { school: 'preschool' },
    cooldown: 2,
    text: {
      fr: [
        "C'est l'heure de la sieste à la maternelle. Vingt matelas, une maîtresse épuisée, et toi qui n'as absolument PAS sommeil.",
        "Sieste obligatoire. La lumière est éteinte, quelqu'un ronfle déjà comme un vieux camionneur. Toi, tu as des plans.",
      ],
      en: [
        "Naptime at preschool. Twenty mats, one exhausted teacher, and you, absolutely NOT tired.",
        "Mandatory nap. Lights off, someone's already snoring like an old trucker. You have plans.",
      ],
    },
    choices: [
      {
        label: { fr: 'Dormir sagement', en: 'Sleep like an angel' },
        text: { fr: "J'ai dormi deux heures, la bouche ouverte, en bavant sur mon doudou. La maîtresse m'a désigné{|e} « enfant du mois ».", en: "I slept for two hours, mouth open, drooling on my stuffed animal. The teacher named me “kid of the month.”" },
        fx: { health: 3, discipline: 3, happy: 2 },
        mood: 'sleepy',
      },
      {
        label: { fr: 'Faire semblant', en: 'Fake it' },
        out: [
          { w: 2, text: { fr: "J'ai fait semblant de dormir pendant une heure, les yeux plissés. C'était épuisant. Je me suis endormi{|e} à la fin, de fatigue.", en: "I faked sleeping for an hour, eyes squeezed shut. It was exhausting. I fell asleep at the end, from fatigue." }, fx: { health: 2 } },
          { w: 1, text: { fr: "J'ai fait semblant de dormir et j'ai entendu la maîtresse dire au téléphone qu'elle « allait craquer ». J'ai appris un mot nouveau.", en: "I pretended to sleep and heard the teacher say on the phone that she was “about to lose it.” I learned a new phrase." }, fx: { smarts: 2 } },
        ],
      },
      {
        label: { fr: 'Réveiller tout le monde', en: 'Wake everyone up' },
        text: { fr: "J'ai crié « LE LOUP ! » en pleine sieste. Dix-neuf enfants en pleurs, une maîtresse en larmes, et moi au coin. Ça valait le coup.", en: "I yelled “WOLF!” in the middle of naptime. Nineteen kids crying, one teacher crying, and me in time-out. Worth it." },
        fx: { happy: 4, discipline: -4, karma: -2 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'sc_pre_glue',
    icon: '🧴',
    cat: 'school',
    scene: { place: 'school', mood: 'neutral', prop: 'glue' },
    when: { school: 'preschool' },
    once: true,
    text: {
      fr: [
        "Atelier collage. Le pot de colle blanche te regarde. Il a l'air crémeux. Il a l'air… délicieux.",
        "Pendant l'atelier, un grand de moyenne section te chuchote que la colle, « ça se mange, c'est comme du yaourt ».",
      ],
      en: [
        "Craft time. The jar of white glue is staring at you. It looks creamy. It looks… delicious.",
        "During crafts, a big kid whispers that glue is “edible, it's like yogurt.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Goûter la colle', en: 'Taste the glue' },
        out: [
          { w: 2, text: { fr: "J'ai mangé de la colle. Pas mauvais. Un peu sec en fin de bouche. Je n'ai pas pu ouvrir la bouche pendant dix minutes.", en: "I ate glue. Not bad. A bit dry on the finish. I couldn't open my mouth for ten minutes." }, fx: { happy: 3, health: -2, smarts: -1 } },
          { w: 1, text: { fr: "J'ai mangé tout le pot de colle. On a appelé mes parents. Le médecin a dit que j'étais « juste très bien collé{|e} de l'intérieur ».", en: "I ate the whole jar of glue. They called my parents. The doctor said I was “just very well stuck together inside.”" }, fx: { health: -5, happy: -2 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Coller des nouilles', en: 'Glue macaroni' },
        text: { fr: "J'ai fait un collier de nouilles pour ma mère. Elle a dit qu'elle le porterait « tous les jours ». Je l'ai jamais revu.", en: "I made my mom a macaroni necklace. She said she'd wear it “every day.” I never saw it again." },
        fx: { happy: 3, smarts: 1 },
      },
      {
        label: { fr: 'Coller le grand', en: 'Glue the big kid' },
        text: { fr: "J'ai collé les cheveux du grand sur sa table. On a dû le décoller au ciseau. Il a maintenant une frange en escalier.", en: "I glued the big kid's hair to his desk. They had to free him with scissors. He now has staircase bangs." },
        fx: { happy: 4, karma: -3, discipline: -2 },
      },
    ],
  },
  {
    id: 'sc_pre_first_day',
    icon: '🎒',
    cat: 'school',
    scene: { place: 'school', mood: 'cry' },
    when: { school: 'preschool', age: [3, 4] },
    once: true,
    actor: 'parent',
    text: {
      fr: [
        "Premier jour de maternelle. {a.rel} te serre si fort devant le portail que la maîtresse doit vous séparer comme deux aimants.",
        "C'est la rentrée en maternelle. Ton cartable fait la moitié de ta taille. {a.rel} a les yeux qui brillent dangereusement.",
      ],
      en: [
        "First day of preschool. {a.rel} hugs you so hard at the gate the teacher has to pry you apart like two magnets.",
        "First day of preschool. Your backpack is half your size. {a.rel}'s eyes are glistening dangerously.",
      ],
    },
    choices: [
      {
        label: { fr: 'Hurler de désespoir', en: 'Scream in despair' },
        text: { fr: "J'ai hurlé pendant quarante minutes, accroché{|e} à la jambe de {a.my}. Puis j'ai vu la pâte à modeler et je l'ai oublié{a:|e} instantanément.", en: "I screamed for forty minutes, clamped to {a.my}'s leg. Then I saw the play-dough and forgot {a.him} instantly." },
        fx: { happy: -2, rel: 3 },
        mood: 'cry',
      },
      {
        label: { fr: 'Partir sans se retourner', en: 'Walk in, no look back' },
        text: { fr: "Je suis entré{|e} sans un regard. C'est {a.my} qui a pleuré dans la voiture. Pendant une heure. En mangeant mon goûter.", en: "I walked in without a glance. {a.my} cried in the car. For an hour. While eating my snack." },
        fx: { happy: 3, rel: -2, discipline: 2 },
        mood: 'proud',
      },
      {
        label: { fr: 'Se faire un pote', en: 'Make a buddy' },
        out: [
          { w: 2, odds: { looks: 0.5 }, text: { fr: "Dès la première minute, j'ai partagé mes crayons avec un enfant qui mangeait du sable. On est inséparables. Il mange toujours du sable.", en: "Within a minute I'd shared my crayons with a kid who was eating sand. We're inseparable. He still eats sand." }, fx: { happy: 6, newNpc: { role: 'friend', age: [0, 0] } }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai voulu me faire un ami. Il m'a mordu le doigt. Je l'ai mordu aussi. On est en froid depuis.", en: "I tried to make a friend. He bit my finger. I bit him back. We've been on bad terms ever since." }, fx: { happy: -3 } },
        ],
      },
    ],
  },
  {
    id: 'sc_pre_biter',
    icon: '🦷',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'shock', fx: 'gore' },
    when: { school: 'preschool' },
    once: true,
    actor: 'classmate',
    text: {
      fr: [
        "{a.first} t'a piqué ton camion de pompiers. Tes petites dents de lait te démangent. Très fort.",
        "Dans le coin des cubes, {a.first} vient de démolir ton château. Tu sens monter en toi une rage de crocodile.",
      ],
      en: [
        "{a.first} stole your fire truck. Your little baby teeth are itching. Badly.",
        "In the block corner, {a.first} just wrecked your castle. You feel crocodile rage rising inside you.",
      ],
    },
    choices: [
      {
        label: { fr: 'MORDRE', en: 'BITE' },
        out: [
          { w: 2, text: { fr: "J'ai mordu {a.first} au bras comme un petit requin. Ça a giclé un peu, {a:il|elle} a hurlé beaucoup, et j'ai été surnommé{|e} « Les Dents de la Maternelle ».", en: "I bit {a.first}'s arm like a tiny shark. It squirted a little, {a.he} screamed a lot, and I was nicknamed “Jaws of Preschool.”" }, fx: { happy: 5, rel: -20, karma: -4, discipline: -3, actorRole: 'enemy' }, mood: 'angry' },
          { w: 1, text: { fr: "J'ai mordu {a.first}, {a.he} m'a mordu{|e} en retour. On a fini tous les deux chez l'infirmière, couverts de traces de dents, comme deux vieux marins.", en: "I bit {a.first}, {a.he} bit me back. We both ended up at the nurse covered in tooth marks, like two old sailors." }, fx: { health: -3, rel: 10, actorRole: 'friend' } },
        ],
      },
      {
        label: { fr: 'Dénoncer à la maîtresse', en: 'Tell the teacher' },
        text: { fr: "J'ai rapporté. {a.first} est allé{a:|e} au coin. J'ai récupéré mon camion et mon honneur.", en: "I told. {a.first} went to time-out. I got my truck and my honor back." },
        fx: { happy: 3, rel: -5, discipline: 2 },
      },
      {
        label: { fr: 'Pleurer très fort', en: 'Cry very loudly' },
        text: { fr: "J'ai pleuré si fort qu'une maman dans le couloir a cru à un incendie. Tout le monde m'a donné des jouets pour que j'arrête.", en: "I cried so loudly a mom in the hallway thought there was a fire. Everyone gave me toys to make it stop." },
        fx: { happy: 4 },
        mood: 'cry',
      },
    ],
  },
  {
    id: 'sc_pre_ballpit',
    icon: '💩',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'shock', fx: 'poop' },
    when: { school: 'preschool' },
    once: true,
    weight: 6,
    text: {
      fr: [
        "Tu es dans la piscine à balles de la maternelle quand ton ventre émet un gargouillis sinistre. Les toilettes sont à quinze mètres. C'est très loin, quinze mètres.",
        "En pleine séance de motricité, ton ventre gronde. Tu portes ta salopette la plus compliquée. Le compte à rebours a commencé.",
      ],
      en: [
        "You're in the preschool ball pit when your tummy makes an ominous gurgle. The bathroom is fifty feet away. Fifty feet is very far.",
        "Mid-gym class, your tummy rumbles. You're wearing your most complicated overalls. The countdown has begun.",
      ],
    },
    choices: [
      {
        label: { fr: 'Courir aux toilettes', en: 'Sprint to the potty' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai couru comme jamais. Arrivé{|e} à temps. J'ai été très fier{|ère} de moi et je l'ai annoncé à toute la classe.", en: "I ran like never before. Made it. I was very proud and announced it to the entire class." }, fx: { happy: 5, discipline: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai couru, mais la salopette a gagné. Il a fallu me rhabiller avec les vêtements de rechange du placard : un pantalon de clown et un pull « Je ♥ Mamie ».", en: "I ran, but the overalls won. They had to change me into the spare-clothes closet stuff: clown pants and an “I ♥ Grandma” sweater." }, fx: { happy: -6 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Rester dans les balles', en: 'Stay in the balls' },
        text: { fr: "Je suis resté{|e} dans la piscine à balles. Il y a eu… un incident. On a dû vider les 4 000 balles et les laver une par une. Cette piscine ne s'appelle plus jamais « la piscine » chez nous.", en: "I stayed in the ball pit. There was… an incident. All 4,000 balls had to be emptied and washed one by one. Nobody calls it “the pool” anymore." },
        fx: { happy: -4, karma: -2, visual: 'poop' },
        mood: 'shock',
      },
    ],
  },

  // ───────────────────────────── primary school ─────────────────────────────
  {
    id: 'sc_class_trip',
    icon: '🐐',
    cat: 'school',
    scene: { place: 'park', mood: 'happy' },
    when: { school: KID },
    cooldown: 3,
    text: {
      fr: [
        "Sortie scolaire à la ferme pédagogique ! Il y a une chèvre qui s'appelle Bernadette et qui a l'air d'avoir fait de la prison.",
        "Sortie au musée d'histoire naturelle. Un squelette de dinosaure, quarante gamins, deux accompagnateurs. Les probabilités sont contre le dinosaure.",
      ],
      en: [
        "Field trip to the petting farm! There's a goat named Bernadette who looks like she's done time.",
        "Field trip to the natural history museum. One dinosaur skeleton, forty kids, two chaperones. The odds are against the dinosaur.",
      ],
    },
    choices: [
      {
        label: { fr: 'Suivre le guide', en: 'Follow the guide' },
        text: { fr: "J'ai écouté le guide religieusement et posé des questions. J'ai appris que les vaches ont quatre estomacs. Je le répète depuis à chaque repas.", en: "I listened to the guide and asked questions. I learned cows have four stomachs. I've mentioned it at every meal since." },
        fx: { smarts: 3, grade: 2 },
      },
      {
        label: { fr: 'Nourrir la chèvre', en: 'Feed the goat' },
        out: [
          { w: 2, text: { fr: "J'ai donné mon sandwich à Bernadette. Puis mon sac. Puis presque ma manche. Elle m'aime. Je n'ai plus de sac.", en: "I gave Bernadette my sandwich. Then my bag. Then almost my sleeve. She loves me. I no longer have a bag." }, fx: { happy: 5, money: -15 }, mood: 'happy' },
          { w: 1, text: { fr: "Bernadette m'a donné un coup de tête dans le ventre. J'ai volé un mètre. Toute la classe a applaudi Bernadette.", en: "Bernadette headbutted me in the stomach. I flew three feet. The whole class applauded Bernadette." }, fx: { health: -3, happy: -3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: "S'éclipser du groupe", en: 'Wander off' },
        out: [
          { w: 1, text: { fr: "Je me suis perdu{|e}. On m'a retrouvé{|e} deux heures plus tard dans la boutique de souvenirs, en train de négocier une gomme en forme de T-Rex.", en: "I got lost. They found me two hours later in the gift shop, negotiating for a T-Rex-shaped eraser." }, fx: { happy: 3, discipline: -3 } },
          { w: 1, text: { fr: "J'ai exploré seul{|e} et trouvé une salle « réservée au personnel ». J'ai vu un taxidermiste manger un sandwich à côté d'un renard ouvert. Je ne mange plus de sandwichs.", en: "I explored alone and found a “staff only” room. A taxidermist was eating a sandwich next to an open fox. I don't eat sandwiches anymore." }, fx: { smarts: 2, happy: -2 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'sc_lice',
    icon: '🐜',
    cat: 'school',
    scene: { place: 'home', mood: 'shock' },
    when: { school: ['preschool', 'primary'] },
    cooldown: 3,
    text: {
      fr: [
        "Mot dans le cahier de liaison : « Présence de poux dans la classe. » Ta tête te gratte depuis exactement le moment où tu as lu ce mot.",
        "Épidémie de poux à {school} ! La moitié de la classe se gratte comme une colonie de singes. Toi aussi, un peu. Beaucoup.",
      ],
      en: [
        "Note in your homework folder: “Lice detected in the classroom.” Your head has been itching since exactly the moment you read it.",
        "Lice outbreak at {school}! Half the class is scratching like a troop of monkeys. You too, a bit. A lot.",
      ],
    },
    choices: [
      {
        label: { fr: 'Shampooing anti-poux', en: 'Lice shampoo' },
        out: [
          { w: 2, text: { fr: "Shampooing qui pue le white-spirit et peigne fin pendant une heure. Ma mère a trouvé un pou et l'a exhibé comme un trophée de chasse.", en: "Shampoo that smelled like paint thinner and a fine comb for an hour. Mom found one louse and showed it off like a hunting trophy." }, fx: { happy: -2 } },
          { w: 1, text: { fr: "Trop tard : les poux avaient fondé une civilisation sur mon crâne. Trois semaines de guerre. Ils avaient des noms.", en: "Too late: the lice had founded a civilization on my scalp. Three weeks of war. They had names." }, fx: { disease: 'lice', happy: -4 } },
        ],
      },
      {
        label: { fr: 'Se raser la tête', en: 'Shave it all off' },
        text: { fr: "Mon père m'a rasé la tête à la tondeuse à barbe dans la salle de bain. Plus de poux. Plus de cheveux. Plus de dignité. Je ressemble à un œuf vexé.", en: "Dad shaved my head with his beard trimmer in the bathroom. No more lice. No more hair. No more dignity. I look like an offended egg." },
        fx: { looks: -5, happy: -3 },
        mood: 'sad',
      },
      {
        label: { fr: 'Ignorer et se gratter', en: 'Ignore it, scratch on' },
        text: { fr: "J'ai ignoré le problème. J'ai donné des poux à toute ma famille, au chat et à mamie. On m'appelle « patient zéro ».", en: "I ignored it. I gave lice to my whole family, the cat, and Grandma. They call me “patient zero.”" },
        fx: { disease: 'lice', happy: -3, karma: -2 },
      },
    ],
  },
  {
    id: 'sc_canteen',
    icon: '🤮',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'sick', fx: 'poop' },
    when: { school: ['primary', 'middle'] },
    cooldown: 4,
    text: {
      fr: [
        "À la cantine, aujourd'hui, c'est « hachis parmentier du chef ». Il y a quelque chose qui bouge dedans. Ou alors c'est la lumière.",
        "Le plat du jour à la cantine est gris, tiède, et sent le vestiaire de foot. La dame te dit : « Fini ton assiette ou pas de dessert. »",
      ],
      en: [
        "Today's cafeteria special is “chef's shepherd's pie.” Something in it is moving. Or it's the lighting.",
        "The cafeteria special is gray, lukewarm, and smells like a soccer locker room. The lunch lady says: “Clean plate or no dessert.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout manger', en: 'Eat it all' },
        out: [
          { w: 1, text: { fr: "J'ai tout mangé. Délicieux, en fait. Je me méfie de moi-même.", en: "I ate it all. Delicious, actually. I don't trust myself anymore." }, fx: { happy: 2, health: 1 } },
          { w: 2, text: { fr: "J'ai tout mangé. Quinze minutes plus tard, j'ai vomi en jet sur le plateau de mon voisin, sur mon voisin, et un peu au plafond. Le vomi avait la même couleur que le plat. Logique.", en: "I ate it all. Fifteen minutes later I projectile-vomited onto my neighbor's tray, onto my neighbor, and slightly onto the ceiling. The vomit was the same color as the dish. Makes sense." }, fx: { disease: 'food_poisoning', happy: -6, health: -4 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Le cacher dans la serviette', en: 'Hide it in the napkin' },
        text: { fr: "J'ai planqué le hachis dans ma serviette, puis dans ma poche. Ma mère l'a trouvé en faisant la lessive trois jours plus tard. Elle a crié comme dans un film d'horreur.", en: "I hid the pie in my napkin, then in my pocket. Mom found it doing laundry three days later. She screamed like in a horror movie." },
        fx: { happy: 2, karma: -1 },
      },
      {
        label: { fr: 'Le donner au glouton', en: 'Give it to the human bin' },
        text: { fr: "J'ai filé mon assiette à Kevin, qui mange tout, y compris les gommes et une fois un escargot vivant. Il m'a remercié avec un rot qui a fait trembler les verres.", en: "I passed my plate to Kevin, who eats everything, including erasers and once a live snail. He thanked me with a burp that rattled the glasses." },
        fx: { happy: 3 },
      },
    ],
  },
  {
    id: 'sc_recess_marbles',
    icon: '🔮',
    cat: 'school',
    scene: { place: 'school', mood: 'happy' },
    when: { school: KID },
    cooldown: 3,
    actor: 'classmate',
    text: {
      fr: [
        "Récré : {a.first} te défie aux billes. Enjeu : son calot géant, l'objet le plus convoité de la cour, contre toute ta collection.",
        "Récré : c'est la saison des cartes à échanger. {a.first} te propose sa carte holographique ultra-rare contre « juste » ton goûter pendant un mois.",
      ],
      en: [
        "Recess: {a.first} challenges you to marbles. Stakes: their giant shooter, the most coveted object on the playground, against your entire collection.",
        "Recess: it's trading card season. {a.first} offers their ultra-rare holographic card for “just” your snack for a month.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout miser', en: 'Go all in' },
        out: [
          { w: 1, odds: { athletic: 0.5, smarts: 0.5 }, text: { fr: "J'ai gagné ! Je suis l'empereur de la cour. Je marche différemment depuis. Des CP m'apportent des offrandes.", en: "I won! I'm emperor of the playground. I walk differently now. First-graders bring me offerings." }, fx: { happy: 10, rel: -5 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai tout perdu. Toute ma collection. {a.first} m'a laissé{|e} garder une bille fêlée « par pitié ». C'est pire.", en: "I lost everything. My entire collection. {a.first} let me keep one cracked marble “out of pity.” That's worse." }, fx: { happy: -8, rel: 5 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Négocier comme un pro', en: 'Haggle like a pro' },
        text: { fr: "J'ai négocié vingt minutes. J'ai eu la carte contre une semaine de goûters et un bracelet brésilien. {a.first} se fait avoir et ne le sait pas encore.", en: "I haggled for twenty minutes. Got the card for one week of snacks and a friendship bracelet. {a.first} got played and doesn't know it yet." },
        fx: { smarts: 2, happy: 5 },
      },
      {
        label: { fr: 'Jouer au loup', en: 'Play tag instead' },
        text: { fr: "Trop de pression. Je suis allé{|e} jouer au loup. J'ai couru quarante minutes sans jamais être touché{|e}, parce que personne ne me poursuivait.", en: "Too much pressure. I went to play tag. I ran for forty minutes without being caught, because no one was chasing me." },
        fx: { athletic: 3, happy: 1 },
      },
    ],
  },
  {
    id: 'sc_hamster_dies',
    icon: '🐹',
    cat: 'school',
    scene: { place: 'school', mood: 'shock' },
    when: { school: KID },
    once: true,
    weight: 7,
    text: {
      fr: [
        "Lundi matin, Biscotte, le hamster de la classe, est tout raide dans sa cage. La maîtresse annonce qu'il « fait une très grosse sieste ».",
        "Biscotte, le hamster de la classe, ne bouge plus. Ses petites pattes pointent vers le ciel. La maîtresse est livide.",
      ],
      en: [
        "Monday morning, Nibbles the class hamster is stiff in his cage. The teacher says he's “taking a really big nap.”",
        "Nibbles the class hamster isn't moving. His little feet are pointing at the sky. The teacher has gone pale.",
      ],
    },
    choices: [
      {
        label: { fr: 'Dire la vérité', en: 'Say the truth' },
        text: { fr: "J'ai levé la main : « Il est mort, maîtresse. » Silence. Puis vingt-cinq enfants en pleurs. La maîtresse m'a regardé{|e} comme un bourreau.", en: "I raised my hand: “He's dead, ma'am.” Silence. Then twenty-five crying kids. The teacher looked at me like I was the executioner." },
        fx: { smarts: 2, happy: -3, chain: 'sc_hamster_funeral' },
        mood: 'sad',
      },
      {
        label: { fr: 'Tenter un massage cardiaque', en: 'Try hamster CPR' },
        out: [
          { w: 3, text: { fr: "J'ai tenté un massage cardiaque avec deux doigts, comme à la télé. Biscotte est resté mort, mais un peu plus plat.", en: "I tried two-finger CPR, like on TV. Nibbles stayed dead, just a little flatter." }, fx: { happy: -4, chain: 'sc_hamster_funeral' }, mood: 'shock' },
          { w: 1, text: { fr: "Massage cardiaque : Biscotte a toussé et s'est relevé ! Il dormait vraiment. Je suis le héros de l'école. Biscotte m'a mordu.", en: "CPR: Nibbles coughed and got up! He really was asleep. I'm the school hero. Nibbles bit me." }, fx: { happy: 10, fame: 2, karma: 3 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Accuser le voisin', en: 'Blame the kid next to you' },
        text: { fr: "J'ai crié « C'est Théo, il lui a donné du Coca ! » Théo n'a rien fait, mais tout le monde m'a cru{|e}. Théo mange seul depuis.", en: "I yelled “Theo did it, he gave him soda!” Theo did nothing, but everyone believed me. Theo eats alone now." },
        fx: { karma: -6, happy: 2, chain: 'sc_hamster_funeral' },
      },
    ],
  },
  {
    id: 'sc_hamster_funeral',
    icon: '⚰️',
    cat: 'school',
    rating: 1,
    chainOnly: true,
    scene: { place: 'cemetery', mood: 'sad', fx: 'ghost' },
    when: { school: KID },
    text: {
      fr: [
        "La classe organise les funérailles de Biscotte au fond de la cour. Cercueil : une boîte de Ferrero. On te demande de prononcer l'éloge funèbre.",
        "Enterrement de Biscotte sous le marronnier. Quelqu'un a apporté une bougie, quelqu'un d'autre un briquet « pour l'ambiance ». Tu dois dire quelques mots.",
      ],
      en: [
        "The class is holding Nibbles' funeral behind the playground. Coffin: a chocolate box. You've been asked to give the eulogy.",
        "Nibbles' burial under the chestnut tree. Someone brought a candle, someone else a lighter “for the vibe.” You have to say a few words.",
      ],
    },
    choices: [
      {
        label: { fr: 'Discours émouvant', en: 'Moving speech' },
        text: { fr: "« Biscotte était un hamster simple. Il aimait les graines et tourner dans sa roue jusqu'à la nausée. » La maîtresse a pleuré. Moi aussi. Je ne sais pas pourquoi.", en: "“Nibbles was a simple hamster. He loved seeds and running in his wheel until he threw up.” The teacher cried. So did I. I don't know why." },
        fx: { happy: 3, smarts: 2, karma: 2 },
        mood: 'cry',
      },
      {
        label: { fr: 'Humour noir', en: 'Dark humor' },
        text: { fr: "« Au moins, il est mort comme il a vécu : dans une cage, couvert de sciure, entouré de gamins qui puent. » Trois enfants ont ri. La maîtresse a appelé mes parents.", en: "“At least he died as he lived: in a cage, covered in sawdust, surrounded by smelly kids.” Three kids laughed. The teacher called my parents." },
        fx: { happy: 4, discipline: -3, karma: -2 },
        mood: 'happy',
      },
      {
        label: { fr: 'Exhumer pour vérifier', en: 'Dig him up to check' },
        text: { fr: "Le lendemain, j'ai déterré Biscotte « pour vérifier ». Il était toujours mort. Et maintenant il y avait des vers. J'ai fait des cauchemars pendant un mois.", en: "The next day I dug Nibbles up “to check.” Still dead. Now with worms. I had nightmares for a month." },
        fx: { happy: -5, smarts: 1, stress: 5 },
        mood: 'shock',
      },
    ],
  },
  {
    id: 'sc_show_tell',
    icon: '🎤',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'shock' },
    when: { school: KID },
    once: true,
    actor: 'parent',
    text: {
      fr: [
        "C'est ton tour de faire un exposé « objet de la maison ». Tu as pris le premier truc intéressant trouvé dans la table de nuit de {a.rel}.",
        "Exposé « mon objet préféré » : tu as fouillé le garage de {a.rel} ce matin et ramené quelque chose de vraiment fascinant.",
      ],
      en: [
        "It's your turn for show-and-tell. You brought the first interesting thing you found in {a.rel}'s nightstand.",
        "Show-and-tell: this morning you searched {a.rel}'s garage and brought something truly fascinating.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le dentier de papi', en: "Grandpa's dentures" },
        text: { fr: "J'ai présenté le dentier de rechange de papi en le faisant claquer comme une marionnette. Succès monstre. Papi a mangé de la soupe pendant trois jours.", en: "I presented Grandpa's spare dentures, clacking them like a puppet. Huge hit. Grandpa ate soup for three days." },
        fx: { happy: 6, fame: 1, rel: -5 },
        mood: 'happy',
      },
      {
        label: { fr: 'La flasque de whisky', en: 'The whisky flask' },
        text: { fr: "J'ai présenté « la gourde secrète que {a.my} emmène aux réunions de parents ». La maîtresse a pris des notes. {a.my} n'est plus venu{a:|e} aux réunions de parents.", en: "I presented “the secret water bottle {a.my} takes to parent-teacher meetings.” The teacher took notes. {a.my} stopped coming to parent-teacher meetings." },
        fx: { happy: 4, rel: -12, karma: -1 },
        mood: 'shock',
      },
      {
        label: { fr: "Les impôts de l'année", en: "This year's tax return" },
        text: { fr: "J'ai lu à voix haute la déclaration d'impôts de {a.my}. Toute la classe connaît maintenant notre revenu fiscal. Le fils du banquier a ricané.", en: "I read {a.my}'s tax return out loud. The whole class now knows our household income. The banker's kid snickered." },
        fx: { smarts: 3, rel: -8, happy: -2 },
      },
    ],
  },
  {
    id: 'sc_homework_dog',
    icon: '🐕',
    cat: 'school',
    scene: { place: 'school', mood: 'neutral' },
    when: { school: ['primary', 'middle'] },
    cooldown: 4,
    text: {
      fr: ["Le maître ramasse les devoirs. Le tien n'existe pas. Il n'a jamais existé. Tu as dix secondes pour inventer une excuse.", "« Ton devoir de géographie, s'il te plaît. » Tu fouilles ton cartable avec la conviction de quelqu'un qui sait qu'il n'y a rien dedans.", "Vérification des devoirs. Le tien est resté sur la table de la cuisine. Enfin, tu crois. En vrai, tu ne l'as jamais commencé. La maîtresse te fixe comme {w:animal} qui a repéré une proie.", "Le prof ramasse les exposés sur {w:hobby}. Le tien tient sur un post-it. Il manque [[trois|huit|vingt]] pages.", "« Les devoirs sur la table. » Toute la classe sort une copie. Toi, tu sors {w:object}. Le silence est total."],
      en: ["The teacher is collecting homework. Yours doesn't exist. It never existed. You have ten seconds to come up with an excuse.", "“Your geography homework, please.” You rummage through your backpack with the conviction of someone who knows it's empty.", "Homework check. Yours is on the kitchen table. Well, you think. Actually, you never started it. The teacher stares at you like {w:animal} spotting prey.", "The teacher is collecting the reports on {w:hobby}. Yours fits on a Post-it. It's missing [[three|eight|twenty]] pages.", "'Homework on your desks.' The whole class pulls out a sheet. You pull out {w:object}. Total silence."],
    },
    choices: [
      {
        label: { fr: 'Le chien l\'a mangé', en: 'The dog ate it' },
        out: [
          { w: 1, text: { fr: ["« Le chien l'a mangé. » Le maître : « Tu n'as pas de chien. » Moi : « Il l'a mangé aussi. » Zéro, mais avec les félicitations du jury.", "« Il a été mangé par {w:animal}. » Le maître a demandé une photo de l'animal. J'ai fait un dessin. Zéro, mais il a gardé le dessin."], en: ["“The dog ate it.” Teacher: “You don't have a dog.” Me: “He ate that too.” Zero, but with honors.", "'It got eaten by {w:animal}.' The teacher asked for a photo of the animal. I made a drawing. Zero, but he kept the drawing."] }, fx: { grade: -4, happy: 2 } },
          { w: 1, text: { fr: ["J'ai dit que le chien l'avait mangé et j'ai sorti la feuille déchiquetée, que j'avais mâchée moi-même dans le bus. Crédible. Délai accordé. Goût de papier.", "J'ai juré que le chien l'avait mangé. Le soir, le maître a croisé ma mère à la boulangerie. Elle lui a dit qu'on n'avait pas de chien. Double zéro."], en: ["I said the dog ate it and produced the shredded sheet, which I'd chewed myself on the bus. Credible. Extension granted. Paper aftertaste.", "I swore the dog ate it. That evening, the teacher ran into my mom at the bakery. She told him we don't have a dog. Double zero."] }, fx: { grade: 1, smarts: 1, karma: -2 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Avouer', en: 'Confess' },
        text: { fr: ["« Je ne l'ai pas fait, j'ai regardé des vidéos de chats qui tombent. » Le maître a apprécié l'honnêteté. Puis m'a collé quand même.", "J'ai avoué que j'avais passé la soirée à {w:activity}. Le maître a ri, puis s'est repris. Punition quand même, mais avec le sourire."], en: ["“I didn't do it, I watched videos of cats falling off things.” The teacher appreciated the honesty. Then gave me detention anyway.", "I admitted I'd spent the evening {w:activity}. The teacher laughed, then caught himself. Detention anyway, but with a smile."] },
        fx: { grade: -2, karma: 3, discipline: 2 },
      },
      {
        label: { fr: 'Le faire en vitesse', en: 'Do it right now' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai rédigé le devoir en quatre minutes sous la table. Note : 14. Mon cerveau est meilleur sous la menace.", "J'ai recopié le devoir de mon voisin en changeant les mots. Il a eu 12, moi 15. Il ne me parle plus."], en: ["I wrote the whole thing in four minutes under the desk. Grade: B. My brain works better under threat.", "I copied my neighbor's homework, changing the words. He got a C, I got a B+. He doesn't talk to me anymore."] }, fx: { grade: 3, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai bâclé le devoir en trois minutes. J'ai écrit que la capitale de l'Australie était « Kangourou ». Le maître l'a affiché en salle des profs.", "J'ai bâclé le devoir. Question : « Citez un fleuve français. » Ma réponse : « {w:food} ». Le maître a écrit « pourquoi ? » en rouge."], en: ["I rushed it in three minutes. I wrote that the capital of Australia was “Kangaroo.” The teacher pinned it up in the staff room.", "I rushed it. Question: 'Name a French river.' My answer: '{w:food}'. The teacher wrote 'why?' in red."] }, fx: { grade: -3 } },
        ],
      },
    ],
  },
  {
    id: 'sc_spelling_bee',
    icon: '🐝',
    cat: 'school',
    scene: { place: 'school', mood: 'neutral', prop: 'trophy' },
    when: { school: ['primary', 'middle'], age: [8, 13] },
    once: true,
    text: {
      fr: [
        "Concours d'orthographe de l'école, finale. Il ne reste que toi et la fille du dentiste. Le mot : « chrysanthème ».",
        "Dictée-concours de {school}. Dernière manche, salle comble. On te donne : « rhododendron ». Une goutte de sueur glisse sur ta tempe.",
      ],
      en: [
        "School spelling bee, final round. Just you and the dentist's daughter left. The word: “chrysanthemum.”",
        "The {school} spelling bee. Last round, packed room. Your word: “rhododendron.” A bead of sweat rolls down your temple.",
      ],
    },
    choices: [
      {
        label: { fr: 'Épeler avec assurance', en: 'Spell it confidently' },
        out: [
          { w: 1, odds: { smarts: 1.5 }, text: { fr: "Lettre par lettre, sans trembler. Champion{|ne} ! Mon nom est sur une coupe en plastique doré. Prochaine étape : la finale régionale.", en: "Letter by letter, steady as a rock. Champion! My name is on a gold plastic cup. Next stop: regionals." }, fx: { happy: 10, smarts: 4, grade: 3, flag: 'sc_spelling_champ', schedule: { key: 'sc_spelling_final', years: 1 } }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai épelé avec beaucoup d'assurance et un « y » au mauvais endroit. La fille du dentiste a souri. Elle a des dents parfaites. Évidemment.", en: "I spelled it with total confidence and a “y” in the wrong place. The dentist's daughter smiled. Perfect teeth. Of course." }, fx: { happy: -5, smarts: 1 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Demander la définition', en: 'Ask for the definition' },
        text: { fr: "J'ai demandé la définition, l'origine, une phrase d'exemple, et si je pouvais aller aux toilettes. Disqualifié{|e} pour « obstruction ». Mais j'ai gagné du temps.", en: "I asked for the definition, the origin, a sample sentence, and to use the bathroom. Disqualified for “stalling.” But I bought time." },
        fx: { happy: -2, smarts: 1 },
      },
      {
        label: { fr: 'Saboter son adversaire', en: 'Psych out the rival' },
        text: { fr: "J'ai chuchoté « tu as un truc sur les dents » à la fille du dentiste. Elle a paniqué, s'est trompée. J'ai gagné. Je me regarde moins dans les miroirs.", en: "I whispered “you've got something in your teeth” to the dentist's daughter. She panicked and botched it. I won. I avoid mirrors a bit now." },
        fx: { happy: 6, karma: -5, flag: 'sc_spelling_champ', schedule: { key: 'sc_spelling_final', years: 1 } },
      },
    ],
  },
  {
    id: 'sc_spelling_final',
    icon: '🏆',
    cat: 'school',
    chainOnly: true,
    scene: { place: 'stadium', mood: 'neutral', prop: 'trophy' },
    when: { flag: 'sc_spelling_champ', age: [8, 15] },
    text: {
      fr: [
        "Finale régionale du concours d'orthographe, retransmise sur la télé locale. Ton mot : « pusillanime ». Les projecteurs chauffent.",
        "Finale régionale d'orthographe. Tu affrontes un garçon de neuf ans en costume trois-pièces qui a l'air d'avoir quarante ans.",
      ],
      en: [
        "Regional spelling bee final, broadcast on local TV. Your word: “pusillanimous.” The spotlights are hot.",
        "Regional spelling final. You're up against a nine-year-old in a three-piece suit who seems about forty.",
      ],
    },
    choices: [
      {
        label: { fr: 'Concentration maximale', en: 'Total focus' },
        out: [
          { w: 1, odds: { smarts: 1.5 }, text: { fr: "Victoire régionale ! J'ai eu ma photo dans le journal local, entre une annonce de tracteur et un chien perdu.", en: "Regional champion! My photo ran in the local paper, between a tractor ad and a lost dog." }, fx: { happy: 12, smarts: 5, fame: 4, grade: 4, unflag: 'sc_spelling_champ' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai perdu contre le petit vieux de neuf ans. Il m'a serré la main en disant « belle tentative, champion ». J'ai envie de mordre.", en: "I lost to the tiny nine-year-old geezer. He shook my hand and said “nice try, champ.” I want to bite something." }, fx: { happy: -6, smarts: 2, unflag: 'sc_spelling_champ' }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Jouer pour la caméra', en: 'Play to the camera' },
        text: { fr: "J'ai épelé chaque lettre avec une pose différente. Éliminé{|e} au deuxième mot, mais la vidéo a fait 40 000 vues. Je suis un mème régional.", en: "I spelled each letter with a different pose. Out on the second word, but the clip got 40,000 views. I'm a regional meme." },
        fx: { happy: 5, fame: 3, followers: 300, unflag: 'sc_spelling_champ' },
      },
    ],
  },
  {
    id: 'sc_photo_day',
    icon: '📸',
    cat: 'school',
    scene: { place: 'school', mood: 'neutral', prop: 'camera' },
    when: { school: ['primary', 'middle'] },
    cooldown: 3,
    actor: 'parent',
    text: {
      fr: [
        "Photo de classe demain. Ce soir, {a.rel} sort les ciseaux de cuisine et dit : « Je vais juste égaliser un peu ta frange. »",
        "Jour de la photo de classe. {a.rel} t'a habillé{|e} en chemise à col boutonné jusqu'au menton. Tu ressembles à un petit notaire.",
      ],
      en: [
        "School photos tomorrow. Tonight {a.rel} grabs the kitchen scissors and says, “I'm just going to even out your bangs.”",
        "Photo day. {a.rel} dressed you in a shirt buttoned up to the chin. You look like a tiny accountant.",
      ],
    },
    choices: [
      {
        label: { fr: 'Sourire naturel', en: 'Natural smile' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: "Super photo ! {a.my} l'a fait imprimer en format poster et l'a accrochée dans le salon. Je suis maintenant surveillé{|e} par moi-même.", en: "Great photo! {a.my} had it printed poster-size for the living room. I'm now being watched by myself." }, fx: { happy: 5, looks: 1, rel: 4 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai éternué pile au flash. Sur la photo, j'ai les yeux fermés et un filet de morve comme une toile d'araignée. Elle est dans l'album de famille. Pour toujours.", en: "I sneezed right on the flash. In the photo my eyes are shut and there's a string of snot like a spiderweb. It's in the family album. Forever." }, fx: { happy: -5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire une grimace', en: 'Pull a face' },
        text: { fr: "J'ai louché et tiré la langue. Le photographe n'a pas vu. Trente exemplaires imprimés. Mamie l'a mise sur sa cheminée « parce que c'est toi tout craché ».", en: "I crossed my eyes and stuck out my tongue. The photographer didn't notice. Thirty copies printed. Grandma put it on her mantel “because that's so you.”" },
        fx: { happy: 4, rel: -3, discipline: -1 },
      },
      {
        label: { fr: 'Refuser la coupe maison', en: 'Refuse the home haircut' },
        if: { age: [5, 12] },
        text: { fr: "J'ai refusé la coupe maison et je me suis enfermé{|e} dans la salle de bain. {a.my} a négocié à travers la porte. J'ai gardé ma frange et gagné un Kinder.", en: "I refused the home haircut and locked myself in the bathroom. {a.my} negotiated through the door. I kept my bangs and won a candy bar." },
        fx: { happy: 4, rel: -2 },
      },
    ],
  },
  {
    id: 'sc_crush_note',
    icon: '💌',
    cat: 'school',
    scene: { place: 'school', mood: 'love' },
    when: { school: KID, age: [7, 11] },
    once: true,
    actor: { create: { role: 'classmate', age: [0, 0], gender: 'any' } },
    text: {
      fr: [
        "Tu trouves un papier plié en huit dans ta trousse : « Tu veux être mon amoureux{|se} ? ☐ Oui ☐ Non ☐ Peut-être ». Signé : {a.first}. Avec un cœur mal dessiné.",
        "À la récré, {a.first} te tend une bague en plastique gagnée dans un paquet de céréales. « C'est pour toi. Pour toujours. » Ses copains gloussent derrière.",
      ],
      en: [
        "You find a paper folded eight times in your pencil case: “Will you be my sweetheart? ☐ Yes ☐ No ☐ Maybe.” Signed: {a.first}. With a badly drawn heart.",
        "At recess, {a.first} hands you a plastic ring from a cereal box. “It's for you. Forever.” Their friends are giggling behind them.",
      ],
    },
    choices: [
      {
        label: { fr: 'Cocher « Oui »', en: 'Check “Yes”' },
        text: { fr: "J'ai coché oui. On est « amoureux » : on se tient la main au rang et on partage nos Pépito. Ça a duré onze jours. Une éternité.", en: "I checked yes. We're “sweethearts”: we hold hands in line and share cookies. It lasted eleven days. An eternity." },
        fx: { happy: 8, rel: 15, actorRole: 'friend' },
        mood: 'love',
      },
      {
        label: { fr: 'Cocher « Peut-être »', en: 'Check “Maybe”' },
        text: { fr: "J'ai coché « peut-être » et ajouté « si tu me donnes ta gomme Pokémon ». {a.first} a accepté. Je découvre la diplomatie.", en: "I checked “maybe” and added “if you give me your Pokémon eraser.” {a.first} agreed. I'm discovering diplomacy." },
        fx: { happy: 4, smarts: 1, rel: 5, keep: true },
      },
      {
        label: { fr: 'Montrer à toute la classe', en: 'Show the whole class' },
        text: { fr: "J'ai montré le mot à tout le monde. {a.first} a pleuré dans les toilettes. J'ai eu un moment de gloire, puis une sensation désagréable dans le ventre.", en: "I showed the note to everyone. {a.first} cried in the bathroom. I had a moment of glory, then a weird feeling in my stomach." },
        fx: { happy: 2, karma: -5, rel: -20, actorRole: 'enemy' },
      },
    ],
  },
  {
    id: 'sc_sports_day',
    icon: '🥚',
    cat: 'school',
    scene: { place: 'stadium', mood: 'happy' },
    when: { school: ['primary', 'middle'] },
    cooldown: 3,
    text: {
      fr: [
        "Journée sportive ! Au programme : course en sac, course à l'œuf dans la cuillère, et tir à la corde contre la classe d'à côté, qui a un redoublant de 1,70 m.",
        "C'est la kermesse sportive de {school}. Tous les parents sont là, en jogging et en hurlant comme à la Coupe du monde.",
      ],
      en: [
        "Sports day! Sack race, egg-and-spoon race, and tug-of-war against the other class, which has a held-back kid who's 5'7\".",
        "It's {school}'s sports day. All the parents are there in tracksuits, yelling like it's the World Cup.",
      ],
    },
    choices: [
      {
        label: { fr: 'Course en sac', en: 'Sack race' },
        out: [
          { w: 1, odds: { athletic: 1.5 }, text: { fr: "J'ai bondi comme un kangourou sous stéroïdes. Médaille d'or ! En chocolat, mais d'or.", en: "I hopped like a kangaroo on steroids. Gold medal! Chocolate, but gold." }, fx: { happy: 8, athletic: 3 }, mood: 'proud' },
          { w: 1, text: { fr: "Je suis tombé{|e} au premier saut, face dans l'herbe. J'ai fini la course en rampant, comme une chenille en deuil.", en: "I fell on the first hop, face in the grass. I finished the race crawling, like a grieving caterpillar." }, fx: { happy: -3, athletic: 1 } },
        ],
      },
      {
        label: { fr: "Tricher à l'œuf", en: 'Cheat at egg-and-spoon' },
        out: [
          { w: 1, text: { fr: "J'ai collé l'œuf à la cuillère avec du chewing-gum. Victoire facile. Personne n'a rien vu. Je suis un génie du mal.", en: "I stuck the egg to the spoon with gum. Easy win. Nobody noticed. I'm an evil genius." }, fx: { happy: 6, karma: -3 } },
          { w: 1, text: { fr: "J'ai collé l'œuf au chewing-gum. Un papa a crié « TRICHERIE ! » comme si c'était les JO. Disqualifié{|e} devant tout le quartier.", en: "I glued the egg with gum. A dad yelled “CHEATER!” like it was the Olympics. Disqualified in front of the whole neighborhood." }, fx: { happy: -6, karma: -2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Rester à la buvette', en: 'Stay at the snack stand' },
        text: { fr: "J'ai passé la journée sportive à la buvette. Trois crêpes, deux sodas et une barbe à papa. Mon sport, c'est la digestion.", en: "I spent sports day at the snack stand. Three crêpes, two sodas, and a cotton candy. My sport is digestion." },
        fx: { happy: 5, health: -2, weight: 0.02 },
      },
    ],
  },
  {
    id: 'sc_school_fair',
    icon: '🎪',
    cat: 'school',
    scene: { place: 'school', mood: 'party', fx: 'confetti' },
    when: { school: KID },
    cooldown: 3,
    vars: { amount: [5, 30] },
    text: {
      fr: [
        "C'est la fête de fin d'année de l'école ! Tombola, pêche aux canards, et le stand vedette : « Mouille le directeur » à 1 euro les trois éponges.",
        "Kermesse de fin d'année : le directeur est assis au-dessus d'une bassine d'eau froide, en maillot de bain. C'est le plus beau jour de ta vie.",
      ],
      en: [
        "End-of-year school fair! Raffle, duck pond, and the star attraction: “Dunk the Principal,” three sponges for a buck.",
        "End-of-year fair: the principal is sitting over a tub of cold water in his swimsuit. It's the best day of your life.",
      ],
    },
    choices: [
      {
        label: { fr: 'Couler le directeur', en: 'Dunk the principal' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "Tir parfait. Le directeur a plongé dans l'eau glacée avec un cri de mouette. J'ai dépensé {$amount} pour recommencer. Aucun regret.", en: "Perfect throw. The principal plunged into icy water with a seagull shriek. I spent {$amount} to do it again. No regrets." }, fx: { happy: 10, money: '-amount' }, mood: 'party' },
          { w: 1, text: { fr: "J'ai raté toutes mes éponges, dont une qui a fini sur la tête de la présidente des parents d'élèves. {$amount} dépensés pour un ennemi de plus.", en: "I missed every sponge, including one that hit the PTA president. {$amount} spent on a brand-new enemy." }, fx: { happy: -2, money: '-amount' } },
        ],
      },
      {
        label: { fr: 'Acheter des tickets de tombola', en: 'Buy raffle tickets' },
        out: [
          { w: 1, text: { fr: "J'ai gagné le gros lot de la tombola : un robot ménager. J'ai huit ans. Ma mère, elle, a pleuré de joie.", en: "I won the raffle grand prize: a food processor. I'm eight. Mom cried with joy, though." }, fx: { happy: 4, money: '-amount' }, mood: 'happy' },
          { w: 3, text: { fr: "J'ai acheté pour {$amount} de tickets. J'ai gagné un savon en forme de dauphin. Il sent le poulet.", en: "I bought {$amount} in tickets. I won a dolphin-shaped soap. It smells like chicken." }, fx: { happy: -1, money: '-amount' } },
        ],
      },
      {
        label: { fr: 'Chanter au karaoké', en: 'Sing at karaoke' },
        text: { fr: "J'ai chanté « La Reine des neiges » au karaoké de la kermesse, en faisant les deux voix. Trois parents filmaient. Ma carrière est lancée, ou finie.", en: "I sang the Frozen song at the fair's karaoke, doing both voices. Three parents filmed it. My career is launched, or over." },
        fx: { happy: 6, fame: 1 },
        mood: 'party',
      },
    ],
  },
  {
    id: 'sc_nosebleed',
    icon: '🩸',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'shock', fx: 'gore' },
    when: { school: ['primary', 'middle'] },
    once: true,
    weight: 7,
    text: {
      fr: [
        "En pleine dictée, tu sens quelque chose de chaud couler. Ton nez saigne. Pas un petit peu : façon lance d'incendie.",
        "Plic. Plic. Plic. Une goutte rouge, puis dix, puis cent sur ta copie de maths. Ton nez a décidé de se vider sans prévenir.",
      ],
      en: [
        "In the middle of a dictation, you feel something warm trickling. Your nose is bleeding. Not a little: fire hose style.",
        "Drip. Drip. Drip. One red drop, then ten, then a hundred on your math test. Your nose has decided to empty itself without warning.",
      ],
    },
    choices: [
      {
        label: { fr: 'Pencher la tête en arrière', en: 'Tilt head back' },
        text: { fr: "J'ai penché la tête en arrière. J'ai avalé un demi-litre de sang et je l'ai recraché sur le tableau en toussant. Le maître a dû repeindre. Les CP en parlent encore.", en: "I tilted my head back. Swallowed half a pint of blood and coughed it all over the whiteboard. The teacher had to repaint. The first-graders still talk about it." },
        fx: { health: -3, happy: -3, visual: 'gore' },
        mood: 'sick',
      },
      {
        label: { fr: 'Rendre la copie quand même', en: 'Hand in the test anyway' },
        text: { fr: "J'ai rendu ma copie couverte de sang. Le prof a mis 12 « pour le courage » et a enfilé des gants. On dirait une scène de crime avec des fractions.", en: "I handed in my blood-soaked test. The teacher gave me a B “for bravery” and put on gloves. It looks like a crime scene with fractions." },
        fx: { grade: 3, health: -2, fame: 1 },
        mood: 'proud',
      },
      {
        label: { fr: 'Faire peur aux autres', en: 'Terrify the class' },
        text: { fr: "Je me suis levé{|e}, le visage barbouillé de rouge, et j'ai grogné « Je suis un vampiiiire ». Deux enfants se sont évanouis. J'ai été renvoyé{|e} chez moi, ravi{|e}.", en: "I stood up, face smeared red, and growled “I'm a vaaampire.” Two kids fainted. I got sent home, delighted." },
        fx: { happy: 6, discipline: -4, karma: -2 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'sc_booger',
    icon: '🤧',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'sick' },
    when: { school: KID },
    once: true,
    actor: 'classmate',
    text: {
      fr: [
        "{a.first}, ton voisin de table, a une collection de crottes de nez sous son bureau. Il t'en propose une « de la cuvée de mars ».",
        "{a.first} vient de sortir de son nez un spécimen de la taille d'un petit pois. {a:Il|Elle} le contemple comme un diamant, puis te le tend.",
      ],
      en: [
        "{a.first}, your deskmate, keeps a booger collection under the desk. They offer you one “from the March vintage.”",
        "{a.first} just pulled a pea-sized specimen out of their nose. They admire it like a diamond, then hold it out to you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Goûter, par politesse', en: 'Taste it, to be polite' },
        text: { fr: "J'ai goûté. Salé, légèrement croquant, notes de taille-crayon. {a.first} m'a nommé{|e} « membre d'honneur ». Je regrette tout et rien.", en: "I tasted it. Salty, slightly crunchy, notes of pencil shavings. {a.first} made me an “honorary member.” I regret everything and nothing." },
        fx: { health: -2, rel: 15, happy: -2, actorRole: 'friend' },
        mood: 'sick',
      },
      {
        label: { fr: 'Hurler « BEURK »', en: 'Scream “EWWW”' },
        text: { fr: "J'ai hurlé « IL MANGE SES CROTTES DE NEZ ! » La classe entière a reculé. {a.first} a été surnommé{a:|e} « Le Mineur » jusqu'au collège.", en: "I screamed “THEY EAT THEIR BOOGERS!” The whole class recoiled. {a.first} was nicknamed “The Miner” until middle school." },
        fx: { happy: 3, rel: -15, karma: -2, actorRole: 'enemy' },
      },
      {
        label: { fr: 'Contre-offre', en: 'Counter-offer' },
        text: { fr: "J'ai sorti ma propre crotte de nez, plus grosse, plus verte. {a.first} s'est incliné{a:|e}. J'ai gagné un duel que personne ne devrait gagner.", en: "I produced my own booger, bigger, greener. {a.first} bowed. I won a duel no one should ever win." },
        fx: { happy: 5, rel: 8 },
        mood: 'proud',
      },
    ],
  },
  {
    id: 'sc_bus_vomit',
    icon: '🚌',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'sick', fx: 'poop' },
    when: { school: ['primary', 'middle'] },
    cooldown: 5,
    weight: 7,
    text: {
      fr: [
        "Trois heures de car pour la classe verte. Virages de montagne. Un camarade au fond est vert comme un Schtroumpf malade. Il est juste derrière toi.",
        "Car scolaire, lacets de montagne, odeur de chips au vinaigre. Ton estomac commence à faire des loopings.",
      ],
      en: [
        "Three hours on the bus to camp. Mountain switchbacks. A kid in the back is green as a seasick Smurf. He's right behind you.",
        "School bus, mountain hairpins, smell of salt-and-vinegar chips. Your stomach is starting to do loop-de-loops.",
      ],
    },
    choices: [
      {
        label: { fr: 'Ouvrir la fenêtre', en: 'Open the window' },
        out: [
          { w: 1, text: { fr: "J'ai ouvert la fenêtre juste à temps : le gamin de derrière a vomi par-dessus mon épaule, dehors. Enfin, en partie dehors. Le vent a ramené le reste sur le car entier.", en: "I opened the window just in time: the kid behind me puked over my shoulder, outside. Partly outside. The wind brought the rest back over the whole bus." }, fx: { happy: -4 }, mood: 'sick' },
          { w: 1, text: { fr: "Fenêtre ouverte, air frais, crise évitée. Le chauffeur m'a fait un pouce dans le rétro. Le héros silencieux du car 12.", en: "Window open, fresh air, crisis averted. The driver gave me a thumbs-up in the mirror. The silent hero of bus 12." }, fx: { happy: 4, karma: 2 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Fixer l\'horizon', en: 'Stare at the horizon' },
        out: [
          { w: 1, odds: { health: 1 }, text: { fr: "J'ai fixé l'horizon pendant trois heures sans cligner. Pas vomi. Un peu traumatisé{|e} par un champ de vaches.", en: "I stared at the horizon for three hours without blinking. Didn't puke. Slightly traumatized by a field of cows." }, fx: { happy: 1, discipline: 2 } },
          { w: 1, text: { fr: "J'ai fixé l'horizon. L'horizon a tourné. J'ai vomi dans ma casquette, puis dans la capuche de la fille devant, puis dans le sac à dos du prof. Réaction en chaîne : onze vomis. Un record.", en: "I stared at the horizon. The horizon spun. I puked into my cap, then into the hood of the girl in front, then into the teacher's backpack. Chain reaction: eleven pukers. A record." }, fx: { happy: -7, health: -2, counter: 'vomit', visual: 'poop' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Manger des chips', en: 'Eat chips' },
        text: { fr: "J'ai mangé un paquet entier de chips au vinaigre « pour caler l'estomac ». Il s'est décalé. Sur le chauffeur. Le car s'est arrêté sur une aire. Tout le monde m'a regardé{|e} en silence.", en: "I ate a whole bag of vinegar chips “to settle my stomach.” It unsettled. Onto the driver. The bus pulled over. Everyone stared at me in silence." },
        fx: { happy: -6, health: -2, counter: 'vomit' },
        mood: 'sick',
      },
    ],
  },
  {
    id: 'sc_minute_silence',
    icon: '💨',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'shock' },
    when: { school: ['primary', 'middle'] },
    once: true,
    weight: 6,
    text: {
      fr: [
        "Minute de silence dans la cour, toute l'école alignée, le directeur au garde-à-vous. Et toi, un pet monstrueux qui frappe à la porte.",
        "Commémoration solennelle au gymnase. Silence absolu. Tu as mangé des flageolets à midi. Ils veulent sortir. Maintenant.",
      ],
      en: [
        "Moment of silence in the schoolyard, the whole school in rows, the principal at attention. And you, with a monstrous fart knocking at the door.",
        "Solemn memorial in the gym. Total silence. You had beans for lunch. They want out. Now.",
      ],
    },
    choices: [
      {
        label: { fr: 'Serrer les fesses', en: 'Clench for glory' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: "J'ai serré pendant 60 secondes, rouge comme une tomate, en sueur. Victoire. Puis il est sorti à la 61e, mais il y avait des applaudissements pour le couvrir.", en: "I clenched for 60 seconds, red as a tomato, sweating. Victory. It came out on second 61, but the applause covered it." }, fx: { discipline: 3, happy: 3 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai serré. Il s'est échappé quand même, aigu et interminable, comme un ballon qu'on dégonfle. Le directeur a fermé les yeux. Huit cents enfants ont explosé de rire. J'ai ruiné une commémoration nationale.", en: "I clenched. It escaped anyway, high-pitched and endless, like a deflating balloon. The principal closed his eyes. Eight hundred kids exploded laughing. I ruined a national memorial." }, fx: { happy: -5, fame: 3, discipline: -2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Lâcher et accuser', en: 'Let it rip, blame someone' },
        text: { fr: "J'ai lâché la bête et regardé fixement le garçon à côté de moi. Toute la rangée l'a regardé aussi. Il a été convoqué. Il pue encore dans la mémoire collective.", en: "I released the beast and stared hard at the kid next to me. The whole row stared at him too. He got called in. He still stinks in the collective memory." },
        fx: { happy: 4, karma: -5 },
      },
      {
        label: { fr: 'Le faire en silence', en: 'Silent but deadly' },
        text: { fr: "Je l'ai lâché en silence. Erreur. C'était une arme chimique. Trois rangs ont rompu l'alignement en toussant. Une prof a vomi dans un bac à fleurs.", en: "I let it out silently. Mistake. It was a chemical weapon. Three rows broke formation coughing. A teacher threw up in a flowerbed." },
        fx: { happy: 5, karma: -2, visual: 'poop' },
        mood: 'happy',
      },
    ],
  },

  // ───────────────────────────── middle & high school ─────────────────────────────
  {
    id: 'sc_substitute',
    icon: '🧑‍🏫',
    cat: 'school',
    scene: { place: 'school', mood: 'happy' },
    when: { school: TEEN },
    cooldown: 3,
    text: {
      fr: [
        "Remplaçant aujourd'hui en histoire-géo ! Il s'appelle M. Pétillon, il est nouveau, et il tremble légèrement en faisant l'appel.",
        "La prof de maths est absente. Sa remplaçante a 23 ans, une voix minuscule et a dit « Soyez gentils avec moi » dès la première minute. Erreur stratégique.",
      ],
      en: [
        "Substitute teacher in history today! His name is Mr. Pettigrew, he's new, and he trembles slightly while taking roll.",
        "The math teacher is out. Her sub is 23, has a tiny voice, and said “please be nice to me” in the first minute. Strategic error.",
      ],
    },
    choices: [
      {
        label: { fr: 'Échanger les noms', en: 'Swap names with everyone' },
        text: { fr: "Toute la classe a échangé ses prénoms. Je m'appelais « Jean-Michel Jarre ». Le remplaçant a noté sérieusement. Ma vraie copie est notée au nom de mon voisin.", en: "The whole class swapped names. I was “Jean-Claude Van Damme.” The sub wrote it down seriously. My real grade went to the kid next to me." },
        fx: { happy: 6, discipline: -2, grade: -1 },
        mood: 'happy',
      },
      {
        label: { fr: 'Être sympa avec lui', en: 'Be nice to them' },
        text: { fr: "J'ai été le seul élève poli. Le remplaçant m'a regardé{|e} comme un naufragé regarde un bateau. Il m'a mis 18 à un exercice que je n'ai pas rendu.", en: "I was the only polite student. The sub looked at me like a castaway seeing a ship. They gave me an A on an assignment I never turned in." },
        fx: { karma: 4, grade: 3 },
      },
      {
        label: { fr: 'Inventer une sortie', en: 'Invent a field trip' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai expliqué au remplaçant qu'on avait « sortie au CDI » tous les jeudis. Il nous a laissés partir. Toute la classe était au McDo. Légende instantanée.", en: "I told the sub we had “library time” every Thursday. He let us go. The whole class went to McDonald's. Instant legend." }, fx: { happy: 9, fame: 1, discipline: -3 }, mood: 'party' },
          { w: 1, text: { fr: "J'ai tenté le coup de la sortie imaginaire. Le remplaçant était un ancien militaire. On a fait des pompes pendant une heure.", en: "I tried the imaginary field trip thing. The sub was ex-military. We did push-ups for an hour." }, fx: { athletic: 3, happy: -4 } },
        ],
      },
    ],
  },
  {
    id: 'sc_group_project',
    icon: '📊',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'angry' },
    when: { school: TEEN },
    cooldown: 3,
    actor: 'classmate',
    text: {
      fr: [
        "Exposé de groupe sur la Révolution française. Ton binôme, {a.first}, a contribué en tout et pour tout un titre : « La Révolution (c'était chaud) ».",
        "Projet de groupe à rendre demain. {a.first} ne répond plus depuis neuf jours. Sa dernière story le montre au bowling. Hier soir.",
      ],
      en: [
        "Group presentation on the French Revolution. Your partner {a.first} has contributed exactly one title: “The Revolution (It Was Wild).”",
        "Group project due tomorrow. {a.first} hasn't replied in nine days. Their last story shows them bowling. Last night.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout faire seul{|e}', en: 'Do it all yourself' },
        text: { fr: "J'ai tout fait seul{|e}, jusqu'à 3 h du matin. On a eu 17. {a.first} a dit « on a géré » devant le prof. J'ai visualisé des choses illégales.", en: "I did it all myself until 3 a.m. We got an A. {a.first} told the teacher “we crushed it.” I pictured several felonies." },
        fx: { grade: 5, stress: 8, rel: -10, smarts: 2 },
        mood: 'angry',
      },
      {
        label: { fr: 'Balancer au prof', en: 'Snitch to the teacher' },
        text: { fr: "J'ai envoyé au prof les captures des 47 messages sans réponse. {a.first} a eu 4. Moi 16. La vengeance est un plat qui se sert avec des captures d'écran.", en: "I sent the teacher screenshots of 47 unanswered messages. {a.first} got an F. I got an A. Revenge is a dish best served with screenshots." },
        fx: { grade: 4, rel: -25, karma: -1, actorRole: 'enemy' },
      },
      {
        label: { fr: 'Saboter sa partie', en: 'Sabotage their slide' },
        text: { fr: "Sur la diapo de {a.first}, j'ai écrit « Robespierre était mon daron ». {a.first} l'a lue à voix haute sans l'avoir vue. La classe a pleuré de rire. Le prof aussi, un peu.", en: "On {a.first}'s slide I wrote “Robespierre was my daddy.” {a.first} read it out loud without having seen it. The class died laughing. So did the teacher, a little." },
        fx: { happy: 8, grade: -3, rel: -15, karma: -2 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'sc_phone_cheat',
    icon: '📱',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'neutral' },
    when: { school: TEEN, era: [2008, 2100] },
    cooldown: 3,
    text: {
      fr: [
        "Contrôle de physique. Ton téléphone est dans ta poche, chargé à 100 %, avec Internet. Le prof corrige des copies, le nez dans ses papiers.",
        "Examen blanc. Quelqu'un a créé un groupe « RÉPONSES CHIMIE 🔥 » et tu viens d'y être ajouté{|e}. Ton téléphone vibre dans ta trousse.",
      ],
      en: [
        "Physics test. Your phone's in your pocket, 100% charged, with internet. The teacher is grading papers, nose buried.",
        "Mock exam. Someone made a group chat called “CHEM ANSWERS 🔥” and you've just been added. Your phone is buzzing in your pencil case.",
      ],
    },
    choices: [
      {
        label: { fr: 'Aller « aux toilettes »', en: 'Go to the “bathroom”' },
        out: [
          { w: 2, text: { fr: "Huit minutes aux toilettes avec mon téléphone. J'ai eu 17. Le prof a dit que j'avais « une vessie de l'Antiquité mais un esprit vif ».", en: "Eight minutes in the bathroom with my phone. Got an A. The teacher said I had “an ancient bladder but a sharp mind.”" }, fx: { grade: 6, karma: -3 } },
          { w: 1, odds: { discipline: -0.5 }, text: { fr: "Le surveillant m'attendait devant la porte des toilettes. « Elle est bonne, la page Wikipédia ? » Zéro et convocation des parents.", en: "The proctor was waiting outside the bathroom. “Nice Wikipedia page?” Zero and a parent conference." }, fx: { grade: -10, happy: -6, flag: 'sc_troublemaker' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Le groupe de réponses', en: 'Use the group chat' },
        out: [
          { w: 1, text: { fr: "J'ai recopié les réponses du groupe. Elles étaient toutes fausses : le génie qui les postait avait le sujet de l'an dernier. Toute la classe a eu 3. On était très soudés dans la défaite.", en: "I copied the group chat answers. All wrong: the genius posting them had last year's test. The whole class got an F. We were very united in defeat." }, fx: { grade: -6, karma: -2 }, mood: 'shock' },
          { w: 1, text: { fr: "Les réponses du groupe étaient bonnes. 18. Mais 14 élèves avaient la même faute de frappe. L'enquête est en cours. Je dors mal.", en: "The answers were right. A+. But 14 students had the same typo. There's an investigation. I'm sleeping badly." }, fx: { grade: 5, karma: -3, stress: 6 } },
        ],
      },
      {
        label: { fr: 'Ranger le téléphone', en: 'Put the phone away' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai rangé mon téléphone et réfléchi avec mon propre cerveau. Note honnête, conscience propre, et je suis le seul à ne pas être convoqué.", en: "I put my phone away and used my own brain. Honest grade, clean conscience, and I'm the only one not getting called in." }, fx: { grade: 3, karma: 4, discipline: 2 } },
          { w: 1, text: { fr: "J'ai été honnête. 7 sur 20. Les tricheurs ont eu 16. La morale de cette histoire n'est pas claire.", en: "I was honest. 35%. The cheaters got 80%. The moral of this story is unclear." }, fx: { grade: -3, karma: 4 } },
        ],
      },
    ],
  },
  {
    id: 'sc_teacher_crush',
    icon: '🍎',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'love' },
    when: { school: TEEN, age: [12, 16] },
    once: true,
    text: {
      fr: [
        "Tu as une admiration totale, profonde et très gênante pour ton prof de français. Il a cité Rimbaud. Tu as noté la date.",
        "La nouvelle prof d'anglais est trop cool : elle a un tatouage, une moto et elle a dit que ta rédaction était « intéressante ». Tu la relis tous les soirs.",
      ],
      en: [
        "You have a total, deep, and very embarrassing admiration for your English teacher. He quoted Shakespeare. You wrote down the date.",
        "The new Spanish teacher is so cool: she has a tattoo, a motorcycle, and said your essay was “interesting.” You reread it every night.",
      ],
    },
    choices: [
      {
        label: { fr: 'Offrir une pomme', en: 'Bring an apple' },
        text: { fr: "J'ai posé une pomme sur son bureau. Puis une autre le lendemain. Au bout de trois semaines, il y avait une corbeille de fruits et un mot du CPE. On m'appelle « le primeur ».", en: "I put an apple on the desk. Then another the next day. After three weeks there was a fruit basket and a note from the counselor. They call me “the produce stand.”" },
        fx: { happy: -4, karma: 1 },
        mood: 'shock',
      },
      {
        label: { fr: 'Rire à toutes ses blagues', en: 'Laugh at every joke' },
        text: { fr: "J'ai ri à toutes les blagues du prof, même quand il a dit « sortez vos cahiers ». Il a fini par me demander si j'allais bien. Je n'allais pas bien.", en: "I laughed at every one of the teacher's jokes, even “take out your notebooks.” Eventually they asked if I was okay. I was not okay." },
        fx: { happy: -3, grade: 2 },
      },
      {
        label: { fr: 'Bosser comme jamais', en: 'Study like crazy' },
        text: { fr: "J'ai bossé comme un{|e} acharné{|e} pour l'impressionner. 19 de moyenne dans sa matière. Puis j'ai vu sa femme venir le chercher, et j'ai découvert que l'admiration peut faire très mal. Mais j'ai gardé le 19.", en: "I worked like a maniac to impress them. Top grade in the class. Then I saw their spouse pick them up and learned admiration can hurt. But I kept the A." },
        fx: { grade: 8, smarts: 3, happy: -2 },
        mood: 'proud',
      },
      {
        label: { fr: "L'écrire en public", en: 'Say it out loud' },
        text: { fr: "J'ai appelé le prof « papa » en levant la main. Pas exprès. Trois ans de collège résumés en une seconde. J'ai changé de place, de prénom et presque de pays.", en: "I called the teacher “Dad” while raising my hand. Not on purpose. Three years of school summed up in one second. I changed seats, names and almost countries." },
        fx: { happy: -8, fame: 1, stress: 5 },
        mood: 'cry',
      },
    ],
  },
  {
    id: 'sc_saturday_detention',
    icon: '⛓️',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'sleepy' },
    when: { school: TEEN },
    cooldown: 3,
    actor: { create: { role: 'classmate', age: [-1, 2], gender: 'any' } },
    text: {
      fr: [
        "Retenue un samedi matin, de 8 h à 12 h. Dans la salle : toi, un surveillant qui dort, et {a.first}, qui grave son nom sur la table au compas depuis 40 minutes.",
        "Quatre heures de colle le samedi. Ton seul compagnon d'infortune : {a.first}, réputé{a:|e} pour avoir mis le feu au labo de chimie « par curiosité ».",
      ],
      en: [
        "Saturday detention, 8 a.m. to noon. In the room: you, a sleeping monitor, and {a.first}, who has been carving their name into the desk with a compass for 40 minutes.",
        "Four hours of Saturday detention. Your only companion in misery: {a.first}, famous for setting the chem lab on fire “out of curiosity.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Discuter avec {a.first}', en: 'Talk to {a.first}' },
        out: [
          { w: 2, text: { fr: "On a parlé quatre heures. {a.first} a une vie de dingue, un rat apprivoisé et des avis tranchés sur les céréales. On est devenus potes. Le surveillant n'a jamais rien su.", en: "We talked for four hours. {a.first} has a wild life, a pet rat, and strong opinions on cereal. We became friends. The monitor never knew." }, fx: { happy: 8, rel: 25, actorRole: 'friend' }, mood: 'happy' },
          { w: 1, text: { fr: "{a.first} m'a raconté sa vie pendant quatre heures sans respirer. Je connais le nom de tous ses cousins. Je préfère encore les maths.", en: "{a.first} told me their life story for four hours without breathing. I know all their cousins' names. I'd rather do math." }, fx: { happy: -3 } },
        ],
      },
      {
        label: { fr: 'Faire ses devoirs', en: 'Do homework' },
        text: { fr: "J'ai fait tous mes devoirs de la semaine. La retenue la plus productive de l'histoire du collège. J'ai presque envie de revenir. Presque.", en: "I did all my homework for the week. The most productive detention in school history. I almost want to come back. Almost." },
        fx: { grade: 4, discipline: 3 },
      },
      {
        label: { fr: "S'évader par la fenêtre", en: 'Escape through the window' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "On s'est évadés par la fenêtre du rez-de-chaussée avec {a.first}. On a mangé un kebab et on est revenus avant le réveil du surveillant. Le crime parfait.", en: "{a.first} and I escaped through the ground-floor window. We got kebabs and came back before the monitor woke up. The perfect crime." }, fx: { happy: 10, rel: 20, discipline: -3, actorRole: 'friend' }, mood: 'party' },
          { w: 1, text: { fr: "Je suis resté{|e} coincé{|e} dans la fenêtre, à moitié dehors. Le surveillant s'est réveillé, m'a regardé{|e} et a pris une photo. Elle est au tableau d'affichage de la salle des profs.", en: "I got stuck in the window, half outside. The monitor woke up, looked at me and took a photo. It's on the staff room bulletin board." }, fx: { happy: -6, discipline: -2, flag: 'sc_troublemaker' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'sc_class_clown',
    icon: '🤡',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'happy' },
    when: { school: TEEN },
    cooldown: 3,
    text: {
      fr: [
        "Le prof de SVT se retourne pour écrire au tableau. Toute la classe te regarde : c'est le moment de ton numéro.",
        "Cours de techno, ambiance sinistre. Un silence parfait, juste le bruit d'un néon qui grésille. Tu sens que la classe a besoin de toi.",
      ],
      en: [
        "The biology teacher turns to write on the board. The whole class looks at you: it's showtime.",
        "Tech class, grim atmosphere. Perfect silence, just a buzzing fluorescent light. You can feel the class needs you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Imiter le prof', en: 'Impersonate the teacher' },
        out: [
          { w: 2, odds: { looks: 0.3 }, text: { fr: "J'ai imité le prof à la perfection, tic de la moustache compris. La classe a hurlé de rire. Le prof s'est retourné, a souri, et m'a donné deux heures de colle. Avec la moustache.", en: "I did a perfect impression of the teacher, mustache twitch included. The class howled. The teacher turned around, smiled, and gave me two hours of detention. With the mustache." }, fx: { happy: 8, fame: 1, discipline: -3, flag: 'sc_troublemaker' }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai imité le prof. Personne n'a ri. Le prof, si. Longtemps. C'était lui, le vrai clown.", en: "I impersonated the teacher. Nobody laughed. The teacher did. For a long time. He was the real clown." }, fx: { happy: -6 } },
        ],
      },
      {
        label: { fr: 'Le coup du crayon au plafond', en: 'Pencil in the ceiling' },
        text: { fr: "J'ai planté un crayon dans le faux plafond. Il est tombé dix minutes plus tard, pile dans le café du prof. Personne ne sait que c'est moi. Le crayon, lui, sait.", en: "I lodged a pencil in the ceiling tiles. Ten minutes later it fell straight into the teacher's coffee. Nobody knows it was me. The pencil knows." },
        fx: { happy: 6, karma: -1, flag: 'sc_troublemaker' },
      },
      {
        label: { fr: 'Se tenir à carreau', en: 'Behave for once' },
        text: { fr: "J'ai été sage. La classe m'a regardé{|e} avec une immense déception. Une fille a soupiré « t'as changé ». J'ai eu un bon point. Il a un goût amer.", en: "I behaved. The class looked at me with deep disappointment. A girl sighed “you've changed.” I got a gold star. It tastes bitter." },
        fx: { discipline: 3, grade: 2, happy: -2 },
      },
    ],
  },
  {
    id: 'sc_suspension',
    icon: '🚫',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'angry' },
    when: { school: TEEN, flag: 'sc_troublemaker' },
    once: true,
    weight: 12,
    actor: 'parent',
    text: {
      fr: [
        "Convocation au bureau du principal avec {a.rel}. Ton dossier fait l'épaisseur d'un annuaire. Le principal dit : « Trois jours d'exclusion. Minimum. »",
        "Conseil de discipline. Tes « exploits » de l'année sont lus à voix haute, un par un. {a.rel} a fermé les yeux à partir du quatrième.",
      ],
      en: [
        "Called into the principal's office with {a.rel}. Your file is as thick as a phone book. The principal says: “Three-day suspension. Minimum.”",
        "Disciplinary hearing. Your “achievements” this year are read aloud, one by one. {a.rel} closed {a:his|her} eyes around the fourth.",
      ],
    },
    choices: [
      {
        label: { fr: "S'excuser platement", en: 'Grovel' },
        text: { fr: "J'ai présenté des excuses si sincères qu'un prof a écrasé une larme. Exclusion réduite à deux jours. {a.my} m'a privé{|e} de téléphone pour deux mois.", en: "I apologized so sincerely a teacher shed a tear. Suspension cut to two days. {a.my} took my phone for two months." },
        fx: { happy: -5, discipline: 5, rel: -5, grade: -2, unflag: 'sc_troublemaker' },
        mood: 'sad',
      },
      {
        label: { fr: "Contester l'injustice", en: 'Fight the injustice' },
        out: [
          { w: 3, odds: { smarts: 1 }, text: { fr: "J'ai plaidé ma cause comme un avocat de série télé. Exclusion de trois jours, mais le principal a dit que j'avais « un avenir au barreau. Ou derrière les barreaux. »", en: "I argued my case like a TV lawyer. Three-day suspension, but the principal said I had “a future at the bar. Or behind bars.”" }, fx: { smarts: 2, happy: -4, grade: -3, rel: -8, unflag: 'sc_troublemaker' } },
          { w: 1, text: { fr: "J'ai dit au principal qu'il était « le Voldemort de l'Éducation nationale ». Renvoi définitif. {a.my} n'a pas dit un mot dans la voiture. Pendant deux heures.", en: "I told the principal he was “the Voldemort of public education.” Expelled for good. {a.my} didn't say a word in the car. For two hours." }, fx: { expel: true, happy: -10, rel: -20, unflag: 'sc_troublemaker' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Profiter des vacances', en: 'Enjoy the vacation' },
        text: { fr: "Trois jours d'exclusion = trois jours de jeux vidéo en pyjama. {a.my} a transformé ça en trois jours à repeindre le garage. J'ai les bras d'un plâtrier.", en: "Three days' suspension = three days of video games in pajamas. {a.my} turned it into three days of painting the garage. I have the arms of a drywaller." },
        fx: { athletic: 2, happy: -2, rel: -5, grade: -3, unflag: 'sc_troublemaker' },
      },
    ],
  },
  {
    id: 'sc_fight',
    icon: '🥊',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'angry', fx: 'gore' },
    when: { school: TEEN },
    cooldown: 4,
    actor: { create: { role: 'classmate', age: [-1, 2], gender: 'same' } },
    text: {
      fr: [
        "{a.first} t'attend derrière le gymnase. Trente élèves en cercle, téléphones levés, qui scandent « BAS-TON ! BAS-TON ! ». Apparemment, tu as « regardé {a.his} sœur ».",
        "À la sortie des cours, {a.first} te bouscule et te traite de « sale tête de cul ». Un cercle se forme. Il n'y a plus moyen de reculer.",
      ],
      en: [
        "{a.first} is waiting for you behind the gym. Thirty kids in a circle, phones up, chanting “FIGHT! FIGHT!” Apparently you “looked at {a.his} sister.”",
        "After class, {a.first} shoves you and calls you a “butt-faced loser.” A circle forms. There's no backing out now.",
      ],
    },
    choices: [
      {
        label: { fr: 'Cogner en premier', en: 'Throw the first punch' },
        out: [
          { w: 1, odds: { athletic: 1.5 }, text: { fr: "Un crochet du droit parfait. Une dent de {a.first} a volé au ralenti au-dessus de la foule, comme une petite comète blanche. La vidéo a 2 000 vues. La dent n'a jamais été retrouvée.", en: "A perfect right hook. One of {a.first}'s teeth flew in slow motion over the crowd like a tiny white comet. The video has 2,000 views. The tooth was never found." }, fx: { happy: 6, karma: -4, fame: 2, rel: -30, actorRole: 'enemy', flag: 'sc_troublemaker', visual: 'gore' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai frappé le premier. Dans le vide. {a.first} a répondu d'une droite et mon nez a explosé comme un sachet de ketchup piétiné. J'ai saigné sur trois personnes et un surveillant.", en: "I threw the first punch. At the air. {a.first} answered with a right and my nose burst like a stomped ketchup packet. I bled on three people and a hall monitor." }, fx: { health: -10, happy: -8, rel: -20, actorRole: 'enemy', visual: 'gore' }, mood: 'cry' },
          { w: 1, text: { fr: "Bagarre épique. On s'est roulés dans une flaque, j'ai mordu, {a.he} a tiré mes cheveux, et je suis reparti{|e} avec le bras dans une position que les bras ne prennent pas.", en: "Epic brawl. We rolled in a puddle, I bit, {a.he} pulled my hair, and I left with my arm bent in a direction arms don't go." }, fx: { disease: 'broken_arm', happy: -6, rel: -10, actorRole: 'enemy', flag: 'sc_troublemaker' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Clasher verbalement', en: 'Roast them instead' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "Je lui ai dit que sa tête ressemblait à un genou avec des sourcils. La foule a hurlé « OHHHH ». {a.first} est reparti{a:|e} sans frapper. Moralement, il est mort.", en: "I told {a.him} {a.his} face looked like a knee with eyebrows. The crowd roared “OHHHH.” {a.first} walked off without swinging. Morally, {a.he}'s dead." }, fx: { happy: 8, fame: 2, rel: -20, actorRole: 'enemy' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai tenté une vanne. {a.first} m'a frappé{|e} au milieu de la phrase. Je n'ai jamais pu finir ma blague. Elle était bonne pourtant.", en: "I tried a burn. {a.first} hit me mid-sentence. I never got to finish my joke. It was a good one too." }, fx: { health: -6, happy: -6, disease: 'concussion', actorRole: 'enemy' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Fuir avec dignité', en: 'Run with dignity' },
        text: { fr: "J'ai couru. Très vite. Sans dignité, en fait. Les vidéos me montrent en train de sauter par-dessus une poubelle en criant « MAMAAAN ». Mais j'ai toutes mes dents.", en: "I ran. Very fast. Without dignity, actually. The videos show me hurdling a trash can screaming “MOMMYYY.” But I have all my teeth." },
        fx: { happy: -5, athletic: 2 },
        mood: 'shock',
      },
    ],
  },
  {
    id: 'sc_skip_class',
    icon: '🏃',
    cat: 'school',
    rating: 1,
    scene: { place: 'park', mood: 'happy' },
    when: { school: TEEN, age: [13, 17] },
    cooldown: 2,
    actor: 'classmate',
    text: {
      fr: [
        "{a.first} te glisse : « On sèche les deux heures de maths ? Mon cousin a une PlayStation et zéro parent. »",
        "Il fait 28 degrés, c'est le cours de latin, et {a.first} agite deux tickets de bus pour la plage. « Personne ne verra rien. »",
      ],
      en: [
        "{a.first} whispers: “Wanna skip double math? My cousin has a PlayStation and zero parents.”",
        "It's 85 degrees, it's Latin class, and {a.first} is waving two bus tickets to the beach. “No one will ever know.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Sécher !', en: 'Skip!' },
        out: [
          { w: 2, text: { fr: "J'ai séché avec {a.first}. Meilleure journée de l'année : glaces, coup de soleil, zéro équation. J'ai imité la signature de ma mère sur le billet d'absence. Moyennement.", en: "I skipped with {a.first}. Best day of the year: ice cream, sunburn, zero equations. I forged my mom's signature on the absence note. Sort of." }, fx: { happy: 10, rel: 10, grade: -3, discipline: -3, flag: 'sc_skipper' }, mood: 'party' },
          { w: 1, text: { fr: "On a séché et on est tombés nez à nez avec le prof de maths au supermarché. Il achetait des chips. On s'est regardés. Personne n'a rien dit. Mais tout le monde savait.", en: "We skipped and ran face-first into the math teacher at the supermarket. He was buying chips. We stared at each other. Nobody said anything. But everybody knew." }, fx: { happy: 2, grade: -4, flag: 'sc_skipper' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Aller en cours', en: 'Go to class' },
        text: { fr: "Je suis allé{|e} en cours. Le prof a fait une interro surprise que j'ai réussie. {a.first} a posté des photos de la plage. J'ai réussi l'interro et raté ma vie.", en: "I went to class. Surprise quiz, which I aced. {a.first} posted beach photos. I aced the quiz and failed at life." },
        fx: { grade: 3, happy: -3, discipline: 2 },
      },
      {
        label: { fr: 'Balancer {a.first}', en: 'Rat out {a.first}' },
        text: { fr: "J'ai prévenu la vie scolaire. {a.first} a été cueilli{a:|e} à l'arrêt de bus. Mon casier a été rempli de mayonnaise. Plusieurs pots.", en: "I told the front office. {a.first} got picked up at the bus stop. My locker was filled with mayonnaise. Several jars." },
        fx: { karma: -2, rel: -25, happy: -4, actorRole: 'enemy' },
      },
    ],
  },
  {
    id: 'sc_skip_letter',
    icon: '✉️',
    cat: 'school',
    rating: 1,
    scene: { place: 'home', mood: 'angry' },
    when: { school: TEEN, flag: 'sc_skipper' },
    once: true,
    weight: 14,
    actor: 'parent',
    text: {
      fr: [
        "{a.rel} brandit une lettre du lycée : « 14 demi-journées d'absence injustifiées. » Plus une copie du billet signé de « sa » main. Avec une faute à son propre nom.",
        "{a.rel} t'attend dans la cuisine, la lettre de la vie scolaire à la main, et ce calme terrifiant des grandes colères.",
      ],
      en: [
        "{a.rel} waves a letter from school: “14 unexcused absences.” Plus a copy of the note signed in “{a:his|her}” hand. With {a:his|her} own name misspelled.",
        "{a.rel} is waiting in the kitchen with the attendance office letter and that terrifying calm before a storm.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout avouer', en: 'Confess everything' },
        text: { fr: "J'ai tout avoué. {a.my} m'a puni{|e} un mois et m'accompagne désormais en cours. Jusqu'à la porte de la classe. En me faisant coucou.", en: "I confessed everything. {a.my} grounded me for a month and now walks me to school. To the classroom door. Waving." },
        fx: { happy: -6, discipline: 5, rel: 2, unflag: 'sc_skipper' },
        mood: 'sad',
      },
      {
        label: { fr: 'Accuser la poste', en: 'Blame the post office' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai expliqué qu'il y avait « une erreur informatique » et un élève homonyme. {a.my} a appelé le lycée. Il n'y a pas d'homonyme. Il n'y a jamais eu d'homonyme.", en: "I explained it was “a computer glitch” and a student with the same name. {a.my} called the school. There is no student with the same name. There never was." }, fx: { happy: -8, rel: -12, unflag: 'sc_skipper' }, mood: 'shock' },
          { w: 1, text: { fr: "« Bug informatique », ai-je dit avec aplomb. {a.my} m'a cru{|e}. Je n'en reviens toujours pas. Je n'ose plus sécher, par respect pour ce miracle.", en: "“Computer glitch,” I said with total confidence. {a.my} believed me. I still can't believe it. I don't dare skip anymore, out of respect for the miracle." }, fx: { happy: 4, karma: -3, unflag: 'sc_skipper' }, mood: 'proud' },
        ],
      },
    ],
  },
  {
    id: 'sc_election',
    icon: '🗳️',
    cat: 'school',
    scene: { place: 'school', mood: 'proud', fx: 'confetti' },
    when: { school: TEEN },
    once: true,
    text: {
      fr: [
        "Élections des délégués de classe. Ton adversaire promet « plus de récré ». C'est vague, populiste et terriblement efficace.",
        "Tu te présentes comme délégué{|e} de classe. Le débat a lieu demain, devant 28 électeurs au cerveau de poisson rouge.",
      ],
      en: [
        "Class president elections. Your opponent is promising “more recess.” It's vague, populist and terrifyingly effective.",
        "You're running for class rep. The debate is tomorrow, in front of 28 voters with the attention span of goldfish.",
      ],
    },
    choices: [
      {
        label: { fr: 'Programme sérieux', en: 'Serious platform' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai présenté un programme en dix points avec diapos. Élu{|e} avec 15 voix contre 13. La démocratie fonctionne, de justesse.", en: "I presented a ten-point plan with slides. Elected 15 to 13. Democracy works, barely." }, fx: { happy: 8, smarts: 2, fame: 1, discipline: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "Programme sérieux, diapos, graphiques. Battu{|e} 26 à 2 par « plus de récré ». J'ai voté pour moi. L'autre voix, c'est ma pitié.", en: "Serious plan, slides, charts. Crushed 26 to 2 by “more recess.” I voted for myself. The other vote was pity." }, fx: { happy: -6, smarts: 1 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Promettre des frites', en: 'Promise fries daily' },
        text: { fr: "J'ai promis des frites tous les jours à la cantine. Élu{|e} à l'unanimité. Évidemment, aucune frite. Ma popularité a chuté plus vite qu'un président.", en: "I promised fries every day at lunch. Elected unanimously. Obviously, no fries. My approval rating dropped faster than a president's." },
        fx: { happy: 5, karma: -2, fame: 1 },
      },
      {
        label: { fr: 'Acheter des voix', en: 'Buy votes with candy' },
        out: [
          { w: 2, text: { fr: "J'ai distribué des bonbons dans les rangs. Élu{|e} ! Corrompu{|e}, mais élu{|e}. C'est formateur.", en: "I handed out candy along the rows. Elected! Corrupt, but elected. Very educational." }, fx: { happy: 6, karma: -4, money: -10 }, mood: 'proud' },
          { w: 1, text: { fr: "Le prof principal m'a vu{|e} distribuer des bonbons. Disqualifié{|e} pour « corruption électorale ». J'ai treize ans et un scandale politique.", en: "The homeroom teacher saw me handing out candy. Disqualified for “election fraud.” I'm thirteen and I have a political scandal." }, fx: { happy: -6, karma: -3, money: -10 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'sc_principal_prank',
    icon: '🐐',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'happy', fx: 'poop' },
    when: { school: TEEN, age: [13, 17] },
    once: true,
    weight: 7,
    text: {
      fr: [
        "Tes potes ont un plan pour le dernier jour : piéger le bureau du proviseur. Les options sont toutes illégales, certaines sont odorantes.",
        "Le proviseur t'a confisqué ton téléphone pendant trois semaines. L'heure de la vengeance a sonné. Il part déjeuner à 12 h 10 pile.",
      ],
      en: [
        "Your friends have a plan for the last day: prank the principal's office. Every option is illegal, some are smelly.",
        "The principal confiscated your phone for three weeks. Vengeance time. He leaves for lunch at 12:10 sharp.",
      ],
    },
    choices: [
      {
        label: { fr: 'Poisson dans le radiateur', en: 'Fish in the radiator' },
        text: { fr: "J'ai caché un maquereau cru dans son radiateur. Trois semaines plus tard, l'odeur a fait évacuer l'aile administrative. Le proviseur a vomi dans sa corbeille. On ne m'a jamais soupçonné{|e}.", en: "I hid a raw mackerel in his radiator. Three weeks later the smell evacuated the admin wing. The principal threw up in his wastebasket. I was never suspected." },
        fx: { happy: 10, karma: -4, fame: 2, flag: 'sc_troublemaker', visual: 'poop' },
        mood: 'happy',
      },
      {
        label: { fr: 'Une chèvre dans le bureau', en: 'Goat in the office' },
        out: [
          { w: 2, text: { fr: "On a fait entrer une chèvre dans son bureau. Elle a mangé le règlement intérieur et chié sur son fauteuil en cuir. Le proviseur l'a adoptée. Elle s'appelle Joséphine.", en: "We snuck a goat into his office. She ate the school rulebook and pooped on his leather chair. The principal adopted her. Her name is Josephine." }, fx: { happy: 12, fame: 3, karma: -2, flag: 'sc_troublemaker' }, mood: 'party' },
          { w: 1, text: { fr: "La chèvre m'a dénoncé{|e}. Littéralement : elle m'a suivi{|e} partout en bêlant jusqu'au bureau du CPE. Renvoyé{|e} de l'établissement. La chèvre, elle, est restée.", en: "The goat ratted me out. Literally: she followed me everywhere bleating, all the way to the dean's office. Expelled. The goat stayed." }, fx: { expel: true, happy: -8, fame: 2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Juste du papier toilette', en: 'Just toilet paper' },
        text: { fr: "J'ai momifié sa voiture au papier toilette. Il a plu. La voiture est maintenant recouverte de papier mâché pour toujours. C'est presque de l'art.", en: "I mummified his car in toilet paper. It rained. The car is now permanently coated in papier-mâché. It's almost art." },
        fx: { happy: 7, karma: -1, flag: 'sc_troublemaker' },
      },
    ],
  },
  {
    id: 'sc_yearbook',
    icon: '📔',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'neutral' },
    when: { school: 'high', age: [16, 17] },
    once: true,
    text: {
      fr: [
        "L'album de fin d'année est sorti. Tu tournes les pages jusqu'à ta photo, le cœur battant, pour découvrir ta « prédiction ».",
        "L'album de promo circule. Sous chaque photo, une catégorie votée par la classe. Tu cherches la tienne en tremblant légèrement.",
      ],
      en: [
        "The yearbook is out. You flip to your photo, heart pounding, to see your “superlative.”",
        "The yearbook is going around. Under each photo, a category voted by the class. You search for yours, slightly trembling.",
      ],
    },
    choices: [
      {
        label: { fr: 'Regarder', en: 'Look' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "« Le/la plus susceptible de devenir milliardaire. » Je vais encadrer la page. Et l'envoyer à tous ceux qui ont douté. Plus tard.", en: "“Most likely to become a billionaire.” I'm framing the page. And mailing it to every doubter. Later." }, fx: { happy: 8 }, mood: 'proud' },
          { w: 1, odds: { looks: 1 }, text: { fr: "« Le plus beau sourire. » Je souris depuis trois jours. J'ai des crampes aux joues.", en: "“Best smile.” I've been smiling for three days. My cheeks are cramping." }, fx: { happy: 7, looks: 2 }, mood: 'happy' },
          { w: 1, text: { fr: "« Le/la plus susceptible de finir en garde à vue. » Ma mère l'a lu et a acheté une deuxième serrure.", en: "“Most likely to get arrested.” My mom read it and bought a second lock." }, fx: { happy: -2, fame: 1 } },
          { w: 1, text: { fr: "Sous ma photo, ils ont écrit « Qui ? ». Trois ans dans cette classe. Trois ans. « Qui ? »", en: "Under my photo they wrote “Who?” Three years in this class. Three years. “Who?”" }, fx: { happy: -8 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Écrire des dédicaces', en: 'Sign everyone\'s book' },
        text: { fr: "J'ai écrit « Reste comme tu es, sauf ta coupe » dans quarante albums. Effort minimum, impact maximum. Deux personnes ont pleuré.", en: "I wrote “Never change, except your haircut” in forty yearbooks. Minimum effort, maximum impact. Two people cried." },
        fx: { happy: 4, karma: -1 },
      },
    ],
  },
  {
    id: 'sc_grad_trip',
    icon: '🏖️',
    cat: 'school',
    rating: 1,
    scene: { place: 'beach', mood: 'party' },
    when: { school: 'high', age: [17, 17] },
    once: true,
    vars: { amount: [200, 800] },
    text: {
      fr: [
        "Voyage de fin d'études ! Une semaine en Espagne avec ta promo, dans un hôtel dont la piscine est verte et le directeur s'appelle Paco.",
        "La promo part en voyage de fin d'année. Prix : {$amount}. Au programme officiel : « visites culturelles ». Au programme réel : pas vraiment.",
      ],
      en: [
        "Senior trip! A week in Spain with your class, in a hotel with a green pool and a manager named Paco.",
        "Your class is going on a senior trip. Price: {$amount}. Official itinerary: “cultural visits.” Real itinerary: not really.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout faire à fond', en: 'Go full send' },
        out: [
          { w: 2, text: { fr: "Une semaine de folie : banane gonflable, karaoké, coup de soleil au troisième degré en forme de débardeur. Meilleurs souvenirs de ma vie. {$amount} bien dépensés.", en: "A wild week: inflatable banana boat, karaoke, third-degree sunburn in the shape of a tank top. Best memories of my life. {$amount} well spent." }, fx: { happy: 15, money: '-amount', disease: 'sunburn' }, mood: 'party' },
          { w: 1, text: { fr: "J'ai bu un cocktail bleu offert par Paco. Je me suis réveillé{|e} dans la piscine verte, avec une moustache dessinée au feutre indélébile. Sur la photo de promo, elle est très visible.", en: "I drank a blue cocktail from Paco. Woke up in the green pool with a mustache drawn in permanent marker. It's very visible in the class photo." }, fx: { happy: 6, health: -4, money: '-amount' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire les visites', en: 'Actually sightsee' },
        text: { fr: "J'ai été le seul élève à faire les visites culturelles. Le prof m'a acheté une glace et m'a confié sa vie. J'en sais trop sur son divorce.", en: "I was the only student who did the cultural visits. The teacher bought me ice cream and told me his whole life. I know too much about his divorce." },
        fx: { smarts: 4, happy: 5, money: '-amount' },
      },
      {
        label: { fr: 'Rester à la maison', en: 'Stay home' },
        text: { fr: "Trop cher, je suis resté{|e}. J'ai vu le voyage en stories, minute par minute. J'ai quand même attrapé un coup de soleil sur mon balcon, par solidarité.", en: "Too expensive, I stayed home. I watched the trip via stories, minute by minute. I still got a sunburn on my balcony, in solidarity." },
        fx: { happy: -4 },
      },
    ],
  },
  {
    id: 'sc_job_interview',
    icon: '🍔',
    cat: 'school',
    rating: 1,
    scene: { place: 'office', mood: 'neutral' },
    when: { age: [15, 17], job: false },
    once: true,
    text: {
      fr: [
        "Premier entretien d'embauche de ta vie, dans un fast-food. Le manager a 19 ans, une moustache naissante et un badge « Employé du mois — mars 2019 ».",
        "Tu postules pour un job d'été au supermarché du coin. Le responsable te regarde de haut en bas et lâche : « Bon. Pourquoi toi ? »",
      ],
      en: [
        "Your first job interview ever, at a burger joint. The manager is 19, has a budding mustache and a badge that says “Employee of the Month — March 2019.”",
        "You're applying for a summer job at the local supermarket. The manager looks you up and down and says: “Alright. Why you?”",
      ],
    },
    choices: [
      {
        label: { fr: 'Mentir sur le CV', en: 'Lie on the résumé' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai prétendu avoir « cinq ans d'expérience en restauration ». J'ai 16 ans. Il a dit : « Impressionnant, tu commences lundi. » Les standards sont bas, et moi aussi.", en: "I claimed “five years of restaurant experience.” I'm 16. He said, “Impressive, you start Monday.” Standards are low, and so am I." }, fx: { happy: 6, karma: -2, open: 'jobs' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai prétendu parler couramment japonais. Il m'a répondu en japonais. Le silence a duré onze secondes. Il a dit : « Putain, t'es culotté{|e}. » Pas embauché{|e}, mais respecté{|e}.", en: "I claimed to be fluent in Japanese. He answered in Japanese. The silence lasted eleven seconds. He said, “Damn, you've got balls.” Not hired, but respected." }, fx: { happy: -3 } },
        ],
      },
      {
        label: { fr: 'Être honnête', en: 'Be honest' },
        text: { fr: "« Je n'ai aucune expérience mais je sais compter et je ne mange pas les produits. » Embauché{|e}. C'était la bonne réponse, apparemment.", en: "“I have no experience, but I can count and I won't eat the merchandise.” Hired. Apparently that was the right answer." },
        fx: { happy: 5, karma: 2, open: 'jobs' },
      },
      {
        label: { fr: 'Venir avec ses parents', en: 'Bring a parent' },
        text: { fr: "Ma mère est venue à l'entretien et a répondu à toutes les questions à ma place. Elle a été embauchée. Pas moi. Elle travaille au rayon frais maintenant.", en: "My mom came to the interview and answered every question for me. She got hired. I didn't. She works in dairy now." },
        fx: { happy: -5 },
        mood: 'shock',
      },
    ],
  },
  {
    id: 'sc_exam_results',
    icon: '📜',
    cat: 'school',
    scene: { place: 'school', mood: 'neutral' },
    when: { school: ['middle', 'high'], age: [15, 17] },
    cooldown: 2,
    text: {
      fr: [
        "Résultats des examens, affichés sur un panneau dans la cour. Une foule hurle, pleure, se prend en photo. Tu cherches ton nom en remontant la liste avec le doigt.",
        "Jour des résultats. Ton téléphone affiche « Résultats disponibles ». Ton pouce plane au-dessus de l'écran depuis quatre minutes.",
      ],
      en: [
        "Exam results posted on a board in the courtyard. A crowd is screaming, crying, taking selfies. You run your finger up the list looking for your name.",
        "Results day. Your phone says “Results available.” Your thumb has been hovering over the screen for four minutes.",
      ],
    },
    choices: [
      {
        label: { fr: 'Regarder maintenant', en: 'Look now' },
        out: [
          { w: 1, odds: { smarts: 1.5 }, text: { fr: "Admis{|e} avec mention ! J'ai crié si fort qu'un pigeon a fait une crise cardiaque. Mes parents ont posté 14 photos de moi sur Facebook.", en: "Passed with honors! I screamed so loud a pigeon had a heart attack. My parents posted 14 photos of me on Facebook." }, fx: { happy: 12, grade: 5, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "Admis{|e}, de justesse, à un dixième de point. Un dixième. Je remercie la question bonus sur les volcans, mon unique passion.", en: "Passed, barely, by a fraction of a point. A fraction. Thanks to the bonus question on volcanoes, my one true passion." }, fx: { happy: 6 }, mood: 'happy' },
          { w: 1, odds: { smarts: -1 }, text: { fr: "Recalé{|e}. Je suis allé{|e} au rattrapage et j'ai expliqué la Seconde Guerre mondiale en partant de Napoléon. L'examinateur a pris des notes. Pas pour moi.", en: "Failed. I went to the retake and explained World War II starting from Napoleon. The examiner took notes. Not for me." }, fx: { happy: -10, grade: -5, stress: 8 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Laisser ses parents regarder', en: 'Let your parents look' },
        text: { fr: "J'ai laissé mes parents regarder. Ils ont crié. Je ne sais toujours pas si c'était de joie. Ils ne me l'ont jamais dit. Ils m'ont juste fait des crêpes, ce qui est mystérieux.", en: "I let my parents look. They screamed. I still don't know if it was joy. They never told me. They just made me pancakes, which is mysterious." },
        fx: { happy: 4, stress: 3 },
      },
    ],
  },
  {
    id: 'sc_choose_major',
    icon: '🎓',
    cat: 'school',
    scene: { place: 'home', mood: 'neutral', prop: 'laptop' },
    when: { school: 'high', age: [17, 17] },
    once: true,
    weight: 14,
    text: {
      fr: [
        "Dernière ligne droite : il faut remplir tes vœux pour la fac avant minuit. Le site plante toutes les quatre minutes. Il est 23 h 41.",
        "Salon de l'étudiant : 300 stands, 300 brochures, 300 personnes qui te promettent « un avenir ». Il faut choisir ta filière.",
      ],
      en: [
        "Home stretch: your college applications are due by midnight. The website crashes every four minutes. It's 11:41 p.m.",
        "College fair: 300 booths, 300 brochures, 300 people promising you “a future.” Time to pick a major.",
      ],
    },
    choices: [
      {
        label: { fr: 'Choisir sa filière', en: 'Pick a major' },
        text: { fr: "J'ai cliqué sur « valider » à 23 h 59 et 58 secondes. Mon cœur a fait un salto. Mon avenir est en route. Je ne sais pas où il va, mais il roule.", en: "I clicked “submit” at 11:59:58 p.m. My heart did a backflip. My future is on its way. No idea where it's going, but it's moving." },
        fx: { happy: 5, stress: 4, open: 'university' },
        mood: 'proud',
      },
      {
        label: { fr: 'Faire un test d\'orientation', en: 'Take a career quiz' },
        text: { fr: "Un quiz en ligne m'a dit que j'étais fait{|e} pour « gardien{|ne} de phare ». J'ai pris ça comme un signe et je suis allé{|e} voir les vraies options.", en: "An online quiz said I was born to be a “lighthouse keeper.” I took it as a sign and went to look at the real options." },
        fx: { smarts: 1, open: 'university' },
      },
      {
        label: { fr: 'Pas de fac pour moi', en: 'College? Nah' },
        text: { fr: "J'ai fermé l'ordinateur. Pas de fac pour moi. Mes parents ont fait la tête que font les gens quand leur GPS dit « recalcul de l'itinéraire ».", en: "I closed the laptop. No college for me. My parents made the face people make when their GPS says “recalculating.”" },
        fx: { happy: 2, stress: -3 },
      },
    ],
  },
  {
    id: 'sc_driving_school',
    icon: '🚗',
    cat: 'school',
    rating: 1,
    scene: { place: 'park', mood: 'shock' },
    when: { age: [16, 17] },
    once: true,
    vars: { amount: [300, 1200] },
    text: {
      fr: [
        "Première leçon à l'auto-école. Ton moniteur, Gérard, fume en cachette, a vu « des choses » et appuie sur la double pédale toutes les huit secondes.",
        "Leçon de conduite n°4 avec Gérard, le moniteur. Aujourd'hui : le rond-point de la zone commerciale. Le Vietnam des auto-écoles. Le forfait t'a coûté {$amount}.",
      ],
      en: [
        "First lesson at driving school. Your instructor Gerald smokes on the sly, has seen “things” and slams the dual brake every eight seconds.",
        "Driving lesson #4 with Gerald the instructor. Today: the big roundabout by the mall. The Vietnam of driving schools. The package cost you {$amount}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Foncer dans le rond-point', en: 'Charge the roundabout' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: "Trois tours de rond-point sans m'arrêter, parce que je n'ai pas trouvé la sortie. Gérard a fermé les yeux et murmuré « bordel de Dieu ». Mais personne n'est mort.", en: "Three laps of the roundabout nonstop, because I couldn't find the exit. Gerald closed his eyes and muttered “Jesus H. Christ.” But nobody died." }, fx: { happy: 2, money: '-amount', discipline: 2 } },
          { w: 1, text: { fr: "J'ai calé au milieu du rond-point. Un camion de livraison m'a klaxonné pendant 40 secondes. Gérard a allumé une cigarette dans la voiture. « On s'en fout, maintenant. »", en: "I stalled in the middle of the roundabout. A delivery truck honked for 40 seconds. Gerald lit a cigarette in the car. “Screw it now.”" }, fx: { happy: -5, stress: 6, money: '-amount' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Rouler à 20 km/h', en: 'Drive at 12 mph' },
        text: { fr: "J'ai roulé à 20 km/h sur la voie rapide. Une mamie en vélo nous a doublés. Gérard l'a saluée. Ils se connaissent.", en: "I drove 12 mph on the highway. A granny on a bicycle passed us. Gerald waved. They know each other." },
        fx: { happy: -2, discipline: 3, money: '-amount' },
      },
      {
        label: { fr: 'Passer le code d\'abord', en: 'Study theory first' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai bossé le code jusqu'à le connaître par cœur. Je peux réciter les distances de freinage sur sol mouillé à 3 h du matin. Gérard m'a appelé{|e} « l'intello du volant ».", en: "I studied the theory until I knew it by heart. I can recite wet-road braking distances at 3 a.m. Gerald calls me “the steering-wheel nerd.”" }, fx: { smarts: 3, money: '-amount' }, mood: 'proud' },
          { w: 1, text: { fr: "Recalé{|e} au code avec 29 fautes sur 40. J'ai répondu « accélérer » à une question sur un enfant qui traverse. Je pense que c'était une erreur de clic. Je pense.", en: "Failed the written test, 29 wrong out of 40. I answered “accelerate” to a question about a child crossing. I think it was a misclick. I think." }, fx: { happy: -4, money: '-amount' } },
        ],
      },
    ],
  },
  {
    id: 'sc_phone_get',
    icon: '📲',
    cat: 'school',
    scene: { place: 'home', mood: 'happy' },
    when: { age: [10, 14], noFlag: 'sc_has_phone', era: [2007, 2100] },
    once: true,
    actor: 'parent',
    text: {
      fr: [
        "Toute ta classe a un téléphone, sauf toi et un garçon dont les parents « font de la permaculture ». Tu dois convaincre {a.rel}.",
        "{a.rel} pose une boîte sur la table. Un téléphone ! Ancien modèle, coque à paillettes, mais un téléphone. « Il y a des règles », prévient {a.he}.",
      ],
      en: [
        "Your whole class has a phone except you and a boy whose parents “do permaculture.” You have to convince {a.rel}.",
        "{a.rel} sets a box on the table. A phone! Old model, glitter case, but a phone. “There are rules,” {a.he} warns.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire une présentation', en: 'Make a slideshow' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai fait un diaporama de 22 slides : « Le téléphone, un outil de sécurité ». {a.my} a cédé à la slide 14 (photo d'un enfant perdu en forêt). J'ai un téléphone !", en: "I made a 22-slide presentation: “The Phone: A Safety Tool.” {a.my} caved at slide 14 (photo of a kid lost in the woods). I have a phone!" }, fx: { happy: 10, smarts: 2, flag: 'sc_has_phone' }, mood: 'happy' },
          { w: 1, text: { fr: "{a.my} a écouté ma présentation, applaudi, puis dit non. « Mais c'était très bien construit. » La pire des défaites.", en: "{a.my} watched my presentation, applauded, then said no. “But it was very well structured.” The worst kind of defeat." }, fx: { happy: -5, smarts: 1 } },
        ],
      },
      {
        label: { fr: 'Accepter les règles', en: 'Accept the rules' },
        text: { fr: "J'ai signé un contrat de trois pages : pas de téléphone à table, couvre-feu à 21 h, contrôle parental. J'ai déjà trouvé comment contourner le contrôle parental.", en: "I signed a three-page contract: no phone at dinner, 9 p.m. curfew, parental controls. I've already figured out how to bypass the parental controls." },
        fx: { happy: 8, rel: 4, flag: 'sc_has_phone' },
        mood: 'happy',
      },
      {
        label: { fr: 'Bouder une semaine', en: 'Sulk for a week' },
        text: { fr: "J'ai boudé une semaine entière, dans un silence de moine. {a.my} a fini par craquer. Méthode douteuse, résultat excellent.", en: "I sulked for a whole week in monk-like silence. {a.my} finally cracked. Questionable method, excellent result." },
        fx: { happy: 6, rel: -6, flag: 'sc_has_phone' },
      },
    ],
  },
  {
    id: 'sc_social_drama',
    icon: '💬',
    cat: 'school',
    rating: 1,
    scene: { place: 'home', mood: 'shock' },
    when: { age: [13, 17], school: TEEN, era: [2010, 2100] },
    cooldown: 3,
    actor: 'classmate',
    text: {
      fr: [
        "Une capture d'écran de ta conversation privée, où tu dis que {a.first} « a la personnalité d'une biscotte », circule dans tout le lycée.",
        "{a.first} a posté une story sur « les faux amis qui parlent dans le dos ». Avec une musique triste. Tout le monde sait que c'est toi.",
      ],
      en: [
        "A screenshot of your private chat, where you said {a.first} “has the personality of a cracker,” is going around the whole school.",
        "{a.first} posted a story about “fake friends who talk behind your back.” With sad music. Everyone knows it's about you.",
      ],
    },
    choices: [
      {
        label: { fr: "S'excuser en privé", en: 'Apologize privately' },
        text: { fr: "J'ai écrit un long message d'excuses à {a.first}. Vu à 22 h 14. Pas de réponse. Puis un simple « ok ». La blessure la plus profonde de ma vie tient en deux lettres.", en: "I sent {a.first} a long apology. Seen at 10:14 p.m. No reply. Then just “ok.” The deepest wound of my life is two letters long." },
        fx: { happy: -4, karma: 3, rel: 8 },
      },
      {
        label: { fr: 'Contre-attaquer en story', en: 'Fire back with a story' },
        out: [
          { w: 1, odds: { looks: 0.5 }, text: { fr: "J'ai posté une story encore plus cinglante. Les likes ont explosé. J'ai gagné la guerre, perdu un{|e} ami{|e}, et ma mère m'a demandé ce que voulait dire « ratio ».", en: "I posted an even more savage story. The likes exploded. I won the war, lost a friend, and my mom asked what “ratio” means." }, fx: { happy: 4, followers: 150, rel: -25, karma: -3, actorRole: 'enemy' }, mood: 'proud' },
          { w: 1, text: { fr: "Ma contre-attaque a fait un flop total. Douze vues, dont ma tante. Elle a commenté « courage ma puce ❤️ » en public.", en: "My comeback flopped completely. Twelve views, including my aunt. She commented “stay strong sweetie ❤️” publicly." }, fx: { happy: -8, rel: -10 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Supprimer tous ses comptes', en: 'Delete all accounts' },
        text: { fr: "J'ai tout supprimé. Une semaine de paix, de livres et d'herbe verte. Puis j'ai tout recréé, avec un pseudo différent. Je suis faible.", en: "I deleted everything. A week of peace, books and green grass. Then I recreated everything under a new username. I am weak." },
        fx: { happy: 3, stress: -6, smarts: 1 },
      },
    ],
  },
  {
    id: 'sc_puberty_bo',
    icon: '🧴',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'shock' },
    when: { age: [11, 14], school: ['primary', 'middle'] },
    once: true,
    actor: 'parent',
    text: {
      fr: [
        "Après le cours de sport, ton voisin se décale discrètement d'une chaise. Puis d'une deuxième. Ce matin, {a.rel} a posé un déodorant sur ton lit. Sans un mot.",
        "Pour ton anniversaire, devant tous tes copains, {a.rel} t'offre un paquet joliment emballé. C'est un kit « Mon corps change ! » avec un déodorant et une brochure illustrée.",
      ],
      en: [
        "After gym class, the kid next to you quietly scoots one chair over. Then another. This morning {a.rel} left deodorant on your bed. Without a word.",
        "For your birthday, in front of all your friends, {a.rel} hands you a nicely wrapped gift. It's a “My Body Is Changing!” kit with deodorant and an illustrated pamphlet.",
      ],
    },
    choices: [
      {
        label: { fr: 'Utiliser tout le flacon', en: 'Use the whole can' },
        text: { fr: "J'ai vidé le déodorant entier sur moi. On m'a senti{|e} arriver depuis le portail. La prof d'anglais a fait une crise d'asthme. Mais je ne sentais plus la soupe.", en: "I emptied the whole can on myself. People could smell me from the front gate. The English teacher had an asthma attack. But I no longer smelled like soup." },
        fx: { happy: 2, looks: 2 },
        mood: 'proud',
      },
      {
        label: { fr: 'Mourir de honte', en: 'Die of shame' },
        text: { fr: "Je suis mort{|e} de honte. Mes copains ont lu la brochure à voix haute, avec les illustrations. J'ai déménagé intérieurement sous mon lit pendant trois jours.", en: "I died of shame. My friends read the pamphlet out loud, illustrations included. I moved in under my bed, emotionally, for three days." },
        fx: { happy: -7, rel: -5, stress: 4 },
        mood: 'cry',
      },
      {
        label: { fr: "Nier l'évidence", en: 'Deny everything' },
        text: { fr: "J'ai affirmé que je ne sentais rien et que « c'est le gymnase qui pue ». Trois semaines plus tard, même mon chien m'évitait. J'ai cédé.", en: "I insisted I didn't smell and “it's the gym that stinks.” Three weeks later even the dog avoided me. I gave in." },
        fx: { happy: -3, looks: -2 },
      },
    ],
  },
  {
    id: 'sc_first_party',
    icon: '🍹',
    cat: 'school',
    rating: 1,
    scene: { place: 'beach', mood: 'party' },
    when: { age: [16, 17], school: 'high' },
    once: true,
    actor: 'classmate',
    text: {
      fr: [
        "Soirée de fin d'épreuves sur la plage, autour d'un feu. {a.first} sort de son sac une bouteille sans étiquette : « La gnôle de mon grand-père. Il dit que ça soigne tout. »",
        "Fête de fin d'année au bord du lac. Il y a un pack de bières tièdes, un rosé à 2,99 € et {a.first} qui te tend un gobelet rouge : « Allez, juste un. »",
      ],
      en: [
        "End-of-exams party on the beach, around a bonfire. {a.first} pulls an unlabeled bottle from a bag: “My grandpa's moonshine. He says it cures everything.”",
        "End-of-year party by the lake. A pack of warm beers, a $3 rosé, and {a.first} handing you a red cup: “Come on, just one.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Juste un verre', en: 'Just one drink' },
        text: { fr: "J'ai bu un verre. Pas terrible. J'ai fait une grimace de chat qui mange un citron, puis j'ai passé la soirée à rire autour du feu. C'était parfait comme ça.", en: "I had one drink. Not great. I made the face of a cat eating a lemon, then spent the night laughing by the fire. It was perfect like that." },
        fx: { happy: 8, rel: 8 },
        mood: 'party',
      },
      {
        label: { fr: 'Goûter la gnôle', en: 'Try the moonshine' },
        out: [
          { w: 2, text: { fr: "J'ai bu une gorgée de gnôle. J'ai vu mes ancêtres. Ils m'ont dit de ralentir. J'ai passé le reste de la soirée allongé{|e} sur le sable, à parler à une mouette.", en: "I took a sip of moonshine. I saw my ancestors. They told me to slow down. I spent the rest of the night lying in the sand, talking to a seagull." }, fx: { happy: 4, health: -4, addiction: ['alcohol', 5] }, mood: 'sleepy' },
          { w: 1, rating: 2, text: { fr: "Trois gorgées de gnôle. J'ai vomi dans le feu, ce qui a fait une flamme bleue magnifique et un bruit de friture. Puis sur les chaussures de {a.first}. Puis dans mon propre sac. Je suis rentré{|e} pieds nus et sans dignité.", en: "Three sips of moonshine. I puked into the fire, which made a beautiful blue flame and a sizzling sound. Then on {a.first}'s shoes. Then into my own bag. I walked home barefoot and dignity-free." }, fx: { happy: -6, health: -6, rel: -10, addiction: ['alcohol', 5], visual: 'fire' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Rester au soda', en: 'Stick to soda' },
        text: { fr: "Je suis resté{|e} au soda et j'ai joué les chauffeurs. J'ai ramené quatre personnes chez elles, dont une qui chantait du Céline Dion en pleurant. Je suis le parent de la bande.", en: "I stuck to soda and played designated adult. I walked four people home, one of whom sang Celine Dion while crying. I'm the group's parent now." },
        fx: { happy: 4, karma: 4, rel: 5 },
      },
    ],
  },
  {
    id: 'sc_dodgeball',
    icon: '🔴',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'shock', fx: 'gore' },
    when: { school: ['primary', 'middle'] },
    cooldown: 4,
    text: {
      fr: [
        "Balle aux prisonniers en EPS. En face, le redoublant de 15 ans qui a de la moustache et une haine profonde pour l'humanité. Il te vise.",
        "Ballon chasseur. Il ne reste que toi dans ton équipe. L'autre camp a trois ballons et un regard de requin.",
      ],
      en: [
        "Dodgeball in gym. On the other side: the 15-year-old held-back kid with a mustache and a deep hatred of humanity. He's aiming at you.",
        "Dodgeball. You're the last one left on your team. The other side has three balls and the eyes of sharks.",
      ],
    },
    choices: [
      {
        label: { fr: 'Esquiver comme Neo', en: 'Dodge like Neo' },
        out: [
          { w: 1, odds: { athletic: 1.5 }, text: { fr: "J'ai esquivé trois ballons en mode Matrix, puis gagné le match seul{|e}. Le prof a sifflé si fort qu'il a avalé son sifflet. Je suis une légende du gymnase.", en: "I dodged three balls Matrix-style, then won the game single-handedly. The coach blew his whistle so hard he swallowed it. I'm a gym legend." }, fx: { happy: 10, athletic: 3, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: "Le ballon m'a pris en pleine face. Mon nez a fait « crac », le sang a giclé sur le parquet en forme de point d'exclamation, et une de mes dents est partie rejoindre les balles sous les gradins.", en: "The ball hit me square in the face. My nose went “crack,” blood spurted on the gym floor in the shape of an exclamation mark, and one of my teeth went to join the balls under the bleachers." }, fx: { health: -8, looks: -3, happy: -6, visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Le viser à l\'entrejambe', en: 'Aim below the belt' },
        text: { fr: "Je l'ai visé là où ça fait mal. Il s'est effondré comme un immeuble dynamité, en émettant un son de bouilloire. Victoire. Je dois maintenant changer de trajet pour rentrer chez moi.", en: "I aimed where it hurts. He collapsed like a demolished building, making a kettle noise. Victory. I now have to take a different route home." },
        fx: { happy: 7, karma: -3 },
        mood: 'happy',
      },
      {
        label: { fr: 'Faire le mort', en: 'Play dead' },
        text: { fr: "Je me suis jeté{|e} au sol et j'ai fait le mort. Ça n'existe pas, comme règle. Personne n'a osé me toucher pendant 20 minutes. J'ai gagné par malaise collectif.", en: "I threw myself on the floor and played dead. That's not a rule. Nobody dared touch me for 20 minutes. I won through collective discomfort." },
        fx: { happy: 4, smarts: 1 },
      },
    ],
  },
  {
    id: 'sc_frog',
    icon: '🐸',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'sick', fx: 'gore' },
    when: { school: TEEN },
    once: true,
    text: {
      fr: [
        "TP de SVT : dissection de grenouille. Ta grenouille s'appelle désormais Jean-Pierre, elle est sur le dos, et elle a l'air de te juger malgré le formol.",
        "Dissection en SVT. Sur ton plateau, une grenouille, un scalpel et une odeur de formol qui donne envie de mourir. Ton binôme est déjà blanc comme un linge.",
      ],
      en: [
        "Biology lab: frog dissection. Your frog is now named Gerald, it's on its back, and it seems to judge you despite the formaldehyde.",
        "Dissection day. On your tray: a frog, a scalpel and a formaldehyde smell that makes you want to die. Your lab partner is already white as a sheet.",
      ],
    },
    choices: [
      {
        label: { fr: 'Disséquer avec passion', en: 'Dissect with passion' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai disséqué Jean-Pierre avec une précision de chirurgien. J'ai identifié le foie, le cœur et un petit morceau de mouche non digérée. Le prof a dit que j'avais « des mains en or ». Mon binôme a vomi.", en: "I dissected Gerald with surgical precision. Found the liver, the heart and a tiny bit of undigested fly. The teacher said I had “golden hands.” My partner threw up." }, fx: { smarts: 4, grade: 4, flag: 'sc_surgeon_hands' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai appuyé trop fort. La grenouille a éclaté comme un raisin trop mûr, et une giclée de tripes vertes a atterri dans les cheveux de la déléguée. Elle crie encore, quelque part.", en: "I pressed too hard. The frog burst like an overripe grape and a squirt of green guts landed in the class rep's hair. She's still screaming somewhere." }, fx: { happy: 3, grade: -2, karma: -1, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire parler la grenouille', en: 'Puppet the frog' },
        text: { fr: "J'ai fait danser Jean-Pierre en chantant « Les Lacs du Connemara ». La moitié de la classe a pleuré de rire, l'autre moitié a pleuré tout court. Le prof m'a sorti{|e}. Jean-Pierre, lui, est resté.", en: "I made Gerald dance while singing “Macarena.” Half the class cried laughing, the other half just cried. The teacher kicked me out. Gerald stayed." },
        fx: { happy: 7, discipline: -3, grade: -2 },
        mood: 'happy',
      },
      {
        label: { fr: 'Libérer la grenouille', en: 'Free the frog' },
        text: { fr: "J'ai « libéré » Jean-Pierre dans l'étang du parc. Il était mort et ouvert en deux. Il a coulé. J'ai organisé une minute de silence. Mes potes me trouvent bizarre et ils ont raison.", en: "I “freed” Gerald in the park pond. He was dead and split open. He sank. I held a moment of silence. My friends think I'm weird, and they're right." },
        fx: { karma: 2, happy: -1, grade: -3 },
      },
    ],
  },
  {
    id: 'sc_food_fight',
    icon: '🍝',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'party' },
    when: { school: TEEN },
    once: true,
    text: {
      fr: [
        "À la cantine, quelqu'un lance une boulette de purée. Elle s'écrase sur la nuque d'un terminale. Silence. Puis quelqu'un hurle « BATAILLE ! ».",
        "Dernier jour avant les vacances : la cantine est une poudrière. Un yaourt vole déjà au-dessus de la table des profs.",
      ],
      en: [
        "In the cafeteria, someone throws a lump of mashed potatoes. It splats on a senior's neck. Silence. Then someone yells “FOOD FIGHT!”",
        "Last day before vacation: the cafeteria is a powder keg. A yogurt is already flying over the teachers' table.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rejoindre la guerre', en: 'Join the war' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai lancé des petits pois en rafale comme une mitraillette. Un tir parfait de spaghetti bolo a fini sur le CPE. Je n'ai jamais été aussi vivant{|e}.", en: "I fired peas like a machine gun. A perfect spaghetti shot landed on the dean. I have never felt so alive." }, fx: { happy: 10, discipline: -3, flag: 'sc_troublemaker' }, mood: 'party' },
          { w: 1, text: { fr: "J'ai pris un flan entier en pleine figure, lancé par la dame de la cantine elle-même. Elle visait. Elle n'a jamais raté de sa vie.", en: "I took a whole custard to the face, thrown by the lunch lady herself. She was aiming. She has never missed in her life." }, fx: { happy: -3, looks: -1 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Se cacher sous la table', en: 'Hide under the table' },
        text: { fr: "Je me suis caché{|e} sous la table avec mon plateau, et j'ai fini mon repas tranquillement pendant que le chaos régnait. Le dessert était bon.", en: "I hid under the table with my tray and finished my lunch in peace while chaos reigned. Dessert was good." },
        fx: { happy: 3, discipline: 2 },
      },
      {
        label: { fr: 'Tout filmer', en: 'Film everything' },
        text: { fr: "J'ai tout filmé au ralenti. La vidéo a fait le tour de la ville. Le proviseur l'a utilisée pour identifier les coupables. Je suis à la fois une star et un indic.", en: "I filmed it all in slow motion. The video went all over town. The principal used it to identify the culprits. I'm both a star and an informant." },
        fx: { fame: 3, followers: 400, karma: -2 },
      },
    ],
  },
  {
    id: 'sc_fire_drill',
    icon: '🚽',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'shock', fx: 'poop' },
    when: { school: ['primary', 'middle', 'high'] },
    once: true,
    weight: 6,
    text: {
      fr: [
        "Tu es aux toilettes, en pleine… opération délicate, quand l'alarme incendie se met à hurler. Toute l'école évacue dans la cour.",
        "Exercice d'évacuation surprise. Problème : tu es enfermé{|e} dans les WC du deuxième étage, et pas pour te laver les mains.",
      ],
      en: [
        "You're in the bathroom, mid… delicate operation, when the fire alarm starts blaring. The whole school is evacuating to the yard.",
        "Surprise fire drill. Problem: you're locked in a second-floor stall, and not to wash your hands.",
      ],
    },
    choices: [
      {
        label: { fr: 'Évacuer immédiatement', en: 'Evacuate immediately' },
        text: { fr: "J'ai évacué immédiatement, en courant, le pantalon à mi-fesses et un mètre de papier toilette coincé dans la ceinture, flottant derrière moi comme une traîne de mariée. Huit cents élèves ont vu ça. Le directeur a dit « bravo pour la réactivité ».", en: "I evacuated immediately, running, pants at half-mast and three feet of toilet paper stuck in my waistband, trailing behind me like a bridal veil. Eight hundred students saw it. The principal said “great reaction time.”" },
        fx: { happy: -8, fame: 2, discipline: 2 },
        mood: 'cry',
      },
      {
        label: { fr: 'Finir ce qui est commencé', en: 'Finish the job' },
        text: { fr: "J'ai fini. Les pompiers ont fait le tour des bâtiments et m'ont trouvé{|e}. L'un d'eux a dit « Oh putain » en ouvrant la porte. Il n'avait pas de masque. Il en a maintenant un, en permanence.", en: "I finished. The firefighters swept the building and found me. One of them said “Oh, holy crap” opening the door. He didn't have a mask. He wears one permanently now." },
        fx: { happy: 2, discipline: -2, karma: -1, visual: 'poop' },
        mood: 'shock',
      },
      {
        label: { fr: 'Rester planqué{|e}', en: 'Hide and wait' },
        text: { fr: "Je suis resté{|e} caché{|e} en silence. On m'a compté{|e} parmi les « disparus ». Mes parents ont été appelés. J'ai réapparu après 40 minutes, très détendu{|e}. Ma mère m'a frappé{|e} avec son sac à main.", en: "I stayed hidden in silence. I was listed as “missing.” My parents were called. I reappeared 40 minutes later, very relaxed. My mom hit me with her purse." },
        fx: { happy: -3, discipline: -3 },
      },
    ],
  },
  {
    id: 'sc_exam_gastro',
    icon: '🌋',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'sick', fx: 'poop' },
    when: { school: 'high', age: [15, 17] },
    once: true,
    weight: 6,
    text: {
      fr: [
        "Épreuve de maths du bac, quatre heures. À la 40e minute, ton ventre fait un bruit de baleine en détresse. Les sushis d'hier soir réclament leur liberté.",
        "Examen final, salle de 200 élèves dans un silence de cathédrale. Ton intestin vient de déclarer la guerre. On n'a pas le droit de sortir avant une heure.",
      ],
      en: [
        "Final math exam, four hours. At minute 40, your stomach makes the sound of a whale in distress. Last night's gas-station sushi wants out.",
        "Final exam, 200 students in cathedral silence. Your bowels just declared war. No leaving the room for the first hour.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tenir bon', en: 'Hold the line' },
        out: [
          { w: 1, odds: { discipline: 1.5 }, text: { fr: "J'ai tenu quatre heures en sueur froide, en serrant tout ce qui se serre. J'ai rendu ma copie et couru aux toilettes comme un athlète olympique. Note : 15. Mon corps est un temple. Un temple fissuré.", en: "I held on for four hours in a cold sweat, clenching everything that clenches. Handed it in and sprinted to the bathroom like an Olympian. Grade: B+. My body is a temple. A cracked temple." }, fx: { grade: 4, discipline: 4, health: -2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai tenu 52 minutes. À la 53e, il y a eu un bruit. Puis une odeur. Les six rangs autour de moi ont été relocalisés. J'ai eu 11, mais l'examinateur a démissionné.", en: "I held for 52 minutes. On minute 53, there was a noise. Then a smell. The six rows around me were relocated. I got a C, but the proctor quit his job." }, fx: { happy: -10, grade: -2, disease: 'gastro', visual: 'poop' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Lever la main', en: 'Raise your hand' },
        text: { fr: "J'ai levé la main. Le surveillant m'a accompagné{|e} aux toilettes et a attendu devant la porte en écoutant. Ses yeux, au retour, disaient : « J'ai entendu des choses. » J'ai perdu 25 minutes et toute pudeur.", en: "I raised my hand. The proctor walked me to the bathroom and waited outside the door, listening. His eyes, when I came out, said: “I heard things.” I lost 25 minutes and all shame." },
        fx: { grade: -3, happy: -5, disease: 'gastro' },
        mood: 'sick',
      },
    ],
  },
  {
    id: 'sc_shop_class',
    icon: '🪚',
    cat: 'school',
    rating: 2,
    scene: { place: 'school', mood: 'shock', fx: 'gore' },
    when: { school: TEEN },
    once: true,
    weight: 5,
    text: {
      fr: [
        "Cours de technologie : on fabrique un porte-clés en bois avec la scie à ruban. Le prof, M. Bouchard, n'a plus que huit doigts. Il appelle ça « de l'expérience ».",
        "Atelier techno, la scie électrique hurle. M. Bouchard fait une démonstration en tournant la tête pour te parler. Ses mains, elles, continuent à avancer.",
      ],
      en: [
        "Shop class: making a wooden keychain on the band saw. The teacher, Mr. Butcher, has only eight fingers left. He calls it “experience.”",
        "Shop class, the power saw is screaming. Mr. Butcher is doing a demo while turning his head to talk to you. His hands keep moving forward.",
      ],
    },
    choices: [
      {
        label: { fr: 'Prévenir M. Bouchard', en: 'Warn Mr. Butcher' },
        out: [
          { w: 1, text: { fr: "J'ai crié « MONSIEUR, VOS DOIGTS ! ». Il a retiré sa main à un millimètre de la lame. Il m'a mis 20 et m'a dit qu'il me devait la vie. Enfin, son pouce.", en: "I yelled “SIR, YOUR FINGERS!” He pulled back a millimeter from the blade. He gave me an A+ and said he owed me his life. Well, his thumb." }, fx: { grade: 6, karma: 4, happy: 5 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai crié trop tard. Un petit bruit de carotte, puis un doigt a volé à travers l'atelier et a atterri dans la trousse de Mélanie. Le sang a giclé sur les lunettes de protection de tout le premier rang. M. Bouchard a dit « Et de trois » et il est parti à l'hôpital à pied.", en: "I yelled too late. A little carrot-chopping sound, then a finger flew across the shop and landed in Melanie's pencil case. Blood sprayed the safety goggles of the whole front row. Mr. Butcher said “That's three” and walked himself to the hospital." }, fx: { happy: -4, stress: 6, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire son porte-clés', en: 'Make your keychain' },
        out: [
          { w: 3, odds: { discipline: 1 }, text: { fr: "J'ai fabriqué un porte-clés en forme de canard. Il ressemble à une patate en colère. Ma grand-mère l'a sur ses clés depuis dix ans.", en: "I made a duck-shaped keychain. It looks like an angry potato. Grandma has kept it on her keys for ten years." }, fx: { happy: 4, grade: 2 } },
          { w: 1, text: { fr: "Moment d'inattention. La scie a mangé le bout de mon doigt. Je l'ai cherché partout dans la sciure, en hurlant, pendant que le sang faisait des petits geysers. On ne l'a jamais retrouvé. M. Bouchard m'a serré la main : « Bienvenue au club. »", en: "Moment of distraction. The saw ate the tip of my finger. I searched the sawdust for it, screaming, while the blood made little geysers. It was never found. Mr. Butcher shook my hand: “Welcome to the club.”" }, fx: { disease: 'missing_finger', health: -10, happy: -10, visual: 'gore' }, mood: 'cry' },
        ],
      },
    ],
  },
  {
    id: 'sc_science_fair',
    icon: '🌋',
    cat: 'school',
    scene: { place: 'school', mood: 'proud', prop: 'trophy' },
    when: { school: ['primary', 'middle'], age: [9, 14] },
    once: true,
    text: {
      fr: [
        "Concours de sciences de l'école. Tout le monde fait le volcan au bicarbonate. Tu as deux semaines pour trouver mieux, ou faire un volcan.",
        "Expo-sciences au gymnase. Ton projet doit être prêt demain. Pour l'instant, c'est une boîte à chaussures et beaucoup d'espoir.",
      ],
      en: [
        "School science fair. Everyone's doing the baking soda volcano. You have two weeks to come up with something better, or make a volcano.",
        "Science fair in the gym. Your project's due tomorrow. Right now it's a shoebox and a lot of hope.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le volcan, version XXL', en: 'Mega volcano' },
        out: [
          { w: 1, text: { fr: "J'ai multiplié les doses par dix. L'éruption a atteint le plafond du gymnase et noyé le stand du fils du maire. Premier prix « pour l'audace ». Facture de nettoyage envoyée à mes parents.", en: "I multiplied the dose by ten. The eruption hit the gym ceiling and flooded the mayor's son's booth. First prize “for boldness.” Cleaning bill sent to my parents." }, fx: { happy: 9, fame: 2, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "Mon volcan géant n'a rien fait. Rien. Juste un petit « pfff » triste et une odeur de vinaigre. Le jury est passé sans s'arrêter.", en: "My giant volcano did nothing. Nothing. Just a sad little “pfft” and a smell of vinegar. The judges walked right past." }, fx: { happy: -5 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Un vrai projet', en: 'A real experiment' },
        out: [
          { w: 1, odds: { smarts: 1.5 }, text: { fr: "J'ai étudié « l'effet de la musique classique sur la croissance des moisissures ». Premier prix ! La moisissure préfère Mozart. Mes parents ont dû jeter le frigo.", en: "I studied “the effect of classical music on mold growth.” First prize! Mold prefers Mozart. My parents had to throw out the fridge." }, fx: { happy: 10, smarts: 5, grade: 4 }, mood: 'proud' },
          { w: 1, text: { fr: "Mon expérience sur les plantes a échoué : toutes mes plantes sont mortes, y compris celles du groupe témoin. Le jury m'a demandé si j'avais « un problème avec les plantes ».", en: "My plant experiment failed: every plant died, including the control group. The judges asked if I had “a problem with plants.”" }, fx: { happy: -3, smarts: 2 } },
        ],
      },
      {
        label: { fr: 'Laisser papa le faire', en: 'Let Dad do it' },
        text: { fr: "Mon père a fait mon projet : un robot qui sert du café. J'ai eu le premier prix. Je n'ai pas pu expliquer un seul fil. Le jury savait. Tout le monde savait.", en: "Dad built my project: a robot that serves coffee. I got first prize. I couldn't explain a single wire. The judges knew. Everyone knew." },
        fx: { happy: 4, karma: -3, grade: 2 },
      },
    ],
  },
];
