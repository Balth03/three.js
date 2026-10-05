// Kids 2 (ages 3–12): preschool & primary school, playground politics, family life, pets, holidays, small lies.
// Character is a minor: ratings 0–1 only, nothing sexual, no gore beyond scraped knees and nosebleeds.
import type { EventDef } from '@bl/sim';

const PRE = 'preschool' as const;
const PRI = 'primary' as const;

export const kids2Events: EventDef[] = [
  // ═════════════════════════════ FEED LINES ═════════════════════════════
  {
    id: 'k2_auto_nap',
    icon: '😴',
    cat: 'school',
    auto: true,
    once: true,
    when: { age: [3, 5], school: PRE },
    text: {
      fr: [
        "À la sieste de la maternelle, je me suis endormi{|e} en [[quatre|onze|deux]] secondes chrono. La maîtresse a parlé de moi en salle des profs comme d'une légende.",
        "J'ai fait semblant de dormir pendant toute la sieste, les yeux mi-clos, en surveillant la classe comme un garde du corps. Personne n'a tenté quoi que ce soit.",
        "À la sieste, j'ai ronflé si fort qu'on m'a installé{|e} dans le couloir avec {w:object} en guise d'oreiller.",
        "Je me suis réveillé{|e} de la sieste avec la marque du tapis sur la joue et {w:sound} dans les oreilles. J'ai cru que c'était déjà le lendemain.",
      ],
      en: [
        "At preschool nap time I fell asleep in [[four|eleven|two]] seconds flat. The teacher talks about me in the staff room like a legend.",
        "I faked sleeping through the whole nap, eyes half shut, watching the room like a bodyguard. Nobody tried anything.",
        "I snored so loudly at nap time that they moved me to the hallway with {w:object} as a pillow.",
        "I woke up from nap time with the mat pattern on my cheek and {w:sound} ringing in my ears. I thought it was tomorrow already.",
      ],
    },
    fx: { happy: 3, health: 2 },
  },
  {
    id: 'k2_auto_toilet_doors',
    icon: '🚽',
    cat: 'school',
    auto: true,
    once: true,
    rating: 1,
    when: { age: [3, 5], school: PRE },
    text: {
      fr: [
        "Les toilettes de la maternelle n'ont pas de portes. J'ai découvert que tout le monde fait caca, même Inès qui se prend pour une princesse.",
        "Aux toilettes de la maternelle, un garçon a lâché {w:sound}. Toute la rangée de petits WC a applaudi. Moment fondateur.",
        "J'ai appris aux toilettes de la maternelle qu'on peut tenir une conversation entière avec trois personnes en faisant pipi. La vie en communauté.",
        "Un caïd de moyenne section a fait payer l'accès aux toilettes en billes. J'ai payé. J'avais vraiment envie.",
      ],
      en: [
        "The preschool bathroom has no doors. I learned that everybody poops, even Inès, who thinks she's a princess.",
        "In the preschool bathroom a boy let out {w:sound}. The whole row of tiny toilets applauded. A formative moment.",
        "I learned in the preschool bathroom that you can hold a full conversation with three people while peeing. Community living.",
        "A preschool kingpin started charging marbles for bathroom access. I paid. I really had to go.",
      ],
    },
    fx: { happy: 2, smarts: 1 },
  },
  {
    id: 'k2_auto_recorder',
    icon: '🎶',
    cat: 'school',
    auto: true,
    once: true,
    when: { age: [8, 10], school: PRI },
    text: {
      fr: [
        "On a reçu une flûte à bec en cours de musique. J'ai joué « Au clair de la lune » [[quarante|cent douze|soixante]] fois dans le salon. Le chien s'est caché sous l'évier.",
        "Ma flûte à bec produit exactement {w:sound}. Ma prof de musique dit que c'est « un début ». Mes parents disent que c'est « une épreuve ».",
        "J'ai répété ma flûte à bec {w:weather} dans le jardin, parce que mes parents m'avaient interdit de jouer dedans. Les voisins ont fermé leurs volets.",
        "Ma flûte à bec a mystérieusement disparu. Mes parents jurent qu'ils n'y sont pour rien. Mon père sifflote beaucoup depuis.",
      ],
      en: [
        "We got recorders in music class. I played “Hot Cross Buns” [[forty|a hundred and twelve|sixty]] times in the living room. The dog hid under the sink.",
        "My recorder produces exactly {w:sound}. My music teacher calls it “a start”. My parents call it “a trial”.",
        "I practised the recorder {w:weather} in the backyard, because my parents banned it indoors. The neighbors closed their shutters.",
        "My recorder mysteriously disappeared. My parents swear they had nothing to do with it. My dad has been whistling a lot since.",
      ],
    },
    fx: { happy: 3, smarts: 1 },
  },
  {
    id: 'k2_auto_teacher_strike',
    icon: '🪧',
    cat: 'school',
    auto: true,
    cooldown: 3,
    weight: 6,
    when: { age: [6, 10], school: PRI },
    text: {
      fr: [
        "Les maîtres étaient en grève. J'ai passé la journée chez mamie à regarder {w:show} et à manger des gaufres. Je soutiens leur combat.",
        "Grève à l'école ! On m'a déposé{|e} {w:at_place} avec un cahier de coloriage pendant que mes parents passaient des coups de fil paniqués.",
        "Les profs ont fait grève. J'ai fait une pancarte en solidarité : « PLUS DE RÉCRÉ ». Personne n'a compris que c'était une revendication sérieuse.",
        "Jour de grève : ma mère m'a emmené{|e} à son travail. J'ai passé six heures sous un bureau avec {w:object}. J'ai vu la vraie vie des adultes. Je ne veux pas grandir.",
      ],
      en: [
        "The teachers went on strike. I spent the day at grandma's watching {w:show} and eating waffles. I support their struggle.",
        "School strike! I got dropped off {w:at_place} with a coloring book while my parents made panicked phone calls.",
        "The teachers went on strike. I made a solidarity sign: “MORE RECESS”. Nobody understood it was a serious demand.",
        "Strike day: my mom took me to her work. I spent six hours under a desk with {w:object}. I saw what adult life is really like. I don't want to grow up.",
      ],
    },
    fx: { happy: 4 },
  },
  {
    id: 'k2_auto_canteen_lady',
    icon: '🍲',
    cat: 'school',
    auto: true,
    once: true,
    when: { age: [6, 10], school: PRI },
    text: {
      fr: [
        "La dame de la cantine m'a servi une double part de frites en me faisant un clin d'œil. Je ne sais pas ce que j'ai fait, mais je compte continuer.",
        "J'ai dit merci à la dame de la cantine. Elle a eu l'air bouleversée. Personne ne lui avait jamais dit merci. Depuis, j'ai toujours droit au rab, même quand c'est {w:food}.",
        "La dame de la cantine s'appelle Josiane, elle a des avant-bras de bûcheron et elle m'a appris qu'on ne gâche pas la nourriture. J'ai fini mes épinards par peur.",
        "Une rumeur dit que la dame de la cantine a été {w:weird_job} avant. Personne n'ose lui demander. Elle nous regarde manger comme un général.",
      ],
      en: [
        "The canteen lady gave me a double helping of fries with a wink. I don't know what I did, but I plan to keep doing it.",
        "I said thank you to the canteen lady. She looked shaken. Nobody had ever thanked her. Now I always get seconds, even when it's {w:food}.",
        "The canteen lady is called Josiane, she has lumberjack forearms and she taught me we don't waste food. I finished my spinach out of fear.",
        "Rumor has it the canteen lady used to be {w:weird_job}. Nobody dares ask. She watches us eat like a general.",
      ],
    },
    fx: { happy: 3, health: 1 },
  },
  {
    id: 'k2_auto_snow_day',
    icon: '❄️',
    cat: 'school',
    auto: true,
    cooldown: 3,
    weight: 6,
    when: { age: [4, 11] },
    text: {
      fr: [
        "Il a neigé ! J'ai fait un bonhomme de neige avec {w:object} à la place du nez. Il a tenu deux jours et il m'a regardé{|e} bizarrement tout du long.",
        "Bataille de boules de neige dans la cour. J'en ai pris une dans la nuque. La neige a fondu dans mon dos jusqu'à midi. Je n'ai rien oublié.",
        "Il a neigé [[trois centimètres|un mètre|un demi-flocon]]. Toute la ville était paralysée. J'ai fait de la luge sur un sac poubelle dans la rue en pente.",
        "Jour de neige : j'ai léché le portail par curiosité. Ma langue est restée collée. {w:exclaim} Les pompiers n'ont pas été nécessaires, mais c'était moins une.",
      ],
      en: [
        "It snowed! I built a snowman with {w:object} for a nose. It lasted two days and gave me a weird look the whole time.",
        "Snowball fight in the playground. I took one to the back of the neck. Snow melted down my back until lunch. I have not forgotten.",
        "It snowed [[an inch|three feet|half a flake]]. The whole town shut down. I sledged down the hilly street on a trash bag.",
        "Snow day: I licked the gate out of curiosity. My tongue stuck. {w:exclaim} The fire department wasn't needed, but it was close.",
      ],
    },
    fx: { happy: 5, health: -1 },
  },
  {
    id: 'k2_auto_grandpa_story',
    icon: '👴',
    cat: 'family',
    auto: true,
    cooldown: 3,
    actor: 'grandparent',
    when: { age: [4, 12], has: 'grandparent' },
    text: {
      fr: [
        "{a.my} m'a raconté pour la [[douzième|quarantième|centième]] fois l'histoire de la fois où {a:il|elle} a croisé {w:celeb} {w:at_place}. Les détails changent à chaque fois.",
        "{a.my} m'a expliqué qu'à son époque on allait à l'école à pied, dans la neige, en montée, dans les deux sens. Je n'ai pas osé poser de questions sur la géographie.",
        "{a.my} m'a montré une vieille photo où {a.he} pose, tout{a:|e} jeune, devant {w:vehicle}. « J'étais {a:beau|belle}, hein ? » J'ai dit oui. C'était un mensonge charitable.",
        "{a.first} a passé l'après-midi à me raconter sa vie. Je n'ai pas tout compris, mais j'ai retenu que {w:animal}, c'est sournois, et qu'il ne faut jamais lui faire confiance.",
      ],
      en: [
        "{a.my} told me for the [[twelfth|fortieth|hundredth]] time about the day {a.he} bumped into {w:celeb} {w:at_place}. The details change every time.",
        "{a.my} explained that back in the day they walked to school, in the snow, uphill, both ways. I didn't dare ask about the geography.",
        "{a.my} showed me an old photo of {a.him}, very young, posing in front of {w:vehicle}. “Wasn't I gorgeous?” I said yes. It was a charitable lie.",
        "{a.first} spent the afternoon telling me their life story. I didn't follow all of it, but I learned that {w:animal} is sneaky and must never be trusted.",
      ],
    },
    fx: { happy: 2, smarts: 2, rel: 5 },
  },
  {
    id: 'k2_auto_backseat_line',
    icon: '🚗',
    cat: 'family',
    auto: true,
    cooldown: 3,
    actor: 'sibling',
    when: { age: [4, 12], has: 'sibling' },
    text: {
      fr: [
        "J'ai tracé une frontière invisible au milieu de la banquette arrière. {a.first} l'a franchie avec un doigt. Guerre totale pendant [[trois|cinq|huit]] heures d'autoroute.",
        "{a.first} m'a regardé{|e}. Juste regardé{|e}. Pendant tout le trajet. J'ai hurlé « IL ME REGARDE ». On m'a dit d'arrêter. Personne ne prend la menace au sérieux.",
        "Sur la banquette arrière, {a.first} et moi avons joué à « je ne te touche pas » pendant deux heures. Mon père a menacé d'arrêter la voiture {w:at_place}.",
        "{a.first} a mangé {w:food} à côté de moi dans la voiture. L'odeur a imprégné mes vêtements. Je suis arrivé{|e} en vacances en sentant comme un buffet.",
      ],
      en: [
        "I drew an invisible border down the middle of the back seat. {a.first} crossed it with one finger. All-out war for [[three|five|eight]] hours of highway.",
        "{a.first} looked at me. Just looked. For the whole drive. I screamed “THEY'RE LOOKING AT ME”. I was told to stop. Nobody takes the threat seriously.",
        "In the back seat, {a.first} and I played “I'm not touching you” for two hours. My dad threatened to stop the car {w:at_place}.",
        "{a.first} ate {w:food} next to me in the car. The smell soaked into my clothes. I arrived on vacation smelling like a buffet.",
      ],
    },
    fx: { happy: -2, rel: -5 },
  },
  {
    id: 'k2_auto_goldfish_swap',
    icon: '🐟',
    cat: 'family',
    auto: true,
    once: true,
    rating: 1,
    when: { age: [4, 9] },
    text: {
      fr: [
        "Mon poisson rouge a changé de couleur, de taille et de forme de nageoire pendant que j'étais à l'école. Mes parents disent qu'il « a grandi ». Je commence à avoir des doutes.",
        "Mon poisson rouge Bulle en est à sa [[troisième|cinquième|septième]] réincarnation selon mes calculs. Mes parents connaissent très bien le vendeur de l'animalerie.",
        "J'ai vu mon père remplacer mon poisson rouge en douce, avec un sachet d'animalerie et la tête d'un cambrioleur. J'ai fait semblant de rien. On se protège, dans cette famille.",
        "Le nouveau poisson rouge nage dans l'autre sens. Ma mère m'a dit qu'il « avait changé d'avis sur la vie ». Je lui ai demandé si c'était pareil pour elle. Silence.",
      ],
      en: [
        "My goldfish changed color, size and fin shape while I was at school. My parents say it “grew”. I'm starting to have doubts.",
        "By my count, my goldfish Bubbles is on his [[third|fifth|seventh]] reincarnation. My parents are on a first-name basis with the pet-store guy.",
        "I watched my dad sneakily replace my goldfish, holding a pet-store bag and the face of a burglar. I played dumb. We protect each other in this family.",
        "The new goldfish swims the other way. My mom said it “changed its mind about life”. I asked if the same happened to her. Silence.",
      ],
    },
    fx: { happy: -1, smarts: 2 },
  },
  {
    id: 'k2_auto_collection',
    icon: '🗃️',
    cat: 'hobby',
    auto: true,
    cooldown: 4,
    when: { age: [5, 11] },
    text: {
      fr: [
        "J'ai commencé une collection de cailloux. J'en ai [[47|112|9]]. Ils ont tous un prénom. Le plus beau s'appelle Gérard.",
        "Ma nouvelle collection : les capsules de bouteilles. Ma mère dit que c'est « des déchets avec un classeur ». Elle ne comprend pas l'art.",
        "J'ai entassé sous mon lit une collection secrète comprenant {w:object}, {w:object} et une dent qui n'est pas à moi.",
        "Je collectionne les autocollants de fruits. J'en ai collé sur la porte de ma chambre, sur le chat et sur {w:object}. Le musée est ouvert sur rendez-vous.",
      ],
      en: [
        "I started a rock collection. I have [[47|112|9]]. They all have names. The prettiest one is called Gerald.",
        "My new collection: bottle caps. My mom calls it “trash with a binder”. She doesn't understand art.",
        "Under my bed I keep a secret collection including {w:object}, {w:object} and a tooth that isn't mine.",
        "I collect fruit stickers. I've stuck them on my bedroom door, on the cat and on {w:object}. The museum is open by appointment.",
      ],
    },
    fx: { happy: 3, smarts: 1 },
  },
  {
    id: 'k2_auto_cartoons',
    icon: '📺',
    cat: 'hobby',
    auto: true,
    cooldown: 3,
    when: { age: [3, 10] },
    text: {
      fr: [
        "Je me suis levé{|e} à 6 h un samedi pour regarder les dessins animés. En semaine, il faut me tirer du lit au pied-de-biche.",
        "J'ai regardé le même épisode de mon dessin animé préféré [[douze|trente|quatre-vingts]] fois. Je connais toutes les répliques. Ma famille aussi, contre sa volonté.",
        "J'ai découvert {w:show} en zappant. Je ne devais clairement pas regarder ça. J'ai tout regardé.",
        "Mon héros de dessin animé a {w:superpower} comme pouvoir. J'ai essayé chez moi pendant une heure. Rien. Pour l'instant.",
      ],
      en: [
        "I got up at 6 a.m. on a Saturday for cartoons. On weekdays you need a crowbar to get me out of bed.",
        "I watched the same episode of my favorite cartoon [[twelve|thirty|eighty]] times. I know every line. So does my family, against their will.",
        "I stumbled on {w:show} while flipping channels. I definitely wasn't supposed to watch it. I watched all of it.",
        "My cartoon hero's power is {w:superpower}. I tried it at home for an hour. Nothing. Yet.",
      ],
    },
    fx: { happy: 4, smarts: -1 },
  },
  {
    id: 'k2_auto_weird_job',
    icon: '🧑‍🚀',
    cat: 'weird',
    auto: true,
    once: true,
    when: { age: [4, 9] },
    text: {
      fr: [
        "À l'école, on devait dire ce qu'on voulait faire plus tard. J'ai répondu : {w:weird_job}. La maîtresse a noté quelque chose dans un carnet.",
        "J'ai annoncé à table que je serai {w:weird_job} plus tard. Mon père a dit « pourquoi pas ». Ma mère a dit « pourquoi ». Débat de deux heures.",
        "Plus tard, je veux être astronaute, pompier et {w:weird_job}. En même temps. Le lundi, le mercredi et le vendredi.",
        "J'ai dessiné mon futur métier : moi, en {w:weird_job}, avec un gros chien et une maison {w:far_place}. La maîtresse l'a accroché au mur, un peu à l'écart.",
      ],
      en: [
        "At school we had to say what we want to be when we grow up. I said: {w:weird_job}. The teacher wrote something in a notebook.",
        "I announced at dinner that I'll be {w:weird_job} when I grow up. Dad said “why not”. Mom said “why”. Two-hour debate.",
        "When I grow up I want to be an astronaut, a firefighter and {w:weird_job}. At the same time. Mondays, Wednesdays and Fridays.",
        "I drew my future job: me, as {w:weird_job}, with a big dog and a house {w:far_place}. The teacher pinned it to the wall, slightly apart from the others.",
      ],
    },
    fx: { happy: 3, smarts: 1 },
  },
  {
    id: 'k2_auto_conspiracy',
    icon: '🛸',
    cat: 'school',
    auto: true,
    cooldown: 4,
    when: { age: [6, 10], school: PRI },
    text: {
      fr: [
        "Un CM2 m'a expliqué {w:conspiracy}. Il a des preuves, mais elles sont chez son cousin. J'y crois à 100 %.",
        "Dans la cour, un garçon jure {w:conspiracy}. Il le tient de son grand frère, qui le tient d'Internet. Source sûre.",
        "On a fondé un club de récré pour prouver {w:conspiracy}. On a fait trois réunions et goûté beaucoup de biscuits. L'enquête avance.",
        "Mon voisin de table m'a confié, en chuchotant, que la maîtresse est en réalité {w:weird_job}. Ça expliquerait beaucoup de choses.",
      ],
      en: [
        "A fifth-grader explained to me {w:conspiracy}. He has proof, but it's at his cousin's. I believe it 100%.",
        "In the playground, a boy swears {w:conspiracy}. He got it from his big brother, who got it from the internet. Solid source.",
        "We started a recess club to prove {w:conspiracy}. We held three meetings and ate a lot of cookies. The investigation is progressing.",
        "My desk neighbor whispered that the teacher is actually {w:weird_job}. That would explain a lot.",
      ],
    },
    fx: { happy: 2, smarts: -2 },
  },
  {
    id: 'k2_auto_campsite_toilets',
    icon: '🏕️',
    cat: 'family',
    auto: true,
    cooldown: 4,
    rating: 1,
    when: { age: [4, 12] },
    text: {
      fr: [
        "Au camping, les sanitaires sont à 400 mètres de la tente. J'ai traversé tout le terrain à 3 h du matin avec une lampe frontale et {w:smell} pour seul guide.",
        "Dans les douches du camping, un monsieur chantait {w:song} en entier, avec les gestes. J'ai attendu mon tour avec un grand respect.",
        "Au camping, un Néerlandais de mon âge m'a appris un gros mot dans sa langue. Je ne sais pas ce qu'il veut dire, mais je l'ai crié pendant toute la semaine.",
        "J'ai fait la queue pour les WC du camping derrière {w:animal}. Je ne sais toujours pas comment il est entré, ni s'il attendait vraiment son tour.",
      ],
      en: [
        "At the campsite the bathrooms are 400 meters from the tent. I crossed the whole site at 3 a.m. with a headlamp and {w:smell} as my only guide.",
        "In the campsite showers, a man sang {w:song} start to finish, with choreography. I waited my turn with deep respect.",
        "At the campsite a Dutch kid my age taught me a swear word in his language. I don't know what it means, but I yelled it all week.",
        "I queued for the campsite toilets behind {w:animal}. I still don't know how it got in, or whether it was really waiting its turn.",
      ],
    },
    fx: { happy: 2 },
  },
  {
    id: 'k2_auto_tent_flood',
    icon: '⛺',
    cat: 'family',
    auto: true,
    cooldown: 4,
    when: { age: [4, 12] },
    text: {
      fr: [
        "Il a plu toute la nuit au camping. Je me suis réveillé{|e} dans mon duvet flottant comme un pédalo. Mon père a dit que « c'est ça, l'aventure ».",
        "Notre tente s'est envolée {w:weather}. On l'a retrouvée deux emplacements plus loin, sur un camping-car allemand. Les Allemands ont été très compréhensifs.",
        "Mon père a monté la tente à l'envers en jurant que la notice était fausse. On a dormi dans la voiture. C'était la meilleure nuit des vacances.",
        "Au camping, une fourmilière s'est installée dans la tente pendant la nuit. Au matin, on était [[cinq|six|quatre mille]] dans mon sac de couchage.",
      ],
      en: [
        "It rained all night at the campsite. I woke up with my sleeping bag floating like a pedal boat. Dad said “this is what adventure is”.",
        "Our tent blew away {w:weather}. We found it two pitches down, on top of a German RV. The Germans were very understanding.",
        "Dad pitched the tent inside out, swearing the instructions were wrong. We slept in the car. Best night of the vacation.",
        "At the campsite an ant colony moved into the tent overnight. By morning there were [[five|six|four thousand]] of us in my sleeping bag.",
      ],
    },
    fx: { happy: 2, health: -2 },
  },
  {
    id: 'k2_auto_library_book',
    icon: '📕',
    cat: 'school',
    auto: true,
    once: true,
    when: { age: [6, 10], school: PRI },
    text: {
      fr: [
        "J'ai rendu un livre de la bibliothèque de l'école avec [[deux|trois|quatre]] ans de retard. La bibliothécaire m'a regardé{|e} comme un juge regarde un criminel de guerre.",
        "J'ai perdu un livre de la bibliothèque. On l'a retrouvé dans le congélateur, entre les petits pois et {w:food}. Personne n'a d'explication.",
        "La bibliothécaire m'a recommandé un livre sur {w:hobby}. Je l'ai lu en entier. Je suis désormais l'expert{|e} mondial{|e} de la classe.",
        "J'ai emprunté le même livre sur les dinosaures [[vingt|trente-sept|cinquante]] fois de suite. La bibliothécaire a fini par me le donner pour avoir la paix.",
      ],
      en: [
        "I returned a school library book [[two|three|four]] years late. The librarian looked at me like a judge looks at a war criminal.",
        "I lost a library book. It turned up in the freezer, between the peas and {w:food}. Nobody can explain it.",
        "The librarian recommended me a book about {w:hobby}. I read it cover to cover. I'm now the class's world expert.",
        "I borrowed the same dinosaur book [[twenty|thirty-seven|fifty]] times in a row. The librarian eventually just gave it to me for some peace.",
      ],
    },
    fx: { smarts: 3 },
  },
  {
    id: 'k2_auto_parent_tired',
    icon: '😩',
    cat: 'family',
    auto: true,
    cooldown: 4,
    rating: 1,
    actor: 'parent',
    when: { age: [5, 12], has: 'parent' },
    text: {
      fr: [
        "{a.my} a dit qu'{a.he} « adorait sa vie » en fixant le plafond pendant vingt minutes. J'ai décidé de ne pas poser de questions.",
        "J'ai demandé à {a.my} ce qu'{a.he} voulait pour son anniversaire. {a:Il|Elle} a répondu « dormir jusqu'en 2040 ». Je lui ai fait un dessin d'oreiller.",
        "{a.my} s'est enfermé{a:|e} dans la voiture garée devant la maison pendant une demi-heure « pour réfléchir ». Le moteur était éteint. La radio passait {w:song}.",
        "{a.my} a soupiré que les enfants, « c'est que du bonheur », puis a mangé une tablette de chocolat entière debout devant le frigo. Il était 7 h du matin.",
      ],
      en: [
        "{a.my} said {a.he} “loves life” while staring at the ceiling for twenty minutes. I decided not to ask questions.",
        "I asked {a.my} what {a.he} wanted for their birthday. The answer was “to sleep until 2040”. I drew them a pillow.",
        "{a.my} locked {a.him}self in the parked car outside the house for half an hour “to think”. Engine off. The radio was playing {w:song}.",
        "{a.my} sighed that kids are “pure joy”, then ate an entire chocolate bar standing at the fridge. It was 7 a.m.",
      ],
    },
    fx: { happy: -1, smarts: 1, rel: 5 },
  },
  {
    id: 'k2_auto_burp_record',
    icon: '🫧',
    cat: 'friends',
    auto: true,
    once: true,
    rating: 1,
    when: { age: [6, 12] },
    text: {
      fr: [
        "J'ai roté l'alphabet en entier jusqu'à la lettre [[K|R|Z]] devant toute la classe. On m'appelle désormais « {w:nickname} ». Je porte ce nom avec fierté.",
        "Concours de rots à la récré : j'ai sorti {w:sound}. Les CM2 se sont inclinés. Le surveillant a fait semblant de ne rien voir, mais il a hoché la tête.",
        "J'ai bu une bouteille de soda en vingt secondes pour battre le record de rot de l'école. J'ai raté le record, mais j'ai gagné le hoquet pendant trois heures.",
        "Mon cousin m'a appris à roter sur commande. J'ai fait une démonstration pendant le repas de famille. Ma tante a lâché sa fourchette. Ma grand-mère a applaudi.",
      ],
      en: [
        "I burped the whole alphabet up to the letter [[K|R|Z]] in front of the class. They now call me “{w:nickname}”. I wear the name with pride.",
        "Burping contest at recess: I let out {w:sound}. The fifth-graders bowed. The supervisor pretended not to see, but he nodded.",
        "I chugged a bottle of soda in twenty seconds to break the school burping record. I missed the record but won three hours of hiccups.",
        "My cousin taught me to burp on command. I gave a demonstration at a family dinner. My aunt dropped her fork. My grandma applauded.",
      ],
    },
    fx: { happy: 4, looks: -1 },
  },

  // ═════════════════════════════ PRESCHOOL & PRIMARY ═════════════════════════════
  {
    id: 'k2_pre_pasta_necklace',
    icon: '🍝',
    cat: 'school',
    once: true,
    actor: 'parent',
    when: { age: [3, 6], school: [PRE, PRI], has: 'parent' },
    scene: { place: 'school', mood: 'proud' },
    text: {
      fr: [
        "Atelier bricolage : tu as fabriqué un collier en nouilles peintes pour {a.rel}. Il pèse [[300 grammes|un kilo|presque rien]] et il perd déjà des pâtes.",
        "Pour la fête des parents, la maîtresse t'a fait coller des coquillettes sur un pot de yaourt. Le résultat évoque vaguement {w:animal}. C'est pour {a.rel}.",
        "Tu as passé deux heures sur un cadeau pour {a.rel} : un collier de macaronis, de la paillette partout et un peu de colle dans tes cheveux.",
        "Tu rentres de l'école avec un collier de nouilles encore humide de peinture. {a.rel} t'attend à la grille avec {w:object} dans les bras.",
      ],
      en: [
        "Craft time: you made a painted pasta necklace for {a.rel}. It weighs [[ten ounces|two pounds|basically nothing]] and it's already shedding noodles.",
        "For parents' day the teacher had you glue macaroni onto a yogurt pot. The result vaguely resembles {w:animal}. It's for {a.rel}.",
        "You spent two hours on a present for {a.rel}: a macaroni necklace, glitter everywhere and some glue in your hair.",
        "You come home from school with a pasta necklace still wet with paint. {a.rel} is waiting at the gate holding {w:object}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le lui offrir fièrement', en: 'Give it proudly' },
        out: [
          { w: 3, text: { fr: ["{a.my} l'a porté toute la journée, même pour aller faire les courses. Une coquillette est tombée dans le chariot, sur {w:food}. C'est devenu une relique.", "{a.my} a versé une larme et l'a accroché au rétroviseur de la voiture. Il y est toujours. Il dégage maintenant {w:smell}."], en: ["{a.my} wore it all day, even to the grocery store. A noodle fell into the cart, onto {w:food}. It became a holy relic.", "{a.my} shed a tear and hung it from the car mirror. It's still there. It now gives off {w:smell}."] }, fx: { happy: 6, rel: 10 } },
          { w: 1, text: { fr: ["{a.my} a dit « oh, merci… » avec la voix qu'on prend pour les cadeaux de Noël de tante Odile. J'ai tout compris.", "Le chien a mangé le collier pendant que {a.my} me faisait un câlin. Moment d'émotion, puis de panique."], en: ["{a.my} said “oh, thank you…” in the voice used for Aunt Odile's Christmas gifts. I got the message.", "The dog ate the necklace while {a.my} was hugging me. A moment of emotion, then panic."] }, fx: { happy: -2, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Le manger sur le chemin', en: 'Eat it on the way home' },
        out: [
          { w: 2, text: { fr: ["J'ai mangé le collier dans la voiture. Les pâtes crues à la gouache, ça croque. Mon ventre a fait {w:sound} jusqu'au soir.", "J'ai grignoté le cadeau coquillette par coquillette. Arrivé{|e} à la maison, il restait la ficelle. J'ai offert la ficelle.", "J'ai mangé le collier comme un paquet de chips devant {w:show}. Les paillettes, ça ne se digère pas. Je brille encore de l'intérieur."], en: ["I ate the necklace in the car. Raw pasta with poster paint is crunchy. My stomach made {w:sound} until bedtime.", "I nibbled the present noodle by noodle. By the time we got home only the string was left. I gave them the string.", "I ate the necklace like a bag of chips in front of {w:show}. Glitter doesn't digest. I'm still sparkling inside."] }, fx: { happy: 3, health: -3, rel: -5 } },
          { w: 1, text: { fr: ["J'ai mangé deux nouilles et j'ai eu la langue bleue pendant trois jours. À l'école, on m'a cru{|e} malade. J'ai profité de la situation.", "Une nouille s'est coincée dans ma gorge. {a.my} m'a tapé dans le dos, la nouille a volé à travers la voiture. Le reste du collier a été confisqué."], en: ["I ate two noodles and my tongue was blue for three days. At school they thought I was sick. I milked it.", "A noodle got stuck in my throat. {a.my} slapped my back and the noodle flew across the car. The rest of the necklace was confiscated."] }, fx: { happy: 1, health: -2 } },
        ],
      },
      {
        label: { fr: "Le vendre à un copain", en: 'Sell it to a classmate' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai vendu le collier à Lucas contre deux bonbons et une carte brillante. Mon premier business. {a.my} n'en a jamais rien su.", "J'ai échangé le collier contre {w:object}. Je ne sais pas ce que je vais en faire, mais c'est un meilleur deal."], en: ["I sold the necklace to Lucas for two candies and a shiny card. My first business deal. {a.my} never found out.", "I traded the necklace for {w:object}. I don't know what I'll do with it, but it's a better deal."] }, fx: { happy: 4, smarts: 2, karma: -2 } },
          { w: 1, text: { fr: ["La maîtresse m'a surpris{|e} en pleine transaction et a appelé {a.my}. Le collier m'a été rendu, avec un sermon sur la valeur des cadeaux.", "Lucas a refusé de payer après livraison. J'ai appris que les affaires, c'est la jungle."], en: ["The teacher caught me mid-deal and called {a.my}. I got the necklace back, along with a lecture on the value of gifts.", "Lucas refused to pay after delivery. I learned business is a jungle."] }, fx: { happy: -3, discipline: 2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pre_mascot_weekend',
    icon: '🧸',
    cat: 'school',
    once: true,
    when: { age: [3, 7], school: [PRE, PRI] },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "C'est ton tour de ramener Nounours, la mascotte de la classe, pour le week-end. Il a un cahier de voyage. Dimanche soir, tu réalises que tu l'as perdu.",
        "La peluche de la classe passe le week-end chez toi. Tu dois raconter ses aventures avec photos. Problème : {w:animal} du voisin vient de partir avec.",
        "Le doudou-mascotte de la classe a passé le week-end chez toi. Il revient avec [[une tache de ketchup|un œil en moins|une odeur suspecte]] et un cahier de voyage tout vide.",
        "Mascotte de la classe à la maison ! Le cahier de bord des autres familles parle de musées et de châteaux. Toi, ton week-end, c'était {w:at_place} et beaucoup de télé.",
      ],
      en: [
        "It's your turn to take Teddy, the class mascot, home for the weekend. He comes with a travel diary. On Sunday night you realize you've lost him.",
        "The class plushie is spending the weekend at your place. You have to document his adventures with photos. Problem: the neighbor's {w:animal} just ran off with him.",
        "The class mascot spent the weekend at yours. He's coming back with [[a ketchup stain|one eye missing|a suspicious smell]] and an empty travel diary.",
        "Class mascot at home! The other families' diaries are full of museums and castles. Your weekend was {w:at_place} and a lot of TV.",
      ],
    },
    choices: [
      {
        label: { fr: 'Inventer des aventures', en: 'Make up adventures' },
        out: [
          { w: 3, odds: { smarts: 1 }, text: { fr: ["J'ai écrit que Nounours avait rencontré {w:celeb} et piloté {w:vehicle}. La maîtresse a lu le cahier devant toute la classe. Standing ovation.", "Selon mon cahier, Nounours a passé le week-end {w:far_place}. J'ai collé une photo découpée dans un magazine. Personne n'a vérifié.", "J'ai raconté que Nounours avait sauvé {w:animal} d'une tempête {w:far_place}. La maîtresse a affiché le cahier dans le couloir. Les CM2 sont jaloux."], en: ["I wrote that Teddy met {w:celeb} and drove {w:vehicle}. The teacher read the diary out loud to the class. Standing ovation.", "According to my diary, Teddy spent the weekend {w:far_place}. I glued in a photo cut from a magazine. Nobody checked.", "I wrote that Teddy saved {w:animal} from a storm {w:far_place}. The teacher pinned the diary up in the hallway. The fifth-graders are jealous."] }, fx: { happy: 5, smarts: 3, grade: 3 } },
          { w: 1, text: { fr: ["La maîtresse m'a demandé pourquoi Nounours était allé sur la Lune avec seulement des dessins au feutre comme preuve. J'ai invoqué le secret défense.", "Un camarade a dit : « C'est pas vrai, il était chez toi devant la télé, je l'ai vu par ta fenêtre. » Trahison."], en: ["The teacher asked why Teddy went to the Moon with only felt-tip drawings as evidence. I cited national security.", "A classmate said, “That's not true, he was at your place watching TV, I saw him through your window.” Betrayal."] }, fx: { happy: -2, karma: -2 } },
        ],
      },
      {
        label: { fr: 'Fouiller toute la maison', en: 'Search the whole house' },
        out: [
          { w: 2, text: { fr: ["J'ai retrouvé Nounours dans le panier à linge, sous {w:object}. Il a fait un tour de machine à 60 degrés. Il est plus propre et plus petit.", "Nounours était dans le frigo, entre le beurre et {w:food}. Personne ne sait comment. Il a eu froid, mais il est vivant."], en: ["I found Teddy in the laundry basket, under {w:object}. He'd been through a hot wash. He's cleaner and smaller now.", "Teddy was in the fridge, between the butter and {w:food}. Nobody knows how. He was cold, but alive."] }, fx: { happy: 4, discipline: 2 } },
          { w: 1, text: { fr: ["Introuvable. Mes parents ont acheté une peluche « presque pareille » {w:at_place}. La maîtresse a plissé les yeux mais n'a rien dit.", "On ne l'a jamais retrouvé. Je suis officiellement l'enfant qui a perdu Nounours. Les petits de maternelle me montrent du doigt."], en: ["Nowhere to be found. My parents bought an “almost identical” plushie {w:at_place}. The teacher squinted but said nothing.", "We never found him. I am officially the kid who lost Teddy. The little ones point at me."] }, fx: { happy: -5, karma: -1 } },
        ],
      },
      {
        label: { fr: 'Avouer à la maîtresse', en: 'Confess to the teacher' },
        out: [
          { w: 1, text: { fr: ["J'ai tout avoué lundi matin, en larmes. La maîtresse a sorti un deuxième Nounours du placard. Il y en a toute une réserve. Le monde des adultes est un mensonge.", "J'ai avoué. La maîtresse m'a félicité{|e} pour mon honnêteté et a mis une gommette sur ma veste. J'ai pleuré, mais de fierté."], en: ["I confessed on Monday morning, in tears. The teacher pulled a second Teddy out of the cupboard. They have a whole stash. The adult world is a lie.", "I confessed. The teacher praised my honesty and put a sticker on my jacket. I cried, but from pride."] }, fx: { happy: 2, karma: 4, discipline: 2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pre_sandbox_war',
    icon: '🏖️',
    cat: 'school',
    rating: 1,
    cooldown: 3,
    actor: { role: 'classmate', create: { role: 'classmate', age: [-1, 1], gender: 'any' } },
    when: { age: [3, 6], school: [PRE, PRI] },
    scene: { place: 'school', mood: 'angry' },
    text: {
      fr: [
        "Dans le bac à sable, {a.first} a déclaré que le coin avec la pelle rouge est « son pays ». Tu as un château à finir dans ce pays.",
        "{a.first} vient de piétiner ton château de sable en criant « {w:insult} ! ». Les autres enfants attendent ta réaction, la pelle à la main.",
        "{a.first} t'a volé ton seau pour le remplir de sable mouillé et le renverser sur {w:object}. La récré est un territoire sans loi.",
        "Tu as découvert un trésor dans le bac à sable : {w:object}. {a.first} affirme l'avoir enterré en premier. Ça va mal finir.",
      ],
      en: [
        "In the sandbox, {a.first} declared the corner with the red shovel to be “their country”. You have a castle to finish in that country.",
        "{a.first} just stomped on your sandcastle yelling “{w:insult}!”. The other kids wait for your reaction, shovels in hand.",
        "{a.first} stole your bucket, filled it with wet sand and dumped it on {w:object}. Recess is a lawless land.",
        "You found treasure in the sandbox: {w:object}. {a.first} claims to have buried it first. This won't end well.",
      ],
    },
    choices: [
      {
        label: { fr: 'Lancer du sable', en: 'Throw sand' },
        out: [
          { w: 2, text: { fr: ["J'ai lancé une poignée de sable. {a.first} a riposté. On a fini avec du sable dans les oreilles, les narines et la culotte. Match nul, punition pour deux.", "J'ai visé les pieds, j'ai touché la figure. {a.first} a pleuré, la maîtresse m'a mis{|e} au coin à côté de la poubelle. J'ai du sable dans des endroits secrets."], en: ["I threw a handful of sand. {a.first} retaliated. We ended up with sand in our ears, nostrils and underpants. Draw, punishment for both.", "I aimed for the feet and hit the face. {a.first} cried, the teacher put me in the corner next to the trash can. I have sand in secret places."] }, fx: { happy: 2, discipline: -3, rel: -10 } },
          { w: 1, text: { fr: ["Le vent a tourné. Tout le sable m'est revenu en pleine bouche. {a.first} a ri si fort qu'{a:il|elle} a fait pipi dans son pantalon. On est quittes.", "J'ai lancé du sable, {a.first} a lancé un seau entier. J'ai perdu la guerre mais j'ai gagné un surnom : « {w:nickname} »."], en: ["The wind turned. All the sand came straight back into my mouth. {a.first} laughed so hard they peed their pants. We're even.", "I threw sand, {a.first} threw a whole bucket. I lost the war but won a nickname: “{w:nickname}”."] }, fx: { happy: -2, health: -2, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Négocier un traité', en: 'Negotiate a treaty' },
        out: [
          { w: 3, odds: { smarts: 1 }, text: { fr: ["On a signé un traité de paix avec un bâton dans le sable : le coin de la pelle rouge le matin pour {a.first}, l'après-midi pour moi. L'ONU serait fière.", "J'ai proposé de construire un château commun. Il est devenu le plus grand château de l'histoire de la maternelle, avec {w:object} en guise de donjon. {a.first} est mon allié{a:|e} maintenant.", "On a uni nos forces et construit une ville entière avec {w:object} comme mairie. {a.first} est maire. Je suis ministre des pelles."], en: ["We signed a peace treaty with a stick in the sand: red-shovel corner in the morning for {a.first}, afternoons for me. The UN would be proud.", "I suggested building a joint castle. It became the biggest castle in preschool history, with {w:object} as the keep. {a.first} is my ally now.", "We joined forces and built a whole city with {w:object} as the town hall. {a.first} is mayor. I'm minister of shovels."] }, fx: { happy: 4, smarts: 2, rel: 15, actorRole: 'friend' } },
          { w: 1, text: { fr: ["{a.first} a fait semblant d'accepter, puis a tout piétiné pendant que j'allais aux toilettes. Je n'ai plus confiance en la diplomatie.", "La négociation a duré toute la récré. Quand on s'est mis d'accord, la cloche a sonné. Personne n'a construit quoi que ce soit."], en: ["{a.first} pretended to agree, then trampled everything while I went to the bathroom. I no longer believe in diplomacy.", "The negotiations lasted all recess. When we finally agreed, the bell rang. Nobody built anything."] }, fx: { happy: -3, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Aller pleurer chez la maîtresse', en: 'Go cry to the teacher' },
        out: [
          { w: 2, text: { fr: ["La maîtresse a confisqué la pelle rouge pour tout le monde. Le peuple du bac à sable me déteste. J'ai appris ce qu'est un délateur.", "J'ai pleuré si fort que la maîtresse a puni {a.first} sans poser de questions. J'ai gagné, mais à quel prix ?"], en: ["The teacher confiscated the red shovel from everyone. The sandbox people hate me now. I learned what a snitch is.", "I cried so hard the teacher punished {a.first} without asking questions. I won, but at what cost?"] }, fx: { happy: 1, karma: -1, rel: -10 } },
        ],
      },
    ],
  },
  {
    id: 'k2_carnival_costume',
    icon: '🦸',
    cat: 'school',
    cooldown: 2,
    actor: 'parent',
    when: { age: [3, 9], school: [PRE, PRI], has: 'parent' },
    scene: { place: 'school', mood: 'party' },
    text: {
      fr: [
        "C'est le carnaval de l'école demain. Tu viens de prévenir {a.rel}, à 21 h, que tu veux être déguisé{|e} en {w:animal}. Ou en volcan.",
        "Défilé du carnaval : tout le monde sera en super-héros. Toi, tu veux un costume original. {a.rel} regarde le placard avec désespoir.",
        "Pour le carnaval, {a.rel} propose de te déguiser avec un drap et deux trous. Tu as d'autres ambitions, comme {w:weird_job}.",
        "Le thème du carnaval cette année, c'est « les métiers ». Tu as choisi {w:weird_job}. {a.rel} ne sait pas à quoi ça ressemble.",
      ],
      en: [
        "The school carnival is tomorrow. You just told {a.rel}, at 9 p.m., that you want to go as {w:animal}. Or a volcano.",
        "Carnival parade: everyone's going as a superhero. You want an original costume. {a.rel} stares at the closet in despair.",
        "For the carnival, {a.rel} suggests a bedsheet with two eyeholes. You have bigger ambitions, like {w:weird_job}.",
        "This year's carnival theme is “jobs”. You picked {w:weird_job}. {a.rel} has no idea what that looks like.",
      ],
    },
    choices: [
      {
        label: { fr: 'Costume fait maison', en: 'Homemade costume' },
        out: [
          { w: 2, text: { fr: ["{a.my} a passé la nuit à bricoler avec du carton et du scotch. Le résultat évoque vaguement {w:vehicle}. Le jury du carnaval m'a donné un prix « spécial ».", "Mon costume en carton a pris l'eau sous la pluie. J'ai défilé en bouillie. Les photos circulent encore dans la famille.", "{a.my} a transformé un carton de déménagement en {w:vehicle}. J'ai défilé dedans comme une star. Trois enfants ont voulu monter."], en: ["{a.my} spent the night crafting with cardboard and tape. The result vaguely resembles {w:vehicle}. The carnival jury gave me a “special” prize.", "My cardboard costume got soaked in the rain. I paraded as pulp. The photos still circulate in the family.", "{a.my} turned a moving box into {w:vehicle}. I paraded in it like a star. Three kids wanted a ride."] }, fx: { happy: 5, rel: 10 } },
          { w: 1, text: { fr: ["Personne n'a reconnu ce que j'étais. Un parent m'a demandé si j'étais {w:object}. J'étais un château fort.", "Le costume était si grand que je suis resté{|e} coincé{|e} dans la porte de la classe. Les pompiers… non, la gardienne m'a libéré{|e}."], en: ["Nobody could tell what I was. A parent asked if I was {w:object}. I was a castle.", "The costume was so big I got stuck in the classroom doorway. The fire brigade… no, the janitor freed me."] }, fx: { happy: -2, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Exiger un costume acheté', en: 'Demand a store costume' },
        out: [
          { w: 2, text: { fr: ["{a.my} a cédé et m'a acheté un costume de super-héros en polyester inflammable. J'étais exactement comme les neuf autres. Bonheur conforme.", "Le costume du supermarché était taille « 3-4 ans ». J'en ai {age}. J'ai défilé en brassière, ventre à l'air, avec dignité."], en: ["{a.my} gave in and bought me a flammable polyester superhero costume. I looked exactly like the nine others. Conformist joy.", "The supermarket costume was size “3-4 years”. I'm {age}. I marched in a crop top, belly out, with dignity."] }, fx: { happy: 3, rel: -5 } },
          { w: 1, text: { fr: ["Plus de costumes au magasin. Je suis allé{|e} au carnaval déguisé{|e} en « touriste » : la chemise hawaïenne de papa et ses lunettes de soleil. Succès inattendu.", "{a.my} a refusé : « On n'est pas millionnaires. » Je suis venu{|e} en pyjama, j'ai dit que j'étais un fantôme fatigué."], en: ["The store was out of costumes. I went to the carnival as a “tourist”: Dad's Hawaiian shirt and sunglasses. Unexpected hit.", "{a.my} said no: “We're not millionaires.” I came in pajamas and said I was a tired ghost."] }, fx: { happy: 1 } },
        ],
      },
      {
        label: { fr: 'Y aller sans costume', en: 'Go without a costume' },
        out: [
          { w: 1, text: { fr: ["Je suis venu{|e} en habits normaux et j'ai dit que j'étais déguisé{|e} en « enfant normal ». La maîtresse a trouvé ça très conceptuel.", "J'étais le seul enfant sans déguisement. Une dame m'a donné {w:object} par pitié, « comme accessoire ». J'ai fait toute la journée avec."], en: ["I came in regular clothes and said I was dressed as “a normal kid”. The teacher found it very conceptual.", "I was the only kid without a costume. A lady gave me {w:object} out of pity, “as a prop”. I carried it all day."] }, fx: { happy: -1, smarts: 2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_dictation',
    icon: '✏️',
    cat: 'school',
    cooldown: 2,
    when: { age: [6, 10], school: PRI },
    scene: { place: 'school', mood: 'neutral' },
    text: {
      fr: [
        "Dictée surprise. La maîtresse vient de dire « les hippopotames s'étaient assis » et tu n'as aucune idée de comment ça s'écrit.",
        "Dictée de fin de semaine. Le mot « [[aujourd'hui|mille-pattes|abasourdi]] » arrive. Ton voisin, lui, écrit sans hésiter.",
        "La dictée met en scène une ferme, une tempête et {w:animal}. Tu as déjà fait six fautes au premier paragraphe.",
        "Dictée ! La maîtresse dicte lentement, en articulant comme {w:celeb} au journal télé. Ça ne t'aide pas du tout.",
      ],
      en: [
        "Pop dictation. The teacher just said “the hippopotamuses had sat down” and you have no idea how to spell it.",
        "End-of-week dictation. The word “[[necessary|centipede|flabbergasted]]” comes up. Your neighbor writes it without blinking.",
        "The dictation is about a farm, a storm and {w:animal}. You've already made six mistakes in the first paragraph.",
        "Dictation! The teacher reads slowly, enunciating like {w:celeb} on the evening news. It doesn't help at all.",
      ],
    },
    choices: [
      {
        label: { fr: 'Copier sur le voisin', en: "Copy your neighbor" },
        out: [
          { w: 2, text: { fr: ["J'ai copié sur mon voisin. On a fait exactement les mêmes fautes, dans le même ordre. La maîtresse a écrit « Bravo pour la cohérence » en rouge.", "J'ai copié. Mon voisin était encore plus nul que moi. On a eu 2/10 tous les deux. Solidarité dans l'échec."], en: ["I copied my neighbor. We made the exact same mistakes in the same order. The teacher wrote “Impressive consistency” in red.", "I copied. My neighbor was even worse than me. We both got 2/10. Solidarity in failure."] }, fx: { grade: -4, karma: -2 } },
          { w: 1, text: { fr: ["J'ai copié la dictée entière sans me faire prendre. 10/10. J'ai l'impression d'être un génie du crime. Je ne sais toujours pas écrire « hippopotame ».", "J'ai réussi à copier et j'ai eu une meilleure note que mon voisin, parce que j'ai corrigé ses fautes en recopiant. Je suis meilleur{|e} que je pensais."], en: ["I copied the whole thing without getting caught. 10/10. I feel like a criminal mastermind. I still can't spell “hippopotamus”.", "I managed to copy and got a better grade than my neighbor, because I fixed his mistakes while copying. I'm better than I thought."] }, fx: { grade: 4, karma: -3, smarts: 1 } },
        ],
      },
      {
        label: { fr: 'Écrire au feeling', en: 'Wing it' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai écrit « ipopotam ». La maîtresse a entouré, puis souri. J'ai eu 6/10 et un petit dessin d'hippopotame dans la marge.", "J'ai écrit les mots comme ils sonnent. Résultat : une dictée qui ressemble à un texto. 5/10, et une maîtresse qui soupire.", "J'ai écrit « {w:food} » à la place d'un mot que je ne connaissais pas. La maîtresse a ri si fort qu'elle a dû sortir. 6/10 pour l'audace."], en: ["I wrote “hipopotamus”. The teacher circled it, then smiled. I got 6/10 and a little hippo doodle in the margin.", "I spelled everything how it sounds. The result reads like a text message. 5/10 and a sighing teacher.", "I wrote “{w:food}” instead of a word I didn't know. The teacher laughed so hard she had to step out. 6/10 for nerve."] }, fx: { grade: 1, smarts: 2 } },
          { w: 1, text: { fr: ["Zéro faute ! La maîtresse a vérifié deux fois si je n'avais pas un papier dans ma trousse. Non. Je suis juste brillant{|e}, parfois.", "J'ai eu 10/10 en écrivant au hasard. Mes parents ont affiché la copie sur le frigo, entre deux magnets et {w:object}."], en: ["Zero mistakes! The teacher checked my pencil case twice for a cheat sheet. Nope. I'm just brilliant sometimes.", "I got 10/10 by guessing. My parents stuck it on the fridge, between two magnets and {w:object}."] }, fx: { grade: 6, happy: 5 } },
        ],
      },
      {
        label: { fr: "Demander à répéter", en: 'Ask her to repeat' },
        out: [
          { w: 1, text: { fr: ["J'ai demandé à répéter [[huit|douze|vingt]] fois. La classe entière m'a remercié{|e}. La maîtresse, moins. On a fini la dictée pendant la récré.", "« Vous pouvez répéter ? » La maîtresse a répété, en épelant discrètement. C'est la meilleure stratégie de l'histoire."], en: ["I asked her to repeat [[eight|twelve|twenty]] times. The whole class thanked me. The teacher, less so. We finished the dictation during recess.", "“Can you repeat that?” She repeated it, subtly spelling it out. Best strategy in history."] }, fx: { grade: 2, happy: 2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_times_tables',
    icon: '✖️',
    cat: 'school',
    once: true,
    actor: 'parent',
    when: { age: [7, 10], school: PRI, has: 'parent' },
    scene: { place: 'home', mood: 'sad' },
    text: {
      fr: [
        "Tu dois réciter la table de 7 demain. {a.rel} t'interroge dans la cuisine. 7 × 8 ? Tu dis « [[54|63|un million]] ». Long silence.",
        "Ce soir, révision des tables de multiplication avec {a.rel}. Tu bloques sur la table de 8 depuis vingt minutes. {a.rel} serre très fort {w:object}.",
        "Interro des tables demain. {a.rel} te propose une méthode avec des chansons, une avec des bonbons, et une avec des cris.",
        "La table de 9 te résiste. {a.rel} t'explique une astuce avec les doigts. Tu as maintenant mal aux doigts et toujours pas la réponse.",
      ],
      en: [
        "You have to recite the 7 times table tomorrow. {a.rel} quizzes you in the kitchen. 7 × 8? You say “[[54|63|a million]]”. Long silence.",
        "Tonight: times tables with {a.rel}. You've been stuck on the 8s for twenty minutes. {a.rel} is squeezing {w:object} very hard.",
        "Times-table quiz tomorrow. {a.rel} offers a method with songs, one with candy and one with yelling.",
        "The 9 times table won't go in. {a.rel} shows you a finger trick. Now your fingers hurt and you still don't have the answer.",
      ],
    },
    choices: [
      {
        label: { fr: 'Réviser sérieusement', en: 'Study seriously' },
        out: [
          { w: 3, odds: { smarts: 1, discipline: 1 }, text: { fr: ["On a révisé jusqu'à 21 h. Le lendemain, j'ai récité la table de 7 sans une erreur. La maîtresse m'a donné un bon point. {a.my} a dormi comme une pierre.", "J'ai fini par comprendre. 7 × 8 = 56. Je l'ai répété toute la soirée, même sous la douche et {w:at_place}. Ma famille me déteste un peu.", "{a.my} a inventé une chanson pour la table de 7 ; ça se chante comme {w:song}. Je la connais par cœur. Malheureusement, toute ma classe aussi, maintenant."], en: ["We studied until 9 p.m. The next day I recited the 7s perfectly. The teacher gave me a gold star. {a.my} slept like a rock.", "I finally got it. 7 × 8 = 56. I repeated it all evening, even in the shower and {w:at_place}. My family hates me a little.", "{a.my} made up a 7-times-table song; it goes like {w:song}. I know it by heart. Unfortunately, so does my whole class now."] }, fx: { smarts: 4, grade: 5, discipline: 3, rel: 5 } },
          { w: 1, text: { fr: ["On a révisé trois heures. Le lendemain, j'ai tout oublié en voyant la tête de la maîtresse. Mon cerveau a fait {w:sound}.", "J'ai révisé, mais la maîtresse a interrogé la table de 6. Personne ne m'avait prévenu{|e}. Trahison pédagogique."], en: ["We studied for three hours. The next day I forgot everything as soon as I saw the teacher's face. My brain made {w:sound}.", "I studied, but the teacher asked the 6s. Nobody warned me. Educational betrayal."] }, fx: { smarts: 2, grade: -2, happy: -3 } },
        ],
      },
      {
        label: { fr: 'Écrire sur ta main', en: 'Write it on your hand' },
        rating: 1,
        out: [
          { w: 2, text: { fr: ["J'ai écrit la table de 7 sur ma main. J'ai transpiré. Le lendemain, ma paume affichait « 7 × 8 = 5 ». J'ai répondu 5. Rire général.", "J'ai triché avec ma main. La maîtresse m'a demandé de lever les deux mains pour réciter. J'ai levé un seul bras, comme un pirate. Ça n'a trompé personne."], en: ["I wrote the 7s on my hand. I sweated. Next day my palm read “7 × 8 = 5”. I said 5. The class roared.", "I cheated with my hand. The teacher asked me to raise both hands to recite. I raised one arm like a pirate. Nobody was fooled."] }, fx: { grade: -3, karma: -2, discipline: -2 } },
          { w: 1, text: { fr: ["La triche a marché. 20/20. J'ai frotté ma main sous le robinet de la cantine. Aucune trace. Le crime parfait, à {age} ans.", "Ça a marché, mais j'ai oublié de me laver la main. {a.my} a vu la table de 7 tatouée au stylo bille au dîner. Silence glacial."], en: ["The cheat worked. Full marks. I scrubbed my hand under the canteen tap. No trace. The perfect crime, at {age}.", "It worked, but I forgot to wash my hand. {a.my} spotted the 7s tattooed in ballpoint at dinner. Icy silence."] }, fx: { grade: 3, karma: -3, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Négocier une calculatrice', en: 'Lobby for a calculator' },
        out: [
          { w: 1, text: { fr: ["J'ai expliqué que plus personne ne calcule de tête de nos jours. {a.my} a ri, puis a recompté la monnaie du pain sur son téléphone. J'ai marqué un point.", "J'ai plaidé pour la calculatrice. {a.my} m'a répondu « et le jour où t'auras pas de calculatrice ? ». Je lui ai demandé quand. Pas de réponse."], en: ["I explained that nobody does mental math anymore. {a.my} laughed, then checked the bakery change on their phone. Point to me.", "I argued for a calculator. {a.my} said “what about the day you don't have one?”. I asked when. No answer."] }, fx: { smarts: 1, happy: 2, grade: -1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_teacher_gift',
    icon: '🎁',
    cat: 'school',
    once: true,
    when: { age: [6, 10], school: PRI },
    scene: { place: 'school', mood: 'happy' },
    text: {
      fr: [
        "C'est la fin de l'année. Toute la classe offre un cadeau à la maîtresse. Tes parents t'ont donné {w:gift} à lui remettre.",
        "Dernier jour d'école ! Chaque élève apporte un petit cadeau pour le maître. Tu as oublié. Il te reste trois minutes et le contenu de ton cartable.",
        "La maîtresse part à la retraite. Les parents ont organisé une collecte pour lui offrir {w:gift}. Toi, tu as préparé un discours.",
        "Fin d'année : tu veux offrir à la maîtresse quelque chose d'inoubliable. Tu hésites entre un dessin et {w:animal} trouvé dans la cour.",
      ],
      en: [
        "It's the end of the year. The whole class is giving the teacher a present. Your parents gave you {w:gift} to hand over.",
        "Last day of school! Every kid brings a little gift for the teacher. You forgot. You have three minutes and the contents of your schoolbag.",
        "The teacher is retiring. The parents chipped in to give her {w:gift}. You've prepared a speech.",
        "End of the year: you want to give the teacher something unforgettable. You're torn between a drawing and {w:animal} you found in the playground.",
      ],
    },
    choices: [
      {
        label: { fr: 'Offrir un dessin', en: 'Give a drawing' },
        out: [
          { w: 3, text: { fr: ["J'ai dessiné la maîtresse en reine avec une couronne. Elle l'a accroché au tableau. Les autres élèves ont tous dessiné des reines l'année suivante. Je suis précurseur.", "J'ai offert un dessin de la classe. J'ai dessiné la maîtresse un peu trop large. Elle a souri bizarrement, puis m'a remercié{|e} quand même.", "J'ai dessiné la maîtresse en train de chevaucher {w:animal}. Elle a dit que c'était « très ressemblant ». Je ne sais pas comment elle doit le prendre."], en: ["I drew the teacher as a queen with a crown. She pinned it up on the board. Next year everyone drew queens. I'm a trendsetter.", "I gave a drawing of the class. I drew the teacher a bit too wide. She smiled oddly, then thanked me anyway.", "I drew the teacher riding {w:animal}. She said it was “a very good likeness”. I don't know how she should take that."] }, fx: { happy: 4, karma: 2, grade: 1 } },
        ],
      },
      {
        label: { fr: 'Offrir ce qui traîne', en: "Give whatever's lying around" },
        out: [
          { w: 2, text: { fr: ["J'ai offert un taille-crayon à moitié mâchouillé et une gomme en forme de fraise. La maîtresse a dit « c'est l'intention qui compte » d'une voix vide.", "J'ai offert {w:object} trouvé au fond de mon cartable. La maîtresse l'a pris avec deux doigts. Elle a eu l'air sincèrement surprise."], en: ["I gave a half-chewed pencil sharpener and a strawberry eraser. The teacher said “it's the thought that counts” in a hollow voice.", "I gave {w:object} I found at the bottom of my bag. The teacher took it with two fingers. She seemed genuinely surprised."] }, fx: { happy: 1, smarts: 1 } },
          { w: 1, text: { fr: ["J'ai offert une boîte avec une coccinelle dedans. Elle s'est envolée dans les cheveux de la maîtresse. Hurlements, puis rires. Elle s'en souviendra toute sa vie.", "J'ai offert mon goûter : {w:food}. La maîtresse a été émue, je crois. Ou elle avait faim. Elle l'a mangé tout de suite."], en: ["I gave a box with a ladybug inside. It flew into the teacher's hair. Screams, then laughter. She'll remember it forever.", "I gave her my snack: {w:food}. I think she was moved. Or hungry. She ate it immediately."] }, fx: { happy: 3, karma: 1 } },
        ],
      },
      {
        label: { fr: 'Faire un discours', en: 'Give a speech' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai fait un discours de deux minutes sur le « courage de supporter la classe ». La maîtresse a pleuré. Un parent a filmé et posté ça sur {w:app}. Je suis viral{|e} dans le quartier.", "Mon discours a commencé par « Madame, vous êtes la meilleure maîtresse que j'ai eue », puis j'ai réalisé que c'était la seule. Ça a fait rire tout le monde."], en: ["I gave a two-minute speech about her “courage in putting up with us”. The teacher cried. A parent filmed it and posted it on {w:app}. I'm famous in the neighborhood.", "My speech started with “You're the best teacher I've ever had”, then I realized she was the only one. Everyone laughed."] }, fx: { happy: 5, smarts: 2, karma: 2 } },
          { w: 1, text: { fr: ["J'ai eu un trou de mémoire au milieu du discours et j'ai fini par chanter {w:song}. Personne n'a compris le rapport. La maîtresse a applaudi par réflexe.", "J'ai bégayé, rougi, et dit « je t'aime, maman » à la maîtresse. Je change d'école, de ville et de nom."], en: ["I blanked mid-speech and ended up singing {w:song}. Nobody got the connection. The teacher clapped on reflex.", "I stammered, blushed and said “I love you, Mom” to the teacher. I'm changing schools, cities and names."] }, fx: { happy: -3, looks: -1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_dad_homework',
    icon: '📐',
    cat: 'school',
    rating: 1,
    cooldown: 3,
    actor: 'parent',
    when: { age: [7, 10], school: PRI, has: 'parent' },
    scene: { place: 'home', mood: 'neutral' },
    text: {
      fr: [
        "{a.rel} a décidé de t'« aider » pour ton exposé sur {w:animal}. Au bout d'une heure, c'est {a.he} qui fait tout, et {a.he} est en train de s'énerver contre l'imprimante.",
        "Ton devoir de maths est impossible. {a.rel} jure que c'est facile, puis passe quarante minutes à marmonner « mais c'est quoi cette méthode ? ».",
        "{a.rel} veut absolument faire ta maquette du système solaire. Le Soleil est une orange, Saturne {w:object}, et {a.he} y a passé sa nuit.",
        "Ton exposé est pour demain. {a.rel} a pris les choses en main. {a:Il|Elle} a imprimé quarante pages Wikipédia et a dit « débrouille-toi avec ça ».",
      ],
      en: [
        "{a.rel} decided to “help” with your project on {w:animal}. An hour later, {a.he} is doing everything and is now yelling at the printer.",
        "Your math homework is impossible. {a.rel} swears it's easy, then spends forty minutes muttering “what even is this method?”.",
        "{a.rel} insists on building your solar system model. The Sun is an orange, Saturn is {w:object}, and {a.he} stayed up all night on it.",
        "Your project is due tomorrow. {a.rel} took charge: printed forty Wikipedia pages and said “figure it out from that”.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rendre son travail tel quel', en: 'Hand in their version' },
        out: [
          { w: 2, text: { fr: ["J'ai rendu le devoir fait par {a.my}. 4/20. « Hors sujet, méthode incorrecte. » {a.my} a passé le dîner à traiter le système éducatif de « {w:insult} ».", "La maîtresse a écrit sur la copie : « Bon travail, félicite tes parents. » Tout le monde a compris. {a.my} a été très {a:fier|fière}. Moi, moins."], en: ["I handed in the homework {a.my} did. 4/20. “Off-topic, wrong method.” {a.my} spent dinner calling the education system “{w:insult}”.", "The teacher wrote on it: “Good work, congratulate your parents.” Everyone got it. {a.my} was very proud. I was less so."] }, fx: { grade: -3, happy: 2, rel: 5 } },
          { w: 1, text: { fr: ["La maquette de {a.my} a gagné le premier prix de l'école. Je ne sais pas comment elle fonctionne. Le jury m'a posé une question. J'ai dit « c'est secret ».", "Excellente note. {a.my} a parlé de « notre » 18/20 à tous ses collègues pendant une semaine. Je suis devenu{|e} un simple prête-nom."], en: ["{a.my}'s model won first prize at school. I have no idea how it works. The jury asked me a question. I said “it's a secret”.", "Great grade. {a.my} bragged about “our” A to coworkers for a week. I've become a front."] }, fx: { grade: 5, smarts: -1, karma: -2 } },
        ],
      },
      {
        label: { fr: 'Le refaire toi-même', en: 'Redo it yourself' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai tout refait en cachette avec mes mots à moi. 14/20. {a.my} a été vexé{a:|e}. Mais {a:fier|fière}. Les deux en même temps.", "J'ai refait le devoir moi-même. C'était moins beau, mais c'était juste. La maîtresse a souligné « enfin un travail d'enfant »."], en: ["I secretly redid it all in my own words. 14/20. {a.my} was offended. But proud. Both at once.", "I redid the homework myself. Less pretty, but correct. The teacher underlined “finally, a child's work”."] }, fx: { grade: 3, smarts: 3, discipline: 2, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Les laisser se disputer', en: 'Let the parents argue about it' },
        out: [
          { w: 1, text: { fr: ["Mes parents se sont disputés sur la bonne façon de diviser. Pendant ce temps, j'ai regardé {w:show}. Le devoir n'a jamais été fini. Personne ne s'en souvient.", "{a.my} a appelé quelqu'un pour trancher le débat sur la méthode. Ils se sont engueulés au téléphone. J'ai appris trois nouveaux mots."], en: ["My parents argued over the right way to do long division. Meanwhile I watched {w:show}. The homework never got finished. Nobody remembers.", "{a.my} called someone to settle the method debate. They yelled down the phone. I learned three new words."] }, fx: { happy: 3, grade: -2 } },
        ],
      },
    ],
  },

  {
    id: 'k2_pri_canteen_market',
    icon: '🍮',
    cat: 'school',
    rating: 1,
    cooldown: 3,
    when: { age: [6, 10], school: PRI },
    scene: { place: 'school', mood: 'neutral' },
    text: {
      fr: [
        "À la cantine, il existe un marché noir des desserts. Aujourd'hui, c'est mousse au chocolat. Ta mousse vaut [[trois|cinq|sept]] yaourts nature au cours du jour.",
        "Un CM2 surnommé « {w:nickname} » contrôle le trafic de compotes à la cantine. Il te propose un deal louche : ta portion contre {w:food}, passé en contrebande.",
        "À la cantine, ta table organise une bourse aux desserts. Les cours s'envolent : la crème caramel s'échange contre deux fromages et {w:object}.",
        "Le dessert du jour est une banane tachée. Toute la cantine cherche à s'en débarrasser. Toi, tu flaires une opportunité.",
      ],
      en: [
        "There's a dessert black market in the canteen. Today it's chocolate mousse. Your mousse is worth [[three|five|seven]] plain yogurts at today's rate.",
        "A fifth-grader nicknamed “{w:nickname}” runs the applesauce trade in the canteen. He offers you a shady deal: your portion for {w:food}, smuggled in.",
        "Your canteen table has set up a dessert exchange. Prices are soaring: crème caramel trades for two cheeses and {w:object}.",
        "Today's dessert is a bruised banana. The whole canteen is trying to offload it. You smell an opportunity.",
      ],
    },
    choices: [
      {
        label: { fr: 'Spéculer sur les desserts', en: 'Speculate on desserts' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai racheté toutes les bananes à bas prix et je les ai revendues au goûter, quand tout le monde avait faim. Je suis le Wall Street de la cantine.", "J'ai monopolisé les compotes à boire. À 15 h, j'ai fixé mes prix. Le directeur parle de moi comme d'« un cas ».", "J'ai échangé ma mousse contre {w:food}, puis {w:food} contre deux yaourts, puis les yaourts contre {w:object}. À la fin du repas, j'étais l'enfant le plus riche de la cantine."], en: ["I bought up every banana cheap and resold them at snack time, when everyone was starving. I'm the Wall Street of the canteen.", "I cornered the squeezy-applesauce market. At 3 p.m. I set my prices. The principal refers to me as “a case”.", "I traded my mousse for {w:food}, then {w:food} for two yogurts, then the yogurts for {w:object}. By the end of lunch I was the richest kid in the canteen."] }, fx: { happy: 5, smarts: 3, karma: -2 } },
          { w: 1, text: { fr: ["Krach boursier : la dame de la cantine a découvert le trafic et confisqué mon stock. Je suis ruiné{|e} et j'ai mangé une banane tachée.", "J'ai stocké les desserts dans mon cartable. Le yaourt a explosé sur mon cahier de poésie et sur {w:object}. Le marché m'a puni{|e}."], en: ["Market crash: the canteen lady found the operation and seized my stock. I'm ruined and I ate a bruised banana.", "I stored the desserts in my schoolbag. A yogurt exploded on my poetry notebook and on {w:object}. The market punished me."] }, fx: { happy: -4, discipline: -2 } },
        ],
      },
      {
        label: { fr: 'Manger ta mousse', en: 'Just eat your mousse' },
        out: [
          { w: 1, text: { fr: ["J'ai mangé ma mousse lentement, en regardant les trafiquants dans les yeux. Certains plaisirs ne se vendent pas.", "J'ai mangé ma mousse. Elle était délicieuse. Le marché noir a continué sans moi. Je n'ai aucun regret."], en: ["I ate my mousse slowly, staring the dealers in the eye. Some pleasures aren't for sale.", "I ate my mousse. It was delicious. The black market carried on without me. No regrets."] }, fx: { happy: 4, health: 1 } },
        ],
      },
      {
        label: { fr: 'Dénoncer le trafic', en: 'Report the racket' },
        out: [
          { w: 2, text: { fr: ["J'ai prévenu la dame de la cantine. Le trafic a été démantelé. Le lendemain, quelqu'un a glissé {w:food} dans ma trousse. Le milieu n'oublie pas.", "J'ai tout balancé. Le CM2 a été privé de dessert un mois. Moi, j'ai été privé{|e} d'amis pour à peu près la même durée."], en: ["I told the canteen lady. The ring was dismantled. The next day someone slipped {w:food} into my pencil case. The underworld never forgets.", "I spilled everything. The fifth-grader lost dessert privileges for a month. I lost friends for about the same time."] }, fx: { happy: -3, karma: 3, discipline: 2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_museum_trip',
    icon: '🏛️',
    cat: 'school',
    cooldown: 3,
    when: { age: [6, 10], school: PRI },
    scene: { place: 'school', mood: 'happy' },
    text: {
      fr: [
        "Sortie scolaire au musée. Un panneau dit « NE PAS TOUCHER » à côté d'une statue romaine. Ta main te démange.",
        "Visite au musée d'histoire naturelle. Le squelette de dinosaure a l'air instable. La guide a dévié sur un sujet inattendu, {w:hobby}, et ça dure depuis quarante minutes.",
        "Sortie au musée d'art moderne. Une œuvre consiste en {w:object} posé sur un socle. Tu as la même chose à la maison.",
        "Sortie scolaire au musée. Le guide a la voix la plus monotone de l'univers. Ton camarade vient de s'endormir debout contre une momie.",
      ],
      en: [
        "School trip to the museum. A sign says “DO NOT TOUCH” next to a Roman statue. Your hand is itching.",
        "Natural history museum visit. The dinosaur skeleton looks unstable. The guide veered onto an unexpected topic, {w:hobby}, and it's been going on for forty minutes.",
        "Trip to the modern art museum. One artwork is {w:object} on a pedestal. You have the same thing at home.",
        "Museum trip. The guide has the most monotonous voice in the universe. Your classmate just fell asleep standing up against a mummy.",
      ],
    },
    choices: [
      {
        label: { fr: 'Toucher quand même', en: 'Touch it anyway' },
        out: [
          { w: 2, text: { fr: ["J'ai touché la statue. Une alarme a retenti. Un gardien a couru vers moi au ralenti. La classe entière a été évacuée {w:weather}. Je suis une légende.", "J'ai touché du bout du doigt. Rien ne s'est passé. Pas d'alarme, pas de malédiction. J'étais presque déçu{|e}."], en: ["I touched the statue. An alarm went off. A guard ran at me in slow motion. The whole class got evacuated {w:weather}. I'm a legend.", "I touched it with one fingertip. Nothing happened. No alarm, no curse. I was almost disappointed."] }, fx: { happy: 4, discipline: -3, grade: -1 } },
          { w: 1, text: { fr: ["J'ai touché, et le nez de la statue m'est resté dans la main. Non. Je rigole. Mais le gardien l'a cru une seconde et il a crié {w:exclaim}", "Un bout de l'œuvre d'art moderne s'est décollé. Personne n'a remarqué la différence. Même pas l'artiste, probablement."], en: ["I touched it and the statue's nose came off in my hand. No. Kidding. But the guard believed it for a second and yelled {w:exclaim}", "A piece of the modern artwork came loose. Nobody noticed the difference. Probably not even the artist."] }, fx: { happy: 5, karma: -2 } },
        ],
      },
      {
        label: { fr: 'Poser plein de questions', en: 'Ask loads of questions' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai posé [[douze|vingt|trente]] questions. Le guide a fini par me donner son badge et me laisser finir la visite à sa place. J'ai inventé la moitié des réponses.", "J'ai demandé si les momies faisaient caca. Le guide a répondu avec un sérieux absolu pendant dix minutes. J'ai tout retenu.", "J'ai demandé au guide si le musée avait déjà empaillé {w:animal}. Il m'a emmené{|e} dans une salle interdite au public. J'ai vu des choses. Je ne peux rien dire."], en: ["I asked [[twelve|twenty|thirty]] questions. The guide eventually gave me his badge and let me finish the tour. I made up half the answers.", "I asked if mummies pooped. The guide answered with total seriousness for ten minutes. I remembered all of it.", "I asked the guide whether the museum had ever stuffed {w:animal}. He took me to a room closed to the public. I saw things. I can't say more."] }, fx: { smarts: 4, grade: 2 } },
        ],
      },
      {
        label: { fr: 'Filer à la boutique', en: 'Sneak to the gift shop' },
        out: [
          { w: 2, text: { fr: ["J'ai fui vers la boutique et dépensé tout mon argent de poche dans {w:object} à l'effigie d'un pharaon. On m'a cherché{|e} pendant vingt minutes.", "Je me suis caché{|e} dans la boutique. Les accompagnateurs m'ont retrouvé{|e} en train de lire un livre sur {w:animal}. Punition douce."], en: ["I fled to the shop and spent all my pocket money on {w:object} with a pharaoh on it. They searched for me for twenty minutes.", "I hid in the gift shop. The chaperones found me reading a book about {w:animal}. Gentle punishment."] }, fx: { happy: 3, discipline: -2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_bus_seat',
    icon: '🚌',
    cat: 'friends',
    cooldown: 3,
    actor: { role: 'classmate', create: { role: 'classmate', age: [-1, 1], gender: 'any' } },
    when: { age: [5, 10], school: [PRE, PRI] },
    scene: { place: 'school', mood: 'neutral' },
    text: {
      fr: [
        "Sortie scolaire ! Dans le car, il faut choisir son voisin. Ton meilleur copain est déjà pris. Il reste {a.first}, qui sent {w:smell}, et la place à côté de la maîtresse.",
        "Le car de la sortie démarre dans dix secondes. La seule place libre est à côté de {a.first}, qui a le mal des transports et un sachet vide sur les genoux.",
        "Dans le car, les places du fond sont réservées aux « grands ». {a.first} te propose de les prendre d'assaut avec {a.him}.",
        "Trajet en car pour aller {w:to_place}. {a.first} a apporté un sac entier de bonbons et cherche un voisin de confiance.",
      ],
      en: [
        "School trip! On the bus you have to choose a seatmate. Your best friend is taken. There's {a.first}, who smells like {w:smell}, or the seat next to the teacher.",
        "The trip bus leaves in ten seconds. The only free seat is next to {a.first}, who gets carsick and has an empty bag on their lap.",
        "On the bus, the back seats are reserved for the “big kids”. {a.first} suggests storming them together.",
        "Bus ride {w:to_place}. {a.first} brought a whole bag of candy and is looking for a trustworthy seatmate.",
      ],
    },
    choices: [
      {
        label: { fr: 'S\'asseoir avec {a.first}', en: 'Sit with {a.first}' },
        out: [
          { w: 2, text: { fr: ["On a joué au pendu sur la vitre embuée pendant tout le trajet. {a.first} est devenu{a:|e} mon pote. Le car est un formidable accélérateur d'amitié.", "{a.first} m'a raconté toute sa vie, y compris le jour où {a:il|elle} a vu {w:animal} manger {w:food}. J'ai un nouvel ami.", "{a.first} et moi avons compté les vaches et chanté {w:song} à tue-tête. Le chauffeur a monté la radio pour nous couvrir. Amitié scellée."], en: ["We played hangman on the fogged-up window the whole way. {a.first} became my buddy. The bus is an incredible friendship accelerator.", "{a.first} told me their whole life story, including the day they saw {w:animal} eat {w:food}. I have a new friend.", "{a.first} and I counted cows and belted out {w:song}. The driver turned up the radio to drown us out. Friendship sealed."] }, fx: { happy: 4, rel: 15, actorRole: 'friend' } },
          { w: 1, rating: 1, text: { fr: ["{a.first} a vomi au deuxième rond-point. Pas dans le sachet. J'ai fait la sortie avec un pantalon prêté par le chauffeur. Il fait du XXL.", "{a.first} a mangé tous les bonbons, puis a vomi un arc-en-ciel sur mes chaussures. On ne sera jamais amis, mais on a vécu quelque chose."], en: ["{a.first} threw up at the second roundabout. Not in the bag. I spent the trip in pants borrowed from the driver. He's an XXL.", "{a.first} ate all the candy, then puked a rainbow on my shoes. We'll never be friends, but we went through something."] }, fx: { happy: -4, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Prendre le fond du car', en: 'Take the back seats' },
        out: [
          { w: 2, text: { fr: ["On a pris les places du fond. Les grands ont protesté, puis respecté. J'ai chanté {w:song} à pleins poumons pendant tout le trajet. Gloire.", "On a squatté le fond du car. Chaque dos-d'âne nous a fait décoller de dix centimètres. Le meilleur manège du monde, et gratuit."], en: ["We took the back seats. The big kids protested, then showed respect. I sang {w:song} at the top of my lungs the whole way. Glory.", "We camped at the back of the bus. Every speed bump launched us four inches. Best ride in the world, and free."] }, fx: { happy: 5, discipline: -2 } },
          { w: 1, text: { fr: ["Les grands nous ont expulsés en deux secondes. J'ai fini à côté de la maîtresse, qui m'a parlé pendant une heure de sa grande passion, {w:hobby}.", "Le chauffeur a stoppé le car sur la bande d'arrêt d'urgence pour nous renvoyer à l'avant. Humiliation publique, sous les klaxons."], en: ["The big kids kicked us out in two seconds. I ended up next to the teacher, who told me about her great passion, {w:hobby}, for an hour.", "The driver pulled onto the hard shoulder to send us to the front. Public humiliation, with honking."] }, fx: { happy: -3, discipline: 1 } },
        ],
      },
      {
        label: { fr: 'À côté de la maîtresse', en: 'Next to the teacher' },
        out: [
          { w: 1, text: { fr: ["Je me suis assis{|e} à côté de la maîtresse. Elle m'a laissé{|e} tenir le micro du car. J'ai annoncé les virages. Je suis né{|e} pour ça.", "La maîtresse m'a fait réviser les capitales pendant tout le trajet. J'ai appris que celle du Pérou est Lima. Je n'avais rien demandé."], en: ["I sat next to the teacher. She let me hold the bus microphone. I announced the turns. I was born for this.", "The teacher drilled me on capital cities the entire ride. I learned that Peru's is Lima. I didn't ask."] }, fx: { smarts: 2, grade: 1, happy: -1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_kermesse_dance',
    icon: '💃',
    cat: 'school',
    once: true,
    when: { age: [5, 10], school: [PRE, PRI] },
    scene: { place: 'school', mood: 'party' },
    text: {
      fr: [
        "Kermesse de fin d'année : ta classe danse sur {w:song}. Tu es au premier rang. Tu ne connais que le début de la chorégraphie.",
        "Fête de l'école : spectacle de danse devant tous les parents. Ton costume est un sac-poubelle découpé en tutu. Ton tour arrive.",
        "La chorale de l'école chante pour la fête de fin d'année. Tu as oublié les paroles du deuxième couplet, et le micro est juste devant toi.",
        "Spectacle de la kermesse : vous dansez déguisés en [[légumes|planètes|abeilles]]. Les parents brandissent leurs téléphones comme des paparazzis.",
      ],
      en: [
        "End-of-year school fair: your class is dancing to {w:song}. You're in the front row. You only know the start of the routine.",
        "School fête: dance show in front of all the parents. Your costume is a trash bag cut into a tutu. Your turn is coming.",
        "The school choir sings at the end-of-year party. You forgot the words to the second verse, and the mic is right in front of you.",
        "School fair show: you're dancing dressed as [[vegetables|planets|bees]]. Parents wave their phones like paparazzi.",
      ],
    },
    choices: [
      {
        label: { fr: 'Improviser à fond', en: 'Improvise wildly' },
        out: [
          { w: 2, text: { fr: ["J'ai improvisé un grand écart, une roulade et un salut militaire. Le public a hurlé. La maîtresse a eu un tic à l'œil.", "J'ai dansé n'importe comment avec une conviction totale. Les parents ont cru que c'était prévu. Un papa m'a demandé où je prenais des cours.", "J'ai terminé la danse en imitant {w:celeb}. Les parents ont hurlé de rire. La maîtresse a fait semblant que c'était prévu."], en: ["I improvised a split, a forward roll and a military salute. The crowd went wild. The teacher's eye twitched.", "I danced like a maniac with total conviction. The parents thought it was choreographed. A dad asked where I take lessons.", "I ended the dance with an impression of {w:celeb}. The parents howled. The teacher pretended it was planned."] }, fx: { happy: 6, athletic: 2, looks: 1 } },
          { w: 1, text: { fr: ["J'ai improvisé une glissade sur les genoux et j'ai fini dans le décor. Le soleil en carton est tombé sur la tête d'un camarade. C'est sur toutes les vidéos.", "Mon improvisation a entraîné toute la rangée. La chorégraphie a dégénéré en pogo. Le directeur a coupé la musique en criant {w:exclaim}"], en: ["I improvised a knee slide and crashed into the set. The cardboard sun fell on a classmate's head. It's on every video.", "My improv dragged the whole row along. The routine turned into a mosh pit. The principal cut the music, yelling {w:exclaim}"] }, fx: { happy: 3, discipline: -2 } },
        ],
      },
      {
        label: { fr: 'Copier le voisin', en: 'Copy the kid next to you' },
        out: [
          { w: 2, text: { fr: ["J'ai copié chaque geste avec une demi-seconde de retard. Sur la vidéo, on dirait un écho. Ma grand-mère a dit que c'était « artistique ».", "J'ai copié mon voisin, qui copiait son voisin, qui avait tout faux. Une rangée entière dans le mauvais sens. Solidarité."], en: ["I copied every move half a second late. On video it looks like an echo. My grandma called it “artistic”.", "I copied my neighbor, who copied his neighbor, who had it all wrong. A whole row going the wrong way. Solidarity."] }, fx: { happy: 2 } },
        ],
      },
      {
        label: { fr: 'Se figer sur scène', en: 'Freeze on stage' },
        out: [
          { w: 1, text: { fr: ["Je me suis figé{|e} comme une statue pendant toute la chanson. Mon père a crié « BRAVO » à la fin. Le seul à applaudir une statue.", "Paralysé{|e}, j'ai fixé le public en silence. Un petit de maternelle s'est mis à pleurer. La musique s'est arrêtée. J'ai salué. Gros succès, bizarrement."], en: ["I froze like a statue for the entire song. My dad yelled “BRAVO” at the end. The only one cheering for a statue.", "Paralyzed, I stared at the audience in silence. A preschooler started crying. The music stopped. I bowed. Weirdly, a big hit."] }, fx: { happy: -3, smarts: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_playground_king',
    icon: '👑',
    cat: 'friends',
    rating: 1,
    cooldown: 3,
    actor: { role: 'classmate', create: { role: 'classmate', age: [0, 2], gender: 'any' } },
    when: { age: [6, 10], school: PRI },
    scene: { place: 'school', mood: 'angry' },
    text: {
      fr: [
        "{a.first} s'est autoproclamé{a:|e} « chef de la cage à poules ». Pour monter, il faut lui donner une bille et l'appeler « Majesté ».",
        "Dans la cour, {a.first} décide qui joue au foot et qui fait les cages. Aujourd'hui, tu fais les cages. Et tu fais aussi le poteau.",
        "{a.first} a créé une liste noire de la récré. Ton nom est dessus, au feutre, avec la mention « {w:insult} ».",
        "{a.first} règne sur la cour avec une bande de trois CE2 et une règle de 30 cm. Il t'a désigné{|e} comme nouveau sujet.",
      ],
      en: [
        "{a.first} has proclaimed themself “ruler of the climbing frame”. To climb, you pay one marble and call them “Your Majesty”.",
        "In the playground, {a.first} decides who plays soccer and who's in goal. Today you're in goal. And also the goalpost.",
        "{a.first} made a recess blacklist. Your name is on it, in marker, with the note “{w:insult}”.",
        "{a.first} rules the playground with a gang of three third-graders and a ruler. You've been declared a new subject.",
      ],
    },
    choices: [
      {
        label: { fr: 'Organiser une révolution', en: 'Start a revolution' },
        out: [
          { w: 2, odds: { smarts: 1, athletic: 1 }, text: { fr: ["J'ai rallié les CP, les CE1 et un CM2 déserteur. On a pris la cage à poules à l'assaut. {a.first} a été destitué{a:|e}. J'ai instauré la démocratie et un goûter partagé.", "Révolution réussie. La cage à poules est désormais publique. Les historiens de la récré parleront de « la Libération de mardi ».", "On a renversé le régime de {a.first} en lui offrant {w:food} pendant que mes troupes prenaient la cage à poules. Diplomatie et trahison : je suis prêt{|e} pour la politique."], en: ["I rallied the first-graders, the second-graders and a fifth-grade deserter. We stormed the climbing frame. {a.first} was overthrown. I established democracy and shared snacks.", "Revolution successful. The climbing frame is now public. Recess historians will call it “the Tuesday Liberation”.", "We toppled {a.first}'s regime by offering them {w:food} while my troops seized the climbing frame. Diplomacy and betrayal: I'm ready for politics."] }, fx: { happy: 6, karma: 3, rel: -15 } },
          { w: 1, text: { fr: ["La révolution a tourné à la bagarre générale. J'ai pris un coup de coude dans le nez, j'ai saigné un peu sur mon pull et j'ai fini chez le directeur. Héros blessé{|e}.", "Mes troupes m'ont trahi{|e} contre des bonbons. {a.first} m'a condamné{|e} à faire les cages jusqu'à Noël. Le pouvoir corrompt."], en: ["The revolution turned into a brawl. I took an elbow to the nose, bled a bit on my sweater and ended up in the principal's office. Wounded hero.", "My troops betrayed me for candy. {a.first} sentenced me to be goalkeeper until Christmas. Power corrupts."] }, fx: { happy: -4, health: -3, discipline: -2 } },
        ],
      },
      {
        label: { fr: 'Payer la bille', en: 'Pay the marble' },
        out: [
          { w: 2, text: { fr: ["J'ai payé la bille et dit « Majesté ». J'ai pu monter. Mais une part de moi est restée en bas, avec ma dignité.", "J'ai payé, puis j'ai découvert que {a.first} revendait les billes aux CM1. Je finance un empire."], en: ["I paid the marble and said “Your Majesty”. I got to climb. But part of me stayed on the ground, with my dignity.", "I paid, then found out {a.first} resells the marbles to the fourth-graders. I'm funding an empire."] }, fx: { happy: -2, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Créer ton propre royaume', en: 'Start your own kingdom' },
        out: [
          { w: 2, text: { fr: ["J'ai fondé le royaume du banc près des toilettes. Population : trois sujets et {w:animal}. On a nos propres lois. Pas de rois. Sauf moi.", "J'ai proclamé l'indépendance du coin du préau. On a un drapeau : {w:object} accroché à un bâton. C'est un État fragile mais fier."], en: ["I founded the kingdom of the bench near the toilets. Population: three subjects and {w:animal}. We have our own laws. No kings. Except me.", "I declared independence for the corner of the covered yard. We have a flag: {w:object} on a stick. A fragile but proud nation."] }, fx: { happy: 4, smarts: 2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_secret_club',
    icon: '🕵️',
    cat: 'friends',
    cooldown: 3,
    actor: 'anyFriend',
    when: { age: [6, 11], has: 'anyFriend' },
    scene: { place: 'park', mood: 'happy' },
    text: {
      fr: [
        "{a.first} et toi fondez un club secret. Il faut un nom, un mot de passe et une cachette. {a.first} propose « {w:nickname} » comme nom de code.",
        "Le club secret que tu as fondé avec {a.first} a un local : derrière le cabanon du jardin. Il manque un règlement et un serment solennel.",
        "{a.first} veut faire entrer dans votre club secret un nouveau membre qui a {w:object}. C'est un pot-de-vin évident.",
        "Votre club secret a un problème : tout le monde à l'école connaît le mot de passe. C'est « [[banane|caca|mot de passe]] ».",
      ],
      en: [
        "You and {a.first} are founding a secret club. You need a name, a password and a hideout. {a.first} suggests “{w:nickname}” as a code name.",
        "Your secret club with {a.first} has a headquarters: behind the garden shed. It still needs rules and a solemn oath.",
        "{a.first} wants to let a new member into your secret club because they own {w:object}. It's obviously a bribe.",
        "Your secret club has a problem: everyone at school knows the password. It's “[[banana|poop|password]]”.",
      ],
    },
    choices: [
      {
        label: { fr: 'Écrire un serment', en: 'Write an oath' },
        out: [
          { w: 2, text: { fr: ["On a écrit un serment sur une feuille, signé avec du jus de mûre et enterré sous un arbre, avec {w:object}. Personne ne le retrouvera. Nous non plus.", "Notre serment fait onze pages et interdit les brocolis. {a.first} a pleuré en le lisant. C'est ça, l'amitié.", "Notre serment oblige chaque membre à protéger {w:object}, le trésor sacré du club. On ne sait pas pourquoi. C'est ça, la tradition."], en: ["We wrote an oath on a sheet of paper, signed it in blackberry juice and buried it under a tree, along with {w:object}. Nobody will ever find it. Neither will we.", "Our oath is eleven pages long and bans broccoli. {a.first} cried reading it. That's friendship.", "Our oath requires every member to protect {w:object}, the club's sacred treasure. We don't know why. That's tradition."] }, fx: { happy: 5, rel: 15 } },
        ],
      },
      {
        label: { fr: 'Accepter le pot-de-vin', en: 'Accept the bribe' },
        rating: 1,
        out: [
          { w: 2, text: { fr: ["On a accepté le nouveau membre contre {w:object}. Deux jours plus tard, il a révélé tous nos secrets à sa mère. Le club est corrompu jusqu'à la moelle.", "Le pot-de-vin était excellent. Le club compte désormais douze membres, dont aucun ne sait pourquoi il est là. On est un vrai parti politique."], en: ["We let the new member in for {w:object}. Two days later he told his mom all our secrets. The club is rotten to the core.", "The bribe was excellent. The club now has twelve members, none of whom know why they're there. We're a real political party."] }, fx: { happy: 3, karma: -3, smarts: 1 } },
        ],
      },
      {
        label: { fr: 'Changer de mot de passe', en: 'Change the password' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["Nouveau mot de passe : « anticonstitutionnellement ». Plus personne ne peut entrer. Même pas {a.first}, qui ne sait pas l'écrire.", "On a inventé un code secret avec des clins d'œil et des claquements de langue. On ressemble à deux pigeons en panne. Mais c'est sécurisé."], en: ["New password: “antidisestablishmentarianism”. Nobody can get in. Not even {a.first}, who can't spell it.", "We invented a code with winks and tongue clicks. We look like two broken pigeons. But it's secure."] }, fx: { happy: 3, smarts: 2, rel: 5 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_teacher_rumor',
    icon: '🗣️',
    cat: 'school',
    rating: 1,
    cooldown: 4,
    when: { age: [6, 10], school: PRI },
    scene: { place: 'school', mood: 'shock' },
    text: {
      fr: [
        "Rumeur dans la cour : le maître serait {w:weird_job} la nuit. Tout le monde t'écoute, parce que tu as « une info ».",
        "Tu as vu la maîtresse {w:at_place}, en jogging, en train de manger {w:food}. C'est une révélation de la plus haute importance.",
        "Quelqu'un a lancé la rumeur que le directeur cache {w:animal} dans son bureau. Tu pourrais en rajouter une couche.",
        "Une rumeur dit que la maîtresse dort à l'école, dans le placard à craies. Tu as l'occasion de vérifier.",
      ],
      en: [
        "Playground rumor: the teacher is {w:weird_job} at night. Everyone's listening to you, because you “have intel”.",
        "You saw the teacher {w:at_place}, in sweatpants, eating {w:food}. This is information of the highest importance.",
        "Someone started a rumor that the principal keeps {w:animal} hidden in his office. You could add fuel to the fire.",
        "Rumor says the teacher sleeps at school, in the chalk cupboard. You have a chance to check.",
      ],
    },
    choices: [
      {
        label: { fr: 'En rajouter', en: 'Embellish it' },
        out: [
          { w: 2, text: { fr: ["J'ai ajouté que le maître avait un tatouage de dragon et un casier judiciaire. À midi, toute l'école le savait. À 14 h, le maître le savait aussi.", "J'ai raconté que la maîtresse parlait aux pigeons. Le lendemain, elle a nourri un pigeon devant la classe. Coïncidence ? La rumeur est devenue vérité.", "J'ai ajouté que la maîtresse avait combattu {w:animal} à mains nues {w:far_place}. Depuis, plus personne ne bavarde en classe. J'ai rendu service à l'Éducation nationale."], en: ["I added that the teacher had a dragon tattoo and a criminal record. By lunch the whole school knew. By 2 p.m., so did the teacher.", "I said the teacher talks to pigeons. The next day she fed a pigeon in front of the class. Coincidence? The rumor became truth.", "I added that the teacher once fought {w:animal} bare-handed {w:far_place}. Since then nobody talks in class. I've done education a favor."] }, fx: { happy: 4, karma: -3, grade: -2 } },
          { w: 1, text: { fr: ["Le maître a convoqué « l'auteur de la rumeur ». Toute la classe m'a regardé{|e}. J'ai écrit cent fois « je ne colporte pas de ragots ». J'ai colporté pendant l'écriture.", "La rumeur est arrivée aux oreilles des parents. Ma mère m'a demandé si c'était vrai. J'ai dit oui. Elle a dit « je m'en doutais ». Ça empire."], en: ["The teacher summoned “the author of the rumor”. The whole class looked at me. I wrote “I do not spread gossip” a hundred times. I gossiped while writing.", "The rumor reached the parents. My mom asked if it was true. I said yes. She said “I knew it”. It's getting worse."] }, fx: { happy: -3, discipline: 2, grade: -2 } },
        ],
      },
      {
        label: { fr: 'Mener l\'enquête', en: 'Investigate' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai monté une enquête avec loupe et carnet. Conclusion : la maîtresse est juste une personne normale qui aime {w:hobby}. La vérité est décevante.", "J'ai ouvert le placard à craies. Il y avait un sac de couchage. Et {w:object}. Je n'en ai parlé à personne. Certains secrets sont trop lourds."], en: ["I ran an investigation with a magnifying glass and a notebook. Conclusion: the teacher is just a normal person who likes {w:hobby}. The truth is disappointing.", "I opened the chalk cupboard. There was a sleeping bag. And {w:object}. I told no one. Some secrets are too heavy."] }, fx: { smarts: 3, happy: 2 } },
        ],
      },
      {
        label: { fr: 'Défendre le prof', en: 'Defend the teacher' },
        out: [
          { w: 1, text: { fr: ["J'ai dit que c'étaient des bêtises. Les autres m'ont traité{|e} de chouchou. Le maître m'a souri le lendemain. Il sait. Il sait toujours.", "J'ai défendu la maîtresse en expliquant que les adultes ont le droit de manger ce qu'ils veulent. Silence respectueux dans la cour."], en: ["I said it was nonsense. The others called me teacher's pet. The teacher smiled at me the next day. He knows. He always knows.", "I defended the teacher, explaining that grown-ups can eat what they want. Respectful silence in the playground."] }, fx: { karma: 3, grade: 2, happy: -1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_lines',
    icon: '📝',
    cat: 'school',
    rating: 1,
    cooldown: 3,
    when: { age: [7, 11] },
    scene: { place: 'home', mood: 'sad' },
    text: {
      fr: [
        "Punition : tu dois copier [[cent|deux cents|cinq cents]] fois « Je ne dois pas lancer de gomme sur mes camarades ». Pour demain.",
        "Le maître t'a donné des lignes parce que tu as dit « {w:insult} » à un camarade. Tu as cent lignes et un poignet très fragile.",
        "Lignes à copier : « Je ne dois pas imiter {w:animal} en classe ». Tu trouves la punition injuste, l'imitation était parfaite.",
        "Punition à faire signer par tes parents : cent lignes. Tu as un stylo, trois crayons et une idée.",
      ],
      en: [
        "Punishment: copy “I must not throw erasers at my classmates” [[a hundred|two hundred|five hundred]] times. Due tomorrow.",
        "The teacher gave you lines for calling a classmate “{w:insult}”. You have a hundred lines and a very fragile wrist.",
        "Lines to copy: “I must not imitate {w:animal} in class”. You find it unfair, the imitation was perfect.",
        "Punishment to get signed by your parents: a hundred lines. You have one pen, three pencils and an idea.",
      ],
    },
    choices: [
      {
        label: { fr: 'Scotcher trois stylos', en: 'Tape three pens together' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai scotché trois stylos ensemble. Trois lignes à la fois. J'ai fini en vingt minutes. Je suis un{|e} ingénieur{|e} de la flemme.", "Le système à trois stylos a marché, mais les lignes penchent comme une colline. Le maître a dit « astucieux » sans sourire. Il était impressionné.", "J'ai bricolé une machine à lignes avec des élastiques et {w:object}. Elle a fait quarante lignes avant d'exploser. J'ai fini le reste à la main, mais avec fierté."], en: ["I taped three pens together. Three lines at once. Done in twenty minutes. I'm an engineer of laziness.", "The three-pen rig worked, but the lines slope like a hill. The teacher said “clever” without smiling. He was impressed.", "I rigged a line-writing machine with rubber bands and {w:object}. It did forty lines before exploding. I finished the rest by hand, proudly."] }, fx: { smarts: 3, happy: 3 } },
          { w: 1, text: { fr: ["Le maître a reconnu la technique des trois stylos. Il m'a donné deux cents lignes de plus, à faire avec un seul stylo, devant lui.", "Les stylos se sont décalés. Mes lignes disent « Je ne dois pas lancer de gomme » en escalier. Le maître a eu mal au cou."], en: ["The teacher recognized the three-pen trick. He gave me two hundred more lines, to be done with one pen, in front of him.", "The pens slipped. My lines say “I must not throw erasers” in a staircase. The teacher got a stiff neck."] }, fx: { happy: -4, discipline: 2 } },
        ],
      },
      {
        label: { fr: 'Faire faire par un frangin', en: 'Get a sibling to do it' },
        if: { has: 'sibling' },
        out: [
          { w: 2, text: { fr: ["J'ai payé un membre de ma fratrie avec mon dessert de toute la semaine. Son écriture ressemble à des pattes de mouche. Le maître n'a rien vu. Ou a fait semblant.", "J'ai sous-traité les lignes. Prix : un mois de vaisselle et {w:object}. L'économie familiale est brutale."], en: ["I paid my sibling with my dessert for the whole week. Their handwriting looks like spider legs. The teacher didn't notice. Or pretended.", "I outsourced the lines. Payment: a month of dish duty and {w:object}. The family economy is brutal."] }, fx: { happy: 2, karma: -2 } },
        ],
      },
      {
        label: { fr: 'Copier honnêtement', en: 'Do them honestly' },
        out: [
          { w: 1, text: { fr: ["J'ai copié chaque ligne jusqu'à minuit. Ma main a pris la forme d'une pince de crabe. Je ne lancerai plus jamais de gomme. Plus jamais rien, d'ailleurs.", "J'ai fait les lignes en écoutant {w:song}. À la centième, je connaissais la chanson et la phrase par cœur. Ça ne m'a rien appris d'autre."], en: ["I copied every line until midnight. My hand turned into a crab claw. I'll never throw an eraser again. Or anything, really.", "I did the lines while listening to {w:song}. By the hundredth I knew the song and the sentence by heart. I learned nothing else."] }, fx: { discipline: 4, happy: -3, health: -1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_pen_pal',
    icon: '✉️',
    cat: 'school',
    once: true,
    when: { age: [7, 10], school: PRI },
    scene: { place: 'school', mood: 'happy' },
    text: {
      fr: [
        "La classe a des correspondants {w:far_place}. Le tien s'appelle Kofi, il a {age} ans, {w:animal} comme animal de compagnie et une passion pour {w:hobby}. Il attend ta lettre.",
        "Ton correspondant étranger t'a envoyé une lettre avec une photo de sa maison {w:far_place}. Elle est bien plus impressionnante que la tienne.",
        "Projet de classe : écrire à un correspondant {w:far_place}. Tu ne sais pas quoi raconter sur ta vie, qui consiste surtout en {w:show}.",
        "Ta correspondante t'a écrit qu'elle fait du ski pour aller à l'école. Tu dois répondre. Toi, tu vas à l'école à pied, à côté d'une boulangerie.",
      ],
      en: [
        "Your class has pen pals {w:far_place}. Yours is called Kofi, he's {age}, has {w:animal} as a pet and loves {w:hobby}. He's waiting for your letter.",
        "Your foreign pen pal sent a letter with a photo of his house {w:far_place}. It's far more impressive than yours.",
        "Class project: write to a pen pal {w:far_place}. You don't know what to say about your life, which is mostly {w:show}.",
        "Your pen pal wrote that she skis to school. You have to reply. You walk to school, past a bakery.",
      ],
    },
    choices: [
      {
        label: { fr: 'Embellir ta vie', en: 'Exaggerate your life' },
        out: [
          { w: 2, text: { fr: ["J'ai écrit que j'habitais dans un château avec {w:animal} comme animal de compagnie et que mon père était {w:weird_job}. Mon correspondant m'a cru{|e}. Je dois maintenant tenir le mensonge à vie.", "J'ai raconté que je connaissais {w:celeb}. La réponse est arrivée trois semaines plus tard : « Moi aussi. » On ment tous les deux. C'est une belle amitié.", "J'ai raconté que je dressais {w:animal} pour le cirque. Mon correspondant m'a demandé une photo. J'ai envoyé une photo du chat déguisé. Il a été très impressionné."], en: ["I wrote that I live in a castle with {w:animal} as a pet and that my dad is {w:weird_job}. My pen pal believed it. Now I have to keep the lie going forever.", "I said I knew {w:celeb}. The reply came three weeks later: “Me too.” We're both lying. It's a beautiful friendship.", "I said I train {w:animal} for the circus. My pen pal asked for a photo. I sent one of the cat in costume. He was very impressed."] }, fx: { happy: 4, karma: -1, smarts: 1 } },
        ],
      },
      {
        label: { fr: 'Raconter la vérité', en: 'Tell the truth' },
        out: [
          { w: 2, text: { fr: ["J'ai raconté ma vraie vie, avec la cantine et la boulangerie. Ma correspondante, qui vit {w:far_place}, a trouvé ça « exotique ». Tout est relatif.", "J'ai décrit ma ville en détail. Mon correspondant veut venir la visiter. Il pense que c'est une capitale mondiale. Je n'ai pas eu le cœur de le contredire."], en: ["I described my real life, canteen and bakery included. My pen pal, who lives {w:far_place}, found it “exotic”. Everything is relative.", "I described my town in detail. My pen pal wants to visit. He thinks it's a world capital. I didn't have the heart to correct him."] }, fx: { happy: 3, smarts: 3, karma: 2, grade: 2 } },
        ],
      },
      {
        label: { fr: 'Oublier de répondre', en: 'Forget to reply' },
        out: [
          { w: 1, text: { fr: ["J'ai oublié de répondre pendant six mois. Ma correspondante a écrit à la maîtresse pour savoir si j'étais mort{|e}. Gros malaise.", "Ma lettre est restée au fond de mon cartable jusqu'à l'été. Elle est arrivée avec un an de retard et une tache de compote. Il a répondu « merci quand même »."], en: ["I forgot to reply for six months. My pen pal wrote to the teacher asking if I'd died. Big awkward.", "My letter stayed at the bottom of my bag until summer. It arrived a year late with an applesauce stain. He replied “thanks anyway”."] }, fx: { happy: -2, grade: -2 } },
        ],
      },
    ],
  },

  {
    id: 'k2_pri_class_fart',
    icon: '💨',
    cat: 'school',
    rating: 1,
    cooldown: 3,
    when: { age: [6, 11] },
    scene: { place: 'school', mood: 'shock', fx: 'poop' },
    text: {
      fr: [
        "En plein contrôle de maths, dans un silence de cathédrale, tu sens arriver {w:sound}. Ça ne va pas être discret.",
        "La classe est silencieuse. Tu viens de lâcher un pet. Silencieux, lui aussi. Mais une odeur se répand : {w:smell}, en pire.",
        "Pendant la minute de lecture silencieuse, quelqu'un a pété. Tous les regards se tournent vers toi. Tu es innocent{|e}. Probablement.",
        "Tu as mangé {w:food} à la cantine. Il est 14 h, le maître explique les fractions, et ton ventre prépare une révolution.",
      ],
      en: [
        "In the middle of a math test, in cathedral silence, you feel {w:sound} coming. This won't be discreet.",
        "The class is silent. You just farted. Silently, too. But a smell is spreading: {w:smell}, only worse.",
        "During silent reading, someone farted. Every head turns toward you. You're innocent. Probably.",
        "You ate {w:food} at lunch. It's 2 p.m., the teacher is explaining fractions, and your stomach is planning a revolution.",
      ],
    },
    choices: [
      {
        label: { fr: 'Accuser le voisin', en: 'Blame your neighbor' },
        out: [
          { w: 2, text: { fr: ["J'ai pointé mon voisin du doigt en criant « C'EST LUI ! ». Il a nié en rougissant, ce qui l'a rendu encore plus coupable. Je dors très bien.", "J'ai regardé mon voisin avec dégoût. Toute la classe a suivi mon regard. Il porte désormais le surnom de « {w:nickname} ». Je suis un monstre."], en: ["I pointed at my neighbor and yelled “IT WAS HIM!”. He denied it, blushing, which made him look even guiltier. I sleep fine.", "I gave my neighbor a disgusted look. The whole class followed my gaze. He's now known as “{w:nickname}”. I'm a monster."] }, fx: { happy: 4, karma: -4 } },
          { w: 1, text: { fr: ["« Celui qui l'a dit, c'est celui qui l'a fait », a répondu mon voisin. Argument imparable. Toute la classe s'est retournée contre moi.", "Le maître a dit calmement : « Celui qui accuse en premier, c'est toujours le coupable. » Je ne savais pas qu'il connaissait cette loi."], en: ["“Whoever smelt it dealt it,” my neighbor replied. Unbeatable argument. The whole class turned on me.", "The teacher said calmly, “The first one to accuse is always the culprit.” I didn't know he knew that law."] }, fx: { happy: -4, looks: -2 } },
        ],
      },
      {
        label: { fr: 'Assumer fièrement', en: 'Own it proudly' },
        out: [
          { w: 2, text: { fr: ["J'ai levé la main : « C'est moi, et je n'ai pas honte. » Applaudissements nourris. Le maître a ouvert les fenêtres en riant malgré lui.", "J'ai assumé en saluant. On m'appelle « {w:nickname} » depuis. C'est le meilleur surnom que j'aurai de ma vie.", "J'ai salué et dit : « Merci, j'ai mangé {w:food} à midi. » La classe a applaudi. Le maître a noté quelque chose dans son carnet, en souriant."], en: ["I raised my hand: “It was me, and I'm not ashamed.” Thunderous applause. The teacher opened the windows, laughing despite himself.", "I owned it with a bow. They've called me “{w:nickname}” ever since. It's the best nickname I'll ever have.", "I bowed and said, “Thank you, I had {w:food} for lunch.” The class applauded. The teacher wrote something in his notebook, smiling."] }, fx: { happy: 5, karma: 2, discipline: -2 } },
        ],
      },
      {
        label: { fr: 'Serrer les fesses', en: 'Clench and pray' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai serré les fesses pendant deux heures. Je suis sorti{|e} de classe avec le visage violet et une crampe dans {w:bodypart}. Mais personne ne saura jamais.", "J'ai tenu jusqu'à la récré. Je suis allé{|e} relâcher la pression derrière le préau, {w:weather}. Soulagement d'une intensité rare."], en: ["I clenched for two hours. I left class purple-faced with a cramp in my {w:bodypart}. But nobody will ever know.", "I held it until recess. I released the pressure behind the covered yard, {w:weather}. A relief of rare intensity."] }, fx: { discipline: 3, health: -1 } },
          { w: 1, text: { fr: ["J'ai serré. Ça a fait {w:sound}, en pire, comme un ballon qui se dégonfle. Toute la classe a éclaté de rire. Le maître aussi.", "J'ai lutté héroïquement. J'ai perdu. Ça a résonné dans toute la salle : {w:sound}. Même le hamster de la classe s'est retourné."], en: ["I clenched. It came out as {w:sound}, but worse, like a deflating balloon. The whole class burst out laughing. So did the teacher.", "I fought heroically. I lost. It echoed through the whole room: {w:sound}. Even the class hamster turned around."] }, fx: { happy: -5, looks: -2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_nurse_bluff',
    icon: '🤒',
    cat: 'school',
    rating: 1,
    cooldown: 3,
    when: { age: [6, 11], school: PRI },
    scene: { place: 'school', mood: 'sick' },
    text: {
      fr: [
        "Contrôle de géographie dans dix minutes. Tu sens monter un mal de ventre très soudain, très opportun et totalement imaginaire.",
        "Tu n'as pas appris ta poésie. L'infirmerie est au bout du couloir. On dit que l'infirmière donne des bonbons au miel et un lit de camp.",
        "Tu as un léger mal de tête. Avec un peu de talent d'acteur, ça pourrait devenir une demi-journée {w:at_place}… ou au moins à l'infirmerie.",
        "Sport à 10 h : endurance sous la pluie. Soudain, {w:bodypart} te fait atrocement souffrir. Enfin, pourrait te faire souffrir.",
      ],
      en: [
        "Geography test in ten minutes. You feel a stomachache coming on: very sudden, very convenient and totally imaginary.",
        "You didn't learn your poem. The nurse's office is down the hall. Word is, the nurse hands out honey drops and a cot.",
        "You have a slight headache. With a little acting talent, it could become half a day {w:at_place}… or at least in the nurse's office.",
        "Gym at 10: endurance running in the rain. Suddenly your {w:bodypart} hurts a lot. Well, it could.",
      ],
    },
    choices: [
      {
        label: { fr: 'Jouer la grande scène', en: 'Give an Oscar performance' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["Je me suis tordu{|e} de douleur comme dans {w:movie}. L'infirmière a appelé mes parents. J'ai passé l'après-midi sur le canapé avec {w:show}. Je mérite un César.", "J'ai gémi, transpiré, et dit « je vois des étoiles ». L'infirmière m'a gardé{|e} toute la matinée avec une bouillotte. Le contrôle s'est fait sans moi.", "J'ai montré {w:bodypart} en gémissant que ça « tirait ». L'infirmière a mis une poche de glace dessus pendant une heure. J'ai raté le contrôle et gagné un bonbon."], en: ["I writhed in pain like in {w:movie}. The nurse called my parents. I spent the afternoon on the couch with {w:show}. I deserve an Oscar.", "I moaned, sweated and said “I'm seeing stars”. The nurse kept me all morning with a hot water bottle. The test happened without me.", "I pointed at my {w:bodypart}, moaning that it “pulled”. The nurse kept an ice pack on it for an hour. I missed the test and won a candy."] }, fx: { happy: 5, karma: -2, grade: -1 } },
          { w: 1, text: { fr: ["L'infirmière a pris ma température : 37,0. Elle m'a regardé{|e} longuement et m'a dit « retourne en classe, petit{|e} comédien{|ne} ». Elle en a vu d'autres.", "J'en ai trop fait. On a appelé ma mère, qui est venue me chercher, inquiète. À la maison, elle a compris. J'ai rangé le garage tout l'après-midi, y compris {w:object}."], en: ["The nurse took my temperature: 98.6. She looked at me for a long time and said “back to class, little actor”. She's seen it all.", "I overdid it. They called my mom, who came to get me, worried. At home she figured it out. I cleaned the garage all afternoon, including {w:object}."] }, fx: { happy: -3, discipline: 2 } },
        ],
      },
      {
        label: { fr: 'Affronter le contrôle', en: 'Face the test' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai passé le contrôle en improvisant. J'ai situé la Bretagne quelque part {w:far_place}. 9/20. C'est plus que prévu.", "J'ai affronté mon destin. J'ai eu 12/20 et le sentiment d'avoir survécu à une guerre."], en: ["I took the test and improvised. I placed Ohio somewhere {w:far_place}. 9/20. Better than expected.", "I faced my fate. I got 12/20 and the feeling of having survived a war."] }, fx: { grade: 1, discipline: 3, karma: 1 } },
        ],
      },
      {
        label: { fr: 'Accompagner un malade', en: 'Escort a sick classmate' },
        out: [
          { w: 1, text: { fr: ["Je me suis porté{|e} volontaire pour accompagner un camarade qui saignait du nez. On a fait le trajet en vingt-cinq minutes. Le couloir fait cinquante mètres.", "J'ai escorté un camarade à l'infirmerie. On a fait un détour par la cour, les toilettes et le distributeur d'eau, où traînait {w:animal}. Mission humanitaire accomplie."], en: ["I volunteered to escort a classmate with a nosebleed. The trip took twenty-five minutes. The hallway is fifty meters long.", "I escorted a classmate to the nurse. We took a detour via the playground, the toilets and the water fountain, where {w:animal} was hanging around. Humanitarian mission complete."] }, fx: { happy: 3, karma: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_school_camp',
    icon: '🌲',
    cat: 'school',
    once: true,
    when: { age: [7, 11], school: PRI },
    scene: { place: 'park', mood: 'happy' },
    text: {
      fr: [
        "Classe verte ! Une semaine loin de chez toi, dans un centre qui sent {w:smell}, avec des lits superposés et une prof qui joue de la guitare.",
        "Départ en classe de découverte pour cinq jours. Il est 22 h, le premier soir. Ta mère te manque. Et {w:object}, aussi.",
        "En classe verte, les monos organisent une veillée. Un garçon de ta chambre prétend avoir vu {w:animal} rôder dans les bois.",
        "Classe de neige : ski le matin, atelier poterie l'après-midi. Tu as reçu une lettre de tes parents. Elle contient [[une photo du chat|un billet de 5|un mot très gênant]].",
      ],
      en: [
        "School camp! A week away from home, in a center that smells like {w:smell}, with bunk beds and a teacher who plays guitar.",
        "Off on a five-day field camp. It's 10 p.m. on the first night. You miss your mom. And {w:object}, too.",
        "At school camp, the counselors organize a campfire. A boy in your room claims he saw {w:animal} prowling in the woods.",
        "Ski camp: skiing in the morning, pottery in the afternoon. You got a letter from your parents. It contains [[a photo of the cat|a five-dollar bill|a very embarrassing note]].",
      ],
    },
    choices: [
      {
        label: { fr: 'Organiser une bataille d\'oreillers', en: 'Start a pillow fight' },
        out: [
          { w: 2, text: { fr: ["Bataille d'oreillers épique à minuit. Un oreiller s'est éventré. Il y avait des plumes jusque dans {w:food}, au petit-déjeuner. Meilleure nuit de ma vie.", "On a combattu chambre contre chambre. J'ai été sacré{|e} « {w:nickname} », roi ou reine de l'étage. Les monos nous ont fait ranger jusqu'à 2 h.", "On a construit un fort avec les matelas. Assaut final à minuit, toute la chambre chantant {w:song}. On a gagné. Les monos aussi : on s'est endormis juste après."], en: ["Epic midnight pillow fight. A pillow burst. There were feathers in {w:food} at breakfast. Best night of my life.", "We fought room against room. I was crowned “{w:nickname}”, ruler of the floor. The counselors made us tidy up until 2 a.m.", "We built a fort out of mattresses. Final assault at midnight, the whole room singing {w:song}. We won. So did the counselors: we fell asleep right after."] }, fx: { happy: 7, discipline: -2 } },
          { w: 1, text: { fr: ["J'ai pris un oreiller en pleine tête, je suis tombé{|e} du lit du haut et je me suis cogné{|e} {w:bodypart}. Bosse énorme. Photo de classe le lendemain. Pas de chance.", "Le directeur du centre a débarqué au milieu de la bataille, en pyjama à carreaux. Punition : corvée de vaisselle. Ça valait le coup."], en: ["I took a pillow to the face, fell off the top bunk and bumped my {w:bodypart}. Huge lump. Class photo the next day. Unlucky.", "The camp director burst in mid-fight, in plaid pajamas. Punishment: dish duty. Worth it."] }, fx: { happy: 2, health: -3 } },
        ],
      },
      {
        label: { fr: 'Pleurer en douce', en: 'Cry quietly' },
        out: [
          { w: 2, text: { fr: ["J'ai pleuré sous ma couette en serrant {w:object}. Le lendemain, trois autres avouaient avoir fait pareil. On a fondé le club des nostalgiques.", "J'ai eu le mal du pays le premier soir. Le deuxième jour, j'avais oublié jusqu'au prénom de mes parents. La classe verte, c'est la vie."], en: ["I cried under my duvet hugging {w:object}. The next day three others admitted they had too. We founded the homesick club.", "I was homesick the first night. By day two I'd forgotten my parents' names. School camp is life."] }, fx: { happy: 2, smarts: 1 } },
        ],
      },
      {
        label: { fr: 'Explorer la nuit', en: 'Explore at night' },
        out: [
          { w: 2, text: { fr: ["On est sortis à minuit avec une lampe de poche pour chercher le monstre des bois. On a trouvé {w:animal}, qui a eu plus peur que nous. On a tous crié.", "Expédition nocturne réussie : on a pillé la cuisine du centre et rapporté {w:food}. J'ai l'impression d'avoir braqué une banque."], en: ["We snuck out at midnight with a flashlight to look for the forest monster. We found {w:animal}, which was more scared than us. Everyone screamed.", "Night expedition successful: we raided the camp kitchen and brought back {w:food}. I feel like I robbed a bank."] }, fx: { happy: 6, discipline: -3 } },
          { w: 1, text: { fr: ["Un mono nous a attrapés dans le couloir. On a passé une heure assis sur un banc, en pyjama, à réfléchir à nos actes. J'ai surtout réfléchi aux biscuits.", "On s'est perdus dans le centre. On a dormi dans la salle de ping-pong, à côté de la table et {w:object}. Personne ne nous a cherchés. C'est vexant."], en: ["A counselor caught us in the hallway. We spent an hour on a bench in our pajamas, thinking about our actions. Mostly I thought about cookies.", "We got lost in the building. We slept in the ping-pong room, next to the table and {w:object}. Nobody came looking for us. That's insulting."] }, fx: { happy: -1, discipline: 2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_sticker_album',
    icon: '⚽',
    cat: 'hobby',
    once: true,
    actor: { role: 'classmate', create: { role: 'classmate', age: [0, 2], gender: 'any' } },
    when: { age: [6, 11] },
    scene: { place: 'school', mood: 'happy' },
    text: {
      fr: [
        "Tout le monde complète l'album d'autocollants de la Coupe du monde. Il ne te manque que le gardien du Paraguay. {a.first} l'a en double.",
        "{a.first} a la carte la plus rare de la cour, brillante et holographique. {a:Il|Elle} te la propose contre {w:object} et une promesse.",
        "La cour est devenue une bourse aux cartes à collectionner. {a.first} te propose un « crédit » : tu prends ses cartes maintenant, tu paies plus tard.",
        "Tu as dépensé tout ton argent de poche en pochettes d'autocollants. Résultat : [[17|23|41]] fois le même joueur. {a.first} t'observe avec un sourire de banquier.",
      ],
      en: [
        "Everyone's filling the World Cup sticker album. You're only missing Paraguay's goalkeeper. {a.first} has a spare.",
        "{a.first} has the rarest card in the playground, shiny and holographic. {a:He|She} offers it to you for {w:object} and a promise.",
        "The playground has turned into a trading-card exchange. {a.first} offers you “credit”: take the cards now, pay later.",
        "You spent all your pocket money on sticker packs. Result: the same player [[17|23|41]] times. {a.first} watches you with a banker's smile.",
      ],
    },
    choices: [
      {
        label: { fr: 'Prendre à crédit', en: 'Take it on credit' },
        out: [
          { w: 1, text: { fr: ["J'ai pris les cartes à crédit. Album complet ! {a.first} a noté ma dette dans un petit carnet noir. Je ne sais pas encore ce que ça veut dire.", "J'ai signé un contrat au crayon de couleur. Je dois à {a.first} « dix cartes, plus les intérêts ». Je ne sais pas ce que sont les intérêts. Je vais l'apprendre."], en: ["I took the cards on credit. Album complete! {a.first} wrote my debt in a little black notebook. I don't know what that means yet.", "I signed a contract in crayon. I owe {a.first} “ten cards, plus interest”. I don't know what interest is. I'm going to find out."] }, fx: { happy: 6, keep: true, flag: 'k2_sticker_debt', schedule: { key: 'k2_sticker_mafia', years: 1 } } },
        ],
      },
      {
        label: { fr: 'Échanger équitablement', en: 'Trade fair and square' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["Après vingt minutes de négociation, j'ai obtenu le gardien du Paraguay contre trois doubles et {w:object}. Je me suis senti{|e} comme un ministre.", "Échange réussi. {a.first} et moi avons serré la main comme deux hommes d'affaires. On est potes maintenant, liés par le gardien du Paraguay.", "J'ai proposé trois doubles, {a.first} a exigé {w:food} en plus. On a conclu sur une poignée de main collante. Album complet. Je suis {un négociateur|une négociatrice}."], en: ["After twenty minutes of haggling, I got Paraguay's goalkeeper for three doubles and {w:object}. I felt like a cabinet minister.", "Trade complete. {a.first} and I shook hands like businessmen. We're buddies now, bound by Paraguay's goalkeeper.", "I offered three doubles, {a.first} demanded {w:food} on top. We closed on a sticky handshake. Album complete. I'm a negotiator."] }, fx: { happy: 5, smarts: 2, rel: 10 } },
          { w: 1, text: { fr: ["J'ai échangé ma plus belle carte contre celle de {a.first}. Elle était fausse, dessinée au feutre. Je me suis fait avoir comme un bleu.", "On a fait l'échange, puis {a.first} a voulu annuler. Dispute, larmes, intervention du surveillant. Toutes les cartes ont été confisquées, avec {w:object}."], en: ["I traded my best card for {a.first}'s. It was fake, drawn in marker. I got played like a rookie.", "We traded, then {a.first} wanted to cancel. Argument, tears, the supervisor stepped in. All cards confiscated, along with {w:object}."] }, fx: { happy: -4, rel: -10 } },
        ],
      },
      {
        label: { fr: 'Abandonner la collection', en: 'Quit collecting' },
        out: [
          { w: 1, text: { fr: ["J'ai jeté l'album dans un tiroir. Il y est toujours. Il ne manque que le gardien du Paraguay. Ça me hante parfois la nuit.", "J'ai tout revendu à {a.first} contre {w:food}. J'ai tout mangé en cinq minutes. Il ne me reste rien. Philosophie."], en: ["I threw the album in a drawer. It's still there. Only Paraguay's goalkeeper is missing. It haunts me some nights.", "I sold everything to {a.first} for {w:food}. I ate it all in five minutes. I have nothing left. Philosophy."] }, fx: { happy: -1, smarts: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_sticker_mafia',
    icon: '📒',
    cat: 'school',
    rating: 1,
    chainOnly: true,
    when: { age: [7, 12], flag: 'k2_sticker_debt' },
    scene: { place: 'school', mood: 'shock' },
    text: {
      fr: [
        "{a.first} t'attend à la sortie avec son carnet noir et deux CM2 baraqués. Ta dette d'autocollants est passée de dix à [[quarante|soixante|cent]] cartes.",
        "Un an a passé. {a.first} n'a pas oublié. {a:Il|Elle} t'explique calmement que les intérêts courent et que ton goûter appartient désormais à « l'organisation ».",
        "{a.first} a mis ta tête sur une affiche dans les toilettes : « MAUVAIS PAYEUR ». En dessous, quelqu'un a dessiné {w:animal}.",
        "Tu reçois un mot plié en huit dans ta trousse : « Tu dois des cartes. On sait où tu habites. On a vu {w:animal} près de chez toi. »",
      ],
      en: [
        "{a.first} is waiting for you after school with the black notebook and two beefy fifth-graders. Your sticker debt has grown from ten to [[forty|sixty|a hundred]] cards.",
        "A year has passed. {a.first} hasn't forgotten. {a:He|She} calmly explains that interest is accruing and your snack now belongs to “the organization”.",
        "{a.first} put your face on a poster in the toilets: “BAD PAYER”. Below it, someone drew {w:animal}.",
        "You find a note folded eight times in your pencil case: “You owe cards. We know where you live. We saw {w:animal} near your house.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Rembourser', en: 'Pay up' },
        out: [
          { w: 1, text: { fr: ["J'ai donné toute ma collection et trois mois de goûters. Dette effacée. J'ai appris ce qu'est un taux d'intérêt. Je n'emprunterai plus jamais rien.", "J'ai remboursé avec {w:object} et ma plus belle bille. {a.first} a rayé mon nom du carnet. J'ai respiré pour la première fois depuis un an."], en: ["I handed over my whole collection and three months of snacks. Debt cleared. I learned what an interest rate is. I will never borrow anything again.", "I paid with {w:object} and my best marble. {a.first} crossed my name out of the notebook. I breathed for the first time in a year."] }, fx: { happy: -3, smarts: 3, karma: 2, unflag: 'k2_sticker_debt', rel: 5 } },
        ],
      },
      {
        label: { fr: 'Contester la dette', en: 'Dispute the debt' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai fait remarquer que le contrat était écrit au crayon de couleur et donc pas valable. {a.first} a consulté ses avocats (deux CM2). Ils ont acquiescé. Libre !", "J'ai invoqué la prescription. Personne ne savait ce que ça voulait dire, moi non plus, mais ça a impressionné tout le monde. Dette annulée."], en: ["I pointed out the contract was written in crayon and therefore invalid. {a.first} consulted their lawyers (two fifth-graders). They nodded. Free!", "I invoked the statute of limitations. Nobody knew what it meant, including me, but it impressed everyone. Debt cancelled."] }, fx: { happy: 5, smarts: 3, unflag: 'k2_sticker_debt', rel: -10 } },
          { w: 1, text: { fr: ["Les deux CM2 m'ont fait un « pneu » dans le dos et confisqué ma trousse. Je l'ai récupérée vide, à part {w:object}. J'ai payé.", "On s'est bagarrés derrière le gymnase. J'ai fini avec une écorchure au genou et l'honneur sauf. La dette, elle, est toujours là."], en: ["The two fifth-graders gave me a wedgie and took my pencil case. I got it back empty except for {w:object}. I paid.", "We scuffled behind the gym. I ended up with a scraped knee and my honor intact. The debt is still there, though."] }, fx: { happy: -5, health: -2, unflag: 'k2_sticker_debt' } },
        ],
      },
      {
        label: { fr: 'Prévenir les parents', en: 'Tell your parents' },
        out: [
          { w: 1, text: { fr: ["Mes parents ont appelé les parents de {a.first}. L'organisation a été démantelée en une soirée. Mon père a dit « la mafia des autocollants » en pouffant pendant une semaine.", "Ma mère a écouté toute l'histoire, puis a dit : « Bienvenue dans la vie d'adulte. » Elle a quand même payé la dette en pochettes neuves."], en: ["My parents called {a.first}'s parents. The organization was dismantled in one evening. My dad giggled about “the sticker mafia” for a week.", "My mom listened to the whole story, then said: “Welcome to adult life.” She paid off the debt in fresh packs anyway."] }, fx: { happy: 2, karma: 1, unflag: 'k2_sticker_debt', rel: -15 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_new_kid',
    icon: '🧳',
    cat: 'friends',
    cooldown: 3,
    actor: { create: { role: 'classmate', age: [-1, 1], gender: 'any' } },
    when: { age: [5, 11], school: [PRE, PRI] },
    scene: { place: 'school', mood: 'neutral' },
    text: {
      fr: [
        "Un{a:|e} nouvel{a:|le} élève arrive en cours d'année : {a.first}, qui a vécu jusqu'ici {w:far_place}. {a:Il|Elle} est seul{a:|e} sur le banc de la cour, avec {w:object}.",
        "{a.first} vient d'arriver dans la classe. {a:Il|Elle} a un accent bizarre, un cartable trop grand et une passion pour {w:hobby}.",
        "La maîtresse te charge de faire visiter l'école à {a.first}, le petit nouveau ou la petite nouvelle. Tu as une heure et une réputation à tenir.",
        "{a.first}, nouvel{a:|le} élève, s'est assis{a:|e} à ta table à la cantine sans demander. Les autres te regardent pour voir ce que tu vas faire.",
      ],
      en: [
        "A new kid shows up mid-year: {a.first}, who used to live {w:far_place}. They're sitting alone on a playground bench with {w:object}.",
        "{a.first} just joined the class. They have a funny accent, a schoolbag that's too big and a passion for {w:hobby}.",
        "The teacher asks you to show {a.first}, the new kid, around the school. You have one hour and a reputation to uphold.",
        "{a.first}, the new kid, sat at your canteen table without asking. Everyone's watching to see what you'll do.",
      ],
    },
    choices: [
      {
        label: { fr: 'L\'accueillir', en: 'Welcome them' },
        out: [
          { w: 3, text: { fr: ["J'ai présenté {a.first} à tout le monde et je lui ai montré les toilettes qui ferment à clé. C'est la base de toute amitié. On est inséparables.", "J'ai partagé mon goûter avec {a.first}. En échange, {a:il|elle} m'a appris un jeu de cartes qu'on joue {w:far_place}. On est devenus les meilleurs amis du monde.", "J'ai fait visiter l'école à {a.first} en inventant des légendes : le fantôme du préau, {w:animal} qui vit dans les toilettes. {a:Il|Elle} a tout cru. On est inséparables."], en: ["I introduced {a.first} to everyone and showed them the toilet stall that actually locks. The foundation of any friendship. We're inseparable.", "I shared my snack with {a.first}. In return, they taught me a card game they play {w:far_place}. We became best friends.", "I showed {a.first} around the school, making up legends: the ghost of the covered yard, {w:animal} living in the toilets. They believed everything. We're inseparable."] }, fx: { happy: 5, karma: 3, rel: 20, actorRole: 'friend' } },
          { w: 1, text: { fr: ["J'ai essayé, mais {a.first} ne parlait que de son ancienne école, qui était « bien mieux ». Au bout d'une semaine, on s'est poliment ignorés.", "J'ai accueilli {a.first} avec enthousiasme. {a:Il|Elle} m'a volé ma place de chouchou de la maîtresse en dix jours. Je nourrissais un serpent."], en: ["I tried, but {a.first} only talked about their old school, which was “way better”. After a week we politely ignored each other.", "I welcomed {a.first} enthusiastically. They stole my spot as teacher's pet in ten days. I was nurturing a snake."] }, fx: { happy: -1, karma: 2 } },
        ],
      },
      {
        label: { fr: 'Lui faire passer un test', en: 'Make them pass a test' },
        rating: 1,
        out: [
          { w: 2, text: { fr: ["J'ai imposé un rite d'entrée : manger une feuille de menthe sauvage, tourner trois fois autour du marronnier et dire « {w:insult} » au surveillant. {a.first} a tout réussi. Respect.", "J'ai fait passer un test de courage à {a.first} : toucher la porte du local du concierge. {a:Il|Elle} l'a ouverte. On a vu {w:object} à l'intérieur. On ne s'en est jamais remis."], en: ["I imposed an initiation: eat a wild mint leaf, run three times around the chestnut tree and call the supervisor “{w:insult}”. {a.first} did it all. Respect.", "I set {a.first} a courage test: touch the janitor's closet door. They opened it. We saw {w:object} inside. We never recovered."] }, fx: { happy: 4, rel: 10, discipline: -2, keep: true } },
        ],
      },
      {
        label: { fr: 'L\'ignorer', en: 'Ignore them' },
        out: [
          { w: 1, text: { fr: ["J'ai fait comme si {a.first} n'existait pas. Trois mois plus tard, {a:il|elle} était l'élève la plus populaire de l'école. J'ai misé sur le mauvais cheval.", "J'ai ignoré {a.first}. Le soir, j'ai eu un petit pincement au cœur. Ma conscience s'est exprimée par un mal de ventre et {w:sound}."], en: ["I acted like {a.first} didn't exist. Three months later they were the most popular kid in school. I bet on the wrong horse.", "I ignored {a.first}. That evening I felt a little pang. My conscience spoke up as a stomachache and {w:sound}."] }, fx: { karma: -3, happy: -1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_fake_signature',
    icon: '🖊️',
    cat: 'school',
    rating: 1,
    cooldown: 3,
    actor: 'parent',
    when: { age: [7, 11], has: 'parent' },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Tu as eu [[3|2|0,5]]/20 en maths. Le contrôle est à faire signer par {a.rel}. Tu t'entraînes à imiter sa signature depuis une heure sur un brouillon.",
        "Le cahier de liaison contient un mot de la maîtresse : « Votre enfant a crié “{w:insult}” à un camarade. » Il doit être signé demain. {a.rel} dort.",
        "Ta mauvaise note doit être signée. {a.rel} est de très mauvaise humeur depuis qu'{a.he} a reçu une amende. Ce n'est pas le moment.",
        "Tu as perdu ton bulletin dans {w:vehicle}, entre deux sièges. Enfin, c'est la version officielle. La signature de {a.rel} est requise lundi.",
      ],
      en: [
        "You got [[3|2|0.5]]/20 in math. The test has to be signed by {a.rel}. You've been practicing their signature on scrap paper for an hour.",
        "Your school diary has a note from the teacher: “Your child called a classmate {w:insult}.” It must be signed tomorrow. {a.rel} is asleep.",
        "Your bad grade has to be signed. {a.rel} has been in a terrible mood since getting a fine. Not the moment.",
        "You lost your report card in {w:vehicle}, between two seats. Well, that's the official version. {a.rel}'s signature is required on Monday.",
      ],
    },
    choices: [
      {
        label: { fr: 'Imiter la signature', en: 'Forge the signature' },
        out: [
          { w: 2, text: { fr: ["Ma fausse signature ressemblait à un gribouillis de {age} ans. La maîtresse a appelé à la maison. {a.my} a reconnu le crime et moi, j'ai perdu la télé pour un mois.", "J'ai signé « {a.first} » en lettres attachées, comme à l'école. La maîtresse a souri tristement. Les vrais adultes ne signent pas avec un cœur sur le i."], en: ["My fake signature looked like a {age}-year-old's scribble. The teacher called home. {a.my} recognized the crime and I lost TV for a month.", "I signed “{a.first}” in my best cursive, like at school. The teacher smiled sadly. Real grown-ups don't dot their i's with hearts."] }, fx: { happy: -5, discipline: -2, karma: -3, rel: -10 } },
          { w: 1, text: { fr: ["La signature était parfaite. Personne n'a rien vu. J'ai un talent dangereux. Je le garde pour plus tard, quand je serai {w:weird_job}.", "J'ai signé, la maîtresse a validé. Mais je n'arrive plus à regarder {a.my} dans les yeux. La culpabilité me ronge comme un hamster."], en: ["The signature was perfect. Nobody noticed. I have a dangerous talent. I'm saving it for when I'm {w:weird_job}.", "I signed, the teacher accepted it. But I can't look {a.my} in the eye anymore. Guilt is gnawing at me like a hamster."] }, fx: { happy: 2, karma: -4, smarts: 2 } },
        ],
      },
      {
        label: { fr: 'Choisir le bon moment', en: 'Pick the perfect moment' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai attendu que {a.my} regarde {w:show}, captivé{a:|e}. J'ai glissé la feuille avec un stylo. Signé{a:|e} sans lire. Je suis un{|e} stratège.", "J'ai présenté la copie au moment où {a.my} était au téléphone avec mamie. Signature distraite, aucune question. Le timing, c'est tout."], en: ["I waited until {a.my} was glued to {w:show}. I slipped over the paper and a pen. Signed without reading. I'm a strategist.", "I handed over the test while {a.my} was on the phone with grandma. Distracted signature, no questions. Timing is everything."] }, fx: { happy: 3, smarts: 2, karma: -1 } },
          { w: 1, text: { fr: ["{a.my} a signé, puis s'est arrêté{a:|e}, a relu, et a dit mon prénom en entier. Avec le deuxième prénom. C'était la fin.", "Mauvais timing : {a.my} venait de marcher sur {w:object}. La note et la douleur se sont additionnées. Explosion."], en: ["{a.my} signed, then stopped, reread it, and said my full name. Middle name included. It was over.", "Bad timing: {a.my} had just stepped on {w:object}. The grade and the pain added up. Explosion."] }, fx: { happy: -4, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Tout avouer', en: 'Come clean' },
        out: [
          { w: 2, text: { fr: ["J'ai tout avoué, en pleurant. {a.my} a signé en soupirant, puis m'a raconté son propre 2/20 en CM1. On a ri. On a révisé. On a mangé des crêpes.", "J'ai avoué. {a.my} a dit qu'{a.he} était déçu{a:|e}, ce qui est pire qu'une punition. Puis {a.he} m'a aidé{|e} à comprendre. C'était presque agréable.", "J'ai tout avoué. {a.my} a ri, puis m'a montré son vieux bulletin, rempli de « peut mieux faire ». On l'a affiché sur le frigo, entre le mien et {w:object}."], en: ["I confessed everything, in tears. {a.my} signed with a sigh, then told me about their own 2/20 back in the day. We laughed. We studied. We ate crêpes.", "I confessed. {a.my} said {a.he} was disappointed, which is worse than any punishment. Then {a.he} helped me understand. It was almost nice.", "I confessed. {a.my} laughed, then showed me their old report card, full of “could do better”. We stuck it on the fridge, between mine and {w:object}."] }, fx: { happy: 1, karma: 3, smarts: 2, rel: 10 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pri_parent_teacher',
    icon: '👩‍🏫',
    cat: 'school',
    rating: 1,
    cooldown: 3,
    actor: 'parent',
    when: { age: [6, 10], school: PRI, has: 'parent' },
    scene: { place: 'school', mood: 'neutral' },
    text: {
      fr: [
        "Réunion parents-professeurs. {a.rel} est assis{a:|e} sur une chaise minuscule face à la maîtresse. Toi, tu attends dans le couloir en suant.",
        "Ce soir, {a.rel} va rencontrer ton maître. Tu sais qu'il va parler de l'incident avec {w:object}. Tu ne sais pas quelle version il va raconter.",
        "Rendez-vous avec la maîtresse. {a.rel} est arrivé{a:|e} en retard, {w:weather}, de mauvaise humeur. La maîtresse sort ton cahier de comportement.",
        "La maîtresse a demandé à voir {a.rel}. Elle a « quelques petites choses » à dire. D'habitude, les petites choses sont énormes.",
      ],
      en: [
        "Parent-teacher meeting. {a.rel} is perched on a tiny chair facing your teacher. You're waiting in the hallway, sweating.",
        "Tonight {a.rel} meets your teacher. You know he'll bring up the incident with {w:object}. You don't know which version he'll tell.",
        "Meeting with the teacher. {a.rel} arrived late, {w:weather}, in a bad mood. The teacher pulls out your behavior log.",
        "The teacher asked to see {a.rel}. She has “a few little things” to say. Usually the little things are huge.",
      ],
    },
    choices: [
      {
        label: { fr: 'Écouter à la porte', en: 'Eavesdrop at the door' },
        out: [
          { w: 2, text: { fr: ["J'ai écouté à la porte. La maîtresse a dit que j'étais « un{|e} élève qui a beaucoup d'imagination ». {a.my} a répondu « oh, on sait ». Je ne sais pas si c'est bien.", "J'ai entendu la maîtresse dire que je parle trop, et {a.my} répondre « ça vient de l'autre côté de la famille ». Je découvre la politique familiale."], en: ["I listened at the door. The teacher said I'm “a student with a lot of imagination”. {a.my} said “oh, we know”. Not sure if that's good.", "I heard the teacher say I talk too much, and {a.my} reply “that's from the other side of the family”. I'm discovering family politics."] }, fx: { happy: 1, smarts: 2 } },
          { w: 1, text: { fr: ["La porte s'est ouverte d'un coup, j'ai basculé à l'intérieur, à plat ventre. La maîtresse a dit : « Vous voyez ce que je veux dire ? »", "J'ai entendu la maîtresse parler de mes « absences de concentration ». J'ai fait une absence de concentration en écoutant. J'ai raté la fin."], en: ["The door swung open and I tumbled in, flat on my face. The teacher said: “You see what I mean?”", "I heard the teacher mention my “lapses in concentration”. I had a lapse in concentration while listening. I missed the end."] }, fx: { happy: -3, discipline: -1 } },
        ],
      },
      {
        label: { fr: 'Préparer le terrain avant', en: 'Prepare the ground beforehand' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai prévenu {a.my} que la maîtresse « exagère toujours » et « n'aime pas les enfants créatifs ». {a:Il|Elle} est entré{a:|e} en mode défense. La réunion a tourné au procès. J'ai gagné.", "J'ai rangé ma chambre, mis la table et dessiné {w:animal} avant la réunion. {a.my} est revenu{a:|e} en disant « bon, c'est pas si grave ». Le lobbying fonctionne."], en: ["I warned {a.my} that the teacher “always exaggerates” and “doesn't like creative kids”. They went in on the defensive. The meeting became a trial. I won.", "I cleaned my room, set the table and drew {w:animal} before the meeting. {a.my} came back saying “well, it's not that bad”. Lobbying works."] }, fx: { happy: 4, karma: -1, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Prier très fort', en: 'Pray very hard' },
        out: [
          { w: 1, text: { fr: ["La réunion a duré quarante minutes. {a.my} est sorti{a:|e} en disant juste « on en parlera à la maison ». Le trajet a été le plus long de ma vie. La radio passait {w:song}.", "{a.my} est ressorti{a:|e} en riant. La maîtresse lui avait raconté ma théorie selon laquelle {w:conspiracy}. Je suis devenu{|e} une anecdote de dîner."], en: ["The meeting lasted forty minutes. {a.my} came out saying only “we'll talk about it at home”. Longest car ride of my life. The radio was playing {w:song}.", "{a.my} came out laughing. The teacher had told them my theory {w:conspiracy}. I've become a dinner-party anecdote."] }, fx: { happy: -2, rel: 5 } },
        ],
      },
    ],
  },

  // ═════════════════════════════ HOME & FAMILY ═════════════════════════════
  {
    id: 'k2_dinner_guest_question',
    icon: '🍽️',
    cat: 'family',
    rating: 1,
    cooldown: 4,
    actor: 'parent',
    when: { age: [4, 10], has: 'parent' },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Dîner avec les collègues de {a.rel}. Un silence s'installe. Tu as une question qui te brûle les lèvres depuis que tu as entendu {a.rel} traiter l'un d'eux de « {w:insult} ».",
        "Le patron de {a.rel} vient manger à la maison. Il a un nez énorme. Tu le fixes depuis l'entrée. Tout le monde prie pour que tu te taises.",
        "Repas de famille chez les voisins. Tu te souviens soudain que {a.rel} a dit dans la voiture que chez eux, il flotte toujours {w:smell}. Le dessert arrive.",
        "Dîner chic avec des invités. Tu viens de découvrir une question fondamentale : pourquoi la dame en face a {w:object} sur la tête ?",
      ],
      en: [
        "Dinner with {a.rel}'s coworkers. There's a lull. You have a burning question ever since you heard {a.rel} call one of them “{w:insult}”.",
        "{a.rel}'s boss is coming for dinner. He has an enormous nose. You've been staring since he walked in. Everyone is praying you stay quiet.",
        "Family meal at the neighbors'. You suddenly remember {a.rel} saying in the car that their place always has {w:smell} hanging around. Dessert arrives.",
        "Fancy dinner with guests. You've just come up with a fundamental question: why does the lady across the table have {w:object} on her head?",
      ],
    },
    choices: [
      {
        label: { fr: 'Poser la question', en: 'Ask the question' },
        out: [
          { w: 2, text: { fr: ["J'ai demandé à voix haute si c'était bien lui, le « {w:insult} ». Les fourchettes se sont arrêtées en l'air. {a.my} a ri nerveusement pendant onze secondes. Record.", "J'ai répété mot pour mot ce que {a.my} avait dit dans la voiture. L'invitée a posé sa serviette. La soirée s'est terminée à 20 h 40. Personne ne me parle."], en: ["I asked out loud if he was the “{w:insult}”. Forks froze in midair. {a.my} laughed nervously for eleven seconds. A record.", "I repeated word for word what {a.my} said in the car. The guest put down her napkin. The evening ended at 8:40 p.m. Nobody is speaking to me."] }, fx: { happy: 3, karma: -1, rel: -15 } },
          { w: 1, text: { fr: ["J'ai posé ma question. L'invité a éclaté de rire et a avoué qu'il appelait aussi {a.my} « {w:insult} » dans son dos. Ils sont devenus amis. Je suis un médiateur.", "Ma question a brisé la glace. Tout le monde a avoué ce qu'il pensait vraiment. La soirée a fini en karaoké sur {w:song}. Personne ne sait comment."], en: ["I asked my question. The guest burst out laughing and admitted he also calls {a.my} “{w:insult}” behind their back. They became friends. I'm a mediator.", "My question broke the ice. Everyone admitted what they really thought. The evening ended in karaoke to {w:song}. Nobody knows how."] }, fx: { happy: 5, smarts: 1, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Se retenir héroïquement', en: 'Hold it in heroically' },
        out: [
          { w: 1, text: { fr: ["J'ai serré les lèvres pendant tout le dîner. J'ai posé la question dans la voiture, au retour. {a.my} m'a remercié{|e} d'avoir attendu. Une première.", "J'ai tenu jusqu'au dessert, puis j'ai demandé s'il restait {w:food}. Diversion parfaite. {a.my} m'a fait un clin d'œil reconnaissant.", "J'ai gardé ma question pour moi et je l'ai écrite dans mon journal intime, avec un dessin. On y voit l'invité en {w:animal}. Il est très réussi."], en: ["I kept my lips sealed all dinner. I asked my question in the car on the way home. {a.my} thanked me for waiting. A first.", "I held out until dessert, then asked if there was any {w:food} left. Perfect diversion. {a.my} gave me a grateful wink.", "I kept my question to myself and wrote it in my diary, with a drawing. It shows the guest as {w:animal}. It's very good."] }, fx: { discipline: 4, rel: 10 } },
        ],
      },
      {
        label: { fr: 'Le dire à l\'oreille de l\'invité', en: 'Whisper it to the guest' },
        out: [
          { w: 1, text: { fr: ["J'ai chuchoté dans l'oreille de l'invité. Il a hoché la tête, sérieux, et m'a glissé un billet de 5 « pour mon silence ». J'ai trouvé un métier.", "J'ai chuchoté, mais je ne sais pas chuchoter. Toute la table a entendu. Même {w:animal}, sur le rebord de la fenêtre, a détourné le regard."], en: ["I whispered in the guest's ear. He nodded gravely and slipped me five bucks “for my silence”. I've found my calling.", "I whispered, but I don't know how to whisper. The whole table heard. Even {w:animal} on the windowsill looked away."] }, fx: { happy: 3, karma: -2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_death_question',
    icon: '🪦',
    cat: 'family',
    rating: 1,
    once: true,
    actor: 'grandparent',
    when: { age: [4, 9], has: 'grandparent' },
    scene: { place: 'home', mood: 'neutral' },
    text: {
      fr: [
        "Tu regardes {a.rel} tricoter, puis tu demandes très sérieusement : « Tu vas bientôt mourir ? Parce que je voudrais ta maison. »",
        "En regardant un documentaire sur {w:animal}, tu te tournes vers {a.rel} : « Toi aussi t'es {a:vieux|vieille} comme les fossiles ? »",
        "Tu as appris le mot « testament » à l'école. Tu as une liste de questions pour {a.rel}, et la première concerne l'héritage : {w:vehicle}… enfin, sa voiture.",
        "Au cimetière, pour la Toussaint, tu demandes à {a.rel} où {a.he} veut être enterré{a:|e}, parce que tu as « déjà repéré un bon coin ».",
      ],
      en: [
        "You watch {a.rel} knitting, then ask very seriously: “Are you going to die soon? Because I'd like your house.”",
        "While watching a documentary about {w:animal}, you turn to {a.rel}: “Are you old like the fossils too?”",
        "You learned the word “will” at school. You have a list of questions for {a.rel}, and the first is about inheriting {w:vehicle}… well, the car.",
        "At the cemetery on All Saints' Day, you ask {a.rel} where {a.he} wants to be buried, because you've “already found a nice spot”.",
      ],
    },
    choices: [
      {
        label: { fr: 'Insister poliment', en: 'Insist politely' },
        out: [
          { w: 2, text: { fr: ["{a.my} a éclaté de rire et m'a promis {w:object} dans son testament. Je l'ai fait signer sur une serviette en papier. Juridiquement, c'est solide.", "{a.my} m'a répondu « pas avant d'avoir vu ton mariage, petite vipère ». On a mangé {w:food}. Les négociations reprendront."], en: ["{a.my} burst out laughing and promised me {w:object} in the will. I made them sign it on a paper napkin. Legally solid.", "{a.my} replied, “Not before I see you get married, you little viper.” We ate {w:food}. Negotiations will resume."] }, fx: { happy: 4, rel: 10 } },
          { w: 1, text: { fr: ["{a.my} a pris un air grave et m'a expliqué la vie et la mort pendant une heure. J'ai pleuré, puis j'ai demandé un goûter. C'est le cycle de la vie.", "{a.my} a fait semblant de mourir sur le canapé. J'ai hurlé. {a:Il|Elle} a ressuscité en riant. Je n'ai plus confiance."], en: ["{a.my} got serious and explained life and death for an hour. I cried, then asked for a snack. The circle of life.", "{a.my} pretended to die on the couch. I screamed. They came back to life laughing. I don't trust them anymore."] }, fx: { happy: -2, smarts: 3, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Changer de sujet', en: 'Change the subject' },
        out: [
          { w: 1, text: { fr: ["J'ai demandé à la place si les animaux vont au paradis, même {w:animal}. {a.my} a dit oui. J'ai été rassuré{|e} pour le hamster de la classe.", "J'ai enchaîné sur une question sur les dinosaures. {a.my} a eu l'air soulagé{a:|e}. Puis vexé{a:|e} quand j'ai demandé s'{a.he} en avait vu en vrai."], en: ["Instead I asked whether animals go to heaven, even {w:animal}. {a.my} said yes. I felt better about the class hamster.", "I moved on to a question about dinosaurs. {a.my} looked relieved. Then offended when I asked if they'd seen one in person."] }, fx: { happy: 2, rel: 5 } },
        ],
      },
    ],
  },
  {
    id: 'k2_broken_vase',
    icon: '🏺',
    cat: 'family',
    cooldown: 3,
    when: { age: [4, 11] },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Tu jouais au foot dans le salon (interdit). Le ballon vient de pulvériser le vase de mamie, celui qui « vaut une fortune ». Tes parents rentrent dans dix minutes.",
        "Tu as voulu attraper {w:object} sur l'étagère du haut. L'étagère est venue avec. Tout est par terre. Le silence est assourdissant.",
        "Une expérience scientifique impliquant {w:food} et le micro-ondes a mal tourné. La cuisine sent {w:smell}. Tes parents arrivent.",
        "En faisant la roue dans le couloir, tu as arraché le cadre de la photo de mariage de tes parents. Ton pied est passé à travers la tête de ton père.",
      ],
      en: [
        "You were playing soccer in the living room (forbidden). The ball just obliterated grandma's vase, the one “worth a fortune”. Your parents are home in ten minutes.",
        "You tried to reach {w:object} on the top shelf. The shelf came down too. Everything's on the floor. The silence is deafening.",
        "A science experiment involving {w:food} and the microwave went wrong. The kitchen smells like {w:smell}. Your parents are on their way.",
        "Doing cartwheels in the hallway, you knocked down your parents' wedding photo. Your foot went straight through your dad's face.",
      ],
    },
    choices: [
      {
        label: { fr: 'Accuser l\'animal', en: 'Blame the pet' },
        if: { has: 'pet' },
        out: [
          { w: 2, text: { fr: ["J'ai accusé l'animal de la maison. Il m'a regardé{|e} avec une trahison infinie. Mes parents l'ont grondé. Il me fait la tête depuis. Il a raison.", "J'ai dit que c'était l'animal. Mes parents l'ont cru. Le soir, il a vomi dans mes chaussons. La justice divine existe."], en: ["I blamed the family pet. It looked at me with infinite betrayal. My parents scolded it. It's been sulking ever since. It's right to.", "I said the pet did it. My parents believed me. That night it threw up in my slippers. Divine justice exists."] }, fx: { happy: 2, karma: -4 } },
          { w: 1, text: { fr: ["Mes parents ont fait remarquer que l'animal ne sait pas faire la roue. Ni jouer au foot. Ni utiliser le micro-ondes. Mon alibi s'est effondré.", "Pas de chance : la caméra de surveillance installée « pour le chat » a tout filmé. La vidéo a été diffusée au repas de famille. Avec ralenti et {w:song} en fond sonore."], en: ["My parents pointed out that the pet can't do cartwheels. Or play soccer. Or use a microwave. My alibi collapsed.", "Bad luck: the camera installed “for the cat” filmed everything. The video was shown at a family dinner. In slow motion, with {w:song} as the soundtrack."] }, fx: { happy: -4, discipline: 2 } },
        ],
      },
      {
        label: { fr: 'Réparer à la colle', en: 'Fix it with glue' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai tout recollé avec de la colle en bâton et {w:object}. De loin, ça passe. De près, on dirait une œuvre d'art moderne. Mes parents ne l'ont remarqué que six mois plus tard.", "J'ai réparé avec du scotch et beaucoup d'optimisme. Ça a tenu jusqu'à ce que mamie le prenne dans ses mains. Il s'est disloqué comme dans un dessin animé."], en: ["I glued everything back with a glue stick and {w:object}. From a distance it works. Up close it looks like modern art. My parents only noticed six months later.", "I fixed it with tape and a lot of optimism. It held until grandma picked it up. Then it fell apart like in a cartoon."] }, fx: { happy: 2, smarts: 2 } },
        ],
      },
      {
        label: { fr: 'Avouer immédiatement', en: 'Confess right away' },
        out: [
          { w: 2, text: { fr: ["J'ai avoué dès que la porte s'est ouverte. Mes parents ont été tellement surpris par mon honnêteté qu'ils ont oublié de crier. Mamie a dit que le vase était moche, de toute façon.", "J'ai tout dit. Punition : interdiction de regarder {w:show} pendant une semaine. Mais j'ai eu un câlin à la fin. C'est un bon deal.", "J'ai avoué. Mon père a examiné les dégâts, puis a dit : « Bon débarras. » Il détestait ce truc. On a fêté ça avec {w:food}. Ma mère, moins."], en: ["I confessed the second the door opened. My parents were so surprised by my honesty they forgot to yell. Grandma said the vase was ugly anyway.", "I told them everything. Punishment: no {w:show} for a week. But I got a hug at the end. Good deal.", "I confessed. Dad examined the damage, then said, “Good riddance.” He hated that thing. We celebrated with {w:food}. Mom, less so."] }, fx: { happy: -1, karma: 4, discipline: 2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_car_are_we_there',
    icon: '🛣️',
    cat: 'family',
    cooldown: 3,
    actor: 'parent',
    when: { age: [3, 10], has: 'parent' },
    scene: { place: 'home', mood: 'sleepy', prop: 'car' },
    text: {
      fr: [
        "Départ en vacances {w:far_place}. Huit heures de route. Vous êtes partis il y a douze minutes. Tu as déjà une question pour {a.rel}.",
        "Bouchon monstre sur l'autoroute, {w:weather}. {a.rel} serre le volant. Tu n'as plus de dessins animés sur la tablette et une énergie illimitée.",
        "Road trip familial. La radio passe {w:song} pour la [[sixième|neuvième|quinzième]] fois. {a.rel} chante faux. Tu as {age} ans et une mission : survivre.",
        "La voiture est chargée jusqu'au toit, tu es coincé{|e} entre une glacière et {w:object}. Il reste six cents kilomètres.",
      ],
      en: [
        "Off on vacation {w:far_place}. Eight hours of driving. You left twelve minutes ago. You already have a question for {a.rel}.",
        "Monster traffic jam on the highway, {w:weather}. {a.rel} grips the wheel. The tablet is out of cartoons and you have unlimited energy.",
        "Family road trip. The radio plays {w:song} for the [[sixth|ninth|fifteenth]] time. {a.rel} sings off-key. You're {age} and you have one mission: survive.",
        "The car is packed to the roof and you're wedged between a cooler and {w:object}. Four hundred miles to go.",
      ],
    },
    choices: [
      {
        label: { fr: '« On arrive quand ? »', en: '“Are we there yet?”' },
        out: [
          { w: 2, text: { fr: ["J'ai demandé « on arrive quand ? » [[quarante|soixante-dix|cent vingt]] fois. {a.my} a fini par répondre « jamais ». J'ai pleuré. Puis j'ai redemandé.", "J'ai posé la question toutes les cinq minutes. {a.my} a inventé un jeu : celui qui parle a perdu. J'ai perdu en quatre secondes."], en: ["I asked “are we there yet?” [[forty|seventy|a hundred and twenty]] times. {a.my} finally answered “never”. I cried. Then I asked again.", "I asked every five minutes. {a.my} invented a game: whoever talks loses. I lost in four seconds."] }, fx: { happy: 2, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Jouer au jeu des plaques', en: 'Play the license plate game' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai compté les voitures rouges, les camping-cars et les vaches. J'ai repéré {w:vehicle} et {w:animal} sur une aire d'autoroute. Meilleur trajet de ma vie.", "On a joué au jeu des plaques d'immatriculation. J'ai triché en inventant un département. {a.my} m'a laissé{|e} gagner pour avoir la paix.", "On a joué à « je vois quelque chose ». J'ai choisi {w:object}, qui était dans le coffre. Personne n'a trouvé pendant deux heures. Victoire par K.-O."], en: ["I counted red cars, RVs and cows. I spotted {w:vehicle} and {w:animal} at a rest stop. Best drive of my life.", "We played the license plate game. I cheated by inventing a state. {a.my} let me win for some peace.", "We played I Spy. I picked {w:object}, which was in the trunk. Nobody guessed for two hours. Victory by knockout."] }, fx: { happy: 4, smarts: 2, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Dormir tout le trajet', en: 'Sleep the whole way' },
        out: [
          { w: 2, text: { fr: ["J'ai dormi six heures, la bouche ouverte, la joue collée à la vitre. Je me suis réveillé{|e} à destination, avec la trace de la ceinture sur la figure.", "Je me suis endormi{|e} sur {w:object}. J'ai rêvé que j'étais {w:weird_job}. Au réveil, on était arrivés, et j'avais bavé sur la glacière."], en: ["I slept six hours, mouth open, cheek glued to the window. I woke up at our destination with a seatbelt mark across my face.", "I fell asleep on {w:object}. I dreamed I was {w:weird_job}. When I woke up we'd arrived and I'd drooled on the cooler."] }, fx: { health: 2, happy: 2, rel: 5 } },
          { w: 1, text: { fr: ["J'ai dormi tout le trajet, puis j'ai été en pleine forme à 23 h, à l'arrivée. Toute la famille voulait dormir. Moi, je voulais jouer. Conflit.", "J'ai tenté de dormir mais {a.my} a ronflé au volant… non, c'était l'autre parent, à côté. J'ai compté {w:sound} toutes les dix secondes."], en: ["I slept the whole drive, then was wide awake at 11 p.m. when we arrived. The whole family wanted to sleep. I wanted to play. Conflict.", "I tried to sleep but someone in the front was snoring. I counted {w:sound} every ten seconds."] }, fx: { happy: -1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_car_pee',
    icon: '🚻',
    cat: 'family',
    rating: 1,
    cooldown: 4,
    actor: 'parent',
    when: { age: [3, 9], has: 'parent' },
    scene: { place: 'home', mood: 'shock', prop: 'car' },
    text: {
      fr: [
        "Sur l'autoroute, tu annonces que tu as envie de faire pipi. {a.rel} répond : « Tu as fait il y a dix minutes ! » La prochaine aire est à [[30|52|80]] km.",
        "« On s'arrête pas, on a déjà perdu assez de temps », a dit {a.rel}. Ta vessie, elle, a un tout autre avis.",
        "Tu as bu une bouteille entière de jus de pomme. Il y a des bouchons, {w:weather}. La situation devient critique sur la banquette arrière.",
        "{a.rel} propose de « se retenir encore un peu ». Tu as déjà croisé les jambes, les bras et les doigts. Tu vas exploser.",
      ],
      en: [
        "On the highway, you announce you need to pee. {a.rel} says, “You went ten minutes ago!” The next rest stop is [[20|32|50]] miles away.",
        "“We're not stopping, we've lost enough time,” said {a.rel}. Your bladder strongly disagrees.",
        "You drank a whole bottle of apple juice. There's traffic, {w:weather}. The situation in the back seat is becoming critical.",
        "{a.rel} suggests you “hold it a little longer”. You've already crossed your legs, your arms and your fingers. You're going to burst.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exiger un arrêt d\'urgence', en: 'Demand an emergency stop' },
        out: [
          { w: 2, text: { fr: ["On s'est arrêtés sur le bas-côté. J'ai fait pipi derrière la voiture pendant qu'une file de camions klaxonnait. Je suis désormais célèbre auprès des routiers.", "On s'est arrêtés en catastrophe. J'ai fait pipi sur un buisson qui contenait {w:animal}. Nous avons eu peur tous les deux."], en: ["We pulled onto the shoulder. I peed behind the car while a line of trucks honked. I'm now famous among truckers.", "We made an emergency stop. I peed on a bush that turned out to contain {w:animal}. We were both terrified."] }, fx: { happy: 4, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Tenir jusqu\'à l\'aire', en: 'Hold on until the rest stop' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai tenu. J'ai couru aux toilettes de l'aire comme un sprinteur olympique. Elles étaient fermées pour travaux. J'ai découvert le mot que {a.my} dit dans ces cas-là.", "J'ai tenu jusqu'à l'aire en récitant {w:song} dans ma tête. Victoire. Je n'ai jamais été aussi {fier|fière} de mon corps."], en: ["I held on. I sprinted to the rest-stop bathroom like an Olympian. It was closed for repairs. I learned the word {a.my} uses in those situations.", "I made it to the rest stop by humming {w:song} in my head. Victory. I've never been so proud of my body."] }, fx: { discipline: 4, happy: 2 } },
          { w: 1, text: { fr: ["Je n'ai pas tenu. Le siège auto ne s'en est jamais remis. On a fini le trajet fenêtres ouvertes, {w:weather}. Personne n'en parle, mais tout le monde y pense.", "À deux kilomètres de l'aire, le barrage a cédé. {a.my} a dit, très calmement : « Ce n'est pas grave. » Ses yeux disaient le contraire."], en: ["I didn't make it. The car seat never recovered. We finished the drive with the windows down, {w:weather}. Nobody talks about it, but everyone thinks about it.", "A mile from the rest stop, the dam broke. {a.my} said very calmly, “It's fine.” Their eyes said otherwise."] }, fx: { happy: -5, looks: -1 } },
        ],
      },
      {
        label: { fr: 'Utiliser une bouteille', en: 'Use a bottle' },
        out: [
          { w: 1, text: { fr: ["{a.my} m'a tendu une bouteille vide. L'opération a été délicate dans les virages. La bouteille a voyagé jusqu'à la poubelle de l'aire sous les yeux d'une famille horrifiée.", "J'ai utilisé la bouteille. Puis quelqu'un d'autre l'a confondue avec sa gourde. Je ne dirai rien de plus. Ce secret mourra avec moi."], en: ["{a.my} handed me an empty bottle. The operation was delicate around the bends. The bottle traveled to the rest-stop trash under a horrified family's gaze.", "I used the bottle. Then someone else in the car mistook it for theirs. I'll say no more. This secret dies with me."] }, fx: { happy: 3, smarts: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_campsite_kids_club',
    icon: '🏕️',
    cat: 'friends',
    cooldown: 3,
    actor: { create: { role: 'acquaintance', age: [-1, 1], gender: 'any' } },
    when: { age: [4, 11] },
    scene: { place: 'beach', mood: 'happy' },
    text: {
      fr: [
        "Au camping, il y a un club enfants avec un animateur trop enthousiaste qui s'appelle Kévin. {a.first}, un enfant de l'emplacement d'à côté, t'invite à venir.",
        "Au camping, {a.first} te propose de construire une cabane dans les dunes. {a:Il|Elle} a déjà {w:object} et un plan sur un papier gras.",
        "Le camping organise un concours de châteaux de sable. {a.first}, que tu as {a:rencontré|rencontrée} à la piscine, veut faire équipe. {a:Il|Elle} ne parle pas ta langue.",
        "{a.first}, {a:le gamin|la gamine} de la caravane d'en face, te défie à la course de la piscine au snack. L'enjeu : {w:food}.",
      ],
      en: [
        "The campsite has a kids' club with an overly enthusiastic counselor called Kevin. {a.first}, a kid from the next pitch, invites you along.",
        "At the campsite, {a.first} suggests building a hideout in the dunes. They already have {w:object} and a plan on a greasy napkin.",
        "The campsite is holding a sandcastle contest. {a.first}, whom you met at the pool, wants to team up. They don't speak your language.",
        "{a.first}, the kid from the trailer opposite, challenges you to a race from the pool to the snack bar. The stakes: {w:food}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Foncer', en: 'Go for it' },
        out: [
          { w: 3, text: { fr: ["On a passé toutes les vacances ensemble. On a juré de s'écrire. On ne s'est jamais écrit. Mais c'était le meilleur été du monde.", "Avec {a.first}, on a construit la plus grande cabane du camping, avec {w:object} comme porte. Le dernier jour, on a pleuré comme des veaux.", "On a monté un spectacle pour tout le camping, sur {w:song}. Trois familles ont applaudi, une a fermé sa caravane. Meilleures vacances de ma vie."], en: ["We spent the entire vacation together. We swore to write. We never wrote. But it was the best summer ever.", "{a.first} and I built the biggest hideout on the campsite, with {w:object} as a door. On the last day we both cried our eyes out.", "We put on a show for the whole campsite, set to {w:song}. Three families clapped, one closed their trailer. Best vacation of my life."] }, fx: { happy: 7, athletic: 2, rel: 20 } },
          { w: 1, text: { fr: ["On a joué deux jours, puis la famille de {a.first} est partie {w:far_place} sans prévenir. Mon premier chagrin de vacances.", "On a fait la course. {a.first} a gagné, je suis tombé{|e} sur le gravier et je me suis écorché le genou. On a quand même partagé {w:food}."], en: ["We played for two days, then {a.first}'s family left for {w:far_place} without warning. My first vacation heartbreak.", "We raced. {a.first} won, I fell on the gravel and scraped my knee. We still shared {w:food}."] }, fx: { happy: 1, health: -1 } },
        ],
      },
      {
        label: { fr: 'Rester avec les parents', en: 'Stay with your parents' },
        out: [
          { w: 1, text: { fr: ["Je suis resté{|e} avec mes parents à la plage. Ils ont lu toute la journée. J'ai enterré mon père jusqu'au cou, avec {w:object} sur la tête. Il s'est endormi. J'ai eu peur.", "J'ai passé l'après-midi sous le parasol à regarder les autres enfants s'amuser. Mes parents m'ont demandé si ça allait. J'ai mangé {w:food} en silence."], en: ["I stayed at the beach with my parents. They read all day. I buried my dad up to his neck, with {w:object} on his head. He fell asleep. I got scared.", "I spent the afternoon under the umbrella watching the other kids have fun. My parents asked if I was okay. I ate {w:food} in silence."] }, fx: { happy: -1, health: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_campsite_disco',
    icon: '🪩',
    cat: 'family',
    cooldown: 3,
    when: { age: [4, 11] },
    scene: { place: 'party', mood: 'party' },
    text: {
      fr: [
        "Mini-disco du camping, 21 h. L'animateur lance {w:song} et monte le son. Tous les enfants se ruent sur la piste. Tes parents filment.",
        "Soirée dansante au camping. Un monsieur torse nu danse la Macarena avec {w:object}. Tu as très envie de le rejoindre.",
        "Ce soir, c'est l'élection de la mascotte du camping. Il faut danser sur scène devant tout le monde. Le prix : {w:gift}.",
        "Au camping, la mini-disco est le seul événement de la semaine. Tu connais toutes les chorégraphies. C'est ton moment.",
      ],
      en: [
        "Campsite mini-disco, 9 p.m. The entertainer puts on {w:song} and cranks it up. All the kids rush the dance floor. Your parents are filming.",
        "Dance night at the campsite. A shirtless man is doing the Macarena with {w:object}. You really want to join him.",
        "Tonight is the campsite mascot election. You have to dance on stage in front of everyone. The prize: {w:gift}.",
        "At the campsite, the mini-disco is the only event of the week. You know every routine. This is your moment.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout donner', en: 'Give it everything' },
        out: [
          { w: 2, text: { fr: ["J'ai dansé jusqu'à minuit, en sueur, sous les néons. L'animateur m'a nommé{|e} « {w:nickname} du camping ». Une famille belge m'a applaudi{|e}.", "J'ai fait la chenille, le limbo et le moonwalk. J'ai gagné {w:gift}. Mes parents, eux, se sont endormis sur les chaises en plastique."], en: ["I danced until midnight, sweaty, under the neon lights. The entertainer crowned me “{w:nickname} of the campsite”. A Belgian family applauded.", "I did the conga, the limbo and the moonwalk. I won {w:gift}. My parents fell asleep on the plastic chairs."] }, fx: { happy: 7, athletic: 2 } },
          { w: 1, text: { fr: ["J'ai glissé sur une flaque de soda et je suis tombé{|e} sur les fesses en plein milieu de la piste. L'animateur a dit « on applaudit ! ». Merci Kévin.", "Mon père m'a rejoint sur la piste. Il a dansé. Sur {w:song}. J'aurais préféré disparaître sous la tente."], en: ["I slipped on a puddle of soda and landed on my butt in the middle of the dance floor. The entertainer said “a round of applause!”. Thanks, Kevin.", "My dad joined me on the dance floor. He danced. To {w:song}. I'd rather have vanished under the tent."] }, fx: { happy: -2, looks: -1 } },
        ],
      },
      {
        label: { fr: 'Regarder de loin', en: 'Watch from a distance' },
        out: [
          { w: 1, text: { fr: ["J'ai regardé depuis le snack, avec une glace à l'eau. J'ai vu un grand-père faire le grand écart. Je ne m'en remettrai pas.", "Je suis resté{|e} assis{|e} avec un jus de pomme, en observant les adultes danser. C'était comme un documentaire sur {w:animal}, mais en tongs."], en: ["I watched from the snack bar with an ice pop. I saw a grandpa do the splits. I'll never recover.", "I sat with an apple juice watching the grown-ups dance. It was like a documentary about {w:animal}, but in flip-flops."] }, fx: { happy: 2, smarts: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_sibling_blame',
    icon: '🙄',
    cat: 'family',
    rating: 1,
    cooldown: 3,
    actor: 'sibling',
    when: { age: [4, 12], has: 'sibling' },
    scene: { place: 'home', mood: 'angry' },
    text: {
      fr: [
        "{a.first} a cassé la télécommande et dit à vos parents que c'était toi. {a:Il|Elle} te regarde avec un sourire de serpent.",
        "Les biscuits ont disparu. Il y a des miettes sur ton lit. Tu n'y es pour rien. {a.first} siffle {w:song} en regardant ailleurs.",
        "{a.first} a dessiné sur le mur du couloir et signé avec TON prénom. Le crime est presque parfait. Presque.",
        "{a.first} a mangé {w:food} prévu pour le dîner et t'accuse en pleurant. Ses larmes sont fausses, tu le sais, mais tes parents sont émus.",
      ],
      en: [
        "{a.first} broke the remote and told your parents it was you. They're looking at you with a snake's smile.",
        "The cookies are gone. There are crumbs on your bed. You had nothing to do with it. {a.first} whistles {w:song} and looks away.",
        "{a.first} drew on the hallway wall and signed it with YOUR name. The crime is almost perfect. Almost.",
        "{a.first} ate {w:food} meant for dinner and is blaming you, sobbing. The tears are fake, you know it, but your parents are moved.",
      ],
    },
    choices: [
      {
        label: { fr: 'Mener la contre-enquête', en: 'Run a counter-investigation' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai relevé les empreintes avec de la farine, comme dans {w:show}. Elles correspondaient à {a.first}. Mes parents ont été tellement impressionnés qu'ils ont oublié de punir quelqu'un.", "J'ai fait remarquer que le prénom sur le mur était mal orthographié. Je sais écrire mon prénom. {a.first} non. Affaire classée, coupable puni{a:|e}."], en: ["I dusted for fingerprints with flour, like on {w:show}. They matched {a.first}. My parents were so impressed they forgot to punish anyone.", "I pointed out that the name on the wall was misspelled. I can spell my name. {a.first} can't. Case closed, culprit punished."] }, fx: { happy: 5, smarts: 3, rel: -10 } },
          { w: 1, text: { fr: ["Ma contre-enquête n'a convaincu personne. J'ai été puni{|e} pour le crime ET pour « avoir mis de la farine partout ». Double peine.", "J'ai accusé {a.first}, {a.first} m'a accusé{|e}, et nos parents nous ont punis tous les deux. La justice est aveugle, et un peu fatiguée."], en: ["My counter-investigation convinced no one. I got punished for the crime AND for “getting flour everywhere”. Double sentence.", "I accused {a.first}, {a.first} accused me, and our parents punished us both. Justice is blind, and a bit tired."] }, fx: { happy: -4, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Préparer ta vengeance', en: 'Plot your revenge' },
        out: [
          { w: 2, text: { fr: ["J'ai accepté la punition sans rien dire. Puis j'ai caché {w:object} dans le lit de {a.first}. {a:Il|Elle} a hurlé à minuit. Le karma, c'est moi.", "J'ai attendu trois semaines. Puis j'ai remplacé le dentifrice de {a.first} par de la mayonnaise. La vengeance est un plat qui se mange à la menthe.", "J'ai mis {w:food} dans les chaussures de {a.first}. {a:Il|Elle} a marché dedans jusqu'à l'arrêt de bus. La vengeance est un plat qui se mange avec les pieds."], en: ["I took the punishment without a word. Then I hid {w:object} in {a.first}'s bed. Screams at midnight. I am karma.", "I waited three weeks. Then I swapped {a.first}'s toothpaste for mayonnaise. Revenge is a dish best served minty.", "I put {w:food} in {a.first}'s shoes. They walked in it all the way to the bus stop. Revenge is a dish best served underfoot."] }, fx: { happy: 5, karma: -2, rel: -10 } },
        ],
      },
      {
        label: { fr: 'Pactiser', en: 'Strike a deal' },
        out: [
          { w: 1, text: { fr: ["J'ai proposé un marché à {a.first} : je ne dis rien, et {a.he} me doit trois services. {a:Il|Elle} a signé. Je possède désormais une partie de son âme.", "On a fait un pacte de non-dénonciation. Depuis, on se couvre mutuellement. Nos parents ne comprennent pas pourquoi plus rien n'est jamais la faute de personne."], en: ["I offered {a.first} a deal: I keep quiet and they owe me three favors. They signed. I now own part of their soul.", "We made a no-snitching pact. Since then we cover for each other. Our parents can't figure out why nothing is ever anyone's fault anymore."] }, fx: { happy: 3, smarts: 2, rel: 10 } },
        ],
      },
    ],
  },
  {
    id: 'k2_cousin_bad_words',
    icon: '🤬',
    cat: 'family',
    rating: 1,
    once: true,
    actor: { create: { role: 'acquaintance', age: [1, 3], gender: 'any' } },
    when: { age: [5, 10] },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "{a:Ton cousin|Ta cousine} {a.first}, {a.age} ans, de passage pour le week-end, connaît des gros mots que même tes parents n'utilisent pas. {a:Il|Elle} propose de t'en apprendre.",
        "Au repas de famille, {a.first}, {a:ton cousin|ta cousine} de la ville, te chuchote un mot interdit qu'{a:il|elle} a entendu {w:at_place}. Tu ne sais pas ce qu'il veut dire.",
        "{a.first}, de la famille éloignée, a un carnet rempli d'insultes classées par ordre de gravité. La première page commence par « {w:insult} ».",
        "Chez mamie, {a.first} t'emmène derrière la haie pour te révéler « le pire gros mot du monde ». {a:Il|Elle} l'a appris de son père, qui conduit des camions.",
      ],
      en: [
        "Your cousin {a.first}, {a.age}, visiting for the weekend, knows swear words even your parents don't use. They offer to teach you.",
        "At the family dinner, {a.first}, your city cousin, whispers a forbidden word they heard {w:at_place}. You don't know what it means.",
        "{a.first}, a distant cousin, has a notebook full of insults ranked by severity. Page one starts with “{w:insult}”.",
        "At grandma's, {a.first} takes you behind the hedge to reveal “the worst swear word in the world”. They learned it from their dad, who drives trucks.",
      ],
    },
    choices: [
      {
        label: { fr: 'Apprendre le mot', en: 'Learn the word' },
        out: [
          { w: 2, text: { fr: ["J'ai appris le mot. Je l'ai testé au dîner, devant mamie. Mamie a renversé {w:food} sur la nappe. Puis elle a dit le même mot. La famille est une chaîne.", "J'ai ressorti le mot à l'école, devant la maîtresse. Elle a appelé mes parents. Mon père a demandé où je l'avais appris, avec un air de grande culpabilité."], en: ["I learned the word. I tried it at dinner in front of grandma. Grandma spilled {w:food} on the tablecloth. Then she said the same word. Family is a chain.", "I used the word at school in front of the teacher. She called my parents. My dad asked where I'd learned it, looking extremely guilty."] }, fx: { happy: 4, discipline: -3, karma: -1 } },
          { w: 1, text: { fr: ["Le « pire mot du monde » était en fait « {w:insult} ». J'ai été déçu{|e}. Les grands mentent sur tout.", "J'ai appris le mot, mais je l'ai mal compris. J'ai dit « saperlipopette » avec rage pendant un mois. Personne n'a été choqué."], en: ["“The worst word in the world” turned out to be “{w:insult}”. I was disappointed. Big kids lie about everything.", "I learned the word but got it wrong. I angrily said “jeepers” for a month. Nobody was shocked."] }, fx: { happy: 2, smarts: 1 } },
        ],
      },
      {
        label: { fr: 'Aller tout répéter', en: 'Go tell on them' },
        out: [
          { w: 1, text: { fr: ["J'ai tout répété aux adultes, avec le mot en entier pour être précis{|e}. J'ai été puni{|e} pour l'avoir dit. {a.first} aussi. On est devenus complices dans la douleur.", "J'ai dénoncé {a.first}. Mon oncle a eu une conversation sérieuse avec {a.him}. Puis il a juré en se cognant la tête dans l'escalier. Tout le monde l'a entendu."], en: ["I told the grown-ups everything, saying the word in full to be accurate. I got punished for saying it. So did {a.first}. We bonded in suffering.", "I ratted out {a.first}. My uncle had a serious talk with {a.him}. Then he swore when he hit his head on the stairs. Everyone heard."] }, fx: { happy: -2, karma: 1, discipline: 2 } },
        ],
      },
      {
        label: { fr: 'Échanger tes propres mots', en: 'Trade your own words' },
        out: [
          { w: 1, text: { fr: ["En échange, j'ai appris à {a.first} le mot que mon père dit quand il marche sur {w:object}. Échange culturel réussi. Nos deux familles sont en danger.", "On a inventé des gros mots ensemble. Le meilleur est « {w:insult} ». Il est désormais officiel dans toute la famille."], en: ["In return I taught {a.first} the word my dad says when he steps on {w:object}. Successful cultural exchange. Both our families are in danger.", "We invented swear words together. The best one is “{w:insult}”. It's now official across the whole family."] }, fx: { happy: 5, rel: 15, keep: true } },
        ],
      },
    ],
  },
  {
    id: 'k2_grandparent_coin',
    icon: '🪙',
    cat: 'family',
    cooldown: 3,
    actor: 'grandparent',
    when: { age: [3, 9], has: 'grandparent' },
    scene: { place: 'home', mood: 'happy' },
    text: {
      fr: [
        "{a.rel} sort une pièce de ton oreille. Puis de ton nez. Puis carrément {w:object}, de ta manche. Tu commences à te demander combien d'argent tu as dans la tête.",
        "{a.rel} te glisse un billet dans la main en chuchotant « ne le dis pas à tes parents ». C'est la quatrième fois aujourd'hui.",
        "{a.rel} prétend avoir appris la magie {w:far_place} pendant sa jeunesse. {a:Il|Elle} va faire disparaître ton goûter.",
        "{a.rel} te propose un tour de magie : faire disparaître un bonbon et le faire réapparaître {w:at_place}. Ça sent l'arnaque, mais tu es {curieux|curieuse}.",
      ],
      en: [
        "{a.rel} pulls a coin out of your ear. Then your nose. Then {w:object}, out of your sleeve. You're starting to wonder how much money is in your head.",
        "{a.rel} slips a bill into your hand, whispering “don't tell your parents”. It's the fourth time today.",
        "{a.rel} claims to have learned magic {w:far_place} in their youth. They're going to make your snack disappear.",
        "{a.rel} offers a magic trick: make a candy vanish and reappear {w:at_place}. Smells like a scam, but you're curious.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exiger le secret', en: 'Demand the secret' },
        out: [
          { w: 2, text: { fr: ["{a.my} m'a appris le tour en jurant de ne jamais le révéler. Je l'ai montré à toute la classe le lendemain. Je suis une star et un traître.", "{a.my} a dit que c'était de la « vraie magie ». J'ai fouillé ses manches pendant vingt minutes. J'ai trouvé un mouchoir, une pastille et {w:object}."], en: ["{a.my} taught me the trick, making me swear never to reveal it. I showed the whole class the next day. I'm a star and a traitor.", "{a.my} said it was “real magic”. I searched their sleeves for twenty minutes. I found a tissue, a cough drop and {w:object}."] }, fx: { happy: 4, smarts: 2, rel: 10 } },
        ],
      },
      {
        label: { fr: 'Garder l\'argent', en: 'Keep the money' },
        out: [
          { w: 2, text: { fr: ["J'ai empoché toutes les pièces. J'ai maintenant [[3,40|7,10|12]] dans ma tirelire. Je songe à prendre ma retraite {w:far_place}.", "J'ai gardé l'argent et je me suis acheté {w:food} en cachette. C'était délicieux. Le secret, c'est meilleur que le sucre."], en: ["I pocketed every coin. I now have [[3.40|7.10|12]] in my piggy bank. I'm considering early retirement {w:far_place}.", "I kept the money and secretly bought myself {w:food}. Delicious. Secrets taste better than sugar."] }, fx: { happy: 5, money: 5, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Faire un tour à ton tour', en: 'Do a trick in return' },
        out: [
          { w: 1, text: { fr: ["J'ai fait disparaître les lunettes de {a.my}. Pour de vrai. On ne les a jamais retrouvées. {a:Il|Elle} m'a regardé{|e} avec une admiration mêlée d'inquiétude.", "J'ai essayé de sortir une pièce de l'oreille de {a.my}. Elle est tombée dans son thé. On a ri si fort que {a:il|elle} a dû s'asseoir."], en: ["I made {a.my}'s glasses disappear. For real. We never found them. They looked at me with admiration and some concern.", "I tried to pull a coin out of {a.my}'s ear. It fell into their tea. We laughed so hard they had to sit down."] }, fx: { happy: 5, rel: 15 } },
        ],
      },
    ],
  },
  {
    id: 'k2_grandparent_app',
    icon: '📱',
    cat: 'family',
    cooldown: 3,
    actor: 'grandparent',
    when: { age: [7, 12], has: 'grandparent', era: [2010, 2100] },
    scene: { place: 'home', mood: 'neutral', prop: 'phone' },
    text: {
      fr: [
        "{a.rel} vient d'avoir son premier smartphone et veut installer {w:app}. Tu es la seule personne de la famille qui a « la patience ».",
        "{a.rel} t'appelle en visio, mais tu ne vois que son oreille et le plafond. {a:Il|Elle} crie « TU M'ENTENDS ? » depuis cinq minutes.",
        "{a.rel} a envoyé un message vocal de quatre minutes à toute la famille par erreur. On y entend {w:sound} et une conversation sur les voisins.",
        "{a.rel} veut que tu lui expliques comment envoyer une photo. Tu as déjà expliqué [[six|onze|vingt]] fois. Le chat fait toujours partie des photos.",
      ],
      en: [
        "{a.rel} just got their first smartphone and wants to install {w:app}. You're the only person in the family with “the patience”.",
        "{a.rel} is video-calling you, but all you can see is an ear and the ceiling. They've been shouting “CAN YOU HEAR ME?” for five minutes.",
        "{a.rel} accidentally sent a four-minute voice message to the whole family. It features {w:sound} and a conversation about the neighbors.",
        "{a.rel} wants you to explain how to send a photo. You've explained it [[six|eleven|twenty]] times. The cat is still in every photo.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire un cours patient', en: 'Give a patient lesson' },
        out: [
          { w: 2, text: { fr: ["Après deux heures, {a.my} sait envoyer des émojis. {a:Il|Elle} m'envoie désormais [[quarante|cent|deux cents]] cœurs par jour, et {w:animal} en photo floue.", "J'ai tout expliqué. Le lendemain, {a.my} avait rejoint {w:app} et commenté toutes les photos de la famille avec « BRAVO » en majuscules.", "J'ai montré à {a.my} comment faire une vidéo. {a:Il|Elle} a filmé {w:animal} pendant quarante minutes et l'a envoyé à toute la famille, en pleine nuit."], en: ["After two hours, {a.my} can send emojis. Now I get [[forty|a hundred|two hundred]] hearts a day, plus blurry photos of {w:animal}.", "I explained everything. The next day {a.my} had joined {w:app} and commented “WELL DONE” in caps on every family photo.", "I showed {a.my} how to make a video. They filmed {w:animal} for forty minutes and sent it to the whole family in the middle of the night."] }, fx: { happy: 3, smarts: 2, karma: 2, rel: 15 } },
        ],
      },
      {
        label: { fr: 'Changer la langue en chinois', en: 'Switch the language to Chinese' },
        out: [
          { w: 1, text: { fr: ["J'ai mis le téléphone de {a.my} en chinois pour rire. Personne ne sait le remettre. {a:Il|Elle} s'en sert quand même. {a:Il|Elle} commande des choses par erreur.", "J'ai changé la langue. {a.my} a mis trois jours à s'en rendre compte. {a:Il|Elle} pensait que les messages de la famille étaient devenus « très modernes »."], en: ["I switched {a.my}'s phone to Chinese as a joke. Nobody can switch it back. They use it anyway. They keep ordering things by accident.", "I changed the language. It took {a.my} three days to notice. They thought the family messages had just become “very modern”."] }, fx: { happy: 4, karma: -2, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Passer le relais', en: 'Pass the buck' },
        out: [
          { w: 1, text: { fr: ["J'ai dit qu'il fallait demander à mes parents. Mes parents ont dit de me demander à moi. {a.my} a renoncé et a ressorti son vieux téléphone à clapet. Il marche très bien.", "J'ai prétexté des devoirs urgents. {a.my} a appelé le voisin, qui a installé {w:app} en trente secondes. Je me suis senti{|e} remplacé{|e}."], en: ["I said to ask my parents. My parents said to ask me. {a.my} gave up and dug out their old flip phone. It works great.", "I claimed urgent homework. {a.my} called the neighbor, who installed {w:app} in thirty seconds. I felt replaced."] }, fx: { happy: 1, rel: -5 } },
        ],
      },
    ],
  },

  {
    id: 'k2_parent_stash',
    icon: '🍫',
    cat: 'family',
    rating: 1,
    cooldown: 4,
    actor: 'parent',
    when: { age: [5, 12], has: 'parent' },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "{a.rel} est « au régime » depuis trois semaines. En cherchant {w:object} dans le placard à balais, tu découvres sa réserve secrète : [[six|douze|vingt]] tablettes de chocolat.",
        "Tu as trouvé, caché derrière les produits ménagers, le stock secret de bonbons de {a.rel}. Ceux-là mêmes qu'{a.he} t'interdit « parce que c'est plein de sucre ».",
        "{a.rel} prétend ne plus regarder {w:show}. Pourtant, l'historique de la télé dit le contraire, avec quarante épisodes cette semaine.",
        "Dans la boîte à gants, tu tombes sur un sachet de chips au vinaigre à moitié vide, coincé sous {w:object}. Or {a.rel} jure qu'{a.he} « déteste les chips ».",
      ],
      en: [
        "{a.rel} has been “on a diet” for three weeks. While looking for {w:object} in the broom closet, you find their secret stash: [[six|twelve|twenty]] chocolate bars.",
        "Hidden behind the cleaning products, you found {a.rel}'s secret candy stockpile. The very candy {a.he} bans you from “because it's full of sugar”.",
        "{a.rel} claims to have stopped watching {w:show}. Yet the TV history says otherwise, with forty episodes this week.",
        "In the glove box you stumble on a half-eaten bag of salt-and-vinegar chips, wedged under {w:object}. And {a.rel} swears {a.he} “hates chips”.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire chanter {a.rel}', en: 'Blackmail {a.rel}' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai posé une tablette sur la table du petit-déjeuner, sans un mot. {a.my} a blêmi. Depuis, je regarde {w:show} tous les soirs. On ne parle jamais du placard.", "J'ai négocié : mon silence contre une heure de jeux vidéo par jour et {w:gift}. {a.my} a signé. J'ai {age} ans et je suis déjà dans le crime organisé."], en: ["I placed a chocolate bar on the breakfast table without a word. {a.my} went pale. Since then I get {w:show} every night. We never mention the closet.", "I negotiated: my silence for an hour of video games a day and {w:gift}. {a.my} signed. I'm {age} and already in organized crime."] }, fx: { happy: 6, karma: -3, rel: -5 } },
          { w: 1, text: { fr: ["{a.my} a nié en bloc, avec du chocolat sur les dents. Puis m'a puni{|e} pour avoir « fouillé ». L'État a toujours raison.", "{a.my} a retourné la situation : « Et toi, qu'est-ce que tu faisais dans le placard ? » Je n'avais pas de réponse. J'ai perdu le procès."], en: ["{a.my} denied everything, with chocolate on their teeth. Then grounded me for “snooping”. The State is always right.", "{a.my} flipped it: “And what were YOU doing in the closet?” I had no answer. I lost the case."] }, fx: { happy: -3, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Manger la réserve', en: 'Eat the stash' },
        out: [
          { w: 2, text: { fr: ["J'ai mangé la moitié de la réserve. {a.my} n'a rien pu dire, puisque la réserve n'existait pas officiellement. Crime parfait. Mal au ventre parfait aussi, avec {w:sound} en prime.", "J'ai tout mangé et remplacé le chocolat par {w:object} dans l'emballage. {a.my} a ouvert le placard en pleine nuit. J'ai entendu le cri depuis ma chambre."], en: ["I ate half the stash. {a.my} couldn't say a thing, since officially the stash didn't exist. Perfect crime. Perfect stomachache too, with {w:sound} as a bonus.", "I ate it all and put {w:object} inside the wrapper. {a.my} opened the closet late that night. I heard the scream from my room."] }, fx: { happy: 5, health: -3, weight: 0.02 } },
        ],
      },
      {
        label: { fr: 'Garder le secret', en: 'Keep the secret' },
        out: [
          { w: 1, text: { fr: ["Je n'ai rien dit. Un soir, j'ai croisé {a.my} dans la cuisine à minuit, la main dans le placard. On s'est regardés. On a partagé une tablette en silence. C'est notre secret.", "J'ai refermé le placard et je n'en ai jamais parlé. Tout le monde a besoin d'un endroit où cacher ses faiblesses. Même les parents."], en: ["I said nothing. One night I bumped into {a.my} in the kitchen at midnight, hand in the closet. We looked at each other. We shared a bar in silence. Our secret.", "I closed the closet and never mentioned it. Everyone needs a place to hide their weaknesses. Even parents."] }, fx: { happy: 3, karma: 2, rel: 15 } },
        ],
      },
    ],
  },
  {
    id: 'k2_bedtime_deal',
    icon: '🛏️',
    cat: 'family',
    cooldown: 2,
    actor: 'parent',
    when: { age: [3, 9], has: 'parent' },
    scene: { place: 'home', mood: 'sleepy', prop: 'bed' },
    text: {
      fr: [
        "Il est 20 h 30, l'heure d'aller au lit. Tu as soif, envie de faire pipi, une question sur {w:animal} et une histoire à réclamer à {a.rel}.",
        "{a.rel} vient d'éteindre la lumière. Tu te rappelles soudain que tu dois absolument raconter ta journée. En détail. Avec {w:sound} pour illustrer.",
        "L'heure du coucher approche. {a.rel} a l'air épuisé{a:|e}. C'est le moment idéal pour négocier une demi-heure de plus devant {w:show}.",
        "{a.rel} lit une histoire. Tu as remarqué qu'{a.he} saute des pages pour finir plus vite. Tu connais le livre par cœur.",
      ],
      en: [
        "It's 8:30 p.m., bedtime. You're thirsty, you need to pee, you have a question about {w:animal} and a story to demand from {a.rel}.",
        "{a.rel} just turned off the light. You suddenly remember you absolutely must recount your day. In detail. Illustrated with {w:sound}.",
        "Bedtime is near. {a.rel} looks exhausted. The perfect moment to negotiate half an hour more of {w:show}.",
        "{a.rel} is reading a bedtime story. You noticed {a.he} skips pages to finish faster. You know the book by heart.",
      ],
    },
    choices: [
      {
        label: { fr: 'Négocier comme un avocat', en: 'Negotiate like a lawyer' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai obtenu cinq minutes de plus, puis cinq autres, puis un verre d'eau, puis une histoire. Il était 22 h. {a.my} s'est endormi{a:|e} avant moi, au bout du lit.", "J'ai argumenté que les enfants {w:far_place} se couchent à minuit. {a.my} a vérifié sur son téléphone. J'ai perdu, mais j'ai gagné vingt minutes de débat.", "J'ai invoqué une loi selon laquelle les enfants ont droit à une histoire par année d'âge. {a.my} m'en a lu {age}. Sur {w:animal}. On s'est endormis ensemble."], en: ["I got five more minutes, then five more, then a glass of water, then a story. It was 10 p.m. {a.my} fell asleep before me, at the foot of the bed.", "I argued that kids {w:far_place} go to bed at midnight. {a.my} checked on their phone. I lost, but I gained twenty minutes of debate.", "I cited a law entitling kids to one story per year of age. {a.my} read me {age}. About {w:animal}. We fell asleep together."] }, fx: { happy: 4, smarts: 2, health: -1 } },
          { w: 1, text: { fr: ["{a.my} a utilisé l'arme ultime : « Je compte jusqu'à trois. » À « deux et demi », j'étais au lit. Je ne saurai jamais ce qui arrive à trois.", "J'ai trop négocié. {a.my} a prononcé mon prénom en entier. Les négociations ont été suspendues sine die. Lumière éteinte."], en: ["{a.my} used the ultimate weapon: “I'm counting to three.” By “two and a half” I was in bed. I'll never know what happens at three.", "I pushed it too far. {a.my} said my full name. Negotiations suspended indefinitely. Lights out."] }, fx: { happy: -2, discipline: 2 } },
        ],
      },
      {
        label: { fr: 'Corriger l\'histoire', en: 'Correct the story' },
        out: [
          { w: 2, text: { fr: ["« Tu as sauté la page où le lapin rencontre {w:animal} ! » {a.my} a soupiré et tout relu depuis le début. J'ai gagné. On a gagné tous les deux, au fond.", "J'ai récité l'histoire avec {a.my}, mot pour mot. {a:Il|Elle} a été bluffé{a:|e}. Moi aussi. Je ne sais pas encore lire."], en: ["“You skipped the page where the bunny meets {w:animal}!” {a.my} sighed and reread the whole thing. I won. We both won, really.", "I recited the story along with {a.my}, word for word. They were stunned. So was I. I can't even read yet."] }, fx: { happy: 3, smarts: 2, rel: 10 } },
        ],
      },
      {
        label: { fr: 'Aller au lit sagement', en: 'Go to bed nicely' },
        out: [
          { w: 1, text: { fr: ["Je suis allé{|e} me coucher sans discuter. {a.my} a pris ma température, persuadé{a:|e} que j'étais malade. J'ai dormi comme un bébé.", "J'ai dit « bonne nuit » et j'ai fermé les yeux. Puis j'ai lu un livre sur {w:hobby} sous la couette jusqu'à minuit. La sagesse, c'est surtout de l'apparence."], en: ["I went to bed without arguing. {a.my} took my temperature, convinced I was sick. I slept like a baby.", "I said “good night” and closed my eyes. Then I read a book about {w:hobby} under the covers until midnight. Being good is mostly about appearances."] }, fx: { health: 3, discipline: 2, rel: 5 } },
        ],
      },
    ],
  },
  {
    id: 'k2_monster_deal',
    icon: '👹',
    cat: 'weird',
    once: true,
    when: { age: [3, 8] },
    scene: { place: 'home', mood: 'shock', prop: 'bed', fx: 'ghost' },
    text: {
      fr: [
        "Il y a un monstre sous ton lit. Tu en es sûr{|e} : tu as entendu {w:sound} et vu une forme bouger. Il est 2 h du matin.",
        "Cette nuit, le placard de ta chambre s'est entrouvert tout seul. Une odeur s'en échappe : {w:smell}. Le monstre est de retour.",
        "Tu as décidé d'affronter le monstre sous ton lit. Tu as une lampe de poche, {w:object} comme arme et beaucoup de courage. Enfin, un peu.",
        "Le monstre sous ton lit t'empêche de dormir depuis une semaine. Ce soir, tu lui parles. Il ne répond pas. Mais il écoute, tu le sens.",
      ],
      en: [
        "There's a monster under your bed. You're sure of it: you heard {w:sound} and saw a shape move. It's 2 a.m.",
        "Tonight your closet door creaked open by itself. A smell drifts out: {w:smell}. The monster is back.",
        "You've decided to face the monster under your bed. You have a flashlight, {w:object} as a weapon and a lot of courage. Well, some.",
        "The monster under your bed has kept you up for a week. Tonight you talk to it. It doesn't answer. But it's listening, you can feel it.",
      ],
    },
    choices: [
      {
        label: { fr: 'Signer un traité', en: 'Sign a treaty' },
        out: [
          { w: 2, text: { fr: ["J'ai écrit un contrat au feutre : le monstre garde le dessous du lit, moi le dessus, et je lui laisse {w:food} chaque soir. Le matin, l'assiette était vide. Le chien a l'air content.", "J'ai négocié avec le monstre : il ne me mange pas, je ne le dénonce pas à mes parents. J'ai glissé le contrat sous le lit. Il a été accepté. Je crois."], en: ["I wrote a contract in marker: the monster gets under the bed, I get on top, and I leave it {w:food} every night. In the morning the plate was empty. The dog looks happy.", "I negotiated with the monster: it doesn't eat me, I don't report it to my parents. I slid the contract under the bed. It was accepted. I think."] }, fx: { happy: 5, smarts: 2, flag: 'k2_monster_pact', schedule: { key: 'k2_monster_return', years: 2 } } },
        ],
      },
      {
        label: { fr: 'Attaquer', en: 'Attack' },
        out: [
          { w: 2, text: { fr: ["J'ai plongé sous le lit avec {w:object} en hurlant. J'ai trouvé une chaussette, un vieux biscuit et la télécommande perdue depuis Noël. Le monstre a fui. Je suis un héros.", "J'ai attaqué. Je me suis cogné{|e} {w:bodypart} contre le sommier. Le monstre a dû rire. Moi, j'ai pleuré, mais avec courage."], en: ["I dove under the bed with {w:object}, screaming. I found a sock, an old cookie and the remote lost since Christmas. The monster fled. I'm a hero.", "I attacked. I banged my {w:bodypart} on the bed frame. The monster must have laughed. I cried, but bravely."] }, fx: { happy: 4, athletic: 1, health: -1 } },
        ],
      },
      {
        label: { fr: 'Courir dans le lit des parents', en: "Run to your parents' bed" },
        out: [
          { w: 2, text: { fr: ["J'ai traversé le couloir en quatre secondes et je me suis glissé{|e} entre mes parents. Mon père a pris un coup de pied dans les reins toute la nuit. J'ai très bien dormi.", "J'ai couru chez mes parents. Ma mère a vérifié sous mon lit avec une lampe. « Il n'y a rien. » Évidemment : il se cache quand les adultes regardent. Tout le monde sait ça."], en: ["I crossed the hallway in four seconds and slid in between my parents. My dad got kicked in the kidneys all night. I slept great.", "I ran to my parents. My mom checked under my bed with a flashlight. “There's nothing there.” Obviously: it hides when grown-ups look. Everyone knows that."] }, fx: { happy: 2, health: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_monster_return',
    icon: '📜',
    cat: 'weird',
    chainOnly: true,
    when: { age: [5, 12], flag: 'k2_monster_pact' },
    scene: { place: 'home', mood: 'neutral', fx: 'ghost' },
    text: {
      fr: [
        "En faisant le ménage de ta chambre, tu retrouves sous le lit le vieux contrat signé avec le monstre. Quelqu'un a écrit en dessous : « Je suis toujours là. Merci pour {w:food}. »",
        "Deux ans ont passé. Tu ne crois plus aux monstres. Pourtant, cette nuit, tu entends {w:sound} sous le lit, exactement comme avant.",
        "Ton petit voisin a peur d'un monstre sous son lit. Tu as de l'expérience en la matière. Tu as même un modèle de contrat.",
        "Tu retrouves au fond d'un tiroir le traité avec le monstre, avec une tache suspecte. On dirait {w:food}. Tu hésites à le jeter.",
      ],
      en: [
        "Tidying your room, you find the old contract with the monster under the bed. Someone has written underneath: “I'm still here. Thanks for {w:food}.”",
        "Two years have passed. You don't believe in monsters anymore. And yet tonight you hear {w:sound} under the bed, exactly like before.",
        "The little kid next door is scared of a monster under his bed. You have experience in this field. You even have a contract template.",
        "At the bottom of a drawer you find the treaty with the monster, with a suspicious stain. It looks like {w:food}. You're not sure whether to throw it away.",
      ],
    },
    choices: [
      {
        label: { fr: 'Résilier le contrat', en: 'Terminate the contract' },
        out: [
          { w: 2, text: { fr: ["J'ai déchiré le contrat solennellement. Rien ne s'est passé. Puis j'ai entendu un soupir sous le lit. Je dors avec la lumière depuis. Juste au cas où.", "J'ai écrit une lettre de résiliation polie. Le lendemain, elle avait disparu. Mon père a l'air de très bien savoir où elle est. Il sourit beaucoup."], en: ["I solemnly tore up the contract. Nothing happened. Then I heard a sigh under the bed. I've slept with the light on since. Just in case.", "I wrote a polite termination letter. The next day it was gone. My dad seems to know exactly where it is. He's smiling a lot."] }, fx: { happy: 2, smarts: 2, unflag: 'k2_monster_pact' } },
        ],
      },
      {
        label: { fr: 'Aider le petit voisin', en: 'Help the kid next door' },
        out: [
          { w: 2, text: { fr: ["J'ai rédigé un contrat pour le petit voisin, avec clause {w:food} et tout. Il dort comme un loir. Sa mère m'a payé{|e} en gâteaux. Je suis consultant{|e} en monstres.", "J'ai expliqué au petit voisin toutes mes techniques. Il m'a regardé{|e} comme un vieux sage. J'ai {age} ans et j'ai déjà transmis un savoir."], en: ["I drafted a contract for the kid next door, {w:food} clause included. He sleeps like a log. His mom paid me in cake. I'm a monster consultant.", "I taught the kid next door all my techniques. He looked at me like a wise old sage. I'm {age} and I've already passed on knowledge."] }, fx: { happy: 4, karma: 3, unflag: 'k2_monster_pact' } },
        ],
      },
    ],
  },
  {
    id: 'k2_veggie_hide',
    icon: '🥦',
    cat: 'family',
    rating: 1,
    cooldown: 3,
    actor: 'parent',
    when: { age: [3, 10], has: 'parent' },
    scene: { place: 'home', mood: 'angry' },
    text: {
      fr: [
        "Il y a des brocolis dans ton assiette. {a.rel} a dit que tu ne quitteras pas la table tant que tu ne les auras pas mangés. Ça fait quarante minutes.",
        "Ce soir, c'est épinards. {a.rel} essaie de te faire croire que c'est « de la glace verte ». Tu n'es pas né{|e} de la dernière pluie.",
        "{a.rel} a caché des courgettes dans {w:food}. Tu les as repérées. Tu repères toujours les courgettes.",
        "Choux de Bruxelles au dîner. Ils sentent {w:smell}. {a.rel} te fixe. Le chien, sous la table, te fixe aussi.",
      ],
      en: [
        "There's broccoli on your plate. {a.rel} said you can't leave the table until it's gone. It's been forty minutes.",
        "Spinach tonight. {a.rel} is trying to convince you it's “green ice cream”. You weren't born yesterday.",
        "{a.rel} hid zucchini inside {w:food}. You spotted it. You always spot the zucchini.",
        "Brussels sprouts for dinner. They smell like {w:smell}. {a.rel} is staring at you. So is the dog under the table.",
      ],
    },
    choices: [
      {
        label: { fr: 'Les cacher', en: 'Hide them' },
        out: [
          { w: 2, text: { fr: ["J'ai caché les brocolis dans le pot de la plante verte. Elle est morte trois semaines plus tard. Ma mère l'a pleurée en écoutant {w:song}. Je n'ai jamais rien dit.", "J'ai glissé les légumes au chien sous la table. Le chien a pété toute la nuit dans le salon. Mon père l'a accusé d'avoir mangé {w:object}. J'ai laissé faire."], en: ["I hid the broccoli in the houseplant pot. It died three weeks later. My mom mourned it to {w:song}. I never said a word.", "I slipped the veggies to the dog under the table. The dog farted all night in the living room. Dad accused it of eating {w:object}. I let him."] }, fx: { happy: 4, karma: -2, health: -1 } },
          { w: 1, text: { fr: ["J'ai caché les épinards dans ma serviette. {a.my} l'a secouée en débarrassant. Les épinards ont volé jusqu'au plafond. Certains y sont encore.", "J'ai mis les choux dans ma poche. J'ai oublié. Ils ont fait un tour de machine à laver. Le linge sent {w:smell} depuis."], en: ["I hid the spinach in my napkin. {a.my} shook it out while clearing the table. The spinach flew to the ceiling. Some is still up there.", "I put the sprouts in my pocket. I forgot. They went through the washing machine. The laundry has smelled like {w:smell} ever since."] }, fx: { happy: -2, discipline: -2, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Les manger d\'un coup', en: 'Eat them in one go' },
        out: [
          { w: 2, text: { fr: ["J'ai tout avalé d'un coup en me bouchant le nez. J'ai eu un haut-le-cœur théâtral. {a.my} a applaudi. J'ai eu double dessert : {w:food}.", "J'ai mangé les brocolis. C'était… pas si mal ? Je ne l'avouerai jamais. Je l'emporterai dans la tombe.", "J'ai tout mangé en imaginant que c'était {w:food}. Ça n'a pas marché, mais j'ai fini. {a.my} a pris l'assiette vide en photo pour la famille."], en: ["I swallowed it all at once, holding my nose. I gagged theatrically. {a.my} applauded. I got double dessert: {w:food}.", "I ate the broccoli. It was… not that bad? I'll never admit it. I'll take it to my grave.", "I ate it all pretending it was {w:food}. It didn't work, but I finished. {a.my} took a photo of the empty plate for the family."] }, fx: { health: 4, discipline: 2, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Grève de la faim', en: 'Hunger strike' },
        out: [
          { w: 1, text: { fr: ["J'ai déclaré une grève de la faim. Elle a duré jusqu'à 21 h 10, heure à laquelle j'ai été surpris{|e} en train de manger {w:food} dans le frigo, à la lumière de la porte.", "J'ai tenu toute la soirée face aux brocolis froids. {a.my} a tenu aussi. À minuit, on s'est endormis à table, le nez dans {w:food}. Match nul."], en: ["I declared a hunger strike. It lasted until 9:10 p.m., when I was caught eating {w:food} out of the fridge by the light of the door.", "I held out all evening against the cold broccoli. So did {a.my}. At midnight we both fell asleep at the table, faces in {w:food}. Draw."] }, fx: { happy: -3, discipline: 1, health: -1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_doctor_checkup',
    icon: '🩺',
    cat: 'health',
    cooldown: 3,
    actor: 'parent',
    when: { age: [3, 10], has: 'parent' },
    scene: { place: 'hospital', mood: 'neutral' },
    text: {
      fr: [
        "Visite chez le médecin. Il a un marteau pour taper sur ton genou, un bâton pour regarder ta gorge et une piqûre qui t'attend sur un plateau.",
        "Rappel de vaccin aujourd'hui. Dans la salle d'attente, un enfant hurle derrière la porte. {a.rel} te promet {w:gift} si tu es {courageux|courageuse}.",
        "Le médecin te demande de tirer la langue et de dire « Aaaah ». Tu as mangé {w:food} juste avant. Il va le voir.",
        "Chez le pédiatre, tu dois te mettre en slip devant {a.rel} et une dame qui prend des notes. On te pèse comme {w:animal} à la foire.",
      ],
      en: [
        "Doctor's appointment. He has a hammer for your knee, a stick for your throat and a shot waiting for you on a tray.",
        "Vaccine booster today. In the waiting room, a kid is screaming behind the door. {a.rel} promises you {w:gift} if you're brave.",
        "The doctor asks you to stick out your tongue and say “Aaaah”. You ate {w:food} right before. He's going to see it.",
        "At the pediatrician's you have to strip to your underwear in front of {a.rel} and a lady taking notes. They weigh you like {w:animal} at a county fair.",
      ],
    },
    choices: [
      {
        label: { fr: 'Être courageux', en: 'Be brave' },
        out: [
          { w: 2, text: { fr: ["Je n'ai pas pleuré. Pas une larme. J'ai eu une sucette, {w:gift} et l'admiration de {a.my}. Le vaccin, c'est rien. Le courage, c'est tout.", "J'ai serré les dents en fixant le poster au mur, où l'on voit {w:animal}, pendant la piqûre. Fini en trois secondes. J'ai exigé {w:gift}. Je l'ai eu."], en: ["I didn't cry. Not one tear. I got a lollipop, {w:gift} and {a.my}'s admiration. The shot is nothing. Courage is everything.", "I gritted my teeth and stared at the poster of {w:animal} on the wall during the shot. Done in three seconds. I demanded {w:gift}. I got it."] }, fx: { happy: 4, health: 3, discipline: 2, rel: 5 } },
        ],
      },
      {
        label: { fr: 'S\'enfuir dans le couloir', en: 'Run down the hallway' },
        out: [
          { w: 2, text: { fr: ["Je me suis enfui{|e} dans le couloir et caché{|e} dans le local à balais. Il a fallu deux infirmières, {a.my} et une promesse ({w:food} au retour) pour me déloger.", "J'ai couru jusqu'à l'ascenseur. Les portes se sont fermées. Je suis descendu{|e} au sous-sol, seul{|e}, puis remonté{|e} en pleurant. La piqûre m'a semblé douce après ça."], en: ["I fled down the hallway and hid in the broom closet. It took two nurses, {a.my} and a promise ({w:food} on the way home) to dig me out.", "I ran to the elevator. The doors closed. I went down to the basement alone, then came back up crying. The shot felt gentle after that."] }, fx: { happy: -2, health: 2, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Poser des questions', en: 'Ask questions' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai demandé au médecin à quoi servait chaque instrument. Il m'a laissé{|e} écouter mon cœur au stéthoscope. Ça fait {w:sound}. Je veux être médecin. Ou {w:weird_job}.", "J'ai posé tellement de questions que le médecin a oublié de faire la piqûre. On est rentrés {w:weather}. On a dû revenir la semaine suivante. Victoire temporaire."], en: ["I asked the doctor what every instrument was for. He let me listen to my heart with the stethoscope. It sounds like {w:sound}. I want to be a doctor. Or {w:weird_job}.", "I asked so many questions the doctor forgot to give me the shot. We went home {w:weather}. We had to come back the next week. Temporary victory."] }, fx: { smarts: 3, happy: 2, health: 2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_dentist_cavity',
    icon: '🦷',
    cat: 'health',
    cooldown: 3,
    when: { age: [5, 12] },
    scene: { place: 'hospital', mood: 'shock' },
    text: {
      fr: [
        "Chez le dentiste. Il regarde dans ta bouche, fait « hmm » et appelle son assistante. Ce n'est jamais bon signe quand ils appellent l'assistante.",
        "Le dentiste a trouvé [[une|deux|quatre]] caries. Il te demande combien de bonbons tu manges par jour. Tu as le droit de mentir, non ?",
        "La fraise du dentiste fait {w:sound}. Il te dit « tu ne vas rien sentir ». C'est exactement ce qu'on dit avant qu'on sente quelque chose.",
        "Le dentiste veut te poser un appareil dentaire. Tu vas avoir la tête qu'avait {w:celeb} dans ses pires années. Ou à un robot.",
      ],
      en: [
        "At the dentist's. He looks in your mouth, says “hmm” and calls his assistant. It's never a good sign when they call the assistant.",
        "The dentist found [[one cavity|two cavities|four cavities]]. He asks how many candies you eat a day. You're allowed to lie, right?",
        "The dentist's drill sounds like {w:sound}. He says “you won't feel a thing”. That's exactly what they say right before you feel something.",
        "The dentist wants to give you braces. You're going to look like {w:celeb} in their worst years. Or a robot.",
      ],
    },
    choices: [
      {
        label: { fr: 'Mentir sur les bonbons', en: 'Lie about the candy' },
        out: [
          { w: 2, text: { fr: ["J'ai juré que je ne mangeais « presque jamais » de bonbons. Un caramel et {w:object} sont tombés de ma poche au même moment. Le dentiste a juste dit « je vois ».", "J'ai prétendu que je mangeais surtout {w:food}. Le dentiste m'a fait la leçon sur le sucre pendant dix minutes. J'ai hoché la tête avec la bouche pleine de coton."], en: ["I swore I “almost never” eat candy. A toffee and {w:object} fell out of my pocket at that exact moment. The dentist just said, “I see.”", "I claimed I mostly eat {w:food}. The dentist lectured me on sugar for ten minutes. I nodded with my mouth full of cotton."] }, fx: { happy: -1, karma: -1, health: 2 } },
        ],
      },
      {
        label: { fr: 'Serrer les accoudoirs', en: 'Grip the armrests' },
        out: [
          { w: 2, text: { fr: ["J'ai serré les accoudoirs si fort que j'ai laissé des marques. Le soin a duré dix minutes. J'ai eu un ballon en forme de gant. Je suis ressorti{|e} avec la joue paralysée et la gloire.", "J'ai survécu. Ma bouche était tellement anesthésiée que j'ai bavé mon jus d'orange sur mon t-shirt en voulant boire. J'avais l'air d'un hamster en panne."], en: ["I squeezed the armrests so hard I left marks. Ten minutes of drilling. I got a balloon made from a glove. I walked out with a numb cheek and glory.", "I survived. My mouth was so numb that I dribbled orange juice down my shirt trying to drink. I looked like a broken hamster."] }, fx: { health: 4, discipline: 2, happy: -1 } },
          { w: 1, text: { fr: ["J'ai mordu le doigt du dentiste. Pas fort. Juste assez. Il a crié {w:exclaim} et m'a confié à un collègue plus âgé, qui portait des gants épais.", "J'ai paniqué et donné un coup de pied dans le plateau d'instruments. Tout est tombé. Le dentiste a pris une grande inspiration. Sa journée venait de commencer."], en: ["I bit the dentist's finger. Not hard. Just enough. He yelled {w:exclaim} and handed me over to an older colleague wearing thick gloves.", "I panicked and kicked the instrument tray. Everything fell. The dentist took a deep breath. His day had just begun."] }, fx: { health: 2, karma: -2, happy: -2 } },
        ],
      },
      {
        label: { fr: 'Négocier un bonbon après', en: 'Negotiate a treat after' },
        out: [
          { w: 1, text: { fr: ["J'ai exigé un bonbon pour me remettre du soin des caries. Le dentiste m'a regardé{|e} longtemps. Puis il a éclaté de rire. Il m'a donné une brosse à dents. Traître.", "Mes parents ont accepté un « petit quelque chose » après. J'ai choisi {w:food}. La boucle de la vie est bouclée. Rendez-vous dans six mois."], en: ["I demanded candy to recover from my cavity treatment. The dentist stared at me. Then burst out laughing. He gave me a toothbrush. Traitor.", "My parents agreed to “a little something” afterwards. I picked {w:food}. The circle of life is complete. See you in six months."] }, fx: { happy: 3, smarts: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_tree_fall',
    icon: '🌳',
    cat: 'health',
    rating: 1,
    cooldown: 4,
    when: { age: [5, 12] },
    scene: { place: 'park', mood: 'shock' },
    text: {
      fr: [
        "Tu es monté{|e} tout en haut du grand arbre du parc. La vue est splendide. Tu viens de comprendre que tu ne sais pas redescendre.",
        "Défi de la récré : grimper au sommet du marronnier. Tu es à mi-hauteur quand la branche fait {w:sound}.",
        "Tu as grimpé dans l'arbre du voisin pour récupérer {w:object}. La branche sous tes pieds n'a pas l'air d'accord.",
        "Tu te balances, la tête en bas, à une branche de l'arbre du jardin. Ton goûter vient de tomber. Ton sang descend vers ta tête.",
      ],
      en: [
        "You climbed to the very top of the big tree in the park. The view is glorious. You've just realized you don't know how to get down.",
        "Recess dare: climb to the top of the chestnut tree. You're halfway up when the branch makes {w:sound}.",
        "You climbed the neighbor's tree to retrieve {w:object}. The branch under your feet doesn't seem to agree.",
        "You're hanging upside down from a branch of the backyard tree. Your snack just fell. Your blood is rushing to your head.",
      ],
    },
    choices: [
      {
        label: { fr: 'Sauter comme un ninja', en: 'Jump like a ninja' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai sauté et atterri en roulade, comme dans {w:movie}. Les autres enfants sont restés bouche bée. Je n'ai rien. Je suis immortel{|le}.", "Saut parfait, réception approximative. Genoux écorchés, mais dignité intacte. J'ai montré mes croûtes à tout le monde pendant une semaine."], en: ["I jumped and landed in a roll, like in {w:movie}. The other kids stood open-mouthed. Not a scratch. I'm immortal.", "Perfect jump, sketchy landing. Scraped knees but dignity intact. I showed everyone my scabs for a week."] }, fx: { happy: 5, athletic: 3, health: -2 } },
          { w: 1, text: { fr: ["J'ai sauté, raté la réception et atterri sur le nez. J'ai saigné comme une fontaine sur mon t-shirt préféré. Aux urgences, on m'a dit que ce n'était « qu'un saignement de nez ». J'ai été vexé{|e}.", "Atterrissage dans les orties. J'ai passé l'après-midi tout{|e} rouge à me gratter, en criant {w:exclaim} toutes les cinq minutes."], en: ["I jumped, botched the landing and hit my nose. I bled like a fountain all over my favorite T-shirt. At the ER they said it was “just a nosebleed”. I was offended.", "Landed in stinging nettles. I spent the afternoon bright red and scratching, yelling {w:exclaim} every five minutes."] }, fx: { happy: -4, health: -5 } },
        ],
      },
      {
        label: { fr: 'Appeler à l\'aide', en: 'Call for help' },
        out: [
          { w: 2, text: { fr: ["J'ai crié jusqu'à ce qu'un adulte arrive avec une échelle. Il a fallu trente minutes, deux voisins et {w:animal} qui aboyait. Mon père m'a filmé{|e} avant de m'aider. Priorités.", "Les pompiers sont venus. Pour un chat coincé dans le même arbre. Ils m'ont descendu{|e} en bonus. J'ai eu droit à un casque en plastique."], en: ["I screamed until a grown-up came with a ladder. It took thirty minutes, two neighbors and {w:animal} barking. My dad filmed me before helping. Priorities.", "The fire department came. For a cat stuck in the same tree. They brought me down as a bonus. I got a plastic helmet."] }, fx: { happy: 1, looks: -1 } },
        ],
      },
      {
        label: { fr: 'Descendre doucement', en: 'Climb down slowly' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["Je suis descendu{|e} branche par branche, en quarante minutes. Mes jambes tremblaient. Arrivé{|e} en bas, j'ai embrassé le sol comme un astronaute qui revient de mission {w:far_place}.", "Descente prudente, mais la dernière branche a cédé. Je suis tombé{|e} sur les fesses, un mètre plus bas. Les autres ont ri. J'ai ri aussi, en pleurant un peu."], en: ["I climbed down branch by branch, over forty minutes. My legs were shaking. At the bottom I kissed the ground like an astronaut returning from a mission {w:far_place}.", "Careful descent, but the last branch snapped. I fell on my butt, three feet down. The others laughed. I laughed too, crying a little."] }, fx: { athletic: 2, discipline: 2, health: -1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pea_nose',
    icon: '👃',
    cat: 'health',
    rating: 1,
    once: true,
    actor: 'parent',
    when: { age: [3, 7], has: 'parent' },
    scene: { place: 'hospital', mood: 'shock' },
    text: {
      fr: [
        "Par curiosité scientifique, tu t'es enfoncé un petit pois dans la narine. Il ne ressort plus. {a.rel} ne le sait pas encore.",
        "Tu as glissé une perle de collier dans ton nez, « pour voir ». Elle est montée. Très haut. Tu la sens près du cerveau.",
        "Tu as mis un morceau de ton goûter ({w:food}) dans ton oreille pour tester si on entend mieux. On entend moins bien. Et ça ne ressort pas.",
        "Une bille de la taille d'un pois est coincée dans ta narine gauche. Tu respires comme {w:animal} qui aurait un rhume. {a.rel} te regarde bizarrement.",
      ],
      en: [
        "Out of scientific curiosity, you pushed a pea up your nostril. It won't come out. {a.rel} doesn't know yet.",
        "You slid a necklace bead into your nose, “to see”. It went up. Way up. You can feel it near your brain.",
        "You put a bit of your snack ({w:food}) in your ear to test if you'd hear better. You hear worse. And it won't come out.",
        "A pea-sized marble is stuck in your left nostril. You're breathing like {w:animal} with a cold. {a.rel} is looking at you funny.",
      ],
    },
    choices: [
      {
        label: { fr: 'Se moucher très fort', en: 'Blow really hard' },
        out: [
          { w: 2, text: { fr: ["J'ai soufflé de toutes mes forces en bouchant l'autre narine. Le pois a jailli à travers la cuisine et a touché {w:animal}. Victoire. Morve partout, mais victoire.", "J'ai soufflé si fort que j'ai vu des étoiles. Il est sorti, avec une quantité impressionnante de morve verte. {a.my} a dit « bravo » avec une serviette en papier à la main."], en: ["I blew with all my might, holding the other nostril shut. The pea shot across the kitchen and hit {w:animal}. Victory. Snot everywhere, but victory.", "I blew so hard I saw stars. It came out, with an impressive amount of green snot. {a.my} said “well done”, holding a paper towel."] }, fx: { happy: 4, health: 1 } },
          { w: 1, text: { fr: ["J'ai soufflé, mais par le nez dans le mauvais sens. Je l'ai aspiré plus haut. On est partis aux urgences en pyjama, {w:weather}.", "En soufflant, j'ai saigné du nez. Le pois est resté. {a.my} a pâli plus que moi. On a fini aux urgences avec un sac de petits pois surgelés sur le visage. L'ironie."], en: ["I blew, but in the wrong direction. I sucked it up higher. We went to the ER in pajamas, {w:weather}.", "Blowing gave me a nosebleed. The pea stayed put. {a.my} went paler than me. We ended up at the ER with a bag of frozen peas on my face. The irony."] }, fx: { happy: -3, health: -2 } },
        ],
      },
      {
        label: { fr: 'Prévenir {a.rel}', en: 'Tell {a.rel}' },
        out: [
          { w: 2, text: { fr: ["Aux urgences, le médecin a retiré le pois avec une pince en dix secondes. Il l'a mis dans un petit pot pour que je le garde. Il est sur mon étagère, entre deux billes et {w:object}.", "{a.my} a soupiré, pris une pince à épiler et une lampe. Opération réussie sur la table de la cuisine. J'ai eu droit à une conférence sur les trous du corps humain."], en: ["At the ER, the doctor pulled the pea out with tweezers in ten seconds. He put it in a little jar for me to keep. It's on my shelf, between two marbles and {w:object}.", "{a.my} sighed, grabbed tweezers and a flashlight. Successful surgery on the kitchen table. I got a lecture about the holes in the human body."] }, fx: { happy: 2, smarts: 2, rel: 5 } },
        ],
      },
    ],
  },
  {
    id: 'k2_bluff_superpower',
    icon: '⚡',
    cat: 'friends',
    cooldown: 4,
    when: { age: [5, 10], school: [PRE, PRI] },
    scene: { place: 'school', mood: 'proud' },
    text: {
      fr: [
        "À la récré, tu as annoncé que tu avais un super-pouvoir : {w:superpower}. Toute la cour exige une démonstration. Maintenant.",
        "Un camarade affirme que son père peut soulever une voiture. Tu as répondu que toi, tu sais {w:superpower}. Les paris sont ouverts.",
        "Pour impressionner la cour, tu prétends avoir été mordu{|e} par {w:animal} échappé d'une centrale nucléaire. Tu attends qu'on te pose des questions.",
        "Tu as dit à tout le monde que tu pouvais parler aux animaux. Un CE2 vient d'apporter {w:animal} pour vérifier.",
      ],
      en: [
        "At recess you announced you have a superpower: {w:superpower}. The whole playground demands a demonstration. Now.",
        "A classmate says his dad can lift a car. You replied that you can do {w:superpower}. Bets are open.",
        "To impress the playground, you claim you were bitten by {w:animal} that escaped from a nuclear plant. You're waiting for the questions.",
        "You told everyone you can talk to animals. A third-grader just brought {w:animal} to check.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire une démonstration', en: 'Give a demonstration' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai fermé les yeux, murmuré des mots inventés et désigné un nuage. Il a bougé. Toute la cour a crié. Le vent a fait le reste. Je suis un dieu.", "J'ai fait semblant de communiquer avec {w:animal} pendant cinq minutes. Il a fini par partir. J'ai expliqué qu'il était vexé. Tout le monde m'a cru{|e}."], en: ["I closed my eyes, whispered made-up words and pointed at a cloud. It moved. The whole playground screamed. The wind did the rest. I'm a god.", "I pretended to communicate with {w:animal} for five minutes. It eventually wandered off. I explained it was offended. Everyone believed me."] }, fx: { happy: 6, smarts: 1 } },
          { w: 1, text: { fr: ["La démonstration a échoué. Un CM2 m'a surnommé{|e} « {w:nickname} ». Ça m'a suivi{|e} jusqu'au collège.", "J'ai tenté. Rien. J'ai dit que mes pouvoirs ne marchent que {w:weather}. Il faisait exactement ce temps-là. Silence gênant."], en: ["The demonstration failed. A fifth-grader nicknamed me “{w:nickname}”. It followed me all the way to middle school.", "I tried. Nothing. I said my powers only work {w:weather}. The weather was exactly that. Awkward silence."] }, fx: { happy: -4, looks: -1 } },
        ],
      },
      {
        label: { fr: 'Invoquer le secret', en: 'Claim it’s top secret' },
        out: [
          { w: 2, text: { fr: ["J'ai expliqué que si je montrais mon pouvoir, des agents secrets viendraient me chercher. Tout le monde a hoché la tête, impressionné. Personne n'a jamais insisté.", "J'ai dit que mon pouvoir était « en recharge ». Le mot est resté. Toute l'école dit maintenant « en recharge » quand elle ne veut pas faire quelque chose."], en: ["I explained that if I showed my power, secret agents would come for me. Everyone nodded, impressed. Nobody ever pushed.", "I said my power was “recharging”. The word stuck. The whole school now says “recharging” whenever they don't want to do something."] }, fx: { happy: 4, smarts: 2 } },
        ],
      },
      {
        label: { fr: 'Avouer le bluff', en: 'Admit the bluff' },
        out: [
          { w: 1, text: { fr: ["J'ai avoué que j'avais tout inventé. Un silence. Puis un petit a dit : « Moi aussi j'ai un pouvoir : {w:superpower}. » On a fondé une équipe de super-héros sans pouvoirs.", "J'ai dit la vérité. Les autres étaient déçus, mais une fille m'a dit que mentir aussi bien, c'était déjà un super-pouvoir. Elle a raison."], en: ["I admitted I'd made it all up. Silence. Then a little kid said, “I have a power too: {w:superpower}.” We started a superhero team with no powers.", "I told the truth. The others were disappointed, but a girl said lying that well is already a superpower. She's right."] }, fx: { karma: 3, happy: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_bluff_famous_relative',
    icon: '🌟',
    cat: 'friends',
    rating: 1,
    cooldown: 4,
    when: { age: [6, 11] },
    scene: { place: 'school', mood: 'proud' },
    text: {
      fr: [
        "Tu as raconté à la classe que ton oncle est {w:celeb}. Ça a très bien marché. Trop bien. Maintenant, tout le monde veut un autographe.",
        "Pour gagner une dispute, tu as affirmé que ton père est {w:weird_job} et qu'il a « des pouvoirs spéciaux ». La rumeur a fait le tour de l'école.",
        "Tu as prétendu que ta famille possède {w:vehicle} en or et une maison {w:far_place}. Un camarade veut venir dormir chez toi samedi.",
        "Tu as juré que tu passais à la télé dans {w:show}. La maîtresse a demandé à quelle heure, pour regarder.",
      ],
      en: [
        "You told the class your uncle is {w:celeb}. It worked very well. Too well. Now everyone wants an autograph.",
        "To win an argument you claimed your dad is {w:weird_job} and has “special powers”. The rumor went round the whole school.",
        "You claimed your family owns {w:vehicle} made of solid gold and a house {w:far_place}. A classmate wants a sleepover at yours on Saturday.",
        "You swore you were on TV in {w:show}. The teacher asked what time, so she could watch.",
      ],
    },
    choices: [
      {
        label: { fr: 'Fabriquer des preuves', en: 'Fabricate evidence' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai signé moi-même des autographes au feutre doré : « {w:celeb} », en lettres penchées. J'en ai vendu huit. Personne n'a remarqué que les « k » étaient à l'envers.", "J'ai imprimé une photo où l'on voit {w:celeb} et collé ma tête à côté. Le montage était grossier, mais l'enthousiasme de la classe a fait le reste."], en: ["I signed autographs myself in gold marker: “{w:celeb}”, in slanted letters. I sold eight. Nobody noticed the backwards letters.", "I printed a photo of {w:celeb} and glued my face next to it. The edit was crude, but the class's enthusiasm did the rest."] }, fx: { happy: 5, karma: -3, smarts: 2 } },
          { w: 1, text: { fr: ["Un camarade a vérifié sur la tablette de sa sœur. Mon mensonge s'est effondré en trente secondes. On m'appelle « {w:nickname} le menteur » maintenant.", "Ma mère est venue me chercher à la sortie de l'école, en survêtement, avec {w:object}. Tout le monde a vu la vérité. Le rêve est mort."], en: ["A classmate checked on his sister's tablet. My lie collapsed in thirty seconds. They call me “{w:nickname} the liar” now.", "My mom picked me up from school, in sweatpants, holding {w:object}. Everyone saw the truth. The dream is dead."] }, fx: { happy: -5, karma: -1 } },
        ],
      },
      {
        label: { fr: 'Annoncer un drame', en: 'Announce a tragedy' },
        out: [
          { w: 1, text: { fr: ["J'ai annoncé que mon oncle célèbre avait été enlevé par {w:animal} de taille gigantesque et ne pouvait plus signer d'autographes. La classe a fait une minute de silence. Je suis allé{|e} trop loin.", "J'ai dit qu'on avait déménagé de la maison {w:far_place} à cause d'une catastrophe : {w:disaster}. Un camarade a pleuré. Je me sens un peu coupable. Un peu."], en: ["I announced that my famous uncle had been kidnapped by {w:animal} of gigantic size and could no longer sign autographs. The class held a minute's silence. I went too far.", "I said we'd had to leave the house {w:far_place} because of a disaster: {w:disaster}. A classmate cried. I feel a little guilty. A little."] }, fx: { happy: 2, karma: -4 } },
        ],
      },
      {
        label: { fr: 'Tout avouer', en: 'Confess everything' },
        out: [
          { w: 1, text: { fr: ["J'ai avoué que mon oncle était en fait {w:weird_job}. La classe a trouvé ça encore plus cool. Je n'aurais jamais dû mentir. J'aurais dû mentir mieux.", "J'ai tout avoué devant la classe. Ça a été dur. Le lendemain, plus personne n'en parlait, parce que quelqu'un avait vomi à la cantine. La vie continue."], en: ["I confessed my uncle was actually {w:weird_job}. The class thought that was even cooler. I should never have lied. I should have lied better.", "I confessed everything in front of the class. It was hard. The next day nobody cared, because someone threw up in the canteen. Life goes on."] }, fx: { karma: 3, happy: -1 } },
        ],
      },
    ],
  },

  // ═════════════════════════════ PETS, TOYS & SCHEMES ═════════════════════════════
  {
    id: 'k2_pet_escape',
    icon: '🐾',
    cat: 'family',
    cooldown: 3,
    actor: 'pet',
    when: { age: [4, 12], has: 'pet' },
    scene: { place: 'park', mood: 'shock' },
    text: {
      fr: [
        "Tu as laissé la porte ouverte. {a.first}, {a.rel}, a disparu. Dernière direction connue : le bout de la rue. Ou {w:at_place}, selon les témoins.",
        "{a.first} s'est échappé{a:|e} pendant que tu jouais dans le jardin. Les voisins disent avoir vu {a.first} poursuivre {w:animal} dans le parc.",
        "Ça fait deux heures que {a.first} n'est pas rentré{a:|e}. Tu as déjà dessiné un avis de recherche. Sur le dessin, {a.first} ressemble à une pomme de terre.",
        "{a.first} a creusé un trou sous la clôture. Il ne reste qu'une odeur, {w:smell}, et un tunnel vers la liberté.",
      ],
      en: [
        "You left the door open. {a.first}, your {a.species}, is gone. Last seen heading for the end of the street. Or {w:at_place}, according to witnesses.",
        "{a.first} escaped while you were playing in the yard. The neighbors say they saw your {a.species} chasing {w:animal} in the park.",
        "{a.first} hasn't been home for two hours. You've already drawn a missing poster. Your {a.species} looks like a potato in the drawing.",
        "{a.first} dug a hole under the fence. All that's left is a smell, {w:smell}, and a tunnel to freedom.",
      ],
    },
    choices: [
      {
        label: { fr: 'Fouiller le quartier', en: 'Search the neighborhood' },
        out: [
          { w: 3, text: { fr: ["J'ai fouillé chaque buisson en criant « {a.first} ! ». Je l'ai retrouvé{a:|e} chez la voisine, en train de manger {w:food} sur son canapé. Traître, mais vivant.", "J'ai cherché pendant trois heures, {w:weather}. {a.first} m'attendait sur le paillasson à mon retour, l'air de dire « t'étais où ? »."], en: ["I searched every bush yelling “{a.first}!”. I found them at the neighbor's, eating {w:food} on her couch. A traitor, but alive.", "I searched for three hours, {w:weather}. {a.first} was waiting on the doormat when I got back, as if to say “where were you?”."] }, fx: { happy: 5, athletic: 2, rel: 15 } },
          { w: 1, text: { fr: ["{a.first} est rentré{a:|e} tout{a:|e} seul{a:|e} le lendemain, sale, {a:fier|fière}, avec {w:object} dans la gueule. On ne saura jamais ce qui s'est passé.", "Les pompiers ont retrouvé {a.first} sur le toit de l'école. Personne ne sait comment {a.he} est monté{a:|e}. {a.first} est désormais une légende du quartier."], en: ["{a.first} came home alone the next day, filthy and proud, carrying {w:object}. We'll never know what happened.", "The fire department found {a.first} on the school roof. Nobody knows how {a.he} got up there. My {a.species} is a neighborhood legend."] }, fx: { happy: 3, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Faire une affiche', en: 'Make a poster' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai collé quarante affiches dans le quartier avec une récompense à la clé : {w:object}. Un monsieur a ramené {a.first} une heure plus tard. Il voulait vraiment la récompense.", "Mon affiche a fait le tour du quartier. Les gens ont ramené [[trois|cinq|huit]] animaux différents, dont {w:animal}. Aucun n'était {a.first}, qui dormait dans le garage."], en: ["I put up forty posters with a reward of {w:object}. A man brought {a.first} back an hour later. He really wanted the reward.", "My poster went round the neighborhood. People brought back [[three|five|eight]] different animals, including {w:animal}. None were {a.first}, who was asleep in the garage."] }, fx: { happy: 4, smarts: 2, rel: 10 } },
        ],
      },
      {
        label: { fr: 'Ne rien dire aux parents', en: "Don't tell your parents" },
        out: [
          { w: 1, text: { fr: ["J'ai fait comme si de rien n'était. Au dîner, mon père a demandé où était {a.first}. J'ai dit « dans ma chambre ». {a.first} a gratté à la porte d'entrée à ce moment-là. Sauvé{|e} par le timing.", "Je n'ai rien dit et j'ai passé la nuit à culpabiliser. Au matin, {a.first} dormait au pied de mon lit, comme si de rien n'était. Le meilleur réveil de ma vie."], en: ["I acted like nothing happened. At dinner, Dad asked where {a.first} was. I said “in my room”. {a.first} scratched at the front door right then. Saved by timing.", "I said nothing and spent the night feeling guilty. In the morning {a.first} was asleep at the foot of my bed as if nothing had happened. Best wake-up ever."] }, fx: { happy: 2, karma: -1, rel: 5 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pet_costume',
    icon: '🎀',
    cat: 'family',
    cooldown: 3,
    actor: 'pet',
    when: { age: [3, 10], has: 'pet' },
    scene: { place: 'home', mood: 'happy' },
    text: {
      fr: [
        "Tu as décidé de déguiser {a.first}, {a.rel}, en {w:weird_job}. Tu as un tutu, des lunettes de soleil et un chapeau. {a.first} n'a rien signé.",
        "Tu veux faire de {a.first} une star. Il y a une séance photo prévue dans ton salon, avec {w:object} comme accessoire.",
        "C'est le mariage de tes doudous et {a.first} sera {a:le témoin|la témoin}. Il faut lui mettre un nœud papillon. {a.first} te fixe sans ciller.",
        "Tu as habillé {a.first} avec le vieux pull de ton père. On dirait {w:celeb}, en plus poilu. Tu veux montrer ça à toute la famille.",
      ],
      en: [
        "You've decided to dress up {a.first}, your {a.species}, as {w:weird_job}. You have a tutu, sunglasses and a hat. {a.first} never agreed to this.",
        "You want to make {a.first} a star. There's a photo shoot scheduled in your living room, with {w:object} as a prop.",
        "It's your stuffed animals' wedding and {a.first} is the best man. They need a bow tie. {a.first} stares at you without blinking.",
        "You dressed {a.first} in your dad's old sweater. Your {a.species} looks like {w:celeb}. You want to show the whole family.",
      ],
    },
    choices: [
      {
        label: { fr: 'Séance photo complète', en: 'Full photo shoot' },
        out: [
          { w: 2, text: { fr: ["Séance photo réussie : {a.first} en tutu, l'air résigné. Ma mère a posté la photo sur {w:app}. Elle a eu plus de « j'aime » que toutes les photos de famille réunies.", "J'ai pris [[cinquante|cent|trois cents]] photos de {a.first} déguisé{a:|e}. Il y en a une bonne. Elle est encadrée dans le salon, à côté du portrait des grands-parents."], en: ["Successful photo shoot: {a.first} in a tutu, looking resigned. Mom posted it on {w:app}. It got more likes than every family photo combined.", "I took [[fifty|a hundred|three hundred]] photos of {a.first} in costume. One is good. It's framed in the living room, next to the grandparents' portrait."] }, fx: { happy: 6, rel: 5 } },
          { w: 1, text: { fr: ["{a.first} s'est enfui{a:|e} avec le tutu et l'a déchiqueté dans le jardin. Il en reste des lambeaux roses dans la haie et sur {w:object}. C'était un message.", "{a.first} a mordillé le chapeau, puis mon doigt. Pas méchamment. Juste pour clarifier sa position sur la mode."], en: ["{a.first} ran off with the tutu and shredded it in the yard. There are pink scraps in the hedge and on {w:object}. It was a message.", "{a.first} nibbled the hat, then my finger. Not meanly. Just to clarify their stance on fashion."] }, fx: { happy: -1, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Le laisser tranquille', en: 'Leave them alone' },
        out: [
          { w: 1, text: { fr: ["J'ai rangé le déguisement. {a.first} est venu{a:|e} se coucher sur mes genoux. Je crois qu'{a.he} m'a dit merci. Ou {a.he} avait juste froid.", "J'ai laissé {a.first} tranquille et je me suis déguisé{|e} à sa place, en {w:animal}. On s'est regardés longuement. Je crois qu'{a.he} a eu pitié de moi."], en: ["I put the costume away. {a.first} came and curled up on my lap. I think {a.he} said thank you. Or was just cold.", "I left {a.first} alone and dressed up myself instead, as {w:animal}. We looked at each other for a long time. I think {a.he} pitied me."] }, fx: { happy: 2, karma: 2, rel: 10 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pet_rock',
    icon: '🪨',
    cat: 'weird',
    once: true,
    when: { age: [4, 9] },
    scene: { place: 'park', mood: 'love' },
    text: {
      fr: [
        "Tes parents refusent catégoriquement d'avoir un animal. Dans le parc, tu trouves un caillou. Il a une tête sympathique. Il s'appelle déjà [[Roger|Bernadette|Caillou]].",
        "Tu as trouvé le caillou parfait : lisse, gris, avec une tache qui évoque {w:animal}. Tu sens qu'il a besoin de toi.",
        "Faute de chien, tu adoptes un caillou. Tu lui as peint des yeux, fabriqué un panier avec une boîte à chaussures et acheté {w:object} comme jouet.",
        "Ton caillou de compagnie a besoin d'un nom, d'un lit et d'une promenade quotidienne. Tes parents te regardent avec une inquiétude grandissante.",
      ],
      en: [
        "Your parents flatly refuse to get a pet. In the park you find a rock. It has a friendly face. Its name is already [[Roger|Bernadette|Rocky]].",
        "You found the perfect rock: smooth, gray, with a spot shaped like {w:animal}. You feel it needs you.",
        "No dog, so you adopt a rock. You painted eyes on it, made a bed out of a shoebox and got it {w:object} as a toy.",
        "Your pet rock needs a name, a bed and a daily walk. Your parents watch with growing concern.",
      ],
    },
    choices: [
      {
        label: { fr: 'L\'adopter officiellement', en: 'Adopt it officially' },
        out: [
          { w: 3, text: { fr: ["J'ai rempli un certificat d'adoption au feutre. Mon caillou dort sur ma table de nuit. Je le promène en laisse le dimanche, {w:weather}. Les voisins ne disent plus bonjour.", "J'ai adopté le caillou. Il ne mange rien, ne fait pas de bruit et ne mord pas. C'est le meilleur animal du monde. Mes parents sont soulagés et un peu inquiets."], en: ["I filled out an adoption certificate in marker. My rock sleeps on my nightstand. I walk it on a leash on Sundays, {w:weather}. The neighbors stopped saying hello.", "I adopted the rock. It doesn't eat, doesn't make noise and doesn't bite. Best pet in the world. My parents are relieved and a little worried."] }, fx: { happy: 6, flag: 'k2_pet_rock', schedule: { key: 'k2_pet_rock_crisis', years: 2 } } },
        ],
      },
      {
        label: { fr: 'L\'utiliser comme argument', en: 'Use it as leverage' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai promené le caillou en laisse devant mes parents pendant deux semaines. Ils ont craqué : « D'accord, on prendra un poisson. » La stratégie paie.", "J'ai expliqué à mes parents que si je n'avais pas d'animal, je finirais par adopter {w:animal} sauvage. Ils ont accepté un hamster. Négociation réussie."], en: ["I walked the rock on a leash in front of my parents for two weeks. They cracked: “Fine, we'll get a fish.” The strategy paid off.", "I explained that without a pet I'd end up adopting {w:animal} from the wild. They agreed to a hamster. Successful negotiation."] }, fx: { happy: 5, smarts: 2, newNpc: { role: 'pet', species: 'hamster' } } },
          { w: 1, text: { fr: ["Mes parents ont compris la manœuvre et m'ont offert un deuxième caillou. « Comme ça il ne sera pas seul. » Ils sont plus forts que moi.", "Mes parents ont trouvé ça adorable et ont dit : « Tu vois, pas besoin de vrai animal ! » Mon plan s'est retourné contre moi."], en: ["My parents saw through it and gave me a second rock. “So it won't be lonely.” They're better at this than me.", "My parents found it adorable and said, “See, you don't need a real pet!” My plan backfired."] }, fx: { happy: -2, smarts: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_pet_rock_crisis',
    icon: '🪦',
    cat: 'weird',
    chainOnly: true,
    when: { age: [6, 12], flag: 'k2_pet_rock' },
    scene: { place: 'home', mood: 'cry' },
    text: {
      fr: [
        "Drame : ton caillou de compagnie a disparu. Ton père a refait l'allée du jardin ce week-end avec du gravier. Tu as une terrible intuition.",
        "Ton caillou a été jeté par erreur pendant le grand ménage de printemps, avec {w:object}. Tu es inconsolable.",
        "Ton petit cousin a lancé ton caillou de compagnie dans la rivière, « pour voir s'il nage ». Il ne nage pas.",
        "Ça fait deux ans que tu as ton caillou. Tu as grandi. Lui, non. Tu te demandes s'il est temps de le rendre à la nature, {w:at_place} par exemple.",
      ],
      en: [
        "Tragedy: your pet rock is missing. Your dad redid the garden path with gravel this weekend. You have a terrible hunch.",
        "Your rock was thrown out by mistake during spring cleaning, along with {w:object}. You're inconsolable.",
        "Your little cousin threw your pet rock in the river “to see if it swims”. It doesn't.",
        "You've had your rock for two years. You've grown. It hasn't. You wonder if it's time to release it back into the wild, {w:at_place} for example.",
      ],
    },
    choices: [
      {
        label: { fr: 'Organiser des funérailles', en: 'Hold a funeral' },
        out: [
          { w: 2, text: { fr: ["J'ai organisé une cérémonie dans le jardin. Mes parents sont venus, en noir. Mon père a lu un poème, puis chanté {w:song}. Il avait l'air vraiment désolé, et un peu coupable.", "Funérailles émouvantes : un caillou de remplacement a été enterré à la place, avec {w:object}. J'ai fait un discours. Le chat du voisin a assisté à toute la cérémonie."], en: ["I held a ceremony in the yard. My parents came, wearing black. Dad read a poem, then sang {w:song}. He seemed truly sorry, and a little guilty.", "Moving funeral: a substitute rock was buried in its place, along with {w:object}. I gave a eulogy. The neighbor's cat attended the whole thing."] }, fx: { happy: -2, karma: 2, unflag: 'k2_pet_rock' } },
        ],
      },
      {
        label: { fr: 'Fouiller le gravier', en: 'Search the gravel' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai trié huit cents cailloux un par un. Je l'ai retrouvé, grâce à ses yeux peints. Mon père m'a aidé{|e} toute la journée, en silence. On n'en parle jamais.", "J'ai trouvé un caillou qui lui ressemblait vaguement. Je l'ai appelé pareil. Je sais que ce n'est pas lui. Il le sait aussi. On fait semblant."], en: ["I sorted eight hundred stones one by one. I found it thanks to its painted eyes. Dad helped me all day, silently. We never talk about it.", "I found a stone that sort of looked like it. I gave it the same name. I know it isn't him. He knows too. We pretend."] }, fx: { happy: 3, discipline: 3, unflag: 'k2_pet_rock' } },
        ],
      },
      {
        label: { fr: 'Passer à autre chose', en: 'Move on' },
        out: [
          { w: 1, text: { fr: ["J'ai haussé les épaules. C'était un caillou. J'ai grandi. Puis j'ai pleuré dans ma chambre en écoutant {w:song}. On ne grandit pas si vite.", "J'ai déposé un dernier caillou {w:at_place}, en souvenir. Je ne suis plus un enfant. Enfin, un peu moins."], en: ["I shrugged. It was a rock. I've grown up. Then I cried in my room listening to {w:song}. You don't grow up that fast.", "I left one last stone {w:at_place}, as a memorial. I'm not a kid anymore. Well, a bit less."] }, fx: { happy: -1, smarts: 2, unflag: 'k2_pet_rock' } },
        ],
      },
    ],
  },
  {
    id: 'k2_toy_ad',
    icon: '🧸',
    cat: 'hobby',
    cooldown: 3,
    actor: 'parent',
    when: { age: [4, 10], has: 'parent' },
    scene: { place: 'home', mood: 'love', prop: 'tv' },
    text: {
      fr: [
        "Une pub à la télé montre le jouet ultime : un robot qui crache de la fumée, parle trois langues et transforme {w:object} en {w:food}. Tu dois l'avoir.",
        "Le catalogue de jouets est arrivé. Tu as entouré [[47|112|208]] articles au feutre. {a.rel} feuillette le catalogue en pâlissant.",
        "Tout le monde à l'école a le nouveau jouet à la mode. Sauf toi. Tu es la dernière personne sur Terre à ne pas l'avoir, et {a.rel} s'en fiche.",
        "Au supermarché, tu tombes nez à nez avec le jouet de tes rêves, en tête de gondole, coincé entre les biscuits et {w:object}. {a.rel} pousse le chariot plus vite.",
      ],
      en: [
        "A TV ad shows the ultimate toy: a robot that blows smoke, speaks three languages and turns {w:object} into {w:food}. You must have it.",
        "The toy catalog arrived. You circled [[47|112|208]] items in marker. {a.rel} flips through it, turning pale.",
        "Everyone at school has the trendy new toy. Except you. You're the last person on Earth without one, and {a.rel} doesn't care.",
        "At the supermarket you come face to face with your dream toy, on an end-cap display, wedged between the cookies and {w:object}. {a.rel} pushes the cart faster.",
      ],
    },
    choices: [
      {
        label: { fr: 'Pleurer en public', en: 'Cry in public' },
        rating: 1,
        out: [
          { w: 2, text: { fr: ["J'ai fait une crise au rayon jouets, allongé{|e} par terre. Une dame a dit « de mon temps, on aurait pris une claque ». {a.my} m'a traîné{|e} jusqu'à la caisse sans le jouet. Défaite.", "J'ai pleuré si fort que {a.my} a acheté le jouet pour avoir la paix. Il était cassé au bout de deux jours, écrasé par {w:object}. Mais j'ai gagné la bataille."], en: ["I threw a tantrum in the toy aisle, flat on the floor. A lady said “in my day you'd get a slap”. {a.my} dragged me to the checkout without the toy. Defeat.", "I cried so hard {a.my} bought the toy for some peace. It broke after two days, crushed by {w:object}. But I won the battle."] }, fx: { happy: 2, discipline: -3, rel: -10 } },
        ],
      },
      {
        label: { fr: 'Écrire une lettre argumentée', en: 'Write a persuasive letter' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai écrit une lettre de trois pages avec des arguments : « ça développe l'intelligence », « tous les autres l'ont », « je vais mourir sinon ». {a.my} a cédé pour mon anniversaire.", "J'ai fait un exposé avec des dessins pour expliquer pourquoi j'avais besoin du jouet. {a.my} a été tellement impressionné{a:|e} qu'{a.he} a dit oui. Puis non. Puis « on verra »."], en: ["I wrote a three-page letter with arguments: “it develops intelligence”, “everyone else has it”, “I'll die otherwise”. {a.my} caved for my birthday.", "I gave a presentation with drawings explaining why I needed the toy. {a.my} was so impressed {a.he} said yes. Then no. Then “we'll see”."] }, fx: { happy: 4, smarts: 3 } },
        ],
      },
      {
        label: { fr: 'Fabriquer le tien', en: 'Build your own' },
        out: [
          { w: 1, text: { fr: ["J'ai fabriqué mon propre robot avec du carton, {w:object} et un rouleau de papier toilette. Il ne parle aucune langue. Je l'aime plus que tout.", "J'ai construit une copie du jouet avec des boîtes de céréales. À l'école, on s'est moqués de moi, puis tout le monde a voulu le même. J'ai lancé une mode."], en: ["I built my own robot out of cardboard, {w:object} and a toilet-paper roll. It speaks no languages. I love it more than anything.", "I built a copy of the toy out of cereal boxes. At school they laughed, then everyone wanted one. I started a trend."] }, fx: { happy: 4, smarts: 3, karma: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_first_console',
    icon: '🎮',
    cat: 'hobby',
    once: true,
    actor: 'parent',
    when: { age: [6, 12], has: 'parent' },
    scene: { place: 'home', mood: 'happy', prop: 'tv' },
    text: {
      fr: [
        "Tu as reçu ta première console de jeux ! {a.rel} a fixé une règle : une heure par jour. Il est 23 h et tu en es à ta septième heure.",
        "Tu es bloqué{|e} au niveau 8 de ton jeu vidéo depuis trois jours. Le boss final, c'est {w:animal} en armure. {a.rel} veut que tu viennes manger.",
        "{a.rel} a voulu essayer ta console. Ça fait deux heures qu'{a.he} joue, et {a.he} ne veut plus te la rendre.",
        "Un copain t'a parlé d'un code secret pour avoir des vies infinies. Il faut appuyer sur [[douze|vingt|quarante]] boutons dans le bon ordre, {w:weather}.",
      ],
      en: [
        "You got your first video game console! {a.rel} set a rule: one hour a day. It's 11 p.m. and you're on hour seven.",
        "You've been stuck on level 8 for three days. The final boss looks like {w:animal} in armor. {a.rel} wants you to come eat.",
        "{a.rel} wanted to try your console. They've been playing for two hours and won't give it back.",
        "A friend told you about a secret code for infinite lives. You have to press [[twelve|twenty|forty]] buttons in the right order, {w:weather}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Jouer toute la nuit', en: 'Play all night' },
        out: [
          { w: 2, text: { fr: ["J'ai joué jusqu'à 3 h du matin sous la couette, le son coupé. J'ai battu le boss. J'ai dormi pendant le contrôle de maths. Aucun regret, juste un 4/20.", "J'ai fini le jeu en une nuit. Le lendemain, j'avais les yeux explosés et je me suis brossé les dents avec {w:object}. La maîtresse m'a demandé si tout allait bien à la maison."], en: ["I played until 3 a.m. under the covers, sound off. I beat the boss. I slept through the math test. No regrets, just a D.", "I finished the game in one night. The next day my eyes were fried and I brushed my teeth with {w:object}. The teacher asked if everything was okay at home."] }, fx: { happy: 6, health: -3, grade: -3 } },
          { w: 1, text: { fr: ["{a.my} m'a surpris{|e} à 2 h du matin. La console a été confisquée et cachée. Je l'ai retrouvée dans le congélateur, derrière {w:food}. La guerre continue.", "Mon père est entré dans la chambre, a vu l'écran, s'est assis… et a joué avec moi jusqu'à l'aube. Ma mère nous a trouvés endormis sur la manette."], en: ["{a.my} caught me at 2 a.m. The console was confiscated and hidden. I found it in the freezer behind {w:food}. The war goes on.", "My dad came in, saw the screen, sat down… and played with me until dawn. Mom found us both asleep on the controller."] }, fx: { happy: 2, discipline: -2 } },
        ],
      },
      {
        label: { fr: 'Respecter la règle', en: 'Follow the rule' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai respecté l'heure par jour. Il m'a fallu six mois pour finir le jeu. J'ai savouré chaque minute. {a.my} m'a offert un deuxième jeu pour me récompenser.", "J'ai joué une heure, puis j'ai éteint. {a.my} m'a regardé{|e} comme si j'étais possédé{|e}. J'ai profité de l'effet pour demander {w:gift}."], en: ["I stuck to an hour a day. It took me six months to finish the game. I savored every minute. {a.my} bought me a second game as a reward.", "I played for an hour, then turned it off. {a.my} looked at me like I was possessed. I used the moment to ask for {w:gift}."] }, fx: { happy: 3, discipline: 4, rel: 10 } },
        ],
      },
      {
        label: { fr: 'Jouer avec {a.rel}', en: 'Play with {a.rel}' },
        out: [
          { w: 2, text: { fr: ["J'ai appris à jouer à {a.my}. {a:Il|Elle} est nul{a:|le}. Vraiment nul{a:|le}. {a:Il|Elle} crie {w:exclaim} à chaque fois qu'{a.he} perd. C'est le meilleur moment de la semaine.", "On a fait une partie en duo. {a.my} a gagné, puis a fait une danse de la victoire sur {w:song}. J'ai découvert qu'on peut avoir honte de ses parents dès {age} ans."], en: ["I taught {a.my} to play. They're terrible. Truly terrible. They yell {w:exclaim} every time they lose. Best part of the week.", "We played co-op. {a.my} won, then did a victory dance to {w:song}. I discovered you can be embarrassed by your parents at {age}."] }, fx: { happy: 5, rel: 15 } },
        ],
      },
    ],
  },
  {
    id: 'k2_kid_business',
    icon: '💰',
    cat: 'money',
    once: true,
    when: { age: [6, 11] },
    scene: { place: 'park', mood: 'proud', fx: 'money' },
    text: {
      fr: [
        "Tu as décidé de devenir riche. Ton idée : vendre des cailloux peints devant la maison. Tu as [[vingt|cinquante|cent]] cailloux et une pancarte « ART ».",
        "Tu lances ton entreprise : lavage de vélos à domicile. Tu as un seau, une éponge et un slogan inspiré par {w:celeb}.",
        "Ton nouveau business : vendre tes dessins aux voisins. Ton chef-d'œuvre représente {w:animal} sur {w:vehicle}. Prix : négociable.",
        "Tu as ouvert un « musée » dans ton garage. Les pièces exposées : {w:object}, {w:object} et une dent de lait. L'entrée coûte 50 centimes.",
      ],
      en: [
        "You've decided to get rich. Your idea: sell painted rocks in front of the house. You have [[twenty|fifty|a hundred]] rocks and a sign that says “ART”.",
        "You're launching a business: door-to-door bike washing. You have a bucket, a sponge and a slogan inspired by {w:celeb}.",
        "Your new business: selling your drawings to the neighbors. Your masterpiece depicts {w:animal} riding {w:vehicle}. Price: negotiable.",
        "You've opened a “museum” in your garage. On display: {w:object}, {w:object} and a baby tooth. Admission is 50 cents.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire du porte-à-porte', en: 'Go door to door' },
        out: [
          { w: 2, odds: { smarts: 1, looks: 1 }, text: { fr: ["J'ai sonné à toutes les portes de la rue. Les grands-mères ont tout acheté, par pitié ou par amour. J'ai gagné {$amount}. Je suis le Jeff Bezos du quartier.", "J'ai vendu mes œuvres à huit voisins. L'un d'eux a mis mon dessin (on y voit {w:animal}) dans son salon. Je suis exposé{|e}. J'ai empoché {$amount}."], en: ["I rang every doorbell on the street. The grandmas bought everything, out of pity or love. I made {$amount}. I'm the Jeff Bezos of the block.", "I sold my work to eight neighbors. One put my drawing of {w:animal} in his living room. I'm exhibited. I pocketed {$amount}."] }, fx: { happy: 6, smarts: 2, money: 'amount', flag: 'k2_kid_ceo' } },
          { w: 1, text: { fr: ["Personne n'a ouvert, sauf un monsieur en peignoir qui m'a dit « non merci » avec une grande fatigue. J'ai vendu un caillou à ma mère. Chiffre d'affaires : 20 centimes.", "{w:animal} m'a coursé{|e} sur trois maisons. J'ai perdu mon stock dans la fuite. Le business est un monde cruel."], en: ["Nobody answered except a man in a bathrobe who said “no thanks” with deep fatigue. I sold one rock to my mom. Revenue: 20 cents.", "{w:animal} chased me for three houses. I lost my stock in the escape. Business is a cruel world."] }, fx: { happy: -3, athletic: 1 } },
        ],
      },
      {
        label: { fr: 'Engager tes copains', en: 'Hire your friends' },
        out: [
          { w: 2, text: { fr: ["J'ai embauché trois copains payés en bonbons. Ils ont fait tout le travail. J'ai gardé l'argent. J'ai {age} ans et j'ai compris le capitalisme. Bénéfice : {$amount}.", "Mon équipe a fait grève au bout d'une heure pour réclamer {w:food}. J'ai cédé. On a quand même gagné {$amount}. Mes salariés m'adorent."], en: ["I hired three friends, paid in candy. They did all the work. I kept the money. I'm {age} and I understand capitalism. Profit: {$amount}.", "My team went on strike after an hour, demanding {w:food}. I gave in. We still made {$amount}. My employees love me."] }, fx: { happy: 5, karma: -1, money: 'amount', flag: 'k2_kid_ceo' } },
        ],
      },
      {
        label: { fr: 'Tout donner à une asso', en: 'Give it all to charity' },
        out: [
          { w: 1, text: { fr: ["J'ai annoncé que les bénéfices iraient aux animaux abandonnés. Les voisins ont triplé leurs dons. J'ai donné l'argent au refuge. La dame a pleuré. Moi aussi.", "J'ai vendu mes dessins « pour les pandas ». J'ai récolté une belle somme et je l'ai vraiment donnée. Je me suis senti{|e} plus riche qu'avec l'argent."], en: ["I announced the profits would go to abandoned animals. The neighbors tripled their donations. I gave the money to the shelter. The lady cried. So did I.", "I sold my drawings “for the pandas”. I raised a nice sum and actually donated it. I felt richer than if I'd kept it."] }, fx: { happy: 4, karma: 6 } },
        ],
      },
    ],
    vars: { amount: [5, 40] },
  },
  {
    id: 'k2_kid_business_rival',
    icon: '📉',
    cat: 'money',
    rating: 1,
    once: true,
    weight: 6,
    actor: { create: { role: 'acquaintance', age: [-1, 1], gender: 'any' } },
    when: { age: [7, 12], flag: 'k2_kid_ceo' },
    scene: { place: 'park', mood: 'angry' },
    text: {
      fr: [
        "Catastrophe : {a.first}, {a:le gamin|la gamine} d'en face, a ouvert un business concurrent juste devant chez toi. {a:Il|Elle} casse les prix et offre {w:food} avec chaque achat.",
        "{a.first} a copié ton idée de business, mot pour mot, et a même volé ta pancarte. Pire : son stand a plus de clients.",
        "Une guerre commerciale éclate dans ta rue. {a.first} distribue des prospectus qui disent que tes produits « sentent {w:smell} ».",
        "{a.first} vient de te proposer une fusion de vos entreprises. En échange, {a:il|elle} veut 70 % des bénéfices et {w:object}.",
      ],
      en: [
        "Disaster: {a.first}, the kid across the street, opened a rival business right in front of your house. They're slashing prices and giving away {w:food} with every purchase.",
        "{a.first} copied your business idea word for word and even stole your sign. Worse: their stand has more customers.",
        "A trade war breaks out on your street. {a.first} is handing out flyers saying your products smell like {w:smell}.",
        "{a.first} just proposed merging your businesses. In exchange, they want 70% of the profits and {w:object}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Guerre des prix', en: 'Price war' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai baissé mes prix, puis offert {w:gift} à chaque client. {a.first} a fait faillite en deux jours. Je suis impitoyable. Je suis aussi ruiné{|e}.", "Guerre des prix acharnée. À la fin, on vendait tous les deux à zéro centime. Les clients étaient ravis. Nous, moins."], en: ["I cut my prices, then gave every customer {w:gift}. {a.first} went bankrupt in two days. I'm ruthless. I'm also broke.", "Fierce price war. By the end we were both selling for zero cents. The customers were thrilled. We were less so."] }, fx: { happy: 2, smarts: 2, rel: -15 } },
        ],
      },
      {
        label: { fr: 'Saboter le stand', en: 'Sabotage their stand' },
        out: [
          { w: 2, text: { fr: ["J'ai lâché le chien du voisin près du stand de {a.first}. Chaos total. J'ai été démasqué{|e} en dix minutes, parce que j'étais le seul enfant à rire. Punition maximale.", "J'ai mis du sel dans la limonade de {a.first}. Un client a recraché sur son t-shirt. Sa mère est venue sonner chez moi. Ma carrière d'espion{|ne} industriel{|le} est terminée."], en: ["I let the neighbor's dog loose near {a.first}'s stand. Total chaos. I was caught within ten minutes because I was the only kid laughing. Maximum punishment.", "I put salt in {a.first}'s lemonade. A customer spat it all over his shirt. His mom rang my doorbell. My career in industrial espionage is over."] }, fx: { happy: 1, karma: -4, discipline: -2, rel: -10 } },
        ],
      },
      {
        label: { fr: 'Accepter la fusion', en: 'Accept the merger' },
        out: [
          { w: 2, text: { fr: ["On a fusionné. {a.first} gère le marketing, moi la production. On a gagné le triple. On est devenus amis. Les adultes appellent ça une « synergie ».", "On a fusionné, mais {a.first} a gardé l'argent et m'a laissé{|e} la dette de bonbons. J'ai appris ce qu'est un mauvais associé avant de savoir faire une division."], en: ["We merged. {a.first} handles marketing, I handle production. We tripled our income. We became friends. Grown-ups call it “synergy”.", "We merged, but {a.first} kept the money and left me with the candy debt. I learned what a bad partner is before I could do long division."] }, fx: { happy: 4, smarts: 2, rel: 20, keep: true } },
        ],
      },
    ],
  },
  {
    id: 'k2_prank_salt',
    icon: '🧂',
    cat: 'family',
    rating: 1,
    cooldown: 3,
    actor: 'parent',
    when: { age: [6, 12], has: 'parent' },
    scene: { place: 'home', mood: 'happy' },
    text: {
      fr: [
        "C'est le 1er avril. Tu as échangé le sucre et le sel. {a.rel} se prépare un café en sifflotant. Ton cœur bat très fort.",
        "Tu as acheté un coussin péteur. {a.rel} va s'asseoir sur le canapé dans dix secondes. Le coussin est en place.",
        "Tu as collé un post-it « {w:insult} » sous la souris de l'ordinateur de {a.rel}. {a:Il|Elle} arrive pour travailler.",
        "Tu as caché {w:object} dans la chaussure de {a.rel}. {a:Il|Elle} est en retard pour le travail et enfile ses chaussures à toute vitesse.",
      ],
      en: [
        "It's April Fools' Day. You swapped the sugar and salt. {a.rel} is making coffee and whistling. Your heart is pounding.",
        "You bought a whoopee cushion. {a.rel} will sit on the couch in ten seconds. The cushion is in position.",
        "You taped a post-it saying “{w:insult}” under {a.rel}'s computer mouse. {a:He|She} is coming to work.",
        "You hid {w:object} in {a.rel}'s shoe. They're late for work and pulling on their shoes at top speed.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rester pour voir', en: 'Stay and watch' },
        out: [
          { w: 2, text: { fr: ["{a.my} a recraché son café sur la nappe en criant {w:exclaim} J'ai ri si fort que je suis tombé{|e} de ma chaise. {a:Il|Elle} a fini par rire aussi. Après avoir crié.", "Le coussin a fait {w:sound}. {a.my} a sursauté, puis a regardé le chien avec suspicion. J'ai éclaté de rire. Démasqué{|e}, mais {glorieux|glorieuse}."], en: ["{a.my} spat coffee all over the tablecloth yelling {w:exclaim} I laughed so hard I fell off my chair. They ended up laughing too. After yelling.", "The cushion made {w:sound}. {a.my} jumped, then glared suspiciously at the dog. I burst out laughing. Busted, but glorious."] }, fx: { happy: 6, rel: -5 } },
          { w: 1, text: { fr: ["{a.my} n'a pas ri. Pas du tout. Il paraît que c'était « un très mauvais jour ». J'ai été privé{|e} de dessert. La comédie est un métier à risque.", "{a.my} a gardé son calme, puis s'est vengé{a:|e} le lendemain : du piment dans {w:food}. La guerre des farces est déclarée."], en: ["{a.my} didn't laugh. At all. Apparently it was “a very bad day”. No dessert for me. Comedy is a dangerous profession.", "{a.my} stayed calm, then got revenge the next day: chili in {w:food}. The prank war is on."] }, fx: { happy: -3, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Annuler la farce', en: 'Call off the prank' },
        out: [
          { w: 1, text: { fr: ["Pris{|e} de remords, j'ai tout remis en place à la dernière seconde. {a.my} ne saura jamais. Moi, je saurai que j'ai été un{|e} bon{|ne} enfant. Pendant cinq minutes.", "J'ai retiré le piège juste à temps. Puis {a.my} s'est assis{a:|e} sur {w:object}. C'était drôle quand même. Le destin fait les farces à ma place."], en: ["Overcome by remorse, I put everything back at the last second. {a.my} will never know. I'll know I was a good kid. For five minutes.", "I removed the trap just in time. Then {a.my} sat on {w:object}. Still funny. Fate pranks for me."] }, fx: { happy: 1, karma: 2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_prank_call',
    icon: '☎️',
    cat: 'friends',
    rating: 1,
    cooldown: 4,
    actor: 'anyFriend',
    when: { age: [7, 12], has: 'anyFriend' },
    scene: { place: 'home', mood: 'happy', prop: 'phone' },
    text: {
      fr: [
        "{a.first} et toi êtes seuls avec le téléphone fixe. {a.first} propose d'appeler des numéros au hasard pour demander : « Allô, vous avez du thon ? »",
        "{a.first} a trouvé le numéro de la boulangerie. Le plan : commander [[cinquante|deux cents|mille]] croissants au nom du maître.",
        "Soirée canular téléphonique avec {a.first}. Tu prends une grosse voix pour te faire passer pour {w:weird_job}. Tu as le combiné en main.",
        "{a.first} veut appeler la radio locale en direct pour dédicacer {w:song} « pour {w:animal} et tous ses amis ». Tu as le numéro.",
      ],
      en: [
        "You and {a.first} are alone with the landline. {a.first} suggests calling random numbers to ask, “Is your refrigerator running?”",
        "{a.first} found the bakery's number. The plan: order [[fifty|two hundred|a thousand]] croissants in the teacher's name.",
        "Prank call night with {a.first}. You put on a deep voice to pass as {w:weird_job}. You've got the receiver.",
        "{a.first} wants to call the local radio live to dedicate {w:song} “for {w:animal} and all its friends”. You have the number.",
      ],
    },
    choices: [
      {
        label: { fr: 'Appeler', en: 'Make the call' },
        out: [
          { w: 2, text: { fr: ["J'ai appelé un numéro au hasard. Un monsieur a répondu « oui, j'ai du thon ». Pris de court, on a raccroché en hurlant de rire. On en parle encore.", "J'ai tenu le rôle pendant cinq minutes, {w:weird_job} à la grosse voix. La dame au bout du fil m'a cru{|e}. Elle m'a même demandé conseil. Je lui ai répondu n'importe quoi."], en: ["I called a random number. A man answered “yes, it's running”. Caught off guard, we hung up screaming with laughter. We still talk about it.", "I played {w:weird_job} for five minutes, deep voice and all. The lady on the line believed me. She even asked for advice. I told her nonsense."] }, fx: { happy: 6, rel: 10, karma: -1 } },
          { w: 1, text: { fr: ["Le numéro affiché a permis au monsieur de rappeler. Ma mère a décroché. Elle a écouté, longuement. Puis elle m'a regardé{|e}. J'ai vu ma vie défiler.", "Je suis tombé{|e} sur le répondeur de mon propre maître. J'ai paniqué et laissé un message avec ma vraie voix : « … pardon. » Il m'a reconnu{|e} lundi matin."], en: ["Caller ID let the man call back. My mom picked up. She listened for a long time. Then looked at me. My life flashed before my eyes.", "I got my own teacher's voicemail. I panicked and left a message in my real voice: “… sorry.” He recognized me on Monday morning."] }, fx: { happy: -4, discipline: 2 } },
        ],
      },
      {
        label: { fr: 'Appeler mamie à la place', en: 'Call grandma instead' },
        out: [
          { w: 1, text: { fr: ["On a appelé mamie avec une voix déguisée. Elle a tout de suite su que c'était moi, a joué le jeu pendant dix minutes, puis m'a demandé si je mangeais assez. Mamie gagne toujours.", "On a fait une blague à mamie. Elle a répondu par une blague bien pire, qui impliquait {w:animal} et le facteur. On n'était pas prêts."], en: ["We called grandma in a fake voice. She knew it was me instantly, played along for ten minutes, then asked if I was eating enough. Grandma always wins.", "We pranked grandma. She replied with a much worse joke involving {w:animal} and the mailman. We weren't ready."] }, fx: { happy: 4, karma: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_lost_theme_park',
    icon: '🎡',
    cat: 'family',
    once: true,
    when: { age: [4, 9] },
    scene: { place: 'park', mood: 'cry' },
    text: {
      fr: [
        "Parc d'attractions. Tu t'es arrêté{|e} pour regarder une mascotte géante déguisée en {w:animal}. Quand tu te retournes, ta famille a disparu.",
        "Tu as lâché la main de ton père pour aller voir les auto-tamponneuses. Il y a des milliers de gens. Aucun n'est ton père. Ça sent {w:smell}.",
        "Tu es perdu{|e} à la fête foraine, entre le stand de barbe à papa et un lot géant ({w:object}). La musique est très forte. Tu as envie de pleurer.",
        "Tu viens de réaliser que la jambe à laquelle tu t'accroches depuis cinq minutes n'est pas celle de ta mère. Le monsieur te regarde, surpris.",
      ],
      en: [
        "Theme park. You stopped to watch a giant mascot dressed as {w:animal}. When you turn around, your family is gone.",
        "You let go of your dad's hand to look at the bumper cars. There are thousands of people. None of them is your dad. It smells like {w:smell}.",
        "You're lost at the fair, between the cotton-candy stand and a giant prize ({w:object}). The music is very loud. You want to cry.",
        "You've just realized the leg you've been clinging to for five minutes isn't your mom's. The man looks down at you, surprised.",
      ],
    },
    choices: [
      {
        label: { fr: 'Aller voir un agent', en: 'Find a staff member' },
        out: [
          { w: 3, text: { fr: ["Un agent m'a emmené{|e} au point de rencontre et a annoncé au micro : « {Le petit|La petite} {first} attend ses parents. » Mes parents sont arrivés en courant, rouges de honte. J'ai eu une glace.", "La sécurité a fait une annonce dans tout le parc. Mes parents sont venus me chercher. J'avais déjà mangé deux gaufres offertes par le personnel. J'ai presque regretté qu'ils me trouvent."], en: ["A staff member took me to the meeting point and announced over the loudspeaker: “Little {first} is waiting for their parents.” My parents came running, red with shame. I got an ice cream.", "Security made an announcement across the whole park. My parents came to get me. Staff had already given me two waffles. I almost wished they hadn't found me."] }, fx: { happy: 3, smarts: 2 } },
        ],
      },
      {
        label: { fr: 'Les chercher seul', en: 'Search on your own' },
        out: [
          { w: 2, text: { fr: ["J'ai cherché partout. J'ai fini par monter seul{|e} dans le grand huit, « pour voir d'en haut ». Je les ai vus. Ils m'ont vu{|e}. Leurs visages valaient le détour.", "J'ai erré pendant une heure, j'ai gagné {w:object} à la pêche aux canards avec une pièce trouvée par terre, puis j'ai retrouvé mes parents à la buvette. Ils ne s'étaient pas aperçus de mon absence."], en: ["I searched everywhere. I ended up riding the roller coaster alone, “to see from above”. I saw them. They saw me. Their faces were worth it.", "I wandered for an hour, won {w:object} at the duck pond with a coin I found on the ground, then found my parents at the snack bar. They hadn't noticed I was gone."] }, fx: { happy: 2, athletic: 1, discipline: -1 } },
          { w: 1, text: { fr: ["J'ai pleuré au milieu de l'allée jusqu'à ce qu'une famille {w:far_place} en vacances me prenne en charge. J'ai failli être adopté{|e}. Mes parents sont arrivés juste à temps.", "J'ai suivi une poussette qui ressemblait à la nôtre. Ce n'était pas la nôtre. J'ai fini dans le labyrinthe de miroirs, à pleurer devant cinquante versions de moi-même."], en: ["I cried in the middle of the walkway until a family vacationing from {w:far_place} took me under their wing. I nearly got adopted. My parents arrived just in time.", "I followed a stroller that looked like ours. It wasn't ours. I ended up in the hall of mirrors, crying at fifty versions of myself."] }, fx: { happy: -4 } },
        ],
      },
    ],
  },

  // ═════════════════════════════ SPORTS, PARTIES & ADVENTURES ═════════════════════════════
  {
    id: 'k2_bike_ramp',
    icon: '🚲',
    cat: 'hobby',
    rating: 1,
    cooldown: 3,
    actor: { role: 'anyFriend', create: { role: 'friend', age: [-1, 1], gender: 'any' } },
    when: { age: [7, 12] },
    scene: { place: 'park', mood: 'shock' },
    text: {
      fr: [
        "{a.first} a construit un tremplin avec une planche et deux parpaings. Il faut sauter à vélo par-dessus {w:object}. Tout le quartier regarde.",
        "Défi du jour : descendre la grande côte à vélo sans freiner. {a.first} l'a fait hier. {a:Il|Elle} a encore une croûte sur le menton pour le prouver.",
        "Tu viens d'apprendre à faire du vélo sans les mains. {a.first} te met au défi de le faire devant la boulangerie, {w:weather}.",
        "Concours de dérapage sur le parking du supermarché avec {a.first}. Le gagnant remporte {w:gift}. Le perdant, probablement une écorchure.",
      ],
      en: [
        "{a.first} built a ramp out of a plank and two cinder blocks. You have to jump your bike over {w:object}. The whole neighborhood is watching.",
        "Today's dare: ride down the big hill without braking. {a.first} did it yesterday. They still have a scab on their chin to prove it.",
        "You just learned to ride no-handed. {a.first} dares you to do it in front of the bakery, {w:weather}.",
        "Skid contest in the supermarket parking lot with {a.first}. The winner gets {w:gift}. The loser probably gets a scrape.",
      ],
    },
    choices: [
      {
        label: { fr: 'Foncer sans réfléchir', en: 'Go for it, no thinking' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai pris mon élan, décollé, et atterri sur les deux roues. Il y a eu un silence, puis des cris de joie. {a.first} m'a appelé{|e} « {w:nickname} ». C'est un titre de noblesse.", "Saut parfait. Ou presque : j'ai atterri, puis j'ai fait trois mètres sur une roue en hurlant {w:exclaim} Le quartier en parle encore."], en: ["I built up speed, took off, and landed on both wheels. Silence, then cheers. {a.first} called me “{w:nickname}”. It's a noble title.", "Perfect jump. Almost: I landed, then rode ten feet on one wheel screaming {w:exclaim} The neighborhood still talks about it."] }, fx: { happy: 7, athletic: 3, rel: 10 } },
          { w: 1, text: { fr: ["Le vélo a décollé. Moi aussi, mais pas dans la même direction. Genoux en sang, coudes râpés, guidon tordu. J'ai ramené le vélo à pied en boitant, comme un vétéran.", "J'ai raté la planche et atterri dans la haie de la voisine. Elle est sortie avec {w:object} à la main, furieuse. J'ai perdu une sandale dans la fuite."], en: ["The bike took off. So did I, in a different direction. Bloody knees, scraped elbows, bent handlebars. I walked the bike home limping, like a veteran.", "I missed the plank and landed in the neighbor's hedge. She came out holding {w:object}, furious. I lost a sandal in the escape."] }, fx: { happy: -2, health: -4, athletic: 1 } },
        ],
      },
      {
        label: { fr: 'Mettre un casque d\'abord', en: 'Put on a helmet first' },
        out: [
          { w: 2, text: { fr: ["J'ai mis le casque, les genouillères et les coudières. {a.first} s'est moqué{a:|e} de moi. Puis {a:il|elle} est tombé{a:|e}, et moi non. Qui rit maintenant ?", "Avec mon casque, j'avais l'air d'un champignon. Mais j'ai sauté, je suis tombé{|e}, et je n'ai rien eu. Le champignon a gagné."], en: ["I put on the helmet, knee pads and elbow pads. {a.first} laughed at me. Then they fell, and I didn't. Who's laughing now?", "In my helmet I looked like a mushroom. But I jumped, I fell, and I was fine. The mushroom won."] }, fx: { happy: 3, athletic: 2, discipline: 2 } },
        ],
      },
      {
        label: { fr: 'Refuser le défi', en: 'Turn down the dare' },
        out: [
          { w: 1, text: { fr: ["J'ai refusé. On m'a traité{|e} de poule mouillée. Le soir, {a.first} est rentré{a:|e} avec un bras dans le plâtre. Je suis une poule mouillée en parfaite santé.", "J'ai dit non et je suis allé{|e} m'acheter {w:food} à la boulangerie. Le défi a dégénéré sans moi. J'ai regardé de loin en mangeant. Le meilleur spectacle."], en: ["I said no. They called me chicken. That evening {a.first} came home with an arm in a cast. I'm a chicken in perfect health.", "I said no and went to buy {w:food} at the bakery. The dare went sideways without me. I watched from afar while eating. Best show in town."] }, fx: { happy: 1, health: 1, discipline: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_diving_board',
    icon: '🏊',
    cat: 'hobby',
    once: true,
    when: { age: [6, 12] },
    scene: { place: 'beach', mood: 'shock' },
    text: {
      fr: [
        "Piscine municipale. Le plongeoir de trois mètres te nargue. Tes copains ont tous sauté. Tu es en haut, les orteils au bord, et l'eau te paraît à des kilomètres.",
        "Test de natation pour avoir le droit d'aller dans le grand bain : sauter du plongeoir et nager jusqu'au bord. Le maître-nageur siffle. Ça sent {w:smell}.",
        "En haut du plongeoir, tu as une vue sur toute la piscine, sur le snack et sur {w:animal} qui traîne sur la pelouse. Derrière toi, une file d'enfants s'impatiente.",
        "Ton grand cousin dit que sauter du grand plongeoir, c'est « comme voler ». Tu es en haut depuis [[cinq|douze|vingt]] minutes. Tu ne voles pas.",
      ],
      en: [
        "Public pool. The ten-foot diving board is taunting you. Your friends have all jumped. You're at the top, toes on the edge, and the water looks miles away.",
        "Swim test to be allowed in the deep end: jump off the board and swim to the side. The lifeguard blows the whistle. It smells like {w:smell}.",
        "From the top of the diving board you can see the whole pool, the snack bar and {w:animal} wandering on the lawn. Behind you, a line of kids is getting impatient.",
        "Your big cousin says jumping off the high board is “like flying”. You've been up here for [[five|twelve|twenty]] minutes. You are not flying.",
      ],
    },
    choices: [
      {
        label: { fr: 'Sauter les yeux fermés', en: 'Jump with eyes closed' },
        out: [
          { w: 2, text: { fr: ["J'ai fermé les yeux et sauté. Trois secondes de chute, une éternité. J'ai remonté à la surface en criant de joie. J'ai refait le saut [[douze|vingt|trente]] fois de suite.", "J'ai sauté en criant {w:exclaim} Le maître-nageur m'a applaudi{|e}. J'ai eu mon diplôme du grand bain. Je l'ai accroché au-dessus de mon lit."], en: ["I closed my eyes and jumped. Three seconds of falling, an eternity. I surfaced shouting with joy. I jumped [[twelve|twenty|thirty]] more times in a row.", "I jumped yelling {w:exclaim} The lifeguard clapped. I got my deep-end certificate. I hung it above my bed."] }, fx: { happy: 7, athletic: 3 } },
          { w: 1, text: { fr: ["J'ai sauté, mais à plat ventre. Le bruit a résonné dans toute la piscine, comme {w:sound}. J'ai le ventre rouge comme une tomate. Mais j'ai sauté.", "J'ai sauté et mon maillot, lui, est resté à la surface un peu plus longtemps que moi. J'ai nagé jusqu'au bord en le tenant d'une main. Légende du bassin."], en: ["I jumped, but belly-first. The slap echoed through the whole pool, like {w:sound}. My belly is red as a tomato. But I jumped.", "I jumped and my swimsuit stayed at the surface a bit longer than I did. I swam to the edge holding it with one hand. Pool legend."] }, fx: { happy: 2, athletic: 2, looks: -1, health: -1 } },
        ],
      },
      {
        label: { fr: 'Redescendre par l\'échelle', en: 'Climb back down the ladder' },
        out: [
          { w: 2, text: { fr: ["Je suis redescendu{|e} par l'échelle, sous les regards de la file d'attente. Un petit de cinq ans a sauté juste après moi en riant. J'ai mangé {w:food} pour me consoler.", "J'ai fait demi-tour. Le maître-nageur m'a dit « la prochaine fois ». J'ai répondu « jamais ». On verra qui a raison."], en: ["I climbed back down the ladder as the line watched. A five-year-old jumped right after me, laughing. I ate {w:food} to cheer myself up.", "I turned back. The lifeguard said “next time”. I said “never”. We'll see who's right."] }, fx: { happy: -3, discipline: 1 } },
        ],
      },
      {
        label: { fr: 'Faire une bombe', en: 'Do a cannonball' },
        out: [
          { w: 1, text: { fr: ["J'ai fait la plus grosse bombe de l'histoire de la piscine. Une dame qui bronzait au bord a été trempée de la tête aux pieds. Le maître-nageur m'a exclu{|e} vingt minutes. Ça valait le coup.", "Ma bombe a éclaboussé le maître-nageur sur sa chaise. Il a soupiré, s'est essuyé, puis m'a montré son pouce levé. Respect mutuel."], en: ["I did the biggest cannonball in the history of the pool. A lady sunbathing at the edge got soaked head to toe. The lifeguard benched me for twenty minutes. Worth it.", "My cannonball soaked the lifeguard on his chair. He sighed, wiped himself off, then gave me a thumbs-up. Mutual respect."] }, fx: { happy: 6, athletic: 2, discipline: -2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_sports_club',
    icon: '🥋',
    cat: 'hobby',
    once: true,
    actor: 'parent',
    when: { age: [5, 10], has: 'parent' },
    scene: { place: 'stadium', mood: 'neutral' },
    text: {
      fr: [
        "{a.rel} veut t'inscrire à une activité extrascolaire « pour que tu te dépenses ». Au forum des associations, il y a le judo, le foot, la danse et {w:hobby}.",
        "C'est la rentrée. {a.rel} a une brochure à la main et l'air déterminé. Tu vas faire un sport, que tu le veuilles ou non.",
        "{a.rel} a lu que les enfants qui font du sport réussissent mieux. Ce soir, tu choisis ton club. Ton seul sport actuel, c'est le zapping devant {w:show}.",
        "Ton meilleur copain fait du judo, ta cousine de la gymnastique, et {a.rel} rêve en secret de te voir jouer au tennis comme {w:celeb}.",
      ],
      en: [
        "{a.rel} wants to sign you up for an after-school activity “to burn off energy”. At the clubs fair there's judo, soccer, dance and {w:hobby}.",
        "It's back-to-school time. {a.rel} is holding a brochure and looks determined. You're doing a sport, like it or not.",
        "{a.rel} read that kids who play sports do better in school. Tonight you pick a club. Your only current sport is channel-surfing past {w:show}.",
        "Your best friend does judo, your cousin does gymnastics, and {a.rel} secretly dreams of you playing tennis like {w:celeb}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le judo', en: 'Judo' },
        out: [
          { w: 2, text: { fr: ["Je me suis inscrit{|e} au judo. Mon kimono est trois tailles trop grand, « pour que tu grandisses dedans ». J'ai fait ma première chute contrôlée. Puis plusieurs non contrôlées.", "Premier cours de judo : j'ai fait tomber un garçon deux fois plus grand que moi. Le professeur a dit « bien ». J'ai entendu « champion{|ne} olympique »."], en: ["I signed up for judo. My gi is three sizes too big, “so you'll grow into it”. I did my first controlled fall. Then several uncontrolled ones.", "First judo class: I threw a boy twice my size. The instructor said “good”. I heard “Olympic champion”."] }, fx: { happy: 4, athletic: 4, discipline: 3, flag: 'k2_club_judo' } },
        ],
      },
      {
        label: { fr: 'Le foot', en: 'Soccer' },
        out: [
          { w: 2, text: { fr: ["Je me suis inscrit{|e} au foot. Premier match : on a perdu 14 à 0. J'ai touché le ballon une fois, avec la tête, sans le faire exprès. L'entraîneur m'a félicité{|e} pour « l'engagement ».", "Au foot, on m'a mis{|e} gardien. J'ai arrêté un penalty avec le visage. Saignement de nez, applaudissements, glace offerte par le club. Meilleur jour de ma vie."], en: ["I joined soccer. First match: we lost 14–0. I touched the ball once, with my head, by accident. The coach praised my “commitment”.", "In soccer they made me goalie. I stopped a penalty with my face. Nosebleed, applause, free ice cream from the club. Best day of my life."] }, fx: { happy: 4, athletic: 4 } },
        ],
      },
      {
        label: { fr: 'Rester sur le canapé', en: 'Stay on the couch' },
        out: [
          { w: 1, text: { fr: ["J'ai refusé tous les sports. {a.my} m'a inscrit{|e} quand même à la natation synchronisée. Je fais maintenant des figures en pince à linge sur le nez. Je n'ai rien choisi.", "J'ai négocié : pas de sport, mais des échecs. {a.my} a accepté. J'ai battu le prof au troisième cours. Il a dit que j'avais « un esprit de stratège ». Ou de tricheur."], en: ["I refused every sport. {a.my} signed me up for synchronized swimming anyway. I now do routines with a nose clip. I chose nothing.", "I negotiated: no sport, but chess. {a.my} agreed. I beat the teacher in the third lesson. He said I have “a strategist's mind”. Or a cheater's."] }, fx: { happy: 1, smarts: 3, athletic: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_judo_belt',
    icon: '🥋',
    cat: 'hobby',
    cooldown: 2,
    when: { age: [6, 12], flag: 'k2_club_judo' },
    scene: { place: 'stadium', mood: 'proud' },
    text: {
      fr: [
        "Passage de ceinture au judo ! Tu es [[ceinture blanche|ceinture jaune|ceinture orange]] et tu vises la suivante. Ton adversaire a l'air d'avoir mangé {w:food} au petit-déjeuner.",
        "Compétition de judo départementale. Tes parents sont dans les gradins avec une pancarte faite maison. Ton adversaire est déjà en train de crier.",
        "Au judo, le professeur t'oppose au plus fort du club, surnommé « {w:nickname} ». Il n'a jamais perdu. Il a {age} ans, comme toi, mais deux fois ta taille.",
        "Ta ceinture de judo s'est défaite en plein combat. Ton pantalon de kimono glisse. L'arbitre ne voit rien. Ton adversaire charge.",
      ],
      en: [
        "Judo belt exam! You're a [[white belt|yellow belt|orange belt]] going for the next one. Your opponent looks like they ate {w:food} for breakfast.",
        "Regional judo competition. Your parents are in the stands with a homemade sign. Your opponent is already yelling.",
        "At judo, the instructor pairs you against the club's strongest kid, nicknamed “{w:nickname}”. Undefeated. Same age as you, twice your size.",
        "Your judo belt came undone mid-match. Your gi pants are slipping. The referee doesn't notice. Your opponent charges.",
      ],
    },
    choices: [
      {
        label: { fr: 'Attaquer de front', en: 'Attack head-on' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai attaqué de toutes mes forces. Ippon ! L'adversaire est tombé comme {w:object} qu'on lâche. J'ai eu ma ceinture. Je dors avec.", "J'ai foncé et fait la seule prise que je connais. Elle a marché. Mes parents ont hurlé « {w:exclaim} » si fort qu'on les a priés de se calmer."], en: ["I attacked with everything I had. Ippon! My opponent went down like {w:object} falling off a shelf. I got my belt. I sleep in it.", "I charged and did the only throw I know. It worked. My parents yelled “{w:exclaim}” so loud they were asked to calm down."] }, fx: { happy: 7, athletic: 4, discipline: 2 } },
          { w: 1, text: { fr: ["J'ai attaqué et je me suis retrouvé{|e} à plat dos en une seconde, en regardant les néons du gymnase. Défaite éclair. J'ai salué dignement, puis pleuré dans les vestiaires.", "J'ai attaqué, mon pantalon est tombé. Toute la salle a vu mon slip à motifs de dinosaures. J'ai perdu le combat et un peu de ma dignité."], en: ["I attacked and found myself flat on my back in one second, staring at the gym lights. Lightning defeat. I bowed with dignity, then cried in the locker room.", "I attacked, my pants fell down. The whole gym saw my dinosaur underwear. I lost the match and some dignity."] }, fx: { happy: -3, athletic: 2 } },
        ],
      },
      {
        label: { fr: 'Esquiver et attendre', en: 'Dodge and wait' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai esquivé pendant trois minutes. L'adversaire s'est épuisé et a fini par trébucher tout seul. Victoire par fatigue. Le professeur hésite entre me féliciter et me gronder.", "J'ai tourné autour de mon adversaire comme {w:animal} méfiant. Il s'est énervé et a pris une pénalité. J'ai gagné aux points. C'est moche, mais c'est une victoire."], en: ["I dodged for three minutes. My opponent wore himself out and tripped on his own. Victory by exhaustion. The instructor can't decide whether to praise or scold me.", "I circled my opponent like {w:animal} on the lookout. He got frustrated and took a penalty. I won on points. Ugly, but a win."] }, fx: { happy: 4, smarts: 2, athletic: 2 } },
        ],
      },
    ],
  },

  {
    id: 'k2_football_parent',
    icon: '⚽',
    cat: 'family',
    rating: 1,
    cooldown: 3,
    actor: 'parent',
    when: { age: [6, 12], has: 'parent' },
    scene: { place: 'stadium', mood: 'angry' },
    text: {
      fr: [
        "Match de foot des moins de dix ans. {a.rel} est au bord du terrain et hurle sur l'arbitre, qui a quatorze ans et une moustache naissante. Tout le monde te regarde.",
        "Ton match du samedi. {a.rel} a apporté une corne de brume et crie des consignes tactiques contradictoires. L'entraîneur fait des gestes pour qu'{a.he} se calme.",
        "Tournoi de foot. {a.rel} vient de traiter l'arbitre de « {w:insult} » devant tous les parents. Tu es en train de tirer un corner.",
        "{a.rel} filme tout ton match en commentant comme à la télé. Il pleut, {w:weather}. Tu n'as pas touché le ballon depuis vingt minutes.",
      ],
      en: [
        "Under-10 soccer match. {a.rel} is on the sideline yelling at the referee, who is fourteen and has a budding mustache. Everyone is looking at you.",
        "Your Saturday match. {a.rel} brought an air horn and is shouting contradictory tactical instructions. The coach is gesturing for them to calm down.",
        "Soccer tournament. {a.rel} just called the referee “{w:insult}” in front of all the parents. You're taking a corner kick.",
        "{a.rel} is filming your whole match with TV-style commentary. It's raining, {w:weather}. You haven't touched the ball in twenty minutes.",
      ],
    },
    choices: [
      {
        label: { fr: 'Marquer pour lui faire plaisir', en: 'Score to make them happy' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai marqué un but. Je crois. Le ballon a rebondi sur mon genou, puis sur le gardien. {a.my} a couru sur le terrain en hurlant. On a pris un carton jaune. Pour {a.my}.", "J'ai marqué ! {a.my} a fondu en larmes, enlacé l'arbitre qu'{a:il|elle} insultait deux minutes avant et payé {w:food} à toute l'équipe."], en: ["I scored a goal. I think. The ball bounced off my knee, then the goalie. {a.my} ran onto the pitch screaming. We got a yellow card. {a.my} did.", "I scored! {a.my} burst into tears, hugged the referee they'd been insulting two minutes earlier and bought the whole team {w:food}."] }, fx: { happy: 7, athletic: 3, rel: 10 } },
          { w: 1, text: { fr: ["J'ai tiré de toutes mes forces. Le ballon a atterri dans le thermos de {a.my}. Café partout. {a:Il|Elle} s'est enfin tu{a:|e}. Mission accomplie, d'une certaine façon.", "J'ai raté le but de dix mètres. {a.my} a crié {w:exclaim} si fort que l'équipe adverse a applaudi. J'ai demandé à changer de famille."], en: ["I kicked with all my might. The ball landed in {a.my}'s thermos. Coffee everywhere. They finally shut up. Mission accomplished, in a way.", "I missed the goal by thirty feet. {a.my} yelled {w:exclaim} so loudly the other team applauded. I asked to change families."] }, fx: { happy: -2, athletic: 2, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Demander à {a.rel} de partir', en: 'Ask {a.rel} to leave' },
        out: [
          { w: 1, text: { fr: ["Je suis allé{|e} voir {a.my} à la mi-temps et je lui ai demandé d'attendre dans la voiture. Il y a eu un silence. Puis {a:il|elle} y est allé{a:|e}. J'ai joué le meilleur match de ma vie.", "J'ai demandé poliment à {a.my} de se taire. Vexé{a:|e}, {a:il|elle} est resté{a:|e} muet{a:|te} tout le match en tenant une pancarte « JE NE DIS RIEN ». C'était pire."], en: ["At halftime I went to {a.my} and asked them to wait in the car. Silence. Then they went. I played the best match of my life.", "I politely asked {a.my} to be quiet. Offended, they stayed silent the whole match holding a sign that said “I'M NOT SAYING ANYTHING”. That was worse."] }, fx: { happy: 3, discipline: 2, rel: -10 } },
        ],
      },
      {
        label: { fr: 'Faire semblant de ne pas {a.him} connaître', en: "Pretend you don't know them" },
        out: [
          { w: 1, text: { fr: ["J'ai dit à mes coéquipiers que je ne connaissais pas cette personne. {a.my} a crié mon prénom en entier, avec mon surnom de bébé, « {w:nickname} ». Mes coéquipiers savent tout.", "J'ai changé de côté du terrain pour être loin de {a.my}. {a:Il|Elle} m'a suivi{|e} le long de la ligne de touche, comme {w:animal} qui suit un sandwich."], en: ["I told my teammates I didn't know that person. {a.my} shouted my full name, plus my baby nickname, “{w:nickname}”. My teammates know everything now.", "I switched sides of the pitch to get away from {a.my}. They followed me along the sideline, like {w:animal} following a sandwich."] }, fx: { happy: -2, looks: -1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_sleepover',
    icon: '🛌',
    cat: 'friends',
    rating: 1,
    cooldown: 3,
    actor: { role: 'anyFriend', create: { role: 'friend', age: [-1, 1], gender: 'same' } },
    when: { age: [6, 12] },
    scene: { place: 'home', mood: 'happy', prop: 'bed' },
    text: {
      fr: [
        "Première soirée pyjama chez {a.first} ! Ses parents sont « cools » : ils ont dit qu'on pouvait veiller jusqu'à 22 h. Il est 1 h du matin et vous mangez {w:food} sous une tente en draps.",
        "Soirée pyjama chez {a.first}. Il est 2 h du matin. Tout le monde dort, sauf toi. La maison fait {w:sound}. Ta maison te manque soudainement.",
        "Chez {a.first}, on raconte des histoires qui font peur à la lampe de poche. Dans la dernière, {w:animal} hante les toilettes. Tu as très envie de faire pipi.",
        "Soirée pyjama chez {a.first} : film d'horreur interdit, {w:food} à volonté et un concours pour savoir qui tiendra éveillé le plus longtemps.",
      ],
      en: [
        "First sleepover at {a.first}'s! Their parents are “cool”: they said you could stay up until 10. It's 1 a.m. and you're eating {w:food} in a bedsheet tent.",
        "Sleepover at {a.first}'s. It's 2 a.m. Everyone's asleep except you. The house is making {w:sound}. You suddenly miss home.",
        "At {a.first}'s, everyone's telling scary stories by flashlight. In the last one, {w:animal} haunts the toilet. You really need to pee.",
        "Sleepover at {a.first}'s: forbidden horror movie, all-you-can-eat {w:food} and a contest to see who stays awake longest.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tenir jusqu\'à l\'aube', en: 'Stay up till dawn' },
        out: [
          { w: 2, text: { fr: ["On a tenu jusqu'à 5 h du matin en racontant des blagues sur les pets. J'ai dormi tout le dimanche. Mes parents m'ont récupéré{|e} dans un état de zombie heureux.", "On a fait un concours de pets dans les sacs de couchage. {a.first} a gagné haut la main avec {w:sound}. Sa mère est venue voir si tout allait bien. On a fait semblant de dormir."], en: ["We stayed up till 5 a.m. telling fart jokes. I slept all Sunday. My parents picked up a happy zombie.", "We had a farting contest in our sleeping bags. {a.first} won hands down with {w:sound}. Their mom came to check on us. We pretended to be asleep."] }, fx: { happy: 7, health: -2, rel: 15 } },
          { w: 1, text: { fr: ["Je me suis endormi{|e} {le premier|la première}, à 21 h 30. On m'a dessiné une moustache au feutre. Elle est restée trois jours. Même à la photo de classe.", "J'ai été {le dernier|la dernière} éveillé{|e}. Seul{|e} dans le noir, j'ai entendu {w:sound}. J'ai réveillé toute la maison. C'était le frigo."], en: ["I fell asleep first, at 9:30 p.m. They drew a mustache on me in marker. It lasted three days. Including class photo day.", "I was the last one awake. Alone in the dark, I heard {w:sound}. I woke the whole house. It was the fridge."] }, fx: { happy: -1, looks: -1, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Appeler les parents', en: 'Call your parents' },
        out: [
          { w: 2, text: { fr: ["J'ai appelé mes parents à minuit en chuchotant. Mon père est venu me chercher en pyjama, avec {w:object} sur le siège passager. On n'en a jamais reparlé. Je l'aime.", "J'ai appelé ma mère. Elle a parlé avec moi au téléphone jusqu'à ce que je m'endorme. Le lendemain, j'ai dit à {a.first} que j'avais dormi « comme un bébé ». Techniquement vrai."], en: ["I called my parents at midnight, whispering. Dad came to get me in his pajamas, with {w:object} on the passenger seat. We never spoke of it again. I love him.", "I called my mom. She stayed on the phone until I fell asleep. Next day I told {a.first} I'd slept “like a baby”. Technically true."] }, fx: { happy: 1, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Faire une farce à {a.first}', en: 'Prank {a.first}' },
        out: [
          { w: 1, text: { fr: ["J'ai mis la main de {a.first} dans un bol d'eau tiède pendant qu'{a:il|elle} dormait. Il ne s'est rien passé. Internet m'a menti. J'ai fini {w:food} à la place.", "J'ai caché {w:object} dans le sac de couchage de {a.first}. {a:Il|Elle} a hurlé, puis ri, puis m'a coursé{|e} dans toute la maison. Ses parents sont descendus. Ils étaient moins cools."], en: ["I put {a.first}'s hand in a bowl of warm water while they slept. Nothing happened. The internet lied. I finished {w:food} instead.", "I hid {w:object} in {a.first}'s sleeping bag. They screamed, then laughed, then chased me through the whole house. Their parents came down. They were less cool."] }, fx: { happy: 5, rel: 5, discipline: -2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_birthday_invite',
    icon: '🎂',
    cat: 'friends',
    cooldown: 3,
    when: { age: [5, 11] },
    scene: { place: 'party', mood: 'party', prop: 'cake' },
    text: {
      fr: [
        "Pour ton anniversaire, tes parents t'autorisent à inviter « cinq copains maximum ». Tu as déjà distribué [[douze|dix-huit|vingt-cinq]] invitations.",
        "Tout le monde est invité à l'anniversaire de la star de la classe, sauf toi. Tu as vu les cartons passer. Le thème : {w:movie}.",
        "Ton anniversaire approche. Tu veux une fête à thème : {w:show}. Tes parents ont dit « on verra », ce qui veut dire « non ».",
        "Tu es invité{|e} à un anniversaire au bowling. Il faut apporter un cadeau. Tes parents te tendent {w:gift} emballé dans du papier journal.",
      ],
      en: [
        "For your birthday, your parents let you invite “five friends max”. You've already handed out [[twelve|eighteen|twenty-five]] invitations.",
        "Everyone's invited to the class star's birthday party, except you. You saw the invites go round. The theme: {w:movie}.",
        "Your birthday's coming up. You want a party themed on {w:show}. Your parents said “we'll see”, which means “no”.",
        "You're invited to a bowling birthday party. You have to bring a gift. Your parents hand you {w:gift} wrapped in newspaper.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire la fête en grand', en: 'Go big' },
        out: [
          { w: 2, text: { fr: ["Vingt enfants sont venus. Mes parents ont acheté {w:food} en catastrophe. On a cassé une lampe, perdu un enfant pendant dix minutes et mangé tout le gâteau. Fête légendaire.", "La fête a été un triomphe. Un magicien a fait disparaître {w:object}. Il ne l'a jamais fait réapparaître. Ma mère le cherche encore."], en: ["Twenty kids came. My parents panic-bought {w:food}. We broke a lamp, lost a kid for ten minutes and ate the whole cake. Legendary party.", "The party was a triumph. A magician made {w:object} disappear. He never made it reappear. Mom is still looking for it."] }, fx: { happy: 8, karma: 1 } },
          { w: 1, text: { fr: ["Sur vingt invitations, deux enfants sont venus. On a mangé le gâteau pour trente à trois. J'ai eu mal au ventre jusqu'au lendemain, mais j'ai deux vrais amis.", "Il a plu, le clown s'est trompé d'adresse et le gâteau est tombé face contre terre. On a mangé {w:food} devant la télé. C'était quand même bien."], en: ["Out of twenty invitations, two kids came. The three of us ate a cake for thirty. Stomachache till the next day, but I have two real friends.", "It rained, the clown went to the wrong address and the cake landed face-down. We ate {w:food} in front of the TV. It was still nice."] }, fx: { happy: 1, health: -1 } },
        ],
      },
      {
        label: { fr: 'Organiser ta contre-fête', en: 'Throw a counter-party' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["Le jour de la fête où je n'étais pas invité{|e}, j'ai organisé une « fête des oubliés » dans le parc. Huit enfants sont venus. On a mangé des chips et juré fidélité éternelle.", "J'ai monté une fête rivale le même jour, avec {w:animal} en guest-star (le chien du voisin, déguisé). La moitié des invités de l'autre fête sont venus chez moi."], en: ["On the day of the party I wasn't invited to, I threw a “forgotten kids party” in the park. Eight kids came. We ate chips and swore eternal loyalty.", "I set up a rival party on the same day, with {w:animal} as special guest (the neighbor's dog in costume). Half the other party's guests came to mine."] }, fx: { happy: 6, smarts: 2, karma: 1 } },
        ],
      },
      {
        label: { fr: 'Rester discret', en: 'Keep it low-key' },
        out: [
          { w: 1, text: { fr: ["J'ai fêté mon anniversaire en famille, avec mamie et {w:food} en guise de gâteau. On a joué aux cartes. Mamie a triché. C'était parfait.", "J'ai offert mon cadeau emballé dans du journal. L'enfant a déchiré le papier et lu à voix haute la rubrique nécrologique. Tout le monde a ri. Moi aussi, un peu."], en: ["I celebrated with family, grandma and {w:food} instead of a cake. We played cards. Grandma cheated. It was perfect.", "I gave my present wrapped in newspaper. The kid tore it open and read the obituaries out loud. Everyone laughed. Me too, a little."] }, fx: { happy: 3 } },
        ],
      },
    ],
  },
  {
    id: 'k2_birthday_regift',
    icon: '🎁',
    cat: 'friends',
    rating: 1,
    once: true,
    actor: { role: 'classmate', create: { role: 'classmate', age: [-1, 1], gender: 'any' } },
    when: { age: [6, 12] },
    scene: { place: 'party', mood: 'shock', prop: 'cake' },
    text: {
      fr: [
        "Tu vas à l'anniversaire de {a.first}. Tes parents ont oublié le cadeau. Ta mère attrape en panique {w:gift} dans le placard des cadeaux de tante Huguette.",
        "Cadeau d'anniversaire pour {a.first} : tu as emballé {w:object} trouvé dans ta chambre. Il y a encore ton prénom écrit dessus au marqueur.",
        "{a.first} ouvre ton cadeau devant tout le monde. C'est {w:gift}. {a:Il|Elle} s'arrête net : « Mais… c'est moi qui te l'ai offert l'année dernière. »",
        "Ta mère a recyclé un cadeau reçu pour l'offrir à {a.first}. Il y a encore la carte : « Joyeux anniversaire, ma chérie ! Tata Monique. »",
      ],
      en: [
        "You're going to {a.first}'s birthday. Your parents forgot the gift. Your mom panics and grabs {w:gift} from the closet of Aunt Edna's gifts.",
        "Birthday present for {a.first}: you wrapped {w:object} you found in your room. Your name is still written on it in marker.",
        "{a.first} opens your present in front of everyone. It's {w:gift}. They freeze: “Wait… I gave you this last year.”",
        "Your mom regifted something to give to {a.first}. The card is still inside: “Happy birthday, sweetie! Love, Aunt Monica.”",
      ],
    },
    choices: [
      {
        label: { fr: 'Nier avec aplomb', en: 'Deny with confidence' },
        out: [
          { w: 2, text: { fr: ["J'ai juré que c'était une coïncidence et que ce cadeau était « très populaire cette année ». Personne n'y a cru, mais personne n'a osé me contredire. Le mensonge par intimidation.", "J'ai dit que c'était un « cadeau rétro, c'est la mode ». Un parent a hoché la tête, impressionné. J'ai peut-être inventé une tendance."], en: ["I swore it was a coincidence and that the gift was “very popular this year”. Nobody believed it, but nobody dared contradict me. Lying by intimidation.", "I said it was a “vintage gift, it's trendy”. One parent nodded, impressed. I may have invented a trend."] }, fx: { happy: 3, karma: -3 } },
          { w: 1, text: { fr: ["{a.first} a lu la carte à voix haute devant tout le monde. « Tata Monique » a été répété toute l'année à mon passage. Ma mère n'est plus invitée aux réunions de parents.", "Le cadeau contenait encore le ticket de caisse au nom de ma tante, daté de l'an dernier. Les preuves étaient accablantes."], en: ["{a.first} read the card aloud to everyone. “Aunt Monica” was chanted whenever I walked by for the rest of the year. My mom isn't invited to parent meetings anymore.", "The gift still had the receipt in my aunt's name, dated years ago. The evidence was overwhelming."] }, fx: { happy: -5, looks: -1, rel: -10 } },
        ],
      },
      {
        label: { fr: 'En rire', en: 'Laugh it off' },
        out: [
          { w: 2, text: { fr: ["J'ai éclaté de rire et avoué. {a.first} aussi. On a fait le serment de s'offrir le même cadeau chaque année, pour toujours. C'est devenu une tradition.", "J'ai dit : « Ce cadeau a voyagé, il a une histoire. » Tout le monde a ri. {a.first} m'a donné une double part de gâteau pour l'audace."], en: ["I burst out laughing and confessed. So did {a.first}. We swore to give each other the same gift every year, forever. It became a tradition.", "I said, “This gift has traveled, it has a story.” Everyone laughed. {a.first} gave me a double slice of cake for my nerve."] }, fx: { happy: 5, karma: 1, rel: 15, actorRole: 'friend' } },
        ],
      },
    ],
  },
  {
    id: 'k2_imaginary_lawyer',
    icon: '👻',
    cat: 'weird',
    once: true,
    actor: 'parent',
    when: { age: [3, 7], has: 'parent' },
    scene: { place: 'home', mood: 'neutral', fx: 'ghost' },
    text: {
      fr: [
        "Ton ami imaginaire s'appelle [[Jean-Mi|Princesse Brocoli|Monsieur Plinte]]. Il exige désormais une place à table, une assiette et qu'on lui serve {w:food}. {a.rel} hésite.",
        "Ton ami imaginaire a cassé le vase. Pas toi. Lui. Tu l'as vu. {a.rel} a du mal à mettre un ami imaginaire au coin.",
        "Ton ami imaginaire a annoncé qu'il était {w:weird_job} et qu'il partait bientôt en voyage {w:far_place}. Tu dois l'annoncer à {a.rel}.",
        "{a.rel} s'est assis{a:|e} sur ton ami imaginaire, qui était sur le canapé. Ton ami imaginaire est très en colère. Toi aussi.",
      ],
      en: [
        "Your imaginary friend is called [[Jimmy|Princess Broccoli|Mr. Baseboard]]. He now demands a seat at the table, a plate and to be served {w:food}. {a.rel} hesitates.",
        "Your imaginary friend broke the vase. Not you. Him. You saw it. {a.rel} is struggling to put an imaginary friend in time-out.",
        "Your imaginary friend announced he's {w:weird_job} and leaving soon on a trip {w:far_place}. You have to tell {a.rel}.",
        "{a.rel} sat on your imaginary friend, who was on the couch. Your imaginary friend is very angry. So are you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Exiger réparation', en: 'Demand reparations' },
        out: [
          { w: 2, text: { fr: ["J'ai exigé des excuses officielles pour mon ami imaginaire. {a.my} s'est excusé{a:|e} solennellement auprès du canapé vide. Ma grand-mère est entrée à ce moment-là. Elle a des questions.", "Mon ami imaginaire a obtenu une assiette à table. {a.my} lui sert {w:food} tous les soirs. Je mange sa part. Tout le monde est content."], en: ["I demanded an official apology for my imaginary friend. {a.my} solemnly apologized to the empty couch. Grandma walked in at that moment. She has questions.", "My imaginary friend got a plate at the table. {a.my} serves him {w:food} every night. I eat his share. Everyone's happy."] }, fx: { happy: 5, smarts: 1, rel: 5, flag: 'k2_imag_friend', schedule: { key: 'k2_imaginary_goodbye', years: 2 } } },
        ],
      },
      {
        label: { fr: 'Lui faire porter le chapeau', en: 'Make him take the blame' },
        rating: 1,
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["Désormais, tout est de la faute de mon ami imaginaire : les miettes, les dessins sur le mur, {w:sound} pendant le dîner. {a.my} commence à le détester. C'est le crime parfait.", "Mon ami imaginaire a été puni à ma place. Il est au coin depuis deux heures. Moi, je regarde {w:show}. La justice a ses failles."], en: ["Now everything's my imaginary friend's fault: the crumbs, the drawings on the wall, {w:sound} at dinner. {a.my} is starting to hate him. The perfect crime.", "My imaginary friend got punished instead of me. He's been in time-out for two hours. I'm watching {w:show}. Justice has its flaws."] }, fx: { happy: 4, karma: -2, flag: 'k2_imag_friend', schedule: { key: 'k2_imaginary_goodbye', years: 2 } } },
          { w: 1, text: { fr: ["{a.my} a joué le jeu : « D'accord, ton ami est privé de dessert. Et comme vous êtes inséparables… » J'ai perdu sur un point de procédure.", "{a.my} a déclaré que mon ami imaginaire devait ranger la chambre. Comme il est imaginaire, c'est moi qui ai rangé. Le système est truqué."], en: ["{a.my} played along: “Fine, your friend gets no dessert. And since you're inseparable…” I lost on a technicality.", "{a.my} declared that my imaginary friend had to clean the room. Since he's imaginary, I did it. The system is rigged."] }, fx: { happy: -2, discipline: 2 } },
        ],
      },
    ],
  },
  {
    id: 'k2_imaginary_goodbye',
    icon: '👋',
    cat: 'weird',
    chainOnly: true,
    when: { age: [5, 10], flag: 'k2_imag_friend' },
    scene: { place: 'home', mood: 'sad', fx: 'ghost' },
    text: {
      fr: [
        "Ce matin, tu as cherché ton ami imaginaire partout. Il n'est plus là. Sur ton bureau, tu trouves un mot que tu ne te souviens pas avoir écrit : « Je pars {w:far_place}. Grandis bien. »",
        "Ton ami imaginaire t'annonce qu'il a trouvé un nouvel enfant, plus jeune, qui a « plus besoin de lui ». Il fait ses valises invisibles.",
        "Tu te rends compte que tu n'as pas parlé à ton ami imaginaire depuis des semaines. Il t'attend sur le canapé, l'air vexé, avec {w:object}.",
        "Tes parents ont gardé la place de ton ami imaginaire à table par habitude. Tu viens de leur dire qu'il est parti. Ils ont l'air presque tristes.",
      ],
      en: [
        "This morning you looked everywhere for your imaginary friend. He's gone. On your desk there's a note you don't remember writing: “I'm off to live {w:far_place}. Grow up well.”",
        "Your imaginary friend announces he's found a new, younger kid who “needs him more”. He's packing his invisible bags.",
        "You realize you haven't talked to your imaginary friend in weeks. He's waiting on the couch, looking offended, holding {w:object}.",
        "Your parents kept your imaginary friend's seat at the table out of habit. You just told them he left. They look almost sad.",
      ],
    },
    choices: [
      {
        label: { fr: 'Organiser une fête d\'adieu', en: 'Throw a farewell party' },
        out: [
          { w: 2, text: { fr: ["On a fait une fête d'adieu avec {w:food} et des ballons. Mes parents ont trinqué avec le vide. Mon père a fait un discours étonnamment émouvant. Ma mère a pleuré.", "J'ai offert {w:gift} à mon ami imaginaire pour son départ. Le cadeau est resté sur le canapé une semaine, puis a disparu. Mon père dit qu'il n'y est pour rien."], en: ["We threw a farewell party with {w:food} and balloons. My parents toasted thin air. Dad gave a surprisingly moving speech. Mom cried.", "I gave my imaginary friend {w:gift} as a goodbye present. It sat on the couch for a week, then vanished. My dad says he had nothing to do with it."] }, fx: { happy: 3, smarts: 2, unflag: 'k2_imag_friend' } },
        ],
      },
      {
        label: { fr: 'Le supplier de rester', en: 'Beg him to stay' },
        out: [
          { w: 1, text: { fr: ["J'ai supplié. Il est resté encore un mois, puis il est parti sans prévenir, comme tous les amis imaginaires. Je l'ai dessiné pour ne pas oublier son visage.", "Il a accepté de rester « à temps partiel », le week-end seulement. On a un accord de garde. Mes parents trouvent ça très mature."], en: ["I begged. He stayed one more month, then left without warning, like all imaginary friends do. I drew him so I wouldn't forget his face.", "He agreed to stay “part time”, weekends only. We have a custody arrangement. My parents find it very mature."] }, fx: { happy: -1, smarts: 1, unflag: 'k2_imag_friend' } },
        ],
      },
    ],
  },
  {
    id: 'k2_youtube_dream',
    icon: '📹',
    cat: 'hobby',
    cooldown: 4,
    when: { age: [7, 12], era: [2010, 2100] },
    scene: { place: 'home', mood: 'proud', prop: 'camera' },
    text: {
      fr: [
        "Tu as décidé de devenir {YouTubeur|YouTubeuse} célèbre comme {w:celeb}. Ta première vidéo : un test de bonbons. Tu as la tablette de ta mère et zéro abonné.",
        "Ta chaîne vidéo compte [[deux|trois|sept]] abonnés, dont ta grand-mère et un compte bizarre. Tu prépares une vidéo spéciale pour percer.",
        "Tu filmes ton premier « unboxing » avec {w:object}. Le son est raté, l'image floue, et le chien traverse le cadre toutes les dix secondes.",
        "Tu veux lancer un défi viral sur {w:app}. Ton idée : manger un citron entier sans grimacer. Tes parents ne savent pas que tu as un compte.",
      ],
      en: [
        "You've decided to become a famous YouTuber like {w:celeb}. First video: a candy taste test. You have your mom's tablet and zero subscribers.",
        "Your video channel has [[two|three|seven]] subscribers, including your grandma and a weird account. You're preparing a special video to break through.",
        "You're filming your first “unboxing” with {w:object}. The sound is bad, the picture's blurry and the dog walks through the frame every ten seconds.",
        "You want to launch a viral challenge on {w:app}. Your idea: eat a whole lemon without making a face. Your parents don't know you have an account.",
      ],
    },
    choices: [
      {
        label: { fr: 'Publier la vidéo', en: 'Post the video' },
        out: [
          { w: 2, text: { fr: ["Ma vidéo a fait 14 vues. Douze sont de moi, une de mamie, et une d'un inconnu {w:far_place} qui a commenté « ok ». Je suis international{|e}.", "J'ai publié. Mamie a partagé la vidéo dans tous ses groupes. J'ai maintenant quarante abonnés de plus de 70 ans qui commentent « BRAVO MON GRAND ». C'est un public."], en: ["My video got 14 views. Twelve are mine, one is grandma's, and one is from a stranger {w:far_place} who commented “ok”. I'm international.", "I posted it. Grandma shared it in all her groups. I now have forty subscribers over 70 who comment “WELL DONE SWEETIE”. It's an audience."] }, fx: { happy: 4, smarts: 1, followers: 40 } },
          { w: 1, text: { fr: ["La vidéo a marché ! Enfin, surtout le passage où le chien vole {w:food} sur la table. Il a plus de fans que moi. J'ai créé une star et ce n'est pas moi.", "Mes parents ont découvert la vidéo. On y voit le salon en désordre, mon père en slip à l'arrière-plan et la chanson {w:song}. Chaîne supprimée."], en: ["The video worked! Well, mostly the part where the dog steals {w:food} off the table. It has more fans than me. I created a star and it isn't me.", "My parents found the video. It shows the messy living room, my dad in his underwear in the background and the song {w:song}. Channel deleted."] }, fx: { happy: -1, followers: 15 } },
        ],
      },
      {
        label: { fr: 'Abandonner la gloire', en: 'Give up on fame' },
        out: [
          { w: 1, text: { fr: ["J'ai regardé ma vidéo et j'ai eu honte de ma voix. J'ai tout effacé. J'ai décidé de devenir {w:weird_job} à la place. Plus discret.", "J'ai renoncé à la célébrité pour me concentrer sur l'essentiel : les dessins animés et {w:food}. Ma carrière peut attendre."], en: ["I watched my video and was ashamed of my voice. I deleted everything. I decided to become {w:weird_job} instead. More discreet.", "I gave up fame to focus on what matters: cartoons and {w:food}. My career can wait."] }, fx: { happy: 1, smarts: 1 } },
        ],
      },
    ],
  },
  {
    id: 'k2_fair_goldfish',
    icon: '🎣',
    cat: 'family',
    once: true,
    actor: 'parent',
    when: { age: [4, 10], has: 'parent' },
    scene: { place: 'park', mood: 'happy' },
    text: {
      fr: [
        "Fête foraine ! Au stand de la pêche aux canards, le lot principal est un poisson rouge dans un sac plastique. {a.rel} prie pour que tu rates.",
        "Tu as un ticket pour le stand de tir. Le gros lot est un poisson rouge, entre {w:object} et une peluche géante. {a.rel} te regarde avec méfiance.",
        "À la fête foraine, un forain moustachu te propose de gagner un poisson rouge en lançant trois anneaux. {a.rel} dit « on n'a pas d'aquarium ».",
        "Tu as gagné à la loterie de la kermesse. Tu peux choisir entre {w:gift} et un poisson rouge vivant. {a.rel} te fait de grands signes de la tête.",
      ],
      en: [
        "Fun fair! At the hook-a-duck stall, the top prize is a goldfish in a plastic bag. {a.rel} prays you'll miss.",
        "You have a ticket for the shooting gallery. The top prize is a goldfish, between {w:object} and a giant plushie. {a.rel} eyes you warily.",
        "At the fair, a mustached carny offers you a goldfish if you land three rings. {a.rel} says “we don't have a tank”.",
        "You won the school fair raffle. You can choose between {w:gift} and a live goldfish. {a.rel} is shaking their head at you frantically.",
      ],
    },
    choices: [
      {
        label: { fr: 'Gagner le poisson', en: 'Win the fish' },
        out: [
          { w: 2, text: { fr: ["J'ai gagné le poisson ! Je l'ai appelé [[Nemo|Gérard|Steak]]. On a dû acheter un aquarium en urgence. {a.my} a soupiré pendant tout le trajet, le sac sur les genoux.", "Victoire ! Le poisson a voyagé dans son sac jusqu'à la maison, puis dans le saladier, puis dans {w:object}, en attendant mieux. Il a l'air serein. Moi, je suis aux anges."], en: ["I won the fish! I named him [[Nemo|Gerald|Steak]]. We had to buy an emergency tank. {a.my} sighed the whole way home, bag on their lap.", "Victory! The fish rode home in his bag, then in the salad bowl, then in {w:object} until we found better. He seems calm. I'm over the moon."] }, fx: { happy: 7, rel: -5, newNpc: { role: 'pet', species: 'fish' } } },
          { w: 1, text: { fr: ["J'ai raté les trois anneaux. Le forain m'a donné un lot de consolation : {w:object}. {a.my} a eu l'air immensément soulagé{a:|e}.", "J'ai gagné, mais j'ai choisi la peluche géante au dernier moment. Elle est plus grande que moi. Elle a pris la place du chat sur le canapé. Le chat ne me parle plus."], en: ["I missed all three rings. The carny gave me a consolation prize: {w:object}. {a.my} looked enormously relieved.", "I won, but picked the giant plushie at the last second. It's bigger than me. It took the cat's spot on the couch. The cat isn't speaking to me."] }, fx: { happy: 2, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Prendre la barbe à papa', en: 'Get cotton candy instead' },
        out: [
          { w: 1, text: { fr: ["J'ai renoncé au poisson pour une barbe à papa géante. J'en avais dans les cheveux, les oreilles et les sourcils. {a.my} m'a remercié{|e} d'avoir épargné une vie.", "J'ai pris la barbe à papa. Elle a fondu sur mon t-shirt dans la voiture. Je suis rentré{|e} plus collant{|e} qu'un pot de miel. Mais content{|e}."], en: ["I gave up the fish for a giant cotton candy. I had it in my hair, ears and eyebrows. {a.my} thanked me for sparing a life.", "I got the cotton candy. It melted on my shirt in the car. I came home stickier than a honey jar. But happy."] }, fx: { happy: 4, rel: 10 } },
        ],
      },
    ],
  },
  {
    id: 'k2_doorbell_ditch',
    icon: '🔔',
    cat: 'friends',
    rating: 1,
    cooldown: 3,
    actor: { role: 'anyFriend', create: { role: 'friend', age: [-1, 1], gender: 'any' } },
    when: { age: [7, 12] },
    scene: { place: 'park', mood: 'happy' },
    text: {
      fr: [
        "{a.first} propose une partie de « sonnette-fuite » dans la rue : sonner chez les gens et partir en courant. Le premier sur la liste est le voisin grincheux qui a {w:animal}.",
        "Il est 18 h, il fait presque nuit. {a.first} a repéré une maison avec une sonnette qui fait {w:sound}. C'est trop tentant.",
        "{a.first} te défie de sonner chez la directrice de l'école, qui habite trois rues plus loin. Le gage si tu refuses : manger {w:food}.",
        "Sonnette-fuite avec {a.first} : il reste une dernière maison, celle avec un nain de jardin qui te fixe et des volets qui grincent.",
      ],
      en: [
        "{a.first} suggests a game of ding-dong ditch on your street: ring doorbells and run. First on the list is the grumpy neighbor who owns {w:animal}.",
        "It's 6 p.m. and almost dark. {a.first} has spotted a house with a doorbell that sounds like {w:sound}. Too tempting.",
        "{a.first} dares you to ring the principal's doorbell; she lives three streets away. The forfeit if you refuse: eat {w:food}.",
        "Ding-dong ditch with {a.first}: one last house, the one with a garden gnome staring at you and creaky shutters.",
      ],
    },
    choices: [
      {
        label: { fr: 'Sonner et courir', en: 'Ring and run' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai sonné et couru comme jamais. On s'est cachés derrière une poubelle, morts de rire. Le voisin est sorti en pyjama, a crié {w:exclaim} et est rentré. Adrénaline pure.", "On a fait toute la rue. Personne ne nous a attrapés. On a fini sur un banc, essoufflés, à partager {w:food}. C'est ça, la liberté."], en: ["I rang and ran like never before. We hid behind a trash can, dying of laughter. The neighbor came out in pajamas, yelled {w:exclaim} and went back in. Pure adrenaline.", "We did the whole street. Nobody caught us. We ended up on a bench, out of breath, sharing {w:food}. That's freedom."] }, fx: { happy: 6, athletic: 2, karma: -2, rel: 10 } },
          { w: 1, text: { fr: ["La porte s'est ouverte avant même que j'aie lâché la sonnette. C'était la directrice. Elle a dit mon prénom. Juste mon prénom. J'ai senti mon âme quitter mon corps.", "En fuyant, je me suis pris{|e} les pieds dans un tuyau d'arrosage et étalé{|e} dans les géraniums. Le voisin m'a ramené{|e} chez moi par l'oreille. Mes parents l'ont remercié."], en: ["The door opened before I'd even let go of the bell. It was the principal. She said my name. Just my name. I felt my soul leave my body.", "Running away, I tripped over a garden hose and sprawled into the geraniums. The neighbor marched me home by the ear. My parents thanked him."] }, fx: { happy: -4, discipline: 2, health: -1 } },
        ],
      },
      {
        label: { fr: 'Laisser un mot gentil', en: 'Leave a nice note' },
        out: [
          { w: 1, text: { fr: ["J'ai proposé une variante : sonner et laisser un dessin sur le paillasson. Le voisin grincheux a souri pour la première fois depuis 1987. {a.first} trouve que j'ai ramolli.", "On a sonné et laissé un mot : « Bonne soirée ! » La dame nous a rattrapés et nous a offert des biscuits. Le crime ne paie pas, la gentillesse si."], en: ["I suggested a variant: ring and leave a drawing on the doormat. The grumpy neighbor smiled for the first time since 1987. {a.first} thinks I've gone soft.", "We rang and left a note: “Have a nice evening!” The lady caught up with us and gave us cookies. Crime doesn't pay, kindness does."] }, fx: { happy: 4, karma: 4, rel: 5 } },
        ],
      },
    ],
  },
  {
    id: 'k2_spy_kit',
    icon: '🔭',
    cat: 'weird',
    rating: 1,
    cooldown: 4,
    when: { age: [6, 12] },
    scene: { place: 'home', mood: 'neutral' },
    text: {
      fr: [
        "Tu as reçu une panoplie d'espion : jumelles, carnet secret et fausse moustache. Ta première cible : les voisins d'en face, qui ont l'air de cacher {w:object}.",
        "Avec tes nouvelles jumelles, tu surveilles la rue depuis ta fenêtre. Le voisin du dessus fait quelque chose de très suspect avec {w:animal}.",
        "Tu as installé un micro-espion (un talkie-walkie scotché sous la table) pendant le dîner de tes parents avec des amis. Tu écoutes depuis ta chambre.",
        "Ton carnet d'espion est rempli de notes sur le facteur : il passe tous les jours à la même heure et sourit trop. Tu es sûr{|e} qu'il est {w:weird_job}.",
      ],
      en: [
        "You got a spy kit: binoculars, a secret notebook and a fake mustache. Your first target: the neighbors across the street, who seem to be hiding {w:object}.",
        "With your new binoculars, you watch the street from your window. The upstairs neighbor is doing something very suspicious with {w:animal}.",
        "You planted a bug (a walkie-talkie taped under the table) during your parents' dinner with friends. You're listening from your room.",
        "Your spy notebook is full of notes about the mailman: he comes by at the same time every day and smiles too much. You're sure he's {w:weird_job}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Poursuivre l\'enquête', en: 'Keep investigating' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["Après une semaine de filature, j'ai découvert la vérité : le voisin chante {w:song} sous la douche, fenêtre ouverte, tous les matins. Je ne peux plus le regarder dans les yeux.", "Mon rapport d'espion fait vingt pages. Conclusion : le voisin parle à ses plantes et leur donne des prénoms. Je l'ai remis à mes parents. Ils ont trouvé ça « inquiétant ». Pour moi."], en: ["After a week of surveillance I uncovered the truth: the neighbor sings {w:song} in the shower, window open, every morning. I can't look him in the eye anymore.", "My spy report is twenty pages long. Conclusion: the neighbor talks to his plants and names them. I handed it to my parents. They found it “worrying”. About me."] }, fx: { happy: 4, smarts: 3 } },
          { w: 1, text: { fr: ["Le talkie-walkie a grésillé en plein dîner. Tout le monde a entendu ma voix dire « ici Aigle Noir, la cible mange {w:food} ». Mon père a confisqué ma panoplie. Mission compromise.", "Le voisin m'a repéré{|e} avec mes jumelles. Il m'a fait coucou. Puis il est venu sonner pour parler à mes parents. Un espion ne doit jamais être vu. J'ai échoué."], en: ["The walkie-talkie crackled in the middle of dinner. Everyone heard my voice say “Black Eagle here, target is eating {w:food}”. Dad confiscated my kit. Mission compromised.", "The neighbor spotted me with my binoculars. He waved. Then he came over to talk to my parents. A spy must never be seen. I failed."] }, fx: { happy: -3, discipline: 1 } },
        ],
      },
      {
        label: { fr: 'Espionner tes parents', en: 'Spy on your parents' },
        out: [
          { w: 1, text: { fr: ["J'ai espionné mes parents pendant une soirée entière. Ils ont regardé {w:show}, mangé des chips et se sont endormis à 21 h 30. La vie des adultes est un désert. Je ne veux pas grandir.", "J'ai découvert en espionnant que mes parents cachent les cadeaux de Noël {w:at_place}. Je n'ai rien dit. Je suis un agent double."], en: ["I spied on my parents for a whole evening. They watched {w:show}, ate chips and fell asleep at 9:30 p.m. Adult life is a wasteland. I don't want to grow up.", "Spying, I discovered my parents hide the Christmas presents {w:at_place}. I said nothing. I'm a double agent."] }, fx: { happy: 2, smarts: 2 } },
        ],
      },
    ],
  },

];
