// Milestone events: triggered by the engine (scheduled) or always-on priority events.
import type { EventDef } from '@bl/sim';

export const milestoneEvents: EventDef[] = [
  {
    id: 'edu_after_high',
    icon: '🎓',
    cat: 'milestone',
    chainOnly: true,
    scene: { place: 'school', mood: 'proud', prop: 'diploma' },
    text: {
      fr: [
        "Le diplôme en poche, le monde t'ouvre les bras. Ou du moins, il entrouvre une fenêtre. Et maintenant ?",
        "Fini le lycée ! Ta mère pleure, ton père fait semblant que non. Quelle est la suite ?",
        "Diplômé{|e} ! Ton conseiller d'orientation t'a suggéré de devenir {w:weird_job}. Ta famille a d'autres idées. Toi, tu hésites. Et maintenant ?",
        "Le lycée, c'est fini. Ta photo de classe est ratée, tu as fait {w:sound} en recevant ton diplôme et tout le monde a ri. Bref : une page se tourne. Que fais-tu maintenant ?",
        "Ça y est, tu as ton diplôme. Ta tante te demande déjà « ce que tu vas faire de ta vie » en mangeant {w:food}. Bonne question. [[Vraiment|Franchement|Sincèrement]] bonne question.",
      ],
      en: [
        "Diploma in hand, the world opens its arms. Or at least cracks a window. What now?",
        "High school is over! Your mom is crying, your dad pretends he isn't. What's next?",
        "Graduated! Your guidance counselor suggested you become {w:weird_job}. Your family has other ideas. You're torn. What now?",
        "High school is done. Your class photo is a disaster, you made {w:sound} when you got your diploma and everyone laughed. Anyway, a chapter closes. What now?",
        "That's it, you've graduated. Your aunt is already asking 'what you're doing with your life' while eating {w:food}. Good question. [[Really|Honestly|Genuinely]] good question.",
      ],
    },
    choices: [
      { label: { fr: 'Aller à l\'université', en: 'Go to university' }, text: { fr: ["J'ai décidé de continuer mes études.", "J'ai choisi la fac. Encore quelques années à repousser le monde du travail."], en: ["I decided to keep studying.", "I chose college. A few more years of putting off the working world."] }, fx: { open: 'university' } },
      { label: { fr: 'Chercher un travail', en: 'Look for a job' }, text: { fr: ["Je suis parti{|e} à la conquête du marché du travail.", "J'ai imprimé vingt CV et je suis parti{|e} chercher du boulot, plein{|e} d'espoir."], en: ["I set off to conquer the job market.", "I printed twenty résumés and went job hunting, full of hope."] }, fx: { open: 'jobs' } },
      {
        label: { fr: 'Prendre une année sabbatique', en: 'Take a gap year' },
        out: [
          { w: 3, text: { fr: ["J'ai pris une année sabbatique. J'ai vu des choses. Surtout mon plafond, mais quand même.", "Année sabbatique : j'ai découvert {w:hobby}, regardé tout {w:show} et dormi jusqu'à midi. Une année de recherche intérieure, très intérieure."], en: ["I took a gap year. I saw things. Mostly my ceiling, but still.", "Gap year: I discovered {w:hobby}, binged all of {w:show} and slept till noon. A year of soul-searching, very indoor soul-searching."] }, fx: { happy: 8, flag: 'gap_year' } },
          { w: 1, text: { fr: ["Année sabbatique en sac à dos : je suis revenu{|e} transformé{|e}, bronzé{|e} et fauché{|e}.", "J'ai passé mon année sabbatique {w:far_place}. Je suis revenu{|e} avec un tatouage dont je ne connais pas la signification et une nouvelle façon de dire bonjour."], en: ["A backpacking gap year: I came back transformed, tanned and broke.", "I spent my gap year {w:far_place}. I came back with a tattoo I don't know the meaning of and a new way of saying hello."] }, fx: { happy: 14, smarts: 3, money: -800, flag: 'gap_year' } },
        ],
      },
    ],
  },
  {
    id: 'edu_after_uni',
    icon: '🎓',
    cat: 'milestone',
    chainOnly: true,
    scene: { place: 'uni', mood: 'proud', prop: 'diploma' },
    text: {
      fr: [
        "Toque lancée en l'air, photo floue, diplôme encadré. Le monde du travail t'attend. Que fais-tu ?",
        "Diplômé{|e} ! Ta famille a fait [[deux|cinq|huit]] heures de route pour te voir défiler sur une estrade pendant onze secondes. Et maintenant ?",
        "Fin de la fac. Ta toque a atterri sur {w:animal} qui passait par là. Tu as un diplôme, un prêt étudiant et une vague idée de ce que tu veux faire. Que fais-tu ?",
        "Remise des diplômes. Le discours était donné par {w:celeb}, qui a confondu ton université avec une autre. Bref, tu es diplômé{|e}. La suite ?",
        "Ton diplôme est enfin là, encadré, posé contre {w:object}. Ta mère l'a déjà montré à tout l'immeuble. Le monde du travail, lui, ne sait pas encore que tu existes. Que fais-tu ?",
      ],
      en: [
        "Cap tossed, blurry photo, diploma framed. The working world awaits. What do you do?",
        "You graduated! Your family drove [[two|five|eight]] hours to watch you cross a stage for eleven seconds. What now?",
        "College is over. Your cap landed on {w:animal} that happened to wander by. You have a degree, a student loan and a vague idea of what you want. What do you do?",
        "Graduation day. The commencement speech was given by {w:celeb}, who mixed up your university with another one. Anyway, you've graduated. What's next?",
        "Your diploma is finally here, framed, propped against {w:object}. Your mom has already shown it to the entire building. The working world, meanwhile, doesn't know you exist yet. What do you do?",
      ],
    },
    choices: [
      { label: { fr: 'Chercher un emploi', en: 'Find a job' }, text: { fr: ["J'ai peaufiné mon CV et j'ai commencé à postuler.", "J'ai mis mon plus beau costume et je me suis lancé{|e} dans la chasse à l'emploi."], en: ["I polished my résumé and started applying.", "I put on my best outfit and threw myself into the job hunt."] }, fx: { open: 'jobs' } },
      { label: { fr: 'Continuer : études supérieures', en: 'Keep going: graduate school' }, text: { fr: ["Encore quelques années d'études ? Pourquoi pas.", "J'ai rempilé pour des études supérieures. Le monde du travail attendra."], en: ["A few more years of school? Why not.", "I signed up for grad school. The working world can wait."] }, fx: { open: 'grad' } },
      { label: { fr: 'Fêter ça pendant un an', en: 'Party for a year' }, text: { fr: ["J'ai fêté mon diplôme. Longtemps. Très longtemps.", "J'ai fêté mon diplôme {w:far_place}, puis ailleurs, puis encore ailleurs. Mes parents m'ont demandé quand je rentrais. Bonne question."], en: ["I celebrated my degree. For a long time. A very long time.", "I celebrated my degree {w:far_place}, then somewhere else, then somewhere else again. My parents asked when I was coming home. Good question."] }, fx: { happy: 10, health: -3 } },
    ],
  },
  {
    id: 'adult_18',
    icon: '🔞',
    cat: 'milestone',
    priority: true,
    once: true,
    when: { age: [18, 18] },
    scene: { place: 'home', mood: 'party', prop: 'cake' },
    text: {
      fr: [
        "18 ans ! Tu es officiellement adulte. Tes parents te regardent comme si tu allais tout casser.",
        "Joyeux 18e anniversaire ! Le droit de vote, les impôts, la liberté. Comment fêtes-tu ça ?",
        "18 ans aujourd'hui. Ton cadeau : {w:gift}, et un discours de ton père sur « les responsabilités ». Il a duré [[vingt minutes|une heure|le temps d'un film]]. Comment fêtes-tu ta majorité ?",
        "Majeur{|e} ! Tu peux désormais signer tes propres mots d'absence, louer {w:vehicle} et te faire arnaquer légalement. Ta mère a déjà pleuré deux fois. Comment marques-tu le coup ?",
        "Le jour de tes 18 ans, {w:exclaim} Ta grand-mère t'offre une enveloppe et un conseil : « Ne fais pas comme ton oncle. » Personne ne t'a jamais dit ce qu'avait fait ton oncle. Comment fêtes-tu ça ?",
      ],
      en: [
        "18! You're officially an adult. Your parents look at you like you're about to break everything.",
        "Happy 18th birthday! The right to vote, taxes, freedom. How do you celebrate?",
        "18 today. Your present: {w:gift}, plus a speech from your dad about 'responsibilities'. It lasted [[twenty minutes|an hour|a whole movie]]. How do you celebrate becoming an adult?",
        "You're 18! You can now sign your own sick notes, rent {w:vehicle} and get scammed legally. Your mom has already cried twice. How do you mark the occasion?",
        "On your 18th birthday, {w:exclaim} Grandma hands you an envelope and some advice: 'Don't do what your uncle did.' Nobody has ever told you what your uncle did. How do you celebrate?",
      ],
    },
    choices: [
      { label: { fr: 'Grosse fête avec les amis', en: 'Big party with friends' }, out: [
        { w: 3, text: { fr: ["Meilleure soirée de ma vie. Les voisins, moins.", "Soirée mythique : [[quarante|soixante|cent]] personnes, dont la moitié que je ne connaissais pas. Quelqu'un a apporté {w:animal}. On en parle encore."], en: ["Best night of my life. The neighbors disagree.", "Legendary party: [[forty|sixty|a hundred]] people, half of whom I didn't know. Someone brought {w:animal}. People still talk about it."] }, fx: { happy: 12 } },
        { w: 1, text: { fr: ["La fête a dégénéré, la police est passée. Mon père n'a pas apprécié.", "La fête a dérapé : quelqu'un a jeté {w:object} par la fenêtre et les voisins ont appelé la police. Mon père a dû venir me chercher en pyjama."], en: ["The party got out of hand, the police showed up. My dad was not amused.", "The party went sideways: someone threw {w:object} out the window and the neighbors called the cops. My dad had to come pick me up in his pajamas."] }, fx: { happy: 4, karma: -2 } },
      ] },
      { label: { fr: 'Dîner tranquille en famille', en: 'Quiet family dinner' }, text: { fr: ["Un dîner en famille, avec un gâteau un peu raté. Parfait.", "Dîner tranquille en famille. Ma mère a sorti les photos de moi bébé, mon père a fait sa blague habituelle. On a mangé {w:food}. C'était doux."], en: ["A family dinner with a slightly failed cake. Perfect.", "Quiet family dinner. Mom brought out my baby photos, Dad told his usual joke. We had {w:food}. It was sweet."] }, fx: { happy: 6, karma: 2 } },
      { label: { fr: 'Prendre le large : quitter la maison', en: 'Fly the nest: move out' }, out: [
        { w: 1, text: { fr: ["J'ai fait mes cartons et j'ai pris un petit appart. Liberté ! (Et factures.)", "J'ai quitté la maison avec trois cartons et {w:object}. Mon premier appart fait [[12|15|18]] m². Je l'adore. Le frigo est vide, mais c'est MON frigo vide."], en: ["I packed up and got a tiny apartment. Freedom! (And bills.)", "I left home with three boxes and {w:object}. My first apartment is [[130|160|190]] square feet. I love it. The fridge is empty, but it's MY empty fridge."] }, fx: { happy: 10, moveOut: true }, mood: 'proud' },
      ] },
    ],
  },
  {
    id: 'retire_offer',
    icon: '🏖️',
    cat: 'milestone',
    once: true,
    priority: true,
    when: { age: [65, 70], job: true },
    scene: { place: 'office', mood: 'happy' },
    text: {
      fr: [
        "{employer} t'offre un pot de départ et une jolie montre si tu prends ta retraite. Alors ?",
        "Ton patron chez {employer} t'a convoqué{|e} avec un grand sourire et {w:gift} emballé. « On pensait que tu aimerais profiter de ta retraite. » C'est une question ou un ordre ?",
        "Les RH de {employer} te proposent la retraite, avec pot de départ, discours et {w:food} pour tout le monde. Tes collègues ont déjà acheté la carte. Tu restes ou tu pars ?",
        "À {age} ans, tu reçois un mail de {employer} : « Avez-vous pensé à la retraite ? » En pièce jointe, une brochure « Découvrir {w:hobby} après 65 ans » et un bon pour une montre. Alors ?",
        "{employer} veut fêter ton départ à la retraite. Il y aura un gâteau, une montre et un collègue qui chantera {w:song}. Ou alors tu restes, et personne ne chante. Ton choix ?",
      ],
      en: [
        "{employer} offers you a farewell party and a nice watch if you retire. So?",
        "Your boss at {employer} called you in with a big smile and a wrapped present: {w:gift}. 'We thought you might enjoy retirement.' Is that a question or an order?",
        "HR at {employer} is offering you retirement: farewell drinks, speeches and {w:food} for everyone. Your coworkers already bought the card. Stay or go?",
        "At {age}, you get an email from {employer}: 'Have you considered retirement?' Attached: a brochure titled 'Discover {w:hobby} After 65' and a voucher for a watch. So?",
        "{employer} wants to throw you a retirement party. There'll be cake, a watch, and a coworker singing {w:song}. Or you stay, and nobody sings. Your call?",
      ],
    },
    choices: [
      { label: { fr: 'Prendre ma retraite', en: 'Retire' }, text: { fr: ["J'ai rendu mon badge. Place aux siestes.", "J'ai pris ma retraite. Mon premier lundi de libre, j'ai dormi jusqu'à [[10 h|midi|14 h]] et je n'ai pas culpabilisé une seconde."], en: ["I handed in my badge. Nap time begins.", "I retired. My first free Monday, I slept until [[10|noon|2 p.m.]] and didn't feel guilty for a second."] }, fx: { happy: 10, retire: true } },
      { label: { fr: 'Continuer à bosser', en: 'Keep working' }, text: { fr: ["La retraite ? Jamais. On me sortira du bureau les pieds devant.", "J'ai refusé la montre. J'ai encore des choses à faire, et surtout des collègues à agacer."], en: ["Retire? Never. They'll carry me out of the office.", "I turned down the watch. I still have things to do, and coworkers to annoy."] }, fx: { discipline: 3 } },
    ],
  },
];
