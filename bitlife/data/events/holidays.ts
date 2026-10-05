// Holiday & celebration events: birthdays, Christmas, New Year, Halloween, Valentine's, Easter,
// Mother's/Father's Day, summer fêtes, other people's weddings, baptisms, funerals, office parties.
import type { EventDef } from '@bl/sim';

export const holidayEvents: EventDef[] = [
  // ───────────────────────────── birthdays: kids ─────────────────────────────
  {
    id: 'ho_kid_magician',
    icon: '🎩',
    cat: 'party',
    rating: 0,
    cooldown: 3,
    when: { age: [4, 9] },
    scene: { place: 'home', mood: 'happy', prop: 'cake' },
    text: {
      fr: [
        "Pour tes {age} ans, tes parents ont engagé un magicien. Il dégage {w:smell} et son lapin a l'air [[déprimé|épuisé|au bord des larmes]].",
        "Le magicien de ton anniversaire vient de faire disparaître la montre de ton père. Il ne sait pas la faire revenir. Ça fait vingt minutes.",
        "Ton goûter d'anniversaire : [[douze|quinze|neuf]] enfants, {w:food} et un magicien qui fume dans le jardin entre deux tours.",
        "Le magicien a sorti {w:object} de son chapeau au lieu d'un lapin. Les invités de ta fête le regardent avec mépris. Tu dois choisir ton camp.",
      ],
      en: [
        "For your {age}th birthday, your parents hired a magician. He gives off {w:smell} and his rabbit looks [[depressed|exhausted|on the verge of tears]].",
        "The birthday magician just made your dad's watch disappear. He can't make it come back. It's been twenty minutes.",
        "Your birthday party: [[twelve|fifteen|nine]] kids, {w:food} and a magician who smokes in the garden between tricks.",
        "The magician pulled {w:object} out of his hat instead of a rabbit. Your party guests stare at him with contempt. You must pick a side.",
      ],
    },
    choices: [
      {
        label: { fr: 'Être son assistant{|e}', en: 'Be his assistant' },
        out: [
          { w: 3, text: { fr: ["Il m'a « coupé{|e} en deux » dans un carton de déménagement. J'ai eu le droit de garder la baguette. Elle ne marche pas.", "J'ai tendu les foulards avec un sérieux de chirurgien. Tout le monde m'a applaudi{|e}, même le lapin."], en: ["He 'sawed me in half' inside a moving box. I got to keep the wand. It doesn't work.", "I handed him the scarves with the focus of a surgeon. Everyone clapped for me, even the rabbit."] }, fx: { happy: 8, looks: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["Le tour du verre d'eau a raté. J'ai passé le reste de ma fête trempé{|e}, en slip, devant mes invités.", "Il a voulu me faire léviter. J'ai lévité deux secondes, puis j'ai atterri sur {w:food}."], en: ["The glass-of-water trick failed. I spent the rest of my party soaked, in my underwear, in front of my guests.", "He tried to make me levitate. I levitated for two seconds, then landed on {w:food}."] }, fx: { happy: -4, stress: 4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Crier « C\'est truqué ! »', en: "Yell 'It's fake!'" },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai montré le double fond du chapeau à tout le monde. Le magicien est parti en pleurant et a oublié son lapin. On l'a gardé.", "J'ai démonté tous ses tours un par un. Il est reparti sans son lapin. Le lapin a eu l'air soulagé."], en: ["I showed everyone the hat's false bottom. The magician left in tears and forgot his rabbit. We kept it.", "I debunked every trick one by one. He left without his rabbit. The rabbit looked relieved."] }, fx: { smarts: 3, karma: -2, happy: 5, newNpc: { role: 'pet', species: 'rabbit' } }, mood: 'proud' },
          { w: 2, text: { fr: ["Il m'a regardé{|e} droit dans les yeux et a dit : « Toi, tu n'auras pas de part de gâteau. » Il a tenu parole.", "Ma mère m'a envoyé{|e} dans ma chambre pendant ma propre fête. J'ai entendu les applaudissements à travers la porte."], en: ["He looked me in the eye and said: 'No cake for you.' He kept his word.", "My mom sent me to my room during my own party. I heard the applause through the door."] }, fx: { happy: -5, smarts: 2 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Attaquer le gâteau', en: 'Go for the cake' },
        text: { fr: ["Pendant que tout le monde regardait le magicien, j'ai mangé la moitié du gâteau avec les mains. Meilleur tour de la journée.", "J'ai léché tout le glaçage avant qu'on souffle les bougies. Personne n'a voulu de gâteau. Il était à moi."], en: ["While everyone watched the magician, I ate half the cake with my hands. Best trick of the day.", "I licked off all the frosting before the candles. Nobody wanted cake after that. It was all mine."] },
        fx: { happy: 6, health: -1, weight: 0.02 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_kid_party_rsvp',
    icon: '🎈',
    cat: 'party',
    rating: 0,
    cooldown: 3,
    when: { age: [5, 11] },
    scene: { place: 'home', mood: 'sad', prop: 'cake' },
    text: {
      fr: [
        "Tu as invité toute ta classe à ton anniversaire. Il y a [[deux|trois]] enfants, dont un qui s'est trompé d'adresse.",
        "Ta fête d'anniversaire commence. Il y a vingt gobelets, vingt chapeaux pointus et {w:food}. Pour l'instant, il y a surtout toi.",
        "Ton meilleur copain a annulé ta fête au dernier moment, {w:excuse}. Ta mère a déjà gonflé quarante ballons.",
        "Pour tes {age} ans, un seul invité est venu : le petit voisin qui mange de la colle. Il t'a apporté {w:gift}.",
      ],
      en: [
        "You invited your whole class to your birthday. [[Two|Three]] kids showed up, one of whom got the wrong address.",
        "Your birthday party is starting. There are twenty cups, twenty party hats and {w:food}. So far, there's mostly you.",
        "Your best buddy canceled your party at the last minute, {w:excuse}. Your mom already blew up forty balloons.",
        "For your {age}th birthday, only one guest came: the neighbor kid who eats glue. He brought you {w:gift}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire la fête quand même', en: 'Party anyway' },
        out: [
          { w: 3, text: { fr: ["On était peu, mais on a mangé tout le gâteau et fait une bataille de ballons. Le meilleur anniversaire de ma vie, selon le petit voisin.", "On a joué à cache-cache à deux. J'ai gagné. Il est resté caché jusqu'à 20 h."], en: ["We were few, but we ate the whole cake and had a balloon fight. Best birthday ever, according to the neighbor kid.", "We played hide-and-seek, just the two of us. I won. He stayed hidden until 8 p.m."] }, fx: { happy: 6, karma: 2 }, mood: 'happy' },
          { w: 1, text: { fr: ["Le petit voisin a mangé la bougie. On a fini l'anniversaire au centre antipoison. Les infirmières m'ont chanté la chanson.", "Mon invité unique a pleuré parce que ce n'était pas son anniversaire. On a dû souffler les bougies deux fois."], en: ["The neighbor kid ate a candle. We finished the party at poison control. The nurses sang me the song.", "My only guest cried because it wasn't his birthday. We had to blow out the candles twice."] }, fx: { happy: -2, stress: 3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Pleurer dans sa chambre', en: 'Cry in your room' },
        text: { fr: ["J'ai pleuré dans mon oreiller. Ma mère a mangé le gâteau seule dans la cuisine. On n'en a plus jamais parlé.", "Je me suis enfermé{|e} avec mes cadeaux. Il y en avait un. C'était {w:gift}."], en: ["I cried into my pillow. My mom ate the cake alone in the kitchen. We never spoke of it again.", "I locked myself in with my presents. There was one. It was {w:gift}."] },
        fx: { happy: -8, stress: 5 },
        mood: 'cry',
      },
      {
        label: { fr: 'Noter les absents', en: 'Write down who skipped' },
        text: { fr: ["J'ai fait une liste noire avec les noms des absents. Je la garde encore. J'ai de la patience.", "J'ai noté chaque traître dans un carnet. À la récré, ils ont tous reçu une part de gâteau rassis en guise de menace."], en: ["I made a blacklist with the names of everyone who didn't come. I still have it. I'm patient.", "I wrote each traitor's name in a notebook. At recess, they each got a slice of stale cake as a warning."] },
        fx: { happy: 1, karma: -2, discipline: 3 },
        mood: 'angry',
      },
    ],
  },
  {
    id: 'ho_kid_candles',
    icon: '🕯️',
    cat: 'family',
    rating: 0,
    cooldown: 3,
    when: { age: [3, 8], has: 'sibling' },
    actor: 'sibling',
    scene: { place: 'home', mood: 'angry', prop: 'cake' },
    text: {
      fr: [
        "Au moment de souffler tes bougies, {a.rel} {a.first} se penche et souffle à ta place. Avec des postillons.",
        "Tout le monde chante pour toi. {a.first} chante plus fort, avec d'autres paroles, en dansant sur la table.",
        "{a.first} a planté son doigt dans ton gâteau d'anniversaire et l'a léché en te regardant dans les yeux.",
        "Pour ton anniversaire, {a.rel} a exigé d'avoir aussi un cadeau. Les parents ont cédé. {a:Il|Elle} a eu {w:gift}. Mieux que le tien.",
      ],
      en: [
        "Just as you're about to blow out your candles, {a.rel} {a.first} leans in and blows them out for you. With spit.",
        "Everyone is singing for you. {a.first} sings louder, with different lyrics, dancing on the table.",
        "{a.first} stuck a finger in your birthday cake and licked it while staring you down.",
        "For your birthday, {a.rel} demanded a present too. Your parents caved. {a:He|She} got {w:gift}. Better than yours.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le mordre', en: 'Bite' },
        out: [
          { w: 2, text: { fr: ["Je l'ai mordu{a:|e} au bras. {a.first} a hurlé. J'ai eu la plus grosse part, et une punition.", "Une morsure nette, au mollet. Justice a été rendue. Mon père a confisqué mes cadeaux, mais j'ai gardé ma dignité."], en: ["I bit {a.him} on the arm. {a.first} screamed. I got the biggest slice, and a time-out.", "A clean bite, right on the calf. Justice was served. Dad confiscated my presents, but I kept my dignity."] }, fx: { happy: 4, rel: -8, karma: -2 }, mood: 'angry' },
          { w: 1, text: { fr: ["J'ai raté le bras et mordu la nappe. Toute la vaisselle est tombée. Il a fallu ramasser le gâteau sur le carrelage.", "{a.first} a esquivé. J'ai mordu ma tante."], en: ["I missed the arm and bit the tablecloth. All the dishes fell. We had to scoop the cake off the floor.", "{a.first} dodged. I bit my aunt."] }, fx: { happy: -3, rel: -3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Pleurer très fort', en: 'Cry really loud' },
        text: { fr: ["J'ai pleuré si fort que les voisins ont frappé. On a rallumé les bougies rien que pour moi. Les larmes, ça marche.", "Mes hurlements ont fait fuir le chat. {a.first} a été privé{a:|e} de dessert. Victoire."], en: ["I cried so loud the neighbors knocked. They relit the candles just for me. Tears work.", "My wailing scared off the cat. {a.first} lost dessert privileges. Victory."] },
        fx: { happy: 3, rel: -3 },
        mood: 'cry',
      },
      {
        label: { fr: 'Partager le gâteau', en: 'Share the cake' },
        text: { fr: ["J'ai laissé {a.first} souffler la moitié des bougies. Mamie a dit que j'étais un ange. J'ai senti que ça se monnayerait plus tard.", "On a soufflé ensemble. Ça a mis de la crème partout. Meilleure photo de l'album."], en: ["I let {a.first} blow out half the candles. Grandma said I was an angel. I sensed I could cash that in later.", "We blew them out together. Frosting everywhere. Best photo in the album."] },
        fx: { happy: 3, rel: 8, karma: 3 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_kid_gift_auto',
    icon: '🎁',
    cat: 'family',
    rating: 0,
    auto: true,
    cooldown: 2,
    when: { age: [4, 11] },
    text: {
      fr: [
        "Pour mon anniversaire, mamie m'a offert {w:gift}. Je voulais une console. J'ai dit merci avec la bouche, pas avec les yeux.",
        "Mon parrain m'a offert {w:gift} pour mes {age} ans. Il pense que j'en ai [[trois|douze|quarante]].",
        "Mon gâteau d'anniversaire avait la forme d'{w:animal}… normalement. Il ressemblait surtout à {w:object}.",
        "À ma fête, j'ai reçu {w:gift}, une carte avec dix euros, et {w:gift} en double. J'ai fait un échange à la récré.",
      ],
      en: [
        "For my birthday, Grandma gave me {w:gift}. I wanted a console. I said thank you with my mouth, not with my eyes.",
        "My godfather gave me {w:gift} for my {age}th birthday. He thinks I'm [[three|twelve|forty]].",
        "My birthday cake was supposed to look like {w:animal}. It mostly looked like {w:object}.",
        "At my party I got {w:gift}, a card with ten bucks, and {w:gift} twice. I traded at recess.",
      ],
    },
    fx: { happy: 3 },
  },
  {
    id: 'ho_kid_pinata',
    icon: '🪅',
    cat: 'party',
    rating: 1,
    cooldown: 3,
    when: { age: [5, 11] },
    scene: { place: 'park', mood: 'party' },
    text: {
      fr: [
        "C'est ton tour à la piñata. On t'a bandé les yeux, fait tourner [[dix|quinze|vingt]] fois, et donné un bâton. Tout le monde est un peu trop près.",
        "La piñata de ton anniversaire a la forme d'{w:animal}. Elle résiste depuis vingt minutes. Ton oncle propose une batte de baseball.",
        "Les yeux bandés, le bâton à la main, tu entends {w:sound}. Quelque part devant toi, il y a la piñata. Ou un invité.",
        "La piñata est remplie de bonbons. D'après ton cousin, il y a aussi {w:food} dedans. Tu tiens le bâton. Le monde t'appartient.",
      ],
      en: [
        "It's your turn at the piñata. You're blindfolded, spun [[ten|fifteen|twenty]] times, and handed a stick. Everyone is standing a bit too close.",
        "Your birthday piñata is shaped like {w:animal}. It has resisted for twenty minutes. Your uncle suggests a baseball bat.",
        "Blindfolded, stick in hand, you hear {w:sound}. Somewhere ahead is the piñata. Or a guest.",
        "The piñata is full of candy. According to your cousin, there's also {w:food} inside. You hold the stick. The world is yours.",
      ],
    },
    choices: [
      {
        label: { fr: 'Frapper de toutes ses forces', en: 'Swing with all your might' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["Un coup parfait. La piñata a explosé, une pluie de bonbons s'est abattue sur la fête. J'ai été porté{|e} en triomphe.", "Crac ! La piñata s'est ouverte en deux. J'ai plongé sur les bonbons comme un rugbyman."], en: ["A perfect hit. The piñata burst and candy rained down on the party. They carried me in triumph.", "Crack! The piñata split in two. I dove onto the candy like a rugby player."] }, fx: { happy: 8, athletic: 2 }, mood: 'party' },
          { w: 2, text: { fr: ["J'ai frappé mon cousin en plein dans les genoux. Il est tombé en pleurant. Les bonbons sont restés dans la piñata, intacts.", "J'ai éclaté une fenêtre. Mon père a enlevé mon bandeau, et j'ai vu son visage. J'aurais préféré garder le bandeau."], en: ["I whacked my cousin right in the knees. He went down crying. The candy stayed in the piñata, untouched.", "I smashed a window. Dad took off my blindfold and I saw his face. I'd rather have kept the blindfold on."] }, fx: { happy: -3, karma: -3, money: -150 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Tricher en soulevant le bandeau', en: 'Peek under the blindfold' },
        text: { fr: ["J'ai triché. Un seul coup, piñata éventrée, bonbons à moi. Le crime paie, dès {age} ans.", "J'ai soulevé le bandeau et visé juste. Mon cousin a crié à la triche. Je l'ai fait taire avec une sucette."], en: ["I cheated. One hit, piñata gutted, candy mine. Crime pays, even at {age}.", "I lifted the blindfold and aimed true. My cousin cried foul. I shut him up with a lollipop."] },
        fx: { happy: 6, karma: -3, smarts: 1 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_teen_bday_parents',
    icon: '😬',
    cat: 'family',
    rating: 0,
    cooldown: 3,
    when: { age: [13, 15], has: 'parent' },
    actor: 'parent',
    scene: { place: 'home', mood: 'shock', prop: 'cake' },
    text: {
      fr: [
        "Tu fêtes tes {age} ans avec tes potes. {a:Ton père|Ta mère} a décidé de « rester un peu ». {a:Il|Elle} vient de lancer {w:song} sur l'enceinte et danse.",
        "Pour ton anniversaire, {a.rel} a sorti les photos de toi bébé, tout nu dans la baignoire. Tes amis sont fascinés.",
        "Ta soirée d'anniversaire débute à peine que {a.rel} t'appelle devant tout le monde par ton surnom de bébé : « {w:nickname} ».",
        "{a.rel} a préparé un quiz « Qui connaît le mieux {first} ? » pour ton anniversaire. Question 1 : à quel âge as-tu arrêté les couches ?",
      ],
      en: [
        "You're celebrating your {age}th with your friends. {a:Your dad|Your mom} decided to 'stick around a bit'. {a:He|She} just put on {w:song} and started dancing.",
        "For your birthday, {a.rel} brought out baby photos of you, naked in the bathtub. Your friends are fascinated.",
        "Your birthday party has barely started and {a.rel} calls you by your baby nickname in front of everyone: '{w:nickname}'.",
        "{a.rel} prepared a 'Who knows {first} best?' quiz for your birthday. Question 1: at what age did you stop wearing diapers?",
      ],
    },
    choices: [
      {
        label: { fr: 'Le supplier de partir', en: 'Beg them to leave' },
        text: { fr: ["J'ai supplié à voix basse. {a:Mon père|Ma mère} est parti{a:|e} en disant « Amusez-vous bien, mes poussins ! ». Le mot « poussins » me hante.", "{a.my} a fini par monter. On l'entendait chanter à l'étage toute la soirée."], en: ["I begged in a whisper. {a:My dad|My mom} left saying 'Have fun, my little chickadees!' The word 'chickadees' haunts me.", "{a.my} finally went upstairs. We could hear {a.him} singing all night."] },
        fx: { happy: 2, rel: -3, stress: 3 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Assumer et danser avec', en: 'Own it and dance too' },
        out: [
          { w: 2, text: { fr: ["J'ai dansé avec {a.my}. Mes potes ont trouvé ça « trop stylé ». Je n'ai jamais été aussi populaire.", "On a fait une chorégraphie improvisée. Elle tourne encore dans tout le collège. En bien, bizarrement."], en: ["I danced with {a.my}. My friends thought it was 'so cool'. I've never been this popular.", "We improvised a routine. It's still going around school. In a good way, weirdly."] }, fx: { happy: 7, rel: 8, fame: 1 }, mood: 'party' },
          { w: 1, text: { fr: ["Quelqu'un a filmé. La vidéo s'appelle « Le pire anniversaire ». Elle a [[huit cents|mille deux cents|trois mille]] vues au collège.", "J'ai glissé sur {w:food} en plein solo. Mes potes en parlent encore."], en: ["Someone filmed it. The video is called 'Worst Birthday Ever'. It has [[eight hundred|twelve hundred|three thousand]] views at school.", "I slipped on {w:food} mid-solo. My friends still talk about it."] }, fx: { happy: -5, rel: 3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Fuir chez un pote', en: 'Flee to a friend' },
        text: { fr: ["On a déplacé la fête chez un pote. Ses parents à lui étaient pires : ils jouaient de la flûte de Pan.", "On s'est réfugiés au parc avec le gâteau. Pas de bougies, pas de parents, juste un pigeon qui nous a volé une part."], en: ["We moved the party to a friend's place. His parents were worse: they played the pan flute.", "We fled to the park with the cake. No candles, no parents, just a pigeon who stole a slice."] },
        fx: { happy: 4, rel: -5 },
        mood: 'happy',
      },
    ],
  },
  // ───────────────────────────── birthdays: milestones ─────────────────────────────
  {
    id: 'ho_sweet16',
    icon: '🎀',
    cat: 'party',
    rating: 1,
    priority: true,
    once: true,
    when: { age: [16, 16] },
    scene: { place: 'party', mood: 'party', prop: 'cake' },
    text: {
      fr: [
        "Seize ans ! Ta famille veut organiser une « Sweet 16 » à l'américaine dans la salle des fêtes du village. Avec un DJ qui s'appelle {w:nickname}.",
        "Pour tes seize ans, tes parents te demandent ce que tu veux : une fête, un scooter ou {w:gift}. Ta mère penche pour le dernier.",
        "Seize ans. Ta grand-mère a déjà réservé un photographe, une robe de princesse et un gâteau à [[trois|cinq|sept]] étages. Personne ne t'a demandé ton avis.",
        "C'est tes seize ans et tes potes ont prévu « un truc de fou ». Ça implique {w:vehicle}, un champ et une enceinte Bluetooth.",
      ],
      en: [
        "Sixteen! Your family wants to throw an American-style 'Sweet 16' in the village hall. With a DJ called {w:nickname}.",
        "For your sixteenth, your parents ask what you want: a party, a scooter or {w:gift}. Your mom is leaning toward the last one.",
        "Sixteen. Your grandma already booked a photographer, a princess outfit and a [[three|five|seven]]-tier cake. Nobody asked you.",
        "It's your sixteenth and your friends planned 'something insane'. It involves {w:vehicle}, a field and a Bluetooth speaker.",
      ],
    },
    choices: [
      {
        label: { fr: 'La grande fête', en: 'The big party' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["Entrée sous les fumigènes, DJ correct, gâteau énorme. Toute la classe en a parlé pendant un mois. J'étais une légende de seize ans.", "J'ai dansé sur {w:song} avec toute la salle. Même le DJ {w:nickname} a pleuré."], en: ["Grand entrance through smoke machines, decent DJ, huge cake. The whole class talked about it for a month. A sixteen-year-old legend.", "I danced to {w:song} with the entire room. Even DJ {w:nickname} cried."] }, fx: { happy: 12, looks: 2, money: -500 }, mood: 'party' },
          { w: 1, text: { fr: ["La machine à fumée a déclenché les sprinklers. Ma fête s'est terminée en piscine municipale, mais sans piscine. Juste moi, trempé{|e}, et le gâteau qui fondait.", "Mon cousin a vomi du cidre sur le gâteau à étages. Les photos sont magnifiques. Il est dessus."], en: ["The smoke machine set off the sprinklers. My party turned into a public pool without the pool. Just me, soaked, and a melting cake.", "My cousin puked cider all over the tiered cake. The photos are gorgeous. He's in all of them."] }, fx: { happy: -4, stress: 6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Prendre le scooter', en: 'Take the scooter' },
        out: [
          { w: 3, text: { fr: ["J'ai eu mon scooter. Le vent, la liberté, et un moustique dans la bouche à 45 km/h. Le bonheur.", "Mon scooter fait un bruit de tondeuse asthmatique. Je l'aime plus que ma famille."], en: ["I got my scooter. Wind, freedom, and a mosquito in my mouth at 28 mph. Bliss.", "My scooter sounds like an asthmatic lawnmower. I love it more than my family."] }, fx: { happy: 10, money: -800 }, mood: 'happy' },
          { w: 1, text: { fr: ["Premier jour, premier rond-point, première chute. Je me suis éraflé {w:bodypart}. Le scooter va bien, merci.", "J'ai démarré, j'ai calé, je suis tombé{|e} dans la haie du voisin. Il a tout filmé."], en: ["First day, first roundabout, first crash. I scraped my {w:bodypart}. The scooter's fine, thanks.", "I started it, stalled, and fell into the neighbor's hedge. He filmed everything."] }, fx: { happy: 2, health: -6, money: -800 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Le plan des potes', en: "The friends' plan" },
        out: [
          { w: 2, text: { fr: ["Champ, feu de camp, musique trop forte, et un tracteur qui nous a regardés passer. J'ai vu le soleil se lever. J'avais seize ans et l'univers m'appartenait.", "On a dansé dans un champ jusqu'à l'aube. J'ai perdu une chaussure. Je ne la regrette pas."], en: ["Field, campfire, music too loud, and a tractor that watched us go by. I saw the sun rise. I was sixteen and the universe was mine.", "We danced in a field until dawn. I lost a shoe. No regrets."] }, fx: { happy: 10, discipline: -3 }, mood: 'party' },
          { w: 1, text: { fr: ["Les gendarmes sont arrivés vers 2 h. Ils ont appelé mes parents. Ma mère est venue en robe de chambre, devant tout le monde.", "Un orage a éclaté {w:weather}. On a passé la nuit dans {w:vehicle}, serrés comme des sardines."], en: ["The cops showed up around 2 a.m. They called my parents. Mom came in her bathrobe, in front of everyone.", "A storm hit {w:weather}. We spent the night crammed in {w:vehicle} like sardines."] }, fx: { happy: -3, stress: 5, heat: 3 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'ho_legal_night',
    icon: '🪪',
    cat: 'party',
    rating: 2,
    once: true,
    weight: 20,
    when: { age: [18, 19], has: 'anyFriend' },
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'party', prop: 'champagne' },
    text: {
      fr: [
        "Pour fêter ta majorité, {a.first} t'emmène en boîte. Pour la première fois, le videur regarde ta carte d'identité et dit « OK ». Tu as envie de pleurer.",
        "Majeur{|e} et vacciné{|e}. {a.first} a promis de te faire « vivre ta première vraie cuite légale ». Au menu : {w:drink} et des shots couleur antigel.",
        "Ta soirée de majorité commence {w:at_place}, et doit finir en boîte. {a.first} a déjà perdu une chaussure.",
        "Première nuit en boîte avec une vraie carte d'identité. Le DJ passe {w:song}. {a.first} commande [[six|huit|douze]] shots « pour commencer ».",
      ],
      en: [
        "To celebrate you being legal, {a.first} takes you clubbing. For the first time, the bouncer looks at your ID and says 'OK'. You want to cry.",
        "Officially an adult. {a.first} promised you'd 'live your first real legal bender'. On the menu: {w:drink} and antifreeze-colored shots.",
        "Your coming-of-age night starts {w:at_place} and is supposed to end at a club. {a.first} has already lost a shoe.",
        "First club night with a real ID. The DJ plays {w:song}. {a.first} orders [[six|eight|twelve]] shots 'to start'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout boire', en: 'Drink everything' },
        out: [
          { w: 2, text: { fr: ["J'ai vomi dans le sac à main d'une inconnue, puis dans le mien, puis dans le sèche-mains des toilettes. L'air chaud m'a renvoyé tout ça au visage. Bienvenue chez les adultes.", "Le dernier shot rappelait vaguement {w:food}. J'ai repeint les toilettes en vomi fluo. Le DJ m'a dédicacé une chanson."], en: ["I puked in a stranger's handbag, then in mine, then into the hand dryer. The hot air blasted it all back in my face. Welcome to adulthood.", "The last shot tasted like {w:food}. I repainted the bathroom in neon puke. The DJ dedicated a song to me."] }, fx: { happy: 4, health: -8, addiction: ['alcohol', 6] }, mood: 'sick', icon: '🤮' },
          { w: 1, text: { fr: ["J'ai tenu toute la nuit. Je me suis réveillé{|e} dans le lit d'un inconnu très sympathique, avec un tatouage « {w:nickname} » sur la fesse gauche.", "Nuit légendaire. J'ai fini sur le podium, j'ai embrassé quelqu'un de très beau et de très majeur, et j'ai perdu mon téléphone dans un seau à glace."], en: ["I lasted all night. Woke up in a very nice stranger's bed with a '{w:nickname}' tattoo on my left butt cheek.", "Legendary night. I ended up on the podium, kissed someone very hot and very much of age, and lost my phone in an ice bucket."] }, fx: { happy: 12, health: -4, looks: 1 }, mood: 'love' },
        ],
      },
      {
        label: { fr: 'Rester raisonnable', en: 'Stay sensible' },
        text: { fr: ["J'ai bu deux verres et j'ai ramené {a.first} chez {a:lui|elle}. Ou chez quelqu'un. {a:Il|Elle} m'a vomi sur les chaussures en disant « t'es ma mère ».", "J'ai été la personne sobre de la soirée. J'ai tenu les cheveux de {a.first} pendant quarante minutes. C'est ça, l'amitié adulte."], en: ["I had two drinks and took {a.first} home. Or someone's home. {a:He|She} puked on my shoes saying 'you're my mom'.", "I was the sober one. I held {a.first}'s hair for forty minutes. That's adult friendship."] },
        fx: { happy: 3, rel: 10, karma: 3 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 'ho_bday_20',
    icon: '🎂',
    cat: 'party',
    rating: 1,
    priority: true,
    once: true,
    when: { age: [20, 20] },
    scene: { place: 'apartment', mood: 'party', prop: 'cake' },
    text: {
      fr: [
        "Vingt ans. Plus d'excuse d'ado. Tes potes ont organisé une soirée dans un appart de [[18|22|25]] m² avec {w:drink} en quantité industrielle.",
        "Tu as vingt ans. Ta tante t'a envoyé une carte : « Profite, après c'est la descente. » Elle y a glissé dix euros et {w:gift}.",
        "Pour tes vingt ans, tes amis te préparent une « surprise ». Tu sais que c'est une surprise parce que le groupe s'appelle « surprise pour {first} ».",
        "Vingt ans, l'âge d'or. Tu as un découvert, un matelas par terre et {w:food} dans le frigo. Comment fêtes-tu ça ?",
      ],
      en: [
        "Twenty. No more teen excuses. Your friends threw a party in a [[200|240|270]] sq ft apartment with an industrial amount of {w:drink}.",
        "You're twenty. Your aunt sent a card: 'Enjoy it, it's all downhill from here.' She tucked in ten bucks and {w:gift}.",
        "For your twentieth, your friends are preparing a 'surprise'. You know because the group chat is called 'surprise for {first}'.",
        "Twenty, the golden age. You have an overdraft, a mattress on the floor and {w:food} in the fridge. How do you celebrate?",
      ],
    },
    choices: [
      {
        label: { fr: 'Soirée appart', en: 'House party' },
        out: [
          { w: 2, text: { fr: ["Quarante personnes dans le salon, le voisin du dessous a fini par venir. Il a dansé sur {w:song}. Il est resté jusqu'à 6 h.", "On a fait la fête jusqu'à ce que le canapé cède. On a dormi dans ses ruines. Vingt ans parfaits."], en: ["Forty people in the living room. The downstairs neighbor ended up joining. He danced to {w:song}. He stayed until 6 a.m.", "We partied until the couch gave out. We slept in its ruins. A perfect twenty."] }, fx: { happy: 10, health: -3 }, mood: 'party' },
          { w: 1, text: { fr: ["Les flics sont venus pour tapage. L'un d'eux a mangé une part de gâteau. On a eu une amende, mais il a dit que c'était le meilleur fraisier de sa carrière.", "Quelqu'un a bouché les toilettes avec {w:object}. On ne sait toujours pas qui. On a des soupçons."], en: ["The cops came for a noise complaint. One of them ate a slice of cake. We got fined, but he said it was the best strawberry cake of his career.", "Someone clogged the toilet with {w:object}. We still don't know who. We have suspicions."] }, fx: { happy: 2, money: -135, stress: 4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Voyage improvisé', en: 'Spontaneous trip' },
        text: { fr: ["J'ai pris le premier train pas cher. Je me suis retrouvé{|e} à Vierzon. J'y ai fêté mes vingt ans avec un kebab et un chat errant. Inoubliable.", "On est partis {w:to_place} sur un coup de tête. On a dépensé tout mon budget du mois en deux jours. Ça valait le coup."], en: ["I took the first cheap train. Ended up in a nowhere town. Celebrated my twentieth with a kebab and a stray cat. Unforgettable.", "We went {w:to_place} on a whim. Blew my whole monthly budget in two days. Worth it."] },
        fx: { happy: 8, money: -300, stress: -4 },
        mood: 'happy',
      },
      {
        label: { fr: 'Dormir', en: 'Sleep' },
        text: { fr: ["J'ai dormi quatorze heures. À vingt ans, c'est encore un sport. Mes potes ont fait la fête sans moi et m'ont envoyé des vidéos.", "Je me suis offert une sieste de compétition et {w:food}. Le bonheur ne coûte pas cher quand on est fauché{|e}."], en: ["I slept fourteen hours. At twenty, that's still a sport. My friends partied without me and sent videos.", "I treated myself to a competition-level nap and {w:food}. Happiness is cheap when you're broke."] },
        fx: { happy: 4, health: 3, stress: -6 },
        mood: 'sleepy',
      },
    ],
  },
  {
    id: 'ho_bday_30',
    icon: '3️⃣',
    cat: 'party',
    rating: 2,
    priority: true,
    once: true,
    when: { age: [30, 30] },
    scene: { place: 'party', mood: 'party', prop: 'cake' },
    text: {
      fr: [
        "Trente ans. Tes amis t'ont organisé une soirée « Adieu la jeunesse » avec un faux cercueil. Dedans : tes photos de soirées de tes vingt ans.",
        "Tu as trente ans. Ce matin, tu t'es fait mal au dos en mettant tes chaussettes. Ce soir, tes potes veulent « tout casser » {w:at_place}.",
        "Pour tes trente ans, ton meilleur ami a fait un diaporama. Il dure [[vingt|quarante|soixante-cinq]] minutes et il y a au moins trois photos de toi en train de vomir.",
        "Trente ans. Tes parents te demandent quand tu « te poses ». Tes potes t'offrent {w:gift} et un test de grossesse « pour rire ».",
      ],
      en: [
        "Thirty. Your friends threw you a 'Farewell Youth' party with a fake coffin. Inside: photos from your twenties' parties.",
        "You're thirty. This morning you hurt your back putting on socks. Tonight your friends want to 'go wild' {w:at_place}.",
        "For your thirtieth, your best friend made a slideshow. It runs [[twenty|forty|sixty-five]] minutes and has at least three photos of you puking.",
        "Thirty. Your parents ask when you'll 'settle down'. Your friends give you {w:gift} and a pregnancy test 'as a joke'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Fête comme à 20 ans', en: 'Party like you are 20' },
        out: [
          { w: 1, text: { fr: ["J'ai fait la fête comme à vingt ans. Mon corps, lui, en avait trente. Trois jours de gueule de bois, un genou qui craque et une dignité en option.", "J'ai voulu faire le pont entre deux tables. J'ai fait le pont, puis le grand écart, puis les urgences. Je me suis froissé {w:bodypart}."], en: ["I partied like I was twenty. My body was thirty. Three-day hangover, a cracking knee and optional dignity.", "I tried to bridge two tables. I bridged, then did the splits, then the ER. Pulled my {w:bodypart}."] }, fx: { happy: 6, health: -8 }, mood: 'sick' },
          { w: 2, text: { fr: ["Soirée mémorable. On a fini en sous-vêtements dans la fontaine de la mairie, à chanter {w:song}. Le maire passait par là. Il a chanté avec nous.", "J'ai dansé jusqu'à l'aube et j'ai fini dans un lit avec quelqu'un de mon âge, ce qui à trente ans s'appelle « un bon parti »."], en: ["Memorable night. We ended up in our underwear in the town hall fountain singing {w:song}. The mayor walked by. He sang along.", "I danced until dawn and ended up in bed with someone my age, which at thirty is called 'a catch'."] }, fx: { happy: 12, health: -3 }, mood: 'party' },
        ],
      },
      {
        label: { fr: 'Dîner tranquille', en: 'Quiet dinner' },
        text: { fr: ["Dîner chic, vin cher, couché{|e} à 23 h. J'ai trouvé ça merveilleux. C'est fini, je suis {vieux|vieille}.", "Restaurant, {w:food}, discussion sur les taux d'intérêt. Personne n'a vomi. Une première dans l'histoire de mes anniversaires."], en: ["Fancy dinner, expensive wine, in bed by 11. I found it wonderful. It's over, I'm old.", "Restaurant, {w:food}, a chat about interest rates. Nobody puked. A first in my birthday history."] },
        fx: { happy: 5, stress: -5, money: -120 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Crise existentielle', en: 'Existential crisis' },
        text: { fr: ["J'ai pleuré dans la salle de bain en regardant mon premier cheveu blanc. Je l'ai appelé Gérard. Il a des amis maintenant.", "J'ai fait le bilan : pas de maison, pas de plan, juste {w:object} et un abonnement à {w:app}. J'ai mangé le gâteau entier, seul{|e}, dans le noir."], en: ["I cried in the bathroom staring at my first gray hair. I named it Gerald. It has friends now.", "I took stock: no house, no plan, just {w:object} and a {w:app} subscription. I ate the whole cake alone in the dark."] },
        fx: { happy: -6, stress: 6, weight: 0.02 },
        mood: 'cry',
      },
    ],
  },
  {
    id: 'ho_bday_40',
    icon: '🍾',
    cat: 'party',
    rating: 2,
    once: true,
    weight: 25,
    when: { age: [40, 41], has: 'anyFriend' },
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'shock', prop: 'champagne' },
    text: {
      fr: [
        "Pour fêter tes quarante ans, {a.first} a engagé un strip-teaseur déguisé en {w:weird_job}. Il est en retard, il est enrhumé et il sent {w:smell}.",
        "Soirée surprise pour tes quarante ans : {a.first} a loué une salle, un DJ et un « invité mystère ». L'invité mystère, c'est ton ex.",
        "La fête de tes quarante ans bat son plein. {a:Ton père|Ta mère} a fait imprimer ta photo d'ado sur [[cinquante|cent|deux cents]] t-shirts. Tout le monde les porte.",
        "{a.first} t'a organisé une fête « Quarante ans, quarante shots ». Le premier rappelle {w:drink}, en pire. Il en reste trente-neuf.",
      ],
      en: [
        "For your fortieth, {a.first} hired a stripper dressed as {w:weird_job}. He's late, he has a cold and he gives off {w:smell}.",
        "Surprise party for your fortieth: {a.first} rented a room, a DJ and a 'mystery guest'. The mystery guest is your ex.",
        "Your fortieth birthday party is in full swing. {a.first} printed your teenage photo on [[fifty|a hundred|two hundred]] T-shirts. Everyone's wearing one.",
        "{a.first} threw you a 'Forty Years, Forty Shots' party. The first one tastes like {w:drink}, only worse. Thirty-nine to go.",
      ],
    },
    choices: [
      {
        label: { fr: 'Jouer le jeu à fond', en: 'Go all in' },
        out: [
          { w: 2, text: { fr: ["J'ai fini debout sur le bar, chemise ouverte, à hurler {w:song}. Ma voisine de table m'a glissé son numéro dans la poche. J'ai quarante ans et je suis désirable.", "On a dansé jusqu'à 5 h. J'ai embrassé deux personnes, dont une sur la bouche par erreur. Elle n'a pas porté plainte."], en: ["I ended up standing on the bar, shirt open, screaming {w:song}. Someone slipped their number in my pocket. I'm forty and I'm desirable.", "We danced until 5 a.m. I kissed two people, one on the mouth by mistake. They didn't press charges."] }, fx: { happy: 12, looks: 1, health: -4, rel: 8 }, mood: 'party' },
          { w: 1, text: { fr: ["Au trentième shot, j'ai vomi un geyser façon Exorciste sur le gâteau, le DJ et la première rangée. Le DJ a continué de mixer. Professionnel.", "J'ai voulu montrer que je faisais encore le grand écart. Il y a eu un craquement. On a appelé une ambulance. Le strip-teaseur m'a tenu la main."], en: ["At shot thirty, I sprayed an Exorcist-grade geyser over the cake, the DJ and the front row. The DJ kept mixing. Professional.", "I tried to prove I could still do the splits. There was a crack. They called an ambulance. The stripper held my hand."] }, fx: { happy: 2, health: -12, disease: 'sprain' }, mood: 'sick', icon: '🤮' },
        ],
      },
      {
        label: { fr: 'Engueuler {a.first}', en: 'Yell at {a.first}' },
        text: { fr: ["J'ai engueulé {a.first} devant tout le monde. {a:Il|Elle} a pleuré, puis on a trinqué, puis on s'est réengueulés. Une vraie amitié de quarantenaires.", "J'ai traité {a.first} de « {w:insult} ». Le DJ a mis un slow. On s'est réconciliés en dansant, par pur épuisement."], en: ["I yelled at {a.first} in front of everyone. {a:He|She} cried, then we toasted, then we fought again. A true forty-something friendship.", "I called {a.first} a '{w:insult}'. The DJ put on a slow song. We made up dancing, out of sheer exhaustion."] },
        fx: { happy: -2, rel: -6, stress: 3 },
        mood: 'angry',
      },
    ],
  },
  {
    id: 'ho_bday_50',
    icon: '🎉',
    cat: 'party',
    rating: 1,
    once: true,
    weight: 25,
    when: { age: [50, 51] },
    scene: { place: 'home', mood: 'neutral', prop: 'cake' },
    text: {
      fr: [
        "Pour marquer le demi-siècle, ta famille a organisé un « roast » : chaque invité doit se moquer de toi au micro. Il y a [[douze|vingt|trente]] inscrits. Même ton dentiste.",
        "Cinquante ans. Tes proches t'ont offert un baptême de l'air, {w:gift} et une brochure de maison de retraite « pour rire ». Ils ont entouré une chambre.",
        "Le gâteau de ton demi-siècle porte tellement de bougies que le détecteur de fumée a sonné avant le « Joyeux anniversaire ».",
        "Cinquante ans. Le discours de ton beau-frère dure depuis vingt minutes et parle surtout de lui, {w:excuse}.",
      ],
      en: [
        "To mark your half-century, your family organized a roast: every guest gets to mock you on the mic. [[Twelve|Twenty|Thirty]] people signed up. Even your dentist.",
        "Fifty. Your loved ones gave you a flight lesson, {w:gift} and a retirement-home brochure 'as a joke'. They circled a room.",
        "Your half-century cake has so many candles the smoke alarm went off before 'Happy Birthday'.",
        "Fifty. Your brother-in-law's speech has gone on for twenty minutes and is mostly about himself, {w:excuse}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Répliquer au micro', en: 'Clap back on the mic' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai pris le micro et j'ai démoli chaque invité un par un. Standing ovation. Mon dentiste m'a offert un détartrage.", "J'ai répondu à chaque vanne avec une vanne pire. Ma belle-mère a quitté la salle. Meilleur anniversaire de ma vie."], en: ["I took the mic and destroyed every guest one by one. Standing ovation. My dentist offered a free cleaning.", "I answered every joke with a worse one. My mother-in-law left the room. Best birthday of my life."] }, fx: { happy: 10, fame: 1, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai voulu être drôle, j'ai été méchant{|e}. Mon frère ne me parle plus. Il a gardé sa part de gâteau en otage.", "Ma blague sur le divorce de ma cousine n'a pas fait rire. Ma cousine non plus."], en: ["I tried to be funny and was just mean. My brother isn't speaking to me. He's holding his cake slice hostage.", "My joke about my cousin's divorce didn't land. Neither did my cousin."] }, fx: { happy: -4, karma: -3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Pleurer d\'émotion', en: 'Cry with emotion' },
        text: { fr: ["J'ai fondu en larmes au premier discours. Tout le monde m'a pris{|e} dans ses bras. Mon mascara était sur six personnes différentes.", "J'ai pleuré de joie, puis de vieillesse, puis de joie. Le gâteau était bon. La vie aussi, en fait."], en: ["I burst into tears at the first speech. Everyone hugged me. My mascara ended up on six different people.", "I cried with joy, then from old age, then with joy again. The cake was good. So is life, actually."] },
        fx: { happy: 8, stress: -6 },
        mood: 'cry',
      },
      {
        label: { fr: 'Vérifier la brochure', en: 'Check out the brochure' },
        text: { fr: ["J'ai lu la brochure de la maison de retraite. Il y a une piscine, un karaoké et des loto le jeudi. J'ai réservé pour dans trente ans.", "J'ai pris la brochure au sérieux. J'ai appelé. Ils ont des places dès maintenant. J'ai réfléchi plus longtemps que prévu."], en: ["I read the retirement-home brochure. Pool, karaoke, bingo on Thursdays. I booked for thirty years from now.", "I took the brochure seriously. I called. They have openings right now. I thought about it longer than I'd like to admit."] },
        fx: { happy: 3, smarts: 1 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 'ho_bday_60',
    icon: '🪂',
    cat: 'family',
    rating: 2,
    once: true,
    weight: 25,
    when: { age: [60, 61] },
    scene: { place: 'park', mood: 'shock' },
    text: {
      fr: [
        "Pour tes soixante ans, tes proches t'ont offert un saut en parachute. Le moniteur s'appelle {w:nickname} et a l'air de sortir de garde à vue.",
        "Soixante ans, cadeau commun : un saut en parachute en tandem. Tu as signé une décharge de [[douze|trente|cinquante]] pages sans la lire.",
        "Ta famille a cotisé pour tes soixante ans : un saut en parachute {w:weather}. L'avion date de la guerre. Laquelle, personne ne sait.",
        "Pour célébrer tes soixante ans, on t'offre un saut à 4 000 mètres. Ton moniteur mâche {w:food} et vérifie son harnais du bout des doigts.",
      ],
      en: [
        "For your sixtieth, your family got you a skydiving jump. The instructor is called {w:nickname} and looks freshly released from custody.",
        "Sixty, group gift: a tandem skydive. You signed a [[twelve|thirty|fifty]]-page waiver without reading it.",
        "Your family chipped in for your sixtieth: a skydive {w:weather}. The plane dates back to the war. Which war, nobody knows.",
        "To celebrate sixty, you get a 13,000-foot jump. Your instructor chews {w:food} and checks his harness with his fingertips.",
      ],
    },
    choices: [
      {
        label: { fr: 'Sauter', en: 'Jump' },
        out: [
          { w: 3, text: { fr: ["J'ai sauté en hurlant. À l'atterrissage, mon dentier est resté quelque part au-dessus de la Beauce. Meilleur jour de ma vie.", "Chute libre, cri primal, atterrissage dans un champ de vaches. Une vache m'a regardé{|e}. Je me suis senti{|e} immortel{|le}."], en: ["I jumped screaming. On landing, my dentures stayed somewhere over the farmland. Best day of my life.", "Free fall, primal scream, landing in a cow pasture. A cow looked at me. I felt immortal."] }, fx: { happy: 15, stress: -10, health: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["Le parachute s'est ouvert en retard. On a atterri dans une serre. J'ai des éclats de tomates partout et une cheville qui ressemble à {w:food}.", "Le moniteur a vomi en plein vol. Le vent a fait le reste. J'ai atterri couvert{|e} de son petit-déjeuner, à 200 km/h de honte."], en: ["The chute opened late. We crashed into a greenhouse. Tomato shrapnel everywhere and an ankle that looks like {w:food}.", "The instructor threw up mid-air. The wind did the rest. I landed covered in his breakfast, at 120 mph of shame."] }, fx: { happy: -2, health: -12, disease: 'sprain' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Refuser poliment', en: 'Politely decline' },
        text: { fr: ["J'ai refusé. Mon fils a sauté à ma place. Il a hurlé tout du long. J'ai filmé depuis le sol, avec un café. Le meilleur cadeau, finalement.", "J'ai offert mon saut à mon beau-frère. Il a atterri dans un étang. J'ai ri pendant trois jours."], en: ["I declined. My son jumped instead. He screamed the whole way. I filmed from the ground with a coffee. Best gift, in the end.", "I gave my jump to my brother-in-law. He landed in a pond. I laughed for three days."] },
        fx: { happy: 6, stress: -3 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_bday_80',
    icon: '🔥',
    cat: 'family',
    rating: 2,
    priority: true,
    once: true,
    when: { age: [80, 80] },
    scene: { place: 'home', mood: 'shock', prop: 'cake', fx: 'fire' },
    text: {
      fr: [
        "Quatre-vingts ans. Tes petits-enfants ont mis les quatre-vingts bougies sur le gâteau. Ça ne fait plus un gâteau, ça fait un brasier. Les pompiers sont en route.",
        "Pour tes quatre-vingts ans, la famille au complet est là. Ton arrière-petit-fils demande à voix haute si tu vas « bientôt mourir ».",
        "Quatre-vingts ans. Ta sœur t'a offert {w:gift}. Ton neveu a apporté {w:food}. Tes dents n'ont rien apporté du tout.",
        "La fête de tes quatre-vingts ans démarre. La chaleur des bougies fait fondre le glaçage, le nappage et la frange de ta belle-fille.",
      ],
      en: [
        "Eighty. Your grandkids put all eighty candles on the cake. It's not a cake anymore, it's a bonfire. The fire department is on its way.",
        "The whole family is here for your eightieth. Your great-grandson asks out loud if you're going to 'die soon'.",
        "Eighty. Your sister gave you {w:gift}. Your nephew brought {w:food}. Your teeth brought nothing at all.",
        "Your eightieth birthday party begins. The heat from the candles melts the frosting, the glaze and your daughter-in-law's bangs.",
      ],
    },
    choices: [
      {
        label: { fr: 'Souffler d\'un coup', en: 'Blow them all at once' },
        out: [
          { w: 2, odds: { health: 1 }, text: { fr: ["J'ai soufflé les quatre-vingts bougies d'un seul souffle. La famille a applaudi. Mon poumon gauche, moins.", "Un souffle titanesque. Les bougies se sont éteintes, ainsi que trois serviettes en papier. Je suis encore un monstre."], en: ["I blew out all eighty candles in one breath. The family clapped. My left lung didn't.", "A titanic breath. The candles went out, along with three paper napkins. I'm still a beast."] }, fx: { happy: 10, health: -2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai soufflé, mon dentier est parti avec. Il a atterri dans le brasier. On l'a récupéré noirci, fumant, et je l'ai remis. Il a un goût de barbecue maintenant.", "J'ai soufflé si fort que mes sourcils ont pris feu. Mon petit-fils m'a éteint{|e} avec {w:drink}. Il y avait du sucre. Les guêpes ont suivi."], en: ["I blew, and my dentures went with it. They landed in the inferno. We fished them out blackened and smoking and I put them back in. They taste like barbecue now.", "I blew so hard my eyebrows caught fire. My grandson put me out with {w:drink}. It had sugar in it. The wasps followed."] }, fx: { happy: 4, health: -6, looks: -3, disease: 'burns' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Raconter la guerre', en: 'Tell war stories' },
        text: { fr: ["J'ai raconté mes souvenirs pendant deux heures. La moitié étaient inventés. Personne n'a osé me contredire. J'ai quatre-vingts ans, j'ai le droit.", "J'ai raconté comment j'avais rencontré {w:celeb} en 1967. C'est faux, mais ma petite-fille l'a posté et ça a fait un buzz."], en: ["I told stories for two hours. Half were made up. Nobody dared contradict me. I'm eighty, I'm allowed.", "I told them how I met {w:celeb} in 1967. Not true, but my granddaughter posted it and it went viral."] },
        fx: { happy: 7, smarts: 1, fame: 1 },
        mood: 'happy',
      },
      {
        label: { fr: 'Annoncer le testament', en: 'Announce the will' },
        text: { fr: ["J'ai annoncé que je léguais tout au chat. Le silence qui a suivi vaut toutes les bougies du monde. Le gâteau n'a jamais été aussi bien servi.", "J'ai lu mon testament à voix haute entre deux parts de gâteau. Trois personnes ont pleuré, deux ont claqué la porte. Une grande fête."], en: ["I announced I'm leaving everything to the cat. The silence that followed was worth every candle. Never got served cake so fast.", "I read my will out loud between two slices. Three people cried, two stormed out. A great party."] },
        fx: { happy: 9, karma: -2 },
        mood: 'party',
      },
    ],
  },
  {
    id: 'ho_bday_100',
    icon: '💯',
    cat: 'family',
    rating: 1,
    priority: true,
    once: true,
    when: { age: [100, 100] },
    scene: { place: 'home', mood: 'proud', prop: 'cake' },
    text: {
      fr: [
        "Cent ans. Le maire est venu avec une écharpe, un photographe et une boîte de chocolats qu'il a commencée dans la voiture.",
        "Tu as cent ans. La télé locale veut savoir ton secret. Ton secret, c'est {w:drink} tous les soirs et ne jamais lire les notices.",
        "Cent ans ! La moitié de tes invités ont plus de soixante-dix ans et s'endorment pendant le gâteau. L'autre moitié filme pour {w:app}.",
        "Pour ton centenaire, ta famille a fait venir une fanfare. Elle joue {w:song}. Tu ne sais pas qui a choisi, mais tu vas le déshériter.",
      ],
      en: [
        "A hundred. The mayor came with a sash, a photographer and a box of chocolates he started eating in the car.",
        "You're a hundred. The local news wants your secret. Your secret is {w:drink} every night and never reading instructions.",
        "A hundred! Half your guests are over seventy and doze off during the cake. The other half are filming for {w:app}.",
        "For your centennial, your family brought in a brass band. It's playing {w:song}. You don't know who picked it, but they're out of the will.",
      ],
    },
    choices: [
      {
        label: { fr: 'Donner une interview', en: 'Give an interview' },
        text: { fr: ["J'ai dit au journaliste : « Mon secret ? Survivre à tous ceux qui m'énervaient. » Ça a fait la une. Trois cousins ont arrêté de m'appeler.", "J'ai expliqué que j'avais tenu cent ans {w:excuse}. Le reportage a été diffusé à 13 h. Ma voisine de 98 ans est jalouse."], en: ["I told the reporter: 'My secret? Outliving everyone who annoyed me.' Front page. Three cousins stopped calling.", "I explained I made it to a hundred {w:excuse}. It aired on the lunchtime news. My 98-year-old neighbor is jealous."] },
        fx: { happy: 10, fame: 4 },
        mood: 'proud',
      },
      {
        label: { fr: 'Danser avec le maire', en: 'Dance with the mayor' },
        out: [
          { w: 2, text: { fr: ["J'ai dansé une valse avec le maire. Il m'a marché sur les pieds deux fois. Je l'ai menacé de ne pas voter pour lui. Il a dansé mieux.", "J'ai entraîné le maire dans une chenille géante. Il a fini en tête. Il a dit que c'était son meilleur centenaire de l'année."], en: ["I waltzed with the mayor. He stepped on my feet twice. I threatened not to vote for him. He danced better.", "I dragged the mayor into a giant conga line. He ended up leading it. He said it was his best centennial of the year."] }, fx: { happy: 12, health: -2 }, mood: 'party' },
          { w: 1, text: { fr: ["Au deuxième tour de piste, ma hanche a fait un bruit de biscotte. Le maire a appelé le SAMU. J'ai insisté pour finir la chanson.", "J'ai dansé, j'ai tourné, je me suis assis{|e} sur le gâteau. Cent ans et toujours le sens du spectacle."], en: ["On the second spin, my hip made a cracker sound. The mayor called an ambulance. I insisted on finishing the song.", "I danced, I spun, I sat on the cake. A hundred years old and still a showman."] }, fx: { happy: 5, health: -8 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'ho_bday_own_party',
    icon: '🥳',
    cat: 'party',
    rating: 2,
    cooldown: 4,
    when: { age: [21, 70], has: 'anyFriend' },
    actor: 'anyFriend',
    scene: { place: 'apartment', mood: 'party', prop: 'cake' },
    text: {
      fr: [
        "Tu organises ta fête d'anniversaire. {a.first} arrive en avance avec {w:drink} et un « ami » que personne ne connaît, qui fouille déjà ton armoire à pharmacie.",
        "Tes {age} ans, ton appart, trente invités. Quelqu'un a mis {w:song} en boucle et un autre dort dans ta baignoire. Il est 21 h.",
        "C'est ta fête. {a.first} a fait le gâteau : il a la forme d'un pénis. Ta grand-mère vient d'arriver.",
        "Ton anniversaire dégénère gentiment. {a.first} s'est enfermé{a:|e} aux toilettes avec quelqu'un et {w:sound} résonne dans tout l'appart.",
      ],
      en: [
        "You're throwing your birthday party. {a.first} shows up early with {w:drink} and a 'friend' nobody knows, who's already going through your medicine cabinet.",
        "Your {age}th, your place, thirty guests. Someone put {w:song} on loop and someone else is asleep in your bathtub. It's 9 p.m.",
        "It's your party. {a.first} baked the cake: it's shaped like a penis. Your grandma just arrived.",
        "Your birthday is gently going off the rails. {a.first} locked {a.him}self in the bathroom with someone, and {w:sound} echoes through the apartment.",
      ],
    },
    choices: [
      {
        label: { fr: 'Laisser dégénérer', en: 'Let it spiral' },
        out: [
          { w: 2, text: { fr: ["À 3 h, quelqu'un a vomi dans l'aquarium. Les poissons ont l'air bien, plus gros même. Meilleure fête depuis des années.", "J'ai fini en slip sur le balcon à chanter avec le voisin d'en face. On ne s'était jamais parlé. On part en vacances ensemble."], en: ["At 3 a.m., someone puked in the fish tank. The fish seem fine, bigger even. Best party in years.", "I ended up in my underwear on the balcony singing with the guy across the street. We'd never spoken. We're going on vacation together."] }, fx: { happy: 10, health: -4, rel: 6 }, mood: 'party' },
          { w: 1, text: { fr: ["Le lendemain : un trou dans le mur, {w:object} dans le four, et une capote accrochée au lustre. Je n'ai aucun souvenir. La caution non plus.", "L'ami inconnu est reparti avec ma télé. Il a laissé {w:gift} en échange. C'est presque une fête réussie."], en: ["The next morning: a hole in the wall, {w:object} in the oven, and a condom hanging from the chandelier. I remember nothing. Neither does my deposit.", "The unknown friend left with my TV. He left {w:gift} in exchange. Almost a successful party."] }, fx: { happy: -3, money: -400, stress: 6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Virer tout le monde', en: 'Kick everyone out' },
        text: { fr: ["J'ai allumé la lumière à minuit et crié « RIDEAU ». Ils sont partis en râlant. J'ai mangé les restes du gâteau-pénis en paix.", "J'ai coupé la musique et ouvert la porte. {a.first} m'a traité{|e} de « {w:insult} ». J'ai dormi comme un bébé."], en: ["I turned on the lights at midnight and yelled 'SHOW'S OVER'. They left grumbling. I ate the leftover penis cake in peace.", "I killed the music and opened the door. {a.first} called me a '{w:insult}'. I slept like a baby."] },
        fx: { happy: 2, rel: -6, stress: -4 },
        mood: 'angry',
      },
    ],
  },
  {
    id: 'ho_bday_candles_auto',
    icon: '🎂',
    cat: 'party',
    rating: 1,
    auto: true,
    cooldown: 3,
    when: { age: [25, 85] },
    text: {
      fr: [
        "Pour mes {age} ans, on m'a offert {w:gift} et une bougie en forme de point d'interrogation. C'est vexant, mais lucide.",
        "J'ai eu {age} ans. Mes amis ont mis une seule bougie sur le gâteau « pour le bilan carbone ». J'ai fait un vœu. Il était grossier.",
        "Mon anniversaire est tombé un lundi. J'ai soufflé ma bougie, plantée dans {w:food}, seul{|e}, devant {w:show}. Ça m'a suffi.",
        "Pour mon anniversaire, ma banque m'a envoyé un SMS. Ma mère aussi. Mon ex aussi, à 2 h du matin, bourré. Trois messages, trois niveaux de tristesse.",
      ],
      en: [
        "For my {age}th, I got {w:gift} and a question-mark candle. Hurtful, but accurate.",
        "I turned {age}. My friends put a single candle on the cake 'for the carbon footprint'. I made a wish. It was filthy.",
        "My birthday fell on a Monday. I blew out a candle stuck in {w:food}, alone, watching {w:show}. It was enough.",
        "For my birthday, my bank texted me. So did my mom. So did my ex, at 2 a.m., drunk. Three messages, three levels of sadness.",
      ],
    },
    fx: { happy: 2 },
  },
  {
    id: 'ho_kid_bday_host',
    icon: '🏰',
    cat: 'family',
    rating: 0,
    cooldown: 3,
    when: { age: [24, 60], has: 'child' },
    actor: 'child',
    scene: { place: 'home', mood: 'shock', prop: 'cake' },
    text: {
      fr: [
        "Tu organises l'anniversaire de {a.rel} {a.first}. Quinze gamins, un château gonflable et {w:food}. Au bout de dix minutes, un enfant a disparu.",
        "Fête d'anniversaire de {a.first} : le château gonflable s'envole doucement vers le jardin du voisin, avec [[deux|trois|quatre]] enfants dedans.",
        "Pour l'anniversaire de {a.first}, un parent d'élève reste « pour aider ». Il boit ton rosé et te parle {w:excuse} de ses idées politiques.",
        "{a.first} a exigé un gâteau en forme d'{w:animal} pour son anniversaire. Le tien ressemble plutôt à {w:object}. {a:Il|Elle} pleure.",
      ],
      en: [
        "You're throwing {a.rel} {a.first}'s birthday party. Fifteen kids, a bouncy castle and {w:food}. After ten minutes, a child has vanished.",
        "{a.first}'s birthday party: the bouncy castle is gently floating toward the neighbor's yard, with [[two|three|four]] kids inside.",
        "For {a.first}'s birthday, one parent stays 'to help'. He drinks your rosé and tells you about his political views, {w:excuse}.",
        "{a.first} demanded a cake shaped like {w:animal}. Yours looks more like {w:object}. {a:He|She} is crying.",
      ],
    },
    choices: [
      {
        label: { fr: 'Gérer en héros', en: 'Handle it like a hero' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai tout géré : enfant retrouvé dans le placard, château rattrapé au lasso, gâteau rebaptisé « art moderne ». {a.first} dit que je suis le meilleur parent du monde.", "J'ai organisé une chasse au trésor improvisée. Tous les gamins étaient occupés pendant une heure. Moi aussi, j'ai trouvé le trésor : un verre de vin caché."], en: ["I handled it all: kid found in the closet, castle lassoed back, cake renamed 'modern art'. {a.first} says I'm the best parent in the world.", "I improvised a treasure hunt. Every kid was busy for an hour. I found treasure too: a hidden glass of wine."] }, fx: { happy: 8, rel: 10, stress: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["Un enfant a mordu un autre enfant, qui a mordu le chien, qui a mordu le parent qui « aidait ». J'ai passé la soirée au téléphone avec des mères furieuses.", "Le château gonflable s'est dégonflé sur six enfants. Ils vont bien. Ils ressortent un par un, comme des taupes."], en: ["A kid bit another kid, who bit the dog, who bit the 'helping' parent. I spent the evening on the phone with furious mothers.", "The bouncy castle deflated on six kids. They're fine. They're crawling out one by one like moles."] }, fx: { happy: -4, stress: 10, rel: 2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Tout sous-traiter', en: 'Outsource everything' },
        text: { fr: ["J'ai payé une animatrice et je suis resté{|e} dans la cuisine avec un verre. {a.first} a adoré. Mon compte en banque, moins.", "J'ai loué une salle de jeux et je les ai tous déposés là-bas. Deux heures de silence. Le meilleur argent jamais dépensé."], en: ["I paid an entertainer and stayed in the kitchen with a drink. {a.first} loved it. My bank account didn't.", "I rented a play center and dropped them all off. Two hours of silence. Best money I ever spent."] },
        fx: { happy: 5, rel: 4, money: -350, stress: -3 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_parent_bday_gift',
    icon: '🎁',
    cat: 'family',
    rating: 0,
    cooldown: 3,
    when: { age: [10, 60], has: 'parent' },
    actor: 'parent',
    scene: { place: 'home', mood: 'neutral' },
    text: {
      fr: [
        "C'est l'anniversaire de {a.rel} demain. Tu as oublié. Il te reste {w:at_place} et [[vingt|quinze|trente]] minutes avant la fermeture.",
        "Pour l'anniversaire de {a.rel}, la famille se cotise. Ton frère propose {w:gift}. Toi, tu as une meilleure idée. Enfin, une idée.",
        "{a.rel} fête ses {a.age} ans. {a:Il|Elle} a dit « je ne veux rien ». Tout le monde sait que c'est un piège.",
        "Anniversaire de {a.rel} ce week-end. Ta dernière idée de cadeau, c'était {w:gift}. Il ne faut pas reproduire cette erreur.",
      ],
      en: [
        "It's {a.rel}'s birthday tomorrow. You forgot. You have {w:at_place} and [[twenty|fifteen|thirty]] minutes before closing.",
        "For {a.rel}'s birthday, the family is chipping in. Your brother suggests {w:gift}. You have a better idea. Well, an idea.",
        "{a.rel} is turning {a.age}. {a:He|She} said 'I don't want anything'. Everyone knows that's a trap.",
        "{a.rel}'s birthday is this weekend. Your last gift idea was {w:gift}. That mistake must not happen again.",
      ],
    },
    choices: [
      {
        label: { fr: 'Cadeau fait main', en: 'Handmade gift' },
        out: [
          { w: 2, text: { fr: ["J'ai fabriqué un cadre photo avec des pâtes et de la colle. {a:Mon père|Ma mère} a pleuré et l'a accroché au salon. Il perd une pâte par semaine.", "J'ai écrit un poème. Il ne rimait pas. {a:Mon père|Ma mère} l'a lu trois fois en reniflant."], en: ["I made a photo frame out of pasta and glue. {a:My dad|My mom} cried and hung it in the living room. It loses a noodle a week.", "I wrote a poem. It didn't rhyme. {a:My dad|My mom} read it three times, sniffling."] }, fx: { happy: 5, rel: 12, karma: 2 }, mood: 'love' },
          { w: 1, text: { fr: ["Mon cadeau fait main ressemblait à {w:object}. {a:Mon père|Ma mère} a dit « oh, un… euh… merci ». Je l'ai vu{a:|e} le ranger au grenier.", "J'ai voulu faire un gâteau. J'ai fait {w:smell} dans toute la maison. {a:Mon père|Ma mère} m'a emmené{|e} au resto pour éviter la suite."], en: ["My handmade gift looked like {w:object}. {a:My dad|My mom} said 'oh, a... uh... thanks'. I saw {a.him} put it in the attic.", "I tried to bake a cake. I made {w:smell} fill the whole house. {a:My dad|My mom} took me out to eat to avoid what came next."] }, fx: { happy: -2, rel: 3 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Acheter en panique', en: 'Panic-buy something' },
        text: { fr: ["J'ai acheté {w:gift} à la station-service, avec un paquet de chips en bonus. {a:Mon père|Ma mère} a fait semblant d'être ravi{a:|e}. On connaît la chanson.", "J'ai offert une carte cadeau achetée au dernier moment. {a:Mon père|Ma mère} a dit « c'est pratique ». Le mot le plus triste de la langue française."], en: ["I bought {w:gift} at a gas station, with a bonus bag of chips. {a:My dad|My mom} pretended to be thrilled. We know the drill.", "I gave a last-minute gift card. {a:My dad|My mom} said 'how practical'. The saddest phrase in the language."] },
        fx: { happy: 1, rel: 2, money: -40 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Le gros cadeau', en: 'The big gift' },
        text: { fr: ["J'ai offert un week-end {w:far_place}. {a:Mon père|Ma mère} m'a serré{|e} si fort que j'ai entendu une côte craquer. La sienne, j'espère.", "J'ai payé un dîner dans un vrai restaurant. {a:Mon père|Ma mère} a gardé le menu en souvenir et raconte à tout le monde que je « réussis ma vie »."], en: ["I gave a weekend {w:far_place}. {a:My dad|My mom} hugged me so hard I heard a rib crack. Theirs, I hope.", "I paid for dinner at a real restaurant. {a:My dad|My mom} kept the menu as a souvenir and tells everyone I'm 'doing great in life'."] },
        fx: { happy: 6, rel: 15, money: -600 },
        mood: 'love',
      },
    ],
  },
  // ───────────────────────────── Christmas ─────────────────────────────
  {
    id: 'ho_xmas_fake_santa',
    icon: '🎅',
    cat: 'holiday',
    rating: 0,
    cooldown: 3,
    when: { age: [4, 8] },
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "Le Père Noël est venu au réveillon familial ! Il a les mêmes chaussures que ton oncle, la même voix que ton oncle et il sent {w:smell}, comme ton oncle.",
        "Le Père Noël vient de sonner. Sa barbe tient avec du scotch et il a demandé où étaient « les toilettes, comme d'habitude ».",
        "Le Père Noël distribue les cadeaux dans le salon. Tu remarques que ton oncle est parti « acheter du pain » pile au même moment. Un 24 décembre à 22 h.",
        "Pendant que le Père Noël te tend {w:gift}, sa barbe glisse. En dessous, il y a la moustache de ton oncle. Tout le monde te regarde.",
      ],
      en: [
        "Santa came to the family Christmas Eve! He has the same shoes as your uncle, the same voice as your uncle, and he gives off {w:smell}, just like your uncle.",
        "Santa just rang the bell. His beard is held on with tape and he asked where 'the bathroom is, as usual'.",
        "Santa is handing out presents in the living room. You notice your uncle went out 'to buy bread' at the exact same time. On December 24th at 10 p.m.",
        "As Santa hands you {w:gift}, his beard slips. Underneath is your uncle's mustache. Everyone is looking at you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire semblant d\'y croire', en: 'Pretend to believe' },
        text: { fr: ["J'ai fait semblant. Il a eu l'air si soulagé que j'ai eu un deuxième cadeau. Je viens de comprendre comment marche le monde.", "J'ai dit « Merci Père Noël » en appuyant sur chaque mot. Mon oncle a transpiré sous sa barbe. On se comprend, lui et moi."], en: ["I pretended. He looked so relieved I got a second present. I just figured out how the world works.", "I said 'Thank you, Santa' stressing every word. My uncle sweated under his beard. We understand each other now."] },
        fx: { happy: 5, smarts: 2 },
        mood: 'happy',
      },
      {
        label: { fr: 'Tirer sur la barbe', en: 'Yank the beard' },
        out: [
          { w: 2, text: { fr: ["J'ai tiré. La barbe est venue, avec le scotch et un peu de vraie moustache. Mon oncle a hurlé un gros mot. Mes cousins pleurent encore.", "J'ai démasqué le Père Noël devant toute la famille. Mes petits cousins ont perdu la foi. Je suis devenu{|e} le méchant de Noël."], en: ["I pulled. The beard came off, with the tape and some real mustache. My uncle yelled a swear word. My cousins are still crying.", "I unmasked Santa in front of the whole family. My little cousins lost their faith. I became the Christmas villain."] }, fx: { happy: 2, karma: -4, smarts: 2 }, mood: 'shock' },
          { w: 1, text: { fr: ["La barbe était vraie. C'était un vrai vieux monsieur avec une vraie barbe. Personne ne sait qui l'a invité. Il est resté pour le dessert.", "J'ai tiré, rien n'est venu. C'était vraiment le Père Noël. Ou un voisin très poilu. Je crois à nouveau."], en: ["The beard was real. It was a real old man with a real beard. Nobody knows who invited him. He stayed for dessert.", "I pulled, nothing came off. It really was Santa. Or a very hairy neighbor. I believe again."] }, fx: { happy: 6 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'ho_xmas_presents_kid',
    icon: '🎄',
    cat: 'holiday',
    rating: 0,
    cooldown: 2,
    when: { age: [3, 11] },
    scene: { place: 'home', mood: 'happy' },
    text: {
      fr: [
        "Matin de Noël ! Sous le sapin, il y a un énorme paquet à ton nom. Tu le secoues. Il fait {w:sound}.",
        "C'est Noël. Tu avais demandé une console. Le paquet a une forme suspecte. On dirait {w:gift}.",
        "Il est [[5|6|4]] h du matin, c'est Noël et tes parents dorment. Les cadeaux sont sous le sapin. Personne ne te voit.",
        "Ouverture des cadeaux de Noël. Ta cousine a eu une console. Toi, tu as eu {w:gift} et un livre sur les volcans.",
      ],
      en: [
        "Christmas morning! Under the tree is a huge package with your name on it. You shake it. It goes {w:sound}.",
        "It's Christmas. You asked for a console. The package has a suspicious shape. It looks like {w:gift}.",
        "It's [[5|6|4]] a.m. on Christmas and your parents are asleep. The presents are under the tree. No one is watching.",
        "Present time. Your cousin got a console. You got {w:gift} and a book about volcanoes.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout déballer', en: 'Rip everything open' },
        out: [
          { w: 2, text: { fr: ["J'ai déballé tous les cadeaux, même ceux qui n'étaient pas à moi. Il y avait la console, cachée sous le papier de ma sœur. Noël, c'est le chaos.", "Papier partout, cris de joie, et le chat coincé dans un carton. Le plus beau matin de l'année."], en: ["I opened every present, even the ones that weren't mine. The console was hiding under my sister's wrapping. Christmas is chaos.", "Paper everywhere, screams of joy, and the cat stuck in a box. Best morning of the year."] }, fx: { happy: 9 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai ouvert le cadeau de mamie avant tout le monde. C'était {w:gift}. J'ai pleuré, mamie a pleuré, le chien a vomi du papier cadeau.", "J'ai déballé un cadeau qui était pour ma mère. C'était de la lingerie. J'ai demandé ce que c'était. Il y a eu un long silence."], en: ["I opened Grandma's present before anyone else. It was {w:gift}. I cried, Grandma cried, the dog threw up wrapping paper.", "I unwrapped a present meant for my mom. It was lingerie. I asked what it was. There was a long silence."] }, fx: { happy: -2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Dire merci poliment', en: 'Say thanks politely' },
        text: { fr: ["J'ai dit merci pour chaque cadeau, même le livre sur les volcans. Mamie m'a glissé un billet de vingt. La politesse, c'est rentable.", "J'ai fait un câlin à tout le monde. Ma tante a dit que j'étais « bien élevé{|e} ». J'ai eu le droit à une deuxième part de bûche."], en: ["I said thank you for every present, even the volcano book. Grandma slipped me a twenty. Manners pay.", "I hugged everyone. My aunt said I was 'so well raised'. I got a second slice of Yule log."] },
        fx: { happy: 4, karma: 2, money: 20 },
        mood: 'happy',
      },
      {
        label: { fr: 'Bouder', en: 'Sulk' },
        text: { fr: ["J'ai boudé sous le sapin toute la matinée. Une boule m'est tombée sur la tête. Même le sapin était contre moi.", "J'ai boudé jusqu'au déjeuner. Puis j'ai découvert que le livre sur les volcans était génial. Je ne l'ai dit à personne."], en: ["I sulked under the tree all morning. An ornament fell on my head. Even the tree was against me.", "I sulked until lunch. Then I discovered the volcano book was awesome. I told no one."] },
        fx: { happy: -3, smarts: 2 },
        mood: 'angry',
      },
    ],
  },
  {
    id: 'ho_xmas_jumper',
    icon: '🧶',
    cat: 'holiday',
    rating: 2,
    cooldown: 3,
    when: { age: [18, 80], has: 'anyFriend' },
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'party', fx: 'explosion' },
    text: {
      fr: [
        "{a.first} organise une soirée « Pull de Noël moche ». Le gagnant remporte {w:drink} et le respect éternel. Le tien a des LED, une batterie de scooter et un renne en relief.",
        "Concours de pulls de Noël chez {a.first}. Le favori porte un pull où un renne monte un autre renne. Tu as un sérieux concurrent.",
        "Soirée pulls moches. Ton pull clignote, joue {w:song} en boucle et commence à sentir {w:smell}. Il chauffe un peu au niveau du ventre.",
        "{a.first} t'a tricoté un pull de Noël pour la soirée. Il y a un sapin dessus. Enfin, tu crois que c'est un sapin. Tout le monde pense que c'est autre chose.",
      ],
      en: [
        "{a.first} is throwing an 'Ugly Christmas Sweater' party. The winner gets {w:drink} and eternal respect. Yours has LEDs, a scooter battery and a 3D reindeer.",
        "Christmas sweater contest at {a.first}'s. The favorite is wearing a sweater with one reindeer mounting another. You have serious competition.",
        "Ugly sweater party. Your sweater blinks, plays {w:song} on loop and is starting to give off {w:smell}. It's getting warm around the belly.",
        "{a.first} knitted you a Christmas sweater for the party. There's a tree on it. Well, you think it's a tree. Everyone else thinks it's something else.",
      ],
    },
    choices: [
      {
        label: { fr: 'Pousser les LED à fond', en: 'Max out the LEDs' },
        out: [
          { w: 2, text: { fr: ["Mon pull a fait sauter les plombs de l'immeuble. Dans le noir, il était la seule lumière. J'ai gagné. On m'appelle le Phare.", "J'ai clignoté si fort qu'un épileptique imaginaire a porté plainte. Premier prix, et une fan qui m'a suivi{|e} jusqu'aux toilettes."], en: ["My sweater blew the fuses for the whole building. In the dark, it was the only light. I won. They call me the Lighthouse.", "I blinked so hard an imaginary neighbor filed a complaint. First prize, and a fan who followed me to the bathroom."] }, fx: { happy: 10, fame: 1 }, mood: 'party' },
          { w: 1, text: { fr: ["La batterie a pris feu. Le renne en relief a fondu sur mon torse. J'ai maintenant un renne tatoué au troisième degré. Il est très ressemblant.", "Court-circuit. J'ai pris une décharge, mes cheveux se sont dressés, j'ai pété fort devant tout le monde. On a cru que c'était l'animation."], en: ["The battery caught fire. The 3D reindeer melted onto my chest. I now have a third-degree reindeer tattoo. It's very lifelike.", "Short circuit. I got zapped, my hair stood up, and I farted loudly in front of everyone. They thought it was part of the show."] }, fx: { happy: -4, health: -10, disease: 'burns', visual: 'fire' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'L\'enlever', en: 'Take it off' },
        text: { fr: ["J'ai enlevé le pull. En dessous, je n'avais rien. Ça a été plus remarqué que le pull. J'ai gagné dans une autre catégorie.", "J'ai retiré mon pull et j'ai passé la soirée en t-shirt « {w:brand} ». Personne ne m'a parlé. Le pull, lui, a eu deux numéros."], en: ["I took off the sweater. I had nothing on underneath. It got more attention than the sweater. I won a different category.", "I took off my sweater and spent the night in a '{w:brand}' T-shirt. Nobody talked to me. The sweater got two phone numbers."] },
        fx: { happy: 4, looks: 1 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_xmas_uncle_turkey',
    icon: '🦃',
    cat: 'family',
    rating: 2,
    cooldown: 3,
    when: { age: [18, 90] },
    scene: { place: 'home', mood: 'shock', fx: 'gore' },
    text: {
      fr: [
        "Réveillon. Ton oncle, à son [[quatrième|sixième|huitième]] verre, insiste pour découper la dinde avec un couteau électrique. Il tient le couteau par le mauvais bout.",
        "Ton oncle a déjà bu {w:drink}, le vin blanc et le fond de l'Armagnac de mamie. Il se lève pour découper la dinde « comme un samouraï ».",
        "À Noël, ton oncle raconte pour la [[dixième|vingtième]] fois comment il a rencontré {w:celeb}, couteau à découper à la main, en faisant de grands gestes.",
        "Ton oncle a décidé de flamber la dinde. Avec du rhum. Sous le lustre. Dans la salle à manger. Il crie « {w:exclaim} » en sortant le briquet.",
      ],
      en: [
        "Christmas Eve. Your uncle, on his [[fourth|sixth|eighth]] drink, insists on carving the turkey with an electric knife. He's holding it by the wrong end.",
        "Your uncle already drank {w:drink}, the white wine and the dregs of Grandma's brandy. He stands up to carve the turkey 'like a samurai'.",
        "At Christmas, your uncle tells for the [[tenth|twentieth]] time how he met {w:celeb}, carving knife in hand, gesturing wildly.",
        "Your uncle decided to flambé the turkey. With rum. Under the chandelier. In the dining room. He yells '{w:exclaim}' as he pulls out the lighter.",
      ],
    },
    choices: [
      {
        label: { fr: 'Lui prendre le couteau', en: 'Take the knife' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["Je lui ai arraché le couteau en plein élan. J'ai découpé la dinde moi-même. Mamie m'a regardé{|e} comme le nouveau chef de famille.", "Plaquage digne d'un rugbyman. L'oncle est tombé dans la bûche. La dinde est sauve. Moi aussi."], en: ["I snatched the knife mid-swing. I carved the turkey myself. Grandma looked at me like the new head of the family.", "A rugby-grade tackle. My uncle landed in the Yule log. The turkey is safe. So am I."] }, fx: { happy: 6, karma: 3 }, mood: 'proud' },
          { w: 1, text: { fr: ["Dans la bagarre, le couteau électrique a sectionné le bout de son doigt. Il a giclé sur la dinde comme du ketchup. Le doigt a fini dans la farce. On l'a retrouvé au dessert.", "Le couteau m'a frôlé{|e}. Il a coupé ma frange, la nappe et le câble de la guirlande. Noir total. Quelqu'un a hurlé. Probablement moi."], en: ["In the scuffle, the electric knife took off the tip of his finger. It squirted onto the turkey like ketchup. The finger ended up in the stuffing. We found it at dessert.", "The knife grazed me. It cut my bangs, the tablecloth and the string-light cable. Total darkness. Someone screamed. Probably me."] }, fx: { happy: -5, stress: 10, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Filmer pour la postérité', en: 'Film it for posterity' },
        out: [
          { w: 2, text: { fr: ["J'ai filmé. La dinde a pris feu, puis le lustre, puis la moustache de l'oncle. La vidéo a [[deux cent mille|un million|quatre millions]] de vues. L'oncle a maintenant un surnom national.", "Il a découpé la dinde, la table et un bout de sa chemise. Le son de ma vidéo, c'est juste mamie qui crie « {w:exclaim} » en boucle."], en: ["I filmed. The turkey caught fire, then the chandelier, then my uncle's mustache. The video has [[two hundred thousand|a million|four million]] views. My uncle now has a national nickname.", "He carved the turkey, the table and part of his shirt. The audio on my video is just Grandma screaming '{w:exclaim}' on loop."] }, fx: { happy: 6, followers: 4000, fame: 2, karma: -2 }, mood: 'party' },
          { w: 1, text: { fr: ["Une giclée de jus de dinde brûlant m'a atteint en plein objectif. Mon téléphone est mort. Mon œil a survécu de justesse.", "L'oncle m'a vu filmer et m'a lancé la cuisse de dinde. En pleine tête. J'ai eu un bleu en forme de pilon pendant une semaine."], en: ["A spurt of boiling turkey juice hit my lens dead-on. My phone died. My eye barely survived.", "My uncle saw me filming and threw the turkey leg at me. Right in the head. I had a drumstick-shaped bruise for a week."] }, fx: { happy: -3, health: -4 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Fuir à la cuisine', en: 'Flee to the kitchen' },
        text: { fr: ["Je me suis réfugié{|e} dans la cuisine avec la bûche et une fourchette. J'ai entendu des cris, une sirène, puis le silence. La bûche était délicieuse.", "J'ai fui avec mamie. On a mangé {w:food} en cachette pendant que le salon brûlait doucement. Mamie a dit : « Tous les ans, c'est pareil. »"], en: ["I hid in the kitchen with the Yule log and a fork. I heard screams, a siren, then silence. The Yule log was delicious.", "I fled with Grandma. We secretly ate {w:food} while the living room gently burned. Grandma said: 'Same thing every year.'"] },
        fx: { happy: 4, weight: 0.02 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_xmas_sibling_fight',
    icon: '🍷',
    cat: 'family',
    rating: 1,
    cooldown: 3,
    when: { age: [18, 90], has: 'sibling' },
    actor: 'sibling',
    scene: { place: 'home', mood: 'angry' },
    text: {
      fr: [
        "Dîner de Noël. {a.first} lance, la bouche pleine de foie gras : « En tout cas, moi, je ne suis pas le préféré, contrairement à certains. »",
        "Repas de Noël. {a.first} vient de rappeler à toute la table l'épisode de 2009 avec {w:object}. Tu avais juré de ne jamais en reparler.",
        "Au moment du fromage, {a.first} demande qui va « récupérer la maison de papa et maman quand ils seront morts ». Les parents sont à table.",
        "Le repas de Noël dégénère. {a.first} t'accuse d'avoir offert {w:gift} uniquement pour te faire bien voir. C'est exactement ça, mais quand même.",
      ],
      en: [
        "Christmas dinner. {a.first} says, mouth full of foie gras: 'Well, at least I'm not the favorite, unlike some people.'",
        "Christmas dinner. {a.first} just reminded the whole table about the 2009 incident with {w:object}. You swore never to speak of it again.",
        "During the cheese course, {a.first} asks who will 'get Mom and Dad's house when they die'. Mom and Dad are at the table.",
        "Christmas dinner is going downhill. {a.first} accuses you of giving {w:gift} just to look good. That's exactly it, but still.",
      ],
    },
    choices: [
      {
        label: { fr: 'Contre-attaquer', en: 'Strike back' },
        out: [
          { w: 2, text: { fr: ["J'ai ressorti son divorce, sa garde à vue de 2015 et son tatouage raté. Le silence a duré jusqu'à la bûche. J'ai gagné, mais à quel prix.", "J'ai rappelé qu'{a.he} avait pleuré devant « Bambi » à vingt-six ans. Toute la table a ri. {a.first} est parti{a:|e} bouder dans sa voiture."], en: ["I brought up {a.his} divorce, the 2015 night in custody and the botched tattoo. The silence lasted until dessert. I won, but at what cost.", "I reminded everyone {a.he} cried at 'Bambi' at age twenty-six. The whole table laughed. {a.first} went to sulk in {a.his} car."] }, fx: { happy: 4, rel: -12, karma: -2 }, mood: 'angry' },
          { w: 1, text: { fr: ["La dispute est montée si haut que maman a renversé la saucière. Papa a dit « {w:swear} » pour la première fois de sa vie. Noël est annulé l'an prochain.", "On s'est jeté les marrons à la figure. J'en ai pris un dans l'œil. Les enfants ont trouvé ça super."], en: ["The fight got so heated Mom knocked over the gravy boat. Dad said '{w:swear}' for the first time in his life. Next year's Christmas is canceled.", "We threw chestnuts at each other. I took one in the eye. The kids loved it."] }, fx: { happy: -6, rel: -15, stress: 8 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Changer de sujet', en: 'Change the subject' },
        text: { fr: ["J'ai dit très fort : « Et sinon, qui veut {w:food} ? » Ça n'avait aucun sens. Ça a marché quand même.", "J'ai annoncé que je me mettais {w:hobby}. Toute la famille s'est retournée contre ma nouvelle passion. Paix retrouvée, à mes dépens."], en: ["I said very loudly: 'Anyway, who wants {w:food}?' It made no sense. It worked anyway.", "I announced I'm taking up {w:hobby}. The whole family turned on my new hobby. Peace restored, at my expense."] },
        fx: { happy: 2, rel: 2, smarts: 1 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Boire en silence', en: 'Drink in silence' },
        text: { fr: ["J'ai bu, souri et hoché la tête. Vers minuit, je dormais sur le canapé avec un chapeau en papier. Noël réussi.", "J'ai vidé la bouteille de vin rouge sans dire un mot. J'ai fini par chanter {w:song} en larmes. Tout le monde s'est réconcilié contre moi."], en: ["I drank, smiled and nodded. Around midnight, I was asleep on the couch in a paper hat. Successful Christmas.", "I emptied the red wine without saying a word. I ended up singing {w:song} in tears. Everyone united against me."] },
        fx: { happy: 1, health: -3, stress: -3 },
        mood: 'sleepy',
      },
    ],
  },
  {
    id: 'ho_xmas_tree_fire',
    icon: '🎄',
    cat: 'holiday',
    rating: 2,
    cooldown: 4,
    when: { age: [18, 90] },
    scene: { place: 'home', mood: 'shock', fx: 'fire' },
    text: {
      fr: [
        "Ton sapin de Noël a [[trois|cinq|six]] semaines, il est sec comme une biscotte et les guirlandes chinoises grésillent. Il sent {w:smell}.",
        "Tu as acheté de vraies bougies pour le sapin, « comme dans l'ancien temps ». Il y a une raison pour laquelle on ne fait plus ça.",
        "Le chat vient de grimper dans le sapin. Le sapin penche. Les guirlandes électriques tirent sur la prise. Tout est sur le point de devenir un film catastrophe.",
        "Il est 2 h du matin, ton sapin crépite. Tu as entendu {w:sound}. Ça venait du sapin.",
      ],
      en: [
        "Your Christmas tree is [[three|five|six]] weeks old, dry as a cracker, and the cheap string lights are buzzing. It gives off {w:smell}.",
        "You bought real candles for the tree, 'like in the old days'. There's a reason people stopped doing that.",
        "The cat just climbed into the tree. The tree is leaning. The lights are tugging at the outlet. Everything is about to become a disaster movie.",
        "It's 2 a.m., and your tree is crackling. You heard {w:sound}. It came from the tree.",
      ],
    },
    choices: [
      {
        label: { fr: 'Éteindre à la bouteille', en: 'Douse it with a bottle' },
        out: [
          { w: 1, text: { fr: ["J'ai jeté ce que j'avais sous la main : du champagne. Il y avait un fond de rhum dedans. Le sapin a explosé en boule de feu. J'ai perdu mes sourcils et un mur.", "J'ai versé {w:drink} sur le sapin. Il a mieux brûlé. Les pompiers ont fait une photo pour leur calendrier."], en: ["I threw what I had on hand: champagne. There was some rum in it. The tree went up in a fireball. I lost my eyebrows and a wall.", "I poured {w:drink} on the tree. It burned better. The firefighters took a photo for their calendar."] }, fx: { happy: -8, health: -8, money: -1500, disease: 'burns', visual: 'explosion' }, mood: 'shock' },
          { w: 2, text: { fr: ["Une carafe d'eau, un geste sûr, et le feu s'est éteint. Le sapin est maintenant à moitié noir. Je l'ai gardé. Ça fait gothique.", "J'ai éteint le feu avec la carafe et la bûche de Noël. La bûche était en trop, mais je ne regrette rien."], en: ["A water jug, a steady hand, and the fire was out. The tree is half black now. I kept it. It's very gothic.", "I put out the fire with the water jug and the Yule log. The Yule log was overkill, but no regrets."] }, fx: { happy: 2, stress: 5 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Le jeter par la fenêtre', en: 'Throw it out the window' },
        out: [
          { w: 2, text: { fr: ["J'ai balancé le sapin en feu par la fenêtre. Il a atterri sur la voiture du syndic. Je ne vais pas dire que je n'ai pas visé.", "Le sapin enflammé a traversé la nuit comme une comète. Les voisins ont applaudi. Quelqu'un a fait un vœu."], en: ["I hurled the burning tree out the window. It landed on the building manager's car. I won't say I didn't aim.", "The flaming tree crossed the night like a comet. The neighbors clapped. Someone made a wish."] }, fx: { happy: 6, karma: -2 }, mood: 'party' },
          { w: 1, text: { fr: ["Le sapin s'est coincé dans l'encadrement de la fenêtre. Il a brûlé là, en travers, comme une décoration infernale. J'habite désormais chez ma mère.", "J'ai glissé sur une boule. Le sapin et moi sommes passés par la fenêtre ensemble. Heureusement, rez-de-chaussée. Je me suis cassé {w:bodypart}."], en: ["The tree got stuck in the window frame. It burned there, sideways, like a decoration from hell. I now live at my mom's.", "I slipped on an ornament. The tree and I went out the window together. Ground floor, luckily. I broke my {w:bodypart}."] }, fx: { happy: -6, health: -8, money: -800 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Appeler les pompiers', en: 'Call the firefighters' },
        text: { fr: ["J'ai appelé les pompiers. Ils sont venus en quatre minutes, ont éteint le sapin et mangé mes chocolats. Le plus beau d'entre eux m'a souhaité « bon courage ». J'ai rougi.", "Les pompiers ont tout noyé. Mon salon est une piscine. Le chat a survécu, perché sur le lustre, l'air de dire que c'était ma faute."], en: ["I called the firefighters. They came in four minutes, put out the tree and ate my chocolates. The hottest one wished me 'good luck'. I blushed.", "The firefighters flooded everything. My living room is a pool. The cat survived on top of the chandelier, looking like it was my fault."] },
        fx: { happy: -2, money: -300, karma: 2 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 'ho_xmas_mass',
    icon: '⛪',
    cat: 'holiday',
    rating: 2,
    cooldown: 4,
    when: { age: [18, 90] },
    scene: { place: 'castle', mood: 'shock' },
    text: {
      fr: [
        "Ta grand-mère t'a traîné{|e} à la messe de minuit. Il fait froid, l'orgue joue faux et tu as mangé {w:food} au réveillon. Ton ventre gronde dangereusement.",
        "Messe de minuit. Le silence est total. Le curé lève les bras. Ton intestin choisit ce moment pour produire {w:sound}.",
        "À la messe de minuit, tu es assis{|e} derrière ton ex, qui est venu{|e} avec quelqu'un de plus beau que toi. La chorale chante « Douce nuit ».",
        "Tu t'es endormi{|e} pendant le sermon de la messe de minuit. Tu te réveilles en sursaut, la bouche ouverte, un filet de bave sur l'épaule de ta voisine.",
      ],
      en: [
        "Your grandma dragged you to midnight mass. It's cold, the organ is out of tune, and you ate {w:food} at dinner. Your stomach is growling dangerously.",
        "Midnight mass. Total silence. The priest raises his arms. Your bowels choose this moment to produce {w:sound}.",
        "At midnight mass, you're sitting behind your ex, who came with someone hotter than you. The choir is singing 'Silent Night'.",
        "You fell asleep during the midnight mass sermon. You jolt awake, mouth open, a string of drool on the shoulder of the lady next to you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Retenir, prier, serrer', en: 'Hold it, pray, clench' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai serré pendant une heure et quart. J'ai vu Dieu, je crois. Il m'a fait un clin d'œil. J'ai couru jusqu'aux toilettes de la mairie.", "J'ai tenu. Héroïquement. Les cantiques n'ont jamais été aussi longs. Mamie a dit que j'avais l'air « très recueilli{|e} »."], en: ["I clenched for an hour and fifteen minutes. I saw God, I think. He winked at me. I ran to the town hall bathroom.", "I held it. Heroically. The hymns have never been longer. Grandma said I looked 'very devout'."] }, fx: { discipline: 3, stress: 6, happy: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai lâché pendant le « Gloria ». L'acoustique de l'église a fait le reste : l'écho a duré quatre secondes. Le curé s'est arrêté. Un enfant a applaudi.", "Ça a lâché. Pas un bruit, mais une odeur. Une odeur biblique. Trois rangées ont changé de place. Mamie a fait semblant de ne pas me connaître."], en: ["I let it rip during the 'Gloria'. The church acoustics did the rest: the echo lasted four seconds. The priest stopped. A child applauded.", "It escaped. No sound, but a smell. A biblical smell. Three rows moved. Grandma pretended not to know me."] }, fx: { happy: -4, karma: -1, fame: 1, visual: 'poop' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Chanter très fort', en: 'Sing very loudly' },
        text: { fr: ["J'ai chanté plus fort que la chorale, en inventant les paroles. Le curé m'a proposé de rejoindre la chorale « pour me surveiller ».", "J'ai chanté « Il est né le divin enfant » en le mixant avec {w:song}. Le petit Jésus en plâtre a eu l'air vexé."], en: ["I sang louder than the choir, making up the words. The priest invited me to join the choir 'so he can keep an eye on me'.", "I sang 'O Come All Ye Faithful' mashed up with {w:song}. The plaster baby Jesus looked offended."] },
        fx: { happy: 5, karma: 1 },
        mood: 'happy',
      },
      {
        label: { fr: 'Sortir fumer', en: 'Step out for a smoke' },
        text: { fr: ["Je suis sorti{|e} fumer sur le parvis. J'y ai trouvé la moitié de la paroisse, le sacristain et un flasque de calva. Meilleure messe de ma vie.", "J'ai fui sur le parvis. Il neigeait. J'ai partagé une cigarette avec un Roi mage de la crèche vivante. Il s'appelle Kevin."], en: ["I went out for a smoke on the church steps. Found half the parish, the sexton and a flask of apple brandy. Best mass of my life.", "I fled to the steps. It was snowing. I shared a cigarette with a Wise Man from the living nativity. His name is Kevin."] },
        fx: { happy: 4, health: -2, karma: -1 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_xmas_host_turkey',
    icon: '🍗',
    cat: 'holiday',
    rating: 2,
    cooldown: 4,
    when: { age: [24, 80], movedOut: true },
    scene: { place: 'apartment', mood: 'shock' },
    text: {
      fr: [
        "Cette année, c'est toi qui reçois pour Noël. Douze personnes, une dinde de [[six|huit|neuf]] kilos et un four qui date du siècle dernier. La dinde est encore congelée. Il est 18 h.",
        "Tu reçois toute la famille pour Noël. Ta belle-mère inspecte ta cuisine comme un huissier. La dinde fait {w:sound} dans le four.",
        "Premier Noël chez toi. Tu as suivi la recette d'un influenceur sur {w:app}. Ta dinde est fourrée avec {w:food}. Personne n'est au courant.",
        "Noël à la maison. Le four vient de lâcher, la dinde est crue et tes invités arrivent dans vingt minutes avec {w:gift} et beaucoup d'attentes.",
      ],
      en: [
        "This year, you're hosting Christmas. Twelve people, a [[thirteen|seventeen|twenty]]-pound turkey and an oven from last century. The turkey is still frozen. It's 6 p.m.",
        "You're hosting the whole family for Christmas. Your mother-in-law inspects your kitchen like a bailiff. The turkey goes {w:sound} in the oven.",
        "First Christmas at your place. You followed a recipe from an influencer on {w:app}. Your turkey is stuffed with {w:food}. Nobody knows.",
        "Christmas at home. The oven just died, the turkey is raw and your guests arrive in twenty minutes with {w:gift} and great expectations.",
      ],
    },
    choices: [
      {
        label: { fr: 'Servir quand même', en: 'Serve it anyway' },
        out: [
          { w: 1, text: { fr: ["La dinde était rose à l'intérieur. Le lendemain, douze personnes se disputaient deux toilettes. Ma belle-mère a repeint la baignoire. Noël restera dans l'histoire, et dans les canalisations.", "Gastro collective. Mon oncle a explosé dans le jardin, ma cousine dans l'évier. Le sapin a été touché. On parle encore du « Noël brun »."], en: ["The turkey was pink inside. Next day, twelve people were fighting over two toilets. My mother-in-law repainted the bathtub. This Christmas will go down in history, and down the pipes.", "Group food poisoning. My uncle erupted in the garden, my cousin in the sink. The tree took a hit. People still talk about the 'Brown Christmas'."] }, fx: { happy: -8, health: -8, disease: 'food_poisoning', visual: 'poop' }, mood: 'sick' },
          { w: 2, text: { fr: ["La dinde était sèche comme un pneu, mais avec assez de sauce, tout le monde a fait semblant. Ma belle-mère a dit « c'est original ». J'ai pris ça comme un compliment.", "J'ai servi la dinde dans le noir « pour l'ambiance ». Personne n'a vu qu'elle était à moitié brûlée. Gros succès."], en: ["The turkey was dry as a tire, but with enough gravy, everyone pretended. My mother-in-law said 'how original'. I took it as a compliment.", "I served the turkey in the dark 'for ambiance'. Nobody saw it was half burnt. Big hit."] }, fx: { happy: 4, stress: 4 }, mood: 'happy' },
        ],
      },
      {
        label: { fr: 'Commander des pizzas', en: 'Order pizza' },
        text: { fr: ["J'ai commandé quinze pizzas et je les ai servies dans de la vaisselle de mamie. Les enfants m'adorent. Les adultes aussi, secrètement.", "J'ai appelé tous les restos ouverts le 24. Seul le kebab répondait. Noël sauce samouraï. Mon père a pleuré de bonheur."], en: ["I ordered fifteen pizzas and served them on Grandma's china. The kids adore me. The adults do too, secretly.", "I called every place open on the 24th. Only the kebab shop answered. Hot-sauce Christmas. My dad cried with joy."] },
        fx: { happy: 6, money: -250, stress: -4 },
        mood: 'party',
      },
      {
        label: { fr: 'Accuser le four', en: 'Blame the oven' },
        text: { fr: ["J'ai fait un discours accusant le four, le gouvernement et le réchauffement climatique. Ma belle-mère a sorti un gratin de son sac. Elle avait prévu. Elle prévoit toujours.", "J'ai accusé le four {w:excuse}. Personne n'y a cru. On a mangé les chips de l'apéro et la bûche. Très bon Noël, objectivement."], en: ["I gave a speech blaming the oven, the government and climate change. My mother-in-law pulled a casserole out of her bag. She'd planned ahead. She always does.", "I blamed the oven {w:excuse}. Nobody bought it. We ate the appetizer chips and the Yule log. Very good Christmas, objectively."] },
        fx: { happy: 2, stress: 2, smarts: 1 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 'ho_xmas_inlaws',
    icon: '🏡',
    cat: 'family',
    rating: 1,
    cooldown: 3,
    when: { age: [22, 85], has: 'spouse' },
    actor: 'spouse',
    scene: { place: 'villa', mood: 'neutral' },
    text: {
      fr: [
        "Noël chez les parents de {a.first}. Ton beau-père t'offre {w:gift}. Il l'avait déjà offert l'an dernier. À toi.",
        "Réveillon chez ta belle-famille. On t'a installé{|e} sur la chaise pliante, en bout de table, à côté du cousin qui pense {w:conspiracy}.",
        "Noël chez tes beaux-parents. Ta belle-mère t'appelle par le prénom de l'ex de {a.first}. Pour la [[deuxième|troisième|cinquième]] fois.",
        "Chez ta belle-famille pour Noël. Le chien de ta belle-sœur s'est attaché à ta jambe et refuse de la lâcher. Tout le monde trouve ça « mignon ».",
      ],
      en: [
        "Christmas at {a.first}'s parents. Your father-in-law gives you {w:gift}. He gave you the same thing last year.",
        "Christmas Eve with the in-laws. They put you on the folding chair at the end of the table, next to the cousin who believes {w:conspiracy}.",
        "Christmas at your in-laws'. Your mother-in-law calls you by {a.first}'s ex's name. For the [[second|third|fifth]] time.",
        "Christmas with the in-laws. Your sister-in-law's dog has latched onto your leg and won't let go. Everyone finds it 'adorable'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Sourire jusqu\'au bout', en: 'Smile through it' },
        text: { fr: ["J'ai souri de 19 h à 1 h du matin. J'ai des crampes aux joues. {a.first} m'a dit merci dans la voiture. C'était le plus beau cadeau.", "J'ai été parfait{|e}. Ma belle-mère m'a dit « tu es mieux que l'autre ». J'ai décidé de le prendre bien."], en: ["I smiled from 7 p.m. to 1 a.m. My cheeks are cramping. {a.first} thanked me in the car. Best present of all.", "I was perfect. My mother-in-law told me 'you're better than the last one'. I decided to take that well."] },
        fx: { happy: 2, rel: 10, stress: 6 },
        mood: 'neutral',
      },
      {
        label: { fr: 'Boire le vin du beau-père', en: "Drink father-in-law's wine" },
        out: [
          { w: 2, text: { fr: ["J'ai attaqué la cave du beau-père. Vers minuit, on chantait ensemble {w:song}, bras dessus bras dessous. Il m'appelle « fiston » maintenant. Même si ce n'est pas ça.", "J'ai bu le grand cru qu'il gardait « pour une occasion ». Il a pleuré, puis il a ri, puis on a fini la bouteille ensemble."], en: ["I raided my father-in-law's cellar. By midnight we were singing {w:song} arm in arm. He calls me 'kiddo' now.", "I drank the vintage he was saving 'for an occasion'. He cried, then laughed, then we finished the bottle together."] }, fx: { happy: 8, rel: 4, health: -3 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai trop bu et j'ai dit à ma belle-mère ce que je pensais de sa farce. Et de son fils. Et d'elle. {a.first} conduit en silence depuis deux heures.", "J'ai vomi dans le panier du chien. Le chien m'a regardé{|e}, puis a mangé. Personne n'en parle, mais tout le monde y pense."], en: ["I drank too much and told my mother-in-law what I thought of her stuffing. And her son. And her. {a.first} has been driving in silence for two hours.", "I puked in the dog's basket. The dog looked at me, then ate it. Nobody mentions it, but everyone thinks about it."] }, fx: { happy: -4, rel: -12, health: -3 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Prétexter une urgence', en: 'Fake an emergency' },
        text: { fr: ["J'ai prétendu que mon appart était inondé. J'ai passé le réveillon seul{|e}, en caleçon, avec {w:food} et {w:show}. Le paradis.", "J'ai simulé une intoxication alimentaire. Ma belle-mère pense que c'est sa farce. Elle a pleuré. Je ne la contredirai jamais."], en: ["I claimed my apartment was flooded. I spent Christmas Eve alone in my underwear with {w:food} and {w:show}. Paradise.", "I faked food poisoning. My mother-in-law thinks it was her stuffing. She cried. I will never correct her."] },
        fx: { happy: 6, rel: -8, karma: -2 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_xmas_play_santa',
    icon: '🎅',
    cat: 'family',
    rating: 1,
    cooldown: 3,
    when: { age: [25, 65], has: 'child' },
    actor: 'child',
    scene: { place: 'home', mood: 'shock' },
    text: {
      fr: [
        "C'est toi qui joues le Père Noël cette année pour {a.first}. Le costume est loué, trop petit, et sent {w:smell}. Tu dois passer par le balcon.",
        "Pour faire rêver {a.first}, tu t'es déguisé{|e} en Père Noël. Ta barbe pique, ton ventre en coussin glisse et {a.first} te regarde avec une méfiance d'enquêteur.",
        "Déguisé{|e} en Père Noël, tu dois déposer les cadeaux de {a.first} en silence. Tu marches sur une brique de Lego. Pieds nus.",
        "{a.first} a posé un piège sous le sapin « pour attraper le Père Noël ». Tu es le Père Noël. Il y a de la glu, du fil de pêche et {w:object}.",
      ],
      en: [
        "You're playing Santa this year for {a.first}. The suit is rented, too small, and gives off {w:smell}. You have to come in through the balcony.",
        "To make {a.first}'s dreams come true, you dressed up as Santa. The beard itches, the pillow belly keeps slipping, and {a.first} studies you like a detective.",
        "Dressed as Santa, you need to drop off {a.first}'s presents silently. You step on a Lego brick. Barefoot.",
        "{a.first} set a trap under the tree 'to catch Santa'. You are Santa. There's glue, fishing line and {w:object}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Jouer le rôle à fond', en: 'Commit to the role' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["« Ho ho ho ! » J'ai été si convaincant{|e} que {a.first} a pleuré de joie. {a:Il|Elle} y croira encore deux ans. Je suis {un acteur|une actrice} de génie.", "J'ai dansé, j'ai chanté, j'ai bu le verre de lait laissé près du sapin. {a.first} m'a dessiné en Père Noël. Le dessin est sur le frigo à vie."], en: ["'Ho ho ho!' I was so convincing {a.first} cried with joy. That'll buy two more years of belief. I'm a genius actor.", "I danced, I sang, I drank the glass of milk left by the tree. {a.first} drew me as Santa. The drawing is on the fridge forever."] }, fx: { happy: 9, rel: 12 }, mood: 'love' },
          { w: 1, text: { fr: ["{a.first} a reconnu ma montre. « Papa ? » Non, « Maman » ? Bref, l'enfance s'est terminée ce soir-là, devant le sapin, à cause d'une montre.", "J'ai trébuché dans le piège. J'ai hurlé un gros mot. Le Père Noël dit des gros mots, maintenant. {a.first} les répète à l'école."], en: ["{a.first} recognized my watch. 'Dad? Mom?' Anyway, childhood ended that night, in front of the tree, because of a watch.", "I tripped on the trap. I screamed a swear word. Santa swears now. {a.first} repeats it at school."] }, fx: { happy: -4, rel: 2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Déposer et fuir', en: 'Drop and run' },
        text: { fr: ["J'ai jeté les cadeaux sous le sapin et j'ai fui comme un cambrioleur. Le voisin a appelé la police. On a expliqué. Le policier a demandé une photo.", "J'ai déposé, j'ai couru, j'ai heurté la porte vitrée. {a.first} a entendu un bruit et a dit « il est passé ! ». Oui. Il est passé. Au travers de la porte, presque."], en: ["I dumped the presents under the tree and fled like a burglar. The neighbor called the cops. We explained. The officer asked for a selfie.", "I dropped, I ran, I hit the glass door. {a.first} heard a thud and said 'he came!' Yes. He came. Almost through the door."] },
        fx: { happy: 4, rel: 5, health: -2 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_xmas_auto',
    icon: '🎄',
    cat: 'holiday',
    rating: 0,
    auto: true,
    cooldown: 2,
    when: { age: [5, 95] },
    text: {
      fr: [
        "Noël en famille : {w:food} en entrée, dispute en plat, et {w:gift} en cadeau. Comme chaque année, j'ai mangé jusqu'à ne plus voir mes pieds.",
        "À Noël, j'ai reçu {w:gift}. J'ai offert {w:gift}. Quelque part, il y a un équilibre cosmique.",
        "Noël. Le chat a renversé le sapin [[deux|trois|quatre]] fois. La quatrième, on l'a laissé couché. Il était bien comme ça.",
        "J'ai passé Noël {w:far_place}, en visio avec la famille. Mamie a parlé à l'écran éteint pendant vingt minutes. Elle était ravie.",
      ],
      en: [
        "Family Christmas: {w:food} for starters, an argument for the main course, and {w:gift} as a present. As every year, I ate until I couldn't see my feet.",
        "For Christmas, I got {w:gift}. I gave {w:gift}. Somewhere, there's cosmic balance.",
        "Christmas. The cat knocked over the tree [[two|three|four]] times. The fourth time, we left it lying down. It looked comfy.",
        "I spent Christmas {w:far_place}, on a video call with the family. Grandma talked to a frozen screen for twenty minutes. She was delighted.",
      ],
    },
    fx: { happy: 4, weight: 0.01 },
  },
  {
    id: 'ho_xmas_leftovers_auto',
    icon: '🚽',
    cat: 'holiday',
    rating: 2,
    auto: true,
    cooldown: 3,
    when: { age: [18, 95] },
    text: {
      fr: [
        "26 décembre : j'ai mangé les restes du réveillon pendant trois jours. Huîtres, foie gras, bûche et {w:food}. Mes toilettes ont demandé l'asile politique.",
        "Après Noël, j'ai fini les restes de dinde au petit-déjeuner. Mon transit a fait le bruit qu'aurait fait {w:vehicle} en démarrant. Puis une éruption.",
        "Lendemain de Noël : la boîte de chocolats est vide, ma ceinture aussi en est à son dernier trou, et j'ai {w:smell} qui me suit partout.",
        "Après les fêtes, j'ai pesé [[deux|trois|quatre]] kilos de plus et pété l'équivalent d'un orchestre symphonique. Les voisins ont cru à des feux d'artifice en avance.",
      ],
      en: [
        "December 26th: I ate the Christmas Eve leftovers for three days. Oysters, foie gras, Yule log and {w:food}. My toilet requested political asylum.",
        "After Christmas, I finished the turkey leftovers for breakfast. My guts made a noise like {w:vehicle} starting up. Then an eruption.",
        "Day after Christmas: the chocolate box is empty, my belt is on its last notch, and {w:smell} follows me everywhere.",
        "After the holidays, I weighed [[four|six|eight]] pounds more and farted the equivalent of a symphony orchestra. The neighbors thought it was early fireworks.",
      ],
    },
    fx: { health: -2, weight: 0.03, happy: 1 },
  },
  {
    id: 'ho_xmas_ski',
    icon: '⛷️',
    cat: 'family',
    rating: 0,
    cooldown: 3,
    when: { age: [6, 16] },
    scene: { place: 'park', mood: 'happy' },
    text: {
      fr: [
        "Vacances de Noël au ski avec la famille. Le moniteur t'a mis{|e} dans le groupe des « Flocons ». Tu as {age} ans. Les autres en ont quatre.",
        "Premier jour au ski {w:weather}. Ton père insiste pour prendre la piste noire « pour voir ». Il ne sait pas skier non plus.",
        "Au ski, le téléski t'a lâché{|e} à mi-pente. Tu redescends en marche arrière, à plat ventre, sous les applaudissements des gens du télésiège.",
        "Vacances de Noël au chalet. Ta sœur t'a défié{|e} de descendre la piste rouge en luge. Avec un plateau de cantine.",
      ],
      en: [
        "Christmas ski trip with the family. The instructor put you in the 'Snowflakes' group. You're {age}. The others are four.",
        "First day skiing {w:weather}. Your dad insists on taking the black run 'just to see'. He can't ski either.",
        "At the ski resort, the T-bar dropped you halfway up. You slide back down, backwards, belly first, to applause from the chairlift.",
        "Christmas at the chalet. Your sister dared you to go down the red run on a sled. Made from a cafeteria tray.",
      ],
    },
    choices: [
      {
        label: { fr: 'Foncer tout schuss', en: 'Bomb straight down' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["Tout schuss, sans virage, sans peur. J'ai dépassé le moniteur, qui m'a crié des choses. J'ai eu ma première étoile et un nouveau surnom : la Fusée.", "J'ai dévalé la piste en hurlant. Les adultes s'écartaient. Arrivée parfaite devant le chalet, chocolat chaud mérité."], en: ["Straight down, no turns, no fear. I passed the instructor, who yelled things. I got my first ski badge and a new nickname: the Rocket.", "I flew down the slope screaming. Adults dove aside. Perfect finish at the chalet, well-earned hot cocoa."] }, fx: { happy: 9, athletic: 4 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai fini dans un filet de sécurité, la tête en bas, comme une prise de pêche. On m'a décroché{|e} avec une perche. Je me suis tordu {w:bodypart}.", "J'ai percuté un bonhomme de neige. Il y avait un poteau dedans. Un enfant a ri si fort qu'il est tombé du télésiège. Il va bien. Moi, moyen."], en: ["I ended up in a safety net, upside down, like a fishing catch. They unhooked me with a pole. I twisted my {w:bodypart}.", "I crashed into a snowman. There was a post inside. A kid laughed so hard he fell off the chairlift. He's fine. Me, so-so."] }, fx: { happy: -3, health: -8, disease: 'sprain' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Rester au chalet', en: 'Stay at the chalet' },
        text: { fr: ["J'ai passé la semaine au chalet, devant la cheminée, avec des chocolats chauds et {w:show}. Le ski, c'est surfait.", "J'ai fait une semaine de raclette et de jeux de société. J'ai battu toute la famille au Monopoly. Mon oncle ne me parle plus."], en: ["I spent the week at the chalet, by the fire, with hot cocoa and {w:show}. Skiing is overrated.", "I did a week of raclette and board games. I beat the whole family at Monopoly. My uncle isn't speaking to me."] },
        fx: { happy: 5, weight: 0.02, smarts: 1 },
        mood: 'sleepy',
      },
    ],
  },
  // ───────────────────────────── office Christmas party ─────────────────────────────
  {
    id: 'ho_office_karaoke',
    icon: '🎤',
    cat: 'party',
    rating: 1,
    cooldown: 3,
    when: { age: [18, 70], job: true, has: 'boss' },
    actor: 'boss',
    scene: { place: 'office', mood: 'party', prop: 'microphone' },
    text: {
      fr: [
        "Pot de Noël chez {employer}. Il y a un karaoké. {a:Ton patron|Ta patronne}, {a.first}, te tend le micro : « Allez, un duo ! » La chanson : {w:song}.",
        "Fête de Noël de la boîte. {a.first}, ton boss, a déjà bu trois coupes et réclame un duo avec toi sur {w:song}. Tout le service te regarde.",
        "Soirée de Noël chez {employer}. Les petits fours sont secs, le DJ est le cousin du DRH, et {a.first} veut absolument chanter avec toi.",
        "Pot de Noël. Entre la bûche industrielle et {w:drink}, {a.first} a lancé : « Celui qui chante le plus fort aura sa prime. » Tu sens le regard des collègues.",
      ],
      en: [
        "Christmas party at {employer}. There's karaoke. Your boss {a.first} hands you the mic: 'Come on, a duet!' The song: {w:song}.",
        "Company Christmas party. {a.first}, your boss, has had three glasses and demands a duet with you on {w:song}. The whole department is watching.",
        "Christmas party at {employer}. The appetizers are dry, the DJ is HR's cousin, and {a.first} absolutely wants to sing with you.",
        "Christmas drinks. Between the factory Yule log and {w:drink}, {a.first} announced: 'Whoever sings loudest gets a bonus.' You feel your coworkers' eyes.",
      ],
    },
    choices: [
      {
        label: { fr: 'Chanter comme une star', en: 'Sing like a star' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["J'ai tout donné. Genoux à terre, chemise ouverte, dernier refrain à l'unisson avec le boss. J'ai eu ma prime, et un surnom au bureau.", "On a fait un duo légendaire. {a.first} m'a pris{|e} dans ses bras à la fin. Le lundi, on a fait semblant que rien ne s'était passé. Mais ma prime est réelle."], en: ["I gave it everything. On my knees, shirt open, last chorus in unison with the boss. I got my bonus, and an office nickname.", "We did a legendary duet. {a.first} hugged me at the end. On Monday, we pretended nothing happened. But my bonus is real."] }, fx: { happy: 8, perf: 8, rel: 10, money: 300 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai chanté faux et fort. Le micro a fait un larsen qui a cassé un verre. La vidéo circule sur le Slack de l'entreprise. Le service informatique l'a mise en fond d'écran.", "Pendant le solo, j'ai renversé {w:drink} sur le portable du DRH. Il contenait les primes. Il n'y aura pas de primes."], en: ["I sang loud and off-key. The mic feedback shattered a glass. The video is all over the company Slack. IT made it the default wallpaper.", "During my solo, I spilled {w:drink} on HR's laptop. It had the bonus files. There will be no bonuses."] }, fx: { happy: -4, perf: -5, fame: 1 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Refuser poliment', en: 'Politely decline' },
        text: { fr: ["J'ai refusé. {a.first} a chanté seul{a:|e}, très mal, très longtemps. J'ai applaudi plus fort que tout le monde. Stratégie de carrière.", "J'ai décliné en prétextant une extinction de voix. Puis j'ai été vu{|e} en train de chanter dans les toilettes. Démasqué{|e}."], en: ["I declined. {a.first} sang alone, very badly, for a very long time. I clapped louder than anyone. Career strategy.", "I declined, claiming I'd lost my voice. Then I was caught singing in the bathroom. Busted."] },
        fx: { happy: 1, rel: -3, perf: 1 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 'ho_office_kiss',
    icon: '💋',
    cat: 'party',
    rating: 2,
    cooldown: 4,
    when: { age: [20, 65], job: true, has: 'coworker' },
    actor: 'coworker',
    scene: { place: 'office', mood: 'love', prop: 'champagne' },
    text: {
      fr: [
        "Fin du pot de Noël. Toi et {a.first}, de la compta, vous vous retrouvez seuls dans la salle de la photocopieuse. Il y a du gui au-dessus de la porte. Il n'y en avait pas ce matin.",
        "Il est 23 h, la fête de Noël du bureau touche à sa fin. {a.first} s'approche, sent {w:drink}, et murmure : « On a toujours eu un truc, non ? »",
        "Soirée de Noël chez {employer}. Après quatre coupes, {a.first} t'entraîne dans le local des archives « pour te montrer un truc ». Ce n'est pas un dossier.",
        "Pot de Noël. {a.first} te fait du pied sous la table depuis le discours du PDG. Le PDG est toujours en train de parler. Il parle de « famille ».",
      ],
      en: [
        "End of the Christmas party. You and {a.first} from accounting find yourselves alone in the copier room. There's mistletoe above the door. It wasn't there this morning.",
        "It's 11 p.m., the office Christmas party is winding down. {a.first} leans in, smelling of {w:drink}, and whispers: 'We've always had a thing, right?'",
        "Christmas party at {employer}. Four glasses in, {a.first} drags you into the records room 'to show you something'. It's not a file.",
        "Christmas drinks. {a.first} has been playing footsie with you since the CEO's speech. The CEO is still talking. He's talking about 'family'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Céder à la tentation', en: 'Give in' },
        out: [
          { w: 1, text: { fr: ["On s'est embrassés contre la photocopieuse. Quelqu'un a appuyé sur « copier » avec ses fesses. Cinquante exemplaires. Le bac est plein.", "Ça a été torride, rapide, et dans un local qui sent l'encre. On a fait tomber une étagère entière de bilans 2014."], en: ["We made out against the copier. Somebody's butt hit 'copy'. Fifty copies. The tray is full.", "It was hot, fast, and in a room that smells like toner. We knocked over an entire shelf of 2014 reports."] }, fx: { happy: 10, rel: 15, chain: 'ho_office_morning_after' }, mood: 'love', icon: '🔥' },
          { w: 1, text: { fr: ["On s'est embrassés. Ses lunettes sont tombées dans ma coupe. On a ri, on a recommencé, et on a été vus par le stagiaire. Le stagiaire sait tout, maintenant.", "Baiser passionné sous le gui. Puis le gui m'est tombé dans la bouche. J'ai toussé une baie sur sa chemise. L'élan a été coupé, mais pas complètement."], en: ["We kissed. {a.first}'s glasses fell into my drink. We laughed, kissed again, and got spotted by the intern. The intern knows everything now.", "Passionate kiss under the mistletoe. Then the mistletoe fell into my mouth. I coughed a berry onto {a.his} shirt. The mood was dented, not destroyed."] }, fx: { happy: 6, rel: 10, chain: 'ho_office_morning_after' }, mood: 'love' },
        ],
      },
      {
        label: { fr: 'Rester professionnel{|le}', en: 'Stay professional' },
        text: { fr: ["J'ai dit « Joyeux Noël, {a.first} » en serrant sa main très fermement. Une poignée de main de notaire. {a:Il|Elle} a compris.", "J'ai fait une blague sur les tableurs Excel. L'ambiance est retombée instantanément. Mission accomplie, à regret."], en: ["I said 'Merry Christmas, {a.first}' with a very firm handshake. A notary handshake. {a:He|She} got it.", "I made a joke about Excel spreadsheets. The mood died instantly. Mission accomplished, with regrets."] },
        fx: { happy: -1, discipline: 3, rel: -3 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 'ho_office_morning_after',
    icon: '😳',
    cat: 'party',
    rating: 2,
    chainOnly: true,
    actor: 'coworker',
    scene: { place: 'office', mood: 'shock' },
    text: {
      fr: [
        "Lundi matin. En arrivant au bureau, tu découvres que tout l'open space a un surnom pour {a.first} et toi. Il y a même un mème sur l'écran de la machine à café.",
        "Le lendemain du pot de Noël, {a.first} t'évite à la machine à café. Le stagiaire te fait un clin d'œil. La DRH t'a envoyé une invitation « petit point informel ».",
        "Retour au bureau après la fête. Sur ton clavier, quelqu'un a déposé une photocopie. Elle est floue, mais on reconnaît très bien qui c'est. Et ce que c'est.",
        "Lendemain de soirée. {a.first} t'a envoyé un message : « Hier soir… on en parle ? » Trois collègues lisent par-dessus ton épaule.",
      ],
      en: [
        "Monday morning. Arriving at work, you find the entire open space has a couple name for you and {a.first}. There's even a meme on the coffee machine screen.",
        "The day after the Christmas party, {a.first} avoids you at the coffee machine. The intern winks at you. HR sent you an invite: 'quick informal chat'.",
        "Back at the office after the party. Someone left a photocopy on your keyboard. It's blurry, but it's very clear who it is. And what it is.",
        "Morning after. {a.first} texted you: 'About last night... should we talk?' Three coworkers are reading over your shoulder.",
      ],
    },
    choices: [
      {
        label: { fr: 'Officialiser', en: 'Make it official' },
        out: [
          { w: 2, text: { fr: ["On a assumé. On déjeune ensemble tous les midis. Le service compta a ouvert des paris sur la date du mariage.", "On s'est affichés main dans la main à la cantine. Standing ovation au rayon yaourts. Le PDG a parlé de « valeurs d'équipe »."], en: ["We owned it. We have lunch together every day. Accounting opened bets on the wedding date.", "We showed up holding hands in the cafeteria. Standing ovation by the yogurts. The CEO talked about 'team values'."] }, fx: { happy: 10, rel: 15, actorRole: 'partner' }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai proposé d'officialiser. {a.first} m'a regardé{|e} comme si je proposais une fusion-acquisition hostile. Le malaise dure encore.", "{a.first} a dit oui, puis s'est souvenu{a:|e} qu'{a.he} était marié{a:|e}. Détail."], en: ["I suggested making it official. {a.first} looked at me like I'd proposed a hostile takeover. The awkwardness lingers.", "{a.first} said yes, then remembered being married. Minor detail."] }, fx: { happy: -6, rel: -10, stress: 6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Tout nier en bloc', en: 'Deny everything' },
        text: { fr: ["J'ai tout nié, même la photocopie. J'ai affirmé que c'était un coude. Personne ne m'a cru{|e}, mais par politesse, tout le monde a acquiescé.", "Version officielle : « On cherchait l'agrafeuse. » Elle est entrée dans la légende de l'entreprise. Il y a maintenant une agrafeuse en or dans le hall."], en: ["I denied everything, even the photocopy. I claimed it was an elbow. Nobody believed me, but out of politeness, everyone nodded.", "Official version: 'We were looking for the stapler.' It became company legend. There's now a golden stapler in the lobby."] },
        fx: { happy: -2, rel: -8, perf: -3, stress: 4 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 'ho_office_secret_santa',
    icon: '🎁',
    cat: 'party',
    rating: 2,
    cooldown: 3,
    when: { age: [20, 68], job: true, has: 'coworker' },
    actor: 'coworker',
    scene: { place: 'office', mood: 'shock' },
    text: {
      fr: [
        "Père Noël secret au bureau. Budget : 10 €. Tu as tiré {a.first}, que tu n'as jamais vu{a:|e} sourire. Ton paquet contient {w:gift}.",
        "Échange de cadeaux chez {employer}. {a.first} ouvre le tien devant tout le monde. Tu viens de te souvenir que tu as acheté le cadeau dans un sex-shop « pour rire ».",
        "Le Père Noël secret du bureau, c'est aujourd'hui. Tu as reçu {w:gift}. Tu sais que c'est {a.first} : {a:il|elle} est {a:le seul|la seule} à rire.",
        "Secret Santa au boulot. {a.first} a mis dix minutes à déballer ton paquet, parce que tu as utilisé [[quatre|six|dix]] rouleaux de scotch. Dedans : {w:object}.",
      ],
      en: [
        "Office Secret Santa. Budget: ten bucks. You drew {a.first}, whom you've never seen smile. Your package contains {w:gift}.",
        "Gift exchange at {employer}. {a.first} opens yours in front of everyone. You just remembered you bought it at a sex shop 'as a joke'.",
        "Office Secret Santa is today. You got {w:gift}. You know it's from {a.first}: {a.he}'s the only one laughing.",
        "Secret Santa at work. {a.first} took ten minutes to unwrap your package because you used [[four|six|ten]] rolls of tape. Inside: {w:object}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Assumer le cadeau', en: 'Own the gift' },
        out: [
          { w: 1, text: { fr: ["J'ai dit « C'est utile, crois-moi » avec un clin d'œil. {a.first} a éclaté de rire. On est inséparables depuis. Le reste du service nous craint.", "J'ai assumé. Les menottes en fourrure rose sont devenues la mascotte du service. Elles sont accrochées au tableau blanc."], en: ["I said 'Trust me, it's useful' with a wink. {a.first} burst out laughing. We've been inseparable since. The rest of the department fears us.", "I owned it. The pink fluffy handcuffs became the department mascot. They hang on the whiteboard."] }, fx: { happy: 8, rel: 14 }, mood: 'party' },
          { w: 1, text: { fr: ["{a.first} a sorti un vibromasseur géant devant le PDG. Il s'est mis en marche tout seul. Il a vibré sur la table jusqu'à tomber dans la bûche. Je suis convoqué{|e} lundi.", "Le cadeau s'est mis à parler. Il disait des choses en espagnol, très fort. La DRH a pris des notes."], en: ["{a.first} pulled a giant vibrator out in front of the CEO. It switched on by itself. It buzzed across the table into the Yule log. I've been summoned on Monday.", "The gift started talking. It said things in Spanish, very loudly. HR took notes."] }, fx: { happy: -4, perf: -10, fame: 1 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Échanger les étiquettes', en: 'Swap the tags' },
        text: { fr: ["J'ai échangé les étiquettes en douce. Le PDG a reçu mon cadeau. Il l'a regardé longtemps, puis il l'a mis dans sa poche. On ne saura jamais.", "J'ai fait passer mon cadeau pour celui du stagiaire. Le stagiaire ne comprend pas pourquoi tout le monde le regarde bizarrement. Il partira en mars."], en: ["I secretly swapped the tags. The CEO got my gift. He stared at it for a long time, then put it in his pocket. We'll never know.", "I passed my gift off as the intern's. The intern doesn't understand why everyone looks at him funny. He leaves in March."] },
        fx: { happy: 5, karma: -4, smarts: 2 },
        mood: 'happy',
      },
    ],
  },
  // ───────────────────────────── New Year's Eve ─────────────────────────────
  {
    id: 'ho_nye_resolution',
    icon: '📝',
    cat: 'holiday',
    rating: 0,
    cooldown: 3,
    when: { age: [14, 85], noFlag: 'ho_resolution' },
    scene: { place: 'home', mood: 'proud' },
    text: {
      fr: [
        "31 décembre, 23 h 58. Tout le monde prend ses bonnes résolutions. Ton oncle jure d'arrêter {w:drink}, un verre à la main. Et toi ?",
        "Nouvel An. Tu fais la liste de tes résolutions sur une serviette en papier. L'an dernier, c'était {w:activity}. Tu ne l'as pas fait une seule fois.",
        "Minuit approche. Cette année sera la bonne, tu le sens. Tu as [[deux|trois|cinq]] coupes de champagne dans le nez et une détermination de fer.",
        "Le décompte va commencer. Ta tante annonce qu'elle se met {w:hobby} cette année. Tu dois trouver une résolution, et vite.",
      ],
      en: [
        "December 31st, 11:58 p.m. Everyone is making resolutions. Your uncle swears he'll quit {w:drink}, glass in hand. What about you?",
        "New Year's Eve. You list your resolutions on a paper napkin. Last year's was {w:activity}. You didn't do it once.",
        "Midnight is approaching. This year will be the one, you can feel it. You have [[two|three|five]] glasses of champagne in you and an iron will.",
        "The countdown is about to start. Your aunt announces she's taking up {w:hobby} this year. You need a resolution, fast.",
      ],
    },
    choices: [
      {
        label: { fr: 'Aller à la salle', en: 'Hit the gym' },
        text: { fr: ["Résolution : la salle de sport, trois fois par semaine. J'ai pris l'abonnement annuel le 1er janvier à 10 h. Avec la gueule de bois. C'est un signe.", "J'ai juré de me mettre au sport. J'ai acheté des baskets fluo, un short et une gourde. Le plus dur est fait, non ?"], en: ["Resolution: the gym, three times a week. I bought the annual pass on January 1st at 10 a.m. Hungover. It's a sign.", "I swore I'd get into fitness. Bought neon sneakers, shorts and a water bottle. The hard part's done, right?"] },
        fx: { happy: 3, money: -300, flag: ['ho_resolution', 'ho_res_gym'], schedule: { key: 'ho_resolution_check', years: 1 } },
        mood: 'proud',
      },
      {
        label: { fr: 'Arrêter un vice', en: 'Quit a vice' },
        text: { fr: ["J'ai juré d'arrêter mes mauvaises habitudes. J'ai jeté mes clopes, mes chips et ma dignité de l'an dernier à la poubelle. Elles m'y attendent.", "Résolution : plus d'écrans après 22 h. J'ai tenu jusqu'à 0 h 04, le temps de poster ma résolution sur {w:app}."], en: ["I swore to quit my bad habits. I threw my cigarettes, my chips and last year's dignity in the trash. They're waiting for me there.", "Resolution: no screens after 10 p.m. I held out until 12:04 a.m., long enough to post my resolution on {w:app}."] },
        fx: { happy: 2, discipline: 3, flag: ['ho_resolution', 'ho_res_vice'], schedule: { key: 'ho_resolution_check', years: 1 } },
        mood: 'proud',
      },
      {
        label: { fr: 'Aucune résolution', en: 'No resolutions' },
        text: { fr: ["Pas de résolution. Je suis parfait{|e} comme je suis. Ma mère a toussé. Mon miroir aussi.", "Ma seule résolution : ne pas prendre de résolutions. Je l'ai tenue toute l'année. Fierté totale."], en: ["No resolutions. I'm perfect as I am. My mom coughed. So did my mirror.", "My only resolution: make no resolutions. I kept it all year. Total pride."] },
        fx: { happy: 3, stress: -3 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_resolution_check',
    icon: '📆',
    cat: 'holiday',
    rating: 0,
    chainOnly: true,
    when: { flag: 'ho_resolution' },
    scene: { place: 'home', mood: 'neutral' },
    text: {
      fr: [
        "Un an a passé depuis tes bonnes résolutions. La serviette en papier où tu les avais notées est encore aimantée sur le frigo. Elle te juge.",
        "Bilan de l'année : tes résolutions de l'an dernier te regardent depuis {w:app}, où tu les avais postées. Les commentaires attendent.",
        "Retour sur tes résolutions de l'année passée. Ta mère te demande « alors, ça a marché ? » avec un sourire qui connaît déjà la réponse.",
        "Nouvel An, encore. Quelqu'un te rappelle ta résolution de l'an dernier, devant tout le monde, avec {w:drink} à la main.",
      ],
      en: [
        "A year has passed since your resolutions. The paper napkin you wrote them on is still stuck to the fridge. It judges you.",
        "Year in review: last year's resolutions stare at you from {w:app}, where you posted them. The comments await.",
        "Looking back at last year's resolutions. Your mom asks 'So, did it work?' with a smile that already knows the answer.",
        "New Year's again. Someone reminds you of last year's resolution, in front of everyone, holding {w:drink}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire le bilan', en: 'Take stock' },
        out: [
          { w: 1, odds: { discipline: 2 }, text: { fr: ["J'ai tenu ! Pour de vrai ! Je me suis pesé{|e}, regardé{|e}, admiré{|e}. Je suis devenu{|e} la personne insupportable qui parle de ses progrès au dîner.", "Incroyable mais vrai : j'ai tenu ma résolution toute l'année. J'ai eu tellement de fierté que j'ai fêté ça avec une pizza entière. Équilibre."], en: ["I did it! For real! I weighed, examined and admired myself. I've become the unbearable person who talks about progress at dinner.", "Unbelievable but true: I kept my resolution all year. I was so proud I celebrated with an entire pizza. Balance."] }, fx: { happy: 10, health: 6, discipline: 5, looks: 3, unflag: ['ho_resolution', 'ho_res_gym', 'ho_res_vice'] }, mood: 'proud' },
          { w: 2, text: { fr: ["J'ai tenu dix-neuf jours. Le vingtième, j'ai craqué {w:excuse}. Mon abonnement, lui, a tenu toute l'année. Il m'a coûté une fortune pour rien.", "Échec total. Ma carte de la salle a servi une fois : pour gratter le givre du pare-brise. Je reprends la même résolution cette année."], en: ["I lasted nineteen days. On day twenty, I caved {w:excuse}. My membership, however, lasted the whole year. It cost a fortune for nothing.", "Total failure. My gym card got used once: to scrape ice off the windshield. Same resolution again this year."] }, fx: { happy: -4, discipline: -2, unflag: ['ho_resolution', 'ho_res_gym', 'ho_res_vice'] }, mood: 'sad' },
        ],
      },
    ],
  },
  {
    id: 'ho_nye_midnight_kiss',
    icon: '🎆',
    cat: 'party',
    rating: 1,
    cooldown: 3,
    when: { age: [18, 60], noHas: 'lover' },
    actor: { create: { role: 'acquaintance', age: [-6, 6], gender: 'attracted' } },
    scene: { place: 'party', mood: 'love', prop: 'champagne' },
    text: {
      fr: [
        "Soirée du Nouvel An. Le décompte commence : 10, 9, 8… Tout le monde se cherche quelqu'un à embrasser. À côté de toi, {a.first}, seul{a:|e} aussi, te regarde.",
        "Il est 23 h 59. Tu es célibataire, en paillettes, avec {w:drink}. {a.first}, que tu connais depuis vingt minutes, se rapproche « par hasard ».",
        "Minuit dans trente secondes. Tous les couples se serrent. {a.first} te fait un signe : « On fait semblant ? » Tu as les mains moites.",
        "Le DJ coupe {w:song} pour le compte à rebours. {a.first} est juste là, un chapeau pointu de travers, et sourit. Trois, deux…",
      ],
      en: [
        "New Year's Eve party. The countdown begins: 10, 9, 8... Everyone's looking for someone to kiss. Next to you, {a.first}, also alone, is looking at you.",
        "It's 11:59 p.m. You're single, in sequins, holding {w:drink}. {a.first}, whom you met twenty minutes ago, edges closer 'by accident'.",
        "Midnight in thirty seconds. Couples are pairing up. {a.first} signals: 'Want to fake it?' Your palms are sweaty.",
        "The DJ cuts {w:song} for the countdown. {a.first} is right there, party hat askew, smiling. Three, two...",
      ],
    },
    choices: [
      {
        label: { fr: 'L\'embrasser', en: 'Kiss {a.him}' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["Minuit pile. Baiser parfait, feux d'artifice derrière, confettis dans les cheveux. On ne s'est pas lâchés de la nuit. Bonne année, vraiment.", "On s'est embrassés à minuit. Puis à minuit cinq. Puis à 3 h du matin dans le taxi. Je crois que l'année commence bien."], en: ["Midnight on the dot. Perfect kiss, fireworks behind us, confetti in our hair. We didn't let go all night. Happy New Year, really.", "We kissed at midnight. Then at 12:05. Then at 3 a.m. in the cab. I think the year is off to a good start."] }, fx: { happy: 10, rel: 30, actorRole: 'partner', visual: 'hearts' }, mood: 'love' },
          { w: 1, text: { fr: ["On s'est penchés en même temps. Nos fronts se sont percutés à minuit pile. Bonne année, avec une bosse. On a ri. On s'est quittés amis, et commotionnés.", "Je me suis penché{|e}, {a.he} s'est retourné{a:|e} pour regarder les feux d'artifice. J'ai embrassé son oreille. Elle avait un goût de laque."], en: ["We leaned in at the same time. Our foreheads collided at the stroke of midnight. Happy New Year, with a bump. We laughed and parted as friends, concussed.", "I leaned in, {a.he} turned to watch the fireworks. I kissed {a.his} ear. It tasted like hairspray."] }, fx: { happy: -2, rel: 8, health: -2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Trinquer seulement', en: 'Just clink glasses' },
        text: { fr: ["On a trinqué. Tout le monde s'embrassait autour de nous. On a parlé jusqu'à 4 h du matin, de tout, sauf de ça. On s'est échangé nos numéros.", "J'ai levé mon verre. {a.first} aussi. Le moment est passé, mais on s'est souhaité une bonne année avec une intensité suspecte."], en: ["We clinked glasses. Everyone around us was kissing. We talked until 4 a.m., about everything except that. We swapped numbers.", "I raised my glass. So did {a.first}. The moment passed, but we wished each other a happy new year with suspicious intensity."] },
        fx: { happy: 4, rel: 12, keep: true, actorRole: 'friend' },
        mood: 'happy',
      },
      {
        label: { fr: 'Embrasser la bouteille', en: 'Kiss the bottle' },
        text: { fr: ["J'ai embrassé la bouteille de champagne à minuit. Elle ne m'a jamais déçu{|e}. On a fini l'année ensemble, puis on a commencé la suivante.", "J'ai fait un bisou à mon reflet dans la vitre. Mon reflet avait l'air ravi. C'est la relation la plus stable de ma vie."], en: ["I kissed the champagne bottle at midnight. It's never let me down. We finished the year together, then started the next.", "I kissed my reflection in the window. My reflection looked thrilled. It's the most stable relationship of my life."] },
        fx: { happy: 2, health: -2 },
        mood: 'party',
      },
    ],
  },
  {
    id: 'ho_nye_couple',
    icon: '🥂',
    cat: 'holiday',
    rating: 2,
    cooldown: 3,
    when: { age: [18, 80], has: 'lover' },
    actor: 'lover',
    scene: { place: 'apartment', mood: 'love', prop: 'champagne' },
    text: {
      fr: [
        "Réveillon en amoureux avec {a.first}. Tu as prévu {w:food}, du champagne et une tenue « surprise » sous ton peignoir. Il est 23 h 30 et {a.first} commence à bâiller.",
        "Nouvel An en tête-à-tête. {a.first} t'a promis « une année qui commence en beauté ». Il y a des pétales de rose sur le lit et {w:object} sur la table de nuit.",
        "Pour le réveillon, {a.first} et toi êtes à une soirée chez des amis. À 23 h 45, {a.he} te glisse : « Et si on rentrait commencer l'année autrement ? »",
        "Réveillon avec {a.first}. Vous regardez le décompte à la télé, en pyjama, avec {w:drink}. Tu sens qu'un des deux va s'endormir avant minuit.",
      ],
      en: [
        "Romantic New Year's Eve with {a.first}. You planned {w:food}, champagne and a 'surprise' outfit under your robe. It's 11:30 p.m. and {a.first} is starting to yawn.",
        "New Year's for two. {a.first} promised you 'a year that starts with a bang'. There are rose petals on the bed and {w:object} on the nightstand.",
        "For New Year's Eve, you and {a.first} are at a friend's party. At 11:45 p.m., {a.he} whispers: 'How about we go home and start the year differently?'",
        "New Year's Eve with {a.first}. You're watching the countdown on TV in pajamas, with {w:drink}. You sense one of you will fall asleep before midnight.",
      ],
    },
    choices: [
      {
        label: { fr: 'Commencer l\'année au lit', en: 'Start the year in bed' },
        out: [
          { w: 2, text: { fr: ["On a commencé l'année à l'horizontale. Les voisins ont tapé au mur à minuit. On a cru que c'était pour le Nouvel An. Ce n'était pas pour le Nouvel An.", "Bonne année, et quelle année. On a raté les douze coups de minuit, mais pas les nôtres. Le lit a perdu un pied. On l'a remplacé par {w:object}."], en: ["We started the year horizontally. The neighbors banged on the wall at midnight. We thought it was for New Year's. It was not for New Year's.", "Happy New Year, and what a year. We missed the twelve strokes of midnight, but not ours. The bed lost a leg. We replaced it with {w:object}."] }, fx: { happy: 12, rel: 12, stress: -6 }, mood: 'love', icon: '🔥' },
          { w: 1, text: { fr: ["En pleine action, un pétard a explosé sous la fenêtre. {a.first} a sursauté et m'a donné un coup de tête. Saignement de nez à minuit. Le drap ressemble à un film d'horreur.", "J'ai enfilé ma tenue surprise. La fermeture éclair s'est coincée dans une partie très sensible. On a fêté minuit aux urgences, avec un Père Noël ivre et un pompier qui riait."], en: ["Mid-action, a firecracker went off under the window. {a.first} jumped and headbutted me. Nosebleed at midnight. The sheets look like a horror film.", "I put on my surprise outfit. The zipper caught in a very sensitive area. We rang in midnight at the ER, with a drunk Santa and a laughing firefighter."] }, fx: { happy: -3, rel: 6, health: -6, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Rester éveillé{|e} jusqu\'à minuit', en: 'Stay up till midnight' },
        out: [
          { w: 1, text: { fr: ["On a tenu jusqu'à minuit pile, on s'est embrassés, et on dormait à minuit deux. La soirée idéale, passé un certain âge.", "J'ai tenu. {a.first} non. {a:Il|Elle} ronflait à 23 h 52. J'ai embrassé son front à minuit et j'ai fini la bouteille seul{|e}. C'était beau quand même."], en: ["We made it to midnight sharp, kissed, and were asleep by 12:02. The ideal night, past a certain age.", "I made it. {a.first} didn't. {a:He|She} was snoring by 11:52. I kissed {a.his} forehead at midnight and finished the bottle alone. Still beautiful."] }, fx: { happy: 6, rel: 6 }, mood: 'sleepy' },
          { w: 1, text: { fr: ["On s'est disputés à 23 h 58 pour savoir quelle chaîne regarder. On a raté minuit. On s'est réconciliés à 0 h 15 sur {w:show}.", "On a regardé le décompte sur une chaîne qui avait trois minutes de retard. On s'est embrassés trop tard. Les voisins ont crié avant nous. Humiliant."], en: ["We argued at 11:58 about which channel to watch. Missed midnight. Made up at 12:15 a.m. over {w:show}.", "We watched the countdown on a channel running three minutes late. We kissed too late. The neighbors cheered before us. Humiliating."] }, fx: { happy: 2, rel: 2 }, mood: 'neutral' },
        ],
      },
    ],
  },
  {
    id: 'ho_nye_house_party',
    icon: '🍾',
    cat: 'party',
    rating: 2,
    cooldown: 3,
    when: { age: [18, 50] },
    scene: { place: 'party', mood: 'party' },
    text: {
      fr: [
        "Soirée du Nouvel An chez un pote de pote. Il y a [[soixante|quatre-vingts|cent]] personnes dans un trois-pièces, un bol de punch couleur {w:drink} et un gars en slip sur le frigo.",
        "Réveillon dans une grande colocation. À 22 h, il y a déjà quelqu'un qui dort dans la baignoire, quelqu'un qui pleure dans le placard et {w:animal} dans la cuisine.",
        "Nouvel An chez des inconnus. Le punch rappelle {w:food}. Le propriétaire de l'appart vient de demander qui tu es. Tu n'en sais rien non plus.",
        "Il est 23 h, le réveillon bat son plein. Quelqu'un a mis {w:song} pour la [[troisième|cinquième|huitième]] fois et le plafond tremble. Une odeur de vomi monte de la salle de bain.",
      ],
      en: [
        "New Year's Eve at a friend of a friend's. There are [[sixty|eighty|a hundred]] people in a two-bedroom, a bowl of punch the color of {w:drink} and a guy in his underwear on top of the fridge.",
        "New Year's at a big shared house. At 10 p.m., someone's already asleep in the bathtub, someone's crying in the closet, and there's {w:animal} in the kitchen.",
        "New Year's at strangers' place. The punch tastes like {w:food}. The owner just asked who you are. You don't know either.",
        "It's 11 p.m., the party is raging. Someone put on {w:song} for the [[third|fifth|eighth]] time and the ceiling is shaking. A smell of puke wafts from the bathroom.",
      ],
    },
    choices: [
      {
        label: { fr: 'Boire le punch', en: 'Drink the punch' },
        out: [
          { w: 2, text: { fr: ["J'ai bu trois louches de punch. À minuit, j'embrassais un ficus. À 1 h, je dansais sur la table. À 3 h, j'ai vomi un arc-en-ciel parfait dans l'évier. Les gens ont applaudi la couleur.", "Le punch contenait de tout, sauf du jus. J'ai fini sur le toit à hurler « BONNE ANNÉE » aux pigeons. Un pigeon m'a chié dessus en réponse. Signe de chance, paraît-il."], en: ["I had three ladles of punch. At midnight, I was kissing a ficus. At 1 a.m., dancing on the table. At 3 a.m., I puked a perfect rainbow into the sink. People applauded the colors.", "The punch had everything except juice. I ended up on the roof screaming 'HAPPY NEW YEAR' at pigeons. A pigeon pooped on me in reply. Good luck, apparently."] }, fx: { happy: 8, health: -6, addiction: ['alcohol', 4] }, mood: 'party', icon: '🤮' },
          { w: 1, text: { fr: ["Je me suis réveillé{|e} le 1er janvier dans une baignoire, en tenue de soirée, avec un inconnu en tutu. Il m'a souhaité une bonne année et m'a demandé si on s'était mariés. On ne sait pas.", "J'ai perdu mon téléphone, mes clés, une chaussure et sept heures de ma vie. J'ai gagné un tatouage temporaire. J'espère qu'il est temporaire."], en: ["I woke up on January 1st in a bathtub, in party clothes, next to a stranger in a tutu. He wished me a happy new year and asked if we'd gotten married. We don't know.", "I lost my phone, my keys, a shoe and seven hours of my life. I gained a temporary tattoo. I hope it's temporary."] }, fx: { happy: 3, health: -8, money: -150 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Partir avant minuit', en: 'Leave before midnight' },
        text: { fr: ["Je suis parti{|e} à 23 h 50. J'ai passé minuit seul{|e} dans le bus de nuit avec un chauffeur qui m'a souhaité bonne année en klaxonnant. Le plus beau moment de la soirée.", "J'ai fui avant minuit. Au kebab, le patron m'a offert {w:food} pour fêter l'année. On a trinqué au Coca. Je reviendrai chaque année."], en: ["I left at 11:50. I spent midnight alone on the night bus with a driver who wished me happy new year by honking. Best moment of the night.", "I fled before midnight. At the kebab shop, the owner gave me {w:food} to celebrate. We toasted with Coke. I'll come back every year."] },
        fx: { happy: 4, health: 1 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_nye_hangover_auto',
    icon: '🤕',
    cat: 'holiday',
    rating: 1,
    auto: true,
    cooldown: 2,
    when: { age: [18, 75] },
    text: {
      fr: [
        "1er janvier. Je me suis réveillé{|e} à 16 h avec un chapeau pointu, {w:smell} et l'impression qu'un nain faisait du marteau-piqueur dans mon crâne. Bonne année.",
        "Le 1er janvier, j'ai bu deux litres d'eau, trois cafés et {w:drink}. Rien n'a marché. J'ai passé la journée allongé{|e} sur le carrelage de la salle de bain. C'était frais.",
        "Gueule de bois du Nouvel An : j'ai retrouvé une crêpe dans ma poche, un numéro de téléphone sur mon bras et aucune idée de comment j'étais rentré{|e}.",
        "Premier jour de l'année : j'ai envoyé des vœux à toute ma liste de contacts à 4 h du matin. Mon ancien patron m'a répondu « ? ». Mon ex m'a répondu « non ».",
      ],
      en: [
        "January 1st. I woke up at 4 p.m. in a party hat, with {w:smell} and the feeling a dwarf was jackhammering inside my skull. Happy New Year.",
        "On January 1st, I drank two liters of water, three coffees and {w:drink}. Nothing worked. I spent the day lying on the bathroom tiles. They were cool.",
        "New Year's hangover: I found a crêpe in my pocket, a phone number on my arm and no idea how I got home.",
        "First day of the year: I sent New Year's wishes to my whole contact list at 4 a.m. My old boss replied '?'. My ex replied 'no'.",
      ],
    },
    fx: { health: -3, happy: -1 },
  },
  {
    id: 'ho_nye_teen',
    icon: '🎉',
    cat: 'party',
    rating: 1,
    cooldown: 2,
    when: { age: [14, 17], has: 'anyFriend' },
    actor: 'anyFriend',
    scene: { place: 'home', mood: 'party' },
    text: {
      fr: [
        "Premier Nouvel An sans les parents ! {a.first} organise une soirée chez {a:lui|elle}. Ses parents sont « au restaurant jusqu'à 1 h ». Quelqu'un a apporté une bouteille de cidre.",
        "Réveillon chez {a.first}. Douze ados, {w:food}, une enceinte et une bouteille de mousseux volée dans le placard de sa grand-mère.",
        "Tes parents t'ont laissé{|e} aller au réveillon de {a.first}. Couvre-feu : 0 h 30. Ton père a déjà envoyé [[quatre|sept|onze]] messages et il est 21 h.",
        "Nouvel An entre potes chez {a.first}. Quelqu'un propose un « action ou vérité ». Quelqu'un d'autre propose de faire péter des pétards dans le jardin.",
      ],
      en: [
        "First New Year's without parents! {a.first} is having a party. {a.first}'s parents are 'at a restaurant until 1 a.m.' Someone brought a bottle of cider.",
        "New Year's Eve at {a.first}'s. Twelve teens, {w:food}, a speaker and a bottle of sparkling wine stolen from {a.his} grandma's cupboard.",
        "Your parents let you go to {a.first}'s New Year's party. Curfew: 12:30 a.m. Your dad has already sent [[four|seven|eleven]] texts and it's 9 p.m.",
        "New Year's with friends at {a.first}'s. Someone suggests truth or dare. Someone else suggests setting off firecrackers in the yard.",
      ],
    },
    choices: [
      {
        label: { fr: 'Goûter le mousseux', en: 'Try the bubbly' },
        out: [
          { w: 2, text: { fr: ["J'ai bu deux gorgées et j'ai eu le hoquet jusqu'à minuit. On a dansé sur {w:song}, on a crié le décompte. J'avais l'impression d'être adulte. J'avais surtout le hoquet.", "Une demi-coupe et j'étais persuadé{|e} d'être drôle. Je l'étais. Un peu. On a ri jusqu'à 2 h."], en: ["I had two sips and got hiccups until midnight. We danced to {w:song}, screamed the countdown. I felt like an adult. Mostly I had hiccups.", "Half a glass and I was convinced I was hilarious. I was. A little. We laughed until 2 a.m."] }, fx: { happy: 8, rel: 6 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai vomi dans les hortensias de la mère de {a.first} à 0 h 10. Ses parents sont rentrés à 0 h 11. On a accusé le chien. Il n'y a pas de chien chez {a.first}.", "Mes parents sont venus me chercher à 0 h 30 pile. J'avais une moustache dessinée au feutre. Je ne sais pas qui. Mon père a pris une photo."], en: ["I puked in {a.first}'s mom's hydrangeas at 12:10. The parents got home at 12:11. We blamed the dog. {a.first} doesn't have a dog.", "My parents picked me up at exactly 12:30. I had a mustache drawn on in marker. No idea who. Dad took a picture."] }, fx: { happy: -3, rel: 2, health: -2 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Rester au soda', en: 'Stick to soda' },
        text: { fr: ["Je suis resté{|e} au soda. J'ai été le{|la} seul{|e} à me souvenir de tout. J'ai des dossiers sur tout le monde pour les dix prochaines années.", "Soda toute la soirée. J'ai gagné au blind test, au karaoké et au concours de danse. La sobriété, c'est un avantage injuste."], en: ["I stuck to soda. I was the only one who remembered everything. I have dirt on everyone for the next ten years.", "Soda all night. I won the music quiz, karaoke and the dance-off. Sobriety is an unfair advantage."] },
        fx: { happy: 5, smarts: 1, discipline: 2 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_nye_firecracker',
    icon: '🧨',
    cat: 'holiday',
    rating: 2,
    cooldown: 4,
    when: { age: [18, 70] },
    scene: { place: 'park', mood: 'shock', fx: 'explosion' },
    text: {
      fr: [
        "Minuit, Nouvel An. Ton voisin a acheté des feux d'artifice « pas tout à fait légaux » {w:far_place}. Il te tend le briquet : « Vas-y, toi, t'as des petites mains. »",
        "Pour le Nouvel An, ton cousin a ramené une caisse de pétards marquée en cyrillique. Il veut les allumer avec sa cigarette. Il a {w:drink} dans l'autre main.",
        "Le décompte est fini et il y a une fusée qui n'est pas partie. Elle fume dans le jardin depuis [[deux|trois|cinq]] minutes. Quelqu'un doit aller voir.",
        "Nouvel An dans le parc. Une bande de gars allume un mortier artisanal fabriqué dans {w:object}. Ils te demandent de tenir le tube.",
      ],
      en: [
        "Midnight, New Year's. Your neighbor bought 'not entirely legal' fireworks {w:far_place}. He hands you the lighter: 'You do it, you've got small hands.'",
        "For New Year's, your cousin brought a crate of firecrackers labeled in Cyrillic. He wants to light them with his cigarette. He's got {w:drink} in the other hand.",
        "The countdown's over and one rocket didn't launch. It's been smoking in the yard for [[two|three|five]] minutes. Someone has to check.",
        "New Year's in the park. A bunch of guys light a homemade mortar made from {w:object}. They ask you to hold the tube.",
      ],
    },
    choices: [
      {
        label: { fr: 'Allumer la mèche', en: 'Light the fuse' },
        out: [
          { w: 2, text: { fr: ["La fusée est partie droit dans le ciel et a explosé en cœur rose. Tout le quartier a applaudi. J'ai tous mes doigts. Je les ai comptés trois fois.", "Le bouquet final était magnifique. J'ai été acclamé{|e} comme un héros de guerre. Un chien a aboyé pendant six heures."], en: ["The rocket shot straight up and burst into a pink heart. The whole neighborhood clapped. I have all my fingers. I counted three times.", "The grand finale was gorgeous. I was cheered like a war hero. A dog barked for six hours."] }, fx: { happy: 9 }, mood: 'party' },
          { w: 1, text: { fr: ["Elle a explosé dans ma main. Mon index a décollé vers la Grande Ourse dans une giclée de sang façon geyser. On ne l'a jamais retrouvé. Il est peut-être en orbite.", "La mèche était courte. Très courte. BOUM. Mon pouce a atterri dans le saladier de chips. Mon cousin l'a mangé avant de comprendre. Il ne s'en est jamais remis."], en: ["It blew up in my hand. My index finger launched toward the Big Dipper in a geyser of blood. Never found it. Might be in orbit.", "The fuse was short. Very short. BOOM. My thumb landed in the chip bowl. My cousin ate it before he realized. He never recovered."] }, fx: { happy: -10, health: -12, disease: 'missing_finger', visual: 'gore' }, mood: 'shock', icon: '🩸' },
        ],
      },
      {
        label: { fr: 'Reculer de 50 mètres', en: 'Back off 50 yards' },
        text: { fr: ["J'ai reculé, puis encore un peu. Le mortier a explosé au sol. Tout le monde est couvert de suie, sauf moi. Je ressemble à un ange au milieu des ramoneurs.", "Je me suis caché{|e} derrière {w:vehicle}. Bien m'en a pris : la fusée est partie à l'horizontale et a traversé une haie. La haie est morte."], en: ["I backed off, then a bit more. The mortar exploded on the ground. Everyone is covered in soot except me. I look like an angel among chimney sweeps.", "I hid behind {w:vehicle}. Good call: the rocket flew sideways through a hedge. The hedge died."] },
        fx: { happy: 4, smarts: 2 },
        mood: 'proud',
      },
    ],
  },
  {
    id: 'ho_nye_old',
    icon: '📺',
    cat: 'holiday',
    rating: 2,
    cooldown: 3,
    when: { age: [65, 99] },
    scene: { place: 'home', mood: 'sleepy' },
    text: {
      fr: [
        "Réveillon au club du troisième âge. Il y a un orchestre, {w:food} et Lucienne, 91 ans, qui te fait du gringue depuis l'apéro avec ses dents dans un verre.",
        "Nouvel An. Tu regardes {w:show} en attendant minuit. Il est 21 h 30. Tes paupières pèsent chacune trois kilos.",
        "Réveillon à la maison de retraite. Le directeur a autorisé une coupe de champagne par personne. Gérard, 88 ans, en est à sa sixième. Il danse sur la table roulante.",
        "Nouvel An. Tes petits-enfants t'ont laissé{|e} seul{|e} avec un téléphone pour « faire un appel vidéo à minuit ». Tu ne sais pas où est le bouton. L'écran montre ton menton.",
      ],
      en: [
        "New Year's Eve at the senior club. There's a band, {w:food} and Lucienne, 91, who's been hitting on you since the appetizers with her teeth in a glass.",
        "New Year's Eve. You're watching {w:show} waiting for midnight. It's 9:30 p.m. Each of your eyelids weighs six pounds.",
        "New Year's Eve at the retirement home. The director allowed one glass of champagne each. Gerald, 88, is on his sixth. He's dancing on the meal cart.",
        "New Year's. Your grandkids left you alone with a phone to 'video call at midnight'. You can't find the button. The screen shows your chin.",
      ],
    },
    choices: [
      {
        label: { fr: 'Danser jusqu\'à minuit', en: 'Dance till midnight' },
        out: [
          { w: 2, text: { fr: ["J'ai dansé le madison, le twist et un slow avec Lucienne. Son dentier est tombé dans mon décolleté. On s'est embrassés quand même. À nos âges, on ne gâche rien.", "J'ai tenu jusqu'à minuit en dansant. J'ai gagné le concours de rock contre un monsieur de 94 ans qui a abandonné pour un malaise. Victoire."], en: ["I danced the madison, the twist and a slow dance with Lucienne. Her dentures fell into my shirt. We kissed anyway. At our age, you don't waste anything.", "I lasted until midnight dancing. Won the rock-and-roll contest against a 94-year-old who dropped out with a dizzy spell. Victory."] }, fx: { happy: 10, health: -2 }, mood: 'party' },
          { w: 1, text: { fr: ["Au premier pas de rock, mon col du fémur a fait « crac ». J'ai fêté minuit sur une civière, une coupe à la main. Les ambulanciers ont trinqué avec moi.", "Gérard m'a entraîné{|e} sur la table roulante. Elle a roulé. Jusqu'à l'escalier. J'ai vu ma vie défiler, en couleurs. Puis un pot de fleurs."], en: ["First rock step, my hip went 'crack'. I rang in midnight on a stretcher, glass in hand. The paramedics toasted with me.", "Gerald pulled me onto the meal cart. It rolled. All the way to the stairs. My life flashed before my eyes, in color. Then a flower pot."] }, fx: { happy: -2, health: -12 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Dormir à 22 h', en: 'Sleep at 10 p.m.' },
        text: { fr: ["J'ai dormi à 22 h. À minuit, les pétards m'ont réveillé{|e}. J'ai cru à la guerre. J'ai mis mon casque de vélo et j'ai attendu dans le placard. Bonne année.", "Couché{|e} à 22 h, j'ai rêvé que {w:celeb} m'invitait à danser. Meilleur réveillon depuis des années. Je n'ai rien raté."], en: ["I was asleep by 10. At midnight, firecrackers woke me. I thought it was war. I put on my bike helmet and waited in the closet. Happy New Year.", "In bed at 10, I dreamed {w:celeb} asked me to dance. Best New Year's in years. Didn't miss a thing."] },
        fx: { happy: 3, health: 3 },
        mood: 'sleepy',
      },
    ],
  },
  // ───────────────────────────── Halloween ─────────────────────────────
  {
    id: 'ho_hw_kid_costume',
    icon: '🎃',
    cat: 'holiday',
    rating: 0,
    cooldown: 2,
    when: { age: [4, 10] },
    scene: { place: 'home', mood: 'happy' },
    text: {
      fr: [
        "Halloween ! Ta mère te propose un costume de fantôme : un drap avec deux trous. Les trous ne sont pas au niveau des yeux.",
        "Pour Halloween, tu voulais être un vampire. Ta mère a fabriqué ton costume. Thème : {w:animal}. Elle en est très fière.",
        "Halloween approche. Tous tes copains seront des super-héros. Ton père te propose d'y aller en « contrôleur fiscal ». Il trouve ça terrifiant.",
        "C'est Halloween et ton costume de citrouille est si large que tu ne passes pas la porte. Tu es coincé{|e} dans l'entrée. Tes amis attendent dehors.",
      ],
      en: [
        "Halloween! Your mom offers a ghost costume: a sheet with two holes. The holes aren't where your eyes are.",
        "For Halloween, you wanted to be a vampire. Your mom made your costume instead. Theme: {w:animal}. She's very proud.",
        "Halloween is coming. All your buddies will be superheroes. Your dad suggests going as a 'tax auditor'. He finds it terrifying.",
        "It's Halloween and your pumpkin costume is so wide you can't fit through the door. You're stuck in the hallway. Your friends are waiting outside.",
      ],
    },
    choices: [
      {
        label: { fr: 'Porter le costume avec fierté', en: 'Wear it proudly' },
        out: [
          { w: 2, text: { fr: ["J'ai porté mon costume ridicule avec tellement d'assurance que tout le monde a cru que c'était fait exprès. J'ai eu deux fois plus de bonbons que les autres.", "Les gens m'ont trouvé{|e} « hilarant{|e} ». Une dame m'a donné une poignée de bonbons et un billet de cinq euros « pour le courage »."], en: ["I wore my ridiculous costume with so much confidence that everyone thought it was on purpose. I got twice as much candy as the others.", "People found me 'hilarious'. A lady gave me a handful of candy and five bucks 'for bravery'."] }, fx: { happy: 8, looks: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["Je ne voyais rien. J'ai sonné chez nous trois fois. Ma mère m'a donné des bonbons trois fois sans rien dire. Elle se sentait coupable.", "Je me suis pris{|e} un lampadaire. Puis un deuxième. J'ai fini la soirée avec une bosse et un sac à moitié vide."], en: ["I couldn't see a thing. I rang our own doorbell three times. Mom gave me candy three times without a word. She felt guilty.", "I walked into a lamppost. Then another one. Ended the night with a bump and a half-empty bag."] }, fx: { happy: 2, health: -2 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Fabriquer le sien', en: 'Make your own' },
        text: { fr: ["J'ai fabriqué mon propre costume avec du papier toilette, du ketchup et {w:object}. J'étais « une momie qui a eu un accident ». Ma maîtresse a appelé mes parents.", "J'ai fait un costume en carton de robot. Il a plu. J'étais une bouillie de carton à 19 h. Mais un robot, dans mon cœur."], en: ["I made my own costume out of toilet paper, ketchup and {w:object}. I was 'a mummy who had an accident'. My teacher called my parents.", "I made a cardboard robot costume. It rained. I was cardboard mush by 7 p.m. But a robot, in my heart."] },
        fx: { happy: 5, smarts: 2 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_hw_trick_treat',
    icon: '🍬',
    cat: 'holiday',
    rating: 1,
    cooldown: 2,
    when: { age: [7, 13] },
    scene: { place: 'park', mood: 'neutral' },
    text: {
      fr: [
        "Halloween dans le quartier. La vieille dame du numéro [[12|8|23]] donne des raisins secs. Encore. Tes copains ont des œufs dans leur sac.",
        "Tu fais du porte-à-porte pour Halloween. Le dentiste du quartier distribue des brosses à dents. Il a un sourire satisfait.",
        "Halloween. Un monsieur t'ouvre en peignoir, te regarde longuement, et dit « on n'en a pas », puis te claque la porte au nez. Ton sac est presque vide.",
        "Soirée Halloween. Une maison a laissé un saladier avec un panneau « Servez-vous, UN SEUL ». Personne ne regarde. Le saladier déborde de bonbons.",
      ],
      en: [
        "Halloween in the neighborhood. The old lady at number [[12|8|23]] is giving out raisins. Again. Your buddies have eggs in their bags.",
        "You're trick-or-treating. The neighborhood dentist is handing out toothbrushes. He looks very pleased with himself.",
        "Halloween. A man opens the door in a bathrobe, stares at you for a long time, says 'We don't have any' and slams the door. Your bag is nearly empty.",
        "Halloween night. One house left a bowl with a sign: 'Help yourself, ONE ONLY'. Nobody's watching. The bowl is full of candy.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le sort ! Les œufs !', en: 'Trick! Eggs!' },
        out: [
          { w: 2, text: { fr: ["On a bombardé la maison d'œufs. Un chef-d'œuvre d'art moderne en jaune et blanc. On a couru en hurlant de rire jusqu'au parc.", "Les œufs ont atteint la porte, la fenêtre et la voiture. Le monsieur en peignoir est sorti et a glissé sur un œuf. On l'a vu tomber au ralenti. C'était beau."], en: ["We pelted the house with eggs. A modern-art masterpiece in yellow and white. We ran screaming with laughter all the way to the park.", "The eggs hit the door, the window and the car. The bathrobe guy came out and slipped on an egg. We watched him fall in slow motion. It was beautiful."] }, fx: { happy: 7, karma: -4 }, mood: 'party' },
          { w: 1, text: { fr: ["Le monsieur nous a vus. Il a appelé mes parents. J'ai passé le samedi suivant à frotter sa façade avec une éponge. Il m'a offert des raisins secs à la fin.", "Mon œuf a ricoché et est revenu sur moi. Mon costume de vampire est devenu un costume d'omelette."], en: ["The man saw us. He called my parents. I spent the next Saturday scrubbing his walls with a sponge. He gave me raisins at the end.", "My egg bounced back and hit me. My vampire costume became an omelet costume."] }, fx: { happy: -4, karma: -2, discipline: 2 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Vider le saladier', en: 'Empty the bowl' },
        text: { fr: ["J'ai vidé le saladier dans mon sac. J'ai mangé deux kilos de bonbons en une soirée. J'ai vu des couleurs qui n'existent pas. Le lendemain, j'avais une carie.", "J'ai tout pris. Le lendemain, je les ai revendus à la récré avec une marge de 300 %. L'entrepreneuriat commence tôt."], en: ["I dumped the bowl into my bag. I ate four pounds of candy in one night. I saw colors that don't exist. The next day, I had a cavity.", "I took it all. Next day, I resold it at recess at a 300% markup. Entrepreneurship starts early."] },
        fx: { happy: 6, karma: -3, health: -2, money: 15 },
        mood: 'happy',
      },
      {
        label: { fr: 'Dire merci et partir', en: 'Say thanks and go' },
        text: { fr: ["J'ai dit merci pour les raisins secs. La vieille dame a été si touchée qu'elle m'a fait entrer et m'a donné une part de gâteau maison. Elle donne des raisins à tous les autres.", "J'ai été poli{|e} partout. Résultat : la récolte la plus maigre de l'histoire, mais la conscience la plus propre du quartier."], en: ["I said thanks for the raisins. The old lady was so touched she invited me in for homemade cake. Everyone else still gets raisins.", "I was polite everywhere. Result: the leanest haul in history, but the cleanest conscience on the block."] },
        fx: { happy: 3, karma: 4 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_hw_haunted_house',
    icon: '👻',
    cat: 'holiday',
    rating: 1,
    cooldown: 3,
    when: { age: [13, 17], has: 'anyFriend' },
    actor: 'anyFriend',
    scene: { place: 'castle', mood: 'shock', fx: 'ghost' },
    text: {
      fr: [
        "Halloween : {a.first} t'a traîné{|e} dans la maison hantée de la fête foraine. Un acteur déguisé en zombie te suit depuis l'entrée en grognant ton prénom.",
        "Soirée Halloween dans la vieille maison abandonnée du bout de la rue. {a.first} dit qu'un fantôme y vit depuis 1952. On entend {w:sound} à l'étage.",
        "Halloween. {a.first} a organisé une séance de spiritisme avec une planche achetée sur {w:app}. Le verre vient de bouger. Personne n'admet l'avoir poussé.",
        "Maison hantée de la fête foraine. Il fait noir, ça sent {w:smell}, et quelque chose de froid vient de te toucher la nuque. {a.first} a disparu.",
      ],
      en: [
        "Halloween: {a.first} dragged you into the fairground haunted house. An actor dressed as a zombie has been following you since the entrance, growling your name.",
        "Halloween night in the abandoned house at the end of the street. {a.first} says a ghost has lived there since 1952. You hear {w:sound} upstairs.",
        "Halloween. {a.first} organized a séance with a Ouija board bought on {w:app}. The glass just moved. Nobody admits pushing it.",
        "Fairground haunted house. It's dark, it smells like {w:smell}, and something cold just touched the back of your neck. {a.first} has vanished.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rester courageux{|se}', en: 'Be brave' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["J'ai serré les dents et avancé. À la sortie, {a.first} tremblait et moi, j'étais impassible. Personne ne sait que j'ai fait un tout petit peu pipi.", "J'ai fixé le zombie dans les yeux. Il a reculé. Je crois que je l'ai traumatisé. Il a démissionné le lendemain."], en: ["I gritted my teeth and kept going. At the exit, {a.first} was shaking and I was stone-faced. Nobody knows I peed a tiny bit.", "I stared the zombie down. He backed off. I think I traumatized him. He quit the next day."] }, fx: { happy: 6, rel: 5, discipline: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai hurlé si fort qu'un vrai employé a appelé la sécurité. J'ai couru tout droit dans un miroir. Il y a une photo de moi, la bouche ouverte, à l'entrée de l'attraction.", "J'ai fait pipi dans mon pantalon. Pas un peu. Complètement. Au moment exact où les lumières se sont rallumées. {a.first} a été très gentil{a:|le}. Pour l'instant."], en: ["I screamed so loud a real employee called security. I ran straight into a mirror. There's a photo of me, mouth wide open, at the ride's entrance.", "I wet my pants. Not a little. Completely. At the exact moment the lights came back on. {a.first} was very nice about it. So far."] }, fx: { happy: -6, rel: 2, stress: 6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Faire peur à {a.first}', en: 'Scare {a.first}' },
        text: { fr: ["Je me suis caché{|e} derrière une porte et j'ai crié « BOUH ». {a.first} m'a mis un coup de poing réflexe dans le nez. Je saignais, mais je riais. Ça valait le coup.", "J'ai fait bouger le verre en douce. {a.first} n'a pas dormi pendant une semaine. Je ne lui ai jamais avoué. Je ne lui avouerai jamais."], en: ["I hid behind a door and yelled 'BOO'. {a.first} punched me in the nose on reflex. I was bleeding, but laughing. Worth it.", "I secretly moved the glass. {a.first} didn't sleep for a week. I never confessed. I never will."] },
        fx: { happy: 5, rel: -3, karma: -1 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_hw_adult_party',
    icon: '🧟',
    cat: 'party',
    rating: 2,
    cooldown: 3,
    when: { age: [18, 50] },
    scene: { place: 'party', mood: 'party', fx: 'gore' },
    text: {
      fr: [
        "Soirée Halloween. Tu es venu{|e} déguisé{|e} en {w:celeb}. Quelqu'un d'autre a eu exactement la même idée, en mieux. Il te fixe depuis le bar.",
        "Fête d'Halloween chez un collègue. Ton costume de zombie est si réaliste qu'un invité ivre vient d'appeler les urgences pour toi.",
        "Halloween. Un type déguisé en tueur à la tronçonneuse fait vrombir un vrai moteur au milieu du salon. Il a l'air de trouver ça drôle. Il est seul à rire.",
        "Soirée costumée d'Halloween. Personne ne comprend ton déguisement. Tu expliques pour la [[cinquième|dixième|quinzième]] fois que tu es « {w:object} avec un fantôme dedans ».",
      ],
      en: [
        "Halloween party. You came dressed as {w:celeb}. Someone else had the exact same idea, but better. He's been staring at you from the bar.",
        "Halloween party at a coworker's. Your zombie costume is so realistic a drunk guest just called 911 for you.",
        "Halloween. A guy dressed as a chainsaw killer is revving a real engine in the middle of the living room. He thinks it's funny. He's the only one laughing.",
        "Costume party. Nobody gets your costume. You explain for the [[fifth|tenth|fifteenth]] time that you're '{w:object} with a ghost inside'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Défier le rival', en: 'Challenge the rival' },
        out: [
          { w: 2, text: { fr: ["Battle de danse contre mon sosie. J'ai fait le ver de terre sur le carrelage. Il a abandonné. Les gens scandaient mon nom. Enfin, celui de la star.", "On s'est affrontés au shot. Il a vomi dans un chaudron décoratif. Tout le monde a cru que c'était de la soupe de sorcière. Quelqu'un en a repris."], en: ["Dance battle against my lookalike. I did the worm on the tiles. He gave up. People chanted my name. Well, the star's.", "We had a shot-off. He puked into a decorative cauldron. Everyone thought it was witch soup. Someone had seconds."] }, fx: { happy: 9, fame: 1 }, mood: 'party' },
          { w: 1, text: { fr: ["Bagarre de sosies. Le gars à la tronçonneuse a voulu nous séparer. Il a raté. J'ai perdu un bout d'oreille, et le sang a giclé sur les rideaux. Tout le monde a applaudi : ils ont cru que c'était du faux.", "Le rival m'a mis un coup de citrouille. La citrouille contenait une bougie. Mes cheveux ont pris feu. J'ai fini la soirée déguisé{|e} en « {w:celeb} après un incendie »."], en: ["Lookalike brawl. The chainsaw guy tried to break it up. He missed. I lost a bit of my ear, and blood sprayed across the curtains. Everyone clapped: they thought it was fake.", "The rival whacked me with a pumpkin. The pumpkin had a candle inside. My hair caught fire. I spent the rest of the night as '{w:celeb} after a house fire'."] }, fx: { happy: -6, health: -10, visual: 'gore' }, mood: 'shock', icon: '🩸' },
        ],
      },
      {
        label: { fr: 'Draguer le vampire', en: 'Flirt with the vampire' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["Le vampire m'a mordu{|e} dans le cou à minuit. Puis ailleurs. On a quitté la fête ensemble. J'ai encore les traces. Elles ne sont pas en plastique.", "J'ai dragué le plus beau costume de la soirée. On a fini dans la salle de bain, ses canines en plastique sont tombées dans le lavabo. On a continué sans."], en: ["The vampire bit my neck at midnight. Then elsewhere. We left the party together. I still have the marks. They're not plastic.", "I flirted with the best costume of the night. We ended up in the bathroom, and the plastic fangs fell into the sink. We carried on without them."] }, fx: { happy: 10, stress: -4 }, mood: 'love' },
          { w: 1, text: { fr: ["Sous le maquillage, le vampire était mon cousin. On s'en est rendu compte trop tard, mais pas trop, trop tard. Juste assez pour ne plus jamais en parler.", "Le vampire était marié. Sa femme était déguisée en loup-garou. Elle a mordu pour de vrai."], en: ["Under the makeup, the vampire was my cousin. We realized late, but not too late. Just late enough to never speak of it again.", "The vampire was married. His wife came as a werewolf. She bit for real."] }, fx: { happy: -5, health: -3 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'ho_hw_door_candy',
    icon: '🚪',
    cat: 'holiday',
    rating: 0,
    cooldown: 3,
    when: { age: [25, 95], movedOut: true },
    scene: { place: 'home', mood: 'neutral' },
    text: {
      fr: [
        "Halloween. Ça sonne pour la [[trentième|quarantième|cinquantième]] fois. Tu n'as plus de bonbons. Il te reste {w:food} et un paquet de lentilles.",
        "Soir d'Halloween. Des enfants déguisés sonnent à ta porte. L'un d'eux, en Dracula, a au moins seize ans et une barbe.",
        "Halloween. Tu as acheté des bonbons hier. Il n'en reste que les emballages, sur ton canapé. Ça sonne.",
        "Les enfants du quartier tambourinent pour Halloween. Leur chef, haut comme trois pommes, dit « des bonbons ou {w:threat} ». Il a l'air sérieux.",
      ],
      en: [
        "Halloween. The doorbell rings for the [[thirtieth|fortieth|fiftieth]] time. You're out of candy. All you have left is {w:food} and a bag of lentils.",
        "Halloween night. Costumed kids ring your bell. One of them, dressed as Dracula, is at least sixteen and has a beard.",
        "Halloween. You bought candy yesterday. Only the wrappers remain, on your couch. The doorbell rings.",
        "The neighborhood kids pound on your door for Halloween. Their leader, knee-high, says 'trick or treat, or {w:threat}'. He looks serious.",
      ],
    },
    choices: [
      {
        label: { fr: 'Improviser un cadeau', en: 'Improvise a treat' },
        out: [
          { w: 2, text: { fr: ["J'ai distribué ce que j'avais : des sachets de thé, une banane et {w:object}. Les enfants étaient perplexes. L'un d'eux m'a dit merci. Il ira loin.", "J'ai donné des pièces de monnaie. Le bouche-à-oreille a fonctionné : à 20 h, il y avait quarante enfants devant ma porte. J'ai dû éteindre les lumières et ramper."], en: ["I handed out what I had: tea bags, a banana and {w:object}. The kids were baffled. One said thank you. He'll go far.", "I gave out coins. Word spread: by 8 p.m., forty kids were at my door. I had to turn off the lights and crawl."] }, fx: { happy: 4, karma: 2, money: -20 }, mood: 'happy' },
          { w: 1, text: { fr: ["Les enfants ont refusé mes lentilles. Le lendemain, ma porte était couverte de papier toilette et de dessins insultants. Plutôt bien dessinés.", "Le petit chef a tenu sa menace. Ma boîte aux lettres est pleine de mousse à raser. Je respecte."], en: ["The kids refused my lentils. Next morning, my door was covered in toilet paper and insulting drawings. Pretty well drawn, too.", "The little leader followed through. My mailbox is full of shaving cream. I respect it."] }, fx: { happy: -3 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Leur faire peur', en: 'Scare them' },
        text: { fr: ["J'ai ouvert avec un masque de clown et une perceuse. Les enfants ont fui. Le Dracula barbu aussi, plus vite que les autres. Plus personne ne sonne chez moi.", "Je me suis caché{|e} dans le buisson et j'ai bondi. Un enfant a hurlé, un autre m'a donné un coup de pied dans le tibia. Match nul."], en: ["I opened the door in a clown mask holding a drill. The kids fled. The bearded Dracula too, faster than the rest. Nobody rings my bell anymore.", "I hid in the bush and jumped out. One kid screamed, another kicked me in the shin. A draw."] },
        fx: { happy: 6, karma: -2 },
        mood: 'party',
      },
    ],
  },
  {
    id: 'ho_hw_parent',
    icon: '🍭',
    cat: 'family',
    rating: 1,
    cooldown: 3,
    when: { age: [26, 55], has: 'child' },
    actor: 'child',
    scene: { place: 'park', mood: 'happy' },
    text: {
      fr: [
        "Tu accompagnes {a.first} pour Halloween. Son sac de bonbons pèse [[deux|trois|quatre]] kilos. Tu as faim. {a:Il|Elle} est presque endormi{a:|e}.",
        "Soir d'Halloween. {a.first} s'est déguisé{a:|e}. Thème : {w:animal}. Tu as un costume aussi, ton conjoint a insisté. Tu es « {w:object} ».",
        "Halloween avec {a.first}. Un autre parent du quartier te prend à part pour te parler de la « taxe parentale » sur les bonbons. Il en est à 40 %.",
        "Fin de la tournée d'Halloween. {a.first} compte ses bonbons sur la table. {a:Il|Elle} connaît le nombre exact. Toi, tu veux les chocolats.",
      ],
      en: [
        "You're taking {a.first} trick-or-treating. The candy bag weighs [[four|six|eight]] pounds. You're hungry. The kid is half asleep.",
        "Halloween night. {a.first} is in costume. Theme: {w:animal}. You have a costume too, your partner insisted. You're '{w:object}'.",
        "Halloween with {a.first}. Another parent pulls you aside to talk about the 'parent tax' on candy. He's at 40%.",
        "End of the Halloween round. {a.first} is counting candy on the table. {a:He|She} knows the exact number. You want the chocolates.",
      ],
    },
    choices: [
      {
        label: { fr: 'Prélever la taxe', en: 'Collect the tax' },
        out: [
          { w: 2, text: { fr: ["J'ai prélevé 30 % pendant qu'{a.first} dormait. Les chocolats, évidemment. Je me suis senti{|e} comme un ministre des Finances. Repu{|e} et coupable.", "J'ai mangé les meilleurs bonbons dans la cuisine, en cachette, la nuit, debout devant le frigo. C'est ça, être parent."], en: ["I skimmed 30% while {a.first} slept. The chocolates, obviously. I felt like a finance minister. Full and guilty.", "I ate the best candy in the kitchen, secretly, at night, standing in front of the fridge. That's parenting."] }, fx: { happy: 5, weight: 0.02, karma: -1 }, mood: 'happy' },
          { w: 1, text: { fr: ["{a.first} avait tout compté. Le lendemain, un procès s'est tenu dans la cuisine. J'ai été condamné{|e} à rembourser en double. {a:Il|Elle} sera avocat{a:|e}.", "{a.first} m'a surpris{|e} la main dans le sac. Littéralement. {a:Il|Elle} m'a regardé{|e} comme on regarde un cambrioleur. Je dois maintenant une glace par semaine."], en: ["{a.first} had counted everything. A trial was held in the kitchen the next day. I was sentenced to pay back double. Future lawyer.", "{a.first} caught me with my hand in the bag. Literally. {a:He|She} looked at me like a burglar. I now owe an ice cream every week."] }, fx: { happy: -2, rel: -5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Rentrer porter l\'enfant', en: 'Carry the kid home' },
        text: { fr: ["J'ai porté {a.first} endormi{a:|e} sur mes épaules jusqu'à la maison. Il y avait du chocolat fondu dans mes cheveux. C'était le plus beau soir de l'année.", "Je l'ai porté{a:|e} jusqu'au lit, déguisement compris. {a:Il|Elle} a dormi dans son costume. Moi, j'ai mangé un seul bonbon. Le plus nul. Par amour."], en: ["I carried {a.first} home asleep on my shoulders. There was melted chocolate in my hair. Best night of the year.", "I carried {a.him} to bed, costume and all. The kid slept in costume. I ate a single candy. The worst one. Out of love."] },
        fx: { happy: 6, rel: 10, health: 1 },
        mood: 'love',
      },
    ],
  },
  // ───────────────────────────── Valentine's Day ─────────────────────────────
  {
    id: 'ho_val_single',
    icon: '💔',
    cat: 'holiday',
    rating: 2,
    cooldown: 3,
    when: { age: [18, 70], noHas: 'lover' },
    scene: { place: 'apartment', mood: 'sad' },
    text: {
      fr: [
        "14 février. Célibataire. Ton fil {w:app} est rempli de couples qui s'offrent {w:gift}. Tu manges {w:food} directement dans la boîte.",
        "Saint-Valentin. Même ta mère a un rendez-vous. Ton chat te regarde avec pitié. Le vibromasseur que tu t'es offert l'an dernier n'a plus de piles.",
        "C'est la Saint-Valentin et tes potes célibataires organisent une « soirée anti-amour ». Le programme : {w:drink}, brûler des photos d'ex et karaoké de ruptures.",
        "14 février. Un livreur sonne avec un énorme bouquet de roses. Ton cœur bondit. C'est pour la voisine. Il te demande de signer.",
      ],
      en: [
        "February 14th. Single. Your {w:app} feed is full of couples gifting each other {w:gift}. You're eating {w:food} straight from the box.",
        "Valentine's Day. Even your mom has a date. Your cat looks at you with pity. The vibrator you bought yourself last year is out of batteries.",
        "It's Valentine's Day and your single friends are throwing an 'anti-love party'. The program: {w:drink}, burning photos of exes and breakup karaoke.",
        "February 14th. A delivery guy rings with a huge bouquet of roses. Your heart leaps. It's for the neighbor. He asks you to sign.",
      ],
    },
    choices: [
      {
        label: { fr: 'Soirée anti-amour', en: 'Anti-love party' },
        out: [
          { w: 2, text: { fr: ["On a brûlé les photos d'ex dans un wok. Le détecteur de fumée a sonné, les pompiers sont venus, l'un d'eux était célibataire. Je l'ai ramené à la maison. L'amour est mort, vive le pompier.", "Karaoké de ruptures jusqu'à 3 h. J'ai chanté {w:song} en pleurant, à genoux, en m'adressant à un plant de basilic. Thérapie complète."], en: ["We burned ex photos in a wok. The smoke alarm went off, firefighters came, and one of them was single. I took him home. Love is dead, long live the fireman.", "Breakup karaoke until 3 a.m. I sang {w:song} in tears, on my knees, addressing a basil plant. Complete therapy."] }, fx: { happy: 9, stress: -6 }, mood: 'party' },
          { w: 1, text: { fr: ["Au troisième verre, j'ai envoyé un message à mon ex. Puis un vocal. Puis une photo. Puis une photo de mes fesses. Il a répondu « c'est qui ? ».", "J'ai fini la soirée en tentant de draguer le livreur de sushis. Il m'a laissé{|e} sur le palier avec les baguettes et un regard de compassion."], en: ["Three drinks in, I texted my ex. Then a voice note. Then a photo. Then a photo of my butt. They replied 'who's this?'.", "I ended the night trying to seduce the sushi delivery guy. He left me on the doorstep with chopsticks and a look of compassion."] }, fx: { happy: -6, stress: 4 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Se faire plaisir seul{|e}', en: 'Treat yourself' },
        text: { fr: ["Bain moussant, {w:drink}, {w:show} et une soirée très intime avec moi-même. Pas de déception, pas de vaisselle, orgasme garanti. La meilleure relation que j'aie eue.", "Je me suis acheté des roses, des chocolats et des piles neuves. Je me suis fait la cour. J'ai dit oui."], en: ["Bubble bath, {w:drink}, {w:show} and a very intimate evening with myself. No disappointment, no dishes, climax guaranteed. Best relationship I've ever had.", "I bought myself roses, chocolates and fresh batteries. I courted myself. I said yes."] },
        fx: { happy: 7, stress: -8 },
        mood: 'love',
      },
      {
        label: { fr: 'Ouvrir une appli', en: 'Open a dating app' },
        out: [
          { w: 1, text: { fr: ["Un match à 21 h, un verre à 22 h, son appart à minuit. Je ne connais pas son nom de famille. Je connais son tatouage de dauphin sur la fesse.", "J'ai eu un rendez-vous de dernière minute. Il était charmant, drôle, et parlait de sa mère toutes les trois phrases. J'ai fini chez lui quand même. La solitude est une mauvaise conseillère, mais une bonne entremetteuse."], en: ["A match at 9, a drink at 10, their place at midnight. I don't know their last name. I know their dolphin tattoo on the butt.", "I got a last-minute date. Charming, funny, mentioned their mother every three sentences. I went home with them anyway. Loneliness is a bad advisor, but a great matchmaker."] }, fx: { happy: 8, stress: -3 }, mood: 'love', icon: '🔥' },
          { w: 1, text: { fr: ["Mon rendez-vous ne ressemblait pas du tout à ses photos. Elles dataient de 2011 et d'un autre visage. On a bu un verre par politesse. J'ai simulé un appel de ma grand-mère morte.", "Zéro match. Même les bots m'ignorent. J'ai fini par écrire à un compte d'assurance auto. Il m'a répondu. C'est un début."], en: ["My date looked nothing like their photos. They dated from 2011 and from a different face. We had one drink out of politeness. I faked a call from my dead grandmother.", "Zero matches. Even the bots ignore me. I ended up messaging a car insurance account. It replied. That's a start."] }, fx: { happy: -5 }, mood: 'sad' },
        ],
      },
    ],
  },
  {
    id: 'ho_val_gift',
    icon: '💝',
    cat: 'holiday',
    rating: 1,
    cooldown: 3,
    when: { age: [16, 85], has: 'lover' },
    actor: 'lover',
    scene: { place: 'apartment', mood: 'love' },
    text: {
      fr: [
        "Saint-Valentin. Vous aviez dit « pas de cadeaux cette année ». {a.first} vient de te tendre un paquet énorme. Tu as les mains vides.",
        "14 février. Tu offres {w:gift} à {a.first}. {a:Il|Elle} t'offre un week-end {w:far_place}. La balance cosmique penche dangereusement.",
        "Pour la Saint-Valentin, {a.first} t'a préparé une chasse au trésor dans tout l'appart. Le premier indice est dans le frigo, sur {w:food}.",
        "Saint-Valentin. {a.first} a réservé un restaurant. Tu viens de te souvenir que c'est ce soir. Tu portes un jogging avec une tache suspecte. Probablement {w:food}.",
      ],
      en: [
        "Valentine's Day. You both said 'no presents this year'. {a.first} just handed you a huge package. Your hands are empty.",
        "February 14th. You give {a.first} {w:gift}. {a:He|She} gives you a weekend {w:far_place}. The cosmic balance is tipping dangerously.",
        "For Valentine's Day, {a.first} set up a treasure hunt all over the apartment. The first clue is in the fridge, on {w:food}.",
        "Valentine's Day. {a.first} booked a restaurant. You just remembered it's tonight. You're wearing sweatpants with a suspicious stain. Probably {w:food}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Improviser un cadeau', en: 'Improvise a gift' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai écrit un poème en cinq minutes au dos d'une facture EDF. {a.first} a pleuré. Le poème est encadré. La facture est toujours impayée.", "J'ai offert « une soirée où je fais tout ce que tu veux ». {a.first} a choisi le ménage. Je ne m'en suis toujours pas remis{|e}."], en: ["I wrote a poem in five minutes on the back of an electric bill. {a.first} cried. The poem is framed. The bill is still unpaid.", "I offered 'a night where I do whatever you want'. {a.first} picked cleaning. I still haven't recovered."] }, fx: { happy: 6, rel: 10 }, mood: 'love' },
          { w: 1, text: { fr: ["J'ai offert un bouquet acheté à la station-service. Il y avait encore l'étiquette « -50 % ». {a.first} a dit « c'est l'intention qui compte » d'une voix très plate.", "J'ai emballé {w:object} trouvé dans le placard. {a.first} a reconnu son propre cadeau de l'an dernier."], en: ["I gave a gas station bouquet. The '50% off' sticker was still on it. {a.first} said 'it's the thought that counts' in a very flat voice.", "I wrapped up {w:object} from the closet. {a.first} recognized it as their own gift from last year."] }, fx: { happy: -4, rel: -8 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Avouer et câliner', en: 'Confess and cuddle' },
        text: { fr: ["J'ai avoué, puis j'ai proposé un câlin de quarante minutes et des pâtes. {a.first} a dit que c'était le meilleur cadeau. On s'est endormis devant {w:show}.", "J'ai dit la vérité et j'ai commandé {w:food}. On a mangé au lit. Il y avait de la sauce partout. Romantique, d'une certaine façon."], en: ["I confessed, then offered a forty-minute cuddle and pasta. {a.first} said it was the best gift. We fell asleep watching {w:show}.", "I told the truth and ordered {w:food}. We ate in bed. Sauce everywhere. Romantic, in a way."] },
        fx: { happy: 5, rel: 6, stress: -4 },
        mood: 'love',
      },
    ],
  },
  {
    id: 'ho_val_school',
    icon: '💌',
    cat: 'holiday',
    rating: 0,
    cooldown: 2,
    when: { age: [8, 12], school: 'primary' },
    scene: { place: 'school', mood: 'love' },
    text: {
      fr: [
        "Saint-Valentin à l'école. Il y a une carte anonyme dans ton cartable. Elle dit « Tu es plus mignon{|ne} qu'{w:animal} ». L'écriture ressemble beaucoup à celle de la maîtresse.",
        "Pour la Saint-Valentin, la maîtresse demande à chacun d'écrire une carte à un camarade. Tu as tiré le garçon qui mange ses crottes de nez.",
        "La Saint-Valentin à l'école. Quelqu'un a glissé une sucette en forme de cœur dans ta trousse, avec un mot : « Signé : tu sais qui ». Tu ne sais pas qui.",
        "Saint-Valentin. Ton copain te demande de donner sa carte à quelqu'un de la classe, parce qu'il est trop timide. La carte est pour toi.",
      ],
      en: [
        "Valentine's Day at school. There's an anonymous card in your backpack. It says 'You're cuter than {w:animal}'. The handwriting looks a lot like the teacher's.",
        "For Valentine's Day, the teacher has everyone write a card to a classmate. You drew the kid who eats his boogers.",
        "Valentine's Day at school. Someone slipped a heart-shaped lollipop into your pencil case with a note: 'Signed: you know who'. You don't know who.",
        "Valentine's Day. Your buddy asks you to deliver his card to someone in class, because he's too shy. The card is for you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Enquêter', en: 'Investigate' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai comparé les écritures de toute la classe pendant la dictée. J'ai trouvé. On s'est tenu la main à la récré pendant trois jours. Puis c'était fini. Une vraie histoire.", "J'ai mené l'enquête comme un détective. C'était ma voisine de table. On a partagé son goûter. C'est presque comme se marier."], en: ["I compared everyone's handwriting during dictation. Found them. We held hands at recess for three days. Then it was over. A real love story.", "I investigated like a detective. It was my desk neighbor. We shared their snack. That's almost like getting married."] }, fx: { happy: 7, smarts: 2 }, mood: 'love' },
          { w: 1, text: { fr: ["Mon enquête a révélé que la carte venait de ma mère, qui l'avait glissée « pour me faire plaisir ». J'ai pleuré dans les toilettes de l'école.", "J'ai accusé la mauvaise personne devant toute la classe. Tout le monde a crié « ils sont amoureux ! ». On ne l'est pas. Je dois déménager."], en: ["My investigation revealed the card was from my mom, who'd slipped it in 'to make me happy'. I cried in the school bathroom.", "I accused the wrong person in front of the whole class. Everyone yelled 'they're in love!'. We're not. I need to move."] }, fx: { happy: -4 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Manger la sucette', en: 'Eat the lollipop' },
        text: { fr: ["J'ai mangé la sucette. L'amour, c'est bien, mais le sucre, c'est sûr.", "J'ai mangé la sucette et jeté le mot. Mon cœur est fermé. Mon estomac, lui, est ouvert à toutes les propositions."], en: ["I ate the lollipop. Love is nice, but sugar is a sure thing.", "I ate the lollipop and tossed the note. My heart is closed. My stomach is open to all offers."] },
        fx: { happy: 3 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_val_restaurant',
    icon: '🦪',
    cat: 'holiday',
    rating: 2,
    cooldown: 3,
    when: { age: [20, 75], has: 'lover' },
    actor: 'lover',
    scene: { place: 'party', mood: 'love' },
    text: {
      fr: [
        "Dîner de Saint-Valentin avec {a.first}. Menu spécial à [[89|120|150]] € : huîtres, {w:food} en mousse et un violoniste qui joue {w:song} trop près de ton oreille.",
        "Restaurant pour la Saint-Valentin. À la table d'à côté, un homme vient de demander sa compagne en mariage. Elle a dit non. Le violoniste continue de jouer.",
        "Saint-Valentin au restaurant avec {a.first}. Les huîtres ont une odeur bizarre. Le serveur jure qu'elles sont « d'une fraîcheur absolue ». Il transpire.",
        "Dîner aux chandelles. {a.first} te fait du pied sous la table. Puis tu réalises que ce n'est pas le pied de {a.first}. C'est celui du monsieur derrière toi.",
      ],
      en: [
        "Valentine's dinner with {a.first}. Special [[$89|$120|$150]] menu: oysters, {w:food} turned into foam and a violinist playing {w:song} way too close to your ear.",
        "Valentine's restaurant. At the next table, a man just proposed to his girlfriend. She said no. The violinist keeps playing.",
        "Valentine's Day at a restaurant with {a.first}. The oysters smell weird. The waiter swears they're 'absolutely fresh'. He's sweating.",
        "Candlelit dinner. {a.first} is playing footsie under the table. Then you realize it's not {a.first}'s foot. It belongs to the man behind you.",
      ],
    },
    choices: [
      {
        label: { fr: 'Manger les huîtres', en: 'Eat the oysters' },
        out: [
          { w: 1, text: { fr: ["Les huîtres étaient fraîches et aphrodisiaques. On n'a pas pris de dessert. On n'a même pas pris le taxi : la voiture a suffi.", "On a mangé les huîtres en se regardant dans les yeux. On a fini la soirée à la maison, dans une tenue très légère. Le violoniste aurait été de trop."], en: ["The oysters were fresh and aphrodisiac. We skipped dessert. We didn't even take a cab: the car was enough.", "We ate the oysters gazing into each other's eyes. We finished the night at home, very lightly dressed. The violinist would have been one too many."] }, fx: { happy: 10, rel: 12, money: -200 }, mood: 'love', icon: '🔥' },
          { w: 1, text: { fr: ["À 23 h, les huîtres ont réclamé leur liberté. On s'est battus pour les toilettes du restaurant. J'ai perdu. Le pot de fleurs de l'entrée, aussi. Le violoniste a joué plus fort pour couvrir les bruits.", "Intoxication en duo. On a passé la nuit à se relayer aux toilettes en se tenant la main. C'est ça, l'amour vrai : partager une seule cuvette."], en: ["At 11 p.m., the oysters demanded their freedom. We fought over the restaurant bathroom. I lost. So did the potted plant by the entrance. The violinist played louder to cover the sounds.", "Joint food poisoning. We spent the night taking turns in the bathroom, holding hands. True love is sharing a single toilet."] }, fx: { happy: -6, health: -8, rel: 4, money: -200, disease: 'food_poisoning', visual: 'poop' }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Consoler la voisine', en: 'Console the neighbor' },
        text: { fr: ["Je suis allé{|e} réconforter la femme qui avait dit non. {a.first} a mangé seul{a:|e}. J'ai fini par conseiller tout le restaurant. J'ai ouvert un cabinet de coaching le mois suivant.", "J'ai offert un verre au pauvre type rejeté. Il m'a raconté toute sa vie. {a.first} est parti{a:|e} au dessert. Je crois que je me suis fait un ami. Et un problème."], en: ["I went to comfort the woman who said no. {a.first} ate alone. I ended up counseling the whole restaurant. Opened a coaching practice the next month.", "I bought the rejected guy a drink. He told me his whole life story. {a.first} left at dessert. I think I made a friend. And a problem."] },
        fx: { happy: 2, rel: -8, karma: 4 },
        mood: 'neutral',
      },
    ],
  },
  // ───────────────────────────── Easter ─────────────────────────────
  {
    id: 'ho_easter_hunt',
    icon: '🥚',
    cat: 'holiday',
    rating: 0,
    cooldown: 2,
    when: { age: [3, 10] },
    scene: { place: 'park', mood: 'happy' },
    text: {
      fr: [
        "Chasse aux œufs de Pâques dans le jardin de mamie. Ton cousin a déjà [[douze|quinze|vingt]] œufs. Toi, tu as trouvé {w:object} et un escargot.",
        "Pâques ! Les cloches sont passées. Ton cousin bouscule tout le monde pour attraper les œufs. Il a un panier deux fois plus grand que le tien.",
        "Chasse aux œufs {w:weather}. Il reste un énorme lapin en chocolat caché quelque part. Toi et ton cousin l'avez vu en même temps.",
        "C'est Pâques. Ton oncle a caché les œufs « un peu trop bien ». Il ne se souvient plus où. Il a bu {w:drink} pendant qu'il les cachait.",
      ],
      en: [
        "Easter egg hunt in Grandma's garden. Your cousin already has [[twelve|fifteen|twenty]] eggs. You found {w:object} and a snail.",
        "Easter! The Easter bunny came. Your cousin is shoving everyone to grab the eggs. His basket is twice the size of yours.",
        "Egg hunt {w:weather}. There's one giant chocolate bunny hidden somewhere. You and your cousin spotted it at the same time.",
        "It's Easter. Your uncle hid the eggs 'a little too well'. He can't remember where. He was drinking {w:drink} while hiding them.",
      ],
    },
    choices: [
      {
        label: { fr: 'Sprinter vers le lapin', en: 'Sprint for the bunny' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai sprinté, plongé dans les orties et attrapé le lapin géant. J'ai des cloques partout et un lapin d'un kilo. Victoire.", "J'ai été plus rapide. Mon cousin a pleuré. J'ai mangé les oreilles du lapin devant lui. Pâques, c'est la loi de la jungle."], en: ["I sprinted, dove into the nettles and grabbed the giant bunny. Blisters everywhere and a two-pound bunny. Victory.", "I was faster. My cousin cried. I ate the bunny's ears in front of him. Easter is the law of the jungle."] }, fx: { happy: 8, athletic: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["On s'est jetés dessus en même temps. Le lapin s'est cassé en deux. J'ai eu le derrière. Le derrière, c'est le moins bon.", "J'ai glissé sur la pelouse mouillée et j'ai atterri dans le bac à compost. Mon cousin a eu le lapin, et moi, {w:smell}."], en: ["We jumped on it at the same time. The bunny broke in half. I got the butt end. The butt is the worst part.", "I slipped on the wet lawn and landed in the compost bin. My cousin got the bunny. I got {w:smell}."] }, fx: { happy: -2 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Fouiller là où personne ne cherche', en: 'Search where no one looks' },
        text: { fr: ["J'ai cherché dans les endroits bizarres : la boîte aux lettres, les bottes de papy, le barbecue. Jackpot. Il y avait même des œufs de l'an dernier. Je les ai mangés aussi.", "J'ai trouvé les œufs oubliés de mon oncle dans la gouttière. Mamie m'a nommé{|e} « {meilleur chercheur|meilleure chercheuse} de la famille ». J'ai un titre."], en: ["I searched the weird spots: the mailbox, Grandpa's boots, the grill. Jackpot. There were even eggs from last year. I ate those too.", "I found my uncle's forgotten eggs in the gutter. Grandma named me 'best hunter in the family'. I have a title."] },
        fx: { happy: 6, smarts: 2 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_easter_lunch_auto',
    icon: '🐰',
    cat: 'family',
    rating: 0,
    auto: true,
    cooldown: 3,
    when: { age: [10, 95] },
    text: {
      fr: [
        "Déjeuner de Pâques en famille : gigot, flageolets et {w:food}. Mon oncle a parlé politique, ma tante a parlé régime, j'ai mangé un lapin en chocolat entier sous la table.",
        "À Pâques, j'ai décapité un lapin en chocolat d'un coup de dent. Ma nièce a assisté à la scène. Elle ne me regarde plus de la même façon.",
        "Pâques chez mamie : chasse aux œufs pour les petits, chasse aux compliments pour les grands. Mamie m'a dit que j'avais « forci ». J'ai repris du gigot.",
        "Lundi de Pâques. J'ai mangé tellement de chocolat que j'ai vu {w:celeb} me parler depuis le grille-pain. Il m'a conseillé d'arrêter.",
      ],
      en: [
        "Easter family lunch: leg of lamb, beans and {w:food}. My uncle talked politics, my aunt talked diets, I ate a whole chocolate bunny under the table.",
        "At Easter, I decapitated a chocolate bunny in one bite. My niece witnessed it. She doesn't look at me the same way anymore.",
        "Easter at Grandma's: egg hunt for the kids, compliment hunt for the grown-ups. Grandma said I've 'filled out'. I had more lamb.",
        "Easter Monday. I ate so much chocolate I saw {w:celeb} talking to me from the toaster. He told me to stop.",
      ],
    },
    fx: { happy: 3, weight: 0.01 },
  },
  {
    id: 'ho_easter_rotten',
    icon: '🤢',
    cat: 'holiday',
    rating: 2,
    cooldown: 4,
    when: { age: [20, 70], movedOut: true },
    scene: { place: 'home', mood: 'sick', fx: 'poop' },
    text: {
      fr: [
        "Cet été, une odeur atroce envahit ton salon. Elle vient de quelque part. Tu te souviens vaguement d'avoir caché des œufs durs pour Pâques. Il y a quatre mois.",
        "Depuis une semaine, ça sent {w:smell} dans tout l'appart, en pire. Ton invité de Pâques jure qu'il avait caché « juste quinze œufs ». Tu en as retrouvé quatorze.",
        "La chaleur de juillet a révélé un secret : un œuf de Pâques oublié, quelque part. Les mouches l'ont trouvé avant toi. Elles sont des centaines.",
        "Ton chat refuse d'entrer dans le salon depuis Pâques. Aujourd'hui, tu as compris pourquoi : il y a un œuf dur dans le canapé. Il est vert. Il bouge un peu.",
      ],
      en: [
        "This summer, a horrific smell invades your living room. It's coming from somewhere. You vaguely remember hiding hard-boiled eggs for Easter. Four months ago.",
        "For a week, the whole apartment has smelled like {w:smell}, but worse. Your Easter guest swears he hid 'just fifteen eggs'. You found fourteen.",
        "July heat revealed a secret: a forgotten Easter egg, somewhere. The flies found it before you. There are hundreds.",
        "Your cat has refused to enter the living room since Easter. Today you found out why: there's a hard-boiled egg in the couch. It's green. It's moving slightly.",
      ],
    },
    choices: [
      {
        label: { fr: 'Chercher l\'œuf', en: 'Hunt for the egg' },
        out: [
          { w: 2, text: { fr: ["Je l'ai trouvé dans l'enceinte de la chaîne hi-fi. En le sortant, il a éclaté. Le jus soufré a giclé sur mon visage. J'ai vomi, le chat a vomi, la plante verte a jauni.", "L'œuf était dans le pot de la plante. Il a explosé quand je l'ai touché, un geyser vert odeur de mort. J'ai brûlé mes vêtements dans le jardin."], en: ["Found it inside the stereo speaker. When I pulled it out, it burst. Sulfur juice sprayed my face. I puked, the cat puked, the houseplant turned yellow.", "The egg was in the plant pot. It exploded when I touched it, a green geyser of death smell. I burned my clothes in the yard."] }, fx: { happy: -6, health: -4 }, mood: 'sick', icon: '🤮' },
          { w: 1, text: { fr: ["Je ne l'ai jamais trouvé. J'ai déménagé. Les nouveaux locataires l'ont trouvé en décembre. Ils ont appelé la police.", "J'ai cherché pendant six heures. Il était dans ma poche de manteau. Je l'ai porté tout le printemps."], en: ["I never found it. I moved out. The new tenants found it in December. They called the police.", "I searched for six hours. It was in my coat pocket. I'd been wearing it all spring."] }, fx: { happy: -4, stress: 6, money: -200 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Accuser l\'invité', en: 'Blame the guest' },
        text: { fr: ["J'ai appelé mon invité de Pâques pour l'insulter. Il m'a dit où était l'œuf : dans ma chaussure de ski. Il l'avait caché exprès. On n'est plus amis. Il a gagné.", "J'ai envoyé la facture du nettoyage à celui qui avait caché les œufs. Il m'a renvoyé {w:gift} en guise d'excuse. Ça ne sent pas mieux."], en: ["I called my Easter guest to yell at him. He told me where the egg was: in my ski boot. He hid it there on purpose. We're not friends anymore. He won.", "I sent the cleaning bill to whoever hid the eggs. He sent back {w:gift} as an apology. It doesn't smell any better."] },
        fx: { happy: 1, stress: 3 },
        mood: 'angry',
      },
    ],
  },
  // ───────────────────────────── Mother's / Father's Day ─────────────────────────────
  {
    id: 'ho_mothers_day_kid',
    icon: '💐',
    cat: 'family',
    rating: 0,
    cooldown: 2,
    when: { age: [4, 10], has: 'mother' },
    actor: 'mother',
    scene: { place: 'home', mood: 'love' },
    text: {
      fr: [
        "Fête des mères. À l'école, tu as fabriqué un collier de pâtes peint à la gouache. La gouache n'est pas sèche et certaines pâtes sont crues.",
        "C'est la fête des mères. Tu as préparé un petit-déjeuner au lit pour {a.rel} : du café froid, {w:food} et beaucoup de miettes dans les draps.",
        "Fête des mères ! La maîtresse vous a fait écrire un poème. Le tien rime « maman » avec « méchant ». Tu trouves que ça marche.",
        "Pour la fête des mères, tu as économisé [[deux|trois|cinq]] euros. Avec ça, tu as acheté {w:gift} à la brocante. Il y a encore l'étiquette.",
      ],
      en: [
        "Mother's Day. At school, you made a pasta necklace painted with poster paint. The paint isn't dry and some of the pasta is raw.",
        "It's Mother's Day. You made {a.rel} breakfast in bed: cold coffee, {w:food} and lots of crumbs in the sheets.",
        "Mother's Day! The teacher made you write a poem. Yours rhymes 'mommy' with 'grumpy'. You think it works.",
        "For Mother's Day, you saved up [[two|three|five]] bucks. With it, you bought {w:gift} at a yard sale. The price tag is still on.",
      ],
    },
    choices: [
      {
        label: { fr: 'Offrir fièrement', en: 'Give it proudly' },
        out: [
          { w: 3, text: { fr: ["{a.first}, ma mère, a pleuré. Elle a porté mon cadeau toute la journée, même au supermarché. Elle le garde dans une boîte à souvenirs. Il y a déjà trente-deux colliers dedans.", "Ma mère m'a serré{|e} si fort que j'ai cru que j'allais éclater. Elle a dit que c'était « le plus beau cadeau du monde ». Elle dit ça chaque année. Je la crois chaque année."], en: ["My mom cried. She wore my gift all day, even at the supermarket. She keeps it in a memory box. There are already thirty-two necklaces in it.", "Mom hugged me so hard I thought I'd pop. She said it was 'the best present in the world'. She says that every year. I believe her every year."] }, fx: { happy: 7, rel: 12 }, mood: 'love' },
          { w: 1, text: { fr: ["Le collier a déteint sur son chemisier blanc. Elle a dit « c'est pas grave » avec une petite voix. Le chemisier est maintenant une œuvre d'art abstraite.", "Le petit-déjeuner au lit s'est renversé sur l'oreiller. Elle a dormi dans le café. Elle a souri quand même."], en: ["The necklace bled onto her white blouse. She said 'it's fine' in a tiny voice. The blouse is now abstract art.", "Breakfast in bed spilled on the pillow. She slept in coffee. She smiled anyway."] }, fx: { happy: 2, rel: 6 }, mood: 'neutral' },
        ],
      },
      {
        label: { fr: 'Le manger en chemin', en: 'Eat it on the way' },
        text: { fr: ["J'ai mangé les pâtes du collier dans le bus. Il restait la ficelle. Je l'ai offerte en disant que c'était « minimaliste ». Ma mère a ri très fort.", "J'ai mangé le petit-déjeuner que je lui avais préparé. Elle m'a trouvé{|e} endormi{|e} sur le plateau. Elle a pris une photo. C'est son fond d'écran."], en: ["I ate the necklace pasta on the bus. Only the string was left. I gave it to her saying it was 'minimalist'. Mom laughed really hard.", "I ate the breakfast I'd made for her. She found me asleep on the tray. She took a picture. It's her wallpaper."] },
        fx: { happy: 4, rel: 4 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_fathers_day',
    icon: '👔',
    cat: 'family',
    rating: 1,
    cooldown: 3,
    when: { age: [16, 65], has: 'father' },
    actor: 'father',
    scene: { place: 'home', mood: 'neutral' },
    text: {
      fr: [
        "Fête des pères. Ton père dit chaque année qu'il « ne veut rien ». L'an dernier, tu l'as cru. Il a boudé jusqu'en août.",
        "C'est la fête des pères. Tes options : {w:gift}, une cravate, ou un kit barbecue avec un tablier « Le chef, c'est moi ». Il a déjà quatre tabliers.",
        "Fête des pères. Ton père t'appelle pour te dire qu'il a « vu une perceuse en promo ». C'est un message codé. Le code n'est pas subtil.",
        "Pour la fête des pères, la famille organise un barbecue. {a.first} a mis son plus beau short. Il est prêt à recevoir {w:gift} avec une fausse surprise.",
      ],
      en: [
        "Father's Day. Every year your dad says he 'doesn't want anything'. Last year, you believed him. He sulked until August.",
        "It's Father's Day. Your options: {w:gift}, a tie, or a grill kit with a 'King of the Grill' apron. He already has four aprons.",
        "Father's Day. Your dad calls to say he 'saw a drill on sale'. It's a coded message. The code isn't subtle.",
        "For Father's Day, the family's having a barbecue. {a.first} put on his best shorts. He's ready to receive {w:gift} with fake surprise.",
      ],
    },
    choices: [
      {
        label: { fr: 'Offrir la perceuse', en: 'Give the drill' },
        out: [
          { w: 2, text: { fr: ["Il a eu la perceuse. Il a percé onze trous dans le salon en une après-midi, pour rien, juste pour le plaisir. Je ne l'ai jamais vu aussi heureux.", "Mon père a déballé la perceuse comme un enfant à Noël. Il l'a fait vrombir pendant le repas. Ma mère m'a regardé{|e} avec haine."], en: ["He got the drill. He drilled eleven holes in the living room in one afternoon, for no reason, just for fun. I've never seen him so happy.", "My dad unwrapped the drill like a kid at Christmas. He revved it during lunch. My mom glared at me with hatred."] }, fx: { happy: 5, rel: 12, money: -90 }, mood: 'happy' },
          { w: 1, text: { fr: ["Il a testé la perceuse tout de suite. Sur une conduite d'eau. Le salon a été inondé, mon père était trempé et ravi. « Elle a de la puissance ! » a-t-il crié sous la cascade.", "Il a percé un mur porteur. Un tableau est tombé, puis une étagère, puis le moral de ma mère. Il dit que c'est « une rénovation »."], en: ["He tested the drill right away. On a water pipe. The living room flooded, Dad was soaked and delighted. 'It's got power!' he shouted under the waterfall.", "He drilled into a load-bearing wall. A painting fell, then a shelf, then my mom's morale. He calls it 'a renovation'."] }, fx: { happy: 3, rel: 8, money: -90, stress: 3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'L\'emmener boire un coup', en: 'Take him for a drink' },
        text: { fr: ["On est allés au bar tous les deux. Après trois bières, il m'a avoué qu'il avait toujours voulu être {w:weird_job}. On a pleuré. On n'en reparlera jamais.", "Je l'ai emmené boire un verre. Il a raconté ses bêtises de jeunesse. J'ai appris des choses sur ma conception que je ne voulais pas savoir. Jamais."], en: ["We went to the bar, just us. After three beers, he admitted he'd always wanted to be {w:weird_job}. We cried. We'll never speak of it again.", "I took him for a drink. He told stories about his wild youth. I learned things about my own conception that I never wanted to know. Ever."] },
        fx: { happy: 6, rel: 15, health: -1 },
        mood: 'love',
      },
      {
        label: { fr: 'Oublier complètement', en: 'Forget entirely' },
        text: { fr: ["J'ai oublié. Il a dit « c'est rien » au téléphone. Puis il a changé son testament, symboliquement, avec un post-it.", "Oubli total. Ma mère m'a envoyé une photo de lui assis seul devant le barbecue éteint. Elle sait faire mal."], en: ["I forgot. He said 'it's nothing' on the phone. Then he changed his will, symbolically, with a sticky note.", "Total amnesia. My mom sent me a photo of him sitting alone by the cold grill. She knows how to hurt."] },
        fx: { happy: -3, rel: -10 },
        mood: 'sad',
      },
    ],
  },
  {
    id: 'ho_mothers_day_adult',
    icon: '📞',
    cat: 'family',
    rating: 1,
    cooldown: 3,
    when: { age: [18, 70], has: 'mother', movedOut: true },
    actor: 'mother',
    scene: { place: 'apartment', mood: 'neutral', prop: 'phone' },
    text: {
      fr: [
        "Fête des mères. Ta mère t'appelle à 8 h « juste pour dire bonjour ». Elle n'a pas dit un mot sur la fête des mères. C'est un test.",
        "C'est la fête des mères. Ta sœur a déjà offert un spa, une croisière et un poème encadré. Toi, tu as {w:gift} et un mot écrit au stylo qui bave.",
        "Fête des mères. Ta mère a posté sur {w:app} : « Certaines mères ont des enfants qui appellent. » Il y a déjà [[douze|vingt-trois|quarante]] commentaires.",
        "Dimanche, fête des mères. Ta mère t'attend à déjeuner. Elle a préparé {w:food}, ton plat « préféré ». Tu as détesté ça toute ta vie.",
      ],
      en: [
        "Mother's Day. Your mom calls at 8 a.m. 'just to say hi'. She didn't say a word about Mother's Day. It's a test.",
        "It's Mother's Day. Your sister already gave a spa day, a cruise and a framed poem. You have {w:gift} and a note written in a leaky pen.",
        "Mother's Day. Your mom posted on {w:app}: 'Some mothers have children who call.' There are already [[twelve|twenty-three|forty]] comments.",
        "Sunday, Mother's Day. Your mom is expecting you for lunch. She made {w:food}, your 'favorite'. You've hated it your whole life.",
      ],
    },
    choices: [
      {
        label: { fr: 'Débarquer avec des fleurs', en: 'Show up with flowers' },
        out: [
          { w: 2, text: { fr: ["Je suis arrivé{|e} avec un énorme bouquet. Elle a pleuré, m'a reproché de ne pas venir assez souvent, puis m'a resservi trois fois. Classique, parfait.", "J'ai sonné avec des fleurs et un gâteau. Elle a dit « Oh, il ne fallait pas » en m'arrachant le gâteau des mains. On a passé un super dimanche."], en: ["I showed up with a huge bouquet. She cried, scolded me for not visiting enough, then served me three helpings. Classic, perfect.", "I rang with flowers and a cake. She said 'Oh, you shouldn't have' while snatching the cake from my hands. We had a great Sunday."] }, fx: { happy: 6, rel: 14, money: -60 }, mood: 'love' },
          { w: 1, text: { fr: ["Elle est allergique aux lys. Je le savais. Je l'avais oublié. Elle a éternué trente fois et a dit que c'était « le plus beau bouquet du monde » entre deux crises.", "Les fleurs venaient du cimetière. Je ne l'ai pas dit. Elle a reconnu le ruban « À notre regretté Gérard »."], en: ["She's allergic to lilies. I knew it. I forgot. She sneezed thirty times and called it 'the most beautiful bouquet in the world' between fits.", "The flowers came from the cemetery. I didn't say so. She recognized the ribbon: 'To our beloved Gerald'."] }, fx: { happy: -2, rel: 4, karma: -2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Un simple appel', en: 'Just a phone call' },
        text: { fr: ["Je l'ai appelée. Elle m'a parlé pendant deux heures de la voisine, de son genou et du dernier épisode : {w:show}. J'ai dit « hm hm » quatre cents fois. Elle était ravie.", "Un appel de dix minutes, qui en a duré soixante-dix. J'ai appris que mon cousin divorçait, que le chien était au régime et que j'étais « une déception mais qu'elle m'aime »."], en: ["I called her. She talked for two hours about the neighbor, her knee and the latest episode of {w:show}. I said 'mm-hmm' four hundred times. She was thrilled.", "A ten-minute call that lasted seventy. I learned my cousin is divorcing, the dog is on a diet and I'm 'a disappointment but she loves me'."] },
        fx: { happy: 2, rel: 6 },
        mood: 'neutral',
      },
    ],
  },
  // ───────────────────────────── summer ─────────────────────────────
  {
    id: 'ho_july14_fireworks',
    icon: '🎆',
    cat: 'holiday',
    rating: 0,
    cooldown: 2,
    when: { age: [5, 90], country: ['fr'] },
    scene: { place: 'park', mood: 'happy' },
    text: {
      fr: [
        "14 juillet. Toute la ville est massée au bord du fleuve pour le feu d'artifice. Un enfant sur les épaules de son père bloque toute ta vue. Il mange {w:food}.",
        "Feu d'artifice du 14 juillet. Tu as trouvé une place parfaite sur l'herbe. Trente secondes plus tard, une famille de [[huit|douze|quinze]] personnes déplie une nappe sur tes pieds.",
        "C'est le 14 juillet. Le feu d'artifice municipal a pris du retard. La foule s'impatiente. Quelqu'un lance « {w:exclaim} » et tout le monde applaudit.",
        "14 juillet {w:weather}. Le feu d'artifice commence. Le maire a choisi {w:song} comme bande-son. Les fusées n'ont pas l'air d'accord.",
      ],
      en: [
        "Bastille Day. The whole town is packed along the river for the fireworks. A kid on his dad's shoulders blocks your entire view. He's eating {w:food}.",
        "Bastille Day fireworks. You found a perfect spot on the grass. Thirty seconds later, a family of [[eight|twelve|fifteen]] unfolds a picnic blanket on your feet.",
        "It's Bastille Day. The town fireworks are running late. The crowd is restless. Someone yells '{w:exclaim}' and everyone claps.",
        "Bastille Day {w:weather}. The fireworks begin. The mayor picked {w:song} as the soundtrack. The rockets don't seem to agree.",
      ],
    },
    choices: [
      {
        label: { fr: 'Admirer le spectacle', en: 'Enjoy the show' },
        out: [
          { w: 3, text: { fr: ["Le bouquet final a illuminé le ciel. Toute la foule a fait « ooooh » en même temps. J'ai senti quelque chose de patriotique. Ou c'était le merguez.", "J'ai regardé le feu d'artifice allongé{|e} dans l'herbe. Des étoiles rouges, bleues et une verte, ratée. C'était magnifique."], en: ["The grand finale lit up the sky. The whole crowd went 'oooooh' in unison. I felt something patriotic. Or it was the sausage.", "I watched the fireworks lying in the grass. Red stars, blue stars, and one failed green one. It was beautiful."] }, fx: { happy: 7, stress: -4 }, mood: 'happy' },
          { w: 1, text: { fr: ["Une fusée est partie à l'horizontale et a traversé la foule en sifflant. Elle a frôlé mon oreille. J'ai senti l'odeur de mes cheveux grillés. Je suis patriote, mais pas à ce point.", "Un orage a éclaté au bouquet final. On ne savait plus si c'était le tonnerre ou les fusées. J'ai couru sous la pluie, trempé{|e} et ravi{|e}."], en: ["A rocket flew sideways and whistled through the crowd. It grazed my ear. I smelled my hair burning. I'm patriotic, but not that much.", "A storm broke during the grand finale. We couldn't tell thunder from rockets. I ran through the rain, soaked and delighted."] }, fx: { happy: 2, stress: 4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Négocier une meilleure place', en: 'Negotiate a better spot' },
        text: { fr: ["J'ai offert {w:drink} au père de l'enfant pour qu'il le pose. Il a accepté. L'enfant m'a regardé{|e} avec une haine pure tout le spectacle. J'ai tout vu.", "J'ai grimpé sur un abribus. La vue était parfaite. Un policier m'a fait descendre, puis il est monté à ma place."], en: ["I offered the dad {w:drink} to put his kid down. He accepted. The kid glared at me with pure hatred the whole show. I saw everything.", "I climbed onto a bus shelter. Perfect view. A cop made me come down, then climbed up himself."] },
        fx: { happy: 4, karma: -1 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_firemen_ball',
    icon: '🚒',
    cat: 'party',
    rating: 2,
    cooldown: 3,
    when: { age: [18, 80], country: ['fr', 'be'] },
    scene: { place: 'party', mood: 'party' },
    text: {
      fr: [
        "Bal des pompiers du 14 juillet. La caserne est bondée, la buvette sert {w:drink} et un pompier de deux mètres te propose une danse sur {w:song}.",
        "Tu es au bal des pompiers. Le DJ est le lieutenant, la sono est dans la grande échelle et ta tante danse collée-serrée avec un sapeur de vingt ans.",
        "Bal des pompiers. Il est 2 h du matin. Les pompiers torse nu servent des shots à la lance à incendie. Ce n'est pas réglementaire, mais personne ne se plaint.",
        "Au bal du 14 juillet, un pompier te glisse : « Tu sais, j'ai les clés du camion. » Il a un sourire ravageur et une haleine qui évoque {w:food}.",
      ],
      en: [
        "Firefighters' ball on Bastille Day. The station is packed, the bar is serving {w:drink} and a six-foot-five firefighter asks you to dance to {w:song}.",
        "You're at the firefighters' ball. The DJ is the lieutenant, the sound system is on the ladder truck and your aunt is slow-dancing with a twenty-year-old rookie.",
        "Firefighters' ball. It's 2 a.m. Shirtless firefighters are serving shots from a fire hose. Not regulation, but nobody's complaining.",
        "At the Bastille Day ball, a firefighter whispers: 'You know, I've got the keys to the truck.' He has a killer smile and breath reminiscent of {w:food}.",
      ],
    },
    choices: [
      {
        label: { fr: 'Danser avec le pompier', en: 'Dance with the firefighter' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["On a dansé jusqu'à l'aube. J'ai fini dans la cabine du camion, avec la sirène qui s'est déclenchée au pire moment. Toute la caserne a applaudi.", "Slow, rock, madison, puis un tour en camion. Il m'a laissé{|e} essayer le casque. Et le reste. Vive la République."], en: ["We danced till dawn. I ended up in the truck cab, and the siren went off at the worst possible moment. The whole station applauded.", "Slow dance, rock, line dance, then a ride in the truck. He let me try on the helmet. And everything else. Vive la République."] }, fx: { happy: 12, stress: -6 }, mood: 'love', icon: '🔥' },
          { w: 1, text: { fr: ["Il m'a fait tourner si vite que j'ai vomi le punch sur son uniforme d'apparat. Il a dit « j'ai connu pire » en s'essuyant. Il a été appelé pour un vrai incendie. Je crois qu'il a été soulagé.", "J'ai dansé avec lui, ma tante aussi, ma mère aussi. On s'est disputé le pompier près du stand de merguez. Il est parti avec le DJ."], en: ["He spun me so fast I puked punch on his dress uniform. He said 'I've seen worse' while wiping off. He got called to a real fire. I think he was relieved.", "I danced with him, so did my aunt, so did my mom. We fought over him by the sausage stand. He left with the DJ."] }, fx: { happy: -3, health: -2 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Rester à la buvette', en: 'Stay at the bar' },
        text: { fr: ["J'ai tenu la buvette toute la nuit avec un vieux pompier à la retraite. Il m'a raconté quarante ans d'interventions, dont une avec un homme coincé dans {w:object}. J'en rêve encore.", "J'ai bu, j'ai ri, j'ai mangé six merguez. J'ai été élu{|e} « personnalité du bal » sans savoir pourquoi."], en: ["I held down the bar all night with a retired firefighter. He told me forty years of call-outs, including a man stuck in {w:object}. I still dream about it.", "I drank, laughed and ate six sausages. I was voted 'personality of the ball' without knowing why."] },
        fx: { happy: 6, health: -3, weight: 0.02 },
        mood: 'party',
      },
    ],
  },
  {
    id: 'ho_bbq_summer',
    icon: '🍖',
    cat: 'party',
    rating: 1,
    cooldown: 2,
    when: { age: [16, 85] },
    scene: { place: 'park', mood: 'happy' },
    text: {
      fr: [
        "Barbecue d'été chez les voisins. Le maître du grill porte un tablier « Kiss the cook » et ne sait visiblement pas faire la différence entre « cuit » et « carbonisé ».",
        "Barbecue entre amis {w:weather}. Les saucisses sont crues à l'intérieur, noires à l'extérieur. Un chien inconnu tourne autour de la table.",
        "C'est l'été, le barbecue fume, et ton beau-frère vient de verser de l'alcool à brûler sur les braises « pour que ça prenne plus vite ». Ses sourcils sont en danger.",
        "Barbecue géant au camping. Quelqu'un a apporté {w:food}, quelqu'un d'autre {w:drink}. Personne n'a pensé aux assiettes. Une guêpe est entrée dans ta canette.",
      ],
      en: [
        "Summer barbecue at the neighbors'. The grill master wears a 'Kiss the Cook' apron and clearly can't tell 'cooked' from 'cremated'.",
        "Barbecue with friends {w:weather}. The sausages are raw inside, black outside. A strange dog is circling the table.",
        "It's summer, the grill is smoking, and your brother-in-law just poured lighter fluid on the coals 'to speed it up'. His eyebrows are in danger.",
        "Giant barbecue at the campsite. Someone brought {w:food}, someone else {w:drink}. Nobody thought of plates. A wasp just crawled into your can.",
      ],
    },
    choices: [
      {
        label: { fr: 'Prendre le grill en main', en: 'Take over the grill' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai pris le contrôle du barbecue. Viande parfaite, légumes grillés, saucisses dorées. On m'a proclamé{|e} « {roi|reine} du grill ». J'ai gardé la pince comme un sceptre.", "J'ai sauvé le barbecue. Le maître du grill a boudé dans son transat. Tout le monde a mangé. Personne n'a été malade. C'est rare."], en: ["I took over the grill. Perfect meat, grilled veggies, golden sausages. They crowned me 'grill royalty'. I kept the tongs like a scepter.", "I saved the barbecue. The grill master sulked in his lounge chair. Everyone ate. Nobody got sick. That's rare."] }, fx: { happy: 7, karma: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["La graisse a fait une flamme de deux mètres. J'ai perdu les poils des avant-bras et le parasol du voisin. Les saucisses, elles, étaient parfaites.", "J'ai fait tomber toutes les côtelettes dans les braises. Le chien inconnu en a profité. Il est reparti avec six côtelettes. Il ne reviendra pas, il n'en a pas besoin."], en: ["The grease shot up a six-foot flame. I lost my forearm hair and the neighbor's umbrella. The sausages, however, were perfect.", "I dropped all the chops into the coals. The strange dog seized the moment. He left with six chops. He won't be back; he doesn't need to."] }, fx: { happy: -2, health: -3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Rester au transat', en: 'Stay in the lounge chair' },
        text: { fr: ["Je suis resté{|e} dans le transat avec {w:drink}. J'ai attrapé un coup de soleil en forme de lunettes. On m'a apporté à manger. La vie est belle.", "Transat, rosé, sieste. Je me suis réveillé{|e} avec une guêpe sur la lèvre et un enfant qui me dessinait dessus au feutre."], en: ["I stayed in the lounge chair with {w:drink}. I got a sunburn shaped like sunglasses. People brought me food. Life is good.", "Lounge chair, rosé, nap. Woke up with a wasp on my lip and a kid drawing on me with a marker."] },
        fx: { happy: 5, stress: -6, health: -1 },
        mood: 'sleepy',
      },
    ],
  },
  {
    id: 'ho_bbq_contest',
    icon: '🌭',
    cat: 'party',
    rating: 2,
    cooldown: 4,
    when: { age: [18, 70] },
    scene: { place: 'park', mood: 'party', fx: 'poop' },
    text: {
      fr: [
        "Fête du village : concours du plus gros mangeur de merguez. Le champion en titre s'appelle {w:nickname}, pèse 140 kilos et te regarde comme un steak.",
        "Kermesse d'été. Le comité des fêtes organise un concours : manger [[vingt|trente|quarante]] merguez en dix minutes. Le premier prix, c'est {w:gift}.",
        "Barbecue géant de la fête du village. Le maire lance un défi : celui qui mange le plus de saucisses gagne un an de pain gratuit. Tu as faim. Tu as toujours faim.",
        "Concours de merguez à la fête de la Saint-Jean. Ton adversaire s'échauffe en avalant {w:food} sans mâcher. La foule scande des noms.",
      ],
      en: [
        "Village fair: sausage-eating contest. The reigning champ is called {w:nickname}, weighs 300 pounds and looks at you like a steak.",
        "Summer fair. The festival committee is running a contest: eat [[twenty|thirty|forty]] spicy sausages in ten minutes. First prize is {w:gift}.",
        "Giant village barbecue. The mayor issues a challenge: whoever eats the most sausages wins a year of free bread. You're hungry. You're always hungry.",
        "Sausage contest at the midsummer fair. Your opponent warms up by swallowing {w:food} without chewing. The crowd is chanting names.",
      ],
    },
    choices: [
      {
        label: { fr: 'S\'inscrire', en: 'Sign up' },
        out: [
          { w: 1, text: { fr: ["J'ai mangé vingt-trois merguez et gagné. Puis mon corps a rendu l'intégralité du concours, en direct, en arc-en-ciel harissa, sur le premier rang. Les gens ont filmé. Les gens ont vomi aussi. Réaction en chaîne.", "J'ai gagné par une saucisse. Une heure plus tard, mes intestins ont rendu leur verdict. Les toilettes chimiques ne s'en sont jamais remises. On a dû les évacuer à la grue."], en: ["I ate twenty-three sausages and won. Then my body returned the entire contest, live, in a harissa rainbow, onto the front row. People filmed. People puked too. Chain reaction.", "I won by one sausage. An hour later, my bowels delivered their verdict. The porta-potty never recovered. They had to remove it by crane."] }, fx: { happy: 4, health: -8, fame: 2, weight: 0.03, visual: 'poop' }, mood: 'sick', icon: '🤮' },
          { w: 1, text: { fr: ["Le champion a avalé sa trentième merguez de travers. J'ai fait la manœuvre de Heimlich. La saucisse a atterri dans le chapeau du maire. J'ai gagné le prix du civisme. Et le concours, par forfait.", "J'ai abandonné à la sixième merguez avec dignité. Le champion a gagné, puis il a explosé, façon volcan, sur le stand de crêpes. Je suis content{|e} d'avoir abandonné."], en: ["The champ choked on his thirtieth sausage. I did the Heimlich. The sausage landed in the mayor's hat. I won the good-citizen award. And the contest, by forfeit.", "I quit at sausage six with dignity. The champ won, then erupted like a volcano all over the crêpe stand. Glad I quit."] }, fx: { happy: 7, karma: 3 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Parier sur le champion', en: 'Bet on the champ' },
        text: { fr: ["J'ai parié vingt euros sur {w:nickname}. Il a gagné, puis il a vomi sur le bookmaker. J'ai récupéré mes gains avec des pincettes.", "J'ai parié sur le champion. Il s'est évanoui à la vingtième. J'ai perdu mes vingt euros et l'appétit pour l'été."], en: ["I bet twenty bucks on {w:nickname}. He won, then puked on the bookie. I collected my winnings with tongs.", "I bet on the champ. He passed out at twenty. I lost twenty bucks and my appetite for the summer."] },
        fx: { happy: 2, money: 20 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_festival',
    icon: '🎪',
    cat: 'party',
    rating: 2,
    cooldown: 3,
    when: { age: [18, 45] },
    scene: { place: 'stadium', mood: 'party' },
    text: {
      fr: [
        "Festival de musique d'été. Trois jours, {w:band} en tête d'affiche, de la boue jusqu'aux genoux et des toilettes sèches qui débordent depuis le premier soir.",
        "Tu es en festival. Ta tente s'est envolée pendant la nuit avec ton sac de couchage, tes chaussettes et {w:object}. Il est 6 h et un type joue du djembé.",
        "Festival, jour 2. Tu n'as pas dormi, tu as mangé {w:food} au petit-déjeuner et un inconnu en paillettes te propose « un truc pour tenir ».",
        "Premier rang. Sur scène : {w:band}. La foule pousse, il fait 40 °C et quelqu'un vient de lancer un gobelet de liquide chaud. Ce n'était pas de la bière.",
      ],
      en: [
        "Summer music festival. Three days, {w:band} headlining, knee-deep mud and composting toilets overflowing since night one.",
        "You're at a festival. Your tent blew away overnight with your sleeping bag, your socks and {w:object}. It's 6 a.m. and some guy is playing the djembe.",
        "Festival, day 2. You haven't slept, you had {w:food} for breakfast and a stranger in glitter offers you 'something to keep going'.",
        "Front row. On stage: {w:band}. The crowd is pushing, it's 104°F and someone just threw a cup of warm liquid. It wasn't beer.",
      ],
    },
    choices: [
      {
        label: { fr: 'Slammer dans la foule', en: 'Crowd-surf' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai slammé sur trente mètres, porté par des centaines de mains. J'ai perdu une chaussure, mon t-shirt et ma timidité. Le chanteur m'a pointé{|e} du doigt. Je n'oublierai jamais.", "J'ai surfé sur la foule jusqu'à la scène. Le service de sécurité m'a rattrapé{|e} et reposé{|e} au premier rang. J'ai eu un médiator."], en: ["I crowd-surfed for a hundred feet, carried by hundreds of hands. Lost a shoe, my shirt and my shyness. The singer pointed at me. I'll never forget it.", "I surfed the crowd all the way to the stage. Security caught me and put me back in the front row. I got a guitar pick."] }, fx: { happy: 12, stress: -6 }, mood: 'party' },
          { w: 1, text: { fr: ["La foule s'est écartée au mauvais moment. Je suis tombé{|e} tête la première dans la boue. J'ai avalé de la boue, un gobelet et peut-être une dent. Pas la mienne.", "Pendant le slam, quelqu'un a pris ma chaussure, puis mon pantalon. J'ai fini le concert en slip, couvert{|e} de boue, comme un guerrier préhistorique."], en: ["The crowd parted at the wrong moment. I fell face-first into the mud. Swallowed mud, a cup and maybe a tooth. Not mine.", "While I crowd-surfed, someone took my shoe, then my pants. I finished the show in my underwear, mud-caked, like a prehistoric warrior."] }, fx: { happy: 2, health: -6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Affronter les toilettes', en: 'Brave the toilets' },
        out: [
          { w: 1, text: { fr: ["J'ai ouvert la porte des toilettes sèches. Ce que j'ai vu ne peut pas être décrit, seulement ressenti. La pile dépassait du trou. J'ai fait demi-tour et j'ai utilisé un buisson, comme mes ancêtres.", "Les toilettes ont basculé pendant que j'étais dedans. Je suis sorti{|e} par le toit, couvert{|e} de la contribution de trois mille festivaliers. On m'a arrosé{|e} au jet. Les gens ont applaudi."], en: ["I opened the composting toilet door. What I saw can't be described, only felt. The pile rose above the hole. I turned around and used a bush, like my ancestors.", "The toilet tipped over while I was inside. I climbed out through the roof, covered in the contributions of three thousand festivalgoers. They hosed me down. People clapped."] }, fx: { happy: -8, health: -4, visual: 'poop' }, mood: 'sick', icon: '💩' },
          { w: 1, text: { fr: ["J'ai trouvé les seules toilettes propres du festival, cachées derrière la loge VIP. J'y suis retourné{|e} quarante fois. J'y ai croisé {w:band}.", "J'ai fait la queue quarante minutes. J'ai survécu. J'ai un nouveau respect pour l'humanité et pour mon propre système digestif."], en: ["I found the only clean toilets at the festival, hidden behind the VIP area. Went back forty times. Ran into {w:band} there.", "I waited in line forty minutes. I survived. I have a new respect for humanity and for my own digestive system."] }, fx: { happy: 4, smarts: 1 }, mood: 'proud' },
        ],
      },
    ],
  },
  {
    id: 'ho_summer_camping',
    icon: '⛺',
    cat: 'family',
    rating: 0,
    cooldown: 3,
    when: { age: [6, 15] },
    scene: { place: 'beach', mood: 'happy' },
    text: {
      fr: [
        "Vacances d'été en famille au camping. Ton père a mis trois heures à monter la tente. Elle est à l'envers. Il refuse de l'admettre.",
        "Camping avec tes parents. Le mobil-home d'à côté passe {w:song} en boucle depuis 7 h. Il y a une piscine avec un toboggan géant. Et une file de quarante enfants.",
        "Vacances au camping {w:weather}. Ta mère a apporté des jeux de société. Ton père a apporté des cartes routières. Tu as apporté ton ennui.",
        "Au camping, tu t'es fait un ami en deux minutes près de la piscine. Il s'appelle {w:nickname}, il a ton âge et il prétend avoir vu un requin dans le petit bain.",
      ],
      en: [
        "Family summer vacation at a campsite. Your dad took three hours to pitch the tent. It's inside out. He refuses to admit it.",
        "Camping with your parents. The trailer next door has played {w:song} on loop since 7 a.m. There's a pool with a giant water slide. And a line of forty kids.",
        "Campsite vacation {w:weather}. Your mom brought board games. Your dad brought road maps. You brought your boredom.",
        "At the campsite, you made a friend in two minutes by the pool. He's called {w:nickname}, he's your age and claims he saw a shark in the kiddie pool.",
      ],
    },
    choices: [
      {
        label: { fr: 'Le grand toboggan', en: 'The big slide' },
        out: [
          { w: 3, text: { fr: ["J'ai fait le toboggan géant trente-sept fois. J'ai le maillot usé aux fesses et le sourire jusqu'aux oreilles. Les meilleures vacances de ma vie.", "J'ai descendu le toboggan à plat ventre, la tête la première. Le maître-nageur a sifflé. J'ai recommencé. Il a sifflé plus fort."], en: ["I did the giant slide thirty-seven times. My swimsuit is worn through at the butt and I'm grinning ear to ear. Best vacation ever.", "I went down the slide belly-first, head-first. The lifeguard blew his whistle. I did it again. He blew harder."] }, fx: { happy: 8, athletic: 2 }, mood: 'party' },
          { w: 1, text: { fr: ["Je suis resté{|e} coincé{|e} au milieu du toboggan. L'enfant suivant m'a percuté{|e}, puis le suivant, puis le suivant. On est sortis en grappe. Le maître-nageur a démissionné.", "J'ai perdu mon maillot dans le toboggan. Je suis arrivé{|e} {tout nu|toute nue} dans la piscine, devant tout le camping. On m'a prêté une serviette. Et un surnom."], en: ["I got stuck halfway down the slide. The next kid crashed into me, then the next, then the next. We came out in a cluster. The lifeguard quit.", "I lost my swimsuit in the slide. Arrived naked in the pool in front of the whole campsite. Someone lent me a towel. And a nickname."] }, fx: { happy: -2, stress: 4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Partir à l\'aventure', en: 'Go adventuring' },
        text: { fr: ["Avec mon nouvel ami, on a exploré tout le camping. On a trouvé un raccourci vers la plage, un vieux pédalo et un oncle tout nu dans les dunes. Les meilleures vacances.", "On a construit une cabane dans les pins. On a juré d'être amis pour toujours. On ne s'est jamais reparlé après les vacances. Mais quelles vacances."], en: ["With my new friend, we explored the whole campsite. We found a shortcut to the beach, an old pedal boat and a naked uncle in the dunes. Best vacation.", "We built a hut in the pines. Swore to be friends forever. Never spoke again after the summer. But what a summer."] },
        fx: { happy: 7, smarts: 1 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_summer_grandma_auto',
    icon: '☀️',
    cat: 'family',
    rating: 0,
    auto: true,
    cooldown: 2,
    when: { age: [4, 16] },
    text: {
      fr: [
        "Cet été, j'ai passé deux semaines chez mamie. J'ai mangé {w:food} tous les midis, regardé {w:show} tous les soirs, et pris [[deux|trois|quatre]] kilos de bonheur.",
        "Vacances d'été : j'ai attrapé un coup de soleil, des tiques et {w:animal} dans un bocal. J'ai dû relâcher la bestiole. Pas les tiques.",
        "Grandes vacances. J'ai appris à faire du vélo sans les mains, à tricher aux cartes et à dire un gros mot en patois. Papy était fier. Mamie, moins.",
        "Cet été, on est partis {w:to_place} en famille. Huit heures de voiture, trois disputes, un vomi sur l'autoroute. Je m'en souviendrai toute ma vie.",
      ],
      en: [
        "This summer, I spent two weeks at Grandma's. I ate {w:food} every lunch, watched {w:show} every night and gained [[four|six|eight]] pounds of happiness.",
        "Summer vacation: I got a sunburn, ticks and {w:animal} in a jar. I had to set the critter free. Not the ticks.",
        "Summer break. I learned to ride a bike no-handed, to cheat at cards and to say a swear word in the local dialect. Grandpa was proud. Grandma, less so.",
        "This summer, we went {w:to_place} as a family. Eight hours in the car, three fights, one puke on the highway. I'll remember it forever.",
      ],
    },
    fx: { happy: 5 },
  },
  {
    id: 'ho_fete_musique',
    icon: '🎸',
    cat: 'party',
    rating: 1,
    cooldown: 3,
    when: { age: [15, 70], country: ['fr', 'be'] },
    scene: { place: 'park', mood: 'party', prop: 'microphone' },
    text: {
      fr: [
        "Fête de la musique. Ton voisin du dessus et son groupe de métal joueront sur son balcon toute la nuit. Le chanteur, c'est le comptable du troisième.",
        "21 juin, fête de la musique. Dans ta rue, un type joue « Wonderwall » à la guitare. Pour la [[cinquième|huitième|douzième]] fois. Il ne connaît que ça.",
        "C'est la fête de la musique. Un groupe amateur cherche quelqu'un pour remplacer son batteur, qui a trop bu {w:drink}. Ils te regardent.",
        "Fête de la musique. Il y a des enceintes à chaque coin de rue, une odeur de merguez et {w:song} qui sort de quatre bars en même temps, en décalé.",
      ],
      en: [
        "Music festival night. Your upstairs neighbor and his metal band are playing on his balcony all night. The singer is the accountant from the third floor.",
        "June 21st, street music festival. On your street, a guy is playing 'Wonderwall' on guitar. For the [[fifth|eighth|twelfth]] time. It's the only song he knows.",
        "It's the street music festival. An amateur band needs someone to replace their drummer, who had too much {w:drink}. They're looking at you.",
        "Street music festival. Speakers on every corner, the smell of sausages and {w:song} coming out of four bars at once, out of sync.",
      ],
    },
    choices: [
      {
        label: { fr: 'Monter sur scène', en: 'Get on stage' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["J'ai pris le micro et chanté {w:song} avec une conviction terrifiante. La rue entière a repris le refrain. Pendant trois minutes, j'étais une star.", "J'ai joué de la batterie sans jamais en avoir fait. J'ai tapé fort et au hasard. Les gens ont dansé. Le punk, c'est accessible à tous."], en: ["I grabbed the mic and sang {w:song} with terrifying conviction. The whole street sang the chorus. For three minutes, I was a star.", "I played drums without ever having played. I hit hard and at random. People danced. Punk is for everyone."] }, fx: { happy: 10, fame: 1 }, mood: 'party' },
          { w: 1, text: { fr: ["J'ai chanté. Mal. Très mal. Un enfant a pleuré et un chien s'est mis à hurler avec moi. On a fini en duo. Le chien a eu plus d'applaudissements.", "J'ai trébuché sur un câble et fait tomber l'ampli sur le pied du guitariste. Il a hurlé une note parfaite. C'était le meilleur moment du concert."], en: ["I sang. Badly. Very badly. A child cried and a dog started howling with me. We ended up as a duet. The dog got more applause.", "I tripped on a cable and dropped the amp on the guitarist's foot. He screamed a perfect note. It was the best moment of the show."] }, fx: { happy: -3, stress: 4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Errer de bar en bar', en: 'Bar-hop' },
        text: { fr: ["J'ai fait douze bars et six concerts. J'ai dansé la salsa, pogoté sur du punk et pleuré sur de l'accordéon. Je suis rentré{|e} à 5 h, sans voix, sans chaussures.", "J'ai suivi la musique toute la nuit. J'ai fini dans une cour d'immeuble avec un orchestre de mariachis et {w:drink} dans un gobelet géant. Personne ne savait d'où ils venaient."], en: ["I hit twelve bars and six concerts. Danced salsa, moshed to punk and cried to accordion music. Got home at 5 a.m., no voice, no shoes.", "I followed the music all night. Ended up in a courtyard with a mariachi band and {w:drink} in a giant cup. Nobody knew where they came from."] },
        fx: { happy: 8, health: -3 },
        mood: 'party',
      },
    ],
  },
  // ───────────────────────────── other people's weddings ─────────────────────────────
  {
    id: 'ho_wed_cousin_speech',
    icon: '🎙️',
    cat: 'party',
    rating: 2,
    cooldown: 4,
    when: { age: [20, 75] },
    actor: { create: { role: 'acquaintance', age: [-6, 6], gender: 'any' } },
    scene: { place: 'castle', mood: 'shock', prop: 'microphone' },
    text: {
      fr: [
        "Mariage de {a:ton cousin|ta cousine} {a.first}. Le témoin a la gastro. On te tend le micro : « Tu peux dire un petit mot ? » Tu as bu [[quatre|six|sept]] coupes et tu n'as rien préparé.",
        "Au mariage de {a.first}, le DJ annonce « un discours surprise de la famille ». C'est toi, la surprise. Personne ne t'a prévenu{|e}. Il y a deux cents personnes.",
        "Mariage de {a:ton cousin|ta cousine}. Tu dois faire un discours. Tu connais {a.first} surtout pour l'histoire du camping de 2008. Il y avait {w:animal}, une tente et beaucoup trop de rosé.",
        "On t'a demandé un discours pour le mariage de {a.first}. Tu as écrit des notes sur une serviette. Elle est tombée dans {w:drink}. Il reste un mot lisible : « honte ».",
      ],
      en: [
        "Your cousin {a.first}'s wedding. The best man has food poisoning. They hand you the mic: 'Could you say a few words?' You've had [[four|six|seven]] glasses and prepared nothing.",
        "At {a.first}'s wedding, the DJ announces 'a surprise speech from the family'. You're the surprise. Nobody warned you. There are two hundred people.",
        "Your cousin's wedding. You have to give a speech. You mostly know {a.first} for the 2008 camping incident. There was {w:animal}, a tent and way too much rosé.",
        "You were asked to give a speech at {a.first}'s wedding. You wrote notes on a napkin. It fell into {w:drink}. One word is still legible: 'shame'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Improviser avec émotion', en: 'Wing it with feeling' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai improvisé un discours bouleversant sur l'amour, la famille et la résilience. La mariée a pleuré, le marié a pleuré, le traiteur a pleuré. Je ne me souviens pas d'un seul mot.", "J'ai parlé de notre enfance, de nos bêtises, de nos rêves. Toute la salle était en larmes. On m'a demandé de faire le prochain baptême."], en: ["I improvised a devastating speech about love, family and resilience. The bride cried, the groom cried, the caterer cried. I don't remember a single word.", "I talked about our childhood, our pranks, our dreams. The whole room was in tears. They asked me to do the next christening."] }, fx: { happy: 8, karma: 2, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai commencé par « L'amour, c'est comme {w:food} ». Je n'ai jamais trouvé la fin de la métaphore. J'ai parlé huit minutes. Le DJ a fini par couper le micro.", "J'ai fondu en larmes dès la première phrase. Pas de joie : j'ai réalisé que j'étais toujours célibataire. On m'a raccompagné{|e} à ma table avec une tape dans le dos."], en: ["I opened with 'Love is like {w:food}'. I never found the end of the metaphor. I spoke for eight minutes. The DJ finally cut the mic.", "I burst into tears at the first sentence. Not from joy: I realized I'm still single. They walked me back to my table with a pat on the back."] }, fx: { happy: -5, stress: 6 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Raconter le camping de 2008', en: 'Tell the 2008 camping story' },
        out: [
          { w: 1, text: { fr: ["J'ai tout raconté : la tente, l'ex, le seau, la diarrhée nocturne et le garde forestier. Les vieux ont hurlé de rire. La belle-famille a quitté la salle. Le mariage a tenu. Pour l'instant.", "J'ai raconté comment {a.first} avait vomi dans le duvet d'un inconnu avant de s'endormir dessus. La salle a explosé de rire. {a.first} m'a lancé une chaussure, puis m'a pris{|e} dans ses bras."], en: ["I told everything: the tent, the ex, the bucket, the midnight diarrhea and the park ranger. The old folks howled. The in-laws left. The marriage survived. For now.", "I told how {a.first} puked in a stranger's sleeping bag before falling asleep on it. The room exploded. {a.first} threw a shoe at me, then hugged me."] }, fx: { happy: 8, fame: 1, karma: -2 }, mood: 'party' },
          { w: 1, text: { fr: ["En plein récit, j'ai lâché par erreur le nom de l'amant{a:e|} que {a.first} avait eu{a:e|} « juste avant » le mariage. Silence de mort. Le marié s'est levé. J'ai rendu le micro et je suis parti{|e} par les cuisines.", "J'ai mimé la scène du seau. Avec un vrai seau. Le vrai seau contenait du punch. Il a fini sur la robe de la mariée. Elle ressemble à une scène de crime. Les photos sont superbes."], en: ["Mid-story, I accidentally dropped the name of the lover {a.first} had 'just before' the wedding. Dead silence. The groom stood up. I handed back the mic and left through the kitchen.", "I acted out the bucket scene. With a real bucket. The real bucket was full of punch. It ended up on the bride's dress. She looks like a crime scene. The photos are stunning."] }, fx: { happy: -6, stress: 10, karma: -4, visual: 'gore' }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'ho_wed_buffet',
    icon: '🍤',
    cat: 'party',
    rating: 1,
    cooldown: 3,
    when: { age: [16, 90] },
    scene: { place: 'castle', mood: 'happy' },
    text: {
      fr: [
        "Vin d'honneur d'un mariage. Le buffet vient d'ouvrir : toasts, verrines, {w:food} et une fontaine de chocolat. Une horde de tantes en chapeau fonce dessus.",
        "Au mariage, il ne reste qu'un seul mini-burger sur le plateau. Toi et une vieille dame en tailleur rose l'avez vu en même temps. Elle a des coudes pointus.",
        "Mariage. Le cocktail dure depuis [[trois|quatre|cinq]] heures, il n'y a plus de petits fours et le repas ne sera servi qu'à 23 h. Tu commences à regarder les centres de table.",
        "La fontaine de chocolat du mariage coule à flots. Un enfant y trempe ses doigts, un oncle y trempe {w:food}, et un inconnu y trempe ses lunettes.",
      ],
      en: [
        "Wedding cocktail hour. The buffet just opened: canapés, mini-desserts, {w:food} and a chocolate fountain. A horde of aunts in hats charges forward.",
        "At the wedding, there's one mini-burger left on the tray. You and an old lady in a pink suit saw it at the same time. She has sharp elbows.",
        "Wedding. The cocktail hour has lasted [[three|four|five]] hours, the appetizers are gone and dinner won't be served until 11 p.m. You're eyeing the centerpieces.",
        "The wedding chocolate fountain is flowing. A kid dips his fingers in, an uncle dips {w:food}, and a stranger dips his glasses.",
      ],
    },
    choices: [
      {
        label: { fr: 'Se battre pour la bouffe', en: 'Fight for the food' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai feinté à gauche, plongé à droite et attrapé le dernier mini-burger. La dame en rose m'a maudit{|e} sur sept générations. Il était délicieux.", "J'ai rempli mon assiette comme un tétris. Douze étages de petits fours. Pas une miette n'est tombée. Le traiteur m'a applaudi{|e}."], en: ["I faked left, dove right and grabbed the last mini-burger. The lady in pink cursed me for seven generations. It was delicious.", "I stacked my plate like Tetris. Twelve layers of canapés. Not one crumb fell. The caterer applauded."] }, fx: { happy: 6, weight: 0.02 }, mood: 'proud' },
          { w: 1, text: { fr: ["La dame en rose m'a mis un coup de coude dans les côtes. J'ai trébuché dans la fontaine de chocolat. J'ai fini la soirée couvert{|e} de chocolat. Les enfants me léchaient.", "J'ai bousculé le plateau. Les verrines ont volé. Une a atterri dans le décolleté de la belle-mère. Elle l'a mangée. On n'en parle pas."], en: ["The lady in pink elbowed me in the ribs. I tripped into the chocolate fountain. I spent the night covered in chocolate. Kids kept licking me.", "I bumped the tray. The mini-desserts flew. One landed in the mother-in-law's cleavage. She ate it. We don't talk about it."] }, fx: { happy: -2, looks: -2 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Remplir son sac', en: 'Fill your bag' },
        text: { fr: ["J'ai rempli mon sac à main de petits fours. Et mes poches. Et le chapeau de mon oncle. J'ai mangé pendant une semaine. Le mariage le plus rentable de ma vie.", "J'ai planqué {w:food} et une bouteille dans mon sac. Un serveur m'a vu{|e}. Il m'a fait un clin d'œil et m'a donné un sac plus grand."], en: ["I filled my handbag with canapés. And my pockets. And my uncle's hat. I ate for a week. Most profitable wedding of my life.", "I stashed {w:food} and a bottle in my bag. A waiter saw me. He winked and handed me a bigger bag."] },
        fx: { happy: 5, karma: -1 },
        mood: 'happy',
      },
      {
        label: { fr: 'Draguer le serveur', en: 'Flirt with the waiter' },
        text: { fr: ["J'ai dragué le serveur. Il m'a apporté des plateaux en avant-première toute la soirée. À 2 h, on fumait ensemble derrière les cuisines. Il s'appelle Kévin. Il a des mains d'artiste.", "J'ai fait les yeux doux au serveur. Il m'a donné le numéro de sa sœur. Elle était serveuse aussi. On a dansé toute la nuit."], en: ["I flirted with the waiter. He brought me trays first all night. At 2 a.m., we were smoking together behind the kitchen. His name is Kevin. He has an artist's hands.", "I made eyes at the waiter. He gave me his sister's number. She was also a waitress. We danced all night."] },
        fx: { happy: 7, looks: 1 },
        mood: 'love',
      },
    ],
  },
  {
    id: 'ho_wed_dancefloor',
    icon: '🕺',
    cat: 'party',
    rating: 2,
    cooldown: 3,
    when: { age: [18, 85] },
    scene: { place: 'castle', mood: 'party' },
    text: {
      fr: [
        "Mariage, 1 h du matin. Le DJ lance {w:song}. Toute la salle se lève. Ton oncle enlève sa chemise et la fait tourner au-dessus de sa tête comme un hélicoptère.",
        "La piste de danse du mariage est en feu. La chenille passe devant toi pour la [[troisième|quatrième|sixième]] fois. Elle mesure trente mètres et ton grand-père est en tête.",
        "Au mariage, le DJ annonce « la danse des canards ». La mariée est debout sur une chaise, pieds nus, avec {w:drink} dans chaque main.",
        "Piste de danse. Une invitée très éméchée te fait signe de la rejoindre. Elle danse comme si elle combattait {w:animal}. Elle est la mère du marié.",
      ],
      en: [
        "Wedding, 1 a.m. The DJ drops {w:song}. The whole room stands up. Your uncle takes off his shirt and spins it over his head like a helicopter.",
        "The wedding dance floor is on fire. The conga line passes you for the [[third|fourth|sixth]] time. It's a hundred feet long and your grandpa is leading it.",
        "At the wedding, the DJ announces 'the Chicken Dance'. The bride is standing on a chair, barefoot, with {w:drink} in each hand.",
        "Dance floor. A very tipsy guest waves you over. She dances like she's fighting {w:animal}. She's the groom's mother.",
      ],
    },
    choices: [
      {
        label: { fr: 'Tout donner', en: 'Give it everything' },
        out: [
          { w: 2, text: { fr: ["J'ai dansé comme si personne ne regardait. Tout le monde regardait. J'ai fait le grand écart, le moonwalk et un salto raté. J'ai été élu{|e} {roi|reine} de la soirée, à l'unanimité.", "Quatre heures de danse non-stop. J'ai fini en sueur, la cravate sur le front, à chanter {w:song} en duo avec la grand-mère de la mariée. Elle m'a embrassé{|e} sur la bouche. Légende."], en: ["I danced like nobody was watching. Everybody was watching. I did the splits, the moonwalk and a failed backflip. Unanimously crowned the night's royalty.", "Four hours of nonstop dancing. I ended up drenched, tie on my forehead, singing {w:song} with the bride's grandmother. She kissed me on the mouth. Legend."] }, fx: { happy: 12, athletic: 1, health: -2 }, mood: 'party' },
          { w: 1, text: { fr: ["Pendant le rock, j'ai lâché ma partenaire. Elle a traversé la piste, percuté la pièce montée, et les choux ont volé comme des balles. Un œil au beurre noir, deux blessés à la crème pâtissière.", "J'ai voulu faire glisser sur les genoux. Le parquet était ciré. J'ai glissé jusqu'à la table des mariés et je me suis encastré{|e} dans la nappe. Mon pantalon a craqué de la ceinture aux chevilles."], en: ["During the swing dance, I let go of my partner. She flew across the floor into the wedding cake, and the cream puffs flew like bullets. One black eye, two custard casualties.", "I tried a knee slide. The floor was waxed. I slid all the way to the head table and embedded myself in the tablecloth. My pants split from waist to ankles."] }, fx: { happy: 3, health: -5, looks: -1 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Rester assis{|e} à juger', en: 'Sit and judge' },
        text: { fr: ["Je suis resté{|e} à ma table avec le cousin crypto. On a noté chaque danseur sur dix. Mon oncle a eu 2. La grand-mère a eu 10. On a été très sévères et très saouls.", "J'ai observé la piste avec un verre. J'ai vu trois couples se former, deux se briser et un enfant manger un cendrier. Le meilleur spectacle de l'année."], en: ["I stayed at my table with the crypto cousin. We rated every dancer out of ten. My uncle got a 2. Grandma got a 10. We were very harsh and very drunk.", "I watched the dance floor with a drink. Saw three couples form, two break up and a child eat an ashtray. Best show of the year."] },
        fx: { happy: 4, health: -2 },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 'ho_wed_bouquet',
    icon: '💐',
    cat: 'party',
    rating: 0,
    cooldown: 4,
    when: { age: [18, 45], noHas: 'spouse', noFlag: 'ho_bouquet' },
    scene: { place: 'castle', mood: 'happy', prop: 'flowers' },
    text: {
      fr: [
        "Lancer du bouquet au mariage. Toutes les célibataires sont alignées. Une cousine fait des étirements. Une autre a enlevé ses talons. Le bouquet décolle.",
        "Au mariage, la mariée va lancer le bouquet. On t'a poussé{|e} au premier rang « pour rire ». Les autres prennent ça très, très au sérieux.",
        "Lancer du bouquet. La mariée se retourne, compte jusqu'à trois et lance de toutes ses forces. Le bouquet file droit sur toi {w:weather}.",
        "Le moment du bouquet est arrivé. La tante qui attend un mari depuis [[1987|1993|2001]] te bouscule. Le bouquet vole au-dessus de vous.",
      ],
      en: [
        "Bouquet toss at the wedding. All the singles are lined up. One cousin is stretching. Another took off her heels. The bouquet launches.",
        "At the wedding, the bride is about to throw the bouquet. Someone shoved you into the front row 'as a joke'. The others are taking this very, very seriously.",
        "Bouquet toss. The bride turns around, counts to three and throws with all her might. The bouquet heads straight for you {w:weather}.",
        "Bouquet time. The aunt who's been waiting for a husband since [[1987|1993|2001]] shoves you. The bouquet flies over both your heads.",
      ],
    },
    choices: [
      {
        label: { fr: 'Plonger pour l\'attraper', en: 'Dive for it' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai plongé comme un gardien de but et attrapé le bouquet en pleine extension. Tout le monde a crié. La tante a pleuré. D'après la tradition, je suis {le prochain|la prochaine}.", "J'ai bondi plus haut que tout le monde. J'ai le bouquet, un genou écorché et le regard noir de cinq cousines. Je le garde."], en: ["I dove like a goalkeeper and caught the bouquet at full stretch. Everyone screamed. The aunt cried. According to tradition, I'm next.", "I jumped higher than everyone. I've got the bouquet, a scraped knee and death glares from five cousins. I'm keeping it."] }, fx: { happy: 8, flag: 'ho_bouquet', schedule: { key: 'ho_bouquet_curse', years: 2 } }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai plongé. La tante aussi. On s'est {percutés|percutées} en plein vol. Le bouquet a atterri dans les bras d'un serveur, marié depuis vingt ans. Il a haussé les épaules.", "J'ai plongé dans le vide. Le bouquet est tombé dans la piscine. Je l'ai suivi. J'ai tout de même ressorti le bouquet, trempé, triomphant{|e}, et sans mes faux cils."], en: ["I dove. So did the aunt. We collided mid-air. The bouquet landed in the arms of a waiter, married for twenty years. He shrugged.", "I dove into thin air. The bouquet fell in the pool. I followed it. I came up with the bouquet anyway, soaked, triumphant, minus my fake eyelashes."] }, fx: { happy: 3, health: -2, flag: 'ho_bouquet', schedule: { key: 'ho_bouquet_curse', years: 2 } }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'S\'écarter', en: 'Step aside' },
        text: { fr: ["Je me suis écarté{|e}. Le bouquet a atterri sur la tante, qui l'a serré contre elle comme un nouveau-né. C'était beau. Je n'ai aucun regret.", "J'ai esquivé comme un matador. Le bouquet a fini dans le buffet, sur {w:food}. Personne n'a voulu le récupérer. Ni le bouquet, ni le plat."], en: ["I stepped aside. The bouquet landed on the aunt, who clutched it like a newborn. It was beautiful. No regrets.", "I dodged like a matador. The bouquet landed in the buffet, on {w:food}. Nobody wanted to retrieve it. Neither the bouquet nor the dish."] },
        fx: { happy: 3, karma: 2 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_bouquet_curse',
    icon: '🥀',
    cat: 'party',
    rating: 1,
    chainOnly: true,
    when: { flag: 'ho_bouquet' },
    scene: { place: 'apartment', mood: 'neutral', prop: 'flowers' },
    text: {
      fr: [
        "Deux ans après avoir attrapé le bouquet, il est toujours là, séché, sur ton étagère. La tradition disait « dans l'année ». La tradition a menti.",
        "Le bouquet de mariage que tu avais attrapé est maintenant un tas de pétales gris. Ta mère te demande si tu as « quelqu'un ». Elle regarde le bouquet en le disant.",
        "Il y a deux ans, tu as attrapé le bouquet. Depuis, tu as eu [[trois|cinq|sept]] rendez-vous ratés, un ex qui est revenu et {w:animal} qui a fait son nid dans les fleurs séchées.",
        "Le bouquet séché sur ton étagère te nargue. La mariée de l'époque vient de divorcer. Elle t'appelle pour récupérer « ce qui reste de son mariage ».",
      ],
      en: [
        "Two years after catching the bouquet, it's still there, dried, on your shelf. Tradition said 'within the year'. Tradition lied.",
        "The wedding bouquet you caught is now a pile of gray petals. Your mom asks if you're 'seeing anyone'. She's looking at the bouquet as she says it.",
        "Two years ago, you caught the bouquet. Since then: [[three|five|seven]] failed dates, an ex who came back and {w:animal} that nested in the dried flowers.",
        "The dried bouquet on your shelf taunts you. The bride from back then just got divorced. She's calling to collect 'what's left of her marriage'.",
      ],
    },
    choices: [
      {
        label: { fr: 'Brûler le bouquet', en: 'Burn the bouquet' },
        out: [
          { w: 1, text: { fr: ["J'ai brûlé le bouquet dans l'évier en prononçant une incantation inventée. Le détecteur de fumée a sonné. Le voisin est venu voir. Il est mignon. Il est célibataire. Merci, le bouquet.", "Le bouquet a brûlé en dix secondes. J'ai ressenti une libération immense. Le soir même, j'ai eu un match. Coïncidence ? Je ne crois plus aux coïncidences."], en: ["I burned the bouquet in the sink chanting a made-up spell. The smoke alarm went off. The neighbor came to check. He's cute. He's single. Thanks, bouquet.", "The bouquet burned in ten seconds. I felt immense relief. That same night, I got a match. Coincidence? I no longer believe in coincidences."] }, fx: { happy: 8, stress: -6, unflag: 'ho_bouquet' }, mood: 'happy' },
          { w: 1, text: { fr: ["Le bouquet a pris feu, puis les rideaux. J'ai éteint le tout avec la carafe. Mon appart sent le mariage brûlé. C'est une odeur très particulière. Elle sent l'échec.", "J'ai brûlé le bouquet. Rien n'a changé. Je suis toujours seul{|e}, mais maintenant avec un évier noirci."], en: ["The bouquet caught fire, then the curtains. I put it all out with the water jug. My apartment smells like burnt wedding. It's a very particular smell. It smells like failure.", "I burned the bouquet. Nothing changed. I'm still alone, but now with a blackened sink."] }, fx: { happy: -3, unflag: 'ho_bouquet' }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Le garder, par principe', en: 'Keep it, on principle' },
        text: { fr: ["Je l'ai gardé. Le jour où je me marierai, je le lancerai à mon tour, en poussière, sur la tête de quelqu'un. La malédiction continue.", "Je garde le bouquet. Ce n'est plus de la superstition, c'est de la décoration. Et un peu de rancune."], en: ["I kept it. The day I get married, I'll throw it in turn, as dust, onto someone's head. The curse continues.", "I'm keeping the bouquet. It's not superstition anymore, it's decor. And a little spite."] },
        fx: { happy: 1, unflag: 'ho_bouquet' },
        mood: 'neutral',
      },
    ],
  },
  {
    id: 'ho_wed_kids_table',
    icon: '🧒',
    cat: 'party',
    rating: 0,
    cooldown: 3,
    when: { age: [5, 12] },
    scene: { place: 'castle', mood: 'happy' },
    text: {
      fr: [
        "Au mariage de ta tante, on t'a mis{|e} à la table des enfants. Il y a [[huit|dix|douze]] gamins, zéro adulte et un seau de bonbons. Ça va mal finir.",
        "Mariage. Les adultes boivent et dansent depuis des heures. À la table des enfants, quelqu'un propose de faire une course sous les nappes.",
        "Au mariage, tu es d'honneur. Tu dois porter les alliances jusqu'à l'autel sur un petit coussin. Tu as le hoquet et tes chaussures neuves te font mal.",
        "Mariage de ton oncle. Il est minuit, tu es censé{|e} dormir sur deux chaises. Mais il y a {w:food} au buffet et personne ne surveille.",
      ],
      en: [
        "At your aunt's wedding, they put you at the kids' table. [[Eight|Ten|Twelve]] kids, zero adults and a bucket of candy. This will end badly.",
        "Wedding. The adults have been drinking and dancing for hours. At the kids' table, someone suggests racing under the tablecloths.",
        "At the wedding, you're the ring bearer. You have to carry the rings to the altar on a little cushion. You have hiccups and your new shoes hurt.",
        "Your uncle's wedding. It's midnight and you're supposed to be asleep on two chairs. But there's {w:food} on the buffet and nobody's watching.",
      ],
    },
    choices: [
      {
        label: { fr: 'Mener la révolte', en: 'Lead the revolt' },
        out: [
          { w: 2, text: { fr: ["J'ai organisé une course sous les tables. On a attaché les lacets de six adultes ensemble. Quand ils se sont levés pour le slow, ils sont tous tombés. Meilleure soirée de ma vie.", "On a vidé le seau de bonbons et dansé sur la table des enfants. Un serveur nous a filmés. La mariée a dit que c'était le meilleur moment de son mariage."], en: ["I organized a race under the tables. We tied six adults' shoelaces together. When they stood up for the slow dance, they all fell. Best night of my life.", "We emptied the candy bucket and danced on the kids' table. A waiter filmed us. The bride said it was the best moment of her wedding."] }, fx: { happy: 9, karma: -1 }, mood: 'party' },
          { w: 1, text: { fr: ["Sous les tables, j'ai trouvé un pied nu qui sentait {w:smell}. J'ai crié. Le pied a crié aussi. C'était le prêtre.", "J'ai mangé tellement de bonbons que j'ai vomi sur la robe de la mariée pendant la photo de groupe. Sur la photo, tout le monde sourit sauf elle."], en: ["Under the tables, I found a bare foot that smelled like {w:smell}. I screamed. The foot screamed too. It was the priest.", "I ate so much candy I threw up on the bride's dress during the group photo. In the picture, everyone's smiling except her."] }, fx: { happy: -3, health: -2 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Faire son devoir', en: 'Do your duty' },
        text: { fr: ["J'ai porté les alliances avec un sérieux de garde royal. Tout le monde a fait « ooooh ». J'ai eu le droit à deux parts de pièce montée et à une photo dans le journal local.", "J'ai été sage toute la soirée. J'ai dansé avec la mariée. Elle m'a donné son nœud papillon. Je le porte encore pour les grandes occasions."], en: ["I carried the rings with the gravity of a royal guard. Everyone went 'awww'. I got two slices of wedding cake and a photo in the local paper.", "I behaved all night. I danced with the bride. She gave me her bow tie. I still wear it for special occasions."] },
        fx: { happy: 5, karma: 3, looks: 1 },
        mood: 'proud',
      },
    ],
  },
  {
    id: 'ho_wed_singles_table',
    icon: '🪑',
    cat: 'party',
    rating: 2,
    cooldown: 4,
    when: { age: [22, 60], noHas: 'lover' },
    actor: { create: { role: 'acquaintance', age: [-8, 8], gender: 'attracted' } },
    scene: { place: 'castle', mood: 'love' },
    text: {
      fr: [
        "Au mariage, on t'a placé{|e} à la « table des célibataires ». À ta droite, {a.first}, qui parle de son ex depuis l'entrée. À ta gauche, un homme qui collectionne {w:object}.",
        "Table des célibataires du mariage. {a.first}, assis{a:|e} à côté de toi, te fait du pied depuis le fromage et vient de te glisser un mot : « Chambre 12 ».",
        "Mariage, table 14 : les célibataires. Il y a un plan de table, et quelqu'un a clairement voulu que tu finisses avec {a.first}. Il y a des petits cœurs sur vos deux cartons.",
        "Tu es à la table des célibataires. {a.first} t'explique {w:conspiracy}. C'est la quatrième théorie de la soirée. {a:Il|Elle} est vraiment {a:très beau|très belle}, par contre.",
      ],
      en: [
        "At the wedding, they seated you at the 'singles table'. On your right, {a.first}, who's been talking about their ex since the ceremony. On your left, a man who collects {w:object}.",
        "Wedding singles table. {a.first}, sitting next to you, has been playing footsie since the cheese course and just slipped you a note: 'Room 12'.",
        "Wedding, table 14: the singles. There's a seating plan, and someone clearly wanted you to end up with {a.first}. There are little hearts on both your place cards.",
        "You're at the singles table. {a.first} is explaining {w:conspiracy}. It's the fourth theory of the night. {a:He|She} is very hot, though.",
      ],
    },
    choices: [
      {
        label: { fr: 'Aller à la chambre 12', en: 'Go to room 12' },
        out: [
          { w: 2, odds: { looks: 1 }, text: { fr: ["La chambre 12 était celle de la mère de la mariée. On ne l'a su qu'après. Elle est rentrée à 3 h. Elle a dit « {w:exclaim} » et elle a refermé la porte. On a fini quand même.", "Nuit torride dans la chambre 12. Le lendemain, au brunch, on s'est assis loin l'un de l'autre et on a fait semblant de ne pas se connaître. Toute la famille savait. La tête de lit avait tapé contre le mur de la mariée."], en: ["Room 12 belonged to the bride's mother. We only found out afterward. She came in at 3 a.m. She said '{w:exclaim}' and closed the door. We finished anyway.", "Steamy night in room 12. At brunch the next day, we sat far apart and pretended not to know each other. The whole family knew. The headboard had been banging against the bride's wall."] }, fx: { happy: 11, rel: 15, keep: true, actorRole: 'friend' }, mood: 'love', icon: '🔥' },
          { w: 1, text: { fr: ["Dans la chambre 12, {a.first} m'a avoué qu'{a.he} voulait juste « parler de son ex ». On a parlé de son ex pendant trois heures. J'ai dormi dans la baignoire.", "En chemin vers la chambre, j'ai vomi le vin du repas dans un pot de fleurs du couloir. {a.first} m'a tenu les cheveux. C'est presque romantique."], en: ["In room 12, {a.first} confessed {a.he} just wanted to 'talk about the ex'. We talked about the ex for three hours. I slept in the bathtub.", "On the way to the room, I puked the dinner wine into a hallway planter. {a.first} held my hair. It's almost romantic."] }, fx: { happy: -3, rel: 5 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Changer de table', en: 'Switch tables' },
        text: { fr: ["J'ai changé ma carte avec celle d'un oncle. J'ai fini à la table des vieux, qui étaient beaucoup plus drôles et beaucoup plus saouls. Un monsieur de 85 ans m'a appris trois blagues cochonnes.", "J'ai migré vers la table des enfants. Les enfants, au moins, ne parlent pas de leur ex. Ils m'ont fait manger un bonbon trouvé par terre."], en: ["I swapped my place card with an uncle's. Ended up at the old folks' table, which was much funnier and much drunker. An 85-year-old taught me three dirty jokes.", "I migrated to the kids' table. At least kids don't talk about their exes. They made me eat a candy found on the floor."] },
        fx: { happy: 4 },
        mood: 'happy',
      },
    ],
  },
  // ───────────────────────────── baptisms & funerals ─────────────────────────────
  {
    id: 'ho_baptism',
    icon: '👶',
    cat: 'family',
    rating: 1,
    cooldown: 5,
    when: { age: [18, 65], has: 'anyFriend' },
    actor: 'anyFriend',
    scene: { place: 'castle', mood: 'neutral' },
    text: {
      fr: [
        "{a.first} t'a choisi{|e} comme {parrain|marraine} de son bébé. Le baptême est dimanche. Tu ne sais pas faire le signe de croix. Tu as une gueule de bois.",
        "Baptême du bébé de {a.first}. Tu es témoin. Le curé te demande si tu « renonces à Satan ». Tu hésites une seconde de trop.",
        "Baptême. Le bébé de {a.first} hurle depuis vingt minutes. Le curé s'approche avec l'eau bénite. Tu tiens le bébé. Le bébé a une couche pleine, tu le sens.",
        "Tu es au baptême du bébé de {a.first}. La réception est dans la salle des fêtes. Il y a {w:food}, des dragées et un oncle qui commence déjà à chanter.",
      ],
      en: [
        "{a.first} chose you as godparent to their baby. The christening is on Sunday. You don't know how to make the sign of the cross. You're hungover.",
        "Christening of {a.first}'s baby. You're a witness. The priest asks if you 'renounce Satan'. You hesitate one second too long.",
        "Christening. {a.first}'s baby has been screaming for twenty minutes. The priest approaches with holy water. You're holding the baby. The baby has a full diaper, you can tell.",
        "You're at {a.first}'s baby's christening. The reception is in the village hall. There's {w:food}, sugared almonds and an uncle who's already started singing.",
      ],
    },
    choices: [
      {
        label: { fr: 'Assurer la cérémonie', en: 'Nail the ceremony' },
        out: [
          { w: 2, text: { fr: ["Tout s'est bien passé. Le bébé a fait pipi sur l'aube du curé au moment exact où il le bénissait. Le curé a dit « c'est un signe ». Personne ne sait de quoi.", "J'ai récité les prières en lisant sur mon téléphone. Le bébé m'a souri. J'ai fondu. Je suis {le meilleur parrain|la meilleure marraine} du monde."], en: ["It all went well. The baby peed on the priest's robe exactly as he blessed it. The priest said 'It's a sign.' Nobody knows of what.", "I recited the prayers off my phone. The baby smiled at me. I melted. Best godparent, best person."] }, fx: { happy: 7, rel: 12, karma: 3 }, mood: 'love' },
          { w: 1, text: { fr: ["En renonçant à Satan, j'ai éternué. Le bébé a sursauté et m'a vomi dans le col. Le curé a fait un signe de croix pour moi, en plus.", "J'ai fait tomber le cierge. Il a enflammé le voile de la grand-mère. On l'a éteinte avec l'eau bénite. Elle dit que c'était un miracle. Moi, un accident."], en: ["While renouncing Satan, I sneezed. The baby jumped and puked down my collar. The priest made an extra sign of the cross for me.", "I dropped the candle. It set Grandma's veil on fire. We put her out with holy water. She calls it a miracle. I call it an accident."] }, fx: { happy: -3, rel: 4, stress: 5 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Foncer à la réception', en: 'Head to the reception' },
        text: { fr: ["J'ai fui la messe pour la réception. J'ai mangé toutes les dragées et chanté avec l'oncle. Le bébé dormait. C'était le seul à être sobre.", "J'ai aidé à installer la salle. Puis à vider le punch. À 18 h, je dansais le madison avec le curé. Il danse très bien. Trop bien."], en: ["I skipped the service for the reception. Ate all the sugared almonds and sang with the uncle. The baby slept. The only sober one there.", "I helped set up the hall. Then helped empty the punch. By 6 p.m., I was line dancing with the priest. He dances very well. Too well."] },
        fx: { happy: 6, rel: -3, health: -2 },
        mood: 'party',
      },
    ],
  },
  {
    id: 'ho_funeral_eulogy',
    icon: '⚰️',
    cat: 'family',
    rating: 2,
    cooldown: 4,
    when: { age: [18, 90] },
    scene: { place: 'cemetery', mood: 'sad', prop: 'coffin' },
    text: {
      fr: [
        "Enterrement d'un grand-oncle que tu n'as vu que deux fois. Ta mère te pousse vers le pupitre : « Dis quelques mots, il t'aimait beaucoup. » Tu ne te souviens pas de son prénom.",
        "Obsèques d'un ami de la famille, surnommé {w:nickname}. On te demande un éloge funèbre. Tu sais seulement qu'il était passionné par {w:hobby} et qu'il sentait {w:smell}.",
        "Enterrement. Pendant l'éloge du curé, une femme inconnue en voilette noire éclate en sanglots et crie « Il m'avait promis ! ». La veuve se retourne lentement.",
        "Funérailles d'un oncle. Le cercueil est ouvert. Le thanatopracteur l'a maquillé comme {w:celeb}. Tu dois passer devant pour dire au revoir, et tu sens le fou rire monter.",
      ],
      en: [
        "Funeral of a great-uncle you met twice. Your mom pushes you toward the lectern: 'Say a few words, he loved you so much.' You don't remember his first name.",
        "Funeral of a family friend nicknamed {w:nickname}. They ask you for a eulogy. All you know is he was obsessed with {w:hobby} and gave off {w:smell}.",
        "Funeral. During the priest's eulogy, a strange woman in a black veil bursts into tears and cries 'He promised me!'. The widow turns around slowly.",
        "Uncle's funeral. Open casket. The embalmer made him up like {w:celeb}. You have to walk past to say goodbye, and you feel the giggles rising.",
      ],
    },
    choices: [
      {
        label: { fr: 'Improviser un éloge', en: 'Improvise a eulogy' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai parlé d'un homme « généreux, discret, aimant ». J'ai inventé un souvenir de pêche. Toute l'assemblée a pleuré. Il détestait la pêche, apparemment. Ils ont pleuré quand même.", "J'ai fait un éloge magnifique en appelant le défunt « tonton ». Personne ne s'est rendu compte que je ne connaissais pas son prénom. On m'a réservé pour les prochains."], en: ["I spoke of a man 'generous, discreet, loving'. I invented a fishing memory. Everyone cried. Apparently he hated fishing. They cried anyway.", "I delivered a gorgeous eulogy calling the deceased 'Uncle'. Nobody noticed I didn't know his name. I've been booked for the next ones."] }, fx: { happy: 3, karma: 1, smarts: 1 }, mood: 'proud' },
          { w: 1, text: { fr: ["Je l'ai appelé par le mauvais prénom. Quatre fois. La veuve m'a corrigé{|e} à voix haute. Au cinquième, j'ai dit « peu importe, il est mort ». Le silence a duré jusqu'au cimetière.", "Le fou rire m'a pris au milieu de l'éloge. J'ai essayé de le transformer en sanglots. J'ai fait un bruit d'otarie. Toute l'église s'est mise à rire. Le défunt aurait adoré, paraît-il."], en: ["I called him by the wrong name. Four times. The widow corrected me out loud. The fifth time, I said 'whatever, he's dead.' The silence lasted all the way to the cemetery.", "I got the giggles mid-eulogy. I tried to turn them into sobs. I made a sea lion noise. The whole church started laughing. The deceased would have loved it, apparently."] }, fx: { happy: -4, karma: -3, stress: 6 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Arbitrer la veuve et la maîtresse', en: 'Referee widow vs. mistress' },
        out: [
          { w: 1, text: { fr: ["La veuve a sauté sur la maîtresse. Elles ont roulé jusqu'au trou. Le cercueil a basculé. Le défunt est sorti à moitié, la tête dans la terre, les fesses au ciel. C'était sa position préférée, a dit la maîtresse.", "Bagarre au bord de la tombe. La maîtresse a planté un talon aiguille dans la cuisse de la veuve, le sang a giclé sur les chrysanthèmes. Les croque-morts ont pris des paris."], en: ["The widow jumped the mistress. They rolled into the grave. The coffin tipped. The deceased slid halfway out, head in the dirt, butt to the sky. 'His favorite position,' said the mistress.", "Graveside brawl. The mistress drove a stiletto into the widow's thigh, and blood squirted onto the chrysanthemums. The gravediggers took bets."] }, fx: { happy: 5, stress: 8, visual: 'gore' }, mood: 'shock', icon: '🩸' },
          { w: 1, text: { fr: ["Je me suis interposé{|e} avec mon parapluie. J'ai calmé tout le monde. On a fini au bistrot d'en face, la veuve, la maîtresse et moi, à trinquer au salaud. Elles sont devenues amies.", "J'ai séparé les deux femmes. J'ai pris un coup de sac à main dans la tempe. Il y avait une brique dedans. Pourquoi une brique ? Personne ne sait."], en: ["I stepped in with my umbrella. Calmed everyone down. We ended up at the bar across the street, the widow, the mistress and me, toasting the bastard. They became friends.", "I separated the two women. Took a handbag to the temple. There was a brick inside. Why a brick? Nobody knows."] }, fx: { happy: 2, karma: 3, health: -3 }, mood: 'neutral' },
        ],
      },
    ],
  },
  {
    id: 'ho_funeral_buffet',
    icon: '🥪',
    cat: 'family',
    rating: 1,
    cooldown: 4,
    when: { age: [16, 95] },
    scene: { place: 'home', mood: 'neutral' },
    text: {
      fr: [
        "Après l'enterrement, réception chez la veuve. Le buffet est somptueux : petits fours, {w:food}, et un vin qui vaut plus cher que le cercueil. Les cousins chuchotent à propos de l'héritage.",
        "Collation après les obsèques. Ta tante remplit discrètement des boîtes en plastique avec les sandwiches. Elle t'en tend une : « Prends, ça va se perdre. »",
        "Après les funérailles, tout le monde se retrouve autour du buffet. Un cousin éloigné que personne n'a jamais vu demande où est « la montre en or du défunt ».",
        "Réception d'après-enterrement. Il y a des sandwiches triangulaires, du café tiède et {w:drink}. Quelqu'un a mis {w:song} par erreur sur l'enceinte. Personne n'ose l'arrêter.",
      ],
      en: [
        "After the funeral, a reception at the widow's. The buffet is lavish: canapés, {w:food}, and a wine worth more than the coffin. The cousins are whispering about the inheritance.",
        "Post-funeral snacks. Your aunt is discreetly filling plastic containers with sandwiches. She hands you one: 'Take it, it'll go to waste.'",
        "After the funeral, everyone gathers at the buffet. A distant cousin nobody's ever seen asks where 'the deceased's gold watch' is.",
        "Post-funeral reception. Triangle sandwiches, lukewarm coffee and {w:drink}. Someone accidentally put on {w:song}. Nobody dares turn it off.",
      ],
    },
    choices: [
      {
        label: { fr: 'Remplir les Tupperware', en: 'Fill the containers' },
        text: { fr: ["J'ai rempli quatre boîtes. J'ai mangé des sandwiches au saumon pendant dix jours. Chaque bouchée avait un goût de deuil et de mayonnaise.", "J'ai fait le plein de restes avec ma tante. On est devenus complices. On se retrouve maintenant à tous les enterrements de la région. Même ceux d'inconnus."], en: ["I filled four containers. Ate salmon sandwiches for ten days. Every bite tasted of grief and mayonnaise.", "I loaded up on leftovers with my aunt. We became partners in crime. We now go to every funeral in the area. Even strangers'."] },
        fx: { happy: 4, karma: -1, money: 30 },
        mood: 'happy',
      },
      {
        label: { fr: 'Enquêter sur la montre', en: 'Investigate the watch' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai mené l'enquête entre deux petits fours. La montre était au poignet du cousin éloigné depuis le début. Il est parti en courant. On a gardé ses chaussures.", "J'ai retrouvé la montre dans la poche du défunt, juste avant la fermeture du cercueil. La veuve me l'a offerte « pour l'honnêteté ». Elle ne marche pas, mais elle brille."], en: ["I investigated between two canapés. The watch had been on the distant cousin's wrist the whole time. He ran off. We kept his shoes.", "I found the watch in the deceased's pocket, just before they closed the coffin. The widow gave it to me 'for my honesty'. It doesn't work, but it shines."] }, fx: { happy: 6, karma: 3, smarts: 2 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai accusé le mauvais cousin. Il a fondu en larmes. C'était le fils caché du défunt. La réception est devenue une émission de télé-réalité.", "Mes questions ont lancé une dispute d'héritage générale. Deux oncles se sont battus avec des pinces à sucre. On ne se parle plus dans la famille. Ça fait des économies de cadeaux."], en: ["I accused the wrong cousin. He burst into tears. He was the deceased's secret son. The reception turned into a reality show.", "My questions sparked a family-wide inheritance war. Two uncles fought with sugar tongs. Nobody in the family speaks anymore. Saves money on gifts."] }, fx: { happy: -3, stress: 5 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'ho_funeral_kid',
    icon: '🕊️',
    cat: 'family',
    rating: 0,
    cooldown: 5,
    when: { age: [6, 12] },
    scene: { place: 'cemetery', mood: 'sad' },
    text: {
      fr: [
        "Ton premier enterrement : celui d'un arrière-grand-oncle. Tout le monde est triste et en noir. Le curé a un poil qui sort du nez et bouge à chaque mot.",
        "Tu es à l'enterrement d'une vieille tante. Il fait froid, l'orgue joue doucement. Ton cousin te chuchote une blague sur {w:animal}. Tu sens le fou rire arriver.",
        "Enterrement. Les adultes pleurent. Toi, tu te demandes ce qu'il y a à manger après et si tu peux enlever tes chaussures qui serrent.",
        "Premier enterrement de ta vie. Pendant la minute de silence, ton ventre fait {w:sound}. Toute la rangée se retourne.",
      ],
      en: [
        "Your first funeral: a great-great-uncle's. Everyone's sad and in black. The priest has a nose hair that wiggles with every word.",
        "You're at an old aunt's funeral. It's cold, the organ plays softly. Your cousin whispers a joke about {w:animal}. You feel the giggles coming.",
        "Funeral. The grown-ups are crying. You're wondering what there is to eat afterward and whether you can take off your tight shoes.",
        "First funeral of your life. During the moment of silence, your stomach goes {w:sound}. The whole row turns around.",
      ],
    },
    choices: [
      {
        label: { fr: 'Se retenir de rire', en: 'Hold in the laughter' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["Je me suis mordu la joue pendant toute la cérémonie. J'ai tenu. Ma mère m'a dit que j'avais été « très mature ». J'ai ri tout seul{|e} dans la voiture pendant vingt minutes.", "J'ai pensé à des choses tristes : mon poisson rouge mort, les épinards, la rentrée. J'ai tenu. Je suis un{|e} pro."], en: ["I bit my cheek through the whole ceremony. I held it. Mom said I was 'very mature'. I laughed alone in the car for twenty minutes.", "I thought sad thoughts: my dead goldfish, spinach, back to school. I held it. I'm a pro."] }, fx: { happy: 2, discipline: 3 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai craqué. Un petit rire, puis un gros, puis un hennissement. Mon cousin aussi. On a été sortis de l'église par l'oreille. Mamie, elle, souriait un peu.", "Le fou rire est sorti par le nez. Avec de la morve. Pendant la bénédiction. Personne n'a oublié."], en: ["I cracked. A little laugh, then a big one, then a whinny. My cousin too. We were dragged out of the church by our ears. Grandma was smiling a little, though.", "The giggles came out of my nose. With snot. During the blessing. Nobody forgot."] }, fx: { happy: 1, karma: -1 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Consoler un adulte', en: 'Comfort a grown-up' },
        text: { fr: ["J'ai pris la main de ma grand-mère qui pleurait. Elle l'a serrée tout le long. Après, elle m'a donné un bonbon à la menthe qui avait au moins vingt ans. Je l'ai mangé quand même.", "J'ai fait un dessin pour la famille du défunt : lui au paradis avec {w:animal}. La veuve l'a mis dans le cercueil. Je me suis senti{|e} très grand{|e}."], en: ["I held my crying grandma's hand. She squeezed it the whole time. Afterward, she gave me a mint that was at least twenty years old. I ate it anyway.", "I drew a picture for the family: the deceased in heaven with {w:animal}. The widow put it in the coffin. I felt very grown-up."] },
        fx: { happy: 3, karma: 4 },
        mood: 'love',
      },
    ],
  },
  {
    id: 'ho_funeral_auto',
    icon: '🪦',
    cat: 'family',
    rating: 2,
    auto: true,
    cooldown: 4,
    when: { age: [35, 95] },
    text: {
      fr: [
        "Encore un enterrement cette année. Au cimetière, le croque-mort a glissé dans la boue et a fini dans le trou avant le cercueil. Il est ressorti tout seul. Le défunt, non.",
        "J'ai assisté aux obsèques d'un ancien collègue. Le cercueil était trop grand pour le trou. Ils ont sauté dessus à quatre pour le tasser. On a entendu un craquement. On n'en parle pas.",
        "Enterrement d'une voisine. La crémation a pris du retard. Le fils a ramené l'urne dans un sac {w:brand}. Il l'a oubliée au café. Elle y est toujours, derrière le comptoir.",
        "Aux funérailles de ma grand-tante, son perroquet a hurlé ses derniers mots pendant toute la messe : « {w:swear} ». C'était tout à fait elle.",
      ],
      en: [
        "Another funeral this year. At the cemetery, the undertaker slipped in the mud and fell into the grave before the coffin. He climbed out on his own. The deceased didn't.",
        "I went to an old coworker's funeral. The coffin was too big for the hole. Four guys jumped on it to squash it in. There was a crack. We don't talk about it.",
        "A neighbor's funeral. The cremation ran late. The son brought the urn home in a {w:brand} bag. He forgot it at a café. It's still there, behind the counter.",
        "At my great-aunt's funeral, her parrot screamed her last words through the entire service: '{w:swear}'. That was totally her.",
      ],
    },
    fx: { happy: -2, stress: 2 },
  },
  // ───────────────────────────── graduation, retirement, baby showers ─────────────────────────────
  {
    id: 'ho_grad_party',
    icon: '🎓',
    cat: 'party',
    rating: 1,
    cooldown: 4,
    when: { age: [17, 26], has: 'parent' },
    actor: 'parent',
    scene: { place: 'home', mood: 'proud', prop: 'champagne' },
    text: {
      fr: [
        "Tes parents organisent une fête pour ton diplôme. {a:Ton père|Ta mère} a fait imprimer une banderole avec ta photo de classe de CE1. Toute la famille est là, même le cousin qui sort de prison.",
        "Fête de remise de diplôme dans le jardin. {a:Ton père|Ta mère} prépare un discours. Il fait [[trois|cinq|huit]] pages recto verso et commence par ta naissance.",
        "Pour célébrer ton diplôme, ta famille t'offre {w:gift} et une soirée {w:at_place}. {a:Ton père|Ta mère} pleure déjà et il n'est que 15 h.",
        "Fête de diplôme. Tes potes veulent t'emmener faire la tournée des bars. {a:Ton père|Ta mère} veut que tu restes pour « la photo de famille ». Elle dure depuis quarante minutes.",
      ],
      en: [
        "Your parents are throwing a graduation party. {a:Your dad|Your mom} printed a banner with your second-grade class photo. The whole family is here, even the cousin fresh out of prison.",
        "Graduation party in the yard. {a:Your dad|Your mom} is preparing a speech. It's [[three|five|eight]] double-sided pages and starts with your birth.",
        "To celebrate your diploma, your family gives you {w:gift} and a night {w:at_place}. {a:Your dad|Your mom} is already crying and it's only 3 p.m.",
        "Graduation party. Your friends want to take you bar-hopping. {a:Your dad|Your mom} wants you to stay for 'the family photo'. It's been going on for forty minutes.",
      ],
    },
    choices: [
      {
        label: { fr: 'Rester avec la famille', en: 'Stay with the family' },
        text: { fr: ["Je suis resté{|e}. Discours, larmes, gâteau, et mon oncle qui m'a demandé « et maintenant, tu fais quoi de ta vie ? » toutes les vingt minutes. {a:Mon père|Ma mère} était aux anges. Moi, au purgatoire.", "J'ai écouté le discours en entier. Il y avait une anecdote sur mon premier pot de chambre. Tout le monde a applaudi. J'ai bu le champagne de trois personnes."], en: ["I stayed. Speeches, tears, cake, and my uncle asking 'so what are you doing with your life?' every twenty minutes. {a:My dad|My mom} was over the moon. I was in purgatory.", "I listened to the whole speech. It included a story about my first potty. Everyone clapped. I drank three people's champagne."] },
        fx: { happy: 4, rel: 12 },
        mood: 'proud',
      },
      {
        label: { fr: 'Tournée des bars', en: 'Bar crawl' },
        out: [
          { w: 2, text: { fr: ["Tournée des bars avec ma toge. J'ai bu dans mon chapeau de diplômé{|e}, dansé sur un comptoir et fini la nuit en lançant mon diplôme dans une fontaine. Je l'ai récupéré. Il est gondolé.", "On a fait sept bars. J'ai embrassé un inconnu au cinquième. J'ai pleuré au sixième. J'ai mangé {w:food} au septième. Diplômé{|e} et détruit{|e}."], en: ["Bar crawl in my gown. Drank out of my mortarboard, danced on a counter and ended the night tossing my diploma into a fountain. Got it back. It's warped.", "We hit seven bars. Kissed a stranger at the fifth. Cried at the sixth. Ate {w:food} at the seventh. Graduated and destroyed."] }, fx: { happy: 10, health: -4, rel: -4 }, mood: 'party' },
          { w: 1, text: { fr: ["Je suis rentré{|e} à 6 h. {a:Mon père|Ma mère} m'attendait dans le salon avec la banderole et la photo de famille sans moi. Personne ne souriait sur la photo.", "J'ai perdu ma toge, mon diplôme et ma dignité. Un SDF les a retrouvés. Il porte la toge mieux que moi."], en: ["I got home at 6 a.m. {a:My dad|My mom} was waiting in the living room with the banner and the family photo without me. Nobody was smiling in it.", "I lost my gown, my diploma and my dignity. A homeless man found them. He wears the gown better than I did."] }, fx: { happy: 2, health: -4, rel: -10 }, mood: 'sad' },
        ],
      },
    ],
  },
  {
    id: 'ho_retire_party',
    icon: '🥂',
    cat: 'party',
    rating: 1,
    cooldown: 4,
    when: { age: [22, 70], job: true, has: 'coworker' },
    actor: 'coworker',
    scene: { place: 'office', mood: 'neutral', prop: 'champagne' },
    text: {
      fr: [
        "Pot de départ à la retraite de Gérard, 41 ans de maison chez {employer}. {a.first} te demande de faire un discours. Tu ne sais pas ce que Gérard faisait exactement.",
        "Pot de retraite au bureau. La collecte pour le cadeau a rapporté [[vingt-trois|trente-sept|quarante]] euros. Ça fait {w:gift}. {a.first} te charge de l'acheter.",
        "C'est le départ en retraite de la doyenne du service. Il y a des chips, du mousseux tiède et {a.first} qui pleure dans un coin parce qu'{a:il|elle} « sera {a:le prochain|la prochaine} ».",
        "Pot de départ. Le retraité, soulagé, a bu {w:drink} et commence à dire ce qu'il pense vraiment de la direction. Au micro. Le PDG est là.",
      ],
      en: [
        "Retirement party for Gerald, 41 years at {employer}. {a.first} asks you to make a speech. You don't know what Gerald actually did.",
        "Retirement drinks at the office. The gift collection raised [[twenty-three|thirty-seven|forty]] bucks. That buys {w:gift}. {a.first} puts you in charge of buying it.",
        "The department's longest-serving employee is retiring. There are chips, warm sparkling wine and {a.first} crying in a corner because '{a.he}'ll be next'.",
        "Retirement party. The retiree, relieved, had {w:drink} and is starting to say what he really thinks about management. On the mic. The CEO is here.",
      ],
    },
    choices: [
      {
        label: { fr: 'Faire un discours', en: 'Give a speech' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai fait un discours touchant sur « la loyauté » et « les valeurs ». Gérard a pleuré. Il m'a légué sa plante verte et sa chaise ergonomique. J'ai pris du galon.", "J'ai parlé de Gérard avec des mots génériques. « Pilier », « mémoire vivante », « toujours là ». Tout le monde a hoché la tête. Personne ne savait ce qu'il faisait. Même pas lui."], en: ["I gave a moving speech about 'loyalty' and 'values'. Gerald cried. He left me his houseplant and his ergonomic chair. Promotion in all but name.", "I spoke about Gerald in generic terms. 'Pillar', 'living memory', 'always there'. Everyone nodded. Nobody knew what he did. Not even him."] }, fx: { happy: 4, perf: 6, rel: 6 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai confondu Gérard avec un autre Gérard, mort l'an dernier. J'ai fait un éloge funèbre. Gérard, bien vivant, m'a regardé{|e} avec une inquiétude profonde.", "J'ai dit que Gérard allait « enfin pouvoir vivre ». Sa femme a toussé. Le PDG a toussé. J'ai compris trop tard."], en: ["I confused Gerald with another Gerald who died last year. I gave a eulogy. Gerald, very much alive, looked at me with deep concern.", "I said Gerald could 'finally start living'. His wife coughed. The CEO coughed. I understood too late."] }, fx: { happy: -4, perf: -4 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Encourager le retraité', en: 'Egg on the retiree' },
        text: { fr: ["J'ai resservi le retraité. Il a tout balancé : les notes de frais du PDG, la liaison du DRH, le vrai prix du café. Standing ovation. Il est parti en héros. Moi, je suis suspect.", "J'ai lancé « Vas-y, dis-le ! ». Il l'a dit. Le PDG est parti. Le retraité m'a fait un clin d'œil et m'a donné le code de la réserve de champagne."], en: ["I topped up the retiree. He spilled everything: the CEO's expense reports, HR's affair, the real price of the coffee. Standing ovation. He left a hero. I'm now a suspect.", "I yelled 'Go on, say it!'. He said it. The CEO left. The retiree winked and gave me the code to the champagne stash."] },
        fx: { happy: 7, perf: -4, karma: -1 },
        mood: 'party',
      },
    ],
  },
  {
    id: 'ho_baby_shower',
    icon: '🍼',
    cat: 'party',
    rating: 2,
    cooldown: 4,
    when: { age: [22, 50], has: 'anyFriend' },
    actor: 'anyFriend',
    scene: { place: 'apartment', mood: 'shock' },
    text: {
      fr: [
        "Baby shower chez {a.first}. Jeu numéro 1 : deviner le tour de ventre avec une ficelle. Jeu numéro 2 : boire du jus dans des biberons. Jeu numéro 3 : il y a une couche avec {w:food} dedans.",
        "Baby shower. On te met un bandeau sur les yeux et on te demande de changer la couche d'un poupon. Dans le poupon, on a mis {w:food} pour « faire réaliste ».",
        "Fête prénatale pour le bébé de {a.first}. Chaque invité doit donner un conseil de parent. Tu as {w:drink} à la main et aucun enfant. Ton tour arrive.",
        "Baby shower de {a.first}. Le cadeau collectif est un tire-lait. Le tien, c'est {w:gift}. Il y a un silence quand on l'ouvre.",
      ],
      en: [
        "Baby shower at {a.first}'s. Game 1: guess the belly size with a string. Game 2: drink juice from baby bottles. Game 3: there's a diaper with {w:food} in it.",
        "Baby shower. They blindfold you and ask you to change a doll's diaper. The doll is stuffed with {w:food} 'for realism'.",
        "Baby shower for {a.first}'s baby. Every guest has to give a parenting tip. You're holding {w:drink} and have no kids. It's your turn.",
        "{a.first}'s baby shower. The group gift is a breast pump. Yours is {w:gift}. There's a silence when it's opened.",
      ],
    },
    choices: [
      {
        label: { fr: 'Jouer à fond', en: 'Play to win' },
        out: [
          { w: 1, text: { fr: ["J'ai gagné tous les jeux. Au jeu de la couche, j'ai léché le contenu pour l'identifier. C'était bien de la purée de marron. J'avais parié ma réputation. J'ai gagné un body.", "J'ai bu le biberon de jus en six secondes. Record. J'ai eu le hoquet jusqu'au soir et j'ai rendu le jus dans le sac à langer. On m'a nommé{|e} « {parrain|marraine} de secours »."], en: ["I won every game. At the diaper game, I licked the contents to identify them. It was chestnut purée. I'd bet my reputation. I won a onesie.", "I drained the juice bottle in six seconds. Record. Had hiccups all night and threw up the juice in the diaper bag. They named me 'backup godparent'."] }, fx: { happy: 7, rel: 8 }, mood: 'party' },
          { w: 1, text: { fr: ["La couche de jeu ne contenait pas du chocolat. Le chien de la maison avait fait un échange. Je l'ai découvert en goûtant. Toute la fête a vu ma tête. Je ne mange plus de Nutella.", "J'ai trop serré la ficelle du ventre et j'ai fait sortir un pet à la future maman. Énorme. Elle a ri si fort qu'elle a cru perdre les eaux. Fausse alerte. Mais tout le monde a couru."], en: ["The game diaper didn't have chocolate in it. The house dog had made a swap. I found out by tasting. The whole party saw my face. I don't eat Nutella anymore.", "I pulled the belly string too tight and squeezed a fart out of the mom-to-be. Huge. She laughed so hard she thought her water broke. False alarm. But everyone ran."] }, fx: { happy: -4, health: -3, visual: 'poop' }, mood: 'sick', icon: '💩' },
        ],
      },
      {
        label: { fr: 'Donner un vrai conseil', en: 'Give real advice' },
        text: { fr: ["Mon conseil : « Dors maintenant. Pour toujours. Tant que tu peux. » Les mères présentes ont applaudi en pleurant. La future maman a blêmi.", "J'ai conseillé « {w:activity} pour se détendre ». Personne n'a compris. La future maman l'a noté. Elle le fera."], en: ["My advice: 'Sleep now. Forever. While you can.' The mothers present applauded through tears. The mom-to-be went pale.", "I recommended '{w:activity}' to relax. Nobody understood. The mom-to-be wrote it down. She'll do it."] },
        fx: { happy: 3, rel: 5, smarts: 1 },
        mood: 'happy',
      },
    ],
  },
  {
    id: 'ho_gender_reveal',
    icon: '💥',
    cat: 'party',
    rating: 2,
    cooldown: 5,
    when: { age: [20, 70], has: 'sibling' },
    actor: 'sibling',
    scene: { place: 'park', mood: 'shock', fx: 'explosion' },
    text: {
      fr: [
        "{a.first} organise une gender reveal. Le résultat sera annoncé par un canon à confettis artisanal fabriqué par son beau-frère, qui a « fait l'armée ». La mèche fume déjà.",
        "Gender reveal de {a.first} dans le jardin. Le sexe du bébé sera révélé par un animal dressé, {w:animal}, qui doit percer un ballon. L'animal a l'air de vouloir autre chose.",
        "Fête pour révéler le sexe du bébé de {a.first}. Un avion d'épandage va larguer de la poudre rose ou bleue sur le jardin. Le pilote est un oncle. Il a bu {w:drink}.",
        "Gender reveal chez {a.first}. On t'a confié le rôle d'allumer la fusée colorée. Il y a [[douze|vingt|cinquante]] invités, un barbecue et une forêt très sèche juste derrière.",
      ],
      en: [
        "{a.first} is throwing a gender reveal. The result will be announced by a homemade confetti cannon built by an in-law who 'was in the army'. The fuse is already smoking.",
        "{a.first}'s gender reveal in the yard. The baby's sex will be revealed by a trained animal, {w:animal}, that's supposed to pop a balloon. The animal seems to have other plans.",
        "Party to reveal {a.first}'s baby's sex. A crop duster will drop pink or blue powder on the yard. The pilot is an uncle. He had {w:drink}.",
        "Gender reveal at {a.first}'s. You've been put in charge of lighting the colored rocket. There are [[twelve|twenty|fifty]] guests, a barbecue and a very dry forest right behind.",
      ],
    },
    choices: [
      {
        label: { fr: 'Allumer / lancer', en: 'Light it / launch it' },
        out: [
          { w: 1, text: { fr: ["BOUM. Un nuage rose immense, magnifique. Puis un deuxième nuage, noir celui-là : la haie. Puis la cabane de jardin. C'est une fille ! Et un incendie de catégorie 2. Les pompiers ont trouvé ça mignon.", "Le canon a explosé au lieu de tirer. Confettis bleus, morceaux de canon et sourcils de l'oncle partout. Un éclat a arraché le lobe de mon oreille. Il pend encore un peu. C'est un garçon, apparemment."], en: ["BOOM. A huge pink cloud, gorgeous. Then a second cloud, black this time: the hedge. Then the garden shed. It's a girl! And a category 2 wildfire. The firefighters found it adorable.", "The cannon exploded instead of firing. Blue confetti, cannon fragments and the uncle's eyebrows everywhere. Shrapnel took off my earlobe. It's still dangling a bit. It's a boy, apparently."] }, fx: { happy: -4, health: -10, stress: 10, visual: 'explosion' }, mood: 'shock', icon: '🔥' },
          { w: 2, text: { fr: ["Ça a marché ! Un joli nuage de couleur, des cris de joie, {a.first} en larmes. Personne n'est mort. Pour une gender reveal, c'est un exploit historique.", "La poudre est tombée pile sur les invités. Tout le monde est devenu bleu, la piscine aussi, le chat aussi. C'est un garçon. Le chat est toujours bleu, trois mois après."], en: ["It worked! A pretty cloud of color, cheers, {a.first} in tears. Nobody died. For a gender reveal, that's a historic feat.", "The powder landed right on the guests. Everyone turned blue, the pool too, the cat too. It's a boy. The cat is still blue three months later."] }, fx: { happy: 8, rel: 8, visual: 'confetti' }, mood: 'party' },
        ],
      },
      {
        label: { fr: 'Prendre ses distances', en: 'Keep your distance' },
        text: { fr: ["Je suis resté{|e} au fond du jardin, près de la sortie. Quand la cabane a pris feu, j'étais déjà dans ma voiture. J'ai vu la fin aux infos régionales. C'était une fille.", "Je me suis abrité{|e} derrière le barbecue. L'animal dressé a fini par attaquer le ballon, puis l'oncle, puis la pièce montée. J'ai tout filmé. Ça s'appelle « le bébé de l'apocalypse »."], en: ["I stayed at the back of the yard, near the exit. When the shed caught fire, I was already in my car. Saw the end on the local news. It was a girl.", "I took cover behind the grill. The trained animal eventually attacked the balloon, then the uncle, then the cake. I filmed it all. It's called 'Apocalypse Baby'."] },
        fx: { happy: 4, rel: -3, smarts: 2 },
        mood: 'neutral',
      },
    ],
  },
];
