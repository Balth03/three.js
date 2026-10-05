// Teen events (ages 12–17): middle school & high school life.
import type { EventDef } from '@bl/sim';

const TEEN_SCHOOL: ['middle', 'high'] = ['middle', 'high'];

export const teenEvents: EventDef[] = [
  // ───────────────────────────── feed-only lines ─────────────────────────────
  {
    id: 'te_acne_auto',
    icon: '😖',
    cat: 'health',
    auto: true,
    once: true,
    weight: 8,
    when: { age: [12, 16] },
    text: {
      fr: [
        "Un bouton gros comme un volcan est apparu sur mon nez la veille de la photo de classe. Il a eu sa propre place sur la photo.",
        "Mon visage a été colonisé par l'acné. J'ai acheté quatre crèmes différentes. Les boutons les ont trouvées délicieuses.",
      ],
      en: [
        "A pimple the size of a volcano erupted on my nose the day before class photos. It got its own spot in the picture.",
        "Acne has colonized my face. I bought four different creams. The pimples found them delicious.",
      ],
    },
    fx: { disease: 'acne', happy: -3 },
  },
  {
    id: 'te_puberty_auto',
    icon: '🧬',
    cat: 'health',
    auto: true,
    once: true,
    when: { age: [12, 14] },
    text: {
      fr: ["La puberté a frappé. {Ma voix a déraillé en plein exposé, quelque part entre le baryton et la mouette.|J'ai grandi de huit centimètres en un été. Plus aucun pantalon ne m'arrive aux chevilles.}", "J'ai grandi d'un coup : bras trop longs, pieds trop grands, et je me cogne à tous les meubles. La puberté, ce chef-d'œuvre.", "Ma voix mue. Au téléphone, on m'a appelé{|e} « Madame », puis « Monsieur », puis on m'a demandé si j'étais {w:animal}.", "J'ai grandi si vite que mes chaussures neuves sont trop petites avant d'être payées. Ma mère m'appelle {w:nickname}. Je déteste.", "Ce matin, dans le miroir, un inconnu fait uniquement de bras et de jambes me regardait. C'était moi. J'ai poussé {w:sound}."],
      en: ["Puberty struck. {My voice cracked mid-presentation, somewhere between baritone and seagull.|I grew three inches in one summer. None of my pants reach my ankles anymore.}", "I grew all at once: arms too long, feet too big, and I bump into every piece of furniture. Puberty, what a masterpiece.", "My voice is breaking. On the phone, I got called 'ma'am', then 'sir', then asked if I was {w:animal}.", "I'm growing so fast my new shoes are too small before they're paid off. Mom calls me {w:nickname}. I hate it.", "This morning, in the mirror, a stranger made entirely of arms and legs was staring at me. It was me. I let out {w:sound}."],
    },
    fx: { happy: -1, looks: 2 },
  },
  {
    id: 'te_cracked_phone_auto',
    icon: '📱',
    cat: 'social',
    auto: true,
    cooldown: 3,
    when: { age: [12, 17] },
    text: {
      fr: ["J'ai fait tomber mon téléphone. L'écran ressemble à une toile d'araignée, mais il marche. Plus ou moins. Surtout moins.", "Mes parents ont épluché ma facture de téléphone. Pendant le sermon, j'ai contemplé le plafond avec beaucoup d'intérêt.", "Mon téléphone est tombé dans {w:food}. Il marche encore, mais il sent bizarre et l'écran restera gras pour toujours.", "J'ai réparé l'écran de mon téléphone avec du scotch et {w:object}. Mes potes appellent ça de l'art. Mes parents appellent ça « non ».", "Ma batterie est passée de 100 % à 3 % pendant que je regardais {w:show}. Mon téléphone a fait {w:sound}, puis il est mort. Je suis en deuil."],
      en: ["I dropped my phone. The screen looks like a spiderweb, but it works. More or less. Mostly less.", "My parents went through my phone bill line by line. During the lecture, I studied the ceiling with great interest.", "My phone fell into {w:food}. It still works, but it smells weird and the screen will be greasy forever.", "I fixed my phone screen with tape and {w:object}. My friends call it art. My parents call it 'no'.", "My battery went from 100% to 3% while I was watching {w:show}. My phone made {w:sound}, then died. I'm in mourning."],
    },
    fx: { happy: -2 },
  },
  {
    id: 'te_gaming_auto',
    icon: '🎮',
    cat: 'social',
    auto: true,
    cooldown: 2,
    when: { age: [12, 17] },
    text: {
      fr: ["J'ai joué aux jeux vidéo jusqu'à 4 h du matin. Mon personnage a atteint le niveau 80. Mes notes, elles, ont atteint le sous-sol.", "J'ai passé le week-end entier sur un jeu vidéo. J'ai sauvé un royaume, mais pas mon devoir d'histoire.", "J'ai passé toute la nuit à jouer en ligne contre un certain {w:nickname}. J'ai perdu [[47|63|112]] fois. Il a 9 ans. Il me l'a dit.", "Ma mère a coupé le courant pendant le boss final. J'ai poussé {w:sound}. Les voisins ont appelé pour savoir si tout allait bien.", "J'ai passé 40 heures sur un simulateur de pêche. J'ai attrapé {w:object}. J'en suis plus {fier|fière} que de mon bulletin."],
      en: ["I played video games until 4 a.m. My character hit level 80. My grades hit the basement.", "I spent the whole weekend on a video game. I saved a kingdom, but not my history homework.", "I spent all night playing online against someone called {w:nickname}. I lost [[47|63|112]] times. He's 9. He told me.", "My mom cut the power during the final boss. I let out {w:sound}. The neighbors called to check if everything was okay.", "I spent 40 hours on a fishing simulator. I caught {w:object}. I'm prouder of it than of my report card."],
    },
    fx: { happy: 4, grade: -3, health: -1 },
  },
  {
    id: 'te_two_xmas_auto',
    icon: '🎄',
    cat: 'family',
    auto: true,
    once: true,
    when: { age: [12, 17], flag: 'te_parents_divorced' },
    text: {
      fr: [
        "Cette année, j'ai eu deux Noëls : un chez chaque parent. Deux dindes, deux bûches, une seule indigestion.",
        "Je fais maintenant la navette entre deux maisons. J'ai deux brosses à dents et j'oublie toujours la bonne.",
      ],
      en: [
        "This year I had two Christmases, one at each parent's place. Two turkeys, two yule logs, one stomachache.",
        "I now commute between two houses. I own two toothbrushes and always forget the right one.",
      ],
    },
    fx: { happy: 3, health: -1 },
  },
  {
    id: 'te_viral_after_auto',
    icon: '🤳',
    cat: 'social',
    auto: true,
    once: true,
    when: { age: [13, 17], flag: 'te_viral' },
    text: {
      fr: [
        "Un inconnu m'a reconnu{|e} au supermarché et a imité ma vidéo virale devant le rayon yaourts. Gloire ou malédiction, je n'ai pas encore tranché.",
        "Ma vidéo virale tourne encore. Ma grand-mère me l'a envoyée en me demandant si c'était moi. Oui, mamie.",
      ],
      en: [
        "A stranger recognized me at the supermarket and reenacted my viral video in the yogurt aisle. Fame or curse, I haven't decided.",
        "My viral video is still going around. My grandma sent it to me asking if that was me. Yes, Grandma.",
      ],
    },
    fx: { happy: 2, fame: 1 },
  },

  // ───────────────────────────── love ─────────────────────────────
  {
    id: 'te_crush',
    icon: '💘',
    cat: 'love',
    scene: { place: 'school', mood: 'love' },
    when: { age: [12, 17], school: TEEN_SCHOOL, noHas: 'partner' },
    cooldown: 3,
    actor: { create: { role: 'classmate', age: [-1, 1], gender: 'attracted' } },
    text: {
      fr: [
        "Tu as le béguin pour {a.first}, de ta classe. Chaque fois que {a.he} passe, ton cerveau redémarre en mode sans échec.",
        "{a.first} t'a prêté un stylo il y a trois semaines. Depuis, tu ne penses qu'à ça. Que fais-tu ?",
      ],
      en: [
        "You have a crush on {a.first} from your class. Every time {a.he} walks by, your brain reboots in safe mode.",
        "{a.first} lent you a pen three weeks ago. You haven't thought about anything else since. What do you do?",
      ],
    },
    choices: [
      {
        label: { fr: 'Déclarer ma flamme', en: 'Confess my feelings' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: "J'ai avoué mes sentiments à {a.first}. {a:Il|Elle} a dit oui ! On sort officiellement ensemble depuis la récré de 10 h.", en: "I confessed my feelings to {a.first}. {a:He|She} said yes! We've been officially dating since morning recess." }, fx: { happy: 12, rel: 20, actorRole: 'partner', flag: 'te_crush_confessed' }, mood: 'love' },
          { w: 2, text: { fr: "J'ai déclaré ma flamme à {a.first}. Réponse : « Ah… merci ? ». Je vais changer de nom et partir vivre en forêt.", en: "I confessed to {a.first}. The answer: “Oh… thanks?” I'm changing my name and moving to the woods." }, fx: { happy: -8, stress: 4 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Faire passer un mot', en: 'Pass a note' },
        out: [
          { w: 1, odds: { looks: 0.5 }, text: { fr: "J'ai fait passer un mot à {a.first} : « Tu veux sortir avec moi ? Oui / Non / Peut-être ». {a:Il|Elle} a coché oui. Une méthode qui a fait ses preuves.", en: "I passed {a.first} a note: “Will you go out with me? Yes / No / Maybe.” {a:He|She} checked yes. A time-tested method." }, fx: { happy: 10, rel: 15, actorRole: 'partner', flag: 'te_crush_confessed' }, mood: 'love' },
          { w: 1, text: { fr: "Mon mot doux a été intercepté par le prof de maths, qui l'a lu à voix haute. Avec le ton.", en: "My love note was intercepted by the math teacher, who read it aloud. With feeling." }, fx: { happy: -10, stress: 6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Aimer en secret', en: 'Admire from afar' },
        text: { fr: "J'ai décidé d'aimer {a.first} en secret. Très en secret. À une quarantaine de mètres de distance.", en: "I decided to love {a.first} in secret. Very secretly. From about forty yards away." },
        fx: { happy: -2 },
      },
    ],
  },
  {
    id: 'te_first_kiss',
    icon: '💋',
    cat: 'love',
    scene: { place: 'park', mood: 'love' },
    when: { age: [13, 17], noFlag: 'te_first_kiss' },
    once: true,
    actor: 'partner',
    text: {
      fr: [
        "Tu te promènes au parc avec {a.first}. Le soleil se couche, un pigeon vous fixe. Le moment idéal pour un premier baiser…",
        "{a.first} et toi êtes seuls devant chez toi. Silence gênant. {a:Il|Elle} se rapproche. Que fais-tu ?",
      ],
      en: [
        "You're walking in the park with {a.first}. The sun is setting, a pigeon is staring. The perfect moment for a first kiss…",
        "You and {a.first} are alone outside your house. Awkward silence. {a:He|She} leans in. What do you do?",
      ],
    },
    choices: [
      {
        label: { fr: "L'embrasser", en: 'Kiss {a.him}' },
        out: [
          { w: 3, text: { fr: "Premier baiser avec {a.first}. Bref, maladroit, parfait. Le pigeon a applaudi (pas vraiment).", en: "First kiss with {a.first}. Short, clumsy, perfect. The pigeon applauded (not really)." }, fx: { happy: 12, rel: 15, flag: 'te_first_kiss' }, mood: 'love' },
          { w: 1, text: { fr: "Premier baiser avec {a.first} : on s'est cogné le nez. On a ri. Ça compte quand même.", en: "First kiss with {a.first}: we bumped noses. We laughed. It still counts." }, fx: { happy: 8, rel: 10, flag: 'te_first_kiss' }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Faire un câlin', en: 'Hug instead' },
        text: { fr: "J'ai paniqué et j'ai fait un câlin à {a.first}. Un câlin de grand-tante, très solide, avec tapotements dans le dos.", en: "I panicked and gave {a.first} a hug. A great-aunt hug, very firm, with back pats." },
        fx: { happy: 2, rel: 3 },
      },
      {
        label: { fr: 'Prendre la fuite', en: 'Run for it' },
        text: { fr: "J'ai prétexté une urgence de devoirs et j'ai couru jusque chez moi. {a.first} n'a rien compris. Moi non plus.", en: "I claimed a homework emergency and ran home. {a.first} was baffled. So was I." },
        fx: { happy: -3, rel: -10, stress: 3 },
      },
    ],
  },
  {
    id: 'te_heartbreak',
    icon: '💔',
    cat: 'love',
    scene: { place: 'home', mood: 'cry' },
    when: { age: [13, 17], flag: 'te_first_kiss' },
    once: true,
    weight: 6,
    actor: 'partner',
    text: {
      fr: [
        "{a.first} veut te parler. « Ce n'est pas toi, c'est moi. » Puis {a.he} t'explique pendant dix minutes que c'est quand même un peu toi.",
        "{a.first} t'a largué{|e} par message. Avec un emoji pouce levé. Comment encaisses-tu ?",
      ],
      en: [
        "{a.first} wants to talk. “It's not you, it's me.” Then {a.he} spends ten minutes explaining that it's actually a bit you.",
        "{a.first} dumped you by text. With a thumbs-up emoji. How do you take it?",
      ],
    },
    choices: [
      {
        label: { fr: 'Pleurer sous la couette', en: 'Cry under the covers' },
        text: { fr: "J'ai pleuré trois jours en écoutant la même chanson triste en boucle. Mes parents ont fini par glisser des biscuits sous ma porte.", en: "I cried for three days with the same sad song on repeat. My parents eventually started sliding cookies under my door." },
        fx: { happy: -10, stress: 5, actorRole: 'ex' },
        mood: 'cry',
      },
      {
        label: { fr: 'Jouer les indifférents', en: 'Act unbothered' },
        out: [
          { w: 2, text: { fr: "J'ai fait comme si ça m'était égal. Personne n'y a cru, surtout pas moi.", en: "I acted like I didn't care. Nobody bought it, least of all me." }, fx: { happy: -5, actorRole: 'ex' } },
          { w: 1, text: { fr: "J'ai joué l'indifférence si bien que {a.first} est revenu{a:|e} me supplier. J'ai dit non. Victoire totale.", en: "I played it so cool that {a.first} came back begging. I said no. Total victory." }, fx: { happy: 6, actorRole: 'ex' }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Quémander une seconde chance', en: 'Beg for another chance' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "{a.first} a accepté de me redonner une chance. « Pour l'instant », a-t-{a:il|elle} précisé.", en: "{a.first} agreed to give me another chance. “For now,” {a.he} added." }, fx: { happy: 4, rel: 5 } },
          { w: 2, text: { fr: "J'ai supplié {a.first} devant toute la cantine. Réponse : non. Et maintenant, toute la cantine est au courant.", en: "I begged {a.first} in front of the entire cafeteria. Answer: no. And now the entire cafeteria knows." }, fx: { happy: -12, stress: 6, actorRole: 'ex' }, mood: 'cry' },
        ],
      },
    ],
  },
  {
    id: 'te_prom',
    icon: '🪩',
    cat: 'love',
    scene: { place: 'party', mood: 'party', prop: 'disco' },
    when: { age: [16, 17], school: 'high' },
    once: true,
    actor: { create: { role: 'classmate', age: [-1, 1], gender: 'attracted' } },
    vars: { amount: [50, 200] },
    text: {
      fr: [
        "Le bal de fin d'année approche. {a.first} tourne autour de toi depuis cinq minutes, puis lâche : « Tu… tu veux venir avec moi ? »",
        "C'est le bal de fin d'année ! Costume, robe ou t-shirt ironique : tout le monde se prépare. {a.first} te propose d'y aller ensemble.",
      ],
      en: [
        "Prom is coming up. {a.first} has been hovering around you for five minutes, then blurts out: “Do… do you want to go with me?”",
        "It's prom night! Suit, dress or ironic t-shirt: everyone's getting ready. {a.first} asks if you want to go together.",
      ],
    },
    choices: [
      {
        label: { fr: 'Dire oui', en: 'Say yes' },
        out: [
          { w: 2, text: { fr: "Je suis allé{|e} au bal avec {a.first}. On a dansé faux, ri fort et pris 200 photos floues. Soirée parfaite, tenue à {$amount}.", en: "I went to prom with {a.first}. We danced badly, laughed loudly and took 200 blurry photos. Perfect night, {$amount} outfit." }, fx: { happy: 12, rel: 15, money: '-amount', actorRole: 'friend' }, mood: 'party' },
          { w: 1, odds: { looks: 1 }, text: { fr: "Au bal, {a.first} et moi avons dansé un slow sous la boule à facettes. On est repartis main dans la main.", en: "At prom, {a.first} and I slow-danced under the disco ball. We left holding hands." }, fx: { happy: 14, rel: 20, money: '-amount', actorRole: 'partner' }, mood: 'love' },
        ],
      },
      {
        label: { fr: 'Y aller avec ma moitié', en: 'Go with my partner' },
        if: { has: 'partner' },
        text: { fr: "J'ai poliment décliné : j'y suis allé{|e} avec ma moitié. On a été élus « couple le plus mignon » par un jury de trois personnes.", en: "I politely declined: I went with my partner. We were voted “cutest couple” by a jury of three." },
        fx: { happy: 10, money: '-amount' },
        mood: 'love',
      },
      {
        label: { fr: 'Y aller entre potes', en: 'Go with my friends' },
        text: { fr: "Je suis allé{|e} au bal avec ma bande. On a monopolisé la piste sur la Macarena. Aucun regret, quelques courbatures.", en: "I went to prom with my crew. We took over the dance floor for the Macarena. No regrets, some sore muscles." },
        fx: { happy: 9, money: '-amount' },
        mood: 'party',
      },
      {
        label: { fr: 'Rester en pyjama', en: 'Skip it' },
        text: { fr: "J'ai séché le bal pour regarder une série en pyjama. Le bal, c'est surfait. (J'ai quand même regardé toutes les stories.)", en: "I skipped prom to binge a show in my pajamas. Prom is overrated. (I still watched every single story.)" },
        fx: { happy: -3 },
      },
    ],
  },

  // ───────────────────────────── school ─────────────────────────────
  {
    id: 'te_cheat_test',
    icon: '📝',
    cat: 'school',
    scene: { place: 'school', mood: 'neutral', prop: 'paper' },
    when: { age: [12, 17], school: TEEN_SCHOOL, noFlag: 'te_cheater' },
    cooldown: 3,
    text: {
      fr: [
        "Contrôle surprise de SVT. Tu n'as rien révisé, mais ton voisin écrit en très gros et très lisiblement.",
        "Interro de maths dans dix minutes. Une antisèche circule de table en table… et vient d'atterrir sur la tienne.",
      ],
      en: [
        "Pop quiz in biology. You didn't study at all, but your neighbor writes very big and very neatly.",
        "Math test in ten minutes. A cheat sheet is making its way from desk to desk… and just landed on yours.",
      ],
    },
    choices: [
      {
        label: { fr: 'Copier', en: 'Copy' },
        out: [
          { w: 2, text: { fr: "J'ai copié. Le prof n'a rien vu et j'ai eu ma meilleure note du trimestre. Ma conscience, elle, a eu 4/20.", en: "I copied. The teacher saw nothing and I got my best grade of the term. My conscience got a D-minus." }, fx: { grade: 6, karma: -4, flag: 'te_cheater', schedule: { key: 'te_cheat_caught', years: 1 } } },
          { w: 1, odds: { discipline: -0.5 }, text: { fr: "Pris{|e} la main dans le sac : le prof m'a vu{|e} copier. Zéro pointé et mot dans le carnet de liaison.", en: "Caught red-handed: the teacher saw me copying. A big fat zero and a note home." }, fx: { grade: -10, karma: -3, happy: -6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Jouer honnête', en: 'Play it honest' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai répondu honnêtement et j'ai eu la moyenne. Comme quoi, mon cerveau sert parfois.", en: "I answered honestly and passed. Turns out my brain does work sometimes." }, fx: { grade: 4, karma: 3, smarts: 1 } },
          { w: 1, text: { fr: "J'ai été honnête. J'ai eu 6/20. L'honnêteté ne paie pas toujours, mais elle dort bien.", en: "I was honest. I got a 30%. Honesty doesn't always pay, but it sleeps well." }, fx: { grade: -5, karma: 4 } },
        ],
      },
      {
        label: { fr: "Signaler l'antisèche", en: 'Report the cheating' },
        text: { fr: "J'ai signalé la triche au prof. Note méritée, réputation de balance acquise. Mon casier a mystérieusement reçu du yaourt.", en: "I reported the cheating to the teacher. Fair grade, snitch reputation earned. My locker mysteriously received some yogurt." },
        fx: { karma: 2, happy: -4, grade: 2 },
      },
    ],
  },
  {
    id: 'te_cheat_caught',
    icon: '🕵️',
    cat: 'school',
    chainOnly: true,
    scene: { place: 'school', mood: 'shock' },
    when: { school: 'any' },
    text: {
      fr: [
        "En archivant de vieilles copies, ton prof a remarqué que tes réponses de l'an dernier étaient identiques à celles de ton voisin. Fautes d'orthographe comprises.",
        "Convocation chez la direction : ta vieille interro a refait surface. Tu avais même recopié le prénom de l'autre élève.",
      ],
      en: [
        "While filing old tests, your teacher noticed your answers from last year matched your neighbor's exactly. Spelling mistakes included.",
        "Summoned to the principal's office: your old test has resurfaced. You had even copied the other kid's name.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout avouer', en: 'Confess everything' },
        text: { fr: "J'ai tout avoué. Deux heures de colle et un long sermon sur l'intégrité. J'ai survécu, plus humble.", en: "I confessed everything. Two hours of detention and a long speech about integrity. I survived, humbler." },
        fx: { grade: -5, karma: 3, discipline: 3, unflag: 'te_cheater' },
      },
      {
        label: { fr: 'Nier en bloc', en: 'Deny everything' },
        out: [
          { w: 1, text: { fr: "J'ai nié avec un aplomb remarquable. Faute de preuves, l'affaire a été classée. Je devrais faire de la politique.", en: "I denied it with remarkable confidence. For lack of evidence, the case was closed. I should go into politics." }, fx: { karma: -3, happy: 3 } },
          { w: 1, text: { fr: "J'ai nié. Ils avaient les deux copies côte à côte. Trois jours d'exclusion temporaire.", en: "I denied it. They had both tests side by side. Three-day suspension." }, fx: { grade: -10, happy: -8, karma: -3 }, mood: 'sad' },
          { w: 0.15, text: { fr: "J'ai nié, menti, puis accusé le prof de complot international. Le conseil de discipline m'a renvoyé{|e}.", en: "I denied it, lied, then accused the teacher of an international conspiracy. The disciplinary board expelled me." }, fx: { happy: -12, karma: -5, expel: true }, mood: 'shock' },
        ],
      },
      {
        label: { fr: "Accuser l'autre", en: 'Blame the other kid' },
        text: { fr: "J'ai juré que c'était l'autre qui avait copié sur moi. Ça a marché. Je me sens comme un méchant de dessin animé.", en: "I swore the other kid copied off me. It worked. I feel like a cartoon villain." },
        fx: { karma: -8, happy: 1 },
      },
    ],
  },
  {
    id: 'te_detention',
    icon: '⏰',
    cat: 'school',
    scene: { place: 'school', mood: 'sleepy' },
    when: { age: [12, 17], school: TEEN_SCHOOL },
    cooldown: 3,
    text: {
      fr: [
        "Tu as écopé de deux heures de colle pour « bavardages excessifs ». Tu as dit trois mots. Trois.",
        "Retenue le mercredi après-midi : tu as lancé une gomme en classe. Elle visait la poubelle, elle a trouvé le prof.",
      ],
      en: [
        "You got two hours of detention for “excessive chatter.” You said three words. Three.",
        "Saturday detention: you threw an eraser in class. It was aimed at the trash can; it found the teacher.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire profil bas', en: 'Keep my head down' },
        text: { fr: "J'ai fait mes deux heures en recopiant le règlement intérieur. J'en connais désormais chaque article par cœur.", en: "I served my two hours copying the school rules. I now know every article by heart." },
        fx: { discipline: 4, smarts: 1, happy: -2 },
      },
      {
        label: { fr: 'Faire le clown', en: 'Clown around' },
        out: [
          { w: 2, text: { fr: "J'ai fait rire toute la salle de colle. Les autres collés m'adorent. Le surveillant, beaucoup moins.", en: "I had the whole detention room laughing. My fellow inmates love me. The supervisor, much less." }, fx: { happy: 5, discipline: -3 } },
          { w: 1, text: { fr: "Mes pitreries m'ont valu une heure de colle en plus. Le surveillant ne rit jamais. Jamais.", en: "My antics earned me an extra hour. The supervisor never laughs. Never." }, fx: { happy: -5, discipline: -2, grade: -3 } },
        ],
      },
      {
        label: { fr: 'Sécher la colle', en: 'Skip detention' },
        out: [
          { w: 1, text: { fr: "J'ai séché la colle. Personne n'a rien remarqué. Le système est une passoire.", en: "I skipped detention. Nobody noticed. The system is a sieve." }, fx: { happy: 4, karma: -2 } },
          { w: 2, text: { fr: "J'ai séché la colle. Ils ont appelé mes parents. Mon téléphone est confisqué pour une durée « indéterminée ».", en: "I skipped detention. They called my parents. My phone has been confiscated for an “indefinite” period." }, fx: { happy: -8, grade: -3 }, mood: 'angry' },
        ],
      },
    ],
  },
  {
    id: 'te_school_trip',
    icon: '🚌',
    cat: 'school',
    scene: { place: 'school', mood: 'happy', prop: 'bus' },
    when: { age: [12, 16], school: TEEN_SCHOOL },
    once: true,
    vars: { amount: [80, 300] },
    text: {
      fr: [
        "Ta classe part en voyage scolaire à [[Londres|Rome|la montagne|Berlin]] ! Il faut {$amount} et une autorisation signée.",
        "Sortie de fin d'année : trois jours en car avec ta classe pour {$amount}. Le car sent déjà le sandwich au thon.",
      ],
      en: [
        "Your class is going on a school trip to [[London|Rome|the mountains|Berlin]]! It costs {$amount} plus a signed permission slip.",
        "End-of-year trip: three days on a bus with your class for {$amount}. The bus already smells like tuna sandwiches.",
      ],
    },
    choices: [
      {
        label: { fr: 'Partir à l\'aventure', en: 'Go on the trip' },
        out: [
          { w: 3, text: { fr: "Voyage scolaire génial : j'ai vu des monuments, perdu ma carte d'identité et dormi deux heures en tout.", en: "Amazing school trip: I saw monuments, lost my ID and slept two hours total." }, fx: { money: '-amount', happy: 10, smarts: 2 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai été malade dans le car à l'aller. Et au retour. Depuis, mon surnom est « Vomito ».", en: "I got sick on the bus on the way there. And on the way back. My nickname is now “Barf Bag.”" }, fx: { money: '-amount', happy: -4, health: -2 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Rester ici', en: 'Stay behind' },
        text: { fr: "Je ne suis pas parti{|e}. J'ai passé trois jours en salle d'étude avec les deux autres qui n'y allaient pas. Nous sommes liés à jamais.", en: "I didn't go. I spent three days in study hall with the two other kids who stayed. We are bonded for life." },
        fx: { happy: -4 },
      },
    ],
  },
  {
    id: 'te_teacher_drama',
    icon: '👩‍🏫',
    cat: 'school',
    scene: { place: 'school', mood: 'angry' },
    when: { age: [12, 17], school: TEEN_SCHOOL },
    cooldown: 3,
    text: {
      fr: [
        "Ton prof de [[français|histoire|physique]] t'a pris{|e} en grippe. Il soupire dès que tu lèves la main et a écrit « peut mieux faire » trois fois sur ta copie.",
        "Ta prof de [[français|histoire|physique]] a lu ta rédaction à voix haute en se moquant de ton style. Toute la classe a ri.",
      ],
      en: [
        "Your [[English|history|physics]] teacher has it in for you. He sighs whenever you raise your hand and wrote “could do better” three times on your paper.",
        "Your [[English|history|physics]] teacher read your essay aloud while mocking your style. The whole class laughed.",
      ],
    },
    choices: [
      {
        label: { fr: 'Contester la note', en: 'Challenge the grade' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai contesté ma note avec des arguments en béton. Mon 8 est passé à 12. Victoire judiciaire.", en: "I challenged my grade with rock-solid arguments. My C-minus became a B. Legal victory." }, fx: { grade: 6, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai contesté. En relisant ma copie, le prof a trouvé deux fautes de plus. Note finale : 6.", en: "I challenged it. While rereading my paper, the teacher found two more mistakes. Final grade: worse." }, fx: { grade: -4, happy: -4 } },
        ],
      },
      {
        label: { fr: 'Bosser deux fois plus', en: 'Work twice as hard' },
        text: { fr: "J'ai bossé comme jamais pour prouver qu'on m'avait sous-estimé{|e}. Le prof a fini par écrire « bien ». J'ai failli pleurer.", en: "I worked harder than ever to prove I'd been underestimated. The teacher finally wrote “good.” I almost cried." },
        fx: { grade: 8, smarts: 3, stress: 4, discipline: 3 },
      },
      {
        label: { fr: 'Prévenir mes parents', en: 'Tell my parents' },
        out: [
          { w: 1, text: { fr: "Mes parents ont demandé un rendez-vous. Le prof a été charmant devant eux. Le lendemain, beaucoup moins.", en: "My parents requested a meeting. The teacher was charming in front of them. The next day, much less so." }, fx: { grade: -2, happy: -3 } },
          { w: 1, text: { fr: "Mes parents sont allés voir le prof. Depuis, il me sourit de façon inquiétante, mais mes notes remontent.", en: "My parents went to see the teacher. Since then, he smiles at me in an unsettling way, but my grades are going up." }, fx: { grade: 4, happy: 3 } },
        ],
      },
      {
        label: { fr: 'Laisser couler', en: 'Let it slide' },
        text: { fr: "J'ai décidé de survivre en silence jusqu'à la fin de l'année. Je barre les jours sur ma trousse.", en: "I decided to survive in silence until the end of the year. I'm crossing off days on my pencil case." },
        fx: { happy: -3, stress: 3 },
      },
    ],
  },
  {
    id: 'te_exam_stress',
    icon: '📚',
    cat: 'school',
    scene: { place: 'home', mood: 'sleepy', prop: 'books' },
    when: { age: [14, 17], school: TEEN_SCHOOL },
    cooldown: 2,
    text: {
      fr: [
        "Les examens arrivent dans une semaine. Tu as un planning de révisions en couleur, plastifié, magnifique. Et zéro révision.",
        "Grosse semaine d'examens. Ton cerveau a la consistance d'une purée et ton bureau ressemble à un champ de surligneurs.",
      ],
      en: [
        "Exams are in one week. You have a color-coded, laminated, gorgeous study schedule. And zero actual studying.",
        "Big exam week. Your brain has the consistency of mashed potatoes and your desk looks like a highlighter field.",
      ],
    },
    choices: [
      {
        label: { fr: 'Réviser à fond', en: 'Cram hard' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: "J'ai révisé jour et nuit. J'ai cartonné aux examens, et mes cernes descendent désormais jusqu'au menton.", en: "I studied day and night. I aced my exams, and my eye bags now reach my chin." }, fx: { grade: 10, smarts: 3, health: -2, stress: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai tellement révisé que je me suis endormi{|e} pendant l'épreuve. Sur ma copie. Avec la trace du stylo sur la joue.", en: "I studied so much I fell asleep during the exam. On my paper. With a pen mark on my cheek." }, fx: { grade: -3, stress: 5 }, mood: 'sleepy' },
        ],
      },
      {
        label: { fr: 'Réviser avec des pauses', en: 'Study with breaks' },
        text: { fr: "J'ai révisé intelligemment : 45 minutes de travail, 15 minutes de pause. Bon, parfois l'inverse.", en: "I studied smart: 45 minutes of work, 15 minutes of break. Well, sometimes the other way around." },
        fx: { grade: 5, stress: -2, happy: 2 },
      },
      {
        label: { fr: 'Improviser le jour J', en: 'Wing it' },
        out: [
          { w: 1, text: { fr: "J'ai tout misé sur l'improvisation. Miracle : les questions portaient sur le seul chapitre que j'avais lu.", en: "I bet everything on improvisation. Miracle: the questions were all about the one chapter I'd read." }, fx: { grade: 6, happy: 8 }, mood: 'happy' },
          { w: 3, text: { fr: "J'ai improvisé. Les correcteurs n'ont pas apprécié mon interprétation très libre de la photosynthèse.", en: "I winged it. The graders did not appreciate my very loose interpretation of photosynthesis." }, fx: { grade: -10, happy: -5 } },
        ],
      },
      {
        label: { fr: 'Paniquer', en: 'Panic' },
        out: [
          { w: 2, text: { fr: "J'ai craqué à 2 h du matin, en larmes sur mon cahier de chimie. Après une vraie nuit de sommeil, ça allait mieux.", en: "I broke down at 2 a.m., crying on my chemistry notebook. After an actual night's sleep, things looked better." }, fx: { stress: -5, happy: -4 }, mood: 'cry' },
          { w: 1, text: { fr: "Le stress m'a complètement submergé{|e}. L'infirmière scolaire m'a conseillé d'en parler à un médecin.", en: "The stress completely overwhelmed me. The school nurse advised me to see a doctor." }, fx: { happy: -8, disease: 'anxiety' }, mood: 'sad' },
        ],
      },
    ],
  },
  {
    id: 'te_choose_path',
    icon: '🧭',
    cat: 'school',
    scene: { place: 'school', mood: 'neutral' },
    when: { age: [16, 17], school: 'high' },
    once: true,
    weight: 8,
    text: {
      fr: [
        "Rendez-vous avec le conseiller d'orientation. Il te fait remplir un questionnaire de 200 questions pour savoir si tu préfères « les gens » ou « les choses ».",
        "C'est l'heure de choisir ton orientation. Tes parents rêvent pour toi d'[[un métier stable|une blouse de médecin|« quelque chose qui rapporte »]]. Toi, tu ne sais même pas ce que tu veux manger ce midi.",
      ],
      en: [
        "Meeting with the guidance counselor. He makes you fill out a 200-question survey to find out whether you prefer “people” or “things.”",
        "Time to choose your path. Your parents dream of [[a stable job|a doctor's coat|“something that pays”]] for you. You don't even know what you want for lunch.",
      ],
    },
    choices: [
      {
        label: { fr: "Viser l'université", en: 'Aim for university' },
        text: { fr: "J'ai décidé de viser l'université. J'ai même acheté un agenda. Je ne l'ai pas encore ouvert, mais il est là.", en: "I decided to aim for university. I even bought a planner. I haven't opened it yet, but it's there." },
        fx: { smarts: 3, grade: 4, discipline: 3, flag: 'te_path_uni' },
        mood: 'proud',
      },
      {
        label: { fr: "Passer le test d'aptitude", en: 'Take the aptitude test' },
        text: { fr: "Le test d'aptitude du conseiller a été une révélation : j'ai enfin compris où se cachait mon vrai talent.", en: "The counselor's aptitude test was a revelation: I finally figured out where my real talent was hiding." },
        fx: { revealTalent: true, smarts: 1, happy: 4 },
        mood: 'happy',
      },
      {
        label: { fr: 'Apprendre un métier', en: 'Learn a trade' },
        text: { fr: "J'ai choisi une voie concrète : apprendre un métier avec mes mains. Mes parents ont boudé deux jours, puis m'ont demandé de réparer l'évier.", en: "I chose a hands-on path: learning a trade. My parents sulked for two days, then asked me to fix the sink." },
        fx: { discipline: 3, happy: 4, flag: 'te_path_trade' },
      },
      {
        label: { fr: 'Devenir une rockstar', en: 'Become a rock star' },
        if: { flag: 'te_band' },
        text: { fr: "J'ai annoncé que mon avenir, c'était le groupe. Le conseiller a noté « artiste » avec un tout petit soupir.", en: "I announced that my future was the band. The counselor wrote down “artist” with a tiny sigh." },
        fx: { happy: 8, flag: 'te_path_music' },
        mood: 'proud',
      },
      {
        label: { fr: 'Passer pro en sport', en: 'Go pro in sports' },
        if: { flag: 'te_varsity', noFlag: 'te_band' },
        text: { fr: "J'ai déclaré que je serais athlète professionnel{|le}. Le conseiller m'a conseillé de garder un plan B. J'ai fait des pompes devant lui.", en: "I declared I'd be a pro athlete. The counselor suggested a plan B. I did push-ups in front of him." },
        fx: { happy: 6, athletic: 3, flag: 'te_path_sport' },
        mood: 'proud',
      },
    ],
  },

  // ───────────────────────────── family ─────────────────────────────
  {
    id: 'te_divorce',
    icon: '⚖️',
    cat: 'family',
    scene: { place: 'home', mood: 'sad' },
    when: { age: [12, 17], has: ['mother', 'father'], noFlag: 'te_parents_divorced' },
    once: true,
    weight: 3,
    actor: 'parent',
    text: {
      fr: [
        "Tes parents t'annoncent qu'ils divorcent. Ils précisent au moins sept fois que « ça n'a rien à voir avec toi », ce qui est très suspect.",
        "Réunion de famille dans le salon. Tes parents se séparent. Il y a des mouchoirs sur la table basse et une tension à couper au couteau.",
      ],
      en: [
        "Your parents announce they're getting divorced. They say “it has nothing to do with you” at least seven times, which is very suspicious.",
        "Family meeting in the living room. Your parents are splitting up. There are tissues on the coffee table and tension you could cut with a knife.",
      ],
    },
    choices: [
      {
        label: { fr: 'Soutenir {a.rel}', en: 'Support {a.rel}' },
        text: { fr: "Pendant le divorce, je suis resté{|e} proche de {a.my}. On a mangé beaucoup de pizzas et peu parlé du reste. Ça nous a rapprochés.", en: "During the divorce, I stayed close to {a.my}. We ate a lot of pizza and talked very little about the rest. It brought us closer." },
        fx: { rel: 15, happy: -6, flag: 'te_parents_divorced' },
      },
      {
        label: { fr: 'Tenter de les réconcilier', en: 'Try to reunite them' },
        out: [
          { w: 4, text: { fr: "J'ai organisé un dîner « surprise » pour réconcilier mes parents. Résultat : un dîner très silencieux, et un divorce quand même.", en: "I set up a “surprise” dinner to get my parents back together. Result: a very silent dinner, and a divorce anyway." }, fx: { happy: -8, stress: 6, flag: 'te_parents_divorced' } },
          { w: 1, text: { fr: "Mon plan de réconciliation (photos de mariage + leur chanson) a presque marché. Ils divorcent, mais ils se reparlent gentiment.", en: "My reconciliation plan (wedding photos + their song) almost worked. They're divorcing, but they talk kindly again." }, fx: { happy: -2, karma: 3, flag: 'te_parents_divorced' } },
        ],
      },
      {
        label: { fr: 'Tout garder pour moi', en: 'Bottle it up' },
        out: [
          { w: 3, text: { fr: "J'ai dit « ok » et je suis monté{|e} dans ma chambre. J'ai fait semblant que tout allait bien. Ça n'allait pas.", en: "I said “okay” and went up to my room. I pretended everything was fine. It wasn't." }, fx: { happy: -10, stress: 8, flag: 'te_parents_divorced' }, mood: 'sad' },
          { w: 1, text: { fr: "J'ai tout gardé pour moi pendant des mois. Mon ventre, lui, a fini par parler à ma place.", en: "I kept it all inside for months. My stomach eventually did the talking for me." }, fx: { happy: -10, disease: 'anxiety', flag: 'te_parents_divorced' }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'En tirer profit', en: 'Milk it' },
        text: { fr: "J'ai découvert l'avantage caché du divorce : deux anniversaires, deux fois plus de cadeaux, et une culpabilité parentale à exploiter.", en: "I discovered the hidden perk of divorce: two birthdays, twice the presents, and parental guilt to exploit." },
        fx: { happy: 2, karma: -2, money: 50, flag: 'te_parents_divorced' },
      },
    ],
  },
  {
    id: 'te_driving_lesson',
    icon: '🚗',
    cat: 'family',
    scene: { place: 'home', mood: 'shock', prop: 'car' },
    when: { age: [15, 17] },
    once: true,
    actor: 'parent',
    text: {
      fr: [
        "{a.rel} accepte de te donner ta première leçon de conduite sur le parking du supermarché. {a:Il|Elle} est déjà agrippé{a:|e} à la poignée.",
        "« Bon. Tu veux apprendre à conduire ? » demande {a.rel} en te tendant les clés comme on confie une grenade.",
      ],
      en: [
        "{a.rel} agrees to give you your first driving lesson in the supermarket parking lot. {a:He|She} is already gripping the handle.",
        "“Okay. You want to learn to drive?” {a.rel} asks, handing you the keys like a live grenade.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rouler prudemment', en: 'Drive carefully' },
        out: [
          { w: 3, text: { fr: "Première leçon : 15 km/h, clignotant allumé en permanence, créneau presque réussi. {a.my} était fier{a:|e} de moi.", en: "First lesson: 10 mph, blinker on the whole time, parallel parking almost nailed. {a.my} was proud of me." }, fx: { rel: 8, happy: 6, discipline: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai calé onze fois. {a.my} est resté{a:|e} calme, puis a crié dans un coussin en rentrant.", en: "I stalled eleven times. {a.my} stayed calm, then screamed into a pillow back home." }, fx: { rel: 3, happy: -2 } },
        ],
      },
      {
        label: { fr: 'Écraser le champignon', en: 'Floor it' },
        out: [
          { w: 2, text: { fr: "J'ai voulu tester l'accélération. J'ai surtout testé la solidité d'un chariot de supermarché. Clés confisquées et {$amount} de réparations.", en: "I wanted to test the acceleration. Mostly I tested the sturdiness of a shopping cart. Keys confiscated and {$amount} in repairs." }, fx: { rel: -10, happy: -3, money: '-amount' }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai foncé, j'ai drifté (sans le faire exprès) et tout s'est bien fini. {a.my} a pris dix ans d'un coup.", en: "I floored it, drifted (by accident) and it all ended fine. {a.my} aged ten years in one go." }, fx: { happy: 8, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Renoncer', en: 'Chicken out' },
        text: { fr: "Finalement, j'ai décidé que le bus, c'était très bien. C'est écolo, et personne ne crie.", en: "In the end, I decided the bus is just fine. It's eco-friendly, and nobody screams." },
        fx: { happy: -1 },
      },
    ],
    vars: { amount: [50, 200] },
  },
  {
    id: 'te_sibling_rivalry',
    icon: '🤼',
    cat: 'family',
    scene: { place: 'home', mood: 'angry' },
    when: { age: [12, 17], has: 'sibling' },
    cooldown: 3,
    actor: 'sibling',
    text: {
      fr: [
        "{a.first} a encore fouillé dans ta chambre et « emprunté » ton chargeur. Pour la quatrième fois cette semaine.",
        "Au dîner, tes parents ne parlent que des exploits de {a.first}. Tu as eu 15 en maths, tout le monde s'en fiche.",
      ],
      en: [
        "{a.first} went through your room again and “borrowed” your charger. For the fourth time this week.",
        "At dinner, your parents only talk about {a.first}'s achievements. You got an A in math and nobody cares.",
      ],
    },
    choices: [
      {
        label: { fr: 'Me venger', en: 'Get revenge' },
        out: [
          { w: 2, text: { fr: "J'ai caché toutes les chaussettes gauches de {a.first}. Une vengeance froide et asymétrique.", en: "I hid all of {a.first}'s left socks. A cold, asymmetrical revenge." }, fx: { happy: 5, rel: -8, karma: -1 } },
          { w: 1, text: { fr: "Ma vengeance s'est retournée contre moi : c'est moi qui ai été puni{|e}. {a.first} jubile en silence.", en: "My revenge backfired: I'm the one who got punished. {a.first} is gloating quietly." }, fx: { happy: -5, rel: -5 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'En parler calmement', en: 'Talk it out' },
        text: { fr: "J'ai parlé calmement avec {a.first}. On a signé un traité de paix sur une serviette en papier.", en: "I talked it out calmly with {a.first}. We signed a peace treaty on a paper napkin." },
        fx: { rel: 10, happy: 2, karma: 2 },
      },
      {
        label: { fr: 'Tout rapporter', en: 'Tell on {a.him}' },
        text: { fr: "J'ai tout raconté aux parents. {a.first} a été privé{a:|e} de dessert. Ça valait le coup.", en: "I told the parents everything. {a.first} lost dessert privileges. Worth it." },
        fx: { rel: -10, happy: 3 },
      },
    ],
  },
  {
    id: 'te_curfew',
    icon: '🌙',
    cat: 'family',
    scene: { place: 'home', mood: 'angry' },
    when: { age: [13, 17] },
    cooldown: 3,
    actor: 'parent',
    text: {
      fr: [
        "{a.rel} a fixé ton couvre-feu à 21 h. Tous tes potes rentrent à minuit. Enfin, d'après eux.",
        "Nouveau règlement de {a.rel} : retour à 21 h 30, « et pas une minute de plus ». Tu as {age} ans, pas huit !",
      ],
      en: [
        "{a.rel} set your curfew at 9 p.m. All your friends get to stay out until midnight. Or so they claim.",
        "New rule from {a.rel}: home by 9:30, “and not a minute later.” You're {age}, not eight!",
      ],
    },
    choices: [
      {
        label: { fr: 'Négocier', en: 'Negotiate' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai négocié avec {a.my} comme un avocat d'affaires. Couvre-feu repoussé d'une heure. Je songe sérieusement au droit.", en: "I negotiated with {a.my} like a corporate lawyer. Curfew pushed back an hour. I'm seriously considering law school." }, fx: { rel: 3, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai voulu négocier. {a.my} a répondu « tant que tu vis sous mon toit… ». Fin des négociations.", en: "I tried to negotiate. {a.my} replied “as long as you live under my roof…” End of negotiations." }, fx: { happy: -3 } },
        ],
      },
      {
        label: { fr: 'Faire le mur', en: 'Sneak out' },
        out: [
          { w: 2, text: { fr: "J'ai fait le mur par la fenêtre. Soirée géniale, retour discret à 2 h. Personne n'a rien vu.", en: "I snuck out the window. Great night, quiet return at 2 a.m. Nobody saw a thing." }, fx: { happy: 8, karma: -2, discipline: -2 }, mood: 'party' },
          { w: 2, text: { fr: "J'ai fait le mur. {a.my} m'attendait assis{a:|e} dans le noir, sur mon lit. J'ai hurlé. Privé{|e} de sorties pendant un mois.", en: "I snuck out. {a.my} was waiting in the dark, sitting on my bed. I screamed. Grounded for a month." }, fx: { rel: -10, happy: -8 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Obéir', en: 'Obey' },
        text: { fr: "J'ai respecté le couvre-feu. {a.my} m'a regardé{|e} avec des yeux de parent fier. Mes potes, avec pitié.", en: "I respected the curfew. {a.my} looked at me with proud-parent eyes. My friends, with pity." },
        fx: { rel: 8, discipline: 3, happy: -2 },
      },
    ],
  },

  // ───────────────────────────── friends & peer pressure ─────────────────────────────
  {
    id: 'te_cigarette',
    icon: '🚬',
    cat: 'friends',
    mature: true,
    scene: { place: 'park', mood: 'neutral' },
    when: { age: [13, 17] },
    once: true,
    actor: { create: { role: 'classmate', age: [0, 2], gender: 'any' } },
    text: {
      fr: [
        "Derrière le gymnase, {a.first} sort un paquet de cigarettes et t'en tend une. « Allez, tout le monde le fait. » (Tout le monde = {a.first} et deux types qui toussent.)",
        "À la sortie des cours, {a.first} te propose une cigarette. Il paraît que ça fait « grand ». Toi, tu vois surtout un nuage qui sent le pneu brûlé.",
      ],
      en: [
        "Behind the gym, {a.first} pulls out a pack of cigarettes and offers you one. “Come on, everybody does it.” (Everybody = {a.first} and two coughing guys.)",
        "After class, {a.first} offers you a cigarette. Apparently it makes you look “grown up.” You mostly see a cloud that smells like burning tires.",
      ],
    },
    choices: [
      {
        label: { fr: 'Non merci', en: 'No thanks' },
        text: { fr: "J'ai refusé la cigarette de {a.first}. Mes poumons m'ont envoyé une carte de remerciement.", en: "I turned down {a.first}'s cigarette. My lungs sent me a thank-you card." },
        fx: { health: 2, karma: 2, discipline: 2 },
      },
      {
        label: { fr: 'Tourner les talons', en: 'Walk away' },
        out: [
          { w: 2, text: { fr: "Je suis parti{|e} sans un mot. {a.first} m'a traité{|e} de bébé. Le bébé a des poumons tout roses, merci.", en: "I walked off without a word. {a.first} called me a baby. The baby has nice pink lungs, thank you." }, fx: { health: 2, happy: -2 } },
          { w: 1, text: { fr: "Je suis parti{|e}, et deux autres m'ont suivi{|e}. Apparemment, je suis un leader maintenant.", en: "I walked away, and two others followed me. Apparently I'm a leader now." }, fx: { happy: 4, karma: 3 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Faire la morale', en: 'Give a lecture' },
        text: { fr: "J'ai improvisé une conférence sur le goudron et les poumons noircis. {a.first} a rangé son paquet, surtout pour que je me taise.", en: "I improvised a lecture on tar and blackened lungs. {a.first} put the pack away, mainly to make me stop talking." },
        fx: { smarts: 1, karma: 2 },
      },
      {
        label: { fr: 'Essayer une fois', en: 'Try one' },
        out: [
          { w: 3, text: { fr: "J'ai tiré une bouffée. J'ai toussé quatre minutes, pleuré un peu, et conclu que ce n'était pas pour moi.", en: "I took one puff. I coughed for four minutes, cried a little, and concluded it wasn't for me." }, fx: { health: -3, happy: -2 }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai essayé, et je n'ai pas détesté. Mauvais signe. Très mauvais signe.", en: "I tried it, and I didn't hate it. Bad sign. Very bad sign." }, fx: { health: -5, discipline: -3, flag: 'te_smoker' } },
        ],
      },
    ],
  },
  {
    id: 'te_peer_dare',
    icon: '😈',
    cat: 'friends',
    scene: { place: 'school', mood: 'neutral' },
    when: { age: [12, 17], school: TEEN_SCHOOL },
    cooldown: 3,
    actor: { create: { role: 'classmate', age: [0, 1], gender: 'any' } },
    text: {
      fr: [
        "{a.first} te met au défi de sécher le cours de maths pour aller au parc. « Personne ne remarquera, il fait l'appel une fois sur deux. »",
        "Toute la bande décide de sécher l'après-midi. {a.first} te regarde : « Tu viens, ou t'as peur ? »",
      ],
      en: [
        "{a.first} dares you to skip math class and go to the park. “Nobody will notice, he only takes attendance half the time.”",
        "The whole gang is skipping the afternoon. {a.first} looks at you: “You coming, or are you scared?”",
      ],
    },
    choices: [
      {
        label: { fr: 'Sécher avec eux', en: 'Skip with them' },
        out: [
          { w: 2, text: { fr: "J'ai séché avec {a.first}. On a mangé des chips sur un banc. Liberté, ennui, et un soupçon de culpabilité.", en: "I skipped with {a.first}. We ate chips on a bench. Freedom, boredom and a pinch of guilt." }, fx: { happy: 6, grade: -4, discipline: -3 } },
          { w: 1, text: { fr: "Après-midi buissonnier avec {a.first} : meilleure journée de l'année. On est devenus potes.", en: "Played hooky with {a.first}: best day of the year. We're friends now." }, fx: { happy: 8, grade: -4, rel: 15, actorRole: 'friend' }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai séché. Le prof a fait l'appel. Deux fois. Mes parents ont reçu un coup de fil, et moi un sermon.", en: "I skipped. The teacher took attendance. Twice. My parents got a phone call, and I got a lecture." }, fx: { grade: -6, happy: -6, discipline: -2 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Rester en cours', en: 'Stay in class' },
        text: { fr: "Je suis resté{|e} en cours. {a.first} m'a traité{|e} de [[fayot|lèche-bottes|chouchou du prof]]. Il y a eu une interro surprise : j'ai eu 17.", en: "I stayed in class. {a.first} called me a [[nerd|suck-up|teacher's pet]]. There was a pop quiz: I aced it." },
        fx: { grade: 4, discipline: 3, happy: -1 },
      },
      {
        label: { fr: 'Les convaincre de rester', en: 'Talk them out of it' },
        out: [
          { w: 1, odds: { smarts: 0.5 }, text: { fr: "J'ai convaincu toute la bande de rester en cours. Le prof a cru à un miracle et a failli verser une larme.", en: "I convinced the whole gang to stay. The teacher thought it was a miracle and nearly shed a tear." }, fx: { karma: 3, happy: 3, grade: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai tenté de les convaincre. Ils sont partis. Moi, je suis resté{|e} seul{|e} avec ma morale et mon cahier.", en: "I tried to talk them out of it. They left. I stayed alone with my morals and my notebook." }, fx: { happy: -3, karma: 2 } },
        ],
      },
    ],
  },
  {
    id: 'te_bullying',
    icon: '👊',
    cat: 'school',
    scene: { place: 'school', mood: 'angry' },
    when: { age: [12, 16], school: TEEN_SCHOOL },
    cooldown: 3,
    weight: 8,
    actor: { create: { role: 'classmate', age: [0, 2], gender: 'any' } },
    text: {
      fr: [
        "{a.first}, un{a:|e} élève de la classe au-dessus, a décidé que tu serais sa cible de l'année. Aujourd'hui, ton sac a fini dans la poubelle.",
        "Depuis la rentrée, {a.first} t'appelle « [[la girafe|la patate|la crevette]] » devant tout le monde. Ce matin, ton plateau de cantine s'est retrouvé par terre.",
      ],
      en: [
        "{a.first}, a kid from the grade above, has decided you're this year's target. Today, your backpack ended up in the trash.",
        "Since the start of the year, {a.first} has been calling you “[[the giraffe|the potato|the shrimp]]” in front of everyone. This morning, your lunch tray ended up on the floor.",
      ],
    },
    choices: [
      {
        label: { fr: 'En parler à un adulte', en: 'Tell an adult' },
        out: [
          { w: 2, text: { fr: "J'en ai parlé à la CPE. {a.first} a été convoqué{a:|e} et me laisse tranquille depuis. Parler, ça marche.", en: "I told the school counselor. {a.first} got called into the office and has left me alone since. Speaking up works." }, fx: { happy: 5, karma: 2, stress: -4 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai prévenu un prof. Son conseil : « Ignore ces gens-là. » Merci, c'est d'une aide précieuse.", en: "I told a teacher. Their advice: “Just ignore them.” Thanks, very helpful." }, fx: { happy: -3, stress: 3 } },
        ],
      },
      {
        label: { fr: 'Me défendre', en: 'Stand up for myself' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "Je lui ai tenu tête. {a.first} ne s'attendait pas à ça. Depuis, {a.he} m'évite avec un respect tout neuf.", en: "I stood my ground. {a.first} didn't see that coming. Since then, {a.he} avoids me with brand-new respect." }, fx: { happy: 6, discipline: -1, actorRole: 'enemy' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai voulu riposter. J'ai fini à l'infirmerie avec un œil au beurre noir et une fierté en miettes.", en: "I tried to fight back. I ended up at the nurse's office with a black eye and my pride in pieces." }, fx: { health: -6, happy: -6, looks: -2, actorRole: 'enemy' }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Répondre par une vanne', en: 'Roast {a.him}' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai répondu par une vanne si bien sentie que toute la cantine a hurlé. {a.first} a changé de cible. Et de table.", en: "I fired back with a roast so sharp the whole cafeteria howled. {a.first} found a new target. And a new table." }, fx: { happy: 8, fame: 1, actorRole: 'enemy' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai tenté une vanne. Elle est tombée à plat. {a.first} l'a répétée avec ma voix toute la semaine.", en: "I tried a comeback. It fell flat. {a.first} repeated it in my voice all week." }, fx: { happy: -6 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Faire comme si de rien', en: 'Ignore it' },
        text: { fr: "J'ai fait comme si {a.first} n'existait pas. Ça n'a pas changé grand-chose, mais j'ai gagné en sagesse. Et en sacs neufs.", en: "I acted like {a.first} didn't exist. It didn't change much, but I gained wisdom. And new backpacks." },
        fx: { happy: -4, stress: 4 },
      },
    ],
  },
  {
    id: 'te_party_mature',
    icon: '🍺',
    cat: 'friends',
    mature: true,
    scene: { place: 'party', mood: 'party' },
    when: { age: [15, 17] },
    cooldown: 3,
    actor: { create: { role: 'classmate', age: [-1, 1], gender: 'any' } },
    text: {
      fr: [
        "{a.first} organise une soirée pendant que ses parents sont partis en week-end. Quelqu'un a ramené des bières « pour faire comme dans les films ».",
        "Grosse fête chez {a.first} ! Musique trop forte, chips écrasées dans le canapé, et un saladier de punch très suspect.",
      ],
      en: [
        "{a.first} is throwing a party while {a:his|her} parents are away for the weekend. Someone brought beer “to be like in the movies.”",
        "Big party at {a.first}'s place! Music too loud, chips crushed into the couch, and a very suspicious bowl of punch.",
      ],
    },
    choices: [
      {
        label: { fr: 'Boire un verre', en: 'Have a drink' },
        out: [
          { w: 2, text: { fr: "J'ai bu un verre de punch suspect et j'ai dansé sur la table basse. La table basse ne s'en est pas remise.", en: "I had a cup of suspicious punch and danced on the coffee table. The coffee table never recovered." }, fx: { happy: 8, health: -2 }, mood: 'party' },
          { w: 1, text: { fr: "J'ai bu un peu trop et passé la soirée à câliner la cuvette des toilettes. Plus jamais. (Je l'ai dit trois fois.)", en: "I drank a bit too much and spent the night hugging the toilet. Never again. (I said it three times.)" }, fx: { health: -6, happy: -6 }, mood: 'sick' },
          { w: 1, text: { fr: "Mes parents sont venus me chercher plus tôt que prévu et ont senti mon haleine. Soirée terminée. Vie sociale aussi.", en: "My parents picked me up earlier than planned and smelled my breath. Party over. Social life too." }, fx: { happy: -8, discipline: 2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Rester au soda', en: 'Stick to soda' },
        text: { fr: "Je suis resté{|e} au soda. Seule personne lucide de la soirée, j'ai tout filmé. Ils me doivent tous un service maintenant.", en: "I stuck to soda. As the only clear-headed person there, I filmed everything. They all owe me a favor now." },
        fx: { happy: 6, health: 1 },
      },
      {
        label: { fr: 'Faire connaissance', en: 'Mingle' },
        out: [
          { w: 1, text: { fr: "J'ai passé la soirée à discuter avec {a.first} dans la cuisine. On est devenus inséparables.", en: "I spent the whole party chatting with {a.first} in the kitchen. We became inseparable." }, fx: { happy: 6, rel: 15, actorRole: 'friend' }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai voulu me mêler aux autres. J'ai fini par caresser le chat de la maison pendant trois heures. Super chat.", en: "I tried to mingle. I ended up petting the house cat for three hours. Great cat." }, fx: { happy: 2 } },
        ],
      },
      {
        label: { fr: 'Rentrer tôt', en: 'Leave early' },
        text: { fr: "Je suis rentré{|e} avant minuit. Le lendemain, j'ai appris que les voisins avaient appelé la police. Bien joué, moi.", en: "I went home before midnight. The next day, I found out the neighbors called the police. Well played, me." },
        fx: { happy: 1, karma: 2 },
      },
    ],
  },
  {
    id: 'te_party',
    icon: '🎉',
    cat: 'friends',
    scene: { place: 'party', mood: 'party' },
    when: { age: [12, 17] },
    cooldown: 2,
    actor: { create: { role: 'classmate', age: [-1, 1], gender: 'any' } },
    text: {
      fr: [
        "{a.first} t'invite à sa fête d'anniversaire. Au programme : pizza, karaoké et une piñata qui a l'air d'en savoir trop.",
        "Soirée pyjama chez {a.first} ! Au menu : jeux vidéo, films d'horreur et beaucoup trop de bonbons.",
      ],
      en: [
        "{a.first} invites you to {a:his|her} birthday party. On the agenda: pizza, karaoke and a piñata that looks like it knows too much.",
        "Sleepover at {a.first}'s place! On the menu: video games, horror movies and way too much candy.",
      ],
    },
    choices: [
      {
        label: { fr: "J'arrive !", en: "I'm in!" },
        out: [
          { w: 3, text: { fr: "Super soirée chez {a.first}. J'ai mangé mon poids en bonbons et ri jusqu'à 3 h du matin. On est potes maintenant.", en: "Great night at {a.first}'s. I ate my body weight in candy and laughed until 3 a.m. We're friends now." }, fx: { happy: 10, rel: 15, actorRole: 'friend' }, mood: 'party' },
          { w: 1, text: { fr: "J'ai renversé du jus de raisin sur le canapé blanc des parents de {a.first}. Je ne suis plus invité{|e} nulle part.", en: "I spilled grape juice on {a.first}'s parents' white couch. I'm no longer invited anywhere." }, fx: { happy: -5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire une entrée remarquée', en: 'Make an entrance' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "Je suis arrivé{|e} avec des lunettes de soleil et une enceinte portable. Je suis devenu{|e} l'âme de la soirée.", en: "I showed up with sunglasses and a portable speaker. I became the life of the party." }, fx: { happy: 10, looks: 2, rel: 10, actorRole: 'friend' }, mood: 'party' },
          { w: 1, text: { fr: "J'ai voulu faire une entrée remarquée. J'ai percuté la baie vitrée. Remarquée, elle l'a été.", en: "I wanted to make an entrance. I walked straight into the glass door. It was certainly noticed." }, fx: { happy: -6, health: -2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Rester chez moi', en: 'Stay home' },
        text: { fr: "J'ai décliné pour finir mon jeu vidéo. J'ai battu le boss final. Personne n'était là pour voir.", en: "I declined to finish my video game. I beat the final boss. Nobody was there to see it." },
        fx: { happy: 1 },
      },
    ],
  },
  {
    id: 'te_viral_video',
    icon: '📲',
    cat: 'social',
    scene: { place: 'home', mood: 'shock', prop: 'phone' },
    when: { age: [13, 17], noFlag: 'te_viral' },
    once: true,
    weight: 5,
    vars: { amount: [50, 300] },
    text: {
      fr: [
        "Ta vidéo où tu [[danses dans ta cuisine|rates un saut en skate|chantes faux sous la douche]] a fait 2 millions de vues en une nuit. Le monde entier te connaît. Enfin, tes camarades et un monsieur au Brésil.",
        "Tu te réveilles avec 9 000 notifications : ta vidéo où tu [[danses dans ta cuisine|rates un saut en skate|chantes faux sous la douche]] est devenue virale.",
      ],
      en: [
        "Your video of you [[dancing in your kitchen|bailing on a skateboard jump|singing off-key in the shower]] got 2 million views overnight. The whole world knows you. Well, your classmates and one man in Brazil.",
        "You wake up to 9,000 notifications: your video of you [[dancing in your kitchen|bailing on a skateboard jump|singing off-key in the shower]] has gone viral.",
      ],
    },
    choices: [
      {
        label: { fr: 'Surfer sur la vague', en: 'Ride the wave' },
        out: [
          { w: 2, text: { fr: "J'ai enchaîné les vidéos pour profiter de ma célébrité. J'ai gagné des abonnés et perdu toute dignité.", en: "I pumped out video after video to milk my fame. I gained followers and lost all dignity." }, fx: { fame: 6, happy: 6, flag: 'te_viral' }, mood: 'happy' },
          { w: 1, text: { fr: "Une marque de chips m'a proposé un partenariat. J'ai été payé{|e} {$amount} et dix kilos de chips.", en: "A chip brand offered me a sponsorship. I got paid {$amount} and twenty pounds of chips." }, fx: { money: 'amount', fame: 8, happy: 10, flag: 'te_viral' }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Supprimer la vidéo', en: 'Delete it' },
        text: { fr: "J'ai supprimé la vidéo. Trop tard : elle existait déjà en 400 remix, dont un avec une musique très dramatique.", en: "I deleted the video. Too late: it already existed in 400 remixes, including one with very dramatic music." },
        fx: { happy: -6, fame: 3, flag: 'te_viral' },
        mood: 'shock',
      },
      {
        label: { fr: 'Assumer avec humour', en: 'Own it' },
        text: { fr: "J'ai assumé à fond et posté une suite encore plus ridicule. Les gens m'ont trouvé{|e} drôle. Moi aussi, d'ailleurs.", en: "I owned it and posted an even sillier sequel. People found me funny. So did I, frankly." },
        fx: { happy: 8, fame: 4, karma: 1, flag: 'te_viral' },
      },
    ],
  },

  // ───────────────────────────── activities ─────────────────────────────
  {
    id: 'te_tryouts',
    icon: '🏀',
    cat: 'sport',
    scene: { place: 'school', mood: 'proud', prop: 'ball' },
    when: { age: [12, 17], school: TEEN_SCHOOL, noFlag: 'te_varsity' },
    cooldown: 2,
    text: {
      fr: [
        "Les sélections pour l'équipe de [[basket|foot|volley|handball]] de {school} ont lieu cette semaine. L'entraîneur a un sifflet et aucune pitié.",
        "Le coach d'athlétisme recrute. Il a dit « tout le monde peut tenter sa chance » en te regardant d'un air sceptique.",
      ],
      en: [
        "Tryouts for the {school} [[basketball|soccer|volleyball|handball]] team are this week. The coach has a whistle and no mercy.",
        "The track coach is recruiting. He said “anyone can give it a shot” while looking at you skeptically.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tenter ma chance', en: 'Try out' },
        out: [
          { w: 2, odds: { athletic: 1.5 }, text: { fr: "J'ai été pris{|e} dans l'équipe ! Le coach a dit « pas mal ». Venant de lui, c'est une déclaration d'amour.", en: "I made the team! The coach said “not bad.” Coming from him, that's a love letter." }, fx: { happy: 10, athletic: 5, flag: 'te_varsity' }, mood: 'proud' },
          { w: 2, text: { fr: "Recalé{|e} aux sélections. J'ai trébuché sur le ballon. Le ballon était immobile.", en: "Cut at tryouts. I tripped over the ball. The ball was not moving." }, fx: { happy: -7, athletic: 1 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: "M'entraîner d'abord", en: 'Train first' },
        text: { fr: "J'ai décidé de m'entraîner avant de me présenter. Un footing par semaine. Bon, par mois.", en: "I decided to train before trying out. One jog a week. Okay, a month." },
        fx: { athletic: 3, discipline: 2 },
      },
      {
        label: { fr: 'Très peu pour moi', en: 'Not my thing' },
        text: { fr: "Le sport en équipe ? Très peu pour moi. Je soutiendrai l'équipe depuis mon canapé, avec ferveur.", en: "Team sports? Not for me. I'll support the team from my couch, passionately." },
        fx: { happy: 1 },
      },
    ],
  },
  {
    id: 'te_band',
    icon: '🎸',
    cat: 'hobby',
    scene: { place: 'school', mood: 'happy', prop: 'guitar' },
    when: { age: [13, 17], noFlag: 'te_band' },
    once: true,
    text: {
      fr: [
        "Des élèves montent un groupe de rock et cherchent du monde. Leur dernier batteur est parti « pour divergences artistiques » (il a déménagé).",
        "Un pote veut monter un groupe dans son garage. Il a déjà le nom, « Les Croissants Toxiques ». Il ne manque plus que… des musiciens.",
      ],
      en: [
        "Some students are starting a rock band and need members. Their last drummer left over “artistic differences” (he moved away).",
        "A friend wants to start a band in his garage. He already has the name, “The Toxic Croissants.” All that's missing is… musicians.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rejoindre le groupe', en: 'Join the band' },
        out: [
          { w: 2, text: { fr: "J'ai rejoint le groupe. On répète tous les samedis. Les voisins ont lancé une pétition.", en: "I joined the band. We rehearse every Saturday. The neighbors started a petition." }, fx: { happy: 8, discipline: 2, flag: 'te_band' }, mood: 'happy' },
          { w: 1, text: { fr: "Première répétition, premier problème : je ne sais jouer d'aucun instrument. On m'a confié le tambourin.", en: "First rehearsal, first problem: I can't play any instrument. They handed me the tambourine." }, fx: { happy: 4, flag: 'te_band' } },
        ],
      },
      {
        label: { fr: 'Devenir leur manager', en: 'Be their manager' },
        text: { fr: "Je suis devenu{|e} manager du groupe. J'ai décroché notre premier concert : la kermesse, payée en crêpes.", en: "I became the band's manager. I landed our first gig: the school fair, paid in pancakes." },
        fx: { smarts: 2, happy: 5, flag: 'te_band' },
      },
      {
        label: { fr: 'Décliner', en: 'Pass' },
        text: { fr: "J'ai décliné. Le monde ne saura jamais ce qu'il a perdu. Moi non plus, d'ailleurs.", en: "I passed. The world will never know what it lost. Neither will I." },
        fx: { happy: -1 },
      },
    ],
  },
  {
    id: 'te_part_time_job',
    icon: '🍔',
    cat: 'work',
    scene: { place: 'home', mood: 'neutral' },
    when: { age: [15, 17], job: false },
    cooldown: 2,
    vars: { amount: [50, 250] },
    text: {
      fr: [
        "Le fast-food du coin cherche des jeunes pour le week-end. Uniforme moche, odeur de friture offerte, mais un vrai salaire.",
        "Tes potes ont tous un petit boulot et se paient des baskets à {$amount}. Toi, tu as ton argent de poche et ta dignité.",
      ],
      en: [
        "The local fast-food joint is hiring teens for weekends. Ugly uniform, complimentary fryer smell, but a real paycheck.",
        "All your friends have part-time jobs and buy {$amount} sneakers. You have your allowance and your dignity.",
      ],
    },
    choices: [
      {
        label: { fr: 'Voir les offres', en: 'Check job listings' },
        text: { fr: "J'ai décidé de chercher un petit boulot. Adieu grasses matinées, bonjour fiche de paie.", en: "I decided to look for a part-time job. Goodbye sleeping in, hello paycheck." },
        fx: { open: 'jobs' },
      },
      {
        label: { fr: 'Tondre des pelouses', en: 'Mow lawns' },
        text: { fr: "J'ai tondu les pelouses du quartier tout l'été. J'ai gagné {$amount} et un bronzage de fermier.", en: "I mowed lawns around the neighborhood all summer. I made {$amount} and a farmer's tan." },
        fx: { money: 'amount', athletic: 2, discipline: 2 },
      },
      {
        label: { fr: "Les études d'abord", en: 'School comes first' },
        text: { fr: "J'ai décliné. Mon job, c'est d'étudier. (Et de dormir. Surtout de dormir.)", en: "I passed. My job is studying. (And sleeping. Mostly sleeping.)" },
        fx: { grade: 3, smarts: 1 },
      },
    ],
  },
];
