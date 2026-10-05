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
        "{a.first} a passé l'après-midi à me raconter sa vie. Je n'ai pas tout compris, mais j'ai retenu qu'il ne faut jamais faire confiance à {w:animal}.",
      ],
      en: [
        "{a.my} told me for the [[twelfth|fortieth|hundredth]] time about the day {a.he} bumped into {w:celeb} {w:at_place}. The details change every time.",
        "{a.my} explained that back in the day they walked to school, in the snow, uphill, both ways. I didn't dare ask about the geography.",
        "{a.my} showed me an old photo of {a.him}, very young, posing in front of {w:vehicle}. “Wasn't I gorgeous?” I said yes. It was a charitable lie.",
        "{a.first} spent the afternoon telling me their life story. I didn't follow all of it, but I learned you should never trust {w:animal}.",
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
        "Pour la fête des parents, la maîtresse t'a fait coller des coquillettes sur un pot de yaourt. Le résultat ressemble vaguement à {w:animal}. C'est pour {a.rel}.",
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
          { w: 3, text: { fr: ["{a.my} l'a porté toute la journée, même pour aller faire les courses. Une coquillette est tombée dans le chariot. C'est devenu une relique.", "{a.my} a versé une larme et l'a accroché au rétroviseur de la voiture. Il y est toujours. Il sent le pâté."], en: ["{a.my} wore it all day, even to the grocery store. A noodle fell into the cart. It became a holy relic.", "{a.my} shed a tear and hung it from the car mirror. It's still there. It smells like old soup."] }, fx: { happy: 6, rel: 10 } },
          { w: 1, text: { fr: ["{a.my} a dit « oh, merci… » avec la voix qu'on prend pour les cadeaux de Noël de tante Odile. J'ai tout compris.", "Le chien a mangé le collier pendant que {a.my} me faisait un câlin. Moment d'émotion, puis de panique."], en: ["{a.my} said “oh, thank you…” in the voice used for Aunt Odile's Christmas gifts. I got the message.", "The dog ate the necklace while {a.my} was hugging me. A moment of emotion, then panic."] }, fx: { happy: -2, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Le manger sur le chemin', en: 'Eat it on the way home' },
        out: [
          { w: 2, text: { fr: ["J'ai mangé le collier dans la voiture. Les pâtes crues à la gouache, ça croque. J'ai eu le ventre qui gargouille jusqu'au soir.", "J'ai grignoté le cadeau coquillette par coquillette. Arrivé{|e} à la maison, il restait la ficelle. J'ai offert la ficelle."], en: ["I ate the necklace in the car. Raw pasta with poster paint is crunchy. My stomach gurgled until bedtime.", "I nibbled the present noodle by noodle. By the time we got home only the string was left. I gave them the string."] }, fx: { happy: 3, health: -3, rel: -5 } },
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
          { w: 3, odds: { smarts: 1 }, text: { fr: ["J'ai écrit que Nounours avait rencontré {w:celeb} et piloté {w:vehicle}. La maîtresse a lu le cahier devant toute la classe. Standing ovation.", "Selon mon cahier, Nounours a passé le week-end {w:far_place}. J'ai collé une photo découpée dans un magazine. Personne n'a vérifié."], en: ["I wrote that Teddy met {w:celeb} and drove {w:vehicle}. The teacher read the diary out loud to the class. Standing ovation.", "According to my diary, Teddy spent the weekend {w:far_place}. I glued in a photo cut from a magazine. Nobody checked."] }, fx: { happy: 5, smarts: 3, grade: 3 } },
          { w: 1, text: { fr: ["La maîtresse m'a demandé pourquoi Nounours était allé sur la Lune avec seulement des dessins au feutre comme preuve. J'ai invoqué le secret défense.", "Un camarade a dit : « C'est pas vrai, il était chez toi devant la télé, je l'ai vu par ta fenêtre. » Trahison."], en: ["The teacher asked why Teddy went to the Moon with only felt-tip drawings as evidence. I cited national security.", "A classmate said, “That's not true, he was at your place watching TV, I saw him through your window.” Betrayal."] }, fx: { happy: -2, karma: -2 } },
        ],
      },
      {
        label: { fr: 'Fouiller toute la maison', en: 'Search the whole house' },
        out: [
          { w: 2, text: { fr: ["J'ai retrouvé Nounours dans le panier à linge, sous {w:object}. Il a fait un tour de machine à 60 degrés. Il est plus propre et plus petit.", "Nounours était dans le frigo, entre le beurre et {w:food}. Personne ne sait comment. Il a eu froid, mais il est vivant."], en: ["I found Teddy in the laundry basket, under {w:object}. He'd been through a hot wash. He's cleaner and smaller now.", "Teddy was in the fridge, between the butter and {w:food}. Nobody knows how. He was cold, but alive."] }, fx: { happy: 4, discipline: 2 } },
          { w: 1, text: { fr: ["Introuvable. Mes parents ont acheté une peluche « presque pareille » à la station-service. La maîtresse a plissé les yeux mais n'a rien dit.", "On ne l'a jamais retrouvé. Je suis officiellement l'enfant qui a perdu Nounours. Les petits de maternelle me montrent du doigt."], en: ["Nowhere to be found. My parents bought an “almost identical” plushie at a gas station. The teacher squinted but said nothing.", "We never found him. I am officially the kid who lost Teddy. The little ones point at me."] }, fx: { happy: -5, karma: -1 } },
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
          { w: 1, text: { fr: ["Le vent a tourné. Tout le sable m'est revenu en pleine bouche. {a.first} a ri si fort qu'{a:il|elle} a fait pipi dans son pantalon. On est quittes.", "J'ai lancé du sable, {a.first} a lancé un seau entier. J'ai perdu la guerre mais j'ai gagné un surnom : « le bac à sable »."], en: ["The wind turned. All the sand came straight back into my mouth. {a.first} laughed so hard they peed their pants. We're even.", "I threw sand, {a.first} threw a whole bucket. I lost the war but won a nickname: “Sandbox”."] }, fx: { happy: -2, health: -2, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Négocier un traité', en: 'Negotiate a treaty' },
        out: [
          { w: 3, odds: { smarts: 1 }, text: { fr: ["On a signé un traité de paix avec un bâton dans le sable : le coin de la pelle rouge le matin pour {a.first}, l'après-midi pour moi. L'ONU serait fière.", "J'ai proposé de construire un château commun. Il est devenu le plus grand château de l'histoire de la maternelle. {a.first} est mon allié{a:|e} maintenant."], en: ["We signed a peace treaty with a stick in the sand: red-shovel corner in the morning for {a.first}, afternoons for me. The UN would be proud.", "I suggested building a joint castle. It became the biggest castle in preschool history. {a.first} is my ally now."] }, fx: { happy: 4, smarts: 2, rel: 15, actorRole: 'friend' } },
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
          { w: 2, text: { fr: ["{a.my} a passé la nuit à bricoler avec du carton et du scotch. Le résultat est indescriptible. Le jury du carnaval m'a donné un prix « spécial ».", "Mon costume en carton a pris l'eau sous la pluie. J'ai défilé en bouillie. Les photos circulent encore dans la famille."], en: ["{a.my} spent the night crafting with cardboard and tape. The result is indescribable. The carnival jury gave me a “special” prize.", "My cardboard costume got soaked in the rain. I paraded as pulp. The photos still circulate in the family."] }, fx: { happy: 5, rel: 10 } },
          { w: 1, text: { fr: ["Personne n'a reconnu ce que j'étais. Un parent m'a demandé si j'étais une poubelle. J'étais un château fort.", "Le costume était si grand que je suis resté{|e} coincé{|e} dans la porte de la classe. Les pompiers… non, la gardienne m'a libéré{|e}."], en: ["Nobody could tell what I was. A parent asked if I was a trash can. I was a castle.", "The costume was so big I got stuck in the classroom doorway. The fire brigade… no, the janitor freed me."] }, fx: { happy: -2, rel: 5 } },
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
          { w: 1, text: { fr: ["Je suis venu{|e} en habits normaux et j'ai dit que j'étais déguisé{|e} en « enfant normal ». La maîtresse a trouvé ça très conceptuel.", "J'étais le seul enfant sans déguisement. Une dame m'a donné un nez de clown par pitié. Je l'ai gardé toute la journée."], en: ["I came in regular clothes and said I was dressed as “a normal kid”. The teacher found it very conceptual.", "I was the only kid without a costume. A lady gave me a clown nose out of pity. I wore it all day."] }, fx: { happy: -1, smarts: 2 } },
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
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai écrit « ipopotam ». La maîtresse a entouré, puis souri. J'ai eu 6/10 et un petit dessin d'hippopotame dans la marge.", "J'ai écrit les mots comme ils sonnent. Résultat : une dictée qui ressemble à un texto. 5/10, et une maîtresse qui soupire."], en: ["I wrote “hipopotamus”. The teacher circled it, then smiled. I got 6/10 and a little hippo doodle in the margin.", "I spelled everything how it sounds. The result reads like a text message. 5/10 and a sighing teacher."] }, fx: { grade: 1, smarts: 2 } },
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
          { w: 3, odds: { smarts: 1, discipline: 1 }, text: { fr: ["On a révisé jusqu'à 21 h. Le lendemain, j'ai récité la table de 7 sans une erreur. La maîtresse m'a donné un bon point. {a.my} a dormi comme une pierre.", "J'ai fini par comprendre. 7 × 8 = 56. Je l'ai répété toute la soirée, même sous la douche. Ma famille me déteste un peu."], en: ["We studied until 9 p.m. The next day I recited the 7s perfectly. The teacher gave me a gold star. {a.my} slept like a rock.", "I finally got it. 7 × 8 = 56. I repeated it all evening, even in the shower. My family hates me a little."] }, fx: { smarts: 4, grade: 5, discipline: 3, rel: 5 } },
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
          { w: 3, text: { fr: ["J'ai dessiné la maîtresse en reine avec une couronne. Elle l'a accroché au tableau. Les autres élèves ont tous dessiné des reines l'année suivante. Je suis précurseur.", "J'ai offert un dessin de la classe. J'ai dessiné la maîtresse un peu trop large. Elle a souri bizarrement, puis m'a remercié{|e} quand même."], en: ["I drew the teacher as a queen with a crown. She pinned it up on the board. Next year everyone drew queens. I'm a trendsetter.", "I gave a drawing of the class. I drew the teacher a bit too wide. She smiled oddly, then thanked me anyway."] }, fx: { happy: 4, karma: 2, grade: 1 } },
        ],
      },
      {
        label: { fr: 'Offrir ce qui traîne', en: "Give whatever's lying around" },
        out: [
          { w: 2, text: { fr: ["J'ai offert un taille-crayon à moitié mâchouillé et une gomme en forme de fraise. La maîtresse a dit « c'est l'intention qui compte » d'une voix vide.", "J'ai offert {w:object} trouvé au fond de mon cartable. La maîtresse l'a pris avec deux doigts. Elle a eu l'air sincèrement surprise."], en: ["I gave a half-chewed pencil sharpener and a strawberry eraser. The teacher said “it's the thought that counts” in a hollow voice.", "I gave {w:object} I found at the bottom of my bag. The teacher took it with two fingers. She seemed genuinely surprised."] }, fx: { happy: 1, smarts: 1 } },
          { w: 1, text: { fr: ["J'ai offert une boîte avec une coccinelle dedans. Elle s'est envolée dans les cheveux de la maîtresse. Hurlements, puis rires. Elle s'en souviendra toute sa vie.", "J'ai offert mon goûter. La maîtresse a été émue, je crois. Ou elle avait faim. Elle l'a mangé tout de suite."], en: ["I gave a box with a ladybug inside. It flew into the teacher's hair. Screams, then laughter. She'll remember it forever.", "I gave her my snack. I think she was moved. Or hungry. She ate it immediately."] }, fx: { happy: 3, karma: 1 } },
        ],
      },
      {
        label: { fr: 'Faire un discours', en: 'Give a speech' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai fait un discours de deux minutes sur le « courage de supporter la classe ». La maîtresse a pleuré. Un parent a filmé. Je suis viral{|e} dans le quartier.", "Mon discours a commencé par « Madame, vous êtes la meilleure maîtresse que j'ai eue », puis j'ai réalisé que c'était la seule. Ça a fait rire tout le monde."], en: ["I gave a two-minute speech about her “courage in putting up with us”. The teacher cried. A parent filmed it. I'm famous in the neighborhood.", "My speech started with “You're the best teacher I've ever had”, then I realized she was the only one. Everyone laughed."] }, fx: { happy: 5, smarts: 2, karma: 2 } },
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
          { w: 2, text: { fr: ["J'ai rendu le devoir fait par {a.my}. 4/20. « Hors sujet, méthode incorrecte. » {a.my} a passé le dîner à insulter le système éducatif.", "La maîtresse a écrit sur la copie : « Bon travail, félicite tes parents. » Tout le monde a compris. {a.my} a été très fier{a:|e}. Moi, moins."], en: ["I handed in the homework {a.my} did. 4/20. “Off-topic, wrong method.” {a.my} spent dinner cursing the education system.", "The teacher wrote on it: “Good work, congratulate your parents.” Everyone got it. {a.my} was very proud. I was less so."] }, fx: { grade: -3, happy: 2, rel: 5 } },
          { w: 1, text: { fr: ["La maquette de {a.my} a gagné le premier prix de l'école. Je ne sais pas comment elle fonctionne. Le jury m'a posé une question. J'ai dit « c'est secret ».", "Excellente note. {a.my} a parlé de « notre » 18/20 à tous ses collègues pendant une semaine. Je suis devenu{|e} un simple prête-nom."], en: ["{a.my}'s model won first prize at school. I have no idea how it works. The jury asked me a question. I said “it's a secret”.", "Great grade. {a.my} bragged about “our” A to coworkers for a week. I've become a front."] }, fx: { grade: 5, smarts: -1, karma: -2 } },
        ],
      },
      {
        label: { fr: 'Le refaire toi-même', en: 'Redo it yourself' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai tout refait en cachette avec mes mots à moi. 14/20. {a.my} a été vexé{a:|e}. Mais fier{a:|e}. Les deux en même temps.", "J'ai refait le devoir moi-même. C'était moins beau, mais c'était juste. La maîtresse a souligné « enfin un travail d'enfant »."], en: ["I secretly redid it all in my own words. 14/20. {a.my} was offended. But proud. Both at once.", "I redid the homework myself. Less pretty, but correct. The teacher underlined “finally, a child's work”."] }, fx: { grade: 3, smarts: 3, discipline: 2, rel: -5 } },
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
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai racheté toutes les bananes à bas prix et je les ai revendues au goûter, quand tout le monde avait faim. Je suis le Wall Street de la cantine.", "J'ai monopolisé les compotes à boire. À 15 h, j'ai fixé mes prix. Le directeur parle de moi comme d'« un cas »."], en: ["I bought up every banana cheap and resold them at snack time, when everyone was starving. I'm the Wall Street of the canteen.", "I cornered the squeezy-applesauce market. At 3 p.m. I set my prices. The principal refers to me as “a case”."] }, fx: { happy: 5, smarts: 3, karma: -2 } },
          { w: 1, text: { fr: ["Krach boursier : la dame de la cantine a découvert le trafic et confisqué mon stock. Je suis ruiné{|e} et j'ai mangé une banane tachée.", "J'ai stocké les desserts dans mon cartable. Le yaourt a explosé sur mon cahier de poésie. Le marché m'a puni{|e}."], en: ["Market crash: the canteen lady found the operation and seized my stock. I'm ruined and I ate a bruised banana.", "I stored the desserts in my schoolbag. A yogurt exploded on my poetry notebook. The market punished me."] }, fx: { happy: -4, discipline: -2 } },
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
          { w: 2, text: { fr: ["J'ai prévenu la dame de la cantine. Le trafic a été démantelé. Le lendemain, quelqu'un a mis de la purée dans ma trousse. Le milieu n'oublie pas.", "J'ai tout balancé. Le CM2 a été privé de dessert un mois. Moi, j'ai été privé{|e} d'amis pour à peu près la même durée."], en: ["I told the canteen lady. The ring was dismantled. The next day someone put mashed potatoes in my pencil case. The underworld never forgets.", "I spilled everything. The fifth-grader lost dessert privileges for a month. I lost friends for about the same time."] }, fx: { happy: -3, karma: 3, discipline: 2 } },
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
          { w: 2, text: { fr: ["J'ai touché la statue. Une alarme a retenti. Un gardien a couru vers moi au ralenti. La classe entière a été évacuée. Je suis une légende.", "J'ai touché du bout du doigt. Rien ne s'est passé. Pas d'alarme, pas de malédiction. J'étais presque déçu{|e}."], en: ["I touched the statue. An alarm went off. A guard ran at me in slow motion. The whole class got evacuated. I'm a legend.", "I touched it with one fingertip. Nothing happened. No alarm, no curse. I was almost disappointed."] }, fx: { happy: 4, discipline: -3, grade: -1 } },
          { w: 1, text: { fr: ["J'ai touché, et le nez de la statue m'est resté dans la main. Non. Je rigole. Mais le gardien l'a cru une seconde et il a crié {w:exclaim}", "Un bout de l'œuvre d'art moderne s'est décollé. Personne n'a remarqué la différence. Même pas l'artiste, probablement."], en: ["I touched it and the statue's nose came off in my hand. No. Kidding. But the guard believed it for a second and yelled {w:exclaim}", "A piece of the modern artwork came loose. Nobody noticed the difference. Probably not even the artist."] }, fx: { happy: 5, karma: -2 } },
        ],
      },
      {
        label: { fr: 'Poser plein de questions', en: 'Ask loads of questions' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai posé [[douze|vingt|trente]] questions. Le guide a fini par me donner son badge et me laisser finir la visite à sa place. J'ai inventé la moitié des réponses.", "J'ai demandé si les momies faisaient caca. Le guide a répondu avec un sérieux absolu pendant dix minutes. J'ai tout retenu."], en: ["I asked [[twelve|twenty|thirty]] questions. The guide eventually gave me his badge and let me finish the tour. I made up half the answers.", "I asked if mummies pooped. The guide answered with total seriousness for ten minutes. I remembered all of it."] }, fx: { smarts: 4, grade: 2 } },
        ],
      },
      {
        label: { fr: 'Filer à la boutique', en: 'Sneak to the gift shop' },
        out: [
          { w: 2, text: { fr: ["J'ai fui vers la boutique et dépensé tout mon argent de poche dans une gomme en forme de pharaon. On m'a cherché{|e} pendant vingt minutes.", "Je me suis caché{|e} dans la boutique. Les accompagnateurs m'ont retrouvé{|e} en train de lire un livre sur {w:animal}. Punition douce."], en: ["I fled to the shop and spent all my pocket money on a pharaoh-shaped eraser. They searched for me for twenty minutes.", "I hid in the gift shop. The chaperones found me reading a book about {w:animal}. Gentle punishment."] }, fx: { happy: 3, discipline: -2 } },
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
          { w: 2, text: { fr: ["On a joué au pendu sur la vitre embuée pendant tout le trajet. {a.first} est devenu{a:|e} mon pote. Le car est un formidable accélérateur d'amitié.", "{a.first} m'a raconté toute sa vie, y compris le jour où {a:il|elle} a vu {w:animal} manger {w:food}. J'ai un nouvel ami."], en: ["We played hangman on the fogged-up window the whole way. {a.first} became my buddy. The bus is an incredible friendship accelerator.", "{a.first} told me their whole life story, including the day they saw {w:animal} eat {w:food}. I have a new friend."] }, fx: { happy: 4, rel: 15, actorRole: 'friend' } },
          { w: 1, rating: 1, text: { fr: ["{a.first} a vomi au deuxième rond-point. Pas dans le sachet. J'ai fait la sortie avec un pantalon prêté par le chauffeur. Il fait du XXL.", "{a.first} a mangé tous les bonbons, puis a vomi un arc-en-ciel sur mes chaussures. On ne sera jamais amis, mais on a vécu quelque chose."], en: ["{a.first} threw up at the second roundabout. Not in the bag. I spent the trip in pants borrowed from the driver. He's an XXL.", "{a.first} ate all the candy, then puked a rainbow on my shoes. We'll never be friends, but we went through something."] }, fx: { happy: -4, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Prendre le fond du car', en: 'Take the back seats' },
        out: [
          { w: 2, text: { fr: ["On a pris les places du fond. Les grands ont protesté, puis respecté. J'ai chanté {w:song} à pleins poumons pendant tout le trajet. Gloire.", "On a squatté le fond du car. Chaque dos-d'âne nous a fait décoller de dix centimètres. Le meilleur manège du monde, et gratuit."], en: ["We took the back seats. The big kids protested, then showed respect. I sang {w:song} at the top of my lungs the whole way. Glory.", "We camped at the back of the bus. Every speed bump launched us four inches. Best ride in the world, and free."] }, fx: { happy: 5, discipline: -2 } },
          { w: 1, text: { fr: ["Les grands nous ont expulsés en deux secondes. J'ai fini à côté de la maîtresse, qui m'a parlé de sa sciatique pendant une heure.", "Le chauffeur a stoppé le car sur la bande d'arrêt d'urgence pour nous renvoyer à l'avant. Humiliation publique, sous les klaxons."], en: ["The big kids kicked us out in two seconds. I ended up next to the teacher, who told me about her sciatica for an hour.", "The driver pulled onto the hard shoulder to send us to the front. Public humiliation, with honking."] }, fx: { happy: -3, discipline: 1 } },
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
          { w: 2, text: { fr: ["J'ai improvisé un grand écart, une roulade et un salut militaire. Le public a hurlé. La maîtresse a eu un tic à l'œil.", "J'ai dansé n'importe comment avec une conviction totale. Les parents ont cru que c'était prévu. Un papa m'a demandé où je prenais des cours."], en: ["I improvised a split, a forward roll and a military salute. The crowd went wild. The teacher's eye twitched.", "I danced like a maniac with total conviction. The parents thought it was choreographed. A dad asked where I take lessons."] }, fx: { happy: 6, athletic: 2, looks: 1 } },
          { w: 1, text: { fr: ["J'ai improvisé une glissade sur les genoux et j'ai fini dans le décor. Le soleil en carton est tombé sur la tête d'un camarade. C'est sur toutes les vidéos.", "Mon improvisation a entraîné toute la rangée. La chorégraphie a dégénéré en pogo. Le directeur a coupé la musique."], en: ["I improvised a knee slide and crashed into the set. The cardboard sun fell on a classmate's head. It's on every video.", "My improv dragged the whole row along. The routine turned into a mosh pit. The principal cut the music."] }, fx: { happy: 3, discipline: -2 } },
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
          { w: 2, odds: { smarts: 1, athletic: 1 }, text: { fr: ["J'ai rallié les CP, les CE1 et un CM2 déserteur. On a pris la cage à poules à l'assaut. {a.first} a été destitué{a:|e}. J'ai instauré la démocratie et un goûter partagé.", "Révolution réussie. La cage à poules est désormais publique. Les historiens de la récré parleront de « la Libération de mardi »."], en: ["I rallied the first-graders, the second-graders and a fifth-grade deserter. We stormed the climbing frame. {a.first} was overthrown. I established democracy and shared snacks.", "Revolution successful. The climbing frame is now public. Recess historians will call it “the Tuesday Liberation”."] }, fx: { happy: 6, karma: 3, rel: -15 } },
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
          { w: 2, text: { fr: ["J'ai fondé le royaume du banc près des toilettes. Population : trois sujets et une fourmi. On a nos propres lois. Pas de rois. Sauf moi.", "J'ai proclamé l'indépendance du coin du préau. On a un drapeau : {w:object} accroché à un bâton. C'est un État fragile mais fier."], en: ["I founded the kingdom of the bench near the toilets. Population: three subjects and an ant. We have our own laws. No kings. Except me.", "I declared independence for the corner of the covered yard. We have a flag: {w:object} on a stick. A fragile but proud nation."] }, fx: { happy: 4, smarts: 2 } },
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
          { w: 2, text: { fr: ["On a écrit un serment sur une feuille, signé avec du jus de mûre et enterré sous un arbre. Personne ne le retrouvera. Nous non plus.", "Notre serment fait onze pages et interdit les brocolis. {a.first} a pleuré en le lisant. C'est ça, l'amitié."], en: ["We wrote an oath on a sheet of paper, signed it in blackberry juice and buried it under a tree. Nobody will ever find it. Neither will we.", "Our oath is eleven pages long and bans broccoli. {a.first} cried reading it. That's friendship."] }, fx: { happy: 5, rel: 15 } },
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
          { w: 2, text: { fr: ["J'ai ajouté que le maître avait un tatouage de dragon et un casier judiciaire. À midi, toute l'école le savait. À 14 h, le maître le savait aussi.", "J'ai raconté que la maîtresse parlait aux pigeons. Le lendemain, elle a nourri un pigeon devant la classe. Coïncidence ? La rumeur est devenue vérité."], en: ["I added that the teacher had a dragon tattoo and a criminal record. By lunch the whole school knew. By 2 p.m., so did the teacher.", "I said the teacher talks to pigeons. The next day she fed a pigeon in front of the class. Coincidence? The rumor became truth."] }, fx: { happy: 4, karma: -3, grade: -2 } },
          { w: 1, text: { fr: ["Le maître a convoqué « l'auteur de la rumeur ». Toute la classe m'a regardé{|e}. J'ai écrit cent fois « je ne colporte pas de ragots ». J'ai colporté pendant l'écriture.", "La rumeur est arrivée aux oreilles des parents. Ma mère m'a demandé si c'était vrai. J'ai dit oui. Elle a dit « je m'en doutais ». Ça empire."], en: ["The teacher summoned “the author of the rumor”. The whole class looked at me. I wrote “I do not spread gossip” a hundred times. I gossiped while writing.", "The rumor reached the parents. My mom asked if it was true. I said yes. She said “I knew it”. It's getting worse."] }, fx: { happy: -3, discipline: 2, grade: -2 } },
        ],
      },
      {
        label: { fr: 'Mener l\'enquête', en: 'Investigate' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai monté une enquête avec loupe et carnet. Conclusion : la maîtresse est juste une personne normale. La vérité est décevante.", "J'ai ouvert le placard à craies. Il y avait un sac de couchage. Et {w:object}. Je n'en ai parlé à personne. Certains secrets sont trop lourds."], en: ["I ran an investigation with a magnifying glass and a notebook. Conclusion: the teacher is just a normal person. The truth is disappointing.", "I opened the chalk cupboard. There was a sleeping bag. And {w:object}. I told no one. Some secrets are too heavy."] }, fx: { smarts: 3, happy: 2 } },
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
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai scotché trois stylos ensemble. Trois lignes à la fois. J'ai fini en vingt minutes. Je suis un{|e} ingénieur{|e} de la flemme.", "Le système à trois stylos a marché, mais les lignes penchent comme une colline. Le maître a dit « astucieux » sans sourire. Il était impressionné."], en: ["I taped three pens together. Three lines at once. Done in twenty minutes. I'm an engineer of laziness.", "The three-pen rig worked, but the lines slope like a hill. The teacher said “clever” without smiling. He was impressed."] }, fx: { smarts: 3, happy: 3 } },
          { w: 1, text: { fr: ["Le maître a reconnu la technique des trois stylos. Il m'a donné deux cents lignes de plus, à faire avec un seul stylo, devant lui.", "Les stylos se sont décalés. Mes lignes disent « Je ne dois pas lancer de gomme » en escalier. Le maître a eu mal au cou."], en: ["The teacher recognized the three-pen trick. He gave me two hundred more lines, to be done with one pen, in front of him.", "The pens slipped. My lines say “I must not throw erasers” in a staircase. The teacher got a stiff neck."] }, fx: { happy: -4, discipline: 2 } },
        ],
      },
      {
        label: { fr: 'Faire faire par un frangin', en: 'Get a sibling to do it' },
        if: { has: 'sibling' },
        out: [
          { w: 2, text: { fr: ["J'ai payé un membre de ma fratrie avec mon dessert de toute la semaine. Son écriture ressemble à des pattes de mouche. Le maître n'a rien vu. Ou a fait semblant.", "J'ai sous-traité les lignes. On m'a fait payer en corvées de vaisselle pour un mois. L'économie familiale est brutale."], en: ["I paid my sibling with my dessert for the whole week. Their handwriting looks like spider legs. The teacher didn't notice. Or pretended.", "I outsourced the lines. Payment: a month of dish duty. The family economy is brutal."] }, fx: { happy: 2, karma: -2 } },
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
          { w: 2, text: { fr: ["J'ai écrit que j'habitais dans un château avec {w:animal} comme animal de compagnie et que mon père était {w:weird_job}. Mon correspondant m'a cru{|e}. Je dois maintenant tenir le mensonge à vie.", "J'ai raconté que je connaissais {w:celeb}. La réponse est arrivée trois semaines plus tard : « Moi aussi. » On ment tous les deux. C'est une belle amitié."], en: ["I wrote that I live in a castle with {w:animal} as a pet and that my dad is {w:weird_job}. My pen pal believed it. Now I have to keep the lie going forever.", "I said I knew {w:celeb}. The reply came three weeks later: “Me too.” We're both lying. It's a beautiful friendship."] }, fx: { happy: 4, karma: -1, smarts: 1 } },
        ],
      },
      {
        label: { fr: 'Raconter la vérité', en: 'Tell the truth' },
        out: [
          { w: 2, text: { fr: ["J'ai raconté ma vraie vie, avec la cantine et la boulangerie. Ma correspondante a trouvé ça « exotique ». Tout est relatif.", "J'ai décrit ma ville en détail. Mon correspondant veut venir la visiter. Il pense que c'est une capitale mondiale. Je n'ai pas eu le cœur de le contredire."], en: ["I described my real life, canteen and bakery included. My pen pal found it “exotic”. Everything is relative.", "I described my town in detail. My pen pal wants to visit. He thinks it's a world capital. I didn't have the heart to correct him."] }, fx: { happy: 3, smarts: 3, karma: 2, grade: 2 } },
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
          { w: 2, text: { fr: ["J'ai levé la main : « C'est moi, et je n'ai pas honte. » Applaudissements nourris. Le maître a ouvert les fenêtres en riant malgré lui.", "J'ai assumé en saluant. On m'appelle « le Tonnerre » depuis. C'est le meilleur surnom que j'aurai de ma vie."], en: ["I raised my hand: “It was me, and I'm not ashamed.” Thunderous applause. The teacher opened the windows, laughing despite himself.", "I owned it with a bow. They've called me “Thunder” ever since. It's the best nickname I'll ever have."] }, fx: { happy: 5, karma: 2, discipline: -2 } },
        ],
      },
      {
        label: { fr: 'Serrer les fesses', en: 'Clench and pray' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai serré les fesses pendant deux heures. Je suis sorti{|e} de classe avec le visage violet et une crampe dans {w:bodypart}. Mais personne ne saura jamais.", "J'ai tenu jusqu'à la récré. Je suis allé{|e} relâcher la pression derrière le préau, {w:weather}. Soulagement d'une intensité rare."], en: ["I clenched for two hours. I left class purple-faced with a cramp in my {w:bodypart}. But nobody will ever know.", "I held it until recess. I released the pressure behind the covered yard, {w:weather}. A relief of rare intensity."] }, fx: { discipline: 3, health: -1 } },
          { w: 1, text: { fr: ["J'ai serré. Ça a fait {w:sound}, en pire, comme un ballon qui se dégonfle. Toute la classe a éclaté de rire. Le maître aussi.", "J'ai lutté héroïquement. J'ai perdu. Le bruit a résonné dans la salle comme un trombone. Même le hamster de la classe s'est retourné."], en: ["I clenched. It came out as {w:sound}, but worse, like a deflating balloon. The whole class burst out laughing. So did the teacher.", "I fought heroically. I lost. The sound echoed through the room like a trombone. Even the class hamster turned around."] }, fx: { happy: -5, looks: -2 } },
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
          { w: 2, odds: { looks: 1 }, text: { fr: ["Je me suis tordu{|e} de douleur comme dans {w:movie}. L'infirmière a appelé mes parents. J'ai passé l'après-midi sur le canapé avec {w:show}. Je mérite un César.", "J'ai gémi, transpiré, et dit « je vois des étoiles ». L'infirmière m'a gardé{|e} toute la matinée avec une bouillotte. Le contrôle s'est fait sans moi."], en: ["I writhed in pain like in {w:movie}. The nurse called my parents. I spent the afternoon on the couch with {w:show}. I deserve an Oscar.", "I moaned, sweated and said “I'm seeing stars”. The nurse kept me all morning with a hot water bottle. The test happened without me."] }, fx: { happy: 5, karma: -2, grade: -1 } },
          { w: 1, text: { fr: ["L'infirmière a pris ma température : 37,0. Elle m'a regardé{|e} longuement et m'a dit « retourne en classe, petit{|e} comédien{|ne} ». Elle en a vu d'autres.", "J'en ai trop fait. On a appelé ma mère, qui est venue me chercher, inquiète. À la maison, elle a compris. J'ai rangé le garage tout l'après-midi."], en: ["The nurse took my temperature: 98.6. She looked at me for a long time and said “back to class, little actor”. She's seen it all.", "I overdid it. They called my mom, who came to get me, worried. At home she figured it out. I cleaned the garage all afternoon."] }, fx: { happy: -3, discipline: 2 } },
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
          { w: 1, text: { fr: ["Je me suis porté{|e} volontaire pour accompagner un camarade qui saignait du nez. On a fait le trajet en vingt-cinq minutes. Le couloir fait cinquante mètres.", "J'ai escorté un camarade à l'infirmerie. On a fait un détour par la cour, les toilettes et le distributeur d'eau. Mission humanitaire accomplie."], en: ["I volunteered to escort a classmate with a nosebleed. The trip took twenty-five minutes. The hallway is fifty meters long.", "I escorted a classmate to the nurse. We took a detour via the playground, the toilets and the water fountain. Humanitarian mission complete."] }, fx: { happy: 3, karma: 1 } },
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
          { w: 2, text: { fr: ["Bataille d'oreillers épique à minuit. Un oreiller s'est éventré. Il y avait des plumes jusque dans le petit-déjeuner. Meilleure nuit de ma vie.", "On a combattu chambre contre chambre. J'ai été sacré{|e} « {w:nickname} », roi ou reine de l'étage. Les monos nous ont fait ranger jusqu'à 2 h."], en: ["Epic midnight pillow fight. A pillow burst. There were feathers in the breakfast. Best night of my life.", "We fought room against room. I was crowned “{w:nickname}”, ruler of the floor. The counselors made us tidy up until 2 a.m."] }, fx: { happy: 7, discipline: -2 } },
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
          { w: 2, text: { fr: ["On est sortis à minuit avec une lampe de poche pour chercher le monstre des bois. On a trouvé {w:animal}, qui a eu plus peur que nous. On a tous crié.", "Expédition nocturne réussie : on a volé les biscuits de la cuisine du centre. J'ai l'impression d'avoir braqué une banque."], en: ["We snuck out at midnight with a flashlight to look for the forest monster. We found {w:animal}, which was more scared than us. Everyone screamed.", "Night expedition successful: we raided the camp kitchen's cookies. I feel like I robbed a bank."] }, fx: { happy: 6, discipline: -3 } },
          { w: 1, text: { fr: ["Un mono nous a attrapés dans le couloir. On a passé une heure assis sur un banc, en pyjama, à réfléchir à nos actes. J'ai surtout réfléchi aux biscuits.", "On s'est perdus dans le centre. On a dormi dans la salle de ping-pong. Personne ne nous a cherchés. C'est vexant."], en: ["A counselor caught us in the hallway. We spent an hour on a bench in our pajamas, thinking about our actions. Mostly I thought about cookies.", "We got lost in the building. We slept in the ping-pong room. Nobody came looking for us. That's insulting."] }, fx: { happy: -1, discipline: 2 } },
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
        "{a.first} a la carte la plus rare de la cour, brillante et holographique. {a.he} te la propose contre {w:object} et une promesse.",
        "La cour est devenue une bourse aux cartes à collectionner. {a.first} te propose un « crédit » : tu prends ses cartes maintenant, tu paies plus tard.",
        "Tu as dépensé tout ton argent de poche en pochettes d'autocollants. Résultat : [[17|23|41]] fois le même joueur. {a.first} t'observe avec un sourire de banquier.",
      ],
      en: [
        "Everyone's filling the World Cup sticker album. You're only missing Paraguay's goalkeeper. {a.first} has a spare.",
        "{a.first} has the rarest card in the playground, shiny and holographic. {a.he} offers it to you for {w:object} and a promise.",
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
          { w: 2, odds: { smarts: 1 }, text: { fr: ["Après vingt minutes de négociation, j'ai obtenu le gardien du Paraguay contre trois doubles et {w:object}. Je me suis senti{|e} comme un ministre.", "Échange réussi. {a.first} et moi avons serré la main comme deux hommes d'affaires. On est potes maintenant, liés par le gardien du Paraguay."], en: ["After twenty minutes of haggling, I got Paraguay's goalkeeper for three doubles and {w:object}. I felt like a cabinet minister.", "Trade complete. {a.first} and I shook hands like businessmen. We're buddies now, bound by Paraguay's goalkeeper."] }, fx: { happy: 5, smarts: 2, rel: 10 } },
          { w: 1, text: { fr: ["J'ai échangé ma plus belle carte contre celle de {a.first}. Elle était fausse, dessinée au feutre. Je me suis fait avoir comme un bleu.", "On a fait l'échange, puis {a.first} a voulu annuler. Dispute, larmes, intervention du surveillant. Toutes les cartes ont été confisquées."], en: ["I traded my best card for {a.first}'s. It was fake, drawn in marker. I got played like a rookie.", "We traded, then {a.first} wanted to cancel. Argument, tears, the supervisor stepped in. All cards confiscated."] }, fx: { happy: -4, rel: -10 } },
        ],
      },
      {
        label: { fr: 'Abandonner la collection', en: 'Quit collecting' },
        out: [
          { w: 1, text: { fr: ["J'ai jeté l'album dans un tiroir. Il y est toujours. Il ne manque que le gardien du Paraguay. Ça me hante parfois la nuit.", "J'ai tout revendu à {a.first} pour une poignée de bonbons. J'ai mangé les bonbons. Il ne me reste rien. Philosophie."], en: ["I threw the album in a drawer. It's still there. Only Paraguay's goalkeeper is missing. It haunts me some nights.", "I sold everything to {a.first} for a handful of candy. I ate the candy. I have nothing left. Philosophy."] }, fx: { happy: -1, smarts: 1 } },
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
        "Un an a passé. {a.first} n'a pas oublié. {a.he} t'explique calmement que les intérêts courent et que ton goûter appartient désormais à « l'organisation ».",
        "{a.first} a mis ta tête sur une affiche dans les toilettes : « MAUVAIS PAYEUR ». En dessous, quelqu'un a dessiné {w:animal}.",
        "Tu reçois un mot plié en huit dans ta trousse : « Tu dois des cartes. On sait où tu habites. On a vu {w:animal} près de chez toi. »",
      ],
      en: [
        "{a.first} is waiting for you after school with the black notebook and two beefy fifth-graders. Your sticker debt has grown from ten to [[forty|sixty|a hundred]] cards.",
        "A year has passed. {a.first} hasn't forgotten. {a.he} calmly explains that interest is accruing and your snack now belongs to “the organization”.",
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
          { w: 1, text: { fr: ["Les deux CM2 m'ont fait un « pneu » dans le dos et confisqué ma trousse. Je l'ai récupérée vide, à part une gomme mâchée. J'ai payé.", "On s'est bagarrés derrière le gymnase. J'ai fini avec une écorchure au genou et l'honneur sauf. La dette, elle, est toujours là."], en: ["The two fifth-graders gave me a wedgie and took my pencil case. I got it back empty except for a chewed eraser. I paid.", "We scuffled behind the gym. I ended up with a scraped knee and my honor intact. The debt is still there, though."] }, fx: { happy: -5, health: -2, unflag: 'k2_sticker_debt' } },
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
          { w: 3, text: { fr: ["J'ai présenté {a.first} à tout le monde et je lui ai montré les toilettes qui ferment à clé. C'est la base de toute amitié. On est inséparables.", "J'ai partagé mon goûter avec {a.first}. En échange, {a:il|elle} m'a appris un jeu de cartes qu'on joue {w:far_place}. On est devenus les meilleurs amis du monde."], en: ["I introduced {a.first} to everyone and showed them the toilet stall that actually locks. The foundation of any friendship. We're inseparable.", "I shared my snack with {a.first}. In return, they taught me a card game they play {w:far_place}. We became best friends."] }, fx: { happy: 5, karma: 3, rel: 20, actorRole: 'friend' } },
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
          { w: 1, text: { fr: ["J'ai fait comme si {a.first} n'existait pas. Trois mois plus tard, {a:il|elle} était l'élève la plus populaire de l'école. J'ai misé sur le mauvais cheval.", "J'ai ignoré {a.first}. Le soir, j'ai eu un petit pincement au cœur. Ma conscience s'est exprimée sous la forme d'un mal de ventre."], en: ["I acted like {a.first} didn't exist. Three months later they were the most popular kid in school. I bet on the wrong horse.", "I ignored {a.first}. That evening I felt a little pang. My conscience spoke up in the form of a stomachache."] }, fx: { karma: -3, happy: -1 } },
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
          { w: 1, text: { fr: ["La signature était parfaite. Personne n'a rien vu. J'ai un talent dangereux. Je le garde pour plus tard.", "J'ai signé, la maîtresse a validé. Mais je n'arrive plus à regarder {a.my} dans les yeux. La culpabilité me ronge comme un hamster."], en: ["The signature was perfect. Nobody noticed. I have a dangerous talent. I'm saving it for later.", "I signed, the teacher accepted it. But I can't look {a.my} in the eye anymore. Guilt is gnawing at me like a hamster."] }, fx: { happy: 2, karma: -4, smarts: 2 } },
        ],
      },
      {
        label: { fr: 'Choisir le bon moment', en: 'Pick the perfect moment' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai attendu que {a.my} regarde {w:show}, captivé{a:|e}. J'ai glissé la feuille avec un stylo. Signé{a:|e} sans lire. Je suis un{|e} stratège.", "J'ai présenté la copie au moment où {a.my} était au téléphone avec mamie. Signature distraite, aucune question. Le timing, c'est tout."], en: ["I waited until {a.my} was glued to {w:show}. I slipped over the paper and a pen. Signed without reading. I'm a strategist.", "I handed over the test while {a.my} was on the phone with grandma. Distracted signature, no questions. Timing is everything."] }, fx: { happy: 3, smarts: 2, karma: -1 } },
          { w: 1, text: { fr: ["{a.my} a signé, puis s'est arrêté{a:|e}, a relu, et a dit mon prénom en entier. Avec le deuxième prénom. C'était la fin.", "Mauvais timing : {a.my} venait de marcher sur une pièce de Lego. La note et la douleur se sont additionnées. Explosion."], en: ["{a.my} signed, then stopped, reread it, and said my full name. Middle name included. It was over.", "Bad timing: {a.my} had just stepped on a Lego. The grade and the pain added up. Explosion."] }, fx: { happy: -4, rel: -5 } },
        ],
      },
      {
        label: { fr: 'Tout avouer', en: 'Come clean' },
        out: [
          { w: 2, text: { fr: ["J'ai tout avoué, en pleurant. {a.my} a signé en soupirant, puis m'a raconté son propre 2/20 en CM1. On a ri. On a révisé. On a mangé des crêpes.", "J'ai avoué. {a.my} a dit qu'{a.he} était déçu{a:|e}, ce qui est pire qu'une punition. Puis {a.he} m'a aidé{|e} à comprendre. C'était presque agréable."], en: ["I confessed everything, in tears. {a.my} signed with a sigh, then told me about their own 2/20 back in the day. We laughed. We studied. We ate crêpes.", "I confessed. {a.my} said {a.he} was disappointed, which is worse than any punishment. Then {a.he} helped me understand. It was almost nice."] }, fx: { happy: 1, karma: 3, smarts: 2, rel: 10 } },
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
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai prévenu {a.my} que la maîtresse « exagère toujours » et « n'aime pas les enfants créatifs ». {a:Il|Elle} est entré{a:|e} en mode défense. La réunion a tourné au procès. J'ai gagné.", "J'ai rangé ma chambre, mis la table et fait un dessin avant la réunion. {a.my} est revenu{a:|e} en disant « bon, c'est pas si grave ». Le lobbying fonctionne."], en: ["I warned {a.my} that the teacher “always exaggerates” and “doesn't like creative kids”. They went in on the defensive. The meeting became a trial. I won.", "I cleaned my room, set the table and drew a picture before the meeting. {a.my} came back saying “well, it's not that bad”. Lobbying works."] }, fx: { happy: 4, karma: -1, rel: 5 } },
        ],
      },
      {
        label: { fr: 'Prier très fort', en: 'Pray very hard' },
        out: [
          { w: 1, text: { fr: ["La réunion a duré quarante minutes. {a.my} est sorti{a:|e} en disant juste « on en parlera à la maison ». Le trajet a été le plus long de ma vie.", "{a.my} est ressorti{a:|e} en riant. La maîtresse lui avait raconté ma théorie selon laquelle {w:conspiracy}. Je suis devenu{|e} une anecdote de dîner."], en: ["The meeting lasted forty minutes. {a.my} came out saying only “we'll talk about it at home”. Longest car ride of my life.", "{a.my} came out laughing. The teacher had told them my theory {w:conspiracy}. I've become a dinner-party anecdote."] }, fx: { happy: -2, rel: 5 } },
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
        "Repas de famille chez les voisins. Tu te souviens soudain que {a.rel} a dit dans la voiture que leur cuisine avait « le goût de {w:smell} ». Le dessert arrive.",
        "Dîner chic avec des invités. Tu viens de découvrir une question fondamentale : pourquoi la dame en face a {w:object} sur la tête ?",
      ],
      en: [
        "Dinner with {a.rel}'s coworkers. There's a lull. You have a burning question ever since you heard {a.rel} call one of them “{w:insult}”.",
        "{a.rel}'s boss is coming for dinner. He has an enormous nose. You've been staring since he walked in. Everyone is praying you stay quiet.",
        "Family meal at the neighbors'. You suddenly remember {a.rel} saying in the car that their cooking tastes like {w:smell}. Dessert arrives.",
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
          { w: 1, text: { fr: ["J'ai serré les lèvres pendant tout le dîner. J'ai posé la question dans la voiture, au retour. {a.my} m'a remercié{|e} d'avoir attendu. Une première.", "J'ai tenu jusqu'au dessert, puis j'ai demandé s'il restait {w:food}. Diversion parfaite. {a.my} m'a fait un clin d'œil reconnaissant."], en: ["I kept my lips sealed all dinner. I asked my question in the car on the way home. {a.my} thanked me for waiting. A first.", "I held out until dessert, then asked if there was any {w:food} left. Perfect diversion. {a.my} gave me a grateful wink."] }, fx: { discipline: 4, rel: 10 } },
        ],
      },
      {
        label: { fr: 'Le dire à l\'oreille de l\'invité', en: 'Whisper it to the guest' },
        out: [
          { w: 1, text: { fr: ["J'ai chuchoté dans l'oreille de l'invité. Il a hoché la tête, sérieux, et m'a glissé un billet de 5 « pour mon silence ». J'ai trouvé un métier.", "J'ai chuchoté, mais je ne sais pas chuchoter. Toute la table a entendu. Le chat lui-même a quitté la pièce."], en: ["I whispered in the guest's ear. He nodded gravely and slipped me five bucks “for my silence”. I've found my calling.", "I whispered, but I don't know how to whisper. The whole table heard. Even the cat left the room."] }, fx: { happy: 3, karma: -2 } },
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
          { w: 2, text: { fr: ["{a.my} a éclaté de rire et m'a promis {w:object} dans son testament. Je l'ai fait signer sur une serviette en papier. Juridiquement, c'est solide.", "{a.my} m'a répondu « pas avant d'avoir vu ton mariage, petite vipère ». On a mangé des biscuits. Les négociations reprendront."], en: ["{a.my} burst out laughing and promised me {w:object} in the will. I made them sign it on a paper napkin. Legally solid.", "{a.my} replied, “Not before I see you get married, you little viper.” We ate cookies. Negotiations will resume."] }, fx: { happy: 4, rel: 10 } },
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
          { w: 1, text: { fr: ["Mes parents ont fait remarquer que l'animal ne sait pas faire la roue. Ni jouer au foot. Ni utiliser le micro-ondes. Mon alibi s'est effondré.", "Pas de chance : la caméra de surveillance installée « pour le chat » a tout filmé. La vidéo a été diffusée au repas de famille. Avec ralenti."], en: ["My parents pointed out that the pet can't do cartwheels. Or play soccer. Or use a microwave. My alibi collapsed.", "Bad luck: the camera installed “for the cat” filmed everything. The video was shown at a family dinner. In slow motion."] }, fx: { happy: -4, discipline: 2 } },
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
          { w: 2, text: { fr: ["J'ai avoué dès que la porte s'est ouverte. Mes parents ont été tellement surpris par mon honnêteté qu'ils ont oublié de crier. Mamie a dit que le vase était moche, de toute façon.", "J'ai tout dit. Punition : privé{|e} de {w:show} pendant une semaine. Mais j'ai eu un câlin à la fin. C'est un bon deal."], en: ["I confessed the second the door opened. My parents were so surprised by my honesty they forgot to yell. Grandma said the vase was ugly anyway.", "I told them everything. Punishment: no {w:show} for a week. But I got a hug at the end. Good deal."] }, fx: { happy: -1, karma: 4, discipline: 2 } },
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
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai compté les voitures rouges, les camping-cars et les vaches. J'ai repéré {w:vehicle} et {w:animal} sur une aire d'autoroute. Meilleur trajet de ma vie.", "On a joué au jeu des plaques d'immatriculation. J'ai triché en inventant un département. {a.my} m'a laissé{|e} gagner pour avoir la paix."], en: ["I counted red cars, RVs and cows. I spotted {w:vehicle} and {w:animal} at a rest stop. Best drive of my life.", "We played the license plate game. I cheated by inventing a state. {a.my} let me win for some peace."] }, fx: { happy: 4, smarts: 2, rel: 5 } },
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
          { w: 3, text: { fr: ["On a passé toutes les vacances ensemble. On a juré de s'écrire. On ne s'est jamais écrit. Mais c'était le meilleur été du monde.", "Avec {a.first}, on a construit la plus grande cabane du camping, avec {w:object} comme porte. Le dernier jour, on a pleuré comme des veaux."], en: ["We spent the entire vacation together. We swore to write. We never wrote. But it was the best summer ever.", "{a.first} and I built the biggest hideout on the campsite, with {w:object} as a door. On the last day we both cried our eyes out."] }, fx: { happy: 7, athletic: 2, rel: 20 } },
          { w: 1, text: { fr: ["On a joué deux jours, puis la famille de {a.first} est partie {w:far_place} sans prévenir. Mon premier chagrin de vacances.", "On a fait la course. {a.first} a gagné, je suis tombé{|e} sur le gravier et je me suis écorché le genou. J'ai quand même eu la moitié de {w:food}."], en: ["We played for two days, then {a.first}'s family left for {w:far_place} without warning. My first vacation heartbreak.", "We raced. {a.first} won, I fell on the gravel and scraped my knee. I still got half the {w:food}."] }, fx: { happy: 1, health: -1 } },
        ],
      },
      {
        label: { fr: 'Rester avec les parents', en: 'Stay with your parents' },
        out: [
          { w: 1, text: { fr: ["Je suis resté{|e} avec mes parents à la plage. Ils ont lu toute la journée. J'ai enterré mon père jusqu'au cou. Il s'est endormi. J'ai eu peur.", "J'ai passé l'après-midi sous le parasol à regarder les autres enfants s'amuser. Mes parents m'ont demandé si ça allait. J'ai mangé {w:food} en silence."], en: ["I stayed at the beach with my parents. They read all day. I buried my dad up to his neck. He fell asleep. I got scared.", "I spent the afternoon under the umbrella watching the other kids have fun. My parents asked if I was okay. I ate {w:food} in silence."] }, fx: { happy: -1, health: 1 } },
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
          { w: 1, text: { fr: ["J'ai regardé depuis le snack, avec une glace à l'eau. J'ai vu un grand-père faire le grand écart. Je ne m'en remettrai pas.", "Je suis resté{|e} assis{|e} avec un jus de pomme, en observant les adultes danser. C'était un documentaire animalier, mais avec des tongs."], en: ["I watched from the snack bar with an ice pop. I saw a grandpa do the splits. I'll never recover.", "I sat with an apple juice watching the grown-ups dance. It was a nature documentary, but with flip-flops."] }, fx: { happy: 2, smarts: 1 } },
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
          { w: 2, text: { fr: ["J'ai accepté la punition sans rien dire. Puis j'ai caché {w:object} dans le lit de {a.first}. {a:Il|Elle} a hurlé à minuit. Le karma, c'est moi.", "J'ai attendu trois semaines. Puis j'ai remplacé le dentifrice de {a.first} par de la mayonnaise. La vengeance est un plat qui se mange à la menthe."], en: ["I took the punishment without a word. Then I hid {w:object} in {a.first}'s bed. Screams at midnight. I am karma.", "I waited three weeks. Then I swapped {a.first}'s toothpaste for mayonnaise. Revenge is a dish best served minty."] }, fx: { happy: 5, karma: -2, rel: -10 } },
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
          { w: 2, text: { fr: ["J'ai appris le mot. Je l'ai testé au dîner, devant mamie. Mamie a renversé sa soupe. Puis elle a dit le même mot. La famille est une chaîne.", "J'ai ressorti le mot à l'école, devant la maîtresse. Elle a appelé mes parents. Mon père a demandé où je l'avais appris, avec un air de grande culpabilité."], en: ["I learned the word. I tried it at dinner in front of grandma. Grandma spilled her soup. Then she said the same word. Family is a chain.", "I used the word at school in front of the teacher. She called my parents. My dad asked where I'd learned it, looking extremely guilty."] }, fx: { happy: 4, discipline: -3, karma: -1 } },
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
          { w: 1, text: { fr: ["En échange, j'ai appris à {a.first} le mot que mon père dit quand il marche sur un Lego. Échange culturel réussi. Nos deux familles sont en danger.", "On a inventé des gros mots ensemble. Le meilleur est « {w:insult} ». Il est désormais officiel dans toute la famille."], en: ["In return I taught {a.first} the word my dad says when he steps on a Lego. Successful cultural exchange. Both our families are in danger.", "We invented swear words together. The best one is “{w:insult}”. It's now official across the whole family."] }, fx: { happy: 5, rel: 15, keep: true } },
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
        "{a.rel} sort une pièce de ton oreille. Puis de ton nez. Puis de {w:object}. Tu commences à te demander combien d'argent tu as dans la tête.",
        "{a.rel} te glisse un billet dans la main en chuchotant « ne le dis pas à tes parents ». C'est la quatrième fois aujourd'hui.",
        "{a.rel} prétend avoir appris la magie {w:far_place} pendant sa jeunesse. {a:Il|Elle} va faire disparaître ton goûter.",
        "{a.rel} te propose un tour de magie : faire disparaître un bonbon et le faire réapparaître {w:at_place}. Ça sent l'arnaque, mais tu es {curieux|curieuse}.",
      ],
      en: [
        "{a.rel} pulls a coin out of your ear. Then your nose. Then out of {w:object}. You're starting to wonder how much money is in your head.",
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
          { w: 2, text: { fr: ["J'ai empoché toutes les pièces. J'ai maintenant [[3,40|7,10|12]] dans ma tirelire. Je songe à prendre ma retraite.", "J'ai gardé l'argent et je me suis acheté {w:food} en cachette. C'était délicieux. Le secret, c'est meilleur que le sucre."], en: ["I pocketed every coin. I now have [[3.40|7.10|12]] in my piggy bank. I'm considering early retirement.", "I kept the money and secretly bought myself {w:food}. Delicious. Secrets taste better than sugar."] }, fx: { happy: 5, money: 5, rel: 5 } },
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
          { w: 2, text: { fr: ["Après deux heures, {a.my} sait envoyer des émojis. {a:Il|Elle} m'envoie désormais [[quarante|cent|deux cents]] cœurs par jour, et {w:animal} en photo floue.", "J'ai tout expliqué. Le lendemain, {a.my} avait rejoint {w:app} et commenté toutes les photos de la famille avec « BRAVO » en majuscules."], en: ["After two hours, {a.my} can send emojis. Now I get [[forty|a hundred|two hundred]] hearts a day, plus blurry photos of {w:animal}.", "I explained everything. The next day {a.my} had joined {w:app} and commented “WELL DONE” in caps on every family photo."] }, fx: { happy: 3, smarts: 2, karma: 2, rel: 15 } },
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
];
