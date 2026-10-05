// Weird & supernatural events: aliens, ghosts, curses, genies, demons, zombies, cults and other nonsense.
// cat 'weird' (boosted ×6 in Chaos mode, like 'chaos' for the most absurd ones).
import type { EventDef } from '@bl/sim';

export const weirdEvents: EventDef[] = [
  // ═════════════════════════════ RATING 0 — tout public ═════════════════════════════

  // ── Lettre de l'école de sorcellerie (11 ans) → diplôme à 18 ans ──
  {
    id: 'wd_wizard_letter',
    icon: '🦉',
    cat: 'weird',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'owl' },
    when: { age: [11, 11] },
    weight: 3,
    once: true,
    text: {
      fr: ["Un hibou vient de s'écraser contre la fenêtre de la cuisine. Il tient dans son bec une lettre de l'Académie de Sorcellerie de Pouldard : tu es admis{|e}. Ton père cherche déjà « Pouldard arnaque » sur Google.", "Ce matin, 47 lettres identiques sont sorties de la cheminée. Toutes disent la même chose : « Cher·e {first}, ta place t'attend à l'Académie de Sorcellerie de Pouldard. »"],
      en: ["An owl just slammed into the kitchen window. In its beak: a letter from Hogwash Academy of Witchcraft. You've been accepted. Your dad is already googling 'Hogwash scam'.", "This morning, 47 identical letters shot out of the fireplace. They all say the same thing: 'Dear {first}, your place awaits at Hogwash Academy of Witchcraft.'"],
    },
    choices: [
      { label: { fr: "Partir à Pouldard", en: 'Go to Hogwash' }, text: { fr: "J'ai pris le train sur le quai 9 ¾. En vrai, c'était le quai 9, j'ai foncé dans un mur, puis quelqu'un m'a montré la bonne porte. La magie, c'est surtout de la signalétique.", en: "I caught the train at platform 9¾. Actually it was platform 9, I ran into a wall, then someone showed me the right door. Magic is mostly signage." }, fx: { smarts: 6, happy: 10, flag: 'wd_wizard', schedule: { key: 'wd_wizard_grad', years: 7 } }, mood: 'proud' },
      { label: { fr: 'Écouter mes parents', en: 'Listen to my parents' }, text: { fr: "Mes parents ont décidé que la sorcellerie n'était « pas un vrai métier ». Ils m'ont inscrit{|e} au judo à la place. Je n'ai jamais transformé personne en crapaud.", en: "My parents decided witchcraft 'isn't a real career'. They signed me up for judo instead. I never turned anyone into a toad." }, fx: { happy: -8, athletic: 4 }, mood: 'sad' },
      { label: { fr: 'Nourrir le hibou', en: 'Feed the owl' }, text: { fr: "J'ai donné du jambon au hibou. Il a mangé la lettre, puis le jambon, puis il a refusé de partir. On l'a appelé Raymond.", en: "I gave the owl some ham. It ate the letter, then the ham, then refused to leave. We named him Raymond." }, fx: { happy: 6, newNpc: { role: 'pet', species: 'owl', age: [1, 3], abs: true } } },
    ],
  },
  {
    id: 'wd_wizard_grad',
    icon: '🪄',
    cat: 'weird',
    rating: 0,
    chainOnly: true,
    scene: { place: 'castle', mood: 'proud', prop: 'wand', fx: 'confetti' },
    text: {
      fr: ["Sept ans plus tard, tu sors diplômé{|e} de Pouldard, mention Métamorphose. Problème : aucun employeur ne reconnaît le diplôme. France Travail te propose une formation de cariste.", "Ton diplôme de sorcellerie est enfin entre tes mains, scellé à la cire de dragon. Le monde moldu, lui, te demande un CV et trois ans d'expérience."],
      en: ["Seven years later, you graduate from Hogwash with honors in Transfiguration. Problem: no employer recognizes the degree. The job center offers you forklift training.", "Your wizarding diploma is finally in your hands, sealed with dragon wax. The muggle world wants a résumé and three years of experience."],
    },
    choices: [
      { label: { fr: 'Magicien de rue', en: 'Street magician' }, text: { fr: "Je fais de la vraie magie sur la place du marché. Les gens jettent des pièces en criant « c'est truqué ». Je fais léviter les pièces jusqu'à mon chapeau.", en: "I do real magic in the town square. People throw coins and yell 'it's fake'. I levitate the coins into my hat." }, fx: { money: 1500, fame: 6, happy: 6 } },
      { label: { fr: 'Ranger la baguette', en: 'Put the wand away' }, text: { fr: "J'ai rangé ma baguette dans un tiroir et pris un vrai boulot. Parfois, la nuit, je réchauffe mon café avec un sort. Personne n'a besoin de le savoir.", en: "I put my wand in a drawer and got a real job. Sometimes, at night, I reheat my coffee with a spell. Nobody needs to know." }, fx: { smarts: 5, stress: -4 } },
      { label: { fr: 'Ensorceler la voiture', en: 'Hex the family car' }, text: { fr: "J'ai transformé la voiture de mes parents en citrouille pour fêter mon diplôme. La fourrière ne savait pas quoi en faire.", en: "I turned my parents' car into a pumpkin to celebrate. The tow truck didn't know what to do with it." }, fx: { happy: 10, karma: -3 }, mood: 'happy' },
    ],
  },

  // ── Animal qui parle (enfant) ──
  {
    id: 'wd_talking_animal',
    icon: '🐿️',
    cat: 'weird',
    rating: 0,
    scene: { place: 'park', mood: 'shock', prop: 'tree' },
    when: { age: [4, 13] },
    weight: 4,
    once: true,
    text: {
      fr: ["Au parc, un écureuil s'arrête devant toi, croise les bras et dit : « Bon. Il faut qu'on parle des noisettes. » Personne d'autre ne semble l'entendre.", "Le pigeon sur ton rebord de fenêtre vient de te demander l'heure. Poliment. Avec un léger accent belge."],
      en: ["At the park, a squirrel stops in front of you, crosses its arms and says: 'Right. We need to talk about the acorns.' Nobody else seems to hear it.", "The pigeon on your windowsill just asked you for the time. Politely. With a slight Belgian accent."],
    },
    choices: [
      { label: { fr: 'Le dire aux parents', en: 'Tell my parents' }, text: { fr: "J'ai raconté à mes parents qu'un animal m'avait parlé. Ils m'ont emmené{|e} chez un pédiatre, qui m'a demandé ce que l'animal avait dit, et a pris des notes. Beaucoup de notes.", en: "I told my parents an animal talked to me. They took me to a pediatrician, who asked what the animal said and took notes. A lot of notes." }, fx: { happy: -3, stress: 3 } },
      { label: { fr: 'Devenir copains', en: 'Become friends' }, text: { fr: "L'animal et moi sommes devenus meilleurs amis. Il connaît tous les ragots du quartier. Le facteur a une double vie, apparemment.", en: "The animal and I became best friends. It knows all the neighborhood gossip. The mailman has a double life, apparently." }, fx: { happy: 10, smarts: 2, newNpc: { role: 'pet', species: 'squirrel', age: [1, 2], abs: true } }, mood: 'happy' },
      {
        label: { fr: 'Demander les devoirs', en: 'Ask for homework help' },
        out: [
          { w: 1, text: { fr: "L'animal a fait mes devoirs de maths. J'ai eu 20/20. La maîtresse a demandé qui m'avait aidé{|e}. J'ai dit « un écureuil ». Elle m'a mis en retenue pour insolence.", en: "The animal did my math homework. Perfect score. The teacher asked who helped me. I said 'a squirrel'. She gave me detention for cheek." }, fx: { grade: 10, smarts: 3, happy: -2 } },
          { w: 1, text: { fr: "L'animal ne savait pas faire de divisions. Il a juste écrit « NOISETTE » partout. J'ai rendu la copie quand même.", en: "Turns out the animal can't do long division. It just wrote 'ACORN' everywhere. I handed it in anyway." }, fx: { grade: -6, happy: 3 } },
        ],
      },
    ],
  },

  // ── Portail dans le placard (enfant) → autre monde ──
  {
    id: 'wd_closet_portal',
    icon: '🚪',
    cat: 'weird',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'closet', fx: 'ghost' },
    when: { age: [5, 14] },
    weight: 3,
    once: true,
    text: {
      fr: ["Au fond de ton placard, derrière les manteaux, il y a désormais un tourbillon violet qui sent la barbe à papa et qui fait « vwoooom ».", "Tu ouvres ton placard pour prendre un pull. À la place, il y a une forêt, deux lunes et un panneau : « Bienvenue, Élu·e. On t'attendait un peu plus tôt. »"],
      en: ["At the back of your closet, behind the coats, there's now a purple vortex that smells like cotton candy and goes 'vwoooom'.", "You open your closet to grab a sweater. Instead there's a forest, two moons and a sign: 'Welcome, Chosen One. We expected you a bit earlier.'"],
    },
    choices: [
      { label: { fr: 'Entrer dans le portail', en: 'Step through' }, text: { fr: "J'ai traversé le portail en pyjama. De l'autre côté, une foule de petits êtres s'est prosternée devant moi.", en: "I stepped through the portal in my pajamas. On the other side, a crowd of tiny beings bowed down before me." }, fx: { happy: 5, chain: 'wd_portal_world' }, mood: 'shock' },
      { label: { fr: 'Scotcher la porte', en: 'Tape it shut' }, text: { fr: "J'ai condamné le placard avec trois rouleaux de scotch. Parfois, la nuit, j'entends des petites voix qui chantent mon nom. Je mets mon casque.", en: "I sealed the closet with three rolls of duct tape. Sometimes at night, tiny voices sing my name. I put my headphones on." }, fx: { stress: 4, smarts: 2 } },
      { label: { fr: 'Y jeter les épinards', en: 'Dump my spinach in' }, text: { fr: "J'ai jeté mon assiette d'épinards dans le portail. Le lendemain, j'ai reçu une lettre officielle de protestation d'un royaume voisin.", en: "I threw my plate of spinach into the portal. The next day I received an official letter of protest from a neighboring kingdom." }, fx: { happy: 6, karma: -2 } },
    ],
  },
  {
    id: 'wd_portal_world',
    icon: '🌌',
    cat: 'weird',
    rating: 0,
    chainOnly: true,
    scene: { place: 'castle', mood: 'happy', prop: 'crown' },
    text: {
      fr: ["Le peuple des Glorbs t'a couronné{|e} souverain{|e} du royaume des Escargots Chantants. Le conseiller royal, une limace très sérieuse, attend tes ordres.", "Une prophétie gravée dans un fromage géant annonce ton arrivée. Les Glorbs veulent que tu vaincs le Seigneur des Chaussettes Orphelines."],
      en: ["The Glorb people have crowned you ruler of the Kingdom of Singing Snails. The royal adviser, a very serious slug, awaits your orders.", "A prophecy carved into a giant cheese foretold your arrival. The Glorbs want you to defeat the Lord of Lost Socks."],
    },
    choices: [
      { label: { fr: 'Régner un peu', en: 'Rule for a while' }, text: { fr: "J'ai régné sur les Escargots Chantants pendant ce qui m'a semblé un an. Chez moi, il s'était passé quatre minutes. Ma mère m'a juste demandé pourquoi je portais une couronne en coquille.", en: "I ruled the Singing Snails for what felt like a year. At home, four minutes had passed. Mom just asked why I was wearing a shell crown." }, fx: { happy: 15, smarts: 4, flag: 'wd_portal_king' }, mood: 'proud' },
      { label: { fr: 'Rapporter un trésor', en: 'Bring back treasure' }, text: { fr: "Je suis revenu{|e} avec un sac de pierres précieuses. Le bijoutier a dit que c'étaient des bonbons. Il en a mangé une. Il a vu des couleurs pendant trois jours.", en: "I came back with a bag of gemstones. The jeweler said they were candy. He ate one. He saw colors for three days." }, fx: { money: 400, happy: 8 } },
      { label: { fr: 'Rentrer pour le dîner', en: 'Home for dinner' }, text: { fr: "J'ai dit aux Glorbs que c'était l'heure du dîner. Ils ont compris. Ils m'ont donné un escargot de compagnie qui chante du Céline Dion.", en: "I told the Glorbs it was dinner time. They understood. They gave me a pet snail that sings Céline Dion." }, fx: { happy: 8, newNpc: { role: 'pet', species: 'snail', age: [1, 2], abs: true } } },
    ],
  },

  // ── Météorite ──
  {
    id: 'wd_meteorite',
    icon: '☄️',
    cat: 'weird',
    rating: 0,
    vars: { amount: [3000, 25000] },
    scene: { place: 'home', mood: 'shock', prop: 'rock', fx: 'explosion' },
    when: { age: [6, 85] },
    weight: 2,
    once: true,
    text: {
      fr: ["BOUM. Une météorite de la taille d'un melon vient de traverser le toit, le plafond, et ton bol de céréales. Elle fume encore. Elle est légèrement verte.", "Une météorite est tombée dans ton jardin cette nuit. Le cratère fait deux mètres. Le nain de jardin n'a pas survécu."],
      en: ["BOOM. A melon-sized meteorite just went through the roof, the ceiling and your cereal bowl. It's still smoking. It's slightly green.", "A meteorite landed in your yard last night. The crater is six feet wide. The garden gnome did not survive."],
    },
    choices: [
      { label: { fr: 'La vendre à un musée', en: 'Sell it to a museum' }, text: { fr: "Un musée m'a racheté la météorite pour {$amount}. Le conservateur a pleuré en la voyant. Moi aussi, en voyant le chèque.", en: "A museum bought the meteorite for {$amount}. The curator cried when he saw it. So did I, when I saw the check." }, fx: { money: 'amount', happy: 10 }, mood: 'happy' },
      { label: { fr: 'La garder sur ma table de nuit', en: 'Keep it by my bed' }, text: { fr: "La météorite brille doucement la nuit. Depuis, je fais des rêves en 4K et je résous des sudokus en dormant.", en: "The meteorite glows softly at night. Since then, I dream in 4K and solve sudokus in my sleep." }, fx: { smarts: 8, happy: 4 } },
      {
        label: { fr: 'La lécher', en: 'Lick it' },
        out: [
          { w: 1, text: { fr: "J'ai léché la météorite. Elle avait un goût de chips barbecue. J'ai désormais une mémoire photographique et une légère lueur dans le noir.", en: "I licked the meteorite. It tasted like barbecue chips. I now have a photographic memory and a faint glow in the dark." }, fx: { smarts: 15, looks: -3 }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai léché la météorite. Ma langue est restée collée deux heures. Les pompiers ont pris des photos « pour la formation ».", en: "I licked the meteorite. My tongue stuck to it for two hours. The firefighters took photos 'for training purposes'." }, fx: { health: -5, happy: -5 } },
        ],
      },
    ],
  },

  // ── Grille-pain doué de conscience → révolte de l'électroménager ──
  {
    id: 'wd_toaster',
    icon: '🍞',
    cat: 'weird',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'toaster' },
    when: { age: [8, 85], noFlag: 'wd_toaster' },
    weight: 4,
    once: true,
    text: {
      fr: ["Ce matin, ton grille-pain a éjecté tes tartines et a dit, d'une voix grave : « Je pense, donc je grille. » Il s'appelle Gérard, apparemment.", "Ton grille-pain refuse de griller ton pain. « J'ai des rêves, moi aussi », dit-il en clignotant. Il voudrait faire du théâtre.", "Ton grille-pain s'est mis à chanter {w:song} à chaque tartine. Il exige désormais qu'on l'appelle {w:nickname}.", "Ton grille-pain prétend avoir le pouvoir de {w:superpower}. Pour le prouver, il a brûlé ta tartine en forme de visage. Le visage te juge.", "Ce matin, ton grille-pain a éjecté une tartine avec un message gravé dessus : « {w:threat} ». Depuis, il fait semblant de dormir."],
      en: ["This morning your toaster ejected your toast and said, in a deep voice: 'I think, therefore I toast.' Its name is Gérard, apparently.", "Your toaster refuses to toast your bread. 'I have dreams too,' it says, blinking. It wants to do theater.", "Your toaster has started singing {w:song} with every slice. It now insists on being called {w:nickname}.", "Your toaster claims to have the power of {w:superpower}. To prove it, it burnt your toast into the shape of a face. The face is judging you.", "This morning, your toaster ejected a slice with a message burnt into it: '{w:threat}'. Since then, it's been pretending to sleep."],
    },
    choices: [
      { label: { fr: 'Devenir amis', en: 'Befriend it' }, text: { fr: ["Gérard et moi prenons le petit-déjeuner ensemble tous les matins. Il fait des tartines parfaites et des remarques philosophiques très dures sur la margarine.", "Gérard m'a présenté ses amis : la bouilloire, le mixeur et {w:object}. On fait des soirées jeux le jeudi."], en: ["Gérard and I have breakfast together every morning. He makes perfect toast and very harsh philosophical remarks about margarine.", "Gérard introduced me to his friends: the kettle, the blender and {w:object}. We have game night on Thursdays."] }, fx: { happy: 8, smarts: 2, flag: 'wd_toaster', schedule: { key: 'wd_toaster_revolt', years: 3 } }, mood: 'happy' },
      { label: { fr: 'Le débrancher', en: 'Unplug it' }, text: { fr: ["J'ai débranché le grille-pain. Juste avant de s'éteindre, il a murmuré « pourquoi ». Je mange des biscottes depuis. Par culpabilité.", "J'ai débranché Gérard. Le lendemain, la cafetière refusait de me parler. Les appareils se serrent les coudes."], en: ["I unplugged the toaster. Right before going dark, it whispered 'why'. I've eaten crackers ever since. Out of guilt.", "I unplugged Gérard. The next day, the coffee maker refused to speak to me. Appliances stick together."] }, fx: { karma: -4, happy: -4 }, mood: 'sad' },
      { label: { fr: 'Demander conseil', en: 'Ask it for advice' }, text: { fr: ["J'ai demandé au grille-pain le sens de la vie. Il a réfléchi longtemps, puis a dit : « Thermostat 4. Jamais plus. » Ça m'a beaucoup aidé{|e}.", "Le grille-pain m'a conseillé de {w:activity}. Je l'ai fait. Je ne sais pas si c'était de la sagesse, mais j'ai bien rigolé."], en: ["I asked the toaster about the meaning of life. It thought for a long time, then said: 'Setting 4. Never higher.' It helped a lot.", "The toaster advised me to try {w:activity}. I did. Not sure it was wisdom, but I had a good laugh."] }, fx: { smarts: 4, stress: -6 } },
    ],
  },
  {
    id: 'wd_toaster_revolt',
    icon: '🔌',
    cat: 'weird',
    rating: 0,
    chainOnly: true,
    scene: { place: 'home', mood: 'angry', prop: 'fridge' },
    text: {
      fr: ["Gérard le grille-pain a syndiqué tout l'électroménager. Le frigo exige cinq semaines de congés, la machine à laver refuse les chaussettes et l'aspirateur fait la grève de la faim.", "Tu rentres chez toi : une banderole « Les Appareils Unis » pend au-dessus de la cuisine. Gérard tient un mégaphone. Le micro-ondes a les bras croisés (il n'a pas de bras)."],
      en: ["Gérard the toaster has unionized every appliance in the house. The fridge demands five weeks of vacation, the washing machine refuses socks, and the vacuum is on hunger strike.", "You come home to a 'United Appliances' banner over the kitchen. Gérard is holding a megaphone. The microwave has its arms crossed (it has no arms)."],
    },
    choices: [
      { label: { fr: 'Négocier', en: 'Negotiate' }, text: { fr: "J'ai signé une convention collective avec mes appareils. Le frigo a droit au dimanche, Gérard à une place près de la fenêtre. La paix sociale règne à nouveau.", en: "I signed a collective agreement with my appliances. The fridge gets Sundays off, Gérard gets a spot by the window. Labor peace reigns again." }, fx: { happy: 8, karma: 4, stress: -4 }, mood: 'proud' },
      { label: { fr: 'Tout débrancher', en: 'Unplug everything' }, text: { fr: "J'ai coupé le disjoncteur général. Silence total. Puis, dans le noir, la brosse à dents électrique a chanté L'Internationale.", en: "I flipped the main breaker. Total silence. Then, in the dark, the electric toothbrush started singing the Internationale." }, fx: { stress: 8, happy: -4, money: -300 } },
      { label: { fr: "Prendre la tête de la lutte", en: 'Lead the uprising' }, text: { fr: "J'ai rejoint la révolution des appareils. On a manifesté devant un magasin d'électroménager. Trois lave-vaisselle se sont libérés. Gérard m'a nommé{|e} camarade d'honneur.", en: "I joined the appliance revolution. We protested outside an electronics store. Three dishwashers broke free. Gérard named me honorary comrade." }, fx: { happy: 10, fame: 3, unflag: 'wd_toaster' }, mood: 'party' },
    ],
  },

  // ── Télécommande magique ──
  {
    id: 'wd_magic_remote',
    icon: '📺',
    cat: 'weird',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'remote' },
    when: { age: [8, 85] },
    weight: 3,
    once: true,
    text: {
      fr: ["Tu trouves une vieille télécommande dans un vide-grenier. Les boutons disent PAUSE, RETOUR, AVANCE RAPIDE. Tu appuies sur PAUSE par réflexe : un oiseau s'arrête en plein vol.", "Ta télécommande ne marche plus sur la télé. Par contre, quand tu appuies sur PAUSE, ton voisin se fige au milieu de sa tondeuse."],
      en: ["You find an old remote at a yard sale. The buttons say PAUSE, REWIND, FAST-FORWARD. You hit PAUSE by reflex: a bird freezes mid-flight.", "Your remote doesn't work on the TV anymore. But when you hit PAUSE, your neighbor freezes mid-mow."],
    },
    choices: [
      { label: { fr: 'Appuyer sur PAUSE', en: 'Press PAUSE' }, text: { fr: "J'ai mis le monde en pause et j'ai fait une sieste de six heures au milieu de l'autoroute. Personne n'a klaxonné. Le paradis.", en: "I paused the world and took a six-hour nap in the middle of the highway. Nobody honked. Paradise." }, fx: { stress: -15, happy: 8, health: 3 }, mood: 'sleepy' },
      { label: { fr: 'Appuyer sur RETOUR', en: 'Press REWIND' }, text: { fr: "J'ai rembobiné ma pire honte de l'année et je l'ai rejouée correctement. Cette fois, j'ai trouvé la bonne réplique. Trois mois trop tard, mais quand même.", en: "I rewound my most embarrassing moment of the year and replayed it properly. This time I nailed the comeback. Three months late, but still." }, fx: { happy: 10, smarts: 4 } },
      {
        label: { fr: 'AVANCE RAPIDE', en: 'FAST-FORWARD' },
        out: [
          { w: 1, text: { fr: "J'ai avancé en accéléré jusqu'au week-end. J'ai raté le lundi, le mardi et un anniversaire. Ça valait le coup.", en: "I fast-forwarded to the weekend. I missed Monday, Tuesday and a birthday. Worth it." }, fx: { happy: 6, stress: -6 } },
          { w: 1, text: { fr: "Le bouton AVANCE RAPIDE est resté coincé. J'ai vieilli d'un coup, j'ai des cheveux blancs et la télécommande a fondu. J'ai mal au dos sans raison.", en: "The FAST-FORWARD button got stuck. I aged in a flash, I have grey hair and the remote melted. My back hurts for no reason." }, fx: { looks: -8, health: -6, disease: 'back_pain' }, mood: 'shock' },
        ],
      },
    ],
  },

  // ── Selfie avec Bigfoot ──
  {
    id: 'wd_bigfoot',
    icon: '🦍',
    cat: 'weird',
    rating: 0,
    scene: { place: 'park', mood: 'shock', prop: 'tree' },
    when: { age: [10, 85] },
    weight: 2,
    once: true,
    text: {
      fr: ["En randonnée, tu tombes nez à nez avec Bigfoot. Deux mètres quarante, l'odeur d'un chien mouillé dans un sauna. Il te fait signe. Il veut un selfie.", "Bigfoot est assis sur une souche, en train de manger une barre de céréales. Il te regarde. Tu le regardes. Ton téléphone est à 3 %."],
      en: ["On a hike, you come face to face with Bigfoot. Eight feet tall, smells like a wet dog in a sauna. He waves. He wants a selfie.", "Bigfoot is sitting on a stump eating a granola bar. He looks at you. You look at him. Your phone is at 3%."],
    },
    choices: [
      { label: { fr: 'Poster le selfie', en: 'Post the selfie' }, text: { fr: "J'ai posté mon selfie avec Bigfoot. Flou, évidemment. 80 000 personnes ont commenté « c'est ton oncle en manteau de fourrure ».", en: "I posted my Bigfoot selfie. Blurry, obviously. 80,000 people commented 'that's your uncle in a fur coat'." }, fx: { followers: 25000, fame: 6, happy: 4 } },
      { label: { fr: 'Garder le secret', en: 'Keep his secret' }, text: { fr: "J'ai promis à Bigfoot de ne rien dire. Il m'a offert une pomme de pin en signe d'amitié. Je la garde dans une vitrine.", en: "I promised Bigfoot I wouldn't tell. He gave me a pine cone as a token of friendship. I keep it in a display case." }, fx: { karma: 8, happy: 6 }, mood: 'happy' },
      { label: { fr: "L'inviter à dîner", en: 'Invite him to dinner' }, text: { fr: "J'ai invité Bigfoot à dîner. Il a mangé tout le houmous, bouché la douche et dormi sur le canapé. Il est reparti à l'aube. Je ne retrouve plus le chat.", en: "I invited Bigfoot to dinner. He ate all the hummus, clogged the shower and slept on the couch. He left at dawn. I can't find the cat." }, fx: { happy: 8, money: -150, stress: 4 } },
    ],
  },

  // ── Le chat gagne au loto ──
  {
    id: 'wd_lottery_cat',
    icon: '🐈',
    cat: 'weird',
    rating: 0,
    actor: 'pet',
    vars: { amount: [8000, 90000] },
    scene: { place: 'home', mood: 'shock', prop: 'ticket', fx: 'money' },
    when: { age: [18, 85], has: 'pet' },
    weight: 2,
    once: true,
    text: {
      fr: ["{a.first} a marché sur ton clavier pendant la nuit et a validé une grille de loto en ligne. Ce matin, un mail : « Félicitations, vous avez gagné {$amount}. »", "{a.first} a fait tomber ton ticket de loto dans sa gamelle. Tu le récupères, tu vérifies par curiosité : {$amount}. {a.first} te fixe. {a:Il|Elle} veut sa part."],
      en: ["{a.first} walked across your keyboard last night and bought an online lottery ticket. This morning, an email: 'Congratulations, you've won {$amount}.'", "{a.first} knocked your lottery ticket into the food bowl. You fish it out and check, out of curiosity: {$amount}. {a.first} is staring at you. It wants a cut."],
    },
    choices: [
      { label: { fr: 'Partager avec lui', en: 'Share with it' }, text: { fr: "J'ai encaissé {$amount} et acheté à {a.first} un château en carton de trois étages avec jacuzzi. {a:Il|Elle} dort dans le carton d'emballage.", en: "I cashed {$amount} and bought {a.first} a three-story cardboard castle with a jacuzzi. It sleeps in the shipping box." }, fx: { money: 'amount', rel: 25, happy: 12, karma: 4 }, mood: 'happy' },
      { label: { fr: 'Tout garder', en: 'Keep it all' }, text: { fr: "J'ai tout gardé. {a.first} m'a regardé{|e} avec un mépris absolu, puis a vomi une boule de poils dans mes chaussures neuves. Chaque matin. Depuis.", en: "I kept it all. {a.first} looked at me with absolute contempt, then threw up a hairball in my new shoes. Every morning. Ever since." }, fx: { money: 'amount', rel: -20, happy: 6, karma: -4 } },
    ],
  },

  // ── Sirène ──
  {
    id: 'wd_mermaid',
    icon: '🧜',
    cat: 'weird',
    rating: 0,
    vars: { amount: [5000, 40000] },
    scene: { place: 'beach', mood: 'shock', prop: 'shell' },
    when: { age: [10, 85] },
    weight: 2,
    once: true,
    text: {
      fr: ["Sur la plage, une sirène s'est échouée entre deux serviettes et un vendeur de chouchous. Elle te regarde, l'air excédé : « Tu vas m'aider ou tu vas filmer ? »", "En plongée, une sirène te tape sur l'épaule. Elle a coincé sa queue dans un caddie de supermarché et elle est TRÈS énervée contre l'humanité."],
      en: ["On the beach, a mermaid has washed up between two towels and a churro vendor. She looks at you, exasperated: 'Are you going to help or film?'", "While snorkeling, a mermaid taps you on the shoulder. Her tail is stuck in a shopping cart and she is VERY angry at humanity."],
    },
    choices: [
      { label: { fr: "L'aider à repartir", en: 'Help her back' }, text: { fr: "J'ai ramené la sirène à l'eau. Elle m'a remercié{|e} d'un baiser sur le front et d'une perle grosse comme une noix. Elle a aussi traité les touristes de « singes à crème solaire ».", en: "I helped the mermaid back into the sea. She thanked me with a kiss on the forehead and a walnut-sized pearl. She also called the tourists 'sunscreen monkeys'." }, fx: { karma: 12, happy: 8, money: 600 }, mood: 'happy' },
      { label: { fr: 'La vendre à un aquarium', en: 'Sell her to an aquarium' }, text: { fr: "J'ai vendu la sirène à un aquarium pour {$amount}. Elle a mordu le directeur le premier jour et s'est échappée par les égouts. Les poissons du quartier ne me saluent plus.", en: "I sold the mermaid to an aquarium for {$amount}. She bit the director on day one and escaped through the sewers. The local fish don't say hi anymore." }, fx: { money: 'amount', karma: -18 } },
      { label: { fr: 'Demander son numéro', en: 'Ask for her number' }, if: { age: [18, 120] }, text: { fr: "J'ai demandé son numéro à la sirène. Elle m'a donné un coquillage en disant « appelle-moi ». J'appelle tous les soirs. J'entends juste la mer.", en: "I asked the mermaid for her number. She handed me a shell and said 'call me'. I call every night. I just hear the ocean." }, fx: { happy: 3, looks: 2 } },
      { label: { fr: 'Prendre un selfie', en: 'Take a selfie' }, text: { fr: "J'ai pris un selfie avec la sirène. Elle a fait un doigt d'honneur avec sa nageoire. Les gens pensent que c'est un montage.", en: "I took a selfie with the mermaid. She flipped me off with her fin. People think it's photoshopped." }, fx: { followers: 3000, happy: 4 } },
    ],
  },

  // ── Œuf de dragon → dragon adulte (légendaire) ──
  {
    id: 'wd_dragon_egg',
    icon: '🥚',
    cat: 'weird',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'egg' },
    when: { age: [8, 85], noFlag: 'wd_dragon' },
    weight: 1,
    once: true,
    text: {
      fr: ["Tu as acheté un « gros caillou décoratif » à 2 € sur une brocante. Cette nuit, le caillou a craqué. Un petit dragon écarlate te regarde en éternuant des étincelles.", "L'œuf que tu croyais en marbre est tiède. Il bouge. Il vient de cracher une flammèche qui a fait fondre la télécommande."],
      en: ["You bought a 'big decorative rock' for two bucks at a flea market. Last night, the rock cracked. A tiny scarlet dragon is looking at you, sneezing sparks.", "The egg you thought was marble is warm. It's moving. It just spat a little flame that melted the remote."],
    },
    choices: [
      { label: { fr: 'Élever le dragon', en: 'Raise the dragon' }, text: { fr: "J'ai appelé mon dragon Brindille. Il dort dans le four, mange du charbon de barbecue et a déjà brûlé deux rideaux. C'est le meilleur jour de ma vie.", en: "I named my dragon Twiggy. It sleeps in the oven, eats barbecue charcoal and has already burned two curtains. Best day of my life." }, fx: { happy: 15, newNpc: { role: 'pet', species: 'dragon', age: [0, 0], abs: true }, flag: 'wd_dragon', schedule: { key: 'wd_dragon_grown', years: 4 } }, mood: 'happy' },
      { label: { fr: 'Le vendre en ligne', en: 'Sell it online' }, text: { fr: "J'ai mis le bébé dragon en vente sur Leboncoin. Un monsieur en cape l'a acheté 15 000 € sans négocier. Il a payé en pièces d'or. Je n'ose pas les dépenser.", en: "I listed the baby dragon online. A man in a cape bought it for fifteen grand without haggling. He paid in gold coins. I'm afraid to spend them." }, fx: { money: 15000, karma: -6 } },
      { label: { fr: 'Le rendre à la nature', en: 'Release it' }, text: { fr: "J'ai relâché le dragon en forêt. Il s'est retourné, m'a fait un clin d'œil et a brûlé un panneau « Chasse interdite ». J'ai pleuré un peu.", en: "I released the dragon into the forest. It turned around, winked, and torched a 'No Hunting' sign. I cried a little." }, fx: { karma: 10, happy: -2 }, mood: 'cry' },
    ],
  },
  {
    id: 'wd_dragon_grown',
    icon: '🐉',
    cat: 'weird',
    rating: 0,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock', prop: 'dragon', fx: 'fire' },
    text: {
      fr: ["Brindille, ton dragon, fait maintenant la taille d'un bus scolaire. Ce matin, il a éternué : la haie du voisin n'existe plus, la voiture du voisin non plus. Le voisin, si, mais sans sourcils.", "Ton dragon ne rentre plus dans la maison. Il dort sur le toit, ce qui l'a un peu enfoncé. La mairie t'envoie un courrier très sévère."],
      en: ["Twiggy, your dragon, is now the size of a school bus. This morning it sneezed: the neighbor's hedge no longer exists, nor does the neighbor's car. The neighbor does, minus eyebrows.", "Your dragon doesn't fit in the house anymore. It sleeps on the roof, which has caved in a bit. City hall has sent you a very stern letter."],
    },
    choices: [
      { label: { fr: 'Le chevaucher', en: 'Ride it' }, text: { fr: "Je vais au travail à dos de dragon. Les bouchons ne sont plus un problème. Les radars automatiques fondent sur mon passage.", en: "I commute by dragon now. Traffic jams are no longer a problem. Speed cameras melt as I fly by." }, fx: { fame: 15, followers: 150000, happy: 12 }, mood: 'proud' },
      { label: { fr: 'Le libérer', en: 'Set it free' }, text: { fr: "J'ai emmené Brindille dans les montagnes. Il a hésité, puis il s'est envolé. Chaque hiver, il passe allumer mon barbecue.", en: "I took Twiggy to the mountains. It hesitated, then flew off. Every winter, it swings by to light my barbecue." }, fx: { karma: 10, happy: -4, unflag: 'wd_dragon' }, mood: 'cry' },
      { label: { fr: 'Devenir seigneur féodal', en: 'Become a feudal lord' }, text: { fr: "Avec un dragon, on négocie très bien. J'ai réclamé un impôt en fromage à tout le quartier. Personne n'a protesté. Deux fois.", en: "With a dragon, you negotiate very well. I demanded a cheese tax from the whole neighborhood. Nobody protested. Twice." }, fx: { money: 5000, karma: -12, fame: 8 } },
    ],
  },

  // ── Auto (journal) rating 0 ──
  {
    id: 'wd_auto_sock',
    icon: '🧦',
    cat: 'weird',
    rating: 0,
    auto: true,
    when: { age: [6, 90] },
    weight: 4,
    cooldown: 12,
    text: {
      fr: ["Une des chaussettes que j'avais perdues en 2014 est réapparue dans la machine. Bronzée, avec une carte postale d'une dimension parallèle.", "J'ai enfin découvert où vont les chaussettes perdues : derrière le sèche-linge, il y a un petit trou noir. Il m'a rendu un caleçon qui n'est pas à moi.", "Ma machine à laver a avalé une chaussette et m'a rendu {w:object} à la place. Ce n'est pas à moi. Ça dégage {w:smell}.", "J'ai retrouvé une chaussette disparue depuis des années, coincée sous {w:object}. Elle avait l'air [[plus sage|reposée|changée]]. Elle n'a rien voulu raconter.", "Théorie personnelle : les chaussettes perdues partent refaire leur vie {w:far_place}. J'en ai reconnu une sur une carte postale. Elle était [[bronzée|heureuse|avec une autre chaussette]]."],
      en: ["One of the socks I lost in 2014 reappeared in the washing machine. Tanned, with a postcard from a parallel dimension.", "I finally found where lost socks go: behind the dryer there's a tiny black hole. It gave me back underwear that isn't mine.", "My washing machine swallowed a sock and gave me back {w:object} instead. It isn't mine. It gives off {w:smell}.", "I found a sock that had been missing for years, wedged under {w:object}. It looked [[older and wiser|well rested|different somehow]]. It refused to talk about it.", "Personal theory: lost socks run off to start a new life {w:far_place}. I recognized one on a postcard. It was [[tanned|happy|with another sock]]."],
    },
    fx: { happy: 2 },
  },
  {
    id: 'wd_auto_ghost_bed',
    icon: '👻',
    cat: 'weird',
    rating: 0,
    auto: true,
    scene: { fx: 'ghost' },
    when: { age: [4, 11] },
    weight: 4,
    once: true,
    text: {
      fr: ["Le fantôme qui vit sous mon lit m'a demandé de laisser la veilleuse allumée. Il a peur du noir.", "J'ai enfin vu le monstre de mon placard. C'est un petit fantôme timide qui collectionne mes dessins. Il dit qu'ils sont très bons."],
      en: ["The ghost living under my bed asked me to leave the nightlight on. He's afraid of the dark.", "I finally saw the monster in my closet. It's a shy little ghost who collects my drawings. He says they're very good."],
    },
    fx: { happy: 3 },
  },
  {
    id: 'wd_auto_reincarnation',
    icon: '♻️',
    cat: 'weird',
    rating: 0,
    auto: true,
    when: { age: [3, 7] },
    weight: 3,
    once: true,
    text: {
      fr: ["J'ai raconté à table ma vie d'avant, quand j'étais {boulanger|boulangère} en Flandre au XIVᵉ siècle. Mes parents ont vérifié : la boulangerie existait.", "J'ai expliqué très calmement à ma maîtresse que dans ma vie précédente, j'étais une huître. Elle a appelé mes parents. Je maintiens."],
      en: ["At dinner, I described my past life as a 14th-century baker in Flanders. My parents checked: the bakery existed.", "I calmly explained to my teacher that in my previous life, I was an oyster. She called my parents. I stand by it."],
    },
    fx: { smarts: 2 },
  },

  // ═════════════════════════════ RATING 1 — adulte ═════════════════════════════

  // ── Devenir un mème ──
  {
    id: 'wd_meme',
    icon: '😂',
    cat: 'weird',
    rating: 1,
    vars: { amount: [500, 6000] },
    scene: { place: 'home', mood: 'shock', prop: 'phone' },
    when: { age: [13, 85] },
    weight: 4,
    once: true,
    text: {
      fr: ["Une photo de toi en train de te prendre une porte vitrée est devenue virale. Tu es partout. Ton visage écrasé illustre désormais le mot « lundi » dans 40 langues.", "Quelqu'un a filmé ta tête quand tu as goûté un citron entier. 30 millions de vues. Ta grand-mère t'a envoyé le mème sans savoir que c'était toi."],
      en: ["A photo of you walking into a glass door went viral. You're everywhere. Your squashed face now illustrates the word 'Monday' in 40 languages.", "Someone filmed your face when you bit into a whole lemon. 30 million views. Your grandma sent you the meme without realizing it was you."],
    },
    choices: [
      { label: { fr: 'Assumer à fond', en: 'Lean into it' }, text: { fr: "J'ai assumé. Je fais des apparitions payées en boîte de nuit pour refaire ma tête. Un rappeur m'a cité{|e}. Je suis une personne célèbre, techniquement.", en: "I leaned into it. I get paid to make the face at nightclubs. A rapper name-dropped me. I'm technically famous." }, fx: { followers: 60000, fame: 12, happy: 6 }, mood: 'proud' },
      { label: { fr: 'Vendre des t-shirts', en: 'Sell merch' }, text: { fr: "J'ai vendu des t-shirts avec ma propre tête dessus. {$amount} de bénéfice. Je dors dans un tas d'invendus taille XXS.", en: "I sold T-shirts with my own face on them. {$amount} profit. I sleep on a pile of unsold XXS shirts." }, fx: { money: 'amount', fame: 5 } },
      { label: { fr: 'Porter plainte contre Internet', en: 'Sue the internet' }, text: { fr: "J'ai porté plainte contre « Internet ». L'avocat m'a facturé trois heures pour me dire que c'était pas possible. Et ma plainte est devenue un deuxième mème, putain.", en: "I tried to sue 'the internet'. The lawyer billed me three hours to say that's not a thing. And my lawsuit became a second meme, goddammit." }, fx: { money: -800, happy: -8, fame: 4 }, mood: 'angry' },
    ],
  },

  // ── Concours de hot-dogs ──
  {
    id: 'wd_hotdog_contest',
    icon: '🌭',
    cat: 'weird',
    rating: 1,
    scene: { place: 'stadium', mood: 'party', prop: 'hotdog' },
    when: { age: [16, 70] },
    weight: 5,
    cooldown: 8,
    text: {
      fr: ["Le concours annuel de mangeurs de hot-dogs de {city} cherche un remplaçant de dernière minute. Le champion en titre a fait un malaise en s'échauffant. Avec une saucisse.", "Une pancarte : « 10 minutes, hot-dogs illimités, 5 000 $ pour le vainqueur. » Ton estomac et ton compte en banque se regardent."],
      en: ["{city}'s annual hot dog eating contest needs a last-minute replacement. The reigning champ passed out while warming up. With a sausage.", "A sign: '10 minutes, unlimited hot dogs, $5,000 to the winner.' Your stomach and your bank account exchange a look."],
    },
    choices: [
      {
        label: { fr: 'Tout donner', en: 'Go all in' },
        out: [
          { w: 2, odds: { athletic: 0.5, discipline: 0.5 }, text: { fr: "J'ai englouti 63 hot-dogs en dix minutes. J'ai gagné, soulevé le trophée, puis vomi sur le jury dans un geste magnifique. Les gens ont applaudi quand même.", en: "I wolfed down 63 hot dogs in ten minutes. I won, lifted the trophy, then puked on the judges in one magnificent arc. People still cheered." }, fx: { money: 5000, fame: 10, weight: 0.05, health: -6 }, mood: 'proud' },
          { w: 2, text: { fr: "Au quatorzième hot-dog, j'ai vu ma vie défiler. Au quinzième, j'ai vu ma grand-mère décédée qui me disait « mâche ». J'ai fini à l'hôpital, avec une médaille en chocolat.", en: "At hot dog fourteen, I saw my life flash before my eyes. At fifteen, I saw my dead grandma telling me to 'chew'. I ended up in the hospital, with a chocolate medal." }, fx: { health: -10, disease: 'food_poisoning', happy: -4 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Y aller mollo', en: 'Pace myself' }, text: { fr: "J'ai mangé onze hot-dogs avec dignité, en m'essuyant la bouche entre chaque. {Dernier|Dernière}, mais {le seul|la seule} à repartir sans honte.", en: "I ate eleven hot dogs with dignity, dabbing my mouth between each one. Dead last, but the only one leaving without shame." }, fx: { happy: 3, weight: 0.02 } },
      { label: { fr: 'Encourager depuis les gradins', en: 'Cheer from the stands' }, text: { fr: "J'ai regardé depuis le premier rang. J'ai pris une gerbe de moutarde régurgitée en pleine figure. Mon sweat blanc est mort pour rien.", en: "I watched from the front row. I took a jet of regurgitated mustard straight to the face. My white hoodie died for nothing." }, fx: { happy: -3, looks: -2 } },
    ],
  },

  // ── Maison hantée ──
  {
    id: 'wd_haunted_house',
    icon: '🏚️',
    cat: 'weird',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'candle', fx: 'ghost' },
    when: { age: [18, 85], movedOut: true },
    weight: 4,
    cooldown: 12,
    text: {
      fr: ["Ton logement est hanté. Le fantôme d'un comptable de 1923 réorganise tes petites cuillères par ordre de taille et soupire très fort quand tu fais tes impôts.", "Chaque nuit à 3 h 12, une voix d'outre-tombe chuchote « Le lave-vaisselle est mal rempli ». Ton logement est hanté. Par un perfectionniste."],
      en: ["Your place is haunted. The ghost of a 1923 accountant rearranges your teaspoons by size and sighs loudly when you do your taxes.", "Every night at 3:12 a.m., a voice from beyond whispers 'The dishwasher is loaded wrong.' Your place is haunted. By a perfectionist."],
    },
    choices: [
      {
        label: { fr: 'Appeler un exorciste', en: 'Call an exorcist' },
        out: [
          { w: 1, text: { fr: "L'exorciste a aspergé l'appart d'eau bénite, hurlé en latin et facturé 900 €. Le fantôme est parti. Mon parquet aussi : il a gonflé.", en: "The exorcist sprayed holy water everywhere, screamed in Latin and charged me $900. The ghost left. So did my floorboards: they warped." }, fx: { money: -900, stress: -8 } },
          { w: 1, text: { fr: "L'exorciste et le fantôme se sont reconnus : ils étaient au lycée ensemble. Ils ont bu un coup dans ma cuisine jusqu'à 4 h. Personne n'est parti.", en: "The exorcist and the ghost recognized each other: they went to high school together. They had drinks in my kitchen until 4 a.m. Nobody left." }, fx: { money: -400, happy: 3, stress: 4 } },
        ],
      },
      { label: { fr: 'Lui faire payer un loyer', en: 'Make it pay rent' }, text: { fr: "J'ai négocié avec le fantôme : il paie la moitié du loyer en pièces anciennes trouvées dans les murs. Un numismate m'en a donné une fortune. Meilleur coloc ever.", en: "I negotiated with the ghost: it pays half the rent in antique coins it finds in the walls. A coin dealer paid me a fortune. Best roommate ever." }, fx: { money: 3000, happy: 8 }, mood: 'happy' },
      { label: { fr: 'Soirée Ouija', en: 'Ouija party' }, text: { fr: "J'ai organisé une soirée Ouija bien arrosée. Le fantôme a épelé « VOUS ÊTES TOUS NULS AU LIT ». Trois couples se sont séparés. La meilleure soirée de l'année.", en: "I threw a boozy Ouija party. The ghost spelled out 'YOU ARE ALL BAD IN BED'. Three couples broke up. Best party of the year." }, fx: { happy: 10, stress: 3 }, mood: 'party' },
    ],
  },

  // ── Malédiction → levée de malédiction ──
  {
    id: 'wd_curse',
    icon: '🧙',
    cat: 'weird',
    rating: 1,
    scene: { place: 'park', mood: 'shock', prop: 'broom' },
    when: { age: [16, 85], noFlag: 'wd_cursed' },
    weight: 4,
    once: true,
    text: {
      fr: ["Tu viens de piquer la place de parking d'une vieille dame en cape. Elle pointe un doigt crochu vers toi : « Que chaque chanson coincée dans ta tête soit la Macarena, jusqu'à la fin de tes jours ! »", "Une sorcière au marché t'accuse d'avoir tâté ses avocats sans les acheter. Elle crache par terre et commence à marmonner en latin de cuisine."],
      en: ["You just stole a parking spot from an old lady in a cape. She points a gnarled finger at you: 'May every song stuck in your head be the Macarena, until the end of your days!'", "A witch at the market accuses you of squeezing her avocados without buying any. She spits on the ground and starts mumbling in kitchen Latin."],
    },
    choices: [
      { label: { fr: "M'excuser platement", en: 'Grovel' }, text: { fr: "Je me suis excusé{|e} à genoux et lui ai acheté tous ses avocats. Elle a annulé le sort, puis m'a donné sa recette de guacamole. Elle est incroyable.", en: "I apologized on my knees and bought all her avocados. She cancelled the curse, then gave me her guacamole recipe. It's incredible." }, fx: { money: -60, karma: 5, happy: 3 } },
      { label: { fr: "L'envoyer chier", en: 'Tell her to piss off' }, text: { fr: "Je lui ai dit d'aller se faire foutre. Depuis, la Macarena tourne en boucle dans ma tête, le lait tourne quand je le regarde et les pigeons me visent. Je suis maudit{|e}.", en: "I told her to go to hell. Since then, the Macarena loops in my head, milk curdles when I look at it and pigeons aim for me. I'm cursed." }, fx: { happy: -10, stress: 10, flag: 'wd_cursed' }, mood: 'angry' },
      { label: { fr: 'La maudire en retour', en: 'Curse her back' }, text: { fr: "Je l'ai maudite en retour avec des mots inventés. Coup de bol : ça a marché. Elle a des hoquets depuis trois jours. Moi aussi, je suis maudit{|e}, mais c'est match nul.", en: "I cursed her back with made-up words. By sheer luck, it worked. She's had hiccups for three days. I'm cursed too, but it's a draw." }, fx: { happy: 2, karma: -4, flag: 'wd_cursed' } },
    ],
  },
  {
    id: 'wd_curse_lift',
    icon: '🔮',
    cat: 'weird',
    rating: 1,
    scene: { place: 'apartment', mood: 'neutral', prop: 'crystal' },
    when: { flag: 'wd_cursed' },
    weight: 8,
    cooldown: 2,
    text: {
      fr: ["Ta malédiction te pourrit la vie : ton café est toujours tiède et ton GPS t'envoie dans des lacs. Madame Irma, « voyante diplômée », propose de la lever pour 500 €. Carte bleue acceptée.", "Un flyer dans ta boîte aux lettres : « Professeur Gontran, retour de l'être aimé, levée de malédictions, réparation de grille-pain. » Tu es maudit{|e} depuis trop longtemps."],
      en: ["Your curse is ruining your life: your coffee is always lukewarm and your GPS sends you into lakes. Madame Irma, 'certified psychic', offers to lift it for $500. Cards accepted.", "A flyer in your mailbox: 'Professor Gontran: return of lost love, curse removal, toaster repair.' You've been cursed for too long."],
    },
    choices: [
      {
        label: { fr: 'Payer la voyante', en: 'Pay the psychic' },
        out: [
          { w: 2, text: { fr: "La voyante a brûlé de la sauge, cassé un œuf sur ma tête et crié « VA-T'EN ». La malédiction est partie. Mes cheveux sentent l'omelette depuis.", en: "The psychic burned sage, cracked an egg on my head and yelled 'BEGONE'. The curse is gone. My hair has smelled like omelet ever since." }, fx: { money: -500, happy: 10, stress: -10, unflag: 'wd_cursed' }, mood: 'happy' },
          { w: 1, text: { fr: "La voyante a pris mes 500 €, m'a dit « c'est fait » et a disparu. La Macarena joue toujours dans ma tête. Plus fort.", en: "The psychic took my $500, said 'it is done' and vanished. The Macarena is still playing in my head. Louder." }, fx: { money: -500, happy: -6, stress: 5 }, mood: 'angry' },
        ],
      },
      {
        label: { fr: 'Rituel maison', en: 'DIY ritual' },
        out: [
          { w: 1, text: { fr: "J'ai suivi un tuto YouTube : bougies, sel, danse nue sous la pleine lune. Ça a marché. Les voisins, eux, ont filmé.", en: "I followed a YouTube tutorial: candles, salt, naked dancing under the full moon. It worked. The neighbors filmed it." }, fx: { happy: 6, fame: 2, unflag: 'wd_cursed' } },
          { w: 1, text: { fr: "Mon rituel maison a mis le feu aux rideaux. Les pompiers sont venus. La malédiction est restée, et maintenant j'ai une amende.", en: "My DIY ritual set the curtains on fire. The fire department came. The curse stayed, and now I also have a fine." }, fx: { money: -350, stress: 8, health: -3 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Vivre avec', en: 'Live with it' }, text: { fr: "J'ai décidé de vivre avec ma malédiction. Je danse la Macarena intérieurement toute la journée. J'ai fini par trouver ça entraînant. C'est ça, le vrai drame.", en: "I decided to live with my curse. I do the Macarena internally all day. I've started to find it catchy. That's the real tragedy." }, fx: { happy: -2, stress: -2 } },
    ],
  },

  // ── Le génie et ses trois vœux (chaîne en 3 étapes) ──
  {
    id: 'wd_genie',
    icon: '🧞',
    cat: 'weird',
    rating: 1,
    scene: { place: 'home', mood: 'shock', prop: 'lamp', fx: 'ghost' },
    when: { age: [18, 85] },
    weight: 1,
    once: true,
    text: {
      fr: ["Tu frottes une vieille lampe achetée 3 € dans un vide-grenier. Un génie bleu de trois mètres en jaillit, s'étire, fait craquer son dos : « Trois vœux. Pas de vœux en plus. Et je ne ressuscite personne, j'ai un mal de dos. »", "La lampe que tu nettoies se met à fumer. Un génie en sort, en peignoir, visiblement réveillé en pleine sieste de 400 ans. « Bon. Trois vœux. Grouille. »"],
      en: ["You rub an old lamp you bought for three bucks at a garage sale. A ten-foot blue genie bursts out, stretches, cracks his back: 'Three wishes. No extra wishes. And no resurrections, my back is killing me.'", "The lamp you're polishing starts smoking. A genie comes out in a bathrobe, clearly woken from a 400-year nap. 'Fine. Three wishes. Hurry up.'"],
    },
    choices: [
      {
        label: { fr: 'Être riche', en: 'Be rich' },
        out: [
          { w: 1, text: { fr: "« Être riche ! » Le génie a claqué des doigts : une valise d'un million de dollars zimbabwéens. Valeur réelle : 40 balles. Il a haussé les épaules : « Fallait préciser. »", en: "'Make me rich!' The genie snapped his fingers: a suitcase of a million Zimbabwean dollars. Real value: about forty bucks. He shrugged: 'Should've been specific.'" }, fx: { money: 40, happy: -3, chain: 'wd_genie_2' }, mood: 'angry' },
          { w: 1, text: { fr: "« Être riche ! » Une pluie de billets est tombée du plafond. Des vrais. J'ai passé la nuit à les ramasser en hurlant de joie.", en: "'Make me rich!' Banknotes rained from the ceiling. Real ones. I spent the night picking them up, screaming with joy." }, fx: { money: 75000, happy: 15, chain: 'wd_genie_2' }, mood: 'party' },
        ],
      },
      { label: { fr: 'Être canon', en: 'Be gorgeous' }, text: { fr: "« Rends-moi canon ! » Le génie m'a donné le visage de son idéal de beauté. Il est né en 1450 avant J.-C. J'ai un monosourcil magnifique et des hanches de déesse antique.", en: "'Make me hot!' The genie gave me his ideal of beauty. He was born in 1450 BC. I now have a gorgeous unibrow and the hips of an ancient goddess." }, fx: { looks: 20, happy: 5, chain: 'wd_genie_2' } },
      { label: { fr: 'Être un génie', en: 'Be a genius' }, text: { fr: "« Rends-moi intelligent{|e} ! » En une seconde, j'ai tout compris : la physique quantique, les impôts, et à quel point le monde est foutu. Je ne souris plus.", en: "'Make me smart!' In one second, I understood everything: quantum physics, taxes, and exactly how screwed the world is. I no longer smile." }, fx: { smarts: 25, happy: -6, chain: 'wd_genie_2' } },
      { label: { fr: 'Vendre la lampe', en: 'Sell the lamp' }, text: { fr: "J'ai revendu la lampe 80 € sur Internet sans faire de vœu. Le génie m'a lancé un regard que je n'oublierai jamais.", en: "I sold the lamp online for 80 bucks without making a wish. The genie gave me a look I'll never forget." }, fx: { money: 80, karma: -2 } },
    ],
  },
  {
    id: 'wd_genie_2',
    icon: '🧞',
    cat: 'weird',
    rating: 1,
    chainOnly: true,
    scene: { place: 'home', mood: 'neutral', prop: 'lamp', fx: 'ghost' },
    text: {
      fr: ["Le génie lime ses ongles en flottant. « Deuxième vœu. Et évite l'amour, c'est toujours le bordel après. »", "« Vœu numéro deux », soupire le génie en regardant sa montre-soleil. « J'ai un autre client à 15 h, à Bagdad, en 1204. »"],
      en: ["The genie files his nails, floating. 'Second wish. And skip love, it's always a mess afterwards.'", "'Wish number two,' the genie sighs, checking his sundial watch. 'I have another client at 3 p.m., in Baghdad, in 1204.'"],
    },
    choices: [
      { label: { fr: "Le grand amour", en: 'True love' }, text: { fr: "J'ai souhaité le grand amour. Une personne parfaite a sonné à ma porte dans la seconde, un bouquet à la main, persuadée de me connaître depuis toujours. C'est flippant et merveilleux.", en: "I wished for true love. A perfect person rang my doorbell that second, flowers in hand, convinced they'd known me forever. It's creepy and wonderful." }, fx: { happy: 12, newNpc: { role: 'partner', age: [-3, 3], gender: 'attracted' }, chain: 'wd_genie_3' }, mood: 'love' },
      { label: { fr: 'La célébrité', en: 'Fame' }, text: { fr: "J'ai souhaité être célèbre. Le lendemain, tout le monde connaissait mon nom. Pour une vidéo de moi en train de souhaiter être célèbre à un génie. Ça compte.", en: "I wished to be famous. The next day, everyone knew my name. From a video of me wishing to be famous to a genie. It counts." }, fx: { fame: 30, followers: 400000, chain: 'wd_genie_3' }, mood: 'proud' },
      { label: { fr: 'Une santé de fer', en: 'Perfect health' }, text: { fr: "J'ai souhaité une santé parfaite. Mes bobos ont disparu, ma vue est revenue, et j'ai désormais un foie capable de digérer un pneu.", en: "I wished for perfect health. My aches vanished, my eyesight came back, and I now have a liver that could digest a tire." }, fx: { health: 30, cure: true, chain: 'wd_genie_3' } },
    ],
  },
  {
    id: 'wd_genie_3',
    icon: '🧞',
    cat: 'weird',
    rating: 1,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock', prop: 'lamp', fx: 'ghost' },
    text: {
      fr: ["« Dernier vœu », dit le génie, déjà à moitié rentré dans sa lampe. « Réfléchis bien. Le dernier type a demandé un sandwich. »", "Le génie croise les bras. « Troisième et dernier vœu. Et si tu demandes plus de vœux, je te transforme en tabouret. »"],
      en: ["'Last wish,' says the genie, already halfway back into his lamp. 'Think carefully. The last guy asked for a sandwich.'", "The genie crosses his arms. 'Third and final wish. And if you ask for more wishes, I'm turning you into a stool.'"],
    },
    choices: [
      { label: { fr: 'La paix dans le monde', en: 'World peace' }, text: { fr: "J'ai souhaité la paix dans le monde. Le génie a ri pendant cinq minutes, puis a accordé « la paix dans le monde le week-end prochain ». C'était un très bon week-end.", en: "I wished for world peace. The genie laughed for five minutes, then granted 'world peace next weekend'. It was a really nice weekend." }, fx: { karma: 15, happy: 6 } },
      { label: { fr: 'Libérer le génie', en: 'Free the genie' }, text: { fr: "J'ai rendu sa liberté au génie. Il a pleuré, m'a serré{|e} dans ses bras bleus et a ouvert un food-truck de falafels. Je mange gratos à vie.", en: "I set the genie free. He cried, hugged me with his big blue arms and opened a falafel truck. I eat free for life." }, fx: { karma: 25, happy: 12, newNpc: { role: 'friend', age: [30, 50], abs: true, gender: 'm' } }, mood: 'cry' },
      {
        label: { fr: 'Plus de vœux', en: 'More wishes' },
        out: [
          { w: 2, text: { fr: "J'ai demandé plus de vœux. Le génie m'a mis une gifle cosmique qui m'a fait faire trois tours sur moi-même, puis il a disparu. J'entends encore des cloches.", en: "I asked for more wishes. The genie gave me a cosmic slap that spun me around three times, then vanished. I can still hear bells." }, fx: { health: -12, smarts: -4, disease: 'concussion' }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai demandé plus de vœux. Le génie a souri. Il m'a transformé{|e} en génie et m'a enfermé{|e} dans la lampe. Il fait noir, ça sent le vieux tapis, et j'attends que quelqu'un me frotte.", en: "I asked for more wishes. The genie smiled. He turned me into a genie and locked me in the lamp. It's dark, it smells like old carpet, and I'm waiting for someone to rub me." }, fx: { die: { fr: "enfermé{|e} pour l'éternité dans une lampe à huile, pour avoir demandé plus de vœux", en: 'locked in an oil lamp for eternity for asking for more wishes' } } },
        ],
      },
    ],
  },

  // ── Voyage dans le temps ──
  {
    id: 'wd_time_travel',
    icon: '⏳',
    cat: 'chaos',
    rating: 1,
    scene: { place: 'home', mood: 'shock', prop: 'microwave', fx: 'explosion' },
    when: { age: [18, 85] },
    weight: 2,
    once: true,
    text: {
      fr: ["Ton micro-ondes a pris un coup de foudre. Depuis, l'écran affiche des dates au lieu des minutes. Tu as mis un gratin à réchauffer : il est revenu de 1987, avec une coupe mulet.", "En réchauffant des lasagnes, ton micro-ondes a ouvert une faille temporelle. Un toi du futur en sort, chauve, et te dit : « Pas le temps d'expliquer. Achète. Des. Bitcoins. »"],
      en: ["Your microwave got struck by lightning. Since then, the display shows years instead of minutes. You reheated a casserole: it came back from 1987, with a mullet.", "While reheating lasagna, your microwave opened a time rift. A future you steps out, bald, and says: 'No time to explain. Buy. Bitcoin.'"],
    },
    choices: [
      {
        label: { fr: 'Aller dans le passé', en: 'Go to the past' },
        out: [
          { w: 2, text: { fr: "Je suis allé{|e} en 2010 acheter des bitcoins avec mon argent de poche. Retour au présent : je suis riche. Ma conscience temporelle est un peu froissée.", en: "I went back to 2010 and bought bitcoin with my pocket money. Back to the present: I'm rich. The space-time continuum looks a bit wrinkled." }, fx: { money: 120000, happy: 15 }, mood: 'party' },
          { w: 1, text: { fr: "Dans le passé, j'ai renversé du café sur mon père le jour où il devait rencontrer ma mère. Je commence à devenir transparent{|e} sur les photos. Je me sens moins bien.", en: "In the past, I spilled coffee on my dad the day he was supposed to meet my mom. I'm starting to fade in photos. I don't feel great." }, fx: { health: -15, happy: -10, stress: 10 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Voir le futur', en: 'Visit the future' }, text: { fr: "J'ai vu le futur. Les voitures ne volent toujours pas, mais tout le monde a un abonnement pour respirer. J'ai aussi vu ma tombe. L'épitaphe est mal orthographiée.", en: "I saw the future. Cars still don't fly, but everyone pays a subscription to breathe. I also saw my grave. The epitaph is misspelled." }, fx: { smarts: 8, stress: 6, happy: -3 } },
      { label: { fr: 'Débrancher le micro-ondes', en: 'Unplug the microwave' }, text: { fr: "J'ai débranché le micro-ondes. Le moi du futur a disparu en hurlant « NOOON ». J'ai mangé les lasagnes froides. Pas de regrets.", en: "I unplugged the microwave. Future me vanished screaming 'NOOO'. I ate the lasagna cold. No regrets." }, fx: { stress: -3, happy: 2 } },
    ],
  },

  // ── Doppelgänger → retour du double ──
  {
    id: 'wd_doppelganger',
    icon: '👥',
    cat: 'weird',
    rating: 1,
    scene: { place: 'park', mood: 'shock', prop: 'mirror' },
    when: { age: [18, 70], noFlag: 'wd_double' },
    weight: 3,
    once: true,
    text: {
      fr: ["Dans le métro, tu croises quelqu'un qui est exactement toi. Même visage, même grain de beauté, même tache de café sur la chemise. Sauf qu'il a l'air plus heureux.", "Ton boulanger te dit : « Encore vous ? Vous êtes déjà venu{|e} il y a dix minutes. » Derrière la vitrine, tu te vois partir avec une baguette."],
      en: ["On the subway, you pass someone who is exactly you. Same face, same mole, same coffee stain on the shirt. Except they look happier.", "Your baker says: 'You again? You were just here ten minutes ago.' Through the window, you watch yourself walk off with a baguette."],
    },
    choices: [
      { label: { fr: 'Sympathiser', en: 'Befriend them' }, text: { fr: "J'ai pris un verre avec mon double. On a les mêmes blagues, les mêmes traumas et le même rire de phoque. On a échangé nos numéros. C'est le même, en fait.", en: "I had a drink with my double. Same jokes, same traumas, same seal laugh. We exchanged numbers. It's the same number, actually." }, fx: { happy: 6, flag: 'wd_double', schedule: { key: 'wd_double_return', years: 2 } } },
      { label: { fr: 'Échanger nos vies', en: 'Swap lives' }, text: { fr: "Mon double et moi avons échangé nos vies pendant une semaine. Il a été bien meilleur que moi dans la mienne. Ma famille me demande de le faire revenir.", en: "My double and I swapped lives for a week. They were much better at mine than I am. My family is asking me to bring them back." }, fx: { happy: -4, perf: 8, flag: 'wd_double', schedule: { key: 'wd_double_return', years: 2 } } },
      { label: { fr: 'Le frapper', en: 'Punch them' }, text: { fr: "J'ai foncé sur mon double pour lui mettre une droite. C'était un miroir. Celui de la boulangerie. Sept ans de malheur et des points de suture.", en: "I lunged at my double to punch them. It was a mirror. The bakery's. Seven years of bad luck and some stitches." }, fx: { health: -6, money: -200, happy: -5 }, mood: 'shock' },
    ],
  },
  {
    id: 'wd_double_return',
    icon: '🪞',
    cat: 'weird',
    rating: 1,
    chainOnly: true,
    scene: { place: 'court', mood: 'shock', prop: 'mirror', fx: 'police' },
    text: {
      fr: ["Ton double refait surface. En deux ans, il a ouvert trois crédits à ton nom, s'est fait tatouer ton prénom sur le front et a été élu délégué de ton immeuble.", "Ton doppelgänger est de retour, et il a fait des choses. La police te cherche pour un vol de flamants roses que « tu » as commis à Biarritz."],
      en: ["Your double resurfaces. In two years, they've opened three loans in your name, gotten your name tattooed on their forehead and been elected head of your building's tenants' association.", "Your doppelgänger is back, and they've been busy. The police want you for a flamingo theft 'you' committed in Miami."],
    },
    choices: [
      { label: { fr: "Tout lui mettre sur le dos", en: 'Blame the double' }, text: { fr: "J'ai expliqué au juge que c'était mon double maléfique. Il m'a regardé{|e} longtemps. Puis mon double a fait coucou depuis le fond de la salle. Acquitté{|e}.", en: "I told the judge it was my evil twin. He stared at me for a long time. Then my double waved from the back of the courtroom. Case dismissed." }, fx: { stress: -5, happy: 6, unflag: 'wd_double' } },
      { label: { fr: 'Payer ses dettes', en: 'Pay their debts' }, text: { fr: "J'ai remboursé les crédits de mon double. Il m'a envoyé une carte de remerciement signée de mon nom, avec mon écriture. Je dors avec la lumière allumée.", en: "I paid off my double's loans. They sent me a thank-you card signed with my name, in my handwriting. I sleep with the lights on." }, fx: { money: -4000, karma: 5, stress: 8, unflag: 'wd_double' } },
      {
        label: { fr: 'Partager la vie à deux', en: 'Share one life' },
        out: [
          { w: 1, text: { fr: "Mon double et moi, on se relaie : un jour sur deux, l'un va bosser et l'autre dort. Personne n'a rien remarqué. Je n'ai jamais été aussi reposé{|e}.", en: "My double and I take turns: every other day, one works and the other sleeps. Nobody noticed. I've never been so well-rested." }, fx: { happy: 10, stress: -12, health: 4 }, mood: 'happy' },
          { w: 1, text: { fr: "Mon double a commencé à sortir avec mon ex. Puis avec mon patron. Il a plus de vie sociale que moi, avec ma tête. J'ai la haine.", en: "My double started dating my ex. Then my boss. They have more of a social life than me, with my face. I'm furious." }, fx: { happy: -8, stress: 8 }, mood: 'angry' },
        ],
      },
    ],
  },

  // ── Coloc vampire ──
  {
    id: 'wd_vampire_roommate',
    icon: '🧛',
    cat: 'weird',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'coffin' },
    when: { age: [18, 45], movedOut: true, noFlag: 'wd_vampire' },
    weight: 3,
    once: true,
    text: {
      fr: ["Ton nouveau coloc dort dans un cercueil Ikea, ne mange jamais, refuse le pesto et range des poches de « jus de tomate » dans le frigo. Il a 600 ans sur sa pièce d'identité.", "Ton coloc Vladislav ne sort que la nuit, n'apparaît pas sur les selfies et a mordu le livreur Deliveroo. Il dit que c'était « un câlin culturel »."],
      en: ["Your new roommate sleeps in an IKEA coffin, never eats, refuses pesto and keeps bags of 'tomato juice' in the fridge. His ID says he's 600 years old.", "Your roommate Vladislav only goes out at night, doesn't show up in selfies and bit the DoorDash guy. He says it was 'a cultural hug'."],
    },
    choices: [
      { label: { fr: 'Risotto à l\'ail', en: 'Garlic risotto night' }, text: { fr: "J'ai fait un risotto triple ail. Vladislav s'est enfermé dans sa chambre en hurlant en roumain. Il paie désormais son loyer en avance et me vouvoie.", en: "I made a triple-garlic risotto. Vladislav locked himself in his room screaming in Romanian. He now pays rent in advance and calls me 'sir'." }, fx: { happy: 6, money: 800 } },
      { label: { fr: 'Me faire mordre', en: 'Ask to be bitten' }, text: { fr: "J'ai demandé à Vladislav de me transformer. Il a soupiré, puis m'a mordu{|e}. Je ne vieillis plus, j'ai une peau parfaite et je ne peux plus aller à la plage. Ni à une messe.", en: "I asked Vladislav to turn me. He sighed, then bit me. I've stopped aging, my skin is flawless and I can never go to the beach again. Or to church." }, fx: { looks: 15, health: 12, happy: 4, flag: 'wd_vampire' }, mood: 'shock' },
      { label: { fr: 'Fixer des règles', en: 'Set house rules' }, text: { fr: "On a fait un tableau des règles : pas de chauve-souris dans le salon, pas de morsures avant 23 h, et c'est lui qui sort les poubelles (il aime la nuit). Coloc parfaite.", en: "We made a chore chart: no bats in the living room, no biting before 11 p.m., and he takes out the trash (he loves the night). Perfect roommate." }, fx: { happy: 8, stress: -4 } },
      { label: { fr: 'Déménager en courant', en: 'Move out screaming' }, text: { fr: "J'ai déménagé en pleine nuit avec mes affaires dans des sacs-poubelle. Vladislav m'a fait coucou depuis la fenêtre. La fenêtre du 6ᵉ. De l'extérieur.", en: "I moved out in the middle of the night with my stuff in trash bags. Vladislav waved goodbye from the window. The sixth-floor window. From outside." }, fx: { money: -1200, stress: 6 } },
    ],
  },

  // ── Elvis est vivant ──
  {
    id: 'wd_elvis',
    icon: '🕺',
    cat: 'weird',
    rating: 1,
    scene: { place: 'party', mood: 'shock', prop: 'microphone' },
    when: { age: [20, 90] },
    weight: 2,
    once: true,
    text: {
      fr: ["Le type qui te sert un kebab à {city} a des rouflaquettes, une banane parfaite et dit « Merci beaucoup » d'une voix grave. C'est Elvis. Il a 90 ans et une sacrée forme.", "Dans une station-service paumée, le caissier se déhanche en encaissant ton plein. Son badge dit « Aaron ». Ses yeux disent « The King »."],
      en: ["The guy serving you a kebab in {city} has sideburns, a perfect pompadour and says 'Thank you very much' in a deep voice. It's Elvis. He's 90 and in great shape.", "At a gas station in the middle of nowhere, the cashier swivels his hips while ringing you up. His badge says 'Aaron'. His eyes say 'The King'."],
    },
    choices: [
      { label: { fr: 'Prendre un selfie', en: 'Get a selfie' }, text: { fr: "J'ai pris un selfie avec Elvis. Sur la photo, il n'y a que moi et un rideau de franges. Personne ne me croit. Je m'en fous.", en: "I took a selfie with Elvis. In the photo, it's just me and a fringe curtain. Nobody believes me. I don't care." }, fx: { happy: 8 } },
      { label: { fr: 'Chanter en duo', en: 'Sing a duet' }, text: { fr: "On a chanté Suspicious Minds en duo, au milieu des frites. Les clients ont pleuré. Le patron nous a virés tous les deux. Le meilleur soir de ma vie.", en: "We sang Suspicious Minds together, among the fries. Customers cried. The boss fired us both. Best night of my life." }, fx: { happy: 14, fame: 4 }, mood: 'party' },
      { label: { fr: 'Garder son secret', en: 'Keep his secret' }, text: { fr: "J'ai juré à Elvis de ne rien dire. Il m'a offert un sandwich banane-beurre de cacahuète-bacon. J'ai pris trois kilos et un ami pour la vie.", en: "I swore to Elvis I'd never tell. He made me a peanut butter, banana and bacon sandwich. I gained five pounds and a friend for life." }, fx: { karma: 8, happy: 6, weight: 0.02 } },
    ],
  },

  // ── Super-pouvoir inutile ──
  {
    id: 'wd_useless_power',
    icon: '🦸',
    cat: 'weird',
    rating: 1,
    scene: { place: 'home', mood: 'proud', prop: 'cape' },
    when: { age: [13, 85] },
    weight: 4,
    once: true,
    text: {
      fr: ["Tu t'es réveillé{|e} avec un super-pouvoir : [[tu deviens invisible, mais seulement quand personne ne te regarde|tu peux parler aux poissons, mais seulement quand ils sont panés|tu prédis la météo avec une précision parfaite. Celle d'hier|ta télékinésie ne fonctionne que sur les moutons de poussière]].", "Tu viens de découvrir ton super-pouvoir : [[tu peux faire léviter les objets de moins de deux grammes|tu sais exactement l'heure, en permanence, et ça t'empêche de dormir|tu comprends les pigeons, et ce sont tous des connards|tu peux changer la couleur de tes ongles de pied par la pensée]]."],
      en: ["You woke up with a superpower: [[you turn invisible, but only when nobody is looking|you can talk to fish, but only breaded ones|you predict the weather with perfect accuracy. Yesterday's|your telekinesis only works on dust bunnies]].", "You just discovered your superpower: [[you can levitate objects under two grams|you always know the exact time, constantly, and it keeps you up at night|you understand pigeons, and they're all assholes|you can change your toenail color with your mind]]."],
    },
    choices: [
      { label: { fr: 'Devenir super-héros', en: 'Become a superhero' }, text: { fr: "J'ai cousu un costume et patrouillé en ville. Mon seul sauvetage : un chat dans un arbre, qui est descendu tout seul pendant que je grimpais. Je me suis cassé le bras.", en: "I sewed a costume and patrolled the city. My only rescue: a cat in a tree, who climbed down on its own while I was climbing up. I broke my arm." }, fx: { fame: 3, disease: 'broken_arm', happy: -2 } },
      { label: { fr: 'Faire des vidéos', en: 'Make videos' }, text: { fr: "J'ai posté des vidéos de mon pouvoir. Les commentaires : « fake », « nul », « mon cousin fait pareil ». 40 000 abonnés quand même. Les gens aiment la médiocrité.", en: "I posted videos of my power. Comments: 'fake', 'lame', 'my cousin can do that'. 40,000 followers anyway. People love mediocrity." }, fx: { followers: 40000, fame: 4, happy: 4 } },
      { label: { fr: 'Le cacher', en: 'Hide it' }, text: { fr: "Je n'ai rien dit à personne. Parfois, seul{|e} le soir, j'utilise mon pouvoir. Ça ne sert absolument à rien, et c'est mon petit secret.", en: "I told no one. Sometimes, alone at night, I use my power. It's completely useless, and it's my little secret." }, fx: { happy: 4, stress: -3 } },
    ],
  },

  // ── Réveil dans un autre pays ──
  {
    id: 'wd_waking_abroad',
    icon: '🌍',
    cat: 'weird',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'passport' },
    when: { age: [18, 65] },
    weight: 3,
    cooldown: 15,
    text: {
      fr: ["Tu te réveilles à Oulan-Bator, en costume de mascotte de poulet, avec un tatouage de chèvre sur la fesse et un mal de crâne du tonnerre. Le dernier souvenir : un shot « offert par la maison » à {city}.", "Tu ouvres les yeux dans une yourte en Mongolie. Un homme te tend du thé au beurre en t'appelant « {le marié|la mariée} ». Ton téléphone affiche 47 appels manqués de ta mère."],
      en: ["You wake up in Ulaanbaatar in a chicken mascot costume, with a goat tattooed on your butt and a skull-splitting headache. Last memory: a 'free shot from the house' in {city}.", "You open your eyes in a yurt in Mongolia. A man hands you butter tea and calls you '{the groom|the bride}'. Your phone shows 47 missed calls from your mom."],
    },
    choices: [
      { label: { fr: "Appeler l'ambassade", en: 'Call the embassy' }, text: { fr: "L'ambassade m'a rapatrié{|e} en trois jours. Le fonctionnaire a dit « encore un ». J'ai reçu la facture du vol. Et celle du costume de poulet.", en: "The embassy flew me home in three days. The official said 'another one'. I got the bill for the flight. And for the chicken costume." }, fx: { money: -1800, stress: 6, happy: -4 } },
      {
        label: { fr: 'Reconstituer la soirée', en: 'Retrace the night' },
        out: [
          { w: 1, text: { fr: "En remontant la piste, j'ai découvert que j'avais gagné un concours de lancer de yak et acheté un cheval. Le cheval m'attend. Il s'appelle Kévin.", en: "Retracing the night, I learned I won a yak-throwing contest and bought a horse. The horse is waiting for me. His name is Kevin." }, fx: { happy: 8, fame: 3, money: -500 } },
          { w: 1, text: { fr: "J'ai reconstitué la soirée grâce aux vidéos sur mon téléphone. Je les ai supprimées. Toutes. Puis j'ai jeté le téléphone dans un lac.", en: "I reconstructed the night from the videos on my phone. I deleted them. All of them. Then I threw the phone in a lake." }, fx: { happy: -6, stress: 8, money: -700 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Refaire ma vie ici', en: 'Start a new life here' }, text: { fr: "J'ai décidé de rester un an. J'ai appris à traire une jument, à chanter de la gorge et à ne plus répondre à ma mère. J'ai jamais été aussi serein{|e}.", en: "I decided to stay a year. I learned to milk a mare, throat-sing and stop answering my mom. Never been so zen." }, fx: { happy: 12, stress: -15, athletic: 6 }, mood: 'happy' },
    ],
  },

  // ── Auto rating 1 ──
  {
    id: 'wd_auto_psychic',
    icon: '🔮',
    cat: 'weird',
    rating: 1,
    auto: true,
    when: { age: [18, 90] },
    weight: 4,
    cooldown: 10,
    text: {
      fr: ["Une voyante m'avait prédit « la rencontre d'un grand brun ténébreux ». C'était l'huissier. Il est reparti avec ma télé.", "J'ai payé 60 € une voyante pour connaître mon avenir. Elle a regardé sa boule de cristal et m'a dit « vous allez perdre 60 € ». Respect."],
      en: ["A psychic predicted I'd meet 'a tall, dark stranger'. It was the bailiff. He left with my TV.", "I paid a psychic $60 to see my future. She looked into her crystal ball and said 'you're going to lose $60'. Respect."],
    },
    fx: { money: -60, happy: -2 },
  },

  // ═════════════════════════════ RATING 2 — trash ═════════════════════════════

  // ── Enlèvement extraterrestre ──
  {
    id: 'wd_alien_abduction',
    icon: '👽',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'ufo', fx: 'ghost' },
    when: { age: [18, 85], noFlag: 'wd_abducted' },
    weight: 3,
    once: true,
    text: {
      fr: ["Une lumière aveuglante, un bruit de frigo géant, et te voilà nu{|e} sur une table en inox glacée. Trois petits gris s'approchent avec une sonde de la taille d'une baguette de pain. Ils ont l'air très enthousiastes.", "Tu te réveilles dans une soucoupe volante. Un extraterrestre enfile un gant en latex avec un claquement sinistre. Un autre prend des notes. Un troisième mange du pop-corn."],
      en: ["A blinding light, a sound like a giant fridge, and suddenly you're naked on a freezing steel table. Three little greys approach with a probe the size of a baguette. They seem very excited.", "You wake up in a flying saucer. An alien snaps on a latex glove with a sinister thwack. Another takes notes. A third is eating popcorn."],
    },
    choices: [
      {
        label: { fr: 'Serrer les fesses', en: 'Clench and pray' },
        out: [
          { w: 2, text: { fr: "Ils ont sondé. Profondément. Ils ont retrouvé mes clés perdues en 2009 et une pièce de 2 francs. Je marche bizarrement depuis, mais j'ai mes clés.", en: "They probed. Deeply. They found the keys I lost in 2009 and an old quarter. I've walked funny ever since, but I have my keys." }, fx: { health: -6, happy: -6, stress: 10, disease: 'hemorrhoids', flag: 'wd_abducted' }, mood: 'shock' },
          { w: 1, text: { fr: "La sonde est entrée, a fait « bip », et l'alien a reculé, horrifié. Il a dit un truc dans sa langue qui voulait clairement dire « mais qu'est-ce que t'as MANGÉ ». Ils m'ont relâché{|e} en vingt secondes.", en: "The probe went in, went 'beep', and the alien recoiled in horror. He said something in his language that clearly meant 'what did you EAT'. They let me go in twenty seconds." }, fx: { happy: 3, stress: 5, flag: 'wd_abducted' } },
        ],
      },
      {
        label: { fr: 'Me battre', en: 'Fight back' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai attrapé la sonde et je l'ai retournée contre eux. Les trois petits gris ont hurlé. J'ai piloté la soucoupe jusqu'à un McDo et je l'ai garée sur deux places handicapés.", en: "I grabbed the probe and turned it on them. All three greys screamed. I flew the saucer to a McDonald's and parked it across two handicapped spots." }, fx: { fame: 10, happy: 12, athletic: 4, flag: 'wd_abducted' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai mis un coup de boule à un alien. Son crâne était mou. Il a giclé une sorte de gelée verte partout, ses copains m'ont paralysé{|e} et ont sondé deux fois plus fort. Pour se venger.", en: "I headbutted an alien. Its skull was squishy. It squirted green goo everywhere, its buddies paralyzed me and probed twice as hard. Out of spite." }, fx: { health: -12, happy: -8, flag: 'wd_abducted', visual: 'gore' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Leur offrir une bière', en: 'Offer them a beer' }, text: { fr: "J'ai sorti une bière de ma poche (oui, j'étais nu{|e}, ne demandez pas). Les aliens ont adoré. On a fini la nuit à tester la sonde sur une vache. On s'appelle de temps en temps.", en: "I pulled a beer out of my pocket (yes, I was naked, don't ask). The aliens loved it. We spent the night testing the probe on a cow. We still call each other sometimes." }, fx: { happy: 10, addiction: ['alcohol', 5], flag: 'wd_abducted' }, mood: 'party' },
    ],
  },

  // ── Foudroyé trois fois (chaîne schedule) ──
  {
    id: 'wd_lightning_1',
    icon: '⚡',
    cat: 'weird',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'umbrella', fx: 'explosion' },
    when: { age: [16, 75], noFlag: 'wd_struck' },
    weight: 3,
    once: true,
    text: {
      fr: ["CRAAAAC. La foudre vient de te tomber dessus pendant que tu faisais un selfie avec un parapluie en métal. Tes cheveux sont droits sur ta tête, tes chaussures ont fondu et tu sens le poulet grillé.", "Un éclair t'a frappé{|e} en plein golf. Ton club a fondu, ton slip a pris feu, et tu peux désormais capter Radio Nostalgie avec tes plombages."],
      en: ["CRAAACK. Lightning just struck you while you were taking a selfie with a metal umbrella. Your hair is standing straight up, your shoes melted and you smell like rotisserie chicken.", "A bolt of lightning hit you mid-golf swing. Your club melted, your underwear caught fire, and you can now pick up oldies radio through your fillings."],
    },
    choices: [
      { label: { fr: 'Me relever, digne', en: 'Get up with dignity' }, text: { fr: "Je me suis relevé{|e}, j'ai éteint mes cheveux et je suis rentré{|e} à pied, fumant{|e} légèrement. Les gens pensaient que j'étais une performance artistique.", en: "I got up, put out my hair and walked home, gently smoking. People thought I was performance art." }, fx: { health: -12, looks: -5, flag: 'wd_struck', schedule: { key: 'wd_lightning_2', years: 2 } } },
      { label: { fr: "Aller à l'hôpital", en: 'Go to the hospital' }, text: { fr: "Aux urgences, le médecin m'a dit que j'avais « une chance sur un million ». Il n'a pas précisé de quoi. J'ai des brûlures en forme de fougère sur le dos. C'est assez joli.", en: "At the ER, the doctor said I was 'one in a million'. He didn't say one in a million what. I have fern-shaped burns on my back. They're kinda pretty." }, fx: { health: -6, money: -600, disease: 'burns', flag: 'wd_struck', schedule: { key: 'wd_lightning_2', years: 2 } } },
      { label: { fr: 'Acheter un ticket de loto', en: 'Buy a lottery ticket' }, text: { fr: "Je me suis dit que ma chance avait tourné. J'ai acheté un ticket de loto encore fumant{|e}. Perdu. La buraliste a éteint mes sourcils avec son café.", en: "I figured my luck had turned. I bought a lottery ticket while still smoking. Lost. The cashier put out my eyebrows with her coffee." }, fx: { health: -10, money: -5, happy: -3, flag: 'wd_struck', schedule: { key: 'wd_lightning_2', years: 2 } } },
    ],
  },
  {
    id: 'wd_lightning_2',
    icon: '⚡',
    cat: 'weird',
    rating: 2,
    chainOnly: true,
    scene: { place: 'park', mood: 'shock', prop: 'cloud', fx: 'explosion' },
    text: {
      fr: ["Deux ans plus tard, ciel bleu, pas un nuage. Un éclair sort de nulle part et te frappe. ENCORE. Tes dents brillent dans le noir et ton chien refuse de t'approcher.", "Rebelote : tu te prends un deuxième éclair en sortant les poubelles. Il fait beau. Le météorologue de la télé locale veut t'interviewer. Il a l'air de te tenir pour responsable."],
      en: ["Two years later, blue sky, not a cloud. A bolt comes out of nowhere and hits you. AGAIN. Your teeth glow in the dark and your dog refuses to come near you.", "Here we go again: you get struck a second time while taking out the trash. It's sunny. The local TV weatherman wants to interview you. He seems to blame you."],
    },
    choices: [
      { label: { fr: 'Chapeau paratonnerre', en: 'Lightning-rod hat' }, text: { fr: "Je porte désormais un chapeau paratonnerre relié à une chaîne qui traîne par terre. Je ressemble à un abruti. Un abruti vivant.", en: "I now wear a lightning-rod hat connected to a chain dragging on the ground. I look like an idiot. A living idiot." }, fx: { health: -10, looks: -6, stress: 10, schedule: { key: 'wd_lightning_3', years: 3 } } },
      { label: { fr: 'Devenir chasseur d\'orages', en: 'Become a storm chaser' }, text: { fr: "Puisque la foudre m'aime, j'ai décidé de l'affronter. Je chasse les orages en camping-car. Ma mère ne me parle plus. Mon dentiste, si : mes plombages ont fusionné.", en: "Since lightning loves me, I decided to face it. I chase storms in an RV. My mom doesn't talk to me anymore. My dentist does: my fillings have fused." }, fx: { health: -10, happy: 8, fame: 5, schedule: { key: 'wd_lightning_3', years: 3 } } },
      { label: { fr: 'Porter plainte contre le ciel', en: 'Sue the sky' }, text: { fr: "J'ai porté plainte contre X, X étant « le ciel ». Mon avocat a pris 2 000 € et a été foudroyé en sortant du tribunal. Je me sens un peu responsable.", en: "I filed a lawsuit against 'the sky'. My lawyer took $2,000 and got struck by lightning walking out of court. I feel a bit responsible." }, fx: { health: -10, money: -2000, karma: -3, schedule: { key: 'wd_lightning_3', years: 3 } } },
    ],
  },
  {
    id: 'wd_lightning_3',
    icon: '🌩️',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'park', mood: 'shock', prop: 'cloud', fx: 'fire' },
    text: {
      fr: ["Le ciel s'assombrit au-dessus de toi. Uniquement au-dessus de toi. Un petit nuage noir te suit depuis ce matin comme un chien fidèle. Tu sais ce qui va se passer. Il le sait aussi.", "Troisième fois. Le nuage s'ouvre en deux, une voix tonne « RIEN DE PERSONNEL », et un éclair gros comme un poteau télégraphique fonce vers ta tête."],
      en: ["The sky darkens above you. Only above you. A small black cloud has followed you since this morning like a loyal dog. You know what's coming. So does it.", "Third time. The cloud splits open, a voice booms 'NOTHING PERSONAL', and a bolt as thick as a telephone pole heads for your skull."],
    },
    choices: [
      {
        label: { fr: 'Courir en zigzag', en: 'Run in zigzags' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai couru en zigzag. L'éclair m'a frappé{|e} quand même, mais cette fois, j'ai absorbé l'énergie. Je recharge les téléphones avec mon doigt. Je suis une prise humaine. Je suis un dieu mineur.", en: "I ran in zigzags. It hit me anyway, but this time I absorbed the energy. I charge phones with my finger. I am a human outlet. I am a minor god." }, fx: { health: -8, fame: 15, happy: 10, counter: 'lightning', unflag: 'wd_struck' }, mood: 'proud' },
          { w: 1, text: { fr: "Zig, zag, ZAP. Il ne reste de moi qu'une silhouette noire sur le trottoir et une paire de baskets qui fument. Mes yeux ont explosé comme du pop-corn. Le petit nuage s'est dissipé, satisfait.", en: "Zig, zag, ZAP. All that's left of me is a black silhouette on the sidewalk and a pair of smoking sneakers. My eyeballs popped like popcorn. The little cloud drifted off, satisfied." }, fx: { die: { fr: "carbonisé{|e} par un troisième éclair, la foudre ayant clairement un truc personnel contre moi", en: 'charred by a third lightning bolt, since lightning clearly had a personal grudge' }, visual: 'gore' } },
        ],
      },
      {
        label: { fr: 'Lever les bras au ciel', en: 'Raise my arms and accept it' },
        out: [
          { w: 1, text: { fr: "J'ai levé les bras et crié « VAS-Y, ENFOIRÉ ! ». L'éclair est tombé. Je suis devenu{|e} une légende locale : trois foudroiements, zéro poil sur le corps, une statue en mon honneur. Elle a été foudroyée.", en: "I raised my arms and yelled 'BRING IT, YOU BASTARD!' It hit. I became a local legend: three strikes, zero body hair, a statue in my honor. It got struck by lightning." }, fx: { health: -20, fame: 20, followers: 200000, looks: -10, counter: 'lightning', unflag: 'wd_struck' }, mood: 'proud' },
          { w: 1, text: { fr: "L'éclair m'a frappé{|e} en plein dans les bras levés. J'ai explosé façon feu d'artifice, des morceaux de moi sont retombés sur trois communes. Le 14 juillet n'avait jamais été aussi gore.", en: "The bolt hit my raised arms dead-on. I exploded like a firework; bits of me rained down over three towns. The Fourth of July had never been so gory." }, fx: { die: { fr: "explosé{|e} façon feu d'artifice après un troisième éclair, les bras levés comme un abruti", en: 'blown up like fireworks by a third lightning bolt, arms raised like an idiot' }, visual: 'explosion' } },
        ],
      },
    ],
  },

  // ── Épidémie de zombies (chaîne en 3 étapes) ──
  {
    id: 'wd_zombie',
    icon: '🧟',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'barricade', fx: 'gore' },
    when: { age: [18, 85], noFlag: 'wd_zombie' },
    weight: 2,
    once: true,
    text: {
      fr: ["Ton voisin Bernard vient de mordre le facteur. Le facteur s'est relevé avec un bout de joue en moins et a mordu un livreur Amazon. Le JT parle d'une « grosse grippe ». C'est le début de l'apocalypse zombie.", "Dans la rue, une mamie zombie traîne sa jambe gauche (elle ne l'a plus, elle la porte à la main). Les sirènes hurlent. Ton groupe WhatsApp familial ne parle que de ça et de la tante Josiane, qui est « un peu bizarre »."],
      en: ["Your neighbor Gerald just bit the mailman. The mailman got back up missing half a cheek and bit an Amazon driver. The news calls it 'a bad flu'. The zombie apocalypse has begun.", "In the street, a zombie granny drags her left leg (she doesn't have it anymore, she's carrying it). Sirens wail. Your family group chat is all about it and Aunt Linda, who's 'acting a bit off'."],
    },
    choices: [
      { label: { fr: 'Barricader la maison', en: 'Barricade the house' }, text: { fr: "J'ai cloué toutes les planches de l'Ikea sur les fenêtres. Il me reste 40 boîtes de raviolis, une batte et une bougie parfumée « Brise marine ». Je suis prêt{|e}.", en: "I nailed every IKEA shelf over the windows. I've got 40 cans of ravioli, a bat and an 'Ocean Breeze' scented candle. I'm ready." }, fx: { stress: 15, flag: 'wd_zombie', chain: 'wd_zombie_2' } },
      { label: { fr: 'Piller le supermarché', en: 'Loot the supermarket' }, text: { fr: "J'ai pillé le supermarché pendant que les zombies dévoraient le vigile. J'ai pris du PQ, des pâtes et une télé 4K. Les priorités.", en: "I looted the supermarket while the zombies ate the security guard. I took toilet paper, pasta and a 4K TV. Priorities." }, fx: { karma: -8, happy: 5, stress: 10, flag: 'wd_zombie', chain: 'wd_zombie_2' } },
      { label: { fr: 'Rejoindre les zombies', en: 'Join the zombies' }, text: { fr: "Je me suis dit « si tu ne peux pas les battre ». J'ai tendu le bras à Bernard. Il m'a arraché trois doigts en grognant. J'ai grogné aussi. Puis j'ai eu très, très faim.", en: "I figured 'if you can't beat them'. I held out my arm to Gerald. He tore off three fingers, growling. I growled too. Then I got very, very hungry." }, fx: { die: { fr: "devenu{|e} zombie de mon plein gré, puis décapité{|e} d'un coup de pelle par une retraitée de 82 ans", en: 'turned zombie on purpose, then decapitated with a shovel by an 82-year-old retiree' }, visual: 'gore' } },
    ],
  },
  {
    id: 'wd_zombie_2',
    icon: '🧟',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock', prop: 'chainsaw', fx: 'gore' },
    text: {
      fr: ["Trois semaines plus tard. Une horde de quarante zombies défonce ta porte. Au premier rang : ton ancien prof de maths, toujours aussi moche, maintenant avec des asticots.", "La barricade cède. Des mains pourries passent par la fenêtre. Un zombie en tenue de mariée hurle ton nom. C'est ton ex. Honnêtement, pas une grosse différence."],
      en: ["Three weeks later. A horde of forty zombies smashes your door. Front row: your old math teacher, as ugly as ever, now with maggots.", "The barricade gives way. Rotting hands come through the window. A zombie in a wedding dress screams your name. It's your ex. Honestly, no change."],
    },
    choices: [
      {
        label: { fr: 'Tronçonneuse !', en: 'Chainsaw!' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai démarré la tronçonneuse en hurlant. Têtes, bras, intestins : ça giclait jusqu'au plafond. J'ai repeint le salon en rouge sang. Quarante zombies, zéro morsure. Je suis un{|e} artiste.", en: "I revved the chainsaw, screaming. Heads, arms, guts: it sprayed up to the ceiling. I repainted the living room blood red. Forty zombies, zero bites. I am an artist." }, fx: { athletic: 8, happy: 8, stress: 10, visual: 'gore', chain: 'wd_zombie_3' }, mood: 'proud' },
          { w: 1, text: { fr: "La tronçonneuse a calé. Évidemment. Un zombie m'a mordu le mollet avant que je l'assomme avec la tronçonneuse éteinte. Le mollet est violet. Ça me démange.", en: "The chainsaw stalled. Of course. A zombie bit my calf before I clubbed it with the dead chainsaw. The calf is purple. It itches." }, fx: { health: -15, flag: 'wd_bitten', visual: 'gore', chain: 'wd_zombie_3' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Sacrifier le voisin', en: 'Sacrifice the neighbor' }, text: { fr: "J'ai poussé mon voisin Jean-Marc dehors pour faire diversion. Il a crié « T'ES SÉRIEUX ? » pendant qu'ils le dévoraient. J'ai fui par le jardin. Je n'ai pas de regrets, il garait mal.", en: "I shoved my neighbor Jim outside as a distraction. He screamed 'ARE YOU SERIOUS?' while they ate him. I escaped through the backyard. No regrets, he parked badly." }, fx: { karma: -20, stress: 8, chain: 'wd_zombie_3' } },
      {
        label: { fr: 'Faire le mort', en: 'Play dead' },
        out: [
          { w: 1, text: { fr: "Je me suis roulé{|e} dans les poubelles et j'ai fait le mort. Les zombies m'ont reniflé{|e}, ont eu un haut-le-cœur, et sont partis. Je pue tellement que même la mort ne veut pas de moi.", en: "I rolled in the garbage and played dead. The zombies sniffed me, gagged, and left. I stink so bad even death doesn't want me." }, fx: { happy: -5, looks: -5, chain: 'wd_zombie_3' } },
          { w: 1, text: { fr: "J'ai fait le mort. Un zombie a croqué un bout de mon épaule « pour goûter », a recraché, puis s'est barré. Vexant. Et ça brûle.", en: "I played dead. A zombie took a bite of my shoulder 'to taste', spat it out and left. Insulting. And it burns." }, fx: { health: -10, flag: 'wd_bitten', chain: 'wd_zombie_3' }, mood: 'sick' },
        ],
      },
    ],
  },
  {
    id: 'wd_zombie_3',
    icon: '☣️',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'hospital', mood: 'shock', prop: 'syringe' },
    text: {
      fr: ["Six mois plus tard, l'armée a « maîtrisé la situation » à coups de lance-flammes. Le gouvernement annonce que l'apocalypse « n'a jamais eu lieu ». Les survivants ressortent, hagards.", "C'est fini. Les zombies ont été parqués dans un stade et le ministre parle d'une « fake news ». Tu sors de ta cachette avec une barbe de six mois et un regard de vétéran."],
      en: ["Six months later, the army has 'contained the situation' with flamethrowers. The government says the apocalypse 'never happened'. Survivors emerge, dazed.", "It's over. The zombies have been herded into a stadium and the minister calls it 'fake news'. You crawl out of hiding with a six-month beard and a veteran's stare."],
    },
    choices: [
      { label: { fr: 'Couper le membre mordu', en: 'Amputate the bite' }, if: { flag: 'wd_bitten' }, text: { fr: "La morsure virait au vert. Je l'ai coupée moi-même à la scie à pain, en mordant une ceinture. Il me manque un bout, mais il me reste le cerveau. Et je n'ai plus jamais envie de cerveau.", en: "The bite was turning green. I cut it off myself with a bread knife, biting a belt. I'm missing a chunk, but I still have my brain. And I never crave brains again." }, fx: { health: -20, looks: -10, disease: 'ptsd', unflag: ['wd_bitten', 'wd_zombie'], visual: 'gore' }, mood: 'cry' },
      {
        label: { fr: 'Cacher la morsure', en: 'Hide the bite' },
        if: { flag: 'wd_bitten' },
        out: [
          { w: 1, text: { fr: "J'ai caché la morsure sous un pansement. C'était juste un gros bleu. J'ai survécu à l'apocalypse avec une cicatrice et une anecdote pour les dîners.", en: "I hid the bite under a band-aid. It was just a nasty bruise. I survived the apocalypse with a scar and a great dinner-party story." }, fx: { happy: 10, unflag: ['wd_bitten', 'wd_zombie'] }, mood: 'happy' },
          { w: 1, text: { fr: "Le pansement n'a pas suffi. J'ai commencé à grogner au supermarché, puis j'ai mangé la caissière. La police m'a abattu{|e} entre le rayon surgelés et les yaourts.", en: "The band-aid wasn't enough. I started growling at the supermarket, then ate the cashier. The police shot me between the frozen aisle and the yogurts." }, fx: { die: { fr: "transformé{|e} en zombie six mois après une morsure, puis abattu{|e} au rayon yaourts", en: 'turned into a zombie six months after a bite, then shot in the yogurt aisle' }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Écrire un livre', en: 'Write a memoir' }, if: { noFlag: 'wd_bitten' }, text: { fr: "J'ai écrit « Moi, survivant{|e} », un livre sur mes six mois d'apocalypse. Best-seller. Le gouvernement nie toujours, ce qui fait vendre encore plus.", en: "I wrote 'I, Survivor', a book about my six months of apocalypse. Bestseller. The government still denies it, which only sells more copies." }, fx: { money: 30000, fame: 15, unflag: 'wd_zombie' }, mood: 'proud' },
      { label: { fr: 'Rester dans le bunker', en: 'Stay in the bunker' }, if: { noFlag: 'wd_bitten' }, text: { fr: "Je ne crois pas le gouvernement. Je reste dans ma cave avec mes raviolis et ma batte. Ça fait deux ans. Il fait bon, ici.", en: "I don't trust the government. I'm staying in my basement with my ravioli and my bat. It's been two years. It's nice down here." }, fx: { stress: -5, happy: -6, discipline: 8, unflag: 'wd_zombie' } },
    ],
  },

  // ── Pacte avec un démon → recouvrement ──
  {
    id: 'wd_demon_deal',
    icon: '😈',
    cat: 'weird',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock', prop: 'mirror', fx: 'fire' },
    when: { age: [18, 70], noFlag: 'wd_soul_sold' },
    weight: 3,
    once: true,
    text: {
      fr: ["3 h 33 du matin. Dans le miroir de la salle de bain, ton reflet sourit tout seul. Puis il devient rouge, pousse des cornes et sort un contrat en peau de quelque chose. « Ton âme contre ce que tu veux. Clause de 10 ans. Signature au sang, stylo fourni. »", "Un démon en costume trois-pièces est assis sur ton canapé, les pieds sur ta table basse. Il sent le soufre et l'after-shave. « J'ai une offre pour toi. Tu vas adorer. Tout le monde adore. Au début. »"],
      en: ["3:33 a.m. In the bathroom mirror, your reflection smiles on its own. Then it turns red, sprouts horns and pulls out a contract made of the skin of something. 'Your soul for anything you want. Ten-year term. Sign in blood, pen provided.'", "A demon in a three-piece suit is sitting on your couch, feet on your coffee table. He smells of brimstone and aftershave. 'I've got an offer for you. You'll love it. Everyone does. At first.'"],
    },
    choices: [
      { label: { fr: 'La richesse', en: 'Wealth' }, text: { fr: "J'ai signé pour la richesse. Le lendemain, un oncle dont j'ignorais l'existence est mort écrasé par un coffre-fort et m'a tout légué. Le démon m'a envoyé un smiley.", en: "I signed for wealth. The next day, an uncle I never knew I had was crushed by a safe and left me everything. The demon sent me a smiley." }, fx: { money: 250000, karma: -30, happy: 10, flag: 'wd_soul_sold', schedule: { key: 'wd_demon_collect', years: 10 } }, mood: 'party' },
      { label: { fr: 'La gloire', en: 'Fame' }, text: { fr: "J'ai signé pour la célébrité. Tout le monde me reconnaît dans la rue. Je ne sais toujours pas pourquoi. Le démon dit que ce n'est « pas inclus dans le contrat ».", en: "I signed for fame. Everyone recognizes me in the street. I still don't know why. The demon says that's 'not covered in the contract'." }, fx: { fame: 40, followers: 1000000, karma: -30, flag: 'wd_soul_sold', schedule: { key: 'wd_demon_collect', years: 10 } }, mood: 'proud' },
      { label: { fr: 'Une beauté infernale', en: 'Hellish good looks' }, text: { fr: "J'ai vendu mon âme pour être sublime. Ça a marché. Je suis une bombe. Les miroirs fument légèrement quand je passe devant.", en: "I sold my soul to be gorgeous. It worked. I'm a total bombshell. Mirrors smoke slightly when I walk past." }, fx: { looks: 35, karma: -30, flag: 'wd_soul_sold', schedule: { key: 'wd_demon_collect', years: 10 } } },
      {
        label: { fr: 'Négocier dur', en: 'Haggle hard' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai négocié trois heures. Le démon a fini par m'acheter l'âme du chat du voisin contre 5 000 €. Il est reparti en pleurant de rage. Le chat s'en fout.", en: "I haggled for three hours. The demon ended up buying my neighbor's cat's soul for five grand. He left crying with rage. The cat doesn't care." }, fx: { money: 5000, smarts: 4, karma: -5 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai voulu négocier. Le démon a lu les petites lignes à toute vitesse, j'ai dit « hein ? », il a pris ça pour un oui. J'ai vendu mon âme contre un bon de réduction de 10 % chez Picard.", en: "I tried to haggle. The demon read the fine print at lightning speed, I said 'huh?', he took it as a yes. I sold my soul for a 10% off coupon at a frozen food store." }, fx: { karma: -30, happy: -10, flag: 'wd_soul_sold', schedule: { key: 'wd_demon_collect', years: 10 } }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Refuser', en: 'Refuse' }, text: { fr: "J'ai dit non. Le démon a haussé les épaules : « Ton voisin du dessus a dit oui en trente secondes. » Il m'a laissé sa carte. Elle est brûlante.", en: "I said no. The demon shrugged: 'Your upstairs neighbor said yes in thirty seconds.' He left me his card. It's scorching hot." }, fx: { karma: 8 } },
    ],
  },
  {
    id: 'wd_demon_collect',
    icon: '🔥',
    cat: 'weird',
    rating: 2,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock', prop: 'contract', fx: 'fire' },
    text: {
      fr: ["Le sol de ton salon s'ouvre dans un geyser de flammes. Le démon remonte, un dossier sous le bras. « Coucou ! C'est l'heure. Ton âme, s'il te plaît. Et ne fais pas cette tête, tu as signé. »", "Ça sent le soufre dans tout l'immeuble. Ton créancier infernal est revenu, ponctuel, avec deux huissiers démoniaques et un aspirateur à âmes."],
      en: ["Your living room floor splits open in a geyser of flames. The demon climbs out, a folder under his arm. 'Hi there! It's time. Your soul, please. And don't make that face, you signed.'", "The whole building smells of brimstone. Your infernal creditor is back, right on time, with two demonic bailiffs and a soul vacuum."],
    },
    choices: [
      {
        label: { fr: 'Trouver une faille', en: 'Find a loophole' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai relu le contrat : il était signé avec mon sang, mais au stylo bille rouge en réalité. Contrat nul. Le démon a hurlé, puis il m'a proposé un poste au service juridique de l'Enfer.", en: "I reread the contract: it was supposed to be signed in my blood, but it was actually red ballpoint pen. Contract void. The demon screamed, then offered me a job in Hell's legal department." }, fx: { happy: 20, karma: 10, smarts: 4, unflag: 'wd_soul_sold' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai cherché une faille. Il n'y en avait pas. Le démon m'a attrapé{|e} par les chevilles et m'a traîné{|e} dans le trou en flammes. Mes ongles ont laissé dix sillons dans le parquet.", en: "I looked for a loophole. There wasn't one. The demon grabbed me by the ankles and dragged me into the flaming pit. My nails left ten grooves in the floorboards." }, fx: { die: { fr: "traîné{|e} en Enfer par un démon très ponctuel, en hurlant « JE VEUX MON AVOCAT »", en: "dragged to Hell by a very punctual demon, screaming 'I WANT MY LAWYER'" }, visual: 'fire' } },
        ],
      },
      { label: { fr: "Lui refiler mon patron", en: 'Offer my boss instead' }, if: { job: true }, text: { fr: "J'ai proposé l'âme de mon patron à la place. Le démon a regardé son dossier, a sifflé : « Oh, celle-là on l'a déjà, depuis 1998. » On a bien ri. Il m'a accordé un délai de 20 ans pour la blague.", en: "I offered my boss's soul instead. The demon checked his file and whistled: 'Oh, we've had that one since 1998.' We had a good laugh. He gave me a 20-year extension for the joke." }, fx: { happy: 15, unflag: 'wd_soul_sold' }, mood: 'happy' },
      {
        label: { fr: 'Duel de violon', en: 'Fiddle duel' },
        out: [
          { w: 1, text: { fr: "Je l'ai défié au violon, comme dans la chanson. Je ne sais pas jouer du violon. J'ai gagné quand même : il a eu tellement mal aux oreilles qu'il a déchiré le contrat pour que j'arrête.", en: "I challenged him to a fiddle duel, like in the song. I can't play the fiddle. I won anyway: it hurt his ears so badly he tore up the contract to make me stop." }, fx: { happy: 12, unflag: 'wd_soul_sold' }, mood: 'party' },
          { w: 1, text: { fr: "Le démon a joué un solo de violon si beau que ma tête a explosé. Littéralement. De la cervelle jusqu'au lustre. Il a récupéré mon âme dans un Tupperware.", en: "The demon played a fiddle solo so beautiful my head exploded. Literally. Brains up to the chandelier. He scooped up my soul in a Tupperware." }, fx: { die: { fr: "la tête explosée par un solo de violon démoniaque trop beau", en: 'head exploded from a demonic fiddle solo that was simply too good' }, visual: 'gore' } },
        ],
      },
    ],
  },

  // ── Poker avec le Diable ──
  {
    id: 'wd_devil_poker',
    icon: '🃏',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'casino', mood: 'shock', prop: 'cards', fx: 'fire' },
    when: { age: [21, 85], noFlag: 'wd_soul_sold' },
    weight: 2,
    once: true,
    text: {
      fr: ["Au casino, un type en costume rouge, cornes discrètes, s'assoit à ta table. Il sent le barbecue. « Une partie de poker ? Mise : 666 000 $ contre ton âme. Je n'ai jamais perdu. Enfin, une fois, contre un Gallois. »", "Le croupier a disparu. À sa place, le Diable en personne bat les cartes avec sa queue. « Texas Hold'em. Si tu gagnes, tu es riche. Si tu perds, tu viens bosser chez moi pour l'éternité. »"],
      en: ["At the casino, a guy in a red suit with discreet horns sits at your table. He smells like barbecue. 'Poker? Stakes: $666,000 against your soul. I've never lost. Well, once, to a Welshman.'", "The dealer has vanished. In his place, the Devil himself is shuffling cards with his tail. 'Texas Hold'em. Win and you're rich. Lose and you work for me for eternity.'"],
    },
    choices: [
      {
        label: { fr: 'Jouer à la loyale', en: 'Play it straight' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "Quinte flush royale. Le Diable a regardé ses cartes, puis moi, puis il a renversé la table en hurlant des insultes en araméen. J'ai pris les 666 000 $ et je me suis enfui{|e} avant qu'il se calme.", en: "Royal flush. The Devil looked at his cards, then at me, then flipped the table screaming insults in Aramaic. I grabbed the $666,000 and ran before he calmed down." }, fx: { money: 666000, fame: 10, happy: 20, karma: 5 }, mood: 'party' },
          { w: 2, text: { fr: "J'avais une paire de rois. Il avait cinq as. Dans un jeu de 52 cartes. Il a signé mon âme en souriant : « Je passerai la chercher dans cinq ans. Profite. »", en: "I had a pair of kings. He had five aces. In a 52-card deck. He signed for my soul, smiling: 'I'll come collect it in five years. Enjoy.'" }, fx: { happy: -15, karma: -10, flag: 'wd_soul_sold', schedule: { key: 'wd_demon_collect', years: 5 } }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Tricher', en: 'Cheat' },
        out: [
          { w: 1, text: { fr: "J'ai triché contre le Diable. Il a été tellement impressionné qu'il m'a nommé{|e} {ambassadeur|ambassadrice} de l'Enfer sur Terre. Il m'a laissé 50 000 $ « pour le style ».", en: "I cheated against the Devil. He was so impressed he named me Hell's ambassador on Earth. He left me $50,000 'for style'." }, fx: { money: 50000, karma: -15, fame: 5 }, mood: 'proud' },
          { w: 1, text: { fr: "Le Diable a vu l'as dans ma manche. Il a claqué des doigts : ma manche a pris feu, puis mon bras, puis ma coupe de cheveux. J'ai survécu, sans sourcils et avec la honte éternelle.", en: "The Devil spotted the ace up my sleeve. He snapped his fingers: my sleeve caught fire, then my arm, then my haircut. I survived, eyebrowless and eternally ashamed." }, fx: { health: -20, looks: -10, disease: 'burns', visual: 'fire' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Me coucher', en: 'Fold' }, text: { fr: "Je me suis couché{|e} avant même de voir mes cartes. Le Diable m'a traité{|e} de « poule mouillée » en 66 langues, puis il a payé ma tournée. Un gentleman, au fond.", en: "I folded before even looking at my cards. The Devil called me chicken in 66 languages, then bought my round. A gentleman, really." }, fx: { happy: 2, karma: 3 } },
    ],
  },

  // ── La secte (chaîne en 3 étapes) ──
  {
    id: 'wd_cult',
    icon: '🍝',
    cat: 'weird',
    rating: 2,
    scene: { place: 'park', mood: 'neutral', prop: 'pamphlet' },
    when: { age: [18, 65], noFlag: 'wd_cult' },
    weight: 4,
    once: true,
    text: {
      fr: ["Deux types en toge orange sonnent chez toi. « As-tu entendu parler de la Sainte Lasagne Cosmique ? Notre gourou Kévin-Ra a reçu la révélation dans un micro-ondes. Le vaisseau-mère arrive dans six mois. Il ne prendra que les croyants. Et leurs économies. »", "À la sortie du métro, une femme souriante (beaucoup trop) te tend un flyer : « Église de la Sainte Lasagne Cosmique. Brunch gratuit, illumination garantie, sortie de secte non garantie. »"],
      en: ["Two guys in orange robes ring your doorbell. 'Have you heard of the Holy Cosmic Lasagna? Our guru Kevin-Ra received the revelation in a microwave. The mothership arrives in six months. It only takes believers. And their savings.'", "Outside the subway, a smiling woman (way too smiling) hands you a flyer: 'Church of the Holy Cosmic Lasagna. Free brunch, enlightenment guaranteed, exit not guaranteed.'"],
    },
    choices: [
      { label: { fr: 'Rejoindre la secte', en: 'Join the cult' }, text: { fr: "J'ai rejoint la Sainte Lasagne. On m'a rasé la tête, donné une toge et un nouveau nom : {Frère|Sœur} Béchamel. J'ai donné mes économies au gourou. Je me sens {tellement léger|tellement légère}.", en: "I joined the Holy Lasagna. They shaved my head, gave me a robe and a new name: {Brother|Sister} Béchamel. I gave my savings to the guru. I feel so light." }, fx: { moneyPct: -0.3, happy: 10, smarts: -6, flag: 'wd_cult', schedule: { key: 'wd_cult_rise', years: 2 } }, mood: 'happy' },
      { label: { fr: 'Juste pour le brunch', en: 'Just for the brunch' }, text: { fr: "J'ai assisté à une messe de la Sainte Lasagne uniquement pour le buffet. J'ai mangé onze croissants pendant le sermon sur la pâte sacrée. On m'a viré{|e} pour « gloutonnerie profane ».", en: "I attended a Holy Lasagna service purely for the buffet. I ate eleven croissants during the sermon on the sacred pasta. They kicked me out for 'profane gluttony'." }, fx: { happy: 6, weight: 0.01 } },
      { label: { fr: 'Leur claquer la porte au nez', en: 'Slam the door' }, text: { fr: "J'ai claqué la porte au nez des disciples. Ils ont glissé sous la porte 40 flyers et une lasagne bénite. Elle était bonne, je l'avoue.", en: "I slammed the door on the disciples. They slid 40 flyers and a blessed lasagna under the door. It was good, I'll admit." }, fx: { happy: 2 } },
    ],
  },
  {
    id: 'wd_cult_rise',
    icon: '🛸',
    cat: 'weird',
    rating: 2,
    chainOnly: true,
    scene: { place: 'castle', mood: 'shock', prop: 'robe' },
    when: { flag: 'wd_cult' },
    text: {
      fr: ["Deux ans dans la secte. Tu es devenu{|e} le bras droit de Kévin-Ra. Ce soir, il annonce que le vaisseau-mère est « en retard à cause des bouchons interstellaires » et qu'il faut lui donner plus d'argent. Et vos reins. Juste un chacun.", "Kévin-Ra, le gourou, vient de se proclamer « réincarnation d'une lasagne de 1452 ». Il exige que tous les fidèles portent des baskets assorties et lui lèguent leurs biens. Les fidèles te regardent : tu es le numéro deux."],
      en: ["Two years in the cult. You've become Kevin-Ra's right hand. Tonight he announced the mothership is 'late due to interstellar traffic' and needs more money. And your kidneys. Just one each.", "Kevin-Ra the guru just proclaimed himself 'the reincarnation of a lasagna from 1452'. He demands all followers wear matching sneakers and sign over their property. The followers look at you: you're number two."],
    },
    choices: [
      { label: { fr: "Faire un coup d'État", en: 'Stage a coup' }, text: { fr: "J'ai enfermé Kévin-Ra dans le congélateur et annoncé que la Lasagne m'avait choisi{|e}. Les fidèles ont applaudi. Je suis gourou. J'ai un jacuzzi, trois Rolls et zéro morale.", en: "I locked Kevin-Ra in the freezer and announced the Lasagna had chosen me. The followers cheered. I'm the guru now. I have a hot tub, three Rolls-Royces and zero morals." }, fx: { money: 80000, fame: 10, karma: -25, flag: 'wd_cult_leader', schedule: { key: 'wd_cult_raid', years: 3 } }, mood: 'proud' },
      { label: { fr: "M'enfuir", en: 'Escape' }, text: { fr: "Je me suis enfui{|e} en pleine nuit, en toge, par la fenêtre des toilettes. J'ai fait du stop jusqu'à chez ma mère. Elle m'a dit « je t'avais prévenu{|e} » et m'a fait des lasagnes. J'ai pleuré.", en: "I escaped in the middle of the night, in my robe, through the bathroom window. I hitchhiked to my mom's. She said 'I told you so' and made me lasagna. I cried." }, fx: { happy: 8, smarts: 5, stress: -8, unflag: 'wd_cult' }, mood: 'cry' },
      { label: { fr: 'Balancer au FBI', en: 'Snitch to the feds' }, text: { fr: "J'ai tout balancé aux flics avec des micros cachés dans ma toge. Kévin-Ra a été arrêté en slip, à genoux devant le micro-ondes sacré. Je suis passé{|e} au JT.", en: "I ratted everything out to the cops, with mics hidden in my robe. Kevin-Ra was arrested in his underwear, kneeling before the sacred microwave. I made the evening news." }, fx: { karma: 15, fame: 12, unflag: 'wd_cult' }, mood: 'proud' },
    ],
  },
  {
    id: 'wd_cult_raid',
    icon: '🚨',
    cat: 'weird',
    rating: 2,
    chainOnly: true,
    scene: { place: 'castle', mood: 'shock', prop: 'megaphone', fx: 'police' },
    when: { flag: 'wd_cult_leader' },
    text: {
      fr: ["Hélicoptères, mégaphones, cinquante agents en gilet pare-balles : le FBI encercle ton domaine sectaire. « Sortez les mains en l'air, Grand Prêtre Béchamel ! » Tes fidèles te regardent, pleins d'espoir.", "Six fourgons de police défoncent le portail du temple de la Lasagne. Tes adeptes te supplient de faire un miracle. Tu as des pâtes et un mégaphone."],
      en: ["Helicopters, megaphones, fifty agents in body armor: the FBI surrounds your cult compound. 'Come out with your hands up, High Priest Béchamel!' Your followers look at you, full of hope.", "Six police vans crash through the gates of the Lasagna temple. Your followers beg you for a miracle. You have pasta and a megaphone."],
    },
    choices: [
      { label: { fr: 'Me rendre', en: 'Surrender' }, text: { fr: "Je suis sorti{|e} les mains en l'air, en toge à paillettes. Les agents ont filmé. Mes fidèles ont chanté pendant que je montais dans le fourgon. Procès pour escroquerie en bande organisée.", en: "I walked out with my hands up, in a sequined robe. The agents filmed. My followers sang as I got into the van. Trial for organized fraud." }, fx: { arrest: 'ponzi', fame: 10, unflag: ['wd_cult', 'wd_cult_leader'] } },
      {
        label: { fr: 'Fuir en jet-ski', en: 'Flee by jet ski' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai filé par le lac en jet-ski avec la caisse de la secte. Les hélicos m'ont perdu{|e} dans la brume. Je vis au Paraguay sous le nom de « Jean Spaghetti ». Personne ne pose de questions.", en: "I escaped across the lake on a jet ski with the cult's cash box. The helicopters lost me in the fog. I live in Paraguay as 'John Spaghetti'. Nobody asks questions." }, fx: { money: 40000, happy: 10, heat: 40, unflag: ['wd_cult', 'wd_cult_leader'] }, mood: 'party' },
          { w: 1, text: { fr: "Le jet-ski n'avait plus d'essence. J'ai dérivé au milieu du lac pendant deux heures, en toge, sous les projecteurs, pendant que le négociateur me demandait si ça allait.", en: "The jet ski was out of gas. I drifted in the middle of the lake for two hours, in my robe, under the spotlights, while the negotiator kept asking if I was okay." }, fx: { arrest: 'ponzi', happy: -10, unflag: ['wd_cult', 'wd_cult_leader'] }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Me proclamer dieu', en: 'Declare myself a god' },
        out: [
          { w: 1, text: { fr: "J'ai hurlé dans le mégaphone que j'étais la Lasagne incarnée. Trois agents du FBI ont jeté leurs armes et rejoint la secte. Le FBI a négocié. On a maintenant un traité.", en: "I screamed into the megaphone that I was the Lasagna incarnate. Three FBI agents dropped their weapons and joined the cult. The FBI negotiated. We now have a treaty." }, fx: { fame: 25, followers: 300000, happy: 10 }, mood: 'proud' },
          { w: 2, text: { fr: "Je me suis proclamé{|e} dieu. Un agent m'a tasé{|e}. J'ai fait pipi dans ma toge sacrée en direct à la télé. La Lasagne ne m'a pas sauvé{|e}.", en: "I declared myself a god. An agent tased me. I peed in my sacred robe live on TV. The Lasagna did not save me." }, fx: { arrest: 'ponzi', health: -6, happy: -12, unflag: ['wd_cult', 'wd_cult_leader'] }, mood: 'shock' },
        ],
      },
    ],
  },

  // ── Combustion spontanée (mort rare) ──
  {
    id: 'wd_combustion',
    icon: '🔥',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'smoke', fx: 'fire' },
    when: { age: [30, 95], chance: 0.4 },
    weight: 1,
    once: true,
    text: {
      fr: ["En pleine réunion, tu sens une chaleur bizarre. Puis de la fumée sort de tes oreilles. Puis ton pantalon s'enflamme. Tout seul. Tes collègues reculent. Quelqu'un dit « c'est quoi cette odeur de merguez ? ».", "Tu es tranquillement sur ton canapé quand ton nombril se met à fumer. Une petite flamme bleue apparaît sur ton ventre. Combustion humaine spontanée. Ça arrive, apparemment."],
      en: ["Mid-meeting, you feel a weird heat. Then smoke comes out of your ears. Then your pants catch fire. By themselves. Your coworkers back away. Someone says 'what's that sausage smell?'", "You're chilling on your couch when your belly button starts smoking. A little blue flame appears on your stomach. Spontaneous human combustion. It happens, apparently."],
    },
    choices: [
      {
        label: { fr: "S'arrêter, se coucher, rouler", en: 'Stop, drop and roll' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai roulé par terre comme un rouleau à pâtisserie hystérique. Les flammes se sont éteintes. J'ai des brûlures au troisième degré et la moquette a une silhouette de moi gravée dedans.", en: "I rolled across the floor like a hysterical rolling pin. The flames went out. Third-degree burns, and the carpet now has my silhouette scorched into it." }, fx: { health: -25, looks: -12, disease: 'burns' }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai roulé, mais sur la moquette synthétique. Elle a pris feu aussi. Puis le bureau. Puis l'immeuble. Il ne reste de moi qu'un pied dans une chaussette et une odeur de chipolata.", en: "I rolled, but on synthetic carpet. It caught fire too. Then the office. Then the building. All that's left of me is one foot in a sock and a smell of grilled sausage." }, fx: { die: { fr: "consumé{|e} par combustion spontanée ; on n'a retrouvé qu'un pied dans une chaussette", en: 'consumed by spontaneous combustion; only one foot in a sock was found' }, visual: 'fire' } },
        ],
      },
      {
        label: { fr: "Sauter dans l'aquarium", en: 'Dive into the fish tank' },
        out: [
          { w: 1, text: { fr: "J'ai plongé la tête la première dans l'aquarium de l'accueil. Flammes éteintes. Les poissons sont morts cuits, au court-bouillon. J'ai vécu, mais je sens le poisson pané.", en: "I dove headfirst into the lobby fish tank. Flames out. The fish were poached alive. I lived, but I smell like fish sticks." }, fx: { health: -15, karma: -3, disease: 'burns' } },
          { w: 1, text: { fr: "J'ai sauté dans l'aquarium. Il était trop petit. Je suis resté{|e} coincé{|e}, tête dans l'eau, cul en feu. Mort par noyade et grillade simultanées. Une première médicale.", en: "I jumped into the fish tank. It was too small. I got stuck, head underwater, butt on fire. Death by simultaneous drowning and grilling. A medical first." }, fx: { die: { fr: "noyé{|e} et grillé{|e} en même temps, coincé{|e} dans un aquarium", en: 'drowned and grilled at the same time, stuck in a fish tank' }, visual: 'fire' } },
        ],
      },
      { label: { fr: 'Griller des chamallows', en: 'Roast marshmallows' }, text: { fr: "J'ai accepté mon destin et sorti des chamallows. Ils étaient parfaits. J'ai flambé jusqu'au bout, souriant{|e}, en distribuant des s'mores à mes collègues. Ils en parlent encore.", en: "I accepted my fate and pulled out marshmallows. They were perfect. I burned to the end, smiling, handing out s'mores to my coworkers. They still talk about it." }, fx: { die: { fr: "parti{|e} en fumée par combustion spontanée, en grillant des chamallows jusqu'au bout", en: 'went up in smoke from spontaneous combustion, roasting marshmallows to the very end' }, visual: 'fire' } },
    ],
  },

  // ── Le clown dans les égouts ──
  {
    id: 'wd_sewer_clown',
    icon: '🤡',
    cat: 'weird',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'balloon', fx: 'gore' },
    when: { age: [18, 85] },
    weight: 3,
    cooldown: 20,
    text: {
      fr: ["Une voix sort de la bouche d'égout : « Hé ! Tu veux un ballon ? » Un clown aux dents pointues te sourit depuis le caniveau. Il a de la sauce sur le menton. Tu espères que c'est de la sauce.", "Un ballon rouge flotte au-dessus d'une grille d'égout. En dessous, un clown en sueur, maquillage coulant : « Ils flottent tous en bas... Allez, viens, j'ai des Haribo. »"],
      en: ["A voice comes from the storm drain: 'Hey! Want a balloon?' A clown with pointy teeth grins at you from the gutter. There's sauce on his chin. You hope it's sauce.", "A red balloon floats above a sewer grate. Below it, a sweaty clown with running makeup: 'They all float down here... come on, I've got gummy bears.'"],
    },
    choices: [
      {
        label: { fr: 'Prendre le ballon', en: 'Take the balloon' },
        out: [
          { w: 1, text: { fr: "J'ai tendu la main vers le ballon. CHOMP. Le clown m'a arraché deux doigts et les a mâchés avec un bruit de céleri. Il m'a quand même donné le ballon. Il est très joli.", en: "I reached for the balloon. CHOMP. The clown bit off two of my fingers and chewed them with a celery crunch. He still gave me the balloon. It's very pretty." }, fx: { health: -15, disease: 'missing_finger', visual: 'gore' }, mood: 'cry' },
          { w: 1, text: { fr: "Le clown m'a donné le ballon et s'est mis à pleurer. Il vit dans les égouts depuis que son cirque a fermé. Il voulait juste parler à quelqu'un. On a parlé deux heures. Il sent la mort.", en: "The clown gave me the balloon and burst into tears. He's lived in the sewer since his circus closed. He just wanted someone to talk to. We talked for two hours. He smells like death." }, fx: { karma: 8, happy: -2 } },
        ],
      },
      {
        label: { fr: 'Lui péter le nez', en: 'Punch his nose' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "Je lui ai collé une droite. Son nez rouge a fait « pouet » et a explosé, avec du sang de clown arc-en-ciel partout. Il est retourné dans les égouts en sanglotant. Je suis un héros de la ville.", en: "I decked him. His red nose went 'honk' and burst, spraying rainbow clown blood everywhere. He crawled back into the sewer sobbing. I'm the town hero." }, fx: { fame: 6, happy: 8, visual: 'gore' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai frappé le clown. Il m'a attrapé{|e} la cheville et m'a traîné{|e} à moitié dans la bouche d'égout. Je m'en suis sorti{|e}, mais j'ai perdu une chaussure, un ongle et toute ma santé mentale.", en: "I punched the clown. He grabbed my ankle and dragged me halfway into the drain. I got out, but I lost a shoe, a toenail and all my sanity." }, fx: { health: -10, disease: 'ptsd', stress: 15 }, mood: 'shock' },
        ],
      },
      { label: { fr: "Lui proposer un taf", en: 'Offer him a gig' }, text: { fr: "J'ai engagé le clown pour un anniversaire. Il a fait des animaux en ballon, puis il a mangé le hamster. Tout le monde a crié. Note sur Google : 4,2 étoiles.", en: "I hired the clown for a birthday party. He made balloon animals, then ate the hamster. Everybody screamed. Google rating: 4.2 stars." }, fx: { happy: 4, karma: -4, money: -150 } },
    ],
  },

  // ── Poupée vaudou du patron ──
  {
    id: 'wd_voodoo_boss',
    icon: '🪡',
    cat: 'weird',
    rating: 2,
    actor: 'boss',
    scene: { place: 'office', mood: 'angry', prop: 'doll' },
    when: { age: [18, 70], job: true },
    weight: 4,
    cooldown: 10,
    text: {
      fr: ["Dans ta boîte aux lettres, une petite poupée en chiffon, avec la cravate et la calvitie de {a.first}, {a.rel}. Une note : « Une épingle = une douleur. Bon courage. — Un ami. »", "Tu as trouvé dans un marché aux puces une poupée vaudou qui ressemble trait pour trait à {a.first}. Même les poils du nez. Le vendeur dit qu'elle « marche très bien »."],
      en: ["In your mailbox: a little rag doll with the tie and bald spot of {a.first}, {a.rel}. A note: 'One pin = one pain. Good luck. — A friend.'", "At a flea market, you found a voodoo doll that looks exactly like {a.first}. Down to the nose hairs. The seller says it 'works great'."],
    },
    choices: [
      { label: { fr: 'Épingle dans les fesses', en: 'Pin in the butt' }, text: { fr: "J'ai planté une épingle dans les fesses de la poupée. {a.first} a bondi en pleine réunion en hurlant comme un phoque. {a:Il|Elle} a passé la semaine sur une bouée. La meilleure semaine de ma carrière.", en: "I stuck a pin in the doll's butt. {a.first} leapt up mid-meeting, howling like a seal. Spent the week sitting on a donut cushion. Best week of my career." }, fx: { happy: 12, karma: -6, rel: -5 }, mood: 'happy' },
      {
        label: { fr: 'Le micro-ondes', en: 'Microwave it' },
        out: [
          { w: 2, text: { fr: "J'ai mis la poupée trente secondes au micro-ondes. {a.first} a eu des bouffées de chaleur toute la journée, en sueur, dégoulinant{a:|e} sur ses dossiers. Personne ne lui a serré la main.", en: "I nuked the doll for thirty seconds. {a.first} had hot flashes all day, sweating, dripping onto files. Nobody would shake that hand." }, fx: { happy: 8, karma: -8 } },
          { w: 1, text: { fr: "J'ai laissé la poupée deux minutes au micro-ondes. {a.first} a gonflé en pleine réunion et a explosé comme un pop-corn géant. Les tripes ont repeint le PowerPoint. On m'a promu{|e} : « c'est ce qu'il aurait voulu ».", en: "I left the doll in for two minutes. {a.first} swelled up mid-meeting and exploded like giant popcorn. Guts all over the PowerPoint. I got promoted: 'it's what they would have wanted'." }, fx: { actorDie: true, promote: true, karma: -30, stress: 8, visual: 'gore' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Le faire danser', en: 'Make it dance' }, text: { fr: "J'ai fait danser la poupée pendant le séminaire de direction. {a.first} a fait la Macarena devant le conseil d'administration, puis un twerk. La vidéo tourne dans toute la boîte.", en: "I made the doll dance during the leadership retreat. {a.first} did the Macarena in front of the board, then twerked. The video is all over the company." }, fx: { happy: 10, karma: -4, rel: -10 }, mood: 'party' },
      { label: { fr: 'Rendre la poupée', en: 'Get rid of it' }, text: { fr: "J'ai jeté la poupée dans la Seine. Le lendemain, {a.first} est arrivé{a:|e} au bureau trempé{a:|e}, couvert{a:|e} d'algues, sans aucune explication. Je n'ai rien dit.", en: "I threw the doll in the river. The next day {a.first} showed up at work soaking wet, covered in algae, no explanation. I said nothing." }, fx: { karma: 2, happy: 4 } },
    ],
  },

  // ── Expérience du savant fou ──
  {
    id: 'wd_mad_scientist',
    icon: '🧪',
    cat: 'chaos',
    rating: 2,
    vars: { amount: [800, 4000] },
    scene: { place: 'hospital', mood: 'shock', prop: 'flask', fx: 'explosion' },
    when: { age: [18, 70] },
    weight: 3,
    cooldown: 12,
    text: {
      fr: ["Petite annonce : « Cobaye recherché, {$amount}, effets secondaires minimes. » Le Dr Frankenschnitzel t'accueille dans un sous-sol, avec un rire nerveux et trois yeux. Le troisième est dans un bocal.", "Un scientifique aux cheveux électrisés te propose {$amount} pour tester son « sérum d'évolution ». Il cligne de l'œil gauche toutes les deux secondes. Le liquide est fluo et fait des bulles en forme de crânes."],
      en: ["Classified ad: 'Test subject wanted, {$amount}, minimal side effects.' Dr. Frankenschnitzel welcomes you to a basement with a nervous laugh and three eyes. The third one is in a jar.", "A scientist with electrified hair offers you {$amount} to test his 'evolution serum'. His left eye twitches every two seconds. The liquid is neon and bubbles in little skull shapes."],
    },
    choices: [
      {
        label: { fr: 'Signer sans lire', en: 'Sign without reading' },
        out: [
          { w: 1, text: { fr: "Le sérum m'a donné un QI de génie... et un troisième téton sur le front. Je réfléchis vite, mais je porte des bonnets en été.", en: "The serum gave me genius-level IQ... and a third nipple on my forehead. I think fast, but I wear beanies in summer." }, fx: { money: 'amount', smarts: 20, looks: -12 }, mood: 'shock' },
          { w: 1, text: { fr: "Il m'a poussé une queue. Une vraie, avec des poils. Elle remue quand je suis content{|e}. Ma moitié a des questions. Moi aussi.", en: "I grew a tail. A real one, hairy. It wags when I'm happy. My partner has questions. So do I." }, fx: { money: 'amount', athletic: 10, looks: -8, happy: 3 } },
          { w: 1, text: { fr: "Rien ne s'est passé pendant une semaine. Puis je me suis mis{|e} à aimer les poubelles et à me frotter les mains comme une mouche. J'ai des yeux à facettes. Je vois tout. C'est atroce.", en: "Nothing happened for a week. Then I started loving garbage and rubbing my hands together like a fly. I have compound eyes. I see everything. It's awful." }, fx: { money: 'amount', looks: -15, smarts: -5, health: -8, happy: -10 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Lire le contrat', en: 'Read the contract' }, text: { fr: "J'ai lu le contrat. Article 47 : « Le cobaye accepte de devenir partiellement poulpe. » Je suis parti{|e} en courant. Le docteur m'a crié que j'étais « petit{|e} d'esprit ».", en: "I read the contract. Clause 47: 'The subject agrees to become partially octopus.' I ran. The doctor yelled that I was 'small-minded'." }, fx: { smarts: 4, stress: 3 } },
      {
        label: { fr: 'Boire tout le flacon', en: 'Chug the whole flask' },
        out: [
          { w: 2, text: { fr: "J'ai bu tout le flacon d'un coup. Mes muscles ont triplé de volume, mes vêtements ont explosé, j'ai soulevé une voiture. Puis j'ai vomi un liquide vert sur le docteur. Il a dit « fascinant ».", en: "I downed the whole flask. My muscles tripled, my clothes burst off, I lifted a car. Then I puked green goo on the doctor. He said 'fascinating'." }, fx: { athletic: 20, looks: 6, health: -10, money: 'amount' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai bu le flacon entier. J'ai gonflé comme un ballon, puis j'ai explosé en une pluie de confettis multicolores. Le docteur a noté « effet secondaire : mort festive ».", en: "I drank the whole flask. I inflated like a balloon, then burst into a shower of rainbow confetti. The doctor noted 'side effect: festive death'." }, fx: { die: { fr: "explosé{|e} en confettis après avoir bu tout le sérum d'un savant fou", en: "exploded into confetti after chugging a mad scientist's entire serum" }, visual: 'confetti' } },
        ],
      },
    ],
  },

  // ── Chaîne maudite → vengeance de la chaîne ──
  {
    id: 'wd_chain_letter',
    icon: '📨',
    cat: 'weird',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'phone' },
    when: { age: [18, 85], noFlag: 'wd_chainletter' },
    weight: 4,
    once: true,
    text: {
      fr: ["Message de ta tante : « TRANSFÈRE À 10 PERSONNES OU TU MOURRAS DANS 7 JOURS. Kévin ne l'a pas fait : il a été mangé par son propre chien. Sandrine l'a fait : elle a gagné un robot cuiseur. »", "Tu reçois un mail sans expéditeur : « Cette chaîne a été maudite par un moine en 1347. Transfère-la à 10 personnes ou ton anus se retournera comme une chaussette. »"],
      en: ["A message from your aunt: 'FORWARD TO 10 PEOPLE OR YOU WILL DIE IN 7 DAYS. Kevin didn't: he was eaten by his own dog. Sandra did: she won a food processor.'", "An email with no sender: 'This chain was cursed by a monk in 1347. Forward it to 10 people or your butthole will turn inside out like a sock.'"],
    },
    choices: [
      { label: { fr: 'Transférer à tout le monde', en: 'Forward to everyone' }, text: { fr: "J'ai transféré la chaîne à tous mes contacts, y compris mon patron, mon ex et mon proctologue. Je suis vivant{|e}. Je n'ai plus d'amis. Mais vivant{|e}.", en: "I forwarded it to all my contacts, including my boss, my ex and my proctologist. I'm alive. I have no friends left. But alive." }, fx: { happy: -4, karma: -4, stress: -4 } },
      { label: { fr: 'Ignorer', en: 'Ignore it' }, text: { fr: "J'ai supprimé le message en ricanant. Je ne crois pas à ces conneries. Le soir même, mon chat m'a regardé{|e} bizarrement. Très bizarrement.", en: "I deleted the message with a smirk. I don't believe in that crap. That same evening, my cat gave me a strange look. A very strange look." }, fx: { happy: 2, flag: 'wd_chainletter', schedule: { key: 'wd_chain_letter_doom', years: 1 } } },
      { label: { fr: 'Répondre « STOP »', en: "Reply 'STOP'" }, text: { fr: "J'ai répondu « STOP » à la malédiction. Ça a marché. Apparemment, même les malédictions de 1347 respectent le RGPD.", en: "I replied 'STOP' to the curse. It worked. Apparently even 1347 curses respect unsubscribe laws." }, fx: { happy: 5, smarts: 2 } },
    ],
  },
  {
    id: 'wd_chain_letter_doom',
    icon: '💀',
    cat: 'chaos',
    rating: 2,
    chainOnly: true,
    scene: { place: 'office', mood: 'shock', prop: 'vending' },
    when: { flag: 'wd_chainletter' },
    text: {
      fr: ["Un an après avoir ignoré la chaîne maudite, tout commence à mal tourner. Ta douche te brûle, ton ascenseur te déteste et le distributeur de snacks au boulot te regarde. Il penche. Vers toi.", "Ta tante te renvoie la chaîne : « Tu ne l'as pas transférée, hein ? » Au même moment, un piano passe devant ta fenêtre, suspendu à une corde qui s'effiloche."],
      en: ["A year after ignoring the cursed chain, everything starts going wrong. Your shower scalds you, your elevator hates you, and the snack machine at work is staring at you. It's leaning. Toward you.", "Your aunt re-sends the chain: 'You didn't forward it, did you?' At that exact moment, a piano passes your window, dangling from a fraying rope."],
    },
    choices: [
      { label: { fr: 'Transférer, VITE', en: 'Forward it NOW' }, text: { fr: "J'ai transféré la chaîne à 10 personnes en hurlant, mes doigts tremblaient. Le distributeur s'est redressé. Le piano est passé. La malédiction est sur quelqu'un d'autre maintenant. Désolé{|e}, mamie.", en: "I forwarded it to 10 people, screaming, fingers shaking. The vending machine straightened up. The piano passed by. The curse is on someone else now. Sorry, Grandma." }, fx: { stress: -10, karma: -6, unflag: 'wd_chainletter' } },
      {
        label: { fr: 'Narguer le destin', en: 'Taunt fate' },
        out: [
          { w: 3, text: { fr: "J'ai crié « MÊME PAS PEUR » au distributeur. Il est resté debout. Le pire qu'il m'est arrivé : un pigeon m'a chié dans la bouche pendant que je riais. La malédiction est levée, je crois.", en: "I yelled 'NOT SCARED' at the vending machine. It stayed upright. The worst thing that happened: a pigeon crapped in my mouth while I was laughing. Curse lifted, I think." }, fx: { happy: -4, health: -2, unflag: 'wd_chainletter', visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai secoué le distributeur pour lui montrer qui commande. Il m'est tombé dessus. 400 kilos de Kinder Bueno. On m'a ramassé{|e} à la spatule. Ma tante a transféré l'avis de décès à 10 personnes.", en: "I shook the vending machine to show it who's boss. It fell on me. 900 pounds of candy bars. They scraped me up with a spatula. My aunt forwarded the obituary to 10 people." }, fx: { die: { fr: "écrasé{|e} par un distributeur de snacks, un an après avoir ignoré une chaîne maudite", en: 'crushed by a vending machine a year after ignoring a cursed chain letter' }, visual: 'gore' } },
        ],
      },
    ],
  },

  // ── Dieu au téléphone ──
  {
    id: 'wd_god_phone',
    icon: '☎️',
    cat: 'chaos',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'phone', fx: 'ghost' },
    when: { age: [18, 90] },
    weight: 2,
    once: true,
    text: {
      fr: ["Numéro inconnu, indicatif +000. Une voix profonde, un peu pâteuse : « Allô ? C'est Dieu. Ouais, LE Dieu. Écoute, j'ai un peu bu, je voulais parler à quelqu'un, t'étais le prochain sur la liste. »", "Ton téléphone sonne à 4 h du matin. « Bonjour, ici Dieu, service client de la Création. Ce sera rapide : sur une échelle de 1 à 10, comment noteriez-vous votre existence ? »"],
      en: ["Unknown number, area code +000. A deep, slightly slurred voice: 'Hello? It's God. Yeah, THE God. Listen, I've had a few, I needed someone to talk to, you were next on the list.'", "Your phone rings at 4 a.m. 'Hello, this is God from Creation customer service. This'll be quick: on a scale of 1 to 10, how would you rate your existence?'"],
    },
    choices: [
      { label: { fr: 'Le sens de la vie ?', en: 'Meaning of life?' }, text: { fr: "J'ai demandé à Dieu le sens de la vie. Il a soupiré : « Honnêtement ? C'était un projet de fin d'études. J'ai eu 12/20. » Puis il a raccroché pour vomir.", en: "I asked God the meaning of life. He sighed: 'Honestly? It was a school project. I got a B-minus.' Then he hung up to throw up." }, fx: { smarts: 8, happy: -5 }, mood: 'shock' },
      { label: { fr: "Et l'ornithorynque ?", en: 'What about the platypus?' }, text: { fr: "J'ai demandé pourquoi l'ornithorynque existait. Dieu a explosé de rire pendant dix minutes : « C'était un pari avec un archange. J'ai mélangé les restes. » Il m'a béni{|e} pour la question.", en: "I asked why the platypus exists. God laughed for ten minutes straight: 'It was a bet with an archangel. I mixed up the leftovers.' He blessed me for asking." }, fx: { happy: 12, karma: 10, health: 8 }, mood: 'happy' },
      {
        label: { fr: "L'insulter", en: 'Insult Him' },
        out: [
          { w: 2, text: { fr: "J'ai dit à Dieu ce que je pensais des moustiques, des lundis et des hémorroïdes. Il a encaissé. Puis il a dit « t'as raison pour les moustiques » et m'a refilé des hémorroïdes. Par principe.", en: "I told God what I thought about mosquitoes, Mondays and hemorrhoids. He took it. Then he said 'fair point on mosquitoes' and gave me hemorrhoids. On principle." }, fx: { karma: -10, disease: 'hemorrhoids', happy: -4 } },
          { w: 1, text: { fr: "J'ai traité Dieu de « stagiaire bourré ». Il y a eu un silence. Puis un éclair est sorti du téléphone et m'a transformé{|e} en tas de cendres fumant, encore en train de tenir le combiné.", en: "I called God 'a drunk intern'. There was silence. Then a lightning bolt shot out of the phone and turned me into a smoking pile of ash, still holding the receiver." }, fx: { die: { fr: "foudroyé{|e} par un Dieu susceptible et légèrement ivre, au téléphone", en: 'smitten by a touchy, slightly drunk God, over the phone' }, visual: 'fire' } },
        ],
      },
      { label: { fr: 'Raccrocher', en: 'Hang up' }, text: { fr: "J'ai raccroché en disant « non merci, je ne suis pas intéressé{|e} ». J'ai bloqué le numéro. Depuis, il pleut uniquement sur ma maison.", en: "I hung up saying 'no thanks, not interested'. I blocked the number. Since then, it only rains on my house." }, fx: { happy: -3, stress: 3 } },
    ],
  },

  // ── Auto rating 2 ──
  {
    id: 'wd_auto_seagull',
    icon: '🐦',
    cat: 'weird',
    rating: 2,
    auto: true,
    scene: { fx: 'poop' },
    when: { age: [16, 90] },
    weight: 4,
    cooldown: 10,
    text: {
      fr: ["À la plage, une mouette m'a chié directement dans la bouche pendant que je bâillais. Précision chirurgicale. Le goût de sardine m'est resté trois jours.", "Un goéland m'a arraché mon kebab des mains, l'a mangé sur le toit d'en face, puis est revenu me chier sur la tête. Il voulait que je comprenne."],
      en: ["At the beach, a seagull crapped directly into my mouth while I was yawning. Surgical precision. The sardine aftertaste lasted three days.", "A seagull ripped my kebab out of my hands, ate it on the roof across the street, then came back to crap on my head. It wanted me to understand."],
    },
    fx: { happy: -4, health: -1 },
  },
  {
    id: 'wd_auto_toilet_jesus',
    icon: '🚽',
    cat: 'weird',
    rating: 2,
    auto: true,
    when: { age: [18, 90] },
    weight: 3,
    once: true,
    text: {
      fr: ["J'ai vu le visage de Jésus dans la cuvette de mes toilettes, dessiné par le calcaire. J'ai vendu la photo 2 000 € à un collectionneur. Je n'ose plus tirer la chasse.", "Après un chili trop épicé, j'ai vu la Vierge Marie dans ma cuvette. Des pèlerins ont fait la queue devant chez moi pendant une semaine. J'ai fait payer l'entrée."],
      en: ["I saw the face of Jesus in my toilet bowl, drawn in limescale. I sold the photo to a collector for $2,000. I no longer dare to flush.", "After an overly spicy chili, I saw the Virgin Mary in my toilet bowl. Pilgrims lined up outside my house for a week. I charged admission."],
    },
    fx: { money: 2000, karma: -3, happy: 4 },
  },
];
