// Dark events: moral dilemmas, revenge, gleeful accidents, morbid humour, karma payback,
// psycho moments, corporate/political satire and gross-out. All adult (18+). cat 'dark'.
import type { EventDef } from '@bl/sim';

export const darkEvents: EventDef[] = [
  // ═════════════════════════════ RATING 0 — versions gentilles ═════════════════════════════

  // ── Caddie fou : dilemme tout public ──
  {
    id: 'dk_cart_dilemma',
    icon: '🛒',
    cat: 'dark',
    rating: 0,
    scene: { place: 'park', mood: 'shock', prop: 'cart' },
    when: { age: [18, 80] },
    weight: 6,
    cooldown: 10,
    text: {
      fr: ["Sur le parking en pente du supermarché, un caddie plein de packs d'eau dévale tout seul. Trajectoire A : une mamie qui range ses courses. Trajectoire B : une Porsche neuve. Tu es pile à côté du caddie.", "Un caddie s'est échappé en haut du parking et prend de la vitesse. Il fonce soit vers un pique-nique d'anniversaire, soit vers la voiture du directeur du magasin. Tu peux le dévier d'un coup de pied.", "Un caddie fou dévale le parking. À gauche : {w:vehicle} qui sort du lavage. À droite : un pique-nique de retraités. Tu es la seule personne assez près pour choisir.", "Sur le parking, un caddie s'échappe. Il fonce vers {w:animal} qui traverse tranquillement, ou vers la voiture de ton chef. Ton pied hésite.", "Un caddie dévale la pente en sifflant {w:song}… Non, c'est un autoradio. Mais le caddie fonce bel et bien vers une mamie. Ou vers un 4x4 garé sur [[deux|trois|quatre]] places."],
      en: ["On the sloped supermarket parking lot, a cart full of water bottles is rolling by itself. Path A: a granny loading her groceries. Path B: a brand-new Porsche. You're right next to the cart.", "A runaway cart is gaining speed down the parking lot. It's heading either for a birthday picnic or for the store manager's car. One kick could steer it.", "A runaway cart is barreling down the parking lot. Left: {w:vehicle} fresh from the car wash. Right: a retirees' picnic. You're the only one close enough to choose.", "In the parking lot, a cart breaks loose. It's heading for {w:animal} calmly crossing, or for your boss's car. Your foot hesitates.", "A cart barrels down the slope whistling {w:song}… No, that's a car radio. But the cart really is heading for a granny. Or for an SUV parked across [[two|three|four]] spaces."],
    },
    choices: [
      { label: { fr: 'Dévier vers la Porsche', en: 'Steer into the Porsche' }, text: { fr: ["J'ai dévié le caddie vers la Porsche. Bruit de tôle magnifique. La mamie m'a offert un paquet de madeleines. Le propriétaire de la Porsche m'a traité{|e} de « communiste ».", "Le caddie a embouti la Porsche avec {w:sound}. Le propriétaire a hurlé. La mamie m'a fait un clin d'œil. On a pris la fuite ensemble."], en: ["I steered the cart into the Porsche. Beautiful crunch of metal. The granny gave me a pack of cookies. The Porsche owner called me a 'communist'.", "The cart crunched into the Porsche with {w:sound}. The owner screamed. The granny winked at me. We fled together."] }, fx: { karma: 6, happy: 6 }, mood: 'proud' },
      {
        label: { fr: 'Plonger pour l\'arrêter', en: 'Dive to stop it' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai plongé comme un gardien de but. Caddie arrêté, personne de blessé. On m'a applaudi{|e} au rayon fromage.", "J'ai stoppé le caddie d'un plaquage digne du rugby. Le directeur du magasin m'a offert {w:food}. J'ai mal partout, mais je suis un héros local."], en: ["I dove like a goalkeeper. Cart stopped, nobody hurt. I got a round of applause in the cheese aisle.", "I stopped the cart with a rugby tackle. The store manager gave me {w:food}. Everything hurts, but I'm a local hero."] }, fx: { karma: 8, athletic: 2, happy: 8 }, mood: 'proud' },
          { w: 1, text: { fr: ["J'ai plongé, raté le caddie et atterri dans une flaque d'huile de vidange. Le caddie s'est arrêté tout seul contre un plot. J'avais l'air d'un phoque.", "J'ai plongé, raté, et glissé jusque sous {w:vehicle}. Les pompiers ont dû me dégager. Le caddie s'est arrêté tout seul."], en: ["I dove, missed the cart and landed in a puddle of motor oil. The cart stopped on its own against a bollard. I looked like a seal.", "I dove, missed, and slid right under {w:vehicle}. The firefighters had to pull me out. The cart stopped all by itself."] }, fx: { looks: -3, happy: -3, karma: 3 } },
        ],
      },
      { label: { fr: 'Regarder, fasciné{|e}', en: 'Just watch, fascinated' }, text: { fr: ["Je n'ai rien fait. Le caddie a contourné tout le monde et fini dans le bac à fleurs. Personne n'a rien vu, sauf moi, qui n'ai rien fait.", "J'ai regardé, une barquette de frites à la main. Le caddie a percuté {w:object} et s'est arrêté net. Meilleur spectacle de l'année, et gratuit."], en: ["I did nothing. The cart missed everyone and ended up in a flower bed. Nobody saw anything except me, doing nothing.", "I watched, holding a tray of fries. The cart hit {w:object} and stopped dead. Best show of the year, and free."] }, fx: { karma: -2, stress: 2 } },
    ],
  },

  // ── Vieux monsieur perdu ──
  {
    id: 'dk_lost_grandpa',
    icon: '👴',
    cat: 'dark',
    rating: 0,
    scene: { place: 'park', mood: 'sad', prop: 'bench' },
    when: { age: [18, 75] },
    weight: 6,
    cooldown: 12,
    text: {
      fr: ["Un vieux monsieur en pyjama et chapeau melon t'attrape le bras au feu rouge : « Ah, Jean-Pierre ! Tu rentres enfin de la guerre ! » Tu ne t'appelles pas Jean-Pierre. Il y a un numéro de téléphone cousu dans son col.", "Un papi perdu tourne en rond devant la boulangerie en demandant où est garé son cheval. Il est persuadé que tu es son fils."],
      en: ["An old man in pajamas and a bowler hat grabs your arm at the crosswalk: 'Ah, Jean-Pierre! You're finally back from the war!' You're not Jean-Pierre. There's a phone number sewn into his collar.", "A lost grandpa keeps circling the bakery asking where he parked his horse. He's convinced you're his son."],
    },
    choices: [
      { label: { fr: 'Appeler le numéro', en: 'Call the number' }, text: { fr: "J'ai appelé le numéro. Sa fille est arrivée en larmes. Le papi m'a serré dans ses bras en me disant : « Tu as grandi, Jean-Pierre. » Je n'ai pas eu le cœur de le corriger.", en: "I called the number. His daughter showed up in tears. Grandpa hugged me and said: 'You've grown, Jean-Pierre.' I didn't have the heart to correct him." }, fx: { karma: 8, happy: 6 }, mood: 'happy' },
      { label: { fr: 'Jouer Jean-Pierre', en: 'Play Jean-Pierre' }, text: { fr: "J'ai joué Jean-Pierre tout l'après-midi. On a mangé un éclair, il m'a raconté « ma » guerre. Apparemment, j'ai été très {courageux|courageuse}. J'ai fini par le ramener à la maison de retraite. On m'attendait avec un chèque de remerciement de 20 balles.", en: "I played Jean-Pierre all afternoon. We had an éclair, he told me about 'my' war. Apparently I was very brave. I eventually walked him back to the retirement home. They gave me a 20-buck thank-you check." }, fx: { karma: 6, happy: 8, money: 20 } },
      { label: { fr: 'Faire semblant de rien', en: 'Pretend not to see' }, text: { fr: "J'ai traversé en regardant mon téléphone. Derrière moi, j'ai entendu « Jean-Pierre ? » une dernière fois. Ça m'a suivi{|e} toute la semaine.", en: "I crossed the street staring at my phone. Behind me, one last 'Jean-Pierre?'. It haunted me all week." }, fx: { karma: -6, happy: -4 }, mood: 'sad' },
    ],
  },

  // ── Paillettes pour l'ennemi ──
  {
    id: 'dk_enemy_glitter',
    icon: '✨',
    cat: 'dark',
    rating: 0,
    actor: 'enemy',
    scene: { place: 'home', mood: 'happy', prop: 'envelope', fx: 'confetti' },
    when: { age: [18, 80] },
    weight: 6,
    cooldown: 8,
    text: {
      fr: ["Sur un site louche, on peut envoyer anonymement une enveloppe-bombe à paillettes à n'importe qui. Tu penses immédiatement à {a.first}, ton ennemi{a:|e}.", "Tu tombes sur une boutique en ligne qui vend « 1 kilo de paillettes holographiques, livraison discrète ». Une image de {a.first} te traverse l'esprit."],
      en: ["A sketchy website lets you anonymously mail a glitter bomb envelope to anyone. You immediately think of {a.first}, your nemesis.", "You stumble upon an online shop selling '2 lbs of holographic glitter, discreet shipping'. {a.first}'s face flashes through your mind."],
    },
    choices: [
      { label: { fr: 'Envoyer la bombe', en: 'Send the bomb' }, text: { fr: "J'ai envoyé l'enveloppe. Trois semaines après, {a.first} scintillait encore. On en a retrouvé dans ses sourcils, dans son café, dans ses selfies. Les paillettes, c'est l'herpès des loisirs créatifs.", en: "I mailed the envelope. Three weeks later, {a.first} was still sparkling. Glitter in the eyebrows, in the coffee, in the selfies. Glitter is the herpes of arts and crafts." }, fx: { happy: 10, karma: -3, rel: -5 }, mood: 'happy' },
      { label: { fr: 'Lui envoyer des fleurs', en: 'Send flowers instead' }, text: { fr: "Je lui ai envoyé des fleurs, sans mot. {a.first} est devenu{a:|e} complètement paranoïaque, persuadé{a:|e} que c'était une menace. Le meilleur coup de ma vie, et c'était gentil.", en: "I sent flowers, no note. {a.first} became completely paranoid, convinced it was a threat. Best move of my life, and it was nice." }, fx: { karma: 4, happy: 6, rel: 5 } },
      { label: { fr: 'Me l\'envoyer à moi', en: 'Accidentally send to me' }, text: { fr: "J'ai rempli le formulaire trop vite et mis ma propre adresse. J'ai ouvert le colis. Je brille encore la nuit.", en: "I filled in the form too fast and put my own address. I opened the package. I still sparkle at night." }, fx: { happy: -4, looks: -2 } },
    ],
  },

  // ── Peau de banane cartoon ──
  {
    id: 'dk_banana_slip',
    icon: '🍌',
    cat: 'dark',
    rating: 0,
    scene: { place: 'office', mood: 'shock', prop: 'banana' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 10,
    text: {
      fr: ["Une peau de banane. Au milieu du hall, comme dans un dessin animé. Tu la vois trop tard. Ton pied, lui, l'a déjà trouvée.", "Le sol du supermarché vient d'être lavé. Le panneau « Sol glissant » est tombé. Et tu cours."],
      en: ["A banana peel. In the middle of the lobby, like a cartoon. You see it too late. Your foot already found it.", "The supermarket floor was just mopped. The 'Wet Floor' sign fell over. And you're running."],
    },
    choices: [
      {
        label: { fr: 'Tenter un salto', en: 'Attempt a backflip' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai transformé la chute en salto arrière, réception parfaite. Un enfant m'a demandé un autographe. Je l'ai signé en tremblant.", en: "I turned the fall into a backflip, perfect landing. A kid asked for my autograph. I signed it with shaking hands." }, fx: { happy: 10, fame: 2 }, mood: 'proud' },
          { w: 2, text: { fr: "J'ai fait un tour complet en l'air et atterri sur le coccyx avec un bruit de tambour. Quelqu'un a crié « 7,5 ! ».", en: "I did a full rotation in the air and landed on my tailbone with a drum sound. Someone yelled '7.5!'." }, fx: { health: -5, happy: -3, disease: 'back_pain' } },
        ],
      },
      { label: { fr: 'Accepter mon destin', en: 'Accept my fate' }, text: { fr: "Je me suis laissé{|e} tomber avec dignité, comme un chêne centenaire. Je suis resté{|e} allongé{|e} au sol cinq minutes pour réfléchir à ma vie. C'était reposant.", en: "I fell with dignity, like an ancient oak. I lay on the floor for five minutes to think about my life. It was relaxing." }, fx: { health: -2, stress: -4 } },
    ],
  },

  // ── Oubli de payer ──
  {
    id: 'dk_forgot_pay',
    icon: '🧾',
    cat: 'dark',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'bag' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 8,
    text: {
      fr: ["En rentrant, tu découvres un paquet de piles au fond de ton sac. Tu ne l'as pas payé. Le magasin est à vingt minutes. Il pleut.", "Ticket de caisse en main, tu réalises que la caissière a oublié de scanner le rôti à 34 balles. Tu es déjà dans la voiture."],
      en: ["Back home, you find a pack of batteries at the bottom of your bag. You didn't pay for it. The store is twenty minutes away. It's raining.", "Receipt in hand, you realize the cashier forgot to scan the 34-dollar roast. You're already in the car."],
    },
    choices: [
      { label: { fr: 'Retourner payer', en: 'Go back and pay' }, text: { fr: "Je suis retourné{|e} payer sous la pluie. La caissière m'a regardé{|e} comme un alien. Le vigile m'a serré la main. Je me suis senti{|e} comme un saint, un saint trempé.", en: "I went back in the rain to pay. The cashier looked at me like an alien. The security guard shook my hand. I felt like a saint, a soaking wet saint." }, fx: { karma: 6, happy: 3, health: -1 } },
      { label: { fr: 'Considérer ça un cadeau', en: 'Consider it a gift' }, text: { fr: "J'ai décidé que l'univers m'avait offert ce truc. Le soir même, il a été délicieux. Le lendemain, j'ai eu un petit pincement. Le surlendemain, plus rien.", en: "I decided the universe gave me this. It was delicious that same night. The next day, a tiny pang. The day after, nothing." }, fx: { karma: -3, happy: 3 } },
    ],
  },

  // ── Immeuble en feu, chat dedans ──
  {
    id: 'dk_burning_cat',
    icon: '🔥',
    cat: 'dark',
    rating: 0,
    scene: { place: 'apartment', mood: 'shock', prop: 'cat', fx: 'fire' },
    when: { age: [18, 70] },
    weight: 4,
    cooldown: 15,
    text: {
      fr: ["L'immeuble d'en face brûle. Les pompiers ne sont pas encore là. Au deuxième, un chat obèse miaule derrière une fenêtre, l'air de te juger.", "Fumée noire chez la voisine. Elle hurle depuis le trottoir : « MONSIEUR CROQUETTE EST DEDANS ! » Monsieur Croquette, c'est un chat de neuf kilos."],
      en: ["The building across the street is on fire. Firefighters aren't here yet. On the second floor, an obese cat meows behind a window, looking judgmental.", "Black smoke at the neighbor's. She screams from the sidewalk: 'MISTER KIBBLES IS INSIDE!' Mister Kibbles is a twenty-pound cat."],
    },
    choices: [
      {
        label: { fr: 'Foncer dans la fumée', en: 'Run into the smoke' },
        out: [
          { w: 2, text: { fr: "Je suis ressorti{|e} avec le chat dans les bras, noir{|e} de suie. Il m'a griffé{|e} au visage pour me remercier. Le journal local m'a appelé{|e} « le héros au mascara ».", en: "I came out with the cat in my arms, covered in soot. It scratched my face to say thanks. The local paper called me 'the mascara hero'." }, fx: { karma: 12, fame: 4, health: -5, happy: 8 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai cherché le chat partout. Il était déjà dehors depuis le début, assis sur une poubelle. Moi, j'ai eu besoin d'oxygène.", en: "I searched everywhere for the cat. It had been outside the whole time, sitting on a trash can. I needed oxygen." }, fx: { karma: 6, health: -10, disease: 'burns' } },
        ],
      },
      { label: { fr: 'Tendre une couverture', en: 'Hold out a blanket' }, text: { fr: "On a tendu une couverture à quatre voisins. Le chat a sauté, rebondi, et atterri dans la poussette d'un bébé, qui a rigolé. Tout le monde a pleuré de joie.", en: "Four neighbors and I held out a blanket. The cat jumped, bounced and landed in a baby stroller. The baby laughed. Everyone cried happy tears." }, fx: { karma: 8, happy: 8 }, mood: 'happy' },
      { label: { fr: 'Appeler les pompiers', en: 'Call the firefighters' }, text: { fr: "J'ai appelé les pompiers et attendu. Ils ont sorti le chat avec une grande échelle. J'ai été raisonnable. C'est moins bien pour les histoires de soirée.", en: "I called the firefighters and waited. They got the cat out with a ladder. I was reasonable. It's worse for party stories." }, fx: { karma: 3 } },
    ],
  },

  // ── Bon karma (récompense) ──
  {
    id: 'dk_karma_good',
    icon: '😇',
    cat: 'dark',
    rating: 0,
    vars: { amount: [2000, 12000] },
    scene: { place: 'home', mood: 'happy', prop: 'envelope', fx: 'money' },
    when: { age: [18, 95], stat: { karma: [80, 100] } },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["Une enveloppe sans expéditeur dans ta boîte. Dedans : {$amount} et un mot : « Il y a des années, tu m'as tenu la porte un jour où j'allais très mal. Merci. »", "Un notaire t'appelle. Une inconnue à qui tu avais un jour payé un café t'a couché{|e} sur son testament. Elle avait 98 ans et aucun héritier à part son perroquet."],
      en: ["An envelope with no sender in your mailbox. Inside: {$amount} and a note: 'Years ago, you held the door for me on a day I was in a very bad place. Thank you.'", "A lawyer calls. A stranger you once bought a coffee for put you in her will. She was 98 and had no heirs except her parrot."],
    },
    choices: [
      { label: { fr: 'Accepter, ému{|e}', en: 'Accept, moved' }, text: { fr: "J'ai accepté {$amount} en pleurant dans ma cuisine. Le bien, ça paie. Pas souvent, pas vite, mais ça paie.", en: "I accepted {$amount}, crying in my kitchen. Being good pays. Not often, not fast, but it pays." }, fx: { money: 'amount', happy: 12 }, mood: 'cry' },
      { label: { fr: 'Tout redonner', en: 'Give it all away' }, text: { fr: "J'ai donné l'argent à un refuge. Mon karma a débordé. Un arc-en-ciel est apparu au-dessus de chez moi. Probablement une coïncidence. Probablement.", en: "I gave the money to a shelter. My karma overflowed. A rainbow appeared over my house. Probably a coincidence. Probably." }, fx: { karma: 10, happy: 8 }, mood: 'proud' },
    ],
  },

  // ── Ligne journal : bon karma ──
  {
    id: 'dk_auto_karma_good',
    icon: '🍀',
    cat: 'dark',
    rating: 0,
    auto: true,
    scene: { place: 'park', mood: 'happy' },
    when: { age: [18, 95], stat: { karma: [80, 100] } },
    weight: 6,
    cooldown: 4,
    text: {
      fr: ["Tous les feux sont passés au vert sur mon chemin, toute la journée. Un pigeon a voulu me chier dessus, il a raté et touché un mec qui klaxonnait. Le karma, c'est un sniper.", "J'ai trouvé un billet de 50 dans une flaque, puis son propriétaire, qui m'a dit de le garder. Puis un chiot m'a choisi{|e} au parc. Je suis officiellement béni{|e}."],
      en: ["Every traffic light turned green for me all day. A pigeon tried to poop on me, missed, and hit a guy who was honking. Karma is a sniper.", "I found a 50 in a puddle, then its owner, who told me to keep it. Then a puppy picked me at the park. I am officially blessed."],
    },
    fx: { happy: 5, money: 50 },
  },

  // ── Ligne journal : presque mort ──
  {
    id: 'dk_auto_near_miss',
    icon: '🎹',
    cat: 'dark',
    rating: 0,
    auto: true,
    scene: { place: 'park', mood: 'shock' },
    when: { age: [18, 95] },
    weight: 5,
    cooldown: 8,
    text: {
      fr: ["Un piano est tombé d'un troisième étage, exactement là où j'étais une seconde avant. Je m'étais arrêté{|e} pour refaire mon lacet. Je ne remettrai plus jamais de chaussures à scratch.", "Un pot de fleurs s'est écrasé à vingt centimètres de ma tête. Là-haut, une dame a crié « Pardon, c'est le chat ! ». Le chat avait l'air très fier.", "Quelqu'un a lâché {w:object} d'un balcon. Ça m'a frôlé l'oreille à [[300|120|80]] km/h. Je me suis assis{|e} sur le trottoir pour remercier tous les saints du calendrier.", "Au passage piéton, {w:vehicle} a grillé le feu et m'a frôlé{|e} à dix centimètres. Le conducteur a crié « {w:exclaim} », comme si c'était moi le problème.", "J'ai raté mon train {w:excuse}. Il est resté bloqué neuf heures en rase campagne, avec {w:animal} sur les rails. Une fois de plus, ma nullité m'a sauvé{|e}."],
      en: ["A piano fell from the third floor, exactly where I'd been a second earlier. I'd stopped to tie my shoe. I will never wear Velcro again.", "A flowerpot smashed eight inches from my head. Upstairs, a lady shouted 'Sorry, it's the cat!'. The cat looked very proud.", "Someone dropped {w:object} from a balcony. It grazed my ear at [[180|75|50]] mph. I sat down on the curb to thank every saint on the calendar.", "At the crosswalk, {w:vehicle} ran the red light and missed me by four inches. The driver shouted '{w:exclaim}', as if I were the problem.", "I missed my train {w:excuse}. It got stuck for nine hours in the middle of nowhere, with {w:animal} on the tracks. Once again, my uselessness saved me."],
    },
    fx: { stress: 4, happy: 2 },
  },

  // ═════════════════════════════ RATING 1 — adulte ═════════════════════════════

  // ── Sac de sport à 10k → chaîne : les propriétaires ──
  {
    id: 'dk_cash_bag',
    icon: '💰',
    cat: 'dark',
    rating: 1,
    vars: { amount: [9000, 11000] },
    scene: { place: 'park', mood: 'shock', prop: 'bag', fx: 'money' },
    when: { age: [18, 80] },
    weight: 4,
    once: true,
    text: {
      fr: ["Dans un fossé, derrière la station-service, un sac de sport. Dedans : {$amount} en petites coupures, une banane, et un téléphone à clapet qui sonne.", "Tu trébuches sur un sac Adidas dans les buissons du parc. Dedans, {$amount} en liasses élastiquées, qui sentent un peu le cannabis et beaucoup les ennuis."],
      en: ["In a ditch behind the gas station, a gym bag. Inside: {$amount} in small bills, a banana, and a ringing flip phone.", "You trip over a gym bag in the park bushes. Inside, {$amount} in rubber-banded stacks that smell a little like weed and a lot like trouble."],
    },
    choices: [
      { label: { fr: 'Garder le magot', en: 'Keep the cash' }, text: { fr: "J'ai gardé {$amount}. J'ai jeté le téléphone dans un lac. J'ai mangé la banane. Je ne suis pas un monstre, je déteste le gaspillage.", en: "I kept {$amount}. I threw the phone in a lake. I ate the banana. I'm not a monster, I hate waste." }, fx: { money: 'amount', karma: -10, happy: 10, stress: 8, flag: 'dk_cash_kept', schedule: { key: 'dk_cash_owner', years: 1 } } },
      { label: { fr: 'Apporter aux flics', en: 'Bring it to the cops' }, text: { fr: "J'ai apporté le sac au commissariat. L'agent a compté, a dit « on va dire 6 000 », et m'a remercié{|e} en me tapotant l'épaule. Le soir, il avait une nouvelle montre.", en: "I brought the bag to the police station. The officer counted it, said 'let's call it 6,000', and thanked me with a pat on the back. That night he had a new watch." }, fx: { karma: 10, happy: -2 }, mood: 'neutral' },
      { label: { fr: 'Décrocher le téléphone', en: 'Answer the phone' }, text: { fr: "J'ai décroché. Une voix a dit : « T'as le sac ? Dépose-le à la benne verte, et y aura 500 pour toi. » J'ai déposé le sac. Il y avait bien 500 balles scotchés sous la benne. Le crime organisé, c'est d'un professionnalisme.", en: "I answered. A voice said: 'You got the bag? Drop it at the green dumpster and there's 500 for you.' I dropped the bag. There really was 500 taped under the dumpster. Organized crime is so professional." }, fx: { money: 500, karma: 2, stress: 4 } },
    ],
  },
  {
    id: 'dk_cash_owner',
    icon: '🕶️',
    cat: 'dark',
    rating: 1,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock', prop: 'door', fx: 'gore' },
    when: { flag: 'dk_cash_kept' },
    text: {
      fr: ["On frappe. Deux types en survêtement, cous de taureau, tenant un sécateur. « Salut. On cherche un sac Adidas. Il paraît que t'as changé de canapé récemment. »", "Deux armoires à glace sont assises dans ta cuisine quand tu rentres. L'une mange tes céréales. « Le sac. Ou on commence par les petits doigts. »"],
      en: ["A knock. Two guys in tracksuits, bull necks, holding pruning shears. 'Hey. We're looking for an Adidas bag. Heard you got a new couch recently.'", "Two human wardrobes are sitting in your kitchen when you get home. One is eating your cereal. 'The bag. Or we start with the pinkies.'"],
    },
    choices: [
      { label: { fr: 'Tout rembourser', en: 'Pay it all back' }, text: { fr: "J'ai remboursé, plus des « intérêts ». Ils m'ont laissé tous mes doigts et une carte de visite « au cas où tu cherches du taf ». J'ai mangé des pâtes pendant six mois.", en: "I paid it back, plus 'interest'. They let me keep all my fingers and gave me a business card 'in case you need work'. I ate pasta for six months." }, fx: { money: -12000, stress: 10, unflag: 'dk_cash_kept' } },
      {
        label: { fr: 'Nier en bloc', en: 'Deny everything' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai nié avec un tel aplomb qu'ils se sont excusés et sont repartis cambrioler mon voisin. Il avait le même canapé.", en: "I denied it so convincingly they apologized and went to rob my neighbor instead. He had the same couch." }, fx: { karma: -6, happy: 6, unflag: 'dk_cash_kept' } },
          { w: 2, rating: 2, text: { fr: "Clac. Mon auriculaire a fait un petit vol plané jusqu'à la gamelle du chat. Le chat l'a regardé. Puis il l'a mangé. J'ai payé avec les neuf doigts restants.", en: "Snip. My pinky did a little flight into the cat bowl. The cat looked at it. Then ate it. I paid with my remaining nine fingers." }, fx: { money: -10000, health: -15, disease: 'missing_finger', visual: 'gore', unflag: 'dk_cash_kept' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Sauter par la fenêtre', en: 'Jump out the window' }, text: { fr: "J'ai sauté par la fenêtre. Premier étage, haie de thuyas, cheville en vrac. J'ai déménagé dans une autre ville sous un faux nom. Je m'appelle Kévin, maintenant.", en: "I jumped out the window. Second floor, hedge, wrecked ankle. I moved to another city under a fake name. My name is Kevin now." }, fx: { health: -8, disease: 'sprain', stress: 12, moveOut: true, unflag: 'dk_cash_kept' } },
    ],
  },

  // ── Tricher pour sauver son job ──
  {
    id: 'dk_cheat_job',
    icon: '📉',
    cat: 'dark',
    rating: 1,
    actor: 'coworker',
    scene: { place: 'office', mood: 'shock', prop: 'laptop' },
    when: { age: [20, 65], job: true },
    weight: 6,
    cooldown: 10,
    text: {
      fr: ["Plan social chez {employer} : un poste sur deux saute. Le tien, ou celui de {a.first}. Tu as accès au fichier de ses chiffres. Il suffirait de déplacer une virgule.", "La direction compare tes résultats avec ceux de {a.first}. Le perdant dégage vendredi. Tu sais que {a.first} a pris trois arrêts maladie « bidons ». Tu as les photos de son week-end à Ibiza."],
      en: ["Layoffs at {employer}: one job in two is gone. Yours, or {a.first}'s. You have access to their numbers spreadsheet. You'd just need to move a decimal point.", "Management is comparing your results with {a.first}'s. The loser is out Friday. You know {a.first} took three 'fake' sick days. You have photos of their weekend in Ibiza."],
    },
    choices: [
      {
        label: { fr: 'Saboter ses chiffres', en: 'Sabotage their numbers' },
        out: [
          { w: 2, text: { fr: "J'ai déplacé la virgule. {a.first} a été viré{a:|e}. À son pot de départ, {a:il|elle} m'a remercié{|e} d'être « le seul vrai ami ici ». J'ai repris du gâteau.", en: "I moved the decimal point. {a.first} got fired. At their farewell drinks, they thanked me for being 'the only real friend here'. I had another slice of cake." }, fx: { karma: -14, perf: 15, rel: -10, actorGone: true }, mood: 'neutral' },
          { w: 1, text: { fr: "L'informatique a vu qui avait modifié le fichier. Ironie : j'ai été viré{|e} pour « manque d'intégrité » par un DRH sous enquête pour fraude.", en: "IT saw who edited the file. Irony: I got fired for 'lack of integrity' by an HR director under investigation for fraud." }, fx: { karma: -10, fired: true, happy: -12 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Balancer Ibiza', en: 'Leak the Ibiza photos' }, text: { fr: "J'ai « oublié » les photos d'Ibiza sur l'imprimante commune. {a.first} a sauté. Techniquement, je n'ai rien inventé. Juste imprimé en couleur.", en: "I 'forgot' the Ibiza photos on the shared printer. {a.first} got canned. Technically I didn't make anything up. I just printed it in color." }, fx: { karma: -8, perf: 8, rel: -25, actorRole: 'enemy' } },
      {
        label: { fr: 'Jouer franc-jeu', en: 'Play fair' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai joué franc-jeu et j'ai gardé ma place. Ça arrive. Une fois par siècle. J'en ai profité.", en: "I played fair and kept my job. It happens. Once a century. I enjoyed it." }, fx: { karma: 8, perf: 5, happy: 8 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai joué franc-jeu. {a.first} a triché. Devine qui pointe au chômage. Indice : c'est moi, avec ma conscience propre et mon frigo vide.", en: "I played fair. {a.first} cheated. Guess who's unemployed. Hint: it's me, with my clean conscience and empty fridge." }, fx: { karma: 10, fired: true, happy: -10 }, mood: 'sad' },
        ],
      },
    ],
  },

  // ── Euthanasier le chien de papi ──
  {
    id: 'dk_euthanize_dog',
    icon: '🐕',
    cat: 'dark',
    rating: 1,
    actor: 'grandparent',
    scene: { place: 'hospital', mood: 'sad', prop: 'dog' },
    when: { age: [18, 50] },
    weight: 4,
    once: true,
    text: {
      fr: ["{a.first}, {a.rel}, te confie Rex, son caniche de 21 ans. Aveugle, sourd, incontinent, il aboie contre les murs. « Emmène-le chez le véto. Fais ce qui doit être fait. Moi j'peux pas. » Rex te lèche la main.", "Le chien de {a.rel} {a.first} a dix-neuf ans, trois pattes et une odeur de fromage oublié. Ton grand-parent te tend la laisse en sanglotant : « Tu es le seul à avoir le cran. »"],
      en: ["{a.first}, your grandparent, hands you Rex, their 21-year-old poodle. Blind, deaf, incontinent, barks at walls. 'Take him to the vet. Do what has to be done. I can't.' Rex licks your hand.", "Your grandparent {a.first}'s dog is nineteen, has three legs and smells like forgotten cheese. They hand you the leash, sobbing: 'You're the only one with the guts.'"],
    },
    choices: [
      { label: { fr: 'Aller chez le véto', en: 'Go to the vet' }, text: { fr: "J'ai tenu Rex pendant la piqûre. Il est parti en remuant la queue, une dernière fois. J'ai pleuré dans la voiture. {a.my} m'a fait un gâteau qui avait le goût de larmes.", en: "I held Rex during the shot. He left wagging his tail, one last time. I cried in the car. My grandparent baked me a cake that tasted like tears." }, fx: { karma: 4, happy: -10, rel: 10 }, mood: 'cry' },
      { label: { fr: 'Le garder chez moi', en: 'Keep him at my place' }, text: { fr: "Je n'ai pas pu. J'ai ramené Rex chez moi. Il a vécu encore quatre ans, a fait pipi sur chacun de mes meubles et a survécu à {a.my}. Il est éternel. Il nous enterrera tous.", en: "I couldn't. I took Rex home. He lived four more years, peed on every piece of furniture I own and outlived my grandparent. He's immortal. He'll bury us all." }, fx: { karma: 6, happy: 4, newNpc: { role: 'pet', species: 'dog', age: [19, 21], abs: true } } },
      { label: { fr: 'Lui offrir une dernière journée', en: 'One perfect last day' }, text: { fr: "Avant le véto, j'ai offert à Rex une journée de rêve : steak, plage, roulade dans un poisson mort. Il est parti le ventre plein et puant, comme un roi.", en: "Before the vet, I gave Rex a dream day: steak, beach, rolling in a dead fish. He left with a full belly, stinking like a king." }, fx: { karma: 6, happy: -4, rel: 15 }, mood: 'sad' },
    ],
  },

  // ── Signaler la fraude du patron ──
  {
    id: 'dk_boss_fraud',
    icon: '🧮',
    cat: 'dark',
    rating: 1,
    actor: 'boss',
    vars: { amount: [15000, 60000] },
    scene: { place: 'office', mood: 'shock', prop: 'folder' },
    when: { age: [20, 65], job: true },
    weight: 5,
    cooldown: 15,
    text: {
      fr: ["En cherchant une agrafeuse, tu tombes sur le vrai bilan de {employer}. {a.first}, ton boss, facture à la boîte un « séminaire » qui ressemble beaucoup à un jet-ski, une maîtresse et un chalet.", "{a.first}, ton patron, a oublié de se déconnecter. À l'écran : un virement de la caisse de retraite des employés vers un compte aux îles Caïmans intitulé « MOI LOL »."],
      en: ["Looking for a stapler, you stumble on {employer}'s real books. {a.first}, your boss, has been billing the company for a 'seminar' that looks a lot like a jet ski, a mistress and a ski chalet.", "{a.first}, your boss, forgot to log out. On screen: a transfer from the employee pension fund to a Cayman Islands account named 'ME LOL'."],
    },
    choices: [
      {
        label: { fr: 'Le dénoncer', en: 'Report it' },
        out: [
          { w: 1, text: { fr: "J'ai tout envoyé à la direction et au fisc. {a.first} est parti{a:|e} menotté{a:|e}, en hurlant mon nom. Les collègues m'ont offert une bouteille. Le nouveau boss est pire, mais c'était un bon moment.", en: "I sent everything to the board and the tax office. {a.first} left in handcuffs, screaming my name. My coworkers gave me a bottle. The new boss is worse, but it was a good moment." }, fx: { karma: 12, happy: 10, actorGone: true, visual: 'police' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai dénoncé {a.first}. La direction a remercié le lanceur d'alerte en le licenciant pour « faute de loyauté ». {a.first} a eu une promotion. Le capitalisme, ça marche.", en: "I reported {a.first}. The board thanked the whistleblower by firing them for 'disloyalty'. {a.first} got promoted. Capitalism works." }, fx: { karma: 12, fired: true, happy: -10 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Faire chanter', en: 'Blackmail' }, text: { fr: "J'ai posé une capture d'écran sur son bureau avec un post-it : « Augmentation ? ». J'ai reçu {$amount} de « prime exceptionnelle ». On ne se regarde plus jamais dans les yeux.", en: "I left a screenshot on their desk with a sticky note: 'Raise?'. I got {$amount} as an 'exceptional bonus'. We never make eye contact anymore." }, fx: { money: 'amount', karma: -10, stress: 6, rel: -20 } },
      {
        label: { fr: 'Demander ma part', en: 'Ask for a cut' },
        out: [
          { w: 2, text: { fr: "{a.first} m'a mis{|e} dans la combine. {$amount} sur un compte offshore, et un mug « Team Caïmans ». Je dors très bien. Avec un œil ouvert.", en: "{a.first} cut me in. {$amount} in an offshore account, and a 'Team Caymans' mug. I sleep great. With one eye open." }, fx: { money: 'amount', karma: -15, rel: 15 } },
          { w: 1, text: { fr: "Le fisc est tombé sur nous trois semaines après. {a.first} a tout mis sur mon dos avec un talent d'acteur. J'ai découvert que « complicité » est un mot très long au tribunal.", en: "The tax office caught us three weeks later. {a.first} pinned it all on me with Oscar-worthy talent. I learned 'accessory' is a very long word in court." }, fx: { karma: -15, arrest: 'embezzle', visual: 'police' }, mood: 'shock' },
        ],
      },
    ],
  },

  // ── Rayer la voiture de l'ex ──
  {
    id: 'dk_key_car_ex',
    icon: '🔑',
    cat: 'dark',
    rating: 1,
    actor: 'ex',
    scene: { place: 'apartment', mood: 'angry', prop: 'car' },
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Il est 2 h du matin. La voiture de {a.first}, ton ex, est garée sous un lampadaire. Tu as tes clés à la main. Elles sont très pointues ce soir.", "Tu passes devant la voiture neuve de {a.first}, ton ex. Il y a un autocollant « Libre et {a:heureux|heureuse} » sur la vitre arrière. Ta clé te démange."],
      en: ["It's 2 a.m. {a.first}'s car, your ex, is parked under a streetlight. You have your keys in your hand. They feel very pointy tonight.", "You walk past {a.first}'s new car, your ex. There's a 'Single & Happy' sticker on the back window. Your key is itching."],
    },
    choices: [
      {
        label: { fr: 'Graver un message', en: 'Carve a message' },
        out: [
          { w: 2, text: { fr: "J'ai gravé « {a:MENTEUR|MENTEUSE} » sur toute la portière. Ça m'a pris 25 minutes et toute ma colère. J'ai très bien dormi.", en: "I carved 'LIAR' along the whole door. Took me 25 minutes and all my rage. I slept like a baby." }, fx: { happy: 10, karma: -8, rel: -20, heat: 5 } },
          { w: 1, text: { fr: "J'ai gravé « ORDURE » en lettres capitales sur la mauvaise voiture. C'était celle d'un juge. Il m'a reconnu{|e} au tribunal six mois plus tard.", en: "I carved 'SCUMBAG' in capital letters on the wrong car. It belonged to a judge. He recognized me in court six months later." }, fx: { karma: -8, arrest: 'vandal', visual: 'police' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Retourner l\'autocollant', en: 'Modify the sticker' }, text: { fr: "J'ai juste ajouté au marqueur « ...de mon herpès » sous l'autocollant. Pas de dégâts matériels. Des dégâts sociaux considérables.", en: "I just added '...with herpes' under the sticker with a marker. No property damage. Considerable social damage." }, fx: { happy: 8, karma: -4, rel: -10 }, mood: 'happy' },
      { label: { fr: 'Ranger mes clés', en: 'Put my keys away' }, text: { fr: "J'ai rangé mes clés. Je suis rentré{|e}. Je me suis senti{|e} adulte, mature et extrêmement frustré{|e}.", en: "I put my keys away. I went home. I felt adult, mature and extremely frustrated." }, fx: { karma: 4, stress: 4 } },
    ],
  },

  // ── Commander 40 pizzas à l'ex ──
  {
    id: 'dk_ex_pizza',
    icon: '🍕',
    cat: 'dark',
    rating: 1,
    actor: 'ex',
    scene: { place: 'home', mood: 'happy', prop: 'phone' },
    when: { age: [18, 70] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Tu as encore les identifiants de {a.first}, ton ex, sur l'appli de livraison. Et sur le site de l'Église de Scientologie. Et sur un site de vente de chèvres naines.", "Il paraît que {a.first}, ton ex, organise un dîner romantique ce soir avec sa nouvelle conquête. Tu as son adresse et un téléphone chargé."],
      en: ["You still have {a.first}'s login on the delivery app. Your ex. Also on a cult newsletter site. And on a pygmy goat marketplace.", "Rumor has it {a.first}, your ex, is hosting a romantic dinner tonight with their new fling. You have the address and a charged phone."],
    },
    choices: [
      { label: { fr: '40 pizzas anchois', en: '40 anchovy pizzas' }, text: { fr: "Quarante pizzas aux anchois, paiement à la livraison, pendant son dîner romantique. Le livreur a filmé. La vidéo a 300 000 vues. Je l'ai regardée 300 000 fois.", en: "Forty anchovy pizzas, cash on delivery, during the romantic dinner. The delivery guy filmed it. The video has 300,000 views. I watched it 300,000 times." }, fx: { happy: 12, karma: -5, rel: -15 }, mood: 'party' },
      { label: { fr: 'L\'abonner à une secte', en: 'Sign them up for a cult' }, text: { fr: "J'ai inscrit {a.first} à une secte qui fait du porte-à-porte le dimanche à 7 h. Ils sont très tenaces. Ils l'ont presque converti{a:|e}. Il a fallu une exfiltration.", en: "I signed {a.first} up for a cult that knocks on doors Sundays at 7 a.m. They're very persistent. They nearly converted them. It took an extraction." }, fx: { happy: 10, karma: -6, rel: -15 } },
      { label: { fr: 'Lui offrir une chèvre', en: 'Gift them a goat' }, text: { fr: "Une chèvre naine a été livrée chez {a.first} avec un nœud rose. Elle a mangé son canapé, ses chaussures et la moitié de sa nouvelle relation. Elle s'appelle Revanche.", en: "A pygmy goat was delivered to {a.first} with a pink bow. It ate the couch, the shoes and half of the new relationship. Her name is Revenge." }, fx: { happy: 12, karma: -4, money: -300, rel: -10 }, mood: 'happy' },
    ],
  },

  // ── Faire enlever la voiture du patron ──
  {
    id: 'dk_boss_tow',
    icon: '🚛',
    cat: 'dark',
    rating: 1,
    actor: 'boss',
    scene: { place: 'office', mood: 'happy', prop: 'car' },
    when: { age: [18, 65], job: true },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["{a.first}, ton boss, vient de te refuser ton congé pour l'enterrement de ta tante « parce que c'est pas un parent proche ». Sa Tesla est garée sur deux places handicapées. Tu as le numéro de la fourrière.", "{a.first} t'a encore volé une idée en réunion. Par la fenêtre, tu vois sa voiture de luxe, mal garée, comme tous les jours depuis cinq ans."],
      en: ["{a.first}, your boss, just denied your leave for your aunt's funeral 'because she's not close family'. Their Tesla is parked across two disabled spots. You have the tow company's number.", "{a.first} stole another one of your ideas in a meeting. Through the window you see their luxury car, badly parked, like every day for five years."],
    },
    choices: [
      { label: { fr: 'Appeler la fourrière', en: 'Call the tow truck' }, text: { fr: "J'ai appelé la fourrière. Depuis la fenêtre, avec les collègues, on a regardé la Tesla partir sur le plateau comme une baleine échouée. Quelqu'un a lancé La Marseillaise.", en: "I called the tow truck. From the window, with my coworkers, we watched the Tesla leave on the flatbed like a beached whale. Someone started singing the national anthem." }, fx: { happy: 10, karma: -2 }, mood: 'party' },
      { label: { fr: 'Sardine dans la ventilation', en: 'Sardine in the vents' }, rating: 2, text: { fr: "J'ai glissé une sardine dans la ventilation de sa voiture. Au bout d'une semaine en plein soleil, {a.first} a vendu la voiture à perte. Il a fallu trois prêtres pour exorciser l'habitacle.", en: "I slipped a sardine into their car's air vents. After a week in the sun, {a.first} sold the car at a loss. It took three priests to exorcise the interior." }, fx: { happy: 12, karma: -6, visual: 'poop' }, mood: 'happy' },
      { label: { fr: 'Ravaler ma fierté', en: 'Swallow my pride' }, text: { fr: "J'ai ravalé ma fierté. Elle avait un goût de café de machine et de résignation.", en: "I swallowed my pride. It tasted like vending-machine coffee and resignation." }, fx: { happy: -4, stress: 5, perf: 3 } },
    ],
  },

  // ── Cercueil en avance → chaîne ──
  {
    id: 'dk_coffin_advance',
    icon: '⚰️',
    cat: 'dark',
    rating: 1,
    scene: { place: 'cemetery', mood: 'neutral', prop: 'coffin' },
    when: { age: [45, 85], noFlag: 'dk_coffin' },
    weight: 4,
    once: true,
    text: {
      fr: ["Les pompes funèbres Lebrun font une promo : « Achetez votre cercueil maintenant, payez les prix d'aujourd'hui, mourez quand vous voulez ! » Le vendeur te fait essayer le modèle « Repos Royal ».", "Un démarcheur funéraire te prend en otage à la sortie du supermarché : « Vous savez combien coûtera un cercueil dans vingt ans ? Moi oui. Signez. »"],
      en: ["Lebrun Funeral Home is running a sale: 'Buy your coffin now, pay today's prices, die whenever you want!' The salesman has you try the 'Royal Rest' model.", "A funeral salesman takes you hostage outside the supermarket: 'Do you know what a coffin will cost in twenty years? I do. Sign here.'"],
    },
    choices: [
      { label: { fr: 'Acheter le cercueil', en: 'Buy the coffin' }, text: { fr: "J'ai acheté le Repos Royal, chêne massif, capitonnage satin. En attendant, il sert de table basse. Les invités posent leur verre dessus avec une certaine gêne.", en: "I bought the Royal Rest, solid oak, satin padding. Meanwhile, it's my coffee table. Guests put their drinks on it with a certain unease." }, fx: { money: -2500, happy: 4, flag: 'dk_coffin', schedule: { key: 'dk_coffin_use', years: 6 } } },
      { label: { fr: 'M\'allonger dedans', en: 'Lie down in it' }, text: { fr: "Je me suis allongé{|e} dans le cercueil d'exposition et je me suis endormi{|e}. Le magasin a fermé. Le gardien m'a entendu{|e} ronfler à 23 h et a appelé un exorciste.", en: "I lay down in the display coffin and fell asleep. The store closed. The night guard heard me snoring at 11 p.m. and called an exorcist." }, fx: { stress: -8, happy: 4 }, mood: 'sleepy' },
      { label: { fr: 'Fuir la mort', en: 'Flee death' }, text: { fr: "J'ai fui en hurlant que j'étais immortel{|le}. Le vendeur m'a crié : « On dit tous ça ! » Il a raison, le salaud.", en: "I ran away screaming that I'm immortal. The salesman yelled: 'They all say that!' He's right, the bastard." }, fx: { stress: 4 } },
    ],
  },
  {
    id: 'dk_coffin_use',
    icon: '🪦',
    cat: 'dark',
    rating: 1,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock', prop: 'coffin' },
    when: { flag: 'dk_coffin' },
    text: {
      fr: ["Ton cercueil-table basse commence à te regarder bizarrement. Le chat dort dedans. Ton beau-frère a proposé de « le tester » après six bières.", "Six ans que ton cercueil attend. Il a pris de la valeur : le même modèle coûte désormais le double. Tu es devenu{|e} {spéculateur|spéculatrice} funéraire."],
      en: ["Your coffin coffee table is starting to look at you funny. The cat sleeps in it. Your brother-in-law offered to 'test it' after six beers.", "Your coffin has been waiting six years. It gained value: the same model now costs double. You're a funeral speculator now."],
    },
    choices: [
      { label: { fr: 'Le revendre au double', en: 'Resell it for double' }, text: { fr: "J'ai revendu mon cercueil à une veuve pressée pour le double du prix. Le marché du cercueil, c'est le seul qui ne connaît jamais la crise.", en: "I resold my coffin to a hurried widow for double. The coffin market is the only one that never crashes." }, fx: { money: 5000, karma: -3, unflag: 'dk_coffin' } },
      {
        label: { fr: 'Laisser le beauf tester', en: 'Let him test it' },
        out: [
          { w: 2, text: { fr: "Mon beau-frère s'est allongé dedans, a refermé le couvercle « pour l'ambiance », et le loquet s'est bloqué. Il a hurlé deux heures. Il est sobre depuis. C'est le meilleur cadeau que je lui aie jamais fait.", en: "My brother-in-law lay down, closed the lid 'for atmosphere', and the latch jammed. He screamed for two hours. He's been sober ever since. Best gift I ever gave him." }, fx: { happy: 10, karma: 2 }, mood: 'happy' },
          { w: 1, text: { fr: "Il a vomi dedans. Six bières et un kebab, en position allongée, dans un satin crème. Le cercueil n'est plus présentable, même pour un mort.", en: "He threw up in it. Six beers and a kebab, lying down, in cream satin. The coffin is no longer presentable, even for a corpse." }, fx: { happy: -6, money: -2500, visual: 'poop', unflag: 'dk_coffin' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Dormir dedans', en: 'Sleep in it' }, text: { fr: "J'ai décidé de dormir dedans, façon Dracula. Mon dos ne m'a jamais remercié{|e}, mais mes cauchemars ont eu peur de moi.", en: "I decided to sleep in it, Dracula style. My back never thanked me, but my nightmares became scared of me." }, fx: { health: -3, stress: -6, disease: 'back_pain' }, mood: 'sleepy' },
    ],
  },

  // ── Écrire sa propre nécrologie ──
  {
    id: 'dk_obituary',
    icon: '📰',
    cat: 'dark',
    rating: 1,
    scene: { place: 'home', mood: 'neutral', prop: 'notebook' },
    when: { age: [30, 90] },
    weight: 5,
    once: true,
    text: {
      fr: ["Ton psy te demande d'écrire ta propre nécrologie « pour te recentrer sur l'essentiel ». Tu as une feuille blanche, un stylo, et zéro accomplissement notable.", "Atelier « Préparer sa mort sereinement » à la médiathèque. Exercice n°1 : rédiger ton avis de décès. La dame à côté de toi en est déjà à la page quatre."],
      en: ["Your therapist asks you to write your own obituary 'to refocus on what matters'. You have a blank page, a pen and zero notable achievements.", "Workshop 'Preparing for a Peaceful Death' at the library. Exercise one: write your death notice. The lady next to you is already on page four."],
    },
    choices: [
      { label: { fr: 'Mentir énormément', en: 'Lie enormously' }, text: { fr: "J'ai écrit : « Mort{|e} en sauvant un orphelinat d'un incendie, après avoir guéri le cancer et gagné Koh-Lanta. » Le psy a dit que c'était « intéressant ». Il a doublé ses tarifs.", en: "I wrote: 'Died saving an orphanage from a fire, after curing cancer and winning Survivor.' The therapist said it was 'interesting'. He doubled his rates." }, fx: { happy: 6, money: -200 } },
      { label: { fr: 'Être honnête', en: 'Be honest' }, text: { fr: "J'ai écrit la vérité : « A regardé beaucoup de séries. A été gentil{|le} avec son chat. Est mort{|e} en cherchant ses lunettes, qui étaient sur sa tête. » J'ai pleuré. Puis j'ai décidé de changer des trucs.", en: "I wrote the truth: 'Watched a lot of TV. Was nice to the cat. Died looking for their glasses, which were on their head.' I cried. Then I decided to change some things." }, fx: { smarts: 4, happy: -4, discipline: 8, flag: 'dk_obituary_written' }, mood: 'sad' },
      { label: { fr: 'Écrire celle de l\'animateur', en: 'Write the instructor\'s' }, text: { fr: "J'ai écrit la nécrologie de l'animateur à la place. Très détaillée. Très créative. Il a mis fin à l'atelier en avance et regardé sous sa voiture en partant.", en: "I wrote the instructor's obituary instead. Very detailed. Very creative. He ended the workshop early and checked under his car on the way out." }, fx: { happy: 8, karma: -3 }, mood: 'happy' },
    ],
  },

  // ── Mauvais enterrement ──
  {
    id: 'dk_wrong_funeral',
    icon: '💐',
    cat: 'dark',
    rating: 1,
    scene: { place: 'cemetery', mood: 'shock', prop: 'coffin' },
    when: { age: [18, 90] },
    weight: 5,
    once: true,
    text: {
      fr: ["Tu arrives à l'enterrement de ton ancien prof de maths. Vingt minutes après le début, tu réalises que le défunt dans le cercueil ouvert est une femme de 1 m 90 avec des tatouages de biker. Mauvaise salle.", "La cérémonie est très émouvante. Le problème, c'est que tu ne connais personne et que le prêtre parle d'un certain « Momo, roi du karaoké ». Toi, tu venais pour tonton Bernard."],
      en: ["You arrive at your old math teacher's funeral. Twenty minutes in, you realize the person in the open casket is a 6'3\" woman with biker tattoos. Wrong room.", "The ceremony is very moving. The problem is you don't know anyone and the priest keeps talking about a certain 'Mo, King of Karaoke'. You came for Uncle Bernard."],
    },
    choices: [
      { label: { fr: 'Faire un éloge quand même', en: 'Give a eulogy anyway' }, text: { fr: "Le prêtre a demandé si quelqu'un voulait dire un mot. Je me suis levé{|e} et j'ai improvisé dix minutes sur « notre amitié ». Tout le monde a pleuré. Les bikers m'ont invité{|e} à la veillée. J'y vais tous les ans maintenant.", en: "The priest asked if anyone wanted to say something. I stood up and improvised ten minutes about 'our friendship'. Everyone cried. The bikers invited me to the wake. I go every year now." }, fx: { happy: 10, karma: 2, fame: 1 }, mood: 'cry' },
      { label: { fr: 'Partir discrètement', en: 'Sneak out' }, text: { fr: "J'ai tenté de partir discrètement. Ma manche s'est accrochée à une couronne de fleurs que j'ai traînée jusqu'au parking. Le cortège m'a regardé{|e} faire.", en: "I tried to sneak out. My sleeve caught on a wreath which I dragged all the way to the parking lot. The whole procession watched." }, fx: { happy: -4, stress: 4 } },
      { label: { fr: 'Rester pour le buffet', en: 'Stay for the buffet' }, text: { fr: "Je suis resté{|e} pour le buffet. Il y avait des mini-quiches. Une veuve m'a demandé comment je connaissais Momo. J'ai dit « le karaoké ». Elle m'a serré{|e} dans ses bras pendant cinq minutes.", en: "I stayed for the buffet. There were mini quiches. A widow asked how I knew Mo. I said 'karaoke'. She hugged me for five minutes." }, fx: { happy: 6, karma: -2, weight: 0.01 } },
    ],
  },

  // ── Cryogénie ──
  {
    id: 'dk_cryogenics',
    icon: '🧊',
    cat: 'dark',
    rating: 1,
    scene: { place: 'hospital', mood: 'neutral', prop: 'freezer' },
    when: { age: [55, 95], money: [50000, 1e12] },
    weight: 3,
    once: true,
    text: {
      fr: ["Une start-up californienne te propose de congeler ta tête à ta mort pour 80 000. « On la décongèlera quand on saura la recoller sur un corps de robot. » Le commercial porte des tongs.", "Une brochure : « CryoForever — Ne mourez plus, mettez-vous en pause ! » Option tête seule ou corps entier. Le corps entier coûte le triple et prend de la place dans le congélo."],
      en: ["A California startup offers to freeze your head when you die for 80,000. 'We'll thaw it when we figure out how to stick it on a robot body.' The salesman is wearing flip-flops.", "A brochure: 'CryoForever — Don't die, just pause!' Head-only or full-body. Full body costs triple and takes up freezer space."],
    },
    choices: [
      { label: { fr: 'Option tête seule', en: 'Head-only package' }, text: { fr: "J'ai signé pour la tête seule. Ma tête finira dans un bidon d'azote entre celle d'un crypto-milliardaire et celle d'un chat persan. J'espère qu'on s'entendra.", en: "I signed up for head-only. My head will end up in a nitrogen tank between a crypto billionaire's and a Persian cat's. I hope we get along." }, fx: { money: -80000, happy: 8, flag: 'dk_frozen_head' } },
      { label: { fr: 'Demander une démo', en: 'Ask for a demo' }, text: { fr: "J'ai demandé une démo. Ils ont ouvert un congélateur : dedans, une tête, des glaces à l'eau et une pizza surgelée. « Ne touchez pas à la pizza, c'est celle de Kevin. »", en: "I asked for a demo. They opened a freezer: inside, a head, popsicles and a frozen pizza. 'Don't touch the pizza, it's Kevin's.'" }, fx: { happy: 4, smarts: 2 } },
      { label: { fr: 'Mourir comme tout le monde', en: 'Die like a normal person' }, text: { fr: "J'ai refusé. Je mourrai comme mes ancêtres : à contrecœur, et en me plaignant.", en: "I declined. I'll die like my ancestors: reluctantly, and complaining." }, fx: { karma: 2 } },
    ],
  },

  // ── Bon karma, version adulte ──
  {
    id: 'dk_karma_good_2',
    icon: '🌈',
    cat: 'dark',
    rating: 1,
    vars: { amount: [20000, 80000] },
    scene: { place: 'mansion', mood: 'happy', fx: 'money' },
    when: { age: [22, 80], stat: { karma: [80, 100] } },
    weight: 3,
    cooldown: 15,
    text: {
      fr: ["Le SDF à qui tu donnais des sandwichs il y a dix ans est devenu PDG d'une boîte de crypto. Il te retrouve sur Facebook et t'invite dans sa villa avec une enveloppe à ton nom.", "Tu avais rendu un téléphone perdu à un inconnu. C'était un milliardaire excentrique. Il veut te remercier, et il ne fait rien à moitié."],
      en: ["The homeless guy you gave sandwiches to ten years ago is now a crypto CEO. He finds you on Facebook and invites you to his villa with an envelope with your name on it.", "You once returned a lost phone to a stranger. He was an eccentric billionaire. He wants to thank you, and he never does anything halfway."],
    },
    choices: [
      { label: { fr: 'Accepter l\'enveloppe', en: 'Take the envelope' }, text: { fr: "Dans l'enveloppe : {$amount} et un sandwich jambon-beurre, « pour la boucle ». J'ai mangé le sandwich en premier. Par principe.", en: "In the envelope: {$amount} and a ham sandwich, 'to close the loop'. I ate the sandwich first. On principle." }, fx: { money: 'amount', happy: 15 }, mood: 'happy' },
      { label: { fr: 'Demander un job', en: 'Ask for a job' }, text: { fr: "Je lui ai demandé un boulot plutôt que de l'argent. Il m'a nommé{|e} « {Directeur|Directrice} de la Bienveillance ». Mon bureau a une vue mer et un toboggan.", en: "I asked for a job instead of money. He named me 'Chief Kindness Officer'. My office has an ocean view and a slide." }, fx: { money: 'amount', happy: 10, smarts: 2, open: 'jobs' } },
    ],
  },

  // ── Pensée intrusive en avion ──
  {
    id: 'dk_intrusive_plane',
    icon: '✈️',
    cat: 'dark',
    rating: 1,
    scene: { place: 'office', mood: 'shock', prop: 'plane' },
    when: { age: [18, 85] },
    weight: 5,
    cooldown: 10,
    text: {
      fr: ["Dans l'avion, au moment où tout le monde se tait pendant les consignes de sécurité, ton cerveau te souffle de hurler « J'AI UNE BOMBE DANS LE SLIP ». Juste pour voir.", "File d'attente à la sécurité de l'aéroport. Un agent te demande si tu transportes quelque chose de dangereux. Ta bouche est sur le point de répondre « Ma personnalité, gros ». C'est le moment de choisir."],
      en: ["On the plane, right when everyone goes silent for the safety demo, your brain suggests yelling 'I'VE GOT A BOMB IN MY UNDERPANTS'. Just to see.", "Airport security line. An officer asks if you're carrying anything dangerous. Your mouth is about to answer 'Just my personality, bro'. Time to choose."],
    },
    choices: [
      { label: { fr: 'Me taire', en: 'Stay quiet' }, text: { fr: "J'ai serré les dents pendant tout le vol. Mon voisin m'a demandé si j'allais bien. J'ai dit « très bien » d'une voix de psychopathe. Il a changé de siège.", en: "I clenched my teeth the whole flight. My neighbor asked if I was okay. I said 'very okay' in a psycho voice. He switched seats." }, fx: { stress: 6 } },
      { label: { fr: 'Faire la blague', en: 'Make the joke' }, text: { fr: "J'ai fait la blague. Trente secondes plus tard, j'étais plaqué{|e} au sol par un marshal de l'air de 120 kilos. Fouille intégrale, interrogatoire, interdiction de vol à vie. L'humour est un art incompris.", en: "I made the joke. Thirty seconds later, a 260-pound air marshal had me pinned to the floor. Strip search, interrogation, lifetime no-fly ban. Comedy is a misunderstood art." }, fx: { happy: -10, heat: 15, stress: 12, flag: 'dk_no_fly', visual: 'police' }, mood: 'shock' },
      { label: { fr: 'Le chuchoter au voisin', en: 'Whisper it to my neighbor' }, text: { fr: "Je l'ai chuchoté à mon voisin. C'était un humoriste. Il a pleuré de rire et m'a volé la blague. Il l'a faite dans son spectacle. Il a été arrêté. La justice existe.", en: "I whispered it to my neighbor. He was a comedian. He cried laughing and stole the joke. He did it in his show. He got arrested. Justice exists." }, fx: { happy: 8 }, mood: 'happy' },
    ],
  },

  // ── Fusée de milliardaire ──
  {
    id: 'dk_billionaire_rocket',
    icon: '🚀',
    cat: 'dark',
    rating: 1,
    scene: { place: 'stadium', mood: 'shock', prop: 'rocket', fx: 'explosion' },
    when: { age: [18, 75] },
    weight: 3,
    once: true,
    text: {
      fr: ["Tu as gagné un concours : une place dans la fusée privée du milliardaire Elon Bezoz pour un vol de 11 minutes dans l'espace. La fusée a la forme d'un… bon. Tout le monde voit à quoi elle ressemble.", "Le milliardaire Elon Bezoz offre un vol spatial gratuit au « citoyen lambda le plus méritant ». Les autres candidats se sont désistés après avoir lu les clauses. Tu es le seul à ne pas les avoir lues."],
      en: ["You won a contest: a seat on billionaire Elon Bezoz's private rocket for an 11-minute space flight. The rocket is shaped like a... well. Everyone can see what it looks like.", "Billionaire Elon Bezoz is offering a free space flight to 'the most deserving ordinary citizen'. Every other candidate withdrew after reading the terms. You're the only one who didn't read them."],
    },
    choices: [
      {
        label: { fr: 'Décoller', en: 'Blast off' },
        out: [
          { w: 3, text: { fr: "J'ai vu la Terre depuis l'espace. C'était beau, rond, et plein de gens qui triment pour payer la fusée d'un seul type. J'ai vomi en apesanteur. Le vomi a flotté jusqu'au visage d'Elon. Meilleur jour de ma vie.", en: "I saw Earth from space. It was beautiful, round and full of people working to pay for one guy's rocket. I threw up in zero gravity. It floated right into Elon's face. Best day of my life." }, fx: { happy: 15, fame: 8, followers: 20000 }, mood: 'happy' },
          { w: 1, rating: 2, text: { fr: "La fusée a explosé à 3 000 mètres. Elon a tweeté « Grosse donnée récoltée aujourd'hui ! 🚀 » avant que mes morceaux ne touchent le sol.", en: "The rocket exploded at 10,000 feet. Elon tweeted 'Gathered tons of data today! 🚀' before my pieces even hit the ground." }, fx: { die: { fr: "en confettis au-dessus du Texas, dans la fusée d'un milliardaire", en: "as confetti over Texas, inside a billionaire's rocket" }, visual: 'explosion' } },
        ],
      },
      { label: { fr: 'Lire les clauses', en: 'Read the terms' }, text: { fr: "Clause 47 : « En cas de décès, le passager cède ses organes et ses droits à l'image à BezozCorp. » J'ai donné ma place à un influenceur. On a eu de ses nouvelles. Pas toutes.", en: "Clause 47: 'In the event of death, the passenger surrenders their organs and image rights to BezozCorp.' I gave my seat to an influencer. We heard from him. Not all of him." }, fx: { smarts: 4, karma: -2 } },
    ],
  },

  // ── Ligne journal : fake news ──
  {
    id: 'dk_auto_fake_news',
    icon: '📺',
    cat: 'dark',
    rating: 1,
    auto: true,
    scene: { place: 'home', mood: 'shock' },
    when: { age: [18, 90] },
    weight: 4,
    once: true,
    text: {
      fr: ["Une chaîne d'info en continu a utilisé ma photo pour illustrer « Ce Français qui a épousé son aspirateur ». Je n'ai jamais épousé d'aspirateur. On est juste très proches.", "Un site de fake news a écrit que j'étais un reptilien. Depuis, des inconnus me demandent de cligner des yeux à l'horizontale. Ma mère aussi.", "Un site complotiste a publié que j'avais prouvé {w:conspiracy}. J'ai reçu [[300|2 000|12 000]] messages de soutien et une demande en mariage d'un ex-militaire.", "Un tabloïd m'a pris{|e} en photo {w:at_place} avec la légende « {w:celeb} méconnaissable : la descente aux enfers ». J'avais juste mal dormi.", "Une chaîne YouTube affirme que j'ai été vu{|e} {w:far_place} en train de {w:crime_small}. Je n'ai jamais quitté mon canapé. Mais l'idée me plaît."],
      en: ["A 24-hour news channel used my photo to illustrate 'The Man Who Married His Vacuum Cleaner'. I never married a vacuum. We're just very close.", "A fake news site claimed I'm a lizard person. Now strangers ask me to blink sideways. So does my mom.", "A conspiracy site published that I'd proven {w:conspiracy}. I got [[300|2,000|12,000]] messages of support and a marriage proposal from an ex-soldier.", "A tabloid snapped me {w:at_place} with the caption '{w:celeb} unrecognizable: the downward spiral'. I'd just slept badly.", "A YouTube channel claims I was spotted {w:far_place} {w:crime_small}. I've never left my couch. But I like the idea."],
    },
    fx: { fame: 4, happy: -3, followers: 3000 },
  },

  // ── Ligne journal : nécrologie ──
  {
    id: 'dk_auto_obit',
    icon: '🪦',
    cat: 'dark',
    rating: 1,
    auto: true,
    scene: { place: 'cemetery', mood: 'neutral' },
    when: { age: [40, 95] },
    weight: 4,
    cooldown: 10,
    text: {
      fr: ["J'ai visité le cimetière pour choisir mon emplacement. J'ai pris celui à côté du distributeur de boissons. Pour l'éternité, je veux du passage.", "J'ai fait la liste des gens qui viendront à mon enterrement. Puis la liste de ceux qui viendront juste pour vérifier. La deuxième est plus longue.", "J'ai rédigé ma propre nécrologie. Cause de la mort : « {w:disaster} ». Dernières volontés : qu'on passe {w:song} et que personne ne pleure. Sauf mon ex.", "J'ai demandé à être enterré{|e} avec {w:object}. Le notaire a noté sans poser de questions. Il en a vu d'autres.", "Aux pompes funèbres, le vendeur m'a laissé{|e} essayer un cercueil « juste pour voir ». C'était confortable. J'ai fait une sieste. On m'a réveillé{|e} {w:time}, sous les cris d'une famille en deuil."],
      en: ["I visited the cemetery to pick my plot. I took the one next to the vending machine. For eternity, I want foot traffic.", "I made a list of people who'll come to my funeral. Then a list of those who'll come just to make sure. The second one is longer.", "I wrote my own obituary. Cause of death: '{w:disaster}'. Last wishes: play {w:song} and nobody cries. Except my ex.", "I asked to be buried with {w:object}. The notary wrote it down without asking questions. He's seen worse.", "At the funeral home, the salesman let me try a coffin 'just to see'. It was comfy. I took a nap. I was woken {w:time} by the screams of a grieving family."],
    },
    fx: { stress: -2, happy: 1 },
  },

  // ── Ligne journal : milliardaires ──
  {
    id: 'dk_auto_billionaire',
    icon: '🛥️',
    cat: 'dark',
    rating: 1,
    auto: true,
    scene: { place: 'home', mood: 'angry' },
    when: { age: [18, 90] },
    weight: 4,
    cooldown: 6,
    text: {
      fr: ["Un milliardaire a dit à la télé que les jeunes devraient « arrêter les avocados toasts » pour devenir propriétaires. Je n'ai mangé que des pâtes cette année. J'ai toujours pas de maison. Lui a acheté une île.", "Le PDG de ma banque a gagné en une heure ce que je gagne en sept ans. Il a fait une déclaration sur « l'effort ». J'ai ri si fort que mon voisin a cogné au mur."],
      en: ["A billionaire said on TV young people should 'stop eating avocado toast' to buy a house. I ate only pasta this year. Still no house. He bought an island.", "My bank's CEO made in one hour what I make in seven years. He gave a statement about 'hard work'. I laughed so hard my neighbor banged on the wall."],
    },
    fx: { happy: -2, stress: 3 },
  },

  // ═════════════════════════════ RATING 2 — trash ═════════════════════════════

  // ── Dilemme du tramway IRL ──
  {
    id: 'dk_trolley',
    icon: '🚋',
    cat: 'dark',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'tram', fx: 'gore' },
    when: { age: [18, 85] },
    weight: 4,
    once: true,
    text: {
      fr: ["Ça arrive vraiment : un tramway sans freins fonce vers cinq influenceurs qui tournent un TikTok sur les rails. Tu es à côté de l'aiguillage. Sur l'autre voie, un seul type : il mange un kebab et n'a rien demandé.", "Le dilemme du tramway, en vrai. Voie A : cinq coachs en développement personnel en séminaire. Voie B : ton ancien prof de philo, celui qui t'avait posé exactement cette question au bac. Le levier est sous ta main."],
      en: ["It's actually happening: a brakeless tram is barreling toward five influencers filming a TikTok on the tracks. You're next to the switch. On the other track, one guy eating a kebab who asked for none of this.", "The trolley problem, for real. Track A: five life coaches at a seminar. Track B: your old philosophy teacher, the one who asked you this exact question on the final. The lever is under your hand."],
    },
    choices: [
      { label: { fr: 'Tirer le levier', en: 'Pull the lever' }, text: { fr: "J'ai tiré le levier. Le tram a transformé le type au kebab en sauce blanche, harissa incluse. Les influenceurs ont filmé, en pleurs, et fait 40 millions de vues. Ils m'ont tagué{|e}. Je n'ai pas commenté.", en: "I pulled the lever. The tram turned the kebab guy into garlic sauce, chili included. The influencers filmed it, sobbing, and got 40 million views. They tagged me. I didn't comment." }, fx: { karma: -6, happy: -10, stress: 12, visual: 'gore', disease: 'ptsd' }, mood: 'shock' },
      { label: { fr: 'Ne rien faire', en: 'Do nothing' }, text: { fr: "Je n'ai rien fait. Le tram a fauché les cinq, ralenti par leurs ring lights. Les caméras ont continué à filmer en direct. C'était leur meilleur score d'audience. Ils auraient été fiers.", en: "I did nothing. The tram mowed down all five, slowed by their ring lights. The cameras kept streaming live. It was their best engagement ever. They'd have been proud." }, fx: { karma: -4, stress: 10, visual: 'gore' }, mood: 'shock' },
      {
        label: { fr: 'Mettre le levier à mi-course', en: 'Jam the switch halfway' },
        out: [
          { w: 1, text: { fr: "J'ai bloqué l'aiguillage à mi-chemin. Le tram a déraillé, s'est couché sur le flanc et a glissé jusqu'à un fast-food. Zéro mort. Juste un nuggets géant écrasé. On m'a donné une médaille et un menu gratuit.", en: "I jammed the switch halfway. The tram derailed, tipped over and slid into a fast-food joint. Zero deaths. Just one giant crushed nugget. I got a medal and a free meal." }, fx: { karma: 12, fame: 6, happy: 12 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai bloqué l'aiguillage à mi-chemin. Le tram a déraillé et pris la seule direction que personne n'avait envisagée : moi.", en: "I jammed the switch halfway. The tram derailed and took the only path nobody considered: me." }, fx: { die: { fr: "écrasé{|e} par un tramway, en essayant de résoudre un dilemme philosophique", en: 'flattened by a tram while trying to solve a philosophy problem' }, visual: 'gore' } },
        ],
      },
    ],
  },

  // ── Colis d'un mourant → chaîne ──
  {
    id: 'dk_dying_package',
    icon: '📦',
    cat: 'dark',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock', prop: 'box', fx: 'gore' },
    when: { age: [18, 75] },
    weight: 4,
    once: true,
    text: {
      fr: ["Dans une ruelle, un homme en costume se vide de son sang contre une poubelle. Il te tend un colis humide : « Livre ça… à Monsieur Hugues… quai 12… ne l'ouvre surtout pas… » Puis il meurt. Le colis bouge légèrement.", "Un inconnu criblé de trous s'effondre dans tes bras en sortant d'un taxi. Dernières paroles : « Le paquet… quai 12… Hugues… il paiera… » Le paquet fait tic-tac. Ou c'est ton cœur."],
      en: ["In an alley, a man in a suit is bleeding out against a dumpster. He hands you a damp package: 'Deliver this... to Mr. Hughes... pier 12... don't open it...' Then he dies. The package moves slightly.", "A stranger full of holes collapses into your arms getting out of a cab. Last words: 'The package... pier 12... Hughes... he'll pay...' The package is ticking. Or that's your heart."],
    },
    choices: [
      { label: { fr: 'Livrer le colis', en: 'Deliver the package' }, text: { fr: "J'ai pris le colis et un taxi pour le quai 12. Le chauffeur a vu le sang sur mes mains et n'a rien dit. Il a juste monté le son de la radio.", en: "I took the package and a cab to pier 12. The driver saw the blood on my hands and said nothing. He just turned up the radio." }, fx: { stress: 8, chain: 'dk_package_delivery' } },
      {
        label: { fr: 'L\'ouvrir', en: 'Open it' },
        out: [
          { w: 1, text: { fr: "J'ai ouvert. Dedans : un doigt avec une chevalière, une clé USB et un hamster vivant, très stressé. J'ai gardé le hamster. J'ai jeté le reste dans la Seine. Le hamster s'appelle Témoin.", en: "I opened it. Inside: a finger wearing a signet ring, a USB stick and a very stressed live hamster. I kept the hamster. Threw the rest in the river. The hamster's name is Witness." }, fx: { stress: 10, happy: 2, newNpc: { role: 'pet', species: 'hamster', age: [1, 1], abs: true }, visual: 'gore' } },
          { w: 1, text: { fr: "J'ai ouvert. Une poudre bleue m'a explosé au visage. J'ai vu Dieu, il avait la tête de Jean-Pierre Pernaut. Je me suis réveillé{|e} trois jours plus tard dans un abribus, sans sourcils.", en: "I opened it. Blue powder exploded in my face. I saw God, he looked like a TV weatherman. I woke up three days later in a bus shelter, eyebrowless." }, fx: { health: -10, looks: -5, happy: -5 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Appeler la police', en: 'Call the police' }, text: { fr: "J'ai appelé la police. Ils m'ont gardé{|e} douze heures en garde à vue « par habitude ». En sortant, une berline noire m'a suivi{|e} jusqu'à chez moi. Elle est toujours garée en bas.", en: "I called the police. They held me twelve hours 'out of habit'. When I got out, a black sedan followed me home. It's still parked downstairs." }, fx: { karma: 6, stress: 10, heat: 5, visual: 'police' } },
    ],
  },
  {
    id: 'dk_package_delivery',
    icon: '🕴️',
    cat: 'dark',
    rating: 2,
    chainOnly: true,
    vars: { amount: [5000, 30000] },
    scene: { place: 'office', mood: 'shock', prop: 'box' },
    text: {
      fr: ["Quai 12. Un hangar. Monsieur Hugues est un petit homme en peignoir de soie, entouré de six gorilles et d'un caniche. « Tu as ouvert le paquet ? » Le caniche te fixe.", "Monsieur Hugues prend le colis du bout des doigts. « Il est mort comment, Lucien ? » Tous les regards se tournent vers toi."],
      en: ["Pier 12. A warehouse. Mr. Hughes is a small man in a silk robe surrounded by six gorillas and a poodle. 'Did you open the package?' The poodle stares at you.", "Mr. Hughes takes the package with his fingertips. 'How did Lucien die?' All eyes turn to you."],
    },
    choices: [
      { label: { fr: 'Dire la vérité', en: 'Tell the truth' }, text: { fr: "J'ai dit la vérité. Monsieur Hugues a hoché la tête, m'a donné {$amount} et m'a dit : « Les gens honnêtes, c'est rare. Si un jour tu veux bosser pour moi… » J'ai dit non. Poliment. Très poliment.", en: "I told the truth. Mr. Hughes nodded, gave me {$amount} and said: 'Honest people are rare. If you ever want to work for me...' I said no. Politely. Very politely." }, fx: { money: 'amount', karma: 4, flag: 'dk_hughes_friend' }, mood: 'proud' },
      {
        label: { fr: 'Inventer un truc héroïque', en: 'Make up something heroic' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai raconté que Lucien était mort en tuant douze ninjas. Monsieur Hugues a pleuré. Il m'a offert {$amount} et le caniche.", en: "I said Lucien died killing twelve ninjas. Mr. Hughes cried. He gave me {$amount} and the poodle." }, fx: { money: 'amount', happy: 8, newNpc: { role: 'pet', species: 'dog', age: [3, 6], abs: true } } },
          { w: 1, text: { fr: "Ils ont vu que je mentais. Un gorille m'a cassé les deux genoux « juste pour la forme ». Monsieur Hugues m'a quand même payé le taxi. Gentleman.", en: "They knew I was lying. A gorilla broke both my knees 'just as a formality'. Mr. Hughes still paid for my cab. A gentleman." }, fx: { health: -20, happy: -10, visual: 'gore' }, mood: 'cry' },
        ],
      },
    ],
  },

  // ── Faire accuser son ennemi ──
  {
    id: 'dk_frame_enemy',
    icon: '🕵️',
    cat: 'dark',
    rating: 2,
    actor: 'enemy',
    scene: { place: 'apartment', mood: 'angry', prop: 'bag', fx: 'police' },
    when: { age: [18, 80] },
    weight: 4,
    cooldown: 12,
    text: {
      fr: ["Il y a eu un cambriolage dans le quartier. La police cherche un suspect. Tu as les clés du garage de {a.first}, ton ennemi{a:|e}, et l'écran plat volé du voisin traîne bizarrement près de ta poubelle.", "Tu as trouvé la cagoule et les gants du braqueur de la supérette dans une poubelle. Tu sais exactement dans quel jardin les planquer : celui de {a.first}."],
      en: ["There was a burglary in the neighborhood. The police are looking for a suspect. You have the keys to {a.first}'s garage, your nemesis, and the neighbor's stolen TV is oddly lying near your trash.", "You found the corner-store robber's ski mask and gloves in a trash can. You know exactly whose yard to hide them in: {a.first}'s."],
    },
    choices: [
      {
        label: { fr: 'Planquer les preuves', en: 'Plant the evidence' },
        out: [
          { w: 2, text: { fr: "Les flics ont tout trouvé chez {a.first}. Je l'ai vu{a:|e} partir menotté{a:|e} depuis ma fenêtre, avec un bol de pop-corn. Pour la première fois de ma vie, j'ai compris les supervilains.", en: "The cops found everything at {a.first}'s. I watched them leave in cuffs from my window with a bowl of popcorn. For the first time in my life, I understood supervillains." }, fx: { karma: -20, happy: 12, actorGone: true, visual: 'police' }, mood: 'happy' },
          { w: 1, text: { fr: "Une caméra de sonnette m'a filmé{|e} en train de planquer la télé, en chantonnant. La vidéo a été diffusée au JT. {a.first} est venu{a:|e} me voir au parloir avec un grand sourire.", en: "A doorbell camera filmed me planting the TV, humming. The footage aired on the evening news. {a.first} visited me in jail with a huge grin." }, fx: { karma: -15, arrest: 'burglary', rel: -20 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Juste un appel anonyme', en: 'Just an anonymous tip' }, text: { fr: "J'ai passé un appel anonyme en prenant une voix de mamie. Les flics ont débarqué chez {a.first} à 6 h du matin, retourné son appartement, trouvé que dalle, et cassé son aquarium. Ça me suffit.", en: "I made an anonymous call in a granny voice. Cops raided {a.first}'s place at 6 a.m., trashed the apartment, found nothing, and broke the fish tank. Good enough for me." }, fx: { karma: -8, happy: 8, rel: -10 } },
      { label: { fr: 'Rendre la télé', en: 'Return the TV' }, text: { fr: "J'ai rendu la télé au voisin. Il m'a soupçonné{|e} quand même. Être gentil{|le}, c'est comme crier dans le vide, mais le vide te dénonce.", en: "I returned the TV to the neighbor. He suspected me anyway. Being good is like screaming into the void, except the void reports you." }, fx: { karma: 8, happy: -2 } },
    ],
  },

  // ── Le meilleur pote avoue un meurtre → chaîne ──
  {
    id: 'dk_friend_murder',
    icon: '🔪',
    cat: 'dark',
    rating: 2,
    actor: { role: 'anyFriend', minRel: 40 },
    scene: { place: 'home', mood: 'shock', prop: 'shovel', fx: 'gore' },
    when: { age: [18, 75] },
    weight: 3,
    once: true,
    text: {
      fr: ["3 h du matin. {a.first} sonne chez toi, couvert{a:|e} de terre, une pelle à la main. « J'ai tué quelqu'un. C'était un accident. Enfin, à moitié. Il m'a doublé{a:|e} au péage. » Le coffre de sa voiture est entrouvert.", "{a.first} t'appelle en chuchotant : « T'es mon meilleur pote, hein ? Parce que là j'ai un cadavre dans ma baignoire et un sac de chaux vive. »"],
      en: ["3 a.m. {a.first} rings your bell, covered in dirt, holding a shovel. 'I killed someone. It was an accident. Well, half. He cut me off at the toll booth.' Their car trunk is slightly open.", "{a.first} calls you, whispering: 'You're my best friend, right? Because I've got a corpse in my bathtub and a bag of quicklime.'"],
    },
    choices: [
      { label: { fr: 'Prendre une pelle', en: 'Grab a shovel' }, text: { fr: "J'ai pris une pelle. On a creusé jusqu'à l'aube en se racontant des souvenirs d'école. C'était la nuit la plus intime de notre amitié. Et la plus illégale.", en: "I grabbed a shovel. We dug until dawn swapping school memories. It was the most intimate night of our friendship. And the most illegal." }, fx: { karma: -20, rel: 30, stress: 15, flag: 'dk_accomplice', schedule: { key: 'dk_murder_return', years: 3 } }, mood: 'shock' },
      { label: { fr: 'Appeler la police', en: 'Call the cops' }, text: { fr: "J'ai appelé la police pendant que {a.first} pleurait sur mon canapé. Au procès, {a:il|elle} m'a regardé{|e} et a articulé « Judas ». Je ne mange plus jamais de pain perdu, c'était notre truc.", en: "I called the cops while {a.first} cried on my couch. At the trial, they looked at me and mouthed 'Judas'. I never eat French toast anymore, it was our thing." }, fx: { karma: 10, rel: -50, actorGone: true, happy: -10, visual: 'police' }, mood: 'cry' },
      { label: { fr: 'Fermer la porte', en: 'Close the door' }, text: { fr: "J'ai dit « J'ai rien entendu » et refermé la porte. Puis je suis allé{|e} me recoucher. Je n'ai pas dormi. Mais j'étais allongé{|e}, c'est déjà ça.", en: "I said 'I didn't hear anything' and closed the door. Then I went back to bed. I didn't sleep. But I was lying down, which counts." }, fx: { karma: -5, rel: -20, stress: 10 } },
    ],
  },
  {
    id: 'dk_murder_return',
    icon: '🦴',
    cat: 'dark',
    rating: 2,
    chainOnly: true,
    scene: { place: 'court', mood: 'shock', prop: 'bone', fx: 'police' },
    when: { flag: 'dk_accomplice' },
    text: {
      fr: ["Un chien a déterré un fémur dans la forêt où vous aviez creusé. Il l'a ramené fièrement à son maître, qui est capitaine de gendarmerie. L'enquêteur frappe à ta porte : « On peut parler du 14 mars ? »", "Les journaux parlent d'un « corps retrouvé par des randonneurs ». La photo montre ta pelle, avec ton nom gravé dessus. Merci, papa, pour ce cadeau personnalisé."],
      en: ["A dog dug up a femur in the forest where you buried it. It proudly brought it to its owner, a police captain. A detective knocks on your door: 'Can we talk about March 14th?'", "The papers mention a 'body found by hikers'. The photo shows your shovel, with your name engraved on it. Thanks, Dad, for the personalized gift."],
    },
    choices: [
      { label: { fr: 'Balancer mon pote', en: 'Rat out my friend' }, text: { fr: "J'ai tout balancé contre une immunité. Mon ancien meilleur ami a pris vingt ans. J'ai pris un nouveau nom, une nouvelle ville, et une méfiance absolue des chiens.", en: "I spilled everything for immunity. My former best friend got twenty years. I got a new name, a new city and a total distrust of dogs." }, fx: { karma: -8, stress: 10, unflag: 'dk_accomplice', moveOut: true } },
      {
        label: { fr: 'Me taire', en: 'Stay silent' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "Je n'ai rien dit. Ni moi, ni {a.first}. Faute de preuves, l'affaire a été classée. On se fait un barbecue tous les 14 mars. On ne parle jamais de rien.", en: "I said nothing. Neither did my friend. No evidence, case closed. We have a barbecue every March 14th. We never talk about anything." }, fx: { stress: -5, unflag: 'dk_accomplice' } },
          { w: 1, text: { fr: "Mon ADN était partout sur la pelle. Et sur le fémur. Ne me demandez pas comment.", en: "My DNA was all over the shovel. And the femur. Don't ask me how." }, fx: { arrest: 'murder', unflag: 'dk_accomplice' }, mood: 'cry' },
        ],
      },
    ],
  },

  // ── Laxatifs dans le café du boss ──
  {
    id: 'dk_laxative_boss',
    icon: '☕',
    cat: 'dark',
    rating: 2,
    actor: 'boss',
    scene: { place: 'office', mood: 'happy', prop: 'coffee', fx: 'poop' },
    when: { age: [18, 65], job: true },
    weight: 5,
    cooldown: 8,
    text: {
      fr: ["{a.first}, ton boss, va présenter les résultats devant le conseil d'administration dans dix minutes. Son café est posé sur ton bureau. Ta pharmacie de sac contient une plaquette de laxatifs « effet tonnerre ».", "Aujourd'hui, {a.first} fait son discours annuel « On est une famille » avant d'annoncer qu'il n'y aura pas de primes. Tu lui apportes son café. Tu as des laxatifs. Le destin est un barista."],
      en: ["{a.first}, your boss, is presenting results to the board in ten minutes. Their coffee is sitting on your desk. Your bag pharmacy contains a strip of 'thunder effect' laxatives.", "Today {a.first} gives the annual 'We're a family' speech before announcing there'll be no bonuses. You're bringing them coffee. You have laxatives. Destiny is a barista."],
    },
    choices: [
      {
        label: { fr: 'Dose de cheval', en: 'Horse dose' },
        out: [
          { w: 3, text: { fr: "À la slide 4, {a.first} s'est figé{a:|e}. À la slide 5, un son de trompette tibétaine a traversé son pantalon beige. À la slide 6, il n'y avait plus de pantalon beige. Le conseil a voté pour son remplacement à l'unanimité, à distance.", en: "At slide 4, {a.first} froze. At slide 5, a Tibetan horn sound came out of their beige pants. By slide 6, there were no more beige pants. The board voted unanimously to replace them, from a distance." }, fx: { happy: 15, karma: -8, perf: 5, visual: 'poop' }, mood: 'party' },
          { w: 1, text: { fr: "J'ai mélangé les tasses. Le café piégé, c'était le mien. Je l'ai bu cul sec pour avoir l'air détendu{|e}. Je n'ai pas eu le temps d'atteindre les toilettes. Ni le couloir. Ni ma chaise.", en: "I mixed up the mugs. The spiked coffee was mine. I chugged it to look relaxed. I didn't make it to the bathroom. Or the hallway. Or out of my chair." }, fx: { happy: -15, looks: -5, perf: -10, visual: 'poop' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Juste un peu de sel', en: 'Just a pinch of salt' }, text: { fr: "J'ai mis du sel au lieu du sucre. {a.first} a recraché sur le directeur financier. Petit plaisir, gros effet. Personne n'a fait caca. Je suis un{|e} artiste de la nuance.", en: "I used salt instead of sugar. {a.first} spat it all over the CFO. Small pleasure, big impact. Nobody pooped. I'm an artist of nuance." }, fx: { happy: 8, karma: -2 } },
      { label: { fr: 'Le boire moi-même', en: 'Drink it myself' }, text: { fr: "J'ai bu le café de {a.first}, normal, sans rien. Il était meilleur que le mien. Même son café a une meilleure vie que moi.", en: "I drank {a.first}'s coffee, normal, nothing in it. It was better than mine. Even their coffee has a better life than me." }, fx: { happy: -3 } },
    ],
  },

  // ── Poisson mort dans la tringle → chaîne ──
  {
    id: 'dk_enemy_fish',
    icon: '🐟',
    cat: 'dark',
    rating: 2,
    actor: 'enemy',
    scene: { place: 'apartment', mood: 'happy', prop: 'fish', fx: 'poop' },
    when: { age: [18, 80] },
    weight: 5,
    once: true,
    text: {
      fr: ["{a.first}, ton ennemi{a:|e}, part deux semaines en vacances et a laissé ses clés à la gardienne. La gardienne t'adore. Tu as un hareng et une perceuse.", "Tu as accès à l'appartement de {a.first} pendant son déménagement. Il y a des tringles à rideaux creuses. Il y a des crevettes en promo au marché. Le plan se dessine tout seul."],
      en: ["{a.first}, your nemesis, is leaving for two weeks and left the keys with the building manager. The building manager adores you. You have a herring and a drill.", "You have access to {a.first}'s place during their move. There are hollow curtain rods. Shrimp is on sale at the market. The plan writes itself."],
    },
    choices: [
      { label: { fr: 'Crevettes dans les tringles', en: 'Shrimp in the curtain rods' }, text: { fr: "J'ai bourré les tringles de crevettes crues. Au bout d'un mois, {a.first} a fait venir un désinfecteur, un plombier et un prêtre. Il a déménagé. Il a emporté les rideaux. Avec les tringles.", en: "I stuffed the curtain rods with raw shrimp. A month later {a.first} had called an exterminator, a plumber and a priest. They moved out. They took the curtains. With the rods." }, fx: { happy: 15, karma: -8, rel: -15, flag: 'dk_fish_war', schedule: { key: 'dk_enemy_retaliation', years: 1 } }, mood: 'party' },
      { label: { fr: 'Hareng sous le lit', en: 'Herring under the bed' }, text: { fr: "J'ai scotché un hareng sous le sommier. {a.first} a cru pendant trois semaines que c'était son haleine. {a:Il|Elle} s'est fait enlever deux dents de sagesse. Pour rien.", en: "I taped a herring under the bed frame. {a.first} spent three weeks thinking it was their own breath. They had two wisdom teeth removed. For nothing." }, fx: { happy: 12, karma: -6, rel: -10, flag: 'dk_fish_war', schedule: { key: 'dk_enemy_retaliation', years: 1 } }, mood: 'happy' },
      { label: { fr: 'Arroser ses plantes', en: 'Water their plants' }, text: { fr: "J'ai arrosé ses plantes. Toutes. Avec amour. {a.first} n'a jamais su que c'était moi. Ses plantes, si. Elles me saluent quand je passe.", en: "I watered their plants. All of them. With love. {a.first} never knew it was me. The plants did. They wave when I walk by." }, fx: { karma: 8, happy: 3 } },
    ],
  },
  {
    id: 'dk_enemy_retaliation',
    icon: '🧱',
    cat: 'dark',
    rating: 2,
    chainOnly: true,
    actor: 'enemy',
    scene: { place: 'home', mood: 'angry', prop: 'toilet', fx: 'poop' },
    when: { flag: 'dk_fish_war' },
    text: {
      fr: ["{a.first} a compris. Ce matin, ta cuvette des toilettes est remplie de béton à prise rapide. Il y a un poisson figé dedans, comme une signature.", "Vengeance de {a.first} : ta voiture a été entièrement recouverte de post-it. Sous les post-it, de la mayonnaise. Sous la mayonnaise, des asticots. Il fait 35 degrés."],
      en: ["{a.first} figured it out. This morning, your toilet bowl is filled with quick-set concrete. There's a fish frozen inside, like a signature.", "{a.first}'s revenge: your car is entirely covered in sticky notes. Under the sticky notes, mayonnaise. Under the mayonnaise, maggots. It's 95 degrees out."],
    },
    choices: [
      { label: { fr: 'Escalade nucléaire', en: 'Nuclear escalation' }, text: { fr: "J'ai riposté en abonnant {a.first} à 400 catalogues papier, en lui envoyant un mariachi tous les matins à 6 h et en faisant livrer une tonne de fumier dans son salon. La guerre est totale. On s'est jamais sentis aussi vivants.", en: "I retaliated by subscribing {a.first} to 400 paper catalogs, sending a mariachi band at 6 a.m. daily and dumping a ton of manure in their living room. It's total war. We've never felt so alive." }, fx: { happy: 10, karma: -10, money: -1500, rel: -20, stress: 8 }, mood: 'angry' },
      { label: { fr: 'Proposer une trêve', en: 'Offer a truce' }, text: { fr: "J'ai proposé une trêve autour d'un apéro. On a trinqué. On a ri. On a découvert qu'on détestait la même personne. On est devenus alliés. Ce pauvre Gérard ne sait pas ce qui l'attend.", en: "I offered a truce over drinks. We toasted. We laughed. We found out we hated the same person. We became allies. Poor Gerald has no idea what's coming." }, fx: { karma: 6, rel: 40, happy: 6, actorRole: 'friend', unflag: 'dk_fish_war' }, mood: 'happy' },
      { label: { fr: 'Payer le plombier', en: 'Pay the plumber' }, text: { fr: "J'ai payé le plombier et encaissé. Il m'a regardé{|e} en sortant le poisson du béton au marteau-piqueur : « Vous avez des ennemis intéressants. »", en: "I paid the plumber and took the hit. He looked at me while jackhammering the fish out of the concrete: 'You have interesting enemies.'" }, fx: { money: -900, happy: -5, unflag: 'dk_fish_war' } },
    ],
  },

  // ── Broyeur à végétaux ──
  {
    id: 'dk_woodchipper',
    icon: '🪵',
    cat: 'dark',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'woodchipper', fx: 'gore' },
    when: { age: [18, 80] },
    weight: 4,
    cooldown: 20,
    text: {
      fr: ["Tu aides ton oncle Gilbert à élaguer. Il a loué un broyeur à végétaux industriel, enlevé la protection « parce que ça ralentit », et porte une écharpe de trois mètres. Il te tend une branche.", "Le broyeur à végétaux rugit. Ta manche s'accroche à une branche. La branche entre dans la machine. Ta manche suit. Ton bras réfléchit."],
      en: ["You're helping Uncle Gilbert trim trees. He rented an industrial wood chipper, removed the safety guard 'because it slows things down', and is wearing a ten-foot scarf. He hands you a branch.", "The wood chipper roars. Your sleeve snags on a branch. The branch goes into the machine. Your sleeve follows. Your arm is considering it."],
    },
    choices: [
      {
        label: { fr: 'Tirer de toutes mes forces', en: 'Pull with all my might' },
        out: [
          { w: 3, odds: { athletic: 1 }, text: { fr: "J'ai tiré. Le broyeur a gardé ma manche, ma montre et le bout de mon petit doigt, qui a été recraché en confettis roses sur la haie du voisin. Le voisin a cru à une fête.", en: "I pulled. The chipper kept my sleeve, my watch and the tip of my pinky, which got spat out as pink confetti onto the neighbor's hedge. The neighbor thought it was a party." }, fx: { health: -12, disease: 'missing_finger', happy: -6, visual: 'gore' }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai tiré trop tard. Le broyeur a pris le bras jusqu'au coude et l'a transformé en paillis fertile. Les rosiers de tonton Gilbert n'ont jamais été aussi beaux.", en: "I pulled too late. The chipper took the arm up to the elbow and turned it into nutrient-rich mulch. Uncle Gilbert's roses have never looked better." }, fx: { health: -30, athletic: -10, happy: -15, disease: 'ptsd', visual: 'gore' }, mood: 'cry' },
          { w: 1, rating: 2, text: { fr: "J'ai tiré dans le mauvais sens. Le broyeur m'a avalé{|e} {entier|entière} avec un « slurp » de vieux siphon. Tonton Gilbert a rempli dix sacs de compost et dit : « Il aurait voulu servir. »", en: "I pulled the wrong way. The chipper swallowed me whole with an old-drain slurp. Uncle Gilbert filled ten compost bags and said: 'They'd have wanted to be useful.'" }, fx: { die: { fr: "transformé{|e} en paillis dans le jardin de tonton Gilbert", en: "turned into mulch in Uncle Gilbert's garden" }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Couper l\'écharpe de Gilbert', en: 'Cut Gilbert\'s scarf' }, text: { fr: "J'ai eu le réflexe de couper l'écharpe de tonton Gilbert avant qu'elle n'entre dans la machine. Il m'a engueulé{|e} : « C'était du cachemire ! » Il est vivant et ingrat. Comme toute la famille.", en: "I had the reflex to cut Uncle Gilbert's scarf before it went into the machine. He yelled at me: 'That was cashmere!' He's alive and ungrateful. Like the whole family." }, fx: { karma: 8, happy: 4 } },
      { label: { fr: 'Refuser, rester sur le banc', en: 'Refuse, sit on the bench' }, text: { fr: "J'ai refusé et regardé depuis le banc avec une bière. Tonton Gilbert a fini la journée avec un bandage et une écharpe plus courte. Moi, avec tous mes doigts.", en: "I refused and watched from the bench with a beer. Uncle Gilbert ended the day with a bandage and a shorter scarf. I ended it with all my fingers." }, fx: { happy: 4, stress: -2 } },
    ],
  },

  // ── Escalator ──
  {
    id: 'dk_escalator',
    icon: '🛗',
    cat: 'dark',
    rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'escalator', fx: 'gore' },
    when: { age: [18, 90] },
    weight: 5,
    cooldown: 20,
    text: {
      fr: ["Centre commercial, samedi. Ton lacet vient de se faire avaler par les dents de l'escalator. Il reste quatre mètres avant le peigne métallique. Il te tire doucement, comme un amoureux.", "L'escalator du métro a décidé de s'ouvrir sous tes pieds. Une marche vient de disparaître. En dessous, des engrenages et une odeur de graisse et de regrets."],
      en: ["Mall, Saturday. Your shoelace just got swallowed by the escalator teeth. Thirteen feet to the metal comb. It's pulling you gently, like a lover.", "The subway escalator decided to open up under your feet. A step just vanished. Below: gears and the smell of grease and regret."],
    },
    choices: [
      {
        label: { fr: 'Arracher ma chaussure', en: 'Rip off my shoe' },
        out: [
          { w: 3, text: { fr: "J'ai arraché ma chaussure. L'escalator l'a mâchée bruyamment puis recrachée en lamelles. J'ai fini mon shopping en chaussette, digne.", en: "I yanked my shoe off. The escalator chewed it loudly and spat it out in strips. I finished shopping in one sock, dignified." }, fx: { happy: -3, money: -80 } },
          { w: 1, text: { fr: "Trop tard : le peigne a croqué trois orteils avec un bruit de bretzel. Un enfant a ramassé le petit orteil en pensant que c'était une saucisse cocktail. Sa mère a hurlé jusqu'au deuxième étage.", en: "Too late: the comb crunched three toes with a pretzel sound. A kid picked up the pinky toe thinking it was a cocktail sausage. His mom screamed all the way to the second floor." }, fx: { health: -15, athletic: -4, happy: -8, visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Courir à contresens', en: 'Run against it' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai couru à contresens comme dans une salle de sport infernale. Après dix minutes, le vigile a appuyé sur le bouton rouge. J'ai perdu deux kilos. Merci, Satan.", en: "I ran against it like a hellish gym treadmill. After ten minutes, the guard hit the red button. I lost four pounds. Thanks, Satan." }, fx: { athletic: 4, weight: -0.02, happy: 4 } },
          { w: 1, rating: 2, text: { fr: "J'ai trébuché. L'escalator m'a tiré{|e} dans ses entrailles comme un spaghetti. Au sous-sol, les techniciens ont dû me sortir en plusieurs livraisons.", en: "I tripped. The escalator slurped me into its guts like a noodle. In the basement, the techs had to take me out in several deliveries." }, fx: { die: { fr: "aspiré{|e} par un escalator de centre commercial un samedi de soldes", en: 'sucked into a mall escalator on a Black Friday' }, visual: 'gore' } },
        ],
      },
    ],
  },

  // ── Ascenseur ──
  {
    id: 'dk_elevator',
    icon: '🛗',
    cat: 'dark',
    rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'elevator', fx: 'gore' },
    when: { age: [18, 90] },
    weight: 4,
    cooldown: 20,
    text: {
      fr: ["Au 14e étage, le câble de l'ascenseur fait « ploc ». La cabine chute. Ton collègue Thierry hurle « SAUTE AU DERNIER MOMENT, ÇA ANNULE LA CHUTE ! » Thierry a raté son bac deux fois.", "L'ascenseur s'arrête entre deux étages, portes à moitié ouvertes. Il y a 80 centimètres pour te faufiler. La cabine tremble. Il y a aussi un mec qui mange un sandwich au thon, très calme."],
      en: ["On the 14th floor, the elevator cable goes 'plink'. The car drops. Your coworker Terry screams 'JUMP AT THE LAST SECOND, IT CANCELS THE FALL!' Terry failed high school twice.", "The elevator stops between floors, doors half open. There's a 30-inch gap to squeeze through. The car is shaking. There's also a guy eating a tuna sandwich, very calm."],
    },
    choices: [
      {
        label: { fr: 'Sauter au dernier moment', en: 'Jump at the last second' },
        out: [
          { w: 2, text: { fr: "J'ai sauté. Ça n'annule rien du tout. Mes deux jambes se sont repliées comme une chaise de camping. Thierry, lui, s'est assis par terre et n'a rien eu. Il en parle encore à la machine à café.", en: "I jumped. It cancels nothing. Both my legs folded like a camping chair. Terry just sat on the floor and was fine. He still brags about it at the coffee machine." }, fx: { health: -25, athletic: -8, disease: 'broken_arm', visual: 'gore' }, mood: 'cry' },
          { w: 1, text: { fr: "Les freins d'urgence ont fonctionné au 2e étage. J'ai sauté quand même, par principe, et je me suis cogné{|e} la tête au plafond. Commotion.", en: "The emergency brakes kicked in at the 2nd floor. I jumped anyway, on principle, and hit my head on the ceiling. Concussion." }, fx: { health: -8, disease: 'concussion' } },
        ],
      },
      {
        label: { fr: 'Me faufiler dehors', en: 'Squeeze out' },
        out: [
          { w: 3, text: { fr: "Je me suis faufilé{|e} dehors pile avant que la cabine ne redémarre. Le mec au thon a continué son sandwich jusqu'au sous-sol. On ne l'a jamais revu. On sent encore le thon.", en: "I squeezed out right before the car started moving again. The tuna guy kept eating all the way to the basement. Never seen again. You can still smell the tuna." }, fx: { stress: 6, happy: 3 } },
          { w: 1, rating: 2, text: { fr: "J'étais à moitié sorti{|e} quand l'ascenseur a redémarré. La moitié du haut est au 6e. La moitié du bas a continué jusqu'au parking.", en: "I was halfway out when the elevator restarted. My top half is on the 6th floor. My bottom half went on to the parking garage." }, fx: { die: { fr: "coupé{|e} en deux par un ascenseur, entre le 6e et le parking", en: 'cut in half by an elevator somewhere between the 6th floor and the parking garage' }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Partager le sandwich', en: 'Share the sandwich' }, text: { fr: "J'ai demandé un bout de sandwich au mec. On a attendu les pompiers quatre heures en parlant de nos vies. Il s'appelle Bruno. Il est veuf. Il m'a appris la pêche. L'ascenseur m'a donné un ami.", en: "I asked the guy for a bite of his sandwich. We waited four hours for the firefighters, talking about our lives. His name is Bruno. Widower. He taught me fishing. The elevator gave me a friend." }, fx: { happy: 8, newNpc: { role: 'friend', age: [10, 25] } }, mood: 'happy' },
    ],
  },

  // ── Stand de feux d'artifice ──
  {
    id: 'dk_fireworks_stand',
    icon: '🎆',
    cat: 'dark',
    rating: 2,
    scene: { place: 'beach', mood: 'shock', prop: 'fireworks', fx: 'explosion' },
    when: { age: [18, 80] },
    weight: 4,
    cooldown: 20,
    text: {
      fr: ["Tu as trouvé un job d'été au stand de feux d'artifice « Kaboom Discount ». Ton collègue fume sa clope assis sur une caisse marquée « TRÈS INSTABLE ». Une étincelle tombe dans la caisse.", "Feu d'artifice municipal. Un tube de mortier est tombé sur le côté et vise désormais, très précisément, ton entrejambe. La mèche grésille."],
      en: ["You got a summer job at the 'Kaboom Discount' fireworks stand. Your coworker is smoking while sitting on a crate labeled 'VERY UNSTABLE'. A spark falls into the crate.", "Town fireworks show. A mortar tube tipped over and is now aiming, very precisely, at your crotch. The fuse is fizzling."],
    },
    choices: [
      {
        label: { fr: 'Plonger dans le sable', en: 'Dive into the sand' },
        out: [
          { w: 3, text: { fr: "J'ai plongé. Le stand entier a décollé comme Notre-Dame en version disco. J'ai perdu mes sourcils, mes cheveux et toute ma dignité, mais aucun membre. Le public a applaudi, croyant à un spectacle.", en: "I dove. The whole stand took off like a disco cathedral. I lost my eyebrows, my hair and all my dignity, but no limbs. The crowd applauded, thinking it was part of the show." }, fx: { health: -10, looks: -8, disease: 'burns', visual: 'explosion' }, mood: 'shock' },
          { w: 1, text: { fr: "Une fusée m'a rattrapé{|e} en plein plongeon et m'a arraché deux doigts avant d'exploser en cœur rose au-dessus de la plage. C'était très joli, honnêtement.", en: "A rocket caught me mid-dive and took two fingers before bursting into a pink heart over the beach. It was very pretty, honestly." }, fx: { health: -20, disease: 'missing_finger', happy: -10, visual: 'gore' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Shooter dans le tube', en: 'Kick the tube away' }, text: { fr: "J'ai shooté dans le tube. Il a pivoté et tiré droit dans le hors-bord du maire, qui a explosé en bouquet final. Le maire était dessus. Il va bien, mais il est désormais chauve et en caleçon pour toujours dans l'esprit des gens.", en: "I kicked the tube. It spun and fired straight into the mayor's speedboat, which exploded as a grand finale. The mayor was on it. He's fine, but now he's forever bald and in his boxers in everyone's mind." }, fx: { happy: 10, fame: 4, heat: 5, visual: 'explosion' }, mood: 'party' },
    ],
  },

  // ── Bouteille de gaz du barbecue ──
  {
    id: 'dk_propane',
    icon: '🍖',
    cat: 'dark',
    rating: 2,
    scene: { place: 'park', mood: 'party', prop: 'grill', fx: 'explosion' },
    when: { age: [18, 85] },
    weight: 4,
    cooldown: 20,
    text: {
      fr: ["Barbecue de l'entreprise. La bouteille de gaz siffle comme une cocotte-minute en colère. Ton chef, en tablier « Kiss the Chef », approche un briquet « pour voir d'où ça fuit ».", "Le tuyau de la bouteille de propane est fendu. Ça sent l'œuf pourri et la mort. Ton beau-père s'apprête à allumer le barbecue avec une allumette, en chantant du Johnny."],
      en: ["Company barbecue. The propane tank is hissing like an angry pressure cooker. Your manager, in a 'Kiss the Chef' apron, brings a lighter close 'to see where it's leaking'.", "The propane hose is cracked. It smells like rotten eggs and death. Your stepdad is about to light the grill with a match, singing classic rock."],
    },
    choices: [
      {
        label: { fr: 'Hurler et courir', en: 'Scream and run' },
        out: [
          { w: 3, text: { fr: "J'ai couru. La bouteille a décollé comme une fusée de la NASA, traversé le toit du voisin et atterri dans sa piscine. Les merguez ont plu sur le quartier pendant une minute. Les chiens du coin s'en souviennent comme du plus beau jour de leur vie.", en: "I ran. The tank launched like a NASA rocket, went through the neighbor's roof and landed in his pool. Sausages rained over the neighborhood for a full minute. Local dogs remember it as the best day of their lives." }, fx: { happy: 6, stress: 6, visual: 'explosion' }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai couru, mais pas assez vite. Le souffle m'a projeté{|e} dans la haie, cul en l'air, une côte de porc collée au visage. J'ai gardé la cicatrice. Elle a la forme d'une côte de porc.", en: "I ran, but not fast enough. The blast threw me into the hedge, butt up, a pork chop stuck to my face. I kept the scar. It's shaped like a pork chop." }, fx: { health: -15, looks: -6, disease: 'burns', visual: 'explosion' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Fermer la vanne', en: 'Close the valve' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai fermé la vanne. Tout le monde a mangé ses saucisses sans savoir qu'il avait failli être saucisse. Le chef a été promu pour « gestion de crise ».", en: "I closed the valve. Everyone ate their sausages without knowing they almost became sausage. The manager got promoted for 'crisis management'." }, fx: { karma: 8, happy: -2 } },
          { w: 1, rating: 2, text: { fr: "J'ai fermé la vanne une demi-seconde après l'allumette. On a retrouvé ma tête dans un arbre, souriante. Un écureuil y vit maintenant.", en: "I closed the valve half a second after the match. They found my head in a tree, smiling. A squirrel lives in it now." }, fx: { die: { fr: "en explosant à un barbecue d'entreprise, à côté du rayon merguez", en: 'exploding at a company barbecue next to the sausages' }, visual: 'explosion' } },
        ],
      },
    ],
  },

  // ── Attaque d'ours ──
  {
    id: 'dk_bear',
    icon: '🐻',
    cat: 'dark',
    rating: 2,
    actor: { role: 'anyFriend' },
    scene: { place: 'park', mood: 'shock', prop: 'tent', fx: 'gore' },
    when: { age: [18, 80] },
    weight: 3,
    cooldown: 25,
    text: {
      fr: ["Camping avec {a.first}. À 4 h du matin, un grizzli de 400 kilos ouvre votre tente comme un paquet de chips. Il sent le saumon et la mauvaise humeur. {a.first} chuchote : « Fais le mort. »", "Randonnée avec {a.first}. Un ours brun sort des fourrés. Tu te souviens d'une règle : tu n'as pas besoin de courir plus vite que l'ours. Juste plus vite que {a.first}."],
      en: ["Camping with {a.first}. At 4 a.m., a 900-pound grizzly opens your tent like a bag of chips. It smells like salmon and bad attitude. {a.first} whispers: 'Play dead.'", "Hiking with {a.first}. A brown bear walks out of the bushes. You remember a rule: you don't have to outrun the bear. Just {a.first}."],
    },
    choices: [
      {
        label: { fr: 'Faire le mort', en: 'Play dead' },
        out: [
          { w: 2, text: { fr: "J'ai fait le mort. L'ours m'a reniflé, léché l'oreille, puis il a mangé tout notre saucisson et est reparti. J'ai fait pipi dans mon duvet. Je l'assume.", en: "I played dead. The bear sniffed me, licked my ear, ate all our salami and left. I peed in my sleeping bag. I own it." }, fx: { stress: 10, happy: -2 } },
          { w: 1, text: { fr: "J'ai fait le mort de manière trop convaincante. L'ours a goûté ma fesse gauche. Il n'a pas aimé. Je ne sais pas si je dois être soulagé{|e} ou vexé{|e}.", en: "I played dead too convincingly. The bear tasted my left butt cheek. It didn't like it. I don't know whether to be relieved or offended." }, fx: { health: -18, looks: -4, visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Courir plus vite que {a.first}', en: 'Outrun {a.first}' },
        out: [
          { w: 2, text: { fr: "J'ai couru plus vite que {a.first}. L'ours l'a rattrapé{a:|e} et lui a arraché une oreille et un bout de mollet. {a:Il|Elle} a survécu. Notre amitié, non.", en: "I outran {a.first}. The bear caught them and took an ear and a chunk of calf. They survived. Our friendship didn't." }, fx: { karma: -15, rel: -50, actorRole: 'enemy', visual: 'gore' } },
          { w: 1, text: { fr: "{a.first} m'a fait un croche-patte. On avait eu la même idée. L'ours m'a mâchouillé le bras pendant que {a.first} filmait en courant. 2 millions de vues.", en: "{a.first} tripped me. We'd had the same idea. The bear chewed on my arm while {a.first} filmed while running. 2 million views." }, fx: { health: -22, disease: 'broken_arm', rel: -40, followers: 15000, visual: 'gore' }, mood: 'cry' },
          { w: 1, rating: 2, text: { fr: "On a couru tous les deux. L'ours était plus rapide que nous deux. Il a été très efficace.", en: "We both ran. The bear was faster than both of us. It was very efficient." }, fx: { die: { fr: "dévoré{|e} par un grizzli, en essayant de semer un ami", en: 'eaten by a grizzly while trying to ditch a friend' }, actorDie: true, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Lui balancer le saumon', en: 'Throw it the salmon' }, text: { fr: "J'ai balancé notre pavé de saumon le plus loin possible. L'ours l'a suivi. {a.first} m'a appelé{|e} « le génie du saumon » toute la soirée. C'est mon nouveau surnom.", en: "I threw our salmon fillet as far as I could. The bear followed it. {a.first} called me 'the salmon genius' all evening. It's my new nickname." }, fx: { rel: 15, happy: 8 }, mood: 'proud' },
    ],
  },

  // ── Camion-poubelle ──
  {
    id: 'dk_garbage_truck',
    icon: '🚚',
    cat: 'dark',
    rating: 2,
    scene: { place: 'apartment', mood: 'sleepy', prop: 'dumpster', fx: 'gore' },
    when: { age: [18, 70] },
    weight: 4,
    cooldown: 20,
    text: {
      fr: ["Lendemain de soirée. Tu te réveilles dans une benne à ordures, au chaud entre un matelas et un sac de couches. Un bruit hydraulique approche. Le camion-poubelle est là, et il a faim.", "Tu traverses en lisant tes messages. Un camion-poubelle recule en bipant. Bip. Bip. Bip. Ton téléphone affiche « Tu viens ce soir ? »"],
      en: ["Morning after a party. You wake up in a dumpster, cozy between a mattress and a bag of diapers. A hydraulic noise is approaching. The garbage truck is here, and it's hungry.", "You cross the street reading your texts. A garbage truck is backing up, beeping. Beep. Beep. Beep. Your phone says 'You coming tonight?'"],
    },
    choices: [
      {
        label: { fr: 'Hurler « JE SUIS VIVANT »', en: 'Scream I\'M ALIVE' },
        out: [
          { w: 3, text: { fr: "J'ai hurlé. L'éboueur m'a sorti{|e} par le col, m'a regardé{|e} longuement et a dit : « Le recyclage, c'est le jeudi. » J'ai senti les couches toute la semaine.", en: "I screamed. The garbage man pulled me out by the collar, stared at me and said: 'Recycling is Thursday.' I smelled like diapers all week." }, fx: { happy: -6, looks: -3, visual: 'poop' } },
          { w: 1, text: { fr: "Il ne m'a pas entendu{|e}. Le compacteur m'a plié{|e} comme un origami. Ils m'ont retrouvé{|e} à la déchetterie, avec trois côtes cassées et un nouveau respect pour les poubelles.", en: "He didn't hear me. The compactor folded me like origami. They found me at the landfill with three broken ribs and a new respect for trash." }, fx: { health: -25, disease: 'ptsd', visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Finir mon message', en: 'Finish my text' },
        out: [
          { w: 2, text: { fr: "J'ai fini mon message. Le camion m'a roulé sur le pied, très lentement, avec le bip comme bande-son. Mon pied ressemble à une crêpe. J'ai répondu « oui » quand même.", en: "I finished my text. The truck rolled over my foot, very slowly, with the beeping as soundtrack. My foot looks like a pancake. I still replied 'yes'." }, fx: { health: -15, athletic: -5, visual: 'gore' }, mood: 'cry' },
          { w: 1, rating: 2, text: { fr: "Le camion m'a roulé dessus en entier. Mon dernier message était « jarrive ». Sans apostrophe.", en: "The truck rolled over all of me. My last text was 'omw'. No capital letters." }, fx: { die: { fr: "écrasé{|e} par un camion-poubelle en marche arrière, téléphone à la main", en: 'run over by a reversing garbage truck, phone in hand' }, visual: 'gore' } },
        ],
      },
    ],
  },

  // ── Tondeuse autoportée ──
  {
    id: 'dk_lawnmower',
    icon: '🚜',
    cat: 'dark',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'lawnmower', fx: 'gore' },
    when: { age: [18, 90] },
    weight: 4,
    cooldown: 20,
    text: {
      fr: ["Tu tonds la pelouse en tongs sur ta tondeuse autoportée d'occasion, avec une bière. La pente est un peu raide. La tondeuse commence à basculer vers toi, lames en marche.", "Ton voisin te prête sa tondeuse : « Elle a juste un petit défaut, elle démarre toute seule. » Tu vois le petit défaut foncer vers tes orteils."],
      en: ["You're mowing in flip-flops on a used riding mower, with a beer. The slope is a little steep. The mower starts tipping toward you, blades spinning.", "Your neighbor lends you his mower: 'It's got one tiny quirk, it starts by itself.' You watch the tiny quirk charge toward your toes."],
    },
    choices: [
      {
        label: { fr: 'Sauter sur le côté', en: 'Jump aside' },
        out: [
          { w: 3, odds: { athletic: 1 }, text: { fr: "J'ai sauté. La tondeuse a coupé ma tong en deux, la bière en trois, et le nain de jardin en mille. Moi, rien. Le nain a eu un enterrement digne.", en: "I jumped. The mower cut my flip-flop in two, the beer in three and the garden gnome in a thousand. Me, nothing. The gnome got a proper funeral." }, fx: { happy: 4, stress: 4 } },
          { w: 2, text: { fr: "J'ai sauté, mais pas mon gros orteil. Il a été tondu et projeté dans le jardin du voisin, qui l'a jeté au barbecue sans regarder. Il a dit que c'était « un peu caoutchouteux ».", en: "I jumped, but my big toe didn't. It got mowed and launched into the neighbor's yard, where he tossed it on the grill without looking. He said it was 'a bit chewy'." }, fx: { health: -12, athletic: -3, happy: -8, visual: 'gore' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Retenir la machine', en: 'Hold the machine back' }, text: { fr: "J'ai retenu la tondeuse de mes bras musclés. Elle a quand même coupé mes lacets, mon short et ma confiance. J'ai fini la pelouse avec des ciseaux. Ça m'a pris l'été.", en: "I held the mower back with my mighty arms. It still cut my laces, my shorts and my self-esteem. I finished the lawn with scissors. It took all summer." }, fx: { health: -5, athletic: 3, happy: -3 } },
    ],
  },

  // ── Toilettes de chantier qui basculent ──
  {
    id: 'dk_porta_potty',
    icon: '🚽',
    cat: 'dark',
    rating: 2,
    scene: { place: 'stadium', mood: 'sick', prop: 'toilet', fx: 'poop' },
    when: { age: [18, 70] },
    weight: 5,
    cooldown: 15,
    text: {
      fr: ["Festival de musique, jour 3. Tu es dans une cabine de toilettes chimiques quand tu sens deux mecs bourrés la secouer en criant « TOURNEZ, MANÈGE ! ». La cabine penche.", "Toilettes de chantier, 35 degrés, jour 3 du festival. Le fond de la cuve est une soupe qui a développé une conscience. Et la cabine commence à basculer en arrière."],
      en: ["Music festival, day 3. You're inside a porta-potty when two drunk guys start rocking it yelling 'TIP IT OVER!'. The cabin is leaning.", "Porta-potty, 95 degrees, day 3 of the festival. The bottom of the tank is a soup that has developed consciousness. And the cabin starts tipping backward."],
    },
    choices: [
      {
        label: { fr: 'Me cramponner', en: 'Hold on tight' },
        out: [
          { w: 2, text: { fr: "La cabine est tombée sur la porte. J'ai fait un 360 dans trois jours de festival liquide. J'en suis sorti{|e} par le toit, comme un nouveau-né de l'enfer. La foule s'est écartée comme la mer Rouge.", en: "The cabin fell door-down. I did a 360 in three days of liquid festival. I came out through the roof like a newborn from hell. The crowd parted like the Red Sea." }, fx: { happy: -15, health: -8, looks: -8, disease: 'gastro', visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: "Je me suis cramponné{|e} et la cabine s'est stabilisée par miracle. Quand je suis sorti{|e}, les deux mecs étaient couverts d'une autre cabine qui, elle, était tombée sur eux. Le karma a un sens de l'humour.", en: "I held on and the cabin stabilized by miracle. When I came out, the two guys were covered by another cabin that had fallen on them. Karma has a sense of humor." }, fx: { happy: 10 }, mood: 'happy' },
        ],
      },
      { label: { fr: 'Sortir en défonçant la porte', en: 'Burst out the door' }, text: { fr: "J'ai défoncé la porte, pantalon aux chevilles, et j'ai sprinté dans la foule. Je suis passé{|e} sur l'écran géant du festival. Mon cul aussi. Il a son propre compte TikTok maintenant.", en: "I burst out, pants around my ankles, and sprinted through the crowd. I made it onto the festival's giant screen. So did my butt. It has its own TikTok account now." }, fx: { happy: -6, fame: 5, followers: 8000 }, mood: 'shock' },
    ],
  },

  // ── Achat sur le dark web ──
  {
    id: 'dk_darkweb',
    icon: '🧅',
    cat: 'dark',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'laptop', fx: 'police' },
    when: { age: [18, 70] },
    weight: 4,
    once: true,
    text: {
      fr: ["Par curiosité et après quatre bières, tu as passé une commande sur le dark web, sur un site au logo d'oignon souriant. Le colis vient d'arriver. Il est énorme. Il respire.", "Ton achat « mystère » sur un marché obscur du web profond est arrivé. L'étiquette dit : « 1 x Rein (gauche ?) ». Tu avais pourtant commandé un fromage au lait cru interdit."],
      en: ["Out of curiosity and four beers deep, you placed an order on the dark web, on a site with a smiling onion logo. The package just arrived. It's huge. It's breathing.", "Your 'mystery' purchase from a shady deep-web market has arrived. The label says: '1 x Kidney (left?)'. You had ordered a banned raw-milk cheese."],
    },
    choices: [
      {
        label: { fr: 'Ouvrir le colis', en: 'Open the package' },
        out: [
          { w: 2, text: { fr: "Dedans : une autruche vivante, très énervée. Elle m'a cassé le nez d'un coup de bec et s'est installée dans ma baignoire. Le vendeur m'a laissé un avis 5 étoiles. Je l'ai appelée Darknette.", en: "Inside: a live, very angry ostrich. It broke my nose with one peck and moved into my bathtub. The seller left me a 5-star review. I named her Darknette." }, fx: { health: -8, happy: 4, newNpc: { role: 'pet', species: 'ostrich', age: [2, 5], abs: true }, visual: 'gore' } },
          { w: 1, text: { fr: "Dedans : un agent du FBI recroquevillé, qui m'a souri et dit « Surprise ». Opération sous couverture. Mon ordinateur est parti dans un sac. Ma réputation aussi.", en: "Inside: a curled-up FBI agent who smiled and said 'Surprise'. Sting operation. My computer left in a bag. So did my reputation." }, fx: { heat: 30, stress: 15, arrest: 'hack', visual: 'police' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Le renvoyer à l\'expéditeur', en: 'Return to sender' }, text: { fr: "J'ai marqué « retour à l'expéditeur ». La Poste l'a perdu. Quelque part, dans un centre de tri de Seine-et-Marne, il y a un colis qui respire. Ce n'est plus mon problème.", en: "I wrote 'return to sender'. The post office lost it. Somewhere in a sorting center, there's a breathing package. Not my problem anymore." }, fx: { stress: 4, karma: -2 } },
      { label: { fr: 'Le revendre sur Leboncoin', en: 'Resell it online' }, text: { fr: "Je l'ai revendu tel quel, « colis mystère, ne pas poser de questions », pour 600. L'acheteur m'a envoyé un message trois jours plus tard : « Merci pour le rein. » J'ai bloqué le numéro.", en: "I resold it as is, 'mystery box, no questions', for 600. The buyer texted three days later: 'Thanks for the kidney.' I blocked the number." }, fx: { money: 600, karma: -6 } },
    ],
  },

  // ── Chute dans une tombe ouverte ──
  {
    id: 'dk_open_grave',
    icon: '⛏️',
    cat: 'dark',
    rating: 2,
    scene: { place: 'cemetery', mood: 'shock', prop: 'grave', fx: 'ghost' },
    when: { age: [18, 90] },
    weight: 4,
    cooldown: 25,
    text: {
      fr: ["Raccourci par le cimetière à 1 h du matin, bourré{|e}. Le sol disparaît. Tu es au fond d'une tombe fraîchement creusée, deux mètres de profondeur. Il commence à pleuvoir. Quelqu'un siffle au-dessus de toi.", "Enterrement de ta grand-tante. Tu recules pour la photo de famille. Il n'y a plus de sol. Tu atterris sur le cercueil, qui craque."],
      en: ["Shortcut through the cemetery at 1 a.m., wasted. The ground disappears. You're at the bottom of a freshly dug grave, six feet deep. It starts raining. Someone is whistling above you.", "Your great-aunt's funeral. You step back for the family photo. No more ground. You land on the coffin, which cracks."],
    },
    choices: [
      {
        label: { fr: 'Appeler à l\'aide', en: 'Call for help' },
        out: [
          { w: 2, text: { fr: "Le fossoyeur m'a sorti{|e} avec sa pelle en ricanant : « Encore un. Tu es le troisième ce mois-ci. » Il m'a offert un café et sa carte. Ses tarifs sont raisonnables.", en: "The gravedigger pulled me out with his shovel, snickering: 'Another one. You're the third this month.' He gave me coffee and his business card. His rates are reasonable." }, fx: { health: -4, stress: 6 } },
          { w: 1, text: { fr: "Un ivrogne m'a entendu{|e} crier « Sortez-moi de là ! » depuis une tombe. Il a fait une crise cardiaque. J'ai dû lui faire un massage cardiaque en sortant. Il a survécu. Il ne boit plus. Je suis un miracle.", en: "A drunk heard me yelling 'Get me out!' from a grave. He had a heart attack. I had to do CPR when I got out. He survived. He quit drinking. I'm a miracle." }, fx: { karma: 6, happy: 6 } },
        ],
      },
      { label: { fr: 'Faire le zombie', en: 'Do the zombie thing' }, text: { fr: "J'ai attendu que des gens passent pour sortir en grognant, une main d'abord. Une bande d'ados gothiques a hurlé, puis m'a demandé de rejoindre leur groupe de rock. J'ai été {batteur|batteuse} six mois.", en: "I waited for people to pass and crawled out groaning, one hand first. A gang of goth teens screamed, then asked me to join their band. I was their drummer for six months." }, fx: { happy: 12, fame: 2 }, mood: 'party' },
      { label: { fr: 'Dormir là', en: 'Sleep there' }, text: { fr: "J'ai dormi dans la tombe. Le lendemain matin, un convoi funéraire est arrivé avec un cercueil pour cette place. Le prêtre a dit qu'il n'avait jamais vu ça. Moi non plus, mais je suis jamais vraiment réveillé{|e} avant 11 h.", en: "I slept in the grave. The next morning a funeral procession arrived with a coffin for that spot. The priest said he'd never seen anything like it. Neither had I, but I'm never really awake before 11." }, fx: { health: -6, disease: 'cold', stress: -2 }, mood: 'sleepy' },
    ],
  },

  // ── L'urne de maman ──
  {
    id: 'dk_urn',
    icon: '🏺',
    cat: 'dark',
    rating: 2,
    actor: { role: 'mother', living: false },
    scene: { place: 'home', mood: 'sad', prop: 'urn', fx: 'ghost' },
    when: { age: [18, 95], test: (life) => life.npcs.some((n) => n.role === 'mother' && !n.alive) },
    weight: 4,
    once: true,
    text: {
      fr: ["L'urne de {a.first}, ta mère, trône sur la cheminée. Ce soir, après deux verres de vin, tu lui parles. Elle ne répond pas, mais tu entends quand même « Tu ne t'es pas encore remis{|e} au sport, hein ».", "Tu fais le ménage. L'urne de ta défunte mère, {a.first}, est sur l'étagère. Ton aspirateur sans fil est très, très puissant."],
      en: ["The urn of {a.first}, your mother, sits on the mantel. Tonight, after two glasses of wine, you talk to her. She doesn't answer, but you still hear 'You still haven't started exercising, huh'.", "You're cleaning. Your late mother {a.first}'s urn is on the shelf. Your cordless vacuum is very, very powerful."],
    },
    choices: [
      { label: { fr: 'Lui raconter ma vie', en: 'Tell her about my life' }, text: { fr: "Je lui ai tout raconté, pendant trois heures. J'ai pleuré, j'ai ri. À la fin, j'ai senti une petite brise froide sur ma nuque. C'était la fenêtre. Mais j'ai choisi de croire que non.", en: "I told her everything, for three hours. I cried, I laughed. At the end, I felt a small cold breeze on my neck. It was the window. But I chose to believe otherwise." }, fx: { happy: 8, stress: -8 }, mood: 'cry' },
      {
        label: { fr: 'Passer l\'aspirateur', en: 'Vacuum anyway' },
        out: [
          { w: 2, text: { fr: "L'aspirateur a heurté l'étagère. Maman est tombée. Par réflexe, j'ai tout aspiré. Elle est maintenant dans le bac de l'aspirateur, avec des poils de chat et une pièce de 2 €. Je n'ose pas le vider. Je lui parle à travers le plastique.", en: "The vacuum bumped the shelf. Mom fell. On reflex, I vacuumed everything up. She's now in the vacuum canister with cat hair and a quarter. I don't dare empty it. I talk to her through the plastic." }, fx: { happy: -8, karma: -2, visual: 'ghost' }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai éternué au-dessus de l'urne ouverte. Maman s'est envolée partout, dans mes cheveux, dans ma bouche. Je l'ai un peu avalée. Elle est en moi, maintenant. Littéralement.", en: "I sneezed over the open urn. Mom flew everywhere, in my hair, in my mouth. I swallowed some. She's part of me now. Literally." }, fx: { happy: -6, health: -2 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Disperser les cendres', en: 'Scatter the ashes' }, text: { fr: "Je suis allé{|e} disperser ses cendres au bord de la mer, comme elle voulait. Le vent a tourné. Maman m'est revenue en pleine figure, puis sur trois touristes allemands. Elle a toujours aimé voyager.", en: "I went to scatter her ashes by the sea, like she wanted. The wind turned. Mom came right back in my face, then onto three German tourists. She always loved to travel." }, fx: { happy: 4, stress: -5 }, mood: 'sad' },
    ],
  },

  // ── Taxidermie ratée ──
  {
    id: 'dk_taxidermy',
    icon: '🦴',
    cat: 'dark',
    rating: 2,
    actor: 'pet',
    scene: { place: 'home', mood: 'cry', prop: 'pet', fx: 'ghost' },
    when: { age: [18, 90] },
    weight: 3,
    cooldown: 20,
    text: {
      fr: ["{a.first}, ton animal, vient de mourir de vieillesse sur ton oreiller. Tu dois décider quoi faire du corps. Un taxidermiste du coin propose « -50 % ce mois-ci, résultat garanti ou presque ».", "{a.first}, ton compagnon à poils, s'est éteint paisiblement. Ton cousin, qui « fait de la taxidermie en amateur » depuis un tuto YouTube, propose ses services gratuitement."],
      en: ["{a.first}, your pet, just died of old age on your pillow. You need to decide what to do with the body. A local taxidermist offers '50% off this month, results guaranteed-ish'.", "{a.first}, your furry companion, passed away peacefully. Your cousin, who's been 'doing amateur taxidermy' from a YouTube tutorial, offers his services for free."],
    },
    choices: [
      { label: { fr: 'L\'enterrer au jardin', en: 'Bury them in the yard' }, text: { fr: "J'ai enterré {a.first} sous le cerisier avec son jouet préféré. Le lendemain, le chien du voisin l'avait déterré{a:|e}. On a recommencé. Avec du béton.", en: "I buried {a.first} under the cherry tree with their favorite toy. The next day the neighbor's dog had dug them up. We started over. With concrete." }, fx: { happy: -10, actorDie: true }, mood: 'cry' },
      { label: { fr: 'Taxidermie maison', en: 'Cousin\'s taxidermy' }, text: { fr: "Mon cousin m'a rendu {a.first} empaillé{a:|e}. Les yeux regardent dans deux directions, la langue pend, et il y a une expression de terreur pure. Je l'ai mis{a:|e} dans l'entrée. Les cambrioleurs ne viennent plus.", en: "My cousin returned {a.first} stuffed. The eyes look in two directions, the tongue hangs out, and the expression is pure terror. I put it in the hallway. Burglars don't come anymore." }, fx: { happy: -4, karma: -2, actorDie: true, visual: 'ghost' }, mood: 'shock' },
      { label: { fr: 'Le congeler en attendant', en: 'Freeze them for now' }, text: { fr: "J'ai mis {a.first} au congélateur « en attendant de décider ». Six mois plus tard, mon coloc a cru que c'était un rôti. Il ne faut jamais faire confiance à un coloc qui cuisine.", en: "I put {a.first} in the freezer 'until I decide'. Six months later, my roommate thought it was a roast. Never trust a roommate who cooks." }, fx: { happy: -8, actorDie: true, visual: 'gore' }, mood: 'sick' },
    ],
  },

  // ── Mauvais karma : tout va mal ──
  {
    id: 'dk_karma_bad',
    icon: '😈',
    cat: 'dark',
    rating: 2,
    scene: { place: 'park', mood: 'angry', fx: 'poop' },
    when: { age: [18, 95], stat: { karma: [0, 25] } },
    weight: 6,
    cooldown: 4,
    text: {
      fr: ["L'univers t'a dans le collimateur. Ce matin : un pigeon t'a chié dans la bouche pendant que tu bâillais, ta voiture a été emboutie par un corbillard, et ton horoscope dit juste « lol ».", "Tu as accumulé tellement de mauvais karma que les chats noirs changent de trottoir en te voyant. Aujourd'hui, une plaque d'égout s'est ouverte pile sous tes pieds. Puis une deuxième."],
      en: ["The universe has you in its crosshairs. This morning: a pigeon pooped in your mouth mid-yawn, your car got rear-ended by a hearse, and your horoscope just says 'lol'.", "You've built up so much bad karma that black cats cross the street to avoid you. Today, a manhole opened right under your feet. Then another one."],
    },
    choices: [
      { label: { fr: 'M\'excuser à l\'univers', en: 'Apologize to the universe' }, text: { fr: "Je me suis agenouillé{|e} sur le trottoir et j'ai crié « PARDON, L'UNIVERS ! ». Une vieille dame m'a donné 2 €. Une mouette me les a volés. C'est un début.", en: "I knelt on the sidewalk and yelled 'SORRY, UNIVERSE!'. An old lady gave me two bucks. A seagull stole them. It's a start." }, fx: { karma: 6, happy: -4 } },
      {
        label: { fr: 'Défier le destin', en: 'Defy destiny' },
        out: [
          { w: 2, text: { fr: "J'ai levé les deux majeurs vers le ciel. Un coup de tonnerre. Puis une grêle de la taille de balles de golf, uniquement au-dessus de moi. J'ai fini aux urgences avec la tête en forme de balle de golf.", en: "I raised both middle fingers to the sky. Thunder. Then golf-ball-sized hail, only over me. I ended up in the ER with a golf-ball-shaped head." }, fx: { health: -12, disease: 'concussion', happy: -6, visual: 'gore' }, mood: 'cry' },
          { w: 1, rating: 2, text: { fr: "J'ai crié « C'EST TOUT CE QUE T'AS ? ». L'univers a répondu avec un piano à queue, un frigo et un chat, dans cet ordre.", en: "I screamed 'IS THAT ALL YOU'VE GOT?'. The universe answered with a grand piano, a fridge and a cat, in that order." }, fx: { die: { fr: "écrasé{|e} par un piano, un frigo et un chat, après avoir provoqué l'univers", en: 'crushed by a piano, a fridge and a cat after taunting the universe' }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Rester au lit', en: 'Stay in bed' }, text: { fr: "Je suis resté{|e} au lit toute la journée. Le plafond m'est tombé dessus. Pas tout le plafond. Juste la partie où il y avait le lustre.", en: "I stayed in bed all day. The ceiling fell on me. Not all of it. Just the part with the chandelier." }, fx: { health: -8, happy: -6, money: -800 } },
    ],
  },

  // ── Ligne journal : mauvais karma ──
  {
    id: 'dk_auto_karma_bad',
    icon: '🌩️',
    cat: 'dark',
    rating: 2,
    auto: true,
    scene: { place: 'park', mood: 'angry', fx: 'poop' },
    when: { age: [18, 95], stat: { karma: [0, 25] } },
    weight: 7,
    cooldown: 3,
    text: {
      fr: ["J'ai marché dans une merde de chien. Puis dans une deuxième, avec l'autre pied, pour l'équilibre. Puis j'ai glissé et je me suis assis{|e} dans la troisième. L'univers fait de la symétrie.", "Une mouette m'a volé mon sandwich, puis mon portefeuille, puis elle est revenue me chier dessus pour signer son œuvre. Je pense qu'elle a été envoyée."],
      en: ["I stepped in dog poop. Then in a second one with the other foot, for balance. Then I slipped and sat in a third. The universe loves symmetry.", "A seagull stole my sandwich, then my wallet, then came back to poop on me to sign its work. I think it was sent."],
    },
    fx: { happy: -5, looks: -2, visual: 'poop' },
  },

  // ── Envie de pousser quelqu'un ──
  {
    id: 'dk_push_urge',
    icon: '🚇',
    cat: 'dark',
    rating: 2,
    scene: { place: 'office', mood: 'angry', prop: 'subway' },
    when: { age: [18, 85] },
    weight: 5,
    cooldown: 12,
    text: {
      fr: ["Quai de métro bondé. Devant toi, un type écoute un podcast crypto sur haut-parleur, sans écouteurs, en sifflotant. Il est au bord du quai. Le métro arrive. Ta main gauche a des idées.", "À la piscine municipale, un mec en string léopard fait des pompes au bord du bassin en criant « LET'S GOOO ». Il est juste là. Tellement près de l'eau. Ou du sol mouillé."],
      en: ["Packed subway platform. In front of you, a guy is playing a crypto podcast on speaker, no headphones, whistling. He's at the edge of the platform. The train is coming. Your left hand has ideas.", "At the public pool, a guy in a leopard Speedo is doing push-ups by the edge, yelling 'LET'S GOOO'. He's right there. So close to the water. Or the wet tiles."],
    },
    choices: [
      { label: { fr: 'Respirer profondément', en: 'Breathe deeply' }, text: { fr: "J'ai respiré profondément, compté jusqu'à dix et recouvert sa voix en fredonnant du Céline Dion. Les gens autour m'ont regardé{|e} comme le vrai psychopathe du quai. Ils avaient peut-être raison.", en: "I breathed deeply, counted to ten and drowned him out humming Céline Dion. The people around me looked at me like I was the real psycho on the platform. Maybe they were right." }, fx: { stress: 5, karma: 2 } },
      {
        label: { fr: 'Juste une petite poussette', en: 'Just a tiny nudge' },
        out: [
          { w: 2, text: { fr: "Une pichenette, pas plus. Il a perdu l'équilibre, lâché son téléphone sur les rails, et le métro l'a transformé en confettis. Le téléphone, pas lui. Le silence qui a suivi était divin.", en: "A flick, nothing more. He lost his balance, dropped his phone on the tracks, and the train turned it into confetti. The phone, not him. The silence that followed was divine." }, fx: { happy: 12, karma: -6 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai poussé un peu trop. Il est tombé dans le bassin, s'est cogné et a coulé, en string léopard. Je l'ai repêché, réanimé, et il m'a remercié{|e} en pleurant. Personne ne sait. Il me suit sur Instagram.", en: "I pushed a bit too hard. He fell in the pool, hit his head and sank, in his leopard Speedo. I fished him out, revived him, and he thanked me, crying. Nobody knows. He follows me on Instagram." }, fx: { karma: -4, stress: 10, happy: 2 } },
        ],
      },
      { label: { fr: 'Prendre rendez-vous chez le psy', en: 'Book a therapist' }, text: { fr: "J'ai pris rendez-vous chez un psy. Il m'a dit que les pensées intrusives étaient « parfaitement normales ». Puis il m'a avoué qu'il voulait souvent pousser ses patients par la fenêtre. Je ne suis pas retourné{|e}.", en: "I booked a therapist. He said intrusive thoughts are 'perfectly normal'. Then admitted he often wants to push patients out the window. I didn't go back." }, fx: { stress: -6, money: -90 } },
    ],
  },

  // ── Selfie au bord de la falaise ──
  {
    id: 'dk_cliff_selfie',
    icon: '🤳',
    cat: 'dark',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'beach', mood: 'shock', prop: 'cliff' },
    when: { age: [18, 70] },
    weight: 4,
    cooldown: 15,
    text: {
      fr: ["{a.first} fait un selfie au bord d'une falaise de 40 mètres, dos au vide, en faisant un signe de paix. Tu es juste derrière. Ton cerveau te propose une idée terrible, juste pour voir ce que ça fait de l'avoir.", "« Prends-moi en photo, mais genre je suis au bord du vide », dit {a.first} en se mettant sur la pointe des pieds au-dessus de l'océan. Une petite voix en toi dit « boop »."],
      en: ["{a.first} is taking a selfie at the edge of a 130-foot cliff, back to the drop, flashing a peace sign. You're right behind. Your brain offers a terrible idea, just to see what it feels like to have it.", "'Take my picture, but like I'm on the edge,' says {a.first}, tiptoeing over the ocean. A small voice inside you says 'boop'."],
    },
    choices: [
      { label: { fr: 'Prendre la photo', en: 'Take the picture' }, text: { fr: "J'ai pris la photo. Elle était magnifique. {a.first} ne saura jamais ce que mon cerveau a pensé pendant ces trois secondes. Moi, je ne l'oublierai jamais.", en: "I took the picture. It was gorgeous. {a.first} will never know what my brain thought during those three seconds. I'll never forget it." }, fx: { rel: 5, stress: 3 } },
      {
        label: { fr: 'Faire semblant de pousser', en: 'Fake push them' },
        out: [
          { w: 2, text: { fr: "J'ai fait « BOUH » en l'attrapant par le bras. {a.first} a hurlé, fait pipi dans son short et m'a frappé{|e} pendant cinq minutes. On en rit encore. {a:Il|Elle}, moins.", en: "I yelled 'BOO!' while grabbing their arm. {a.first} screamed, peed their shorts and hit me for five minutes. We still laugh about it. Well, I do." }, fx: { happy: 8, rel: -10 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai fait semblant. {a.first} a sursauté pour de vrai et basculé. Il y avait de l'eau en bas. Profonde, par chance. {a.first} est remonté{a:|e} avec une jambe cassée et le souvenir précis de mon visage.", en: "I faked it. {a.first} flinched for real and went over. There was water below. Deep, luckily. {a.first} came up with a broken leg and a vivid memory of my face." }, fx: { karma: -10, rel: -40, actorRole: 'enemy', stress: 10 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'L\'éloigner du bord', en: 'Pull them back' }, text: { fr: "Je l'ai tiré{a:|e} loin du bord en lui faisant la morale. Deux minutes après, un touriste est tombé au même endroit. Il a survécu, mais sans son téléphone. {a.first} m'a payé une glace.", en: "I pulled them back and gave a lecture. Two minutes later a tourist fell from the same spot. He survived, minus his phone. {a.first} bought me ice cream." }, fx: { karma: 6, rel: 10 } },
    ],
  },

  // ── Ligne journal : pensée intrusive ──
  {
    id: 'dk_auto_intrusive',
    icon: '🧠',
    cat: 'dark',
    rating: 2,
    auto: true,
    scene: { place: 'home', mood: 'shock' },
    when: { age: [18, 95] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["Au baptême de mon neveu, j'ai eu une envie irrépressible de crier « IL EST POSSÉDÉ ! » quand le prêtre l'a mouillé. J'ai mordu ma joue jusqu'au sang. J'ai encore le goût.", "En tenant le couteau à pain, j'ai regardé mon coloc dormir sur le canapé et j'ai pensé : « Et si ? » Puis j'ai fait des tartines. Bonne journée quand même."],
      en: ["At my nephew's baptism, I had an overwhelming urge to scream 'HE'S POSSESSED!' when the priest got him wet. I bit my cheek until it bled. I can still taste it.", "Holding the bread knife, I watched my roommate sleeping on the couch and thought: 'What if?' Then I made toast. Good day anyway."],
    },
    fx: { stress: 3 },
  },

  // ── Influenceur sur un lieu d'accident ──
  {
    id: 'dk_influencer_crash',
    icon: '📱',
    cat: 'dark',
    rating: 2,
    scene: { place: 'park', mood: 'angry', prop: 'phone', fx: 'gore' },
    when: { age: [18, 80] },
    weight: 4,
    cooldown: 15,
    text: {
      fr: ["Un scooter s'est encastré dans un poteau. Le livreur est au sol, une jambe tordue à 90 degrés. À côté, une influenceuse fait un live : « Les gars, c'est trop dark, likez pour qu'il survive 🙏 ». Elle te demande de la filmer « en train d'aider ».", "Accident de vélo devant toi. Le cycliste saigne de la tête. Un influenceur fitness arrive en courant, l'enjambe et commence une story : « Voilà pourquoi je fais du rameur indoor, les amis. »"],
      en: ["A scooter slammed into a pole. The delivery guy is on the ground, one leg bent at 90 degrees. Next to him, an influencer is livestreaming: 'Guys, this is so dark, like so he survives 🙏'. She asks you to film her 'helping'.", "Bike crash right in front of you. The cyclist's head is bleeding. A fitness influencer jogs up, steps over him and starts a story: 'This is why I do indoor rowing, fam.'"],
    },
    choices: [
      { label: { fr: 'Aider le blessé', en: 'Help the victim' }, text: { fr: "J'ai écarté la star d'Instagram, fait un garrot avec sa ceinture de marque et appelé le 15. Le blessé a survécu. La star a porté plainte pour « ceinture abîmée ». Le juge a ri.", en: "I shoved the influencer aside, made a tourniquet with their designer belt and called 911. The victim survived. The influencer sued over a 'damaged belt'. The judge laughed." }, fx: { karma: 12, happy: 6 }, mood: 'proud' },
      { label: { fr: 'Balancer son téléphone', en: 'Yeet their phone' }, text: { fr: "J'ai pris son téléphone et je l'ai lancé dans une bouche d'égout, en direct. 300 000 personnes ont vu le noir complet. Les commentaires disaient « LÉGENDE ». Puis j'ai aidé le blessé.", en: "I grabbed their phone and threw it into a storm drain, on live. 300,000 people watched it go black. The comments said 'LEGEND'. Then I helped the victim." }, fx: { karma: 8, fame: 6, followers: 25000, happy: 10 }, mood: 'party' },
      { label: { fr: 'Filmer moi aussi', en: 'Film it too' }, text: { fr: "J'ai filmé aussi. Ma vidéo a fait 2 millions de vues avec le titre « Il a vu la mort de près 😱 ». J'ai gagné 400 balles de monétisation. Je n'ai pas réussi à les dépenser sans avoir honte. Enfin si, au bout d'une semaine.", en: "I filmed too. My video got 2 million views titled 'He saw death up close 😱'. I made 400 bucks in ad revenue. I couldn't spend it without feeling ashamed. Well, I could, after a week." }, fx: { karma: -12, money: 400, followers: 10000 } },
    ],
  },

  // ── Gourou du lavement au café ──
  {
    id: 'dk_guru_enema',
    icon: '🧘',
    cat: 'dark',
    rating: 2,
    vars: { amount: [1500, 4000] },
    scene: { place: 'villa', mood: 'sick', prop: 'yoga', fx: 'poop' },
    when: { age: [22, 80] },
    weight: 4,
    once: true,
    text: {
      fr: ["Tu t'es inscrit{|e} à une retraite « détox spirituelle » chez le gourou Shakti Bernard, ex-vendeur de cuisines. Programme : jeûne, cri primal et lavement au café bio trois fois par jour. Prix : {$amount}.", "Le gourou Shakti Bernard affirme que « toutes les émotions négatives sont stockées dans le côlon ». Il propose de « libérer ton enfant intérieur » par voie rectale, avec un kit expresso."],
      en: ["You signed up for a 'spiritual detox' retreat with guru Shakti Bernard, a former kitchen salesman. Program: fasting, primal screaming and organic coffee enemas three times a day. Price: {$amount}.", "Guru Shakti Bernard claims 'all negative emotions are stored in the colon'. He offers to 'release your inner child' rectally, using an espresso kit."],
    },
    choices: [
      { label: { fr: 'Tenter le lavement', en: 'Try the enema' }, text: { fr: "J'ai tenté le lavement au café. Mon enfant intérieur est sorti, en effet, à haute pression, sur le tapis de yoga de ma voisine. Shakti Bernard a appelé ça « une libération ». Elle a appelé ça « une agression ».", en: "I tried the coffee enema. My inner child did come out, at high pressure, onto my neighbor's yoga mat. Shakti Bernard called it 'a release'. She called it 'an assault'." }, fx: { money: '-amount', health: -6, happy: -8, stress: -10, visual: 'poop' }, mood: 'sick' },
      { label: { fr: 'Dénoncer l\'arnaque', en: 'Expose the scam' }, text: { fr: "J'ai filmé en caméra cachée Shakti Bernard en train de manger un Big Mac dans sa Porsche entre deux séances de jeûne. La vidéo a fait le tour d'internet. Il a rebondi en lançant une formation « Comment survivre à un bad buzz ».", en: "I secretly filmed Shakti Bernard eating a Big Mac in his Porsche between fasting sessions. The video went viral. He bounced back with a course: 'How to Survive Being Cancelled'." }, fx: { karma: 8, fame: 5, followers: 12000 }, mood: 'proud' },
      { label: { fr: 'Devenir gourou moi-même', en: 'Become a guru myself' }, text: { fr: "J'ai observé, pris des notes, et lancé ma propre retraite : « Le Chemin du Néant ». On ne fait rien pendant une semaine. Ça coûte {$amount}. C'est complet jusqu'à l'an prochain.", en: "I watched, took notes and launched my own retreat: 'The Path of Nothing'. You do nothing for a week. It costs {$amount}. It's sold out until next year." }, fx: { money: 'amount', karma: -8, fame: 3 }, mood: 'happy' },
    ],
  },

  // ── Politicien au marché ──
  {
    id: 'dk_politician',
    icon: '🥚',
    cat: 'dark',
    rating: 2,
    scene: { place: 'park', mood: 'angry', prop: 'egg', fx: 'police' },
    when: { age: [18, 90] },
    weight: 4,
    cooldown: 15,
    text: {
      fr: ["Le député Jean-Charles Fauxsourire fait le marché pour sa campagne. Il te serre la main, puis s'essuie discrètement sur son attaché parlementaire. Tu as une boîte de douze œufs bio dans ton cabas.", "Un ministre en tournée « au contact du peuple » demande à une caissière combien coûte une baguette. Il propose 15 €. Tu es juste à côté, avec un œuf et un bras d'ancien lanceur de poids."],
      en: ["Congressman John Charles Fakesmile is shaking hands at the farmer's market for his campaign. He shakes yours, then discreetly wipes his hand on his aide. You have a dozen organic eggs in your bag.", "A minister on a 'meet the people' tour asks a cashier how much a loaf of bread costs. He guesses 15 dollars. You're right next to him, with an egg and a former shot-putter's arm."],
    },
    choices: [
      {
        label: { fr: 'L\'œuf, en pleine tête', en: 'Egg to the face' },
        out: [
          { w: 2, text: { fr: "L'œuf a explosé pile sur sa permanente. Jaune dans les sourcils, coquille dans le col. Les caméras de BFM ont filmé au ralenti. On m'a mis{|e} en garde à vue quatre heures. Ça valait chaque minute.", en: "The egg exploded right on his perm. Yolk in the eyebrows, shell in the collar. The news cameras filmed it in slow motion. I spent four hours in a holding cell. Worth every minute." }, fx: { happy: 15, fame: 8, heat: 10, karma: -2, followers: 30000, visual: 'police' }, mood: 'party' },
          { w: 1, text: { fr: "J'ai raté. L'œuf a touché une mamie qui votait pour lui. Elle m'a frappé{|e} avec un poireau. Le député a fait une story « Soutien à Ginette ». Il a pris cinq points dans les sondages. Grâce à moi.", en: "I missed. The egg hit a granny who was voting for him. She whacked me with a leek. The congressman posted 'Standing with Ginette'. He gained five points in the polls. Thanks to me." }, fx: { happy: -8, health: -2 }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Lui poser une vraie question', en: 'Ask a real question' }, text: { fr: "Je lui ai demandé le prix d'un litre de lait. Il a regardé son attaché. L'attaché a regardé son téléphone. Le silence a duré onze secondes. La vidéo a coûté l'élection au type. Les questions, c'est plus dangereux que les œufs.", en: "I asked him the price of a gallon of milk. He looked at his aide. The aide looked at his phone. The silence lasted eleven seconds. The video cost him the election. Questions are more dangerous than eggs." }, fx: { karma: 4, fame: 6, smarts: 2, followers: 20000 }, mood: 'proud' },
      { label: { fr: 'Prendre un selfie', en: 'Take a selfie' }, text: { fr: "J'ai pris un selfie avec lui. Six mois plus tard, il était mis en examen pour détournement de fonds. Ma photo illustre l'article dans Le Monde. J'ai l'air ravi{|e}.", en: "I took a selfie with him. Six months later he was indicted for embezzlement. My photo illustrates the article in the national paper. I look delighted." }, fx: { fame: 2, happy: -2 } },
    ],
  },

  // ── Contrôle de police absurde ──
  {
    id: 'dk_cop_kebab',
    icon: '🚓',
    cat: 'dark',
    rating: 2,
    scene: { place: 'apartment', mood: 'angry', prop: 'kebab', fx: 'police' },
    when: { age: [18, 80], prison: false },
    weight: 5,
    cooldown: 8,
    text: {
      fr: ["Trois policiers t'arrêtent à 1 h du matin parce que tu « manges un kebab de façon suspecte ». Le chef te demande d'ouvrir ton kebab « pour inspection ». Son collègue lorgne tes frites.", "Contrôle de police pour « marche trop assurée ». L'agent veut savoir pourquoi tu as l'air « aussi détendu{|e} un mardi ». Il tient une matraque et une gaufre."],
      en: ["Three cops stop you at 1 a.m. because you're 'eating a kebab suspiciously'. The sergeant asks you to open your kebab 'for inspection'. His partner is eyeing your fries.", "Police stop for 'walking too confidently'. The officer wants to know why you look 'so relaxed on a Tuesday'. He's holding a baton and a waffle."],
    },
    choices: [
      { label: { fr: 'Partager les frites', en: 'Share the fries' }, text: { fr: "J'ai proposé mes frites. Les trois flics se sont jetés dessus comme des mouettes. L'un d'eux a pleuré en me racontant son divorce. Ils m'ont raccompagné{|e} chez moi en voiture, gyrophare allumé. C'était la meilleure soirée de mon mois.", en: "I offered my fries. All three cops dove in like seagulls. One cried telling me about his divorce. They drove me home, sirens on. Best night of my month." }, fx: { happy: 8, heat: -10, karma: 2 }, mood: 'happy' },
      {
        label: { fr: 'Citer mes droits', en: 'Cite my rights' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai cité l'article de loi exact, avec le numéro. Ils ont paniqué, regardé leur chef, et m'ont laissé{|e} partir avec des excuses et une sauce samouraï offerte.", en: "I cited the exact law, with the article number. They panicked, looked at their sergeant and let me go with an apology and a free side of sauce." }, fx: { happy: 8, smarts: 2 }, mood: 'proud' },
          { w: 2, text: { fr: "J'ai cité mes droits. Ils m'ont plaqué{|e} au sol dans la sauce blanche « pour rébellion ». Garde à vue, nuit au poste. Ils ont mangé le kebab devant moi. C'était un très bon kebab.", en: "I cited my rights. They pinned me to the ground in the garlic sauce 'for resisting'. Overnight in a cell. They ate the kebab in front of me. It was a very good kebab." }, fx: { happy: -10, health: -5, heat: 10, visual: 'police' }, mood: 'angry' },
        ],
      },
      { label: { fr: 'Partir en courant', en: 'Run for it' }, text: { fr: "J'ai couru. Trois flics, un kebab, une course-poursuite dans le centre-ville. Ils ont abandonné au bout de 200 mètres, essoufflés. J'ai fini mon kebab sur un banc, en {héros|héroïne}.", en: "I ran. Three cops, one kebab, a chase through downtown. They gave up after 200 yards, out of breath. I finished my kebab on a bench, a hero." }, fx: { happy: 10, athletic: 3, heat: 15 }, mood: 'party' },
    ],
  },

  // ── Sang jeune pour milliardaire ──
  {
    id: 'dk_young_blood',
    icon: '🩸',
    cat: 'dark',
    rating: 2,
    vars: { amount: [8000, 25000] },
    scene: { place: 'hospital', mood: 'shock', prop: 'blood', fx: 'gore' },
    when: { age: [18, 30] },
    weight: 3,
    once: true,
    text: {
      fr: ["Un milliardaire de la tech de 67 ans, obsédé par la jeunesse éternelle, cherche des « donneurs de plasma jeune premium ». Il paie {$amount} pour une transfusion directe, de ton bras au sien. Il porte un bonnet de bain en aluminium.", "Petite annonce : « Milliardaire cherche sang jeune, bonne hygiène de vie, pas de fumeurs, pas de végans (le goût). » Rémunération : {$amount}. Le rendez-vous a lieu sur son yacht."],
      en: ["A 67-year-old tech billionaire obsessed with eternal youth is looking for 'premium young plasma donors'. He pays {$amount} for a direct transfusion, from your arm to his. He's wearing an aluminum swim cap.", "Classified ad: 'Billionaire seeks young blood, healthy lifestyle, no smokers, no vegans (the taste).' Pay: {$amount}. Appointment is on his yacht."],
    },
    choices: [
      {
        label: { fr: 'Vendre mon sang', en: 'Sell my blood' },
        out: [
          { w: 3, text: { fr: "Je suis reparti{|e} avec {$amount}, un jus d'orange et un léger vertige. Le milliardaire avait l'air de rajeunir à vue d'œil. En vrai, il avait juste mis du blush. J'ai pris l'argent.", en: "I left with {$amount}, an orange juice and slight dizziness. The billionaire looked younger by the minute. Actually he'd just put on blush. I took the money." }, fx: { money: 'amount', health: -6, karma: -2 } },
          { w: 1, text: { fr: "L'infirmier était son neveu, diplômé d'une école en ligne. Il a branché le tuyau à l'envers. J'ai reçu un litre de sang de milliardaire. Depuis, j'ai envie de licencier des gens et d'acheter des îles.", en: "The nurse was his nephew, who graduated from an online school. He connected the tube backwards. I got a quart of billionaire blood. Since then I want to fire people and buy islands." }, fx: { money: 'amount', health: -10, karma: -6, trait: 'mean' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Lui vendre du faux', en: 'Sell him fake blood' }, text: { fr: "Je lui ai vendu une poche de jus de betterave et de sirop de grenadine. Il l'a bue, en croyant à une « nouvelle méthode orale ». Il s'est senti « vingt ans de moins ». Il m'en commande tous les mois.", en: "I sold him a bag of beet juice and grenadine. He drank it, believing in a 'new oral method'. He said he felt 'twenty years younger'. He orders some every month." }, fx: { money: 'amount', karma: -6, happy: 10, smarts: 2 }, mood: 'happy' },
      { label: { fr: 'Refuser, dégoûté{|e}', en: 'Refuse, disgusted' }, text: { fr: "J'ai refusé. Il a trouvé un autre donneur en dix minutes. On vit dans une société où les riches boivent littéralement le sang des pauvres, et moi j'ai juste gardé mon sang pour mes moustiques.", en: "I said no. He found another donor in ten minutes. We live in a world where the rich literally drink the blood of the poor, and I just kept mine for the mosquitoes." }, fx: { karma: 4 } },
    ],
  },

  // ── PDG qui licencie depuis son yacht ──
  {
    id: 'dk_ceo_layoffs',
    icon: '🛥️',
    cat: 'dark',
    rating: 2,
    scene: { place: 'office', mood: 'angry', prop: 'laptop' },
    when: { age: [20, 65], job: true },
    weight: 4,
    cooldown: 12,
    text: {
      fr: ["Le PDG de {employer} annonce 3 000 licenciements en visio depuis son yacht, en peignoir, un cocktail à la main. « Nous sommes une famille. Et parfois, dans une famille, on abandonne les enfants les moins rentables. »", "Mail général de la direction : « Pour fêter nos profits records, nous supprimons la machine à café et 20 % des postes. Bisous, la Direction. » Un jet privé décolle juste au-dessus du parking."],
      en: ["{employer}'s CEO announces 3,000 layoffs over Zoom from his yacht, in a bathrobe, cocktail in hand. 'We're a family. And sometimes, in a family, you abandon the least profitable children.'", "Company-wide email: 'To celebrate record profits, we're removing the coffee machine and 20% of jobs. Kisses, Management.' A private jet takes off right over the parking lot."],
    },
    choices: [
      { label: { fr: 'Activer mon micro', en: 'Unmute myself' }, text: { fr: "J'ai activé mon micro et dit, devant 8 000 collègues : « Ton yacht, c'est notre treizième mois, connard. » 8 000 personnes ont mis le pouce bleu. J'ai été viré{|e} dans la minute. On m'a envoyé des fleurs de toute la boîte.", en: "I unmuted and said, in front of 8,000 coworkers: 'Your yacht is our year-end bonus, asshole.' 8,000 people hit thumbs-up. I was fired within a minute. I got flowers from the whole company." }, fx: { fired: true, happy: 12, fame: 4, karma: 4 }, mood: 'party' },
      {
        label: { fr: 'Faire profil bas', en: 'Keep my head down' },
        out: [
          { w: 2, text: { fr: "J'ai fait profil bas et survécu à la purge. Je fais maintenant le travail de trois personnes pour le même salaire. Le PDG appelle ça « la résilience ».", en: "I kept my head down and survived the purge. I now do three people's jobs for the same salary. The CEO calls it 'resilience'." }, fx: { stress: 12, perf: 6, happy: -6 } },
          { w: 1, text: { fr: "J'ai fait profil bas. J'ai été licencié{|e} quand même, par un algorithme, dans un mail qui commençait par « Hello {first} ! 🎉 ».", en: "I kept my head down. I got laid off anyway, by an algorithm, in an email starting with 'Hey {first}! 🎉'." }, fx: { fired: true, happy: -10 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Voler l\'agrafeuse', en: 'Steal the stapler' }, text: { fr: "Par vengeance, j'ai volé une agrafeuse, deux ramettes de papier et le ficus du hall. C'est ma part du gâteau. Le ficus va mieux chez moi.", en: "Out of spite I stole a stapler, two reams of paper and the lobby ficus. My share of the pie. The ficus is happier at my place." }, fx: { happy: 6, karma: -1 } },
    ],
  },

  // ── Fouiller les poubelles ──
  {
    id: 'dk_dumpster',
    icon: '🗑️',
    cat: 'dark',
    rating: 2,
    scene: { place: 'apartment', mood: 'sick', prop: 'dumpster', fx: 'poop' },
    when: { age: [18, 85] },
    weight: 5,
    cooldown: 10,
    text: {
      fr: ["Fin de mois difficile. Derrière le restaurant gastronomique « Le Pédant », la benne déborde de homard à peine entamé. Il fait 32 degrés. Ça sent le homard. Et autre chose.", "Ton pote freegan te propose de « faire les poubelles » du supermarché. « C'est du gaspillage anticapitaliste. » Il sort déjà une barquette de poulet légèrement verte."],
      en: ["Rough end of the month. Behind 'Le Pompous', a fancy restaurant, the dumpster is overflowing with barely touched lobster. It's 90 degrees. It smells like lobster. And something else.", "Your freegan buddy invites you to 'dumpster-dive' the supermarket. 'It's anticapitalist anti-waste.' He's already pulling out a slightly green chicken tray."],
    },
    choices: [
      {
        label: { fr: 'Plonger dedans', en: 'Dive in' },
        out: [
          { w: 2, text: { fr: "J'ai trouvé un homard entier, une bouteille de champagne à moitié pleine et un gâteau d'anniversaire « Joyeux anniversaire Kévin ». J'ai fêté l'anniversaire de Kévin seul{|e}, avec classe.", en: "I found a whole lobster, a half-full bottle of champagne and a cake saying 'Happy Birthday Kevin'. I celebrated Kevin's birthday alone, with class." }, fx: { happy: 10, money: 60 }, mood: 'party' },
          { w: 2, text: { fr: "J'ai mangé le poulet vert. Pendant trois jours, mon corps s'est vidé par toutes les sorties disponibles, parfois simultanément. J'ai vu des couleurs qui n'existent pas.", en: "I ate the green chicken. For three days my body emptied itself through every available exit, sometimes simultaneously. I saw colors that don't exist." }, fx: { health: -15, disease: 'food_poisoning', weight: -0.03, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: "Le cuisinier a ouvert la porte de service au moment où j'avais la tête dans la benne et m'a versé dessus un seau de sauce hollandaise tiède. Puis il m'a proposé un boulot de plongeur. J'ai dit oui.", en: "The cook opened the back door just as I had my head in the dumpster and poured a bucket of lukewarm hollandaise on me. Then offered me a dishwasher job. I said yes." }, fx: { looks: -4, happy: 2, open: 'jobs' } },
        ],
      },
      { label: { fr: 'Rester digne', en: 'Stay dignified' }, text: { fr: "Je suis resté{|e} digne et j'ai mangé un paquet de chips périmé depuis 2019. La dignité a un goût de paprika rassis.", en: "I stayed dignified and ate a bag of chips expired since 2019. Dignity tastes like stale paprika." }, fx: { happy: -3 } },
    ],
  },

  // ── Égouts ──
  {
    id: 'dk_sewer',
    icon: '🕳️',
    cat: 'dark',
    rating: 2,
    scene: { place: 'apartment', mood: 'sick', prop: 'sewer', fx: 'poop' },
    when: { age: [18, 70] },
    weight: 4,
    cooldown: 20,
    text: {
      fr: ["Ton téléphone vient de glisser entre les grilles d'une bouche d'égout. Il est trois mètres plus bas, posé sur une île flottante de lingettes et de graisse. L'écran s'allume : « Maman ».", "Ton alliance a glissé de ton doigt et filé dans la grille d'égout. En bas, quelque chose de brun avance lentement. Tu as une lampe frontale et zéro dignité."],
      en: ["Your phone just slipped through a storm drain grate. It's ten feet below, resting on a floating island of wet wipes and grease. The screen lights up: 'Mom'.", "Your wedding ring slipped off and shot down the sewer grate. Below, something brown is slowly drifting. You have a headlamp and zero dignity."],
    },
    choices: [
      {
        label: { fr: 'Descendre le chercher', en: 'Go down and get it' },
        out: [
          { w: 2, text: { fr: "Je suis descendu{|e}. Les égouts sentaient comme une bouche de géant qui a mangé un autre géant. J'ai récupéré mon bien, et en bonus un iguane vivant, un dentier et un billet de 100. Les égouts donnent, les égouts reprennent.", en: "I went down. The sewer smelled like the mouth of a giant who ate another giant. I got my stuff back, plus a live iguana, a set of dentures and a 100-dollar bill. The sewer gives, the sewer takes." }, fx: { money: 100, happy: 4, looks: -4, visual: 'poop' } },
          { w: 1, text: { fr: "J'ai glissé sur un « fatberg » de la taille d'un bus et je suis tombé{|e} dedans, bouche ouverte. J'ai eu toutes les maladies du programme d'un coup. Le médecin m'a demandé si je voulais faire don de mon corps à la science. Tout de suite.", en: "I slipped on a bus-sized fatberg and fell in, mouth open. I got every disease in the curriculum at once. The doctor asked if I'd like to donate my body to science. Right now." }, fx: { health: -20, disease: 'gastro', looks: -6, visual: 'poop' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Pêcher avec un aimant', en: 'Fish with a magnet' }, text: { fr: "J'ai pêché à l'aimant pendant deux heures. J'ai remonté une trottinette électrique, un caddie miniature et une grenade de 1944. Les démineurs ont bouclé la rue. Mon téléphone est toujours en bas.", en: "I magnet-fished for two hours. I pulled up an e-scooter, a mini shopping cart and a 1944 grenade. The bomb squad closed the street. My phone is still down there." }, fx: { happy: 4, fame: 2, visual: 'police' } },
      { label: { fr: 'Faire mon deuil', en: 'Let it go' }, text: { fr: "J'ai dit adieu. Quelque part sous la ville, un rat porte désormais ce que j'ai perdu. Il a probablement une meilleure vie que moi.", en: "I said goodbye. Somewhere under the city, a rat now has what I lost. He probably has a better life than me." }, fx: { happy: -6, money: -300 } },
    ],
  },

  // ── Diarrhée explosive au mariage ──
  {
    id: 'dk_wedding_diarrhea',
    icon: '💩',
    cat: 'dark',
    rating: 2,
    actor: 'anyFriend',
    scene: { place: 'party', mood: 'sick', prop: 'cake', fx: 'poop' },
    when: { age: [18, 80] },
    weight: 5,
    once: true,
    text: {
      fr: ["Mariage de {a.first}. Tu es témoin. Les huîtres de midi étaient tièdes. Au moment où le maire demande « Si quelqu'un s'oppose à ce mariage… », ton intestin s'oppose. Fort.", "Tu dois faire le discours de témoin au mariage de {a.first}. Debout, micro en main, devant 200 invités. Ton ventre fait un bruit de baleine qui accouche. Le buffet de fruits de mer réclame sa liberté."],
      en: ["{a.first}'s wedding. You're in the wedding party. The lunch oysters were lukewarm. Right when the officiant asks 'If anyone objects to this marriage...', your bowels object. Loudly.", "You're giving the toast at {a.first}'s wedding. Standing, mic in hand, in front of 200 guests. Your stomach makes the sound of a whale giving birth. The seafood buffet demands its freedom."],
    },
    choices: [
      {
        label: { fr: 'Serrer les fesses', en: 'Clench and push through' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: "J'ai serré les fesses avec la force d'un dieu grec et fini mon discours, en sueur, la voix tremblante. Tout le monde a cru que j'étais ému{|e}. J'ai fait pleurer la mariée. Puis j'ai couru.", en: "I clenched with the strength of a Greek god and finished the toast, sweating, voice trembling. Everyone thought I was emotional. I made the bride cry. Then I ran." }, fx: { happy: 6, rel: 15, discipline: 4 }, mood: 'proud' },
          { w: 2, text: { fr: "Je n'ai pas tenu. Ça s'est produit en plein « Je vous souhaite tout le bonheur du monde ». Le micro a tout capté. La robe de la demoiselle d'honneur aussi. Le photographe n'a pas arrêté de shooter. La vidéo passe à chaque anniversaire de mariage.", en: "I didn't make it. It happened right at 'I wish you all the happiness in the world'. The mic caught everything. So did the bridesmaid's dress. The photographer never stopped shooting. The video plays at every anniversary." }, fx: { happy: -20, looks: -6, rel: -20, fame: 3, visual: 'poop' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Courir vers les toilettes', en: 'Sprint to the bathroom' }, text: { fr: "J'ai lâché le micro et sprinté. Les toilettes étaient occupées par la grand-mère de la mariée. J'ai fini dans le jardin, derrière la fontaine à champagne. Personne ne boit plus de champagne dans cette famille.", en: "I dropped the mic and sprinted. The bathroom was occupied by the bride's grandma. I ended up in the garden, behind the champagne fountain. Nobody in that family drinks champagne anymore." }, fx: { happy: -12, rel: -8, disease: 'food_poisoning', visual: 'poop' }, mood: 'sick' },
      { label: { fr: 'Accuser le marié', en: 'Blame the groom' }, text: { fr: "Quand l'odeur a atteint le premier rang, j'ai regardé le marié avec une déception théâtrale. 200 têtes se sont tournées vers lui. Il a passé sa nuit de noces à se justifier. Je suis un monstre et un génie.", en: "When the smell reached the front row, I looked at the groom with theatrical disappointment. 200 heads turned to him. He spent his wedding night explaining himself. I'm a monster and a genius." }, fx: { happy: 8, karma: -8, rel: -5 }, mood: 'happy' },
    ],
  },

  // ── Ligne journal : gross-out ──
  {
    id: 'dk_auto_gross',
    icon: '🤢',
    cat: 'dark',
    rating: 2,
    auto: true,
    scene: { place: 'home', mood: 'sick', fx: 'poop' },
    when: { age: [18, 95] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["J'ai trouvé un yaourt périmé depuis 2021 au fond du frigo. Il était devenu une civilisation. Je l'ai mangé quand même, en m'excusant auprès de ses habitants.", "J'ai débouché la douche. J'ai sorti une boule de cheveux de la taille d'un chat. Je l'ai appelée Gérard et posée sur le rebord pour sécher. Mon coloc a déménagé."],
      en: ["I found a yogurt expired since 2021 in the back of the fridge. It had become a civilization. I ate it anyway, apologizing to its inhabitants.", "I unclogged the shower. I pulled out a hairball the size of a cat. I named it Gerald and left it on the ledge to dry. My roommate moved out."],
    },
    fx: { happy: -2, health: -1, visual: 'poop' },
  },
];
