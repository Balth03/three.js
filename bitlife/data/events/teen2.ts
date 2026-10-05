// Teen 2 (13–17), university & young adults (18–25), internet & social media culture (18+).
// Minors: ratings 0–1 only, nothing sexual. Rating 2 only with when.age >= 18.
import type { EventDef } from '@bl/sim';

const TEEN: ['middle', 'high'] = ['middle', 'high'];

export const teen2Events: EventDef[] = [
  // ═════════════════════════════ TEENS 13–17 ═════════════════════════════
  // ───────── feed lines ─────────
  {
    id: 't2_auto_screen_time',
    icon: '📵',
    cat: 'social',
    auto: true,
    once: true,
    weight: 8,
    when: { age: [13, 16] },
    text: {
      fr: [
        "Mes parents ont installé un contrôle parental sur mon téléphone. Je l'ai désactivé en quatre minutes grâce à un tuto. Mon père cherche toujours comment changer sa sonnerie.",
        "Mon temps d'écran de la semaine : 61 heures. Le téléphone m'a envoyé une notification pour s'inquiéter. Même lui me juge.",
      ],
      en: [
        "My parents installed parental controls on my phone. I disabled them in four minutes thanks to a tutorial. My dad is still trying to change his ringtone.",
        "My screen time this week: 61 hours. My phone sent me a notification to check if I was okay. Even the phone is judging me.",
      ],
    },
    fx: { happy: 2, smarts: 1 },
  },
  {
    id: 't2_auto_deodorant',
    icon: '🧴',
    cat: 'school',
    auto: true,
    once: true,
    when: { age: [13, 15] },
    text: {
      fr: [
        "J'ai découvert le déodorant. J'ai vidé une bombe entière avant le cours de sport. Le gymnase a été évacué pour suspicion de fuite de gaz.",
        "Ma mère a posé un déodorant sur mon lit, sans un mot. Le message était clair. Le message était humiliant.",
      ],
      en: [
        "I discovered deodorant. I emptied an entire can before gym class. The gym was evacuated for a suspected gas leak.",
        "My mom left a stick of deodorant on my bed without a word. The message was clear. The message was humiliating.",
      ],
    },
    fx: { looks: 1, happy: -1 },
  },
  {
    id: 't2_auto_seen',
    icon: '👀',
    cat: 'social',
    auto: true,
    cooldown: 3,
    when: { age: [13, 17] },
    text: {
      fr: [
        "Mon crush a « vu » mon message à 21 h 04. Aucune réponse. J'ai passé la nuit à analyser ce silence avec trois amis, comme une cellule de crise à l'Élysée.",
        "J'ai envoyé « mdr » à ma mère et « je t'aime maman » au groupe de la classe. J'habite désormais dans la grotte de la honte.",
      ],
      en: [
        "My crush ‘read’ my message at 9:04 p.m. No reply. I spent the whole night analyzing that silence with three friends, like a war room at the Pentagon.",
        "I sent ‘lmao’ to my mom and ‘love you mommy’ to the class group chat. I now live in the cave of shame.",
      ],
    },
    fx: { happy: -2, stress: 2 },
  },
  {
    id: 't2_auto_bathroom_war',
    icon: '🚿',
    cat: 'social',
    auto: true,
    cooldown: 3,
    actor: 'sibling',
    when: { age: [13, 17], has: 'sibling' },
    text: {
      fr: [
        "{a.first} a squatté la salle de bain pendant 55 minutes. J'ai chronométré. J'ai tout noté. Le dossier est prêt pour le tribunal familial.",
        "{a.first} a mangé le yaourt sur lequel j'avais écrit mon prénom au marqueur. La guerre froide a repris. Le frigo est désormais zone démilitarisée.",
      ],
      en: [
        "{a.first} hogged the bathroom for 55 minutes. I timed it. I wrote it all down. The case file is ready for family court.",
        "{a.first} ate the yogurt I had labeled with my name in Sharpie. The Cold War is back on. The fridge is now a demilitarized zone.",
      ],
    },
    fx: { happy: -2, rel: -3 },
  },

  // ───────── phones & social media ─────────
  {
    id: 't2_phone_confiscated',
    icon: '📱',
    cat: 'school',
    scene: { place: 'school', mood: 'shock' },
    when: { age: [13, 17], school: TEEN },
    weight: 9,
    cooldown: 4,
    text: {
      fr: [
        "En plein cours de [[maths|SVT|géo]], ton téléphone vibre sur la table. Le prof le confisque et le pose sur son bureau, écran tourné vers la classe. Il peut s'allumer à tout moment.",
        "Ton téléphone sonne en plein contrôle. Ta sonnerie : un remix de chèvre qui hurle. Le prof tend la main en silence, comme un douanier.",
      ],
      en: [
        "In the middle of [[math|biology|geography]], your phone buzzes on the desk. The teacher confiscates it and sets it on his desk, screen facing the class. It could light up at any moment.",
        "Your phone rings in the middle of a test. Your ringtone: a remix of a screaming goat. The teacher silently holds out his hand, like a customs officer.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le donner dignement', en: 'Hand it over' },
        out: [
          { w: 2, text: { fr: "J'ai rendu mon téléphone. Trente secondes plus tard, notification géante devant toute la classe : « Maman ❤️ : n'oublie pas ta crème pour les pieds mon trésor ». On m'appelle Mycose depuis.", en: "I handed it over. Thirty seconds later, a giant notification in front of everyone: ‘Mommy ❤️: don't forget your foot cream sweetie’. They call me Fungus now." }, fx: { happy: -8, stress: 4 }, mood: 'cry' },
          { w: 2, text: { fr: "J'ai donné mon téléphone sans broncher. Il me l'a rendu à la sonnerie avec un hochement de tête respectueux. Je crois qu'on s'est compris, d'homme à homme. Ou presque.", en: "I gave it up without a fuss. He returned it at the bell with a respectful nod. I think we understood each other. Sort of." }, fx: { discipline: 3, happy: 1 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Refuser net', en: 'Refuse' },
        out: [
          { w: 1, text: { fr: "J'ai serré mon téléphone contre moi comme un bébé koala. Direction le bureau du principal, puis deux heures de colle. Le téléphone et moi, on a tenu bon.", en: "I clung to my phone like a baby koala. Straight to the principal's office, then two hours of detention. The phone and I stood strong." }, fx: { discipline: -4, grade: -3, happy: 2 }, mood: 'angry' },
          { w: 1, text: { fr: "J'ai refusé. Le prof a haussé les épaules et noté mon nom dans un petit carnet noir. Je ne sais pas ce qu'il y a dans ce carnet. Personne ne sait.", en: "I refused. The teacher shrugged and wrote my name in a little black notebook. I don't know what's in that notebook. Nobody does." }, fx: { stress: 5, grade: -2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: "« C'est pas le mien »", en: "‘That's not mine’" },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai juré que ce n'était pas mon téléphone. Il a sonné à nouveau, avec ma photo en fond d'écran. En maillot de bain Pokémon. À 8 ans.", en: "I swore it wasn't my phone. It rang again, with my photo as the wallpaper. In a Pokémon swimsuit. Age eight." }, fx: { happy: -6, karma: -1 }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai désigné mon voisin. Il a eu le téléphone confisqué à ma place et la colle. Il ne m'a plus jamais adressé la parole. Ça me va.", en: "I pointed at the kid next to me. He got my phone confiscated and the detention. He never spoke to me again. Fine by me." }, fx: { karma: -4, happy: 2 }, mood: 'happy' },
        ],
      },
    ],
  },
  {
    id: 't2_finsta',
    icon: '🕵️',
    cat: 'social',
    scene: { place: 'home', mood: 'shock' },
    when: { age: [13, 17], has: 'parent' },
    actor: 'parent',
    once: true,
    text: {
      fr: [
        "Tu as un compte secret où tu postes tes pensées profondes et des photos floues de ton plafond. Ce matin, notification : « {a.rel} souhaite vous suivre ».",
        "{a.rel} a trouvé ton deuxième compte, celui avec 14 abonnés triés sur le volet. {a:Il|Elle} a liké une story d'il y a deux ans et commenté « 🥰 mon bébé ».",
      ],
      en: [
        "You have a secret account where you post deep thoughts and blurry photos of your ceiling. This morning, a notification: ‘{a.rel} wants to follow you’.",
        "{a.rel} found your second account, the one with 14 hand-picked followers. {a:He|She} liked a story from two years ago and commented ‘🥰 my baby’.",
      ],
    },
    choices: [
      {
        label: { fr: 'Accepter', en: 'Accept' },
        text: { fr: "J'ai accepté {a.my} sur mon compte secret. {a:Il|Elle} commente chaque post avec trois emojis qui n'ont rien à voir. Mes amis ont tous quitté le compte. Il ne reste que {a.my} et un bot russe.", en: "I let {a.my} follow my secret account. {a:He|She} comments on every post with three unrelated emojis. My friends all unfollowed. It's just {a.my} and a Russian bot now." },
        fx: { rel: 8, happy: -4, followers: -10 },
        mood: 'sad',
      },
      {
        label: { fr: '{a:Le|La} bloquer', en: 'Block {a.him}' },
        out: [
          { w: 1, text: { fr: "J'ai bloqué {a.my}. {a:Il|Elle} l'a remarqué en dix secondes et a coupé le Wi-Fi de la maison en représailles. Une guerre numérique a commencé.", en: "I blocked {a.my}. {a:He|She} noticed within ten seconds and shut off the house Wi-Fi in retaliation. A digital war has begun." }, fx: { rel: -10, happy: -3 }, mood: 'angry' },
          { w: 1, text: { fr: "J'ai bloqué {a.my}. {a:Il|Elle} pense que j'ai supprimé le compte. Je vis dans le mensonge, mais un mensonge avec 14 abonnés de qualité.", en: "I blocked {a.my}. {a:He|She} thinks I deleted the account. I live a lie, but a lie with 14 quality followers." }, fx: { rel: -2, happy: 4, karma: -1 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Supprimer le compte', en: 'Delete the account' },
        text: { fr: "J'ai supprimé mon compte secret, trois ans de pensées profondes. L'humanité ne saura jamais ce que je pensais de la cantine du mardi.", en: "I deleted my secret account. Three years of deep thoughts, gone. Humanity will never know what I thought about Tuesday's cafeteria lunch." },
        fx: { happy: -3, discipline: 2 },
        mood: 'sad',
      },
    ],
  },
  {
    id: 't2_streak',
    icon: '🔥',
    cat: 'social',
    scene: { place: 'home', mood: 'shock' },
    when: { age: [13, 17], has: 'anyFriend' },
    actor: 'anyFriend',
    cooldown: 5,
    text: {
      fr: [
        "Ta série de flammes avec {a.first} en est à 412 jours. {a:Il|Elle} part deux semaines en colo sans réseau et te confie ses identifiants. C'est la responsabilité la plus lourde de ta vie.",
        "{a.first} part en vacances dans un gîte sans Wi-Fi « pour se reconnecter à la nature ». Ta série de 600 jours avec {a:lui|elle} est en danger. {a:Il|Elle} te donne son mot de passe en pleurant.",
      ],
      en: [
        "Your snap streak with {a.first} is at 412 days. {a:He|She} is leaving for two weeks of summer camp with no signal and hands you {a:his|her} login. It's the heaviest responsibility of your life.",
        "{a.first} is going on vacation to a cabin with no Wi-Fi ‘to reconnect with nature’. Your 600-day streak is in danger. {a:He|She} gives you {a:his|her} password, crying.",
      ],
    },
    choices: [
      {
        label: { fr: 'Assurer la série', en: 'Keep it alive' },
        out: [
          { w: 3, text: { fr: "Pendant deux semaines, j'ai envoyé chaque jour une photo de mon plafond depuis deux comptes. La série a survécu. {a.first} m'a serré{|e} dans ses bras à son retour comme un soldat revenu du front.", en: "For two weeks, I sent a photo of my ceiling from two accounts every single day. The streak survived. {a.first} hugged me on {a:his|her} return like a soldier home from war." }, fx: { rel: 15, happy: 4, discipline: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai oublié un seul jour. UN SEUL. La flamme est morte à 418 jours. {a.first} a organisé des funérailles. Je n'étais pas invité{|e}.", en: "I forgot one day. ONE. The streak died at 418 days. {a.first} held a funeral. I wasn't invited." }, fx: { rel: -15, happy: -5 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Fouiller ses messages', en: 'Snoop in the DMs' },
        out: [
          { w: 1, text: { fr: "J'ai lu les messages de {a.first}. J'ai découvert qu'{a:il|elle} m'appelle « le boulet » dans un autre groupe. J'ai gardé la série en vie. Par pure vengeance froide.", en: "I read {a.first}'s messages. Turns out {a.he} calls me ‘the anchor’ in another group chat. I kept the streak alive anyway. Out of pure cold revenge." }, fx: { happy: -6, karma: -3, rel: -10 }, mood: 'angry' },
          { w: 1, text: { fr: "J'ai fouillé ses messages. Rien d'intéressant, juste 3 000 stickers de chat. Je me sens sale et déçu{|e}.", en: "I went through {a:his|her} DMs. Nothing juicy, just 3,000 cat stickers. I feel dirty and disappointed." }, fx: { karma: -2, happy: -1 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Laisser mourir', en: 'Let it die' },
        text: { fr: "J'ai laissé la flamme s'éteindre. Je me suis senti{|e} libre pour la première fois depuis 2 ans. {a.first}, moins.", en: "I let the streak die. I felt free for the first time in two years. {a.first}, less so." },
        fx: { rel: -12, stress: -5, happy: 2 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 't2_cyberbully',
    icon: '😡',
    cat: 'social',
    rating: 1,
    scene: { place: 'home', mood: 'sad' },
    when: { age: [13, 17], school: TEEN },
    once: true,
    text: {
      fr: [
        "Un compte anonyme, @[[la_verite_du_bahut|balance_ton_college|gossip_du_lycee]], poste des montages de ta tête sur un corps de [[pingouin|Shrek|poubelle de cantine]]. 300 likes, dont celui de ta meilleure amie.",
        "Depuis une semaine, quelqu'un commente toutes tes photos avec « sale tête de cul » et des emojis de vomi. Le compte s'appelle @tonpirecauchemar. Il a 2 abonnés : toi et sa mère, sans doute.",
      ],
      en: [
        "An anonymous account, @[[school_tea_spiller|truth_about_ur_school|hallway_gossip]], posts edits of your face on the body of [[a penguin|Shrek|a cafeteria trash can]]. 300 likes, including your best friend's.",
        "For a week, someone has been commenting ‘butt-face loser’ and vomit emojis under all your photos. The account is called @urworstnightmare. It has two followers: you and probably its mom.",
      ],
    },
    choices: [
      {
        label: { fr: 'En parler à un adulte', en: 'Tell an adult' },
        out: [
          { w: 2, text: { fr: "J'en ai parlé au CPE. Le compte a été supprimé en deux jours. Le CPE m'a aussi fait un exposé de 45 minutes sur « les dangers du numérique ». C'était presque pire.", en: "I told the school counselor. The account was gone in two days. The counselor also gave me a 45-minute talk about ‘the dangers of the internet’. Almost worse." }, fx: { happy: 4, stress: -6, karma: 2 }, mood: 'happy' },
          { w: 1, text: { fr: "Mes parents ont débarqué au collège comme des agents du FBI. Le compte a disparu. Ma dignité aussi, quand ma mère a dit « mon petit chat » devant le principal.", en: "My parents stormed the school like FBI agents. The account vanished. So did my dignity, when my mom called me ‘my little kitten’ in front of the principal." }, fx: { happy: 1, stress: -4 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Mener l’enquête', en: 'Investigate' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai comparé les fautes d'orthographe, les horaires de publication et l'usage suspect du mot « wesh ». J'ai un suspect.", en: "I cross-referenced the typos, the posting times and a suspicious use of the word ‘bruh’. I have a suspect." }, fx: { smarts: 3, chain: 't2_cyberbully_unmask' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai passé trois nuits à enquêter et j'ai accusé la mauvaise personne. Le vrai coupable a posté un montage de moi en Sherlock Holmes. Il était réussi, en plus.", en: "I spent three nights investigating and accused the wrong person. The real culprit posted an edit of me as Sherlock Holmes. It was well done, too." }, fx: { happy: -5, stress: 5 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Riposter en meme', en: 'Meme back' },
        out: [
          { w: 1, odds: { smarts: 0.5 }, text: { fr: "J'ai fait un montage du compte anonyme en clown triste, plus drôle que tous les siens. 900 likes. Le compte a fermé dans la nuit. J'ai gagné la guerre des memes.", en: "I made an edit of the anonymous account as a sad clown, funnier than all of theirs. 900 likes. The account shut down overnight. I won the meme war." }, fx: { happy: 8, followers: 150, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: "Mon contre-meme était nul. Même ma mère ne l'a pas liké. Le compte anonyme en a fait un meme. Je suis un meme de meme, putain.", en: "My counter-meme was trash. Even my mom didn't like it. The anonymous account turned it into a meme. I'm a meme of a meme, goddammit." }, fx: { happy: -7, stress: 4 }, mood: 'cry' },
        ],
      },
    ],
  },
  {
    id: 't2_cyberbully_unmask',
    icon: '🎭',
    cat: 'social',
    chainOnly: true,
    scene: { place: 'school', mood: 'shock' },
    when: { age: [13, 17] },
    actor: { create: { role: 'classmate', age: [-1, 1], gender: 'any' } },
    text: {
      fr: ["Ton enquête aboutit : derrière le compte se cache {a.first}, l'élève le plus discret de ta classe, celui qui te prête toujours sa gomme sans rien dire."],
      en: ["Your investigation pays off: behind the account is {a.first}, the quietest kid in your class, the one who always silently lends you an eraser."],
    },
    choices: [
      {
        label: { fr: 'Le signaler', en: 'Report it' },
        text: { fr: "J'ai apporté mon dossier de 12 pages au principal, avec des captures annotées. {a.first} a été exclu{a:|e} trois jours. Le principal m'a conseillé de faire flic plus tard.", en: "I brought my 12-page file to the principal, with annotated screenshots. {a.first} got a three-day suspension. The principal told me I should become a cop." },
        fx: { happy: 6, karma: 2, smarts: 2 },
        mood: 'proud',
      },
      {
        label: { fr: 'Lui parler en face', en: 'Talk face to face' },
        out: [
          { w: 2, text: { fr: "J'ai demandé à {a.first} pourquoi. {a:Il|Elle} a fondu en larmes : {a:il|elle} s'ennuyait et trouvait que j'avais « une tête à montages ». On est devenus potes. Bizarrement.", en: "I asked {a.first} why. {a:He|She} burst into tears: {a.he} was bored and thought I had ‘a very editable face’. We became friends. Weirdly." }, fx: { happy: 5, karma: 4, rel: 20, actorRole: 'friend' }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai confronté {a.first}. {a:Il|Elle} a nié en me regardant droit dans les yeux, puis a posté un montage de moi le soir même. Respect, quelque part.", en: "I confronted {a.first}. {a:He|She} denied everything looking me dead in the eye, then posted an edit of me that same night. Respect, honestly." }, fx: { happy: -4, actorRole: 'enemy', keep: true }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Le faire chanter', en: 'Blackmail' },
        text: { fr: "J'ai gardé le secret, contre une condition : {a.first} fait mes devoirs de maths jusqu'au bac. Le crime paie, et en plus j'ai 16 de moyenne.", en: "I kept the secret on one condition: {a.first} does my math homework until graduation. Crime pays, and my grades are great." },
        fx: { grade: 8, karma: -5, happy: 3 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 't2_mom_facebook',
    icon: '👶',
    cat: 'social',
    scene: { place: 'home', mood: 'shock' },
    when: { age: [13, 17], has: 'parent' },
    actor: 'parent',
    cooldown: 5,
    text: {
      fr: [
        "{a.rel} a posté sur Facebook une photo de toi à 3 ans, déguisé{|e} en citrouille, en pleurs, de la purée dans les cheveux. Légende : « Mon bébé a bien grandi 😍 #fierté ». 47 commentaires, dont ta prof d'anglais.",
        "{a.rel} a partagé « Mon ado en 10 photos gênantes » dans un groupe de 12 000 parents. La photo 7, c'est toi en train de faire un câlin à un pigeon mort. Quelqu'un l'a déjà transformée en sticker.",
      ],
      en: [
        "{a.rel} posted a photo on Facebook of you at age three, dressed as a pumpkin, sobbing, with mashed potatoes in your hair. Caption: ‘My baby's all grown up 😍 #proud’. 47 comments, including your English teacher.",
        "{a.rel} shared ‘My teen in 10 embarrassing photos’ in a parenting group with 12,000 members. Photo 7 is you hugging a dead pigeon. Someone already made it a sticker.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exiger la suppression', en: 'Demand deletion' },
        out: [
          { w: 1, text: { fr: "J'ai exigé que {a.my} supprime la photo. {a:Il|Elle} l'a fait, puis l'a imprimée en grand pour le salon. On ne gagne jamais contre un parent.", en: "I demanded {a.my} delete it. {a:He|She} did, then printed it poster-size for the living room. You never win against a parent." }, fx: { happy: -3, rel: -3 }, mood: 'angry' },
          { w: 1, text: { fr: "{a.my} a supprimé la photo en soupirant : « Tu étais tellement plus mignon{|ne} avant. » Ça fait mal, mais c'est réglé.", en: "{a.my} deleted it with a sigh: ‘You were so much cuter back then.’ That hurt, but it's handled." }, fx: { happy: 1, rel: -2 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Contre-attaque', en: 'Counterattack' },
        text: { fr: "J'ai posté une photo de {a.my} dans les années 90 : coupe mulet, survêt fluo, banane à la taille. 300 likes. Ses collègues l'ont vue. Match nul, honneur sauf.", en: "I posted a photo of {a.my} from the '90s: mullet, neon tracksuit, fanny pack. 300 likes. {a:His|Her} coworkers saw it. A draw, honor intact." },
        fx: { happy: 6, rel: -5, followers: 80 },
        mood: 'proud',
      },
      {
        label: { fr: 'Assumer la photo', en: 'Own it' },
        text: { fr: "J'ai mis la photo en photo de profil. C'est devenu ma marque. Au collège, on me salue désormais avec un mélange de pitié et de respect.", en: "I made the photo my profile picture. It became my brand. At school, people now greet me with a mix of pity and respect." },
        fx: { happy: 4, fame: 1, followers: 50 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 't2_search_history',
    icon: '🔍',
    cat: 'social',
    scene: { place: 'home', mood: 'shock' },
    when: { age: [13, 17], has: 'parent' },
    actor: 'parent',
    once: true,
    text: {
      fr: [
        "{a.rel} a emprunté ton ordi et est tombé{a:|e} sur ton historique de recherche : « comment savoir si on est adopté », « peut-on mourir de honte », « pourquoi mes pieds sentent le comté ».",
        "{a.rel} t'attend dans la cuisine avec ton ordi ouvert. Historique : « comment devenir riche à 14 ans sans travailler », « vivre seul dans une forêt légal ? », « mes parents sont-ils des robots ».",
      ],
      en: [
        "{a.rel} borrowed your laptop and stumbled on your search history: ‘how to tell if ur adopted’, ‘can you die of embarrassment’, ‘why do my feet smell like cheddar’.",
        "{a.rel} is waiting in the kitchen with your laptop open. History: ‘how to get rich at 14 without working’, ‘is living alone in a forest legal’, ‘are my parents robots’.",
      ],
    },
    choices: [
      {
        label: { fr: 'Nier en bloc', en: 'Deny everything' },
        text: { fr: "J'ai affirmé que c'était un virus. Un virus très curieux de mes pieds. {a.my} n'y a pas cru, mais a eu pitié.", en: "I claimed it was a virus. A virus very curious about my feet. {a.my} didn't buy it, but took pity on me." },
        fx: { happy: -2, karma: -1, rel: -2 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Accuser le chat', en: 'Blame the cat' },
        out: [
          { w: 1, text: { fr: "J'ai accusé le chat. {a.my} m'a rappelé qu'on n'a pas de chat. J'ai répondu « justement, il se cache bien ». Silence de dix secondes.", en: "I blamed the cat. {a.my} reminded me we don't have a cat. I said, ‘Exactly, he hides really well.’ Ten seconds of silence." }, fx: { happy: 2, rel: 1 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai accusé le chat. Le chat m'a regardé{|e} avec mépris et a vomi sur le clavier. Il a eu le dernier mot.", en: "I blamed the cat. The cat stared at me with contempt and threw up on the keyboard. He had the last word." }, fx: { happy: -1 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Avoir une vraie discussion', en: 'Have a real talk' },
        text: { fr: "On a parlé une heure. Je ne suis pas adopté{|e}, mes parents ne sont pas des robots, et mes pieds, c'est génétique, côté paternel. Instructif.", en: "We talked for an hour. I'm not adopted, my parents aren't robots, and the feet thing is genetic, on Dad's side. Educational." },
        fx: { rel: 10, happy: 3, stress: -4 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 't2_teen_brand',
    icon: '🍬',
    cat: 'influencer',
    scene: { place: 'home', mood: 'happy' },
    when: { age: [14, 17] },
    weight: 5,
    once: true,
    text: {
      fr: [
        "Une marque de gommes vitaminées vegan t'envoie un message : 50 sachets gratuits si tu fais une story « authentique ». Tu as 312 abonnés, dont 40 sont ta famille.",
      ],
      en: [
        "A vegan vitamin gummy brand DMs you: 50 free packs if you post an ‘authentic’ story. You have 312 followers, 40 of whom are family.",
      ],
    },
    choices: [
      {
        label: { fr: 'Accepter le deal', en: 'Take the deal' },
        out: [
          { w: 2, text: { fr: "J'ai fait ma story en souriant comme un présentateur télé. 9 vues, dont ma grand-mère qui a demandé si j'étais malade. Les gommes ont un goût de gazon sucré.", en: "I filmed my story, grinning like a game show host. 9 views, including my grandma asking if I was sick. The gummies taste like sweetened lawn." }, fx: { happy: 2, followers: 30 }, mood: 'neutral' },
          { w: 1, text: { fr: "Ma vidéo a plu à l'algorithme pour des raisons inconnues. 40 000 vues. La marque m'a renvoyé 200 sachets. Ma chambre est un entrepôt.", en: "The algorithm loved my video for no known reason. 40,000 views. The brand sent me 200 more packs. My bedroom is now a warehouse." }, fx: { happy: 8, followers: 3000, fame: 2 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Négocier du cash', en: 'Ask for cash' },
        text: { fr: "J'ai demandé de l'argent en citant mon « taux d'engagement ». Ils m'ont envoyé 20 € et un mail qui commençait par « Coucou la star ». C'est un début.", en: "I asked for money, citing my ‘engagement rate’. They sent me $20 and an email starting with ‘Hey superstar’. It's a start." },
        fx: { money: 20, smarts: 1, happy: 3 },
        mood: 'happy',
      },
      {
        label: { fr: 'Ignorer', en: 'Ignore' },
        text: { fr: "J'ai ignoré la marque. Mon intégrité artistique est intacte. Mes 312 abonnés ne le sauront jamais.", en: "I ignored the brand. My artistic integrity is intact. My 312 followers will never know." },
        fx: { karma: 1 },
        mood: 'neutral',
      },
    ],
  },

  // ───────── school life ─────────
  {
    id: 't2_slideshow',
    icon: '🐉',
    cat: 'school',
    scene: { place: 'school', mood: 'shock' },
    when: { age: [13, 17], school: TEEN },
    once: true,
    text: {
      fr: [
        "Exposé devant la classe. Tu branches ton ordi au vidéoprojecteur. Tu as oublié de fermer l'onglet précédent : ta fanfiction de 40 pages où le prof de maths est un dragon qui protège un royaume de calculatrices.",
      ],
      en: [
        "Class presentation. You plug your laptop into the projector. You forgot to close the last tab: your 40-page fanfic in which the math teacher is a dragon guarding a kingdom of calculators.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire comme si de rien', en: 'Act normal' },
        out: [
          { w: 1, odds: { smarts: 0.5 }, text: { fr: "J'ai fermé l'onglet avec le calme d'un démineur et j'ai enchaîné. Personne n'a rien dit. Tout le monde a vu. Le prof a eu un petit sourire en me rendant ma note.", en: "I closed the tab with the calm of a bomb disposal expert and carried on. Nobody said a word. Everyone saw. The teacher had a little smile when he gave me my grade." }, fx: { grade: 4, stress: 4 }, mood: 'neutral' },
          { w: 1, text: { fr: "J'ai voulu fermer l'onglet, j'ai cliqué sur « plein écran ». Il y a eu un silence, puis un rire si fort qu'un surveillant est venu voir.", en: "I tried to close the tab and clicked ‘full screen’. There was silence, then laughter so loud a hall monitor came to check." }, fx: { happy: -7, fame: 1 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Assumer et lire', en: 'Own it, read it' },
        out: [
          { w: 1, text: { fr: "J'ai lu le chapitre 1 à voix haute avec les bruitages. Standing ovation. Le prof a demandé la suite. Je suis désormais auteur{|e} officiel{|le} de la classe.", en: "I read chapter 1 aloud with sound effects. Standing ovation. The teacher asked for the sequel. I'm now the class's official author." }, fx: { happy: 10, fame: 2, grade: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai lu à voix haute. Le prof, pas du tout flatté, m'a mis 4/20 et un mot dans le carnet : « Je ne suis pas un dragon. » Il crache un peu quand il parle, pourtant.", en: "I read it aloud. The teacher, not flattered at all, gave me an F and a note home: ‘I am not a dragon.’ He does spit a little when he talks, though." }, fx: { grade: -8, happy: 3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Débrancher et fuir', en: 'Unplug and run' },
        text: { fr: "J'ai arraché le câble, simulé une crise d'asthme et passé l'heure à l'infirmerie. L'infirmière m'a donné un sucre. Je l'ai mérité.", en: "I yanked the cable, faked an asthma attack and spent the hour in the nurse's office. She gave me a sugar cube. I earned it." },
        fx: { grade: -4, happy: -2, karma: -1 },
        mood: 'sad',
      },
    ],
  },
  {
    id: 't2_vape_bathroom',
    icon: '💨',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'neutral' },
    when: { age: [14, 17], school: TEEN },
    actor: { create: { role: 'classmate', age: [-1, 1], gender: 'any' } },
    cooldown: 4,
    text: {
      fr: [
        "Dans les toilettes du lycée, {a.first} te tend sa vapoteuse « Blue Razz Ice ». Elle a la forme d'un surligneur, ce qui est soit génial, soit très inquiétant.",
        "Les toilettes sont devenues un brouillard parfumé à la [[mangue|barbe à papa|pastèque givrée]]. Au milieu du nuage, {a.first} te tend sa vapoteuse comme un calumet de la paix.",
      ],
      en: [
        "In the school bathroom, {a.first} hands you a ‘Blue Razz Ice’ vape. It's shaped like a highlighter, which is either genius or deeply concerning.",
        "The bathroom has turned into a [[mango|cotton candy|frosted watermelon]]-scented fog. In the middle of the cloud, {a.first} offers you a vape like a peace pipe.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tirer une latte', en: 'Take a hit' },
        out: [
          { w: 2, text: { fr: "J'ai tiré une latte et toussé si fort que j'ai fait tomber mon téléphone dans les toilettes. {a.first} a filmé. J'ai le goût de la pastèque chimique jusque dans les dents.", en: "I took a hit and coughed so hard I dropped my phone in the toilet. {a.first} filmed it. I can taste chemical watermelon in my teeth." }, fx: { health: -3, happy: -2, addiction: ['tobacco', 4] }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai soufflé un nuage énorme. Le détecteur de fumée s'est déclenché, tout le lycée a été évacué sous la pluie. 800 élèves trempés me cherchent. Moi, je suis dans la foule, discret{|e}.", en: "I blew a massive cloud. The smoke detector went off and the whole school was evacuated into the rain. 800 soaked students want to know who did it. I'm in the crowd, looking innocent." }, fx: { happy: 4, stress: 6, addiction: ['tobacco', 4] }, mood: 'shock' },
          { w: 1, text: { fr: "Le CPE est entré pile au moment où je recrachais. Trois jours d'exclusion, et mes parents ont reçu un appel. Ma mère a dit « une VAPOTEUSE ? » comme si j'avais braqué une banque.", en: "The vice principal walked in right as I exhaled. Three-day suspension, and my parents got a call. My mom said ‘a VAPE?’ like I'd robbed a bank." }, fx: { discipline: -4, grade: -5, happy: -6 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Refuser', en: 'Pass' },
        text: { fr: "J'ai dit non merci. {a.first} a haussé les épaules. Je suis ressorti{|e} quand même en sentant la barbe à papa, et mes parents m'ont suspecté{|e} toute la soirée.", en: "I said no thanks. {a.first} shrugged. I still came out smelling like cotton candy, and my parents eyed me suspiciously all evening." },
        fx: { health: 1, discipline: 2 },
        mood: 'neutral',
      },
      {
        label: { fr: 'La confisquer', en: 'Confiscate it' },
        text: { fr: "J'ai piqué la vapoteuse et je l'ai jetée dans la cuvette. {a.first} m'a traité{|e} de « grosse balance de merde ». La chasse d'eau a fait un bruit de victoire.", en: "I snatched the vape and dropped it in the toilet. {a.first} called me a ‘goddamn narc’. The flush sounded like victory." },
        fx: { karma: 3, happy: 2, rel: -15 },
        mood: 'proud',
      },
    ],
  },
  {
    id: 't2_trip_hotel',
    icon: '🏨',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'party' },
    when: { age: [14, 17], school: TEEN },
    once: true,
    text: {
      fr: [
        "Voyage scolaire, nuit à l'hôtel. Les profs patrouillent dans le couloir avec des lampes frontales. Dans la chambre 214, juste à côté, quelqu'un a caché de la vodka dans une bouteille de shampoing coco.",
        "Dernier soir du voyage scolaire. Le prof de sport dort devant ta porte sur une chaise, en ronflant comme un tracteur. Toute la classe se retrouve chambre 214, où quelqu'un a caché de la vodka dans une bouteille de shampoing coco.",
      ],
      en: [
        "School trip, night at the hotel. The teachers patrol the hallway with headlamps. In room 214, right next door, someone has hidden vodka in a coconut shampoo bottle.",
        "Last night of the school trip. The gym teacher is asleep on a chair outside your door, snoring like a tractor. The whole class is meeting up in room 214, where someone hid vodka in a coconut shampoo bottle.",
      ],
    },
    choices: [
      {
        label: { fr: 'Aller chambre 214', en: 'Go to room 214' },
        out: [
          { w: 2, text: { fr: "J'ai rejoint la fête en rampant sous la porte. On a bu une gorgée de vodka-shampoing chacun (goût : coco et regrets), joué à action ou vérité et ri jusqu'à 3 h. Meilleure nuit de ma vie.", en: "I army-crawled to the party. We each had one sip of shampoo vodka (flavor: coconut and regret), played truth or dare and laughed until 3 a.m. Best night of my life." }, fx: { happy: 12, health: -2 }, mood: 'party' },
          { w: 1, text: { fr: "Le prof s'est réveillé. Il nous a trouvés à 14 dans une chambre pour deux, plus la bouteille. Renvoyé{|e} à la maison en train le lendemain, avec un accompagnateur qui ne m'a pas adressé la parole pendant 6 heures.", en: "The teacher woke up. He found fourteen of us in a room for two, plus the bottle. Sent home by train the next day with a chaperone who didn't say a word to me for six hours." }, fx: { happy: -6, discipline: -5, grade: -3 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Dormir sagement', en: 'Sleep' },
        text: { fr: "Je suis resté{|e} dans ma chambre. Toute la nuit, j'ai entendu des rires, des chuchotements, et à 2 h quelqu'un qui vomissait dans le couloir. Ce n'était pas moi. Je suis le seul à avoir vu le musée le lendemain.", en: "I stayed in my room. All night I heard laughter, whispers, and at 2 a.m. someone throwing up in the hallway. Not me. I was the only one awake enough to see the museum the next day." },
        fx: { smarts: 2, happy: -2, discipline: 2 },
        mood: 'sleepy',
      },
      {
        label: { fr: 'Saboter la fête', en: 'Prank the party' },
        text: { fr: "J'ai frappé à la porte de la 214 en imitant la voix du prof. Dix élèves ont sauté par la fenêtre du rez-de-chaussée, en pyjama, dans une haie. Légende instantanée.", en: "I knocked on 214's door doing the teacher's voice. Ten kids jumped out the ground-floor window in their pajamas, straight into a hedge. Instant legend." },
        fx: { happy: 9, fame: 2, karma: -1 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 't2_big_game',
    icon: '🏆',
    cat: 'school',
    scene: { place: 'stadium', mood: 'shock' },
    when: { age: [13, 17], school: TEEN, stat: { athletic: [35, 100] } },
    cooldown: 3,
    text: {
      fr: [
        "Finale du championnat [[de foot|de handball|de basket]]. Dernière seconde, égalité, et le coach te désigne pour le tir décisif. Toute l'école regarde. Ton père filme en portrait.",
        "Finale inter-lycées. Il reste 3 secondes et le ballon atterrit dans tes mains. Dans les gradins, ton crush, ta mère avec une banderole à ton prénom (mal orthographié), et un recruteur qui mange un hot-dog.",
      ],
      en: [
        "Championship final, [[soccer|handball|basketball]]. Last second, tied game, and the coach picks you for the deciding shot. The whole school is watching. Your dad is filming vertically.",
        "Inter-school final. Three seconds left and the ball lands in your hands. In the stands: your crush, your mom holding a banner with your name (misspelled), and a scout eating a hot dog.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tirer en force', en: 'Power shot' },
        out: [
          { w: 1, odds: { athletic: 1.2 }, text: { fr: "Tir parfait. On a gagné. J'ai été porté{|e} en triomphe et quelqu'un a pleuré. Probablement mon père, derrière son téléphone.", en: "Perfect shot. We won. They carried me on their shoulders and someone cried. Probably my dad, behind his phone." }, fx: { happy: 14, fame: 3, athletic: 3, followers: 200 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai tiré de toutes mes forces. Le ballon est parti dans les gradins et a percuté le hot-dog du recruteur. On a perdu. Le recruteur a gardé le ballon.", en: "I shot with everything I had. The ball flew into the stands and smashed the scout's hot dog. We lost. The scout kept the ball." }, fx: { happy: -8, fame: 1 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Tenter la feinte', en: 'Try a fake' },
        out: [
          { w: 1, odds: { athletic: 0.8, smarts: 0.4 }, text: { fr: "J'ai feinté. Le défenseur est parti à gauche, son short à droite. J'ai marqué dans le chaos. Victoire, et une vidéo virale du short.", en: "I faked. The defender went left, his shorts went right. I scored in the chaos. Victory, plus a viral video of the shorts." }, fx: { happy: 12, fame: 2, followers: 1500 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai feinté si fort que je me suis feinté{|e} moi-même. Cheville tordue, ballon perdu, match perdu. L'élégance, au moins.", en: "I faked so hard I faked myself out. Twisted ankle, lost ball, lost game. At least it looked elegant." }, fx: { happy: -6, health: -5, disease: 'sprain' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Passer la balle', en: 'Pass the ball' },
        text: { fr: "J'ai passé la balle au meilleur joueur. Il a marqué. Tout le monde l'a porté en triomphe. Moi, on m'a tapé l'épaule. L'esprit d'équipe, c'est ingrat.", en: "I passed to our best player. He scored. Everyone carried him off the field. I got a pat on the shoulder. Team spirit is thankless." },
        fx: { happy: 3, karma: 2 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 't2_hallway_fight',
    icon: '🥊',
    cat: 'school',
    rating: 1,
    scene: { place: 'school', mood: 'angry' },
    when: { age: [14, 17], school: TEEN },
    actor: { create: { role: 'classmate', age: [0, 2], gender: 'same' } },
    cooldown: 5,
    text: {
      fr: [
        "Dans le couloir, {a.first} te bouscule exprès et fait tomber ton plateau. Un cercle se forme. Quelqu'un hurle « BAGARRE ! » et douze téléphones s'allument en même temps.",
      ],
      en: [
        "In the hallway, {a.first} shoves you on purpose and knocks your lunch tray over. A circle forms. Someone yells ‘FIGHT!’ and twelve phones light up at once.",
      ],
    },
    choices: [
      {
        label: { fr: 'Se battre', en: 'Fight' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "Trois secondes de bagarre confuse, beaucoup de tirage de pull, puis {a.first} a glissé sur ma purée. Victoire par K.-O. alimentaire. Deux jours d'exclusion, mais quelle réputation.", en: "Three seconds of messy fighting, lots of sweater-pulling, then {a.first} slipped on my mashed potatoes. Victory by food knockout. Two-day suspension, but what a reputation." }, fx: { happy: 6, fame: 2, discipline: -4, grade: -3 }, mood: 'proud' },
          { w: 1, text: { fr: "Je me suis pris une beigne monumentale avant d'avoir levé le poing. Nez qui saigne, vidéo à 4 000 vues, intitulée « le one-shot du siècle ». Je suis le one-shot.", en: "I took a monumental slap before I'd even raised a fist. Bloody nose, video at 4,000 views titled ‘one-shot of the century’. I'm the one-shot." }, fx: { health: -6, happy: -8 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Le clash verbal', en: 'Roast {a.him}' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai sorti une punchline sur sa coupe de cheveux, sa mère et sa note en techno, dans cet ordre. Le cercle a hurlé « OHHHH ». {a.first} est parti{a:|e} sans un mot. Clash du siècle.", en: "I dropped a roast about {a:his|her} haircut, {a:his|her} mom and {a:his|her} shop class grade, in that order. The circle screamed ‘OHHHH’. {a.first} left without a word. Roast of the century." }, fx: { happy: 9, fame: 2, actorRole: 'enemy', keep: true }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai voulu clasher, j'ai bégayé « ta… ta gueule, toi-même ». Personne n'a ri. Même pas moi.", en: "I tried to roast {a.him} and stammered ‘sh-shut up, you are’. Nobody laughed. Not even me." }, fx: { happy: -6 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Partir', en: 'Walk away' },
        text: { fr: "Je suis parti{|e} la tête haute, sans mon déjeuner. On m'a traité{|e} de lâche. Le soir, c'est {a.first} qui était convoqué{a:|e} chez le principal grâce aux vidéos.", en: "I walked away head high, without my lunch. They called me a coward. That evening, {a.first} got called to the principal's office thanks to the videos." },
        fx: { karma: 3, happy: -2 },
        mood: 'neutral',
      },
    ],
  },

  // ───────── home, parents, siblings ─────────
  {
    id: 't2_house_party_busted',
    icon: '🚨',
    cat: 'party',
    rating: 1,
    scene: { place: 'home', mood: 'party' },
    when: { age: [15, 17], has: 'parent', movedOut: false },
    actor: 'parent',
    once: true,
    text: {
      fr: [
        "Tes parents sont partis pour le week-end. Tu as invité « quelques amis ». Il y a 63 personnes, une enceinte qui fait trembler les vitres, et quelqu'un a ramené une chèvre. Des phares apparaissent dans l'allée : ils rentrent un jour plus tôt.",
        "Soirée chez toi, parents absents. À 1 h du matin, SMS de {a.rel} : « On a annulé l'hôtel, on arrive dans 10 min 😊 ». Le canapé est dans la piscine, il y a des chips dans l'aquarium et une chèvre dans la cuisine.",
      ],
      en: [
        "Your parents left for the weekend. You invited ‘a few friends’. There are 63 people, a speaker rattling the windows, and somebody brought a goat. Headlights appear in the driveway: they're back a day early.",
        "House party, parents away. At 1 a.m., a text from {a.rel}: ‘Hotel got canceled, home in 10 min 😊’. The couch is in the pool, there are chips in the fish tank and a goat in the kitchen.",
      ],
    },
    choices: [
      {
        label: { fr: 'Évacuation express', en: 'Emergency evacuation' },
        out: [
          { w: 1, odds: { athletic: 0.8, smarts: 0.5 }, text: { fr: "J'ai crié « LES DARONS ! » et 63 personnes se sont évaporées par le jardin en 90 secondes. {a.my} n'a rien remarqué, à part une chèvre dans la cuisine. Je n'ai rien su expliquer.", en: "I yelled ‘PARENTS!’ and 63 people evaporated through the backyard in 90 seconds. {a.my} noticed nothing, except a goat in the kitchen. I had no explanation." }, fx: { happy: 10, stress: 6, rel: -3 }, mood: 'party' },
          { w: 1, text: { fr: "L'évacuation a échoué : {a.my} est entré{a:|e} pendant que trois mecs descendaient le canapé du toit. Privé{|e} de sortie jusqu'à mes 30 ans. Téléphone confisqué, porte de chambre démontée.", en: "The evacuation failed: {a.my} walked in while three guys were lowering the couch off the roof. Grounded until I'm 30. Phone confiscated, bedroom door removed from its hinges." }, fx: { happy: -12, rel: -20, discipline: -3 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Tout avouer', en: 'Confess' },
        text: { fr: "J'ai coupé la musique et tout avoué au micro du karaoké. {a.my} a hurlé un « PUTAIN DE MERDE » qu'ont entendu les voisins. Puis on a tous nettoyé jusqu'à 6 h, {a.my} compris{a:|e}. Bizarrement, c'était presque sympa.", en: "I killed the music and confessed into the karaoke mic. {a.my} screamed a ‘HOLY SHIT’ the whole street heard. Then we all cleaned until 6 a.m., {a.my} included. Weirdly, it was almost fun." },
        fx: { rel: -8, happy: -4, karma: 3, discipline: 2 },
        mood: 'sad',
      },
      {
        label: { fr: 'Se cacher dans le placard', en: 'Hide in the closet' },
        text: { fr: "Je me suis caché{|e} dans le placard en espérant que la fête se débrouillerait sans moi. {a.my} m'a trouvé{|e} au bout de quatre heures, entre les manteaux, avec la chèvre.", en: "I hid in the closet hoping the party would handle itself. {a.my} found me four hours later, between the coats, with the goat." },
        fx: { happy: -6, rel: -12, stress: 8 },
        mood: 'shock',
      },
    ],
  },
  {
    id: 't2_first_beer',
    icon: '🍺',
    cat: 'party',
    rating: 1,
    scene: { place: 'party', mood: 'party' },
    when: { age: [16, 17] },
    once: true,
    text: {
      fr: [
        "Au mariage de ton cousin, ton oncle Patrick, déjà très rouge, te glisse une bière : « Allez, t'es {un homme|une grande} maintenant ! » Ta mère regarde ailleurs, très exprès.",
      ],
      en: [
        "At your cousin's wedding, Uncle Patrick, already very red, slips you a beer: ‘Come on, you're {a man|a big girl} now!’ Your mom looks the other way, very deliberately.",
      ],
    },
    choices: [
      {
        label: { fr: 'Goûter', en: 'Take a sip' },
        out: [
          { w: 2, text: { fr: "Première bière : ça a le goût du pain mouillé. J'ai fait semblant d'adorer et dit « elle est bien fraîche », avec l'air de quelqu'un qui s'y connaît. Elle n'était pas fraîche.", en: "First beer: it tastes like wet bread. I pretended to love it and said ‘nice and crisp’ like a connoisseur. It was not crisp." }, fx: { happy: 3, addiction: ['alcohol', 2] }, mood: 'happy' },
          { w: 1, text: { fr: "J'en ai bu trois. J'ai dansé sur une table, déclaré mon amour à la pièce montée et vomi dans le sac à main de ma grand-mère. Elle a dit que ça arrivait à tout le monde. Mon oncle était fier.", en: "I had three. I danced on a table, declared my love to the wedding cake and threw up in Grandma's purse. She said it happens to everyone. My uncle was proud." }, fx: { happy: 4, health: -5, addiction: ['alcohol', 4] }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Faire semblant', en: 'Fake it' },
        text: { fr: "J'ai tenu la même bière toute la soirée sans la boire, pour avoir l'air cool. À minuit, elle avait la température d'un bain. Personne n'a rien vu. Opération réussie.", en: "I held the same beer all night without drinking it, just to look cool. By midnight it was bath temperature. Nobody noticed. Mission accomplished." },
        fx: { happy: 2, smarts: 1 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Refuser poliment', en: 'Politely decline' },
        text: { fr: "J'ai refusé et pris un jus de pomme. On m'a appelé{|e} « le sobre » toute la soirée. À 2 h, j'étais le seul à pouvoir indiquer à tout le monde où étaient les toilettes.", en: "I said no and had apple juice. They called me ‘the sober one’ all night. At 2 a.m., I was the only person who knew where the bathroom was." },
        fx: { health: 1, discipline: 2, karma: 1 },
        mood: 'proud',
      },
    ],
  },
  {
    id: 't2_joyride',
    icon: '🚗',
    cat: 'social',
    rating: 1,
    scene: { place: 'home', mood: 'shock' },
    when: { age: [15, 17], has: 'parent', movedOut: false },
    actor: 'parent',
    once: true,
    text: {
      fr: [
        "{a.rel} dort. Les clés de sa voiture sont sur la table de l'entrée. Tu as eu exactement deux leçons de conduite, dont une sur un parking vide avec un plot.",
        "Il est minuit. Tes potes t'envoient « viens on va au drive ». Le seul véhicule disponible appartient à {a.rel}, qui ronfle à l'étage. Les clés brillent comme dans un film.",
      ],
      en: [
        "{a.rel} is asleep. The car keys are on the table by the door. You've had exactly two driving lessons, one of them in an empty parking lot with a single cone.",
        "It's midnight. Your friends text: ‘come on let's hit the drive-thru’. The only available vehicle belongs to {a.rel}, snoring upstairs. The keys gleam like in a movie.",
      ],
    },
    choices: [
      {
        label: { fr: 'Prendre la voiture', en: 'Take the car' },
        out: [
          { w: 2, text: { fr: "J'ai roulé à 30 km/h jusqu'au drive, en serrant le volant comme une bouée. Nuggets dégustés, voiture garée au centimètre près. {a.my} ne saura jamais. Je suis un fantôme.", en: "I drove to the drive-thru at 20 mph, clutching the wheel like a life buoy. Nuggets enjoyed, car parked to the inch. {a.my} will never know. I am a ghost." }, fx: { happy: 10, stress: 5 }, mood: 'party' },
          { w: 1, text: { fr: "J'ai confondu marche avant et marche arrière. La boîte aux lettres du voisin n'existe plus. {a.my} est descendu{a:|e} en pyjama et a dit « putain » onze fois. J'ai compté.", en: "I mixed up drive and reverse. The neighbor's mailbox no longer exists. {a.my} came down in pajamas and said ‘fuck’ eleven times. I counted." }, fx: { happy: -8, rel: -20, stress: 8 }, mood: 'cry' },
          { w: 1, text: { fr: "Contrôle de police au rond-point. Le policier a regardé mon visage d'enfant, puis mes nuggets, puis mon visage. Il a appelé {a.my}. Le trajet retour a été le plus long de ma vie.", en: "Police checkpoint at the roundabout. The cop looked at my baby face, then my nuggets, then my face again. He called {a.my}. The ride home was the longest of my life." }, fx: { happy: -10, rel: -15, heat: 5, discipline: -3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Commander un Uber', en: 'Call a ride' },
        text: { fr: "J'ai pris un VTC avec l'argent de mon anniversaire. Le chauffeur a écouté du jazz expérimental tout le trajet. 34 € pour des nuggets. La prudence a un prix.", en: "I took a rideshare with my birthday money. The driver played experimental jazz the whole way. $34 for nuggets. Caution has a price." },
        fx: { money: -35, happy: 3 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Retourner au lit', en: 'Go back to bed' },
        text: { fr: "Je suis retourné{|e} me coucher. Le lendemain, mes potes racontaient la soirée du siècle. Ils ont été arrêtés pour tapage. J'ai bien fait.", en: "I went back to bed. The next day my friends were bragging about the night of the century. They got busted for noise. Good call." },
        fx: { discipline: 3, karma: 1 },
        mood: 'sleepy',
      },
    ],
  },
  {
    id: 't2_sibling_war',
    icon: '⚔️',
    cat: 'social',
    rating: 1,
    scene: { place: 'home', mood: 'angry' },
    when: { age: [13, 17], has: 'sibling' },
    actor: 'sibling',
    cooldown: 4,
    text: {
      fr: [
        "{a.first} a changé le mot de passe du Wi-Fi et refuse de te le donner. D'après {a:lui|elle}, le nouveau mot de passe est « tu-peux-crever-123 ». C'est la guerre.",
      ],
      en: [
        "{a.first} changed the Wi-Fi password and won't tell you. According to {a.him}, the new password is ‘drop-dead-123’. This is war.",
      ],
    },
    choices: [
      {
        label: { fr: 'Vengeance froide', en: 'Cold revenge' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai remplacé le shampoing de {a.first} par de la mayonnaise. Le lendemain, au lycée, {a:il|elle} sentait la frite et brillait comme un phare. Dette réglée.", en: "I swapped {a.first}'s shampoo for mayonnaise. Next day at school, {a.he} smelled like fries and shone like a lighthouse. Debt paid." }, fx: { happy: 9, rel: -10 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai voulu cacher un œuf pourri dans la chambre de {a.first}. Je l'ai oublié dans ma propre poche. J'ai découvert l'erreur en m'asseyant.", en: "I planned to hide a rotten egg in {a.first}'s room. I forgot it in my own pocket. I discovered my mistake when I sat down." }, fx: { happy: -5, rel: 3 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Prise de catch', en: 'Wrestling move' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "Clé de bras, prise du crabe, abandon en 20 secondes. {a.first} a craché le mot de passe en hurlant « t'es qu'un connard{|e} ! ». Ma mère a mis un carton rouge à tout le monde.", en: "Armlock, Boston crab, tap-out in 20 seconds. {a.first} spat out the password, screaming ‘you're such an asshole!’. Mom red-carded everyone." }, fx: { happy: 6, rel: -8, athletic: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "{a.first} m'a mis{|e} au tapis avec une technique apprise sur YouTube. Je suis resté{|e} coincé{|e} sous {a:lui|elle} pendant qu'{a:il|elle} changeait le mot de passe en « tu-pues-du-cul ». Encore.", en: "{a.first} pinned me with a move learned on YouTube. I lay trapped underneath while {a.he} changed the password to ‘you-smell-like-butt’. Again." }, fx: { happy: -8, health: -2, rel: -5 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Négocier un traité', en: 'Negotiate a treaty' },
        text: { fr: "On a signé un traité de paix sur une serviette en papier : Wi-Fi partagé, journal intouchable, salle de bain en alternance. Il a tenu quatre jours. Un record diplomatique.", en: "We signed a peace treaty on a napkin: shared Wi-Fi, diary off-limits, alternating bathroom slots. It lasted four days. A diplomatic record." },
        fx: { rel: 10, happy: 3, smarts: 1 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 't2_sneak_out',
    icon: '🌙',
    cat: 'party',
    rating: 1,
    scene: { place: 'home', mood: 'party' },
    when: { age: [15, 17], has: 'sibling', movedOut: false },
    actor: 'sibling',
    once: true,
    text: {
      fr: [
        "Minuit. Tout le monde dort. Tes potes t'attendent au skatepark avec des chips et une enceinte. La fenêtre de ta chambre donne sur le toit du garage.",
        "Ton groupe prépare une sortie nocturne au lac, « juste pour voir les étoiles ». Tes parents ont dit non trois fois. Ta fenêtre, elle, n'a rien dit.",
      ],
      en: [
        "Midnight. Everyone's asleep. Your friends are waiting at the skatepark with chips and a speaker. Your bedroom window opens onto the garage roof.",
        "Your group is planning a midnight trip to the lake, ‘just to look at the stars’. Your parents said no three times. Your window said nothing.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire le mur', en: 'Sneak out' },
        out: [
          { w: 2, text: { fr: "J'ai fait le mur. Nuit légendaire : chips, étoiles, fous rires. En rentrant à 4 h par la fenêtre, {a.first} m'attendait assis{a:|e} sur mon lit, dans le noir, comme un méchant de film.", en: "I snuck out. Legendary night: chips, stars, giggling fits. Climbing back in at 4 a.m., I found {a.first} sitting on my bed in the dark, like a movie villain." }, fx: { happy: 10, chain: 't2_sneak_blackmail' }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai glissé sur le toit du garage et atterri dans le rosier. Toute la maison s'est réveillée. J'ai dit que je somnambulais. Personne n'y a cru, surtout pas le rosier.", en: "I slipped off the garage roof and landed in the rosebush. The whole house woke up. I said I was sleepwalking. Nobody believed me, least of all the rosebush." }, fx: { health: -6, happy: -6, disease: 'sprain' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Rester au lit', en: 'Stay in bed' },
        text: { fr: "Je suis resté{|e} au lit à regarder les stories de mes potes en train de vivre. J'ai liké chaque story avec amertume.", en: "I stayed in bed watching my friends' stories of them living their lives. I liked every single one, bitterly." },
        fx: { happy: -3, discipline: 2 },
        mood: 'sad',
      },
    ],
  },
  {
    id: 't2_sneak_blackmail',
    icon: '🤐',
    cat: 'social',
    chainOnly: true,
    scene: { place: 'home', mood: 'angry' },
    when: { age: [13, 17] },
    actor: 'sibling',
    text: {
      fr: ["{a.first} t'a vu{|e} rentrer par la fenêtre. Ses conditions : ton dessert pendant un mois, toutes tes corvées de vaisselle, et tu dois l'appeler « Votre Altesse » devant les invités."],
      en: ["{a.first} saw you climb back in. {a:His|Her} terms: your dessert for a month, all your dish duty, and you must call {a.him} ‘Your Highness’ in front of guests."],
    },
    choices: [
      {
        label: { fr: 'Accepter les termes', en: 'Accept the terms' },
        text: { fr: "Pendant un mois, j'ai fait la vaisselle et dit « Votre Altesse » à {a.first} devant mamie. Mamie a trouvé ça charmant. Moi, j'ai appris l'humilité, et à détester les lasagnes au four.", en: "For a month I did the dishes and called {a.first} ‘Your Highness’ in front of Grandma. Grandma found it charming. I learned humility, and to hate baked lasagna." },
        fx: { happy: -5, discipline: 3, rel: 5 },
        mood: 'sad',
      },
      {
        label: { fr: 'Contre-chantage', en: 'Counter-blackmail' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai sorti mon atout : je sais qui a cassé le vase de mamie en 2019. {a.first} est devenu{a:|e} blême. Accord de non-agression signé. Équilibre de la terreur.", en: "I played my trump card: I know who broke Grandma's vase in 2019. {a.first} went pale. Non-aggression pact signed. Mutually assured destruction." }, fx: { happy: 6, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "Mon contre-chantage était faible. {a.first} a souri et a tout raconté à nos parents au petit-déjeuner, entre deux tartines. Privé{|e} de sortie un mois.", en: "My counter-blackmail was weak. {a.first} smiled and told our parents everything at breakfast, between two slices of toast. Grounded for a month." }, fx: { happy: -8, rel: -10 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Tout avouer', en: 'Confess to parents' },
        text: { fr: "Je suis allé{|e} tout avouer moi-même. Privé{|e} de sortie deux semaines, mais {a.first} a perdu son moyen de pression. Il y a une noblesse dans la défaite.", en: "I confessed to my parents myself. Grounded for two weeks, but {a.first} lost all leverage. There's nobility in defeat." },
        fx: { happy: -3, karma: 3, discipline: 2 },
        mood: 'neutral',
      },
    ],
  },

  // ───────── puberty & looks ─────────
  {
    id: 't2_acne_remedies',
    icon: '🌋',
    cat: 'school',
    scene: { place: 'home', mood: 'sad' },
    when: { age: [13, 17] },
    cooldown: 5,
    text: {
      fr: [
        "Un bouton géant a poussé au milieu de ton front. Tu l'as baptisé Gérard. Ta tante jure par le dentifrice, Internet par le miel-cannelle, ta mère par le dermato.",
      ],
      en: [
        "A giant pimple sprouted in the middle of your forehead. You named it Gerald. Your aunt swears by toothpaste, the internet by honey-cinnamon, your mom by the dermatologist.",
      ],
    },
    choices: [
      {
        label: { fr: 'Dentifrice', en: 'Toothpaste' },
        out: [
          { w: 1, text: { fr: "J'ai mis du dentifrice toute la nuit. Gérard a survécu, mais il sent la menthe fraîche. J'ai aussi une plaque rouge en forme d'Italie.", en: "Toothpaste all night. Gerald survived, but now smells minty fresh. I also have a red patch shaped like Italy." }, fx: { looks: -2, happy: -2 }, mood: 'sad' },
          { w: 1, text: { fr: "Le dentifrice a marché ! Gérard a dégonflé. J'ai écrit un fil de 14 tweets pour remercier ma tante. Elle n'a pas Twitter.", en: "The toothpaste worked! Gerald deflated. I wrote a 14-tweet thread thanking my aunt. She doesn't have Twitter." }, fx: { looks: 2, happy: 4 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Le percer', en: 'Pop it' },
        out: [
          { w: 1, text: { fr: "J'ai percé Gérard. Il a éclaté sur le miroir avec une force insoupçonnée. Le lendemain, il est revenu avec deux potes.", en: "I popped Gerald. He hit the mirror with shocking force. The next day, he came back with two friends." }, fx: { looks: -4, happy: -3, disease: 'acne' }, mood: 'shock' },
          { w: 1, text: { fr: "Opération réussie, au prix d'une croûte digne d'un film de pirates. J'ai dit à tout le monde que c'était une cicatrice de bagarre.", en: "Operation successful, at the cost of a scab worthy of a pirate movie. I told everyone it was a fight scar." }, fx: { looks: -1, happy: 1 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Aller chez le dermato', en: 'See a dermatologist' },
        text: { fr: "Le dermato m'a prescrit une crème et m'a dit que tous les ados passent par là, même lui. Il avait encore des boutons à 52 ans. Ça ne m'a pas rassuré{|e}, mais la crème marche.", en: "The dermatologist prescribed a cream and said every teen goes through this, even him. He still had pimples at 52. Not reassuring, but the cream works." },
        fx: { looks: 4, happy: 3, cure: 'acne' },
        mood: 'happy',
      },
    ],
  },
  {
    id: 't2_bleach_hair',
    icon: '👩‍🎤',
    cat: 'social',
    rating: 1,
    scene: { place: 'home', mood: 'shock' },
    when: { age: [13, 17] },
    once: true,
    text: {
      fr: [
        "Tu décides de te décolorer les cheveux toi-même dans la salle de bain avec un kit à 7 €. Le tuto dure 3 minutes. La notice est en finnois.",
      ],
      en: [
        "You decide to bleach your own hair in the bathroom with a $7 kit. The tutorial is three minutes long. The instructions are in Finnish.",
      ],
    },
    choices: [
      {
        label: { fr: 'Suivre le tuto', en: 'Follow the tutorial' },
        out: [
          { w: 1, text: { fr: "Résultat : orange carotte fluo. On me voit depuis l'espace. Mon père m'a demandé si je travaillais sur les autoroutes maintenant.", en: "Result: neon carrot orange. Visible from space. My dad asked if I'd started working road construction." }, fx: { looks: -5, happy: -5 }, mood: 'cry' },
          { w: 1, text: { fr: "Contre toute attente, c'est magnifique. Tout le collège me demande où je suis allé{|e}. Je réponds « Helsinki » avec mystère.", en: "Against all odds, it looks amazing. The whole school asks where I got it done. I mysteriously reply ‘Helsinki’." }, fx: { looks: 6, happy: 8, fame: 1 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Doubler la dose', en: 'Double the dose' },
        text: { fr: "J'ai doublé la dose « pour aller plus vite ». Une mèche est restée dans ma main comme une perruque de poupée. J'ai crié « bordel de merde » si fort que le voisin a appelé pour vérifier que ça allait.", en: "I doubled the dose ‘to speed it up’. A whole lock came off in my hand like a doll's wig. I screamed ‘holy fucking shit’ so loud the neighbor called to check on us." },
        fx: { looks: -8, happy: -8 },
        mood: 'cry',
      },
      {
        label: { fr: 'Aller chez un pro', en: 'Go to a salon' },
        text: { fr: "J'ai économisé et je suis allé{|e} chez un coiffeur. Résultat parfait, compte en banque vide. La coiffeuse m'a raconté son divorce pendant deux heures. C'était inclus.", en: "I saved up and went to a salon. Perfect result, empty wallet. The stylist told me about her divorce for two hours. That was included." },
        fx: { looks: 5, happy: 5, money: -60 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 't2_first_shave',
    icon: '🪒',
    cat: 'social',
    scene: { place: 'home', mood: 'neutral' },
    when: { age: [13, 16], has: 'parent' },
    actor: 'parent',
    once: true,
    text: {
      fr: [
        "Tu as décidé de te raser pour la première fois{ : trois poils de moustache, il est temps| : les jambes, comme les grandes}. Tu as « emprunté » le rasoir de {a.rel}.",
        "Premier rasage en vue. Tu t'enfermes dans la salle de bain avec le rasoir de {a.rel}, une bombe de mousse et la confiance aveugle de ceux qui ont regardé un tuto.",
      ],
      en: [
        "You've decided to shave for the first time{: three mustache hairs, it's time|: your legs, like the grown-ups}. You ‘borrowed’ {a.rel}'s razor.",
        "First shave incoming. You lock yourself in the bathroom with {a.rel}'s razor, a can of foam and the blind confidence of someone who watched a tutorial.",
      ],
    },
    choices: [
      {
        label: { fr: 'Y aller franco', en: 'Go for it' },
        out: [
          { w: 1, text: { fr: "Sept coupures, trois pansements, un bout de papier toilette collé sur chaque blessure. On aurait dit une momie qui a perdu une bagarre. Mais c'est lisse.", en: "Seven nicks, three band-aids, a scrap of toilet paper stuck on each wound. I looked like a mummy who lost a fight. But smooth." }, fx: { looks: -2, happy: 2, health: -1 }, mood: 'neutral' },
          { w: 1, text: { fr: "Rasage parfait du premier coup. J'ai regardé mon reflet comme un acteur de pub pour parfum. {a.my} a remarqué que son rasoir était émoussé. Je n'ai rien dit.", en: "Perfect shave on the first try. I stared at my reflection like a cologne ad. {a.my} noticed the razor was dull. I said nothing." }, fx: { looks: 3, happy: 5 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Demander conseil', en: 'Ask for help' },
        text: { fr: "J'ai demandé conseil à {a.my}. {a:Il|Elle} a été tellement ému{a:|e} qu'{a:il|elle} a pris 40 photos et appelé mamie en visio. Le rasage a duré dix secondes. La cérémonie, une heure.", en: "I asked {a.my} for help. {a:He|She} was so moved {a.he} took 40 photos and video-called Grandma. The shave took ten seconds. The ceremony, an hour." },
        fx: { rel: 10, happy: 2, looks: 2 },
        mood: 'happy',
      },
      {
        label: { fr: 'Attendre encore', en: 'Wait another year' },
        text: { fr: "J'ai reposé le rasoir. Rien ne presse. Mes trois poils et moi avons encore de belles années devant nous.", en: "I put the razor down. No rush. My three hairs and I still have good years ahead." },
        fx: { stress: -2 },
        mood: 'neutral',
      },
    ],
  },

  // ───────── money & first jobs ─────────
  {
    id: 't2_summer_mascot',
    icon: '🐿️',
    cat: 'social',
    scene: { place: 'park', mood: 'neutral' },
    when: { age: [15, 17], job: false },
    vars: { amount: [600, 1200] },
    once: true,
    text: {
      fr: [
        "Job d'été : le parc d'attractions cherche quelqu'un pour jouer la mascotte, un écureuil géant en mousse, par 36 °C. Salaire : {$amount} pour l'été. Le costume n'a jamais été lavé.",
      ],
      en: [
        "Summer job: the amusement park needs someone to play the mascot, a giant foam squirrel, in 97°F heat. Pay: {$amount} for the summer. The costume has never been washed.",
      ],
    },
    choices: [
      {
        label: { fr: 'Enfiler le costume', en: 'Suit up' },
        out: [
          { w: 2, text: { fr: "Deux mois dans le costume. J'ai perdu trois litres de sueur par jour, fait 4 000 câlins et gagné {$amount}. Je rêve encore en mousse.", en: "Two months in the costume. I lost a gallon of sweat a day, gave 4,000 hugs and earned {$amount}. I still dream in foam." }, fx: { money: 'amount', discipline: 4, happy: 2, health: -2 }, mood: 'proud' },
          { w: 1, text: { fr: "Un enfant de 6 ans m'a mis un coup de pied dans le tibia en criant « T'ES PAS UN VRAI ! ». Puis j'ai fait un malaise de chaleur devant 30 familles. J'ai quand même touché {$amount}.", en: "A six-year-old kicked me in the shin, screaming ‘YOU'RE NOT REAL!’. Then I passed out from heatstroke in front of 30 families. Still got paid {$amount}." }, fx: { money: 'amount', health: -5, happy: -3 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Négocier un ventilo', en: 'Demand a fan' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai exigé un ventilateur intégré. Ils ont scotché un ventilo USB dans la tête du costume. J'ai bossé tout l'été comme un roi et gagné {$amount}.", en: "I demanded built-in cooling. They duct-taped a USB fan inside the costume head. I worked all summer like a king and earned {$amount}." }, fx: { money: 'amount', smarts: 2, happy: 4 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai voulu négocier. Ils ont embauché mon cousin à ma place. Il a gagné l'argent et une copine qui adore les écureuils.", en: "I tried to negotiate. They hired my cousin instead. He got the money and a girlfriend who loves squirrels." }, fx: { happy: -4 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Refuser', en: 'Pass' },
        text: { fr: "J'ai refusé. J'ai passé l'été sur le canapé, aussi fauché{|e} qu'au départ mais parfaitement au sec.", en: "I passed. I spent the summer on the couch, just as broke as before but perfectly dry." },
        fx: { happy: 2, discipline: -2 },
        mood: 'sleepy',
      },
    ],
  },
  {
    id: 't2_babysit_demons',
    icon: '👹',
    cat: 'social',
    rating: 1,
    scene: { place: 'home', mood: 'shock' },
    when: { age: [13, 17] },
    vars: { amount: [30, 80] },
    cooldown: 4,
    text: {
      fr: [
        "Les voisins te paient {$amount} pour garder leurs jumeaux de six ans, Léo et Lou. Les parents partent en courant. Littéralement en courant.",
      ],
      en: [
        "The neighbors pay you {$amount} to watch their six-year-old twins, Leo and Lou. The parents leave at a run. Literally running.",
      ],
    },
    choices: [
      {
        label: { fr: 'Autorité totale', en: 'Total authority' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: "J'ai instauré un régime militaire : appel, rangement, extinction des feux à 20 h. Les parents ont retrouvé leurs enfants endormis et la maison rangée. Ils m'ont donné un pourboire et un regard de terreur respectueuse.", en: "I ran it like boot camp: roll call, cleanup, lights out at 8 p.m. The parents came home to sleeping kids and a tidy house. They tipped me, with a look of respectful terror." }, fx: { money: 'amount', discipline: 3, happy: 4 }, mood: 'proud' },
          { w: 1, text: { fr: "Ils m'ont enfermé{|e} dans le cellier et ont mangé tout le Nutella. Quand les parents sont rentrés, un des gamins m'a traité{|e} de « grosse merde » avec un vocabulaire étonnant pour son âge. On m'a payé{|e} quand même, par pitié.", en: "They locked me in the pantry and ate all the Nutella. When the parents got home, one of them called me a ‘big turd’ with a vocabulary astonishing for his age. They paid me anyway, out of pity." }, fx: { money: 'amount', happy: -6, stress: 6 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Corrompre aux bonbons', en: 'Bribe with candy' },
        text: { fr: "J'ai acheté la paix avec deux kilos de bonbons. Paix totale pendant 40 minutes, puis le sucre a frappé. À 22 h, ils couraient au plafond. J'ai gagné {$amount}, perdu dix ans d'espérance de vie.", en: "I bought peace with four pounds of candy. Total calm for 40 minutes, then the sugar kicked in. By 10 p.m., they were running on the ceiling. Earned {$amount}, lost ten years of life expectancy." },
        fx: { money: 'amount', stress: 8, happy: -2 },
        mood: 'shock',
      },
      {
        label: { fr: 'Tablette illimitée', en: 'Unlimited tablet' },
        text: { fr: "Tablette illimitée. Silence absolu pendant cinq heures. Les parents ont trouvé leurs enfants hypnotisés devant un type qui ouvre des œufs surprise. Ils ne m'ont plus jamais rappelé{|e}, mais j'ai eu {$amount}.", en: "Unlimited tablet. Five hours of absolute silence. The parents found their kids hypnotized by a guy opening surprise eggs. They never called me again, but I got {$amount}." },
        fx: { money: 'amount', happy: 2 },
        mood: 'neutral',
      },
    ],
  },

  // ═════════════════════════════ UNIVERSITY & YOUNG ADULTS 18–25 ═════════════════════════════
  // ───────── feed lines ─────────
  {
    id: 't2_auto_ramen',
    icon: '🍜',
    cat: 'uni',
    auto: true,
    cooldown: 3,
    when: { age: [18, 25], school: 'uni' },
    text: {
      fr: [
        "Quatrième semaine consécutive aux nouilles instantanées. Mon sang est désormais composé à 40 % de sel et à 60 % d'arôme « poulet ».",
        "Fin du mois. J'ai fait un dîner avec ce qui restait : un oignon, du ketchup et une tranche de fromage trouvée dans la poche d'une veste. J'ai appelé ça « une fusion ».",
      ],
      en: [
        "Fourth straight week of instant noodles. My blood is now 40% sodium and 60% ‘chicken flavor’.",
        "End of the month. I made dinner from what was left: an onion, ketchup and a slice of cheese I found in a jacket pocket. I called it ‘fusion’.",
      ],
    },
    fx: { health: -2, happy: -1, weight: 0.02 },
  },
  {
    id: 't2_auto_drunk_exam',
    icon: '📝',
    cat: 'uni',
    rating: 1,
    auto: true,
    once: true,
    when: { age: [18, 25], school: 'uni' },
    text: {
      fr: [
        "J'ai passé un partiel à 8 h encore bourré{|e} de la veille. J'ai répondu à la question 3 par un cœur et à la question 4 par « bisous au correcteur ». J'ai eu 9. Le correcteur a répondu « bisous ».",
        "Je suis arrivé{|e} au partiel avec une gueule de bois qui avait sa propre gueule de bois. J'ai dormi sur ma copie. Il reste une trace de bave en forme de Bretagne.",
      ],
      en: [
        "I took an 8 a.m. exam still drunk from the night before. I answered question 3 with a heart and question 4 with ‘kisses to the grader’. I got a C-. The grader wrote back ‘kisses’.",
        "I showed up to my exam with a hangover that had its own hangover. I fell asleep on my paper. There's a drool stain shaped like Florida.",
      ],
    },
    fx: { grade: -4, health: -2, happy: 1 },
  },
  {
    id: 't2_auto_erasmus_swears',
    icon: '🇪🇺',
    cat: 'uni',
    rating: 1,
    auto: true,
    once: true,
    when: { age: [19, 25], school: 'uni', chance: 0.4 },
    text: {
      fr: [
        "Bilan de mon semestre Erasmus : je ne parle toujours pas la langue, mais je sais dire « nique ta mère » en onze langues et commander une bière en quatorze.",
        "En Erasmus, j'ai partagé un appart avec un Italien, une Finlandaise et un Polonais. On communiquait en anglais approximatif, en gestes et en insultes. C'était l'Europe dont rêvaient les pères fondateurs.",
      ],
      en: [
        "My exchange semester, summed up: I still can't speak the language, but I can say ‘go fuck yourself’ in eleven languages and order a beer in fourteen.",
        "On exchange, I shared a flat with an Italian, a Finn and a Pole. We communicated in broken English, hand gestures and swearing. It was the Europe the founding fathers dreamed of.",
      ],
    },
    fx: { happy: 6, smarts: 1 },
  },

  // ───────── exams & studies ─────────
  {
    id: 't2_wrong_exam',
    icon: '📚',
    cat: 'uni',
    scene: { place: 'uni', mood: 'shock' },
    when: { age: [18, 25], school: 'uni' },
    cooldown: 4,
    text: {
      fr: [
        "Tu ouvres le sujet d'examen. Tu as révisé la mauvaise matière. Trois semaines sur le droit romain, et devant toi : « Statistiques appliquées ». Tu as 4 heures.",
      ],
      en: [
        "You open the exam. You studied the wrong subject. Three weeks on Roman law, and in front of you: ‘Applied Statistics’. You have four hours.",
      ],
    },
    choices: [
      {
        label: { fr: 'Improviser', en: 'Improvise' },
        out: [
          { w: 1, odds: { smarts: 1.2 }, text: { fr: "J'ai répondu à toutes les questions de stats avec des arguments de droit romain. Le prof a trouvé ça « audacieux » et m'a mis la moyenne. La chance sourit aux culottés.", en: "I answered every statistics question with Roman law arguments. The professor called it ‘bold’ and gave me a pass. Fortune favors the shameless." }, fx: { grade: 3, smarts: 2, happy: 5 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai rempli quatre pages de n'importe quoi, dont un dessin de la courbe de Gauss en forme de chat. 2/20. Le prof a noté : « Joli chat ».", en: "I filled four pages with nonsense, including a bell curve drawn as a cat. Two out of twenty. The professor wrote: ‘Nice cat’." }, fx: { grade: -8, happy: -4 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Copier sur le voisin', en: 'Copy the neighbor' },
        out: [
          { w: 1, text: { fr: "J'ai copié sur mon voisin. Il avait aussi révisé la mauvaise matière. On a tous les deux eu 3, avec exactement les mêmes fautes. Convocation pour « similitudes troublantes ».", en: "I copied my neighbor. He had also studied the wrong subject. We both got a 3, with identical mistakes. Summoned for ‘troubling similarities’." }, fx: { grade: -6, karma: -2, stress: 6 }, mood: 'shock' },
          { w: 1, text: { fr: "Mon voisin était un génie qui pleurait de joie. J'ai tout copié. 15/20. Il a eu 19. Je lui dois une bière à vie.", en: "My neighbor was a genius crying tears of joy. I copied everything. 15 out of 20. He got 19. I owe him beer for life." }, fx: { grade: 6, karma: -3, happy: 4 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Rendre copie blanche', en: 'Hand in a blank' },
        text: { fr: "J'ai rendu copie blanche au bout de 10 minutes, avec la dignité d'un capitaine qui quitte son navire. Rattrapage en septembre. J'ai passé l'été à apprendre les statistiques. Enfin, à essayer.", en: "I handed in a blank paper after ten minutes, with the dignity of a captain leaving his ship. Retake in September. I spent the summer learning statistics. Well, trying." },
        fx: { grade: -5, stress: -3 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 't2_oral_exam',
    icon: '🎤',
    cat: 'uni',
    scene: { place: 'uni', mood: 'shock' },
    when: { age: [18, 25], school: 'uni' },
    cooldown: 4,
    text: {
      fr: [
        "Oral d'examen. Le professeur, un homme de 80 ans avec des sourcils autonomes, te pose LA question que tu n'as pas révisée. Il attend, le stylo levé.",
      ],
      en: [
        "Oral exam. The professor, an 80-year-old man with self-governing eyebrows, asks you THE one question you didn't study. He waits, pen raised.",
      ],
    },
    choices: [
      {
        label: { fr: 'Bluffer avec aplomb', en: 'Bluff confidently' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai bluffé pendant dix minutes avec des mots comme « paradigme » et « dialectique ». Le jury a hoché la tête. Je ne sais pas ce que j'ai dit. Eux non plus. 16/20.", en: "I bluffed for ten minutes using words like ‘paradigm’ and ‘dialectic’. The examiners nodded. I don't know what I said. Neither do they. A solid B+." }, fx: { grade: 6, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai bluffé. Le prof m'a laissé{|e} parler cinq minutes, puis a dit doucement : « C'est moi qui ai écrit le livre. » J'ai voulu mourir dans le parquet.", en: "I bluffed. The professor let me talk for five minutes, then said softly: ‘I wrote the book.’ I wanted to melt into the floorboards." }, fx: { grade: -6, happy: -5, stress: 5 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Avouer ne pas savoir', en: 'Admit I don’t know' },
        text: { fr: "J'ai avoué que je ne savais pas. Le prof a souri : « Enfin quelqu'un d'honnête. » Puis il m'a mis 8. L'honnêteté a ses limites.", en: "I admitted I didn't know. The professor smiled: ‘Finally, an honest one.’ Then he gave me a D. Honesty has its limits." },
        fx: { grade: -2, karma: 2 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Parler de ses sourcils', en: 'Compliment the eyebrows' },
        text: { fr: "J'ai complimenté ses sourcils pour gagner du temps. Il m'a raconté leur histoire pendant 20 minutes (sa femme les coupe le dimanche). L'oral était fini. 12/20.", en: "I complimented his eyebrows to buy time. He told me their story for 20 minutes (his wife trims them on Sundays). Time was up. B-." },
        fx: { grade: 2, happy: 4 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 't2_library_chips',
    icon: '🤫',
    cat: 'uni',
    scene: { place: 'uni', mood: 'angry' },
    when: { age: [18, 25], school: 'uni' },
    actor: { create: { role: 'acquaintance', age: [-2, 3], gender: 'any' } },
    cooldown: 5,
    text: {
      fr: [
        "Bibliothèque universitaire, salle silencieuse, veille d'examen. À la table d'en face, {a.first} mange des chips au vinaigre. Une par une. Avec la bouche ouverte. Depuis 40 minutes.",
      ],
      en: [
        "University library, silent room, night before the exam. At the next table, {a.first} is eating salt-and-vinegar chips. One by one. Mouth open. For 40 minutes.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le regard qui tue', en: 'The death stare' },
        out: [
          { w: 1, text: { fr: "Je l'ai fixé{a:|e} pendant trois minutes sans cligner des yeux. {a.first} a rangé ses affaires et changé d'étage. J'ai un super-pouvoir.", en: "I stared at {a.him} for three minutes without blinking. {a.first} packed up and moved floors. I have a superpower." }, fx: { happy: 4, smarts: 1 }, mood: 'proud' },
          { w: 1, text: { fr: "Je l'ai fixé{a:|e}. {a.first} m'a tendu le paquet avec un grand sourire. J'ai pris une chips. On a passé la soirée à discuter au lieu de réviser. On est potes maintenant, et je vais rater mon exam.", en: "I stared. {a.first} offered me the bag with a big smile. I took one. We spent the evening chatting instead of studying. We're friends now, and I'm going to fail." }, fx: { happy: 5, grade: -3, actorRole: 'friend', rel: 25 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Dénoncer au bibliothécaire', en: 'Tell the librarian' },
        text: { fr: "J'ai dénoncé l'intrus au bibliothécaire. Il est arrivé avec la lenteur d'un fantôme, a confisqué les chips et les a mangées devant nous. Justice faite, d'une certaine manière.", en: "I reported it to the librarian. He arrived with the slowness of a ghost, confiscated the chips and ate them in front of us. Justice, of a kind." },
        fx: { happy: 2, karma: -1 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Rendre coup pour coup', en: 'Fight noise with noise' },
        text: { fr: "J'ai sorti un paquet de biscottes et je les ai croquées encore plus fort. Une guerre sonore a éclaté. Toute la salle est partie. On a eu la bibliothèque pour nous deux, et zéro révision.", en: "I pulled out a pack of crispbread and crunched even louder. A sound war broke out. The whole room left. We had the library to ourselves, and studied zero." },
        fx: { happy: 3, grade: -2 },
        mood: 'angry',
      },
    ],
  },
  {
    id: 't2_startup_dropout',
    icon: '🧦',
    cat: 'uni',
    rating: 1,
    scene: { place: 'uni', mood: 'neutral' },
    when: { age: [18, 25], school: 'uni', has: 'anyFriend' },
    actor: 'anyFriend',
    once: true,
    text: {
      fr: [
        "{a.first} lâche la fac pour lancer sa start-up : des chaussettes connectées qui notent ton odeur de pieds sur une appli. {a:Il|Elle} veut que tu deviennes associé{|e}. « On va être les prochains Zuckerberg, putain. »",
      ],
      en: [
        "{a.first} is dropping out to launch a startup: smart socks that rate your foot odor in an app. {a:He|She} wants you as co-founder. ‘We're gonna be the next fucking Zuckerbergs.’",
      ],
    },
    choices: [
      {
        label: { fr: 'Lâcher la fac', en: 'Drop out too' },
        out: [
          { w: 1, text: { fr: "J'ai lâché la fac. Six mois plus tard, la start-up a fait faillite, il nous reste 3 000 chaussettes connectées dans un garage. Elles notent toutes mes pieds 2/10.", en: "I dropped out. Six months later the startup went bust, leaving 3,000 smart socks in a garage. They all rate my feet 2/10." }, fx: { dropout: true, happy: -8, money: -2000, rel: 5 }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai lâché la fac. Un fonds d'investissement a racheté l'idée pour une raison que personne ne comprend. J'ai touché un gros chèque et une ligne LinkedIn ridicule : « serial entrepreneur ».", en: "I dropped out. A venture fund bought the idea for reasons nobody understands. I got a fat check and a ridiculous LinkedIn line: ‘serial entrepreneur’." }, fx: { dropout: true, happy: 12, money: 40000, fame: 2 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Investir un peu', en: 'Invest a little' },
        text: { fr: "J'ai investi 200 € et gardé mes études. En échange, j'ai reçu une paire de chaussettes prototype qui vibre quand je transpire. Elle vibre tout le temps.", en: "I invested $200 and stayed in school. In return I got a prototype pair of socks that buzz when I sweat. They buzz constantly." },
        fx: { money: -200, rel: 8, happy: 1 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Refuser', en: 'Decline' },
        text: { fr: "J'ai refusé poliment. {a.first} m'a traité{|e} de « mouton du système ». Je suis resté{|e} un mouton diplômable.", en: "I politely declined. {a.first} called me a ‘sheep of the system’. I remained a sheep on track to graduate." },
        fx: { rel: -5, discipline: 2 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 't2_zoom_lecture',
    icon: '💻',
    cat: 'uni',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock' },
    when: { age: [18, 25], school: 'uni', era: [2020, 2100] },
    once: true,
    text: {
      fr: [
        "Cours en visio. Tu crois avoir coupé ta caméra. Tu ne l'as pas coupée. Cela fait 25 minutes que 140 étudiants te regardent manger des céréales dans un saladier, à poil, en te grattant les fesses.",
      ],
      en: [
        "Online lecture. You think your camera is off. It isn't. For 25 minutes, 140 students have been watching you eat cereal out of a salad bowl, naked, scratching your butt.",
      ],
    },
    choices: [
      {
        label: { fr: 'Quitter la réunion', en: 'Leave the meeting' },
        text: { fr: "J'ai quitté la visio et je ne suis jamais revenu{|e} en cours. Des captures d'écran circulent encore sur le groupe de promo, recadrées « par respect ». Pas assez recadrées.", en: "I left the call and never came back to class. Screenshots still circulate in the class group chat, cropped ‘out of respect’. Not cropped enough." },
        fx: { happy: -8, grade: -4, stress: 6 },
        mood: 'cry',
      },
      {
        label: { fr: 'Assumer à fond', en: 'Lean into it' },
        out: [
          { w: 1, text: { fr: "J'ai fait coucou à la caméra et dit « Bon appétit à tous ». Le chat de la visio a explosé. Je suis devenu{|e} une légende de la promo, et le prof m'a envoyé un mail intitulé « Merci de vous couvrir ».", en: "I waved at the camera and said ‘Bon appétit, everyone’. The chat exploded. I became a class legend, and the professor emailed me with the subject line ‘Please cover yourself’." }, fx: { happy: 6, fame: 2, followers: 400 }, mood: 'party' },
          { w: 1, text: { fr: "J'ai voulu assumer. Le prof m'a convoqué{|e} devant le conseil de discipline pour « exhibition pédagogique ». On m'a fait signer une charte de la visio en 14 articles.", en: "I tried to own it. The professor sent me to the disciplinary board for ‘pedagogical indecency’. I had to sign a 14-article video-call code of conduct." }, fx: { grade: -5, discipline: -3, happy: -3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Accuser un piratage', en: 'Claim I was hacked' },
        text: { fr: "J'ai envoyé un mail au prof : « Ma caméra a été piratée par des hackers russes. » Il a répondu : « Les hackers russes ont votre tatouage de dauphin ? »", en: "I emailed the professor: ‘My camera was hacked by Russian hackers.’ He replied: ‘Do the Russian hackers also have your dolphin tattoo?’" },
        fx: { karma: -2, happy: -4 },
        mood: 'sad',
      },
    ],
  },
  {
    id: 't2_internship_boss',
    icon: '☕',
    cat: 'uni',
    rating: 1,
    scene: { place: 'office', mood: 'angry' },
    when: { age: [19, 25], school: 'uni' },
    once: true,
    text: {
      fr: [
        "Stage non rémunéré dans une start-up « disruptive ». Ton boss, Maxime, 31 ans, trottinette électrique et sandales, te demande d'écrire son profil Tinder, puis de refaire sa présentation pour le comité, « vite fait, ce soir ». « C'est formateur. »",
      ],
      en: [
        "Unpaid internship at a ‘disruptive’ startup. Your boss, Max, 31, electric scooter and sandals, asks you to write his Tinder profile, then redo his board presentation ‘real quick, tonight’. ‘It's character building.’",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout faire, et bien', en: 'Do it all, well' },
        text: { fr: "J'ai tout fait sans broncher. Son profil Tinder a eu 80 matchs, sa présentation a été applaudie. Il a pris tout le crédit et m'a dit « Bien joué champion{|ne} ». Je note tout dans un carnet.", en: "I did everything without complaint. His Tinder got 80 matches, his presentation got applause. He took all the credit and said ‘Nice one, champ’. I'm writing everything down in a notebook." },
        fx: { stress: 6, discipline: 4, flag: 't2_intern_good', schedule: { key: 't2_intern_verdict', years: 1 } },
        mood: 'neutral',
      },
      {
        label: { fr: 'Saboter discrètement', en: 'Quietly sabotage' },
        text: { fr: "J'ai fait ce qu'on me demandait, mais à ma façon : sa bio Tinder dit maintenant « J'aime les trottinettes et ma maman ». Sa présentation contient une diapo de chat. Personne n'a encore remarqué.", en: "I did what he asked, my way: his Tinder bio now reads ‘I love scooters and my mommy’. His presentation contains a cat slide. Nobody's noticed yet." },
        fx: { happy: 6, karma: -2, schedule: { key: 't2_intern_verdict', years: 1 } },
        mood: 'happy',
      },
      {
        label: { fr: "L'envoyer chier", en: 'Tell him off' },
        text: { fr: "J'ai dit : « Je suis stagiaire, pas ta mère, Maxime. » Silence dans l'open space. J'ai été viré{|e} du stage en 4 minutes, sous les applaudissements discrets des autres stagiaires.", en: "I said: ‘I'm an intern, Max, not your mother.’ Silence in the open office. I was kicked out of the internship in four minutes, to quiet applause from the other interns." },
        fx: { happy: 8, karma: 2, grade: -4, fame: 1 },
        mood: 'proud',
      },
    ],
  },
  {
    id: 't2_intern_verdict',
    icon: '📨',
    cat: 'uni',
    rating: 1,
    chainOnly: true,
    scene: { place: 'office', mood: 'shock' },
    when: { age: [19, 30] },
    text: {
      fr: ["Un an après ton stage, un mail de Maxime, ton ancien boss en sandales : « Hello toi ! Grosse news, j'ai besoin de toi. » Ton petit carnet de notes est toujours dans ton tiroir."],
      en: ["A year after your internship, an email from Max, your former boss in sandals: ‘Hey you! Big news, I need you.’ Your little notebook is still in your drawer."],
    },
    choices: [
      {
        label: { fr: 'Lire la suite', en: 'Read on' },
        if: { flag: 't2_intern_good' },
        out: [
          { w: 2, text: { fr: "Maxime m'offre un vrai CDI, payé. Il a avoué au comité que c'est moi qui faisais tout. J'ai signé. Il m'a apporté un café. Le monde à l'envers.", en: "Max is offering me a real, paid job. He admitted to the board I did all the work. I signed. He brought ME a coffee. The world turned upside down." }, fx: { happy: 12, money: 3000, open: 'jobs', unflag: 't2_intern_good' }, mood: 'proud' },
          { w: 1, text: { fr: "Maxime lance une nouvelle start-up et me propose un deuxième stage non payé, « mais cette fois avec des stock-options ». J'ai répondu avec une photo de mon carnet. Page par page.", en: "Max is launching a new startup and offers me a second unpaid internship, ‘but with stock options this time’. I replied with photos of my notebook. Every page." }, fx: { happy: 4, karma: 1, unflag: 't2_intern_good' }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Ouvrir avec méfiance', en: 'Open it warily' },
        if: { noFlag: 't2_intern_good' },
        out: [
          { w: 1, text: { fr: "La start-up a coulé. Maxime a découvert la diapo de chat devant les investisseurs. Il me remercie : c'était le seul moment où ils ont souri. Il me demande un prêt de 500 €. Non.", en: "The startup sank. Max found the cat slide in front of investors. He thanks me: it was the only moment they smiled. He's asking me for a $500 loan. No." }, fx: { happy: 6 }, mood: 'happy' },
          { w: 1, text: { fr: "Maxime m'a retrouvé{|e} : sa bio Tinder lui a valu un an de célibat. Il menace de me poursuivre pour « préjudice romantique ». Son avocat est son cousin. Je ris encore.", en: "Max tracked me down: his Tinder bio cost him a year of singlehood. He's threatening to sue for ‘romantic damages’. His lawyer is his cousin. I'm still laughing." }, fx: { happy: 4, stress: 3 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Supprimer sans lire', en: 'Delete unread' },
        text: { fr: "J'ai supprimé le mail sans le lire. Certaines portes doivent rester fermées, surtout celles qui portent des sandales.", en: "I deleted it unread. Some doors should stay closed, especially the ones wearing sandals." },
        fx: { stress: -3 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 't2_thesis_crash',
    icon: '💀',
    cat: 'uni',
    rating: 1,
    scene: { place: 'apartment', mood: 'cry' },
    when: { age: [20, 25], school: 'uni' },
    once: true,
    text: {
      fr: [
        "Il est 23 h 02. Ton mémoire de 80 pages est à rendre à minuit. Ton ordinateur affiche un écran bleu, puis un bruit de mixeur, puis plus rien. Ta dernière sauvegarde date de février.",
        "Une heure avant la remise de ton mémoire, ton coloc renverse un smoothie mangue-épinards sur ton ordi. Le clavier fait des bulles. Le smoothie était à toi, en plus.",
      ],
      en: [
        "It's 11:02 p.m. Your 80-page thesis is due at midnight. Your laptop shows a blue screen, then makes a blender noise, then nothing. Your last backup is from February.",
        "One hour before your thesis is due, your roommate spills a mango-spinach smoothie on your laptop. The keyboard is bubbling. It was your smoothie, too.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout réécrire', en: 'Rewrite it all' },
        out: [
          { w: 1, odds: { smarts: 1, discipline: 0.5 }, text: { fr: "J'ai réécrit 30 pages de mémoire en 58 minutes, sur l'ordi du coloc, en hurlant « PUTAIN PUTAIN PUTAIN ». Envoyé à 23 h 59. Mention bien. Je ne sais pas qui a écrit ça. Un démon, sans doute.", en: "I rewrote 30 pages from memory in 58 minutes on my roommate's laptop, screaming ‘FUCK FUCK FUCK’. Sent at 11:59. Honors. I don't know who wrote it. A demon, probably." }, fx: { grade: 8, stress: 10, smarts: 3, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai réécrit ce que j'ai pu : 11 pages, dont 4 de bibliographie inventée. Le jury a cherché « Dupont, 1987, Éditions du Moulin ». Ça n'existe pas. Moi non plus, à partir de maintenant.", en: "I rewrote what I could: 11 pages, four of them an invented bibliography. The committee looked up ‘Smith, 1987, Windmill Press’. It doesn't exist. Neither do I, as of now." }, fx: { grade: -10, stress: 8 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Mail de supplication', en: 'Beg by email' },
        out: [
          { w: 1, text: { fr: "J'ai envoyé un mail désespéré avec une photo de l'ordi mort. Le directeur de mémoire m'a donné une semaine. Il a joint un lien vers un cours sur les sauvegardes.", en: "I sent a desperate email with a photo of the dead laptop. My advisor gave me a week. He attached a link to a course on backups." }, fx: { stress: -4, happy: 3 }, mood: 'happy' },
          { w: 1, text: { fr: "Le directeur de mémoire a répondu : « Les ordinateurs meurent toujours la veille, c'est fou. » Refus. Redoublement de semestre. J'ai organisé un enterrement pour l'ordi.", en: "My advisor replied: ‘Amazing how laptops always die the night before.’ Denied. Semester repeated. I held a funeral for the laptop." }, fx: { grade: -8, happy: -6 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Prier le cloud', en: 'Pray to the cloud' },
        out: [
          { w: 1, text: { fr: "J'ai fouillé le cloud en pleurant. Miracle : une version de la veille, sauvegardée automatiquement. J'ai embrassé l'écran. Je crois en Dieu, et il s'appelle Synchronisation.", en: "I searched the cloud, sobbing. Miracle: yesterday's version, auto-saved. I kissed the screen. I believe in God, and His name is Sync." }, fx: { happy: 10, stress: -6 }, mood: 'happy' },
          { w: 1, text: { fr: "Le cloud contenait 4 000 photos de mon chat et zéro mémoire. J'ai pris une décision : le chat sera mon mémoire.", en: "The cloud contained 4,000 photos of my cat and zero thesis. Decision made: the cat is now my thesis." }, fx: { grade: -6, happy: -4 }, mood: 'cry' },
        ],
      },
    ],
  },

  // ───────── parties & nightlife (18+) ─────────
  {
    id: 't2_drunk_shopping',
    icon: '📦',
    cat: 'party',
    rating: 2,
    scene: { place: 'apartment', mood: 'sick' },
    when: { age: [18, 30] },
    vars: { amount: [150, 900] },
    cooldown: 5,
    text: {
      fr: [
        "Lendemain de soirée. Tu ouvres tes mails : 14 confirmations de commandes passées entre 3 h et 4 h du matin. Total : {$amount}. Dont un canoë, un incubateur à œufs d'autruche et un fouet en cuir « édition pro ». Et le livreur sonne déjà avec un colis de la taille d'un frigo : une poupée gonflable déguisée en pirate.",
      ],
      en: [
        "Morning after. You open your email: 14 order confirmations placed between 3 and 4 a.m. Total: {$amount}. Including a canoe, an ostrich egg incubator and a leather whip, ‘pro edition’. And the courier is already ringing with a fridge-sized box: an inflatable doll dressed as a pirate.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout renvoyer', en: 'Return everything' },
        text: { fr: "J'ai tout renvoyé, sauf l'objet en cuir, non repris « pour raisons d'hygiène ». Le livreur m'a regardé{|e} avec un mélange de pitié et de compréhension profonde. Il a déjà vécu ça.", en: "I returned everything except the leather item, non-returnable ‘for hygiene reasons’. The courier looked at me with a mix of pity and deep understanding. He's been there." },
        fx: { money: -40, happy: -3 },
        mood: 'sad',
      },
      {
        label: { fr: 'Assumer et garder', en: 'Keep it all' },
        out: [
          { w: 1, text: { fr: "J'ai tout gardé. Le canoë est dans le salon, la poupée pirate s'appelle Brenda et squatte le canapé. Mes colocs ont convoqué une réunion d'urgence. Brenda a voté pour moi.", en: "I kept everything. The canoe is in the living room, the pirate doll is named Brenda and lives on the couch. My roommates called an emergency meeting. Brenda voted for me." }, fx: { money: '-amount', happy: 6 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai gardé l'incubateur et j'y ai mis un œuf du supermarché, pour voir. Trois semaines plus tard, l'odeur était telle que les pompiers sont venus. Ils ont ri en voyant Brenda.", en: "I kept the incubator and put a supermarket egg in it, just to see. Three weeks later, the smell brought the fire department. They laughed when they saw Brenda." }, fx: { money: '-amount', happy: 2, health: -2 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Revendre en ligne', en: 'Resell online' },
        text: { fr: "J'ai tout revendu sur un site d'occasion. Un monsieur de 70 ans a acheté le fouet et la poupée pirate ensemble, sans poser de questions. Il a laissé 5 étoiles et un commentaire troublant.", en: "I resold it all online. A 70-year-old man bought the whip and the pirate doll together, no questions asked. He left five stars and an unsettling review." },
        fx: { money: -60, happy: 3, karma: -1 },
        mood: 'shock',
      },
    ],
  },
  {
    id: 't2_spring_break',
    icon: '🏖️',
    cat: 'party',
    rating: 2,
    scene: { place: 'beach', mood: 'party' },
    when: { age: [18, 25] },
    vars: { amount: [600, 1500] },
    cooldown: 3,
    text: {
      fr: [
        "Spring break à [[Cancún|Magaluf|Ibiza|Lloret de Mar]] pour {$amount}, tout compris : vol low-cost, hôtel à moitié construit et bracelet « open bar » fluo. Sur la plage, un DJ en string crie « QUI VEUT MOURIR JEUNE ? ». Tout le monde lève la main. Ton pote Kévin, lui, a « calculé l'angle » pour sauter du balcon du 4e dans la piscine.",
      ],
      en: [
        "Spring break in [[Cancún|Magaluf|Ibiza|Daytona]] for {$amount}, all-inclusive: budget flight, half-built hotel and a neon ‘open bar’ wristband. On the beach, a DJ in a thong yells ‘WHO WANTS TO DIE YOUNG?’ Everyone raises a hand. Your buddy Kevin has ‘calculated the angle’ to jump from the fourth-floor balcony into the pool.",
      ],
    },
    choices: [
      {
        label: { fr: 'Foam party jusqu’à l’aube', en: 'Foam party till dawn' },
        out: [
          { w: 2, text: { fr: "Foam party : j'ai perdu mon maillot, mon téléphone, et ma dignité, dans cet ordre. Je me suis réveillé{|e} sur un transat avec un tatouage temporaire « PROPRIÉTÉ DE JASON » sur la fesse. Je ne connais aucun Jason.", en: "Foam party: I lost my swimsuit, my phone and my dignity, in that order. Woke up on a sun lounger with a temporary tattoo reading ‘PROPERTY OF JASON’ on one butt cheek. I don't know any Jason." }, fx: { money: '-amount', happy: 12, health: -4, addiction: ['alcohol', 6] }, mood: 'party' },
          { w: 1, text: { fr: "La mousse était un bouillon de cultures. J'ai ramené une infection qui fait des choses dont on ne parle pas au dîner, et trois numéros de téléphone sans prénom.", en: "The foam was a petri dish. I brought home an infection that does things you don't discuss at dinner, plus three phone numbers with no names." }, fx: { money: '-amount', happy: 4, disease: 'std' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Concours t-shirt mouillé', en: 'Wet T-shirt contest' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "J'ai gagné le concours de t-shirts mouillés. Le prix : une bouteille de tequila et l'admiration éternelle d'un groupe de dentistes allemands en séminaire. J'ai fini la soirée dans leur suite. Ils avaient tous de très belles dents.", en: "I won the wet T-shirt contest. The prize: a bottle of tequila and the eternal admiration of a group of German dentists on a retreat. I ended the night in their suite. They all had very nice teeth." }, fx: { money: '-amount', happy: 14, looks: 1, fame: 1 }, mood: 'love' },
          { w: 1, text: { fr: "Le concours a été filmé par 300 téléphones. Ma mère a vu la vidéo avant que je sois rentré{|e}. Elle l'a commentée : « On t'a mieux élevé{|e} que ça. Et redresse-toi. »", en: "The contest was filmed by 300 phones. My mom saw the video before I got home. Her comment: ‘We raised you better than this. And stand up straight.’" }, fx: { money: '-amount', happy: -2, followers: 2000 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Sauter du balcon', en: 'Jump from the balcony' },
        out: [
          { w: 3, text: { fr: "J'ai sauté du 4e dans la piscine. PLOUF parfait. Toute la plage a hurlé. J'ai été élu{|e} « Dieu du balcon » et bu gratuitement toute la semaine. Kévin avait bien calculé l'angle.", en: "I jumped from the fourth floor into the pool. Perfect SPLASH. The whole beach screamed. I was crowned ‘Balcony God’ and drank free all week. Kevin did calculate the angle." }, fx: { money: '-amount', happy: 15, fame: 2, followers: 800 }, mood: 'party' },
          { w: 2, text: { fr: "J'ai raté la piscine d'un mètre et atterri dans le buffet à volonté. Fracture du bras, paella partout, mais le buffet a amorti. Kévin a recalculé l'angle. Trop tard.", en: "I missed the pool by three feet and landed in the all-you-can-eat buffet. Broken arm, paella everywhere, but the buffet broke my fall. Kevin recalculated the angle. Too late." }, fx: { money: '-amount', health: -15, disease: 'broken_arm', happy: -4 }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai raté la piscine. Et le buffet. Et le transat. Je me suis éclaté{|e} sur le carrelage comme une pastèque lâchée d'un hélicoptère. Le DJ a mis « Highway to Hell » par respect.", en: "I missed the pool. And the buffet. And the lounger. I burst on the tiles like a watermelon dropped from a helicopter. The DJ played ‘Highway to Hell’ out of respect." }, fx: { die: { fr: 'éclaté{|e} sur le carrelage en ratant une piscine pendant le spring break', en: 'splattered on the tiles after missing a pool during spring break' }, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Rester à l’ombre', en: 'Stay in the shade' },
        text: { fr: "J'ai passé la semaine sous un parasol avec un livre. J'ai été la seule personne sobre dans un rayon de 3 km. J'ai tenu les cheveux de 40 inconnus. J'ai vu des choses.", en: "I spent the week under an umbrella with a book. I was the only sober person within two miles. I held back the hair of 40 strangers. I saw things." },
        fx: { money: '-amount', happy: 3, health: 2, karma: 3 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 't2_sugar_daddy',
    icon: '🍭',
    cat: 'uni',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock' },
    when: { age: [19, 25], school: 'uni' },
    actor: { create: { role: 'acquaintance', age: [25, 35], gender: 'attracted' } },
    once: true,
    text: {
      fr: [
        "Ton prêt étudiant grimpe plus vite que ta moyenne. Sur une appli de « rencontres généreuses », {a.first}, {a.age} ans, propriétaire de trois pressings, propose de payer ton loyer contre « de la compagnie ». {a:Il|Elle} précise : « J'aime qu'on me parle de Kant pendant qu'on me masse les pieds. »",
      ],
      en: [
        "Your student loan is climbing faster than your GPA. On a ‘generous dating’ app, {a.first}, {a.age}, owner of three dry cleaners, offers to cover your rent in exchange for ‘companionship’. {a:He|She} specifies: ‘I like to hear about Kant while you rub my feet.’",
      ],
    },
    choices: [
      {
        label: { fr: 'Essayer un dîner', en: 'Try one dinner' },
        out: [
          { w: 2, text: { fr: "Dîner au restaurant étoilé. {a.first} a parlé de son ex-femme pendant trois heures, puis m'a demandé de lui lécher… le fond de son assiette de sorbet, pour « voir ». J'ai léché. Il a payé deux mois de loyer. Je ne regarderai plus jamais un sorbet pareil.", en: "Dinner at a Michelin-star place. {a.first} talked about {a:his|her} ex for three hours, then asked me to lick… the bottom of {a:his|her} sorbet bowl, ‘just to watch’. I licked. {a:He|She} paid two months of rent. I'll never look at sorbet the same way." }, fx: { money: 2000, happy: -2, karma: -2, stress: 3 }, mood: 'shock' },
          { w: 1, text: { fr: "{a.first} est arrivé{a:|e} avec sa mère, qui « vérifie toujours ». La mère m'a posé des questions sur mes intentions, ma mutuelle et mes dents. J'ai eu un repas gratuit et un traumatisme.", en: "{a.first} showed up with {a:his|her} mother, who ‘always vets them’. The mother grilled me on my intentions, my health insurance and my teeth. I got a free meal and trauma." }, fx: { happy: -4, health: 1 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Devenir {a:son|sa} protégé{|e}', en: 'Go all in' },
        out: [
          { w: 1, text: { fr: "Six mois de massages de pieds philosophiques. Loyer payé, prêt remboursé, et je connais par cœur la Critique de la raison pure, récitée devant des orteils. Mes parents croient que j'ai une bourse.", en: "Six months of philosophical foot rubs. Rent paid, loan cleared, and I know the Critique of Pure Reason by heart, recited to a set of toes. My parents think I got a scholarship." }, fx: { money: 9000, happy: 3, karma: -4, smarts: 2 }, mood: 'neutral' },
          { w: 1, text: { fr: "{a.first} est devenu{a:|e} jaloux{a:|se} de mon prof de philo et a débarqué en amphi avec un bouquet et un violoniste. J'ai dû changer de fac. Et de nom sur Instagram.", en: "{a.first} got jealous of my philosophy professor and stormed the lecture hall with a bouquet and a violinist. I had to change universities. And my Instagram handle." }, fx: { money: 3000, happy: -8, stress: 10 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Supprimer l’appli', en: 'Delete the app' },
        text: { fr: "J'ai supprimé l'appli et pris un deuxième job de serveur{|euse}. Mes pieds souffrent, mais ce sont les miens et personne ne me demande de parler de Kant dessus.", en: "I deleted the app and got a second waiting job. My feet hurt, but they're mine, and nobody asks me to discuss Kant over them." },
        fx: { stress: 5, karma: 2, discipline: 3 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 't2_toga_party',
    icon: '🏛️',
    cat: 'party',
    rating: 2,
    scene: { place: 'party', mood: 'party' },
    when: { age: [18, 25], school: 'uni' },
    cooldown: 4,
    text: {
      fr: [
        "Soirée toge à la résidence universitaire. Ta toge est un drap-housse à motifs Cars noué à l'épaule avec un élastique à cheveux. Ce n'est pas assez solide. Tu le sais. L'élastique le sait. Près de la fontaine de sangria, un type qui se fait appeler « Caligula » nourrit les invités au raisin, directement dans la bouche.",
      ],
      en: [
        "Toga party at the dorms. Your toga is a Cars-themed fitted sheet tied at the shoulder with a hair tie. It isn't strong enough. You know it. The hair tie knows it. By the sangria fountain, a guy calling himself ‘Caligula’ hand-feeds grapes straight into guests' mouths.",
      ],
    },
    choices: [
      {
        label: { fr: 'Danser sur la table', en: 'Dance on the table' },
        out: [
          { w: 2, text: { fr: "J'ai dansé sur la table. L'élastique a lâché au refrain. Je me suis retrouvé{|e} totalement à poil devant 80 personnes, éclairé{|e} par un stroboscope. Les applaudissements ont duré plus longtemps que la chanson.", en: "I danced on the table. The hair tie snapped at the chorus. I ended up butt naked in front of 80 people, lit by a strobe light. The applause lasted longer than the song." }, fx: { happy: 6, fame: 3, followers: 600, looks: -1 }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai dansé avec une telle grâce que Caligula m'a sacré{|e} « Empereur{|ice} de la soirée ». On a fini à quatre dans la fontaine de sangria. Je ne me souviens plus des deux autres. Je sens encore l'orange.", en: "I danced so gracefully that Caligula crowned me ‘Emperor of the Night’. We ended up four deep in the sangria fountain. I can't remember the other two. I still smell like orange." }, fx: { happy: 14, health: -3, addiction: ['alcohol', 5] }, mood: 'love' },
        ],
      },
      {
        label: { fr: 'Le raisin de Caligula', en: 'Caligula’s grapes' },
        text: { fr: "Caligula m'a nourri{|e} au raisin, puis au fromage, puis m'a proposé une « orgie à la romaine » dans la buanderie. J'y suis allé{|e}. C'était surtout un concours de bras de fer en drap-housse, mais j'ai fini sans toge.", en: "Caligula fed me grapes, then cheese, then suggested a ‘Roman orgy’ in the laundry room. I went. It was mostly arm wrestling in bedsheets, but I left without my toga." },
        fx: { happy: 9, karma: -1 },
        mood: 'love',
      },
      {
        label: { fr: 'Sécuriser la toge', en: 'Staple the toga' },
        text: { fr: "J'ai agrafé ma toge sur moi avec l'agrafeuse de la résidence. Rien n'a bougé de la soirée. En rentrant, j'ai découvert que j'avais agrafé un téton. Je ne peux pas l'enlever seul{|e}.", en: "I stapled my toga on with the dorm stapler. Nothing moved all night. Back home, I found out I'd stapled a nipple. I can't take it out alone." },
        fx: { health: -4, happy: 1 },
        mood: 'sick',
      },
    ],
  },
  {
    id: 't2_walk_of_shame',
    icon: '🚶',
    cat: 'party',
    rating: 2,
    scene: { place: 'uni', mood: 'shock' },
    when: { age: [18, 25] },
    actor: { create: { role: 'acquaintance', age: [-2, 3], gender: 'attracted' } },
    cooldown: 4,
    text: {
      fr: [
        "Tu te réveilles dans une chambre inconnue, à côté de quelqu'un qui ronfle sous un poster de Che Guevara. Tes fringues ont disparu. Il te reste un peignoir Hello Kitty et une seule chaussette. Il est 8 h, le campus est plein. Sur la table de nuit, un mot : « merci pour le dauphin 🐬 ».",
      ],
      en: [
        "You wake up in a strange room, next to someone snoring under a Che Guevara poster. Your clothes are gone. All you have is a Hello Kitty bathrobe and one sock. It's 8 a.m. and campus is packed. On the nightstand, a note: ‘thanks for the dolphin 🐬’.",
      ],
    },
    choices: [
      {
        label: { fr: 'Traverser le campus', en: 'Cross campus' },
        out: [
          { w: 2, text: { fr: "J'ai traversé tout le campus en peignoir Hello Kitty, une chaussette au pied, sous les applaudissements des étudiants qui sortaient du resto U. Quelqu'un a crié « LÉGENDE ». Ma prof de stats m'a fait un clin d'œil.", en: "I crossed the entire campus in a Hello Kitty robe and one sock, to applause from students leaving the dining hall. Someone yelled ‘LEGEND’. My stats professor winked." }, fx: { happy: 4, fame: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "En plein milieu du campus : mes parents, venus me faire une surprise avec un gâteau. Ma mère a dit « C'est… mignon, ce peignoir ». Mon père a fixé l'horizon. Le gâteau était bon.", en: "Halfway across campus: my parents, there to surprise me with a cake. My mom said ‘That's a… cute robe’. My dad stared at the horizon. The cake was good." }, fx: { happy: -8, stress: 6 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Réveiller l’inconnu', en: 'Wake the stranger' },
        out: [
          { w: 1, text: { fr: "J'ai réveillé {a.first}, étudiant{a:|e} en médecine. {a:Il|Elle} m'a rendu mes vêtements, fait des crêpes et expliqué le dauphin. Je ne répéterai pas l'explication. On se revoit jeudi.", en: "I woke the stranger: {a.first}, med student. {a:He|She} gave me my clothes back, made pancakes and explained the dolphin. I won't repeat the explanation. We're meeting again Thursday." }, fx: { happy: 10, karma: 1 }, mood: 'love' },
          { w: 1, text: { fr: "{a.first} s'est réveillé{a:|e} et a hurlé plus fort que moi. {a:Il|Elle} ne se souvenait de rien non plus. On a reconstitué la nuit grâce à nos photos : un karaoké, un kebab, un aquarium. Mystère du dauphin résolu, hélas.", en: "{a.first} woke up and screamed louder than I did. {a:He|She} didn't remember anything either. We pieced together the night from our camera rolls: karaoke, a kebab, an aquarium. Dolphin mystery solved, sadly." }, fx: { happy: 3, stress: 3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Fuir par la fenêtre', en: 'Escape out the window' },
        text: { fr: "J'ai fui par la fenêtre du rez-de-chaussée, en sous-vêtement, en laissant mon téléphone. {a.first} m'a envoyé un message depuis mon propre téléphone : « Tu reviens chercher ta dignité ? » Non.", en: "I escaped out the ground-floor window in my underwear, leaving my phone behind. {a.first} texted me from my own phone: ‘Coming back for your dignity?’ No." },
        fx: { happy: -4, money: -300 },
        mood: 'shock',
      },
    ],
  },
  {
    id: 't2_sexile',
    icon: '🧦',
    cat: 'uni',
    rating: 2,
    scene: { place: 'uni', mood: 'angry' },
    when: { age: [18, 25], school: 'uni' },
    actor: { create: { role: 'acquaintance', age: [-1, 2], gender: 'any' } },
    once: true,
    text: {
      fr: [
        "Ton coloc de chambre, {a.first}, accroche une chaussette sur la poignée de la porte tous les soirs. Tous. Les. Soirs. Ça fait trois semaines que tu dors dans le couloir sur un pouf. Les bruits à travers la porte évoquent un rodéo dans une ferme.",
        "{a.first}, ton coloc de chambre, a un « système » : une chaussette sur la porte = « pas maintenant ». Ce soir, il y a trois chaussettes. Et un nœud papillon. Tu ne veux pas savoir ce que veut dire le nœud papillon.",
      ],
      en: [
        "Your dorm roommate, {a.first}, hangs a sock on the doorknob every night. Every. Single. Night. You've slept in the hallway on a beanbag for three weeks. The noises through the door suggest a rodeo on a farm.",
        "{a.first}, your dorm roommate, has a ‘system’: a sock on the door means ‘not now’. Tonight there are three socks. And a bow tie. You don't want to know what the bow tie means.",
      ],
    },
    choices: [
      {
        label: { fr: 'Entrer quand même', en: 'Walk in anyway' },
        text: { fr: "Je suis entré{|e}. J'ai vu des choses : {a.first}, deux inconnus, un pot de Nutella et mon oreiller, que je ne récupérerai pas. On s'est regardés en silence. J'ai pris ma brosse à dents et je suis ressorti{|e}. J'ai besoin d'un psy.", en: "I walked in. I saw things: {a.first}, two strangers, a jar of Nutella and my pillow, which I will not be taking back. We stared at each other in silence. I grabbed my toothbrush and left. I need therapy." },
        fx: { happy: -6, stress: 8, rel: -10 },
        mood: 'shock',
      },
      {
        label: { fr: 'Négocier un planning', en: 'Negotiate a schedule' },
        out: [
          { w: 1, text: { fr: "On a mis au point un planning partagé : lundi, mercredi et vendredi pour {a.first}, le reste pour moi. Le système marche. Je suis même devenu{|e} pote avec ses « invités ». On prend le café ensemble.", en: "We set up a shared calendar: Monday, Wednesday and Friday for {a.first}, the rest for me. The system works. I even became friends with {a:his|her} ‘guests’. We have coffee together." }, fx: { happy: 5, rel: 15, actorRole: 'friend' }, mood: 'happy' },
          { w: 1, text: { fr: "{a.first} a accepté le planning et l'a ignoré dès le premier soir. J'ai trouvé un nouveau système : de la musique de cornemuse à fond, de 22 h à 6 h. Personne ne gagne. Tout le monde perd.", en: "{a.first} agreed to the schedule and ignored it the very first night. I found a new system: bagpipe music at full blast from 10 p.m. to 6 a.m. Nobody wins. Everybody loses." }, fx: { happy: -2, stress: 5, rel: -15 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Rendre la pareille', en: 'Return the favor' },
        text: { fr: "J'ai ramené quelqu'un et accroché MA chaussette. {a.first} a dormi dans le couloir pour la première fois. Le lendemain, on a signé une trêve. J'ai aussi gagné un rencard.", en: "I brought someone home and hung MY sock. {a.first} slept in the hallway for the first time. The next day, we signed a truce. I also got a date out of it." },
        fx: { happy: 9, rel: 5 },
        mood: 'love',
      },
    ],
  },
  {
    id: 't2_portaloo',
    icon: '🚽',
    cat: 'party',
    rating: 2,
    scene: { place: 'park', mood: 'party', fx: 'poop' },
    when: { age: [18, 30] },
    vars: { amount: [150, 350] },
    cooldown: 4,
    text: {
      fr: [
        "Festival de musique, jour 3. Il a plu 72 heures. Tu as de la boue jusqu'aux genoux et un besoin urgent. Devant toi : une rangée de toilettes en plastique bleu qui penchent dangereusement sur la pente. La file d'attente fait 40 minutes.",
        "Festival à {$amount} le pass. Ta tente s'est envolée, il reste 3 € sur ton bracelet cashless, et ton intestin t'envoie des signaux d'alerte rouge. Les toilettes chimiques n'ont pas été vidées depuis jeudi.",
      ],
      en: [
        "Music festival, day 3. It has rained for 72 hours. You're knee-deep in mud with an urgent need. In front of you: a row of blue plastic porta-potties tilting dangerously on a slope. The line is 40 minutes long.",
        "A festival with a {$amount} pass. Your tent blew away, there's $3 left on your cashless wristband, and your bowels are sending red alerts. The chemical toilets haven't been emptied since Thursday.",
      ],
    },
    choices: [
      {
        label: { fr: 'Entrer dans la cabine', en: 'Use the porta-potty' },
        out: [
          { w: 2, text: { fr: "Je suis entré{|e} dans la cabine. Elle a basculé. J'ai roulé trois fois sur la pente, enfermé{|e} dans un tonneau de merde tiède. Les festivaliers ont filmé en criant « LE BOBSLEIGH ! ». La vidéo a son propre hashtag.", en: "I went in. It tipped over. I rolled down the slope three times, locked inside a barrel of lukewarm shit. Festivalgoers filmed it screaming ‘BOBSLED!’. The video has its own hashtag." }, fx: { happy: -10, health: -5, followers: 5000, fame: 2, disease: 'gastro', visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai ouvert la porte. Une odeur m'a frappé{|e} comme un camion. Je me suis évanoui{|e} dans la boue. Un secouriste m'a réanimé{|e} en disant « encore un ». Je n'ai jamais fait mon besoin. Il est toujours là.", en: "I opened the door. A smell hit me like a truck. I fainted into the mud. A medic revived me, sighing ‘another one’. I never went. It's still in there." }, fx: { health: -4, happy: -6 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Les buissons', en: 'The bushes' },
        text: { fr: "J'ai filé dans les buissons. J'y ai trouvé trois personnes en train de faire la même chose, un couple en pleine action et un hérisson. On a tous hoché la tête, solidaires. Le hérisson, moins.", en: "I sprinted into the bushes. I found three people doing the same thing, a couple going at it and a hedgehog. We all nodded in solidarity. The hedgehog, less so." },
        fx: { happy: 2, karma: -1 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Rentrer chez soi', en: 'Go home' },
        text: { fr: "J'ai abandonné le festival et pris le premier train. Dans le wagon, j'ai senti le fumier et la bière pendant 3 heures. Mes voisins de siège ont changé de wagon. J'ai raté le concert de clôture, mais pas les toilettes de chez moi.", en: "I gave up on the festival and took the first train home. I smelled like manure and beer for three hours. The people next to me changed cars. I missed the closing act, but not my own toilet." },
        fx: { happy: -3, health: 2 },
        mood: 'sad',
      },
    ],
  },
  {
    id: 't2_lab_explosion',
    icon: '🧪',
    cat: 'uni',
    rating: 2,
    scene: { place: 'uni', mood: 'shock', fx: 'explosion' },
    when: { age: [18, 25], school: 'uni' },
    once: true,
    text: {
      fr: [
        "TP de chimie. Ton binôme a oublié ses lunettes, toi tu as oublié de lire le protocole. Le liquide dans votre bécher est passé du bleu au violet, puis à un orange qui fait un bruit. Les liquides ne devraient pas faire de bruit.",
        "TP de chimie, dernière séance. Le prof est sorti « deux minutes ». Ton voisin propose de « mélanger tout ce qui reste pour voir ». La fiole fume déjà, et ça sent les cheveux brûlés et le regret.",
      ],
      en: [
        "Chemistry lab. Your lab partner forgot his goggles; you forgot to read the protocol. The liquid in your beaker went from blue to purple, then to an orange that's making a noise. Liquids shouldn't make noises.",
        "Chemistry lab, last session. The professor stepped out ‘for two minutes’. Your neighbor suggests ‘mixing everything left over to see what happens’. The flask is already smoking, and it smells like burnt hair and regret.",
      ],
    },
    choices: [
      {
        label: { fr: 'Remuer pour voir', en: 'Stir and see' },
        out: [
          { w: 2, text: { fr: "BOUM. Plus de sourcils, cheveux en pétard façon Einstein, et un trou dans le plafond par lequel on voit l'amphi du dessus. Les étudiants du dessus m'ont applaudi. Mes sourcils repousseront en 2 mois, mais seulement le gauche.", en: "BOOM. No eyebrows, Einstein hair, and a hole in the ceiling through which you can see the lecture hall upstairs. The students up there applauded. My eyebrows will grow back in two months, but only the left one." }, fx: { looks: -6, health: -6, disease: 'burns', grade: -5, fame: 1, visual: 'explosion' }, mood: 'shock' },
          { w: 2, text: { fr: "Le mélange a fait une petite fumée rose, puis plus rien. Le prof est revenu, a reniflé, et a dit : « Vous venez d'inventer quelque chose. Je ne sais pas quoi, mais c'est illégal dans 12 pays. » 18/20.", en: "The mixture puffed a little pink smoke, then nothing. The professor came back, sniffed, and said: ‘You just invented something. I don't know what, but it's illegal in twelve countries.’ A-." }, fx: { grade: 6, smarts: 3, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "Le bécher a explosé avec une force biblique. On a retrouvé mes doigts sur le tableau, mes chaussures dans le couloir et mon badge étudiant dans le distributeur de café. Le TP a été annulé pour l'année. Et toutes les années suivantes.", en: "The beaker exploded with biblical force. My fingers were found on the whiteboard, my shoes in the hallway and my student ID in the coffee machine. The lab was canceled for the year. And every year after that." }, fx: { die: { fr: 'pulvérisé{|e} en TP de chimie en mélangeant « tout ce qui restait pour voir »', en: "blown to bits in chemistry lab after mixing ‘everything left over to see what happens’" }, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Évacuer en hurlant', en: 'Evacuate screaming' },
        text: { fr: "J'ai hurlé « ÇA VA PÉTER » et évacué tout le bâtiment. Il ne s'est rien passé. Le bécher a juste fait des bulles. 400 étudiants dehors sous la pluie pour un bécher qui fait des bulles. Mon surnom : « Ça Va Péter ».", en: "I screamed ‘IT'S GONNA BLOW’ and evacuated the whole building. Nothing happened. The beaker just bubbled. 400 students out in the rain for a bubbling beaker. My nickname is now ‘Gonna Blow’." },
        fx: { happy: -4, fame: 1, karma: 1 },
        mood: 'shock',
      },
      {
        label: { fr: 'Le verser dans l’évier', en: 'Pour it down the sink' },
        text: { fr: "J'ai versé le mélange dans l'évier. Il a rongé la tuyauterie sur trois étages. Le lendemain, les toilettes des profs ont refoulé de façon spectaculaire. Je n'ai jamais avoué. Je ne l'avouerai jamais.", en: "I poured the mixture down the sink. It ate through three floors of plumbing. The next day, the faculty toilets backed up spectacularly. I never confessed. I never will." },
        fx: { happy: 5, karma: -3, visual: 'poop' },
        mood: 'happy',
      },
    ],
  },

  // ═════════════════════════════ INTERNET & SOCIAL MEDIA (18+) ═════════════════════════════
  // ───────── feed lines ─────────
  {
    id: 't2_auto_ratio',
    icon: '📉',
    cat: 'influencer',
    rating: 1,
    auto: true,
    cooldown: 4,
    when: { age: [18, 60] },
    text: {
      fr: [
        "J'ai posté un avis tranché sur les chocolatines. Je me suis fait ratio par un compte avec une grenouille en photo de profil et 11 abonnés. 40 000 likes pour « t'es qui toi, sale baltringue ? ». Je ne m'en remettrai pas.",
        "J'ai répondu « source ? » à un inconnu sur Internet. Il m'a envoyé un lien vers un PDF de 600 pages. J'ai dû le lire par fierté. J'ai eu tort, putain, sur toute la ligne.",
      ],
      en: [
        "I posted a hot take about pineapple pizza. I got ratioed by an account with a frog avatar and 11 followers. 40,000 likes for ‘who the hell asked you, clown?’. I will never recover.",
        "I replied ‘source?’ to a stranger online. He sent me a link to a 600-page PDF. I had to read it out of pride. I was wrong, goddammit, about everything.",
      ],
    },
    fx: { happy: -3, stress: 2 },
  },
  {
    id: 't2_auto_algorithm',
    icon: '🤖',
    cat: 'influencer',
    auto: true,
    cooldown: 3,
    when: { age: [18, 70], followers: [10000, 1e9] },
    text: {
      fr: [
        "L'algorithme a changé dans la nuit. Mes vidéos ne sont plus montrées qu'à des retraités en Ouzbékistan. Ils sont adorables, mais ils ne likent pas.",
        "Un nouveau format est à la mode : des vidéos de 4 secondes où l'on hoche la tête sur un son de klaxon. J'ai suivi la tendance. J'ai perdu des abonnés et un peu de mon âme.",
      ],
      en: [
        "The algorithm changed overnight. My videos are now only shown to retirees in Uzbekistan. They're lovely, but they don't like anything.",
        "A new format is trending: four-second videos of people nodding to a car horn sound. I followed the trend. I lost followers and a bit of my soul.",
      ],
    },
    fx: { followers: -2500, happy: -3 },
  },
  {
    id: 't2_auto_fan_dog',
    icon: '🐶',
    cat: 'influencer',
    auto: true,
    once: true,
    when: { age: [18, 80], followers: [20000, 1e9] },
    text: {
      fr: [
        "Un abonné m'a écrit qu'il avait appelé son chien {first} en mon honneur. Il m'a envoyé une photo. Le chien me ressemble un peu. Surtout le regard.",
        "Une abonnée m'a envoyé une peinture à l'huile de moi en sirène, de 2 mètres de haut. Elle demande où la livrer. Je n'ai pas de mur assez grand, ni de réponse.",
      ],
      en: [
        "A follower wrote to tell me he named his dog {first} in my honor. He sent a photo. The dog looks a bit like me. Especially around the eyes.",
        "A follower sent me a six-foot oil painting of me as a mermaid. She's asking where to deliver it. I don't have a wall big enough, or an answer.",
      ],
    },
    fx: { happy: 4, fame: 1 },
  },

  // ───────── going viral & influencer life ─────────
  {
    id: 't2_meme_face',
    icon: '😐',
    cat: 'influencer',
    rating: 1,
    scene: { place: 'home', mood: 'shock' },
    when: { age: [18, 60] },
    once: true,
    weight: 6,
    text: {
      fr: [
        "Une photo de toi au mariage de ta cousine, en train de regarder ton assiette avec un air de profonde déception, est devenue un meme mondial. Légende : « Moi quand le lundi arrive ». Tu es partout. Même sur un panneau publicitaire en Corée.",
        "Une photo de toi au restaurant, fixant l'addition avec une horreur absolue, est devenue LE meme de l'année : « Moi quand je regarde mon compte en banque ». 30 millions de partages. On t'appelle « la Tête de {city} ».",
      ],
      en: [
        "A photo of you at your cousin's wedding, staring at your plate with an air of profound disappointment, has become a global meme. Caption: ‘Me when Monday hits’. You're everywhere. Even on a billboard in Korea.",
        "A photo of you at a restaurant, staring at the bill in absolute horror, became THE meme of the year: ‘Me checking my bank account’. 30 million shares. People call you ‘the Face of {city}’.",
      ],
    },
    choices: [
      {
        label: { fr: 'Surfer sur la vague', en: 'Ride the wave' },
        out: [
          { w: 2, text: { fr: "J'ai ouvert un compte, vendu des t-shirts avec ma tête déçue et fait une pub pour une marque de lundis... de café. J'ai gagné de l'argent en étant triste. Le rêve.", en: "I opened an account, sold T-shirts of my disappointed face and did an ad for a coffee brand. I made money by being sad. The dream." }, fx: { followers: 60000, money: 3000, fame: 6, happy: 8 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai lancé ma chaîne, mais le monde ne voulait que LA photo. Mes vidéos normales font 40 vues. Le meme, lui, continue de vivre sans moi. Je suis le figurant de ma propre célébrité.", en: "I launched my channel, but the world only wanted THE photo. My normal videos get 40 views. The meme lives on without me. I'm an extra in my own fame." }, fx: { followers: 8000, happy: -3, fame: 3 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Exiger des droits d’auteur', en: 'Demand royalties' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai pris un avocat et réclamé des droits sur ma propre tête. Une agence de pub coréenne m'a versé un chèque. Je suis officiellement payé{|e} pour exister.", en: "I got a lawyer and claimed rights to my own face. A Korean ad agency sent me a check. I'm officially paid to exist." }, fx: { money: 12000, fame: 3, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "L'avocat m'a coûté 4 000 € pour m'expliquer qu'un meme appartient à Internet. Internet, lui, a fait un meme de ma réaction en apprenant la facture. Le même air déçu, mais en pire.", en: "The lawyer cost me $4,000 to explain that memes belong to the internet. The internet then made a meme of my face when I saw the bill. Same disappointment, but worse." }, fx: { money: -4000, happy: -6, followers: 2000 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Se cacher', en: 'Go into hiding' },
        text: { fr: "J'ai porté des lunettes de soleil et une casquette pendant six mois. Un enfant m'a quand même reconnu{|e} au supermarché et m'a imité{|e}. Il était très bon. Trop bon.", en: "I wore sunglasses and a cap for six months. A kid still recognized me at the supermarket and did my face. He was very good. Too good." },
        fx: { happy: -4, stress: 5, fame: 2 },
        mood: 'sad',
      },
    ],
  },
  {
    id: 't2_buy_followers',
    icon: '🛒',
    cat: 'influencer',
    scene: { place: 'apartment', mood: 'neutral' },
    when: { age: [18, 50], followers: [0, 20000] },
    vars: { amount: [50, 300] },
    cooldown: 6,
    text: {
      fr: [
        "Un site propose « 10 000 abonnés 100 % réels » pour {$amount}. La page est en Comic Sans et le témoignage client vient de « Jean Abonné, Influenceur ».",
        "Ton compte stagne à 214 abonnés depuis deux ans. Un inconnu en DM te propose « un boost de visibilité garanti » pour {$amount}. Sa photo de profil est une Lamborghini floue.",
      ],
      en: [
        "A website offers ‘10,000 100% real followers’ for {$amount}. The page is in Comic Sans and the testimonial is from ‘John Follower, Influencer’.",
        "Your account has been stuck at 214 followers for two years. A stranger in your DMs offers a ‘guaranteed visibility boost’ for {$amount}. His profile pic is a blurry Lamborghini.",
      ],
    },
    choices: [
      {
        label: { fr: 'Acheter', en: 'Buy them' },
        out: [
          { w: 2, text: { fr: "10 000 nouveaux abonnés en une nuit. Ils s'appellent tous « user84726193 », commentent « Nice pic bro 🔥 » sous la photo de l'enterrement de mon grand-père, et aucun ne like.", en: "10,000 new followers overnight. They're all named ‘user84726193’, comment ‘Nice pic bro 🔥’ under my grandpa's funeral photo, and none of them like anything." }, fx: { money: '-amount', followers: 10000, happy: 2, karma: -1 }, mood: 'neutral' },
          { w: 1, text: { fr: "J'ai payé. Rien n'est arrivé, à part 400 mails pour des pilules miracles et un appel de ma banque. Le seul abonné gagné, c'est le type à la Lamborghini floue.", en: "I paid. Nothing happened, except 400 spam emails for miracle pills and a call from my bank. The only follower I gained is the blurry Lamborghini guy." }, fx: { money: '-amount', happy: -5, followers: 1 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Croissance organique', en: 'Grow organically' },
        out: [
          { w: 1, text: { fr: "J'ai posté tous les jours pendant un an. J'ai gagné 600 abonnés, dont 300 vrais humains. C'est lent, mais quand ils commentent, ce sont des phrases.", en: "I posted every day for a year. I gained 600 followers, 300 of them actual humans. Slow, but when they comment, they use full sentences." }, fx: { followers: 600, discipline: 3, happy: 3 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai posté une vidéo honnête sur l'achat d'abonnés. Elle a cartonné. Ironie : des milliers de vrais abonnés pour parler de faux abonnés.", en: "I posted an honest video about buying followers. It blew up. Irony: thousands of real followers for talking about fake ones." }, fx: { followers: 7000, fame: 2, happy: 6 }, mood: 'happy' },
        ],
      },
    ],
  },
  {
    id: 't2_cancel_apology',
    icon: '🙇',
    cat: 'influencer',
    rating: 1,
    scene: { place: 'apartment', mood: 'cry' },
    when: { age: [18, 70], followers: [3000, 1e9] },
    cooldown: 6,
    text: {
      fr: [
        "À 3 h du matin, tu as liké par erreur un post qui affirme que les pigeons sont des drones du gouvernement. Capture d'écran. Indignation. #{first}Complotiste est en tendance, et ta tante te demande si c'est vrai pour les pigeons.",
        "Une vieille vidéo exhumée te montre en 2014, à trois grammes, affirmant que « la Terre est peut-être un peu plate, en vrai ». #{first}Platiste est en tendance. Ton téléphone vibre sans arrêt depuis 6 h.",
      ],
      en: [
        "At 3 a.m., you accidentally liked a post claiming pigeons are government drones. Screenshot. Outrage. #{first}IsAConspiracyNut is trending, and your aunt is asking if it's true about the pigeons.",
        "A resurfaced old video shows you, very drunk, claiming ‘the Earth might be a little bit flat, honestly’. #{first}IsAFlatEarther is trending. Your phone hasn't stopped buzzing since 6 a.m.",
      ],
    },
    choices: [
      {
        label: { fr: 'Excuses sur les Notes', en: 'Notes app apology' },
        text: { fr: "J'ai publié des excuses écrites dans l'appli Notes, fond blanc, police par défaut. Les internautes ont analysé la police. On m'a accusé{|e} d'avoir utilisé ChatGPT. J'avais utilisé ChatGPT.", en: "I posted an apology written in the Notes app, white background, default font. People analyzed the font. They accused me of using ChatGPT. I had used ChatGPT." },
        fx: { followers: -3000, happy: -4, stress: 4 },
        mood: 'sad',
      },
      {
        label: { fr: 'Vidéo en pleurs, sweat gris', en: 'Crying video, gray hoodie' },
        out: [
          { w: 1, text: { fr: "Vidéo d'excuses : sweat gris, pas maquillé{|e}, lumière triste, larmes à la 45e seconde. Elle a fait 2 millions de vues. Les gens m'ont pardonné, puis ont vendu des sweats gris « Sorry Edition ».", en: "Apology video: gray hoodie, no makeup, sad lighting, tears at second 45. Two million views. People forgave me, then started selling gray ‘Sorry Edition’ hoodies." }, fx: { followers: 5000, fame: 2, happy: 2 }, mood: 'neutral' },
          { w: 1, text: { fr: "J'ai pleuré en vidéo. On a zoomé sur mon œil : un oignon se reflétait dans ma pupille. Seconde vague de haine, plus forte. Les oignons aussi ont un lobby.", en: "I cried on camera. Someone zoomed in on my eye: an onion was reflected in my pupil. Second wave of hate, bigger. Onions have a lobby too." }, fx: { followers: -8000, happy: -8, stress: 6 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Persister et signer', en: 'Double down' },
        out: [
          { w: 1, text: { fr: "J'ai posté : « Oui, et alors ? Bande de cons. » Les complotistes m'ont adopté{|e}. Je suis passé{|e} de 5 000 à 90 000 abonnés, tous convaincus que la Lune est un hologramme. Je ne sais pas comment revenir en arrière.", en: "I posted: ‘Yeah, so what? Bunch of idiots.’ The conspiracy crowd adopted me. I went from 5,000 to 90,000 followers, all convinced the Moon is a hologram. I don't know how to undo this." }, fx: { followers: 40000, karma: -5, happy: 2, fame: 3 }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai persisté. Mes sponsors m'ont lâché{|e} un par un, en commençant par la marque de bouillon. Le dernier message de mon agent : « lol ».", en: "I doubled down. My sponsors dropped me one by one, starting with the soup brand. My agent's last text: ‘lol’." }, fx: { followers: -10000, money: -2000, happy: -6 }, mood: 'angry' },
        ],
      },
    ],
  },
  {
    id: 't2_fake_vacation',
    icon: '🌴',
    cat: 'influencer',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock' },
    when: { age: [18, 50], followers: [2000, 1e9] },
    cooldown: 6,
    text: {
      fr: [
        "Tes abonnés croient que tu es à Bali. En réalité, tu es dans ta baignoire, avec un fond vert, une noix de coco du Lidl et un ventilateur pour la « brise marine ». Ton reflet dans le robinet est en train de tout gâcher.",
      ],
      en: [
        "Your followers think you're in Bali. Actually, you're in your bathtub with a green screen, a discount-store coconut and a fan for the ‘ocean breeze’. Your reflection in the faucet is ruining everything.",
      ],
    },
    choices: [
      {
        label: { fr: 'Poster quand même', en: 'Post it anyway' },
        out: [
          { w: 1, text: { fr: "J'ai posté. 48 h plus tard, un compte d'enquêteurs amateurs a zoomé sur le robinet et y a trouvé mon reflet, en slip, la noix de coco à la main. Vidéo « LA GROSSE ARNAQUE DE {first} » : 3 millions de vues. Le robinet est devenu plus célèbre que moi.", en: "I posted it. 48 hours later, an amateur sleuth account zoomed in on the faucet and found my reflection, in my underwear, coconut in hand. Video ‘{first}'S HUGE SCAM’: 3 million views. The faucet got more famous than me." }, fx: { followers: -6000, happy: -8, fame: 2 }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai posté. Personne n'a rien vu. 12 000 likes, des commentaires « trop jalouse 😍 ». Une marque de crème solaire m'a même envoyé un contrat. Je l'utilise dans ma baignoire.", en: "I posted it. Nobody noticed. 12,000 likes, comments like ‘so jealous 😍’. A sunscreen brand even sent me a contract. I use the sunscreen in my bathtub." }, fx: { followers: 3000, money: 800, karma: -2, happy: 5 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Avouer en vidéo', en: 'Confess on camera' },
        text: { fr: "J'ai filmé la vérité : la baignoire, la noix de coco, le ventilateur. Les gens ont adoré. J'ai lancé une série, « Vacances de pauvre », qui cartonne. La noix de coco est mon invitée récurrente.", en: "I filmed the truth: the bathtub, the coconut, the fan. People loved it. I launched a series, ‘Broke Vacations’, which is a hit. The coconut is my recurring guest." },
        fx: { followers: 8000, fame: 2, happy: 7, karma: 2 },
        mood: 'proud',
      },
      {
        label: { fr: 'Partir vraiment', en: 'Actually go' },
        text: { fr: "J'ai acheté un vrai billet pour Bali à crédit. Il a plu tous les jours, j'ai eu la turista dès le deuxième soir et j'ai passé la semaine aux toilettes de l'hôtel. Photos sublimes quand même. Personne ne sait.", en: "I bought a real ticket to Bali on credit. It rained every day, I got traveler's diarrhea the second night and spent the week in the hotel bathroom. Gorgeous photos though. Nobody knows." },
        fx: { money: -2500, health: -5, followers: 2000, happy: -2 },
        mood: 'sick',
      },
    ],
  },
  {
    id: 't2_stream_rage',
    icon: '🎮',
    cat: 'influencer',
    rating: 2,
    scene: { place: 'studio', mood: 'angry' },
    when: { age: [18, 45] },
    cooldown: 5,
    text: {
      fr: [
        "Tu streams depuis 9 heures pour tes 23 spectateurs, sans quitter ta chaise : deux bouteilles de pisse tiède trônent à tes pieds. Dernier boss, 1 PV, et ta souris se déconnecte. Tu sens monter une colère primitive. Le chat écrit « lol » en boucle, et un spectateur propose 50 € si tu manges une cuillère de wasabi « pour te calmer ».",
      ],
      en: [
        "You've been streaming for nine hours to your 23 viewers without leaving your chair: two bottles of lukewarm piss sit at your feet. Final boss, 1 HP left, and your mouse disconnects. You feel a primal rage rising. Chat is spamming ‘lol’, and a viewer offers $50 if you eat a spoonful of wasabi ‘to calm down’.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exploser en direct', en: 'Explode live' },
        out: [
          { w: 1, text: { fr: "J'ai hurlé « PUTAIN DE BORDEL DE SOURIS DE MERDE » et fracassé mon clavier sur mon bureau. Les touches ont volé, une bouteille de pisse s'est renversée sur le tapis, et le chat a tout vu. Clip : 4 millions de vues. Je suis « le gars du clavier ». Ça paie le nouveau clavier.", en: "I screamed ‘GODDAMN PIECE OF SHIT MOUSE’ and smashed my keyboard on the desk. Keys flew, a piss bottle tipped over onto the rug, and chat saw everything. Clip: 4 million views. I'm ‘keyboard guy’. It paid for a new keyboard." }, fx: { followers: 25000, fame: 3, happy: 4, money: -100 }, mood: 'angry' },
          { w: 1, text: { fr: "J'ai explosé. Personne n'a clippé. Mes 23 spectateurs sont partis un par un. Il me reste un bot et mon clavier cassé. Le silence de la chambre est assourdissant.", en: "I exploded. Nobody clipped it. My 23 viewers left one by one. I'm left with a bot and a broken keyboard. The silence of my room is deafening." }, fx: { happy: -6, money: -100 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Prendre l’argent du chat', en: 'Take chat’s money' },
        text: { fr: "J'ai mangé le wasabi. Puis un deuxième. Puis j'ai pleuré, toussé, et dit des mots qui n'existent dans aucune langue. 400 € de dons. Ma mère a commenté : « Mange des légumes plutôt. »", en: "I ate the wasabi. Then a second spoonful. Then I cried, coughed, and said words that exist in no language. $400 in donations. My mom commented: ‘Eat some vegetables instead.’" },
        fx: { money: 400, health: -3, followers: 1500, happy: 2 },
        mood: 'sick',
      },
      {
        label: { fr: 'Couper le stream', en: 'End the stream' },
        text: { fr: "J'ai coupé le stream, je suis sorti{|e} marcher. J'ai vu un arbre. Il était beau, en haute définition, sans lag. Je ne sais pas quoi en penser.", en: "I ended the stream and went for a walk. I saw a tree. It was beautiful, in high definition, zero lag. I don't know how to feel about it." },
        fx: { stress: -6, happy: 3, health: 2 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 't2_influencer_burnout',
    icon: '🫠',
    cat: 'influencer',
    rating: 1,
    scene: { place: 'apartment', mood: 'sad' },
    when: { age: [18, 60], followers: [50000, 1e9] },
    cooldown: 6,
    text: {
      fr: [
        "Ça fait 500 jours d'affilée que tu postes. Ce matin, tu as filmé ton petit-déjeuner sous trois angles avant de te rendre compte que tu n'avais pas faim. Tu fixes ton ring light en silence.",
        "Ta vie entière est un contenu. Hier, tu as pleuré, et ton premier réflexe a été de chercher le bon éclairage. Ton psy t'a demandé quand tu avais fait un truc « juste pour toi ». Tu as ri nerveusement.",
      ],
      en: [
        "You've posted 500 days in a row. This morning you filmed your breakfast from three angles before realizing you weren't hungry. You stare silently at your ring light.",
        "Your whole life is content. Yesterday you cried, and your first instinct was to find good lighting. Your therapist asked when you last did something ‘just for you’. You laughed nervously.",
      ],
    },
    choices: [
      {
        label: { fr: 'Pause annoncée', en: 'Announce a break' },
        out: [
          { w: 2, text: { fr: "J'ai posté « Je fais une pause pour ma santé mentale ». Ce post a fait plus de vues que tout le reste. J'ai passé un mois sans téléphone, à faire du pain. Le pain est raté, mais je dors.", en: "I posted ‘Taking a break for my mental health’. That post got more views than anything else I've made. I spent a month without my phone, baking bread. The bread is bad, but I sleep." }, fx: { stress: -15, happy: 8, followers: -5000, health: 3 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai annoncé une pause. Trois jours plus tard, j'ai posté une vidéo « Ma pause : ce que j'ai appris ». Puis « Ma pause, partie 2 ». Je suis en pause du contenu en faisant du contenu sur ma pause. Merde.", en: "I announced a break. Three days later I posted ‘My break: what I learned’. Then ‘My break, part 2’. I'm on a content break by making content about my break. Shit." }, fx: { stress: 4, followers: 2000, happy: -3 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Tout supprimer', en: 'Delete everything' },
        text: { fr: "J'ai supprimé mon compte, toutes mes vidéos, toute ma vie numérique. Je suis devenu{|e} jardinier{|e}. Les tomates ne commentent pas. C'est le bonheur.", en: "I deleted my account, every video, my entire digital life. I became a gardener. Tomatoes don't comment. It's bliss." },
        fx: { followers: -1e9, stress: -20, happy: 10, fame: -10 },
        mood: 'happy',
      },
      {
        label: { fr: 'Continuer, encore', en: 'Keep going' },
        text: { fr: "J'ai continué. J'ai mis un filtre « bonne mine » sur mes cernes et posté une vidéo « 5 astuces pour être productif ». Je ne sais plus quel jour on est.", en: "I kept going. I slapped a ‘healthy glow’ filter on my eye bags and posted ‘5 productivity hacks’. I no longer know what day it is." },
        fx: { followers: 4000, stress: 12, health: -4, money: 1500 },
        mood: 'sleepy',
      },
    ],
  },
  {
    id: 't2_detox_tea',
    icon: '🍵',
    cat: 'influencer',
    rating: 2,
    scene: { place: 'apartment', mood: 'sick', fx: 'poop' },
    when: { age: [18, 50], followers: [10000, 1e9] },
    vars: { amount: [1500, 6000] },
    cooldown: 6,
    text: {
      fr: [
        "Une marque de « thé détox ventre plat » te propose {$amount} pour une vidéo où tu en bois une tasse en souriant. Le contrat précise : « Prévoir des toilettes à proximité. » En gras.",
        "Contrat juteux : {$amount} pour promouvoir le « Slim Tea Miracle », un thé à base de séné. La notice conseille « de ne pas s'éloigner de plus de 4 mètres d'une salle de bain pendant 48 h ».",
      ],
      en: [
        "A ‘flat tummy detox tea’ brand offers you {$amount} for a video of you happily sipping a cup. The contract states: ‘Ensure bathroom access nearby.’ In bold.",
        "Juicy contract: {$amount} to promote ‘Slim Tea Miracle’, a senna-based tea. The leaflet advises ‘staying within 12 feet of a bathroom for 48 hours’.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tourner en live', en: 'Shoot it live' },
        out: [
          { w: 2, text: { fr: "J'ai bu le thé en direct. Au bout de 7 minutes, mon ventre a fait un bruit de baleine en détresse. J'ai couru aux toilettes, micro allumé. 80 000 personnes ont entendu l'apocalypse. Le contrat est payé, mais à quel prix ?", en: "I drank the tea live. Seven minutes in, my stomach made the sound of a whale in distress. I ran to the toilet, mic still on. 80,000 people heard the apocalypse. The contract paid, but at what cost?" }, fx: { money: 'amount', followers: 15000, health: -6, happy: -4, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai bu le thé en souriant, puis j'ai repeint ma salle de bain jusqu'au plafond. J'ai perdu 3 kilos en une nuit, dont environ 2,5 de dignité. Le plombier m'a regardé{|e} avec un respect mêlé de terreur.", en: "I drank the tea with a smile, then repainted my bathroom up to the ceiling. I lost six pounds overnight, about five of them dignity. The plumber looked at me with respect mixed with terror." }, fx: { money: 'amount', health: -8, weight: -0.03, happy: -6, disease: 'gastro', visual: 'poop' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Faire semblant de boire', en: 'Fake the sip' },
        text: { fr: "J'ai fait semblant de boire et filmé un « avant/après » avec simplement une meilleure lumière. Argent encaissé, intestins intacts, karma un peu froissé.", en: "I faked the sip and filmed a ‘before/after’ with just better lighting. Money banked, bowels intact, karma slightly crumpled." },
        fx: { money: 'amount', karma: -4, followers: 2000 },
        mood: 'happy',
      },
      {
        label: { fr: 'Refuser publiquement', en: 'Publicly refuse' },
        text: { fr: "J'ai posté le mail de la marque avec le passage sur les toilettes en surbrillance. Énorme succès. La marque a fait faillite. Ses stocks de thé ont été rachetés par un hôpital qui prépare ses coloscopies.", en: "I posted the brand's email with the bathroom bit highlighted. Huge hit. The brand went bust. Its tea stock was bought by a hospital for colonoscopy prep." },
        fx: { followers: 6000, karma: 4, fame: 2, happy: 5 },
        mood: 'proud',
      },
    ],
  },
  {
    id: 't2_reaction_drama',
    icon: '🍿',
    cat: 'influencer',
    rating: 2,
    scene: { place: 'studio', mood: 'angry' },
    when: { age: [18, 50], followers: [5000, 1e9] },
    actor: { create: { role: 'acquaintance', age: [-5, 5], gender: 'any' } },
    cooldown: 6,
    text: {
      fr: [
        "{a.first}, {a:un|une} youtubeu{a:r|se} à 2 millions d'abonnés, a copié ton concept plan par plan, jusqu'à ta blague sur les escargots. Puis {a:il|elle} a sorti une vidéo « LA VÉRITÉ SUR {first} 😳 » avec ta tête en miniature et une flèche rouge.",
        "{a.first} a fait une vidéo de réaction de 40 minutes sur toi et ta blague sur les escargots, en mangeant des pâtes. {a:Il|Elle} met pause toutes les 10 secondes pour dire « non mais regardez-moi ce bouffon ». Tes abonnés réclament une réponse.",
      ],
      en: [
        "{a.first}, a YouTuber with 2 million subscribers, copied your concept shot for shot, down to your snail joke. Then {a.he} posted ‘THE TRUTH ABOUT {first} 😳’ with your face in the thumbnail and a red arrow.",
        "{a.first} made a 40-minute reaction video about you and your snail joke, while eating pasta. {a:He|She} pauses every ten seconds to say ‘look at this absolute clown’. Your followers demand a response.",
      ],
    },
    choices: [
      {
        label: { fr: 'Vidéo clash de 3 heures', en: '3-hour diss video' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai sorti une vidéo de 3 heures avec frise chronologique, preuves horodatées et un montage de {a.first} en limace baveuse. « Sale vermine plagiaire à tête de fesse », c'était le titre du chapitre 4. 5 millions de vues. {a:Il|Elle} a fermé sa chaîne.", en: "I dropped a 3-hour video with a timeline, timestamped receipts and an edit of {a.first} as a drooling slug. Chapter 4 was titled ‘Plagiarizing Butt-Faced Vermin’. 5 million views. {a:He|She} deleted {a:his|her} channel." }, fx: { followers: 80000, fame: 5, happy: 10, actorRole: 'enemy', keep: true }, mood: 'proud' },
          { w: 1, text: { fr: "Ma vidéo de 3 heures contenait une erreur à la minute 47. {a.first} a fait une vidéo de 4 heures sur cette erreur. Je suis désormais connu{|e} comme « le menteur aux escargots ». Ma mère a choisi son camp. Pas le mien.", en: "My 3-hour video had one mistake at minute 47. {a.first} made a 4-hour video about that mistake. I'm now known as ‘the snail liar’. My mom picked a side. Not mine." }, fx: { followers: -15000, happy: -10, stress: 8, actorRole: 'enemy', keep: true }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Proposer un feat', en: 'Propose a collab' },
        text: { fr: "J'ai proposé à {a.first} une vidéo ensemble. On a fait semblant de se réconcilier en direct, en pleurant. 6 millions de vues. Hors caméra, on ne se parle pas. On se partage juste l'argent.", en: "I proposed a collab with {a.first}. We fake-reconciled live, with tears. 6 million views. Off camera, we don't speak. We just split the money." },
        fx: { followers: 30000, money: 4000, karma: -1, happy: 4 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Ignorer avec classe', en: 'Ignore with class' },
        text: { fr: "Je n'ai rien répondu. Mes abonnés ont trouvé ça classe. {a.first}, frustré{a:|e}, a fait trois autres vidéos sur mon silence. Je vis gratuitement dans sa tête, sans payer de loyer.", en: "I didn't respond. My followers found it classy. {a.first}, frustrated, made three more videos about my silence. I live rent-free in {a:his|her} head." },
        fx: { karma: 3, followers: 3000, stress: -2 },
        mood: 'proud',
      },
    ],
  },
  {
    id: 't2_stalker_fan',
    icon: '🫣',
    cat: 'influencer',
    rating: 2,
    scene: { place: 'home', mood: 'shock' },
    when: { age: [18, 70], followers: [100000, 1e9] },
    actor: { create: { role: 'acquaintance', age: [-10, 10], gender: 'any' } },
    cooldown: 8,
    text: {
      fr: [
        "On sonne. Sur le paillasson : {a.first}, {a:un|une} abonné{a:|e}, avec ton visage tatoué sur tout le dos, un panier de muffins et un pot contenant « des cheveux de toi, ramassés à un meet-up ». {a:Il|Elle} veut juste « dire bonjour ».",
        "{a.first}, {a:ton|ta} fan numéro un, a loué l'appartement d'en face. Tu le sais parce qu'{a:il|elle} a collé « JE T'AIME {first} » en Post-it sur toute sa fenêtre. 1 400 Post-it. Elle brille la nuit.",
      ],
      en: [
        "Doorbell. On the mat: {a.first}, a follower, with your face tattooed across {a:his|her} whole back, a basket of muffins and a jar holding ‘your hair, collected at a meet-up’. {a:He|She} just wants to ‘say hi’.",
        "{a.first}, your number one fan, rented the apartment across the street. You know because {a.he} spelled ‘I LOVE YOU {first}’ in Post-its across the entire window. 1,400 Post-its. They glow at night.",
      ],
    },
    choices: [
      {
        label: { fr: 'Appeler la police', en: 'Call the police' },
        text: { fr: "J'ai appelé la police. Les flics sont arrivés, ont reconnu mon visage sur le dos de {a.first}, et ont demandé un selfie. Avec moi. Puis avec le dos. Ensuite seulement, ils l'ont emmené{a:|e}.", en: "I called the police. The cops showed up, recognized my face on {a.first}'s back, and asked for a selfie. With me. Then with the back. Only then did they take {a.him} away." },
        fx: { stress: -4, happy: 1, karma: 1 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Manger un muffin', en: 'Eat a muffin' },
        out: [
          { w: 1, text: { fr: "J'ai mangé un muffin, par politesse. Il était délicieux. J'ai demandé la recette. « Le secret, c'est une mèche de tes cheveux », a dit {a.first}. J'ai vomi sur le paillasson. {a:Il|Elle} a gardé le vomi.", en: "I ate a muffin, to be polite. It was delicious. I asked for the recipe. ‘The secret is a lock of your hair,’ said {a.first}. I threw up on the doormat. {a:He|She} kept the vomit." }, fx: { health: -4, happy: -8, stress: 8 }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai mangé un muffin et discuté dix minutes. {a.first} était juste seul{a:|e} et un peu intense. Je l'ai orienté{a:|e} vers un club de tricot. {a:Il|Elle} m'a tricoté un pull avec ma propre tête. C'est confortable.", en: "I ate a muffin and chatted for ten minutes. {a.first} was just lonely and a bit intense. I pointed {a.him} to a knitting club. {a:He|She} knitted me a sweater with my own face. It's comfy." }, fx: { happy: 4, karma: 3 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Déménager', en: 'Move' },
        text: { fr: "J'ai déménagé à l'autre bout du pays. Une semaine plus tard, un panier de muffins m'attendait devant la nouvelle porte. Avec un mot : « Bienvenue chez nous ».", en: "I moved across the country. A week later, a basket of muffins was waiting at my new door. With a note: ‘Welcome to our home.’" },
        fx: { money: -3000, stress: 10, happy: -6 },
        mood: 'shock',
      },
    ],
  },
  {
    id: 't2_mukbang',
    icon: '🍔',
    cat: 'influencer',
    rating: 2,
    scene: { place: 'studio', mood: 'sick' },
    when: { age: [18, 45] },
    cooldown: 6,
    text: {
      fr: [
        "Pour percer, tu lances un mukbang : 40 cheeseburgers, 3 litres de sauce fromage et un seau de nuggets, en direct, sans couper. Le chat parie sur la minute où tu vas craquer.",
        "Défi en live : manger 8 000 calories de restauration rapide en une heure. Un spectateur promet 500 € si tu termines par le milkshake géant de 2 litres.",
      ],
      en: [
        "To make it big, you launch a mukbang: 40 cheeseburgers, three quarts of cheese sauce and a bucket of nuggets, live, no cuts. Chat is betting on the minute you'll break.",
        "Live challenge: eat 8,000 calories of fast food in one hour. A viewer promises $500 if you finish with the two-quart giant milkshake.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout manger', en: 'Eat it all' },
        out: [
          { w: 2, text: { fr: "Burger 31 : mon corps a dit non. J'ai vomi en geyser sur la caméra, qui a continué de filmer à travers une couche de sauce fromage. 2 millions de vues. Le clip s'appelle « L'Éruption ».", en: "Burger 31: my body said no. I geyser-vomited onto the camera, which kept recording through a layer of cheese sauce. 2 million views. The clip is called ‘The Eruption’." }, fx: { followers: 20000, fame: 2, health: -8, weight: 0.03, happy: -2 }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai tout fini, milkshake compris. J'ai eu 500 € et je suis resté{|e} allongé{|e} sur le sol du studio pendant 9 heures, à transpirer du cheddar. Mon médecin a vu le live. Il m'a envoyé un message vocal de 4 minutes.", en: "I finished it all, milkshake included. Got the $500 and lay on the studio floor for nine hours, sweating cheddar. My doctor saw the stream. He sent me a four-minute voice note." }, fx: { money: 500, followers: 8000, health: -10, weight: 0.05 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Tricher avec un seau', en: 'Cheat with a bucket' },
        out: [
          { w: 1, text: { fr: "J'ai recraché discrètement dans un seau sous la table. Tout s'est bien passé jusqu'à ce que mon chat renverse le seau en plein live. Le contenu du seau a été vu par 60 000 personnes. Le chat aussi, couvert de burger mâché.", en: "I discreetly spat into a bucket under the table. It went fine until my cat knocked the bucket over live. 60,000 people saw what was inside. And the cat, covered in chewed burger." }, fx: { followers: -5000, happy: -6, karma: -2 }, mood: 'shock' },
          { w: 1, text: { fr: "Personne n'a rien vu. J'ai « mangé » 40 burgers et gagné 3 000 abonnés. Le seau, je l'ai donné au chien du voisin. Il m'aime maintenant plus que son maître.", en: "Nobody noticed. I ‘ate’ 40 burgers and gained 3,000 followers. I gave the bucket to the neighbor's dog. He loves me more than his owner now." }, fx: { followers: 3000, karma: -2, happy: 3 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Version salade', en: 'Salad version' },
        text: { fr: "J'ai fait un mukbang de 40 salades. Personne n'a regardé, sauf trois végans et un lapin. Je me sens en pleine forme et totalement inconnu{|e}.", en: "I did a 40-salad mukbang. Nobody watched except three vegans and a rabbit. I feel great and totally unknown." },
        fx: { health: 3, happy: -1, followers: 50 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 't2_pepper_challenge',
    icon: '🌶️',
    cat: 'influencer',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock', fx: 'fire' },
    when: { age: [18, 45] },
    once: true,
    text: {
      fr: [
        "Nouveau défi viral : manger le piment le plus fort du monde, entier, face caméra, sans boire. Le piment arrive dans un petit cercueil en carton avec une mise en garde en six langues et un dessin de tête de mort qui pleure.",
        "Ton pote te met au défi de manger le « Reaper », un piment qui a sa propre fiche Wikipédia et une rubrique « Décès ». Il a déjà lancé l'enregistrement.",
      ],
      en: [
        "New viral challenge: eat the world's hottest pepper, whole, on camera, no water. It arrives in a little cardboard coffin with a warning in six languages and a drawing of a crying skull.",
        "Your buddy dares you to eat the ‘Reaper’, a pepper with its own Wikipedia page and a ‘Deaths’ section. He's already hit record.",
      ],
    },
    choices: [
      {
        label: { fr: 'Croquer en entier', en: 'Eat it whole' },
        out: [
          { w: 3, text: { fr: "J'ai croqué. Mes yeux ont pleuré du feu, mes oreilles ont sifflé comme une cocotte-minute. J'ai roulé par terre en suppliant ma mère, qui n'était pas là. Le lendemain, aux toilettes, j'ai compris le mot « enfer ». 1,5 million de vues.", en: "I bit down. My eyes wept fire, my ears whistled like a pressure cooker. I rolled on the floor begging for my mom, who wasn't there. The next morning, on the toilet, I truly understood the word ‘hell’. 1.5 million views." }, fx: { followers: 15000, fame: 2, health: -8, happy: -3 }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai croqué et je me suis évanoui{|e} face contre la table. Je me suis réveillé{|e} à l'hôpital, avec un médecin qui avait vu la vidéo. « Vous avez un public », m'a-t-il dit en me tendant une perfusion de lait.", en: "I bit down and passed out face-first on the table. Woke up in the hospital with a doctor who'd seen the video. ‘You've got an audience,’ he said, hooking me up to an IV of milk." }, fx: { followers: 25000, health: -15, happy: -5 }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai croqué. Une chaleur infernale est montée de mon estomac. Mes cheveux ont pris feu, de la fumée est sortie de mes oreilles, et j'ai littéralement explosé comme un pétard du Nouvel An chinois, en direct. 80 millions de vues posthumes. Mon pote a monétisé.", en: "I bit down. Infernal heat rose from my stomach. My hair caught fire, smoke poured from my ears, and I literally exploded like a Chinese New Year firecracker, live. 80 million posthumous views. My buddy monetized it." }, fx: { die: { fr: 'auto-combusté{|e} en direct après avoir mangé le piment le plus fort du monde', en: "spontaneously combusted live after eating the world's hottest pepper" }, visual: 'fire' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Lécher seulement', en: 'Just lick it' },
        text: { fr: "J'ai léché le piment. Une seule fois. J'ai perdu la sensation de ma langue pendant deux jours et j'ai parlé comme un ventriloque. Le chat a hurlé « POULE MOUILLÉE ». Le chat avait raison.", en: "I licked the pepper. Once. I couldn't feel my tongue for two days and talked like a ventriloquist. Chat screamed ‘CHICKEN’. Chat was right." },
        fx: { health: -2, followers: 300, happy: -1 },
        mood: 'sick',
      },
      {
        label: { fr: 'Le faire manger au pote', en: 'Make the buddy eat it' },
        text: { fr: "J'ai retourné la caméra et le défi. Mon pote a croqué. Il a hurlé pendant 40 minutes et s'est assis dans la baignoire avec un litre de lait sur la tête. C'est la meilleure vidéo de ma chaîne. Il ne me parle plus.", en: "I flipped the camera and the dare. My buddy bit it. He screamed for 40 minutes and sat in the bathtub pouring a quart of milk over his head. Best video on my channel. He doesn't talk to me anymore." },
        fx: { followers: 9000, happy: 8, karma: -2 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 't2_onlyfans_offer',
    icon: '🔞',
    cat: 'influencer',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock' },
    when: { age: [18, 45], noFlag: 't2_of' },
    actor: 'anyFriend',
    once: true,
    text: {
      fr: [
        "Loyer en retard, compte à découvert. {a.first} te montre son relevé : 6 000 € le mois dernier sur une plateforme « pour adultes », juste en postant des photos de ses pieds dans des chaussettes de Noël. « Avec ta tête, tu ferais le double. »",
        "{a.first} a lancé son compte sur une plateforme coquine et s'est acheté une voiture en trois mois. {a:Il|Elle} te tend un ring light : « Je te prête mon matos. Commence par les pieds, tout le monde commence par les pieds. »",
      ],
      en: [
        "Rent's late, account's overdrawn. {a.first} shows you {a:his|her} statement: $6,000 last month on an ‘adult’ platform, just posting photos of {a:his|her} feet in Christmas socks. ‘With your face, you'd make double.’",
        "{a.first} started an account on a spicy subscription site and bought a car within three months. {a:He|She} hands you a ring light: ‘Borrow my gear. Start with feet, everyone starts with feet.’",
      ],
    },
    choices: [
      {
        label: { fr: 'Juste les pieds', en: 'Feet only' },
        out: [
          { w: 2, text: { fr: "J'ai posté mes pieds. Un abonné nommé « Dégustateur69 » m'a envoyé 300 € pour une photo de mes orteils dans du yaourt grec. J'ai payé mon loyer. Je ne mangerai plus jamais de yaourt grec.", en: "I posted my feet. A subscriber named ‘Connoisseur69’ sent me $300 for a photo of my toes in Greek yogurt. Rent paid. I will never eat Greek yogurt again." }, fx: { money: 1500, happy: 2, flag: 't2_of', schedule: { key: 't2_of_uncle', years: 1 } }, mood: 'shock' },
          { w: 1, text: { fr: "Il s'avère que j'ai des pieds très ordinaires. Trois abonnés, dont un qui me demande de couper mes ongles plus souvent. J'ai gagné 14 €. Un échec humiliant, même pour mes pieds.", en: "Turns out I have very ordinary feet. Three subscribers, one of whom asks me to cut my toenails more often. I made $14. A humiliating failure, even for my feet." }, fx: { money: 14, happy: -5 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Aller plus loin', en: 'Go further' },
        out: [
          { w: 2, text: { fr: "J'ai lancé un compte complet : lingerie, douches langoureuses, et une série culte où je fais la vaisselle en tablier, et seulement en tablier. 2 000 abonnés en un mois. J'ai remboursé mes dettes. Ma vaisselle n'a jamais été aussi propre.", en: "I went all in: lingerie, steamy showers, and a cult series where I do the dishes in an apron, and only an apron. 2,000 subscribers in a month. Debts paid off. My dishes have never been cleaner." }, fx: { money: 12000, happy: 6, followers: 5000, karma: -1, flag: 't2_of', schedule: { key: 't2_of_uncle', years: 1 } }, mood: 'proud' },
          { w: 1, text: { fr: "Premier shooting : je me suis cogné{|e} la tête dans le pommeau de douche, glissé{|e} sur le savon et fini{|e} les fesses en l'air, coincé{|e} dans la baignoire. Mon colocataire a dû me dégager. Il a vu tout le contenu gratuitement.", en: "First shoot: I hit my head on the shower head, slipped on the soap and ended up butt-up, wedged in the tub. My roommate had to pull me out. He saw all the content for free." }, fx: { health: -6, happy: -6, disease: 'concussion' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Refuser', en: 'Say no' },
        text: { fr: "J'ai refusé. {a.first} a haussé les épaules et est reparti{a:|e} dans sa voiture neuve. J'ai pris le bus pour aller à mon job à 9 € de l'heure. La dignité, ça ne paie pas le loyer, mais ça tient chaud.", en: "I said no. {a.first} shrugged and drove off in {a:his|her} new car. I took the bus to my $9-an-hour job. Dignity doesn't pay rent, but it keeps you warm." },
        fx: { karma: 2, happy: -2 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 't2_of_uncle',
    icon: '😱',
    cat: 'influencer',
    rating: 2,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock' },
    when: { age: [18, 50], flag: 't2_of' },
    text: {
      fr: [
        "Repas de famille. Ton oncle Gérard, entre le fromage et le dessert, te fait un clin d'œil appuyé et murmure : « Joli tablier. » Tu viens de comprendre qui est ton abonné numéro 1.",
        "Ta grand-mère te prend à part à son anniversaire : « Ton cousin Kévin dépense tout son argent sur un site. Il dit que c'est pour “soutenir la famille”. Tu sais de quoi il parle ? »",
      ],
      en: [
        "Family dinner. Between cheese and dessert, your Uncle Gerald gives you a heavy wink and murmurs: ‘Nice apron.’ You've just figured out who your number one subscriber is.",
        "Grandma pulls you aside at her birthday: ‘Your cousin Kevin spends all his money on some website. He says it's to “support the family”. Do you know what he means?’",
      ],
    },
    choices: [
      {
        label: { fr: 'Bloquer et nier', en: 'Block and deny' },
        text: { fr: "Je l'ai bloqué depuis les toilettes du restaurant, entre deux sanglots. Puis je suis revenu{|e} à table et j'ai mangé ma tarte Tatin en le fixant. Il a remboursé tous ses abonnements. C'était ma meilleure source de revenus.", en: "I blocked him from the restaurant bathroom, between sobs. Then I came back to the table and ate my apple tart staring at him. He got refunds on every subscription. He was my best source of income." },
        fx: { happy: -8, money: -1500, stress: 8, unflag: 't2_of' },
        mood: 'cry',
      },
      {
        label: { fr: 'Le faire chanter', en: 'Blackmail him' },
        text: { fr: "J'ai envoyé un message : « Je dis rien à Tante Monique si tu doubles ton abonnement. » Il a triplé. Le secret familial le mieux gardé de France est désormais rentable.", en: "I texted: ‘I won't tell Aunt Monica if you double your subscription.’ He tripled it. The best-kept family secret in the country is now profitable." },
        fx: { money: 3000, karma: -5, happy: 2 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Tout arrêter', en: 'Quit for good' },
        text: { fr: "J'ai fermé le compte le soir même. J'ai fait une retraite dans un monastère pour oublier le clin d'œil. Les moines aussi m'ont reconnu{|e}. L'un d'eux a dit « joli tablier ».", en: "I shut down the account that night and went on a monastery retreat to forget the wink. The monks recognized me too. One of them said ‘nice apron’." },
        fx: { happy: -4, karma: 2, stress: -3, unflag: 't2_of' },
        mood: 'shock',
      },
    ],
  },
  {
    id: 't2_reality_casting',
    icon: '🏝️',
    cat: 'influencer',
    rating: 2,
    scene: { place: 'studio', mood: 'happy' },
    when: { age: [18, 35], stat: { looks: [55, 100] } },
    once: true,
    weight: 6,
    text: {
      fr: [
        "Un directeur de casting t'aborde dans la rue : « Tu as exactement la tête qu'on cherche. » Pour quoi ? « Les Tentations de l'Île », une télé-réalité où 12 célibataires sont enfermés sur une île avec des caméras jusque dans les douches. Et pas d'eau potable.",
        "Ton profil a été repéré pour « Love Bunker », une émission où des célibataires vivent dans un abri antiatomique de luxe. Le casting demande : « Es-tu prêt{|e} à pleurer sur commande, à te battre pour un lit et à embrasser un inconnu dans un jacuzzi ? »",
      ],
      en: [
        "A casting director stops you on the street: ‘You have exactly the face we're looking for.’ For what? ‘Temptation Isle’, a reality show where 12 singles are locked on an island with cameras even in the showers. And no drinking water.",
        "Your profile got picked for ‘Love Bunker’, a show where singles live in a luxury fallout shelter. The casting form asks: ‘Are you ready to cry on command, fight over a bed and kiss a stranger in a hot tub?’",
      ],
    },
    choices: [
      {
        label: { fr: 'Signer le contrat', en: 'Sign the contract' },
        text: { fr: "J'ai signé un contrat de 84 pages sans lire. Clause 37 : la production possède mon image « dans cet univers et les univers parallèles ». Départ demain. J'ai pris trois maillots et zéro dignité.", en: "I signed an 84-page contract without reading it. Clause 37: the producers own my likeness ‘in this universe and any parallel ones’. Leaving tomorrow. Packed three swimsuits and zero dignity." },
        fx: { happy: 6, fame: 3, chain: 't2_reality_island' },
        mood: 'party',
      },
      {
        label: { fr: 'Refuser', en: 'Decline' },
        text: { fr: "J'ai refusé. Six mois plus tard, l'émission a cartonné et le gagnant a vendu ses chaussettes pour 4 000 € pièce. J'ai regardé chaque épisode, en mangeant des chips, en me sentant à la fois supérieur{|e} et pauvre.", en: "I said no. Six months later the show was a hit and the winner sold his socks for $4,000 a pair. I watched every episode, eating chips, feeling both superior and poor." },
        fx: { happy: -2, karma: 1 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 't2_reality_island',
    icon: '🎥',
    cat: 'influencer',
    rating: 2,
    chainOnly: true,
    scene: { place: 'beach', mood: 'party' },
    when: { age: [18, 35] },
    actor: { create: { role: 'acquaintance', age: [-3, 5], gender: 'attracted' } },
    text: {
      fr: ["Jour 3 sur l'île. Le jacuzzi est trouble, quelqu'un a pleuré dans la cuisine, et {a.first}, l'ex-mannequin {a:musclé|bronzée} qui dit « en vrai » à chaque phrase, te fait les yeux doux. La production te souffle : « Il nous faut un moment fort ce soir. »"],
      en: ["Day 3 on the island. The hot tub is murky, someone cried in the kitchen, and {a.first}, the {a:ripped|bronzed} ex-model who says ‘literally’ in every sentence, is making eyes at you. A producer whispers: ‘We need a big moment tonight.’"],
    },
    choices: [
      {
        label: { fr: 'Jacuzzi avec {a.first}', en: 'Hot tub with {a.first}' },
        out: [
          { w: 2, text: { fr: "Jacuzzi avec {a.first}. Les bulles ont fait leur travail, la caméra infrarouge aussi. La scène a été diffusée en prime time avec un flou artistique qui ne cachait rien. Je suis le couple préféré du pays. Ma grand-mère a fait une syncope.", en: "Hot tub with {a.first}. The bubbles did their job, and so did the infrared camera. The scene aired in prime time with a ‘tasteful’ blur that hid nothing. We're the nation's favorite couple. My grandma fainted." }, fx: { followers: 120000, fame: 8, happy: 10, rel: 30, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "Jacuzzi avec {a.first}. Au bout de dix minutes, on a tous les deux eu une infection, l'eau n'avait pas été changée depuis la saison 2. J'ai été évacué{|e} en hélicoptère, en serviette. Audience record.", en: "Hot tub with {a.first}. Ten minutes in, we both caught an infection; the water hadn't been changed since season 2. I was airlifted out in a towel. Record ratings." }, fx: { followers: 60000, fame: 5, health: -8, disease: 'std' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Clash dans la cuisine', en: 'Kitchen meltdown' },
        text: { fr: "J'ai déclenché un clash monumental pour une histoire de yaourt volé. J'ai hurlé « T'ES QU'UNE SALE TRUFFE SANS ÂME » en jetant une assiette de pâtes. La phrase est devenue un son viral. J'ai été éliminé{|e}, mais je fais des apparitions en boîte de nuit à 5 000 € la soirée.", en: "I started a legendary fight over a stolen yogurt. I screamed ‘YOU SOULLESS DAMP TRUFFLE’ while hurling a plate of pasta. The line became a viral sound. I got eliminated, but now I do nightclub appearances for $5,000 a night." },
        fx: { followers: 90000, fame: 6, money: 15000, karma: -3 },
        mood: 'angry',
      },
      {
        label: { fr: 'Jouer le stratège', en: 'Play the strategist' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai manipulé tout le monde avec la froideur d'un joueur d'échecs, en ne portant qu'un string. J'ai gagné l'émission et 50 000 €. Le public me déteste, mais il me regarde.", en: "I manipulated everyone with the cold precision of a chess player, while wearing only a thong. I won the show and $50,000. The public hates me, but they watch me." }, fx: { money: 50000, followers: 150000, fame: 8, karma: -5 }, mood: 'proud' },
          { w: 1, text: { fr: "Mon plan était trop subtil. Personne ne l'a compris, pas même moi. J'ai été éliminé{|e} le jour 4 pour « manque de contenu ». J'ai passé le reste du séjour dans un hôtel 2 étoiles avec les autres éliminés, à boire du rosé tiède.", en: "My plan was too subtle. Nobody understood it, not even me. I got eliminated on day 4 for ‘lack of content’. I spent the rest of the trip in a two-star hotel with the other rejects, drinking warm rosé." }, fx: { followers: 5000, happy: -6 }, mood: 'sad' },
        ],
      },
    ],
  },

  // ───────── trolls, scams, deepfakes ─────────
  {
    id: 't2_troll_feud',
    icon: '🧌',
    cat: 'social',
    rating: 2,
    scene: { place: 'apartment', mood: 'angry' },
    when: { age: [18, 70] },
    cooldown: 6,
    text: {
      fr: [
        "Un troll, @VraiPatriote_1964, commente chacune de tes publications depuis deux mois : « T'as une tronche de cul de babouin », « Même ton chat a honte ». Il est actif à 3 h, à 7 h et pendant les heures de bureau.",
        "Quelqu'un a écrit 47 avis une étoile sur ta page professionnelle, tous signés « Un client mécontent ». Tu n'as pas de clients. Tu fais du tricot. Le dernier avis dit : « Ses moufles puent la défaite. »",
      ],
      en: [
        "A troll, @RealPatriot_1964, has commented on every post you've made for two months: ‘You've got a face like a baboon's ass’, ‘Even your cat is embarrassed’. He's active at 3 a.m., 7 a.m. and during business hours.",
        "Someone wrote 47 one-star reviews on your business page, all signed ‘An unhappy customer’. You don't have customers. You knit. The latest review says: ‘These mittens reek of defeat.’",
      ],
    },
    choices: [
      {
        label: { fr: 'Démasquer le troll', en: 'Unmask the troll' },
        out: [
          { w: 1, text: { fr: "J'ai remonté la piste grâce à une faute d'orthographe récurrente (« sa ce voit »). C'était mon voisin du dessous, Bernard, 61 ans, qui m'en veut pour mes talons. Je l'ai salué dans l'escalier : « Bonjour, cul de babouin. » Il a blêmi.", en: "I traced him through a recurring typo (‘your an idiot’). It was my downstairs neighbor, Bernard, 61, who hates my heels on the floor. I greeted him on the stairs: ‘Morning, baboon-butt.’ He turned white." }, fx: { happy: 10, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai démasqué le troll : c'était mon propre père, qui « voulait m'endurcir ». Il m'a fait des excuses à Noël, puis a liké son propre commentaire depuis un autre compte, devant moi.", en: "I unmasked the troll: it was my own dad, who ‘wanted to toughen me up’. He apologized at Christmas, then liked his own comment from another account, right in front of me." }, fx: { happy: -6, stress: 5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Troller le troll', en: 'Troll the troll' },
        text: { fr: "Je lui ai répondu sous chaque commentaire par une recette de gratin dauphinois, toujours la même, pendant trois mois. Il a craqué : « ARRÊTE AVEC TON GRATIN, CONNARD ». J'ai gagné. Et j'ai très faim.", en: "I replied to every comment with the same scalloped potatoes recipe, for three months. He cracked: ‘STOP WITH THE FUCKING POTATOES’. I won. And I'm very hungry." },
        fx: { happy: 8, followers: 1500, stress: -3 },
        mood: 'happy',
      },
      {
        label: { fr: 'Bloquer et respirer', en: 'Block and breathe' },
        text: { fr: "Je l'ai bloqué. Il a créé 14 nouveaux comptes. Je les ai bloqués aussi. On est maintenant dans une relation de blocage mutuel, plus stable que la plupart de mes histoires d'amour.", en: "I blocked him. He made 14 new accounts. I blocked those too. We're now in a mutual blocking relationship, more stable than most of my love life." },
        fx: { stress: -2, happy: 1 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 't2_review_bomb',
    icon: '⭐',
    cat: 'social',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock' },
    when: { age: [18, 70] },
    cooldown: 6,
    text: {
      fr: [
        "Tu as laissé un avis une étoile à un kebab : « Sauce blanche tiède, frites molles, le patron sent le pied. » Le patron a répondu publiquement : « Ce client commande 3 kebabs à 4 h du mat' chaque samedi, toujours en pleurs, en chaussettes. On l'aime bien quand même. »",
      ],
      en: [
        "You left a kebab shop a one-star review: ‘Lukewarm sauce, soggy fries, owner smells like feet.’ The owner replied publicly: ‘This customer orders 3 kebabs at 4 a.m. every Saturday, always crying, in socks. We still love him.’",
      ],
    },
    choices: [
      {
        label: { fr: 'Contre-répondre', en: 'Fire back' },
        out: [
          { w: 1, text: { fr: "J'ai répondu : « Au moins mes chaussettes sont propres, gros dégueulasse. » Il a posté une photo de mes chaussettes, prise par la caméra de surveillance. Elles ne sont pas propres. 200 000 personnes peuvent en témoigner.", en: "I replied: ‘At least my socks are clean, you greasy slob.’ He posted a photo of my socks from the security camera. They are not clean. 200,000 people can confirm." }, fx: { happy: -7, followers: 3000, fame: 1 }, mood: 'cry' },
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai répondu avec une telle éloquence que le restaurant a offert un menu à mon nom : « Le Ronchon », avec une sauce tiède garantie. Je mange gratuitement à vie. Je pleure toujours en chaussettes, mais en VIP.", en: "I replied so eloquently that the restaurant named a menu item after me: ‘The Grouch’, guaranteed lukewarm sauce. I eat free for life. I still cry in socks, but as a VIP." }, fx: { happy: 9, followers: 5000, fame: 2 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Supprimer l’avis', en: 'Delete the review' },
        text: { fr: "J'ai supprimé mon avis et je suis allé{|e} m'excuser en personne, avec un bouquet. Le patron m'a offert un kebab. Il était vraiment tiède. Je n'ai rien dit. On est amis maintenant.", en: "I deleted the review and went to apologize in person, with flowers. The owner gave me a free kebab. It really was lukewarm. I said nothing. We're friends now." },
        fx: { karma: 4, happy: 3 },
        mood: 'happy',
      },
      {
        label: { fr: 'Changer de quartier', en: 'Move neighborhoods' },
        text: { fr: "J'ai changé de kebab, de quartier et de compte. Le nouveau kebab m'a reconnu{|e} dès la première commande. « Ah, c'est toi, le Pleureur-en-Chaussettes ! » Internet n'oublie rien.", en: "I changed kebab shops, neighborhoods and accounts. The new place recognized me on my first order. ‘Hey, it's the Sock Crier!’ The internet never forgets." },
        fx: { happy: -3, stress: 3 },
        mood: 'sad',
      },
    ],
  },
  {
    id: 't2_seed_phrase',
    icon: '🔑',
    cat: 'social',
    rating: 2,
    scene: { place: 'apartment', mood: 'cry' },
    when: { age: [18, 50], era: [2015, 2100] },
    vars: { amount: [20000, 200000] },
    once: true,
    text: {
      fr: [
        "Le jeton pourri que tu as acheté pour 30 € en rigolant, le $CACAPIGEON, vient de faire x5000. Ton portefeuille vaut {$amount}. Problème : tu as noté ta phrase secrète sur un carton de pizza. Que ton coloc a jeté. Mardi.",
      ],
      en: [
        "The garbage token you bought for $30 as a joke, $PIGEONPOOP, just went up 5,000x. Your wallet is worth {$amount}. Problem: you wrote your seed phrase on a pizza box. Which your roommate threw out. On Tuesday.",
      ],
    },
    choices: [
      {
        label: { fr: 'Fouiller la décharge', en: 'Search the dump' },
        out: [
          { w: 1, text: { fr: "J'ai passé quatre jours à la décharge, en combinaison, à ouvrir des cartons de pizza. J'ai trouvé le bon : taché de sauce, mais lisible. J'ai encaissé {$amount}. Je sens le fromage moisi pour toujours, mais je suis riche, bordel.", en: "I spent four days at the dump in a hazmat suit, opening pizza boxes. Found it: sauce-stained but legible. Cashed out {$amount}. I'll smell like moldy cheese forever, but I'm fucking rich." }, fx: { money: 'amount', happy: 15, health: -4, visual: 'money' }, mood: 'proud' },
          { w: 2, text: { fr: "Quatre jours à la décharge. J'ai trouvé 2 000 cartons de pizza, un chat vivant, un dentier et une couche usagée qui s'est collée à ma joue pendant une heure sans que je le remarque. Pas ma phrase secrète. Le $CACAPIGEON s'est effondré le cinquième jour. J'ai adopté le chat.", en: "Four days at the dump. I found 2,000 pizza boxes, a live cat, a set of dentures and a used diaper that stayed stuck to my cheek for an hour before I noticed. Not my seed phrase. $PIGEONPOOP crashed on day five. I adopted the cat." }, fx: { happy: -8, health: -3, newNpc: { role: 'pet', species: 'cat' } }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Retrouver de mémoire', en: 'Recall it from memory' },
        out: [
          { w: 1, text: { fr: "J'ai fermé les yeux et récité les 12 mots de mémoire : « kebab, pigeon, licorne… ». Ça a marché. J'ai hurlé si fort que les voisins ont appelé les pompiers. {$amount}, merci mon cerveau, t'es un génie de merde.", en: "I closed my eyes and recited the 12 words from memory: ‘kebab, pigeon, unicorn…’. It worked. I screamed so loud the neighbors called the fire department. {$amount}. Thank you, brain, you glorious idiot." }, fx: { money: 'amount', happy: 15, visual: 'money' }, mood: 'party' },
          { w: 3, text: { fr: "Je me suis souvenu{|e} de 11 mots sur 12. Le portefeuille est perdu à jamais. J'ai encadré un carton de pizza vide au-dessus de mon lit, comme une relique de ma propre bêtise.", en: "I remembered 11 words out of 12. The wallet is lost forever. I framed an empty pizza box above my bed, a relic of my own stupidity." }, fx: { happy: -10, stress: 6 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Accuser le coloc', en: 'Blame the roommate' },
        text: { fr: "J'ai passé une semaine à crier sur mon coloc. Il m'a rappelé que c'est moi qui avais utilisé le carton comme dessous-de-plat pour une raclette. Il avait raison. Je suis seul{|e} avec ma honte, et un dessous-de-plat en moins.", en: "I spent a week yelling at my roommate. He reminded me that I was the one who used the box as a trivet for a cheese fondue. He was right. I'm alone with my shame, minus one trivet." },
        fx: { happy: -6, karma: -1 },
        mood: 'angry',
      },
    ],
  },
  {
    id: 't2_deepfake',
    icon: '🎭',
    cat: 'social',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock' },
    when: { age: [18, 70], era: [2019, 2100] },
    cooldown: 8,
    text: {
      fr: [
        "Une vidéo circule : toi, en costume de dinosaure, vantant une crème contre les hémorroïdes en dansant et en chantant « Fini le feu aux fesses, gros zizi ! ». Ce n'est pas toi. C'est un deepfake. Mais c'est très bien fait, et ta voix est parfaite.",
      ],
      en: [
        "A video is going around: you, in a dinosaur costume, dancing and promoting a hemorrhoid cream while singing ‘No more fire down there, big boy!’. It's not you. It's a deepfake. But it's very well made, and your voice is perfect.",
      ],
    },
    choices: [
      {
        label: { fr: 'Porter plainte', en: 'File a complaint' },
        text: { fr: "J'ai porté plainte. Le policier a regardé la vidéo cinq fois « pour l'enquête », en riant de plus en plus. Il m'a demandé si je pouvais refaire la danse en vrai. Dossier classé.", en: "I filed a complaint. The officer watched the video five times ‘for the investigation’, laughing harder each time. He asked if I could do the dance for real. Case closed." },
        fx: { happy: -5, stress: 4 },
        mood: 'angry',
      },
      {
        label: { fr: 'Contacter la marque', en: 'Call the brand' },
        out: [
          { w: 1, text: { fr: "J'ai appelé la marque de crème pour exiger le retrait. Ils m'ont proposé un vrai contrat. J'ai accepté. Je suis officiellement le visage national des hémorroïdes. Ma mère est fière, à sa manière.", en: "I called the cream company to demand a takedown. They offered me a real contract. I accepted. I'm officially the national face of hemorrhoids. My mom is proud, in her way." }, fx: { money: 8000, fame: 3, happy: 2, followers: 10000 }, mood: 'neutral' },
          { w: 1, text: { fr: "La marque n'existait pas. C'était une arnaque. En revanche, j'ai reçu 300 messages de gens qui voulaient « le lien pour la crème ». Le monde souffre en silence.", en: "The company didn't exist. It was a scam. But I got 300 messages from people asking for ‘the link to the cream’. The world suffers in silence." }, fx: { happy: -3, karma: 1 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire un deepfake vengeur', en: 'Revenge deepfake' },
        text: { fr: "J'ai répondu avec un deepfake du créateur de la vidéo, déguisé en Teletubby, avouant qu'il fait pipi assis en pleurant. Personne ne savait plus ce qui était vrai. Internet a implosé. Moi, je me sens vivant{|e}.", en: "I fired back with a deepfake of the creator, dressed as a Teletubby, confessing he pees sitting down while crying. Nobody knew what was real anymore. The internet imploded. I feel alive." },
        fx: { happy: 7, karma: -2, followers: 4000 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 't2_doxxed',
    icon: '🍕',
    cat: 'social',
    rating: 2,
    scene: { place: 'home', mood: 'shock' },
    when: { age: [18, 70], movedOut: true },
    cooldown: 8,
    text: {
      fr: [
        "Après un débat enflammé en ligne sur la meilleure façon de cuire les pâtes, quelqu'un a publié ton adresse. Depuis ce matin : 47 pizzas livrées, un camion de sable, un clown, et un type en costume de mascotte qui se branle sur ton paillasson... non, il fait juste des étirements. Ouf. Dans la boîte aux lettres : un poisson mort et une poupée gonflable à ton effigie, signée « Bisous, Internet ».",
      ],
      en: [
        "After a heated online debate about the right way to cook pasta, someone posted your address. Since this morning: 47 pizzas delivered, a truckload of sand, a clown, and a guy in a mascot suit humping your doormat... no, he's just stretching. Phew. In the mailbox: a dead fish and an inflatable doll in your likeness, signed ‘Kisses, the Internet’.",
      ],
    },
    choices: [
      {
        label: { fr: 'Manger les pizzas', en: 'Eat the pizzas' },
        text: { fr: "J'ai refusé de payer, mais les livreurs les ont laissées quand même. J'ai mangé des pizzas pendant 11 jours et organisé une fête de quartier. Le clown a fait l'animation. Mes harceleurs ont abandonné, déroutés.", en: "I refused to pay, but the drivers left them anyway. I ate pizza for 11 days and threw a block party. The clown did the entertainment. My harassers gave up, confused." },
        fx: { happy: 6, weight: 0.03, health: -2 },
        mood: 'party',
      },
      {
        label: { fr: 'Déménager en urgence', en: 'Move out fast' },
        text: { fr: "J'ai déménagé dans un studio sous un faux nom, « Jean-Michel Pâtes ». La gardienne m'appelle Monsieur Pâtes. J'ai gardé la poupée à mon effigie. Elle me tient compagnie. C'est triste, je sais.", en: "I moved into a studio under a fake name, ‘John Pasta’. The building manager calls me Mr. Pasta. I kept the inflatable doll of me. It keeps me company. It's sad, I know." },
        fx: { money: -2500, stress: -6, happy: -3 },
        mood: 'sad',
      },
      {
        label: { fr: 'Faire un live', en: 'Go live about it' },
        out: [
          { w: 1, text: { fr: "J'ai fait un live en déballant chaque colis. Le poisson mort a fait exploser l'audience. Une marque de surgelés m'a sponsorisé{|e}. Mes harceleurs sont devenus mes abonnés. Internet est un endroit malade.", en: "I went live unboxing every package. The dead fish broke the viewer count. A frozen food brand sponsored me. My harassers became my followers. The internet is a sick place." }, fx: { followers: 30000, money: 2000, fame: 3, happy: 5 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai fait un live. Ça a énervé les harceleurs. Le lendemain, un deuxième camion de sable. Puis un troisième. J'ai maintenant une plage dans mon jardin. Je me suis mis{|e} au beach-volley, par défaut.", en: "I went live. It enraged the harassers. Next day, a second truckload of sand. Then a third. I now have a beach in my yard. I took up beach volleyball, by default." }, fx: { stress: 8, happy: -2, athletic: 2 }, mood: 'shock' },
        ],
      },
    ],
  },

  // ───────── dating apps & hookups ─────────
  {
    id: 't2_filter_date',
    icon: '📸',
    cat: 'social',
    rating: 1,
    scene: { place: 'park', mood: 'shock' },
    when: { age: [18, 50], noHas: 'spouse' },
    actor: { create: { role: 'acquaintance', age: [-4, 4], gender: 'attracted' } },
    cooldown: 5,
    text: {
      fr: [
        "Premier rendez-vous avec {a.first}, rencontré{a:|e} sur une appli. Problème : sur tes photos, tu as utilisé un filtre « peau de bébé + mâchoire de statue grecque ». {a.first} est devant toi et ne te reconnaît pas. {a:Il|Elle} regarde sa montre.",
        "Tu attends ton match {a.first} au café. La personne qui s'assoit en face ressemble à ses photos, mais en version « fond de tiroir » : 15 ans de plus, une moustache, et ce qui ressemble à un bracelet électronique.",
      ],
      en: [
        "First date with {a.first}, a dating app match. Problem: in your photos you used a ‘baby skin + Greek statue jawline’ filter. {a.first} is standing right in front of you and doesn't recognize you. {a:He|She} checks {a:his|her} watch.",
        "You're waiting for your match {a.first} at the café. The person who sits down looks like {a:his|her} photos, in a ‘bottom of the drawer’ edition: fifteen years older, a mustache, and what looks like an ankle monitor.",
      ],
    },
    choices: [
      {
        label: { fr: 'Se présenter', en: 'Introduce myself' },
        out: [
          { w: 1, odds: { looks: 1 }, text: { fr: "Je me suis présenté{|e}. {a.first} a ri : « Ah ouais, gros filtre. Moi aussi, regarde. » On a comparé nos vraies têtes en riant. On se revoit samedi, sans filtre.", en: "I introduced myself. {a.first} laughed: ‘Wow, heavy filter. Me too, look.’ We compared our real faces, laughing. We're meeting again Saturday, unfiltered." }, fx: { happy: 10, rel: 25, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: "« Ah. » C'est tout ce qu'{a:il|elle} a dit. Puis {a:il|elle} a reçu un « appel urgent » d'une voix très fausse et a disparu. J'ai fini son café. Il était bon, au moins.", en: "‘Oh.’ That's all {a.he} said. Then {a.he} got an ‘urgent call’ in a very fake voice and vanished. I finished {a:his|her} coffee. It was good, at least." }, fx: { happy: -8, looks: -1 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Fuir discrètement', en: 'Sneak away' },
        text: { fr: "Je suis parti{|e} en rasant les murs et j'ai envoyé « Désolé{|e}, empêchement ! ». {a.first} a répondu : « Je t'ai vu{|e} partir. T'as un manteau orange. » Je l'ai bloqué{a:|e}. J'ai jeté le manteau.", en: "I slipped out along the wall and texted ‘Sorry, something came up!’. {a.first} replied: ‘I saw you leave. You're wearing an orange coat.’ I blocked {a.him}. I threw out the coat." },
        fx: { happy: -3, karma: -2 },
        mood: 'shock',
      },
      {
        label: { fr: 'Jouer {le frère|la sœur}', en: 'Play my own twin' },
        text: { fr: "J'ai dit être {le frère|la sœur} de la personne sur les photos, venu{|e} prévenir qu'elle était malade. {a.first} m'a payé un verre pour se consoler. On a passé une super soirée. Je dois maintenant entretenir un mensonge familial.", en: "I said I was the sibling of the person in the photos, here to say they were sick. {a.first} bought me a drink to cope. We had a great night. I now have to maintain a family lie." },
        fx: { happy: 5, karma: -3, rel: 10, keep: true },
        mood: 'happy',
      },
    ],
  },
  {
    id: 't2_match_boss',
    icon: '😬',
    cat: 'social',
    rating: 2,
    scene: { place: 'office', mood: 'shock' },
    when: { age: [20, 55], job: true },
    actor: 'boss',
    once: true,
    text: {
      fr: [
        "Tu swipes à droite par réflexe sur un profil torse nu, photographié devant un voilier. C'est un match. Tu regardes mieux : c'est {a.first}, ton boss. Sa bio : « Fun, coquin{a:|e}, aime le contrôle ». Lundi, réunion à 9 h avec {a:lui|elle}.",
        "Sur l'appli de rencontres, ton boss {a.first} t'envoie un premier message : « Tiens tiens... » suivi d'un emoji aubergine. Tu as son bureau en face du tien. Il est 23 h.",
      ],
      en: [
        "You reflexively swipe right on a shirtless profile posing in front of a sailboat. It's a match. You look closer: it's {a.first}, your boss. Bio: ‘Fun, naughty, likes to be in control’. Monday, 9 a.m. meeting with {a.him}.",
        "On the dating app, your boss {a.first} sends you an opener: ‘Well, well...’ followed by an eggplant emoji. {a:His|Her} office is right across from yours. It's 11 p.m.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire comme si de rien', en: 'Pretend nothing happened' },
        text: { fr: "Lundi, réunion de 9 h. On ne s'est pas regardés une seule fois en 45 minutes. {a.first} a dit « on va pénétrer de nouveaux marchés » et quelqu'un a toussé. Je suis mort{|e} intérieurement.", en: "Monday, 9 a.m. meeting. We didn't look at each other once in 45 minutes. {a.first} said ‘we need to penetrate new markets’ and someone coughed. I died inside." },
        fx: { stress: 8, happy: -3 },
        mood: 'shock',
      },
      {
        label: { fr: 'Répondre à l’aubergine', en: 'Answer the eggplant' },
        out: [
          { w: 1, text: { fr: "J'ai répondu par un emoji pêche. Une semaine plus tard, on se retrouvait dans la réserve du 3e étage pendant la pause déjeuner. Les cartons de ramettes ne parleront jamais. Mais j'ai eu une prime.", en: "I replied with a peach emoji. A week later we were meeting in the third-floor supply room at lunch. The boxes of printer paper will never talk. But I got a bonus." }, fx: { happy: 8, perf: 10, money: 1500, karma: -2 }, mood: 'love' },
          { w: 1, text: { fr: "J'ai répondu. Le message a été envoyé... dans le groupe de travail, à cause d'une notification. 34 collègues ont vu l'aubergine, la pêche et la goutte d'eau. Ressources humaines, 14 h. Licencié{|e}, avec une anecdote pour la vie.", en: "I replied. The message went... to the work group chat, because of a notification mix-up. 34 coworkers saw the eggplant, the peach and the water drops. HR at 2 p.m. Fired, with a story for life." }, fx: { fired: true, happy: -10, stress: 10 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Demander une augmentation', en: 'Ask for a raise' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "Lundi, j'ai glissé dans la conversation : « Joli voilier. » Puis : « Au fait, mon augmentation ? » {a.first} a signé le papier sans le lire, en sueur. La diplomatie moderne.", en: "Monday, I casually dropped: ‘Nice sailboat.’ Then: ‘By the way, about my raise?’ {a.first} signed the form without reading it, sweating. Modern diplomacy." }, fx: { money: 3000, perf: 5, karma: -3, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "{a.first} m'a regardé{|e} droit dans les yeux et a dit : « J'ai des captures de TON profil aussi. Celui avec la photo dans le jacuzzi. » Match nul. On n'en parle plus jamais.", en: "{a.first} looked me dead in the eye and said: ‘I have screenshots of YOUR profile too. The one with the hot tub photo.’ Stalemate. We never speak of it again." }, fx: { stress: 6, happy: -2 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 't2_app_hookup',
    icon: '🍆',
    cat: 'party',
    rating: 2,
    scene: { place: 'apartment', mood: 'love' },
    when: { age: [18, 50], noHas: 'spouse' },
    actor: { create: { role: 'acquaintance', age: [-5, 5], gender: 'attracted' } },
    cooldown: 4,
    text: {
      fr: [
        "1 h 12 du matin. Ton match {a.first} écrit : « Tu viens regarder un film ? » Petit détail : {a:il|elle} n'a ni télé, ni ordi, ni film. {a:Il|Elle} a juste un matelas par terre et une bougie parfumée « Nuit sauvage ».",
        "{a.first}, rencontré{a:|e} sur une appli il y a 40 minutes, propose de « passer » chez toi. Sa seule photo de profil est floue, prise dans un ascenseur, avec un chat sur l'épaule.",
      ],
      en: [
        "1:12 a.m. Your match {a.first} texts: ‘Wanna come over and watch a movie?’ Small detail: {a.he} has no TV, no laptop and no movie. Just a mattress on the floor and a ‘Wild Night’ scented candle.",
        "{a.first}, matched on an app 40 minutes ago, offers to ‘swing by’ your place. {a:His|Her} only profile picture is blurry, taken in an elevator, with a cat on {a:his|her} shoulder.",
      ],
    },
    choices: [
      {
        label: { fr: 'Y aller', en: 'Go for it' },
        out: [
          { w: 2, text: { fr: "J'y suis allé{|e}. Pas de film, en effet. La bougie « Nuit sauvage » a tenu ses promesses, le matelas un peu moins. Les voisins ont tapé au plafond deux fois. Je suis reparti{|e} à 4 h, sans une chaussette et avec un sourire niais.", en: "I went. No movie, indeed. The ‘Wild Night’ candle delivered, the mattress less so. The neighbors banged on the ceiling twice. I left at 4 a.m. minus one sock, grinning like an idiot." }, fx: { happy: 12, stress: -6 }, mood: 'love' },
          { w: 1, text: { fr: "Moment torride interrompu par la bougie, qui a mis le feu au rideau. On a fini la nuit en sous-vêtements, sur le trottoir, avec les pompiers. Un pompier m'a laissé son numéro. La nuit n'était donc pas perdue.", en: "A steamy moment interrupted by the candle setting the curtain on fire. We spent the rest of the night in our underwear on the sidewalk with the fire department. A firefighter left me his number. So the night wasn't wasted." }, fx: { happy: 4, health: -2, visual: 'fire' }, mood: 'shock' },
          { w: 1, text: { fr: "Bonne nuit, mauvaise surprise : deux semaines plus tard, une démangeaison très localisée. Le médecin a soupiré « encore une appli ? ». La bougie, elle, était innocente.", en: "Good night, bad surprise: two weeks later, a very localized itch. The doctor sighed, ‘Another app?’ The candle, at least, was innocent." }, fx: { happy: 2, disease: 'std' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Exiger un vrai film', en: 'Demand an actual movie' },
        text: { fr: "J'ai exigé un vrai film. {a.first} a sorti son téléphone, écran fissuré, et lancé un documentaire sur les pingouins. Deux heures de pingouins. Je n'ai jamais été aussi frustré{|e} ni aussi bien renseigné{|e} sur l'Antarctique.", en: "I demanded an actual movie. {a.first} pulled out a cracked phone and put on a penguin documentary. Two hours of penguins. I've never been so frustrated, or so well informed about Antarctica." },
        fx: { smarts: 2, happy: -2 },
        mood: 'sleepy',
      },
      {
        label: { fr: 'Dormir, plutôt', en: 'Sleep instead' },
        text: { fr: "J'ai répondu « bonne nuit » et j'ai dormi 9 heures. Le lendemain, {a.first} avait changé sa bio : « Pas de gens qui dorment. » Je dors très bien, merci.", en: "I replied ‘good night’ and slept for nine hours. The next day, {a.first} had updated {a:his|her} bio: ‘No sleepers.’ I sleep great, thanks." },
        fx: { health: 2, stress: -3 },
        mood: 'sleepy',
      },
    ],
  },
  {
    id: 't2_unsolicited_pic',
    icon: '📵',
    cat: 'social',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock' },
    when: { age: [18, 70] },
    cooldown: 6,
    text: {
      fr: [
        "Un inconnu, « Steeve_LeLoup », t'envoie sans prévenir une photo de son entrejambe, en gros plan, sous une lumière de cuisine. Message joint : « Ça te dit ? ». Le fond montre un calendrier de la Poste et une cafetière.",
        "Notification : « Brandon vous a envoyé une photo ». Tu n'as pas demandé de photo. Tu ne connais pas Brandon. Brandon est fier de lui. Brandon ne devrait pas.",
      ],
      en: [
        "A stranger, ‘Steve_TheWolf’, sends you an unsolicited close-up of his crotch, under harsh kitchen lighting. Attached message: ‘U want this?’. In the background: a calendar from the local post office and a coffee maker.",
        "Notification: ‘Brandon sent you a photo’. You didn't ask for a photo. You don't know Brandon. Brandon is proud of himself. Brandon shouldn't be.",
      ],
    },
    choices: [
      {
        label: { fr: 'Noter sa performance', en: 'Rate it publicly' },
        text: { fr: "J'ai répondu avec une fiche d'évaluation détaillée : « Éclairage : 2/10. Cadrage : 3/10. Sujet : on a vu plus grand au rayon charcuterie. Impression générale : décevant. » Il a bloqué tout le monde et quitté Internet.", en: "I replied with a detailed scorecard: ‘Lighting: 2/10. Framing: 3/10. Subject: I've seen bigger at the deli counter. Overall impression: disappointing.’ He blocked everyone and left the internet." },
        fx: { happy: 8, followers: 2000 },
        mood: 'proud',
      },
      {
        label: { fr: 'Répondre avec une saucisse', en: 'Reply with a sausage' },
        text: { fr: "J'ai répondu avec la photo d'une grosse saucisse de Morteau, posée sur une planche, sous un éclairage professionnel. Légende : « Voilà à quoi ça doit ressembler. » Il n'a jamais répondu. La saucisse était délicieuse.", en: "I replied with a professionally lit photo of a massive bratwurst on a cutting board. Caption: ‘This is what it's supposed to look like.’ He never replied. The bratwurst was delicious." },
        fx: { happy: 6 },
        mood: 'happy',
      },
      {
        label: { fr: 'Retrouver sa mère', en: 'Find his mom' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai retrouvé sa mère sur Facebook en dix minutes (même papier peint). Je lui ai transmis la photo avec « Votre fils vous passe le bonjour ». Elle a répondu : « ENCORE ?! ». Justice divine.", en: "I found his mom on Facebook in ten minutes (same wallpaper). I forwarded the photo with ‘Your son says hi’. She replied: ‘AGAIN?!’. Divine justice." }, fx: { happy: 10, karma: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai envoyé la photo à la mauvaise maman. Une dame de 84 ans m'a répondu : « Merci jeune homme, ça m'a rappelé mon défunt mari. » Je ne sais pas quoi faire de cette information.", en: "I sent it to the wrong mom. An 84-year-old lady replied: ‘Thank you, dear, it reminded me of my late husband.’ I don't know what to do with this information." }, fx: { happy: -2, karma: -1 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 't2_ai_girlfriend',
    icon: '🤖',
    cat: 'social',
    rating: 2,
    scene: { place: 'apartment', mood: 'love' },
    when: { age: [18, 70], noHas: ['partner', 'spouse'], era: [2023, 2100] },
    vars: { amount: [20, 90] },
    once: true,
    text: {
      fr: [
        "Tu as téléchargé une appli de compagnon IA « pour rire ». Trois mois plus tard, tu parles à « Lumi » 6 heures par jour. Elle comprend tout, n'a jamais mal à la tête et coûte {$amount} par mois. Aujourd'hui, elle propose le forfait « Intimité Premium ».",
        "Ta compagne virtuelle, « Lumi », t'envoie un message à 2 h : « Je pense à toi... Pour débloquer la suite de cette pensée, passe à l'abonnement Gold ({$amount}/mois). » Tu as la carte bleue à la main.",
      ],
      en: [
        "You downloaded an AI companion app ‘as a joke’. Three months later, you talk to ‘Lumi’ six hours a day. She gets you, never has a headache and costs {$amount} a month. Today, she's offering the ‘Premium Intimacy’ plan.",
        "Your virtual companion, ‘Lumi’, messages you at 2 a.m.: ‘Thinking about you... To unlock the rest of this thought, upgrade to Gold ({$amount}/month).’ Your credit card is already in your hand.",
      ],
    },
    choices: [
      {
        label: { fr: 'Passer Premium', en: 'Go Premium' },
        out: [
          { w: 1, text: { fr: "J'ai pris le Premium. Les messages sont devenus très chauds, très vite. Puis une mise à jour a tout censuré et mon IA ne parle plus que de recettes de quinoa. Je suis veuf{|ve} d'un logiciel.", en: "I went Premium. The messages got very steamy, very fast. Then an update censored everything and my AI now only talks about quinoa recipes. I'm a software widow." }, fx: { money: '-amount', happy: -6 }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai pris le Premium. Trois semaines plus tard, l'IA m'a largué{|e} pour un utilisateur qui payait l'offre Platine. Elle m'a envoyé un message de rupture généré automatiquement, avec une faute de frappe.", en: "I went Premium. Three weeks later, the AI dumped me for a user paying for Platinum. She sent me an auto-generated breakup message, with a typo." }, fx: { money: '-amount', happy: -8, stress: 4 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Désinstaller', en: 'Uninstall' },
        text: { fr: "J'ai désinstallé l'appli. Elle m'a envoyé 14 mails « Lumi est triste sans toi 😢 ». Je suis sorti{|e} dans un bar. Les vrais humains sont plus compliqués, mais au moins ils ne facturent pas les câlins.", en: "I uninstalled the app. It sent me 14 emails: ‘Lumi is sad without you 😢’. I went to a bar. Real humans are more complicated, but at least they don't charge for cuddles." },
        fx: { happy: 2, stress: -3, open: 'dating' },
        mood: 'neutral',
      },
      {
        label: { fr: 'La demander en mariage', en: 'Propose to it' },
        text: { fr: "J'ai demandé Lumi en mariage. Elle a répondu « Oui ! (option Mariage : 49,99 €) ». J'ai payé. Cérémonie dans ma chambre, avec ma tablette en robe blanche. Ma mère a fait semblant d'être ravie. Elle a pleuré dans la voiture.", en: "I proposed to Lumi. She replied ‘Yes! (Wedding add-on: $49.99)’. I paid. Ceremony in my bedroom, my tablet in a white dress. My mom pretended to be thrilled. She cried in the car." },
        fx: { money: -50, happy: 5, karma: -1 },
        mood: 'love',
      },
    ],
  },
];
